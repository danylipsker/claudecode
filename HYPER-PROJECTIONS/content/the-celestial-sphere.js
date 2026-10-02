/* HYPER-PROJECTIONS · content/the-celestial-sphere.js — the topic "The celestial sphere".
 *
 *   celestial-sphere                    the sphere of directions with the observer at the centre
 *   (horizon-coordinates is written in content/reference.js)
 *   equatorial-coordinates              right ascension and declination
 *   ecliptic-and-galactic-coordinates   the Sun's system and the Milky Way's
 *   sidereal-time-and-hour-angle        the sky's clock
 *   sky-coordinate-transformations      turning one system into another: the spherical triangle and the rotation matrices
 *   the-suns-path                       the Sun through the year
 *   moon-and-planets-on-the-ecliptic    the zodiacal band
 *   rising-setting-and-circumpolar      what rises, what sets, what never does
 *   precession-and-the-moving-pole      the slow turn of the pole
 * Simulations are in sims/the-celestial-sphere.js, constructions in constructions/the-celestial-sphere.js.
 */
Hyper.add(
{
  id: 'celestial-sphere',
  parent: 'the-celestial-sphere',
  title: 'The celestial sphere',
  level: 1,
  short: `Every object in the sky is a direction, and a direction is a point on a sphere with you at its centre. Charting the sky is mapping that sphere from the inside: the same problem as mapping the Earth, with its poles, equator, great circles and angles.`,
  keywords: ['celestial sphere', 'sky dome', 'direction', 'great circle', 'celestial equator', 'celestial pole', 'zenith', 'meridian', 'angular distance', 'star globe', 'armillary'],
  prereq: ['what-is-a-projection', 'math:angle-measure'],
  related: ['horizon-coordinates', 'equatorial-coordinates', 'armillary-sphere-and-celestial-globe', 'the-all-sky-view', 'stereographic-projection'],
  body: `Look up on a clear night and you cannot tell how far away anything is. The Moon, a planet and a star seem to lie on one great dome, and all that you can say about each is *which way to look*. A direction is a point on a sphere: put a sphere of any radius round your eye and every object in the heavens has a place on it, where the line from you to the object pierces it. That is the **celestial sphere**. It is not a thing in the sky but a way of keeping account of directions, and its radius does not matter, so we draw it as 1.

### What is on it, and what moves
The stars hold fixed places on the sphere relative to one another (the fastest, Barnard's star, drifts 10″ a year, about ten minutes of arc in a lifetime), so the star patterns, the constellations, are like marks painted on its inside. The Earth's daily turn makes the whole sphere seem to rotate once in 23 h 56 min about an axis through the Earth's poles. The axis pierces the sphere at the two **celestial poles**, the north one within a degree of Polaris. Halfway between them is the **celestial equator**, the Earth's equator projected outwards; every star circles parallel to it on its own **daily circle**.

Other circles belong to you. Straight above is the **zenith** and straight below the **nadir**; the great circle 90° from the zenith is the **horizon**; the great circle through the zenith and the poles is the **meridian**, which every star crosses twice a day. And there is the **ecliptic**, the Sun's yearly path, tilted 23.44° to the equator. The Moon and planets keep close to it.

### Great circles and angles
Cut the sphere with a plane through its centre and you get a **great circle**: the equator, the horizon, the meridian and the ecliptic are all great circles. The shortest path between two directions lies along the great circle through them. Distances on the sphere are therefore *angles*: the Sun and the Moon are each about half a degree across; at arm's length a thumb covers about 2°, a fist 10°, a spread hand 20°. The whole sphere holds 41 253 square degrees. Two points of coordinates $(\\alpha_1, \\delta_1)$ and $(\\alpha_2, \\delta_2)$ are separated by
$$\\cos\\theta = \\sin\\delta_1\\sin\\delta_2 + \\cos\\delta_1\\cos\\delta_2\\cos(\\alpha_1 - \\alpha_2),$$
the spherical form of the law of cosines.

### From inside or from outside
We see the sphere from inside; a celestial globe shows it from outside, so every constellation on a globe is a mirror image of the sky. A flat chart must choose, and must also choose how to flatten: the [[stereographic-projection|stereographic projection]] gives the planisphere and the astrolabe, the gnomonic the sundial, the azimuthal equidistant a good polar chart. The rest of this branch treats the sky exactly as the map-maker treats the Earth.

> [!note] The sphere is an idealisation. The stars are so far away that the Earth's whole orbit moves even the nearest by under 0.8″; but the Moon is near enough that two observers on the Earth see it up to a degree apart, and a planet shifts a little too.`,
  ideas: [
    'Every celestial object is a direction, and every direction is a point on a sphere centred on the observer; the radius is irrelevant.',
    'The Earth\'s turn makes the sphere rotate about the celestial poles once in a sidereal day; the stars keep fixed places on it.',
    'The horizon, zenith and meridian belong to the observer; the equator and poles belong to the Earth\'s axis; the ecliptic belongs to the Sun.',
    'Distances on the sphere are angles measured along great circles; the spherical law of cosines gives the angle between two directions.',
    'Flattening the sphere raises the map-maker\'s problem, and the same projections answer it.'
  ],
  pitfalls: [
    'The stars are all at the same distance — They are not; the sphere records only directions. A star may be 4 or 4000 light-years away and sit at the same point.',
    'The celestial equator is a line on the Earth — It is the Earth\'s equator projected outwards to the sphere; it stands high in the south for a northern observer and passes through the east and west points of the horizon.',
    'The sphere turns because the sky turns — The sphere is a bookkeeping device; what really turns is the Earth, which is why the whole pattern moves together and the poles stay fixed.'
  ],
  formulas: [
    {
      name: 'Angular separation of two points of the sky',
      expr: 'cos(sep) = sin(dec1)*sin(dec2) + cos(dec1)*cos(dec2)*cos(dra)',
      tex: '\\cos\\theta = \\sin\\delta_1\\sin\\delta_2 + \\cos\\delta_1\\cos\\delta_2\\cos\\Delta\\alpha',
      vars: {
        sep: { name: 'angular separation', q: 'angle', unit: '°', min: 0, max: 180, tex: '\\theta' },
        dec1: { name: 'declination of the first point', q: 'angle', unit: '°', value: 38.78, signed: true, min: -90, max: 90, tex: '\\delta_1' },
        dec2: { name: 'declination of the second point', q: 'angle', unit: '°', value: 8.87, signed: true, min: -90, max: 90, tex: '\\delta_2' },
        dra: { name: 'difference of right ascension', q: 'angle', unit: '°', value: 18.45, signed: true, min: -180, max: 180, tex: '\\Delta\\alpha' }
      },
      solveFor: 'sep',
      note: 'The values are Vega and Altair, 34.2° apart. Angles are in degrees; a difference of right ascension in hours must be multiplied by 15.'
    },
    {
      name: 'Angular size of a distant object',
      expr: 'theta = 2*atan(D/(2*L))',
      tex: '\\theta = 2\\arctan\\frac{D}{2L}',
      vars: {
        theta: { name: 'angular diameter', q: 'angle', unit: '°', min: 0, max: 180, tex: '\\theta' },
        D: { name: 'true diameter', q: 'length', unit: 'km', value: 3474.8 },
        L: { name: 'distance', q: 'length', unit: 'km', value: 384400 }
      },
      note: 'The Moon at its mean distance subtends 0.52°. For small angles $\\theta \\approx D/L$ in radians.'
    },
    {
      name: 'Speed of a star along its daily circle',
      expr: 'w = 15.0411*cos(dec)',
      tex: 'w = 15.041^{\\circ}/\\mathrm{h}\\cdot\\cos\\delta',
      vars: {
        w: { name: 'angular speed along the daily circle', q: false, unit: '°/h' },
        dec: { name: 'declination', q: 'angle', unit: '°', value: 38.78, signed: true, min: -90, max: 90, tex: '\\delta' }
      },
      note: 'The sphere turns 15.041° in a mean solar hour (360° in a sidereal day); a star near the pole has a small circle and moves slowly across the sky, one on the equator moves fastest.'
    }
  ],
  examples: [
    {
      title: 'How far apart are Vega and Altair?',
      q: 'Vega has right ascension 18 h 36.9 m and declination +38.8°; Altair 19 h 50.8 m and +8.9°. What angle do they subtend at the eye? Is it more or less than a hand span?',
      steps: [
        'Convert the difference of right ascension to degrees: $\\Delta\\alpha = (19.846 - 18.616)\\ \\text{h} \\times 15 = 18.45°$.',
        { text: 'Apply the spherical law of cosines:', tex: '\\cos\\theta = \\sin 38.78°\\sin 8.87° + \\cos 38.78°\\cos 8.87°\\cos 18.45° = 0.0966 + 0.7305 = 0.8271' },
        'So $\\theta = \\arccos 0.8271 = 34.2°$. A spread hand at arm\'s length covers about 20°, so the two stars are not quite two hand-spans apart. Deneb completes the Summer Triangle: Vega–Deneb is 23.8°, Altair–Deneb 38.0°.'
      ],
      a: 'About 34.2°, a little under two hand spans.'
    },
    {
      title: 'The Sun and the Moon: the same size',
      q: 'The Sun is 1.392 million km across at a distance of 149.6 million km. The Moon is 3475 km across at 384 400 km. Compare the angles they cover.',
      steps: [
        { text: 'For the Sun:', tex: '\\theta_\\odot = 2\\arctan\\frac{1.392\\times 10^{6}}{2\\times 1.496\\times 10^{8}} = 0.533°' },
        { text: 'For the Moon:', tex: '\\theta_\\mathrm{M} = 2\\arctan\\frac{3475}{2\\times 384\\,400} = 0.518°' },
        'The two angles differ by 3 %, and because the Moon\'s orbit is slightly elliptical (its distance varies from 357 000 to 406 000 km) its disc is sometimes a little larger than the Sun\'s, sometimes a little smaller: that is the difference between a total and an annular solar eclipse.'
      ],
      a: 'Sun 0.53°, Moon 0.52° on average: practically equal, by coincidence.'
    }
  ],
  quiz: [
    { q: 'Which of these is **not** a great circle of the celestial sphere?', choices: ['the horizon', 'the celestial equator', 'the ecliptic', 'the circle of declination +60°'], a: 3, why: 'A great circle is cut by a plane through the centre. The circle of declination +60° lies in a plane that misses the centre; it is a small circle (a star\'s daily circle).' },
    { q: 'About how many square degrees does the whole celestial sphere contain?', answer: 41253, why: 'The sphere has solid angle $4\\pi$ steradians and one steradian is $(180/\\pi)^2 = 3283$ square degrees, so $4\\pi \\times 3283 \\approx 41\\,253$.' },
    { q: 'A building 20 m wide stands 1 km away. What angle does it cover?', answer: 1.15, unit: '°', why: '$2\\arctan(10/1000) = 1.146°$; for small angles $\\theta \\approx 20/1000$ rad $= 1.15°$.' },
    { q: 'The stars have different distances from us, so the celestial sphere has no single radius.', a: true, why: 'Exactly: the sphere records only directions, so its radius is arbitrary (taken as 1). The nearest star is 4.2 light-years away, the farthest naked-eye ones thousands.' },
    { q: 'You see a globe of the sky and a chart of the sky with the same constellation. Why might one be the mirror image of the other?', choices: ['the globe is older', 'the globe is seen from outside the sphere, the sky from inside', 'the chart is stereographic', 'the Earth turns the other way'], a: 1, why: 'Looking at the outside of a sphere reverses left and right with respect to looking at its inside. Celestial globes show the sky from outside, so their figures are mirrored.' }
  ],
  applications: [
    'Celestial navigation: a sextant measures the angle between a star and the horizon; the navigator works on the celestial sphere to turn it into a position.',
    'Pointing a telescope or a satellite dish: the target is a direction, so every mount turns about two axes.',
    'Planetaria and star-chart software draw the sphere on a dome or a screen; the dome is the celestial sphere made visible.',
    'Photography of the night sky: the picture is a patch of the sphere, and the angles above fix the lens that frames a constellation (a 50 mm lens covers about 40°).',
    'Calendars and clocks: the sphere\'s regular turning and the Sun\'s motion on it are the oldest clocks and calendars.'
  ],
  history: `The Greeks made the sphere a real object. Eudoxus (4th century BC) gave each heavenly body a set of nested spheres; for Aristotle the stars were fixed to the outermost, turning once a day. Hipparchus and Ptolemy kept the geometry and dropped the matter: Ptolemy's *Almagest* opens with the argument that the heavens are spherical and moves at once to angles, chords and arcs. Armillary spheres, rings of brass for the equator, the ecliptic and the meridian, were used in Greece and, independently, in China from the second century BC; celestial globes are known from antiquity (the Farnese Atlas, a Roman marble copy of a Greek work, carries the oldest surviving picture of the Greek constellations on a globe). Copernicus and Tycho Brahe removed the crystal spheres but kept the idea, and every star catalogue since is a list of points on it.`,
  sources: ['Jean Meeus, *Astronomical Algorithms* (2nd ed., 1998), chapter 13.', 'Peter Duffett-Smith and Jonathan Zwart, *Practical Astronomy with your Calculator or Spreadsheet* (4th ed., 2011), the chapters on coordinate systems.', 'James Evans, *The History and Practice of Ancient Astronomy* (1998), chapters 1–3 on the celestial sphere.', 'G. J. Toomer (ed.), *Ptolemy\'s Almagest* (1984), book I.', 'Nick Kanas, *Star Maps: History, Artistry and Cartography* (2nd ed., 2012).'],
  sim: 'cs-sky-turning',
  construction: 'cs-sphere-drawn'
},

{
  id: 'equatorial-coordinates',
  parent: 'the-celestial-sphere',
  title: 'Equatorial coordinates: right ascension and declination',
  level: 1,
  short: `The sky's latitude and longitude: declination north or south of the celestial equator, and right ascension east along the equator from the vernal equinox, counted in hours. Fixed to the stars, so every star has the same pair of numbers for every observer.`,
  keywords: ['right ascension', 'declination', 'equatorial', 'RA', 'Dec', 'vernal equinox', 'first point of Aries', 'J2000', 'epoch', 'star catalogue', 'hour circle'],
  prereq: ['celestial-sphere', 'horizon-coordinates'],
  related: ['sidereal-time-and-hour-angle', 'ecliptic-and-galactic-coordinates', 'polar-star-charts', 'the-planisphere', 'the-astrolabe'],
  body: `The horizon system changes with the time and the place. A catalogue needs numbers that belong to the *star*, the same for everyone and (nearly) the same tomorrow. The answer is to copy the Earth's latitude and longitude onto the sky, using the axis about which the sky turns.

### Declination
The **declination** $\\delta$ is the angle of a point north (+) or south (−) of the celestial equator, from −90° at the south celestial pole to +90° at the north pole. It is the sky's latitude, and a star's daily circle is a parallel of declination. Polaris has $\\delta = +89°\\,15′$, Vega +38°47′, Sirius −16°43′, Acrux −63°06′. The **zenith** has declination equal to the observer's latitude, which is why a star of declination $\\delta$ crosses the meridian at altitude $90° - \\varphi + \\delta$ and why the declination of a star can be found from its highest altitude and one's latitude.

### Right ascension
The sky's longitude is **right ascension** $\\alpha$, measured eastwards along the celestial equator from the **vernal equinox**, the point where the Sun crosses the equator northwards about 20 March. It is counted not in degrees but in **hours, minutes and seconds**, 0 h to 24 h, with 1 h $= 15°$. The reason is practical: the sky turns 15° an hour, so the difference of right ascension of two stars is the time that separates their crossings of the meridian (in sidereal time). Vega at 18 h 37 m comes to the meridian 11 h 52 m after Sirius at 6 h 45 m.

The great circles through the poles are the **hour circles**; the one through a star is its meridian of right ascension.

### Epochs
The vernal equinox moves slowly because of [[precession-and-the-moving-pole|precession]] (50″ a year), and with it the whole grid. A catalogue therefore gives an **epoch**, now almost always J2000.0 (noon on 1 January 2000), and positions for the date are found by adding the precession. For naked-eye work the difference is small, a fraction of a degree in a decade.

### On the page
Plotted on a polar chart centred on the pole, a star at $(\\alpha, \\delta)$ sits at distance $90° - \\delta$ from the centre in the direction $\\alpha$ — the construction below draws the grid with dividers and protractor. Because the grid is fixed to the stars, a *chart* in this system never changes; what a [[the-planisphere|planisphere]] or an [[the-astrolabe|astrolabe]] adds is the movable horizon.

> [!tip] Two landmarks to learn: the Big Dipper's pointer stars lie at right ascension 11 h and declination about +60°, and Orion's belt sits on the celestial equator at about 5 h 35 m. Everything on the celestial equator rises due east and sets due west, whatever the latitude.`,
  ideas: [
    'Declination is the sky\'s latitude (−90° to +90° from the celestial equator); right ascension is its longitude, counted eastwards from the vernal equinox in hours (1 h = 15°).',
    'The coordinates are fixed to the stars, so a star has the same right ascension and declination for every observer and (except for slow precession) at every time.',
    'The difference of right ascension of two stars is the sidereal time between their meridian crossings.',
    'A star of declination δ crosses the meridian at altitude 90° − φ + δ; the zenith has declination equal to the latitude.',
    'Catalogues quote an epoch (J2000.0); positions for another date need a correction for precession.'
  ],
  pitfalls: [
    'Right ascension is an angle in degrees like longitude — Its natural unit is the hour: 1 h of right ascension is 15° of arc, and 24 h is the full circle. Mixing the two is the commonest error in the formulas.',
    'Right ascension is measured from the Greenwich meridian — It is measured from the vernal equinox, a point on the sky, not a place on Earth; the Earth\'s turning plays no part in it.',
    'A star\'s declination is its altitude at noon — It is its altitude on the meridian only when you stand on the equator; elsewhere the altitude is $90° - \\varphi + \\delta$.'
  ],
  formulas: [
    {
      name: 'Right ascension in degrees',
      expr: 'alpha = 15*h',
      tex: '\\alpha = 15\\,h',
      vars: {
        alpha: { name: 'right ascension in degrees', q: false, unit: '°', tex: '\\alpha' },
        h: { name: 'right ascension in hours', q: false, unit: 'h', value: 6.7525, min: 0, max: 24 }
      },
      note: 'Sirius, 6 h 45 m 09 s = 6.7525 h, has α = 101.29°. A minute of right ascension is 15′ of arc, a second 15″.'
    },
    {
      name: 'Declination from the meridian altitude',
      expr: 'dec = hm + phi - pi/2',
      tex: '\\delta = h_{\\mathrm{m}} + \\varphi - 90^{\\circ}',
      vars: {
        dec: { name: 'declination of the star', q: 'angle', unit: '°', signed: true, min: -90, max: 90, tex: '\\delta' },
        hm: { name: 'altitude on the meridian, south of the zenith', q: 'angle', unit: '°', value: 41.2, min: 0, max: 90, tex: 'h_{\\mathrm{m}}' },
        phi: { name: 'latitude of the observer', q: 'angle', unit: '°', value: 32.07, signed: true, min: -90, max: 90, tex: '\\varphi' }
      },
      note: 'For a northern observer and a star that culminates south of the zenith. A star seen at 41.2° at Tel Aviv has declination −16.7°: Sirius.'
    },
    {
      name: 'Sidereal time between two meridian crossings',
      expr: 'dT = (a2 - a1)/15',
      tex: '\\Delta T = \\frac{\\alpha_2 - \\alpha_1}{15^{\\circ}/\\mathrm{h}}',
      vars: {
        dT: { name: 'sidereal time between the crossings', q: false, unit: 'h', tex: '\\Delta T' },
        a1: { name: 'right ascension of the first star', q: false, unit: '°', value: 101.29, min: 0, max: 360, tex: '\\alpha_1' },
        a2: { name: 'right ascension of the second star', q: false, unit: '°', value: 279.24, min: 0, max: 360, tex: '\\alpha_2' }
      },
      note: 'The answer is in sidereal hours, each 0.27 % shorter than a mean solar hour (the sidereal day is 3 min 56 s shorter than the solar day).'
    }
  ],
  examples: [
    {
      title: 'Sirius over Tel Aviv and London',
      q: 'Sirius has right ascension 6 h 45 m 09 s and declination −16°43′. How high does it climb at Tel Aviv (φ = 32.07° N) and at London (51.5° N)? Is it ever overhead?',
      steps: [
        { text: 'The altitude on the meridian is $90° - \\varphi + \\delta$ for a star south of the zenith:', tex: 'h_{\\mathrm{TLV}} = 90° - 32.07° - 16.72° = 41.2°,\\qquad h_{\\mathrm{LON}} = 90° - 51.5° - 16.72° = 21.8°' },
        'The star is overhead only where $\\varphi = \\delta$, i.e. at latitude −16.7°, in Brazil or Zambia; never from Tel Aviv or London.',
        'Its right ascension in degrees is $6.7525 \\times 15 = 101.29°$. The Sun reaches right ascension 18 h 45 m, exactly 12 h from Sirius, around 1 January, so Sirius culminates at midnight at the New Year: the winter star.'
      ],
      a: '41.2° at Tel Aviv, 21.8° at London; never overhead.'
    },
    {
      title: 'Two stars, one clock',
      q: 'Vega (α = 18 h 36.9 m) crosses your meridian at midnight. When does Sirius (6 h 45.1 m) cross the meridian, in sidereal hours after Vega and then by the clock? Can you see both well that night?',
      steps: [
        'The sky turns one hour of right ascension per sidereal hour. The difference is $6.752 - 18.616 = -11.864$ h, and adding a day, $+12.136$ h: Sirius crosses 12.136 sidereal hours after Vega.',
        'By the clock a sidereal hour is 0.99727 of a solar hour, so the delay is $12.136 \\times 0.99727 = 12.10$ h: Sirius crosses at about 12:06 the next day, at midday.',
        'So when Vega is on the meridian Sirius is almost at its lower culmination: from Tel Aviv at an altitude of $\\varphi + \\delta - 90° = -74.6°$, far below the horizon. The two stars are almost opposite on the sphere.'
      ],
      a: 'Sirius crosses 12 h 08 m of sidereal time (12 h 06 m of clock time) after Vega; they are never seen together at their best.'
    }
  ],
  quiz: [
    { q: 'How many degrees of arc is 1 hour of right ascension?', answer: 15, unit: '°', why: '24 hours cover the full circle of 360°, so 1 h is 15°. A minute of right ascension is 15′ and a second 15″.' },
    { q: 'The north celestial pole has declination', choices: ['0°', '+23.44°', '+90°', 'equal to the observer\'s latitude'], a: 2, why: 'Declination is the angle from the celestial equator, so the pole, 90° from it, has declination +90°. It is the pole\'s *altitude* that equals the latitude.' },
    { q: 'Two stars have right ascensions 3 h and 9 h. In sidereal time, how long between their meridian crossings?', choices: ['3 h', '6 h', '9 h', '12 h'], a: 1, why: 'The difference is 6 h of right ascension, and the sky turns 1 h of right ascension per sidereal hour.' },
    { q: 'A star of declination +50° is circumpolar at latitude 45° N.', a: true, why: 'The limit is $90° - \\varphi = 45°$; +50° is above it, so the star\'s daily circle clears the horizon and it never sets.' },
    { q: 'Right ascension is measured eastwards from', choices: ['the Greenwich meridian', 'the observer\'s meridian', 'the vernal equinox', 'the north celestial pole'], a: 2, why: 'From the vernal equinox, the point where the Sun crosses the equator northwards. It is a point on the sky, which is what makes the coordinate independent of place and time.' }
  ],
  applications: [
    'Star catalogues and observatory software: every star, galaxy and satellite is listed by right ascension and declination for an epoch.',
    'Equatorial telescope mounts: one axis is parallel to the Earth\'s axis, so tracking a star needs a single motor turning at the sidereal rate, and setting circles read right ascension and declination directly.',
    'Planispheres, polar charts and astrolabes: all are plots of this grid, with a movable horizon on top.',
    'Photography and astrophotography: long exposures follow the sky by turning the camera about the polar axis; the framing is chosen in right ascension and declination.',
    'Navigation: the nautical almanac tabulates the Sun, Moon, planets and 57 stars in a form from which the navigator takes the declination and the Greenwich hour angle.'
  ],
  history: `Ptolemy's star catalogue, which descends from Hipparchus' lost one of about 130 BC, is written in ecliptic coordinates. Hipparchus' surviving commentary on Aratus describes stars in a way that is already equatorial: by their distance from the celestial pole (the complement of declination) and by the point of the ecliptic that crosses the meridian with them (the equivalent of right ascension). The equatorial grid became the working one with equatorial instruments: armillary spheres with a polar axis were used at the Maragha observatory in the thirteenth century and by Tycho Brahe in the 1580s, whose positions, good to about a minute of arc, gave Kepler the orbit of Mars. Right ascension came to be counted in hours because an observatory's transit circle is read against its sidereal clock.`,
  sources: ['Jean Meeus, *Astronomical Algorithms* (2nd ed., 1998), chapters 7–13.', 'Peter Duffett-Smith and Jonathan Zwart, *Practical Astronomy with your Calculator or Spreadsheet* (4th ed., 2011).', 'James Evans, *The History and Practice of Ancient Astronomy* (1998), the chapter on coordinates and instruments.', 'Nick Kanas, *Star Maps: History, Artistry and Cartography* (2nd ed., 2012).'],
  sim: 'cs-sky-grids',
  construction: 'cs-equatorial-grid'
},

{
  id: 'ecliptic-and-galactic-coordinates',
  parent: 'the-celestial-sphere',
  title: 'Ecliptic and galactic coordinates',
  level: 2,
  short: `Two more grids, each tied to a plane that matters: the ecliptic, the Sun's yearly path, where the Moon and planets travel; and the galactic plane, the Milky Way's equator. Each is the equatorial grid turned by a fixed rotation.`,
  keywords: ['ecliptic', 'ecliptic longitude', 'ecliptic latitude', 'obliquity', 'equinox', 'solstice', 'galactic coordinates', 'galactic centre', 'galactic plane', 'Milky Way', 'zodiac', 'galactic pole'],
  prereq: ['equatorial-coordinates', 'math:trigonometry'],
  related: ['sky-coordinate-transformations', 'the-suns-path', 'moon-and-planets-on-the-ecliptic', 'all-sky-charts', 'precession-and-the-moving-pole'],
  body: `The equatorial grid is tied to the Earth's axis. Two other planes are more natural for some jobs, and each gives a grid with its own pole, equator and zero point.

### The ecliptic system
The **ecliptic** is the great circle along which the Sun appears to move in a year. It is tilted to the celestial equator by the **obliquity** $\\varepsilon = 23.44°$, because the Earth's axis is tilted to its orbit; the two circles cross at the equinoxes, and the points of the ecliptic farthest from the equator are the solstices. In the **ecliptic system** a point has **longitude** $\\lambda$, measured eastwards along the ecliptic from the vernal equinox (0° to 360°), and **latitude** $\\beta$, measured north or south of it (±90°). The ecliptic's north pole K lies in Draco at right ascension 18 h, declination +66.56°, a distance $\\varepsilon$ from the celestial pole.

Why use it? Because the Sun, Moon and planets move near the ecliptic: the Sun has $\\beta = 0$ by definition, the Moon never exceeds $\\beta = 5.3°$ and the planets stay within about 9°. This band is the **zodiac**. For the stars the ecliptic system has a second virtue: precession changes only their longitudes (by 50.3″ a year), never their latitudes, which is why the ancient catalogues of Hipparchus and Ptolemy were written in it.

### The galactic system
Most stars you see belong to the Milky Way, a disc of some 100 000 light-years in which the Sun lies about 26 000 light-years from the centre. Its plane appears as the band of light across the sky. The **galactic system** takes this plane as the equator: **galactic latitude** $b$ is the angle above it and **galactic longitude** $l$ runs along it from the direction of the galactic centre, in Sagittarius ($\\alpha = 17\\,\\mathrm{h}\\,45.7\\,\\mathrm{m}$, $\\delta = -28°\\,56′$). The north galactic pole is at $\\alpha = 12\\,\\mathrm{h}\\,51.4\\,\\mathrm{m}$, $\\delta = +27°\\,08′$ in Coma Berenices, so the plane is inclined **62.87°** to the celestial equator. The International Astronomical Union fixed the system in 1958 (for the epoch 1950); the numbers here are the same definition expressed in J2000.

### How the three relate
| system | pole | zero of longitude | the great circle | best for |
|---|---|---|---|---|
| equatorial | celestial pole | vernal equinox | celestial equator | catalogues, telescopes |
| ecliptic | in Draco, 23.44° from the pole | vernal equinox | ecliptic | the Sun, Moon, planets, ancient catalogues |
| galactic | in Coma Berenices | galactic centre | the Milky Way | structure of the Galaxy, star counts |

Each is the equatorial grid turned by a fixed rotation: about the equinox line by $\\varepsilon$ for the ecliptic, by three angles for the galactic one (see [[sky-coordinate-transformations]]). Drawn with the pole in the middle, the ecliptic is an ellipse of semi-axes $R$ and $R\\cos\\varepsilon$, and the galactic plane a more slender one with $R\\cos 62.87° = 0.457R$ — the two Monge constructions below.

> [!fact] The galactic centre lies only 5.6° south of the ecliptic, which is why the planets and the Moon pass in front of it, and why the Sun is in line with it every December.`,
  ideas: [
    'The ecliptic system uses the Sun\'s yearly path as its equator: longitude λ from the vernal equinox along the ecliptic, latitude β from it; the poles are 23.44° from the celestial poles.',
    'The Sun has β = 0, the Moon stays within 5.3° and the planets within about 9°: the zodiac band; and precession changes the longitudes of the stars but not their latitudes.',
    'The galactic system uses the plane of the Milky Way as its equator, with zero longitude towards the galactic centre in Sagittarius; the plane is inclined 62.87° to the celestial equator.',
    'Each system is the equatorial one turned by a fixed rotation, so any coordinates can be converted to any others.',
    'Seen from the pole, the ecliptic and the galactic plane are ellipses with major axis equal to the diameter of the equator and minor axes R cos ε and R cos 62.87°.'
  ],
  pitfalls: [
    'The ecliptic is the path of the Sun among the stars and nothing else — It is also the plane of the planets\' orbits (to within a few degrees); that is why the Moon and planets are always found near it.',
    'The zodiac constellations are 12 equal signs of 30° — The ecliptic passes through 13 constellations of unequal length (including Ophiuchus); the 30° "signs" are a convention of the ecliptic grid, not the constellations.',
    'Galactic longitude is measured from the Sun\'s direction of motion — It is measured from the direction of the galactic centre (l = 0); the Sun\'s motion is towards l ≈ 90°.'
  ],
  formulas: [
    {
      name: 'Declination from ecliptic coordinates',
      expr: 'sin(dec) = sin(beta)*cos(eps) + cos(beta)*sin(eps)*sin(lam)',
      tex: '\\sin\\delta = \\sin\\beta\\cos\\varepsilon + \\cos\\beta\\sin\\varepsilon\\sin\\lambda',
      vars: {
        dec: { name: 'declination', q: 'angle', unit: '°', signed: true, min: -90, max: 90, tex: '\\delta' },
        beta: { name: 'ecliptic latitude', q: 'angle', unit: '°', value: 0, signed: true, min: -90, max: 90, tex: '\\beta' },
        lam: { name: 'ecliptic longitude', q: 'angle', unit: '°', value: 90, min: 0, max: 360, tex: '\\lambda' },
        eps: { name: 'obliquity of the ecliptic', q: 'angle', unit: '°', value: 23.44, min: 0, max: 90, tex: '\\varepsilon' }
      },
      solveFor: 'dec',
      note: 'For the Sun, β = 0 and this is sin δ = sin ε sin λ: +23.44° at the June solstice (λ = 90°).'
    },
    {
      name: 'Ecliptic latitude from equatorial coordinates',
      expr: 'sin(beta) = sin(dec)*cos(eps) - cos(dec)*sin(eps)*sin(ra)',
      tex: '\\sin\\beta = \\sin\\delta\\cos\\varepsilon - \\cos\\delta\\sin\\varepsilon\\sin\\alpha',
      vars: {
        beta: { name: 'ecliptic latitude', q: 'angle', unit: '°', signed: true, min: -90, max: 90, tex: '\\beta' },
        dec: { name: 'declination', q: 'angle', unit: '°', value: 11.97, signed: true, min: -90, max: 90, tex: '\\delta' },
        ra: { name: 'right ascension', q: 'angle', unit: '°', value: 152.09, min: 0, max: 360, tex: '\\alpha' },
        eps: { name: 'obliquity of the ecliptic', q: 'angle', unit: '°', value: 23.44, min: 0, max: 90, tex: '\\varepsilon' }
      },
      solveFor: 'beta',
      note: 'The values are Regulus, β = +0.47°: almost on the ecliptic, which is why the Moon and planets often pass close to it.'
    },
    {
      name: 'Galactic latitude from equatorial coordinates',
      expr: 'sin(b) = sin(dec)*sin(decG) + cos(dec)*cos(decG)*cos(ra - raG)',
      tex: '\\sin b = \\sin\\delta\\sin\\delta_{G} + \\cos\\delta\\cos\\delta_{G}\\cos(\\alpha - \\alpha_{G})',
      vars: {
        b: { name: 'galactic latitude', q: 'angle', unit: '°', signed: true, min: -90, max: 90 },
        dec: { name: 'declination', q: 'angle', unit: '°', value: 38.78, signed: true, min: -90, max: 90, tex: '\\delta' },
        ra: { name: 'right ascension', q: 'angle', unit: '°', value: 279.24, min: 0, max: 360, tex: '\\alpha' },
        decG: { name: 'declination of the north galactic pole', q: 'angle', unit: '°', value: 27.128, min: 0, max: 90, fixed: true, tex: '\\delta_{G}' },
        raG: { name: 'right ascension of the north galactic pole', q: 'angle', unit: '°', value: 192.859, min: 0, max: 360, fixed: true, tex: '\\alpha_{G}' }
      },
      solveFor: 'b',
      note: 'The galactic latitude is the star\'s angular distance from the galactic plane, and 90° minus its distance from the galactic pole. Vega has b = +19.2°.'
    }
  ],
  examples: [
    {
      title: 'Regulus: a star on the ecliptic',
      q: 'Regulus has α = 10 h 08.4 m = 152.09°, δ = +11.97°. Find its ecliptic latitude, and say what it means for a planet passing it.',
      steps: [
        { text: 'Apply the formula with $\\varepsilon = 23.44°$:', tex: '\\sin\\beta = \\sin 11.97°\\cos 23.44° - \\cos 11.97°\\sin 23.44°\\sin 152.09° = 0.1903 - 0.1806 = 0.0082' },
        'The latitude is $\\beta = +0.47°$. Its longitude is about 149.8°.',
        'The Moon\'s path is tilted 5.1°, so the Moon can pass up to 5° either side of the ecliptic; Regulus, 0.5° north of it, is one of the four bright stars (with Aldebaran, Spica and Antares) that the Moon actually hides, *occults*. Planets pass within a degree of it too.'
      ],
      a: 'β = +0.47°: Regulus lies almost exactly on the ecliptic.'
    },
    {
      title: 'Vega above the Milky Way',
      q: 'Vega: α = 279.24°, δ = +38.78°. How far is it from the galactic plane? What are its galactic coordinates?',
      steps: [
        { text: 'With the pole at $(192.859°, +27.128°)$:', tex: '\\sin b = \\sin 38.78°\\sin 27.128° + \\cos 38.78°\\cos 27.128°\\cos(279.24° - 192.859°) = 0.2857 + 0.0436 = 0.3293' },
        'So $b = +19.2°$. Vega lies 19.2° north of the Milky Way\'s centre line; its galactic longitude, from the second formula, is $l = 67.4°$.',
        'That puts it well off the bright band: the Milky Way runs through Cygnus and Aquila a long way to the east of Vega, not through it.'
      ],
      a: 'b = +19.2°, l = 67.4°.'
    }
  ],
  quiz: [
    { q: 'At what ecliptic longitude is the Sun at the June solstice?', answer: 90, unit: '°', why: 'The solstice points are 90° and 270° along the ecliptic from the vernal equinox (λ = 0°); the June one is at λ = 90° and the Sun then has the greatest northern declination.' },
    { q: 'Precession changes which of a star\'s ecliptic coordinates?', choices: ['longitude only', 'latitude only', 'both', 'neither'], a: 0, why: 'The equinox slides along the ecliptic, so every longitude increases by 50.3″ a year; the star\'s distance from the ecliptic does not change. That made the ecliptic system the natural one for ancient catalogues.' },
    { q: 'The galactic plane is inclined to the celestial equator by about', choices: ['23°', '45°', '63°', '90°'], a: 2, why: '62.87°, because the north galactic pole is at declination +27.13° and the inclination is 90° minus that.' },
    { q: 'A star with galactic latitude b = 0 lies on the Milky Way\'s centre line.', a: true, why: 'b is the angular distance from the galactic equator, so b = 0 is the plane itself: the line of the band of light.' },
    { q: 'The north ecliptic pole is how far from the north celestial pole?', answer: 23.44, unit: '°', why: 'The two circles are tilted by ε = 23.44°, and their poles are separated by the same angle.' }
  ],
  applications: [
    'Planet and Moon charts: because bodies keep near the ecliptic, almanacs list their positions as ecliptic longitude and latitude.',
    'Ancient and medieval catalogues, and the zodiac signs of astrology and of the astrolabe\'s ecliptic ring, use the ecliptic system.',
    'Galactic astronomy: star counts, interstellar dust, clusters and the Milky Way\'s structure are studied in the galactic system, where the disc is a horizontal line.',
    'All-sky maps of the microwave background, X-ray sky and dust are drawn in galactic coordinates with the plane across the middle.',
    'Eclipse prediction: the Moon\'s ecliptic latitude at new or full Moon decides whether a solar or lunar eclipse occurs.'
  ],
  history: `The ecliptic gave the Babylonians and then the Greeks their reference line: Hipparchus' catalogue, like Ptolemy's, lists a longitude and a latitude for each star, measured from the equinox along and from the ecliptic. The obliquity was found early: Eratosthenes took the arc between the tropics to be 11/83 of the circle (47°42′40″), giving $\\varepsilon = 23°51′20″$, and Ptolemy accepted the figure, which is about 0.2° too large. The galactic system is modern: William Herschel counted stars in all directions in the 1780s and found the Galaxy flattened; a galactic grid was in use in the early twentieth century, and in 1958 the International Astronomical Union fixed the present one by defining the north galactic pole and the zero of longitude.`,
  sources: ['Jean Meeus, *Astronomical Algorithms* (2nd ed., 1998), chapters 13 and 14.', 'Peter Duffett-Smith and Jonathan Zwart, *Practical Astronomy with your Calculator or Spreadsheet* (4th ed., 2011).', 'G. J. Toomer (ed.), *Ptolemy\'s Almagest* (1984), books I and VII–VIII.', 'James Evans, *The History and Practice of Ancient Astronomy* (1998), chapter 4.', 'Blaauw et al., "The new I.A.U. system of galactic coordinates (1958 revision)", *Monthly Notices of the Royal Astronomical Society* 121 (1960).'],
  sim: 'cs-sky-grids',
  construction: ['cs-ecliptic-on-equator', 'cs-galactic-plane']
}
,

{
  id: 'sidereal-time-and-hour-angle',
  parent: 'the-celestial-sphere',
  title: 'Sidereal time and the hour angle',
  level: 2,
  short: `The sky's clock: the hour angle of a star is how far west of the meridian it has moved, and the sidereal time is the right ascension that is on the meridian now. Subtract one from the other and the equatorial coordinates meet your own horizon.`,
  keywords: ['sidereal time', 'hour angle', 'LST', 'GMST', 'sidereal day', 'solar day', 'transit', 'meridian', 'star time', 'local sidereal time'],
  prereq: ['equatorial-coordinates', 'horizon-coordinates'],
  related: ['sky-coordinate-transformations', 'rising-setting-and-circumpolar', 'the-planisphere', 'the-analemma'],
  body: `Right ascension is fixed to the stars but your horizon is not. The two meet through the time, and the quantity that joins them is the hour angle.

### The hour angle
The **hour angle** $H$ of a star is the angle, measured westwards along the celestial equator, from your meridian to the star's hour circle. It is zero when the star is on the meridian (at *upper culmination*, its highest), positive afterwards, negative before: $H = -3$ h means it will cross in three hours. A star's declination stays the same but its hour angle grows steadily, 15.041° per hour, so for a given latitude the altitude and azimuth are functions of $H$ and $\\delta$ alone (the transformation is in [[sky-coordinate-transformations]]).

### Sidereal time
To compute $H$ for any star you need one number for the whole sky, and it is the hour angle of the vernal equinox, called the **local sidereal time** (LST). Because right ascension is measured from the equinox,
$$H = \\text{LST} - \\alpha,$$
and a star crosses the meridian exactly when LST $= \\alpha$: the LST is the right ascension of the meridian. A planisphere is a dial of sidereal time.

### The sidereal day
The Earth turns once relative to the stars in **23 h 56 min 04.09 s** of clock time: one sidereal day, 86 164.09 s. A solar day is longer, 86 400 s, because while the Earth turns it also moves 0.9856° round its orbit, and it must turn that much more for the Sun to come back to the meridian. So a sidereal clock gains **3 min 56.6 s a day** on a solar one, a full day in a year: in 365.24 solar days the Earth makes 366.24 turns. Stars therefore cross the meridian 3 min 56 s earlier each night, two hours earlier each month — the reason the constellations of the seasons change.

### Local from Greenwich
The sidereal time at Greenwich (GMST) at a given instant is, in degrees,
$$\\text{GMST} = 280.46061837° + 360.98564736629° \\times (JD - 2451545.0),$$
where $JD$ is the Julian day number, counting solar days from noon on 1 January 2000. The local sidereal time follows by adding the observer's east longitude: $\\text{LST} = \\text{GMST} + \\lambda$ (15° of longitude is 1 h). At local mean midnight the LST is 12 h at the March equinox, 18 h in June, 0 h in September and 6 h in December: add two hours a month.

> [!why] That the day is a rotation and the year an orbit is why the two days differ: if the Earth did not revolve, the sidereal and the solar day would be equal. Hipparchus counted the day as the interval between two crossings of the Sun, but astronomers' clocks keep sidereal time because they point at stars.`,
  ideas: [
    'The hour angle H is the angle westwards from the meridian to the star, 0 on the meridian, growing by 15.041° an hour.',
    'The local sidereal time is the hour angle of the vernal equinox, and also the right ascension on the meridian; H = LST − α.',
    'A sidereal day (23 h 56 min 04.09 s) is the Earth\'s true rotation period; the solar day is 3 min 56 s longer because the Earth also moves on its orbit.',
    'LST = GMST + east longitude; at midnight the LST is 12 h at the March equinox and advances 2 h a month.',
    'Stars come to the meridian 3 min 56 s earlier each night, which brings the seasonal constellations round.'
  ],
  pitfalls: [
    'A sidereal day is the day of the stars, so the stars take less than a day to turn — They take exactly one sidereal day, and it is the *solar* day that is longer, not the stars\' that is shorter; the Sun is the one that falls behind.',
    'The hour angle is measured eastwards like right ascension — It is measured westwards from the meridian, so it increases with time; right ascension increases eastwards and is fixed to the stars.',
    'Sidereal time is the time of day by the stars at Greenwich — It is local: each longitude has its own LST, which differs by 1 h per 15° of longitude.'
  ],
  formulas: [
    {
      name: 'Hour angle',
      expr: 'H = lst - ra',
      tex: 'H = \\mathrm{LST} - \\alpha',
      vars: {
        H: { name: 'hour angle (west of the meridian)', q: 'angle', unit: '°', signed: true, min: -180, max: 180 },
        lst: { name: 'local sidereal time', q: 'angle', unit: '°', value: 315, min: 0, max: 360, tex: '\\mathrm{LST}' },
        ra: { name: 'right ascension of the star', q: 'angle', unit: '°', value: 279.24, min: 0, max: 360, tex: '\\alpha' }
      },
      solveFor: 'H',
      note: 'In degrees (multiply hours by 15). With LST = 21 h and Vega (α = 18 h 37 m) the hour angle is +35.8° = 2 h 23 m: Vega crossed the meridian 2 h 23 m ago.'
    },
    {
      name: 'Local sidereal time from Greenwich',
      expr: 'lst = gmst + lon',
      tex: '\\mathrm{LST} = \\mathrm{GMST} + \\lambda',
      vars: {
        lst: { name: 'local sidereal time', q: 'angle', unit: '°', min: 0, max: 360, tex: '\\mathrm{LST}' },
        gmst: { name: 'Greenwich sidereal time', q: 'angle', unit: '°', value: 103.56, min: 0, max: 360, tex: '\\mathrm{GMST}' },
        lon: { name: 'east longitude of the observer', q: 'angle', unit: '°', value: 34.78, signed: true, min: -180, max: 180, tex: '\\lambda' }
      },
      solveFor: 'lst',
      note: 'Tel Aviv is 34.78° east, 2 h 19 m; the sidereal time there is 2 h 19 m ahead of Greenwich\'s. West longitudes are negative.'
    },
    {
      name: 'Length of the sidereal day',
      expr: 'Tsid = Tsol/1.00273790935',
      tex: 'T_{\\mathrm{sid}} = \\frac{T_{\\mathrm{sol}}}{1.002\\,737\\,909\\,35}',
      vars: {
        Tsid: { name: 'sidereal day', q: 'time', unit: 's', tex: 'T_{\\mathrm{sid}}' },
        Tsol: { name: 'mean solar day', q: 'time', unit: 's', value: 86400, tex: 'T_{\\mathrm{sol}}' }
      },
      solveFor: 'Tsid',
      note: 'The factor 1.0027379 is the number of turns the Earth makes per solar day (366.2422/365.2422). The result, 86 164.09 s, is 23 h 56 min 04.09 s.'
    }
  ],
  examples: [
    {
      title: 'Is Vega up in Tel Aviv at 21:19 on 20 March?',
      q: 'At 19:00 UT on 20 March 2025, at Tel Aviv (longitude 34.78° E, latitude 32.07° N), the Greenwich sidereal time is 6 h 54.2 m. Find the local sidereal time, the hour angle of Vega (α = 18 h 36.9 m, δ = +38.8°), and say whether Vega is up.',
      steps: [
        { text: 'The longitude is 34.78° = 2 h 19.1 m east, so', tex: '\\mathrm{LST} = 6\\,\\mathrm{h}\\,54.2\\,\\mathrm{m} + 2\\,\\mathrm{h}\\,19.1\\,\\mathrm{m} = 9\\,\\mathrm{h}\\,13.3\\,\\mathrm{m} = 138.3°' },
        { text: 'The hour angle:', tex: 'H = 138.3° - 279.24° = -140.9° = -9\\,\\mathrm{h}\\,24\\,\\mathrm{m}' },
        'Negative: Vega is 9 h 24 m *before* crossing the meridian, in the north-east. Its altitude from $\\sin h = \\sin\\varphi\\sin\\delta + \\cos\\varphi\\cos\\delta\\cos H$ is $-10.4°$, below the horizon.',
        'Vega rises when its hour angle is $-H_0$, with $\\cos H_0 = -\\tan\\varphi\\tan\\delta$, i.e. $H_0 = 120.2° = 8.0$ h: about 1 h 22 m later, near 22:40 local mean time.'
      ],
      a: 'LST = 9 h 13 m; H = −9 h 24 m; Vega is still below the horizon (−10°) and rises about 1 h 22 m later.'
    },
    {
      title: 'When does Arcturus cross the meridian?',
      q: 'On 20 March 2025 at Tel Aviv, when does Arcturus (α = 14 h 15.7 m) culminate, by the clock (local mean solar time)?',
      steps: [
        'At 0 h UT on 20 March the Greenwich sidereal time is 11 h 51.1 m; at Tel Aviv add 2 h 19.1 m: LST = 14 h 10.2 m.',
        'Arcturus crosses when LST = 14 h 15.7 m, i.e. 5.5 sidereal minutes later, which is 5.5 solar minutes after 00:00 UT (the difference between the two is too small to matter here).',
        'In local mean time (UT + 2 h 19 m) that is 02:24. Each night the star crosses 3 min 56 s earlier, so a month later (20 April) it crosses near 00:22, at midnight; in July it crosses at about 18:30 in the evening.'
      ],
      a: 'About 02:24 local mean solar time.'
    }
  ],
  quiz: [
    { q: 'A star has right ascension 5 h. The local sidereal time is 8 h. Its hour angle is', answer: 3, unit: 'h', why: 'H = LST − α = 8 h − 5 h = +3 h: positive, so the star crossed the meridian three sidereal hours ago and is now west of it.' },
    { q: 'How much shorter is the sidereal day than the mean solar day?', choices: ['about 4 minutes', 'about 24 minutes', 'exactly one hour', 'they are equal'], a: 0, why: '23 h 56 min 04 s against 24 h: 3 min 56 s, because the Earth moves 0.9856° in its orbit each day and has to turn that much more for the Sun to return to the meridian.' },
    { q: 'At local mean midnight on 21 March, the local sidereal time is about', choices: ['0 h', '6 h', '12 h', '18 h'], a: 2, why: 'At the March equinox the Sun is at right ascension 0 h; at midnight the meridian is opposite to it, at 12 h.' },
    { q: 'A sidereal clock set to the right time at midnight today will, after 30 days, be ahead of the solar clock by', choices: ['about 2 hours', 'about 12 minutes', 'about 1 minute', 'nothing'], a: 0, why: '30 × 3 min 56.6 s = 1 h 58 min.' },
    { q: 'Two observers, one at longitude 0° and one at 45° E, look at the sky at the same instant. Their local sidereal times differ by 3 hours.', a: true, why: 'Local sidereal time differs from place to place by the difference in longitude: 45° = 3 h, the eastern one ahead.' }
  ],
  applications: [
    'Telescope control: a mount knows the local sidereal time (from the clock and the longitude) and points at a target by setting the hour angle $H = \\mathrm{LST} - \\alpha$.',
    'Observing plans: stars within 2 h of the meridian are best placed; the sidereal time tells you what is there.',
    'Planispheres and sky software: the dial of the planisphere is turned until the date and the clock time coincide, which sets the sidereal time.',
    'Celestial navigation: the Greenwich hour angle of the first point of Aries, listed in the almanac, is GMST in degrees, and the star\'s sidereal hour angle (360° − α) is added to it.',
    'Radio astronomy and satellite tracking: antennas follow sources at the sidereal rate rather than the solar rate.'
  ],
  history: `Greek astronomers reckoned the hours from sunrise or sunset and knew that the stars return to the same place a little sooner than the Sun does; the difference of 1/365 of a day is the discovery that the Sun has its own motion on the sphere. Sidereal clocks had to wait for the pendulum: after Christiaan Huygens' clock of 1656, John Flamsteed used two pendulum clocks at Greenwich in 1676–77 to show that the stars cross the meridian at equal intervals, which set the Earth's rotation as the standard of time. Every observatory then kept a sidereal clock beside the mean-time one until the atomic clocks of the twentieth century. Today sidereal time is computed from the Earth rotation angle, measured by radio telescopes against quasars.`,
  sources: ['Jean Meeus, *Astronomical Algorithms* (2nd ed., 1998), chapter 12, "Sidereal time at Greenwich".', 'Peter Duffett-Smith and Jonathan Zwart, *Practical Astronomy with your Calculator or Spreadsheet* (4th ed., 2011).', 'James Evans, *The History and Practice of Ancient Astronomy* (1998), chapter 1.', 'The Astronomical Almanac, the section on sidereal time and the Earth rotation angle.'],
  sim: 'cs-sky-turning',
  construction: 'cs-sidereal-dials'
},

{
  id: 'sky-coordinate-transformations',
  parent: 'the-celestial-sphere',
  title: 'Turning one sky system into another',
  level: 3,
  short: `All the sky's coordinate systems are the same sphere with different poles. The pole–zenith–star triangle gives the altitude and azimuth from the right ascension and declination, and a rotation matrix does it for any system, in either direction.`,
  keywords: ['coordinate transformation', 'spherical triangle', 'spherical trigonometry', 'cosine rule', 'rotation matrix', 'altitude', 'azimuth', 'equatorial to horizon', 'ecliptic to equatorial', 'galactic matrix'],
  prereq: ['horizon-coordinates', 'equatorial-coordinates', 'sidereal-time-and-hour-angle', 'math:law-of-cosines'],
  related: ['ecliptic-and-galactic-coordinates', 'the-astrolabe', 'rotation-matrices', 'looking-at-the-horizon'],
  body: `Two systems on the same sphere differ only by a rotation. So a conversion has two descriptions: a **triangle** drawn on the sphere, which gives the formulas, and a **matrix** acting on a unit vector, which a computer prefers.

### The triangle
Join three points of the sky by great-circle arcs: the north celestial pole $P$, the zenith $Z$ and the star $X$. This **spherical triangle** has sides
$$PZ = 90° - \\varphi,\\qquad PX = 90° - \\delta,\\qquad ZX = 90° - h,$$
and its angle at $P$ is the hour angle $H$; its angle at $Z$ is the azimuth (or its supplement). Everything the conversion needs is the spherical law of cosines: if two sides $a$ and $b$ enclose an angle $C$, the third side $c$ satisfies $\\cos c = \\cos a\\cos b + \\sin a\\sin b\\cos C$. Take $a = PZ$, $b = PX$, $C = H$ and $c = ZX$, and use $\\cos(90° - x) = \\sin x$:
$$\\sin h = \\sin\\varphi\\sin\\delta + \\cos\\varphi\\cos\\delta\\cos H,$$
the altitude formula. The azimuth comes from the same triangle by the cosine rule for the side $PX$ (using the angle at $Z$):
$$\\cos A = \\frac{\\sin\\delta - \\sin\\varphi\\sin h}{\\cos\\varphi\\cos h}.$$
This gives $A$ between 0° and 180°, which is right for a star in the east ($H<0$); for a star west of the meridian ($H>0$) the azimuth from north through east is $360° - A$. Reading the triangle backwards gives the declination from the horizon: $\\sin\\delta = \\sin\\varphi\\sin h + \\cos\\varphi\\cos h\\cos A$. The construction below draws this triangle with plan, elevation and true length, and measures its third side with a protractor.

### The matrices
Write the star as a unit vector. In the frame fixed to the equator and the meridian (first axis towards the meridian, second towards the west, third towards the pole) it is $(\\cos\\delta\\cos H,\\ \\cos\\delta\\sin H,\\ \\sin\\delta)$, and the horizon frame (south, west, zenith) is reached by one rotation about the east–west axis through $90° - \\varphi$:
$$\\begin{pmatrix} S\\\\ W\\\\ U\\end{pmatrix} = \\begin{pmatrix} \\sin\\varphi & 0 & -\\cos\\varphi\\\\ 0 & 1 & 0\\\\ \\cos\\varphi & 0 & \\sin\\varphi\\end{pmatrix}\\begin{pmatrix}\\cos\\delta\\cos H\\\\ \\cos\\delta\\sin H\\\\ \\sin\\delta\\end{pmatrix},\\qquad h = \\arcsin U,\\quad A_S = \\operatorname{atan2}(W, S).$$
Here $A_S$ is measured from south towards west; add 180° for the azimuth from north. The ecliptic is reached from the equatorial frame by a rotation through $\\varepsilon$ about the equinox axis,
$$\\begin{pmatrix} x\\\\ y\\\\ z\\end{pmatrix}_{\\mathrm{eq}} = \\begin{pmatrix} 1&0&0\\\\ 0&\\cos\\varepsilon&-\\sin\\varepsilon\\\\ 0&\\sin\\varepsilon&\\cos\\varepsilon\\end{pmatrix}\\begin{pmatrix} x\\\\ y\\\\ z\\end{pmatrix}_{\\mathrm{ecl}},$$
and the galactic system by a fixed matrix of three angles (J2000):
$$\\begin{pmatrix} x\\\\ y\\\\ z\\end{pmatrix}_{\\mathrm{gal}} = \\begin{pmatrix} -0.05488 & -0.87344 & -0.48384\\\\ +0.49411 & -0.44483 & +0.74698\\\\ -0.86767 & -0.19808 & +0.45598\\end{pmatrix}\\begin{pmatrix} x\\\\ y\\\\ z\\end{pmatrix}_{\\mathrm{eq}}.$$
In each case a unit vector $(\\cos b\\cos l, \\cos b\\sin l, \\sin b)$ is turned into the angles by $b = \\arcsin z$, $l = \\operatorname{atan2}(y, x)$. Rotations compose by multiplying matrices, so ecliptic to horizon is the product of three of them, and the inverse of a rotation is its transpose.

> [!tip] A quick check on any conversion: a star on the meridian ($H = 0$) must come out due south (or north) at altitude $90° - |\\varphi - \\delta|$, and a star with $\\delta = 90°$ must come out at altitude $\\varphi$, due north.`,
  ideas: [
    'Two sky systems differ by a rotation of the sphere; a conversion is that rotation, described either as a spherical triangle or as a 3 × 3 matrix.',
    'The pole–zenith–star triangle has sides 90° − φ, 90° − δ, 90° − h and angle H at the pole; the spherical law of cosines gives sin h = sin φ sin δ + cos φ cos δ cos H.',
    'The azimuth follows from the same triangle: cos A = (sin δ − sin φ sin h)/(cos φ cos h), in the east for H < 0 and in the west for H > 0.',
    'With unit vectors, equatorial → horizon is a rotation through 90° − φ, ecliptic → equatorial is a rotation through ε, and equatorial → galactic is a fixed matrix; inverses are transposes.',
    'The triangle can also be solved with ruler and protractor from a plan and an elevation, which is how the astrolabe was designed.'
  ],
  pitfalls: [
    'A formula for the azimuth with an inverse tangent gives the right answer in every quadrant — The arctangent alone returns a value between −90° and 90°; one must use the signs of the numerator and the denominator (atan2), or the hour angle, to put A in the right quadrant.',
    'The azimuth convention does not matter — Astronomers\' old formulas measure it from south towards west; navigators and nearly every program measure it from north towards east. Add or subtract 180° when you switch.',
    'The order of rotations does not matter — Rotations about different axes do not commute; the product must be applied in the right order, and the inverse of a product reverses the order.'
  ],
  formulas: [
    {
      name: 'Altitude from the hour angle',
      expr: 'sin(h) = sin(phi)*sin(dec) + cos(phi)*cos(dec)*cos(H)',
      tex: '\\sin h = \\sin\\varphi\\sin\\delta + \\cos\\varphi\\cos\\delta\\cos H',
      vars: {
        h: { name: 'altitude', q: 'angle', unit: '°', signed: true, min: -90, max: 90 },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 32.07, signed: true, min: -90, max: 90, tex: '\\varphi' },
        dec: { name: 'declination', q: 'angle', unit: '°', value: 38.78, signed: true, min: -90, max: 90, tex: '\\delta' },
        H: { name: 'hour angle', q: 'angle', unit: '°', value: 35.76, signed: true, min: -180, max: 180 }
      },
      solveFor: 'h',
      note: 'Vega seen from Tel Aviv at local sidereal time 21 h: 60.3°.'
    },
    {
      name: 'Azimuth from the altitude',
      expr: 'cos(A) = (sin(dec) - sin(phi)*sin(h))/(cos(phi)*cos(h))',
      tex: '\\cos A = \\frac{\\sin\\delta - \\sin\\varphi\\sin h}{\\cos\\varphi\\cos h}',
      vars: {
        A: { name: 'azimuth from north (0° to 180°; subtract from 360° for a western star)', q: 'angle', unit: '°', min: 0, max: 180 },
        dec: { name: 'declination', q: 'angle', unit: '°', value: 38.78, signed: true, min: -90, max: 90, tex: '\\delta' },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 32.07, signed: true, min: -90, max: 90, tex: '\\varphi' },
        h: { name: 'altitude', q: 'angle', unit: '°', value: 60.3, min: 0, max: 89, tex: 'h' }
      },
      solveFor: 'A',
      note: 'The formula returns the angle from north on the shorter side; Vega is west of the meridian at H = +35.8°, so its azimuth is 360° − 66.8° = 293.2°.'
    },
    {
      name: 'Spherical law of cosines for the sides',
      expr: 'cos(c) = cos(a)*cos(b) + sin(a)*sin(b)*cos(C)',
      tex: '\\cos c = \\cos a\\cos b + \\sin a\\sin b\\cos C',
      vars: {
        c: { name: 'side opposite the angle C', q: 'angle', unit: '°', min: 0, max: 180 },
        a: { name: 'first side', q: 'angle', unit: '°', value: 57.93, min: 0, max: 180 },
        b: { name: 'second side', q: 'angle', unit: '°', value: 70.82, min: 0, max: 180 },
        C: { name: 'angle between sides a and b', q: 'angle', unit: '°', value: 50, min: 0, max: 180 }
      },
      solveFor: 'c',
      note: 'With a = 90° − φ, b = 90° − δ and C = H it gives the side ZX = 90° − h: Arcturus 3 h 20 m past the meridian at Tel Aviv.'
    },
    {
      name: 'Right ascension of a point of the ecliptic',
      expr: 'tan(ra) = cos(eps)*tan(lam)',
      tex: '\\tan\\alpha = \\cos\\varepsilon\\tan\\lambda',
      vars: {
        ra: { name: 'right ascension', q: 'angle', unit: '°', min: 0, max: 360, tex: '\\alpha' },
        lam: { name: 'ecliptic longitude', q: 'angle', unit: '°', value: 60, min: 0, max: 360, tex: '\\lambda' },
        eps: { name: 'obliquity of the ecliptic', q: 'angle', unit: '°', value: 23.44, min: 0, max: 90, tex: '\\varepsilon' }
      },
      solveFor: 'ra',
      note: 'For a point on the ecliptic (β = 0); the right ascension and the longitude lie in the same quadrant. The Sun at λ = 60° has α = 57.8° = 3 h 51 m.'
    }
  ],
  examples: [
    {
      title: 'Vega over Tel Aviv at sidereal time 21 h',
      q: 'Where is Vega (α = 18 h 36.9 m, δ = +38.78°) in the sky of Tel Aviv (φ = 32.07° N) when the local sidereal time is 21 h?',
      steps: [
        { text: 'The hour angle:', tex: 'H = 315° - 279.24° = 35.76°' },
        { text: 'The altitude:', tex: '\\sin h = 0.5300\\times 0.6266 + 0.8480\\times 0.7794\\times 0.8118 = 0.3321 + 0.5365 = 0.8686,\\quad h = 60.3°' },
        { text: 'The azimuth, from south towards west, by $\\tan A_S = \\sin H / (\\cos H\\sin\\varphi - \\tan\\delta\\cos\\varphi)$:', tex: '\\tan A_S = \\frac{0.5844}{0.8118\\times 0.5300 - 0.8039\\times 0.8480} = \\frac{0.5844}{-0.2515},\\quad A_S = 113.2°' },
        'The numerator is positive (west) and the denominator negative, which puts $A_S$ in the second quadrant. From north through east, $A = 113.2° + 180° = 293.2°$: west-north-west.'
      ],
      a: 'Altitude 60.3°, azimuth 293.2° (west-north-west).'
    },
    {
      title: 'The Sun at ecliptic longitude 60°',
      q: 'The Sun is at ecliptic longitude 60° (around 21 May). Find its right ascension and declination, and its altitude at noon at Tel Aviv.',
      steps: [
        { text: 'Declination, from $\\sin\\delta = \\sin\\varepsilon\\sin\\lambda$:', tex: '\\sin\\delta = 0.3978\\times 0.8660 = 0.3445,\\quad \\delta = +20.15°' },
        { text: 'Right ascension, from $\\tan\\alpha = \\cos\\varepsilon\\tan\\lambda$:', tex: '\\tan\\alpha = 0.9175\\times 1.7321 = 1.5893,\\quad \\alpha = 57.82° = 3\\,\\mathrm{h}\\,51\\,\\mathrm{m}' },
        'Both formulas keep $\\lambda$ and $\\alpha$ in the same quadrant. At noon the Sun is on the meridian, so its altitude is $90° - 32.07° + 20.15° = 78.1°$.'
      ],
      a: 'α = 3 h 51 m, δ = +20.15°; noon altitude 78.1° at Tel Aviv.'
    }
  ],
  quiz: [
    { q: 'In the pole–zenith–star triangle, the side from the zenith to the star measures', choices: ['the altitude h', '90° − h', '90° − φ', 'the azimuth'], a: 1, why: 'The side is the zenith distance, 90° minus the altitude. The sides from the pole are 90° − φ (to the zenith) and 90° − δ (to the star).' },
    { q: 'A star with δ = φ passes through the zenith on the meridian.', a: true, why: 'On the meridian $h = 90° - |\\varphi - \\delta|$, which is 90° when δ = φ.' },
    { q: 'The inverse of a rotation matrix is its', choices: ['negative', 'transpose', 'determinant', 'reciprocal of each entry'], a: 1, why: 'A rotation matrix is orthogonal: its inverse equals its transpose, so reversing a conversion is a matter of transposing.' },
    { q: 'A star at H = 0 and δ = −10° at latitude 40° N is on the meridian at altitude', answer: 40, unit: '°', why: '$90° - |\\varphi - \\delta| = 90° - 50° = 40°$, due south.' },
    { q: 'Why does the arctangent of $\\sin H/(\\cos H\\sin\\varphi - \\tan\\delta\\cos\\varphi)$ alone not give the azimuth?', choices: ['it always gives the wrong sign', 'it cannot distinguish a star in one quadrant from the opposite quadrant', 'it is only valid at the equator', 'it needs the altitude too'], a: 1, why: 'atan of a ratio loses the signs of numerator and denominator. Two opposite directions give the same ratio; atan2, or looking at the sign of H, restores the quadrant.' }
  ],
  applications: [
    'Every planetarium program, telescope mount and star finder does this conversion thousands of times a second.',
    'The astrolabe is an analogue computer for it: the rete holds the equatorial grid, the plate the horizon grid, and turning one over the other is the rotation by the sidereal time.',
    'Satellite and antenna pointing convert targets given in equatorial or ecliptic coordinates to the two angles of a dish.',
    'Navigation by sight reduction: the altitude intercept method solves exactly the triangle above for a known position and compares the result with the measured altitude.',
    'Surveying with the Sun or Polaris to find true north from the azimuth formula.'
  ],
  history: `The conversion was a central problem of Islamic mathematical astronomy. The astronomers of ninth-century Baghdad, and then al-Biruni and Ibn Yunus, took the sine from the Indian tradition in place of the Greek chord, added the tangent, and developed spherical trigonometry for the astrolabe, the sundial and the direction of Mecca. A form of the cosine rule for sides is found in al-Battani's work around 900; Regiomontanus gave it as a general theorem in *De triangulis omnimodis*, written about 1464 and printed in 1533, and Napier's rules of circular parts followed in 1614. The matrix form is nineteenth-century linear algebra applied to the same sphere.`,
  sources: ['Jean Meeus, *Astronomical Algorithms* (2nd ed., 1998), chapter 13, "Transformation of coordinates".', 'Peter Duffett-Smith and Jonathan Zwart, *Practical Astronomy with your Calculator or Spreadsheet* (4th ed., 2011), the chapters on coordinate transformations and spherical trigonometry.', 'G. J. Toomer (ed.), *Ptolemy\'s Almagest* (1984), the chapters on spherical astronomy in book II.', 'James Evans, *The History and Practice of Ancient Astronomy* (1998), the chapter on the analemma and the astrolabe.', 'The ESA, *The Hipparcos and Tycho Catalogues* (1997), volume 1, for the galactic transformation matrix.'],
  sim: 'cs-triangle',
  construction: 'cs-spherical-triangle'
},

