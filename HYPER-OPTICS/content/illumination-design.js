/* HYPER-OPTICS · content/illumination-design.js — Illumination optics: collecting, shaping, homogenizing and delivering light.
 *   collecting-and-shaping-light · reflectors · condensers-and-kohler-illumination · light-pipes-and-homogenizers ·
 *   fibre-optic-light-guides · ferrules-and-light-guide-couplings · fresnel-lenses · projector-illumination ·
 *   flashlights-and-headlamps · room-lighting-and-luminaires · glare-and-uniformity · daylight-and-skylight
 * Simulations are in sims/illumination-design.js (il-*).
 */
Hyper.add(

/* ================================================================ the four jobs and the budget */
{
  id: 'collecting-and-shaping-light', parent: 'illumination-design', title: 'Collecting and shaping light', level: 1,
  short: 'A lamp radiates everywhere; a task needs the light in one place, at one angle, evenly spread. Illumination optics collects it, shapes it, evens it out and delivers it — and étendue is the budget that limits all four jobs: a lens can trade area for angle, never reduce their product.',
  keywords: ['illumination optics', 'collection efficiency', 'collector', 'condenser', 'etendue budget', 'spill', 'sine condition', 'Lambertian emitter', 'concentration', 'throughput', 'beam shaping', 'light delivery', 'coupling efficiency'],
  prereq: ['etendue', 'lambertian-surfaces', 'radiance-and-its-conservation'],
  related: ['reflectors', 'condensers-and-kohler-illumination', 'light-pipes-and-homogenizers', 'fibre-optic-light-guides', 'projector-illumination', 'the-optical-invariant', 'concentrating-light', 'coupling-light-into-fibre', 'beam-shaping-overview'],
  body: `
A lamp sends light in every direction; a task needs light in one place, at one angle, spread evenly. **Illumination optics** is the craft of getting from the first to the second, and a designer keeps four verbs in mind.

### Four jobs
1. **Collect** — catch as much of the source's emission as possible. A bare filament throws half its light away from where it is wanted; a mirror or a lens turns that half round.
2. **Shape** — decide the outline and the angles of the beam: a pencil for a torch, a wide fan for a corridor, a rectangle that fits a film frame.
3. **Homogenize** — even it out. The image of a filament, an arc or an LED die is full of structure; a light pipe, a fly's-eye array or a Köhler condenser removes it.
4. **Deliver** — put it into the target: a fibre bundle, a microscope field, a light valve, a road, a desk.

### The budget: étendue
A source has an **[[etendue|étendue]]**, its area times the solid angle it radiates into, $G = n^2 A\\,\\Omega$, and a lens or mirror can swap area for angle but never lower the product. A target has an étendue of its own: a window of area $A_t$ that takes only rays inside a cone of half-angle $\\theta_t$ can accept at most $G_t = \\pi A_t \\sin^2\\theta_t$ (in air). Light from a source with $G_s > G_t$ cannot all get in, whatever the optics. So collecting is a matter of *angle*, shaping a matter of trading *area for angle*, and the étendue budget is the first check on every design.

| Receiver | Area | Accepts | Étendue $G$ (mm²·sr) |
|---|---|---|---|
| Single-mode fibre core, 9 µm, NA 0.13 | $6.4\\times10^{-5}$ mm² | ±7.5° | $3.4\\times10^{-6}$ |
| Large-core fibre, 1 mm, NA 0.22 | 0.79 mm² | ±12.7° | 0.12 |
| Glass light guide, 5 mm, NA 0.55 | 19.6 mm² | ±33° | 18.7 |
| Projector panel 15 × 9 mm behind an f/2.4 lens | 135 mm² | ±12° | 18.4 |

An LED die of 1 mm × 1 mm radiating like a [[lambertian-surfaces|Lambertian]] emitter into a hemisphere has $G = \\pi \\times 1 = 3.1$ mm²·sr. It can fill the light guide or the projector panel with room to spare, but at most $0.12/3.1 = 3.8\\ \\%$ of its light can enter the 1 mm fibre.

### Collecting: how wide a cone
For a Lambertian emitter the share of the flux inside a cone of half-angle $\\theta$ is $\\sin^2\\theta$: 25 % within 30°, 50 % within 45°, 75 % within 60°, 90 % within 72°. To catch nine tenths of an LED's light the collector must accept rays out to 72°, which for a lens means a speed of about f/0.5 — hence the deep reflectors and the TIR collimators of [[flashlights-and-headlamps|torches]].

### Shaping: size against angle
Between a source of size $s$ collected within a half-angle $\\theta_1$ and its image of size $s'$ formed in a cone of half-angle $\\theta_2$, the sine condition gives $s\\sin\\theta_1 = s'\\sin\\theta_2$. Shrink the image and the cone must widen. To squeeze a 3 mm source into a 1.5 mm spot the converging cone needs $\\sin\\theta_2 = 2\\sin\\theta_1$, which is impossible once $\\theta_1$ exceeds 30°: the rest of the light is **spill**.

### What a lens cannot do
No passive optics can make an image *brighter* — more power per unit area and solid angle — than its source ([[radiance-and-its-conservation]]). Even for the Sun's 0.53° disc the best concentration in air is about 46 000 × ([[concentrating-light]]).

> [!key] Illumination optics collects, shapes, homogenizes and delivers; étendue is the budget for all four. A target accepts at most its area times its acceptance cone, and a lens only trades area for angle.
`,
  ideas: [
    'Illumination optics has four jobs: collect, shape, homogenize and deliver the light.',
    'Étendue (area × solid angle) cannot be reduced by any lens or mirror: it is the budget of the design.',
    'A target accepts at most G = π A sin²θ in air; light beyond that is spill, however good the optics.',
    'A Lambertian source puts sin²θ of its flux inside a cone of half-angle θ: 90 % needs 72°.',
    'Making the image smaller makes the cone wider (s sin θ is constant): small spots need steep cones.'
  ],
  pitfalls: [
    'A big enough lens can collect all the light of a source and put it anywhere — Étendue is conserved: a lens cannot squeeze the light of a large, wide-angle source into a small, narrow-acceptance target, so the surplus is lost.',
    'A concentrator makes light brighter — It makes it more intense per unit area by spreading the angles wider. Radiance, the power per area and solid angle, never increases.',
    'More lumens from the lamp always means more lumens at the target — If the target\'s étendue is already full, a brighter lamp of the same size adds only heat; the gain comes from a smaller or more radiant source.',
    'A reflector and a lens do different things to the budget — Both obey the same invariant: whichever is used, it can only exchange beam size against beam angle.'
  ],
  terms: [
    { term: 'Illumination optics', also: ['illuminator', 'lighting optics'], def: 'The optics that carries light from a source to where it is needed and gives it the right size, angles and evenness, as distinct from imaging optics, which forms a picture.' },
    { term: 'Collector', also: ['collection optics', 'collector lens', 'condenser'], def: 'The first element after the source, a mirror or a lens, whose job is to catch a large cone of the source\'s emission. Its collection angle sets the collection efficiency.' },
    { term: 'Collection efficiency', also: ['capture fraction'], def: 'The share of the source\'s light that enters the optical system. For a Lambertian emitter and a collector accepting a cone of half-angle θ it is sin²θ.' },
    { term: 'Étendue budget', also: ['étendue match', 'throughput limit'], def: 'The check that the étendue of the target (area × acceptance angle) is at least that of the source light to be delivered. When it is not, the excess is lost at any efficiency of the optics.' },
    { term: 'Spill', also: ['spill light', 'overspill'], def: 'Light that misses the target or falls outside its acceptance cone: wasted at best, heating or dazzling at worst.' }
  ],
  formulas: [
    {
      name: 'Étendue of a flat window',
      expr: 'G = pi*A*sin(theta)^2', tex: 'G = \\pi A \\sin^2\\theta',
      vars: {
        G: { name: 'étendue', q: false, unit: 'mm²·sr' },
        A: { name: 'area of the window', q: false, unit: 'mm²', value: 19.6 },
        theta: { name: 'acceptance half-angle', q: 'angle', unit: '°', value: 33, min: 0.1, max: 90, tex: '\\theta' }
      },
      note: 'In air, for a window accepting the same cone at every point. A source radiating a hemisphere has θ = 90° and G = π A.',
      stories: { G: 'A light guide of {A} accepts rays within {theta} of its axis. What is its étendue?', A: 'A receiver accepting rays within {theta} must take an étendue of {G}. What area must it have?' }
    },
    {
      name: 'Share of a Lambertian source inside a cone',
      expr: 'eta = sin(theta)^2', tex: '\\eta = \\sin^2\\theta',
      vars: {
        eta: { name: 'fraction of the flux collected', q: 'ratio', unit: '%', tex: '\\eta' },
        theta: { name: 'half-angle of the cone collected', q: 'angle', unit: '°', value: 45, min: 0.1, max: 90, tex: '\\theta' }
      },
      note: 'For an emitter whose luminance does not depend on direction (an LED die, a matt surface).',
      stories: { eta: 'A lens collects the light of an LED within {theta} of its axis. What share of the LED\'s flux is that?', theta: 'A collector must catch {eta} of the light of a Lambertian LED. Within what half-angle must it work?' }
    },
    {
      name: 'Largest share a window can take from a Lambertian source',
      expr: 'eta = At*sin(theta)^2/As', tex: '\\eta = \\frac{A_t \\sin^2\\theta}{A_s}',
      vars: {
        eta: { name: 'largest fraction that can enter', q: 'ratio', unit: '%', tex: '\\eta' },
        At: { name: 'area of the receiving window', q: false, unit: 'mm²', value: 0.785, tex: 'A_t' },
        theta: { name: 'acceptance half-angle of the window', q: 'angle', unit: '°', value: 12.7, min: 0.1, max: 90, tex: '\\theta' },
        As: { name: 'area of the source', q: false, unit: 'mm²', value: 1, tex: 'A_s' }
      },
      note: 'The ratio of the two étendues, valid while the answer is below 100 %. It is a ceiling set by physics, not an efficiency of any lens.',
      stories: { eta: 'A Lambertian source of {As} must feed a window of {At} accepting {theta}. At best, what share of its light can enter?' }
    },
    {
      name: 'The sine condition',
      expr: 'm = sin(t1)/sin(t2)', tex: 'm = \\frac{\\sin\\theta_1}{\\sin\\theta_2}',
      vars: {
        m: { name: 'image size ÷ source size' },
        t1: { name: 'half-angle of the cone collected from the source', q: 'angle', unit: '°', value: 30, min: 0.1, max: 90, tex: '\\theta_1' },
        t2: { name: 'half-angle of the cone arriving at the image', q: 'angle', unit: '°', value: 60, min: 0.1, max: 90, tex: '\\theta_2' }
      },
      note: 'Source and image in air. A magnification below 1 needs a wider cone at the image than at the source; sin θ₂ cannot exceed 1.',
      stories: { t2: 'A condenser collects a cone of {t1} from a source and forms an image {m} times its size. How wide is the cone converging on the image?' }
    }
  ],
  examples: [
    {
      title: 'The LED and the fibre',
      q: 'A 1 mm × 1 mm LED die radiates as a Lambertian emitter. A lens is to focus its light into a fibre of 1 mm core diameter and NA 0.22. What is the most that can ever enter the fibre?',
      steps: [
        { text: 'The source: $G_s = \\pi A_s = \\pi\\times 1\\ \\mathrm{mm^2} = 3.14\\ \\mathrm{mm^2\\,sr}$.' },
        { text: 'The fibre core: area $\\pi\\,(0.5)^2 = 0.785$ mm², accepting $\\sin\\theta = 0.22$, so', tex: 'G_t = \\pi \\times 0.785\\times 0.22^2 = 0.119\\ \\mathrm{mm^2\\,sr}' },
        'The ratio is $0.119/3.14 = 0.038$.'
      ],
      a: 'At most 3.8 % of the LED\'s light, with a flawless lens. A brighter LED of the same size would only heat the fibre end; a source with a smaller étendue is needed.'
    },
    {
      title: 'How big must the lens be?',
      q: 'A lens is to collect 80 % of the flux of a Lambertian LED. Within what half-angle must it collect, and how large must a lens be at 5 mm from the die?',
      steps: [
        { text: 'Solve $\\sin^2\\theta = 0.80$:', tex: '\\theta = \\arcsin\\sqrt{0.80} = 63.4°' },
        { text: 'A lens at distance $d$ with diameter $D$ subtends the half-angle $\\theta$ when $\\tan\\theta = D/2d$:', tex: 'D = 2d\\tan\\theta = 2\\times 5\\times 2.0 = 20\\ \\mathrm{mm}' }
      ],
      a: '63.4°; a lens of 20 mm diameter, four times as wide as it is far from the die — a very strong, very close lens, which is why LED collimators are moulded and thick.'
    }
  ],
  quiz: [
    { q: 'A lens collects the light of a Lambertian LED within a half-angle of 45° of its axis. What fraction of the LED\'s flux is that?', choices: ['25 %', '50 %', '71 %', '100 %'], a: 1, why: '$\\sin^2 45° = 0.5$. Half of a Lambertian emitter\'s light lies within 45°; 71 % would be $\\sin 45°$, which is the common mistake of forgetting to square.' },
    { q: 'With a perfect lens, all the light of a 1 mm² LED can be focused into the 50 µm core of a multimode fibre (NA 0.20).', a: false, why: 'The fibre core\'s étendue is $\\pi\\times 0.002\\times 0.04 = 2.5\\times 10^{-4}$ mm²·sr against 3.1 for the LED: at most 0.008 % could enter. A laser, with an étendue thousands of times smaller, can be coupled.' },
    { q: 'A condenser collects light from a 3 mm source within a half-angle of 20° and is to form a 1 mm image of it. Is that possible?', choices: ['Yes, any lens can do it', 'No: the cone at the image would need $\\sin\\theta_2 = 3\\sin 20° = 1.03 > 1$', 'Yes, but only with an aspheric lens', 'No: a lens cannot form an image smaller than its source'], a: 1, why: 'The sine condition $s\\sin\\theta_1 = s\'\\sin\\theta_2$ fixes the cone: a sine larger than 1 does not exist. Collect less (a smaller $\\theta_1$) or accept a larger image.' },
    { q: 'A window of 10 mm diameter accepts rays within ±20° of its axis. What is its étendue in mm²·sr? (Enter the number.)', answer: 28.9, why: '$G = \\pi A\\sin^2\\theta = \\pi\\times 78.5\\times 0.117 = 28.9$ mm²·sr, with $A = \\pi\\times 5^2 = 78.5$ mm².' },
    { q: 'Which of the four jobs of illumination optics does a mixing rod that evens out the image of an LED cluster perform?', choices: ['Collect', 'Shape', 'Homogenize', 'Deliver'], a: 2, why: 'It removes structure from the beam. (It also shapes the outline, as a rod with a rectangular section gives a rectangular beam, but the point of the rod is the evenness.)' }
  ],
  applications: [
    'Torches and spotlights: a reflector or TIR collimator collects the cone of the LED or filament and turns it into a beam (see the pages on reflectors and torches).',
    'Microscope illuminators: Köhler optics collect the lamp, shape the field and the aperture, and give an even field.',
    'Projectors: the light valve accepts only a small étendue, and the lumens at the screen are limited by it.',
    'Fibre-optic light guides and endoscope illuminators: the lamp\'s image must fit the active diameter and the acceptance cone of the bundle.',
    'Solar concentrators and burning glasses: the thermodynamic limit of concentration is étendue conservation applied to the Sun.'
  ],
  history: 'The invariant was found in several guises. Helmholtz and Lagrange had it for images; Clausius showed in the 1860s that, because of the second law, no optics can concentrate radiation to a temperature above that of its source; Ernst Abbe\'s sine condition (1873) tied it to lens design. The term étendue, French for "extent", was taken into English by illumination engineers; the modern theory of designing optics straight from this invariant, non-imaging optics, was built in the 1960s and 1970s.',
  sources: [
    'R. Winston, J. C. Miñano and P. Benítez, *Nonimaging Optics* (Elsevier, 2005) — étendue, the sine condition and the design of collectors and concentrators.',
    'J. Chaves, *Introduction to Nonimaging Optics* (CRC Press) — étendue and the first steps of designing illumination optics.',
    'W. J. Smith, *Modern Optical Engineering* — the Lagrange invariant and the sine condition.'
  ],
  sim: 'il-etendue'
},

/* ================================================================ reflectors */
{
  id: 'reflectors', parent: 'illumination-design', title: 'Reflectors: parabolic, elliptical, faceted', level: 2,
  short: 'A reflector collects light by putting the source where a mirror turns its rays into the wanted beam. A paraboloid turns a point at its focus into a parallel beam, an ellipsoid sends light from one focus to the other, a sphere returns it to its source, and facets smooth the beam of a real source that has size.',
  keywords: ['parabolic reflector', 'elliptical reflector', 'ellipsoidal reflector', 'faceted reflector', 'multifaceted reflector', 'MR16', 'PAR lamp', 'focus', 'collimation', 'beam angle', 'hot spot', 'cold mirror', 'orange peel', 'reflector depth'],
  prereq: ['collecting-and-shaping-light', 'parabolic-and-elliptical-mirrors', 'curved-mirrors'],
  related: ['flashlights-and-headlamps', 'projector-illumination', 'metal-mirror-coatings', 'dichroic-filters-and-mirrors', 'etendue', 'spherical-mirror-aberration', 'lamp-bases-and-bulb-shapes', 'physics:spherical-mirrors', 'math:parabola', 'math:ellipse'],
  body: `
The simplest way to collect light is a mirror: put the source where the surface turns its rays into the beam you want. Three curves do nearly all the work, and one more idea, facets, deals with the fact that no real source is a point.

### The parabola: a beam from a point
Every ray leaving the **focus** of a paraboloid comes out parallel to its axis. A dish of diameter $D$ and depth $d$ has the focal length

$$f = \\frac{D^2}{16\\,d}$$

so a dish 100 mm across and 25 mm deep has $f = 25$ mm. When the rim lies level with the focus (depth $= f$, diameter $= 4f$) the lamp sees the mirror all round a full hemisphere.

### From a point to a real source
A source of diameter $d_s$ is not a point: each of its points sends a beam tilted by roughly its offset from the focus divided by its distance to the mirror. The result follows at once from étendue: a beam of diameter $D$ and half-angle $\\theta_b$ can carry no more étendue than the source collected, so

$$\\sin\\theta_b \\approx \\frac{d_s}{D}\\,\\sin\\theta_c$$

with $\\theta_c$ the half-angle of the cone collected. A 3 mm filament in a 60 mm reflector that collects out to 90° gives a half-angle of about 3°; a 1 mm LED die in the same dish about 1°. To narrow a beam, use a smaller source or a larger reflector — nothing else works. Moving the source **along** the axis off the focus makes the beam diverge (source nearer the mirror) or converge (farther); moving it **across** the axis tilts the whole beam.

### The ellipse: from one focus to the other
An ellipsoid has two foci, and every ray from one passes through the other. It is the reflector for *refocusing*: a short-arc lamp at the first focus, the entrance of a light guide, a gate or an integrator rod at the second. Near the vertex the image of the source is magnified by $m = (1+\\varepsilon)/(1-\\varepsilon)$, with $\\varepsilon$ the eccentricity: 4× for $\\varepsilon = 0.6$. Zones towards the rim magnify less ($(1+\\varepsilon^2)/(1-\\varepsilon^2) = 2.1$ at the latus rectum), so the image of a finite source is a sharp core wrapped in a halo.

### The sphere: back where it came from
A source at the centre of curvature of a spherical mirror is imaged on itself. That is what the small spherical mirror behind some filaments and arcs is for: it sends the rear light back through the source and out the front.

### Facets and textures
A smooth parabola puts the filament's own image — coils, rings, a dark spot where the lamp casts its shadow — into the beam. Dividing the dish into **facets**, flat or slightly curved cells each tilted a little, overlays many shifted images, evens the beam and fixes its angle (10°, 24°, 36° are common) even when the filament is a little out of place. Multifaceted-reflector lamps are named for it (MR16: 16 eighths of an inch, 51 mm across); a PAR38 is a *parabolic aluminised reflector* 38 eighths of an inch (120 mm) across.

| Coating | Visible reflectance (typical) | Note |
|---|---|---|
| Vapour-deposited aluminium, protected | 85–90 % | most torches and lamps |
| Protected silver | about 95 % | dearer; tarnishes if not sealed |
| Dichroic "cold" multilayer | 95 % or more in the visible | passes infrared out of the back: a cooler beam |

> [!key] A reflector turns the source's angle into the beam's angle and the source's size into the beam's divergence: $\\sin\\theta_b \\approx (d_s/D)\\sin\\theta_c$. The parabola collimates, the ellipse refocuses, the sphere returns, and facets smooth.
`,
  ideas: [
    'A paraboloid turns a point source at its focus into a parallel beam; its focal length is D²/(16 d).',
    'Beam half-angle ≈ (source diameter ÷ reflector diameter) × sin(collection half-angle): size, not shape, sets divergence.',
    'An ellipsoid carries light from one focus to the other and is used to refocus a lamp into a guide or an integrator.',
    'A sphere returns a source on itself when the source sits at the centre of curvature.',
    'Facets overlay shifted images of the source, evening the beam and tolerating errors in lamp position.'
  ],
  pitfalls: [
    'A parabolic reflector makes a perfectly parallel beam — Only for a point at the focus. A real source has size, so the beam diverges by about the source size divided by the reflector size.',
    'A deeper dish always gives a narrower beam — A deeper dish collects more of the light (a larger θ_c) but the divergence still depends on d_s/D; depth mainly raises the share of the light that is controlled.',
    'Moving the lamp back a little only dims the beam — Off the focus the rays no longer leave parallel: nearer the mirror the beam spreads, farther away it converges to a waist and then spreads.',
    'The coating makes no difference in a hot lamp — A cold dichroic reflector sends the infrared out of the back instead of into the beam and onto the illuminated object, at the price of a hot lamp housing.'
  ],
  terms: [
    { term: 'Parabolic reflector', also: ['paraboloidal reflector', 'collimating reflector'], def: 'A mirror shaped as a paraboloid of revolution. A point source at its focus gives a beam parallel to the axis.' },
    { term: 'Elliptical reflector', also: ['ellipsoidal reflector', 'ERS'], def: 'A mirror shaped as an ellipsoid. Light from a source at the first focus is brought to the second; used to refocus lamps into guides, gates and integrators.' },
    { term: 'Faceted reflector', also: ['multifaceted reflector', 'MR', 'facet'], def: 'A reflector made of many small mirror cells, each tilted slightly, so that overlapping beams smooth out the image of the source and set the beam angle.' },
    { term: 'PAR lamp', also: ['parabolic aluminised reflector', 'PAR38', 'PAR30'], def: 'A lamp with a built-in parabolic reflector and a front lens. The number is the diameter in eighths of an inch: PAR38 is 4.75 inches (120 mm).' },
    { term: 'Cold-mirror reflector', also: ['dichroic reflector', 'cold mirror', 'cool-beam reflector'], def: 'A reflector coated with a multilayer that reflects visible light and lets infrared pass out of the back, so the beam carries less heat.' },
    { term: 'Collection angle', also: ['rim angle', 'θ_c'], def: 'The half-angle, measured at the source from the reflector\'s axis, out to which the reflector catches the source\'s light.' }
  ],
  formulas: [
    {
      name: 'Focal length of a parabolic dish',
      expr: 'f = D^2/(16*d)', tex: 'f = \\frac{D^2}{16\\,d}',
      vars: {
        f: { name: 'focal length', q: 'length', unit: 'mm' },
        D: { name: 'diameter of the dish', q: 'length', unit: 'mm', value: 60 },
        d: { name: 'depth of the dish', q: 'length', unit: 'mm', value: 15 }
      },
      note: 'A parabolic dish: a point at this distance from the vertex, on the axis, sends a parallel beam.',
      stories: { f: 'A parabolic reflector is {D} across and {d} deep. Where is its focus?', d: 'A parabolic reflector {D} across must have its focus {f} from the vertex. How deep is it?' }
    },
    {
      name: 'Collection angle of a dish',
      expr: 'phi = 2*atan(D/(4*f))', tex: '\\varphi = 2\\arctan\\frac{D}{4f}',
      vars: {
        phi: { name: 'angle of the rim seen from the focus', q: 'angle', unit: '°', tex: '\\varphi' },
        D: { name: 'diameter of the dish', q: 'length', unit: 'mm', value: 60 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 15 }
      },
      note: 'Measured from the axis towards the vertex. 90° means the rim is level with the focus: the lamp sees a full hemisphere of mirror.',
      stories: { phi: 'A parabolic reflector {D} across has a focal length of {f}. Out to what angle from its axis does it collect light?' }
    },
    {
      name: 'Beam half-angle of a reflector',
      expr: 'thb = asin(ds/D*sin(thc))', tex: '\\sin\\theta_b = \\frac{d_s}{D}\\,\\sin\\theta_c',
      vars: {
        thb: { name: 'beam half-angle', q: 'angle', unit: '°', tex: '\\theta_b' },
        ds: { name: 'diameter of the source', q: 'length', unit: 'mm', value: 3, tex: 'd_s' },
        D: { name: 'diameter of the reflector', q: 'length', unit: 'mm', value: 60 },
        thc: { name: 'collection half-angle', q: 'angle', unit: '°', value: 90, min: 5, max: 90, tex: '\\theta_c' }
      },
      note: 'From the conservation of étendue; a good estimate for the width of the main beam of a smooth reflector. Real reflectors add aberrations and halos.',
      stories: { thb: 'A source {ds} across sits in a reflector {D} across that collects out to {thc}. What half-angle does the beam have?', D: 'A source {ds} across must give a beam of half-angle {thb} with the dish collecting out to {thc}. How wide must the reflector be?' }
    },
    {
      name: 'Magnification of an elliptical reflector at its vertex',
      expr: 'm = (1 + ecc)/(1 - ecc)', tex: 'm = \\frac{1 + \\varepsilon}{1 - \\varepsilon}',
      vars: {
        m: { name: 'size of the image ÷ size of the source' },
        ecc: { name: 'eccentricity of the ellipse', value: 0.6, min: 0, max: 0.95, tex: '\\varepsilon' }
      },
      note: 'For the central zone of the mirror; towards the rim the image is smaller.',
      stories: { m: 'An ellipsoidal reflector of eccentricity {ecc} images a short arc at its second focus. How much is the central image enlarged?' }
    }
  ],
  examples: [
    {
      title: 'A reflector for a halogen lamp',
      q: 'A parabolic reflector is 60 mm across and 15 mm deep. A halogen filament 3 mm across sits at its focus. Find the focal length, the angle out to which it collects and the half-angle of the beam.',
      steps: [
        { text: 'The focal length:', tex: 'f = \\frac{60^2}{16\\times 15} = 15\\ \\mathrm{mm}' },
        { text: 'The rim is seen from the focus at', tex: '\\varphi = 2\\arctan\\frac{60}{4\\times 15} = 2\\arctan 1 = 90°' },
        { text: 'So the rim is level with the focus and the beam half-angle is', tex: '\\theta_b = \\arcsin\\!\\left(\\frac{3}{60}\\sin 90°\\right) = 2.9°' }
      ],
      a: 'f = 15 mm, collection to 90°, beam half-angle about 3° (a full angle of about 6°) — and all the lamp\'s light forward of the focal plane escapes as uncontrolled spill.'
    },
    {
      title: 'An ellipse into a light guide',
      q: 'A short-arc lamp with an arc 1.3 mm long sits at the first focus of an ellipsoidal reflector of eccentricity 0.6. How large is the central image at the second focus, and is it a good match for a 5 mm light guide?',
      steps: [
        { text: 'The central magnification:', tex: 'm = \\frac{1 + 0.6}{1 - 0.6} = 4' },
        'The image of the arc is $4 \\times 1.3 = 5.2$ mm long, with a halo of smaller, less magnified images from the outer zones.'
      ],
      a: 'About 5 mm: the arc\'s image just fills a 5 mm bundle, which is exactly why elliptical reflectors are used in fibre-optic illuminators.'
    }
  ],
  quiz: [
    { q: 'A parabolic dish is 100 mm across and 25 mm deep. Where is its focus (distance from the vertex)?', choices: ['12.5 mm', '25 mm', '50 mm', '100 mm'], a: 1, why: '$f = D^2/16d = 10\\,000/400 = 25$ mm. The rim is then level with the focus ($d = f$), as for any dish whose diameter is four times its focal length.' },
    { q: 'A lamp at the focus of a parabolic reflector is moved along the axis towards the mirror. The beam…', choices: ['stays parallel but dimmer', 'diverges', 'converges to a waist', 'tilts to one side'], a: 1, why: 'A source nearer the mirror than the focus gives rays that leave diverging. Farther than the focus they converge to a waist. Moving it across the axis tilts the beam.' },
    { q: 'Doubling the diameter of a reflector, with the same source and the same collection angle, roughly halves the beam half-angle.', a: true, why: '$\\sin\\theta_b \\approx (d_s/D)\\sin\\theta_c$: the divergence goes as the source size divided by the reflector size.' },
    { q: 'An ellipsoidal reflector has eccentricity 0.5. By what factor does its central zone magnify the image of the lamp?', answer: 3, why: '$m = (1+0.5)/(1-0.5) = 3$. Zones nearer the rim magnify less, so the image is a bright core and a halo.' },
    { q: 'Why is a faceted reflector used in an MR16 lamp rather than a smooth parabola?', choices: ['It is cheaper to make', 'It overlays shifted images of the filament, so the beam is even and does not show the coils', 'It collects more light', 'It removes the infrared'], a: 1, why: 'Each facet is tilted slightly and sends its own copy of the source image into the beam; the sum is smooth. The cold coating, not the facets, handles the infrared.' }
  ],
  applications: [
    'Torches, bicycle lamps and car headlamps: parabolic and free-form reflectors collect an LED or filament.',
    'Halogen spot lamps (MR16, PAR) and downlights: facets and dichroic coatings give a smooth, cool beam.',
    'Fibre-optic illuminators and projector lamps: elliptical reflectors focus an arc onto a guide or an integrator.',
    'Theatre profile spotlights: an ellipsoidal reflector images the lamp onto a gate, where shutters and patterns shape the beam.',
    'Dental, surgical and examination lamps, where facets keep the pool of light even.'
  ],
  history: 'Parabolic mirrors were used to project light long before electric lamps: lighthouses of the late 18th century burned oil lamps at the foci of silvered parabolic reflectors, and Argand\'s lamp (1780s) with its reflector became the standard of the first lighthouse optics before Fresnel\'s lenses replaced them. The electric reflector lamps of today, with a moulded or faceted reflector built into the bulb, are the descendants of the same idea.',
  sources: [
    'R. Winston, J. C. Miñano and P. Benítez, *Nonimaging Optics* (Elsevier, 2005) — reflectors, the collection of a source and its étendue.',
    'W. J. Smith, *Modern Optical Engineering* — conic mirrors and their foci.',
    'E. Hecht, *Optics* — curved mirrors and the properties of the conic sections.'
  ],
  sim: 'il-reflector'
},

/* ================================================================ condensers and Koehler illumination */
{
  id: 'condensers-and-kohler-illumination', parent: 'illumination-design', title: 'Condensers and Köhler illumination', level: 2,
  short: 'In critical illumination the lamp is imaged on the specimen, so the field is as uneven as the lamp. In Köhler illumination the lamp is imaged in the condenser\'s aperture diaphragm and the field diaphragm is imaged on the specimen: the field is even, and two diaphragms control its size and its angles separately.',
  keywords: ['Köhler illumination', 'Kohler', 'critical illumination', 'Nelson illumination', 'condenser', 'field diaphragm', 'aperture diaphragm', 'conjugate planes', 'illumination NA', 'condenser numerical aperture', 'microscope illumination', 'collector'],
  prereq: ['collecting-and-shaping-light', 'aperture-stop', 'field-stop-and-field-of-view'],
  related: ['microscope-illumination-and-contrast', 'the-compound-microscope', 'microscope-objectives', 'numerical-aperture', 'entrance-and-exit-pupils', 'projector-illumination', 'light-pipes-and-homogenizers', 'biology:microscopy'],
  body: `
A specimen needs light that is even across the field and that arrives from a controlled range of angles. A bare lamp gives neither: its filament is a bright coil, and it shines in every direction. A **condenser** is the lens that gathers the lamp's light and delivers it to the specimen, and there are two ways to arrange the optics around it.

### Critical illumination: image the lamp on the specimen
Focus the lamp onto the specimen and the field is as bright as the lamp can make it. But the field *is* the image of the lamp: the coils, the arc or the LED die show up on the specimen, and the illumination is as uneven as the source. Only a source that is itself uniform, such as ground glass lit from behind, makes it work. It is also called Nelsonian illumination, and cheap or simple microscopes still use it.

### Köhler illumination: image the lamp elsewhere
August Köhler's trick (1893) is to put the *lamp* and the *specimen* in different places in the chain, so that each point of the source lights **the whole field** with a parallel beam arriving from its own direction. The order along the axis is:

lamp → **collector** → **field diaphragm** → **aperture diaphragm** (at the front focal plane of the condenser) → **condenser** → specimen → objective

- The collector images the *lamp* in the plane of the aperture diaphragm.
- The condenser, whose front focal plane holds that diaphragm, turns every point of the lamp image into a parallel pencil crossing the specimen. Whatever the structure of the lamp, every point of the field receives a sum of pencils from all of it: an even field.
- The condenser also images the **field diaphragm** on the specimen.

| Image-forming planes (what is seen) | Illuminating planes (where the light comes from) |
|---|---|
| field diaphragm | lamp (filament, arc or LED die) |
| specimen | condenser aperture diaphragm |
| intermediate image (eyepiece field stop) | objective back focal plane (its pupil) |
| retina or camera sensor | exit pupil of the eyepiece |

Planes in one column are images of each other; the two columns interleave along the instrument, and that is the whole of Köhler's idea.

### Two diaphragms, two jobs
The **field diaphragm** sets the *size* of the lit area. Closed to just outside the field of view it stops light from falling where it cannot help and would only scatter into the image as flare. The **aperture diaphragm** sets the *angles*, the illumination numerical aperture. Opening it lets in wider cones: better resolution, less contrast and less depth of field. For an incoherently lit specimen the smallest resolvable detail is

$$d = \\frac{1.22\\,\\lambda}{\\mathrm{NA}_{obj} + \\mathrm{NA}_{cond}}$$

so with matched apertures it is $0.61\\,\\lambda/\\mathrm{NA}$, and opening the condenser beyond the objective gains nothing but flare. A common compromise is a condenser aperture of 70–80 % of the objective's NA.

### Setting Köhler up, in six steps
1. Focus on the specimen with the objective. 2. Close the field diaphragm. 3. Focus the condenser until the diaphragm's edge is sharp. 4. Centre it. 5. Open it to just outside the field. 6. Set the aperture diaphragm for the contrast wanted.

> [!key] Köhler illumination images the field diaphragm on the specimen and the lamp in the condenser\'s aperture. The field is even whatever the lamp looks like; the field diaphragm sets where the light goes and the aperture diaphragm from what angles.
`,
  ideas: [
    'Critical illumination images the lamp on the specimen: bright, but the lamp\'s structure is in the field.',
    'In Köhler illumination the lamp is imaged in the aperture diaphragm and the field diaphragm on the specimen: the field is even.',
    'The two sets of planes interleave: field diaphragm, specimen and image on one set; lamp, aperture diaphragm and objective pupil on the other.',
    'The field diaphragm sets the size of the lit area (and the flare); the aperture diaphragm sets the angles (and the contrast).',
    'The resolution depends on the sum of the objective and condenser NA: d = 1.22 λ/(NA_obj + NA_cond).'
  ],
  pitfalls: [
    'The condenser focuses the light onto the specimen — In Köhler illumination it does not: each point of the lamp becomes a parallel pencil across the specimen, and the lamp is focused elsewhere (in the aperture diaphragm and the objective\'s pupil).',
    'The aperture diaphragm is the brightness control — It sets the angles of the light, not its level: closing it changes the contrast and the resolution as well as the brightness. Use the lamp\'s power or neutral filters to dim the field.',
    'The field diaphragm sets the angles — It sets the size of the lit area only; the aperture diaphragm sets the angles.',
    'A wider condenser aperture is always better — Beyond the objective\'s own NA it adds only stray light and flare and lowers the contrast.'
  ],
  terms: [
    { term: 'Köhler illumination', also: ['Kohler illumination'], def: 'An illumination in which the source is imaged in the condenser\'s aperture diaphragm and the field diaphragm on the specimen, so that the field is even and its size and its angles are controlled separately.' },
    { term: 'Critical illumination', also: ['Nelson illumination', 'Nelsonian illumination'], def: 'An illumination in which an image of the source is focused on the specimen. Efficient, but the field shows the structure of the source.' },
    { term: 'Condenser', also: ['substage condenser'], def: 'The lens system below the specimen that delivers the light as a cone of controlled angle and, in Köhler illumination, images the field diaphragm on the specimen.' },
    { term: 'Field diaphragm', also: ['field stop', 'luminous-field diaphragm'], def: 'An iris in the lamp housing, imaged on the specimen; it sets the size of the illuminated area.' },
    { term: 'Aperture diaphragm', also: ['condenser diaphragm', 'condenser iris'], def: 'An iris at the front focal plane of the condenser; it sets the angles of the illumination, that is the illumination numerical aperture.' },
    { term: 'Conjugate planes', also: ['conjugate pair', 'image planes'], def: 'Two planes of an optical system that are images of each other; a point in one has its image at a point in the other.' }
  ],
  formulas: [
    {
      name: 'Resolution with a condenser',
      expr: 'd = 1.22*lambda/(NAo + NAc)', tex: 'd = \\frac{1.22\\,\\lambda}{\\mathrm{NA}_o + \\mathrm{NA}_c}',
      vars: {
        d: { name: 'smallest resolvable spacing', q: 'length', unit: 'µm' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        NAo: { name: 'numerical aperture of the objective', value: 0.65, min: 0.05, max: 1.4, tex: '\\mathrm{NA}_o' },
        NAc: { name: 'numerical aperture of the condenser illumination', value: 0.5, min: 0.05, max: 1.4, tex: '\\mathrm{NA}_c' }
      },
      note: 'For incoherent illumination with the condenser NA not larger than the objective\'s.',
      stories: { d: 'An objective of NA {NAo} is used with the condenser aperture set to {NAc}, in light of {lambda}. What is the smallest spacing resolved?' }
    },
    {
      name: 'Illumination NA from the aperture diaphragm',
      expr: 'NAc = n*sin(atan(a/fk))', tex: '\\mathrm{NA}_c = n\\,\\sin\\!\\left(\\arctan\\frac{a}{f_k}\\right)',
      vars: {
        NAc: { name: 'illumination numerical aperture', tex: '\\mathrm{NA}_c' },
        n: { name: 'refractive index of the medium', value: 1, min: 1, max: 1.6 },
        a: { name: 'radius of the aperture-diaphragm opening', q: 'length', unit: 'mm', value: 8 },
        fk: { name: 'front focal length of the condenser', q: 'length', unit: 'mm', value: 20, tex: 'f_k' }
      },
      note: 'The diaphragm sits at the front focal plane; each point of its opening gives a parallel pencil, and the widest pencils set the cone at the specimen.',
      stories: { NAc: 'The aperture diaphragm of a condenser of {fk} focal length is open to a radius of {a}. What is the illumination NA in a medium of index {n}?' }
    },
    {
      name: 'Image of the lamp in the aperture diaphragm',
      expr: 'si = f*so/(so - f)', tex: 's_i = \\frac{f\\,s_o}{s_o - f}',
      vars: {
        si: { name: 'distance from the collector to the lamp image', q: 'length', unit: 'mm', tex: 's_i' },
        f: { name: 'focal length of the collector', q: 'length', unit: 'mm', value: 40 },
        so: { name: 'distance from the lamp to the collector', q: 'length', unit: 'mm', value: 47, tex: 's_o' }
      },
      note: 'Thin-lens equation for the collector; the lamp is placed so that this image falls on the aperture diaphragm.',
      stories: { si: 'A collector of focal length {f} stands {so} from a lamp. How far behind it is the image of the lamp?' }
    }
  ],
  examples: [
    {
      title: 'Opening the condenser',
      q: 'A 40× objective of NA 0.65 is used in light of 550 nm. Compare the resolution with the condenser aperture at NA 0.2, at 75 % of the objective\'s NA (0.49) and fully open to 0.65.',
      steps: [
        { text: 'With $d = 1.22\\lambda/(\\mathrm{NA}_o+\\mathrm{NA}_c)$ and $\\lambda = 0.55$ µm:', tex: 'd_{0.2} = \\frac{0.671}{0.85} = 0.79\\ \\mu\\mathrm{m} \\quad d_{0.49} = \\frac{0.671}{1.14} = 0.59\\ \\mu\\mathrm{m} \\quad d_{0.65} = \\frac{0.671}{1.30} = 0.52\\ \\mu\\mathrm{m}' },
        'Going from 0.49 to 0.65 gains 0.07 µm of resolution but throws far more light of high angle into the image, lowering the contrast of weakly absorbing specimens.'
      ],
      a: '0.79 µm, 0.59 µm and 0.52 µm. Most work settles near 75 %, the compromise between resolution and contrast.'
    },
    {
      title: 'The size of the illumination cone',
      q: 'A condenser has a front focal length of 20 mm and its aperture diaphragm is opened to a radius of 8 mm (the specimen is in air). What is the illumination NA?',
      steps: [
        { text: 'The half-angle of the widest pencil:', tex: '\\theta = \\arctan\\frac{8}{20} = 21.8°' },
        'Then $\\mathrm{NA}_c = \\sin 21.8° = 0.37$.'
      ],
      a: 'NA 0.37 (θ = 21.8°). For an objective of NA 0.65 that is about 57 % of the objective\'s NA, a little below the usual 70–80 % compromise, so the diaphragm would be opened slightly.'
    }
  ],
  quiz: [
    { q: 'In Köhler illumination, the lamp filament is in focus in the plane of…', choices: ['the specimen', 'the field diaphragm', 'the condenser aperture diaphragm', 'the eyepiece field stop'], a: 2, why: 'The collector images the lamp in the aperture diaphragm (front focal plane of the condenser); the field diaphragm is imaged on the specimen. The lamp is also conjugate with the objective\'s back focal plane.' },
    { q: 'Closing the field diaphragm of a Köhler microscope makes the illuminated area smaller, without changing the angles of the light.', a: true, why: 'It is imaged on the specimen and sets the size of the field. The angles are set by the aperture diaphragm.' },
    { q: 'You close the condenser aperture diaphragm to reduce glare in a specimen that is nearly transparent. Compared with fully open, you expect…', choices: ['more resolution, less contrast', 'less resolution, more contrast', 'more resolution, more contrast', 'the same resolution and the same contrast'], a: 1, why: 'A smaller illumination NA lowers the NA sum in the resolution formula, but the narrower cone also raises the contrast of the nearly transparent details.' },
    { q: 'An objective of NA 0.25 is used with a condenser illumination NA of 0.25 in light of 500 nm. What is the smallest spacing resolved, in µm?', answer: 1.22, why: '$d = 1.22\\times 0.5/(0.25+0.25) = 1.22$ µm — the same as $0.61\\lambda/\\mathrm{NA}$ for matched apertures.' },
    { q: 'A microscope shows the coils of its lamp filament in the field of view. Which illumination is it using, and why?', choices: ['Köhler, because the lamp is imaged in the field', 'Critical, because the lamp is imaged on the specimen', 'Köhler, because the field diaphragm is open', 'Dark-field, because the field is dark'], a: 1, why: 'Only an image of the source in the specimen plane puts its structure into the field. Properly set Köhler optics image the lamp elsewhere.' }
  ],
  applications: [
    'Every research and laboratory light microscope, in transmitted light and, with the same principle, in reflected light.',
    'Projectors and enlargers: the film gate is lit by a condenser that images the lamp in the projection lens.',
    'Photolithography: the mask is illuminated by Köhler optics so that the exposure is uniform and the partial coherence is controlled.',
    'Machine-vision and measurement microscopes, where an even field is needed for edge detection.',
    'Spotlight and profile lanterns, which use the same ordering of the lamp, the gate and the lens.'
  ],
  history: 'August Köhler, then a young physicist at the Zeiss works in Jena, described the method in 1893 in a paper on lighting for photomicrography, in the Zeitschrift für wissenschaftliche Mikroskopie. It spread through the microscope makers around 1900 and is still the standard way of setting up a transmitted-light microscope.',
  sources: [
    'A. Köhler, "Ein neues Beleuchtungsverfahren für mikrophotographische Zwecke", *Zeitschrift für wissenschaftliche Mikroskopie* 10 (1893) — the original description.',
    'M. Born and E. Wolf, *Principles of Optics* — partially coherent illumination and the condenser.',
    'ISO 10934, *Microscopes — Vocabulary for light microscopy* — the definitions of the planes and diaphragms.'
  ],
  sim: 'il-kohler'
},

/* ================================================================ light pipes and homogenizers */
{
  id: 'light-pipes-and-homogenizers', parent: 'illumination-design', title: 'Light pipes and homogenizers', level: 2,
  short: 'A polished rod or a mirrored tunnel folds the light on itself at every wall, so its end is a sum of many mirrored copies of its entrance: the structure of an LED cluster or an arc image is averaged away. Tapers trade area for angle, and fly\'s-eye arrays do the same job in a shorter space.',
  keywords: ['light pipe', 'integrating rod', 'light tunnel', 'kaleidoscope', 'homogenizer', 'integrator', 'mixing rod', 'taper', 'fly\'s-eye integrator', 'colour mixing', 'uniformity', 'number of reflections', 'light guide plate'],
  prereq: ['collecting-and-shaping-light', 'critical-angle-and-total-internal-reflection', 'etendue'],
  related: ['microlens-arrays', 'projector-illumination', 'fibre-optic-light-guides', 'condensers-and-kohler-illumination', 'flat-top-beam-shapers', 'the-integrating-sphere', 'diffusers-and-ground-glass', 'white-leds'],
  body: `
The image of an arc, a filament or a cluster of red, green and blue LED dies is full of bright spots, dark gaps and colour fringes. To light a panel or a specimen evenly that structure has to go. A **light pipe** removes it without throwing light away, and it works the way a kaleidoscope does.

### The rod: fold and overlay
Take a polished rod of glass or acrylic with a square end. Light that enters travels down it, and every time it meets a side wall it is reflected by total internal reflection. Unfold the picture by mirroring the rod in each wall, and the exit face turns out to be a *sum of many mirrored, shifted copies* of the entrance, one for every pattern of reflections. The more reflections the extreme rays make, the more copies overlap and the more even the sum is.

A ray at an angle $\\theta_i$ inside the rod of width $w$ and length $L$ crosses the width $L\\tan\\theta_i/w$ times:

$$N = \\frac{L\\,\\tan\\theta_i}{w}$$

and $\\theta_i$ is the angle after refraction at the entrance, $\\sin\\theta = n\\sin\\theta_i$. The glass makes the cone narrower, so, for a 50 mm rod of acrylic ($n = 1.49$) of 5 mm square section:

| Cone entering, half-angle in air | Angle inside the glass | Reflections across one axis, extreme ray |
|---|---|---|
| ±12° (f/2.4) | 8.0° | 1.4 |
| ±24° (f/1.2) | 15.8° | 2.8 |
| ±40° | 25.6° | 4.8 |
| ±90° (an LED against the rod) | 42.2° | 9.1 |

An LED against the rod mixes in a few widths; a narrow cone needs ten or twenty.

### Why the cross-section matters
In a **square** (or rectangular) rod the motions along $x$ and $y$ are independent, and each is folded as above. The exit face has the shape of the entrance, so a rectangular rod gives a rectangle with the aspect ratio of the panel it is to light. In a **round** rod the skew rays keep their angular momentum and orbit the axis, so rays from a point of the entrance can never reach the centre: a ring or a hole survives however long the rod.

### Hollow tunnels
A tunnel of four mirror walls works the same way but in air. The angle is not reduced by the glass, so it makes more reflections in the same length ($N = L\\tan\\theta/w$ with the angle in air). Each reflection costs a few per cent (97–99 % for dielectric-enhanced coatings), so a long tunnel loses more than a rod, whose total reflection is lossless apart from the two end faces (about 4 % each unless coated).

### Tapers
A rod that widens from $w_{in}$ to $w_{out}$ trades area for angle, in the way [[etendue|étendue]] allows: the half-angle shrinks to $\\sin\\theta_{out} = (w_{in}/w_{out})\\sin\\theta_{in}$. A 2:1 taper takes a Lambertian LED ($\\pm 90°$) and delivers it at $\\pm 30°$ from a face twice as wide. Run backwards, the same taper is a concentrator, with the cone growing as the width falls.

### Fly's-eye integrators
Two arrays of small lenses do the job in a few centimetres. The first array cuts the beam into beamlets, the second array's lenses and a field lens overlay the images of every first-array lenslet on the target, each with the lenslet's outline. A sum of many sampled pieces of the beam is even. A diffuser also evens a beam, but by scattering: it enlarges the étendue and loses control of the angles, whereas a rod conserves it.

> [!key] A rod folds the beam on itself: its end is the sum of many mirrored copies of its entrance. Evenness grows with the reflections, $N = L\\tan\\theta_i/w$; a square section mixes best; a taper trades area for angle; a diffuser mixes by giving up étendue.
`,
  ideas: [
    'A rod or tunnel mixes by repeated reflection: the exit is a sum of mirrored copies of the entrance.',
    'The number of reflections is N = L tan θ_i / w, with θ_i the angle inside the rod: a narrow cone needs a long rod.',
    'Square, rectangular and hexagonal sections mix well; a round rod leaves a ring because skew rays never reach the centre.',
    'A solid rod conserves étendue and loses only the end-face reflections; a hollow tunnel loses a few per cent on every bounce.',
    'A taper trades area for angle: sin θ_out = (w_in/w_out) sin θ_in.'
  ],
  pitfalls: [
    'A light pipe is just a window that carries light — It is an optical element that rearranges the light: its output pattern, size and angles differ from its input, and a longer pipe is a better mixer.',
    'A longer rod always mixes better, whatever the input — The reflections depend on the angle inside the rod: a collimated beam parallel to the axis never touches the wall and is not mixed at all.',
    'A round rod mixes best because it is symmetric — A round rod preserves the skew rays and leaves rings and holes; square or hexagonal sections mix far better.',
    'A diffuser and a rod are equivalent ways of evening a beam — A diffuser scatters, which increases the étendue and sends light outside the useful angles; a rod keeps the étendue and can keep the shape.'
  ],
  terms: [
    { term: 'Light pipe', also: ['light rod', 'integrating rod', 'mixing rod', 'light guide (solid)'], def: 'A solid rod of glass or plastic with polished sides that carries and mixes light by total internal reflection.' },
    { term: 'Light tunnel', also: ['hollow integrator', 'mirror tunnel'], def: 'A hollow tube with mirrored inside walls that mixes light like a rod but in air, and carries ultraviolet and high power.' },
    { term: 'Kaleidoscope mixing', also: ['kaleidoscope integrator'], def: 'The mixing that occurs when light reflects off the walls of a rod or tunnel: the output is a sum of many mirrored copies of the input pattern.' },
    { term: 'Homogenizer', also: ['integrator', 'beam homogenizer', 'uniformizer'], def: 'Any optic that makes the cross-section of a beam even: a mixing rod, a fly\'s-eye array, a diffuser.' },
    { term: 'Taper', also: ['tapered light pipe', 'tapered rod'], def: 'A rod whose cross-section changes along its length, trading beam width for beam angle without losing étendue.' },
    { term: 'Uniformity', also: ['flatness', 'U₀'], def: 'How even a pattern of light is, often stated as the lowest value divided by the highest (or by the mean) across the field.' }
  ],
  formulas: [
    {
      name: 'Angle inside the rod',
      expr: 'ti = asin(sin(t)/n)', tex: '\\theta_i = \\arcsin\\frac{\\sin\\theta}{n}',
      vars: {
        ti: { name: 'half-angle inside the rod', q: 'angle', unit: '°', tex: '\\theta_i' },
        t: { name: 'half-angle of the cone in air', q: 'angle', unit: '°', value: 24, min: 0, max: 90, tex: '\\theta' },
        n: { name: 'refractive index of the rod', value: 1.49, min: 1, max: 2.5 }
      },
      note: 'Snell\'s law at the entrance face: the glass narrows the cone.',
      stories: { ti: 'A cone of {t} half-angle enters a rod of index {n}. What half-angle does it have inside?' }
    },
    {
      name: 'Number of reflections',
      expr: 'N = L*tan(ti)/w', tex: 'N = \\frac{L\\,\\tan\\theta_i}{w}',
      vars: {
        N: { name: 'reflections across one axis (extreme ray)' },
        L: { name: 'length of the rod', q: 'length', unit: 'mm', value: 50 },
        ti: { name: 'half-angle inside the rod', q: 'angle', unit: '°', value: 15.8, min: 0.1, max: 60, tex: '\\theta_i' },
        w: { name: 'width of the rod', q: 'length', unit: 'mm', value: 5 }
      },
      note: 'For a hollow tunnel use the angle in air. A value of 3 or more usually gives a well-mixed output.',
      stories: { N: 'A rod {L} long and {w} wide carries light at {ti} inside the glass. How many times does the extreme ray cross the width?', L: 'A rod {w} wide carries rays at {ti} inside the glass and must give {N} reflections across one axis. How long must it be?' }
    },
    {
      name: 'Output angle of a taper',
      expr: 'to = asin(win/wout*sin(tin))', tex: '\\sin\\theta_{out} = \\frac{w_{in}}{w_{out}}\\,\\sin\\theta_{in}',
      vars: {
        to: { name: 'half-angle leaving the large end (in air)', q: 'angle', unit: '°', tex: '\\theta_{out}' },
        win: { name: 'width of the small end', q: 'length', unit: 'mm', value: 3, tex: 'w_{in}' },
        wout: { name: 'width of the large end', q: 'length', unit: 'mm', value: 6, tex: 'w_{out}' },
        tin: { name: 'half-angle entering the small end (in air)', q: 'angle', unit: '°', value: 90, min: 1, max: 90, tex: '\\theta_{in}' }
      },
      note: 'From the conservation of étendue along one dimension, with the angles expressed in air; the taper must be long enough that the rays are carried.',
      stories: { to: 'A taper widens from {win} to {wout} and is fed with a cone of {tin} half-angle. What is the cone at the large end?' }
    },
    {
      name: 'Numerical aperture of a bare rod',
      expr: 'NA = sqrt(n^2 - 1)', tex: '\\mathrm{NA} = \\sqrt{n^2 - 1}',
      vars: {
        NA: { name: 'numerical aperture', tex: '\\mathrm{NA}' },
        n: { name: 'refractive index of the rod', value: 1.49, min: 1, max: 2.5 }
      },
      note: 'A rod in air. When NA is 1 or more, every ray that can enter from air is carried by total internal reflection.',
      stories: { NA: 'A bare rod of index {n} stands in air. What is its numerical aperture?' }
    }
  ],
  examples: [
    {
      title: 'How long must the rod be?',
      q: 'A rod of N-BK7 ($n = 1.517$) is 4 mm square and is fed by a lamp reflector that delivers an f/1.2 beam. How long must it be for the extreme rays to make 3 reflections across one axis?',
      steps: [
        { text: 'The half-angle of an f/1.2 cone: $\\sin\\theta = 1/(2N) = 0.4167$, so $\\theta = 24.6°$.' },
        { text: 'Inside the glass:', tex: '\\theta_i = \\arcsin\\frac{0.4167}{1.517} = 15.9°' },
        { text: 'Solve $N = L\\tan\\theta_i/w$ for $L$:', tex: 'L = \\frac{3\\times 4\\ \\mathrm{mm}}{\\tan 15.9°} = 42\\ \\mathrm{mm}' }
      ],
      a: 'About 42 mm, ten times the width. An f/2 beam (14.5°, 9.5° inside) would need 72 mm: slow beams ask for long rods.'
    },
    {
      title: 'A taper for an LED',
      q: 'An LED die 3 mm across, radiating ±90°, feeds the small end of a taper that widens to 6 mm. What cone leaves the large end, in air?',
      steps: [
        { text: 'Conservation of étendue along one dimension:', tex: '\\sin\\theta_{out} = \\frac{3}{6}\\sin 90° = 0.5' },
        'So $\\theta_{out} = 30°$.'
      ],
      a: '±30°. The taper has turned a hemisphere of light into a 60° cone by doubling the width — the beam is narrower and the source appears larger.'
    }
  ],
  quiz: [
    { q: 'A rod of index 1.5 and 5 mm square section is fed with a cone of ±24° half-angle in air. Increasing the rod\'s length from 25 to 50 mm will…', choices: ['double the number of reflections and improve the mixing', 'leave the mixing unchanged', 'halve the number of reflections', 'make the output round'], a: 0, why: '$N = L\\tan\\theta_i/w$ is proportional to the length, so the extreme rays reflect twice as often, and more copies overlap at the output.' },
    { q: 'A perfectly collimated beam parallel to the axis enters a long square rod. How well is it mixed?', choices: ['Perfectly, because the rod is long', 'Not at all: the rays never touch the walls', 'Only along one axis', 'It depends on the refractive index'], a: 1, why: 'Mixing works through reflections, which need rays at an angle to the axis. A parallel beam passes unchanged; that is why integrators need a cone.' },
    { q: 'A round rod mixes the light of a point source on its axis perfectly well, since it is symmetric.', a: false, why: 'Skew rays in a round rod never cross the axis, so rings and holes persist whatever the length. Square or hexagonal rods avoid this.' },
    { q: 'A glass rod of refractive index 1.62 is used in air. What is its numerical aperture (enter the number)?', answer: 1.27, why: '$\\mathrm{NA} = \\sqrt{n^2-1} = \\sqrt{1.62^2-1} = 1.27$. Since it is above 1, every ray entering from air is carried by total internal reflection.' },
    { q: 'A taper has a 4 mm input and an 8 mm output. A ±40° cone enters the small end. What is the half-angle at the large end?', choices: ['10°', '19°', '40°', '80°'], a: 1, why: '$\\sin\\theta_{out} = \\tfrac{4}{8}\\sin 40° = 0.321$, so $\\theta_{out} = 18.7°$. The width doubled and the sine of the angle halved.' }
  ],
  applications: [
    'Digital projectors: a rod or tunnel at the second focus of the lamp\'s reflector gives a uniform, rectangular spot that fits the panel.',
    'Colour mixing of red, green and blue LED dies in stage lights and projectors, and in white-light LED arrays.',
    'Light pipes on equipment front panels, which carry the light of an LED on a circuit board to a window in the panel.',
    'Edge-lit light guide plates that spread LED light over the back of a display or a back-lit panel.',
    'Fibre-optic and medical illuminators, where a short rod evens the lamp image before the bundle.'
  ],
  history: 'The multiple reflections of a pair or ring of mirrors were put to work by David Brewster, who invented the kaleidoscope in 1816 and wrote a treatise on it in 1819. In optical engineering the integrating rod and the fly\'s-eye array became the standard way of evening the light of a projector as digital projectors developed in the 1990s.',
  sources: [
    'R. Winston, J. C. Miñano and P. Benítez, *Nonimaging Optics* (Elsevier, 2005) — tapered rods, étendue and the design of homogenizers.',
    'J. Chaves, *Introduction to Nonimaging Optics* (CRC Press) — light pipes and integrators.',
    'D. Brewster, *A Treatise on the Kaleidoscope* (1819) — the original multiple-reflection device.'
  ],
  sim: 'il-light-pipe'
},

/* ================================================================ fibre-optic light guides */
{
  id: 'fibre-optic-light-guides', parent: 'illumination-design', title: 'Fibre-optic light guides', level: 2,
  short: 'A light guide is a flexible cable of thousands of glass (or plastic) fibres, or a tube of liquid, that carries "cold light" from a lamp house to a microscope, an endoscope or a ring light. Each fibre guides by total internal reflection; the bundle accepts a cone of about ±34° (NA 0.56) and passes roughly half to two thirds of the light per metre.',
  keywords: ['light guide', 'fibre bundle', 'cold light', 'gooseneck', 'ring light', 'line light', 'liquid light guide', 'plastic optical fibre', 'packing fraction', 'numerical aperture', 'acceptance angle', 'light cable', 'fibre illuminator', 'attenuation per metre'],
  prereq: ['how-an-optical-fibre-guides-light', 'fibre-numerical-aperture', 'collecting-and-shaping-light'],
  related: ['ferrules-and-light-guide-couplings', 'fibre-bundles-and-image-guides', 'periscopes-and-endoscopes', 'microscope-illumination-and-contrast', 'machine-vision-lighting', 'light-pipes-and-homogenizers', 'fibre-connectors-and-ferrules', 'coupling-light-into-fibre'],
  body: `
A lamp is hot, bulky, mains-powered and often dangerous to put close to a specimen or a patient. A **light guide** lets the lamp stay in its housing and carries the light, "cold" because the heat stays behind (most of the infrared is filtered at the lamp), along a flexible cable to where it is needed: the stage of a microscope, the tip of an endoscope, a ring of light around a lens.

### What it is made of
The commonest guide is a bundle of thousands of glass fibres, each 30–70 µm across, packed together and free along the length of the cable. Each fibre has a *core* of high-index glass (a flint, $n \\approx 1.62$) inside a *cladding* of lower index (a crown, $n \\approx 1.52$). Total internal reflection keeps light in the core, and the numerical aperture is

$$\\mathrm{NA} = \\sqrt{n_{core}^2 - n_{clad}^2} = \\sqrt{1.62^2 - 1.52^2} = 0.56$$

so the guide accepts a cone of half-angle $\\arcsin 0.56 = 34°$ (68° in all) — a wide cone that matches the lamp's reflector.

| Kind | Typical size | NA | Passes | Notes |
|---|---|---|---|---|
| Glass fibre bundle | fibres 30–70 µm; bundle 1–12 mm | 0.5–0.6 | visible and near-infrared; blue is absorbed more | flexible, metal-sheathed, the common kind |
| Liquid light guide | one liquid core of 3–8 mm in a polymer tube | about 0.5–0.6 | visible and near-ultraviolet, from about 300–320 nm | for fluorescence and ultraviolet curing; avoid freezing and strong heating |

### How much comes out
Four things take light away. The **packing fraction**: round fibres in a hexagonal pattern cover at most $\\pi/(2\\sqrt3) = 90.7\\ \\%$ of the bundle, and the cladding wastes more, so for a 50 µm core in a 55 µm fibre only $0.907\\times(50/55)^2 = 75\\ \\%$ of the face is core. The **end faces**: each glass–air surface of $n = 1.62$ reflects 5.6 %. **Absorption** in the glass, around 0.6 dB (13 %) per metre in the visible, more in the blue. And **bad fibres**: a fibre broken by a tight bend stays dark. Together they leave about 58 % per metre and 51 % over two metres — the reason light guides are a metre or two long.

What comes out is a cone: a short, straight guide returns roughly the angle that went in, and a long or bent one fills more and more of its full ±34°. The output face also mixes the *positions* of the lamp image, so the end is a nearly uniform disc however uneven the image on the input face was.

### Shapes at the output
A **gooseneck** is a flexible metal tube that keeps its shape, with a lens or a plain end. A **ring light** arranges the fibres round a lens for shadowless lighting of a specimen; a **line light** converts the round bundle into a thin line of fibres, a slit 1 mm × 40 mm or more, for scanners and machine vision. The fibre end holds the bundle in a *ferrule* — see [[ferrules-and-light-guide-couplings]].

### Care
Do not bend a guide tighter than its maker's minimum radius: the fibres break, and the broken ones show as black dots when the other end is lit.

> [!warn] "Cold light" is not harmless. A guide fed by a bright lamp can deliver enough power at its tip to scorch paper or skin and to damage a camera sensor, and it is dazzlingly bright to the eye. Never look into the end of an illuminated guide, and switch the lamp to standby before disconnecting it.

> [!key] A light guide is a bundle of clad fibres: NA about 0.56 (a ±34° cone), core packing about 75 %, roughly half to two thirds of the light per metre. It moves the lamp away from the work and mixes the lamp's image into an even disc.
`,
  ideas: [
    'A glass light guide is a randomly arranged bundle of thousands of fibres, each guiding by total internal reflection.',
    'A flint core of n ≈ 1.62 in a crown cladding of n ≈ 1.52 gives NA ≈ 0.56: an acceptance cone of about ±34°.',
    'Packing, end-face reflection and absorption leave about 55–60 % of the light per metre.',
    'The output is a cone and an even disc: the bundle scrambles the lamp image, though a short straight guide keeps most of the input angle.',
    'Liquid guides carry the near ultraviolet that glass bundles absorb; plastic bundles are cheap and flexible but limited in temperature.'
  ],
  pitfalls: [
    'Cold light carries no heat — Most of the infrared is filtered at the lamp, but the visible light still heats whatever absorbs it, and a powerful guide can burn skin or paper at its tip.',
    'A guide carries a picture — Only an image guide with ordered fibres does; the fibres of a light guide are at random, so only the light is carried.',
    'A guide returns the light at the same angle that entered — A short straight guide roughly does; a long or bent one fills a cone closer and closer to its full acceptance angle.',
    'A thicker bundle always gives more light — Only if the lamp\'s image fills it: a bundle larger than the image has dark fibres at the edge, and a bundle smaller than the image wastes light and heats the ferrule.'
  ],
  terms: [
    { term: 'Light guide', also: ['fibre-optic light guide', 'light cable', 'fibre bundle', 'fiber light guide'], def: 'A flexible cable of many fibres, or a tube filled with liquid, that carries light from a lamp to the point of use. Only the light is carried, not an image.' },
    { term: 'Packing fraction', also: ['fill factor', 'core fraction'], def: 'The share of the bundle\'s end face that is fibre core and so carries light. Round fibres in a hexagonal array cannot exceed 90.7 %; real bundles reach 70–80 %.' },
    { term: 'Cold light', also: ['cold-light source', 'fibre illuminator'], def: 'Light delivered through a guide from a remote lamp, with most of the infrared filtered out. The heat of the lamp stays in the housing.' },
    { term: 'Gooseneck', also: ['flexible arm', 'goose neck'], def: 'A flexible metal tube that holds its shape and encloses the output end of a light guide so that it can be aimed.' },
    { term: 'Ring light', also: ['annular light', 'fibre ring light'], def: 'A light guide whose output end is arranged as a ring that fits round a lens, to light a specimen evenly from all sides.' },
    { term: 'Liquid light guide', also: ['liquid-core light guide'], def: 'A guide with a single large core of transparent liquid inside a low-index polymer tube. It transmits the near ultraviolet and is used for fluorescence and curing.' }
  ],
  formulas: [
    {
      name: 'Numerical aperture of a fibre',
      expr: 'NA = sqrt(nc^2 - ncl^2)', tex: '\\mathrm{NA} = \\sqrt{n_c^2 - n_{cl}^2}',
      vars: {
        NA: { name: 'numerical aperture', tex: '\\mathrm{NA}' },
        nc: { name: 'refractive index of the core', value: 1.62, min: 1.2, max: 2.5, tex: 'n_c' },
        ncl: { name: 'refractive index of the cladding', value: 1.52, min: 1.1, max: 2.4, tex: 'n_{cl}' }
      },
      note: 'The sine of the acceptance half-angle in air. The cone is arcsin NA.',
      stories: { NA: 'A fibre has a core of index {nc} and a cladding of index {ncl}. What is its numerical aperture?' }
    },
    {
      name: 'Packing fraction of a bundle',
      expr: 'pf = pi/(2*sqrt(3))*(dc/df)^2', tex: '\\eta_p = \\frac{\\pi}{2\\sqrt{3}}\\left(\\frac{d_c}{d_f}\\right)^2',
      vars: {
        pf: { name: 'share of the end face that is core', q: 'ratio', unit: '%', tex: '\\eta_p' },
        dc: { name: 'core diameter', q: 'length', unit: 'µm', value: 50, tex: 'd_c' },
        df: { name: 'diameter of one fibre with its cladding', q: 'length', unit: 'µm', value: 55, tex: 'd_f' }
      },
      note: 'Hexagonal packing of round fibres, with no extra adhesive between them.',
      stories: { pf: 'A bundle is made of fibres of {df} overall with cores of {dc}. What share of its face carries light?' }
    },
    {
      name: 'Transmission of a light guide',
      expr: 'T = pf*(1 - R)^2*10^(-a*L/10)', tex: 'T = \\eta_p\\,(1 - R)^2\\,10^{-\\alpha L/10}',
      vars: {
        T: { name: 'fraction of the light transmitted', q: 'ratio', unit: '%' },
        pf: { name: 'packing fraction', q: 'ratio', unit: '%', value: 75, tex: '\\eta_p' },
        R: { name: 'reflectance of one end face', q: 'ratio', unit: '%', value: 5.6 },
        a: { name: 'attenuation of the glass', q: false, unit: 'dB/m', value: 0.6, tex: '\\alpha' },
        L: { name: 'length of the guide', q: 'length', unit: 'm', value: 1 }
      },
      note: 'A simple budget: the lost area between cores, two end faces, and the absorption along the way. Attenuation depends strongly on the wavelength; 0.6 dB/m is a typical figure in the visible.',
      stories: { T: 'A guide {L} long has a packing fraction of {pf}, end faces reflecting {R} each and an attenuation of {a}. What share of the light comes out?' }
    },
    {
      name: 'Number of fibres in a bundle',
      expr: 'Nf = pf*(D/dc)^2', tex: 'N_f = \\eta_p\\left(\\frac{D}{d_c}\\right)^2',
      vars: {
        Nf: { name: 'number of fibres' },
        pf: { name: 'packing fraction', q: 'ratio', unit: '%', value: 75, tex: '\\eta_p' },
        D: { name: 'diameter of the active bundle', q: 'length', unit: 'mm', value: 5 },
        dc: { name: 'core diameter', q: 'length', unit: 'µm', value: 50, tex: 'd_c' }
      },
      note: 'The bundle\'s active area divided by the area of one core, times the share that is core.',
      stories: { Nf: 'A bundle {D} across has a packing fraction of {pf} and cores of {dc}. How many fibres does it hold?' }
    }
  ],
  examples: [
    {
      title: 'How much light does a 5 mm guide pass?',
      q: 'A glass guide is made of 50 µm cores in 55 µm fibres (flint $n = 1.62$ in crown $n = 1.52$). Find its numerical aperture and its transmission at 1 m and at 2 m, taking 0.6 dB/m for the absorption.',
      steps: [
        { text: 'The numerical aperture:', tex: '\\mathrm{NA} = \\sqrt{1.62^2 - 1.52^2} = 0.56' },
        { text: 'The packing fraction is $0.907\\times(50/55)^2 = 0.75$, and each end face reflects $R = \\left(\\frac{0.62}{2.62}\\right)^2 = 5.6\\ \\%$. At 1 m:', tex: 'T = 0.75\\times 0.944^2\\times 10^{-0.06} = 0.58' },
        { text: 'At 2 m:', tex: 'T = 0.75\\times 0.944^2 \\times 10^{-0.12} = 0.51' }
      ],
      a: 'NA 0.56 (about ±34°); 58 % at 1 m and 51 % at 2 m. The guide\'s fixed losses (packing and the two ends, about 33 %) matter more than its length.'
    },
    {
      title: 'How many fibres?',
      q: 'How many fibres of 50 µm core are in a 5 mm bundle with a packing fraction of 75 %?',
      steps: [
        { text: 'The active area is $\\pi\\times 2.5^2 = 19.6$ mm² and each core covers $\\pi\\times 0.025^2 = 0.00196$ mm². So', tex: 'N_f = 0.75\\times\\left(\\frac{5\\ \\mathrm{mm}}{0.05\\ \\mathrm{mm}}\\right)^2 = 7500' }
      ],
      a: 'About 7500 fibres, each a hair-thin light pipe of its own; losing a few hundred to bends hardly shows in the output.'
    }
  ],
  quiz: [
    { q: 'A fibre has a core of index 1.62 and a cladding of index 1.52. What is its numerical aperture?', choices: ['0.10', '0.56', '1.07', '0.22'], a: 1, why: '$\\mathrm{NA} = \\sqrt{1.62^2 - 1.52^2} = \\sqrt{0.314} = 0.56$. Note that it is the square root of a difference of squares, not the difference of the indices.' },
    { q: 'The light delivered by a fibre-optic "cold light" guide can no longer burn anything.', a: false, why: 'Most infrared is filtered at the lamp, but the visible light of a powerful source can still scorch paper or skin at the tip, and the end of a lit guide is dangerous to look into.' },
    { q: 'Round fibres of 50 µm core in a 55 µm cladding are packed hexagonally. What percentage of the bundle\'s face is core? (Enter the number.)', answer: 75, why: '$0.907\\times(50/55)^2 = 0.75$. The cladding and the gaps between round fibres waste the rest.' },
    { q: 'When the far end of a light guide is lit, a few black dots show on the near end. What are they most likely?', choices: ['Dust on the lamp', 'Broken fibres', 'Fibres with a higher NA', 'The heat filter'], a: 1, why: 'A broken fibre carries no light. Tight bends are the usual cause, and a bundle with many dark dots has lost transmission.' },
    { q: 'A technician needs to deliver ultraviolet near 365 nm to cure an adhesive through a flexible guide. Which guide is the most likely choice?', choices: ['An ordinary glass bundle', 'A plastic fibre bundle', 'A liquid light guide', 'A solid acrylic rod'], a: 2, why: 'Glass bundles absorb strongly in the ultraviolet; plastic does too. Liquid guides transmit from about 300–320 nm and are made for this.' }
  ],
  applications: [
    'Microscope illuminators: goosenecks and ring lights on stereomicroscopes, and the Köhler optics of fibre-fed stands.',
    'Endoscopy and borescopes: a light cable from a lamp house feeds the fibres that surround the viewing channel.',
    'Machine-vision line and ring lights, with the fibre end shaped to a slit or an annulus.',
    'Fluorescence and ultraviolet curing, where a liquid guide carries light from a lamp or an LED to the work.',
    'Dental light-curing units and surgical headlights, where a short guide puts the light where the clinician looks.'
  ],
  history: 'Bundles of glass fibres first carried images in the 1950s, once van Heel and, independently, Hopkins and Kapany had shown that fibres need a cladding (1954), and the first fibre gastroscopes followed in 1957. Bundles used only to carry light were a by-product of the same work, and they replaced lamps at the end of the endoscope.',
  sources: [
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics* — the optical fibre: guiding, numerical aperture, attenuation.',
    'N. S. Kapany, *Fiber Optics: Principles and Applications* (Academic Press, 1967) — bundles for light and images.',
    'M. Bass (ed.), *Handbook of Optics* — the chapters on optical fibres and on fibre bundles.'
  ],
  sim: 'il-light-guide'
},

/* ================================================================ ferrules and light-guide couplings */
{
  id: 'ferrules-and-light-guide-couplings', parent: 'illumination-design', title: 'Ferrules and light-guide couplings', level: 2,
  short: 'The ferrule is the metal sleeve in which the fibres of a light guide are glued and polished into one face. At the lamp it puts the guide at the focus of the lamp\'s image, sets how much light can enter and carries the heat away; at the instrument it plugs into the ring light or the microscope. It is not the ceramic ferrule of a single-fibre connector.',
  keywords: ['ferrule', 'light guide connector', 'light guide adaptor', 'lamp house', 'active diameter', 'ferrule diameter', 'potting epoxy', 'polished face', 'set screw', 'light source socket', 'heat load', 'coupling', 'bundle end', 'adaptor sleeve'],
  prereq: ['fibre-optic-light-guides', 'collecting-and-shaping-light', 'numerical-aperture'],
  related: ['fibre-connectors-and-ferrules', 'coupling-light-into-fibre', 'fibre-bundles-and-image-guides', 'reflectors', 'laser-eye-hazards-and-eyewear', 'periscopes-and-endoscopes'],
  body: `
The loose fibres of a light guide are no use until they are brought together. At each end the thousands of fibres are pressed into a compact group, cast in high-temperature epoxy inside a metal tube and the end ground and polished flat. The tube is the **ferrule** (a ring or cap that binds). It does four jobs: it holds the fibres as one face of known diameter, it *locates* that face in the equipment, it conducts the heat away, and it takes the mechanical wear.

### The light-source end
This end goes into a socket in the lamp house, at the point where the lamp's reflector or condenser focuses its light. What the plug and the socket must get right:

- **Active diameter.** The part of the face that is fibre, typically from about 1 mm up to 10–12 mm; 3, 5 and 8 mm are common. The metal wall and the epoxy ring are not active, so the plug is wider and the face is a bright disc in a dark ring.
- **Position.** The face has to sit in the plane where the lamp's image is smallest, to within a fraction of a millimetre. A shoulder or collar on the ferrule stops it at the right depth; a plug not pushed fully home puts the face in front of the focus, the spot spreads, and light lands on the metal rim.
- **Heat.** A lamp house focuses tens of watts into a spot of a few millimetres: tens of watts per square centimetre. Light that falls on the epoxy or on the metal is absorbed and becomes heat, so the ferrule is metal, the epoxy a high-temperature type, and the lamp house has heat filters and a fan.
- **Retention.** A set screw, collar, bayonet or thread holds the plug in.

### The instrument end
This end plugs into the ring light, the illuminator or the endoscope's light post; its face may be a disc, a ring or a line.

### Adaptors
There is no single worldwide fitting: several families exist, and they differ in the plug's diameter, length and depth and in the way it is locked. An **adaptor sleeve** has a bore for the thinner plug and an outside to fit the wider socket, so a smaller plug can go into a larger socket, never the reverse. It also changes the depth of the face and so the focus, and the lamp must be rated for the guide: the maximum power depends on the lamp house, its filters and the ferrule together. A coupling that joins two guides end to end costs a third or more of the light.

### The other ferrule
In a single-fibre connector the ferrule is a ceramic (zirconia) cylinder with a hole of 125 µm through its centre, of diameter 2.5 mm (SC, FC, ST), 1.25 mm (LC) or 3.175 mm in the metal ferrule of the SMA 905, and it exists to line up two cores of 9 µm to about a micrometre. See [[fibre-connectors-and-ferrules]].

| | Light-guide ferrule | Single-fibre connector ferrule |
|---|---|---|
| Material | metal sleeve with epoxy-potted fibres | zirconia ceramic with a precision bore |
| Holds | thousands of fibres, 1–12 mm active | one fibre of 125 µm cladding |
| Aligned to | the lamp\'s focus, within a fraction of a millimetre | a mating core, within about 1 µm |

> [!warn] The end of a light guide on a bright lamp can burn skin and scorch paper, and the lamp end is hot. Switch the lamp off or to standby before unplugging, let the ferrule cool, and never look into the end of an illuminated guide.

> [!key] The ferrule fixes the active diameter, the position at the lamp\'s focus and the path of the heat. Match its fitting, seat it fully, and make the lamp\'s spot fit the bundle: light that misses the active face heats the ferrule.
`,
  ideas: [
    'A ferrule is the metal sleeve in which the fibres of a guide are potted in epoxy and polished into one face.',
    'At the lamp it sets the active diameter, the position at the focus of the lamp\'s image and the heat path.',
    'Light that falls outside the active face, or outside the acceptance cone, ends up as heat in the epoxy and the metal.',
    'Adaptor sleeves let a thinner plug into a wider socket, never the reverse, and they change the depth of the face.',
    'A light-guide ferrule is aligned to a fraction of a millimetre; a single-fibre connector ferrule to a micrometre.'
  ],
  pitfalls: [
    'A guide fits a lamp house if its active diameter is right — The socket takes the plug\'s outside diameter, depth and locking; the active diameter only says how much light the face can take.',
    'A larger spot gives a brighter guide — A spot larger than the active face wastes the light that falls outside it: with a 5 mm face and an 8 mm spot only 39 % enters and the rest heats the rim.',
    'The ferrule is just a holder — It sets the position of the face, carries the heat, and withstands the plugging; a bent or burnt ferrule is the commonest cause of a dim guide.',
    'A light-guide ferrule is the same part as a fibre-connector ferrule — The two share a name; one aligns thousands of fibres to a lamp, the other a single core to another core with micrometre accuracy.'
  ],
  terms: [
    { term: 'Ferrule', also: ['bundle ferrule', 'light guide ferrule', 'plug'], def: 'The metal sleeve in which the end of a light guide is potted in epoxy and polished. It sets the size of the face, locates it in the equipment and carries heat away.' },
    { term: 'Active diameter', also: ['bundle diameter', 'active area', 'clear diameter'], def: 'The diameter of the part of a light-guide face that is fibre and so carries light, excluding the epoxy ring and the metal wall.' },
    { term: 'Lamp house', also: ['light source housing', 'illuminator box'], def: 'The box that holds the lamp, its reflector or condenser, a heat filter and a fan, and has the socket into which the guide\'s ferrule goes.' },
    { term: 'Adaptor sleeve', also: ['reducing adaptor', 'light guide adaptor'], def: 'A tube with a bore for one plug and an outside to fit a wider socket, used to connect a ferrule to equipment made to another fitting.' },
    { term: 'Potting', also: ['epoxy potting', 'potted end'], def: 'Casting the fibres into a rigid mass of high-temperature epoxy inside the ferrule before polishing, so that they stay together and take heat.' },
    { term: 'Heat load', also: ['thermal load', 'ferrule heating'], def: 'The power absorbed in the ferrule and the face: the light that misses the active area or the acceptance cone, plus what the fibres and epoxy absorb.' }
  ],
  formulas: [
    {
      name: 'Irradiance on the face',
      expr: 'E = P/(pi*d^2/4)', tex: 'E = \\frac{P}{\\pi d^2/4}',
      vars: {
        E: { name: 'irradiance on the spot', q: 'intensity', unit: 'W/cm²' },
        P: { name: 'power in the spot', q: 'power', unit: 'W', value: 20 },
        d: { name: 'diameter of the spot', q: 'length', unit: 'mm', value: 8 }
      },
      note: 'Power spread evenly over a round spot. The power in the spot is what the lamp house delivers after its filters, not the lamp\'s rating.',
      stories: { E: 'A lamp house puts {P} into a spot {d} across. What is the irradiance?' }
    },
    {
      name: 'Share that fits the active face',
      expr: 'ea = (da/ds)^2', tex: '\\eta_a = \\left(\\frac{d_a}{d_s}\\right)^2',
      vars: {
        ea: { name: 'share of the spot on the active face', q: 'ratio', unit: '%', tex: '\\eta_a' },
        da: { name: 'active diameter of the bundle', q: 'length', unit: 'mm', value: 5, tex: 'd_a' },
        ds: { name: 'diameter of the lamp\'s spot', q: 'length', unit: 'mm', value: 8, tex: 'd_s' }
      },
      note: 'For a spot larger than the bundle (otherwise all of it is inside) and an even spot.',
      stories: { ea: 'A bundle with an active diameter of {da} sits in a spot {ds} across. What share of the light is on its fibres?' }
    },
    {
      name: 'Share inside the acceptance cone',
      expr: 'ec = (NA/sin(theta))^2', tex: '\\eta_c = \\left(\\frac{\\mathrm{NA}}{\\sin\\theta}\\right)^2',
      vars: {
        ec: { name: 'share of the light inside the acceptance cone', q: 'ratio', unit: '%', tex: '\\eta_c' },
        NA: { name: 'numerical aperture of the bundle', value: 0.55, min: 0.1, max: 1, tex: '\\mathrm{NA}' },
        theta: { name: 'half-angle of the cone converging on the face', q: 'angle', unit: '°', value: 40, min: 1, max: 89, tex: '\\theta' }
      },
      note: 'For a cone filled in the Lambertian way (equal luminance in all directions) and wider than the acceptance cone. If the cone is narrower, all of it is accepted.',
      stories: { ec: 'A lamp focuses a cone of {theta} half-angle on a bundle of NA {NA}. What share of the light is inside the acceptance cone?' }
    },
    {
      name: 'Heat in the ferrule',
      expr: 'Q = P*(1 - ea*ec)', tex: 'Q = P\\,(1 - \\eta_a\\,\\eta_c)',
      vars: {
        Q: { name: 'power not entering the fibres', q: 'power', unit: 'W' },
        P: { name: 'power in the spot', q: 'power', unit: 'W', value: 20 },
        ea: { name: 'share of the spot on the active face', q: 'ratio', unit: '%', value: 39, min: 0, max: 100, tex: '\\eta_a' },
        ec: { name: 'share inside the acceptance cone', q: 'ratio', unit: '%', value: 100, min: 0, max: 100, tex: '\\eta_c' }
      },
      note: 'An upper bound: the light that is not accepted is absorbed, mostly in the epoxy and the metal of the ferrule. The fibres themselves absorb a little more.',
      stories: { Q: 'A lamp puts {P} into a spot of which {ea} lies on the active face and {ec} is inside the acceptance cone. How much power heats the ferrule?' }
    }
  ],
  examples: [
    {
      title: 'A spot that does not fit',
      q: 'A lamp house puts 20 W into an even spot 8 mm across, converging in a cone of ±30°. A guide with an active diameter of 5 mm and NA 0.55 is plugged in. How much enters, how much heats the ferrule, and what happens if the spot is refocused to 5 mm?',
      steps: [
        { text: 'The face receives $(5/8)^2 = 39\\ \\%$ of the spot. The cone ($\\sin 30° = 0.5$) is inside the acceptance cone ($\\mathrm{NA} = 0.55$), so all of that light is accepted.' },
        { text: 'The power entering is $20\\times 0.39 = 7.8$ W, and the heat load is', tex: 'Q = 20\\ \\mathrm{W}\\times(1 - 0.39\\times 1) = 12.2\\ \\mathrm{W}' },
        'Refocused to 5 mm, the whole 20 W is on the face: the irradiance there is $20/0.196 = 100$ W/cm², against 40 W/cm² over the 8 mm spot.'
      ],
      a: '7.8 W enters and 12.2 W heats the rim; refocused, 20 W enters and the rim stays cool, but the face itself must stand about 100 W/cm². Always check the maker\'s maximum lamp power.'
    },
    {
      title: 'A cone that is too wide',
      q: 'A faster condenser makes the cone converging on a guide of NA 0.55 equal to ±45°. What share of the light is accepted if the cone is filled evenly in the Lambertian way?',
      steps: [
        { text: 'The cone has $\\sin 45° = 0.707$, wider than the NA of 0.55:', tex: '\\eta_c = \\left(\\frac{0.55}{0.707}\\right)^2 = 0.61' }
      ],
      a: '61 %: the other 39 % falls outside the acceptance cone and is lost, mostly as heat in the ferrule. A faster condenser does not pay unless the guide\'s NA can take it.'
    }
  ],
  quiz: [
    { q: 'What does the ferrule at the lamp end of a light guide NOT do?', choices: ['Hold the fibres as one polished face', 'Locate the face at the focus of the lamp\'s image', 'Carry heat away from the face', 'Align two single-mode cores to a micrometre'], a: 3, why: 'Micrometre core alignment is the job of the ceramic ferrule of a single-fibre connector. A light-guide ferrule is aligned to a fraction of a millimetre.' },
    { q: 'A guide with a 3 mm active diameter will plug into any lamp house whose socket is made for a 3 mm bundle.', a: false, why: 'The socket takes the ferrule\'s outside diameter, length and locking, which differ between makers and families of fittings; the active diameter says how much light the face can take.' },
    { q: 'A lamp\'s spot is 10 mm across and a guide with an active diameter of 5 mm sits in it. What percentage of the spot\'s light lands on the active face? (Enter the number.)', answer: 25, why: '$(5/10)^2 = 0.25$. The other 75 % hits the epoxy, the metal and the lamp-house wall and becomes heat.' },
    { q: 'Which adaptation is possible with an adaptor sleeve?', choices: ['A thin plug into a wide socket', 'A thick plug into a narrow socket', 'Both', 'Neither'], a: 0, why: 'A sleeve fills the gap between a thinner plug and a wider socket. A plug larger than the socket will not go in; the instrument would have to be changed.' },
    { q: 'The metal of a light-guide ferrule gets much hotter than before. Which is the most likely reason?', choices: ['The guide is longer', 'The lamp\'s spot is larger than the active face or the plug is not seated at the focus', 'The fibres have a higher NA', 'The room is warmer'], a: 1, why: 'Light that misses the active face falls on the epoxy and the metal. A plug not pushed home puts the face off focus, and the spot spreads.' }
  ],
  applications: [
    'Microscope fibre illuminators: a plug at the lamp house and a gooseneck, ring light or line light at the specimen.',
    'Endoscopy: the light cable\'s plug goes in the light source and its other end onto the light post of the scope.',
    'Machine-vision line and ring lights fed from a remote lamp house with a standard bundle diameter.',
    'Fluorescence and curing systems with liquid guides, whose metal ferrules take the heat of arc lamps and high-power LEDs.',
    'Surgical headlight and inspection (borescope) light sources, where the plug and the socket must be keyed and locked.'
  ],
  sources: [
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics* — fibre bundles, numerical aperture and coupling.',
    'IEC 61754, *Fibre optic connector interfaces* (series) — the single-fibre ferrules and their dimensions, for comparison.',
    'IEC 60601-2-18, *Medical electrical equipment — Particular requirements for endoscopic equipment* — safety requirements for endoscopic light sources and cables.'
  ],
  sim: 'il-ferrule'
},

/* ================================================================ Fresnel lenses */
{
  id: 'fresnel-lenses', parent: 'illumination-design', title: 'Fresnel lenses', level: 1,
  short: 'A Fresnel lens keeps only the curved surface of a lens, cut into concentric steps, and throws away the glass between them. It is a fraction of the thickness and weight of the lens it replaces, at the price of stray light from the steps and a coarser image. Lighthouses, spotlights, overhead projectors and thin magnifiers all use it.',
  keywords: ['Fresnel lens', 'stepped lens', 'groove', 'facet', 'pitch', 'draft angle', 'lighthouse lens', 'spotlight lens', 'overhead projector', 'thin lens', 'concentric rings', 'zone plate', 'solar concentrator'],
  prereq: ['collecting-and-shaping-light', 'lens-shapes-and-names', 'refraction-at-a-curved-surface'],
  related: ['the-lighthouse-lens', 'projector-illumination', 'fresnel-diffraction-and-zone-plates', 'flashlights-and-headlamps', 'concentrating-light', 'catalogue-lens-types', 'lensmakers-formula', 'diffractive-optical-elements'],
  body: `
A lens bends light only at its two surfaces; the glass between them merely carries the ray. At each radius the thing that matters is the *slope* of the curved surface. A **Fresnel lens** cuts the surface into narrow concentric rings, gives each ring the slope the solid lens would have at that radius, and brings every ring back to the same thickness. The result is a thin sheet with a sawtooth on one face.

### The facet angle
Take a lens of index $n$ with parallel light entering its flat side and the grooved side facing the focus at distance $f$. The facet at radius $r$ must have the slope

$$\\tan\\alpha = \\frac{r}{n\\sqrt{r^2+f^2} - f}$$

to bend the ray at that radius exactly to the focus. Near the axis it reduces to $\\alpha \\approx r/((n-1)f)$, the slope of the equivalent plano-convex surface; farther out the facets are slightly *less* steep than a sphere would be, so a Fresnel lens behaves like an aspheric lens. For $f = 100$ mm and acrylic ($n = 1.49$):

| Radius $r$ | 10 mm | 20 mm | 30 mm | 40 mm | 50 mm |
|---|---|---|---|---|---|
| Facet slope $\\alpha$ | 11.4° | 21.1° | 28.4° | 33.5° | 36.9° |

The depth of a groove of pitch $p$ is $h = p\\tan\\alpha$: a 0.5 mm groove at $r = 40$ mm is 0.33 mm deep.

### What it saves
Make a lens with $f = 150$ mm and diameter 100 mm of acrylic. The solid plano-convex lens has a radius of curvature $R = (n-1)f = 73.5$ mm, so at the rim the surface is $R - \\sqrt{R^2 - 50^2} = 19.6$ mm higher than at the edge: with a 2 mm rim it is 21.6 mm thick and weighs about 115 g. The Fresnel version, a 2 mm sheet with 0.5 mm grooves, weighs about 20 g — six times less, a tenth the thickness, and far cheaper to mould.

### What it costs
- **Stray light.** Each groove has a steep *riser* face, ideally parallel to the axis, and a rounded tip. Light that meets them goes the wrong way. A good lens passes about 80–90 % of the light, a plain sheet of the same plastic about 92 %.
- **Resolution.** Each facet is a flat prism. It cannot focus: all the light that passes through one ring leaves in one direction, so a point is smeared over about the pitch. Imaging lenses (magnifiers, 0.1–0.5 mm pitch) are fine-grooved; lenses for light (stage lanterns, lighthouses) have grooves of several millimetres.
- **Colour.** A facet is also a prism, so a Fresnel lens has strong chromatic aberration. Harmless for light, serious for pictures.
- **Materials.** Moulded or pressed acrylic or polycarbonate, up to a few hundred millimetres across; pressed glass (borosilicate) for lamps and lighthouses. Acrylic softens at about 80–90 °C.

### Fresnel lens and zone plate
A *zone plate* is also named after Fresnel, but works by diffraction, with rings a few wavelengths in height; a Fresnel lens works by refraction, with grooves a thousand times larger. See [[fresnel-diffraction-and-zone-plates]].

> [!key] A Fresnel lens is a lens with the useless thickness cut away: every ring keeps the slope of the solid lens at its radius, tan α = r/(n√(r²+f²) − f). It is thin, light and good for lighting, but each ring smears the image and the steps scatter light.
`,
  ideas: [
    'A Fresnel lens divides the curved surface into rings and returns each ring to the same thickness: the slopes are kept, the glass between them is not.',
    'The facet slope at radius r is tan α = r/(n√(r²+f²) − f); near the axis it equals that of a plano-convex lens.',
    'Thickness and weight fall by a factor of five to ten, but each facet is a flat prism, so the image is smeared by about the pitch.',
    'The risers and the rounded tips scatter light: a good lens passes 80–90 %.',
    'A refractive Fresnel lens and a diffractive zone plate are different devices that share a name.'
  ],
  pitfalls: [
    'A Fresnel lens is as good as a normal lens of the same focal length — It is lighter and thinner, but each ring smears a point by about the pitch, the colour error is large and the steps scatter light.',
    'The grooves are tiny because the lens is thin — The depth of a groove is the pitch times the tangent of the facet slope, so coarse grooves (several millimetres) are common in lights and lighthouses.',
    'Any Fresnel lens works either way round — The facet slopes are cut for one arrangement of the flat side and the grooved side; turned round, the lens is out of focus and has more stray light.',
    'A Fresnel lens and a zone plate are the same thing — One refracts through steps of the order of a millimetre; the other diffracts through rings a few wavelengths high.'
  ],
  terms: [
    { term: 'Fresnel lens', also: ['stepped lens', 'Fresnel sheet'], def: 'A lens whose surface is divided into concentric rings, each with the slope of the equivalent solid lens at that radius but all of the same thickness, making a thin, light sheet.' },
    { term: 'Facet', also: ['groove face', 'active face'], def: 'The sloping surface of one ring of a Fresnel lens, which does the refracting. Its slope depends on the radius.' },
    { term: 'Pitch', also: ['groove pitch', 'groove spacing'], def: 'The radial width of one ring of a Fresnel lens, from 0.1 mm for imaging lenses to several millimetres for lights.' },
    { term: 'Riser', also: ['draft face', 'draft angle'], def: 'The steep side of a groove, which does not refract usefully. It should be parallel to the axis; its departure from it, the draft angle, steals light and makes stray light.' },
    { term: 'Zone plate', also: ['Fresnel zone plate'], def: 'A plate with concentric rings that focuses by diffraction rather than refraction; its rings are of the order of a wavelength in height.' }
  ],
  formulas: [
    {
      name: 'Facet slope at a radius',
      expr: 'alpha = atan(r/(n*sqrt(r^2 + f^2) - f))', tex: '\\alpha = \\arctan\\frac{r}{n\\sqrt{r^2 + f^2} - f}',
      vars: {
        alpha: { name: 'slope of the facet', q: 'angle', unit: '°', tex: '\\alpha' },
        r: { name: 'radius of the ring', q: 'length', unit: 'mm', value: 40 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 },
        n: { name: 'refractive index', value: 1.49, min: 1.1, max: 2.5 }
      },
      note: 'Parallel light enters the flat side; the grooved side faces the focus. Ideal facets, with no draft.',
      stories: { alpha: 'A Fresnel lens of focal length {f} and index {n} is cut so that the ring at radius {r} focuses exactly. What slope does that facet have?' }
    },
    {
      name: 'Depth of a groove',
      expr: 'h = p*tan(alpha)', tex: 'h = p\\,\\tan\\alpha',
      vars: {
        h: { name: 'depth of the groove', q: 'length', unit: 'µm' },
        p: { name: 'pitch', q: 'length', unit: 'mm', value: 0.5 },
        alpha: { name: 'slope of the facet', q: 'angle', unit: '°', value: 33.5, min: 0, max: 80, tex: '\\alpha' }
      },
      note: 'The sawtooth: the surface falls by this much across one ring.',
      stories: { h: 'A Fresnel lens has a pitch of {p} and a facet slope of {alpha} at a radius. How deep is the groove there?' }
    },
    {
      name: 'Radius of the equivalent plano-convex lens',
      expr: 'R = (n - 1)*f', tex: 'R = (n - 1)\\,f',
      vars: {
        R: { name: 'radius of curvature of the equivalent solid lens', q: 'length', unit: 'mm' },
        n: { name: 'refractive index', value: 1.49, min: 1.1, max: 2.5 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 150 }
      },
      note: 'The lensmaker\'s equation for a plano-convex lens in air, thin-lens approximation.',
      stories: { R: 'A solid plano-convex lens of index {n} must have a focal length of {f}. What is the radius of its curved face?' }
    },
    {
      name: 'Thickness removed at the rim',
      expr: 's = R - sqrt(R^2 - r^2)', tex: 's = R - \\sqrt{R^2 - r^2}',
      vars: {
        s: { name: 'sag: how much thicker the middle is than the rim', q: 'length', unit: 'mm' },
        R: { name: 'radius of curvature', q: 'length', unit: 'mm', value: 73.5 },
        r: { name: 'half-diameter of the lens', q: 'length', unit: 'mm', value: 50 }
      },
      note: 'The glass a Fresnel lens dispenses with: the sag of the solid lens at its rim.',
      stories: { s: 'A solid lens with a curved face of radius {R} is {r} in radius. How much thicker is its centre than its rim?' }
    }
  ],
  examples: [
    {
      title: 'The slope of a ring',
      q: 'A Fresnel collimator for a lamp has a focal length of 100 mm and is moulded in acrylic ($n = 1.49$). What slope must the facet at a radius of 40 mm have, and how deep is a groove of 0.5 mm pitch there?',
      steps: [
        { text: 'First $\\sqrt{r^2+f^2} = \\sqrt{1600 + 10\\,000} = 107.7$ mm, so', tex: '\\tan\\alpha = \\frac{40}{1.49\\times 107.7 - 100} = \\frac{40}{60.5} = 0.661' },
        'That is $\\alpha = 33.5°$, against 39° for a spherical plano-convex surface at that radius.',
        { text: 'The depth of the groove:', tex: 'h = 0.5\\ \\mathrm{mm}\\times 0.661 = 0.33\\ \\mathrm{mm}' }
      ],
      a: '33.5° and 0.33 mm. The facets get steeper with radius, but less quickly than a sphere: that is what makes the lens behave like an asphere.'
    },
    {
      title: 'What the lens saves',
      q: 'A 100 mm diameter lens of 150 mm focal length is to be made in acrylic ($n = 1.49$, density 1.19 g/cm³). Compare the solid plano-convex lens with a Fresnel sheet 2 mm thick.',
      steps: [
        { text: 'The curved face has $R = (n-1)f = 0.49\\times 150 = 73.5$ mm. At the rim, 50 mm from the axis, the sag is', tex: 's = 73.5 - \\sqrt{73.5^2 - 50^2} = 19.6\\ \\mathrm{mm}' },
        'The solid lens with a 2 mm rim has a volume of about 97 cm³, a mass of about 115 g and a thickness of 21.6 mm.',
        'The Fresnel sheet has about 16.5 cm³ — 20 g — and a thickness of 2 mm plus the groove depth.'
      ],
      a: 'About 115 g and 21.6 mm against 20 g and about 2.3 mm: six times lighter and a tenth as thick.'
    }
  ],
  quiz: [
    { q: 'Why is a Fresnel lens so much thinner and lighter than the ordinary lens with the same focal length?', choices: ['It is made of a lighter material', 'It omits the glass between the refracting surfaces and keeps only their slopes', 'It uses diffraction instead of refraction', 'It has a shorter focal length'], a: 1, why: 'A lens bends light only at its surfaces. Cutting the surface into rings and returning each to the same thickness keeps the slopes and drops the bulk.' },
    { q: 'A Fresnel lens forms as sharp an image as a good glass singlet of the same focal length and diameter.', a: false, why: 'Each ring is a flat prism that sends all the light through it in one direction, smearing a point by about the pitch, and the steps scatter light and add colour. Fresnel lenses are for lighting and for coarse imaging.' },
    { q: 'What slope should the facet of an acrylic ($n = 1.49$) Fresnel lens of focal length 100 mm have at a radius of 40 mm? (Degrees.)', answer: 33.5, why: '$\\tan\\alpha = 40/(1.49\\times 107.7 - 100) = 0.661$, so $\\alpha = 33.5°$.' },
    { q: 'What is the difference between a Fresnel lens and a Fresnel zone plate?', choices: ['Nothing: they are two names for one device', 'The lens refracts through steps of about a millimetre; the zone plate diffracts through rings a few wavelengths high', 'The zone plate is made of glass and the lens of plastic', 'The lens has a longer focal length'], a: 1, why: 'The Fresnel lens is a refractive device whose rings keep the slope of a lens surface. The zone plate focuses by diffraction.' },
    { q: 'A designer wants a Fresnel magnifier to give a sharper image. Which change helps most?', choices: ['A finer groove pitch', 'A thicker sheet', 'A larger groove depth', 'A darker plastic'], a: 0, why: 'The smear of a point is about the pitch, so finer grooves resolve more. The pitch cannot fall without limit: the rounded tips take a larger share of the area, and diffraction grows.' }
  ],
  applications: [
    'Lighthouses: the lens that gave the lights their reach, for the first time with a large aperture without enormous thickness.',
    'Stage Fresnel lanterns: a stepped lens and a movable lamp give a soft-edged beam from flood to spot.',
    'Overhead projectors and rear-projection screens: a large Fresnel lens under the stage or over the screen makes the light converge towards the lens or the viewer.',
    'Thin magnifiers and wide-angle rear-window stick-on lenses, and the focusing screens of single-lens reflex cameras.',
    'Solar concentrators and cookers, and the ridged domes of infrared motion sensors.'
  ],
  history: 'The comte de Buffon described a lens ground in steps in 1748 and Condorcet in 1773, but a stepped lens could not be cut in one piece of glass. Augustin Fresnel proposed it for lighthouses in 1822 (it was a large-aperture, thin lens built up of separate prisms), and the first Fresnel lens was lit at the Cordouan lighthouse in 1823. It became the standard optic of lighthouses for more than a century. Pressed and then moulded plastic sheets brought the idea into the everyday world in the 20th century.',
  sources: [
    'A. Fresnel, *Mémoire sur un nouveau système d\'éclairage des phares* (1822) — the lighthouse lens.',
    'R. Winston, J. C. Miñano and P. Benítez, *Nonimaging Optics* (Elsevier, 2005) — Fresnel lenses as concentrators and collimators.',
    'E. Hecht, *Optics* — the lens and the refraction at a spherical surface.'
  ],
  sim: 'il-fresnel'
},

/* ================================================================ projector illumination */
{
  id: 'projector-illumination', parent: 'illumination-design', title: 'Illumination in projectors', level: 2,
  short: 'A projector\'s lamp or LED feeds a chain: collector, integrator, relay, light valve and projection lens. The panel accepts only a small étendue (its area times the cone of its f-number), so the lumens at the screen are set by the source\'s luminance times that étendue, not by the lamp\'s watts.',
  keywords: ['projector illumination', 'integrator', 'fly\'s-eye', 'light valve', 'DLP', 'LCD', 'LCoS', 'étendue limit', 'lumens', 'ANSI lumens', 'arc lamp', 'LED projector', 'laser phosphor', 'screen luminance', 'relay lens'],
  prereq: ['collecting-and-shaping-light', 'light-pipes-and-homogenizers', 'etendue'],
  related: ['the-data-projector', 'projectors', 'reflectors', 'condensers-and-kohler-illumination', 'xenon-arc-and-flash-lamps', 'high-intensity-discharge-lamps', 'lumens-candelas-lux-and-nits', 'spatial-light-modulators', 'microlens-arrays', 'lambertian-surfaces'],
  body: `
A projector looks like a lamp with a lens, but the lamp's job is the hard part. The light has to reach a panel a centimetre wide, evenly, from the right directions, and then pass through a lens that accepts only a narrow cone.

### The chain
lamp or LED → **collector** (a reflector or lenses) → colour (a wheel, dichroic mirrors or a phosphor) → **integrator** (a rod or a pair of lens arrays, [[light-pipes-and-homogenizers]]) → **relay lens** → **light valve** (an LCD panel, a micromirror chip or an LCoS panel) → **projection lens** → screen.

Every stage has an étendue, and the *smallest one* sets the lumens: light that does not fit is lost at that stage, whatever came before.

### The panel is the bottleneck
A panel of area $A_p$ behind a projection lens of f-number $N$ accepts rays inside a cone with $\\sin\\theta \\approx 1/(2N)$, so

$$G_p = \\frac{\\pi A_p}{4N^2}$$

A 15 mm × 9 mm panel at f/2.4 has $G_p = 18$ mm²·sr, the same as the light guide on the first page of this topic (the micromirrors of many digital-light-processing chips tilt ±12°, which is f/2.4). To use that étendue the source must supply light from an area and a cone that together fit inside it — and no more.

### The lumen limit
For a source of luminance $L$ (candelas per square metre) the flux that can enter an étendue $G$ is

$$\\Phi_{max} = L\\,G$$

because no optics can raise the luminance ([[radiance-and-its-conservation]]). With $G = 1.84\\times10^{-5}$ m²·sr:

| Source | Luminance (typical) | Largest flux into the panel above | Seen in |
|---|---|---|---|
| White LED die | about $10^7$ cd/m² | about 180 lm | pocket and mini projectors: 100–1000 lm |
| Short-arc discharge lamp | of the order of $10^8$ cd/m² | about 3700 lm | data projectors: 2000–6000 lm |
| Tungsten filament | about $10^7$ cd/m² | about 180 lm | old slide projectors with small panels |

An LED projector is dim not because the LED is feeble but because its luminance is low: a larger LED, or more of them, would add area that the panel cannot accept. A discharge lamp with an arc about a millimetre long is a *brighter* source, with 10–30 times the luminance, and fills the same panel with far more light. Laser-pumped phosphor sources sit between: a small, bright spot with a long life.

### The integrator and the relay
The integrator turns the lamp's lumpy image into a uniform rectangle with the aspect ratio of the panel; the relay lens images the integrator's exit face onto the panel. If the rod is too big for the panel, light is wasted outside it; if its cone is wider than the projection lens accepts, the surplus is stopped at the pupil. Matching them means making the integrator's area-times-cone equal to the panel's.

### From lumens to the screen
The lumens (an *ANSI lumen* is the average of nine points) fall on the screen area. Illuminance $E = \\Phi/A$; a matt white screen of gain $\\rho$ shows a luminance $L = E\\rho/\\pi$. For a 2 m × 1.125 m screen: 1000 lm gives 444 lx, and 141 cd/m² on a screen of gain 1 — in a dark room, comfortably bright (cinema standards ask for about 48 cd/m²); in an office with 300 lx of ambient light, the black of the picture glows and 3000 lm is needed.

> [!key] The panel accepts the étendue G = πA/(4N²), so the flux at the screen is at most the source\'s luminance times G. Bright, small sources (arcs) fill the panel with light; large, dim ones (LEDs) cannot, however many watts they dissipate.
`,
  ideas: [
    'A projector is a chain: collector, integrator, relay, light valve, projection lens. The smallest étendue in the chain sets the lumens.',
    'The panel and the projection lens accept the étendue G = πA/(4N²).',
    'No optics can raise luminance, so the flux through the panel is at most L × G.',
    'LED sources are low in luminance and so give hundreds of lumens; arc lamps, with ten or more times the luminance, give thousands.',
    'The integrator evens the field and gives it the shape of the panel; the screen luminance is E ρ/π.'
  ],
  pitfalls: [
    'More lamp watts mean more lumens at the screen — Only up to the étendue limit: past it the extra light is blocked at the panel or the lens, and only heats the projector.',
    'A larger LED chip makes a brighter projector — The panel can only accept a fixed étendue, so adding emitting area adds light the optics cannot use; luminance is what counts.',
    'A faster projection lens (a smaller f-number) never helps — It raises the accepted étendue, so more of the lamp\'s light can enter, but the integrator and the panel (for example the tilt of the micromirrors) must supply and accept the wider cone.',
    'The screen\'s brightness depends only on the lumens — It depends on the lumens per area, and on the screen\'s gain and the room\'s ambient light that lifts the black level.'
  ],
  terms: [
    { term: 'Light valve', also: ['imager', 'panel', 'spatial light modulator'], def: 'The panel that forms the picture by controlling the light pixel by pixel: an LCD, an LCoS chip or a micromirror chip.' },
    { term: 'Integrator', also: ['integrating rod', 'light tunnel', 'fly\'s-eye integrator'], def: 'The element, a rod, a tunnel or a pair of lenslet arrays, that evens out the light and shapes it to the panel\'s aspect ratio.' },
    { term: 'Relay lens', also: ['relay optics'], def: 'The lens that images the integrator\'s exit face onto the light valve, at the required size and with the right cone of light.' },
    { term: 'ANSI lumen', also: ['ANSI lumens', 'projector lumens'], def: 'The standard measure of a projector\'s light output: the screen is divided into nine zones, the illuminance in each is measured, and the average times the screen area is the flux.' },
    { term: 'Étendue limit', also: ['throughput limit', 'étendue-limited'], def: 'The ceiling on the light through a system set by the smallest étendue in the chain: a source that is larger or wider than the panel can accept loses the excess.' },
    { term: 'Gain (screen)', also: ['screen gain'], def: 'The ratio of the luminance of a projection screen, seen from the front, to that of a perfectly diffusing white surface under the same light. Matt white is about 1.' }
  ],
  formulas: [
    {
      name: 'Étendue of a panel and lens',
      expr: 'G = pi*A/(4*N^2)', tex: 'G = \\frac{\\pi A}{4N^2}',
      vars: {
        G: { name: 'étendue accepted', q: false, unit: 'mm²·sr' },
        A: { name: 'area of the panel', q: false, unit: 'mm²', value: 135 },
        N: { name: 'f-number of the projection lens', value: 2.4, min: 0.7, max: 8 }
      },
      note: 'Small-angle form, sin θ ≈ 1/(2N); in air.',
      stories: { G: 'A panel of {A} sits behind a lens of f/{N}. What étendue does it accept?' }
    },
    {
      name: 'Largest flux through the étendue',
      expr: 'Phi = L*G/1e6', tex: '\\Phi_{max} = L\\,G',
      vars: {
        Phi: { name: 'largest luminous flux', q: 'luminousflux', unit: 'lm', tex: '\\Phi_{max}' },
        L: { name: 'luminance of the source', q: 'luminance', unit: 'cd/m²', value: 1e7 },
        G: { name: 'étendue of the panel and lens', q: false, unit: 'mm²·sr', value: 18.4 }
      },
      note: 'A ceiling set by the conservation of luminance; real projectors reach perhaps half of it. G is entered in mm²·sr and converted to m²·sr.',
      stories: { Phi: 'A source of luminance {L} feeds a panel and lens with an étendue of {G}. What is the most light that can reach the screen?' }
    },
    {
      name: 'Illuminance on the screen',
      expr: 'E = Phi/A', tex: 'E = \\frac{\\Phi}{A}',
      vars: {
        E: { name: 'illuminance on the screen', q: 'illuminance', unit: 'lx' },
        Phi: { name: 'luminous flux on the screen', q: 'luminousflux', unit: 'lm', value: 1000, tex: '\\Phi' },
        A: { name: 'area of the picture', q: 'area', unit: 'm²', value: 2.25 }
      },
      note: 'Lumens divided by area; ambient light adds to it.',
      stories: { E: 'A projector of {Phi} lights a picture of {A}. What is the illuminance?' }
    },
    {
      name: 'Luminance of a matt screen',
      expr: 'L = E*rho/pi', tex: 'L = \\frac{E\\,\\rho}{\\pi}',
      vars: {
        L: { name: 'luminance of the screen', q: 'luminance', unit: 'cd/m²' },
        E: { name: 'illuminance', q: 'illuminance', unit: 'lx', value: 444 },
        rho: { name: 'screen gain (1 for a perfectly diffusing white)', value: 1, min: 0.1, max: 3, tex: '\\rho' }
      },
      note: 'For a Lambertian screen of gain ρ, seen from the front.',
      stories: { L: 'A screen of gain {rho} receives {E}. What luminance does it show?' }
    }
  ],
  examples: [
    {
      title: 'Why LED projectors are dim',
      q: 'A projector panel of 15 mm × 9 mm sits behind an f/2.4 lens. A white LED die has a luminance of $10^7$ cd/m². What is the most light that can go through, and what would an arc lamp of $2\\times 10^8$ cd/m² give?',
      steps: [
        { text: 'The étendue: $G = \\pi\\times 135/(4\\times 2.4^2) = 18.4$ mm²·sr $= 1.84\\times10^{-5}$ m²·sr.' },
        { text: 'The LED:', tex: '\\Phi_{max} = 10^7\\times 1.84\\times 10^{-5} = 184\\ \\mathrm{lm}' },
        { text: 'The arc lamp:', tex: '\\Phi_{max} = 2\\times 10^8\\times 1.84\\times 10^{-5} = 3680\\ \\mathrm{lm}' }
      ],
      a: 'About 180 lm and 3700 lm. Real optics reach perhaps half of that, which matches the 100–500 lm of LED mini-projectors and the 2000–4000 lm of arc-lamp data projectors.'
    },
    {
      title: 'Is 1000 lumens enough?',
      q: 'A 1000 lm projector throws a 16:9 picture 2 m wide (2 m × 1.125 m) on a matt white screen of gain 1. What is the screen luminance in a dark room, and what does 300 lx of ambient light do?',
      steps: [
        { text: 'The picture area is 2.25 m², so', tex: 'E = \\frac{1000}{2.25} = 444\\ \\mathrm{lx} \\qquad L = \\frac{444}{\\pi} = 141\\ \\mathrm{cd/m^2}' },
        'Ambient light of 300 lx adds the same amount to black and to white: a black screen shows $300/\\pi = 95$ cd/m², so the contrast between white and black falls to $(141+95)/95 = 2.5:1$.'
      ],
      a: '141 cd/m² in the dark, but with 300 lx of ambient light a contrast of only about 2.5:1. A bright room needs three or four times the lumens, or a screen that rejects ambient light.'
    }
  ],
  quiz: [
    { q: 'Which determines how many lumens a projector can put on the screen, other things being equal?', choices: ['The wattage of its lamp', 'The luminance of the source times the étendue of the panel and lens', 'The weight of the projector', 'The number of pixels'], a: 1, why: 'Luminance cannot be raised by any optics, so the flux through the panel is at most L × G, however many watts the lamp takes.' },
    { q: 'A panel of 135 mm² behind an f/4 lens accepts more étendue than the same panel behind an f/2.4 lens.', a: false, why: '$G = \\pi A/(4N^2)$ falls as the f-number rises: a slower lens (f/4) accepts a narrower cone, about a third of the étendue of f/2.4.' },
    { q: 'A panel of 100 mm² sits behind an f/2 lens. What étendue does it accept, in mm²·sr? (Enter the number.)', answer: 19.6, why: '$G = \\pi\\times 100/(4\\times 4) = 19.6$ mm²·sr.' },
    { q: 'Why does an arc lamp give a brighter projector than an LED of the same electrical power?', choices: ['It is hotter', 'It has a much higher luminance, so more light fits into the panel\'s étendue', 'It is more efficient', 'It is whiter'], a: 1, why: 'The arc is a small, bright source whose étendue fits the panel and fills it with light; an LED of the same power spreads the light over a larger area with lower luminance.' },
    { q: 'A screen of gain 1 is lit with 400 lx. What luminance does it have, in cd/m²? (Enter the number.)', answer: 127, why: '$L = E\\rho/\\pi = 400/\\pi = 127$ cd/m².' }
  ],
  applications: [
    'Data and home-cinema projectors, whose lamps, LEDs or laser-phosphor sources are matched to a small panel.',
    'Cinema projectors, with xenon arcs and large panels, where tens of thousands of lumens are fed through an integrator.',
    'Slide and film projectors, with a condenser that images the lamp in the projection lens.',
    'Photolithography and exposure systems, in which a fly\'s-eye integrator evens the illumination of a mask.',
    'Head-up and head-mounted displays, whose small panels and eye boxes impose a strict étendue budget.'
  ],
  sources: [
    'R. Winston, J. C. Miñano and P. Benítez, *Nonimaging Optics* (Elsevier, 2005) — étendue in projection systems.',
    'ISO 21118, *Information technology — Office equipment — Information to be included in specification sheets — Data projectors* — how projector output is measured and stated.',
    'E. H. Stupp and M. S. Brennesholtz, *Projection Displays* (Wiley) — light sources, integrators and light valves.'
  ],
  sim: 'il-projector'
},

/* ================================================================ torches and headlamps */
{
  id: 'flashlights-and-headlamps', parent: 'illumination-design', title: 'Torches, spotlights and headlamps', level: 1,
  short: 'A torch spends its lumens on a cone: the narrower the cone, the higher the candela and the farther the beam reaches. A reflector gives a hot spot with spill, a TIR lens a smoother beam, and a car\'s dipped headlamp images the edge of a shield on the road as a sharp cut-off.',
  keywords: ['flashlight', 'torch', 'headlamp', 'spotlight', 'TIR lens', 'reflector', 'beam angle', 'candela', 'beam distance', 'hot spot', 'spill', 'cut-off', 'dipped beam', 'low beam', 'high beam', 'ANSI FL1', 'throw'],
  prereq: ['reflectors', 'lumens-candelas-lux-and-nits', 'light-emitting-diodes'],
  related: ['car-headlamps-and-driver-cameras', 'collecting-and-shaping-light', 'glare-and-uniformity', 'fresnel-lenses', 'inverse-square-and-cosine-laws', 'white-leds', 'lambertian-surfaces', 'laser-eye-hazards-and-eyewear'],
  body: `
A torch is the same trade as every other illuminator: a fixed amount of light, and a choice of where to put it. Spread over a wide cone it lights a room; squeezed into a narrow one it reaches a distant tree.

### Two ways to collect an LED
An LED radiates forwards into a hemisphere; a collimator has to catch the sideways light as well, because only 25 % of the flux lies within 30° of the axis ([[collecting-and-shaping-light]]).

- A **reflector** (a paraboloid around the LED, smooth or "orange-peel" textured) catches the high-angle light and sends it forward. The LED's central light goes straight out *uncollimated*, so the beam has a **hot spot** (the reflected light, a small bright disc) surrounded by **spill** (the direct light).
- A **TIR lens** is a moulded plastic collimator: a lens in the middle for the forward light and a conical outer surface that reflects the sideways light by total internal reflection. It catches 85–90 % of the flux, needs no mirror coating and gives a smoother beam; a pitted or lenslet-covered surface blends the edges.

A *zoom* torch moves the LED relative to the optics: at the focus the beam is narrow; pulled away, a flood.

### Candela, lumen and the distance a torch reaches
The luminous intensity of an even cone of half-angle $\\theta$ is the flux divided by its solid angle:

$$I = \\frac{\\Phi}{2\\pi\\,(1 - \\cos\\theta)}$$

500 lm in a half-angle of 10° is $5200$ cd; in 30°, 594 cd. The illuminance on a surface at distance $d$ is $E = I/d^2$, and the standard way to quote a torch's reach (ANSI/NEMA FL1) is the **beam distance**, where the beam's centre falls to 0.25 lx, about the light of a full moon:

$$d = \\sqrt{\\frac{I}{0.25\\ \\mathrm{lx}}} = 2\\sqrt{I}$$

| Torch | Flux (typical) | Peak intensity | Beam distance |
|---|---|---|---|
| Keyring | 10–50 lm | 50–300 cd | 14–35 m |
| Pocket, one AA cell | 100–300 lm | 1000–5000 cd | 63–140 m |
| Search torch | 1000–3000 lm | 20 000–100 000 cd | 280–630 m |

Hold the lumens fixed and change the angle: halving the half-angle roughly *quadruples* the candela and doubles the reach.

### The headlamp and its cut-off
A car must light the road ahead without dazzling oncoming drivers. The **dipped (low) beam** is shaped so that nearly all of it falls *below* a line. Two designs do it: a reflector made of segments, each aimed to build the pattern, or a **projector** headlamp, in which an elliptical reflector images the lamp at its second focus, a metal **shield** hides the upper half of that image, and a lens projects the shield's edge onto the road as a sharp **cut-off**. Where traffic drives on the right the cut-off rises on the kerb side by about 15° to light the verge and the signs, and it is aimed slightly downwards (a "dip" of about one per cent in many countries) so that the cut-off falls below the eyes of oncoming drivers. A halogen H7 bulb is rated at 1500 lm; the dipped beam typically lights the road for 50–70 m, the main beam well over 100 m.

> [!warn] Powerful torches and headlamps dazzle: an LED torch of several thousand candela can leave a person unable to see for seconds. Never shine one into someone\'s eyes, at drivers, riders or aircraft, and use the dipped beam when others approach.

> [!key] A torch gives I = Φ/Ω in candela and reaches d = 2√I metres; a narrower beam is brighter and reaches farther at the same lumens. A reflector gives hot spot and spill, a TIR lens a smoother beam, and a headlamp\'s cut-off is the edge of a shield imaged on the road.
`,
  ideas: [
    'A torch trades beam angle for intensity: I = Φ/(2π(1 − cos θ)) for an even cone.',
    'The beam distance d = 2√I, to 0.25 lx, is how torches are rated (ANSI/NEMA FL1).',
    'A reflector gives a hot spot and spill; a TIR lens catches 85–90 % of an LED\'s flux and gives a smoother beam.',
    'Halving the half-angle roughly quadruples the candela and doubles the reach.',
    'A dipped headlamp images the edge of a shield, or the segments of a free-form reflector, as a sharp cut-off.'
  ],
  pitfalls: [
    'More lumens always means a torch that reaches farther — The reach depends on the candela, that is on how the lumens are squeezed into an angle: a 500 lm spot beats a 1000 lm flood in distance.',
    'The beam angle is where the light stops — The usual angle is where the intensity falls to half its peak (or to 10 %); a hot spot of 10° often has spill out to 50° at a few per cent.',
    'A brighter beam is always better on the road — Light above the cut-off dazzles oncoming drivers; what counts is the shape of the pattern and the light below the line.',
    'The beam distance of a torch is how far it lights things — It is where the beam centre falls to 0.25 lx, a standard threshold. Seeing detail needs more light, so the useful range is shorter.'
  ],
  terms: [
    { term: 'Hot spot', also: ['spot', 'beam core'], def: 'The small bright centre of a torch beam, formed by the light that the reflector or lens has collimated.' },
    { term: 'Spill', also: ['flood', 'spill light'], def: 'The dimmer, wider light round the hot spot, usually the part of the source\'s light that the reflector does not collimate.' },
    { term: 'Beam angle', also: ['FWHM beam angle', 'half-peak angle', 'beam spread'], def: 'The angle of the beam, usually measured between the directions where the intensity falls to half its peak value (full width at half maximum). The 10 % angle is also quoted.' },
    { term: 'Beam distance', also: ['throw', 'range (ANSI FL1)'], def: 'The distance at which the illuminance at the centre of the beam falls to 0.25 lx: d = 2√I with I in candela. The standard measure of a torch\'s reach.' },
    { term: 'TIR lens', also: ['TIR collimator', 'total-internal-reflection lens'], def: 'A moulded collimator with a central lens and an outer surface that turns the sideways light forward by total internal reflection, catching most of an LED\'s flux.' },
    { term: 'Cut-off', also: ['cut-off line', 'dipped beam', 'low beam'], def: 'The sharp upper edge of a dipped headlamp beam, produced by a shield imaged on the road or by the segments of the reflector, which keeps light out of oncoming drivers\' eyes.' }
  ],
  formulas: [
    {
      name: 'Intensity of an even cone',
      expr: 'I = Phi/(2*pi*(1 - cos(theta)))', tex: 'I = \\frac{\\Phi}{2\\pi\\,(1 - \\cos\\theta)}',
      vars: {
        I: { name: 'luminous intensity', q: 'luminousint', unit: 'cd' },
        Phi: { name: 'luminous flux in the beam', q: 'luminousflux', unit: 'lm', value: 500, tex: '\\Phi' },
        theta: { name: 'half-angle of the cone', q: 'angle', unit: '°', value: 10, min: 0.5, max: 90, tex: '\\theta' }
      },
      note: 'The flux divided by the solid angle of the cone, assuming the light is even inside it; a real beam has a hot spot and spill.',
      stories: { I: 'A torch puts {Phi} into an even cone of {theta} half-angle. What is its intensity?', theta: 'A torch puts {Phi} into an even cone and must reach {I}. What half-angle must the beam have?' }
    },
    {
      name: 'Beam distance',
      expr: 'd = sqrt(I/Et)', tex: 'd = \\sqrt{\\frac{I}{E_t}}',
      vars: {
        d: { name: 'beam distance', q: 'length', unit: 'm' },
        I: { name: 'peak intensity', q: 'luminousint', unit: 'cd', value: 5238 },
        Et: { name: 'threshold illuminance (0.25 lx in ANSI FL1)', q: 'illuminance', unit: 'lx', value: 0.25, tex: 'E_t' }
      },
      note: 'The inverse-square law solved for the distance at which the beam centre has fallen to the threshold. With 0.25 lx it is 2√I.',
      stories: { d: 'A torch has a peak intensity of {I}. At what distance does its beam fall to {Et}?' }
    },
    {
      name: 'Illuminance at a distance',
      expr: 'E = I*cos(th)/d^2', tex: 'E = \\frac{I\\cos\\theta}{d^2}',
      vars: {
        E: { name: 'illuminance on the surface', q: 'illuminance', unit: 'lx' },
        I: { name: 'intensity towards the surface', q: 'luminousint', unit: 'cd', value: 5238 },
        th: { name: 'angle between the beam and the normal to the surface', q: 'angle', unit: '°', value: 0, min: 0, max: 85, tex: '\\theta' },
        d: { name: 'distance', q: 'length', unit: 'm', value: 20 }
      },
      note: 'The inverse-square law with the cosine of the angle of incidence.',
      stories: { E: 'A torch of {I} shines on a wall {d} away, at {th} from the normal. What illuminance does it produce?' }
    },
    {
      name: 'Diameter of the lit spot',
      expr: 'D = 2*d*tan(theta)', tex: 'D = 2\\,d\\,\\tan\\theta',
      vars: {
        D: { name: 'diameter of the spot', q: 'length', unit: 'm' },
        d: { name: 'distance to the wall', q: 'length', unit: 'm', value: 20 },
        theta: { name: 'half-angle of the beam', q: 'angle', unit: '°', value: 10, min: 0.5, max: 80, tex: '\\theta' }
      },
      note: 'The spot of a beam of half-angle θ on a wall at right angles to the axis.',
      stories: { D: 'A beam of {theta} half-angle lights a wall {d} away. How wide is the lit spot?' }
    }
  ],
  examples: [
    {
      title: 'A 500 lm torch, narrow or wide',
      q: 'A torch gives 500 lm. Compare its peak intensity, its beam distance and the diameter of the spot at 20 m if the beam is an even cone of half-angle 10° or 30°.',
      steps: [
        { text: 'The solid angles: $2\\pi(1-\\cos 10°) = 0.0955$ sr and $2\\pi(1-\\cos 30°) = 0.842$ sr. Then $I = 500/0.0955 = 5240$ cd and $500/0.842 = 594$ cd.' },
        { text: 'The beam distances:', tex: 'd = 2\\sqrt{5240} = 145\\ \\mathrm{m} \\qquad d = 2\\sqrt{594} = 49\\ \\mathrm{m}' },
        { text: 'The spots at 20 m:', tex: 'D = 2\\times 20\\times\\tan 10° = 7.1\\ \\mathrm{m} \\qquad 2\\times 20\\times\\tan 30° = 23\\ \\mathrm{m}' }
      ],
      a: '5240 cd, 145 m, a 7.1 m spot — or 594 cd, 49 m, a 23 m spot. The same lumens: three times the reach for a third of the width.'
    },
    {
      title: 'Light at the wall',
      q: 'The 10° torch above shines straight at a wall 20 m away. What is the illuminance at the centre of the spot?',
      steps: [
        { text: 'With $E = I/d^2$:', tex: 'E = \\frac{5240}{20^2} = 13\\ \\mathrm{lx}' },
        'Moonlight is about 0.25 lx and a street light 10 lx: the spot is brighter than a lit street.'
      ],
      a: '13 lx at the centre of the spot.'
    }
  ],
  quiz: [
    { q: 'A torch has a peak intensity of 10 000 cd. What is its beam distance to 0.25 lx?', choices: ['100 m', '200 m', '400 m', '10 000 m'], a: 1, why: '$d = 2\\sqrt{I} = 2\\times 100 = 200$ m. The reach goes as the square root of the intensity.' },
    { q: 'Two torches have the same lumens. The one with the narrower beam has a higher candela and reaches farther.', a: true, why: 'The intensity is the flux divided by the solid angle of the beam; a narrower cone has a smaller solid angle. Its beam distance, going as the square root of the intensity, is greater.' },
    { q: 'A torch with 800 lm has an even cone of 15° half-angle. What is its peak intensity in candela? (Enter the number.)', answer: 3737, why: 'The solid angle is $\\Omega = 2\\pi(1-\\cos 15°) = 0.2141$ sr, so $I = 800/0.2141 = 3737$ cd.' },
    { q: 'Why does a TIR collimator give a smoother, more efficient beam than a plain reflector round an LED?', choices: ['It makes the LED brighter', 'It catches the forward light with a central lens as well as the sideways light, so little of the LED\'s flux is uncollimated', 'It uses a mirror coating of 99 %', 'It narrows the LED\'s spectrum'], a: 1, why: 'A reflector leaves the LED\'s central light to escape directly as spill; the TIR lens has a lens for it and a total-internal-reflection surface for the high-angle light.' },
    { q: 'What makes the sharp cut-off line of a projector-type dipped headlamp?', choices: ['The lamp filament is very small', 'A shield at the second focus of the reflector, whose edge the lens images on the road', 'A dark glass in front of the lamp', 'The curve of the road'], a: 1, why: 'The shield hides the upper half of the image of the lamp; the projection lens images the shield\'s edge, which is why the cut-off is crisp. Free-form reflector headlamps achieve it with aimed segments instead.' }
  ],
  applications: [
    'Hand torches, bicycle lights and head torches, with TIR lenses or reflectors chosen for spot or flood.',
    'Car headlamps: dipped beams with a cut-off, main beams without, and now adaptive beams that mask oncoming traffic.',
    'Search torches and spotlights, where the reach is the purpose and the reflector is large.',
    'Stage follow-spots and architectural spotlights, which use an ellipsoidal reflector and a lens to shape the beam.',
    'Rail, ship and aircraft landing lights, and any lamp meant to be seen or to light a distant object.'
  ],
  history: 'Dry-cell hand lamps appeared in the late 1890s and were called flash lights because their carbon-filament bulbs, fed by weak cells, could be lit only briefly. Sealed-beam headlamps were standard in the United States from 1939. The asymmetric European dipped beam appeared in 1957, the dual-filament halogen H4 in 1971, xenon discharge headlamps in 1991 and LED headlamps in the 2000s.',
  sources: [
    'ANSI/NEMA FL1, *Flashlight Basic Performance Standard* — the definitions of lumens, peak beam intensity, beam distance and run time.',
    'UN Regulation No. 112, *Headlamps emitting an asymmetrical passing beam* — the definition of the cut-off and the test pattern.',
    'R. Winston, J. C. Miñano and P. Benítez, *Nonimaging Optics* (Elsevier, 2005) — collimators and TIR optics.'
  ],
  sim: 'il-beam'
},

/* ================================================================ room lighting and luminaires */
{
  id: 'room-lighting-and-luminaires', parent: 'illumination-design', title: 'Room lighting and luminaires', level: 1,
  short: 'A room is lit to a task: so many lux on the desk, reasonably even, without glare. The lumen method turns that into a count of luminaires, E = N Φ UF MF / A; the luminaire\'s light distribution and its spacing then decide how even the light is.',
  keywords: ['room lighting', 'luminaire', 'lumen method', 'utilization factor', 'maintenance factor', 'room index', 'illuminance', 'work plane', 'spacing to height ratio', 'light distribution', 'downlight', 'troffer', 'batwing', 'LID', 'indirect lighting', 'lux'],
  prereq: ['inverse-square-and-cosine-laws', 'lumens-candelas-lux-and-nits', 'illuminance-levels-in-practice'],
  related: ['glare-and-uniformity', 'daylight-and-skylight', 'lamp-efficacy-and-lifetime', 'light-emitting-diodes', 'colour-temperature-and-colour-rendering', 'lambertian-surfaces', 'measuring-light', 'ergonomics:lighting-levels'],
  body: `
A room is lit for a purpose: reading a page, assembling a watch, finding the way along a corridor. Each purpose has a target for the **illuminance** on the **work plane** (the horizontal plane at desk height, 0.75 m above the floor in offices), a target for how evenly it is spread, and a limit on glare. Choosing and placing **luminaires** (the complete light fittings: lamp or LED, reflector, diffuser, housing) to meet them is an arithmetic that starts with a table.

### How much light
| Space or task | Maintained illuminance, typical (lx) |
|---|---|
| Corridors and stairs | 100 |
| Living rooms, general | 100–200 |
| Classrooms and meeting rooms | 300–500 |
| Offices: reading, writing, computer work | 500 |
| Technical drawing | 750 |
| Fine assembly and visual inspection | 750–1000 |

*Maintained* illuminance is the average over the task area below which it must not fall before the installation is cleaned or relamped; the values are those of work-place lighting standards (EN 12464-1, ISO 8995-1), and the standard gives the exact figure for each task.

### The lumen method
The light that arrives is the light that left the luminaires, less what the room swallows:

$$E_{av} = \\frac{N\\,\\Phi\\,\\mathrm{UF}\\,\\mathrm{MF}}{A}$$

with $N$ luminaires of luminous flux $\\Phi$ each, a room (work-plane) area $A$, a **utilization factor** UF (the share of the luminaires' flux that reaches the work plane, directly and by reflection from the walls and ceiling) and a **maintenance factor** MF (the share left once lamps dim and dust gathers). UF depends on the luminaire's distribution, the reflectances of ceiling, walls and floor and the **room index**

$$K = \\frac{L\\,W}{h\\,(L+W)}$$

with $h$ the height of the luminaires above the work plane: tall, narrow rooms have a low index and a low UF (0.3–0.5), wide, low rooms a high one (0.7–0.8). MF is 0.6–0.7 in dirty places and 0.8–0.9 for LED luminaires in clean ones.

### Luminaires and their distributions
A luminaire's **luminous intensity distribution** is a polar diagram of candela against angle, usually per 1000 lm. *Direct* luminaires (downlights, recessed panels) send nearly everything below the horizontal; *indirect* ones (uplighters, coves) light the ceiling, which becomes a large, soft source; *direct-indirect* pendants do both. A *cosine* (Lambertian) distribution $I = I_0\\cos\\theta$ is common from panels; a *batwing* distribution peaks at 30–40° from the vertical to even out the light between luminaires. The **light output ratio** is the share of the lamp's flux that leaves the luminaire (70–95 % for LED fittings).

### Spacing and evenness
Under one small luminaire at height $h$ the horizontal illuminance at an angle $\\theta$ from the vertical is

$$E = \\frac{I(\\theta)\\cos^3\\theta}{h^2}$$

(inverse square and cosine twice: once for the longer path, once for the tilt of the surface). A single cosine luminaire at 2 m delivers 286 lx directly below and 117 lx at 1.5 m to the side, and the illuminance between luminaires sags unless they are close together. The **spacing-to-height ratio** (SHR) is the largest spacing, as a multiple of $h$, for which the light stays acceptably even: about 1.0–1.5 depending on the distribution. Rows of luminaires that are wider apart than this leave dark bands.

> [!key] The lumen method gives the average: E = NΦ·UF·MF/A. The luminaire's distribution and the spacing give the evenness: keep the spacing within about 1–1.5 times the mounting height above the work plane.
`,
  ideas: [
    'Rooms are lit to a task: typically 100 lx in corridors, 500 lx in offices and 750–1000 lx for fine work.',
    'The lumen method gives the average illuminance on the work plane: E = N Φ UF MF / A.',
    'UF depends on the room index K = L W/(h (L + W)), the reflectances and the luminaire; MF allows for lamp ageing and dirt.',
    'A luminaire\'s distribution (cosine, batwing, narrow) and the spacing decide the evenness: E = I cos³θ/h² under each point source.',
    'The spacing-to-height ratio of about 1–1.5 keeps the light even between luminaires.'
  ],
  pitfalls: [
    'The lumens of the lamps equal the lumens on the desk — Only a fraction (UF, typically 0.4–0.8) reaches the work plane, and ageing and dust take another 10–30 %.',
    'The more luminaires the better — More light costs energy and can cause glare; the target is the maintained illuminance of the task, even and glare-free.',
    'Illuminance directly under the luminaire tells the whole story — The light a few metres to the side is lower by cos³θ and by the distribution; a room can have the right average and dark gaps.',
    'The room does not matter — The same luminaires give a much lower UF in a tall narrow room with dark walls than in a wide low room with white walls.'
  ],
  terms: [
    { term: 'Luminaire', also: ['light fitting', 'light fixture', 'lighting fixture'], def: 'The complete lighting device: the lamp or LED module with its reflector, diffuser, housing and electrical connection.' },
    { term: 'Work plane', also: ['working plane', 'task plane'], def: 'The reference surface on which illuminance is specified and measured, usually horizontal at desk height (0.75 m in offices).' },
    { term: 'Lumen method', also: ['lumen method of calculation', 'average illuminance method'], def: 'A calculation of the average illuminance on the work plane from the number of luminaires, their flux, the utilization factor, the maintenance factor and the area.' },
    { term: 'Utilization factor', also: ['utilisation factor', 'UF', 'coefficient of utilization'], def: 'The fraction of the luminaires\' luminous flux that reaches the work plane, directly and by reflection, as read from the maker\'s table for the room index and reflectances.' },
    { term: 'Maintenance factor', also: ['MF', 'light loss factor'], def: 'The ratio of the illuminance at the end of the maintenance period to the initial value, allowing for the fall in lamp output and the dust on lamps, luminaires and room surfaces.' },
    { term: 'Room index', also: ['K'], def: 'The shape of the room as one number, K = L W / (h (L + W)), used to read the utilization factor from a table.' },
    { term: 'Spacing-to-height ratio', also: ['SHR', 'S/H ratio'], def: 'The largest spacing between luminaires, divided by their height above the work plane, that keeps the illuminance acceptably even.' }
  ],
  formulas: [
    {
      name: 'The lumen method',
      expr: 'E = N*Phi*UF*MF/A', tex: 'E_{av} = \\frac{N\\,\\Phi\\,\\mathrm{UF}\\,\\mathrm{MF}}{A}',
      vars: {
        E: { name: 'average maintained illuminance', q: 'illuminance', unit: 'lx', tex: 'E_{av}' },
        N: { name: 'number of luminaires', int: true, min: 1, max: 200, value: 12 },
        Phi: { name: 'luminous flux of one luminaire', q: 'luminousflux', unit: 'lm', value: 3600, tex: '\\Phi' },
        UF: { name: 'utilization factor', value: 0.65, min: 0.1, max: 1, tex: '\\mathrm{UF}' },
        MF: { name: 'maintenance factor', value: 0.8, min: 0.3, max: 1, tex: '\\mathrm{MF}' },
        A: { name: 'area of the room', q: 'area', unit: 'm²', value: 40 }
      },
      solveFor: 'E',
      note: 'The average on the work plane, ignoring daylight. UF is read from the luminaire maker\'s table.',
      stories: { E: '{N} luminaires of {Phi} each light a room of {A}, with a utilization factor of {UF} and a maintenance factor of {MF}. What average illuminance results?', N: 'A room of {A} needs {E} using luminaires of {Phi}, with UF {UF} and MF {MF}. How many luminaires are needed?' },
      practice: { unknowns: ['E', 'N'] }
    },
    {
      name: 'Room index',
      expr: 'K = L*W/(h*(L + W))', tex: 'K = \\frac{L\\,W}{h\\,(L + W)}',
      vars: {
        K: { name: 'room index' },
        L: { name: 'length of the room', q: 'length', unit: 'm', value: 8 },
        W: { name: 'width of the room', q: 'length', unit: 'm', value: 5 },
        h: { name: 'height of the luminaires above the work plane', q: 'length', unit: 'm', value: 2 }
      },
      note: 'Low for a tall, narrow room, high for a wide, low one.',
      stories: { K: 'A room {L} by {W} has luminaires {h} above the work plane. What is the room index?' }
    },
    {
      name: 'Illuminance under a point-like luminaire',
      expr: 'E = I*cos(theta)^3/h^2', tex: 'E = \\frac{I\\cos^3\\theta}{h^2}',
      vars: {
        E: { name: 'horizontal illuminance on the work plane', q: 'illuminance', unit: 'lx' },
        I: { name: 'intensity of the luminaire towards the point', q: 'luminousint', unit: 'cd', value: 917 },
        theta: { name: 'angle from the vertical below the luminaire', q: 'angle', unit: '°', value: 36.9, min: 0, max: 85, tex: '\\theta' },
        h: { name: 'height above the work plane', q: 'length', unit: 'm', value: 2 }
      },
      note: 'Valid when the luminaire is small compared with its distance. One cosine for the tilt of the surface, two for the longer path.',
      stories: { E: 'A luminaire gives {I} towards a point on the desk, {theta} from the vertical, {h} below it. What illuminance does the point receive?' }
    },
    {
      name: 'Largest spacing of luminaires',
      expr: 'S = SHR*h', tex: 'S = \\mathrm{SHR}\\,h',
      vars: {
        S: { name: 'largest spacing between luminaires', q: 'length', unit: 'm' },
        SHR: { name: 'spacing-to-height ratio of the luminaire', value: 1.25, min: 0.5, max: 2.5, tex: '\\mathrm{SHR}' },
        h: { name: 'height above the work plane', q: 'length', unit: 'm', value: 2 }
      },
      note: 'The ratio comes from the luminaire\'s data sheet: about 1.0–1.5 for typical direct luminaires.',
      stories: { S: 'A luminaire has a spacing-to-height ratio of {SHR} and hangs {h} above the work plane. How far apart may the luminaires be?' }
    }
  ],
  examples: [
    {
      title: 'Lighting an office',
      q: 'An office is 8 m × 5 m with luminaires 2 m above the desks. It needs 500 lx maintained. The luminaires give 3600 lm each; the maker\'s table gives UF = 0.65 for this room, and MF = 0.8. How many luminaires, and is the spacing right for SHR 1.25?',
      steps: [
        { text: 'The room index: $K = 40/(2\\times 13) = 1.5$ (so the table value UF 0.65 is reasonable).' },
        { text: 'Solve the lumen method for $N$:', tex: 'N = \\frac{E\\,A}{\\Phi\\,\\mathrm{UF}\\,\\mathrm{MF}} = \\frac{500\\times 40}{3600\\times 0.65\\times 0.8} = 10.7' },
        'Round up to 12 and arrange them as 4 along the 8 m length (2.0 m apart) and 3 across the 5 m width (1.67 m apart). The largest spacing allowed is $\\mathrm{SHR}\\times h = 1.25\\times 2 = 2.5$ m, and the grid has $S/h = 1.0$ and $0.83$: inside it.',
        { text: 'Check: with 12 luminaires,', tex: 'E = \\frac{12\\times 3600\\times 0.65\\times 0.8}{40} = 562\\ \\mathrm{lx}' }
      ],
      a: 'About 11, so 12 luminaires in a 4 × 3 grid at 2.0 m × 1.67 m, giving 562 lx maintained. The installed load is about 12 × 30 W = 360 W, 9 W/m².'
    },
    {
      title: 'Under and beside a luminaire',
      q: 'A luminaire of 3600 lm with a cosine distribution ($I = I_0\\cos\\theta$) hangs 2 m above a desk. What illuminance does it give directly below, and 1.5 m to the side?',
      steps: [
        { text: 'For a cosine distribution the flux is $\\Phi = \\pi I_0$, so $I_0 = 3600/\\pi = 1146$ cd. Directly below, $E = I_0/h^2 = 1146/4 = 286$ lx.' },
        { text: 'At 1.5 m to the side $\\theta = \\arctan(1.5/2) = 36.9°$, $I = 1146\\times 0.8 = 917$ cd and', tex: 'E = \\frac{917\\times 0.8^3}{2^2} = 117\\ \\mathrm{lx}' }
      ],
      a: '286 lx below, 117 lx at 1.5 m to the side: the illuminance from one luminaire falls to 41 % within 1.5 m. Neighbouring luminaires have to fill in the gap.'
    }
  ],
  quiz: [
    { q: 'A room of 30 m² is lit by 6 luminaires of 4000 lm, with UF = 0.6 and MF = 0.8. What is the average illuminance on the work plane (lx)?', choices: ['200', '320', '384', '800'], a: 2, why: '$E = 6\\times 4000\\times 0.6\\times 0.8/30 = 11\\,520/30 = 384$ lx. Forgetting the maintenance factor would give 480; forgetting both factors, 800.' },
    { q: 'Doubling the height of the luminaires above the work plane, with the same luminaires, leaves the illuminance directly below them unchanged.', a: false, why: 'Directly below, $E = I/h^2$, so doubling $h$ quarters the illuminance (and a tall room has a lower room index and utilization factor too).' },
    { q: 'What is the room index of a hall 12 m long and 6 m wide with luminaires 3 m above the work plane? (Enter the number.)', answer: 1.33, why: '$K = LW/(h(L+W)) = 72/(3\\times 18) = 1.33$.' },
    { q: 'The spacing-to-height ratio of a luminaire is 1.5 and it is mounted 2.4 m above the desks. What is the largest spacing between luminaires?', choices: ['1.6 m', '2.4 m', '3.6 m', '4.8 m'], a: 2, why: '$S = \\mathrm{SHR}\\times h = 1.5\\times 2.4 = 3.6$ m. Wider spacing leaves dark bands between the rows.' },
    { q: 'Why is a maintenance factor needed in the lumen method?', choices: ['The luminaires are partly blocked by furniture', 'Lamps dim with age and dust collects on lamps, luminaires and room surfaces, so the installed light must exceed the required value', 'The room absorbs colour', 'Standards ask for 20 % extra'], a: 1, why: 'The target is a *maintained* illuminance that the installation must never fall below before it is cleaned and relamped; at the start it is higher, by 1/MF.' }
  ],
  applications: [
    'Office, school and hospital lighting, designed to the maintained illuminance, uniformity and glare limits of work-place standards.',
    'Retail and gallery lighting, with track spots and narrow distributions to give accents and modelling.',
    'Industrial and warehouse high-bay lighting, where the room index is low and the utilization factor is carefully chosen.',
    'Lighting of corridors, stairs and escape routes to the minimum levels required by building codes.',
    'Daylight-linked control: luminaires dimmed as the daylight in the room rises ([[daylight-and-skylight]]).'
  ],
  sources: [
    'EN 12464-1, *Light and lighting — Lighting of work places — Part 1: Indoor work places* — the tables of illuminance, uniformity and glare limits by task.',
    'CIBSE, *Lighting Guide LG7: Offices* and *Code for Lighting* — the lumen method, utilization factors and maintenance factors.',
    'J. L. Lindsey, *Applied Illumination Engineering* (Fairmont Press) — the lumen method and the point-by-point calculation.'
  ],
  sim: 'il-room'
},

/* ================================================================ glare and uniformity */
{
  id: 'glare-and-uniformity', parent: 'illumination-design', title: 'Glare and uniformity', level: 2,
  short: 'Glare is light in the wrong place. A bright source in view can veil what you are trying to see (disability glare) or simply tire the eye (discomfort glare), and its reflection in a glossy task can wash out detail. Shielding angles, a limited luminance and an even field cure it.',
  keywords: ['glare', 'disability glare', 'discomfort glare', 'veiling luminance', 'veiling reflection', 'UGR', 'unified glare rating', 'shielding angle', 'cut-off angle', 'louvre', 'uniformity', 'luminance ratio', 'contrast', 'luminaire luminance', 'dazzle'],
  prereq: ['room-lighting-and-luminaires', 'lumens-candelas-lux-and-nits', 'the-pupil'],
  related: ['flashlights-and-headlamps', 'light-and-dark-adaptation', 'lambertian-surfaces', 'daylight-and-skylight', 'contrast-sensitivity', 'drivers-dimming-and-flicker', 'ergonomics:glare-colour', 'ergonomics:visual-ergonomics'],
  body: `
A source that is merely bright is not a problem; a source that is much brighter than what the eye has adapted to is. Glare comes in three forms, with three different cures.

### Disability glare: the veil
Light from a glare source scatters inside the eye (in the cornea, the lens and the vitreous) and spreads a haze over the retinal image, as a bright window spoils a view through dusty glass. The **veiling luminance** it adds is, in the usual approximation,

$$L_v = \\frac{10\\,E}{\\theta^2}$$

with $E$ the illuminance on the eye from the glare source (lx, on a surface at right angles to the glare) and $\\theta$ the angle in degrees between the glare source and the line of sight. Oncoming headlamps giving 5 lx at 2° add 12.5 cd/m². A wet road has a luminance of 1 cd/m² or less, and a pedestrian on it a contrast of $\\Delta L/L$: with the veil the contrast falls to $\\Delta L/(L + L_v)$, from 30 % to 2 % — invisible.

### Discomfort glare
Here vision is not reduced but the eye tires and the head aches. It grows with the luminance $L$ and the apparent size $\\omega$ of the sources, and falls as the background luminance $L_b$ rises and as the sources move away from the line of sight (the position index $p$). Indoors it is rated by the **Unified Glare Rating**

$$\\mathrm{UGR} = 8\\log_{10}\\!\\left(\\frac{0.25}{L_b}\\sum\\frac{L^2\\omega}{p^2}\\right)$$

on a scale of 10 (imperceptible) to 30 (intolerable) in steps of three (CIE 117). Typical limits for the room: 16 for drawing and fine work, 19 for offices and classrooms, 22 for industrial work, 28 for corridors.

### Reflected glare: veiling reflections
A glossy page or a screen mirrors a bright luminaire in the direction of the mirror, and the reflection lowers the contrast of what is on it. The cure is geometric: place luminaires so that none lies in the "offending zone" along the mirror direction from the task, use matt surfaces, and light tasks from the side.

### Shielding angle
The **shielding (cut-off) angle** is the angle below the horizontal at which the lamp itself, rather than the luminaire's shielding, becomes visible. For a louvre of depth $d$, where the far edge of the lamp is a horizontal distance $s$ from the lower edge of the blade nearest the observer, $\\alpha = \\arctan(d/s)$. Work-place standards ask for shielding of 15–30°, the larger angle for lamps of higher luminance. The luminance of a flat luminaire seen at an angle $\\gamma$ from below is its intensity in that direction divided by its projected area:

$$L = \\frac{I(\\gamma)}{A\\cos\\gamma}$$

Bare LED dies (about $10^7$ cd/m²) and bare tubes ($10^4$ cd/m²) must be covered; a luminous panel of 3000–6000 cd/m² is tolerable only outside the usual line of sight.

### Uniformity
**Uniformity** is the lowest illuminance divided by the average on the task, $U_0 = E_{min}/E_{av}$: 0.6 for office tasks, 0.4 for corridors (EN 12464-1). The eye adapts to the brightest large area in view, so a dark surround to a bright task and sharp patches of light both tire it. The usual guidance keeps the task about three times as bright as its immediate surround, and not more than ten times brighter than the far surroundings ([[ergonomics:glare-colour|glare and colour in ergonomics]]).

> [!key] Glare is brightness out of proportion to the adaptation of the eye: it veils (L_v = 10E/θ²), it tires (UGR), or it reflects in the task. Shield the lamp, limit its luminance, keep it out of the mirror direction, and keep the field even (U₀ ≥ 0.6 for offices).
`,
  ideas: [
    'Disability glare adds a veil of luminance L_v = 10E/θ² and lowers the contrast of everything seen through it.',
    'Discomfort glare tires without reducing vision; indoors it is rated by UGR, with limits of 16–28 depending on the room.',
    'A veiling reflection is the mirror image of a bright luminaire in a glossy task: keep luminaires out of the mirror direction.',
    'A shielding angle α = arctan(d/s) hides the lamp from view below that angle; flat luminaires have luminance L = I/(A cos γ).',
    'Uniformity U₀ = E_min/E_av should be 0.6 or more at an office task, with the task about three times as bright as its surround.'
  ],
  pitfalls: [
    'Glare is the same as brightness — It is brightness relative to what the eye has adapted to, and depends on the size, the position and the contrast with the surround: a candle is dazzling at night and invisible at noon.',
    'More light always makes seeing easier — Beyond the level the task needs, extra light from the wrong direction adds veil and glare; the quality of the lighting matters as much as the quantity.',
    'A louvre or diffuser removes glare — It limits the luminance seen in the shielded directions; outside the shielding angle, the luminaire is as bright as ever.',
    'If the average illuminance is right, the room is well lit — A room can meet the average and be too patchy: the minimum, the uniformity and the surround matter too.'
  ],
  terms: [
    { term: 'Disability glare', also: ['veiling glare'], def: 'Glare that reduces the ability to see because stray light in the eye veils the retinal image, lowering the contrast of everything in view.' },
    { term: 'Discomfort glare', also: ['visual discomfort'], def: 'Glare that causes annoyance, fatigue or headache without necessarily reducing the ability to see.' },
    { term: 'Veiling luminance', also: ['equivalent veiling luminance', 'L_v'], def: 'The luminance of the haze added to the retinal image by stray light from glare sources, in cd/m²; roughly 10 E/θ².' },
    { term: 'Unified Glare Rating', also: ['UGR'], def: 'The CIE rating of discomfort glare from luminaires in a room, from 10 (none) to 30 (intolerable); limits such as 19 apply to offices.' },
    { term: 'Shielding angle', also: ['cut-off angle', 'screening angle'], def: 'The angle below the horizontal within which the luminaire\'s louvres or reflector hide the lamp from an observer.' },
    { term: 'Uniformity', also: ['U₀', 'uniformity ratio'], def: 'The ratio of the lowest illuminance to the average over the task area; 0.6 or more is asked of office tasks.' },
    { term: 'Veiling reflection', also: ['reflected glare', 'specular reflection'], def: 'The reflection of a bright source in a glossy task or screen that overlays and washes out the detail seen on it.' }
  ],
  formulas: [
    {
      name: 'Veiling luminance',
      expr: 'Lv = 10*E/theta^2', tex: 'L_v = \\frac{10\\,E}{\\theta^2}',
      vars: {
        Lv: { name: 'veiling luminance', q: 'luminance', unit: 'cd/m²', tex: 'L_v' },
        E: { name: 'illuminance at the eye from the glare source', q: 'illuminance', unit: 'lx', value: 5 },
        theta: { name: 'angle between the glare source and the line of sight, in degrees', q: false, unit: '°', value: 2, tex: '\\theta' }
      },
      note: 'The Stiles–Holladay approximation, good between about 1° and 30° from the line of sight.',
      stories: { Lv: 'A lamp gives {E} at the eye, {theta} from the line of sight. What veiling luminance does it add?' }
    },
    {
      name: 'Luminance of a flat luminaire',
      expr: 'L = I/(A*cos(gamma))', tex: 'L = \\frac{I}{A\\cos\\gamma}',
      vars: {
        L: { name: 'luminance seen', q: 'luminance', unit: 'cd/m²' },
        I: { name: 'intensity in the viewing direction', q: 'luminousint', unit: 'cd', value: 450 },
        A: { name: 'luminous area of the luminaire', q: 'area', unit: 'm²', value: 0.36 },
        gamma: { name: 'angle from the vertical below the luminaire', q: 'angle', unit: '°', value: 65, min: 0, max: 88, tex: '\\gamma' }
      },
      note: 'Luminance is intensity per unit projected area; the projected area of a flat luminaire falls as cos γ.',
      stories: { L: 'A luminaire with a luminous area of {A} gives {I} at {gamma} from the vertical. What luminance does it show there?' }
    },
    {
      name: 'Shielding angle of a louvre',
      expr: 'alpha = atan(d/s)', tex: '\\alpha = \\arctan\\frac{d}{s}',
      vars: {
        alpha: { name: 'shielding angle, measured below the horizontal', q: 'angle', unit: '°', tex: '\\alpha' },
        d: { name: 'depth of the louvre blade', q: 'length', unit: 'mm', value: 30 },
        s: { name: 'horizontal distance from the far edge of the lamp to the lower edge of the nearer blade', q: 'length', unit: 'mm', value: 52 }
      },
      note: 'Below this angle the lamp cannot be seen; above it, the lamp is in view.',
      stories: { alpha: 'A louvre blade {d} deep has its lower edge {s} (horizontally) from the far edge of the lamp. At what angle below the horizontal does the lamp come into view?' }
    },
    {
      name: 'Uniformity',
      expr: 'U = Emin/Eav', tex: 'U_0 = \\frac{E_{min}}{E_{av}}',
      vars: {
        U: { name: 'uniformity ratio', tex: 'U_0' },
        Emin: { name: 'lowest illuminance on the task area', q: 'illuminance', unit: 'lx', value: 330, tex: 'E_{min}' },
        Eav: { name: 'average illuminance on the task area', q: 'illuminance', unit: 'lx', value: 500, tex: 'E_{av}' }
      },
      note: 'Work-place standards ask for 0.6 or more at office tasks and 0.4 in circulation areas.',
      stories: { U: 'An office task area has a lowest illuminance of {Emin} and an average of {Eav}. What is the uniformity?' }
    }
  ],
  examples: [
    {
      title: 'Oncoming headlamps',
      q: 'On a wet road of luminance 1 cd/m² a pedestrian differs in luminance from the road by 0.3 cd/m². Oncoming headlamps give 5 lx at the driver\'s eye, 2° from the line of sight. What is the contrast with and without the glare?',
      steps: [
        { text: 'Without glare: $C = \\Delta L/L = 0.3/1 = 30\\ \\%$.' },
        { text: 'The veil:', tex: 'L_v = \\frac{10\\times 5}{2^2} = 12.5\\ \\mathrm{cd/m^2}' },
        { text: 'With the veil the contrast is', tex: 'C = \\frac{0.3}{1 + 12.5} = 2.2\\ \\%' }
      ],
      a: '30 % without and 2.2 % with the glare, below the 2–5 % that the eye can detect at such low luminance. The pedestrian is invisible, which is why dipped beams have a cut-off.'
    },
    {
      title: 'A louvre and a panel',
      q: 'A louvred luminaire has blades 30 mm deep, the far edge of the lamp 52 mm horizontally from the lower edge of the nearer blade. What is its shielding angle? A 0.6 m × 0.6 m panel gives 450 cd at 65° from the vertical; what luminance does it show?',
      steps: [
        { text: 'The shielding angle:', tex: '\\alpha = \\arctan\\frac{30}{52} = 30°' },
        { text: 'The panel\'s luminance:', tex: 'L = \\frac{450}{0.36\\times\\cos 65°} = 2960\\ \\mathrm{cd/m^2}' }
      ],
      a: 'A shielding angle of 30°, as asked for the brightest lamps; and about 3000 cd/m² at 65°, near the limits of 1000–3000 cd/m² set for luminaires that can be reflected in screens.'
    }
  ],
  quiz: [
    { q: 'Oncoming headlamps give 8 lx at the eye, 4° from the line of sight. What is the veiling luminance, in cd/m²? (Enter the number.)', answer: 5, why: '$L_v = 10E/\\theta^2 = 10\\times 8/16 = 5$ cd/m². Moving the glare source twice as far from the line of sight cuts the veil to a quarter.' },
    { q: 'Disability glare and discomfort glare are the same thing described in two ways.', a: false, why: 'Disability glare reduces vision (a veil of scattered light); discomfort glare tires and annoys without reducing vision. A source can cause one without the other.' },
    { q: 'A louvre has blades 25 mm deep, and the far edge of the lamp is 25 mm horizontally from the lower edge of the nearer blade. What is its shielding angle (degrees)?', answer: 45, why: '$\\alpha = \\arctan(25/25) = 45°$.' },
    { q: 'A page on your desk shows a glossy reflection of the ceiling luminaire. Which is the most effective cure?', choices: ['A brighter lamp', 'Moving the luminaire or the page so that the luminaire is outside the mirror direction', 'A darker pen', 'A louvre of 5°'], a: 1, why: 'A reflection lies in the mirror direction from the task to the source. Moving either takes it out of the line of sight; a brighter lamp makes it worse.' },
    { q: 'An office task area has an average of 500 lx and a minimum of 250 lx. Is the uniformity acceptable at the 0.6 usually asked for office tasks?', choices: ['Yes, it is 0.5 and the limit is 0.4', 'No: 250/500 = 0.5, below 0.6', 'Yes, it is 2', 'It cannot be assessed'], a: 1, why: '$U_0 = E_{min}/E_{av} = 250/500 = 0.5$, below 0.6: more luminaires, a closer spacing or a wider distribution is needed.' }
  ],
  applications: [
    'Office and school lighting, designed to a UGR limit with luminaires of known shielding angle and luminance.',
    'Road lighting and headlamp design: the cut-off and the glare thresholds that keep drivers able to see.',
    'Screen-based workplaces, where luminaires reflected in the display are limited in luminance beyond about 65° from the vertical.',
    'Sports halls and industrial plants, where lamps are high and glare limits decide the choice of optics.',
    'Museum and shop lighting, which keeps the sources out of the visitor\'s line of sight.'
  ],
  sources: [
    'CIE 117, *Discomfort glare in interior lighting* — the definition of the Unified Glare Rating.',
    'EN 12464-1, *Light and lighting — Lighting of work places — Part 1: Indoor work places* — the limits on UGR, uniformity and luminaire luminance.',
    'CIE 146 and 147, *CIE equations for disability glare* and *Glare from small, large and complex sources* — the veiling-luminance formulas.'
  ],
  sim: [{ id: 'il-room', params: { mode: 'glare' } }]
},

/* ================================================================ daylight and skylight */
{
  id: 'daylight-and-skylight', parent: 'illumination-design', title: 'Daylight', level: 1,
  short: 'Daylight is two sources: the Sun, a small, intense disc giving about 100 000 lx and sharp shadows, and the sky, a large, soft, bluer dome giving 10 000–20 000 lx. Indoors, the daylight factor tells how much of the sky\'s light a room receives; D65, the standard daylight, is the reference for colour.',
  keywords: ['daylight', 'skylight', 'sunlight', 'sky', 'daylight factor', 'overcast sky', 'D65', 'illuminant', 'colour temperature', 'solar illuminance', 'window', 'sun patch', 'air mass', 'design sky', 'CIE standard sky'],
  prereq: ['illuminance-levels-in-practice', 'room-lighting-and-luminaires', 'why-the-sky-is-blue'],
  related: ['colour-temperature-and-colour-rendering', 'the-chromaticity-diagram', 'glare-and-uniformity', 'the-luminosity-function', 'light-and-dark-adaptation', 'concentrating-light', 'ergonomics:lighting-levels', 'white-balance-and-chromatic-adaptation'],
  body: `
Every other light in this topic is an attempt to supply what the sky gives free. It is worth knowing how much that is, and what it looks like.

### Two sources, one sky
- **The Sun** is a disc of 0.53° with a luminance of about $1.6\\times10^9$ cd/m². High in a clear sky it delivers some 100 000 lx to a surface facing it. It is almost a point source, so it casts sharp, parallel shadows.
- **The sky** is light the atmosphere has scattered ([[why-the-sky-is-blue]]). A clear sky gives 10 000–20 000 lx on a horizontal plane, from a dome of luminance 2000–8000 cd/m², brighter near the Sun and the horizon. An **overcast** sky is a grey dome that is about three times brighter at the zenith than at the horizon (the CIE standard overcast sky, $L(\\gamma) = L_z(1+2\\sin\\gamma)/3$), and gives from 1000 lx on a dark day to 10 000 lx and more on a bright one.

| Condition | Illuminance on a horizontal plane (lx) |
|---|---|
| Sun high in a clear summer sky (Sun and sky) | 100 000–120 000 |
| Full daylight in the shade, thin cloud | about 20 000 |
| Overcast day | 1000–10 000 |
| Clear sunrise or sunset | about 400 |
| Civil twilight (Sun 6° below the horizon) | about 3 |
| Full Moon, high | about 0.25 |
| Starlight | 0.001 |

The sky changes by a factor of 10⁸ between noon and starlight, and the eye copes by adapting ([[light-and-dark-adaptation]]).

### Colour: Sun, sky and D65
The Sun at the ground has a colour temperature of about 5000–5800 K, which falls to 2000–3500 K near the horizon as the air takes the blue out; a blue sky is 10 000–25 000 K; an overcast sky 6500–7000 K. The CIE standard illuminant **D65**, a correlated colour temperature of 6504 K, is a spectrum for *average daylight* (Sun and sky together), derived from measurements published in 1964, and is the reference white of monitors and colour measurement; D50 (5003 K) is the one used in printing.

### Inside: the daylight factor
Windows let in a fraction of the sky's light. The **daylight factor** is the illuminance at a point indoors divided by the illuminance outdoors on an unobstructed horizontal plane under an overcast sky, in per cent. It is 5–10 % near a window and under 1 % at the back of a deep room. The BRE formula for its room average is

$$\\mathrm{DF}_{av} = \\frac{T\\,A_w\\,\\theta}{A\\,(1 - R^2)}\\ \\%$$

with the glass transmittance $T$ (0.7 for clear double glazing), the window area $A_w$, the **vertical angle of visible sky** $\\theta$ in degrees from the window's centre (90° with no obstruction, less behind a building), the area $A$ of all the room's surfaces, and their mean reflectance $R$. A room is thought *well daylit* above an average of 5 %, *needing supplementary lighting* between 2 % and 5 %, and *lit mainly by electricity* below 2 %. A rule of thumb for how far daylight reaches is two to two and a half times the window head height.

### The Sun inside
Direct sunlight enters on a patch of the floor that starts $h_s/\\tan\\beta$ from the window wall and ends at $h_h/\\tan\\beta$ for a Sun at elevation $\\beta$, with $h_s$ and $h_h$ the sill and the head heights. It brings 100 000 lx, glare and heat, so windows need blinds or overhangs.

> [!key] Daylight is the Sun (100 000 lx, sharp shadows) plus the sky (10 000–20 000 lx, soft and bluer). The daylight factor, a few per cent, says what share of the overcast sky a room gets; D65 is the standard spectrum of average daylight.
`,
  ideas: [
    'The Sun gives about 100 000 lx high in a clear sky, with sharp shadows; the sky gives 10 000–20 000 lx, soft and bluer.',
    'An overcast sky is about three times brighter at the zenith than at the horizon.',
    'D65 (6504 K) is the CIE standard spectrum of average daylight; the Sun itself is about 5000–5800 K, blue sky 10 000–25 000 K.',
    'The daylight factor is the indoor illuminance as a percentage of the outdoor one under an overcast sky; above 5 % a room is well daylit, below 2 % it is lit mainly by electricity.',
    'The BRE average daylight factor is T A_w θ/(A(1 − R²)); the direct sun patch starts h_s/tan β from the window wall.'
  ],
  pitfalls: [
    'Daylight is white — It is a mixture: the Sun is yellowish, a clear sky blue, an overcast sky about 6500–7000 K. D65 is the standard average, not a constant.',
    'The daylight factor depends on the weather outside — It is a ratio and is defined under an overcast sky: the same room has the same factor on a dull day or a bright one, but the illuminance changes with the sky.',
    'A bigger window always brings more useful light — The room average rises with the window area, but the sky seen through it, the glass transmittance, the room\'s reflectance, glare and overheating limit the gain; deeper rooms still go dark at the back.',
    'Direct sunshine is the best daylight — It brings 100 000 lx, sharp shadows and heat, causes glare and fades colours; designers prefer the diffuse light of the sky and use blinds or overhangs against the Sun.'
  ],
  terms: [
    { term: 'Daylight factor', also: ['DF'], def: 'The illuminance at a point indoors as a percentage of the simultaneous illuminance outdoors on an unobstructed horizontal plane under a CIE overcast sky.' },
    { term: 'Overcast sky', also: ['CIE standard overcast sky'], def: 'A uniformly cloudy sky whose luminance rises from the horizon to the zenith, where it is three times as bright: L(γ) = L_z (1 + 2 sin γ)/3.' },
    { term: 'D65', also: ['CIE illuminant D65', 'standard daylight'], def: 'The CIE standard illuminant representing average daylight, with a correlated colour temperature of about 6504 K; the white point of sRGB.' },
    { term: 'Design sky', also: ['design overcast sky'], def: 'The reference overcast sky used in daylight calculations, with a diffuse horizontal illuminance of 10 000 lx (as in British guidance).' },
    { term: 'Angle of visible sky', also: ['sky angle', 'θ'], def: 'The vertical angle, from the middle of a window, between the top of the nearest obstruction and the zenith; 90° with an open view of the sky.' },
    { term: 'Air mass', also: ['optical air mass', 'm'], def: 'The length of the path of sunlight through the atmosphere compared with the vertical path; about 1/sin β for a Sun at elevation β above about 10°.' }
  ],
  formulas: [
    {
      name: 'Average daylight factor (BRE)',
      expr: 'DF = T*Aw*theta/(A*(1 - R^2))/100', tex: '\\mathrm{DF} = \\frac{T\\,A_w\\,\\theta}{A\\,(1 - R^2)}',
      vars: {
        DF: { name: 'average daylight factor', q: 'ratio', unit: '%', tex: '\\mathrm{DF}' },
        T: { name: 'transmittance of the glazing', q: 'ratio', unit: '%', value: 70 },
        Aw: { name: 'area of the window', q: 'area', unit: 'm²', value: 4, tex: 'A_w' },
        theta: { name: 'vertical angle of visible sky, in degrees', q: false, unit: '°', value: 60, tex: '\\theta' },
        A: { name: 'total area of the room\'s surfaces', q: 'area', unit: 'm²', value: 88.6 },
        R: { name: 'mean reflectance of the room\'s surfaces', q: 'ratio', unit: '%', value: 50 }
      },
      note: 'The simplified formula for a side-lit room of the BRE: the result is a percentage. Keep θ in degrees (90 for an open view of the sky).',
      stories: { DF: 'A room with {A} of surfaces, a mean reflectance of {R} and a window of {Aw} glazed to {T} sees the sky at {theta}. What is its average daylight factor?' }
    },
    {
      name: 'Indoor illuminance from the daylight factor',
      expr: 'Ein = DF*Eout', tex: 'E_{in} = \\mathrm{DF}\\,E_{out}',
      vars: {
        Ein: { name: 'average illuminance indoors', q: 'illuminance', unit: 'lx', tex: 'E_{in}' },
        DF: { name: 'daylight factor', q: 'ratio', unit: '%', value: 2.5, tex: '\\mathrm{DF}' },
        Eout: { name: 'illuminance outdoors on an unobstructed horizontal plane', q: 'illuminance', unit: 'lx', value: 10000, tex: 'E_{out}' }
      },
      note: 'Under an overcast sky. With the 10 000 lx design sky, each per cent of daylight factor gives 100 lx.',
      stories: { Ein: 'A room has a daylight factor of {DF}. Under a sky giving {Eout} outdoors, what is its average illuminance?' }
    },
    {
      name: 'Direct sun on a horizontal surface (simple model)',
      expr: 'Edn = E0*exp(-k/sin(beta))', tex: 'E_{dn} = E_0\\,e^{-k/\\sin\\beta}',
      vars: {
        Edn: { name: 'illuminance from the Sun on a surface facing it', q: 'illuminance', unit: 'lx', tex: 'E_{dn}' },
        E0: { name: 'solar illuminance outside the atmosphere', q: 'illuminance', unit: 'lx', value: 133800, tex: 'E_0' },
        k: { name: 'extinction coefficient of the atmosphere', value: 0.2 },
        beta: { name: 'elevation of the Sun above the horizon', q: 'angle', unit: '°', value: 30, min: 5, max: 90, tex: '\\beta' }
      },
      note: 'A simple Beer–Lambert model with air mass 1/sin β, meant for orders of magnitude on clear days, not a standard. Multiply by sin β for a horizontal surface.',
      stories: { Edn: 'The Sun stands {beta} above the horizon on a clear day. With an extinction coefficient of {k}, what illuminance does it give on a surface facing it?' }
    },
    {
      name: 'Sun patch on the floor',
      expr: 'x = hw/tan(beta)', tex: 'x = \\frac{h_w}{\\tan\\beta}',
      vars: {
        x: { name: 'distance from the window wall at which the ray lands', q: 'length', unit: 'm' },
        hw: { name: 'height of the window edge above the floor', q: 'length', unit: 'm', value: 2.2, tex: 'h_w' },
        beta: { name: 'elevation of the Sun, measured in the plane at right angles to the window', q: 'angle', unit: '°', value: 30, min: 5, max: 85, tex: '\\beta' }
      },
      note: 'The ray through the window head gives the far edge of the sun patch, the ray through the sill the near edge.',
      stories: { x: 'The Sun is {beta} high, straight in front of a window whose edge is {hw} above the floor. How far from the wall does that ray land?' }
    }
  ],
  examples: [
    {
      title: 'Is the room daylit?',
      q: 'A room 5 m × 4 m × 2.7 m has a window of 4 m² glazed with $T = 0.7$, seeing the sky at $\\theta = 60°$. Its surfaces have a mean reflectance of 0.5. Find the average daylight factor and the average illuminance under the 10 000 lx design sky.',
      steps: [
        { text: 'The surface area is $2\\times 20 + 2\\times(5+4)\\times 2.7 = 88.6$ m².' },
        { text: 'The daylight factor:', tex: '\\mathrm{DF} = \\frac{0.7\\times 4\\times 60}{88.6\\times(1 - 0.25)} = 2.5\\ \\%' },
        { text: 'The illuminance under a 10 000 lx sky: $0.025\\times 10\\,000 = 250$ lx.' }
      ],
      a: 'An average daylight factor of 2.5 % and 250 lx: in the band of 2–5 %, where daylight helps but electric light is needed to reach 500 lx for desk work.'
    },
    {
      title: 'Where the Sun lands',
      q: 'A window has its sill at 0.9 m and its head at 2.2 m above the floor. The Sun is 30° high and shines straight through it. Where does the sun patch lie, and how bright is the direct light on a surface facing the Sun, with an extinction coefficient of 0.2?',
      steps: [
        { text: 'The patch starts at $0.9/\\tan 30° = 1.56$ m and ends at $2.2/\\tan 30° = 3.81$ m from the window wall.' },
        { text: 'The air mass is $1/\\sin 30° = 2$, and the illuminance facing the Sun:', tex: 'E_{dn} = 133\\,800\\times e^{-0.2\\times 2} = 89\\,800\\ \\mathrm{lx}' }
      ],
      a: 'A patch from 1.56 to 3.81 m from the window wall; about 90 000 lx facing the Sun, and 45 000 lx on the floor (times sin 30°), a hundred times the usual 500 lx of an office.'
    }
  ],
  quiz: [
    { q: 'About how many lux does the Sun give to a surface facing it, high in a clear sky?', choices: ['1000', '10 000', '100 000', '1 000 000'], a: 2, why: 'About 100 000 lx (and 120 000 with the sky). A bright overcast day gives 10 000–20 000 lx, an office 500 lx.' },
    { q: 'The daylight factor of a room is the same on a bright overcast day and on a dark one.', a: true, why: 'It is a ratio of indoor to outdoor illuminance, both under the same overcast sky, so the weather cancels. The illuminance itself is ten times higher on the bright day.' },
    { q: 'A room has an average daylight factor of 3 %. Under the 10 000 lx design sky, what is the average illuminance in lux? (Enter the number.)', answer: 300, why: '$E = \\mathrm{DF}\\times E_{out} = 0.03\\times 10\\,000 = 300$ lx.' },
    { q: 'Which is the colour temperature of the CIE standard illuminant D65?', choices: ['About 2700 K', 'About 5000 K', 'About 6500 K', 'About 25 000 K'], a: 2, why: 'D65 has a correlated colour temperature of 6504 K, the average daylight of Sun and sky together. D50 is 5003 K; 25 000 K is the colour of a very blue sky.' },
    { q: 'The Sun stands 20° high. How far from the window wall does the ray through a window head 2.2 m above the floor land, in metres? (Enter the number.)', answer: 6.04, why: '$x = h/\\tan\\beta = 2.2/\\tan 20° = 6.04$ m. A low Sun reaches far into the room, a high Sun hardly at all.' }
  ],
  applications: [
    'Architecture and building design: window sizes, orientations and shading are sized by the daylight factor and sun-path geometry.',
    'Colour work: D65 and D50 booths and displays make colour judgments comparable.',
    'Photography: daylight film, white balance and the golden hour are all about the colour temperature of the Sun and sky.',
    'Daylight-linked lighting control, which dims the electric light as the daylight in the room rises.',
    'Solar energy: the direct normal component of sunlight is what concentrators use, the diffuse part what flat panels and windows share.'
  ],
  history: 'Standard daylight spectra come from measurements in the 1960s: Judd, MacAdam and Wyszecki published in 1964 the daylight series that became the CIE illuminants D50, D55, D65 and D75. The daylight factor was developed in Britain in the early 20th century and the overcast-sky model of Moon and Spencer (1942) gave the luminance distribution that the CIE adopted as its standard overcast sky.',
  sources: [
    'D. B. Judd, D. L. MacAdam and G. Wyszecki, "Spectral distribution of typical daylight as a function of correlated color temperature", *Journal of the Optical Society of America* 54 (1964) — the daylight spectra behind D65.',
    'CIE S 011/E:2003 (ISO 15469:2004), *Spatial distribution of daylight — CIE standard general sky* — the overcast and clear sky luminance distributions.',
    'BS 8206-2:2008, *Lighting for buildings — Code of practice for daylighting* — the daylight factor and the average-factor formula.'
  ],
  sim: 'il-daylight'
}

);
