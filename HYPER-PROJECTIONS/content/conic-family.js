/* HYPER-PROJECTIONS · content/conic-family.js
 *
 * The conic projections: the cone wrapped round the globe and unrolled into a fan — the equidistant conic, Lambert's
 * conformal conic, Albers' equal-area conic — and the two relatives that use the cone only for the apex and the central
 * meridian, the polyconic and the Bonne/Werner heart. Each page gives the formula, what is kept, the hand construction
 * (constructions/conic-family.js) and the lab (sims/conic-family.js).
 */
Hyper.add(
{
  id: 'conic-projections',
  parent: 'conic-family',
  title: 'Conic projections',
  level: 1,
  short: 'Wrap a cone round the globe so that it touches along a parallel, then unroll it: the meridians become straight lines fanning out from the apex and the parallels become circular arcs about it. The cone is a developable surface, so nothing tears; the family suits countries that are wider east–west than north–south.',
  keywords: ['cone', 'conic', 'standard parallel', 'apex', 'cone constant', 'fan', 'sector', 'developable', 'tangent cone', 'secant cone', 'normal aspect', 'one-sixth rule'],
  prereq: ['developable-surfaces', 'scale-factor-and-standard-parallels', 'why-the-sphere-cannot-be-flattened'],
  related: ['equidistant-conic-projection', 'lambert-conformal-conic', 'albers-equal-area-conic', 'cylindrical-projections', 'azimuthal-projections', 'choosing-a-projection'],
  body: `Hold a paper cone, like a party hat, over a globe so that it touches the globe along one circle of latitude, the **standard parallel** $\\varphi_1$. Slit the cone along one of its generators and open it out flat: nothing stretches or tears, because a cone is a *developable* surface (see [[developable-surfaces]]). What you have is a fan centred on the cone's **apex** $A$. Carry the globe onto the cone by whatever rule defines the particular projection and the fan becomes a map. The cone is symmetric about the polar axis, so every meridian lands on a straight generator and every parallel on a circle round the apex: **straight lines fanning out from a point, crossed by concentric arcs**.

### The geometry of the cone
In a side view the tangent to the globe at the standard parallel is perpendicular to the radius there, and it meets the polar axis at the apex: $OA = R/\\sin\\varphi_1$. The slant height of the cone, from the apex to the circle of contact, is
$$\\rho_1 = R\\cot\\varphi_1 .$$
Unrolled, the cone is a fan of radius $\\rho_1$ whose arc must be as long as the circle of contact, $2\\pi R\\cos\\varphi_1$. So the fan opens through
$$\\theta = \\frac{2\\pi R\\cos\\varphi_1}{R\\cot\\varphi_1} = 2\\pi\\sin\\varphi_1 , \\qquad n = \\sin\\varphi_1 = \\frac{\\theta}{2\\pi}.$$
The **cone constant** $n$ is the fraction of a full turn through which the fan opens, and it fixes the meridians: a meridian $\\lambda$ away from the central one is drawn $n\\lambda$ away from it on the map. With the central meridian running down the sheet, a point at distance $\\rho$ from the apex has
$$x = \\rho\\sin(n\\lambda), \\qquad y = \\rho_0 - \\rho\\cos(n\\lambda).$$
What distinguishes one conic projection from another is only the rule $\\rho(\\varphi)$, how far each parallel lies from the apex, and the choice of $n$.

### From a plane to a cylinder
Put the standard parallel at the pole, $\\varphi_1 = 90°$: then $n = 1$, the cone is flat, the fan is a whole disc and the map is azimuthal. Put it on the equator, $\\varphi_1 = 0°$: then $n = 0$, the apex runs off to infinity, the arcs straighten, and the map is cylindrical. The family fills the gap and suits the middle latitudes.

### Tangent and secant
A cone that touches along one parallel is *tangent*. One that cuts through the globe along two parallels $\\varphi_1$ and $\\varphi_2$ is *secant*; both parallels are drawn at their true length and the error is shared between the zone inside and the zones outside (see [[scale-factor-and-standard-parallels]]). The *one-sixth rule* puts the two parallels a sixth of the way in from the north and south edges of the region.

### What it keeps and loses
Whatever the rule, parallels and meridians cross at right angles and the scale along a parallel depends on latitude alone. The far hemisphere is stretched beyond use, so a conic map is a regional map. The spacing rule decides the virtue: equal steps give the [[equidistant-conic-projection|equidistant conic]], the tangent-function spacing [[lambert-conformal-conic|Lambert's conformal conic]], the sine rule [[albers-equal-area-conic|Albers' equal-area conic]]. Use a separate cone for every parallel and you have the [[polyconic-projection|polyconic]]; use the cone only for the apex and the central meridian and you have [[bonne-projection|Bonne's]] map and [[werner-cordiform|Werner's heart]].

> [!tip] To draw any conic map you need the apex, the opening $n$ and a table of $\\rho(\\varphi)$; the construction unrolls the tangent cone with compass and set square.`,
  ideas: [
    'A cone touching the globe along a parallel unrolls, without stretching, into a fan: the meridians become straight rays from the apex, the parallels arcs about it.',
    'The fan opens through 360° sin φ₁; a meridian λ from the central one is drawn nλ from it, where n = sin φ₁ is the cone constant (for two parallels n takes another value).',
    'All the conic maps have this layout; they differ only in the rule ρ(φ) that spaces the parallels and in n.',
    'A secant cone with two standard parallels spreads the error; the one-sixth rule places them.',
    'The family runs from the azimuthal map (n = 1) to the cylindrical one (n = 0) and serves the middle latitudes.'
  ],
  pitfalls: [
    'A conic map is a photograph of the globe thrown onto a cone — Only the geometry of the cone is used to lay out the fan; the spacing of the parallels is set by a rule (equal distance, conformality, equal area) and has nothing to do with light or shadows.',
    'The standard parallel is the middle of the map — It is only where the cone touches and the scale is exactly true. The map can extend far on both sides, and the error grows away from it.',
    'A conic map can show the whole world — Far from the standard parallels the stretching grows without limit (in the conformal case the south pole is infinitely far away); a conic map is for a country or a continent.'
  ],
  formulas: [
    {
      name: 'How far the fan opens',
      expr: 'theta = 2*pi*sin(phi1)',
      tex: '\\theta = 2\\pi\\sin\\varphi_1',
      vars: { theta: { name: 'opening angle of the fan', q: 'angle', unit: '°', tex: '\\theta' }, phi1: { name: 'standard parallel (latitude of contact)', q: 'angle', unit: '°', value: 40, min: 1, max: 89, tex: '\\varphi_1' } },
      note: 'For the tangent cone. The cone constant is n = sin φ₁ = θ/2π: at 30° the fan is a half-disc, at 90° a whole disc, at 0° it has no opening at all.'
    },
    {
      name: 'Slant height of the tangent cone',
      expr: 'rho = R/tan(phi1)',
      tex: '\\rho_1 = \\frac{R}{\\tan\\varphi_1}',
      vars: { rho: { name: 'distance of the standard parallel from the apex', q: 'length', unit: 'mm', tex: '\\rho_1' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, phi1: { name: 'standard parallel', q: 'angle', unit: '°', value: 40, min: 1, max: 89, tex: '\\varphi_1' } },
      note: 'The length of the tangent from the point of contact to the polar axis, R cot φ₁: it is the radius of the arc that carries the standard parallel on the map.'
    },
    {
      name: 'Where a meridian falls on the fan',
      expr: 'delta = n*lam',
      tex: '\\delta = n\\,\\lambda',
      vars: { delta: { name: 'angle at the apex from the central meridian', q: 'angle', unit: '°', signed: true, tex: '\\delta' }, n: { name: 'cone constant', value: 0.643, min: 0.01, max: 1 }, lam: { name: 'longitude from the central meridian', q: 'angle', unit: '°', value: 30, signed: true, min: -180, max: 180, tex: '\\lambda' } },
      note: 'With n = 0.643 (a tangent cone at 40°) 30° of longitude is 19.3° on the map and the whole 360° fits in 231.4°.'
    },
    {
      name: 'Scale along a parallel',
      expr: 'k = n*rho/(R*cos(phi))',
      tex: 'k = \\frac{n\\,\\rho}{R\\cos\\varphi}',
      vars: { k: { name: 'scale along the parallel' }, n: { name: 'cone constant', value: 0.643, min: 0.01, max: 1 }, rho: { name: 'distance of the parallel from the apex', q: 'length', unit: 'mm', value: 119.2, tex: '\\rho' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 40, min: 0, max: 89, tex: '\\varphi' } },
      note: 'A parallel of true length R cos φ (per radian of longitude) is drawn with length nρ on the map. On the standard parallel the two are equal: k = 1.'
    }
  ],
  examples: [
    {
      title: 'The tangent cone at 45°',
      q: 'A globe of radius 100 mm is touched along the 45° parallel by a cone. How far from the apex is the parallel of contact, through what angle does the unrolled fan open, and where is the meridian 30° from the central one?',
      steps: [
        { text: 'The slant height is the radius of the arc:', tex: '\\rho_1 = R\\cot 45° = 100\\ \\text{mm}.' },
        { text: 'The cone constant is the sine of the latitude, so the fan opens through', tex: '\\theta = 360°\\sin 45° = 254.6°.' },
        { text: 'A meridian 30° away is drawn', tex: '30° \\times 0.7071 = 21.2°' },
        'from the central meridian. Check: the arc of the fan is $254.6° = 4.443$ rad times 100 mm = 444.3 mm, which is the length of the circle of contact, $2\\pi \\times 100 \\times \\cos 45° = 444.3$ mm.'
      ],
      a: 'The parallel is 100 mm from the apex; the fan opens through 254.6°; the meridian 30° away lies 21.2° from the central one.'
    },
    {
      title: 'A half-disc',
      q: 'For which standard parallel does a tangent cone unroll into exactly a half-disc? What is the angle between the central meridian and the one 90° away?',
      steps: [
        'A half-disc is 180°, so $n = 180°/360° = 0.5$ and $\\sin\\varphi_1 = 0.5$, which means $\\varphi_1 = 30°$.',
        'The meridian 90° of longitude away is drawn $n \\times 90° = 45°$ from the central one: the quarter of the globe lands on a quarter of the half-disc.'
      ],
      a: 'The standard parallel is 30°; the meridian 90° away is 45° from the central one on the map.'
    }
  ],
  quiz: [
    { q: 'A cone tangent to the globe at latitude 30° is cut open and unrolled. Through what angle does the fan open?', choices: ['90°', '180°', '216°', '260°'], a: 1, why: 'The opening is 360° × sin φ₁ = 360° × 0.5 = 180°: a half-disc. (216° would be a tangent parallel of 36.9°, 260° one of 46°.)' },
    { q: 'What happens to the fan as the standard parallel of a tangent cone is moved towards the pole?', choices: ['The fan closes up into a narrow wedge', 'The fan opens to a full disc and the map becomes azimuthal', 'The meridians become curves', 'The parallels become straight lines'], a: 1, why: 'n = sin φ₁ tends to 1: the cone flattens into the tangent plane at the pole and the map is an azimuthal one, centred on the pole.' },
    { q: 'On a Lambert conformal conic or an Albers map the meridians are straight lines through the apex.', a: true, why: 'Both use a cone symmetric about the polar axis: every meridian goes onto a generator of the cone, which unrolls into a straight line through the apex. (In the polyconic and the Bonne map the cone is not used for the meridians, and they are curves.)' },
    { q: 'A secant cone with two standard parallels has a scale of exactly 1 everywhere between them.', a: false, why: 'The scale is 1 on the two parallels themselves, and a little below 1 in the zone between them (the cone passes inside the globe there, so the map is a little too small); outside them it is above 1.' },
    { q: 'A tangent cone touches the globe at 40°. Through how many degrees does the unrolled fan open?', answer: 231.4, unit: '°', why: '360° × sin 40° = 360° × 0.6428 = 231.4°.' }
  ],
  applications: [
    'Atlas maps of mid-latitude countries and continents (Europe, the United States, Russia, China): the parallels are drawn as arcs convex towards the pole, as they appear on the globe, and the distortion is smallest where the country lies.',
    'National grids and survey projections for countries that extend east–west: the Lambert zones of France and the State Plane zones of such US states as Tennessee and Pennsylvania use a conformal cone whose axis follows the long direction of the territory.',
    'Weather-model grids and aeronautical charts, where a conformal map of a mid-latitude region with nearly constant scale is wanted (see the next pages).',
    'Teaching by hand: a paper cone is the one developable surface you can wrap and unroll yourself, and the compass-and-protractor construction of the fan is the simplest hand-drawn graticule there is.'
  ],
  history: 'The cone is the oldest curved sheet in cartography: the first of Ptolemy\'s two projections in his *Geography* (about 150) is a cone touching at the parallel of Rhodes, 36° N, with straight meridians meeting beyond the pole. Delisle gave the two-parallel version in 1745, Lambert the conformal and equal-area cones in 1772, and Albers the two-parallel equal-area cone in 1805.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the introduction and the chapters on conic projections.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).', 'Arthur H. Robinson and others, *Elements of Cartography* (6th ed., 1995), the chapter on projections.'],
  sim: ['co-cone-unrolled', 'co-conic-maps'],
  construction: 'co-cone-unrolled'
},

{
  id: 'equidistant-conic-projection',
  parent: 'conic-family',
  title: 'The equidistant conic projection',
  level: 2,
  short: 'The conic map with the parallels set at their true distance apart: meridians straight and true to scale, parallels concentric arcs, with one or two standard parallels. Simple to draw with dividers and a protractor; neither conformal nor equal-area.',
  keywords: ['equidistant conic', 'simple conic', 'Delisle', 'de l\'Isle', 'Ptolemy', 'two standard parallels', 'true distance', 'apex', 'cone constant'],
  prereq: ['conic-projections', 'equidistant-maps', 'scale-factor-and-standard-parallels'],
  related: ['lambert-conformal-conic', 'albers-equal-area-conic', 'azimuthal-equidistant-projection', 'equirectangular-projection', 'ptolemys-geography'],
  body: `The simplest rule for spacing the parallels of a conic map is no rule at all: put them at their **true distance** apart along the meridian. A degree of latitude is then $R\\pi/180$ long on the sheet wherever it lies, every meridian is drawn at the scale of the globe, and the map is *equidistant along the meridians*. On the central meridian of the unrolled fan the parallels are equally spaced marks, and the arcs through them are concentric about the apex.

### One standard parallel
Take the cone tangent at $\\varphi_1$ (see [[conic-projections]]). The apex is $R\\cot\\varphi_1$ from the parallel of contact, so the parallel of latitude $\\varphi$ is at
$$\\rho = R\\,(\\cot\\varphi_1 + \\varphi_1 - \\varphi), \\qquad n = \\sin\\varphi_1 .$$
This is the *simple conic*. Ptolemy's first projection was of this kind, true on the parallel of Rhodes at 36° N, which gives $n = 0.588$.

### Two standard parallels
Delisle's improvement is the secant cone: both $\\varphi_1$ and $\\varphi_2$ are drawn at their true length, so $n\\rho_1 = R\\cos\\varphi_1$ and $n\\rho_2 = R\\cos\\varphi_2$, while the two arcs are $R(\\varphi_2 - \\varphi_1)$ apart. Subtracting the two radii gives
$$n = \\frac{\\cos\\varphi_1 - \\cos\\varphi_2}{\\varphi_2 - \\varphi_1}, \\qquad G = \\frac{\\cos\\varphi_1}{n} + \\varphi_1, \\qquad \\rho = R\\,(G - \\varphi), \\qquad \\theta = n\\lambda .$$
The apex lies $RG$ above the equator on the central meridian. The scale along a parallel is $k = n\\rho/(R\\cos\\varphi)$: it is 1 on both standard parallels, a little below 1 between them and above 1 outside. With parallels at 20° and 60°, $k$ is 0.94 at 40°, but 1.16 at the equator and 1.61 at 80°. The scale along the meridians is 1 everywhere.

### What it keeps and loses
Every distance along a meridian is true, so the north–south distance between two places can be read off with a ruler. Angles are not true and areas are not true: the error is modest between the standard parallels and grows smoothly outside them, and the pole is an arc, not a point. It is a plain compromise that needs no table, only $\\varphi_1$, $\\varphi_2$ and a calculator, or the similar-triangle construction below, which finds the apex with two lengths taken from the side view of the globe and draws the rest with dividers.

### Drawing it by hand
Draw the central meridian; lay off the two parallels $R(\\varphi_2 - \\varphi_1)$ apart; find the apex $A$ where $AP_2 : AP_1 = \\cos\\varphi_2 : \\cos\\varphi_1$ by drawing two parallel lines of the lengths $R\\cos\\varphi_1$ and $R\\cos\\varphi_2$ through the two points and joining their ends; swing the arcs about $A$; lay off the meridians at $n\\lambda$ with the protractor.

> [!note] If both standard parallels are placed at the same latitude the formulas collapse to the simple conic, $n = \\sin\\varphi_1$. With the parallels at $\\pm\\varphi_1$ symmetric about the equator, $n = 0$: the map is the equidistant cylindrical.`,
  ideas: [
    'The parallels are spaced at their true distance along the meridians, so the scale along every meridian is 1: the map is equidistant in the north–south direction.',
    'With two standard parallels, n = (cos φ₁ − cos φ₂)/(φ₂ − φ₁) and the parallel of latitude φ is at ρ = R(G − φ), G = cos φ₁/n + φ₁.',
    'The scale along a parallel, k = nρ/(R cos φ), is 1 on the standard parallels, below 1 between them and above 1 outside.',
    'Neither conformal nor equal-area; chosen for simplicity and for true north–south distances.'
  ],
  pitfalls: [
    'Equidistant means every distance is true — Only distances along the meridians (and the standard parallels) are true. East–west distances off the standard parallels, and every oblique distance, are wrong.',
    'The apex is halfway between the two standard parallels — It lies beyond the northern one, on the central meridian, at the point where the distances to the two arcs stand in the ratio cos φ₂ : cos φ₁.',
    'A second standard parallel makes the map equidistant in both directions — It only makes the scale true along two parallels; the scale along the parallels in between is below 1, and the map is still not conformal or equal-area.'
  ],
  formulas: [
    {
      name: 'Cone constant with two standard parallels',
      expr: 'n = (cos(phi1) - cos(phi2))/(phi2 - phi1)',
      tex: 'n = \\frac{\\cos\\varphi_1 - \\cos\\varphi_2}{\\varphi_2 - \\varphi_1}',
      vars: { n: { name: 'cone constant' }, phi1: { name: 'first standard parallel', q: 'angle', unit: '°', value: 20, min: 0, max: 80, tex: '\\varphi_1' }, phi2: { name: 'second standard parallel', q: 'angle', unit: '°', value: 60, min: 10, max: 89, tex: '\\varphi_2' } },
      solveFor: 'n',
      note: 'The two parallels must be of true length (nρ = R cos φ) and R(φ₂ − φ₁) apart; n is the fraction of a turn the fan opens through. For 20° and 60°, n = 0.630.'
    },
    {
      name: 'Distance of a parallel from the apex',
      expr: 'rho = R*(cos(phi1)/n + phi1 - phi)',
      tex: '\\rho = R\\left(\\frac{\\cos\\varphi_1}{n} + \\varphi_1 - \\varphi\\right)',
      vars: { rho: { name: 'distance of the parallel from the apex', q: 'length', unit: 'mm', tex: '\\rho' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, phi1: { name: 'first standard parallel', q: 'angle', unit: '°', value: 20, min: 0, max: 80, tex: '\\varphi_1' }, n: { name: 'cone constant', value: 0.6298, min: 0.05, max: 1 }, phi: { name: 'latitude of the parallel', q: 'angle', unit: '°', value: 40, signed: true, min: -60, max: 89, tex: '\\varphi' } },
      solveFor: 'rho',
      note: 'The parallels are R φ apart in true arc length, so ρ falls by 17.45 mm for every 10° of latitude when R = 100 mm.'
    },
    {
      name: 'Scale along a parallel',
      expr: 'k = n*rho/(R*cos(phi))',
      tex: 'k = \\frac{n\\,\\rho}{R\\cos\\varphi}',
      vars: { k: { name: 'scale along the parallel' }, n: { name: 'cone constant', value: 0.6298, min: 0.05, max: 1 }, rho: { name: 'distance of the parallel from the apex', q: 'length', unit: 'mm', value: 114.3, tex: '\\rho' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 40, min: 0, max: 89, tex: '\\varphi' } },
      note: 'At 40° between standard parallels of 20° and 60° the parallel is drawn 6 % too short; at 80° it is 61 % too long.'
    }
  ],
  examples: [
    {
      title: 'Standard parallels at 20° and 60°',
      q: 'Draw the equidistant conic with standard parallels 20° and 60° for a globe of radius 100 mm. Where is the apex, how far from it is the parallel of 40°, and where does the point 40° N, 30° E fall?',
      steps: [
        { text: 'The cone constant:', tex: 'n = \\frac{\\cos 20° - \\cos 60°}{(60° - 20°)\\cdot\\pi/180°} = \\frac{0.9397 - 0.5}{0.6981} = 0.6298.' },
        { text: 'The apex lies at distance $RG$ from the equator on the central meridian, with', tex: 'G = \\frac{\\cos 20°}{n} + 20° = 1.4919 + 0.3491 = 1.8411,' },
        'so the apex is 184.1 mm above the point where the central meridian crosses the equator.',
        { text: 'The parallel of 40° is', tex: '\\rho = 100\\,(1.8411 - 0.6981) = 114.3\\ \\text{mm}' },
        'from the apex, and its scale is $k = 0.6298 \\times 114.3/(100 \\cos 40°) = 0.940$.',
        { text: 'The meridian 30° away is turned $0.6298 \\times 30° = 18.9°$ from the central one, so the point is at', tex: 'x = 114.3\\sin 18.9° = 37.0\\ \\text{mm}, \\qquad y = 184.1 - 114.3\\cos 18.9° = 76.0\\ \\text{mm}.' }
      ],
      a: 'The apex is 184.1 mm above the equator on the central meridian; the 40° parallel is 114.3 mm from it (scale 0.94); the point lies at (37.0, 76.0) mm.'
    }
  ],
  quiz: [
    { q: 'Why is the scale along every meridian of an equidistant conic map equal to 1?', choices: ['Because the cone touches the globe along every meridian', 'Because the parallels are placed at their true distance apart along the meridians', 'Because the meridians are great circles', 'Because the map is conformal'], a: 1, why: 'The spacing rule is that a degree of latitude is R times π/180 long everywhere. Since the meridians are straight lines through the apex, that is exactly a scale of 1 along them.' },
    { q: 'An equidistant conic map has standard parallels at 20° and 60°. The scale along the parallel of 40° is about', answer: 0.94, why: 'k = nρ/(R cos φ) with n = 0.6298, ρ = 114.3 mm for R = 100 mm: k = 0.6298 × 114.3/76.6 = 0.94. Between the two standard parallels the parallels are drawn a little too short.' },
    { q: 'Using two standard parallels instead of one makes the equidistant conic conformal.', a: false, why: 'The conformal map needs a different spacing rule, ρ ∝ tan^(−n)(45° + φ/2). Two parallels in the equidistant conic only make two parallels true to scale.' },
    { q: 'Ptolemy\'s first projection was true on the parallel of Rhodes, 36° N. What is its cone constant?', answer: 0.588, why: 'For a tangent cone n = sin φ₁ = sin 36° = 0.588.' },
    { q: 'A country extends from 30° N to 60° N. By the one-sixth rule the standard parallels are at', choices: ['35° and 55°', '30° and 60°', '40° and 50°', '45° and 45°'], a: 0, why: 'A sixth of the 30° range is 5°: the parallels go 5° in from each edge, at 35° N and 55° N.' }
  ],
  applications: [
    'Maps of broad mid-latitude regions in atlases and GIS packages where simple, true north–south distances are more useful than conformality: the equidistant conic is a standard choice in mapping software.',
    'The historical maps of Russia: Delisle designed the two-parallel form for the maps of the Russian Academy of Sciences in 1745, a country wider east–west than north–south.',
    'Teaching: the first map projection a student can draw from scratch with compass, protractor and dividers, with no table of functions.',
    'Ptolemy\'s first projection and the "plane charts" derived from it, the oldest conic maps in the record.'
  ],
  history: 'Ptolemy\'s *Geography* (about 150) describes a cone with straight meridians meeting beyond the pole and the parallels as arcs at their true spacing, true on the parallel of Rhodes. Joseph-Nicolas Delisle, a French astronomer serving the Russian Academy of Sciences in St Petersburg, introduced the version with two standard parallels in the 1740s for the maps of Russia, and Leonhard Euler analysed it and the choice of parallels in a paper of 1777.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapter on the equidistant conic.', 'John P. Snyder, *Flattening the Earth* (1993), the chapters on Ptolemy and on the eighteenth century.', 'Leonhard Euler, *De repraesentatione superficiei sphaericae super plano* and the companion papers on map projection (1777).'],
  sim: [{ id: 'co-conic-maps', params: { cone: 'equidistant-conic' } }, { id: 'co-conic-scale', params: { cone: 'equidistant-conic' } }],
  construction: 'co-equidistant-conic'
},

{
  id: 'lambert-conformal-conic',
  parent: 'conic-family',
  title: 'Lambert\'s conformal conic',
  level: 2,
  short: 'The conic map that keeps every angle: the parallels are spaced so that the scale along a parallel equals the scale along the meridian at every latitude. Straight lines are close to great circles, the scale is nearly constant between the two standard parallels; the chart of aviation, weather models and the wide national grids.',
  keywords: ['Lambert', 'conformal', 'conic', 'two standard parallels', 'aeronautical chart', 'state plane', 'tan', 'angles true', 'ETRS-LCC', 'Lambert-93'],
  prereq: ['conic-projections', 'conformal-maps', 'scale-factor-and-standard-parallels'],
  related: ['mercator-projection', 'albers-equal-area-conic', 'equidistant-conic-projection', 'stereographic-projection', 'aviation-and-polar-routes', 'surveys-and-national-grids', 'lambert-1772'],
  body: `Johann Heinrich Lambert asked in 1772 which spacing of the parallels on a cone makes the map **conformal**: every small figure keeps its shape and every angle is true. The answer is the conic cousin of [[mercator-projection|Mercator's]] spacing. The scale along a parallel at distance $\\rho$ from the apex is $k = n\\rho/(R\\cos\\varphi)$, the scale along the meridian is $h = -R^{-1}\\,d\\rho/d\\varphi$, and demanding $h = k$ gives (see the derivation)
$\\rho = \\frac{C}{\\tan^{n}\\left(\\dfrac{\\pi}{4} + \\dfrac{\\varphi}{2}\\right)}, \\qquad \\theta = n\\lambda .$
The tangent of the half-colatitude is the same function that spaces the parallels of Mercator, so the pole itself ($\\varphi = 90°$) is at the apex ($\\rho = 0$) and the opposite pole is infinitely far away.

### Two standard parallels
Choosing the scale to be exactly 1 on two parallels $\\varphi_1$ and $\\varphi_2$ fixes the constants:
$$n = \\frac{\\ln(\\cos\\varphi_1/\\cos\\varphi_2)}{\\ln\\left[\\tan(\\tfrac{\\pi}{4}+\\tfrac{\\varphi_2}{2})/\\tan(\\tfrac{\\pi}{4}+\\tfrac{\\varphi_1}{2})\\right]}, \\qquad \\rho = \\frac{R\\,F}{\\tan^{\\,n}(\\pi/4 + \\varphi/2)}, \\quad F = \\frac{\\cos\\varphi_1\\tan^{\\,n}(\\pi/4+\\varphi_1/2)}{n}.$$
For 33° and 45° (the usual pair for the United States) $n = 0.6305$ and $RF = 195.50$ for $R = 100$. Between the parallels the scale is slightly below 1 (about 0.995 at 39°), outside it is above 1: 1.05 at 20°, 1.07 at 60°, 1.23 at the equator. The scale at a point is the same in every direction, and the area scale is its square.

### What it keeps and loses
Angles are true: meridians and parallels cross at right angles and small shapes (a town, a lake) are not sheared. In return the area grows away from the standard parallels and the parallels bunch ever closer to the apex. The great circles, the shortest routes, are not exactly straight lines but are very close to it between the standard parallels, which is why the map is the pilot's chart of the middle latitudes: a ruler laid between two airports gives a bearing and a distance good to a percent or so.

### Drawing it by hand
The spacing is not a simple function, so the parallels are laid off from a table of $\\rho(\\varphi)$ (see the construction): mark the radii down the central meridian from the apex, swing the arcs, and draw the meridians at $n\\lambda$ with a protractor. The meridians are straight lines, which is why the whole map can be assembled from straight edges and arcs.

> [!fact] The pole is a single point on the map and the opposite pole is at infinity, so a conformal cone cannot show the whole sphere. The conformal map that does is the [[stereographic-projection|stereographic]], the limit $n \\to 1$.`,
  ideas: [
    'The spacing ρ ∝ tan^(−n)(45° + φ/2) makes the scale along the meridian equal to the scale along the parallel at every latitude: the map is conformal.',
    'With two standard parallels the cone constant is n = ln(cos φ₁/cos φ₂) / ln[tan(45° + φ₂/2)/tan(45° + φ₁/2)].',
    'The scale is 1 on the standard parallels, slightly below 1 between them and above 1 outside; it is the same in every direction.',
    'Great circles are almost straight lines between the standard parallels: the pilot\'s chart of the middle latitudes.',
    'The pole is at the apex; the opposite pole is infinitely far away; n → 1 gives the stereographic projection.'
  ],
  pitfalls: [
    'Conformal means that distances are true — It means angles and small shapes are true. The scale still varies with latitude (0.995 to 1.23 in the example), though in every direction alike.',
    'A straight line on the map is a great circle — Only approximately, and best between the standard parallels. Far outside them the great circle curves; there is no conic or cylindrical map on which all great circles are straight.',
    'Lambert\'s conic is a perspective projection — No light source gives it: the spacing is the integral of the secant, like Mercator\'s.'
  ],
  derivation: {
    title: 'Why the spacing is a power of the tangent',
    intro: 'The scales along the parallel and along the meridian of a cone map with cone constant $n$ and radius function $\\rho(\\varphi)$:',
    steps: [
      { text: 'A parallel of length $R\\cos\\varphi$ per radian of longitude becomes an arc of length $n\\rho$; a meridian element $R\\,d\\varphi$ becomes $-d\\rho$ (it gets shorter as $\\varphi$ grows):', tex: 'k = \\frac{n\\rho}{R\\cos\\varphi}, \\qquad h = -\\frac{1}{R}\\frac{d\\rho}{d\\varphi}.' },
      { text: 'Parallels and meridians stay at right angles, so the map is conformal exactly when the two scales are equal, $h = k$:', tex: '\\frac{d\\rho}{\\rho} = -\\frac{n\\,d\\varphi}{\\cos\\varphi}.' },
      { text: 'The integral of $\\sec\\varphi$ is $\\ln\\tan(\\pi/4 + \\varphi/2)$ (the same one as in Mercator\'s map), so', tex: '\\ln\\rho = -n\\ln\\tan\\left(\\frac{\\pi}{4}+\\frac{\\varphi}{2}\\right) + \\text{const}, \\qquad \\rho = \\frac{C}{\\tan^{\\,n}(\\pi/4+\\varphi/2)}.' },
      { text: 'Make the scale 1 on the first standard parallel, $k(\\varphi_1) = 1$, i.e. $\\rho_1 = R\\cos\\varphi_1/n$:', tex: 'C = \\frac{R\\cos\\varphi_1\\,\\tan^{\\,n}(\\pi/4+\\varphi_1/2)}{n}.' },
      { text: 'Make it 1 on the second, $\\rho_2 = R\\cos\\varphi_2/n$, and divide the two radii; taking logarithms leaves $n$:', tex: 'n = \\frac{\\ln(\\cos\\varphi_1/\\cos\\varphi_2)}{\\ln\\left[\\tan(\\pi/4+\\varphi_2/2)/\\tan(\\pi/4+\\varphi_1/2)\\right]}.' }
    ],
    outro: 'For one standard parallel the same argument gives $n = \\sin\\varphi_1$ (the tangent cone).'
  },
  formulas: [
    {
      name: 'Cone constant of the conformal conic',
      expr: 'n = ln(cos(phi1)/cos(phi2))/ln(tan(pi/4 + phi2/2)/tan(pi/4 + phi1/2))',
      tex: 'n = \\frac{\\ln(\\cos\\varphi_1/\\cos\\varphi_2)}{\\ln\\left[\\tan(\\pi/4+\\varphi_2/2)/\\tan(\\pi/4+\\varphi_1/2)\\right]}',
      vars: { n: { name: 'cone constant' }, phi1: { name: 'first standard parallel', q: 'angle', unit: '°', value: 33, min: 1, max: 80, tex: '\\varphi_1' }, phi2: { name: 'second standard parallel', q: 'angle', unit: '°', value: 45, min: 2, max: 85, tex: '\\varphi_2' } },
      solveFor: 'n',
      note: 'For 33° and 45°, n = 0.6305; for parallels close together n tends to sin of their mean; for 0° and 90° it would be 1 — the stereographic map.'
    },
    {
      name: 'Distance of a parallel from the apex',
      expr: 'rho = R*F/tan(pi/4 + phi/2)^n',
      tex: '\\rho = \\frac{R\\,F}{\\tan^{\\,n}(\\pi/4 + \\varphi/2)}',
      vars: { rho: { name: 'distance of the parallel from the apex', q: 'length', unit: 'mm', tex: '\\rho' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, F: { name: 'constant F of the projection', value: 1.955, min: 0.5, max: 10 }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 60, signed: true, min: -30, max: 85, tex: '\\varphi' }, n: { name: 'cone constant', value: 0.6305, min: 0.1, max: 1 } },
      solveFor: 'rho',
      note: 'With the standard parallels 33° and 45° and R = 100 mm: 85.2 mm at 60°, 112.2 mm at 45°, 195.5 mm at the equator, 244.8 mm at 20° S.'
    },
    {
      name: 'Scale at a latitude',
      expr: 'k = n*rho/(R*cos(phi))',
      tex: 'k = \\frac{n\\,\\rho}{R\\cos\\varphi}',
      vars: { k: { name: 'scale (the same in every direction)' }, n: { name: 'cone constant', value: 0.6305, min: 0.1, max: 1 }, rho: { name: 'distance of the parallel from the apex', q: 'length', unit: 'mm', value: 85.22, tex: '\\rho' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 60, min: 0, max: 85, tex: '\\varphi' } },
      note: 'At 60° with standard parallels 33° and 45° the scale is 1.075: every length is 7.5 % too long and every area 15.5 % too large.'
    }
  ],
  examples: [
    {
      title: 'The parallel of 60° on a map of the United States',
      q: 'A conformal conic map has standard parallels 33° and 45° and is drawn with a globe of radius 100 mm (n = 0.6305, $RF$ = 195.50 mm). How far from the apex is the parallel of 60°, how large is the scale there, and what is the angle on the map between the central meridian and the meridian 20° away?',
      steps: [
        { text: 'The distance from the apex:', tex: '\\rho = \\frac{195.50}{\\tan^{0.6305}(45° + 30°)} = \\frac{195.50}{\\tan^{0.6305}75°} = \\frac{195.50}{3.7321^{0.6305}} = 85.2\\ \\text{mm}.' },
        { text: 'The scale along the parallel, which is also the scale along the meridian:', tex: 'k = \\frac{0.6305 \\times 85.22}{100\\cos 60°} = 1.075.' },
        'A distance measured along that parallel is therefore 7.5 % too long and an area there 15.5 % too large.',
        { text: 'The meridian 20° away is turned', tex: 'n\\lambda = 0.6305 \\times 20° = 12.6°' },
        'from the central meridian, at the apex.'
      ],
      a: 'The parallel of 60° is 85.2 mm from the apex; the scale there is 1.075 in every direction; the meridian 20° away is 12.6° from the central one.'
    }
  ],
  quiz: [
    { q: 'What condition on the scales gives Lambert\'s spacing of the parallels?', choices: ['The scale along a meridian is 1', 'The scale along a parallel is 1 everywhere', 'The scale along the meridian equals the scale along the parallel at every latitude', 'The product of the two scales is 1'], a: 2, why: 'Equal scales in the two perpendicular directions make small figures similar: the conformal condition. A product of 1 is the equal-area condition, which gives Albers\' map.' },
    { q: 'On a conformal conic with standard parallels 33° and 45° the scale at 60° is 1.075. By what factor are areas there too large?', answer: 1.155, why: 'The scale is the same in all directions, so areas scale by its square: 1.075² = 1.155.' },
    { q: 'On the conformal conic the pole of the standard-parallel hemisphere is a single point at the apex, and the opposite pole is infinitely far away.', a: true, why: 'ρ ∝ tan^(−n)(45° + φ/2): it tends to 0 at φ = +90° and to infinity at φ = −90°, so the opposite hemisphere is stretched without limit.' },
    { q: 'As both standard parallels approach the pole, the Lambert conformal conic approaches', choices: ['the Mercator projection', 'the stereographic projection', 'the gnomonic projection', 'the equirectangular projection'], a: 1, why: 'n → 1, the fan opens through the whole circle, and the spacing tan^(−1)(45° + φ/2) is the stereographic radial scale.' },
    { q: 'Between the standard parallels the scale of a Lambert conformal conic is', choices: ['exactly 1', 'slightly below 1', 'slightly above 1', 'infinite'], a: 1, why: 'The secant cone lies inside the globe between the parallels, so the map is slightly too small there: about 0.995 at 39° for 33° and 45°.' }
  ],
  applications: [
    'Aeronautical charts: the ICAO world charts and the US sectional charts are Lambert conformal conics, so bearings read with a protractor are true and a straight line between airports is nearly the great circle.',
    'National and regional grids: France\'s Lambert-93 (standard parallels 44° and 49°), the US State Plane zones of east–west states, and the pan-European ETRS-LCC grid (35° and 65°) are all Lambert conformal conics.',
    'Weather models: the limited-area forecast models of the United States (such as the HRRR) and of several European services run on a Lambert conformal grid, so the grid squares are true squares and the map scale does not depend on direction.',
    'Topographic mapping of mid-latitude countries where the long axis lies east–west and where angles (bearings, intersections) matter.'
  ],
  history: 'Johann Heinrich Lambert published the conformal cone, with several other projections, in his *Anmerkungen und Zusätze zur Entwerfung der Land- und Himmelscharten* (1772). Gauss analysed conformal mapping in 1822. The French army adopted it for artillery maps in the First World War, and the State Plane Coordinate System of 1933 gave it to the United States for states that lie east–west.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapter on the Lambert conformal conic.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).', 'J. H. Lambert, *Anmerkungen und Zusätze zur Entwerfung der Land- und Himmelscharten* (1772; English translation by W. R. Tobler, 1972).'],
  sim: [{ id: 'co-conic-maps', params: { cone: 'lambert-conformal-conic' } }, { id: 'co-conic-scale', params: { cone: 'lambert-conformal-conic' } }],
  construction: 'co-lambert-conic'
},