{
  id: 'the-suns-path',
  parent: 'the-celestial-sphere',
  title: 'The Sun\'s path through the year',
  level: 2,
  short: `The Sun moves round the ecliptic once a year, so its declination swings between +23.44° and −23.44° like a sine curve. That one swing is the whole of the seasons: the noon altitude, the length of the day and the place of sunrise all follow from it.`,
  keywords: ['Sun', 'seasons', 'declination of the Sun', 'solstice', 'equinox', 'day length', 'noon altitude', 'sunrise azimuth', 'tropics', 'polar day', 'midnight sun', 'ecliptic longitude'],
  prereq: ['ecliptic-and-galactic-coordinates', 'rising-setting-and-circumpolar'],
  related: ['sun-path-diagrams', 'the-analemma', 'sundials-as-projections', 'sidereal-time-and-hour-angle'],
  body: `The Sun is on the ecliptic and moves along it at an average of $360°/365.24 = 0.9856°$ a day, a little over a degree a day in January and a little under in July. Its position is fixed by its **ecliptic longitude** $\\lambda$: 0° at the March equinox, 90° at the June solstice, 180° at the September equinox, 270° in December. Since the ecliptic is tilted by $\\varepsilon = 23.44°$ to the equator, the Sun's **declination** follows from the triangle at the pole of the ecliptic:
$$\\sin\\delta_\\odot = \\sin\\varepsilon\\,\\sin\\lambda \\quad\\Longrightarrow\\quad \\delta_\\odot \\approx 23.44°\\ \\sin\\lambda.$$
A circle seen from the side gives a sine curve, and that is how the construction below draws it, point by point, from a circle of radius $\\varepsilon$.

### What the declination decides
Each day the Sun climbs and falls round the sky on a daily circle of declination $\\delta$ (a circle that drifts by at most 0.4° from one day to the next, so the true path is a very open spiral). At latitude $\\varphi$:
- the **noon altitude** is $90° - |\\varphi - \\delta|$, the highest point of that circle;
- the Sun rises and sets when its hour angle is $\\pm H_0$ with $\\cos H_0 = -\\tan\\varphi\\tan\\delta$, so the **day length** is $2H_0/15°$ hours;
- it rises at azimuth $A$ from north given by $\\cos A = \\sin\\delta/\\cos\\varphi$: due east on the equinoxes, 28° north of east at Tel Aviv at midsummer;
- when $\\delta>90°-\\varphi$ the circle clears the horizon and there is a **midnight sun**; when $\\delta<-(90°-\\varphi)$ there is polar night. The **tropics** at $\\pm23.44°$ mark the latitudes where the Sun can be at the zenith, the **polar circles** at $\\pm66.56°$ those where it can stay up (or down) all day.

### The seasons are the tilt, not the distance
The Earth is nearest the Sun in early January (147.1 million km) and farthest in early July (152.1 million km), so the distance works against the northern summer. What makes the seasons is that in June the northern hemisphere is turned towards the Sun: the Sun is high, its light falls steeply and the days are long. The Sun does not speed along the ecliptic evenly, so the seasons are unequal: the northern spring lasts about 92.7 days, summer 93.7, autumn 89.9 and winter 89.0.

### The year as a curve
Plotting the declination against the day gives a sine-like wave with a period of a year. It would be a pure sine if the Sun moved evenly, but the Earth moves faster in January, so the northern spring and summer together last 7.6 days longer than autumn and winter together. The same effect plus the tilt produce the equation of time and the [[the-analemma|analemma]]: the Sun at the same clock time traces a figure of eight over the year.

> [!fact] At the equinoxes the Sun rises due east and sets due west *everywhere*, and day and night are almost exactly equal (about 12 h 08 min at Tel Aviv, because the Sun's upper edge counts and the atmosphere lifts it by about 0.6°).`,
  ideas: [
    'The Sun moves 0.9856° a day along the ecliptic, so its declination follows δ = asin(sin ε sin λ) ≈ 23.44° sin λ through the year.',
    'The noon altitude is 90° − |φ − δ|; the day length is 2H₀/15 hours with cos H₀ = −tan φ tan δ; the sunrise azimuth satisfies cos A = sin δ / cos φ.',
    'The seasons come from the tilt of the axis, not from the distance: the Earth is nearest the Sun in January.',
    'Tropics (±23.44°) mark where the Sun can be overhead; polar circles (±66.56°) where it can stay up or down all day.',
    'The seasons are unequal because the Earth moves faster near the Sun; northern summer is about 4.6 days longer than winter.'
  ],
  pitfalls: [
    'It is hot in summer because the Earth is nearer the Sun — The Earth is nearest in January. Summer is hot because the Sun is high and the days long; the southern summer is the one that coincides with the closest approach.',
    'The Sun rises in the east and sets in the west every day — Only on the equinoxes does it rise due east. At midsummer in the northern hemisphere it rises well north of east and sets north of west; in midwinter, south of both.',
    'The Sun is at the zenith at noon in summer wherever you live — It can be overhead only between the tropics; at 32° N it never passes higher than 81.4°.'
  ],
  formulas: [
    {
      name: 'Declination of the Sun',
      expr: 'sin(dec) = sin(eps)*sin(lam)',
      tex: '\\sin\\delta_\\odot = \\sin\\varepsilon\\sin\\lambda',
      vars: {
        dec: { name: 'declination of the Sun', q: 'angle', unit: '°', signed: true, min: -90, max: 90, tex: '\\delta_\\odot' },
        eps: { name: 'obliquity of the ecliptic', q: 'angle', unit: '°', value: 23.44, min: 0, max: 90, tex: '\\varepsilon' },
        lam: { name: 'ecliptic longitude of the Sun', q: 'angle', unit: '°', value: 60, min: 0, max: 360, tex: '\\lambda' }
      },
      solveFor: 'dec',
      note: 'λ = 0° at the March equinox, 90° at the June solstice. The approximate form δ ≈ 23.44° sin λ is within 0.05° of this.'
    },
    {
      name: 'Length of the day',
      expr: 'D = 24/pi*acos(-tan(phi)*tan(dec))',
      tex: 'D = \\frac{24}{\\pi}\\arccos\\left(-\\tan\\varphi\\tan\\delta\\right)',
      vars: {
        D: { name: 'length of the day (geometric)', q: false, unit: 'h' },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 51.5, signed: true, min: -66, max: 66, tex: '\\varphi' },
        dec: { name: 'declination of the Sun', q: 'angle', unit: '°', value: 23.44, signed: true, min: -23.5, max: 23.5, tex: '\\delta' }
      },
      solveFor: 'D',
      note: 'The time between the Sun\'s centre crossing the horizon at sunrise and at sunset, in hours. Refraction and the Sun\'s half-degree radius add about 10 minutes at mid-latitudes. London at midsummer: 16.4 h.'
    },
    {
      name: 'Noon altitude',
      expr: 'hn = pi/2 - abs(phi - dec)',
      tex: 'h_{\\mathrm{noon}} = 90^{\\circ} - |\\varphi - \\delta|',
      vars: {
        hn: { name: 'altitude of the Sun on the meridian', q: 'angle', unit: '°', min: 0, max: 90, tex: 'h_{\\mathrm{noon}}' },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 32.07, signed: true, min: -90, max: 90, tex: '\\varphi' },
        dec: { name: 'declination of the Sun', q: 'angle', unit: '°', value: 23.44, signed: true, min: -23.5, max: 23.5, tex: '\\delta' }
      },
      solveFor: 'hn',
      note: 'Tel Aviv at midsummer: 81.4°; at midwinter (δ = −23.44°): 34.5°.'
    },
    {
      name: 'Azimuth of sunrise',
      expr: 'cos(A) = sin(dec)/cos(phi)',
      tex: '\\cos A = \\frac{\\sin\\delta}{\\cos\\varphi}',
      vars: {
        A: { name: 'azimuth of sunrise, from north through east', q: 'angle', unit: '°', min: 0, max: 180 },
        dec: { name: 'declination of the Sun', q: 'angle', unit: '°', value: 23.44, signed: true, min: -23.5, max: 23.5, tex: '\\delta' },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 32.07, signed: true, min: -60, max: 60, tex: '\\varphi' }
      },
      solveFor: 'A',
      note: 'The Sun sets at 360° − A. At Tel Aviv at midsummer A = 62.0°, that is 28° north of east; at the equinoxes it is exactly 90°.'
    }
  ],
  examples: [
    {
      title: 'The longest day in London',
      q: 'London is at latitude 51.5° N. How long is the day at midsummer, and how high does the Sun climb? Compare with an almanac day of 16 h 38 min.',
      steps: [
        { text: 'The hour angle of sunset:', tex: '\\cos H_0 = -\\tan 51.5°\\tan 23.44° = -1.2572\\times 0.4336 = -0.5451,\\quad H_0 = 123.0°' },
        'The day lasts $2H_0/15 = 16.40$ h (16 h 24 m): geometric, with the Sun reduced to a point and no atmosphere.',
        'The Sun\'s upper edge appears on the horizon when its centre is still 0.83° below the geometric horizon (its radius 0.27° plus refraction 0.57°), so the real day is longer: 16.64 h = 16 h 38 m, which agrees with an almanac.',
        'The noon altitude is $90° - 51.5° + 23.44° = 61.9°$ (and only 15.0° at midwinter, with a day of 7.6 h).'
      ],
      a: '16.4 h geometric, about 16 h 38 m in practice; noon altitude 61.9°.'
    },
    {
      title: 'Sunrise at Tel Aviv at midsummer',
      q: 'At what azimuth does the Sun rise and set at Tel Aviv (32.07° N) at midsummer, and how long is the day?',
      steps: [
        { text: 'Azimuth of sunrise, from north through east:', tex: '\\cos A = \\frac{\\sin 23.44°}{\\cos 32.07°} = \\frac{0.3978}{0.8470} = 0.4697,\\quad A = 62.0°' },
        'That is 28° north of due east. Sunset is symmetrical, at $360° - 62.0° = 298.0°$, 28° north of west.',
        { text: 'The day length:', tex: '\\cos H_0 = -\\tan 32.07°\\tan 23.44° = -0.2717,\\quad H_0 = 105.8°,\\quad D = 14.1\\ \\text{h}' },
        'Refraction and the Sun\'s radius add about nine minutes, giving 14 h 15 m. At midwinter the same formulas give a day of 10 h with sunrise 28° south of east.'
      ],
      a: 'Sunrise at 62° (28° north of east); sunset at 298°; day 14 h 15 m.'
    }
  ],
  quiz: [
    { q: 'What is the declination of the Sun at ecliptic longitude 30°?', answer: 11.5, unit: '°', why: '$\\sin\\delta = \\sin 23.44°\\sin 30° = 0.1989$, so $\\delta = 11.47°$.' },
    { q: 'At latitude 70° N the Sun does not set when its declination exceeds', choices: ['20°', '23.44°', '66.56°', '70°'], a: 0, why: 'The condition is $\\delta > 90° - \\varphi = 20°$. That is the case from about 20 May to 22 July (Tromsø, at 69.7° N, has its midnight sun on those dates).' },
    { q: 'The Earth is closest to the Sun in', choices: ['June', 'September', 'December/January', 'March'], a: 2, why: 'Perihelion falls in early January, aphelion in early July. The seasons come from the tilt of the axis, not from the distance.' },
    { q: 'At the equator on the equinox the Sun is at the zenith at noon.', a: true, why: 'There δ = 0° = φ, so the noon altitude is $90° - |0° - 0°| = 90°$.' },
    { q: 'The Sun\'s noon altitude at 45° N at the December solstice is', choices: ['21.6°', '45°', '68.4°', '23.44°'], a: 0, why: '$90° - |45° - (-23.44°)| = 90° - 68.44° = 21.6°$.' }
  ],
  applications: [
    'Architecture and solar design: windows, overhangs and shading are sized from the Sun\'s noon altitude at the solstices; a south-facing overhang that blocks the summer Sun at 81° passes the winter Sun at 34°.',
    'Solar energy: a fixed collector is tilted about the latitude from the horizontal; a tracker follows the Sun\'s declination through the year.',
    'Calendars and agriculture: the solstices and equinoxes divide the year; Stonehenge\'s axis points to midsummer sunrise (azimuth about 50° at its latitude).',
    'Navigation: the latitude is the noon altitude and the declination combined, $\\varphi = 90° - h + \\delta$ — the noon sight.',
    'Photography: the "golden hour" length and the direction of light depend on where the Sun is on its seasonal circle.'
  ],
  history: `The solstices and equinoxes were the first things astronomers marked. Eratosthenes measured the distance between the tropics as 11/83 of a circle, giving the obliquity 23°51′20″, and a century later Hipparchus discovered that the seasons are unequal (94½ days for spring, 92½ for summer), which he explained by placing the Earth off the centre of the Sun's circle, an eccentric. Ptolemy's solar theory, adopted by the Islamic and medieval astronomers, put the eccentricity at 1/24 of the radius. Kepler's second law (1609) replaced the eccentric by an ellipse swept at a uniform rate, and Flamsteed gave the correct explanation of the equation of time in 1672.`,
  sources: ['Jean Meeus, *Astronomical Algorithms* (2nd ed., 1998), chapters 25 and 28.', 'Peter Duffett-Smith and Jonathan Zwart, *Practical Astronomy with your Calculator or Spreadsheet* (4th ed., 2011), the chapters on the Sun.', 'James Evans, *The History and Practice of Ancient Astronomy* (1998), chapters 3 and 5 on the solar motion and the seasons.', 'G. J. Toomer (ed.), *Ptolemy\'s Almagest* (1984), book III on the Sun\'s motion and the eccentric.'],
  sim: 'cs-ecliptic-sun',
  construction: 'cs-sun-declination'
}
,

