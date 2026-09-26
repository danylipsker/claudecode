/* HYPER-PHYSICS · content/quantum-origins.js — the birth of quantum physics:
 * blackbody light, photons, the photoelectric and Compton effects, matter waves,
 * wave–particle duality and the uncertainty principle. */
Hyper.add(

{
  id: 'blackbody-radiation', parent: 'quantum-origins', title: 'Blackbody radiation', level: 2,
  short: 'The glow of a hot object depends only on its temperature. Explaining the shape of that glow forced Planck to assume that energy is exchanged in packets of size hf.',
  keywords: ['blackbody', 'black body', 'Planck', 'Planck\'s law', 'Wien\'s law', 'ultraviolet catastrophe', 'Rayleigh–Jeans', 'Stefan–Boltzmann', 'thermal radiation', 'colour temperature', 'quantum of energy', 'cavity radiation'],
  prereq: ['thermal-radiation', 'em-spectrum', 'equipartition'],
  related: ['photon', 'stellar-spectra', 'cosmic-microwave-background', 'quantum-harmonic-oscillator'],
  body: `
Everything with a temperature glows. A stove ring at 900 K glows dull red, a lamp filament at 2800 K yellow-white, the surface of the Sun at 5800 K white — and you glow too, at 310 K, in the infrared that thermal cameras see. A **blackbody** is the ideal emitter behind all of these: an object that absorbs every wavelength falling on it. The best laboratory version is a small hole in the wall of a closed oven. Light that enters bounces around inside until it is absorbed, so the hole looks perfectly black when cold; when hot, the light leaking out depends on *nothing but the temperature* of the walls, not on what they are made of.

### The shape of the glow
Measure the power at each wavelength and you get a lopsided hump: little at short wavelengths, a peak, then a long tail into the infrared. Two rules describe it.

- **Wien's displacement law**: the peak moves to shorter wavelengths as the body gets hotter, $\\lambda_{\\max} T = b = 2.898 \\times 10^{-3}\\ \\mathrm{m\\,K}$. The Sun peaks near 500 nm, a filament near 1 µm (so an old-fashioned bulb makes mostly heat), your skin near 9.3 µm, and the cosmic microwave background, at 2.725 K, near 1.06 mm.
- **Stefan–Boltzmann law**: the total power per square metre of surface grows as the fourth power of temperature, $j = \\sigma T^4$ ([[thermal-radiation]]). Double the temperature and each square metre radiates sixteen times as much.

### The ultraviolet catastrophe
Classical physics treated the radiation in the oven as a collection of standing waves, and gave each one the same average energy $k_BT$ ([[equipartition]]). But the number of possible standing waves grows without limit as the wavelength shrinks, and the result, the **Rayleigh–Jeans law**

$$B_\\lambda = \\frac{2 c k_B T}{\\lambda^4},$$

fits the measurements at long wavelengths but climbs to infinity at short ones: every warm object would pour out unlimited ultraviolet energy. Nature plainly does not.

### Planck's quantum
In 1900 Max Planck found a formula that fits the data at every wavelength, and then found the price of deriving it: the walls can exchange energy with a wave of frequency $f$ only in whole packets of size $hf$, with $h = 6.626 \\times 10^{-34}\\ \\mathrm{J\\,s}$. A high-frequency wave needs a large packet. When $hf$ is much larger than $k_BT$ the walls almost never have that much thermal energy to spare, and the average energy of the wave drops from $k_BT$ to

$$\\bar E = \\frac{hf}{e^{hf/k_BT} - 1}.$$

The high frequencies are frozen out and the catastrophe disappears. Multiplying by the number of waves at each wavelength gives **Planck's law**:

$$B_\\lambda(\\lambda, T) = \\frac{2hc^2}{\\lambda^5}\\, \\frac{1}{e^{hc/\\lambda k_B T} - 1}$$

At long wavelengths, where $hc/\\lambda \\ll k_BT$, the exponential is close to $1 + hc/\\lambda k_BT$ and Planck's law turns back into Rayleigh–Jeans. Wien's law and the Stefan–Boltzmann law both follow from it, with $b$ and $\\sigma$ expressed through $h$, $c$ and $k_B$.

> [!note] Real surfaces emit less than a blackbody at each wavelength, by a factor called the emissivity. Stars come close to blackbodies, and the cosmic microwave background is the most perfect blackbody spectrum ever measured.

> [!key] Planck regarded the quantum as a device about the oven walls. In 1905 Einstein took it literally: light itself travels in packets — [[photon|photons]].
`,
  ideas: [
    'A blackbody absorbs all radiation that falls on it; the spectrum it emits depends only on its temperature.',
    'Hotter means brighter at every wavelength, and the peak moves to shorter wavelengths: λ_max T = 2.898 mm·K.',
    'The total power radiated per square metre grows as T⁴.',
    'Classical physics, with k_BT in every standing wave, predicts infinite ultraviolet output; Planck removed it by letting energy be exchanged only in quanta hf.',
    'Planck\'s law turns into the classical Rayleigh–Jeans law when hf ≪ k_BT.'
  ],
  pitfalls: [
    'A blackbody looks black — Only when it is cold. A hot blackbody is the brightest possible thermal emitter at its temperature; the Sun is close to one.',
    'The colour you see is the colour at the peak — The eye sees the whole spectrum. The Sun peaks in the blue-green but looks white, and nothing glows green from heat alone.',
    'Planck discovered the photon — Planck quantized the energy exchanged by the emitting walls, and was uneasy about it. The idea that light itself consists of quanta is Einstein\'s, from 1905.'
  ],
  formulas: [
    {
      name: 'Wien\'s displacement law',
      expr: 'lmax = b/T', tex: '\\lambda_{\\max} = \\frac{b}{T}',
      vars: {
        lmax: { name: 'wavelength of peak emission', q: 'length', unit: 'nm', tex: '\\lambda_{\\max}' },
        b: { const: 'bW' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 5772 }
      },
      stories: {
        lmax: 'The surface of the Sun is at {T}. At what wavelength is its emission strongest?',
        T: 'The spectrum of a star peaks at {lmax}. What is its surface temperature?'
      }
    },
    {
      name: 'Stefan–Boltzmann law (power per area)',
      expr: 'j = sigma*T^4',
      vars: {
        j: { name: 'power radiated per square metre', q: 'intensity', unit: 'W/m²' },
        sigma: { const: 'sigma' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 5772 }
      },
      stories: {
        j: 'How much power does each square metre of a blackbody at {T} radiate?',
        T: 'Each square metre of a blackbody radiates {j}. What is its temperature?'
      }
    },
    {
      name: 'Average energy of a standing wave (Planck)',
      expr: 'E = h*f/(exp(h*f/(kB*T)) - 1)', tex: '\\bar E = \\frac{hf}{e^{hf/k_BT} - 1}',
      vars: {
        E: { name: 'average energy of the wave', q: 'energy', unit: 'eV', tex: '\\bar E' },
        h: { const: 'h' },
        f: { name: 'frequency of the wave', q: 'frequency', unit: 'THz', value: 10 },
        kB: { const: 'kB' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 300 }
      },
      note: 'Classical physics gives every wave $k_BT$ (0.0259 eV at 300 K). Waves with $hf \\ll k_BT$ still get about that much; waves with $hf \\gg k_BT$ get almost nothing.',
      practice: { unknowns: ['E', 'T'] },
      stories: {
        E: 'In an oven at {T}, what is the average energy of a standing wave of frequency {f}?',
        T: 'At what temperature does a wave of frequency {f} hold an average energy of {E}?'
      }
    },
    {
      name: 'Planck\'s law (spectral radiance)',
      expr: 'B = 2*h*c^2/lambda^5/(exp(h*c/(lambda*kB*T)) - 1)',
      tex: 'B_\\lambda = \\frac{2hc^2}{\\lambda^5}\\,\\frac{1}{e^{hc/\\lambda k_B T} - 1}',
      vars: {
        B: { name: 'spectral radiance', unit: 'W/(m²·sr·m)', tex: 'B_\\lambda' },
        h: { const: 'h' }, c: { const: 'c' }, kB: { const: 'kB' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 1000 },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 5772 }
      },
      note: 'Power per unit area of surface, per unit solid angle, per metre of wavelength. Solving for $\\lambda$ can give two answers, one on each side of the peak.',
      practice: { unknowns: ['B', 'T'] }
    }
  ],
  derivation: {
    title: 'From counting waves to Planck\'s law',
    steps: [
      { text: 'Count the standing electromagnetic waves that fit in a box. Per unit volume, the number with wavelengths between $\\lambda$ and $\\lambda + d\\lambda$ (both polarizations) is', tex: 'n(\\lambda)\\,d\\lambda = \\frac{8\\pi}{\\lambda^4}\\,d\\lambda' },
      { text: 'Classically each wave holds $k_BT$ on average. The energy density per wavelength is then the Rayleigh–Jeans result, whose integral over all wavelengths diverges:', tex: 'u_\\lambda = \\frac{8\\pi k_B T}{\\lambda^4}, \\qquad \\int_0^\\infty u_\\lambda\\, d\\lambda = \\infty' },
      { text: 'Planck: a wave of frequency $f$ can hold only $0, hf, 2hf, \\dots$ With Boltzmann weights $e^{-E/k_BT}$ the average is a ratio of [[math:geometric-series|geometric series]]:', tex: '\\bar E = \\frac{\\sum_n nhf\\, e^{-nhf/k_BT}}{\\sum_n e^{-nhf/k_BT}} = \\frac{hf}{e^{hf/k_BT} - 1}' },
      { text: 'Use this average instead of $k_BT$, with $f = c/\\lambda$:', tex: 'u_\\lambda = \\frac{8\\pi hc}{\\lambda^5}\\,\\frac{1}{e^{hc/\\lambda k_B T} - 1}' },
      { text: 'The radiance leaving an opening is $c/4\\pi$ times the energy density inside, which gives Planck\'s law:', tex: 'B_\\lambda = \\frac{c}{4\\pi}\\, u_\\lambda = \\frac{2hc^2}{\\lambda^5}\\,\\frac{1}{e^{hc/\\lambda k_B T} - 1}' }
    ]
  },
  examples: [
    {
      title: 'Two stars in Orion',
      q: 'The spectrum of Rigel peaks near 240 nm and that of Betelgeuse near 830 nm. Treating both as blackbodies, estimate their surface temperatures. How much more power does each square metre of Rigel radiate?',
      steps: [
        'Wien: $T = b/\\lambda_{\\max}$. Rigel: $T = \\dfrac{2.898\\times10^{-3}}{240\\times10^{-9}} \\approx 12\\,100\\ \\mathrm{K}$.',
        'Betelgeuse: $T = \\dfrac{2.898\\times10^{-3}}{830\\times10^{-9}} \\approx 3500\\ \\mathrm{K}$.',
        'Power per square metre goes as $T^4$: $\\left(\\dfrac{12\\,100}{3500}\\right)^4 = 3.46^4 \\approx 143$.',
        'Betelgeuse is nevertheless very luminous overall, because its surface area is enormous — it is a red supergiant.'
      ],
      a: 'About 12 000 K and 3500 K; Rigel radiates about 140 times more per square metre.'
    },
    {
      title: 'Why a filament lamp is a heater',
      q: 'A tungsten filament runs at about 2800 K. Where does its spectrum peak, and roughly what fraction of its radiation is visible?',
      steps: [
        'Wien: $\\lambda_{\\max} = 2.898\\times10^{-3} / 2800 = 1.03\\times10^{-6}\\ \\mathrm{m}$ — about 1 µm, in the near infrared.',
        'At 550 nm, the middle of the visible band, Planck\'s law gives only about 30 % of the radiance at the peak, and it falls further towards the blue.',
        'Integrating Planck\'s law numerically from 400 to 700 nm and dividing by $\\sigma T^4/\\pi$ gives about 6 %.',
        'The other 94 % leaves as infrared — heat. LEDs, which do not rely on temperature, put most of their output into the visible.'
      ],
      a: 'Peak near 1 µm; only about 6 % of the output is visible light.'
    },
    {
      title: 'How wrong is the classical formula?',
      q: 'For the Sun\'s surface (5772 K), compare the Rayleigh–Jeans prediction with Planck\'s law at 10 µm, 500 nm and 100 nm.',
      steps: [
        'The ratio Planck / Rayleigh–Jeans is $\\dfrac{x}{e^x - 1}$ with $x = \\dfrac{hc}{\\lambda k_B T}$, and $hc/k_BT = 2.49\\ \\mathrm{µm}$ at 5772 K.',
        'At 10 µm: $x = 0.249$, ratio $= 0.88$. The classical formula is only 12 % too high.',
        'At 500 nm: $x = 4.99$, ratio $= 0.034$. Classical physics is about 30 times too high.',
        'At 100 nm: $x = 24.9$, ratio $\\approx 4\\times10^{-10}$. The classical answer is billions of times too large, and it keeps growing as $1/\\lambda^4$.'
      ],
      a: 'Close agreement in the infrared, a factor of 30 in the visible, and a catastrophe in the ultraviolet.'
    }
  ],
  quiz: [
    { q: 'A blackbody is heated from 3000 K to 6000 K. The power radiated by each square metre becomes…', choices: ['2 times larger', '4 times larger', '8 times larger', '16 times larger'], a: 3,
      why: 'Power per area goes as $T^4$, and $2^4 = 16$. The peak also moves to half the wavelength.' },
    { q: 'Why does no star look green?', choices: ['Green stars would be too hot to see', 'A blackbody spectrum is so broad that when it peaks in the green it also gives plenty of red and blue, which together look white', 'Interstellar dust absorbs green light', 'Stellar spectra only peak in the red or the blue'], a: 1,
      why: 'The hump spans the whole visible band. A star peaking in the green, like the Sun, sends a nearly even mixture of all colours, which we see as white.' },
    { q: 'What goes wrong with the Rayleigh–Jeans law at short wavelengths?', choices: ['It predicts no radiation at all', 'It predicts radiation that grows without limit, because every one of the ever more numerous short waves gets k_BT', 'It gives negative energies', 'It puts the peak at the wrong temperature'], a: 1,
      why: 'The number of standing waves per wavelength grows as $1/\\lambda^4$, and giving each the same $k_BT$ makes the total infinite — the ultraviolet catastrophe.' },
    { q: 'In Planck\'s theory, a standing wave whose quantum $hf$ is much larger than $k_BT$ holds almost no energy on average.', a: true,
      why: 'Exciting it even once takes $hf$, and the chance of finding that much thermal energy is about $e^{-hf/k_BT}$, which is tiny.' },
    { q: 'Your skin, at about 310 K, radiates most strongly near…', choices: ['500 nm (visible)', '9 µm (infrared)', '1 mm (microwave)', '100 nm (ultraviolet)'], a: 1,
      why: '$\\lambda_{\\max} = 2.898\\times10^{-3}/310 = 9.3\\ \\mathrm{µm}$. Thermal cameras work between about 8 and 14 µm for this reason.' }
  ],
  applications: [
    'Pyrometers and thermal cameras read temperature from the infrared an object emits.',
    'Astronomers measure the surface temperatures of stars from their colour.',
    'The colour temperature of lamps and the white balance of cameras: 2700 K for warm light, 6500 K for daylight.',
    'The cosmic microwave background, a 2.725 K blackbody left over from the early universe.'
  ],
  history: 'Gustav Kirchhoff defined the blackbody in 1859. Careful measurements in Berlin in the 1890s showed where the existing formulas failed. Planck announced his radiation law in October 1900 and its derivation with energy quanta on 14 December 1900, a date often called the birthday of quantum theory.',
  sim: 'qm-blackbody'
},