{
  id: 'albers-equal-area-conic',
  parent: 'conic-family',
  title: 'Albers\' equal-area conic',
  level: 2,
  short: 'The conic map that keeps areas: the parallels are spaced so that the area between any two parallels is true, which makes the squared distance from the apex fall in equal steps of the sine of the latitude. The map of choice for thematic maps of a mid-latitude country.',
  keywords: ['Albers', 'equal-area conic', 'two standard parallels', 'thematic map', 'sin', 'conterminous United States', 'Lambert equal-area conic', 'NLCD'],
  prereq: ['conic-projections', 'equal-area-maps', 'scale-factor-and-standard-parallels'],
  related: ['lambert-conformal-conic', 'equidistant-conic-projection', 'lambert-cylindrical-equal-area', 'lambert-azimuthal-equal-area', 'bonne-projection'],
  body: `If what matters is how much of a country is forest, desert or farmland, the map must keep **areas**: any region must come out at its true area times one fixed factor. On a cone map with cone constant $n$ the scale along a parallel is $k = n\\rho/(R\\cos\\varphi)$ and the scale along a meridian is $h = -R^{-1}\\,d\\rho/d\\varphi$. The area scale is their product, because meridians and parallels cross at right angles, and equal-area means $hk = 1$. Integrating (see the derivation) gives the spacing rule
$$\\rho^2 = \\frac{R^2}{n^2}\\,\\big(C - 2n\\sin\\varphi\\big), \\qquad \\theta = n\\lambda .$$
The square of the distance from the apex falls by equal steps for equal steps of $\\sin\\varphi$, that is, of the height of the parallel above the equatorial plane. By Archimedes the area of a spherical zone is proportional to that height, so the zone between two parallels keeps its true area.

### Two standard parallels
Heinrich Albers (1805) put the scale at 1 on two parallels, $\\rho_i = R\\cos\\varphi_i/n$, which fixes the constants:
$$n = \\frac{\\sin\\varphi_1 + \\sin\\varphi_2}{2}, \\qquad C = \\cos^2\\varphi_1 + 2n\\sin\\varphi_1 .$$
For the standard parallels 29.5° and 45.5° of the conterminous United States, $n = 0.6028$ and $C = 1.3512$; for $R = 100$ the apex distances are 63.3 at the pole (an arc, not a point), 77.5 at 70°, 91.9 at 60°, 116.3 at 45.5°, 144.4 at 29.5°, 192.8 at the equator.

### What it keeps and loses
Areas are exact everywhere, so densities (people per square kilometre, tonnes per hectare) shown as shades are honest. Angles are not: the scale along the parallels is $k$, along the meridians $1/k$, so shapes are squashed by $k^2$ in the ratio of their axes, a little at the standard parallels and ever more away from them (at 60° the parallels are 11 % too long and the meridians 10 % too short). The meridians are straight lines through the apex and the parallels concentric arcs, as for every cone. Compared with [[lambert-conformal-conic|Lambert's conformal conic]], which has the same layout, the parallels are spaced more evenly and the pole is an arc, so the map can reach the pole region without the shapes exploding — at the price of angles.

### Drawing it by hand
The spacing is a square root, so the parallels are laid off from a table (see the construction): mark the radii down the central meridian from the apex, swing the arcs, draw the meridians at $n\\lambda$ with the protractor. A check with any two parallels and two meridians is a fan sector whose area is $\\tfrac12 n\\,\\Delta\\lambda\\,(\\rho_a^2 - \\rho_b^2)$, equal to $R^2\\Delta\\lambda\\,(\\sin\\varphi_b - \\sin\\varphi_a)$ on the globe.

> [!note] Lambert had the equal-area cone with one standard parallel in 1772; Albers added the second, as Delisle had done for the equidistant cone.`,
  ideas: [
    'The area scale is h·k; setting it to 1 gives ρ² = (R²/n²)(C − 2n sin φ): ρ² falls by equal steps for equal steps of sin φ.',
    'With two standard parallels n = (sin φ₁ + sin φ₂)/2 and C = cos² φ₁ + 2n sin φ₁.',
    'Areas are exact everywhere; shapes are squashed by the factor k on the parallels and 1/k on the meridians.',
    'The pole is an arc, not a point; the scale along the meridians is below 1 where the parallels are too long.',
    'The standard map for thematic data of mid-latitude countries: densities and areas can be read at a glance.'
  ],
  pitfalls: [
    'Equal-area means the shapes are right — No equal-area map can be conformal. The price is that the scale along the parallel and along the meridian differ: 1.108 and 0.902 at 60° here.',
    'Albers\' map is Lambert\'s conformal conic with another standard parallel — The two share the layout of straight meridians and concentric arcs, but the radii follow different rules (tan^(−n) against the square root of a sine), and so the spacing differs.',
    'The apex distance of the pole is zero — On the equal-area cone the pole is an arc of radius √(C − 2n)·R/n (63.3 mm in the example), because the pole is stretched into a line.'
  ],
  derivation: {
    title: 'Why ρ² is linear in sin φ',
    intro: 'Equal area on a cone map: the area scale is the product of the scale along the parallel and the scale along the meridian.',
    steps: [
      { text: 'As for any cone map,', tex: 'k = \\frac{n\\rho}{R\\cos\\varphi}, \\qquad h = -\\frac{1}{R}\\frac{d\\rho}{d\\varphi}.' },
      { text: 'Equal-area means $h\\,k = 1$:', tex: '-\\frac{n\\rho}{R^2\\cos\\varphi}\\frac{d\\rho}{d\\varphi} = 1 \\;\\Rightarrow\\; \\rho\\,d\\rho = -\\frac{R^2}{n}\\cos\\varphi\\,d\\varphi.' },
      { text: 'Integrate, writing the constant so that the formula comes out in a convenient form:', tex: '\\rho^2 = \\frac{R^2}{n^2}\\left(C - 2n\\sin\\varphi\\right).' },
      { text: 'The scale is 1 on both standard parallels, $\\rho_i = R\\cos\\varphi_i/n$, so $C - 2n\\sin\\varphi_i = \\cos^2\\varphi_i$ for $i = 1, 2$. Subtract:', tex: '2n(\\sin\\varphi_2 - \\sin\\varphi_1) = \\cos^2\\varphi_1 - \\cos^2\\varphi_2 = \\sin^2\\varphi_2 - \\sin^2\\varphi_1 \\;\\Rightarrow\\; n = \\frac{\\sin\\varphi_1 + \\sin\\varphi_2}{2}.' }
    ],
    outro: 'Then $C = \\cos^2\\varphi_1 + 2n\\sin\\varphi_1$. With one standard parallel the same argument gives $n = \\sin\\varphi_1$.'
  },
  formulas: [
    {
      name: 'Cone constant of the equal-area conic',
      expr: 'n = (sin(phi1) + sin(phi2))/2',
      tex: 'n = \\frac{\\sin\\varphi_1 + \\sin\\varphi_2}{2}',
      vars: { n: { name: 'cone constant' }, phi1: { name: 'first standard parallel', q: 'angle', unit: '°', value: 29.5, min: 0, max: 85, tex: '\\varphi_1' }, phi2: { name: 'second standard parallel', q: 'angle', unit: '°', value: 45.5, min: 0, max: 89, tex: '\\varphi_2' } },
      solveFor: 'n',
      note: 'For 29.5° and 45.5°, n = 0.6028. For two parallels symmetric about the equator n = 0 and the map becomes the cylindrical equal-area.'
    },
    {
      name: 'Distance of a parallel from the apex',
      expr: 'rho = R*sqrt(C - 2*n*sin(phi))/n',
      tex: '\\rho = \\frac{R}{n}\\sqrt{C - 2n\\sin\\varphi}',
      vars: { rho: { name: 'distance of the parallel from the apex', q: 'length', unit: 'mm', tex: '\\rho' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, C: { name: 'constant C = cos²φ₁ + 2n sin φ₁', value: 1.3512, min: 0.5, max: 4 }, n: { name: 'cone constant', value: 0.6028, min: 0.05, max: 1 }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 60, signed: true, min: -30, max: 90, tex: '\\varphi' } },
      solveFor: 'rho',
      note: 'With R = 100 mm: 91.9 mm at 60°, 116.3 mm at 45.5°, 192.8 mm at the equator.'
    },
    {
      name: 'Scale along the parallel',
      expr: 'k = n*rho/(R*cos(phi))',
      tex: 'k = \\frac{n\\,\\rho}{R\\cos\\varphi}',
      vars: { k: { name: 'scale along the parallel (the scale along the meridian is 1/k)' }, n: { name: 'cone constant', value: 0.6028, min: 0.05, max: 1 }, rho: { name: 'distance of the parallel from the apex', q: 'length', unit: 'mm', value: 91.92, tex: '\\rho' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 60, min: 0, max: 89, tex: '\\varphi' } },
      note: 'At 60° the parallels are drawn 11 % too long and the meridians 10 % too short: a circle of the globe becomes an ellipse of axis ratio 1.23, with the same area.'
    }
  ],
  examples: [
    {
      title: 'A circle becomes an ellipse',
      q: 'On the Albers map with standard parallels 29.5° and 45.5° (R = 100 mm), what are the distances from the apex of the parallels of 60° and 70°, the scales along the parallel and along the meridian at 60°, and the area scale?',
      steps: [
        { text: 'With $n = 0.6028$ and $C = 1.3512$:', tex: '\\rho_{60} = \\frac{100}{0.6028}\\sqrt{1.3512 - 2(0.6028)\\sin 60°} = 165.9 \\times 0.5541 = 91.9\\ \\text{mm},' },
        { text: 'and in the same way', tex: '\\rho_{70} = 165.9\\sqrt{1.3512 - 1.2056 \\times 0.9397} = 77.5\\ \\text{mm}.' },
        { text: 'The scale along the parallel at 60°:', tex: 'k = \\frac{0.6028 \\times 91.92}{100\\cos 60°} = 1.108.' },
        { text: 'The equal-area condition gives the scale along the meridian without more work:', tex: 'h = 1/k = 0.902.' },
        'The area scale is $hk = 1$. A little circle of the globe becomes an ellipse with axes in the ratio $k/h = 1.23$ (east–west long), of the same area.'
      ],
      a: 'The parallels of 60° and 70° lie 91.9 mm and 77.5 mm from the apex; at 60° the scale is 1.108 along the parallel and 0.902 along the meridian, the area scale 1.'
    }
  ],
  quiz: [
    { q: 'Which quantity falls by equal steps for equal steps of sin φ on the Albers map?', choices: ['the distance ρ of the parallel from the apex', 'the square of that distance, ρ²', 'the angle between meridians', 'the scale along the parallel'], a: 1, why: 'ρ² = (R²/n²)(C − 2n sin φ) is linear in sin φ. This is what Archimedes\' result on the area of zones requires: zone area is proportional to the height R sin φ.' },
    { q: 'For standard parallels 29.5° and 45.5° the cone constant is', answer: 0.603, why: 'n = (sin 29.5° + sin 45.5°)/2 = (0.4924 + 0.7133)/2 = 0.6028.' },
    { q: 'On an Albers map the scale along the parallel at some latitude is 1.2. The scale along the meridian there is', answer: 0.833, why: 'The area scale hk = 1, so h = 1/1.2 = 0.833: the equal-area condition makes the two scales reciprocals.' },
    { q: 'An equal-area conic map can also be conformal if the standard parallels are chosen well.', a: false, why: 'Both together would make the scale the same in all directions and equal to 1 everywhere, which is an isometry; the sphere is not flat, so no such map exists (Gauss\'s theorem).' },
    { q: 'The pole of an Albers map is', choices: ['the apex of the fan', 'an arc of a circle about the apex', 'a straight line', 'at infinity'], a: 1, why: 'The pole\'s distance from the apex is R√(C − 2n)/n, not zero: the point is spread out into an arc, one of the signs that the map cannot be conformal.' }
  ],
  applications: [
    'Thematic maps of the United States and other mid-latitude countries: census densities, election results by area, climate and land cover. The US national land-cover data and the conterminous US maps use standard parallels 29.5° and 45.5°.',
    'National mapping of countries whose long axis follows a parallel: Geoscience Australia\'s Albers grid (standard parallels 18° S and 36° S) is used for continent-wide data sets.',
    'Statistics and environmental modelling, where an area computed on the map must equal the area on the ground (land cover, habitat, deforestation, crop acreage).',
    'Teaching the trade-off: a clear demonstration that an equal-area map shears shapes, because the parallels at 60° are stretched 11 % and the meridians shrunk 10 %.'
  ],
  history: 'Lambert gave an equal-area cone in 1772; Heinrich Christian Albers added the second standard parallel in a paper of 1805, in the journal of Franz Xaver von Zach. The United States Geological Survey has used it for its maps of the conterminous states, and it has become the standard for thematic data of mid-latitude countries.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapter on the Albers equal-area conic.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).', 'H. C. Albers, "Beschreibung einer neuen Kegelprojection", *Monatliche Correspondenz* 12 (1805).'],
  sim: [{ id: 'co-conic-maps', params: { cone: 'albers' } }, { id: 'co-conic-scale', params: { cone: 'albers' } }],
  construction: 'co-albers-conic'
},

