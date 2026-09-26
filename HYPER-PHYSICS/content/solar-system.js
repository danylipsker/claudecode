/* HYPER-PHYSICS · content/solar-system.js — the Sun and planets: our star, the eight
 * planets, and the sunlight that sets their temperatures. */
Hyper.add(

{
  id: 'the-sun', parent: 'solar-system', title: 'The Sun', level: 1,
  short: 'Our star: a ball of hot hydrogen and helium held together by its own gravity and powered by nuclear fusion in its core.',
  keywords: ['Sun', 'solar', 'photosphere', 'corona', 'sunspots', 'solar cycle', 'proton–proton chain', 'hydrostatic equilibrium', 'solar wind', 'neutrinos', 'luminosity'],
  prereq: ['fusion', 'thermal-radiation', 'mass-energy'],
  related: ['solar-constant', 'stellar-spectra', 'stellar-evolution', 'hr-diagram'],
  body: `
The Sun is an ordinary star — middle-aged and middle-sized — that happens to be close enough to study in detail. It holds 99.86% of the mass of the solar system, and its light, reaching us after 8 minutes 19 seconds, drives almost everything that happens on the Earth.

### The Sun in numbers
| Property | Value |
|---|---|
| Mass | $1.989\\times10^{30}$ kg (333 000 Earths) |
| Radius | 696 000 km (109 Earths) |
| Mean density | 1.41 g/cm³ |
| Luminosity | $3.83\\times10^{26}$ W |
| Surface (effective) temperature | 5772 K |
| Core temperature and density | 15.7 million K, 150 g/cm³ |
| Composition by mass | 73% hydrogen, 25% helium, 2% heavier elements |
| Age | 4.6 billion years |

### Where the energy comes from
Deep in the core, protons fuse into helium through the **proton–proton chain**: in several steps, four hydrogen nuclei become one helium-4 nucleus, two positrons and two neutrinos. The helium is 0.7% lighter than the four protons, and the missing mass appears as 26.7 MeV of energy ([[mass-energy|$E = mc^2$]], [[fusion|nuclear fusion]]). To supply its luminosity the Sun fuses about 600 million tonnes of hydrogen every second and loses more than four million tonnes of mass as radiation. Enormous as that sounds, it has lost only about 0.03% of its mass in its whole life so far.

The Sun is stable because it regulates itself. Gravity pulls every layer inwards and the pressure of the hot gas pushes outwards: **hydrostatic equilibrium**. If the core ran a little too hot, it would expand, cool and slow its fusion; if too cool, it would contract, heat up and speed it up again.

### From the core to the surface
- **Core** (out to a quarter of the radius): the fusion furnace.
- **Radiative zone** (to 70% of the radius): energy travels outwards as light, absorbed and re-emitted countless times; a photon's random walk out of it takes of the order of 100 000 years.
- **Convective zone**: the gas boils. Hot plumes rise and cooler gas sinks, appearing on the surface as granules the size of a country.
- **Photosphere**: the visible "surface", a layer a few hundred kilometres thick from which light escapes into space. Its spectrum is close to that of a 5772 K [[blackbody-radiation|blackbody]], crossed by dark absorption lines ([[stellar-spectra|stellar spectra]]).
- **Chromosphere and corona**: thin outer layers seen during total eclipses. Puzzlingly, the corona is far hotter than the surface — one to three million kelvin — and it streams away as the **solar wind**, about a million tonnes a second at around 400 km/s.

### A magnetic star
**Sunspots** are regions where strong magnetic fields hold back convection; at around 4000 K they look dark against the hotter surface, though they are still brilliant on their own. Their number rises and falls in an **11-year cycle**, together with flares and coronal mass ejections that drive space weather: aurorae, and occasional damage to satellites and power grids.

> [!fact] Every second about 65 billion neutrinos from the Sun's core pass through each square centimetre of your body — by night as well as by day, since they cross the Earth almost untouched. Catching a few of them confirmed that fusion powers the Sun.
`,
  ideas: [
    'The Sun is a typical star: 2 × 10³⁰ kg of mostly hydrogen and helium, 5772 K at the surface.',
    'Fusion of hydrogen into helium in the core releases 0.7% of the mass as energy.',
    'Hydrostatic equilibrium — gravity balanced by gas pressure — keeps it stable and self-regulating.',
    'Energy crosses a radiative zone, then a convective zone, and escapes from the photosphere.',
    'Its magnetic activity follows an 11-year cycle of sunspots, flares and eruptions.'
  ],
  pitfalls: [
    'The Sun is burning like a fire — Chemical burning would have exhausted it in a few thousand years. It shines by nuclear fusion, which releases tens of millions of times more energy per kilogram.',
    'Sunspots are cold, dark holes — They are about 4000 K, hotter than any flame on Earth; they only look dark next to the 5772 K surface.',
    'The Sun is yellow — Above the atmosphere it is white; its spectrum peaks in the green but contains all colours. Air scatters away some blue, which makes it look yellowish, especially low in the sky.'
  ],
  formulas: [
    {
      name: 'Luminosity from radius and surface temperature',
      expr: 'L = 4*pi*R^2*sigma*T^4', tex: 'L = 4\\pi R^2 \\sigma T^4',
      vars: {
        L: { name: 'luminosity', q: 'power', unit: 'W' },
        R: { name: 'radius', q: 'length', unit: 'R☉', value: 1 },
        T: { name: 'surface (effective) temperature', q: 'temperature', unit: 'K', value: 5772 },
        sigma: { const: 'sigma' }
      },
      note: 'Treats the surface as a blackbody. The Sun\'s effective temperature of 5772 K is defined so that this gives its measured luminosity.',
      stories: {
        L: 'A star has radius {R} and surface temperature {T}. What is its luminosity?',
        T: 'A star of radius {R} has luminosity {L}. What is its surface temperature?',
        R: 'A star with surface temperature {T} has luminosity {L}. What is its radius?'
      }
    },
    {
      name: 'Rate of hydrogen fusion needed for a luminosity',
      expr: 'mH = L/(f*c^2)', tex: '\\dot m_H = \\frac{L}{f\\, c^2}',
      vars: {
        mH: { name: 'mass of hydrogen fused per second', q: 'massflow', unit: 'kg/s', tex: '\\dot m_H' },
        L: { name: 'luminosity', q: 'power', unit: 'L☉', value: 1 },
        f: { name: 'fraction of the mass released as energy', q: 'ratio', unit: '%', value: 0.7 },
        c: { const: 'c' }
      },
      note: 'For hydrogen fusing to helium $f = 0.7\\%$. The mass actually lost is $f$ times this: $L/c^2$.',
      stories: {
        mH: 'A star shines with luminosity {L} by fusing hydrogen, which releases {f} of its mass as energy. How much hydrogen does it fuse each second?',
        L: 'A star fuses {mH} of hydrogen, releasing {f} of the mass as energy. What is its luminosity?'
      }
    }
  ],
  examples: [
    {
      title: 'Checking the Sun\'s luminosity',
      q: 'The Sun\'s radius is $6.96\\times10^{8}$ m and its surface temperature 5772 K. What luminosity does the Stefan–Boltzmann law give?',
      steps: [
        'Surface area: $4\\pi R^2 = 4\\pi(6.96\\times10^{8})^2 = 6.09\\times10^{18}\\ \\mathrm{m^2}$.',
        'Each square metre radiates $\\sigma T^4 = 5.67\\times10^{-8} \\times 5772^4 = 6.29\\times10^{7}$ W — 63 megawatts.',
        '$L = 6.09\\times10^{18} \\times 6.29\\times10^{7} = 3.83\\times10^{26}$ W.'
      ],
      a: '3.83 × 10²⁶ W'
    },
    {
      title: 'How much has the Sun lost?',
      q: 'The Sun loses mass at $L/c^2$. How much has it lost in 4.6 billion years?',
      steps: [
        '$\\dot m = \\dfrac{3.83\\times10^{26}}{(3.00\\times10^{8})^2} = 4.26\\times10^{9}$ kg/s.',
        '$4.6\\times10^{9}$ years $= 1.45\\times10^{17}$ s, so the loss is $6.2\\times10^{26}$ kg.',
        'That is about a hundred Earth masses, but only 0.03% of the Sun.'
      ],
      a: 'About 6 × 10²⁶ kg — 0.03% of its mass.'
    }
  ],
  quiz: [
    { q: 'The Sun produces its energy by…', choices: ['burning hydrogen with oxygen', 'nuclear fusion of hydrogen into helium', 'nuclear fission of uranium', 'slowly shrinking under its own gravity'], a: 1,
      why: 'Only fusion releases enough energy per kilogram to keep the Sun shining for billions of years.' },
    { q: 'Sunspots look dark because they are…', choices: ['holes through which we see the cooler interior', 'about 1500 K cooler than the surrounding surface', 'clouds of dust above the surface', 'shadows of planets'], a: 1,
      why: 'Magnetic fields suppress the convection that brings up heat, so the spots are cooler — and by $\\sigma T^4$ much fainter — than their surroundings.' },
    { q: 'If the Sun\'s core became slightly too hot, its fusion rate would soon…', choices: ['run away in an explosion', 'fall back as the core expands and cools', 'stop altogether', 'stay unchanged'], a: 1,
      why: 'Hot gas pushes the core outwards; the expansion cools it and slows the temperature-sensitive fusion — a natural thermostat.' },
    { q: 'The Sun loses more than four million tonnes of mass every second.', a: true,
      why: '$L/c^2 = 3.83\\times10^{26}/(9.0\\times10^{16}) = 4.3\\times10^{9}$ kg/s.' }
  ],
  applications: [
    'Solar power and the Earth\'s climate, both set by the Sun\'s output.',
    'Space-weather forecasting to protect satellites, astronauts and power grids.',
    'Helioseismology: reading the Sun\'s interior from the oscillations of its surface.'
  ],
  history: 'In the 19th century nobody could explain how the Sun had shone for the ages geology required. Arthur Eddington suggested in 1920 that it fuses hydrogen into helium, and Hans Bethe worked out the reactions in 1938–39. Solar neutrinos, first detected by Raymond Davis in the late 1960s, confirmed it.',
  sim: { id: 'ra-hr', params: { pick: 'Sun' } }
},

{
  id: 'planets', parent: 'solar-system', title: 'The planets', level: 1,
  short: 'Eight worlds orbiting the Sun: four small rocky planets close in, four giants of gas and ice farther out, all obeying Kepler\'s laws.',
  keywords: ['planets', 'solar system', 'terrestrial planets', 'gas giants', 'ice giants', 'Jupiter', 'Saturn', 'Mars', 'Kepler\'s third law', 'frost line', 'dwarf planet', 'exoplanets'],
  prereq: ['keplers-laws', 'newtons-law-of-gravitation', 'density'],
  related: ['circular-orbits', 'escape-velocity', 'tides', 'solar-constant'],
  body: `
Eight planets orbit the Sun, in two very different families, with a belt of rocky debris between them and a frozen realm beyond.

### Rocky planets and giants
The four inner **terrestrial planets** — Mercury, Venus, Earth and Mars — are small, dense balls of rock and iron with thin atmospheres or none, and few moons. The four outer **giant planets** are huge and light: **Jupiter** and **Saturn** are mostly hydrogen and helium (Saturn's average density is less than that of water), while **Uranus** and **Neptune** are "ice giants", with deep interiors of water, ammonia and methane beneath hydrogen–helium atmospheres. All four giants have rings and large families of moons.

| Planet | Distance $a$ (AU) | Period (years) | Radius ($R_\\oplus$) | Mass ($M_\\oplus$) | Density (g/cm³) |
|---|---|---|---|---|---|
| Mercury | 0.387 | 0.241 | 0.383 | 0.055 | 5.43 |
| Venus | 0.723 | 0.615 | 0.950 | 0.815 | 5.24 |
| Earth | 1.000 | 1.000 | 1.000 | 1.000 | 5.51 |
| Mars | 1.524 | 1.881 | 0.532 | 0.107 | 3.93 |
| Jupiter | 5.20 | 11.86 | 10.97 | 317.8 | 1.33 |
| Saturn | 9.58 | 29.5 | 9.14 | 95.2 | 0.69 |
| Uranus | 19.2 | 84.0 | 3.98 | 14.5 | 1.27 |
| Neptune | 30.1 | 164.8 | 3.86 | 17.1 | 1.64 |

### Why two families?
The planets formed 4.6 billion years ago in a disc of gas and dust around the young Sun. Close in, it was too warm for water to freeze, so only rock and metal could condense — and there is not much of those, so the inner planets stayed small. Beyond the **frost line**, roughly 3 AU out, water ice was plentiful as well; the growing cores reached about ten Earth masses, enough to pull in the surrounding hydrogen and helium, and ballooned into giants.

### Kepler's third law
The first two columns of the table obey a simple rule: the square of the period is proportional to the cube of the distance, $T^2 \\propto a^3$. In years and astronomical units, $T = a^{3/2}$: Jupiter at 5.2 AU takes $5.2^{1.5} = 11.9$ years. Newton showed where it comes from ([[keplers-laws|Kepler's laws]], [[circular-orbits|circular orbits]]):

$$T = 2\\pi\\sqrt{\\frac{a^3}{G M}}$$

where $M$ is the mass of the central body. The same law holds for moons round planets and planets round other stars — which is how astronomers weigh them.

### Weight on other worlds
A planet's surface gravity $g = GM/R^2$ depends on its mass and radius ([[gravitational-field|gravitational field]]). Mars, with a tenth of the Earth's mass and half its radius, has $g = 3.7\\ \\mathrm{m/s^2}$; Jupiter's cloud tops have $24.8\\ \\mathrm{m/s^2}$; Saturn, despite 95 Earth masses, only $10.4\\ \\mathrm{m/s^2}$, because it is so large.

### Beyond the planets
Between Mars and Jupiter lies the asteroid belt, whose largest member, Ceres, is a dwarf planet. Beyond Neptune, the Kuiper belt holds Pluto (reclassified as a dwarf planet in 2006) and thousands of other icy bodies, and much farther out the Oort cloud is thought to hold trillions of comets. Around other stars, more than six thousand planets have been found — including many "hot Jupiters" and "super-Earths" with no counterpart in our own system.
`,
  ideas: [
    'The inner planets are small, dense and rocky; the outer ones are giants of gas and ice.',
    'The split comes from the frost line in the disc the planets formed from.',
    'Kepler\'s third law: T² ∝ a³, or T (years) = a (AU)^1.5 around the Sun.',
    'Orbits weigh the central body: T = 2π√(a³/GM).',
    'Surface gravity g = GM/R² depends on both mass and radius.'
  ],
  pitfalls: [
    'Bigger planets always have much stronger surface gravity — Radius matters as much as mass: Saturn\'s 95 Earth masses give only 1.07 g at its enormous radius.',
    'T² = a³ works for any orbit in years and AU — Only around a body of one solar mass. For moons of Jupiter or planets of other stars, include the central mass.',
    'The giant planets are just big balls of gas with no interior — Their gas becomes denser with depth and turns liquid, even metallic, around a dense core.'
  ],
  formulas: [
    {
      name: 'Kepler\'s third law',
      expr: 'T = 2*pi*sqrt(a^3/(G*M))', tex: 'T = 2\\pi\\sqrt{\\frac{a^3}{G M}}',
      vars: {
        T: { name: 'orbital period', q: 'time', unit: 'yr' },
        a: { name: 'orbital radius (semi-major axis)', q: 'length', unit: 'AU', value: 5.2 },
        M: { name: 'mass of the central body', q: 'mass', unit: 'M☉', value: 1 },
        G: { const: 'G' }
      },
      note: 'Assumes the orbiting body is much lighter than the central one.',
      stories: {
        T: 'A planet orbits a star of mass {M} at {a}. How long is its year?',
        a: 'A planet round a star of mass {M} has a period of {T}. How far from the star is it?',
        M: 'A planet orbits a star at {a} with period {T}. What is the mass of the star?'
      }
    },
    {
      name: 'Surface gravity',
      expr: 'gs = G*M/R^2', tex: 'g = \\frac{G M}{R^2}',
      vars: {
        gs: { name: 'surface gravity', q: 'accel', unit: 'm/s²', tex: 'g' },
        M: { name: 'mass of the planet', q: 'mass', unit: 'M⊕', value: 0.107 },
        R: { name: 'radius of the planet', q: 'length', unit: 'km', value: 3390 },
        G: { const: 'G' }
      },
      stories: {
        gs: 'A planet has mass {M} and radius {R}. What is the gravitational acceleration at its surface?',
        M: 'On a planet of radius {R} a dropped stone accelerates at {gs}. What is the planet\'s mass?'
      }
    },
    {
      name: 'Mean density',
      expr: 'rho = 3*M/(4*pi*R^3)', tex: '\\rho = \\frac{3M}{4\\pi R^3}',
      vars: {
        rho: { name: 'mean density', q: 'density', unit: 'g/cm³', tex: '\\rho' },
        M: { name: 'mass', q: 'mass', unit: 'M⊕', value: 95.2 },
        R: { name: 'radius', q: 'length', unit: 'km', value: 58232 }
      },
      stories: {
        rho: 'A planet has mass {M} and radius {R}. What is its mean density?',
        R: 'A planet of mass {M} has mean density {rho}. What is its radius?'
      }
    }
  ],
  examples: [
    {
      title: 'Weighing Jupiter with a moon',
      q: 'Jupiter\'s moon Io orbits at 421 700 km with a period of 1.769 days. What is Jupiter\'s mass?',
      steps: [
        'Rearrange Kepler\'s third law: $M = \\dfrac{4\\pi^2 a^3}{G T^2}$.',
        '$a = 4.217\\times10^{8}$ m, so $a^3 = 7.50\\times10^{25}\\ \\mathrm{m^3}$; $T = 1.769 \\times 86\\,400 = 1.528\\times10^{5}$ s.',
        '$M = \\dfrac{39.48 \\times 7.50\\times10^{25}}{6.674\\times10^{-11} \\times (1.528\\times10^{5})^2} = 1.90\\times10^{27}$ kg.',
        'That is 318 Earth masses — more than twice all the other planets combined.'
      ],
      a: '1.9 × 10²⁷ kg'
    },
    {
      title: 'A year on Mars',
      q: 'Mars orbits at 1.524 AU. How long is its year?',
      steps: [
        'Around the Sun, $T = a^{3/2}$ in years and AU.',
        '$T = 1.524^{1.5} = 1.524 \\times \\sqrt{1.524} = 1.524 \\times 1.2345 = 1.881$ years, or 687 days.'
      ],
      a: '1.88 years (687 days)'
    }
  ],
  quiz: [
    { q: 'A planet orbits the Sun at 4 AU. Its period is…', choices: ['2 years', '4 years', '8 years', '16 years'], a: 2,
      why: '$T = 4^{3/2} = 8$ years.' },
    { q: 'Why are the inner planets small and rocky?', choices: ['The Sun\'s gravity squashed them', 'Close to the Sun it was too warm for ices to condense, leaving only scarce rock and metal', 'They lost their gas in collisions with the giants', 'They formed later than the giants'], a: 1,
      why: 'Inside the frost line only refractory material could condense, and there was too little of it to build cores big enough to capture gas.' },
    { q: 'Saturn has 95 times the Earth\'s mass. Why is its surface gravity only slightly larger than ours?', choices: ['Its rings cancel part of it', 'Its radius is about 9 times the Earth\'s, and g falls as 1/R²', 'It spins too fast', 'Gravity is weaker far from the Sun'], a: 1,
      why: '$95/9.14^2 \\approx 1.1$: the huge radius almost cancels the huge mass. (At the cloud tops of the equator, where Saturn is widest and spins fastest, it is 1.07 g.)' },
    { q: 'In years and AU, T² = a³ also holds for the moons of Jupiter.', a: false,
      why: 'The constant in Kepler\'s third law depends on the central mass. Around Jupiter, a thousand times lighter than the Sun, the periods are much longer for the same distance.' }
  ],
  applications: [
    'Weighing planets, stars and galaxies from the orbits around them.',
    'Planning spacecraft trajectories to other planets.',
    'Interpreting exoplanet discoveries by comparison with our own system.'
  ],
  history: 'Johannes Kepler found his third law in 1619 from Tycho Brahe\'s observations; Newton derived it from gravity in 1687. Uranus was discovered by William Herschel in 1781, and Neptune in 1846 after Urbain Le Verrier predicted its position from the tug it gave Uranus.'
},

{
  id: 'solar-constant', parent: 'solar-system', title: 'Solar energy and planetary temperature', level: 2,
  short: 'Sunlight arrives at the Earth at about 1361 W/m²; balancing the sunlight a planet absorbs against the heat it radiates gives its temperature.',
  keywords: ['solar constant', 'total solar irradiance', 'albedo', 'equilibrium temperature', 'greenhouse effect', 'radiative balance', 'insolation', 'habitable zone', 'solar power'],
  prereq: ['light-intensity', 'thermal-radiation', 'the-sun'],
  related: ['planets', 'blackbody-radiation', 'em-wave-energy', 'radiation-pressure'],
  body: `
Above the atmosphere, every square metre facing the Sun at the Earth's distance receives about 1361 W — the **solar constant** $S$. It follows from the Sun's luminosity spread over a sphere as large as the Earth's orbit ([[light-intensity|the inverse-square law]]):

$$S = \\frac{L_\\odot}{4\\pi d^2} = \\frac{3.83\\times10^{26}\\ \\mathrm{W}}{4\\pi\\,(1.496\\times10^{11}\\ \\mathrm{m})^2} = 1361\\ \\mathrm{W/m^2}$$

Despite its name it varies a little: by about 0.1% over the 11-year sunspot cycle, and by ±3.4% over the year because the Earth's orbit is slightly elliptical (we are closest to the Sun in early January). At Mars it is 590 W/m², at Jupiter only 50 W/m².

### How much does a planet absorb?
A planet of radius $R$ intercepts sunlight over its cross-section, a disc of area $\\pi R^2$, but it radiates heat from its whole surface, $4\\pi R^2$ — four times the area. Averaged over day and night and over the globe, each square metre of the Earth receives $S/4 = 340\\ \\mathrm{W/m^2}$. Part is reflected straight back into space; the fraction reflected is the **albedo** $A$: about 0.30 for the Earth (clouds, ice, oceans), 0.76 for cloud-wrapped Venus, 0.12 for the dark Moon.

### The equilibrium temperature
A planet settles at the temperature at which it radiates as much as it absorbs. Treating it as a [[thermal-radiation|blackbody]] radiating $\\sigma T^4$ from every square metre,

$$\\sigma T^4 = \\frac{S\\,(1 - A)}{4}$$

For the Earth, $S(1 - A)/4 = 238\\ \\mathrm{W/m^2}$, giving $T = 255$ K, or $-18$ °C. The real average surface temperature is about 288 K ($+15$ °C). The 33-degree difference is the **greenhouse effect**: water vapour, carbon dioxide and other gases absorb the infrared radiation from the ground and send part of it back down, so the surface must be warmer to push the same 238 W/m² out to space. More greenhouse gas means a warmer surface.

| Planet | Equilibrium temperature | Actual mean surface temperature |
|---|---|---|
| Venus | 230 K | 737 K — a runaway greenhouse |
| Earth | 255 K | 288 K |
| Mars | 210 K | about 210 K — a very thin atmosphere |

Written in terms of the star itself, the equilibrium temperature is

$$T = T_\\star\\sqrt{\\frac{R_\\star}{2d}}\\,(1 - A)^{1/4}$$

which astronomers use to judge whether a planet around another star could have liquid water on its surface.

> [!note] Solar panels see less than 1361 W/m²: the atmosphere absorbs and scatters part of the light, leaving about 1000 W/m² at noon on a clear day. With 20% efficient cells, a square metre of panel gives about 200 W in full sun.
`,
  ideas: [
    'The solar constant is the Sun\'s luminosity spread over a sphere of radius 1 AU: about 1361 W/m².',
    'Sunlight falls off as 1/d² with distance from the Sun.',
    'A planet absorbs over a disc (πR²) but radiates from a sphere (4πR²), hence the factor 1/4.',
    'Balancing absorbed sunlight against σT⁴ gives the equilibrium temperature: 255 K for the Earth.',
    'The greenhouse effect raises the Earth\'s surface 33 K above that.'
  ],
  pitfalls: [
    'The Earth is warmer in (northern) summer because it is closer to the Sun — It is closest in January. Seasons come from the tilt of the axis, which changes how high the Sun climbs and how long it shines.',
    'The greenhouse effect traps heat so that the Earth radiates less energy overall — In balance, the Earth radiates exactly what it absorbs; the greenhouse gases make the surface warmer so that this balance is reached from higher, colder layers.',
    'A planet\'s temperature depends only on its distance from the Sun — Albedo and atmosphere matter hugely: Venus is hotter than Mercury despite being twice as far out.'
  ],
  formulas: [
    {
      name: 'Solar constant at a distance',
      expr: 'S = L/(4*pi*d^2)', tex: 'S = \\frac{L}{4\\pi d^2}',
      vars: {
        S: { name: 'intensity of sunlight (solar constant)', q: 'intensity', unit: 'W/m²' },
        L: { name: 'luminosity of the star', q: 'power', unit: 'L☉', value: 1 },
        d: { name: 'distance from the star', q: 'length', unit: 'AU', value: 1 }
      },
      stories: {
        S: 'How intense is the sunlight at {d} from a star of luminosity {L}?',
        d: 'At what distance from a star of luminosity {L} does starlight have the Earth\'s intensity of {S}?'
      }
    },
    {
      name: 'Equilibrium temperature of a planet',
      expr: 'sigma*T^4 = S*(1 - A)/4', tex: '\\sigma T^4 = \\frac{S\\,(1 - A)}{4}', solveFor: 'T',
      vars: {
        T: { name: 'equilibrium temperature', q: 'temperature', unit: 'K' },
        S: { name: 'intensity of sunlight at the planet', q: 'intensity', unit: 'W/m²', value: 1361 },
        A: { name: 'albedo (fraction reflected)', value: 0.3, min: 0, max: 1 },
        sigma: { const: 'sigma' }
      },
      note: 'For a fast-rotating planet that spreads its heat evenly and radiates like a blackbody. Atmospheres raise the surface temperature above this value.',
      stories: {
        T: 'Sunlight reaches a planet at {S} and the planet reflects a fraction {A}. What is its equilibrium temperature?',
        A: 'A planet receiving {S} of sunlight has an equilibrium temperature of {T}. What is its albedo?'
      }
    },
    {
      name: 'Equilibrium temperature from the star',
      expr: 'T = Ts*sqrt(Rs/(2*d))*(1 - A)^(1/4)', tex: 'T = T_\\star\\sqrt{\\frac{R_\\star}{2d}}\\,(1 - A)^{1/4}',
      vars: {
        T: { name: 'equilibrium temperature of the planet', q: 'temperature', unit: 'K' },
        Ts: { name: 'surface temperature of the star', q: 'temperature', unit: 'K', value: 5772, tex: 'T_\\star' },
        Rs: { name: 'radius of the star', q: 'length', unit: 'R☉', value: 1, tex: 'R_\\star' },
        d: { name: 'distance from the star', q: 'length', unit: 'AU', value: 1 },
        A: { name: 'albedo', value: 0.3, min: 0, max: 1 }
      },
      note: 'Follows from the two formulas above with $L = 4\\pi R_\\star^2 \\sigma T_\\star^4$.',
      stories: {
        T: 'A planet with albedo {A} orbits {d} from a star of radius {Rs} and surface temperature {Ts}. What is its equilibrium temperature?',
        d: 'How far from a star of radius {Rs} and temperature {Ts} must a planet with albedo {A} orbit to have an equilibrium temperature of {T}?'
      }
    }
  ],
  examples: [
    {
      title: 'The Earth without a greenhouse',
      q: 'With $S = 1361\\ \\mathrm{W/m^2}$ and albedo 0.30, what is the Earth\'s equilibrium temperature?',
      steps: [
        'Absorbed per square metre of surface, on average: $S(1 - A)/4 = 1361 \\times 0.70/4 = 238\\ \\mathrm{W/m^2}$.',
        '$T^4 = 238/(5.67\\times10^{-8}) = 4.20\\times10^{9}\\ \\mathrm{K^4}$, so $T = 255$ K.',
        'That is $-18$ °C, 33 K below the real average of 288 K: the difference is the greenhouse effect.'
      ],
      a: '255 K (−18 °C)'
    },
    {
      title: 'Sunlight on Mars',
      q: 'Mars is 1.524 AU from the Sun and has an albedo of 0.25. Find the solar constant there and its equilibrium temperature.',
      steps: [
        '$S = 1361/1.524^2 = 1361/2.323 = 586\\ \\mathrm{W/m^2}$.',
        '$S(1 - A)/4 = 586 \\times 0.75/4 = 110\\ \\mathrm{W/m^2}$.',
        '$T = (110/5.67\\times10^{-8})^{1/4} = 210$ K — close to the measured average, since the thin atmosphere adds little greenhouse warming.'
      ],
      a: '586 W/m², 210 K'
    }
  ],
  quiz: [
    { q: 'Mars is 1.52 AU from the Sun. The solar constant there is about…', choices: ['2070 W/m²', '895 W/m²', '590 W/m²', '1361 W/m²'], a: 2,
      why: 'Divide by the distance squared: $1361/1.52^2 \\approx 590$ W/m².' },
    { q: 'Why is the solar constant divided by 4 when finding a planet\'s average temperature?', choices: ['Only a quarter of sunlight gets through the atmosphere', 'The planet intercepts light over a disc (πR²) but radiates from a sphere (4πR²)', 'The Sun shines on any place only a quarter of the time', 'Because of the albedo'], a: 1,
      why: 'The ratio of the areas of a sphere and of its cross-section is exactly 4.' },
    { q: 'The Earth\'s equilibrium temperature is 255 K, yet its surface averages 288 K. The difference is due to…', choices: ['heat flowing out of the Earth\'s core', 'the greenhouse effect of the atmosphere', 'the albedo of clouds', 'the Earth being closer to the Sun than 1 AU'], a: 1,
      why: 'Greenhouse gases absorb and re-emit infrared, warming the surface. Heat from the core is only about 0.1 W/m², negligible by comparison.' },
    { q: 'If a planet\'s albedo increases, its equilibrium temperature falls.', a: true,
      why: 'It absorbs a smaller fraction $(1 - A)$ of the sunlight, so it balances at a lower $T$.' }
  ],
  applications: [
    'Designing solar panels and estimating their output.',
    'Climate science: the Earth\'s energy balance and the greenhouse effect.',
    'Judging which exoplanets lie in the "habitable zone" where liquid water could exist.'
  ],
  history: 'Claude Pouillet made the first reasonable measurement of the solar constant in 1838. Joseph Fourier (1820s) realised that the atmosphere keeps the Earth warmer than it would otherwise be; John Tyndall measured the infrared absorption of water vapour and carbon dioxide in 1859; and Svante Arrhenius estimated in 1896 how doubling carbon dioxide would warm the planet.'
}

);