{
  id: 'photon', parent: 'quantum-origins', title: 'The photon', level: 1,
  short: 'Light comes in packets called photons. Each carries energy E = hf and momentum p = h/λ, however faint or bright the beam.',
  keywords: ['photon', 'quantum of light', 'light quantum', 'E = hf', 'Planck constant', 'photon energy', 'electronvolt', 'photon momentum', 'photon flux', 'hc = 1240 eV nm'],
  prereq: ['em-spectrum', 'blackbody-radiation', 'wave-properties'],
  related: ['photoelectric-effect', 'compton-scattering', 'radiation-pressure', 'wave-particle-duality', 'relativistic-energy'],
  body: `
In 1905 Einstein proposed that light is not only emitted and absorbed in packets, as Planck had reluctantly assumed for [[blackbody-radiation]], but *travels* as packets: **photons**. A beam of light of frequency $f$ is a stream of photons, each carrying the energy

$$E = hf = \\frac{hc}{\\lambda}$$

A brighter beam of the same colour carries *more photons per second*, not bigger ones. A bluer beam carries more energy in each photon.

### How big is a photon's energy?
Joules are awkward for single photons, so atomic physics uses the **electronvolt**: 1 eV = 1.602 × 10⁻¹⁹ J, the energy an electron gains crossing a potential difference of 1 V ([[electric-potential]]). A combination worth remembering is

$$hc = 1240\\ \\mathrm{eV\\,nm}, \\qquad E\\ [\\mathrm{eV}] \\approx \\frac{1240}{\\lambda\\ [\\mathrm{nm}]}$$

| Radiation | Wavelength | Energy per photon |
|---|---|---|
| FM radio, 100 MHz | 3 m | 4 × 10⁻⁷ eV |
| Microwave oven | 12 cm | 1 × 10⁻⁵ eV |
| Thermal infrared | 10 µm | 0.12 eV |
| Red light | 700 nm | 1.8 eV |
| Violet light | 400 nm | 3.1 eV |
| Germicidal UV lamp | 254 nm | 4.9 eV |
| Medical X-ray | 20 pm | 62 keV |
| Gamma ray from cobalt-60 | 1 pm | 1.2 MeV |

A chemical bond takes a few electronvolts to break. That is why ultraviolet light causes sunburn and fades paint, while no amount of red light or radio does: for one molecule, what counts is the energy of *one* photon, not the total delivered. [[x-rays|X-rays]] and gamma rays carry enough to ionize atoms outright.

### Momentum without mass
A photon has no mass, travels at $c$, and still carries momentum:

$$p = \\frac{E}{c} = \\frac{h}{\\lambda}$$

This is the zero-mass case of the relativistic relation $E^2 = (pc)^2 + (mc^2)^2$ ([[relativistic-energy]]). One photon's push is tiny, but trillions per second add up to [[radiation-pressure]], which shapes comet tails and can drive a solar sail. In [[compton-scattering]] a photon bounces off an electron like a billiard ball, momentum and all.

### Counting photons
A beam of power $P$ delivers $N = P/hf = P\\lambda/hc$ photons per second. A 1 mW red laser pointer emits about $3 \\times 10^{15}$ every second, so the graininess of its light is invisible. Yet a dark-adapted eye responds to a few photons, and photon-counting detectors click once per photon — the particle side of light made audible.

> [!note] The photon picture does not replace the wave picture: interference and diffraction still need waves. The wave tells us where photons are likely to arrive ([[wave-particle-duality]]).
`,
  ideas: [
    'Light of frequency f is emitted, absorbed and carried in packets of energy E = hf = hc/λ.',
    'Brightness counts photons; colour sets the energy of each one.',
    'E in electronvolts ≈ 1240 divided by λ in nanometres.',
    'A photon has zero mass, moves at c and carries momentum p = h/λ.'
  ],
  pitfalls: [
    'Brighter light has more energetic photons — Brighter means more photons per second. The energy of each depends only on the frequency.',
    'Something with no mass cannot have momentum — For a massless particle relativity gives p = E/c. Photon momentum is measured directly, in radiation pressure and in Compton scattering.',
    'Radio waves are harmless because they are weak — A transmitter can be very powerful and can heat things. Its photons are just individually far too small to break a chemical bond.'
  ],
  formulas: [
    {
      name: 'Energy of a photon from its frequency',
      expr: 'E = h*f',
      vars: {
        E: { name: 'photon energy', q: 'energy', unit: 'eV' },
        h: { const: 'h' },
        f: { name: 'frequency', q: 'frequency', unit: 'THz', value: 545 }
      },
      stories: {
        E: 'Green light has a frequency of {f}. How much energy does one photon carry?',
        f: 'What is the frequency of a photon of energy {E}?'
      }
    },
    {
      name: 'Energy of a photon from its wavelength',
      expr: 'E = h*c/lambda', tex: 'E = \\frac{hc}{\\lambda}',
      vars: {
        E: { name: 'photon energy', q: 'energy', unit: 'eV' },
        h: { const: 'h' }, c: { const: 'c' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 532 }
      },
      stories: {
        E: 'A green laser pointer emits light of wavelength {lambda}. How much energy does each photon carry?',
        lambda: 'What is the wavelength of a photon of energy {E}?'
      }
    },
    {
      name: 'Momentum of a photon',
      expr: 'p = h/lambda', tex: 'p = \\frac{h}{\\lambda}',
      vars: {
        p: { name: 'photon momentum', q: 'momentum', unit: 'kg·m/s' },
        h: { const: 'h' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 532 }
      },
      stories: { p: 'What momentum does a photon of wavelength {lambda} carry?' }
    },
    {
      name: 'Photons per second in a beam',
      expr: 'N = P*lambda/(h*c)', tex: 'N = \\frac{P\\lambda}{hc}',
      vars: {
        N: { name: 'photons per second', unit: '1/s' },
        P: { name: 'beam power', q: 'power', unit: 'mW', value: 1 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 650 },
        h: { const: 'h' }, c: { const: 'c' }
      },
      stories: {
        N: 'A laser pointer emits {P} of light of wavelength {lambda}. How many photons leave it each second?',
        P: 'A detector counts {N} photons per second of wavelength {lambda}. What power does the beam carry?'
      }
    }
  ],
  examples: [
    {
      title: 'Photons from a laser pointer',
      q: 'A 5.0 mW green laser pointer emits at 532 nm. Find the energy of one photon, the number of photons per second, and the force the beam exerts on a surface that absorbs it.',
      steps: [
        '$E = \\dfrac{hc}{\\lambda} = \\dfrac{1240\\ \\mathrm{eV\\,nm}}{532\\ \\mathrm{nm}} = 2.33\\ \\mathrm{eV} = 3.73\\times10^{-19}\\ \\mathrm{J}$.',
        '$N = \\dfrac{P}{E} = \\dfrac{5.0\\times10^{-3}}{3.73\\times10^{-19}} = 1.3\\times10^{16}$ photons per second.',
        'Each photon carries $p = h/\\lambda = 1.25\\times10^{-27}\\ \\mathrm{kg\\,m/s}$. The force is the momentum delivered per second, $F = Np = P/c = 5.0\\times10^{-3}/3.00\\times10^8 = 1.7\\times10^{-11}\\ \\mathrm{N}$.'
      ],
      a: '2.33 eV per photon, 1.3 × 10¹⁶ photons per second, and a force of about 1.7 × 10⁻¹¹ N.'
    },
    {
      title: 'Why ultraviolet burns and red light does not',
      q: 'Breaking a carbon–carbon bond takes about 3.6 eV. What is the longest wavelength whose photons can do it? Can red light at 700 nm?',
      steps: [
        '$\\lambda_{\\max} = \\dfrac{hc}{E} = \\dfrac{1240\\ \\mathrm{eV\\,nm}}{3.6\\ \\mathrm{eV}} = 344\\ \\mathrm{nm}$, in the ultraviolet.',
        'A 700 nm photon carries $1240/700 = 1.77\\ \\mathrm{eV}$, half of what is needed.',
        'Making the red light brighter only sends more 1.77 eV photons. A molecule does not normally absorb two at once, so the bond survives.'
      ],
      a: 'Up to about 344 nm (ultraviolet); red photons carry only 1.8 eV and cannot break the bond.'
    }
  ],
  quiz: [
    { q: 'You double the intensity of a beam of red light without changing its colour. What happens to its photons?', choices: ['Each carries twice the energy', 'There are twice as many per second, each with the same energy', 'Their wavelength halves', 'They travel faster'], a: 1,
      why: 'The energy of each photon is fixed by the frequency. Intensity is the number of photons per second times the energy of each.' },
    { q: 'Which photon carries the most energy?', choices: ['a 2.4 GHz Wi-Fi photon', 'a 10 µm infrared photon', 'a 650 nm red photon', 'a 400 nm violet photon'], a: 3,
      why: '$E = hc/\\lambda$: the shortest wavelength wins. The violet photon carries 3.1 eV, the Wi-Fi photon only $10^{-5}$ eV.' },
    { q: 'Roughly what is the energy of a 620 nm photon?', choices: ['0.5 eV', '2 eV', '6 eV', '620 eV'], a: 1, why: '$1240/620 = 2.0$ eV.' },
    { q: 'A photon has momentum even though it has no mass.', a: true,
      why: 'For a massless particle $p = E/c = h/\\lambda$. Light pressure on mirrors and Compton scattering both measure it.' }
  ],
  applications: [
    'Solar cells and camera sensors: each absorbed photon can free at most one electron.',
    'Sun protection: UV-B photons (280–315 nm) carry enough energy to damage DNA directly.',
    'Photon-counting detectors in astronomy, medical PET scanners and quantum-optics experiments.'
  ],
  history: 'Einstein\'s "light quantum" paper of 1905 was received sceptically for almost two decades; Compton scattering (1923) finally convinced most physicists. The name "photon" was coined by the chemist Gilbert Lewis in 1926.',
  sim: 'qm-photoelectric'
},

