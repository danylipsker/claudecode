/* HYPER-OPTICS · content/optical-components.js — the hardware of an optical bench: windows, mirrors, prisms, beam
 * splitters and polarizing splitters, diffusers, catalogue lenses, irises and pinholes, isolators and modulators,
 * mounts, alignment, cleaning, and how to read a catalogue line. Simulations are in sims/optical-components.js (prefix oc-).
 */
Hyper.add(

/* ================================================================ windows */
{
  id: 'optical-windows', parent: 'optical-components', title: 'Windows', level: 1,
  short: 'An optical window is a flat plate with parallel faces that lets light through and keeps everything else out: dust, air, water, a vacuum, a hot gas. It should change the beam as little as possible, and each way it does change it is a line on its specification.',
  keywords: ['window', 'optical window', 'protective window', 'viewport', 'vacuum window', 'Brewster window', 'wedged window', 'parallelism', 'clear aperture', 'sapphire window', 'ZnSe window', 'ghost reflection', 'etalon fringes', 'plane parallel plate'],
  prereq: ['fresnel-reflection', 'refractive-index', 'optical-glass'],
  related: ['mirrors-as-components', 'beam-splitters', 'antireflection-coatings', 'uv-and-infrared-materials', 'surface-quality-and-flatness', 'brewster-angle', 'polarization-by-reflection-and-scattering', 'laser-damage-and-coating-durability', 'reading-an-optics-catalogue'],
  body: `
A window is the plainest part on the bench: a flat plate, thickness $t$, with two parallel polished faces. It protects a camera, seals a vacuum chamber, closes a laser tube or covers a sensor. Whatever it does besides passing the light is a defect, so a window is specified by how little it does.

### What a plate does to a beam
- **It loses light.** Each uncoated surface reflects $R = \\left(\\frac{n-1}{n+1}\\right)^2$ at normal incidence, 4.2 % for N-BK7. Counting the light that bounces between the faces, a two-surface window passes $T = \\frac{1-R}{1+R}$: 91.9 % for N-BK7, 85.6 % for sapphire, 47 % for germanium.
- **It shifts a tilted beam sideways, but does not turn it.** A plate of thickness $t$ at incidence $\\theta$ moves the ray by $t\\,\\sin(\\theta-\\theta')/\\cos\\theta'$ with $\\theta'$ the angle inside. A 10 mm N-BK7 plate at 45° shifts the beam 3.3 mm.
- **It makes a ghost.** The second surface reflects a second, fainter copy of anything the first surface reflects. With parallel faces the two copies overlap, interfere and give fringes (the *etalon effect*); with a **wedge** $\\alpha$ between the faces they separate.

### The words on the specification
| Term | Meaning | Typical value |
|---|---|---|
| Clear aperture | the central part that meets the specification | at least 90 % of the diameter |
| Parallelism or wedge | angle between the faces | under 3 arcmin standard; 30 arcmin when wedged on purpose |
| Flatness | surface form in waves at 632.8 nm | λ/4 for protection, λ/10 for interferometry |
| Surface quality | scratch–dig | 60-40 commercial, 20-10 laser grade |
| Coating | anti-reflection for a band | R below 0.5 % per surface |

A **wedged window** (about 0.5°) throws the ghost and the fringes out of the beam, at the price of deviating it by $(n-1)\\alpha$, 0.26° for N-BK7. The ghost leaves $2n\\alpha$, about 1.5°, from the main reflection.

### Choosing the material
| Material | Transmits | $n$ | Reflection per surface | Use |
|---|---|---|---|---|
| N-BK7 | 350–2000 nm | 1.519 | 4.2 % | visible and near infrared |
| fused silica | 185–2100 nm | 1.460 | 3.5 % | ultraviolet, lasers, low expansion |
| sapphire | 170–5500 nm | 1.770 | 7.7 % | hard, scratch-proof, high pressure |
| calcium fluoride | 130–9000 nm | 1.435 | 3.2 % | deep ultraviolet to mid infrared |
| ZnSe | 0.6–16 µm | 2.40 | 17 % | CO₂ lasers, thermal imaging |
| germanium | 2–14 µm | 4.00 | 36 % | thermal cameras |

### Brewster windows
Tilted to the **Brewster angle** $\\theta_B = \\arctan n$ (56.6° for N-BK7, 55.5° for fused silica at 633 nm), a window reflects none of the light polarized in the plane of incidence. A gas laser closed by such windows loses nothing in $p$ polarization but about 15 % per surface in $s$, so it oscillates in $p$ alone: linearly polarized output with no polarizer in the cavity.

### Pressure
A vacuum window carries the atmosphere: 1 bar on a 25 mm window is 49 N. Thickness is chosen for strength, not optics, and the plate is sealed with soft gaskets so that it is not strained (strain is birefringence).

> [!key] A window passes light and costs a surface reflection each side, a ghost, a sideways shift if tilted and, if wedged, a small deviation. Choose its material for the band, its coating for the loss, its wedge for the ghost.
`,
  ideas: [
    'Each uncoated surface reflects ((n − 1)/(n + 1))²; a window has two, so T = (1 − R)/(1 + R).',
    'A tilted parallel plate shifts the beam sideways but leaves its direction unchanged.',
    'The second surface makes a ghost; a small wedge sends it out of the beam, at the cost of a small deviation (n − 1)α.',
    'The material sets the band: fused silica for the ultraviolet, N-BK7 for the visible, ZnSe and germanium for the infrared.',
    'At the Brewster angle p-polarized light crosses a window with no reflection.'
  ],
  pitfalls: [
    'A tilted window bends the beam — It only displaces it sideways. The beam leaves parallel to its original direction; bending needs faces that are not parallel.',
    'A thicker window loses more light — Surface reflection does not depend on the thickness; the bulk loss of a few millimetres of glass in its transmission band is tiny. Thickness changes the shift, the weight and the strength.',
    'Any window works for any wavelength — Glass is opaque beyond about 2.5 µm and below 350 nm, and germanium is opaque to the eye. The material must be chosen for the band.',
    'Parallel faces are always best — Parallel faces make fringes and overlapping ghosts with laser light. A deliberate wedge of a few tens of arcminutes is the cure.'
  ],
  terms: [
    { term: 'Optical window', def: 'A flat plate with parallel polished faces, used to protect or seal a system while passing light in a chosen band with little change.' },
    { term: 'Clear aperture', also: ['CA', 'usable aperture'], def: 'The central region of a surface over which it meets its specification. Catalogues quote it as a diameter or a percentage of the full diameter.' },
    { term: 'Wedge', also: ['parallelism', 'wedge angle'], def: 'The angle between the two faces of a window, in arcminutes. Zero is perfectly parallel; a deliberate wedge separates the ghost reflection and removes fringes.' },
    { term: 'Brewster window', def: 'A window tilted at the Brewster angle arctan n, so that light polarized in the plane of incidence is transmitted without reflection.' },
    { term: 'Ghost reflection', also: ['ghost'], def: 'A weak second image or beam formed by a reflection from the far surface of a plate, in addition to the main one from the near surface.' },
    { term: 'Etalon effect', also: ['fringes', 'channel spectrum'], def: 'Interference between the beams reflected from the two parallel faces of a plate, which modulates the transmission with wavelength or with angle.' }
  ],
  formulas: [
    {
      name: 'Reflectance of one uncoated surface',
      expr: 'R = ((n - 1)/(n + 1))^2', tex: 'R = \\left(\\frac{n-1}{n+1}\\right)^{2}',
      vars: {
        R: { name: 'reflectance at normal incidence', q: 'ratio', unit: '%' },
        n: { name: 'refractive index of the window', value: 1.52, min: 1, max: 5 }
      },
      note: 'Light in air meeting the surface head-on; at an angle the s and p values differ.',
      stories: { R: 'A window of index {n} stands in air. What fraction of a head-on beam does each surface reflect?', n: 'A surface reflects {R} of a head-on beam. What is the index of the material?' }
    },
    {
      name: 'Transmission of an uncoated window',
      expr: 'T = (1 - R)/(1 + R)', tex: 'T = \\frac{1 - R}{1 + R}',
      vars: {
        T: { name: 'transmittance of the whole window', q: 'ratio', unit: '%' },
        R: { name: 'reflectance of one surface', q: 'ratio', unit: '%', value: 4.2, min: 0, max: 60 }
      },
      note: 'Two identical surfaces, light bouncing between them counted, no absorption in the glass. Without the multiple reflections it would be (1 − R)².',
      stories: { T: 'Each surface of a window reflects {R}. What fraction of the light does the window pass?' }
    },
    {
      name: 'Sideways shift of a tilted plate',
      expr: 's = t*sin(th - asin(sin(th)/n))/cos(asin(sin(th)/n))', tex: 's = t\\,\\frac{\\sin(\\theta-\\theta^{\\prime})}{\\cos\\theta^{\\prime}}, \\quad \\sin\\theta^{\\prime} = \\frac{\\sin\\theta}{n}',
      vars: {
        s: { name: 'sideways shift of the beam', q: 'length', unit: 'mm' },
        t: { name: 'thickness', q: 'length', unit: 'mm', value: 10 },
        th: { name: 'angle of incidence', q: 'angle', unit: '°', value: 45, min: 0, max: 85, tex: '\\theta' },
        n: { name: 'refractive index', value: 1.5168, min: 1.05, max: 5 }
      },
      solveFor: 's',
      note: 'The beam leaves parallel to the incoming one, displaced by s measured perpendicular to the beam.',
      stories: { s: 'A {t} plate of index {n} is tilted so the beam meets it at {th}. How far is the beam moved sideways?' }
    },
    {
      name: 'Brewster angle',
      expr: 'thB = atan(n)', tex: '\\theta_B = \\arctan n',
      vars: {
        thB: { name: 'Brewster angle', q: 'angle', unit: '°', tex: '\\theta_B' },
        n: { name: 'refractive index of the window', value: 1.457, min: 1.05, max: 5 }
      },
      note: 'From air. Fused silica at 633 nm: n = 1.457, 55.5°.'
    },
    {
      name: 'Deviation and ghost angle of a wedged window',
      expr: 'g = 2*n*a', tex: '\\gamma = 2\\,n\\,\\alpha',
      vars: {
        g: { name: 'angle between the two reflections', q: 'angle', unit: '°', tex: '\\gamma' },
        n: { name: 'refractive index', value: 1.5168, min: 1.05, max: 5 },
        a: { name: 'wedge angle', q: 'angle', unit: '′', value: 30, min: 0, max: 600, tex: '\\alpha' }
      },
      note: 'Small wedge, near-normal incidence. The transmitted beam itself turns by (n − 1)α.',
      stories: { g: 'A window of index {n} has a wedge of {a}. By what angle do its two reflections differ in direction?' }
    }
  ],
  examples: [
    {
      title: 'A tilted plate in a laser beam',
      q: 'A 10 mm thick N-BK7 window ($n = 1.517$) is tilted so that a laser beam meets it at 45°. How far is the beam displaced?',
      steps: [
        { text: 'Angle inside the glass:', tex: '\\sin\\theta^{\\prime} = \\frac{\\sin 45^\\circ}{1.517} = 0.466 \\quad\\Rightarrow\\quad \\theta^{\\prime} = 27.8^\\circ' },
        { text: 'The shift:', tex: 's = t\\,\\frac{\\sin(\\theta-\\theta^{\\prime})}{\\cos\\theta^{\\prime}} = 10\\,\\frac{\\sin 17.2^\\circ}{\\cos 27.8^\\circ} = 3.35\\ \\mathrm{mm}' }
      ],
      a: '3.3 mm sideways, with no change of direction. Doubling the thickness doubles the shift.'
    },
    {
      title: 'A window for a thermal camera',
      q: 'A germanium window ($n = 4.00$) protects an infrared camera. How much of the light does it pass uncoated, and what does an anti-reflection coating on both faces buy?',
      steps: [
        { text: 'One surface:', tex: 'R = \\left(\\frac{4.00-1}{4.00+1}\\right)^2 = 0.36' },
        { text: 'Two surfaces, with the multiple reflections:', tex: 'T = \\frac{1-0.36}{1+0.36} = 0.47' },
        'A good infrared coating leaves about 1 % per surface: $T = 0.99/1.01 = 0.98$ (bulk absorption ignored).'
      ],
      a: 'Uncoated, only 47 % gets through; coated, nearly all. For high-index infrared materials the coating is not an extra.'
    }
  ],
  quiz: [
    { q: 'A window of N-BK7 ($n = 1.52$) is uncoated. About how much of a normal beam does it transmit?', choices: ['96 %', '92 %', '85 %', '80 %'], a: 1, why: 'Each surface reflects about 4.2 %, so $T = (1-R)/(1+R) = 0.958/1.042 = 0.92$. Ignoring the bouncing between the faces gives 91.7 %, practically the same.' },
    { q: 'A thick parallel window is tilted in a laser beam. What happens to the beam that emerges?', choices: ['It is deviated by the tilt angle', 'It is shifted sideways and stays parallel', 'It is unchanged', 'It is totally reflected'], a: 1, why: 'The two refractions at parallel faces cancel in direction; only a sideways displacement remains.' },
    { q: 'A wedge of 30 arcmin in a window sends the beam reflected from its back surface about 1.5° away from the beam reflected from its front surface. This is what makes wedged windows useful against fringes.', a: true, why: 'The ghost leaves at $2n\\alpha \\approx 2 \\times 1.52 \\times 0.5^\\circ = 1.5^\\circ$ from the main reflection, so it no longer overlaps and interferes with it.' },
    { q: 'At what angle of incidence, in degrees, is a fused-silica window ($n = 1.457$) a Brewster window?', answer: 55.5, unit: '°', why: '$\\theta_B = \\arctan 1.457 = 55.5^\\circ$. At that angle p-polarized light is not reflected at all.' },
    { q: 'Which window material would you choose for a CO₂ laser at 10.6 µm?', choices: ['N-BK7', 'Fused silica', 'ZnSe', 'Plastic acrylic'], a: 2, why: 'Glass and acrylic absorb strongly at 10.6 µm. Zinc selenide transmits from 0.6 to 16 µm, at the price of a high index (17 % reflection per surface unless coated).' }
  ],
  applications: [
    'Vacuum chambers and cryostats: viewports of fused silica, sapphire or ZnSe sealed with gaskets or brazed.',
    'Protective windows in front of cameras, laser heads, bar-code scanners and sensors in factories.',
    'The windows of gas laser tubes, tilted at the Brewster angle to give a polarized beam.',
    'Thermal-imaging cameras, where a germanium or ZnSe window with an infrared anti-reflection coating shields the lens.',
    'Cover glasses on image sensors and photodiodes, with a few millimetres of glass between the lens and the silicon.'
  ],
  history: 'Brewster’s angle was found by David Brewster in 1815. Gas lasers took up Brewster-angle windows from the early 1960s, because they gave a polarized beam and lost almost nothing in the favoured polarization.',
  sources: [
    'E. Hecht, *Optics*, ch. 4 — the Fresnel equations, the Brewster angle and transmission through a plate.',
    'W. J. Smith, *Modern Optical Engineering* — plane-parallel plates, their image displacement and the specification of optical parts.',
    '*Handbook of Optics*, vol. IV (Optical Properties of Materials) — refractive indices and transmission ranges of window materials.'
  ],
  sim: { id: 'oc-plate', params: { mode: 'window' } }
},

/* ================================================================ mirrors */
{
  id: 'mirrors-as-components', parent: 'optical-components', title: 'Mirrors as components', level: 1,
  short: 'A flat mirror is a polished substrate with a reflecting coating on its front or its back. Optical work uses first-surface mirrors, whose coating is on the face the light meets, because a back-silvered household mirror throws a ghost.',
  keywords: ['mirror', 'first-surface mirror', 'front-surface mirror', 'second-surface mirror', 'back-surface mirror', 'turning mirror', 'fold mirror', 'steering mirror', 'substrate', 'flatness', 'kinematic mirror mount', 'protected aluminium', 'dielectric mirror', 'ghost', 'broadband mirror'],
  prereq: ['law-of-reflection', 'specular-and-diffuse-reflection', 'optical-windows'],
  related: ['dielectric-mirrors', 'metal-mirror-coatings', 'optomechanics-and-mounts', 'aligning-an-optical-system', 'plane-mirror-images', 'surface-quality-and-flatness', 'dichroic-filters-and-mirrors', 'beam-splitters', 'curved-mirrors'],
  body: `
A mirror on the bench is not the mirror in a bathroom. The bathroom mirror has its silver on the back of a glass plate, so light crosses the glass twice and the first surface adds a faint second image — a ghost. On an optical table that ghost would be a second beam, so mirrors for instruments are **first-surface** (or *front-surface*) mirrors: the coating is on the polished face the light meets, and nothing else touches the beam.

### Two constructions
| | First-surface mirror | Second-surface mirror |
|---|---|---|
| Coating | metal or dielectric stack on the front | metal on the back of the glass |
| Ghost | none | 4 % reflection from the glass face, offset by $2t\\tan\\theta^{\\prime}\\cos\\theta$ |
| Wavefront | 2 × surface error | the glass thickness and its inhomogeneity add in |
| Durability | fragile: never touch, wipe or breathe on it | the coating is protected by the glass |
| Where | instruments, lasers, telescopes | bathrooms, periscopes, decorative |

The offset of the ghost grows with the thickness and the angle: for 6 mm of glass at 45° it is 4.5 mm, wider than many beams.

### Substrate and flatness
The coating takes its shape from the **substrate**: N-BK7 or float glass for general use, fused silica for lasers and ultraviolet, and Zerodur or ULE where the temperature must not change the shape (their expansion is nearly zero). A thickness of about one sixth of the diameter keeps a mirror stiff. **Flatness** is stated in waves at 632.8 nm: $\\lambda/4$ is 158 nm, $\\lambda/10$ is 63 nm. A mirror doubles the error — the reflected wavefront is wrong by $2h\\cos\\theta$ for a surface error $h$ — so a $\\lambda/10$ mirror gives a $\\lambda/5$ wavefront at normal incidence.

### Metal or dielectric
Metals reflect over a broad band; stacks of dielectric layers reflect very strongly in a narrow one.

| Coating | Reflectance | Band | Notes |
|---|---|---|---|
| protected aluminium | 88–92 % | 400–1000 nm and the UV | cheap, flat response |
| protected silver | above 95 % | 450 nm–10 µm | best for the visible and infrared |
| gold | above 96 % | 700 nm–10 µm | poor below 550 nm |
| dielectric stack | 99.5–99.9 % | 50–200 nm wide | high laser damage threshold, depends on angle and polarization |

See [[metal-mirror-coatings]] and [[dielectric-mirrors]] for the layers. A mirror used at 45° reflects $s$ and $p$ differently, and a dielectric stack's band shifts to shorter wavelengths with angle.

### Moving and mounting
A mirror turns the beam by **twice** its own tilt: 1 mrad of mirror tilt moves the spot 10 mm at 5 m. That makes mirrors the steering element of every laser system, held in **kinematic mounts** with fine adjusters — see [[optomechanics-and-mounts]] and [[aligning-an-optical-system]].

> [!key] Optical mirrors are first-surface: the coating faces the light and there is no ghost. Choose the coating for the band, the substrate for the stability, and remember that the beam moves twice as far as the mirror tilts.
`,
  ideas: [
    'A first-surface mirror has its coating on the face the light meets; a second-surface mirror makes a ghost from the glass face.',
    'The flatness error of a mirror is doubled in the reflected wavefront.',
    'Metal coatings are broad-band and moderate in reflectance; dielectric stacks are narrow-band and above 99.5 %.',
    'A mirror turns the beam through twice its own tilt.',
    'Substrates differ in stiffness and thermal stability: N-BK7 for general use, fused silica or Zerodur where heat matters.'
  ],
  pitfalls: [
    'A silvered-back mirror is as good as any other mirror — Its glass face reflects about 4 % as a second beam, and its wavefront includes the glass. It is a household mirror, not a bench mirror.',
    'A λ/10 mirror gives a λ/10 wavefront — Reflection doubles the surface error: the wavefront error is 2h cos θ, so about λ/5 at normal incidence.',
    'A dielectric mirror is better than a metal one in every way — It is better only inside its band and its design angle; outside them its reflectance can fall below that of aluminium.',
    'If the beam is 5° off, tilt the mirror 5° — The beam turns by twice the tilt, so a 2.5° change of the mirror does it.'
  ],
  terms: [
    { term: 'First-surface mirror', also: ['front-surface mirror', 'surface mirror'], def: 'A mirror whose reflecting coating is on the polished face that the light meets first, so no light passes through the substrate.' },
    { term: 'Second-surface mirror', also: ['back-surface mirror', 'rear-surface mirror'], def: 'A mirror whose coating is on the back of a glass plate. The glass face adds a ghost reflection and the glass adds to the wavefront.' },
    { term: 'Substrate', def: 'The polished body that carries a coating: glass, fused silica, ceramic, metal or silicon carbide. It fixes the mirror’s flatness, stiffness and thermal behaviour.' },
    { term: 'Flatness', also: ['surface form', 'λ/10'], def: 'How far the surface departs from a perfect plane, in fractions of a wavelength (632.8 nm) peak to valley. A mirror of λ/10 flatness departs by less than 63 nm.' },
    { term: 'Turning mirror', also: ['fold mirror', 'steering mirror'], def: 'A flat mirror used only to change the direction of a beam, usually at 45° or 90° turns.' },
    { term: 'Kinematic mount', def: 'A holder that fixes a part at exactly three contact points and moves it with fine adjusters, so that tilting it neither bends it nor moves it sideways.' }
  ],
  formulas: [
    {
      name: 'Ghost offset of a second-surface mirror',
      expr: 'g = 2*t*tan(asin(sin(th)/n))*cos(th)', tex: 'g = 2\\,t\\,\\tan\\theta^{\\prime}\\cos\\theta, \\quad \\sin\\theta^{\\prime} = \\frac{\\sin\\theta}{n}',
      vars: {
        g: { name: 'distance between the two reflected beams', q: 'length', unit: 'mm' },
        t: { name: 'glass thickness', q: 'length', unit: 'mm', value: 6 },
        th: { name: 'angle of incidence', q: 'angle', unit: '°', value: 45, min: 0, max: 85, tex: '\\theta' },
        n: { name: 'refractive index of the glass', value: 1.5168, min: 1.05, max: 5 }
      },
      solveFor: 'g',
      note: 'Measured perpendicular to the beams. The ghost has about 4 % of the light, the main beam almost all.',
      stories: { g: 'A back-silvered mirror of {t} glass of index {n} is used at {th} incidence. How far apart are the two reflected beams?' }
    },
    {
      name: 'Wavefront error of a mirror',
      expr: 'W = 2*h*cos(th)', tex: 'W = 2\\,h\\,\\cos\\theta',
      vars: {
        W: { name: 'error of the reflected wavefront', q: 'length', unit: 'nm' },
        h: { name: 'surface error, peak to valley', q: 'length', unit: 'nm', value: 63.3 },
        th: { name: 'angle of incidence', q: 'angle', unit: '°', value: 0, min: 0, max: 85, tex: '\\theta' }
      },
      note: 'A λ/10 surface at 632.8 nm is 63.3 nm; the wavefront at normal incidence is λ/5.',
      stories: { W: 'A mirror is flat to {h} peak to valley and is used at {th} incidence. How large is the wavefront error it adds?' }
    },
    {
      name: 'Where the spot lands after a tilted mirror',
      expr: 'x = L*tan(2*dt)', tex: 'x = L\\,\\tan 2\\,\\delta',
      vars: {
        x: { name: 'movement of the spot', q: 'length', unit: 'mm' },
        L: { name: 'distance from mirror to target', q: 'length', unit: 'm', value: 5 },
        dt: { name: 'tilt of the mirror', q: 'angle', unit: 'mrad', value: 1, min: -100, max: 100, signed: true, tex: '\\delta' }
      },
      note: 'The beam turns by twice the mirror’s tilt; for small angles x = 2δL.',
      stories: { x: 'A mirror is tilted by {dt}. How far does the spot move on a wall {L} away?' }
    }
  ],
  examples: [
    {
      title: 'A back-silvered mirror in a beam',
      q: 'A back-silvered mirror of 6 mm N-BK7 is used to fold a 3 mm laser beam through 90° (45° incidence). Is the ghost separate from the main beam?',
      steps: [
        { text: 'Angle inside the glass:', tex: '\\sin\\theta^{\\prime} = \\frac{\\sin 45^\\circ}{1.517} = 0.466 \\quad\\Rightarrow\\quad \\theta^{\\prime} = 27.8^\\circ' },
        { text: 'Perpendicular offset of the two reflections:', tex: 'g = 2 t\\tan\\theta^{\\prime}\\cos\\theta = 2 \\times 6 \\times 0.527 \\times 0.707 = 4.5\\ \\mathrm{mm}' }
      ],
      a: 'The offset (4.5 mm) exceeds the beam diameter (3 mm), so the 4 % ghost runs beside the main beam as a second, faint spot. A first-surface mirror has none.'
    },
    {
      title: 'How much to tilt',
      q: 'A laser spot must move 20 mm on a target 4 m away. By how much must the mirror before it be tilted?',
      steps: [
        { text: 'The beam must turn by', tex: '2\\delta = \\arctan\\frac{20}{4000} = 5.0\\ \\mathrm{mrad}' },
        'The mirror turns by half of that.'
      ],
      a: '2.5 mrad, about 0.14°, or 8.6 arcminutes — a fraction of one turn of a fine adjuster.'
    }
  ],
  quiz: [
    { q: 'Why do laser benches use first-surface mirrors rather than household mirrors?', choices: ['They are cheaper', 'They have no ghost from the glass face and add no glass to the wavefront', 'They reflect 100 %', 'They are thinner'], a: 1, why: 'A back-silvered mirror reflects about 4 % from the glass face as well, so the beam has a faint twin, and the main beam crosses the glass twice. A first-surface mirror reflects only from its coating.' },
    { q: 'A mirror is flat to λ/10 at 632.8 nm. At normal incidence the reflected wavefront has an error of about…', choices: ['λ/20', 'λ/10', 'λ/5', 'λ/2'], a: 2, why: 'The reflected light travels the error twice, there and back: $W = 2h$, which is $2 \\times \\lambda/10 = \\lambda/5$.' },
    { q: 'A mirror is rotated by 3°. By how much does the reflected beam turn?', choices: ['1.5°', '3°', '6°', '9°'], a: 2, why: 'The law of reflection makes the beam turn through twice the angle of the mirror.' },
    { q: 'A dielectric mirror always reflects better than protected aluminium, at every wavelength and angle.', a: false, why: 'A dielectric stack reflects above 99.5 % only inside its design band and near its design angle. Outside it, the reflectance can fall far below aluminium’s 90 %.' },
    { q: 'A mirror is tilted by 0.5 mrad. How far, in millimetres, does a spot move on a wall 10 m away?', answer: 10, unit: 'mm', why: 'The beam turns by 1 mrad; over 10 m that is 10 mm.' }
  ],
  applications: [
    'Laser systems: turning mirrors and steering mirrors fold the beam on the table and set its direction.',
    'Telescopes and spectrometers: flat folding mirrors, with the coating chosen for the band and the substrate for stability.',
    'Scanners and displays: small mirrors on galvanometers, where the beam moves through twice the shaft angle.',
    'Interferometers, where the λ/10 flatness of the reference and measuring mirrors sets the accuracy of the measurement.',
    'Periscopes and viewfinders, where back-silvered or prism-based reflectors were once the rule.'
  ],
  history: 'Silvering glass on the back with a chemical deposit, by Liebig in 1835, gave the household mirror. Aluminium coated in vacuum onto the front of telescope mirrors from the 1930s replaced silver, which tarnished.',
  sources: [
    'E. Hecht, *Optics* — the law of reflection and mirrors in the chapters on geometrical optics.',
    'W. J. Smith, *Modern Optical Engineering* — plane mirrors, the effect of tilt and the specification of optical flats.',
    'ISO 10110, *Optics and photonics — Preparation of drawings for optical elements and systems* — how flatness and surface quality are stated.'
  ],
  sim: { id: 'oc-plate', params: { mode: 'mirror' } }
},

/* ================================================================ prisms */
{
  id: 'prism-types', parent: 'optical-components', title: 'The prism family', level: 2,
  short: 'Prisms are blocks of glass cut so that light enters, bounces off one or more faces and leaves. Some turn a beam by exactly 90° or 180°, some leave it straight but flip the image, one returns any ray to its source, and one spreads the colours.',
  keywords: ['prism', 'right-angle prism', 'Porro prism', 'penta prism', 'pentaprism', 'Dove prism', 'roof prism', 'Amici', 'corner cube', 'retroreflector', 'wedge prism', 'dispersing prism', 'anamorphic prism pair', 'rhomboid prism', 'total internal reflection', 'image inversion', 'image reversion'],
  prereq: ['critical-angle-and-total-internal-reflection', 'law-of-reflection', 'prism-deviation'],
  related: ['retroreflectors', 'binoculars', 'viewfinders-and-focusing-screens', 'periscopes-and-endoscopes', 'dispersion-and-the-spectrum', 'risley-prisms-and-beam-steering', 'collimating-a-laser-diode', 'beam-splitters', 'anamorphic-lenses'],
  body: `
A prism does one of three jobs: it **deviates** a beam (turns it), it **reorients** the image (flips or rotates it) or it **disperses** the light into colours. Most prisms work by **total internal reflection** (TIR), which needs no coating: a ray inside glass meeting a face at more than the critical angle (41.2° in N-BK7) is reflected completely. A 45° face passes the test whenever $n > \\sqrt 2 = 1.414$ — N-BK7 and fused silica pass, water (1.33) does not.

### The family
| Prism | Path | Deviation | The image |
|---|---|---|---|
| right-angle, hypotenuse reflecting | in through a leg, TIR, out the other leg | 90° | one reflection: mirror image |
| right-angle, hypotenuse in (Porro) | two TIRs at the legs | 180° | inverted in the plane |
| penta | two reflections, 22.5° incidence, faces coated | 90° for any tilt | not reversed |
| Dove | enters a sloping face, one TIR, leaves | none | inverted; rolling it by $\\varphi$ turns the image by $2\\varphi$ |
| roof (Amici) | a right-angle prism with a 90° roof on the hypotenuse | 90° | two reflections: not reversed |
| corner cube | three reflections off three mutually perpendicular faces | 180° exactly, in every direction | returns the beam parallel to itself |
| rhomboid | two parallel TIR faces | none | beam shifted sideways |
| wedge | two refractions | $(n-1)\\alpha$ | unchanged |
| equilateral | two refractions | 38.6° at minimum, colour-dependent | colours spread |
| anamorphic pair | two refractions at steep incidence | none | one dimension expanded |

### Which keep their direction
Three prisms are valued because of what they do **not** change. A **penta prism** turns every beam through exactly 90°, however it is rotated; a mirror used for the same job would turn it through $90° + 2\\times$ the error. Put one in a surveyor’s optical square and in a rangefinder. A **corner cube** (three mirror faces or a solid cube with TIR) sends every ray back parallel to the one it received — the reflector on a bicycle and the arrays the Apollo missions left on the Moon. A **Dove prism** leaves the beam on its line and rolls the image at twice its own rotation: a **derotator** for rotating scenes. It must be set square to the beam, because tilted in the plane of reflection it swings the beam like a mirror, through twice the tilt.

### Putting it on the image
Each reflection reverses the image (a mirror image); two put it back. The right-angle prism, with one reflection, reverses; the penta prism, with two, does not. A roof prism replaces the single reflecting face by a 90° roof: the beam still turns by 90°, but by two reflections, so the image comes out the right way round — the reason binoculars with roof prisms can be straight and slim.

### Dispersion and anamorphic pairs
An equilateral N-BK7 prism turns yellow light by 38.6° at minimum deviation, red by 38.4° and blue by 39.1°. A prism pair used at steep incidence (70° from the normal) expands one axis of a beam by $\\cos\\theta'/\\cos\\theta = 2.3$ per prism: the standard way to round the elliptical beam of a diode laser.

> [!key] Choose a prism for what it keeps and what it changes: the penta prism keeps a 90° turn, the corner cube keeps the return, the Dove prism keeps the line. TIR at 45° needs n above 1.414.
`,
  ideas: [
    'Most prisms use total internal reflection, which works at a 45° face when n exceeds √2.',
    'A penta prism deviates the beam by exactly 90° whatever its rotation; a corner cube returns every ray parallel to itself.',
    'A Dove prism passes the beam straight on and inverts the image; rolling it turns the image twice as fast.',
    'Each reflection reverses the image; a roof prism turns the beam by 90° with two reflections instead of one, so it does not.',
    'A pair of prisms at steep incidence expands a beam in one direction only.'
  ],
  pitfalls: [
    'All prisms need a mirror coating on their reflecting faces — Total internal reflection needs none when the incidence exceeds the critical angle. Only prisms whose faces see steeper-than-critical light, like the penta prism at 22.5°, need a coating.',
    'A prism always splits white light into colours — Only a prism whose faces are inclined, like the equilateral prism, does so noticeably. Reflecting prisms are used with the light entering and leaving at right angles to the faces, where the colours cancel.',
    'Rotating a right-angle prism changes nothing — The 90° prism acts like a mirror, so tilting it turns the beam twice as much. Use the penta prism when the turn must stay at 90°.',
    'A corner cube is two mirrors — Two perpendicular mirrors return rays that lie in one plane. The third face is what returns rays that come in at an angle out of the plane.'
  ],
  terms: [
    { term: 'Total internal reflection', also: ['TIR'], def: 'Complete reflection of light at the face of a denser medium when it arrives from inside at more than the critical angle. It makes a coating unnecessary on many prism faces.' },
    { term: 'Penta prism', also: ['pentaprism'], def: 'A five-sided prism with two coated reflecting faces at 45° to each other. It deviates a beam by exactly 90°, for any rotation of the prism, without reversing the image.' },
    { term: 'Dove prism', def: 'A truncated right-angle prism that passes a beam along its line and inverts the image. Rolling it by an angle rotates the image by twice that angle.' },
    { term: 'Roof prism', also: ['Amici prism'], def: 'A prism with two faces meeting at 90° (a roof) in place of a reflecting face. Its two reflections, instead of one, leave the image unreversed.' },
    { term: 'Corner cube', also: ['corner-cube retroreflector', 'cube corner'], def: 'Three mutually perpendicular reflecting faces that return any incoming ray in the opposite direction, parallel to itself.' },
    { term: 'Anamorphic prism pair', def: 'Two prisms used at steep incidence that magnify a beam in one direction only, to turn an elliptical beam round.' },
    { term: 'Image inversion and reversion', def: 'Inversion turns an image upside down, reversion swaps left and right. A single reflection gives a mirror image; two reflections restore it.' }
  ],
  formulas: [
    {
      name: 'Critical angle for total internal reflection',
      expr: 'thc = asin(1/n)', tex: '\\theta_c = \\arcsin\\frac{1}{n}',
      vars: {
        thc: { name: 'critical angle in glass against air', q: 'angle', unit: '°', tex: '\\theta_c' },
        n: { name: 'refractive index', value: 1.5168, min: 1.01, max: 5 }
      },
      note: 'A 45° face reflects totally only if the critical angle is below 45°, that is n > 1.414.'
    },
    {
      name: 'Deviation of a thin wedge',
      expr: 'd = (n - 1)*a', tex: '\\delta = (n - 1)\\,\\alpha',
      vars: {
        d: { name: 'deviation', q: 'angle', unit: '°', tex: '\\delta' },
        n: { name: 'refractive index', value: 1.5168, min: 1.05, max: 5 },
        a: { name: 'wedge angle', q: 'angle', unit: '°', value: 2, min: 0, max: 15, tex: '\\alpha' }
      },
      note: 'Small apex angle, near-normal incidence. The beam turns towards the thick end.'
    },
    {
      name: 'Minimum deviation of a prism',
      expr: 'd = 2*asin(n*sin(A/2)) - A', tex: '\\delta_{\\min} = 2\\arcsin\\!\\left(n\\sin\\frac{A}{2}\\right) - A',
      vars: {
        d: { name: 'minimum deviation', q: 'angle', unit: '°', tex: '\\delta_{\\min}' },
        n: { name: 'refractive index', value: 1.5168, min: 1.05, max: 3 },
        A: { name: 'apex angle', q: 'angle', unit: '°', value: 60, min: 5, max: 120 }
      },
      note: 'The ray passes symmetrically through the prism. The index changes with colour, which is dispersion.',
      stories: { d: 'A prism of apex angle {A} and index {n}. By how much does it turn the ray at minimum deviation?' }
    },
    {
      name: 'Beam expansion by one prism at steep incidence',
      expr: 'M = cos(asin(sin(th)/n))/cos(th)', tex: 'M = \\frac{\\cos\\theta^{\\prime}}{\\cos\\theta}, \\quad \\sin\\theta^{\\prime} = \\frac{\\sin\\theta}{n}',
      vars: {
        M: { name: 'expansion of the beam in the plane of incidence' },
        th: { name: 'angle of incidence', q: 'angle', unit: '°', value: 70, min: 0, max: 85, tex: '\\theta' },
        n: { name: 'refractive index', value: 1.5168, min: 1.05, max: 5 }
      },
      solveFor: 'M',
      note: 'For a beam that leaves the prism along the normal to its second face. A pair expands by M².',
      stories: { M: 'A beam meets a prism of index {n} at {th} and leaves along the normal of the second face. By what factor is its width multiplied?' }
    },
    {
      name: 'Image rotation by a Dove prism',
      expr: 'r = 2*phi', tex: 'r = 2\\,\\varphi',
      vars: {
        r: { name: 'rotation of the image', q: 'angle', unit: '°' },
        phi: { name: 'roll of the prism about the beam', q: 'angle', unit: '°', value: 15, signed: true, tex: '\\varphi' }
      },
      note: 'Used in collimated light. Half the prism’s speed derotates a rotating scene.',
      practice: { unknowns: ['r'] }
    }
  ],
  examples: [
    {
      title: 'A diode laser beam made round',
      q: 'A diode laser beam is 1 mm wide in the plane of its fast axis and 3 mm in the other. Two N-BK7 prisms, each meeting the beam at 60° and letting it out along the normal, are set to expand the narrow axis. How wide does it become?',
      steps: [
        { text: 'Angle inside one prism:', tex: '\\sin\\theta^{\\prime} = \\frac{\\sin 60^\\circ}{1.517} = 0.571 \\quad\\Rightarrow\\quad \\theta^{\\prime} = 34.8^\\circ' },
        { text: 'Expansion per prism, then for the pair:', tex: 'M = \\frac{\\cos 34.8^\\circ}{\\cos 60^\\circ} = 1.64, \\qquad M^2 = 2.70' },
        'The 1 mm axis becomes 2.7 mm.'
      ],
      a: '2.7 mm, so the beam is nearly round (2.7 by 3 mm). Steeper incidence expands more but loses more light to reflection.'
    },
    {
      title: 'Can water make a 45° mirror?',
      q: 'Does a 45° face between glass of index 1.52 and air reflect totally? Does a 45° face between water and air?',
      steps: [
        { text: 'Critical angles:', tex: '\\theta_c(\\text{glass}) = \\arcsin\\frac{1}{1.52} = 41.1^\\circ, \\qquad \\theta_c(\\text{water}) = \\arcsin\\frac{1}{1.333} = 48.6^\\circ' },
        'A ray at 45° exceeds the glass limit but not the water limit.'
      ],
      a: 'Glass: yes, total reflection. Water: no — the ray is partly transmitted, so a water prism with a 45° face needs a mirror coating.'
    }
  ],
  quiz: [
    { q: 'A right-angle prism turns a beam by 90° with its hypotenuse. Of what must the prism be made for total internal reflection at 45°?', choices: ['any transparent material', 'a material with n above 1.414', 'a material with n below 1.414', 'a material with a mirror coating only'], a: 1, why: 'Total reflection needs the angle of incidence (45°) to exceed the critical angle $\\arcsin(1/n)$, which means $n > 1/\\sin 45° = 1.414$.' },
    { q: 'A penta prism is rotated by 2° about the axis perpendicular to the beam. The beam leaving it turns by…', choices: ['4°', '2°', '1°', '0°, it stays at exactly 90° from the input'], a: 3, why: 'The two reflecting faces are fixed 45° apart, so the deviation is always $2 \\times 45° = 90°$, whatever the prism’s rotation. A single mirror would turn the beam by 4°.' },
    { q: 'A Dove prism is rolled by 20° about the axis of a collimated beam. The image rotates by 40°.', a: true, why: 'A Dove prism is a reflector in a plane; rolling a plane mirror by $\\varphi$ rotates the reflection by $2\\varphi$.' },
    { q: 'An equilateral prism of N-BK7 has a minimum deviation of 38.6° for yellow light. What is its minimum deviation for blue light, which has a higher index?', choices: ['smaller than 38.6°', 'exactly 38.6°', 'larger than 38.6°', 'zero'], a: 2, why: 'A higher index turns the ray more: 39.1° at the F line (486 nm), against 38.4° for red.' },
    { q: 'Light is reflected three times in a corner cube. After the third reflection the ray travels…', choices: ['at 90° to the incoming ray', 'parallel to the incoming ray, in the opposite direction', 'along the incoming ray, in the same direction', 'in a random direction'], a: 1, why: 'Reflection in three mutually perpendicular planes reverses each component of the direction in turn, so $\\vec d \\to -\\vec d$ for any incoming direction.' }
  ],
  applications: [
    'Binoculars and monoculars: pairs of Porro prisms, or roof prisms, erect the image and fold the long optical path.',
    'Single-lens reflex cameras: a roof pentaprism turns the focusing screen’s image upright and the right way round for the eye.',
    'Surveying and construction: penta prisms in optical squares, corner cubes on the target poles of total stations.',
    'Retroreflectors on roads, bicycles and in the arrays left on the Moon, whose reflection times the Earth–Moon distance.',
    'Laser systems: wedge prisms and Risley pairs steer beams; anamorphic pairs round diode beams; Dove prisms derotate images.'
  ],
  history: 'Giovanni Battista Amici made roof prisms in the early nineteenth century for instruments and microscopes. Ignazio Porro patented his prism system for erecting images in 1854, and Ernst Abbe’s work with Carl Zeiss in the 1890s made Porro-prism binoculars the standard.',
  sources: [
    'W. J. Smith, *Modern Optical Engineering* — prisms and reflectors: the unfolding of reflecting prisms and the image orientation of each.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE) — the standard reflecting prisms on one page each.',
    'E. Hecht, *Optics* — total internal reflection and the deviating prism.'
  ],
  sim: 'oc-prism'
},

/* ================================================================ beam splitters */
{
  id: 'beam-splitters', parent: 'optical-components', title: 'Beam splitters', level: 1,
  short: 'A beam splitter divides one beam into two, reflecting a chosen fraction and transmitting the rest. Plate, cube, pellicle and polka-dot splitters differ in ghosts, beam shift, polarization behaviour and fragility; run backwards, the same part combines two beams.',
  keywords: ['beam splitter', 'beamsplitter', 'plate beam splitter', 'cube beam splitter', 'pellicle', 'polka-dot beam splitter', 'split ratio', '50/50', '70/30', '90/10', 'ghost', 'wedge', 'beam combiner', 'compensator plate', 'non-polarizing', 'half-silvered mirror'],
  prereq: ['optical-windows', 'fresnel-reflection', 'dielectric-mirrors'],
  related: ['polarizing-beam-splitters', 'dichroic-filters-and-mirrors', 'prism-types', 'mirrors-as-components', 'michelson-interferometer', 'metal-mirror-coatings', 'multilayer-coatings', 'viewfinders-and-focusing-screens', 'reading-an-optics-catalogue'],
  body: `
A beam splitter reflects part of a beam and transmits the rest. It lets a camera and an eyepiece share one microscope, an interferometer compare a beam with itself, a laser power meter sample a beam without stopping it. Used backwards it is a **combiner**: two beams enter, one leaves along a common path.

### The four constructions
| Type | What it is | Strength | Weakness |
|---|---|---|---|
| plate | a glass plate at 45°, partly reflecting coating in front, anti-reflection behind | cheap, light, large apertures | ghost from the back face; transmitted beam shifted; strongly polarization-dependent at 45° |
| cube | two right-angle prisms cemented on the hypotenuse, coating between | no ghost, no shift, beams leave square to the faces | heavy; the cement limits laser power |
| pellicle | a 2–5 µm membrane stretched on a frame | no ghost, no shift, very broad band | fragile, vibrates, shows fringes |
| polka-dot | glass plate carrying a pattern of metal dots | ratio set by the dot coverage, nearly the same for every colour and polarization | scatter from the pattern, absorption |

### The ratio and what is lost
The ratio is written **R:T** — 50:50, 70:30, 90:10, or 99:1 for a sampling splitter — with a tolerance of a few per cent. A **dielectric** coating of a few layers loses almost nothing: R + T ≈ 100 %. A **thin metal film** absorbs, typically 10 to 40 % of the light, but is less sensitive to wavelength. At 45° the two polarizations split differently: a simple three-layer dielectric design reflects 80 % of s and 48 % of p light, while a **non-polarizing** splitter is built from many layers to bring them within a few per cent of each other.

### Ghost, shift and wedge
The back face of a plate is not perfectly anti-reflecting and returns a faint second beam, displaced by $2t\\tan\\theta^{\\prime}\\cos\\theta$ from the first: 2.2 mm for a 3 mm plate of N-BK7 at 45°. A **wedge** of 10 to 30 arcminutes steers it away. The transmitted beam is shifted sideways by $t\\sin(\\theta-\\theta^{\\prime})/\\cos\\theta^{\\prime}$, 1.0 mm for the same plate. A cube has neither, which is why it is chosen for imaging; a pellicle has neither because its faces are only micrometres apart.

### Compensating
In Michelson’s interferometer a plate splitter puts the reflected arm through the glass once and the transmitted arm three times. A **compensator plate** of the same thickness, in the other arm, equalizes the glass paths. Cube splitters are balanced by construction.

### Combining
Beams A and B enter from different sides. One output carries $T\\,P_A + R\\,P_B$, the other $R\\,P_A + T\\,P_B$. For two beams of the same wavelength and polarization and a 50:50 split, half the total power leaves by the unwanted port. Only a beam combiner that discriminates — by polarization ([[polarizing-beam-splitters]]) or by colour ([[dichroic-filters-and-mirrors]]) — combines without loss.

> [!key] R:T sets the split, the construction sets the faults: plate (ghost and shift), cube (none, but heavy), pellicle (none, but fragile). Dielectric coatings waste nothing, metal ones absorb, and any splitter run backwards loses power when it merges two like beams.
`,
  ideas: [
    'A beam splitter reflects R and transmits T of the power; a dielectric coating wastes almost nothing, a metal one absorbs 10–40 %.',
    'A plate gives a ghost beam from its back face and shifts the transmitted beam; a cube and a pellicle do neither.',
    'At 45° a simple coating reflects s and p light differently; non-polarizing splitters are many-layered designs that even them out.',
    'A wedge or an anti-reflection coating on the back face removes the ghost.',
    'Merging two like beams with a splitter wastes half of the total power at 50:50: use polarization or colour for lossless combination.'
  ],
  pitfalls: [
    'R + T always makes 100 % — That holds only for a lossless (dielectric) coating. A thin metal film absorbs, often 10 to 40 %, and the rest is neither reflected nor transmitted.',
    'A 50:50 splitter splits every beam in half — The ratio is set for one wavelength band, one angle (usually 45°) and often one polarization. Another colour, angle or polarization gives a different ratio.',
    'A plate and a cube are the same thing in different shapes — A plate has a ghost beam and shifts the transmitted beam; a cube has neither. Their polarization behaviour also differs.',
    'A combiner merges two beams with no loss — A passive splitter sends half of each equal beam out of the other port. Lossless combination needs polarization or wavelength to tell the beams apart.'
  ],
  terms: [
    { term: 'Beam splitter', also: ['beamsplitter', 'BS'], def: 'An optical element that divides a beam into a reflected and a transmitted part. Used backwards it combines two beams.' },
    { term: 'Split ratio', also: ['R:T', 'reflection-to-transmission ratio', '50:50'], def: 'The reflected and transmitted fractions of the power, written R:T, for a stated wavelength, angle and polarization: 50:50, 70:30, 90:10.' },
    { term: 'Plate beam splitter', def: 'A flat plate used at about 45° with a partly reflecting coating on one face and an anti-reflection coating on the other. It shifts the transmitted beam and can make a ghost beam.' },
    { term: 'Cube beam splitter', also: ['beam-splitter cube'], def: 'Two right-angle prisms cemented on their hypotenuses with the splitting coating between. Beams enter and leave perpendicular to the faces, with no ghost and no shift.' },
    { term: 'Pellicle', also: ['pellicle beam splitter'], def: 'A membrane a few micrometres thick stretched over a frame, used as a splitter that has no ghost and no beam shift but is fragile and vibrates.' },
    { term: 'Non-polarizing beam splitter', also: ['NPBS'], def: 'A splitter whose ratio is nearly the same for s and p polarization at its design angle, unlike a simple coating at 45°.' },
    { term: 'Compensator plate', def: 'A plate of the same glass and thickness as a plate splitter, placed in the other arm of an interferometer so both beams cross equal paths of glass.' }
  ],
  formulas: [
    {
      name: 'Power budget of a splitter',
      expr: 'A = 1 - R - T', tex: 'A = 1 - R - T',
      vars: {
        A: { name: 'fraction absorbed or scattered', q: 'ratio', unit: '%' },
        R: { name: 'fraction reflected', q: 'ratio', unit: '%', value: 31, min: 0, max: 100 },
        T: { name: 'fraction transmitted', q: 'ratio', unit: '%', value: 32, min: 0, max: 100 }
      },
      note: 'About 37 % absorbed is what a thin chromium film gives when it reflects and transmits equally (R ≈ T ≈ 31 %).',
      stories: { A: 'A splitter reflects {R} and transmits {T} of a beam. What fraction is lost to absorption?' }
    },
    {
      name: 'Output of one port of a combiner',
      expr: 'P = T*Pa + R*Pb', tex: 'P = T\\,P_A + R\\,P_B',
      vars: {
        P: { name: 'power in the output port', q: 'power', unit: 'mW' },
        T: { name: 'transmittance', q: 'ratio', unit: '%', value: 50, min: 0, max: 100 },
        Pa: { name: 'power of the beam A', q: 'power', unit: 'mW', value: 10, tex: 'P_A' },
        R: { name: 'reflectance', q: 'ratio', unit: '%', value: 50, min: 0, max: 100 },
        Pb: { name: 'power of the beam B', q: 'power', unit: 'mW', value: 10, tex: 'P_B' }
      },
      note: 'The port that A transmits and B reflects into. Powers add when the beams do not interfere.',
      stories: { P: 'Beams of {Pa} and {Pb} meet a splitter with T = {T} and R = {R}. How much power leaves the port that A passes through and B is reflected into?' }
    },
    {
      name: 'Ghost offset of a plate splitter',
      expr: 'g = 2*t*tan(asin(sin(th)/n))*cos(th)', tex: 'g = 2\\,t\\,\\tan\\theta^{\\prime}\\cos\\theta, \\quad \\sin\\theta^{\\prime} = \\frac{\\sin\\theta}{n}',
      vars: {
        g: { name: 'distance between the two reflected beams', q: 'length', unit: 'mm' },
        t: { name: 'plate thickness', q: 'length', unit: 'mm', value: 3 },
        th: { name: 'angle of incidence', q: 'angle', unit: '°', value: 45, min: 0, max: 85, tex: '\\theta' },
        n: { name: 'refractive index', value: 1.5168, min: 1.05, max: 5 }
      },
      solveFor: 'g',
      note: 'Measured across the beams. A wedge changes it into an angle.',
      stories: { g: 'A {t} plate splitter of index {n} is used at {th}. How far apart are the two reflected beams?' }
    }
  ],
  examples: [
    {
      title: 'A monitor for a laser',
      q: 'A 90:10 dielectric splitter (R = 10 %) samples a 50 mW laser for a power monitor. How much reaches the monitor and how much continues?',
      steps: [
        { text: 'The reflected port:', tex: 'P_R = 0.10 \\times 50\\ \\mathrm{mW} = 5\\ \\mathrm{mW}' },
        { text: 'The transmitted beam, with the coating absorbing nothing:', tex: 'P_T = 0.90 \\times 50\\ \\mathrm{mW} = 45\\ \\mathrm{mW}' }
      ],
      a: '5 mW to the monitor, 45 mW onwards. If the monitor must be calibrated, remember that the 10:90 ratio holds for one polarization and angle; at 45° the p and s values differ.'
    },
    {
      title: 'Merging two lasers with a 50:50 cube',
      q: 'Two lasers of 10 mW each, of different wavelengths, are merged with a 50:50 cube splitter. How much power leaves along the common path?',
      steps: [
        { text: 'The port in line with A carries what A transmits plus what B reflects:', tex: 'P = 0.5 \\times 10 + 0.5 \\times 10 = 10\\ \\mathrm{mW}' },
        'The other half of each beam (10 mW in all) goes out of the second port.'
      ],
      a: '10 mW of the 20 mW, an efficiency of 50 %. A dichroic mirror that reflects one colour and passes the other would send all 20 mW the same way.'
    }
  ],
  quiz: [
    { q: 'A plate beam splitter has a ghost beam and a cube splitter does not, because…', choices: ['the cube has a better coating', 'a cube’s beams enter and leave square to the faces and the coating is between two cemented prisms, so no free glass face reflects a second beam', 'the cube is bigger', 'cubes are made of fused silica'], a: 1, why: 'The plate’s back face, in air, returns a weak second reflection. In a cube both outer faces are met at normal incidence and anti-reflection coated, and the coating sits inside the glass.' },
    { q: 'A thin metal splitter reflects 30 % and transmits 30 % of a beam. What happens to the other 40 %?', choices: ['It is reflected twice', 'It is absorbed in the metal', 'It is transmitted in another direction', 'Nothing: R + T must be 100 %'], a: 1, why: 'Metal films absorb. Only a lossless (dielectric) coating has R + T = 100 %.' },
    { q: 'Two equal beams of the same colour and polarization are combined with a 50:50 splitter. What fraction of the total power leaves by one output port?', choices: ['all of it', '75 %', '50 %', '25 %'], a: 2, why: 'Each beam is split evenly, so each output port receives half of each beam: half of the total power.' },
    { q: 'A 50:50 splitter specified at 45° is used at 30° with a different laser. It is still exactly 50:50.', a: false, why: 'The split ratio is specified for a wavelength band, an angle of incidence and often a polarization. Away from them, R and T change, and in a simple coating s and p light split differently.' },
    { q: 'A 3 mm plate of N-BK7 is used as a splitter at 45°. About how far, in millimetres, is the ghost from the main reflected beam?', answer: 2.23, unit: 'mm', why: '$g = 2 t \\tan\\theta^{\\prime}\\cos\\theta = 2 \\times 3 \\times \\tan 27.8^\\circ \\times \\cos 45^\\circ = 2.2$ mm.' }
  ],
  applications: [
    'Interferometers: Michelson, Mach–Zehnder and Twyman–Green all split a beam and recombine it.',
    'Microscopes and cameras: a cube sends part of the image to an eyepiece and part to a camera port.',
    'Laser power monitors and feedback: a 99:1 or 90:10 splitter samples a beam for a photodiode.',
    'Single-lens reflex cameras (early pellicle models) and head-up displays, where a partly reflecting combiner overlays information on the view.',
    'Illumination in machine vision: coaxial (on-axis) light enters the camera path through a splitter.'
  ],
  history: 'Albert Michelson used a half-silvered plate and a compensator in his interferometer in 1881. The pellicle splitter reached photography with a Canon single-lens reflex camera of 1965, which let the viewfinder and the film share the light all the time.',
  sources: [
    'E. Hecht, *Optics* — beam splitters in the chapter on interferometry, and the Fresnel equations.',
    'H. A. Macleod, *Thin-Film Optical Filters* — beam-splitter coatings, metal and dielectric, and their polarization behaviour.',
    'W. J. Smith, *Modern Optical Engineering* — plates in beams: displacement, ghosts and compensating plates.'
  ],
  sim: 'oc-splitter'
},

/* ================================================================ polarizing beam splitters */
{
  id: 'polarizing-beam-splitters', parent: 'optical-components', title: 'Polarizing beam splitters', level: 2,
  short: 'A polarizing beam splitter sends the two polarizations of a beam to different places: p light straight on, s light to the side. Cubes, wire grids and birefringent prisms do it, and with a quarter-wave plate the cube becomes an isolator that keeps reflections away from a laser.',
  keywords: ['polarizing beam splitter', 'PBS', 'PBS cube', 'polarization beam splitter', 'extinction ratio', 'wire grid polarizer', 'Wollaston prism', 'Glan-Taylor', 'Glan-Thompson', 'MacNeille', 'optical isolator', 'quarter-wave plate', 'p polarization', 's polarization'],
  prereq: ['beam-splitters', 'polarizers-and-malus-law', 'wave-plates', 'birefringence'],
  related: ['optical-isolators-and-modulators', 'brewster-angle', 'polarization-by-reflection-and-scattering', 'jones-calculus', 'liquid-crystals-and-displays', 'polarization-in-practice', 'dielectric-mirrors', 'optical-crystals'],
  body: `
A polarizing beam splitter (PBS) divides a beam by polarization, not by amount. Light polarized in the plane of incidence, **p**, passes straight through; light polarized across it, **s** (from the German *senkrecht*, perpendicular), is reflected at 90°. Unpolarized light is split into two beams of about half the power each, and a linearly polarized beam goes wholly to one port or the other depending on its angle — so a PBS also works as a variable splitter.

### The cube
The common **PBS cube** is two prisms cemented on their hypotenuse, with many dielectric layers between, arranged so that at 45° every interface is at its Brewster angle for p light: nothing of $p$ is reflected, while the stack reflects $s$ strongly (the MacNeille design). It splits a beam of angle $\\theta$ to the plane of incidence into $P\\cos^2\\theta$ transmitted and $P\\sin^2\\theta$ reflected.

### Extinction ratio
The split is never perfect. The **extinction ratio** is the ratio of wanted to unwanted light in a port: for the transmitted beam, $\\mathrm{ER} = T_p/T_s$, typically about 1000:1 (30 dB); the reflected beam is less pure, about 20:1 to 100:1, because some p light is reflected too. When purity matters, a second PBS or polarizer cleans up the reflected beam.

### Other ways to split
| Type | How | Output | Notes |
|---|---|---|---|
| cube (MacNeille) | layers at Brewster's angle | p straight, s at 90° | compact; a band of tens of nanometres, or the whole visible for broadband versions |
| plate | the same coating on a plate at 45° | p straight, s at 90° | lighter, ghosts |
| wire grid | parallel fine metal wires | the polarization across the wires passes, along them is reflected | wide angle, very broad band |
| Wollaston prism | two calcite wedges, optic axes crossed | two beams diverging by $\\delta \\approx 2(n_o - n_e)\\tan\\alpha$ | symmetric, both polarizations kept |
| Glan–Taylor and Glan–Thompson | two calcite prisms | one polarization passes, the other is thrown out of the side | extinction up to 100 000:1 |

For calcite, $n_o - n_e = 0.172$, so a Wollaston prism with a 20° wedge angle splits the beams by about 7°.

### The quarter-wave isolator
Put a **quarter-wave plate** at 45° after a PBS. The transmitted p beam becomes circular, reflects from a target (turning to the opposite handedness), and passes the plate again. Two passes through a quarter-wave plate act as a half-wave plate at 45°: p has become s, and the PBS **reflects** it to the side instead of passing it back to the laser. This is how a laser is kept from its own reflections, how an optical-disc pickup separates the returning beam, and how a confocal microscope sends its signal to the detector. A Faraday isolator ([[optical-isolators-and-modulators]]) does the same without a target in the path.

> [!key] A PBS passes p and reflects s, with an extinction ratio of 1000:1 or so in the transmitted beam. A quarter-wave plate behind it turns the returning beam from p into s, so the cube sends it aside.
`,
  ideas: [
    'A PBS transmits p (in the plane of incidence) and reflects s (across it); the power split follows Malus’s law, cos² and sin².',
    'The extinction ratio — wanted over unwanted light in a port — is about 1000:1 for the transmitted beam of a cube and lower for the reflected one.',
    'Wire grids, Wollaston prisms and Glan prisms also separate polarizations; the calcite ones reach the purest output.',
    'Light going out through a PBS and a quarter-wave plate and coming back reflected returns with its polarization turned by 90°.',
    'The same quarter-wave plus PBS combination is an isolator for reflections from a target.'
  ],
  pitfalls: [
    'A PBS removes the unwanted polarization completely — It sends each polarization mainly one way; the extinction ratio is 1000:1 in the transmitted beam and often only 20:1 to 100:1 in the reflected one.',
    'A PBS cube works however it is turned about the beam — The labels p and s refer to the plane of incidence on the coating. Turn the cube by 90° about the beam and the roles of p and s swap, and the reflected beam leaves in another direction.',
    'A quarter-wave plate turns polarization by 90° — One pass makes linear light circular. Two passes (there and back) act like a half-wave plate and turn the plane by 90°.',
    'A polarizing cube works for any wavelength — Its coating is designed for a band; outside it, the extinction ratio falls and the split drifts.'
  ],
  terms: [
    { term: 'Polarizing beam splitter', also: ['PBS', 'polarization beam splitter'], def: 'An element that sends the p and s polarizations of a beam in different directions: p transmitted, s reflected, in the usual cube.' },
    { term: 'p and s polarization', also: ['TM and TE', 'parallel and senkrecht'], def: 'Light polarized in the plane of incidence (p) and perpendicular to it (s) at a surface or coating.' },
    { term: 'Extinction ratio', also: ['ER', 'polarization extinction ratio', 'PER'], def: 'The ratio of the wanted to the unwanted polarization in a beam or a port, such as 1000:1, or 30 dB.' },
    { term: 'MacNeille cube', def: 'A PBS cube whose layers are tilted at Brewster’s angle inside, so p light meets no reflection at any interface while s light is reflected by the stack.' },
    { term: 'Wollaston prism', def: 'Two birefringent wedges cemented with their axes crossed, which splits a beam into two orthogonally polarized beams that leave at equal and opposite angles.' },
    { term: 'Glan–Taylor prism', also: ['Glan–Thompson prism', 'Glan polarizer'], def: 'A polarizing prism of two calcite crystals that transmits one polarization and throws the other out of the side, with an extinction of up to 100 000:1.' },
    { term: 'Optical isolator', def: 'A device that passes light one way and blocks its return. A polarizer with a quarter-wave plate does it for reflections from a target; a Faraday rotator does it without one.' }
  ],
  formulas: [
    {
      name: 'Power sent through the cube',
      expr: 'Pt = P*cos(th)^2', tex: 'P_t = P\\cos^2\\theta',
      vars: {
        Pt: { name: 'transmitted (p) power', q: 'power', unit: 'mW', tex: 'P_t' },
        P: { name: 'power of the linearly polarized beam', q: 'power', unit: 'mW', value: 10 },
        th: { name: 'angle between the polarization and the p axis', q: 'angle', unit: '°', value: 30, min: 0, max: 90, tex: '\\theta' }
      },
      note: 'The remaining P sin²θ is reflected. For an unpolarized beam, half goes each way.',
      stories: { Pt: 'A linearly polarized beam of {P} is at {th} to the p axis of a PBS. How much is transmitted?' }
    },
    {
      name: 'Extinction ratio in decibels',
      expr: 'dB = 10*log(ER)', tex: '\\mathrm{ER}_{\\mathrm{dB}} = 10\\log_{10}\\mathrm{ER}',
      vars: {
        dB: { name: 'extinction ratio in decibels', tex: '\\mathrm{ER}_{\\mathrm{dB}}' },
        ER: { name: 'extinction ratio (wanted : unwanted)', value: 1000, min: 1, max: 1e7, tex: '\\mathrm{ER}' }
      },
      note: '1000:1 is 30 dB; 100 000:1 is 50 dB.'
    },
    {
      name: 'Unwanted light in a port',
      expr: 'Pl = P/ER', tex: 'P_{\\mathrm{leak}} = \\frac{P}{\\mathrm{ER}}',
      vars: {
        Pl: { name: 'unwanted power', q: 'power', unit: 'µW', tex: 'P_{\\mathrm{leak}}' },
        P: { name: 'wanted power', q: 'power', unit: 'mW', value: 10 },
        ER: { name: 'extinction ratio', value: 1000, min: 1, max: 1e7, tex: '\\mathrm{ER}' }
      },
      note: 'Taking the wanted power as nearly all the light in the port.',
      stories: { Pl: 'A port carries {P} of the wanted polarization with an extinction ratio of {ER}. How much light of the other polarization is mixed in?' }
    },
    {
      name: 'Splitting angle of a Wollaston prism',
      expr: 'd = 2*dn*tan(a)', tex: '\\delta \\approx 2\\,\\Delta n\\,\\tan\\alpha',
      vars: {
        d: { name: 'angle between the two beams', q: 'angle', unit: '°', tex: '\\delta' },
        dn: { name: 'birefringence nₒ − nₑ', value: 0.172, min: 0.001, max: 0.3, tex: '\\Delta n' },
        a: { name: 'wedge angle', q: 'angle', unit: '°', value: 20, min: 1, max: 60, tex: '\\alpha' }
      },
      note: 'Small-angle estimate for normal incidence; calcite has Δn = 0.172, quartz 0.009.',
      stories: { d: 'A Wollaston prism with wedges of {a} and birefringence {dn} splits a beam. By what angle do the two beams diverge?' }
    }
  ],
  examples: [
    {
      title: 'A polarized laser into a PBS',
      q: 'A linearly polarized 20 mW laser beam meets a PBS cube with its polarization at 20° to the p axis. How much goes to each port, and how much to the wrong port if the extinction ratio of the transmitted beam is 1000:1?',
      steps: [
        { text: 'Transmitted (p) and reflected (s) shares:', tex: 'P_t = 20\\cos^2 20^\\circ = 17.7\\ \\mathrm{mW}, \\qquad P_r = 20\\sin^2 20^\\circ = 2.3\\ \\mathrm{mW}' },
        { text: 'In the transmitted beam, the unwanted s light is about', tex: '\\frac{17.7\\ \\mathrm{mW}}{1000} = 18\\ \\mu\\mathrm{W}' }
      ],
      a: '17.7 mW to the transmitted port, 2.3 mW to the side port, and about 18 µW of s light leaking into the transmitted beam. Turning the laser or a half-wave plate varies the split smoothly.'
    },
    {
      title: 'Why the isolator works',
      q: 'A p-polarized beam crosses a PBS and a quarter-wave plate at 45°, meets a mirror and returns. Where does the PBS send the returning light?',
      steps: [
        'On the way out the plate makes the light circular. The mirror reverses its handedness.',
        { text: 'On the way back the same plate acts on it again; the two passes are together equivalent to a half-wave plate at 45°, turning the plane of polarization by', tex: '2 \\times 45^\\circ = 90^\\circ' },
        'The light is now s-polarized: the PBS reflects it to the side port.'
      ],
      a: 'To the side port, not back to the laser: the combination is an isolator for reflections from the target.'
    }
  ],
  quiz: [
    { q: 'A PBS cube transmits p light and reflects s light. A polarized beam is oriented at 45° to the p axis. What happens?', choices: ['all of it passes', 'all of it is reflected', 'half goes each way', 'it is absorbed'], a: 2, why: '$\\cos^2 45^\\circ = \\sin^2 45^\\circ = 0.5$: half is transmitted, half reflected.' },
    { q: 'The extinction ratio of the transmitted beam of a cube is 1000:1. In decibels this is…', choices: ['10 dB', '20 dB', '30 dB', '1000 dB'], a: 2, why: '$10\\log_{10} 1000 = 30$.' },
    { q: 'In a PBS plus quarter-wave plate isolator the returning beam is reflected to the side because it has been turned from p to s.', a: true, why: 'Two passes through the quarter-wave plate at 45°, with a reflection between, turn the polarization through 90°.' },
    { q: 'A Wollaston prism of calcite has wedge angle 20°. Roughly by how many degrees do the two beams diverge?', answer: 7.2, unit: '°', why: '$\\delta \\approx 2(n_o-n_e)\\tan\\alpha = 2 \\times 0.172 \\times 0.364 = 0.125\\ \\mathrm{rad} = 7.2^\\circ$.' },
    { q: 'Which gives the purest polarization in its output beam?', choices: ['a PBS cube (reflected beam)', 'a plate at 45°', 'a Glan–Taylor prism', 'a sheet of window glass'], a: 2, why: 'A Glan prism of calcite transmits one polarization and throws the other out of the side, reaching extinctions of about 100 000:1. The reflected beam of a cube is the least pure.' }
  ],
  applications: [
    'Laser systems: a PBS with a half-wave plate makes a continuously variable splitter, and with a quarter-wave plate an isolator for reflections.',
    'Optical-disc pickups and confocal microscopes: the outgoing beam passes, the returning one is turned to s and sent to the detector.',
    'Liquid-crystal projectors and displays on silicon: a PBS combines the illumination and the modulated image.',
    'Polarimetry and quantum optics: splitting a beam into its two polarizations to measure each.',
    'Fibre systems: polarization combiners that merge two lasers or two pump diodes without loss.'
  ],
  history: 'The cube PBS comes from the layered designs of S. M. MacNeille in the 1940s. Silvanus Thompson designed the Glan–Thompson crystal polarizer in 1881, improving on the Nicol prism of 1828.',
  sources: [
    'E. Hecht, *Optics* — polarizing prisms, birefringent polarizers and the Brewster angle.',
    'H. A. Macleod, *Thin-Film Optical Filters* — polarizing beam splitters and their coating design.',
    'M. Bass (ed.), *Handbook of Optics*, vol. I — polarizers: dichroic, wire-grid, crystal and thin-film types.'
  ],
  sim: 'oc-pbs'
},

/* ================================================================ diffusers */
{
  id: 'diffusers-and-ground-glass', parent: 'optical-components', title: 'Diffusers', level: 1,
  short: 'A diffuser scatters light into a range of angles to spread it, soften it or even it out. Ground glass, opal glass and engineered diffusers differ in how wide and how sharply their spread is defined, and in how much light they lose.',
  keywords: ['diffuser', 'ground glass', 'opal glass', 'holographic diffuser', 'engineered diffuser', 'diffusing angle', 'Lambertian', 'light shaping diffuser', 'frosted glass', 'speckle', 'focusing screen', 'top-hat diffuser', 'scatter', 'backlight'],
  prereq: ['specular-and-diffuse-reflection', 'optical-windows'],
  related: ['microlens-arrays', 'lambertian-surfaces', 'the-integrating-sphere', 'speckle', 'viewfinders-and-focusing-screens', 'cleaning-and-handling-optics', 'light-pipes-and-homogenizers', 'machine-vision-lighting'],
  body: `
A window sends light on in the direction it came; a **diffuser** deliberately does not. A beam entering a diffuser leaves as a cone: the spread hides the structure of the source, evens out hot spots and lets an image be seen on the surface itself. Everything about a diffuser is in how that spread is shaped.

### The kinds
| Diffuser | How it scatters | Spread | Transmission | Remarks |
|---|---|---|---|---|
| ground glass | a surface roughened with abrasive grit | broad, bell-shaped, narrower with finer grit | typically 80–90 % | cheap; grainy under a laser; collects dirt |
| opal glass | scattering particles inside milky glass | almost Lambertian, very wide | a third to a half | soft, even, wasteful |
| engineered (holographic) | designed microstructure on a surface | chosen: 0.5° to 80°, bell-shaped or flat-topped | above 85–90 % | efficient, defined, delicate |
| microlens array | a regular array of tiny lenses | defined shape, with a diffraction pattern | high | see [[microlens-arrays]] |
| fluoropolymer or white paint | volume scattering, used in reflection | Lambertian | reflectance up to 99 % | integrating spheres, [[the-integrating-sphere]] |

### The diffusing angle
Catalogues state the **diffusing angle** as the full angle between the points where the intensity falls to half of its peak (FWHM). A ground glass of 10° and an engineered diffuser of 10° may differ in the tails: the engineered one has a sharper edge and wastes less light outside its cone. Check whether the figure is at 50 % or at 10 % of the peak.

### The pattern on a screen
A flat screen at distance $L$ meets the cone of a top-hat diffuser of full angle $\\theta$ in a disc of diameter $D = 2L\\tan(\\theta/2)$: 35 mm at 100 mm for 20°. A perfect **Lambertian** diffuser has intensity proportional to $\\cos\\theta$, and a flat screen at angle $\\theta$ receives that intensity over a longer distance and at a slant, so its illuminance falls as $\\cos^4\\theta$: 56 % at 30°, 25 % at 45°, 6 % at 60° (the same law that darkens the corners of a photograph).

Angles combine roughly in quadrature: a collimated beam of divergence $\\theta_1$ through a diffuser of angle $\\theta_d$ leaves with $\\sqrt{\\theta_1^2 + \\theta_d^2}$.

### Speckle and focusing screens
Coherent light on a rough surface makes **speckle**, a fine random grain, because each point of the surface scatters with its own phase ([[speckle]]). Moving or spinning the diffuser during the exposure averages the grain away. In a view camera or a microscope the image formed on a ground-glass screen is seen from behind; the grain of the glass limits what the eye can judge, and the screen spreads light so the image is visible from a range of directions ([[viewfinders-and-focusing-screens]]).

### Handling
A ground face is a rough surface that traps oil and dust. Do not wipe it; blow it and rinse, and see [[cleaning-and-handling-optics]].

> [!key] A diffuser turns a beam into a cone: choose it by the full angle at half maximum, the shape (bell or flat-top) and the loss. Lambertian spread means illuminance on a flat screen falls as cos⁴ of the angle.
`,
  ideas: [
    'A diffuser scatters a beam into a cone whose full width at half maximum is its diffusing angle.',
    'Ground glass has a bell-shaped spread and some loss, opal glass is nearly Lambertian and lossy, engineered diffusers have a chosen angle and shape with little loss.',
    'A Lambertian diffuser lights a flat screen with an illuminance that falls as cos⁴ of the angle.',
    'Laser light on a diffuser makes speckle; moving the diffuser averages it out.',
    'Diffusing angles add roughly in quadrature with the beam’s own divergence.'
  ],
  pitfalls: [
    'A diffuser makes light dimmer because it absorbs it — Most of the loss is light scattered outside the cone you want, or backwards; a good engineered diffuser keeps 85–90 % within its cone.',
    'A bigger diffusing angle always gives a more even light — It spreads the light over a wider area, but a bell-shaped diffuser is still brighter at the centre. An even field needs a flat-topped (top-hat) design or a longer distance.',
    'The diffusing angle is the half-angle of the cone — Catalogues quote the full width at half maximum. A 20° diffuser spreads 10° each side of the axis, at half intensity.',
    'Ground glass is optically the same either way round — The rough side should face the light, or the viewer in a focusing screen: put it the wrong way round and the glass between the surface and the image blurs it.'
  ],
  terms: [
    { term: 'Diffuser', def: 'An optical element that scatters light into a range of angles, to spread, soften or even it out.' },
    { term: 'Diffusing angle', also: ['scattering angle', 'divergence angle', 'FWHM angle'], def: 'The full angle of the cone of light leaving a diffuser, measured between the directions where the intensity is half its peak value.' },
    { term: 'Ground glass', also: ['frosted glass', 'matte glass'], def: 'Glass with a roughened surface, made with abrasive grit. It scatters in a broad bell-shaped distribution and carries an image on its surface.' },
    { term: 'Opal glass', also: ['milk glass'], def: 'A milky glass scattering the light inside its volume. It scatters almost like a Lambertian surface but transmits only a fraction of the light.' },
    { term: 'Engineered diffuser', also: ['holographic diffuser', 'light shaping diffuser'], def: 'A diffuser with a designed microstructure that gives a chosen angle and profile — Gaussian or flat-topped — with little loss.' },
    { term: 'Lambertian', also: ['Lambertian diffuser', 'ideal diffuser'], def: 'A surface or diffuser whose brightness looks the same from every direction; its intensity falls as the cosine of the angle from the normal.' },
    { term: 'Speckle', def: 'A grainy random pattern made when coherent light is scattered by a rough surface, caused by interference between the waves from its points.' }
  ],
  formulas: [
    {
      name: 'Diameter of the spot a diffuser makes on a screen',
      expr: 'D = 2*L*tan(th/2)', tex: 'D = 2\\,L\\,\\tan\\frac{\\theta}{2}',
      vars: {
        D: { name: 'diameter of the lit disc', q: 'length', unit: 'mm' },
        L: { name: 'distance from diffuser to screen', q: 'length', unit: 'mm', value: 100 },
        th: { name: 'full diffusing angle', q: 'angle', unit: '°', value: 20, min: 0.1, max: 170, tex: '\\theta' }
      },
      note: 'For a top-hat diffuser the disc has sharp edges; for a bell-shaped one it is the width at half intensity.',
      stories: { D: 'A diffuser of {th} full angle is placed {L} from a screen. How wide is the lit disc?', L: 'How far must a screen be from a {th} diffuser for the lit disc to be {D} across?' }
    },
    {
      name: 'Illuminance on a flat screen from a Lambertian diffuser',
      expr: 'Er = cos(th)^4', tex: 'E_r = \\cos^4\\theta',
      vars: {
        Er: { name: 'illuminance relative to the centre', q: 'ratio', unit: '%' },
        th: { name: 'angle from the axis', q: 'angle', unit: '°', value: 30, min: 0, max: 89, tex: '\\theta' }
      },
      note: 'E_r is E(θ)/E(0). One cosine from the intensity, and three from the longer distance and the slant of the screen.',
      stories: { Er: 'A screen is lit by a Lambertian diffuser. How bright is it, compared with the centre, at {th} from the axis?' }
    },
    {
      name: 'Divergence after a diffuser',
      expr: 'ta = sqrt(t1^2 + td^2)', tex: '\\theta = \\sqrt{\\theta_1^2 + \\theta_d^2}',
      vars: {
        ta: { name: 'resulting divergence', q: 'angle', unit: 'mrad', tex: '\\theta' },
        t1: { name: 'divergence of the incoming beam', q: 'angle', unit: 'mrad', value: 2, tex: '\\theta_1' },
        td: { name: 'diffusing angle', q: 'angle', unit: 'mrad', value: 175, tex: '\\theta_d' }
      },
      note: 'For bell-shaped distributions of similar form. A 10° diffuser is 175 mrad.',
      stories: { ta: 'A beam of {t1} divergence crosses a diffuser of {td}. What is the divergence afterwards?' }
    }
  ],
  examples: [
    {
      title: 'Lighting a target evenly',
      q: 'A flat-topped diffuser of 20° full angle is placed 100 mm from a target. How wide is the lit disc? A Lambertian diffuser at the same distance lights a flat target: by how much has the illuminance fallen 100 mm off the axis?',
      steps: [
        { text: 'The flat-topped diffuser:', tex: 'D = 2 \\times 100\\ \\mathrm{mm} \\times \\tan 10^\\circ = 35\\ \\mathrm{mm}' },
        { text: 'The Lambertian one, 100 mm off axis at a distance of 100 mm, is at 45°:', tex: '\\frac{E(45^\\circ)}{E(0)} = \\cos^4 45^\\circ = 0.25' }
      ],
      a: 'The flat-topped diffuser lights a 35 mm disc with sharp edges. The Lambertian one has fallen to a quarter at 100 mm off axis — one reason engineered flat-topped diffusers are chosen for even illumination.'
    },
    {
      title: 'Averaging speckle',
      q: 'A laser beam illuminates a ground-glass screen and the camera sees grainy speckle. What can be done in the optics, without changing the laser?',
      steps: [
        'Speckle is fixed for a fixed surface. If the diffuser moves during the exposure, the speckle pattern changes and many independent patterns are averaged.',
        'A rotating or vibrating diffuser with an exposure of many speckle patterns reduces the contrast by about the square root of their number.'
      ],
      a: 'Move or spin the diffuser: 100 independent patterns in one exposure reduce the speckle contrast to about a tenth.'
    }
  ],
  quiz: [
    { q: 'A diffuser is specified as 20° FWHM. The intensity is half of the peak at…', choices: ['20° from the axis', '10° from the axis, on both sides', '40° from the axis', 'the edge of the cone only'], a: 1, why: 'The full width at half maximum is 20°, so the half-intensity directions are 10° either side of the axis.' },
    { q: 'A Lambertian diffuser lights a flat screen. The illuminance at 45° from the axis, relative to the centre, is…', choices: ['71 %', '50 %', '25 %', '6 %'], a: 2, why: '$\\cos^4 45^\\circ = 0.25$.' },
    { q: 'Opal glass is almost Lambertian but typically passes only a third to a half of the light, whereas an engineered diffuser can pass above 85 %.', a: true, why: 'Opal glass scatters inside its volume and returns part of the light backwards; an engineered diffuser sends nearly all of it into its designed cone.' },
    { q: 'A top-hat diffuser of 30° full angle is 200 mm from a screen. How wide, in millimetres, is the lit disc?', answer: 107.2, unit: 'mm', why: '$D = 2L\\tan(\\theta/2) = 2 \\times 200 \\times \\tan 15^\\circ = 107$ mm.' },
    { q: 'You see grainy speckle when a laser lights a ground-glass screen. Which change reduces it?', choices: ['a brighter laser', 'moving the diffuser during the exposure', 'a wider diffusing angle', 'a thinner screen'], a: 1, why: 'The speckle pattern belongs to one fixed surface. A moving diffuser produces many patterns that average to a smoother image.' }
  ],
  applications: [
    'Focusing screens of view cameras and microscopes, where the image is formed on ground glass.',
    'Backlights and light boxes: diffusers hide the LEDs behind a display or a sign and even out the glow.',
    'Photography and film: softboxes and diffusion gels turn a point source into a broad, soft one.',
    'Machine-vision lighting: a diffuser in front of LEDs removes hot spots on shiny parts.',
    'Laser safety and display: a diffuse screen makes the reflection of a beam safe to look at and a projector image visible from all sides.'
  ],
  history: 'Johann Heinrich Lambert described the cosine law of diffuse light in his *Photometria* of 1760. Ground glass has been the focusing surface of photographic cameras since the first cameras of the nineteenth century.',
  sources: [
    'J. W. Goodman, *Speckle Phenomena in Optics* — speckle from rough surfaces and its reduction by moving diffusers.',
    'W. J. Smith, *Modern Optical Engineering* — diffusing surfaces, Lambert’s law and the cos⁴ fall-off.',
    '*Handbook of Optics*, vol. II — diffusers and the scatter of rough surfaces.'
  ],
  sim: 'oc-diffuser'
},

/* ================================================================ catalogue lenses */
{
  id: 'catalogue-lens-types', parent: 'optical-components', title: 'Catalogue lenses: which shape for which job', level: 2,
  short: 'A catalogue offers plano-convex, biconvex, meniscus, achromatic, aspheric, cylindrical, ball, GRIN and Fresnel lenses. The right one depends on the two distances the light travels: collimating or focusing at infinity, or relaying at 1:1.',
  keywords: ['plano-convex lens', 'biconvex lens', 'meniscus lens', 'achromat', 'achromatic doublet', 'asphere', 'aspheric lens', 'cylindrical lens', 'ball lens', 'GRIN lens', 'Fresnel lens', 'best form', 'collimating lens', 'relay lens', '1:1 imaging', 'conjugates', 'orientation of a lens'],
  prereq: ['lens-shapes-and-names', 'achromatic-doublet', 'spherical-aberration'],
  related: ['lensmakers-formula', 'lens-bending', 'aspheric-surfaces', 'cylindrical-and-toric-lenses', 'fresnel-lenses', 'gradient-index-optics', 'collimating-a-laser-diode', 'focusing-a-laser-beam', 'reading-an-optics-catalogue'],
  body: `
Open a lens catalogue and the choice is wide, but the decision comes down to two questions: *what are the two distances* (object and image) and *how good must the spot be*. A single glass lens has spherical aberration that depends on its shape and on which way round it is used. The table says which to take.

### The catalogue
| Lens | Shape | Best for | Notes |
|---|---|---|---|
| plano-convex | one flat, one curved face | collimating or focusing at infinity, **curved side towards the collimated beam** | cheap; four times worse blur the wrong way round |
| biconvex | two equal curved faces | 1:1 imaging (object at 2f) | symmetric, so the aberrations of its two halves cancel in part |
| positive meniscus | both faces curved the same way | shortening the focal length of a system; weak lenses | poor alone |
| achromatic doublet | two glasses cemented | collimating and focusing, especially with several colours | colour and spherical aberration corrected |
| asphere | one non-spherical surface | collimating laser diodes, focusing to a small spot | no spherical aberration for one wavelength and one pair of distances |
| cylindrical | curved in one direction only | line focus, expanding one axis | see [[cylindrical-and-toric-lenses]] |
| ball | a sphere | very short focus, fibre coupling | $f = nD/4(n-1)$ from its centre |
| GRIN | rod whose index falls from the axis | tiny collimators, endoscopes | flat faces; see [[gradient-index-optics]] |
| Fresnel | rings of prisms | large, light, rough lenses | see [[fresnel-lenses]] |

### Why the orientation matters
With light at infinity, a plano-convex lens with its curved side first shares the bending between its two surfaces, so the rays meet each at a moderate angle. Turned round, the flat face does nothing to a parallel beam arriving square on, and the whole turn happens at the steep curved back face, with larger angles and far more spherical aberration. For an f = 100 mm, f/3.9 N-BK7 lens the RMS spot at best focus is about 95 µm across with the curved side first and 387 µm the wrong way round, four times worse. A biconvex lens gives 138 µm.

With object and image at the **same distance** (1:1, each 2f away), the symmetric biconvex lens does best: an RMS spot of 182 µm against 599 µm for the plano-convex lens in its infinity orientation. For the same job use two identical plano-convex lenses with their curved faces towards each other.

### Beyond the singlet
A cemented **achromat** designed for infinity reaches a few micrometres — about the size of the diffraction blur at f/4 — and corrects colour as well. An **asphere** can do better in one colour: a plano-convex lens with the flat side to the beam and a hyperbolic curved surface of conic constant $-n^2$ focuses a collimated beam to a point. Neither is better at 1:1: both are designed for infinity.

### Choosing
1. Collimating a point source, or focusing a laser: an asphere (one wavelength) or an achromat (several); a plano-convex lens, curved side towards the collimated beam, for economy.
2. 1:1 relay: a biconvex lens, or two plano-convex lenses with curved faces facing.
3. Focal length: the divergence of a collimated beam from a source of size $s$ is $s/f$, so a long focal length gives a better beam but a bigger package.

> [!key] Choose the lens for its two distances. Curved side to the collimated beam for a plano-convex lens, biconvex for 1:1, an achromat for colour, an asphere for the smallest spot at one wavelength.
`,
  ideas: [
    'A single lens’s spherical aberration depends on its shape and on which way round it is used.',
    'A plano-convex lens is best with its curved side towards the collimated beam (infinite conjugate), and gives about a quarter of the blur of the wrong way round.',
    'A biconvex lens is best for 1:1 imaging.',
    'An achromatic doublet corrects colour and most spherical aberration for infinity-to-focus work; an asphere removes spherical aberration for one wavelength.',
    'Cylindrical, ball, GRIN and Fresnel lenses are chosen for their special geometry, not for general imaging.'
  ],
  pitfalls: [
    'A lens works equally well either way round — A plano-convex lens has about four times the blur with its flat side towards the collimated beam. Turn it, or take a best-form or aspheric lens.',
    'An achromat is better in every use — It is designed for infinity and its colour correction costs nothing in sharpness there, but at 1:1 it is no better than a biconvex lens of the same focal length.',
    'An asphere is perfect — Only for the single wavelength and the pair of distances it is designed for; its chromatic aberration is the same as the lens of the same glass.',
    'A shorter focal length is always better — It gives a smaller focus and a faster lens, but more aberration and less working distance; the steeper surfaces of an f/1 lens aberrate far more than an f/4 one.'
  ],
  terms: [
    { term: 'Plano-convex lens', also: ['PCX'], def: 'A lens with one flat and one convex face. The convex face should face the collimated beam for collimating or focusing at infinity.' },
    { term: 'Biconvex lens', also: ['double-convex', 'DCX'], def: 'A lens with two convex faces, usually of equal radius; the standard choice for imaging with the object and image at equal distances.' },
    { term: 'Meniscus lens', also: ['positive meniscus'], def: 'A lens with one convex and one concave face of the same sign of curvature; a positive one is thicker at the centre.' },
    { term: 'Achromatic doublet', also: ['achromat', 'cemented doublet'], def: 'A pair of lenses of different glasses cemented together so that two wavelengths focus at the same point and spherical aberration is small.' },
    { term: 'Aspheric lens', also: ['asphere'], def: 'A lens with a surface that is not part of a sphere, shaped to cancel spherical aberration for a given wavelength and pair of distances.' },
    { term: 'Ball lens', def: 'A glass sphere used as a lens; its focal length is nD/4(n − 1) measured from the centre. Used to focus into fibres and detectors.' },
    { term: 'Conjugates', also: ['conjugate distances', 'object and image distance'], def: 'The pair of object and image distances. Infinite and focus is one conjugate pair; 1:1 imaging, with object and image each 2f away, is another.' }
  ],
  formulas: [
    {
      name: 'Focal length of a plano-convex lens',
      expr: 'f = R/(n - 1)', tex: 'f = \\frac{R}{n - 1}',
      vars: {
        f: { name: 'focal length', q: 'length', unit: 'mm' },
        R: { name: 'radius of the curved face', q: 'length', unit: 'mm', value: 25.84 },
        n: { name: 'refractive index', value: 1.5168, min: 1.05, max: 5 }
      },
      note: 'Exact for a thick lens too, since the flat face adds no power.',
      stories: { f: 'A plano-convex lens of index {n} has a curved face of radius {R}. What is its focal length?', R: 'What radius must the curved face of a plano-convex lens of index {n} have to give a focal length of {f}?' }
    },
    {
      name: 'Focal length of a ball lens',
      expr: 'f = n*D/(4*(n - 1))', tex: 'f = \\frac{n\\,D}{4\\,(n - 1)}',
      vars: {
        f: { name: 'focal length from the centre of the ball', q: 'length', unit: 'mm' },
        n: { name: 'refractive index', value: 1.5168, min: 1.05, max: 5 },
        D: { name: 'diameter of the ball', q: 'length', unit: 'mm', value: 3 }
      },
      note: 'The back focal distance, from the rear surface, is f − D/2.',
      stories: { f: 'A glass ball of index {n} and diameter {D} is used as a lens. What is its focal length, from the centre?' }
    },
    {
      name: 'Divergence of a collimated beam from a finite source',
      expr: 'th = s/f', tex: '\\theta \\approx \\frac{s}{f}',
      vars: {
        th: { name: 'full divergence angle', q: 'angle', unit: 'mrad', tex: '\\theta' },
        s: { name: 'size of the source', q: 'length', unit: 'mm', value: 1 },
        f: { name: 'focal length of the collimator', q: 'length', unit: 'mm', value: 25 }
      },
      note: 'A source of size s at the focus. Diffraction adds to it, and a long focal length reduces it.',
      stories: { th: 'An LED die {s} across is at the focus of a collimator of focal length {f}. What is the full divergence of the beam?' }
    },
    {
      name: 'Length of a 1:1 relay',
      expr: 'L = 4*f', tex: 'L = 4\\,f',
      vars: {
        L: { name: 'distance from object to image', q: 'length', unit: 'mm' },
        f: { name: 'focal length of the lens', q: 'length', unit: 'mm', value: 50 }
      },
      note: 'Object and image each 2f from a thin lens. The least possible distance for a real image is 4f.',
      stories: { L: 'A lens of focal length {f} images an object 1:1. What is the distance between object and image?' }
    }
  ],
  examples: [
    {
      title: 'A plano-convex lens for f = 50 mm',
      q: 'What radius must the curved face of an N-BK7 plano-convex lens ($n = 1.517$) have to give a focal length of 50 mm, and which way round should it be used to focus a collimated laser beam?',
      steps: [
        { text: 'From the lens-maker’s formula with one flat face:', tex: 'R = f\\,(n-1) = 50 \\times 0.517 = 25.8\\ \\mathrm{mm}' },
        'The beam is collimated, so it is at the infinite conjugate: the curved face goes towards the incoming beam, the flat face towards the focus.'
      ],
      a: 'R = 25.8 mm, curved side to the laser. Turned the other way the focus would be about four times larger.'
    },
    {
      title: 'Collimating an LED',
      q: 'An LED with a die 1 mm across is collimated by a lens of 25 mm focal length. How wide is the resulting beam’s divergence, and what does doubling the focal length do?',
      steps: [
        { text: 'The divergence:', tex: '\\theta \\approx \\frac{s}{f} = \\frac{1}{25} = 40\\ \\mathrm{mrad} = 2.3^\\circ' },
        'Doubling f halves it to 20 mrad, but the lens must then be twice as far and twice as wide to catch the same cone of light.'
      ],
      a: '40 mrad full angle (2.3°); 20 mrad with a 50 mm lens. A small source is what makes a narrow collimated beam possible.'
    }
  ],
  quiz: [
    { q: 'A plano-convex lens is used to focus a collimated laser beam. Which way round gives the smaller spot?', choices: ['flat side towards the laser', 'curved side towards the laser', 'it makes no difference', 'it depends on the colour'], a: 1, why: 'With the curved side first the bending is shared between two surfaces and the spherical aberration is about four times smaller than with the flat side first.' },
    { q: 'For 1:1 imaging with a single lens, the usual best choice is…', choices: ['plano-convex, curved side first', 'a positive meniscus', 'a biconvex lens', 'a ball lens'], a: 2, why: 'With object and image at equal distances the symmetric biconvex lens makes the aberrations of its two halves cancel in part.' },
    { q: 'An aspheric lens designed for a 780 nm collimated beam is also free of colour error at other wavelengths.', a: false, why: 'The asphere removes spherical aberration. Its chromatic aberration is that of any single lens of the same glass.' },
    { q: 'A ball lens of N-BK7 ($n = 1.517$) is 3 mm across. What is its focal length, measured from the centre, in millimetres?', answer: 2.2, unit: 'mm', why: '$f = nD/4(n-1) = 1.517 \\times 3/(4 \\times 0.517) = 2.20$ mm.' },
    { q: 'A source 2 mm across sits at the focus of a 50 mm collimating lens. The beam’s full divergence is about…', choices: ['4 mrad', '40 mrad', '0.4 rad', '1 mrad'], a: 1, why: '$\\theta \\approx s/f = 2/50 = 0.04$ rad = 40 mrad.' }
  ],
  applications: [
    'Laser and fibre optics: plano-convex and aspheric lenses collimate and focus; ball and GRIN lenses couple into fibres.',
    'Machine vision and microscopy: achromatic doublets as relay and tube lenses; biconvex lenses for 1:1 relays.',
    'Illumination: aspheric condensers, Fresnel lenses and cylindrical lenses shape the light of LEDs and lamps.',
    'Detectors and sensors: a small ball or plano-convex lens concentrates light onto a photodiode.',
    'Spectrometers and optical benches: matched achromats form the collimating and imaging pairs.'
  ],
  history: 'John Dollond patented the achromatic doublet in 1758, although Chester Moore Hall had made achromatic lenses in the 1730s. Moulded aspheric lenses for compact-disc players and cameras came into mass production from the 1980s.',
  sources: [
    'W. J. Smith, *Modern Optical Engineering* — the shape of a single lens and its spherical aberration.',
    'R. Kingslake and R. B. Johnson, *Lens Design Fundamentals* — bending, the shape factor and the conjugate.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE) — singlet lens shapes and their aberrations.'
  ],
  sim: 'oc-lenses'
},

/* ================================================================ apertures, irises, pinholes */
{
  id: 'apertures-irises-and-pinholes', parent: 'optical-components', title: 'Apertures, irises and pinholes', level: 1,
  short: 'An aperture is an opening that decides which light gets through. Irises change the opening smoothly, fixed stops and slits fix it, and a precision pinhole is so small that diffraction, not geometry, shapes the light that leaves it.',
  keywords: ['aperture', 'iris', 'iris diaphragm', 'diaphragm', 'pinhole', 'precision pinhole', 'slit', 'stop', 'aperture stop', 'blades', 'f-stop', 'bokeh', 'spatial filter', 'Airy pattern', 'Fresnel number', 'beam block'],
  prereq: ['aperture-stop', 'the-f-number', 'the-airy-disk'],
  related: ['cleaning-a-beam-with-a-pinhole', 'aligning-an-optical-system', 'field-stop-and-field-of-view', 'aperture-and-f-stops', 'the-pinhole-camera', 'bokeh-and-out-of-focus-blur', 'single-slit-diffraction', 'optomechanics-and-mounts'],
  body: `
Every optical system has an opening that limits the light it accepts. On the bench that opening is a part you can buy and hold: a ring with leaves, a metal disc with a hole, a pair of knife edges. Choosing the size decides three things at once — how much light, how deep the focus, and how much diffraction.

### The parts
| Part | Sizes | What it is for |
|---|---|---|
| iris diaphragm | about 1 mm to 12 or 25 mm, adjustable by a lever or ring | f-number of a lens, a reference point in alignment, blocking stray light |
| fixed stop | any size, a disc with a hole | sets the f-number or the field of view of a system |
| precision pinhole | from about 1 µm to 1 mm, in thin foil or a drilled disc | point source, spatial filter, confocal and pinhole cameras |
| slit | a few micrometres to some millimetres, fixed or adjustable | spectrometers, diffraction experiments, line sources |
| beam block and baffle | any | absorbs what must not pass |

### The iris
An iris is a ring of overlapping leaves (commonly 5 to 15) that swing to leave a polygonal opening. The area scales as $D^2$ and the f-number as $N = f/D$ ([[the-f-number]]), so closing the iris by one stop (a factor $\\sqrt 2$ in diameter) halves the light. The number of stops between two diameters is $2\\log_2(D_1/D_2)$: from 25 mm to 6.25 mm is four stops, a sixteenth of the light. The opening is a regular polygon, so a bright out-of-focus point in a photograph is a polygon too; rounded blades give rounder highlights ([[bokeh-and-out-of-focus-blur]]).

On an optical table two irises set a line in space: a beam centred on both runs along the line joining their centres. That is why they are the first thing used when aligning ([[aligning-an-optical-system]]).

### The pinhole
When the opening is small enough, light no longer travels in straight lines through it. A circular opening of diameter $d$ sends a plane wave into an **Airy pattern** ([[the-airy-disk]]): a central disc of half-angle $\\sin\\theta = 1.22\\lambda/d$, then faint rings. At distance $L$ the disc is $2.44\\,\\lambda L/d$ across. A 50 µm pinhole at 633 nm spreads to a disc 31 mm wide after 1 m. Smaller holes spread more: shrinking an aperture trades geometric sharpness for diffraction.

The pattern shown is the far field, valid when the **Fresnel number** $a^2/(\\lambda L)$ (with $a$ the radius) is much smaller than 1; for that pinhole and distance it is 0.001. Closer to the hole the pattern is not yet the Airy disc.

### Practical points
Pinholes are delicate: never touch them, never push a needle through. A pinhole in thin foil has a sharp edge; a thick hole acts like a short tube and shadows light that arrives at an angle. A dust speck in a 5 µm pinhole blocks much of it.

> [!key] An opening of diameter D lets light through in proportion to D², sets the f-number f/D, and — when small — spreads the light by about 1.22 λ/D. Two irises on a table define a line.
`,
  ideas: [
    'The light through an opening goes as D²; one stop is a factor √2 in diameter.',
    'An iris leaves a polygonal opening, whose shape shows in out-of-focus highlights.',
    'A small circular opening makes an Airy pattern: a central disc of half-angle 1.22 λ/d.',
    'The Airy pattern is the far-field picture; it holds once the Fresnel number is much less than 1.',
    'Two irises define a straight line for alignment.'
  ],
  pitfalls: [
    'A smaller opening always gives a sharper picture — Only until diffraction takes over. Below a certain size the blur from diffraction grows faster than the blur from the geometry shrinks.',
    'A pinhole acts like a tiny hole in a screen, so the light just goes straight — Through a few micrometres the light spreads into a cone and rings: the pattern is wider the smaller the hole.',
    'An iris opening is a circle — It is a polygon with as many sides as there are leaves, rounded or not depending on the blade shape. That is why bokeh highlights have corners.',
    'Closing an iris by half the diameter halves the light — The light goes as the area, D², so half the diameter passes a quarter: two stops.'
  ],
  terms: [
    { term: 'Aperture', def: 'An opening that limits the light passing through an optical system.' },
    { term: 'Iris diaphragm', also: ['iris', 'diaphragm'], def: 'A ring of overlapping blades that leaves an adjustable, roughly circular opening. Its diameter, set by a lever or ring, fixes the f-number.' },
    { term: 'Stop', also: ['aperture stop', 'fixed aperture'], def: 'An opening of fixed size, such as a disc with a hole, that limits the light or the field of an instrument.' },
    { term: 'Precision pinhole', def: 'A circular hole of a micrometre to a millimetre in thin metal foil, used as a point source or a spatial filter.' },
    { term: 'Fresnel number', also: ['N_F'], def: 'The aperture radius squared divided by the wavelength and the distance, a²/(λL). Far below 1 the pattern is the far-field Airy pattern; near or above 1 it is the near-field pattern.' },
    { term: 'Slit', def: 'A narrow rectangular opening of adjustable or fixed width, used to define a line source or an entrance to a spectrometer.' }
  ],
  formulas: [
    {
      name: 'Stops between two openings',
      expr: 's = 2*log2(D1/D2)', tex: 's = 2\\log_2\\frac{D_1}{D_2}',
      vars: {
        s: { name: 'number of stops closed', signed: true },
        D1: { name: 'the larger diameter', q: 'length', unit: 'mm', value: 25, tex: 'D_1' },
        D2: { name: 'the smaller diameter', q: 'length', unit: 'mm', value: 6.25, tex: 'D_2' }
      },
      note: 'One stop halves the light, because the area goes as D².',
      stories: { s: 'An iris is closed from {D1} to {D2}. By how many stops has the light fallen?' }
    },
    {
      name: 'Area of a polygonal iris opening',
      expr: 'A = N*r^2*sin(2*pi/N)/2', tex: 'A = \\frac{N r^2}{2}\\sin\\frac{2\\pi}{N}',
      vars: {
        A: { name: 'area of the opening', q: 'area', unit: 'mm²' },
        N: { name: 'number of blades (sides of the opening)', value: 6, min: 3, max: 30, int: true },
        r: { name: 'distance from the centre to a corner', q: 'length', unit: 'mm', value: 5 }
      },
      note: 'A regular polygon. For many sides it approaches πr².',
      stories: { A: 'An iris of {N} blades has its corners {r} from the centre. What is the area of the opening?' }
    },
    {
      name: 'Far-field disc of a pinhole',
      expr: 'w = 2.44*lam*L/d', tex: 'w = \\frac{2.44\\,\\lambda\\,L}{d}',
      vars: {
        w: { name: 'diameter of the central disc', q: 'length', unit: 'mm' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 633, tex: '\\lambda' },
        L: { name: 'distance from the pinhole', q: 'length', unit: 'm', value: 1 },
        d: { name: 'pinhole diameter', q: 'length', unit: 'µm', value: 50 }
      },
      note: 'To the first dark ring. Valid in the far field (Fresnel number well below 1).',
      stories: { w: 'Light of {lam} passes through a pinhole of {d}. How wide is the central disc on a screen {L} away?', d: 'A pinhole must spread light of {lam} into a disc {w} wide at {L}. What diameter must it have?' }
    },
    {
      name: 'Fresnel number of a pinhole',
      expr: 'NF = (d/2)^2/(lam*L)', tex: 'N_F = \\frac{(d/2)^2}{\\lambda\\,L}',
      vars: {
        NF: { name: 'Fresnel number', tex: 'N_F' },
        d: { name: 'pinhole diameter', q: 'length', unit: 'µm', value: 50 },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 633, tex: '\\lambda' },
        L: { name: 'distance from the pinhole', q: 'length', unit: 'm', value: 1 }
      },
      note: 'Much less than 1: the far-field Airy pattern. Near 1 or above: the near field.',
      stories: { NF: 'A pinhole of {d} is lit with {lam} light. What is the Fresnel number at {L}?' }
    }
  ],
  examples: [
    {
      title: 'Four stops down',
      q: 'A 25 mm iris is closed to 6.25 mm. By how many stops, and what fraction of the light remains?',
      steps: [
        { text: 'Stops:', tex: 's = 2\\log_2\\frac{25}{6.25} = 2\\log_2 4 = 4' },
        { text: 'Light, going as the area:', tex: '\\left(\\frac{6.25}{25}\\right)^2 = \\frac{1}{16}' }
      ],
      a: 'Four stops, one sixteenth of the light.'
    },
    {
      title: 'A pinhole in a laser beam',
      q: 'A 50 µm pinhole is lit with a 633 nm laser. How wide is the central disc 1 m behind it, and is the far-field formula valid?',
      steps: [
        { text: 'Disc diameter:', tex: 'w = \\frac{2.44 \\times 633\\ \\mathrm{nm} \\times 1\\ \\mathrm{m}}{50\\ \\mu\\mathrm{m}} = 31\\ \\mathrm{mm}' },
        { text: 'Fresnel number:', tex: 'N_F = \\frac{(25\\ \\mu\\mathrm{m})^2}{633\\ \\mathrm{nm} \\times 1\\ \\mathrm{m}} = 0.001' }
      ],
      a: '31 mm wide; the Fresnel number of 0.001 is far below 1, so the far-field Airy pattern is valid.'
    }
  ],
  quiz: [
    { q: 'An iris is closed from 12 mm to 6 mm in diameter. The light that passes falls to…', choices: ['one half', 'one quarter', 'one eighth', 'unchanged'], a: 1, why: 'The light goes as the area, which goes as $D^2$: $(6/12)^2 = 1/4$, two stops.' },
    { q: 'The central disc behind a 20 µm pinhole is twice as wide as behind a 40 µm pinhole at the same distance and wavelength.', a: true, why: 'The width goes as $1/d$: halving the hole doubles the disc.' },
    { q: 'What is the diameter, in millimetres, of the central disc at 2 m behind a 100 µm pinhole lit with 500 nm light?', answer: 24.4, unit: 'mm', why: '$w = 2.44 \\lambda L/d = 2.44 \\times 500\\times 10^{-9} \\times 2 / 10^{-4} = 0.0244$ m, which is 24.4 mm.' },
    { q: 'Why are the out-of-focus highlights in some photographs polygons?', choices: ['The sensor is square', 'They take the shape of the iris opening, a polygon formed by its blades', 'The lens is aspheric', 'Diffraction makes them so'], a: 1, why: 'A blurred point is an image of the aperture itself; with a six-blade iris it is a hexagon.' },
    { q: 'Why are two irises used to define a beam axis?', choices: ['Two points define a line', 'The irises focus the beam', 'They remove the polarization', 'They filter colour'], a: 0, why: 'A beam centred on both small openings passes through two points, and two points fix a line.' }
  ],
  applications: [
    'Camera lenses: the iris sets the f-number and with it the exposure, depth of field and the shape of out-of-focus highlights.',
    'Optical benches: bench irises as alignment references and as stray-light stops.',
    'Spatial filters: a pinhole at the focus of a lens removes the ragged parts of a laser beam ([[cleaning-a-beam-with-a-pinhole]]).',
    'Confocal microscopes: a pinhole in front of the detector passes only the light from the focal plane.',
    'Spectrometers: the entrance slit sets the resolution; the exit slit selects the band.'
  ],
  history: 'Ibn al-Haytham described the pinhole camera around the year 1000. In photography, Waterhouse stops (metal plates with holes slid into the lens) appeared in 1858, and the adjustable iris diaphragm replaced them in the later nineteenth century.',
  sources: [
    'E. Hecht, *Optics* — Fraunhofer diffraction by a circular aperture and the Airy pattern.',
    'W. J. Smith, *Modern Optical Engineering* — stops, pupils and apertures.',
    'M. Born and E. Wolf, *Principles of Optics* — diffraction at a circular aperture and the Fresnel number.'
  ],
  sim: 'oc-iris'
},

