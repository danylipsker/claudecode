/* HYPER-PHYSICS · content/wave-optics.js — light as a wave: Huygens' principle, interference,
 * diffraction, resolving power and polarization. */
Hyper.add(

{
  id: 'huygens-principle', parent: 'wave-optics', title: 'Huygens\' principle', level: 2,
  short: 'Every point on a wavefront acts as a source of little spherical wavelets; the surface they all touch a moment later is the new wavefront.',
  keywords: ['Huygens', 'Huygens–Fresnel principle', 'wavefront', 'wavelet', 'secondary sources', 'diffraction', 'wave optics', 'envelope', 'ray'],
  prereq: ['wave-properties', 'superposition', 'refraction'],
  related: ['double-slit', 'single-slit-diffraction', 'reflection'],
  body: `
Drop a pebble in a pond and a circle of ripples spreads out. A **wavefront** is a surface joining points in step with each other — a crest, for instance — and a [[reflection|ray]] is simply a line drawn perpendicular to the wavefronts, showing which way they move.

### The construction
In 1678 Christiaan Huygens proposed a way to find where a wavefront will be next. Treat **every point of the present wavefront as a small source** sending out a spherical *wavelet* at the wave speed $v$. After a time $t$ each wavelet has radius $vt$, and the new wavefront is the surface that touches all of them — their **envelope**.

- A plane wavefront produces a plane wavefront a distance $vt$ further on: light goes straight.
- A spherical front stays spherical and grows: light spreads from a point source.
- Where the wave enters a slower medium the wavelets there are smaller, so the front tilts: that is [[refraction]], and the construction gives Snell's law in the form $\\sin\\theta_1/v_1 = \\sin\\theta_2/v_2$.
- At the edge of an obstacle, the wavelets from the last unobstructed points spread into the shadow: that is **diffraction**.

### Fresnel's addition
Huygens' wavelets explain *where* the front goes but not how bright it is, and they also predict a backward wave that is never seen. In 1818 Augustin Fresnel repaired both by letting the wavelets **interfere**: each carries a phase, and at any point you add them all up. Along the envelope they arrive in step and reinforce; elsewhere they cancel. Fresnel also gave each wavelet a strength that falls off away from the forward direction. With these additions — the **Huygens–Fresnel principle**, later put on a firm mathematical footing by Kirchhoff — the same construction predicts the fringes of the [[double-slit|double slit]], the patterns of [[single-slit-diffraction|single slits]] and the bright spot in the middle of a round shadow.

### When are rays good enough?
Diffraction spreads a beam passing through an opening of width $a$ by an angle of order $\\lambda/a$. For light ($\\lambda \\approx 0.5\\ \\mu\\mathrm{m}$) through a 1 mm hole that is about 0.03° — invisible in everyday life, so [[reflection|geometric optics]] works. For sound ($\\lambda \\approx 0.7$ m) through a 0.9 m doorway the angle is huge: you hear round corners but cannot see round them.

> [!key] The wavelets are a way of calculating, not objects you could detect one by one. Only their sum — the new wavefront — is physical.
`,
  ideas: [
    'Every point on a wavefront can be treated as a source of secondary wavelets.',
    'The new wavefront is the envelope of the wavelets; rays are perpendicular to wavefronts.',
    'The construction explains straight-line travel, reflection, refraction and diffraction.',
    'Fresnel added interference between wavelets, which gives brightness and fringe patterns.',
    'Diffraction spreads a wave by an angle of about λ/a, so it matters when openings are a few wavelengths across.'
  ],
  pitfalls: [
    'The wavelets are real little waves — They are a calculating device; only their superposition is observed.',
    'Diffraction happens only at tiny openings — It happens at every edge. It is merely too small to notice when the opening is much larger than the wavelength.',
    'Huygens\' construction alone explains interference fringes — Fringes need Fresnel\'s addition: the wavelets\' phases must be added.'
  ],
  derivation: {
    title: 'The law of reflection from wavelets',
    steps: [
      { text: 'A plane wavefront AB approaches a mirror at angle $\\theta_i$. End A touches the mirror first; end B still has to travel a distance $BD = vt$ to reach the mirror at D.' },
      { text: 'During that time the wavelet from A grows to radius $AE = vt$. The reflected wavefront is the line from D tangent to that wavelet, touching it at E.' },
      { text: 'The right-angled triangles ABD and DEA share the hypotenuse AD and have the equal sides BD = AE = vt, so they are congruent:', tex: '\\sin\\theta_i = \\frac{BD}{AD} = \\frac{vt}{AD} = \\frac{AE}{AD} = \\sin\\theta_r' },
      { text: 'Hence the angle of reflection equals the angle of incidence. With different speeds on the two sides the same argument gives Snell\'s law instead.', tex: '\\theta_r = \\theta_i' }
    ]
  },
  formulas: [
    {
      name: 'Spreading angle of a wave through an opening (estimate)',
      expr: 'theta = lambda/a', tex: '\\theta \\approx \\frac{\\lambda}{a}',
      vars: {
        theta: { name: 'typical spreading angle', q: 'angle', unit: '°' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550 },
        a: { name: 'width of the opening', q: 'length', unit: 'mm', value: 1 }
      },
      note: 'An order-of-magnitude estimate for small angles; the exact positions of dark fringes come from the slit and aperture formulas.',
      stories: { theta: 'Light of wavelength {lambda} passes through a gap {a} wide. Roughly by what angle does it spread?' }
    },
    {
      name: 'Refraction from wavelets',
      expr: 'sin(theta1)/v1 = sin(theta2)/v2', tex: '\\frac{\\sin\\theta_1}{v_1} = \\frac{\\sin\\theta_2}{v_2}', solveFor: 'theta2',
      vars: {
        theta1: { name: 'angle of incidence', q: 'angle', unit: '°', value: 40, min: 0, max: 90, tex: '\\theta_1' },
        v1: { name: 'wave speed in the first medium', q: 'speed', unit: 'm/s', value: 3.00e8, tex: 'v_1' },
        theta2: { name: 'angle of refraction', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\theta_2' },
        v2: { name: 'wave speed in the second medium', q: 'speed', unit: 'm/s', value: 2.25e8, tex: 'v_2' }
      },
      note: 'The same as Snell\'s law, since $v = c/n$. It holds for every kind of wave — sound and water waves refract too.',
      stories: { theta2: 'A wave travelling at {v1} meets a medium where it travels at {v2}, at {theta1} from the normal. At what angle does it continue?' }
    }
  ],
  examples: [
    {
      title: 'Why you hear round corners but do not see round them',
      q: 'Speech at 500 Hz ($\\lambda \\approx 0.69$ m) and green light ($\\lambda = 550$ nm) both pass through a doorway 0.9 m wide. Compare how much each spreads.',
      steps: [
        'Sound: $\\lambda/a = 0.69/0.9 \\approx 0.8$ rad — the wave fans out through tens of degrees and fills the next room.',
        'Light: $\\lambda/a = 550\\times10^{-9}/0.9 \\approx 6\\times10^{-7}$ rad — about a ten-thousandth of a degree.',
        'The same physics, a million-fold difference in wavelength: sound behaves like a wave at doorways, light like a ray.'
      ],
      a: 'Sound spreads by a large angle (about 0.8 rad); light by less than a millionth of a radian.'
    },
    {
      title: 'Wavefronts entering glass',
      q: 'Light of vacuum wavelength 600 nm strikes glass ($n = 1.5$) at 40°. Use the wavelet picture to find the direction and wavelength inside.',
      steps: [
        'Inside the glass the wavelets travel at $v = c/1.5 = 2.0\\times10^8$ m/s, so in one period each grows by $\\lambda/n = 400$ nm instead of 600 nm.',
        'The front pivots so that consecutive crests still meet the surface at the same points: $\\sin\\theta_2 = \\sin 40° \\times 400/600 = 0.428$.',
        '$\\theta_2 = 25.4°$, and the crests are 400 nm apart inside the glass.'
      ],
      a: 'Refracted at 25.4°, with a wavelength of 400 nm in the glass.'
    }
  ],
  quiz: [
    { q: 'In Huygens\' construction, the new wavefront is…', choices: ['the wavelet from the centre of the old front', 'the envelope that touches all the wavelets', 'the sum of all the rays', 'always a plane'], a: 1,
      why: 'Each point sends out a wavelet; the surface tangent to all of them is where the disturbance has reached.' },
    { q: 'Why does sound bend round a doorway much more than light does?', choices: ['Sound travels more slowly', 'Sound is a longitudinal wave', 'Its wavelength is comparable to the doorway', 'Light travels in straight lines by nature'], a: 2,
      why: 'Spreading is set by $\\lambda/a$. Sound wavelengths are tens of centimetres to metres; light\'s is a millionth of that.' },
    { q: 'When a wavefront enters a medium where the wave is slower, the wavelets drawn there are…', choices: ['larger, so the front bends away from the normal', 'smaller, so the front bends towards the normal', 'the same size', 'not formed at all'], a: 1,
      why: 'In the same time a slower wave travels less far, so the wavelets are smaller and the front swings towards the normal.' },
    { q: 'Huygens\' original construction, without Fresnel\'s addition of phases, predicts the dark fringes of a double slit.', a: false,
      why: 'Dark fringes come from wavelets cancelling, which requires adding them with their phases — Fresnel\'s contribution.' }
  ],
  applications: [
    'Designing antenna arrays and phased-array radar, which steer waves by timing many sources.',
    'Understanding how sea waves bend round headlands and into harbours.',
    'The basis of every calculation of diffraction and interference in optics.'
  ],
  history: 'Christiaan Huygens presented his wavelet construction in 1678 and published it in 1690. Augustin Fresnel added interference in 1818; his prediction of a bright spot at the centre of a round shadow, confirmed by Arago, helped convince doubters that light is a wave.'
},

{
  id: 'double-slit', parent: 'wave-optics', title: 'Young\'s double slit', level: 2,
  short: 'Light through two narrow slits makes a row of bright and dark fringes — the experiment that proved light is a wave and measured its wavelength.',
  keywords: ['Young', 'double slit', 'two-slit', 'interference', 'fringes', 'path difference', 'coherent', 'coherence', 'fringe spacing', 'constructive', 'destructive', 'wavelength measurement'],
  prereq: ['superposition', 'huygens-principle', 'math:right-triangle-trig'],
  related: ['single-slit-diffraction', 'diffraction-grating', 'thin-film-interference', 'wave-particle-duality'],
  body: `
Shine a laser at two narrow parallel slits a fraction of a millimetre apart, and on a wall a few metres away you see not two bright lines but a whole row of evenly spaced **fringes**. Light plus light can make darkness. Only waves do that.

### Path difference
Each slit acts as a source of waves in step with the other. To reach a point on the screen at angle $\\theta$ from the centre, the wave from the far slit travels an extra distance

$$\\Delta = d\\sin\\theta$$

where $d$ is the slit separation. If $\\Delta$ is a whole number of wavelengths the crests arrive together — **constructive** interference, a bright fringe:

$$d\\sin\\theta = m\\lambda, \\qquad m = 0, \\pm1, \\pm2, \\ldots$$

If it is a whole number plus a half, crest meets trough and the waves cancel — a dark fringe at $d\\sin\\theta = (m + \\tfrac12)\\lambda$.

### Fringe spacing
The angles are tiny, so on a screen a distance $L$ away the bright fringes are at $y_m = m\\lambda L/d$ and are evenly spaced by

$$\\Delta y = \\frac{\\lambda L}{d}$$

With a red helium–neon laser (633 nm), slits 0.25 mm apart and a screen 2 m away, $\\Delta y = 5.1$ mm — easy to measure with a ruler. That is how a length of a few hundred nanometres is measured with everyday tools: the geometry magnifies it by $L/d = 8000$.

### Intensity
For very narrow slits the brightness varies smoothly as

$$I = I_0\\cos^2\\left(\\frac{\\pi d\\sin\\theta}{\\lambda}\\right)$$

where $I_0$ is **four times** the intensity from one slit alone — amplitudes add, and intensity goes as amplitude squared. Averaged over the fringes the light is just twice that of one slit: energy is not destroyed at the dark fringes, it is moved to the bright ones. Real slits have a width $a$, so this pattern is multiplied by the broad [[single-slit-diffraction|single-slit]] envelope, which dims the fringes further out.

### Coherence
Two separate lamps, one behind each slit, give no fringes: their phases wander randomly and the pattern shifts a billion times a second. The two waves must come from the **same** source. Young used sunlight through a pinhole; a laser makes it easy. In white light the central fringe is white, and the others are coloured — blue on the inside, red on the outside — because each wavelength has its own spacing.

> [!fact] Send the light through so weakly that only one photon is in the apparatus at a time and the fringes still build up, dot by dot. The same happens with electrons: see [[wave-particle-duality]].
`,
  ideas: [
    'Bright fringes appear where the path difference d sin θ is a whole number of wavelengths.',
    'Dark fringes appear where the path difference is a whole number plus half a wavelength.',
    'The fringe spacing λL/d grows with wavelength and screen distance and shrinks as the slits move apart.',
    'The two waves must be coherent — from one source — for a steady pattern.',
    'Energy is redistributed: the bright fringes are four times one slit\'s intensity, the dark ones zero.'
  ],
  pitfalls: [
    'Dark fringes mean light is destroyed — Energy moves from the dark fringes to the bright ones; the average over the pattern is exactly the sum of the two slits.',
    'y = mλL/d holds at any angle — It uses the small-angle approximation. At large angles use d sin θ = mλ and y = L tan θ.',
    'Wider slits give wider fringe spacing — The spacing depends on the separation d; the slit width only sets the envelope that dims the outer fringes.'
  ],
  formulas: [
    {
      name: 'Bright fringes',
      expr: 'd*sin(theta) = m*lambda', tex: 'd\\sin\\theta = m\\lambda', solveFor: 'theta',
      vars: {
        d: { name: 'slit separation', q: 'length', unit: 'mm', value: 0.25 },
        theta: { name: 'angle of the fringe from the centre', q: 'angle', unit: '°', min: 0, max: 90 },
        m: { name: 'order of the fringe', q: 'count', int: true, value: 1 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 633 }
      },
      practice: { unknowns: ['theta', 'lambda', 'd'] },
      stories: {
        theta: 'Light of wavelength {lambda} falls on two slits {d} apart. At what angle is the bright fringe of order {m}?',
        lambda: 'The bright fringe of order {m} from slits {d} apart appears at {theta}. What is the wavelength?'
      }
    },
    {
      name: 'Fringe spacing on a distant screen',
      expr: 'dy = lambda*L/d', tex: '\\Delta y = \\frac{\\lambda L}{d}',
      vars: {
        dy: { name: 'distance between neighbouring bright fringes', q: 'length', unit: 'mm', tex: '\\Delta y' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 633 },
        L: { name: 'distance from slits to screen', q: 'length', unit: 'm', value: 2 },
        d: { name: 'slit separation', q: 'length', unit: 'mm', value: 0.25 }
      },
      note: 'Small angles only ($\\Delta y \\ll L$).',
      stories: {
        dy: 'A {lambda} laser shines on two slits {d} apart, with a screen {L} away. How far apart are the fringes?',
        lambda: 'Fringes {dy} apart are seen on a screen {L} from two slits {d} apart. What is the wavelength of the light?',
        d: 'How far apart must two slits be to give fringes {dy} apart with {lambda} light on a screen {L} away?'
      }
    },
    {
      name: 'Intensity across the pattern (narrow slits)',
      expr: 'I = I0*cos(pi*d*y/(lambda*L))^2', tex: 'I = I_0\\cos^2\\left(\\frac{\\pi d\\, y}{\\lambda L}\\right)', solveFor: 'I',
      vars: {
        I: { name: 'intensity at position y', q: 'intensity', unit: 'W/m²' },
        I0: { name: 'intensity of the central fringe', q: 'intensity', unit: 'W/m²', value: 4, tex: 'I_0' },
        d: { name: 'slit separation', q: 'length', unit: 'mm', value: 0.25 },
        y: { name: 'distance from the centre of the pattern', q: 'length', unit: 'mm', value: 1, signed: true },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 633 },
        L: { name: 'distance to the screen', q: 'length', unit: 'm', value: 2 }
      },
      note: 'Uses $\\sin\\theta \\approx y/L$. Solving backwards for a distance gives the value within the first half-fringe; others repeat every $\\lambda L/d$.',
      practice: { unknowns: ['I'] }
    }
  ],
  examples: [
    {
      title: 'Measuring the wavelength of a laser',
      q: 'A laser shines through slits 0.20 mm apart onto a wall 1.50 m away. Eleven bright fringes (ten spacings) span 47.5 mm. What is the wavelength?',
      steps: [
        'Fringe spacing: $\\Delta y = 47.5/10 = 4.75\\ \\mathrm{mm}$. Measuring across many fringes reduces the error.',
        'Rearrange $\\Delta y = \\lambda L/d$: $\\lambda = \\dfrac{\\Delta y\\, d}{L} = \\dfrac{4.75\\times10^{-3} \\times 0.20\\times10^{-3}}{1.50}$.',
        '$\\lambda = 6.33\\times10^{-7}\\ \\mathrm{m} = 633\\ \\mathrm{nm}$ — a helium–neon laser.'
      ],
      a: '633 nm'
    },
    {
      title: 'The experiment under water',
      q: 'The apparatus that gives 5.06 mm fringes in air is filled with water ($n = 1.33$). What is the new spacing?',
      steps: [
        'In water the wavelength is $\\lambda/n$; the frequency, and so the colour, is unchanged.',
        'All other dimensions are the same, so the spacing falls by the same factor: $5.06/1.33 = 3.80\\ \\mathrm{mm}$.'
      ],
      a: 'About 3.8 mm.'
    }
  ],
  quiz: [
    { q: 'You move the two slits farther apart. The fringes…', choices: ['spread farther apart', 'move closer together', 'stay the same', 'disappear'], a: 1, why: '$\\Delta y = \\lambda L/d$: a larger $d$ gives a smaller spacing.' },
    { q: 'Red laser light is replaced by blue. The fringes…', choices: ['move farther apart', 'move closer together', 'do not change', 'become white'], a: 1, why: 'Blue light has a shorter wavelength, and the spacing is proportional to λ.' },
    { q: 'At the centre of a dark fringe, the path difference between the two waves is…', choices: ['zero', 'a whole number of wavelengths', 'a whole number plus half a wavelength', 'exactly one wavelength'], a: 2,
      why: 'Half a wavelength out of step puts a crest on a trough, and the two cancel.' },
    { q: 'One slit is covered. What happens to the pattern?', choices: ['Nothing changes', 'The fringes vanish and a broad band of light remains', 'The screen goes completely dark', 'The fringes become twice as bright'], a: 1,
      why: 'With one slit there is nothing to interfere with; only the single-slit diffraction band is left.' },
    { q: 'Two separate light bulbs, one behind each slit, produce the same fringes as a single source.', a: false,
      why: 'Independent sources have randomly changing phases, so any pattern shifts too fast to see. The waves must be coherent.' }
  ],
  applications: [
    'Measuring wavelengths of light, historically the first such measurement.',
    'Interferometers that measure distances to a fraction of a wavelength, from machine shops to gravitational-wave detectors.',
    'Demonstrating wave–particle duality with single photons, electrons and even large molecules.'
  ],
  history: 'Thomas Young described interference of light between 1801 and 1803 and used it to estimate wavelengths. His wave theory was coolly received in Britain until Fresnel\'s work in France made it compelling.',
  sim: 'light-double-slit'
},

{
  id: 'thin-film-interference', parent: 'wave-optics', title: 'Thin-film interference', level: 3,
  short: 'Light reflected from the top and bottom of a very thin layer interferes, giving soap bubbles and oil films their colours and letting coatings cancel unwanted reflections.',
  keywords: ['thin film', 'soap bubble', 'oil slick', 'anti-reflection coating', 'quarter-wave', 'phase change on reflection', 'iridescence', 'Newton\'s rings', 'optical path difference', 'structural colour'],
  prereq: ['double-slit', 'refraction', 'wave-reflection'],
  related: ['reflection', 'color-vision'],
  body: `
A soap bubble is clear soapy water, and an oil film on a wet road is clear oil, yet both shimmer with colour. The colours come from **interference** between two reflections: one from the front surface of the film and one from the back.

### Two reflected waves
Take a film of thickness $t$ and index $n$, lit almost head-on. The wave reflected from the back surface travels an extra $2t$ inside the film, where its wavelength is $\\lambda/n$. Measured in wavelengths, the extra path is the **optical path difference**

$$\\Delta = 2nt$$

### The phase flip
There is one more ingredient. When light reflects off a medium with a **higher** refractive index it is flipped — its phase jumps by half a cycle, exactly like a pulse on a rope reflecting from a fixed end. Reflecting off a **lower** index, there is no flip, like a free end. For a soap film in air the front reflection (air → water) flips and the back reflection (water → air) does not, so the two waves start half a wavelength out of step. With **one** flip the conditions are

$$\\text{bright: } 2nt = \\left(m + \\tfrac12\\right)\\lambda, \\qquad \\text{dark: } 2nt = m\\lambda$$

With zero or two flips the two conditions swap.

### Colours
White light contains every wavelength; for a given thickness a few are reinforced and others cancelled, so the reflection is coloured. As a soap film drains it thins at the top, so the colours form horizontal bands that slide downwards. Just before it bursts, the top turns **black**: when $t \\ll \\lambda$ the path difference is negligible and the single phase flip cancels every colour. The film is still there, just too thin to reflect.

### Anti-reflection coatings
A camera lens coated with magnesium fluoride ($n = 1.38$) on glass ($n = 1.52$) has flips at both surfaces, so they cancel out and the condition for darkness is $2nt = \\tfrac12\\lambda$: a **quarter-wave** layer,

$$t = \\frac{\\lambda}{4n}$$

— about 100 nm for green light. The cancellation is complete only if both reflections are equally strong, which needs $n_\\text{coat} = \\sqrt{n_\\text{glass}} \\approx 1.23$; magnesium fluoride is close enough to cut the reflection from 4% to about 1.3%. The reflected light that remains is the red and blue ends of the spectrum, which is why coated lenses look purple. The energy that is not reflected is **transmitted**, so coatings brighten images as well as removing glare.

> [!note] Why no colours in a window pane? Its thickness is millions of wavelengths, so neighbouring wavelengths alternate between bright and dark every fraction of a nanometre, and the eye averages them to white.
`,
  ideas: [
    'Two reflections, from the front and back of a film, interfere; the extra optical path is 2nt at near-normal incidence.',
    'Reflection off a higher index flips the phase by half a cycle; off a lower index it does not.',
    'With one flip, bright reflection needs 2nt = (m + ½)λ; with none or two, 2nt = mλ.',
    'A quarter-wave coating (t = λ/4n) cancels reflection and sends the light through instead.'
  ],
  pitfalls: [
    'Forgetting the phase flips — Count them at each surface: they decide whether a given thickness looks bright or dark.',
    'Using the vacuum wavelength for the path inside the film — Inside the film the wavelength is λ/n; that is why the index appears in 2nt.',
    'An anti-reflection coating absorbs the reflected light — It removes the reflection by interference, and the energy goes into the transmitted beam.'
  ],
  formulas: [
    {
      name: 'Bright reflection with one phase flip (e.g. soap film in air)',
      expr: '2*n*t = (m + 0.5)*lambda', tex: '2nt = \\left(m + \\tfrac12\\right)\\lambda', solveFor: 'lambda',
      vars: {
        n: { name: 'refractive index of the film', value: 1.33 },
        t: { name: 'film thickness', q: 'length', unit: 'nm', value: 300 },
        m: { name: 'order (0, 1, 2, …)', q: 'count', int: true, value: 1 },
        lambda: { name: 'wavelength reflected most strongly', q: 'length', unit: 'nm' }
      },
      note: 'Near-normal incidence. At an angle, replace $t$ by $t\\cos\\theta_t$, where $\\theta_t$ is the angle inside the film.',
      practice: { unknowns: ['lambda', 't'] },
      stories: {
        lambda: 'A soap film of index {n} is {t} thick. Which wavelength does it reflect most strongly in order m = {m}?',
        t: 'What is the thinnest soap film (index {n}) that reflects {lambda} light strongly, in order m = {m}?'
      }
    },
    {
      name: 'Quarter-wave anti-reflection coating',
      expr: 't = lambda/(4*n)', tex: 't = \\frac{\\lambda}{4n}',
      vars: {
        t: { name: 'coating thickness', q: 'length', unit: 'nm' },
        lambda: { name: 'design wavelength (in vacuum)', q: 'length', unit: 'nm', value: 550 },
        n: { name: 'refractive index of the coating', value: 1.38 }
      },
      note: 'For a coating whose index lies between that of air and the glass, so both reflections flip.',
      stories: { t: 'How thick must a coating of index {n} be to cancel the reflection of {lambda} light?' }
    },
    {
      name: 'Ideal coating index',
      expr: 'n = sqrt(n0*ns)', tex: 'n = \\sqrt{n_0 n_s}',
      vars: {
        n: { name: 'ideal refractive index of the coating' },
        n0: { name: 'index of the surrounding medium', value: 1.00, tex: 'n_0' },
        ns: { name: 'index of the substrate (glass)', value: 1.52, tex: 'n_s' }
      },
      note: 'Makes the two reflections equally strong so that they cancel completely.'
    }
  ],
  examples: [
    {
      title: 'The colour of a soap film',
      q: 'A soap film ($n = 1.33$) is 300 nm thick. Which visible wavelengths does it reflect strongly, and which does it suppress?',
      steps: [
        'Optical path difference: $2nt = 2 \\times 1.33 \\times 300 = 798\\ \\mathrm{nm}$. There is one phase flip (at the front surface).',
        'Bright when $798 = (m + \\tfrac12)\\lambda$: $m = 0$ gives 1596 nm (infrared), $m = 1$ gives 532 nm (green), $m = 2$ gives 319 nm (ultraviolet).',
        'Dark when $798 = m\\lambda$: $m = 1$ gives 798 nm (just beyond red), $m = 2$ gives 399 nm (violet).',
        'Only green is strongly reflected in the visible range, so the film looks green.'
      ],
      a: 'It reflects 532 nm green strongly and suppresses deep red and violet: the film looks green.'
    },
    {
      title: 'Coating a camera lens',
      q: 'What thickness of magnesium fluoride ($n = 1.38$) minimises the reflection of 550 nm light from a glass lens? What would the ideal coating index be for glass of $n = 1.52$?',
      steps: [
        'Both surfaces flip the phase (air → coating → glass, each time into a higher index), so the flips cancel.',
        'Darkness needs $2nt = \\tfrac12\\lambda$, so $t = \\dfrac{\\lambda}{4n} = \\dfrac{550}{4 \\times 1.38} = 99.6\\ \\mathrm{nm}$.',
        'Ideal index: $\\sqrt{1.00 \\times 1.52} = 1.23$. Few durable materials are that low, so MgF₂ is a good compromise.'
      ],
      a: 'About 100 nm; the ideal index would be 1.23.'
    }
  ],
  quiz: [
    { q: 'Just before a soap film bursts, its top looks black. Why?', choices: ['The soap has evaporated', 'The film is so thin that the two reflections cancel because of the phase flip', 'Black is the colour of pure water', 'All the light is absorbed'], a: 1,
      why: 'With $t \\to 0$ the path difference vanishes, leaving only the half-cycle flip at the front surface: destructive for every wavelength.' },
    { q: 'For a magnesium fluoride coating on glass, the phase flips on reflection occur at…', choices: ['neither surface', 'only the front surface', 'only the back surface', 'both surfaces'], a: 3,
      why: 'Air (1.00) → MgF₂ (1.38) and MgF₂ → glass (1.52) are both steps up in index, so both reflections flip.' },
    { q: 'What happens to the light that an anti-reflection coating stops from reflecting?', choices: ['It is absorbed as heat', 'It is transmitted into the lens', 'It is scattered sideways', 'It is destroyed by interference'], a: 1,
      why: 'Energy is conserved; interference redistributes it, and the reduced reflection means increased transmission.' },
    { q: 'An ordinary window pane shows thin-film colours in white light.', a: false,
      why: 'It is far too thick: bright and dark conditions alternate every tiny fraction of a nanometre in wavelength, and the eye averages them away.' }
  ],
  applications: [
    'Anti-reflection coatings on spectacles, camera lenses and solar cells.',
    'Dichroic mirrors and interference filters made of many thin layers, used in projectors and fluorescence microscopes.',
    'Structural colours in nature: morpho butterflies, peacock feathers and beetle shells.',
    'Measuring film thickness in chip manufacturing from the colour or spectrum of the reflection.'
  ]
},

{
  id: 'single-slit-diffraction', parent: 'wave-optics', title: 'Single-slit diffraction', level: 2,
  short: 'Light through one narrow slit spreads into a bright central band flanked by fainter ones; the narrower the slit, the wider the spread.',
  keywords: ['diffraction', 'single slit', 'central maximum', 'minima', 'dark fringes', 'sinc', 'Fraunhofer', 'slit width', 'spreading', 'Airy'],
  prereq: ['huygens-principle', 'double-slit', 'math:right-triangle-trig'],
  related: ['diffraction-grating', 'resolution', 'uncertainty-principle'],
  body: `
Narrow a slit to let less light through, and you might expect a thinner line on the screen. Down to about a tenth of a millimetre that is what happens — and then, as the slit keeps shrinking, the patch of light **widens**. That spreading is **diffraction**, and it is the reason no lens can focus light to an arbitrarily small spot.

### Where the dark fringes are
By [[huygens-principle|Huygens' principle]], every point across the slit (width $a$) sends out wavelets. Look in a direction $\\theta$ where the path difference between the two edges of the slit is exactly one wavelength, $a\\sin\\theta = \\lambda$. Split the slit into a top half and a bottom half: each wavelet in the top half has a partner in the bottom half $a/2$ further down, whose path differs by $\\lambda/2$. Every pair cancels, and the direction is **dark**. The same pairing works for any whole number of wavelengths:

$$a\\sin\\theta = m\\lambda, \\qquad m = \\pm1, \\pm2, \\ldots \\quad \\text{(dark)}$$

Note that $m = 0$ is excluded: straight ahead all the wavelets are in step and the centre is **bright**.

### The pattern
The central bright band stretches between the first dark fringes on either side, so on a screen a distance $L$ away it is

$$w = \\frac{2\\lambda L}{a}$$

wide — **twice** as wide as the fainter side bands. Adding the wavelets with their phases gives the whole intensity curve,

$$I = I_0\\left(\\frac{\\sin\\beta}{\\beta}\\right)^2, \\qquad \\beta = \\frac{\\pi a\\sin\\theta}{\\lambda}$$

The side maxima are weak: 4.7%, 1.6% and 0.8% of the centre. With a helium–neon laser (633 nm), a 0.10 mm slit and a screen 2 m away, the central band is 25 mm wide.

### Beyond slits
A round hole of diameter $D$ gives a central bright disc (the **Airy disc**) with the first dark ring at $\\sin\\theta = 1.22\\lambda/D$. That blur sets the sharpness limit of every telescope, camera and eye — see [[resolution]]. Real double slits show both effects at once: two-slit fringes under a single-slit envelope. And in quantum physics the same mathematics says that squeezing a particle through a narrow gap spreads its momentum, a version of the [[uncertainty-principle|uncertainty principle]].

> [!tip] In the simulation, halve the slit width and check that the angle of the first dark fringe doubles.
`,
  ideas: [
    'A slit narrower than about a hundred wavelengths visibly spreads light: narrower slits spread it more.',
    'Dark fringes appear where a sin θ = mλ with m = ±1, ±2, …; the centre is bright.',
    'The central band is twice as wide as the others and much brighter.',
    'A circular aperture gives an Airy disc with its first dark ring at sin θ = 1.22 λ/D.'
  ],
  pitfalls: [
    'a sin θ = mλ gives the bright fringes, as for two slits — For a single slit the same-looking formula gives the dark fringes.',
    'The central band is as wide as the side bands — It is twice as wide, stretching from the first dark fringe on one side to the first on the other.',
    'Mixing up the slit width a with the slit separation d — The width sets the diffraction envelope; the separation sets the interference fringes.'
  ],
  formulas: [
    {
      name: 'Dark fringes of a single slit',
      expr: 'a*sin(theta) = m*lambda', tex: 'a\\sin\\theta = m\\lambda', solveFor: 'theta',
      vars: {
        a: { name: 'slit width', q: 'length', unit: 'mm', value: 0.1 },
        theta: { name: 'angle of the dark fringe', q: 'angle', unit: '°', min: 0, max: 90 },
        m: { name: 'order of the dark fringe (1, 2, …)', q: 'count', int: true, value: 1 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 633 }
      },
      practice: { unknowns: ['theta', 'a', 'lambda'] },
      stories: {
        theta: 'Light of wavelength {lambda} passes a slit {a} wide. At what angle is dark fringe number {m}?',
        a: 'Dark fringe number {m} for {lambda} light appears at {theta}. How wide is the slit?'
      }
    },
    {
      name: 'Width of the central bright band',
      expr: 'w = 2*lambda*L/a',
      vars: {
        w: { name: 'width of the central band on the screen', q: 'length', unit: 'mm' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 633 },
        L: { name: 'distance to the screen', q: 'length', unit: 'm', value: 2 },
        a: { name: 'slit width', q: 'length', unit: 'mm', value: 0.1 }
      },
      note: 'Small angles. Doubling the slit width halves the band.',
      stories: {
        w: 'A {lambda} laser shines through a slit {a} wide onto a screen {L} away. How wide is the central bright band?',
        a: 'The central band of a single-slit pattern is {w} wide on a screen {L} away, with {lambda} light. How wide is the slit?'
      }
    }
  ],
  examples: [
    {
      title: 'How wide is the central band?',
      q: 'Red laser light (633 nm) passes through a slit 0.10 mm wide onto a wall 2.0 m away. Find the angle of the first dark fringe and the width of the central band.',
      steps: [
        '$\\sin\\theta_1 = \\lambda/a = 633\\times10^{-9}/1.0\\times10^{-4} = 6.33\\times10^{-3}$, so $\\theta_1 = 0.36°$.',
        'On the wall that is $y_1 = L\\tan\\theta_1 \\approx 2.0 \\times 6.33\\times10^{-3} = 12.7\\ \\mathrm{mm}$ from the centre.',
        'Central band: $w = 2y_1 = 25\\ \\mathrm{mm}$ — two hundred and fifty times wider than the slit.'
      ],
      a: 'θ₁ = 0.36°; the central band is about 25 mm wide.'
    },
    {
      title: 'Measuring a slit with a laser',
      q: 'With 532 nm light and a screen 1.2 m away, the first dark fringes are 6.0 mm either side of the centre. How wide is the slit?',
      steps: [
        '$\\sin\\theta_1 \\approx y_1/L = 6.0/1200 = 5.0\\times10^{-3}$.',
        '$a = \\lambda/\\sin\\theta_1 = 532\\times10^{-9}/5.0\\times10^{-3} = 1.06\\times10^{-4}\\ \\mathrm{m}$.'
      ],
      a: 'About 0.11 mm — the width of a human hair, which can be measured exactly this way.'
    }
  ],
  quiz: [
    { q: 'You make a single slit narrower. The diffraction pattern…', choices: ['gets narrower', 'gets wider', 'stays the same width but dimmer', 'splits into two'], a: 1, why: 'The first dark fringe is at $\\sin\\theta = \\lambda/a$: smaller $a$, larger angle.' },
    { q: 'Compared with each side band, the central bright band is…', choices: ['the same width', 'half as wide', 'twice as wide', 'four times as wide'], a: 2,
      why: 'It runs from $m = -1$ to $m = +1$, while each side band runs from one dark fringe to the next.' },
    { q: 'A slit is exactly one wavelength wide. Where is the first dark fringe?', choices: ['At 30°', 'At 45°', 'At 90°: the central band fills the whole half-space', 'There are many dark fringes close to the centre'], a: 2,
      why: '$\\sin\\theta = \\lambda/a = 1$ gives 90°. The slit behaves almost like a point source.' },
    { q: 'For a single slit, the condition $a\\sin\\theta = m\\lambda$ gives the positions of the bright fringes.', a: false,
      why: 'It gives the dark ones. The side bright fringes lie roughly halfway between them.' }
  ],
  applications: [
    'Measuring the thickness of hairs, fibres and wires from their diffraction patterns (a thin obstacle diffracts like a slit).',
    'Setting the limits of focusing in optical storage, lithography and laser cutting.',
    'Beam shaping and the design of spectrometer entrance slits.'
  ],
  sim: { id: 'light-diffraction', params: { mode: 'single' }, title: 'Single-slit diffraction' }
},

{
  id: 'diffraction-grating', parent: 'wave-optics', title: 'Diffraction grating', level: 2,
  short: 'Thousands of equally spaced slits turn the soft fringes of a double slit into razor-sharp lines and send each wavelength to its own angle — the heart of a spectrometer.',
  keywords: ['diffraction grating', 'grating equation', 'lines per mm', 'order', 'spectrum', 'spectrometer', 'resolving power', 'CD', 'DVD', 'spectroscopy'],
  prereq: ['double-slit', 'single-slit-diffraction'],
  related: ['dispersion', 'hydrogen-spectrum', 'stellar-spectra', 'resolution'],
  body: `
Tilt a CD under a lamp and it flashes rainbow colours. Its tracks are 1.6 µm apart, and together they act as a **diffraction grating**: a regular array of many slits (or grooves, or lines) with spacing $d$.

### The grating equation
Every slit sends light in step with its neighbours when the path difference between adjacent slits is a whole number of wavelengths — the same condition as for [[double-slit|two slits]]:

$$d\\sin\\theta = m\\lambda, \\qquad m = 0, \\pm1, \\pm2, \\ldots$$

Gratings are usually specified in lines per millimetre. A grating with 600 lines/mm has $d = 1/600\\ \\mathrm{mm} = 1.667\\ \\mu\\mathrm{m}$; green mercury light (546 nm) appears in first order at 19.1°. Since $\\sin\\theta \\le 1$, the highest order is the largest whole number below $d/\\lambda$ — three, here.

### Why the lines are sharp
With two slits the brightness falls off gradually either side of a maximum. With $N$ slits, moving just slightly away from a maximum makes the small phase differences between neighbours add up across the whole grating; once they total one full cycle, the $N$ waves cancel completely. The principal maxima are therefore about $N$ times narrower than two-slit fringes and $N^2$ times brighter than one slit, with only faint ripples between. A grating with a few thousand illuminated lines turns each wavelength into a thin bright line.

### Spectra
In white light the central order ($m = 0$) is white, and each other order is a **spectrum** with violet nearest the centre and red farthest out — the reverse of a [[dispersion|prism]], which bends violet most. Higher orders spread wider and overlap: the red end of the second order lands on top of the violet end of the third.

### Resolving power
Two wavelengths $\\lambda$ and $\\lambda + \\Delta\\lambda$ can be told apart when

$$R = \\frac{\\lambda}{\\Delta\\lambda} = mN$$

The yellow sodium doublet, 589.0 and 589.6 nm, needs $R \\approx 1000$: about a thousand illuminated lines in first order, or five hundred in second. A research grating 10 cm wide with 1200 lines/mm has $N = 120\\,000$ and can split lines a hundredth of that close.

Gratings, not prisms, are what astronomers use to read the [[stellar-spectra|spectra of stars]] and physicists to measure the [[hydrogen-spectrum|lines of hydrogen]].
`,
  ideas: [
    'A grating\'s bright orders obey d sin θ = mλ, the same as two slits.',
    'With N slits the maxima become about N times narrower and much brighter: sharp spectral lines.',
    'Each order of white light is a spectrum, red farthest from the centre.',
    'Resolving power λ/Δλ = mN grows with the number of illuminated lines and the order.'
  ],
  pitfalls: [
    'More slits move the maxima — Their angles depend only on d and λ. More slits make them sharper and brighter, not shifted.',
    'Gratings and prisms put the colours in the same order — A prism bends violet most; a grating diffracts red through the largest angle.',
    'Any order can be seen — sin θ cannot exceed 1, so orders stop at m = d/λ rounded down.'
  ],
  formulas: [
    {
      name: 'Grating equation',
      expr: 'd*sin(theta) = m*lambda', tex: 'd\\sin\\theta = m\\lambda', solveFor: 'theta',
      vars: {
        d: { name: 'line spacing (1 / lines per unit length)', q: 'length', unit: 'µm', value: 1.667 },
        theta: { name: 'angle of the order', q: 'angle', unit: '°', min: 0, max: 90 },
        m: { name: 'order', q: 'count', int: true, value: 1 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 546 }
      },
      note: '600 lines per millimetre means $d = 1.667\\ \\mu\\mathrm{m}$.',
      practice: { unknowns: ['theta', 'lambda', 'd'] },
      stories: {
        theta: 'Light of wavelength {lambda} falls on a grating with line spacing {d}. At what angle is order {m}?',
        lambda: 'A grating of line spacing {d} shows a spectral line in order {m} at {theta}. What is its wavelength?',
        d: 'A {lambda} line appears in order {m} at {theta}. What is the grating\'s line spacing?'
      }
    },
    {
      name: 'Resolving power of a grating',
      expr: 'lambda/dl = m*N', tex: '\\frac{\\lambda}{\\Delta\\lambda} = mN', solveFor: 'N',
      vars: {
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 589 },
        dl: { name: 'smallest wavelength difference resolved', q: 'length', unit: 'nm', value: 0.6, tex: '\\Delta\\lambda' },
        m: { name: 'order', q: 'count', int: true, value: 1 },
        N: { name: 'number of illuminated lines' }
      },
      practice: { unknowns: ['N', 'dl'] },
      stories: {
        N: 'How many lines of a grating must be illuminated to separate {lambda} from a line {dl} away, in order {m}?',
        dl: 'A grating with {N} illuminated lines is used in order {m} at {lambda}. What is the smallest wavelength difference it resolves?'
      }
    }
  ],
  examples: [
    {
      title: 'The red line of hydrogen',
      q: 'Light from a hydrogen lamp falls on a grating with 600 lines/mm. At what angles does the red 656.3 nm line appear, and how many orders are there?',
      steps: [
        '$d = 1/600\\ \\mathrm{mm} = 1.667\\ \\mu\\mathrm{m}$.',
        'First order: $\\sin\\theta = 656.3\\times10^{-9}/1.667\\times10^{-6} = 0.394$, $\\theta = 23.2°$.',
        'Second order: $\\sin\\theta = 0.788$, $\\theta = 52.0°$.',
        'Third order would need $\\sin\\theta = 1.18$: impossible. So there are two orders on each side.'
      ],
      a: '23.2° and 52.0°, on each side of the centre; no third order.'
    },
    {
      title: 'Splitting the sodium doublet',
      q: 'How many grating lines must be illuminated to resolve the sodium lines at 589.0 nm and 589.6 nm in first order? Is a 1 cm wide grating with 600 lines/mm enough?',
      steps: [
        '$R = \\lambda/\\Delta\\lambda = 589.3/0.6 \\approx 982$.',
        'In first order $N = R/m = 982$ lines.',
        'A 1 cm strip at 600 lines/mm has 6000 lines — six times more than needed.'
      ],
      a: 'About 1000 lines; the 1 cm grating resolves them easily.'
    }
  ],
  quiz: [
    { q: 'You illuminate more lines of the same grating. The bright orders…', choices: ['move to larger angles', 'become sharper, at the same angles', 'become wider', 'disappear'], a: 1,
      why: 'Angles come from $d\\sin\\theta = m\\lambda$; the number of lines only sets how narrow the maxima are.' },
    { q: 'In a grating spectrum, which colour is diffracted through the largest angle?', choices: ['Violet', 'Green', 'Red', 'All the same'], a: 2, why: '$\\sin\\theta = m\\lambda/d$ grows with wavelength, so red goes farthest.' },
    { q: 'A grating has $d = 2.0\\ \\mu\\mathrm{m}$. How many orders of 600 nm light appear on each side of the centre?', choices: ['1', '2', '3', '4'], a: 2,
      why: '$d/\\lambda = 3.33$, so $m = 1, 2, 3$ exist and $m = 4$ would need $\\sin\\theta > 1$.' },
    { q: 'A grating with more lines per millimetre spreads a spectrum over a wider range of angles.', a: true,
      why: 'More lines per mm means a smaller $d$, and $\\sin\\theta = m\\lambda/d$ grows, as does the spread between colours.' }
  ],
  applications: [
    'Spectrometers in chemistry labs, observatories and quality control.',
    'Wavelength-division multiplexing in fibre optics, which sends many colours down one fibre.',
    'The rainbow sheen of CDs, DVDs and holographic security labels.',
    'Tunable lasers, which use a grating to select one wavelength.'
  ],
  sim: { id: 'light-diffraction', params: { mode: 'grating' }, title: 'Diffraction grating' }
},