{
  id: 'photoelectric-effect', parent: 'quantum-origins', title: 'The photoelectric effect', level: 2,
  short: 'Light shining on a metal knocks electrons out — but only if its frequency is high enough, however bright it is. Einstein explained why with photons.',
  keywords: ['photoelectric effect', 'work function', 'stopping potential', 'stopping voltage', 'threshold frequency', 'cut-off wavelength', 'photoelectron', 'Einstein', 'Millikan', 'photocell', 'photoemission'],
  prereq: ['photon', 'electric-potential', 'kinetic-energy'],
  related: ['compton-scattering', 'wave-particle-duality', 'fermi-energy', 'semiconductors'],
  body: `
Shine ultraviolet light on a clean zinc plate and it loses negative charge: the light knocks electrons out of the metal. Heinrich Hertz stumbled on the effect in 1887, and by 1902 Philipp Lenard had measured it carefully, with results the wave theory of light could not explain.

### The experiment
Two metal electrodes sit in an evacuated tube. Light falls on one, the photocathode; electrons it releases fly across to the other and a current flows. Make the collecting electrode *negative* and the electrons must climb a potential hill. At the **stopping voltage** $V_s$ even the fastest are turned back and the current stops, so

$$K_{\\max} = e V_s$$

### Four puzzles
1. Below a **threshold frequency** $f_0$ no electrons come out at all, however intense the light. Red light on zinc does nothing even at blinding intensity; faint ultraviolet works at once.
2. Above threshold, $K_{\\max}$ rises in a straight line with the frequency and **does not depend on the intensity**.
3. Brighter light gives **more** electrons — a larger current — not faster ones.
4. Emission starts **without delay**, within nanoseconds, even in light so dim that a spreading wave would need minutes to pour enough energy into any one atom.

### Einstein's explanation
In 1905 Einstein proposed that light arrives as [[photon|photons]] of energy $hf$, and that one photon gives all its energy to one electron. To escape, the electron must spend at least the **work function** $\\phi$, a few electronvolts that depend on the metal. Whatever is left is kinetic energy:

$$K_{\\max} = hf - \\phi$$

Every puzzle dissolves. If $hf < \\phi$ no single photon can free an electron, and sending more photons does not help, because an electron cannot save up energy from several of them. Intensity sets the number of photons, and so the current. One photon acts at once, so there is no delay. Electrons from below the surface lose some energy on the way out, which is why the formula gives the *maximum* kinetic energy.

The threshold is $f_0 = \\phi/h$, or a cut-off wavelength $\\lambda_0 = hc/\\phi$:

| Metal | Work function | Cut-off wavelength |
|---|---|---|
| Caesium | 2.1 eV | 590 nm |
| Sodium | 2.3 eV | 540 nm |
| Zinc | 4.3 eV | 290 nm |
| Copper | 4.7 eV | 260 nm |
| Platinum | 5.6 eV | 220 nm |

### Measuring Planck's constant
Combining the two equations, $V_s = (h/e)f - \\phi/e$. A graph of stopping voltage against frequency is a straight line of slope $h/e$ — the same for every metal — that crosses the frequency axis at $f_0$. Robert Millikan, who set out to disprove Einstein's idea, measured these lines with great care and published in 1916 a value of $h$ within about one per cent of today's. Einstein's Nobel Prize of 1921 was awarded for this law.

> [!tip] In the simulation, pick zinc and red light and turn the intensity all the way up: nothing. Then switch to ultraviolet at the lowest intensity: electrons at once. Use the collector voltage to find the stopping voltage.
`,
  ideas: [
    'One photon frees at most one electron and gives it all its energy hf.',
    'K_max = hf − φ: the electrons\' energy depends on the frequency of the light, not its intensity.',
    'Below the threshold frequency φ/h no electrons are emitted, however bright the light.',
    'Intensity sets the number of electrons per second, and so the current.',
    'The stopping voltage measures K_max; plotted against frequency it gives a line of slope h/e.'
  ],
  pitfalls: [
    'Brighter light gives faster electrons — It gives more electrons with the same spread of energies. Only a higher frequency makes them faster.',
    'Light below threshold will eventually free electrons if it is bright enough — An electron absorbs one photon at a time and loses the energy long before a second arrives. (Extremely intense laser pulses allow a weak two-photon process, a separate effect.)',
    'Every photoelectron has kinetic energy hf − φ — That is the maximum. Electrons that start deeper in the metal lose energy on the way out and emerge slower.'
  ],
  formulas: [
    {
      name: 'Einstein\'s photoelectric equation',
      expr: 'K = h*c/lambda - phi', tex: 'K_{\\max} = \\frac{hc}{\\lambda} - \\phi',
      vars: {
        K: { name: 'maximum kinetic energy of the electrons', q: 'energy', unit: 'eV', tex: 'K_{\\max}' },
        h: { const: 'h' }, c: { const: 'c' },
        lambda: { name: 'wavelength of the light', q: 'length', unit: 'nm', value: 400 },
        phi: { name: 'work function of the metal', q: 'energy', unit: 'eV', value: 2.28 }
      },
      note: 'Only meaningful when $hc/\\lambda > \\phi$; otherwise no electrons are emitted.',
      stories: {
        K: 'Violet light of wavelength {lambda} falls on sodium, whose work function is {phi}. What is the maximum kinetic energy of the electrons it ejects?',
        phi: 'Light of wavelength {lambda} ejects electrons with kinetic energies up to {K}. What is the work function of the metal?',
        lambda: 'Electrons leave a metal with work function {phi} with at most {K}. What is the wavelength of the light?'
      }
    },
    {
      name: 'Stopping voltage',
      expr: 'Vs = (h*f - phi)/qe', tex: 'V_s = \\frac{hf - \\phi}{e}',
      vars: {
        Vs: { name: 'stopping voltage', q: 'voltage', unit: 'V', tex: 'V_s' },
        h: { const: 'h' },
        f: { name: 'frequency of the light', q: 'frequency', unit: 'THz', value: 750 },
        phi: { name: 'work function', q: 'energy', unit: 'eV', value: 2.28 },
        qe: { const: 'qe' }
      },
      stories: {
        Vs: 'Light of frequency {f} falls on a metal with a work function of {phi}. What reverse voltage stops the fastest photoelectrons?',
        phi: 'A stopping voltage of {Vs} is needed when the light has frequency {f}. What is the work function?',
        f: 'What frequency of light gives a stopping voltage of {Vs} on a metal with work function {phi}?'
      }
    },
    {
      name: 'Cut-off wavelength',
      expr: 'lambda0 = h*c/phi', tex: '\\lambda_0 = \\frac{hc}{\\phi}',
      vars: {
        lambda0: { name: 'longest wavelength that ejects electrons', q: 'length', unit: 'nm' },
        h: { const: 'h' }, c: { const: 'c' },
        phi: { name: 'work function', q: 'energy', unit: 'eV', value: 4.3 }
      },
      stories: {
        lambda0: 'What is the longest wavelength of light that can eject electrons from a metal with a work function of {phi}?',
        phi: 'A metal emits electrons only for wavelengths shorter than {lambda0}. What is its work function?'
      }
    }
  ],
  examples: [
    {
      title: 'Sodium in violet light',
      q: 'Light of wavelength 400 nm falls on sodium ($\\phi = 2.28$ eV). Find the maximum kinetic energy of the photoelectrons, their maximum speed and the stopping voltage.',
      steps: [
        'Photon energy: $hf = 1240/400 = 3.10\\ \\mathrm{eV}$.',
        '$K_{\\max} = 3.10 - 2.28 = 0.82\\ \\mathrm{eV} = 1.31\\times10^{-19}\\ \\mathrm{J}$.',
        'Speed: $v = \\sqrt{2K/m_e} = \\sqrt{2(1.31\\times10^{-19})/9.11\\times10^{-31}} = 5.4\\times10^5\\ \\mathrm{m/s}$.',
        'Stopping voltage: $V_s = K_{\\max}/e = 0.82\\ \\mathrm{V}$.'
      ],
      a: '0.82 eV, 5.4 × 10⁵ m/s, stopping voltage 0.82 V.'
    },
    {
      title: 'Planck\'s constant from two measurements',
      q: 'With light of 300 nm a photocell needs a stopping voltage of 1.83 V; with 450 nm it needs 0.45 V. Find $h$ and the work function.',
      steps: [
        'Frequencies: $f_1 = c/300\\ \\mathrm{nm} = 9.99\\times10^{14}\\ \\mathrm{Hz}$ and $f_2 = c/450\\ \\mathrm{nm} = 6.66\\times10^{14}\\ \\mathrm{Hz}$.',
        'Subtract the two equations $eV_s = hf - \\phi$: $\\;e(V_1 - V_2) = h(f_1 - f_2)$.',
        '$h = \\dfrac{(1.602\\times10^{-19})(1.38)}{3.33\\times10^{14}} = 6.64\\times10^{-34}\\ \\mathrm{J\\,s}$.',
        'Then $\\phi = hf_1 - eV_1 = 4.13\\ \\mathrm{eV} - 1.83\\ \\mathrm{eV} = 2.30\\ \\mathrm{eV}$, close to sodium or potassium.'
      ],
      a: 'h ≈ 6.6 × 10⁻³⁴ J s and φ ≈ 2.3 eV.'
    }
  ],
  quiz: [
    { q: 'Red light ejects no electrons from a metal. You make it 100 times brighter. Now…', choices: ['electrons come out, slowly', 'electrons come out, fast', 'still no electrons come out', 'electrons come out after a delay'], a: 2,
      why: 'Each red photon still has too little energy to free an electron, and electrons do not accumulate energy from several photons.' },
    { q: 'Above threshold, doubling the intensity of the light (same frequency) doubles…', choices: ['the maximum kinetic energy', 'the stopping voltage', 'the photocurrent', 'the work function'], a: 2,
      why: 'Twice the photons per second release twice the electrons per second. Their energies, and so the stopping voltage, stay the same.' },
    { q: 'Graphs of stopping voltage against frequency for different metals are…', choices: ['parallel straight lines of slope h/e, shifted by the work functions', 'lines through the origin with different slopes', 'curves that level off at high frequency', 'the same line for every metal'], a: 0,
      why: '$V_s = (h/e)f - \\phi/e$. The slope is a universal constant; only the intercept depends on the metal.' },
    { q: 'Light of 250 nm (4.96 eV per photon) falls on copper ($\\phi = 4.7$ eV). The stopping voltage is about…', choices: ['0.26 V', '4.7 V', '4.96 V', '9.7 V'], a: 0,
      why: '$K_{\\max} = 4.96 - 4.7 = 0.26$ eV, so 0.26 V stops the fastest electrons.' },
    { q: 'The photoelectric effect shows that light is a particle and not a wave.', a: false,
      why: 'It shows that light is absorbed in quanta. Interference and diffraction still require waves; light shows both behaviours.' }
  ],
  applications: [
    'Photomultiplier tubes, which detect single photons in particle detectors and medical scanners.',
    'Image intensifiers in night-vision equipment.',
    'Photoelectron spectroscopy (XPS and ARPES), which measures the energies of electrons in solids and molecules.',
    'Solar cells and camera sensors use the internal photoelectric effect: a photon lifts an electron across a band gap instead of out of the material.'
  ],
  history: 'Hertz noticed in 1887 that ultraviolet light made sparks jump more easily; Hallwachs, J. J. Thomson and Lenard showed that the light releases electrons. Einstein\'s explanation (1905) was confirmed by Millikan in 1916 and earned Einstein the 1921 Nobel Prize — not relativity.',
  sim: 'qm-photoelectric'
},