{
  id: 'polyconic-projection',
  parent: 'conic-family',
  title: 'The polyconic projection',
  level: 2,
  short: 'A cone for every parallel: each parallel is the true-length arc of its own tangent cone, so the parallels are circular arcs with centres strung out along the central meridian. True along the central meridian and along every parallel, excellent in a narrow strip, and the map of the American coast and of the US topographic quadrangles for a century.',
  keywords: ['polyconic', 'Hassler', 'American polyconic', 'Coast Survey', 'quadrangle', 'tangent cones', 'true length', 'central meridian', 'non-concentric arcs'],
  prereq: ['conic-projections', 'developable-surfaces', 'scale-factor-and-standard-parallels'],
  related: ['bonne-projection', 'equidistant-conic-projection', 'transverse-mercator-and-utm', 'surveys-and-national-grids'],
  body: `A single cone can be true along only one or two parallels. The **polyconic** (many cones) gives *every* parallel its own cone: the cone tangent along that parallel, touching the globe round it like a hat. Unrolled, that cone is a fan whose arc is the parallel itself, a circular arc of radius $R\\cot\\varphi$, with its centre on the polar axis, $R\\cot\\varphi$ above the parallel. Each parallel is drawn at its **true length**. The parallels are therefore arcs of **non-concentric circles**, with their centres strung out along the central meridian.

### The formulas
The central meridian is straight and true to scale: the parallel of latitude $\\varphi$ crosses it at $y = R\\varphi$. On its own arc a point of longitude $\\lambda$ lies at the true arc length $R\\lambda\\cos\\varphi$ from the central meridian, which on an arc of radius $R\\cot\\varphi$ is an angle $E = R\\lambda\\cos\\varphi / (R\\cot\\varphi)$ seen from the centre:
$E = \\lambda\\sin\\varphi, \\qquad x = R\\cot\\varphi\\,\\sin E, \\qquad y = R\\varphi + R\\cot\\varphi\\,(1 - \\cos E).$
The equator is the limit $\\varphi \\to 0$: a straight line with $x = R\\lambda$, $y = 0$. The centres of the arcs lie at the heights $R\\varphi + R\\cot\\varphi$ on the central meridian; with $R = 100$ they are at 309.6, 189.0 and 162.4 for the parallels of 20°, 40° and 60°.

### What it keeps and loses
The scale is 1 along the central meridian and along every parallel. Away from the central meridian the meridians swing outwards and cross the parallels at angles other than 90°: 86.9° at 60° of longitude from the central meridian and latitude 40°, 84.2° at 90° of longitude and 60° of latitude. The map is neither conformal nor equal-area, and the error grows quickly with the distance from the central meridian (at 90° from it the area scale at 60° is already 1.26). Within a strip a few degrees wide, however, the distortion is imperceptible, which is what the map sheets of a survey need.

### Why it was used
The formulas use only sines and cosines of the latitude and of the product $\\lambda\\sin\\varphi$, so a computing office could print a *table* of $x$ and $y$ for every minute of latitude and difference of longitude, and a draughtsman could plot the corners of a map sheet with a beam compass. The price: sheets that use different central meridians do not fit together edge to edge, so a continuous mosaic of the polyconic is impossible. When surveys moved to continuous grids (the UTM and State Plane), the polyconic gave way to them.

### Drawing it by hand
The side view of the globe gives each cone: the tangent at the parallel meets the axis at the apex, and its length from the point of contact is the radius of the arc. Carry that length up the central meridian from the parallel to find the centre, swing the arc, step the true length of 30° of longitude along it with dividers, and trace the meridians through the points with a flexible curve.

> [!tip] Look at the 20° parallel in the construction: its centre lies 310 units up the sheet, so the arc is almost straight. The nearer a parallel is to the pole, the smaller the cone and the sharper the arc.`,
  ideas: [
    'Each parallel is the arc of its own tangent cone: radius R cot φ, centre on the central meridian at the height Rφ + R cot φ.',
    'The central meridian is straight and true to scale; every parallel is drawn at its true length; the equator is a straight line.',
    'A point of longitude λ on the parallel φ is at the angle E = λ sin φ from the vertical through the centre of its arc.',
    'The map is neither conformal nor equal-area; the distortion grows with the distance from the central meridian, so it suits narrow strips.',
    'Sheets with different central meridians do not fit together; that and the arrival of continuous grids ended its use.'
  ],
  pitfalls: [
    'The polyconic is a conic projection with several standard parallels — The standard parallel is a property of one cone; here every parallel is a standard parallel, each on its own cone, and the arcs are not concentric.',
    'The meridians of the polyconic are straight lines — Only the central meridian is. The others are curves that bend away from it, and they cross the parallels obliquely.',
    'True length of the parallels makes the map equidistant — Only the central meridian and the parallels are true. A line in any other direction, or a meridian away from the central one, is not.'
  ],
  formulas: [
    {
      name: 'Radius of the arc of a parallel',
      expr: 'r = R/tan(phi)',
      tex: 'r = \\frac{R}{\\tan\\varphi}',
      vars: { r: { name: 'radius of the parallel\'s arc on the map', q: 'length', unit: 'mm' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, phi: { name: 'latitude of the parallel', q: 'angle', unit: '°', value: 40, min: 2, max: 88, tex: '\\varphi' } },
      note: 'The length of the tangent from the parallel to the polar axis in the side view of the globe. It is 274.7 mm for 20°, 119.2 mm for 40°, 57.7 mm for 60° (R = 100 mm).'
    },
    {
      name: 'Height of the centre of the arc',
      expr: 'yc = R*(phi + 1/tan(phi))',
      tex: 'y_c = R\\left(\\varphi + \\cot\\varphi\\right)',
      vars: { yc: { name: 'height of the centre above the equator on the central meridian', q: 'length', unit: 'mm', tex: 'y_c' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, phi: { name: 'latitude of the parallel', q: 'angle', unit: '°', value: 40, min: 2, max: 80, tex: '\\varphi' } },
      note: 'The parallel crosses the central meridian at R φ (true arc length), and its centre lies a further R cot φ above.'
    },
    {
      name: 'Horizontal position of a point',
      expr: 'x = R*sin(lam*sin(phi))/tan(phi)',
      tex: 'x = R\\cot\\varphi\\,\\sin(\\lambda\\sin\\varphi)',
      vars: { x: { name: 'distance from the central meridian', q: 'length', unit: 'mm' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, lam: { name: 'longitude from the central meridian', q: 'angle', unit: '°', value: 30, min: 0, max: 120, tex: '\\lambda' }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 40, min: 10, max: 85, tex: '\\varphi' } },
      note: 'For 30° E and 40° N with R = 100 mm, x = 39.4 mm and (with y = Rφ + R cot φ (1 − cos E)) y = 76.5 mm.'
    }
  ],
  examples: [
    {
      title: 'The point 30° E, 40° N',
      q: 'On a polyconic map with a globe of radius 100 mm, where is the point 30° east of the central meridian on the parallel of 40° N? How long is that parallel between the central meridian and the point?',
      steps: [
        { text: 'The arc of the parallel has radius and centre height', tex: 'R\\cot 40° = 119.2\\ \\text{mm}, \\qquad y_c = R\\varphi + R\\cot\\varphi = 69.8 + 119.2 = 189.0\\ \\text{mm}.' },
        { text: 'The angle at the centre:', tex: 'E = \\lambda\\sin\\varphi = 30° \\times 0.6428 = 19.28°.' },
        { text: 'The position:', tex: 'x = 119.2\\sin 19.28° = 39.4\\ \\text{mm}, \\qquad y = 69.8 + 119.2\\,(1 - \\cos 19.28°) = 76.5\\ \\text{mm}.' },
        { text: 'The length of the arc, which must be the true length of 30° of the parallel of 40°:', tex: '119.2 \\times E = 119.2 \\times 0.3365 = 40.1\\ \\text{mm} = R\\cos 40° \\times \\pi/6.' }
      ],
      a: 'The point is 39.4 mm to the right of and 76.5 mm above the equator\'s point on the central meridian; the arc to it is 40.1 mm, the true length.'
    }
  ],
  quiz: [
    { q: 'Why are the parallels of the polyconic arcs of non-concentric circles?', choices: ['Each parallel is carried by its own tangent cone, whose apex is at a different height on the axis', 'The meridians are curved', 'The parallels are not true length', 'The projection is conformal'], a: 0, why: 'The cone tangent at latitude φ has its apex R / sin φ from the centre, a different point for every φ. Unrolled, each parallel is an arc about its own apex, so the centres are strung out along the central meridian.' },
    { q: 'On the polyconic map the equator is', choices: ['a circular arc of radius R', 'a straight line', 'a sine curve', 'a circle about the north pole'], a: 1, why: 'The cone tangent along the equator is a cylinder: its apex is at infinity and the unrolled parallel is a straight line of length 2πR.' },
    { q: 'What is the radius of the arc of the 30° parallel on a polyconic map with R = 100 mm?', answer: 173.2, unit: 'mm', why: 'R cot 30° = 100 × 1.7321 = 173.2 mm.' },
    { q: 'On the polyconic every parallel is drawn at its true length.', a: true, why: 'On its arc the point of longitude λ is placed at R λ cos φ of true arc length from the central meridian, which is the length of the parallel on the globe.' },
    { q: 'What stopped the polyconic from being used for continuous mapping of a large country?', choices: ['The projection cannot be computed', 'Sheets with different central meridians do not fit edge to edge', 'The scale on the central meridian is wrong', 'It is conformal only at the equator'], a: 1, why: 'Each sheet is computed about its own central meridian; neighbours then disagree at their common edge, and the error grows with the distance between the central meridians.' }
  ],
  applications: [
    'The United States Coast Survey\'s charts and, from the 1880s until the 1950s, the USGS topographic quadrangle maps (1:62,500 and 1:24,000): a sheet only a few degrees across lies in the strip where the distortion is negligible.',
    'Georeferencing old American maps: many charts and quadrangles are polyconic, and knowing that is the first step to placing a scanned sheet correctly on a modern map.',
    'Maps of narrow north–south strips such as long thin countries along one meridian, where the central meridian can be put in the middle.',
    'Tabulated mapping: the polyconic tables of the Coast Survey are among the earliest examples of a projection delivered as a lookup table for a drawing office.'
  ],
  history: 'Ferdinand Rudolph Hassler, the Swiss-born founder of the United States Coast Survey, proposed the polyconic in 1820 as the best projection for mapping a long coastline in sheets, and the Survey published tables for it from 1853. Its use for the topographic map of the United States lasted until the 1950s.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapter on the polyconic projection.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).', 'US Coast and Geodetic Survey, *Tables for a Polyconic Projection of Maps* (various editions from 1853).'],
  sim: ['co-polyconic-arcs'],
  construction: 'co-polyconic'
},

{
  id: 'bonne-projection',
  parent: 'conic-family',
  title: 'The Bonne projection',
  level: 2,
  short: 'An equal-area map built from a cone used only for its apex and central meridian: concentric arcs at their true spacing, each divided into its true lengths, with the meridians drawn through the points. The map of the old atlases and of the French and Swiss topographic series, with a heart-shaped world outline.',
  keywords: ['Bonne', 'pseudoconic', 'equal-area', 'heart-shaped', 'cordiform', 'Sylvanus', 'Dufour', 'État-Major', 'true spacing', 'divided truly'],
  prereq: ['conic-projections', 'equal-area-maps', 'equidistant-conic-projection'],
  related: ['werner-cordiform', 'sinusoidal-projection', 'polyconic-projection', 'albers-equal-area-conic', 'tissot-indicatrix'],
  body: `Take the cone tangent at one parallel $\\varphi_1$, but use it for only two things: the **apex** and the **central meridian**. Draw the parallels as concentric arcs about the apex, at their true distance apart along the central meridian (as in the [[equidistant-conic-projection|equidistant conic]]); then divide **each arc into its true lengths**: 30° of longitude on the parallel $\\varphi$ is $R\\cos\\varphi\\cdot\\pi/6$, wherever that parallel lies on the map. Join the points of equal longitude and the meridians come out as curves, converging at the pole. That is Bonne's projection.

### The formulas
The parallel $\\varphi$ is the arc of radius $\\rho = R(\\cot\\varphi_1 + \\varphi_1 - \\varphi)$ about the apex; a point at longitude $\\lambda$ on it is at the true arc length $R\\lambda\\cos\\varphi$ from the central meridian, an angle $E = R\\lambda\\cos\\varphi/\\rho$. So
$x = \\rho\\sin E,\\qquad y = R\\cot\\varphi_1 - \\rho\\cos E,\\qquad E = \\frac{R\\,\\lambda\\cos\\varphi}{\\rho}.$
The origin is the point where the central meridian crosses the standard parallel. At the pole $\\rho = R(\\cot\\varphi_1 + \\varphi_1 - \\pi/2)$ and $E = 0$: the pole is a single point on the central meridian. Move the standard parallel to the equator ($\\varphi_1 \\to 0$) and the arcs straighten into the [[sinusoidal-projection|sinusoidal]] map; move it to the pole ($\\varphi_1 = 90°$) and you have [[werner-cordiform|Werner's heart]].

### Why it is equal-area
Between two nearby parallels the band has the true width $R\\,d\\varphi$ (the arcs are spaced truly), and along the band the points are spaced at true lengths. A small piece of the band between two meridians is a quadrilateral with the right base and the right height, so it has the right area, though it is sheared. Add up the pieces and every region has its true area.

### What it keeps and loses
Along the central meridian and the standard parallel there is no distortion at all: the meridian and parallel cross at right angles and both scales are 1. Elsewhere the shear grows with the distance from them: the meridians cross the parallels at 79° at (60° E, 30° N) for the 45° standard parallel, and at 64° at (150° E, 60° N), where a small circle of the globe becomes an ellipse with axes in the ratio 1.6 : 1. The world fits into a heart whose lobes hang out round the north pole. For a country or a continent that lies about the standard parallel — the whole of Asia, or of Europe — the shear stays moderate.

### Drawing it by hand
Find the apex with the set square on a side view of the globe, carry the slant length up the central meridian, lay off the parallels by the dividers (R times the latitude step), swing the arcs, step off the true lengths of 30° of longitude along each arc on both sides, and trace the meridians with a flexible curve — as in the construction below.

> [!fact] Switzerland's Dufour map (1845–65) and France's État-Major map (1818–66), the first national topographic series of the two countries, were drawn on Bonne's projection in a modified form (the Swiss one centred on Bern): one central meridian through the middle of the country served all the sheets.`,
  ideas: [
    'The cone supplies only the apex and the central meridian; the parallels are concentric arcs at their true spacing, each divided into its true lengths.',
    'ρ = R(cot φ₁ + φ₁ − φ), E = Rλ cos φ/ρ, x = ρ sin E, y = R cot φ₁ − ρ cos E.',
    'The map is equal-area, because each band has the true width and each piece of it the true length; shapes are sheared away from the central meridian and the standard parallel.',
    'A standard parallel at the equator gives the sinusoidal map; at the pole, Werner\'s heart.'
  ],
  pitfalls: [
    'Bonne\'s is a conic projection, so the meridians are straight — Only the central meridian is. The other meridians are curves, because each parallel is divided truly; the cone is used only for the apex.',
    'Equal-area means shapes are right near the pole — Near the pole the shear is large: the meridians meet at a point at varying angles and the map is as sheared there as at the edges.',
    'The standard parallel can be anywhere — It is the only parallel without shear, and the map is best for regions that lie about it; a map of Europe wants about 45°, a map of the whole world wants a different projection.'
  ],
  formulas: [
    {
      name: 'Distance of a parallel from the apex',
      expr: 'rho = R*(1/tan(phi1) + phi1 - phi)',
      tex: '\\rho = R\\left(\\cot\\varphi_1 + \\varphi_1 - \\varphi\\right)',
      vars: { rho: { name: 'distance of the parallel from the apex', q: 'length', unit: 'mm', tex: '\\rho' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, phi1: { name: 'standard parallel', q: 'angle', unit: '°', value: 45, min: 5, max: 85, tex: '\\varphi_1' }, phi: { name: 'latitude of the parallel', q: 'angle', unit: '°', value: 30, signed: true, min: -80, max: 90, tex: '\\varphi' } },
      solveFor: 'rho',
      note: 'The arcs are spaced at the true distance, R times the difference in latitude, from the standard parallel: with R = 100 mm and φ₁ = 45°, the 30° parallel is 126.2 mm from the apex.'
    },
    {
      name: 'Angle of a point on its arc',
      expr: 'E = lam*cos(phi)/(1/tan(phi1) + phi1 - phi)',
      tex: 'E = \\frac{\\lambda\\cos\\varphi}{\\cot\\varphi_1 + \\varphi_1 - \\varphi}',
      vars: { E: { name: 'angle at the apex from the central meridian', q: 'angle', unit: '°', signed: true }, lam: { name: 'longitude from the central meridian', q: 'angle', unit: '°', value: 60, signed: true, min: -180, max: 180, tex: '\\lambda' }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 30, signed: true, min: -80, max: 85, tex: '\\varphi' }, phi1: { name: 'standard parallel', q: 'angle', unit: '°', value: 45, min: 5, max: 85, tex: '\\varphi_1' } },
      solveFor: 'E',
      note: 'Equal to the true length of the parallel up to the point, R λ cos φ, divided by the radius ρ of the arc. For 60° E, 30° N and φ₁ = 45° it is 41.2°.'
    },
    {
      name: 'True length of the parallel',
      expr: 's = R*lam*cos(phi)',
      tex: 's = R\\,\\lambda\\cos\\varphi',
      vars: { s: { name: 'arc length from the central meridian along the parallel', q: 'length', unit: 'mm' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, lam: { name: 'longitude difference', q: 'angle', unit: '°', value: 30, min: 0, max: 180, tex: '\\lambda' }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 45, min: 0, max: 89, tex: '\\varphi' } },
      note: 'What the dividers are set to when stepping along the arc of the parallel: 30° of longitude is 52.4 mm at the equator, 37.0 mm at 45°, 26.2 mm at 60°.'
    }
  ],
  examples: [
    {
      title: 'A point of the Bonne map',
      q: 'On the Bonne map with standard parallel 45° and a globe of radius 100 mm, where is the point 60° E, 30° N? The origin is the point where the central meridian crosses the 45° parallel.',
      steps: [
        { text: 'The parallel of 30° is at', tex: '\\rho = 100\\left(1 + 0.7854 - 0.5236\\right) = 126.18\\ \\text{mm}' },
        'from the apex, which lies 100 mm above the origin.',
        { text: 'The angle at the apex for 60° of longitude along that parallel:', tex: 'E = \\frac{100 \\times 1.0472 \\times 0.8660}{126.18} = 0.7188\\ \\text{rad} = 41.18°.' },
        { text: 'The coordinates:', tex: 'x = 126.18\\sin 41.18° = 83.1\\ \\text{mm}, \\qquad y = 100 - 126.18\\cos 41.18° = 5.0\\ \\text{mm}.' },
        'The angle between meridian and parallel at the point is 79°: the map is sheared there, but the area is exact.'
      ],
      a: 'The point is 83.1 mm to the right of and 5.0 mm above the origin; the meridian crosses the parallel at 79°.'
    }
  ],
  quiz: [
    { q: 'What is divided into true lengths in Bonne\'s construction?', choices: ['the central meridian only', 'each parallel arc, from the central meridian outwards', 'the meridians at the equator', 'only the standard parallel'], a: 1, why: 'Every parallel is divided into the true length R cos φ per radian of longitude, which is why the meridians come out curved, and why the area is true.' },
    { q: 'With the standard parallel moved to the equator, the Bonne map becomes', choices: ['Werner\'s heart', 'the sinusoidal projection', 'the polyconic', 'the Mercator projection'], a: 1, why: 'The apex goes to infinity, the arcs become straight horizontals at the true spacing, and each is divided truly: the sinusoidal projection.' },
    { q: 'The Bonne map is conformal near the standard parallel.', a: false, why: 'It is equal-area. Only on the central meridian and the standard parallel are meridian and parallel at right angles with the scale 1 both ways; everywhere else the figures are sheared.' },
    { q: 'How far from the apex is the parallel of 60° for a Bonne map with φ₁ = 45° and R = 100 mm?', answer: 73.8, unit: 'mm', why: 'ρ = 100 × (1 + 0.7854 − 1.0472) = 73.8 mm.' },
    { q: 'Which is true of the pole on a Bonne map?', choices: ['It is a point on the central meridian', 'It is an arc about the apex', 'It is a line equal to the equator', 'It cannot be drawn'], a: 0, why: 'At φ = 90° the true length of the parallel is zero, so the pole is the single point of the central meridian at distance R(cot φ₁ + φ₁ − π/2) from the apex.' }
  ],
  applications: [
    'The topographic series of France (the État-Major map, 1818–66) and Switzerland (the Dufour map, 1845–65), whose sheets are drawn on Bonne\'s projection or a modification of it: every sheet is measurable for area.',
    'Atlas maps of continents and countries with a clear central meridian — Asia, Africa, Europe in the nineteenth-century atlases — where an equal-area map with a familiar shape was wanted.',
    'Heart-shaped world maps: the cordiform world map of the sixteenth century, and the modern puzzle of an equal-area world with a pole at the centre.',
    'Teaching the trade-off of equal-area maps: the same map shows no distortion on its standard parallel and a strong shear in the corners.'
  ],
  history: 'Heart-shaped (cordiform) maps in this spirit appear in the early sixteenth century (Bernardus Sylvanus, 1511, and Johannes Stabius and Johannes Werner a few years later). Rigobert Bonne, engineer-hydrographer of the French navy, used the general form with a standard parallel in 1752, and the name stuck. The French and Swiss national surveys took it for their first topographic maps.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapter on the Bonne projection.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).', 'Arthur H. Robinson and others, *Elements of Cartography* (6th ed., 1995).'],
  sim: ['co-bonne-werner'],
  construction: 'co-bonne-graticule'
},

