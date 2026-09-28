/* HYPER-FEYNMAN · content/light.js — Light and Vision: optics and radiation (FLP I-26 to I-34) and seeing (FLP I-35, I-36).
 * Simulations in sims/light.js (prefix lux-). */
Hyper.add(

{
  id: 'geometrical-optics-feyn', parent: 'optics-topic', title: 'Geometrical optics', level: 1,
  short: 'Rays, lenses and mirrors: a focus is a place that every path from a point reaches in the same time. From that one idea come the lens formula, the focal length of a curved surface, images real and virtual, and the limits of lenses.',
  keywords: ['lens', 'mirror', 'focal length', 'focus', 'image', 'real image', 'virtual image', 'magnification', 'thin lens equation', 'lensmaker', 'ray diagram', 'least time', 'aberration', 'Newtonian form'],
  prereq: ['least-time', 'physics:refraction', 'physics:thin-lenses'],
  related: ['lens-and-least-time', 'diffraction-feyn', 'mechanisms-of-seeing', 'origin-of-refractive-index', 'physics:spherical-mirrors', 'physics:lensmakers-equation', 'physics:optical-instruments', 'physics:magnification'],
  body: `
Long before light was known to be a wave, lens makers could predict where an image would form using nothing but straight lines — rays — and a rule for how they bend. Feynman treated this *geometrical optics* as an application of the principle of least time ([[least-time]]): light goes from one point to another along a path whose travel time is [[?stationary]], no longer or shorter, to first order, than the neighbouring paths. A lens is then a device for making a whole family of paths take **equal** times.

### A focus is a place of equal times
Why do the rays from a point P meet again at a point P′? Because every path from P to P′ through the lens takes the same time. Glass slows light by the factor $n$, its refractive index (why it does is a story of its own: [[origin-of-refractive-index]]), and a converging lens is thickest in the middle. The short, straight path through the centre crosses the most glass; the long, slanting paths near the rim cross the least. The shape is chosen so that the delays balance exactly. If they did not, the paths could not all be stationary, and the light would not come to a point.

### One curved surface
Take a glass surface of radius $R$, a point source a distance $s$ in front of it in air (index $n_1$) and its image a distance $s'$ inside the glass (index $n_2$). A ray that meets the surface at height $h$ travels a little further than the axial ray: by the [[?small-approximation|small-angle approximation]], $\\sqrt{s^2 + h^2} \\approx s + h^2/2s$, so it gains about $h^2/2s$ on the way in and $h^2/2s'$ on the way out. But the surface curves away from it by $h^2/2R$, so that ray crosses that much more air and that much less glass. Weighting every length by its index (time = $n \\times$ length $/c$) and asking that the extra times cancel for every $h$:

$$\\frac{n_1}{s} + \\frac{n_2}{s'} = \\frac{n_2 - n_1}{R}$$

The height $h$ has dropped out, so every ray near the axis meets at the same point: a focus.

### The thin lens and the mirror
Two such surfaces back to back make a thin lens, and their two equations combine into

$$\\frac{1}{s_o} + \\frac{1}{s_i} = \\frac{1}{f}, \\qquad \\frac{1}{f} = (n - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)$$

The [[?inverse|reciprocals]] of the two distances add up to the reciprocal of the focal length $f$ — the image distance of an object infinitely far away. Measured from the two focal points instead ($x = s_o - f$, $x' = s_i - f$), the same law takes the neat Newtonian form $x\\,x' = f^2$. A curved mirror obeys the same rule with $f = R/2$: it is a lens folded back on itself. The size of the image follows from similar triangles: the magnification is $m = -s_i/s_o$, negative for an inverted image.

### Three rays find any image
To find an image by drawing, follow three easy rays from the tip of the object: one parallel to the axis, which leaves through the far focal point $F'$; one through the centre of the lens, which goes straight on; and one through the near focal point $F$, which leaves parallel to the axis. Where they cross is the image. If they spread apart after the lens, extend them backwards: they seem to come from a **virtual** image on the object's side, which the eye can see but a screen cannot catch.

| Object (converging lens) | Image |
|---|---|
| beyond $2f$ | real, inverted, smaller — camera, eye |
| between $f$ and $2f$ | real, inverted, larger — projector |
| at $f$ | at infinity: parallel rays — searchlight |
| inside $f$ | virtual, upright, larger — magnifying glass |
| anywhere, diverging lens | virtual, upright, smaller |

### Where rays stop being enough
Real spherical surfaces are only approximately right: rays far from the axis focus a little short (spherical aberration), and blue light focuses nearer than red because $n$ depends on colour (chromatic aberration). Beyond all craftsmanship lies a limit set by the waves themselves: a lens cannot tell apart two points whose paths through it differ in time by less than about one period of the light. That is [[diffraction-feyn|diffraction]], and it limits every microscope, telescope and eye ([[mechanisms-of-seeing]]).

In the simulation, drag the object and watch the three rays and the image; slide it inside the focal length and the image jumps to the object's side and becomes virtual (dashed). Switch on the fan of rays: every ray from the tip meets the others at one point — the equal-time focus.
`,
  ideas: [
    'A focus is a point that all the paths from a source point reach in the same time; a lens is shaped to make those times equal.',
    'One refracting surface: n₁/s + n₂/s′ = (n₂ − n₁)/R, independent of the height of the ray (for rays near the axis).',
    'A thin lens: 1/sₒ + 1/sᵢ = 1/f with 1/f = (n − 1)(1/R₁ − 1/R₂); a mirror is the same with f = R/2.',
    'Three rays (parallel, central, focal) locate any image; diverging rays mean a virtual image.',
    'Aberrations spoil the ideal focus, and diffraction sets a limit no lens can beat.'
  ],
  pitfalls: [
    'Covering half a lens cuts off half the image — Every part of the lens sends light from every point of the object to its image point; covering half makes the whole image dimmer, not incomplete.',
    'The rays through the thick centre of a lens arrive at the focus later — The centre path is shorter outside the glass; all the paths to the focus take the same time. That is what a focus is.',
    'A virtual image is not there at all — It is where the light seems to come from: your eye (a second lens) makes a real image of it on the retina. Only a screen placed there shows nothing.'
  ],
  formulas: [
    {
      name: 'Thin lens (and mirror) equation',
      expr: '1/so + 1/si = 1/f', tex: '\\frac{1}{s_o} + \\frac{1}{s_i} = \\frac{1}{f}',
      vars: {
        so: { name: 'object distance', q: 'length', unit: 'cm', value: 30, tex: 's_o' },
        si: { name: 'image distance (negative: virtual image on the object side)', q: 'length', unit: 'cm', signed: true, tex: 's_i' },
        f: { name: 'focal length (negative for a diverging lens or convex mirror)', q: 'length', unit: 'cm', value: 10, signed: true }
      },
      solveFor: 'si',
      note: 'Thin lens in air, rays near the axis. For a mirror use f = R/2 and count sᵢ positive in front of the mirror.',
      stories: {
        si: 'An object stands {so} in front of a lens of focal length {f}. Where is the image?',
        so: 'A lens of focal length {f} forms an image {si} behind it. Where is the object?',
        f: 'An object {so} from a lens gives a sharp image {si} behind it. What is the focal length?'
      }
    },
    {
      name: 'Magnification',
      expr: 'm = -si/so', tex: 'm = -\\frac{s_i}{s_o}',
      vars: {
        m: { name: 'magnification (negative: inverted)', signed: true },
        si: { name: 'image distance', q: 'length', unit: 'cm', value: 15, signed: true, tex: 's_i' },
        so: { name: 'object distance', q: 'length', unit: 'cm', value: 30, tex: 's_o' }
      },
      note: 'The ratio of image height to object height, from similar triangles through the centre of the lens.',
      stories: { m: 'An object {so} from a lens gives an image {si} behind it. What is the magnification?' }
    },
    {
      name: 'Focal length from the surfaces (lensmaker)',
      expr: '1/f = (n - 1)*(1/R1 - 1/R2)', tex: '\\frac{1}{f} = (n - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)',
      vars: {
        f: { name: 'focal length', q: 'length', unit: 'cm', signed: true },
        n: { name: 'refractive index of the lens relative to its surroundings', value: 1.5 },
        R1: { name: 'radius of the first surface (positive if its centre is behind it)', q: 'length', unit: 'cm', value: 20, signed: true, tex: 'R_1' },
        R2: { name: 'radius of the second surface', q: 'length', unit: 'cm', value: -20, signed: true, tex: 'R_2' }
      },
      solveFor: 'f',
      note: 'Thin lens. Surroundings other than air: use n = n_lens/n_medium.',
      stories: { f: 'A lens of index {n} has surfaces of radius {R1} and {R2}. What is its focal length?', n: 'A lens with radii {R1} and {R2} has focal length {f}. What is the index of its glass?' }
    },
    {
      name: 'One refracting surface',
      expr: 'n1/so + n2/si = (n2 - n1)/R', tex: '\\frac{n_1}{s_o} + \\frac{n_2}{s_i} = \\frac{n_2 - n_1}{R}',
      vars: {
        n1: { name: 'index on the object side', value: 1, tex: 'n_1' },
        n2: { name: 'index on the image side', value: 1.5, tex: 'n_2' },
        so: { name: 'object distance', q: 'length', unit: 'cm', value: 30, tex: 's_o' },
        si: { name: 'image distance (inside the second medium)', q: 'length', unit: 'cm', signed: true, tex: 's_i' },
        R: { name: 'radius of the surface (positive if convex towards the object)', q: 'length', unit: 'cm', value: 5, signed: true }
      },
      solveFor: 'si',
      note: 'From equal times for all rays near the axis. The cornea of the eye is such a surface.',
      stories: { si: 'A glass rod of index {n2} ends in a convex face of radius {R}. A point source in air ({n1}) is {so} away. Where is its image inside the rod?' }
    }
  ],
  derivation: {
    title: 'The lens formula from equal times',
    steps: [
      { text: 'Put a point source a distance $s$ in front of a curved glass surface (radius $R$) and look for the point at distance $s\'$ inside the glass that all rays reach in the same time. Time is (index × length)/c, so compare the index-weighted lengths of the axial ray and a ray at height $h$.', tex: 'n_1 s + n_2 s\' \\quad\\text{versus}\\quad n_1\\sqrt{s^2 + h^2} + n_2\\sqrt{s\'^2 + h^2} - (n_2 - n_1)\\frac{h^2}{2R}' },
      { text: 'For small $h$ use $\\sqrt{s^2 + h^2} \\approx s + h^2/2s$ (the first term of a [[?taylor-series|Taylor series]]). The last term is the sag of the surface: at height $h$ the ray crosses $h^2/2R$ less glass and as much more air.', tex: '\\sqrt{s^2 + h^2} \\approx s + \\frac{h^2}{2s}' },
      { text: 'Equal times means the extra terms cancel. Every term carries $h^2/2$, so it divides out — the condition is the same for every ray near the axis, which is why a focus exists at all.', tex: 'n_1\\frac{h^2}{2s} + n_2\\frac{h^2}{2s\'} = (n_2 - n_1)\\frac{h^2}{2R} \\;\\Rightarrow\\; \\frac{n_1}{s} + \\frac{n_2}{s\'} = \\frac{n_2 - n_1}{R}' },
      { text: 'A thin lens is two surfaces. The image made by the first (inside the glass) is the object for the second; adding the two equations, the glass distances cancel and only the outer distances and the two radii remain.', tex: '\\frac{1}{s_o} + \\frac{1}{s_i} = (n - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right) = \\frac{1}{f}' }
    ]
  },
  examples: [
    {
      title: 'A camera lens',
      q: 'An object stands 30 cm in front of a converging lens of focal length 10 cm. Where is the image, how large, and which way up?',
      steps: [
        '$1/s_i = 1/f - 1/s_o = 1/10 - 1/30 = 2/30$, so $s_i = 15$ cm behind the lens.',
        '$m = -s_i/s_o = -15/30 = -0.5$.',
        'Positive $s_i$: a real image, which a screen or film can catch.'
      ],
      a: 'A real, inverted image 15 cm behind the lens, half the size of the object.'
    },
    {
      title: 'A magnifying glass',
      q: 'The same lens (f = 10 cm) is held 6 cm from a stamp. What does the eye see?',
      steps: [
        '$1/s_i = 1/10 - 1/6 = (3 - 5)/30 = -1/15$, so $s_i = -15$ cm.',
        'Negative: the image is on the stamp\'s side of the lens — virtual.',
        '$m = -(-15)/6 = +2.5$: upright and 2.5 times larger.'
      ],
      a: 'A virtual, upright image 2.5 times larger, apparently 15 cm behind the lens on the stamp\'s side.'
    },
    {
      title: 'Why things blur under water',
      q: 'A glass lens (n = 1.5) has surfaces of radius 20 cm, one convex each way ($R_1 = +20$ cm, $R_2 = -20$ cm). Find its focal length in air and in water (n = 1.333).',
      steps: [
        'In air: $1/f = 0.5 \\times (1/20 + 1/20) = 0.05\\ \\mathrm{cm^{-1}}$, so $f = 20$ cm.',
        'In water the relative index is $1.5/1.333 = 1.125$: $1/f = 0.125 \\times 0.1 = 0.0125\\ \\mathrm{cm^{-1}}$, so $f = 80$ cm.',
        'The same glass bends light four times less. The cornea of your eye loses most of its power the same way when you open your eyes under water.'
      ],
      a: '20 cm in air, 80 cm in water.'
    }
  ],
  quiz: [
    { q: 'Half of a converging lens that projects a candle onto a screen is covered with card. The image…', choices: ['stays complete but becomes dimmer', 'loses its lower half', 'loses its upper half', 'moves to a new place'], a: 0, why: 'Every point of the lens carries light from every object point to its image point. Covering part of the lens removes some of the paths, not some of the image.' },
    { q: 'Rays through the thick centre of a lens reach the focus later than rays through the thin edge, because they spend longer in the glass.', a: false, why: 'At a focus all paths take the same time: the centre ray spends longer in glass but has a shorter path in air.' },
    { q: 'An object is 20 cm from a converging lens of focal length 10 cm. How far behind the lens is the image?', answer: 20, unit: 'cm', why: '1/sᵢ = 1/10 − 1/20 = 1/20: the image is at 2f, inverted and the same size.' },
    { q: 'A diverging lens forms an image of a real object that is always…', choices: ['virtual, upright and smaller', 'real and inverted', 'virtual, upright and larger', 'real and upright'], a: 0, why: 'With f < 0, 1/sᵢ = 1/f − 1/sₒ is always negative and |sᵢ| < sₒ.' },
    { q: 'A glass lens is put under water. Its focal length…', choices: ['becomes several times longer', 'stays the same', 'becomes shorter', 'becomes negative'], a: 0, why: 'Only the difference in index bends light: n − 1 = 0.5 in air but 1.125 − 1 = 0.125 in water, so f is four times longer.' }
  ],
  problems: [
    { q: 'A projector lens of focal length 10 cm throws a sharp picture on a screen 3.00 m away. How far from the lens is the slide?', answer: 10.34, unit: 'cm', tol: 0.01, hint: 'Solve the lens equation for the object distance.',
      steps: ['$1/s_o = 1/f - 1/s_i = 1/10 - 1/300 = 29/300$ (in cm⁻¹).', '$s_o = 300/29 = 10.34$ cm — just outside the focal length, and the picture is magnified $300/10.34 = 29$ times.'] },
    { q: 'A concave shaving mirror has a radius of curvature of 40 cm. Where is the image of a face 60 cm away?', answer: 30, unit: 'cm', tol: 0.01, hint: 'A mirror has f = R/2.',
      steps: ['$f = 20$ cm.', '$1/s_i = 1/20 - 1/60 = 2/60$, so $s_i = 30$ cm in front of the mirror: real and inverted. (Close to the mirror, inside 20 cm, the face would look upright and magnified.)'] }
  ],
  applications: [
    'Cameras, projectors, microscopes and telescopes are all lenses and mirrors arranged by the lens equation.',
    'The eye focuses by changing the shape of its lens; spectacles add or subtract optical power ([[mechanisms-of-seeing]]).',
    'Headlights and searchlights put the lamp at the focus of a mirror so that the light leaves in a parallel beam.'
  ],
  history: 'Willebrord Snell found the law of refraction in 1621 but did not publish it; René Descartes published it in 1637, and Pierre de Fermat derived it from the principle of least time in 1662. Feynman used Fermat\'s principle to derive the focusing of lenses, and later, in *QED*, showed where least time itself comes from: the arrows of the paths near the quickest one point the same way.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 27 (Geometrical Optics) — the focal length of a spherical surface and of a lens found by making all the times equal, magnification, compound lenses, aberrations and resolving power.',
    'Vol. I, ch. 26 (Optics: The Principle of Least Time) — reflection and refraction from least time, and a focus as a place of equal times.',
    '*QED: The Strange Theory of Light and Matter*, ch. 2 — a lens explained with arrows: the glass delays the short paths so that all the arrows reaching the focus point the same way.'
  ],
  sim: 'lux-rays'
},