{
  id: 'compton-scattering', parent: 'quantum-origins', title: 'Compton scattering', level: 2,
  short: 'X-rays bounce off electrons like billiard balls and come away with a longer wavelength — the proof that photons carry momentum.',
  keywords: ['Compton', 'Compton effect', 'Compton shift', 'Compton wavelength', 'X-ray scattering', 'gamma-ray scattering', 'photon momentum', 'recoil electron', 'Compton edge', 'inelastic scattering'],
  prereq: ['photon', 'relativistic-energy', 'conservation-of-momentum'],
  related: ['x-rays', 'photoelectric-effect', 'elastic-collisions', 'radiation-dose'],
  body: `
In 1923 Arthur Compton aimed X-rays of wavelength 71 pm (the Kα line of molybdenum) at a block of graphite and measured the wavelength of the X-rays scattered to the side. Besides the original wavelength he found a second, longer one, and the shift grew with the scattering angle. A classical wave that shakes an electron makes it radiate at the *same* frequency; there is no room for a shift. Photons explain it at once.

### A collision between a photon and an electron
Treat the X-ray as a particle with energy $E = hc/\\lambda$ and momentum $p = h/\\lambda$ ([[photon]]), and the outer electrons of carbon as free and at rest. The photon hits an electron, which recoils; the photon flies off at angle $\\theta$ with less energy, and so a longer wavelength. Conserving energy and momentum — relativistically, because the electron can recoil fast — gives

$$\\lambda' - \\lambda = \\frac{h}{m_e c}\\,(1 - \\cos\\theta)$$

The combination $\\lambda_C = h/m_e c = 2.426\\ \\mathrm{pm}$ is the **Compton wavelength** of the electron. The shift

- is zero straight ahead, $\\lambda_C$ at 90°, and largest, $2\\lambda_C = 4.85\\ \\mathrm{pm}$, for photons bounced straight back;
- does **not** depend on the incoming wavelength or on the material.

For Compton's 71 pm X-rays the 2.4 pm shift at 90° is 3.4 %, easy to measure. For visible light at 500 nm it would be five parts in a million, which is why the effect had to wait for X-rays.

### The unshifted line
Some photons scatter from inner electrons that are tightly bound. Then the whole atom takes the recoil, and a carbon atom is 22 000 times heavier than an electron, so its "Compton wavelength" is 22 000 times smaller: no visible shift. The two lines together are the signature of photons colliding with individual particles.

### In terms of energy
For gamma rays it is more natural to follow energies. A photon of energy $E_0$ scattered through $\\theta$ keeps

$$E = \\frac{E_0}{1 + \\dfrac{E_0}{m_e c^2}(1 - \\cos\\theta)}, \\qquad m_e c^2 = 511\\ \\mathrm{keV},$$

and the electron takes the difference. A 662 keV gamma ray from caesium-137 bounced straight back keeps only 184 keV, so the recoiling electrons get at most 478 keV. That maximum, the **Compton edge**, is a landmark in every gamma-ray spectrum. At energies well below 511 keV the photon loses little; at energies far above it, a back-scattered photon keeps just under 256 keV ($m_ec^2/2$), whatever it started with.

> [!key] Compton scattering showed that a photon carries momentum $h/\\lambda$ as well as energy $hf$: it collides like a particle in the full mechanical sense. Compton shared the 1927 Nobel Prize for it.
`,
  ideas: [
    'X-ray and gamma-ray photons scatter off electrons like colliding particles, conserving energy and momentum.',
    'The scattered photon has a longer wavelength: Δλ = (h/m_e c)(1 − cos θ).',
    'The shift depends only on the angle — up to 4.85 pm for back-scattering — not on the wavelength or the material.',
    'It is noticeable only for short wavelengths, where a few picometres is a sizeable fraction of λ.'
  ],
  pitfalls: [
    'The scattered photon slows down — It still travels at c. It has less energy, so its frequency is lower and its wavelength longer.',
    'The Compton shift is larger for longer wavelengths — The shift in picometres is the same for every wavelength; only the fractional shift Δλ/λ grows as the wavelength shrinks.'
  ],
  formulas: [
    {
      name: 'Compton shift',
      expr: 'dlam = lambdaC*(1 - cos(theta))', tex: '\\Delta\\lambda = \\lambda_C\\,(1 - \\cos\\theta)',
      vars: {
        dlam: { name: 'increase in wavelength', q: 'length', unit: 'pm', tex: '\\Delta\\lambda' },
        lambdaC: { const: 'lambdaC' },
        theta: { name: 'scattering angle', q: 'angle', unit: '°', value: 90, min: 0, max: 180 }
      },
      stories: {
        dlam: 'X-rays are scattered by free electrons through {theta}. By how much does their wavelength increase?',
        theta: 'Scattered X-rays are found to be {dlam} longer in wavelength. Through what angle were they scattered?'
      }
    },
    {
      name: 'Energy of the scattered photon',
      expr: 'E = E0/(1 + E0/(me*c^2)*(1 - cos(theta)))', tex: 'E = \\frac{E_0}{1 + \\dfrac{E_0}{m_e c^2}(1 - \\cos\\theta)}',
      vars: {
        E: { name: 'energy of the scattered photon', q: 'energy', unit: 'keV' },
        E0: { name: 'energy of the incoming photon', q: 'energy', unit: 'keV', value: 662 },
        me: { const: 'me' }, c: { const: 'c' },
        theta: { name: 'scattering angle', q: 'angle', unit: '°', value: 120, min: 0, max: 180 }
      },
      note: 'The recoiling electron takes the difference $E_0 - E$ as kinetic energy.',
      stories: {
        E: 'A {E0} gamma ray from caesium-137 is scattered through {theta} by an electron. What energy does the scattered photon keep?',
        E0: 'After scattering through {theta}, a gamma ray has {E}. What was its energy before?'
      }
    }
  ],
  derivation: {
    title: 'Derive the Compton formula',
    intro: 'Before: a photon with momentum $p = h/\\lambda$ along $x$ and an electron at rest with energy $m_ec^2$. After: a photon with momentum $p\' = h/\\lambda\'$ at angle $\\theta$, and an electron with momentum $\\vec p_e$ and energy $\\sqrt{p_e^2c^2 + m_e^2c^4}$.',
    steps: [
      { text: 'Momentum is conserved, $\\vec p_e = \\vec p - \\vec p\\,\'$. Square it (the [[math:law-of-cosines|law of cosines]]):', tex: 'p_e^2 = p^2 + p\'^2 - 2pp\'\\cos\\theta' },
      { text: 'Energy is conserved; a photon\'s energy is $pc$:', tex: 'pc + m_ec^2 = p\'c + \\sqrt{p_e^2c^2 + m_e^2c^4}' },
      { text: 'Move $p\'c$ to the left, square, and cancel $m_e^2c^4$:', tex: '(p - p\')^2 c^2 + 2(p - p\')\\,m_ec^3 = p_e^2 c^2' },
      { text: 'Divide by $c^2$ and substitute $p_e^2$ from the momentum equation. The $p^2$ and $p\'^2$ terms cancel:', tex: '(p - p\')\\,m_e c = pp\'\\,(1 - \\cos\\theta)' },
      { text: 'Divide by $pp\'m_ec$ and use $1/p = \\lambda/h$:', tex: '\\frac{1}{p\'} - \\frac{1}{p} = \\frac{1 - \\cos\\theta}{m_e c} \\;\\Rightarrow\\; \\lambda\' - \\lambda = \\frac{h}{m_e c}(1 - \\cos\\theta)' }
    ]
  },
  examples: [
    {
      title: 'Compton\'s own measurement',
      q: 'Molybdenum Kα X-rays (71.1 pm) are scattered through 90°. Find the scattered wavelength, the energies of the two photons and the kinetic energy of the recoiling electron.',
      steps: [
        'At 90°, $1 - \\cos\\theta = 1$, so $\\Delta\\lambda = \\lambda_C = 2.43\\ \\mathrm{pm}$ and $\\lambda\' = 73.5\\ \\mathrm{pm}$.',
        'Energies: $E = hc/\\lambda = 1240\\ \\mathrm{eV\\,nm}/0.0711\\ \\mathrm{nm} = 17.44\\ \\mathrm{keV}$; $E\' = 1240/0.0735\\ \\mathrm{eV} = 16.86\\ \\mathrm{keV}$.',
        'The electron gets the difference: $K = 17.44 - 16.86 = 0.58\\ \\mathrm{keV}$ — much more than the few eV binding the outer electrons of carbon, which is why they can be treated as free.'
      ],
      a: '73.5 pm; 17.44 keV in, 16.86 keV out; the electron recoils with about 0.58 keV.'
    },
    {
      title: 'The Compton edge',
      q: 'A detector absorbs electrons knocked by 662 keV gamma rays. What is the largest energy such an electron can receive?',
      steps: [
        'The electron gets most when the photon is scattered straight back, $\\theta = 180°$, $1 - \\cos\\theta = 2$.',
        '$E = \\dfrac{662}{1 + (662/511)(2)} = \\dfrac{662}{3.59} = 184\\ \\mathrm{keV}$.',
        'Electron energy: $662 - 184 = 478\\ \\mathrm{keV}$. Gamma spectra show a sharp edge at this energy.'
      ],
      a: 'About 478 keV (the photon keeps 184 keV).'
    }
  ],
  quiz: [
    { q: 'X-rays scattered through 90° by free electrons have their wavelength increased by…', choices: ['2.43 pm, whatever their wavelength', '2.43 % of their wavelength', 'an amount that depends on the scattering material', 'nothing — only the direction changes'], a: 0,
      why: '$\\Delta\\lambda = \\lambda_C(1 - \\cos 90°) = \\lambda_C = 2.43$ pm, independent of the wavelength and of the target.' },
    { q: 'Why is the Compton effect not noticed with visible light?', choices: ['Visible photons have no momentum', 'The 2.4 pm shift is a negligible fraction of a 500 nm wavelength', 'Visible light does not scatter from electrons', 'The effect only happens in graphite'], a: 1,
      why: 'The absolute shift is the same, but relative to 500 nm it is only $5\\times10^{-6}$.' },
    { q: 'At which angle does the recoiling electron receive the most energy?', choices: ['0°', '45°', '90°', '180°'], a: 3,
      why: 'Back-scattering gives the largest wavelength shift, so the photon loses the most energy and the electron gains the most.' },
    { q: 'The scattered X-ray photon travels more slowly than the incoming one.', a: false,
      why: 'Every photon travels at $c$. It has less energy, which means a lower frequency and a longer wavelength.' }
  ],
  applications: [
    'Compton scattering is the main way gamma rays of 0.1–10 MeV interact with tissue, which matters for radiotherapy and radiation shielding.',
    'Compton cameras locate gamma-ray sources in astronomy and in nuclear safety work.',
    'Back-scatter X-ray scanners image objects from one side only.'
  ],
  history: 'Compton published his measurements and the photon explanation in 1923 (Peter Debye reached the same theory independently). It convinced most physicists that light quanta were real, eighteen years after Einstein proposed them.',
  sim: 'qm-compton'
},

