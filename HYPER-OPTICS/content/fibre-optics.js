/* HYPER-OPTICS · content/fibre-optics.js — the topic "Optical fibres" (prefix fo-).
 * How a fibre guides light, its numerical aperture, single-mode and multimode fibre, attenuation and the windows,
 * dispersion and bandwidth, connectors and ferrules, coupling light in, bundles and image guides, links, sensors.
 * Numbers come from the fibre engine (index, NA, V number, modes, cut-off, mode-field diameter, loss) and from
 * the standards named in each page's sources; the simulations are in sims/fibre-optics.js.
 */
Hyper.add(

/* ================================================================ 1 */
{
  id: 'how-an-optical-fibre-guides-light', parent: 'fibre-optics', title: 'How an optical fibre guides light', level: 1,
  short: 'An optical fibre is a thread of glass with a core of slightly higher refractive index than the cladding around it. Light inside the core meets the boundary at a grazing angle and is totally reflected, again and again, so it follows the fibre round bends and over kilometres.',
  keywords: ['optical fibre', 'optical fiber', 'core', 'cladding', 'coating', 'total internal reflection', 'step-index', 'light guide', 'waveguide', 'glass fibre', 'germanium doping', 'fibre optics', 'guided ray'],
  prereq: ['critical-angle-and-total-internal-reflection', 'refractive-index', 'snells-law'],
  related: ['fibre-numerical-aperture', 'single-mode-and-multimode-fibre', 'fibre-attenuation-and-windows', 'fibre-optic-light-guides', 'gradient-index-optics', 'evanescent-waves-and-frustrated-tir', 'physics:total-internal-reflection'],
  body: `
A fibre-optic cable is a glass thread no thicker than a hair that carries light for tens of kilometres, round corners, with less loss than a window pane shows over a few centimetres. It does so with one idea, [[critical-angle-and-total-internal-reflection|total internal reflection]], built into a cylinder.

### Core, cladding, coating
An optical fibre has three concentric layers:

| Layer | Single-mode fibre | Multimode fibre | Job |
|---|---|---|---|
| **Core** | about 9 µm across | 50 or 62.5 µm | carries the light; slightly higher refractive index |
| **Cladding** | 125 µm | 125 µm | slightly lower index; keeps the light in the core |
| **Coating** | 250 µm | 250 µm | soft acrylate polymer; protects the glass, guides nothing |

Core and cladding are both silica glass. The core is *doped*, usually with germanium oxide, to raise its [[refractive-index|index]] a little. At 1550 nm a typical telecom fibre has pure-silica cladding, $n_2 = 1.444$, and a core of $n_1 \\approx 1.449$: a step of 0.35 %. A multimode fibre has a larger step, about 1 to 2 %.

### Why the light stays in
A ray travelling along the core meets the core–cladding boundary at a very shallow angle to the surface, because it runs almost parallel to the fibre. Going from the higher index to the lower, a ray whose angle from the normal exceeds the critical angle is reflected completely:

$$\\sin\\theta_c = \\frac{n_2}{n_1}$$

For the numbers above $\\theta_c = 85.2°$. Equivalently, every ray within $\\psi_{\\max} = 4.8°$ of the axis, where $\\cos\\psi_{\\max} = n_2/n_1$, is trapped. It zigzags down the core, and each reflection is perfect: total internal reflection returns all of the light. In a 50 µm core a ray at 5° to the axis reflects roughly every 0.6 mm, so a kilometre of fibre means about 1.7 million reflections, with no loss at any of them. The loss of a fibre, 0.2 dB/km at best, comes from the glass itself ([[fibre-attenuation-and-windows]]).

### Why a cladding at all
Bare glass in air would guide even better, since the index step is huge. But every fingerprint, scratch, speck of dust or neighbouring fibre touching it would spoil the boundary and let the light out. The cladding moves the guiding boundary inside the glass, where it stays clean for decades, and its larger diameter makes the fibre easy to handle, cleave and hold in a [[fibre-connectors-and-ferrules|ferrule]].

### Rays are only a model
The zigzag picture works when the core is many wavelengths wide, as in multimode fibre. A 9 µm core carrying 1.55 µm light is only a few wavelengths across, and the light is better described as a wave with a fixed transverse pattern, a *mode* ([[single-mode-and-multimode-fibre]]). The pattern is not confined sharply to the core: a fifth or more of the power travels in the cladding as an *evanescent* tail ([[evanescent-waves-and-frustrated-tir]]).

### How fast the light travels
Light in the core travels at $c/n$, about $2.07 \\times 10^8$ m/s. A pulse is delayed by roughly **4.9 µs per kilometre** (using the group index, 1.468 for standard fibre at 1550 nm), so a 100 km link adds 0.49 ms of delay, the main part of the lag in a long-distance call.

> [!key] A fibre guides light by total internal reflection at the boundary between a core of higher index and a cladding of lower index. Rays within an angle $\\psi_{\\max}$ of the axis, $\\cos\\psi_{\\max} = n_2/n_1$, are trapped, and the cladding keeps that boundary clean inside the glass.
`,
  ideas: [
    'A fibre has a core of index n₁ inside a cladding of slightly lower index n₂; the coating only protects.',
    'Rays whose angle to the normal at the boundary exceeds the critical angle, sin θc = n₂/n₁, are totally reflected.',
    'Inside a fibre the guided rays lie within ψ_max of the axis, cos ψ_max = n₂/n₁: a few degrees.',
    'Total internal reflection is lossless; the loss of a fibre is absorption and scattering in the glass.',
    'The ray zigzag is a model for wide cores; in narrow cores light travels as a wave pattern, a mode.'
  ],
  pitfalls: [
    'The core is coated with a mirror — Nothing reflective is deposited: the light is reflected by total internal reflection at the boundary with cladding glass of lower index, which is lossless and needs no metal.',
    'Light only travels in the core — A guided mode always has a tail in the cladding; in a single-mode fibre a fifth or more of the power is carried there, which is why the cladding must be pure and thick (125 µm).',
    'The plastic coating guides the light — The 250 µm coating is a protective jacket. It has a higher index than the cladding, so light that strays into the cladding is stripped off into it rather than guided.',
    'Any bend of a fibre loses the light — Total internal reflection survives gentle bends; loss grows sharply only when the bend radius falls to a few centimetres for ordinary fibre ([[fibre-attenuation-and-windows]]).'
  ],
  terms: [
    { term: 'Optical fibre', also: ['optical fiber', 'fibre', 'glass fibre'], def: 'A thin flexible strand of glass or plastic made of a core and a cladding, which guides light along its length by total internal reflection.' },
    { term: 'Core', def: 'The central part of an optical fibre, of higher refractive index, in which most of the light travels. About 9 µm across in single-mode fibre, 50 or 62.5 µm in multimode fibre.' },
    { term: 'Cladding', def: 'The layer of lower refractive index around the core, 125 µm in diameter in telecom fibre. It keeps the light in the core and carries the evanescent tail of the guided wave.' },
    { term: 'Coating', also: ['primary coating', 'buffer', 'acrylate'], def: 'The soft polymer layer, usually 250 µm across, applied over the cladding to protect the glass from scratches and moisture. It does not guide light.' },
    { term: 'Step-index fibre', def: 'A fibre whose refractive index is uniform in the core and drops abruptly to the lower value of the cladding.' },
    { term: 'Index difference', also: ['relative index difference', 'Δ'], def: 'The fractional step between core and cladding, Δ = (n₁ − n₂)/n₁. About 0.35 % in single-mode fibre, 1 to 2 % in multimode fibre.' }
  ],
  formulas: [
    {
      name: 'Critical angle at the core–cladding boundary',
      expr: 'sin(tc) = n2/n1', tex: '\\sin\\theta_c = \\frac{n_2}{n_1}',
      vars: {
        tc: { name: 'critical angle (from the normal)', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\theta_c' },
        n1: { name: 'core index', value: 1.449, min: 1, max: 2 },
        n2: { name: 'cladding index', value: 1.444, min: 1, max: 2 }
      },
      note: 'Rays meeting the boundary at more than this angle from the normal are trapped.',
      stories: { tc: 'A fibre has a core of index {n1} and a cladding of index {n2}. At what angle from the normal does total internal reflection begin at the boundary?' }
    },
    {
      name: 'Steepest guided ray',
      expr: 'cos(psi) = n2/n1', tex: '\\cos\\psi_{\\max} = \\frac{n_2}{n_1}',
      vars: {
        psi: { name: 'largest angle to the fibre axis', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\psi_{\\max}' },
        n1: { name: 'core index', value: 1.48, min: 1, max: 2 },
        n2: { name: 'cladding index', value: 1.46, min: 1, max: 2 }
      },
      note: 'Inside the core, measured from the axis. The complement of the critical angle.',
      stories: { psi: 'A multimode fibre has n₁ = {n1} and n₂ = {n2}. What is the steepest angle to the axis at which a ray stays trapped?' }
    },
    {
      name: 'Distance between reflections',
      expr: 's = 2*a/tan(psi)', tex: 's = \\frac{2a}{\\tan\\psi}',
      vars: {
        s: { name: 'distance along the fibre between reflections', q: 'length', unit: 'mm' },
        a: { name: 'core radius', q: 'length', unit: 'µm', value: 25 },
        psi: { name: 'angle of the ray to the axis', q: 'angle', unit: '°', value: 5, min: 0.1, max: 45, tex: '\\psi' }
      },
      note: 'A ray crosses the core diameter 2a between reflections; the steeper the ray, the more often it reflects.',
      stories: { s: 'A ray travels at {psi} to the axis of a fibre whose core has a radius of {a}. How far along the fibre does it go between reflections?' }
    },
    {
      name: 'Delay of light in a fibre',
      expr: 't = n*L/c', tex: 't = \\frac{n\\,L}{c}',
      vars: {
        t: { name: 'travel time', q: 'time', unit: 'µs' },
        n: { name: 'group index', value: 1.468, min: 1, max: 2 },
        L: { name: 'length of fibre', q: 'length', unit: 'km', value: 1 },
        c: { const: 'c' }
      },
      note: 'About 5 µs per kilometre. A pulse is delayed by the group index of the glass, which exceeds the phase index a little.',
      stories: { t: 'How long does a pulse take to cross {L} of fibre of group index {n}?', L: 'A signal takes {t} to cross a fibre of group index {n}. How long is the fibre?' }
    }
  ],
  examples: [
    {
      title: 'Which rays are trapped?',
      q: 'A fibre has a germanium-doped core of index 1.449 in a cladding of index 1.444. What is the critical angle at the boundary, and within what angle of the axis must a ray lie inside the core to be guided?',
      steps: [
        { text: 'The critical angle:', tex: '\\theta_c = \\arcsin\\frac{1.444}{1.449} = \\arcsin 0.99655 = 85.2°' },
        { text: 'A ray at angle $\\psi$ to the axis meets the boundary at $90° - \\psi$ from the normal, so it is trapped when $90° - \\psi \\ge 85.2°$:', tex: '\\psi_{\\max} = 90° - 85.2° = 4.8°' }
      ],
      a: '85.2° from the normal; ψ ≤ 4.8° to the axis. Only rays almost parallel to the fibre are guided.'
    },
    {
      title: 'The lag of a long cable',
      q: 'A submarine cable is 6 000 km long and its fibre has a group index of 1.468. How long does a pulse take to cross it?',
      steps: [
        { text: 'The speed in the glass is $c/n = 2.04 \\times 10^8$ m/s. The time is', tex: 't = \\frac{nL}{c} = \\frac{1.468 \\times 6.0\\times10^{6}\\ \\mathrm{m}}{2.998\\times10^{8}\\ \\mathrm{m/s}} = 29.4\\ \\mathrm{ms}' },
        'A signal there and back (a spoken exchange across the ocean) therefore lags by about 59 ms, plus the delay in the electronics and any repeaters.'
      ],
      a: 'About 29 ms one way, which is 4.9 µs for every kilometre.'
    }
  ],
  quiz: [
    { q: 'In a step-index fibre, how do the refractive indices of core and cladding compare?', choices: ['The core has the higher index', 'The core has the lower index', 'They are equal and the light is guided by the coating', 'The core is air and the cladding is glass'], a: 0, why: 'Total internal reflection needs the light to be in the denser medium. The core is doped to raise its index a fraction of a per cent above the cladding\'s.' },
    { q: 'A fibre guides light because a thin layer of reflective metal is deposited on the core.', a: false, why: 'No metal is involved. Total internal reflection at the boundary with the lower-index cladding returns all of the light with no loss.' },
    { q: 'A fibre has n₁ = 1.449 and n₂ = 1.444. Which of these rays, measured against the fibre axis inside the core, is guided?', choices: ['A ray at 3°', 'A ray at 6°', 'A ray at 15°', 'A ray at 45°'], a: 0, why: 'The largest guided angle is $\\arccos(1.444/1.449) = 4.8°$. The steeper rays meet the boundary below the critical angle and leak into the cladding.' },
    { q: 'How long does light take to travel along 2 km of fibre of group index 1.468? Give the time in microseconds.', answer: 9.79, unit: 'µs', why: '$t = nL/c = 1.468 \\times 2000/(2.998\\times10^8) = 9.8$ µs, about 4.9 µs per kilometre.' },
    { q: 'Why is a plastic coating put on the glass, when the cladding already guides the light?', choices: ['To protect the glass from scratches and moisture', 'To make the core brighter', 'To raise the numerical aperture', 'To reflect light that leaks from the core'], a: 0, why: 'The coating is mechanical protection. A scratch on bare glass grows into a crack that breaks the fibre; the coating also keeps the cladding free of contact that would disturb the evanescent tail.' }
  ],
  applications: [
    'Telecommunications: every long-distance and undersea data cable, and the connection into most homes and offices, carries light along single-mode fibre.',
    'Endoscopes and light guides: bundles of fibres carry light into the body, or into the field of a microscope, and bring images back.',
    'Sensors: the fibre itself can be the instrument, measuring strain, temperature or rotation along its length.',
    'Fibre lasers and power delivery: a doped fibre amplifies light, and a large-core fibre carries kilowatts to a cutting head.',
    'Short links inside buildings, cars and aircraft, and the decorative strands of lamps, are the same structure in plastic.'
  ],
  history: 'The guiding of light by total internal reflection was shown in a jet of water by Daniel Colladon in Geneva in 1841 and by John Tyndall in London in 1854. Glass fibres with a cladding, which made guiding practical, came in the 1950s; the fibre gastroscope of Basil Hirschowitz followed in 1957. In 1966 Charles Kao and George Hockham argued that glass with a loss below 20 dB/km would carry telephone traffic; in 1970 a team at Corning made such a fibre, and Kao shared the 2009 Nobel Prize in Physics for the idea.',
  sources: [
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, ch. 9 (Guided-Wave Optics) — the step-index fibre, rays and modes.',
    'G. P. Agrawal, *Fiber-Optic Communication Systems*, ch. 2 (Optical Fibers) — structure, guiding and the numbers of telecom fibre.',
    'ITU-T Recommendation G.652, *Characteristics of a single-mode optical fibre and cable* — the dimensions and index profile of standard fibre.'
  ],
  sim: 'fo-guide'
},

/* ================================================================ 2 */
{
  id: 'fibre-numerical-aperture', parent: 'fibre-optics', title: 'The numerical aperture of a fibre', level: 1,
  short: 'Light enters a fibre only if it arrives inside a cone, the acceptance cone. Its half-angle is set by the two refractive indices alone: the numerical aperture NA = √(n₁² − n₂²) is the sine of that angle in air. A larger NA gathers more light but spreads it into more modes.',
  keywords: ['numerical aperture', 'NA', 'acceptance angle', 'acceptance cone', 'fibre NA', 'light gathering', 'launch', 'far field', 'overfilled', 'underfilled', 'index difference', 'sqrt(n1^2 - n2^2)'],
  prereq: ['how-an-optical-fibre-guides-light', 'numerical-aperture', 'snells-law'],
  related: ['coupling-light-into-fibre', 'single-mode-and-multimode-fibre', 'fibre-optic-light-guides', 'the-f-number', 'etendue', 'the-optical-invariant'],
  body: `
Light cannot enter a fibre from just any direction. Rays that arrive inside a certain cone, the **acceptance cone**, are guided. Rays outside it refract into the glass at too steep an angle, meet the core–cladding boundary below the critical angle and leak out into the cladding. The size of the cone is the **numerical aperture**.

### Deriving the cone
A ray in air ($n_0 = 1$) meets the flat end face at an angle $\\theta$ to the axis and refracts to an angle $\\psi$ inside the core: $n_0 \\sin\\theta = n_1 \\sin\\psi$. It is guided when $\\psi \\le \\psi_{\\max}$ with $\\cos\\psi_{\\max} = n_2/n_1$ ([[how-an-optical-fibre-guides-light]]). Putting the two together:

$$\\mathrm{NA} = n_0 \\sin\\theta_{\\max} = n_1 \\sin\\psi_{\\max} = \\sqrt{n_1^2 - n_2^2}$$

Only the two indices matter, not the diameter, not the length. For weakly guiding fibres, where $n_1 \\approx n_2$, it is often written $\\mathrm{NA} \\approx n_1\\sqrt{2\\Delta}$ with $\\Delta = (n_1 - n_2)/n_1$. A fibre of $n_1 = 1.449$ and $\\Delta = 0.35\\ \\%$ has $\\mathrm{NA} = 0.12$. This is the fibre version of the [[numerical-aperture|numerical aperture]] of a lens: the sine of the half-angle of a cone of light, times the index.

### Typical numbers
| Fibre | NA | Half-angle in air | Same as a lens of about |
|---|---|---|---|
| Single-mode, telecom | 0.12–0.14 | 7–8° | f/4 |
| Multimode 50/125 | 0.20 | 11.5° | f/2.5 |
| Large-core silica, step index | 0.22 | 12.7° | f/2.3 |
| Multimode 62.5/125 | 0.275 | 16° | f/1.8 |
| Plastic fibre (PMMA core) | 0.50 | 30° | f/1 |
| Glass light-guide bundle | 0.55 | 33° | f/0.9 |

The last column uses $N \\approx 1/(2\\,\\mathrm{NA})$ ([[the-f-number]]). A lens that focuses light into a fibre should be no faster than this, or the extra rays are wasted.

### What the NA tells you
- **Light collected.** A small, uniformly bright source touching the end face, such as an LED chip, puts a fraction $\\mathrm{NA}^2$ of its light into the guided cone: 4 % at NA 0.2, 25 % at NA 0.5. Light collection grows with NA squared and with core area, which is why plastic fibre and light-guide bundles are made with a large NA.
- **Light leaving.** A fibre filled with light from a wide source sends it out into the same cone. A fibre of NA 0.22 lights a spot 22.6 mm wide on a screen 50 mm away, like a small flood lamp.
- **Underfilled launch.** A laser focused into a multimode fibre excites only the low-order modes, so the emerging cone is narrower than the NA. The NA of a fibre is therefore measured from the far-field pattern of a fully filled fibre, at the angle where the intensity falls to 5 % of its peak.

### Where the ray picture needs care
In a [[single-mode-and-multimode-fibre|graded-index fibre]] the index falls from the axis outwards, so the local NA, $\\sqrt{n(r)^2 - n_2^2}$, is largest at the centre and zero at the edge of the core: the fibre accepts a wide cone at the centre and almost none at the rim. In a single-mode fibre the rays are only a manner of speaking, but the NA still fixes the beam: standard fibre at 1550 nm emits a cone about 5–6° in half-angle. And in a long fibre the steepest rays are lost first, at bends and defects, so the usable cone shrinks until the modes settle into a steady mix.

> [!key] $\\mathrm{NA} = \\sqrt{n_1^2 - n_2^2}$ is the sine of the half-angle of the cone of light a fibre accepts from air. It depends on the indices only; a lens that feeds the fibre must be no faster than $f/(2\\,\\mathrm{NA})$.
`,
  ideas: [
    'A fibre accepts light inside a cone whose half-angle in air is θ_max = arcsin(NA).',
    'NA = √(n₁² − n₂²) depends on the two indices only, not on the diameter or the length.',
    'A lens feeding a fibre should be no faster than about f/(2·NA), otherwise the extra rays are lost.',
    'A small Lambertian source couples a fraction NA² of its light; large NA gathers more but supports more modes.',
    'The NA is measured from the far-field pattern, at the 5 % intensity points of a fully filled fibre.'
  ],
  pitfalls: [
    'A thicker core gives a bigger NA — The NA follows from the refractive indices only. A thicker core of the same glass accepts the same angles, but collects more light because its area is larger.',
    'All light inside the acceptance cone is guided without loss — The cone only says which rays meet the total-reflection condition. Surface roughness, bends and the loss of the glass still apply, and the steepest rays are lost first.',
    'The NA of a fibre and of a lens are different things — They are the same quantity: the index times the sine of the half-angle of a cone of light. That is why a fibre of NA 0.22 matches a lens of about f/2.3.',
    'A single-mode fibre, having no rays, has no NA — Its NA still sets the V number and the divergence of the beam that leaves it, about 5 to 6° half-angle at 1550 nm.'
  ],
  terms: [
    { term: 'Numerical aperture (fibre)', also: ['NA', 'fibre NA'], def: 'The sine of the half-angle of the cone of light that a fibre accepts from air, NA = √(n₁² − n₂²). A property of the two indices.' },
    { term: 'Acceptance angle', also: ['acceptance half-angle', 'θ_max'], def: 'The largest angle from the fibre axis, in air, at which a ray entering the end face is still guided: θ_max = arcsin(NA).' },
    { term: 'Acceptance cone', def: 'The cone of directions, of half-angle θ_max, inside which light launched into the end face of a fibre is guided.' },
    { term: 'Overfilled launch', also: ['underfilled launch', 'launch conditions'], def: 'A launch that fills the whole core and the whole acceptance cone (overfilled), against one, such as a laser, that excites only the central part and the low-order modes (underfilled).' },
    { term: 'Local numerical aperture', also: ['NA(r)'], def: 'In a graded-index fibre, √(n(r)² − n₂²) at a distance r from the axis: largest at the centre and falling to zero at the edge of the core.' }
  ],
  formulas: [
    {
      name: 'Numerical aperture of a fibre',
      expr: 'NA = sqrt(n1^2 - n2^2)', tex: '\\mathrm{NA} = \\sqrt{n_1^2 - n_2^2}',
      vars: {
        NA: { name: 'numerical aperture', tex: '\\mathrm{NA}' },
        n1: { name: 'core index', value: 1.48, min: 1, max: 2 },
        n2: { name: 'cladding index', value: 1.46, min: 1, max: 2 }
      },
      note: 'Valid for a step-index fibre; n₂ must be smaller than n₁.',
      stories: { NA: 'A fibre has a core of index {n1} and a cladding of index {n2}. What is its numerical aperture?', n2: 'A step-index fibre of core index {n1} is to have a numerical aperture of {NA}. What cladding index does it need?' }
    },
    {
      name: 'Acceptance angle in air',
      expr: 'sin(ta) = NA/n0', tex: '\\sin\\theta_{a} = \\frac{\\mathrm{NA}}{n_0}',
      vars: {
        ta: { name: 'acceptance half-angle', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\theta_{a}' },
        NA: { name: 'numerical aperture', value: 0.22, min: 0, max: 1, tex: '\\mathrm{NA}' },
        n0: { name: 'index of the medium in front of the fibre (1 for air)', value: 1, min: 1, max: 2 }
      },
      note: 'In water or immersion oil the cone is narrower in the medium but the NA is the same.',
      stories: { ta: 'A fibre of numerical aperture {NA} faces air. What is the half-angle of the cone of light it accepts?', NA: 'A fibre accepts light up to {ta} from its axis in air. What is its numerical aperture?' }
    },
    {
      name: 'Weak-guidance form',
      expr: 'NA = n1*sqrt(2*Delta)', tex: '\\mathrm{NA} \\approx n_1\\sqrt{2\\Delta}',
      vars: {
        NA: { name: 'numerical aperture', tex: '\\mathrm{NA}' },
        n1: { name: 'core index', value: 1.449, min: 1, max: 2 },
        Delta: { name: 'relative index difference (n₁ − n₂)/n₁', value: 0.0035, min: 0, max: 0.1, tex: '\\Delta' }
      },
      note: 'Good when n₁ and n₂ differ by a few per cent at most.',
      stories: { NA: 'A telecom fibre has a core index of {n1} and a relative index difference of {Delta}. What is its numerical aperture?' }
    },
    {
      name: 'Spot size on a screen',
      expr: 'd = 2*L*tan(ta)', tex: 'd = 2L\\tan\\theta_{a}',
      vars: {
        d: { name: 'diameter of the lit spot', q: 'length', unit: 'mm' },
        L: { name: 'distance from the fibre end to the screen', q: 'length', unit: 'mm', value: 50 },
        ta: { name: 'half-angle of the emitted cone', q: 'angle', unit: '°', value: 12.7, min: 0, max: 80, tex: '\\theta_{a}' }
      },
      note: 'A fully filled fibre emits into its acceptance cone; an underfilled one emits into a narrower cone.',
      stories: { d: 'A fully filled fibre emits into a cone of half-angle {ta}. How wide is the spot it makes on a screen {L} away?' }
    },
    {
      name: 'Light taken from a small Lambertian source',
      expr: 'eta = NA^2/n0^2', tex: '\\eta = \\frac{\\mathrm{NA}^2}{n_0^2}',
      vars: {
        eta: { name: 'fraction of the light accepted', q: 'ratio', unit: '%', tex: '\\eta' },
        NA: { name: 'numerical aperture', value: 0.2, min: 0, max: 1, tex: '\\mathrm{NA}' },
        n0: { name: 'index of the medium between source and fibre', value: 1, min: 1, max: 2 }
      },
      note: 'For a source no larger than the core, touching or imaged on the end face, whose radiance does not depend on direction.',
      stories: { eta: 'An LED chip smaller than the core of a fibre of NA {NA} touches its end face. What fraction of the emitted light is accepted?' }
    }
  ],
  examples: [
    {
      title: 'The cone of a glass fibre',
      q: 'A multimode fibre has a core of index 1.480 and a cladding of index 1.460. Find its numerical aperture, the acceptance half-angle in air and the f-number of a lens with the same cone.',
      steps: [
        { text: 'The numerical aperture:', tex: '\\mathrm{NA} = \\sqrt{1.480^2 - 1.460^2} = \\sqrt{0.0592} = 0.243' },
        { text: 'The half-angle in air:', tex: '\\theta_{a} = \\arcsin 0.243 = 14.0°' },
        { text: 'A lens whose marginal ray makes that angle has', tex: 'N \\approx \\frac{1}{2\\,\\mathrm{NA}} = 2.1' }
      ],
      a: 'NA 0.24, a half-angle of 14° (a 28° cone), equivalent to f/2.1.'
    },
    {
      title: 'An LED into two fibres',
      q: 'The same small LED, emitting like a Lambertian source, is placed against the end of a plastic fibre (NA 0.50) and against the end of a single-mode fibre (NA 0.13). What fraction of its light enters the guided cone in each case, ignoring the size of the cores?',
      steps: [
        { text: 'For a Lambertian source the accepted fraction is $\\mathrm{NA}^2$:', tex: '0.50^2 = 25\\ \\%\\qquad 0.13^2 = 1.7\\ \\%' },
        'The single-mode fibre accepts a seventeenth of the cone already, and its 9 µm core is much smaller than the LED chip, so less than that actually enters.'
      ],
      a: '25 % into the plastic fibre against under 2 % into the single-mode fibre. This is why LEDs go with large-core fibres and lasers with single-mode ones.'
    }
  ],
  quiz: [
    { q: 'Which quantities set the numerical aperture of a step-index fibre?', choices: ['The refractive indices of core and cladding', 'The core diameter and the fibre length', 'The wavelength and the core diameter', 'The coating material'], a: 0, why: '$\\mathrm{NA} = \\sqrt{n_1^2 - n_2^2}$. Diameter and wavelength decide how many modes fit, not the angle of the cone.' },
    { q: 'If the core diameter of a fibre is doubled while the glasses stay the same, the numerical aperture doubles.', a: false, why: 'The NA depends on the indices only. The larger core collects four times the light from a large uniform source, but accepts the same cone of angles.' },
    { q: 'A fibre of NA 0.22 is held 100 mm from a screen and filled with light from a wide source. About how wide is the spot, in millimetres?', answer: 45.1, unit: 'mm', why: 'The half-angle is $\\arcsin 0.22 = 12.7°$, so $d = 2 \\times 100 \\times \\tan 12.7° = 45$ mm.' },
    { q: 'A small LED touches the end of a fibre of NA 0.2. About what fraction of its (Lambertian) light is guided?', choices: ['1 %', '4 %', '20 %', '40 %'], a: 1, why: 'The fraction is $\\mathrm{NA}^2 = 0.04$. NA is the sine of the angle, and the light inside the cone grows as the sine squared.' },
    { q: 'The same wide source is placed at the end of a fibre of NA 0.12 and of one with NA 0.5, both with the same core size. Which accepts more light, and by roughly what factor?', choices: ['NA 0.5, by about 17 times', 'NA 0.5, by about 4 times', 'NA 0.12, by about 4 times', 'They accept the same light'], a: 0, why: 'The accepted light goes as $\\mathrm{NA}^2$: $(0.5/0.12)^2 = 17$.' }
  ],
  applications: [
    'Choosing a lens or a collimator to couple an LED or laser into a given fibre: its f-number must not be faster than 1/(2 NA).',
    'Light guides and plastic fibres with NA 0.5 or more, which collect light from lamps and LEDs and deliver it to a ring light or an instrument.',
    'Reading a fibre datasheet: the NA, its tolerance and how it is measured tell how the fibre will behave with a given source.',
    'Fibre spectrometers, whose entrance fibre NA must match the spectrograph optics so that the grating is filled but not overfilled.',
    'Telecentric and machine-vision lighting, where the angular spread of the light leaving a fibre ring or line light is the NA of the fibre.'
  ],
  history: 'The idea of a "numerical aperture" comes from the microscope: Ernst Abbe defined it in the 1870s as the index times the sine of the half-angle of the cone of light a lens accepts. When fibres with claddings arrived in the 1950s, the same quantity described the cone a fibre accepts, and the name was kept.',
  sources: [
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, ch. 9 — acceptance angle and numerical aperture of the step-index fibre.',
    'G. Keiser, *Optical Fiber Communications*, the chapter on optical fibre structures and guiding — acceptance angle and the weak-guidance approximation.',
    'IEC 60793-1-43, *Optical fibres — Measurement methods and test procedures — Numerical aperture* — how the NA of a fibre is measured from its far field.'
  ],
  sim: 'fo-na'
},

/* ================================================================ 3 */
{
  id: 'single-mode-and-multimode-fibre', parent: 'fibre-optics', title: 'Single-mode and multimode fibre', level: 2,
  short: 'A fibre carries light as a set of allowed patterns, its modes. A multimode fibre (50 or 62.5 µm core) carries hundreds; a single-mode fibre (about 9 µm core) carries one. The V number, 2πa·NA/λ, tells how many: below 2.405 only the fundamental mode is guided.',
  keywords: ['single-mode', 'multimode', 'modes', 'V number', 'normalized frequency', 'cut-off wavelength', 'mode-field diameter', 'MFD', '9/125', '50/125', '62.5/125', 'graded-index', 'step-index', 'OM1', 'OM3', 'OM4', 'OS2', 'GRIN', 'SMF', 'MMF'],
  prereq: ['how-an-optical-fibre-guides-light', 'fibre-numerical-aperture', 'light-as-a-wave'],
  related: ['fibre-dispersion-and-bandwidth', 'coupling-light-into-fibre', 'fibre-connectors-and-ferrules', 'fibre-optic-links', 'higher-order-modes', 'laser-modes', 'gradient-index-optics'],
  body: `
Inside a fibre the light is a wave in a waveguide, and a waveguide allows only certain patterns of the field across its section to travel without changing: its **modes**. Whether a fibre is "single-mode" or "multimode" is the question of how many modes fit.

### The V number
One dimensionless number decides it, the **normalized frequency**:

$$V = \\frac{2\\pi a\\,\\mathrm{NA}}{\\lambda}$$

with core radius $a$, numerical aperture NA and wavelength $\\lambda$. The wider the core, the higher the NA and the shorter the wavelength, the larger $V$ and the more modes fit. A step-index fibre guides **only the fundamental mode** when $V < 2.405$, the first zero of a Bessel function. For large $V$ the number of modes is about $V^2/2$ for a step-index core and $V^2/4$ for a graded-index core.

| Fibre | Core | NA | λ | V | Modes |
|---|---|---|---|---|---|
| Single-mode (illustrative) | 8.2 µm | 0.12 | 1550 nm | 2.0 | 1 |
| the same | | | 1310 nm | 2.4 | 1 |
| the same | | | 850 nm | 3.6 | a few |
| Graded 50/125 | 50 µm | 0.20 | 1300 nm | 24 | about 150 |
| Graded 50/125 | 50 µm | 0.20 | 850 nm | 37 | about 340 |
| Graded 62.5/125 | 62.5 µm | 0.275 | 850 nm | 64 | about 1000 |

### The cut-off wavelength
Solving $V = 2.405$ for the wavelength gives the **cut-off wavelength** $\\lambda_c = 2\\pi a\\,\\mathrm{NA}/2.405$. Above it only one mode is guided; below it the second mode appears. The fibre above has $\\lambda_c = 1285$ nm: single-mode at 1310 and 1550 nm, a few-mode fibre at 850 nm. Telecom fibre is specified with a cable cut-off of 1260 nm or less.

### The mode-field diameter
The fundamental mode is not a sharp disc the size of the core. Its intensity is close to a Gaussian, and its width is the **mode-field diameter** (MFD): where the intensity falls to $1/e^2$ of its peak. In standard fibre it is larger than the core, about 9.2 µm at 1310 nm and 10.4 µm at 1550 nm, and grows with wavelength. The MFD, not the core diameter, decides how well two fibres join ([[fibre-connectors-and-ferrules]]) and how well a lens couples to one ([[coupling-light-into-fibre]]).

### Step index and graded index
In a **step-index** multimode fibre rays of different angles travel paths of different length, so a short pulse spreads out ([[fibre-dispersion-and-bandwidth]]). In a **graded-index** fibre the core index falls smoothly from the axis, in a parabola. A steep ray goes into lower-index glass, where it travels faster, and curves back like a pendulum: its longer path is paid for by higher speed, and the rays arrive almost together. Almost all multimode fibre made today is graded.

### The grades in use
| Class | Core / cladding | Typical use | Jacket |
|---|---|---|---|
| OM1, OM2 | 62.5/125, 50/125 µm | older building networks | orange |
| OM3, OM4 | 50/125 µm, laser-optimized | data centres, 10 Gbit/s and more | aqua |
| OM5 | 50/125 µm, wideband | several wavelengths near 850–950 nm | lime green |
| OS2 | 9/125 µm | campus, telecom, long links | yellow |

Multimode fibre is easy to couple into with a cheap LED or VCSEL and forgives a micrometre or two in a connector. Single-mode fibre needs a laser and connectors good to a fraction of a micrometre, and spans hundreds of kilometres.

> [!key] $V = 2\\pi a\\,\\mathrm{NA}/\\lambda$ counts the modes: one if $V < 2.405$ (single-mode, above the cut-off wavelength), about $V^2/2$ or $V^2/4$ for a large step-index or graded core. It is single-mode only above its cut-off wavelength, and its mode is wider than its core.
`,
  ideas: [
    'A fibre guides a set of modes, allowed field patterns; the number is set by V = 2πa·NA/λ.',
    'Below V = 2.405 only the fundamental mode is guided: single-mode operation, above the cut-off wavelength.',
    'For large V the number of modes is about V²/2 (step index) or V²/4 (graded index).',
    'The mode-field diameter of single-mode fibre, about 9–10 µm, is larger than its core and grows with wavelength.',
    'Graded-index multimode fibre equalizes the travel times of its modes; single-mode fibre has only one.'
  ],
  pitfalls: [
    'Single-mode means the light travels as a single ray — A mode is a wave pattern, not a ray. The single mode of a fibre is a Gaussian-like field wider than the core, and it contains light travelling at every angle in the narrow cone it spans.',
    'The mode-field diameter equals the core diameter — It is larger, about 10.4 µm for a 9 µm core at 1550 nm, because the field extends into the cladding. Joining and coupling losses follow the MFD.',
    'A single-mode fibre is single-mode at any wavelength — Only above the cut-off wavelength. Light of 850 nm in fibre meant for 1310 and 1550 nm travels in several modes and no longer behaves as a clean single-mode signal.',
    'A bigger core means a better fibre — A bigger core is easier to couple into and carries more power, but its modes arrive at different times, which limits how fast and how far it can carry data.'
  ],
  terms: [
    { term: 'Mode', also: ['guided mode', 'LP mode'], def: 'A pattern of the light\'s field across a waveguide that keeps its shape as it travels. A fibre can carry one or many, depending on its size, NA and the wavelength.' },
    { term: 'Normalized frequency', also: ['V number', 'V parameter', 'V'], def: 'V = 2πa·NA/λ, a dimensionless number combining core radius, numerical aperture and wavelength. It sets the number of modes.' },
    { term: 'Cut-off wavelength', also: ['λc', 'cable cut-off'], def: 'The wavelength above which a fibre guides only its fundamental mode: λc = 2πa·NA/2.405. Telecom fibre is specified to 1260 nm or less.' },
    { term: 'Mode-field diameter', also: ['MFD', 'spot size'], def: 'The diameter at which the intensity of the fundamental mode falls to 1/e² of its peak. About 9.2 µm at 1310 nm and 10.4 µm at 1550 nm in standard single-mode fibre.' },
    { term: 'Single-mode fibre', also: ['SMF', 'OS1', 'OS2', '9/125'], def: 'A fibre with a core of about 9 µm that, above its cut-off wavelength, carries only the fundamental mode. Used for long distances and high bit rates.' },
    { term: 'Multimode fibre', also: ['MMF', 'OM1', 'OM2', 'OM3', 'OM4', 'OM5', '50/125', '62.5/125'], def: 'A fibre with a core of 50 or 62.5 µm that carries hundreds of modes. Easy to couple into; used for links of up to a few hundred metres.' },
    { term: 'Graded-index fibre', also: ['GRIN fibre', 'GI', 'parabolic profile'], def: 'A multimode fibre whose core index falls smoothly from the axis to the cladding, so that the different modes travel at nearly the same speed along the fibre.' }
  ],
  formulas: [
    {
      name: 'The V number',
      expr: 'V = 2*pi*a*NA/lambda', tex: 'V = \\frac{2\\pi a\\,\\mathrm{NA}}{\\lambda}',
      vars: {
        V: { name: 'normalized frequency' },
        a: { name: 'core radius', q: 'length', unit: 'µm', value: 25 },
        NA: { name: 'numerical aperture', value: 0.2, min: 0, max: 1, tex: '\\mathrm{NA}' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 850, tex: '\\lambda' }
      },
      note: 'V < 2.405: single-mode. Large V: many modes.',
      stories: { V: 'A fibre with a core radius of {a} and NA {NA} carries light of {lambda}. What is its V number?', lambda: 'A fibre of core radius {a} and NA {NA} has V = {V}. At what wavelength?' }
    },
    {
      name: 'Number of modes, step index',
      expr: 'M = V^2/2', tex: 'M \\approx \\frac{V^2}{2}',
      vars: {
        M: { name: 'number of modes', q: 'count' },
        V: { name: 'normalized frequency', value: 36, min: 5, max: 1000 }
      },
      note: 'For V well above 10; counts both polarizations and all degenerate patterns.',
      stories: { M: 'A large-core step-index fibre has V = {V}. About how many modes does it carry?' }
    },
    {
      name: 'Number of modes, graded index',
      expr: 'M = V^2/4', tex: 'M \\approx \\frac{V^2}{4}',
      vars: {
        M: { name: 'number of modes', q: 'count' },
        V: { name: 'normalized frequency', value: 37, min: 5, max: 1000 }
      },
      note: 'For a parabolic profile and V well above 10.',
      stories: { M: 'A graded-index fibre has V = {V}. About how many modes does it carry?' }
    },
    {
      name: 'Cut-off wavelength',
      expr: 'lambdac = 2*pi*a*NA/2.405', tex: '\\lambda_c = \\frac{2\\pi a\\,\\mathrm{NA}}{2.405}',
      vars: {
        lambdac: { name: 'cut-off wavelength', q: 'length', unit: 'nm', tex: '\\lambda_c' },
        a: { name: 'core radius', q: 'length', unit: 'µm', value: 4.1 },
        NA: { name: 'numerical aperture', value: 0.12, min: 0, max: 1, tex: '\\mathrm{NA}' }
      },
      note: 'The theoretical cut-off of a step-index fibre. The specified cable cut-off of real fibre is somewhat lower.',
      stories: { lambdac: 'A single-mode fibre has a core radius of {a} and an NA of {NA}. Above what wavelength is it single-mode?' }
    },
    {
      name: 'Mode-field diameter (Marcuse)',
      expr: 'MFD = 2*a*(0.65 + 1.619*V^(-1.5) + 2.879*V^(-6))', tex: '\\mathrm{MFD} = 2a\\left(0.65 + 1.619\\,V^{-3/2} + 2.879\\,V^{-6}\\right)',
      vars: {
        MFD: { name: 'mode-field diameter', q: 'length', unit: 'µm', tex: '\\mathrm{MFD}' },
        a: { name: 'core radius', q: 'length', unit: 'µm', value: 4.1 },
        V: { name: 'normalized frequency', value: 2, min: 1.2, max: 2.4 }
      },
      note: 'An empirical fit to the Gaussian approximation, good for 1.2 < V < 2.4.',
      stories: { MFD: 'A single-mode fibre has a core radius of {a} and V = {V}. What is its mode-field diameter?' }
    }
  ],
  examples: [
    {
      title: 'How many modes does a 50 µm fibre carry?',
      q: 'A graded-index fibre has a 50 µm core and NA 0.20. Find V and the approximate number of modes at 850 nm and at 1300 nm.',
      steps: [
        { text: 'At 850 nm, with $a = 25$ µm:', tex: 'V = \\frac{2\\pi \\times 25\\ \\mu\\mathrm{m} \\times 0.20}{0.850\\ \\mu\\mathrm{m}} = 37.0' },
        { text: 'For a graded index, $M \\approx V^2/4$:', tex: 'M \\approx \\frac{37.0^2}{4} \\approx 340' },
        'At 1300 nm the same fibre has $V = 24.2$ and about 146 modes: a longer wavelength supports fewer.'
      ],
      a: 'V = 37 and about 340 modes at 850 nm; V = 24 and about 150 modes at 1300 nm.'
    },
    {
      title: 'Is it single-mode at 1310 nm?',
      q: 'A fibre has a core radius of 4.1 µm and NA 0.12. Find its cut-off wavelength and say whether it is single-mode at 1310 nm and at 850 nm.',
      steps: [
        { text: 'The cut-off wavelength:', tex: '\\lambda_c = \\frac{2\\pi \\times 4.1\\ \\mu\\mathrm{m} \\times 0.12}{2.405} = 1.285\\ \\mu\\mathrm{m}' },
        '1310 nm is above 1285 nm: $V = 2.36 < 2.405$, single-mode, only just. 850 nm is below the cut-off: $V = 3.6$, so the second mode is guided as well.'
      ],
      a: 'λc = 1285 nm. Single-mode at 1310 nm and 1550 nm; not at 850 nm.'
    }
  ],
  quiz: [
    { q: 'A fibre has V = 1.9 at 1550 nm. How many modes does it guide?', choices: ['One', 'About 2', 'About 10', 'It depends on the length'], a: 0, why: 'V is below 2.405, so only the fundamental mode is guided (in two polarizations). Length makes no difference to the count.' },
    { q: 'The same fibre is used with light of 850 nm. What happens to V?', choices: ['It increases to about 3.5, so a second mode appears', 'It decreases', 'It stays the same', 'It becomes zero'], a: 0, why: '$V \\propto 1/\\lambda$: shorter wavelengths give a larger V. Going from 1550 to 850 nm multiplies V by 1.8.' },
    { q: 'The mode-field diameter of a single-mode fibre is the same as its core diameter.', a: false, why: 'It is larger: about 10.4 µm at 1550 nm for a core of 8–9 µm, because the guided field extends into the cladding.' },
    { q: 'A fibre has a core radius of 25 µm and NA 0.2, and carries light of 850 nm. What is its V number?', answer: 37, why: '$V = 2\\pi \\times 25 \\times 0.2/0.85 = 37$. With a graded index that is about $37^2/4 = 340$ modes.' },
    { q: 'Why is almost all multimode fibre made with a graded index?', choices: ['The different modes then arrive at nearly the same time, so pulses spread less', 'It makes the fibre cheaper', 'It makes it single-mode', 'It raises the numerical aperture'], a: 0, why: 'In a graded-index core, rays that take a longer path spend it in glass of lower index, where light travels faster. Their travel times are nearly equal, and the bandwidth is far greater than that of a step-index fibre.' }
  ],
  applications: [
    'Long-distance, metropolitan and access networks: single-mode fibre (OS2) with lasers at 1310 and 1550 nm.',
    'Data centres and building cabling: graded-index multimode fibre (OM3, OM4, OM5) with VCSELs at 850 nm, to a few hundred metres.',
    'Fibre lasers, amplifiers and sensors, where the clean, Gaussian-like single mode gives a beam of excellent quality.',
    'Spectrometers and medical lasers: large-core step-index multimode fibres that carry a lot of power and are easy to couple into.',
    'Short-wavelength single-mode fibres for visible lasers, with cores of 3 to 5 µm, in microscopy and interferometry.'
  ],
  sources: [
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, ch. 9 — modes of the step-index fibre, the V parameter and the single-mode condition.',
    'G. P. Agrawal, *Fiber-Optic Communication Systems*, ch. 2 — single-mode fibres, the mode-field diameter and the cut-off wavelength.',
    'ITU-T Recommendation G.652 (single-mode) and ISO/IEC 11801 (classes OM1 to OM5 of multimode fibre).',
    'D. Marcuse, "Loss analysis of single-mode fibre splices", *Bell System Technical Journal* 56 (1977) — the empirical fit for the mode-field radius.'
  ],
  sim: ['fo-modes', { id: 'fo-dispersion', params: { fibre: 'graded' } }]
},

/* ================================================================ 4 */
{
  id: 'fibre-attenuation-and-windows', parent: 'fibre-optics', title: 'Attenuation and the transmission windows', level: 2,
  short: 'Silica fibre loses light to scattering and absorption: about 0.2 dB/km at 1550 nm, 0.35 dB/km at 1310 nm, 2 to 3 dB/km at 850 nm. The minima define the three telecom windows. Rayleigh scattering falls as 1/λ⁴, infrared absorption takes over beyond 1600 nm, and a water peak sits at 1383 nm. Tight bends add loss.',
  keywords: ['attenuation', 'dB/km', 'loss', 'Rayleigh scattering', 'water peak', 'OH absorption', 'transmission window', '850 nm', '1310 nm', '1550 nm', 'O-band', 'C-band', 'L-band', 'bend loss', 'macrobend', 'microbend', 'bend-insensitive', 'G.657', 'decibel'],
  prereq: ['how-an-optical-fibre-guides-light', 'transmission-and-absorption', 'wavelength-frequency-and-colour'],
  related: ['fibre-dispersion-and-bandwidth', 'fibre-optic-links', 'fibre-connectors-and-ferrules', 'optical-glass', 'uv-and-infrared-materials', 'the-fibre-internet-link'],
  body: `
A fibre loses light very slowly, and that, more than anything else, made optical communication possible. In 1966 the target was 20 dB/km. The best fibre today loses about 0.2 dB/km at 1550 nm: half the power is left after 15 km, one per cent after 100 km.

### Loss in decibels
Losses multiply along a link, so they are quoted in decibels, which add. A fibre of attenuation $\\alpha$ (dB/km) and length $L$ (km) passes the fraction

$$\\frac{P_{\\mathrm{out}}}{P_{\\mathrm{in}}} = 10^{-\\alpha L/10}$$

3 dB is a half, 10 dB a tenth, 20 dB a hundredth. At 0.2 dB/km, 50 km costs 10 dB and 100 km costs 20 dB. Each kilometre takes the same *fraction* of what reaches it, 4.5 %, so the last kilometre removes far less power than the first.

### Where the loss comes from
- **Rayleigh scattering** is the unavoidable one: microscopic density fluctuations frozen into the glass scatter light with a loss proportional to $1/\\lambda^4$. About 0.12 dB/km at 1550 nm, 0.23 at 1310 nm, 1.3 at 850 nm.
- **Infrared absorption** by the vibrations of the silica lattice rises steeply beyond about 1600 nm.
- **Ultraviolet absorption** by electrons is a small tail at short wavelengths.
- **Water** (the OH ion) absorbs at 1383 nm, with weaker overtones at 1240 and 950 nm. Fibre made with "zero water peak" processes has almost no peak, and opens the whole 1260–1625 nm range.
- **Imperfections**: metal ions, microscopic bends and irregularities at the core boundary.

The curve of Rayleigh falling and infrared absorption rising has a minimum near 1550 nm. The simulation below draws it.

### The windows
| Window | Band | Typical loss | Used with |
|---|---|---|---|
| 850 nm | first window | 2–3 dB/km | multimode fibre, VCSELs, silicon detectors |
| 1310 nm | O-band, 1260–1360 nm | 0.33–0.4 dB/km | zero chromatic dispersion; short and medium links |
| 1550 nm | C-band, 1530–1565 nm | 0.19–0.25 dB/km | long links, erbium amplifiers |

The ITU names the bands O (1260–1360), E (1360–1460), S (1460–1530), C (1530–1565), L (1565–1625) and U (1625–1675 nm). Plastic fibre, with a loss near 150 dB/km, works in the visible, at 650 nm.

### Bend loss
A bend squeezes the guided wave against the outside of the core. Past a critical radius its outer edge would have to travel faster than light can in the cladding, and light radiates away. In the ray picture the steepest rays escape first, then gentler ones; at $R = a\\,n_2/(n_1 - n_2)$ even the axial ray leaves. Loss rises *exponentially* as the radius falls, and wavelength matters: a bend that passes 1310 nm can swallow 1625 nm. Ordinary single-mode fibre is kept to radii above about 30 mm; bend-insensitive fibres (ITU-T G.657) tolerate 5 to 10 mm. **Microbends**, tiny kinks where the fibre is pressed on a rough surface, cause loss too.

> [!key] Fibre loss is quoted in dB/km and adds along the link. Rayleigh scattering ($\\propto 1/\\lambda^4$) and infrared absorption leave a minimum of about 0.2 dB/km at 1550 nm, with windows at 850, 1310 and 1550 nm; bends add exponentially growing loss below a critical radius.
`,
  ideas: [
    'Attenuation is quoted in dB/km; the fraction left is 10^(−αL/10), and decibels add along a link.',
    'Rayleigh scattering falls as 1/λ⁴ and infrared absorption rises beyond 1600 nm: the minimum, near 0.2 dB/km, is at 1550 nm.',
    'The windows are 850 nm (multimode), 1310 nm (zero dispersion) and 1550 nm (lowest loss); the OH water peak lies at 1383 nm.',
    'Total internal reflection is lossless: the loss is in the glass, not at the boundary.',
    'Bend loss grows exponentially as the radius falls below a critical value and is worse at longer wavelengths.'
  ],
  pitfalls: [
    'A fibre loses a fixed amount of power per kilometre — It loses a fixed fraction: 0.2 dB/km removes 4.5 % of what arrives in each kilometre. The first 50 km take 90 % of the light; the second 50 km take 90 % of the rest.',
    'Light is lost at every reflection in the core — Total internal reflection returns all of the light. The loss comes from scattering and absorption along the glass.',
    'The longer the wavelength, the lower the loss — Only down to about 1550 nm. Beyond 1600 nm infrared absorption in the glass rises steeply.',
    'A bend only matters if it is sharp enough to kink the fibre — Bend loss starts long before any damage and grows exponentially: a loop of 10 mm radius in ordinary fibre can lose most of the light with no visible sign.'
  ],
  terms: [
    { term: 'Attenuation', also: ['fibre loss', 'attenuation coefficient', 'α'], def: 'The loss of optical power per unit length of fibre, in dB/km. A typical figure is 0.2 dB/km at 1550 nm in single-mode fibre.' },
    { term: 'Decibel', also: ['dB'], def: 'Ten times the base-10 logarithm of a power ratio. 3 dB is a factor 2, 10 dB a factor 10. Decibels add where ratios multiply.' },
    { term: 'Rayleigh scattering', def: 'Scattering of light by density fluctuations much smaller than the wavelength, with a loss proportional to 1/λ⁴. It sets the floor of fibre loss.' },
    { term: 'Water peak', also: ['OH peak', 'OH absorption'], def: 'The absorption peak at 1383 nm caused by hydroxyl ions in the glass. Low-water-peak fibre has almost none of it.' },
    { term: 'Transmission window', also: ['telecom window', 'O-band', 'E-band', 'S-band', 'C-band', 'L-band', 'U-band'], def: 'A range of wavelengths of low loss: 850, 1310 and 1550 nm. The ITU bands are O 1260–1360, E 1360–1460, S 1460–1530, C 1530–1565, L 1565–1625 and U 1625–1675 nm.' },
    { term: 'Bend loss', also: ['macrobend loss', 'microbend loss', 'bend-insensitive fibre', 'G.657'], def: 'Light radiated away at a bend. Macrobend loss comes from curves of centimetre radius, microbend loss from tiny kinks. Bend-insensitive fibre (G.657) is designed to tolerate small radii.' }
  ],
  formulas: [
    {
      name: 'Loss over a length of fibre',
      expr: 'A = alpha*L', tex: 'A = \\alpha\\,L',
      vars: {
        A: { name: 'total loss', q: 'gain', unit: 'dB' },
        alpha: { name: 'attenuation', q: 'attenuation', unit: 'dB/km', value: 0.2, tex: '\\alpha' },
        L: { name: 'length of fibre', q: 'length', unit: 'km', value: 50 }
      },
      note: 'Decibels add: the loss of a link is the sum of the losses of its parts.',
      stories: { A: 'A fibre with a loss of {alpha} is {L} long. What is its total loss?', L: 'How long a fibre of {alpha} gives a total loss of {A}?' }
    },
    {
      name: 'Power remaining',
      expr: 'Pout = Pin*10^(-alpha*L/10)', tex: 'P_{\\mathrm{out}} = P_{\\mathrm{in}}\\,10^{-\\alpha L/10}',
      vars: {
        Pout: { name: 'output power', q: 'power', unit: 'mW', tex: 'P_{\\mathrm{out}}' },
        Pin: { name: 'input power', q: 'power', unit: 'mW', value: 1, tex: 'P_{\\mathrm{in}}' },
        alpha: { name: 'attenuation', q: 'attenuation', unit: 'dB/km', value: 0.35, tex: '\\alpha' },
        L: { name: 'length of fibre', q: 'length', unit: 'km', value: 25 }
      },
      note: '0.35 dB/km is typical of 1310 nm; 0.2 dB/km of 1550 nm.',
      stories: { Pout: 'A laser couples {Pin} into {L} of fibre with a loss of {alpha}. How much power reaches the end?' }
    },
    {
      name: 'Rayleigh loss at another wavelength',
      expr: 'a2 = a1*(l1/l2)^4', tex: '\\alpha_2 = \\alpha_1\\left(\\frac{\\lambda_1}{\\lambda_2}\\right)^4',
      vars: {
        a2: { name: 'Rayleigh loss at wavelength 2', q: 'attenuation', unit: 'dB/km', tex: '\\alpha_2' },
        a1: { name: 'Rayleigh loss at wavelength 1', q: 'attenuation', unit: 'dB/km', value: 0.12, tex: '\\alpha_1' },
        l1: { name: 'wavelength 1', q: 'length', unit: 'nm', value: 1550, tex: '\\lambda_1' },
        l2: { name: 'wavelength 2', q: 'length', unit: 'nm', value: 850, tex: '\\lambda_2' }
      },
      note: 'The scattering part of the loss only; absorption adds to it.',
      stories: { a2: 'The scattering loss of a silica fibre is {a1} at {l1}. What is it at {l2}?' }
    },
    {
      name: 'Critical bend radius (ray picture)',
      expr: 'R = a*n2/(n1 - n2)', tex: 'R_c = \\frac{a\\,n_2}{n_1 - n_2}',
      vars: {
        R: { name: 'bend radius at which the axial ray escapes', q: 'length', unit: 'mm', tex: 'R_c' },
        a: { name: 'core radius', q: 'length', unit: 'µm', value: 25 },
        n1: { name: 'core index', value: 1.48, min: 1, max: 2 },
        n2: { name: 'cladding index', value: 1.46, min: 1, max: 2 }
      },
      note: 'A floor, not a working limit: steeper rays escape at much larger radii. Valid for multimode fibre only.',
      stories: { R: 'A multimode fibre has a core radius of {a}, n₁ = {n1} and n₂ = {n2}. At what bend radius does even the axial ray escape?' }
    }
  ],
  examples: [
    {
      title: 'The same link in two windows',
      q: 'A 40 km link is run in standard single-mode fibre, first at 1310 nm (0.35 dB/km), then at 1550 nm (0.20 dB/km). How much of the light reaches the end in each case?',
      steps: [
        { text: 'At 1310 nm:', tex: 'A = 0.35 \\times 40 = 14\\ \\mathrm{dB} \\quad\\Rightarrow\\quad \\frac{P_{\\mathrm{out}}}{P_{\\mathrm{in}}} = 10^{-1.4} = 4.0\\ \\%' },
        { text: 'At 1550 nm:', tex: 'A = 0.20 \\times 40 = 8\\ \\mathrm{dB} \\quad\\Rightarrow\\quad \\frac{P_{\\mathrm{out}}}{P_{\\mathrm{in}}} = 10^{-0.8} = 15.8\\ \\%' }
      ],
      a: '4 % at 1310 nm against 16 % at 1550 nm: the 6 dB difference is four times the received power.'
    },
    {
      title: 'Why 850 nm is lossy',
      q: 'The Rayleigh scattering of silica fibre is 0.12 dB/km at 1550 nm. Estimate it at 850 nm, and compare with the 2 to 3 dB/km typical of multimode fibre at that wavelength.',
      steps: [
        { text: 'Scale by the fourth power of the wavelength ratio:', tex: '\\alpha(850) = 0.12 \\times \\left(\\frac{1550}{850}\\right)^4 = 0.12 \\times 11.1 = 1.3\\ \\mathrm{dB/km}' },
        'The other 1 to 2 dB/km is absorption and imperfection loss that multimode fibre, with its higher dopant levels, shows at that wavelength.'
      ],
      a: 'About 1.3 dB/km from scattering alone, roughly half of the measured loss at 850 nm.'
    }
  ],
  quiz: [
    { q: 'A single-mode fibre has a loss of 0.2 dB/km. About what fraction of the light remains after 50 km?', choices: ['10 %', '50 %', '90 %', '1 %'], a: 0, why: '$A = 0.2 \\times 50 = 10$ dB, a factor of 10: one tenth remains. 3 dB would be a half; 20 dB (100 km) would leave 1 %.' },
    { q: 'Why does the loss of silica fibre have a minimum near 1550 nm?', choices: ['Rayleigh scattering falls with wavelength while infrared absorption rises beyond it', 'The glass is perfectly transparent there', 'Water absorbs strongly there', 'Total internal reflection is best at that wavelength'], a: 0, why: 'Scattering goes as $1/\\lambda^4$ and drops with wavelength; the infrared absorption of the glass rises steeply beyond about 1600 nm. The two add to a minimum near 1550 nm.' },
    { q: 'A bend that passes 1310 nm without loss will also pass 1625 nm without loss.', a: false, why: 'Longer wavelengths have wider mode fields that reach further into the cladding and radiate away first. Bend loss rises with wavelength, so L-band signals are the most bend-sensitive.' },
    { q: 'A 25 km fibre has an attenuation of 0.35 dB/km. What percentage of the input power reaches the far end?', answer: 13.3, unit: '%', why: '$A = 0.35 \\times 25 = 8.75$ dB and $10^{-0.875} = 0.133$: 13.3 %.' },
    { q: 'What causes the absorption peak at 1383 nm in older fibre?', choices: ['Hydroxyl (water) ions in the glass', 'Germanium in the core', 'The acrylate coating', 'Rayleigh scattering'], a: 0, why: 'The OH ion vibrates at a frequency whose overtone lies at 1383 nm. Low-water-peak fibre is made so dry that the peak almost disappears.' }
  ],
  applications: [
    'Choosing the wavelength of a link: 850 nm for short multimode links, 1310 nm for metropolitan and access links, 1550 nm for long haul.',
    'Wavelength-division multiplexing in the C and L bands, where loss is lowest and erbium amplifiers work.',
    'Measuring a fibre: an optical time-domain reflectometer (OTDR) reads loss per kilometre and finds splices, bends and breaks from the backscattered light.',
    'Installation rules: minimum bend radii and cable pulling tensions, and bend-insensitive fibre inside buildings and homes.',
    'Spotting faults: a visible red laser shows a bend or break as a glowing spot in the jacket of a patch cord.'
  ],
  history: 'In 1966 Kao and Hockham set 20 dB/km as the target for communication. A Corning team passed it in 1970 (about 17 dB/km at 633 nm), and by 1979 a Japanese group (Miya and colleagues at NTT) reached 0.2 dB/km at 1550 nm, near the theoretical floor. Removing the water peak, a manufacturing triumph of the late 1990s, opened the band between 1260 and 1625 nm to a dense use of wavelengths.',
  sources: [
    'G. P. Agrawal, *Fiber-Optic Communication Systems*, ch. 2 — fibre losses: scattering, absorption and bending.',
    'G. Keiser, *Optical Fiber Communications*, the chapter on attenuation and distortion — loss mechanisms and the transmission windows.',
    'T. Miya, Y. Terunuma, T. Hosaka and T. Miyashita, "Ultimate low-loss single-mode fibre at 1.55 µm", *Electronics Letters* 15 (1979) 106.',
    'ITU-T Recommendations G.652 (standard single-mode fibre) and G.657 (bending-loss insensitive single-mode fibre).'
  ],
  sim: ['fo-loss', { id: 'fo-guide', params: { shape: 'bent' } }]
},

/* ================================================================ 5 */
{
  id: 'fibre-dispersion-and-bandwidth', parent: 'fibre-optics', title: 'Dispersion and bandwidth', level: 2,
  short: 'A pulse sent down a fibre comes out wider, because its parts travel at different speeds: different modes in a multimode fibre (modal dispersion), different wavelengths in any fibre (chromatic dispersion). The spread limits the bit rate and the length of a link: the bandwidth–length product.',
  keywords: ['dispersion', 'modal dispersion', 'chromatic dispersion', 'pulse spreading', 'bandwidth', 'bandwidth-length product', 'MHz·km', 'ps/(nm·km)', 'zero-dispersion wavelength', 'PMD', 'polarization mode dispersion', 'inter-symbol interference', 'effective modal bandwidth', 'dispersion-shifted fibre', 'D parameter'],
  prereq: ['single-mode-and-multimode-fibre', 'fibre-attenuation-and-windows', 'dispersion-and-the-spectrum'],
  related: ['fibre-optic-links', 'the-fibre-internet-link', 'continuous-and-pulsed-lasers', 'linewidth-and-coherence-of-lasers', 'diode-lasers', 'coherence'],
  body: `
A short pulse of light entering a fibre comes out longer. A bit that was a clean 100 ps pulse can arrive as a 300 ps smear that overlaps its neighbours, and the receiver can no longer tell a 1 from a 0. This **pulse spreading** is called dispersion, and after attenuation it is the second limit on a link.

### Modal dispersion
In a multimode fibre the energy travels in many modes, in the ray picture many paths. The axial ray goes straight; the steepest guided ray zigzags at the limit angle $\\cos\\psi = n_2/n_1$, a longer path by the factor $n_1/n_2$. After a length $L$ the two arrive apart by

$$\\Delta t = \\frac{L\\,n_1(n_1 - n_2)}{n_2\\,c}$$

For $n_1 = 1.480$ and $n_2 = 1.460$ that is **68 ns per kilometre**, a bandwidth of only about 6 MHz over a kilometre. A **graded-index** profile ([[single-mode-and-multimode-fibre]]) makes the long paths faster and cuts the spread by a factor of a hundred or more; real fibres reach 0.5 to 2 ns/km, because the profile is never perfect.

### Chromatic dispersion
Every fibre, single-mode included, has it: the index depends on wavelength ([[dispersion-and-the-spectrum]]), and a laser pulse is not a single wavelength. Part comes from the glass (*material* dispersion), part from the way the mode spreads into the cladding (*waveguide* dispersion). It is described by $D$, in ps of spread per nm of source width per km of fibre:

$$\\Delta t = D\\,L\\,\\Delta\\lambda$$

In standard single-mode fibre $D$ is zero near 1310 nm (between 1300 and 1324 nm) and about 17 ps/(nm·km) at 1550 nm. A laser of 0.1 nm width over 60 km at 1550 nm spreads by $17 \\times 60 \\times 0.1 = 102$ ps. Dispersion-shifted fibre moves the zero to 1550 nm; dispersion-compensating fibre or coherent receivers undo it.

### From spread to bandwidth
A fibre acts as a low-pass filter. For a pulse widening to $\\Delta t$ (full width at half maximum), the optical bandwidth is about $B \\approx 0.44/\\Delta t$. Modal spread grows in proportion to length, so bandwidth falls as $1/L$ and the product stays constant, the **bandwidth–length product**, in MHz·km:

| Multimode class at 850 nm | Bandwidth–length |
|---|---|
| OM1 (overfilled launch) | 200 MHz·km |
| OM2 | 500 MHz·km |
| OM3 (laser launch) | 2000 MHz·km |
| OM4 (laser launch) | 4700 MHz·km |

A rule of thumb is to keep the total rms spread under about a quarter of the bit period. At 10 Gbit/s that is 25 ps.

### Smaller effects
**Polarization-mode dispersion** arises because no fibre is perfectly round: the two polarizations travel at slightly different speeds, by a spread that grows as $\\sqrt{L}$ (0.1 ps/√km is typical). It matters at 10 Gbit/s and above on long links.

> [!key] Pulses spread because their parts travel at different speeds: modes in multimode fibre ($\\Delta t \\propto L$), wavelengths in every fibre ($\\Delta t = D L \\Delta\\lambda$). The spread sets the bandwidth, $B \\approx 0.44/\\Delta t$, and with it the product of bit rate and length.
`,
  ideas: [
    'Dispersion is the spreading of a pulse in time because its parts travel at different speeds.',
    'Modal dispersion (multimode fibre): Δt = L·n₁(n₁ − n₂)/(n₂c), 68 ns/km for a step-index fibre; graded index cuts it by two orders of magnitude.',
    'Chromatic dispersion (every fibre): Δt = D·L·Δλ; zero near 1310 nm and about 17 ps/(nm·km) at 1550 nm in standard fibre.',
    'Optical bandwidth B ≈ 0.44/Δt; for modal dispersion the product of bandwidth and length is constant.',
    'Keep the spread below a quarter of a bit period, and remember that dispersion adds to attenuation as a limit on reach.'
  ],
  pitfalls: [
    'Dispersion is just another name for attenuation — Attenuation loses power; dispersion smears pulses in time without losing any power. A link can have plenty of light and still make errors because the pulses overlap.',
    'Single-mode fibre has no dispersion — It has no modal dispersion, but its chromatic dispersion is 17 ps/(nm·km) at 1550 nm, enough to limit 10 Gbit/s signals to some tens of kilometres without compensation.',
    'A fibre of 500 MHz·km carries 500 MHz at any length — The bandwidth falls in inverse proportion to the length: 500 MHz over 1 km is 100 MHz over 5 km.',
    'More laser power overcomes dispersion — Amplifiers add power but cannot narrow a pulse. Only compensation (a fibre of opposite D, a grating or digital processing) or a narrower source helps.'
  ],
  terms: [
    { term: 'Dispersion', also: ['pulse spreading', 'pulse broadening'], def: 'The widening of a pulse in time as it travels, because its parts (modes, wavelengths, polarizations) move at different speeds.' },
    { term: 'Modal dispersion', also: ['intermodal dispersion'], def: 'Pulse spreading in multimode fibre because different modes travel different paths or speeds. Δt = L n₁(n₁ − n₂)/(n₂c) for a step-index fibre.' },
    { term: 'Chromatic dispersion', also: ['D', 'dispersion parameter', 'ps/(nm·km)'], def: 'Pulse spreading because the group velocity depends on wavelength. Δt = D·L·Δλ, with D in ps/(nm·km). Zero near 1310 nm in standard fibre.' },
    { term: 'Zero-dispersion wavelength', also: ['λ₀'], def: 'The wavelength at which the chromatic dispersion D passes through zero: between 1300 and 1324 nm in standard single-mode fibre.' },
    { term: 'Bandwidth–length product', also: ['MHz·km', 'effective modal bandwidth', 'EMB'], def: 'The product of the usable bandwidth and the length of a multimode fibre, which stays nearly constant: 500 MHz·km allows 500 MHz over 1 km or 100 MHz over 5 km.' },
    { term: 'Polarization-mode dispersion', also: ['PMD'], def: 'Spread caused by a slight difference in speed of the two polarizations in an imperfectly round fibre. It grows as the square root of the length, ps/√km.' },
    { term: 'Inter-symbol interference', also: ['ISI'], def: 'Overlap of neighbouring bits after pulse spreading, so that a receiver mistakes one for another.' }
  ],
  formulas: [
    {
      name: 'Modal dispersion of a step-index fibre',
      expr: 'dt = L*n1*(n1 - n2)/(n2*c)', tex: '\\Delta t = \\frac{L\\,n_1(n_1 - n_2)}{n_2\\,c}',
      vars: {
        dt: { name: 'delay spread between the fastest and slowest ray', q: 'time', unit: 'ns', tex: '\\Delta t' },
        L: { name: 'length of fibre', q: 'length', unit: 'km', value: 1 },
        n1: { name: 'core index', value: 1.48, min: 1, max: 2 },
        n2: { name: 'cladding index', value: 1.46, min: 1, max: 2 },
        c: { const: 'c' }
      },
      note: 'Steepest guided ray against the axial ray. A graded index reduces it by a factor of 100 or more.',
      stories: { dt: 'A step-index fibre of n₁ = {n1} and n₂ = {n2} is {L} long. By how much do the fastest and slowest rays differ in arrival time?' }
    },
    {
      name: 'Chromatic dispersion',
      expr: 'dt = D*L*dl', tex: '\\Delta t = D\\,L\\,\\Delta\\lambda',
      vars: {
        dt: { name: 'pulse spread', q: false, unit: 'ps', tex: '\\Delta t' },
        D: { name: 'dispersion parameter', q: false, unit: 'ps/(nm·km)', value: 17 },
        L: { name: 'length of fibre', q: false, unit: 'km', value: 60 },
        dl: { name: 'spectral width of the source', q: false, unit: 'nm', value: 0.1, tex: '\\Delta\\lambda' }
      },
      note: 'Units as written: ps, ps/(nm·km), km, nm. D is about 17 ps/(nm·km) at 1550 nm in standard fibre.',
      stories: { dt: 'A laser of width {dl} sends pulses along {L} of fibre with D = {D}. By how much do the pulses spread?', L: 'D = {D}, the laser is {dl} wide and the pulses may spread by {dt}. How far can they travel?' }
    },
    {
      name: 'Dispersion parameter of standard fibre',
      expr: 'D = S0/4*(lambda - lambda0^4/lambda^3)', tex: 'D = \\frac{S_0}{4}\\left(\\lambda - \\frac{\\lambda_0^4}{\\lambda^3}\\right)',
      vars: {
        D: { name: 'dispersion parameter', q: false, unit: 'ps/(nm·km)', signed: true },
        S0: { name: 'dispersion slope at the zero', q: false, unit: 'ps/(nm²·km)', value: 0.092, tex: 'S_0' },
        lambda: { name: 'wavelength', q: false, unit: 'nm', value: 1550, min: 1200, max: 1700, tex: '\\lambda' },
        lambda0: { name: 'zero-dispersion wavelength', q: false, unit: 'nm', value: 1312, min: 1280, max: 1340, tex: '\\lambda_0' }
      },
      note: 'A fit for standard (G.652) fibre between about 1200 and 1700 nm.',
      stories: { D: 'A standard fibre has a zero-dispersion wavelength of {lambda0} and a slope of {S0}. What is its dispersion at {lambda}?' }
    },
    {
      name: 'Bandwidth from pulse spread',
      expr: 'B = 0.44/dt', tex: 'B \\approx \\frac{0.44}{\\Delta t}',
      vars: {
        B: { name: '3 dB optical bandwidth', q: 'frequency', unit: 'MHz' },
        dt: { name: 'full width of the output pulse', q: 'time', unit: 'ns', value: 68, tex: '\\Delta t' }
      },
      note: 'For a roughly Gaussian output pulse, with Δt its full width at half maximum.',
      stories: { B: 'A fibre widens a short pulse to {dt}. What is its optical bandwidth?' }
    },
    {
      name: 'Length allowed by the bandwidth–length product',
      expr: 'L = BL/B', tex: 'L = \\frac{\\mathrm{BL}}{B}',
      vars: {
        L: { name: 'longest link', q: false, unit: 'km' },
        BL: { name: 'bandwidth–length product', q: false, unit: 'MHz·km', value: 2000, tex: '\\mathrm{BL}' },
        B: { name: 'bandwidth needed', q: false, unit: 'MHz', value: 7500 }
      },
      note: 'For modal dispersion, which grows in proportion to the length.',
      stories: { L: 'A multimode fibre has a bandwidth–length product of {BL}. How long can a link be if it needs {B}?' }
    }
  ],
  examples: [
    {
      title: 'A step-index fibre over 2 km',
      q: 'A step-index multimode fibre has $n_1 = 1.480$ and $n_2 = 1.460$ and is 2 km long. What are the delay spread and the bandwidth?',
      steps: [
        { text: 'The spread per kilometre is', tex: '\\frac{\\Delta t}{L} = \\frac{n_1(n_1 - n_2)}{n_2\\,c} = \\frac{1.480 \\times 0.020}{1.460 \\times 2.998\\times10^{8}} = 67.6\\ \\mathrm{ns/km}' },
        'Over 2 km it is 135 ns. The bandwidth is then',
        { tex: 'B \\approx \\frac{0.44}{135\\ \\mathrm{ns}} = 3.3\\ \\mathrm{MHz}' }
      ],
      a: '135 ns of spread, a bandwidth of about 3 MHz: a few megabits per second. Step-index multimode fibre suits only very short links.'
    },
    {
      title: 'Chromatic dispersion at 10 Gbit/s',
      q: 'A laser of spectral width 0.1 nm at 1550 nm feeds 60 km of standard fibre ($D = 17$ ps/(nm·km)). How much does a pulse spread, and is that tolerable at 10 Gbit/s?',
      steps: [
        { text: 'The spread:', tex: '\\Delta t = D\\,L\\,\\Delta\\lambda = 17 \\times 60 \\times 0.1 = 102\\ \\mathrm{ps}' },
        'A bit at 10 Gbit/s lasts 100 ps, and the guideline is a spread under about a quarter of a bit, 25 ps. This is four times too large.'
      ],
      a: '102 ps: as long as the bit itself. Either a narrower source (the modulation of a laser fixes a minimum), compensation, or a wavelength near 1310 nm is needed.'
    }
  ],
  quiz: [
    { q: 'A pulse leaves a fibre wider than it entered, with its energy undiminished. This is…', choices: ['Dispersion', 'Attenuation', 'Reflection loss', 'Absorption'], a: 0, why: 'Dispersion spreads a pulse in time without removing power. Attenuation lowers the power of the whole pulse.' },
    { q: 'Single-mode fibre has no dispersion, since it carries only one mode.', a: false, why: 'It has no modal dispersion, but chromatic dispersion remains: 17 ps/(nm·km) at 1550 nm in standard fibre, because the pulse contains a range of wavelengths.' },
    { q: 'A multimode fibre is specified at 500 MHz·km. What bandwidth does a 2 km link have, in MHz?', answer: 250, unit: 'MHz', why: 'The bandwidth falls as the length grows: $500\\ \\mathrm{MHz{\\cdot}km}/2\\ \\mathrm{km} = 250$ MHz.' },
    { q: 'At which wavelength is the chromatic dispersion of standard single-mode fibre close to zero?', choices: ['About 1310 nm', 'About 850 nm', 'About 1550 nm', 'About 1625 nm'], a: 0, why: 'The zero lies between 1300 and 1324 nm, which is why 1310 nm is popular for dispersion-free links; at 1550 nm, the lowest-loss window, D is about 17 ps/(nm·km).' },
    { q: 'A laser of 0.2 nm width sends pulses over 25 km of fibre with D = 17 ps/(nm·km). How much does a pulse spread, in picoseconds?', answer: 85, unit: 'ps', why: '$\\Delta t = D L \\Delta\\lambda = 17 \\times 25 \\times 0.2 = 85$ ps.' }
  ],
  applications: [
    'Choosing the fibre class for a building or data centre: OM3, OM4 or OM5 for the speeds and distances needed.',
    'Reach tables of transceivers: 10 km at 1310 nm, 40 or 80 km at 1550 nm, set partly by dispersion.',
    'Dispersion compensation in long-haul systems: spools of negative-D fibre, chirped gratings, and digital filters in coherent receivers.',
    'Ultrashort-pulse lasers, whose pulses broaden in a fibre unless dispersion is managed.',
    'Measuring fibre: OTDR and dispersion analyzers report the zero-dispersion wavelength, slope and PMD.'
  ],
  history: 'The first fibres of the 1970s were step-index and carried a few tens of megabits per second over a few kilometres. Graded-index fibres (suggested in the early 1970s and in service from the late 1970s) multiplied the bandwidth by about a hundred; single-mode fibre removed modal dispersion altogether in the 1980s, leaving chromatic dispersion as the limit that dispersion-shifted fibre and later coherent detection took on.',
  sources: [
    'G. P. Agrawal, *Fiber-Optic Communication Systems*, ch. 2 — modal, chromatic and polarization-mode dispersion, with the formula for D.',
    'G. Keiser, *Optical Fiber Communications*, the chapter on attenuation and distortion — pulse broadening and the bandwidth–length product.',
    'ISO/IEC 11801 and IEC 60793-2-10 — the multimode classes OM1 to OM5 and their bandwidth requirements.',
    'ITU-T Recommendation G.652 — the dispersion limits of standard single-mode fibre.'
  ],
  sim: [{ id: 'fo-dispersion', params: { fibre: 'step' } }]
},

/* ================================================================ 6 */
{
  id: 'fibre-connectors-and-ferrules', parent: 'fibre-optics', title: 'Fibre connectors and ferrules', level: 1,
  short: 'A ferrule is the precision cylinder, usually zirconia ceramic, with a hole through its axis in which a fibre is glued and polished. Two ferrules butted in a split sleeve line up two fibres core to core. Ferrule sizes (2.5 mm, 1.25 mm, 3.175 mm), end-face polish (PC, UPC, APC) and cleanliness decide the loss and the back-reflection of a connector.',
  keywords: ['ferrule', 'connector', 'SC', 'LC', 'FC', 'ST', 'SMA 905', 'MPO', 'MTP', 'MT ferrule', 'zirconia', 'split sleeve', 'adapter', 'PC', 'UPC', 'APC', 'insertion loss', 'return loss', 'back reflection', 'end face', 'patch cord', 'pigtail', 'fibre inspection', 'concentricity'],
  prereq: ['single-mode-and-multimode-fibre', 'fibre-attenuation-and-windows', 'fresnel-reflection'],
  related: ['coupling-light-into-fibre', 'fibre-optic-links', 'ferrules-and-light-guide-couplings', 'fibre-optic-light-guides', 'cleaning-and-handling-optics', 'the-fibre-internet-link'],
  body: `
A fibre is 125 µm across and a single-mode core only 9 µm. To pass light from one fibre into another, something must hold each end to within about a micrometre. That something is the **ferrule**: a precision cylinder, most often of white zirconia ceramic, with a hole through its axis a micrometre or so wider than the fibre (about 126 µm). The fibre is glued in and the cylinder is polished together with the fibre end, so the ferrule is both handle and alignment tool.

### How two ferrules join
Two plugs meet in an **adapter**, which holds a **split sleeve**: a slotted tube of ceramic or phosphor bronze that grips each ferrule. The ground outsides of the two ferrules slide into the sleeve and meet end to end, so their axes line up, and a spring in each plug presses the faces together. The sleeve aligns *outsides*; what matters is how **concentric** the core is to the outside of its ferrule, about 0.5 to 1 µm.

### The sizes
| Connector | Ferrule | Coupling | Typical use |
|---|---|---|---|
| SC | 2.5 mm | push-pull, square body | telecom, data |
| FC | 2.5 mm | threaded, keyed | instruments, single-mode |
| ST | 2.5 mm | bayonet | older multimode links |
| LC | 1.25 mm | latch | transceivers, dense panels |
| SMA 905 | 3.175 mm, metal | threaded | large cores: lasers, spectrometers |
| MPO/MTP | 6.4 mm wide, rectangular | push-pull, guide pins | 12 or 24 fibres in a row |

E2000 (2.5 mm, with a spring shutter) and MU (1.25 mm) are less common. The ferrule of an LC holds the *same* 125 µm fibre as that of an SC; only the mechanics change. The ferrule of a light-guide bundle is a different, metal part ([[ferrules-and-light-guide-couplings]]).

### What a connection costs
With a mode-field radius $w$ = 4.6 µm, a lateral offset $d$ costs about $4.34\\,(d/w)^2$ dB: 0.05 dB at 0.5 µm, 0.2 dB at 1 µm, 0.8 dB at 2 µm. A 1° tilt costs 0.16 dB, a 10 µm air gap 0.04 dB plus 0.3 dB of reflection at two glass–air faces, which contact removes. A good mated pair loses 0.1 to 0.3 dB; cabling standards allow about 0.75 dB.

### End-face polish
The end is polished to a slight dome so that the fibre cores touch (**physical contact**, PC): glass meets glass, with no reflecting air film. **UPC** is a finer polish. **APC** angles the face by 8°. Typical *return loss*, the reflected light below the incident, is 35 dB (PC), 50 dB (UPC) and 65 dB (APC): the angle sends the reflection into the cladding ([[fresnel-reflection]]). Connector colours: blue UPC, green APC. **Never mate green with blue.**

### Dirt
Most bad connections are dirty ones: a speck a few micrometres across over a 9 µm core can cost several dB. Inspect the end face with a video microscope, clean it with a dry click-cleaner or lint-free wipe, and keep dust caps on.

> [!warn] Never look into a fibre or a connector, or into a microscope viewing a live one. The light is usually invisible infrared, can be milliwatts to watts, and the eye cannot tell you it is there. Check that the link is dark, and see [[laser-eye-hazards-and-eyewear]].

> [!key] A ferrule is a micrometre-precise ceramic cylinder holding a fibre; a split sleeve aligns the two ferrules' outsides, so the core's concentricity matters. Loss grows as (offset ÷ mode radius)², and APC polish sends reflections out of the core.
`,
  ideas: [
    'A ferrule holds a fibre in a hole of about 126 µm; its outside, ground to about a micrometre, aligns it in a split sleeve.',
    'Ferrule diameters: 2.5 mm (SC, FC, ST), 1.25 mm (LC, MU), 3.175 mm (SMA 905), a 6.4 mm wide MT ferrule (MPO).',
    'Insertion loss comes from lateral offset (∝ (d/w)²), gap, tilt, mode mismatch and dirt; a good pair loses 0.1–0.3 dB.',
    'PC and UPC polish give physical contact; APC angles the face 8° so that the reflection leaves the core: return loss 35, 50 and 65 dB.',
    'Clean and inspect before every mating, and never look into a live fibre.'
  ],
  pitfalls: [
    'The connector body aligns the fibres — The plug is only a holder. The ferrule, guided by the split sleeve, does the aligning, to about a micrometre.',
    'A bigger ferrule holds a bigger fibre — A 2.5 mm and a 1.25 mm ferrule both hold the same 125 µm fibre; the diameter is about mechanics and density of ports, not about the fibre.',
    'Any two connectors that fit together will work together — Green (APC) and blue (UPC) connectors can be pushed together, but the angled and flat faces then leave a gap that costs several dB and can damage the faces.',
    'A connector loses light only through poor alignment — Dirt is the commonest cause: one speck over the core can cost more than all of the alignment errors together.'
  ],
  terms: [
    { term: 'Ferrule', def: 'The precision cylinder, usually zirconia ceramic, with a central hole in which a fibre is bonded and polished. Its ground outside aligns the fibre in the connector. Diameters: 2.5 mm, 1.25 mm, 3.175 mm.' },
    { term: 'Split sleeve', also: ['alignment sleeve', 'adapter', 'coupler'], def: 'A slotted tube, inside an adapter, that grips two ferrules and holds their axes in line while their end faces touch.' },
    { term: 'Insertion loss', also: ['IL', 'connector loss'], def: 'The power lost when a connection is made, in dB: 10 log (power in ÷ power out). A good pair: 0.1 to 0.3 dB.' },
    { term: 'Return loss', also: ['RL', 'back reflection', 'reflectance', 'ORL'], def: 'The power reflected back along the fibre, expressed in dB below the incident power: 35 dB for PC, 50 dB for UPC, 65 dB for APC. Larger is better.' },
    { term: 'Physical contact', also: ['PC', 'UPC', 'APC', 'angled physical contact'], def: 'A polish with a domed end face so that two fibre cores touch glass to glass. PC and UPC faces are perpendicular to the axis; APC faces are angled by 8°.' },
    { term: 'Concentricity', also: ['core eccentricity', 'core-to-ferrule offset'], def: 'How far the fibre core lies from the axis of the outside of its ferrule: the main source of lateral offset. About 0.5 to 1 µm.' },
    { term: 'MT ferrule', also: ['MPO', 'MTP', 'multi-fibre push-on'], def: 'A rectangular plastic ferrule, 6.4 mm wide, that holds 12 or more fibres in a row at 250 µm pitch and is aligned by two steel guide pins.' }
  ],
  formulas: [
    {
      name: 'Loss from lateral offset (single-mode)',
      expr: 'IL = 4.343*(2*d/MFD)^2', tex: '\\mathrm{IL} \\approx 4.34\\left(\\frac{2d}{\\mathrm{MFD}}\\right)^2',
      vars: {
        IL: { name: 'insertion loss', q: 'gain', unit: 'dB', tex: '\\mathrm{IL}' },
        d: { name: 'offset between the two cores', q: 'length', unit: 'µm', value: 1 },
        MFD: { name: 'mode-field diameter', q: 'length', unit: 'µm', value: 9.2, tex: '\\mathrm{MFD}' }
      },
      note: 'For two identical Gaussian modes and offsets well below the mode radius.',
      stories: { IL: 'Two single-mode fibres of mode-field diameter {MFD} meet with their cores {d} apart. What is the loss?', d: 'A connector may lose at most {IL}. How far apart may the cores of fibres with a mode-field diameter of {MFD} be?' }
    },
    {
      name: 'Loss from tilt (single-mode)',
      expr: 'IL = 4.343*(pi*w*theta/lambda)^2', tex: '\\mathrm{IL} \\approx 4.34\\left(\\frac{\\pi w \\theta}{\\lambda}\\right)^2',
      vars: {
        IL: { name: 'insertion loss', q: 'gain', unit: 'dB', tex: '\\mathrm{IL}' },
        w: { name: 'mode-field radius', q: 'length', unit: 'µm', value: 4.6 },
        theta: { name: 'angle between the fibre axes (in air)', q: 'angle', unit: '°', value: 1, min: 0, max: 10, tex: '\\theta' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 1310, tex: '\\lambda' }
      },
      note: 'Small angles; the fibres in air with no gap.',
      stories: { IL: 'Two single-mode fibres with a mode-field radius of {w} meet at an angle of {theta} at {lambda}. What is the loss?' }
    },
    {
      name: 'Loss from core-diameter mismatch (multimode)',
      expr: 'IL = 20*log(d1/d2)', tex: '\\mathrm{IL} = 20\\log_{10}\\frac{d_1}{d_2}',
      vars: {
        IL: { name: 'insertion loss', q: 'gain', unit: 'dB', tex: '\\mathrm{IL}' },
        d1: { name: 'core diameter of the transmitting fibre', q: 'length', unit: 'µm', value: 62.5 },
        d2: { name: 'core diameter of the receiving fibre', q: 'length', unit: 'µm', value: 50 }
      },
      note: 'When d₁ > d₂ and the receiving core is fully filled; there is no loss when d₁ ≤ d₂ (the numerical apertures must match as well).',
      stories: { IL: 'Light from a {d1} core enters a {d2} core. What is the geometric loss?' }
    },
    {
      name: 'Reflectance of a glass–air end face',
      expr: 'R = ((n - 1)/(n + 1))^2', tex: 'R = \\left(\\frac{n - 1}{n + 1}\\right)^2',
      vars: {
        R: { name: 'fraction reflected', q: 'ratio', unit: '%' },
        n: { name: 'refractive index of the glass', value: 1.449, min: 1, max: 4 }
      },
      note: 'Normal incidence on an uncoated face in air: about 3.4 % for silica, 14.7 dB below the incident light.',
      stories: { R: 'What fraction of the light reflects from a flat end face of a fibre of index {n} in air?' }
    },
    {
      name: 'Return loss',
      expr: 'RL = -10*log(R)', tex: '\\mathrm{RL} = -10\\log_{10} R',
      vars: {
        RL: { name: 'return loss', q: 'gain', unit: 'dB', tex: '\\mathrm{RL}' },
        R: { name: 'reflected fraction of the incident power', q: 'ratio', unit: '%', value: 3.4 }
      },
      note: 'RL = 14.7 dB for a flat cleave in air; 35, 50 and 65 dB are typical of PC, UPC and APC connectors.',
      stories: { RL: 'A face reflects {R} of the light back along the fibre. What is its return loss?', R: 'A connector has a return loss of {RL}. What fraction of the light does it reflect?' }
    }
  ],
  examples: [
    {
      title: 'The price of a micrometre',
      q: 'Two single-mode ferrules each have a core eccentricity of 0.7 µm, and in the worst case the errors add. The mode-field diameter is 9.2 µm. What is the worst-case loss from the offset?',
      steps: [
        'The offset is $d = 0.7 + 0.7 = 1.4$ µm.',
        { text: 'The loss:', tex: '\\mathrm{IL} = 4.343\\left(\\frac{2 \\times 1.4}{9.2}\\right)^2 = 0.40\\ \\mathrm{dB}' }
      ],
      a: 'About 0.4 dB in the worst case. Typical pairs are better because the two errors rarely point in opposite directions, so a mated pair usually loses 0.1 to 0.3 dB.'
    },
    {
      title: 'Why APC for a sensitive laser',
      q: 'A distributed-feedback laser is damaged by reflections stronger than −40 dB. A flat, unmated fibre end reflects 3.4 % of the light. By what factor must a UPC (−50 dB) or an APC (−65 dB) connector reduce it?',
      steps: [
        { text: 'The flat end gives $-10\\log_{10}0.034 = 14.7$ dB of return loss, a reflected fraction of 3.4 × 10⁻².' },
        { text: 'A return loss of 50 dB is a fraction of $10^{-5}$, 3 400 times smaller; 65 dB is $3.2\\times10^{-7}$, about 110 000 times smaller.' }
      ],
      a: 'UPC reduces the reflection 3 400 times and meets the −40 dB limit; APC reduces it 110 000 times and leaves a wide margin, which is why it is used with sensitive lasers and in passive optical networks.'
    }
  ],
  quiz: [
    { q: 'What does the split sleeve align?', choices: ['The outer surfaces of the two ferrules', 'The two fibre cores directly, by their light', 'The two connector bodies only', 'The two cable jackets'], a: 0, why: 'The sleeve grips the ground outsides of the ferrules. The cores line up if each core is concentric with its ferrule, which is why concentricity is a specified quantity.' },
    { q: 'Which connector has a ferrule 1.25 mm in diameter?', choices: ['LC', 'SC', 'FC', 'SMA 905'], a: 0, why: 'The LC (and the MU) use the half-size ferrule, which allows twice as many ports in the same panel. SC, FC and ST use 2.5 mm; SMA 905 uses 3.175 mm.' },
    { q: 'Two single-mode fibres with a mode-field diameter of 9.2 µm have their cores 1.5 µm apart. What is the loss, in dB?', answer: 0.46, unit: 'dB', why: '$\\mathrm{IL} = 4.343\\,(2d/\\mathrm{MFD})^2 = 4.343 \\times (3.0/9.2)^2 = 0.46$ dB.' },
    { q: 'Why does an APC connector give a much better return loss than a UPC one?', choices: ['Its 8° face reflects the light into the cladding instead of back along the core', 'Its glass has a lower refractive index', 'It has no air film at all', 'It uses a larger ferrule'], a: 0, why: 'The reflected ray travels at 16° to the axis, far beyond the few degrees the core can guide, so it is lost in the cladding. The cost is that an APC can only be mated with another APC.' },
    { q: 'A green-bodied connector may be plugged into a blue-bodied one, because they fit the same adapter.', a: false, why: 'Green is APC (angled face) and blue is UPC (flat). They fit mechanically, but the angled and flat faces cannot touch: the gap costs several dB and the contact can scratch the faces.' }
  ],
  applications: [
    'Patch panels and patch cords in telecom exchanges, data centres and buildings: SC and LC with UPC or APC polish.',
    'Transceivers: the duplex LC, and MPO/MTP for parallel links of 12 to 24 fibres.',
    'Laboratory and instrument fibres: FC and SMA 905 on spectrometers, lasers and sensors, where connectors are mated many times.',
    'Passive optical networks and cable television: APC everywhere, to keep reflections out of the lasers and analog receivers.',
    'Test equipment: an optical power meter, a light source and a video inspection probe all work through the same ferrules.'
  ],
  history: 'The first fibre connectors of the 1970s used metal ferrules and were hard to make precisely. Ceramic-ferrule connectors with physical contact appeared in the 1980s: the FC and SC types come from Nippon Telegraph and Telephone, the ST from AT&T. The small LC, introduced by Lucent in the late 1990s, halved the ferrule diameter to fit more ports on a panel, and angled polish (APC) became standard where reflections had to be very low.',
  sources: [
    'IEC 61754 series, *Fibre optic interconnecting devices and passive components — Fibre optic connector interfaces* — the dimensions of the SC, LC, FC and MPO interfaces.',
    'IEC 61755-3 series — the geometry of the end face of a physical-contact ferrule, and IEC 61300-3-35 — visual inspection of a fibre end face.',
    'D. Gloge, "Offset and tilt loss in optical fiber splices", *Bell System Technical Journal* 55 (1976) 905.',
    'J. Hecht, *Understanding Fiber Optics* (Pearson) — connectors, splices and test.'
  ],
  sim: ['fo-connectors', 'fo-ferrule', 'fo-endface']
},

/* ================================================================ 7 */
{
  id: 'coupling-light-into-fibre', parent: 'fibre-optics', title: 'Coupling light into a fibre', level: 2,
  short: 'A fibre accepts only light that resembles its own mode. For single-mode fibre a lens must focus the beam to a spot the size of the mode field and hold it within micrometres; for multimode fibre the spot must fit the core and the cone must fit the numerical aperture. Mode matching and alignment decide the coupling efficiency.',
  keywords: ['coupling', 'coupling efficiency', 'mode matching', 'fibre collimator', 'launch', 'lens to fibre', 'laser to fibre', 'pigtail', 'alignment tolerance', 'mode field', 'waist', 'cladding mode', 'étendue', 'active alignment', 'beam waist'],
  prereq: ['single-mode-and-multimode-fibre', 'focusing-a-laser-beam', 'fibre-numerical-aperture'],
  related: ['fibre-connectors-and-ferrules', 'collimating-a-laser-diode', 'the-gaussian-beam', 'etendue', 'diode-lasers', 'aligning-an-optical-system', 'beam-waist-and-divergence'],
  body: `
Before light can be guided it has to be put into the fibre, and the fibre accepts light only if two things match: **where** the light lands and **how** it arrives. It must land on the core, in a spot no larger than the fibre's mode, and its rays must fall inside the acceptance cone.

### Single-mode fibre: match the mode field
A single-mode fibre accepts only light shaped like its mode, a Gaussian of radius $w_f$ (half the mode-field diameter). A lens of focal length $f$ focusing a collimated beam of radius $w$ and quality $M^2$ makes a waist ([[focusing-a-laser-beam]])

$$w_0 = \\frac{M^2\\,\\lambda f}{\\pi w}$$

A beam 2 mm across ($w = 1$ mm) at 1550 nm focused by $f = 11$ mm gives $w_0 = 5.4$ µm, close to a fibre's 5.2 µm: a match of 99 %. To choose the lens, solve for $f = \\pi w w_f/(M^2\\lambda)$: this is what a **fibre collimator**, a lens fixed at the right distance from a ferrule, is built to do. If the two radii $w_1$ and $w_2$ differ, the efficiency is $\\eta = [2w_1w_2/(w_1^2 + w_2^2)]^2$: a factor 2 costs 36 % (1.9 dB). The cone must also fit: $\\tan\\theta \\approx w/f$ should stay inside the acceptance angle.

### How exactly must it be placed?
| Error | 1 dB lost when | At 1550 nm, $w_f$ = 5.2 µm |
|---|---|---|
| Lateral offset $d$ | $d = 0.48\\,w_f$ | 2.5 µm |
| Axial error (defocus) | $z \\approx z_R$, $z_R = \\pi w_f^2/\\lambda$ | ±56 µm |
| Tilt $\\theta$ of the beam | $\\theta = 0.48\\,\\lambda/(\\pi w_f)$ | 2.6° |

Micrometre-level lateral tolerance is why single-mode work uses micro-positioners, and why laser-to-fibre modules are welded in place after alignment.

### Multimode fibre: fill the core, stay in the NA
The spot must be smaller than the core (50 µm) and the cone narrower than the NA: for NA 0.2 the lens must be no faster than about f/2.5. How much can enter is limited by the étendue, the area times the solid angle ([[etendue]]): a 300 µm LED chip cannot put more than $(50/300)^2 = 2.8$ % of its light into a 50 µm core, whatever the lens; a laser's tiny étendue fits easily.

### A laser diode into a fibre
A diode's beam is elliptical and astigmatic, with a divergence about 30° (fast axis) against 8° (slow axis). An aspheric lens, often with a cylindrical or anamorphic correction ([[collimating-a-laser-diode]]), reaches typically 50 to 80 % into single-mode fibre.

### In practice
Alignment has six degrees of freedom: three positions and two tilts. A clean cleaved end, a power meter and a patient walk to the maximum do the job. Before trusting the reading, remove light in the *cladding* by dipping a few centimetres of fibre in index gel or stripping the coating, or the meter will read a peak that is not in the core.

> [!warn] Coupling a laser is working with a beam. Wear eyewear rated for its wavelength and power, keep the beam path below eye level, and never look into the fibre end or the lens while the laser is on ([[laser-safety-classes]]).

> [!key] A single-mode fibre accepts only light matched in size ($w_0 = w_f$) and direction to its mode, within a micrometre laterally; a multimode fibre accepts what fits its core and NA, up to the limit of étendue.
`,
  ideas: [
    'A fibre accepts light that matches its mode in size, position and direction.',
    'For single-mode fibre choose the lens so that the focused waist w₀ = M²λf/(πw) equals the mode-field radius.',
    'Mismatched waists couple η = [2w₁w₂/(w₁² + w₂²)]²; a factor of 2 in radius costs 1.9 dB.',
    'Tolerances in single-mode work are a few micrometres sideways, tens of micrometres along the axis, a few degrees of tilt.',
    'For multimode fibre, fill the core and the NA; the source étendue limits what can be coupled.'
  ],
  pitfalls: [
    'A larger lens couples more light — Only a matched one does. The focus must be the size of the mode and the cone must fit the acceptance angle; a bigger lens that overfills the NA or focuses to a bigger spot wastes the extra light.',
    'The brightest spot on the fibre end is the best alignment — The focused spot is bright whether or not it lands on the core. Only the power out of the far end tells how much was coupled.',
    'If the power meter reads high, the coupling is good — Light travelling in the cladding also reaches the meter. Strip the cladding light (gel or coating) before optimizing.',
    'All tolerances are alike — Lateral offset is the tightest (about 2.5 µm for a 1 dB loss in a telecom fibre), axial about 20 times looser.'
  ],
  terms: [
    { term: 'Mode matching', also: ['mode-field matching', 'spot-size matching'], def: 'Making the size and shape of the focused light equal those of the fibre mode, so that nearly all of it is accepted.' },
    { term: 'Coupling efficiency', also: ['coupling loss', 'η'], def: 'The fraction of the available power that is guided by the fibre, or its loss in dB. Good single-mode couplings reach 80 to 95 %.' },
    { term: 'Fibre collimator', also: ['fibre-pigtailed collimator'], def: 'A lens held at the right distance from a fibre end, turning the divergent light leaving the fibre into a collimated beam (or focusing a beam into it).' },
    { term: 'Cladding mode', also: ['mode stripper'], def: 'Light guided by the cladding instead of the core. It makes alignment readings misleading and is removed by a mode stripper (index gel or lossy coating).' },
    { term: 'Pigtail', also: ['fibre-pigtailed laser'], def: 'A short length of fibre permanently attached to a source or a detector, with a connector on its free end.' },
    { term: 'Active alignment', def: 'Positioning two parts while measuring the coupled power, and fixing them (by welding or epoxy) at the maximum.' }
  ],
  formulas: [
    {
      name: 'Focused spot radius',
      expr: 'w0 = M2*lambda*f/(pi*w)', tex: 'w_0 = \\frac{M^2\\lambda f}{\\pi w}',
      vars: {
        w0: { name: 'radius of the focused spot (1/e²)', q: 'length', unit: 'µm', tex: 'w_0' },
        M2: { name: 'beam quality M²', value: 1.1, min: 1, max: 10, tex: 'M^2' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 1550, tex: '\\lambda' },
        f: { name: 'focal length of the lens', q: 'length', unit: 'mm', value: 11 },
        w: { name: 'radius of the beam at the lens (1/e²)', q: 'length', unit: 'mm', value: 1 }
      },
      note: 'Valid when the beam fills a small part of the lens. To match a fibre, set w₀ equal to its mode-field radius.',
      stories: { w0: 'A beam of radius {w} and M² = {M2} at {lambda} is focused by a lens of {f}. What is the radius of the focus?', f: 'A beam of radius {w} at {lambda} (M² = {M2}) is to be focused to a spot of radius {w0}. What focal length is needed?' }
    },
    {
      name: 'Efficiency of two Gaussian modes of different size',
      expr: 'eta = (2*w1*w2/(w1^2 + w2^2))^2', tex: '\\eta = \\left(\\frac{2w_1w_2}{w_1^2 + w_2^2}\\right)^2',
      vars: {
        eta: { name: 'coupling efficiency', q: 'ratio', unit: '%', tex: '\\eta' },
        w1: { name: 'radius of the focused spot', q: 'length', unit: 'µm', value: 6 },
        w2: { name: 'mode-field radius of the fibre', q: 'length', unit: 'µm', value: 5.2 }
      },
      note: 'Waists in the same plane, well aligned; the efficiency depends only on the ratio of the radii.',
      stories: { eta: 'A spot of radius {w1} meets a fibre mode of radius {w2}. What is the coupling efficiency?' }
    },
    {
      name: 'Lateral offset',
      expr: 'eta = exp(-(d/w)^2)', tex: '\\eta = \\exp\\!\\left[-\\left(\\frac{d}{w}\\right)^2\\right]',
      vars: {
        eta: { name: 'coupling efficiency', q: 'ratio', unit: '%', tex: '\\eta' },
        d: { name: 'lateral offset', q: 'length', unit: 'µm', value: 1 },
        w: { name: 'mode-field radius (of both)', q: 'length', unit: 'µm', value: 5.2 }
      },
      note: 'Equal Gaussian modes. 1 dB is lost when d = 0.48 w.',
      stories: { eta: 'A spot of radius {w} matching the fibre mode is {d} off the core. How much light is coupled?', d: 'How far off may a spot of radius {w} be if the coupling must stay above {eta}?' }
    },
    {
      name: 'Axial (defocus) error',
      expr: 'eta = 1/(1 + (dz*lambda/(2*pi*w^2))^2)', tex: '\\eta = \\frac{1}{1 + \\left(\\dfrac{\\Delta z\\,\\lambda}{2\\pi w^2}\\right)^2}',
      vars: {
        eta: { name: 'coupling efficiency', q: 'ratio', unit: '%', tex: '\\eta' },
        dz: { name: 'distance of the fibre end from the waist', q: 'length', unit: 'µm', value: 50, tex: '\\Delta z' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 1550, tex: '\\lambda' },
        w: { name: 'waist radius (the same for beam and mode)', q: 'length', unit: 'µm', value: 5.2 }
      },
      note: 'Equal waists, aligned axes.',
      stories: { eta: 'A fibre end of mode radius {w} sits {dz} away from the waist of a matching beam at {lambda}. What is the efficiency?' }
    },
    {
      name: 'Tilt',
      expr: 'eta = exp(-(pi*w*theta/lambda)^2)', tex: '\\eta = \\exp\\!\\left[-\\left(\\frac{\\pi w\\,\\theta}{\\lambda}\\right)^2\\right]',
      vars: {
        eta: { name: 'coupling efficiency', q: 'ratio', unit: '%', tex: '\\eta' },
        w: { name: 'waist radius (the same for beam and mode)', q: 'length', unit: 'µm', value: 5.2 },
        theta: { name: 'angle between the beam and the fibre axis (in air)', q: 'angle', unit: '°', value: 1, min: 0, max: 10, tex: '\\theta' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 1550, tex: '\\lambda' }
      },
      note: 'Equal waists at the same point.',
      stories: { eta: 'A beam of waist {w} at {lambda} arrives {theta} off the fibre axis. How much is coupled?' }
    }
  ],
  examples: [
    {
      title: 'Which lens?',
      q: 'A collimated beam of 3 mm diameter ($M^2 = 1.05$, 1550 nm) is to be coupled into a single-mode fibre of mode-field diameter 10.4 µm. What focal length is needed, and does the cone fit the fibre\'s acceptance angle of 7°?',
      steps: [
        { text: 'The beam radius is $w = 1.5$ mm and the fibre mode radius is $w_f = 5.2$ µm. Solving the focusing formula for $f$:', tex: 'f = \\frac{\\pi w\\,w_f}{M^2\\lambda} = \\frac{\\pi \\times 1.5\\ \\mathrm{mm} \\times 5.2\\ \\mu\\mathrm{m}}{1.05 \\times 1.55\\ \\mu\\mathrm{m}} = 15.1\\ \\mathrm{mm}' },
        { text: 'The cone of the focused beam:', tex: '\\tan\\theta = \\frac{w}{f} = \\frac{1.5}{15.1}\\quad\\Rightarrow\\quad \\theta = 5.7°' }
      ],
      a: 'A lens of about 15 mm focal length. Its cone, 5.7°, is inside the 7° acceptance angle.'
    },
    {
      title: 'How good must the alignment be?',
      q: 'A well matched beam is focused on a single-mode fibre with $w = 5.2$ µm. What lateral offset costs 0.5 dB?',
      steps: [
        { text: '0.5 dB is a fraction $\\eta = 10^{-0.05} = 0.891$. Solving $\\eta = \\exp[-(d/w)^2]$:', tex: 'd = w\\sqrt{-\\ln\\eta} = 5.2\\ \\mu\\mathrm{m} \\times \\sqrt{0.1151} = 1.76\\ \\mu\\mathrm{m}' }
      ],
      a: 'Under 2 µm. That is why single-mode coupling is done on stages with sub-micrometre resolution.'
    }
  ],
  quiz: [
    { q: 'A beam of 2 mm diameter at 1550 nm is focused by a lens of 11 mm focal length ($M^2 = 1$). What is the radius of the focus, in micrometres?', answer: 5.43, unit: 'µm', why: '$w_0 = \\lambda f/(\\pi w) = 1.55 \\times 11/(\\pi \\times 1) = 5.4$ µm (taking $\\lambda = 1.55$ µm, $f = 11$ mm, $w = 1$ mm).' },
    { q: 'Which alignment error is the tightest for a single-mode fibre?', choices: ['Lateral offset, a few micrometres', 'Axial position, a few micrometres', 'Tilt, a fraction of a degree', 'Rotation about the axis'], a: 0, why: 'About 2.5 µm costs 1 dB, against some 50 µm axially and a few degrees of tilt. Rotation does not matter for a round, non-polarizing fibre.' },
    { q: 'A bigger lens always couples more light into a fibre.', a: false, why: 'Coupling depends on matching the focused spot to the mode (or core) and the cone to the acceptance angle, not on the size of the lens.' },
    { q: 'Why can a 300 µm LED chip never put more than a few per cent of its light into a 50 µm core?', choices: ['The étendue of the source is much larger than the fibre\'s', 'LEDs are too dim', 'The core is too short', 'Silica absorbs LED light'], a: 0, why: 'Étendue (area × solid angle) cannot be reduced by a passive lens. The core area is 1/36 of the chip\'s, so at most about 2.8 % can enter.' },
    { q: 'A focused spot has twice the radius of the fibre\'s mode field. What fraction is coupled, at best?', choices: ['64 %', '90 %', '25 %', '100 %'], a: 0, why: '$\\eta = [2 \\times 2/(2^2 + 1)]^2 = 0.8^2 = 0.64$, a loss of 1.9 dB.' }
  ],
  applications: [
    'Laser modules for telecom: a diode, a lens and a fibre stub welded in alignment to a few tenths of a micrometre.',
    'Fibre collimators and launchers in laboratories, interferometers and fibre-fed spectrometers.',
    'Delivering laser light to a microscope, a cutting head or a probe through a fibre.',
    'Coupling LEDs and lamps into plastic fibre and light guides, where the large core and NA make it forgiving.',
    'Fibre-optic test: power meters and light sources that couple into every connector type.'
  ],
  sources: [
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, ch. 3 (Beam optics) and ch. 9 — Gaussian beams and the fibre mode.',
    'W. B. Joyce and B. C. DeLoach, "Alignment of Gaussian beams", *Applied Optics* 23 (1984) 4187 — the coupling of Gaussian beams with offset, tilt and mismatch.',
    'D. Marcuse, "Loss analysis of single-mode fiber splices", *Bell System Technical Journal* 56 (1977) 703.',
    'A. E. Siegman, *Lasers*, the chapters on Gaussian beams — the beam parameters and M².'
  ],
  sim: 'fo-coupling'
},

/* ================================================================ 8 */
{
  id: 'fibre-bundles-and-image-guides', parent: 'fibre-optics', title: 'Fibre bundles and image guides', level: 1,
  short: 'Thousands of fibres side by side make a bundle. If the fibres end in random places the bundle carries only light (a light guide); if each keeps its neighbours it carries an image, one fibre per pixel (a coherent bundle, or image guide). The fibre pitch sets the resolution, and the cladding makes the honeycomb pattern.',
  keywords: ['fibre bundle', 'image guide', 'coherent bundle', 'incoherent bundle', 'light guide', 'fibrescope', 'borescope', 'endoscope', 'faceplate', 'fibre taper', 'honeycomb', 'packing fraction', 'broken fibres', 'cold light', 'imaging bundle', 'fibre pitch'],
  prereq: ['how-an-optical-fibre-guides-light', 'fibre-numerical-aperture', 'nyquist-sampling-and-aliasing'],
  related: ['fibre-optic-light-guides', 'ferrules-and-light-guide-couplings', 'periscopes-and-endoscopes', 'medical-imaging-optics', 'resolution-and-contrast', 'spatial-frequency-and-line-pairs'],
  body: `
A single fibre carries a point of light. Put thousands side by side and the bundle carries either **light** or an **image**, depending on how the fibres are arranged.

### Incoherent and coherent bundles
In an **incoherent** bundle the fibres lie in any order: a fibre on the left at the input may end at the right of the output. No picture survives, but all of the light does. That is a *light guide*, which carries "cold light" from a lamp to a microscope, a ring light or an [[periscopes-and-endoscopes|endoscope]] ([[fibre-optic-light-guides]]).

In a **coherent** bundle each fibre keeps its neighbours: the fibre at position $(x, y)$ at the input ends at the same relative place at the output. Each fibre carries the brightness and colour of one small patch of the scene: **one fibre, one pixel**. A lens images the scene on the input end, and the output is viewed by eye or imaged on a camera.

### How good is the picture?
If the fibre pitch (the distance between cores) is $p$ and the bundle diameter $D$, a hexagonal packing holds

$$N \\approx 0.9069\\left(\\frac{D}{p}\\right)^2$$

fibres. A 1 mm bundle of 10 000 fibres therefore has $p = 9.5$ µm and about 105 pixels across. By the sampling limit ([[nyquist-sampling-and-aliasing]]) it cannot resolve more than $1/(2p) = 52$ line pairs per millimetre. The cores are round and the cladding between them is dark, so the picture is a **honeycomb** of bright dots; the fraction of the area that carries light is $\\varphi = 0.9069\\,(d/p)^2$ for cores of diameter $d$, about 64 % when $d/p$ = 0.84. The cladding between cores cannot be thinned below about a wavelength, or light crosses over from one core to its neighbour and blurs the picture.

| Bundle | Fibres | Fibre size | Diameter |
|---|---|---|---|
| Medical or industrial image guide | 3 000 to 100 000 | 2 to 10 µm | 0.2 to 3 mm |
| Light guide, incoherent | hundreds to thousands | 30 to 70 µm | 3 to 8 mm |
| Fused fibre faceplate | millions | 3 to 6 µm | 10 to 50 mm |

### What goes wrong
A **broken fibre** is a black dot that never goes away. Bending below the minimum radius breaks fibres and loses light. A bundle transmits less than a single fibre: a glass light guide passes about 60 % of the light per metre, because of the cladding area, the end losses and the absorption of the glass. The honeycomb can interfere with a camera's own pixel grid, which gives moiré, and software filters it.

### Solid bundles
A **faceplate** is a plate of fibres fused into a solid block, a window that moves an image from its front face to its rear face with no lens. It couples the phosphor screen of an image intensifier to a sensor. A **taper** is a faceplate drawn thinner at one end to magnify or reduce the image.

> [!key] A bundle carries light if its fibres are in random order and an image if each fibre keeps its neighbours. In a coherent bundle every fibre is one pixel: the pitch $p$ sets the resolution ($1/2p$) and the cladding makes the honeycomb.
`,
  ideas: [
    'An incoherent bundle carries only light; a coherent bundle carries an image, one fibre per pixel.',
    'In a hexagonal bundle of diameter D and pitch p the number of fibres is about 0.9069 (D/p)².',
    'The fibre pitch sets the resolution: at best 1/(2p) line pairs per unit length.',
    'The cladding between cores makes the honeycomb pattern; broken fibres are permanent black dots.',
    'Fused faceplates and tapers are solid coherent bundles that carry an image from one face to another.'
  ],
  pitfalls: [
    'A bundle of fibres carries an image just because it carries light — Only if the fibres keep the same order at both ends. A randomly packed bundle carries all of the light and none of the picture.',
    'The image from a bundle is as sharp as the lens that forms it — The resolution is limited by the fibre pitch: the bundle samples the image with one value per fibre.',
    'More fibres always means a better image — Only if they are in the same diameter. Packing more fibres into a thinner bundle means thinner cores and cladding, which loses light and risks crosstalk.',
    'A bundle transmits as much as a single fibre of the same length — Light that falls on the cladding, the gaps and the cores that are broken is lost: about 60 % per metre for a glass light guide.'
  ],
  terms: [
    { term: 'Coherent bundle', also: ['image guide', 'imaging bundle', 'ordered bundle'], def: 'A bundle in which the fibres end in the same relative positions at both ends, so that an image focused on one end appears on the other. One fibre carries one pixel.' },
    { term: 'Incoherent bundle', also: ['light guide', 'random bundle'], def: 'A bundle whose fibres are in random order, carrying light but no image. Used for illumination.' },
    { term: 'Fibre pitch', def: 'The distance between the centres of neighbouring fibres in a bundle, 2 to 10 µm in image guides. It sets the resolution.' },
    { term: 'Packing fraction', also: ['fill factor'], def: 'The fraction of the end face of a bundle that is core and carries light: 0.9069 (d/p)² for hexagonally packed cores of diameter d and pitch p.' },
    { term: 'Honeycomb pattern', also: ['chicken-wire pattern'], def: 'The regular mesh of dark cladding seen between the bright cores in an image from a fibre bundle.' },
    { term: 'Faceplate', also: ['fibre-optic plate', 'fused bundle', 'taper'], def: 'A solid plate of fused fibres that carries an image from its front to its rear face without a lens; a taper does so with magnification.' }
  ],
  formulas: [
    {
      name: 'Number of fibres in a bundle',
      expr: 'N = 0.9069*(D/p)^2', tex: 'N \\approx 0.9069\\left(\\frac{D}{p}\\right)^2',
      vars: {
        N: { name: 'number of fibres', q: 'count' },
        D: { name: 'diameter of the bundle', q: 'length', unit: 'mm', value: 1 },
        p: { name: 'fibre pitch', q: 'length', unit: 'µm', value: 9.5 }
      },
      note: 'Hexagonal close packing in a round bundle.',
      stories: { N: 'A round bundle {D} across has a fibre pitch of {p}. About how many fibres does it hold?', p: 'A bundle {D} across holds {N} fibres. What is the pitch?' }
    },
    {
      name: 'Packing fraction',
      expr: 'phi = 0.9069*(d/p)^2', tex: '\\varphi = 0.9069\\left(\\frac{d}{p}\\right)^2',
      vars: {
        phi: { name: 'fraction of the end face that is core', q: 'ratio', unit: '%', tex: '\\varphi' },
        d: { name: 'core diameter', q: 'length', unit: 'µm', value: 8 },
        p: { name: 'fibre pitch', q: 'length', unit: 'µm', value: 9.5 }
      },
      note: 'Round cores on a hexagonal lattice; the best possible is 90.7 % when cores touch.',
      stories: { phi: 'Cores of {d} sit on a pitch of {p}. What fraction of the end face carries light?' }
    },
    {
      name: 'Resolution limit',
      expr: 'nu = 1/(2*p)', tex: '\\nu_{\\max} = \\frac{1}{2p}',
      vars: {
        nu: { name: 'highest resolvable spatial frequency', q: 'spatialfreq', unit: 'lp/mm', tex: '\\nu_{\\max}' },
        p: { name: 'fibre pitch', q: 'length', unit: 'µm', value: 9.5 }
      },
      note: 'The Nyquist limit of the sampling by fibres; in practice somewhat lower.',
      stories: { nu: 'An image guide has a fibre pitch of {p}. What is the finest pattern it can resolve?' }
    }
  ],
  examples: [
    {
      title: 'A fibrescope with 10 000 fibres',
      q: 'An image guide of diameter 1 mm contains 10 000 fibres. What is the pitch, how many pixels span the picture, and what resolution does it allow?',
      steps: [
        { text: 'Solve $N = 0.9069\\,(D/p)^2$ for the pitch:', tex: 'p = D\\sqrt{\\frac{0.9069}{N}} = 1000\\ \\mu\\mathrm{m} \\times \\sqrt{9.07 \\times 10^{-5}} = 9.5\\ \\mu\\mathrm{m}' },
        'The picture spans $D/p = 105$ pixels across.',
        { text: 'The sampling limit:', tex: '\\nu_{\\max} = \\frac{1}{2 \\times 9.5\\ \\mu\\mathrm{m}} = 52\\ \\mathrm{lp/mm}' }
      ],
      a: 'A pitch of 9.5 µm, about 105 pixels across, and at most 52 lp/mm in the bundle: a coarse picture, which a lens can only enlarge.'
    },
    {
      title: 'How much of the end face carries light?',
      q: 'The cores of that bundle are 8 µm across on a 9.5 µm pitch. What fraction of the face is core?',
      steps: [
        { tex: '\\varphi = 0.9069\\left(\\frac{8}{9.5}\\right)^2 = 0.643' }
      ],
      a: '64 %. The remaining 36 % is cladding and gaps, and appears as the dark honeycomb between the bright spots.'
    }
  ],
  quiz: [
    { q: 'What makes a fibre bundle carry an image rather than just light?', choices: ['Each fibre ends in the same relative position at both ends', 'The fibres are thinner', 'The fibres are made of plastic', 'A lens is fitted to each end'], a: 0, why: 'In a coherent bundle every fibre carries one pixel to the same relative place. A randomly ordered bundle of the same fibres carries only the total light.' },
    { q: 'A round bundle 2 mm across has fibres on a pitch of 10 µm. About how many fibres does it hold?', answer: 36300, why: '$N = 0.9069\\,(2000/10)^2 = 0.9069 \\times 40000 = 36\\,300$.' },
    { q: 'The honeycomb pattern in the picture from a bundle comes from…', choices: ['The cladding between the cores, which carries no image light', 'A fault in the camera', 'Diffraction by the lens', 'The light source'], a: 0, why: 'Light enters and leaves only through the cores. The gaps between them are dark.' },
    { q: 'A fibre in a coherent bundle breaks. What does the viewer see?', choices: ['A permanent dark dot in the picture', 'The picture fades over its whole area', 'Nothing, since neighbouring fibres take over', 'The dot moves'], a: 0, why: 'Each fibre carries only its own pixel, so a break leaves a black point that stays.' },
    { q: 'An image guide with a fibre pitch of 5 µm can resolve at most what spatial frequency, in lp/mm?', answer: 100, unit: 'lp/mm', why: '$\\nu = 1/(2p) = 1/(10\\ \\mu\\mathrm{m}) = 100$ lp/mm: one line pair needs two fibres.' }
  ],
  applications: [
    'Medical fibrescopes (flexible bronchoscopes, cystoscopes) and industrial borescopes that look into engines, pipes and machines.',
    'Illumination: light guides for microscopes, endoscopes, ring lights and dental lamps.',
    'Fibre-optic faceplates and tapers, joining the screen of an image intensifier or an X-ray scintillator to a sensor.',
    'Endomicroscopy, where a bundle of thousands of fibres carries a microscope image from the tip of a probe.',
    'Reading a scene in places where electronics cannot go: strong magnetic fields, high temperature, flammable atmospheres.'
  ],
  history: 'The first image-carrying bundles of glass fibre were made in the early 1950s by Abraham van Heel in Delft and by Harold Hopkins and Narinder Kapany in London. Van Heel\'s idea of coating each fibre with glass of lower index, a cladding, stopped the crosstalk between neighbours and made the bundles practical. Basil Hirschowitz at the University of Michigan used a flexible bundle in a gastroscope in 1957, which made flexible endoscopy possible.',
  sources: [
    'E. Hecht, *Optics*, the section on optical fibres — the coherent and incoherent bundles.',
    'N. S. Kapany, *Fiber Optics: Principles and Applications* (Academic Press, 1967) — image transfer by fibre bundles.',
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, ch. 9 — guided waves and the coupling between cores.'
  ],
  sim: 'fo-bundle'
},

/* ================================================================ 9 */
{
  id: 'fibre-optic-links', parent: 'fibre-optics', title: 'A fibre-optic link', level: 2,
  short: 'A fibre link is a transmitter, a fibre with its connectors, splices and amplifiers, and a receiver. It works when the power that arrives, the launch power less every loss in decibels, exceeds the receiver\'s sensitivity by a margin. Many wavelengths in one fibre multiply the capacity.',
  keywords: ['fibre-optic link', 'optical link', 'link budget', 'loss budget', 'power budget', 'dBm', 'receiver sensitivity', 'margin', 'transmitter', 'receiver', 'WDM', 'CWDM', 'DWDM', 'EDFA', 'optical amplifier', 'PON', 'splitter', 'reach', 'transceiver', '10GBASE-LR'],
  prereq: ['fibre-attenuation-and-windows', 'fibre-dispersion-and-bandwidth', 'fibre-connectors-and-ferrules'],
  related: ['the-fibre-internet-link', 'diode-lasers', 'vcsels-and-laser-arrays', 'electronics:photodiodes', 'electronics:optoelectronics', 'fibre-lasers', 'single-mode-and-multimode-fibre'],
  body: `
A fibre-optic link is a chain: a **transmitter** turns bits into light, a **fibre** with its connectors and splices carries it, a **receiver** turns it back into bits. Whether it works comes down to a sum in decibels: what leaves, minus what is lost on the way, against what the receiver needs.

### The loss budget
Optical power is quoted in **dBm**, decibels relative to 1 mW: 0 dBm is 1 mW, −10 dBm is 100 µW, −30 dBm is 1 µW, +3 dBm is 2 mW. With a launch power $P_{tx}$ and the losses added in dB, the margin is

$$M = P_{tx} - S - n_c\\ell_c - n_s\\ell_s - \\alpha L$$

with $S$ the receiver sensitivity (the least power that gives the required error rate), $n_c$ connectors of loss $\\ell_c$ (0.3 to 0.5 dB each), $n_s$ splices of loss $\\ell_s$ (0.05 to 0.1 dB fused, about 0.3 dB mechanical), and the fibre $\\alpha L$. A positive margin of 3 dB or more is kept for ageing, repairs, temperature and dirty connectors.

### Transmitters and receivers
| Part | Typical | Window |
|---|---|---|
| LED or VCSEL, multimode | −10 to 0 dBm | 850 nm |
| Fabry–Perot or DFB laser | 0 to +10 dBm | 1310, 1550 nm |
| PIN photodiode receiver | about −14 dBm at 10 Gbit/s | |
| Avalanche photodiode receiver | −24 to −28 dBm or better | |

Too much power overloads a receiver too, so short links use attenuators. Dispersion ([[fibre-dispersion-and-bandwidth]]) sets a second limit besides loss.

### How far?
| Link | Wavelength | Fibre | Typical reach |
|---|---|---|---|
| 10 Gbit/s short reach | 850 nm | OM3, OM4 | 300 m, 400 m |
| 10 Gbit/s long reach | 1310 nm | single-mode | 10 km |
| 10 Gbit/s extended reach | 1550 nm | single-mode | 40 km |
| Amplified, long haul | 1550 nm | single-mode | thousands of km |

**Erbium-doped fibre amplifiers** amplify the whole C band (1530–1565 nm) by 20 to 30 dB with no conversion to electrons, so one can sit every 50 to 100 km.

### Many colours in one fibre
**Wavelength-division multiplexing** sends several signals at different wavelengths. CWDM uses 18 channels 20 nm apart (1271 to 1611 nm). DWDM puts channels on a frequency grid of 100 GHz (0.8 nm at 1550 nm) or 50 GHz (0.4 nm): about 44 or 88 channels in the C band, a fibre of 96 × 100 Gbit/s carrying about 10 Tbit/s. A **passive optical network** ([[the-fibre-internet-link]]) uses 1490 nm downstream and 1310 nm upstream on one fibre to the home, with a splitter of 1:32 (about 17 dB) in the street; a class B+ budget is 28 dB.

> [!warn] Transmitters and optical amplifiers emit invisible infrared light, up to +20 dBm (100 mW) or more. Never look into a fibre or connector, and never use an inspection microscope on one that is live ([[laser-safety-classes]]).

> [!key] The margin of a link is launch power minus sensitivity minus the sum of all losses in dB; keep it above about 3 dB. Amplifiers extend the reach, and many wavelengths on one fibre multiply its capacity.
`,
  ideas: [
    'A link works when launch power minus all losses (in dB) exceeds the receiver sensitivity by a margin of 3 dB or more.',
    'dBm is decibels relative to 1 mW: 0 dBm = 1 mW, −30 dBm = 1 µW; losses in dB add.',
    'Typical losses: fibre 0.2–0.35 dB/km (single-mode), connector 0.3–0.5 dB, fusion splice 0.05–0.1 dB.',
    'Erbium amplifiers boost the C band by 20–30 dB every 50–100 km, with no electronic conversion.',
    'WDM puts many wavelengths in one fibre: CWDM 18 channels 20 nm apart, DWDM 100 or 50 GHz apart.'
  ],
  pitfalls: [
    'If the received power is above the sensitivity, the link works — It must be above it by the margin, and below the receiver\'s overload level. Dirty connectors and repairs eat the margin over the years.',
    'A negative number of dBm means no light — It means less than 1 mW. A receiver at −20 dBm still sees 10 µW, which is plenty.',
    'Losses in dB can be multiplied — They add. Percentages multiply; decibels, being logarithms, add: 3 dB + 3 dB = 6 dB, a factor of 4.',
    'More wavelengths always fit in the same fibre — Each channel needs spacing for its modulation bandwidth and the filters; the amplifier band (C and L) limits how many.'
  ],
  terms: [
    { term: 'dBm', def: 'Power in decibels relative to 1 mW: P(dBm) = 10 log₁₀(P/1 mW). 0 dBm = 1 mW, −30 dBm = 1 µW.' },
    { term: 'Link budget', also: ['loss budget', 'power budget'], def: 'The sum, in dB, of all the losses between transmitter and receiver, compared with the power available (launch power minus receiver sensitivity).' },
    { term: 'Receiver sensitivity', also: ['S', 'minimum received power'], def: 'The least optical power at the receiver that gives the required bit-error rate. Typically −14 to −28 dBm.' },
    { term: 'Margin', also: ['link margin', 'safety margin'], def: 'The power left over once the budget has been spent, in dB. Kept at 3 dB or more for ageing and repairs.' },
    { term: 'Wavelength-division multiplexing', also: ['WDM', 'CWDM', 'DWDM'], def: 'Sending several signals at different wavelengths along one fibre. CWDM channels are 20 nm apart; DWDM channels are 100 or 50 GHz apart.' },
    { term: 'Optical amplifier', also: ['EDFA', 'erbium-doped fibre amplifier'], def: 'A length of erbium-doped fibre, pumped by a laser, that amplifies light between 1530 and 1565 nm (C band) by 20 to 30 dB with no conversion to electricity.' },
    { term: 'Passive optical network', also: ['PON', 'GPON', 'FTTH'], def: 'A fibre network with no powered parts between the exchange and the homes: one fibre is split by passive splitters, and each home gets its own wavelength slot in time.' }
  ],
  formulas: [
    {
      name: 'Margin of a link',
      expr: 'M = Ptx - S - nc*lc - ns*ls - alpha*L', tex: 'M = P_{tx} - S - n_c\\ell_c - n_s\\ell_s - \\alpha L',
      vars: {
        M: { name: 'link margin', q: false, unit: 'dB', signed: true },
        Ptx: { name: 'launch power', q: false, unit: 'dBm', value: 0, signed: true, tex: 'P_{tx}' },
        S: { name: 'receiver sensitivity', q: false, unit: 'dBm', value: -28, signed: true },
        nc: { name: 'number of connector pairs', q: 'count', value: 2, tex: 'n_c' },
        lc: { name: 'loss of one connector pair', q: false, unit: 'dB', value: 0.3, tex: '\\ell_c' },
        ns: { name: 'number of splices', q: 'count', value: 4, tex: 'n_s' },
        ls: { name: 'loss of one splice', q: false, unit: 'dB', value: 0.1, tex: '\\ell_s' },
        alpha: { name: 'fibre attenuation', q: false, unit: 'dB/km', value: 0.35, tex: '\\alpha' },
        L: { name: 'length of the link', q: false, unit: 'km', value: 20 }
      },
      note: 'All in dB and dBm. The link works when the margin is above about 3 dB.',
      stories: { M: 'A transmitter launches {Ptx} into a link whose receiver needs {S}. The link has {nc} connector pairs, {ns} splices, and {L} of fibre. What is the margin?', L: 'A transmitter launches {Ptx}, the receiver needs {S}, and the margin must be {M}. With {nc} connector pairs and {ns} splices, how long can the fibre be?' }
    },
    {
      name: 'dBm and milliwatts',
      expr: 'P = 10^(Pd/10)', tex: 'P = 10^{P_{\\mathrm{dBm}}/10}',
      vars: {
        P: { name: 'power', q: false, unit: 'mW' },
        Pd: { name: 'power in dBm', q: false, unit: 'dBm', value: -10, signed: true, tex: 'P_{\\mathrm{dBm}}' }
      },
      note: '0 dBm = 1 mW; every 10 dB is a factor of 10.',
      stories: { P: 'A signal arrives at {Pd}. How many milliwatts is that?', Pd: 'A transmitter emits {P}. What is that in dBm?' }
    },
    {
      name: 'Loss of a 1:N splitter',
      expr: 'Ls = 10*log(N) + ex', tex: 'L_s = 10\\log_{10}N + e_x',
      vars: {
        Ls: { name: 'loss of the splitter', q: false, unit: 'dB', tex: 'L_s' },
        N: { name: 'number of outputs', q: 'count', value: 32 },
        ex: { name: 'excess loss', q: false, unit: 'dB', value: 1.5, tex: 'e_x' }
      },
      note: 'The ideal split is 3 dB per doubling; real splitters add an excess loss of 0.5 to 2 dB.',
      stories: { Ls: 'A passive splitter divides the light among {N} outputs with an excess loss of {ex}. What is its loss?' }
    },
    {
      name: 'Channel spacing',
      expr: 'dl = lambda^2*df/c', tex: '\\Delta\\lambda = \\frac{\\lambda^2\\,\\Delta f}{c}',
      vars: {
        dl: { name: 'spacing in wavelength', q: 'length', unit: 'nm', tex: '\\Delta\\lambda' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 1550, tex: '\\lambda' },
        df: { name: 'spacing in frequency', q: 'frequency', unit: 'GHz', value: 100, tex: '\\Delta f' },
        c: { const: 'c' }
      },
      note: '100 GHz is 0.8 nm and 50 GHz is 0.4 nm at 1550 nm.',
      stories: { dl: 'Channels of a DWDM system are {df} apart in frequency at {lambda}. What is the spacing in wavelength?' }
    },
    {
      name: 'Capacity of a WDM fibre',
      expr: 'C = Nch*B', tex: 'C = N_{\\mathrm{ch}}\\,B',
      vars: {
        C: { name: 'capacity of the fibre', q: false, unit: 'Gbit/s' },
        Nch: { name: 'number of wavelength channels', q: 'count', value: 96, tex: 'N_{\\mathrm{ch}}' },
        B: { name: 'bit rate of each channel', q: false, unit: 'Gbit/s', value: 100 }
      },
      note: 'Per fibre and per direction.',
      stories: { C: 'A DWDM system carries {Nch} channels of {B} each. What is the capacity of the fibre?' }
    }
  ],
  examples: [
    {
      title: 'A 20 km link at 1310 nm',
      q: 'A transceiver launches 0 dBm into 20 km of single-mode fibre at 1310 nm (0.35 dB/km). There are two connector pairs (0.3 dB each) and four fusion splices (0.1 dB each). The receiver needs −28 dBm. What are the received power and the margin?',
      steps: [
        { text: 'The losses:', tex: '0.35 \\times 20 = 7.0\\ \\mathrm{dB},\\quad 2 \\times 0.3 = 0.6\\ \\mathrm{dB},\\quad 4 \\times 0.1 = 0.4\\ \\mathrm{dB}\\quad\\Rightarrow\\quad 8.0\\ \\mathrm{dB}' },
        { text: 'The received power and the margin:', tex: 'P_{rx} = 0 - 8.0 = -8.0\\ \\mathrm{dBm},\\qquad M = -8.0 - (-28) = 20\\ \\mathrm{dB}' }
      ],
      a: '−8 dBm arrives, a margin of 20 dB. The link is comfortable; at 20 dB spare it could be 50 km longer, if dispersion allowed it, or a 1:32 splitter could be added.'
    },
    {
      title: 'The reach of a passive optical network',
      q: 'A PON has a class B+ budget of 28 dB. A 1:32 splitter costs 17 dB, connectors and splices 1 dB, and 3 dB is kept as margin. How long can the fibre be at 0.35 dB/km?',
      steps: [
        { text: 'What is left for the fibre:', tex: '28 - 17 - 1 - 3 = 7\\ \\mathrm{dB}' },
        { text: 'The length:', tex: 'L = \\frac{7\\ \\mathrm{dB}}{0.35\\ \\mathrm{dB/km}} = 20\\ \\mathrm{km}' }
      ],
      a: '20 km, which is the usual reach of a PON. A bigger split (1:64, about 20 dB) costs 3 dB, about 9 km of fibre.'
    }
  ],
  quiz: [
    { q: 'A transmitter emits 2 mW. What is its power in dBm?', answer: 3.01, unit: 'dBm', why: '$10\\log_{10}(2/1) = 3.01$ dBm. Every doubling adds about 3 dB.' },
    { q: 'A receiver needs −28 dBm and −24 dBm arrives. What is the margin?', choices: ['4 dB', '−4 dB', '52 dB', '24 dB'], a: 0, why: 'The margin is the received power minus the sensitivity: −24 − (−28) = 4 dB. It is positive, so the link works, with a margin a little above the usual 3 dB.' },
    { q: 'Two connectors of 0.3 dB and a fibre of 5 dB are in a link. The total loss is the product of their transmissions.', a: false, why: 'Transmissions multiply, but losses in dB add: 0.3 + 0.3 + 5 = 5.6 dB. (The product of the transmissions is 10^(−0.56), the same thing.)' },
    { q: 'DWDM channels are 100 GHz apart at 1550 nm. What is that spacing in nanometres?', answer: 0.8, unit: 'nm', why: '$\\Delta\\lambda = \\lambda^2\\Delta f/c = (1.55\\times10^{-6})^2 \\times 10^{11}/(3\\times10^{8}) = 0.8$ nm.' },
    { q: 'Why can one erbium amplifier handle dozens of wavelengths at once?', choices: ['It amplifies the whole C band, not a single wavelength, and works on the light itself', 'It converts each wavelength to a separate electrical signal', 'It narrows each pulse', 'It splits the wavelengths into separate fibres'], a: 0, why: 'The erbium gain is broad (1530–1565 nm) and applies to all the light in it, with no conversion to electrons. That is what made dense WDM economical.' }
  ],
  applications: [
    'Long-haul and submarine cables: single-mode fibre with amplifiers every 50 to 100 km and tens of wavelengths.',
    'Data centres and buildings: multimode fibre with 850 nm VCSELs to a few hundred metres, single-mode for longer runs.',
    'Fibre to the home: passive optical networks with 1490 nm downstream and 1310 nm upstream.',
    'Cable television and radio-over-fibre: analog links with low-reflection APC connectors.',
    'Industrial and aircraft networks, where fibre is lighter than copper and immune to electrical interference.'
  ],
  history: 'The first commercial fibre systems of the late 1970s used 850 nm multimode fibre and carried tens of megabits per second a few kilometres. Single-mode fibre at 1310 nm took over in the 1980s; TAT-8, in 1988, was the first transatlantic fibre cable. The erbium-doped fibre amplifier, demonstrated in 1987, and wavelength-division multiplexing in the 1990s multiplied the capacity of each fibre by orders of magnitude.',
  sources: [
    'G. P. Agrawal, *Fiber-Optic Communication Systems*, ch. 5 (Lightwave systems) — power budgets and receiver sensitivity.',
    'G. Keiser, *Optical Fiber Communications*, the chapters on optical links and WDM — link budgets, multiplexing and amplifiers.',
    'ITU-T Recommendations G.694.1 (DWDM frequency grid) and G.694.2 (CWDM wavelength grid), and IEEE 802.3 (Ethernet over fibre).'
  ],
  sim: 'fo-budget'
},

/* ================================================================ 10 */
{
  id: 'fibre-sensors-and-bragg-gratings', parent: 'fibre-optics', title: 'Fibre sensors and Bragg gratings', level: 3,
  short: 'Stretch, heat, bend or rotate a fibre and the light in it changes. A fibre Bragg grating reflects one wavelength, λ_B = 2nΛ, which shifts with strain (1.2 pm per microstrain) and temperature (about 12 pm/K): many gratings on one fibre are many sensors. Backscatter turns the whole fibre into a distributed sensor, and a coil of fibre senses rotation.',
  keywords: ['fibre sensor', 'fibre Bragg grating', 'FBG', 'Bragg wavelength', 'strain sensor', 'temperature sensor', 'distributed sensing', 'OTDR', 'Brillouin', 'Raman', 'fibre-optic gyroscope', 'Sagnac', 'interrogator', 'structural health monitoring', 'photoelastic', 'phase mask', 'λB = 2nΛ'],
  prereq: ['fibre-attenuation-and-windows', 'single-mode-and-multimode-fibre', 'the-grating-equation'],
  related: ['mach-zehnder-and-sagnac', 'michelson-interferometer', 'fabry-perot-interferometer', 'fibre-optic-links', 'interferometers-in-precision-engineering', 'optical-coherence-tomography', 'fibre-lasers'],
  body: `
Light in a fibre feels what happens to the fibre. Stretch it, heat it, bend it, rotate it, and the power, phase, polarization or wavelength of the light changes. Measure the change and the fibre is a sensor: immune to electrical interference, needing no electricity at the measuring point, and able to be hundreds of metres long.

### The fibre Bragg grating
A **fibre Bragg grating** (FBG) is a stretch of core, a few millimetres long, in which the refractive index is modulated with a period $\\Lambda \\approx 0.5$ µm. It is written by exposing germanium-doped fibre to an ultraviolet interference pattern, often through a phase mask. Each period reflects a little light, and the reflections add in step only at one wavelength, the **Bragg wavelength**:

$$\\lambda_B = 2\\,n_{\\mathrm{eff}}\\,\\Lambda$$

With $n_{\\mathrm{eff}} = 1.447$, a period of 535.6 nm gives 1550 nm. The grating reflects a narrow band, 0.1 to 0.3 nm wide, up to more than 99 %, and lets everything else through.

### Strain and temperature
Stretching the fibre lengthens $\\Lambda$ and, through the photoelastic effect, changes $n_{\\mathrm{eff}}$. Heating changes both too. For silica:

| Quantity | Relative shift | At 1550 nm |
|---|---|---|
| Strain $\\varepsilon$ | $(1 - p_e)\\,\\varepsilon$, $p_e \\approx 0.22$ | 1.2 pm per microstrain |
| Temperature $\\Delta T$ | about $7.5\\times10^{-6}\\ \\mathrm{K^{-1}}\\,\\Delta T$ | 10–13 pm/K |

A reader that resolves 1 pm sees 1 µε or 0.1 K. A strain of 1000 µε (0.1 %) shifts the peak by 1.2 nm. Since both effects shift the peak, a second grating that is shielded from strain separates them. Many gratings written at different wavelengths in one fibre are read together: each sensor is recognized by its own colour. Fibres on bridges, wind-turbine blades, aircraft wings, pipelines and in catheters carry tens of them.

### Distributed sensing
Send a short pulse down the fibre and listen to the light scattered back. The echo at time $t$ comes from a distance $z = ct/(2n)$: 1 µs is 102 m. Rayleigh backscatter gives the loss along the fibre and locates breaks (the **OTDR**). The ratio of Raman components gives temperature along many kilometres. The Brillouin frequency shift, about 11 GHz at 1550 nm, moves by about 1 MHz per kelvin and 0.05 MHz per microstrain, and monitors pipelines, dykes, tunnels and power cables.

### Interferometers and the gyroscope
Light through a longer, hotter or stretched fibre arrives late compared with a reference, and the phase difference is read in a Mach–Zehnder or a Michelson layout: hydrophones, current sensors. In the **fibre-optic gyroscope** two beams run round a coil in opposite directions, and a rotation $\\Omega$ delays one against the other (the Sagnac effect), by a phase

$$\\Delta\\phi = \\frac{8\\pi N A}{\\lambda c}\\,\\Omega$$

for $N$ turns of area $A$ ([[mach-zehnder-and-sagnac]]). A coil of 1 km of fibre, 10 cm across, gives 1.35 rad per rad/s: Earth\'s rotation (15°/h) makes 0.1 mrad, and aircraft, ships and spacecraft navigate by such gyroscopes.

> [!key] A Bragg grating reflects $\\lambda_B = 2n\\Lambda$, which moves 1.2 pm per microstrain and about 12 pm/K; gratings at different wavelengths make an array of sensors. Backscatter ($z = ct/2n$) makes the whole fibre a sensor, and the Sagnac phase $8\\pi NA\\Omega/(\\lambda c)$ senses rotation.
`,
  ideas: [
    'A fibre Bragg grating reflects one wavelength, λ_B = 2·n_eff·Λ, and passes the rest.',
    'Its peak moves with strain (1.2 pm per µε at 1550 nm) and temperature (about 12 pm/K).',
    'Gratings written at different wavelengths in one fibre make a multiplexed array of sensors.',
    'Backscattered light, timed as z = ct/(2n), turns a whole fibre into a distributed sensor (OTDR, Raman, Brillouin).',
    'In a fibre gyroscope the Sagnac phase 8πNAΩ/(λc) between two counter-propagating beams measures rotation.'
  ],
  pitfalls: [
    'A Bragg grating senses strain only — It shifts with temperature too, by 10 to 13 pm/K. A grating shielded from strain, next to the working one, is needed to tell the two effects apart.',
    'A fibre sensor measures the power of the light — The best ones do not: a wavelength shift or a phase is immune to changes in source power or connector loss, which a power measurement is not.',
    'Distributed sensing means many sensors along the fibre — There is one continuous fibre, and the position is decided by the time of flight of the backscatter, with a resolution of about a metre (a pulse of 10 ns resolves 1 m).',
    'A fibre gyroscope needs a large rotating mass — It has no moving parts: the light itself, circulating in a coil, senses rotation through the Sagnac effect.'
  ],
  terms: [
    { term: 'Fibre Bragg grating', also: ['FBG'], def: 'A periodic variation of the refractive index in the core of a fibre, a few millimetres long, that reflects light in a narrow band round the Bragg wavelength.' },
    { term: 'Bragg wavelength', also: ['λ_B'], def: 'The wavelength that a grating reflects: λ_B = 2·n_eff·Λ, with n_eff the effective index of the mode and Λ the period of the grating.' },
    { term: 'Photoelastic coefficient', also: ['strain-optic coefficient', 'p_e'], def: 'The effective constant (about 0.22 for silica) that describes how strain changes the refractive index; it reduces the strain sensitivity of a Bragg grating to (1 − p_e) = 0.78.' },
    { term: 'Interrogator', def: 'The instrument that reads fibre sensors: a tunable laser or a spectrometer that finds the wavelength of each Bragg peak to a picometre.' },
    { term: 'OTDR', also: ['optical time-domain reflectometer'], def: 'An instrument that sends short pulses into a fibre and records the backscattered light against time, giving loss and the position of splices, bends and breaks.' },
    { term: 'Distributed sensing', also: ['Brillouin sensing', 'Raman sensing', 'DTS', 'DAS'], def: 'Using the whole fibre as a sensor, with the position found from the time of flight of backscattered light. Raman measures temperature, Brillouin strain and temperature.' },
    { term: 'Fibre-optic gyroscope', also: ['FOG', 'Sagnac effect'], def: 'A rotation sensor made of a coil of fibre with light travelling both ways: a rotation Ω gives the phase difference Δφ = 8πNAΩ/(λc) between them.' }
  ],
  formulas: [
    {
      name: 'Bragg wavelength',
      expr: 'lambdaB = 2*n*Lambda', tex: '\\lambda_B = 2\\,n\\,\\Lambda',
      vars: {
        lambdaB: { name: 'Bragg wavelength', q: 'length', unit: 'nm', tex: '\\lambda_B' },
        n: { name: 'effective index of the mode', value: 1.447, min: 1, max: 2 },
        Lambda: { name: 'period of the grating', q: 'length', unit: 'nm', value: 535.6, tex: '\\Lambda' }
      },
      note: 'First-order grating, reflecting back along the fibre.',
      stories: { lambdaB: 'A fibre grating has a period of {Lambda} and the mode has an effective index of {n}. At what wavelength does it reflect?', Lambda: 'A grating is to reflect {lambdaB} in a fibre of effective index {n}. What period is needed?' }
    },
    {
      name: 'Shift with strain',
      expr: 'dl = lambdaB*(1 - pe)*eps', tex: '\\Delta\\lambda = \\lambda_B\\,(1 - p_e)\\,\\varepsilon',
      vars: {
        dl: { name: 'shift of the Bragg wavelength', q: 'length', unit: 'nm', signed: true, tex: '\\Delta\\lambda' },
        lambdaB: { name: 'Bragg wavelength', q: 'length', unit: 'nm', value: 1550, tex: '\\lambda_B' },
        pe: { name: 'photoelastic coefficient', value: 0.22, min: 0, max: 1, tex: 'p_e' },
        eps: { name: 'strain', q: 'strain', unit: 'µε', value: 500, signed: true, tex: '\\varepsilon' }
      },
      note: 'At constant temperature; 1.2 pm per microstrain at 1550 nm.',
      stories: { dl: 'A grating at {lambdaB} is stretched by {eps}. By how much does its peak shift?', eps: 'The peak of a grating at {lambdaB} has moved by {dl}. How large is the strain?' }
    },
    {
      name: 'Shift with temperature',
      expr: 'dl = lambdaB*kT*dT', tex: '\\Delta\\lambda = \\lambda_B\\,k_T\\,\\Delta T',
      vars: {
        dl: { name: 'shift of the Bragg wavelength', q: 'length', unit: 'nm', signed: true, tex: '\\Delta\\lambda' },
        lambdaB: { name: 'Bragg wavelength', q: 'length', unit: 'nm', value: 1550, tex: '\\lambda_B' },
        kT: { name: 'relative shift per kelvin', q: 'expansion', unit: 'ppm/K', value: 7.5, tex: 'k_T' },
        dT: { name: 'temperature change', q: 'dtemp', unit: 'K', value: 40, signed: true, tex: '\\Delta T' }
      },
      note: 'About 10 to 13 pm/K at 1550 nm for silica, with no strain.',
      stories: { dl: 'A grating at {lambdaB} warms by {dT}, with k_T = {kT}. By how much does its peak move?' }
    },
    {
      name: 'Position from the echo time',
      expr: 'z = c*t/(2*n)', tex: 'z = \\frac{c\\,t}{2\\,n}',
      vars: {
        z: { name: 'distance along the fibre', q: 'length', unit: 'km' },
        c: { const: 'c' },
        t: { name: 'round-trip time of the echo', q: 'time', unit: 'µs', value: 41 },
        n: { name: 'group index', value: 1.468, min: 1, max: 2 }
      },
      note: '1 µs is 102 m of fibre.',
      stories: { z: 'An OTDR sees the echo of a break {t} after sending a pulse into a fibre of group index {n}. How far away is it?' }
    },
    {
      name: 'Sagnac phase of a fibre gyroscope',
      expr: 'dphi = 8*pi*N*A*Om/(lambda*c)', tex: '\\Delta\\phi = \\frac{8\\pi N A\\,\\Omega}{\\lambda c}',
      vars: {
        dphi: { name: 'phase difference', q: 'angle', unit: 'rad', tex: '\\Delta\\phi' },
        N: { name: 'number of turns', q: 'count', value: 3183 },
        A: { name: 'area of one turn', q: 'area', unit: 'cm²', value: 78.5 },
        Om: { name: 'rate of rotation', q: 'angvel', unit: 'rad/s', value: 7.29e-5, tex: '\\Omega' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 1550, tex: '\\lambda' },
        c: { const: 'c' }
      },
      note: 'The defaults are 1 km of fibre in a coil 10 cm across, turning at Earth\'s rate (15°/h).',
      stories: { dphi: 'A coil of {N} turns, each of area {A}, turns at {Om} with light of {lambda}. What is the Sagnac phase?' }
    }
  ],
  examples: [
    {
      title: 'Reading a strain',
      q: 'A grating at 1550 nm on a bridge girder moves by 0.60 nm. If the temperature has not changed, what is the strain?',
      steps: [
        { text: 'Solve the strain formula for $\\varepsilon$, with $p_e = 0.22$:', tex: '\\varepsilon = \\frac{\\Delta\\lambda}{\\lambda_B(1 - p_e)} = \\frac{0.60\\ \\mathrm{nm}}{1550\\ \\mathrm{nm} \\times 0.78} = 496\\ \\mu\\varepsilon' }
      ],
      a: 'About 500 µε, a strain of 0.05 %. In steel (modulus 200 GPa) that is a stress of about 100 MPa.'
    },
    {
      title: 'Where is the break?',
      q: 'An OTDR sends a pulse into a fibre of group index 1.468 and sees the strong echo of a break 41 µs later. How far away is it?',
      steps: [
        { text: 'The light goes there and back, so', tex: 'z = \\frac{c\\,t}{2n} = \\frac{2.998\\times10^{8}\\ \\mathrm{m/s} \\times 41\\times10^{-6}\\ \\mathrm{s}}{2 \\times 1.468} = 4.19\\ \\mathrm{km}' }
      ],
      a: '4.19 km from the instrument; each microsecond is 102 m, so the break can be located to a few metres with a short pulse.'
    }
  ],
  quiz: [
    { q: 'A fibre Bragg grating reflects 1550 nm. A tension in the fibre makes the reflected wavelength…', choices: ['increase', 'decrease', 'stay the same', 'split into two'], a: 0, why: 'Stretching lengthens the period Λ (and slightly lowers the index through the photoelastic effect, by less), so $\\lambda_B = 2n\\Lambda$ increases: 1.2 pm per microstrain.' },
    { q: 'A grating at 1550 nm warms by 40 K with no strain. About how far does the peak move, in nanometres? (Take $k_T = 7.5\\times10^{-6}$ per kelvin.)', answer: 0.465, unit: 'nm', why: '$\\Delta\\lambda = \\lambda_B k_T \\Delta T = 1550 \\times 7.5\\times10^{-6} \\times 40 = 0.465$ nm, about 12 pm per kelvin.' },
    { q: 'A strain gauge made from a single Bragg grating is not affected by temperature.', a: false, why: 'The same peak moves with temperature (10–13 pm/K), as much as with 10 µε per kelvin. A second grating that is isolated from strain is needed to separate the two effects.' },
    { q: 'An OTDR sees an echo 20 µs after the pulse. About how far away is the feature, in kilometres? (Group index 1.468.)', answer: 2.04, unit: 'km', why: '$z = ct/(2n) = 3\\times10^8 \\times 20\\times10^{-6}/(2 \\times 1.468) = 2.04$ km.' },
    { q: 'What principle makes a fibre-optic gyroscope sense rotation?', choices: ['Two counter-propagating beams in a coil acquire a phase difference when the coil rotates (the Sagnac effect)', 'The fibre is stretched by the centrifugal force', 'A spinning mass drags the light', 'The wavelength of the light is Doppler-shifted by the coil'], a: 0, why: 'In a rotating frame the beam going with the rotation has farther to go than the one against it. The phase difference 8πNAΩ/(λc) is read by interference.' }
  ],
  applications: [
    'Structural health monitoring: strain and temperature of bridges, dams, tunnels, wind-turbine blades and aircraft wings with arrays of Bragg gratings.',
    'Oil, gas and power: distributed temperature sensing along wells and power cables, Brillouin sensing along pipelines.',
    'Fire detection in tunnels and silos from the temperature profile of a single fibre.',
    'Navigation: fibre-optic gyroscopes in aircraft, ships, spacecraft and drilling tools.',
    'Medical: shape-sensing catheters and temperature probes that are safe in magnetic resonance scanners.'
  ],
  history: 'Kenneth Hill and colleagues at the Communications Research Centre in Canada saw in 1978 that light in a germanium-doped fibre writes a grating in it. In 1989 Gerald Meltz and colleagues wrote gratings from the side with ultraviolet interference fringes, and made them at any wavelength. Georges Sagnac showed the rotation effect in 1913; the fibre-optic gyroscope was demonstrated by Vali and Shorthill in 1976 and is now a standard navigation sensor.',
  sources: [
    'A. Othonos and K. Kalli, *Fiber Bragg Gratings: Fundamentals and Applications in Telecommunications and Sensing* (Artech House, 1999).',
    'A. D. Kersey and colleagues, "Fiber grating sensors", *Journal of Lightwave Technology* 15 (1997) 1442.',
    'K. O. Hill and G. Meltz, "Fiber Bragg grating technology fundamentals and overview", *Journal of Lightwave Technology* 15 (1997) 1263.',
    'H. C. Lefèvre, *The Fiber-Optic Gyroscope* (Artech House) — the Sagnac effect in a fibre coil.'
  ],
  sim: 'fo-bragg'
}

);