{
  id: 'radiation-accelerated-charge', parent: 'optics-topic', title: 'Radiation from an accelerated charge', level: 3,
  short: 'Far from a charge, its electric field is proportional to its sideways acceleration a time r/c earlier, divided by r. A jerked charge sends out a kink in its field lines at the speed of light — and that kink is light.',
  keywords: ['radiation', 'accelerated charge', 'retarded time', 'kink', 'field lines', 'dipole radiation', 'Larmor formula', 'far field', 'antenna', 'electromagnetic wave', 'Liénard–Wiechert', '1/r'],
  prereq: ['em-introduction', 'motion-and-calculus', 'physics:electric-field'],
  related: ['interference-feyn', 'scattering-blue-sky', 'synchrotron-radiation', 'retarded-potentials', 'em-waves-feyn', 'electromagnetic-mass', 'physics:electromagnetic-waves', 'physics:em-wave-energy'],
  body: `
Feynman began the optics of volume I with a daring shortcut. Instead of building up to light from Maxwell's equations (that comes in volume II, [[maxwell-equations-feyn]]), he wrote down at the start the complete law for the electric field of a single charge moving in any way, and argued that nearly all of optics follows from one piece of it together with the rule that the fields of different charges simply add.

### The field of a charge, as it appears
News about a charge travels at the speed of light, so a charge seen from a distance $r$ is seen where it *was*, at the **retarded time** $t - r/c$. The full law says the field has three parts: Coulomb's law, using that apparent distance and direction; a correction for how fast that Coulomb field is changing; and a part proportional to the [[?second-derivative|second derivative]] of the apparent direction — how quickly the [[?unit-vector|unit vector]] pointing at the charge is being swung sideways. The first two parts fall off like $1/r^2$, the third only like $1/r$, so far away it is the only one left. For a charge moving much slower than light, swinging its apparent direction means accelerating sideways, and the far field is

$$\\mathbf{E}(t) = -\\frac{q\\,\\mathbf{a}_\\perp(t - r/c)}{4\\pi\\varepsilon_0 c^2 r}, \\qquad E = \\frac{q\\,a\\sin\\theta}{4\\pi\\varepsilon_0 c^2 r}$$

Here $\\mathbf{a}_\\perp$ is the part of the acceleration across the line of sight, and $\\theta$ is the angle between the acceleration and the line of sight.

### Why a kink: a picture you can draw
Hold a charge still: its field lines are straight spokes. At $t = 0$ jerk it to a speed $v$ within a short time $\\Delta t$, then let it coast. At a later time $t$, the region beyond the sphere $r = ct$ has not yet heard of the jerk: there the spokes still point at the old position. Inside $r = c(t - \\Delta t)$ they point at where the charge is now. Field lines cannot break, so across the thin shell between the two spheres they run sideways — a **kink** travelling outward at the speed of light. That kink is the radiation.

Its strength can be read off the drawing. Across the shell, of thickness $c\\,\\Delta t$, a line is shifted sideways by $vt\\sin\\theta$ — how far the charge has moved, seen across the line of sight. So the sideways field is to the radial field as $vt\\sin\\theta$ is to $c\\,\\Delta t$. Put in $v = a\\,\\Delta t$ and $t = r/c$: $E_\\perp = E_r\\,a r\\sin\\theta/c^2$, and with Coulomb's $E_r = q/4\\pi\\varepsilon_0 r^2$ this is exactly the formula above.

### Reading the formula
- **It is [[?proportional]] to the acceleration.** A charge at rest or in steady motion does not radiate; only a change of velocity sends out a wave.
- **It falls as $1/r$.** The energy flux goes as $E^2 \\propto 1/r^2$ while the area of a sphere grows as $r^2$: the same energy crosses every sphere. It leaves for good.
- **The $\\sin\\theta$ pattern.** Nothing goes out along the line of the acceleration; most goes out broadside — a doughnut around the direction of shaking.
- **Its direction.** $\\mathbf{E}$ lies across the line of sight, opposite to the sideways acceleration; the magnetic field, of size $E/c$, is perpendicular to both.
- **A handy number.** $1/4\\pi\\varepsilon_0 c^2 = 10^{-7}$ in SI units, so $E = 10^{-7}\\,q a\\sin\\theta/r$.

| $\\theta$ | 0° | 30° | 60° | 90° |
|---|---|---|---|---|
| field, relative ($\\sin\\theta$) | 0 | 0.50 | 0.87 | 1 |
| intensity, relative ($\\sin^2\\theta$) | 0 | 0.25 | 0.75 | 1 |

### How much power
Adding up the energy flux $\\varepsilon_0 c E^2$ over a whole sphere (an [[?integral]] of $\\sin^2\\theta$ over the directions) gives Larmor's formula, $P = q^2a^2/6\\pi\\varepsilon_0c^3$. One electron accelerated at $10^{20}\\ \\mathrm{m/s^2}$ radiates only $6\\times10^{-14}$ W. A radio antenna works because enormous numbers of electrons are shaken together, in step, so that their fields add.

> [!key] Far from a charge, the electric field is proportional to its sideways acceleration a time $r/c$ earlier, divided by $r$. With this and the adding of fields, interference, diffraction, the refractive index, scattering and polarization all follow — they are the next pages.

In the simulation, give the charge a kick and watch the kink race outward: it is sharpest broadside and absent along the line of motion. Then shake the charge: a train of kinks becomes a wave, and the graph at the probe shows the field tracing the acceleration, delayed by $r/c$.
`,
  ideas: [
    'A distant charge is seen where it was at the retarded time t − r/c.',
    'Far away only one part of the field survives: E = −q a⊥(t − r/c)/(4πε₀c²r), across the line of sight.',
    'Only acceleration radiates; the field falls as 1/r, so energy flows out through every sphere.',
    'The pattern goes as sin θ: nothing along the line of shaking, most broadside.',
    'Larmor: an accelerated charge radiates the power P = q²a²/(6πε₀c³).'
  ],
  pitfalls: [
    'A moving charge radiates — Only an accelerating one does. A charge in uniform motion carries its field along with it and sends no energy away.',
    'The radiation field falls off like 1/r², as Coulomb\'s law does — It falls like 1/r. That slower fall is exactly what lets energy escape to any distance.',
    'Radiation comes out equally in all directions — Its field goes as sin θ: an antenna sends nothing along its own length.'
  ],
  formulas: [
    {
      name: 'The radiation field of an accelerated charge',
      expr: 'E = q*a*sin(theta)/(4*pi*eps0*c^2*r)', tex: 'E = \\frac{q\\,a\\sin\\theta}{4\\pi\\varepsilon_0 c^2 r}',
      vars: {
        E: { name: 'radiated electric field', q: 'efield', unit: 'V/m' },
        q: { name: 'charge', q: 'charge', unit: 'e', value: 1 },
        a: { name: 'acceleration (at the retarded time t − r/c)', q: 'accel', unit: 'm/s²', value: 1e20 },
        theta: { name: 'angle between the acceleration and the line of sight', q: 'angle', unit: '°', value: 60, min: 0, max: 180, tex: '\\theta' },
        eps0: { const: 'eps0' },
        c: { const: 'c' },
        r: { name: 'distance', q: 'length', unit: 'm', value: 1 }
      },
      note: 'Far field (r much larger than a wavelength), speed much less than c. The field points across the line of sight, opposite to the sideways acceleration.',
      stories: {
        E: 'An electron accelerates at {a}. What field does it radiate at {r}, at {theta} to the acceleration?',
        a: 'A field of {E} is radiated by one electron at a distance of {r}, at {theta} to its acceleration. What was its acceleration?'
      }
    },
    {
      name: 'Power radiated (Larmor)',
      expr: 'P = q^2*a^2/(6*pi*eps0*c^3)', tex: 'P = \\frac{q^2 a^2}{6\\pi\\varepsilon_0 c^3}',
      vars: {
        P: { name: 'radiated power', q: 'power', unit: 'W' },
        q: { name: 'charge', q: 'charge', unit: 'e', value: 1 },
        a: { name: 'acceleration', q: 'accel', unit: 'm/s²', value: 1e20 },
        eps0: { const: 'eps0' },
        c: { const: 'c' }
      },
      note: 'The energy flux ε₀cE² added over a whole sphere. Speeds much less than c.',
      stories: { P: 'An electron is accelerated at {a}. How much power does it radiate?', a: 'An electron radiates {P}. How hard is it being accelerated?' }
    },
    {
      name: 'Energy flux of the radiated field',
      expr: 'I = eps0*c*E^2', tex: 'I = \\varepsilon_0 c E^2',
      vars: {
        I: { name: 'intensity (energy per unit area per second)', q: 'intensity', unit: 'W/m²' },
        eps0: { const: 'eps0' },
        c: { const: 'c' },
        E: { name: 'electric field of the wave', q: 'efield', unit: 'V/m', value: 1 }
      },
      note: 'Instantaneous; for a sinusoidal wave the average is half of the peak value.',
      stories: { I: 'A light wave has an electric field of {E}. How much power does it carry through each square metre?', E: 'Sunlight at the ground carries about {I}. What electric field does that correspond to?' }
    }
  ],
  derivation: {
    title: 'Larmor\'s formula from the far field',
    steps: [
      { text: 'The energy flowing through each square metre per second is $\\varepsilon_0 c E^2$. Put in the far field of the accelerated charge:', tex: 'I(\\theta) = \\varepsilon_0 c \\left(\\frac{q a \\sin\\theta}{4\\pi\\varepsilon_0 c^2 r}\\right)^2 = \\frac{q^2 a^2 \\sin^2\\theta}{16\\pi^2 \\varepsilon_0 c^3 r^2}' },
      { text: 'Add it up over a sphere of radius $r$. A ring of the sphere between $\\theta$ and $\\theta + d\\theta$ has area $2\\pi r^2 \\sin\\theta\\,d\\theta$, so the total is an [[?integral]] over $\\theta$ from 0 to $\\pi$ — and the $r^2$ cancels, as it must if the energy escapes.', tex: 'P = \\int_0^{\\pi} I(\\theta)\\, 2\\pi r^2 \\sin\\theta\\, d\\theta = \\frac{q^2 a^2}{8\\pi \\varepsilon_0 c^3}\\int_0^{\\pi} \\sin^3\\theta\\, d\\theta' },
      { text: 'The integral of $\\sin^3\\theta$ from 0 to $\\pi$ is $4/3$.', tex: 'P = \\frac{q^2 a^2}{8\\pi\\varepsilon_0 c^3}\\cdot\\frac{4}{3} = \\frac{q^2 a^2}{6\\pi\\varepsilon_0 c^3}' }
    ]
  },
  examples: [
    {
      title: 'The field of one shaken electron',
      q: 'An electron accelerates at $10^{20}\\ \\mathrm{m/s^2}$. What field does it radiate 1 m away, broadside and at 60° to the acceleration?',
      steps: [
        'Use $E = 10^{-7}\\, q a \\sin\\theta / r$ (in SI, since $1/4\\pi\\varepsilon_0 c^2 = 10^{-7}$).',
        'Broadside: $E = 10^{-7} \\times 1.602\\times10^{-19} \\times 10^{20} / 1 = 1.60\\times10^{-6}$ V/m.',
        'At 60°: multiply by $\\sin 60° = 0.866$: $1.39\\times10^{-6}$ V/m.'
      ],
      a: '1.6 µV/m broadside, 1.39 µV/m at 60°, and nothing along the line of the acceleration.'
    },
    {
      title: 'How much power?',
      q: 'How much power does that electron radiate in all directions together?',
      steps: [
        '$P = q^2a^2/6\\pi\\varepsilon_0 c^3$.',
        '$q^2 a^2 = (1.602\\times10^{-19})^2 \\times 10^{40} = 256.7$ (SI units).',
        '$6\\pi\\varepsilon_0 c^3 = 6\\pi \\times 8.854\\times10^{-12} \\times 2.694\\times10^{25} = 4.50\\times10^{15}$.',
        '$P = 256.7 / 4.50\\times10^{15} = 5.7\\times10^{-14}$ W.'
      ],
      a: 'About $5.7\\times10^{-14}$ W.'
    },
    {
      title: 'Which way does the field point?',
      q: 'Electrons in a vertical antenna are accelerating upwards at one instant. What field (a time $r/c$ later) does an observer due east at the same height see, and one directly above the antenna?',
      steps: [
        'Due east, the whole acceleration is across the line of sight ($\\theta = 90°$). In $\\mathbf{E} = -q\\mathbf{a}_\\perp/(4\\pi\\varepsilon_0 c^2 r)$ the charge of an electron is $q = -e$, so the two minus signs cancel: $\\mathbf{E}$ points **up**, along the acceleration. (For a positive charge it would point down.)',
        'Directly above, the acceleration is along the line of sight: $\\sin\\theta = 0$, no radiation at all.',
        'This is why a vertical antenna sends vertically polarized waves along the ground and nothing straight up.'
      ],
      a: 'Due east: a vertical field (upwards for accelerating electrons). Overhead: none.'
    }
  ],
  quiz: [
    { q: 'A charge moves in a straight line at a constant 0.9c. How much does it radiate?', choices: ['nothing', 'a little, in proportion to its speed', 'a lot, because it is so fast', 'only if it is an electron'], a: 0, why: 'Radiation needs acceleration. A uniformly moving charge carries its (compressed) field along with it.' },
    { q: 'At twice the distance, the radiation field of a shaken charge is…', choices: ['half as strong', 'a quarter as strong', 'the same', 'an eighth as strong'], a: 0, why: 'The radiation field falls as 1/r; its intensity, ∝ E², falls as 1/r².' },
    { q: 'An observer standing on the line along which a charge is shaken receives the strongest radiation.', a: false, why: 'The field goes as sin θ, where θ is measured from the acceleration: along that line θ = 0 and nothing arrives.' },
    { q: 'The radiation field at distance r and time t is set by the acceleration of the charge at the time…', choices: ['t − r/c', 't', 't + r/c', 'averaged over all times'], a: 0, why: 'The news travels at c: the field now reports what the charge did a time r/c ago.' },
    { q: 'By what factor does the radiated power grow if the acceleration is tripled?', answer: 9, why: 'Larmor: P ∝ a², so 3² = 9.' }
  ],
  problems: [
    { q: 'An electron is accelerated at $10^{20}\\ \\mathrm{m/s^2}$. At what distance, broadside, has its radiation field fallen to 1 nV/m?', answer: 1602, unit: 'm', tol: 0.02, hint: 'E = 10⁻⁷ q a / r broadside.',
      steps: ['$r = 10^{-7}\\, q a / E = 10^{-7} \\times 1.602\\times10^{-19} \\times 10^{20} / 10^{-9}$.', '$r = 1.60\\times10^{3}$ m, about 1.6 km.'] },
    { q: 'How much power does an electron accelerated at $10^{21}\\ \\mathrm{m/s^2}$ radiate?', answer: 5.71e-12, unit: 'W', tol: 0.02, hint: 'Ten times the acceleration of the worked example.',
      steps: ['$P \\propto a^2$: ten times the acceleration gives a hundred times the power.', '$P = 100 \\times 5.71\\times10^{-14} = 5.71\\times10^{-12}$ W.'] }
  ],
  applications: [
    'Radio and radar antennas: currents shaken back and forth make the fields of billions of electrons add in step.',
    'X-ray tubes: electrons stopped suddenly in a metal target radiate (bremsstrahlung, braking radiation).',
    'Synchrotron light sources bend fast electrons in circles to make intense X-rays ([[synchrotron-radiation]]).',
    'The blue sky, the refractive index of glass and the polarization of skylight are all the radiation of electrons shaken by light ([[scattering-blue-sky]], [[origin-of-refractive-index]]).'
  ],
  history: 'Heinrich Hertz made and detected radio waves from sparking circuits in 1886–88. Joseph Larmor gave the power radiated by an accelerated charge in 1897; Alfred-Marie Liénard (1898) and Emil Wiechert (1900) found the exact fields of a charge in arbitrary motion. The picture of a kink running out along the field lines goes back to J. J. Thomson in the early 1900s. Feynman chose to present the law at the start of optics and to justify it only in volume II.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 28 (Electromagnetic Radiation) — the law for the field of a moving charge stated at the start of optics, its radiation part, and the dipole radiator.',
    'Vol. II, ch. 21 (Solutions of Maxwell\'s Equations with Currents and Charges) — the potentials of a moving charge (Liénard and Wiechert), from which the volume I law follows.',
    'Vol. I, ch. 32 (Radiation Damping. Light Scattering) — the rate at which an accelerated charge radiates energy.'
  ],
  sim: 'lux-kink'
},