{
  id: 'de-broglie-wavelength', parent: 'quantum-origins', title: 'Matter waves (de Broglie)', level: 2,
  short: 'Every moving particle has a wavelength λ = h/p. For electrons it is the size of atoms, which is why electrons diffract and electron microscopes see so much.',
  keywords: ['de Broglie', 'matter waves', 'de Broglie wavelength', 'electron diffraction', 'Davisson–Germer', 'electron microscope', 'neutron diffraction', 'λ = h/p', 'wave nature of matter'],
  prereq: ['photon', 'momentum', 'kinetic-energy'],
  related: ['wave-particle-duality', 'bohr-model', 'particle-in-a-box', 'diffraction-grating', 'crystal-structure'],
  body: `
In his doctoral thesis of 1924 Louis de Broglie turned the photon idea round. If light waves behave like particles with momentum $p = h/\\lambda$, perhaps particles behave like waves, with a wavelength

$$\\lambda = \\frac{h}{p} = \\frac{h}{mv}$$

### Why we never notice
Planck's constant is tiny, so the wavelength is tiny unless the momentum is too. A 145 g baseball at 40 m/s has $\\lambda = 1.1 \\times 10^{-34}\\ \\mathrm{m}$, some $10^{19}$ times smaller than a proton. No slit or crystal could ever diffract it. An electron is $10^{29}$ times lighter, and its wavelength lands at the scale of atoms.

### Electrons through a voltage
An electron accelerated from rest through a voltage $V$ gains kinetic energy $eV$, so $p = \\sqrt{2m_e eV}$ and

$$\\lambda = \\frac{h}{\\sqrt{2 m_e e V}} \\approx \\frac{1.226\\ \\mathrm{nm}}{\\sqrt{V\\,/\\,1\\ \\mathrm{V}}}$$

At 100 V this is 0.123 nm, about the spacing of atoms in a crystal, so a crystal should act as a [[diffraction-grating|diffraction grating]] for electrons. In 1927 Clinton Davisson and Lester Germer, firing 54 eV electrons at a nickel crystal, found a strong beam scattered at 50° — exactly where waves of 0.167 nm reflected by the rows of nickel atoms reinforce. George Paget Thomson saw diffraction rings from electrons passing through thin metal films. (His father, J. J. Thomson, had won a Nobel Prize for showing that the electron is a particle; the son shared one for showing that it is a wave.)

### Uses
- **Electron microscopes** accelerate electrons through 100–300 kV, giving wavelengths of a few picometres, and resolve single atoms; a light microscope is limited by $\\lambda \\approx 500\\ \\mathrm{nm}$ to details of about 200 nm. At these voltages the electrons are relativistic and the formula above needs a correction.
- **Neutron diffraction** uses slow neutrons from a reactor, with wavelengths around 0.1–0.2 nm, to find where hydrogen atoms and magnetic moments sit in a solid.
- Atoms and molecules interfere too: helium atoms, sodium atoms, and in 1999 the football-shaped molecule C₆₀, made of 60 carbon atoms.

### Standing matter waves
If an electron is a wave, a bound electron must be a *standing* wave. Fitting a whole number of wavelengths round a circular orbit, $2\\pi r = n\\lambda$, gives exactly Bohr's rule for the orbits of hydrogen ([[bohr-model]]); fitting half-wavelengths into a box gives the energy levels of a [[particle-in-a-box]]. Quantization is what waves do when they are confined, like the harmonics of a guitar string ([[standing-waves]]).

> [!note] What is waving? Not the electron's mass or charge, smeared out: every detection finds a whole electron at one place. The intensity of the wave gives the *probability* of finding it there ([[wavefunction]]).
`,
  ideas: [
    'Every particle with momentum p has a wavelength λ = h/p.',
    'Everyday objects have absurdly small wavelengths; electrons, neutrons and atoms have wavelengths comparable to atomic spacings.',
    'An electron accelerated through V volts has λ ≈ 1.226 nm / √V.',
    'Electron and neutron diffraction from crystals confirm matter waves and are used to study materials.',
    'Confining a matter wave makes it a standing wave, which is the origin of quantized energy levels.'
  ],
  pitfalls: [
    'Only very small particles have a wavelength — Everything does; for large objects it is just far too small to reveal itself. Molecules of hundreds of atoms have been made to interfere.',
    'A faster particle has a longer wavelength — Larger momentum means a shorter wavelength: λ = h/p.',
    'The electron itself is spread out like a wave — The wave describes where it is likely to be found; each detection finds a complete electron at one spot.'
  ],
  formulas: [
    {
      name: 'de Broglie wavelength',
      expr: 'lambda = h/(m*v)', tex: '\\lambda = \\frac{h}{mv}',
      vars: {
        lambda: { name: 'wavelength', q: 'length', unit: 'nm' },
        h: { const: 'h' },
        m: { name: 'mass of the particle', q: 'mass', unit: 'u', value: 1.009 },
        v: { name: 'speed', q: 'speed', unit: 'm/s', value: 2200 }
      },
      note: 'The default is a thermal neutron from a reactor. For speeds near $c$ use the relativistic momentum instead of $mv$.',
      stories: {
        lambda: 'A particle of mass {m} moves at {v}. What is its de Broglie wavelength?',
        v: 'How fast must a particle of mass {m} move to have a wavelength of {lambda}?'
      }
    },
    {
      name: 'Wavelength from the kinetic energy',
      expr: 'lambda = h/sqrt(2*m*K)', tex: '\\lambda = \\frac{h}{\\sqrt{2mK}}',
      vars: {
        lambda: { name: 'wavelength', q: 'length', unit: 'nm' },
        h: { const: 'h' },
        m: { name: 'mass of the particle', q: 'mass', unit: 'u', value: 4.0026 },
        K: { name: 'kinetic energy', q: 'energy', unit: 'eV', value: 0.025 }
      },
      note: 'Non-relativistic: valid when $K$ is much less than $mc^2$. The default is a helium atom at roughly room-temperature energy.',
      stories: {
        lambda: 'A particle of mass {m} has a kinetic energy of {K}. What is its de Broglie wavelength?',
        K: 'What kinetic energy gives a particle of mass {m} a wavelength of {lambda}?'
      }
    },
    {
      name: 'Electron accelerated through a voltage',
      expr: 'lambda = h/sqrt(2*me*qe*V)', tex: '\\lambda = \\frac{h}{\\sqrt{2 m_e e V}}',
      vars: {
        lambda: { name: 'wavelength of the electrons', q: 'length', unit: 'nm' },
        h: { const: 'h' }, me: { const: 'me' }, qe: { const: 'qe' },
        V: { name: 'accelerating voltage', q: 'voltage', unit: 'V', value: 100 }
      },
      note: 'Starts from rest; non-relativistic, so good below about 10 kV.',
      stories: {
        lambda: 'Electrons are accelerated from rest through {V}. What is their de Broglie wavelength?',
        V: 'What accelerating voltage gives electrons a wavelength of {lambda}?'
      }
    }
  ],
  examples: [
    {
      title: 'An electron and a baseball',
      q: 'Compare the de Broglie wavelength of an electron accelerated through 100 V with that of a 145 g baseball at 40 m/s.',
      steps: [
        'Electron: $v = \\sqrt{2eV/m_e} = \\sqrt{2(1.602\\times10^{-19})(100)/9.11\\times10^{-31}} = 5.93\\times10^6\\ \\mathrm{m/s}$.',
        '$p = m_e v = 5.40\\times10^{-24}\\ \\mathrm{kg\\,m/s}$, so $\\lambda = h/p = 6.63\\times10^{-34}/5.40\\times10^{-24} = 1.23\\times10^{-10}\\ \\mathrm{m} = 0.123\\ \\mathrm{nm}$.',
        'Baseball: $\\lambda = h/mv = 6.63\\times10^{-34}/(0.145 \\times 40) = 1.1\\times10^{-34}\\ \\mathrm{m}$.',
        'The electron\'s wavelength matches the spacing of atoms; the baseball\'s is $10^{24}$ times smaller than that.'
      ],
      a: 'Electron 0.123 nm; baseball 1.1 × 10⁻³⁴ m.'
    },
    {
      title: 'Neutrons or electrons for a crystal?',
      q: 'To study a crystal you want a wavelength of 0.10 nm. What kinetic energy do neutrons need? And electrons?',
      steps: [
        'From $\\lambda = h/\\sqrt{2mK}$: $\\;K = \\dfrac{h^2}{2m\\lambda^2}$.',
        'Neutrons: $K = \\dfrac{(6.63\\times10^{-34})^2}{2(1.675\\times10^{-27})(1.0\\times10^{-10})^2} = 1.3\\times10^{-20}\\ \\mathrm{J} = 0.082\\ \\mathrm{eV}$ — about the thermal energy of a warm gas.',
        'Electrons, 1836 times lighter, need 1836 times more: about 150 eV.',
        'Slow neutrons penetrate deep into the material; 150 eV electrons probe only the top few atomic layers.'
      ],
      a: 'Neutrons about 0.08 eV, electrons about 150 eV.'
    }
  ],
  quiz: [
    { q: 'An electron and a proton move at the same speed. Which has the longer de Broglie wavelength?', choices: ['the electron', 'the proton', 'they are equal', 'neither has one'], a: 0,
      why: '$\\lambda = h/mv$. The electron is 1836 times lighter, so its wavelength is 1836 times longer.' },
    { q: 'An electron and a proton have the same kinetic energy. The ratio $\\lambda_e/\\lambda_p$ is about…', choices: ['1', '43', '1836', '1/43'], a: 1,
      why: '$\\lambda = h/\\sqrt{2mK}$, so the ratio is $\\sqrt{m_p/m_e} = \\sqrt{1836} \\approx 43$.' },
    { q: 'The accelerating voltage of an electron beam is quadrupled. Its wavelength…', choices: ['quadruples', 'doubles', 'halves', 'is quartered'], a: 2,
      why: '$\\lambda \\propto 1/\\sqrt V$; four times the voltage halves the wavelength.' },
    { q: 'People do not diffract through doorways because they have no wavelength.', a: false,
      why: 'They do have one, about $10^{-35}$ m at walking speed. It is so much smaller than a doorway that diffraction is utterly undetectable.' },
    { q: 'Why can an electron microscope show finer detail than a light microscope?', choices: ['Electrons are smaller than photons', 'Fast electrons have wavelengths thousands of times shorter than visible light', 'Electrons are charged', 'Electrons travel faster than light inside the lenses'], a: 1,
      why: 'Resolution is limited by wavelength. 100 kV electrons have $\\lambda \\approx 4$ pm, against about 500 nm for visible light.' }
  ],
  applications: [
    'Transmission and scanning electron microscopes, down to atomic resolution.',
    'Electron diffraction of surfaces (LEED) and neutron diffraction of bulk materials.',
    'Atom interferometers, used as ultra-precise gravimeters and accelerometers.'
  ],
  history: 'De Broglie proposed matter waves in 1924 and received the Nobel Prize in 1929. Davisson and G. P. Thomson shared the 1937 prize for electron diffraction.',
  sim: 'qm-double-slit'
},