{
  id: 'werner-cordiform',
  parent: 'conic-family',
  title: 'Werner\'s heart-shaped map',
  level: 1,
  short: 'Bonne\'s map with the north pole as the centre of everything: concentric circles about the pole at their true spacing, each divided into its true lengths, so that the world is an equal-area heart with a cusp at the pole. The projection of the Renaissance world maps of Werner, Dürer and Mercator.',
  keywords: ['Werner', 'cordiform', 'heart-shaped', 'Stabius', 'Dürer', 'Finé', 'Mercator', 'equal-area', 'pseudoconic', 'north pole'],
  prereq: ['bonne-projection', 'conic-projections', 'equal-area-maps'],
  related: ['azimuthal-equidistant-projection', 'sinusoidal-projection', 'ancient-world-maps', 'mercator-1569'],
  body: `The Renaissance world map of 1514 was a heart. Johannes Werner of Nuremberg wanted a single sheet showing the whole earth with the proportions right, and found it by putting the **north pole in the centre**: the parallels are circles about the pole at their true distance from it, and on each circle the longitudes are marked at their true lengths. This is [[bonne-projection|Bonne's projection]] with the standard parallel moved to the pole, $\\varphi_1 = 90°$, so that the cone is flat and the apex is the pole itself.

### The formulas
The parallel $\\varphi$ is a circle of radius $\\rho = R(\\pi/2 - \\varphi)$ about the pole, the true distance from the pole along a meridian. A point of longitude $\\lambda$ on it is at the true arc length $R\\lambda\\cos\\varphi$ from the central meridian, an angle $E = R\\lambda\\cos\\varphi/\\rho$ at the pole, so
$x = \\rho\\sin E,\\qquad y = -\\rho\\cos E,\\qquad E = \\frac{\\lambda\\cos\\varphi}{\\pi/2 - \\varphi}.$
The equator is a circle of radius $\\pi R/2 = 157.1$ for $R = 100$; the south pole, at $\\rho = \\pi R = 314.2$, is the single point at the bottom of the central meridian. Near the north pole $\\cos\\varphi \\approx \\pi/2 - \\varphi$, so $E \\to \\lambda$: close to the pole the map is the polar [[azimuthal-equidistant-projection|azimuthal equidistant]] map, with the meridians evenly spread.

### The shape of the world
Put in all the longitudes, $-180° \\le \\lambda \\le 180°$: the meridians $\\pm 180°$ form the outline. Starting at the south pole, a point, the outline swings out to its widest, about 2.0 R either side, between 30° and 35° S, passes the equator and climbs; near the north pole each side leaves the pole straight upward, bends over and comes back down, so the outline ends in the two lobes of a heart with a cusp at the pole. That shape is the sign of the map: the lobes at the top are the part of the world where east and west lie closest together, spread out by the stretching of the circles near the pole.

### What it keeps and loses
The map is equal-area (each piece of a band has the true width and length) and true in distance from the north pole and along the central meridian. Elsewhere the shear is severe: the farther from the central meridian and the farther south, the more sheared the shapes. It is a map with one centre, the north pole, and a view of the world designed around the northern lands where the readers of the sixteenth century lived.

### Drawing it by hand
The simplest of the conic-family constructions: put a point for the pole at the top of the sheet; step the true length of 15° of a meridian, 26.2 for $R = 100$, down the central meridian repeatedly; draw circles about the pole through the marks; step the true length of 30° of longitude along each circle, left and right; trace the meridians through the points.

> [!history] Johannes Stabius had used the projection about 1500; Werner published it in 1514 in his edition of Ptolemy, and the woodcut world map of 1515 by Dürer and Stabius made it famous. Oronce Finé (1531) and Mercator (1538) drew the world on two hearts, one for each hemisphere.`,
  ideas: [
    'Bonne\'s map with the standard parallel at the pole: the parallels are circles about the pole at ρ = R(π/2 − φ), each divided into its true lengths.',
    'The angle at the pole is E = λ cos φ / (π/2 − φ), which tends to λ near the pole: close to the pole the map is the polar azimuthal equidistant map.',
    'Equal-area and true in distance from the pole; severely sheared away from the central meridian and towards the south.',
    'The whole world lies inside a heart-shaped outline with a cusp at the north pole and the south pole as a point.'
  ],
  pitfalls: [
    'Werner\'s heart is a decorative shape chosen by the Renaissance mapmakers — It comes straight out of the mathematics: with every parallel divided truly and the pole in the centre, the outline of the whole world is a heart.',
    'Distances from the pole are true, so the map is azimuthal — The circles are right and the meridian directions are not: only near the pole do the bearings from the pole come out true.',
    'The south pole is a circle, like the north pole\'s neighbours — On the map the south pole is a single point at the bottom of the central meridian, the true length of the parallel being zero there.'
  ],
  formulas: [
    {
      name: 'Distance of a parallel from the pole',
      expr: 'rho = R*(pi/2 - phi)',
      tex: '\\rho = R\\left(\\frac{\\pi}{2} - \\varphi\\right)',
      vars: { rho: { name: 'distance of the parallel from the pole', q: 'length', unit: 'mm', tex: '\\rho' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 30, signed: true, min: -90, max: 90, tex: '\\varphi' } },
      solveFor: 'rho',
      note: 'The true meridian distance from the pole: 26.2 mm for each 15° when R = 100 mm; the equator is 157.1 mm away and the south pole 314.2 mm.'
    },
    {
      name: 'Angle at the pole of a point on its circle',
      expr: 'E = lam*cos(phi)/(pi/2 - phi)',
      tex: 'E = \\frac{\\lambda\\cos\\varphi}{\\pi/2 - \\varphi}',
      vars: { E: { name: 'angle at the pole from the central meridian', q: 'angle', unit: '°', signed: true }, lam: { name: 'longitude from the central meridian', q: 'angle', unit: '°', value: 60, signed: true, min: -180, max: 180, tex: '\\lambda' }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 30, signed: true, min: -85, max: 85, tex: '\\varphi' } },
      solveFor: 'E',
      note: 'On the equator 180° of longitude is E = 2 rad = 114.6°; at 60° N it is 3.0 rad = 172°: the circles near the pole are almost complete.'
    }
  ],
  examples: [
    {
      title: 'Three points of the heart',
      q: 'On a Werner map drawn with a globe of radius 100 mm, where are the points (60° E, 30° N), (180° E, 0°) and the south pole, measured from the north pole at the top with the central meridian running down the sheet?',
      steps: [
        { text: 'For (60° E, 30° N): the radius and the angle are', tex: '\\rho = 100\\,(\\pi/2 - \\pi/6) = 104.7\\ \\text{mm}, \\qquad E = \\frac{1.0472 \\times 0.8660}{1.0472} = 0.866\\ \\text{rad} = 49.6°.' },
        { text: 'so the position is', tex: 'x = 104.7\\sin 49.6° = 79.8\\ \\text{mm}, \\qquad y = -104.7\\cos 49.6° = -67.8\\ \\text{mm}.' },
        { text: 'For (180° E, 0°): $\\rho = 157.1$ mm, $E = \\pi/(\\pi/2) = 2$ rad = 114.6°, so', tex: 'x = 157.1\\sin 114.6° = 142.8\\ \\text{mm}, \\qquad y = -157.1\\cos 114.6° = +65.4\\ \\text{mm}:' },
        'the point lies above the level of the pole\'s next circles, on the lobe of the heart.',
        'The south pole is the point of the central meridian at $\\rho = \\pi R = 314.2$ mm: $(0, -314.2)$.'
      ],
      a: '(60° E, 30° N) at (79.8, −67.8) mm; (180° E, 0°) at (142.8, +65.4) mm; the south pole at (0, −314.2) mm.'
    }
  ],
  quiz: [
    { q: 'Werner\'s projection is Bonne\'s projection with the standard parallel at', choices: ['the equator', '45°', 'the pole', '30°'], a: 2, why: 'With φ₁ = 90° the cone is flat, the apex is the pole, and ρ = R(π/2 − φ).' },
    { q: 'How far from the north pole is the equator on a Werner map with R = 100 mm?', answer: 157.1, unit: 'mm', why: 'ρ = R × π/2 = 157.1 mm: the length of a quarter of a meridian.' },
    { q: 'Werner\'s map is conformal near the pole.', a: false, why: 'It is equal-area. Near the pole it resembles the polar azimuthal equidistant map, which is neither conformal nor equal-area, but the area scale of Werner\'s map is 1 everywhere.' },
    { q: 'The outline of the whole world on the Werner map, with the north pole at the top, is', choices: ['a circle', 'an ellipse', 'a heart with a cusp at the north pole', 'a square'], a: 2, why: 'The meridians ±180° are the outline; near the pole each leaves the pole straight upward and bends over into one of the two lobes.' },
    { q: 'Near the north pole of the Werner map, the angle at the pole of a meridian λ away from the central one is approximately', choices: ['λ', '2λ', 'λ/2', 'sin λ'], a: 0, why: 'E = λ cos φ/(π/2 − φ) → λ as φ → 90°: the map reduces to the polar azimuthal equidistant map.' }
  ],
  applications: [
    'The world maps of the sixteenth century: Dürer\'s and Stabius\' 1515 world map, Finé\'s double heart of 1531 and Mercator\'s of 1538, for sheets that could be printed and bound into atlases.',
    'Polar maps of the Arctic regions in which distances from the pole are wanted: the circles are exact and the area is right.',
    'Teaching: a quick, vivid way to show that a projection may be equal-area and still ruin the shapes.',
    'Posters and decorative maps: the heart-shaped world is a favourite, because it is a good-looking use of the formula.'
  ],
  history: 'Johannes Stabius of Vienna and Nuremberg used a heart-shaped projection about 1500; the Nuremberg priest and mathematician Johannes Werner published it in 1514 in his *Nova translatio primi libri geographiae Cl. Ptolemaei*, and the woodcut world map of 1515 by Dürer and Stabius made it widely known. Oronce Finé (1531) and Mercator (1538) used a double heart, one for each hemisphere. Bonne generalised it two centuries later.',
  sources: ['John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993), the chapter on the Renaissance.', 'John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapters on Bonne\'s projection and on Werner\'s.', 'Johannes Werner, *Nova translatio primi libri geographiae Cl. Ptolemaei* (Nuremberg, 1514).'],
  sim: ['co-bonne-werner'],
  construction: 'co-werner-heart'
}
);