{
  id: 'interference-feyn', parent: 'optics-topic', title: 'Interference', level: 2,
  short: 'Two sources shine together: their fields add, so the intensity is not the sum of the intensities. Where the waves agree it is four times one source, where they are opposite nothing. Spacing and phase shape the pattern — and many sources in step make a beam that can be steered.',
  keywords: ['interference', 'superposition', 'phase difference', 'two sources', 'antenna', 'phased array', 'beam steering', 'constructive', 'destructive', 'coherence', 'phasor', 'radiation pattern'],
  prereq: ['radiation-accelerated-charge', 'algebra-complex-numbers', 'physics:superposition'],
  related: ['diffraction-feyn', 'bullets-waves-electrons', 'arrow-rule', 'beats-feyn', 'physics:double-slit', 'physics:thin-film-interference', 'math:phasors'],
  body: `
With the law of radiation in hand ([[radiation-accelerated-charge]]) and the rule that fields simply add, Feynman turned to what happens when two or more sources shine together. Nothing new is needed — only careful adding — yet out of it come radio beams, the colours of soap films and the fringes of the [[bullets-waves-electrons|two-slit experiment]].

### Adding two oscillations with arrows
At a distant point each source produces an oscillating field, $A_1\\cos(\\omega t + \\phi_1)$ and $A_2\\cos(\\omega t + \\phi_2)$. Their sum is another oscillation of the same frequency, and the easy way to find its size is to draw each one as a [[?rotating-arrow|rotating arrow]] — length $A$, angle $\\omega t + \\phi$ — and add the arrows head to tail. The actual field is the shadow of the total arrow on the horizontal axis ([[?sine-cosine|a cosine]]). Both arrows turn together, so only the angle between them matters: the [[?phase]] difference $\\delta = \\phi_1 - \\phi_2$. By the law of cosines,

$$A_R^2 = A_1^2 + A_2^2 + 2A_1A_2\\cos\\delta$$

Intensity goes as the square of the [[?amplitude]], so two equal sources give $I = 4I_0\\cos^2(\\delta/2)$: four times one source where they agree, nothing where they are opposite, and twice one source on average. Interference moves energy around; it never creates it.

### Where the phase difference comes from
Put two sources a distance $d$ apart and let the second lag the first by a phase $\\alpha$. In a direction making an angle $\\theta$ with the perpendicular to the pair, the wave from the second source travels an extra distance $d\\sin\\theta$, which costs $2\\pi d\\sin\\theta/\\lambda$ of phase. Altogether

$$\\delta = \\frac{2\\pi d\\sin\\theta}{\\lambda} - \\alpha$$

Just two knobs — spacing and phase — already shape the radiation in striking ways. Feynman worked through several pairs of antennas; here are four:

| Spacing | Driven | Pattern |
|---|---|---|
| $\\lambda/2$ | in step | strong broadside, zero along the line of the pair |
| $\\lambda/2$ | opposite | zero broadside, strong along the line |
| $\\lambda/4$ | 90° apart | strong one way along the line, zero the other way: a one-way beam |
| $\\lambda$ | in step | strong broadside *and* along the line, zero at 30° from broadside |

### Many sources: a steerable beam
With $N$ equally spaced sources, each lagging its neighbour by the same $\\alpha$, the $N$ arrows form a chain, each turned by $\\delta$ from the last. Where $\\delta$ is zero (or a whole number of turns) they all line up: $N^2$ times one source's intensity, concentrated in one direction. A little away from it the chain curls round, and when $N\\delta = 2\\pi$ it closes on itself — the first zero. So the beam's angular width is about $\\lambda/Nd$: the wider the array, the narrower the beam. The direction where the arrows line up is set by the phase step:

$$\\alpha = \\frac{2\\pi d\\sin\\theta_0}{\\lambda}$$

Change $\\alpha$ electronically and the beam swings, with no moving parts: this is how phased-array radars, some satellite and mobile-phone antennas, and arrays of radio telescopes point. If the spacing exceeds a wavelength, the arrows line up again at other angles too — extra beams called grating lobes, the subject of [[diffraction-feyn]].

### Why two lamps do not interfere
Light from two ordinary lamps never shows fringes. Each lamp's atoms radiate in short, independent bursts, so the phase between the two wanders at random many millions of millions of times a second; $\\cos\\delta$ averages to zero and the intensities just add. Interference needs a steady phase relation: two slits lit by the same source, a laser, or antennas fed from one oscillator.

> [!key] Fields add, not intensities: $I = I_1 + I_2 + 2\\sqrt{I_1I_2}\\cos\\delta$. The phase difference comes from spacing, direction and the driving phase — and with many sources it gathers the energy into a beam you can steer.

In the simulation the colours show the field at one instant, the polar curve its intensity far away in every direction, and the chain of arrows the adding for the direction you choose. Start with two sources half a wavelength apart, shift their phase and watch the pattern swing; then take eight and steer the beam.
`,
  ideas: [
    'Fields add; for two waves draw rotating arrows and add them head to tail — only the phase difference δ matters.',
    'Two equal sources: I = 4I₀cos²(δ/2) — from four times one source down to zero, twice on average.',
    'The phase difference in direction θ is δ = 2πd sin θ/λ − α: path difference plus driving phase.',
    'N sources in step make a beam N² times as intense and about λ/(Nd) wide; a phase step α steers it to sin θ₀ = αλ/(2πd).',
    'Independent sources (two lamps) have wandering phases: their intensities simply add.'
  ],
  pitfalls: [
    'Interference destroys energy at the dark places — The energy missing there appears in the bright places; averaged over directions, two sources radiate twice what one does.',
    'Any two light sources will interfere if you look closely — Only sources with a steady phase relation do; two lamps or two stars add their intensities.',
    'A phased array steers its beam by turning the antennas — It changes only the timing (phase) of the signals fed to fixed antennas.'
  ],
  formulas: [
    {
      name: 'Two equal sources',
      expr: 'I = 4*I0*cos(delta/2)^2', tex: 'I = 4I_0\\cos^2\\frac{\\delta}{2}',
      vars: {
        I: { name: 'intensity where both arrive', q: false, unit: 'relative' },
        I0: { name: 'intensity from one source alone', q: false, unit: 'relative', value: 1, tex: 'I_0' },
        delta: { name: 'phase difference between the two waves', q: 'angle', unit: '°', value: 60, min: 0, max: 180, tex: '\\delta' }
      },
      note: 'Equal amplitudes, steady phase difference. For unequal ones, I = I₁ + I₂ + 2√(I₁I₂) cos δ.',
      stories: { I: 'Two equal antennas each give {I0} at a point where their waves differ in phase by {delta}. What do they give together?', delta: 'Each of two equal sources gives {I0}; together they give {I}. What is their phase difference?' }
    },
    {
      name: 'Phase difference of two sources in direction θ',
      expr: 'delta = 2*pi*d*sin(theta)/lambda - alpha', tex: '\\delta = \\frac{2\\pi d\\sin\\theta}{\\lambda} - \\alpha',
      vars: {
        delta: { name: 'phase difference of the waves', q: 'angle', unit: '°', signed: true, tex: '\\delta' },
        d: { name: 'distance between the sources', q: 'length', unit: 'm', value: 0.25 },
        theta: { name: 'direction, from the perpendicular to the pair', q: 'angle', unit: '°', value: 30, min: -90, max: 90, signed: true, tex: '\\theta' },
        lambda: { name: 'wavelength', q: 'length', unit: 'm', value: 1, tex: '\\lambda' },
        alpha: { name: 'phase lag of the second source', q: 'angle', unit: '°', value: 90, signed: true, tex: '\\alpha' }
      },
      note: 'Far away (the rays to the two sources are parallel).',
      stories: { delta: 'Two antennas {d} apart, wavelength {lambda}, the second lagging by {alpha}. What is the phase difference of their waves at {theta} from broadside?' }
    },
    {
      name: 'Steering a beam with a phase step',
      expr: 'alpha = 2*pi*d*sin(theta0)/lambda', tex: '\\alpha = \\frac{2\\pi d\\sin\\theta_0}{\\lambda}',
      vars: {
        alpha: { name: 'phase lag from each antenna to the next', q: 'angle', unit: '°', signed: true, tex: '\\alpha' },
        d: { name: 'antenna spacing', q: 'length', unit: 'm', value: 0.15 },
        theta0: { name: 'direction of the beam, from broadside', q: 'angle', unit: '°', value: 30, min: -90, max: 90, signed: true, tex: '\\theta_0' },
        lambda: { name: 'wavelength', q: 'length', unit: 'm', value: 0.3, tex: '\\lambda' }
      },
      note: 'The beam points where the extra path to each next antenna exactly makes up its lag.',
      stories: { alpha: 'An array of antennas {d} apart works at a wavelength of {lambda}. What phase step points its beam {theta0} from broadside?', theta0: 'Antennas {d} apart at wavelength {lambda} are fed with a phase step of {alpha}. Where does the beam point?' }
    },
    {
      name: 'Width of the beam of N sources',
      expr: 'dtheta = lambda/(N*d)', tex: '\\Delta\\theta = \\frac{\\lambda}{N d}',
      vars: {
        dtheta: { name: 'angle from the beam centre to its first zero', q: 'angle', unit: '°', tex: '\\Delta\\theta' },
        lambda: { name: 'wavelength', q: 'length', unit: 'm', value: 0.3, tex: '\\lambda' },
        N: { name: 'number of sources', int: true, value: 8 },
        d: { name: 'spacing', q: 'length', unit: 'm', value: 0.15 }
      },
      note: 'Broadside beam, small angles. Steered to θ₀, the beam widens by 1/cos θ₀.',
      stories: { dtheta: 'An array of {N} antennas {d} apart works at {lambda}. How wide is its beam (centre to first zero)?', N: 'How many antennas {d} apart are needed at {lambda} for a beam only {dtheta} wide?' }
    }
  ],
  derivation: {
    title: 'Two waves, one arrow',
    steps: [
      { text: 'Write each oscillation as the real part of a rotating arrow (a [[?complex-number|complex number]]): $A\\cos(\\omega t + \\phi) = \\mathrm{Re}\\,A e^{i(\\omega t + \\phi)}$, by [[?euler-formula|Euler\'s formula]].', tex: 'A_1\\cos(\\omega t + \\phi_1) + A_2\\cos(\\omega t + \\phi_2) = \\mathrm{Re}\\left[\\left(A_1 e^{i\\phi_1} + A_2 e^{i\\phi_2}\\right)e^{i\\omega t}\\right]' },
      { text: 'The bracket is a fixed arrow, the sum of the two: the total is an oscillation of the same frequency whose amplitude is its length. The squared length of a complex number is the number times its [[?conjugate]]:', tex: 'A_R^2 = \\left(A_1 e^{i\\phi_1} + A_2 e^{i\\phi_2}\\right)\\left(A_1 e^{-i\\phi_1} + A_2 e^{-i\\phi_2}\\right)' },
      { text: 'Multiply out. The cross terms pair up into a cosine, since $e^{i\\delta} + e^{-i\\delta} = 2\\cos\\delta$:', tex: 'A_R^2 = A_1^2 + A_2^2 + 2A_1A_2\\cos(\\phi_1 - \\phi_2)' },
      { text: 'For equal amplitudes use $1 + \\cos\\delta = 2\\cos^2(\\delta/2)$: intensity, proportional to $A_R^2$, is $4I_0\\cos^2(\\delta/2)$.', tex: 'I = 2I_0(1 + \\cos\\delta) = 4I_0\\cos^2\\frac{\\delta}{2}' }
    ]
  },
  examples: [
    {
      title: 'Two antennas a wavelength apart',
      q: 'Two equal antennas one wavelength apart are driven in step. In which directions do they radiate nothing, and how strong is the broadside beam?',
      steps: [
        '$\\delta = 2\\pi\\sin\\theta$. Zero intensity needs $\\delta = \\pi$ (or $3\\pi$…): $\\sin\\theta = 1/2$.',
        'So the zeros are at $\\theta = \\pm 30°$ from broadside (and the mirror directions behind).',
        'Broadside, $\\delta = 0$: $I = 4I_0$. Along the line of the pair, $\\delta = 2\\pi$: again $4I_0$.'
      ],
      a: 'Nothing at 30° from broadside; four times one antenna both broadside and along the line.'
    },
    {
      title: 'Steering eight antennas',
      q: 'Eight antennas 15 cm apart work at a wavelength of 30 cm. What phase step points the beam 30° from broadside, and about how wide is it?',
      steps: [
        '$\\alpha = 2\\pi d\\sin\\theta_0/\\lambda = 2\\pi \\times 0.5 \\times 0.5 = \\pi/2$, a lag of 90° from each antenna to the next.',
        'Broadside width to the first zero: $\\lambda/Nd = 0.3/(8 \\times 0.15) = 0.25$ rad = 14.3°.',
        'Steered to 30° the beam is wider by $1/\\cos 30° = 1.15$: about 16.5°.'
      ],
      a: 'A 90° phase step; a beam about 16° from centre to first zero.'
    },
    {
      title: 'A one-way pair',
      q: 'Two antennas a quarter wavelength apart, the second lagging by 90°. Compare the intensity along the line of the pair in the two directions, and broadside.',
      steps: [
        'Along the line, $\\sin\\theta = \\pm1$: $\\delta = \\pm\\pi/2 - \\pi/2$, which is $0$ one way and $-\\pi$ the other.',
        'So $4I_0$ in the direction of the lagging antenna and $0$ the other way.',
        'Broadside, $\\delta = -\\pi/2$: $I = 4I_0\\cos^2 45° = 2I_0$.'
      ],
      a: 'Four times one antenna towards the lagging one, nothing the other way, twice broadside.'
    }
  ],
  quiz: [
    { q: 'Two equal sources, in step, half a wavelength apart. Along the line joining them the intensity is…', choices: ['zero', 'four times one source', 'twice one source', 'the same as one source'], a: 0, why: 'Along the line the paths differ by λ/2: the arrows are opposite and cancel.' },
    { q: 'Where two equal sources interfere constructively the intensity is four times one source, so interference creates energy there.', a: false, why: 'The energy comes from the dark places. Averaged over all directions two sources radiate exactly twice what one does.' },
    { q: 'To swing a phased array\'s beam further from broadside you…', choices: ['increase the phase step between neighbouring antennas', 'add more antennas', 'turn the antennas', 'lower the frequency of each antenna separately'], a: 0, why: 'The beam points where 2πd sin θ₀/λ equals the phase step α.' },
    { q: 'Doubling the number of antennas in an array, with the same spacing, makes its beam…', choices: ['about half as wide', 'about twice as wide', 'point in a new direction', 'unchanged'], a: 0, why: 'The width is about λ/(Nd): the array is twice as wide.' },
    { q: 'Two equal sources meet 90° out of phase. What is the intensity, in units of one source alone?', answer: 2, why: '4 cos²(45°) = 2 — the same as if the intensities had simply added.' }
  ],
  problems: [
    { q: 'Two antennas 0.75 m apart are driven at 100 MHz (wavelength 3 m), the second lagging by 90°. What is the broadside intensity in units of one antenna alone?', answer: 2, unit: 'relative', tol: 0.01, hint: 'Broadside the paths are equal.',
      steps: ['Broadside $\\sin\\theta = 0$, so $\\delta = -\\alpha = -90°$.', '$I = 4I_0\\cos^2 45° = 2I_0$.'] },
    { q: 'An array of 64 antennas spaced half a wavelength apart points its beam broadside. About how many degrees is it from the centre of the beam to its first zero?', answer: 1.79, unit: '°', tol: 0.02, hint: 'Δθ = λ/(Nd).',
      steps: ['$\\Delta\\theta = \\lambda/(N d) = 1/(64 \\times 0.5) = 0.03125$ rad.', '$0.03125 \\times 180/\\pi = 1.79°$.'] }
  ],
  applications: [
    'Phased-array radars and antennas steer beams electronically by setting the phase of each element.',
    'Arrays of radio telescopes combine dishes spread over kilometres to make an extremely narrow beam.',
    'Thin films — soap bubbles, oil on water, anti-reflection coatings — colour or cancel reflections by the interference of two reflected waves.',
    'Noise-cancelling headphones add a sound wave of opposite phase.'
  ],
  history: 'Thomas Young demonstrated the interference of light with two slits in 1801–03, and Augustin Fresnel gave it a full wave theory in the 1810s. Radio engineers learned early in the twentieth century that several antennas fed with suitable phases could send a signal in one direction; phased arrays became central to radar and radio astronomy.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 29 (Interference) — the energy of radiation, sinusoidal waves, two dipole radiators with different spacings and phases, and the mathematics of adding them.',
    'Vol. I, ch. 30 (Diffraction) — the resultant of n equal oscillators with a steady phase step: the beam of an array.',
    'Vol. I, ch. 32 (Radiation Damping. Light Scattering) — why independent sources add their intensities.'
  ],
  sim: 'lux-sources'
},

{
  id: 'diffraction-feyn', parent: 'optics-topic', title: 'Diffraction and gratings', level: 2,
  short: 'Interference of very many sources. A grating of N lines sends light only where the path from neighbouring lines differs by whole wavelengths, in sharp beams of width 1/N; a single slit spreads light by about λ/a. Both follow from adding a chain of arrows that curls into a circle.',
  keywords: ['diffraction', 'grating', 'single slit', 'resolving power', 'orders', 'spectrum', 'arrows', 'phasor chain', 'Fraunhofer', 'central maximum', 'circular aperture', 'spectrometer'],
  prereq: ['interference-feyn', 'math:phasors', 'physics:huygens-principle'],
  related: ['every-path-counts', 'geometrical-optics-feyn', 'mechanisms-of-seeing', 'origin-of-refractive-index', 'physics:single-slit-diffraction', 'physics:diffraction-grating', 'physics:resolution'],
  body: `
Diffraction is interference with a great many sources. Feynman treated the two words as a matter of custom rather than of physics: with a few sources we tend to say interference, with many — or with a continuous opening — diffraction. The method does not change. Give each source an arrow and add.

### N equal sources: a chain of arrows
Take $N$ equal sources in a row, spacing $d$, all in step. In a direction $\\theta$ each is behind its neighbour by the phase $\\phi = 2\\pi d\\sin\\theta/\\lambda$. The $N$ arrows, each turned by $\\phi$ from the last, form part of a regular polygon, and since they are all the same length a little geometry gives the total:

$$A_R = A\\,\\frac{\\sin(N\\phi/2)}{\\sin(\\phi/2)}, \\qquad I = I_0\\,\\frac{\\sin^2(N\\phi/2)}{\\sin^2(\\phi/2)}$$

At $\\phi = 0$, and at every whole number of turns, the arrows line up: $N^2 I_0$. As $\\phi$ grows the chain curls, and when $N\\phi = 2\\pi$ it closes into a complete polygon — total **zero**. Between the main peaks there are $N - 2$ small ones, where the chain winds round more than once without quite closing.

### The grating
A diffraction grating is exactly this with $N$ in the thousands: a plate ruled with, say, 600 lines per millimetre. Strong beams leave only where the paths from neighbouring lines differ by a whole number of wavelengths,

$$d\\sin\\theta = m\\lambda, \\qquad m = 0, \\pm1, \\pm2, \\ldots$$

Each colour goes to its own angle, so white light is fanned into spectra — the rainbow on a CD. Each beam is very narrow: the first zero lies only a phase of $2\\pi/N$ away. Two wavelengths $\\lambda$ and $\\lambda + \\Delta\\lambda$ can just be told apart when the peak of one falls on the first zero of the other, which gives the **resolving power**

$$\\frac{\\lambda}{\\Delta\\lambda} = mN$$

### The slit: arrows curling into a circle
A single slit of width $a$ is a continuous row of sources: let $N$ grow without [[?limit]] while $Nd = a$ stays fixed. The polygon of tiny arrows becomes a smooth arc. Straight ahead it is a straight line: full brightness. At an angle, the arrow from one edge of the slit is behind the arrow from the other by $\\Phi = 2\\pi a\\sin\\theta/\\lambda$; the arc bends through that angle, and the total is its chord, $A_R = A_{\\max}\\sin(\\Phi/2)/(\\Phi/2)$. When the arc has bent through a full turn it closes into a circle, and there is darkness:

$$a\\sin\\theta = \\lambda \\qquad \\text{(the first dark direction)}$$

The narrower the slit, the wider the spread. A slit 10 µm wide sends green light (500 nm) out to ±2.9° before the first dark band — on a wall a metre away, a central patch 10 cm across.

| Opening | Pattern |
|---|---|
| two slits | $\\cos^2$ fringes, under the envelope of one slit |
| $N$ slits (grating) | sharp beams at $d\\sin\\theta = m\\lambda$, width $\\propto 1/N$ |
| one slit, width $a$ | bright centre, first zeros at $\\sin\\theta = \\pm\\lambda/a$ |
| round hole, diameter $D$ | bright disc, first dark ring at $\\sin\\theta = 1.22\\lambda/D$ |

### Why it matters
Diffraction limits every instrument that forms images: a lens or mirror of diameter $D$ cannot concentrate light into an angle much smaller than $\\lambda/D$ — the reason telescopes are big and radio dishes enormous ([[mechanisms-of-seeing]]). Atoms in a crystal form a three-dimensional grating for X-rays, which is how crystal structures are found. In *QED* Feynman tells the same story with photons: scrape away the strips of a mirror whose arrows point the wrong way, and the rest reflects light at strange angles — a grating ([[every-path-counts]]).

In the simulation the opening is cut into strips, each with its own arrow. Watch them being added head to tail: straight ahead a straight line; at the first dark angle of a slit a closed circle; for a grating a chain that lines up only in a few special directions.
`,
  ideas: [
    'Diffraction is interference of many sources: add one arrow per source.',
    'N sources in step: I = I₀ sin²(Nφ/2)/sin²(φ/2), peaks N²I₀ where φ is a whole number of turns, first zeros at Nφ = 2π.',
    'A grating sends light to d sin θ = mλ, in beams whose narrowness gives a resolving power λ/Δλ = mN.',
    'A slit of width a: the arrows curl into an arc, closing into a circle (darkness) at a sin θ = λ.',
    'The smaller the opening, the wider the spread — the limit on every image-forming instrument.'
  ],
  pitfalls: [
    'Light bends round the edges of a slit because of the edges themselves — The spreading comes from the whole opening: every part of it sends out waves, and their sum fixes the pattern.',
    'More lines on a grating send the colours to wider angles — The angles depend only on the spacing d; more lines make each beam sharper, not further out.',
    'The dark bands of a slit are where no light reaches any strip — Every strip sends light there; the arrows from all the strips add up to a closed circle.'
  ],
  formulas: [
    {
      name: 'Grating equation',
      expr: 'sin(theta) = m*lambda*g', tex: '\\sin\\theta = m\\lambda g',
      vars: {
        theta: { name: 'angle of the beam from the straight-through direction', q: 'angle', unit: '°', min: -90, max: 90, signed: true, tex: '\\theta' },
        m: { name: 'order', int: true, value: 1, signed: true },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        g: { name: 'lines per unit length (1/d)', q: 'wavenumber', unit: 'lines/mm', value: 600 }
      },
      solveFor: 'theta',
      note: 'Light arriving perpendicular to the grating. The same as d sin θ = mλ with d = 1/g.',
      stories: { theta: 'Light of {lambda} falls on a grating with {g}. At what angle is the order {m} beam?', lambda: 'A grating with {g} sends a spectral line to {theta} in order {m}. What is its wavelength?' }
    },
    {
      name: 'Resolving power of a grating',
      expr: 'dlambda = lambda/(m*N)', tex: '\\Delta\\lambda = \\frac{\\lambda}{mN}',
      vars: {
        dlambda: { name: 'smallest separable difference in wavelength', q: 'length', unit: 'nm', tex: '\\Delta\\lambda' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 589, tex: '\\lambda' },
        m: { name: 'order', int: true, value: 1 },
        N: { name: 'number of lines illuminated', int: true, value: 6000 }
      },
      note: 'Rayleigh\'s criterion: the peak of one line on the first zero of the other.',
      stories: { dlambda: 'A grating with {N} lines is used in order {m} near {lambda}. What is the smallest wavelength difference it can resolve?', N: 'Two lines near {lambda} differ by {dlambda}. How many lines must be illuminated to separate them in order {m}?' }
    },
    {
      name: 'Dark directions of a single slit',
      expr: 'a*sin(theta) = m*lambda', tex: 'a\\sin\\theta = m\\lambda',
      vars: {
        a: { name: 'width of the slit', q: 'length', unit: 'µm', value: 10 },
        theta: { name: 'angle of the dark band', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\theta' },
        m: { name: 'which dark band (1, 2, …)', int: true, value: 1 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 500, tex: '\\lambda' }
      },
      solveFor: 'theta',
      note: 'Where the arrows from the strips of the slit close into m complete circles.',
      stories: { theta: 'Light of {lambda} passes a slit {a} wide. At what angle is dark band number {m}?', a: 'The first dark band of a slit lit with {lambda} is at {theta}. How wide is the slit?' }
    }
  ],
  derivation: {
    title: 'The sum of N arrows',
    steps: [
      { text: 'Each source gives an arrow of length $A$, turned by $\\phi$ more than the one before. As [[?complex-number|complex numbers]] they form a [[?sum]] of a geometric series:', tex: 'A_R = A\\left(1 + e^{i\\phi} + e^{2i\\phi} + \\cdots + e^{i(N-1)\\phi}\\right) = A\\,\\frac{e^{iN\\phi} - 1}{e^{i\\phi} - 1}' },
      { text: 'Take out half-angle factors from top and bottom, so that each becomes a sine: $e^{ix} - 1 = e^{ix/2}\\cdot 2i\\sin(x/2)$.', tex: 'A_R = A\\,e^{i(N-1)\\phi/2}\\,\\frac{\\sin(N\\phi/2)}{\\sin(\\phi/2)}' },
      { text: 'The first factor only turns the total arrow; its length is the rest. Square it for the intensity. At $\\phi \\to 0$ the ratio tends to $N$ — all arrows lined up.', tex: 'I = I_0\\,\\frac{\\sin^2(N\\phi/2)}{\\sin^2(\\phi/2)}, \\qquad I(0) = N^2 I_0' },
      { text: 'For a slit, let $N \\to \\infty$ with the total phase across it $\\Phi = N\\phi$ fixed. Then $\\sin(\\phi/2) \\approx \\phi/2$ ([[?small-approximation|small angle]]), and the pattern becomes', tex: 'I = I_{\\max}\\left(\\frac{\\sin(\\Phi/2)}{\\Phi/2}\\right)^2, \\qquad \\Phi = \\frac{2\\pi a\\sin\\theta}{\\lambda}' }
    ]
  },
  examples: [
    {
      title: 'The orders of a grating',
      q: 'Green light of 550 nm falls on a grating with 600 lines per millimetre. At what angles are its beams?',
      steps: [
        '$d = 1/600$ mm $= 1667$ nm, so $\\sin\\theta = m \\times 550/1667 = 0.330\\,m$.',
        '$m = 1$: 19.3°. $m = 2$: $\\sin\\theta = 0.660$, 41.3°. $m = 3$: $\\sin\\theta = 0.990$, 81.9°.',
        '$m = 4$ would need $\\sin\\theta = 1.32$: impossible, so there is no fourth order.'
      ],
      a: '0°, ±19.3°, ±41.3° and ±81.9°.'
    },
    {
      title: 'Splitting the sodium doublet',
      q: 'The yellow light of sodium is two lines, 589.0 and 589.6 nm. How many grating lines must be lit to separate them in first order? Does a grating 1 cm wide with 600 lines/mm do it?',
      steps: [
        '$N \\ge \\lambda/(m\\Delta\\lambda) = 589.3/0.6 = 982$ lines.',
        'A 1 cm grating has 6000 lines, resolving $\\Delta\\lambda = 589/6000 \\approx 0.1$ nm in first order.'
      ],
      a: 'At least about 980 lines; the 6000-line grating separates them easily.'
    },
    {
      title: 'How wide is the central patch?',
      q: 'Light of 500 nm passes a slit 10 µm wide onto a wall 1 m away. How wide is the bright central band?',
      steps: [
        'First dark band: $\\sin\\theta = \\lambda/a = 0.05$, $\\theta = 2.87°$.',
        'On the wall: $\\pm 1\\ \\mathrm{m} \\times \\tan 2.87° = \\pm 5.0$ cm.',
        'Halve the slit width and the patch doubles.'
      ],
      a: 'About 10 cm from dark band to dark band.'
    }
  ],
  quiz: [
    { q: 'Making a single slit narrower makes the central bright band…', choices: ['wider', 'narrower', 'brighter', 'unchanged'], a: 0, why: 'The first dark band is at sin θ = λ/a: a smaller a gives a larger angle.' },
    { q: 'A grating with more lines, at the same spacing, gives beams that are…', choices: ['sharper, in the same directions', 'at wider angles', 'at narrower angles', 'more numerous'], a: 0, why: 'The directions depend only on d; the width of each beam goes as 1/N.' },
    { q: 'A grating sends red light to larger angles than blue light in the same order.', a: true, why: 'sin θ = mλ/d grows with the wavelength — the opposite order from a prism.' },
    { q: 'At the first dark direction of a single slit, the arrows from all its strips, added head to tail, form…', choices: ['a closed circle', 'a straight line', 'a half circle', 'two opposite arrows only'], a: 0, why: 'The phase across the slit is exactly one turn, so the arc of arrows bends round once and closes.' },
    { q: 'What is the highest order of red light (700 nm) that a grating with 600 lines/mm can produce?', answer: 2, why: 'd = 1667 nm; d/λ = 2.38, so m = 2 is the largest whole number with sin θ ≤ 1.' }
  ],
  problems: [
    { q: 'A spectrometer grating has 1200 lines per millimetre. At what angle is the first-order beam of a helium–neon laser (632.8 nm)?', answer: 49.41, unit: '°', tol: 0.01, hint: 'sin θ = λ/d.',
      steps: ['$\\sin\\theta = 632.8\\times10^{-9} \\times 1.2\\times10^{6} = 0.7594$.', '$\\theta = 49.4°$.'] },
    { q: 'How many lines of a grating must be lit to separate the sodium lines at 589.0 and 589.6 nm in second order?', answer: 491, tol: 0.02, hint: 'λ/Δλ = mN.',
      steps: ['$N = \\lambda/(m\\,\\Delta\\lambda) = 589.3/(2 \\times 0.6)$.', '$N \\approx 491$ lines.'] }
  ],
  applications: [
    'Spectrometers use gratings to measure the wavelengths of light from atoms, stars and flames.',
    'X-ray crystallography treats the atoms of a crystal as a three-dimensional grating.',
    'The rainbow sheen of CDs, DVDs and some beetles and feathers comes from fine regular structures.',
    'Diffraction limits the sharpness of cameras, microscopes and telescopes — and of your eye.'
  ],
  history: 'Augustin Fresnel\'s wave theory of diffraction won the prize of the French Academy in 1819. Joseph von Fraunhofer made the first diffraction gratings from fine wires around 1821 and used them to measure the wavelengths of the dark lines in sunlight. Henry Rowland\'s ruling engines of the 1880s made large, precise gratings that transformed spectroscopy.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 30 (Diffraction) — the resultant of n equal oscillators, the diffraction grating and its resolving power, the parabolic antenna, coloured films and crystals, diffraction by opaque screens.',
    'Vol. I, ch. 29 (Interference) — the mathematics of adding waves that the chapter builds on.',
    '*QED: The Strange Theory of Light and Matter*, ch. 2 — a mirror scraped into strips reflects at unexpected angles: the grating explained with photon arrows.'
  ],
  sim: 'lux-diffraction'
},