{
  id: 'resolution', parent: 'wave-optics', title: 'Resolving power', level: 2,
  short: 'Diffraction blurs every point into a small disc, so two points closer than about 1.22 λ/D in angle merge into one — the ultimate sharpness limit of eyes, cameras, telescopes and microscopes.',
  keywords: ['resolving power', 'resolution', 'Rayleigh criterion', 'Airy disc', 'angular resolution', 'diffraction limit', 'aperture', 'telescope resolution', 'microscope resolution', 'numerical aperture'],
  prereq: ['single-slit-diffraction', 'optical-instruments'],
  related: ['the-eye', 'diffraction-grating', 'de-broglie-wavelength'],
  body: `
A perfect lens still cannot focus a star to a point. Light entering a round aperture of diameter $D$ is diffracted, and the image of a point is an **Airy pattern**: a bright central disc holding 84% of the light, surrounded by faint rings. The first dark ring is at

$$\\sin\\theta = 1.22\\,\\frac{\\lambda}{D}$$

(the 1.22 comes from the round shape; a slit would give exactly $\\lambda/a$).

### The Rayleigh criterion
Two point sources — two stars, two headlights, two dots on a page — each make their own Airy disc. As they move closer the discs overlap and eventually merge into one blob. Lord Rayleigh proposed a practical dividing line: the two are **just resolved** when the centre of one disc falls on the first dark ring of the other,

$$\\theta_\\text{min} = 1.22\\,\\frac{\\lambda}{D} \\quad \\text{(radians)}$$

At that separation the brightness between the two peaks dips to about 74% of the peaks — a dip the eye can just notice. Better resolution needs a **shorter wavelength** or a **wider aperture**.

### Numbers
| Instrument | Aperture | $\\theta_\\text{min}$ at 550 nm |
|---|---|---|
| human eye (daylight) | 3 mm | 0.77′ (46″) |
| amateur telescope | 200 mm | 0.69″ |
| Hubble Space Telescope | 2.4 m | 0.058″ |

The eye's limit closely matches the spacing of the cones in its fovea — sharper optics would be wasted on the retina. Ground-based telescopes rarely reach their limit, because air turbulence blurs stars to about 1″ unless adaptive optics correct it. Radio astronomers, with wavelengths of millimetres to metres, link dishes across continents: the Event Horizon Telescope, an Earth-sized aperture at 1.3 mm, reaches about 25 microarcseconds, enough to image the shadow of a black hole.

### Microscopes
For a microscope the smallest resolvable separation is about

$$d_\\text{min} = \\frac{0.61\\,\\lambda}{\\mathrm{NA}}$$

where the numerical aperture NA is at most about 1.4 with oil immersion: roughly 0.2 µm for visible light. That is why [[optical-instruments|magnification]] beyond about 1000× is "empty", and why electron microscopes — whose [[de-broglie-wavelength|de Broglie wavelengths]] are thousands of times shorter — see individual atoms.

> [!tip] In the simulation, bring two stars together until the verdict reads "just resolved", then double the aperture and watch them separate again.
`,
  ideas: [
    'Diffraction turns the image of a point into an Airy disc of angular radius 1.22 λ/D.',
    'Two points are just resolved (Rayleigh) when one image\'s centre lies on the other\'s first dark ring.',
    'Resolution improves with larger aperture and shorter wavelength, not with magnification.',
    'A light microscope cannot resolve much below about 0.2 µm.'
  ],
  pitfalls: [
    'More magnification shows more detail — Beyond the diffraction limit magnification only enlarges the blur.',
    'The 1.22 applies to slits too — It is the factor for circular apertures; for a slit of width a the first minimum is at λ/a.',
    'Using θ_min in degrees straight from the formula — 1.22 λ/D gives radians; convert before comparing with arcminutes or arcseconds.'
  ],
  formulas: [
    {
      name: 'Rayleigh criterion (round aperture)',
      expr: 'theta = 1.22*lambda/D', tex: '\\theta_{\\text{min}} = 1.22\\,\\frac{\\lambda}{D}',
      vars: {
        theta: { name: 'smallest resolvable angle', q: 'angle', unit: '″', tex: '\\theta_{\\text{min}}' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550 },
        D: { name: 'aperture diameter', q: 'length', unit: 'mm', value: 200 }
      },
      stories: {
        theta: 'What is the smallest angle a telescope of aperture {D} can resolve at {lambda}?',
        D: 'What aperture is needed to resolve two stars {theta} apart at {lambda}?'
      }
    },
    {
      name: 'Smallest separation seen at a distance',
      expr: 's = 1.22*lambda*L/D',
      vars: {
        s: { name: 'smallest separation of two points', q: 'length', unit: 'm' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550 },
        L: { name: 'distance to the objects', q: 'length', unit: 'km', value: 5 },
        D: { name: 'aperture (pupil) diameter', q: 'length', unit: 'mm', value: 5 }
      },
      note: 'Diffraction limit only; in practice air turbulence and the detector often do worse.',
      stories: {
        s: 'Your pupil is {D} across. At a distance of {L}, how far apart must two lamps be for you to see them as two ({lambda} light)?',
        L: 'Two headlights are {s} apart. From how far away can an eye with a {D} pupil still resolve them at {lambda}?'
      }
    },
    {
      name: 'Resolution limit of a microscope',
      expr: 'dmin = 0.61*lambda/NA', tex: 'd_{\\text{min}} = \\frac{0.61\\,\\lambda}{\\mathrm{NA}}',
      vars: {
        dmin: { name: 'smallest resolvable separation', q: 'length', unit: 'nm', tex: 'd_{\\text{min}}' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550 },
        NA: { name: 'numerical aperture of the objective', value: 1.4, tex: 'NA' }
      },
      stories: { dmin: 'What is the smallest detail an oil-immersion objective of numerical aperture {NA} can resolve at {lambda}?' }
    }
  ],
  examples: [
    {
      title: 'Headlights at night',
      q: 'At night your pupils open to 5.0 mm. Car headlights are 1.4 m apart. How far away can the car be for you still to see two lamps rather than one (take λ = 550 nm)?',
      steps: [
        '$\\theta_\\text{min} = 1.22 \\times 550\\times10^{-9}/5.0\\times10^{-3} = 1.34\\times10^{-4}\\ \\mathrm{rad}$.',
        'Small angle: separation = distance × angle, so $L = 1.4/1.34\\times10^{-4} = 1.04\\times10^{4}\\ \\mathrm{m}$.',
        'About 10 km in theory; in practice the eye\'s aberrations and the atmosphere cut this down.'
      ],
      a: 'About 10 km (diffraction limit).'
    },
    {
      title: 'Reading a newspaper from orbit?',
      q: 'A spy satellite 400 km up wants to read letters whose strokes are 3 mm apart. What mirror diameter would that need at 550 nm?',
      steps: [
        'Required angle: $\\theta = 3\\times10^{-3}/4.0\\times10^{5} = 7.5\\times10^{-9}\\ \\mathrm{rad}$.',
        '$D = 1.22\\lambda/\\theta = 1.22 \\times 550\\times10^{-9}/7.5\\times10^{-9} = 89\\ \\mathrm{m}$.',
        'Hubble\'s mirror is 2.4 m. Headlines, perhaps; small print, never — and the atmosphere would blur it anyway.'
      ],
      a: 'A mirror about 90 m across — far beyond any satellite.'
    }
  ],
  quiz: [
    { q: 'Which change improves a telescope\'s resolution?', choices: ['A higher-power eyepiece', 'A larger objective', 'A longer tube', 'Observing in red light instead of blue'], a: 1,
      why: '$\\theta_\\text{min} = 1.22\\lambda/D$: only a larger aperture or a shorter wavelength helps.' },
    { q: 'Two point sources are just resolved when…', choices: ['their Airy discs do not touch at all', 'the centre of one image lies on the first dark ring of the other', 'their images are one wavelength apart', 'the telescope magnifies them 100×'], a: 1,
      why: 'That is the Rayleigh criterion; the dip between the peaks is then about 26%.' },
    { q: 'Why can electron microscopes resolve far smaller details than light microscopes?', choices: ['Electrons are charged', 'Their wavelength is much shorter', 'They use bigger lenses', 'Electrons travel faster than light'], a: 1,
      why: 'The diffraction limit scales with wavelength, and fast electrons have de Broglie wavelengths of picometres.' },
    { q: 'A light microscope with 5000× magnification shows details five times finer than at 1000×.', a: false,
      why: 'The limit is set by diffraction at about 0.2 µm; beyond about 1000× the extra magnification is empty.' },
    { q: 'For the same aperture, which colour gives the sharpest images?', choices: ['Red', 'Yellow', 'Green', 'Violet'], a: 3, why: 'Shortest wavelength, smallest Airy disc.' }
  ],
  applications: [
    'Choosing telescope and camera apertures; interferometers that link separate telescopes into one huge aperture.',
    'Photolithography of computer chips, which uses deep-ultraviolet light to print features tens of nanometres wide.',
    'Super-resolution fluorescence microscopy, which beats the limit with clever tricks (Nobel Prize 2014).',
    'Blu-ray discs, which store more than DVDs by reading with a shorter, 405 nm, laser.'
  ],
  sim: { id: 'light-diffraction', params: { mode: 'rayleigh' }, title: 'Resolving two stars' }
},