/* ================================================================ isolators and modulators */
{
  id: 'optical-isolators-and-modulators', parent: 'optical-components', title: 'Isolators and modulators', level: 2,
  short: 'An optical isolator passes light one way and blocks it coming back, using a magnetic rotation that does not undo itself. Modulators switch or vary a beam: Pockels cells with voltage, acousto-optic cells with sound, choppers with a spinning slotted wheel.',
  keywords: ['optical isolator', 'Faraday isolator', 'Faraday rotator', 'Verdet constant', 'TGG', 'non-reciprocal', 'modulator', 'acousto-optic modulator', 'AOM', 'electro-optic modulator', 'EOM', 'Pockels cell', 'chopper', 'shutter', 'Bragg angle', 'Q-switch'],
  prereq: ['polarizers-and-malus-law', 'optical-activity-and-faraday-rotation', 'wave-plates'],
  related: ['polarizing-beam-splitters', 'jones-calculus', 'q-switching-and-mode-locking', 'continuous-and-pulsed-lasers', 'diode-lasers', 'scan-lenses-and-f-theta', 'acousto-optic-and-electro-optic-deflectors', 'shutter-types'],
  body: `
Two jobs need parts that act on light with an outside signal. One is to stop light running **backwards**, because a laser or an amplifier that receives its own reflected beam can become unstable or be damaged. The other is to **switch or vary** a beam, quickly and on command.

### The isolator: a one-way valve
A **Faraday rotator** is a crystal in a strong magnetic field. It rotates the plane of polarization of light by $\\theta = V B L$, with $V$ the Verdet constant of the material, $B$ the field along the beam and $L$ the length. For terbium gallium garnet (TGG) at 1064 nm, $V$ is about 40 rad/(T·m): a 20 mm crystal in a field of 1 T rotates by 0.8 rad, 45°.

The isolator is a Faraday rotator set to 45° between two polarizers 45° apart. Forward: the first polarizer passes light at 0°, the rotator turns it to 45°, the second polarizer (at 45°) passes it. Backward: the light leaves the second polarizer at 45°, and the rotator turns it by **another** 45°, to 90° — exactly crossed with the first polarizer, which blocks it.

What matters is that the rotation is **non-reciprocal**: its sense is fixed by the magnet, not by the direction of travel, so it adds on the return trip. A sugar solution or a quartz rotator, which rotates the same way relative to the beam, would turn the light back to 0° and let it through, so it makes no isolator. Typical isolators give 30–40 dB of isolation (a thousandth to a ten-thousandth returns) and pass over 90 % forward.

### The quarter-wave alternative
A polarizing cube with a quarter-wave plate ([[polarizing-beam-splitters]]) isolates reflections from a target beyond the plate; a Faraday isolator blocks a reflection from anywhere.

### Modulators
| Device | How | Speed | Notes |
|---|---|---|---|
| chopper | spinning slotted wheel | hertz to some tens of kilohertz | fixed rate, robust |
| mechanical shutter | blade or flap | milliseconds | opens and closes fully |
| liquid-crystal shutter | voltage turns a cell between polarizers | milliseconds | no moving parts |
| acousto-optic modulator | sound wave in a crystal as a moving grating | tens of nanoseconds to a microsecond | deflects and frequency-shifts |
| electro-optic modulator (Pockels cell) | voltage-induced birefringence | nanoseconds | kilovolts, needs polarizers |

An **acousto-optic modulator** (AOM) sends a sound wave of frequency $f$ through a crystal such as TeO₂, where it acts as a moving grating. A beam entering at the Bragg angle is diffracted into a first order, deflected by $\\lambda f/v$ ($v$ is the speed of sound) and shifted in frequency by $f$. The diffracted fraction goes up to about 85 % and is set by the RF power. The rise time is the time sound takes to cross the beam, about $0.65\\,D/v$.

A **Pockels cell** is a crystal whose birefringence changes in proportion to the applied voltage. Between crossed polarizers it passes $T = \\sin^2(\\pi V/2V_\\pi)$, with $V_\\pi$ the half-wave voltage: a fast shutter that opens at $V_\\pi$, used to switch laser pulses.

> [!warn] Pockels-cell drivers use kilovolts. Only trained people open or service them. Align isolators and modulators at low power with the beam enclosed ([[laser-safety-classes]]).

> [!key] A Faraday isolator rotates polarization the same way in both directions, so the return trip adds up to 90° and is blocked. Modulators vary the beam with voltage (Pockels), sound (AOM) or mechanics (chopper, shutter), at speeds from milliseconds to nanoseconds.
`,
  ideas: [
    'A Faraday rotator turns polarization by θ = VBL, with the same sense whatever the direction of travel.',
    'Between polarizers set 45° apart, a 45° Faraday rotator passes light forward and blocks it backward.',
    'A rotator of the ordinary kind (sugar, quartz) reverses on return and does not isolate.',
    'An acousto-optic modulator diffracts light by sound, deflecting it by λf/v and shifting its frequency by f.',
    'A Pockels cell between crossed polarizers passes sin²(πV/2Vπ) and switches in nanoseconds.'
  ],
  pitfalls: [
    'Any polarization rotator makes an isolator — Only a non-reciprocal one (Faraday). A sugar solution or quartz plate rotates back on the return trip and lets the reflection through.',
    'An isolator absorbs the returning light in the rotator — The returning light is blocked by the polarizer at the entrance, which absorbs or reflects it; the rotator only turns it.',
    'A Pockels cell works by absorbing light — It changes the polarization, and the polarizers decide how much passes. It does not absorb the beam.',
    'An AOM just opens and shuts like a shutter — It deflects the light into a diffraction order and shifts its frequency; the beam you use is the first order, which moves when the RF frequency changes.'
  ],
  terms: [
    { term: 'Optical isolator', def: 'A device that passes light in one direction and blocks it in the other, protecting lasers from reflections.' },
    { term: 'Faraday rotator', also: ['Faraday effect', 'magneto-optic rotator'], def: 'A material in a magnetic field that rotates the plane of polarization of light by an amount proportional to the field and the length. The rotation does not reverse with the direction of the light.' },
    { term: 'Verdet constant', also: ['V'], def: 'The rotation per unit field and length of a magneto-optic material, in rad/(T·m); larger for shorter wavelengths.' },
    { term: 'Non-reciprocal', def: 'A property of a device whose action is not the same for light going forward and backward. A Faraday rotator is non-reciprocal.' },
    { term: 'Acousto-optic modulator', also: ['AOM', 'Bragg cell'], def: 'A crystal in which a sound wave diffracts light, deflecting it by λf/v and shifting its frequency by f. Its RF power sets the intensity of the diffracted beam.' },
    { term: 'Pockels cell', also: ['electro-optic modulator', 'EOM'], def: 'A crystal whose birefringence changes with the voltage across it. Between polarizers it varies or switches a beam in nanoseconds.' },
    { term: 'Half-wave voltage', also: ['Vπ'], def: 'The voltage at which a Pockels cell turns the polarization through 90°, switching a cell between crossed polarizers from dark to fully open.' }
  ],
  formulas: [
    {
      name: 'Faraday rotation',
      expr: 'th = V*B*L', tex: '\\theta = V\\,B\\,L',
      vars: {
        th: { name: 'rotation of the plane of polarization', q: 'angle', unit: '°', tex: '\\theta' },
        V: { name: 'Verdet constant', unit: 'rad/(T·m)', value: 40 },
        B: { name: 'magnetic field along the beam', q: 'bfield', unit: 'T', value: 1 },
        L: { name: 'length of the crystal', q: 'length', unit: 'mm', value: 19.6 }
      },
      solveFor: 'th',
      note: 'TGG at 1064 nm has V ≈ 40 rad/(T·m). Rotation grows towards shorter wavelengths.',
      stories: { th: 'A crystal with a Verdet constant of {V} is {L} long in a field of {B}. By what angle does it rotate the polarization?', L: 'How long must a crystal with a Verdet constant of {V} be, in a field of {B}, to rotate the polarization by {th}?' }
    },
    {
      name: 'Transmission of a Pockels cell between crossed polarizers',
      expr: 'T = sin(pi*V/(2*Vp))^2', tex: 'T = \\sin^2\\!\\left(\\frac{\\pi V}{2 V_\\pi}\\right)',
      vars: {
        T: { name: 'transmission', q: 'ratio', unit: '%' },
        V: { name: 'applied voltage', q: 'voltage', unit: 'V', value: 1500 },
        Vp: { name: 'half-wave voltage', q: 'voltage', unit: 'V', value: 3000, tex: 'V_\\pi' }
      },
      note: 'Zero at no voltage, 100 % at V = Vπ.',
      stories: { T: 'A Pockels cell with a half-wave voltage of {Vp} has {V} across it, between crossed polarizers. What fraction passes?' }
    },
    {
      name: 'Deflection of an acousto-optic modulator',
      expr: 'th = lam*f/v', tex: '\\theta = \\frac{\\lambda\\,f}{v}',
      vars: {
        th: { name: 'deflection of the first order', q: 'angle', unit: 'mrad', tex: '\\theta' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 633, tex: '\\lambda' },
        f: { name: 'acoustic frequency', q: 'frequency', unit: 'MHz', value: 80 },
        v: { name: 'speed of sound in the crystal', q: 'speed', unit: 'm/s', value: 650 }
      },
      note: 'Twice the Bragg angle. 650 m/s is the slow shear wave of TeO₂.',
      stories: { th: 'Light of {lam} meets a sound wave of {f} in a crystal where the speed of sound is {v}. By what angle is the first order deflected?' }
    },
    {
      name: 'Rise time of an acousto-optic modulator',
      expr: 'tr = 0.65*D/v', tex: 't_r \\approx \\frac{0.65\\,D}{v}',
      vars: {
        tr: { name: 'rise time', q: 'time', unit: 'ns', tex: 't_r' },
        D: { name: 'beam diameter in the crystal', q: 'length', unit: 'mm', value: 0.5 },
        v: { name: 'speed of sound', q: 'speed', unit: 'm/s', value: 650 }
      },
      note: 'The time for the sound to cross the beam. Focusing the beam into the crystal shortens it.',
      stories: { tr: 'A beam {D} across passes through an acousto-optic crystal where sound travels at {v}. How long does the modulator take to turn on?' }
    }
  ],
  examples: [
    {
      title: 'How long must the Faraday crystal be?',
      q: 'A TGG crystal ($V = 40$ rad/(T·m) at 1064 nm) sits in a magnetic field of 1.0 T along its axis. What length rotates the polarization by 45°?',
      steps: [
        { text: 'Solve $\\theta = VBL$ for $L$, with 45° = 0.785 rad:', tex: 'L = \\frac{\\theta}{V B} = \\frac{0.785}{40 \\times 1.0} = 19.6\\ \\mathrm{mm}' }
      ],
      a: 'About 20 mm. A shorter crystal needs a stronger field, which is why isolators use compact, strong permanent magnets.'
    },
    {
      title: 'Deflection and speed of an AOM',
      q: 'A TeO₂ modulator (shear wave at 650 m/s) is driven at 80 MHz with a 633 nm beam of 0.5 mm diameter. How far is the first order deflected, and how fast does it switch?',
      steps: [
        { text: 'Deflection:', tex: '\\theta = \\frac{\\lambda f}{v} = \\frac{633\\times10^{-9} \\times 80\\times10^{6}}{650} = 78\\ \\mathrm{mrad} = 4.5^\\circ' },
        { text: 'Rise time:', tex: 't_r \\approx \\frac{0.65 D}{v} = \\frac{0.65 \\times 0.5\\times 10^{-3}}{650} = 0.5\\ \\mu\\mathrm{s}' }
      ],
      a: '78 mrad (4.5°) and a rise time of 0.5 µs. Focusing the beam to a fifth of the width in the crystal makes it five times faster.'
    }
  ],
  quiz: [
    { q: 'A Faraday isolator rotates the polarization by 45° on the forward trip. Light returning through it is rotated by…', choices: ['45° the other way, back to the start', '45° the same way, so 90° in all', '0°', '180°'], a: 1, why: 'The Faraday rotation is non-reciprocal: it has the same sense in the lab whichever way the light travels, so it adds. The return light, polarized at 45° after the second polarizer, ends at 90° and is blocked by the first.' },
    { q: 'A solution of sugar rotating polarization by 45° is used in place of the Faraday rotator in an isolator. Does it isolate?', choices: ['Yes, just as well', 'No: it rotates back on the return trip, so the reflection reaches the laser', 'Yes, but only for red light', 'It blocks the forward beam'], a: 1, why: 'Natural optical activity is reciprocal: its rotation reverses sense relative to the beam when the direction reverses, undoing itself.' },
    { q: 'A Pockels cell between crossed polarizers is dark at zero voltage and fully transmitting at the half-wave voltage.', a: true, why: '$T = \\sin^2(\\pi V/2V_\\pi)$ is 0 at $V = 0$ and 1 at $V = V_\\pi$.' },
    { q: 'An AOM with a sound speed of 5960 m/s is driven at 100 MHz with 633 nm light. What is the first-order deflection in milliradians?', answer: 10.6, unit: 'mrad', why: '$\\theta = \\lambda f/v = 633\\times 10^{-9} \\times 10^{8}/5960 = 0.0106$ rad = 10.6 mrad.' },
    { q: 'How can you make an AOM switch faster?', choices: ['Use a longer crystal', 'Focus the beam to a smaller diameter in the crystal', 'Lower the RF frequency', 'Use a bigger magnet'], a: 1, why: 'The rise time is the time for sound to cross the beam, $0.65 D/v$: a smaller beam is crossed sooner.' }
  ],
  applications: [
    'Laser protection: Faraday isolators in front of diode lasers, fibre amplifiers and high-power lasers.',
    'Q-switching and pulse picking: Pockels cells and AOMs gate laser cavities and select single pulses.',
    'Laser displays and printers: AOMs vary the intensity of beams that write images.',
    'Atomic physics: AOMs shift laser frequencies by tens of megahertz to tune them onto an atomic line.',
    'Lock-in measurements: a chopper marks a beam at a known frequency so a detector can pull out a weak signal.'
  ],
  history: 'Michael Faraday found in 1845 that a magnetic field rotates the polarization of light in glass. Friedrich Pockels described the linear electro-optic effect in 1893. Léon Brillouin predicted the diffraction of light by sound in 1922, and Debye and Sears, and Lucas and Biquard, observed it in 1932.',
  sources: [
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics* — the chapters on electro-optics and acousto-optics.',
    'E. Hecht, *Optics* — the Faraday effect and electro-optic modulators in the chapter on polarization.',
    '*Handbook of Optics*, vol. II — modulators, isolators and magneto-optic materials.'
  ],
  sim: 'oc-modulator'
},