{
  id: 'origin-of-refractive-index', parent: 'optics-topic', title: 'The origin of the refractive index', level: 3,
  short: 'Light is not really slowed by glass. The wave shakes the electrons of the glass; they radiate a small wave a quarter-cycle behind; added to the original, it shifts the phase — and the sum travels as if at c/n. The same picture explains dispersion, absorption and an index below one.',
  keywords: ['refractive index', 'index of refraction', 'phase velocity', 'dispersion', 'absorption', 'resonance', 'driven electron', 'plane of charges', 'extinction theorem', 'plasma', 'X-rays', 'n less than 1'],
  prereq: ['radiation-accelerated-charge', 'resonance-feyn', 'interference-feyn', 'algebra-complex-numbers'],
  related: ['scattering-blue-sky', 'geometrical-optics-feyn', 'dielectrics-feyn', 'beats-feyn', 'harmonic-oscillator-feyn', 'physics:dispersion', 'physics:refraction'],
  body: `
Everybody learns that light in glass travels at $c/n$. Feynman showed that this is, in a sense, an illusion. Light is radiation, and radiation always travels at $c$ — also between the atoms of glass. What happens is that the incoming wave shakes the electrons of the glass; the shaken electrons radiate ([[radiation-accelerated-charge]]); and the wave that emerges is the **sum** of the original wave and all these new little waves. The sum has the same frequency but a shifted [[?phase]], so its crests march along as if the light were slower.

### A thin sheet of electrons
Begin with one thin plate of material, thickness $\\Delta z$, in the path of a plane wave of frequency $\\omega$. Each electron is held in its atom as if by a spring, with a natural frequency $\\omega_0$ ([[harmonic-oscillator-feyn]]). Driven below its resonance ([[resonance-feyn]]), it follows the field in step, with an amplitude $x_0 = q_eE_0/m(\\omega_0^2 - \\omega^2)$.

A whole plane of charges moving together radiates a plane wave. Adding up the fields of every charge in the sheet — an [[?integral]] over the plane, which Feynman worked out in his chapter on diffraction — gives a strikingly simple answer. The sheet's field is proportional to the **velocity** of its charges, not to their acceleration:

$$E_{\\text{sheet}} = -\\frac{\\eta}{2\\varepsilon_0 c}\\,v\\left(t - \\frac{z}{c}\\right)$$

where $\\eta$ is the charge per unit area. The velocity of an oscillating electron runs a quarter of a cycle ahead of its position, so the sheet's wave **lags the original by 90°** — and it is small.

### A short arrow at right angles
Now add the waves as [[?rotating-arrow|rotating arrows]] ([[interference-feyn]]). The original wave is a long arrow; the sheet adds a short arrow at right angles to it. The total is almost exactly as long, but turned slightly backwards: delayed in phase. A delay of $\\omega(n - 1)\\Delta z/c$ is exactly what slowing the wave to $c/n$ over the thickness $\\Delta z$ would produce. Matching the two gives the index:

$$n = 1 + \\frac{N q_e^2}{2\\varepsilon_0 m\\,(\\omega_0^2 - \\omega^2)}$$

where $N$ is the number of such electrons per unit volume. A thick block is simply many thin sheets one after another, each adding its small delay: the phase slips steadily, and the wave looks slow all the way through.

### What the formula explains
- **Dispersion.** $n$ grows as $\\omega$ approaches $\\omega_0$. The resonances of glass lie in the ultraviolet, so blue light, nearer to them, is delayed more than red: prisms and rainbows.
- **Absorption.** Near a resonance the electrons swing wildly, and any friction in their motion takes energy from the wave. The index gets an imaginary part ([[?complex-number|a complex index]]) and the light fades as it goes.
- **An index below one.** Above every resonance — X-rays in glass, or radio waves among the free electrons of the ionosphere, where $\\omega_0 = 0$ — the denominator is negative and $n < 1$: the crests move faster than $c$. No signal does. Information travels with a group of waves, whose speed stays below $c$ ([[beats-feyn]]).

| Light | where $\\omega$ lies | index |
|---|---|---|
| visible light in air or glass | below the ultraviolet resonances | a little above 1, rising towards blue |
| near a resonance | $\\omega \\approx \\omega_0$ | strong absorption |
| X-rays | above all resonances | a little below 1 |

Some real numbers. A gas at 0 °C and 1 atm has $2.7\\times10^{25}$ molecules per cubic metre. Give each one electron resonating at $\\omega_0 = 2\\times10^{16}$ rad/s (94 nm, far ultraviolet): for green light the formula gives $n - 1 = 1.1\\times10^{-4}$, the same order as air's $2.9\\times10^{-4}$. In dense materials such as glass each electron also feels the fields of its polarized neighbours; Feynman added that correction in volume II.

> [!key] Light is not really slowed in glass. The electrons, shaken by the wave, radiate a wave that lags by 90°; added to the original it shifts the phase, and the sum travels as if at c/n.

In the simulation, watch the small wave radiated by the sheets (a quarter-cycle behind) and the total falling steadily behind the wave that would have crossed a vacuum. Raise the frequency above the resonance and the phase slips the other way: $n < 1$. Near resonance the wave is absorbed.
`,
  ideas: [
    'Between the atoms light travels at c; the slow wave in glass is the sum of the original wave and the waves radiated by the driven electrons.',
    'A thin sheet of oscillating charges radiates a field proportional to their velocity: 90° behind the driving wave, and small.',
    'A small arrow at right angles turns the total arrow: a phase delay ω(n − 1)Δz/c, which is what a slower wave would give.',
    'n = 1 + Nq²/(2ε₀m(ω₀² − ω²)) for a thin gas: dispersion below resonance, absorption at it, n < 1 above it.',
    'Phase velocity above c carries no signal; signals travel with groups of waves.'
  ],
  pitfalls: [
    'Photons are slowed by bumping from atom to atom — Nothing is delayed in flight. The wave in the glass is the original plus the re-radiated waves; the phase of the sum is what moves slowly.',
    'An index below one means light travels faster than c — Only the crests do. A pulse, which carries information, moves at the group velocity, below c.',
    'The index is a fixed property of a material — It depends on the frequency: that is dispersion, and near a resonance the index changes rapidly and the material absorbs.'
  ],
  formulas: [
    {
      name: 'Refractive index of a thin gas of driven electrons',
      expr: 'n = 1 + N*qe^2/(2*eps0*me*(w0^2 - w^2))', tex: 'n = 1 + \\frac{N e^2}{2\\varepsilon_0 m_e(\\omega_0^2 - \\omega^2)}',
      vars: {
        n: { name: 'refractive index', signed: true },
        N: { name: 'number of resonant electrons per unit volume', q: 'numberdensity', unit: '1/m³', value: 2.7e25 },
        qe: { const: 'qe' },
        eps0: { const: 'eps0' },
        me: { const: 'me' },
        w0: { name: 'resonant (natural) angular frequency of the electrons', q: 'angvel', unit: 'rad/s', value: 2e16, tex: '\\omega_0' },
        w: { name: 'angular frequency of the light', q: 'angvel', unit: 'rad/s', value: 3.4e15, tex: '\\omega' }
      },
      solveFor: 'n',
      note: 'Dilute gas, no damping, one kind of oscillator. Dense materials need the correction for the fields of neighbouring atoms.',
      stories: { n: 'A gas has {N} electrons per cubic metre resonating at {w0}. What is its refractive index for light of angular frequency {w}?', w0: 'A gas with {N} resonant electrons per cubic metre has index {n} for light of {w}. Where is the resonance?' }
    },
    {
      name: 'Phase delay caused by a plate',
      expr: 'phi = 2*pi*(n - 1)*dz/lambda', tex: '\\phi = \\frac{2\\pi(n - 1)\\,\\Delta z}{\\lambda}',
      vars: {
        phi: { name: 'extra phase delay, compared with the same path in vacuum', q: 'angle', unit: 'rev', tex: '\\phi' },
        n: { name: 'refractive index', value: 1.5 },
        dz: { name: 'thickness of the plate', q: 'length', unit: 'µm', value: 1, tex: '\\Delta z' },
        lambda: { name: 'wavelength in vacuum', q: 'length', unit: 'nm', value: 500, tex: '\\lambda' }
      },
      note: 'In turns (1 rev = 2π rad = 360°). This delay is what the added waves of the plate\'s electrons produce.',
      stories: { phi: 'Light of {lambda} crosses a plate {dz} thick with index {n}. By how much does it fall behind light that crossed the same distance of vacuum?', n: 'A plate {dz} thick delays light of {lambda} by {phi}. What is its index?' }
    },
    {
      name: 'Free electrons: an index below one',
      expr: 'n = 1 - N*qe^2/(8*pi^2*eps0*me*f^2)', tex: 'n = 1 - \\frac{N e^2}{8\\pi^2\\varepsilon_0 m_e f^2}',
      vars: {
        n: { name: 'refractive index', signed: true },
        N: { name: 'free-electron density', q: 'numberdensity', unit: '1/m³', value: 1e12 },
        qe: { const: 'qe' },
        eps0: { const: 'eps0' },
        me: { const: 'me' },
        f: { name: 'frequency of the wave', q: 'frequency', unit: 'MHz', value: 30 }
      },
      solveFor: 'n',
      note: 'The same formula with ω₀ = 0 and ω = 2πf; valid while n is close to 1. The ionosphere has 10¹¹–10¹² free electrons per cubic metre.',
      stories: { n: 'A radio wave of {f} crosses a layer of the ionosphere with {N} free electrons per cubic metre. What is the refractive index?' }
    }
  ],
  derivation: {
    title: 'The index from one thin sheet',
    steps: [
      { text: 'Suppose the plate did slow the wave to $c/n$. Behind it, the wave would be the vacuum wave delayed by $\\omega(n-1)\\Delta z/c$. For a thin plate the delay is small, so expand the [[?exponential]] to first order ([[?small-approximation|small quantity]]):', tex: 'E_0 e^{i\\omega(t - z/c)}\\,e^{-i\\omega(n-1)\\Delta z/c} \\approx E_0 e^{i\\omega(t - z/c)} - i\\,\\frac{\\omega(n-1)\\Delta z}{c}\\,E_0 e^{i\\omega(t - z/c)}' },
      { text: 'So the plate must add a small wave, $-i$ times the original: an arrow a quarter-turn behind ([[?imaginary-unit|multiplying by −i]] turns an arrow back by 90°).', tex: 'E_{\\text{plate}} = -i\\,\\frac{\\omega(n-1)\\Delta z}{c}\\,E_0 e^{i\\omega(t - z/c)}' },
      { text: 'Now compute what the plate really radiates. Each electron moves as a driven oscillator, $x = q_eE_0 e^{i\\omega t}/m(\\omega_0^2 - \\omega^2)$, so its velocity is $v = i\\omega x$. The sheet holds $\\eta = Nq_e\\Delta z$ of charge per unit area, and radiates $-\\eta v/2\\varepsilon_0 c$:', tex: 'E_{\\text{plate}} = -\\frac{N q_e\\Delta z}{2\\varepsilon_0 c}\\cdot\\frac{i\\omega\\, q_e E_0}{m(\\omega_0^2 - \\omega^2)}\\,e^{i\\omega(t - z/c)}' },
      { text: 'The two expressions must be the same wave. Cancel the common factors $-i\\omega\\Delta z E_0 e^{i\\omega(t-z/c)}/c$:', tex: 'n - 1 = \\frac{N q_e^2}{2\\varepsilon_0 m(\\omega_0^2 - \\omega^2)}' }
    ]
  },
  examples: [
    {
      title: 'A plate one micrometre thick',
      q: 'Light of 500 nm crosses a glass plate 1.0 µm thick with n = 1.5. By how much does it fall behind light that crossed the same distance of vacuum?',
      steps: [
        'Phase delay $= 2\\pi(n - 1)\\Delta z/\\lambda = 2\\pi \\times 0.5 \\times 1000/500 = 2\\pi$.',
        'Exactly one full cycle: the crests leaving the plate are one wavelength behind.'
      ],
      a: 'One whole cycle (360°).'
    },
    {
      title: 'A model gas',
      q: 'A gas has $2.7\\times10^{25}$ electrons per cubic metre with a resonance at $\\omega_0 = 2.0\\times10^{16}$ rad/s. Find $n - 1$ for blue light (450 nm, $\\omega = 4.19\\times10^{15}$ rad/s) and red light (700 nm, $\\omega = 2.69\\times10^{15}$ rad/s).',
      steps: [
        '$Nq_e^2/2\\varepsilon_0 m = 2.7\\times10^{25} \\times 2.567\\times10^{-38} / (2 \\times 8.854\\times10^{-12} \\times 9.109\\times10^{-31}) = 4.30\\times10^{28}\\ \\mathrm{s^{-2}}$.',
        'Blue: $\\omega_0^2 - \\omega^2 = 4.00\\times10^{32} - 0.175\\times10^{32} = 3.82\\times10^{32}$, so $n - 1 = 1.12\\times10^{-4}$.',
        'Red: $4.00\\times10^{32} - 0.072\\times10^{32} = 3.93\\times10^{32}$, so $n - 1 = 1.09\\times10^{-4}$.',
        'Blue is delayed about 3 % more than red: dispersion, because blue is nearer the resonance.'
      ],
      a: '$n - 1 \\approx 1.12\\times10^{-4}$ for blue and $1.09\\times10^{-4}$ for red.'
    },
    {
      title: 'Radio waves in the ionosphere',
      q: 'A layer of the ionosphere holds $10^{12}$ free electrons per cubic metre. What is its index for a 30 MHz radio wave?',
      steps: [
        'Free electrons: $\\omega_0 = 0$, so $n = 1 - Nq_e^2/(2\\varepsilon_0 m\\omega^2)$ with $\\omega = 2\\pi \\times 30\\times10^6 = 1.885\\times10^8$ rad/s.',
        '$Nq_e^2/(\\varepsilon_0 m) = 3.18\\times10^{15}\\ \\mathrm{s^{-2}}$; divided by $2\\omega^2 = 7.11\\times10^{16}$ this is 0.045.',
        '$n = 0.955$: less than one. At lower frequencies $n$ falls further; below about 9 MHz the wave cannot enter the layer and is reflected — which is how short-wave radio travels round the Earth.'
      ],
      a: '$n \\approx 0.955$.'
    }
  ],
  quiz: [
    { q: 'In the space between the atoms of glass, light travels at the speed c.', a: true, why: 'Radiation always travels at c. The slow wave is the sum of the original and the re-radiated waves.' },
    { q: 'Compared with the wave that drives it, the wave radiated by a thin sheet of electrons (below resonance) is…', choices: ['small and a quarter-cycle behind', 'large and in step', 'small and exactly opposite', 'the same wave, reflected'], a: 0, why: 'Its field is proportional to the velocity of the electrons, which is 90° out of step with their position, and hence with the driving field.' },
    { q: 'Why does glass bend blue light more than red?', choices: ['blue is nearer the ultraviolet resonances of its electrons', 'blue photons are heavier', 'red light travels faster than c', 'glass absorbs red light'], a: 0, why: 'n − 1 grows as 1/(ω₀² − ω²): the closer to resonance, the larger the index.' },
    { q: 'For X-rays the index of glass is slightly below one, so the crests move faster than c. Does this let a signal outrun light?', choices: ['No: signals travel with the group velocity, below c', 'Yes, but only inside glass', 'Yes, which is why X-rays are dangerous', 'No, because X-rays are not light'], a: 0, why: 'A pattern of crests carries no information; a pulse moves at the group velocity.' },
    { q: 'Light of 500 nm crosses 1 µm of material with n = 1.5. By how many whole cycles does it fall behind light in vacuum?', answer: 1, why: '(n − 1)Δz/λ = 0.5 × 1000/500 = 1.' }
  ],
  problems: [
    { q: 'A microscope cover slip is 0.17 mm thick with n = 1.52. By how many cycles does light of 550 nm fall behind light that travels the same distance in air (take air as vacuum)?', answer: 160.7, tol: 0.01, hint: '(n − 1)Δz/λ.',
      steps: ['$(n - 1)\\Delta z/\\lambda = 0.52 \\times 0.17\\times10^{-3}/550\\times10^{-9}$.', '$= 160.7$ cycles.'] },
    { q: 'What is the refractive index of a region of the ionosphere with $10^{12}$ free electrons per cubic metre for a 30 MHz radio wave?', answer: 0.955, tol: 0.005, hint: 'n = 1 − Nq²/(2ε₀mω²).',
      steps: ['$\\omega = 2\\pi \\times 3\\times10^{7} = 1.885\\times10^{8}$ rad/s.', '$Nq_e^2/(2\\varepsilon_0 m\\omega^2) = 0.045$, so $n = 0.955$.'] }
  ],
  applications: [
    'Prisms, rainbows and chromatic aberration all come from the frequency dependence of n.',
    'Anti-reflection coatings and interference filters rely on the phase delay of thin layers.',
    'Short-wave radio bounces off the ionosphere, whose free electrons give n < 1 and reflect waves below the plasma frequency.',
    'X-ray mirrors work at grazing incidence because n is slightly below 1: total external reflection.'
  ],
  history: 'Hendrik Lorentz\'s electron theory of the 1890s explained dispersion by electrons bound in atoms. Paul Ewald (1912) and Carl Wilhelm Oseen (1915) showed that inside a medium the waves of the driven dipoles exactly cancel the incident wave and replace it with one travelling at c/n — the extinction theorem, of which Feynman\'s thin-sheet argument is the simplest case.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 31 (The Origin of the Refractive Index) — the field of the driven electrons of a thin plate, the index, dispersion, absorption and the energy carried by a wave.',
    'Vol. I, ch. 30 (Diffraction), last section — the field of a plane of oscillating charges.',
    'Vol. II, ch. 32 (Refractive Index of Dense Materials) — the correction for the fields of neighbouring atoms, and waves in metals.'
  ],
  sim: 'lux-index'
},