{
  id: 'polarization', parent: 'wave-optics', title: 'Polarization and Malus\'s law', level: 2,
  short: 'Light is a transverse wave whose electric field points in a definite direction; a polariser passes only one direction, and Malus\'s law gives how much gets through a second one.',
  keywords: ['polarization', 'polarisation', 'polariser', 'polarizer', 'Malus\'s law', 'unpolarized light', 'transverse wave', 'analyser', 'LCD', 'sunglasses', 'Polaroid', 'birefringence', 'circular polarization'],
  prereq: ['electromagnetic-waves', 'transverse-longitudinal', 'math:right-triangle-trig'],
  related: ['brewsters-angle', 'em-wave-energy'],
  body: `
Light is an [[electromagnetic-waves|electromagnetic wave]]: its electric field oscillates **across** the direction of travel. The direction in which the electric field oscillates is the wave's **polarization**. A laser beam may have its field swinging up and down — vertically polarised. Sunlight and lamplight are **unpolarised**: they are a jumble of waves from countless atoms, with the field direction changing randomly many times per nanosecond.

Only transverse waves can be polarised. Sound, a longitudinal wave, cannot — one of the clues that told nineteenth-century physicists that light is transverse.

### Polarisers
A polarising filter transmits the component of the electric field along its **transmission axis** and absorbs the component across it. A sheet polariser contains long molecules lined up in one direction; electrons move easily along them and absorb the field component parallel to them, so the transmission axis is *perpendicular* to the chains. (A grid of parallel wires does the same for microwaves.)

Unpolarised light through an ideal polariser loses **half** its intensity — the average of the transmitted share over all directions — and comes out polarised along the axis.

### Malus's law
Send polarised light of intensity $I_0$ into a second polariser (the *analyser*) whose axis makes an angle $\\theta$ with the polarization. The field component $E_0\\cos\\theta$ gets through, and since intensity goes as the square of the field,

$$I = I_0\\cos^2\\theta$$

Parallel: everything passes. At 45°: half. **Crossed** at 90°: nothing.

### The third-polariser surprise
Cross two polarisers so no light passes, then slide a third one **between** them at 45°. Light reappears! The first passes $I_0/2$; the middle one passes $\\cos^2 45° = \\tfrac12$ of that; the last another half: $I_0/8$. A filter that can only remove light has let more through, because each polariser does not just block — it **re-polarises** the light along its own axis. With many polarisers each turned a little further, nearly half of the original light can be rotated through 90°.

### Other ways to polarise light
- **Reflection** from water, glass or a road partly polarises light horizontally, fully at [[brewsters-angle|Brewster's angle]].
- **Scattering**: blue skylight 90° from the Sun is strongly polarised — bees and some birds navigate by it.
- **Birefringent** crystals such as calcite split light into two beams of perpendicular polarization, giving double images; thin slices (wave plates) turn linear into circular polarization.

> [!tip] In the simulation, cross the first polariser and the analyser, then tick the middle polariser and find the angle that lets the most light through.
`,
  ideas: [
    'Polarization is the direction of the electric field of a light wave; only transverse waves can be polarised.',
    'An ideal polariser passes half of unpolarised light and polarises it along its axis.',
    'Malus\'s law: polarised light through a polariser at angle θ keeps I₀ cos²θ.',
    'Crossed polarisers block everything; a third polariser between them lets light through again.'
  ],
  pitfalls: [
    'The transmitted intensity is I₀ cos θ — The field is reduced by cos θ; the intensity, which goes as the square of the field, by cos²θ.',
    'A polariser works like a picket fence that only lets through vibrations parallel to its slats — For a wire grid it is the other way round: the field along the wires is absorbed, and the field across them passes.',
    'Malus\'s law applies to unpolarised light — Unpolarised light has no single angle; averaging cos²θ over all directions gives exactly one half.'
  ],
  formulas: [
    {
      name: 'Malus\'s law',
      expr: 'I = I0*cos(theta)^2', tex: 'I = I_0\\cos^2\\theta',
      vars: {
        I: { name: 'transmitted intensity', q: 'intensity', unit: 'W/m²' },
        I0: { name: 'intensity of the polarised light arriving', q: 'intensity', unit: 'W/m²', value: 500, tex: 'I_0' },
        theta: { name: 'angle between polarization and transmission axis', q: 'angle', unit: '°', value: 60, min: 0, max: 90 }
      },
      stories: {
        I: 'Polarised light of intensity {I0} meets a polariser whose axis is at {theta} to its polarization. How much gets through?',
        theta: 'At what angle must an analyser be set to pass {I} of a polarised beam of {I0}?'
      }
    },
    {
      name: 'Three polarisers, outer two crossed',
      expr: 'I = I0/8*sin(2*theta)^2', tex: 'I = \\frac{I_0}{8}\\sin^2 2\\theta',
      vars: {
        I: { name: 'intensity leaving the third polariser', q: 'intensity', unit: 'W/m²' },
        I0: { name: 'intensity of the unpolarised light arriving', q: 'intensity', unit: 'W/m²', value: 100, tex: 'I_0' },
        theta: { name: 'angle of the middle polariser from the first', q: 'angle', unit: '°', value: 30, min: 0, max: 90 }
      },
      note: 'From $\\tfrac12 I_0\\cos^2\\theta\\cos^2(90° - \\theta)$. It is largest, $I_0/8$, at 45°; two angles give each smaller value.',
      stories: {
        I: 'Unpolarised light of {I0} passes two crossed polarisers with a third between them at {theta} to the first. What intensity emerges?',
        theta: 'Between two crossed polarisers lit with {I0} of unpolarised light, at what angle must the middle one be set to let {I} through?'
      }
    }
  ],
  derivation: {
    title: 'Half of unpolarised light gets through',
    steps: [
      { text: 'Unpolarised light is a mixture of waves with every direction of polarization equally likely. A wave at angle $\\theta$ to the axis passes a fraction $\\cos^2\\theta$ of its intensity.' },
      { text: 'Average that fraction over all directions:', tex: '\\langle \\cos^2\\theta \\rangle = \\frac{1}{2\\pi}\\int_0^{2\\pi}\\cos^2\\theta\\, d\\theta = \\frac12' },
      { text: 'So an ideal polariser transmits exactly half of unpolarised light, whatever its orientation:', tex: 'I_1 = \\tfrac12 I_0' }
    ]
  },
  examples: [
    {
      title: 'Polariser and analyser',
      q: 'Sunlight of 1000 W/m² passes a polariser, then an analyser at 60° to it. What intensity comes out?',
      steps: [
        'Unpolarised light through the first polariser: $1000/2 = 500\\ \\mathrm{W/m^2}$, now polarised.',
        'Malus: $I = 500\\cos^2 60° = 500 \\times 0.25 = 125\\ \\mathrm{W/m^2}$.'
      ],
      a: '125 W/m²'
    },
    {
      title: 'Letting light through crossed polarisers',
      q: 'Unpolarised light of 1000 W/m² meets two crossed polarisers. A third is inserted between them at 45°. How much light emerges before and after?',
      steps: [
        'Before: $500\\cos^2 90° = 0$.',
        'After: first $500$, middle $500\\cos^2 45° = 250$, last $250\\cos^2 45° = 125\\ \\mathrm{W/m^2}$.',
        'One eighth of the original light now gets through a combination that was completely dark.'
      ],
      a: '0 before, 125 W/m² after.'
    }
  ],
  quiz: [
    { q: 'Unpolarised light passes through one ideal polariser. The transmitted fraction is…', choices: ['0', '¼', '½', '1'], a: 2, why: 'The average of $\\cos^2\\theta$ over all directions is ½.' },
    { q: 'An analyser is turned from the position of maximum transmission by 90°. The transmitted light is…', choices: ['the same', 'halved', 'zero', 'doubled'], a: 2, why: '$\\cos^2 90° = 0$: crossed polarisers block polarised light completely.' },
    { q: 'Can sound waves in air be polarised?', choices: ['Yes, like light', 'No, because sound is longitudinal', 'Only at high frequency', 'Only in water'], a: 1,
      why: 'Air vibrates along the direction of travel, so there is no transverse direction to select.' },
    { q: 'Polarising sunglasses cut glare from a lake because…', choices: ['they are darker than ordinary sunglasses', 'reflected glare is partly horizontally polarised and their axis is vertical', 'they absorb blue light', 'they reflect the glare back'], a: 1,
      why: 'Light reflected from horizontal surfaces is preferentially polarised horizontally; a vertical axis blocks it.' },
    { q: 'Adding a third polariser between two crossed polarisers can only reduce the light further.', a: false,
      why: 'The middle polariser re-polarises the light at an intermediate angle, so up to one eighth of the unpolarised light gets through.' }
  ],
  applications: [
    'Liquid-crystal displays, where each pixel twists the polarization between crossed polarisers.',
    'Polarising sunglasses and camera filters that remove glare and reflections.',
    '3D cinema, which sends the images meant for the two eyes with different (circular) polarizations.',
    'Photoelastic stress analysis: stressed transparent plastic between polarisers shows coloured strain patterns.'
  ],
  history: 'Étienne-Louis Malus discovered polarization by reflection in 1808, looking through a calcite crystal at sunlight reflected from the windows of the Luxembourg Palace, and stated his cos² law in 1809. Edwin Land invented the sheet polariser in 1929.',
  sim: 'light-polarizers'
},