/* ================================================================ optomechanics */
{
  id: 'optomechanics-and-mounts', parent: 'optical-components', title: 'Mounts and optomechanics', level: 1,
  short: 'Optics are only as good as what holds them. Kinematic mounts fix a part by exactly three contacts and tilt it with fine screws; posts, lens tubes, cages, rails and stages build the system; a table keeps it still.',
  keywords: ['optomechanics', 'kinematic mount', 'mirror mount', 'lens tube', 'cage system', 'rail', 'post', 'translation stage', 'rotation stage', 'breadboard', 'optical table', 'vibration isolation', 'degrees of freedom', 'three-point mount', 'gimbal mount', 'retaining ring', 'adjuster screw'],
  prereq: ['mirrors-as-components', 'optical-windows'],
  related: ['aligning-an-optical-system', 'lens-tolerances-and-centration', 'thermal-effects-in-optics', 'cleaning-and-handling-optics', 'photoelasticity-and-stress', 'optical-isolators-and-modulators', 'reading-an-optics-catalogue'],
  body: `
Holding an optic is a mechanical problem with an optical answer. The part must stay where it is put, move only when asked and only by a controlled amount, and not be strained, because a strained piece of glass is birefringent and warped.

### Six ways to move, and how to remove them
A rigid body has **six degrees of freedom**: three translations and three rotations. A **kinematic** mount removes exactly six, no more: three contacts give the classic **3-2-1**: a ball in a **cone** seat removes 3 translations, a ball in a **V-groove** removes 2 more, a ball on a **flat** removes the last 1. Nothing is over-constrained, so tightening one contact cannot twist the part, and it returns to the same place when removed and replaced.

### The mirror mount
A kinematic mirror mount is a plate on three points: one fixed pivot and two **adjuster screws** that push on the other two. Turn one screw and the mirror tilts about the line through the other two points. An **80 threads-per-inch** screw advances 0.3175 mm per turn; if it acts 25 mm from the pivot, the mirror tilts $0.3175/25 = 12.7$ mrad per turn (0.73°), and because the beam turns by twice that, 25 mrad: 127 mm on a wall 5 m away. Fine alignment therefore takes fractions of a turn; **fine-pitch** or differential screws (0.1 mm per turn or less) give more control. A **gimbal** mount rotates about the mirror’s own surface, so the beam stays on the spot and only its direction changes.

### The parts of a system
| Part | What it does | Typical sizes |
|---|---|---|
| post and holder | sets height above the table, rotates freely | 12.7 mm or 25.4 mm (½ or 1 inch) diameter |
| breadboard, optical table | flat plate with a grid of threaded holes | 25 mm grid, M6 screws, or 1 inch grid, ¼-20 |
| lens tube | tube with a common internal thread that holds lenses, filters and irises in line | 1 inch (thread of 1.035 inch, 40 per inch) and 2 inch |
| cage system | four rods holding plates that carry optics | rods 6 mm across on a 30 mm square |
| rail and carrier | straight line along which parts slide | lengths of tens of centimetres |
| stages | translation or rotation by micrometre or piezo | travel 13–50 mm; micrometre resolution, nanometre with piezos |
| retaining ring | clamps a lens in its cell | tightened by finger only |

### Don’t over-constrain
A lens held in a ring tightened hard, or a mirror clamped at four screws, is strained. The strain shows up as **stress birefringence** under crossed polarizers and as a distorted wavefront. Hold an optic at three points or with a light edge force, use retaining rings finger-tight, and let a ring of soft material take up the differences in expansion.

### The table
Vibration moves optics by fractions of a wavelength. Optical tables are stiff honeycomb plates on **pneumatic legs** whose natural frequency, 1–2 Hz, is far below the floor’s vibrations, so the table moves much less than the floor at 10 Hz and above. A mount made of aluminium (expansion 23 ppm/K) holding N-BK7 (7 ppm/K) shifts by a micrometre across 100 mm for each 0.6 K; low-expansion materials (Invar 1.2 ppm/K) and temperature-stable rooms matter in precision work.

> [!key] A kinematic mount removes exactly six degrees of freedom with three contacts and tilts through fine screws: 80 TPI at 25 mm gives 12.7 mrad per turn, and the beam moves twice as far. Never clamp harder than needed; strain is birefringence.
`,
  ideas: [
    'A rigid body has six degrees of freedom; a kinematic mount removes exactly six with a cone, a groove and a flat (3-2-1).',
    'A mirror mount tilts through adjuster screws: tilt per turn = pitch ÷ lever arm, and the beam turns by twice the tilt.',
    'Posts, lens tubes, cages and rails build a system on a breadboard or table with a regular grid of holes.',
    'Over-constraining or over-tightening strains the glass, causing birefringence and wavefront error.',
    'A table on pneumatic legs isolates the optics from floor vibration above a couple of hertz.'
  ],
  pitfalls: [
    'More screws make a mount firmer and better — Extra constraints fight each other and strain the optic. A kinematic mount uses exactly as many contacts as needed.',
    'A kinematic mount is just a spring-loaded mount — The spring only holds the three contacts together. The kinematic part is the geometry: cone, groove and flat remove 3, 2 and 1 degrees of freedom.',
    'One turn of an adjuster moves the beam by the thread pitch — The pitch is divided by the lever arm to give the mirror’s tilt, which is then doubled for the beam, and multiplied by the distance to give the spot movement.',
    'Tighten the retaining ring until the lens will not move — That strains the glass and puts stress birefringence in the beam. Finger-tight is enough.'
  ],
  terms: [
    { term: 'Kinematic mount', def: 'A mount that fixes a part with exactly as many contacts as it has degrees of freedom to remove, six, so that it neither distorts nor wanders.' },
    { term: 'Degrees of freedom', also: ['DOF'], def: 'The six independent ways a rigid body can move: three translations and three rotations.' },
    { term: 'Adjuster screw', also: ['actuator', 'fine adjustment screw'], def: 'A fine-pitch screw that pushes on a mount to tilt it. Its sensitivity is the pitch divided by the distance to the pivot.' },
    { term: 'Lens tube', def: 'A tube with internal threads that holds lenses, filters, irises and other parts in line, for 1 inch or 2 inch optics.' },
    { term: 'Cage system', def: 'Four rods that hold square plates carrying optics, giving a rigid, aligned optical train.' },
    { term: 'Breadboard', also: ['optical table'], def: 'A flat plate drilled with a regular grid of threaded holes (25 mm with M6, or 1 inch with ¼-20) on which optical systems are built.' },
    { term: 'Gimbal mount', def: 'A mirror mount that tilts about axes passing through the mirror’s own surface, so that the beam spot does not move when it is adjusted.' }
  ],
  formulas: [
    {
      name: 'Tilt of a mirror per turn of the adjuster',
      expr: 'dt = p/La', tex: '\\delta = \\frac{p}{L_a}',
      vars: {
        dt: { name: 'tilt of the mirror per turn', q: 'angle', unit: 'mrad', tex: '\\delta' },
        p: { name: 'thread pitch (advance per turn)', q: 'length', unit: 'mm', value: 0.3175 },
        La: { name: 'distance from pivot to screw', q: 'length', unit: 'mm', value: 25, tex: 'L_a' }
      },
      note: 'An 80 threads-per-inch screw advances 0.3175 mm per turn; a 100 TPI screw 0.254 mm.',
      stories: { dt: 'An adjuster screw of pitch {p} acts {La} from the pivot of a mirror mount. By what angle does one turn tilt the mirror?' }
    },
    {
      name: 'Where the spot moves per turn',
      expr: 'x = 2*p*Z/La', tex: 'x = \\frac{2\\,p\\,Z}{L_a}',
      vars: {
        x: { name: 'movement of the spot per turn', q: 'length', unit: 'mm' },
        p: { name: 'thread pitch', q: 'length', unit: 'mm', value: 0.3175 },
        Z: { name: 'distance from the mirror to the target', q: 'length', unit: 'm', value: 5 },
        La: { name: 'distance from pivot to screw', q: 'length', unit: 'mm', value: 25, tex: 'L_a' }
      },
      note: 'Small angles: tilt p/La, beam turns twice that, over a distance Z.',
      stories: { x: 'A mirror mount has a {p} screw {La} from the pivot. How far does the spot move on a target {Z} away for one full turn?' }
    },
    {
      name: 'Thermal change of a length',
      expr: 'dl = al*L*dT', tex: '\\Delta L = \\alpha\\,L\\,\\Delta T',
      vars: {
        dl: { name: 'change of length', q: 'length', unit: 'µm', signed: true, tex: '\\Delta L' },
        al: { name: 'coefficient of thermal expansion', q: 'expansion', unit: 'ppm/K', value: 23, tex: '\\alpha' },
        L: { name: 'length', q: 'length', unit: 'mm', value: 100 },
        dT: { name: 'temperature change', q: 'dtemp', unit: 'K', value: 1, signed: true, tex: '\\Delta T' }
      },
      note: 'Aluminium 23 ppm/K, stainless steel 17, N-BK7 7.1, fused silica 0.55, Invar about 1.2.',
      stories: { dl: 'A mount with an expansion coefficient of {al} is {L} long and warms by {dT}. By how much does it lengthen?' }
    }
  ],
  examples: [
    {
      title: 'How much to turn the knob',
      q: 'A spot must be moved 2 mm on a target 5 m from a mirror whose 80 TPI adjuster acts 25 mm from the pivot. By how much must the adjuster be turned?',
      steps: [
        { text: 'The spot moves per turn:', tex: 'x = \\frac{2 p Z}{L_a} = \\frac{2 \\times 0.3175 \\times 5000}{25} = 127\\ \\mathrm{mm}' },
        { text: 'The turn needed:', tex: '\\frac{2}{127} = 0.016\\ \\text{turn} \\approx 5.7^\\circ \\text{ of the knob}' }
      ],
      a: 'About 0.016 turn, 5.7° of the knob. Fine adjustment is a matter of a few degrees; a coarse screw makes long-distance alignment hard, hence fine-pitch actuators.'
    },
    {
      title: 'A mount warming up',
      q: 'An aluminium mount 100 mm long, holding a glass element, warms by 5 K. How much longer does it become, compared with the glass (N-BK7)?',
      steps: [
        { text: 'The mount:', tex: '\\Delta L = 23\\times10^{-6} \\times 100\\ \\mathrm{mm} \\times 5 = 11.5\\ \\mu\\mathrm{m}' },
        { text: 'The glass:', tex: '\\Delta L = 7.1\\times10^{-6} \\times 100 \\times 5 = 3.6\\ \\mu\\mathrm{m}' }
      ],
      a: 'The aluminium grows 7.9 µm more than the glass, enough to loosen or squeeze the optic; a compliant ring takes up the difference.'
    }
  ],
  quiz: [
    { q: 'A cone, a V-groove and a flat support a plate. Together they remove how many degrees of freedom?', choices: ['3', '4', '6', '9'], a: 2, why: 'The cone removes 3, the groove 2 and the flat 1: 3 + 2 + 1 = 6, exactly all of them.' },
    { q: 'An 80 TPI adjuster (0.3175 mm per turn) acts 25.4 mm from the pivot of a mirror. How much does one turn tilt the mirror?', choices: ['0.0125 mrad', '1.25 mrad', '12.5 mrad', '125 mrad'], a: 2, why: '$\\delta = p/L_a = 0.3175/25.4 = 0.0125$ rad = 12.5 mrad, about 0.7°.' },
    { q: 'Tightening a lens retaining ring as hard as possible gives the best centring and no optical penalty.', a: false, why: 'It strains the glass: stress birefringence and a warped wavefront. The ring should be finger-tight.' },
    { q: 'An aluminium bar 200 mm long warms by 2 K. By how many micrometres does it lengthen? (Expansion 23 ppm/K.)', answer: 9.2, unit: 'µm', why: '$\\Delta L = \\alpha L \\Delta T = 23\\times10^{-6} \\times 200\\ \\mathrm{mm} \\times 2 = 0.0092$ mm = 9.2 µm.' },
    { q: 'A gimbal mirror mount differs from an ordinary kinematic mount in that…', choices: ['it has no screws', 'it tilts about the mirror’s own surface, so the spot stays put', 'it uses springs only', 'it holds lenses'], a: 1, why: 'A gimbal mount’s axes pass through the mirror surface, so the beam hits the same point of the mirror while only its direction changes.' }
  ],
  applications: [
    'Laser tables: kinematic mirror and lens mounts steer and focus beams.',
    'Machine vision: cage and rail systems fix camera, lens and light in a rigid alignment.',
    'Microscopes and spectrometers: translation and rotation stages focus and scan.',
    'Interferometers: stiff mounts and isolated tables hold the paths stable to fractions of a wavelength.',
    'Space optics: flexure mounts and low-expansion materials keep telescope mirrors in shape across large temperature swings.'
  ],
  history: 'The principle of exact constraint was set out for scientific apparatus by James Clerk Maxwell in the 1870s; the cone, groove and flat arrangement is often called the Kelvin clamp, after Lord Kelvin.',
  sources: [
    'S. T. Smith and D. G. Chetwynd, *Foundations of Ultraprecision Mechanism Design* — kinematic design, constraints and exact constraint.',
    'P. R. Yoder, Jr., *Mounting Optics in Optical Instruments* — lens and mirror mounts, retaining rings and thermal effects.',
    'W. J. Smith, *Modern Optical Engineering* — the opto-mechanical design chapters.'
  ],
  sim: 'oc-mount'
},