{
  id: 'scattering-blue-sky', parent: 'optics-topic', title: 'Scattering and the blue sky', level: 2,
  short: 'Light shakes the electrons of air molecules, and they re-radiate it in all directions. Bound electrons scatter in proportion to ω⁴, so blue is scattered about six times more than red: the sky is blue, and the light that reaches you straight from a low sun has lost its blue — red sunsets.',
  keywords: ['scattering', 'Rayleigh scattering', 'blue sky', 'sunset', 'cross-section', 'Thomson scattering', 'lambda to the minus four', 'clouds', 'air mass', 'optical depth', 'radiation damping', 'extinction'],
  prereq: ['radiation-accelerated-charge', 'resonance-feyn', 'origin-of-refractive-index'],
  related: ['polarization-feyn', 'color-vision-feyn', 'interference-feyn', 'physics:em-spectrum', 'physics:light-intensity', 'physics:blackbody-radiation'],
  body: `
An electron in an atom, shaken by a passing light wave, becomes a tiny antenna: it takes energy out of the beam and re-radiates it in other directions ([[radiation-accelerated-charge]]). That is **scattering**, and it is why the daytime sky is not black.

### How much one electron scatters
Treat the electron as a mass on a spring with natural frequency $\\omega_0$, driven at $\\omega$. Its displacement is [[?proportional]] to $1/(\\omega_0^2 - \\omega^2)$, its acceleration to $\\omega^2/(\\omega_0^2 - \\omega^2)$, and the power it radiates, by Larmor's formula, to the square of that. Dividing the scattered power by the intensity falling on the electron gives an area — the **cross-section** $\\sigma$, the size of the target the electron presents to the beam:

$$\\sigma = \\frac{8\\pi r_0^2}{3}\\,\\frac{\\omega^4}{(\\omega^2 - \\omega_0^2)^2}, \\qquad r_0 = \\frac{q_e^2}{4\\pi\\varepsilon_0 m c^2} = 2.82\\times10^{-15}\\ \\mathrm{m}$$

For a free electron ($\\omega_0 = 0$) this is the Thomson cross-section, $8\\pi r_0^2/3 = 6.65\\times10^{-29}\\ \\mathrm{m}^2$, the same at every frequency. The electrons of air molecules resonate in the ultraviolet, so for visible light $\\omega \\ll \\omega_0$ and

$$\\sigma \\approx \\frac{8\\pi r_0^2}{3}\\left(\\frac{\\omega}{\\omega_0}\\right)^4 \\propto \\frac{1}{\\lambda^4}$$

That fourth power is Rayleigh's law. Violet light at 400 nm is scattered $(700/400)^4 \\approx 9.4$ times more strongly than red at 700 nm, blue at 450 nm about 5.9 times more.

### The blue sky and the red sunset
Look away from the sun and you see only light scattered towards you by the air — strongly weighted to short wavelengths: the sky is blue. Why not violet? Sunlight holds less violet than blue, the eye is far less sensitive to violet, and the scattered light still contains every colour; the mixture looks sky blue rather than spectral violet ([[color-vision-feyn]]).

Look *at* the setting sun and you see the other half of the story: the light that was **not** scattered. Near the horizon its path through the air is 10 to 40 times longer than when the sun is overhead. Each stretch of air removes a fraction of the light that grows as $1/\\lambda^4$, so the blue is stripped out and the sun turns yellow, orange and red. The fraction that gets through falls [[?exponential|exponentially]] with the path:

$$T = e^{-\\tau M}, \\qquad \\tau(\\lambda) = \\tau_0\\left(\\frac{\\lambda_0}{\\lambda}\\right)^4$$

with $\\tau_0 \\approx 0.097$ for a vertical path through clean air at $\\lambda_0 = 550$ nm, and $M$ the *air mass* — about $1/\\sin$ of the sun's height above the horizon, 38 at the horizon itself.

| Sun | air mass $M$ | blue (450 nm) | green (550 nm) | red (700 nm) |
|---|---|---|---|---|
| overhead | 1 | 81 % | 91 % | 96 % |
| 5° above the horizon | 10.3 | 11 % | 37 % | 68 % |

### White clouds, and why lumps scatter more
A cloud droplet, some 10 µm across, is far bigger than a wavelength and scatters all colours about equally: clouds are white or grey. Between single molecules and droplets lies something surprising. $N$ electrons packed into a lump much smaller than a wavelength are shaken in step, so their fields add and the scattered intensity grows as $N^2$, not $N$: a tiny cluster scatters far more than the same molecules spread out. The opposite also holds: in a perfectly uniform material the waves scattered sideways by neighbouring regions cancel, which is why clear glass and water hardly scatter. In a gas it is the random unevenness of the molecules' positions that lets them scatter at all.

> [!key] Bound electrons scatter light with a strength proportional to ω⁴ — to 1/λ⁴. Seen sideways, that makes the sky blue; along the line of sight, the loss of blue makes the setting sun red.

In the simulation, lower the sun and watch the colour of its disc and of the sky; the spectra show sunlight above the air, the light scattered to you and the light that gets through. Turn the exponent from 4 (molecules) down to 0 (cloud droplets) and the sky turns white.
`,
  ideas: [
    'A light wave shakes the electrons of molecules; they radiate in all directions: scattering.',
    'For a bound electron well below resonance the cross-section is σ = (8πr₀²/3)(ω/ω₀)⁴ — Rayleigh\'s 1/λ⁴ law.',
    'Scattered skylight is rich in blue; the direct light of a low sun, after a long path, has lost its blue.',
    'Transmission falls exponentially: T = e^(−τM), with τ ∝ 1/λ⁴ and the air mass M growing towards the horizon.',
    'Particles much larger than λ scatter all colours alike (white clouds); lumps smaller than λ scatter as N².'
  ],
  pitfalls: [
    'The sky is blue because it reflects the sea — The sky is blue over deserts too; it is sunlight scattered by the air\'s own molecules, strongest for short wavelengths.',
    'Sunsets are red because the air absorbs blue light — The blue is not absorbed but scattered out of the direct beam, to light up someone else\'s sky.',
    'If blue is scattered more, violet should be scattered most, so the sky ought to be violet — Violet is scattered more, but sunlight has less of it and the eye is much less sensitive to it; the mixture looks blue.'
  ],
  formulas: [
    {
      name: 'Rayleigh cross-section of a bound electron',
      expr: 'sigma = sigmaT*(lamr/lambda)^4', tex: '\\sigma = \\sigma_T\\left(\\frac{\\lambda_0}{\\lambda}\\right)^4',
      vars: {
        sigma: { name: 'scattering cross-section', q: 'area', unit: 'm²', tex: '\\sigma' },
        sigmaT: { name: 'Thomson cross-section of a free electron, 8πr₀²/3', q: 'area', unit: 'm²', value: 6.652e-29, fixed: true, tex: '\\sigma_T' },
        lamr: { name: 'wavelength of the electron\'s resonance', q: 'length', unit: 'nm', value: 100, tex: '\\lambda_0' },
        lambda: { name: 'wavelength of the light', q: 'length', unit: 'nm', value: 500, tex: '\\lambda' }
      },
      solveFor: 'sigma',
      note: 'Valid far below resonance (λ much longer than λ₀), which is (ω/ω₀)⁴ written with wavelengths.',
      stories: { sigma: 'An electron resonates at {lamr}. What is its cross-section for light of {lambda}?' }
    },
    {
      name: 'How much more one colour is scattered than another',
      expr: 'R = (lambda2/lambda1)^4', tex: 'R = \\left(\\frac{\\lambda_2}{\\lambda_1}\\right)^4',
      vars: {
        R: { name: 'ratio of scattering, colour 1 to colour 2' },
        lambda1: { name: 'shorter wavelength', q: 'length', unit: 'nm', value: 450, tex: '\\lambda_1' },
        lambda2: { name: 'longer wavelength', q: 'length', unit: 'nm', value: 700, tex: '\\lambda_2' }
      },
      note: 'Rayleigh scattering by molecules; particles comparable to or larger than λ scatter much more evenly.',
      stories: { R: 'How many times more strongly is light of {lambda1} scattered by air than light of {lambda2}?' }
    },
    {
      name: 'Light getting through the atmosphere',
      expr: 'T = exp(-tau0*(lambda0/lambda)^4*M)', tex: 'T = e^{-\\tau_0(\\lambda_0/\\lambda)^4 M}',
      vars: {
        T: { name: 'fraction transmitted', q: 'ratio', unit: '%' },
        tau0: { name: 'vertical optical depth of the air at λ₀ (clean air 0.097)', value: 0.097, tex: '\\tau_0' },
        lambda0: { name: 'reference wavelength', q: 'length', unit: 'nm', value: 550, fixed: true, tex: '\\lambda_0' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 450, tex: '\\lambda' },
        M: { name: 'air mass (1 overhead, about 10 at 5° above the horizon, 38 at the horizon)', value: 10.3 }
      },
      note: 'Rayleigh scattering by clean air only; dust and haze add a loss that depends less on wavelength.',
      stories: { T: 'The sun is low, with an air mass of {M}. What fraction of its light at {lambda} reaches the ground?', M: 'Only {T} of the sun\'s light at {lambda} gets through. What is the air mass?' }
    }
  ],
  derivation: {
    title: 'The cross-section of a bound electron',
    steps: [
      { text: 'The field $E_0\\cos\\omega t$ drives the electron like a spring. Its acceleration is $-\\omega^2$ times its displacement:', tex: 'x = \\frac{q_e E_0}{m(\\omega_0^2 - \\omega^2)}\\cos\\omega t, \\qquad a = -\\frac{\\omega^2 q_e E_0}{m(\\omega_0^2 - \\omega^2)}\\cos\\omega t' },
      { text: 'Larmor\'s formula gives the radiated power. Average it over a cycle ($\\langle\\cos^2\\rangle = 1/2$):', tex: '\\langle P\\rangle = \\frac{q_e^2 \\langle a^2\\rangle}{6\\pi\\varepsilon_0 c^3} = \\frac{q_e^4 E_0^2}{12\\pi\\varepsilon_0 c^3 m^2}\\,\\frac{\\omega^4}{(\\omega_0^2 - \\omega^2)^2}' },
      { text: 'The incoming intensity is $\\tfrac12\\varepsilon_0 c E_0^2$. The cross-section is the power scattered divided by the intensity — an area. Collect the constants into $r_0 = q_e^2/4\\pi\\varepsilon_0 mc^2$:', tex: '\\sigma = \\frac{\\langle P\\rangle}{\\tfrac12\\varepsilon_0 c E_0^2} = \\frac{8\\pi r_0^2}{3}\\,\\frac{\\omega^4}{(\\omega^2 - \\omega_0^2)^2}' },
      { text: 'Far below resonance, $\\omega \\ll \\omega_0$, the bracket tends to $\\omega^4/\\omega_0^4$: the fourth-power law.', tex: '\\sigma \\approx \\frac{8\\pi r_0^2}{3}\\left(\\frac{\\omega}{\\omega_0}\\right)^4' }
    ]
  },
  examples: [
    {
      title: 'Violet against red',
      q: 'How much more strongly is violet light (400 nm) scattered by air than red light (700 nm)?',
      steps: ['$R = (700/400)^4 = 1.75^4$.', '$1.75^2 = 3.06$, and $3.06^2 = 9.38$.'],
      a: 'About 9.4 times.'
    },
    {
      title: 'The colour of the setting sun',
      q: 'The sun is 5° above the horizon (air mass 10.3). What fractions of its blue (450 nm) and red (700 nm) light reach the ground through clean air?',
      steps: [
        'Blue: $\\tau = 0.097 \\times (550/450)^4 = 0.216$; $T = e^{-0.216 \\times 10.3} = e^{-2.23} = 0.11$.',
        'Red: $\\tau = 0.097 \\times (550/700)^4 = 0.037$; $T = e^{-0.037 \\times 10.3} = e^{-0.38} = 0.68$.',
        'The red gets through six times better than the blue: the disc looks orange-red.'
      ],
      a: 'About 11 % of the blue and 68 % of the red.'
    },
    {
      title: 'Where the optical depth comes from',
      q: 'A column of air one square metre in cross-section, from sea level to space, holds about $2.15\\times10^{29}$ molecules. Each scatters green light with a cross-section of about $4.5\\times10^{-31}\\ \\mathrm{m}^2$. What fraction of the column\'s area do the molecules block?',
      steps: [
        'Total target area per square metre: $2.15\\times10^{29} \\times 4.5\\times10^{-31} = 0.097$.',
        'That is the optical depth $\\tau_0$: the vertical beam loses $1 - e^{-0.097} \\approx 9$ % of its green light.'
      ],
      a: 'About 0.097 — the optical depth of the atmosphere at 550 nm.'
    }
  ],
  quiz: [
    { q: 'The daytime sky is blue mainly because…', choices: ['air molecules scatter short wavelengths far more strongly', 'air absorbs red light', 'it reflects the oceans', 'oxygen gas is blue'], a: 0, why: 'Rayleigh scattering goes as 1/λ⁴: the light scattered to you from the sky is rich in blue.' },
    { q: 'The setting sun looks red because…', choices: ['its blue light has been scattered out of the long path through the air', 'the sun is cooler in the evening', 'the air emits red light', 'red light is bent more by the air'], a: 0, why: 'The direct beam has crossed 10–40 times more air, and scattering removes blue most.' },
    { q: 'Clouds are white because their droplets, much larger than a wavelength, scatter all colours about equally.', a: true, why: 'The 1/λ⁴ law holds only for scatterers much smaller than the wavelength.' },
    { q: 'Doubling the frequency of light (well below resonance) multiplies the scattering by…', choices: ['16', '2', '4', '8'], a: 0, why: 'σ ∝ ω⁴: 2⁴ = 16.' },
    { q: 'How many times more strongly is 450 nm light scattered by air than 700 nm light?', answer: 5.86, why: '(700/450)⁴ = 5.86.' }
  ],
  problems: [
    { q: 'The sun is 30° above the horizon (air mass 2.0). What percentage of its green light (550 nm) comes straight through clean air?', answer: 82.4, unit: '%', tol: 0.01, hint: 'T = e^(−τ₀M) at 550 nm.',
      steps: ['$T = e^{-0.097 \\times 2.0} = e^{-0.194}$.', '$T = 0.824$, that is 82.4 %.'] },
    { q: 'How many times more strongly is violet light of 400 nm scattered than red light of 650 nm?', answer: 6.97, tol: 0.01, hint: 'Rayleigh: (λ₂/λ₁)⁴.',
      steps: ['$(650/400)^4 = 1.625^4$.', '$1.625^2 = 2.64$; $2.64^2 = 6.97$.'] }
  ],
  applications: [
    'The colours of the sky, of sunsets and of distant mountains (which look blue through a long path of scattering air).',
    'Fibre-optic losses: Rayleigh scattering by density fluctuations in the glass sets the lowest loss, which is why long links use infrared light.',
    'Laser and radar remote sensing of the air, and the brightness of the sky that astronomers must fight.',
    'Blue-grey smoke from thin wisps (small particles) and white smoke from dense puffs (large droplets).'
  ],
  history: 'John Tyndall showed in 1869 that fine particles scatter blue light. Lord Rayleigh derived the 1/λ⁴ law in 1871 and later (1899) showed that the air molecules themselves, not dust, scatter enough to colour the sky. Marian Smoluchowski (1908) and Albert Einstein (1910) explained scattering by the fluctuations of density in gases and liquids.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 32 (Radiation Damping. Light Scattering) — radiation resistance, the rate of radiation of energy, radiation damping, independent sources, and the scattering of light: the cross-section, the blue sky, white clouds.',
    'Vol. I, ch. 31 (The Origin of the Refractive Index) — the driven electron that does the scattering.',
    'Vol. I, ch. 33 (Polarization) — why scattered skylight is polarized.'
  ],
  sim: 'lux-sky'
},

