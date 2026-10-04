/* HYPER-OPTICS · content/nature-of-light.js — the topic "What light is" (branch Light and Rays).
 *
 *   what-is-light                      wave and photon, optical radiation
 *   wavelength-frequency-and-colour    c = λf, λ in a medium, colour names
 *   the-optical-spectrum               UV, visible, infrared: uses, materials, detectors
 *   photon-energy                      E = hc/λ = 1240 eV·nm / λ
 *   refractive-index                   n = c/v, a table, dispersion
 *   optical-path-length                n·d, phase, what interferometers count
 *   rays-and-wavefronts                rays are normals to wavefronts; when rays fail
 *   fermats-principle                  the stationary path
 *   huygens-construction               wavelets build the front
 *   light-sources-and-beams            point and extended sources, pencils, collimated beams
 *   shadows-and-the-pinhole            umbra, penumbra, eclipses, the pinhole
 * Simulations: sims/nature-of-light.js (ids nl-…).
 */
Hyper.add(

/* ================================================================ what is light */
{
  id: 'what-is-light', parent: 'nature-of-light', title: 'What light is', level: 1,
  short: 'Light is an electromagnetic wave that travels at 299 792 458 m/s in vacuum, and it is also a stream of photons: the wave describes how it spreads, focuses and interferes, the photon how it is emitted, counted and absorbed. "Optical" radiation is the stretch of wavelengths, from about 100 nm to 1 mm, that lenses and mirrors can handle.',
  keywords: ['light', 'electromagnetic wave', 'photon', 'wave-particle duality', 'speed of light', 'c', 'optical radiation', 'visible light', 'quantum of light', 'photon counting', 'what is light', 'shot noise'],
  prereq: ['physics:electromagnetic-waves', 'physics:photon'],
  related: ['wavelength-frequency-and-colour', 'the-optical-spectrum', 'photon-energy', 'rays-and-wavefronts', 'light-as-a-wave', 'physics:em-spectrum', 'physics:photoelectric-effect', 'feynman:origin-of-refractive-index'],
  body: `
Switch off the room light and wait: a dim display across the room is not a smooth glow but individual packets of energy arriving at your retina a few at a time. Switch the lamp back on and the same radiation behaves like a smooth wave, rolling across the room, bending round a hair, adding to itself in a soap film. Light is both, and optics uses whichever description gives the answer more simply.

### The wave
Light is an **electromagnetic wave**: an electric and a magnetic field, at right angles to each other and to the direction of travel, oscillating in step and carrying each other along. It needs no medium. In vacuum it travels at exactly

$$c = 299\\,792\\,458\\ \\mathrm{m/s}$$

(the metre is *defined* from this number), about 30 cm in a nanosecond. Sunlight takes 8 minutes 19 seconds to cross the 150 million kilometres to Earth; a laser flash bounced off the Moon returns in 2.5 seconds. The distance from crest to crest, the **wavelength**, is 0.4 to 0.7 µm for the light we see ([[wavelength-frequency-and-colour]]). The wave picture explains everything that depends on phase: [[light-as-a-wave|interference]], [[what-diffraction-is|diffraction]], [[polarization-states|polarization]], the [[refractive-index|refractive index]].

### The photon
Whenever light is emitted or absorbed it comes in indivisible lumps, **photons**, each carrying the energy $E = hf = hc/\\lambda$ ([[photon-energy]]). A 1 mW beam of green light carries about $2.8\\times10^{15}$ photons every second, so many that it looks perfectly smooth. The dark-adapted eye can register a flash of roughly a hundred photons arriving at the cornea; a camera pixel counts them one at a time, and the randomness of that count is the **shot noise** that makes dim pictures grainy. The photon picture explains everything that depends on counting: [[how-a-pixel-detects-light|detection]], noise, the energy threshold of the photoelectric effect.

### Which description to use
| The question | The description |
|---|---|
| Where does a beam go through a lens? | rays (geometry) |
| How small can the focus be? | waves (diffraction) |
| Why do two beams make fringes? | waves (phase) |
| How many electrons does a pixel release? | photons (counting) |
| Why is a dim picture grainy? | photons (statistics) |

The descriptions are nested. Rays are what the wave becomes when everything is much larger than a wavelength ([[rays-and-wavefronts]]); the wave is what the photons add up to when there are very many of them.

### What "optical" means
Radio waves, light and X-rays are the same kind of wave; only the wavelength differs. **Optical radiation** is the stretch from about 100 nm to 1 mm — ultraviolet, visible and infrared ([[the-optical-spectrum]]) — where radiation can be steered by glass, mirrors and gratings and detected photon by photon, and for which exposure standards are written. The eye uses a few hundred nanometres of it.

### What light is not
It is not a shower of tiny bullets flying along paths: between source and detector a photon has no track to follow, only a likelihood of arriving that is given by the wave. And it is not a ripple *of* something: there is no ether, and the vacuum carries light perfectly.

> [!key] Light is an electromagnetic wave, speed $c = 299\\,792\\,458$ m/s in vacuum, that is emitted and absorbed as photons of energy $hf$. Use waves for how it travels, photons for how it is counted, and rays when the wavelength can be ignored.
`,
  ideas: [
    'Light is an electromagnetic wave: electric and magnetic fields oscillating together, needing no medium.',
    'In vacuum it travels at exactly 299 792 458 m/s, about 30 cm per nanosecond; nothing carries a signal faster.',
    'It is emitted and absorbed as photons of energy E = hf; a 1 mW green beam is about 3 × 10¹⁵ photons a second.',
    'Waves explain propagation, interference and diffraction; photons explain detection and noise; rays are the limit of waves with a negligible wavelength.',
    'Optical radiation is the range from about 100 nm to 1 mm: ultraviolet, visible and infrared.'
  ],
  pitfalls: [
    'Light is either a wave or a little ball — It is neither alone. A photon is the unit in which the wave exchanges energy with matter; the wave decides where the photon is likely to arrive.',
    'A dimmer light is made of weaker photons — Each photon of a given colour carries exactly the same energy. A dimmer light is fewer photons per second, and at low levels you can count them.',
    'Light means only what we can see — The same radiation continues past both ends of the visible band. Sunburn, a remote control and a thermal camera all work with light in this wider sense.',
    'Light always travels at 300 000 km/s — That is its speed in vacuum. In water it is about 225 000 km/s and in glass about 198 000 km/s ([[refractive-index]]).'
  ],
  terms: [
    { term: 'Light', also: ['visible light'], def: 'Electromagnetic radiation to which the eye responds, about 380 to 780 nm. In optics the word is often used for the whole ultraviolet, visible and infrared range.' },
    { term: 'Optical radiation', def: 'Electromagnetic radiation of wavelength from about 100 nm to 1 mm: ultraviolet, visible and infrared. The range in which optical components work and in which exposure limits are written.' },
    { term: 'Electromagnetic wave', also: ['EM wave', 'light wave'], def: 'A wave of coupled electric and magnetic fields that carries energy through vacuum or matter. Light, radio waves, microwaves and X-rays are all electromagnetic waves of different wavelength.' },
    { term: 'Photon', also: ['light quantum'], def: 'The indivisible quantum of light: the smallest amount of energy, hf, in which radiation of frequency f can be emitted or absorbed.' },
    { term: 'Speed of light', also: ['c', 'c₀'], def: 'The speed of light in vacuum, exactly 299 792 458 m/s. In a material of refractive index n the speed is c/n.' },
    { term: 'Wave–particle duality', also: ['duality'], def: 'The fact that light shows both wave behaviour (propagation, interference, diffraction) and particle behaviour (emission and absorption in photons). Neither picture alone covers every experiment.' }
  ],
  formulas: [
    {
      name: 'Photons per second in a beam',
      expr: 'Nph = P*lambda/(h*c)', tex: 'N_{\\gamma} = \\frac{P\\,\\lambda}{h\\,c}',
      vars: {
        Nph: { name: 'photons per second', q: 'rate', unit: '1/s', tex: 'N_{\\gamma}' },
        P: { name: 'optical power', q: 'power', unit: 'mW', value: 1, tex: 'P' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        h: { const: 'h' },
        c: { const: 'c' }
      },
      solveFor: 'Nph',
      note: 'Each photon carries hc/λ, so the rate is the power divided by that energy.',
      stories: { Nph: 'A laser pointer emits {P} of light at {lambda}. How many photons leave it every second?', P: 'A beam of {lambda} light delivers {Nph}. What is its power?' }
    },
    {
      name: 'Light travel time',
      expr: 't = d/c', tex: 't = \\frac{d}{c}',
      vars: {
        t: { name: 'travel time', q: 'time', unit: 's' },
        d: { name: 'distance', q: 'length', unit: 'km', value: 149600000 },
        c: { const: 'c' }
      },
      note: 'In vacuum or air. In glass of index n the time is n times longer.',
      stories: { t: 'How long does light take to cover {d}?', d: 'Light takes {t} to arrive from a source. How far away is it?' }
    }
  ],
  examples: [
    {
      title: 'Photons from a laser pointer',
      q: 'A green laser pointer of 5 mW emits at 532 nm. How many photons leave it each second, and how many in a nanosecond?',
      steps: [
        { text: 'Energy of one photon:', tex: 'E = \\frac{hc}{\\lambda} = \\frac{6.626\\times10^{-34}\\times 2.998\\times10^{8}}{532\\times10^{-9}} = 3.73\\times10^{-19}\\ \\mathrm{J}' },
        { text: 'Power is energy per second, so the number per second is', tex: 'N = \\frac{P}{E} = \\frac{5\\times10^{-3}}{3.73\\times10^{-19}} = 1.34\\times10^{16}\\ \\mathrm{s^{-1}}' },
        'In one nanosecond that is $1.34\\times10^{7}$ photons — thirteen million.'
      ],
      a: 'About $1.3\\times10^{16}$ photons per second, or 13 million per nanosecond: far too many to notice individually.'
    },
    {
      title: 'Sun and Moon',
      q: 'How long does light take to reach the Earth from the Sun (150 million km) and from the Moon (384 000 km)?',
      steps: [
        { text: 'Sun:', tex: 't = \\frac{1.496\\times10^{11}\\ \\mathrm{m}}{2.998\\times10^{8}\\ \\mathrm{m/s}} = 499\\ \\mathrm{s}' },
        { text: 'Moon:', tex: 't = \\frac{3.84\\times10^{8}}{2.998\\times10^{8}} = 1.28\\ \\mathrm{s}' }
      ],
      a: '8 minutes 19 seconds from the Sun; 1.28 seconds from the Moon (so a laser ranging pulse makes the round trip in 2.56 s).'
    }
  ],
  quiz: [
    { q: 'You want to predict how many electrons a camera pixel releases in a 10 ms exposure. Which description of light do you need?', choices: ['rays', 'photons (counting)', 'plane waves with no amplitude', 'the speed of light only'], a: 1, why: 'The electrons come from absorbed photons, one electron per photon at best, so the question is about counting photons and their statistics. Rays and waves say where the light goes, not how many quanta arrive.' },
    { q: 'A green laser is dimmed with a filter to one hundredth of its power. Its photons now have one hundredth of the energy.', a: false, why: 'The energy of a photon is $hc/\\lambda$ and depends only on the wavelength. The filter lets through one photon in a hundred; those that pass are exactly as energetic as before.' },
    { q: 'How far does light travel in vacuum in one nanosecond, in centimetres?', answer: 29.98, unit: 'cm', why: '$c\\,t = 2.998\\times10^{8}\\ \\mathrm{m/s}\\times10^{-9}\\ \\mathrm{s} = 0.2998$ m, about the length of a ruler.' },
    { q: 'Which statement describes "optical radiation"?', choices: ['Ultraviolet, visible and infrared radiation, about 100 nm to 1 mm', 'Only what the eye can see, 380 to 780 nm', 'Only radiation from lasers', 'Radiation that needs a medium to travel in'], a: 0, why: 'Optical radiation is the whole stretch handled with lenses and mirrors, of which the visible band is a narrow slice. Lasers are one source of it, and no electromagnetic wave needs a medium.' },
    { q: 'Why does the light from a lamp look smooth rather than grainy?', choices: ['Light is not made of photons at everyday levels', 'There are so many photons per second that the randomness in their number is far too small to see', 'The photons are much smaller than the eye can resolve', 'Waves cancel the graininess'], a: 1, why: 'Photons are always there. A 1 mW beam has about $3\\times10^{15}$ per second, so the relative fluctuation, $1/\\sqrt{N}$, is a few parts in $10^{8}$. At night-time levels you can see the grain.' }
  ],
  applications: [
    'Image sensors and the eye count photons; their noise and sensitivity limits are those of photon statistics.',
    'Solar cells and photodiodes turn absorbed photons into electrons; the energy of the photon decides whether they work.',
    'Fibre-optic links send waves down glass and count photons at the far end; receivers are specified by how few photons per bit they need.',
    'Lasers are amplifiers of photons: each stimulated photon is a copy of the one that caused it.',
    'Lenses, mirrors and prisms are designed with rays, then checked with waves for diffraction and interference.'
  ],
  history: 'Newton (*Opticks*, 1704) favoured streams of particles; Huygens (1690) described waves. Young (1801) and Fresnel (1818) showed interference and diffraction, which only waves produce. Maxwell (1865) found that electromagnetic waves should travel at the measured speed of light, and Hertz (1887–88) made the radio waves to prove it. Planck (1900) and Einstein (1905) found that light is exchanged in quanta; the word "photon" was proposed by G. N. Lewis in 1926.',
  sources: [
    'E. Hecht, *Optics*, ch. 3 (Electromagnetic Theory, Photons and Light) — the wave and the photon side by side.',
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, ch. 1 (Ray Optics) and ch. 12 (Photon Optics) — the four levels of description: rays, waves, electromagnetic fields, photons.',
    'R. P. Feynman, *QED: The Strange Theory of Light and Matter* (1985) — light as photons with probabilities given by waves.',
    'BIPM, *The International System of Units (SI Brochure)* — the metre defined through the speed of light.'
  ],
  sim: 'nl-wave-photon'
},

/* ================================================================ wavelength, frequency and colour */
{
  id: 'wavelength-frequency-and-colour', parent: 'nature-of-light', title: 'Wavelength, frequency and colour', level: 1,
  short: 'A single colour of light is a wave with a wavelength λ, the distance between crests (about 400 to 700 nm for what we see), and a frequency f, its cycles per second (about 430 to 750 THz); the two are tied by c = λf. In a material the wavelength shrinks by the refractive index while the frequency, and so the colour, stays the same. Engineers say "lambda" for the wavelength.',
  keywords: ['wavelength', 'frequency', 'lambda', 'λ', 'colour', 'color', 'nanometre', 'THz', 'terahertz', 'c = λf', 'wavenumber', 'monochromatic', 'spectral colour', 'wavelength in a medium', 'λ/10', 'vacuum wavelength', 'linewidth', 'bandwidth'],
  prereq: ['what-is-light', 'physics:electromagnetic-waves'],
  related: ['the-optical-spectrum', 'photon-energy', 'refractive-index', 'dispersion-and-the-spectrum', 'coherence', 'trichromatic-colour-vision', 'metamerism', 'physics:color-vision'],
  body: `
A wave that repeats itself has two natural measures. Stand still and let it pass, and you count **cycles per second**: the **frequency** $f$, in hertz. Freeze it and lay a ruler along it, and you measure the distance from crest to crest: the **wavelength** $\\lambda$. The speed of the wave ties them together:

$$c = \\lambda f$$

For green light of 550 nm, $f = 2.998\\times10^{8}\\,/\\,550\\times10^{-9} = 5.45\\times10^{14}$ Hz: 545 terahertz (THz), or 545 million million cycles every second, far too fast for any electronic circuit to follow. Optics therefore quotes the wavelength, in nanometres ($1\\ \\mathrm{nm} = 10^{-9}$ m) or micrometres, and leaves the frequency to spectroscopy and telecommunications: the 1550 nm of a fibre link is 193.4 THz.

### Colour by wavelength
| Colour | Wavelength (nm) | Frequency (THz) |
|---|---|---|
| violet | 380–450 | 789–666 |
| blue | 450–495 | 666–606 |
| green | 495–570 | 606–526 |
| yellow | 570–590 | 526–508 |
| orange | 590–620 | 508–484 |
| red | 620–780 | 484–384 |

The limits are conventions, not physics: the eye sees one hue fade into the next, and responds only weakly below about 400 nm and above 700 nm. Light of a single wavelength, such as a laser's, is a **spectral** or **monochromatic** colour. Most colours we meet are mixtures: a screen makes yellow from red and green light, and the eye cannot tell it from true 580 nm yellow ([[metamerism]]).

### "Lambda"
Engineers say *lambda* for the wavelength itself: "what is your lambda?" means "at what wavelength do you work?". A mirror "flat to λ/10" departs from a perfect plane by at most a tenth of a wavelength, usually peak to valley and usually at the 632.8 nm of the helium–neon laser used to test it: 63 nm.

### In glass the wavelength shrinks, the colour does not
Entering a material of refractive index $n$, the wave keeps its frequency — it must stay in step with its source — but its speed falls to $c/n$, so

$$\\lambda_n = \\frac{\\lambda_0}{n}$$

Light of 550 nm in vacuum has a wavelength of 412 nm in water ($n = 1.334$), 362 nm in N-BK7 glass (1.5185) and 227 nm in diamond (2.423), yet a diver still sees green as green: colour follows the frequency. For this reason catalogues quote the **vacuum** wavelength (air changes it by only 0.03 %: 550.00 nm is 549.85 nm in air).

### Wavenumber and bandwidth
Infrared spectroscopists count waves per centimetre, the **wavenumber** $\\bar\\nu = 1/\\lambda$: 10.6 µm is 943 cm⁻¹, 550 nm is 18 182 cm⁻¹. And no source is perfectly monochromatic. A helium–neon laser line is a few parts per million wide, a coloured LED 15–40 nm, a filament lamp the whole spectrum. That spread, the **bandwidth** or linewidth, sets the [[coherence|coherence length]] of the light.

> [!key] $c = \\lambda f$. Wavelength is quoted in vacuum, in nm; in a medium it becomes $\\lambda_0/n$ but the frequency, and the colour, do not change.
`,
  ideas: [
    'Wavelength and frequency are tied by c = λf: 550 nm is 545 THz.',
    'Visible light spans about 380–780 nm, violet to red; the colour boundaries are conventions.',
    'In a medium the speed and wavelength fall by the factor n; the frequency, and so the colour, are unchanged.',
    'Data sheets quote the wavelength in vacuum (or air, which is 0.03 % different).',
    'Real light always has a bandwidth: a laser line is narrow, an LED tens of nanometres wide, a lamp broad.'
  ],
  pitfalls: [
    'Light changes colour in water because its wavelength shortens — The frequency stays the same, and colour follows the frequency. A green laser in water still looks green although its wavelength is 25 % shorter.',
    'Higher frequency means longer wavelength — They are inversely related: c = λf. Blue light has the higher frequency and the shorter wavelength.',
    'Every colour is a wavelength — Brown, pink, magenta and white are mixtures with no single wavelength, and the same yellow on a screen can be made from red and green. Spectral colours are the special case of one wavelength.',
    '"λ/10" is a length of 10 wavelengths — It is one tenth of a wavelength. The symbol λ is the unit; at 632.8 nm it is 63 nm.'
  ],
  terms: [
    { term: 'Wavelength', also: ['λ', 'lambda'], def: 'The distance between two successive crests of a wave. For light it is quoted in nanometres or micrometres, by custom in vacuum.' },
    { term: 'Frequency', also: ['f', 'ν'], def: 'The number of wave cycles per second, in hertz. For visible light 380–780 THz (10¹² Hz); unchanged when light enters a material.' },
    { term: 'Vacuum wavelength', also: ['λ₀'], def: 'The wavelength the light would have in vacuum, c/f. The standard way to name a wavelength, since the wavelength inside a material is λ₀/n.' },
    { term: 'Wavenumber', also: ['ν̃', 'cm⁻¹', 'reciprocal centimetre'], def: 'The number of waves per unit length, 1/λ, usually in cm⁻¹. Used in infrared spectroscopy; 1000 cm⁻¹ is 10 µm.' },
    { term: 'Monochromatic', also: ['single wavelength', 'spectral colour'], def: 'Of a single wavelength. No real source is perfectly so; a laser line is only a few parts per million wide.' },
    { term: 'Bandwidth', also: ['linewidth', 'FWHM', 'spectral width'], def: 'The width of a spectral line or band, often the full width at half the maximum (FWHM), in nm or Hz. It decides the coherence length of the light.' }
  ],
  formulas: [
    {
      name: 'Frequency from wavelength',
      expr: 'f = c/lambda', tex: 'f = \\frac{c}{\\lambda}',
      vars: {
        f: { name: 'frequency', q: 'frequency', unit: 'THz', tex: 'f' },
        lambda: { name: 'wavelength in vacuum', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        c: { const: 'c' }
      },
      solveFor: 'f',
      stories: { f: 'What is the frequency of light of {lambda} wavelength?', lambda: 'Light has a frequency of {f}. What is its vacuum wavelength?' }
    },
    {
      name: 'Wavelength in a medium',
      expr: 'lm = l0/n', tex: '\\lambda_{n} = \\frac{\\lambda_{0}}{n}',
      vars: {
        lm: { name: 'wavelength in the medium', q: 'length', unit: 'nm', tex: '\\lambda_{n}' },
        l0: { name: 'wavelength in vacuum', q: 'length', unit: 'nm', value: 550, tex: '\\lambda_{0}' },
        n: { name: 'refractive index', value: 1.5185, min: 1, max: 4, tex: 'n' }
      },
      solveFor: 'lm',
      note: 'The frequency does not change, so neither does the colour.',
      stories: { lm: 'Light of {l0} in vacuum enters glass of index {n}. What is its wavelength inside?', n: 'Light of {l0} in vacuum has a wavelength of {lm} in a transparent material. What is the index?' }
    },
    {
      name: 'Wavenumber',
      expr: 'k = 1/lambda', tex: '\\bar{\\nu} = \\frac{1}{\\lambda}',
      vars: {
        k: { name: 'wavenumber', q: 'wavenumber', unit: '1/cm', tex: '\\bar{\\nu}' },
        lambda: { name: 'wavelength', q: 'length', unit: 'µm', value: 10.6, tex: '\\lambda' }
      },
      solveFor: 'k',
      note: 'How infrared spectra are labelled: 10 µm is 1000 cm⁻¹.'
    },
    {
      name: 'Wavelength interval for a frequency interval',
      expr: 'dl = lambda^2*df/c', tex: '\\Delta\\lambda = \\frac{\\lambda^{2}\\,\\Delta f}{c}',
      vars: {
        dl: { name: 'wavelength interval', q: 'length', unit: 'nm', tex: '\\Delta\\lambda' },
        lambda: { name: 'centre wavelength', q: 'length', unit: 'nm', value: 1550, tex: '\\lambda' },
        df: { name: 'frequency interval', q: 'frequency', unit: 'GHz', value: 100, tex: '\\Delta f' },
        c: { const: 'c' }
      },
      solveFor: 'dl',
      note: 'Valid while the interval is small compared with λ. Telecom channels 100 GHz apart are 0.8 nm apart near 1550 nm.',
      stories: { dl: 'Two laser lines near {lambda} differ in frequency by {df}. By how many nanometres do their wavelengths differ?' }
    }
  ],
  examples: [
    {
      title: 'A red laser in water',
      q: 'A helium–neon laser (632.8 nm in vacuum) shines into a tank of water, where its index is 1.332. Find the wavelength, the frequency and the speed of the light in the water. Does the colour change?',
      steps: [
        { text: 'The frequency is set by the source and does not change:', tex: 'f = \\frac{c}{\\lambda_0} = \\frac{2.998\\times10^{8}}{632.8\\times10^{-9}} = 4.738\\times10^{14}\\ \\mathrm{Hz}' },
        { text: 'The wavelength is shortened by the index:', tex: '\\lambda_n = \\frac{632.8}{1.332} = 475.1\\ \\mathrm{nm}' },
        { text: 'and the speed is', tex: 'v = \\lambda_n f = \\frac{c}{n} = 2.251\\times10^{8}\\ \\mathrm{m/s}' }
      ],
      a: '475 nm, 473.8 THz and 225 000 km/s. The spot still looks red: only the wavelength changed, not the frequency.'
    },
    {
      title: 'Lambda over ten',
      q: 'A mirror is specified "flat to λ/10 at 632.8 nm". How much may its surface depart from flat, and what does that do to a reflected wave?',
      steps: [
        { text: 'The tolerance on the surface is', tex: '\\frac{632.8\\ \\mathrm{nm}}{10} = 63.3\\ \\mathrm{nm}' },
        'On reflection the light goes in and out over the same bump, so the path changes by twice the height: the reflected wavefront can be wrong by up to 127 nm, λ/5.'
      ],
      a: '63 nm peak to valley on the surface; up to λ/5 (127 nm) of error in the reflected wavefront.'
    }
  ],
  quiz: [
    { q: 'Green light of 550 nm in vacuum enters water ($n = 1.33$). Which statement is true?', choices: ['Its frequency falls to 410 THz and it turns blue-green', 'Its wavelength becomes about 413 nm; its frequency and colour do not change', 'Its wavelength stays at 550 nm; its speed does not change', 'Its frequency rises by 33 %'], a: 1, why: 'The speed falls to $c/n$ and the wavelength shrinks by the same factor, 550/1.33 = 413 nm. The frequency is fixed by the source, and colour follows the frequency, so the light is still green.' },
    { q: 'What is the frequency of the 1550 nm light of a fibre link, in THz?', answer: 193.4, unit: 'THz', why: '$f = c/\\lambda = 2.998\\times10^{8}/1.55\\times10^{-6} = 1.934\\times10^{14}$ Hz = 193.4 THz.' },
    { q: 'A 650 nm red laser has a higher frequency than a 450 nm blue laser.', a: false, why: 'Frequency and wavelength are inversely related, $f = c/\\lambda$. The shorter wavelength, blue, has the higher frequency: 666 THz against 461 THz.' },
    { q: 'Why do data sheets quote the *vacuum* wavelength of a laser rather than its wavelength in the glass or liquid it will work in?', choices: ['Because the wavelength inside a material depends on the material; the vacuum value names the light itself', 'Because light always travels in vacuum', 'Because the frequency changes inside materials', 'Because glass absorbs the other wavelengths'], a: 0, why: 'Inside a medium the wavelength is $\\lambda_0/n$, which differs from material to material, while the vacuum wavelength (with $c$) fixes the frequency and the colour of the light, the same in every medium.' },
    { q: 'Two telecom channels are 100 GHz apart near 1550 nm. About how far apart are they in wavelength?', choices: ['0.08 nm', '0.8 nm', '8 nm', '80 nm'], a: 1, why: '$\\Delta\\lambda = \\lambda^{2}\\Delta f/c = (1550\\ \\mathrm{nm})^{2}\\times10^{11}\\ \\mathrm{Hz}/(2.998\\times10^{17}\\ \\mathrm{nm/s}) = 0.80$ nm.' }
  ],
  applications: [
    'LED and laser data sheets give the peak wavelength in nm and the bandwidth (FWHM) as the two numbers that describe their colour.',
    'Optical-fibre telecommunication assigns channels by frequency (the ITU grid is anchored at 193.1 THz, spaced 100 GHz = 0.8 nm), and translates to wavelength at the transmitter.',
    'Interference filters are specified by centre wavelength and bandwidth: a "532 nm, 10 nm FWHM" filter passes a green laser and blocks the rest.',
    'Optical flats and mirrors are tested with a helium–neon laser at 632.8 nm, and their quality is quoted in fractions of that wavelength.',
    'Infrared spectroscopy identifies chemicals by wavenumber: the C–H stretch absorbs near 2900 cm⁻¹ (3.4 µm).'
  ],
  history: 'Newton split sunlight with a prism in 1666 and named seven colours in *Opticks* (1704). Young (1801) deduced wavelengths from interference. Fraunhofer measured the wavelength of the dark lines of the solar spectrum with a diffraction grating in 1821–23, the first precise values; the ångström (0.1 nm) is named for Anders Ångström, who mapped those lines in 1868.',
  sources: [
    'E. Hecht, *Optics*, ch. 2 (Wave Motion) and ch. 3 (Electromagnetic Theory, Photons and Light) — wavelength, frequency, wave speed.',
    'G. Wyszecki and W. S. Stiles, *Color Science: Concepts and Methods, Quantitative Data and Formulae* — spectral colours and the wavelengths of the spectrum.',
    'ITU-T Recommendation G.694.1, *Spectral grids for WDM applications: DWDM frequency grid* — the 193.1 THz anchor and the 100 GHz spacing.',
    'CIE S 017/E:2011, *International Lighting Vocabulary* — the definitions of wavelength and monochromatic radiation.'
  ],
  sim: 'nl-wavelength-lab'
},

/* ================================================================ the optical spectrum */
{
  id: 'the-optical-spectrum', parent: 'nature-of-light', title: 'The optical spectrum: UV, visible, infrared', level: 1,
  short: 'The optical spectrum runs from ultraviolet (UV-C, UV-B, UV-A) through the visible band at about 380–780 nm to near-, short-, mid- and long-wave infrared. Each band has its own sources, its own glass or crystal that lets it through, and its own detector — which is why a thermal camera has a germanium lens and a germicidal lamp a fused-silica bulb.',
  keywords: ['optical spectrum', 'ultraviolet', 'UV', 'UV-A', 'UV-B', 'UV-C', 'visible', 'infrared', 'IR', 'NIR', 'SWIR', 'MWIR', 'LWIR', 'thermal infrared', 'far infrared', 'atmospheric window', 'vacuum ultraviolet', 'Wien', 'spectral band'],
  prereq: ['wavelength-frequency-and-colour', 'what-is-light'],
  related: ['photon-energy', 'uv-and-infrared-materials', 'infrared-and-thermal-sensors', 'uv-and-infrared-sources', 'quantum-efficiency-and-spectral-response', 'physics:em-spectrum', 'physics:blackbody-radiation', 'laser-safety-classes'],
  body: `
The optical spectrum is one continuous range of wavelength, cut into bands by what people can do with each part. Every band comes with the same three practical questions: what makes it, what lets it through, and what sees it.

### The bands
| Band | Wavelength | Typical uses |
|---|---|---|
| UV-C | 100–280 nm | germicidal lamps (254 nm), chip lithography (193, 248 nm) |
| UV-B | 280–315 nm | sunburn, vitamin D, phototherapy (311 nm) |
| UV-A | 315–400 nm | blacklight (365 nm), UV curing, fluorescence |
| visible | about 380–780 nm | sight, photography, displays |
| near infrared, NIR (IR-A) | 0.78–1.4 µm | remote controls (940 nm), night-vision lighting, Nd:YAG lasers (1064 nm), 1.31 µm telecom |
| short-wave infrared, SWIR (IR-B) | 1.4–3 µm | 1.55 µm fibre telecommunications, sorting of plastics, moisture |
| mid-wave infrared, MWIR | 3–8 µm (window 3–5 µm) | flames, engines, gas imaging |
| long-wave infrared, LWIR | 8–15 µm (window 8–14 µm) | thermal cameras, body heat, CO₂ lasers (10.6 µm) |
| far infrared | beyond 15 µm | cold dust and gas, terahertz |

Boundaries differ a little between standards (ultraviolet ends at 380 or 400 nm), so quote wavelengths as well as names.

### What lets each band through, and what sees it
| Band | Lenses and windows | Detectors |
|---|---|---|
| UV-C | fused silica to 185 nm; CaF₂, MgF₂ below | solar-blind photomultipliers, UV-enhanced silicon |
| UV-A to NIR | glass above about 350 nm; plastics above 390 nm | silicon: CCD, CMOS, photodiodes, to 1.1 µm |
| SWIR | fused silica to 2.1 µm, special glasses | InGaAs, 0.9–1.7 µm |
| MWIR | sapphire (5.5 µm), silicon (1.2–7 µm), CaF₂ | InSb and HgCdTe, cooled |
| LWIR | germanium, ZnSe, ZnS | microbolometers (uncooled), HgCdTe |

Each band has its own hardware because photons of different energy ([[photon-energy]]) interact with different things. Ultraviolet photons break chemical bonds, so glass and plastic absorb them. Visible and near-infrared photons lift electrons across the 1.12 eV gap of silicon. Thermal photons are too feeble for that and are detected by the tiny heating they cause.

### Where the Sun, a lamp and you glow
A hot body emits a smooth spectrum whose peak moves to shorter wavelength as it heats (Wien's law, $\\lambda_{\\max}T = 2898\\ \\mu\\mathrm{m\\,K}$). The Sun, at 5772 K, peaks at 502 nm, in the green. A 3000 K halogen filament peaks at 966 nm, in the near infrared, so most of its output is not light at all. A person at 310 K peaks at 9.3 µm, in the middle of the LWIR window, which is why a thermal camera shows people against a cold sky.

### Windows and gaps
Air is not transparent everywhere. Ozone absorbs below about 300 nm, so no UV-C and little UV-B reaches the ground; water vapour and carbon dioxide black out bands near 1.4, 1.9 and 2.7 µm, at 4.3 µm and from 5 to 8 µm. What remains are the **atmospheric windows**: the visible and near infrared, 1.6 and 2.2 µm, 3–5 µm and 8–14 µm. Below about 200 nm even oxygen absorbs, so 193 nm optics work in purged nitrogen or vacuum (the *vacuum ultraviolet*).

> [!warn] UV-C and UV-B injure eyes and skin, and many infrared sources are dangerous because the eye cannot see them and does not blink. See [[laser-safety-classes]] and [[laser-eye-hazards-and-eyewear]].

> [!key] Optical radiation runs from UV (100–400 nm) through the visible (about 380–780 nm) to the infrared (0.78 µm to 1 mm). Each band has its own sources, glasses and detectors, set by the energy of its photons.
`,
  ideas: [
    'UV is below about 400 nm (UV-A, -B, -C); the visible band is about 380–780 nm; infrared runs from 0.78 µm upward (NIR, SWIR, MWIR, LWIR, far).',
    'Glass lets through about 350 nm to 2 µm; ultraviolet needs fused silica or fluoride crystals, thermal infrared germanium, ZnSe or ZnS.',
    'Silicon detects to about 1.1 µm, InGaAs to 1.7 µm, cooled InSb and HgCdTe into the MWIR, and microbolometers sense 8–14 µm without cooling.',
    'A body at temperature T glows with peak wavelength 2898 µm·K / T: the Sun at 502 nm, a person at 9.3 µm.',
    'The atmosphere leaves windows (visible–NIR, 3–5 µm, 8–14 µm); ozone shields us from UV-C.'
  ],
  pitfalls: [
    'Infrared means heat radiation — Only the long-wave part is thermal glow. The near infrared of a remote control or a night-vision illuminator is not hot; it is just invisible light, and silicon cameras see it.',
    'Any camera lens will do for any band — Ordinary glass blocks the thermal infrared and the deep ultraviolet. A thermal camera needs germanium or similar; a UV camera needs fused silica or fluorite.',
    'A black-and-white sensor sees only visible light — Silicon responds to about 1.1 µm, which is why cameras carry an infrared-blocking filter, and why removing it lets a camera see a remote control flash.',
    'The band names are exact — Standards put the boundaries in slightly different places, and the visible band has no sharp edge. Give the wavelengths.'
  ],
  terms: [
    { term: 'Ultraviolet', also: ['UV', 'UV-A', 'UV-B', 'UV-C'], def: 'Radiation of shorter wavelength than violet, about 100–400 nm. Divided into UV-A (315–400 nm), UV-B (280–315 nm) and UV-C (100–280 nm); the shorter, the more damaging to eyes and skin.' },
    { term: 'Infrared', also: ['IR', 'NIR', 'SWIR', 'MWIR', 'LWIR'], def: 'Radiation of longer wavelength than red, from 0.78 µm to 1 mm. Divided into near (NIR, to 1.4 µm), short-wave (SWIR, to 3 µm), mid-wave (MWIR), long-wave (LWIR, thermal 8–14 µm) and far infrared.' },
    { term: 'Vacuum ultraviolet', also: ['VUV'], def: 'Ultraviolet below about 200 nm, which air (oxygen) absorbs, so instruments must be evacuated or purged with nitrogen.' },
    { term: 'Atmospheric window', def: 'A band of wavelengths in which the atmosphere is transparent, such as the visible, 3–5 µm and 8–14 µm. Imaging through the air works only in these.' },
    { term: 'Wien\'s displacement law', also: ['Wien\'s law'], def: 'The wavelength at which a hot body radiates most strongly is inversely proportional to its absolute temperature: λmax = 2898 µm·K / T.' }
  ],
  formulas: [
    {
      name: 'Wien\'s displacement law',
      expr: 'lp = bW/T', tex: '\\lambda_{\\max} = \\frac{b}{T}',
      vars: {
        lp: { name: 'peak wavelength', q: 'length', unit: 'µm', tex: '\\lambda_{\\max}' },
        bW: { const: 'bW', tex: 'b' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 5772, min: 1, tex: 'T' }
      },
      solveFor: 'lp',
      note: 'For a blackbody; the peak is of the power per unit wavelength.',
      stories: { lp: 'A glowing body is at {T}. At what wavelength does it radiate most strongly?', T: 'A blackbody radiates most strongly at {lp}. What is its temperature?' }
    }
  ],
  examples: [
    {
      title: 'What will a thermal camera see?',
      q: 'Where does the thermal emission of a furnace wall at 1100 K, a person at 310 K and a block of ice at 273 K peak, and in which band is each?',
      steps: [
        { text: 'Apply Wien\'s law, $\\lambda_{\\max} = 2898\\ \\mu\\mathrm{m\\,K}/T$:', tex: '\\frac{2898}{1100} = 2.63\\ \\mu\\mathrm{m} \\qquad \\frac{2898}{310} = 9.35\\ \\mu\\mathrm{m} \\qquad \\frac{2898}{273} = 10.6\\ \\mu\\mathrm{m}' },
        'The furnace peaks at the SWIR edge (and shines visibly red from its short-wavelength tail); the person and the ice both peak in the LWIR window, 8–14 µm.'
      ],
      a: '2.6 µm (short-wave infrared), 9.3 µm and 10.6 µm (both long-wave infrared).'
    },
    {
      title: 'Glass for two lasers',
      q: 'An experiment needs a lens for a 1.55 µm fibre laser and another for a 10.6 µm CO₂ laser. Is N-BK7 glass suitable for either?',
      steps: [
        'N-BK7 transmits from about 350 nm to 2 µm: it passes 1.55 µm but absorbs 10.6 µm completely.',
        'For 10.6 µm a crystal that is clear to 14 µm or beyond is needed: germanium (2–14 µm) or zinc selenide (0.6–16 µm).'
      ],
      a: 'N-BK7 for the 1.55 µm lens; germanium or ZnSe for the 10.6 µm lens.'
    }
  ],
  quiz: [
    { q: 'A thermal camera is used to find a person in a dark field. Which band does the person\'s own glow peak in?', choices: ['visible, about 550 nm', 'near infrared, about 1 µm', 'long-wave infrared, about 9–10 µm', 'ultraviolet'], a: 2, why: 'Wien\'s law: $2898/310 = 9.3$ µm, in the LWIR window of 8–14 µm that the atmosphere passes and that microbolometers detect.' },
    { q: 'Why is a lens for a thermal camera made of germanium rather than N-BK7?', choices: ['Germanium is cheaper', 'N-BK7 absorbs light beyond about 2 µm, while germanium is transparent from 2 to 14 µm', 'Germanium bends visible light better', 'N-BK7 is not available in small sizes'], a: 1, why: 'Glass is opaque to thermal infrared. Germanium transmits across the 8–14 µm window (and is very high in index, about 4, which makes compact lenses).' },
    { q: 'Ordinary window glass lets germicidal UV-C light (254 nm) pass freely.', a: false, why: 'Ordinary glass absorbs below about 320–350 nm; fused silica (to 185 nm) is needed to pass 254 nm, which is why germicidal lamps have quartz envelopes.' },
    { q: 'At what wavelength does the Sun (5772 K) radiate most strongly, in nm?', answer: 502, unit: 'nm', why: '$\\lambda_{\\max} = 2897.8\\ \\mu\\mathrm{m\\,K}/5772\\ \\mathrm{K} = 0.502\\ \\mu\\mathrm{m}$, in the green.' },
    { q: 'A silicon camera is sensitive to light only up to about 1.1 µm. A 1.55 µm telecom laser needs which kind of detector?', choices: ['A bigger silicon sensor', 'InGaAs (or germanium)', 'A photomultiplier with a bialkali cathode', 'A UV-enhanced CCD'], a: 1, why: 'Silicon\'s band gap (1.12 eV) is larger than the 0.80 eV of a 1.55 µm photon, so it cannot absorb it. InGaAs, with a smaller gap, does.' }
  ],
  applications: [
    'Germicidal lamps and water treatment use 254 nm UV-C; the glass envelope must be fused silica.',
    'Chip lithography prints circuits with 193 nm UV-C light in purged optics.',
    'Thermography finds heat leaks in buildings, overheating electrical joints and fever in crowds in the 8–14 µm window.',
    'Fibre telecommunications work at 1.3–1.55 µm, where glass is most transparent; beyond 1.4 µm the cornea absorbs the light, which makes lasers there "eye-safer".',
    'Infrared observatories sit on high mountains or fly above the water vapour, to look through the atmospheric windows.'
  ],
  history: 'William Herschel found infrared radiation in 1800 when a thermometer placed beyond the red end of a prism spectrum of sunlight warmed up. A year later Johann Ritter discovered ultraviolet from the darkening of silver chloride beyond the violet end.',
  sources: [
    'ISO 20473:2007, *Optics and photonics — Spectral bands* — the division into ultraviolet, visible, near-, mid- and far-infrared.',
    'CIE S 017/E:2011, *International Lighting Vocabulary* — the IR-A, IR-B and IR-C bands.',
    'W. L. Wolfe and G. J. Zissis (eds.), *The Infrared Handbook* — atmospheric windows, thermal emission and infrared detectors.',
    'E. Hecht, *Optics*, ch. 3 — the electromagnetic spectrum from radio waves to gamma rays.'
  ],
  sim: 'nl-spectrum-ruler'
},

/* ================================================================ photon energy */
{
  id: 'photon-energy', parent: 'nature-of-light', title: 'Photons and their energy', level: 2,
  short: 'A photon of wavelength λ carries the energy E = hc/λ, which in the units of optics is 1239.84 eV·nm divided by the wavelength in nanometres: 2.25 eV for green, 4.9 eV for a germicidal lamp, 0.117 eV for a CO₂ laser. Whether light can excite a detector, free an electron or break a bond depends on that one number.',
  keywords: ['photon energy', 'E = hc/λ', 'electronvolt', 'eV', 'Planck constant', 'band gap', 'cut-off wavelength', 'work function', 'photoelectric effect', 'threshold', '1240', 'quantum', 'photons per second', 'einstein'],
  prereq: ['what-is-light', 'wavelength-frequency-and-colour', 'physics:photon'],
  related: ['the-optical-spectrum', 'how-a-pixel-detects-light', 'quantum-efficiency-and-spectral-response', 'laser-power-and-energy-measures', 'physics:photoelectric-effect', 'physics:semiconductors', 'chemistry:atomic-spectra'],
  body: `
A photon is a packet of light whose energy is fixed by its frequency, not by how bright the beam is:

$$E = hf = \\frac{hc}{\\lambda}$$

with Planck's constant $h = 6.626\\times10^{-34}$ J·s. Joules are absurdly large for one photon (a green one carries $3.6\\times10^{-19}$ J), so energies are quoted in **electronvolts**: 1 eV $= 1.602\\times10^{-19}$ J, the energy of an electron falling through one volt. In these units the constants collapse into a number every optician learns:

$$E\\,[\\mathrm{eV}] = \\frac{1239.84}{\\lambda\\,[\\mathrm{nm}]}$$

### A scale of photon energies
| Light | Wavelength | Photon energy |
|---|---|---|
| ArF excimer laser (lithography) | 193 nm | 6.42 eV |
| germicidal lamp | 254 nm | 4.88 eV |
| UV-A blacklight | 365 nm | 3.40 eV |
| violet to red (the eye) | 400–700 nm | 3.10–1.77 eV |
| green laser pointer | 532 nm | 2.33 eV |
| Nd:YAG laser | 1064 nm | 1.17 eV |
| fibre telecom | 1550 nm | 0.80 eV |
| CO₂ laser | 10.6 µm | 0.117 eV |

For comparison, the thermal energy $k_BT$ at room temperature is 0.026 eV.

### Thresholds
Matter takes energy from light in lumps of one photon, so one photon must carry **at least** the energy the process needs.
- **A semiconductor detector** responds when $E$ exceeds its band gap. Silicon's 1.12 eV gives a cut-off at 1107 nm, which is why silicon cameras go blind near 1.1 µm; germanium (0.66 eV) reaches 1.88 µm and InGaAs (0.74 eV) 1.68 µm.
- **A metal** releases electrons by the photoelectric effect only if $E$ exceeds its work function (about 2.1 eV for caesium, 4.7 eV for copper). Red light, however intense, never frees an electron from copper; a weak ultraviolet does.
- **A chemical bond** breaks under a photon of about the bond's energy: C–C is 3.6 eV (345 nm), O–H in water 5.2 eV. That is why ultraviolet bleaches paint, cures resin and damages DNA (absorption peaks near 260 nm), while visible and infrared photons are too weak.

Below threshold, more photons do not help: two 1 eV photons arriving together do not add up to one 2 eV photon, except in rare non-linear processes at laser intensities.

### Counting photons
Divide power by photon energy for the rate. A 1 mW beam at 532 nm carries $2.7\\times10^{15}$ photons per second; at 10.6 µm the same power is $5.3\\times10^{16}$, twenty times as many photons of one twentieth the energy. A 1 µJ pulse at 1064 nm holds $5.4\\times10^{12}$ photons. A chemist's mole of green photons, an *einstein*, carries 217 kJ.

> [!tip] A good rule: **E (eV) × λ (nm) ≈ 1240**. A band gap of 1 eV is a cut-off at 1.24 µm; a photon at 620 nm has 2 eV.

> [!key] $E = hc/\\lambda = 1240\\ \\mathrm{eV\\,nm}/\\lambda$. Photon energy depends only on the wavelength, and a detector, a metal or a bond reacts only to photons above its threshold, however many arrive.
`,
  ideas: [
    'E = hf = hc/λ = 1240 eV·nm / λ: shorter wavelength, more energetic photon.',
    'Visible photons carry 1.8–3.1 eV; UV-C photons 4.4–12 eV; thermal infrared photons about 0.1 eV.',
    'A process with a threshold (band gap, work function, bond energy) needs a photon above that energy; more photons of lower energy do not substitute.',
    'Silicon detects to about 1.1 µm because its band gap is 1.12 eV; InGaAs reaches 1.7 µm.',
    'Photons per second = power / (hc/λ): the same power is many more photons at longer wavelength.'
  ],
  pitfalls: [
    'A brighter beam has more energetic photons — Brightness is the number of photons per second; the energy of each depends only on the wavelength.',
    'Infrared heats because its photons are more energetic — They are less energetic than visible ones. Infrared heats because most materials absorb it and turn the energy into motion of atoms; and a lamp or the Sun sends a great many of them.',
    'Intense red light will eventually eject electrons from any metal — Below the threshold energy no photoelectrons appear however intense the light; above it, even faint light releases some.',
    'In glass the photon has less energy because its wavelength is shorter — Its energy is hf, and the frequency is unchanged in glass. The wavelength shrinks, the energy does not.'
  ],
  terms: [
    { term: 'Photon energy', also: ['E = hf', 'E = hc/λ'], def: 'The energy of one photon, E = hf = hc/λ. Independent of the intensity of the beam; shorter wavelength means higher energy.' },
    { term: 'Electronvolt', also: ['eV'], def: 'The energy an electron gains falling through one volt, 1.602 × 10⁻¹⁹ J. The unit in which photon energies and band gaps are quoted.' },
    { term: 'Planck constant', also: ['h'], def: 'The constant of proportionality between a photon\'s frequency and its energy, h = 6.62607015 × 10⁻³⁴ J·s (exact in the SI). The reduced constant is ħ = h/2π.' },
    { term: 'Band gap', also: ['Eg', 'bandgap'], def: 'The energy a semiconductor needs to lift an electron into conduction. Photons below the gap are not absorbed, so it fixes the longest wavelength a detector responds to.' },
    { term: 'Cut-off wavelength', also: ['λc', 'cut-off'], def: 'The longest wavelength a photodetector responds to, λc = hc/Eg = 1240 nm·eV / Eg. About 1107 nm for silicon.' },
    { term: 'Work function', also: ['photoelectric threshold'], def: 'The least energy needed to pull an electron out of a metal surface. A photon of lower energy cannot free an electron by the photoelectric effect.' }
  ],
  formulas: [
    {
      name: 'Photon energy',
      expr: 'E = h*c/lambda', tex: 'E = \\frac{h\\,c}{\\lambda}',
      vars: {
        E: { name: 'photon energy', q: 'energy', unit: 'eV', tex: 'E' },
        h: { const: 'h' },
        c: { const: 'c' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' }
      },
      solveFor: 'E',
      stories: { E: 'How much energy does a photon of {lambda} light carry?', lambda: 'A photon carries {E}. What is its wavelength?' }
    },
    {
      name: 'Cut-off wavelength of a detector',
      expr: 'lc = h*c/Eg', tex: '\\lambda_{c} = \\frac{h\\,c}{E_{g}}',
      vars: {
        lc: { name: 'cut-off wavelength', q: 'length', unit: 'nm', tex: '\\lambda_{c}' },
        h: { const: 'h' },
        c: { const: 'c' },
        Eg: { name: 'band gap', q: 'energy', unit: 'eV', value: 1.12, tex: 'E_{g}' }
      },
      solveFor: 'lc',
      note: 'Silicon 1.12 eV, germanium 0.66 eV, InGaAs 0.74 eV, GaAs 1.42 eV, GaN 3.4 eV (typical, room temperature).',
      stories: { lc: 'A photodiode has a band gap of {Eg}. Beyond what wavelength does it stop responding?', Eg: 'A detector stops responding beyond {lc}. What is its band gap?' }
    },
    {
      name: 'Photons in a pulse',
      expr: 'N = Ep*lambda/(h*c)', tex: 'N = \\frac{E_{p}\\,\\lambda}{h\\,c}',
      vars: {
        N: { name: 'number of photons', tex: 'N' },
        Ep: { name: 'pulse energy', q: 'energy', unit: 'µJ', value: 1, tex: 'E_{p}' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 1064, tex: '\\lambda' },
        h: { const: 'h' },
        c: { const: 'c' }
      },
      solveFor: 'N',
      stories: { N: 'A laser pulse of {Ep} has a wavelength of {lambda}. How many photons does it contain?' }
    }
  ],
  examples: [
    {
      title: 'Why silicon cannot see 1550 nm',
      q: 'A silicon photodiode has a band gap of 1.12 eV. Can it detect the 1550 nm light of a fibre link? What cut-off wavelength does the gap give?',
      steps: [
        { text: 'The 1550 nm photon carries', tex: 'E = \\frac{1239.84}{1550} = 0.80\\ \\mathrm{eV}' },
        { text: 'That is below the gap of 1.12 eV, so the photon cannot lift an electron across it. The longest wavelength silicon can absorb is', tex: '\\lambda_{c} = \\frac{1239.84}{1.12} = 1107\\ \\mathrm{nm}' }
      ],
      a: 'No: 0.80 eV < 1.12 eV. Silicon\'s cut-off is 1107 nm; telecom detectors use InGaAs (0.74 eV, cut-off 1.68 µm) or germanium.'
    },
    {
      title: 'Photons in an excimer pulse',
      q: 'A 193 nm ArF excimer laser delivers pulses of 5 mJ. How many photons are in one pulse?',
      steps: [
        { text: 'One photon:', tex: 'E = \\frac{1239.84}{193} = 6.424\\ \\mathrm{eV} = 1.029\\times10^{-18}\\ \\mathrm{J}' },
        { text: 'So a pulse holds', tex: 'N = \\frac{5\\times10^{-3}\\ \\mathrm{J}}{1.029\\times10^{-18}\\ \\mathrm{J}} = 4.9\\times10^{15}' }
      ],
      a: 'About $4.9\\times10^{15}$ photons per pulse, each energetic enough (6.4 eV) to break most chemical bonds directly.'
    }
  ],
  quiz: [
    { q: 'A 400 nm photon is compared with an 800 nm photon. The 400 nm photon has…', choices: ['half the energy', 'the same energy', 'twice the energy', 'four times the energy'], a: 2, why: '$E \\propto 1/\\lambda$: halving the wavelength doubles the energy (3.10 eV against 1.55 eV).' },
    { q: 'What is the energy of a 620 nm red photon, in eV?', answer: 2.0, unit: 'eV', why: '$E = 1239.84/620 = 2.00$ eV.' },
    { q: 'A very bright red light (1.9 eV photons) shines on copper, whose work function is about 4.7 eV. Electrons are ejected if the light is bright enough.', a: false, why: 'Each photon gives its energy to one electron, and 1.9 eV is less than 4.7 eV. More photons per second does not raise the energy of each one, so no photoelectrons appear.' },
    { q: 'Compare 1 mW at 532 nm with 1 mW at 10.6 µm. Which beam carries more photons per second?', choices: ['The 532 nm beam, by about 20 times', 'The 10.6 µm beam, by about 20 times', 'They carry equal numbers', 'It depends on the beam diameter'], a: 1, why: 'The same power divided by a smaller photon energy (0.117 eV against 2.33 eV) gives more photons: 20 times as many.' },
    { q: 'Why does a silicon camera stop responding near 1.1 µm?', choices: ['Its lens absorbs longer wavelengths', 'Photons beyond 1.1 µm have less energy than silicon\'s 1.12 eV band gap', 'The infrared-blocking filter is too thick', 'Infrared photons have more energy than silicon can handle'], a: 1, why: 'A photon needs at least the band-gap energy to lift an electron into conduction. At 1107 nm the photon energy equals the gap; beyond it, it is too weak.' }
  ],
  applications: [
    'Image sensors, solar cells and photodiodes: the band gap sets the longest wavelength detected (silicon 1.1 µm, InGaAs 1.7 µm).',
    'Photolithography uses 193 nm photons because their short wavelength gives fine detail and their 6.4 eV breaks bonds in the photoresist.',
    'UV disinfection works because 254 nm photons (4.9 eV) are absorbed by DNA and damage it.',
    'Photomultipliers and photocathodes are chosen by work function: caesium-based surfaces respond into the red.',
    'Laser safety distinguishes the photochemical hazard of UV and blue photons from the thermal hazard of infrared.'
  ],
  history: 'Planck (1900) introduced the quantum of energy to fit the spectrum of hot bodies. Einstein (1905) proposed that light itself comes in quanta and used them to explain the photoelectric effect; Millikan\'s careful measurements (1916) confirmed his law and gave a value of h. G. N. Lewis named the photon in 1926. Since 2019 Planck\'s constant is fixed exactly in the SI and defines the kilogram.',
  sources: [
    'E. Hecht, *Optics*, ch. 3 — photons, and the photoelectric effect.',
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, ch. 12 (Photon Optics) — photon energy, flux and statistics.',
    'S. M. Sze and K. K. Ng, *Physics of Semiconductor Devices* — band gaps of silicon, germanium, GaAs and the III–V alloys.',
    'BIPM, *The International System of Units (SI Brochure)* — the exact value of the Planck constant.'
  ],
  sim: 'nl-photon-ladder'
},

/* ================================================================ refractive index */
{
  id: 'refractive-index', parent: 'nature-of-light', title: 'The refractive index', level: 1,
  short: 'The refractive index n of a material is the speed of light in vacuum divided by its speed in the material: n = c/v. It is 1.0003 for air, 1.33 for water, 1.52 for crown glass and 2.42 for diamond. It sets the wavelength inside the material, how much a surface reflects and how strongly a lens bends light, and it varies a little with colour.',
  keywords: ['refractive index', 'index of refraction', 'n', 'optical density', 'speed of light in glass', 'nd', 'index at the d line', 'group index', 'relative index', 'glass code', 'dispersion', 'index matching', 'phase velocity'],
  prereq: ['wavelength-frequency-and-colour', 'what-is-light'],
  related: ['snells-law', 'fresnel-reflection', 'dispersion-and-the-spectrum', 'the-abbe-number-and-glass-map', 'optical-glass', 'dispersion-formulas', 'optical-path-length', 'gradient-index-optics', 'physics:refraction', 'feynman:origin-of-refractive-index'],
  body: `
The **refractive index** $n$ of a material says how much slower light travels in it than in vacuum:

$$n = \\frac{c}{v}$$

In water ($n = 1.333$) light moves at 225 000 km/s, in N-BK7 glass at 197 600 km/s and in diamond at only 124 000 km/s. The index is a ratio of two speeds, so it has no unit, and for visible light in ordinary matter it is always above 1.

### Typical values
| Material | n at 587.6 nm | Speed (10⁸ m/s) |
|---|---|---|
| vacuum | 1 exactly | 2.998 |
| air (15 °C, 1 atm) | 1.00028 | 2.997 |
| water | 1.333 | 2.249 |
| fused silica | 1.459 | 2.056 |
| acrylic (PMMA) | 1.492 | 2.010 |
| crown glass N-BK7 | 1.517 | 1.976 |
| polycarbonate | 1.586 | 1.891 |
| sapphire | 1.768 | 1.696 |
| dense flint N-SF11 | 1.785 | 1.680 |
| diamond | 2.418 | 1.240 |
| germanium (at 10 µm) | 4.00 | 0.749 |

In the eye the cornea is 1.377, the aqueous humour 1.337 and the lens about 1.42.

### What the index controls
- **Wavelength.** The frequency is fixed, so $\\lambda = \\lambda_0/n$ ([[wavelength-frequency-and-colour]]).
- **Direction.** At a boundary a ray turns by [[snells-law|Snell's law]], $n_1\\sin\\theta_1 = n_2\\sin\\theta_2$.
- **Reflection.** At normal incidence a surface reflects $R = \\big((n_2-n_1)/(n_2+n_1)\\big)^2$: 2 % for water in air, 4 % for glass, 17 % for diamond, 36 % for germanium ([[fresnel-reflection]]).
- **Lens power.** What counts is the *relative* index of lens to surroundings. A glass lens of 100 mm focal length in air has 375 mm in water, since $1.517/1.333 - 1 = 0.14$ against 0.52. A swimmer's eye is out of focus for the same reason: the cornea (1.377) has almost no step against water (1.333).

### Why light is slower in matter
The wave shakes the electrons of the atoms, which radiate waves of their own; the sum of the original and the secondary waves has the same frequency but a slower crest speed ([[feynman:origin-of-refractive-index|Feynman's account]]). The picture of photons absorbed and re-emitted one after another is wrong: that would scatter light everywhere.

### The index depends on colour
N-BK7 has $n$ = 1.531 at 400 nm, 1.5185 at 550 nm and 1.513 at 700 nm; dense flint N-SF11 has 1.845, 1.791 and 1.772. Catalogues quote the index at the helium d line, 587.56 nm: $n_d = 1.5168$ for N-BK7, whose six-digit code 517642 means $n_d = 1.517$ and Abbe number 64.2. This spread is [[dispersion-and-the-spectrum|dispersion]] ([[the-abbe-number-and-glass-map]]). A pulse of light travels at $c/n_g$, with the **group index** $n_g = n - \\lambda\\,\\mathrm{d}n/\\mathrm{d}\\lambda$ somewhat larger: 1.546 for N-BK7 at 550 nm.

### Air is not exactly 1
Air has $n - 1 = 2.8\\times10^{-4}$, proportional to its density. A 1 K change of temperature or a 4 hPa change of pressure shifts $n$ by one part per million: over 1 m that is a micrometre, nearly two green wavelengths, which long interferometers must correct for.

> [!key] $n = c/v$. It sets the wavelength inside ($\\lambda_0/n$), the bending and reflection at surfaces, and the power of lenses, and it falls slightly from blue to red. Quote it with its wavelength: $n_d$ is at 587.56 nm.
`,
  ideas: [
    'n = c/v: 1 for vacuum, 1.33 for water, 1.5 for glass, 2.4 for diamond; light is that much slower inside.',
    'Inside a material the frequency is unchanged, the wavelength is λ₀/n, and the colour is the same.',
    'The index decides how a ray bends at a surface, how much light a surface reflects, and a lens\'s power; a lens works through the relative index to its surroundings.',
    'n depends on wavelength (blue is slowed more), on temperature and, in crystals, on direction; quote it at a stated wavelength, usually n_d at 587.56 nm.',
    'Pulses travel at c/n_g with the group index n_g, slightly larger than n.'
  ],
  pitfalls: [
    'A higher index means a heavier, denser material — Optical density is not mass density. Acrylic is half as dense as crown glass and has almost its index (1.49 against 1.52).',
    'Light is slower in glass because photons are absorbed and re-emitted in turn — The slowing is a property of the wave: the material\'s own radiation adds to the incident wave. Absorption and re-emission would scatter light in random directions.',
    'The refractive index is one number for a material — It changes with wavelength, temperature and, in crystals, with direction and polarization. Always say at what wavelength: n_d is at 587.56 nm.',
    'c/n is the speed of every kind of light signal — It is the speed of the crests. A pulse travels at c/n_g, and n_g is larger than n in ordinary glass.'
  ],
  terms: [
    { term: 'Refractive index', also: ['index of refraction', 'n'], def: 'The ratio c/v of the speed of light in vacuum to its speed in a material. It sets the wavelength in the material (λ₀/n) and how light bends and reflects at its surface.' },
    { term: 'Optical density', also: ['optically denser'], def: 'Informal: having a higher refractive index. Not the same as mass density, nor as the optical density (OD) of a filter.' },
    { term: 'Index at the d line', also: ['nd', 'n_d'], def: 'The refractive index at 587.56 nm, the yellow helium d line, at which glass catalogues quote their materials.' },
    { term: 'Group index', also: ['ng', 'n_g'], def: 'The index that gives the speed of a light pulse, c/n_g, where n_g = n − λ dn/dλ. Larger than n wherever the material shows normal dispersion.' },
    { term: 'Relative index', also: ['n₂₁'], def: 'The ratio of the index of one medium to that of another, such as a lens in water. What bends a ray at an interface, and what gives a lens its power in a surrounding medium.' }
  ],
  formulas: [
    {
      name: 'Speed of light in a medium',
      expr: 'v = c/n', tex: 'v = \\frac{c}{n}',
      vars: {
        v: { name: 'speed of light in the medium', q: 'speed', unit: 'km/s', tex: 'v' },
        c: { const: 'c' },
        n: { name: 'refractive index', value: 1.5168, min: 1, max: 4, tex: 'n' }
      },
      solveFor: 'v',
      stories: { v: 'How fast does light travel in a material of refractive index {n}?', n: 'Light travels at {v} in a transparent material. What is its refractive index?' }
    },
    {
      name: 'Relative index',
      expr: 'n21 = n2/n1', tex: 'n_{21} = \\frac{n_2}{n_1}',
      vars: {
        n21: { name: 'relative index', tex: 'n_{21}' },
        n1: { name: 'index of the surroundings', value: 1.333, min: 1, max: 4, tex: 'n_1' },
        n2: { name: 'index of the object', value: 1.5168, min: 1, max: 4, tex: 'n_2' }
      },
      solveFor: 'n21',
      note: 'A lens\'s power is proportional to n21 − 1. Glass in water: 1.138, only 27 % of the power it has in air.'
    },
    {
      name: 'Reflectance at normal incidence',
      expr: 'R = ((n1 - n2)/(n1 + n2))^2', tex: 'R = \\left(\\frac{n_1 - n_2}{n_1 + n_2}\\right)^{2}',
      vars: {
        R: { name: 'fraction of the light reflected', q: 'ratio', unit: '%', tex: 'R' },
        n1: { name: 'index of the first medium', value: 1, min: 1, max: 4, tex: 'n_1' },
        n2: { name: 'index of the second medium', value: 1.5168, min: 1, max: 4, tex: 'n_2' }
      },
      solveFor: 'R',
      note: 'Head-on, either direction, no absorption. Away from normal incidence see the Fresnel equations.',
      stories: { R: 'Light travelling in a medium of index {n1} strikes, head-on, a medium of index {n2}. What fraction is reflected?' }
    }
  ],
  examples: [
    {
      title: 'A glass lens in water',
      q: 'A thin lens of N-BK7 ($n = 1.517$) has a focal length of 100 mm in air. What is it in water ($n = 1.333$)?',
      steps: [
        'The power of a thin lens is proportional to the relative index minus one: $1/f \\propto n_\\mathrm{lens}/n_\\mathrm{medium} - 1$.',
        { text: 'In air this is 0.517; in water', tex: '\\frac{1.517}{1.333} - 1 = 0.138' },
        { text: 'The focal length scales inversely:', tex: 'f_\\mathrm{water} = 100\\ \\mathrm{mm}\\times\\frac{0.517}{0.138} = 375\\ \\mathrm{mm}' }
      ],
      a: 'About 375 mm: 3.7 times longer. Lenses lose most of their power under water, which is why diving masks put air in front of the eye.'
    },
    {
      title: 'A race across a pool',
      q: 'How much longer does light take to travel the 25 m length of a pool in water ($n = 1.333$) than in air?',
      steps: [
        { text: 'In air, $t = d/c = 25/2.998\\times10^{8} = 83.4$ ns. In water the speed is $c/n$, so', tex: 't = \\frac{n\\,d}{c} = \\frac{1.333\\times25}{2.998\\times10^{8}} = 111.2\\ \\mathrm{ns}' }
      ],
      a: '111 ns against 83 ns: 28 ns more.'
    }
  ],
  quiz: [
    { q: 'What fraction of $c$ is the speed of light in diamond ($n = 2.42$)?', choices: ['about 24 %', 'about 41 %', 'about 59 %', 'about 142 %'], a: 1, why: '$v/c = 1/n = 1/2.42 = 0.41$: in diamond light covers only about 41 % of the distance it would cover in vacuum in the same time.' },
    { q: 'When light passes from air into glass its frequency decreases by the factor $n$.', a: false, why: 'The frequency is fixed by the source and does not change. The speed and the wavelength both fall by the factor $n$.' },
    { q: 'Acrylic has a mass density of 1.19 g/cm³ and $n = 1.49$; water has 1.00 g/cm³ and $n = 1.33$. Which bends light more at a surface in air?', choices: ['Water, because it is lighter', 'Acrylic, because its index is higher', 'They bend equally: only density counts', 'Neither: only the thickness counts'], a: 1, why: 'Refraction depends on the refractive index, not on mass density. The higher index of acrylic bends rays more.' },
    { q: 'How fast does light travel in water ($n = 1.333$), in m/s?', answer: 2.249e8, unit: 'm/s', why: '$v = c/n = 2.998\\times10^{8}/1.333 = 2.249\\times10^{8}$ m/s.' },
    { q: 'A glass lens is carried from air into water. Its focal length…', choices: ['becomes shorter', 'stays the same', 'becomes about four times longer', 'becomes negative'], a: 2, why: 'Its power depends on the relative index $n_\\mathrm{lens}/n_\\mathrm{medium} - 1$, which falls from 0.52 to 0.14. The focal length grows by about 3.7 times.' }
  ],
  applications: [
    'Lens and prism design: every glass is chosen by its index and Abbe number; a catalogue lists them as a six-digit code such as 517642.',
    'Refractometers read the sugar content of fruit juice, the strength of battery acid or antifreeze, and identify gemstones from their index (diamond 2.42, cubic zirconia about 2.15).',
    'Optical fibres guide light because the core\'s index is a fraction of a per cent higher than the cladding\'s.',
    'Index-matching liquids and immersion oil (n about 1.515) remove reflections at a surface and let a microscope objective gather more light.',
    'Anti-reflection coatings use layers of intermediate index; magnesium fluoride (1.38) is the classic choice for glass.'
  ],
  history: 'Snell (1621) and Descartes (1637) found the law that defines the index as a ratio of sines. Newton\'s particle theory predicted that light speeds up in glass, Huygens\' wave theory that it slows down. In 1850 Foucault, and independently Fizeau, measured the speed of light in water with a rotating mirror and found it lower than in air, deciding the question for waves.',
  sources: [
    'E. Hecht, *Optics*, ch. 3 (Electromagnetic Theory, Photons and Light) and ch. 4 (The Propagation of Light) — the index and its origin in the response of matter.',
    'R. P. Feynman, R. B. Leighton and M. Sands, *The Feynman Lectures on Physics*, vol. I, ch. 31 (Origin of the Refractive Index).',
    'Glass manufacturers\' technical information paper TIE-29, *Refractive Index and Dispersion* — n_d, the Abbe number and the six-digit glass code.',
    'F. A. Jenkins and H. E. White, *Fundamentals of Optics*, ch. 1 and 2 — the speed of light in matter and the refraction law.'
  ],
  sim: 'nl-index-lab'
},

/* ================================================================ optical path length */
{
  id: 'optical-path-length', parent: 'nature-of-light', title: 'Optical path length', level: 2,
  short: 'The optical path length of a ray is the sum of refractive index times geometric length, OPL = Σ nᵢdᵢ: the distance light would cover in vacuum in the same time. Divided by the wavelength it counts the wave cycles along the path, which is why interferometers, lens designers and Fermat\'s principle all work in optical path rather than in metres.',
  keywords: ['optical path length', 'OPL', 'optical path difference', 'OPD', 'phase', 'n d', 'wavelength count', 'interferometer', 'fringes', 'wavefront error', 'equal path', 'time of flight', 'optical thickness'],
  prereq: ['refractive-index', 'wavelength-frequency-and-colour'],
  related: ['fermats-principle', 'rays-and-wavefronts', 'superposition-and-phase', 'constructive-and-destructive-interference', 'michelson-interferometer', 'thin-film-interference', 'wavefront-error-and-zernike-polynomials', 'strehl-ratio-and-diffraction-limited'],
  body: `
Light needs the same time to cross 1 mm of glass ($n = 1.5$) as to cross 1.5 mm of vacuum, and fits 1.5 times as many wavelengths into the glass. Optics keeps both facts in one number, the **optical path length**:

$$\\mathrm{OPL} = n\\,d \\qquad\\text{and, through several media,}\\qquad \\mathrm{OPL} = \\sum_i n_i\\,d_i$$

Divided by $c$ it is the travel time; divided by the vacuum wavelength it is the number of wave cycles along the path, and $2\\pi$ times that is the **phase** the wave has accumulated:

$$\\varphi = 2\\pi\\,\\frac{\\mathrm{OPL}}{\\lambda_0}$$

### Phase is what counts
A plate of N-BK7 5 mm thick has an OPL of 7.593 mm at 550 nm; the 5 mm of air it displaces has 5.000 mm. The plate adds 2.593 mm, or **4714 wavelengths**, of delay — although the light inside is only a few millimetres further along.

| Path | Geometric length | OPL |
|---|---|---|
| air | 1 m | 1.000277 m |
| N-BK7 glass | 5 mm | 7.593 mm |
| water | 1 mm | 1.334 mm |
| soap film, $n = 1.33$ | 400 nm | 532 nm |
| optical fibre ($n \\approx 1.468$) | 1 km | 1468 m (4.9 µs) |

### Optical path difference
When two beams meet, what matters is the **optical path difference**, OPD, between their routes. If it is a whole number of wavelengths the crests coincide and the beams add; if it is an odd number of half wavelengths they cancel ([[constructive-and-destructive-interference]]). An interferometer reads the OPD directly: moving the mirror of a [[michelson-interferometer|Michelson interferometer]] by 1 mm changes the OPD by 2 mm and sweeps $2\\times10^{-3}/632.8\\times10^{-9} = 3161$ fringes of a helium–neon laser. Counting fringes measures displacement to about 3 nm.

### Why lens designers count it too
A lens focuses because it makes the optical path equal along every ray from an object point to its image: the middle of a convex lens is thick, so a ray through it travels many wavelengths in glass but a short geometric distance, and an edge ray makes up the difference in air. That is [[fermats-principle|Fermat's principle]] at work. A real lens misses the ideal by small optical path differences, the [[wavefront-error-and-zernike-polynomials|wavefront error]], quoted in waves: an error of $\\lambda/14$ rms is the classical limit of "diffraction-limited" ([[strehl-ratio-and-diffraction-limited]]).

### Cautions
- The OPL depends on wavelength through $n(\\lambda)$, so white-light interferometers see coloured fringes.
- Reflection off a denser medium adds a half-wave phase jump of its own ([[thin-film-interference]]).
- The OPL is the *phase* delay. A pulse is delayed by the OPL computed with the group index.

> [!key] $\\mathrm{OPL} = \\sum n_i d_i$ is the path in vacuum-equivalent metres. OPL / $\\lambda_0$ counts wave cycles; the difference of two OPLs, the OPD, decides whether beams reinforce or cancel.
`,
  ideas: [
    'OPL = Σ nᵢdᵢ: each stretch of path counts n times its length.',
    'OPL / c is the travel time and OPL / λ₀ the number of wave cycles; 2π × that is the accumulated phase.',
    'Two beams reinforce when their optical path difference is a whole number of wavelengths and cancel at an odd number of half wavelengths.',
    'A plate of thickness t and index n adds (n − 1)t to the path: 5 mm of N-BK7 adds 2.59 mm, 4714 wavelengths of green light.',
    'A focusing lens makes the OPL equal along all rays from object to image.'
  ],
  pitfalls: [
    'Optical path is the same as geometric distance — It is n times the distance, summed over the media crossed. In air they agree to 0.03 %; in glass they differ by 50 %.',
    'Two equally long routes always arrive in step — Equal geometric lengths through different materials give different OPLs: a glass plate in one arm shifts the fringes by thousands of wavelengths.',
    'Optical path length is the time the light takes — It is proportional to it (time = OPL/c) but has the dimension of length: the distance the light would have covered in vacuum.',
    'The OPD in a Michelson interferometer equals the mirror movement — The light passes the mirror twice, so the OPD changes by twice the displacement: one fringe per half wavelength.'
  ],
  terms: [
    { term: 'Optical path length', also: ['OPL'], def: 'The sum of refractive index times geometric length along a ray, Σ n d: the distance light would travel in vacuum in the same time. Divided by the wavelength it gives the number of waves along the path; the difference of two such paths decides whether beams reinforce or cancel.' },
    { term: 'Phase delay', also: ['retardation'], def: 'The extra phase a wave accumulates in a material compared with the same distance of air: 2π (n − 1) t / λ₀ for a plate of thickness t. A delay of 360° is one whole wavelength of extra path.' },
    { term: 'Group delay', def: 'The time by which a pulse of light is delayed in passing through a material: n_g d / c, with the group index n_g, rather than the n d / c that gives the delay of the crests.' }
  ],
  formulas: [
    {
      name: 'Optical path length',
      expr: 'L = n*d', tex: 'L = n\\,d',
      vars: {
        L: { name: 'optical path length', q: 'length', unit: 'mm', tex: 'L' },
        n: { name: 'refractive index', value: 1.5185, min: 1, max: 4, tex: 'n' },
        d: { name: 'geometric length', q: 'length', unit: 'mm', value: 5, tex: 'd' }
      },
      solveFor: 'L',
      stories: { L: 'Light crosses {d} of a material of index {n}. What is the optical path length?' }
    },
    {
      name: 'Extra path added by a plate',
      expr: 'dL = (n - 1)*t', tex: '\\Delta L = (n - 1)\\,t',
      vars: {
        dL: { name: 'extra optical path', q: 'length', unit: 'µm', tex: '\\Delta L' },
        n: { name: 'refractive index of the plate', value: 1.5185, min: 1, max: 4, tex: 'n' },
        t: { name: 'thickness of the plate', q: 'length', unit: 'mm', value: 5, tex: 't' }
      },
      solveFor: 'dL',
      note: 'Compared with the same thickness of air (n = 1).'
    },
    {
      name: 'Number of waves in a path difference',
      expr: 'N = dL/lambda', tex: 'N = \\frac{\\Delta L}{\\lambda_{0}}',
      vars: {
        N: { name: 'number of wavelengths', tex: 'N' },
        dL: { name: 'optical path difference', q: 'length', unit: 'µm', value: 2592.6, tex: '\\Delta L' },
        lambda: { name: 'vacuum wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda_{0}' }
      },
      solveFor: 'N',
      note: 'Whole numbers: beams in step (bright). Half-integers: out of step (dark).',
      stories: { N: 'Two beams differ in optical path by {dL}. How many wavelengths of {lambda} light is that?' }
    },
    {
      name: 'Travel time along an optical path',
      expr: 't = L/c', tex: 't = \\frac{L}{c}',
      vars: {
        t: { name: 'travel time', q: 'time', unit: 'ns' },
        L: { name: 'optical path length', q: 'length', unit: 'm', value: 1468, tex: 'L' },
        c: { const: 'c' }
      },
      solveFor: 't',
      note: 'For a pulse, use the group index in the optical path.'
    }
  ],
  examples: [
    {
      title: 'A glass plate in one arm',
      q: 'In a Mach–Zehnder interferometer a plate of N-BK7 ($n = 1.5185$ at 550 nm), 5 mm thick, is slid into one arm. By how many fringes does the pattern move?',
      steps: [
        { text: 'The plate replaces 5 mm of air by 5 mm of glass, adding', tex: '\\Delta L = (n - 1)\\,t = 0.5185\\times5\\ \\mathrm{mm} = 2.593\\ \\mathrm{mm}' },
        { text: 'In wavelengths of 550 nm:', tex: 'N = \\frac{2.593\\times10^{-3}}{550\\times10^{-9}} = 4714' }
      ],
      a: 'About 4714 fringes (the beam passes the plate once). That is why interferometers keep glass in both arms, and why a plate\'s thickness is measured to a fraction of a micrometre.'
    },
    {
      title: 'The delay of a fibre',
      q: 'How long does light take to travel 1 km in optical fibre of index 1.468, and how much longer is that than in air?',
      steps: [
        { text: 'The optical path is $1.468\\times1000 = 1468$ m, so', tex: 't = \\frac{L}{c} = \\frac{1468}{2.998\\times10^{8}} = 4.90\\ \\mu\\mathrm{s}' },
        'In air it would take 3.34 µs: the fibre adds 1.56 µs per kilometre.'
      ],
      a: '4.9 µs per kilometre (about 5 ms over 1000 km), which is the minimum delay of any fibre link.'
    }
  ],
  quiz: [
    { q: 'A beam crosses 10 mm of glass ($n = 1.5$) and then 10 mm of air. What is its optical path length?', choices: ['20 mm', '25 mm', '30 mm', '15 mm'], a: 1, why: '$\\mathrm{OPL} = 1.5\\times10 + 1.0\\times10 = 25$ mm.' },
    { q: 'A film of thickness 2 µm and index 1.5 is placed in one arm of an interferometer using 500 nm light. The beams, previously in step, are now…', choices: ['in step again (bright)', 'exactly out of step (dark)', 'a quarter wave out of step', 'unaffected'], a: 0, why: 'The extra path is $(n - 1)t = 0.5\\times2\\ \\mu\\mathrm{m} = 1\\ \\mu\\mathrm{m} = 2$ wavelengths of 500 nm: a whole number, so the crests coincide again.' },
    { q: 'The optical path length of a ray in glass is always shorter than its geometric length.', a: false, why: '$n > 1$ in glass, so $nd > d$: the optical path is longer. It equals the distance light would cover in vacuum in the same time, which is more than the distance it covers in the glass.' },
    { q: 'The mirror of a Michelson interferometer is moved by 0.1 mm. About how many fringes of a 632.8 nm laser pass?', answer: 316, why: 'The light travels to the mirror and back, so the OPD changes by 0.2 mm: $0.2\\times10^{-3}/632.8\\times10^{-9} = 316$ fringes.' },
    { q: 'Why does a lens focus a point of light to a point?', choices: ['Because rays always bend towards the axis', 'Because the optical path length from the object point to the image point is the same along every ray', 'Because glass is denser than air', 'Because light prefers the shortest geometric path'], a: 1, why: 'The thick middle of the lens adds optical path to the short central ray, the edge rays travel farther in air: all arrive in step, and their waves add at the image point.' }
  ],
  applications: [
    'Interferometers measure length, flatness and refractive index by counting fringes of OPD; a Michelson with a helium–neon laser resolves a few nanometres.',
    'Lens design software optimises the OPD across the pupil; "wavefront error 0.07 λ rms" is a specification of image quality.',
    'Optical coherence tomography matches the OPL of a reference arm to that of a reflection inside tissue, to find its depth within micrometres.',
    'Fibre delay lines and links: latency is OPL / c, about 4.9 µs per kilometre.',
    'Anti-reflection and mirror coatings are layers a quarter-wave thick in optical path: $n d = \\lambda/4$ ([[thin-film-interference]]).'
  ],
  history: 'Fermat\'s principle (1657–62) stated that light takes the path of least time, which is the path of least optical length. W. R. Hamilton (1828–37) made the optical path between two points, as a function of their positions, the foundation of a complete theory of ray optics, the "characteristic function" that later gave classical mechanics its Hamiltonian form.',
  sources: [
    'M. Born and E. Wolf, *Principles of Optics*, ch. 3 (Foundations of Geometrical Optics) — optical path length and the eikonal.',
    'E. Hecht, *Optics*, ch. 4 (The Propagation of Light) and ch. 9 (Interference) — optical path difference.',
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, ch. 1 (Ray Optics) — optical path length and Fermat\'s principle.',
    'D. Malacara (ed.), *Optical Shop Testing* — wavefront error and its measurement in waves.'
  ],
  sim: 'nl-optical-path'
},

/* ================================================================ rays and wavefronts */
{
  id: 'rays-and-wavefronts', parent: 'nature-of-light', title: 'Rays and wavefronts', level: 1,
  short: 'A wavefront is a surface on which a light wave has the same phase; a ray is a line perpendicular to the wavefronts that shows where the light\'s energy goes. A point makes spherical fronts and diverging rays, a distant source plane fronts and parallel rays, and a lens turns one into the other. The ray picture works while everything is much bigger than a wavelength and fails at foci and edges.',
  keywords: ['ray', 'wavefront', 'plane wave', 'spherical wave', 'vergence', 'normal to wavefront', 'ray optics', 'geometrical optics', 'sagitta', 'Fresnel number', 'collimated', 'focus', 'diffraction limit', 'Malus'],
  prereq: ['what-is-light', 'optical-path-length'],
  related: ['light-sources-and-beams', 'huygens-construction', 'fermats-principle', 'what-diffraction-is', 'focal-length-and-optical-power', 'wavefront-error-and-zernike-polynomials', 'the-airy-disk', 'birefringence'],
  body: `
Drop a pebble in a pond: each crest is a circle, and the circles grow outwards. Light does the same in three dimensions. A **wavefront** is a surface joining all the points where the wave has the same phase, the crests for instance. A **ray** is a line drawn perpendicular to the wavefronts, in the direction in which the wave's energy flows.

### Shapes of wavefront
| Source | Wavefronts | Rays |
|---|---|---|
| a point (filament, pinhole) | expanding spheres | diverge from the point |
| a very distant source (Sun, star) | planes | parallel |
| a lens focusing a plane wave | spheres shrinking onto the focus | converge on it |
| the same, past the focus | expanding spheres | diverge again |

A lens reshapes wavefronts: it delays the middle of a plane wave more than its edge, because there is more glass in the middle, and so bends the front into a sphere. The sphere's radius $R$ is the distance to the focus; its inverse, the **vergence** $V = 1/R$ in dioptres, is what a lens adds to a wave ([[focal-length-and-optical-power]]). A point 25 cm away sends out light of vergence −4 D, and a +4 D lens makes it parallel.

### How flat is "flat"?
Across an aperture of half-width $r$, a spherical wavefront of radius $R$ departs from a plane by the **sagitta** $s \\approx r^2/2R$. For a 100 mm aperture and a source 1 m away that is 1.25 mm, or 2270 wavelengths of green light: plainly curved. For the Sun, $R = 1.5\\times10^{11}$ m and across a 1 m mirror $s$ is 0.8 pm, a millionth of a wavelength: the front is a plane and the rays are parallel.

### What rays are good for
Rays follow from the wave. Each front advances $c/n$ per unit time along every ray, so a front's shape changes only through the different delays along different rays ([[fermats-principle]], [[huygens-construction]]). Where rays crowd together the light is intense; a lens designer traces thousands of them to predict an image.

### When the ray picture fails
Rays are straight and independent only while nothing varies across a wavelength. Light spreads at edges and small apertures ([[what-diffraction-is|diffraction]]), and the test is the **Fresnel number** $N_F = a^2/(\\lambda L)$ for an aperture of radius $a$ seen from a distance $L$. A 25 mm lens at 1 m has $N_F = 284$: shadows are sharp, rays rule. A hole of 1 mm radius, 0.5 m from a screen, has $N_F = 3.6$ and shows fringes at its edge; below about 1 diffraction dominates. Rays also fail at a focus, where they predict a point of infinite brightness while the wave makes an [[the-airy-disk|Airy disc]] of diameter $2.44\\,\\lambda N$ (1.3 µm at f/1), and in structures a few wavelengths across, such as a 9 µm fibre core.

Even perpendicularity has an exception: in a birefringent crystal the energy flows several degrees away from the wave normal (calcite "walk-off", [[birefringence]]).

> [!key] A ray is the normal to a wavefront. Point sources give spherical fronts, distant ones planes, and a lens changes one into the other; rays are accurate while the Fresnel number is large and fail near foci and edges.
`,
  ideas: [
    'A wavefront joins points of equal phase; a ray is the line perpendicular to it, along which the energy flows.',
    'A point source has spherical wavefronts and diverging rays; a very distant one has plane fronts and parallel rays.',
    'A lens bends a plane front into a sphere that closes on the focus; the curvature 1/R of a front is its vergence in dioptres.',
    'The sagitta r²/2R tells how far a front is from flat: 1.25 mm over 100 mm at 1 m, a millionth of a wavelength for sunlight over a metre.',
    'Rays fail when the Fresnel number a²/λL is near 1 or less, at foci and in tiny structures.'
  ],
  pitfalls: [
    'A ray is a thin beam of light — It is a construction: a line showing the direction of travel. A real thin beam spreads by diffraction: a 1 mm beam of green light diverges by about 0.5 mrad however well it is made.',
    'Wavefronts are the lines along which light travels — They are the surfaces of equal phase and are perpendicular to the rays. Light goes through the fronts, not along them.',
    'A lens brings light to a point — The ray picture says so, the wave makes a disc: a lens of f-number N focuses to an Airy disc of diameter 2.44 λN.',
    'Rays are always perpendicular to wavefronts — In ordinary (isotropic) materials. In a birefringent crystal the energy ray of the extraordinary wave leaves the wave normal by several degrees.'
  ],
  terms: [
    { term: 'Wavefront', def: 'A surface on which the phase of a wave is the same, such as the crests. It moves at c/n and is perpendicular to the rays.' },
    { term: 'Ray', also: ['light ray'], def: 'A line perpendicular to the wavefronts, showing the direction in which light energy travels. Straight in a uniform medium, bent at surfaces and in graded media.' },
    { term: 'Spherical wave', def: 'A wave whose wavefronts are spheres centred on a point: that of a point source, or of light converging to a focus.' },
    { term: 'Sagitta', also: ['sag'], def: 'The height by which a curved surface or wavefront departs from a plane over a given half-width r: s ≈ r²/2R for a sphere of radius R. Quoted in micrometres, or in wavelengths for a wavefront.' },
    { term: 'Geometrical optics', also: ['ray optics'], def: 'The description of light by rays that travel in straight lines in uniform media and bend at surfaces. Accurate while every dimension is much larger than the wavelength.' }
  ],
  formulas: [
    {
      name: 'Sagitta of a wavefront',
      expr: 's = r^2/(2*Rw)', tex: 's = \\frac{r^{2}}{2R}',
      vars: {
        s: { name: 'departure from flat at the edge', q: 'length', unit: 'µm', tex: 's' },
        r: { name: 'half-width of the aperture', q: 'length', unit: 'mm', value: 50, tex: 'r' },
        Rw: { name: 'radius of the wavefront', q: 'length', unit: 'm', value: 1, tex: 'R' }
      },
      solveFor: 's',
      note: 'Valid for r much smaller than R. Compare with the wavelength: 1 µm is about 1.8 waves of green light.',
      stories: { s: 'A point source sits {Rw} from an aperture of half-width {r}. How far does its wavefront depart from flat at the edge?' }
    },
    {
      name: 'Vergence of a wavefront',
      expr: 'V = 1/Rw', tex: 'V = \\frac{1}{R}',
      vars: {
        V: { name: 'vergence', q: 'optpower', unit: 'D', tex: 'V' },
        Rw: { name: 'radius of the wavefront', q: 'length', unit: 'm', value: 0.25, tex: 'R' }
      },
      solveFor: 'V',
      note: 'The sign convention of the lens equation makes light diverging from an object at distance R have vergence −1/R.'
    },
    {
      name: 'Fresnel number',
      expr: 'NF = a^2/(lambda*L)', tex: 'N_{F} = \\frac{a^{2}}{\\lambda\\,L}',
      vars: {
        NF: { name: 'Fresnel number', tex: 'N_{F}' },
        a: { name: 'radius of the aperture', q: 'length', unit: 'mm', value: 1, tex: 'a' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        L: { name: 'distance to the screen', q: 'length', unit: 'm', value: 0.5, tex: 'L' }
      },
      solveFor: 'NF',
      note: 'Much greater than 1: geometrical shadows. About 1: Fresnel diffraction. Much less than 1: far-field (Fraunhofer) diffraction.',
      stories: { NF: 'A hole of radius {a} is lit with {lambda} light and a screen stands {L} behind it. What is the Fresnel number?' }
    }
  ],
  examples: [
    {
      title: 'How flat is the light from the Sun?',
      q: 'The wavefront of sunlight has a radius of 150 million km. How far does it depart from a plane across a telescope mirror 1 m wide, and how does that compare with the wavelength?',
      steps: [
        { text: 'With $r = 0.5$ m and $R = 1.496\\times10^{11}$ m:', tex: 's = \\frac{r^{2}}{2R} = \\frac{0.25}{2\\times1.496\\times10^{11}} = 8.4\\times10^{-13}\\ \\mathrm{m}' },
        'Against a wavelength of 550 nm that is $1.5\\times10^{-6}$ of a wavelength.'
      ],
      a: '0.84 picometres, a millionth of a wavelength: for any telescope the Sun\'s wavefront is flat.'
    },
    {
      title: 'Is the shadow of a hole sharp?',
      q: 'A circular hole 2 mm across is lit with green light (550 nm) and a screen is placed 0.5 m behind it. Is the ray picture adequate?',
      steps: [
        { text: 'The radius is 1 mm:', tex: 'N_F = \\frac{a^{2}}{\\lambda L} = \\frac{(10^{-3})^{2}}{550\\times10^{-9}\\times0.5} = 3.6' }
      ],
      a: '$N_F = 3.6$: above 1, so the geometrical shadow dominates, but not far above: Fresnel fringes are visible at the edge. A 5 mm hole at 0.5 m would have $N_F = 23$ and a clean shadow.'
    }
  ],
  quiz: [
    { q: 'How are rays related to wavefronts in a uniform, isotropic medium?', choices: ['Parallel to them', 'Perpendicular to them', 'At 45° to them', 'Unrelated'], a: 1, why: 'A ray is, by definition, the line normal to the wavefronts. Light crosses the surfaces of constant phase rather than running along them.' },
    { q: 'Light from a star arrives at a telescope with spherical wavefronts of enormous radius, which across the mirror are flat to a tiny fraction of a wavelength.', a: true, why: 'Over a metre, the sagitta of a front with $R \\sim 10^{16}$ m or more is utterly negligible: a plane wave with parallel rays.' },
    { q: 'A source is 2 m from a 100 mm wide aperture. By how many micrometres does its wavefront depart from flat at the edge, relative to the centre?', answer: 625, unit: 'µm', why: '$s = r^{2}/2R = (0.05)^{2}/(2\\times2) = 6.25\\times10^{-4}$ m = 625 µm.' },
    { q: 'What does a convex lens do to a plane wavefront?', choices: ['Nothing: the wave goes straight on', 'It delays the middle more than the edge, turning the front into a sphere that converges on the focus', 'It makes the wavefront larger', 'It reverses the phase'], a: 1, why: 'The centre has more glass, so it is delayed more. The edge arrives sooner, and the front becomes a sphere closing on the focal point.' },
    { q: 'When does the ray picture start to fail for light passing through an aperture of radius $a$ onto a screen at distance $L$?', choices: ['When the Fresnel number $a^{2}/\\lambda L$ becomes of order 1 or less', 'When $a$ is more than a centimetre', 'When the light is not green', 'Never'], a: 0, why: 'The Fresnel number compares the aperture\'s size with the width of the first Fresnel zone, $\\sqrt{\\lambda L}$. When it is not much larger than 1 the edges of the beam are diffuse and the pattern is diffraction.' }
  ],
  applications: [
    'Optical design: every lens is first traced with rays; the wavefront error left over is then checked against the wavelength.',
    'Telescope mirrors are tested against a perfect plane or sphere by comparing wavefronts in an interferometer.',
    'Eye surgery and astronomy measure wavefronts with Shack–Hartmann sensors and correct them with adaptive optics.',
    'Collimators and beam expanders aim to produce plane wavefronts from a point or a laser.',
    'Fibres and waveguides are too small for rays: their modes are standing patterns of the wave itself.'
  ],
  history: 'Huygens built the theory of light on wavefronts in 1678–90. The theorem that rays remain perpendicular to wavefronts through any number of reflections and refractions is credited to Malus (1808) and Dupin (1822), and Hamilton (1830s) made it the basis of a complete theory of rays.',
  sources: [
    'E. Hecht, *Optics*, ch. 4 (The Propagation of Light) and ch. 5 (Geometrical Optics) — wavefronts, rays and the paraxial approximation.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 3 (Foundations of Geometrical Optics) — light rays and the limits of the ray picture.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE) — wavefronts, vergence and the sagitta.',
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, ch. 1 and 2 — ray optics and wave optics side by side.'
  ],
  sim: 'nl-wavefronts'
},

/* ================================================================ Fermat's principle */
{
  id: 'fermats-principle', parent: 'nature-of-light', title: 'Fermat\'s principle of least time', level: 2,
  short: 'Light travels between two points along the path whose travel time is stationary, usually the quickest. The principle gives the law of reflection and Snell\'s law in one stroke and shows why a lens focuses. It works because the waves along neighbouring paths arrive in step only near the stationary one.',
  keywords: ['Fermat', 'least time', 'principle of least time', 'stationary path', 'shortest time', 'law of reflection', 'Snell\'s law derivation', 'variational principle', 'optical path', 'lifeguard', 'path integral', 'minimum time', 'extremal'],
  prereq: ['optical-path-length', 'refractive-index', 'rays-and-wavefronts'],
  related: ['snells-law', 'law-of-reflection', 'huygens-construction', 'gradient-index-optics', 'mirages-and-looming', 'parabolic-and-elliptical-mirrors', 'physics:refraction', 'feynman:least-time'],
  body: `
A lifeguard on the beach sees a swimmer in trouble. She runs fast on sand and swims slowly, so the quickest route is not the straight line: she runs farther along the sand and enters the water at a steeper angle. Light chooses its paths in the same way, with air and glass playing the part of sand and sea.

### The principle
**Fermat's principle**: of all the paths between two points, light takes one for which the travel time is *stationary* — usually a minimum — against small changes of the path. Time is optical path length over $c$, so the principle says the optical path length $\\int n\\,\\mathrm{d}s$ is stationary.

### What it gives
- **Straight lines** in a uniform medium: least time is least distance.
- **The law of reflection**: of all paths from A to a mirror to B, the quickest touches the mirror where the angles of incidence and reflection are equal ([[law-of-reflection]]).
- **Snell's law**: for a path crossing from index $n_1$ to $n_2$, setting the derivative of the time to zero gives $n_1\\sin\\theta_1 = n_2\\sin\\theta_2$ ([[snells-law]], derivation below).
- **Curving rays** where the index varies smoothly, in mirages and graded-index lenses ([[gradient-index-optics]]).
- **Focusing**: an ellipsoidal mirror has equal paths from one focus to the other; a lens is shaped so that every path from object point to image point has the same optical length.

### Why the minimum is flat
Take A, 30 mm above a surface, and B, 30 mm below it in glass ($n = 1.5$), 100 mm to one side. The quickest path crosses at 76.27 mm, with $\\theta_1 = 68.5°$ and $\\theta_2 = 38.3°$, and takes 464.8 ps. The straight line through the surface, crossing at 50 mm, takes 486.2 ps. Move the crossing point 1 mm from the best and the optical path grows by only 13 µm; 5 mm off, by 0.3 to 0.35 mm, 25 times more for five times the displacement. Near a minimum the change is *second order* in the displacement.

### Why light seems to know
Light does not choose. Every path contributes a wave whose phase is $2\\pi\\,\\mathrm{OPL}/\\lambda$. Away from the stationary path the phase changes quickly from one path to the next and the contributions cancel. Near it the OPL is nearly constant, so the waves arrive in step and add: in the example, crossing points within 0.21 mm of the best are within a quarter wavelength of green light. This is the idea behind [[huygens-construction]], and Feynman's sum over paths turned it into the foundation of quantum electrodynamics ([[feynman:least-time|Feynman on least time]]).

### Minimum, maximum or constant
The time is stationary, not always a minimum. Inside an ellipsoidal mirror every path from one focus to the other is equally long; on a concave spherical mirror the path from some points can be a maximum. And "least time" does not mean "shortest distance": refraction takes a longer route in distance to save time.

> [!key] Light follows the path of stationary optical length, normally the quickest. Reflection and refraction follow from it; the minimum is flat, so paths near it add in step and light appears to find it.
`,
  ideas: [
    'Between two points light takes the path of stationary (usually least) travel time, that is, stationary optical path length.',
    'The law of reflection and Snell\'s law both follow from it: dT/dx = 0 at the crossing point.',
    'The quickest path may be longer in distance: it takes more of the way in the faster medium.',
    'Near the stationary path the time changes only to second order, so neighbouring paths arrive in step and their waves add.',
    'A lens or an ellipsoidal mirror works because every path from object to image has the same optical length.'
  ],
  pitfalls: [
    'Light takes the shortest path — It takes the quickest, which is the shortest optical path n·d. Across a boundary the shortest-time path is longer in metres than the straight line.',
    'Light somehow knows its destination in advance — The wave explores all paths; the contributions cancel except near the stationary path, so that is where the light appears.',
    'The path is always a minimum of time — It is stationary: usually a minimum, but it can be a maximum or constant (an ellipsoidal mirror), which is why the principle is also called the principle of stationary or extremal time.',
    'Fermat\'s principle replaces Snell\'s law — It contains it. Snell\'s law is its consequence, and the principle also covers curved paths where the index varies from point to point.'
  ],
  terms: [
    { term: 'Fermat\'s principle', also: ['principle of least time', 'principle of stationary time'], def: 'The path taken by light between two points is the one for which the travel time, and so the optical path length, is stationary (usually a minimum) for small variations of the path.' },
    { term: 'Stationary path', also: ['extremal path'], def: 'A path for which the optical length does not change to first order when the path is slightly altered. Light follows such a path; it may be a minimum, a maximum or a flat point.' },
    { term: 'Quickest path', also: ['least-time path'], def: 'The route of minimum travel time between two points, usually longer in distance than the straight line when media of different index are crossed.' },
    { term: 'Variational principle', def: 'A statement that the actual behaviour of a system makes some quantity stationary. Fermat\'s principle is the one for light; the principle of least action is the one for mechanics.' }
  ],
  formulas: [
    {
      name: 'Travel time through two media',
      expr: 'T = (n1*d1 + n2*d2)/c', tex: 'T = \\frac{n_1 d_1 + n_2 d_2}{c}',
      vars: {
        T: { name: 'travel time', q: 'time', unit: 'ps', tex: 'T' },
        n1: { name: 'index of the first medium', value: 1, min: 1, max: 4, tex: 'n_1' },
        d1: { name: 'path length in the first medium', q: 'length', unit: 'mm', value: 81.96, tex: 'd_1' },
        n2: { name: 'index of the second medium', value: 1.5, min: 1, max: 4, tex: 'n_2' },
        d2: { name: 'path length in the second medium', q: 'length', unit: 'mm', value: 38.25, tex: 'd_2' },
        c: { const: 'c' }
      },
      solveFor: 'T',
      note: 'Default: the quickest path of the example above, 464.8 ps. Fermat\'s principle says this is the least value over all crossing points.',
      stories: { T: 'Light crosses {d1} of a medium of index {n1}, then {d2} of a medium of index {n2}. How long does it take?' }
    }
  ],
  derivation: {
    title: 'Snell\'s law from Fermat\'s principle',
    intro: 'A source A is a height $a$ above a flat boundary, a point B a depth $b$ below it, a horizontal distance $d$ apart. The light crosses the boundary at a distance $x$ from the foot of A, in medium 1 above and medium 2 below.',
    steps: [
      { text: 'The time is the path in each medium divided by the speed there:', tex: 'T(x) = \\frac{n_1\\sqrt{a^{2}+x^{2}}}{c} + \\frac{n_2\\sqrt{b^{2}+(d-x)^{2}}}{c}' },
      { text: 'The time is stationary where its derivative with respect to $x$ is zero:', tex: '\\frac{\\mathrm{d}T}{\\mathrm{d}x} = \\frac{n_1}{c}\\,\\frac{x}{\\sqrt{a^{2}+x^{2}}} - \\frac{n_2}{c}\\,\\frac{d-x}{\\sqrt{b^{2}+(d-x)^{2}}} = 0' },
      { text: 'Each fraction is the sine of the angle between the path and the normal (the side opposite over the hypotenuse):', tex: 'n_1\\sin\\theta_1 = n_2\\sin\\theta_2' }
    ]
  },
  examples: [
    {
      title: 'Did the light take the straight line?',
      q: 'Light goes from A, 30 mm above the surface of a glass block ($n = 1.5$), to B, 30 mm inside it, 100 mm to one side. Compare the time along the straight line A–B with the quickest path, which crosses at 76.27 mm.',
      steps: [
        { text: 'The straight line crosses the surface at 50 mm. The optical path there is', tex: '1\\times\\sqrt{30^{2}+50^{2}} + 1.5\\times\\sqrt{30^{2}+50^{2}} = 2.5\\times58.31 = 145.8\\ \\mathrm{mm}' },
        { text: 'Via 76.27 mm:', tex: '\\sqrt{30^{2}+76.27^{2}} + 1.5\\sqrt{30^{2}+23.73^{2}} = 81.96 + 57.38 = 139.34\\ \\mathrm{mm}' },
        { text: 'Times: $145.8\\ \\mathrm{mm}/c = 486.2$ ps and $139.3\\ \\mathrm{mm}/c = 464.8$ ps.' }
      ],
      a: 'The bent path is 21 ps faster (6.4 mm less optical path) even though it is longer in metres. The straight line gets there later: the lifeguard runs along the beach.'
    },
    {
      title: 'The lifeguard\'s angles',
      q: 'A lifeguard runs at 5 m/s on sand and swims at 1.5 m/s. At what ratio of sines of the angles (from the normal to the waterline) should she cross it?',
      steps: [
        'Fermat\'s condition gives $\\sin\\theta_\\mathrm{sand}/v_\\mathrm{sand} = \\sin\\theta_\\mathrm{water}/v_\\mathrm{water}$, the analogue of Snell\'s law with $n \\propto 1/v$.',
        { text: 'So', tex: '\\frac{\\sin\\theta_\\mathrm{sand}}{\\sin\\theta_\\mathrm{water}} = \\frac{v_\\mathrm{sand}}{v_\\mathrm{water}} = \\frac{5}{1.5} = 3.3' }
      ],
      a: '3.3. She should enter the water at a small angle from the normal (swimming nearly straight out), after running along the shore at a large angle.'
    }
  ],
  quiz: [
    { q: 'Which statement is closest to Fermat\'s principle?', choices: ['Light takes the path of shortest distance', 'Light takes a path for which the travel time is stationary, usually a minimum', 'Light takes the path of greatest speed', 'Light takes the path with fewest reflections'], a: 1, why: 'The principle concerns the travel time (the optical path length). The shortest distance is only the answer in a uniform medium.' },
    { q: 'Across the boundary between air and glass, the path of least time is the straight line from A to B.', a: false, why: 'Light is slower in glass, so the quickest route spends more of its length in the air and less in the glass: it bends at the surface. It is longer in metres but shorter in time.' },
    { q: 'How long does light take to cross 20 mm of glass of index 1.5, in picoseconds?', answer: 100.1, unit: 'ps', why: '$t = nd/c = 1.5\\times0.020/2.998\\times10^{8} = 1.001\\times10^{-10}$ s.' },
    { q: 'Why do waves along paths near the least-time path reinforce each other?', choices: ['Because the optical lengths of neighbouring paths are almost equal, so the waves arrive nearly in step', 'Because they travel faster', 'Because the minimum is sharp', 'Because they are reflected'], a: 0, why: 'At a stationary point the OPL changes only to second order with displacement: nearby paths differ by a fraction of a wavelength, so their phases agree. Elsewhere the phases scatter and the waves cancel.' },
    { q: 'A lifeguard runs at 5 m/s on sand and swims at 1.5 m/s. Compared with the angle from the normal on the sand, the angle in the water is…', choices: ['larger', 'smaller', 'the same', 'zero'], a: 1, why: '$\\sin\\theta_\\mathrm{water} = \\sin\\theta_\\mathrm{sand}\\times1.5/5$. Slower motion means a smaller angle from the normal, as light bends towards the normal in glass.' }
  ],
  applications: [
    'Reflectors and condensers: an ellipsoidal mirror takes light from one focus to the other by paths of equal length.',
    'Lens design: all paths from an object point to its image must have equal optical length; designers minimise the variation.',
    'Mirages and atmospheric refraction: light follows the quickest route through air of varying temperature.',
    'Graded-index lenses and fibres bend light along curved least-time paths.',
    'Seismology and ray tracing in computer graphics use the same principle for waves in layered media.'
  ],
  history: 'Hero of Alexandria showed in the first century that light reflected at equal angles takes the shortest path. Fermat stated his principle of least time in 1657 and in 1662 used it to derive Snell\'s law, to the annoyance of Descartes\' followers, who had a different argument. Maupertuis extended the idea to mechanics as least action (1744), and Feynman\'s path integral (1948) showed why it works.',
  sources: [
    'R. P. Feynman, R. B. Leighton and M. Sands, *The Feynman Lectures on Physics*, vol. I, ch. 26 (Optics: The Principle of Least Time).',
    'E. Hecht, *Optics*, ch. 4 (The Propagation of Light) — Fermat\'s principle and its consequences.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 3 (Foundations of Geometrical Optics) — Fermat\'s principle.',
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, ch. 1 (Ray Optics) — Fermat\'s principle and optical path length.'
  ],
  sim: 'nl-fermat'
},

/* ================================================================ Huygens' construction */
{
  id: 'huygens-construction', parent: 'nature-of-light', title: 'Huygens\' wavelets', level: 2,
  short: 'Every point on a wavefront can be treated as the source of a small wavelet, and the wavefront a moment later is the envelope of those wavelets. The construction shows why plane waves stay plane, how reflection and refraction arise and why a narrow gap spreads light; with Fresnel\'s addition of phase it became the working theory of diffraction.',
  keywords: ['Huygens', 'Huygens principle', 'wavelet', 'secondary wavelets', 'envelope', 'wavefront construction', 'Huygens–Fresnel principle', 'obliquity factor', 'diffraction', 'refraction', 'reflection', 'spreading of light'],
  prereq: ['rays-and-wavefronts', 'wavelength-frequency-and-colour', 'refractive-index'],
  related: ['fermats-principle', 'what-diffraction-is', 'single-slit-diffraction', 'snells-law', 'law-of-reflection', 'critical-angle-and-total-internal-reflection', 'superposition-and-phase', 'physics:huygens-principle'],
  body: `
In 1678 Christiaan Huygens proposed a way to work out where a wave goes next: **every point of a wavefront acts as a source of a small spherical wavelet, and the wavefront a moment later is the common tangent, the envelope, of all those wavelets.** It is a recipe for drawing, and the simplest way to see why waves behave as they do.

### The construction
Take a wavefront and mark points along it. After a short time $\\Delta t$ each wavelet has grown to a radius $r = v\\,\\Delta t = c\\,\\Delta t/n$: 0.3 mm in a picosecond in air, 0.2 mm in glass of index 1.5. After one period of the wave, 1.8 fs for green light, the radius is exactly one wavelength. Draw the circles; the line that just touches them is the new front.
- A straight front gives a straight front: plane waves stay plane.
- A circular front of radius $R$ gives one of radius $R + r$: spherical waves stay spherical.

### Reflection and refraction
A tilted plane front reaches a surface at one end first, so that end starts its wavelet earlier. In the second medium the wavelets are smaller by the factor $v_2/v_1 = n_1/n_2$. Their envelope is a front that has turned, and the geometry gives

$$\\frac{\\sin\\theta_1}{v_1} = \\frac{\\sin\\theta_2}{v_2}$$

which is Snell's law ([[snells-law]]). Wavelets that stay in the first medium make the reflected front, at the angle of incidence. If the wavelets in the second medium are too small to keep up with the front's progress along the surface, they have no common tangent and the wave is totally reflected ([[critical-angle-and-total-internal-reflection]]).

### An opening
Put a barrier in the way and only the wavelets from the gap exist. The envelope is a straight piece, as wide as the gap, with a quarter circle at each end, and the curved ends grow with distance. Through a gap 30 wavelengths wide the front stays nearly flat and rays describe the light well; through one only 2 wavelengths wide it is almost a half circle and the light spreads. That is [[what-diffraction-is|diffraction]] ([[single-slit-diffraction]]).

### What Huygens left out
Two things. A wavelet spreads in every direction, so there should be a wave running backwards; there is none. And the construction says nothing about brightness. Fresnel (1818) repaired both by giving each wavelet an amplitude and a phase and *adding* them, so that wavelets interfere with one another: the Huygens–Fresnel principle. Kirchhoff (1882) derived it from the wave equation, with an obliquity factor $(1+\\cos\\chi)/2$ that is 1 straight ahead and 0 straight back. The wavelets are a device: nothing radiates from an empty wavefront, yet their sum gives correct answers for apertures, lenses and gratings.

> [!key] The next wavefront is the envelope of wavelets of radius $c\\,\\Delta t/n$ from every point of the present one. The construction explains plane and spherical propagation, reflection, refraction and the spreading of light at an opening.
`,
  ideas: [
    'Every point of a wavefront is a source of a wavelet; the new front is their envelope.',
    'A wavelet grows by c/n per unit time: one wavelength in one period of the wave.',
    'Wavelets in a slower medium are smaller; their envelope is the refracted front, and the geometry gives Snell\'s law.',
    'A narrow gap leaves a front with large curved ends: the light spreads, and the ray picture fails.',
    'Fresnel gave the wavelets phase and added them; with an obliquity factor this removes the backward wave and gives the working theory of diffraction.'
  ],
  pitfalls: [
    'The wavelets are real sources of light on the wavefront — They are a mathematical device for computing the next front. Nothing radiates from an empty region of a wave; the construction reproduces what the wave does.',
    'Huygens\' wavelets should make a backward wave too — Plain Huygens does predict one wrongly. Fresnel and Kirchhoff\'s obliquity factor, which vanishes straight back, removes it.',
    'The construction tells how bright the light is — Not by itself: it gives the position of the front. Brightness needs the wavelets\' amplitudes and phases to be added, as Fresnel did.',
    'Huygens\' construction explains why light slows in glass — It takes the speeds as given and finds the geometry that follows from them: reflection, refraction, spreading.'
  ],
  terms: [
    { term: 'Huygens\' principle', also: ['Huygens\' construction', 'secondary wavelets'], def: 'Every point on a wavefront can be regarded as a source of secondary spherical wavelets; the new wavefront is their envelope. With phase and amplitude added by Fresnel, the wavelets interfere and give diffraction.' },
    { term: 'Wavelet', also: ['secondary wave'], def: 'The small spherical wave imagined to start from each point of a wavefront, growing at the speed c/n of the wave.' },
    { term: 'Envelope', def: 'The curve or surface that touches all of a family of curves, here the circles or spheres of the wavelets. It is the new wavefront.' },
    { term: 'Obliquity factor', also: ['inclination factor'], def: 'The factor (1 + cos χ)/2 that weights a wavelet by the angle χ from the forward direction: 1 straight ahead, 0 straight back. It removes the unwanted backward wave.' }
  ],
  formulas: [
    {
      name: 'Radius of a wavelet',
      expr: 'r = c*t/n', tex: 'r = \\frac{c\\,t}{n}',
      vars: {
        r: { name: 'radius of the wavelet', q: 'length', unit: 'µm', tex: 'r' },
        c: { const: 'c' },
        t: { name: 'time since the wavelet started', q: 'time', unit: 'ps', value: 1, tex: 't' },
        n: { name: 'refractive index', value: 1.5, min: 1, max: 4, tex: 'n' }
      },
      solveFor: 'r',
      stories: { r: 'A wavelet starts in a medium of index {n}. How large is it after {t}?', t: 'A wavelet in a medium of index {n} has grown to {r}. How long has it been growing?' }
    },
    {
      name: 'Refraction from the wavelets',
      expr: 'sin(t1)/v1 = sin(t2)/v2', tex: '\\frac{\\sin\\theta_1}{v_1} = \\frac{\\sin\\theta_2}{v_2}',
      vars: {
        t1: { name: 'angle of incidence', q: 'angle', unit: '°', value: 40, min: 0, max: 90, tex: '\\theta_1' },
        v1: { name: 'speed in the first medium', q: 'speed', unit: 'km/s', value: 299792, tex: 'v_1' },
        t2: { name: 'angle of refraction', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\theta_2' },
        v2: { name: 'speed in the second medium', q: 'speed', unit: 'km/s', value: 197600, tex: 'v_2' }
      },
      solveFor: 't2',
      note: 'The form in which Huygens found it; with v = c/n it is Snell\'s law. No solution means total internal reflection.',
      stories: { t2: 'A plane wave meets a surface at {t1} from the normal, passing from a medium where its speed is {v1} to one where it is {v2}. At what angle does it continue?' }
    },
    {
      name: 'Period of the wave',
      expr: 'T = lambda/c', tex: 'T = \\frac{\\lambda}{c}',
      vars: {
        T: { name: 'period', q: 'time', unit: 'fs', tex: 'T' },
        lambda: { name: 'wavelength in vacuum', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        c: { const: 'c' }
      },
      solveFor: 'T',
      note: 'Also the time a wavelet needs to grow by one wavelength.'
    }
  ],
  examples: [
    {
      title: 'Refraction by the wavelets',
      q: 'A plane wavefront meets a glass surface at 40° from the normal. In air the wave travels at $c$; in the glass at $0.659\\,c$ (index 1.517). Find the direction of the refracted front.',
      steps: [
        { text: 'The wavelets in the glass are 0.659 times as large as those in air would be. The envelope turns the front through an angle given by', tex: '\\sin\\theta_2 = \\frac{v_2}{v_1}\\sin\\theta_1 = 0.659\\times0.6428 = 0.4237' },
        'So $\\theta_2 = 25.1°$: the front, and the ray, turn towards the normal.'
      ],
      a: '25.1° from the normal: the same as Snell\'s law with $n = 1.517$, found without using the index at all.'
    },
    {
      title: 'How big is a wavelet?',
      q: 'After 10 fs, how large are the wavelets in air and in N-BK7 glass ($n = 1.5185$ at 550 nm)? How many wavelengths is that?',
      steps: [
        { text: 'In air:', tex: 'r = c\\,t = 2.998\\times10^{8}\\times10^{-14} = 3.00\\ \\mu\\mathrm{m}' },
        { text: 'In glass:', tex: 'r = \\frac{c\\,t}{n} = \\frac{3.00}{1.5185} = 1.97\\ \\mu\\mathrm{m}' },
        'The period of green light is 1.83 fs, so 10 fs is 5.45 periods: the wavelet has grown by 5.45 wavelengths of 0.55 µm in air, and by the same number of (shorter, 0.362 µm) wavelengths in glass.'
      ],
      a: '3.00 µm in air, 1.97 µm in glass; in both, 5.45 wavelengths.'
    }
  ],
  quiz: [
    { q: 'In Huygens\' construction, the new wavefront is…', choices: ['the centre of each wavelet', 'the envelope that touches all the wavelets', 'the largest wavelet', 'the line joining the sources'], a: 1, why: 'The wavefront a moment later is the common tangent (envelope) of the wavelets that the points of the old front have grown.' },
    { q: 'Huygens\' wavelets are real sources of light on the wavefront.', a: false, why: 'They are a device for calculating the next front. Nothing radiates from the empty points of a wave; the construction merely reproduces how the wave advances.' },
    { q: 'A wavefront enters glass. Compared with the wavelets it would produce in air during the same time, the wavelets in glass are…', choices: ['larger', 'the same size', 'smaller, by the factor $1/n$', 'zero'], a: 2, why: 'The wavelet radius is $v\\,\\Delta t = c\\,\\Delta t/n$, and the speed in glass is lower by the factor $n$. The smaller wavelets are why the front turns towards the normal.' },
    { q: 'How large is a wavelet in water ($n = 1.333$) 100 fs after it starts, in micrometres?', answer: 22.5, unit: 'µm', why: '$r = ct/n = 2.998\\times10^{8}\\times10^{-13}/1.333 = 2.25\\times10^{-5}$ m = 22.5 µm.' },
    { q: 'Why does light passing through a slit only two wavelengths wide spread out, while light through a wide slit goes nearly straight?', choices: ['The envelope of the few wavelets is almost a half circle; for a wide slit the straight middle dominates', 'Narrow slits absorb the straight light', 'Rays bend at the edge of any slit', 'The light is slower in the narrow slit'], a: 0, why: 'With a wide gap the envelope is a long straight piece with small curved ends; with a gap of a few wavelengths the curved ends meet, so the front is nearly circular and the light fans out.' }
  ],
  applications: [
    'Derivations of the laws of reflection and refraction, and of double refraction in calcite, which Huygens explained with ellipsoidal wavelets.',
    'Diffraction theory: lens focal spots, slit and grating patterns and zone plates are Huygens–Fresnel sums.',
    'Ultrasound and radar phased arrays steer a beam by delaying many small sources, a Huygens construction made of hardware.',
    'Seismic and acoustic imaging "migrate" recorded waves back by adding wavelets.',
    'Ripple-tank demonstrations show wavelets spreading from a gap and a line of dippers making a plane wave.'
  ],
  history: 'Huygens presented his wave theory to the Paris Academy in 1678 and published it in the *Traité de la lumière* (1690), where he derived reflection and refraction and, with ellipsoidal wavelets, the double refraction of calcite. Newton\'s particle theory eclipsed it for a century. Fresnel\'s prize essay of 1818 added interference; Poisson objected that it predicted a bright spot in the middle of a disc\'s shadow, and Arago found it in 1819. Kirchhoff gave the theory its mathematical form in 1882.',
  sources: [
    'C. Huygens, *Traité de la lumière* (Leiden, 1690), English translation *Treatise on Light* by S. P. Thompson — the original account.',
    'E. Hecht, *Optics*, ch. 4 (The Propagation of Light) and ch. 10 (Diffraction) — Huygens\' principle and the Huygens–Fresnel principle.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 8 (Elements of the Theory of Diffraction) — Kirchhoff\'s formulation and the obliquity factor.',
    'F. A. Jenkins and H. E. White, *Fundamentals of Optics*, ch. 1 and 2 — Huygens\' construction applied to reflection and refraction.'
  ],
  sim: 'nl-huygens'
},

/* ================================================================ sources and beams */
{
  id: 'light-sources-and-beams', parent: 'nature-of-light', title: 'Point sources, pencils and collimated beams', level: 1,
  short: 'A point source sends out spherical waves, an extended source is a crowd of point sources, and what leaves an optical system is a diverging, collimated or converging beam. A collimated beam is never perfectly parallel: a source of size s behind a lens of focal length f spreads by about s/f, and diffraction sets a floor.',
  keywords: ['point source', 'extended source', 'pencil of rays', 'bundle of rays', 'beam', 'collimated beam', 'collimator', 'collimation', 'divergence', 'diverging', 'converging', 'angular size', 'parallel rays', 'beam divergence', 'inverse square law'],
  prereq: ['rays-and-wavefronts', 'what-is-light'],
  related: ['shadows-and-the-pinhole', 'the-thin-lens-equation', 'the-gaussian-beam', 'beam-expanders', 'collimating-a-laser-diode', 'etendue', 'inverse-square-and-cosine-laws', 'beam-waist-and-divergence'],
  body: `
Every optical system begins with a source, and the first questions about it are its **size** compared with its distance, and the **shape of the beam** that leaves it.

### Point sources and extended sources
A **point source** has no size: all its light starts at one place, so its wavefronts are spheres and its rays diverge from a point. Nothing is exactly a point, but a star, a pinhole lit from behind, or any source far enough away comes close. An **extended source** (a 1 mm LED die, a filament, a screen, the Sun) is a crowd of point sources side by side, each sending its own spherical wave in its own directions.

"Far enough" is a question of angle. The **angular size** of a source is its size over its distance, $\\theta = s/d$. The Sun, 1.39 million km across at 150 million km, subtends 9.3 mrad, or 0.53°. A star is a point to any telescope: the largest in the sky spans only 0.05″, about 0.2 µrad. Beyond about ten times its largest dimension, an extended source follows the inverse-square law to a few per cent ([[inverse-square-and-cosine-laws]]).

### Pencils, bundles and beams
A **pencil** is the cone of rays from one point of a source (or towards one point of an image). A **bundle** is all the rays, from every point of the source, that pass some aperture. A beam is

- **diverging** when its rays spread, as from a bare lamp: negative vergence;
- **converging** when they close in towards a point: positive vergence;
- **collimated** when the rays of each pencil are parallel: zero vergence.

### What "collimated" really means
A lens turns a diverging pencil into a parallel one if the source is at its focus. But a source of size $s$ is not at one point: a point at its edge, $s/2$ off the axis, leaves the lens tilted by $s/2f$. The beam is a bundle of parallel pencils whose directions span a full angle

$$\\theta \\approx \\frac{s}{f}$$

A 1 mm LED die behind a 50 mm lens gives 20 mrad, 1.1°; a 10 µm pinhole gives 0.2 mrad. Even a perfect point cannot be perfectly collimated: a beam of diameter $D$ spreads by diffraction through a half angle of about $1.22\\,\\lambda/D$, 27 µrad for a 25 mm lens in green light. A laser, nearly a point and nearly a single wave, is the best-collimated source: a helium–neon beam diverges by about 1 mrad, and expanding it tenfold cuts that to 0.1 mrad ([[beam-expanders]], [[the-gaussian-beam]]).

| Source | Divergence or angular size (full angle) |
|---|---|
| the Sun, from Earth | 9.3 mrad (0.53°) |
| 1 mm LED die at the focus of a 50 mm lens | 20 mrad |
| helium–neon laser beam | about 1 mrad |
| the same beam expanded tenfold | about 0.1 mrad |
| 25 mm lens, diffraction limit (2.44 λ/D) | 0.054 mrad |

A divergence of 1 mrad means a beam 1 mm wider for every metre it travels.

> [!warn] A collimated beam keeps its intensity over long distances. A laser or a strong LED can injure the eye far from the source; never look into a beam or its reflection ([[laser-safety-classes]]).

> [!key] A point source has spherical wavefronts; a real source has a size $s$ and an angular size $s/d$. A lens at its focus collimates each pencil, but the beam still spreads by about $s/f$, and diffraction ($\\sim\\lambda/D$) sets the final limit.
`,
  ideas: [
    'A point source has spherical wavefronts and diverging rays; an extended source is a crowd of point sources whose directions differ.',
    'The angular size s/d decides what counts as a point: the Sun is 9.3 mrad (0.53°), a star a fraction of a microradian.',
    'A pencil is the rays from one point; a bundle is all the rays through an aperture; a beam is diverging, collimated or converging.',
    'A collimated beam from a source of size s and a lens of focal length f has a divergence of about s/f.',
    'Diffraction gives a floor of 1.22 λ/D (half angle); lasers, being nearly point sources, are the best-collimated beams.'
  ],
  pitfalls: [
    'A collimated beam has parallel rays, so it never spreads — Only a perfect point source at the focus would give exactly parallel rays, and even then diffraction spreads the beam by about λ/D.',
    'A laser beam is perfectly parallel — A laser beam has a divergence of about 2λ/πw₀ for a waist w₀: about 1 mrad for a few tenths of a millimetre. Expand the beam and the divergence falls in proportion.',
    'The Sun\'s rays are parallel — They are parallel only to within 0.53°: the Sun is an extended source. That is why a magnifying glass makes a spot (f × 9.3 mrad across) and not a point, and why shadows have blurred edges.',
    'A point source is a very small source — It is a source that is small compared with what the system can resolve. A 1 mm LED is a point from 100 m away through a camera, and an extended source from 10 cm.'
  ],
  terms: [
    { term: 'Point source', def: 'A source of negligible size, whose light starts from a single place and spreads as spherical wavefronts. A star, or a source far away compared with its size.' },
    { term: 'Extended source', def: 'A source with a size that matters: a filament, an LED die, a screen. It can be thought of as many point sources side by side.' },
    { term: 'Pencil of rays', also: ['ray pencil'], def: 'The cone of rays leaving one point of a source, or converging on one point of an image.' },
    { term: 'Bundle of rays', also: ['beam', 'ray bundle'], def: 'The whole set of rays, from all points of a source, that pass through an aperture. A beam is a bundle seen as a stream of light.' },
    { term: 'Collimated beam', also: ['parallel beam', 'collimation'], def: 'A beam whose rays are parallel, that is, whose wavefronts are flat. A source at the focus of a lens produces one, to within the source\'s angular size seen from the lens.' },
    { term: 'Divergence', also: ['beam divergence', 'full angle'], def: 'The angle at which a beam spreads, in milliradians; often the full angle between the beam\'s edges. 1 mrad is 1 mm of growth per metre.' },
    { term: 'Angular size', also: ['angular diameter', 'subtense'], def: 'The angle a source or object subtends at the eye or the instrument, about size ÷ distance in radians.' }
  ],
  formulas: [
    {
      name: 'Angular size',
      expr: 'theta = s/d', tex: '\\theta = \\frac{s}{d}',
      vars: {
        theta: { name: 'angular size (full angle)', q: 'angle', unit: 'mrad', tex: '\\theta' },
        s: { name: 'size of the source', q: 'length', unit: 'km', value: 1392700, tex: 's' },
        d: { name: 'distance', q: 'length', unit: 'km', value: 149600000, tex: 'd' }
      },
      solveFor: 'theta',
      note: 'Small angles. Defaults: the Sun, 9.3 mrad = 0.53°.',
      stories: { theta: 'A source {s} across is {d} away. What angle does it subtend?' }
    },
    {
      name: 'Divergence of a collimated beam from a finite source',
      expr: 'theta = s/f', tex: '\\theta = \\frac{s}{f}',
      vars: {
        theta: { name: 'divergence (full angle)', q: 'angle', unit: 'mrad', tex: '\\theta' },
        s: { name: 'size of the source', q: 'length', unit: 'mm', value: 1, tex: 's' },
        f: { name: 'focal length of the collimating lens', q: 'length', unit: 'mm', value: 50, tex: 'f' }
      },
      solveFor: 'theta',
      note: 'With the source at the focus. Increase f or shrink the source to improve the collimation.',
      stories: { theta: 'A source {s} across sits at the focus of a lens of focal length {f}. How much does the beam diverge?', f: 'A source {s} across is collimated to {theta}. What focal length is needed?' }
    },
    {
      name: 'Diffraction-limited divergence',
      expr: 'theta = 1.22*lambda/D', tex: '\\theta = \\frac{1.22\\,\\lambda}{D}',
      vars: {
        theta: { name: 'half-angle divergence', q: 'angle', unit: 'µrad', tex: '\\theta' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        D: { name: 'beam diameter', q: 'length', unit: 'mm', value: 25, tex: 'D' }
      },
      solveFor: 'theta',
      note: 'The least angle a beam of uniform diameter D can have; the angle to the first dark ring of the Airy pattern.',
      stories: { theta: 'A beam of {lambda} light {D} across is as well collimated as diffraction allows. What is its half-angle divergence?' }
    },
    {
      name: 'Beam diameter at a distance',
      expr: 'Dz = D0 + z*theta', tex: 'D_{z} = D_{0} + z\\,\\theta',
      vars: {
        Dz: { name: 'beam diameter at z', q: 'length', unit: 'mm', tex: 'D_{z}' },
        D0: { name: 'diameter at the lens', q: 'length', unit: 'mm', value: 25, tex: 'D_{0}' },
        z: { name: 'distance travelled', q: 'length', unit: 'm', value: 10, tex: 'z' },
        theta: { name: 'divergence (full angle)', q: 'angle', unit: 'mrad', value: 20, tex: '\\theta' }
      },
      solveFor: 'Dz',
      note: 'Small angles, far from the waist: the beam grows by θ per unit distance.'
    }
  ],
  examples: [
    {
      title: 'A flashlight beam',
      q: 'The 2 mm die of an LED sits at the focus of a lens with f = 40 mm and diameter 25 mm. How much does the beam diverge, and how wide is it 10 m away?',
      steps: [
        { text: 'Full divergence angle:', tex: '\\theta \\approx \\frac{s}{f} = \\frac{2}{40} = 0.050\\ \\mathrm{rad} = 50\\ \\mathrm{mrad} = 2.9°' },
        { text: 'The beam grows by 50 mm per metre:', tex: 'D(10\\ \\mathrm{m}) = 25\\ \\mathrm{mm} + 10\\ \\mathrm{m}\\times50\\ \\mathrm{mrad} = 0.525\\ \\mathrm{m}' },
        'Diffraction ($2.44\\lambda/D = 0.05$ mrad) is a thousand times smaller and irrelevant here.'
      ],
      a: 'A divergence of 50 mrad (2.9°), so a beam 0.53 m wide at 10 m. To halve it, halve the die or double the focal length (and the lens).'
    },
    {
      title: 'The spot of a burning glass',
      q: 'A magnifying glass of focal length 100 mm focuses sunlight onto paper. How wide is the Sun\'s image?',
      steps: [
        'The Sun subtends 9.3 mrad, and a lens turns an angle $\\theta$ into an image of size $f\\theta$ in its focal plane:',
        { text: '', tex: 'f\\,\\theta = 100\\ \\mathrm{mm}\\times0.0093 = 0.93\\ \\mathrm{mm}' }
      ],
      a: 'About 0.9 mm: a disc, not a point, because the Sun is an extended source (never look at the Sun through a lens or point a magnifier at anyone).'
    }
  ],
  quiz: [
    { q: 'To turn the diverging light of a small lamp into a collimated beam with a single lens, where should the lamp be?', choices: ['At the focal point of the lens', 'At twice the focal length', 'Right against the lens', 'Far away'], a: 0, why: 'A point at the focus emits rays which leave the lens parallel (zero vergence): the source must be at the focus.' },
    { q: 'A 1 mm LED at the focus of a 50 mm lens produces a beam of exactly zero divergence.', a: false, why: 'The LED has a size. Points at its edge leave the lens tilted by $s/2f = 10$ mrad, so the beam spans a full angle of about $s/f = 20$ mrad.' },
    { q: 'The Sun is 1.39 million km across and 150 million km away. What is its angular diameter, in milliradians?', answer: 9.3, unit: 'mrad', why: '$\\theta = s/d = 1.39\\times10^{6}/1.496\\times10^{8} = 9.3\\times10^{-3}$ rad, which is 0.53°.' },
    { q: 'The same source is collimated with a lens of twice the focal length. The beam divergence…', choices: ['doubles', 'is halved', 'stays the same', 'becomes zero'], a: 1, why: 'The divergence is $s/f$: doubling $f$ halves it (and the lens, to keep the same $f$-number, must be twice as wide).' },
    { q: 'What sets the final limit on how well a beam can be collimated, once the source is very small?', choices: ['The colour of the light', 'Diffraction by the beam\'s own aperture, about λ/D', 'The refractive index of air', 'The speed of light'], a: 1, why: 'A beam of width $D$ cannot be narrower in angle than $\\sim1.22\\lambda/D$ however small the source, because the wave spreads at the edge of the aperture.' }
  ],
  applications: [
    'Torches, car headlamps and spotlights use a lens or reflector to turn a lamp into a controlled beam; the lamp size sets how tight it can be.',
    'Collimators feed spectrometers, projectors and lens test benches with parallel light.',
    'Laser pointers and alignment lasers rely on the low divergence of a nearly point-like coherent source; beam expanders lower it further.',
    'Telescopes treat stars as point sources (their image is the instrument\'s response) and planets and the Moon as extended ones.',
    'Machine-vision lighting chooses between a point-like source (sharp shadows, glare) and a large diffuse one (soft shadows).'
  ],
  sources: [
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — sources, rays and the image of a point.',
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, ch. 3 (Beam Optics) — the divergence of beams.',
    'A. E. Siegman, *Lasers*, ch. 17 (Physical Properties of Gaussian Beams) — beam divergence and its diffraction limit.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE) — collimators and the angular size of sources.'
  ],
  sim: 'nl-beams'
},

/* ================================================================ shadows and the pinhole */
{
  id: 'shadows-and-the-pinhole', parent: 'nature-of-light', title: 'Shadows, umbra and penumbra', level: 1,
  short: 'Because light travels in straight lines, an opaque object casts a shadow with a dark umbra and a partly lit penumbra whose widths follow from the size of the source: eclipses are shadows. The same straight lines make a small hole form an image, upside down, though diffraction limits how sharp a pinhole can be.',
  keywords: ['shadow', 'umbra', 'penumbra', 'antumbra', 'eclipse', 'solar eclipse', 'lunar eclipse', 'pinhole', 'pinhole camera', 'camera obscura', 'straight-line propagation', 'penumbral blur', 'sun spots under trees', 'best pinhole diameter'],
  prereq: ['light-sources-and-beams', 'rays-and-wavefronts'],
  related: ['the-pinhole-camera', 'what-diffraction-is', 'the-airy-disk', 'apertures-irises-and-pinholes', 'cleaning-a-beam-with-a-pinhole', 'atmospheric-refraction', 'projections:camera-obscura'],
  body: `
Straight-line travel makes shadows. Hold a coin in front of a lamp: the wall behind carries its outline, magnified if the lamp is a small point nearby, sharp-edged if the source is small and blurred if it is large. Shadows and pinholes are the two oldest experiments in optics.

### Umbra and penumbra
A point source casts a perfectly sharp shadow. A source of diameter $s$ at a distance $a$ from an opaque disc of diameter $d$, with a screen a distance $b$ behind the disc, makes a shadow with two parts:
- the **umbra**, where the disc hides the whole source: the darkest part, of width $d - (s-d)\\,b/a$;
- the **penumbra**, where it hides part of the source: partly lit, out to a total width $d + (s+d)\\,b/a$.

If the source is larger than the disc the umbra tapers to a point at a distance $L = a\\,d/(s-d)$ behind it. Beyond that tip lies the **antumbra**, from where the disc appears as a dark spot inside a ring of the source. The farther the screen, the wider and fuzzier the penumbra: the sharpest shadow comes from a small source and an object near the screen.

### Eclipses are shadows
The Sun is 1.39 million km across at 150 million km: 0.53°. The Moon is 3474 km across, 400 times smaller and, by luck, 400 times nearer: also about 0.5°. The Moon's umbra is $L = 374\\,000$ km long, almost exactly its distance from Earth (357 000–407 000 km). When the Moon is nearer than the tip, the umbra reaches the ground as a spot at most 270 km wide: a total eclipse, lasting at most 7.5 minutes. When it is farther, the antumbra arrives and the Sun shows as a ring: an annular eclipse. The penumbra, about 7000 km across, gives a partial eclipse over a wide region. The Earth's umbra is 1.38 million km long and 9200 km wide at the Moon's distance, 2.6 Moon diameters; the eclipsed Moon glows red with light refracted through the atmosphere ([[atmospheric-refraction]]).

### The pinhole
A hole in a screen lets through, from each point of a scene, only a thin pencil of rays, and each pencil lands in its own place on a second screen: the image is inverted, with magnification $m = b/a$. A point is smeared into a disc of diameter $d\\,(1 + b/a)$, so a smaller hole is sharper — until diffraction takes over and spreads the light into an Airy disc of diameter $2.44\\,\\lambda b/d$ ([[the-airy-disk]]). The two are equal at $d \\approx \\sqrt{2.44\\,\\lambda b}$: 0.37 mm for $b = 100$ mm in green light, the best a pinhole camera can do, at f/270. That is 16 stops darker than f/1: a 1/1000 s exposure becomes about a minute ([[the-pinhole-camera]]).

Gaps between leaves act as pinholes, too: the round spots of sunlight under a tree are images of the Sun, 1/108 as wide as their distance from the gap (4.6 cm from 5 m up), and become crescents in a partial eclipse.

> [!warn] Never look at the Sun directly or through any instrument, even during an eclipse, without a certified solar filter. Project the Sun's image through a pinhole onto paper and look at the paper, not through the hole.

> [!key] A source of size $s$ casts an umbra and a penumbra whose widths follow from similar triangles; eclipses are such shadows. A pinhole makes an inverted image blurred by $d(1+b/a)$ and by diffraction $2.44\\lambda b/d$, best at $d \\approx \\sqrt{2.44\\lambda b}$.
`,
  ideas: [
    'A source of size s casts a dark umbra and a partly lit penumbra; a point source casts a sharp shadow.',
    'The umbra of a disc d lit by a larger source s ends at L = a·d/(s − d) behind it; beyond that, the antumbra shows a ring.',
    'The Moon\'s umbra (374 000 km) just reaches the Earth: total eclipses are rare and brief; annular ones happen when the Moon is farther.',
    'A pinhole makes an inverted image, magnification b/a, blurred by the geometric d(1 + b/a) and by diffraction 2.44 λb/d.',
    'The best pinhole has d ≈ √(2.44 λ b): 0.37 mm for 100 mm; its f-number is about 270.'
  ],
  pitfalls: [
    'The Moon must be bigger than the Sun to eclipse it — Only the angular sizes matter: the Moon is 400 times smaller but 400 times nearer. When it is slightly farther the eclipse is annular.',
    'A shadow is as big as the object — Only for a source at infinity (parallel light). A small source nearby magnifies the shadow by (a + b)/a, and an extended source blurs its edge.',
    'The smaller the pinhole, the sharper the image — Down to about d = √(2.44λb); below that diffraction spreads the light and the image gets worse.',
    'A pinhole focuses light — It does not focus anything: it merely selects thin pencils of rays. Everything is equally "in focus", at the price of being faint and soft.'
  ],
  terms: [
    { term: 'Umbra', def: 'The darkest part of a shadow, where the opaque object hides the whole of the source. Its width falls with distance behind the object and ends at a tip if the source is larger than the object.' },
    { term: 'Penumbra', def: 'The partly lit fringe of a shadow, where only part of the source is hidden. Its width grows with the source\'s size and the distance behind the object.' },
    { term: 'Antumbra', def: 'The region beyond the tip of the umbra from which an object appears as a dark disc inside a bright ring of the source: where an annular eclipse is seen.' },
    { term: 'Pinhole camera', also: ['camera obscura', 'pinhole imaging'], def: 'A screen with a small hole that forms an inverted image on a second screen behind it, without any lens. Its blur is set by the hole\'s size and by diffraction.' },
    { term: 'Geometric blur', also: ['geometric blur disc'], def: 'The size of the disc into which a point is smeared by a finite aperture, according to straight rays alone: d(1 + b/a) for a pinhole.' }
  ],
  formulas: [
    {
      name: 'Length of the umbra',
      expr: 'Lu = a/(s/d - 1)', tex: 'L_{u} = \\frac{a\\,d}{s - d} = \\frac{a}{s/d - 1}',
      vars: {
        Lu: { name: 'length of the umbra behind the object', q: 'length', unit: 'km', tex: 'L_{u}' },
        a: { name: 'distance from source to object', q: 'length', unit: 'km', value: 149600000, tex: 'a' },
        s: { name: 'diameter of the source', q: 'length', unit: 'km', value: 1392700, min: 0, tex: 's' },
        d: { name: 'diameter of the object', q: 'length', unit: 'km', value: 3474.8, tex: 'd' }
      },
      solveFor: 'Lu',
      note: 'Needs s > d. Defaults: the Sun and the Moon, 374 000 km.',
      stories: { Lu: 'A disc {d} across is lit by a source {s} across, {a} away. How far behind the disc does its umbra reach?' }
    },
    {
      name: 'Image size in a pinhole camera',
      expr: 'h2 = h1*b/a', tex: 'h_{2} = h_{1}\\,\\frac{b}{a}',
      vars: {
        h2: { name: 'height of the image', q: 'length', unit: 'mm', tex: 'h_{2}' },
        h1: { name: 'height of the object', q: 'length', unit: 'm', value: 10, tex: 'h_{1}' },
        b: { name: 'distance from hole to screen', q: 'length', unit: 'mm', value: 100, tex: 'b' },
        a: { name: 'distance from object to hole', q: 'length', unit: 'm', value: 50, tex: 'a' }
      },
      solveFor: 'h2',
      note: 'The image is upside down.',
      stories: { h2: 'A tree {h1} tall stands {a} from a pinhole camera whose screen is {b} behind the hole. How tall is its image?' }
    },
    {
      name: 'Geometric blur of a pinhole',
      expr: 'bl = d*(1 + b/a)', tex: 'w_{g} = d\\left(1 + \\frac{b}{a}\\right)',
      vars: {
        bl: { name: 'diameter of the blur disc', q: 'length', unit: 'mm', tex: 'w_{g}' },
        d: { name: 'diameter of the pinhole', q: 'length', unit: 'mm', value: 0.5, tex: 'd' },
        b: { name: 'distance from hole to screen', q: 'length', unit: 'mm', value: 100, tex: 'b' },
        a: { name: 'distance from object to hole', q: 'length', unit: 'mm', value: 500, tex: 'a' }
      },
      solveFor: 'bl',
      note: 'The image of a point source: straight-ray (geometric) optics only.'
    },
    {
      name: 'Diffraction blur of a pinhole',
      expr: 'wd = 2.44*lambda*b/d', tex: 'w_{d} = \\frac{2.44\\,\\lambda\\,b}{d}',
      vars: {
        wd: { name: 'diameter of the Airy disc', q: 'length', unit: 'mm', tex: 'w_{d}' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        b: { name: 'distance from hole to screen', q: 'length', unit: 'mm', value: 100, tex: 'b' },
        d: { name: 'diameter of the pinhole', q: 'length', unit: 'mm', value: 0.5, tex: 'd' }
      },
      solveFor: 'wd',
      note: 'To the first dark ring of the Airy pattern; the smaller the hole the larger this blur.'
    },
    {
      name: 'Best pinhole diameter',
      expr: 'dbest = sqrt(2.44*lambda*b)', tex: 'd_{\\mathrm{best}} = \\sqrt{2.44\\,\\lambda\\,b}',
      vars: {
        dbest: { name: 'pinhole diameter for least blur', q: 'length', unit: 'mm', tex: 'd_{\\mathrm{best}}' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        b: { name: 'distance from hole to screen', q: 'length', unit: 'mm', value: 100, tex: 'b' }
      },
      solveFor: 'dbest',
      note: 'Where the geometric and diffraction blurs are equal (object at infinity). Other criteria give a coefficient between 1.5 and 2 times √(λb).'
    }
  ],
  examples: [
    {
      title: 'Will the Moon\'s umbra reach the Earth?',
      q: 'The Sun is 1 392 700 km across, the Moon 3474.8 km, and the Sun–Moon distance 149.6 million km. The Moon is 357 000 km from Earth at its nearest and 407 000 km at its farthest. Where does the umbra end, and what kind of eclipse results at each extreme?',
      steps: [
        { text: 'The length of the umbra:', tex: 'L_u = \\frac{a}{s/d - 1} = \\frac{1.496\\times10^{8}}{400.8 - 1} = 374\\,000\\ \\mathrm{km}' },
        'At perigee the Moon is 357 000 km away, inside 374 000 km: the tip reaches Earth, 17 000 km to spare, and the eclipse is total. At apogee it is 407 000 km away, beyond the tip, so Earth lies in the antumbra: an annular eclipse.'
      ],
      a: 'The umbra ends 374 000 km behind the Moon. Total eclipse when the Moon is nearer than that, annular when it is farther: the Moon\'s distance varies by about ±7 %, and the umbra tip sits in the middle of that range.'
    },
    {
      title: 'The best pinhole for a 100 mm camera',
      q: 'What diameter of pinhole gives the smallest blur for a pinhole camera 100 mm deep in green light (550 nm), and how much longer is the exposure than at f/8?',
      steps: [
        { text: 'Equate the geometric blur $d$ (distant scene) to the diffraction blur $2.44\\lambda b/d$:', tex: 'd = \\sqrt{2.44\\times550\\times10^{-9}\\times0.1} = 3.66\\times10^{-4}\\ \\mathrm{m} = 0.37\\ \\mathrm{mm}' },
        { text: 'The f-number is $b/d = 100/0.366 = 273$, so against f/8 the exposure is longer by', tex: '\\left(\\frac{273}{8}\\right)^{2} = 1164' }
      ],
      a: 'A hole of 0.37 mm (f/273), giving a blur of about 0.5 mm. The exposure is about 1200 times longer than for f/8: 1/125 s becomes 9 s.'
    }
  ],
  quiz: [
    { q: 'In which region of a shadow is the whole of the light source hidden from view?', choices: ['The penumbra', 'The umbra', 'The antumbra', 'Outside the shadow'], a: 1, why: 'The umbra is where the object hides the whole source. In the penumbra only part of the source is hidden, and in the antumbra the object appears smaller than the source and leaves a ring of it visible.' },
    { q: 'A larger light source casts a sharper shadow than a smaller one.', a: false, why: 'A larger source enlarges the penumbra and shrinks the umbra: the shadow is blurrier. A point source gives the sharpest shadow.' },
    { q: 'A tree 10 m tall stands 50 m from a pinhole camera whose screen is 100 mm behind the hole. How tall is its image, in mm?', answer: 20, unit: 'mm', why: '$h_2 = h_1\\,b/a = 10\\ \\mathrm{m}\\times0.1/50 = 0.02$ m = 20 mm, upside down.' },
    { q: 'Why does making a pinhole smaller and smaller eventually make the image worse?', choices: ['The hole lets in too little light to see', 'Diffraction spreads the light into an Airy disc whose size grows as the hole shrinks', 'The rays curve towards the edge', 'The image becomes right way up'], a: 1, why: 'The geometric blur falls with the hole size, but the diffraction blur $2.44\\lambda b/d$ rises. Their sum is least at $d\\approx\\sqrt{2.44\\lambda b}$.' },
    { q: 'During a partial solar eclipse the round patches of sunlight under a tree become crescents. Why?', choices: ['Each gap between leaves is a pinhole forming an image of the partly eclipsed Sun', 'The leaves are cut in crescent shapes', 'The air refracts the light', 'The Moon\'s shadow is crescent-shaped'], a: 0, why: 'Each small gap acts as a pinhole camera, and the patch on the ground is an image of the Sun. When the Moon covers part of the Sun, the images are crescents.' }
  ],
  applications: [
    'Eclipse prediction: the paths of totality and annularity follow from the geometry of the Sun, Moon and Earth shadows.',
    'Shadowless surgical lamps use a large source, several lamps and reflectors, so that every point of the field sees part of the light and no deep umbra forms.',
    'Pinhole cameras: a simple, lens-free camera with infinite depth of field; also used to image X-rays, gamma rays and neutrons, which lenses cannot focus.',
    'Pinhole spatial filters clean a laser beam; the pinhole size is chosen against the focused spot, not the camera rule.',
    'Sundials, solar-eclipse projectors and "pinhole glasses" all use the straight-line geometry of small holes and shadows.'
  ],
  history: 'The pinhole image was described in China by Mozi in the fifth century BC and by Aristotle, who noticed crescent images of the eclipsed Sun under trees. Ibn al-Haytham (about 1021) built the first careful theory of the camera obscura, used it to observe eclipses and showed that the image is inverted because rays cross at the hole. Lord Rayleigh (1891) worked out the best size of a pinhole.',
  sources: [
    'M. Minnaert, *Light and Colour in the Outdoors* and D. K. Lynch and W. Livingston, *Color and Light in Nature* — spots of sunlight under trees, eclipses and shadows.',
    'Lord Rayleigh, "On pin-hole photography", *Philosophical Magazine* (1891) — the optimum size of a pinhole.',
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — shadows, the pinhole and the straight-line propagation of light.',
    'F. Espenak and J. Meeus, *Five Millennium Canon of Solar Eclipses: −1999 to +3000*, NASA Technical Publication TP-2006-214141 — the geometry and the durations of eclipses.'
  ],
  sim: 'nl-shadow-pinhole'
}

);
