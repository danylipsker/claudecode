/* HYPER-PROJECTIONS · content/navigation-science-and-medicine.js — Projections at Work: navigation, science and medicine.
 *
 *   charts-and-navigation, aviation-and-polar-routes, gps-and-web-maps, radar-and-sonar-displays,
 *   medical-imaging-projections, astronomy-and-planetary-maps, crystallography-stereographic, weather-maps
 * Each page is a use page: which projection the practice relies on, why that one, the numbers, a worked case, what goes
 * wrong with the wrong projection, and a construction or a simulation (sims/navigation-science-and-medicine.js,
 * constructions/navigation-science-and-medicine.js).
 */
Hyper.add(
{
  id: 'charts-and-navigation',
  parent: 'navigation-science-and-medicine',
  title: 'Charts and navigation',
  level: 2,
  short: 'The navigator\'s chart is Mercator because a compass course is then a straight line: lay the rule from port to port, read the bearing with a protractor, take the distance from the latitude scale with the dividers. The shortest route is a curve, and is steered as a chain of straight legs.',
  keywords: ['nautical chart', 'Mercator chart', 'course', 'rhumb line', 'meridional parts', 'latitude scale', 'dividers', 'parallel rule', 'position line', 'fix', 'plane sailing', 'great circle sailing', 'nautical mile'],
  prereq: ['mercator-projection', 'great-circles-and-rhumb-lines', 'gnomonic-projection'],
  related: ['aviation-and-polar-routes', 'gps-and-web-maps', 'conformal-maps', 'scale-factor-and-standard-parallels'],
  body: `A ship has a compass and a clock. The compass gives the heading, the clock (with a log or a GPS) gives the distance run, and the navigator's job is to keep a line on paper that matches the ship's track. That asks three things of the paper: a **course** must be a straight line, so that one ruler stroke gives the heading; **angles** must be true, so that a bearing taken to a lighthouse can be drawn as a line at that angle; and **distance** must be readable somewhere on the chart without a calculation. The Mercator projection ([[mercator-projection]]) is the one map that gives the first two exactly, and the third by a rule.

### The chart-table kit
Lay a parallel rule or a plotter on the chart along the line from the departure to the destination; walk it, without turning, to the nearest compass rose; read the **true course**. Allow for the magnetic *variation* of the place and the compass *deviation* of the ship and you have the course to steer. Distances come from the **latitude scale** at the side of the chart: one minute of latitude is one nautical mile (1852 m, defined so). On a Mercator chart the length of a minute grows towards the pole (by $\\sec\\varphi$), so the dividers must be set against the part of the scale **level with the leg** — never against the longitude scale along the top, which is a different thing — and a long leg is stepped off in several pieces.

### Position lines and fixes
A bearing to a charted object puts the ship somewhere on a straight line through it, a **position line**; two bearings to different objects cross at a **fix**; three never quite meet and leave a small triangle, the *cocked hat*, whose size measures how far the bearings can be trusted. Because the chart is conformal, a line drawn at the measured angle is the true line of position, anywhere on the sheet.

### The sums
On the sphere the chart's ruler line has the formulas of *Mercator sailing*. With $\\Delta\\varphi$ the change of latitude, $\\Delta\\lambda$ of longitude, and $\\Delta\\mathrm{MP}$ the difference of the **meridional parts** (the chart's own vertical coordinate, from the table or from $\\ln\\tan(45° + \\varphi/2)$),
$$\\tan C = \\frac{\\Delta\\lambda}{\\Delta\\mathrm{MP}}, \\qquad D = \\Delta\\varphi\\,\\sec C.$$
From 50° N 5° W to 40° N 70° W: $\\Delta\\mathrm{MP} = 851.8$ minutes, $\\Delta\\lambda = 3900$ minutes, so $C = 257.7°$ and $D = 600\\sec 77.7° = 2814$ nautical miles. The shortcut *middle-latitude sailing* uses $\\Delta\\lambda\\cos\\varphi_m$ as a stand-in for the east–west distance and is right to a fraction of a per cent on short legs.

### The straight line is not the shortest
The rhumb line of 2814 nm is 80 nm (2.9 %) longer than the great circle between the same ports. The great circle is a curve on the Mercator chart, bowing towards the pole (it reaches 51.3° N on this passage). The classic solution is to draw it as a straight line on a **gnomonic** chart ([[gnomonic-projection]]), read off the latitude and longitude of waypoints every 15° or 20°, and transfer them to the Mercator chart, where the passage becomes a chain of rhumb legs: here 275.7°, 260.0° and 243.1°, 2743 nm in all — within 0.3 % of the ideal.

> [!note] Electronic charts (ECDIS) still *show* a Mercator chart, but they compute positions, courses and distances on the ellipsoid of WGS 84; the Mercator sheet is the picture, not the arithmetic.`,
  ideas: [
    'A compass course crosses every meridian at the same angle: on Mercator it is a straight line, so one ruler stroke gives the heading.',
    'The chart is conformal: a bearing to a lighthouse drawn at the measured angle is a true line of position, so two bearings give a fix.',
    'One minute of latitude is one nautical mile; take distances with the dividers from the latitude scale level with the leg, never from the longitude scale.',
    'Mercator sailing: tan C = Δλ/ΔMP and D = Δφ·sec C. Middle-latitude sailing replaces ΔMP by Δφ and uses departure Δλ·cos φm.',
    'The great circle is shorter but curved on Mercator: plot it on a gnomonic chart and steer it as rhumb legs between waypoints.'
  ],
  pitfalls: [
    'A straight line on the chart is the shortest way — It is the rhumb line, the track of constant compass heading; the great circle is shorter (3 % on this Atlantic passage, much more at high latitude).',
    'Distances are read off the bottom scale — The longitude scale along the top and bottom is on the equator\'s scale and is not a mile scale at all; use the latitude scale at the side, level with the leg.',
    'The compass gives the true bearing — A magnetic compass gives magnetic north plus the ship\'s deviation. Variation and deviation must be applied before a bearing is drawn on a chart referred to true north.'
  ],
  formulas: [
    {
      name: 'Meridional parts',
      expr: 'MP = ln(tan(pi/4 + phi/2))',
      tex: '\\mathrm{MP} = \\ln\\tan\\left(\\frac{\\pi}{4} + \\frac{\\varphi}{2}\\right)',
      vars: {
        MP: { name: 'vertical distance of the parallel from the equator, in minutes of equatorial arc', q: 'angle', unit: '′' },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 50, signed: true, min: -85, max: 85, tex: '\\varphi' }
      },
      solveFor: 'MP',
      note: 'The table in the almanac for the sphere: at 50° the parallel is 3474.5 minutes of equatorial arc from the equator, at 40° it is 2622.7. (The published tables use the ellipsoid and differ slightly.)'
    },
    {
      name: 'Course by Mercator sailing',
      expr: 'C = atan(DLo/dMP)',
      tex: 'C = \\arctan\\frac{\\Delta\\lambda}{\\Delta\\mathrm{MP}}',
      vars: {
        C: { name: 'course angle, measured from the nearer pole', q: 'angle', unit: '°', min: 0, max: 89.9 },
        DLo: { name: 'difference of longitude', q: 'angle', unit: '′', value: 3900, tex: '\\Delta\\lambda' },
        dMP: { name: 'difference of meridional parts', q: 'angle', unit: '′', value: 851.8, tex: '\\Delta\\mathrm{MP}' }
      },
      solveFor: 'C',
      note: 'Quadrant naming: the angle from north or south towards east or west. 77.7° with both differences westward and southward is course S 77.7° W, i.e. 257.7° true.'
    },
    {
      name: 'Distance along a rhumb line',
      expr: 'd = R*dphi/cos(C)',
      tex: 'D = \\frac{R_\\oplus\\,\\Delta\\varphi}{\\cos C}',
      vars: {
        d: { name: 'distance run', q: 'length', unit: 'nmi', tex: 'D' },
        R: { const: 'Rearth' },
        dphi: { name: 'change of latitude', q: 'angle', unit: '′', value: 600, tex: '\\Delta\\varphi' },
        C: { name: 'course angle', q: 'angle', unit: '°', value: 77.68, min: 0, max: 89 }
      },
      solveFor: 'd',
      note: 'One minute of latitude is one nautical mile (the constant R gives 1853 m, the definition 1852 m, a difference of 0.05 %). At 77.7° the leg is 1/cos C = 4.7 times its north–south component.'
    },
    {
      name: 'Departure in middle-latitude sailing',
      expr: 'p = DLo*cos(phim)',
      tex: 'p = \\Delta\\lambda\\,\\cos\\varphi_m',
      vars: {
        p: { name: 'departure (east–west distance, in nautical miles)', q: 'angle', unit: '′' },
        DLo: { name: 'difference of longitude', q: 'angle', unit: '′', value: 3900, tex: '\\Delta\\lambda' },
        phim: { name: 'middle latitude of the leg', q: 'angle', unit: '°', value: 45, min: 0, max: 85, tex: '\\varphi_m' }
      },
      solveFor: 'p',
      note: 'The parallel of the middle latitude is the average parallel of the leg. For a 65° passage this gives 2758 nm of departure; with the change of latitude the course is 77.7° and the distance 2822 nm, 0.3 % more than Mercator sailing.'
    }
  ],
  examples: [{
    title: 'Steering across the Atlantic by Mercator sailing',
    q: 'A ship leaves 50° N 5° W for 40° N 70° W. Find the rhumb-line course and distance, and compare with the great circle.',
    steps: [
      { text: 'Meridional parts (sphere, minutes of equatorial arc): $\\mathrm{MP}(50°) = 3474.5$, $\\mathrm{MP}(40°) = 2622.7$.', tex: '\\Delta\\mathrm{MP} = 2622.7 - 3474.5 = -851.8,\\qquad \\Delta\\varphi = -600′,\\qquad \\Delta\\lambda = -65° = -3900′' },
      { text: 'Both differences are negative, so the track runs south and west:', tex: '\\tan C = \\frac{3900}{851.8} = 4.578 \\;\\Rightarrow\\; C = 77.7°\\ \\text{(S 77.7° W = 257.7° true)}' },
      { text: 'Distance:', tex: 'D = 600 \\sec 77.7° = \\frac{600}{0.2133} = 2814\\ \\text{nm}' },
      'The great circle between the same points is 2734 nm and leaves at 283.4°, 26° north of the rhumb course, rising to 51.3° N.',
      'Saving 80 nm: at 12 knots, nearly 7 hours. Fitted with waypoints at 25° W and 45° W the passage is three rhumb legs of 765, 781 and 1196 nm, 2743 nm in all.'
    ],
    a: 'The rhumb line: 257.7° for 2814 nm; the great circle 2734 nm; three legs along it 2743 nm.'
  }],
  quiz: [
    { q: 'On a Mercator chart, a line that crosses every meridian at the same angle is', choices: ['a curve, because meridians converge', 'a straight line', 'a circle arc', 'the shortest route'], a: 1, why: 'Meridians are parallel straight lines on a Mercator chart, so a constant angle to them is a constant direction: a straight line. It is the rhumb line, not generally the shortest route.' },
    { q: 'To measure a 40-mile leg at latitude 55° N on a Mercator chart, the dividers should be set against', choices: ['the longitude scale along the top', 'the latitude scale at the side, level with the leg', 'the scale at the equator', 'any scale; they are all the same'], a: 1, why: 'The chart\'s scale grows as sec φ. A minute of latitude is a nautical mile everywhere, but its length on paper depends on the latitude: use the latitude scale near the leg.' },
    { q: 'A leg has Δλ = 600′ and ΔMP = 600′. What is the course angle in degrees?', answer: 45, unit: '°', why: 'tan C = Δλ/ΔMP = 1, so C = 45°.' },
    { q: 'Three bearings to three charted objects usually do not meet at a point; the small triangle they leave is called', choices: ['a cocked hat', 'a rhumb', 'a graticule', 'a fix'], a: 0, why: 'The cocked hat measures the error in the bearings (compass, plotting). Its size tells the navigator how much to trust the fix.' },
    { q: 'A great circle drawn on a gnomonic chart can be steered directly as a single course.', a: false, why: 'A great circle crosses successive meridians at changing angles, so it is not a constant course. It is steered as a series of rhumb legs between waypoints read off the gnomonic chart.' }
  ],
  applications: [
    'Paper sea charts: nearly every one is a Mercator sheet, so that a course is a ruler line, a bearing is a drawn angle, and the latitude scale is the mile scale for the leg.',
    'Passage planning: the great-circle route from a gnomonic chart (or an ECDIS route-planner) transferred to the Mercator chart as rhumb legs, as in ocean crossings and the Great Circle Sailing section of Bowditch.',
    'Coastal pilotage: position lines from bearings, transits and radar ranges; because the chart is conformal, they are valid anywhere on the sheet, and large scales have almost uniform distance scale.',
    'Electronic chart displays and web charts: the screen picture is a Mercator view that can be zoomed at will, while the computation of courses and distances is done on the WGS 84 ellipsoid.'
  ],
  history: 'Gerardus Mercator published his chart "for the use of navigators" in 1569; Edward Wright worked out the mathematics and the tables of meridional parts in *Certaine Errors in Navigation* (1599), which turned it into a working tool. The nautical mile was fixed at 1852 m by the First Extraordinary International Hydrographic Conference in Monaco in 1929. Radio bearings and radar added position lines, and GPS made the fix automatic, but the charts that the fix is plotted on have changed less than any other part of the ship.',
  sources: ['Nathaniel Bowditch, *The American Practical Navigator*, Pub. No. 9 (National Geospatial-Intelligence Agency), the chapters on navigational mathematics, chart projections and sailings.', 'Admiralty Manual of Navigation, Volume 1 (BR 45), the chapters on charts and on the sailings.', 'Edward Wright, *Certaine Errors in Navigation* (1599), and John P. Snyder, *Map Projections — A Working Manual* (1987), the Mercator chapter.'],
  sim: 'ns-mercator-chart',
  construction: ['ns-mercator-plotting', 'ns-gnomonic-to-mercator']
},