{
  id: 'brewsters-angle', parent: 'wave-optics', title: 'Brewster\'s angle', level: 2,
  short: 'At one special angle of incidence, light polarised in the plane of incidence is not reflected at all, so the reflected light is completely polarised: tan θ_B = n₂/n₁.',
  keywords: ['Brewster\'s angle', 'polarizing angle', 'polarization by reflection', 'glare', 's-polarized', 'p-polarized', 'Fresnel equations', 'Brewster window', 'reflectance'],
  prereq: ['polarization', 'refraction', 'reflection'],
  related: ['total-internal-reflection', 'lasers'],
  body: `
Look at the glare from a wet road through polarising sunglasses and turn your head: the glare brightens and fades. Light reflected from a surface is partly **polarised**, and at one angle completely so.

### Two polarizations
Light striking a surface can be split into two parts:

- **s-polarised**: the electric field is perpendicular to the plane of incidence (parallel to the surface) — from the German *senkrecht*,
- **p-polarised**: the electric field lies in the plane of incidence.

The two reflect differently. The fraction reflected (from the Fresnel equations) is

$$R_s = \\left(\\frac{\\sin(\\theta_1 - \\theta_2)}{\\sin(\\theta_1 + \\theta_2)}\\right)^2, \\qquad R_p = \\left(\\frac{\\tan(\\theta_1 - \\theta_2)}{\\tan(\\theta_1 + \\theta_2)}\\right)^2$$

where $\\theta_2$ is the refraction angle from [[refraction|Snell's law]]. At $\\theta_1 + \\theta_2 = 90°$ the tangent in the denominator becomes infinite and $R_p$ **vanishes**.

### Why p-light stops reflecting
The reflected wave is radiated by the electrons of the second medium, set oscillating by the refracted wave. For p-light they oscillate in the plane of incidence, perpendicular to the refracted ray. An oscillating charge radiates nothing along its own line of motion. When the reflected and refracted rays are at right angles, the reflected direction lies exactly along that line — so the electrons cannot send any p-light that way.

### The angle
With $\\theta_2 = 90° - \\theta_B$, Snell's law $n_1\\sin\\theta_B = n_2\\cos\\theta_B$ gives **Brewster's law**:

$$\\tan\\theta_B = \\frac{n_2}{n_1}$$

| Boundary | $\\theta_B$ |
|---|---|
| air → water | 53.1° |
| air → glass (1.50) | 56.3° |
| glass → air | 33.7° |

At Brewster's angle an air–glass surface reflects about 15% of s-light and none of the p-light, so unpolarised light reflects as about 7% of fully s-polarised light. The transmitted beam is only partly polarised. Brewster's angle exists for either direction of travel and, going from glass to air, is always smaller than the [[total-internal-reflection|critical angle]].

> [!tip] In the interface simulation, set air → glass and turn the angle to 56.3°: the readout "Reflected s / p" shows the p-share falling to zero.
`,
  ideas: [
    'Reflected light is partly polarised parallel to the surface (s); at Brewster\'s angle completely so.',
    'At Brewster\'s angle the reflected and refracted rays are perpendicular.',
    'tan θ_B = n₂/n₁: about 53° for water and 56° for glass, from air.',
    'p-polarised light passes a surface at Brewster\'s angle without any reflection loss.'
  ],
  pitfalls: [
    'Nothing is reflected at Brewster\'s angle — Only p-polarised light is not reflected; s-polarised light still reflects (about 15% for glass).',
    'Brewster\'s angle is the critical angle — They are different: Brewster\'s angle exists from either side and involves polarization; the critical angle exists only going to a lower index and reflects everything.',
    'The transmitted beam is fully polarised too — It loses only a little s-light, so it remains mostly unpolarised; stacks of plates are needed to polarise it well.'
  ],
  derivation: {
    title: 'Brewster\'s law from Snell\'s law',
    steps: [
      { text: 'p-reflection vanishes when the reflected and refracted rays are perpendicular. The reflected ray leaves at $\\theta_B$, so the refracted one must be at', tex: '\\theta_2 = 90° - \\theta_B' },
      { text: 'Insert this into Snell\'s law, using $\\sin(90° - x) = \\cos x$:', tex: 'n_1\\sin\\theta_B = n_2\\sin(90° - \\theta_B) = n_2\\cos\\theta_B' },
      { text: 'Divide by $\\cos\\theta_B$:', tex: '\\tan\\theta_B = \\frac{n_2}{n_1}' }
    ]
  },
  formulas: [
    {
      name: 'Brewster\'s law',
      expr: 'tan(thetaB) = n2/n1', tex: '\\tan\\theta_B = \\frac{n_2}{n_1}', solveFor: 'thetaB',
      vars: {
        thetaB: { name: 'Brewster\'s angle', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\theta_B' },
        n1: { name: 'index of the medium the light comes from', value: 1.00, tex: 'n_1' },
        n2: { name: 'index of the medium it strikes', value: 1.33, tex: 'n_2' }
      },
      stories: {
        thetaB: 'At what angle of incidence is light reflected from a surface of index {n2} (coming from index {n1}) completely polarised?',
        n2: 'Reflected light is completely polarised when it strikes a gem at {thetaB} from air (n = {n1}). What is the gem\'s refractive index?'
      }
    },
    {
      name: 'Reflectance for s-polarised light',
      expr: 'Rs = (sin(theta1 - theta2)/sin(theta1 + theta2))^2', tex: 'R_s = \\left(\\frac{\\sin(\\theta_1 - \\theta_2)}{\\sin(\\theta_1 + \\theta_2)}\\right)^2', solveFor: 'Rs',
      vars: {
        Rs: { name: 'fraction of s-light reflected', q: 'ratio', unit: '%', tex: 'R_s' },
        theta1: { name: 'angle of incidence', q: 'angle', unit: '°', value: 45, min: 0, max: 90, tex: '\\theta_1' },
        theta2: { name: 'angle of refraction (from Snell\'s law)', q: 'angle', unit: '°', value: 28.13, min: 0, max: 90, tex: '\\theta_2' }
      },
      note: 'Find $\\theta_2$ first from Snell\'s law. The defaults are air → glass (n = 1.5) at 45°.',
      practice: { unknowns: ['Rs'] }
    },
    {
      name: 'Reflectance for p-polarised light',
      expr: 'Rp = (tan(theta1 - theta2)/tan(theta1 + theta2))^2', tex: 'R_p = \\left(\\frac{\\tan(\\theta_1 - \\theta_2)}{\\tan(\\theta_1 + \\theta_2)}\\right)^2', solveFor: 'Rp',
      vars: {
        Rp: { name: 'fraction of p-light reflected', q: 'ratio', unit: '%', tex: 'R_p' },
        theta1: { name: 'angle of incidence', q: 'angle', unit: '°', value: 45, min: 0, max: 90, tex: '\\theta_1' },
        theta2: { name: 'angle of refraction (from Snell\'s law)', q: 'angle', unit: '°', value: 28.13, min: 0, max: 90, tex: '\\theta_2' }
      },
      note: 'Zero when $\\theta_1 + \\theta_2 = 90°$ — Brewster\'s angle.',
      practice: { unknowns: ['Rp'] }
    }
  ],
  examples: [
    {
      title: 'Glare from a lake',
      q: 'At what angle of incidence is sunlight reflected from calm water ($n = 1.33$) completely polarised? How high is the Sun then?',
      steps: [
        '$\\tan\\theta_B = 1.33/1.00$, so $\\theta_B = 53.1°$ from the vertical (the normal).',
        'The Sun is then $90° - 53.1° = 36.9°$ above the horizon.',
        'The reflected glare is polarised horizontally, so vertical-axis polarising sunglasses remove it almost completely.'
      ],
      a: '53.1° from the vertical, with the Sun about 37° above the horizon.'
    },
    {
      title: 'Brewster and critical angles from inside glass',
      q: 'For light inside glass ($n = 1.50$) striking the surface with air, find Brewster\'s angle and the critical angle.',
      steps: [
        'Brewster: $\\tan\\theta_B = 1.00/1.50$, so $\\theta_B = 33.7°$.',
        'Critical: $\\sin\\theta_c = 1.00/1.50$, so $\\theta_c = 41.8°$.',
        'As the angle grows from 0°, p-reflection falls to zero at 33.7°, then everything reflects beyond 41.8°.'
      ],
      a: 'θ_B = 33.7°, θ_c = 41.8°.'
    }
  ],
  quiz: [
    { q: 'At Brewster\'s angle, the reflected light is polarised…', choices: ['in the plane of incidence (p)', 'parallel to the surface (s)', 'circularly', 'not at all'], a: 1, why: 'The p-component is not reflected, so what remains is s-polarised: its field is parallel to the surface.' },
    { q: 'At Brewster\'s angle, the angle between the reflected and the refracted rays is…', choices: ['0°', '45°', '90°', '180°'], a: 2, why: 'That perpendicularity is the condition that suppresses p-reflection.' },
    { q: 'A material has $\\tan\\theta_B = 1.5$ for light from air. Its Brewster angle is about…', choices: ['33.7°', '41.8°', '56.3°', '60°'], a: 2, why: '$\\arctan 1.5 = 56.3°$.' },
    { q: 'At Brewster\'s angle no light at all is reflected.', a: false, why: 'Only the p-polarised part vanishes; s-polarised light still reflects.' }
  ],
  applications: [
    'Brewster windows on gas-laser tubes, which pass p-light without loss and make the laser output polarised.',
    'Polarising sunglasses and camera filters that remove glare from water, roads and windows.',
    'Measuring the refractive index of opaque or tiny samples from the angle of zero p-reflection.'
  ],
  history: 'David Brewster found the law experimentally in 1815, a few years after Malus had discovered that reflection polarises light.',
  sim: { id: 'light-interface', params: { n1: 1.0, n2: 1.5, angle: 56.3 } }
}

);
