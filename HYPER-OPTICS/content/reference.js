/* HYPER-OPTICS · content/reference.js — the three reference concepts for the writers of Hyper Optics.
 * Their depth, tone, numbers, tables, terms, formulas and practical advice are the model (see also sims/reference.js):
 *   snells-law     a law of physics: the idea, the formula, what it means, where it leads
 *   the-f-number   an engineering term: what the number is, what it controls, how to read it on real equipment
 *   c-mount        a piece of hardware: its dimensions, what fits what, what goes wrong
 */
Hyper.add(

/* ================================================================ a law */
{
  id: 'snells-law', parent: 'refraction-and-snell', title: 'Snell\'s law', level: 1,
  short: 'When light crosses from one transparent material into another it changes direction. The product of the refractive index and the sine of the angle from the normal is the same on both sides: n₁ sin θ₁ = n₂ sin θ₂. Every lens, prism and fibre is this one rule applied to a shaped surface.',
  keywords: ['refraction', 'Snell', 'Descartes', 'law of refraction', 'angle of incidence', 'angle of refraction', 'normal', 'bending of light', 'refractive index', 'n1 sin theta1', 'AOI'],
  prereq: ['refractive-index', 'law-of-reflection'],
  related: ['critical-angle-and-total-internal-reflection', 'fresnel-reflection', 'dispersion-and-the-spectrum', 'fermats-principle', 'refraction-at-a-curved-surface', 'physics:refraction', 'math:trig-functions', 'feynman:least-time'],
  body: `
Put a straw in a glass of water and it looks broken at the surface. The straw is fine; the light coming from its lower half changed direction as it left the water. That change of direction at a boundary is **refraction**, and it follows one rule.

### The rule
Draw the **normal** — the line perpendicular to the surface at the point where the ray arrives — and measure both angles from it, never from the surface. The ray arrives at the **angle of incidence** $\\theta_1$ in a material of index $n_1$ and leaves at the **angle of refraction** $\\theta_2$ in a material of index $n_2$:

$$n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2$$

The incident ray, the refracted ray and the normal all lie in one plane, the **plane of incidence**. That is the whole law. In words: the quantity $n\\sin\\theta$ is carried unchanged across the surface.

### What it means
- **Into a denser medium, towards the normal.** From air ($n = 1.000$) into crown glass ($n = 1.517$) a ray arriving at 40° continues at 25.1°. The higher the [[refractive-index|index]], the slower the light and the harder the turn.
- **Out again, away from the normal.** The law is symmetric: reverse the ray and it retraces its path. A ray leaving glass at 25.1° emerges into air at 40°.
- **Straight on, straight through.** At $\\theta_1 = 0$ there is no bending at all, only a change of speed.
- **For small angles the sines are the angles.** Below about 10°, $n_1\\theta_1 \\approx n_2\\theta_2$: the bending is simply proportional. This [[the-paraxial-approximation|paraxial]] form is what makes the lens equation linear.

| From air into | $n$ (yellow light) | A ray at 30° continues at | A ray at 60° continues at |
|---|---|---|---|
| water | 1.333 | 22.0° | 40.5° |
| acrylic | 1.492 | 19.6° | 35.5° |
| crown glass N-BK7 | 1.517 | 19.2° | 34.8° |
| dense flint N-SF11 | 1.785 | 16.3° | 29.0° |
| diamond | 2.418 | 11.9° | 21.0° |

### Why light does it
Light travels more slowly in glass than in air — by exactly the factor $n$. A wavefront arriving at an angle meets the surface one end first; that end slows while the other is still in air, and the front swings round, as a line of marchers wheels when one side steps into mud. Seen another way ([[fermats-principle|Fermat]]), the bent path is the *quickest* one between two points on opposite sides of the surface: it pays to travel a little farther in the fast medium to save distance in the slow one. Both pictures give the same sines.

### When there is no answer
Going from a dense medium to a rarer one, $\\sin\\theta_2 = (n_1/n_2)\\sin\\theta_1$ can exceed 1, and no angle has a sine greater than 1. The refracted ray then does not exist: all the light is reflected. The angle of incidence at which this begins is the [[critical-angle-and-total-internal-reflection|critical angle]], 41.2° for crown glass in air — the principle of prisms in binoculars and of every optical fibre.

### What Snell's law does not say
It gives directions, not amounts. How much of the light is refracted and how much reflected is the business of [[fresnel-reflection|Fresnel's equations]] — about 4 % reflects at a glass surface at normal incidence. And because $n$ depends on the wavelength, each colour obeys the law with its own index: that is [[dispersion-and-the-spectrum|dispersion]], the reason a prism makes a spectrum and a simple lens has coloured fringes.

> [!tip] In catalogues and coating specifications the angle of incidence is abbreviated **AOI**, and it is always measured from the normal: AOI 0° is head-on, AOI 45° is the usual beam-splitter position.

> [!key] $n \\sin\\theta$ is the same on both sides of a surface. Measure from the normal; a denser medium bends the ray towards it.
`,
  ideas: [
    'n₁ sin θ₁ = n₂ sin θ₂, with both angles measured from the normal to the surface.',
    'Entering a higher index the ray bends towards the normal; entering a lower one, away from it.',
    'The path is reversible: a ray sent backwards retraces itself.',
    'The cause is the change of speed: light is slower by the factor n in the denser medium.',
    'From dense to rare the law can have no solution: beyond the critical angle all the light is reflected.'
  ],
  pitfalls: [
    'The angles are measured from the surface — They are measured from the normal. A ray "at 30° to the glass" has an angle of incidence of 60°.',
    'Light bends because glass is denser (heavier) — What matters is the optical density, the refractive index. Some plastics are lighter than water and bend light more.',
    'The frequency of the light changes in the glass — The frequency stays the same; the speed and the wavelength both fall by the factor n.',
    'Snell\'s law tells how bright the refracted ray is — It gives only the direction. The split between reflected and transmitted light comes from Fresnel\'s equations.'
  ],
  terms: [
    { term: 'Refraction', def: 'The change in direction of light as it passes from one transparent medium into another in which it travels at a different speed.' },
    { term: 'Normal', def: 'The line perpendicular to a surface at the point where a ray meets it. Angles of incidence, reflection and refraction are all measured from it.' },
    { term: 'Angle of incidence', also: ['AOI', 'θ₁'], def: 'The angle between an arriving ray and the normal to the surface. 0° is head-on (normal incidence); 90° is grazing.' },
    { term: 'Angle of refraction', also: ['θ₂'], def: 'The angle between the refracted ray and the normal, on the far side of the surface.' },
    { term: 'Plane of incidence', def: 'The plane containing the incident ray and the normal. The reflected and refracted rays lie in it too.' },
    { term: 'Snell\'s law', also: ['law of refraction', 'Snell–Descartes law'], def: 'n₁ sin θ₁ = n₂ sin θ₂: the refractive index times the sine of the angle from the normal is unchanged across a surface.' }
  ],
  derivation: {
    title: 'Snell\'s law from wavefronts',
    intro: 'Let a plane wave arrive at a flat surface. Two points of one wavefront, A and B, are a distance apart; A is on the surface already, B has still to travel.',
    steps: [
      { text: 'While B covers the remaining distance to the surface at speed $c/n_1$, in a time $t$, the light from A travels in the second medium at speed $c/n_2$:', tex: 'BB\' = \\frac{c}{n_1}\\,t \\qquad AA\' = \\frac{c}{n_2}\\,t' },
      { text: 'The stretch of surface between A and B′ is the hypotenuse of two right-angled triangles, one on each side. The angle each wavefront makes with the surface equals the angle its ray makes with the normal:', tex: '\\sin\\theta_1 = \\frac{BB\'}{AB\'} \\qquad \\sin\\theta_2 = \\frac{AA\'}{AB\'}' },
      { text: 'Divide one by the other; the common hypotenuse and the time cancel:', tex: '\\frac{\\sin\\theta_1}{\\sin\\theta_2} = \\frac{BB\'}{AA\'} = \\frac{n_2}{n_1}' },
      { text: 'which is Snell\'s law:', tex: 'n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2' }
    ]
  },
  formulas: [
    {
      name: 'Snell\'s law',
      expr: 'n1*sin(t1) = n2*sin(t2)', tex: 'n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2',
      vars: {
        n1: { name: 'index of the first medium', value: 1.0, min: 1, max: 4, tex: 'n_1' },
        t1: { name: 'angle of incidence', q: 'angle', unit: '°', value: 40, min: 0, max: 90, tex: '\\theta_1' },
        n2: { name: 'index of the second medium', value: 1.517, min: 1, max: 4, tex: 'n_2' },
        t2: { name: 'angle of refraction', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\theta_2' }
      },
      solveFor: 't2',
      note: 'Angles from the normal. No solution for θ₂ means total internal reflection.',
      stories: {
        t2: 'A ray in a medium of index {n1} meets a medium of index {n2} at {t1} from the normal. At what angle does it continue?',
        n2: 'A ray passes from a medium of index {n1}, where it makes {t1} with the normal, into an unknown liquid, where it makes {t2}. What is the liquid\'s index?'
      }
    },
    {
      name: 'Deviation at the surface',
      expr: 'd = t1 - asin(n1*sin(t1)/n2)', tex: '\\delta = \\theta_1 - \\arcsin\\!\\left(\\frac{n_1 \\sin\\theta_1}{n_2}\\right)',
      vars: {
        d: { name: 'change of direction', q: 'angle', unit: '°', signed: true, tex: '\\delta' },
        t1: { name: 'angle of incidence', q: 'angle', unit: '°', value: 40, min: 0, max: 90, tex: '\\theta_1' },
        n1: { name: 'index of the first medium', value: 1.0, min: 1, max: 4, tex: 'n_1' },
        n2: { name: 'index of the second medium', value: 1.517, min: 1, max: 4, tex: 'n_2' }
      },
      note: 'How far the ray turns: zero at normal incidence, growing ever faster towards grazing incidence.',
      practice: { unknowns: ['d'] }
    },
    {
      name: 'Snell\'s law for small angles',
      expr: 'n1*t1 = n2*t2', tex: 'n_1\\,\\theta_1 \\approx n_2\\,\\theta_2',
      vars: {
        n1: { name: 'index of the first medium', value: 1.0, min: 1, max: 4, tex: 'n_1' },
        t1: { name: 'angle of incidence', q: 'angle', unit: '°', value: 6, min: 0, max: 15, tex: '\\theta_1' },
        n2: { name: 'index of the second medium', value: 1.517, min: 1, max: 4, tex: 'n_2' },
        t2: { name: 'angle of refraction', q: 'angle', unit: '°', min: 0, max: 15, tex: '\\theta_2' }
      },
      solveFor: 't2',
      note: 'The paraxial form: good to 1 % below about 14°.'
    }
  ],
  examples: [
    {
      title: 'Into a window',
      q: 'A ray of yellow light strikes a window of N-BK7 glass ($n = 1.517$) at 55° from the normal. At what angle does it travel inside the glass, and at what angle does it leave the far side?',
      steps: [
        'Apply the law at the first surface, air to glass: $1.000 \\sin 55° = 1.517 \\sin\\theta_2$.',
        { text: 'Solve for the angle inside:', tex: '\\sin\\theta_2 = \\frac{0.8192}{1.517} = 0.5400 \\quad\\Rightarrow\\quad \\theta_2 = 32.7°' },
        'The two faces of a window are parallel, so the ray meets the second face at the same 32.7°. Glass to air: $1.517 \\sin 32.7° = 1.000 \\sin\\theta_3$, giving $\\theta_3 = 55°$.'
      ],
      a: '32.7° inside the glass; it leaves at 55°, parallel to its original direction but shifted sideways.'
    },
    {
      title: 'Naming a liquid',
      q: 'A laser beam enters a tank of clear liquid from air at 50.0° to the normal and is seen to travel at 34.5° inside. What is the refractive index of the liquid?',
      steps: [
        { text: 'Solve Snell\'s law for the unknown index:', tex: 'n_2 = \\frac{n_1 \\sin\\theta_1}{\\sin\\theta_2} = \\frac{1.000 \\times 0.7660}{0.5664}' },
        'That is 1.352 — close to ethanol (1.36) and well above water (1.333).'
      ],
      a: '$n = 1.35$. Measuring two angles is the simplest refractometer.'
    }
  ],
  quiz: [
    { q: 'A ray passes from water ($n = 1.33$) into glass ($n = 1.52$). Compared with its direction in the water, in the glass it is…', choices: ['closer to the normal', 'farther from the normal', 'unchanged', 'reflected back entirely'], a: 0, why: 'The glass has the higher index, so $\\sin\\theta$ must be smaller there: the ray bends towards the normal. Total reflection can only happen going from the higher index to the lower.' },
    { q: 'A ray strikes a glass block at normal incidence ($\\theta_1 = 0$). It slows down but does not change direction.', a: true, why: 'With $\\sin 0 = 0$ on one side, the sine on the other side is zero too. The speed and the wavelength still fall by the factor $n$.' },
    { q: 'A ray in air meets a surface at 30° **to the surface**. What is its angle of incidence?', choices: ['30°', '60°', '90°', '120°'], a: 1, why: 'Angles are measured from the normal, which is perpendicular to the surface: $90° - 30° = 60°$.' },
    { q: 'Light goes from air into diamond ($n = 2.42$) at 60° from the normal. What is the angle of refraction, in degrees?', answer: 20.97, unit: '°', why: '$\\sin\\theta_2 = \\sin 60°/2.42 = 0.3579$, so $\\theta_2 = 21.0°$. Diamond\'s high index turns even steep rays nearly along the normal.' },
    { q: 'Which change makes a ray from air into a liquid bend **more**?', choices: ['A liquid of higher refractive index', 'A liquid of lower density but the same index', 'A brighter light', 'A thicker layer of liquid'], a: 0, why: 'Only the two indices and the angle of incidence appear in the law. Brightness, thickness and mass density do not.' }
  ],
  applications: [
    'Every lens: each ray is refracted twice, at the front surface and at the back, by this law. A lens designer\'s software applies it millions of times an hour.',
    'Spectacles, contact lenses and the cornea of the eye itself, which does two thirds of the eye\'s focusing by refraction at its front surface.',
    'Prisms that turn, invert or split beams, and prism spectrometers that separate colours.',
    'Refractometers: a winemaker reads the sugar content of grape juice, and a jeweller identifies a gem, from the angle at which light is refracted.',
    'Spearfishing, and judging the depth of a swimming pool: the fish and the floor are not where they appear to be.'
  ],
  history: 'The law was found by experiment several times. Ibn Sahl in Baghdad used it to design lenses in 984; Thomas Harriot in England had it by 1602 and Willebrord Snel in Leiden in 1621, neither publishing. René Descartes printed it in 1637 in the form with sines. In French it is the law of Descartes; elsewhere it carries Snel\'s name with a doubled l.',
  sources: [
    'E. Hecht, *Optics*, ch. 4 (The Propagation of Light) — the law from Huygens\' construction and from Fermat\'s principle.',
    'F. A. Jenkins and H. E. White, *Fundamentals of Optics*, ch. 1 and 2 — refraction at plane surfaces.',
    'R. Rashed, "A pioneer in anaclastics: Ibn Sahl on burning mirrors and lenses", *Isis* 81 (1990) — the tenth-century statement of the law.'
  ],
  sim: 'ref-snell'
},

/* ================================================================ a term */
{
  id: 'the-f-number', parent: 'paraxial-systems', title: 'The f-number', level: 2,
  short: 'The f-number N is the focal length of a lens divided by the diameter of its entrance pupil: an f = 50 mm lens with a 25 mm opening is "f/2". That one ratio sets three things at once — how much light reaches the image, how deep the zone of sharp focus is, and how small a point diffraction allows.',
  keywords: ['f-number', 'f-stop', 'f/#', 'focal ratio', 'relative aperture', 'aperture', 'speed of a lens', 'fast lens', 'stop', 'working f-number', 'T-stop', 'N', 'f/2.8', 'full stop'],
  prereq: ['focal-length-and-optical-power', 'entrance-and-exit-pupils', 'aperture-stop'],
  related: ['numerical-aperture', 'aperture-and-f-stops', 'depth-of-field', 'the-airy-disk', 'exposure-and-the-exposure-triangle', 'depth-of-focus', 'diffraction-limited-mtf'],
  body: `
Engraved on the front of every camera lens is something like **1:2.8** or **f/1.8**. It is the most quoted number in optics after the focal length, and it is a pure ratio:

$$N = \\frac{f}{D}$$

where $f$ is the focal length and $D$ the diameter of the **[[entrance-and-exit-pupils|entrance pupil]]** — the opening as it appears when you look into the front of the lens. It is written f/2.8 because that is literally the diameter: the focal length divided by 2.8. A 100 mm lens at f/4 has a 25 mm opening; a 16 mm lens at f/4 has a 4 mm one. Different holes, the same f-number — and, as it turns out, the same brightness of image.

### Why a ratio and not a diameter
The light a lens collects from a distant scene grows with the *area* of the opening, as $D^2$. But the image it forms is spread over an area that grows as $f^2$: double the focal length and the picture of the Moon is twice as wide, four times the area. Light per unit area of image therefore goes as $(D/f)^2 = 1/N^2$. Two lenses of the same f-number put the same illuminance on the sensor, whatever their size. That is why exposure tables can be written in f-numbers.

### The scale of stops
Because the light goes as $1/N^2$, multiplying $N$ by $\\sqrt{2}$ halves it. The standard **full stops** are the powers of $\\sqrt 2$:

| f-number | 1 | 1.4 | 2 | 2.8 | 4 | 5.6 | 8 | 11 | 16 | 22 | 32 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| relative light | 1 | 1/2 | 1/4 | 1/8 | 1/16 | 1/32 | 1/64 | 1/128 | 1/256 | 1/512 | 1/1024 |
| Airy disc, green light (µm) | 1.3 | 1.9 | 2.7 | 3.8 | 5.4 | 7.5 | 10.7 | 14.8 | 21.5 | 29.5 | 42.9 |

A *small* f-number is a *large* opening: a "fast" lens, because it allows a short exposure. "Stopping down" means raising the f-number.

### Three consequences of one number
1. **Light.** Image illuminance is proportional to $1/N^2$ (see [[exposure-and-the-exposure-triangle]]). From f/2 to f/8 is four stops: one sixteenth of the light.
2. **Depth.** The cone of rays converging on each image point has a half-angle $\\theta'$ with $\\tan\\theta' = 1/(2N)$. A slim cone (large $N$) stays narrow for a long way either side of the focus, so both the [[depth-of-focus|depth of focus]] at the sensor and the [[depth-of-field|depth of field]] in the scene grow in proportion to $N$.
3. **Diffraction.** However perfect the lens, a point images as an [[the-airy-disk|Airy disc]] of diameter $2.44\\,\\lambda N$: 2.7 µm at f/2 in green light, 21 µm at f/16. With pixels of 3 µm, a lens stopped beyond about f/5.6 is blurring more than the sensor can resolve.

So opening up gives light and resolution but costs depth and exposes the lens's [[what-aberrations-are|aberrations]], which grow steeply with aperture; stopping down buys depth and hides aberrations until diffraction takes over. Most camera lenses are sharpest two or three stops below their maximum opening.

### f-number and numerical aperture
Microscopists and fibre engineers describe the same cone by its **[[numerical-aperture|numerical aperture]]**, $\\mathrm{NA} = n\\sin\\theta'$. For a well-corrected lens focused at infinity, in air,

$$\\mathrm{NA} = \\frac{1}{2N}$$

so f/2 is NA 0.25 and f/8 is NA 0.0625.

### Close up: the working f-number
The definition assumes a distant object. Focus closer and the lens moves away from the sensor, the cone narrows, and the image gets dimmer. The **working f-number** is

$$N_w = N\\,(1 + |m|)$$

for magnification $m$ (and a lens whose two pupils are the same size). At 1:1 an f/4 macro lens behaves as f/8 — two stops less light and twice the diffraction blur. Machine-vision and microscope calculations must use $N_w$, not the engraved number.

### T-stops
Glass absorbs and surfaces reflect, so a real f/2 lens passes perhaps 85–95 % of what the geometry promises. Cinema lenses are therefore marked in **T-stops**: $T = N/\\sqrt{\\tau}$ with $\\tau$ the transmittance. A lens of f/2 that transmits 80 % is T2.2. Exposure follows the T-stop; depth of field and diffraction follow the f-number.

> [!key] $N = f/D$. Light on the image goes as $1/N^2$, depth as $N$, the diffraction blur as $\\lambda N$. Each full stop — a factor $\\sqrt 2$ in $N$ — halves the light.
`,
  ideas: [
    'N = f/D: focal length over entrance-pupil diameter. A small N is a large opening.',
    'Image illuminance goes as 1/N²; each full stop (×√2 in N) halves the light.',
    'The cone of light at the image has tan θ′ = 1/(2N); for a distant object NA = 1/(2N).',
    'The Airy disc is 2.44 λN across: stopping down eventually blurs the image by diffraction.',
    'Close up, use the working f-number N(1 + |m|).'
  ],
  pitfalls: [
    'f/16 is a bigger aperture than f/4 — The f-number divides the focal length: f/16 is a quarter of the diameter of f/4, and one sixteenth of the light.',
    'A bigger lens of the same f-number gives a brighter image — It collects more light but spreads it over a proportionally larger image; the illuminance on the sensor is the same.',
    'Stopping down always sharpens the picture — Only until diffraction dominates. With small pixels that happens as early as f/4 to f/8.',
    'The f-number engraved on the lens applies at any distance — It is defined for an object at infinity. At magnification m the lens works at N(1 + |m|).'
  ],
  terms: [
    { term: 'f-number', also: ['f-stop', 'f/#', 'focal ratio', 'relative aperture', 'N'], def: 'The focal length of a lens divided by the diameter of its entrance pupil. Written f/2.8 or 1:2.8.' },
    { term: 'Stop', also: ['full stop', 'EV step'], def: 'A factor of two in the amount of light. One full stop of aperture is a factor √2 in the f-number: 2, 2.8, 4, 5.6, 8, 11, 16.' },
    { term: 'Fast lens', also: ['lens speed'], def: 'A lens with a small minimum f-number (f/1.4, f/2), which passes much light and so permits a short exposure.' },
    { term: 'Stopping down', def: 'Closing the iris to a larger f-number: less light, more depth of field, fewer aberrations, more diffraction.' },
    { term: 'Working f-number', also: ['effective f-number', 'N_w'], def: 'The f-number that actually applies at a finite object distance: N(1 + |m|) for magnification m. It sets exposure and diffraction in close-up and microscope work.' },
    { term: 'T-stop', also: ['T-number'], def: 'An f-number corrected for the light lost in the glass: T = N/√(transmittance). Used on cinema lenses so that exposure matches from lens to lens.' }
  ],
  formulas: [
    {
      name: 'The f-number',
      expr: 'N = f/D', tex: 'N = \\frac{f}{D}',
      vars: {
        N: { name: 'f-number' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 50 },
        D: { name: 'entrance-pupil diameter', q: 'length', unit: 'mm', value: 17.9 }
      },
      stories: { N: 'A lens of focal length {f} has an entrance pupil {D} across. What is its f-number?', D: 'How wide is the entrance pupil of a {f} lens set to f/{N}?' }
    },
    {
      name: 'Numerical aperture from the f-number',
      expr: 'NA = 1/(2*N)', tex: '\\mathrm{NA} = \\frac{1}{2N}',
      vars: {
        NA: { name: 'numerical aperture (image side)', tex: '\\mathrm{NA}' },
        N: { name: 'f-number', value: 2.8, min: 0.5, max: 64 }
      },
      note: 'For a well-corrected lens in air, object at infinity.'
    },
    {
      name: 'Working f-number',
      expr: 'Nw = N*(1 + m)', tex: 'N_w = N\\,(1 + m)',
      vars: {
        Nw: { name: 'working f-number', tex: 'N_w' },
        N: { name: 'engraved f-number', value: 4, min: 0.5, max: 64 },
        m: { name: 'magnification (size of image ÷ size of object)', value: 1, min: 0, max: 20 }
      },
      note: 'For a lens with equal entrance and exit pupils; m is taken as a positive number.',
      stories: { Nw: 'A macro lens set to f/{N} photographs a coin at a magnification of {m}. At what f-number is it really working?' }
    },
    {
      name: 'Diameter of the Airy disc',
      expr: 'd = 2.44*lambda*N', tex: 'd = 2.44\\,\\lambda\\,N',
      vars: {
        d: { name: 'diameter to the first dark ring', q: 'length', unit: 'µm' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        N: { name: 'f-number', value: 8, min: 0.5, max: 64 }
      },
      stories: { d: 'How wide is the diffraction disc of a perfect lens at f/{N} in light of {lambda}?', N: 'A sensor has pixels 3.45 µm wide. At what f-number is the Airy disc of {lambda} light {d} across?' }
    },
    {
      name: 'T-stop',
      expr: 'T = N/sqrt(tau)', tex: 'T = \\frac{N}{\\sqrt{\\tau}}',
      vars: {
        T: { name: 'T-stop' },
        N: { name: 'f-number', value: 2, min: 0.5, max: 64 },
        tau: { name: 'transmittance of the lens', q: 'ratio', unit: '%', value: 85, min: 1, max: 100, tex: '\\tau' }
      }
    }
  ],
  examples: [
    {
      title: 'Two lenses, one exposure',
      q: 'A phone camera has a lens of 5.6 mm focal length with a 3.1 mm entrance pupil. A full-frame camera carries a 50 mm lens. To what f-number, and what opening, must the big lens be set to put the same illuminance on its sensor?',
      steps: [
        'The phone lens: $N = 5.6/3.1 = 1.8$, that is f/1.8.',
        'Equal illuminance needs an equal f-number, so the 50 mm lens is set to f/1.8 too.',
        { text: 'Its opening is then', tex: 'D = \\frac{f}{N} = \\frac{50\\ \\mathrm{mm}}{1.8} = 27.8\\ \\mathrm{mm}' },
        'Nine times the diameter and 80 times the area of the phone\'s pupil — it gathers 80 times as much light, and for the same field of view spreads it over a sensor 80 times larger in area. Per square millimetre it comes to the same.'
      ],
      a: 'f/1.8, a 27.8 mm opening. Same illuminance; the larger sensor simply collects more light in total, which is why its pictures are less noisy.'
    },
    {
      title: 'When does diffraction beat the pixels?',
      q: 'An industrial camera has 2.4 µm pixels. Taking green light (550 nm), at what f-number does the Airy disc span two pixels?',
      steps: [
        'Two pixels are 4.8 µm. Set $2.44\\,\\lambda N = 4.8$ µm.',
        { text: 'Solve for N:', tex: 'N = \\frac{4.8\\ \\mu\\mathrm{m}}{2.44 \\times 0.55\\ \\mu\\mathrm{m}} = 3.6' }
      ],
      a: 'About f/3.6. Stopped down beyond f/4, this camera\'s lens — however good — resolves less than its sensor could record.'
    }
  ],
  quiz: [
    { q: 'A lens is changed from f/4 to f/8. The light reaching the sensor…', choices: ['falls to one quarter', 'falls to one half', 'doubles', 'is unchanged if the focal length is the same'], a: 0, why: 'Illuminance goes as $1/N^2$: $(4/8)^2 = 1/4$. f/4 to f/8 is two full stops, and each stop is a halving. One half would be f/5.6.' },
    { q: 'Which lens has the largest entrance pupil?', choices: ['200 mm at f/4', '50 mm at f/1.4', '24 mm at f/2', '85 mm at f/1.8'], a: 0, why: '$D = f/N$: 200/4 = 50 mm, against 35.7, 12 and 47.2 mm. A long lens needs a big piece of glass to reach even a modest f-number.' },
    { q: 'Two lenses, a 25 mm and a 100 mm, are both set to f/5.6 and pointed at the same evenly lit wall. Their sensors receive the same illuminance.', a: true, why: 'That is what the f-number is for: the light per unit area of image depends on $N$ alone (apart from transmission losses).' },
    { q: 'An f/2.8 macro lens is used at life size (magnification 1). What is its working f-number?', answer: 5.6, why: '$N_w = N(1 + m) = 2.8 \\times 2 = 5.6$: two stops less light than the engraving says.' },
    { q: 'A photographer stops a lens down from f/8 to f/22 "for maximum sharpness" on a camera with 4 µm pixels and finds the pictures softer. Why?', choices: ['Diffraction: the Airy disc at f/22 is about 30 µm across, many pixels wide', 'Spherical aberration grows as the aperture closes', 'The depth of field shrank', 'The f-number does not affect sharpness'], a: 0, why: 'Aberrations fall on stopping down and depth of field grows, but the diffraction disc $2.44\\lambda N$ grows from 11 µm to 30 µm and smears the detail.' }
  ],
  applications: [
    'Photography: the aperture ring is marked in f-numbers so that exposure can be set without knowing the focal length.',
    'Machine vision: the f-number is chosen to balance light (short exposures for moving parts), depth of field (parts at varying heights) and diffraction against the pixel size.',
    'Telescopes are named by it: an "f/5 Newtonian" has a wide field and short exposures; an "f/15 refractor" a narrow field and a large image scale.',
    'Cinema: T-stops, so that cutting from one lens to another does not change the exposure.',
    'The eye: with a 17 mm focal length it runs from about f/8 in sunlight (2 mm pupil) to f/2.4 at night (7 mm).'
  ],
  history: 'Lens makers of the 1860s and 1870s could not agree how to mark apertures; some numbered them by area, some by exposure time. The ratio of focal length to diameter was proposed by Sutton and Dawson in 1867; with the √2 series of stops it became the general practice in the early 1900s and has been engraved on lenses ever since.',
  sources: [
    'W. J. Smith, *Modern Optical Engineering*, ch. 9 (Stops, Apertures, Pupils and Diffraction) — f-number, numerical aperture and the working f-number.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE) — the definitions on one page each.',
    'ISO 517:2008, *Photography — Apertures and related properties pertaining to photographic lenses* — the standard series and its marking.'
  ],
  sim: 'ref-fnumber'
},

/* ================================================================ a piece of hardware */
{
  id: 'c-mount', parent: 'lens-mounts', title: 'The C-mount', level: 1,
  short: 'The standard lens mount of industrial cameras, microscopes and 16 mm film: a 1-inch thread with 32 turns per inch and a flange focal distance of 17.526 mm. Any C-mount lens fits any C-mount camera — and, with a 5 mm ring, any CS-mount camera.',
  keywords: ['C-mount', 'C mount', '1-32 UN', '17.526', 'flange focal distance', 'flange back', 'machine vision lens', 'CCTV lens', '16 mm', 'CS-mount', 'adapter ring', 'back focus', 'thread mount'],
  prereq: ['lens-mounts-and-flange-distance'],
  related: ['cs-mount', 's-mount-m12', 'f-mount', 'lens-adapters-and-back-focus', 'image-circle-and-sensor-coverage', 'choosing-a-machine-vision-lens', 'sensor-formats-and-pixel-size', 'close-up-and-extension-tubes'],
  body: `
Pick up almost any industrial camera, microscope camera or older surveillance camera and the hole in its front is the same: a thread one inch across. That is the **C-mount**, and it has two numbers.

| | C-mount |
|---|---|
| Thread | 1"-32 UN 2A: nominal diameter 25.4 mm (1 inch), 32 threads per inch (pitch 0.794 mm) |
| Flange focal distance | **17.526 mm** (0.690 inch) in air |
| Thread length on the lens | about 3.8 mm (0.15 inch) |
| Sensors served | 1/3" to about 1.1" (image circles from 6 to about 18 mm); some lenses cover 4/3" |
| Defined in | ANSI B1.1 for the thread; ISO 10935:2009 for microscope C-mounts |

### The flange focal distance
The thread only holds the lens. What makes a mount a *standard* is the **[[lens-mounts-and-flange-distance|flange focal distance]]**: the distance from the flat shoulder of the lens (the flange, which seats against the front of the camera) to the plane where the lens forms its image of a distant object. Every C-mount lens is built to put that image 17.526 mm behind its flange, and every C-mount camera is built with its sensor 17.526 mm behind its front face. Screw one into the other and the image falls on the sensor, with the focus ring taking care of nearer objects.

The tolerance is tight. The [[depth-of-focus|depth of focus]] of an f/1.4 lens on 3.45 µm pixels is about ±5 µm; a sensor that sits 50 µm too deep cannot reach infinity focus with the lens at its stop. That is why cameras have a **back-focus adjustment** — a threaded mount ring locked by small set screws — and why the cover glass and filters in front of the sensor are counted in the design: a plate of glass of thickness $t$ and index $n$ pushes the image back by $t\\,(n-1)/n$, about a third of its thickness.

### C and CS
The [[cs-mount|CS-mount]] uses the *same thread* with a flange distance exactly 5 mm shorter, 12.526 mm. Moving the lens closer to a small sensor lets wide-angle lenses be smaller and cheaper. The consequences, which the simulation below shows:

| Lens | Camera | Result |
|---|---|---|
| C | C | Correct |
| CS | CS | Correct |
| C | CS | The image forms 5 mm behind the sensor. **Fit a 5 mm C-to-CS adapter ring** and it is correct. |
| CS | C | The image forms 5 mm in front of the sensor. No adapter can fix this: the lens would have to sit inside the camera. |

A blurred picture from a new camera is, more often than any optical fault, a missing or a superfluous 5 mm ring.

### What a C-mount lens will cover
The mount says nothing about the size of the image. Each lens is designed for a maximum sensor format — 1/2", 2/3", 1", 1.1" — and its [[image-circle-and-sensor-coverage|image circle]] is that sensor's diagonal: 8, 11, 16 and 17.6 mm. Put a 2/3" lens on a 1.1" sensor and the corners go dark. The clear opening inside a 1-inch thread, about 22 mm, sets the practical upper limit; beyond roughly 1.1" sensors, cameras move to larger mounts — TFL (M35), [[f-mount|F]], M42, M58.

> [!note] The "inch" names of sensors are not their sizes. A 1" sensor has a 16 mm diagonal, a 2/3" sensor 11 mm: the names are the outer diameters of the television camera tubes that sensors replaced. See [[sensor-formats-and-pixel-size]].

### Extension rings
Because the mount is a plain thread, plain threaded rings of 0.5, 1, 5, 10, 20 and 40 mm can be put between lens and camera. Each millimetre of extension moves the whole focusing range closer: a ring of length $x$ on a lens of focal length $f$ adds a magnification $x/f$. A 5 mm ring on a 25 mm lens gives 0.2× — and takes away infinity focus. See [[close-up-and-extension-tubes]].

### Other things called C-mount
- **Microscope C-mounts** are adapters that carry the microscope's intermediate image to the same 17.526 mm plane, often with a reducing lens (0.5×, 0.63×) to match the sensor size.
- **Laser diodes** in a flat copper package are also sold as "C-mount" — no relation.

> [!key] C-mount = 1-inch × 32 TPI thread + 17.526 mm from flange to sensor. CS-mount = the same thread + 12.526 mm. A C lens needs a 5 mm ring on a CS camera; a CS lens cannot be used on a C camera.
`,
  ideas: [
    'A C-mount is a 1"-32 thread and a flange focal distance of 17.526 mm.',
    'The flange distance, not the thread, is what guarantees focus: lens and camera are both built to it.',
    'CS-mount has the same thread and a 12.526 mm flange distance: a C lens on a CS camera needs a 5 mm ring.',
    'The mount does not say which sensor a lens covers: check its format (image circle) against the sensor diagonal.',
    'Extension rings between lens and camera bring the focus closer and remove infinity focus.'
  ],
  pitfalls: [
    'If the lens screws in, it will focus — C and CS share a thread but differ by 5 mm in flange distance. A CS lens screws into a C camera and can never focus on anything farther than a few centimetres.',
    'A 1" C-mount sensor is one inch across — Its diagonal is 16 mm. The inch names come from old camera-tube diameters.',
    'Any C-mount lens suits any C-mount camera — Mechanically yes; optically only if the lens\'s format is at least as large as the sensor and its resolution matches the pixel size.',
    'The flange distance is from the thread\'s end to the sensor — It is from the flat shoulder that seats against the camera face, in air, to the image plane.'
  ],
  terms: [
    { term: 'C-mount', def: 'A lens mount with a 1"-32 UN thread (25.4 mm diameter, 32 threads per inch) and a flange focal distance of 17.526 mm. The standard of machine-vision and microscope cameras.' },
    { term: 'Flange focal distance', also: ['FFD', 'flange back', 'register', 'flange-to-sensor distance'], def: 'The distance from the mounting flange of a lens (or the front face of a camera) to the image plane. Lens and camera must be built to the same value.' },
    { term: 'Back focal length', also: ['BFL', 'back focus'], def: 'The distance from the rear surface of the last lens element to the image plane. Not the same as the flange focal distance, which is measured from the mount.' },
    { term: 'Back-focus adjustment', def: 'A fine adjustment of the camera\'s mount ring that sets the flange-to-sensor distance exactly, so that the lens reaches infinity focus and a zoom stays in focus through its range.' },
    { term: 'C-to-CS adapter', also: ['5 mm ring', 'CS ring'], def: 'A 5 mm threaded spacer that lets a C-mount lens work on a CS-mount camera by restoring its 17.526 mm flange distance.' },
    { term: '1-32 UN', also: ['1"-32 TPI'], def: 'The Unified thread of the C- and CS-mounts: 1 inch nominal diameter, 32 threads per inch.' }
  ],
  formulas: [
    {
      name: 'Image shift caused by a plate of glass',
      expr: 'dz = t*(n - 1)/n', tex: '\\Delta z = t\\,\\frac{n - 1}{n}',
      vars: {
        dz: { name: 'how far the image moves back', q: 'length', unit: 'mm', tex: '\\Delta z' },
        t: { name: 'thickness of the plate', q: 'length', unit: 'mm', value: 1.0 },
        n: { name: 'refractive index of the plate', value: 1.52, min: 1, max: 4 }
      },
      note: 'A filter or cover glass between lens and sensor lengthens the path: add this to the flange distance.',
      stories: { dz: 'A {t} filter of index {n} is put between a lens and its sensor. How far does the image move back?' }
    },
    {
      name: 'Magnification gained from an extension ring',
      expr: 'm = x/f', tex: '\\Delta m = \\frac{x}{f}',
      vars: {
        m: { name: 'added magnification', tex: '\\Delta m' },
        x: { name: 'length of the ring', q: 'length', unit: 'mm', value: 5 },
        f: { name: 'focal length of the lens', q: 'length', unit: 'mm', value: 25 }
      },
      stories: { m: 'A {x} ring is put behind a {f} lens focused at infinity. What magnification does it now give?', x: 'What length of ring gives a {f} lens a magnification of {m}?' }
    },
    {
      name: 'Blur from a wrong flange distance',
      expr: 'b = dz/N', tex: 'b = \\frac{\\Delta z}{N}',
      vars: {
        b: { name: 'diameter of the blur circle', q: 'length', unit: 'µm' },
        dz: { name: 'error in the flange distance', q: 'length', unit: 'µm', value: 50, tex: '\\Delta z' },
        N: { name: 'f-number', value: 2.8, min: 0.5, max: 64 }
      },
      note: 'A point images as a disc of this size when the sensor is a distance Δz from the image plane.',
      stories: { b: 'A sensor sits {dz} too far back and the lens is at f/{N}. How large is the blur of a point?' }
    }
  ],
  examples: [
    {
      title: 'The blurred new camera',
      q: 'A CS-mount camera is delivered with a 16 mm C-mount lens at f/1.4. The picture is a featureless blur at every setting of the focus ring. What is wrong, and how bad is it?',
      steps: [
        'The lens forms its image 17.526 mm behind its flange; the sensor is 12.526 mm behind the camera face. The image lies 5 mm behind the sensor.',
        { text: 'On the sensor a point is a disc of diameter', tex: 'b = \\frac{e}{N} = \\frac{5\\ \\mathrm{mm}}{1.4} = 3.6\\ \\mathrm{mm}' },
        'On a 1/2" sensor 6.4 mm wide, every point of the scene is smeared over more than half the picture. The focus ring moves the lens by a millimetre or two at most — not enough.'
      ],
      a: 'The 5 mm C-to-CS ring is missing. With it the lens sits 5 mm farther out and its image lands on the sensor.'
    },
    {
      title: 'A filter behind the lens',
      q: 'A 2 mm thick infrared-blocking filter ($n = 1.52$) is installed in a camera between the mount and the sensor. By how much must the mount ring be moved, and which way?',
      steps: [
        { text: 'The plate moves the image away from the lens by', tex: '\\Delta z = t\\,\\frac{n-1}{n} = 2 \\times \\frac{0.52}{1.52} = 0.68\\ \\mathrm{mm}' },
        'The image now forms 0.68 mm behind the sensor. Moving the lens towards the sensor would be the wrong way; the sensor must be 0.68 mm farther from the flange — the mount ring is screwed outwards by 0.68 mm.'
      ],
      a: '0.68 mm outwards. Camera makers who fit such filters build the body with a mechanical flange distance of 17.526 mm plus this allowance.'
    }
  ],
  quiz: [
    { q: 'What is the flange focal distance of a C-mount?', choices: ['12.526 mm', '17.526 mm', '25.4 mm', '46.5 mm'], a: 1, why: '17.526 mm (0.690 inch). 12.526 mm is the CS-mount; 25.4 mm is the thread diameter; 46.5 mm is the F-mount.' },
    { q: 'A CS-mount lens is screwed into a C-mount camera. Which is true?', choices: ['It focuses normally', 'It needs a 5 mm spacer ring', 'It cannot focus on distant objects, and no ring will help', 'It will not screw in'], a: 2, why: 'The threads are the same, so it screws in. But the image forms 5 mm in front of the sensor; a ring would move the lens even farther away. Only very close objects can be focused.' },
    { q: 'The thread of a CS-mount is different from that of a C-mount.', a: false, why: 'Both are 1"-32 UN. They differ only in flange focal distance, by 5 mm.' },
    { q: 'A 5 mm extension ring is placed behind a 50 mm C-mount lens set to infinity. What magnification results?', answer: 0.1, why: '$\\Delta m = x/f = 5/50 = 0.1$: the lens now focuses on an object ten times the size of its image, about 550 mm away.' },
    { q: 'A lens marked "2/3 inch, C-mount" is fitted to a camera with a 1.1" sensor. What should you expect?', choices: ['Dark or missing corners: the image circle is smaller than the sensor', 'A blurred image: the flange distance is wrong', 'Nothing unusual', 'The lens will not screw in'], a: 0, why: 'The mount fits and the focus is right, but a 2/3" lens is designed to cover an 11 mm diagonal and the sensor\'s is 17.6 mm.' }
  ],
  applications: [
    'Machine vision: nearly every area-scan camera with a sensor up to about 1.1" has a C-mount, and fixed-focal lenses for it come in a standard series: 6, 8, 12, 16, 25, 35, 50, 75 mm.',
    'Microscopes: the camera port ends in a C-mount, with or without a reduction lens.',
    'Scientific and astronomical cameras, spectrometers and endoscope cameras.',
    '16 mm cine cameras, for which the mount was introduced; old cine lenses still fit modern cameras.',
    'Extension rings, filters holders, beam splitters and lens tubes of optical-bench systems use the same thread.'
  ],
  history: 'The C-mount was introduced by Bell & Howell in the mid-1920s on its Filmo 70 16 mm cine camera, as the successor to its A and B mounts. Television and then closed-circuit cameras adopted it for their 1-inch and 2/3-inch tubes. The CS variant appeared in the 1980s when 1/2-inch and 1/3-inch sensors made the long flange distance a handicap for small wide-angle lenses.',
  sources: [
    'ISO 10935:2009, *Optics and photonics — Microscopes — Interface connection type C* — the dimensions of the microscope C-mount.',
    'ASME/ANSI B1.1, *Unified Inch Screw Threads* — the 1-32 UN thread form.',
    'W. J. Smith, *Modern Optical Engineering*, ch. 2 — the image displacement produced by a plane-parallel plate.',
    'Japan Industrial Imaging Association (JIIA), lens-mount standards for machine-vision lenses — C, CS and the larger TFL mount.'
  ],
  sim: [{ id: 'ref-cmount', params: { lens: 'C', cam: 'CS' } }]
}

);