{
  id: 'aviation-and-polar-routes',
  parent: 'navigation-science-and-medicine',
  title: 'Aviation charts and polar routes',
  level: 2,
  short: 'Pilots want the shortest route straight on the chart, true angles for tracks and bearings, and one scale for distance. The Lambert conformal conic gives all three over a mid-latitude region; near the pole the polar stereographic does, and a gnomonic chart plots any great circle straight.',
  keywords: ['aeronautical chart', 'sectional chart', 'Lambert conformal conic', 'standard parallels', 'cone constant', 'convergence', 'great circle', 'polar stereographic', 'grid navigation', 'ICAO Annex 4', 'polar route', 'en route chart'],
  prereq: ['lambert-conformal-conic', 'stereographic-projection', 'great-circles-and-rhumb-lines', 'scale-factor-and-standard-parallels'],
  related: ['charts-and-navigation', 'weather-maps', 'gnomonic-projection', 'conformal-maps', 'aerodynamics:pressure-altitude'],
  body: `An aircraft flies at 800 km/h, so the route it follows is worth planning to the kilometre, and its track is the shortest line, a great circle. A pilot or dispatcher needs the chart to do four things at once: show the great circle as nearly a **straight line**, keep **angles true** (so that a track or a bearing from a beacon can be measured with a protractor), keep the **scale nearly constant** (so a ruler measures distance), and cover a whole country or ocean on a sheet. No map does all four exactly, but one comes close for mid-latitudes.

### The Lambert conformal conic
Cone the sphere along two standard parallels $\\varphi_1$, $\\varphi_2$ ([[lambert-conformal-conic]]). Meridians become straight lines meeting at the apex, parallels are arcs about it, and the **cone constant**
$$n = \\frac{\\ln(\\cos\\varphi_1/\\cos\\varphi_2)}{\\ln\\!\\big(\\tan(45° + \\varphi_2/2)\\big/\\tan(45° + \\varphi_1/2)\\big)}$$
is the angle between two meridians per degree of longitude. With the US choice $\\varphi_1 = 33°$, $\\varphi_2 = 45°$ it is 0.630. The scale is exactly 1 on the two parallels, 0.9945 between them (at 39°) and 1.014 at 50°: within 1.5 % from 30° to 50° N. Angles are true everywhere. Rule of thumb for choosing the parallels: one sixth of the way in from the top and the bottom of the sheet.

On it, a straight line is nearly a great circle. The reason is in the constant: the great circle has to turn by the *convergence of the meridians*, and the cone makes the meridians converge at $n\\,\\Delta\\lambda$ ($12.6°$ for 20° of longitude), close to what the sphere does at the middle latitude, $\\sin\\varphi_m$. On the chart, the New York–Los Angeles great circle (3935 km) stays within 2 km of the straight line between them; on Mercator it is 300 km out. ICAO Annex 4 specifies the conic for the 1:1 000 000 aeronautical chart of the mid-latitudes, and the US sectional and IFR en route charts use it as well.

### The pole
Near the pole all of that fails: meridians converge at 1° per degree of longitude, a magnetic compass cannot be trusted (the field is nearly vertical), and "north" changes every few kilometres. The projection that works is the **polar stereographic** ([[stereographic-projection]]) — conformal, the pole at the centre, the meridians straight spokes. A great circle that passes near the pole is nearly straight on it: New York–Tokyo (10 849 km) stays within 480 km of the chord; Chicago–Beijing within 300 km. Navigation is by **grid heading**: a grid north is chosen (often the direction of the Greenwich meridian), and the heading is measured from it everywhere on the sheet, with the convergence $= $ longitude difference from the grid meridian.

### And the straight great circle
For planning, the **gnomonic** chart ([[gnomonic-projection]]) draws every great circle exactly straight, at the price of enormous distortion away from the centre; it is a chart to draw on, not to measure.

> [!warn] Mixing scales is how airliners go wrong: a nautical mile, a statute mile and a kilometre are different units, and the flight management system works on the WGS 84 ellipsoid, not on any of these flat charts. The chart is a picture for humans.`,
  ideas: [
    'The Lambert conformal conic keeps angles true and the scale within 1–2 % over a mid-latitude sheet, and a straight line on it is almost a great circle.',
    'Cone constant n = ln(cos φ₁/cos φ₂)/ln(tan(45°+φ₂/2)/tan(45°+φ₁/2)); the meridians converge at n per degree of longitude, about sin φ at the middle latitude.',
    'Choose the standard parallels about one sixth in from the edges of the sheet: the scale is exactly 1 there and a little under 1 between them.',
    'Near the pole the polar stereographic is the conformal chart; the great circles of polar routes are nearly straight and navigation is by grid heading.',
    'A gnomonic chart makes every great circle exactly straight, but distorts so much that it is only for plotting.'
  ],
  pitfalls: [
    'Mercator is the pilots\' chart too — A Mercator chart bends the great circle by hundreds of kilometres; it is the sailor\'s chart because a ship steers a constant heading, which an airliner on a long route does not.',
    'A straight line on the conic has the same true course everywhere — Meridians converge, so the course changes along the line by n × Δλ; the pilot reads the course at the middle meridian or flies a series of great-circle legs.',
    'North on the chart is north at the pole — Near the pole the compass is unusable and true north changes with position; polar charts carry a grid north, and headings are grid headings.'
  ],
  formulas: [
    {
      name: 'Cone constant of the Lambert conformal conic',
      expr: 'n = ln(cos(p1)/cos(p2))/ln(tan(pi/4 + p2/2)/tan(pi/4 + p1/2))',
      tex: 'n = \\frac{\\ln(\\cos\\varphi_1/\\cos\\varphi_2)}{\\ln\\big(\\tan(\\tfrac{\\pi}{4} + \\tfrac{\\varphi_2}{2})/\\tan(\\tfrac{\\pi}{4} + \\tfrac{\\varphi_1}{2})\\big)}',
      vars: {
        n: { name: 'cone constant', tex: 'n' },
        p1: { name: 'first standard parallel', q: 'angle', unit: '°', value: 33, min: 1, max: 80, tex: '\\varphi_1' },
        p2: { name: 'second standard parallel', q: 'angle', unit: '°', value: 45, min: 2, max: 85, tex: '\\varphi_2' }
      },
      solveFor: 'n',
      note: '33° and 45° give 0.630; 30° and 60° give 0.716. When the two parallels coincide, n = sin φ₁ (the tangent cone).'
    },
    {
      name: 'Convergence of the chart\'s meridians',
      expr: 'conv = n*dl',
      tex: '\\gamma = n\\,\\Delta\\lambda',
      vars: {
        conv: { name: 'angle between the meridians on the chart', q: 'angle', unit: '°', tex: '\\gamma' },
        n: { name: 'cone constant', value: 0.63, min: 0.05, max: 1, tex: 'n' },
        dl: { name: 'difference of longitude', q: 'angle', unit: '°', value: 20, tex: '\\Delta\\lambda' }
      },
      solveFor: 'conv',
      note: 'The great circle\'s true course changes by about this much from one end of a straight line on the chart to the other: with n = 0.63 and 20° of longitude, 12.6°.'
    },
    {
      name: 'Scale factor of the Lambert conformal conic',
      expr: 'k = cos(p1)/cos(phi)*(tan(pi/4 + p1/2)/tan(pi/4 + phi/2))^n',
      tex: 'k = \\frac{\\cos\\varphi_1}{\\cos\\varphi}\\left(\\frac{\\tan(\\tfrac{\\pi}{4} + \\tfrac{\\varphi_1}{2})}{\\tan(\\tfrac{\\pi}{4} + \\tfrac{\\varphi}{2})}\\right)^{n}',
      vars: {
        k: { name: 'scale factor (the same in every direction)' },
        p1: { name: 'standard parallel', q: 'angle', unit: '°', value: 33, min: 1, max: 80, tex: '\\varphi_1' },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 39, min: 1, max: 80, tex: '\\varphi' },
        n: { name: 'cone constant', value: 0.63, min: 0.05, max: 1, tex: 'n' }
      },
      solveFor: 'k',
      note: 'Equal to 1 at the standard parallels, below 1 between them, above 1 outside: at 39° with the 33°/45° cone, 0.9945; at 50°, 1.0139; at 25°, 1.0235.'
    },
    {
      name: 'Great-circle distance',
      expr: 'd = R*acos(sin(a1)*sin(a2) + cos(a1)*cos(a2)*cos(dl))',
      tex: 'd = R_\\oplus\\arccos\\big(\\sin\\varphi_1\\sin\\varphi_2 + \\cos\\varphi_1\\cos\\varphi_2\\cos\\Delta\\lambda\\big)',
      vars: {
        d: { name: 'length of the great-circle arc', q: 'length', unit: 'km' },
        R: { const: 'Rearth' },
        a1: { name: 'latitude of the first point', q: 'angle', unit: '°', value: 40.64, signed: true, min: -90, max: 90, tex: '\\varphi_1' },
        a2: { name: 'latitude of the second point', q: 'angle', unit: '°', value: 33.94, signed: true, min: -90, max: 90, tex: '\\varphi_2' },
        dl: { name: 'difference of longitude', q: 'angle', unit: '°', value: 44.63, min: 0, max: 180, tex: '\\Delta\\lambda' }
      },
      solveFor: 'd',
      note: 'The spherical law of cosines. New York (JFK) to Los Angeles (LAX) is 3 970 km by the airport coordinates in the default values; real routes are longer by the winds, the airways and the approaches.'
    }
  ],
  examples: [{
    title: 'How straight is the great circle on the chart?',
    q: 'A route from New York to Los Angeles is flown on a Lambert conformal conic chart with standard parallels 33° and 45°. Find the cone constant, the convergence of the chart\'s meridians between the two cities (44.6° of longitude apart), and the course difference between the two ends of the straight line.',
    steps: [
      { text: 'Cone constant:', tex: 'n = \\frac{\\ln(\\cos 33°/\\cos 45°)}{\\ln(\\tan 67.5°/\\tan 61.5°)} = \\frac{\\ln 1.1860}{\\ln 1.3108} = 0.630' },
      { text: 'Convergence between the two end meridians:', tex: '\\gamma = n\\,\\Delta\\lambda = 0.630 \\times 44.6° = 28.1°' },
      'The straight line on the chart has one direction, but the meridians it crosses change by 28.1° along it. So the true course at New York is about 14° north of the course at the middle, and at Los Angeles 14° south: the pilot reads the middle course and expects the heading to change as the flight proceeds.',
      'On the sphere the same change is the great-circle convergence $\\Delta\\lambda\\sin\\varphi_m = 44.6° \\times \\sin 37° = 26.8°$, close to the chart\'s 28.1°, which is why the straight line on the chart is a good great circle.'
    ],
    a: 'n = 0.630; the meridians converge by 28.1° between the cities, so the true course along the straight chart line changes by about that much.'
  }],
  quiz: [
    { q: 'Which projection is the standard for en route and 1:1 000 000 aeronautical charts of mid-latitudes?', choices: ['Mercator', 'Lambert conformal conic', 'Sinusoidal', 'Plate carrée'], a: 1, why: 'The conic keeps angles true, has a nearly uniform scale between two standard parallels, and makes straight lines nearly great circles.' },
    { q: 'The scale of a Lambert conformal conic with standard parallels 33° and 45° is exactly 1', choices: ['at 39° only', 'at the pole', 'at 33° and 45°', 'everywhere'], a: 2, why: 'The cone cuts the sphere along the standard parallels, so they are the only true-length parallels; between them the scale is slightly less than 1, outside slightly more.' },
    { q: 'A Lambert conic has cone constant 0.63. The true course of a straight line on it changes by how many degrees along 30° of longitude?', answer: 18.9, unit: '°', why: 'Convergence γ = n Δλ = 0.63 × 30 = 18.9°.' },
    { q: 'Near the North Pole the best conformal chart for a transpolar flight is the polar stereographic, and headings on it are measured against a grid north.', a: true, why: 'The polar stereographic is conformal with straight meridians; the magnetic compass is unreliable there, so a grid north is chosen and headings are grid headings.' },
    { q: 'Why is a gnomonic chart used only for planning, not for measuring?', choices: ['It cannot show great circles', 'Distances and angles distort enormously away from the centre', 'It needs a computer', 'It stops at 45° latitude'], a: 1, why: 'Every great circle is straight, which is wonderful for drawing a route, but the scale grows as sec² of the distance from the centre and angles are not true.' }
  ],
  applications: [
    'Aeronautical charts: the US sectional and IFR en route charts, the ICAO 1:1 000 000 chart and most national aeronautical maps are Lambert conformal conics, with the parallels chosen for the sheet.',
    'Airline route planning: the great circle between airports is computed on the ellipsoid, shown on a conic or on a polar stereographic chart, and flown as a series of waypoints.',
    'Polar and high-latitude flying: polar stereographic charts with grid headings, because the meridians converge so fast and the magnetic compass is unusable.',
    'Search and rescue and long-range planning: gnomonic plots, where a straight line is a great circle and a circle about the centre gives equal distance.'
  ],
  history: 'Johann Heinrich Lambert described the conformal conic in 1772. It was taken up for French military maps in the First World War and then, between the wars, for aeronautical charts and the US State Plane coordinate systems; ICAO standardised the aeronautical chart series in Annex 4 (first adopted in 1948). Scandinavian Airlines pioneered the polar routes in the 1950s; heavy use of them began in the late 1990s, when the Russian airspace services opened Arctic routes to Western airlines.',
  sources: ['ICAO, *Annex 4 to the Convention on International Civil Aviation: Aeronautical Charts* — the specifications for the 1:1 000 000 chart and for the en route chart, and the use of the polar stereographic projection in the polar areas.', 'John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapters on the Lambert conformal conic and the stereographic projection.', 'FAA, *Aeronautical Chart User\'s Guide* and *Pilot\'s Handbook of Aeronautical Knowledge* (FAA-H-8083-25), the chapters on charts and navigation.'],
  sim: 'ns-route-charts',
  construction: ['ns-lambert-aviation', 'ns-polar-route']
},

