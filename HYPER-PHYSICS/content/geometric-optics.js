/* HYPER-PHYSICS · content/geometric-optics.js — light as rays: reflection, refraction,
 * mirrors, lenses and the instruments built from them.
 *
 * Sign convention used throughout (mirrors and lenses): "real is positive".
 *   d_o > 0 for a real object; d_i > 0 for a real image (in front of a mirror, behind a lens),
 *   d_i < 0 for a virtual image; f > 0 for converging lenses and concave mirrors, f < 0 for
 *   diverging lenses and convex mirrors; m = −d_i/d_o, positive = upright.
 *   Lens surfaces (light travelling left to right): R > 0 when the centre of curvature lies
 *   on the outgoing (right-hand) side. */
Hyper.add(

{
  id: 'reflection', parent: 'geometric-optics', title: 'Reflection', level: 1,
  short: 'Light bouncing off a surface: on a smooth surface the angle of reflection equals the angle of incidence, both measured from the normal.',
  keywords: ['reflection', 'law of reflection', 'angle of incidence', 'angle of reflection', 'normal', 'specular', 'diffuse', 'mirror', 'reflectance', 'Fermat', 'ray'],
  prereq: ['math:angles', 'em-spectrum'],
  related: ['plane-mirrors', 'refraction', 'wave-reflection', 'brewsters-angle'],
  body: `
Almost everything you see, you see by reflected light: the page, the room, the Moon. Only a few things — the Sun, a lamp, a screen — make their own.

### Rays
When light meets objects much larger than its wavelength (400–700 nm for visible light), it travels in straight lines through any uniform material, and we can follow it as **rays**: lines along which the energy flows, always perpendicular to the wavefronts. That is the whole of **geometric optics**. When openings shrink to a few wavelengths the ray picture fails and [[huygens-principle|wave optics]] takes over.

### The law of reflection
Draw the **normal**, the line perpendicular to the surface where the ray strikes it. Then

$$\\theta_r = \\theta_i$$

— the angle of reflection equals the angle of incidence, **both measured from the normal**, and the incident ray, the normal and the reflected ray all lie in one plane (the *plane of incidence*). The ray is turned through $180° - 2\\theta_i$: a ray hitting head-on comes straight back, a grazing ray is barely deflected.

### Smooth and rough
A mirror or a still pond gives **specular** reflection: a parallel beam stays parallel and you see an image. Paper, paint and skin give **diffuse** reflection. Each microscopic patch still obeys the law, but the patches face every which way, so the light is scattered in all directions. That is why you can read this page from any angle but see your face only in a mirror. A surface counts as smooth when its bumps are much smaller than the wavelength — a wet road is a mirror, a dry one is not.

### How much is reflected?
Every boundary between two transparent materials reflects part of the light. Head-on, the fraction depends only on the two [[refraction|refractive indices]]:

$$R = \\left(\\frac{n_1 - n_2}{n_1 + n_2}\\right)^2$$

Glass in air reflects 4% at each surface, water 2%, diamond 17%. At grazing angles almost everything reflects, which is why a lake mirrors the far shore so well. Metals are different: their free electrons re-radiate nearly all the light, so polished silver reflects about 95% and aluminium about 90%.

### Why equal angles?
Of all the paths from a point A to the mirror and on to a point B, the one light takes is the **shortest** (and so the quickest). Reflect B in the mirror to B′: every path A → mirror → B has the same length as the straight line A → mirror → B′, which is shortest when it is straight, and a straight line crosses the mirror at equal angles. This *principle of least time* also gives [[refraction]].

> [!key] Measure every angle in optics from the normal, not from the surface.
`,
  ideas: [
    'In a uniform material light travels in straight lines, so it can be followed as rays.',
    'The angle of reflection equals the angle of incidence, both measured from the normal.',
    'Rough surfaces scatter light in all directions because each tiny patch has its own normal.',
    'Every boundary reflects some light: about 4% for glass in air, much more at grazing angles.'
  ],
  pitfalls: [
    'Angles are measured from the surface — They are measured from the normal. A ray striking a mirror at 30° to its surface has an angle of incidence of 60°.',
    'Rough surfaces break the law of reflection — Every tiny patch obeys it; the patches simply face in different directions, so the reflected light spreads out.',
    'Clear glass only transmits light — Each surface reflects about 4%, which is why a window turns into a mirror at night when the room is brighter than the outside.'
  ],
  formulas: [
    {
      name: 'Deviation of a reflected ray',
      expr: 'delta = pi - 2*theta', tex: '\\delta = 180° - 2\\theta_i',
      vars: {
        delta: { name: 'angle the ray is turned through', q: 'angle', unit: '°', tex: '\\delta', min: 0, max: 180 },
        theta: { name: 'angle of incidence (from the normal)', q: 'angle', unit: '°', value: 60, min: 0, max: 90, tex: '\\theta_i' }
      },
      note: 'A head-on ray ($\\theta_i = 0$) is sent straight back; a grazing ray ($\\theta_i \\to 90°$) is hardly turned at all.',
      stories: { delta: 'A laser beam strikes a mirror at an angle of incidence of {theta}. Through what angle is the beam turned?', theta: 'A mirror must turn a beam through {delta}. What angle of incidence does the beam need?' }
    },
    {
      name: 'Reflectance at normal incidence',
      expr: 'R = ((n1 - n2)/(n1 + n2))^2', tex: 'R = \\left(\\frac{n_1 - n_2}{n_1 + n_2}\\right)^2',
      vars: {
        R: { name: 'fraction of the light reflected', q: 'ratio', unit: '%' },
        n1: { name: 'refractive index of the first medium', value: 1.00, tex: 'n_1' },
        n2: { name: 'refractive index of the second medium', value: 1.50, min: 1, max: 4, tex: 'n_2' }
      },
      note: 'For light arriving along the normal. The same fraction reflects whichever side the light comes from.',
      practice: { unknowns: ['R'] },
      stories: { R: 'Light in a medium of index {n1} meets a surface of index {n2} head-on. What fraction is reflected?' }
    }
  ],
  examples: [
    {
      title: 'Angles from the normal',
      q: 'A ray strikes a flat mirror making an angle of 25° with the mirror\'s surface. What is the angle of reflection, and through what angle is the ray turned?',
      steps: [
        'The angle of incidence is measured from the normal: $\\theta_i = 90° - 25° = 65°$.',
        'The law of reflection gives $\\theta_r = \\theta_i = 65°$ (also 25° from the surface on the other side).',
        'The deviation is $180° - 2 \\times 65° = 50°$.'
      ],
      a: 'Angle of reflection 65°; the ray is turned through 50°.'
    },
    {
      title: 'A window at night',
      q: 'A window pane of glass ($n = 1.5$) has two surfaces. At night the room is lit at 300 lux and the garden at 3 lux. Why do you see your reflection rather than the garden?',
      steps: [
        'Each surface reflects $R = \\left(\\frac{1 - 1.5}{1 + 1.5}\\right)^2 = 0.04$, so the pane reflects about 8% of the room light back at you.',
        'Your reflection therefore looks like a scene lit at roughly $0.08 \\times 300 = 24$ lux.',
        'The garden sends about 92% of its light through: roughly $0.92 \\times 3 \\approx 3$ lux.',
        'The reflection is about eight times brighter than the view, so it dominates. In daylight the ratio reverses.'
      ],
      a: 'Both surfaces reflect about 4% each; with the room 100 times brighter than outside, the reflection wins.'
    }
  ],
  quiz: [
    { q: 'A ray hits a mirror at 30° to its surface. What is the angle of reflection (measured as usual)?', choices: ['30°', '60°', '90°', '120°'], a: 1,
      why: 'Angles are measured from the normal. The ray is 30° from the surface, so 60° from the normal, and it leaves at 60° on the other side.' },
    { q: 'You can read a sheet of paper from almost any angle, but you cannot see your face in it. Why?', choices: ['Paper absorbs most light', 'Paper reflects diffusely: its rough surface scatters light in all directions', 'Paper does not obey the law of reflection', 'Paper transmits the light instead'], a: 1,
      why: 'Every fibre obeys the law of reflection, but they point in all directions, so light from any one point of your face ends up spread everywhere instead of forming an image.' },
    { q: 'Which surface reflects the largest fraction of light arriving head-on from air?', choices: ['Water (n = 1.33)', 'Crown glass (n = 1.52)', 'Diamond (n = 2.42)', 'They all reflect about 4%'], a: 2,
      why: '$R = ((n-1)/(n+1))^2$ grows with the index mismatch: about 2% for water, 4% for glass and 17% for diamond — part of the reason diamonds sparkle.' },
    { q: 'On a rough surface the law of reflection no longer holds.', a: false,
      why: 'It holds at every microscopic patch. The reflected light spreads because the patches have different normals, not because the law fails.' },
    { q: 'You look at a calm lake. The reflection of the far shore is brightest when you look…', choices: ['straight down', 'at a steep angle', 'at a grazing angle, almost along the surface', 'the brightness does not depend on the angle'], a: 2,
      why: 'Reflectance rises steeply towards grazing incidence: water reflects about 2% head-on but most of the light at grazing angles.' }
  ],
  applications: [
    'Corner-cube retroreflectors in bicycle reflectors, road signs and the arrays left on the Moon for laser ranging.',
    'Matte screens and anti-glare finishes, which rely on diffuse reflection.',
    'Solar concentrators and light pipes that steer daylight into buildings.'
  ],
  history: 'The equal-angle law was known to Euclid. Hero of Alexandria explained it in the first century as light taking the shortest path, an idea Pierre de Fermat generalised in 1662 to the principle of least time.',
  sim: 'light-interface'
},

{
  id: 'plane-mirrors', parent: 'geometric-optics', title: 'Plane mirrors', level: 1,
  short: 'A flat mirror makes an upright, same-size virtual image exactly as far behind the mirror as the object is in front of it.',
  keywords: ['plane mirror', 'flat mirror', 'virtual image', 'image distance', 'lateral inversion', 'mirror writing', 'full-length mirror', 'multiple images', 'kaleidoscope', 'optical lever', 'periscope'],
  prereq: ['reflection', 'math:similar-triangles'],
  related: ['spherical-mirrors', 'magnification'],
  body: `
Rays leave every point of an object in all directions. Those that strike a flat mirror bounce off by the [[reflection|law of reflection]] and reach your eye **as if they had come from a point behind the glass**. Your eye and brain cannot tell the difference, so you see an **image** there.

### Where the image is
Follow two rays from a point P to the mirror. Extended backwards, the reflected rays meet at P′, on the normal through P and **exactly as far behind the mirror as P is in front**. Every point of the object maps this way, so the image is:

- **virtual** — no light actually passes through it; a screen placed there shows nothing,
- **upright** and the **same size** (magnification $+1$),
- **reversed front-to-back**.

That last point is the famous "left–right swap". A mirror really reverses the direction perpendicular to its surface: your nose points north, your image's nose points south. We call it a left–right swap because we imagine turning round to face ourselves.

### How tall a mirror do you need?
Light from your feet reaches your eyes by reflecting off the mirror halfway between them in height, and light from the top of your head likewise. So a mirror **half your height** shows all of you, whatever your distance from it — step back and the image shrinks in exactly the same proportion as everything else.

### Two mirrors
Two mirrors at an angle $\\alpha$ make images of images. When $360°/\\alpha$ is an even whole number the count is

$$N = \\frac{360°}{\\alpha} - 1$$

— three images at 90°, five at 60° (the kaleidoscope), and endlessly many between parallel mirrors, each dimmer than the last. Three mutually perpendicular mirrors form a **corner cube**, which sends any ray straight back where it came from.

### The optical lever
Turn a mirror through a small angle $\\alpha$ and the reflected beam turns through $2\\alpha$, because the normal turns by $\\alpha$ and both the incidence and the reflection angle change. A light spot on a scale a distance $D$ away moves by $D\\tan 2\\alpha$. Old mirror galvanometers measured tiny currents this way, and atomic force microscopes still sense the bending of their tip by a laser reflected off it.

> [!tip] Open the mirror simulation and choose *Plane*: the three rays from the object tip all appear to come from one point behind the mirror.
`,
  ideas: [
    'The image in a plane mirror is virtual, upright, the same size, and as far behind the mirror as the object is in front.',
    'A mirror reverses front and back; the apparent left–right swap is how we interpret that.',
    'A mirror half your height shows your whole body, at any distance.',
    'Turning a mirror by an angle α turns the reflected ray by 2α.'
  ],
  pitfalls: [
    'The image is on the surface of the mirror — It is as far behind the mirror as the object is in front; your eyes focus at that distance, not on the glass.',
    'Stepping back lets you see more of yourself — The fraction you can see in a given mirror does not depend on your distance from it.',
    'A virtual image can be caught on a screen — No light passes through a virtual image; it only exists as the point the rays seem to come from.'
  ],
  formulas: [
    {
      name: 'Optical lever',
      expr: 'x = D*tan(2*alpha)', tex: 'x = D \\tan 2\\alpha',
      vars: {
        x: { name: 'movement of the light spot', q: 'length', unit: 'mm' },
        D: { name: 'distance from mirror to scale', q: 'length', unit: 'm', value: 1.5 },
        alpha: { name: 'angle the mirror turns', q: 'angle', unit: '°', value: 0.5, min: 0, max: 44 }
      },
      note: 'The beam turns through twice the mirror\'s angle. For small angles $x \\approx 2D\\alpha$ with $\\alpha$ in radians.',
      stories: { x: 'A mirror galvanometer\'s mirror turns by {alpha}. How far does the light spot move on a scale {D} away?', alpha: 'A light spot moves {x} along a scale {D} from a mirror. Through what angle did the mirror turn?' }
    },
    {
      name: 'Images between two mirrors',
      expr: 'N = 2*pi/alpha - 1', tex: 'N = \\frac{360°}{\\alpha} - 1',
      vars: {
        N: { name: 'number of images', q: 'count', int: true },
        alpha: { name: 'angle between the mirrors', q: 'angle', unit: '°', value: 60, min: 1, max: 180 }
      },
      note: 'Exact when $360°/\\alpha$ is an even whole number; for other angles the count depends on where the object stands.',
      practice: { unknowns: ['alpha'] },
      stories: { N: 'Two mirrors meet at {alpha}. How many images of a coin placed between them do you see?', alpha: 'A kaleidoscope shows {N} images of each bead. What is the angle between its mirrors?' }
    },
    {
      name: 'Shortest full-length mirror',
      expr: 'L = H/2',
      vars: {
        L: { name: 'mirror height needed', q: 'length', unit: 'm' },
        H: { name: 'your height', q: 'length', unit: 'm', value: 1.8 }
      },
      note: 'Independent of how far you stand from the mirror. Its top edge must be halfway between your eyes and the top of your head.'
    }
  ],
  examples: [
    {
      title: 'A full-length mirror',
      q: 'A person 1.80 m tall has eyes 10 cm below the top of her head. What is the shortest wall mirror in which she can see all of herself, and where must it hang?',
      steps: [
        'Light from her feet reaches her eyes by reflecting at half her eye height: $1.70/2 = 0.85\\ \\mathrm{m}$ above the floor. That is the bottom edge.',
        'Light from the top of her head reflects halfway between head and eyes: $1.70 + 0.05 = 1.75\\ \\mathrm{m}$. That is the top edge.',
        'Mirror height: $1.75 - 0.85 = 0.90\\ \\mathrm{m}$ — exactly half her height. Her distance from the wall never entered the calculation.'
      ],
      a: '0.90 m, hung with its bottom edge 0.85 m above the floor.'
    },
    {
      title: 'Reading a mirror galvanometer',
      q: 'The mirror of a galvanometer turns by 0.50° when a current flows. How far does the reflected spot move on a scale 1.5 m away?',
      steps: [
        'The reflected beam turns through $2 \\times 0.50° = 1.0°$.',
        '$x = D\\tan 2\\alpha = 1.5 \\times \\tan 1.0° = 1.5 \\times 0.01745 = 0.0262\\ \\mathrm{m}$.',
        'A turn too small to see by eye becomes a 26 mm movement of the spot.'
      ],
      a: 'About 26 mm.'
    }
  ],
  quiz: [
    { q: 'You walk towards a plane mirror at 1 m/s. How fast does your image approach you?', choices: ['0.5 m/s', '1 m/s', '2 m/s', 'It does not move'], a: 2,
      why: 'The image moves towards the mirror at 1 m/s from the other side while you move at 1 m/s, so the gap between you closes at 2 m/s.' },
    { q: 'You stand 2 m from a small mirror and see yourself from the waist up. You step back to 4 m. Now you see…', choices: ['more of yourself', 'less of yourself', 'the same part of yourself, smaller', 'only your face'], a: 2,
      why: 'The geometry scales with distance: the part of the body reflected into your eyes stays the same. The image just looks smaller because it is farther away.' },
    { q: 'How many images do you see of an object between two mirrors at 90°?', choices: ['2', '3', '4', 'Infinitely many'], a: 1,
      why: '$360°/90° - 1 = 3$: one in each mirror and one formed by reflection in both.' },
    { q: 'A screen placed where a plane-mirror image appears shows a faint copy of the image.', a: false,
      why: 'The image is virtual: the reflected rays only seem to come from it. No light reaches the space behind the mirror.' }
  ],
  applications: [
    'Periscopes, which use two parallel mirrors (or prisms) to see over obstacles.',
    'Kaleidoscopes and the endless reflections of mirror mazes.',
    'Retroreflectors on bicycles, road signs and the Moon.',
    'Optical levers in galvanometers and atomic force microscopes.'
  ],
  sim: { id: 'light-mirror', params: { type: 'plane' } }
},

{
  id: 'spherical-mirrors', parent: 'geometric-optics', title: 'Spherical mirrors', level: 2,
  short: 'Curved mirrors focus light: a concave mirror forms real inverted images or magnified virtual ones, while a convex mirror always shows a small, upright, wide-angle view.',
  keywords: ['concave mirror', 'convex mirror', 'curved mirror', 'focal point', 'focal length', 'centre of curvature', 'mirror equation', 'ray diagram', 'real image', 'virtual image', 'parabolic mirror', 'spherical aberration'],
  prereq: ['plane-mirrors', 'reflection', 'math:circles'],
  related: ['thin-lenses', 'magnification', 'optical-instruments'],
  body: `
Cut a piece from a hollow sphere of radius $R$ and silver it. On the inside it is a **concave** mirror, on the outside a **convex** one. The line through the middle of the mirror and the sphere's centre $C$ is the **optical axis**.

### The focal point
Rays arriving parallel to the axis — from a distant star, say — reflect from a concave mirror and cross the axis at the **focal point** $F$, halfway between the mirror and $C$:

$$f = \\frac{R}{2}$$

From a convex mirror the same rays spread out as if they came from a focal point behind the mirror. The derivation below shows why it is half the radius — and why only *approximately*: rays far from the axis cross a little closer to the mirror. That blurring is **spherical aberration**. A **parabolic** mirror brings every parallel ray to exactly one point, which is why telescope mirrors are parabolic.

### Ray diagrams
Three rays from the tip of an object are easy to follow:

1. parallel to the axis → reflects through $F$ (convex: as if from $F$ behind the mirror),
2. through $F$ → reflects parallel to the axis (convex: aimed at $F$ behind),
3. through $C$ → strikes the mirror along the normal and comes straight back.

Where the reflected rays meet is the image; where their backward extensions meet is a virtual image.

### The mirror equation
Similar triangles in that diagram give, for rays close to the axis,

$$\\frac{1}{d_o} + \\frac{1}{d_i} = \\frac{1}{f}, \\qquad m = -\\frac{d_i}{d_o}$$

> [!note] **Sign convention (real is positive).** Distances to real objects and real images are positive — for a mirror, a real image is *in front*. Virtual images, behind the mirror, have negative $d_i$. $f > 0$ for concave, $f < 0$ for convex mirrors. A negative magnification means an inverted image. The same convention is used for [[thin-lenses|lenses]] in this app.

### What a concave mirror does
| Object position | Image |
|---|---|
| beyond $C$ | real, inverted, smaller, between $F$ and $C$ |
| at $C$ | real, inverted, same size, at $C$ |
| between $C$ and $F$ | real, inverted, larger, beyond $C$ |
| at $F$ | no image — the reflected rays are parallel |
| inside $F$ | virtual, upright, larger, behind the mirror |

The last row is the make-up or shaving mirror; the fourth, run backwards, is the torch and the headlamp: a bulb at $F$ makes a parallel beam. A convex mirror always gives a virtual, upright, reduced image squeezed between the mirror and $F$ — a wide view for car wing mirrors and shop security mirrors.

> [!tip] In the simulation, drag the object towards the mirror and watch the image run away to infinity as you cross $F$, then reappear behind the mirror.
`,
  ideas: [
    'A concave mirror focuses parallel rays at F, halfway between the mirror and the centre of curvature: f = R/2.',
    'The mirror equation 1/d_o + 1/d_i = 1/f locates the image; m = −d_i/d_o gives its size and orientation.',
    'In the real-is-positive convention, virtual images have negative d_i and convex mirrors have negative f.',
    'A concave mirror gives real inverted images unless the object is inside F; a convex mirror always gives small upright virtual images.'
  ],
  pitfalls: [
    'The focal point is at the centre of curvature — It is halfway between the mirror and C: f = R/2.',
    'A concave mirror always makes an inverted image — Not when the object is closer than F: then the image is virtual, upright and magnified, which is how a make-up mirror works.',
    'Dropping the signs — With the convention stated, one equation covers every case; forgetting that a convex mirror\'s f is negative puts the image on the wrong side.'
  ],
  derivation: {
    title: 'Why the focal length is half the radius',
    steps: [
      { text: 'A ray parallel to the axis at height $h$ strikes the mirror at P. The radius CP is the normal there; it makes an angle $\\theta$ with the axis, where', tex: '\\sin\\theta = \\frac{h}{R}' },
      { text: 'The reflected ray leaves at $\\theta$ on the other side of CP and crosses the axis at F. Angles alternate, so triangle CPF has two equal angles $\\theta$ and is isosceles: CF = PF.' },
      { text: 'The perpendicular from F to CP bisects it, so', tex: 'CF\\cos\\theta = \\frac{R}{2} \\;\\Rightarrow\\; CF = \\frac{R}{2\\cos\\theta}' },
      { text: 'The distance from the mirror to F is therefore', tex: 'f = R - \\frac{R}{2\\cos\\theta} \\approx \\frac{R}{2} \\quad (\\theta \\to 0)' },
      { text: 'For rays close to the axis (paraxial rays) $\\cos\\theta \\approx 1$ and every ray crosses at $R/2$. Rays farther out cross nearer the mirror: spherical aberration.' }
    ]
  },
  formulas: [
    {
      name: 'Focal length of a spherical mirror',
      expr: 'f = R/2',
      vars: {
        f: { name: 'focal length (+ concave, − convex)', q: 'length', unit: 'cm', signed: true },
        R: { name: 'radius of curvature (+ concave, − convex)', q: 'length', unit: 'cm', value: 40, signed: true }
      }
    },
    {
      name: 'Mirror equation',
      expr: '1/f = 1/d_o + 1/d_i', tex: '\\frac{1}{f} = \\frac{1}{d_o} + \\frac{1}{d_i}', solveFor: 'd_i',
      vars: {
        f: { name: 'focal length (+ concave, − convex)', q: 'length', unit: 'cm', value: 10, signed: true },
        d_o: { name: 'object distance', q: 'length', unit: 'cm', value: 30, tex: 'd_o' },
        d_i: { name: 'image distance (+ real, in front; − virtual, behind)', q: 'length', unit: 'cm', signed: true, tex: 'd_i' }
      },
      note: 'Real is positive: a negative $d_i$ is a virtual image behind the mirror.',
      stories: {
        d_i: 'An object stands {d_o} in front of a mirror of focal length {f}. Where is the image?',
        f: 'A mirror forms an image at {d_i} of an object placed {d_o} in front of it. What is its focal length?',
        d_o: 'Where must an object be placed in front of a mirror of focal length {f} for the image to form at {d_i}?'
      }
    },
    {
      name: 'Magnification of a mirror',
      expr: 'm = -d_i/d_o', tex: 'm = -\\frac{d_i}{d_o}',
      vars: {
        m: { name: 'magnification (− inverted)', q: 'ratio', signed: true },
        d_i: { name: 'image distance', q: 'length', unit: 'cm', value: 15, signed: true, tex: 'd_i' },
        d_o: { name: 'object distance', q: 'length', unit: 'cm', value: 30, tex: 'd_o' }
      }
    }
  ],
  examples: [
    {
      title: 'A shaving mirror',
      q: 'A concave shaving mirror has a radius of curvature of 40 cm. A man\'s face is 12 cm from it. Where is the image, and how is it magnified?',
      steps: [
        '$f = R/2 = +20\\ \\mathrm{cm}$ (concave, so positive).',
        '$\\dfrac{1}{d_i} = \\dfrac{1}{f} - \\dfrac{1}{d_o} = \\dfrac{1}{20} - \\dfrac{1}{12} = \\dfrac{3 - 5}{60} = -\\dfrac{1}{30}$, so $d_i = -30\\ \\mathrm{cm}$.',
        'Negative: a virtual image 30 cm behind the mirror.',
        '$m = -d_i/d_o = -(-30)/12 = +2.5$: upright and two and a half times life size.'
      ],
      a: 'A virtual, upright image 30 cm behind the mirror, magnified 2.5 times.'
    },
    {
      title: 'A car\'s wing mirror',
      q: 'A convex wing mirror has a radius of curvature of 2.0 m. A car is 20 m behind it. Where is its image and how large is it compared with the car?',
      steps: [
        'Convex, so $f = -R/2 = -1.0\\ \\mathrm{m}$.',
        '$\\dfrac{1}{d_i} = \\dfrac{1}{-1.0} - \\dfrac{1}{20} = -1.05\\ \\mathrm{m^{-1}}$, so $d_i = -0.952\\ \\mathrm{m}$ — virtual, just under a metre behind the mirror.',
        '$m = -d_i/d_o = 0.952/20 = +0.048$: upright and about 1/21 of the car\'s size.',
        'The image looks smaller than the car would in a flat mirror, so the brain judges it farther away — hence "objects in mirror are closer than they appear".'
      ],
      a: 'A virtual upright image 0.95 m behind the mirror, 0.048 times the size of the car.'
    }
  ],
  quiz: [
    { q: 'Where should the bulb of a torch sit in its concave reflector to produce a parallel beam?', choices: ['At the centre of curvature', 'At the focal point', 'Between the focal point and the mirror', 'Anywhere on the axis'], a: 1,
      why: 'Rays through F reflect parallel to the axis — the reverse of parallel rays converging on F.' },
    { q: 'The image of a real object in a convex mirror is always…', choices: ['real, inverted and smaller', 'virtual, upright and smaller', 'virtual, upright and larger', 'real, upright and smaller'], a: 1,
      why: 'With $f < 0$ and $d_o > 0$, the mirror equation always gives $-|f| < d_i < 0$ and $0 < m < 1$.' },
    { q: 'A concave mirror has a radius of curvature of 50 cm. An object is placed 25 cm in front of it. The image forms…', choices: ['at 25 cm, same size', 'at 50 cm, inverted', 'at infinity — the reflected rays are parallel', 'behind the mirror'], a: 2,
      why: 'f = R/2 = 25 cm, so the object is at the focal point and $1/d_i = 1/f - 1/d_o = 0$.' },
    { q: 'A concave mirror always forms an inverted image.', a: false,
      why: 'An object inside the focal point gives a virtual, upright, magnified image — the principle of a make-up mirror.' },
    { q: 'A concave mirror is moved from air into water. Its focal length…', choices: ['gets longer', 'gets shorter', 'stays the same', 'becomes negative'], a: 2,
      why: 'The law of reflection does not involve the refractive index, so a mirror\'s focal length depends only on its shape. (A glass lens, by contrast, weakens in water.)' }
  ],
  applications: [
    'Reflecting telescopes, from Newton\'s 1668 instrument to the 39 m Extremely Large Telescope.',
    'Headlamps, torches and satellite dishes, with the source or receiver at the focus.',
    'Make-up and dentists\' mirrors (concave, object inside F); wing mirrors and shop security mirrors (convex).',
    'Solar furnaces that concentrate sunlight to thousands of degrees.'
  ],
  sim: 'light-mirror'
},

{
  id: 'refraction', parent: 'geometric-optics', title: 'Refraction and Snell\'s law', level: 1,
  short: 'Light changes speed when it enters a new material and so changes direction; Snell\'s law, n₁ sin θ₁ = n₂ sin θ₂, says by how much.',
  keywords: ['refraction', 'Snell\'s law', 'refractive index', 'index of refraction', 'speed of light in a medium', 'bending of light', 'apparent depth', 'optical density', 'Fermat'],
  prereq: ['reflection', 'math:right-triangle-trig', 'wave-properties'],
  related: ['total-internal-reflection', 'huygens-principle', 'dispersion', 'thin-lenses'],
  body: `
A straw in a glass of water looks broken at the surface, and a swimming pool looks shallower than it is. Both happen because light **travels more slowly in matter** than in vacuum and bends where the speed changes.

### The refractive index
The **refractive index** of a material is the ratio of the speed of light in vacuum to its speed in the material:

$$n = \\frac{c}{v}$$

| Material | $n$ (yellow light) | speed of light |
|---|---|---|
| vacuum | 1 exactly | $3.00\\times10^8$ m/s |
| air | 1.0003 | almost the same |
| water | 1.33 | $2.25\\times10^8$ m/s |
| crown glass | 1.52 | $1.97\\times10^8$ m/s |
| diamond | 2.42 | $1.24\\times10^8$ m/s |

### Why a change of speed bends the ray
Picture a line of marchers crossing at an angle from pavement onto mud. The end that reaches the mud first slows first, so the whole line swings round. Light's wavefronts do the same: when they cross into a slower medium, the part inside lags and the front turns **towards the normal**. Going into a faster medium it turns **away from the normal**. A ray arriving along the normal is slowed but not bent.

The frequency cannot change at the boundary — every crest that arrives must leave — so the **wavelength shrinks** by the factor $n$: $\\lambda_n = \\lambda / n$. Yellow sodium light of 589 nm has a wavelength of 443 nm in water, but it is still yellow when it reaches your eye.

### Snell's law
Matching the wavefronts across the boundary (see the derivation) gives

$$n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2$$

with both angles measured from the normal. From air into water at 45°, the ray continues at 32°. Every ray path is **reversible**: a ray coming back along the refracted path leaves along the incident one.

If $n_1 > n_2$ and $\\theta_1$ is large enough, the law asks for $\\sin\\theta_2 > 1$: no refracted ray exists and the light is totally reflected — [[total-internal-reflection|total internal reflection]].

### Apparent depth
Looking straight down into water, rays from the bottom bend away from the normal as they leave, so they seem to come from a point higher up. For near-vertical viewing the apparent depth is the real depth times $n_\\text{eye}/n_\\text{object}$: a 2.0 m pool looks 1.5 m deep. A spear-fisher must aim below the fish she sees.

> [!note] The same law follows from the principle of least time: a lifeguard reaches a swimmer fastest by running a longer stretch on sand, where she is fast, and swimming a shorter stretch in water. The best path obeys $\\sin\\theta_1/v_1 = \\sin\\theta_2/v_2$ — Snell's law.
`,
  ideas: [
    'The refractive index n = c/v tells how much slower light travels in a material.',
    'Entering a slower medium the ray bends towards the normal; entering a faster one it bends away.',
    'Snell\'s law: n₁ sin θ₁ = n₂ sin θ₂, with angles from the normal.',
    'At a boundary the frequency stays the same while the wavelength changes to λ/n.',
    'Light paths are reversible.'
  ],
  pitfalls: [
    'Light bends because it strikes the surface at an angle — It bends because its speed changes. At normal incidence it slows down just as much but carries straight on.',
    'Both the wavelength and the frequency change in the new medium — Only the wavelength does. The frequency is fixed by the source, which is why the colour is unchanged.',
    'Measuring the angles from the surface — Snell\'s law uses angles from the normal; using angles from the surface gives cosines and wrong answers.'
  ],
  derivation: {
    title: 'Snell\'s law from wavefronts',
    steps: [
      { text: 'A plane wavefront AB meets the boundary at an angle. End A touches the surface first; end B still has a distance to go in medium 1, which takes a time $t$:', tex: 'BD = v_1 t' },
      { text: 'In the same time the disturbance from A travels into medium 2 at the slower speed:', tex: 'AE = v_2 t' },
      { text: 'The new wavefront is the line from D tangent to that circle. The two right-angled triangles ABD and AED share the hypotenuse AD, and their angles at A and D are the angles of incidence and refraction:', tex: '\\sin\\theta_1 = \\frac{v_1 t}{AD}, \\qquad \\sin\\theta_2 = \\frac{v_2 t}{AD}' },
      { text: 'Divide one by the other and use $v = c/n$:', tex: '\\frac{\\sin\\theta_1}{\\sin\\theta_2} = \\frac{v_1}{v_2} = \\frac{n_2}{n_1} \\;\\Rightarrow\\; n_1\\sin\\theta_1 = n_2\\sin\\theta_2' }
    ]
  },
  formulas: [
    {
      name: 'Snell\'s law',
      expr: 'n1*sin(theta1) = n2*sin(theta2)', tex: 'n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2', solveFor: 'theta2',
      vars: {
        n1: { name: 'refractive index of the first medium', value: 1.00, tex: 'n_1' },
        theta1: { name: 'angle of incidence', q: 'angle', unit: '°', value: 45, min: 0, max: 90, tex: '\\theta_1' },
        n2: { name: 'refractive index of the second medium', value: 1.33, tex: 'n_2' },
        theta2: { name: 'angle of refraction', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\theta_2' }
      },
      note: 'Angles are measured from the normal. If $n_1 \\sin\\theta_1 > n_2$ there is no refracted ray: total internal reflection.',
      stories: {
        theta2: 'Light in a medium of index {n1} strikes a surface of index {n2} at {theta1} from the normal. At what angle is it refracted?',
        n2: 'A ray passes from index {n1} at {theta1} into an unknown liquid and is refracted at {theta2}. What is the liquid\'s refractive index?',
        theta1: 'At what angle of incidence must light in a medium of index {n1} strike a surface of index {n2} to be refracted at {theta2}?'
      }
    },
    {
      name: 'Refractive index',
      expr: 'n = c/v',
      vars: {
        n: { name: 'refractive index' },
        c: { const: 'c' },
        v: { name: 'speed of light in the material', q: 'speed', unit: 'm/s', value: 2.25e8 }
      },
      stories: { n: 'Light travels at {v} in a liquid. What is the liquid\'s refractive index?', v: 'How fast does light travel in a glass of refractive index {n}?' }
    },
    {
      name: 'Wavelength in a medium',
      expr: 'lambda_n = lambda/n', tex: '\\lambda_n = \\frac{\\lambda}{n}',
      vars: {
        lambda_n: { name: 'wavelength in the medium', q: 'length', unit: 'nm', tex: '\\lambda_n' },
        lambda: { name: 'wavelength in vacuum', q: 'length', unit: 'nm', value: 589 },
        n: { name: 'refractive index', value: 1.33 }
      },
      stories: { lambda_n: 'Yellow light of vacuum wavelength {lambda} enters water of index {n}. What is its wavelength in the water?' }
    },
    {
      name: 'Apparent depth (viewed from straight above)',
      expr: 'd_a = d*n_eye/n_obj', tex: 'd_a = d\\,\\frac{n_{\\text{eye}}}{n_{\\text{obj}}}',
      vars: {
        d_a: { name: 'apparent depth', q: 'length', unit: 'm', tex: 'd_a' },
        d: { name: 'real depth', q: 'length', unit: 'm', value: 2.0 },
        n_eye: { name: 'refractive index on the viewer\'s side', value: 1.00, tex: 'n_{\\text{eye}}' },
        n_obj: { name: 'refractive index on the object\'s side', value: 1.33, tex: 'n_{\\text{obj}}' }
      },
      note: 'Valid for rays close to the normal, i.e. looking nearly straight down. At a slant the object looks shallower still.',
      stories: { d_a: 'A swimming pool is {d} deep. How deep does it look from straight above?', d: 'A coin at the bottom of a pool appears to be {d_a} below the surface. How deep is the pool?' }
    }
  ],
  examples: [
    {
      title: 'Into the water',
      q: 'A laser beam in air strikes a calm water surface ($n = 1.33$) at 45° from the normal. At what angle does it travel in the water, how fast, and what happens to its 589 nm wavelength?',
      steps: [
        '$\\sin\\theta_2 = \\dfrac{n_1 \\sin\\theta_1}{n_2} = \\dfrac{1.00 \\times \\sin 45°}{1.33} = \\dfrac{0.707}{1.33} = 0.532$, so $\\theta_2 = 32.1°$ — bent towards the normal.',
        'Speed: $v = c/n = 3.00\\times10^8/1.33 = 2.25\\times10^8\\ \\mathrm{m/s}$.',
        'Wavelength: $589/1.33 = 443\\ \\mathrm{nm}$; the frequency, $5.09\\times10^{14}\\ \\mathrm{Hz}$, is unchanged.'
      ],
      a: '32.1° from the normal, at 2.25 × 10⁸ m/s, with a wavelength of 443 nm.'
    },
    {
      title: 'How deep is the pool really?',
      q: 'Looking straight down, the bottom of a pool appears to be 1.5 m below the surface. How deep is it?',
      steps: [
        'Apparent depth = real depth × $n_\\text{eye}/n_\\text{obj}$, with the eye in air (1.00) and the bottom in water (1.33).',
        'Real depth $= 1.5 \\times 1.33/1.00 = 2.0\\ \\mathrm{m}$.',
        'Viewed at a slant the error grows, so a pool always looks shallower than it is — a real safety hazard for divers.'
      ],
      a: 'About 2.0 m.'
    }
  ],
  quiz: [
    { q: 'A ray passes from glass into air at an angle. It bends…', choices: ['towards the normal', 'away from the normal', 'not at all', 'back into the glass'], a: 1,
      why: 'Light speeds up in air, so the ray swings away from the normal: $\\sin\\theta_\\text{air} = n_\\text{glass}\\sin\\theta_\\text{glass}$ is larger.' },
    { q: 'When light passes from air into water, which quantity stays the same?', choices: ['Speed', 'Wavelength', 'Frequency', 'Direction'], a: 2,
      why: 'The frequency is set by the source; the speed and wavelength both drop by the factor n.' },
    { q: 'Light travels at $2.0\\times10^8$ m/s in a plastic. Its refractive index is…', choices: ['0.67', '1.0', '1.5', '2.0'], a: 2, why: '$n = c/v = 3.0\\times10^8 / 2.0\\times10^8 = 1.5$.' },
    { q: 'A spear-fisher standing on a rock sees a fish in the water. To hit it she should aim…', choices: ['directly at the image', 'below the image', 'above the image', 'to one side'], a: 1,
      why: 'Light from the fish bends away from the normal as it leaves the water, so the fish appears higher (shallower) than it really is.' },
    { q: 'A ray that strikes a boundary along the normal is not bent, even though its speed changes.', a: true,
      why: 'With $\\theta_1 = 0$, Snell\'s law gives $\\theta_2 = 0$. The ray slows down but keeps its direction.' }
  ],
  applications: [
    'Every lens, from spectacles to camera objectives.',
    'Mirages: air near a hot road has a lower index, so rays from the sky curve upward and look like water.',
    'Atmospheric refraction lifts the setting Sun by about half a degree — you see it after it has geometrically set.',
    'Gem identification by measuring the refractive index with a refractometer.'
  ],
  history: 'The law was written down by Ibn Sahl in Baghdad around 984, rediscovered by Willebrord Snellius in 1621 and published by Descartes in 1637.',
  sim: 'light-interface'
},

{
  id: 'total-internal-reflection', parent: 'geometric-optics', title: 'Total internal reflection', level: 2,
  short: 'Going from a slower into a faster medium, light that strikes the boundary beyond the critical angle cannot get out at all and is reflected completely — the principle of optical fibres.',
  keywords: ['total internal reflection', 'TIR', 'critical angle', 'optical fibre', 'fiber optics', 'numerical aperture', 'acceptance angle', 'diamond', 'prism', 'evanescent wave', 'Snell\'s window'],
  prereq: ['refraction', 'math:inverse-trig'],
  related: ['dispersion', 'brewsters-angle', 'optical-instruments', 'quantum-tunneling'],
  body: `
Shine a torch upward from the bottom of a pool. Near the vertical the beam escapes into the air, bending away from the normal. Tilt it further and the escaping beam skims closer and closer to the surface — and beyond a certain tilt none of it gets out. The surface becomes a perfect mirror.

### The critical angle
Going from index $n_1$ into a smaller index $n_2$, [[refraction|Snell's law]] gives $\\sin\\theta_2 = (n_1/n_2)\\sin\\theta_1$, which reaches 1 — a refracted ray grazing along the surface — at the **critical angle**

$$\\sin\\theta_c = \\frac{n_2}{n_1}$$

For any larger angle of incidence Snell's law has no solution and **all** the light is reflected. This is **total internal reflection**. It is truly total: no metal mirror reflects 100%, but TIR does, which is why the best optical systems use it.

| Boundary | Critical angle |
|---|---|
| water → air | 48.8° |
| crown glass → air | 41.1° (n = 1.52) |
| diamond → air | 24.4° |
| glass → water | about 62° |

The switch is not sudden. As $\\theta_1$ climbs towards $\\theta_c$, the refracted ray dims and the reflected one brightens; at $\\theta_c$ the reflected share reaches 100%. Try it in the simulation.

### Prisms and diamonds
A 45°–45°–90° glass prism meets light at 45°, above glass's critical angle, so its long face is a flawless mirror. Binoculars and periscopes use such prisms rather than silvered mirrors. A diamond's tiny critical angle, together with carefully angled facets, traps light that enters the top and sends it back out towards the viewer — the brilliance of a well-cut stone.

### Optical fibres
A fibre is a glass core of index $n_1$ inside a cladding of slightly lower index $n_2$. Light launched into the end within a cone of half-angle $\\theta_a$ meets the wall beyond the critical angle and is guided along, bouncing thousands of times per metre without loss. The **numerical aperture** measures that cone:

$$\\mathrm{NA} = \\sin\\theta_a = \\sqrt{n_1^2 - n_2^2}$$

A telecom fibre (core 1.4475, cladding 1.4440) has NA ≈ 0.10: it accepts light within about 6° of its axis. Modern fibres lose only 0.2 dB per kilometre at 1550 nm, so a signal keeps half its power after 15 km.

### Snell's window and the evanescent wave
A diver looking up sees the whole sky squeezed into a bright circle of half-angle 48.8° overhead; outside it, the surface mirrors the pool below. And even during TIR the field pokes a fraction of a wavelength beyond the surface without carrying energy away. Bring a second piece of glass that close and light leaks across — *frustrated* total internal reflection, the optical cousin of [[quantum-tunneling|quantum tunnelling]] and the trick behind some fingerprint scanners.
`,
  ideas: [
    'Total internal reflection happens only going from a higher to a lower refractive index.',
    'Beyond the critical angle, sin θc = n₂/n₁, no light is transmitted: 100% is reflected.',
    'Near the critical angle the refracted ray fades and the reflected ray brightens continuously.',
    'Optical fibres guide light by total internal reflection at the core–cladding boundary.'
  ],
  pitfalls: [
    'Total internal reflection can happen going into a denser medium — Going into a higher index the ray bends towards the normal, and a refracted ray always exists.',
    'The reflection switches on suddenly at the critical angle — The reflected share rises steeply as θc approaches and reaches 100% there; below θc part of the light is always reflected.',
    'Fibres need a mirror coating — The lower-index cladding does the job by total internal reflection, which loses nothing; a metal coating would absorb a few per cent at each of thousands of bounces per metre.'
  ],
  derivation: {
    title: 'Numerical aperture of a fibre',
    steps: [
      { text: 'A ray enters the flat end of the fibre from air at angle $\\theta_a$ and refracts to $\\theta$ inside the core:', tex: '\\sin\\theta_a = n_1 \\sin\\theta' },
      { text: 'It then meets the side wall at an angle of incidence $90° - \\theta$. It stays trapped if that angle is at least the critical angle:', tex: '\\sin(90° - \\theta) = \\cos\\theta \\ge \\frac{n_2}{n_1}' },
      { text: 'At the limit $\\cos\\theta = n_2/n_1$, so', tex: '\\sin\\theta = \\sqrt{1 - \\frac{n_2^2}{n_1^2}}' },
      { text: 'Substituting into the first line gives the largest acceptance angle:', tex: '\\sin\\theta_a = n_1\\sqrt{1 - \\frac{n_2^2}{n_1^2}} = \\sqrt{n_1^2 - n_2^2} = \\mathrm{NA}' }
    ]
  },
  formulas: [
    {
      name: 'Critical angle',
      expr: 'sin(thetac) = n2/n1', tex: '\\sin\\theta_c = \\frac{n_2}{n_1}', solveFor: 'thetac',
      vars: {
        thetac: { name: 'critical angle', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\theta_c' },
        n1: { name: 'refractive index of the denser medium (light comes from here)', value: 1.50, tex: 'n_1' },
        n2: { name: 'refractive index of the less dense medium', value: 1.00, tex: 'n_2' }
      },
      note: 'Only defined for $n_1 > n_2$.',
      stories: {
        thetac: 'What is the critical angle for light inside a material of index {n1} surrounded by a medium of index {n2}?',
        n1: 'Light inside a gemstone surrounded by air (n = {n2}) is totally reflected beyond {thetac}. What is the gemstone\'s refractive index?'
      }
    },
    {
      name: 'Acceptance angle of an optical fibre (in air)',
      expr: 'sin(thetaa) = sqrt(n1^2 - n2^2)', tex: '\\sin\\theta_a = \\sqrt{n_1^2 - n_2^2}', solveFor: 'thetaa',
      vars: {
        thetaa: { name: 'largest acceptance half-angle', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\theta_a' },
        n1: { name: 'refractive index of the core', value: 1.4475, tex: 'n_1' },
        n2: { name: 'refractive index of the cladding', value: 1.4440, tex: 'n_2' }
      },
      note: 'The right-hand side is the numerical aperture NA. If it exceeds 1, light at every angle is accepted.',
      practice: { unknowns: ['thetaa'] },
      stories: { thetaa: 'A fibre has a core of index {n1} and cladding of index {n2}. Within what half-angle must light enter its end from air to be guided?' }
    }
  ],
  examples: [
    {
      title: 'Snell\'s window',
      q: 'A diver 2.0 m below a calm surface looks up. Within what circle on the surface can she see the sky?',
      steps: [
        'Light from the sky, even at grazing incidence, enters the water no more than $\\theta_c$ from the vertical: $\\sin\\theta_c = 1.00/1.33$, so $\\theta_c = 48.8°$.',
        'The circle has radius $r = 2.0 \\times \\tan 48.8° = 2.0 \\times 1.14 = 2.3\\ \\mathrm{m}$.',
        'Outside the circle the underside of the surface totally reflects the pool — a silvery ceiling.'
      ],
      a: 'A circle of radius about 2.3 m directly overhead.'
    },
    {
      title: 'A prism that stops being a mirror',
      q: 'Binocular prisms rely on light striking a glass face ($n = 1.5$) at 45°. Does the face still reflect totally if the prism is under water?',
      steps: [
        'In air: $\\sin\\theta_c = 1.00/1.5$, $\\theta_c = 41.8° < 45°$. Total internal reflection — a perfect mirror.',
        'Under water: $\\sin\\theta_c = 1.33/1.5 = 0.887$, $\\theta_c = 62.5° > 45°$.',
        'Now the light is incident below the critical angle and most of it escapes into the water.'
      ],
      a: 'No: the critical angle rises to 62.5°, so at 45° most of the light passes out of the prism.'
    }
  ],
  quiz: [
    { q: 'Total internal reflection can occur when light travels from…', choices: ['air into glass', 'glass into air', 'air into water', 'any medium into any other'], a: 1,
      why: 'It needs $n_1 > n_2$. Going from air into glass the ray bends towards the normal and always gets through.' },
    { q: 'Diamond has a much smaller critical angle than glass because…', choices: ['it is harder', 'its refractive index is higher', 'it is more transparent', 'its surface is smoother'], a: 1,
      why: '$\\sin\\theta_c = 1/n$: a larger index means a smaller critical angle (24° for diamond against 42° for glass).' },
    { q: 'For light to be guided, the cladding of an optical fibre must have…', choices: ['a higher index than the core', 'a lower index than the core', 'the same index as the core', 'a silvered outer surface'], a: 1,
      why: 'Total internal reflection needs the light to go from higher to lower index at the core–cladding wall.' },
    { q: 'What is the critical angle for light going from glass ($n = 1.50$) into water ($n = 1.33$)?', choices: ['41.8°', '48.8°', '62.5°', 'There is none'], a: 2,
      why: '$\\sin\\theta_c = 1.33/1.50 = 0.887$, giving 62.5°. A smaller index difference means a larger critical angle.' },
    { q: 'Beyond the critical angle, a small fraction of the light still escapes as a faint refracted ray.', a: false,
      why: 'Beyond $\\theta_c$ no refracted ray exists and no energy crosses the surface — unless another medium is brought within about a wavelength (frustrated TIR).' }
  ],
  applications: [
    'Optical fibres for the internet and cable TV, and fibre endoscopes for looking inside the body.',
    'Prisms in binoculars, periscopes and single-lens reflex cameras.',
    'Rain sensors in car windscreens: water on the glass frustrates the reflection of an infrared beam.',
    'Gem cutting, and fingerprint scanners based on frustrated total internal reflection.'
  ],
  sim: { id: 'light-interface', params: { n1: 1.5, n2: 1.0, angle: 35 } }
},

{
  id: 'dispersion', parent: 'geometric-optics', title: 'Dispersion and prisms', level: 2,
  short: 'The refractive index depends on wavelength, so a prism fans white light out into a spectrum — and raindrops make rainbows.',
  keywords: ['dispersion', 'prism', 'spectrum', 'rainbow', 'white light', 'Newton', 'Cauchy', 'chromatic aberration', 'Abbe number', 'minimum deviation', 'achromat'],
  prereq: ['refraction', 'em-spectrum'],
  related: ['total-internal-reflection', 'thin-lenses', 'diffraction-grating', 'color-vision'],
  body: `
In 1666 Isaac Newton let a beam of sunlight through a hole in his shutter and a glass prism, and saw it spread into a band of colours on the far wall. He then isolated one colour and passed it through a second prism: it bent again, but did not split. White light, he concluded, is a **mixture**, and the prism only sorts it.

### Why the colours separate
The refractive index of glass is slightly different for each wavelength — **dispersion**. For glass and water it is larger for short wavelengths (*normal dispersion*):

| Wavelength | Crown glass $n$ |
|---|---|
| 656 nm (red) | 1.514 |
| 589 nm (yellow) | 1.517 |
| 486 nm (blue) | 1.522 |
| 405 nm (violet) | 1.530 |

A higher index means stronger bending, so violet is deviated most and red least. Away from absorption bands the index is described well by Cauchy's formula, $n \\approx A + B/\\lambda^2$ — for crown glass $A = 1.505$, $B = 0.0042\\ \\mu\\mathrm{m}^2$.

### The prism
A ray crossing a prism is bent towards the base at both faces. The total **deviation** depends on the angle of incidence and is smallest when the ray passes through symmetrically. That **minimum deviation** $\\delta_\\text{min}$ is easy to measure and gives the index precisely:

$$n = \\frac{\\sin\\left(\\frac{A + \\delta_{\\min}}{2}\\right)}{\\sin(A/2)}$$

where $A$ is the apex angle. A 60° crown-glass prism deviates red light by 38.4° and blue by 39.1°. A thin prism deviates every ray by about $(n - 1)A$.

### Rainbows
Sunlight entering a raindrop is refracted, reflected once off the back and refracted again on the way out. The light returning from a drop is concentrated near **42°** from the point directly opposite the Sun — 42.4° for red, 40.7° for violet. Every drop at that angle from your shadow's head sends you its colour, so you see a circle of colour with **red on the outside**. Two internal reflections give the fainter secondary bow at about 51°, with the colours reversed; the sky between them is noticeably darker.

### Chromatic aberration
In a lens, dispersion means blue light focuses closer than red, fringing images with colour. An **achromatic doublet** pairs a converging crown-glass lens with a weaker diverging flint-glass lens whose dispersion is larger: the colour errors cancel while some focusing power remains. Glass makers rate dispersion by the **Abbe number** $V = (n_d - 1)/(n_F - n_C)$, using yellow (d, 588 nm), blue (F, 486 nm) and red (C, 656 nm) lines: about 64 for crown glass, 30–40 for flint. A high $V$ means little dispersion.

> [!tip] In the prism simulation, turn the angle of incidence and find the minimum deviation. Then compare crown glass, flint glass and diamond — the "fire" of a diamond is its large dispersion.
`,
  ideas: [
    'White light is a mixture of wavelengths; a prism separates them but does not create them.',
    'The refractive index of glass or water is higher for violet than for red, so violet bends most.',
    'A prism\'s deviation is smallest for a symmetric passage; minimum deviation measures n accurately.',
    'Rainbows come from refraction and internal reflection in drops; the primary bow is 42° from the antisolar point, red outside.'
  ],
  pitfalls: [
    'The prism creates the colours — It only separates colours already in white light; a single colour cannot be split further, and a reversed prism recombines them.',
    'Red bends most because it has the longest wavelength — In glass and water the index is highest for violet, so violet is deviated most. (A diffraction grating is the one that bends red most.)',
    'A rainbow is at a fixed place in the sky — It is a cone of directions 42° around the point opposite the Sun; each observer sees a different set of drops, and the bow moves with you.'
  ],
  formulas: [
    {
      name: 'Refractive index from minimum deviation',
      expr: 'n = sin((A + delta)/2)/sin(A/2)', tex: 'n = \\frac{\\sin\\left(\\frac{A + \\delta_{\\min}}{2}\\right)}{\\sin(A/2)}', solveFor: 'delta',
      vars: {
        n: { name: 'refractive index of the prism', value: 1.517 },
        A: { name: 'apex angle of the prism', q: 'angle', unit: '°', value: 60, min: 1, max: 90 },
        delta: { name: 'angle of minimum deviation', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\delta_{\\min}' }
      },
      stories: {
        delta: 'A prism with apex angle {A} is made of glass of index {n}. What is its angle of minimum deviation?',
        n: 'A prism with apex angle {A} deviates yellow light by at least {delta}. What is the glass\'s refractive index?'
      }
    },
    {
      name: 'Deviation by a thin prism',
      expr: 'delta = (n - 1)*A', tex: '\\delta = (n - 1)A',
      vars: {
        delta: { name: 'deviation', q: 'angle', unit: '°' },
        n: { name: 'refractive index', value: 1.52 },
        A: { name: 'apex angle (small)', q: 'angle', unit: '°', value: 5 }
      },
      note: 'Good for apex angles up to about 10° and near-normal incidence. Spectacle lenses use weak prisms like this to correct squints.'
    },
    {
      name: 'Angular spread of a spectrum (thin prism)',
      expr: 'dd = (nb - nr)*A', tex: '\\Delta\\delta = (n_b - n_r)A',
      vars: {
        dd: { name: 'angle between blue and red rays', q: 'angle', unit: '°', tex: '\\Delta\\delta' },
        nb: { name: 'index for blue light', value: 1.5224, tex: 'n_b' },
        nr: { name: 'index for red light', value: 1.5143, tex: 'n_r' },
        A: { name: 'apex angle', q: 'angle', unit: '°', value: 10 }
      },
      practice: { unknowns: ['dd', 'A'] }
    },
    {
      name: 'Abbe number',
      expr: 'V = (nd - 1)/(nF - nC)', tex: 'V = \\frac{n_d - 1}{n_F - n_C}',
      vars: {
        V: { name: 'Abbe number (high = little dispersion)' },
        nd: { name: 'index at 588 nm (yellow)', value: 1.5168, tex: 'n_d' },
        nF: { name: 'index at 486 nm (blue)', value: 1.5224, tex: 'n_F' },
        nC: { name: 'index at 656 nm (red)', value: 1.5143, tex: 'n_C' }
      },
      practice: { unknowns: ['V'] }
    }
  ],
  examples: [
    {
      title: 'Measuring an index with a prism',
      q: 'A 60° prism deviates yellow sodium light by a minimum of 38.7°. What is the refractive index of the glass?',
      steps: [
        '$n = \\dfrac{\\sin\\left(\\frac{60° + 38.7°}{2}\\right)}{\\sin 30°} = \\dfrac{\\sin 49.35°}{0.5}$.',
        '$\\sin 49.35° = 0.7587$, so $n = 1.517$ — crown glass.',
        'A spectrometer reads angles to a minute of arc, giving the index to four decimal places.'
      ],
      a: 'n ≈ 1.517'
    },
    {
      title: 'How wide is the spectrum?',
      q: 'White light passes at minimum deviation through a 60° crown-glass prism with $n = 1.5143$ for red (656 nm) and $n = 1.5224$ for blue (486 nm). What angle separates the red and blue rays?',
      steps: [
        'Red: $\\delta = 2\\arcsin(1.5143 \\sin 30°) - 60° = 2 \\times 49.21° - 60° = 38.43°$.',
        'Blue: $\\delta = 2\\arcsin(1.5224 \\sin 30°) - 60° = 2 \\times 49.57° - 60° = 39.14°$.',
        'The difference is about 0.7°. On a wall 3 m away the red–blue band is $3 \\times \\tan 0.7° \\approx 4\\ \\mathrm{cm}$ wide.'
      ],
      a: 'About 0.7°, a few centimetres on a wall 3 m away.'
    }
  ],
  quiz: [
    { q: 'Which colour of light is deviated most by a glass prism?', choices: ['Red', 'Yellow', 'Green', 'Violet'], a: 3,
      why: 'Glass has its highest refractive index for short wavelengths, so violet bends most.' },
    { q: 'In the primary rainbow, which colour is on the outside of the arc?', choices: ['Red', 'Violet', 'Green', 'It depends on the time of day'], a: 0,
      why: 'Red light returns from the drops at the largest angle (about 42.4°) from the antisolar point, violet at the smallest (40.7°).' },
    { q: 'To see a rainbow, the Sun should be…', choices: ['in front of you', 'behind you', 'directly overhead', 'below the horizon'], a: 1,
      why: 'The bow is centred on the antisolar point, the direction exactly opposite the Sun, so you must face away from it.' },
    { q: 'Newton passed a single colour from one prism through a second prism. It split into further colours.', a: false,
      why: 'It bent but did not split: the colours are already in white light and a prism only separates them.' },
    { q: 'Because of chromatic aberration, a simple glass lens focuses blue light…', choices: ['farther from the lens than red', 'closer to the lens than red', 'at the same point as red', 'not at all'], a: 1,
      why: 'Blue has the higher index, so the lens is stronger for blue and its focal length shorter.' }
  ],
  applications: [
    'Prism spectroscopes for identifying elements by their spectral lines.',
    'Achromatic and apochromatic lenses in cameras, microscopes and telescopes.',
    'The "fire" of cut gemstones, especially diamond.',
    'Rainbows, fogbows and the coloured halos round the Sun and Moon.'
  ],
  history: 'Newton\'s prism experiments of 1666, published in 1672, overturned the old idea that a prism adds colour to light. Chester Moor Hall and John Dollond made the first achromatic lenses in the 1730s–1750s.',
  sim: 'light-prism'
},

{
  id: 'thin-lenses', parent: 'geometric-optics', title: 'Thin lenses', level: 2,
  short: 'A lens bends rays by refraction so that they meet (converging lens) or spread as if from a point (diverging lens); the thin-lens equation locates the image.',
  keywords: ['lens', 'thin lens', 'converging lens', 'diverging lens', 'convex lens', 'concave lens', 'focal length', 'focal point', 'thin lens equation', 'ray diagram', 'dioptre', 'lens power', 'real image', 'virtual image'],
  prereq: ['refraction', 'math:similar-triangles', 'math:fractions-ratios'],
  related: ['lensmakers-equation', 'magnification', 'spherical-mirrors', 'the-eye', 'optical-instruments'],
  body: `
Look at a lens edge-on and each small piece of it is a little [[dispersion|prism]]. Near the middle the two faces are almost parallel and a ray passes nearly straight; towards the edge the faces are more steeply inclined and bend rays more. In a lens that is thicker in the middle the bending grows in just the right proportion to the distance from the axis, so rays arriving parallel all cross at one point: the **focal point**. That is a **converging** lens. One that is thinner in the middle is **diverging**: parallel rays leave as if they came from a focal point on the incoming side.

The **focal length** $f$ is the distance from the lens to its focal points (one on each side). A lens is *thin* when its thickness is small compared with $f$; then all distances can be measured from its centre plane.

### Ray diagrams
Three rays from the tip of an object are easy to draw:

1. **parallel to the axis** → through the far focal point $F'$ (diverging: away from the axis, as if from the near focal point $F$),
2. **through the centre** → straight on, undeviated,
3. **through the near focal point $F$** → out parallel to the axis (diverging: aimed at $F'$, it leaves parallel).

Where the rays meet after the lens is a **real image**, which you can catch on a screen. If they diverge, trace them backwards: where the extensions meet is a **virtual image**, visible only by looking through the lens.

### The thin-lens equation
Similar triangles in the ray diagram give

$$\\frac{1}{d_o} + \\frac{1}{d_i} = \\frac{1}{f}, \\qquad m = -\\frac{d_i}{d_o}$$

> [!note] **Sign convention (real is positive).** $d_o > 0$ for a real object. $d_i > 0$ for a real image on the far side of the lens, $d_i < 0$ for a virtual image on the object's side. $f > 0$ for converging lenses, $f < 0$ for diverging ones. A negative $m$ means an inverted image. [[spherical-mirrors|Mirrors]] use the same rules.

| Converging lens, object at | Image | Used in |
|---|---|---|
| more than $2f$ | real, inverted, smaller | camera, eye |
| $2f$ | real, inverted, same size | photocopier |
| between $f$ and $2f$ | real, inverted, larger | projector |
| $f$ | at infinity | searchlight, collimator |
| inside $f$ | virtual, upright, larger | magnifying glass |

A diverging lens always gives a virtual, upright, reduced image of a real object.

### Power in dioptres
Opticians quote the **power** $P = 1/f$ with $f$ in metres; the unit is the **dioptre** (D). A +4 D lens converges with $f = 25$ cm; a −2 D lens diverges with $f = -50$ cm. Thin lenses in contact simply add their powers, which is how an optometrist builds up a prescription from trial lenses.

> [!tip] In the simulation, drag the object from far away towards the lens and watch the image grow, run off to infinity at $F$, and come back as a virtual image on the same side.
`,
  ideas: [
    'A converging lens brings parallel rays to a focal point; a diverging lens spreads them as if from one.',
    'Any two of the three principal rays locate the image.',
    'The thin-lens equation 1/d_o + 1/d_i = 1/f, with real-is-positive signs, covers every case.',
    'Power P = 1/f in dioptres; the powers of thin lenses in contact add.'
  ],
  pitfalls: [
    'Covering half the lens cuts off half the image — Every part of the lens receives light from every point of the object, so you still get the whole image, only dimmer.',
    'A converging lens always forms a real image — An object inside the focal length gives a virtual, upright image: the magnifying glass.',
    'Only the principal rays form the image — They are just the easy ones to draw. Every ray from an object point that passes through the lens goes through the same image point.'
  ],
  formulas: [
    {
      name: 'Thin-lens equation',
      expr: '1/f = 1/d_o + 1/d_i', tex: '\\frac{1}{f} = \\frac{1}{d_o} + \\frac{1}{d_i}', solveFor: 'd_i',
      vars: {
        f: { name: 'focal length (+ converging, − diverging)', q: 'length', unit: 'cm', value: 10, signed: true },
        d_o: { name: 'object distance', q: 'length', unit: 'cm', value: 15, tex: 'd_o' },
        d_i: { name: 'image distance (+ real, far side; − virtual, object side)', q: 'length', unit: 'cm', signed: true, tex: 'd_i' }
      },
      note: 'Real is positive. A negative $d_i$ is a virtual image on the same side as the object.',
      stories: {
        d_i: 'An object is {d_o} from a lens of focal length {f}. Where is the image?',
        f: 'A lens forms an image at {d_i} of an object {d_o} away. What is its focal length?',
        d_o: 'Where must an object be placed so that a lens of focal length {f} forms its image at {d_i}?'
      }
    },
    {
      name: 'Power of a lens',
      expr: 'P = 1/f',
      vars: {
        P: { name: 'power', q: 'optpower', unit: 'D', signed: true },
        f: { name: 'focal length', q: 'length', unit: 'cm', value: 25, signed: true }
      },
      stories: { P: 'What is the power of a lens with focal length {f}?', f: 'A spectacle lens is marked {P}. What is its focal length?' }
    },
    {
      name: 'Thin lenses in contact',
      expr: 'P = P1 + P2', tex: 'P = P_1 + P_2',
      vars: {
        P: { name: 'combined power', q: 'optpower', unit: 'D', signed: true },
        P1: { name: 'power of the first lens', q: 'optpower', unit: 'D', value: 5, signed: true, tex: 'P_1' },
        P2: { name: 'power of the second lens', q: 'optpower', unit: 'D', value: -2, signed: true, tex: 'P_2' }
      },
      note: 'Equivalent to $1/f = 1/f_1 + 1/f_2$.'
    }
  ],
  examples: [
    {
      title: 'A projector',
      q: 'A projector lens has a focal length of 10 cm and the screen is 3.0 m away. How far behind the lens must the slide be, and how large is the picture of a 24 mm slide?',
      steps: [
        '$\\dfrac{1}{d_o} = \\dfrac{1}{f} - \\dfrac{1}{d_i} = \\dfrac{1}{0.10} - \\dfrac{1}{3.0} = 10 - 0.333 = 9.667\\ \\mathrm{m^{-1}}$, so $d_o = 0.1034\\ \\mathrm{m} = 10.3\\ \\mathrm{cm}$ — just outside the focal point.',
        '$m = -d_i/d_o = -3.0/0.1034 = -29$.',
        'The picture is $29 \\times 24\\ \\mathrm{mm} = 0.70\\ \\mathrm{m}$ across — and inverted, so slides go in upside down.'
      ],
      a: 'About 10.3 cm from the lens; the picture is 0.70 m across and inverted.'
    },
    {
      title: 'A diverging lens',
      q: 'An object stands 30 cm from a diverging lens of focal length −20 cm. Describe the image.',
      steps: [
        '$\\dfrac{1}{d_i} = \\dfrac{1}{f} - \\dfrac{1}{d_o} = -\\dfrac{1}{20} - \\dfrac{1}{30} = -\\dfrac{5}{60}$, so $d_i = -12\\ \\mathrm{cm}$.',
        'Negative: a virtual image 12 cm from the lens on the object\'s side.',
        '$m = -(-12)/30 = +0.4$: upright and 0.4 times the size.'
      ],
      a: 'Virtual, upright, 0.4 times the size, 12 cm from the lens on the object side.'
    }
  ],
  quiz: [
    { q: 'An object is placed at twice the focal length of a converging lens. The image is…', choices: ['virtual and upright, twice the size', 'real and inverted, the same size, at 2f', 'real and inverted, half the size', 'at infinity'], a: 1,
      why: '$1/d_i = 1/f - 1/2f = 1/2f$, so $d_i = 2f$ and $m = -1$.' },
    { q: 'You cover the top half of a converging lens that is forming an image on a screen. The image…', choices: ['loses its top half', 'loses its bottom half', 'stays complete but becomes dimmer', 'disappears'], a: 2,
      why: 'Light from every object point passes through every part of the lens. Blocking half removes half the light, not half the image.' },
    { q: 'A spectacle lens is labelled +2.5 D. It is…', choices: ['diverging, f = −40 cm', 'converging, f = 40 cm', 'converging, f = 2.5 m', 'diverging, f = −2.5 m'], a: 1,
      why: 'Positive power means converging, and $f = 1/P = 1/2.5 = 0.40\\ \\mathrm{m}$.' },
    { q: 'The image of a real object formed by a diverging lens is always…', choices: ['real and inverted', 'virtual, upright and smaller', 'virtual, upright and larger', 'real and upright'], a: 1,
      why: 'With $f < 0$ and $d_o > 0$ the equation gives $d_i < 0$ with $|d_i| < |f|$, and $0 < m < 1$.' },
    { q: 'A converging lens always forms a real image.', a: false,
      why: 'Put the object inside the focal length and the rays leave diverging: the image is virtual, upright and enlarged.' }
  ],
  applications: [
    'Cameras, phone cameras and the lens of the eye.',
    'Spectacles and contact lenses, specified by their power in dioptres.',
    'Projectors, magnifiers, microscopes and telescopes.',
    'Collimating lenses that turn a point source into a parallel beam.'
  ],
  sim: 'light-lens'
},

{
  id: 'lensmakers-equation', parent: 'geometric-optics', title: 'The lensmaker\'s equation', level: 3,
  short: 'How a lens\'s focal length follows from its material and the curvature of its two faces — and why a lens grows weaker under water.',
  keywords: ['lensmaker\'s equation', 'lens maker', 'radius of curvature', 'focal length', 'biconvex', 'plano-convex', 'meniscus', 'refractive index', 'lens in water', 'single refracting surface'],
  prereq: ['thin-lenses', 'refraction', 'math:circles'],
  related: ['dispersion', 'vision-correction', 'the-eye'],
  body: `
A lens has power for two reasons: its material differs from its surroundings, and its faces are curved. The **lensmaker's equation** puts both into one line. For a thin lens in air,

$$\\frac{1}{f} = (n - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)$$

where $n$ is the lens material's index and $R_1$, $R_2$ are the radii of curvature of the face the light meets first and second.

### Signs of the radii
Let light travel from left to right. A radius is **positive when the surface's centre of curvature lies to the right** of it (on the side the light is heading), negative when it lies to the left, and infinite for a flat face. So in a biconvex lens the first face has $R_1 > 0$ and the second $R_2 < 0$, and their contributions **add**. With this rule the equation also gives the correct negative $f$ for diverging lenses.

A symmetric biconvex lens with $R = 10$ cm made of glass with $n = 1.5$ has $1/f = 0.5 \\times (1/10 + 1/10)$, so $f = 10$ cm. A **plano-convex** lens has one flat face, and $f = R/(n - 1)$ — for glass, twice the radius.

### Shape and bending
Only the combination $1/R_1 - 1/R_2$ matters for the focal length, so many shapes give the same $f$. Turning a thin lens round (swapping faces) changes neither the combination nor $f$. The shape does affect aberrations: a plano-convex lens forms a sharper image with its curved side facing the parallel light. Lens designers "bend" a lens to the best shape for its job.

### Under water
In a surrounding medium of index $n_m$, what matters is the index *ratio*:

$$\\frac{1}{f} = \\left(\\frac{n}{n_m} - 1\\right)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)$$

A glass lens ($n = 1.5$) in water ($n_m = 1.33$) has a factor of $0.13$ instead of $0.5$: its focal length is almost four times longer. Your cornea ($n = 1.376$) loses nearly all its power under water for the same reason, which is why everything is blurred until you put on goggles and restore the air in front of your eyes. If the lens has the *lower* index — an air bubble in water — the factor turns negative and a convex bubble diverges light.

### Colour
Because $n$ depends on wavelength ([[dispersion]]), so does $f$: a single lens focuses blue light a little closer than red. That is chromatic aberration.
`,
  ideas: [
    'Focal length depends on the index contrast (n − 1, or n/nₘ − 1) and on the curvature of both faces.',
    'With light travelling left to right, R > 0 when the centre of curvature is on the right; a biconvex lens has R₁ > 0 and R₂ < 0.',
    'Only 1/R₁ − 1/R₂ matters, so a thin lens has the same focal length either way round.',
    'In water a glass lens becomes much weaker, and a lens of lower index than its surroundings reverses its action.'
  ],
  pitfalls: [
    'Giving both radii of a biconvex lens the same sign — With the convention, the second face of a biconvex lens has a negative radius, and the two terms add rather than cancel.',
    'A lens has one fixed focal length — It depends on the surrounding medium and, through dispersion, on the wavelength.',
    'Only the front face focuses — Both faces contribute; for a symmetric biconvex lens each face provides half the power.'
  ],
  derivation: {
    title: 'The lensmaker\'s equation from two refracting surfaces',
    steps: [
      { text: 'For small angles, a single spherical surface of radius $R$ between indices $n_1$ and $n_2$ images an object at distance $s$ to a distance $s\'$ given by', tex: '\\frac{n_1}{s} + \\frac{n_2}{s\'} = \\frac{n_2 - n_1}{R}' },
      { text: 'First surface, from air into glass (radius $R_1$), object at $d_o$, intermediate image at $s_1\'$:', tex: '\\frac{1}{d_o} + \\frac{n}{s_1\'} = \\frac{n - 1}{R_1}' },
      { text: 'That image is the object for the second surface. In a thin lens it lies on the outgoing side, so it is a virtual object at distance $-s_1\'$; the light goes from glass into air (radius $R_2$):', tex: '\\frac{n}{-s_1\'} + \\frac{1}{d_i} = \\frac{1 - n}{R_2}' },
      { text: 'Add the two equations: the intermediate image drops out.', tex: '\\frac{1}{d_o} + \\frac{1}{d_i} = (n - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)' },
      { text: 'Comparing with the thin-lens equation $1/d_o + 1/d_i = 1/f$ identifies the right-hand side as $1/f$. In a medium of index $n_m$ the same steps give $n/n_m$ in place of $n$.' }
    ]
  },
  formulas: [
    {
      name: 'Lensmaker\'s equation (lens in air)',
      expr: '1/f = (n - 1)*(1/R1 - 1/R2)', tex: '\\frac{1}{f} = (n - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)', solveFor: 'f',
      vars: {
        f: { name: 'focal length', q: 'length', unit: 'cm', signed: true },
        n: { name: 'refractive index of the lens', value: 1.50 },
        R1: { name: 'radius of the first face (+ if its centre is beyond it)', q: 'length', unit: 'cm', value: 20, signed: true, tex: 'R_1' },
        R2: { name: 'radius of the second face (+ if its centre is beyond it)', q: 'length', unit: 'cm', value: -20, signed: true, tex: 'R_2' }
      },
      note: 'Light travels from the first face to the second. A biconvex lens has $R_1 > 0$ and $R_2 < 0$.',
      stories: {
        f: 'A biconvex lens of index {n} has radii {R1} and {R2}. What is its focal length?',
        R1: 'A lens of index {n} has a second face of radius {R2}. What must the first radius be for a focal length of {f}?'
      }
    },
    {
      name: 'Lens in a surrounding medium',
      expr: '1/f = (n/nm - 1)*(1/R1 - 1/R2)', tex: '\\frac{1}{f} = \\left(\\frac{n}{n_m} - 1\\right)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)', solveFor: 'f',
      vars: {
        f: { name: 'focal length in the medium', q: 'length', unit: 'cm', signed: true },
        n: { name: 'refractive index of the lens', value: 1.50 },
        nm: { name: 'refractive index of the surroundings', value: 1.33, tex: 'n_m' },
        R1: { name: 'radius of the first face', q: 'length', unit: 'cm', value: 20, signed: true, tex: 'R_1' },
        R2: { name: 'radius of the second face', q: 'length', unit: 'cm', value: -20, signed: true, tex: 'R_2' }
      },
      stories: { f: 'A glass lens of index {n} with radii {R1} and {R2} is dropped into a liquid of index {nm}. What is its focal length there?' }
    },
    {
      name: 'Plano-convex lens',
      expr: 'f = R/(n - 1)',
      vars: {
        f: { name: 'focal length', q: 'length', unit: 'cm' },
        R: { name: 'radius of the curved face', q: 'length', unit: 'cm', value: 10 },
        n: { name: 'refractive index', value: 1.50 }
      },
      stories: { R: 'A plano-convex lens of index {n} must have a focal length of {f}. What radius should its curved face be ground to?' }
    }
  ],
  examples: [
    {
      title: 'Grinding a magnifier',
      q: 'You want a symmetric biconvex magnifier with $f = 5.0$ cm from crown glass ($n = 1.52$). What radius must each face have?',
      steps: [
        'Symmetric biconvex: $R_1 = +R$, $R_2 = -R$, so $\\dfrac{1}{R_1} - \\dfrac{1}{R_2} = \\dfrac{2}{R}$.',
        '$\\dfrac{1}{f} = (n - 1)\\dfrac{2}{R} \\;\\Rightarrow\\; R = 2(n - 1)f = 2 \\times 0.52 \\times 5.0\\ \\mathrm{cm}$.',
        '$R = 5.2\\ \\mathrm{cm}$.'
      ],
      a: 'Each face needs a radius of 5.2 cm.'
    },
    {
      title: 'A lens in water',
      q: 'A glass lens ($n = 1.50$) with $R_1 = 20$ cm and $R_2 = -20$ cm has $f = 20$ cm in air. What is its focal length in water ($n_m = 1.33$)?',
      steps: [
        'In air: $(1.50 - 1)(1/20 + 1/20) = 0.050\\ \\mathrm{cm^{-1}}$, so $f = 20$ cm.',
        'In water: $\\left(\\dfrac{1.50}{1.33} - 1\\right) = 0.128$, and $0.128 \\times 0.10 = 0.0128\\ \\mathrm{cm^{-1}}$.',
        '$f = 1/0.0128 = 78\\ \\mathrm{cm}$ — almost four times longer.'
      ],
      a: 'About 78 cm: the lens is roughly four times weaker under water.'
    }
  ],
  quiz: [
    { q: 'A glass converging lens is moved from air into water. Its focal length…', choices: ['gets shorter', 'gets longer', 'stays the same', 'becomes negative'], a: 1,
      why: 'The factor $n/n_m - 1$ drops from 0.5 to about 0.13, so the lens bends light less and $f$ grows.' },
    { q: 'A biconvex lens with $R_1 = +15$ cm and $R_2 = -15$ cm is made of glass with $n = 1.5$. Its focal length is…', choices: ['7.5 cm', '15 cm', '30 cm', 'infinite'], a: 1,
      why: '$1/f = 0.5 \\times (1/15 + 1/15) = 1/15$, so $f = 15$ cm.' },
    { q: 'A biconvex "lens" made of air (a bubble) inside water…', choices: ['converges light', 'diverges light', 'has no effect', 'reflects all the light'], a: 1,
      why: 'Here $n/n_m = 1/1.33 < 1$, so the factor is negative and the convex shape diverges.' },
    { q: 'Turning a thin lens round, so that light meets the other face first, changes its focal length.', a: false,
      why: 'Flipping it makes the new radii $-R_2$ and $-R_1$, and $1/(-R_2) - 1/(-R_1) = 1/R_1 - 1/R_2$: the same value.' },
    { q: 'Why is your vision blurred when you open your eyes under water?', choices: ['Water absorbs the light', 'The cornea loses most of its focusing power', 'The pupil closes', 'The lens of the eye becomes rigid'], a: 1,
      why: 'The cornea (n = 1.376) does most of the eye\'s focusing because of the big jump from air. Against water (1.333) that jump nearly vanishes.' }
  ],
  applications: [
    'Designing spectacle and contact lenses of a required power.',
    'Swimming goggles and diving masks, which restore an air layer in front of the eye.',
    'Choosing lens shapes that minimise aberrations in cameras and microscopes.'
  ]
},

{
  id: 'magnification', parent: 'geometric-optics', title: 'Magnification', level: 2,
  short: 'How much bigger an image is: lateral magnification compares image and object heights, angular magnification compares how large something looks through an instrument and to the naked eye.',
  keywords: ['magnification', 'lateral magnification', 'linear magnification', 'angular magnification', 'magnifying glass', 'loupe', 'near point', 'image height', 'inverted image', 'upright image'],
  prereq: ['thin-lenses', 'math:similar-triangles'],
  related: ['spherical-mirrors', 'optical-instruments', 'the-eye'],
  body: `
### Lateral magnification
The ray through the centre of a [[thin-lenses|thin lens]] goes straight on, so the object, the image and the lens centre form two similar triangles. The ratio of heights is the **lateral magnification**:

$$m = \\frac{h_i}{h_o} = -\\frac{d_i}{d_o}$$

The sign carries the orientation: with real-is-positive distances, a real image ($d_i > 0$) comes out with $m < 0$ — **inverted** — and a virtual image with $m > 0$, upright. $|m| > 1$ means enlarged. The same formula holds for [[spherical-mirrors|mirrors]].

"Magnification" is just a ratio and is often far below 1. A 50 mm camera lens photographing a person 5 m away has $d_i \\approx 50.5$ mm and $m \\approx -0.010$: a 1.8 m person becomes an 18 mm image on the sensor. A cinema projector, by contrast, works at $m \\approx -300$.

### Angular magnification
What decides how big something *looks* is the angle it subtends at your eye, which sets the size of its image on the retina. Bringing an object closer makes that angle larger — but only down to your **near point** $N$, conventionally 25 cm, the closest distance at which a normal eye can focus.

A **magnifying glass** gets round this. Place the object at (or just inside) the focal point of a converging lens held near the eye: the lens forms a virtual image far away that the eye views comfortably, and the object subtends an angle of about $h/f$ instead of $h/N$. The **angular magnification** is

$$M = \\frac{N}{f} \\quad\\text{(relaxed eye, image at infinity)}, \\qquad M = 1 + \\frac{N}{f} \\quad\\text{(image at the near point)}$$

A lens with $f = 5$ cm magnifies 5 times with a relaxed eye and 6 times at most. The "10×" jeweller's loupe has $f = 2.5$ cm. Beyond about 20× the lens must be so small and strongly curved that its aberrations spoil the view — the job passes to the [[optical-instruments|compound microscope]].

> [!key] Lateral magnification compares sizes of object and image; angular magnification compares angles at the eye. For a magnifier the image is virtual and huge, but what matters is how big it looks.
`,
  ideas: [
    'Lateral magnification m = h_i/h_o = −d_i/d_o; negative means inverted.',
    'How large something looks depends on the angle it subtends at the eye.',
    'A magnifier lets you hold the object closer than your near point: M = N/f with a relaxed eye.',
    'Magnification is a ratio: cameras and eyes work with |m| much smaller than 1.'
  ],
  pitfalls: [
    'A negative magnification is a mistake — It means the image is inverted, which is normal for every real image formed by a single lens.',
    'Magnification is always greater than 1 — Cameras and the eye produce images tens or thousands of times smaller than the object.',
    'A lens with a longer focal length magnifies more — For a magnifier it is the other way round: M = N/f, so shorter focal lengths magnify more.'
  ],
  derivation: {
    title: 'Angular magnification of a magnifying glass',
    steps: [
      { text: 'Without the lens, the largest clear view is with the object at the near point $N$. An object of height $h$ then subtends', tex: '\\theta_0 \\approx \\frac{h}{N}' },
      { text: 'With the object at the focal point of a lens held at the eye, the rays from each point leave parallel. The ray through the centre is undeviated, so the angle is', tex: '\\theta \\approx \\frac{h}{f}' },
      { text: 'The angular magnification for a relaxed eye is the ratio:', tex: 'M = \\frac{\\theta}{\\theta_0} = \\frac{N}{f}' },
      { text: 'If instead the virtual image is placed at the near point ($d_i = -N$), the thin-lens equation gives $d_o = Nf/(N + f)$, and', tex: 'M = \\frac{h/d_o}{h/N} = \\frac{N}{d_o} = 1 + \\frac{N}{f}' }
    ]
  },
  formulas: [
    {
      name: 'Lateral magnification',
      expr: 'h_i/h_o = -d_i/d_o', tex: '\\frac{h_i}{h_o} = -\\frac{d_i}{d_o}', solveFor: 'h_i',
      vars: {
        h_i: { name: 'image height (− inverted)', q: 'length', unit: 'mm', signed: true, tex: 'h_i' },
        h_o: { name: 'object height', q: 'length', unit: 'm', value: 1.8, tex: 'h_o' },
        d_i: { name: 'image distance', q: 'length', unit: 'mm', value: 50.5, signed: true, tex: 'd_i' },
        d_o: { name: 'object distance', q: 'length', unit: 'm', value: 5, tex: 'd_o' }
      },
      stories: {
        h_i: 'A camera lens forms an image {d_i} behind it of a person {h_o} tall standing {d_o} away. How tall is the image on the sensor?',
        h_o: 'A tree {d_o} away forms an image of height {h_i} at {d_i} behind a lens. How tall is the tree?'
      }
    },
    {
      name: 'Magnifying glass, relaxed eye',
      expr: 'M = N/f',
      vars: {
        M: { name: 'angular magnification' },
        N: { name: 'near-point distance', q: 'length', unit: 'cm', value: 25 },
        f: { name: 'focal length of the lens', q: 'length', unit: 'cm', value: 5 }
      },
      stories: { M: 'How much does a magnifying glass of focal length {f} magnify for a relaxed eye with a near point of {N}?', f: 'What focal length does a {M}-times loupe need (near point {N})?' }
    },
    {
      name: 'Magnifying glass, image at the near point',
      expr: 'M = 1 + N/f',
      vars: {
        M: { name: 'angular magnification' },
        N: { name: 'near-point distance', q: 'length', unit: 'cm', value: 25 },
        f: { name: 'focal length of the lens', q: 'length', unit: 'cm', value: 5 }
      },
      note: 'The largest magnification a simple magnifier gives, at the cost of the eye straining to focus at its near point.'
    }
  ],
  examples: [
    {
      title: 'A person on a camera sensor',
      q: 'A camera with a 50 mm lens photographs a person 1.8 m tall standing 5.0 m away. Where is the image and how tall is it?',
      steps: [
        '$\\dfrac{1}{d_i} = \\dfrac{1}{50} - \\dfrac{1}{5000} = 0.0198\\ \\mathrm{mm^{-1}}$, so $d_i = 50.5\\ \\mathrm{mm}$ — the lens moves half a millimetre out from its infinity setting.',
        '$m = -d_i/d_o = -50.5/5000 = -0.0101$.',
        '$h_i = m h_o = -0.0101 \\times 1800\\ \\mathrm{mm} = -18.2\\ \\mathrm{mm}$: inverted, and about half the height of a full-frame sensor.'
      ],
      a: 'At 50.5 mm behind the lens; 18 mm tall and inverted.'
    },
    {
      title: 'A jeweller\'s loupe',
      q: 'A loupe has a focal length of 2.5 cm. What angular magnification does it give?',
      steps: [
        'Relaxed eye: $M = N/f = 25/2.5 = 10$.',
        'Image at the near point: $M = 1 + 10 = 11$.',
        'A detail 0.1 mm across then looks as large as a 1 mm detail at 25 cm.'
      ],
      a: '10× relaxed, 11× at most.'
    }
  ],
  quiz: [
    { q: 'A lens forms an image with $m = -0.5$. The image is…', choices: ['upright and half the size', 'inverted and half the size', 'inverted and twice the size', 'virtual and half the size'], a: 1,
      why: 'Negative $m$ means inverted; $|m| = 0.5$ means half size. With a single lens it is also real.' },
    { q: 'A magnifying glass has a focal length of 10 cm. With a relaxed eye it magnifies…', choices: ['0.4×', '2.5×', '3.5×', '10×'], a: 1, why: '$M = N/f = 25/10 = 2.5$.' },
    { q: 'A single lens forms an image of a real object with $m = +3$. The image must be…', choices: ['real and inverted', 'virtual and upright', 'real and upright', 'at infinity'], a: 1,
      why: 'Positive $m$ means $d_i < 0$: a virtual, upright image — a converging lens used as a magnifier.' },
    { q: 'Doubling the focal length of a magnifying glass doubles its magnification.', a: false, why: '$M = N/f$: doubling $f$ halves the magnification.' }
  ],
  applications: [
    'Reading glasses, loupes and the magnifiers built into phones and watches.',
    'Choosing lenses for cameras: the magnification sets how big a subject appears on the sensor.',
    'Eyepieces of microscopes and telescopes, which are magnifiers for an intermediate image.'
  ],
  sim: { id: 'light-lens', params: { f: 10, d: 6 } }
},

{
  id: 'optical-instruments', parent: 'geometric-optics', title: 'Optical instruments', level: 2,
  short: 'Cameras, microscopes and telescopes: combinations of lenses and mirrors that record, enlarge or bring closer what the eye alone cannot see.',
  keywords: ['camera', 'f-number', 'aperture', 'exposure', 'microscope', 'compound microscope', 'telescope', 'refracting telescope', 'reflecting telescope', 'eyepiece', 'objective', 'binoculars', 'light-gathering power'],
  prereq: ['thin-lenses', 'magnification'],
  related: ['resolution', 'the-eye', 'spherical-mirrors', 'total-internal-reflection'],
  body: `
### The camera
A converging lens forms a real, inverted, reduced image on a sensor. Focusing moves the lens slightly: for a distant scene the sensor sits at the focal length, for a subject at 1 m a 50 mm lens must move out by about 2.6 mm. The **f-number** is the focal length divided by the aperture diameter,

$$N = \\frac{f}{D}$$

and the light reaching each part of the sensor goes as $1/N^2$. The standard stops — f/1.4, 2, 2.8, 4, 5.6, 8, 11, 16 — differ by $\\sqrt 2$, so each step halves the light. Stopping down also deepens the range of distances that look sharp (the depth of field).

### The compound microscope
A magnifying glass runs out of steam at about 20×. A microscope uses two stages. The **objective**, a lens of very short focal length $f_o$ (a few millimetres), forms a real, enlarged image inside the tube; the **eyepiece** (focal length $f_e$) is a magnifier for that image. With the standard tube length $L$ between the objective's rear focal point and the intermediate image (160 mm on classic instruments),

$$M \\approx \\frac{L}{f_o} \\cdot \\frac{25\\ \\mathrm{cm}}{f_e}$$

A 4 mm objective and a 25 mm eyepiece give $40 \\times 10 = 400\\times$ (the image is inverted). Beyond about 1000× no new detail appears: [[resolution|diffraction]] limits a light microscope to about 0.2 µm.

### The telescope
An astronomical (Keplerian) telescope has a long-focus objective that forms a real image of the distant object at its focal point, and an eyepiece that views that image as a magnifier. The lenses are $f_o + f_e$ apart, and the angular magnification is

$$M = \\frac{f_o}{f_e}$$

(the view is inverted). A 1000 mm objective with a 25 mm eyepiece gives 40×. Galileo's design used a diverging eyepiece and gave an upright image; binoculars are two Keplerian telescopes with [[total-internal-reflection|prisms]] that re-erect the image and fold the length. "8 × 42" means 8× with 42 mm objectives.

### Aperture is everything
Magnification only spreads what the objective collects over a wider angle. What makes a telescope good is its **aperture** $D$: the light collected grows as $D^2$, and the finest resolvable detail as $\\lambda/D$. That is why the great telescopes are **reflectors**: a [[spherical-mirrors|mirror]] has no chromatic aberration and can be supported across its back, so it can be made many metres across. Newton built the first practical reflector in 1668; today's giants have segmented mirrors 10 m wide, and the Extremely Large Telescope will reach 39 m.
`,
  ideas: [
    'A camera forms a real image on a sensor; each full f-stop (a factor √2 in N) halves the light.',
    'A microscope multiplies the objective\'s lateral magnification by the eyepiece\'s angular magnification.',
    'A telescope\'s angular magnification is f_o/f_e.',
    'Aperture decides light gathering (∝ D²) and resolution (∝ λ/D); magnification only enlarges.'
  ],
  pitfalls: [
    'A higher f-number lets in more light — It is the reverse: N = f/D, so f/16 is a small aperture and f/1.4 a large one.',
    'High magnification makes a good telescope — Aperture does. Magnification beyond about twice the aperture in millimetres shows only a bigger blur.',
    'The eyepiece does most of the magnifying in a microscope — The objective typically provides 10–100×; the eyepiece adds about 10×.'
  ],
  formulas: [
    {
      name: 'Telescope magnification',
      expr: 'M = f_o/f_e', tex: 'M = \\frac{f_o}{f_e}',
      vars: {
        M: { name: 'angular magnification (image inverted)' },
        f_o: { name: 'focal length of the objective', q: 'length', unit: 'mm', value: 1000, tex: 'f_o' },
        f_e: { name: 'focal length of the eyepiece', q: 'length', unit: 'mm', value: 25, tex: 'f_e' }
      },
      stories: { M: 'A telescope has an objective of focal length {f_o} and an eyepiece of {f_e}. What is its magnification?', f_e: 'Which eyepiece gives {M} on a telescope with a {f_o} objective?' }
    },
    {
      name: 'Compound microscope magnification',
      expr: 'M = L/f_o*(0.25/f_e)', tex: 'M = \\frac{L}{f_o} \\cdot \\frac{25\\ \\mathrm{cm}}{f_e}',
      vars: {
        M: { name: 'overall magnification (image inverted)' },
        L: { name: 'tube length', q: 'length', unit: 'mm', value: 160 },
        f_o: { name: 'focal length of the objective', q: 'length', unit: 'mm', value: 4, tex: 'f_o' },
        f_e: { name: 'focal length of the eyepiece', q: 'length', unit: 'mm', value: 25, tex: 'f_e' }
      },
      note: 'The 25 cm is the conventional near-point distance used to rate eyepieces.',
      stories: { M: 'A microscope has a tube length of {L}, an objective of focal length {f_o} and an eyepiece of {f_e}. What is its magnification?' }
    },
    {
      name: 'f-number of a camera lens',
      expr: 'N = f/D',
      vars: {
        N: { name: 'f-number' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 50 },
        D: { name: 'aperture diameter', q: 'length', unit: 'mm', value: 12.5 }
      },
      stories: { D: 'A {f} lens is set to f/{N}. How wide is the aperture?', N: 'A lens of focal length {f} has an aperture {D} across. What is its f-number?' }
    },
    {
      name: 'Light-gathering ratio of two apertures',
      expr: 'G = (D1/D2)^2', tex: 'G = \\left(\\frac{D_1}{D_2}\\right)^2',
      vars: {
        G: { name: 'ratio of light collected' },
        D1: { name: 'aperture of the instrument', q: 'length', unit: 'mm', value: 200, tex: 'D_1' },
        D2: { name: 'aperture compared with (e.g. the dark-adapted pupil)', q: 'length', unit: 'mm', value: 7, tex: 'D_2' }
      },
      stories: { G: 'How many times more light does a telescope of aperture {D1} collect than an eye with a {D2} pupil?' }
    }
  ],
  examples: [
    {
      title: 'Choosing an eyepiece',
      q: 'A telescope has a 150 mm aperture and a 1200 mm objective. What magnifications do 25 mm and 10 mm eyepieces give, and is either too high?',
      steps: [
        '$M = f_o/f_e$: $1200/25 = 48\\times$ and $1200/10 = 120\\times$.',
        'A common rule of thumb puts the useful maximum at about twice the aperture in millimetres: $2 \\times 150 = 300\\times$.',
        'Both are well within it; on a steady night the 10 mm eyepiece will show planets nicely.'
      ],
      a: '48× and 120×; both are sensible for a 150 mm telescope.'
    },
    {
      title: 'Two stops down',
      q: 'A correct exposure is 1/500 s at f/2. What shutter time gives the same exposure at f/4?',
      steps: [
        'Light per unit area goes as $1/N^2$: going from f/2 to f/4 lets in $(2/4)^2 = 1/4$ as much light.',
        'The shutter must stay open four times as long: $4 \\times 1/500 = 1/125$ s.',
        'That is two full stops: f/2 → f/2.8 → f/4.'
      ],
      a: '1/125 s.'
    }
  ],
  quiz: [
    { q: 'Changing a lens from f/2.8 to f/5.6 changes the light reaching the sensor by a factor of…', choices: ['2', '1/2', '1/4', '4'], a: 2, why: 'Light goes as $1/N^2$: $(2.8/5.6)^2 = 1/4$ — two stops.' },
    { q: 'To increase a telescope\'s magnification you should…', choices: ['use an eyepiece of shorter focal length', 'use an eyepiece of longer focal length', 'use a smaller objective', 'move the eyepiece closer to the objective'], a: 0, why: '$M = f_o/f_e$, so a shorter $f_e$ gives a larger $M$.' },
    { q: 'The largest astronomical telescopes are reflectors mainly because…', choices: ['mirrors magnify more', 'large mirrors can be supported from behind and show no chromatic aberration', 'lenses cannot focus starlight', 'mirrors are lighter per square metre than glass'], a: 1,
      why: 'A big lens can only be held at its edge and sags, absorbs light and disperses colours; a mirror avoids all three.' },
    { q: 'Enlarging a microscope image from 1000× to 5000× reveals proportionally finer detail.', a: false,
      why: 'Detail is limited by diffraction to about half a wavelength. Extra magnification beyond about 1000× is "empty".' },
    { q: 'What mainly determines how faint a star a telescope can show?', choices: ['Its magnification', 'Its aperture', 'The eyepiece focal length', 'The length of its tube'], a: 1, why: 'The light collected grows with the area of the aperture, $\\propto D^2$.' }
  ],
  applications: [
    'Phone and system cameras, with lenses specified by focal length and f-number.',
    'Light microscopes in biology and medicine; stereo microscopes for surgery and electronics.',
    'Binoculars, spotting scopes and astronomical telescopes.'
  ],
  history: 'Hans Lippershey applied for a telescope patent in 1608 and Galileo turned one on the sky in 1609–10. Robert Hooke\'s Micrographia (1665) and Antonie van Leeuwenhoek\'s single-lens microscopes of the 1670s opened up the microscopic world.'
}

);