{
  id: 'moon-and-planets-on-the-ecliptic',
  parent: 'the-celestial-sphere',
  title: 'The Moon and the planets along the ecliptic',
  level: 2,
  short: `The planets were born in a disc, so they all travel within a few degrees of the ecliptic, the zodiacal band. The Moon's path is a sine wave 5.1° either side of it, whose crossings (the nodes) decide eclipses; the planets' loops come from the Earth overtaking them.`,
  keywords: ['Moon', 'planets', 'zodiac', 'ecliptic', 'nodes', 'lunar phases', 'elongation', 'eclipse', 'synodic period', 'retrograde', 'opposition', 'conjunction', 'standstill'],
  prereq: ['ecliptic-and-galactic-coordinates', 'the-suns-path'],
  related: ['sky-coordinate-transformations', 'the-planisphere', 'astronomy-and-planetary-maps', 'all-sky-charts'],
  body: `The Sun, Moon and planets are not scattered over the sky. They keep to a belt a few degrees wide round the ecliptic, the **zodiac**. The reason is physical: the solar system condensed from a spinning disc, and the planes of the planets' orbits are within a few degrees of the plane of the Earth's orbit, which is what the ecliptic is. The inclinations to the ecliptic are:

| body | inclination | body | inclination |
|---|---|---|---|
| Mercury | 7.0° | Saturn | 2.5° |
| Venus | 3.4° | Uranus | 0.8° |
| Mars | 1.9° | Neptune | 1.8° |
| Jupiter | 1.3° | **Moon** | **5.1°** |

Seen from the Earth the planets can stray a little farther than these figures when they are near (Venus reaches 8.7° from the ecliptic, Mars 6.8°), but all stay in a band about 17° wide: a planet is always in the zodiac, which is why the drawing below plots all of them against longitude.

### The Moon
The Moon circles the Earth in 27.32 days (the *sidereal month*), moving 13.2° a day eastward among the stars, about 0.5° (its own diameter) an hour. Its orbit is a great circle tilted $i = 5.145°$ to the ecliptic, so its latitude is
$$\\sin\\beta = \\sin i\\,\\sin u,$$
where $u$ is its angle along the orbit from the **ascending node**, where it crosses the ecliptic going north. That is a sine wave in longitude, exactly the curve the construction draws from a circle. The nodes are not fixed: they slide westwards once round in 18.6 years, which is also the period of the Moon's greatest and least declination (from $\\varepsilon + i = 28.6°$ to $\\varepsilon - i = 18.3°$; the extreme "major standstill" was in 2024–25).

The **phases** depend on the angle between Moon and Sun, the *elongation* $e$: new at 0°, quarter at 90°, full at 180°, and the lit fraction is $k = (1 - \\cos e)/2$. The Moon gains on the Sun at $360°/29.53\\ \\text{d} = 12.2°$ a day, so the *synodic month* from new Moon to new Moon is 29.53 days. At new and full Moon the Moon is in line with the Sun; whether that gives an **eclipse** depends on its latitude: a solar eclipse needs the new Moon within about 15–18° of a node, a lunar eclipse needs the full Moon within about 10–12°. The Sun passes a node every 173.3 days, so there are two eclipse seasons a year.

### The planets
An *inferior* planet (Mercury, Venus) never strays far from the Sun: the greatest elongation is about 28° for Mercury and 47° for Venus. A *superior* planet (Mars … Neptune) can be at any elongation, and at **opposition**, 180° from the Sun, it is nearest and brightest. Each moves eastward most of the time, but around opposition the faster-moving Earth overtakes it and it appears to go backwards for a while, **retrograde**, tracing a loop whose width is set by its latitude. The interval between two oppositions is the **synodic period**: $1/S = |1/P - 1/E|$ with $P$ the planet's year and $E$ the Earth's.

> [!fact] The twelve zodiac "signs" of 30° do not coincide with the constellations of the same names; the ecliptic crosses 13 constellations of very unequal length, including Ophiuchus. Astrologers divide the ecliptic into equal signs counted from the equinox, which has slid about 30° since the signs were named.`,
  ideas: [
    'The planets and the Moon stay within a few degrees of the ecliptic because their orbits lie nearly in the plane of the Earth\'s: the zodiacal band.',
    'The Moon\'s orbit is tilted 5.145° to the ecliptic, so its latitude is a sine wave in longitude; the nodes, where it crosses, regress once round in 18.6 years.',
    'The phase is set by the elongation e from the Sun: the lit fraction is (1 − cos e)/2; the synodic month is 29.53 days.',
    'An eclipse needs the new or full Moon to be near a node, giving two eclipse seasons a year.',
    'Planets show retrograde loops when the Earth overtakes them; the synodic period 1/S = |1/P − 1/E| gives the time between oppositions.'
  ],
  pitfalls: [
    'The Moon\'s phase is the shadow of the Earth — The phases are the changing view of the lit half of the Moon; the Earth\'s shadow falls on the Moon only in a lunar eclipse, at full Moon.',
    'There is an eclipse every month — The Moon\'s orbit is tilted 5° to the ecliptic, so at most new Moons the Moon passes north or south of the Sun\'s disc, and only near a node does the alignment occur.',
    'A planet moving backwards really reverses — The retrograde loop is a projection effect: the Earth, on an inside track, overtakes a superior planet, and the line of sight to it swings back for a while.'
  ],
  formulas: [
    {
      name: 'Fraction of the Moon lit',
      expr: 'k = (1 - cos(elong))/2',
      tex: 'k = \\frac{1 - \\cos e}{2}',
      vars: {
        k: { name: 'fraction of the disc lit', min: 0, max: 1 },
        elong: { name: 'elongation of the Moon from the Sun', q: 'angle', unit: '°', value: 60, min: 0, max: 180, tex: 'e' }
      },
      solveFor: 'k',
      note: 'At e = 90° (the quarter) k = 0.5; at 60°, 0.25. The bright side faces the Sun and its tips point away from it.'
    },
    {
      name: 'Synodic period of a planet',
      expr: 'S = E*P/(P - E)',
      tex: 'S = \\frac{E\\,P}{P - E}',
      vars: {
        S: { name: 'synodic period', q: 'time', unit: 'day' },
        P: { name: 'sidereal period of the outer planet', q: 'time', unit: 'day', value: 686.98 },
        E: { name: 'sidereal year of the Earth', q: 'time', unit: 'day', value: 365.256 }
      },
      solveFor: 'S',
      note: 'For a planet outside the Earth\'s orbit (P > E); this is 1/S = 1/E − 1/P. The default is Mars: 779.9 days, 2 years and 49 days; Jupiter gives 398.9 days, Saturn 378.1. For Venus and Mercury, with P < E, use 1/S = 1/P − 1/E: 583.9 and 115.9 days. For the Moon, 1/S = 1/27.32 − 1/365.26 gives the synodic month, 29.53 days.'
    },
    {
      name: 'Latitude of the Moon',
      expr: 'sin(beta) = sin(inc)*sin(u)',
      tex: '\\sin\\beta = \\sin i\\sin u',
      vars: {
        beta: { name: 'ecliptic latitude of the Moon', q: 'angle', unit: '°', signed: true, min: -90, max: 90, tex: '\\beta' },
        inc: { name: 'inclination of the Moon\'s orbit to the ecliptic', q: 'angle', unit: '°', value: 5.145, min: 0, max: 30, fixed: true, tex: 'i' },
        u: { name: 'angle along the orbit from the ascending node', q: 'angle', unit: '°', value: 90, min: 0, max: 360 }
      },
      solveFor: 'beta',
      note: 'The simple orbit; the real latitude differs by up to 0.17° because of the Sun\'s pull. At u = 90° the Moon is 5.1° north of the ecliptic.'
    },
    {
      name: 'Greatest declination of the Moon',
      expr: 'dmax = eps + inc',
      tex: '\\delta_{\\max} = \\varepsilon + i',
      vars: {
        dmax: { name: 'greatest declination of the Moon', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\delta_{\\max}' },
        eps: { name: 'obliquity of the ecliptic', q: 'angle', unit: '°', value: 23.44, min: 0, max: 90, tex: '\\varepsilon' },
        inc: { name: 'inclination of the Moon\'s orbit', q: 'angle', unit: '°', value: 5.145, min: 0, max: 30, tex: 'i' }
      },
      solveFor: 'dmax',
      note: 'Reached when the ascending node is at the vernal equinox (once in 18.6 years), 28.6°; when the node is at the autumnal equinox the greatest declination is only ε − i = 18.3°.'
    }
  ],
  examples: [
    {
      title: 'When is Mars next at opposition?',
      q: 'Mars goes round the Sun in 686.98 days, the Earth in 365.256. How long between two oppositions? If Mars was at opposition on 16 January 2025, about when is the next?',
      steps: [
        { text: 'The synodic period:', tex: '\\frac{1}{S} = \\frac{1}{365.256} - \\frac{1}{686.98} = 0.0027379 - 0.0014556 = 0.0012823,\\quad S = 779.9\\ \\text{d}' },
        'That is 2 years and 49 days. Adding it to 16 January 2025 gives about 7 March 2027.',
        'The actual opposition is on 19 February 2027, 16 days earlier: Mars\'s orbit is noticeably elliptical, its speed varies, and the interval between oppositions ranges from 764 to about 810 days. The oppositions near Mars\'s perihelion (every 15 to 17 years) are the closest ones.'
      ],
      a: '779.9 days on average; the next opposition is on 19 February 2027.'
    },
    {
      title: 'How old is a Moon that is 10 % lit?',
      q: 'A thin waxing crescent has 10 % of its disc lit. What is its elongation from the Sun, and about how old is it?',
      steps: [
        { text: 'From $k = (1 - \\cos e)/2$:', tex: '\\cos e = 1 - 2k = 0.8,\\quad e = 36.9°' },
        'The Moon gains on the Sun at 360°/29.53 d = 12.19° a day, so its age is $36.9/12.19 = 3.0$ days. It sets soon after the Sun in the west, horns pointing up-left (to the east, away from the Sun).'
      ],
      a: 'Elongation 36.9°, about 3 days after new Moon.'
    }
  ],
  quiz: [
    { q: 'How large is the angle between the Moon and the Sun (the elongation) at the first quarter?', answer: 90, unit: '°', why: 'The Moon is a quarter of the way round its orbit from the Sun: 90° east of it, with half its disc lit.' },
    { q: 'Why is there not a solar eclipse every new Moon?', choices: ['the Moon is too small', 'the Moon\'s orbit is tilted 5° to the ecliptic, so the Moon usually passes above or below the Sun', 'the Earth\'s shadow does not reach the Moon', 'the Moon is farthest away at new Moon'], a: 1, why: 'The alignment needs the new Moon near a node, where the orbit crosses the ecliptic, which happens only twice a year. At other new Moons its latitude is a degree or more.' },
    { q: 'A planet appears to move backwards (retrograde) when', choices: ['it passes between the Earth and the Sun', 'the Earth overtakes it on the inside track', 'it reverses its orbit', 'it is eclipsed'], a: 1, why: 'A superior planet moves more slowly than the Earth; near opposition the Earth gains on it and the line of sight swings backwards among the stars for a few weeks.' },
    { q: 'The synodic period of Venus is longer than its orbital period of 224.7 days.', a: true, why: '1/S = 1/224.7 − 1/365.26 gives S = 583.9 days: for an inferior planet too, the Earth\'s motion forces a longer interval to come back to the same alignment.' },
    { q: 'The Moon\'s greatest declination can reach', choices: ['18.3°', '23.4°', '28.6°', '90°'], a: 2, why: 'ε + i = 23.44° + 5.14° = 28.6° when the ascending node is at the vernal equinox; it was so in 2024–25.' }
  ],
  applications: [
    'Eclipse prediction: the Saros and the Metonic cycle are built from the Moon\'s phase period, node period and anomalistic period.',
    'Calendars: the lunar calendars of the Islamic and Jewish traditions follow the synodic month; the Metonic cycle fits 235 months to 19 years.',
    'Observing planets: the almanac gives the elongation and ecliptic latitude; the planet will be in the zodiac band, near the ecliptic line drawn on any chart.',
    'Navigation and tides: the Moon\'s position and phase set the tides; lunar distances were once used to find longitude.',
    'Star charts and planispheres draw the ecliptic as a line on which the almanac planets are placed with a ruler and a protractor.'
  ],
  history: `The Babylonians followed the planets along the ecliptic and divided it into twelve signs of 30° by the fifth century BC. The Greeks gave the planets their geometric explanations: Eudoxus' spheres, Apollonius' epicycles, Hipparchus' eccentric and epicycle theory of the Moon, and Ptolemy's equant for the planets. The Moon's node and its 18.6-year cycle were understood early (the Saros of 223 months was known to the Babylonians). In the *Almagest* Ptolemy gave the Moon's inclination as 5°, within 0.15° of the true value. Kepler's laws (1609 and 1619) made the planetary loops the simple consequence of two bodies on ellipses, and the modern positions used here follow from simple orbital elements of the kind that Paul Schlyter published for amateur use.`,
  sources: ['Jean Meeus, *Astronomical Algorithms* (2nd ed., 1998), chapters 36 (the Moon) and 33 (planets).', 'Peter Duffett-Smith and Jonathan Zwart, *Practical Astronomy with your Calculator or Spreadsheet* (4th ed., 2011), the chapters on the Moon and the planets.', 'G. J. Toomer (ed.), *Ptolemy\'s Almagest* (1984), books IV, V and IX–XI.', 'James Evans, *The History and Practice of Ancient Astronomy* (1998), chapters 6–8.', 'Paul Schlyter, "How to compute planetary positions" (web document).'],
  sim: 'cs-moon-month',
  construction: 'cs-moon-planet-bands'
},

{
  id: 'rising-setting-and-circumpolar',
  parent: 'the-celestial-sphere',
  title: 'Rising, setting and circumpolar stars',
  level: 2,
  short: `A star's daily circle meets the horizon or it does not. Where it does, the star rises and sets at times and places given by one equation, cos H₀ = −tan φ tan δ; where it does not, the star is circumpolar or never rises.`,
  keywords: ['rising', 'setting', 'circumpolar', 'never rises', 'daily circle', 'semi-diurnal arc', 'azimuth of rising', 'horizon', 'transit', 'refraction', 'day length'],
  prereq: ['sidereal-time-and-hour-angle', 'horizon-coordinates'],
  related: ['the-suns-path', 'polar-star-charts', 'sun-path-diagrams', 'sky-coordinate-transformations'],
  body: `The sky turns about the celestial pole, and every star travels on its **daily circle**, a parallel of declination $\\delta$. Whether that circle rises above your horizon depends on one thing, the angle between the pole and your zenith, which is $90° - \\varphi$.

### When does a star rise?
A star is above the horizon when its altitude is positive: $\\sin h = \\sin\\varphi\\sin\\delta + \\cos\\varphi\\cos\\delta\\cos H > 0$. At the instant of rising or setting $h = 0$, so
$$\\cos H_0 = -\\tan\\varphi\\,\\tan\\delta .$$
The star rises at hour angle $-H_0$, crosses the meridian at $H = 0$ and sets at $+H_0$; the **semi-diurnal arc** is $H_0$ and the star is up for $2H_0/15°$ sidereal hours. With the sidereal time of transit equal to the right ascension $\\alpha$, it rises when the sidereal time is $\\alpha - H_0$ and sets at $\\alpha + H_0$ (in hours).

### The three cases
- If $|\\tan\\varphi\\tan\\delta| < 1$ the equation has an answer: the star **rises and sets**.
- If $\\delta > 90° - \\varphi$ (north, for a northern observer) the right side is below −1 and the star is **circumpolar**: its circle lies wholly above the horizon and it never sets. At London ($\\varphi = 51.5°$) every star north of $+38.5°$ is circumpolar: Dubhe and Capella; at Tel Aviv (32.1°) those north of $+57.9°$.
- If $\\delta < -(90° - \\varphi)$ the star **never rises**: Acrux ($\\delta = -63.1°$) is never seen north of latitude 26.9°.
The special cases: at the equator every star is up for exactly 12 sidereal hours and rises and sets vertically; at a pole nothing rises or sets, the altitude of each star is its declination, and half the sky is always in view.

### Where it rises
Setting $h = 0$ in the triangle gives the azimuth from north of the rising point, in the east:
$$\\cos A = \\frac{\\sin\\delta}{\\cos\\varphi}.$$
A star on the celestial equator rises due east at any latitude; one north of it rises north of east, one south of it south of east, and the farther from the equator the more so. Sirius ($\\delta = -16.7°$) rises 27.5° south of east at London and sets 27.5° south of west.

### The real horizon
The numbers above are for the geometric horizon. Refraction lifts a star at the horizon by about 34′, so it is seen when its true altitude is −0.57°; for the Sun's upper edge the limit is −0.83°. A real horizon of hills or buildings delays a rising by minutes, more at high latitude, where the daily circle meets the horizon at a shallow angle. The chart of rising and setting through the year is the simulation below.

> [!tip] The shape of the daily circle on the dome is why the seasonal sky changes with latitude: the farther north you are, the more of the northern sky is circumpolar and the more of the southern sky is never seen.`,
  ideas: [
    'A star\'s daily circle meets the horizon at hour angle ±H₀ with cos H₀ = −tan φ tan δ; it rises, crosses the meridian and sets symmetrically about the transit.',
    'If δ > 90° − φ the star never sets (circumpolar); if δ < −(90° − φ) it never rises; otherwise it is up for 2H₀/15 sidereal hours.',
    'A star rises at azimuth A from north with cos A = sin δ / cos φ: due east for δ = 0, farther north for δ > 0.',
    'At the equator every star is up 12 hours; at a pole nothing rises or sets.',
    'Refraction (34′ at the horizon) and the local horizon change the times by minutes.'
  ],
  pitfalls: [
    'All stars rise in the east and set in the west — Only stars on the celestial equator rise due east; the rising point moves north of east for northern stars and south for southern ones, and circumpolar stars neither rise nor set.',
    'A star is up for 12 hours at every latitude — That is true only for δ = 0, or at the equator. At London a star of declination −20° is up less than 8 hours, one of +20° for 16.',
    'Circumpolar stars are those near the pole star — The circumpolar limit is 90° − φ from the pole; at the equator no star is circumpolar, at London every star within 38.5° of the pole is.'
  ],
  formulas: [
    {
      name: 'Hour angle of rising and setting',
      expr: 'cos(H0) = -tan(phi)*tan(dec)',
      tex: '\\cos H_0 = -\\tan\\varphi\\tan\\delta',
      vars: {
        H0: { name: 'semi-diurnal arc (hour angle of setting)', q: 'angle', unit: '°', min: 0, max: 180 },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 51.5, signed: true, min: -85, max: 85, tex: '\\varphi' },
        dec: { name: 'declination of the star', q: 'angle', unit: '°', value: -16.72, signed: true, min: -85, max: 85, tex: '\\delta' }
      },
      solveFor: 'H0',
      note: 'The default is Sirius at London: H₀ = 67.8°. There is no answer when |tan φ tan δ| ≥ 1: the star is circumpolar or never rises.'
    },
    {
      name: 'Time a star is above the horizon',
      expr: 'T = 24*H0/pi',
      tex: 'T = 2\\frac{H_0}{15^{\\circ}/\\mathrm{h}}',
      vars: {
        T: { name: 'time above the horizon (sidereal hours)', q: false, unit: 'h' },
        H0: { name: 'semi-diurnal arc', q: 'angle', unit: '°', value: 67.81, min: 0, max: 180 }
      },
      solveFor: 'T',
      note: 'The arc 2H₀ divided by 15° per hour. In clock hours multiply by 0.99727. Sirius at London: 9.04 sidereal hours.'
    },
    {
      name: 'Azimuth of rising',
      expr: 'cos(A) = sin(dec)/cos(phi)',
      tex: '\\cos A = \\frac{\\sin\\delta}{\\cos\\varphi}',
      vars: {
        A: { name: 'azimuth of the rising point from north', q: 'angle', unit: '°', min: 0, max: 180 },
        dec: { name: 'declination', q: 'angle', unit: '°', value: -16.72, signed: true, min: -85, max: 85, tex: '\\delta' },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 51.5, signed: true, min: -60, max: 60, tex: '\\varphi' }
      },
      solveFor: 'A',
      note: 'The setting point is at 360° − A. Valid only if the star does rise.'
    },
    {
      name: 'Circumpolar limit',
      expr: 'dlim = pi/2 - abs(phi)',
      tex: '\\delta_{\\lim} = 90^{\\circ} - |\\varphi|',
      vars: {
        dlim: { name: 'declination beyond which a star never sets', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\delta_{\\lim}' },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 51.5, signed: true, min: -90, max: 90, tex: '\\varphi' }
      },
      solveFor: 'dlim',
      note: 'In the northern hemisphere stars with δ above this are circumpolar and those with δ below −δ_lim never rise. London: 38.5°.'
    }
  ],
  examples: [
    {
      title: 'Sirius at London',
      q: 'Sirius has declination −16.72° and right ascension 6 h 45.1 m. At London (51.5° N), how long is it above the horizon, where does it rise, and how high does it climb?',
      steps: [
        { text: 'The semi-diurnal arc:', tex: '\\cos H_0 = -\\tan 51.5°\\tan(-16.72°) = +0.3776,\\quad H_0 = 67.8°' },
        'It is up for $2 \\times 67.8°/15 = 9.04$ sidereal hours, i.e. 9 h 01 m of clock time: a short day for the brightest star, because it is south of the equator.',
        { text: 'It rises at the azimuth:', tex: '\\cos A = \\frac{\\sin(-16.72°)}{\\cos 51.5°} = -0.4623,\\quad A = 117.5°' },
        'That is 27.5° south of east; it sets at $242.5°$, south of west. It transits at an altitude of $90° - 51.5° - 16.72° = 21.8°$: low, so it twinkles and is reddened by the thick air near the horizon.'
      ],
      a: 'Up 9 h; rises at azimuth 117.5° (27.5° south of east); highest 21.8°.'
    },
    {
      title: 'Which stars never set, and which never rise?',
      q: 'For Capella (δ = +46.0°), Dubhe (+61.7°) and Rigil Kentaurus (α Centauri, −60.8°), say what each does at London and at Tel Aviv (32.07° N).',
      steps: [
        'London: the circumpolar limit is $90° - 51.5° = 38.5°$. Capella (46°) and Dubhe (61.7°) both exceed it: circumpolar. Rigil Kentaurus is below −38.5°: never rises.',
        'Tel Aviv: the limit is $90° - 32.07° = 57.9°$. Dubhe (61.7°) is just circumpolar; Capella (46°) rises and sets. Rigil Kentaurus lies below −57.9° and never rises (its highest altitude would be −2.9°): from latitude 32° the nearest star to the Sun is out of sight.',
        { text: 'For Capella at Tel Aviv:', tex: '\\cos H_0 = -\\tan 32.07°\\tan 46.0° = -0.6479,\\quad H_0 = 130.4°,\\quad T = 17.4\\ \\text{h}' }
      ],
      a: 'London: Capella and Dubhe circumpolar, Rigil Kentaurus never rises. Tel Aviv: Dubhe circumpolar, Capella up 17.4 h, Rigil Kentaurus never rises.'
    }
  ],
  quiz: [
    { q: 'At what latitude is a star of declination +30° just circumpolar?', answer: 60, unit: '°', why: 'The condition is $\\delta > 90° - \\varphi$; with δ = 30° the limit is φ = 60°. North of 60° the star never sets.' },
    { q: 'A star on the celestial equator is above the horizon for', choices: ['12 sidereal hours at every latitude', '12 hours only at the equator', 'more than 12 hours in the north', 'a time depending on its right ascension'], a: 0, why: 'For δ = 0, $\\cos H_0 = 0$ and $H_0 = 90°$ at every latitude: up for exactly 12 sidereal hours.' },
    { q: 'At the North Pole, stars rise and set.', a: false, why: 'At the pole, $\\varphi = 90°$, so $90° - \\varphi = 0°$: every star with positive declination is circumpolar and every one with negative declination never rises; the stars circle parallel to the horizon.' },
    { q: 'A star of declination −50° never rises at London (51.5° N).', a: true, why: 'The never-rises limit is $-(90° - 51.5°) = -38.5°$, and −50° lies south of it: even at its highest the star is 11.5° below the horizon.' },
    { q: 'The Sun in midsummer rises at azimuth', choices: ['exactly east', 'north of east', 'south of east', 'due north'], a: 1, why: 'Its declination is +23.4°, so cos A = sin δ / cos φ > 0 gives A < 90°: north of east, by 28° at Tel Aviv and 40° at London.' }
  ],
  applications: [
    'Planning observations: a star is observable at night only when it is up, and the semi-diurnal arc tells how long.',
    'Time-keeping in the nights of the ancients: the rising of Sirius (the heliacal rising) marked the Egyptian year; rising and setting stars served as a clock (the decans).',
    'Navigation: the direction of a rising star is a compass; sailors learned the rising points of many stars (the "star compass" of Polynesian navigators).',
    'Architecture and archaeology: temples and tombs are aligned to rising points of the Sun or a star; the azimuth formula checks it.',
    'Satellite and telescope scheduling: when an object clears the horizon is the visibility window.'
  ],
  history: `The Egyptians of the Old Kingdom told the hours of the night by thirty-six "decan" stars, each rising about ten days later than the one before it: a star rises about four minutes earlier each night, so after ten days it marks a different hour. The Greeks proved the geometry. Autolycus of Pitane (about 310 BC), in *On the Moving Sphere* and *On Risings and Settings*, treated the circumpolar circle and the risings of stars as theorems; Hipparchus and Ptolemy computed, for each latitude, which degrees of the ecliptic rise together. Polynesian navigators memorised the rising and setting points of stars as a compass of 32 "houses". Spherical trigonometry reduced all this to the one formula given above.`,
  sources: ['Jean Meeus, *Astronomical Algorithms* (2nd ed., 1998), chapter 15, "Rising, transit and setting".', 'Peter Duffett-Smith and Jonathan Zwart, *Practical Astronomy with your Calculator or Spreadsheet* (4th ed., 2011).', 'James Evans, *The History and Practice of Ancient Astronomy* (1998), chapters 1 and 3.', 'G. J. Toomer (ed.), *Ptolemy\'s Almagest* (1984), book II on risings and settings for different latitudes.'],
  sim: 'cs-rise-set-year',
  construction: 'cs-diurnal-circles'
},