{
  id: 'gps-and-web-maps',
  parent: 'navigation-science-and-medicine',
  title: 'GPS, tiles and web maps',
  level: 2,
  short: 'GPS finds a point in space from the delays of four radio signals — trilateration, circles on a plan — and reports it as latitude and longitude on an ellipsoid. The phone then draws it on Web Mercator: a square world cut into tiles, chosen because a conformal map zooms cleanly and its arithmetic is cheap.',
  keywords: ['GPS', 'GNSS', 'trilateration', 'pseudorange', 'clock bias', 'WGS 84', 'Web Mercator', 'EPSG:3857', 'map tiles', 'zoom level', 'slippy map', 'quadkey', 'metres per pixel', 'geodetic latitude'],
  prereq: ['web-mercator', 'mercator-projection', 'conformal-maps', 'scale-factor-and-standard-parallels'],
  related: ['charts-and-navigation', 'transverse-mercator-and-utm', 'surveys-and-national-grids', 'equirectangular-projection', 'physics:circular-orbits'],
  body: `Two quite different jobs sit behind the blue dot on a phone: **finding** where you are, which is geometry in space, and **drawing** it, which is a map projection.

### Finding: circles and spheres
About thirty GPS satellites circle at 20 200 km altitude (orbital radius 26 560 km), once in 11 h 58 min. Each broadcasts its own position and the exact time. The receiver notes when the signal arrived; the delay times $c$ is a **range** $r_i$, so the receiver lies on a sphere about satellite $i$. On the ground plan that is a circle — three circles drawn with the compass about three known beacons meet at one point, the receiver. In space, three spheres meet in two points, one of which is absurd (far out in space).

The catch is the receiver's clock. A quartz clock wrong by $\\delta$ makes every range wrong by the same $c\\,\\delta$ (1 µs is 300 m, 10 ns is 3 m): the quantities measured are **pseudoranges** $\\rho_i = r_i + c\\,\\delta$. There are four unknowns, $x, y, z, \\delta$, so the receiver needs **four satellites** — and then has the time to better than 100 ns as a by-product. The satellites carry atomic clocks tuned for relativity: the weaker gravity at altitude speeds them by about 46 µs a day and their speed slows them by about 7, a net 38 µs a day, which would accumulate into 11 km of error a day if it were not corrected.

The answer is an Earth-centred Cartesian position, converted to **geodetic** latitude, longitude and height on the **WGS 84** ellipsoid ($a = 6\\,378\\,137$ m, flattening 1/298.257). Civil receivers are good to a few metres under open sky.

### Drawing: Web Mercator
Almost every web map uses one projection, **Web Mercator** (EPSG:3857, [[web-mercator]]): the Mercator formulas applied with the sphere of radius $a = 6\\,378\\,137$ m to the ellipsoidal latitude. The world ends at ±85.0511° — there $y = \\pm\\pi a$ and the map is a **square** — and the square is cut into a **pyramid of tiles**: zoom level $z$ has $2^z \\times 2^z$ tiles of 256 pixels. A point at longitude $\\lambda$, latitude $\\varphi$ falls in tile
$$x = \\Big\\lfloor 2^z\\,\\frac{\\lambda + 180°}{360°}\\Big\\rfloor,\\qquad y = \\Big\\lfloor 2^{z-1}\\Big(1 - \\frac{\\ln(\\tan\\varphi + \\sec\\varphi)}{\\pi}\\Big)\\Big\\rfloor.$$
Zooming in is cutting each tile into four: exactly a factor 2 in scale. The ground size of a pixel is $156\\,543\\ \\mathrm{m}\\times\\cos\\varphi / 2^z$: 0.74 m at London at zoom 17, 1.01 m at Tel Aviv, 0.24 m at Longyearbyen.

### Why this projection
A map for *looking things up* needs the street layout to look right wherever you zoom: that is conformality ([[conformal-maps]]), and Mercator's meridians and parallels are straight, so north is up and tile boundaries are lines of latitude and longitude. The arithmetic is two lines. The price is the one on every Mercator map: scale grows as $\\sec\\varphi$.

> [!warn] Do not measure with it. A "metre" on the Web Mercator plane is $\\sec\\varphi$ times too long: at London, 1000 map-metres are 621 real ones. Compute distances on the ellipsoid, from latitude and longitude. Also, the sphere formulas applied to ellipsoidal latitudes make a map that is only almost conformal: positions differ from true Mercator by up to about 40 km in north–south — irrelevant for display, a trap for surveying.`,
  ideas: [
    'GPS measures delays to known satellites; each delay times c is a range, so the receiver is on a sphere (a circle on a plan) about each: three circles meet at the point.',
    'The receiver clock is wrong, so the measured ranges are pseudoranges r + c·δ: four unknowns need four satellites. 1 µs of error is 300 m.',
    'The position is geodetic latitude, longitude and height on the WGS 84 ellipsoid, then drawn on Web Mercator.',
    'Web Mercator is Mercator of the sphere cut at ±85.0511° so that the world is a square; zoom z is a 2^z × 2^z grid of tiles; each zoom level doubles the scale.',
    'Pixels are cos φ × 156 543 m / 2^z on the ground; the map scale is sec φ, so map distances are not ground distances.'
  ],
  pitfalls: [
    'GPS needs three satellites — Three would do if the receiver clock were perfect. The unknown clock bias is the fourth unknown, which is why four are needed (and why a GPS fix also gives the time).',
    'Web Mercator measures distance — The "metres" of EPSG:3857 are stretched by sec φ and so are 1.6 times too long at 51°; for distances use the great-circle or ellipsoidal geodesic from the coordinates.',
    'Latitude and longitude are a map projection — They are coordinates on the ellipsoid; plotting them straight as x and y is the plate carrée, not Mercator, and looks stretched.'
  ],
  formulas: [
    {
      name: 'Pseudorange',
      expr: 'rho = r + c*dt',
      tex: '\\rho = r + c\\,\\delta',
      vars: {
        rho: { name: 'measured pseudorange', q: 'length', unit: 'km', tex: '\\rho' },
        r: { name: 'true distance to the satellite', q: 'length', unit: 'km', value: 22000 },
        c: { const: 'c' },
        dt: { name: 'receiver clock error', q: 'time', unit: 'µs', value: 10, signed: true, tex: '\\delta' }
      },
      solveFor: 'rho',
      note: 'Every satellite\'s range is off by the same c·δ: 10 µs is 3 km. That is why the clock is an unknown, solved with x, y, z from four satellites.'
    },
    {
      name: 'Tile column of a longitude',
      expr: 'tx = 2^z*(lon + pi)/(2*pi)',
      tex: 'x = 2^{z}\\,\\frac{\\lambda + 180°}{360°}',
      vars: {
        tx: { name: 'tile column (fractional; the tile is its integer part)', tex: 'x' },
        z: { name: 'zoom level', value: 5, int: true, min: 0, max: 22 },
        lon: { name: 'longitude', q: 'angle', unit: '°', value: 34.78, signed: true, min: -180, max: 180, tex: '\\lambda' }
      },
      solveFor: 'tx',
      note: 'Tile 19 of 32 at zoom 5 for Tel Aviv: 34.78° E gives 19.09. Longitude is linear in x.'
    },
    {
      name: 'Tile row of a latitude',
      expr: 'ty = 2^(z - 1)*(1 - ln(tan(lat) + sec(lat))/pi)',
      tex: 'y = 2^{z-1}\\left(1 - \\frac{\\ln(\\tan\\varphi + \\sec\\varphi)}{\\pi}\\right)',
      vars: {
        ty: { name: 'tile row, counted from the top (fractional)', tex: 'y' },
        z: { name: 'zoom level', value: 5, int: true, min: 0, max: 22 },
        lat: { name: 'latitude', q: 'angle', unit: '°', value: 32.07, signed: true, min: -85.05, max: 85.05, tex: '\\varphi' }
      },
      solveFor: 'ty',
      note: 'ln(tan φ + sec φ) is the Mercator ordinate. Tel Aviv at zoom 5: row 12.99 — just inside tile 12, whose latitude range is 31.95° to 40.98° N.'
    },
    {
      name: 'Ground size of a pixel',
      expr: 'res = 2*pi*Re*cos(lat)/(256*2^z)',
      tex: '\\mathrm{res} = \\frac{2\\pi a\\,\\cos\\varphi}{256\\cdot 2^{z}}',
      vars: {
        res: { name: 'metres per pixel on the ground', q: 'length', unit: 'm' },
        Re: { name: 'radius of the Web Mercator sphere', q: 'length', unit: 'm', value: 6378137, fixed: true, tex: 'a' },
        lat: { name: 'latitude', q: 'angle', unit: '°', value: 51.51, min: 0, max: 85.05, tex: '\\varphi' },
        z: { name: 'zoom level', value: 17, int: true, min: 0, max: 22 }
      },
      solveFor: 'res',
      note: 'At the equator 156 543 m per pixel at zoom 0, halving at each zoom. At London (51.51° N), zoom 17: 0.743 m — a map scale of 1 : 2800 on a 96 dpi screen.'
    }
  ],
  examples: [{
    title: 'Which tile, and what is in it?',
    q: 'A phone in Tel Aviv (32.07° N, 34.78° E) asks for the map tile at zoom 5. Which tile is it, what are its bounds, and what is the ground size of a pixel there at zoom 17?',
    steps: [
      { text: 'Column:', tex: 'x = 2^5 \\cdot \\frac{34.78 + 180}{360} = 19.09 \\;\\Rightarrow\\; 19' },
      { text: 'Row: $\\tan 32.07° = 0.6262$, $\\sec 32.07° = 1.1795$, $\\ln(1.8057) = 0.5911$.', tex: 'y = 2^{4}\\left(1 - \\frac{0.5911}{\\pi}\\right) = 12.99 \\;\\Rightarrow\\; 12' },
      { text: 'Bounds of tile (19, 12): longitude $19 \\cdot 360°/32 - 180° = 33.75°$ to $45°$. Its latitudes are $\\varphi = \\arctan\\sinh\\big(\\pi(1 - 2y/32)\\big)$ at $y = 12$ and $y = 13$:', tex: '40.98°\\ \\text{N}\\quad\\text{and}\\quad 31.95°\\ \\text{N}' },
      { text: 'Pixel size at zoom 17:', tex: '\\frac{2\\pi \\cdot 6\\,378\\,137 \\cdot \\cos 32.07°}{256 \\cdot 2^{17}} = 1.012\\ \\text{m}' },
      'The tile is 11.25° wide but 9.03° high: equal steps of the tile row are equal steps of the Mercator ordinate, not of latitude.'
    ],
    a: 'Tile (19, 12) at zoom 5: 33.75°–45° E, 31.95°–40.98° N; 1.01 m per pixel at zoom 17.'
  }],
  quiz: [
    { q: 'Why does a GPS receiver need four satellites rather than three?', choices: ['Three spheres meet in two points', 'The receiver clock is unknown, adding a fourth unknown to x, y, z', 'Each satellite only gives an angle', 'To average the errors'], a: 1, why: 'The pseudoranges all contain the same clock offset c·δ, which has to be solved together with the three coordinates: four unknowns, four equations.' },
    { q: 'A receiver clock is 2 µs fast. By how many metres are all the pseudoranges wrong?', answer: 600, unit: 'm', why: 'c δ = 3×10⁸ m/s × 2×10⁻⁶ s = 600 m.' },
    { q: 'At zoom level 4 the Web Mercator world is divided into how many tiles?', answer: 256, why: '2⁴ × 2⁴ = 256 (and each zoom level multiplies the count by four).' },
    { q: 'The Web Mercator map stops at ±85.05° latitude because', choices: ['there is no data beyond', 'there y = ±πa: it makes the world a square, which tiles cleanly', 'the satellites do not reach', 'the formula fails at 90°'], a: 1, why: 'The Mercator ordinate is infinite at the pole; cutting where it equals the half-width of the map gives a square world.' },
    { q: 'On Web Mercator, 1000 "metres" on the map at 60° N represent how many real metres on the ground?', answer: 500, unit: 'm', why: 'The scale factor is sec 60° = 2, so ground distance = map distance × cos φ = 500 m.' }
  ],
  applications: [
    'Every phone mapping application: GPS (or a mixture of satellite, Wi-Fi and cell data) gives latitude and longitude; the map layer is Web Mercator tiles; zoom is the tile pyramid.',
    'Geospatial web services and databases: the tile addressing (z, x, y, or a quadkey that interleaves the bits) lets a server find any tile by arithmetic, with no lookup.',
    'Navigation apps: routing and distances are computed on the ellipsoid or on a road graph and only displayed on Web Mercator, which is why the arrow stays true to the street at every zoom.',
    'Surveying and engineering: the same GPS positions are converted to a local projection (a UTM zone or national grid, [[transverse-mercator-and-utm]]) where distances are true to a part in thousands.'
  ],
  history: 'The Navstar GPS programme launched its first satellite in 1978 and declared full operational capability in 1995; the deliberate degradation of civil signals ("selective availability") was switched off on 2 May 2000. WGS 84 was defined in 1984. Google Maps appeared in February 2005 and, with other web mapping systems, adopted a spherical Mercator of the world cut into a quad-tree of tiles; the code EPSG:3857 was registered in 2008. OpenStreetMap, begun in 2004, uses the same tile scheme.',
  sources: ['Elliott D. Kaplan and Christopher J. Hegarty (eds.), *Understanding GPS/GNSS: Principles and Applications*, 3rd ed. (2017), the chapters on the signal and on the navigation solution.', 'EPSG Geodetic Parameter Dataset, entry 3857 (WGS 84 / Pseudo-Mercator) and John P. Snyder, *Map Projections — A Working Manual* (1987), the Mercator chapter.', 'OpenStreetMap Wiki, "Slippy map tilenames", and the Microsoft Bing Maps Tile System documentation (quadkeys).'],
  sim: 'ns-tile-pyramid',
  construction: ['ns-gps-trilateration', 'ns-web-tiles']
},

