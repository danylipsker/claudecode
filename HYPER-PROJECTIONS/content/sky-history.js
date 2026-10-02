/* HYPER-PROJECTIONS · content/sky-history.js — the topic "Charting the sky through history".
 *
 *   hipparchus-and-ptolemy-sky   the first star catalogue, the six classes of brightness, the discovery of precession
 *   islamic-astrolabe-makers     the astrolabe: its parts, its stereographic geometry, the makers of Baghdad, Toledo and Isfahan
 *   durer-star-maps-1515         the first printed star maps: an ecliptic pole at the centre of each hemisphere
 *   modern-star-atlases          from Bayer's Uranometria to the digital sky
 * Simulations are in sims/sky-history.js, constructions in constructions/sky-history.js.
 */
Hyper.add(
{
  id: 'hipparchus-and-ptolemy-sky',
  parent: 'sky-history',
  title: 'Hipparchus, Ptolemy and the first star catalogue',
  level: 2,
  short: `Hipparchus listed the stars with their places and sorted them into six classes of brightness; he noticed that they all drift against the equinox, the discovery of precession. Ptolemy's catalogue of 1022 stars in 48 constellations carried the work to the Middle Ages and to Dürer.`,
  keywords: ['Hipparchus', 'Ptolemy', 'Almagest', 'star catalogue', 'magnitude', 'six classes', 'Pogson', 'precession', 'Spica', 'ecliptic coordinates', '48 constellations', 'Timocharis'],
  prereq: ['celestial-sphere', 'ecliptic-and-galactic-coordinates'],
  related: ['precession-and-the-moving-pole', 'islamic-astrolabe-makers', 'stereographic-projection', 'durer-star-maps-1515', 'ptolemys-geography'],
  body: `The first thing one does with a sky is to list what is in it. The earliest list that we can reconstruct in detail is the one Ptolemy printed in the seventh and eighth books of the *Almagest* (about AD 150), and the evidence is that most of it goes back to Hipparchus of Nicaea, who worked at Rhodes in the second century BC.

### The catalogue
Ptolemy's catalogue lists **1022 stars** in **48 constellations** (21 northern, 12 along the zodiac, 15 southern). Each star is given a description of its place in the figure ("the star in the left shoulder"), its **ecliptic longitude and latitude** for the epoch of the work, AD 137, and a **magnitude**. The ecliptic was the natural frame: the Sun, Moon and planets are measured along it, and precession changes only the longitudes of the stars. Pliny the Elder tells that Hipparchus began his catalogue after he saw a new star appear, wanting to leave the sky in such a form that later astronomers could tell whether stars come and go or move.

### The six classes
Hipparchus' scheme is the ancestor of the magnitude scale: the brightest stars are of the first class (**magnitude**), the faintest visible to the naked eye the sixth. Ptolemy has 15 stars of the first class, 45 of the second, 208 of the third, 474 of the fourth, 217 of the fifth and 49 of the sixth (and a few "dim" and "nebulous" ones). In 1856 Norman Pogson put numbers to it: five classes are a factor of exactly 100 in brightness, so **one class is a factor of $100^{1/5} = 2.512$**. The modern scale runs backwards from it: Vega is magnitude 0.0, Sirius −1.46.

### Precession
Hipparchus compared his own measures of Spica with those of Timocharis, made some 150 years before, and found that the star had moved relative to the equinox by about 2°. Other stars moved the same way. He concluded that the equinoxes slide along the ecliptic, **at least 1° per century** (the true figure is 1.4°). The drawing below reproduces his comparison. Ptolemy adopted the 1° per century. His catalogue stands about 2°40′ ahead of Hipparchus' places, which is what 265 years at that rate come to, and he says that his own checks agreed. The Spica entry shows it: Hipparchus' place of about 174.1° plus 2.67° is 176.8°, and Ptolemy lists the star at Virgo 26⅔°, 176°40′. Because the true precession is larger, every longitude in the catalogue is about 1° too small for AD 137, one of the hints that the data are Hipparchus' and not Ptolemy's own. How much Ptolemy re-observed is still disputed.

### The sphere on paper
Hipparchus is credited with using **stereographic projection** (a point of the sphere is projected from a pole onto the plane of the equator) to draw the sky on a plane; Ptolemy's *Planisphaerium* describes it and proves the property that makes the astrolabe possible, that circles of the sphere stay circles. The next page takes up the instrument.

> [!fact] Ptolemy's list of 1022 stars was copied, translated and corrected for 1400 years. Al-Sufi's *Book of the Fixed Stars* (964) reworked it; Regiomontanus' printed *Epitome of the Almagest* carried it to the press; and Dürer's star maps of 1515 draw exactly its 48 figures.`,
  ideas: [
    'Ptolemy\'s catalogue lists 1022 stars in 48 constellations by ecliptic longitude and latitude (epoch AD 137) and magnitude; most of its data descend from Hipparchus.',
    'Hipparchus\' six classes of brightness became the magnitude scale: one class is a factor 2.512 in brightness, five classes a factor of 100 (Pogson, 1856).',
    'Comparing Spica\'s place with the equinox over 150 years, Hipparchus found precession: at least 1° per century (truth 1.4°).',
    'The ecliptic system suits the catalogue: precession adds the same amount to every longitude and leaves latitudes alone.',
    'Stereographic projection, used to map the sky onto a plane, goes back to Hipparchus; Ptolemy\'s *Planisphaerium* proves its circle-preserving property.'
  ],
  pitfalls: [
    'A smaller magnitude means a fainter star — The scale runs backwards: the brightest stars have the smallest (even negative) magnitudes, because the first class is the brightest.',
    'Ptolemy discovered precession — Hipparchus did, from Spica and other stars, about 130 BC; Ptolemy confirmed it and used a rate that was too slow.',
    'The Almagest catalogue is a modern-style list of coordinates — The stars are identified by their place in the figure, not by names; the coordinates are the ecliptic ones, and the positions are good to about 1° (some to a few tenths of a degree).'
  ],
  formulas: [
    {
      name: 'Brightness ratio from a magnitude difference',
      expr: 'r = 10^(0.4*dm)',
      tex: 'r = 10^{0.4\\,\\Delta m}',
      vars: {
        r: { name: 'ratio of the brightnesses (fainter against brighter)' , tex: 'r', min: 1, max: 1e12 },
        dm: { name: 'difference in magnitude', value: 5, min: 0, max: 30, tex: '\\Delta m' }
      },
      solveFor: 'r',
      note: 'Five magnitudes are a factor of 100; one magnitude 2.512; Sirius against a sixth-class star (Δm = 7.46) a factor of 963.'
    },
    {
      name: 'Longitude of a star at another epoch',
      expr: 'lam = lam0 - p*(2000 - yr)/3600',
      tex: '\\lambda = \\lambda_{2000} - \\frac{p\\,(2000 - Y)}{3600}',
      vars: {
        lam: { name: 'ecliptic longitude in year Y', q: false, unit: '°', tex: '\\lambda' },
        lam0: { name: 'ecliptic longitude in 2000', q: false, unit: '°', value: 203.84, min: 0, max: 360, tex: '\\lambda_{2000}' },
        p: { name: 'rate of precession', q: false, unit: '″/yr', value: 50.29 },
        yr: { name: 'year (negative for BC)', q: false, value: 137, signed: true, tex: 'Y' }
      },
      solveFor: 'lam',
      note: 'Spica in AD 137 (Ptolemy\'s epoch): 177.8°; in 128 BC (Hipparchus): 174.1°. Ptolemy\'s catalogue gives 176°40′.'
    },
    {
      name: 'Precession rate from two observations',
      expr: 'p = 3600*dlam/dt',
      tex: 'p = \\frac{3600\\,\\Delta\\lambda}{\\Delta t}',
      vars: {
        p: { name: 'rate of precession', q: false, unit: '″/yr' },
        dlam: { name: 'shift of the star relative to the equinox', q: false, unit: '°', value: 2, tex: '\\Delta\\lambda' },
        dt: { name: 'time between the observations', q: false, unit: 'yr', value: 150, tex: '\\Delta t' }
      },
      solveFor: 'p',
      note: 'Hipparchus\' 2° in about 150 years gives 48″ a year. The true rate is 50.29″ a year.'
    }
  ],
  examples: [
    {
      title: 'How much brighter is Sirius than a sixth-class star?',
      q: 'Sirius has magnitude −1.46; the faintest stars Ptolemy listed are of the sixth class, magnitude about 6.0. What is the ratio of their brightnesses? And of Vega (0.0) to the same star?',
      steps: [
        { text: 'The difference for Sirius is $6.0 - (-1.46) = 7.46$ magnitudes, so', tex: 'r = 10^{0.4\\times 7.46} = 10^{2.984} = 963' },
        { text: 'For Vega, $\\Delta m = 6.0$:', tex: 'r = 10^{2.4} = 251' },
        'Hipparchus could not have known it, but the equal-looking steps of his classes are equal *ratios*: the eye judges brightness on a roughly logarithmic scale. That is why Pogson could fit his scale to the old classes by making five of them a factor of 100.'
      ],
      a: 'Sirius is about 960 times and Vega about 250 times brighter than a sixth-class star.'
    },
    {
      title: 'Where does Ptolemy put Spica?',
      q: 'Hipparchus found Spica 6° before the autumn equinox (longitude 174°) about 128 BC. Ptolemy updated Hipparchus\' longitudes to AD 137 by adding 1° per century. What longitude results, and how does it compare with the true position?',
      steps: [
        'The time between the two epochs is $128 + 137 = 265$ years, or $2.65°$ at 1° per century; Ptolemy writes 2°40′ = 2.67°.',
        { text: 'So his longitude should be', tex: '174.1° + 2.67° = 176.8° \\approx 26°\\,48′\\ \\text{of Virgo}' },
        'The catalogue gives Virgo $26\\tfrac23°$, within 0.1°. The true longitude in AD 137 was $203.84° - 50.29″ \\times 1863/3600 = 177.8°$: Ptolemy is 1.1° too small, because his rate of precession was 30 % too slow.'
      ],
      a: '176.8° from Hipparchus\' data, as the catalogue gives; the true value is 177.8°.'
    }
  ],
  quiz: [
    { q: 'By what factor is a first-class star brighter than a sixth-class one in the modern scale?', answer: 100, why: 'Five magnitudes are defined as a factor of exactly 100 (Pogson, 1856), so the range from the first class to the sixth is 100 × in brightness.' },
    { q: 'Which statement about precession is true?', choices: ['Hipparchus found it by comparing Spica with the equinox', 'Ptolemy found it from the Moon', 'Copernicus found it from Mars', 'it was known to the Babylonians as 1° a year'], a: 0, why: 'Hipparchus compared his own position of Spica with the earlier measures of Timocharis and saw that it had shifted relative to the equinox by about 2° in 150 years.' },
    { q: 'Ptolemy\'s catalogue lists stars by right ascension and declination.', a: false, why: 'The Almagest catalogue is in ecliptic longitude and latitude, the system in which precession changes only the longitudes.' },
    { q: 'The brightest stars have the', choices: ['largest magnitudes', 'smallest, even negative, magnitudes', 'magnitude 6', 'the same magnitude as the Sun'], a: 1, why: 'The first class was the brightest, so the scale increases as the stars get fainter: Sirius is −1.46 and the naked-eye limit is about 6.' },
    { q: 'How many constellations does Ptolemy\'s catalogue list?', answer: 48, why: 'Forty-eight: 21 in the north, 12 of the zodiac, 15 in the south. The modern 88 include the southern ones added in the sixteenth to eighteenth centuries.' }
  ],
  applications: [
    'The magnitude scale is still the astronomer\'s measure of brightness, extended to −27 for the Sun and +30 for the faintest galaxies.',
    'Comparing catalogues of different epochs measures precession and the stars\' own motions; the Hipparcos satellite did it to a thousandth of a second of arc.',
    'The method of the ecliptic catalogue survives in planetary tables and in the astrological longitudes of the zodiac.',
    'Stereographic projection, taken from Hipparchus and Ptolemy, is used today for polar maps and the fisheye lens.',
    'Historians date a lost observation by the precession it shows: the epoch of a catalogue follows from the average shift of its longitudes.'
  ],
  history: `Hipparchus (about 190 to 120 BC) observed at Rhodes from about 147 to 127 BC. Only one of his works survives, a commentary on the star-poem of Aratus; his catalogue, his book on the displacement of the equinox, and his tables of chords are known from Ptolemy and Pliny. Ptolemy (active AD 127–150 at Alexandria) wrote the *Syntaxis*, called *Almagest* by its Arabic readers (*al-majisti*, "the greatest"). Its catalogue was Arabicised in the ninth century and improved by al-Sufi in 964, then passed to Europe in the Latin translations of the twelfth century and, from 1496, in the printed *Epitome* of Peurbach and Regiomontanus. The question of how much of the catalogue Ptolemy observed himself was raised by Delambre in the early nineteenth century and again by Robert Newton in 1977; recent work (Graßhoff, 1990) finds in it observations by Hipparchus brought forward for precession.`,
  sources: ['G. J. Toomer (ed.), *Ptolemy\'s Almagest* (1984), books VII and VIII (the catalogue) and VII.2–3 (precession).', 'James Evans, *The History and Practice of Ancient Astronomy* (1998), chapters 7 and 8.', 'Nick Kanas, *Star Maps: History, Artistry and Cartography* (2nd ed., 2012), chapter 1.', 'Gerd Graßhoff, *The History of Ptolemy\'s Star Catalogue* (1990).', 'Jean Meeus, *Astronomical Algorithms* (2nd ed., 1998), chapter 21 for the modern precession.'],
  sim: 'sh-star-magnitudes',
  construction: 'sh-hipparchus-precession'
},

{
  id: 'islamic-astrolabe-makers',
  parent: 'sky-history',
  title: 'The astrolabe makers',
  level: 2,
  short: `The astrolabe is the sky drawn in stereographic projection on brass, with a turning net of stars over a plate for each latitude. Brought to perfection in Baghdad, Toledo and Isfahan, it told the time, found the qibla and measured heights — and every circle of it can be drawn with a compass.`,
  keywords: ['astrolabe', 'mater', 'plate', 'tympan', 'rete', 'rule', 'alidade', 'throne', 'Islamic astronomy', 'Baghdad', 'Toledo', 'Isfahan', 'al-Zarqali', 'al-Sufi', 'stereographic projection', 'almucantar'],
  prereq: ['the-astrolabe', 'stereographic-projection', 'horizon-coordinates'],
  related: ['hipparchus-and-ptolemy-sky', 'the-planisphere', 'sky-coordinate-transformations', 'precession-and-the-moving-pole', 'durer-star-maps-1515'],
  body: `An astrolabe is a hand-held model of the sky made of brass. Its front is a projection of the celestial sphere: a pole at the centre, the equator and the tropics as concentric circles, the horizon and the circles of equal altitude (**almucantars**) as eccentric ones, and over it, turning, the stars. It is the object that the [[stereographic-projection|stereographic projection]] was made for.

### The parts
- the **mater** ("mother"): the hollow body with a raised rim, the **limb**, graduated in degrees or hours, and the **throne** (*kursi*) at the top, with a ring to hang it;
- the **plates** (tympans): thin discs that fit in the mater, one for each latitude, engraved with the horizon, the almucantars, the azimuth lines, the lines of unequal hours and the twilight line; the outer limit is the tropic of Capricorn;
- the **rete** (Arabic *ankabut*, "spider"): a pierced net with the **ecliptic ring**, divided into the signs, and **pointers** for the brightest stars, turning over the plate once a sidereal day;
- the **rule** on the front, held with the **pin** and **horse** (a small wedge), laid on a star or on the Sun to read the hour on the limb;
- on the back, the **alidade** with two sights for taking altitudes, a degree circle, scales of the zodiac and the calendar, a **shadow square** for heights and an hour table.

### The geometry
All the lines of the front are the projection of circles of the sphere from the south celestial pole onto the plane of the equator, where a circle is always a circle (Ptolemy, *Planisphaerium*). A parallel of declination $\\delta$ is a circle about the pole with radius $R\\tan\\bigl((90°-\\delta)/2\\bigr)$, where $R$ is the radius of the equator; the tropics are at $R\\tan 33.3° = 0.656R$ and $R\\tan 56.7° = 1.527R$. For latitude $\\varphi$ the almucantar of altitude $a$ is a circle of radius and distance from the pole
$$\\rho = \\frac{R\\cos a}{\\sin\\varphi + \\sin a},\\qquad c = \\frac{R\\cos\\varphi}{\\sin\\varphi + \\sin a},$$
the centre being on the meridian on the zenith's side; $a = 0$ is the horizon, with $\\rho = R/\\sin\\varphi$ and $c = R/\\tan\\varphi$. The ecliptic ring is the circle that touches both tropics and passes through the ends of the east–west diameter, so the compass alone finds it (the construction below), and the star pointers are put at $(\\alpha, R\\tan((90°-\\delta)/2))$.

### What it did
Set the rule on the Sun's place on the ring and read the time on the limb; turn the rete to the sidereal time and see at once which stars are up. Islamic users added the **qibla** (the direction of Mecca), the times of the five daily prayers (the afternoon prayer starts when a shadow reaches a certain length), and the hours of unequal length. Al-Sufi described more than a thousand uses.

### The makers
The instrument came from Hellenistic Alexandria through Syriac scholars to Baghdad by the eighth century. Al-Fazari, Mashallah and al-Khwarizmi wrote on it there; the earliest dated surviving astrolabe is by Nastulus, AD 927/8. In Muslim Spain, al-Zarqali of Toledo devised the **universal plate**, which serves every latitude; the oldest surviving Andalusian astrolabe is by Ibrahim ibn Said al-Sahli (Toledo, 1067). Safavid Isfahan produced in the seventeenth century the most beautifully engraved ones, by makers like Muhammad Muqim.

> [!tip] Compass and ruler are enough to make the plate for any latitude from R and φ alone.`,
  ideas: [
    'The astrolabe is the sky in stereographic projection from the south celestial pole: every circle on the sphere is a circle on the brass, so a compass draws it.',
    'The plate (horizon, almucantars) is fixed to the observer; the rete (ecliptic ring and star pointers) is fixed to the stars and turns once a sidereal day.',
    'Parallels of declination have radius R tan((90° − δ)/2); the almucantar of altitude a has radius R cos a/(sin φ + sin a); the ecliptic ring touches the tropics.',
    'Islamic makers added the qibla, the prayer times, unequal hours and the universal plate (al-Zarqali).',
    'Baghdad, Toledo and Isfahan were the main centres; the astrolabe reached Christian Europe through Spain around AD 1000.'
  ],
  pitfalls: [
    'The astrolabe is a compass or a navigation instrument for the sea — It is an astronomical computer for time and position of stars; sailors\' astrolabes were a much simpler ring, and the planispheric astrolabe is far too delicate to use on a moving ship.',
    'The rete and the plate turn together — The plate is fixed to the mater and stands for the observer\'s horizon; only the rete turns, like the sky.',
    'An astrolabe works at any latitude — Each plate is made for one latitude, which is why astrolabes carry several interchangeable plates, or are made universal.'
  ],
  formulas: [
    {
      name: 'Radius of a parallel of declination on the plate',
      expr: 'r = R*tan((pi/2 - dec)/2)',
      tex: 'r = R\\tan\\frac{90^{\\circ} - \\delta}{2}',
      vars: {
        r: { name: 'radius of the circle on the plate', q: 'length', unit: 'mm' },
        R: { name: 'radius of the equator circle', q: 'length', unit: 'mm', value: 100 },
        dec: { name: 'declination', q: 'angle', unit: '°', value: 23.44, signed: true, min: -60, max: 90, tex: '\\delta' }
      },
      solveFor: 'r',
      note: 'δ = 90° is the pole (r = 0), δ = 0 the equator (r = R), δ = −23.44° the tropic of Capricorn, the plate\'s outer edge: 152.7 mm for R = 100 mm.'
    },
    {
      name: 'Radius of an almucantar',
      expr: 'rho = R*cos(a)/(sin(phi) + sin(a))',
      tex: '\\rho = \\frac{R\\cos a}{\\sin\\varphi + \\sin a}',
      vars: {
        rho: { name: 'radius of the circle of equal altitude', q: 'length', unit: 'mm' },
        R: { name: 'radius of the equator circle', q: 'length', unit: 'mm', value: 100 },
        a: { name: 'altitude', q: 'angle', unit: '°', value: 30, min: 0, max: 89 },
        phi: { name: 'latitude of the plate', q: 'angle', unit: '°', value: 33.31, min: 1, max: 89, tex: '\\varphi' }
      },
      solveFor: 'rho',
      note: 'a = 0 gives the horizon, R/sin φ = 182 mm at Baghdad. The altitude 30° at Baghdad: 82.5 mm.'
    },
    {
      name: 'Distance of its centre from the pole',
      expr: 'c = R*cos(phi)/(sin(phi) + sin(a))',
      tex: 'c = \\frac{R\\cos\\varphi}{\\sin\\varphi + \\sin a}',
      vars: {
        c: { name: 'distance of the circle\'s centre from the pole, towards the zenith', q: 'length', unit: 'mm' },
        R: { name: 'radius of the equator circle', q: 'length', unit: 'mm', value: 100 },
        a: { name: 'altitude', q: 'angle', unit: '°', value: 30, min: 0, max: 89 },
        phi: { name: 'latitude of the plate', q: 'angle', unit: '°', value: 33.31, min: 1, max: 89, tex: '\\varphi' }
      },
      solveFor: 'c',
      note: 'The horizon (a = 0): c = R cot φ = 152 mm at Baghdad. The zenith (a = 90°) is a circle of radius 0 at the distance R tan((90° − φ)/2).'
    }
  ],
  examples: [
    {
      title: 'A plate for Baghdad',
      q: 'Make a plate for Baghdad (latitude 33.3°) on an equator circle of radius 100 mm. Where are the tropics, the horizon, the zenith and the almucantar of 30°?',
      steps: [
        { text: 'The tropics: $r = 100\\tan((90° \\mp 23.44°)/2)$', tex: 'r_{\\text{Cancer}} = 100\\tan 33.28° = 65.6\\ \\text{mm},\\qquad r_{\\text{Capricorn}} = 100\\tan 56.72° = 152.7\\ \\text{mm}' },
        { text: 'The horizon ($a = 0$):', tex: '\\rho = \\frac{100}{\\sin 33.31°} = 182.2\\ \\text{mm},\\qquad c = \\frac{100}{\\tan 33.31°} = 152.1\\ \\text{mm}' },
        'The circle is centred 152.1 mm from the pole towards the zenith, and cuts the plate\'s edge (152.7 mm) in two points. The zenith ($a = 90°$) is at $c = 100\\cos 33.31° /(\\sin 33.31° + 1) = 53.9$ mm.',
        { text: 'The almucantar of 30°:', tex: '\\rho = \\frac{100\\cos 30°}{\\sin 33.31° + \\sin 30°} = 82.5\\ \\text{mm},\\qquad c = \\frac{100\\cos 33.31°}{1.0499} = 79.6\\ \\text{mm}' }
      ],
      a: 'Tropics 65.6 and 152.7 mm; horizon ρ = 182.2 mm, c = 152.1 mm; zenith 53.9 mm from the pole; 30° almucantar ρ = 82.5 mm, c = 79.6 mm.'
    },
    {
      title: 'Toledo against Baghdad',
      q: 'Toledo is at latitude 39.9°. By how much does its horizon circle differ from Baghdad\'s on a plate with equator radius 100 mm?',
      steps: [
        { text: 'For Toledo:', tex: '\\rho = \\frac{100}{\\sin 39.86°} = 156.0\\ \\text{mm},\\quad c = \\frac{100}{\\tan 39.86°} = 120.0\\ \\text{mm}' },
        'The horizon circle is smaller and its centre nearer the pole. The zenith lies nearer the pole too, at $R\\tan((90° - 39.86°)/2) = 46.7$ mm, against 53.9 mm at Baghdad. This is why a plate for one city is of little use a few degrees away: each degree of latitude moves the horizon by about 5 mm on a plate of this size.'
      ],
      a: 'Toledo\'s horizon: radius 156.0 mm, centre 120.0 mm from the pole (Baghdad 182.2 and 152.1).'
    }
  ],
  quiz: [
    { q: 'The rete of an astrolabe represents', choices: ['the observer\'s horizon', 'the fixed stars and the ecliptic', 'the equator only', 'the tropics'], a: 1, why: 'The rete is the net with the ecliptic ring and the star pointers: the sky that turns. The plate underneath is the observer\'s horizon.' },
    { q: 'In the stereographic projection used for the astrolabe, a circle on the sphere is projected as', choices: ['an ellipse', 'a parabola', 'a circle', 'a straight line always'], a: 2, why: 'Stereographic projection preserves circles (Hipparchus/Ptolemy): even the horizon and the ecliptic come out as true circles, which can be drawn with a compass.' },
    { q: 'The radius of the tropic of Cancer on a plate with an equator radius of 100 mm is about', answer: 65.6, unit: 'mm', why: '$100\\tan((90° - 23.44°)/2) = 100\\tan 33.28° = 65.6$ mm.' },
    { q: 'An astrolabe plate made for Baghdad would give the right horizon at Toledo.', a: false, why: 'Each plate is calculated for one latitude (33.3° for Baghdad, 39.9° for Toledo); the horizon circle and almucantars shift by several millimetres per degree of latitude. Universal astrolabes, such as al-Zarqali\'s, avoid this by a different projection.' },
    { q: 'The earliest dated surviving Islamic astrolabe was made in', choices: ['AD 927/8', 'AD 1067', 'AD 1391', 'AD 1650'], a: 0, why: 'By Nastulus in Baghdad (AH 315). Al-Sahli\'s Toledo astrolabe of 1067 is the oldest of the western school; Chaucer\'s Treatise on the Astrolabe is of about 1391.' }
  ],
  applications: [
    'Planispheres, the printed descendants of the rete over the plate, help amateurs find what is up tonight.',
    'Planetarium domes use the same stereographic or the closely related azimuthal projections for the sky.',
    'The polar stereographic projection of the astrolabe plate is the ancestor of the polar maps used in aviation and meteorology.',
    'The construction of the plate is a classic exercise in teaching geometry and trigonometry, and the almucantar formula is used in sundial design.',
    'In museums and restoration, an astrolabe\'s plates are dated by the latitudes engraved and by the star positions on the rete, which show the epoch.'
  ],
  history: `The geometry is Greek: Hipparchus is credited with the stereographic projection and Ptolemy wrote about it, but the oldest surviving descriptions of the instrument are by Philoponus (sixth century) and Severus Sebokht (seventh century). In Baghdad, from about 800, astronomers of the House of Wisdom wrote treatises on it and instrument makers built it: the earliest one that survives, with a date, is by Nastulus (AD 927/8). Al-Sufi (903–986) wrote a long treatise on its uses. Al-Biruni (973–1048) described its mathematics and the universal types. In Spain, Maslama al-Majriti and al-Zarqali (Azarquiel, Toledo, d. 1100) brought the instrument to Latin Europe, where the monk Gerbert of Aurillac (later Pope Sylvester II) already knew of it before the year 1000 and Chaucer wrote an English *Treatise on the Astrolabe* in about 1391. Safavid Isfahan in the seventeenth century made the finest engraved examples. The instrument went out of use with the telescope, the pendulum clock and the sextant.`,
  sources: ['James Evans, *The History and Practice of Ancient Astronomy* (1998), chapter 7, "The astrolabe and the stereographic projection".', 'G. J. Toomer (ed.), *Ptolemy\'s Almagest* (1984) and Ptolemy, *Planisphaerium*, in the translation by J. L. Berggren and others.', 'David A. King, *In Synchrony with the Heavens*, volume 2: *Instruments of Mass Calculation* (2005).', 'Jean Meeus, *Astronomical Algorithms* (2nd ed., 1998), chapter 13, for the coordinate transformations behind the plate.', 'Geoffrey Chaucer, *A Treatise on the Astrolabe* (about 1391).'],
  sim: 'sh-astrolabe-turning',
  construction: 'sh-astrolabe-parts'
}
,

{
  id: 'durer-star-maps-1515',
  parent: 'sky-history',
  title: 'Dürer\'s star maps of 1515',
  level: 2,
  short: `Two large woodcuts printed at Nuremberg in 1515 gave Europe its first printed charts of the whole sky: each hemisphere drawn about an ecliptic pole, the ecliptic as the great circle round it, the celestial equator a curve to one side, and Ptolemy's 48 figures drawn by Dürer.`,
  keywords: ['Dürer', 'Stabius', 'Heinfogel', 'star map', 'woodcut', 'ecliptic pole', 'polar projection', 'azimuthal equidistant', 'Nuremberg', '1515', 'constellation figures', 'celestial globe'],
  prereq: ['polar-star-charts', 'all-sky-charts', 'ecliptic-and-galactic-coordinates'],
  related: ['hipparchus-and-ptolemy-sky', 'modern-star-atlases', 'azimuthal-equidistant-projection', 'armillary-sphere-and-celestial-globe', 'precession-and-the-moving-pole'],
  body: `In 1515 the Nuremberg printers issued two woodcuts, *Imagines coeli septentrionales cum duodecim imaginibus zodiaci* and *Imagines coeli meridionales*: the northern and the southern celestial hemispheres, each about 43 cm across. They were the first printed star charts of the whole sky made in the West. Three men made them. Johannes Stabius, the Emperor Maximilian's mathematician, devised the layout; Conrad Heinfogel, an astronomer, plotted the stars; Albrecht Dürer drew the figures and cut the blocks. The four corner portraits show Aratus, Manilius, Ptolemy and al-Sufi, the authors of the star lore Dürer's contemporaries relied on.

### The layout
The sky is divided at the **ecliptic**, not at the celestial equator. Each chart is centred on an **ecliptic pole**, the north one for the northern map and the south one for the southern. The ecliptic is a circle round the centre, 90° from it, and carries the twelve signs of the zodiac; the stars of the zodiac constellations stand just inside and outside it. The map is usually described as a **polar equidistant projection**: the distance of a point from the centre is proportional to its angular distance from the pole,
$$r = s\\,(90° - \\beta),$$
with $s$ a scale of so many millimetres to a degree and $\\beta$ the ecliptic latitude of the star; its direction from the centre is its ecliptic longitude $\\lambda$. On such a chart the circles of latitude are concentric circles, the ecliptic is the circle $r = 90s$, and the meridians of longitude are radii.

The **celestial equator** is a circle on the sphere but not on the chart: because the celestial pole is $\\varepsilon = 23.44°$ from the ecliptic pole, the equator comes within $90° - 23.44° = 66.56°$ of the centre in the direction $\\lambda = 270°$ and goes out to $113.44°$ in the direction $\\lambda = 90°$. It is drawn from a table, point by point, as in the construction below. The tropics are similar curves.

### What the layout costs
A polar equidistant chart keeps distances along the radii and stretches everything else: at an angular distance $\\theta$ from the centre, east–west lengths are multiplied by $\\theta/\\sin\\theta$, which is 1.21 at 60°, 1.57 at 90° (the ecliptic) and 2.42 at 120° (the rim). The zodiac, in the outer ring, is therefore the most distorted part; this is part of the reason the figures are drawn large there.

### The sources
The 48 constellations and about a thousand stars are Ptolemy's; the longitudes of the *Almagest* (epoch AD 137) had to be advanced for precession, and the charts are drawn for about 1500. The figures are drawn in the manner of a celestial globe, as seen from outside the sphere, so they are mirror images of what the night sky shows. The charts were reprinted and copied for generations and set the pattern of the Renaissance star atlas.

> [!history] A star map and a map of the world are the same problem, a sphere on a sheet. The same circle of men in Nuremberg and Vienna, Stabius and Werner among them, worked on the heart-shaped world projection that bears their names; the star charts show that the idea of a polar chart was already at home in the workshop.`,
  ideas: [
    'Dürer\'s two charts of 1515 each show a hemisphere centred on an ecliptic pole, with the ecliptic as a circle at 90° and the signs round it.',
    'The layout is a polar equidistant projection: r = s(90° − β), direction = ecliptic longitude; circles of latitude are concentric, meridians are radii.',
    'The celestial equator is an off-centre curve, 66.56° from the centre in one direction and 113.44° in the opposite one, because the celestial pole is 23.44° from the ecliptic pole.',
    'East–west lengths are stretched by θ/sin θ: 57 % on the ecliptic, 142 % at the rim.',
    'Stabius designed the layout, Heinfogel plotted the stars (Ptolemy\'s, brought up to date), Dürer drew and cut the figures.'
  ],
  pitfalls: [
    'The charts are centred on the celestial pole — They are centred on the poles of the ecliptic; the celestial pole is off to one side, 23.44° from the centre.',
    'The chart is an exact copy of the sky — A hemisphere cannot be flattened without stretching; this one keeps radial distances and stretches the zodiac sideways by up to 57 %.',
    'Dürer was an astronomer — He drew and engraved; the mathematics and the star plot were Stabius\' and Heinfogel\'s, from Ptolemy\'s catalogue.'
  ],
  formulas: [
    {
      name: 'Distance from the centre on the chart',
      expr: 'r = s*(90 - beta)',
      tex: 'r = s\\,(90^{\\circ} - \\beta)',
      vars: {
        r: { name: 'distance from the centre of the chart', q: false, unit: 'mm' },
        s: { name: 'scale of the chart', q: false, unit: 'mm/°', value: 2 },
        beta: { name: 'ecliptic latitude of the star', q: false, unit: '°', value: 66.1, signed: true, tex: '\\beta' }
      },
      solveFor: 'r',
      note: 'Polaris (β = +66.1°) lies 47.8 mm from the centre at 2 mm to the degree; the ecliptic is the circle r = 180 mm.'
    },
    {
      name: 'East–west stretch of the equidistant polar chart',
      expr: 'k = theta/sin(theta)',
      tex: 'k = \\frac{\\theta}{\\sin\\theta}',
      vars: {
        k: { name: 'stretch of east–west lengths' },
        theta: { name: 'angular distance from the centre of the chart', q: 'angle', unit: '°', value: 90, min: 1, max: 179, tex: '\\theta' }
      },
      solveFor: 'k',
      note: 'On the ecliptic (θ = 90°) the stretch is π/2 = 1.571; at θ = 60° it is 1.209; near the centre it is 1. Along the radius the scale is 1 everywhere.'
    },
    {
      name: 'Moving a longitude to another epoch',
      expr: 'dlam = p*dt/3600',
      tex: '\\Delta\\lambda = \\frac{p\\,\\Delta t}{3600}',
      vars: {
        dlam: { name: 'change of ecliptic longitude', q: false, unit: '°', tex: '\\Delta\\lambda' },
        p: { name: 'rate of precession', q: false, unit: '″/yr', value: 50.29 },
        dt: { name: 'years elapsed', q: false, unit: 'yr', value: 1378, tex: '\\Delta t' }
      },
      solveFor: 'dlam',
      note: 'From Ptolemy\'s epoch (AD 137) to 1515: 19.2° at the true rate; at Ptolemy\'s 1° per century only 13.8°.'
    }
  ],
  examples: [
    {
      title: 'Where is Polaris on the northern chart?',
      q: 'For 1515, Polaris has ecliptic longitude 81.8° and latitude +66.1°. On a chart with a scale of 2 mm to the degree, how far from the centre and in what direction is it? Where is the celestial pole?',
      steps: [
        { text: 'The distance from the centre:', tex: 'r = 2\\ \\text{mm/°}\\times(90° - 66.1°) = 47.8\\ \\text{mm}' },
        'The direction is the longitude, 81.8° from the 0° line (anticlockwise): almost straight up, 8° short of the vertical.',
        'The celestial pole is $23.44° \\times 2 = 46.9$ mm from the centre, at longitude 90° (straight up). Polaris is then 0.5° from the pole in 1515 (close: it is 0.7° away in 2000), 1 mm on the chart: the pole star was already the star to steer by.',
        'The ecliptic is the circle of radius $90 \\times 2 = 180$ mm, and the rim of a chart that reaches 30° south of it is at 240 mm.'
      ],
      a: '47.8 mm from the centre, at 82° (nearly straight up), next to the celestial pole at 46.9 mm.'
    },
    {
      title: 'How stretched is a sign of the zodiac?',
      q: 'On the same chart, how wide and how deep is the stretch of the ecliptic that belongs to one sign (30° of longitude)?',
      steps: [
        { text: 'Along the ecliptic circle of radius 180 mm:', tex: 'w = 180\\ \\text{mm}\\times\\frac{30°\\pi}{180°} = 94.2\\ \\text{mm}' },
        { text: 'Across it, 30° of latitude is on the radius:', tex: 'd = 2\\ \\text{mm/°}\\times 30° = 60\\ \\text{mm}' },
        'A square of 30° by 30° on the sphere is a trapezoid 94 mm wide and 60 mm deep: stretched by $94.2/60 = 1.57 = (\\pi/2)/\\sin(\\pi/2)$ along the ecliptic, as the formula says. The zodiac figures are drawn correspondingly broad.'
      ],
      a: '94.2 mm wide by 60 mm deep: a stretch of 1.57 along the ecliptic.'
    }
  ],
  quiz: [
    { q: 'On Dürer\'s northern chart the point at the centre is', choices: ['the north celestial pole', 'the north ecliptic pole', 'Polaris', 'the vernal equinox'], a: 1, why: 'The charts are centred on the ecliptic poles, so the ecliptic itself is a circle and the signs can be laid round the edge. The celestial pole is 23.44° from the centre.' },
    { q: 'How far from the centre of the chart is the ecliptic, in degrees?', answer: 90, unit: '°', why: 'The ecliptic is 90° from the ecliptic pole, so in the equidistant projection it is the circle of radius 90s.' },
    { q: 'The celestial equator on the chart is', choices: ['a circle about the centre', 'a straight line', 'an off-centre curve', 'the outer rim'], a: 2, why: 'It stays 90° from the celestial pole, which is not at the centre, so on the chart it is a closed curve running between 66.56° and 113.44° from the centre.' },
    { q: 'East–west lengths on the ecliptic are stretched by', answer: 1.57, why: '$\\theta/\\sin\\theta$ with $\\theta = 90°$, i.e. $\\pi/2 = 1.571$.' },
    { q: 'The positions of the stars on Dürer\'s charts were observed by Dürer.', a: false, why: 'The stars and constellations are Ptolemy\'s (from the *Almagest* catalogue, brought up to the date of the chart for precession), plotted by Conrad Heinfogel; Dürer drew the figures and cut the blocks.' }
  ],
  applications: [
    'Star atlases of the sixteenth and seventeenth centuries were modelled on these charts, and so were the hemispheres on celestial globes.',
    'The equidistant polar projection survives in the polar maps of the United Nations emblem and the polar charts of aviation and sonar.',
    'Planetarium and all-sky software uses the same family of azimuthal projections when it draws the dome around the zenith.',
    'Art history: the charts are among the earliest scientific woodcuts of such size and show how Renaissance craftsmen and mathematicians worked together.',
    'Teaching map projections: the hemispheres show at once what an azimuthal equidistant projection preserves (distance from the centre) and what it distorts.'
  ],
  history: `Dürer lived at Nuremberg, a centre of instrument making and printing, where Regiomontanus had worked in the 1470s and Bernhard Walther had observed from his house. Johannes Stabius, born in Austria, was Maximilian I's court historian and mathematician and an acquaintance of Dürer's; with Konrad Heinfogel, a Nuremberg astronomer and instrument maker, he planned the charts in 1515. They are the work of three men and the first star charts printed in the West to cover both hemispheres. They were reprinted and imitated for decades. The corner figures of Aratus, Manilius, Ptolemy and al-Sufi (Azophi) pay homage to the literary and mathematical sources of the work.`,
  sources: ['Nick Kanas, *Star Maps: History, Artistry and Cartography* (2nd ed., 2012), the chapter on the Renaissance maps.', 'Erwin Panofsky, *The Life and Art of Albrecht Dürer* (1943).', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993), on the azimuthal equidistant projection.', 'G. J. Toomer (ed.), *Ptolemy\'s Almagest* (1984), the catalogue from which the stars come.', 'Jean Meeus, *Astronomical Algorithms* (2nd ed., 1998), chapters 13 and 21 for the coordinate change and precession.'],
  sim: 'sh-durer-hemisphere',
  construction: 'sh-durer-grid'
},

