/* HYPER-OPTICS · content/reflection-and-mirrors.js — the topic "Reflection and mirrors" (light-and-rays).
 * Single rays at mirrors first (the law, rough and smooth surfaces), then images: plane mirrors, pairs of mirrors,
 * retroreflectors, concave and convex mirrors, the mirror equation, ray diagrams, conic mirrors, the spherical
 * mirror's caustic, and the mirrors of daily life. Simulations: sims/reflection-and-mirrors.js (prefix rm-).
 */
Hyper.add(

/* ================================================================ the law */
{
  id: 'law-of-reflection', parent: 'reflection-and-mirrors', title: 'The law of reflection', level: 1,
  short: 'A ray that meets a smooth surface bounces off so that the angle of reflection equals the angle of incidence, both measured from the normal and all three lines lying in one plane: θᵣ = θᵢ. Turn the mirror by δ and the reflected beam turns by 2δ.',
  keywords: ['reflection', 'law of reflection', 'angle of incidence', 'angle of reflection', 'normal', 'plane of incidence', 'mirror', 'specular', 'mirror tilt', 'double angle', 'optical lever', 'beam deviation', 'heliostat', 'optical angle', 'AOI'],
  prereq: ['rays-and-wavefronts', 'what-is-light'],
  related: ['specular-and-diffuse-reflection', 'plane-mirror-images', 'galvanometer-scanners', 'fermats-principle', 'huygens-construction', 'snells-law', 'fresnel-reflection', 'the-autocollimator', 'physics:reflection'],
  body: `
Throw a tennis ball at a smooth wall on a slant and it leaves on the same slant on the other side. Light does the same at a mirror, and the rule is the oldest in optics: **the angle of reflection equals the angle of incidence**.

### The rule
Draw the normal, the line at right angles to the surface where the ray lands, and measure both angles from it, never from the surface. The ray arrives at the angle of incidence $\\theta_i$ and leaves at the **angle of reflection** $\\theta_r$ on the other side of the normal:

$$\\theta_r = \\theta_i$$

The incident ray, the normal and the reflected ray lie in one plane, the plane of incidence (the words of [[snells-law]]). In vector form, for a ray of direction $\\hat d$ meeting a surface of unit normal $\\hat n$, the new direction is $\\hat d - 2(\\hat d\\cdot\\hat n)\\,\\hat n$: the part along the normal reverses and the part along the surface is untouched. That one line is the heart of every ray-tracing program.

### What it means
- **Head-on returns straight back.** A ray along the normal ($\\theta_i = 0$) retraces itself.
- **The beam is turned through $180° - 2\\theta_i$.** A mirror at 45° turns it by a right angle, as in a periscope; a ray grazing the surface at 80° is only nudged.
- **It is reversible.** Send the reflected ray back along its path and it returns along the incident ray.
- **Curved mirrors obey it too.** At each point a ray reflects as if from the flat tangent plane there; every [[curved-mirrors|curved-mirror]] image is built from that.

| $\\theta_i$ | 0° | 20° | 45° | 60° | 80° |
|---|---|---|---|---|---|
| beam turned through | 180° | 140° | 90° | 60° | 20° |

### Why light does it
Of all the paths from a lamp to your eye by way of a flat mirror, the one with equal angles is the shortest; Hero of Alexandria showed this nearly two thousand years ago. [[fermats-principle|Fermat's principle]] widens it: light takes the path of least time. The wave picture ([[huygens-construction|Huygens]]) agrees: one end of a wavefront reaches the surface first and starts back first, so the front pivots and leaves at the angle it came in. A third way is the mirror image of the source ([[plane-mirror-images]]): the reflected ray is the straight line from it.

### Turn the mirror and the beam turns twice as far
Hold the incident beam still and rotate the mirror by a small angle $\\delta$. The normal turns by $\\delta$, so $\\theta_i$ and $\\theta_r$ both change by $\\delta$ and the reflected beam swings through **$2\\delta$**. A mirror twisted by 1 mrad moves a spot 5 m away by 10 mm; a mount knocked by 0.1° throws the beam 3.5 mrad, 17 mm at 5 m, off target. The same doubling lets a mirror galvanometer read a tiny twist, and lets a [[galvanometer-scanners|galvanometer scanner]] that rocks its mirror ±10° sweep the beam ±20° — its *optical* angle is twice its *mechanical* angle.

### What the law does not say
It gives direction, not amount. How much is reflected depends on the material, the angle and the polarization ([[fresnel-reflection]]): about 4 % at a glass surface head-on, 92 % for aluminium and 98 % for silver in green light. And it holds at the scale of the surface: a rough one scatters ([[specular-and-diffuse-reflection]]).

> [!key] $\\theta_r = \\theta_i$, both from the normal, in the plane of incidence. Turn a mirror by $\\delta$ and the reflected beam turns by $2\\delta$.
`,
  ideas: [
    'The reflected ray leaves at the same angle from the normal as the incident ray arrived, in the plane of incidence.',
    'A flat mirror turns a beam through 180° − 2θᵢ; at θᵢ = 45° that is a right angle.',
    'Reflection is reversible: a ray sent back along the reflected path retraces the incident ray.',
    'Rotating a mirror by δ rotates the reflected beam by 2δ — the optical lever and the galvanometer scanner.',
    'The law gives direction, not brightness: how much light is reflected comes from the Fresnel equations and the coating.'
  ],
  pitfalls: [
    'The angles are measured from the mirror surface — They are measured from the normal. A ray "at 30° to the mirror" has θᵢ = 60° and is turned through 60°, not 120°.',
    'Turning a mirror by 10° turns the reflected beam by 10° — By 20°. The normal turns with the mirror and the reflected ray moves twice as far; that is why a mirror in an instrument is so touchy to align, and why a scanner mirror need swing only half the beam angle.',
    'Rough or curved surfaces break the law — The law holds at every point. A rough surface has normals pointing every which way, and a curved one has a normal that changes along it, so the reflected rays spread or focus; each ray still obeys it.',
    'A mirror reflects all the light that reaches it — Even the best silver returns 98 to 99 % in the visible, and a bare glass surface only about 4 % at normal incidence.'
  ],
  terms: [
    { term: 'Law of reflection', also: ['equal-angles law'], def: 'A ray reflected at a smooth surface leaves in the plane of incidence at an angle from the normal equal to its angle of incidence: θᵣ = θᵢ.' },
    { term: 'Angle of reflection', also: ['θᵣ'], def: 'The angle between the reflected ray and the normal to the surface. For a smooth surface it is equal to the angle of incidence.' },
    { term: 'Beam deviation', also: ['beam turn'], def: 'The angle through which a surface or component turns a beam from its original direction. A flat mirror used at angle of incidence θ turns it through 180° − 2θ.' },
    { term: 'Optical lever', also: ['mirror lever'], def: 'A small mirror fixed to a part that twists or tilts. The reflected beam turns twice as far as the mirror, so a distant spot or scale shows the rotation magnified.' },
    { term: 'Optical angle', also: ['optical scan angle', 'mechanical angle'], def: 'The angle through which a beam is deflected by a rotating mirror: twice the mechanical angle through which the mirror itself turns. Scanner data sheets quote both.' }
  ],
  formulas: [
    {
      name: 'Angle through which a mirror turns the beam',
      expr: 'dev = pi - 2*ti', tex: '\\delta = 180^\\circ - 2\\,\\theta_i',
      vars: {
        dev: { name: 'angle the beam is turned through', q: 'angle', unit: '°', tex: '\\delta' },
        ti: { name: 'angle of incidence', q: 'angle', unit: '°', value: 30, min: 0, max: 90, tex: '\\theta_i' }
      },
      note: 'Angles from the normal. At 0° the beam is sent straight back (180°); at 45° it is turned by a right angle; at grazing incidence it is hardly turned at all.',
      stories: {
        dev: 'A laser beam strikes a flat mirror {ti} from the normal. Through what angle is the beam turned?',
        ti: 'A flat mirror must turn a beam through {dev}. At what angle of incidence must it be set?'
      }
    },
    {
      name: 'A turned mirror turns the beam twice as far',
      expr: 'db = 2*dm', tex: '\\delta_b = 2\\,\\delta_m',
      vars: {
        db: { name: 'turn of the reflected beam', q: 'angle', unit: 'mrad', tex: '\\delta_b' },
        dm: { name: 'turn of the mirror', q: 'angle', unit: 'mrad', value: 1, tex: '\\delta_m' }
      },
      note: 'For a fixed incident beam and a mirror turned about an axis in its own surface, at right angles to the plane of incidence.',
      stories: { db: 'A mirror on a torsion fibre twists by {dm}. Through what angle does the reflected beam turn?', dm: 'A reflected beam is seen to swing by {db}. How far did the mirror turn?' }
    },
    {
      name: 'The spot on a distant wall',
      expr: 'x = L*tan(2*a)', tex: 'x = L\\,\\tan 2\\alpha',
      vars: {
        x: { name: 'how far the spot moves', q: 'length', unit: 'mm' },
        L: { name: 'distance from mirror to wall', q: 'length', unit: 'm', value: 5 },
        a: { name: 'turn of the mirror', q: 'angle', unit: 'mrad', value: 1, min: 0, max: 700, tex: '\\alpha' }
      },
      note: 'The wall is taken square to the reflected beam. For small angles x ≈ 2αL.',
      stories: { x: 'A mirror turns by {a}. Its reflected laser spot falls on a wall {L} away. How far does the spot move?', a: 'The spot on a wall {L} away moves {x} when a mirror is knocked. Through what angle did the mirror turn?' }
    }
  ],
  examples: [
    {
      title: 'A knocked beam-steering mirror',
      q: 'A mirror set at 45° sends a laser beam through a right angle towards a target 2.0 m away. The mount is knocked and the mirror turns by 0.05° about an axis in its surface at right angles to the plane of incidence. How far does the spot move on the target?',
      steps: [
        'The reflected beam turns twice as far as the mirror: $2 \\times 0.05° = 0.10°$, which is $1.75$ mrad.',
        { text: 'On a target square to the beam 2.0 m away the spot moves by', tex: 'x = L\\tan 2\\alpha = 2000\\ \\mathrm{mm} \\times \\tan 0.10° = 3.5\\ \\mathrm{mm}' }
      ],
      a: 'About 3.5 mm. Had the mirror turned the beam by the same angle as itself, the error would have been half that.'
    },
    {
      title: 'A 120° turn with one mirror',
      q: 'A single flat mirror has to turn a ray through 120°. At what angle of incidence must the ray meet it, and what angle does the mirror surface make with the incoming ray?',
      steps: [
        { text: 'The turn is $180° - 2\\theta_i$, so', tex: '2\\theta_i = 180° - 120° = 60° \\quad\\Rightarrow\\quad \\theta_i = 30°' },
        'The angle of incidence is measured from the normal. The angle between the ray and the surface itself is the complement: $90° - 30° = 60°$.'
      ],
      a: 'θᵢ = 30° from the normal, which is 60° between the ray and the mirror surface.'
    }
  ],
  quiz: [
    { q: 'A ray strikes a flat mirror at 30° **to the mirror surface**. What is the angle of reflection, measured from the normal?', choices: ['30°', '60°', '120°', '150°'], a: 1, why: 'Angles are measured from the normal. The angle of incidence is $90° - 30° = 60°$ and the angle of reflection equals it.' },
    { q: 'The incident beam stays fixed and a mirror is rotated by 4° about an axis in its surface. Through what angle does the reflected beam turn?', choices: ['2°', '4°', '8°', '16°'], a: 2, why: 'The normal turns by 4°, so both the angle of incidence and the angle of reflection change by 4° and the reflected beam moves by twice that, 8°.' },
    { q: 'A ray that meets a flat mirror along the normal is reflected straight back along itself.', a: true, why: 'With $\\theta_i = 0$ we have $\\theta_r = 0$. This is why a mirror square to a laser beam sends it back into the laser.' },
    { q: 'A mirror on a torsion fibre twists by 0.5 mrad. How far, in millimetres, does the reflected spot move on a scale 4 m away?', answer: 4, unit: 'mm', why: 'The beam turns by $2 \\times 0.5$ = 1 mrad, and $4000\\ \\mathrm{mm} \\times 0.001 = 4$ mm.' },
    { q: 'One flat mirror has to turn a beam through exactly 90°. At what angle of incidence?', choices: ['30°', '45°', '60°', '90°'], a: 1, why: '$180° - 2\\theta_i = 90°$ gives $\\theta_i = 45°$.' }
  ],
  applications: [
    'Optical levers: a mirror on a twisting fibre, a balance arm or a microscope cantilever turns the beam twice as far and a distant spot magnifies the motion; the atomic force microscope reads its cantilever this way.',
    'Galvanometer scanners in laser projectors, markers and printers: the mirror turns half the angle through which the beam is steered.',
    'Heliostats in solar-tower plants: a mirror following the Sun turns through only half the Sun\'s angular motion to keep the beam on the tower.',
    'Beam steering on an optical bench: two 45° mounts with tilt screws, each sensitive to an angle of a few arc seconds.',
    'Ray tracing in lens design and computer graphics, which apply the vector form at every mirror bounce.'
  ],
  history: 'The equal-angles law is in the *Catoptrics* ascribed to Euclid (about 300 BC), and Hero of Alexandria showed in the first century AD that it picks the shortest path. Ibn al-Haytham (Alhazen), about 1020, measured angles from the normal, as we do, and tested the law by experiment. Poggendorff introduced the mirror and scale to read small rotations in 1826, and the mirror galvanometer, in Lord Kelvin\'s hands, read the faint signals of the first Atlantic telegraph cables.',
  sources: [
    'E. Hecht, *Optics*, ch. 4 (The Propagation of Light) — reflection from Huygens\' principle and from Fermat\'s principle.',
    'F. A. Jenkins and H. E. White, *Fundamentals of Optics* — the chapters on reflection at plane surfaces.',
    'A. M. Smith, *Alhacen on the Principles of Reflection* (American Philosophical Society, 2006) — the experimental treatment of reflection by Ibn al-Haytham.'
  ],
  sim: 'rm-reflection'
},

/* ================================================================ rough and smooth */
{
  id: 'specular-and-diffuse-reflection', parent: 'reflection-and-mirrors', title: 'Specular and diffuse reflection', level: 1,
  short: 'A smooth surface sends a beam off in one direction (specular reflection: a mirror, a gloss); a rough one scatters it everywhere (diffuse reflection: paper, chalk). "Smooth" is measured against the wavelength: the same surface can be a mirror for the infrared and a diffuser for blue light.',
  keywords: ['specular', 'diffuse', 'gloss', 'matt', 'matte', 'Lambertian', 'roughness', 'Rayleigh criterion', 'scattering', 'glossmeter', 'gloss unit', 'GU', 'highlight', 'rms roughness', 'surface finish', 'BRDF', 'sheen'],
  prereq: ['law-of-reflection', 'wavelength-frequency-and-colour'],
  related: ['lambertian-surfaces', 'fresnel-reflection', 'metal-mirror-coatings', 'surface-quality-and-flatness', 'diffusers-and-ground-glass', 'laser-safety-classes', 'plane-mirror-images'],
  body: `
White paper under a lamp is as bright from every side. A polished mirror shows the lamp from one place only. Both obey [[law-of-reflection|the law of reflection]] at every point; what differs is whether the points face the same way.

### Two kinds of reflection
- **Specular reflection** (from the Latin *speculum*, a mirror): a parallel beam leaves as a parallel beam in one direction, and you see images. Mirrors, still water, polished metal, the clear coat of a car.
- **Diffuse reflection**: a parallel beam is scattered into many directions, and you see the surface and not the lamp. Paper, plaster, chalk, snow, cloth.

Most surfaces do both: glossy paint has a sharp highlight on top of a diffuse body colour.

### How smooth is smooth?
It depends on the bumps compared with the wavelength $\\lambda$. Two rays reflecting at points of height difference $h$ differ in path by $2h\\cos\\theta$; if that is well under a quarter wavelength they stay in step and add up as a mirror reflection. The **Rayleigh criterion** for a smooth surface is

$$h < \\frac{\\lambda}{8\\cos\\theta}$$

which is 69 nm for green light at normal incidence. For a surface of rms roughness $\\sigma$ with Gaussian heights, the share of light left in the specular beam is

$$\\frac{R_\\text{spec}}{R_0} = \\exp\\left[-\\left(\\frac{4\\pi\\sigma\\cos\\theta}{\\lambda}\\right)^2\\right]$$

($R_0$ is the reflectance if the surface were perfectly smooth; the formula is exact only for slight roughness.) With $\\lambda$ in the denominator, one surface can be a mirror to long waves and a diffuser to short ones:

| Surface, rms roughness | specular share, green 550 nm | specular share, CO₂ laser 10.6 µm |
|---|---|---|
| Superpolished optic, 0.3 nm | 99.995 % | about 100 % |
| Telescope mirror, 2 nm | 99.8 % | about 100 % |
| Lightly etched glass, 100 nm | 0.5 % | 98.6 % |
| Bead-blasted metal, 1 µm | 0 | 25 % |

### The perfect diffuser
A surface equally bright from every direction is **Lambertian** ([[lambertian-surfaces]]): its intensity falls as $\\cos\\theta$ with viewing angle, exactly as its apparent area does, so its luminance is constant. A white wall of reflectance $\\rho = 0.8$ lit by 300 lx has luminance $L = \\rho E/\\pi = 76$ cd/m². Matt paper and plaster come close.

### Gloss
**Gloss** is the specular share, measured by shining a beam at a fixed angle (20°, 60° or 85° from the normal in the paint standards ISO 2813 and ASTM D523) and catching the mirror direction, against polished black glass defined as 100 gloss units. As rules of thumb for paints, below 10 GU at 60° is matt, 10 to 30 satin, 30 to 70 semi-gloss, above 70 high gloss.

### Two things to remember
Everything turns into a mirror at **grazing incidence**: $\\lambda/(8\\cos\\theta)$ grows without limit as $\\theta \\to 90°$, which is why a rough road gleams under a low sun. And the **colour** of the reflection differs: specular reflection from paint, plastic or glass is the colour of the lamp (the highlight on a red apple is white), from a metal it is tinted by the metal ([[metal-mirror-coatings]]), while diffuse reflection takes its colour from what the material absorbs.

> [!warn] A surface matt to the eye can still be a mirror in the infrared: bead-blasted metal returns a 10.6 µm CO₂ laser beam specularly at grazing angles. See [[laser-safety-classes]].

> [!key] Smooth means bumps below about $\\lambda/(8\\cos\\theta)$: a mirror. Rougher, and the light is scattered; the ideal case is the Lambertian diffuser.
`,
  ideas: [
    'Specular reflection keeps a beam together and forms images; diffuse reflection scatters it and shows the surface.',
    'Whether a surface is smooth depends on its roughness compared with the wavelength: the Rayleigh limit is λ/(8 cos θ).',
    'The specular share falls as exp[−(4πσ cos θ/λ)²]: a surface rough for blue light can be a mirror for the infrared.',
    'A Lambertian surface is equally bright from every direction; its luminance is L = ρE/π.',
    'Every surface behaves as a mirror at grazing incidence, and a dielectric\'s specular highlight is the colour of the lamp.'
  ],
  pitfalls: [
    'A matt surface does not obey the law of reflection — Every tiny facet does; the facets simply face every which way, so the reflected rays spread over a wide range of directions.',
    'A surface is either smooth or rough — It is smooth or rough only for a wavelength and an angle: a surface that is matt in green light may be a mirror at 10.6 µm, or when seen at a grazing angle.',
    'The highlight on a red apple is red — The specular highlight from a dielectric surface has the colour of the light source, so it is white under white light. The red comes from the diffuse reflection beneath.',
    'White paper is white because it is a good mirror in every direction — It is white because fibres scatter light in all directions and absorb almost none; wet it, so the fibres scatter less, and it turns more transparent and darker.'
  ],
  terms: [
    { term: 'Specular reflection', also: ['regular reflection', 'mirror-like reflection'], def: 'Reflection from a smooth surface in which a parallel beam stays parallel and leaves in a single direction, the mirror direction. It forms images.' },
    { term: 'Diffuse reflection', also: ['scattering', 'matt reflection'], def: 'Reflection from a rough or granular surface that scatters a beam over a wide range of directions. It shows the surface itself and forms no image.' },
    { term: 'Gloss', also: ['gloss value', 'specular gloss'], def: 'The specular share of the reflection of a surface, measured as the light caught at the mirror angle by a gloss meter, relative to a reference of polished black glass.' },
    { term: 'Gloss unit', also: ['GU'], def: 'The unit of gloss: polished black glass of refractive index 1.567 is defined as 100 GU at each of the standard angles of 20°, 60° and 85°.' },
    { term: 'Rayleigh criterion for roughness', also: ['Rayleigh smoothness criterion'], def: 'A surface acts as a mirror if its height variations h stay below λ/(8 cos θ), so that rays reflecting from its high and low points stay within a quarter wavelength of one another.' },
    { term: 'RMS roughness', also: ['Rq', 'root-mean-square roughness'], def: 'The root-mean-square deviation of a surface\'s height from its mean level, written σ on this page (not to be confused with the rms wavefront error). Optical polishes reach 0.3 to 2 nm; ground glass is hundreds of nanometres to micrometres.' }
  ],
  formulas: [
    {
      name: 'Rayleigh limit for a smooth surface',
      expr: 'hmax = lambda/(8*cos(ti))', tex: 'h_{\\max} = \\frac{\\lambda}{8\\cos\\theta_i}',
      vars: {
        hmax: { name: 'largest height variation of a "smooth" surface', q: 'length', unit: 'nm', tex: 'h_{\\max}' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        ti: { name: 'angle of incidence', q: 'angle', unit: '°', value: 0, min: 0, max: 89, tex: '\\theta_i' }
      },
      note: 'A rule of thumb for imaging. It grows without bound towards grazing incidence.',
      stories: { hmax: 'A surface is to act as a mirror for {lambda} light arriving {ti} from the normal. How large may its height variations be?' }
    },
    {
      name: 'Specular share of a slightly rough surface',
      expr: 'f = exp(-(4*pi*s*cos(ti)/lambda)^2)', tex: 'f = \\exp\\left[-\\left(\\frac{4\\pi s\\cos\\theta_i}{\\lambda}\\right)^2\\right]',
      vars: {
        f: { name: 'share of the light left in the specular beam', q: 'ratio', unit: '%' },
        s: { name: 'rms roughness of the surface', q: 'length', unit: 'nm', value: 20 },
        ti: { name: 'angle of incidence', q: 'angle', unit: '°', value: 0, min: 0, max: 89, tex: '\\theta_i' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' }
      },
      note: 'Gaussian roughness, exact for slight roughness; read it as the trend for rougher surfaces.',
      stories: { f: 'A surface has {s} rms roughness. What share of {lambda} light arriving {ti} from the normal stays in the specular beam?', s: 'A surface must keep {f} of {lambda} light in its specular beam at {ti} incidence. What rms roughness may it have?' }
    },
    {
      name: 'Luminance of a Lambertian surface',
      expr: 'L = rho*E/pi', tex: 'L = \\frac{\\rho\\,E}{\\pi}',
      vars: {
        L: { name: 'luminance of the surface', q: 'luminance', unit: 'cd/m²' },
        rho: { name: 'reflectance', q: 'ratio', unit: '%', value: 80, min: 0, max: 100, tex: '\\rho' },
        E: { name: 'illuminance on the surface', q: 'illuminance', unit: 'lx', value: 300 }
      },
      note: 'A perfectly diffuse surface looks equally bright from every direction.',
      stories: { L: 'A white wall of reflectance {rho} is lit with {E}. What is its luminance?', E: 'A wall of reflectance {rho} has a luminance of {L}. How strongly is it lit?' }
    }
  ],
  examples: [
    {
      title: 'Matt to the eye, a mirror to the laser',
      q: 'A bead-blasted aluminium plate has an rms roughness of 1 µm. Does it act as a mirror for green light (550 nm), and for a CO₂ laser (10.6 µm), at normal incidence and at 85°?',
      steps: [
        { text: 'The phase term is $4\\pi\\sigma\\cos\\theta/\\lambda$. Green, normal incidence:', tex: '\\frac{4\\pi \\times 1000}{550} = 22.9 \\quad\\Rightarrow\\quad f = e^{-522} \\approx 0' },
        { text: 'CO₂ laser, normal incidence:', tex: '\\frac{4\\pi \\times 1000}{10\\,600} = 1.19 \\quad\\Rightarrow\\quad f = e^{-1.41} = 25\\,\\%' },
        'At 85° $\\cos\\theta = 0.087$, which shrinks both phase terms by a factor of 11.5: for the laser $1.19 \\times 0.087 = 0.103$, so $f = e^{-0.0107} = 98.9\\,\\%$; for green light $22.9 \\times 0.087 = 1.99$, so $f = e^{-3.97} = 1.9\\,\\%$.'
      ],
      a: 'In green light the plate is a diffuser at normal incidence and stays one even at 85° (2 % specular). For the CO₂ laser it is 25 % specular at normal incidence and nearly a mirror (99 %) at 85°. A plate that looks matt can send an infrared laser beam off in a definite direction.'
    },
    {
      title: 'How bright is the wall?',
      q: 'A matt wall painted with reflectance 0.85 is lit by 200 lx. What is its luminance, and does it depend on where you stand?',
      steps: [
        { text: 'For a Lambertian surface', tex: 'L = \\frac{\\rho E}{\\pi} = \\frac{0.85 \\times 200}{\\pi} = 54\\ \\mathrm{cd/m^2}' },
        'Lambert\'s law makes the luminance the same in every viewing direction, so it does not depend on where you stand.'
      ],
      a: '54 cd/m², from any direction. A glossy wall would not be so obliging: it would add a bright highlight in the mirror direction.'
    }
  ],
  quiz: [
    { q: 'A sheet of matt white paper scatters light in all directions. Why?', choices: ['Its surface is made of tiny facets and fibres facing every direction, each reflecting as the law says', 'It does not obey the law of reflection', 'It absorbs the light and re-emits it', 'Light cannot reflect from paper'], a: 0, why: 'Each microscopic facet obeys the law of reflection; but the facets and fibres point every which way, so the reflected rays go everywhere, and paper also scatters light inside its fibres.' },
    { q: 'A surface that is a good mirror for infrared light is always a good mirror for visible light.', a: false, why: 'The criterion is roughness against wavelength. Ground glass with 1 µm roughness is a diffuser in green light and a good mirror to 10.6 µm radiation.' },
    { q: 'At what angle of incidence does a rough surface look most like a mirror?', choices: ['0°', '30°', '60°', 'Close to 90° (grazing)'], a: 3, why: 'The Rayleigh limit $\\lambda/(8\\cos\\theta)$ grows without bound as $\\theta$ approaches 90°, so at grazing incidence even a rough surface counts as smooth.' },
    { q: 'What is the largest height variation, in nm, that a surface may have to count as smooth by the Rayleigh criterion for 600 nm light at normal incidence?', answer: 75, unit: 'nm', why: '$\\lambda/(8\\cos 0°) = 600/8 = 75$ nm.' },
    { q: 'The bright highlight on a glossy red apple under white light is…', choices: ['red, like the apple', 'white, the colour of the lamp, because it is specular reflection from the surface', 'blue', 'darker red'], a: 1, why: 'A dielectric\'s specular reflection does not depend on the pigment beneath: it has the colour of the lamp. The red is the diffuse reflection from below.' }
  ],
  applications: [
    'Gloss meters in the paint, plastics and paper industries check a finish at 20°, 60° or 85° against the standard.',
    'Anti-glare screens and cover glass are etched to a roughness of a fraction of a micrometre so that windows and lamps are scattered into a haze instead of mirrored.',
    'Photographic lighting: a bare lamp makes harsh specular highlights; a softbox or umbrella is a diffuser that turns a small source into a large one.',
    'Reflectance standards and integrating spheres are coated with Lambertian white materials with reflectance of 0.95 to 0.99.',
    'Road safety: a wet or rough road becomes a mirror at a grazing angle, which is why wet roads dazzle drivers at night and low sunlight glares off asphalt.'
  ],
  history: 'Johann Heinrich Lambert described the cosine law of ideal diffuse surfaces in his *Photometria* of 1760. Lord Rayleigh stated the roughness criterion in *The Theory of Sound* (1877), for sound waves reflected from a rough surface, and it carried over to light.',
  sources: [
    'P. Beckmann and A. Spizzichino, *The Scattering of Electromagnetic Waves from Rough Surfaces* (Pergamon, 1963) — the Rayleigh criterion and the specular share.',
    'J. M. Bennett and L. Mattsson, *Introduction to Surface Roughness and Scattering* (Optical Society of America, 1989).',
    'ISO 2813, *Paints and varnishes — Determination of gloss value at 20°, 60° and 85°*.'
  ],
  sim: 'rm-roughness'
},

/* ================================================================ plane mirror images */
{
  id: 'plane-mirror-images', parent: 'reflection-and-mirrors', title: 'Images in a plane mirror', level: 1,
  short: 'A plane mirror forms a virtual image as far behind the glass as the object is in front of it: upright, the same size, and reversed front to back (not left to right, which is how we interpret it). To see yourself from head to foot the mirror need only be half your height.',
  keywords: ['plane mirror', 'virtual image', 'mirror image', 'left right reversal', 'lateral inversion', 'full-length mirror', 'minimum mirror height', 'image distance', 'ambulance', 'ghost image', 'first-surface mirror', 'chirality', 'mirror writing'],
  prereq: ['law-of-reflection', 'rays-and-wavefronts'],
  related: ['real-and-virtual-images', 'two-mirrors-and-kaleidoscopes', 'mirrors-as-components', 'peppers-ghost-and-stage-illusions', 'one-way-mirrors-and-invisibility-tricks', 'physics:plane-mirrors'],
  body: `
Stand a metre from a mirror and your image is a metre behind it. Nothing is there: no light passes through the glass. But the rays from any point of you, once reflected, spread out exactly as though they came from a point a metre behind the mirror, and the eye cannot tell the difference. That point is a **virtual image**.

### Where the image is
Take a point P a distance $s$ in front of the mirror. Each ray from P reflects by [[law-of-reflection|the law]], and the reflected rays diverge as if from P′, on the perpendicular from P to the mirror, the same distance $s$ behind it (two congruent right-angled triangles prove it). So the image of a plane mirror is

- **virtual**: behind the glass, never on a screen;
- **upright** and **the same size**: $m = +1$ (in the mirror equation $f \\to \\infty$, so $s_i = -s_o$);
- **as far behind as the object is in front**, wherever you stand to look: walk towards a mirror at 1 m/s and your image comes towards you at 2 m/s.

### Front to back, not left to right
A mirror does not turn left into right. Point east with your right hand and the image points east with the hand on the same side of the room. What the mirror reverses is **front to back**, along the line perpendicular to it: your nose points at the mirror, its nose points away. The image is an opposite-handed copy of you (a right glove would look like a left glove), and it seems left–right reversed only because we imagine walking round to face it, which swaps its left with our right. Someone who imagined turning head over heels instead would call it up–down reversed. Lettering such as AMBULANCE is printed reversed for the same reason: in a driver's mirror the letters flip and read correctly.

### How tall must the mirror be?
To see yourself from head to foot the mirror needs only **half your height**, however far you stand. The ray from your eye to the image of your feet crosses the glass halfway between eye and feet, and the ray to the image of your crown halfway between eye and crown. For a person 1.76 m tall with eyes at 1.65 m the mirror must run from $e/2 = 0.83$ m to $(e + h)/2 = 1.71$ m: 0.88 m tall, with its bottom edge 0.83 m above the floor. Step back and your image shrinks, but it still fills the same mirror.

### What a mirror shows
A mirror is a window onto the space behind its image. At eye distance $d$, a mirror of width $w$ shows an angle $2\\arctan(w/2d)$ of the scene, and a wall a distance $D$ behind the mirror's plane appears through a width $w(d + D)/d$ of it.

### Real mirrors
A household mirror has its silver or aluminium on the *back* of a few millimetres of glass, so the bare front surface adds a faint second image from its 4 % reflection, visible at a slant as a ghost. Optical instruments use **first-surface mirrors**, coated on the front, which have no ghost but must be handled and cleaned with care ([[mirrors-as-components]]).

> [!key] A plane mirror's image is virtual, upright, life-size and as far behind as the object is in front. It reverses front to back, and a mirror need only be half your height.
`,
  ideas: [
    'The image in a plane mirror is virtual, upright and the same size, as far behind the mirror as the object is in front.',
    'Walking towards a mirror at speed v, you approach your image at 2v.',
    'A mirror reverses front to back; the left–right swap is how we interpret the image of an opposite-handed copy.',
    'A full-length mirror need only be half your height, whatever your distance from it; its lower edge sits at half the eye height.',
    'Household mirrors are second-surface (silvered on the back) and make a faint ghost; instruments use first-surface mirrors.'
  ],
  pitfalls: [
    'A mirror swaps left and right — It swaps front and back. A flag held out to your right is on the same side in the image; it only looks reversed because we picture ourselves turning to face the image. Text looks mirrored for the same reason.',
    'You need a mirror as tall as yourself — Half your height is enough, from half the eye height up to the midpoint between your eyes and the crown. The rule does not depend on how far you stand.',
    'Stepping back lets you see more of yourself in a short mirror — The image recedes as you do, and the ray geometry that fixes the mirror height does not change: what you see of yourself stays the same. You see more of the room, not more of you.',
    'The image is on the mirror\'s surface — It is as far behind the surface as the object is in front. An eye or a camera must focus on the image, not on the glass: the distance to focus on is the distance to the mirror plus the distance from the mirror to the object.'
  ],
  terms: [
    { term: 'Plane mirror', also: ['flat mirror'], def: 'A flat reflecting surface. It forms a virtual, upright, life-size image as far behind the surface as the object is in front.' },
    { term: 'Lateral inversion', also: ['left–right reversal', 'mirror reversal'], def: 'The apparent swapping of left and right in a mirror image. Strictly the mirror reverses front to back, which turns an object into its opposite-handed twin.' },
    { term: 'Chirality', also: ['handedness'], def: 'The property of a shape that cannot be made to coincide with its mirror image by turning it, as a left and a right glove cannot.' },
    { term: 'First-surface mirror', also: ['front-surface mirror', 'surface mirror'], def: 'A mirror whose reflecting coating is on the front of its substrate, so that light never passes through glass. It gives no ghost image.' },
    { term: 'Second-surface mirror', also: ['back-surface mirror'], def: 'A household-type mirror with its silver or aluminium coating on the back of a glass plate. The glass protects the coating but adds a faint second image from the front surface.' }
  ],
  formulas: [
    {
      name: 'Height of a mirror for a whole-body view',
      expr: 'hm = h/2', tex: 'h_m = \\frac{h}{2}',
      vars: {
        hm: { name: 'minimum height of the mirror', q: 'length', unit: 'm', tex: 'h_m' },
        h: { name: 'height of the person', q: 'length', unit: 'm', value: 1.76 }
      },
      note: 'It runs from half the eye height up to halfway between the eyes and the crown, whatever the distance.',
      stories: { hm: 'How tall must a plane mirror be for a person {h} tall to see all of themselves in it?' }
    },
    {
      name: 'Width of the far wall seen in a mirror',
      expr: 'Wv = w*(d + Dw)/d', tex: 'W_v = w\\,\\frac{d + D_w}{d}',
      vars: {
        Wv: { name: 'width of the far wall that you see', q: 'length', unit: 'm', tex: 'W_v' },
        w: { name: 'width of the mirror', q: 'length', unit: 'm', value: 0.6 },
        d: { name: 'distance from your eye to the mirror', q: 'length', unit: 'm', value: 1.5 },
        Dw: { name: 'distance from the mirror to the wall it shows', q: 'length', unit: 'm', value: 5, tex: 'D_w' }
      },
      note: 'Similar triangles from the eye through the edges of the mirror to the image of the wall, which is as far behind the mirror as the wall is in front.',
      stories: { Wv: 'A mirror {w} wide hangs at one end of a room. You stand {d} from it and the opposite wall is {Dw} from the mirror. How much of that wall do you see?' }
    },
    {
      name: 'Field of view through a mirror',
      expr: 'fov = 2*atan(w/(2*d))', tex: '\\varphi = 2\\arctan\\frac{w}{2d}',
      vars: {
        fov: { name: 'angle of the scene you see', q: 'angle', unit: '°', tex: '\\varphi' },
        w: { name: 'width of the mirror', q: 'length', unit: 'cm', value: 17 },
        d: { name: 'distance from your eye to the mirror', q: 'length', unit: 'cm', value: 60 }
      },
      note: 'For a plane mirror this is the angle at your eye subtended by the mirror, the same as looking through a window of that size.',
      stories: { fov: 'A flat mirror {w} wide is {d} from the driver\'s eye. Through what angle does the driver see the road behind?' }
    }
  ],
  examples: [
    {
      title: 'A mirror for the hall',
      q: 'A person 1.80 m tall has her eyes 1.69 m above the floor. How tall a mirror does she need to see herself from head to foot, and how high above the floor must its lower edge be?',
      steps: [
        { text: 'The lower edge is half the eye height, the upper edge halfway between the eyes and the crown:', tex: 'y_\\text{bottom} = \\frac{1.69}{2} = 0.845\\ \\mathrm{m} \\qquad y_\\text{top} = \\frac{1.69 + 1.80}{2} = 1.745\\ \\mathrm{m}' },
        'The height is $1.745 - 0.845 = 0.90$ m, half her height, and it does not depend on her distance from the mirror.'
      ],
      a: 'A mirror 0.90 m tall hung with its lower edge 0.845 m above the floor.'
    },
    {
      title: 'How much of the room?',
      q: 'A mirror 0.60 m wide hangs at one end of a room 5.0 m long. You stand 1.5 m from it. How wide a stretch of the opposite wall do you see in it?',
      steps: [
        'The image of the far wall is 5.0 m behind the mirror, so 6.5 m from your eye. By similar triangles through the edges of the mirror,',
        { tex: 'W_v = w\\,\\frac{d + D_w}{d} = 0.60 \\times \\frac{1.5 + 5.0}{1.5} = 2.6\\ \\mathrm{m}' }
      ],
      a: '2.6 m of the far wall — more than four times the width of the mirror, because it is the window to a distant image.'
    }
  ],
  quiz: [
    { q: 'You stand 2 m from a plane mirror. How far are you from your image?', choices: ['2 m', '4 m', '1 m', '6 m'], a: 1, why: 'The image is 2 m behind the mirror, so it is $2 + 2 = 4$ m from you.' },
    { q: 'You walk towards a plane mirror at 1 m/s. At what speed does your image approach you?', choices: ['1 m/s', '2 m/s', '0.5 m/s', '4 m/s'], a: 1, why: 'You move 1 m closer to the mirror each second and so does the image, in the other direction: the gap closes by 2 m each second.' },
    { q: 'To see all of yourself in a plane mirror you must step far back, so that a short mirror will do.', a: false, why: 'The required height, half your own, does not depend on distance. What changes with distance is how much of the room you see.' },
    { q: 'A woman 1.68 m tall wants a mirror in which she can just see her whole body. What is its minimum height in metres?', answer: 0.84, unit: 'm', why: 'Half her height: $1.68/2 = 0.84$ m.' },
    { q: 'What does a plane mirror really reverse?', choices: ['Left and right', 'Top and bottom', 'Front and back, along the line perpendicular to the mirror', 'Nothing: the image is identical to the object'], a: 2, why: 'Left, right, up and down stay on the same sides of the room; the direction perpendicular to the mirror is reversed, which makes an opposite-handed copy.' }
  ],
  applications: [
    'Bathroom, dressing and wardrobe mirrors: a mirror half the height of the user is sufficient, hung with the lower edge at half the eye height.',
    'Interior rear-view mirrors and the lettering reversed on ambulances, so it reads correctly in the mirror.',
    'Interior design: a large wall mirror doubles the apparent depth of a room.',
    'Folding mirrors in instruments: a plane mirror bends an optical path without changing the image size, as in a periscope or a Newtonian telescope ([[two-mirrors-and-kaleidoscopes]]).',
    'Stage illusions in which a sheet of glass shows an image of a hidden actor ([[peppers-ghost-and-stage-illusions]]).'
  ],
  history: 'Polished obsidian mirrors from Çatalhöyük in Anatolia date from about 6000 BC, and bronze, polished copper and silver followed. Venice made glass mirrors backed with a tin–mercury amalgam from the sixteenth century. Justus von Liebig\'s chemical silvering of glass (1835) made good mirrors cheap, and Léon Foucault\'s silver-on-glass telescope mirrors (1857) made large reflecting telescopes practical.',
  sources: [
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — plane mirrors and virtual images.',
    'F. A. Jenkins and H. E. White, *Fundamentals of Optics* — the chapters on reflection and image formation at plane surfaces.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE) — plane mirrors and their images.'
  ],
  sim: 'rm-plane-mirror'
},

/* ================================================================ two mirrors */
{
  id: 'two-mirrors-and-kaleidoscopes', parent: 'reflection-and-mirrors', title: 'Two mirrors: periscopes and kaleidoscopes', level: 2,
  short: 'Two mirrors hinged at an angle α make 360°/α − 1 images of an object: that is the kaleidoscope. A ray that reflects once from each is turned through exactly 2α whatever its direction: that is the periscope, the pentaprism, and at 90° the corner reflector.',
  keywords: ['kaleidoscope', 'two mirrors', 'angled mirrors', 'periscope', 'images in two mirrors', 'number of images', 'penta prism', 'pentaprism', 'deviation', 'parallel mirrors', 'infinity mirror', 'dihedral', 'multiple images', 'Brewster', 'constant deviation'],
  prereq: ['law-of-reflection', 'plane-mirror-images'],
  related: ['retroreflectors', 'prism-types', 'periscopes-and-endoscopes', 'mirrors-as-components', 'viewfinders-and-focusing-screens', 'physics:plane-mirrors'],
  body: `
One mirror shows one image. Two mirrors facing each other show the image of the image, and the image of that. Hinge them at an angle $\\alpha$ and the images of an object arrange themselves on a circle around the hinge.

### Counting the images
Each reflection puts a new image at the mirror image of the last. The images march round the hinge in steps of $2\\alpha$ until they would land in front of a mirror. When $360°/\\alpha$ is a whole number the count is

$$N = \\frac{360°}{\\alpha} - 1$$

so with the object itself there is one copy in each sector of angle $\\alpha$:

| mirror angle α | 180° | 120° | 90° | 72° | 60° | 45° | 30° | parallel |
|---|---|---|---|---|---|---|---|---|
| images N | 1 | 2 | 3 | 4 | 5 | 7 | 11 | endless |

Images made by an odd number of reflections are mirror-reversed; those made by an even number are the object itself, turned about the hinge. If $360°/\\alpha$ is not a whole number the count depends on where the object stands and where you look from. Angles that divide 180° (90°, 60°, 45°, 36°, 30°) give an even number of sectors that join seamlessly; at 72° the last two images meet at a seam where they do not match.

### The kaleidoscope
A kaleidoscope sets two or three long mirror strips in a tube at 60°, 45° or 30°. At one end a cell of loose coloured glass and beads, lit from behind, is viewed through a peephole at the other. Whatever lies in one sector is repeated in all the others, so the pattern has the six-, eight- or twelve-fold symmetry of the sectors, and turning the tube makes a new one.

### The turn by two mirrors
Send a ray in so that it reflects once from each mirror. Whatever its direction, it leaves turned through **$2\\alpha$**. A reflection in a mirror at angle $\\beta$ turns a ray of direction $\\phi$ into $2\\beta - \\phi$; a second mirror at $\\beta + \\alpha$ turns that into $\\phi + 2\\alpha$. The first mirror's angle $\\beta$ has dropped out, so the whole pair can be rotated and the turn does not change.

- **$\\alpha = 45°$ turns the beam by 90°**, however the pair is tilted in the plane: the principle of the pentaprism ([[prism-types]]), of the optical square for laying out right angles, and of the pentamirror in a camera viewfinder.
- **$\\alpha = 90°$ turns it by 180°**: the beam goes back parallel to the way it came, a flat corner reflector; add a third mirror and it is a corner cube ([[retroreflectors]]).
- **Parallel mirrors, $\\alpha = 0$, do not turn the beam, only shift it.**

### The periscope
Two parallel mirrors at 45° to the line of sight carry the beam sideways without turning it: the line of sight is raised by the distance between the mirrors, and the image is upright and not reversed, because the second reflection undoes the first. A trench or toy periscope is two mirrors in a box. Binocular and military periscopes use prisms, which reflect totally and lose nothing ([[periscopes-and-endoscopes]]); a submarine periscope adds lenses to relay the image up a tube several metres long.

> [!key] Two mirrors at angle α make 360°/α − 1 images, and a ray reflected once from each is turned by exactly 2α, whatever its direction.
`,
  ideas: [
    'Two mirrors at angle α form 360°/α − 1 images when that number is a whole number; with the object they fill the circle.',
    'Odd numbers of reflections give mirror-reversed images; even numbers give turned copies of the object.',
    'A ray reflected once from each of two mirrors at angle α is turned through 2α, independently of its direction.',
    'At 45° the turn is a constant 90°, the basis of the pentaprism; at 90° the beam is sent back parallel, the basis of the corner reflector.',
    'Parallel mirrors shift a beam without turning it, which is how a periscope raises the line of sight.'
  ],
  pitfalls: [
    'Two mirrors at 90° give two images — They give three: one in each mirror, and a third, formed by two reflections, that appears in the corner. It is the object itself, turned through 180° about the hinge.',
    'The turn depends on how the ray enters — The total turn after one reflection from each mirror is 2α for every ray in the plane perpendicular to the hinge. Only the individual angles of incidence change.',
    'N = 360°/α − 1 holds for any angle — It holds when 360°/α is a whole number. For other angles the count is the integer part of 360°/α or one less, depending on the position of the object and of the eye.',
    'A periscope turns the picture upside down — It does not. Two reflections undo each other, so the image is upright and not left–right reversed; it is merely raised.'
  ],
  terms: [
    { term: 'Kaleidoscope', def: 'A tube containing two or three mirrors at an angle that divides 180°, and a cell of loose coloured pieces. Repeated reflection gives a symmetrical pattern. The name is from the Greek for "beautiful form to see".' },
    { term: 'Dihedral angle', also: ['mirror angle'], def: 'The angle α between two mirror planes. It fixes the number of images, 360°/α − 1, and the deviation of a ray reflected once from each, 2α.' },
    { term: 'Periscope', def: 'An instrument that raises or shifts the line of sight with two parallel mirrors or prisms at 45°, so that one can see over or round an obstacle. The image stays upright.' },
    { term: 'Constant deviation', also: ['constant-deviation reflector'], def: 'A property of a pair of mirrors or prisms whose total turn of a beam depends only on the angle between them, so that rotating the assembly leaves the exit direction unchanged.' }
  ],
  formulas: [
    {
      name: 'Number of images in two mirrors',
      expr: 'N = 2*pi/a - 1', tex: 'N = \\frac{360^\\circ}{\\alpha} - 1',
      vars: {
        N: { name: 'number of images' },
        a: { name: 'angle between the mirrors', q: 'angle', unit: '°', value: 60, min: 5, max: 180, tex: '\\alpha' }
      },
      note: 'Valid when 360°/α is a whole number; the count then does not depend on where the object stands.',
      stories: { N: 'Two mirrors are set at {a} to each other. How many images of a small object between them can be seen?', a: 'A kaleidoscope pattern must show {N} images of each bead. At what angle are its mirrors set?' }
    },
    {
      name: 'Turn of a ray reflected once from each of two mirrors',
      expr: 'dev = 2*a', tex: '\\delta = 2\\alpha',
      vars: {
        dev: { name: 'angle through which the ray is turned', q: 'angle', unit: '°', tex: '\\delta' },
        a: { name: 'angle between the mirrors', q: 'angle', unit: '°', value: 45, min: 0, max: 90, tex: '\\alpha' }
      },
      note: 'For a ray in the plane perpendicular to the line where the mirrors meet, which reflects once from each. At 90° the beam returns parallel to itself.',
      stories: { dev: 'A ray reflects once from each of two mirrors set {a} apart. Through what angle is it turned?', a: 'Two mirrors must turn a beam through {dev}, whatever its direction. At what angle are they set?' }
    }
  ],
  examples: [
    {
      title: 'A twelve-fold kaleidoscope',
      q: 'A kaleidoscope is to show a pattern with twelve-fold symmetry. At what angle are its two mirrors set, and how many images of each bead does it show?',
      steps: [
        'Twelve sectors of equal angle fill the circle: $\\alpha = 360°/12 = 30°$.',
        { text: 'The images are the other sectors:', tex: 'N = \\frac{360°}{30°} - 1 = 11' }
      ],
      a: 'Mirrors at 30° show 11 images of each bead, so with the bead itself there are 12 copies. Because 30° divides 180°, the copies join seamlessly.'
    },
    {
      title: 'A right-angle turn that survives a bump',
      q: 'Two mirrors are to turn a beam through exactly 90° in a surveying instrument. At what angle are they set, and what happens to the outgoing beam if the pair is rotated by 1° about the axis perpendicular to the plane of the beam?',
      steps: [
        'The turn is $2\\alpha = 90°$, so $\\alpha = 45°$.',
        'The turn depends only on $\\alpha$, not on how the pair is oriented. Rotating the pair by 1° changes the angles of incidence on both mirrors by 1° but leaves the 90° turn alone, and the outgoing beam still leaves exactly at right angles to the incoming one.'
      ],
      a: 'Mirrors 45° apart. The outgoing beam is still turned by exactly 90°: the pentaprism principle, which is why the optical square and the pentaprism are reliable right-angle references. A single 45° mirror would have turned the beam by 2° in the same case.'
    }
  ],
  quiz: [
    { q: 'Two plane mirrors meet at 90°. How many images of an object between them can you see?', choices: ['2', '3', '4', '5'], a: 1, why: '$360°/90° - 1 = 3$: one in each mirror and one, formed by two reflections, in the corner.' },
    { q: 'A ray reflects once from each of two mirrors set at 60°. Through what angle is it turned?', choices: ['60°', '90°', '120°', '180°'], a: 2, why: 'The turn is $2\\alpha = 120°$ whatever the direction of the ray.' },
    { q: 'An image formed by two reflections is mirror-reversed.', a: false, why: 'Each reflection reverses front to back; two reflections undo each other, so the image formed after two is the object itself, merely turned about the hinge.' },
    { q: 'How many images of an object do two mirrors set at 36° show?', answer: 9, why: '$360°/36° - 1 = 9$.' },
    { q: 'Why does a periscope give an upright picture that is not left–right reversed?', choices: ['Two reflections: the second undoes the reversal of the first', 'Its lenses invert the image', 'The mirrors are curved', 'Light bends in glass'], a: 0, why: 'A single mirror makes an opposite-handed image; a second reflection restores the handedness, and a parallel pair does not turn the picture over.' }
  ],
  applications: [
    'Kaleidoscopes and decorative mirror effects; the three-way mirror in a shop turns a head and shows its profile as well.',
    'Periscopes for trenches, vehicles, submarines and mirror-box viewers, and the periscope lens of a hand-held viewer for seeing over a crowd.',
    'The pentaprism or pentamirror in a camera viewfinder, and the optical square used on building sites to set out right angles.',
    '"Infinity mirrors": two nearly parallel mirrors, one half-silvered, with a ring of lamps between them, show a tunnel of repeating images.',
    'Retroreflecting corners, which are two mirrors at 90° extended to three in the corner cube ([[retroreflectors]]).'
  ],
  history: 'Sir David Brewster, studying the polarization of light by reflection from mirrors, invented the kaleidoscope in 1816 and patented it in 1817; he named it from the Greek *kalos* (beautiful), *eidos* (form) and *skopein* (to look at). It became a craze in Britain and France within months and was soon pirated everywhere. He described the optics in *A Treatise on the Kaleidoscope* (1819).',
  sources: [
    'D. Brewster, *A Treatise on the Kaleidoscope* (Edinburgh, 1819) — the invention and its optics.',
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — plane mirrors, images in combinations of mirrors, and prisms.',
    'F. A. Jenkins and H. E. White, *Fundamentals of Optics* — images formed by two plane mirrors.'
  ],
  sim: 'rm-two-mirrors'
},

/* ================================================================ retroreflectors */
{
  id: 'retroreflectors', parent: 'reflection-and-mirrors', title: 'Retroreflectors and corner cubes', level: 2,
  short: 'A retroreflector sends light back towards its source from whichever direction it arrives. Three mutually perpendicular mirrors (a corner cube) do it by reversing each component of the direction; a glass bead with its focus on its back does it with a lens. They make road signs, bicycle reflectors, survey prisms and the reflectors on the Moon.',
  keywords: ['retroreflector', 'retroreflection', 'corner cube', 'corner reflector', 'cube corner', 'cat\'s eye', 'retroreflective sheeting', 'glass bead', 'triple mirror', 'Apollo', 'lunar laser ranging', 'road sign', 'bicycle reflector', 'observation angle', 'entrance angle', 'coefficient of retroreflection', 'survey prism'],
  prereq: ['two-mirrors-and-kaleidoscopes', 'critical-angle-and-total-internal-reflection'],
  related: ['prism-types', 'mirrors-as-components', 'lambertian-surfaces', 'optical-metrology', 'laser-triangulation', 'michelson-interferometer', 'car-headlamps-and-driver-cameras'],
  body: `
A plane mirror sends a beam off in a new direction unless it is square to it. A **retroreflector** sends it back towards the source, from whichever side it comes. That is why a bicycle reflector glows in car headlamps, a road sign lights up from half a kilometre away, and astronauts left reflectors on the Moon.

### The corner cube
Take three flat mirrors at right angles, like the corner of a room. A ray arriving in direction $(d_x, d_y, d_z)$ meets the three faces in turn, and each reflection reverses one component. After all three the direction is $(-d_x, -d_y, -d_z)$, exactly reversed, whichever face is met first and wherever the ray enters. The returned ray is parallel to the incoming one but shifted: the outgoing line is the incoming line inverted about the corner. (Two mirrors at 90° do the same in a plane: [[two-mirrors-and-kaleidoscopes]].)

A corner cube may be hollow, or a solid glass prism whose three back faces reflect totally: a ray entering the front face squarely meets them at 54.7°, beyond the 41.2° critical angle of N-BK7, so they need no coating. Its quality is the angle between the returned and the reversed incoming ray: a few arc seconds for a catalogue part, under one for a precision one, set by how well the three faces are square to one another.

### The cat's eye
A lens with a mirror at its focus works the same way: the lens focuses the beam on the mirror, the mirror sends it back, and the lens turns it parallel again, for any direction within its field. A glass ball is its own cat's eye when its index is 2: the focal length of a ball lens, measured from its centre, is

$$f = \\frac{nR}{2(n-1)}$$

which equals the radius $R$ when $n = 2$, so the focus lies on the back surface and a mirror coating there returns the light. Real beads have an index of about 1.9 and sit in a binder at a suitable spacing; the beads are tens of micrometres across in sheeting and up to a millimetre in road paint. At $n = 1.5$ the focus lies half a radius behind the ball, so a plain glass bead does not retroreflect.

### Why not a mirror, or white paint?
A mirror returns a headlamp's light only if the sign is exactly square to it. White paint scatters it into a hemisphere. A retroreflector returns it into a cone about a degree wide, so it reaches the driver's eyes beside the lamps, at an **observation angle** of 0.34° for lamps 0.6 m from the eye at 100 m. The **coefficient of retroreflection** $R_A$ (candela per lux per square metre) gives the numbers: a white Lambertian surface of reflectance 0.8 has $R_A = \\rho/\\pi \\approx 0.25$, engineering-grade sheeting about 70, and the best prismatic sheeting several hundred, at an observation angle of 0.2° and an entrance angle of −4°.

### The Moon
Apollo 11 left a 10 × 10 array of fused-silica corner cubes, each 3.8 cm across, on the Moon in July 1969; Apollo 14 left a similar array and Apollo 15 one of 300 cubes. A laser pulse returns after about 2.56 s, and $d = ct/2$ gives the distance, to millimetres once many pulses are averaged. Diffraction at each 3.8 cm cube spreads the returning beam into a cone about 7 km in radius at the Earth, so few photons return: often fewer than one per second.

> [!key] A corner cube reverses all three components of a ray's direction; a glass ball of index 2 puts its focus on its own back. Either returns the light to its source — a mirror cannot.
`,
  ideas: [
    'A corner cube (three mutually perpendicular mirrors) reverses each component of a ray\'s direction: the ray comes back parallel to the one that went in, but shifted.',
    'A solid glass corner cube works by total internal reflection; hollow ones use three mirrors.',
    'A cat\'s eye puts a mirror at the focus of a lens; a glass ball of index 2 has its focus on its own back surface.',
    'Sheeting for road signs is millions of tiny corner cubes or glass beads; it is made to return light into a cone about a degree wide so that it reaches the driver\'s eyes.',
    'Corner cubes on the Moon return laser pulses from Earth, whose time of flight gives the distance to millimetres.'
  ],
  pitfalls: [
    'A retroreflector is just a mirror — A mirror returns light only if it is square to it. A retroreflector returns it from a wide range of angles, because its three faces (or its lens and mirror) always give back the reversed direction.',
    'The returned ray lies on the incoming ray — It is parallel to it but displaced, symmetrically about the corner of the cube; the shift is twice the distance of the ray from the corner\'s axis.',
    'Retroreflective sheeting glows because it contains a light source — It reflects the light of the vehicle\'s own lamps; with no lamp shining on it, it is dark.',
    'Any glass sphere is a retroreflector — Only if its focus falls on the reflecting surface, which needs an index near 2 (or a spacer behind a bead of lower index). A 1.5 sphere focuses the light behind itself.'
  ],
  terms: [
    { term: 'Retroreflector', also: ['retroreflection', 'retro-reflector'], def: 'A device or surface that returns light towards its source, parallel to the incoming direction, over a wide range of angles of arrival.' },
    { term: 'Corner cube', also: ['cube corner', 'corner-cube prism', 'triple mirror', 'trihedral reflector'], def: 'Three mutually perpendicular reflecting faces meeting at a corner, hollow or as the back of a glass prism. It reverses every ray\'s direction.' },
    { term: 'Cat\'s-eye retroreflector', also: ['lens-and-mirror retroreflector'], def: 'A retroreflector made of a lens with a mirror at its focus (not to be confused with the cat\'s-eye shape of out-of-focus highlights). A glass ball of index 2 with a mirrored back is one in a single piece.' },
    { term: 'Observation angle', also: ['divergence angle'], def: 'In retroreflection, the angle between the line from the light source to the reflector and the line from the reflector to the observer. It is small: 0.2° to 2° for a driver.' },
    { term: 'Entrance angle', also: ['incidence angle'], def: 'In retroreflection, the angle between the illumination direction and the normal to the reflector. A sign turned away from the road has a large entrance angle.' },
    { term: 'Coefficient of retroreflection', also: ['R_A', 'RA', 'cd/lx/m²'], def: 'The luminous intensity returned by a retroreflecting surface per unit illuminance at the reflector and per unit area, in candela per lux per square metre. Specified at set observation and entrance angles.' },
    { term: 'Retroreflective sheeting', def: 'Thin material for signs and markings that carries a layer of microscopic glass beads or moulded micro-prisms and returns light towards its source.' }
  ],
  formulas: [
    {
      name: 'Distance from a laser echo',
      expr: 'd = c*t/2', tex: 'd = \\frac{c\\,t}{2}',
      vars: {
        d: { name: 'distance to the reflector', q: 'length', unit: 'km' },
        c: { const: 'c' },
        t: { name: 'round-trip time of the pulse', q: 'time', unit: 's', value: 2.56 }
      },
      note: 'The light goes out and comes back, hence the 2. Every nanosecond of round-trip time is 15 cm of distance.',
      stories: { d: 'A laser pulse sent to a reflector on the Moon is received {t} later. How far away is the reflector?' }
    },
    {
      name: 'Focal length of a ball lens',
      expr: 'f = n*R/(2*(n - 1))', tex: 'f = \\frac{nR}{2(n-1)}',
      vars: {
        f: { name: 'focal length, measured from the centre of the ball', q: 'length', unit: 'mm' },
        n: { name: 'refractive index', value: 1.9, min: 1.05, max: 4 },
        R: { name: 'radius of the ball', q: 'length', unit: 'mm', value: 1 }
      },
      note: 'When f = R the focus lies on the back surface: n = 2.',
      stories: { f: 'A glass ball of index {n} and radius {R} focuses parallel light. How far from its centre is the focus?', n: 'A ball of radius {R} focuses parallel light {f} from its centre. What is its refractive index?' }
    },
    {
      name: 'Diffraction spread of the returned beam',
      expr: 'th = 1.22*lambda/D', tex: '\\theta = 1.22\\,\\frac{\\lambda}{D}',
      vars: {
        th: { name: 'half-angle of the returned cone (to the first dark ring)', q: 'angle', unit: 'µrad', tex: '\\theta' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 532, tex: '\\lambda' },
        D: { name: 'diameter of the cube\'s front face', q: 'length', unit: 'mm', value: 38 }
      },
      note: 'The ideal spread, set by the aperture alone. Real arrays also have velocity aberration and slightly imperfect cubes.',
      stories: { th: 'A corner cube {D} across returns {lambda} light. By what half-angle does the returned beam spread?' }
    },
    {
      name: 'Observation angle',
      expr: 'ob = atan(sep/L)', tex: '\\alpha_o = \\arctan\\frac{s}{L}',
      vars: {
        ob: { name: 'observation angle', q: 'angle', unit: '°', tex: '\\alpha_o' },
        sep: { name: 'distance from the lamp to the observer\'s eye', q: 'length', unit: 'm', value: 0.6, tex: 's' },
        L: { name: 'distance to the reflector', q: 'length', unit: 'm', value: 100 }
      },
      note: 'Why the cone of a retroreflector need only be a degree wide.',
      stories: { ob: 'A driver\'s eyes are {sep} from the headlamps and a sign is {L} ahead. What is the observation angle?' }
    }
  ],
  examples: [
    {
      title: 'The Moon\'s distance from one echo',
      q: 'A laser pulse is sent to the reflectors on the Moon and the echo returns 2.563 s later. How far away is the Moon, and by how much would the round-trip time change if the Moon were 3.8 cm farther?',
      steps: [
        { text: 'The pulse travels out and back:', tex: 'd = \\frac{ct}{2} = \\frac{299\\,792\\,458 \\times 2.563}{2} = 3.842 \\times 10^8\\ \\mathrm{m}' },
        { text: '3.8 cm farther adds 7.6 cm to the round trip:', tex: '\\Delta t = \\frac{2 \\times 0.038}{c} = 2.5 \\times 10^{-10}\\ \\mathrm{s}' }
      ],
      a: 'About 384 200 km. The extra 3.8 cm (about what the Moon recedes in a year) changes the echo time by a quarter of a nanosecond, which is why the ranging needs picosecond timing.'
    },
    {
      title: 'How far does a 3.8 cm cube spread the light?',
      q: 'Each Apollo cube is 38 mm across and the laser wavelength is 532 nm. Taking diffraction by the aperture alone, what is the half-angle of the returned cone, and how large is it at the Earth, 384 400 km away?',
      steps: [
        { text: 'The first dark ring of the diffraction pattern of a circular aperture is at', tex: '\\theta = 1.22\\,\\frac{\\lambda}{D} = 1.22 \\times \\frac{532 \\times 10^{-9}}{0.038} = 17\\ \\mu\\mathrm{rad}' },
        { text: 'Over the distance to the Moon this is a radius of', tex: 'r = 17 \\times 10^{-6} \\times 3.844 \\times 10^{8}\\ \\mathrm{m} = 6.6\\ \\mathrm{km}' }
      ],
      a: 'A half-angle of 17 µrad and a spot of about 6.6 km radius on the Earth: the beam from each cube is spread so widely that only a few of the photons sent out are returned to a telescope.'
    }
  ],
  quiz: [
    { q: 'Three mutually perpendicular mirrors (a corner cube) return an incoming ray…', choices: ['only if it arrives along the cube\'s axis', 'parallel to, and in the opposite direction from, the way it arrived, from any direction within its field', 'at the same angle on the other side of the normal', 'scattered in all directions'], a: 1, why: 'Each reflection reverses one component of the direction, so three reverse all of them: the ray comes back parallel to the incoming one, whichever way it entered.' },
    { q: 'How many reflections does a ray make in a corner cube?', choices: ['1', '2', '3', '4'], a: 2, why: 'One from each of the three faces, in some order.' },
    { q: 'A glass sphere of refractive index 2 focuses parallel light on its own back surface.', a: true, why: '$f = nR/[2(n-1)] = R$ for $n = 2$: the focal length from the centre equals the radius.' },
    { q: 'A ball lens has index 1.5 and radius 5 mm. How far, in millimetres, is its focus from its centre?', answer: 7.5, unit: 'mm', why: '$f = nR/[2(n-1)] = 1.5 \\times 5/(2 \\times 0.5) = 7.5$ mm, 2.5 mm beyond the back surface.' },
    { q: 'Why does retroreflective sheeting make a road sign far brighter than white paint at night?', choices: ['It returns the headlamp light into a narrow cone towards the lamps, whereas white paint scatters it over a hemisphere', 'It emits light of its own', 'It absorbs glare', 'It is a metal and so reflects better'], a: 0, why: 'The sign\'s brightness to the driver depends on how much light is returned towards the lamps and the driver\'s eyes; the retroreflector concentrates it there.' }
  ],
  applications: [
    'Road signs, lane markings, cat\'s-eye road studs, vehicle outlines, bicycle reflectors and high-visibility clothing.',
    'Survey prisms on a pole for total stations and laser trackers; laser interferometers use a corner cube as a mirror whose return does not depend on its tilt.',
    'Satellite laser ranging: the LAGEOS satellites carry 426 reflectors; and the lunar arrays of Apollo 11, 14 and 15 and of two Soviet rovers.',
    'Safety and security: retroreflective tape on equipment; light barriers whose reflector sends the beam back to the sensor beside the emitter.',
    'Interferometers and alignment: a retroreflector returns the beam parallel to itself and so removes the need to align a mirror square to it.'
  ],
  history: 'The corner cube is old in principle; its large-scale use began with reflective sheeting made of glass beads in the late 1930s, followed by moulded prisms. Percy Shaw of Halifax patented the road stud with two glass lenses in a rubber mounting in 1934. The Apollo 11 array was deployed on 21 July 1969 and first ranged within weeks; lunar laser ranging has since shown that the Moon recedes by about 3.8 cm a year.',
  sources: [
    'P. L. Bender et al., "The Lunar Laser Ranging Experiment", *Science* 182 (1973) 229–238 — the Apollo arrays and the first results.',
    'CIE 54.2, *Retroreflection: Definition and Measurement* — observation and entrance angles and the coefficient of retroreflection.',
    'ASTM D4956, *Standard Specification for Retroreflective Sheeting for Traffic Control*.',
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — corner-cube reflectors among the prisms.'
  ],
  sim: 'rm-retroreflector'
},

/* ================================================================ curved mirrors */
{
  id: 'curved-mirrors', parent: 'reflection-and-mirrors', title: 'Concave and convex mirrors', level: 2,
  short: 'A concave mirror gathers parallel light to a focus at half its radius of curvature, f = R/2; a convex mirror spreads it as if from a point behind the glass. A mirror has no colour error, which is why large telescopes, searchlights and dishes are mirrors.',
  keywords: ['concave mirror', 'convex mirror', 'focal length', 'radius of curvature', 'centre of curvature', 'focus', 'focal point', 'vertex', 'principal axis', 'spherical mirror', 'magnifying mirror', 'f = R/2', 'mirror power', 'sagitta', 'real is positive', 'converging', 'diverging'],
  prereq: ['law-of-reflection', 'plane-mirror-images', 'the-paraxial-approximation'],
  related: ['the-mirror-equation', 'mirror-ray-diagrams', 'focal-length-and-optical-power', 'spherical-mirror-aberration', 'reflecting-telescopes', 'axial-chromatic-aberration', 'physics:spherical-mirrors'],
  body: `
Hold a shiny spoon at arm's length. The bowl shows you upside down (a concave surface); the back shows you upright and small (a convex one). Both are curved mirrors, and a few words describe them all.

### The vocabulary
- The **vertex** is the middle of the mirror's surface; the line through it and the centre of curvature is the **principal axis**.
- The **centre of curvature** C is the centre of the sphere of which the mirror is a piece; $R$ is its radius, the **radius of curvature**.
- The **focal point** F is where rays parallel to the axis meet (concave), or from where they seem to come (convex); the **focal length** $f$ is the distance from the vertex to F.
- The **aperture** $D$ is the diameter, and $N = f/D$ the f-number, as for a lens ([[the-f-number]]).

### Why f = R/2
A ray parallel to the axis hits the mirror at height $h$. The normal there is the radius to C, at an angle $\\theta$ to the axis with $\\sin\\theta = h/R$. By [[law-of-reflection|the law of reflection]] the ray leaves at $2\\theta$ to the axis and crosses it at a distance $R - R/(2\\cos\\theta)$ from the vertex. For rays close to the axis $\\cos\\theta \\to 1$ and every ray crosses at

$$f = \\frac{R}{2}$$

A mirror of radius 2 m has a focal length of 1 m. With the "real is positive" convention used for single mirrors, a concave (converging) mirror has $f > 0$ and a convex (diverging) mirror $f < 0$. Its power in dioptres is $P = 1/f = 2/R$: 2.5 D for $R = 0.8$ m.

### Shallow dishes
A mirror is shallow. A 200 mm mirror of radius 2 m (f = 1 m, f/5) is only $s = R - \\sqrt{R^2 - (D/2)^2} \\approx D^2/8R = 2.5$ mm deep at its edge.

| | concave | convex |
|---|---|---|
| shape facing the light | hollow | bulging |
| $f$ | positive | negative |
| parallel light | meets at a real focus | spreads as if from a virtual focus behind the glass |
| image | real and inverted, or virtual, upright and magnified | always virtual, upright and smaller |
| uses | telescopes, shaving mirrors, headlamps, dishes | car mirrors, security domes, shop corners |

### Why a mirror rather than a lens?
- **No colour error.** The law of reflection does not depend on the wavelength, so every colour has the same focus (compare a lens, [[axial-chromatic-aberration]]).
- **One surface, and the glass is never in the beam.** A telescope mirror can be supported across its whole back; a lens of the same size can only be held at the rim.
- **Any wavelength.** The same shape focuses with a suitable coating from X-rays at grazing incidence to radio waves.
- **The cost**: a surface error $\\delta$ puts $2\\delta$ of path error into the reflected beam, but only about $(n-1)\\delta \\approx 0.5\\,\\delta$ through a glass surface, so a mirror must be roughly four times as accurately made as a lens; and the detector sits in the incoming beam unless the system is folded or used off axis.

> [!key] A concave mirror's focus is at $f = R/2$; a convex mirror's, at the same distance behind the glass, is virtual. Mirrors focus every colour alike but must be made four times as accurately as lenses.
`,
  ideas: [
    'A spherical mirror of radius R has focal length f = R/2, measured from its vertex, for rays close to the axis.',
    'Concave mirrors converge light (f > 0); convex mirrors diverge it (f < 0), with the virtual focus behind the glass.',
    'A mirror has no chromatic aberration: reflection does not depend on wavelength.',
    'A telescope mirror is only a few millimetres deep: a 200 mm f/5 mirror has a sag of 2.5 mm.',
    'A mirror surface error counts twice (path 2δ), so mirrors must be made about four times as accurately as lens surfaces.'
  ],
  pitfalls: [
    'The focus of a mirror is at its centre of curvature — The centre of curvature is at R; the focus is halfway, at R/2. An object at C forms its image at C.',
    'A convex mirror has no focus — It has a virtual one: reflected rays seem to come from a point a distance |f| = R/2 behind the mirror.',
    'The focal length changes with colour, as for a lens — It does not: the law of reflection does not involve wavelength. A mirror telescope has no colour fringes from its mirrors.',
    'A deeper mirror always focuses better — A sphere deeper than about f/10 develops spherical aberration; the cure is a paraboloid, not more depth.'
  ],
  terms: [
    { term: 'Concave mirror', also: ['converging mirror'], def: 'A mirror whose reflecting surface curves in like the inside of a bowl. It brings parallel light to a real focus and has a positive focal length.' },
    { term: 'Convex mirror', also: ['diverging mirror'], def: 'A mirror whose reflecting surface bulges out toward the light. It spreads parallel light as if from a virtual focus behind the glass and has a negative focal length.' },
    { term: 'Centre of curvature of a mirror', also: ['centre of curvature'], def: 'The centre of the sphere of which a spherical mirror is a piece. It lies on the axis at a distance R from the vertex; a ray aimed at it reflects straight back. The focal length is half of R.' },
    { term: 'Spherical mirror', also: ['spherical reflector'], def: 'A mirror whose surface is a part of a sphere. Rays near its axis focus at half the radius; it is the easiest curved mirror to make, and it is shallow: a 200 mm f/5 mirror is only 2.5 mm deep.' },
    { term: 'Vertex', also: ['pole'], def: 'The point where the principal axis meets the mirror surface: the middle of the mirror. Distances are measured from it.' },
    { term: 'Principal axis of a mirror', also: ['mirror axis'], def: 'The straight line through the vertex and the centre of curvature of a mirror; the line of symmetry about which it is rotationally symmetric.' }
  ],
  formulas: [
    {
      name: 'Focal length of a spherical mirror',
      expr: 'f = R/2', tex: 'f = \\frac{R}{2}',
      vars: {
        f: { name: 'focal length', q: 'length', unit: 'cm', signed: true },
        R: { name: 'radius of curvature', q: 'length', unit: 'cm', value: 80, signed: true }
      },
      note: 'Real is positive: R and f are positive for a concave mirror, negative for a convex one. Valid for rays near the axis.',
      stories: { f: 'A shaving mirror has a radius of curvature of {R}. What is its focal length?', R: 'A concave mirror has a focal length of {f}. What is its radius of curvature?' }
    },
    {
      name: 'Optical power of a mirror',
      expr: 'P = 2/R', tex: 'P = \\frac{2}{R}',
      vars: {
        P: { name: 'optical power', q: 'optpower', unit: 'D', signed: true },
        R: { name: 'radius of curvature', q: 'length', unit: 'm', value: 0.8, signed: true }
      },
      note: 'Power is the reciprocal of the focal length in metres: P = 1/f = 2/R.',
      stories: { P: 'What is the power of a concave mirror with a radius of curvature of {R}?' }
    },
    {
      name: 'Depth of a spherical mirror',
      expr: 's = R - sqrt(R^2 - (D/2)^2)', tex: 's = R - \\sqrt{R^2 - \\left(\\frac{D}{2}\\right)^2}',
      vars: {
        s: { name: 'depth of the dish (sag at the rim)', q: 'length', unit: 'mm' },
        R: { name: 'radius of curvature', q: 'length', unit: 'mm', value: 2000 },
        D: { name: 'diameter of the mirror', q: 'length', unit: 'mm', value: 200 }
      },
      note: 'For a shallow mirror s ≈ D²/(8R) = D²/(16f).',
      stories: { s: 'A telescope mirror {D} across has a radius of curvature of {R}. How deep is it at the centre, compared with its rim?' }
    }
  ],
  examples: [
    {
      title: 'A shaving mirror',
      q: 'A round concave shaving mirror 12 cm across has a radius of curvature of 60 cm. What are its focal length and power, and how deep is the bowl?',
      steps: [
        { text: 'Focal length and power:', tex: 'f = \\frac{R}{2} = 30\\ \\mathrm{cm} \\qquad P = \\frac{1}{0.30\\ \\mathrm{m}} = 3.3\\ \\mathrm{D}' },
        { text: 'The depth at the centre, compared with the rim:', tex: 's = R - \\sqrt{R^2 - (D/2)^2} = 60 - \\sqrt{3600 - 36} = 0.30\\ \\mathrm{cm}' }
      ],
      a: 'f = 30 cm, P = 3.3 D; the bowl is only 3 mm deep.'
    },
    {
      title: 'A driving mirror',
      q: 'A convex mirror on a car has a radius of curvature of 1.4 m. What is its focal length, and where is its focus?',
      steps: [
        'Real is positive, so a convex mirror has negative $R$ and $f$: $f = -R/2$ in magnitude $0.70$ m.',
        'Parallel light from a distant car is spread by the mirror as if it came from a point 0.70 m behind the glass.'
      ],
      a: 'f = −0.70 m: a virtual focus 0.70 m behind the mirror. This is the mirror of [[mirrors-in-daily-life]].'
    }
  ],
  quiz: [
    { q: 'What is the focal length of a concave spherical mirror of radius 80 cm?', choices: ['20 cm', '40 cm', '80 cm', '160 cm'], a: 1, why: '$f = R/2 = 40$ cm.' },
    { q: 'Parallel rays strike a convex mirror. After reflection they…', choices: ['meet at a real focus in front of the mirror', 'spread out as if from a point behind the mirror', 'stay parallel', 'return along their own paths'], a: 1, why: 'A convex mirror diverges parallel light; the reflected rays seem to come from the virtual focus, a distance $R/2$ behind the glass.' },
    { q: 'A concave mirror forms the same focus for blue and for red light.', a: true, why: 'The law of reflection does not depend on the wavelength, so a mirror has no chromatic aberration (unlike a lens, whose refractive index varies with colour).' },
    { q: 'A concave mirror has a radius of curvature of 3.0 m. What is its focal length, in metres?', answer: 1.5, unit: 'm', why: '$f = R/2 = 1.5$ m.' },
    { q: 'Why does a telescope mirror have to be made about four times as accurately, per unit of image quality, as a lens surface?', choices: ['A surface error is doubled on reflection but only about halved when light passes through glass of index 1.5', 'Mirrors are larger than lenses', 'Glass is harder to polish than metal', 'Light is bent more by a mirror'], a: 0, why: 'A height error $\\delta$ changes the path of a reflected ray by $2\\delta$, but of a refracted ray only by $(n-1)\\delta \\approx 0.5\\,\\delta$: a ratio of four.' }
  ],
  applications: [
    'Reflecting telescopes: the primary mirror is concave, from 0.1 m amateur instruments to the 10 m Keck segments and the 39 m segmented mirror of the Extremely Large Telescope.',
    'Shaving, make-up and magnifying mirrors, and dentists\' mirrors: a concave mirror magnifies a face held closer than the focal length.',
    'Torches, car headlamps and searchlights, which put a lamp at the focus of a concave reflector to make a beam.',
    'Satellite dishes and radio telescopes, which are concave mirrors for microwaves; solar cookers and concentrators.',
    'Convex mirrors on cars, at blind corners and in shops, for a wide field of view.'
  ],
  history: 'The story that Archimedes burned the Roman fleet at Syracuse with mirrors in 212 BC is a legend, but burning mirrors were studied by Diocles in the second century BC and by Ibn Sahl in Baghdad in 984, who wrote *On Burning Mirrors and Lenses*. Newton made the first working reflecting telescope in 1668, with a spherical speculum-metal mirror a few centimetres across, precisely because a mirror has no colour error.',
  sources: [
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — spherical mirrors, the focal length and the sign convention.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE) — mirrors, with the real-is-positive and Cartesian conventions side by side.',
    'F. A. Jenkins and H. E. White, *Fundamentals of Optics* — the chapters on reflection at spherical surfaces.'
  ],
  sim: { id: 'rm-mirror-image', params: { inf: true } }
},

/* ================================================================ the mirror equation */
{
  id: 'the-mirror-equation', parent: 'reflection-and-mirrors', title: 'The mirror equation', level: 2,
  short: '1/s_o + 1/s_i = 1/f: with real distances counted positive, an object a distance s_o in front of a mirror of focal length f has its image at s_i, and the magnification is m = −s_i/s_o. A negative image distance means a virtual image behind the mirror.',
  keywords: ['mirror equation', 'mirror formula', 'image distance', 'object distance', 'magnification', 'real image', 'virtual image', 'sign convention', 'real is positive', '1/so + 1/si = 1/f', 'conjugate points', 'Newton', 'paraxial', 'longitudinal magnification', 'concave', 'convex'],
  prereq: ['curved-mirrors', 'real-and-virtual-images', 'the-paraxial-approximation'],
  related: ['mirror-ray-diagrams', 'the-thin-lens-equation', 'newtons-lens-equation', 'lateral-and-longitudinal-magnification', 'spherical-mirror-aberration', 'mirrors-in-daily-life', 'ray-transfer-matrices', 'physics:spherical-mirrors'],
  body: `
You know where the object stands and what mirror you have. Where does the image form, and how big is it? One equation answers both, and it is the same one that serves thin lenses.

### The equation
For an object a distance $s_o$ in front of a mirror of focal length $f$, the image forms at a distance $s_i$ with

$$\\frac{1}{s_o} + \\frac{1}{s_i} = \\frac{1}{f} \\qquad\\qquad m = -\\frac{s_i}{s_o}$$

These pages use the **real-is-positive** convention for single mirrors and lenses (lens-design software uses a Cartesian one, with signed radii; see [[ray-transfer-matrices]]):

- $s_o > 0$ for an object in front of the mirror, the usual case;
- $s_i > 0$ for a **real** image in front of the mirror, where light really crosses and a screen would show it; $s_i < 0$ for a **virtual** image behind it;
- $f > 0$ for a concave mirror, $f < 0$ for a convex one, $f = R/2$;
- $m < 0$ means inverted, $m > 0$ upright, $|m| > 1$ enlarged.

### What it says
A concave mirror with $f = 20$ cm:

| object distance $s_o$ | image distance $s_i$ | $m$ | image |
|---|---|---|---|
| 100 cm | 25 cm | −0.25 | real, inverted, reduced |
| 60 cm | 30 cm | −0.50 | real, inverted, reduced |
| 40 cm (= 2f) | 40 cm | −1 | real, inverted, life size |
| 30 cm | 60 cm | −2 | real, inverted, enlarged |
| 20 cm (= f) | infinity | — | none: the rays leave parallel |
| 10 cm | −20 cm | +2 | virtual, upright, enlarged |
| 5 cm | −6.7 cm | +1.33 | virtual, upright, enlarged |

For a convex mirror with $f = -20$ cm every object gives $s_i$ between $f$ and 0: 40 cm gives −13.3 cm ($m = 0.33$), 100 cm gives −16.7 cm ($m = 0.17$): always virtual, upright and smaller. The special cases are worth knowing: a distant object ($s_o \\to \\infty$) is imaged at $s_i = f$ (the Sun's image is at the focus); an object at $2f$, the centre of curvature, is imaged on itself, life size; an object at $f$ sends the light out parallel, which is how a searchlight works; and inside $f$ the image is the enlarged virtual one of a shaving mirror ([[mirrors-in-daily-life]]).

### Newton's form
Measuring from the focal point instead, $x_o = s_o - f$ and $x_i = s_i - f$, the equation becomes $x_o\\,x_i = f^2$ ([[newtons-lens-equation]]).

### How far the image moves
If the object moves a little, the image moves by the **longitudinal magnification** ([[lateral-and-longitudinal-magnification]]), $m^2$ times as far: $\\mathrm{d}s_i = -m^2\\,\\mathrm{d}s_o$. A real image magnified 3× shifts 9 mm when the object moves 1 mm, which is why focusing a magnified image is so touchy.

### The small print
The equation is a first-order result: it holds for rays close to the axis, where the mirror is shallow compared with its radius. For a wide mirror the rays far from the axis miss the image point ([[spherical-mirror-aberration]]).

> [!key] $1/s_o + 1/s_i = 1/f$ and $m = -s_i/s_o$, real positive. A negative $s_i$ is a virtual image behind the mirror; a negative $m$ is an inverted one.
`,
  ideas: [
    '1/sₒ + 1/sᵢ = 1/f gives the image distance of a mirror, with real distances positive and f = R/2.',
    'The magnification is m = −sᵢ/sₒ: negative for an inverted image, positive for an upright one.',
    'A negative image distance means a virtual image behind the mirror; a positive one is a real image in front of it.',
    'A distant object is imaged at the focus; an object at 2f at 2f; an object at f gives parallel rays; inside f the image is virtual and enlarged.',
    'A convex mirror always gives a virtual, upright, reduced image between the mirror and its focus.'
  ],
  pitfalls: [
    'A negative image distance is an error — It is a result: the image is virtual, behind the mirror. The shaving mirror is the everyday case.',
    'A virtual image can be shown on a screen — It cannot; no light reaches it. Only real images, in front of the mirror, appear on a screen.',
    'Concave mirrors have a negative focal length — Not in the real-is-positive convention, in which a converging mirror has f > 0. In lens-design software, with Cartesian signs, the radius of a concave mirror seen from the left is negative; keep to one convention.',
    'The magnification is simply sᵢ/sₒ — It is −sᵢ/sₒ: the minus sign is what makes real images inverted (m < 0) and virtual ones upright (m > 0).'
  ],
  terms: [
    { term: 'Mirror equation', also: ['mirror formula', 'conjugate equation'], def: '1/sₒ + 1/sᵢ = 1/f: the relation between object distance, image distance and focal length of a mirror (or a thin lens) for rays close to the axis.' },
    { term: 'Image distance of a mirror', def: 'The distance from the mirror\'s vertex to the image given by the mirror equation: positive for a real image in front of the mirror, negative for a virtual image behind it.' },
    { term: 'Real-is-positive convention', also: ['real is positive'], def: 'A sign convention in which distances to real objects and real images are positive and a converging mirror or lens has a positive focal length. The one used for single mirrors and lenses in these pages.' }
  ],
  derivation: {
    title: 'The mirror equation from similar triangles',
    intro: 'Stand an object of height $h_o$ at distance $s_o$ in front of a concave mirror of focal length $f$. Its real image of height $h_i$ (drawn inverted) forms at distance $s_i$. Work with positive lengths.',
    steps: [
      { text: 'The ray from the tip of the object to the vertex reflects at an equal angle on the other side of the axis. The object and its image, with that ray, make two similar right-angled triangles:', tex: '\\frac{h_i}{h_o} = \\frac{s_i}{s_o}' },
      { text: 'The ray parallel to the axis reflects through the focus. Between the mirror and the image plane it falls by $h_o$ over a distance $f$ and then by $h_i$ over the rest, $s_i - f$:', tex: '\\frac{h_i}{h_o} = \\frac{s_i - f}{f}' },
      { text: 'Equate the two ratios and clear the fractions:', tex: '\\frac{s_i}{s_o} = \\frac{s_i - f}{f} \\quad\\Rightarrow\\quad f\\,s_i = s_o s_i - s_o f' },
      { text: 'Divide by $s_o s_i f$:', tex: '\\frac{1}{s_o} = \\frac{1}{f} - \\frac{1}{s_i} \\quad\\Rightarrow\\quad \\frac{1}{s_o} + \\frac{1}{s_i} = \\frac{1}{f}' }
    ]
  },
  formulas: [
    {
      name: 'The mirror equation',
      expr: '1/so + 1/si = 1/f', tex: '\\frac{1}{s_o} + \\frac{1}{s_i} = \\frac{1}{f}',
      vars: {
        so: { name: 'object distance', q: 'length', unit: 'cm', value: 30, tex: 's_o' },
        si: { name: 'image distance (negative: virtual, behind the mirror)', q: 'length', unit: 'cm', signed: true, tex: 's_i' },
        f: { name: 'focal length (positive: concave)', q: 'length', unit: 'cm', value: 20, signed: true }
      },
      solveFor: 'si',
      note: 'Real is positive. For a concave mirror f = R/2 is positive, for a convex one negative. Valid for rays close to the axis.',
      stories: {
        si: 'A candle stands {so} in front of a mirror of focal length {f}. Where is its image?',
        so: 'A mirror of focal length {f} must form an image {si} from itself. Where must the object stand?',
        f: 'An object {so} in front of a mirror has its image {si} from the mirror. What is the focal length?'
      },
      practice: { unknowns: ['si', 'so', 'f'] }
    },
    {
      name: 'Magnification from the object distance',
      expr: 'm = f/(f - so)', tex: 'm = \\frac{f}{f - s_o}',
      vars: {
        m: { name: 'magnification (negative: inverted)', signed: true },
        f: { name: 'focal length (positive: concave)', q: 'length', unit: 'cm', value: 20, signed: true },
        so: { name: 'object distance', q: 'length', unit: 'cm', value: 30, tex: 's_o' }
      },
      note: 'The same as m = −sᵢ/sₒ with the image distance eliminated. At sₒ = 2f, m = −1.',
      stories: { m: 'An object stands {so} in front of a mirror of focal length {f}. What is the magnification?', so: 'A mirror of focal length {f} must give a magnification of {m}. How far from it must the object stand?' }
    },
    {
      name: 'Newton\'s form of the equation',
      expr: 'xo*xi = f^2', tex: 'x_o\\,x_i = f^2',
      vars: {
        xo: { name: 'object distance from the focal point (sₒ − f)', q: 'length', unit: 'cm', signed: true, value: 10, tex: 'x_o' },
        xi: { name: 'image distance from the focal point (sᵢ − f)', q: 'length', unit: 'cm', signed: true, tex: 'x_i' },
        f: { name: 'focal length', q: 'length', unit: 'cm', value: 20, signed: true }
      },
      solveFor: 'xi',
      note: 'The distances are measured from the focal point: xₒ = sₒ − f and xᵢ = sᵢ − f.',
      stories: { xi: 'An object stands {xo} beyond the focal point of a mirror of focal length {f}. How far beyond the focal point is its image?' }
    }
  ],
  examples: [
    {
      title: 'A shaving mirror',
      q: 'A concave mirror of radius of curvature 60 cm is held 12 cm from a face. Where is the image, and how large is it?',
      steps: [
        'The focal length is $f = R/2 = 30$ cm; the face is inside the focal length.',
        { text: 'The mirror equation:', tex: 's_i = \\frac{s_o f}{s_o - f} = \\frac{12 \\times 30}{12 - 30} = -20\\ \\mathrm{cm}' },
        { text: 'The magnification:', tex: 'm = \\frac{f}{f - s_o} = \\frac{30}{30 - 12} = +1.67' }
      ],
      a: 'A virtual image 20 cm behind the mirror, upright and 1.67 times life size.'
    },
    {
      title: 'A real image three times life size',
      q: 'A concave mirror has a focal length of 25 cm. Where must a candle stand to throw a real image three times its size on a screen, and where is the screen?',
      steps: [
        { text: 'A real, enlarged image is inverted, so $m = -3$. Solve $m = f/(f - s_o)$ for $s_o$:', tex: 's_o = f - \\frac{f}{m} = 25 + \\frac{25}{3} = 33.3\\ \\mathrm{cm}' },
        { text: 'The image distance:', tex: 's_i = -m\\,s_o = 3 \\times 33.3 = 100\\ \\mathrm{cm}' }
      ],
      a: 'Candle 33.3 cm from the mirror (just beyond the focus), screen 100 cm in front of the mirror.'
    }
  ],
  quiz: [
    { q: 'A concave mirror has f = 15 cm and an object stands 45 cm away. The image is…', choices: ['real, inverted and half life size, 22.5 cm from the mirror', 'virtual and upright, 22.5 cm behind the mirror', 'real and enlarged, 90 cm from the mirror', 'at infinity'], a: 0, why: '$s_i = 45 \\times 15/(45 - 15) = 22.5$ cm, positive, so real; $m = -22.5/45 = -0.5$: inverted and half size.' },
    { q: 'An object stands 10 cm in front of a concave mirror of focal length 15 cm. What is the image distance, in centimetres (negative if virtual)?', answer: -30, unit: 'cm', why: '$s_i = 10 \\times 15/(10 - 15) = -30$ cm: virtual, 30 cm behind the mirror, with $m = +3$.' },
    { q: 'A convex mirror can form a real image of a real object.', a: false, why: 'For $f < 0$ and $s_o > 0$ the equation gives $s_i = s_o f/(s_o - f)$ with $s_o - f > 0$ and $f < 0$: always negative, so the image is always virtual.' },
    { q: 'A convex mirror has f = −20 cm and an object stands 60 cm away. What is the magnification?', answer: 0.25, why: '$m = f/(f - s_o) = -20/(-20 - 60) = +0.25$: upright and a quarter of life size.' },
    { q: 'An object is placed exactly at the focal point of a concave mirror. Where is the image?', choices: ['At the focal point', 'At the centre of curvature', 'Behind the mirror, life size', 'At infinity: the rays leave parallel'], a: 3, why: '$1/s_i = 1/f - 1/s_o = 0$, so $s_i \\to \\infty$: the reflected rays are parallel, which is how a searchlight or a torch makes a beam.' }
  ],
  applications: [
    'Choosing a make-up or shaving mirror: the magnification at the working distance is f/(f − sₒ), so a 5× mirror must be used at 0.8 f.',
    'Setting up a telescope or a spectrometer: the mirror equation puts a detector at the focus of a collimating or focusing mirror and tells how far a nearby source will shift it.',
    'Solar cookers and concentrators: the pot belongs at the image of the Sun, one focal length from the mirror.',
    'Measuring a mirror\'s focal length: focus the image of a distant window or lamp on a screen and measure the distance to the mirror.',
    'Illumination: a lamp is placed just beyond the focus of a reflector so that the light is gathered into a convergent beam, and exactly at the focus for a parallel one.'
  ],
  sources: [
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — the mirror equation and the sign conventions.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE) — imaging equations and conjugates.',
    'W. J. Smith, *Modern Optical Engineering* — the paraxial imaging equations for refracting and reflecting surfaces.'
  ],
  sim: { id: 'rm-mirror-image', params: { plot: true } }
},

/* ================================================================ ray diagrams */
{
  id: 'mirror-ray-diagrams', parent: 'reflection-and-mirrors', title: 'Ray diagrams for mirrors', level: 2,
  short: 'To find an image by drawing, trace two or three principal rays from the top of the object: one parallel to the axis (it reflects through F), one through F (it reflects parallel), one through the centre of curvature (it returns along itself). Where they meet, or seem to meet, is the image.',
  keywords: ['ray diagram', 'principal rays', 'parallel ray', 'focal ray', 'centre ray', 'vertex ray', 'image construction', 'real image', 'virtual image', 'concave mirror', 'convex mirror', 'dashed lines', 'graphical construction'],
  prereq: ['the-mirror-equation', 'curved-mirrors'],
  related: ['lens-ray-diagrams', 'real-and-virtual-images', 'spherical-mirror-aberration', 'mirrors-in-daily-life', 'the-paraxial-approximation'],
  body: `
Before the equation there is the picture. A ray diagram finds an image with a ruler, and shows at a glance whether it is real or virtual, upright or inverted, large or small.

### The principal rays
Draw the axis and the mirror (a vertical line with its curve sketched), mark the focus F at distance $f$ and the centre of curvature C at $2f$, and stand the object on the axis as an arrow. From its tip draw rays whose reflections you know:

1. **The parallel ray** runs parallel to the axis and reflects through F (concave), or as if from F behind the mirror (convex).
2. **The focal ray** runs through F (aimed at F, for a convex mirror) and reflects parallel to the axis.
3. **The centre ray** runs through C, meets the mirror along the normal and returns along itself.
4. **The vertex ray**, to the middle of the mirror, reflects at an equal angle on the other side of the axis.

Two rays are enough, and the third checks the drawing. Where the reflected rays cross is the tip of the image; the image arrow runs from the axis to it.

### Real or virtual?
- A solid line is a path the light really takes; a dashed line is a construction line, the extension of a reflected ray backwards behind the mirror.
- If the reflected rays themselves cross, in front of the mirror, the image is **real**: a screen put there shows it.
- If the reflected rays diverge and only their extensions cross, behind the mirror, the image is **virtual**: you see it only by looking into the mirror.

### The concave mirror, case by case
| object | image |
|---|---|
| beyond C | between F and C: real, inverted, reduced |
| at C | at C: real, inverted, life size |
| between C and F | beyond C: real, inverted, enlarged |
| at F | none: the rays leave parallel |
| inside F | behind the mirror: virtual, upright, enlarged |

### The convex mirror
Wherever the object stands, the three reflected rays diverge, and their extensions meet behind the mirror, between the mirror and F: a virtual, upright, reduced image. As the object recedes the image shrinks and creeps towards F.

### What the diagram hides
The textbook diagram turns each ray at the straight line through the mirror's vertex and treats the mirror as shallow. A real mirror turns the ray on its curved surface, and rays far from the axis do not pass through the same image point ([[spherical-mirror-aberration]]). A diagram gives position and size, not blur.

> [!tip] The construction contains the equation: the vertex ray gives $h_i/h_o = s_i/s_o$ and the parallel ray $h_i/h_o = (s_i - f)/f$, and equating them gives $1/s_o + 1/s_i = 1/f$.

> [!key] Parallel goes through F; through F goes parallel; through C goes straight back. Real images: the reflected rays cross. Virtual images: only their extensions do.
`,
  ideas: [
    'Three principal rays from the tip of the object locate the image: parallel → through F; through F → parallel; through C → back along itself.',
    'The image is real if the reflected rays themselves cross, in front of the mirror; virtual if only their backward extensions cross.',
    'A concave mirror gives real inverted images for objects beyond F and a virtual upright enlarged image inside F.',
    'A convex mirror gives a virtual, upright, reduced image whatever the object distance.',
    'The textbook diagram is paraxial: it turns the rays at the vertex plane and cannot show aberration.'
  ],
  pitfalls: [
    'Dashed lines are rays of light — They are extensions of rays behind the mirror, drawn to find where a virtual image seems to be. No light travels along them.',
    'You must draw all three rays — Two are enough to find the intersection; the third is a check. Choose the two that are easiest for the case at hand.',
    'The ray diagram shows where the real mirror bends the rays — It bends them at the curved surface; the diagram turns them at a flat plane for simplicity, which is right only for rays close to the axis.',
    'A convex mirror can make a real image — Never, for a real object: the reflected rays always diverge, so the image is always virtual, upright and reduced.'
  ],
  terms: [
    { term: 'Ray diagram', also: ['ray construction', 'graphical construction'], def: 'A drawing that finds an image by following a few rays whose paths after reflection or refraction are known. It gives the position, size and orientation of the image.' },
    { term: 'Parallel ray', also: ['axis-parallel ray'], def: 'The ray from the top of the object that runs parallel to the axis of a mirror. A concave mirror reflects it through the focal point; a convex mirror, as if from the focal point behind it.' },
    { term: 'Focal ray', def: 'The ray that passes through the focal point on its way to a concave mirror (or is aimed at it behind a convex one) and is reflected parallel to the axis.' },
    { term: 'Centre ray', also: ['radial ray', 'chief ray through C'], def: 'The ray that passes through the centre of curvature of a spherical mirror. It meets the surface along the normal and is reflected back along itself.' },
    { term: 'Vertex ray', def: 'The ray from the tip of the object to the vertex of the mirror. It reflects at an equal angle on the other side of the axis and so gives the magnification, m = −sᵢ/sₒ.' }
  ],
  formulas: [
    {
      name: 'Image height',
      expr: 'hi = -ho*si/so', tex: 'h_i = -\\,h_o\\,\\frac{s_i}{s_o}',
      vars: {
        hi: { name: 'height of the image (negative: inverted)', q: 'length', unit: 'cm', signed: true, tex: 'h_i' },
        ho: { name: 'height of the object', q: 'length', unit: 'cm', value: 3, tex: 'h_o' },
        si: { name: 'image distance (negative: virtual)', q: 'length', unit: 'cm', value: 16.7, signed: true, tex: 's_i' },
        so: { name: 'object distance', q: 'length', unit: 'cm', value: 25, tex: 's_o' }
      },
      note: 'From the vertex ray: the object and its image are similar triangles about the axis.',
      stories: { hi: 'An arrow {ho} tall stands {so} in front of a mirror and its image forms at {si}. How tall is the image?' }
    },
    {
      name: 'Newton\'s form, from the focal ray',
      expr: 'xo*xi = f^2', tex: 'x_o\\,x_i = f^2',
      vars: {
        xo: { name: 'object distance beyond the focal point', q: 'length', unit: 'cm', signed: true, value: 15, tex: 'x_o' },
        xi: { name: 'image distance beyond the focal point', q: 'length', unit: 'cm', signed: true, tex: 'x_i' },
        f: { name: 'focal length', q: 'length', unit: 'cm', value: 10, signed: true }
      },
      solveFor: 'xi',
      note: 'The two similar triangles at the focal point of the diagram give this directly.',
      stories: { xi: 'An object stands {xo} beyond the focal point of a mirror with a focal length of {f}. How far beyond the focal point does the image form?' }
    }
  ],
  examples: [
    {
      title: 'Drawing it to scale',
      q: 'A concave mirror of focal length 10 cm and an object 3 cm tall at 25 cm. Which rays do you draw, what do you expect, and what does the equation say?',
      steps: [
        'The object is beyond C (at 20 cm), so draw the parallel ray (it reflects through F) and the centre ray (it returns along itself); they cross between F and C.',
        { text: 'The equation checks the drawing:', tex: 's_i = \\frac{25 \\times 10}{25 - 10} = 16.7\\ \\mathrm{cm} \\qquad m = -\\frac{16.7}{25} = -0.67' },
        'The image is 2 cm tall.'
      ],
      a: 'A real, inverted image 2 cm tall, 16.7 cm in front of the mirror, between F (10 cm) and C (20 cm), as the drawing shows.'
    },
    {
      title: 'A convex mirror',
      q: 'A convex mirror has a focal length of −30 cm and an object 20 cm tall stands 90 cm away. Describe and locate the image.',
      steps: [
        { text: 'The mirror equation gives', tex: 's_i = \\frac{s_o f}{s_o - f} = \\frac{90 \\times (-30)}{90 + 30} = -22.5\\ \\mathrm{cm}' },
        { text: 'and the magnification', tex: 'm = -\\frac{s_i}{s_o} = 0.25' },
        'In the diagram the parallel ray reflects as if from F, 30 cm behind the mirror, and the focal ray (aimed at F) reflects parallel; their extensions meet 22.5 cm behind the mirror.'
      ],
      a: 'A virtual, upright image 5 cm tall, 22.5 cm behind the mirror, between the mirror and F.'
    }
  ],
  quiz: [
    { q: 'In a ray diagram for a concave mirror, the ray from the top of the object that runs parallel to the axis is reflected…', choices: ['through the focal point F', 'back along itself', 'parallel to the axis', 'through the vertex'], a: 0, why: 'A ray parallel to the axis is brought to the focus by a concave mirror. A ray through the centre of curvature is the one that returns along itself.' },
    { q: 'An object stands between a concave mirror and its focal point. The image is…', choices: ['real, inverted and reduced', 'real, inverted and enlarged', 'virtual, upright and enlarged', 'virtual, upright and reduced'], a: 2, why: 'Inside F the reflected rays diverge; their backward extensions meet behind the mirror, giving an upright, enlarged, virtual image (the shaving mirror).' },
    { q: 'In a ray diagram a solid reflected ray and a dashed line behind the mirror meet at a point. That point is…', choices: ['a real image', 'a virtual image', 'the centre of curvature', 'the vertex'], a: 1, why: 'The reflected light does not pass through that point; only its backward extension does, so the image is virtual.' },
    { q: 'A convex mirror can form a real image if the object is close enough.', a: false, why: 'The reflected rays from a convex mirror always diverge, so their backward extensions give a virtual image at every object distance.' },
    { q: 'An object 8 cm tall stands 40 cm from a concave mirror of focal length 20 cm (at the centre of curvature). How tall is the image, in centimetres?', answer: 8, unit: 'cm', why: 'At $s_o = 2f$ the image is at $2f$ too, with $m = -1$: the same size, inverted.' }
  ],
  applications: [
    'Designing and checking an optical layout on paper before any calculation: where the image falls, whether it is real, whether a screen or detector can be placed there.',
    'Understanding how a Newtonian or Cassegrain telescope folds its beam, by tracing the principal rays of the primary and following them through the secondary.',
    'Explaining shaving and make-up mirrors: the object lies inside F, so the rays diverge on reflection and the eye sees a magnified virtual image.',
    'Working out where to put the pot in a solar cooker or a screen in a projector: the real image is at the point where the reflected rays cross.',
    'Teaching: the same three-ray construction, with refraction in place of reflection, finds the image in a thin lens ([[lens-ray-diagrams]]).'
  ],
  sources: [
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — ray constructions for mirrors and lenses.',
    'F. A. Jenkins and H. E. White, *Fundamentals of Optics* — graphical construction of images in spherical mirrors.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE) — ray diagrams for positive and negative systems.'
  ],
  sim: { id: 'rm-mirror-image', params: { so: 70, R: 80 } }
},

/* ================================================================ conics */
{
  id: 'parabolic-and-elliptical-mirrors', parent: 'reflection-and-mirrors', title: 'Parabolic, elliptical and hyperbolic mirrors', level: 3,
  short: 'Conic sections have exact focal properties: a paraboloid sends parallel light from a distant point to one focus and a lamp at its focus to a parallel beam; an ellipsoid sends light from one focus to the other; a hyperboloid turns converging light into light that seems to come from its other focus. A sphere is only close to all of them near its axis.',
  keywords: ['parabolic mirror', 'paraboloid', 'ellipsoidal mirror', 'hyperbolic mirror', 'conic constant', 'conic section', 'focus', 'foci', 'Cassegrain', 'searchlight', 'collimator', 'ellipsoidal reflector', 'Newtonian', 'coma', 'eccentricity', 'off-axis parabola', 'k = -1', 'Ritchey-Chretien'],
  prereq: ['curved-mirrors', 'the-mirror-equation', 'math:conic-sections'],
  related: ['spherical-mirror-aberration', 'reflecting-telescopes', 'reflectors', 'coma', 'aspheric-surfaces', 'catadioptric-lenses', 'collecting-and-shaping-light', 'math:parabola', 'math:ellipse'],
  body: `
A spherical mirror focuses perfectly only for rays near its axis ([[spherical-mirror-aberration]]). A mirror shaped as another **conic section**, a parabola, ellipse or hyperbola turned about its axis, focuses *exactly* in a particular geometry. Searchlights, telescopes and dental lamps look the way they do because of it.

### One family: the conic constant
With $r$ the distance from the axis, $R$ the radius of curvature at the vertex and $k$ the **conic constant**, the height of the surface is

$$z = \\frac{r^2/R}{1 + \\sqrt{1 - (1+k)\\,r^2/R^2}}$$

| $k$ | surface | focuses exactly |
|---|---|---|
| 0 | sphere | the centre of curvature, onto itself |
| $-1 < k < 0$ | prolate ellipsoid, $k = -e^2$ | one focus onto the other |
| $-1$ | paraboloid | a point at infinity ⇄ the focus |
| below $-1$ | hyperboloid | one focus onto the other, one of them virtual |

### The paraboloid
Parallel rays from a distant point on the axis all meet at the focus, $f = R/2$, with no aberration at all; run backwards, a lamp at the focus sends out a parallel beam. At radius $r$ the surface is $r^2/4f$ deep, so the focal length follows from the depth of a dish: $f = D^2/16s$. A 200 mm mirror 2.5 mm deep has $f = 1000$ mm. The paraboloid is perfect only on axis: a star 0.5° off axis (the width of the full Moon) in an f/5 mirror is smeared into a comet-shaped flare of **coma** about 65 µm long, ten times the diameter of the Airy disc ([[coma]]).

### The ellipsoid
An ellipse has two foci, and every ray from one reflects to the other; the path $F_1 \\to$ mirror $\\to F_2$ has the same length for every ray. A lamp at $F_1$ lights an aperture, a film gate or a fibre bundle at $F_2$. If the foci are a distance $s_1$ and $s_2$ from the vertex, the radius there is $R = 2s_1 s_2/(s_1 + s_2)$ (the mirror equation with $f = R/2$) and the eccentricity is $e = (s_2 - s_1)/(s_2 + s_1)$. When $s_2 \\to \\infty$ the ellipse becomes a parabola.

### The hyperboloid
A convex hyperboloid turns light that is converging towards its far focus into light that seems to come from its near focus. That is the secondary mirror of the **Cassegrain** telescope: a parabolic primary brings the light towards F; a hyperbolic secondary set in front of F sends it on to a focus behind the primary. In the simulation an f/4 primary of 200 mm diameter (f = 800 mm) with a 4× secondary gives f = 3200 mm, f/16, in a tube 610 mm long ([[reflecting-telescopes]]).

### The sphere in the family
A sphere is the member with $k = 0$. It images only its own centre exactly, and everything else only for rays near the axis. That is why a sphere is the first surface to grind and a paraboloid the one to finish.

> [!key] Parabola: infinity ⇄ focus. Ellipse: focus ⇄ other focus. Hyperbola: a converging beam appears to come from a virtual focus. Each is exact for one pair of points and aberrated elsewhere.
`,
  ideas: [
    'A paraboloid focuses a distant on-axis point perfectly and turns a lamp at its focus into a parallel beam; off axis it has coma.',
    'An ellipsoid images one focus exactly on the other; every ray has the same path length between them.',
    'A hyperboloid maps one focus onto the other with one of them virtual: the secondary of a Cassegrain telescope.',
    'All three are described by a conic constant k: 0 sphere, −1 < k < 0 ellipsoid, −1 paraboloid, k < −1 hyperboloid.',
    'The depth of a paraboloid is r²/4f, so a dish\'s focal length follows from its diameter and depth.'
  ],
  pitfalls: [
    'A parabolic mirror focuses all light perfectly — Only light parallel to its axis. A source off axis suffers coma, growing in proportion to the field angle and as 1/N² with the f-number N.',
    'An elliptical mirror is a sort of parabola — It has two real foci and sends light from one to the other. The parabola is the limit when the second focus is at infinity.',
    'A spherical mirror and a parabolic one differ greatly — Near the axis they are almost identical: at the edge of a 200 mm f/5 mirror the two differ by only 1.6 µm. The difference matters because it is several wavelengths.',
    'A Cassegrain telescope is shorter because its mirrors are smaller — It is shorter because the secondary folds the light and multiplies the focal length: a 600 mm tube gives the focal length of a 3 m telescope.'
  ],
  terms: [
    { term: 'Conic mirror', also: ['conic section mirror'], def: 'A mirror whose surface is a conic section turned about its axis: sphere (k = 0), ellipsoid (−1 < k < 0), paraboloid (k = −1) or hyperboloid (k < −1), k being the conic constant.' },
    { term: 'Paraboloid', also: ['parabolic mirror'], def: 'The surface made by turning a parabola about its axis (k = −1). It focuses light from a point at infinity on its axis perfectly, and turns a source at its focus into a parallel beam.' },
    { term: 'Ellipsoid', also: ['ellipsoidal mirror', 'ellipsoidal reflector'], def: 'The surface made by turning an ellipse about its long axis. It images one focus exactly on the other.' },
    { term: 'Hyperboloid', also: ['hyperbolic mirror'], def: 'A surface of revolution of a hyperbola (k < −1). As a convex mirror it makes light converging to one focus appear to come from the other; it is the secondary mirror of a Cassegrain.' },
    { term: 'Eccentricity', also: ['e'], def: 'How far a conic is from a circle: 0 for a circle, between 0 and 1 for an ellipse, 1 for a parabola, above 1 for a hyperbola. The conic constant is k = −e².' },
    { term: 'Off-axis parabola', also: ['OAP'], def: 'A section of a paraboloid that does not include its vertex, so that the focus lies to the side of the beam. It collimates or focuses without the detector or secondary blocking the light.' }
  ],
  formulas: [
    {
      name: 'Focal length of a paraboloid from its depth',
      expr: 'sag = D^2/(16*f)', tex: 's = \\frac{D^2}{16\\,f}',
      vars: {
        sag: { name: 'depth of the dish at its centre', q: 'length', unit: 'mm', value: 2.5, tex: 's' },
        D: { name: 'diameter of the dish', q: 'length', unit: 'mm', value: 200 },
        f: { name: 'focal length', q: 'length', unit: 'mm' }
      },
      solveFor: 'f',
      note: 'For a paraboloid the surface at radius r is r²/4f below the rim of a flat cut; with r = D/2 this gives the depth.',
      stories: { f: 'A parabolic dish {D} across is {sag} deep. What is its focal length?', sag: 'A mirror {D} across has a focal length of {f}. How deep is it?' }
    },
    {
      name: 'Radius of an ellipsoidal mirror from its foci',
      expr: 'R = 2*s1*s2/(s1 + s2)', tex: 'R = \\frac{2\\,s_1 s_2}{s_1 + s_2}',
      vars: {
        R: { name: 'radius of curvature at the vertex', q: 'length', unit: 'mm' },
        s1: { name: 'distance from the vertex to the first focus', q: 'length', unit: 'mm', value: 40, tex: 's_1' },
        s2: { name: 'distance from the vertex to the second focus', q: 'length', unit: 'mm', value: 240, tex: 's_2' }
      },
      note: 'The mirror equation with f = R/2, as it must be for rays near the axis.',
      stories: { R: 'A lamp sits {s1} from the vertex of an ellipsoidal mirror and its light must converge {s2} from the vertex. What vertex radius is needed?' }
    },
    {
      name: 'Eccentricity of the ellipse',
      expr: 'ec = (s2 - s1)/(s2 + s1)', tex: '\\varepsilon = \\frac{s_2 - s_1}{s_2 + s_1}',
      vars: {
        ec: { name: 'eccentricity', tex: '\\varepsilon' },
        s1: { name: 'distance from the vertex to the near focus', q: 'length', unit: 'mm', value: 40, tex: 's_1' },
        s2: { name: 'distance from the vertex to the far focus', q: 'length', unit: 'mm', value: 240, tex: 's_2' }
      },
      note: 'The conic constant is k = −ε². ε → 1 is the parabola, ε = 0 the sphere.',
      stories: { ec: 'The foci of an ellipsoidal mirror are {s1} and {s2} from its vertex. What is its eccentricity?' }
    },
    {
      name: 'Coma of a paraboloid',
      expr: 'Lc = 3*th*f/(16*N^2)', tex: 'L_c = \\frac{3\\,\\theta\\,f}{16\\,N^2}',
      vars: {
        Lc: { name: 'length of the coma flare', q: 'length', unit: 'µm', tex: 'L_c' },
        th: { name: 'angle of the star off the axis', q: 'angle', unit: '°', value: 0.5, tex: '\\theta' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 1000 },
        N: { name: 'f-number', value: 5, min: 1, max: 30 }
      },
      note: 'Tangential coma, third order. It is the flare length, not the radius.',
      stories: { Lc: 'A paraboloid of focal length {f} and f/{N} images a star {th} off its axis. How long is the coma flare?' }
    }
  ],
  examples: [
    {
      title: 'The focus of a dish',
      q: 'A cooking dish 1.2 m across is a paraboloid, 0.18 m deep at the centre. Where is the focus?',
      steps: [
        { text: 'The depth of a paraboloid of focal length $f$ across a diameter $D$ is $s = D^2/16f$, so', tex: 'f = \\frac{D^2}{16\\,s} = \\frac{1.2^2}{16 \\times 0.18} = 0.50\\ \\mathrm{m}' }
      ],
      a: 'The focus is on the axis 0.50 m from the bottom of the dish, which is 32 cm above its rim: that is where the pot goes.'
    },
    {
      title: 'An ellipsoidal lamp reflector',
      q: 'An arc lamp sits 40 mm from the vertex of an ellipsoidal mirror, and its light must converge on a fibre bundle 240 mm from the vertex. What vertex radius and eccentricity are needed?',
      steps: [
        { text: 'The radius at the vertex:', tex: 'R = \\frac{2 s_1 s_2}{s_1 + s_2} = \\frac{2 \\times 40 \\times 240}{280} = 68.6\\ \\mathrm{mm}' },
        { text: 'The eccentricity, and the conic constant $k = -\\varepsilon^2$:', tex: '\\varepsilon = \\frac{240 - 40}{280} = 0.714 \\qquad k = -0.51' }
      ],
      a: 'R = 68.6 mm, eccentricity 0.714 (k = −0.51). Every ray from the lamp then passes through the bundle, whatever point of the mirror it strikes.'
    }
  ],
  quiz: [
    { q: 'A small lamp is at the focal point of a paraboloidal mirror. The reflected light forms…', choices: ['a parallel beam', 'a converging beam', 'a diverging beam', 'an image at the centre of curvature'], a: 0, why: 'A paraboloid focuses a parallel beam to its focus; reversing the rays, a source at the focus gives a parallel beam. This is a searchlight.' },
    { q: 'Light from one focus of an ellipsoidal mirror, after reflection from the mirror, passes through…', choices: ['the other focus', 'the centre of curvature', 'the vertex', 'infinity'], a: 0, why: 'This is the defining property of the ellipse: every ray from one focus reflects to the other, and all of them travel the same total distance.' },
    { q: 'A paraboloidal mirror forms a perfect point image of a star in any direction.', a: false, why: 'Only for a star on its axis. Off axis a paraboloid has coma, growing with the angle.' },
    { q: 'A paraboloidal mirror 400 mm across is 5 mm deep at its centre. What is its focal length in millimetres?', answer: 2000, unit: 'mm', why: '$f = D^2/(16 s) = 400^2/(16 \\times 5) = 2000$ mm.' },
    { q: 'Which pair of mirrors makes a classical Cassegrain telescope?', choices: ['A paraboloidal primary and a convex hyperboloidal secondary', 'Two spherical mirrors', 'An ellipsoidal primary and a flat secondary', 'A concave hyperboloid and a concave paraboloid'], a: 0, why: 'The parabola brings the light to its focus; the convex hyperbola, whose far focus is that same point, sends it to its near focus behind the primary.' }
  ],
  applications: [
    'Reflecting telescopes: a paraboloid is the Newtonian primary; a Cassegrain has a parabolic primary and a hyperbolic secondary; the Ritchey–Chrétien design makes both hyperbolic.',
    'Searchlights, torches, car headlamps and floodlights: a lamp near the focus of a paraboloid gives a beam; modern headlamps use free-form reflectors derived from it.',
    'Satellite dishes and radio telescopes, which are paraboloids for microwaves, with the receiver at the focus.',
    'Ellipsoidal reflector spotlights in theatres and fibre-optic light sources for endoscopes, with the lamp at one focus and the gate or fibre at the other.',
    'Elliptical laser pump cavities (flashlamp at one focus, rod at the other) and shock-wave lithotripsy (source at one focus, kidney stone at the other); off-axis parabolas that collimate and focus infrared and laser beams in spectrometers.'
  ],
  history: 'The focusing property of the parabola was known to Diocles about 200 BC, in his work on burning mirrors; Kepler named the foci in 1604. James Gregory\'s design with a concave elliptical secondary (1663), Newton\'s telescope (1668) and Cassegrain\'s with a convex secondary (1672) followed, and John Hadley made the first successful parabolic-mirror telescope in 1721.',
  sources: [
    'R. N. Wilson, *Reflecting Telescope Optics I* (Springer) — conic mirrors, the classical telescope forms and their aberrations.',
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — aspherical mirrors: the parabola and the ellipse.',
    'W. J. Smith, *Modern Optical Engineering* — conic surfaces, and the two-mirror telescopes.'
  ],
  sim: 'rm-conic-mirror'
},

/* ================================================================ the caustic */
{
  id: 'spherical-mirror-aberration', parent: 'reflection-and-mirrors', title: 'The caustic of a spherical mirror', level: 3,
  short: 'A spherical mirror brings rays near its axis to one focus, but rays farther out cross the axis closer to the mirror. The envelope of the crossing rays is a bright curve, the caustic, with a cusp at the paraxial focus. It is why a coffee cup shows a bright cusp, and why a telescope mirror is made a paraboloid.',
  keywords: ['spherical aberration', 'caustic', 'spherical mirror', 'longitudinal aberration', 'LSA', 'circle of least confusion', 'best focus', 'paraxial focus', 'coffee cup', 'nephroid', 'paraboloid', 'figuring', 'Foucault test', 'Hubble', 'Schmidt', 'marginal ray', 'wavefront error'],
  prereq: ['the-mirror-equation', 'parabolic-and-elliptical-mirrors', 'what-aberrations-are'],
  related: ['spherical-aberration', 'aspheric-surfaces', 'catadioptric-lenses', 'reflecting-telescopes', 'chief-and-marginal-rays', 'the-airy-disk', 'strehl-ratio-and-diffraction-limited', 'testing-surfaces-with-interferometers'],
  body: `
Put a bright, distant lamp beside a coffee cup and a sharp, pointed curve of light appears on the surface of the coffee. It is the **caustic** of the cup's circular wall, and it is the aberration of a spherical mirror drawn large.

### What goes wrong
A ray parallel to the axis at height $h$ meets a spherical mirror of radius $R$ at an angle of incidence $\\theta$ with $\\sin\\theta = h/R$. After reflection it makes the angle $2\\theta$ with the axis and crosses it at a distance from the vertex of

$$z(h) = R - \\frac{R}{2\\cos\\theta}$$

For $h \\to 0$ this is $R/2$, the paraxial focus. For larger $h$, $\\cos\\theta$ is smaller and the ray crosses *closer to the mirror*. The gap between the paraxial focus and where the ray at height $h$ crosses is the **longitudinal spherical aberration**, to third order

$$\\mathrm{LSA} \\approx \\frac{h^2}{8f}$$

At the edge of a 200 mm f/5 mirror ($f = 1000$ mm, $h = 100$ mm) the ray crosses 1.25 mm short of the paraxial focus.

### The size of the blur
No plane catches all the rays. The tightest waist, the **circle of least confusion**, lies about three quarters of the way from the paraxial focus to the marginal focus, and its diameter is

$$b = \\frac{f}{128\\,N^3}$$

for f-number $N = f/D$: 62.5 µm for this mirror, nearly ten times the 6.7 µm diameter of its Airy disc. Because $b \\propto 1/N^3$, halving the f-number makes the blur eight times larger. The wavefront error at the edge is $D/(512N^3)$, which is 5.7 waves of green light here, and a sphere is diffraction-limited only if $N^3 \\ge D/(512\\lambda)$: for a 200 mm mirror, $N \\ge 9$.

### The paraboloid has none
A sphere and a paraboloid of the same vertex radius differ at height $h$ by only

$$\\Delta z = \\frac{h^4}{8R^3}$$

which is 1.56 µm at the edge of that mirror, under three wavelengths of glass. So an optician grinds and polishes a sphere, then *figures* it into a paraboloid by taking a few micrometres off towards the edge, watching with the Foucault test. The other cures: a corrector plate in front of the sphere (Schmidt, 1930) or a meniscus (Maksutov), a second mirror that cancels it, stopping down to $N \\ge 9$, or keeping the sphere and correcting at the detector, as the Arecibo dish did with a line feed and later extra mirrors ([[catadioptric-lenses]]).

### The caustic
Where neighbouring reflected rays cross they trace the **caustic**, the envelope of the whole bundle: a curve with a cusp at the paraxial focus. For a full circular wall, as in the cup, it is a **nephroid** ("kidney-shaped") with its cusp at $R/2$. The paraboloid's caustic collapses to one point.

> [!key] Rays at height $h$ cross $h^2/8f$ short of the paraxial focus, spreading the focus into a blur of diameter $f/128N^3$. A paraboloid has none; a sphere must be stopped down to about f/9 or corrected.
`,
  ideas: [
    'Rays far from the axis of a spherical mirror cross the axis closer to the mirror than the paraxial focus R/2.',
    'The longitudinal aberration of a spherical mirror is about h²/8f; the tightest blur has diameter f/(128 N³).',
    'Spherical aberration of a mirror grows as the cube of the aperture ratio: halving the f-number makes the blur eight times larger.',
    'A sphere differs from the matching paraboloid by only h⁴/8R³, a few wavelengths at the edge: figuring turns one into the other.',
    'The envelope of the reflected rays is the caustic: a cusped curve (a nephroid for a full circular wall); a paraboloid\'s caustic is a point.'
  ],
  pitfalls: [
    'Spherical aberration comes from a rough or badly polished mirror — It comes from the shape: a flawless sphere has it, because the law of reflection sends rays at different heights to different points. A rough surface scatters, which is a different fault.',
    'Doubling the diameter doubles the blur — For a sphere of fixed focal length it makes the blur eight times larger (b ∝ 1/N³), which is why the aberration appears suddenly in fast mirrors.',
    'The best focus of a spherical mirror is the paraxial focus — The smallest blur lies about three quarters of the way towards the marginal focus; a telescope with a spherical mirror is focused by racking in slightly from the paraxial focus.',
    'A Schmidt or Maksutov telescope is free of aberration because its mirror is a perfect sphere — Its sphere has spherical aberration like any other; the corrector plate or meniscus in front cancels it.'
  ],
  terms: [
    { term: 'Caustic', also: ['caustic curve'], def: 'The envelope of a bundle of rays: the bright curve along which neighbouring rays cross. A spherical mirror\'s caustic has a cusp at the paraxial focus.' },
    { term: 'Marginal focus', def: 'The point where the rays through the edge of the aperture (the marginal rays) cross the axis. For a spherical mirror it lies closer to the mirror than the paraxial focus, by about h²/8f.' },
    { term: 'Nephroid', also: ['kidney curve'], def: 'The caustic of parallel light reflected from the inside of a circle: a curve with two cusps and a shape like a kidney. A coffee cup shows part of it.' },
    { term: 'Figuring', also: ['aspherizing'], def: 'The final stage of making a mirror: polishing small amounts of material off chosen zones to bring the surface to its exact shape, for example from a sphere to a paraboloid.' }
  ],
  formulas: [
    {
      name: 'Longitudinal spherical aberration of a spherical mirror',
      expr: 'lsa = h^2/(8*f)', tex: '\\mathrm{LSA} = \\frac{h^2}{8f}',
      vars: {
        lsa: { name: 'distance by which the ray crosses short of the paraxial focus', q: 'length', unit: 'mm', tex: '\\mathrm{LSA}' },
        h: { name: 'height of the ray above the axis', q: 'length', unit: 'mm', value: 100 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 1000 }
      },
      note: 'Third order, for a mirror with an object at infinity. The exact trace of the f/5 mirror gives 1.252 mm for the marginal ray.',
      stories: { lsa: 'A spherical mirror of focal length {f} is used at a ray height of {h}. By how much does that ray cross short of the paraxial focus?' }
    },
    {
      name: 'Smallest blur of a spherical mirror',
      expr: 'b = f/(128*N^3)', tex: 'b = \\frac{f}{128\\,N^3}',
      vars: {
        b: { name: 'diameter of the circle of least confusion', q: 'length', unit: 'µm' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 1000 },
        N: { name: 'f-number', value: 5, min: 1, max: 30 }
      },
      note: 'Third-order result for an object at infinity. It scales as 1/N³.',
      stories: { b: 'A spherical mirror of focal length {f} is used at f/{N}. What is the diameter of its smallest blur?' }
    },
    {
      name: 'How far a sphere departs from the paraboloid',
      expr: 'dz = h^4/(8*R^3)', tex: '\\Delta z = \\frac{h^4}{8R^3}',
      vars: {
        dz: { name: 'height difference between sphere and paraboloid', q: 'length', unit: 'µm', tex: '\\Delta z' },
        h: { name: 'height from the axis', q: 'length', unit: 'mm', value: 100 },
        R: { name: 'radius of curvature at the vertex', q: 'length', unit: 'mm', value: 2000 }
      },
      note: 'The two surfaces share the vertex and the radius there. The optician removes this much glass, at the edge, to turn the sphere into a paraboloid.',
      stories: { dz: 'A mirror of radius {R} is to be figured from a sphere into a paraboloid. How much does the sphere depart from the paraboloid at a height of {h}?' }
    },
    {
      name: 'Slowest f-number at which a sphere is diffraction-limited',
      expr: 'Nmin = (D/(512*lambda))^(1/3)', tex: 'N_{\\min} = \\left(\\frac{D}{512\\,\\lambda}\\right)^{1/3}',
      vars: {
        Nmin: { name: 'smallest usable f-number', tex: 'N_{\\min}' },
        D: { name: 'diameter of the mirror', q: 'length', unit: 'mm', value: 200 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' }
      },
      note: 'From a wavefront error D/(512 N³) of one wavelength at the paraxial focus. Faster than this and the sphere needs a corrector or a conic figure.',
      stories: { Nmin: 'A spherical mirror {D} across is used with {lambda} light. What is the smallest f-number at which it is still diffraction-limited?' }
    }
  ],
  examples: [
    {
      title: 'A 150 mm f/5 sphere',
      q: 'A spherical mirror 150 mm across has a focal length of 750 mm (f/5). How far short of the paraxial focus does its edge ray cross, how large is the smallest blur, and at what f-number would it become diffraction-limited in green light (550 nm)?',
      steps: [
        { text: 'The edge ray is at $h = 75$ mm:', tex: '\\mathrm{LSA} = \\frac{h^2}{8f} = \\frac{75^2}{8 \\times 750} = 0.94\\ \\mathrm{mm}' },
        { text: 'The smallest blur:', tex: 'b = \\frac{f}{128\\,N^3} = \\frac{750}{128 \\times 125} = 0.047\\ \\mathrm{mm}' },
        { text: 'The Airy disc at f/5 is $2.44 \\times 0.55 \\times 5 = 6.7$ µm across, so the blur is seven times larger. The limit:', tex: 'N_{\\min} = \\left(\\frac{150}{512 \\times 0.00055}\\right)^{1/3} = 8.1' }
      ],
      a: 'The edge ray crosses 0.94 mm short; the smallest blur is 47 µm; the mirror becomes diffraction-limited at about f/8, which for this diameter means a focal length of at least 1.2 m.'
    },
    {
      title: 'Turning the sphere into a paraboloid',
      q: 'The 200 mm f/5 mirror ($R = 2000$ mm) is to be figured into a paraboloid. How much glass must come off at the edge, relative to the vertex curve, and how many wavelengths of green light is that?',
      steps: [
        { text: 'At $h = 100$ mm the sphere is higher than the paraboloid by', tex: '\\Delta z = \\frac{h^4}{8R^3} = \\frac{10^8}{8 \\times 8 \\times 10^9} = 1.56 \\times 10^{-3}\\ \\mathrm{mm}' },
        'That is 1.56 µm, or $1.56/0.55 = 2.8$ wavelengths of green light.'
      ],
      a: 'About 1.6 µm at the edge (2.8 wavelengths), a depth of glass thinner than a hundredth of a hair. A mirror this good must be figured and tested to a few tens of nanometres.'
    }
  ],
  quiz: [
    { q: 'Parallel rays strike a spherical concave mirror. The rays near the edge cross the axis…', choices: ['closer to the mirror than the paraxial focus', 'at the paraxial focus', 'farther from the mirror than the paraxial focus', 'at the centre of curvature'], a: 0, why: 'The ray at height $h$ crosses at $R - R/(2\\cos\\theta)$, which falls below $R/2$ as $\\cos\\theta$ drops: edge rays cross early.' },
    { q: 'A spherical mirror is stopped down by a factor of two in diameter, keeping its focal length. The spherical-aberration blur becomes…', choices: ['twice as large', 'half as large', 'one eighth as large', 'one quarter as large'], a: 2, why: 'The blur is $f/(128N^3)$ and $N$ doubles, so it falls by $2^3 = 8$.' },
    { q: 'A paraboloidal mirror has no spherical aberration for a distant object on its axis.', a: true, why: 'A paraboloid brings all rays parallel to its axis to one point, exactly. (Off axis it has coma.)' },
    { q: 'A ray 60 mm from the axis of a spherical mirror of focal length 600 mm crosses short of the paraxial focus by how many millimetres?', answer: 0.75, unit: 'mm', why: '$\\mathrm{LSA} = h^2/(8f) = 3600/(8 \\times 600) = 0.75$ mm.' },
    { q: 'The bright curve with a cusp seen in a coffee cup is…', choices: ['the caustic of the cup\'s circular wall: the envelope of the reflected rays', 'light diffracted at the rim', 'a rainbow from the coffee', 'the image of the lamp'], a: 0, why: 'Parallel light reflected from a circular mirror crosses the axis at different places depending on the ray\'s height; the envelope of those rays is a cusped caustic, a nephroid for the full circle.' }
  ],
  applications: [
    'Telescope making: an amateur grinds a sphere, polishes it and figures it to a paraboloid, checking with the Foucault knife-edge test or a Ronchi grating.',
    'The Hubble Space Telescope\'s mirror, made to a slightly wrong conic constant, showed this aberration in 1990 until corrective optics were installed.',
    'Radio telescopes: the Arecibo dish was a spherical cap with the aberration corrected at the feed; the 500 m FAST telescope deforms a spherical surface into a paraboloid as it tracks.',
    'Schmidt cameras and Maksutov telescopes keep the cheap, accurate sphere and cancel its aberration with a thin plate or meniscus ([[catadioptric-lenses]]).',
    'Caustics in cups, pools and glass: the same envelope of rays gives the bright lines on the bottom of a swimming pool and the bright cusp in a ring or a cup.'
  ],
  history: 'The Hubble Space Telescope\'s 2.4 m primary mirror was launched in 1990 polished to the wrong shape: its conic constant was about −1.014 instead of the specified −1.002, leaving the edge some 2 µm too flat. The test instrument that guided the polishing, a null corrector, had been assembled with a lens about 1.3 mm out of place. Stars showed halos of spherical aberration until the corrective optics of COSTAR were installed in December 1993.',
  sources: [
    'R. N. Wilson, *Reflecting Telescope Optics I* (Springer) — spherical aberration of mirrors, the paraboloid and the correctors.',
    'E. Hecht, *Optics*, ch. 6 (More on Geometrical Optics) — spherical aberration and the circle of least confusion.',
    'L. Allen et al., *The Hubble Space Telescope Optical Systems Failure Report* (NASA, November 1990).'
  ],
  sim: 'rm-caustic'
},

/* ================================================================ mirrors at work */
{
  id: 'mirrors-in-daily-life', parent: 'reflection-and-mirrors', title: 'Mirrors at work: from shaving to solar furnaces', level: 1,
  short: 'Every mirror you use is flat, concave or convex, chosen for the image it gives: flat for the bathroom, concave for shaving and make-up, convex for car mirrors and shop corners, a paraboloidal dish for sunlight, a half-silvered pane for a two-way mirror. The mirror equation tells what each one will show.',
  keywords: ['shaving mirror', 'make-up mirror', 'dental mirror', 'driving mirror', 'rear-view mirror', 'wing mirror', 'objects in mirror are closer than they appear', 'security mirror', 'dome mirror', 'solar concentrator', 'solar furnace', 'parabolic trough', 'heliostat', 'two-way mirror', 'one-way mirror', 'concentration ratio'],
  prereq: ['plane-mirror-images', 'curved-mirrors', 'the-mirror-equation'],
  related: ['one-way-mirrors-and-invisibility-tricks', 'mirrors-as-components', 'reflectors', 'glare-and-uniformity', 'etendue', 'metal-mirror-coatings', 'dielectric-mirrors', 'physics:spherical-mirrors'],
  body: `
Almost every mirror you meet is one of three shapes, chosen for the image it gives. The mirror equation says what each will show.

### Shaving and make-up mirrors (concave)
A concave mirror shows your face upright and enlarged only when you are *inside* its focal length. With $f = 30$ cm (radius 60 cm) and your face at 15 cm, the image is 30 cm behind the glass and twice life size. Since $m = f/(f - s_o)$, a 5× mirror has to be used at $s_o = 0.8f$: the closer to $f$, the greater the magnification, and the smaller the patch of face you see. Dentists' mirrors are small, flat or slightly concave, on a handle.

### Driving mirrors (convex)
An interior mirror is flat: life size, and a narrow view. A convex exterior mirror trades size for field. A 17 cm mirror 60 cm from the eye shows 16° if flat and 30° if its radius is 1.4 m. A car 20 m behind is imaged 0.68 m behind the glass at $m = 0.034$: 1/30 of life size, so small that the brain, judging distance by size, places it at about 38 m instead of 20. Hence the warning "objects in mirror are closer than they appear", required on US passenger-side convex mirrors, whose radius must lie between 0.9 and 1.65 m (FMVSS 111). A distant object looks $(d_\\mathrm{eye} + |f|)/|f|$ times too far.

### Security mirrors
Hemispherical convex domes in shops and car parks show almost a whole hemisphere at once, at the cost of tiny, distorted images; a corner mirror 30–90 cm across lets traffic see round a blind bend.

### Concentrating sunlight
The Sun is 0.53° (9.3 mrad) across, so a mirror of focal length $f$ images it as a disc $9.3\\ \\mathrm{mm} \\times f$(m) wide. No optic in air can concentrate sunlight more than $1/\\sin^2\\theta_s \\approx 46\\,000$ times ($\\theta_s$ the Sun's half-angle, 0.267°), or 215 times along a line focus. Practice: parabolic troughs, 5–6 m wide, concentrate about 80 times onto a tube of oil at nearly 400 °C; dishes reach thousands; and towers aimed at by fields of flat **heliostats**, each turning through only half the Sun's angular motion ([[law-of-reflection]]), reach hundreds to a thousand. The solar furnace at Odeillo, built in 1970, reaches about 3,500 °C.

> [!warn] A concave mirror is a fire hazard in sunlight: left on a window sill, a shaving or magnifying mirror can set paper or fabric alight at its focus. Never look at the Sun's image in a mirror, and never put a hand or an eye at the focus of a dish.

### Two-way mirrors
A pane coated with a thin partial reflector, say 50 % reflecting and 40 % transmitting, is a mirror from the bright side and a window from the dark side, only because one side is far brighter than the other: see [[one-way-mirrors-and-invisibility-tricks]].

> [!key] Concave inside the focal length magnifies; convex widens the field and shrinks the image, so things look farther than they are; a paraboloid concentrates the Sun up to its geometric limit of about 46,000 times.
`,
  ideas: [
    'A concave mirror gives an upright, enlarged image when the object is inside the focal length; for magnification m the object stands at f(m − 1)/m.',
    'A convex mirror shows a much wider field than a flat one, but a smaller image: the brain judges distance by size, so things look farther away.',
    'Security domes are hemispherical convex mirrors: nearly a full hemisphere in view, at the cost of tiny, distorted images.',
    'A mirror of focal length f makes an image of the Sun f × 9.3 mrad across; the limit of concentration of sunlight in air is about 46,000 times.',
    'A heliostat turns half as fast as the Sun moves; a concave mirror in sunlight is a fire hazard.'
  ],
  pitfalls: [
    'A convex mirror shows things bigger because it is curved — It shows them smaller, and a wide field. Objects look farther than they are because the image is small; hence "closer than they appear".',
    'A shaving mirror magnifies at any distance — Only inside its focal length. Beyond it the image is real, inverted and shrinking, as anyone who has held a spoon at arm\'s length has seen.',
    'A one-way mirror lets light through in one direction only — It transmits and reflects both ways equally. It works because one side is bright and the other dark, so the reflection dominates on the bright side and the transmitted view on the dark one.',
    'A solar concentrator makes more energy — It gathers the Sun\'s light from a large area into a small one, and can never make the focus brighter than the Sun\'s disc: the limit is about 46,000 times.'
  ],
  terms: [
    { term: 'Heliostat', def: 'A flat mirror driven by motors to follow the Sun and keep reflecting sunlight at a fixed target, such as a receiver on a tower. To keep the beam on target it turns through half the Sun\'s angular motion.' },
    { term: 'Concentration ratio', also: ['concentration', 'suns'], def: 'The ratio of the irradiance at the focus of a collector to that of the incident sunlight, or of the collector\'s aperture area to the receiver\'s. The limit in air is about 46,000 (215 for a line focus).' },
    { term: 'Parabolic trough', def: 'A long mirror with a parabolic cross-section that focuses sunlight onto a tube running along its focal line. A line focus: about 80 times concentration in practice.' },
    { term: 'Convex safety mirror', also: ['security mirror', 'dome mirror', 'blind-corner mirror'], def: 'A convex mirror, often part of a sphere, that gives a wide field of view of a shop, a car park or a bend, at the cost of small and distorted images.' },
    { term: 'Magnifying mirror', also: ['shaving mirror', 'make-up mirror'], def: 'A concave mirror used inside its focal length to show a virtual, upright, enlarged image of the face. Its nominal magnification, 2× to 10×, applies at a specific distance.' }
  ],
  formulas: [
    {
      name: 'How close to hold a magnifying mirror',
      expr: 'so = f*(m - 1)/m', tex: 's_o = f\\,\\frac{m - 1}{m}',
      vars: {
        so: { name: 'distance of the face from the mirror', q: 'length', unit: 'cm', tex: 's_o' },
        f: { name: 'focal length of the mirror', q: 'length', unit: 'cm', value: 25 },
        m: { name: 'magnification wanted', value: 5, min: 1.05, max: 30 }
      },
      note: 'From m = f/(f − sₒ). For m = 5 the face is at 0.8 f; the image is virtual, at m times the distance behind the mirror.',
      stories: { so: 'A concave mirror of focal length {f} is to give a magnification of {m}. How far from the face must it be held?' }
    },
    {
      name: 'How much farther a convex mirror makes a distant car seem',
      expr: 'k = (dEye + fa)/fa', tex: 'k = \\frac{d_{\\mathrm{eye}} + f_a}{f_a}',
      vars: {
        k: { name: 'apparent distance divided by the true distance' },
        dEye: { name: 'distance of the driver\'s eye from the mirror', q: 'length', unit: 'm', value: 0.6, tex: 'd_{\\mathrm{eye}}' },
        fa: { name: 'size of the focal length of the convex mirror', q: 'length', unit: 'm', value: 0.7, tex: 'f_a' }
      },
      note: 'For a car far away compared with the focal length, judging distance by the size of the image, compared with what a flat mirror shows.',
      stories: { k: 'A driver\'s eye is {dEye} from a convex mirror of focal length {fa} (in size). By what factor does a far-off car look too far away?' }
    },
    {
      name: 'The Sun\'s image in a mirror',
      expr: 'dsun = f*phi', tex: 'd = f\\,\\varphi',
      vars: {
        dsun: { name: 'diameter of the Sun\'s image', q: 'length', unit: 'mm', tex: 'd' },
        f: { name: 'focal length of the mirror', q: 'length', unit: 'm', value: 1 },
        phi: { name: 'angular diameter of the Sun', q: 'angle', unit: 'mrad', value: 9.3, tex: '\\varphi' }
      },
      note: 'Accurate for a mirror whose rim angle is small (a shallow dish); for a deep dish the rim part of the image is somewhat larger.',
      stories: { dsun: 'A mirror of focal length {f} forms an image of the Sun. How wide is the image?' }
    },
    {
      name: 'Greatest concentration of sunlight',
      expr: 'Cmax = 1/sin(th)^2', tex: 'C_{\\max} = \\frac{1}{\\sin^2\\theta_s}',
      vars: {
        Cmax: { name: 'greatest concentration in air', tex: 'C_{\\max}' },
        th: { name: 'half-angle of the Sun', q: 'angle', unit: '°', value: 0.267, min: 0.01, max: 90, tex: '\\theta_s' }
      },
      note: 'Three-dimensional limit in air, from the conservation of étendue; for a line focus it is 1/sin θ, about 215.',
      stories: { Cmax: 'The Sun subtends a half-angle of {th}. What is the greatest concentration of its light that any optic can reach in air?' }
    }
  ],
  examples: [
    {
      title: 'The car in the mirror',
      q: 'A driver\'s eye is 0.60 m from a convex mirror of radius of curvature 1.4 m. A car 1.5 m high is 20 m behind the mirror. Where is its image, how large is it, and how far away does the car seem to be?',
      steps: [
        'The focal length is $f = -R/2 = -0.70$ m. The mirror equation gives the image distance',
        { tex: 's_i = \\frac{s_o f}{s_o - f} = \\frac{20 \\times (-0.70)}{20 + 0.70} = -0.676\\ \\mathrm{m} \\qquad m = -\\frac{s_i}{s_o} = 0.0338' },
        'The image is 0.0338 × 1.5 m = 51 mm high, upright, 0.676 m behind the glass and so 0.60 + 0.676 = 1.28 m from the eye.',
        { text: 'Judged by its size, the car looks to be at', tex: 'd_\\text{apparent} = \\frac{0.60 + 0.676}{0.0338} = 37.7\\ \\mathrm{m}' }
      ],
      a: 'A virtual image 51 mm tall, 0.68 m behind the mirror; the car looks as if it were 38 m away although it is 20.6 m from the driver: nearly twice too far. A flat mirror would show it at its true distance, in a field only half as wide.'
    },
    {
      title: 'A 5× shaving mirror',
      q: 'A concave mirror has a focal length of 25 cm. How far from your face must you hold it to see yourself five times life size, and where is the image?',
      steps: [
        { text: 'From $m = f/(f - s_o)$:', tex: 's_o = f\\,\\frac{m - 1}{m} = 25 \\times \\frac{4}{5} = 20\\ \\mathrm{cm}' },
        { text: 'The image distance:', tex: 's_i = \\frac{s_o f}{s_o - f} = \\frac{20 \\times 25}{20 - 25} = -100\\ \\mathrm{cm}' }
      ],
      a: 'Hold it 20 cm from your face (just inside the 25 cm focus); the virtual image is 1 m behind the mirror. A slight movement changes the magnification a lot: at 22 cm it is already ×8.3.'
    }
  ],
  quiz: [
    { q: 'A concave shaving mirror gives an upright, enlarged image when your face is…', choices: ['inside the focal length', 'at the centre of curvature', 'beyond the centre of curvature', 'at any distance'], a: 0, why: 'Inside $f$ the reflected rays diverge and the image is virtual, upright and enlarged. Beyond $f$ the image is real and inverted.' },
    { q: 'Why does a convex car mirror carry the warning "objects in mirror are closer than they appear"?', choices: ['The image is much smaller than life size, and the brain judges distance by size', 'The mirror reverses distances', 'Convex mirrors move the image forward', 'The mirror is dirty'], a: 0, why: 'A convex mirror shrinks the image (here to about 1/30 of life size) so the car looks farther away than it is.' },
    { q: 'A concave mirror left in a sunny window can start a fire.', a: true, why: 'It focuses the sunlight into a small spot: a mirror of focal length 0.5 m makes a 5 mm image of the Sun, where the irradiance can be hundreds of times that of the sunlight, enough to ignite paper or fabric.' },
    { q: 'A magnifying mirror has a focal length of 40 cm. How far from the face, in cm, must it be held for a magnification of 4?', answer: 30, unit: 'cm', why: '$s_o = f(m-1)/m = 40 \\times 3/4 = 30$ cm.' },
    { q: 'The greatest concentration of sunlight that a perfect optic can reach in air is about…', choices: ['100 times', '1 000 times', '46 000 times', '1 000 000 times'], a: 2, why: '$1/\\sin^2(0.267°) = 46\\,000$: the Sun is a disc of finite size, and étendue cannot be reduced.' }
  ],
  applications: [
    'Shaving, make-up and magnifying mirrors, and the dentist\'s and doctor\'s mirrors on a handle.',
    'Car mirrors: flat on the inside, convex on the outside, with a wide-angle or blind-spot section on many; and the convex mirrors of the same kind at junctions and in car parks.',
    'Shop and building security: hemispherical domes, corner mirrors and the two-way mirror of a viewing room.',
    'Solar power and cooking: parabolic troughs, dishes, Fresnel mirror arrays and tower plants with heliostat fields; the solar cooker and the solar furnace.',
    'Torches, searchlights and headlamps, where a lamp near the focus of a concave reflector sends a beam ([[reflectors]]).'
  ],
  history: 'Augustin Mouchot ran a steam engine from a conical mirror in the 1860s and showed a solar-powered ice maker at the Paris Exposition of 1878. The solar furnace at Odeillo in the French Pyrenees, built in 1970, uses a field of flat heliostats and a parabolic mirror about 54 m high to reach some 3,500 °C. Ray Harroun\'s car in the 1911 Indianapolis 500 carried a rear-view mirror, usually cited as the first on a car.',
  sources: [
    'US Federal Motor Vehicle Safety Standard No. 111, *Rear visibility* (49 CFR 571.111) — the radius of convex mirrors and the warning legend.',
    'UN Regulation No. 46, *Devices for indirect vision* — classes of exterior and interior mirrors.',
    'J. A. Duffie and W. A. Beckman, *Solar Engineering of Thermal Processes* — concentrating collectors.',
    'R. Winston, J. C. Miñano and P. Benítez, *Nonimaging Optics* (Elsevier, 2005) — the limit of concentration.'
  ],
  sim: 'rm-driving-mirror'
}

);