{
  id: 'radar-and-sonar-displays',
  parent: 'navigation-science-and-medicine',
  title: 'Radar and sonar displays',
  level: 1,
  short: 'A radar measures a range from the delay of an echo and a bearing from the antenna\'s direction. Plotted straight as distance and angle on the screen, those two numbers make the plan position indicator: an azimuthal equidistant map, centred on the antenna.',
  keywords: ['radar', 'PPI', 'plan position indicator', 'range ring', 'bearing', 'azimuthal equidistant', 'echo delay', 'radar horizon', 'beam width', 'sonar', 'sector scan', 'slant range', 'north-up', 'head-up'],
  prereq: ['azimuthal-equidistant-projection', 'azimuthal-projections', 'math:polar-coordinates'],
  related: ['charts-and-navigation', 'medical-imaging-projections', 'physics:doppler-effect', 'physics:ultrasound', 'dome-projection'],
  body: `A radar sends a short pulse of radio waves and listens. An echo returning after a time $t$ came from a target at range
$$R = \\frac{c\\,t}{2},$$
the factor 2 because the pulse had to go and come back. Light covers a nautical mile in 6.18 µs, so **12.36 µs of delay is one nautical mile** of range (one kilometre: 6.67 µs). The antenna turns, so the direction in which the echo came is known too: the **bearing** $\\theta$. The radar thus measures exactly two numbers for each target — a distance and a direction — which are polar coordinates about the antenna.

### The picture it draws
The natural display plots them as they are: a point at distance $R$ from the centre of the screen in direction $\\theta$. That is the **plan position indicator** (PPI): a sweep line rotating in step with the antenna, a glow where echoes arrive, **range rings** at equal distances and a **bearing scale** round the edge. As a map it is the **azimuthal equidistant projection** ([[azimuthal-equidistant-projection]]) centred on the radar: distance from the centre is true, bearing from the centre is true, and everything else is whatever the ground makes it. It is the right map for the job because the instrument already speaks in range and bearing; no other projection would keep both for the one point that matters, the observer.

### Reading it
A target at 74.1 µs delay and bearing 052° plots 6.0 nautical miles out along the 052° spoke. Orientation can be **head-up** (the ship's bow at the top, the picture turning as the ship turns), **north-up** (stabilised by the gyrocompass, so the coast stays still), or **course-up**. A target's movement is judged against the screen: its **relative** track and its closest point of approach decide whether two ships will meet.

### What limits it
- **Range resolution** is $\\Delta R = c\\tau/2$ for a pulse of length $\\tau$: a 1 µs pulse separates targets 150 m apart in range.
- **Bearing resolution** is the beam width $\\theta_b$: two targets at the same range blur together if closer than $R\\theta_b$. A 1.5° beam at 6 nm is 290 m wide, and every target is smeared into an arc.
- **Radar horizon**: the beam follows the curved Earth only slightly; with the usual refraction the horizon distance is $4.12(\\sqrt{h_1} + \\sqrt{h_2})$ km for heights in metres. A 25 m antenna sees a 10 m high ship at 33.6 km (18 nm).
- **Slant range**: the display shows distance along the beam, which for an aircraft overhead is the slant range, not the ground range; the difference matters near the centre.

### Sonar
Underwater the same arithmetic holds with $c \\approx 1500$ m/s: 1 ms is 0.75 m of depth for an echo sounder, 2.47 s is one nautical mile. Side-scan and sector sonars (and the medical ultrasound scanner, $c \\approx 1540$ m/s in tissue) display a fan: the polar plot of range and bearing, cut to the sector actually scanned.

> [!note] Many air-traffic systems convert each radar's range and bearing to a common plane, often a stereographic projection, so that tracks from several radars can be merged on one map.`,
  ideas: [
    'Range is half the echo delay times the speed of the wave: 12.36 µs per nautical mile for radar, 1.33 ms per metre of depth for sonar.',
    'The measurements are range and bearing: plotting them as polar coordinates is the plan position indicator, an azimuthal equidistant map centred on the antenna.',
    'Range rings and a bearing scale are the grid; the sweep and the persistence of the screen turn echoes into a picture.',
    'Resolution: ΔR = cτ/2 in range, R·θ_b across; the radar horizon is 4.12(√h₁ + √h₂) km.',
    'Sonar and ultrasound use the same geometry with a sound speed of 1500 to 1540 m/s and display it as a fan.'
  ],
  pitfalls: [
    'The radar screen is a map of the ground — It is a plot of range and bearing about the antenna; a radar on a ship sees distances along the beam and the heights of targets, and its picture turns with the ship unless stabilised.',
    'Doubling the pulse length doubles the range — It does not; the pulse length sets the range resolution (cτ/2). The maximum range depends on power, antenna and the horizon.',
    'The beam width does not matter close in — Cross-range blur is R × θ_b: negligible at 1 nm and big at 20 nm, so distant targets look wider than they are.'
  ],
  formulas: [
    {
      name: 'Range from the echo delay',
      expr: 'R = c*t/2',
      tex: 'R = \\frac{c\\,t}{2}',
      vars: {
        R: { name: 'range of the target', q: 'length', unit: 'nmi' },
        c: { const: 'c' },
        t: { name: 'delay of the echo', q: 'time', unit: 'µs', value: 74.1 }
      },
      solveFor: 'R',
      note: '74.1 µs is 6.0 nautical miles. For sonar replace c by the speed of sound in water, about 1500 m/s.'
    },
    {
      name: 'Range resolution',
      expr: 'dR = c*tau/2',
      tex: '\\Delta R = \\frac{c\\,\\tau}{2}',
      vars: {
        dR: { name: 'smallest separation in range', q: 'length', unit: 'm', tex: '\\Delta R' },
        c: { const: 'c' },
        tau: { name: 'pulse length', q: 'time', unit: 'µs', value: 1, tex: '\\tau' }
      },
      solveFor: 'dR',
      note: 'Two echoes are resolved only if they arrive more than a pulse length apart: a 1 µs pulse gives 150 m.'
    },
    {
      name: 'Cross-range width of the beam',
      expr: 'w = R*thb',
      tex: 'w = R\\,\\theta_b',
      vars: {
        w: { name: 'width of the beam at the target', q: 'length', unit: 'm' },
        R: { name: 'range', q: 'length', unit: 'nmi', value: 6 },
        thb: { name: 'beam width', q: 'angle', unit: '°', value: 1.5, min: 0.1, max: 30, tex: '\\theta_b' }
      },
      solveFor: 'w',
      note: 'Small-angle arc length. A 1.5° beam at 6 nm is 291 m wide.'
    },
    {
      name: 'Radar horizon',
      expr: 'd = 4.12*(sqrt(h1) + sqrt(h2))',
      tex: 'd = 4.12\\left(\\sqrt{h_1} + \\sqrt{h_2}\\right)',
      vars: {
        d: { name: 'distance to the radar horizon of the two heights', q: false, unit: 'km' },
        h1: { name: 'height of the antenna', q: false, unit: 'm', value: 25 },
        h2: { name: 'height of the target', q: false, unit: 'm', value: 10 }
      },
      solveFor: 'd',
      note: 'With standard atmospheric refraction (an effective Earth radius of 4/3 of the real one); heights in metres, distance in kilometres.'
    }
  ],
  examples: [{
    title: 'Where is the echo?',
    q: 'On a north-up display an echo arrives 74.1 µs after the pulse, with the antenna pointing at 052°. Another arrives after 43.3 µs at 305°. Place both targets and say how far apart they are.',
    steps: [
      { text: 'Ranges:', tex: 'R_1 = \\frac{c\\,t}{2} = \\frac{3\\times10^{8} \\cdot 74.1\\times10^{-6}}{2} = 11.1\\ \\text{km} = 6.0\\ \\text{nm},\\qquad R_2 = 6.49\\ \\text{km} = 3.5\\ \\text{nm}' },
      { text: 'Positions east and north of the antenna (north-up): $x = R\\,\\sin\\theta$, $y = R\\,\\cos\\theta$:', tex: 'T_1 = (6.0\\sin 52°,\\ 6.0\\cos 52°) = (4.73,\\ 3.69)\\ \\text{nm},\\qquad T_2 = (3.5\\sin 305°,\\ 3.5\\cos 305°) = (-2.87,\\ 2.01)\\ \\text{nm}' },
      { text: 'Separation:', tex: '\\sqrt{(4.73 + 2.87)^2 + (3.69 - 2.01)^2} = 7.8\\ \\text{nm}' }
    ],
    a: 'T₁ is 6.0 nm out at 052°, T₂ is 3.5 nm out at 305°; they are 7.8 nm apart.'
  }],
  quiz: [
    { q: 'How long after the pulse does the echo come from a target 12 nautical miles away?', answer: 148.3, unit: 'µs', why: 't = 2R/c = 12 × 12.36 µs = 148.3 µs.' },
    { q: 'A PPI shows range and bearing as polar coordinates about the antenna. As a map it is', choices: ['a Mercator map', 'an azimuthal equidistant map centred on the antenna', 'an orthographic map', 'a Lambert conformal conic'], a: 1, why: 'Distance from the centre and the direction from the centre are both true, as in the azimuthal equidistant projection.' },
    { q: 'A radar pulse is 0.5 µs long. The smallest separation in range that it can resolve is', answer: 75, unit: 'm', why: 'ΔR = cτ/2 = 3×10⁸ × 0.5×10⁻⁶ / 2 = 75 m.' },
    { q: 'A target\'s image on the screen is widest in the direction', choices: ['along the beam (range)', 'across the beam (bearing), by R × beam width', 'upwards', 'it is the same in both'], a: 1, why: 'The echo comes back from wherever the beam is, so the image is smeared across the bearing by the width of the beam at that range, while along the range it is as long as the pulse.' },
    { q: 'On a north-up display the picture turns when the ship turns.', a: false, why: 'That is a head-up display. A north-up display is stabilised by the gyrocompass: the coast stays still and the ship\'s heading marker turns.' }
  ],
  applications: [
    'Marine radar: head-up or north-up plan position indicators with range rings, used for collision avoidance and coastal navigation; the relative and true motion of targets decide the avoiding action.',
    'Air-traffic control: primary and secondary radar plotted as range and bearing, the tracks merged on a common plane (often a stereographic projection) from several radars.',
    'Weather radar: the PPI at a fixed elevation angle shows rain as a map about the radar; the displays of different elevations are combined into a constant-altitude view.',
    'Echo sounders and sonar: depth, fish, wrecks and the seabed, from the delay of an echo (1 ms for 0.75 m), with side-scan and sector displays as fans of range and bearing.'
  ],
  history: 'Robert Watson-Watt\'s Daventry experiment of 1935 showed that radio echoes from an aircraft could be detected, and by 1939 the Chain Home stations covered the south and east of Britain. The cavity magnetron of Randall and Boot (1940) allowed compact centimetre-wave sets, and the plan position indicator, developed in the early 1940s, put the picture on a rotating line. Paul Langevin built the first ultrasonic submarine detector in 1915–18, and Alexander Behm patented the echo sounder in 1913.',
  sources: ['Merrill I. Skolnik, *Introduction to Radar Systems*, 3rd ed. (2001), the chapters on the radar equation and on the display of radar information.', 'Nathaniel Bowditch, *The American Practical Navigator*, Pub. No. 9, the chapter on radar navigation.', 'Xavier Lurton, *An Introduction to Underwater Acoustics*, 2nd ed. (2010), the chapters on echo sounders and sonar geometry.'],
  sim: 'ns-ppi-sweep',
  construction: 'ns-radar-ppi'
},

