/* HYPER-PHYSICS · content/stars.js — distances, brightness, colour and temperature,
 * the HR diagram, and how stars live and die. */
Hyper.add(

{
  id: 'stellar-parallax', parent: 'stars', title: 'Parallax and stellar distances', level: 1,
  short: 'As the Earth goes round the Sun, nearby stars shift slightly against distant ones; the size of the shift gives their distance — the basis of the parsec.',
  keywords: ['parallax', 'stellar parallax', 'parsec', 'distance to stars', 'arcsecond', 'Bessel', 'Hipparcos', 'Gaia', 'Proxima Centauri', 'distance ladder', 'astrometry'],
  prereq: ['math:right-triangle-trig', 'math:angle-measure', 'planets'],
  related: ['stellar-magnitude', 'hubbles-law', 'hr-diagram'],
  body: `
Hold a finger at arm's length and look at it with one eye, then with the other. It jumps against the background, because your eyes see it from two places a few centimetres apart; the closer the finger, the bigger the jump. Measure the jump and the separation of your eyes, and [[math:right-triangle-trig|trigonometry]] gives the distance. That is **parallax** — the only direct way to measure the distance to a star.

### The Earth's orbit as a baseline
For stars, the two "eyes" are the Earth's positions six months apart, on opposite sides of its orbit. A nearby star shifts back and forth against far more distant background stars, and over a year it traces a small ellipse. The **parallax angle** $p$ is half the total shift: the angle that the radius of the Earth's orbit, 1 AU, subtends at the star. For such small angles, measured [[math:angle-measure|in radians]],

$$d = \\frac{1\\ \\mathrm{AU}}{p}$$

### The parsec
Astronomers turned this into a unit. A star with a parallax of one arcsecond (1/3600 of a degree) lies at one **parsec** — a "parallax second":

$$1\\ \\mathrm{pc} = \\frac{1\\ \\mathrm{AU}}{1''} = 206\\,265\\ \\mathrm{AU} = 3.086\\times10^{16}\\ \\mathrm{m} = 3.26\\ \\text{light-years}$$

and in general

$$d\\ (\\text{in pc}) = \\frac{1}{p\\ (\\text{in arcseconds})}$$

### How small the angles are
No star has a parallax as large as one arcsecond. The nearest, Proxima Centauri, has $p = 0.768''$, so it is 1.30 pc (4.24 light-years) away. That angle is the width of a coin seen from 5 km. Friedrich Bessel made the first measurement in 1838, finding 0.31″ for the star 61 Cygni; Thomas Henderson and Friedrich Struve followed within months. The ancient Greeks had looked for stellar parallax, found none, and took this as evidence that the Earth does not move — but the stars were simply far more distant than anyone imagined.

The atmosphere blurs star images to about 1″, which limited ground-based parallaxes to a few thousand nearby stars. The **Hipparcos** satellite (1989–93) measured 118 000 stars to about a milliarcsecond; **Gaia** (2013–2025) has measured about 1.5 billion, the brightest to around 20 microarcseconds — the width of a coin on the Moon.

### The first rung of the distance ladder
Parallax works directly out to a few thousand parsecs — a small part of the Milky Way. Beyond that, astronomers use "standard candles": stars and explosions whose true [[stellar-magnitude|luminosity]] is known, so their faintness gives their distance. Every one of them is calibrated, in the end, by parallax, and the distances to galaxies and the expansion rate of the universe ([[hubbles-law|Hubble's law]]) rest on this first rung.
`,
  ideas: [
    'Parallax is the apparent shift of a nearby star as the Earth moves round its orbit.',
    'The parallax angle p is the angle subtended by 1 AU at the star; d = 1 AU/p.',
    'A parsec is the distance at which p = 1″: 206 265 AU, or 3.26 light-years.',
    'd in parsecs = 1/p in arcseconds; even the nearest star has p < 1″.',
    'Parallax calibrates every other method of measuring cosmic distances.'
  ],
  pitfalls: [
    'The parallax angle is the whole shift over six months — It is half of it: the angle of 1 AU, not of the 2 AU baseline.',
    'A parsec is a unit of time — It is a distance, about 3.26 light-years.',
    'Bigger parallax means a more distant star — The opposite: distance is inversely proportional to parallax.'
  ],
  formulas: [
    {
      name: 'Distance from parallax',
      expr: 'd = a/p', tex: 'd = \\frac{a}{p}',
      vars: {
        d: { name: 'distance to the star', q: 'length', unit: 'pc' },
        a: { name: 'baseline: the observer\'s distance from the Sun (1 AU for the Earth)', q: 'length', unit: 'AU', value: 1 },
        p: { name: 'parallax angle', q: 'angle', unit: '″', value: 0.768 }
      },
      note: 'Small-angle form, with $p$ in radians internally. With $a$ = 1 AU and $p$ in arcseconds it is $d = 1/p$ parsecs.',
      stories: {
        d: 'A star shows a parallax of {p} measured from the Earth (baseline {a}). How far away is it?',
        p: 'What parallax does a star {d} away show, seen from a baseline of {a}?',
        a: 'A spacecraft far from the Sun measures a parallax of {p} for a star {d} away. What baseline (its distance from the Sun) did it use?'
      }
    },
    {
      name: 'Distance uncertainty from parallax uncertainty',
      expr: 'sd = d^2*sp/a', tex: '\\sigma_d = \\frac{d^2\\, \\sigma_p}{a}',
      vars: {
        sd: { name: 'uncertainty in the distance', q: 'length', unit: 'pc', tex: '\\sigma_d' },
        d: { name: 'distance', q: 'length', unit: 'pc', value: 1000 },
        sp: { name: 'uncertainty in the parallax', q: 'angle', unit: '″', value: 0.00002, tex: '\\sigma_p' },
        a: { name: 'baseline (1 AU for the Earth)', q: 'length', unit: 'AU', value: 1 }
      },
      note: 'A fixed error in $p$ gives a distance error that grows as $d^2$: far stars soon become unmeasurable. 0.00002″ is 20 microarcseconds, Gaia\'s precision for bright stars.',
      stories: {
        sd: 'A satellite measures parallaxes to ±{sp}. How uncertain is the distance of a star {d} away?',
        d: 'With parallaxes good to ±{sp}, out to what distance is the distance uncertainty only {sd}?'
      }
    }
  ],
  examples: [
    {
      title: 'The nearest star',
      q: 'Proxima Centauri has a parallax of 0.768″. How far away is it, in parsecs, light-years and metres?',
      steps: [
        '$d = 1/0.768 = 1.30$ pc.',
        'In light-years: $1.30 \\times 3.26 = 4.24$ ly.',
        'In metres: $1.30 \\times 3.086\\times10^{16} = 4.02\\times10^{16}$ m — about 270 000 times the distance to the Sun.'
      ],
      a: '1.30 pc = 4.24 ly = 4.0 × 10¹⁶ m'
    },
    {
      title: 'How far can Gaia see?',
      q: 'Gaia measures bright stars\' parallaxes to about ±20 microarcseconds. What is the percentage error in the distance of a star at 1 kpc, and at 10 kpc?',
      steps: [
        'At 1 kpc, $p = 1$ milliarcsecond $= 1000\\ \\mu$as, so the relative error is $20/1000 = 2\\%$.',
        'At 10 kpc, $p = 100\\ \\mu$as and the relative error is $20/100 = 20\\%$.',
        'The relative error in $d$ equals the relative error in $p$, and grows in proportion to the distance.'
      ],
      a: 'About 2% at 1 kpc; about 20% at 10 kpc.'
    }
  ],
  quiz: [
    { q: 'A star has a parallax of 0.1″. Its distance is…', choices: ['0.1 pc', '1 pc', '10 pc', '100 pc'], a: 2,
      why: '$d = 1/p = 1/0.1 = 10$ pc.' },
    { q: 'Star A has twice the parallax of star B. Star A is…', choices: ['twice as far away', 'half as far away', 'four times as far away', 'at the same distance'], a: 1,
      why: 'Distance is inversely proportional to parallax.' },
    { q: 'Why did ancient astronomers see no stellar parallax?', choices: ['The Earth does not orbit the Sun', 'The shifts are far smaller than the naked eye can detect', 'The stars move too fast to measure', 'The atmosphere cancels the shift'], a: 1,
      why: 'Even the largest stellar parallax, 0.77″, is about a hundred times smaller than the naked eye can resolve.' },
    { q: 'A telescope on Mars (1.52 AU from the Sun) would measure parallaxes 1.52 times larger than one on the Earth.', a: true,
      why: 'The parallax angle is set by the baseline: $p = a/d$ with $a = 1.52$ AU.' }
  ],
  applications: [
    'Building the cosmic distance ladder, from nearby stars to the expansion of the universe.',
    'Mapping the Milky Way in three dimensions with Gaia.',
    'Measuring true luminosities, and so testing models of stars.'
  ],
  history: 'Tycho Brahe\'s failure to detect parallax led him to reject the Earth\'s motion. Bessel (1838) finally measured it for 61 Cygni. In 2020 the New Horizons probe, 47 AU from the Sun, photographed Proxima Centauri and Wolf 359 visibly displaced from where they appear from Earth — the longest parallax baseline ever used.',
  sim: 'ra-parallax'
},

{
  id: 'stellar-magnitude', parent: 'stars', title: 'Luminosity and magnitude', level: 2,
  short: 'How much light a star gives out (its luminosity) versus how bright it looks from here (its flux) — and the backwards, logarithmic magnitude scale astronomers use for both.',
  keywords: ['magnitude', 'apparent magnitude', 'absolute magnitude', 'luminosity', 'flux', 'brightness', 'distance modulus', 'Pogson', 'bolometric magnitude', 'standard candle'],
  prereq: ['light-intensity', 'math:logarithms', 'stellar-parallax'],
  related: ['stellar-spectra', 'hr-diagram', 'math:logarithmic-scales', 'hubbles-law'],
  body: `
Two things are easily confused: how much light a star **gives out**, and how bright it **looks**. A star's **luminosity** $L$ is its total power output, in watts or in units of the Sun's, $L_\\odot = 3.83\\times10^{26}$ W. What reaches us is the **flux** $F$, the power per square metre of telescope, which falls off with the square of the distance ([[light-intensity|inverse-square law]]):

$$F = \\frac{L}{4\\pi d^2}$$

A star that looks bright may be a modest star nearby or a brilliant one far away. Knowing its distance, from [[stellar-parallax|parallax]] for example, turns one into the other.

### The magnitude scale
Astronomers still use a scale that goes back to Hipparchus, around 130 BC, who ranked naked-eye stars from first magnitude (the brightest) to sixth (the faintest). The eye responds roughly to ratios of brightness, so the scale is [[math:logarithmic-scales|logarithmic]], and — awkwardly — **larger magnitudes mean fainter stars**. In 1856 Norman Pogson made it exact: a difference of 5 magnitudes is a factor of exactly 100 in flux, so one magnitude is a factor of $100^{1/5} = 2.512$:

$$m_2 - m_1 = 2.5\\log_{10}\\frac{F_1}{F_2}$$

| Object | Apparent magnitude $m$ |
|---|---|
| Sun | −26.74 |
| Full Moon | −12.7 |
| Venus at its brightest | −4.9 |
| Sirius, the brightest star | −1.46 |
| Vega | 0.03 |
| Polaris | 1.98 |
| Faintest stars seen by eye in a dark sky | about 6.5 |
| Faintest galaxies seen by the Hubble Space Telescope | about 31 |

### Absolute magnitude
To compare stars fairly, imagine moving each one to a standard distance of 10 parsecs. Its magnitude there is its **absolute magnitude** $M$. The difference $m - M$ depends only on the distance and is called the **distance modulus**:

$$m - M = 5\\log_{10}\\frac{d}{10\\ \\mathrm{pc}}$$

(The 5 appears because flux goes as $1/d^2$ and $2.5 \\times 2 = 5$.) The Sun, with $M = 4.83$ in visible light, would be an unremarkable fifth-magnitude star at 10 pc. Sirius, 2.64 pc away, has $M = +1.43$: it gives out about 23 times as much visible light as the Sun.

Magnitudes are measured through coloured filters — V for visual, B for blue and so on. The **bolometric** magnitude counts all wavelengths, and is tied directly to luminosity:

$$M_\\mathrm{bol} = 4.74 - 2.5\\log_{10}\\frac{L}{L_\\odot}$$

> [!tip] Handy rules: 1 magnitude ≈ ×2.5; 2.5 magnitudes = ×10; 5 magnitudes = ×100; 10 magnitudes = ×10 000. Brighter means more *negative*.
`,
  ideas: [
    'Luminosity is the power a star emits; flux F = L/4πd² is what arrives per square metre.',
    'Magnitudes are logarithmic and backwards: 5 magnitudes fainter is 100 times less flux.',
    'Apparent magnitude m is how bright a star looks; absolute magnitude M is how bright it would look at 10 pc.',
    'The distance modulus m − M = 5 log₁₀(d/10 pc) links the two.',
    'Knowing any two of luminosity, flux and distance gives the third.'
  ],
  pitfalls: [
    'A higher magnitude means a brighter star — The scale runs backwards: magnitude 1 is brighter than magnitude 6, and the Sun is −26.7.',
    'The brightest-looking stars are the most luminous — Many are simply close. Sirius looks brightest but is only about 25 times the Sun, while Rigel, a hundred times farther, is about 100 000 times.',
    'A difference of 5 magnitudes means 5 times brighter — It means 100 times; each magnitude is a factor of about 2.5.'
  ],
  formulas: [
    {
      name: 'Magnitude difference and flux ratio',
      expr: 'm2 - m1 = 2.5*log(r)', tex: 'm_2 - m_1 = 2.5\\log_{10} r', solveFor: 'r',
      vars: {
        m2: { name: 'magnitude of star 2', value: 5, signed: true },
        m1: { name: 'magnitude of star 1', value: 0, signed: true },
        r: { name: 'flux ratio F₁/F₂ (how many times brighter star 1 looks)' }
      },
      stories: {
        r: 'Star 1 has magnitude {m1} and star 2 has magnitude {m2}. How many times brighter does star 1 look?',
        m2: 'Star 2 looks {r} times fainter than star 1, which has magnitude {m1}. What is the magnitude of star 2?'
      }
    },
    {
      name: 'Distance modulus',
      expr: 'm - M = 5*log(d/d0)', tex: 'm - M = 5\\log_{10}\\frac{d}{d_0}', solveFor: 'M',
      vars: {
        m: { name: 'apparent magnitude', value: -1.46, signed: true },
        M: { name: 'absolute magnitude', signed: true },
        d: { name: 'distance', q: 'length', unit: 'pc', value: 2.64 },
        d0: { name: 'reference distance (10 pc, by definition)', q: 'length', unit: 'pc', value: 10, fixed: true, tex: 'd_0' }
      },
      note: 'Ignores dimming by interstellar dust. The defaults are Sirius.',
      stories: {
        M: 'A star of apparent magnitude {m} is {d} away. What is its absolute magnitude?',
        d: 'A star has apparent magnitude {m} and absolute magnitude {M}. How far away is it?',
        m: 'How bright (apparent magnitude) does a star of absolute magnitude {M} look from {d}?'
      }
    },
    {
      name: 'Flux from luminosity and distance',
      expr: 'F = L/(4*pi*d^2)', tex: 'F = \\frac{L}{4\\pi d^2}',
      vars: {
        F: { name: 'flux received', q: 'intensity', unit: 'µW/m²' },
        L: { name: 'luminosity', q: 'power', unit: 'L☉', value: 25.4 },
        d: { name: 'distance', q: 'length', unit: 'pc', value: 2.64 }
      },
      stories: {
        F: 'A star of luminosity {L} is {d} away. What flux of starlight reaches the Earth (ignoring the atmosphere)?',
        L: 'Starlight arrives with a flux of {F} from a star {d} away. What is the star\'s luminosity?',
        d: 'A star of luminosity {L} delivers a flux of {F}. How far away is it?'
      }
    },
    {
      name: 'Bolometric magnitude and luminosity',
      expr: 'Mb = 4.74 - 2.5*log(L/Lsun)', tex: 'M_\\mathrm{bol} = 4.74 - 2.5\\log_{10}\\frac{L}{L_\\odot}',
      vars: {
        Mb: { name: 'absolute bolometric magnitude', signed: true, tex: 'M_\\mathrm{bol}' },
        L: { name: 'luminosity', q: 'power', unit: 'L☉', value: 25.4 },
        Lsun: { const: 'Lsun' }
      },
      stories: {
        Mb: 'A star has luminosity {L}. What is its absolute bolometric magnitude?',
        L: 'A star has absolute bolometric magnitude {Mb}. What is its luminosity?'
      }
    }
  ],
  examples: [
    {
      title: 'How luminous is Sirius?',
      q: 'Sirius has apparent magnitude −1.46 and lies 2.64 pc away. Find its absolute magnitude and compare its visible output with the Sun\'s ($M = 4.83$).',
      steps: [
        '$M = m - 5\\log_{10}(d/10\\ \\mathrm{pc}) = -1.46 - 5\\log_{10}(0.264)$.',
        '$\\log_{10} 0.264 = -0.578$, so $M = -1.46 + 2.89 = +1.43$.',
        'Difference from the Sun: $4.83 - 1.43 = 3.40$ magnitudes, a factor $10^{0.4 \\times 3.40} = 10^{1.36} = 23$.'
      ],
      a: 'M = +1.43; about 23 times the Sun\'s visible output.'
    },
    {
      title: 'The Sun from Alpha Centauri',
      q: 'How bright would the Sun ($M = 4.83$) look from Alpha Centauri, 1.34 pc away?',
      steps: [
        '$m = M + 5\\log_{10}(d/10\\ \\mathrm{pc}) = 4.83 + 5\\log_{10}(0.134)$.',
        '$\\log_{10} 0.134 = -0.873$, so $m = 4.83 - 4.37 = 0.46$.',
        'The Sun would be one of the brightest stars in their sky, in the constellation of Cassiopeia.'
      ],
      a: 'm ≈ 0.5 — as bright as the brightest stars we see.'
    }
  ],
  quiz: [
    { q: 'Star A has magnitude 1 and star B magnitude 6. Which looks brighter, and by how much?', choices: ['B, 5 times', 'A, 5 times', 'A, 100 times', 'B, 100 times'], a: 2,
      why: 'Smaller magnitude is brighter, and 5 magnitudes is a factor of exactly 100.' },
    { q: 'Two identical stars; one is 10 times farther away. It appears fainter by…', choices: ['1 magnitude', '2.5 magnitudes', '5 magnitudes', '10 magnitudes'], a: 2,
      why: 'Ten times the distance gives 100 times less flux, which is 5 magnitudes.' },
    { q: 'A star\'s absolute magnitude is larger (a bigger number) than its apparent magnitude. The star is…', choices: ['closer than 10 pc', 'exactly 10 pc away', 'farther than 10 pc', 'certainly a variable star'], a: 0,
      why: '$m - M = 5\\log_{10}(d/10\\ \\mathrm{pc}) < 0$ means $d < 10$ pc: moved out to 10 pc it would look fainter.' },
    { q: 'A star of magnitude −1 looks brighter than one of magnitude +1.', a: true,
      why: 'More negative is brighter; the difference of 2 magnitudes is a factor of about 6.3.' }
  ],
  applications: [
    'Standard candles — Cepheid variables and Type Ia supernovae — whose known luminosity gives distances to galaxies.',
    'Planning observations: exposure times depend on the magnitude of the target.',
    'Estimating how luminous a star is, a key input to the HR diagram.'
  ],
  history: 'Hipparchus (2nd century BC) and Ptolemy catalogued stars in six magnitudes. Norman Pogson fixed the ratio at 100 for 5 magnitudes in 1856. Henrietta Swan Leavitt discovered in 1912 that Cepheid variables of longer period are more luminous, the first standard candle.'
},

{
  id: 'stellar-spectra', parent: 'stars', title: 'Stellar spectra and temperature', level: 2,
  short: 'A star\'s colour gives its temperature, and the dark lines in its spectrum give its composition — sorted into the spectral classes O B A F G K M.',
  keywords: ['stellar spectrum', 'spectral class', 'OBAFGKM', 'Wien\'s law', 'colour index', 'absorption lines', 'Fraunhofer lines', 'Annie Jump Cannon', 'Cecilia Payne', 'star colour', 'temperature'],
  prereq: ['blackbody-radiation', 'thermal-radiation', 'hydrogen-spectrum'],
  related: ['hr-diagram', 'stellar-magnitude', 'the-sun', 'doppler-effect'],
  body: `
Spread a star's light with a prism or grating and you learn most of what astronomy knows about it: its temperature, its composition, whether it is a dwarf or a giant, and how it moves.

### Colour and temperature
To a good approximation a star shines like a [[blackbody-radiation|blackbody]]: its spectrum is a smooth hump whose peak moves to shorter wavelengths as the temperature rises — **Wien's law**,

$$\\lambda_\\mathrm{max} = \\frac{b}{T}, \\qquad b = 2.898\\times10^{-3}\\ \\mathrm{m\\,K}$$

A cool red star at 3500 K peaks in the infrared at 830 nm; the Sun, at 5772 K, peaks at 502 nm in the blue-green; a hot blue star at 25 000 K peaks in the ultraviolet at 116 nm. So colour is a thermometer: red stars are cool and blue-white stars hot — the opposite of the red and blue on bathroom taps. (There are no green stars: a spectrum peaking in the green still contains plenty of every colour, and looks white.) Astronomers measure colour precisely by comparing magnitudes through a blue and a yellow filter, the **colour index** $B - V$.

Once the temperature is known, the [[thermal-radiation|Stefan–Boltzmann law]] ties it to the luminosity and the radius:

$$L = 4\\pi R^2\\,\\sigma T^4$$

That is how we know that Betelgeuse, at only 3600 K but about 100 000 times the Sun's luminosity, must be some 800 times the Sun's radius.

### The lines
A star's spectrum is crossed by dark **absorption lines**: the cooler gas in the star's atmosphere absorbs the particular wavelengths that its atoms and ions can take up ([[hydrogen-spectrum|atomic spectra]]). Joseph von Fraunhofer catalogued hundreds of them in sunlight in 1814. Each is a fingerprint of an element in a particular state.

### O B A F G K M
Around 1900 Annie Jump Cannon at Harvard sorted hundreds of thousands of stellar spectra by the patterns of their lines into the classes still used today, in order of falling temperature:

| Class | Temperature (K) | Colour | Strongest lines | Example |
|---|---|---|---|---|
| O | above 30 000 | blue | ionised helium | θ¹ Orionis C |
| B | 10 000–30 000 | blue-white | neutral helium, hydrogen | Rigel |
| A | 7500–10 000 | white | hydrogen, strongest of all | Sirius, Vega |
| F | 6000–7500 | yellow-white | hydrogen, ionised calcium | Procyon |
| G | 5200–6000 | yellow | ionised calcium, metals | the Sun |
| K | 3700–5200 | orange | neutral metals | Arcturus |
| M | below 3700 | red | molecules such as titanium oxide | Betelgeuse |

Each class is split into subclasses 0–9 (the Sun is G2), and a Roman numeral adds the size: V for main-sequence dwarfs, III for giants, I for supergiants. It is read from the widths of the lines: the thin, low-pressure atmospheres of giants give sharper lines.

### Temperature, not composition
Why are hydrogen lines strongest in A stars, when nearly every star is mostly hydrogen? In 1925 Cecilia Payne showed that the classes reflect **temperature**. In cool stars few hydrogen atoms are excited to the level whose absorption produces the visible lines; in the hottest stars most of the hydrogen is ionised and cannot absorb them at all. Around 10 000 K the balance is best. Correcting for this, she found that stars are made overwhelmingly of hydrogen and helium — so surprising at the time that she was persuaded to call the result probably spurious. She was right all along.

> [!tip] The positions of the lines also shift with the star's motion ([[doppler-effect|Doppler effect]]): that is how radial velocities, spectroscopic binaries and many exoplanets are found.
`,
  ideas: [
    'Stars shine roughly as blackbodies: their colour gives their surface temperature.',
    'Wien\'s law λ_max = b/T: cool stars peak in the red or infrared, hot stars in the blue or ultraviolet.',
    'With the temperature and luminosity known, L = 4πR²σT⁴ gives the radius.',
    'Absorption lines identify the elements; their pattern defines the classes O B A F G K M, hottest first.',
    'Line strengths depend mainly on temperature; nearly all stars are mostly hydrogen and helium.'
  ],
  pitfalls: [
    'Red stars are hot, blue stars cold — The reverse: blue stars are the hottest.',
    'The Sun would look green from space because its spectrum peaks there — Its light contains all colours in similar amounts, and the eye sees that as white.',
    'Stars with weak hydrogen lines contain little hydrogen — The line strength depends on temperature, not on how much hydrogen there is.'
  ],
  formulas: [
    {
      name: 'Wien\'s law for a star',
      expr: 'lam = bW/T', tex: '\\lambda_\\mathrm{max} = \\frac{b}{T}',
      vars: {
        lam: { name: 'wavelength of peak emission', q: 'length', unit: 'nm', tex: '\\lambda_\\mathrm{max}' },
        bW: { const: 'bW' },
        T: { name: 'surface temperature', q: 'temperature', unit: 'K', value: 5772 }
      },
      stories: {
        lam: 'A star has a surface temperature of {T}. At what wavelength does its spectrum peak?',
        T: 'A star\'s spectrum peaks at {lam}. What is its surface temperature?'
      }
    },
    {
      name: 'Radius from luminosity and temperature',
      expr: 'L = 4*pi*R^2*sigma*T^4', tex: 'L = 4\\pi R^2 \\sigma T^4', solveFor: 'R',
      vars: {
        L: { name: 'luminosity', q: 'power', unit: 'L☉', value: 100000 },
        R: { name: 'radius', q: 'length', unit: 'R☉' },
        T: { name: 'surface temperature', q: 'temperature', unit: 'K', value: 3600 },
        sigma: { const: 'sigma' }
      },
      note: 'The defaults are close to Betelgeuse.',
      stories: {
        R: 'A star with luminosity {L} has a surface temperature of {T}. What is its radius?',
        T: 'A star of radius {R} has luminosity {L}. What is its surface temperature?',
        L: 'A star has radius {R} and surface temperature {T}. What is its luminosity?'
      }
    }
  ],
  examples: [
    {
      title: 'The colour of Rigel',
      q: 'Rigel has a surface temperature of 12 100 K. Where does its spectrum peak?',
      steps: [
        '$\\lambda_\\mathrm{max} = \\dfrac{2.898\\times10^{-3}\\ \\mathrm{m\\,K}}{12\\,100\\ \\mathrm{K}} = 2.39\\times10^{-7}$ m $= 239$ nm.',
        'That is in the ultraviolet. In visible light the blue end is stronger than the red, so Rigel looks blue-white.'
      ],
      a: '239 nm, in the ultraviolet.'
    },
    {
      title: 'How big is Betelgeuse?',
      q: 'Betelgeuse has a surface temperature of about 3600 K and a luminosity of about $1.0\\times10^{5}\\ L_\\odot$. Estimate its radius.',
      steps: [
        '$L = 10^{5} \\times 3.83\\times10^{26} = 3.83\\times10^{31}$ W.',
        '$\\sigma T^4 = 5.67\\times10^{-8} \\times 3600^4 = 9.52\\times10^{6}\\ \\mathrm{W/m^2}$.',
        '$R = \\sqrt{\\dfrac{L}{4\\pi\\sigma T^4}} = \\sqrt{\\dfrac{3.83\\times10^{31}}{1.20\\times10^{8}}} = 5.7\\times10^{11}$ m.',
        'That is about 800 solar radii, or 3.8 AU: placed at the Sun, Betelgeuse would reach beyond the orbit of Mars.'
      ],
      a: 'About 800 R☉ (3.8 AU).'
    }
  ],
  quiz: [
    { q: 'Which of these stars is hottest?', choices: ['A red star', 'An orange star', 'A yellow star', 'A blue-white star'], a: 3,
      why: 'Hotter blackbodies peak at shorter wavelengths, so the hottest stars look blue-white.' },
    { q: 'Hydrogen absorption lines are strongest in A stars because…', choices: ['A stars contain the most hydrogen', 'at about 10 000 K the most hydrogen atoms are in the excited state that absorbs visible light', 'A stars are the youngest stars', 'hydrogen is destroyed in hotter stars'], a: 1,
      why: 'Cooler stars have too few excited atoms; hotter ones have ionised most of their hydrogen. The composition is much the same.' },
    { q: 'Two stars have the same surface temperature, but one is 100 times more luminous. Its radius is…', choices: ['100 times larger', '10 times larger', 'the same', '10 000 times larger'], a: 1,
      why: 'At fixed $T$, $L \\propto R^2$, so $R$ grows as $\\sqrt{100} = 10$.' },
    { q: 'The Sun\'s spectrum peaks in the green, so from space the Sun would look green.', a: false,
      why: 'Its spectrum is broad and contains all visible colours in comparable amounts; the eye sees the mixture as white.' }
  ],
  applications: [
    'Measuring the temperatures, compositions and motions of stars from their spectra.',
    'Classifying millions of stars automatically in large sky surveys.',
    'Finding exoplanets from the tiny Doppler shifts of spectral lines.'
  ],
  history: 'Fraunhofer mapped the dark lines of sunlight in 1814; Kirchhoff and Bunsen explained them as absorption by elements around 1860. The Harvard classification was built by Williamina Fleming, Antonia Maury and Annie Jump Cannon, and Cecilia Payne\'s 1925 thesis showed that stars are mostly hydrogen and helium.',
  sim: { id: 'ra-hr', params: { pick: 'Rigel' } }
},

{
  id: 'hr-diagram', parent: 'stars', title: 'The Hertzsprung–Russell diagram', level: 2,
  short: 'A plot of stars\' luminosity against their temperature, in which they fall into a few clear groups — above all the main sequence, where a star\'s mass decides its place.',
  keywords: ['HR diagram', 'Hertzsprung–Russell', 'main sequence', 'red giant', 'supergiant', 'white dwarf', 'mass–luminosity relation', 'main-sequence lifetime', 'turn-off point', 'star cluster'],
  prereq: ['stellar-magnitude', 'stellar-spectra', 'math:logarithmic-scales'],
  related: ['stellar-evolution', 'compact-stars', 'the-sun', 'math:power-functions'],
  body: `
Around 1910 Ejnar Hertzsprung and Henry Norris Russell independently plotted stars' luminosities against their temperatures (or spectral classes). Instead of a random scatter, the stars fell into a few distinct groups. The result is the most important single diagram in astronomy.

### Reading the diagram
Luminosity goes up the page, on a [[math:logarithmic-scales|logarithmic scale]] from a ten-thousandth of the Sun's to a million times it. Temperature goes across — but **backwards**, hot on the left, a leftover of ordering stars by spectral class O B A F G K M. Because $L = 4\\pi R^2\\sigma T^4$, a star's position also fixes its radius: lines of constant radius run diagonally, and stars get bigger towards the upper right.

### The groups
- **Main sequence.** About 90% of stars lie on a band from hot, luminous blue stars at the upper left to cool, dim red dwarfs at the lower right. They are fusing hydrogen in their cores, like the Sun, and a star's place on the band is set by its **mass**: a 40-solar-mass O star is hundreds of thousands of times as luminous as the Sun, a 0.1-solar-mass red dwarf about a thousand times fainter.
- **Giants.** Above the main sequence on the right: cool but luminous, so they must be big — 10 to 100 times the Sun's radius. Arcturus and Aldebaran are examples.
- **Supergiants.** Across the top: the most luminous stars, up to about a thousand solar radii. Betelgeuse would swallow the orbit of Mars.
- **White dwarfs.** At the lower left: hot but faint, so tiny — about the size of the Earth ([[compact-stars|white dwarfs]]).

### Mass sets everything
Along the main sequence, luminosity climbs steeply with mass — very roughly as a [[math:power-functions|power law]],

$$\\frac{L}{L_\\odot} \\approx \\left(\\frac{M}{M_\\odot}\\right)^{3.5}$$

A star's fuel is proportional to its mass, but it spends it at a rate proportional to its luminosity, so its main-sequence lifetime goes as $M/L \\propto M^{-2.5}$:

$$t \\approx 10\\ \\text{billion years} \\times \\left(\\frac{M}{M_\\odot}\\right)^{-2.5}$$

A 10-solar-mass star lasts only about 30 million years; a 0.2-solar-mass red dwarf, hundreds of billions — far longer than the universe has existed. (The exponents change along the sequence, so treat these as estimates.)

### Clocks in star clusters
The stars of a cluster were born together, at the same distance from us. On the cluster's diagram the most massive stars have already left the main sequence to become giants, so the sequence ends at a **turn-off point**. The lower the turn-off, the older the cluster; the oldest globular clusters turn off just below the Sun's mass, at ages of 12–13 billion years. Following stars across the diagram as they age is the story of [[stellar-evolution|stellar evolution]].

> [!note] The stars you see at night are a biased sample: luminous stars can be seen from far away, so the naked-eye sky is full of giants and bright main-sequence stars. Three-quarters of the stars near the Sun are red dwarfs, none of them visible without a telescope.
`,
  ideas: [
    'The HR diagram plots luminosity against temperature, hot stars on the left.',
    'About 90% of stars lie on the main sequence, where hydrogen burns in the core and mass sets position.',
    'Giants and supergiants lie above it, white dwarfs below; lines of constant radius run diagonally.',
    'Roughly L ∝ M^3.5 on the main sequence, so lifetimes go as M^−2.5: massive stars die young.',
    'The turn-off point of a cluster\'s main sequence gives its age.'
  ],
  pitfalls: [
    'The main sequence is a path stars travel along as they age — Stars stay at nearly the same place on it for most of their lives; their position is set by mass, not age.',
    'Temperature increases to the right, as on ordinary graphs — By tradition it increases to the left.',
    'Bigger stars live longer because they have more fuel — They burn it so much faster that they live far shorter lives.'
  ],
  formulas: [
    {
      name: 'Mass–luminosity relation (main sequence)',
      expr: 'L = Lsun*(M/Msun)^3.5', tex: 'L = L_\\odot\\left(\\frac{M}{M_\\odot}\\right)^{3.5}',
      vars: {
        L: { name: 'luminosity', q: 'power', unit: 'L☉' },
        M: { name: 'mass', q: 'mass', unit: 'M☉', value: 2 },
        Lsun: { const: 'Lsun' },
        Msun: { const: 'Msun' }
      },
      note: 'A rough fit for main-sequence stars between about 1 and 20 solar masses.',
      stories: {
        L: 'Roughly how luminous is a main-sequence star of {M}?',
        M: 'A main-sequence star has luminosity {L}. Roughly what is its mass?'
      }
    },
    {
      name: 'Main-sequence lifetime',
      expr: 't = tsun*(M/Msun)^(-2.5)', tex: 't = t_\\odot\\left(\\frac{M}{M_\\odot}\\right)^{-2.5}',
      vars: {
        t: { name: 'main-sequence lifetime', q: 'time', unit: 'Gyr' },
        tsun: { name: 'main-sequence lifetime of the Sun', q: 'time', unit: 'Gyr', value: 10, tex: 't_\\odot' },
        M: { name: 'mass of the star', q: 'mass', unit: 'M☉', value: 2 },
        Msun: { const: 'Msun' }
      },
      stories: {
        t: 'Roughly how long will a star of {M} spend on the main sequence?',
        M: 'A star cluster\'s main sequence ends at stars that live {t}. What mass are the stars at the turn-off?'
      }
    },
    {
      name: 'Luminosity from radius and temperature, in solar units',
      expr: 'L = Lsun*(R/Rsun)^2*(T/Tsun)^4', tex: 'L = L_\\odot\\left(\\frac{R}{R_\\odot}\\right)^2\\left(\\frac{T}{T_\\odot}\\right)^4',
      vars: {
        L: { name: 'luminosity', q: 'power', unit: 'L☉' },
        R: { name: 'radius', q: 'length', unit: 'R☉', value: 25 },
        T: { name: 'surface temperature', q: 'temperature', unit: 'K', value: 4300 },
        Tsun: { name: 'surface temperature of the Sun', q: 'temperature', unit: 'K', value: 5772, tex: 'T_\\odot' },
        Lsun: { const: 'Lsun' },
        Rsun: { const: 'Rsun' }
      },
      note: 'The Stefan–Boltzmann law divided by the same law for the Sun: the constants cancel.',
      stories: {
        L: 'A giant star has radius {R} and surface temperature {T}. How luminous is it?',
        R: 'A star with surface temperature {T} has luminosity {L}. What is its radius?'
      }
    }
  ],
  examples: [
    {
      title: 'A star twice the Sun\'s mass',
      q: 'Estimate the luminosity and main-sequence lifetime of a star of 2 solar masses.',
      steps: [
        '$L \\approx 2^{3.5} = 11.3\\ L_\\odot$.',
        '$t \\approx 10 \\times 2^{-2.5} = 10/5.66 = 1.8$ billion years.',
        'Twice the fuel, eleven times the spending: a lifetime less than a fifth of the Sun\'s.'
      ],
      a: 'About 11 L☉ and 1.8 billion years.'
    },
    {
      title: 'The size of Arcturus',
      q: 'Arcturus has a surface temperature of 4290 K and a luminosity of about 170 $L_\\odot$. How big is it?',
      steps: [
        'In solar units, $R/R_\\odot = \\sqrt{L/L_\\odot}\\,(T_\\odot/T)^2$.',
        '$\\sqrt{170} = 13.0$ and $(5772/4290)^2 = 1.81$.',
        '$R \\approx 13.0 \\times 1.81 = 23.6\\ R_\\odot$ — a giant.'
      ],
      a: 'About 24 solar radii.'
    }
  ],
  quiz: [
    { q: 'On an HR diagram, a star at the upper right is…', choices: ['hot and faint', 'cool and luminous: a giant', 'hot and luminous: an O star', 'cool and faint: a red dwarf'], a: 1,
      why: 'Upper means luminous, right means cool; to be both it must be large.' },
    { q: 'A main-sequence star has 3 times the Sun\'s mass. Compared with the Sun it lives…', choices: ['3 times longer', 'about 3 times shorter', 'about 16 times shorter', 'just as long'], a: 2,
      why: '$3^{2.5} = 15.6$: its lifetime is about 16 times shorter.' },
    { q: 'Why do white dwarfs sit at the lower left?', choices: ['They are cool and large', 'They are hot but so small that they give out little light', 'They are very far away', 'They have stopped fusing, so they are cold'], a: 1,
      why: 'High temperature puts them on the left, and a tiny surface area makes them faint.' },
    { q: 'A star\'s position on the main sequence is set mainly by its mass.', a: true,
      why: 'Mass decides the core temperature and pressure, and so how fast the star burns and how hot its surface is.' },
    { q: 'A star cluster\'s main sequence turns off at stars of 2 solar masses. Roughly how old is it?', choices: ['20 billion years', '1.8 billion years', '200 million years', '10 billion years'], a: 1,
      why: 'Stars of 2 solar masses last about $10 \\times 2^{-2.5} = 1.8$ billion years; the cluster is that old.' }
  ],
  applications: [
    'Dating star clusters from their turn-off points.',
    'Estimating distances by fitting a cluster\'s main sequence to the known one ("main-sequence fitting").',
    'Testing theories of stellar structure against real stars.'
  ],
  history: 'Ejnar Hertzsprung (1905–1911) noticed that stars of the same colour could differ enormously in luminosity, and introduced "giants" and "dwarfs"; Henry Norris Russell published the diagram in its familiar form in 1913–14.',
  sim: 'ra-hr'
},

{
  id: 'stellar-evolution', parent: 'stars', title: 'Stellar evolution', level: 2,
  short: 'How stars are born from collapsing gas clouds, shine for millions to trillions of years, and end as white dwarfs, neutron stars or black holes, depending on their mass.',
  keywords: ['stellar evolution', 'star formation', 'protostar', 'main sequence', 'red giant', 'planetary nebula', 'supernova', 'neutron star', 'nucleosynthesis', 'brown dwarf', 'life cycle of a star'],
  prereq: ['hr-diagram', 'fusion', 'the-sun'],
  related: ['compact-stars', 'black-holes', 'binding-energy', 'big-bang'],
  body: `
Stars are born, live and die, but so slowly that we never watch one do it. We read their life stories by comparing many stars at different stages — rather like working out how trees grow from one walk through a forest.

### Birth
Stars form in cold, dense clouds of molecular gas. A clump that is massive and cold enough collapses under its own gravity, heating as it shrinks ([[gravitational-potential-energy|gravitational energy]] turning into heat). A disc forms around the young **protostar**, and planets may grow in it. When the core reaches about 10 million kelvin, hydrogen fusion ignites and the star settles onto the **main sequence**. Clumps of less than about 0.08 solar masses never get hot enough and end up as **brown dwarfs**.

### The long middle age
On the main sequence a star fuses hydrogen into helium in its core, steadily, for most of its life: about 10 billion years for the Sun, a few million for the most massive stars ([[hr-diagram|HR diagram]]). Without fusion the only energy source would be slow contraction, and the **Kelvin–Helmholtz time** $GM^2/(RL)$ shows that could keep the Sun shining for only about 30 million years — far too short for the age of the Earth. That is how physicists knew, before they understood it, that some new source — nuclear energy — must power the stars.

### Stars like the Sun
When the hydrogen in the core runs out, the core contracts and heats, while hydrogen keeps burning in a shell around it. The outer layers swell and cool: the star becomes a **red giant**, about a hundred times wider and thousands of times more luminous. In about five billion years the Sun will engulf Mercury and Venus, and perhaps the Earth. At 100 million kelvin the core ignites helium, fusing it into carbon and oxygen (the **triple-alpha** process). Later the star swells again on the asymptotic giant branch, pulsates, and puffs its outer layers into space as a glowing **planetary nebula**, lit by the exposed hot core. That core — carbon and oxygen, the size of the Earth — is a **white dwarf**, which cools slowly for billions of years ([[compact-stars|compact stars]]).

### Massive stars
Stars born with more than about 8 solar masses go further. After helium they fuse carbon, neon, oxygen and silicon, each stage faster than the last (silicon burning lasts about a day), until the core is an onion of shells around a ball of **iron**. Iron is the end of the line: its nuclei are among the most tightly bound of all ([[binding-energy|binding energy]]), so fusing them absorbs energy instead of releasing it. When the iron core passes about 1.4 solar masses it collapses in under a second, from the size of the Earth to a ball about 20 km across. The rebound and a flood of neutrinos blow the rest of the star apart in a **core-collapse supernova**, which for a few weeks can outshine its whole galaxy. What remains is a **neutron star** or, for the heaviest stars, a [[black-holes|black hole]].

### We are made of star stuff
The big bang made only hydrogen, helium and a trace of lithium ([[big-bang|the big bang]]). The carbon in your cells and the oxygen you breathe were made in stars and scattered by stellar winds, planetary nebulae and supernovae; much of the iron came from exploding white dwarfs; and gold and platinum mostly from colliding neutron stars.

> [!history] In February 1987 a supernova exploded in the Large Magellanic Cloud. About three hours before its light was noticed, detectors in Japan, the United States and the Soviet Union caught two dozen neutrinos from the collapsing core — a direct confirmation of the theory of core collapse.
`,
  ideas: [
    'Stars form when cold gas clouds collapse; fusion starts when the core reaches about 10 million K.',
    'Most of a star\'s life is spent on the main sequence, fusing hydrogen in its core.',
    'Stars like the Sun become red giants, shed planetary nebulae and end as white dwarfs.',
    'Stars above about 8 solar masses build iron cores that collapse in supernovae, leaving neutron stars or black holes.',
    'Almost every element heavier than helium was made in stars or stellar explosions.'
  ],
  pitfalls: [
    'The Sun will explode as a supernova — It is far too light; it will become a red giant and end as a white dwarf.',
    'A star becomes a red giant because it has run out of fuel entirely — Its core has run out of hydrogen, but burning continues in a shell (and later helium burns in the core).',
    'Heavier stars last longer because they have more fuel — They burn it so fast that their lives are far shorter.'
  ],
  formulas: [
    {
      name: 'Kelvin–Helmholtz time (shining by contraction alone)',
      expr: 't = G*M^2/(R*L)', tex: 't_\\mathrm{KH} = \\frac{G M^2}{R L}',
      vars: {
        t: { name: 'Kelvin–Helmholtz time', q: 'time', unit: 'Myr', tex: 't_\\mathrm{KH}' },
        M: { name: 'mass', q: 'mass', unit: 'M☉', value: 1 },
        R: { name: 'radius', q: 'length', unit: 'R☉', value: 1 },
        L: { name: 'luminosity', q: 'power', unit: 'L☉', value: 1 },
        G: { const: 'G' }
      },
      note: 'The gravitational energy available, about $GM^2/R$, divided by the rate at which it is radiated. Also roughly how long a protostar takes to contract onto the main sequence.',
      stories: {
        t: 'For how long could a star of mass {M}, radius {R} and luminosity {L} shine on gravitational contraction alone?'
      }
    },
    {
      name: 'Nuclear lifetime',
      expr: 't = 0.007*f*M*c^2/L', tex: 't_\\mathrm{nuc} = \\frac{0.007\\, f\\, M c^2}{L}',
      vars: {
        t: { name: 'time the hydrogen fuel lasts', q: 'time', unit: 'Gyr', tex: 't_\\mathrm{nuc}' },
        f: { name: 'fraction of the mass fused in the core', value: 0.1, min: 0, max: 1 },
        M: { name: 'mass', q: 'mass', unit: 'M☉', value: 1 },
        L: { name: 'luminosity', q: 'power', unit: 'L☉', value: 1 },
        c: { const: 'c' }
      },
      note: 'Hydrogen fusion releases 0.7% of the rest energy. About a tenth of the Sun\'s mass is fused before it leaves the main sequence.',
      stories: {
        t: 'A star of mass {M} and luminosity {L} will fuse a fraction {f} of its mass. How long does its hydrogen last?',
        L: 'A star of mass {M} lasts {t} while fusing a fraction {f} of its mass. What is its average luminosity?'
      }
    }
  ],
  examples: [
    {
      title: 'Why the Sun cannot run on gravity',
      q: 'Estimate the Kelvin–Helmholtz time of the Sun.',
      steps: [
        '$GM^2 = 6.67\\times10^{-11} \\times (1.99\\times10^{30})^2 = 2.64\\times10^{50}$ J·m, and $RL = 6.96\\times10^{8} \\times 3.83\\times10^{26} = 2.67\\times10^{35}$ W·m.',
        '$t = \\dfrac{GM^2}{RL} = \\dfrac{2.64\\times10^{50}}{2.67\\times10^{35}} = 9.9\\times10^{14}$ s.',
        'That is about 31 million years — but rocks and fossils show the Earth is billions of years old.'
      ],
      a: 'About 30 million years: far too short, so the Sun must be nuclear-powered.'
    },
    {
      title: 'The Sun\'s fuel supply',
      q: 'If the Sun fuses 10% of its mass, releasing 0.7% of that as energy, how long can it shine at its present luminosity?',
      steps: [
        'Energy available: $0.007 \\times 0.1 \\times 1.99\\times10^{30} \\times (3.00\\times10^{8})^2 = 1.25\\times10^{44}$ J.',
        'Time: $1.25\\times10^{44}/3.83\\times10^{26} = 3.3\\times10^{17}$ s.',
        'That is about 10 billion years; the Sun, at 4.6 billion, is roughly halfway.'
      ],
      a: 'About 10 billion years.'
    }
  ],
  quiz: [
    { q: 'What will the Sun become at the very end of its life?', choices: ['A black hole', 'A neutron star', 'A white dwarf', 'A supernova remnant with nothing left'], a: 2,
      why: 'Stars below about 8 solar masses shed their envelopes and leave white-dwarf cores.' },
    { q: 'Why does fusion in a massive star stop at iron?', choices: ['There is no more hydrogen', 'Fusing iron absorbs energy instead of releasing it', 'Iron is not dense enough to fuse', 'The core cools down'], a: 1,
      why: 'Iron-group nuclei are the most tightly bound; building anything heavier costs energy, so the core can no longer support itself.' },
    { q: 'Which of these stars leaves the main sequence first?', choices: ['A 0.5-solar-mass red dwarf', 'The Sun', 'A 10-solar-mass blue star', 'They all leave at the same time'], a: 2,
      why: 'Massive stars burn their fuel far faster: a 10-solar-mass star lasts about 30 million years.' },
    { q: 'The gold in a wedding ring was made in the big bang.', a: false,
      why: 'The big bang made only the lightest elements. Gold was made mostly in neutron-star mergers, and some in rare supernovae.' }
  ],
  applications: [
    'Explaining the origin of the chemical elements.',
    'Predicting the future of the Sun and the Earth.',
    'Using supernovae and their remnants to measure distances and study extreme physics.'
  ],
  history: 'Hans Bethe explained stellar fusion in 1938–39. In 1957 Margaret and Geoffrey Burbidge, William Fowler and Fred Hoyle showed how the elements are built up in stars ("B²FH"). Subrahmanyan Chandrasekhar found the white-dwarf mass limit in 1930.',
  sim: { id: 'ra-hr', params: { track: 'sun' } }
},

{
  id: 'compact-stars', parent: 'stars', title: 'White dwarfs and neutron stars', level: 3,
  short: 'The dead cores of stars, held up not by heat but by quantum mechanics: white dwarfs the size of the Earth, and neutron stars the size of a city with the density of an atomic nucleus.',
  keywords: ['white dwarf', 'neutron star', 'pulsar', 'magnetar', 'degeneracy pressure', 'Chandrasekhar limit', 'Sirius B', 'Crab pulsar', 'Jocelyn Bell Burnell', 'compact object', 'Type Ia supernova'],
  prereq: ['stellar-evolution', 'pauli-exclusion', 'angular-momentum'],
  related: ['black-holes', 'gravitational-waves', 'gravitational-time-dilation', 'fermi-energy'],
  body: `
When a star can no longer fuse anything, gravity wins — unless something else can hold it up. For most stars that something is quantum mechanics.

### White dwarfs: held up by electrons
Squeeze matter hard enough and its electrons are crowded into a smaller and smaller space. The [[pauli-exclusion|Pauli exclusion principle]] allows no two electrons in the same state, so squeezed electrons are forced into states of ever higher momentum. The result is **electron degeneracy pressure**, which does not depend on temperature and holds a star up even when it is cold ([[fermi-energy|Fermi energy]]).

A typical **white dwarf** packs 0.6 solar masses into a sphere the size of the Earth. Its mean density is around $10^{9}$ kg/m³ — a teaspoonful would weigh a few tonnes. It no longer makes energy; it simply cools, from over 100 000 K at birth to a dim ember over billions of years. Oddly, **heavier white dwarfs are smaller**: more mass squeezes the electrons harder, and the radius shrinks roughly as $M^{-1/3}$. Sirius B, the faint companion of the brightest star in the sky, has about the Sun's mass in a sphere smaller than the Earth.

As the mass grows the electrons are pushed towards the speed of light, their pressure becomes less effective, and at about **1.4 solar masses — the Chandrasekhar limit** — no white dwarf can support itself. A white dwarf pushed over the limit by gas from a companion star explodes as a **Type Ia supernova**, the standard candles that revealed [[dark-matter-energy|dark energy]].

### Neutron stars: held up by neutrons
In the collapsing iron core of a massive star ([[stellar-evolution|stellar evolution]]), electrons are squeezed into protons to make neutrons. The collapse halts when the core reaches the density of an atomic nucleus: a **neutron star**, typically 1.4 solar masses in a sphere about 12 km in radius, supported by neutron degeneracy pressure and by the strong force, which becomes repulsive at very short range.

The numbers are extreme:
- **Density** around $4\\times10^{17}$ kg/m³: a sugar cube of it would weigh as much as all of humanity.
- **Surface gravity** around $10^{12}$ m/s², and an escape velocity over half the speed of light, so [[gravitational-time-dilation|general relativity]] matters.
- **Spin**: conserving [[angular-momentum|angular momentum]] as the core shrinks from thousands of kilometres to a dozen spins it up enormously. The fastest known neutron star turns 716 times a second.
- **Magnetic field**: $10^{8}$ T is typical, the star's field squeezed up with it; **magnetars** reach $10^{11}$ T.

The heaviest neutron stars measured weigh a little over 2 solar masses; the upper limit, set by the still uncertain behaviour of nuclear matter, is thought to be about 2.2–2.3. Above it, nothing can stop the collapse and a [[black-holes|black hole]] forms.

### Pulsars
In 1967 Jocelyn Bell Burnell, a research student at Cambridge, noticed a radio source pulsing every 1.337 seconds with clock-like regularity. It was a spinning neutron star: beams of radio waves from its magnetic poles sweep past the Earth once per turn, like a lighthouse. The Crab pulsar, left by the supernova that Chinese astronomers recorded in 1054, spins 30 times a second. The best pulsars keep time as well as atomic clocks and are used to test general relativity and to hunt for [[gravitational-waves|gravitational waves]].

> [!note] Merging neutron stars fling out neutron-rich debris in which heavy elements such as gold and platinum are built; the merger GW170817 in 2017 was seen doing it.
`,
  ideas: [
    'Electron degeneracy pressure, from the exclusion principle, supports white dwarfs even when cold.',
    'A white dwarf holds about a solar mass in an Earth-sized sphere; heavier ones are smaller.',
    'Above about 1.4 solar masses (the Chandrasekhar limit) no white dwarf can exist.',
    'Neutron stars hold 1.4–2 solar masses in about 12 km radius, at nuclear density.',
    'Pulsars are spinning, magnetised neutron stars whose beams sweep past us like lighthouses.'
  ],
  pitfalls: [
    'White dwarfs shine because of fusion — They have no fusion at all; they glow with stored heat and slowly cool.',
    'A heavier white dwarf is bigger — More mass makes it smaller, because the electrons must be squeezed harder to support it.',
    'Pulsars pulse because the star swells and shrinks — The star is steady; its rotating beam sweeps past us once per turn.'
  ],
  formulas: [
    {
      name: 'Mean density',
      expr: 'rho = 3*M/(4*pi*R^3)', tex: '\\rho = \\frac{3M}{4\\pi R^3}',
      vars: {
        rho: { name: 'mean density', q: 'density', unit: 'kg/m³', tex: '\\rho' },
        M: { name: 'mass', q: 'mass', unit: 'M☉', value: 1.4 },
        R: { name: 'radius', q: 'length', unit: 'km', value: 12 }
      },
      stories: {
        rho: 'A compact star has mass {M} and radius {R}. What is its mean density?',
        R: 'A compact star of mass {M} has a mean density of {rho}. What is its radius?'
      }
    },
    {
      name: 'Surface gravity',
      expr: 'gs = G*M/R^2', tex: 'g = \\frac{G M}{R^2}',
      vars: {
        gs: { name: 'surface gravity', q: 'accel', unit: 'm/s²', tex: 'g' },
        M: { name: 'mass', q: 'mass', unit: 'M☉', value: 1.4 },
        R: { name: 'radius', q: 'length', unit: 'km', value: 12 },
        G: { const: 'G' }
      },
      note: 'Newtonian estimate; for neutron stars general relativity corrects it by tens of per cent.',
      stories: {
        gs: 'What is the surface gravity of a compact star of mass {M} and radius {R}?'
      }
    },
    {
      name: 'Spin-up by collapse (angular momentum conserved)',
      expr: 'P2 = P1*(R2/R1)^2', tex: 'P_2 = P_1\\left(\\frac{R_2}{R_1}\\right)^2',
      vars: {
        P2: { name: 'rotation period after collapse', q: 'time', unit: 'ms' },
        P1: { name: 'rotation period before collapse', q: 'time', unit: 'min', value: 30 },
        R1: { name: 'radius before collapse', q: 'length', unit: 'km', value: 7000 },
        R2: { name: 'radius after collapse', q: 'length', unit: 'km', value: 12 }
      },
      note: 'Treats the core as a uniform sphere keeping its mass and angular momentum, $I\\omega$ with $I \\propto MR^2$.',
      stories: {
        P2: 'A stellar core of radius {R1}, turning once every {P1}, collapses to a neutron star of radius {R2}. What is its new rotation period?',
        R2: 'A core of radius {R1} rotating every {P1} collapses and ends up rotating every {P2}. What is its final radius?'
      }
    }
  ],
  examples: [
    {
      title: 'A neutron star by the numbers',
      q: 'A neutron star has 1.4 solar masses and a radius of 12 km. Find its mean density, surface gravity and escape velocity.',
      steps: [
        '$M = 1.4 \\times 1.99\\times10^{30} = 2.78\\times10^{30}$ kg; volume $\\tfrac43\\pi(1.2\\times10^{4})^3 = 7.24\\times10^{12}\\ \\mathrm{m^3}$.',
        'Density: $2.78\\times10^{30}/7.24\\times10^{12} = 3.8\\times10^{17}\\ \\mathrm{kg/m^3}$ — about nuclear density.',
        'Gravity: $g = GM/R^2 = 6.67\\times10^{-11} \\times 2.78\\times10^{30}/(1.2\\times10^{4})^2 = 1.3\\times10^{12}\\ \\mathrm{m/s^2}$.',
        'Escape velocity: $\\sqrt{2GM/R} = 1.8\\times10^{8}$ m/s, about $0.6c$.'
      ],
      a: '3.8 × 10¹⁷ kg/m³, 1.3 × 10¹² m/s², escape velocity ≈ 0.6c.'
    },
    {
      title: 'Spinning up',
      q: 'A stellar core 7000 km in radius rotating once every 30 minutes collapses to a neutron star 12 km in radius. What is the new period?',
      steps: [
        'Angular momentum $I\\omega \\propto MR^2/P$ is conserved, so $P_2 = P_1 (R_2/R_1)^2$.',
        '$(12/7000)^2 = 2.94\\times10^{-6}$, and $P_1 = 1800$ s.',
        '$P_2 = 1800 \\times 2.94\\times10^{-6} = 5.3\\times10^{-3}$ s: almost 200 turns a second.'
      ],
      a: 'About 5 ms.'
    }
  ],
  quiz: [
    { q: 'What holds up a white dwarf against gravity?', choices: ['Heat from fusion', 'Electron degeneracy pressure, from the exclusion principle', 'Magnetic fields', 'Its rapid rotation'], a: 1,
      why: 'Electrons forced into high-momentum states resist further compression, whatever the temperature.' },
    { q: 'Adding mass to a white dwarf makes it…', choices: ['larger', 'smaller', 'the same size but hotter', 'the same size'], a: 1,
      why: 'More mass must be supported by more tightly packed electrons, so the radius shrinks, roughly as $M^{-1/3}$.' },
    { q: 'Why do newborn neutron stars spin so fast?', choices: ['The supernova explosion spins them up', 'Angular momentum is conserved while the core shrinks enormously', 'Their magnetic fields drive them round', 'Infalling matter keeps hitting them'], a: 1,
      why: 'Shrinking the radius by a factor of hundreds speeds the rotation up by that factor squared, like a skater pulling in her arms.' },
    { q: 'A white dwarf of 2 solar masses could exist if it were cold enough.', a: false,
      why: 'The Chandrasekhar limit of about 1.4 solar masses does not depend on temperature: above it degeneracy pressure cannot win.' }
  ],
  applications: [
    'Type Ia supernovae from exploding white dwarfs, used as standard candles.',
    'Pulsar timing: natural clocks for testing relativity and detecting gravitational waves.',
    'Neutron-star mergers as the forges of gold, platinum and other heavy elements.'
  ],
  history: 'Sirius B was seen in 1862 and found to be tiny and dense in the 1910s. Ralph Fowler explained white dwarfs with electron degeneracy in 1926; Chandrasekhar found the mass limit in 1930. Walter Baade and Fritz Zwicky proposed neutron stars in 1934, and Jocelyn Bell Burnell and Antony Hewish discovered pulsars in 1967.'
}

);
