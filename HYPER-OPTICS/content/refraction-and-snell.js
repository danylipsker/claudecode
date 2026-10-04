/* HYPER-OPTICS · content/refraction-and-snell.js — the topic "Refraction and Snell's law".
 * Concepts (snells-law itself is in content/reference.js):
 *   refraction-at-a-flat-surface · critical-angle-and-total-internal-reflection · fresnel-reflection · brewster-angle ·
 *   prism-deviation · dispersion-and-the-spectrum · rainbows · atmospheric-refraction ·
 *   evanescent-waves-and-frustrated-tir · gradient-index-optics · refraction-at-a-curved-surface
 * Simulations: sims/refraction-and-snell.js (ids rs-…).
 */
Hyper.add(

/* ================================================================ flat surfaces */
{
  id: 'refraction-at-a-flat-surface', parent: 'refraction-and-snell', title: 'Flat surfaces: apparent depth and the shifted ray', level: 1,
  short: 'A flat refracting surface forms no real image, but it moves things: a pool looks three quarters as deep as it is, a straw seems to break at the water line, a window shifts a ray sideways, and a plate of glass in a converging beam pushes the focus back by about a third of its thickness.',
  keywords: ['apparent depth', 'real depth', 'bent straw', 'plane-parallel plate', 'lateral displacement', 'beam shift', 'focus shift', 'flat port', 'window', 'cover glass', 'coverslip', 'pool', 'fish', 'refraction at a plane surface'],
  prereq: ['snells-law', 'refractive-index'],
  related: ['refraction-at-a-curved-surface', 'critical-angle-and-total-internal-reflection', 'fresnel-reflection', 'optical-windows', 'real-and-virtual-images', 'c-mount', 'physics:refraction'],
  body: `
Look straight down into a swimming pool and the bottom seems nearer than it is; stand a pencil in a glass of water and it seems to break at the surface. A flat surface cannot focus light, so there is no real image to speak of. But every ray that crosses it is bent by [[snells-law|Snell's law]], and the eye, which assumes that light travels in straight lines, puts things where the bent rays *seem* to come from.

### Apparent depth
Take a point on the bottom of a pool, a real depth $d$ below the surface, and look at it from above. Rays leave the point at slightly different angles, bend away from the normal as they leave the water, and the eye extends them backwards until they meet — at a point *above* the real one. For rays close to the normal, Snell's law reduces to

$$d_{\\mathrm{app}} = d\\,\\frac{n_{v}}{n_{o}}$$

where $n_o$ is the index of the medium holding the object and $n_v$ that of the medium the viewer is in. A 2 m deep pool of water ($n = 1.333$) seen from air looks 1.5 m deep. The rule runs both ways: a diver sees a gull 1.33 times higher than it is.

| Looking from air into | $n$ | A real 1.00 m looks like |
|---|---|---|
| water | 1.333 | 0.75 m |
| ethanol | 1.361 | 0.73 m |
| acrylic (PMMA) | 1.492 | 0.67 m |
| N-BK7 crown glass | 1.517 | 0.66 m |
| dense flint N-SF11 | 1.785 | 0.56 m |
| diamond | 2.418 | 0.41 m |

The rule is exact only for rays close to the normal. Look obliquely and the depth shrinks and splits in two: at 45° the rays in the vertical plane through your line of sight seem to come from 0.43 of the real depth, rays out of that plane from 0.63. A flat surface has no single image point once you leave the normal, so the picture is smeared.

### The bent straw
The part of the straw under water is raised by the same effect. The point where the straw enters the water has zero depth and does not move at all; the straw therefore seems to break exactly there.

### A plate shifts a ray sideways
A window or filter has two parallel faces. A ray bends into it and by the same angle back out, so it leaves *parallel* to its original direction, but displaced by

$$s = t\\,\\frac{\\sin(\\theta_1 - \\theta_2)}{\\cos\\theta_2}$$

for a plate of thickness $t$. For 10 mm of N-BK7: 2.0 mm at 30°, 3.3 mm at 45°, 5.2 mm at 60°. For small angles $s \\approx t\\,\\theta_1\\,(n-1)/n$. Direction is untouched, so a window distorts nothing; it only slides the picture by a fraction of its thickness.

### A plate in a converging beam
Put the plate into a converging beam, such as the light behind a lens, and the focus moves away from the lens by

$$\\Delta z = t\\,\\frac{n - 1}{n}$$

about a third of the thickness for glass. A 3 mm filter of index 1.52 moves the focus by 1.03 mm; the camera is built for it ([[c-mount]]). The plate also bends marginal rays differently from central ones and adds a little spherical aberration, which is why microscope objectives are designed for a cover slip of one exact thickness, 0.17 mm.

### Looking through water: flat ports
Behind a flat window under water, rays are refracted again on entering the air of the housing. A lens that covers 90° in air sees only 64° of water, and everything looks 1.33 times larger and nearer.

> [!key] A flat surface moves things but does not focus them: apparent depth is real depth times $n_{\\text{viewer}}/n_{\\text{object}}$ for rays near the normal, a plate shifts a ray sideways without turning it, and in a converging beam it pushes the focus back by $t(n-1)/n$.
`,
  ideas: [
    'A flat refracting surface forms no real image; it shifts where things appear. For rays near the normal, apparent depth = real depth × n(viewer) / n(object).',
    'From air, things in water look a quarter nearer the surface and things in glass about a third nearer.',
    'A plane-parallel plate leaves the direction of a ray unchanged and displaces it sideways by t sin(θ₁ − θ₂)/cos θ₂.',
    'In a converging beam a plate of thickness t moves the focus away from the lens by t(n − 1)/n.',
    'These rules are exact only close to the normal; viewed obliquely, objects look less deep and the picture is smeared.'
  ],
  pitfalls: [
    'The fish is where it seems to be — Seen from above it is about a third deeper and farther away than it looks. A spear aimed at the image passes above it; aim below it (the archerfish, shooting upwards, corrects for the same bending).',
    'A window bends the light, so things behind it appear in a different direction — The ray leaves parallel to the way it came, only displaced sideways by a fraction of the thickness. A thin window is practically invisible; a thick block of glass slides the picture, nothing more.',
    'The water makes things exactly 3/4 as deep, whatever the angle — That holds only for viewing along the normal. At 45° the factor is already 0.63 across the line of sight and 0.43 along it, and a lens behind a flat port sees its whole field squeezed.'
  ],
  terms: [
    { term: 'Apparent depth', def: 'The depth at which an object under a flat refracting surface seems to lie, found by tracing the refracted rays back in straight lines. For near-normal viewing it is the real depth times n(viewer)/n(object).' },
    { term: 'Plane-parallel plate', also: ['window', 'flat plate', 'cover glass'], def: 'A piece of transparent material with two flat parallel faces: a window, filter, cover slip or sensor cover glass. It does not turn rays but shifts them.' },
    { term: 'Lateral displacement', also: ['beam shift', 'sideways shift'], def: 'The sideways distance by which a ray leaving a tilted plate is offset from its original line: s = t sin(θ₁ − θ₂)/cos θ₂.' },
    { term: 'Focus shift', also: ['longitudinal displacement', 'image shift'], def: 'The distance a plate of thickness t and index n moves the focus of a converging beam away from the lens: t(n − 1)/n.' },
    { term: 'Flat port', also: ['dome port'], def: 'A flat window through which a camera looks into water. It refracts the whole field: the angle of view shrinks by about the factor 1.33 and objects look nearer and larger. A dome port avoids this.' }
  ],
  formulas: [
    {
      name: 'Apparent depth',
      expr: 'da = d*nv/no', tex: 'd_{\\mathrm{app}} = d\\,\\frac{n_v}{n_o}',
      vars: {
        da: { name: 'apparent depth', q: 'length', unit: 'm', tex: 'd_{\\mathrm{app}}' },
        d: { name: 'real depth of the object', q: 'length', unit: 'm', value: 2, tex: 'd' },
        nv: { name: 'index of the medium the viewer is in', value: 1, min: 1, max: 4, tex: 'n_v' },
        no: { name: 'index of the medium the object is in', value: 1.333, min: 1, max: 4, tex: 'n_o' }
      },
      solveFor: 'da',
      note: 'For viewing close to the normal. From air into water the factor is 3/4; from water into air it is 4/3.',
      stories: {
        da: 'A pool of water is {d} deep. How deep does the bottom seem when looked at from straight above?',
        d: 'A fish looks to be {da} below the surface when seen from straight above. How deep is it really? (The viewer is in air, n = {nv}; the fish is in water, n = {no}.)'
      }
    },
    {
      name: 'Sideways shift through a plate',
      expr: 's = t*sin(a)*(1 - cos(a)/sqrt(n^2 - sin(a)^2))', tex: 's = t\\,\\sin\\theta_1\\left(1 - \\frac{\\cos\\theta_1}{\\sqrt{n^2 - \\sin^2\\theta_1}}\\right)',
      vars: {
        s: { name: 'lateral displacement of the ray', q: 'length', unit: 'mm' },
        t: { name: 'thickness of the plate', q: 'length', unit: 'mm', value: 10 },
        a: { name: 'angle of incidence', q: 'angle', unit: '°', value: 45, min: 0, max: 89, tex: '\\theta_1' },
        n: { name: 'refractive index of the plate', value: 1.517, min: 1.05, max: 4 }
      },
      solveFor: 's',
      note: 'Equal to t sin(θ₁ − θ₂)/cos θ₂. The ray leaves parallel to its original direction.',
      stories: { s: 'A ray crosses a {t} thick plate of index {n} at {a} from the normal. How far is it shifted sideways?' }
    },
    {
      name: 'Focus shift caused by a plate',
      expr: 'dz = t*(n - 1)/n', tex: '\\Delta z = t\\,\\frac{n - 1}{n}',
      vars: {
        dz: { name: 'how far the focus moves back', q: 'length', unit: 'mm', tex: '\\Delta z' },
        t: { name: 'thickness of the plate', q: 'length', unit: 'mm', value: 3 },
        n: { name: 'refractive index of the plate', value: 1.52, min: 1.05, max: 4 }
      },
      solveFor: 'dz',
      note: 'Paraxial rays in a converging or diverging beam. In a collimated beam a plate moves nothing.',
      stories: { dz: 'A {t} thick filter of index {n} is put into the converging beam behind a lens. How far does the focus move?' }
    }
  ],
  examples: [
    {
      title: 'How deep is the fish?',
      q: 'Looking almost straight down, you judge a fish to be 0.90 m below the surface of a pond. How deep is it really, and where should a spear be aimed?',
      steps: [
        'The fish is in water, the viewer in air: $d_{\\text{app}} = d \\times n_{\\text{air}}/n_{\\text{water}} = d/1.333$.',
        { text: 'Solve for the real depth:', tex: 'd = 1.333 \\times 0.90\\ \\mathrm{m} = 1.20\\ \\mathrm{m}' },
        'The fish is a third deeper than it looks. A spear aimed at the image passes over it; the spear must aim lower, at the real position.'
      ],
      a: '1.20 m deep. The 3/4 rule holds for a look straight down; from a low angle the fish seems even shallower and the correction is larger.'
    },
    {
      title: 'The filter in front of the sensor',
      q: 'A camera has a 2.0 mm infrared-blocking filter and a 0.5 mm cover glass in front of its sensor, both of index 1.52. By how much do they move the focus compared with a camera with no glass?',
      steps: [
        'Both plates sit in the converging beam, so their effects add. Total thickness 2.5 mm.',
        { text: 'The focus shift is', tex: '\\Delta z = t\\,\\frac{n-1}{n} = 2.5 \\times \\frac{0.52}{1.52} = 0.86\\ \\mathrm{mm}' },
        'The image forms 0.86 mm farther from the lens than it would without the glass; the sensor sits at that distance.'
      ],
      a: '0.86 mm farther back. The lens is designed, and the flange distance set, with the glass in place.'
    }
  ],
  quiz: [
    { q: 'You look straight down into a 1.8 m deep pool of clear water. About how deep does the bottom appear?', choices: ['0.9 m', '1.35 m', '1.8 m', '2.4 m'], a: 1, why: 'Apparent depth = real depth × 1/1.333 = 0.75 × 1.8 m = 1.35 m. 2.4 m would be the result of multiplying instead of dividing — what a diver sees looking up.' },
    { q: 'A ray crosses a window with parallel faces. It leaves in a different direction from the one it arrived in.', a: false, why: 'The second face undoes the bend of the first: the ray leaves parallel to its original direction, only displaced sideways.' },
    { q: 'A 6 mm thick plate of index 1.5 is put into the converging beam behind a lens. By how many millimetres does the focus move?', answer: 2, unit: 'mm', why: '$\\Delta z = t(n-1)/n = 6 \\times 0.5/1.5 = 2.0$ mm, away from the lens.' },
    { q: 'A diver, 30 m below the surface, looks straight up at a bird directly overhead at a real height of 30 m. How high does it seem to be?', choices: ['22.5 m', '30 m', '40 m', 'It cannot be seen'], a: 2, why: 'From water into air the factor is $n_{\\text{water}}/n_{\\text{air}} = 1.333$, so the bird appears at 40 m. The bird is at a height of 30 m (the diver\'s own depth does not matter).' },
    { q: 'Why does a straw in water look broken at the surface?', choices: ['Water bends the straw', 'The submerged part is optically raised, the part in air is not, so the two do not line up', 'The surface reflects half of the straw', 'Light is slower in the straw than in water'], a: 1, why: 'Every point under water is seen at a smaller depth than its real one, while the point at the surface has zero depth and does not move. The straw seems to break at the water line.' }
  ],
  applications: [
    'Fishing and hunting from the water\'s edge, and the archerfish that corrects for refraction when it spits at insects above the surface.',
    'Cover glasses and filters in front of image sensors: the focus shift is part of the camera\'s flange-distance design.',
    'Microscope cover slips, whose thickness (0.17 mm) the high-power objectives are corrected for.',
    'Underwater photography: flat ports narrow the field of view by a third; dome ports restore it.',
    'Tilting-plate micrometers on precision levels, and pixel-shift cameras, which move the image by sub-pixel steps with a tilted plate.'
  ],
  history: 'That an oar looks bent in water was a standard example of deception of the senses in ancient Greek philosophy; Plato uses it in the *Republic*. Ptolemy, around 150 CE, measured angles of refraction at air–water and air–glass surfaces and tabulated them, the first known quantitative study of refraction; the law behind his numbers took more than eight centuries to be found.',
  sources: [
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — refraction at a plane surface as the limit of a spherical one, and image displacement by a plate.',
    'W. J. Smith, *Modern Optical Engineering*, ch. 2 — the image displacement produced by a plane-parallel plate.',
    'F. A. Jenkins and H. E. White, *Fundamentals of Optics*, ch. 2 — refraction at a plane surface; apparent depth.'
  ],
  sim: ['rs-depth', 'rs-plate']
},

/* ================================================================ critical angle and TIR */
{
  id: 'critical-angle-and-total-internal-reflection', parent: 'refraction-and-snell', title: 'The critical angle and total internal reflection', level: 1,
  short: 'Going from glass into air, a ray bends away from the normal; beyond one particular angle, the critical angle, it cannot leave at all and is reflected completely. That perfect, lossless mirror folds the light in binocular prisms, traps it in optical fibres and makes a diamond sparkle.',
  keywords: ['total internal reflection', 'TIR', 'critical angle', 'Snell\'s window', 'binocular prism', 'Porro prism', 'optical fibre', 'diamond', 'light pipe', 'refractometer', 'liquid level sensor'],
  prereq: ['snells-law', 'refractive-index', 'law-of-reflection'],
  related: ['fresnel-reflection', 'evanescent-waves-and-frustrated-tir', 'how-an-optical-fibre-guides-light', 'prism-types', 'binoculars', 'retroreflectors', 'refractometers', 'physics:total-internal-reflection'],
  body: `
Light going from glass into air bends *away* from the normal. Tilt the incoming ray more and more and the refracted ray swings towards the surface until, at one particular angle, it skims along it. That angle is the **critical angle**. Steeper than that and no light can cross at all: the surface turns into a perfect mirror.

### The critical angle
Put $\\theta_2 = 90°$ in [[snells-law|Snell's law]] for a ray going from index $n_1$ into a lower index $n_2$:

$$\\sin\\theta_c = \\frac{n_2}{n_1}$$

It exists only if $n_1 > n_2$: light cannot be totally reflected on its way into a denser medium. For a material in air:

| Material | $n$ | Critical angle in air |
|---|---|---|
| water | 1.333 | 48.6° |
| acrylic (PMMA) | 1.492 | 42.1° |
| N-BK7 crown glass | 1.517 | 41.2° |
| sapphire | 1.768 | 34.4° |
| dense flint N-SF11 | 1.785 | 34.1° |
| diamond | 2.418 | 24.4° |
| silicon (infrared) | 3.42 | 17.0° |

The higher the index, the smaller the critical angle.

### Total internal reflection
Beyond $\\theta_c$, the sine of the refracted angle would have to exceed 1, so there is no refracted ray. All the light — both polarizations — is reflected: 100 %, with no coating that could wear out and none of the loss of a metal. A clean TIR surface is the best mirror in optics. The switch is abrupt: for glass, the reflectance of s-polarized light is already 71 % at 41°, and 100 % at 41.3° ([[fresnel-reflection]]).

### Where it works
- **Prisms.** In a 45°–45°–90° prism of N-BK7 the light enters one short face, meets the long face (the hypotenuse) at 45° — beyond 41.2° — and leaves through the other short face, turned through 90°. Pairs of such prisms fold the light path in each tube of a pair of binoculars ([[binoculars]]); entering the hypotenuse instead, the light is reflected twice and returns parallel to its original direction, the principle of a [[retroreflectors|retroreflector]]. A glass of index below $\\sqrt 2 = 1.414$ would not work: its critical angle would exceed 45°.
- **Fibres.** Light bounces along the core of an optical fibre by TIR at the boundary with the cladding. With a core of 1.468 and a cladding of 1.463 (typical of a single-mode fibre) the critical angle is 85.3°: only rays within 4.7° of the axis are trapped ([[how-an-optical-fibre-guides-light]]).
- **Diamond.** With a critical angle of only 24.4°, most light that enters through the top of a well-cut diamond is trapped, reflected from the facets inside, and comes out through the top again. Cut it too shallow or too deep and the light leaks out of the bottom.
- **Under water.** From beneath, the whole sky is squeezed into a cone 97.2° wide, **Snell's window**; outside it the underside of the surface is a mirror showing the bottom.

### What spoils it
TIR needs a *lower* index on the far side. Water on a prism's reflecting face raises the outer index to 1.333 and the critical angle to 61.5°, more than the 45° of the ray: the prism stops reflecting and leaks light, so reflecting faces are kept clean, dry and sealed. And the reflection is not entirely at the surface: a thin field creeps into the rarer medium. Bring another piece of glass or a fingertip within a wavelength or so and the reflection is *frustrated* ([[evanescent-waves-and-frustrated-tir]]).

> [!key] $\\sin\\theta_c = n_2/n_1$: beyond the critical angle, a ray in the denser medium is reflected completely. It is lossless, needs a lower index on the far side, and is the working principle of prisms, fibres and gems.
`,
  ideas: [
    'The critical angle θ_c = asin(n₂/n₁) exists only when light goes from a higher to a lower index.',
    'Beyond θ_c the reflection is total: 100 % for both polarizations, with no coating and no loss.',
    'A 45° prism turns light by TIR only if n > √2; N-BK7 (θ_c = 41.2°) does, water on its face does not.',
    'A fibre traps the rays within about 5° of its axis because the core–cladding critical angle is near 85°.',
    'The reflection is not quite at the surface: an evanescent field leaks into the second medium and can be frustrated.'
  ],
  pitfalls: [
    'Total internal reflection can happen when light enters glass from air — It requires going from the higher index to the lower. Into a denser medium there is always a refracted ray.',
    'The critical angle is measured from the surface — Like all angles in refraction it is measured from the normal. A ray travelling "at 5° to the surface" has an angle of incidence of 85°, which is far beyond any critical angle in glass.',
    'Total reflection means the light never enters the second medium — A field decays exponentially into it, with a depth of the order of the wavelength; this is how frustrated TIR, fingerprint sensors and TIRF microscopes work.'
  ],
  terms: [
    { term: 'Critical angle', also: ['θ_c', 'limiting angle'], def: 'The angle of incidence, going from a higher index n₁ to a lower n₂, at which the refracted ray grazes the surface: sin θ_c = n₂/n₁. Beyond it there is no refracted ray.' },
    { term: 'Total internal reflection', also: ['TIR', 'total reflection'], def: 'Complete reflection of light at the boundary with a lower-index medium when the angle of incidence exceeds the critical angle. Nothing is lost and no coating is needed.' },
    { term: 'Snell\'s window', def: 'The circle of sky, about 97° across, that a viewer under calm water sees overhead through the surface; outside it the surface acts as a mirror by total internal reflection.' },
    { term: 'Porro prism', also: ['right-angle prism', '45-45-90 prism'], def: 'A glass prism with angles 45°, 45°, 90°. Light entering a short face is turned through 90° by TIR at the hypotenuse; light entering the hypotenuse is returned parallel to itself after two reflections.' },
    { term: 'Acceptance angle', def: 'The largest angle to its axis at which a ray can enter a fibre, or travel in it, and still be guided by total internal reflection. In the core of a fibre it is 90° minus the critical angle.' }
  ],
  formulas: [
    {
      name: 'Critical angle',
      expr: 'tc = asin(n2/n1)', tex: '\\theta_c = \\arcsin\\frac{n_2}{n_1}',
      vars: {
        tc: { name: 'critical angle', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\theta_c' },
        n1: { name: 'index of the denser medium (where the ray travels)', value: 1.517, min: 1, max: 4, tex: 'n_1' },
        n2: { name: 'index of the rarer medium beyond the surface', value: 1, min: 1, max: 4, tex: 'n_2' }
      },
      solveFor: 'tc',
      note: 'Needs n₁ > n₂. Angles from the normal.',
      stories: {
        tc: 'Light travels in a medium of index {n1} towards a boundary with a medium of index {n2}. Beyond what angle of incidence is it totally reflected?',
        n1: 'A ray in an unknown glass is totally reflected at a glass–air surface beyond {tc}. What is the glass\'s index?'
      }
    },
    {
      name: 'Width of Snell\'s window',
      expr: 'w = 2*asin(1/n)', tex: 'w = 2\\arcsin\\frac{1}{n}',
      vars: {
        w: { name: 'full angle of the window of sky', q: 'angle', unit: '°', min: 0, max: 180 },
        n: { name: 'index of the water', value: 1.333, min: 1, max: 4 }
      },
      solveFor: 'w',
      note: 'The cone from which light reaches an eye under water; outside it the surface mirrors the bottom.'
    },
    {
      name: 'Steepest ray trapped in a core',
      expr: 'ta = acos(nc/nk)', tex: '\\theta_a = \\arccos\\frac{n_c}{n_k}',
      vars: {
        ta: { name: 'largest angle to the axis of a guided ray', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\theta_a' },
        nc: { name: 'index of the cladding', value: 1.463, min: 1, max: 3, tex: 'n_c' },
        nk: { name: 'index of the core', value: 1.468, min: 1, max: 3, tex: 'n_k' }
      },
      solveFor: 'ta',
      note: 'Inside the core: 90° minus the critical angle. The acceptance angle in air is larger, see the fibre pages.'
    }
  ],
  examples: [
    {
      title: 'A prism that must stay dry',
      q: 'A 45°–45°–90° prism of N-BK7 ($n = 1.517$) turns a beam through 90° by total reflection at its hypotenuse. Does it work in air? Does it work if the hypotenuse is wet with water ($n = 1.333$)?',
      steps: [
        { text: 'In air the critical angle is', tex: '\\theta_c = \\arcsin\\frac{1}{1.517} = 41.2°' },
        'The ray meets the hypotenuse at 45°, which is beyond 41.2°: total reflection.',
        { text: 'With water on the face the critical angle becomes', tex: '\\theta_c = \\arcsin\\frac{1.333}{1.517} = 61.5°' },
        '45° is below 61.5°, so most of the light now leaves through the wet face and the prism passes only a small share of the beam.'
      ],
      a: 'Works in air (41.2° < 45°), fails when wet (61.5° > 45°). Reflecting faces are kept clean and dry, or coated with a mirror layer.'
    },
    {
      title: 'The diver\'s window',
      q: 'A diver floats 3.0 m below a calm water surface. What is the diameter of the circle on the surface through which the diver sees the sky?',
      steps: [
        { text: 'The edge of the window is at the critical angle for water:', tex: '\\theta_c = \\arcsin\\frac{1}{1.333} = 48.6°' },
        { text: 'The radius of the circle on the surface follows from the geometry:', tex: 'r = d\\tan\\theta_c = 3.0 \\times 1.135 = 3.4\\ \\mathrm{m}' }
      ],
      a: 'The window is 6.8 m across on the surface — the whole sky above the horizon, squeezed into a cone 97° wide.'
    }
  ],
  quiz: [
    { q: 'Light in glass of index 1.5 meets a glass–air surface. At which angle of incidence is it totally reflected?', choices: ['30°', '38°', '45°', 'Never: glass to air does not give total reflection'], a: 2, why: 'The critical angle is asin(1/1.5) = 41.8°. Of the choices only 45° is beyond it.' },
    { q: 'A ray in air strikes glass at a large angle of incidence. Total internal reflection occurs.', a: false, why: 'Total reflection needs the ray to start in the denser medium. From air into glass there is always a refracted ray, even at grazing incidence.' },
    { q: 'What is the critical angle of diamond ($n = 2.42$) against air, in degrees?', answer: 24.4, unit: '°', why: '$\\theta_c = \\arcsin(1/2.42) = 24.4°$. The small angle traps light inside the stone.' },
    { q: 'A 45°–45°–90° prism of fused silica ($n = 1.458$) turns light by total reflection in air. It is lowered into water. What happens to the reflection?', choices: ['It stays total', 'It fails: the critical angle becomes 66°, above 45°', 'It becomes brighter', 'It reverses the colours'], a: 1, why: 'In water $\\theta_c = \\arcsin(1.333/1.458) = 66.1°$. The 45° ray is below it, so it is partly transmitted.' },
    { q: 'A ray in a fibre core (n = 1.468) travels at 3° to the axis; the cladding has n = 1.463. Is it guided?', choices: ['Yes: it meets the boundary at 87°, beyond the critical angle of 85.3°', 'No: it is below the critical angle', 'Only if the light is red', 'Only for a bent fibre'], a: 0, why: 'A ray at 3° to the axis meets the core–cladding boundary at 90° − 3° = 87° from the normal. That is beyond 85.3°, so it is totally reflected and guided.' }
  ],
  applications: [
    'Binoculars, periscopes, and single-lens-reflex cameras turn and invert the image with TIR prisms: no coating wears out and no light is lost.',
    'Optical fibres carry telephone and internet traffic by TIR in a core a few micrometres to 50 µm across.',
    'Gemstone cutting: the proportions of a diamond are chosen to keep the light inside until it comes out of the top.',
    'Liquid-level sensors: a clear cone tip returns light to a detector while dry; once covered by liquid, TIR fails and the signal drops.',
    'Critical-angle refractometers (such as the Abbe refractometer) measure the index of a liquid from the angle at which the reflection becomes total.'
  ],
  history: 'Johannes Kepler recorded total internal reflection in his *Dioptrice* of 1611, although he had no law of refraction to explain it. In 1841 Daniel Colladon in Geneva showed light guided along a curving jet of water, and John Tyndall repeated it in his London lectures from 1854: the first light pipe.',
  sources: [
    'E. Hecht, *Optics*, ch. 4 — total internal reflection and the evanescent wave.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 1 — reflection and refraction at a plane interface, including incidence beyond the critical angle.',
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, ch. 1 — planar mirror and prism optics; total internal reflection.'
  ],
  sim: 'rs-tir'
},

/* ================================================================ Fresnel */
{
  id: 'fresnel-reflection', parent: 'refraction-and-snell', title: 'How much a surface reflects: Fresnel\'s equations', level: 2,
  short: 'Every transparent surface is also a weak mirror. Fresnel\'s equations say how weak: about 4 % per glass surface at normal incidence, rising to 100 % at grazing incidence, different for the two polarizations, and 90 % or more for a polished metal.',
  keywords: ['Fresnel equations', 'reflectance', 'transmittance', 'reflection loss', '4 percent', 's polarization', 'p polarization', 'grazing incidence', 'metal reflectance', 'complex refractive index', 'surface reflection', 'glare', 'ghost'],
  prereq: ['snells-law', 'critical-angle-and-total-internal-reflection', 'polarization-states'],
  related: ['brewster-angle', 'antireflection-coatings', 'multilayer-coatings', 'metal-mirror-coatings', 'specular-and-diffuse-reflection', 'ghosts-flare-and-stray-light', 'physics:brewsters-angle', 'feynman:partial-reflection'],
  body: `
Every transparent surface is also a weak mirror: in a shop window at night you see the room behind the glass and your own reflection at the same time. [[snells-law|Snell's law]] gives the direction of the refracted ray but not its share of the light. That comes from the **Fresnel equations** (Augustin Fresnel, 1823), which follow from requiring the electric and magnetic fields to be continuous across the boundary.

### At normal incidence
For light arriving head-on, the reflectance depends only on the two indices:

$$R = \\left(\\frac{n_1 - n_2}{n_1 + n_2}\\right)^2$$

Air to N-BK7 glass: 4.2 %. To water: 2.0 %. To dense flint N-SF11: 7.9 %. To diamond: 17.2 %. To germanium in the infrared ($n = 4.0$): 36 %. The result is the same going from the glass back into air. The 4 % loss per glass–air surface looks small, but a lens with six elements has twelve such surfaces and passes only $0.958^{12} = 60\\ \\%$ of the light, a twenty-surface zoom only 42 %. Worse, the reflected light bounces between surfaces and forms ghost images and veiling flare. Hence [[antireflection-coatings]]. A bare window passes $(1-R)^2 = 91.7\\ \\%$; adding the light that bounces back and forth inside, $(1-R)/(1+R) = 91.9\\ \\%$.

### Two polarizations
Light polarized across the plane of incidence (**s**) and light polarized in it (**p**) reflect differently:

$$R_s = \\left(\\frac{n_1\\cos\\theta_1 - n_2\\cos\\theta_2}{n_1\\cos\\theta_1 + n_2\\cos\\theta_2}\\right)^2 \\qquad R_p = \\left(\\frac{n_2\\cos\\theta_1 - n_1\\cos\\theta_2}{n_2\\cos\\theta_1 + n_1\\cos\\theta_2}\\right)^2$$

| Angle | $R_s$ | $R_p$ | Unpolarized |
|---|---|---|---|
| 0° | 4.2 % | 4.2 % | 4.2 % |
| 30° | 6.1 % | 2.7 % | 4.4 % |
| 45° | 9.6 % | 0.9 % | 5.3 % |
| 60° | 18.2 % | 0.2 % | 9.2 % |
| 70° | 30.7 % | 4.2 % | 17.4 % |
| 80° | 54.5 % | 23.6 % | 39.0 % |
| 89° | 94.1 % | 86.9 % | 90.5 % |

(air to N-BK7 glass.) $R_s$ climbs steadily. $R_p$ first falls to zero at [[brewster-angle|Brewster's angle]], 56.6° for this glass, then rises. Both reach 100 % at grazing incidence: any surface is a mirror when looked at along it, as a wet road or a lake at sunrise shows. For unpolarized light $R = (R_s + R_p)/2$, and if nothing is absorbed $T = 1 - R$.

### Metals
A metal has a complex index $n + ik$ whose large imaginary part makes the field die within a few nanometres, so nearly all the light is reflected. At normal incidence $R = \\frac{(n-1)^2 + k^2}{(n+1)^2 + k^2}$. Approximate values at 550 nm: aluminium 92 %, silver 98.5 %, gold 79 % (but 94 % at 650 nm and only 41 % at 450 nm, which is why it is yellow), copper 62 %, chromium 66 %. See [[metal-mirror-coatings]].

### A change of sign
The reflected amplitude for air to glass is negative: the wave is reflected with its phase turned over by 180°; from glass to air it is not. That is why a thin film can cancel the reflection: the two reflections from its faces then differ by exactly the half wavelength that a quarter-wave layer provides.

> [!key] A glass surface reflects about 4 % of normally incident light, more for steep angles, and for both polarizations all of it at grazing incidence; the two polarizations differ, and the p-polarized reflection vanishes at Brewster's angle. Metals reflect 60–98 %.
`,
  ideas: [
    'At normal incidence R = ((n₁ − n₂)/(n₁ + n₂))²: 4.2 % for air to N-BK7 glass, 2.0 % for water, 17 % for diamond.',
    'Uncoated glass loses 4 % per surface, so a lens of many elements needs antireflection coatings.',
    'The s and p polarizations reflect differently; R_p vanishes at Brewster\'s angle and both rise to 100 % at grazing incidence.',
    'A metal\'s complex index n + ik gives it a high reflectance: about 92 % for aluminium, 98.5 % for silver in the green.',
    'Reflection from a denser medium turns the phase of the wave over; from a rarer medium it does not.'
  ],
  pitfalls: [
    'A transparent material reflects nothing — Every index step reflects: 4 % at a glass surface, 2 % at water, 17 % at diamond. Only a perfect index match (glass in a liquid of the same index) makes a surface invisible.',
    'The reflectance at a surface is fixed by the material — It depends on the angle and on the polarization too; at 80° the same glass reflects 39 % of unpolarized light.',
    'Reflecting means the light is lost — Reflected and transmitted light add up to the incident light (T = 1 − R for a lossless surface); what is "lost" to the image ends up elsewhere as ghosts and flare.'
  ],
  terms: [
    { term: 'Reflectance', also: ['R', 'reflectivity'], def: 'The fraction of the incident power that a surface reflects. It depends on the two indices, the angle of incidence, the polarization and, for coatings, the wavelength.' },
    { term: 'Transmittance', also: ['T'], def: 'The fraction of the incident power that passes through a surface or element. For a lossless surface T = 1 − R.' },
    { term: 'Fresnel equations', also: ['Fresnel formulae', 'Fresnel coefficients'], def: 'The formulae for the amplitude and the power reflected and transmitted at a boundary between two media, for light polarized across (s) or in (p) the plane of incidence.' },
    { term: 's and p polarization', also: ['TE and TM', 'perpendicular and parallel'], def: 's: the electric field is perpendicular to the plane of incidence (senkrecht); p: it lies in that plane (parallel). They reflect differently at an oblique surface.' },
    { term: 'Complex refractive index', also: ['n + ik', 'extinction coefficient k'], def: 'The index of an absorbing material, n + ik. The real part n sets the phase speed and the imaginary part k the absorption; metals have a large k and so reflect strongly.' },
    { term: 'Grazing incidence', def: 'Light meeting a surface at an angle of incidence near 90°, i.e. almost along it. Every surface reflects nearly all of the light at grazing incidence.' }
  ],
  formulas: [
    {
      name: 'Reflectance at normal incidence',
      expr: 'R = ((n1 - n2)/(n1 + n2))^2', tex: 'R = \\left(\\frac{n_1 - n_2}{n_1 + n_2}\\right)^2',
      vars: {
        R: { name: 'reflectance', q: 'ratio', unit: '%', min: 0, max: 100 },
        n1: { name: 'index of the first medium', value: 1, min: 1, max: 5, tex: 'n_1' },
        n2: { name: 'index of the second medium', value: 1.517, min: 1, max: 5, tex: 'n_2' }
      },
      solveFor: 'R',
      note: 'Head-on incidence, either direction. A metal needs the complex form below.',
      stories: {
        R: 'Light in a medium of index {n1} meets a medium of index {n2} head-on. What fraction is reflected?',
        n2: 'A surface reflects {R} of the light arriving head-on from air. What is the index of the material (taking n above 1)?'
      }
    },
    {
      name: 'Reflectance of s-polarized light',
      expr: 'Rs = ((n1*cos(t) - sqrt(n2^2 - n1^2*sin(t)^2))/(n1*cos(t) + sqrt(n2^2 - n1^2*sin(t)^2)))^2',
      tex: 'R_s = \\left(\\frac{n_1\\cos\\theta - \\sqrt{n_2^2 - n_1^2\\sin^2\\theta}}{n_1\\cos\\theta + \\sqrt{n_2^2 - n_1^2\\sin^2\\theta}}\\right)^2',
      vars: {
        Rs: { name: 'reflectance for s polarization', q: 'ratio', unit: '%', min: 0, max: 100, tex: 'R_s' },
        n1: { name: 'index of the first medium', value: 1, min: 1, max: 5, tex: 'n_1' },
        n2: { name: 'index of the second medium', value: 1.517, min: 1, max: 5, tex: 'n_2' },
        t: { name: 'angle of incidence', q: 'angle', unit: '°', value: 60, min: 0, max: 89, tex: '\\theta' }
      },
      solveFor: 'Rs',
      note: 'For light going into a denser medium (n₂ > n₁); beyond the critical angle the reflection is total.',
      practice: { unknowns: ['Rs'] }
    },
    {
      name: 'Reflectance of p-polarized light',
      expr: 'Rp = ((n2^2*cos(t) - n1*sqrt(n2^2 - n1^2*sin(t)^2))/(n2^2*cos(t) + n1*sqrt(n2^2 - n1^2*sin(t)^2)))^2',
      tex: 'R_p = \\left(\\frac{n_2^2\\cos\\theta - n_1\\sqrt{n_2^2 - n_1^2\\sin^2\\theta}}{n_2^2\\cos\\theta + n_1\\sqrt{n_2^2 - n_1^2\\sin^2\\theta}}\\right)^2',
      vars: {
        Rp: { name: 'reflectance for p polarization', q: 'ratio', unit: '%', min: 0, max: 100, tex: 'R_p' },
        n1: { name: 'index of the first medium', value: 1, min: 1, max: 5, tex: 'n_1' },
        n2: { name: 'index of the second medium', value: 1.517, min: 1, max: 5, tex: 'n_2' },
        t: { name: 'angle of incidence', q: 'angle', unit: '°', value: 60, min: 0, max: 89, tex: '\\theta' }
      },
      solveFor: 'Rp',
      note: 'Zero at Brewster\'s angle, atan(n₂/n₁).',
      practice: { unknowns: ['Rp'] }
    },
    {
      name: 'Reflectance of a metal at normal incidence',
      expr: 'R = ((n - 1)^2 + k^2)/((n + 1)^2 + k^2)', tex: 'R = \\frac{(n-1)^2 + k^2}{(n+1)^2 + k^2}',
      vars: {
        R: { name: 'reflectance in air', q: 'ratio', unit: '%', min: 0, max: 100 },
        n: { name: 'real part of the index', value: 0.985, min: 0.01, max: 10 },
        k: { name: 'imaginary part (extinction coefficient)', value: 6.67, min: 0, max: 40 }
      },
      solveFor: 'R',
      note: 'Defaults: aluminium at 550 nm, about 92 %. Silver at 550 nm has n ≈ 0.05, k ≈ 3.6.',
      practice: { unknowns: ['R'] }
    },
    {
      name: 'Transmission through many surfaces',
      expr: 'T = (1 - R)^N', tex: 'T = (1 - R)^N',
      vars: {
        T: { name: 'transmittance of the stack of surfaces', q: 'ratio', unit: '%', min: 0, max: 100 },
        R: { name: 'reflectance of one surface', q: 'ratio', unit: '%', value: 4.2, min: 0.001, max: 50 },
        N: { name: 'number of air–glass surfaces', int: true, value: 12, min: 1, max: 80 }
      },
      solveFor: 'T',
      note: 'Ignores absorption and the light that bounces back and forth between surfaces.',
      stories: { T: 'A lens has {N} uncoated air–glass surfaces, each reflecting {R}. What share of the light gets through?' }
    }
  ],
  examples: [
    {
      title: 'An uncoated lens',
      q: 'A camera lens has seven elements, all in air, with no coatings: fourteen air–glass surfaces. The glass has $n = 1.517$. What share of the light reaches the sensor, ignoring absorption?',
      steps: [
        { text: 'Reflectance per surface at normal incidence:', tex: 'R = \\left(\\frac{0.517}{2.517}\\right)^2 = 0.0422' },
        { text: 'Transmittance of fourteen surfaces:', tex: 'T = (1 - 0.0422)^{14} = 0.55' }
      ],
      a: 'About 55 %: nearly half of the light is reflected and some of it comes back as ghosts and flare. Modern multi-layer coatings cut each surface to 0.5 % or less, so the same lens passes over 90 %.'
    },
    {
      title: 'Glare from a lake',
      q: 'Sunlight (unpolarized) reflects from calm water ($n = 1.333$) at 80° from the normal, and again at Brewster\'s angle (53.1°). How much is reflected, and how is it polarized?',
      steps: [
        'At 80°: $R_s = 45.7\\ \\%$ and $R_p = 23.9\\ \\%$, so for unpolarized light $R = (45.7 + 23.9)/2 = 34.8\\ \\%$ — and the reflection is mostly s-polarized.',
        'At 53.1°: $R_s = 7.8\\ \\%$ and $R_p = 0$. The reflected light is *entirely* s-polarized (horizontally polarized, for a horizontal surface), and its power is only $R = 3.9\\ \\%$ of the incident light.'
      ],
      a: '34.8 % at 80°, mostly horizontally polarized; at 53° only 3.9 %, completely polarized. A polarizing filter turned to cut horizontal light removes the glare entirely at Brewster\'s angle.'
    }
  ],
  quiz: [
    { q: 'Light in air meets a glass surface head-on. About what fraction of the power is reflected (n = 1.5)?', choices: ['0.4 %', '4 %', '25 %', '50 %'], a: 1, why: '$R = (0.5/2.5)^2 = 0.04$. Uncoated glass loses about 4 % per surface.' },
    { q: 'At normal incidence the reflectance from glass into air is smaller than from air into glass.', a: false, why: 'The formula $((n_1 - n_2)/(n_1 + n_2))^2$ is symmetric in the two indices: 4 % either way.' },
    { q: 'A stack of ten uncoated air–glass surfaces, 4.2 % each, passes what percentage of light (ignoring absorption)?', answer: 65, unit: '%', tol: 0.02, why: '$(1 - 0.042)^{10} = 0.65$.' },
    { q: 'Which statement about the reflection from glass at an oblique angle is true?', choices: ['s- and p-polarized light reflect equally', 'p-polarized light reflects less than s-polarized light, and its reflection falls to zero at one angle', 's-polarized light reflects less than p-polarized light', 'Reflectance does not depend on the angle'], a: 1, why: 'For a dielectric $R_p < R_s$ at every oblique angle, and $R_p = 0$ at Brewster\'s angle.' },
    { q: 'Why does a polished aluminium mirror reflect about 92 % of green light while glass reflects 4 %?', choices: ['Aluminium has a large imaginary index (k ≈ 6.7), so the light cannot enter and is reflected', 'Aluminium is denser than glass', 'Glass absorbs the rest', 'Aluminium has a real index of 6.7'], a: 0, why: 'In the formula $((n-1)^2 + k^2)/((n+1)^2 + k^2)$ a large $k$ pushes the result towards 1. Density as such is irrelevant.' }
  ],
  applications: [
    'Antireflection coatings on lenses, spectacles, solar cells and displays exist to cancel the 4 % per surface.',
    'Beam splitters and window glass are chosen and tilted with the polarization-dependent reflectance in mind.',
    'Photographers and sunglass makers use the polarization of reflected glare from water and roads.',
    'Mirror coatings: aluminium for the visible and ultraviolet, silver for visible and infrared, gold for the infrared.',
    'Thermal cameras use germanium lenses (36 % reflectance per surface) only with antireflection coatings.'
  ],
  history: 'Augustin-Jean Fresnel derived the amplitudes of reflected and refracted light in 1823, assuming that light is a transverse elastic wave in an "ether". His formulae, which predicted the vanishing p reflection at Brewster\'s angle, were later recovered without the ether when Maxwell\'s electromagnetic theory supplied the boundary conditions.',
  sources: [
    'E. Hecht, *Optics*, ch. 4 — the Fresnel equations, reflectance and transmittance, internal reflection.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 1 — the Fresnel formulae and the reflection from metals.',
    'H. A. Macleod, *Thin-Film Optical Filters*, ch. 2 — the optical admittance, with the Fresnel coefficients of a single interface.'
  ],
  sim: 'rs-fresnel'
},

/* ================================================================ Brewster */
{
  id: 'brewster-angle', parent: 'refraction-and-snell', title: 'Brewster\'s angle', level: 2,
  short: 'At one angle of incidence, tan θ_B = n₂/n₁, light polarized in the plane of incidence is not reflected at all: reflected and refracted rays are at right angles, and the reflection that remains is completely polarized. It is the reason for polarizing sunglasses and for the tilted windows of gas lasers.',
  keywords: ['Brewster angle', 'polarizing angle', 'Brewster window', 'p polarization', 'glare', 'polarizing sunglasses', 'pile of plates', 'Brewster cut', 'pseudo-Brewster angle', 'polarization by reflection'],
  prereq: ['fresnel-reflection', 'polarization-states'],
  related: ['polarization-by-reflection-and-scattering', 'polarizers-and-malus-law', 'critical-angle-and-total-internal-reflection', 'helium-neon-laser', 'photoelasticity-and-stress', 'ellipsometry', 'physics:brewsters-angle'],
  body: `
Light reflected from glass or water is not just a dimmer copy of the incident light: it can be *polarized*. At one special angle of incidence the part of the light that vibrates in the plane of incidence (**p** polarization) is not reflected at all, and the light that comes back is purely **s**-polarized, vibrating across that plane. That angle is Brewster's angle.

### The angle
$$\\tan\\theta_B = \\frac{n_2}{n_1}$$

At this angle the reflected and the refracted ray are exactly at right angles: $\\theta_B + \\theta_2 = 90°$. (Put $\\theta_2 = 90° - \\theta_B$ in [[snells-law|Snell's law]], $n_1\\sin\\theta_B = n_2\\cos\\theta_B$, and the formula follows.)

| From air onto | $n$ | $\\theta_B$ | $R_s$ at $\\theta_B$ | Reflected share of unpolarized light |
|---|---|---|---|---|
| water | 1.333 | 53.1° | 7.8 % | 3.9 % |
| acrylic (PMMA) | 1.492 | 56.2° | 14.4 % | 7.2 % |
| N-BK7 glass | 1.517 | 56.6° | 15.5 % | 7.8 % |
| dense flint N-SF11 | 1.785 | 60.7° | 27.3 % | 13.6 % |
| diamond | 2.418 | 67.5° | 50.1 % | 25 % |

From *inside* the glass towards air the angle is $\\arctan(1/n) = 33.4°$ for N-BK7, the complement of 56.6°.

### Why the p reflection vanishes
A reflected wave is radiated by the electrons of the second medium, which the refracted wave sets swinging. For p-polarized light they swing in the plane of incidence, at right angles to the refracted ray. An oscillating charge radiates nothing along its own axis. At Brewster's angle the direction in which the reflected ray would leave lies exactly along that axis, so no p-polarized light can be reflected. For s-polarized light the charges swing across the plane of incidence and radiate towards the reflected ray as well as in any other direction in the plane, so s light is always reflected.

### What is left
At Brewster's angle an unpolarized beam reflects only its s half, at $R_s = ((n^2-1)/(n^2+1))^2$ — 15.5 % for N-BK7 — so the reflected beam carries 7.8 % of the incident power and is *completely* polarized. A few degrees either side the polarization is still high: at 45° on glass, $R_s = 9.6\\ \\%$ and $R_p = 0.9\\ \\%$, a degree of polarization $(R_s - R_p)/(R_s + R_p) = 83\\ \\%$. Metals have no exact Brewster angle; $R_p$ merely passes through a shallow minimum, the *pseudo-Brewster angle*.

### Where it is used
- **Brewster windows.** The tube of a gas laser is closed by windows tilted at Brewster's angle. p-polarized light crosses them without any reflection loss, no coating needed, while s-polarized light loses 13–16 % at each surface. Inside the resonator, where the light makes hundreds of passes, only p can build up: the laser is linearly polarized.
- **Brewster-cut crystals and prisms.** The Ti:sapphire rods of ultrafast lasers are cut at Brewster's angle for the same reason.
- **Glare.** Sunlight reflected from a road, a lake or a windscreen is partly horizontally polarized, most strongly near Brewster's angle (about 53° from the vertical for water, 33–37° above the surface). A polarizing filter or polarizing sunglasses with a vertical axis block it ([[polarization-by-reflection-and-scattering]]).
- **A pile of plates.** Several glass plates at Brewster's angle make a crude polarizer: each removes some of the s light from the transmitted beam.

> [!key] $\\tan\\theta_B = n_2/n_1$. There the reflected and refracted rays are perpendicular, the p reflection is zero and the reflected light is entirely s-polarized.
`,
  ideas: [
    'Brewster\'s angle θ_B = atan(n₂/n₁): 56.6° from air onto N-BK7, 53.1° onto water, 67.5° onto diamond.',
    'At θ_B the reflected and refracted rays are at 90° to each other.',
    'p light (in the plane of incidence) is not reflected at all at θ_B; the reflected light is completely s-polarized.',
    'A Brewster window passes p light without loss, so a laser behind it emits polarized light.',
    'Glare from water and roads is mostly horizontally polarized, which polarizing filters can remove.'
  ],
  pitfalls: [
    'Brewster\'s angle is where the light is totally reflected — That is the critical angle, which exists only inside the denser medium. At Brewster\'s angle one polarization is not reflected at all.',
    'The reflected light at Brewster\'s angle is bright — It is completely polarized but weak: only the s component is reflected, about 8 % of the incident power for glass.',
    'Every surface has a Brewster angle where the reflection vanishes — Only the p-polarized reflection vanishes, and only for dielectrics. A metal has a shallow minimum of p, never zero.'
  ],
  terms: [
    { term: 'Brewster\'s angle', also: ['polarizing angle', 'θ_B'], def: 'The angle of incidence, tan θ_B = n₂/n₁, at which p-polarized light is not reflected and the reflected and refracted rays are perpendicular.' },
    { term: 'Brewster window', def: 'A window tilted at Brewster\'s angle so that p-polarized light passes without reflection loss. Used to close the tubes of gas lasers, which then emit polarized light.' },
    { term: 'p polarization', also: ['TM', 'parallel polarization'], def: 'Light whose electric field vibrates in the plane of incidence. It is not reflected at Brewster\'s angle.' },
    { term: 's polarization', also: ['TE', 'perpendicular polarization'], def: 'Light whose electric field vibrates across the plane of incidence. It is reflected at every angle.' },
    { term: 'Pseudo-Brewster angle', def: 'For a metal or other absorbing material, the angle at which the p reflectance is smallest. The minimum is shallow and never exactly zero.' }
  ],
  formulas: [
    {
      name: 'Brewster\'s angle',
      expr: 'tb = atan(n2/n1)', tex: '\\theta_B = \\arctan\\frac{n_2}{n_1}',
      vars: {
        tb: { name: 'Brewster\'s angle', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\theta_B' },
        n1: { name: 'index of the first medium', value: 1, min: 1, max: 5, tex: 'n_1' },
        n2: { name: 'index of the second medium', value: 1.517, min: 1, max: 5, tex: 'n_2' }
      },
      solveFor: 'tb',
      note: 'Light goes from medium 1 into medium 2. The refracted ray is then at 90° − θ_B to the normal.',
      stories: {
        tb: 'Light in a medium of index {n1} meets a medium of index {n2}. At what angle of incidence is the p reflection zero?',
        n2: 'A glass plate shows no p-polarized reflection at {tb} when the light comes from air. What is its refractive index?'
      }
    },
    {
      name: 'Reflectance of s light at Brewster\'s angle',
      expr: 'Rs = ((n2^2 - n1^2)/(n2^2 + n1^2))^2', tex: 'R_s = \\left(\\frac{n_2^2 - n_1^2}{n_2^2 + n_1^2}\\right)^2',
      vars: {
        Rs: { name: 'reflectance of the s component', q: 'ratio', unit: '%', min: 0, max: 100, tex: 'R_s' },
        n1: { name: 'index of the first medium', value: 1, min: 1, max: 5, tex: 'n_1' },
        n2: { name: 'index of the second medium', value: 1.517, min: 1, max: 5, tex: 'n_2' }
      },
      solveFor: 'Rs',
      note: 'For unpolarized light the reflected beam carries half of this fraction of the incident power.'
    },
    {
      name: 'Degree of polarization of the reflected light',
      expr: 'P = (Rs - Rp)/(Rs + Rp)', tex: 'P = \\frac{R_s - R_p}{R_s + R_p}',
      vars: {
        P: { name: 'degree of polarization (unpolarized light in)', q: 'ratio', unit: '%', min: 0, max: 100 },
        Rs: { name: 'reflectance for s polarization', q: 'ratio', unit: '%', value: 9.6, min: 0.001, max: 100, tex: 'R_s' },
        Rp: { name: 'reflectance for p polarization', q: 'ratio', unit: '%', value: 0.92, min: 0, max: 100, tex: 'R_p' }
      },
      solveFor: 'P',
      note: 'Defaults: air to N-BK7 glass at 45°. P is 100 % at Brewster\'s angle, where R_p = 0.'
    }
  ],
  examples: [
    {
      title: 'The window of a helium–neon laser',
      q: 'The tube of a helium–neon laser ($\\lambda = 632.8$ nm) is closed by two fused-silica windows ($n = 1.457$) set at Brewster\'s angle. Find the angle and the loss of s-polarized light in one pass through both windows.',
      steps: [
        { text: 'Brewster\'s angle:', tex: '\\theta_B = \\arctan 1.457 = 55.5°' },
        { text: 'Reflectance of s light at each surface:', tex: 'R_s = \\left(\\frac{1.457^2 - 1}{1.457^2 + 1}\\right)^2 = \\left(\\frac{1.123}{3.123}\\right)^2 = 0.129' },
        { text: 'There are four surfaces (two windows, two faces each):', tex: 'T_s = (1 - 0.129)^4 = 0.575' }
      ],
      a: 'θ_B = 55.5°. p light passes with no loss; s light is cut to 57.5 % per pass, a loss of 42 % that no helium–neon gain can make up. Only the p polarization oscillates, and the laser is polarized.'
    },
    {
      title: 'Removing the reflection from a shop window',
      q: 'A photographer wants to take a polarized-filter picture through a glass window ($n = 1.52$). At what angle to the window should the camera be?',
      steps: [
        { text: 'Brewster\'s angle from the normal:', tex: '\\theta_B = \\arctan 1.52 = 56.7°' },
        'The angle to the glass surface is $90° - 56.7° = 33.3°$. At that angle the reflection is purely horizontally polarized (for a vertical window the polarization is vertical), and the filter, turned to block it, removes it entirely.'
      ],
      a: 'Stand so that the camera axis is about 33° from the plane of the window; then turn the filter until the reflection disappears.'
    }
  ],
  quiz: [
    { q: 'A laser beam in air strikes glass of index 1.5 at Brewster\'s angle. What is the angle between the reflected and the refracted ray?', choices: ['0°', '45°', '90°', '180°'], a: 2, why: 'At Brewster\'s angle $\\theta_1 + \\theta_2 = 90°$, so the rays are at $180° - 90° = 90°$ to each other.' },
    { q: 'At Brewster\'s angle, which polarization is not reflected?', choices: ['s, across the plane of incidence', 'p, in the plane of incidence', 'Both', 'Neither'], a: 1, why: 'p-polarized charges swing along the direction the reflected ray would take; a swinging charge radiates nothing along its axis.' },
    { q: 'Brewster\'s angle for light going from air into water ($n = 1.333$), in degrees, is…', answer: 53.1, unit: '°', why: '$\\theta_B = \\arctan 1.333 = 53.1°$.' },
    { q: 'Polarizing sunglasses reduce glare from a calm lake because the reflected light is mostly horizontally polarized and the lenses block that polarization.', a: true, why: 'Reflection favours s polarization, which for a horizontal surface is horizontal; sunglasses with a vertical transmission axis block it.' },
    { q: 'Why is the light reflected from glass at Brewster\'s angle completely polarized yet faint?', choices: ['Only the s component can be reflected, and about 15 % of that is', 'The glass absorbs the p component', 'The p component is refracted away at a different angle', 'The reflection is partly total'], a: 0, why: 'The p reflection is exactly zero, so what returns is pure s — and $R_s$ at Brewster\'s angle is only 15.5 % for N-BK7, so for unpolarized light about 8 % of the power is reflected.' }
  ],
  applications: [
    'Brewster windows on helium–neon and argon-ion laser tubes, and on the cells and crystals inside laser resonators.',
    'Polarizing sunglasses and camera filters that remove reflected glare from water, road and glass.',
    'Pile-of-plates polarizers and polarizing beam splitters for powerful lasers and for infrared and ultraviolet light, where no film polarizer exists.',
    'Ellipsometry, which measures thin films from the change of polarization of light reflected near the Brewster angle of the substrate.',
    'Teaching demonstrations: a reflected laser spot seen through a polarizer, rotated, goes dark at one angle of incidence.'
  ],
  history: 'Étienne-Louis Malus discovered polarization by reflection in 1808, when he looked through a calcite crystal at the Sun\'s reflection from the windows of the Luxembourg Palace in Paris and saw one of the two images fade as he turned it. In 1815 David Brewster measured the polarization of light reflected from many materials and found that it is complete when the reflected and refracted rays are at right angles: $\\tan\\theta_B = n$.',
  sources: [
    'E. Hecht, *Optics*, ch. 8 (Polarization) — polarization by reflection and Brewster\'s angle; ch. 4 for the Fresnel equations.',
    'A. E. Siegman, *Lasers* — Brewster-angle windows and polarization in laser resonators.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 1 — the Fresnel formulae and their special cases.'
  ],
  sim: 'rs-brewster'
},

/* ================================================================ prism deviation */
{
  id: 'prism-deviation', parent: 'refraction-and-snell', title: 'Deviation by a prism', level: 2,
  short: 'A prism bends a ray towards its base by refraction at two faces that do not cancel. The deviation is least when the ray passes symmetrically, which is how the refractive index of glass is measured; for a thin prism the deviation is simply (n − 1) times the apex angle, the basis of spectacle prism and of the prism dioptre.',
  keywords: ['prism', 'deviation', 'apex angle', 'minimum deviation', 'thin prism', 'prism dioptre', 'spectrometer', 'index measurement', 'wedge', 'Risley prism', 'base', 'angle of deviation'],
  prereq: ['snells-law', 'refraction-at-a-flat-surface', 'critical-angle-and-total-internal-reflection'],
  related: ['dispersion-and-the-spectrum', 'prism-in-spectacles', 'prism-types', 'risley-prisms-and-beam-steering', 'spectrometers-and-monochromators', 'refractometers', 'physics:dispersion'],
  body: `
A prism is a piece of transparent material with two flat faces that meet at an **apex angle** $A$. Unlike a window, whose two faces undo each other's work, a prism's faces are inclined, so the two refractions add: the ray leaves turned towards the thick end, the **base**, by an angle $\\delta$ called the **deviation**.

### Following a ray through
A ray meets the first face at angle $\\theta_1$ and is refracted by [[snells-law|Snell's law]] to $r_1$ inside the glass: $\\sin\\theta_1 = n\\sin r_1$. Inside it meets the second face at $r_2 = A - r_1$ (a fact of the triangle), and leaves at $\\theta_4$ with $\\sin\\theta_4 = n\\sin r_2$. The deviation is the sum of the bends at the two faces:

$$\\delta = \\theta_1 + \\theta_4 - A$$

It depends on the angle of incidence. It is large for rays at grazing incidence and large for rays that arrive steeply, and has a **minimum** in between, when the ray passes symmetrically through the prism ($r_1 = r_2 = A/2$, $\\theta_1 = \\theta_4$), parallel to the base inside the glass. At minimum deviation,

$$n = \\frac{\\sin\\frac{A + \\delta_{\\min}}{2}}{\\sin\\frac{A}{2}}$$

This is the classic way to measure an index to five decimals: a spectrometer measures the apex angle and the minimum deviation of a prism of the glass. At the minimum, $\\delta$ is stationary, so a small error in the angle of incidence hardly changes it; the beam also keeps its width.

| 60° prism, yellow light | $n$ | $\\delta_{\\min}$ |
|---|---|---|
| water (hollow prism) | 1.333 | 23.6° |
| fused silica | 1.459 | 33.6° |
| acrylic (PMMA) | 1.492 | 36.5° |
| N-BK7 crown glass | 1.517 | 38.6° |
| flint glass F2 | 1.620 | 48.2° |
| dense flint N-SF11 | 1.785 | 66.3° |

### The limit
For a 60° prism of N-BK7 the second face passes the ray only if $r_2$ is below the critical angle 41.2°, which needs $\\theta_1 > 29.2°$. A flatter ray is totally reflected inside. If $n\\sin(A/2) > 1$ — for a 60° apex, an index above 2, as in diamond — no ray can leave the second face: every ray is totally reflected there.

### Thin prisms
For a small apex angle and a ray near the normal all the sines become angles, and

$$\\delta = (n - 1)\\,A$$

independent of the angle of incidence. A 5° prism of N-BK7 deviates every ray by 2.6°. Opticians describe the strength of such a prism in **prism dioptres**: 1 Δ deviates a ray by one centimetre at a distance of one metre, $\\delta = \\arctan 0.01 = 0.573°$. So a lens for 2 Δ needs an apex angle of $1.146°/0.498 = 2.3°$ in CR-39 plastic (n = 1.498): across a 60 mm lens that is a thickness difference of 2.4 mm ([[prism-in-spectacles]]).

### Two ways to use a prism
Prisms are used for the *direction* they give (the wedge and the right-angle prism, which reflects totally: [[prism-types]]) and for the *colours* they spread ([[dispersion-and-the-spectrum]]). A pair of thin prisms that rotate independently can aim a beam anywhere in a cone ([[risley-prisms-and-beam-steering|Risley prisms]]).

> [!key] A prism turns light towards its base by $\\delta = \\theta_1 + \\theta_4 - A$, least at symmetric passage, where $n = \\sin\\frac{A+\\delta_{\\min}}{2}/\\sin\\frac A2$. A thin prism deviates by $(n-1)A$.
`,
  ideas: [
    'A prism\'s two refractions add: the ray is turned towards the base by δ = θ₁ + θ₄ − A.',
    'δ has a minimum at symmetric passage, where n = sin((A + δ_min)/2) / sin(A/2) — the way index is measured.',
    'A ray that arrives too flat meets the second face beyond the critical angle and does not leave.',
    'A thin prism deviates every ray by (n − 1)A; the prism dioptre is a deviation of 1 cm in 1 m (0.573°).',
    'A prism also spreads the colours, because n depends on wavelength.'
  ],
  pitfalls: [
    'A prism bends light towards its apex — It bends it towards the base, the thick end. A converging lens is a stack of prisms with bases pointing inward.',
    'The deviation grows with the angle of incidence — It has a minimum: both steep and grazing rays are deviated more than a symmetric one, and a ray that is too flat does not leave at all.',
    'A prism and a window do the same thing to the light — The two faces of a window are parallel, so the ray emerges parallel to its original direction. The two faces of a prism are inclined and their bends add.'
  ],
  terms: [
    { term: 'Apex angle', also: ['prism angle', 'A'], def: 'The angle between the two refracting faces of a prism, measured at the edge where they meet.' },
    { term: 'Angle of deviation', also: ['deviation', 'δ'], def: 'The total angle by which a prism turns a ray from its original direction, always towards the base: δ = θ₁ + θ₄ − A.' },
    { term: 'Minimum deviation', also: ['δ_min', 'symmetric passage'], def: 'The least deviation a prism can give, reached when the ray passes symmetrically, parallel to the base. It is the standard way to measure an index.' },
    { term: 'Thin prism', also: ['wedge'], def: 'A prism of small apex angle, for which every ray near the normal is deviated by the same angle (n − 1)A.' },
    { term: 'Prism dioptre', also: ['Δ', 'PD', 'prism power'], def: 'The unit of the strength of a prism: 1 Δ deviates a ray by 1 cm at a distance of 1 m (0.573°). Used in optometry.' },
    { term: 'Base', def: 'The thick edge, opposite the apex, of a prism. Light is turned towards it.' }
  ],
  formulas: [
    {
      name: 'Index from the minimum deviation',
      expr: 'n = sin((A + dm)/2)/sin(A/2)', tex: 'n = \\frac{\\sin\\frac{A + \\delta_{\\min}}{2}}{\\sin\\frac{A}{2}}',
      vars: {
        n: { name: 'refractive index of the prism', min: 1, max: 4 },
        A: { name: 'apex angle', q: 'angle', unit: '°', value: 60, min: 1, max: 89 },
        dm: { name: 'minimum deviation', q: 'angle', unit: '°', value: 38.65, min: 0, max: 120, tex: '\\delta_{\\min}' }
      },
      solveFor: 'n',
      note: 'Light in air; for a prism in a liquid use n/n_liquid.',
      stories: {
        n: 'A prism with an apex angle of {A} turns a ray by at least {dm}. What is the index of the glass?',
        dm: 'What is the least deviation of a prism with apex angle {A} and index {n}?'
      }
    },
    {
      name: 'Deviation of a thin prism',
      expr: 'd = (n - 1)*A', tex: '\\delta = (n - 1)\\,A',
      vars: {
        d: { name: 'deviation', q: 'angle', unit: '°', tex: '\\delta' },
        n: { name: 'refractive index', value: 1.517, min: 1, max: 4 },
        A: { name: 'apex angle', q: 'angle', unit: '°', value: 5, min: 0, max: 15 }
      },
      solveFor: 'd',
      note: 'Good for apex angles below about 10° and rays near the normal.',
      stories: { d: 'A thin prism of apex angle {A} is made of glass of index {n}. By how much does it deviate a ray?' }
    },
    {
      name: 'Prism dioptres',
      expr: 'P = 100*tan(d)', tex: 'P = 100\\,\\tan\\delta',
      vars: {
        P: { name: 'strength of the prism', q: 'prism', unit: 'Δ' },
        d: { name: 'deviation', q: 'angle', unit: '°', value: 1.146, min: 0, max: 45, tex: '\\delta' }
      },
      solveFor: 'P',
      note: '1 Δ is 1 cm of deviation at 1 m. For small angles 1 Δ ≈ 0.573°.'
    },
    {
      name: 'Total deviation at a chosen angle of incidence',
      expr: 'd = t1 + asin(n*sin(A - asin(sin(t1)/n))) - A', tex: '\\delta = \\theta_1 + \\arcsin\\!\\left(n\\sin\\!\\left(A - \\arcsin\\frac{\\sin\\theta_1}{n}\\right)\\right) - A',
      vars: {
        d: { name: 'deviation', q: 'angle', unit: '°', tex: '\\delta' },
        t1: { name: 'angle of incidence', q: 'angle', unit: '°', value: 50, min: 0, max: 89, tex: '\\theta_1' },
        n: { name: 'refractive index', value: 1.517, min: 1.05, max: 3 },
        A: { name: 'apex angle', q: 'angle', unit: '°', value: 60, min: 1, max: 89 }
      },
      solveFor: 'd',
      note: 'Valid when the ray leaves the second face. If the arcsine has no value the ray is totally reflected.',
      practice: { unknowns: ['d'] }
    }
  ],
  examples: [
    {
      title: 'Measuring an index with a prism',
      q: 'A prism with an apex angle of 60.0° gives a minimum deviation of 46.2° for yellow light. What is the index of its glass, and which kind of glass is it likely to be?',
      steps: [
        { text: 'Use the minimum-deviation formula:', tex: 'n = \\frac{\\sin\\frac{60.0° + 46.2°}{2}}{\\sin 30.0°} = \\frac{\\sin 53.1°}{0.5} = \\frac{0.7997}{0.5}' },
        'That is $n = 1.599$.'
      ],
      a: 'n ≈ 1.60: well above an ordinary crown such as N-BK7 (1.517), so a dense crown or a light flint. The Abbe number, from a second measurement of the dispersion, would tell which.'
    },
    {
      title: 'A prism in a spectacle lens',
      q: 'A lens in CR-39 plastic ($n = 1.498$) must contain a prism of 2 Δ. What apex angle is needed, and how much thicker is the base edge than the apex edge across a 60 mm lens?',
      steps: [
        { text: 'The deviation of 2 Δ:', tex: '\\delta = \\arctan 0.02 = 1.146°' },
        { text: 'Thin-prism rule for the apex angle:', tex: 'A = \\frac{\\delta}{n - 1} = \\frac{1.146°}{0.498} = 2.30°' },
        { text: 'The thickness difference across 60 mm:', tex: '60\\ \\mathrm{mm} \\times \\tan 2.30° = 2.4\\ \\mathrm{mm}' }
      ],
      a: 'An apex angle of 2.3°; the lens is 2.4 mm thicker at its base edge.'
    }
  ],
  quiz: [
    { q: 'A thin prism with an apex angle of 4° is made of glass with $n = 1.5$. By how many degrees does it deviate a ray?', answer: 2, unit: '°', why: '$\\delta = (n-1)A = 0.5 \\times 4° = 2°$.' },
    { q: 'A prism of N-BK7 deviates a ray towards…', choices: ['its apex', 'its base', 'the normal of the second face', 'nowhere: the faces cancel'], a: 1, why: 'The ray is bent towards the thick end, the base. This is the reverse of what many people expect.' },
    { q: 'As the angle of incidence on a prism increases from a small value, the deviation first falls, reaches a minimum, and then rises again.', a: true, why: 'The minimum is at symmetric passage, where the ray inside is parallel to the base. Steeper and flatter rays are both deviated more.' },
    { q: 'A prism of 1 Δ deviates a ray by about…', choices: ['0.057°', '0.57°', '5.7°', '57°'], a: 1, why: '1 Δ = 1 cm in 1 m: $\\delta = \\arctan 0.01 = 0.573°$.' },
    { q: 'Why does a ray at a small angle of incidence sometimes not leave a 60° glass prism at all?', choices: ['It meets the second face beyond the critical angle and is totally reflected', 'The glass absorbs it', 'It is parallel to the base', 'The first surface reflects it totally'], a: 0, why: 'A ray that arrives nearly along the first face\'s normal meets the second face at $r_2 = A - r_1$, near 60°, beyond the critical angle of the glass (41.2° for N-BK7).' }
  ],
  applications: [
    'Prism spectrometers and goniometers that measure the refractive index of glass and liquids by minimum deviation.',
    'Spectacle prism and Fresnel stick-on prisms, which shift the image seen by one eye.',
    'Wedge prisms and Risley pairs that steer laser beams for scanners and lidar.',
    'Anamorphic prism pairs that widen the elliptical beam of a diode laser into a round one.',
    'Binoculars and periscopes, in which prisms (also using total reflection) fold the light path and erect the image.'
  ],
  history: 'Isaac Newton\'s prism experiments of 1666 made the prism famous, but in his time the deviation was only a qualitative effect. Joseph von Fraunhofer, in the years around 1814–1817, measured the indices of his optical glasses at the dark lines of the solar spectrum with a theodolite and a prism at minimum deviation, giving glassmakers a way to specify glass that is still used.',
  sources: [
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — prisms and the deviation formula.',
    'F. A. Jenkins and H. E. White, *Fundamentals of Optics*, ch. 2 — prisms, minimum deviation and the thin prism.',
    'ISO 13666 — Ophthalmic optics, spectacle lenses, vocabulary: the prism dioptre and prismatic power.'
  ],
  sim: 'rs-prism'
},

/* ================================================================ dispersion */
{
  id: 'dispersion-and-the-spectrum', parent: 'refraction-and-snell', title: 'Dispersion: why a prism makes a spectrum', level: 2,
  short: 'The refractive index of glass is not one number but a curve: blue light sees a higher index than red and is bent more. That dependence on wavelength, dispersion, spreads white light into a spectrum in a prism and puts coloured fringes on the images of simple lenses.',
  keywords: ['dispersion', 'spectrum', 'prism spectrum', 'Newton', 'Abbe number', 'normal dispersion', 'anomalous dispersion', 'Cauchy', 'Sellmeier', 'crown glass', 'flint glass', 'chromatic', 'colour spread', 'white light'],
  prereq: ['snells-law', 'prism-deviation', 'wavelength-frequency-and-colour'],
  related: ['the-abbe-number-and-glass-map', 'dispersion-formulas', 'optical-glass', 'axial-chromatic-aberration', 'achromatic-doublet', 'rainbows', 'fibre-dispersion-and-bandwidth', 'physics:dispersion'],
  body: `
Hold a glass prism in sunlight and a rainbow appears on the wall. White light is a mixture of colours, and glass bends each colour by a different amount: blue more than red. This dependence of the refractive index on wavelength is **dispersion**.

### Newton's prism
In 1666 Newton let a narrow beam of sunlight through a prism and saw an oblong spectrum, not the round spot that the old idea of colour as a modification of white light predicted. He then isolated one colour with a slit and sent it through a second prism: it was bent, but its colour did not change. The prism does not *make* the colours; it sorts the colours that white light already contains. Newton named seven, perhaps by analogy with the notes of the musical scale.

### Index against wavelength
In the visible, the index of every transparent material falls as the wavelength grows. That is *normal dispersion*:

| $\\lambda$ | 400 nm | 486.1 nm (F) | 587.6 nm (d) | 656.3 nm (C) | 700 nm |
|---|---|---|---|---|---|
| fused silica | 1.4701 | 1.4631 | 1.4585 | 1.4564 | 1.4553 |
| water | 1.3435 | 1.3372 | 1.3330 | 1.3312 | 1.3303 |
| N-BK7 crown glass | 1.5308 | 1.5224 | 1.5168 | 1.5143 | 1.5131 |
| dense flint N-SF11 | 1.8454 | 1.8065 | 1.7847 | 1.7760 | 1.7718 |

The curve is steeper in the blue than in the red, and it keeps rising towards the ultraviolet. The cause is that the electrons in the glass are bound with natural resonances in the ultraviolet; the nearer the light's frequency to a resonance, the stronger the response and the higher the index. Over the visible range a good fit is Cauchy's $n = A + B/\\lambda^2$ (N-BK7: $A = 1.5046$, $B = 0.0042\\ \\mu\\mathrm{m}^2$); the whole range is described by Sellmeier's equation ([[dispersion-formulas]]). Close to an absorption band the trend reverses: that is *anomalous dispersion*.

### The Abbe number
Glassmakers condense the curve into one number, the **Abbe number**,

$$V_d = \\frac{n_d - 1}{n_F - n_C}$$

the index step above 1 divided by the index difference between the blue F line and the red C line. A *large* $V$ means weak dispersion: N-FK51A 84.5, fused silica 67.8, N-BK7 64.2, water 55.8. A *small* $V$ means strong dispersion: F2 36.4, polycarbonate 29.9, N-SF11 25.7. Glasses with $V$ above about 50 are *crowns*, below, *flints*. See [[the-abbe-number-and-glass-map]].

### How wide is the spectrum?
For a thin prism the deviation is $(n-1)A$, so the spread between the F and C lines is $A(n_F - n_C) = \\delta/V$. A 5° prism of N-BK7 deviates by 2.6° and spreads the colours over 2.6°/64 = 0.04°. For a 60° prism at minimum deviation, N-BK7 spreads 400–700 nm over 1.6°, N-SF11 over 10.6° — which is why prism spectrometers use dense flint. The spread is not even: the blue end is stretched and the red end squeezed, unlike the nearly even spread of a grating.

### Why it matters
In a lens, each colour has its own focal length and the image has coloured fringes: [[axial-chromatic-aberration|chromatic aberration]], cured by pairing a crown and a flint in an [[achromatic-doublet]]. In an optical fibre, the colours of a pulse travel at different speeds and the pulse spreads ([[fibre-dispersion-and-bandwidth]]). In a rainbow, dispersion puts red outside violet ([[rainbows]]).

> [!key] The index falls with wavelength, so blue is bent more than red. The Abbe number $V = (n_d - 1)/(n_F - n_C)$ measures how weakly: crown glasses have $V > 50$, flints less.
`,
  ideas: [
    'Dispersion: the refractive index depends on the wavelength; in the visible it falls from blue to red (normal dispersion).',
    'A prism sorts the colours already present in white light: Newton\'s second prism did not change a colour.',
    'The Abbe number V = (n_d − 1)/(n_F − n_C): high for crowns (weak dispersion), low for flints (strong).',
    'A thin prism spreads the colours by δ/V; a dense flint prism spreads the spectrum nearly seven times wider than a crown one.',
    'The same dispersion causes chromatic aberration in lenses and pulse broadening in fibres.'
  ],
  pitfalls: [
    'The prism adds colour to white light — It only separates the colours already there; a colour isolated by a slit and sent through a second prism stays that colour.',
    'A glass with a high index disperses more — Not necessarily. N-SK16 and F2 both have n_d = 1.62, but their Abbe numbers are 60.3 and 36.4: the second spreads colours far more. Dispersion is a separate property, tabulated by V.',
    'Red light is bent more because it has more energy — Blue light has the higher frequency and energy, and blue is bent more. The cause is the glass: its response to the light is stronger nearer its ultraviolet resonances.'
  ],
  terms: [
    { term: 'Dispersion', def: 'The dependence of the refractive index on wavelength, and the spreading of white light into a spectrum that results. Normal dispersion: n falls as λ grows.' },
    { term: 'Abbe number', also: ['V', 'V_d', 'ν_d', 'constringence'], def: 'V_d = (n_d − 1)/(n_F − n_C): a single number for the strength of a glass\'s dispersion. High V (above about 50) is a crown with weak dispersion; low V a flint.' },
    { term: 'Spectral lines F, d, C', also: ['Fraunhofer lines', 'n_F', 'n_d', 'n_C'], def: 'The standard wavelengths at which glass indices are quoted: F (blue, 486.1 nm), d (yellow, 587.6 nm) and C (red, 656.3 nm).' },
    { term: 'Normal dispersion', def: 'The usual decrease of the refractive index with increasing wavelength in a transparent region, so that blue is bent more than red.' },
    { term: 'Anomalous dispersion', def: 'A rise of the index with wavelength near an absorption band of the material, opposite to the normal trend.' },
    { term: 'Crown and flint glass', def: 'The two families of optical glass: crowns have low dispersion (V above about 50) and flints have high dispersion. Combined in a doublet they correct chromatic aberration.' }
  ],
  formulas: [
    {
      name: 'Abbe number',
      expr: 'V = (nd - 1)/(nF - nC)', tex: 'V_d = \\frac{n_d - 1}{n_F - n_C}',
      vars: {
        V: { name: 'Abbe number', tex: 'V_d' },
        nd: { name: 'index at the d line (587.6 nm)', value: 1.62, min: 1.2, max: 3, tex: 'n_d' },
        nF: { name: 'index at the F line (486.1 nm)', value: 1.6321, min: 1.2, max: 3, tex: 'n_F' },
        nC: { name: 'index at the C line (656.3 nm)', value: 1.615, min: 1.2, max: 3, tex: 'n_C' }
      },
      solveFor: 'V',
      note: 'Defaults: flint glass F2 (V = 36). Higher V means weaker dispersion.',
      stories: { V: 'A glass has indices {nF} at the F line, {nd} at the d line and {nC} at the C line. What is its Abbe number?' }
    },
    {
      name: 'Colour spread of a thin prism',
      expr: 'ds = d/V', tex: '\\Delta\\delta = \\delta_F - \\delta_C = \\frac{\\delta}{V}',
      vars: {
        ds: { name: 'angle between the F and C rays', q: 'angle', unit: '′', tex: '\\Delta\\delta' },
        d: { name: 'mean deviation of the prism', q: 'angle', unit: '°', value: 2.6, min: 0, max: 15, tex: '\\delta' },
        V: { name: 'Abbe number', value: 64, min: 15, max: 100 }
      },
      solveFor: 'ds',
      note: 'For a thin prism: (n − 1)A divided by V. A way to see why high-index plastics show colour fringes in spectacles.',
      stories: { ds: 'A thin prism deviates a ray by {d}; its glass has an Abbe number of {V}. By what angle are the blue and the red rays separated?' }
    },
    {
      name: 'Cauchy\'s equation',
      expr: 'n = A + B/lambda^2', tex: 'n = A + \\frac{B}{\\lambda^2}',
      vars: {
        n: { name: 'refractive index' },
        A: { name: 'Cauchy coefficient A', value: 1.5046, min: 1, max: 4 },
        B: { name: 'Cauchy coefficient B', q: 'area', unit: 'µm²', value: 0.0042, min: 0, max: 0.2 },
        lambda: { name: 'wavelength in air', q: 'length', unit: 'nm', value: 550, min: 380, max: 1000, tex: '\\lambda' }
      },
      solveFor: 'n',
      note: 'A two-term fit that serves the visible range (defaults: N-BK7, good to about 0.0005). Sellmeier\'s equation does the whole range.',
      stories: { n: 'A glass has Cauchy coefficients A = {A} and B = {B}. What is its index at {lambda}?' },
      practice: { unknowns: ['n'] }
    }
  ],
  examples: [
    {
      title: 'The glass of an old pair of binoculars',
      q: 'A glass has $n_F = 1.5224$, $n_d = 1.5168$ and $n_C = 1.5143$. Find its Abbe number and say whether it is a crown or a flint.',
      steps: [
        { text: 'The principal dispersion:', tex: 'n_F - n_C = 1.5224 - 1.5143 = 0.0081' },
        { text: 'The Abbe number:', tex: 'V_d = \\frac{1.5168 - 1}{0.0081} = 63.8' }
      ],
      a: 'V ≈ 64 (the catalogue value for N-BK7 is 64.2): a crown glass, with weak dispersion.'
    },
    {
      title: 'Colour fringes from a 5° prism',
      q: 'Two thin prisms with an apex angle of 5° are made of N-BK7 ($n_d = 1.517$, $V = 64.2$) and of N-SF11 ($n_d = 1.785$, $V = 25.7$). Compare the deviation of yellow light and the angle that separates blue from red in each.',
      steps: [
        { text: 'N-BK7: deviation', tex: '\\delta = 0.517 \\times 5° = 2.59°,\\quad \\delta/V = 2.59°/64.2 = 0.040° = 2.4\'' },
        { text: 'N-SF11: deviation', tex: '\\delta = 0.785 \\times 5° = 3.92°,\\quad \\delta/V = 3.92°/25.7 = 0.153° = 9.2\'' }
      ],
      a: 'The flint bends yellow light 1.5 times as much, but spreads blue from red nearly four times as widely: 9.2′ against 2.4′.'
    }
  ],
  quiz: [
    { q: 'White light passes through a glass prism. Which colour is deviated most?', choices: ['Red', 'Green', 'Violet', 'All equally'], a: 2, why: 'The index is highest for the shortest wavelength, so violet is bent most and red least.' },
    { q: 'Newton sent one colour from his first prism through a second prism and its colour changed.', a: false, why: 'It did not change: the second prism only bent it. The colours are in the white light; the prism sorts them.' },
    { q: 'Glass A has an Abbe number of 64 and glass B of 26. Which spreads the spectrum more, for the same deviation of yellow light?', choices: ['A, the crown', 'B, the flint', 'They spread it equally', 'It depends on the colour of the light only'], a: 1, why: 'Colour spread = deviation/V, so the glass with the smaller V spreads more: B, by a factor 64/26 = 2.5.' },
    { q: 'Using Cauchy\'s equation with A = 1.5046 and B = 0.0042 µm², what is the index of this glass at 450 nm?', answer: 1.5253, tol: 0.001, why: '$n = 1.5046 + 0.0042/0.45^2 = 1.5046 + 0.02074 = 1.5253$.' },
    { q: 'A high-index plastic lens has an Abbe number of 32. Compared with a crown glass lens of the same power, the wearer is likelier to see…', choices: ['coloured fringes at the edges of the field', 'less reflection', 'a larger field', 'no difference'], a: 0, why: 'A lower Abbe number means stronger dispersion: more lateral chromatic aberration away from the lens centre, seen as coloured fringes on high-contrast edges.' }
  ],
  applications: [
    'Prism spectrometers and monochromators, in which dense flint prisms spread the spectrum.',
    'Achromatic doublets, which cancel the colour error of a lens by pairing a crown with a flint.',
    'The "fire" of a diamond: its dispersion ($n_F - n_C = 0.026$, three times that of N-BK7) with its small critical angle sends coloured flashes out of the top.',
    'Choosing spectacle lens materials: a higher index allows a thinner lens but usually a lower Abbe number.',
    'Telecommunications: chromatic dispersion in fibre sets the limit of bit rate and distance, and is compensated in long links.'
  ],
  history: 'Newton\'s prism experiments of 1666, reported to the Royal Society in 1672 and gathered in his *Opticks* of 1704, established that white light is composite. Newton concluded that dispersion always goes hand in hand with refraction, so that a lens free of colour fringes was impossible, and turned to the mirror telescope. In 1758 John Dollond patented an achromatic lens that combines crown and flint glass; Chester Moor Hall had made one in the 1730s.',
  sources: [
    'I. Newton, *Opticks* (1704), Book I, Part II — the experiments with the prism and the experimentum crucis.',
    'E. Hecht, *Optics*, ch. 3 — dispersion: the electron-oscillator model, Cauchy and Sellmeier equations.',
    'Handbook of Optics, vol. IV (optical properties of materials) — dispersion formulas and the Abbe number.'
  ],
  sim: 'rs-spectrum'
},

/* ================================================================ rainbows */
{
  id: 'rainbows', parent: 'refraction-and-snell', title: 'Rainbows', level: 2,
  short: 'A rainbow is sunlight turned back by raindrops: refracted into a drop, reflected from its back, refracted out. Rays pile up at one extreme angle, 42° from the point opposite the Sun, and dispersion puts red on the outside; a second reflection gives the fainter bow at 51° with the colours reversed.',
  keywords: ['rainbow', 'primary bow', 'secondary bow', 'Descartes', 'antisolar point', 'Alexander\'s dark band', 'supernumerary bows', 'raindrop', 'minimum deviation', 'fogbow', 'double rainbow', '42 degrees'],
  prereq: ['snells-law', 'dispersion-and-the-spectrum', 'fresnel-reflection'],
  related: ['halos-glories-and-coronas', 'brewster-angle', 'prism-deviation', 'atmospheric-refraction', 'why-the-sky-is-blue', 'feynman:partial-reflection'],
  body: `
A rainbow is sunlight turned back by millions of raindrops. Its arc, its colours and its place in the sky follow from the path of one ray through one spherical drop.

### One ray in one drop
A ray from the Sun meets a drop at some height above its axis. It is refracted into the water, travels to the back, is partly reflected there, crosses the drop again and is refracted out. For an angle of incidence $\\theta_1$ and an angle of refraction $\\theta_2$ inside, the ray comes back at an angle $\\alpha$ from the **antisolar point** (the direction straight away from the Sun) given by

$$\\alpha = 4\\theta_2 - 2\\theta_1$$

A ray at the centre of the drop goes straight back: $\\alpha = 0$. As the impact height rises, $\\alpha$ grows, but not without end: it reaches a **maximum** and then falls again. At a maximum the angle hardly changes from one ray to the next, so a whole band of rays leaves in nearly the same direction: that concentration of light is the rainbow (Descartes, 1637). No ray returns at a larger angle after one reflection, so the sky outside the bow is dark. The maximum occurs where

$$\\cos\\theta_1 = \\sqrt{\\frac{n^2 - 1}{3}}$$

For green light ($n = 1.334$): $\\theta_1 = 59.3°$, $\\theta_2 = 40.1°$ and $\\alpha = 41.9°$.

### The colours
Water disperses light, so each colour has its own bow:

| Colour | $\\lambda$ | $n$ | Primary bow | Secondary bow |
|---|---|---|---|---|
| violet | 400 nm | 1.3435 | 40.6° | 53.6° |
| blue | 450 nm | 1.3394 | 41.2° | 52.6° |
| green | 550 nm | 1.3343 | 41.9° | 51.2° |
| red | 650 nm | 1.3313 | 42.3° | 50.5° |
| deep red | 700 nm | 1.3303 | 42.5° | 50.2° |

Red water bends least and returns farthest, so **red is on the outside** of the primary bow, violet inside; the whole bow is 1.9° wide. Because the Sun's disc itself is 0.53° across, the colours overlap and the bands are broad and pale.

### Where it is
The bow is a circle of angular radius 42° about the antisolar point, which is the shadow of your head. The top of the bow stands $42° - h$ above the horizon when the Sun is $h$ above it; with the Sun higher than 42° no bow is visible from the ground. Each observer sees a different bow, made by different drops.

### The second bow and the dark band
A ray reflected twice leaves at $\\alpha = 180° + 2\\theta_1 - 6\\theta_2$, with a *minimum* of 51° (where $\\cos\\theta_1 = \\sqrt{(n^2-1)/8}$). Its colours are reversed, red inside, and it is dimmer, since another part of the light is lost at the second reflection. Between 42° and 51° the sky is darker than on either side, **Alexander's dark band**: geometrically no ray reaches it.

### Details
The light of a rainbow is strongly polarized (about 90 %), tangent to the arc, because the internal reflection happens close to Brewster's angle ([[brewster-angle]]). Close under the primary bow, faint extra pastel arcs, **supernumerary bows**, come from interference between rays through the drop and appear only for small drops of about 1 mm or less. Very small drops, such as the 0.02–0.05 mm droplets of fog, blur everything into a broad, nearly white **fogbow**.

> [!key] A rainbow bow is where rays through a drop pile up: at the extreme angle 42° (one reflection) or 51° (two) from the point opposite the Sun. Dispersion makes red the outer colour of the primary.
`,
  ideas: [
    'A ray through a drop comes back at α = 4θ₂ − 2θ₁ from the antisolar point; α has a maximum of about 42°, and rays pile up there: the primary bow.',
    'Red is bent least, so it is outermost in the primary bow (42.5°) with violet inside (40.6°).',
    'The bow is a circle of radius 42° about the antisolar point, so its top is 42° minus the Sun\'s altitude above the horizon.',
    'Two internal reflections give the secondary bow at 51° with the colours reversed; between the two lies the dark Alexander\'s band.',
    'The light of a rainbow is strongly polarized, and very small drops give a white fogbow.'
  ],
  pitfalls: [
    'A rainbow is a thing at a certain place in the sky — It is an angle, not an object: every observer sees a bow made by different drops, and it moves with you.',
    'Each colour comes from a different part of the drop — Every colour is spread through the drop; the bow forms where the rays of that colour pile up, at a slightly different angle for each colour.',
    'The bow is a simple reflection of the Sun in the raindrops — It needs two refractions and a reflection inside the drop. A plain reflection from the surface of a drop gives the glitter and no bow.'
  ],
  terms: [
    { term: 'Rainbow', also: ['primary bow', 'primary rainbow'], def: 'The coloured arc, 42° in radius around the antisolar point, formed by sunlight that is refracted into raindrops, reflected once at the back and refracted out. Red is on the outside.' },
    { term: 'Antisolar point', def: 'The point of the sky exactly opposite the Sun, on the line from the Sun through the observer\'s head; it lies below the horizon when the Sun is up. A rainbow is centred on it.' },
    { term: 'Secondary bow', also: ['secondary rainbow', 'double rainbow'], def: 'The fainter outer bow, at about 51° from the antisolar point, formed by two internal reflections in the drops. Its colours are reversed: red is inside.' },
    { term: 'Alexander\'s dark band', def: 'The darker region of sky between the primary and secondary bows, from 42° to 51° from the antisolar point, which no ray of geometrical optics reaches.' },
    { term: 'Supernumerary bows', def: 'Faint pastel arcs just inside the primary bow, produced by interference of rays that have taken different paths through small drops.' },
    { term: 'Descartes ray', also: ['rainbow ray'], def: 'The ray through a drop that leaves at the extreme angle (42° for the primary), where neighbouring rays are returned in nearly the same direction.' }
  ],
  formulas: [
    {
      name: 'Where the rainbow ray strikes the drop',
      expr: 'ti = acos(sqrt((n^2 - 1)/((k + 1)^2 - 1)))', tex: '\\theta_1 = \\arccos\\sqrt{\\frac{n^2 - 1}{(k+1)^2 - 1}}',
      vars: {
        ti: { name: 'angle of incidence of the rainbow ray', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\theta_1' },
        n: { name: 'refractive index of water', value: 1.334, min: 1.05, max: 2 },
        k: { name: 'number of reflections inside the drop (1 primary, 2 secondary)', int: true, value: 1, min: 1, max: 3 }
      },
      solveFor: 'ti',
      note: 'The ray whose return angle is extreme. Primary: k = 1 (59.3° for green light); secondary: k = 2 (71.8°).'
    },
    {
      name: 'Angle of the primary bow',
      expr: 'a = 4*asin(sin(ti)/n) - 2*ti', tex: '\\alpha = 4\\theta_2 - 2\\theta_1,\\quad \\theta_2 = \\arcsin\\frac{\\sin\\theta_1}{n}',
      vars: {
        a: { name: 'angle from the antisolar point', q: 'angle', unit: '°', tex: '\\alpha' },
        ti: { name: 'angle of incidence', q: 'angle', unit: '°', value: 59.3, min: 1, max: 89, tex: '\\theta_1' },
        n: { name: 'refractive index of water', value: 1.334, min: 1.05, max: 2 }
      },
      solveFor: 'a',
      note: 'Taken at the rainbow ray (the maximum), this is the bow\'s angle: 41.9° for green light, 42.5° for deep red, 40.6° for violet.',
      stories: { a: 'A ray strikes a drop of index {n} at {ti} and reflects once inside. At what angle from the antisolar point does it return?' }
    },
    {
      name: 'Angle of the secondary bow',
      expr: 'a = pi + 2*ti - 6*asin(sin(ti)/n)', tex: '\\alpha = 180° + 2\\theta_1 - 6\\theta_2,\\quad \\theta_2 = \\arcsin\\frac{\\sin\\theta_1}{n}',
      vars: {
        a: { name: 'angle from the antisolar point', q: 'angle', unit: '°', tex: '\\alpha' },
        ti: { name: 'angle of incidence', q: 'angle', unit: '°', value: 71.8, min: 1, max: 89, tex: '\\theta_1' },
        n: { name: 'refractive index of water', value: 1.334, min: 1.05, max: 2 }
      },
      solveFor: 'a',
      note: 'For two reflections, at the rainbow ray (the minimum): 51.2° for green light.'
    },
    {
      name: 'Height of the bow above the horizon',
      expr: 'top = ab - hs', tex: 'h_{\\mathrm{top}} = \\alpha_b - h_s',
      vars: {
        top: { name: 'height of the top of the bow', q: 'angle', unit: '°', signed: true, tex: 'h_{\\mathrm{top}}' },
        ab: { name: 'angular radius of the bow', q: 'angle', unit: '°', value: 42, min: 40, max: 54, tex: '\\alpha_b' },
        hs: { name: 'altitude of the Sun', q: 'angle', unit: '°', value: 20, signed: true, min: -10, max: 90, tex: 'h_s' }
      },
      solveFor: 'top',
      note: 'Negative: the bow is below the horizon and cannot be seen from the ground.',
      stories: { top: 'The Sun stands {hs} above the horizon. How high is the top of a primary rainbow of radius {ab}?' }
    }
  ],
  examples: [
    {
      title: 'Computing the primary bow',
      q: 'Find the angle of the primary rainbow for water of index 1.333 (yellow light).',
      steps: [
        { text: 'The rainbow ray strikes at', tex: '\\cos\\theta_1 = \\sqrt{\\frac{1.333^2 - 1}{3}} = \\sqrt{0.2590} = 0.5089 \\quad\\Rightarrow\\quad \\theta_1 = 59.4°' },
        { text: 'Inside the drop:', tex: '\\sin\\theta_2 = \\frac{\\sin 59.4°}{1.333} = 0.6458 \\quad\\Rightarrow\\quad \\theta_2 = 40.2°' },
        { text: 'The angle from the antisolar point:', tex: '\\alpha = 4 \\times 40.2° - 2 \\times 59.4° = 42.1°' }
      ],
      a: 'About 42°: the primary rainbow. Using n = 1.343 (violet) or 1.331 (red) moves it to 40.6° or 42.4°.'
    },
    {
      title: 'Will there be a bow?',
      q: 'On a showery afternoon the Sun is 25° above the horizon. How high is the top of the primary bow, and could you see one at midday in the tropics, with the Sun at 70°?',
      steps: [
        { text: 'Top of the bow: the radius of the bow less the Sun\'s altitude:', tex: 'h_{\\mathrm{top}} = 42° - 25° = 17°' },
        'With the Sun at 70° the top would be at $42° - 70° = -28°$: below the horizon.'
      ],
      a: '17° above the horizon at 25°; no bow from the ground with the Sun higher than 42° (from a plane or a hilltop a bow can be seen below the horizon).'
    }
  ],
  quiz: [
    { q: 'In the primary rainbow, which colour is on the outside of the arc?', choices: ['Violet', 'Green', 'Red', 'It depends on the Sun'], a: 2, why: 'Red is bent least by water, so its bow has the largest radius (42.5°) and violet the smallest (40.6°).' },
    { q: 'You see a rainbow whose centre is at the antisolar point. The Sun is behind you, low in the sky.', a: true, why: 'The bow is a circle around the antisolar point, so it forms in the sky opposite the Sun; with the Sun low behind you, the arc stands high above the horizon.' },
    { q: 'The Sun is 30° above the horizon. At about what angle above the horizon is the top of the primary rainbow?', answer: 12, unit: '°', why: '$42° - 30° = 12°$.' },
    { q: 'Why does the sky between the primary and the secondary bow look darker than outside them?', choices: ['No ray reaches it after one or two reflections (Alexander\'s band)', 'The rain is thinner there', 'Red light is absorbed there', 'It is the shadow of the drops'], a: 0, why: 'After one reflection no ray returns at more than 42°, after two none at less than 51°. The band between them is lit by neither bow.' },
    { q: 'The secondary bow has its colours in the opposite order because…', choices: ['the second reflection turns the ray over, so the colour that is bent most ends on the outside', 'it comes from the Moon', 'the drops are bigger', 'the light is polarized the other way'], a: 0, why: 'After two internal reflections the angle has a minimum instead of a maximum, and violet, which is bent most, ends up farthest from the antisolar point.' }
  ],
  applications: [
    'Weather watching: a rainbow shows rain falling opposite the Sun; where weather moves from west to east, an evening bow in the east means the rain is moving away.',
    'Rainbow refractometry: measuring the bow angle of the droplets in a spray or in a cloud gives their refractive index (and so temperature or composition) and, from the supernumerary bows, their size.',
    'Planetary science: the polarization "rainbow" of the clouds of Venus, analysed in the 1970s, gave their droplets an index of about 1.45, not that of water (1.33): they are a solution of sulfuric acid.',
    'Photography: a polarizing filter turned to pass the tangential polarization strengthens the bow against the sky.',
    'Garden sprays, waterfalls and the fountain, where the same bow can be reproduced at will.'
  ],
  history: 'Alexander of Aphrodisias described the dark band between the bows around 200 CE. Theodoric of Freiberg (about 1304) and Kamāl al-Dīn al-Fārisī (about 1309) independently traced the rays through a water-filled glass sphere and explained the primary and secondary bows. René Descartes calculated the angles in 1637 in *Les Météores*, using the law of refraction, which he published in the same work. Newton explained the colours by dispersion; Thomas Young explained the supernumerary bows by interference (1804) and George Airy gave the full wave theory in 1838.',
  sources: [
    'H. M. Nussenzveig, "The theory of the rainbow", *Scientific American* 236 (April 1977) — geometric optics and the wave theory of the bow.',
    'R. L. Lee and A. B. Fraser, *The Rainbow Bridge* (Pennsylvania State University Press, 2001) — the history and optics of the rainbow.',
    'M. Minnaert, *Light and Colour in the Open Air* — the rainbow, supernumerary bows and the fogbow.'
  ],
  sim: 'rs-rainbow'
},

/* ================================================================ atmospheric refraction */
{
  id: 'atmospheric-refraction', parent: 'refraction-and-snell', title: 'Refraction in the atmosphere', level: 2,
  short: 'The air thins with height, so light from the Sun, the Moon and the stars passes through layers of falling refractive index and bends towards the ground. At the horizon bodies are lifted by about 35 arcminutes, more than the width of the Sun, which is why we see the Sun after it has geometrically set, and why it is flattened.',
  keywords: ['atmospheric refraction', 'sunset', 'sunrise', 'flattened Sun', 'horizon', 'refraction table', 'star positions', 'standard atmosphere', 'astronomical refraction', 'Novaya Zemlya', 'sextant correction', 'radio horizon'],
  prereq: ['snells-law', 'refractive-index', 'refraction-at-a-flat-surface'],
  related: ['mirages-and-looming', 'the-green-flash-and-twinkling', 'gradient-index-optics', 'why-the-sky-is-blue', 'halos-glories-and-coronas', 'dispersion-and-the-spectrum'],
  body: `
Air is a transparent material like any other, with a refractive index of 1.000277 at the ground — and it thins out with height. A ray of sunlight coming down through the atmosphere therefore passes through layers of rising index, and at each boundary [[snells-law|Snell's law]] bends it a little towards the vertical. The path curves, hollow side down, and an observer who assumes that light travels in straight lines sees the Sun **higher** than it really is.

### How much
Near the zenith the atmosphere is a stack of parallel layers and the lift is

$$R \\approx (n - 1)\\tan z$$

where $z$ is the apparent angle from the zenith and $n - 1 = 2.77\\times10^{-4}$: $R = 57\\ \\text{arcsec} \\times \\tan z$, 1 arcminute at 45° from the zenith. The layers curve with the Earth, so near the horizon this formula fails, and the real lift is found by following the ray through the layers:

| Apparent altitude | 0° | 1° | 2° | 5° | 10° | 20° | 45° | 90° |
|---|---|---|---|---|---|---|---|---|
| Refraction | 35′ | 24.5′ | 18′ | 9.7′ | 5.2′ | 2.6′ | 0.95′ | 0 |

(standard air, 15 °C, 1013 hPa, green light; ′ is an arcminute.) At the horizon the lift of 35′ (0.58°) exceeds the Sun's own diameter, 32′.

### Setting after it has set
When the lower edge of the Sun seems to touch the horizon, the Sun's centre is geometrically 19′ *below* it. We see the whole Sun after it has set; the day is lengthened by a couple of minutes at each end near the equator, more at higher latitudes where the Sun descends more slowly. By convention sunrise and sunset are the moments at which the centre of the Sun is at −50′: 34′ for refraction and 16′ for the Sun's radius.

### A flattened Sun
The lift is not the same across the Sun's disc: the lower edge, nearer the horizon, is lifted 35′, the upper edge, 32′ higher, only about 29′. The disc is squeezed vertically from 32′ to about 26′: a flattened, oval Sun or Moon at the horizon, 17–20 % shorter than wide.

### Colour, temperature and pressure
Air disperses: $n - 1$ is $2.82\\times10^{-4}$ at 400 nm and $2.76\\times10^{-4}$ at 700 nm, so blue light is lifted nearly 1′ more than red at the horizon. The upper rim of the setting Sun can then be blue-green, the origin of the green flash ([[the-green-flash-and-twinkling]]). The lift is proportional to the density of the air, that is to $P/T$: cold, dense air gives 40′ at the horizon, hot, thin air 32′.

### When the layers are not ordinary
Over a hot road or a cold sea the temperature changes sharply in the lowest metres and the rays bend much more strongly: mirages, looming and the Novaya Zemlya effect ([[mirages-and-looming]]). Turbulent cells of unequal density make stars twinkle.

> [!key] The air's index falls with height, so rays bend towards the ground and bodies appear higher: $R \\approx (n-1)\\tan z$ away from the horizon, 35′ at it. We see the Sun after it has geometrically set, and flattened.
`,
  ideas: [
    'The density, and so the refractive index, of air falls with height; rays curve towards the ground and objects look higher than they are.',
    'Away from the horizon the lift is R ≈ (n − 1) tan z, about 1′ at 45° from the zenith; at the horizon it is 35′.',
    'The horizon lift exceeds the Sun\'s width, so the whole Sun is visible after it has geometrically set.',
    'The lower edge is lifted more than the upper edge: the Sun is flattened by about a fifth at the horizon.',
    'The lift scales with air density (P/T), and blue is lifted slightly more than red.'
  ],
  pitfalls: [
    'The Sun looks bigger at the horizon because refraction magnifies it — Refraction squeezes it vertically if anything. The apparent enlargement is a perceptual effect, the moon illusion.',
    'Refraction only matters at the horizon — It is 1′ at 45° from the zenith and does not vanish until the zenith. Observers correct star positions for it at every altitude.',
    'The Sun is really where we see it — At sunset it is below the horizon geometrically while we still see it entire.'
  ],
  terms: [
    { term: 'Atmospheric refraction', also: ['astronomical refraction'], def: 'The bending of light from a celestial body by the atmosphere, which makes the body seem higher in the sky than it is. Zero at the zenith, about 35′ at the horizon.' },
    { term: 'Apparent altitude', def: 'The angular height above the horizon at which a body is seen, including the lift by refraction. The true (geometric) altitude is lower by the refraction R.' },
    { term: 'Zenith distance', also: ['z'], def: 'The angle from the point overhead (the zenith) to a body: 90° minus its altitude.' },
    { term: 'Standard atmosphere', def: 'A conventional air model (15 °C, 1013.25 hPa at sea level) used to tabulate refraction and other atmospheric effects. In it n − 1 = 2.8 × 10⁻⁴ at the ground.' },
    { term: 'Scale height', def: 'The height over which the density of the atmosphere falls by the factor e: about 8.4 km for air at 288 K. The refractive index excess n − 1 falls with it.' }
  ],
  formulas: [
    {
      name: 'Refraction away from the horizon',
      expr: 'R = (n - 1)*tan(z)', tex: 'R = (n - 1)\\,\\tan z',
      vars: {
        R: { name: 'lift of the body by refraction', q: 'angle', unit: '″' },
        n: { name: 'refractive index of the air at the ground', value: 1.000277, min: 1, max: 1.001 },
        z: { name: 'apparent zenith distance', q: 'angle', unit: '°', value: 45, min: 0, max: 75 }
      },
      solveFor: 'R',
      note: 'Valid for zenith distances up to about 75°. Closer to the horizon the curvature of the Earth makes the real refraction larger than this formula gives.',
      stories: { R: 'Air at the ground has a refractive index of {n}. A star is seen {z} from the zenith. By how much does refraction lift it?' }
    },
    {
      name: 'Excess refractive index of air',
      expr: 'dn = 2.77e-4*(P/101325)*(288.15/T)', tex: '\\Delta n = 2.77\\times10^{-4}\\,\\frac{P}{101\\,325\\ \\mathrm{Pa}}\\,\\frac{288.15\\ \\mathrm{K}}{T}',
      vars: {
        dn: { name: 'n − 1 of the air', tex: '\\Delta n' },
        P: { name: 'air pressure', q: 'pressure', unit: 'hPa', value: 1013.25, min: 300, max: 1100 },
        T: { name: 'air temperature', q: 'temperature', unit: '°C', value: 15, min: -60, max: 60 }
      },
      solveFor: 'dn',
      note: 'For green light, dry air. The refraction of a body is proportional to this.',
      stories: { dn: 'The air at the ground is at {P} and {T}. What is n − 1?' }
    }
  ],
  examples: [
    {
      title: 'Refraction at 60° from the zenith',
      q: 'A star is seen 60° from the zenith through air with $n = 1.000277$. By how much does refraction raise it?',
      steps: [
        { text: 'Use $R = (n-1)\\tan z$:', tex: 'R = 2.77\\times10^{-4} \\times \\tan 60° = 4.80\\times10^{-4}\\ \\mathrm{rad}' },
        'In arcseconds: $4.80\\times10^{-4} \\times 206\\,265 = 99$ arcseconds, about 1.65′.'
      ],
      a: 'About 1.7′. (The tabulated value for 30° of altitude, from the layered model, is 1.64′.)'
    },
    {
      title: 'How much later does the Sun set?',
      q: 'At the equator the Sun sinks at 15° an hour at the equinox. By how long does refraction delay the moment the Sun\'s lower edge is seen to touch the horizon, compared with the moment it geometrically touches it?',
      steps: [
        'The lift at the horizon is 35′ = 0.58°.',
        { text: 'The Sun has to sink that much more:', tex: '\\Delta t = \\frac{0.58°}{15°/\\mathrm{h}} = 0.039\\ \\mathrm{h} = 2.3\\ \\mathrm{min}' },
        'At a latitude of 50°, where the Sun descends at about $15°\\cos 50° = 9.6°$ per hour, the delay is 3.6 minutes.'
      ],
      a: 'About 2.3 minutes at the equator and 3.6 minutes at 50° latitude.'
    }
  ],
  quiz: [
    { q: 'Because of atmospheric refraction, a star near the horizon seems…', choices: ['higher than it really is', 'lower than it really is', 'in the right place, but red', 'to move sideways'], a: 0, why: 'The light bends towards the ground, and our eyes extend the final direction back in a straight line: the star appears higher, by about 35′ at the horizon.' },
    { q: 'When the lower edge of the Sun seems to touch the horizon, the Sun has already geometrically set.', a: true, why: 'Refraction lifts the Sun by about 35′, more than its own width of 32′, so even the whole Sun is still visible when its centre is 19′ below the horizon.' },
    { q: 'Refraction at an altitude of 45° is about…', choices: ['35′', '10′', '1′', '0.01′'], a: 2, why: 'At 45° from the zenith, $R = (n-1)\\tan 45°$ is 57 arcseconds, about 1′. 35′ is the horizon value.' },
    { q: 'Using $R = (n-1)\\tan z$ with $n - 1 = 2.77 \\times 10^{-4}$, what is the refraction, in arcseconds, at a zenith distance of 30°?', answer: 33, unit: '″', why: '$2.77\\times10^{-4} \\times \\tan 30° = 1.60\\times10^{-4}$ rad, which is 33 arcseconds.' },
    { q: 'Why is the setting Sun flattened?', choices: ['Its lower edge is lifted more than its upper edge', 'The Earth\'s air magnifies it horizontally', 'It really is oval', 'Blue light is scattered out of it'], a: 0, why: 'The lift decreases with altitude: about 35′ for the lower limb and 29′ for the upper limb, 32′ higher, so the disc is squeezed vertically.' }
  ],
  applications: [
    'Astronomy and navigation: telescopes, theodolites and sextants apply refraction corrections to every observation of a star, the Sun or a planet.',
    'Sunrise and sunset tables, which use −50′ for the Sun\'s centre to allow for refraction and for the Sun\'s radius.',
    'Surveying over long sight lines, where refraction bends the line of sight and is corrected by a coefficient of about 0.13.',
    'Radio and radar: the same layered atmosphere bends microwaves, so engineers take the radio horizon as that of an Earth of four-thirds the real radius.',
    'Satellite navigation, where the delay and the bending of signals by the troposphere (about 2.3 m of extra path at the zenith) are modelled.'
  ],
  history: 'Ibn al-Haytham, in the 11th century, discussed the refraction of light from the heavenly bodies in the atmosphere in his *Book of Optics*. Tycho Brahe compiled refraction tables in the 1580s and corrected his observations with them; later tables by Cassini (1662), Newton and Flamsteed, and Bessel (1820s) improved the model. In 1597 the Dutch expedition of Willem Barentsz, wintering on Novaya Zemlya, saw the Sun return about two weeks earlier than it should have: an unusually strong refraction in the cold air lifted it above the horizon.',
  sources: [
    'J. Meeus, *Astronomical Algorithms*, ch. 16 — atmospheric refraction and its formulae.',
    'D. K. Lynch and W. Livingston, *Color and Light in Nature* — refraction at sunrise and sunset, the flattened Sun.',
    'M. Minnaert, *Light and Colour in the Open Air* — refraction of the Sun, Moon and stars.'
  ],
  sim: 'rs-atmosphere'
},

/* ================================================================ evanescent waves */
{
  id: 'evanescent-waves-and-frustrated-tir', parent: 'refraction-and-snell', title: 'Evanescent waves and frustrated total reflection', level: 3,
  short: 'Total internal reflection is not quite a wall: a field leaks into the rarer medium and dies away exponentially within about a wavelength. Bring a second medium that close and light crosses the gap, frustrating the reflection. Fingerprint sensors, TIRF microscopes and infrared ATR spectrometers all use this thin skin of light.',
  keywords: ['evanescent wave', 'frustrated total internal reflection', 'FTIR', 'penetration depth', 'TIRF microscopy', 'ATR spectroscopy', 'fingerprint sensor', 'beam splitter cube', 'near field', 'optical tunnelling', 'Goos-Hänchen'],
  prereq: ['critical-angle-and-total-internal-reflection', 'fresnel-reflection', 'wavelength-frequency-and-colour'],
  related: ['fibre-numerical-aperture', 'beam-splitters', 'fluorescence-and-confocal-microscopy', 'thin-film-interference', 'how-an-optical-fibre-guides-light', 'refractometers'],
  body: `
[[critical-angle-and-total-internal-reflection|Total internal reflection]] looks like a wall, but it is not quite one. Beyond the critical angle all the power is reflected, yet the electromagnetic field does not stop dead at the surface: it leaks a short way into the rarer medium and dies away exponentially. This non-propagating field is the **evanescent wave**.

### The field beyond the surface
In the rarer medium the field still runs along the surface, with a wavelength $\\lambda/(n_1\\sin\\theta)$, but perpendicular to the surface it does not oscillate; it decays. Its intensity falls as $e^{-z/d_p}$ with the **penetration depth**

$$d_p = \\frac{\\lambda}{4\\pi\\sqrt{n_1^2\\sin^2\\theta - n_2^2}}$$

($\\lambda$ in vacuum). The depth is of the order of a wavelength or less and shrinks as the angle rises. For N-BK7 glass against air in green light (550 nm):

| Angle of incidence | 41.5° (just past 41.2°) | 42° | 45° | 50° | 60° | 80° |
|---|---|---|---|---|---|---|
| $d_p$ | 434 nm | 252 nm | 113 nm | 74 nm | 51 nm | 39 nm |

At the critical angle the depth grows without limit. No power flows across the surface on average: the field is stored, not radiated.

### Frustrating it
Bring a second piece of glass within a wavelength or so of the surface and the field reaches it, becomes a propagating wave again and carries power on. The reflection is **frustrated**. For two glass blocks separated by an air gap $g$, with s-polarized green light at 45° in N-BK7, the share that crosses is

| Gap $g$ | 0 | 50 nm | 100 nm | 200 nm | 300 nm | 500 nm | 800 nm |
|---|---|---|---|---|---|---|---|
| Transmitted | 100 % | 89 % | 66 % | 29 % | 12 % | 2.0 % | 0.1 % |

So the gap is a continuous control of the reflectance, a beam splitter with no coating and, for $g$ near zero, one without losses.

### Where it is used
- **Fingerprint sensors.** A finger is pressed on a glass prism lit from inside. Where a ridge touches the glass, the reflection is frustrated and the pixel is dark; over a valley an air gap remains and the light is totally reflected.
- **TIRF microscopy.** A laser beam is sent through the cover slip beyond the critical angle for water (61° for glass of 1.52). The evanescent field, about 100 nm deep, lights only the fluorescent molecules at the glass: cell membranes and single molecules, with almost no background from the cell above.
- **ATR spectroscopy.** A sample is pressed onto a crystal of diamond, zinc selenide or germanium; infrared light reflects inside the crystal and the evanescent wave, about a micrometre deep, is absorbed by the sample, giving its infrared spectrum without preparation.
- **Touch screens** that detect fingertips frustrating the light guided in a sheet of acrylic, and **couplers** that pass light between close fibres, or from a prism into a thin waveguide, by their overlapping evanescent fields.

### A little more
The reflected beam is displaced along the surface by about a wavelength, the *Goos–Hänchen shift* (1947), and the phases of the s and p reflections differ, which is how a Fresnel rhomb turns linear into circular polarization.

> [!key] Beyond the critical angle a field of depth $d_p = \\lambda/\\bigl(4\\pi\\sqrt{n_1^2\\sin^2\\theta - n_2^2}\\bigr)$ lies in the rarer medium, carrying no net power. A second medium within about a wavelength frustrates the reflection and lets light through.
`,
  ideas: [
    'Beyond the critical angle the field penetrates the rarer medium as an exponentially decaying evanescent wave, with no net power flow.',
    'Its intensity falls as exp(−z/d_p), with d_p = λ/(4π√(n₁² sin²θ − n₂²)): a fraction of a wavelength to a wavelength.',
    'A second medium within a wavelength or so frustrates total reflection: light crosses the gap, falling off roughly exponentially with the gap.',
    'Fingerprint sensors, TIRF microscopes, ATR spectroscopy and evanescent couplers all use this thin skin of light.',
    'Close to the critical angle the field reaches farther; at steep angles it is squeezed against the surface.'
  ],
  pitfalls: [
    'Total internal reflection means that no light enters the second medium — A field does enter, but it decays within about a wavelength and carries no net power away, unless something absorbs or couples it out.',
    'The evanescent wave is a beam travelling into the second medium — It travels along the surface and decays at right angles to it; nothing travels away from the surface.',
    'The gap must be bridged by glass — Any material of sufficient index frustrates TIR: skin (fingerprint), water, a polymer, a sample on an ATR crystal.'
  ],
  terms: [
    { term: 'Evanescent wave', also: ['evanescent field', 'inhomogeneous wave'], def: 'The field that exists beyond a totally reflecting surface: it travels along the surface but decays exponentially with distance from it, and carries no net power away.' },
    { term: 'Penetration depth', also: ['d_p', 'decay length'], def: 'The distance beyond a totally reflecting surface at which the intensity of the evanescent field has fallen to 1/e: λ/(4π√(n₁² sin²θ − n₂²)).' },
    { term: 'Frustrated total internal reflection', also: ['FTIR'], def: 'The partial transmission of light across a thin gap between two media that would otherwise totally reflect it, because the evanescent field reaches the second medium. Transmission falls off with the gap.' },
    { term: 'TIRF microscopy', also: ['total internal reflection fluorescence'], def: 'A fluorescence microscopy in which an evanescent wave from a totally reflected beam, about 100 nm deep, excites only the fluorophores close to the cover slip.' },
    { term: 'ATR', also: ['attenuated total reflection', 'ATR spectroscopy'], def: 'Infrared spectroscopy in which light is totally reflected inside a crystal in contact with the sample; the evanescent wave is absorbed in the sample, giving its spectrum.' }
  ],
  formulas: [
    {
      name: 'Penetration depth',
      expr: 'dp = lambda/(4*pi*sqrt(n1^2*sin(t)^2 - n2^2))', tex: 'd_p = \\frac{\\lambda}{4\\pi\\sqrt{n_1^2\\sin^2\\theta - n_2^2}}',
      vars: {
        dp: { name: 'depth at which the intensity falls to 1/e', q: 'length', unit: 'nm', tex: 'd_p' },
        lambda: { name: 'wavelength in vacuum', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        n1: { name: 'index of the denser medium', value: 1.517, min: 1, max: 5, tex: 'n_1' },
        n2: { name: 'index of the rarer medium', value: 1, min: 1, max: 5, tex: 'n_2' },
        t: { name: 'angle of incidence', q: 'angle', unit: '°', value: 45, min: 1, max: 89, tex: '\\theta' }
      },
      solveFor: 'dp',
      note: 'Only beyond the critical angle: n₁ sin θ must exceed n₂.',
      stories: { dp: 'Light of wavelength {lambda} travels in glass of index {n1} and is totally reflected at {t} at a surface with a medium of index {n2}. How deep does the evanescent field reach (intensity down to 1/e)?' }
    },
    {
      name: 'Field intensity at a distance',
      expr: 'I = exp(-z/dp)', tex: 'I_{\\mathrm{rel}} = \\frac{I(z)}{I(0)} = e^{-z/d_p}',
      vars: {
        I: { name: 'intensity relative to that at the surface', q: 'ratio', unit: '%', min: 0, max: 100, tex: 'I_{\\mathrm{rel}}' },
        z: { name: 'distance from the surface', q: 'length', unit: 'nm', value: 100 },
        dp: { name: 'penetration depth', q: 'length', unit: 'nm', value: 113, tex: 'd_p' }
      },
      solveFor: 'I',
      note: 'The intensity of the evanescent field itself. The share of light that crosses a gap is a different number (see the table above), found with the thin-film formulae.',
      stories: { I: 'An evanescent field has a penetration depth of {dp}. How strong is its intensity at {z} from the surface, relative to the surface?' }
    },
    {
      name: 'Wavelength of the field along the surface',
      expr: 'lp = lambda/(n1*sin(t))', tex: '\\lambda_{\\parallel} = \\frac{\\lambda}{n_1\\sin\\theta}',
      vars: {
        lp: { name: 'wavelength along the surface', q: 'length', unit: 'nm', tex: '\\lambda_{\\parallel}' },
        lambda: { name: 'wavelength in vacuum', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        n1: { name: 'index of the denser medium', value: 1.517, min: 1, max: 5, tex: 'n_1' },
        t: { name: 'angle of incidence', q: 'angle', unit: '°', value: 45, min: 1, max: 89, tex: '\\theta' }
      },
      solveFor: 'lp',
      note: 'The same on both sides of the surface: the phase pattern along it is continuous.'
    }
  ],
  examples: [
    {
      title: 'How deep does a TIRF microscope see?',
      q: 'Blue laser light of 488 nm travels in the immersion oil and cover glass ($n = 1.518$) and strikes the boundary with a cell ($n = 1.33$) at 70°. What are the critical angle and the penetration depth?',
      steps: [
        { text: 'The critical angle:', tex: '\\theta_c = \\arcsin\\frac{1.33}{1.518} = 61.2°' },
        'The beam, at 70°, is beyond it.',
        { text: 'The penetration depth:', tex: 'd_p = \\frac{488}{4\\pi\\sqrt{1.518^2\\sin^2 70° - 1.33^2}} = \\frac{488}{4\\pi \\times 0.516} = 75\\ \\mathrm{nm}' }
      ],
      a: 'θ_c = 61.2° and d_p = 75 nm: only molecules within about 100–200 nm of the glass are lit, a tiny slice of the cell.'
    },
    {
      title: 'A gap in a beam splitter',
      q: 'Two blocks of N-BK7 are separated by an air gap and the light meets the gap at 45°. For the gap values of the table on this page, what gap would you choose to send about 30 % of the s-polarized green light through and reflect the rest?',
      steps: [
        'Read the table: 29 % at 200 nm and 66 % at 100 nm.',
        'The gap that transmits about 30 % is therefore near 200 nm, about 0.36 of the wavelength.'
      ],
      a: 'About 200 nm. The same gap does not give the same splitting for the p polarization or for another angle, which is why a frustrated-TIR splitter is polarization-sensitive.'
    }
  ],
  quiz: [
    { q: 'What happens to the intensity of the evanescent wave as the distance from the totally reflecting surface increases?', choices: ['It falls exponentially', 'It stays constant', 'It rises', 'It oscillates'], a: 0, why: 'The wave is evanescent: it decays as $e^{-z/d_p}$, with $d_p$ of the order of a wavelength.' },
    { q: 'At total internal reflection the evanescent wave carries power away from the surface, into the second medium.', a: false, why: 'On average no power crosses the surface: all of it is reflected. The field is stored near the surface; a second medium or absorber can draw power from it.' },
    { q: 'What happens to the penetration depth as the angle of incidence moves from the critical angle to grazing incidence?', choices: ['It grows without limit', 'It falls from infinity at the critical angle to a few tens of nanometres', 'It stays the same', 'It becomes negative'], a: 1, why: 'The depth $\\lambda/(4\\pi\\sqrt{n_1^2\\sin^2\\theta - n_2^2})$ diverges at the critical angle and falls steadily as $\\theta$ increases.' },
    { q: 'Light of 600 nm in glass of 1.5 is totally reflected at the glass–air surface at 60°. What is the penetration depth, in nm?', answer: 57.6, unit: 'nm', why: '$\\sqrt{1.5^2 \\sin^2 60° - 1} = \\sqrt{1.6875 - 1} = 0.829$; $d_p = 600/(4\\pi \\times 0.829) = 57.6$ nm.' },
    { q: 'In a fingerprint scanner using a prism, which parts of the finger appear dark?', choices: ['The ridges, where skin touches the glass and frustrates the reflection', 'The valleys, which are not in contact with the glass', 'None: the scanner uses the colour of the skin', 'The nail'], a: 0, why: 'The ridges are in contact, so the evanescent field is absorbed or scattered and the light does not return; the valleys leave an air gap and the light is totally reflected.' }
  ],
  applications: [
    'Optical fingerprint sensors, in which ridges frustrate total reflection in a prism.',
    'TIRF microscopes for single molecules and cell membranes, with an excitation depth of about 100 nm.',
    'ATR accessories for infrared spectrometers: samples of liquids, pastes and polymers are measured by pressing them on a crystal.',
    'Variable beam splitters and optical switches, and evanescent couplers between waveguides, tapered fibres and microresonators.',
    'Multi-touch tables and screens in which a fingertip frustrates light guided inside a plate.'
  ],
  history: 'Isaac Newton\'s experiments of 1704 with a lens pressed against the face of a prism are an early observation of the effect: total reflection fails where the glass touches. The exponential field beyond the surface follows from continuing Fresnel\'s equations beyond the critical angle. Goos and Hänchen found the lateral shift of the totally reflected beam in 1947.',
  sources: [
    'E. Hecht, *Optics*, ch. 4 — total internal reflection and the evanescent wave.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 1 — the field beyond the critical angle.',
    'D. Axelrod, "Total internal reflection fluorescence microscopy in cell biology", *Traffic* 2 (2001) 764 — penetration depth and practice of TIRF.'
  ],
  sim: 'rs-evanescent'
},

/* ================================================================ gradient index */
{
  id: 'gradient-index-optics', parent: 'refraction-and-snell', title: 'Gradient-index optics', level: 3,
  short: 'When the refractive index changes smoothly with position instead of in steps, light follows curves, bending towards the higher index. A parabolic profile makes a rod lens whose rays are sinusoids; the same idea shapes the lens of the eye, the graded-index fibre and the atmosphere.',
  keywords: ['GRIN', 'gradient index', 'graded index', 'GRIN rod lens', 'pitch', 'quarter pitch', 'parabolic profile', 'graded-index fibre', 'lens of the eye', 'Luneburg lens', 'Maxwell fisheye', 'ion exchange'],
  prereq: ['snells-law', 'refractive-index', 'refraction-at-a-flat-surface'],
  related: ['refraction-at-a-curved-surface', 'single-mode-and-multimode-fibre', 'fibre-dispersion-and-bandwidth', 'the-eye-as-a-camera', 'periscopes-and-endoscopes', 'atmospheric-refraction', 'mirages-and-looming'],
  body: `
Up to now light has bent at sharp boundaries between uniform materials. But the index can also change *smoothly* inside a material, and then the light travels along curves. This is **gradient-index** (GRIN) optics.

### Rays curve towards higher index
Slice a material into thin layers whose index rises downwards. A ray crossing each boundary bends towards the normal, and in the limit of very thin layers the kinks merge into a smooth curve. The rule that comes out of [[snells-law|Snell's law]] is simply that rays bend *towards the region of higher index*. For layers parallel to the axis, $n(y)\\cos\\alpha$ stays constant along the ray, where $\\alpha$ is the angle to the axis. A ray in such a medium turns back when $n(y)$ has fallen to $n\\cos\\alpha_0$, the turning point. The air above a hot road, and the atmosphere itself, are natural gradients ([[atmospheric-refraction]]).

### The rod lens
Make a glass rod of radius $R$ whose index falls parabolically from the axis to the edge:

$$n(r) = n_0 - (n_0 - n_R)\\left(\\frac{r}{R}\\right)^2 = n_0\\left(1 - \\tfrac12 g^2 r^2\\right)$$

Paraxial rays then follow sinusoids, $r(z) = r_0\\cos gz + (\\theta_0/g)\\sin gz$, with a period, the **pitch**,

$$p = \\frac{2\\pi}{g} = \\frac{2\\pi R}{\\sqrt{2(1 - n_R/n_0)}}$$

that does not depend on the ray's height or angle: every ray from a point comes together again after each period, with no lens surface at all. Example: $R = 0.5$ mm, $n_0 = 1.60$, $n_R = 1.55$ gives $g = 0.50\\ \\mathrm{mm^{-1}}$ and a pitch of 12.6 mm.

| Length of the rod | What it does |
|---|---|
| ¼ pitch (3.1 mm) | a point on one face leaves as a parallel beam; a parallel beam focuses on the far face |
| ½ pitch | an inverted image, unit magnification |
| 1 pitch | an upright image |

A rod of length $L$ has the focal length $f = 1/(n_0 g\\sin gL)$: 1.25 mm at the quarter pitch. Fibre collimators use 0.23–0.25 pitch.

### Gradients in nature and technology
- **The eye's lens.** The index runs from about 1.386 at the surface to 1.406 at the core in Gullstrand's model; a uniform model needs a higher "equivalent" index (1.42 in Le Grand's). The gradient adds power and reduces aberration.
- **Fish lenses.** A fish's lens is a sphere with an index of about 1.5 at the centre, falling towards the surface, with a focal length of only about 2.5 radii (Matthiessen's ratio) and little aberration: no uniform sphere can match this.
- **Graded-index fibre.** In a multimode fibre of 50 µm core the index falls from the axis almost parabolically. Rays at a steep angle travel a longer path but in lower-index, faster glass, so all arrive together: pulse spreading of about 50 ns/km in a step-index fibre of 1 % index step falls to under 1 ns/km ([[single-mode-and-multimode-fibre]]).
- **Rod lenses.** GRIN rods 0.25–3 mm across are fibre collimators and endoscope relay lenses; arrays of them image a strip of the page in copiers.

### How they are made
By exchanging ions in a glass, by chemical vapour deposition in fibre preforms, and by diffusion and polymerization in plastics. Typical index differences are 0.01 to 0.1. The Luneburg lens ($n = \\sqrt{2 - r^2}$ in units of the radius) focuses a plane wave to a point on its surface and serves in microwave antennas.

> [!key] A smooth index gradient bends light towards higher index. A parabolic gradient gives rays that are sinusoids of one pitch, $p = 2\\pi/g$, so that a rod of a quarter pitch collimates and one of half pitch inverts the image.
`,
  ideas: [
    'A smooth change of index bends light continuously towards the higher index: a stack of thin layers is the staircase approximation.',
    'In layers parallel to the axis n(y) cos α is constant along the ray.',
    'A parabolic profile gives sinusoidal rays with a pitch p = 2π/g independent of the ray, so a rod can image without curved surfaces.',
    'A quarter-pitch rod collimates a point source; a half-pitch rod inverts the image; a full pitch gives it upright again.',
    'The eye\'s lens, fish lenses, graded-index fibres and rod-lens arrays all rely on gradients.'
  ],
  pitfalls: [
    'Light always travels in straight lines in a uniform medium, so a gradient cannot bend it — The straight line is the rule only when n is constant. Where n changes with position the path curves, as in mirages and the atmosphere.',
    'A GRIN lens has one focal length, like any lens — Its focal length depends on its length: f = 1/(n₀ g sin gL), and it changes sign as the rod passes a half pitch.',
    'The index gradient sends light towards the lower index — Light is bent towards the higher index, the region where it travels more slowly.'
  ],
  terms: [
    { term: 'Gradient-index optics', also: ['GRIN', 'graded index'], def: 'Optics of materials whose refractive index varies smoothly with position, so that rays follow curved paths, bending towards the higher index.' },
    { term: 'GRIN rod lens', also: ['gradient-index rod', 'rod lens'], def: 'A cylindrical glass rod with a parabolic index profile, highest on the axis. Its rays are sinusoids, so a length of a fraction of a pitch acts as a lens with flat faces.' },
    { term: 'Pitch', also: ['pitch length', 'p'], def: 'The axial length over which a ray in a parabolic gradient rod completes one full sinusoid, 2π/g. Rod lenses are specified by their length in fractions of a pitch.' },
    { term: 'Graded-index fibre', also: ['GI fibre'], def: 'A multimode optical fibre whose core index falls nearly parabolically from the axis, which equalizes the travel times of the modes and so greatly reduces pulse spreading.' },
    { term: 'Gradient constant', also: ['g', '√A'], def: 'The parameter g of a parabolic profile n(r) = n₀(1 − g²r²/2), in mm⁻¹; the pitch of the rod is 2π/g.' }
  ],
  formulas: [
    {
      name: 'Parabolic index profile',
      expr: 'n = n0 - (n0 - nR)*(r/R)^2', tex: 'n_r = n_0 - (n_0 - n_R)\\left(\\frac{r}{R}\\right)^2',
      vars: {
        n: { name: 'index at the radius r', tex: 'n_r' },
        n0: { name: 'index on the axis', value: 1.6, min: 1, max: 3, tex: 'n_0' },
        nR: { name: 'index at the edge', value: 1.55, min: 1, max: 3, tex: 'n_R' },
        r: { name: 'distance from the axis', q: 'length', unit: 'mm', value: 0.25 },
        R: { name: 'radius of the rod', q: 'length', unit: 'mm', value: 0.5 }
      },
      solveFor: 'n',
      note: 'Valid for 0 ≤ r ≤ R.',
      stories: { n: 'A GRIN rod of radius {R} has index {n0} on its axis and {nR} at its edge. What is the index at {r} from the axis?' }
    },
    {
      name: 'Pitch of a GRIN rod',
      expr: 'p = 2*pi*R/sqrt(2*(1 - nR/n0))', tex: 'p = \\frac{2\\pi R}{\\sqrt{2\\,(1 - n_R/n_0)}}',
      vars: {
        p: { name: 'pitch (length of one full sinusoid)', q: 'length', unit: 'mm' },
        R: { name: 'radius of the rod', q: 'length', unit: 'mm', value: 0.5 },
        n0: { name: 'index on the axis', value: 1.6, min: 1, max: 3, tex: 'n_0' },
        nR: { name: 'index at the edge', value: 1.55, min: 1, max: 3, tex: 'n_R' }
      },
      solveFor: 'p',
      note: 'Paraxial rays. A quarter-pitch rod is p/4 long.',
      stories: { p: 'A GRIN rod has a radius of {R} and indices {n0} on the axis and {nR} at the edge. What is its pitch?' }
    },
    {
      name: 'Focal length of a GRIN rod',
      expr: 'f = 1/(n0*g*sin(g*L))', tex: 'f = \\frac{1}{n_0\\,g\\,\\sin(gL)}',
      vars: {
        f: { name: 'effective focal length', q: 'length', unit: 'mm' },
        n0: { name: 'index on the axis', value: 1.6, min: 1, max: 3, tex: 'n_0' },
        g: { name: 'gradient constant', q: 'wavenumber', unit: '1/mm', value: 0.5, min: 0.05, max: 2 },
        L: { name: 'length of the rod', q: 'length', unit: 'mm', value: 3.14, min: 0.2, max: 6 }
      },
      solveFor: 'f',
      note: 'Measured from the principal plane. At a quarter pitch (gL = π/2) it is 1/(n₀g).'
    }
  ],
  examples: [
    {
      title: 'A GRIN lens for a fibre collimator',
      q: 'A GRIN rod has a radius of 0.9 mm, $n_0 = 1.60$ and an edge index of 1.54. What are its pitch, the length of a quarter-pitch rod, and its focal length at that length?',
      steps: [
        { text: 'The gradient constant:', tex: 'g = \\frac{\\sqrt{2(1 - 1.54/1.60)}}{0.9\\ \\mathrm{mm}} = \\frac{\\sqrt{0.075}}{0.9} = 0.304\\ \\mathrm{mm^{-1}}' },
        { text: 'The pitch:', tex: 'p = \\frac{2\\pi}{g} = 20.7\\ \\mathrm{mm}' },
        { text: 'A quarter pitch is 5.2 mm long, and there $\\sin gL = 1$:', tex: 'f = \\frac{1}{n_0 g} = \\frac{1}{1.60 \\times 0.304} = 2.05\\ \\mathrm{mm}' }
      ],
      a: 'Pitch 20.7 mm, quarter pitch 5.2 mm, focal length 2.05 mm. A fibre of numerical aperture 0.12 on the face gives a collimated beam about 2 × 2.05 mm × 0.12 = 0.5 mm across.'
    },
    {
      title: 'A ray in thin layers',
      q: 'A ray enters from a layer of index 1.000 into a stack of layers with indices 1.010, 1.020, 1.030 … at an angle of 80° from the normal to the layers. At what angle from the normal does it travel in the layer of index 1.050?',
      steps: [
        'At every boundary $n\\sin\\theta$ is the same, so $n\\sin\\theta = 1.000 \\times \\sin 80° = 0.9848$ throughout.',
        { text: 'In the layer of index 1.050:', tex: '\\sin\\theta = \\frac{0.9848}{1.050} = 0.9379 \\quad\\Rightarrow\\quad \\theta = 69.7°' }
      ],
      a: '69.7°: the ray turns steadily towards the normal as the index rises — the staircase of a smooth curve.'
    }
  ],
  quiz: [
    { q: 'In a medium whose index falls from the axis to the edge, a ray parallel to the axis…', choices: ['bends towards the axis', 'bends towards the edge', 'stays straight', 'is reflected by the axis'], a: 0, why: 'Rays bend towards the region of higher index, here the axis; that is what makes a GRIN rod focus.' },
    { q: 'A GRIN rod of exactly one full pitch forms an inverted image of an object on its entrance face.', a: false, why: 'Half a pitch forms an inverted image; after a full pitch the image is upright again.' },
    { q: 'A GRIN rod has a pitch of 12.6 mm. How long (in mm) is a rod of a quarter pitch?', answer: 3.15, unit: 'mm', why: '$12.6/4 = 3.15$ mm: a point source on one face leaves the other as a parallel beam.' },
    { q: 'Why does a graded-index fibre carry short pulses farther than a step-index multimode fibre?', choices: ['Rays that take longer paths travel in lower index, so faster, glass and arrive together with the others', 'It absorbs the slow modes', 'It has a smaller core', 'The light is polarized'], a: 0, why: 'Equalizing the travel times of the modes reduces the pulse spreading from tens of ns/km to under 1 ns/km.' },
    { q: 'Why can the lens of the eye focus better than a homogeneous lens of the same shape and the same surface index?', choices: ['Its index gradient adds power and reduces spherical aberration', 'It is thinner', 'It is made of glass', 'It rotates'], a: 0, why: 'The higher index in the core refracts rays more strongly than the surface does, and the gradient can be tuned to correct the aberration of the outer rays.' }
  ],
  applications: [
    'GRIN rod lenses as fibre collimators, laser-diode couplers and micro-objectives in endoscopes.',
    'Graded-index multimode fibres of 50 µm core in data centres.',
    'Rod-lens arrays that image a line of a page in copiers and LED printers.',
    'The lens of the eye, and of fish, in which the gradient replaces the surface curvature of a more aberrated lens.',
    'Microwave Luneburg lenses and wave-guiding structures, and designs of gradient-index spectacle and camera lenses.'
  ],
  history: 'James Clerk Maxwell worked out in 1854 the "fisheye" gradient, in which the rays are circles and every point is imaged perfectly. Rudolf Luneburg\'s lens of 1944 focuses a plane wave to a point. Practical glass gradient-index rods came from ion exchange in the 1960s, and the graded-index fibre, proposed in the late 1960s, became the standard multimode fibre in the 1970s.',
  sources: [
    'E. W. Marchand, *Gradient Index Optics* (Academic Press, 1978) — ray paths, the parabolic rod and its pitch.',
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, ch. 1 — ray optics in graded-index media.',
    'D. T. Moore, "Gradient-index optics: a review", *Applied Optics* 19 (1980) 1035 — materials, manufacture and designs.'
  ],
  sim: 'rs-grin'
},

/* ================================================================ curved surface */
{
  id: 'refraction-at-a-curved-surface', parent: 'refraction-and-snell', title: 'Refraction at a curved surface', level: 2,
  short: 'One spherical surface between two media obeys n₁/sₒ + n₂/sᵢ = (n₂ − n₁)/R for rays near the axis. Its power is (n₂ − n₁)/R dioptres. Two such surfaces make a lens, and a single one makes the cornea, which supplies about two thirds of the focusing power of the eye.',
  keywords: ['refraction at a spherical surface', 'single refracting surface', 'surface power', 'dioptre', 'cornea', 'reduced eye', 'ball lens', 'paraxial', 'object distance', 'image distance', 'radius of curvature', 'sign convention'],
  prereq: ['snells-law', 'refraction-at-a-flat-surface', 'the-paraxial-approximation'],
  related: ['the-thin-lens-equation', 'lensmakers-formula', 'focal-length-and-optical-power', 'the-eye-as-a-camera', 'keratometry-and-corneal-topography', 'spherical-aberration', 'aspheric-surfaces', 'ray-transfer-matrices'],
  body: `
Almost every lens is made of spherical surfaces, and everything a lens does follows from what *one* such surface does to a ray. A curved surface is a flat one whose tilt depends on where the ray hits: the ray meets the surface at its own angle to the local normal and is refracted by [[snells-law|Snell's law]] there. On a convex glass surface a ray that hits off-axis is bent towards the axis, which is why curved surfaces can focus.

### One equation for rays near the axis
For rays close to the axis (the [[the-paraxial-approximation|paraxial]] region) a single spherical surface of radius $R$ between indices $n_1$ (in front) and $n_2$ (behind) forms an image according to

$$\\frac{n_1}{s_o} + \\frac{n_2}{s_i} = \\frac{n_2 - n_1}{R}$$

The signs follow the "real is positive" convention of the lens pages: $s_o$ is positive for an object in front of the surface, $s_i$ is positive for an image behind it (on the side where the light goes), and $R$ is positive when the centre of curvature lies behind the surface (a surface convex towards the incoming light). The right-hand side is the **power** of the surface,

$$P = \\frac{n_2 - n_1}{R}$$

in dioptres when $R$ is in metres. The two focal lengths are $f_1 = n_1 R/(n_2 - n_1)$ in front and $f_2 = n_2 R/(n_2 - n_1)$ behind, and the lateral magnification is $m = -\\dfrac{n_1 s_i}{n_2 s_o}$.

Check: a flat surface is $R \\to \\infty$, so $s_i = -(n_2/n_1)s_o$: a virtual image at the apparent depth of [[refraction-at-a-flat-surface]]. And two surfaces make a lens: the image of the first is the object of the second, so the powers add (for a thin lens) and the formula becomes the [[lensmakers-formula]].

### The cornea
The front of the eye is a spherical surface of radius 7.7 mm between air and the cornea ($n = 1.376$): $P = 0.376/0.0077 = 48.8$ D. The back of the cornea, with aqueous humour ($n = 1.336$) behind it, has a radius of 6.8 mm and a power $(1.336 - 1.376)/0.0068 = -5.9$ D, so the whole cornea is about 43 D, two thirds of the eye's roughly 59 D ([[the-eye-as-a-camera]]). Under water the front surface has $(1.376 - 1.333)/0.0077 = 5.6$ D only: the eye loses its main lens and vision is blurred unless a mask keeps air in front of it. Keratometers measure the radius of the front surface and convert it to power with the single, equivalent index 1.3375: a radius of 7.8 mm gives 43.3 D ([[keratometry-and-corneal-topography]]).

Even the whole eye can be treated as a single surface, **Emsley's reduced eye**: $n = 4/3$, $R = 5.55$ mm, $P = 60$ D, so that parallel light is focused at $n/P = 22.2$ mm behind the surface, on the retina.

### A ball and a limit
A solid sphere of index $n$ is two such surfaces; its focal length measured from the centre is $f = nR/(2(n-1))$: 1.5 R for $n = 1.5$, and exactly R for $n = 2$, so a ball of index 2 focuses onto its own back surface, the principle of the cat's-eye retroreflector.

The paraxial formula fails for rays far from the axis: Snell's law applied exactly makes the outer rays of a convex surface cross the axis *nearer* than the inner ones. This is the surface's own **spherical aberration** ([[spherical-aberration]]); for one special pair of points, the aplanatic points, it vanishes, and it can be removed everywhere by an aspheric surface ([[aspheric-surfaces]]).

> [!key] A spherical surface forms images by $n_1/s_o + n_2/s_i = (n_2 - n_1)/R$, with power $P = (n_2 - n_1)/R$. Lenses are pairs of such surfaces; the cornea is one, with 48.8 D at its front.
`,
  derivation: {
    title: 'The surface equation from Snell\'s law',
    intro: 'Take a ray from an object point on the axis, a distance $s_o$ in front of a convex surface of radius $R$, that strikes the surface at a small height $h$ and goes on to cross the axis at a distance $s_i$ behind it.',
    steps: [
      { text: 'Let the incident ray make a small angle $\\alpha$ with the axis, the refracted ray an angle $\\beta$, and let the radius to the point of incidence make the angle $\\varphi$ with the axis at the centre of curvature. For small angles:', tex: '\\alpha \\approx \\frac{h}{s_o},\\qquad \\beta \\approx \\frac{h}{s_i},\\qquad \\varphi \\approx \\frac{h}{R}' },
      { text: 'The angle of incidence is $\\theta_1 = \\alpha + \\varphi$ and the angle of refraction is $\\theta_2 = \\varphi - \\beta$ (both from the normal, which is the radius).', tex: '\\theta_1 = \\alpha + \\varphi,\\qquad \\theta_2 = \\varphi - \\beta' },
      { text: 'Snell\'s law for small angles, $n_1\\theta_1 = n_2\\theta_2$:', tex: 'n_1\\left(\\frac{h}{s_o} + \\frac{h}{R}\\right) = n_2\\left(\\frac{h}{R} - \\frac{h}{s_i}\\right)' },
      { text: 'Divide by $h$ and collect the terms:', tex: '\\frac{n_1}{s_o} + \\frac{n_2}{s_i} = \\frac{n_2 - n_1}{R}' }
    ]
  },
  ideas: [
    'For rays near the axis, one spherical surface obeys n₁/sₒ + n₂/sᵢ = (n₂ − n₁)/R.',
    'Its power is P = (n₂ − n₁)/R in dioptres (R in metres); the focal lengths are n₁R/(n₂ − n₁) and n₂R/(n₂ − n₁).',
    'A flat surface (R → ∞) is the special case sᵢ = −(n₂/n₁) sₒ, the apparent-depth rule; two surfaces make a lens.',
    'The front of the cornea, 7.7 mm in radius at n = 1.376, has 48.8 D; the whole cornea is about 43 D, two thirds of the eye\'s power.',
    'For rays far from the axis the exact Snell law gives spherical aberration: outer rays of a convex surface focus nearer.'
  ],
  pitfalls: [
    'The radius R is always positive — It is signed: positive when the centre of curvature is on the side the light goes to (convex towards the light), negative otherwise. A concave surface from air into glass diverges light.',
    'The cornea gives 43 D because its index is 1.376 — Its front surface alone gives 48.8 D with n = 1.376; the back surface subtracts 5.9 D. A keratometer uses an artificial index of 1.3375 to turn a measured radius into the net power.',
    'The surface equation is exact — It holds only for rays near the axis. Marginal rays cross the axis at different distances, which is spherical aberration.'
  ],
  terms: [
    { term: 'Surface power', also: ['refractive power of a surface', 'P'], def: 'P = (n₂ − n₁)/R, the focusing strength of one refracting surface, in dioptres (1/m). Positive for a convex surface from low to high index.' },
    { term: 'Radius of curvature', also: ['R'], def: 'The radius of the sphere of which the surface is a part. In this convention it is positive when the centre of curvature lies on the far side of the surface from the incoming light.' },
    { term: 'Object distance and image distance', also: ['sₒ', 'sᵢ'], def: 'Distances from the surface vertex to the object (positive in front) and to the image (positive behind, real; negative, virtual).' },
    { term: 'Reduced eye', also: ['Emsley\'s reduced eye'], def: 'A one-surface model of the eye: index 4/3, radius 5.55 mm, power 60 D, axial length 22.2 mm. It is used for quick calculations of image size and focus.' },
    { term: 'Ball lens', def: 'A solid sphere used as a lens. Its focal length from the centre is nR/(2(n − 1)); with n = 2 the focus lies on the rear surface.' }
  ],
  formulas: [
    {
      name: 'Single spherical surface',
      expr: 'n1/so + n2/si = (n2 - n1)/R', tex: '\\frac{n_1}{s_o} + \\frac{n_2}{s_i} = \\frac{n_2 - n_1}{R}',
      vars: {
        n1: { name: 'index in front of the surface', value: 1, min: 1, max: 3, tex: 'n_1' },
        n2: { name: 'index behind the surface', value: 1.5, min: 1, max: 3, tex: 'n_2' },
        so: { name: 'object distance', q: 'length', unit: 'mm', value: 200, signed: true, tex: 's_o' },
        si: { name: 'image distance (behind, positive)', q: 'length', unit: 'mm', signed: true, tex: 's_i' },
        R: { name: 'radius of curvature (centre behind, positive)', q: 'length', unit: 'mm', value: 50, signed: true }
      },
      solveFor: 'si',
      note: 'Paraxial rays. A negative image distance is a virtual image on the object side.',
      stories: {
        si: 'An object lies {so} in front of a spherical surface of radius {R} between media of index {n1} and {n2}. Where is the image?',
        R: 'A surface between indices {n1} and {n2} forms an image {si} behind it of an object {so} in front. What is its radius of curvature?'
      }
    },
    {
      name: 'Power of a surface',
      expr: 'P = (n2 - n1)/R', tex: 'P = \\frac{n_2 - n_1}{R}',
      vars: {
        P: { name: 'power of the surface', q: 'optpower', unit: 'D', signed: true },
        n1: { name: 'index in front', value: 1, min: 1, max: 3, tex: 'n_1' },
        n2: { name: 'index behind', value: 1.376, min: 1, max: 3, tex: 'n_2' },
        R: { name: 'radius of curvature', q: 'length', unit: 'mm', value: 7.7, signed: true }
      },
      solveFor: 'P',
      note: 'Defaults: the front surface of the cornea, 48.8 D.',
      stories: { P: 'A surface of radius {R} separates a medium of index {n1} from one of index {n2}. What is its power?' }
    },
    {
      name: 'Lateral magnification',
      expr: 'm = -n1*si/(n2*so)', tex: 'm = -\\frac{n_1\\,s_i}{n_2\\,s_o}',
      vars: {
        m: { name: 'magnification (negative: inverted)', signed: true },
        n1: { name: 'index in front', value: 1, min: 1, max: 3, tex: 'n_1' },
        n2: { name: 'index behind', value: 1.5, min: 1, max: 3, tex: 'n_2' },
        si: { name: 'image distance', q: 'length', unit: 'mm', value: 300, signed: true, tex: 's_i' },
        so: { name: 'object distance', q: 'length', unit: 'mm', value: 200, signed: true, tex: 's_o' }
      },
      solveFor: 'm',
      note: 'For a flat surface m = +1: apparent depth does not change the size.'
    },
    {
      name: 'Ball lens',
      expr: 'f = n*R/(2*(n - 1))', tex: 'f = \\frac{n\\,R}{2\\,(n - 1)}',
      vars: {
        f: { name: 'focal length measured from the centre', q: 'length', unit: 'mm' },
        n: { name: 'index of the sphere', value: 1.5, min: 1.05, max: 4 },
        R: { name: 'radius of the sphere', q: 'length', unit: 'mm', value: 5 }
      },
      solveFor: 'f',
      note: 'In air, for rays near the axis. For n = 2 the focus lies on the rear surface of the ball.'
    }
  ],
  examples: [
    {
      title: 'A glass surface at 200 mm',
      q: 'A point source is 200 mm in front of a convex glass surface ($n = 1.5$) of radius 50 mm; the medium in front is air. Where is the image, and how large is it compared with the object?',
      steps: [
        { text: 'The surface equation:', tex: '\\frac{1}{200} + \\frac{1.5}{s_i} = \\frac{1.5 - 1}{50} = 0.010' },
        { text: 'So', tex: '\\frac{1.5}{s_i} = 0.010 - 0.005 = 0.005 \\quad\\Rightarrow\\quad s_i = 300\\ \\mathrm{mm}' },
        { text: 'The magnification:', tex: 'm = -\\frac{1 \\times 300}{1.5 \\times 200} = -1.0' }
      ],
      a: 'A real image 300 mm behind the surface, inverted and the same size as the object.'
    },
    {
      title: 'The reduced eye',
      q: 'Emsley\'s reduced eye is a single surface of radius 5.55 mm between air and a medium of index 4/3. What is its power, and where does it focus light from a distant object?',
      steps: [
        { text: 'The power:', tex: 'P = \\frac{4/3 - 1}{0.00555} = 60\\ \\mathrm{D}' },
        { text: 'A distant object has $s_o \\to \\infty$, so $s_i = f_2 = n_2/P$:', tex: 's_i = \\frac{4/3}{60\\ \\mathrm{D}} = 22.2\\ \\mathrm{mm}' }
      ],
      a: '60 D, focusing on the retina 22.2 mm behind the surface: a real eye of about the same size and power.'
    }
  ],
  quiz: [
    { q: 'A convex glass surface (n = 1.5) of radius 50 mm faces an object at infinity in air. Where is the focus behind the surface?', choices: ['100 mm', '150 mm', '50 mm', '200 mm'], a: 1, why: '$f_2 = n_2R/(n_2 - n_1) = 1.5 \\times 50/0.5 = 150$ mm. The front focal length is 100 mm.' },
    { q: 'A flat air–water surface has the power of a dioptre or two.', a: false, why: 'A flat surface has $R \\to \\infty$, so $P = (n_2 - n_1)/R = 0$. It moves images but does not focus.' },
    { q: 'What is the power, in dioptres, of a surface of radius 10 mm between air and a medium of index 1.40?', answer: 40, unit: 'D', why: '$P = 0.40/0.010\\ \\mathrm{m} = 40$ D.' },
    { q: 'An eye under water loses most of its focusing power because…', choices: ['the index step at the front of the cornea falls from 0.376 to about 0.04', 'the cornea turns opaque', 'the pupil closes', 'the lens becomes thicker'], a: 0, why: 'The power of the front surface falls from 48.8 D to $(1.376 - 1.333)/0.0077 = 5.6$ D, since the water is almost matched to the cornea.' },
    { q: 'For rays that strike a convex surface far from the axis, compared with the paraxial image, the exact Snell law gives…', choices: ['a focus nearer the surface (spherical aberration)', 'a focus farther away', 'exactly the same focus', 'no focus at all'], a: 0, why: 'Outer rays are refracted too strongly by a convex surface and cross the axis nearer than the paraxial rays do.' }
  ],
  applications: [
    'Lens design: every lens surface is one of these, and a designer\'s program applies the exact Snell law at each.',
    'The eye, the cornea and contact lenses, whose tear layer and shape change the power at the front surface.',
    'Keratometers and corneal topographers, which turn the measured radius of the cornea into dioptres.',
    'Droplets, ball lenses and the domes of LEDs and fibre ends, which form images by a single curved surface.',
    'Liquid lenses, whose curved liquid–liquid interface is a single surface of adjustable radius.'
  ],
  history: 'Johannes Kepler analysed refraction at spherical surfaces in his *Dioptrice* (1611), but only with approximate rules. René Descartes showed in 1637 that perfect refracting surfaces, the Cartesian ovals, are not spheres. Carl Friedrich Gauss gave the complete paraxial theory of refraction at spherical surfaces in his *Dioptrische Untersuchungen* of 1841.',
  sources: [
    'E. Hecht, *Optics*, ch. 5 — refraction at spherical surfaces, power and the sign conventions.',
    'F. A. Jenkins and H. E. White, *Fundamentals of Optics*, ch. 3 — spherical surfaces and lenses.',
    'D. A. Atchison and G. Smith, *Optics of the Human Eye* — the surfaces of the eye and the reduced eye.'
  ],
  sim: 'rs-curved'
}

);