{
  id: 'medical-imaging-projections',
  parent: 'navigation-science-and-medicine',
  title: 'Medical imaging: X-rays and CT as projections',
  level: 2,
  short: 'A radiograph is a central projection of how much the body absorbs, cast from a tiny source onto a detector; a CT scan takes a thousand parallel projections of one slice from all directions and computes the slice back from them. The geometry decides magnification, blur and what can be reconstructed.',
  keywords: ['X-ray', 'radiograph', 'magnification', 'SID', 'SOD', 'geometric unsharpness', 'penumbra', 'focal spot', 'CT', 'computed tomography', 'sinogram', 'Radon transform', 'back-projection', 'Hounsfield units', 'projection'],
  prereq: ['central-projection', 'parallel-vs-central', 'orthographic-projection', 'foreshortening'],
  related: ['radar-and-sonar-displays', 'photogrammetry', 'math:linear-transformations', 'physics:x-rays', 'medicine:medical-imaging'],
  body: `A radiograph is not a photograph of the body. It is a **shadow picture of its absorption**: X-rays leave a source about a millimetre across (the *focal spot*), pass through the patient, and the detector records how many arrive at each point. A beam of intensity $I_0$ that crosses material with attenuation $\\mu(l)$ along its path arrives with $I = I_0\\exp(-\\int \\mu\\,dl)$, so the image is the **line integral of the absorption along each ray**. Everything on a ray adds up: ribs and lung overlap. The geometry is [[central-projection]] with the focal spot as the centre and the detector as the picture plane.

### Magnification and blur
The rays diverge. With $\\mathrm{SID}$ the source–image distance and $\\mathrm{SOD}$ the source–object distance, an object parallel to the detector is magnified
$$M = \\frac{\\mathrm{SID}}{\\mathrm{SOD}} = \\frac{\\mathrm{SID}}{\\mathrm{SID} - \\mathrm{OID}},$$
$\\mathrm{OID}$ being the object–image distance. A real focal spot of size $F$ is not a point, so each edge is blurred by a *penumbra* $U_g = F\\cdot\\mathrm{OID}/\\mathrm{SOD}$. Both ask for the same practice: object close to the detector, source far, small focal spot. That is why a chest film is taken at 180 cm with the patient's front against the detector (PA, posterior–anterior): the heart, about 8 cm from the film, is magnified 1.05. A bedside film of a patient lying down, taken at 100 cm with the beam from the front (AP) and the heart 15 cm from the detector, magnifies it by 1.18 — so heart size is judged on the PA film, and the same heart looks nearly 13 % larger on the AP one.

An object that is not parallel to the detector is magnified unequally from end to end and so *distorted*; and off the central ray the divergence stretches shapes: a sphere away from the axis casts an oval shadow. The medical word for the direction of the central ray is also **projection**: PA, AP, lateral, oblique.

### CT: the other way round
In a CT scanner the source and a row of detectors turn round the patient. For a thin slice each detector reading, $p = -\\ln(I/I_0) = \\int\\mu\\,dl$, is the integral of $\\mu$ along one ray; the rays of one source position (rebinned to parallel) give a **parallel projection** of the slice onto a line, $p(\\theta, s)$, the Radon transform of 1917. Collecting it for angles 0° to 180° gives the **sinogram**: a point at $(x_0, y_0)$ appears at $s = x_0\\cos\\theta + y_0\\sin\\theta$, a sine curve — hence the name. A computer then **back-projects** each profile (smears it along its rays across the image) after filtering it with a ramp, which cancels the blur that plain back-projection leaves. The result is $\\mu(x, y)$ in **Hounsfield units**, $\\mathrm{HU} = 1000\\,(\\mu - \\mu_w)/\\mu_w$: 0 for water, −1000 for air, about −100 for fat, hundreds to a thousand and more for bone.

The two images answer different questions: the radiograph is one central projection (fast, one view, everything superimposed); CT uses many orthographic-like views to undo the superposition, at a much higher radiation dose.

> [!note] This page is about the geometry of the images. What a particular film or scan shows about a particular person is for a doctor to read.`,
  ideas: [
    'A radiograph is the central projection, from a point-like focal spot, of the line integrals of the body\'s absorption; all depths superimpose.',
    'Magnification M = SID/SOD, penumbra U_g = F·OID/SOD: keep the object near the detector and the source far.',
    'PA and AP are projections in the medical sense: the direction of the central ray. The same heart is magnified differently in them.',
    'CT collects parallel projections of a slice from every direction (the Radon transform, drawn as a sinogram) and reconstructs it by filtered back-projection.',
    'A point appears in the sinogram as a sine curve s = x₀ cos θ + y₀ sin θ; HU = 1000(μ − μ_w)/μ_w.'
  ],
  pitfalls: [
    'The X-ray shows the body\'s outline as a photograph does — It shows absorption integrated along each ray; soft tissue of a similar density can be invisible and overlapping structures confuse each other.',
    'Magnification is the same for every film — It depends on the distances: the same heart is magnified 1.05 on a 180 cm PA chest film and 1.18 on a 100 cm AP film, which is why films are compared only when taken the same way.',
    'CT is just many X-ray photographs stacked — Each slice is calculated from its sinogram; no single projection shows it. The slice would be blurred (plain back-projection) without the filter.'
  ],
  formulas: [
    {
      name: 'Radiographic magnification',
      expr: 'M = SID/SOD',
      tex: 'M = \\frac{\\mathrm{SID}}{\\mathrm{SOD}}',
      vars: {
        M: { name: 'magnification of an object parallel to the detector' },
        SID: { name: 'source–image distance', q: 'length', unit: 'cm', value: 100, tex: '\\mathrm{SID}' },
        SOD: { name: 'source–object distance', q: 'length', unit: 'cm', value: 85, tex: '\\mathrm{SOD}' }
      },
      solveFor: 'M',
      note: 'Similar triangles from the focal spot. SID 100 cm, object 15 cm from the detector (SOD 85 cm): 1.18. SID 180 cm, OID 8 cm: 1.05.'
    },
    {
      name: 'Geometric unsharpness',
      expr: 'Ug = F*OID/SOD',
      tex: 'U_g = F\\,\\frac{\\mathrm{OID}}{\\mathrm{SOD}}',
      vars: {
        Ug: { name: 'width of the penumbra at the edge of the image', q: 'length', unit: 'mm', tex: 'U_g' },
        F: { name: 'focal spot size', q: 'length', unit: 'mm', value: 1 },
        OID: { name: 'object–image distance', q: 'length', unit: 'cm', value: 15, tex: '\\mathrm{OID}' },
        SOD: { name: 'source–object distance', q: 'length', unit: 'cm', value: 85, tex: '\\mathrm{SOD}' }
      },
      solveFor: 'Ug',
      note: 'The shadow of an edge is blurred over the width of the source\'s image, scaled by OID/SOD. A 1.0 mm focal spot, 15 cm from the detector at 100 cm: 0.18 mm.'
    },
    {
      name: 'Where a point appears in the sinogram',
      expr: 's = x0*cos(th) + y0*sin(th)',
      tex: 's = x_0\\cos\\theta + y_0\\sin\\theta',
      vars: {
        s: { name: 'position on the detector line', q: 'length', unit: 'mm', signed: true },
        x0: { name: 'x position of the point in the slice', q: 'length', unit: 'mm', value: 30, signed: true, tex: 'x_0' },
        y0: { name: 'y position of the point in the slice', q: 'length', unit: 'mm', value: 40, signed: true, tex: 'y_0' },
        th: { name: 'projection angle', q: 'angle', unit: '°', value: 30, min: 0, max: 180, tex: '\\theta' }
      },
      solveFor: 's',
      note: 'A sinusoid of amplitude √(x₀² + y₀²) = 50 mm and phase atan2(y₀, x₀) = 53.1°. Points near the centre make small sines, points far from it large ones.'
    },
    {
      name: 'Hounsfield units',
      expr: 'HU = 1000*(mu - muw)/muw',
      tex: '\\mathrm{HU} = 1000\\,\\frac{\\mu - \\mu_w}{\\mu_w}',
      vars: {
        HU: { name: 'CT number', q: false, unit: 'HU', signed: true, tex: '\\mathrm{HU}' },
        mu: { name: 'linear attenuation coefficient of the voxel', q: false, unit: 'cm⁻¹', value: 0.5 },
        muw: { name: 'attenuation coefficient of water at the same beam energy', q: false, unit: 'cm⁻¹', value: 0.193, tex: '\\mu_w' }
      },
      solveFor: 'HU',
      note: 'With water at about 0.19 cm⁻¹ for a 70 keV beam: a dense bone of 0.5 cm⁻¹ is about +1600 HU, fat (0.17 cm⁻¹) about −120 HU. The numbers depend on the beam energy; values are approximate.'
    }
  ],
  examples: [{
    title: 'The same heart on two films',
    q: 'A heart 12.5 cm wide lies 8 cm in front of the detector on a PA chest film taken at SID 180 cm. On a bedside AP film at SID 100 cm the heart is 15 cm from the detector. How wide does it appear on each film, and what penumbra does a 1 mm focal spot give on the AP film?',
    steps: [
      { text: 'PA film:', tex: 'M = \\frac{180}{180 - 8} = 1.047,\\qquad 12.5 \\times 1.047 = 13.1\\ \\text{cm}' },
      { text: 'AP film:', tex: 'M = \\frac{100}{100 - 15} = 1.176,\\qquad 12.5 \\times 1.176 = 14.7\\ \\text{cm}' },
      { text: 'Penumbra on the AP film, OID = 15 cm, SOD = 85 cm:', tex: 'U_g = 1.0 \\times \\frac{15}{85} = 0.18\\ \\text{mm}' },
      'The same heart is 12 % wider on the AP film: a heart-size judgment made on a film must take the projection into account.'
    ],
    a: '13.1 cm on the PA film, 14.7 cm on the AP film; the penumbra on the AP film is 0.18 mm.'
  }],
  quiz: [
    { q: 'An object 20 cm from the detector is radiographed at SID 100 cm. What is the magnification?', answer: 1.25, why: 'M = SID/(SID − OID) = 100/80 = 1.25.' },
    { q: 'To reduce geometric blur on a radiograph one should', choices: ['use a larger focal spot', 'move the object away from the detector', 'use a smaller focal spot and keep the object close to the detector', 'move the source closer'], a: 2, why: 'U_g = F·OID/SOD: smaller F and smaller OID/SOD (object near the detector, source far) shrink the penumbra.' },
    { q: 'In a sinogram a single small dense point at the centre of the slice appears as', choices: ['a sine curve of large amplitude', 'a straight vertical line', 'a straight horizontal line', 'a single dot'], a: 1, why: 's = x₀ cos θ + y₀ sin θ with x₀ = y₀ = 0 gives s = 0 at every angle: a vertical straight line. Off-centre points give sine curves.' },
    { q: 'A point is at (30 mm, 40 mm). Its sinogram has an amplitude of how many millimetres?', answer: 50, unit: 'mm', why: 'x₀ cos θ + y₀ sin θ = √(x₀² + y₀²) cos(θ − φ): amplitude 50 mm.' },
    { q: 'Back-projecting the unfiltered profiles gives a blurred image; the filter used to cure it is a', choices: ['low-pass filter', 'ramp filter, which boosts high spatial frequencies', 'colour filter', 'median filter'], a: 1, why: 'Plain back-projection smears each point into a 1/r halo; multiplying each profile\'s spectrum by |frequency| (the ramp) cancels that.' }
  ],
  applications: [
    'Chest and skeletal radiography: central projections at set distances (180 cm for the chest) and set directions (PA, AP, lateral), chosen to control magnification and distortion.',
    'CT scanners: sinograms of the slices, reconstructed by filtered back-projection or iterative methods; the same mathematics as in baggage and industrial scanners and in electron tomography.',
    'Digitally reconstructed radiographs in radiotherapy planning: the CT volume is rendered as a central projection from the position of the treatment source, to compare with the verification film.',
    'Angiography, fluoroscopy and mammography: central projections with a small, close source and carefully chosen distances; tomosynthesis uses a few views over a limited angle to separate layers.'
  ],
  history: 'Wilhelm Röntgen discovered X-rays on 8 November 1895 and published the first radiograph, of his wife\'s hand, in December. Johann Radon\'s 1917 paper showed that a function can be recovered from its line integrals; Allan Cormack developed the theory for medicine in 1963–64, and Godfrey Hounsfield built the first clinical scanner at EMI, scanning a patient in October 1971. They shared the 1979 Nobel Prize in Physiology or Medicine. Filtered back-projection was given its form by Ramachandran and Lakshminarayanan in 1971; the Shepp–Logan head phantom (1974) is still the standard test image.',
  sources: ['Jerrold T. Bushberg, J. Anthony Seibert, Edwin M. Leidholdt and John M. Boone, *The Essential Physics of Medical Imaging*, 3rd ed. (2011), the chapters on radiography and on computed tomography.', 'Avinash C. Kak and Malcolm Slaney, *Principles of Computerized Tomographic Imaging* (1988), the chapters on projections and on reconstruction from parallel projections.', 'Godfrey N. Hounsfield, "Computerized transverse axial scanning (tomography): Part 1", *British Journal of Radiology* 46 (1973).'],
  sim: ['ns-xray-magnification', 'ns-ct-sinogram'],
  construction: ['ns-xray-geometry', 'ns-ct-radon']
},