{
  id: 'polarization-feyn', parent: 'optics-topic', title: 'Polarization', level: 2,
  short: 'The electric field of light points across its direction of travel, in one of two independent directions or a mixture of them. A polarizer keeps only the component along its axis — I = I₀cos²θ — which is why a third polarizer at 45° lets light through two crossed ones. Scattering and reflection make polarized light.',
  keywords: ['polarization', 'polarizer', 'Polaroid', 'Malus law', 'three polarizers', 'circular polarization', 'Brewster angle', 'birefringence', 'quarter-wave plate', 'skylight', 'glare', 'optical activity', 'Jones vector'],
  prereq: ['radiation-accelerated-charge', 'scattering-blue-sky', 'physics:polarization'],
  related: ['origin-of-refractive-index', 'two-state-systems', 'stern-gerlach-filters', 'physics:brewsters-angle', 'math:vector-components'],
  body: `
The electric field of a light wave points across its direction of travel ([[radiation-accelerated-charge]]). Across that line there are two independent directions it can point — say, up–down and left–right — and the way it points is the light's **polarization**. Nothing more is needed: a transverse field [[?vector]], and the rule that fields add as vectors.

### Kinds of polarization
Split the field into two [[?components]], $E_x = A\\cos\\omega t$ and $E_y = B\\cos(\\omega t + \\varphi)$. If $\\varphi = 0$ the tip of the vector swings to and fro along a line: **linear** polarization. If $A = B$ and $\\varphi = 90°$, the tip runs round a circle: **circular** polarization, right- or left-handed. Anything else traces an ellipse. The light of the sun or a lamp comes from countless atoms radiating independently, so its polarization changes at random many times a nanosecond: it is **unpolarized**.

### Polarizers and Malus's law
A polarizer — a sheet of stretched plastic whose long molecules absorb the field along one direction — passes only the component of the field along its transmission axis. A field $E_0$ at an angle $\\theta$ to the axis leaves as $E_0\\cos\\theta$, and since intensity goes as $E^2$,

$$I = I_0\\cos^2\\theta$$

That is Malus's law. Unpolarized light, averaged over all directions ($\\langle\\cos^2\\theta\\rangle = 1/2$), loses exactly half its intensity in the first polarizer.

### The three-polarizer surprise
Cross two polarizers at 90° and nothing gets through: whatever passes the first has no component along the second. Now slip a third polarizer *between* them at 45°. It can only remove light — and yet light appears. The first polarizer passes light at 0°; the middle one passes its 45° component, a field $\\cos45° = 0.71$ as large; the last passes the 90° component of *that*, another factor 0.71. The intensity is $\\tfrac12 \\times \\tfrac12 \\times \\tfrac12 = \\tfrac18$ of the unpolarized light. A polarizer does not merely block; it sends on light polarized along its own axis. With many polarizers turned in small steps, most of the light can be turned through 90°.

In quantum terms each photon either passes a polarizer or is absorbed, with probability $\\cos^2\\theta$; Feynman used the polarization of the photon as one of his examples of a [[two-state-systems|two-state system]].

### Where polarized light comes from
- **Scattering.** An electron shaken by sunlight radiates nothing along its line of shaking. Light scattered at 90° from the sun must come from electrons shaken across your line of sight, so it is strongly polarized ([[scattering-blue-sky]]). Look at the sky 90° from the sun through polarizing sunglasses and tilt your head: it darkens and brightens.
- **Reflection.** At Brewster's angle, $\\tan\\theta_B = n$, the reflected and refracted rays are at right angles. The electrons in the glass are shaken along the refracted light's field; for the polarization in the plane of incidence, making the reflected ray would need them to radiate along their own line of motion — which they cannot. So the reflected light is polarized parallel to the surface. For glass ($n = 1.5$) $\\theta_B = 56°$, for water 53°: glare from roads and lakes is mostly horizontally polarized, and sunglasses with a vertical axis cut it.
- **Birefringence.** In some crystals (calcite, quartz) the index depends on the direction of the field. The two components travel at different speeds and slip in [[?phase]]: a quarter-wave plate at 45° turns linear light into circular light.
- **Optical activity.** Sugar solutions and other molecules with a handedness turn the direction of polarization as light goes through.

| Light | its field |
|---|---|
| sun or lamp | unpolarized: random, changing many times a nanosecond |
| after a polarizer | linear, along the axis |
| blue sky 90° from the sun | mostly linear, perpendicular to the plane containing the sun |
| glare near Brewster's angle | linear, parallel to the surface |
| after a quarter-wave plate at 45° | circular |

> [!key] Light's field is a transverse vector with two independent directions. A polarizer keeps the component along its axis, $I = I_0\\cos^2\\theta$ — which is why a third polarizer at 45° lets light through two crossed ones.

In the simulation, watch the field vector along the beam and the intensity that survives each element. Cross the outer polarizers, add the middle one and turn it; then swap it for a quarter-wave plate and watch the tip of the field go round in a circle.
`,
  ideas: [
    'The field of light is a transverse vector: two independent directions, combined as linear, circular or elliptical polarization.',
    'A polarizer passes the component along its axis: Malus\'s law I = I₀cos²θ; unpolarized light loses half.',
    'A polarizer re-sends light along its own axis, so a 45° polarizer between crossed ones lets through 1/8 of unpolarized light.',
    'Scattering at 90° and reflection at Brewster\'s angle (tan θ_B = n) polarize light, because a shaken charge does not radiate along its line of motion.',
    'Birefringent plates shift the phase of one component: a quarter-wave plate makes circular light.'
  ],
  pitfalls: [
    'A polarizer is a filter that can only remove light, so adding one can never let more through — Between crossed polarizers, a third one at 45° turns the polarization and lets light through where there was none.',
    'Unpolarized light is a mixture of vertical and horizontal light only — It is a random jumble of all directions; any polarizer, at any angle, passes half of it.',
    'Polarizing sunglasses just darken everything equally — They block horizontally polarized light, which is most of the glare from water, roads and glass.'
  ],
  formulas: [
    {
      name: 'Malus\'s law',
      expr: 'I = I0*cos(theta)^2', tex: 'I = I_0\\cos^2\\theta',
      vars: {
        I: { name: 'intensity after the polarizer', q: false, unit: 'relative' },
        I0: { name: 'intensity of the polarized light arriving', q: false, unit: 'relative', value: 1, tex: 'I_0' },
        theta: { name: 'angle between the light\'s polarization and the polarizer\'s axis', q: 'angle', unit: '°', value: 30, min: 0, max: 90, tex: '\\theta' }
      },
      note: 'For polarized light. Unpolarized light: I = I₀/2 at any angle.',
      stories: { I: 'Polarized light of intensity {I0} meets a polarizer turned {theta} from its polarization. How much gets through?', theta: 'A polarizer passes {I} of polarized light of intensity {I0}. At what angle is it set?' }
    },
    {
      name: 'A third polarizer between crossed ones',
      expr: 'I = I1*cos(theta)^2*sin(theta)^2', tex: 'I = I_1\\cos^2\\theta\\,\\sin^2\\theta',
      vars: {
        I: { name: 'intensity after the last (crossed) polarizer', q: false, unit: 'relative' },
        I1: { name: 'intensity after the first polarizer', q: false, unit: 'relative', value: 1, tex: 'I_1' },
        theta: { name: 'angle of the middle polarizer from the first', q: 'angle', unit: '°', value: 30, min: 0, max: 90, tex: '\\theta' }
      },
      note: 'Largest at 45°, where it is I₁/4. Two angles (θ and 90° − θ) give the same intensity.',
      stories: { I: 'Two polarizers are crossed; a third is put between them at {theta} from the first. What fraction of the light leaving the first ({I1}) gets through?' }
    },
    {
      name: 'Brewster\'s angle',
      expr: 'thetaB = atan(n2/n1)', tex: '\\theta_B = \\arctan\\frac{n_2}{n_1}',
      vars: {
        thetaB: { name: 'angle of incidence at which the reflection is fully polarized', q: 'angle', unit: '°', tex: '\\theta_B' },
        n1: { name: 'index of the first medium (the light arrives in it)', value: 1, tex: 'n_1' },
        n2: { name: 'index of the second medium (the reflecting one)', value: 1.5, tex: 'n_2' }
      },
      note: 'Measured from the normal. At this angle the reflected and refracted rays are perpendicular.',
      stories: { thetaB: 'At what angle of incidence is light reflected from a surface of index {n2} (in a medium of index {n1}) completely polarized?', n2: 'Reflected light is completely polarized at {thetaB}. What is the index of the surface?' }
    }
  ],
  derivation: {
    title: 'Why reflection at Brewster\'s angle is polarized',
    steps: [
      { text: 'Refraction (Snell\'s law) links the angles of incidence and refraction:', tex: 'n_1\\sin\\theta_1 = n_2\\sin\\theta_2' },
      { text: 'The reflected light is radiated by the electrons of the glass, shaken by the refracted wave; their motion is along its field, perpendicular to the refracted ray. For the polarization in the plane of incidence, the electrons move in that plane. If the reflected ray happens to lie along their line of motion, they cannot radiate that way (the $\\sin\\theta$ factor is zero). That happens when the reflected and refracted rays are perpendicular:', tex: '\\theta_1 + \\theta_2 = 90°' },
      { text: 'Then $\\sin\\theta_2 = \\cos\\theta_1$, and Snell\'s law becomes', tex: 'n_1\\sin\\theta_1 = n_2\\cos\\theta_1 \\;\\Rightarrow\\; \\tan\\theta_B = \\frac{n_2}{n_1}' },
      { text: 'Only the other polarization, with the field parallel to the surface, is reflected at that angle.', tex: '\\theta_B = \\arctan 1.5 = 56.3° \\ \\text{(glass in air)}' }
    ]
  },
  examples: [
    {
      title: 'Light through three polarizers',
      q: 'Unpolarized light of intensity $I_0$ passes a polarizer at 0°, a second at 45° and a third at 90°. How much comes out? And without the middle one?',
      steps: [
        'After the first: $I_0/2$ (half of unpolarized light).',
        'After the second: $\\tfrac{I_0}{2}\\cos^2 45° = I_0/4$.',
        'After the third: $\\tfrac{I_0}{4}\\cos^2 45° = I_0/8$.',
        'Without the middle one the last polarizer is at 90° to the first: $\\cos^2 90° = 0$.'
      ],
      a: '$I_0/8$ with the middle polarizer, nothing without it.'
    },
    {
      title: 'Turning the polarization with many steps',
      q: 'Ten polarizers, each turned 9° from the one before, turn polarized light through 90°. What fraction of it gets through?',
      steps: [
        'Each step passes $\\cos^2 9° = 0.9755$.',
        'Ten steps: $0.9755^{10} = 0.78$.',
        'With more, smaller steps the loss tends to zero: the polarization is turned rather than blocked.'
      ],
      a: 'About 78 %.'
    },
    {
      title: 'Glare off water and glass',
      q: 'At what angle of incidence is light reflected from water (n = 1.33) and from glass (n = 1.5) completely polarized?',
      steps: ['Water: $\\arctan 1.33 = 53.1°$ from the vertical.', 'Glass: $\\arctan 1.5 = 56.3°$.'],
      a: '53° for water, 56° for glass — the reflected light is polarized parallel to the surface.'
    }
  ],
  quiz: [
    { q: 'Two polarizers are crossed, so no light gets through. A third polarizer is slipped between them at 45°. Now…', choices: ['light gets through: 1/8 of the unpolarized light', 'still nothing gets through', 'half the light gets through', 'the light is circularly polarized'], a: 0, why: 'The middle polarizer re-sends light at 45°, which has a component along the last one: ½ × ½ × ½ = 1/8.' },
    { q: 'Adding a polarizer to a system can never increase the light that gets through, since polarizers only absorb.', a: false, why: 'Between crossed polarizers an extra one at an intermediate angle turns the polarization and lets light through.' },
    { q: 'The blue sky is most strongly polarized…', choices: ['90° away from the sun', 'next to the sun', 'directly opposite the sun', 'at the horizon only'], a: 0, why: 'At 90° scattering, only electrons shaken across your line of sight can send you light.' },
    { q: 'Polarizing sunglasses cut the glare from a lake because the reflected light is mostly polarized…', choices: ['horizontally, and the lenses pass only vertical fields', 'vertically, and the lenses pass only horizontal fields', 'circularly', 'not at all — the lenses are just dark'], a: 0, why: 'Near Brewster\'s angle reflection keeps mainly the field parallel to the surface.' },
    { q: 'Polarized light meets a polarizer turned 60° from its polarization. What fraction gets through?', answer: 0.25, why: 'cos² 60° = 0.25.' }
  ],
  problems: [
    { q: 'Polarized light passes a polarizer at 30° to its polarization and then another at 60° (30° beyond the first). What fraction gets through both?', answer: 0.5625, tol: 0.01, hint: 'Apply Malus\'s law twice.',
      steps: ['First: $\\cos^2 30° = 0.75$.', 'Second, 30° further: another 0.75.', 'Total $0.75^2 = 0.5625$. A single polarizer at 60° would pass only 0.25.'] },
    { q: 'At what angle of incidence is light reflected from a diamond (n = 2.42) completely polarized?', answer: 67.55, unit: '°', tol: 0.01, hint: 'tan θ_B = n.',
      steps: ['$\\theta_B = \\arctan 2.42 = 67.5°$.'] }
  ],
  applications: [
    'Polarizing sunglasses and camera filters cut glare and deepen the blue of the sky.',
    'Liquid-crystal displays turn the polarization of light between crossed polarizers, pixel by pixel.',
    '3-D cinemas send the pictures meant for the left and the right eye with different polarizations.',
    'Stress in transparent plastic shows up as coloured fringes between crossed polarizers (photoelasticity).'
  ],
  history: 'Erasmus Bartholin found double refraction in calcite in 1669. Étienne-Louis Malus discovered in 1808 that reflected light is polarized, and stated his cos² law; David Brewster found the angle of complete polarization in 1815. Edwin Land made the first sheet polarizers around 1929, which made polarizing filters cheap enough for sunglasses.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 33 (Polarization) — the electric vector of light, polarization of scattered light, birefringence, polarizers, optical activity, the intensity of reflected light and anomalous refraction.',
    'Vol. II, ch. 33 (Reflection from Surfaces) — reflection and Brewster\'s angle worked out from Maxwell\'s equations.',
    'Vol. III, ch. 11 (More Two-State Systems) — the polarization states of the photon as a two-state system.'
  ],
  sim: 'lux-polarizers'
},