/* ================================================================ aligning */
{
  id: 'aligning-an-optical-system', parent: 'optical-components', title: 'Aligning an optical system', level: 2,
  short: 'Alignment makes the real beam follow the drawn axis. Two irises define a line, two mirrors walk a beam onto it, and back-reflections show when a surface is square to the beam. A mirror’s tilt moves the spot twice as far as you expect, so every adjustment is small.',
  keywords: ['alignment', 'beam walking', 'walking the beam', 'iris', 'alignment target', 'back-reflection', 'centring a lens', 'beam height', 'two-mirror alignment', 'IR viewing card', 'alignment laser', 'optical axis', 'pointing', 'laser safety'],
  prereq: ['optomechanics-and-mounts', 'mirrors-as-components', 'apertures-irises-and-pinholes'],
  related: ['alignment-telescopes-and-lasers', 'the-autocollimator', 'lens-tolerances-and-centration', 'laser-safety-classes', 'laser-eye-hazards-and-eyewear', 'tolerancing-and-alignment-budget', 'cleaning-and-handling-optics', 'testing-and-commissioning'],
  body: `
To align a system is to make the light follow the line the drawing says it should. Beams are straight, so a beam can be made to follow a line by fixing two points on the line and steering the beam through both. Everything else — centring lenses, squaring mirrors — follows from that.

> [!warn] Align at the lowest power that lets you see the beam, with the beam below eye level and enclosed or blocked at the end. Never look into a beam or its reflection; take off rings and watches that can send a stray reflection upward. Real work with Class 3B and Class 4 lasers is governed by the safety standard and a laser safety officer ([[laser-safety-classes]], [[laser-eye-hazards-and-eyewear]]). Use viewing cards and cameras, not your eye.

### Two irises make a line
Place two irises on the table, one near, one far, centred on the line that the beam must follow, at the same height above the table (a ruler or a gauge post checks it). A beam that passes through the centres of both is on that line. Close the irises to 1–2 mm for precision, and open them once the beam is right.

### Walking the beam
A beam from a laser reaches the irises by two mirrors, M1 (first) and M2. Each mirror has two knobs; work on one plane at a time. A mirror’s tilt does two different things: **M2** changes the *direction* of the beam without moving it at M2, while **M1** moves the *position* at M2 as well as the direction. The procedure:
1. Use **M1** to put the beam on the centre of the **near** iris (close to M2).
2. Use **M2** to put the beam on the centre of the **far** iris.
3. The near iris has been disturbed, a little: repeat.

If the near iris is a distance $a$ from M2 and the far one $b$, each cycle leaves a fraction $a/b$ of the previous error: $e_n = e_0\\,(a/b)^n$. With irises at 0.4 m and 4 m the error falls tenfold per cycle, so two cycles bring 5 mm down to 0.05 mm. This is **beam walking**, and it is why the two irises should be as far apart as the table allows.

### Why the knobs are small
Tilting a mirror by $\\delta$ moves the spot by $2\\delta Z$ at distance $Z$: 0.1 mrad moves it 1 mm at 5 m. An adjuster that gives 12.7 mrad per turn ([[optomechanics-and-mounts]]) needs 1/127 of a turn for that.

### Lenses and other parts
- **Centring a lens**: put it in the aligned beam; the beam must come out on the same line. A lens decentred by $e$ deviates a collimated beam by $e/f$: 1 mm on a 100 mm lens is 10 mrad. Slide it sideways until the focus does not move when the lens is rotated.
- **Squaring with back-reflections**: a flat surface square to the beam sends its reflection straight back along the incoming path. When the reflection returns through the source iris, the surface is perpendicular. Lenses give several reflections from their curved faces: the two or three spots on a card all coincide when the lens is centred and square.
- **Checks**: remove and replace an element; the beam should not move. Blocking one iris at a time shows where it goes.

> [!key] Two irises define a line; M1 centres the near iris, M2 the far one, and the error falls by the ratio of their distances each cycle. A mirror tilt moves a spot twice as far as it seems — turn the knobs a fraction of a turn.
`,
  ideas: [
    'Two irises at the same height define a line; a beam through both centres follows it.',
    'M1 sets the position and M2 the direction: use M1 on the near iris and M2 on the far one, and repeat.',
    'Each cycle of beam walking cuts the error by the ratio of the near to the far distance.',
    'A back-reflection returns along the incoming path when the surface is square to the beam.',
    'A lens decentred by e deviates a collimated beam by e/f.'
  ],
  pitfalls: [
    'The mirror nearest the irises should centre the near iris — It is M1, the first mirror, that sets the beam’s position at M2 and so controls the near iris; M2 changes only the direction and is used for the far iris.',
    'Once the beam is on the far iris, it is aligned — The near iris may be off again. Walk the beam until both are centred, a few cycles.',
    'Two irises close together align the beam well — The farther apart they are, the smaller the angle error that a given miss at the far one means; irises close together leave a large angle uncertain.',
    'Alignment is easier at full power — The brighter beam is a hazard and its reflections are harder to follow. Use the least power that you can see.'
  ],
  terms: [
    { term: 'Beam walking', also: ['walking the beam'], def: 'Aligning a beam onto a line with two mirrors by turning one to centre the beam at a near point and the other at a far point, repeatedly.' },
    { term: 'Alignment iris', also: ['alignment target'], def: 'An iris or marked card set on the desired axis, used to define a line that the beam must follow.' },
    { term: 'Back-reflection', also: ['retro-reflection', 'return reflection'], def: 'The reflection of a beam from an optical surface back along its incoming path. It returns along the beam only when the surface is square to it.' },
    { term: 'Centring', def: 'Placing a lens so that its optical axis lies on the system axis. A lens decentred by e deviates a collimated beam by e/f.' },
    { term: 'Viewing card', also: ['IR card', 'fluorescent card'], def: 'A card that shows an invisible (infrared) beam as a visible spot, used to follow the beam safely.' },
    { term: 'Beam height', def: 'The height of the beam above the table. It is kept constant along the system so that every optic can be mounted at the same height.' }
  ],
  formulas: [
    {
      name: 'Error left after n cycles of beam walking',
      expr: 'en = e0*(a/b)^n', tex: 'e_n = e_0\\left(\\frac{a}{b}\\right)^{n}',
      vars: {
        en: { name: 'error at the far iris after n cycles', q: 'length', unit: 'mm', tex: 'e_n' },
        e0: { name: 'starting error', q: 'length', unit: 'mm', value: 5, tex: 'e_0' },
        a: { name: 'distance from M2 to the near iris', q: 'length', unit: 'm', value: 0.4 },
        b: { name: 'distance from M2 to the far iris', q: 'length', unit: 'm', value: 4 },
        n: { name: 'number of cycles', value: 2, min: 0, max: 20, int: true }
      },
      solveFor: 'en',
      note: 'For a near iris closer to M2 than the far one (a < b).',
      stories: { en: 'A beam starts {e0} off at the far iris. The irises are {a} and {b} from the second mirror. After {n} cycles of walking, how far off is it?' }
    },
    {
      name: 'Mirror tilt needed for a spot shift',
      expr: 'dt = x/(2*Z)', tex: '\\delta = \\frac{x}{2\\,Z}',
      vars: {
        dt: { name: 'tilt of the mirror', q: 'angle', unit: 'mrad', tex: '\\delta' },
        x: { name: 'shift of the spot', q: 'length', unit: 'mm', value: 1 },
        Z: { name: 'distance from the mirror to the target', q: 'length', unit: 'm', value: 5 }
      },
      note: 'Small angles. The beam turns by twice the tilt of the mirror.',
      stories: { dt: 'A spot has to move {x} on a target {Z} from the mirror. By what angle must the mirror be tilted?' }
    },
    {
      name: 'Beam deviation from a decentred lens',
      expr: 'th = xd/f', tex: '\\theta \\approx \\frac{x_d}{f}',
      vars: {
        th: { name: 'deviation of a collimated beam', q: 'angle', unit: 'mrad', tex: '\\theta' },
        xd: { name: 'decentring of the lens', q: 'length', unit: 'mm', value: 1, tex: 'x_d' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 }
      },
      note: 'A collimated beam through a lens displaced sideways by x_d is deflected by about x_d/f.',
      stories: { th: 'A lens of {f} focal length sits {xd} off the beam’s axis. By what angle is a collimated beam deflected?' }
    }
  ],
  examples: [
    {
      title: 'How many cycles?',
      q: 'The near iris is 0.5 m from the second mirror and the far iris 5 m. The beam starts 8 mm off the centre of the far iris. After how many cycles of walking is it within 0.1 mm?',
      steps: [
        { text: 'Each cycle multiplies the error by $a/b = 0.1$:', tex: 'e_n = 8\\ \\mathrm{mm} \\times 0.1^n' },
        { text: 'For $e_n \\le 0.1$ mm:', tex: '0.1^n \\le 0.0125 \\quad\\Rightarrow\\quad n \\ge 1.9' }
      ],
      a: 'Two cycles: the error is 0.08 mm after the second. Irises closer together would need more cycles.'
    },
    {
      title: 'A knob and a spot',
      q: 'A spot must move 2 mm on a target 4 m from a mirror. What tilt does the mirror need?',
      steps: [
        { text: 'Tilt is half of the beam angle:', tex: '\\delta = \\frac{x}{2Z} = \\frac{2\\ \\mathrm{mm}}{2 \\times 4000\\ \\mathrm{mm}} = 0.25\\ \\mathrm{mrad}' }
      ],
      a: '0.25 mrad: 1/50 of a turn of an adjuster that gives 12.5 mrad per turn.'
    }
  ],
  quiz: [
    { q: 'In beam walking with two mirrors and two irises, which mirror is used for the near iris?', choices: ['M2, the second', 'M1, the first', 'either, the result is the same', 'neither: the irises do it'], a: 1, why: 'M1 moves the beam’s position as well as its direction at M2, so it controls the near iris; M2 changes only the direction and so controls the far one.' },
    { q: 'The near iris is 0.3 m and the far iris 3 m from the second mirror. By what factor does each walking cycle reduce the error?', choices: ['3', '10', '30', '100'], a: 1, why: 'The error is multiplied by $a/b = 0.1$ each cycle: reduced tenfold.' },
    { q: 'A flat window square to a beam returns its reflection along the incoming path.', a: true, why: 'At normal incidence the reflected ray retraces the incident one. The reflection missing the source iris shows that the window is tilted.' },
    { q: 'A 50 mm lens is 2 mm off the axis of a collimated beam. By how many milliradians is the beam deflected?', answer: 40, unit: 'mrad', why: '$\\theta = e/f = 2/50 = 0.04$ rad = 40 mrad.' },
    { q: 'Which is the safest way to find an invisible infrared beam during alignment?', choices: ['look along the beam', 'a viewing card or an infrared camera', 'look at its reflection from a mirror', 'a pair of ordinary sunglasses'], a: 1, why: 'A viewing card or camera makes the beam visible without putting your eye in it. Looking into an infrared beam or its reflection is dangerous because the eye gives no warning.' }
  ],
  applications: [
    'Laser tables: bringing a beam through a series of optics along a common axis.',
    'Interferometers and spectrometers, where the beams must overlap and the optics be square to them.',
    'Telescopes: collimating the primary and secondary mirrors with a laser or a target.',
    'Machine vision: aligning a light, a lens and a camera on one axis for backlit or coaxial setups.',
    'Surveying and construction: laser levels and alignment telescopes define a straight line over long distances.'
  ],
  sources: [
    'E. Hecht, *Optics* — reflection from mirrors and refraction by thin lenses, the geometry behind tilt and decentring.',
    'W. J. Smith, *Modern Optical Engineering* — alignment and the effect of centring errors.',
    'IEC 60825-1, *Safety of laser products* — classification and the precautions for each class.'
  ],
  sim: 'oc-walk'
},