{
  id: 'precession-and-the-moving-pole',
  parent: 'the-celestial-sphere',
  title: 'Precession: the slowly moving pole',
  level: 3,
  short: `The Earth's axis turns like a leaning top, once in about 25 800 years, so the celestial pole travels on a circle of 23.44° round the pole of the ecliptic and the equinoxes slide along it by 1° in 72 years. Every right ascension and declination slowly changes with it.`,
  keywords: ['precession', 'equinoxes', 'pole star', 'Thuban', 'Polaris', 'Vega', 'Great Year', 'epoch', 'J2000', 'tropical year', 'sidereal year', 'nutation', 'obliquity', 'Hipparchus'],
  prereq: ['ecliptic-and-galactic-coordinates', 'equatorial-coordinates'],
  related: ['hipparchus-and-ptolemy-sky', 'the-astrolabe', 'polar-star-charts', 'physics:torque', 'physics:angular-momentum'],
  body: `The celestial pole is not fixed. It moves, very slowly, among the stars, and with it the celestial equator and the equinoxes. The motion is **precession**, and it is the same as that of a spinning top that leans over: the axis of rotation does not stay still but sweeps a cone.

### The cause
The Earth is not a sphere but bulges at the equator by 21 km, and the equatorial bulge is tilted 23.44° to the ecliptic. The Sun and the Moon pull on the near side of the bulge harder than on the far side, and the result is a **torque** that tries to straighten the Earth's axis up. A spinning body responds to a torque not by tipping but by turning its axis sideways (see [[physics:torque]] and [[physics:angular-momentum]]), so the axis precesses round the pole of the ecliptic K on a cone of half-angle $\\varepsilon = 23.44°$. The Moon contributes about two-thirds of the effect, the Sun one-third. The period is about **25 772 years**, the rate $p = 50.29″$ a year in ecliptic longitude.

### What it does to coordinates
- The vernal equinox slides westwards along the ecliptic at 50.29″ a year, 1° in 71.6 years, a full turn in 25 772 years. Every star's ecliptic **longitude** increases at that rate; its **latitude** does not change.
- The equatorial coordinates change in a way that depends on where the star is: to first order, per year,
$$\\Delta\\alpha = m + n\\sin\\alpha\\tan\\delta,\\qquad \\Delta\\delta = n\\cos\\alpha,$$
with $m = 3.075$ s and $n = 20.04″$ ($1.336$ s). That is why a catalogue gives an **epoch**, J2000.0, and why an old chart's grid is slightly off.
- The pole travels past different stars. It was near **Thuban** in Draco in about 2800 BC (the time of the pyramids), is within 0.5° of **Polaris** in AD 2100, will pass 2° from Errai (γ Cephei) around AD 4100, near Alderamin about AD 7500, and about 5° from the brilliant **Vega** around AD 13 800. In between, there is no pole star.
- The **tropical year** (equinox to equinox, 365.2422 days) is 20 minutes shorter than the **sidereal year** (365.2564 days), by 1/25 772 of a year. Our calendar follows the tropical year, so the seasons stay put while the stars drift.
- The "signs" of the zodiac, counted from the equinox, have slid about 30° from the constellations they were named for.

### Other wobbles
Superimposed on precession is **nutation**, a nodding of the pole with an 18.6-year period and an amplitude of 9.2″ (the Moon's orbit also precesses), and a slow change of the obliquity itself, which varies between about 22.1° and 24.5° with a period of 41 000 years and is now decreasing by 47″ a century.

> [!why] For the drawing: the celestial pole goes round the circle of radius 23.44° centred on the ecliptic pole K. A chart centred on K therefore keeps the stars still and lets the pole walk round them — the construction below, and the simulation, show exactly that.`,
  ideas: [
    'The Earth\'s axis precesses round the pole of the ecliptic on a cone of 23.44° in about 25 772 years, driven by the torque of the Sun and Moon on the equatorial bulge.',
    'The equinoxes slide westwards along the ecliptic 50.29″ a year (1° in 72 years), so ecliptic longitudes increase and latitudes stay put.',
    'Right ascension and declination change at rates that depend on position, Δα = m + n sin α tan δ and Δδ = n cos α; catalogues quote an epoch (J2000.0).',
    'The pole was near Thuban in 2800 BC, is near Polaris now (closest AD 2100) and will approach Vega around AD 13 800.',
    'The tropical year is 20 minutes shorter than the sidereal year by precession; nutation adds a nodding of ±9″ every 18.6 years.'
  ],
  pitfalls: [
    'Precession changes the tilt of the Earth\'s axis — It changes only the direction of the axis, which sweeps a cone with fixed half-angle ε; the obliquity itself varies far more slowly, by a degree or two in 41 000 years.',
    'Polaris has always been the pole star — Polaris is close to the pole only for a few centuries; 4800 years ago it was Thuban, and in 12 000 years it will be Vega.',
    'Precession is the same as nutation — Precession is the steady 50″ a year; nutation is a small periodic nodding (±9″, period 18.6 years) superimposed on it.'
  ],
  formulas: [
    {
      name: 'Period of the precession',
      expr: 'T = 360*3600/p',
      tex: 'T = \\frac{360^{\\circ}\\times 3600″}{p}',
      vars: {
        T: { name: 'period of precession', q: false, unit: 'yr' },
        p: { name: 'rate of precession in longitude', q: false, unit: '″/yr', value: 50.29 }
      },
      solveFor: 'T',
      note: '50.29″ a year gives 25 770 years; with Hipparchus\'s estimate of 1° per century (36″ a year) you would get 36 000 years.'
    },
    {
      name: 'Shift of ecliptic longitude',
      expr: 'dlam = p*t/3600',
      tex: '\\Delta\\lambda = \\frac{p\\,t}{3600}',
      vars: {
        dlam: { name: 'change of ecliptic longitude', q: false, unit: '°', tex: '\\Delta\\lambda' },
        p: { name: 'rate of precession', q: false, unit: '″/yr', value: 50.29 },
        t: { name: 'time elapsed', q: false, unit: 'yr', value: 2155 }
      },
      solveFor: 'dlam',
      note: 'Since 130 BC (Hipparchus\'s Spica observation) the longitude of every star has grown by 30.1°.'
    },
    {
      name: 'Change of declination',
      expr: 'dd = n*cos(ra)*t/3600',
      tex: '\\Delta\\delta = \\frac{n\\cos\\alpha\\;t}{3600}',
      vars: {
        dd: { name: 'change of declination', q: false, unit: '°', signed: true, tex: '\\Delta\\delta' },
        n: { name: 'precession constant n', q: false, unit: '″/yr', value: 20.04 },
        ra: { name: 'right ascension of the star', q: 'angle', unit: '°', value: 187.6, min: 0, max: 360, tex: '\\alpha' },
        t: { name: 'time elapsed', q: false, unit: 'yr', value: 2153 }
      },
      solveFor: 'dd',
      note: 'To first order. Stars at α = 0 h gain declination at 20″ a year, those at 12 h lose it, and those at 6 h and 18 h are unchanged. Spica (α ≈ 12.5 h) has lost about 11.5° since Hipparchus.'
    }
  ],
  examples: [
    {
      title: 'Hipparchus finds the precession',
      q: 'Timocharis recorded Spica 8° before the autumn equinox in about 280 BC; Hipparchus measured it 6° before in about 130 BC. What precession rate and what period follow?',
      steps: [
        'The star\'s longitude relative to the equinox grew by 2° in 150 years, i.e. $2/150 = 0.0133°$ a year $= 48″$ a year (Hipparchus himself said at least 36″, 1° a century, to be on the safe side).',
        { text: 'The period of a full turn would be', tex: 'T = \\frac{360°}{0.0133°/\\mathrm{yr}} = 27\\,000\\ \\text{years}' },
        'The true figure, 25 770 years, is within 5 %: remarkable for two observations made with the naked eye and a sighting instrument 150 years apart. Ptolemy confirmed Hipparchus by comparison with his own measures and adopted 1° per century.'
      ],
      a: 'About 48″ a year, a period of about 27 000 years (true values 50.29″ and 25 770 years).'
    },
    {
      title: 'Thuban and Polaris',
      q: 'The pole was closest to Thuban in about 2830 BC and will be closest to Polaris in about AD 2100. How far did it travel round the precession circle, and how far apart are the two stars?',
      steps: [
        'The time is $2830 + 2100 = 4930$ years. At $360°/25\\,772$ years, the pole moved round K by $4930 \\times 0.013969° = 68.9°$.',
        { text: 'The two positions are separated by a chord of the precession circle of radius ε:', tex: '2\\varepsilon\\sin(68.9°/2) = 2\\times 23.44°\\times 0.566 = 26.5°' },
        'Thuban ($\\alpha = 14.07$ h, $\\delta = +64.38°$) and Polaris (2.53 h, +89.26°) are $26.4°$ apart by the spherical cosine rule: the two agree.'
      ],
      a: '68.9° round the circle; the two stars are 26.4° apart.'
    }
  ],
  quiz: [
    { q: 'The period of precession is about', choices: ['72 years', '2000 years', '26 000 years', '4.6 billion years'], a: 2, why: 'The axis turns through 360° at 50.29″ a year: 360°×3600″ / 50.29″ ≈ 25 770 years, called the Great Year.' },
    { q: 'Over a century precession increases a star\'s ecliptic longitude by about', answer: 1.4, unit: '°', why: '50.29″ × 100 = 5029″ = 1.397°.' },
    { q: 'Precession leaves unchanged a star\'s', choices: ['right ascension', 'declination', 'ecliptic latitude', 'galactic longitude'], a: 2, why: 'Precession moves the equator and equinox but not the ecliptic: stars keep their distance from the ecliptic, so their ecliptic latitude is constant.' },
    { q: 'Vega will be the pole star around the year', choices: ['AD 2100', 'AD 4100', 'AD 13 800', '12 000 BC'], a: 2, why: 'Half a turn of the precession circle (about 12 900 years) after Polaris comes Vega: the pole passes about 5° from it around AD 13 800.' },
    { q: 'The tropical year is shorter than the sidereal year because of precession.', a: true, why: 'The equinoxes move westwards towards the Sun by 50″ a year, so the Sun gets back to the equinox 20 minutes before it gets back to the same star.' }
  ],
  applications: [
    'Star catalogues give an epoch (J2000.0): to point a telescope for tonight, software precesses the catalogue place to the date.',
    'Calendars: the Gregorian calendar follows the tropical year (365.2422 days) so that the seasons stay fixed, which is the effect of precession on the year.',
    'Navigation by Polaris: the pole star\'s offset from the true pole (now 0.7°, down to 0.46° in 2100) is corrected in the Polaris tables of the almanac.',
    'Archaeoastronomy: alignments of temples and pyramids to stars can be dated by finding the epoch at which a star rose or set at the aligned azimuth.',
    'Instrument design: the rete of an astrolabe has to be re-made every few centuries, as the star pointers move relative to the ecliptic ring by a degree in 72 years.'
  ],
  history: `Hipparchus discovered precession about 130 BC, by comparing his own observations of Spica with those of Timocharis made 150 years earlier, and confirmed it with other stars from the records of Aristyllus and Timocharis; he thought the shift was at least 1° per century, and wrote a book *On the displacement of the solstitial and equinoctial points*, now lost. Ptolemy adopted 1° per century, which made all his star longitudes consistent with Hipparchus' but was too slow by a third. In the ninth century Thabit ibn Qurra proposed a "trepidation", an oscillation instead of a steady drift, which confused astronomy for centuries, until the observations of the sixteenth and seventeenth centuries showed a steady drift and Newton (1687) explained it as the torque of the Sun and Moon on the Earth's equatorial bulge. Bessel's *Fundamenta astronomiae* (1818) fixed the modern constants, and nutation was announced by James Bradley in 1748.`,
  sources: ['Jean Meeus, *Astronomical Algorithms* (2nd ed., 1998), chapter 21, "Precession".', 'Peter Duffett-Smith and Jonathan Zwart, *Practical Astronomy with your Calculator or Spreadsheet* (4th ed., 2011), the section on precession.', 'G. J. Toomer (ed.), *Ptolemy\'s Almagest* (1984), book VII.2 on Hipparchus\' discovery of precession.', 'James Evans, *The History and Practice of Ancient Astronomy* (1998), chapter 7.', 'Nick Kanas, *Star Maps: History, Artistry and Cartography* (2nd ed., 2012), on updating catalogues for precession.'],
  sim: 'cs-precession',
  construction: 'cs-precession-circle'
}
);