{
  id: 'modern-star-atlases',
  parent: 'sky-history',
  title: 'Star atlases from Bayer to the digital sky',
  level: 2,
  short: `Bayer's *Uranometria* of 1603 named the stars by Greek letters; Flamsteed, Bode, Argelander, Norton and Tirion carried the atlas from pictures to precision; Hipparcos and Gaia have turned the star atlas into a database of billions of stars that any screen can draw in any projection.`,
  keywords: ['Bayer', 'Uranometria', 'Flamsteed', 'Bode', 'Argelander', 'Norton', 'Tirion', 'Hipparcos', 'Gaia', 'star atlas', 'plate scale', 'Bayer designation', 'Flamsteed number', 'Schmidt camera', 'Palomar'],
  prereq: ['durer-star-maps-1515', 'all-sky-charts', 'equatorial-coordinates'],
  related: ['hipparchus-and-ptolemy-sky', 'gnomonic-projection', 'stereographic-projection', 'polar-star-charts', 'the-planisphere', 'astronomy-and-planetary-maps'],
  body: `A star atlas is a map of the sphere made of many small maps. How each is drawn, and how many stars it holds, tells the history of astronomy as clearly as any instrument.

### Pictures and Greek letters: Bayer (1603)
Johann Bayer's *Uranometria* (Augsburg, 1603) was the first atlas to cover the whole sky with plates of a convenient size: 51 copper-plate charts: one for each of Ptolemy's 48 constellations, one for the southern constellations new to Europe, and two planispheres. The plates are simple **trapezoids**, with equally spaced horizontal parallels of declination and straight meridians that converge towards the pole, drawn to the scale of a printed page and sized so that a constellation fills one. Bayer used Tycho Brahe's star positions and gave the bright stars a name that is still in use: a Greek letter and the genitive of the constellation, in the order of brightness (roughly): *α Centauri*, *β Orionis*. The construction below draws a plate of this form by hand.

### Numbers and strips: Flamsteed, Bode
John Flamsteed's *Atlas Coelestis* (published after his death, 1729) was drawn from the positions he had measured at Greenwich with the telescope, about 3000 stars to some ten arc-seconds; it used the equal-area projection now called Sanson–Flamsteed, and his numbers in order of right ascension within each constellation (*61 Cygni*) became a second system of names. Johann Elert Bode's *Uranographia* (Berlin, 1801) charted 17 240 stars with large, finely engraved figures; it is the last great pictorial atlas.

### Plain dots: Argelander to Tirion
Friedrich Argelander's *Uranometria Nova* (1843) dropped the pictures: the first great atlas of dots and magnitudes. His *Bonner Durchmusterung* (1859–62) listed 324 000 stars to magnitude 9.5, measured by eye through a small telescope. Photography took over: Harvard's *Henry Draper Catalogue* classified 225 000 stars by their spectra, and the Palomar Observatory Sky Survey of the 1950s photographed the sky north of −30° on plates 356 mm wide, each covering 6.6°. The amateur's atlases followed: Norton's (first in 1910), Becvar's *Atlas Coeli*, and Wil Tirion's *Sky Atlas 2000.0* and *Uranometria 2000.0* (1987), with about 330 000 stars to magnitude 9.7 on 473 charts. The International Astronomical Union fixed the **88 constellation boundaries** in 1930 along lines of right ascension and declination.

### Digital sky
ESA's **Hipparcos** satellite measured 118 218 stars in 1989–93 to about a milliarcsecond; **Gaia** (launched 2013) has given positions, parallaxes and motions for 1.8 billion sources in its third release (2022). Programs such as Stellarium draw this on the screen in any projection, as a fisheye, a stereographic chart or a panorama; for the maps of the whole sky, the *HEALPix* grid tiles the sphere into equal-area cells.

### Why the projection matters
A plate of width $w$ in the gnomonic projection stretches the radial direction at an angle $\\theta$ from its centre by $\\sec^2\\theta$, so large plates are only good near the middle; an atlas of small plates can use any projection. An atlas of 473 pages divides the 41 253 square degrees of the sky into plates of about 90 square degrees each, small enough that the choice hardly shows.

> [!note] The sim below lets you draw one patch of sky in five projections and compare the stretch at the plate edge.`,
  ideas: [
    'Bayer (1603) gave the first complete atlas on plates of trapezoidal form and named the stars by Greek letters; Flamsteed added numbers; Bode ended the age of pictures.',
    'Argelander\'s Uranometria Nova (1843) and Bonner Durchmusterung (1859–62) were atlases of dots and magnitudes; photography and the Palomar survey extended them to millions of stars.',
    'Hipparcos (1997, 118 218 stars) and Gaia (2022: 1.8 billion sources) made the atlas a database; software draws it in any projection.',
    'A projection\'s distortion grows with the plate\'s size: the gnomonic plate stretches the radial direction by sec²θ, so atlases use many small plates.',
    'The IAU fixed the 88 constellation boundaries in 1930; the naming of stars (Bayer letters, Flamsteed numbers, HD and BD numbers) comes from the atlases.'
  ],
  pitfalls: [
    'Bayer\'s Greek letters follow brightness exactly — They follow it roughly: the letters were usually given in order of brightness within a constellation, but not always (in the Plough Bayer ordered the stars by their position in the figure).',
    'A star atlas can be drawn in one projection without loss — A sphere cannot be flattened without distortion, so each plate keeps some property (shape, area or distance) and gives up the others; small plates keep the errors small.',
    'The brightest stars are the ones with a Greek letter α — Not always: Betelgeuse (α Orionis) is fainter than Rigel (β); the letters only follow the brightness approximately.'
  ],
  formulas: [
    {
      name: 'Plate scale of a photographic telescope',
      expr: 'sc = 206265/f',
      tex: '\\text{scale} = \\frac{206\\,265″}{f}',
      vars: {
        sc: { name: 'scale on the plate', q: false, unit: '″/mm', tex: '\\text{scale}' },
        f: { name: 'focal length', q: false, unit: 'mm', value: 3070 }
      },
      solveFor: 'sc',
      note: 'One radian is 206 265″. The Palomar Schmidt telescope (f = 3.07 m) gives 67.2″ per mm of plate.'
    },
    {
      name: 'Field covered by a plate',
      expr: 'fov = 2*atan(w/(2*f))',
      tex: '\\text{field} = 2\\arctan\\frac{w}{2f}',
      vars: {
        fov: { name: 'width of the field', q: 'angle', unit: '°', min: 0, max: 180, tex: '\\text{field}' },
        w: { name: 'width of the plate', q: 'length', unit: 'mm', value: 356 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 3070 }
      },
      solveFor: 'fov',
      note: 'The 14-inch plates of the Palomar survey cover 6.6° square.'
    },
    {
      name: 'Radial stretch of a gnomonic plate',
      expr: 'k = 1/cos(theta)^2',
      tex: 'k = \\sec^2\\theta',
      vars: {
        k: { name: 'radial stretch against the centre' },
        theta: { name: 'angular distance from the centre of the plate', q: 'angle', unit: '°', value: 15, min: 0, max: 80, tex: '\\theta' }
      },
      solveFor: 'k',
      note: 'The tangential stretch is sec θ. 7 % at 15°, 33 % at 30°, 100 % at 45°.'
    }
  ],
  examples: [
    {
      title: 'The Palomar plates',
      q: 'The Palomar Schmidt telescope has a focal length of 3.07 m, and its plates are 356 mm wide. What is the plate scale, and how many degrees does a plate cover? How many plates cover the sky if each covers 6.6° square (ignoring overlaps)?',
      steps: [
        { text: 'The scale:', tex: '\\frac{206\\,265″}{3070\\ \\text{mm}} = 67.2″/\\text{mm}' },
        { text: 'The field:', tex: '2\\arctan\\frac{356}{2\\times 3070} = 6.63°' },
        'Each plate covers $6.63^2 = 44$ square degrees. The whole sky is 41 253 square degrees, so about 940 plates would cover it, and with overlaps the Palomar survey, which stopped at declination −30°, still needed some 900 fields.'
      ],
      a: '67.2″ per mm; 6.6° wide; about 940 plates for the whole sky.'
    },
    {
      title: 'A gnomonic atlas page',
      q: 'An atlas page is a gnomonic chart 40° wide centred on a constellation. How much larger are the radial lengths at the middle of the edge than at the centre? At the corner of a page that is 40° by 30°?',
      steps: [
        { text: 'The middle of the edge is 20° from the centre:', tex: 'k = \\sec^2 20° = 1.13' },
        { text: 'The corner is at $\\theta = \\arctan\\sqrt{\\tan^2 20° + \\tan^2 15°}= 24.3°$, so', tex: 'k = \\sec^2 24.3° = 1.20' },
        'The stars at the page edge are drawn 13 % too far from the centre, at the corner 20 %. This is hardly noticeable in a constellation, but would make a mosaic of such pages show gaps; the stereographic one would have only 3 % and 5 % (sec²(θ/2)).'
      ],
      a: '13 % at the edge, 20 % at the corner.'
    }
  ],
  quiz: [
    { q: 'Bayer\'s Uranometria (1603) is famous for', choices: ['the first telescopic star catalogue', 'naming stars by Greek letters', 'the first photographic atlas', 'listing a million stars'], a: 1, why: 'Bayer gave each star in a constellation a Greek letter, roughly in order of brightness: α Centauri, β Orionis. The system is used today. The atlas had no telescopic stars.' },
    { q: 'How many constellations does the IAU recognise since 1930?', answer: 88, why: 'The IAU fixed 88 constellations and their boundaries in 1928–30; the 48 of Ptolemy plus those added later, especially in the south.' },
    { q: 'The Palomar Schmidt plate scale of 67 arcseconds per millimetre means a star 1 mm from another on the plate is separated by', choices: ['about 1 arcminute', 'about 1 degree', 'about 1 arcsecond', 'about 10 degrees'], a: 0, why: '67″ is a little over an arcminute (60″).' },
    { q: 'In a gnomonic chart the scale at 45° from the centre is stretched radially by', answer: 2, why: '$\\sec^2 45° = 2$: a stretch of 100 %.' },
    { q: 'Gaia gave positions of about a thousand stars.', a: false, why: 'Gaia\'s third data release (2022) contains about 1.8 billion sources; Hipparcos, its predecessor, measured 118 218 stars.' }
  ],
  applications: [
    'Observing with a telescope: finder charts from atlases like Uranometria 2000.0 or from software are drawn with a limiting magnitude and plate scale matched to the eyepiece.',
    'Professional astronomy: catalogues such as Hipparcos, Tycho-2 and Gaia give the reference frame for all positions in astronomy and for spacecraft pointing.',
    'Naming: the Bayer, Flamsteed, HD and BD designations are all citations of the atlas or catalogue where the star first appeared.',
    'Planetaria and apps: the sky of Stellarium or of a phone app is a fast projection of the Gaia and Hipparcos catalogues for your place and time.',
    'Cartography: the techniques of choosing and combining projections for plates in an atlas are those of any map series.'
  ],
  history: `Bayer's atlas followed Tycho Brahe's measurements and the first catalogues of the southern sky by the Dutch navigators Keyser and de Houtman (1595–97), whose twelve new southern constellations he added to the charts. Flamsteed, the first Astronomer Royal, spent his career measuring the places of 3000 stars from Greenwich; Isaac Newton and Edmond Halley pressed him to publish and Halley issued a pirated catalogue in 1712. The posthumous *Atlas Coelestis* (1729) was illustrated with figures drawn by James Thornhill. Bode's *Uranographia* appeared in 1801 and Argelander's *Uranometria Nova* in 1843; photography replaced the eye in the 1880s with the Carte du Ciel, and the Palomar Observatory Sky Survey (1949–58) gave the first photographic atlas of the northern sky. The present age began with ESA's Hipparcos mission (1989–93) and Gaia (launched 2013).`,
  sources: ['Nick Kanas, *Star Maps: History, Artistry and Cartography* (2nd ed., 2012), chapters 5–9.', 'Wil Tirion, Barry Rappaport and George Lovi, *Uranometria 2000.0* (1987), the introduction.', 'John P. Snyder, *Map Projections — A Working Manual* (1987), on the gnomonic, stereographic and azimuthal projections.', 'ESA, *The Hipparcos and Tycho Catalogues* (1997), and the Gaia Collaboration, *Gaia Data Release 3: summary of the content and survey properties* (2023).', 'Jean Meeus, *Astronomical Algorithms* (2nd ed., 1998).'],
  sim: 'sh-atlas-plate',
  construction: 'sh-bayer-trapezoid'
}
);