/* ================================================================ cleaning */
{
  id: 'cleaning-and-handling-optics', parent: 'optical-components', title: 'Cleaning and handling optics', level: 1,
  short: 'Most damage to optics is done by the person cleaning them. Hold them by the edges, blow dust off before anything touches the surface, and clean only when needed, by dragging solvent on lens tissue across the surface in one pass.',
  keywords: ['cleaning optics', 'handling optics', 'lens tissue', 'drop and drag', 'isopropyl alcohol', 'acetone', 'gloves', 'finger cots', 'compressed air', 'blower', 'scratch', 'fingerprint', 'dust', 'first-surface mirror', 'gratings', 'pellicle', 'clean room'],
  prereq: ['optical-windows', 'mirrors-as-components'],
  related: ['surface-quality-and-flatness', 'laser-damage-and-coating-durability', 'how-coatings-are-made', 'optomechanics-and-mounts', 'metal-mirror-coatings', 'fibre-connectors-and-ferrules', 'diffusers-and-ground-glass', 'optical-glass'],
  body: `
An optical surface is polished to a few nanometres and often carries a coating a fraction of a wavelength thick. A fingerprint, a speck of grit dragged across it or a rough wipe can leave damage that cannot be removed. So the rule for both handling and cleaning is **do as little as will do**.

### Handling
- Hold an optic by its **edges** (or in a lens tissue), wearing powder-free gloves or finger cots. Skin oil and salts can etch a coating within days.
- Put the cap on or cover the optic whenever it is not in the beam; store in a closed box with a desiccant, because humid air feeds fungus on glass.
- Do not talk or breathe over an uncovered optic, and keep your tools and optics away from the edge of the table.

### Look before you clean
Dust that you can see only at a grazing angle in a bright light rarely matters. Particles of 10 µm cover about $N(d/D)^2$ of the area of an aperture: 1000 of them on a 25 mm window block 0.016 % of the light. Dust matters for **laser** beams, where it can absorb and burn the coating, and for scatter-sensitive measurements. Each cleaning risks a scratch, so clean when the dirt matters, not when it can be seen.

### The sequence
1. **Blow.** Remove loose dust with clean dry gas: a blower bulb, or filtered gas held upright (a can tipped over sprays liquid propellant). Never blow with your breath.
2. **Drop and drag.** Lay a piece of fresh lens tissue on the surface, put a drop of solvent on it, and **drag** it slowly across in one pass so that the solvent evaporates behind the tissue and carries the dirt off with it. A fresh tissue each time.
3. **Inspect** against a light at an angle; repeat if needed.

For a stubborn mark, fold the tissue and hold it in forceps, wet it, and drag it once. Optical-grade isopropyl alcohol or acetone are common; acetone attacks plastics and some cements, so use alcohol on plastic lenses and cemented parts.

> [!warn] Solvents are flammable and their vapour is harmful: ventilate the room, keep them away from sparks and hot lamps, and keep the quantities small.

### What you never wipe
| Surface | What to do instead |
|---|---|
| bare or protected metal mirrors (aluminium, silver, gold) | blow only; if wiped at all, a single gentle drag of wet tissue |
| pellicles | blow only; touching tears them |
| gratings (ruled and holographic) | never touch or wipe; blow gently |
| ground glass and diffusers | blow; rinse; do not rub |
| soft crystals (ZnSe, germanium, some fluorides), and uncoated hygroscopic salts (KBr, NaCl) | blow; keep dry; use only the cleaning the maker says |
| fibre connectors | use the special fibre cleaners ([[fibre-connectors-and-ferrules]]) |

### Never
Never wipe a dry surface (the dust is the scratch), never rub back and forth, never reuse a tissue, never use paper towels, cloth or a shirt, and never apply force: the tissue’s weight is enough.

> [!key] Handle by the edges, blow before touching, and clean only when the dirt matters: one drag of a solvent-wet fresh lens tissue. Never wipe a dry surface, and never wipe metal mirrors, pellicles or gratings.
`,
  ideas: [
    'Hold optics by the edges, with gloves or finger cots; skin oil etches coatings.',
    'Blow loose dust off with clean dry gas before anything touches the surface.',
    'Drop and drag: a fresh lens tissue, a drop of solvent, one slow pass in one direction.',
    'Dust seldom matters for imaging but burns coatings in laser beams; clean only when it matters.',
    'Metal mirrors, pellicles and gratings are never wiped.'
  ],
  pitfalls: [
    'A wipe with a dry cloth is the gentlest cleaning — A dry wipe drags dust grains across the surface like sandpaper. Blow first; then use a wet tissue.',
    'A clean-looking surface needs no cleaning, a dusty one always does — Few particles do any harm to an image. Each cleaning risks a scratch, so clean when the dust matters (lasers, scatter measurements).',
    'Rubbing in circles removes dirt best — Rubbing pushes dirt around and scratches. One slow drag in one direction, with a fresh tissue, carries the dirt off.',
    'Acetone is best for everything — It dissolves cement and attacks plastics. Use isopropyl alcohol on plastics and cemented parts.'
  ],
  terms: [
    { term: 'Drop and drag', also: ['drag method'], def: 'A cleaning method: a fresh sheet of lens tissue laid on the surface, a drop of solvent applied, and the tissue drawn slowly across in one pass.' },
    { term: 'Lens tissue', def: 'A soft, lint-free paper made for wiping optics. Used once, with solvent, and never dry.' },
    { term: 'Finger cot', def: 'A small rubber or nitrile sleeve for a fingertip, worn when handling optics by the edges.' },
    { term: 'Scratch–dig', also: ['scratch-dig', '60-40'], def: 'The specification of surface blemishes: the scratch number is a visual comparison with standard scratches and the dig number is the diameter of a pit in hundredths of a millimetre.' },
    { term: 'Laser-induced damage', also: ['LIDT'], def: 'Damage to a coating or surface by a laser beam. Dirt on the surface absorbs light and can start it at far lower power than a clean surface would suffer.' },
    { term: 'Desiccant', def: 'A drying agent, such as silica gel, kept in a storage box to hold the air dry and protect optics from fungus and moisture.' }
  ],
  formulas: [
    {
      name: 'Fraction of an aperture blocked by particles',
      expr: 'fb = N*(d/D)^2', tex: 'f_b = N\\left(\\frac{d}{D}\\right)^2',
      vars: {
        fb: { name: 'fraction of the area blocked', q: 'ratio', unit: '%', tex: 'f_b' },
        N: { name: 'number of particles', value: 1000, min: 1, max: 1e8, int: true },
        d: { name: 'diameter of a particle', q: 'length', unit: 'µm', value: 10 },
        D: { name: 'diameter of the aperture', q: 'length', unit: 'mm', value: 25 }
      },
      note: 'The area of each particle over the area of the aperture, for particles that do not overlap. The scatter outside the geometric shadow is of the same order.',
      stories: { fb: '{N} dust particles of {d} lie on a window {D} across. What fraction of the area do they cover?' }
    },
    {
      name: 'Irradiance of a flat-top beam',
      expr: 'I = 4*P/(pi*D^2)', tex: 'I = \\frac{4\\,P}{\\pi D^2}',
      vars: {
        I: { name: 'irradiance', q: 'intensity', unit: 'W/cm²' },
        P: { name: 'laser power', q: 'power', unit: 'W', value: 20 },
        D: { name: 'beam diameter', q: 'length', unit: 'mm', value: 5 }
      },
      note: 'Dirt that absorbs a few per cent of this can heat to damage a coating; the more power in a smaller beam, the greater the risk.',
      stories: { I: 'A beam of {P} and {D} diameter has a uniform profile. What is its irradiance?' }
    }
  ],
  examples: [
    {
      title: 'Does the dust matter?',
      q: 'A 25 mm lens carries about 500 dust specks of 20 µm. How much of the aperture is covered? Is the picture affected?',
      steps: [
        { text: 'Fraction of the area:', tex: 'f_b = N\\left(\\frac{d}{D}\\right)^2 = 500 \\times \\left(\\frac{0.020}{25}\\right)^2 = 3.2\\times10^{-4}' }
      ],
      a: '0.03 % of the area. A picture is practically unaffected; cleaning it would risk more than it gains. In a high-power laser beam the same specks could burn and are worth removing.'
    },
    {
      title: 'Irradiance in a laser beam',
      q: 'A 20 W beam 5 mm across passes through a window. What is its irradiance, and why does it matter for dirt?',
      steps: [
        { text: 'Area of the beam: $\\pi (0.25\\ \\mathrm{cm})^2 = 0.196\\ \\mathrm{cm}^2$, so', tex: 'I = \\frac{20\\ \\mathrm{W}}{0.196\\ \\mathrm{cm}^2} = 102\\ \\mathrm{W/cm^2}' }
      ],
      a: '102 W/cm². A particle absorbing the light on it is heated far above its surroundings and can damage the coating beneath: for lasers clean surfaces are a matter of survival, not tidiness.'
    }
  ],
  quiz: [
    { q: 'What is the first step in cleaning a dusty lens?', choices: ['wipe it with a dry cloth', 'blow the loose dust away with clean dry gas', 'breathe on it and wipe', 'wet it with acetone'], a: 1, why: 'Loose dust must be removed without touching, because a dry wipe drags grit across the surface.' },
    { q: 'In the drop-and-drag method, the tissue is moved…', choices: ['back and forth many times', 'in small circles', 'slowly across the surface in one pass, then discarded', 'quickly, to dry the solvent'], a: 2, why: 'One slow pass lets the solvent evaporate behind the tissue and carry the dirt off; reusing the tissue puts the dirt back.' },
    { q: 'A bare gold mirror may be wiped firmly with lens tissue and solvent if it is dirty.', a: false, why: 'Bare metal coatings are soft and scratch very easily. Blow the dust off; if wiping is unavoidable, use one gentle drag only.' },
    { q: '200 particles of 50 µm lie on a 25 mm window. What per cent of the area do they cover?', answer: 0.08, unit: '%', why: '$f_b = N(d/D)^2 = 200 \\times (0.05/25)^2 = 8\\times10^{-4} = 0.08\\ \\%$.' },
    { q: 'Why is dirt on an optic more serious in a laser beam than in a camera?', choices: ['a laser is brighter than a flash', 'the dirt absorbs the intense light and can burn the coating, though it hardly affects a picture', 'lasers are monochromatic', 'cameras use autofocus'], a: 1, why: 'A speck blocks almost nothing, but in a beam of hundreds of watts per square centimetre it heats and can damage the surface.' }
  ],
  applications: [
    'Laser laboratories: routine inspection and cleaning of windows, mirrors and lenses before high-power use.',
    'Microscopes and cameras: cleaning front lens elements and sensor cover glass when dust shows in the picture.',
    'Optical manufacturing: handling and cleaning in the clean rooms where coatings are applied.',
    'Field instruments: caps, lens hoods and storage cases keep surfaces clean in dusty places.',
    'Fibre-optic networks: cleaning connector end faces, where one particle can spoil a link.'
  ],
  sources: [
    'W. J. Smith, *Modern Optical Engineering* — the specification of optical surfaces and their quality.',
    'ISO 10110, *Optics and photonics — Preparation of drawings for optical elements and systems* — how surface imperfections and coatings are indicated.',
    'MIL-PRF-13830B — the scratch–dig convention that defines what a blemish is.'
  ],
  sim: 'oc-clean'
},