{
  id: 'astronomy-and-planetary-maps',
  parent: 'navigation-science-and-medicine',
  title: 'Astronomy and the maps of other worlds',
  level: 2,
  short: 'Mars and the Moon are mapped like the Earth: a sphere with another radius, a Mercator or cylindrical map for the equator, a Lambert conic for mid-latitudes and a polar stereographic for the poles. A telescope image is a gnomonic patch of sky, and the all-sky surveys use equal-area maps.',
  keywords: ['planetary map', 'Mars', 'Moon', 'USGS', 'MOLA', 'polar stereographic', 'equirectangular', 'quadrangle', 'planetographic latitude', 'FITS WCS', 'tangent plane', 'plate scale', 'Mollweide', 'cosmic microwave background', 'all-sky map'],
  prereq: ['stereographic-projection', 'equirectangular-projection', 'gnomonic-projection', 'tissot-indicatrix'],
  related: ['lambert-conformal-conic', 'mollweide-projection', 'aitoff-and-hammer', 'the-all-sky-view', 'all-sky-charts', 'physics:keplers-laws'],
  body: `A planet is a ball, so everything learnt about the Earth's maps applies with another radius: Mars 3389.5 km (mean), the Moon 1737.4 km, so one degree of arc is 59.2 km on Mars and 30.3 km on the Moon. What is new is the choices that mappers make, because the maps are made from spacecraft data and used for landing sites.

### One world, three projections
The US Geological Survey's planetary mapping follows the same rule as a national topographic series: split the globe into **zones of latitude** and use for each the projection that distorts least there. The Mars Chart series (MC, 30 quadrangles at 1 : 5 000 000) is made as follows: the **equatorial** belt ±30° in Mercator, the **mid-latitudes** from 30° to 65° in the Lambert conformal conic, and the two **polar caps** in the polar stereographic. The reasons are the Earth's ones: the equator is where a cylinder is nearly true; a cone touches the middle latitudes; and a plane touching the pole is the only one that keeps a circle round the pole a circle.

The cheap global picture is the **equirectangular** (simple cylindrical) map: longitude and latitude used as $x$ and $y$, a rectangle twice as wide as it is high that any image viewer can handle (the global elevation and colour maps of Mars from the laser altimeter MOLA are distributed this way). It is not good near the poles. A point at latitude $\\varphi$ is stretched east–west by $\\sec\\varphi$: a circular crater 100 km across at 80° N becomes an oval 5.8 times wider than tall, and at the pole a single point becomes a line as wide as the map.

### The poles in a plane
The polar stereographic projection puts the pole at the centre and draws parallels as circles of radius $\\rho = R\\,(1 + \\sin\\varphi_0)\\tan(45° - \\varphi/2)$, with $\\varphi_0 = 90°$ for the plane touching the pole. It is conformal, so craters stay round at every latitude, and the scale at 80° is only 0.8 % above the true one. That is why the mosaics used to plan the landing near the Moon's south pole are polar stereographic images: the permanently shadowed craters there, tens of kilometres across, are circles around the pole instead of fragments on the edge of a rectangle.

### Telescopes and the sky
A telescope is a camera and its picture a patch of sky: the directions in the field are projected onto the flat detector from the lens, which is a **gnomonic** (tangent-plane) projection. The scale is the plate scale $206\\,265/f$ arcseconds per millimetre for focal length $f$ in millimetres: a 2000 mm instrument gives 103″/mm, 0.39″ for a pixel of 3.76 µm. Over a field of a degree or two the gnomonic distortion is a few parts in $10^{-4}$; astronomers record the projection with the image (the **FITS world coordinate system** has codes TAN for gnomonic, STG, SIN, ARC, ZEA, and for the whole sky AIT (Hammer–Aitoff), MOL (Mollweide) and CAR).

Whole-sky maps ask for **equal area**: the microwave background maps of WMAP and Planck are Mollweide ellipses, so that a patch that covers 1 % of the map covers 1 % of the sky ([[mollweide-projection]]); the Galactic plane is often shown in Hammer–Aitoff.

> [!tip] The construction below draws a crater at 70° N on Mars twice: on a simple cylindrical map, where it is stretched by 2.9, and on a polar stereographic one, where it stays round.`,
  ideas: [
    'A planet\'s map is the Earth\'s with another radius: one degree is 59.2 km on Mars and 30.3 km on the Moon.',
    'Planetary mapping series use Mercator at the equator, the Lambert conic at mid-latitudes and the polar stereographic at the poles.',
    'Equirectangular maps are the cheap global format but stretch features by sec φ; at 80° a round crater is 5.8 times too wide.',
    'The polar stereographic keeps circles round and the scale within 1 % within 10° of the pole: the map for polar landing sites.',
    'A telescope image is a gnomonic patch of sky with plate scale 206 265/f arcseconds per mm; whole-sky maps are equal-area (Mollweide, Hammer–Aitoff).'
  ],
  pitfalls: [
    'Planetary latitude is the Earth\'s kind — Planetographic latitude (the angle of the vertical) and planetocentric latitude (the angle at the centre) differ on a flattened body; the IAU conventions choose per body, and the sign of longitude (east positive) too.',
    'A global equirectangular map shows true sizes — It shows true heights (north–south) and east–west widths stretched by sec φ; polar regions in particular are wildly wrong.',
    'The sky in a picture is flat — A wide-angle sky image needs its projection recorded: a gnomonic projection fails beyond about 90° and stretches the corners well before that.'
  ],
  formulas: [
    {
      name: 'Arc length on a body',
      expr: 's = R*a',
      tex: 's = R\\,\\alpha',
      vars: {
        s: { name: 'distance along the surface', q: 'length', unit: 'km' },
        R: { name: 'radius of the body', q: 'length', unit: 'km', value: 3389.5 },
        a: { name: 'angle subtended at the centre', q: 'angle', unit: '°', value: 1, tex: '\\alpha' }
      },
      solveFor: 's',
      note: 'One degree: 59.16 km on Mars (mean radius 3389.5 km), 30.32 km on the Moon (1737.4 km), 111.2 km on the Earth.'
    },
    {
      name: 'East–west stretch of a plate carrée map',
      expr: 'st = 1/cos(lat)',
      tex: 'k = \\sec\\varphi',
      vars: {
        st: { name: 'how much wider than tall a round feature is drawn', tex: 'k' },
        lat: { name: 'latitude', q: 'angle', unit: '°', value: 80, min: 0, max: 89.5, tex: '\\varphi' }
      },
      solveFor: 'st',
      note: 'On an equirectangular map the parallels keep their degrees: a degree of longitude is drawn as long as a degree of latitude, but is only cos φ as long on the ground. At 70°: 2.92; at 80°: 5.76.'
    },
    {
      name: 'Polar stereographic radius',
      expr: 'rho = R*(1 + sin(p0))*tan(pi/4 - phi/2)',
      tex: '\\rho = R\\,(1 + \\sin\\varphi_0)\\tan\\left(\\frac{\\pi}{4} - \\frac{\\varphi}{2}\\right)',
      vars: {
        rho: { name: 'distance of the parallel from the pole on the map plane', q: 'length', unit: 'km', tex: '\\rho' },
        R: { name: 'radius of the body', q: 'length', unit: 'km', value: 3389.5 },
        p0: { name: 'standard parallel (90° for the plane touching the pole)', q: 'angle', unit: '°', value: 90, min: 1, max: 90, tex: '\\varphi_0' },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 80, min: 0, max: 89.9, tex: '\\varphi' }
      },
      solveFor: 'rho',
      note: 'The parallel of 80° on Mars is 593 km from the pole on the plane, against 592 km measured along the surface: the local scale there is 1.0077 in every direction.'
    },
    {
      name: 'Plate scale of a telescope',
      expr: 'ps = 206265/f',
      tex: 'p = \\frac{206\\,265}{f}',
      vars: {
        ps: { name: 'sky angle per millimetre on the detector', q: false, unit: '″/mm', tex: 'p' },
        f: { name: 'focal length', q: false, unit: 'mm', value: 2000 }
      },
      solveFor: 'ps',
      note: 'There are 206 265 arcseconds in a radian. At 2000 mm: 103″ per millimetre; for a pixel of 3.76 µm, 0.39″ per pixel.'
    }
  ],
  examples: [{
    title: 'A crater near the pole of Mars',
    q: 'A round crater, 100 km across, lies at 80° N on Mars. How wide and how tall is it on an equirectangular map made at 10 pixels per degree, and how large is it on a polar stereographic map where one kilometre of the plane is 1 pixel?',
    steps: [
      { text: 'Angular size: 1° is 59.16 km, so the crater is $100/59.16 = 1.69°$ across. Its east–west extent in degrees of longitude is stretched by $\\sec 80° = 5.76$:', tex: '1.69° \\times 5.76 = 9.7°\\ \\text{of longitude}' },
      'Equirectangular at 10 pixels per degree: 97 pixels wide and 17 pixels tall (an oval 5.8 : 1).',
      { text: 'Polar stereographic (plane touching the pole): the scale at 80° is $2/(1 + \\sin 80°) = 1.0077$, the same in all directions:', tex: '100\\ \\text{km} \\times 1.0077 = 100.8\\ \\text{pixels, in both directions}' },
      'The crater is a circle again.'
    ],
    a: '97 × 17 pixels on the equirectangular map; a circle of 101 pixels on the polar stereographic map.'
  }],
  quiz: [
    { q: 'How many kilometres is one degree of arc on the Moon (radius 1737.4 km)?', answer: 30.3, unit: 'km', why: '2π × 1737.4 / 360 = 30.32 km.' },
    { q: 'On an equirectangular map, a round feature at 60° latitude appears', choices: ['round', 'twice as wide as tall', 'twice as tall as wide', 'half the size'], a: 1, why: 'The east–west stretch is sec 60° = 2 while the north–south scale is 1.' },
    { q: 'Which projection is used by the USGS for the polar caps in the Mars chart series?', choices: ['Mercator', 'Polar stereographic', 'Sinusoidal', 'Orthographic'], a: 1, why: 'The polar stereographic keeps circles about the pole round and the scale nearly true, while a cylinder cannot show the pole at all.' },
    { q: 'A telescope has a focal length of 1000 mm. How many arcseconds of sky fall on one millimetre of the detector?', answer: 206.3, unit: '″', why: '206 265 / 1000 = 206.3 arcseconds per millimetre.' },
    { q: 'The cosmic microwave background is mapped on the whole sky in an equal-area projection so that the area of a patch on the map is proportional to the solid angle on the sky.', a: true, why: 'For statistics of the temperature fluctuations, equal-area is what matters; Mollweide is the usual choice.' }
  ],
  applications: [
    'Planetary mapping series (Mars MC quadrangles, the Moon\'s LAC maps): Mercator, Lambert conic and polar stereographic by latitude zone, each chosen so that the distortion is small where it is used.',
    'Landing-site selection at the lunar poles: polar stereographic mosaics, in which shadowed craters are circles and distances from the pole can be measured with a ruler.',
    'Observatory image processing: the world coordinate system in the image header names the projection (TAN for most telescopes) and maps every pixel to a sky position, which is how survey images are overlaid.',
    'Whole-sky survey maps (the microwave background, the Gaia stars, the Galactic plane): Mollweide or Hammer–Aitoff ellipses, which preserve area.'
  ],
  history: 'The first lunar maps from Earth-based telescopes (Beer and Mädler, 1830s) used orthographic views; the Apollo era produced the Lunar Astronautical Charts. The USGS Astrogeology Science Center, founded in 1963 in Flagstaff to map the Moon for Apollo, built the planetary-mapping practice with the IAU working group on cartographic coordinates and rotational elements. Mars was mapped from Mariner 9 (1971–72), Viking (1976) and the Mars Global Surveyor altimeter (1997–2006). The FITS world-coordinate standard of Greisen and Calabretta appeared in 2002.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapters on the polar stereographic, the cylindrical projections and the Lambert conformal conic.', 'B. A. Archinal and others, "Report of the IAU Working Group on Cartographic Coordinates and Rotational Elements: 2009", *Celestial Mechanics and Dynamical Astronomy* 109 (2011).', 'E. W. Greisen and M. R. Calabretta, "Representations of world coordinates in FITS", and M. R. Calabretta and E. W. Greisen, "Representations of celestial coordinates in FITS", *Astronomy & Astrophysics* 395 (2002).'],
  sim: 'ns-planet-features',
  construction: 'ns-planet-maps'
},