{
  id: 'synchrotron-radiation', parent: 'optics-topic', title: 'Relativistic effects in radiation', level: 3,
  short: 'A charge moving near the speed of light is seen by light that left it at different times. Coming towards you, its motion is squeezed by 1 − β: a circling electron is seen as a train of sharp flashes, beamed forward into a cone of angle 1/γ, with X-ray frequencies — synchrotron light.',
  keywords: ['synchrotron radiation', 'relativistic beaming', 'apparent motion', 'retarded time', 'Lorentz factor', 'critical frequency', 'storage ring', 'Crab Nebula', 'Doppler effect', 'aberration', 'bremsstrahlung', 'energy loss per turn'],
  prereq: ['radiation-accelerated-charge', 'relativistic-mass-energy', 'time-dilation-feyn'],
  related: ['charges-in-fields', 'polarization-feyn', 'four-vectors-feyn', 'retarded-potentials', 'physics:relativistic-doppler', 'physics:charged-particle-motion'],
  body: `
The radiation law of [[radiation-accelerated-charge]] assumed a slow charge. What if it moves almost as fast as its own light? Feynman's full law says the far field follows the [[?second-derivative|second derivative]] of the **apparent** position of the charge — where it *seems* to be, judged by light that left it a time $r/c$ earlier. For a slow charge that is just its acceleration. For a fast one, the delays themselves distort the apparent motion dramatically.

### The apparent motion
Picture a charge going round a circle at speed $v = \\beta c$, watched by a distant observer in the plane of the circle. Light that leaves the charge at time $t$ arrives at $\\tau = t - z(t)/c$ (plus a constant), where $z$ is how far the charge is towards the observer. When the charge moves towards us, each new position is closer, so its light arrives bunched up: a stretch of motion lasting $dt$ is seen in $d\\tau = (1 - \\beta\\cos\\theta)\\,dt$, and at the front of the circle, where the motion points straight at us, in only $(1 - \\beta)\\,dt$.

So the apparent sideways position, plotted against the arrival time $\\tau$, is not a smooth sine curve. For $\\beta$ near 1 it has sharp cusps — like the path of a point on the rim of a rolling wheel — and Feynman drew exactly this curve to show where the radiation comes from. At each cusp the apparent motion turns round abruptly; its second derivative, and so the field, is a sharp spike. The observer receives one short flash per turn.

### How short the flash is
Near the speed of light, $1 - \\beta \\approx 1/2\\gamma^2$, where $\\gamma = 1/\\sqrt{1 - \\beta^2}$ is the [[?lorentz-factor|Lorentz factor]]. The radiation is also squeezed into a narrow cone around the direction of motion, of angle about $1/\\gamma$, so the observer is lit only while the cone sweeps past. Combining the two, the flash lasts about $\\rho/c\\gamma^3$ for a circle of radius $\\rho$, and its spectrum reaches frequencies $\\gamma^3$ times the orbital one. The customary measure is the critical frequency

$$\\omega_c = \\frac{3}{2}\\,\\frac{\\gamma^3 c}{\\rho}$$

Electrons of 3 GeV have $\\gamma \\approx 5900$. On a bend of radius 7 m their orbital frequency is about 7 MHz — radio — yet the photons reach $\\hbar\\omega_c \\approx 8.6$ keV: X-rays. The beam is only $1/\\gamma \\approx 0.17$ milliradians wide.

### Synchrotron light, on Earth and in the sky
Electron synchrotrons were built to accelerate particles, and this radiation was at first a nuisance: it drains energy, $U_0 = e^2\\gamma^4/3\\varepsilon_0\\rho$ every turn — about 1 MeV per turn in the example — which the machine must keep replacing. Today storage rings are built on purpose to make it: brilliant, tunable beams of X-rays for studying proteins, materials and microchips.

Nature got there first. The Crab Nebula, the remains of a supernova seen from Earth in 1054, glows with light from fast electrons spiralling in magnetic fields; its light is strongly polarized, one of the clues to its origin. Feynman discussed it in his lecture on relativistic radiation. Radio galaxies, pulsar winds and the jets of black holes shine the same way.

### Doppler and aberration
The same bunching of arrival times gives the relativistic **Doppler effect**: a source approaching at $\\beta$ has its frequency raised by $\\sqrt{(1+\\beta)/(1-\\beta)}$ — the factor $1/(1 - \\beta)$ from the bunching, corrected by the slowing of the moving source's clock ([[time-dilation-feyn]]). And light from a moving source seems to come from a direction tilted towards its motion: **aberration**, the same effect that beams the radiation forward.

| | slow charge | charge near c |
|---|---|---|
| pattern | $\\sin^2\\theta$ doughnut | narrow forward cone, angle $\\approx 1/\\gamma$ |
| field seen from a circle | smooth sine wave | sharp spikes, once per turn |
| frequencies | the orbital one | up to $\\approx\\gamma^3$ times the orbital one |
| energy lost per turn | small ($\\propto a^2$) | $\\propto\\gamma^4/\\rho$ |

> [!key] A charge moving near c is seen by light that left it at different times. Coming towards you, its apparent motion is squeezed by 1 − β ≈ 1/2γ²: smooth circling becomes a train of sharp flashes, beamed into a cone of angle 1/γ, with frequencies up to γ³ times the orbital one.

In the simulation, raise the speed and watch the wavefronts from the circling charge crowd together ahead of it and the observer's flashes sharpen; the graph shows the apparent sideways motion growing cusps and the field becoming a train of spikes.
`,
  ideas: [
    'The far field follows the second derivative of the apparent position — where the charge seems to be, seen with delayed light.',
    'Motion towards the observer is seen compressed by 1 − β cos θ; at the front of a circle by 1 − β ≈ 1/(2γ²).',
    'A charge circling near c sends sharp flashes, beamed into a cone of angle about 1/γ.',
    'The spectrum reaches ω_c = (3/2)γ³c/ρ: X-rays from electrons that circle at radio frequencies.',
    'The energy lost per turn grows as γ⁴/ρ; the Crab Nebula shines by the same radiation.'
  ],
  pitfalls: [
    'Synchrotron light comes out at the frequency of the orbit — The orbit sets only the repetition of the flashes; each flash is so short that its spectrum reaches γ³ times higher.',
    'Relativistic beaming means the charge radiates only forwards in its own frame — In its instantaneous rest frame the pattern is the ordinary doughnut; the forward cone is the same radiation seen from the laboratory.',
    'The apparent speed of the charge can never exceed c — Apparent motions, judged by arrival times, can: the apparent sideways motion at a cusp is very fast. Nothing real outruns light.'
  ],
  formulas: [
    {
      name: 'Lorentz factor of an electron from its energy',
      expr: 'gamma = E/(me*c^2)', tex: '\\gamma = \\frac{E}{m_e c^2}',
      vars: {
        gamma: { name: 'Lorentz factor', tex: '\\gamma' },
        E: { name: 'total energy of the electron', q: 'energy', unit: 'GeV', value: 3 },
        me: { const: 'me' },
        c: { const: 'c' }
      },
      note: 'm_ec² = 0.511 MeV, so γ ≈ 1957 per GeV.',
      stories: { gamma: 'What is the Lorentz factor of an electron of {E}?', E: 'What energy gives an electron a Lorentz factor of {gamma}?' }
    },
    {
      name: 'Opening angle of the beam',
      expr: 'theta = 1/gamma', tex: '\\theta \\approx \\frac{1}{\\gamma}',
      vars: {
        theta: { name: 'angular width of the forward cone', q: 'angle', unit: 'mrad', tex: '\\theta' },
        gamma: { name: 'Lorentz factor', value: 5871, tex: '\\gamma' }
      },
      note: 'Order of magnitude: the half-angle of the cone that holds most of the radiation.',
      stories: { theta: 'Electrons with a Lorentz factor of {gamma} circle in a storage ring. How wide is the cone of their radiation?' }
    },
    {
      name: 'Critical photon energy',
      expr: 'Ec = 1.5*hbar*c*gamma^3/rho', tex: 'E_c = \\hbar\\omega_c = \\frac{3}{2}\\,\\frac{\\hbar c\\,\\gamma^3}{\\rho}',
      vars: {
        Ec: { name: 'critical photon energy', q: 'energy', unit: 'keV', tex: 'E_c' },
        hbar: { const: 'hbar' },
        c: { const: 'c' },
        gamma: { name: 'Lorentz factor', value: 5871, tex: '\\gamma' },
        rho: { name: 'radius of the bend', q: 'length', unit: 'm', value: 7, tex: '\\rho' }
      },
      note: 'Half the radiated power lies above this energy.',
      stories: { Ec: 'Electrons with Lorentz factor {gamma} are bent on a radius of {rho}. What is the critical photon energy?', rho: 'What bending radius gives a critical energy of {Ec} for electrons with Lorentz factor {gamma}?' }
    },
    {
      name: 'Energy radiated per turn',
      expr: 'U0 = qe^2*gamma^4/(3*eps0*rho)', tex: 'U_0 = \\frac{e^2\\gamma^4}{3\\varepsilon_0\\rho}',
      vars: {
        U0: { name: 'energy lost per turn by one electron', q: 'energy', unit: 'MeV', tex: 'U_0' },
        qe: { const: 'qe' },
        gamma: { name: 'Lorentz factor', value: 5871, tex: '\\gamma' },
        eps0: { const: 'eps0' },
        rho: { name: 'bending radius', q: 'length', unit: 'm', value: 7, tex: '\\rho' }
      },
      note: 'For a ring whose bends all have radius ρ, with speed ≈ c. Grows as the fourth power of the energy.',
      stories: { U0: 'Electrons with Lorentz factor {gamma} go round bends of radius {rho}. How much energy does each lose per turn?' }
    }
  ],
  derivation: {
    title: 'How much faster the apparent motion runs',
    steps: [
      { text: 'Light leaving the charge at time $t$, when it is a distance $z(t)$ towards the observer, arrives at the (distant) observer at', tex: '\\tau = t - \\frac{z(t)}{c} + \\text{constant}' },
      { text: 'Differentiate: a short interval $dt$ of the charge\'s motion is seen during $d\\tau$. The [[?derivative]] $dz/dt$ is the velocity towards the observer, $v\\cos\\theta$:', tex: '\\frac{d\\tau}{dt} = 1 - \\frac{1}{c}\\frac{dz}{dt} = 1 - \\beta\\cos\\theta' },
      { text: 'Moving straight at the observer ($\\theta = 0$) the motion is seen speeded up by $1/(1 - \\beta)$. Write it with the Lorentz factor, using $1 - \\beta^2 = (1-\\beta)(1+\\beta) \\approx 2(1 - \\beta)$ when $\\beta \\approx 1$:', tex: '1 - \\beta \\approx \\frac{1}{2\\gamma^2}' },
      { text: 'The apparent sideways acceleration involves this factor several times over (once for each time derivative, and again as the motion turns): at the front of a circle it is $1/(1-\\beta)^2 \\approx 4\\gamma^4$ times the slow-motion value — the spike of the flash.', tex: '\\frac{d^2 y}{d\\tau^2} = -\\frac{v^2}{\\rho}\\,\\frac{\\sin u + \\beta}{(1 + \\beta\\sin u)^3} \\;\\xrightarrow{\\ \\sin u = -1\\ }\\; \\frac{v^2}{\\rho}\\,\\frac{1}{(1 - \\beta)^2}' }
    ]
  },
  examples: [
    {
      title: 'A 3 GeV storage ring',
      q: 'Electrons of 3 GeV circle on bends of radius 7 m. Find $\\gamma$, the opening angle of the radiation, and the critical photon energy.',
      steps: [
        '$\\gamma = E/m_ec^2 = 3000/0.511 = 5871$.',
        'Opening angle $\\approx 1/\\gamma = 1.7\\times10^{-4}$ rad = 0.17 mrad: 10 m from the source the beam is only about 1.7 mm wide.',
        '$E_c = \\tfrac32 \\hbar c\\gamma^3/\\rho = 1.5 \\times 3.16\\times10^{-26} \\times 2.02\\times10^{11}/7 = 1.37\\times10^{-15}$ J = 8.6 keV.'
      ],
      a: '$\\gamma \\approx 5900$, a cone of 0.17 mrad, photons around 8.6 keV (X-rays).'
    },
    {
      title: 'The cost of keeping the beam',
      q: 'How much energy does each electron of the previous example lose per turn, and what power must be supplied to a beam of 300 mA?',
      steps: [
        '$U_0 = e^2\\gamma^4/3\\varepsilon_0\\rho = (2.567\\times10^{-38} \\times 1.19\\times10^{15})/(3 \\times 8.854\\times10^{-12} \\times 7) = 1.64\\times10^{-13}$ J = 1.02 MeV.',
        'A current $I$ carries $I/e$ electrons past any point per second, each losing $U_0$ per turn: power $= (U_0/e) \\times I = 1.02\\times10^6\\ \\mathrm{V} \\times 0.3\\ \\mathrm{A}$.',
        '$P \\approx 307$ kW, supplied by radio-frequency cavities.'
      ],
      a: 'About 1 MeV per electron per turn; about 300 kW for the whole beam.'
    }
  ],
  quiz: [
    { q: 'A charge moves straight towards you at speed βc. A stretch of its motion lasting 1 s is seen by you in…', choices: ['(1 − β) seconds', '(1 + β) seconds', '1/(1 − β) seconds', 'exactly 1 second'], a: 0, why: 'Its light from the end of the stretch has less far to travel: dτ = (1 − β) dt.' },
    { q: 'The radiation of an electron with Lorentz factor γ is concentrated in a forward cone of angle about…', choices: ['1/γ', 'γ', '1/γ²', '45°'], a: 0, why: 'Aberration squeezes the radiation into a cone of half-angle about 1/γ.' },
    { q: 'Synchrotron radiation from a ring whose electrons go round a few million times a second comes out at a few megahertz.', a: false, why: 'The orbit sets the repetition of the flashes; the flashes are so short that the spectrum reaches γ³ times higher — X-rays.' },
    { q: 'Doubling the energy of the electrons in a ring (same radius) multiplies the energy each loses per turn by…', choices: ['16', '2', '4', '8'], a: 0, why: 'U₀ ∝ γ⁴ and γ doubles: 2⁴ = 16.' },
    { q: 'What is the Lorentz factor of a 1 GeV electron?', answer: 1957, why: 'γ = 1000 MeV/0.511 MeV ≈ 1957.' }
  ],
  problems: [
    { q: 'Electrons of 6 GeV go round bends of radius 25 m. What is the critical photon energy of their synchrotron light?', answer: 19.17, unit: 'keV', tol: 0.02, hint: 'Find γ first, then E_c = 1.5ħcγ³/ρ.',
      steps: ['$\\gamma = 6000/0.511 = 11742$; $\\gamma^3 = 1.619\\times10^{12}$.', '$E_c = 1.5 \\times 1.0546\\times10^{-34} \\times 2.998\\times10^8 \\times 1.619\\times10^{12}/25 = 3.07\\times10^{-15}$ J = 19.2 keV.'] },
    { q: 'How wide (in milliradians) is the cone of radiation of 6 GeV electrons?', answer: 0.0852, unit: 'mrad', tol: 0.02, hint: 'θ ≈ 1/γ.',
      steps: ['$\\gamma = 11742$.', '$\\theta \\approx 1/\\gamma = 8.5\\times10^{-5}$ rad = 0.085 mrad.'] }
  ],
  applications: [
    'Synchrotron light sources give intense, tunable X-rays for protein crystallography, materials science and chip inspection.',
    'Free-electron lasers wiggle relativistic electrons through magnets to make coherent X-ray flashes.',
    'Radio astronomy: the Crab Nebula, radio galaxies and quasar jets shine by synchrotron radiation, and its polarization maps their magnetic fields.',
    'Energy loss by synchrotron radiation is why the largest electron colliders are either very large rings or straight (linear) machines.'
  ],
  history: 'Synchrotron radiation was first seen in 1947 as a bright spot of light in a 70 MeV electron synchrotron at the General Electric laboratory in New York. Julian Schwinger worked out its theory in detail in 1949. In 1953 Iosif Shklovsky proposed that the light of the Crab Nebula is synchrotron radiation, and its strong polarization, measured soon after, confirmed it.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 34 (Relativistic Effects in Radiation) — moving sources, finding the apparent motion, synchrotron radiation, cosmic synchrotron radiation (the Crab Nebula), bremsstrahlung, the Doppler effect, the ω, k four-vector, aberration and the momentum of light.',
    'Vol. I, ch. 28 (Electromagnetic Radiation) — the law of the field in terms of the apparent direction of the charge, on which the chapter builds.'
  ],
  sim: 'lux-synchrotron'
},

{
  id: 'color-vision-feyn', parent: 'seeing', title: 'Colour vision', level: 1,
  short: 'Light has a spectrum — a whole curve — but colour is just three numbers: the responses of three kinds of cone in the retina. Lights with the same three responses look identical, which is why three primaries can match almost any colour, and why red plus green looks yellow.',
  keywords: ['colour', 'color vision', 'cones', 'rods', 'three primaries', 'metamers', 'colour matching', 'chromaticity diagram', 'colour blindness', 'trichromacy', 'Purkinje shift', 'spectrum', 'RGB'],
  prereq: ['geometrical-optics-feyn', 'photons-as-particles', 'physics:em-spectrum'],
  related: ['mechanisms-of-seeing', 'scattering-blue-sky', 'linear-systems', 'physics:color-vision', 'physics:color-mixing', 'medicine:vision'],
  body: `
Colour is not in the light. Light has a spectrum — how much energy it carries at each wavelength — which is a whole curve. What we see as colour is only three numbers: the responses of three kinds of cone cell in the retina. Feynman devoted a lecture to this because it shows so clearly where physics hands over to physiology: the physics is simple, and the surprises are in the eye.

### Three kinds of cone
The retina has about 6 million cones, which work in good light, and about 120 million rods, which work in dim light. The cones come in three kinds, each with a pigment that absorbs over a broad band of wavelengths, peaking roughly at 440 nm (S, for short), 540 nm (M, medium) and 565 nm (L, long). A light with spectrum $I(\\lambda)$ produces three responses,

$$L = \\int I(\\lambda)\\,\\bar l(\\lambda)\\,d\\lambda, \\qquad M = \\int I(\\lambda)\\,\\bar m(\\lambda)\\,d\\lambda, \\qquad S = \\int I(\\lambda)\\,\\bar s(\\lambda)\\,d\\lambda$$

each an [[?integral]] of the spectrum weighted by one sensitivity curve. That is all the brain is told about colour.

### Three numbers are enough
Two lights with different spectra but the same three responses look **identical**: they are *metamers*. A pure yellow of 580 nm and a mixture of red and green light, with no yellow in it at all, can be made indistinguishable — which is how every screen shows yellow. Because the responses simply add ([[linear-systems|superposition]] again), any colour can be matched by adjusting three primary lights. Sometimes the match works only if one primary is moved to the other side and mixed with the colour being matched — a "negative" amount. A spectral blue-green, for instance, is more saturated than any mixture of red, green and blue; screens cannot show it.

So every colour is a point with three coordinates. Dividing out the overall brightness leaves two numbers, the **chromaticity**, which can be drawn on a flat map — the chromaticity diagram. The international standard (CIE, 1931) uses three imaginary primaries X, Y, Z, chosen so that every real colour needs only positive amounts, with chromaticity $x = X/(X+Y+Z)$ and $y = Y/(X+Y+Z)$. The pure spectral colours lie on a horseshoe-shaped curve; every real colour lies inside it; the mixtures of two lights lie on the straight line between them.

### Colour blindness
About 8 % of men of northern European descent, and about 0.5 % of women, have red–green colour vision deficiency: the L or the M pigment is missing or shifted. Someone with only two kinds of cone can match every colour with **two** primaries, and confuses colours that differ only in the missing response. That such matches work exactly as predicted is strong evidence for the three-pigment picture.

### Colour depends on intensity
In dim light only the rods work. They have a single pigment, rhodopsin, most sensitive near 500 nm, so night vision has no colour: a moonlit garden is grey. The rods favour blue-green over red, so at dusk red flowers darken before blue ones (the Purkinje shift). And since the centre of the retina, the fovea, has no rods, a faint star is easier to see slightly to one side of where you look.

| Light | S | M | L | seen as |
|---|---|---|---|---|
| 450 nm | high | low | low | violet-blue |
| 540 nm | almost 0 | high | high | green |
| 580 nm | almost 0 | medium | high | yellow |
| 650 nm + 540 nm, suitably mixed | almost 0 | medium | high | the same yellow |

> [!key] A spectrum is a whole curve; colour is three numbers — the responses of the S, M and L cones. Lights with the same three numbers look identical, whatever their spectra.

In the simulation, mix three lights and compare the cone responses with those of a target colour. Make a spectral yellow out of red and green; find the targets that need a "negative" primary; then remove one kind of cone and see why a colour-blind observer needs only two lights.
`,
  ideas: [
    'Colour is three numbers: the responses of the S, M and L cones, each an integral of the spectrum times a sensitivity curve.',
    'Different spectra with the same three responses (metamers) look identical: red + green matches spectral yellow.',
    'Because responses add, three primaries match almost any colour — some only with a "negative" amount.',
    'People with two kinds of cone match every colour with two primaries.',
    'In dim light only the rods work: one pigment, no colour, and more sensitivity to blue-green (Purkinje shift).'
  ],
  pitfalls: [
    'Each wavelength has its own colour receptor — There are only three kinds of cone, with broad, overlapping sensitivities; the brain compares their three responses.',
    'A screen\'s yellow contains yellow light — It is red and green light giving the same cone responses as spectral yellow.',
    'Any colour can be made by mixing red, green and blue — Every mixture lies inside the triangle of its primaries; the most saturated spectral colours lie outside it.'
  ],
  formulas: [
    {
      name: 'Energy of a photon',
      expr: 'E = h*c/lambda', tex: 'E = \\frac{hc}{\\lambda}',
      vars: {
        E: { name: 'photon energy', q: 'energy', unit: 'eV' },
        h: { const: 'h' },
        c: { const: 'c' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' }
      },
      note: 'Visible photons carry 1.8–3.1 eV: enough to change the shape of a pigment molecule, too little to break most bonds.',
      stories: { E: 'What energy does a photon of {lambda} carry?', lambda: 'A pigment responds to photons of {E}. What wavelength is that?' }
    },
    {
      name: 'Chromaticity coordinate',
      expr: 'x = X/(X + Y + Z)', tex: 'x = \\frac{X}{X + Y + Z}',
      vars: {
        x: { name: 'chromaticity x' },
        X: { name: 'amount of primary X (tristimulus value)', value: 0.3 },
        Y: { name: 'amount of primary Y (tristimulus value)', value: 0.4 },
        Z: { name: 'amount of primary Z (tristimulus value)', value: 0.3 }
      },
      note: 'The share of X in the colour; y = Y/(X + Y + Z) likewise. White is near x = y = 1/3.',
      stories: { x: 'A colour has tristimulus values {X}, {Y} and {Z}. What is its chromaticity x?' }
    }
  ],
  examples: [
    {
      title: 'Photon energies across the spectrum',
      q: 'What energies do photons of violet (400 nm), green (550 nm) and red (700 nm) light carry?',
      steps: [
        '$hc = 6.626\\times10^{-34} \\times 2.998\\times10^8 = 1.986\\times10^{-25}$ J·m, which is 1240 eV·nm.',
        '400 nm: $1240/400 = 3.10$ eV. 550 nm: 2.25 eV. 700 nm: 1.77 eV.'
      ],
      a: '3.1 eV, 2.25 eV and 1.8 eV.'
    },
    {
      title: 'Why a lemon and a screen look the same yellow',
      q: 'A lemon reflects a broad band of light from about 500 to 700 nm; a screen emits two narrow lines, red and green. Why can they look the same?',
      steps: [
        'Both produce almost no S response (nothing much below 500 nm).',
        'Both excite L strongly and M somewhat less; the screen\'s red and green intensities are set to give the same L and M as the lemon.',
        'Equal S, M and L means the eye cannot tell them apart. A spectrometer could.'
      ],
      a: 'They are metamers: different spectra, the same three cone responses.'
    },
    {
      title: 'A point on the chromaticity diagram',
      q: 'A colour has tristimulus values X = 20, Y = 30, Z = 50. Where does it sit on the diagram?',
      steps: ['$X + Y + Z = 100$.', '$x = 0.20$, $y = 0.30$.', 'Below and to the left of white ($x = y \\approx 0.33$): a bluish colour.'],
      a: '$x = 0.20$, $y = 0.30$ — bluish.'
    }
  ],
  quiz: [
    { q: 'Two lights with different spectra look exactly the same colour when…', choices: ['they give the same responses in all three kinds of cone', 'they have the same brightest wavelength', 'they have the same total energy', 'they are both pure spectral colours'], a: 0, why: 'The eye reports only three numbers; equal numbers mean an identical colour (metamers).' },
    { q: 'The yellow on a phone screen contains light of about 580 nm.', a: false, why: 'Screens emit red, green and blue. Their yellow is red plus green, matched to the cone responses of spectral yellow.' },
    { q: 'Colours disappear by moonlight because…', choices: ['only the rods work, and they have a single pigment', 'moonlight has no colour in it', 'the pupil is too small', 'the cones are saturated'], a: 0, why: 'One kind of receptor can only report one number: brightness.' },
    { q: 'How many primary lights does a person with only two kinds of cone need to match any colour?', answer: 2, why: 'Two responses, two numbers to adjust.' },
    { q: 'What energy, in eV, does a photon of 450 nm carry?', answer: 2.76, unit: 'eV', why: 'E = 1240 eV·nm / 450 nm = 2.76 eV.' }
  ],
  problems: [
    { q: 'What energy does a photon of red light of 700 nm carry, in electronvolts?', answer: 1.771, unit: 'eV', tol: 0.01, hint: 'E = hc/λ, with hc = 1240 eV·nm.',
      steps: ['$E = 1240/700$.', '$E = 1.77$ eV.'] },
    { q: 'A colour has tristimulus values X = 45, Y = 40, Z = 15. What is its chromaticity x?', answer: 0.45, tol: 0.01, hint: 'x = X/(X + Y + Z).',
      steps: ['$X + Y + Z = 100$.', '$x = 45/100 = 0.45$ — an orange-yellow, right of white.'] }
  ],
  applications: [
    'Every colour screen, printer and camera works with three (or four) primaries because the eye has three kinds of cone.',
    'Colour standards (CIE, sRGB) let manufacturers reproduce the same colour on different devices.',
    'Tests for colour vision deficiency use patterns that look different only to people with a missing pigment.',
    'Lighting design: two lamps can look equally white yet render coloured objects differently, because their spectra differ.'
  ],
  history: 'Thomas Young proposed in 1802 that the eye has just three kinds of colour receptor; Hermann von Helmholtz developed the idea in the 1850s, and James Clerk Maxwell measured colour matches and projected the first colour photograph in 1861. John Dalton described his own colour blindness in 1794. The international colour-matching standard was set by the CIE in 1931, and in 1964 the absorption of single cones was measured directly, confirming three pigments.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 35 (Color Vision) — the human eye, colour depending on intensity, measuring the colour sensation, the chromaticity diagram, the mechanism of colour vision and the chemistry of the pigments.',
    'Vol. I, ch. 36 (Mechanisms of Seeing) — the sensation of colour, which begins the next lecture.'
  ],
  sim: 'lux-cones'
},