{
  id: 'wave-particle-duality', parent: 'quantum-origins', title: 'Wave–particle duality', level: 2,
  short: 'Light and matter both travel like waves and arrive like particles. The double-slit experiment done one particle at a time shows both at once.',
  keywords: ['wave-particle duality', 'double slit', 'single electron', 'single photon', 'interference', 'complementarity', 'which-path', 'Born rule', 'probability', 'quantum interference'],
  prereq: ['double-slit', 'photon', 'de-broglie-wavelength'],
  related: ['uncertainty-principle', 'wavefunction', 'photoelectric-effect'],
  body: `
By the mid-1920s both light and electrons had shown a split personality. Light makes interference fringes, as waves do, but is absorbed in whole photons. Electrons leave single sharp dots on a screen, as particles do, but diffract from crystals. The cleanest way to see both at once is [[double-slit|Young's double-slit experiment]] with particles sent **one at a time**.

### One at a time
Send electrons towards two narrow slits so sparsely that only one is in the apparatus at any moment. Each electron arrives at a single point on the detector: a particle. At first the dots look random. After thousands of them a pattern emerges — bright and dark **interference fringes**, spaced exactly as for a wave of the [[de-broglie-wavelength|de Broglie wavelength]] passing through both slits:

$$\\Delta y = \\frac{\\lambda L}{d}, \\qquad \\lambda = \\frac{h}{p}$$

The same happens with single photons, neutrons, atoms and large molecules. No electron interferes with another one, since they come one at a time: **each electron interferes with itself**. The dark fringes are places where almost no electron ever lands — yet with one slit closed, electrons do land there. Opening a second way through *reduces* the chance of arriving at those points, which is impossible for particles that simply go through one slit or the other.

### Looking changes the result
Try to find out which slit each electron goes through — by scattering light off it near the slits, say — and the fringes vanish, leaving the sum of two single-slit patterns. Any interaction that could, even in principle, record the path destroys the interference. Niels Bohr called this **complementarity**: the wave and particle pictures are both needed, but an experiment can show only one of them at a time. The trade-off is quantitative, and it is the [[uncertainty-principle|uncertainty principle]] that keeps the books: locating the electron well enough to tell the slits apart kicks it hard enough to wash out the fringes.

### How to think about it
Neither "it is really a wave" nor "it is really a particle" works. A quantum object is described by a [[wavefunction]] that spreads out, passes through both slits and interferes, like a wave. When it is detected, it is found at one place, like a particle, with a probability proportional to the intensity of the wave, $|\\psi|^2$ — **Born's rule**. What interferes is not a physical substance but *probability amplitude*, and the interference decides where particles are likely to turn up.

> [!tip] In the simulation, fire electrons one at a time and watch fringes emerge from random dots. Then switch on the which-path detector, and try closing one slit.
`,
  ideas: [
    'Photons and electrons are detected as particles, one localized click at a time.',
    'The pattern built up by many single particles is an interference pattern: something wave-like went through both slits.',
    'Each particle interferes with itself; the wave gives the probability of detection at each point (Born\'s rule).',
    'Gaining which-path information destroys the interference (complementarity).'
  ],
  pitfalls: [
    'The fringes come from electrons interfering with each other — They appear even when electrons pass one at a time, hours apart.',
    'Each electron splits in two and half goes through each slit — Every detection finds a whole electron. What passes both slits is the probability wave, not pieces of the electron.',
    'A cleverer detector could reveal the path and keep the fringes — Any record of the path, however gentle the method, removes the interference.'
  ],
  formulas: [
    {
      name: 'Fringe spacing for electrons',
      expr: 'dy = h*L/(me*v*d)', tex: '\\Delta y = \\frac{hL}{m_e v d}',
      vars: {
        dy: { name: 'spacing of the bright fringes', q: 'length', unit: 'µm', tex: '\\Delta y' },
        h: { const: 'h' }, me: { const: 'me' },
        L: { name: 'distance from slits to screen', q: 'length', unit: 'm', value: 1 },
        v: { name: 'speed of the electrons', q: 'speed', unit: 'm/s', value: 1e7 },
        d: { name: 'separation of the slits', q: 'length', unit: 'µm', value: 1 }
      },
      note: 'Young\'s $\\Delta y = \\lambda L/d$ with the de Broglie wavelength $h/m_e v$; small angles. Change the constant $m_e$ to use neutrons or atoms.',
      stories: {
        dy: 'Electrons moving at {v} pass through two slits {d} apart. How far apart are the bright fringes on a screen {L} away?',
        v: 'Electron fringes are {dy} apart on a screen {L} beyond two slits {d} apart. How fast are the electrons?'
      }
    }
  ],
  examples: [
    {
      title: 'Interference of a molecule',
      q: 'C₆₀ molecules (mass 720 u) moving at 220 m/s pass through a grating with slits 100 nm apart. What is their wavelength, and how far from the central peak is the first-order peak on a detector 1.25 m away?',
      steps: [
        'Mass: $m = 720 \\times 1.66\\times10^{-27} = 1.20\\times10^{-24}\\ \\mathrm{kg}$.',
        '$\\lambda = \\dfrac{h}{mv} = \\dfrac{6.63\\times10^{-34}}{(1.20\\times10^{-24})(220)} = 2.5\\times10^{-12}\\ \\mathrm{m}$ — 400 times smaller than the molecule itself.',
        'First order: $\\theta \\approx \\lambda/d = 2.5\\times10^{-12}/1.0\\times10^{-7} = 2.5\\times10^{-5}\\ \\mathrm{rad}$.',
        'On the detector: $1.25\\ \\mathrm{m} \\times 2.5\\times10^{-5} = 31\\ \\mathrm{µm}$. Tiny, but resolvable — an experiment of this kind was done in Vienna in 1999.'
      ],
      a: 'λ ≈ 2.5 pm; the first-order peak is about 31 µm from the centre.'
    }
  ],
  quiz: [
    { q: 'In the single-electron double-slit experiment, each electron…', choices: ['splits in two, half through each slit', 'arrives at one point, but many arrivals together form an interference pattern', 'arrives as a faint copy of the whole fringe pattern', 'interferes with electrons that passed earlier'], a: 1,
      why: 'Detections are single points; the fringes are a statistical pattern that emerges only after many electrons.' },
    { q: 'A detector records which slit each electron passes through. The pattern on the screen becomes…', choices: ['brighter fringes', 'the same fringes', 'no fringes: the sum of two single-slit patterns', 'completely dark'], a: 2,
      why: 'Which-path information destroys the interference. Electrons still arrive, spread out as through each slit separately.' },
    { q: 'Opening the second slit can make some points on the screen receive fewer electrons than with one slit open.', a: true,
      why: 'At a dark fringe the amplitudes from the two slits cancel. Particles taking one path or the other could only add up.' },
    { q: 'The electrons are sped up so that their momentum doubles. The fringe spacing…', choices: ['doubles', 'halves', 'stays the same', 'quadruples'], a: 1,
      why: '$\\lambda = h/p$ halves, and the spacing $\\lambda L/d$ with it.' }
  ],
  applications: [
    'Electron holography and electron biprism interferometry, which image electric and magnetic fields inside materials.',
    'Single-photon sources and detectors for quantum cryptography.',
    'Matter-wave interferometers that test quantum mechanics with ever larger molecules.'
  ],
  history: 'G. I. Taylor photographed diffraction fringes in 1909 with light so faint that exposures lasted months. Claus Jönsson made the first electron double-slit experiment in 1961; single-electron build-up was shown by Merli, Missiroli and Pozzi in 1974 and filmed by Akira Tonomura\'s group in 1989.',
  sim: 'qm-double-slit'
},