{
  id: 'crystallography-stereographic',
  parent: 'navigation-science-and-medicine',
  title: 'Crystallography and the stereographic net',
  level: 3,
  short: 'A crystal is a set of directions: the normals to its faces meet a sphere in poles, and the angles between poles are what never changes. The stereographic projection flattens the sphere keeping angles true and every circle a circle, so the whole subject can be drawn with a compass and measured on the Wulff net.',
  keywords: ['stereographic projection', 'Wulff net', 'Schmidt net', 'pole figure', 'zone', 'great circle', 'Miller indices', 'interplanar angle', 'stereographic triangle', 'texture', 'Bragg', 'Laue', 'equal-area net', 'structural geology'],
  prereq: ['stereographic-projection', 'conformal-maps', 'lambert-azimuthal-equal-area', 'the-astrolabe'],
  related: ['equal-area-maps', 'aspects-of-a-projection', 'weather-maps', 'physics:crystal-structure', 'physics:x-rays'],
  body: `The faces of two quartz crystals from different mountains may be large or small, fat or thin, and the same few faces may be missing from one. What is the same in both is the **angle between faces**: it is, as Nicolas Steno found in 1669, constant. So the real description of a crystal is not its shape but the set of **directions normal to its faces** — each one a point on a sphere round the crystal, a **pole**. Plot the poles and you have the crystal stripped of its accidents.

### Flattening the sphere
Look down on the sphere from above and project each pole of the upper hemisphere from the *opposite* point onto the equatorial plane: the **stereographic projection** ([[stereographic-projection]]). A pole at angle $\\psi$ from the centre of the view lands at distance
$$r = R\\,\\tan\\frac{\\psi}{2}$$
from the centre of the disc of radius $R$ (poles on the equator, $\\psi = 90°$, lie on the rim, the **primitive circle**).

Three properties make it the crystallographer's choice. It is **conformal**: the angle between two poles, read on the sphere, can be measured at the point on the drawing. Every **circle** on the sphere is a circle on the drawing, so the **zone** of faces parallel to a common edge — a great circle of poles — is drawn with a compass. And rotating the crystal moves the poles along circles that can be drawn by the same compass.

### The Wulff net
The net, named after the Russian crystallographer Yuri Wulff (1902), is the stereographic image of a sphere ruled with meridians and parallels every 2° or 10°, viewed from the side. To measure the angle between two poles, pin a tracing-paper copy of the drawing at the centre of the net, turn it until both poles lie on one meridian, and count the degrees along it. Spinning the paper rotates the crystal about the viewing axis; sliding poles along the parallels tilts it about the north–south axis of the net. The meridian that makes an angle $\\lambda$ with the centre one crosses the equator at $R\\,\\tan(\\lambda/2)$ and is a circle of radius $R/\\sin\\lambda$ centred at distance $R\\,\\cot\\lambda$ on the equator line (the construction below).

### The cubic crystal
View a cubic crystal down [001]. The cube faces $\\{100\\}$ are at the centre and on the rim; the $\\{110\\}$ poles at $\\psi = 45°$ and $90°$; the four $\\{111\\}$ poles at $\\psi = 54.74°$, i.e. $r = 0.5176R$, in the diagonal directions. The angle between two directions $(h_1k_1l_1)$ and $(h_2k_2l_2)$ is
$$\\cos\\varphi = \\frac{h_1h_2 + k_1k_2 + l_1l_2}{\\sqrt{(h_1^2 + k_1^2 + l_1^2)(h_2^2 + k_2^2 + l_2^2)}}.$$
Because of the cube's symmetry every direction is equivalent to one in the **standard triangle** with corners [001], [101] and [111]; the colour keys of electron-backscatter orientation maps are drawn on it.

### Equal angle or equal area
The Wulff net keeps angles, but its area scale grows towards the rim. When the question is *how many* poles lie in a region — the orientation of the grains in a rolled sheet (a *pole figure*), or of fault planes in a rock — the honest net is the **Schmidt net**, the Lambert equal-area projection ([[lambert-azimuthal-equal-area]]), plotted on the lower hemisphere by structural geologists.

> [!fact] Diffraction links the two worlds: Bragg's law $n\\lambda = 2d\\sin\\theta$ with $d = a/\\sqrt{h^2 + k^2 + l^2}$ locates the reflection of a set of planes, and the pattern of reflections on a flat film (a Laue photograph) is a gnomonic projection of the poles.`,
  ideas: [
    'A crystal is the set of normals to its faces: the angles between poles are constant (Steno), the shape is not.',
    'Stereographic projection: a pole at angle ψ from the view axis is at r = R·tan(ψ/2); it is conformal and takes every circle to a circle.',
    'A zone is a great circle of poles; the Wulff net lets you measure the angle between poles by turning tracing paper until both lie on one meridian.',
    'The meridian λ from the centre crosses the equator at R·tan(λ/2), has radius R/sin λ and centre R·cot λ away: a compass construction.',
    'Equal angle (Wulff) for angles; equal area (Schmidt) for counting poles in pole figures and fabric diagrams.'
  ],
  pitfalls: [
    'The stereographic net measures distances — It measures angles. The distance between two poles on the drawing is not their angular distance, and the scale grows from the centre to the rim as 1/cos²(ψ/2).',
    'A pole figure with a cluster means most grains are aligned — Only on an equal-area net: on the Wulff net areas near the rim are inflated, so a cluster there looks bigger than it is.',
    'The angle between planes is the angle between their traces — It is the angle between their normals, or the poles; the angle between the plane and the plane\'s own pole is 90°.'
  ],
  formulas: [    {
      name: 'Angle of a pole from the viewing axis [001]',
      expr: 'psi = acos(l/sqrt(h^2 + k^2 + l^2))',
      tex: '\\psi = \\arccos\\frac{l}{\\sqrt{h^2 + k^2 + l^2}}',
      vars: {
        psi: { name: 'angle between the pole [hkl] and the viewing axis [001]', q: 'angle', unit: '°', tex: '\\psi' },
        h: { name: 'h', value: 1, signed: true },
        k: { name: 'k', value: 1, signed: true },
        l: { name: 'l', value: 1, signed: true }
      },
      solveFor: 'psi',
      note: 'For cubic crystals the pole of the plane (hkl) is the direction [hkl]. [111]: 54.74°; [110]: 90°; [101]: 45°. The general angle between two poles is cos φ = (h₁h₂ + k₁k₂ + l₁l₂)/√((h₁² + k₁² + l₁²)(h₂² + k₂² + l₂²)), e.g. 70.53° between [111] and [1̄11].'
    },
    {
      name: 'Radius of a pole on the stereographic projection',
      expr: 'r = R*tan(psi/2)',
      tex: 'r = R\\,\\tan\\frac{\\psi}{2}',
      vars: {
        r: { name: 'distance of the pole from the centre of the drawing', q: 'length', unit: 'mm' },
        R: { name: 'radius of the primitive circle', q: 'length', unit: 'mm', value: 100 },
        psi: { name: 'angle of the pole from the view axis', q: 'angle', unit: '°', value: 54.74, min: 0, max: 90, tex: '\\psi' }
      },
      solveFor: 'r',
      note: 'The [111] pole of a cubic crystal viewed down [001] (ψ = 54.74°) is at 51.8 mm on a 100 mm primitive circle; a pole 45° away is at 41.4 mm.'
    },
    {
      name: 'Bragg\'s law',
      expr: 'n*lam = 2*d*sin(th)',
      tex: 'n\\lambda = 2d\\sin\\theta',
      vars: {
        n: { name: 'order of the reflection', value: 1, int: true, min: 1, max: 6 },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 0.15406, tex: '\\lambda' },
        d: { name: 'spacing of the lattice planes', q: 'length', unit: 'nm', value: 0.3136 },
        th: { name: 'glancing angle of the beam on the planes', q: 'angle', unit: '°', value: 14.22, min: 0, max: 90, tex: '\\theta' }
      },
      solveFor: 'th',
      note: 'Copper Kα X-rays (0.15406 nm) on the (111) planes of silicon (d = 0.3136 nm) reflect at θ = 14.22°, the 2θ = 28.44° peak of the powder pattern.'
    },
    {
      name: 'Plane spacing in a cubic crystal',
      expr: 'd = a/sqrt(h^2 + k^2 + l^2)',
      tex: 'd_{hkl} = \\frac{a}{\\sqrt{h^2 + k^2 + l^2}}',
      vars: {
        d: { name: 'spacing of the (hkl) planes', q: 'length', unit: 'nm', tex: 'd_{hkl}' },
        a: { name: 'edge of the cubic cell', q: 'length', unit: 'nm', value: 0.5431 },
        h: { name: 'h', value: 1 }, k: { name: 'k', value: 1 }, l: { name: 'l', value: 1 }
      },
      solveFor: 'd',
      note: 'Silicon, a = 0.5431 nm: d₁₁₁ = 0.3136 nm, d₂₂₀ = 0.192 nm, d₄₀₀ = 0.136 nm.'
    }
  ],
  examples: [{
    title: 'Where is the pole of a cube diagonal?',
    q: 'A cubic crystal is viewed down the [001] axis on a stereographic projection with a primitive circle of radius 100 mm. Find the angle between [001] and [111], the position of the [111] pole, and the angle between [111] and [1̄11].',
    steps: [
      { text: 'Angle between the directions (001) and (111):', tex: '\\cos\\varphi = \\frac{1}{\\sqrt{1}\\sqrt{3}} = 0.5774 \\;\\Rightarrow\\; \\varphi = 54.74°' },
      { text: 'Radius on the projection:', tex: 'r = 100\\tan(27.37°) = 51.8\\ \\text{mm}' },
      'The [111] pole lies in the vertical plane through [001] and [110], i.e. at 45° to the [100] axis on the drawing.',
      { text: 'Between [111] and [1̄11]:', tex: '\\cos\\varphi = \\frac{-1 + 1 + 1}{3} = \\tfrac13 \\;\\Rightarrow\\; \\varphi = 70.53°' }
    ],
    a: '54.74°; at 51.8 mm from the centre along the 45° line; 70.53° between [111] and [1̄11].'
  }],
  quiz: [
    { q: 'On a stereographic projection with a primitive circle of radius 100 mm, how far from the centre is a pole 90° from the viewing axis?', answer: 100, unit: 'mm', why: 'r = R tan 45° = R: poles on the equator lie on the primitive circle.' },
    { q: 'The angle between the [100] and [110] directions of a cubic crystal is', choices: ['30°', '45°', '54.7°', '60°'], a: 1, why: 'cos φ = 1/√2.' },
    { q: 'Which net should be used to count how many poles fall in a given region of a pole figure?', choices: ['The Wulff (equal-angle) net', 'The Schmidt (equal-area) net', 'Either, they are the same', 'A Mercator net'], a: 1, why: 'Counting needs equal areas to mean equal solid angles, which the equal-area net provides; the Wulff net inflates the areas near the rim.' },
    { q: 'First-order X-rays of wavelength 0.154 nm reflect at θ = 15° from planes of spacing d. How large is d in nm?', answer: 0.298, unit: 'nm', why: 'd = λ/(2 sin θ) = 0.154 / (2 × 0.2588).' },
    { q: 'The stereographic projection takes every circle on the sphere to a circle (or a straight line) on the drawing.', a: true, why: 'This is why zones can be drawn with a compass and why the net contains only circles and straight lines.' }
  ],
  applications: [
    'Crystal morphology and X-ray crystallography: indexing a crystal\'s faces from measured angles; the standard projections of cubic, hexagonal and other systems are printed in the textbooks.',
    'Metallurgy and materials science: pole figures and inverse pole figures show the texture of rolled sheets and the orientation maps of electron microscopes, on equal-area or stereographic projections.',
    'Structural geology: bedding planes, joints, faults and lineations are plotted as poles on the lower hemisphere of an equal-area net and contoured to find the dominant orientation.',
    'Diffraction patterns: the Laue spots on a flat film are the gnomonic images of the zone circles, which is why a zone appears as a conic section.'
  ],
  history: 'Nicolas Steno stated the law of constant angles in 1669. Franz Ernst Neumann (1823) introduced the representation of faces by their poles, William Hallowes Miller gave the indices in his *Treatise on Crystallography* (1839), and Yuri Wulff published the net in 1902. Walter Schmidt\'s equal-area version for rock fabrics came in 1925. Max von Laue\'s 1912 diffraction experiment and the Braggs\' law of 1913 turned the crystal\'s directions into measured X-ray reflections.',
  sources: ['Cullity and Stock, *Elements of X-ray Diffraction*, 3rd ed. (2001), the appendix on the stereographic projection and the chapter on texture.', 'F. C. Phillips, *An Introduction to Crystallography*, 4th ed. (1971), the chapters on the stereographic projection and the Wulff net.', 'Richard J. Lisle and Peter R. Leyshon, *Stereographic Projection Techniques for Geologists and Civil Engineers*, 2nd ed. (2004).'],
  sim: 'ns-wulff-net',
  construction: 'ns-wulff-construction'
},