/* ================================================================ reading a catalogue */
{
  id: 'reading-an-optics-catalogue', parent: 'optical-components', title: 'Reading an optics catalogue', level: 1,
  short: 'A catalogue line packs a lens into a dozen fields: diameter, focal length, thicknesses, material, coating, design wavelength, surface quality, clear aperture. Each has a meaning, a typical tolerance and a use, and several of them can be worked out from the others.',
  keywords: ['optics catalogue', 'datasheet', 'EFL', 'BFL', 'centre thickness', 'edge thickness', 'clear aperture', 'design wavelength', 'AR coating', 'scratch-dig', 'tolerance', 'centration', 'lens specification', 'diameter tolerance', 'commercial grade', 'precision grade'],
  prereq: ['catalogue-lens-types', 'optical-windows', 'focal-length-and-optical-power'],
  related: ['reading-a-lens-datasheet', 'choosing-catalogue-components', 'antireflection-coatings', 'surface-quality-and-flatness', 'optical-drawings-and-iso-10110', 'lens-tolerances-and-centration', 'the-f-number', 'mirrors-as-components'],
  body: `
Two lenses that look alike in the picture can differ by a hundred times in price and in what they do. The difference is in the line of numbers in the catalogue, written in a shorthand that is easy to read once you know what each field says. Here is a typical entry:

**Plano-convex lens, Ø25.4 mm, EFL 50.0 mm, N-BK7, CT 5.3 mm, BFL 46.5 mm, ET 2.0 mm, AR 400–700 nm, 60-40, CA > 90 %**

### Line by line
| Field | Meaning | Typical tolerance (commercial grade) |
|---|---|---|
| Ø25.4 mm | outer **diameter** (1 inch); the lens fits a 1-inch mount | +0 / −0.1 mm |
| EFL 50.0 mm | **effective focal length** at the design wavelength, from the principal plane | ±1 % |
| N-BK7 | the **glass**: index 1.5168 and Abbe number 64.2 at 587.6 nm | the glass catalogue |
| CT 5.3 mm | **centre thickness**, on the axis | ±0.1 to 0.2 mm |
| ET 2.0 mm | **edge thickness**, at the rim; it tells you how fragile the edge is | — |
| BFL 46.5 mm | **back focal length**: from the last surface to the focus. Not the same as EFL | — |
| AR 400–700 nm | **anti-reflection coating** for that band; reflection per surface under 0.5 % on average | — |
| 60-40 | **scratch–dig**: scratch grade 60, dig 0.40 mm | 80-50 commercial, 20-10 laser grade |
| CA > 90 % | **clear aperture**: the central part of the diameter that meets the specification | — |
| centration | angle by which the beam is deviated: 3 arcmin or better | 3′ commercial |

### What you can work out
Given the shape and the material you can check a catalogue line. For a plano-convex lens with the curved face first, $R = f(n-1)$: 50 × 0.5168 = 25.8 mm. The rim sits $s = R - \\sqrt{R^2 - (D/2)^2} = 3.3$ mm behind the vertex, so $\\mathrm{ET} = \\mathrm{CT} - s = 5.3 - 3.3 = 2.0$ mm ✓. The back focal length is $f - \\mathrm{CT}/n = 50 - 5.3/1.517 = 46.5$ mm ✓. The speed is $N = f/D = 2$ (so NA $\\approx 0.25$).

### The wavelength matters
Every number is for the **design wavelength**: typically 587.6 nm or 546 nm. Glass has a smaller index at longer wavelengths, so the focal length grows: this 50.0 mm lens has $f = 50.0 \\times 0.5168/0.5066 = 51.0$ mm at 1064 nm. For laser work calculate the focal length at the wavelength you will use.

### Grades
**Commercial** grades are good for most uses; **precision** grades tighten the diameter, thickness and focal-length tolerances by two to four times, and ask for a better surface quality and a lower centration error. Pay for precision when the system needs it: a collimator for a laser interferometer does, a condenser for a lamp does not.

### Reading the rest of a page
Look for the **damage threshold** on laser optics (in J/cm² or W/cm²), the **flatness** of a window or mirror (in waves at 632.8 nm), the **wedge** of a window, the thread or **mount**, and the coating curve (the plot of reflectance against wavelength, which tells you whether the band is the one you need).

> [!key] A catalogue line is a specification: diameter, EFL, thicknesses, glass, coating band, scratch–dig and clear aperture, all at a design wavelength. Check the numbers that depend on one another (R, ET, BFL), and read the coating plot.
`,
  ideas: [
    'Every field has a meaning and a typical tolerance; the focal length is an effective one at a design wavelength.',
    'For a plano-convex lens, R = f(n − 1), BFL = f − CT/n and ET = CT − the sagitta.',
    'Focal length changes with wavelength: longer wavelengths see a smaller index, so a longer focal length.',
    'Scratch–dig 60-40 means a scratch grade of 60 and a dig of 0.40 mm; the clear aperture is the usable part of the diameter.',
    'Commercial and precision grades differ in tolerances by two to four times; pay for the grade the system needs.'
  ],
  pitfalls: [
    'The focal length of a lens is measured from its back surface — The effective focal length is measured from the principal plane; the distance from the back surface is the back focal length, shorter by about CT/n for a plano-convex lens.',
    'A lens used outside its coating band loses nothing — Outside the band the coating can reflect more than bare glass; read the reflectance plot.',
    'Scratch–dig 60-40 means 60 scratches and 40 digs — The numbers are grades: the scratch grade is a visual comparison with standard scratches, and the dig number is the diameter in hundredths of a millimetre.',
    'The focal length is the same at all wavelengths — It is quoted at the design wavelength; at 1064 nm an N-BK7 lens is about 2 % longer than at 587.6 nm.'
  ],
  terms: [
    { term: 'Effective focal length', also: ['EFL', 'f'], def: 'The distance from the rear principal plane to the focus for light from a distant object, at the design wavelength.' },
    { term: 'Back focal length', also: ['BFL', 'back focal distance'], def: 'The distance from the last surface of the lens to the focus. Shorter than the effective focal length for a thick positive lens.' },
    { term: 'Centre thickness', also: ['CT'], def: 'The thickness of a lens on its axis; with the edge thickness it fixes the shape and the strength of the lens.' },
    { term: 'Edge thickness', also: ['ET'], def: 'The thickness of a lens at its rim, measured parallel to the axis.' },
    { term: 'Clear aperture', also: ['CA'], def: 'The central part of a surface that meets the specification, usually at least 90 % of the diameter. Rays beyond it may be vignetted or unspecified.' },
    { term: 'Design wavelength', also: ['reference wavelength'], def: 'The wavelength at which the focal length and other quantities in a catalogue entry are specified, often 587.6 nm, 546 nm or 633 nm.' },
    { term: 'Centration', also: ['wedge angle of a lens', 'beam deviation'], def: 'How well the optical axis of a lens coincides with its mechanical axis, given as the angle by which a beam along the mechanical axis is deviated.' }
  ],
  formulas: [
    {
      name: 'Back focal length of a plano-convex lens',
      expr: 'bfl = f - ct/n', tex: '\\mathrm{BFL} = f - \\frac{\\mathrm{CT}}{n}',
      vars: {
        bfl: { name: 'back focal length', q: 'length', unit: 'mm', tex: '\\mathrm{BFL}' },
        f: { name: 'effective focal length', q: 'length', unit: 'mm', value: 50 },
        ct: { name: 'centre thickness', q: 'length', unit: 'mm', value: 5.3, tex: '\\mathrm{CT}' },
        n: { name: 'refractive index', value: 1.5168, min: 1.05, max: 5 }
      },
      note: 'Curved face towards the long conjugate (the object at infinity); the flat face is the last surface.',
      stories: { bfl: 'A plano-convex lens of focal length {f}, centre thickness {ct} and index {n} is used with the curved side first. What is its back focal length?' }
    },
    {
      name: 'Edge thickness of a plano-convex lens',
      expr: 'et = ct - (R - sqrt(R^2 - (D/2)^2))', tex: '\\mathrm{ET} = \\mathrm{CT} - \\left(R - \\sqrt{R^2 - (D/2)^2}\\right)',
      vars: {
        et: { name: 'edge thickness', q: 'length', unit: 'mm', tex: '\\mathrm{ET}' },
        ct: { name: 'centre thickness', q: 'length', unit: 'mm', value: 5.3, tex: '\\mathrm{CT}' },
        R: { name: 'radius of the curved face', q: 'length', unit: 'mm', value: 25.84 },
        D: { name: 'diameter', q: 'length', unit: 'mm', value: 25.4 }
      },
      note: 'The sag of the curved face at the rim is subtracted from the centre thickness.',
      stories: { et: 'A plano-convex lens of diameter {D}, with the curved face of radius {R} and a centre thickness of {ct}. How thick is its rim?' }
    },
    {
      name: 'Focal length at another wavelength',
      expr: 'f2 = f1*(n1 - 1)/(n2 - 1)', tex: 'f_2 = f_1\\,\\frac{n_1 - 1}{n_2 - 1}',
      vars: {
        f2: { name: 'focal length at the second wavelength', q: 'length', unit: 'mm', tex: 'f_2' },
        f1: { name: 'focal length at the design wavelength', q: 'length', unit: 'mm', value: 50, tex: 'f_1' },
        n1: { name: 'index at the design wavelength', value: 1.5168, min: 1.05, max: 5, tex: 'n_1' },
        n2: { name: 'index at the other wavelength', value: 1.5066, min: 1.05, max: 5, tex: 'n_2' }
      },
      note: 'For a thin lens, f is proportional to 1/(n − 1). N-BK7: 1.5168 at 587.6 nm, 1.5066 at 1064 nm.',
      stories: { f2: 'A lens with f = {f1} where the index is {n1} is used where the index is {n2}. What is its focal length there?' }
    },
    {
      name: 'Numerical aperture from the diameter and the focal length',
      expr: 'NA = D/(2*f)', tex: '\\mathrm{NA} \\approx \\frac{D}{2f}',
      vars: {
        NA: { name: 'numerical aperture (image side)', tex: '\\mathrm{NA}' },
        D: { name: 'diameter of the beam the lens accepts', q: 'length', unit: 'mm', value: 25.4 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 50 }
      },
      note: 'Small-angle form, good below about NA 0.3. The f-number is f/D.',
      stories: { NA: 'A lens of {f} focal length accepts a beam of {D} diameter. What is its numerical aperture?' }
    }
  ],
  examples: [
    {
      title: 'Check a catalogue line',
      q: 'A catalogue lists a plano-convex N-BK7 lens, Ø25.4 mm, EFL 50.0 mm, CT 5.3 mm, ET 2.0 mm, BFL 46.5 mm. Are the numbers consistent?',
      steps: [
        { text: 'Radius of the curved face:', tex: 'R = f(n-1) = 50 \\times 0.5168 = 25.84\\ \\mathrm{mm}' },
        { text: 'Sag at the rim and the edge thickness:', tex: 's = 25.84 - \\sqrt{25.84^2 - 12.7^2} = 3.34\\ \\mathrm{mm}, \\quad \\mathrm{ET} = 5.3 - 3.34 = 1.96\\ \\mathrm{mm}' },
        { text: 'Back focal length:', tex: '\\mathrm{BFL} = 50 - \\frac{5.3}{1.5168} = 46.5\\ \\mathrm{mm}' }
      ],
      a: 'Consistent: ET is 2.0 mm and BFL 46.5 mm. If a line did not agree with its own shape, one of the numbers is for a different design wavelength or a different version of the part.'
    },
    {
      title: 'A lens at a laser wavelength',
      q: 'The 50.0 mm N-BK7 lens above is specified at 587.6 nm. Where does it focus a 1064 nm laser beam?',
      steps: [
        { text: 'With $n(1064) = 1.5066$:', tex: 'f = 50.0 \\times \\frac{0.5168}{0.5066} = 51.0\\ \\mathrm{mm}' }
      ],
      a: '51.0 mm, 1 mm farther than at the design wavelength. For a tight focus or a long beam path that matters.'
    }
  ],
  quiz: [
    { q: 'What does “CT 5.3 mm” mean on a lens listing?', choices: ['Clear thickness', 'Centre thickness, measured on the axis', 'Coating thickness', 'Cemented thickness'], a: 1, why: 'CT is the centre thickness, on the optical axis; ET is the thickness at the edge.' },
    { q: 'A plano-convex lens of f = 100 mm has CT 6 mm and index 1.5. Its back focal length with the curved side first is…', choices: ['100 mm', '96 mm', '94 mm', '106 mm'], a: 2, why: '$\\mathrm{BFL} = f - \\mathrm{CT}/n = 100 - 6/1.5 = 96$ mm.' },
    { q: 'A scratch–dig of 60-40 means that the lens has 60 scratches and 40 digs.', a: false, why: 'The numbers are grades: scratches are graded by visual comparison with standards (60), and the dig number is the diameter in hundredths of a millimetre (0.40 mm).' },
    { q: 'An N-BK7 lens has f = 50.0 mm at 587.6 nm ($n = 1.5168$). What is its focal length, in millimetres, at 1064 nm ($n = 1.5066$)?', answer: 51.0, unit: 'mm', why: '$f_2 = f_1 (n_1-1)/(n_2-1) = 50 \\times 0.5168/0.5066 = 51.0$ mm.' },
    { q: 'A lens of focal length 80 mm and diameter 25 mm. Its f-number is about…', choices: ['f/0.3', 'f/3.2', 'f/32', 'f/80'], a: 1, why: '$N = f/D = 80/25 = 3.2$.' }
  ],
  applications: [
    'Choosing lenses and windows for a laser system: checking diameter, focal length, coating band and damage threshold against the design.',
    'Specifying a replacement: reading a worn or unlabelled part’s dimensions against a catalogue.',
    'Costing: understanding why a precision grade or a laser coating changes the price.',
    'Machine vision: matching a lens datasheet to a sensor and a mount ([[reading-a-lens-datasheet]]).',
    'Teaching labs: working out focal length and thickness from the shape of the lens.'
  ],
  history: 'The scratch–dig convention comes from a US military specification for fire-control optics, MIL-O-13830; its later revision, MIL-PRF-13830B, is still quoted to describe the surface of optics bought for lasers and instruments.',
  sources: [
    'W. J. Smith, *Modern Optical Engineering* — optical specifications and tolerances.',
    'ISO 10110, *Optics and photonics — Preparation of drawings for optical elements and systems* — the international way to state tolerances.',
    'MIL-PRF-13830B — the scratch–dig convention for surface quality.'
  ],
  sim: 'oc-catalogue'
}

);