{
  id: 'mechanisms-of-seeing', parent: 'seeing', title: 'How eyes work', level: 2,
  short: 'The eye focuses by changing the shape of its lens, is limited by diffraction at the pupil with a mosaic of cones matched to that limit, detects single photons with its rods, and processes the picture before it reaches the brain. An insect\'s compound eye is a different solution, with a best facet size √(λR).',
  keywords: ['eye', 'cornea', 'lens', 'accommodation', 'presbyopia', 'myopia', 'hyperopia', 'spectacles', 'dioptre', 'pupil', 'diffraction limit', 'fovea', 'rods', 'rhodopsin', 'single photon', 'dark adaptation', 'compound eye', 'ommatidium', 'lateral inhibition', 'Mach bands'],
  prereq: ['geometrical-optics-feyn', 'color-vision-feyn', 'diffraction-feyn'],
  related: ['photons-as-particles', 'physics:the-eye', 'physics:vision-correction', 'physics:resolution', 'medicine:vision', 'medicine:neurons'],
  body: `
The eye is a camera — and much more. Feynman's second lecture on vision runs from its optics to the chemistry of the rods, the eyes of insects, and the processing nerve cells do before any signal reaches the brain.

### Focusing: a lens that changes shape
Most of the eye's focusing — about 40 of its 60 dioptres (a dioptre is one [[?inverse]] metre of optical power) — is done by the curved front surface, the cornea, where light passes from air into the watery eye ([[geometrical-optics-feyn]]). The lens behind it adds the rest and, crucially, can change: a ring of muscle lets it bulge to focus on near things. This is **accommodation**. With the image distance fixed at the retina, the lens equation fixes the power the eye needs, $P = 1/s_o + n/s_i$ (with $n = 1.336$ for the fluid inside): going from a distant view to a page 25 cm away needs 4 dioptres more.

The range of accommodation shrinks as the lens stiffens with age: about 14 D at ten, 10 D at twenty, 4 D at forty-five and 1 D at sixty, when reading glasses become necessary (presbyopia). A short-sighted (myopic) eye is too strong for its length: distant objects focus in front of the retina, and a diverging spectacle lens corrects it. A long-sighted (hyperopic) eye is too weak and needs a converging lens.

### Sharpness: diffraction and the mosaic of cones
Even a perfect eye cannot focus a point to a point: the pupil diffracts ([[diffraction-feyn]]). For a pupil of diameter $D$ the blur is about $1.22\\lambda/D$ — 0.8 arcminutes for a 3 mm pupil in green light. The cones at the centre of the fovea are packed about 2.5 µm apart, which, 17 mm behind the eye's optical centre, is 0.5 arcminutes: about two cones across the blur. Optics and sampling are matched: good eyes resolve about one arcminute.

### The rods: counting photons
The rods contain rhodopsin: a protein holding a small molecule, retinal, which a single photon of visible light (2–3 eV) can switch from a bent to a straight shape. That starts a chemical cascade which amplifies the event enormously, so that a single rod responds to a single photon. In 1942 Selig Hecht, Simon Shlaer and Maurice Pirenne showed that a fully dark-adapted person can see a flash when only about 5–10 photons are absorbed. Dark adaptation takes about half an hour, while bleached rhodopsin is rebuilt; the eye works over a range of about $10^{10}$ in brightness, only a factor of 16 of it from the pupil, $(8\\ \\mathrm{mm}/2\\ \\mathrm{mm})^2$.

### The compound eye of an insect
A bee's eye is made of thousands of little tubes, ommatidia, each looking in its own direction through a tiny lens of diameter $\\delta$ on an eye of radius $R$. Two effects compete. Neighbouring tubes point in directions $\\delta/R$ apart, so smaller facets sample the world more finely; but each tiny lens diffracts, blurring by about $\\lambda/\\delta$, so smaller facets see more blurrily. The total, $\\delta/R + \\lambda/\\delta$, is smallest when the two are equal, at the [[?square-root]]

$$\\delta = \\sqrt{\\lambda R}$$

For $R \\approx 3$ mm and $\\lambda \\approx 0.4$ µm this is about 35 µm — and a bee's facets are a few tens of micrometres across. Feynman worked through this trade-off in his lecture as an example of physics setting the design of an animal.

### Seeing is computing
Before signals leave the eye, nerve cells compare neighbouring receptors. In the eye of the horseshoe crab *Limulus*, Keffer Hartline found that each receptor's signal is reduced by the activity of its neighbours — **lateral inhibition**. Uniform areas are played down and edges exaggerated, with an overshoot on either side of a step. We see the same effect as Mach bands: faint light and dark stripes along the edges of a shaded region.

| Part | what it does | numbers |
|---|---|---|
| cornea | most of the focusing | about 40 D |
| lens | fine focus | about 20 D, plus up to 14 D when young |
| pupil | aperture, 2–8 mm | diffraction blur about 0.8′ at 3 mm |
| fovea | sharp colour vision, cones only | cones about 2.5 µm apart |
| rods | night vision, one pigment | respond to single photons |

> [!key] The eye focuses by changing its lens, is limited by diffraction at the pupil with a mosaic of cones matched to it, detects single photons with its rods — and processes the picture in the retina before the brain sees it.

In the simulations: focus an eye near and far, age it and add spectacles; find the best facet of a compound eye; watch receptors that subtract their neighbours sharpen edges.
`,
  ideas: [
    'The cornea does most of the focusing; the lens changes shape to add up to about 14 D (young) — less with age.',
    'Myopia (eye too strong) is corrected with a diverging lens, hyperopia and presbyopia with converging lenses.',
    'The pupil\'s diffraction (1.22λ/D) and the spacing of the foveal cones are matched: about one arcminute of resolution.',
    'Rods detect single photons; dark adaptation and the pupil give a working range of about 10¹⁰.',
    'A compound eye\'s best facet is δ = √(λR), where sampling and diffraction blur are equal; retinas also sharpen edges by lateral inhibition.'
  ],
  pitfalls: [
    'The lens of the eye does most of the focusing — The cornea does about two-thirds of it; the lens adds the adjustable part.',
    'Short-sighted people need stronger lenses to see far — Their eyes are already too strong; they need diverging (negative) lenses.',
    'A bee could see as sharply as we do if it had more, smaller facets — Smaller facets diffract more; with its small eye the bee is already near the best compromise.'
  ],
  formulas: [
    {
      name: 'Power the eye needs to focus',
      expr: 'P = 1/so + n/si', tex: 'P = \\frac{1}{s_o} + \\frac{n}{s_i}',
      vars: {
        P: { name: 'optical power of cornea and lens together', q: 'optpower', unit: 'D' },
        so: { name: 'distance of the object', q: 'length', unit: 'm', value: 0.25, tex: 's_o' },
        n: { name: 'refractive index inside the eye', value: 1.336 },
        si: { name: 'distance from the eye\'s optics to the retina (reduced eye)', q: 'length', unit: 'mm', value: 22.3, tex: 's_i' }
      },
      note: 'The simplified "reduced eye": one refracting surface into a medium of index 1.336. Relaxed and focused far away, P ≈ 60 D.',
      stories: { P: 'An eye {si} long (reduced eye, index {n}) looks at a page {so} away. What power must it have?', so: 'An eye {si} long can reach a power of {P}. What is its near point?' }
    },
    {
      name: 'Diffraction limit of the pupil',
      expr: 'theta = 1.22*lambda/D', tex: '\\theta = 1.22\\,\\frac{\\lambda}{D}',
      vars: {
        theta: { name: 'smallest angle resolved', q: 'angle', unit: '′', tex: '\\theta' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        D: { name: 'diameter of the pupil', q: 'length', unit: 'mm', value: 3 }
      },
      note: 'Rayleigh\'s criterion for a round aperture: the centre of one blur disc on the first dark ring of the other.',
      stories: { theta: 'What angle can an eye with a pupil of {D} resolve in light of {lambda}?', D: 'What pupil would resolve {theta} in light of {lambda}?' }
    },
    {
      name: 'Best facet of a compound eye',
      expr: 'delta = sqrt(lambda*R)', tex: '\\delta = \\sqrt{\\lambda R}',
      vars: {
        delta: { name: 'best facet diameter', q: 'length', unit: 'µm', tex: '\\delta' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 400, tex: '\\lambda' },
        R: { name: 'radius of the eye', q: 'length', unit: 'mm', value: 3 }
      },
      note: 'Where the sampling angle δ/R equals the diffraction blur λ/δ; including the factor 1.22 changes it by 10 %.',
      stories: { delta: 'An insect\'s eye has a radius of {R} and sees best near {lambda}. What facet size gives the sharpest vision?' }
    },
    {
      name: 'Near point from the range of accommodation',
      expr: 'dn = 1/A', tex: 'd_n = \\frac{1}{A}',
      vars: {
        dn: { name: 'nearest distance in focus (eye otherwise normal)', q: 'length', unit: 'cm', tex: 'd_n' },
        A: { name: 'range of accommodation', q: 'optpower', unit: 'D', value: 4 }
      },
      note: 'For an eye that focuses at infinity when relaxed. About 14 D at age 10, 10 D at 20, 4 D at 45, 1 D at 60.',
      stories: { dn: 'An eye can accommodate by {A}. How close can it focus?', A: 'A person can read no closer than {dn}. What is their range of accommodation?' }
    }
  ],
  derivation: {
    title: 'The best facet of a compound eye',
    steps: [
      { text: 'Neighbouring facets, each $\\delta$ wide on an eye of radius $R$, look in directions $\\delta/R$ apart: the eye cannot see detail finer than that. Each facet also diffracts light over an angle of about $\\lambda/\\delta$. The total blur is', tex: '\\Delta\\theta(\\delta) = \\frac{\\delta}{R} + \\frac{\\lambda}{\\delta}' },
      { text: 'Find the facet size that makes this smallest: set the [[?derivative]] with respect to $\\delta$ to zero.', tex: '\\frac{d\\,\\Delta\\theta}{d\\delta} = \\frac{1}{R} - \\frac{\\lambda}{\\delta^2} = 0' },
      { text: 'Solve for $\\delta$. At the optimum the two blurs are equal, each $\\sqrt{\\lambda/R}$.', tex: '\\delta = \\sqrt{\\lambda R}, \\qquad \\Delta\\theta_{\\min} = 2\\sqrt{\\frac{\\lambda}{R}}' },
      { text: 'For a bee, $\\lambda = 0.4$ µm and $R = 3$ mm give $\\delta \\approx 35$ µm and a blur of about 0.023 rad, or 1.3° — about fifty times coarser than a human eye.', tex: '\\delta = \\sqrt{0.4\\times10^{-6} \\times 3\\times10^{-3}}\\ \\mathrm{m} \\approx 35\\ \\mu\\mathrm{m}' }
    ]
  },
  examples: [
    {
      title: 'Reading glasses',
      q: 'At 50, a person\'s eye can accommodate by only 2 D. How close can they read, and what spectacles let them read at 25 cm?',
      steps: [
        'Near point $= 1/A = 1/2$ m = 50 cm.',
        'Reading at 25 cm needs 4 D of extra power; the eye supplies 2 D.',
        'Spectacles of +2 D supply the rest.'
      ],
      a: 'Near point 50 cm; +2 D reading glasses.'
    },
    {
      title: 'Diffraction against the cone mosaic',
      q: 'Compare the diffraction blur of a 3 mm pupil (550 nm) with the angle between neighbouring foveal cones, 2.5 µm apart and 17 mm from the eye\'s optical centre.',
      steps: [
        'Diffraction: $1.22 \\times 550\\times10^{-9}/3\\times10^{-3} = 2.24\\times10^{-4}$ rad = 0.77′.',
        'Cones: $2.5\\times10^{-6}/17\\times10^{-3} = 1.47\\times10^{-4}$ rad = 0.51′.',
        'About one and a half cone spacings per blur: the retina samples just finely enough.'
      ],
      a: 'Blur 0.77′, cone spacing 0.51′: well matched.'
    },
    {
      title: 'A bee\'s best facet',
      q: 'Find the best facet size for an eye of radius 3 mm working at 400 nm, and the resulting blur.',
      steps: ['$\\delta = \\sqrt{\\lambda R} = \\sqrt{4\\times10^{-7} \\times 3\\times10^{-3}} = 3.5\\times10^{-5}$ m = 35 µm.', 'Blur $= 2\\sqrt{\\lambda/R} = 2\\sqrt{1.33\\times10^{-4}} = 0.023$ rad = 1.3°.'],
      a: 'About 35 µm, with a blur of about 1.3°.'
    }
  ],
  quiz: [
    { q: 'Most of the focusing power of the eye is in…', choices: ['the cornea', 'the lens', 'the pupil', 'the retina'], a: 0, why: 'The big jump in refractive index is at the front surface, from air into the eye: about 40 of 60 dioptres.' },
    { q: 'People need reading glasses in middle age because the eyeball becomes shorter.', a: false, why: 'The lens stiffens and can no longer bulge enough to add the power needed for near objects (presbyopia).' },
    { q: 'A short-sighted eye is corrected with…', choices: ['a diverging (negative) lens', 'a converging (positive) lens', 'a smaller pupil only', 'a prism'], a: 0, why: 'The eye is too strong for its length; a negative lens reduces the total power.' },
    { q: 'Why would smaller, more numerous facets not give a bee sharper vision?', choices: ['each smaller facet diffracts light over a wider angle', 'smaller facets let in more ultraviolet', 'the brain could not count them', 'smaller facets focus too strongly'], a: 0, why: 'Diffraction blur grows as λ/δ, so below √(λR) the total blur gets worse.' },
    { q: 'How many dioptres of extra power does a normal eye need to switch from a distant view to a page at 25 cm?', answer: 4, unit: 'D', why: '1/0.25 m = 4 D.' }
  ],
  problems: [
    { q: 'A person\'s near point is 1.0 m. What power of reading glasses (worn close to the eye) lets them read at 25 cm?', answer: 3, unit: 'D', tol: 0.02, hint: 'The glasses must supply the difference between the vergences 1/0.25 and 1/1.0.',
      steps: ['Needed: $1/0.25 = 4$ D; available: $1/1.0 = 1$ D.', 'Glasses: $4 - 1 = +3$ D.'] },
    { q: 'What is the diffraction-limited resolution of a dark-adapted eye with a 7 mm pupil, at 550 nm, in arcminutes?', answer: 0.33, unit: '′', tol: 0.02, hint: 'θ = 1.22λ/D.',
      steps: ['$\\theta = 1.22 \\times 550\\times10^{-9}/7\\times10^{-3} = 9.6\\times10^{-5}$ rad.', 'In arcminutes: $9.6\\times10^{-5} \\times 3438 = 0.33′$ — though in dim light the rods, pooled together, cannot use it.'] }
  ],
  applications: [
    'Spectacles, contact lenses and laser surgery reshape the eye\'s total power.',
    'Camera sensors and screens are designed around the one-arcminute resolution of the eye.',
    'Single-photon detection by rods is a benchmark for low-light cameras and night-vision devices.',
    'Edge enhancement in image processing imitates lateral inhibition.'
  ],
  history: 'Johannes Kepler explained in 1604 that the eye forms an inverted image on the retina. Ernst Mach described the bands at the edges of shaded regions in 1865. Selig Hecht, Simon Shlaer and Maurice Pirenne measured the few photons needed to see a flash in 1942. Keffer Hartline\'s work on lateral inhibition in the horseshoe crab earned him a share of the 1967 Nobel Prize in Physiology or Medicine, with Ragnar Granit and George Wald.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. I, ch. 36 (Mechanisms of Seeing) — the physiology of the eye, the rod cells, the compound eye of insects and the best size of its facets, other eyes, and the nerve processing of vision.',
    'Vol. I, ch. 35 (Color Vision) — the human eye: cornea, lens, retina, rods and cones.',
    'Vol. I, ch. 27 (Geometrical Optics) — the focusing that the cornea and the lens perform.'
  ],
  sim: ['lux-eye', 'lux-bee', 'lux-edges']
}

);