{
  id: 'weather-maps',
  parent: 'navigation-science-and-medicine',
  title: 'Weather maps and polar charts',
  level: 2,
  short: 'Winds blow along isobars and fronts have angles, so a weather map must be conformal. Meteorologists use the polar stereographic projection true at 60° N for the hemisphere, the Lambert conformal conic for mid-latitude forecast domains and Mercator in the tropics, correcting every gradient by the map factor.',
  keywords: ['weather map', 'synoptic chart', 'polar stereographic', 'standard parallel 60', 'Lambert conformal conic', 'map factor', 'geostrophic wind', 'isobars', 'Coriolis', 'forecast model', 'WRF', 'GRIB', 'hemispheric chart'],
  prereq: ['stereographic-projection', 'lambert-conformal-conic', 'conformal-maps', 'scale-factor-and-standard-parallels'],
  related: ['aviation-and-polar-routes', 'crystallography-stereographic', 'mercator-projection', 'physics:rotation', 'aerodynamics:atmosphere'],
  body: `A weather map is a picture of a field — pressure, temperature, wind — and of the rules that tie the fields together. The most important rule for the middle latitudes is the **geostrophic balance**: away from the ground, the Coriolis force on the air balances the pressure force, and the wind blows **along the isobars**, with low pressure on its left in the northern hemisphere, at a speed
$$V_g = \\frac{1}{\\rho f}\\,\\frac{\\Delta p}{\\Delta n},\\qquad f = 2\\Omega\\sin\\varphi.$$
$\\Delta n$ is the distance *across* the isobars, so reading the wind off a chart needs two things: **angles** — the wind direction and the isobars must meet at the right angle — and **distances** across the isobars. The first asks for a conformal projection; the second for the scale of the map.

### Why conformal
On a map that distorts angles the isobars and the wind would not be parallel any more, fronts would change their sharpness, and the geometry of a cyclone (spirals, warm and cold sectors) would be bent. On a conformal map every local shape is right and only the size is wrong, by a **map factor** $m(\\varphi)$ that is the same in every direction. Divide a map distance by $m$ to get the true distance; multiply a pressure gradient measured on the map by $m$ to get the true gradient: $V_g = m\\,\\Delta p/(\\rho f\\,\\Delta n_{\\mathrm{map}})$.

### Three charts for three belts
- **Polar stereographic, true at 60° N** — the standard hemispheric chart. The pole is the centre, the meridians are straight, the map factor is
$$m = \\frac{1 + \\sin 60°}{1 + \\sin\\varphi},$$
exactly 1 at 60°, 0.933 at the pole, 1.093 at 45° and 1.244 at 30° (the secant plane cuts the globe at 60°). It is nearly uniform from 40° to the pole.
- **Lambert conformal conic** — for a forecast domain of mid-latitudes, such as a continent. The two standard parallels are chosen inside the region and the scale is within a percent or two across it; most regional forecast models, for example the 3 km grid of NOAA's HRRR (standard parallel 38.5° N), use it.
- **Mercator** — for the tropics, where it is close to a plane and the winds are mainly easterly or westerly.

Numerical models state their map in the output: the standard GRIB2 grid templates have a polar-stereographic and a Lambert-conformal form, and the WRF model offers Lambert, polar stereographic, Mercator and latitude–longitude grids. The rule of thumb is the one for any map: choose the projection whose scale varies least over the domain, and the one that is conformal.

### What goes wrong
A forecaster who measures isobar spacing on the 60° N polar chart at 45° N and ignores $m = 1.09$ underestimates the true wind by 9 %; at 30° it is 24 %. The same mistake with Mercator would be a factor of 1.15 at 30° and 1.41 at 45°.

> [!note] Satellite pictures begin as a view from a geostationary orbit, a vertical perspective of the whole disc ([[vertical-perspective-projection]]), and are re-mapped to the same Mercator, conic or polar stereographic grids before they are overlaid on the analysis.`,
  ideas: [
    'Winds follow the isobars (geostrophic balance), so weather maps must be conformal: angles right, only the size distorted.',
    'The distortion is a single map factor m(φ); true distance = map distance / m, and the gradient measured on the map must be multiplied by m.',
    'Polar stereographic true at 60° N: m = (1 + sin 60°)/(1 + sin φ) = 1 at 60°, 0.933 at the pole, 1.24 at 30°.',
    'Lambert conformal conic for mid-latitude regional models, Mercator for the tropics, polar stereographic for the polar caps and hemisphere.',
    'The geostrophic wind V = Δp/(ρ f Δn) with f = 2Ω sin φ; ignoring the map factor makes a 9 % error at 45° on the 60° chart.'
  ],
  pitfalls: [
    'A weather map can be any pretty projection — The wind direction relative to the isobars, the front\'s shape and the geometry of cyclones are all angles, which only conformal maps keep. An equal-area map would bend them.',
    'The map factor is 1 everywhere on the chart — It is 1 only on the standard parallel; elsewhere distances on the map differ, and a gradient read from the isobar spacing needs the factor.',
    'Geostrophic winds are the real winds — They are the balance in the free atmosphere; near the ground friction turns the wind across the isobars and slows it, and near the equator the balance fails (f → 0).'
  ],
  formulas: [
    {
      name: 'Map factor of the polar stereographic projection',
      expr: 'm = (1 + sin(p0))/(1 + sin(phi))',
      tex: 'm = \\frac{1 + \\sin\\varphi_0}{1 + \\sin\\varphi}',
      vars: {
        m: { name: 'map factor (map distance / true distance)' },
        p0: { name: 'standard parallel (where the map is true)', q: 'angle', unit: '°', value: 60, min: 1, max: 90, tex: '\\varphi_0' },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 45, min: -20, max: 90, tex: '\\varphi' }
      },
      solveFor: 'm',
      note: '1 at the standard parallel; for φ₀ = 60°: 1.093 at 45°, 1.244 at 30°, 0.933 at the pole. With φ₀ = 90° (the plane touching the pole) the factor is 1 at the pole and 1.17 at 45°.'
    },
    {
      name: 'Coriolis parameter',
      expr: 'f = 2*Om*sin(lat)',
      tex: 'f = 2\\Omega\\sin\\varphi',
      vars: {
        f: { name: 'Coriolis parameter', q: 'angvel', unit: 'rad/s' },
        Om: { name: 'angular velocity of the Earth', q: 'angvel', unit: 'rad/s', value: 7.292e-5, fixed: true, tex: '\\Omega' },
        lat: { name: 'latitude', q: 'angle', unit: '°', value: 45, min: 0, max: 90, tex: '\\varphi' }
      },
      solveFor: 'f',
      note: '1.03 × 10⁻⁴ s⁻¹ at 45°, 1.46 × 10⁻⁴ s⁻¹ at the pole, zero at the equator (where the geostrophic balance fails).'
    },
    {
      name: 'Geostrophic wind from a chart',
      expr: 'V = m*dp/(rho*2*Om*sin(lat)*dn)',
      tex: 'V_g = \\frac{m\\,\\Delta p}{\\rho\\cdot 2\\Omega\\sin\\varphi\\cdot\\Delta n_{\\mathrm{map}}}',
      vars: {
        V: { name: 'geostrophic wind speed', q: 'speed', unit: 'm/s', tex: 'V_g' },
        m: { name: 'map factor at the place', value: 1.093 },
        dp: { name: 'pressure difference between neighbouring isobars', q: 'pressure', unit: 'hPa', value: 4, tex: '\\Delta p' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.2, tex: '\\rho' },
        Om: { name: 'angular velocity of the Earth', q: 'angvel', unit: 'rad/s', value: 7.292e-5, fixed: true, tex: '\\Omega' },
        lat: { name: 'latitude', q: 'angle', unit: '°', value: 45, min: 5, max: 90, tex: '\\varphi' },
        dn: { name: 'distance between the isobars measured on the map', q: 'length', unit: 'km', value: 200, tex: '\\Delta n_{\\mathrm{map}}' }
      },
      solveFor: 'V',
      note: 'The wind from the spacing of the isobars. A 4 hPa interval across 200 km of map at 45° N on the 60° N polar chart gives 17.7 m/s (34 knots); with m = 1, 16.2 m/s. The density is a surface value; aloft it is smaller.'
    }
  ],
  examples: [{
    title: 'Reading the wind from the isobars',
    q: 'On a polar stereographic chart true at 60° N, two isobars 4 hPa apart are 200 km apart on the map at 45° N. What is the geostrophic wind? How wrong would you be by ignoring the map factor?',
    steps: [
      { text: 'Map factor at 45° N on the chart true at 60° N:', tex: 'm = \\frac{1 + \\sin 60°}{1 + \\sin 45°} = \\frac{1.866}{1.707} = 1.093' },
      { text: 'True distance across the isobars: $200/1.093 = 183$ km. Coriolis parameter:', tex: 'f = 2 \\cdot 7.292\\times10^{-5}\\sin 45° = 1.031\\times10^{-4}\\ \\text{s}^{-1}' },
      { text: 'Wind:', tex: 'V_g = \\frac{400\\ \\text{Pa}}{1.2 \\cdot 1.031\\times10^{-4} \\cdot 183\\,000\\ \\text{m}} = 17.7\\ \\text{m/s} \\approx 34\\ \\text{kt}' },
      'Ignoring $m$ would have used 200 km and given 16.2 m/s, 9 % too small. At 30° N the factor is 1.24: 24 % too small.'
    ],
    a: '17.7 m/s (34 knots); 9 % low if the map factor is forgotten.'
  }],
  quiz: [
    { q: 'Why must a weather map be conformal?', choices: ['So that areas of cloud are right', 'So that the angle between the wind and the isobars, and the shapes of fronts, are right', 'So that the poles can be shown', 'So that distances are right'], a: 1, why: 'Conformal means angle-preserving. The balance of forces shows as wind parallel to isobars; the chart must keep that parallelism and the shapes of weather systems.' },
    { q: 'The map factor of the polar stereographic chart true at 60° N is exactly 1 at which latitude?', answer: 60, unit: '°', why: 'm = (1 + sin 60°)/(1 + sin φ) = 1 when φ = 60°.' },
    { q: 'At the North Pole the map factor on the 60°-true polar stereographic chart is', choices: ['1', '0.933', '1.07', '2'], a: 1, why: 'm = 1.866/2 = 0.933: the chart is slightly too small at the pole (the cutting plane lies below the tangent plane).' },
    { q: 'The Coriolis parameter at 30° N is about, in units of 10⁻⁴ s⁻¹,', answer: 0.73, why: 'f = 2 × 7.292×10⁻⁵ × sin 30° = 7.29×10⁻⁵ = 0.73×10⁻⁴.' },
    { q: 'Geostrophic balance works best at the equator, where the Coriolis force is greatest.', a: false, why: 'f = 2Ω sin φ vanishes at the equator, so the balance (and the geostrophic wind formula) fails there; it is useful in the middle and high latitudes.' }
  ],
  applications: [
    'Hemispheric and regional surface and upper-air analyses: polar stereographic charts (true at 60° N in the northern hemisphere), on which the winds and the isobars can be compared by eye.',
    'Regional numerical forecast models: continental domains on Lambert conformal conic grids, tropical ones on Mercator, polar ones on polar stereographic, each described by a few numbers (standard parallels, central meridian, grid spacing) in the output files.',
    'Radar and satellite composites: mosaics of many radars are placed on one conformal grid so that the precipitation and the cloud systems line up with the analysis.',
    'Aviation weather: significant-weather charts for flight levels, drawn on the same polar stereographic and Lambert charts that carry the routes ([[aviation-and-polar-routes]]).'
  ],
  history: 'The first numerical weather forecasts, made on the ENIAC computer in 1950 by Charney, Fjørtoft and von Neumann, covered a region over North America on a grid laid on a conformal map; the hemispheric models that followed used grids on a polar stereographic map, true at 60° N, which was conformal and easy to compute. The map-factor convention that appears in every model\'s equations — all lengths divided by m — is described in the standard dynamic-meteorology texts. The Lambert conformal conic became the favoured projection for mid-latitude regional models as higher-resolution domains became possible.',
  sources: ['James R. Holton and Gregory J. Hakim, *An Introduction to Dynamic Meteorology*, 5th ed. (2013), the chapters on the basic equations and on the geostrophic wind.', 'William C. Skamarock and others, *A Description of the Advanced Research WRF Model Version 4*, NCAR Technical Note NCAR/TN-556+STR (2019), the section on map projections and map factors.', 'World Meteorological Organization, *Manual on Codes*, WMO-No. 306, the GRIB edition 2 grid definition templates for polar stereographic and Lambert conformal grids.'],
  sim: 'ns-scale-factor',
  construction: 'ns-weather-polar'
}

);