{
  id: 'uncertainty-principle', parent: 'quantum-origins', title: 'The uncertainty principle', level: 2,
  short: 'A particle cannot have both a sharp position and a sharp momentum: Δx Δp ≥ ħ/2. It is a property of waves, not a flaw in our instruments.',
  keywords: ['uncertainty principle', 'Heisenberg', 'indeterminacy', 'position–momentum', 'energy–time', 'zero-point energy', 'wave packet', 'natural linewidth', 'hbar', 'ħ'],
  prereq: ['wave-particle-duality', 'de-broglie-wavelength', 'math:standard-deviation'],
  related: ['wavefunction', 'particle-in-a-box', 'quantum-harmonic-oscillator', 'math:fourier-series'],
  body: `
A wave with one exact wavelength runs on forever: it has a definite momentum, $p = h/\\lambda$, but it is spread over all of space. To make a particle that is *somewhere*, you must add up waves of many wavelengths so that they reinforce in one region and cancel everywhere else — a **wave packet**. The narrower the packet, the wider the range of wavelengths it needs, and so the wider its spread of momenta. That is a mathematical fact about waves (it is [[math:fourier-series|Fourier analysis]]); because matter is described by waves, it becomes a law of physics. Werner Heisenberg stated it in 1927:

$$\\Delta x\\, \\Delta p \\ge \\frac{\\hbar}{2}, \\qquad \\hbar = \\frac{h}{2\\pi} = 1.055 \\times 10^{-34}\\ \\mathrm{J\\,s}$$

Here $\\Delta x$ and $\\Delta p$ are [[math:standard-deviation|standard deviations]]: the spreads of the results if you measured the position, or the momentum, of many identically prepared particles. A Gaussian packet reaches the minimum exactly.

### Not clumsiness
A popular explanation says that looking at an electron with light knocks it about, so we disturb what we measure. That is true, but the principle goes deeper: *there is no state* of a particle in which position and momentum are both sharp. The spread is in the particle, not in the apparatus.

### How big is it?
- A 1 µg dust grain located to within 1 µm: $\\Delta v \\ge \\hbar/(2m\\,\\Delta x) = 5 \\times 10^{-20}\\ \\mathrm{m/s}$. Utterly negligible.
- An electron confined to an atom, $\\Delta x \\approx 0.1\\ \\mathrm{nm}$: $\\Delta p \\ge 5.3 \\times 10^{-25}\\ \\mathrm{kg\\,m/s}$, a speed spread of about 600 km/s and a kinetic energy of order $(\\Delta p)^2/2m_e \\approx 1\\ \\mathrm{eV}$ — the scale of atomic energies.
- An electron confined to a nucleus, $\\Delta x \\approx 10^{-14}\\ \\mathrm{m}$, would need a momentum of about 10 MeV/c, far more energy than the nucleus could hold it with. This was one of the arguments that nuclei do not contain electrons.

### Why atoms do not collapse
Pulling the electron closer to the nucleus lowers its electric potential energy but raises its kinetic energy, because $\\Delta p \\sim \\hbar/\\Delta x$ grows. The best compromise sits near $0.05$ nm, the size of the hydrogen atom ([[bohr-model]]). The same trade-off gives every confined particle a **zero-point energy**: it can never be completely at rest at the bottom of its well ([[particle-in-a-box]], [[quantum-harmonic-oscillator]]).

### Energy and time
A similar relation connects the spread in the energy of a state with how long it lasts:

$$\\Delta E\\, \\Delta t \\gtrsim \\frac{\\hbar}{2}$$

An excited atom that decays in about 10 ns cannot have a perfectly sharp energy, so its spectral line has a natural width. Particles that live only a few times $10^{-24}$ s have energy spreads of around 100 MeV, and their lifetimes are measured that way.

> [!tip] In the simulation, squeeze the wave packet and watch its momentum distribution widen. Then let it move: a narrow packet also spreads out faster.
`,
  ideas: [
    'Position and momentum spreads obey Δx Δp ≥ ħ/2; a Gaussian wave packet reaches the minimum.',
    'It follows from the wave nature of matter: a short packet needs a wide range of wavelengths.',
    'It describes the particle\'s state, not the imperfection of measuring instruments.',
    'Confinement costs kinetic energy — the zero-point energy — which sets the size of atoms.',
    'Short-lived states have spread-out energies: ΔE Δt ≳ ħ/2.'
  ],
  pitfalls: [
    'The principle only says our measurements disturb the particle — It says no state has both a sharp position and a sharp momentum, whatever we do or do not measure.',
    'You cannot know the position of an electron precisely — You can, at the cost of a large momentum spread. It is the product that is limited, not either quantity alone.',
    'It matters for everyday objects too — ħ is so small that for anything visible the required spreads are far below any possible measurement.'
  ],
  formulas: [
    {
      name: 'Smallest possible momentum spread',
      expr: 'dp = hbar/(2*dx)', tex: '\\Delta p = \\frac{\\hbar}{2\\,\\Delta x}',
      vars: {
        dp: { name: 'minimum momentum spread', q: 'momentum', unit: 'kg·m/s', tex: '\\Delta p' },
        hbar: { const: 'hbar' },
        dx: { name: 'position spread', q: 'length', unit: 'nm', value: 0.1, tex: '\\Delta x' }
      },
      stories: {
        dp: 'An electron is confined to a region of size about {dx}. What is the smallest possible spread in its momentum?',
        dx: 'A particle\'s momentum is known to within {dp}. What is the smallest possible spread in its position?'
      }
    },
    {
      name: 'Smallest possible velocity spread',
      expr: 'dv = hbar/(2*m*dx)', tex: '\\Delta v = \\frac{\\hbar}{2m\\,\\Delta x}',
      vars: {
        dv: { name: 'minimum velocity spread', q: 'speed', unit: 'm/s', tex: '\\Delta v' },
        hbar: { const: 'hbar' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 9.11e-31 },
        dx: { name: 'position spread', q: 'length', unit: 'nm', value: 0.1, tex: '\\Delta x' }
      },
      note: 'The default mass is an electron; try 1 µg ($10^{-9}$ kg) for a dust grain.',
      stories: {
        dv: 'A particle of mass {m} is known to be within {dx}. What is the smallest possible spread in its velocity?',
        m: 'A particle known to within {dx} has a velocity spread of at least {dv}. What is its mass?'
      }
    },
    {
      name: 'Confinement energy (estimate)',
      expr: 'E = hbar^2/(8*me*dx^2)', tex: 'E \\approx \\frac{\\hbar^2}{8 m_e\\,\\Delta x^2}',
      vars: {
        E: { name: 'kinetic energy forced by confinement', q: 'energy', unit: 'eV' },
        hbar: { const: 'hbar' }, me: { const: 'me' },
        dx: { name: 'position spread', q: 'length', unit: 'nm', value: 0.1, tex: '\\Delta x' }
      },
      note: 'An order-of-magnitude estimate: $(\\Delta p)^2/2m$ with the smallest allowed $\\Delta p$.',
      stories: {
        E: 'Roughly how much kinetic energy must an electron have if it is confined within {dx}?',
        dx: 'An electron has a confinement energy of about {E}. Roughly how large is the region it is confined to?'
      }
    },
    {
      name: 'Energy–time relation',
      expr: 'dE = hbar/(2*dt)', tex: '\\Delta E = \\frac{\\hbar}{2\\,\\Delta t}',
      vars: {
        dE: { name: 'minimum energy spread', q: 'energy', unit: 'eV', tex: '\\Delta E' },
        hbar: { const: 'hbar' },
        dt: { name: 'lifetime of the state', q: 'time', unit: 'ns', value: 10, tex: '\\Delta t' }
      },
      stories: {
        dE: 'An excited state of an atom lives for about {dt}. What is the smallest possible spread in its energy?',
        dt: 'A particle has an energy spread of {dE}. Roughly how long does it live?'
      }
    }
  ],
  examples: [
    {
      title: 'An electron in an atom',
      q: 'An electron is confined to a region about 0.1 nm across. Estimate its minimum momentum spread, speed spread and kinetic energy.',
      steps: [
        '$\\Delta p \\ge \\dfrac{\\hbar}{2\\Delta x} = \\dfrac{1.055\\times10^{-34}}{2 \\times 1\\times10^{-10}} = 5.3\\times10^{-25}\\ \\mathrm{kg\\,m/s}$.',
        '$\\Delta v = \\Delta p/m_e = 5.3\\times10^{-25}/9.11\\times10^{-31} = 5.8\\times10^5\\ \\mathrm{m/s}$.',
        '$E \\approx \\dfrac{(\\Delta p)^2}{2m_e} = \\dfrac{(5.3\\times10^{-25})^2}{2(9.11\\times10^{-31})} = 1.5\\times10^{-19}\\ \\mathrm{J} \\approx 1\\ \\mathrm{eV}$.',
        'Atomic binding energies are indeed a few electronvolts: the uncertainty principle sets the energy scale of chemistry.'
      ],
      a: 'About 5 × 10⁻²⁵ kg m/s, 6 × 10⁵ m/s and 1 eV.'
    },
    {
      title: 'The width of a spectral line',
      q: 'The excited state that emits sodium\'s yellow light lives 16 ns. What spread of photon frequencies does that imply at least?',
      steps: [
        '$\\Delta E \\ge \\dfrac{\\hbar}{2\\Delta t} = \\dfrac{1.055\\times10^{-34}}{2(16\\times10^{-9})} = 3.3\\times10^{-27}\\ \\mathrm{J} = 2.0\\times10^{-8}\\ \\mathrm{eV}$.',
        'In frequency: $\\Delta f = \\Delta E/h = 3.3\\times10^{-27}/6.63\\times10^{-34} = 5\\ \\mathrm{MHz}$.',
        'The measured full width of the line is about 10 MHz, matching $\\Delta E \\approx \\hbar/\\Delta t$: the right order of magnitude, as an uncertainty relation promises. Compared with the 509 THz frequency of the light it is a spread of two parts in a hundred million.'
      ],
      a: 'At least about 5 MHz (the measured natural width is about 10 MHz).'
    }
  ],
  quiz: [
    { q: 'A wave packet is made narrower in space. Its spread of momenta…', choices: ['narrows too', 'widens', 'is unchanged', 'becomes zero'], a: 1,
      why: 'A shorter packet must be built from a wider range of wavelengths, hence a wider range of momenta: $\\Delta p \\ge \\hbar/2\\Delta x$.' },
    { q: 'The uncertainty principle says that…', choices: ['positions can never be measured accurately', 'no state has both a sharp position and a sharp momentum', 'every measurement has an error of at least ħ', 'electrons move randomly'], a: 1,
      why: 'Either quantity alone can be made sharp; their spreads cannot both be small in the same state.' },
    { q: 'Why is the uncertainty principle irrelevant to a rolling marble?', choices: ['marbles are not waves', 'ħ is so small that the required spreads are far below anything measurable', 'marbles move too slowly', 'it only applies to charged particles'], a: 1,
      why: 'For a 5 g marble known to within 1 µm, $\\Delta v \\ge 10^{-26}$ m/s.' },
    { q: 'A particle trapped in a box can never have exactly zero kinetic energy.', a: true,
      why: 'Zero kinetic energy would mean zero momentum spread, which requires an infinite position spread — impossible inside a box.' },
    { q: 'An electron is confined to 1 nm instead of 0.1 nm. Its confinement energy becomes…', choices: ['10 times larger', '10 times smaller', '100 times smaller', '100 times larger'], a: 2,
      why: '$E \\sim (\\Delta p)^2/2m \\propto 1/\\Delta x^2$: ten times wider means a hundred times less energy.' }
  ],
  applications: [
    'The size and stability of atoms, and the energy scale of chemical bonds.',
    'Natural linewidths of lasers and atomic clocks.',
    'Quantum-limited measurement: the laser interferometers of gravitational-wave detectors use "squeezed" light to move uncertainty from one quantity into another.'
  ],
  history: 'Heisenberg published the principle in 1927 with a thought experiment about a gamma-ray microscope. Earle Kennard proved the exact form Δx Δp ≥ ħ/2 the same year, and Howard Robertson generalized it in 1929.',
  sim: 'qm-wavepacket'
}

);
