/* HYPER-WATER · content/surfaces-and-flow.js — "Surfaces, drops and flow" (The Solvent): surface tension and what it holds up, how a drop sits
 * and a tube draws water, soap, the viscosity of water, the Leidenfrost effect, the stiffness of water and the speed of sound in it.
 * Ten concepts; simulations in sims/surfaces-and-flow.js (ids surf-…). All text original; numbers from the water engine or the sources named.
 */
Hyper.add(

/* ================================================================ 1. surface tension */
{
  id: 'surface-tension', parent: 'surfaces-and-flow', title: 'Surface tension', level: 1,
  short: 'A molecule at the surface of water has no neighbours above it, so it holds fewer hydrogen bonds than one inside. Making new surface costs energy: 72.8 mN/m at 20 °C, three times ethanol’s and a seventh of mercury’s. That cost is surface tension.',
  keywords: ['surface tension', 'surface energy', 'mN/m', 'Wilhelmy plate', 'du Noüy ring', 'pendant drop', 'cohesion', 'skin', 'interface', '72.8', 'newtons per metre', 'surface free energy'],
  prereq: ['what-a-hydrogen-bond-is', 'the-structure-of-liquid-water'],
  related: ['drops-and-bubbles', 'capillary-rise', 'wetting-and-contact-angle', 'water-striders-and-floating-needles', 'soap-and-surfactants', 'the-list-of-anomalies', 'physics:surface-tension', 'hydraulics:surface-tension', 'chemistry:surface-tension-viscosity'],
  body: `
Fill a glass a little above the brim and the water stands up in a dome without spilling. Lay a needle gently on a bowl of water and it floats, although steel is eight times denser. A tap dripping slowly lets each drop grow, hang, narrow to a neck and fall as a tidy bead. In each case the surface of the water behaves as if it were a stretched skin. There is no skin. There are only the molecules at the surface, and they are in a different situation from the ones below them.

### The molecule that lost its neighbours
Inside the liquid a molecule is held on all sides: about 3.7 of its four possible [[what-a-hydrogen-bond-is|hydrogen bonds]] are intact at any instant, and the rest of its neighbours press in from every direction, so the pulls cancel. A molecule in the top layer has water below and to the sides and nothing but air above. It can hold at most three bonds in the usual tetrahedral way, and in the top layer many molecules turn so that one O–H points out into the air, unbonded (the “dangling O–H” seen by laser spectroscopy at the water surface). Fewer bonds means higher energy, so the surface is a place molecules are pushed away from, and the liquid shrinks its surface to the least area the other forces allow. That is why drops are round.

The cost can be counted. A molecule at the surface occupies about 0.097 nm². Multiply by the surface tension and by Avogadro’s number and the surface costs about **4 kJ per mole of surface molecules**, a fifth of a hydrogen bond. It is not a whole bond because the surface molecules rearrange to make up part of the loss. The simple count (one bond in four lost, 20 kJ/mol) would predict a surface tension five times too high; the real, smaller cost is the net after the rearrangement.

### What the number means
Surface tension $\\sigma$ can be read two ways that are the same thing:
- as a **force per length**: the surface pulls along a line of length $L$ with a force $\\sigma L$, which is why the units are mN/m;
- as an **energy per area**: stretching the surface by $\\Delta A$ costs $\\sigma\\,\\Delta A$ joules, and 1 N/m = 1 J/m².

For water at 20 °C, $\\sigma$ = 72.7 mN/m: one square metre of new surface stores 0.073 J. It falls with temperature, nearly in a straight line, to 75.6 at 0 °C, 62.7 at 80 °C and 58.9 at 100 °C, and would reach zero at the critical point (374 °C), where liquid and vapour become one.

| Liquid (about 20 °C) | σ (mN/m) | What holds it |
|---|---|---|
| hexane | 18 | London forces only |
| ethanol | 22 | one O–H, small hydrogen-bond network |
| benzene | 29 | stacked rings |
| olive oil | 32 | long chains |
| glycerol | 63 | three O–H per molecule |
| **water** | **72.7** | **two O–H, two lone pairs: four bonds** |
| mercury | 486 | metallic bonding |

Water is the highest of the ordinary molecular liquids, but a metal beats it by a factor of seven.

### Measuring it
Three standard ways: the **Wilhelmy plate** (a thin platinum plate dipped in the liquid is pulled down by $\\sigma$ times its wet perimeter; weigh the pull), the **du Noüy ring** (a wire ring is drawn up out of the surface, and the force just before the film breaks gives $\\sigma$) and the **pendant drop** (photograph a drop hanging from a needle, and fit its shape, which gravity and $\\sigma$ together determine). Water is hard to measure: it takes up traces of grease and surfactant from the air within minutes, and a contaminated surface can read ten per cent low.

### Not a skin
A rubber skin gets stronger as it stretches. The surface of a pure liquid does not: stretch it and fresh molecules arrive from the bulk to fill the extra area, so $\\sigma$ is the same at any stretch. That is why a soap film can be drawn to any size and why a drop can be any size, up to the point where gravity matters (see [[drops-and-bubbles]]).

> [!key] Surface tension is the energy needed to make a unit of new surface, because a surface molecule has lost hydrogen bonds. At 72.7 mN/m water is the strongest ordinary liquid, and every effect in this topic, from the round drop to the floating needle, follows from that one number.`,
  ideas: ['A molecule at the surface has no neighbours above it and holds fewer hydrogen bonds, so surface costs energy: about 4 kJ per mole of surface molecules.', 'Surface tension is force per length and energy per area at once: 72.7 mN/m = 0.0727 J/m² for water at 20 °C.', 'It falls almost linearly with temperature, 75.6 mN/m at 0 °C to 58.9 at 100 °C, and vanishes at the critical point.', 'Water stands above every ordinary molecular liquid (ethanol 22, hexane 18) and far below a metal (mercury 486).', 'The surface is not an elastic skin: its tension does not change as it is stretched.'],
  pitfalls: ['“The surface of water is covered by a tougher skin of special molecules” — The surface molecules are the same molecules, only less well bonded. The “skin” is the energy cost of having a surface, and it does not strengthen when stretched.', '“Surface tension is the same thing as stickiness or thickness” — Honey is thick and sticky but its surface tension (about 60 mN/m) is below water’s. Viscosity measures how slowly a liquid flows; surface tension measures what its surface costs in energy. They are separate properties.', '“Water loses its surface tension when it boils” — At 100 °C it is still 58.9 mN/m, four-fifths of its value at 20 °C. The fall is smooth, with nothing special at the boiling point, and the tension vanishes only at the critical point, 374 °C.'],
  terms: [
    { term: 'Surface tension', also: ['σ', 'γ', 'surface free energy per area'], def: 'The energy needed to create one square metre of new liquid–air surface, equivalently the force per metre of line that the surface pulls with. For water, 72.7 mN/m at 20 °C and 58.9 mN/m at 100 °C.' },
    { term: 'Interface', also: ['liquid–vapour interface', 'free surface'], def: 'The thin boundary between two phases, here between the liquid and its vapour or the air. Its molecules have neighbours on one side only.' },
    { term: 'Wilhelmy plate', also: ['Wilhelmy balance'], def: 'A method of measuring surface tension: a thin plate dipped into the liquid is pulled down with a force equal to the surface tension times the perimeter it wets (times the cosine of the contact angle).' },
    { term: 'Du Noüy ring', also: ['ring method'], def: 'A method of measuring surface tension from the force needed to lift a wire ring out of the liquid, read at the instant before the film of liquid under the ring tears.' },
    { term: 'Dangling O–H', also: ['free O–H', 'non-hydrogen-bonded O–H'], def: 'An O–H group of a surface water molecule that points out into the air with no hydrogen-bond partner; seen by sum-frequency laser spectroscopy as a sharp line near 3,700 cm⁻¹.' }
  ],
  formulas: [
    { name: 'Wilhelmy plate: the pull of the surface', expr: 'F = sig*p*cos(theta)', tex: 'F = \\sigma\\,p\\,\\cos\\theta',
      vars: { F: { name: 'downward pull on the plate', q: 'force', unit: 'mN', tex: 'F' }, sig: { name: 'surface tension', q: 'surfacetension', unit: 'mN/m', value: 72.7, tex: '\\sigma', hint: '72.7 mN/m for clean water at 20 °C.' }, p: { name: 'wetted perimeter of the plate', q: 'length', unit: 'mm', value: 40.2, tex: 'p', hint: 'Twice the width plus twice the thickness: a 20 mm × 0.1 mm plate has 40.2 mm.' }, theta: { name: 'contact angle of the liquid on the plate', q: 'angle', unit: '°', value: 0, min: 0, max: 90, tex: '\\theta', hint: 'A roughened platinum plate is completely wetted, so the angle is zero.' } },
      solveFor: 'F', note: 'The measured force is the pull of the surface, apart from the plate’s weight and buoyancy, which are zeroed beforehand.',
      stories: { F: 'A clean platinum plate with a wetted perimeter of {p} is dipped into water with surface tension {sig}. What extra downward force does the balance read?', sig: 'A plate with a wetted perimeter of {p} reads an extra pull of {F} (angle {theta}). What is the surface tension?' } },
    { name: 'The energy of new surface', expr: 'E = sig*dA', tex: 'E = \\sigma\\,\\Delta A',
      vars: { E: { name: 'energy needed', q: 'energy', unit: 'mJ', tex: 'E' }, sig: { name: 'surface tension', q: 'surfacetension', unit: 'mN/m', value: 72.7, tex: '\\sigma' }, dA: { name: 'new surface made', q: 'area', unit: 'cm²', value: 100, tex: '\\Delta A', hint: 'Count both sides of a film, which has two surfaces.' } },
      solveFor: 'E', note: 'At constant temperature this is the reversible work; it equals the free energy stored in the surface.',
      stories: { E: 'A water surface of {dA} is created at {sig}. How much energy does it take?', dA: 'An energy of {E} makes new water surface at {sig}. How much area is that?' } },
    { name: 'The cost of one surface molecule', expr: 'En = sig*A*NA', tex: 'E_n = \\sigma\\,A_1\\,N_A',
      vars: { En: { name: 'energy per mole of surface molecules', q: 'molarenergy', unit: 'kJ/mol', tex: 'E_n' }, sig: { name: 'surface tension', q: 'surfacetension', unit: 'mN/m', value: 72.7, tex: '\\sigma' }, A: { name: 'area of one molecule at the surface', q: 'area', unit: 'nm²', value: 0.097, tex: 'A_1', hint: 'The area per molecule, from the molar volume: (volume of one molecule)^(2/3), 0.097 nm² for water.' }, NA: { const: 'NA' } },
      solveFor: 'En', note: 'About 4 kJ/mol, a fifth of the 20 kJ/mol of a hydrogen bond: the surface rearranges to keep most of its bonds.',
      stories: { En: 'Each water molecule at the surface occupies {A} and the surface tension is {sig}. What is the surface energy per mole of surface molecules?' } }
  ],
  examples: [
    { title: 'A mist of 1-micrometre droplets', q: 'One millilitre of water is sprayed into droplets of radius 0.5 µm. How much energy is stored in their surface, at 72.7 mN/m?',
      steps: ['Surface of a sphere divided by its volume: $A/V = 3/r$. For all the water, $A = 3V/r = 3\\times10^{-6}\\ \\mathrm{m^3}/0.5\\times10^{-6}\\ \\mathrm{m} = 6\\ \\mathrm{m^2}$ (against 4.8 cm² for the single 1 mL drop).', { text: 'Energy:', tex: 'E = \\sigma A = 0.0727\\ \\mathrm{N/m}\\times 6\\ \\mathrm{m^2} \\approx 0.44\\ \\mathrm{J}' }, 'For scale, 0.44 J lifts a one-gram mass by 45 m.'],
      a: 'About 0.44 J. Making fine droplets is expensive: the energy goes into the surface, which is why a spray needs a pump and why droplets coalesce so readily.' },
    { title: 'Reading a Wilhelmy balance', q: 'A platinum plate 20 mm wide and 0.1 mm thick is lowered into water at 20 °C. By how much does the balance reading change, and in grams?',
      steps: ['Wetted perimeter: $2(20 + 0.1)$ mm $= 40.2$ mm. The contact angle is 0°, so $\\cos\\theta = 1$.', { text: 'Force:', tex: 'F = \\sigma p = 0.0727 \\times 0.0402 \\approx 2.92\\ \\mathrm{mN}' }, 'Divide by $g$: $2.92\\times10^{-3}/9.81 = 0.30$ g.'],
      a: 'An extra pull of about 2.9 mN, the weight of 0.3 g. A balance that can read a milligram measures the surface tension to better than half a per cent.' },
    { title: 'From the glass to the kettle', q: 'By what percentage does the surface tension of water fall between 20 °C and 80 °C, given 72.7 and 62.7 mN/m?',
      steps: ['Fall: $72.7 - 62.7 = 10.0$ mN/m.', 'Fraction: $10.0/72.7 = 0.138$.'],
      a: 'About 14 %, or 0.17 mN/m for every kelvin. Hot dishwater is better at wetting a plate partly for this reason.' }
  ],
  quiz: [
    { q: 'Why does a molecule at the surface of water have a higher energy than one in the bulk?', choices: ['It moves faster', 'It holds fewer hydrogen bonds because it has no neighbours above', 'It is heavier', 'It has more oxygen atoms near it'], a: 1, why: 'The energy difference comes from the missing neighbours above it: fewer hydrogen bonds, hence higher energy. Temperature is the same throughout the liquid, so the molecule is not faster on average.' },
    { q: 'What is the energy, in joules, needed to create 1 m² of new water surface at 20 °C?', answer: 0.0727, unit: 'J', why: 'Energy = σ × area = 0.0727 N/m × 1 m² = 0.0727 J. Surface tension in N/m is the same as energy per area in J/m².' },
    { q: 'A soap film is stretched to twice its area. Its surface tension', choices: ['doubles, like a rubber skin', 'stays the same', 'halves', 'rises and then falls'], a: 1, why: 'Fresh molecules arrive from the film’s interior to fill the new area, so the tension does not depend on the stretch. A rubber sheet behaves differently because its molecules are pulled apart, not replaced.' },
    { q: 'Which has the highest surface tension at room temperature?', choices: ['Hexane', 'Ethanol', 'Water', 'Mercury'], a: 3, why: 'Mercury, 486 mN/m, because it is held by metallic bonding. Water at 72.7 is the highest of the molecular liquids here; ethanol (22) and hexane (18) are far lower.' },
    { q: 'Water at 100 °C has a higher surface tension than water at 0 °C.', a: false, why: 'It falls from 75.6 mN/m at 0 °C to 58.9 at 100 °C: thermal motion breaks the bonds the surface depends on.' }
  ],
  applications: ['Water drawn into round drops and spheres of mist, because the least area for a given volume is a sphere.', 'The Wilhelmy-plate and du Noüy-ring tensiometers used in paint, ink, pharmaceutical and oil laboratories to rate detergents, coatings and crude oils.', 'Detecting contamination: a drop of water on a freshly cleaned semiconductor wafer that spreads rather than beads shows the surface is clean.', 'Spray, ink-jet and fuel-injector design, where the energy stored in the new droplet surfaces fixes how fine a mist a given pump can make.', 'Foam and bubble stability, flotation of minerals, and the wetting of plant leaves, all of which turn on surface tension and how soap and other molecules change it.'],
  history: 'The idea of a surface tension goes back to Segner (1751), and the theory was set up by Young and by Laplace in 1805–06, who showed that a curved surface carries a pressure jump. Wilhelmy designed his plate method in 1863, and Pierre Lecomte du Noüy introduced the ring tensiometer in 1919, a method still in industrial use.',
  sources: ['Eisenberg and Kauzmann, *The Structure and Properties of Water*, ch. 4 (the surface).', 'IAPWS, *Release on Surface Tension of Ordinary Water Substance* (2014) — the temperature dependence used throughout this topic.', 'Du, Superfine, Freysz and Shen, “Vibrational spectroscopy of water at the vapor/water interface”, *Physical Review Letters* 70, 2313 (1993) — the dangling O–H.', 'de Gennes, Brochard-Wyart and Quéré, *Capillarity and Wetting Phenomena* (Springer, 2004), ch. 1.'],
  sim: 'surf-surface-molecule'
},

/* ================================================================ 2. drops and bubbles */
{
  id: 'drops-and-bubbles', parent: 'surfaces-and-flow', title: 'Drops and bubbles', level: 2,
  short: 'A curved surface presses on what is inside it: 2σ/r for a drop, 4σ/r for a soap bubble. A 1 mm drop holds 145 Pa more than the air, a 1 µm drop 1.4 bar. Surface tension rules drops smaller than the capillary length, 2.7 mm; bigger ones are flattened by their own weight.',
  keywords: ['Laplace pressure', 'Young–Laplace', 'drop', 'bubble', 'soap bubble', 'capillary length', 'Bond number', 'raindrop', 'dew', 'spherical', 'curvature', 'pressure inside a drop', 'Kelvin'],
  prereq: ['surface-tension'],
  related: ['capillary-rise', 'wetting-and-contact-angle', 'soap-and-surfactants', 'clouds-rain-and-snow', 'humidity-and-dew-point', 'physics:surface-tension', 'hydraulics:surface-tension', 'chemistry:vapor-pressure'],
  body: `
A bead of water on a leaf, a raindrop, a cloud droplet and a fog of spray are all spheres, and a soap bubble is a very thin shell of the same shape. The sphere is the shape of least surface for a given volume, and a liquid with surface tension tries to be one. But to be a sphere against anything that squeezes it from outside, the liquid must push back, and so the pressure inside a curved surface is higher than outside.

### The pressure of a curved surface
Cut a drop of radius $r$ in half. The surface pulls the two halves together along the cut circle, with force $\\sigma\\times2\\pi r$. The pressure excess $\\Delta p$ pushes them apart over an area $\\pi r^2$. At balance, $\\Delta p\\,\\pi r^2 = 2\\pi r\\sigma$, which gives the **Laplace pressure**

$$\\Delta p = \\frac{2\\sigma}{r}.$$

A soap bubble has an inner and an outer surface, so it has twice the effect, $\\Delta p = 4\\sigma/r$. For a general curved surface, $\\Delta p = \\sigma\\,(1/R_1 + 1/R_2)$, with the two principal radii of curvature. A saddle shape, with opposite curvatures, can have no pressure difference at all, which is why soap films stretched between wire frames form such smooth saddles.

| Drop radius | Laplace pressure 2σ/r (water, 20 °C) |
|---|---|
| 1 mm (a raindrop) | 145 Pa |
| 100 µm (a fog droplet) | 1.45 kPa |
| 1 µm (a cloud droplet) | 145 kPa = 1.45 bar |
| 10 nm (a nucleating droplet) | 14.5 MPa = 145 bar |

The pressure scales as $1/r$, so it matters for small things and is negligible for big ones. Inside the lungs, a bubble-like air sac 100 µm in radius lined with water would need 1.4 kPa to stay open; this is the problem that the lung’s soap-like surfactant solves (see [[soap-and-surfactants]]).

### Why small is different
Because the pressure is higher in small drops, they hold their water more strongly. Small drops evaporate faster than large ones, and the vapour pressure above a drop of radius $r$ is higher than above a flat surface by the factor $\\exp(2\\sigma M/\\rho R T r)$, 1.1 for a 10 nm drop and only 1.001 for 1 µm. This is why a cloud cannot form from pure water vapour: a nascent droplet is so small that it evaporates at once, and rain needs dust, salt or smoke particles to start on (see [[clouds-rain-and-snow]]). It is also why gas bubbles in a drink dissolve if small and grow if large.

### The capillary length: when gravity wins
Compare gravity with surface tension. Gravity makes a pressure difference $\\rho g h$ over a height $h$; surface tension, $\\sigma/h$ at that size. They are equal at the **capillary length**

$$\\ell_c = \\sqrt{\\frac{\\sigma}{\\rho g}} = 2.7\\ \\text{mm (water, 20 °C)}.$$

The dimensionless version is the **Bond number** $\\mathrm{Bo} = \\rho g L^2/\\sigma = (L/\\ell_c)^2$. Well below 1, surface tension rules and a drop is a sphere; well above 1, gravity rules. A water drop larger than about 3 mm squashes under its own weight; the largest drop that can sit on a non-wetting surface is a puddle two capillary lengths thick, 5.4 mm, however much water you pour on. A pool of mercury, whose $\\ell_c$ is only 1.9 mm, spreads out to about 4 mm. (Try both in the simulation.)

### Raindrops are not teardrops
The tail-up teardrop is a cartoon. Drops below about 1 mm across are spherical. At 2–4 mm, air pressure on the underside of the falling drop flattens it into a shape like a hamburger bun, with a flat bottom and a rounded top; at 5–6 mm the flattened bottom bows inward, and the drop splits into smaller ones in a bag-and-rim break-up. Drops larger than 5 mm are rare in rain, and the biggest recorded are about 8 mm. Their falling speed climbs from 4 m/s at 1 mm to 9 m/s at 5 mm.

### Dew and fog
Dew drops on a lawn are small, with Bo much less than 1, and so almost perfect spherical caps, whose shape depends on how well the leaf is wetted (see [[wetting-and-contact-angle]]). They form when a leaf cooled by radiation falls below the dew point of the air above it ([[humidity-and-dew-point]]).

> [!key] Surface tension makes a curved surface press inward by 2σ/r (4σ/r for a bubble): 145 Pa in a millimetre drop, 1.4 bar in a micrometre one. Below the 2.7 mm capillary length a drop is a sphere; above it, gravity squashes it into a puddle.`,
  ideas: ['The pressure inside a drop is higher than outside by 2σ/r; a soap bubble, with two surfaces, has 4σ/r.', 'The pressure grows as the drop shrinks: 145 Pa at 1 mm, 1.45 bar at 1 µm, 145 bar at 10 nm.', 'The capillary length √(σ/ρg) = 2.7 mm divides small round drops from large flat puddles (Bond number below or above 1).', 'Small drops evaporate faster and cannot form without a nucleus, so clouds need dust or salt grains.', 'Raindrops are spheres below 1 mm and flattened “buns” at 2–5 mm, never teardrops; above 5–6 mm they break up.'],
  pitfalls: ['“A raindrop is shaped like a teardrop” — Raindrops are spherical when small and flatten into a bun-shape as they fall; the teardrop is the shape of a drop forming at a tap, and then only for a moment.', '“A bigger bubble has a higher pressure inside” — It is the other way round: the excess pressure falls as 1/r, so when two soap bubbles are joined by a tube, air flows from the smaller to the larger, which grows.', '“Surface tension is what holds a puddle together, so a larger puddle needs a stronger surface” — A big puddle is held flat by gravity; the surface tension only makes its edge round. The depth does not increase beyond 5.4 mm on a non-wetting surface.'],
  terms: [
    { term: 'Laplace pressure', also: ['Young–Laplace pressure', 'capillary pressure'], def: 'The excess pressure inside a curved liquid surface: 2σ/r for a drop of radius r, 4σ/r for a soap bubble, σ(1/R₁ + 1/R₂) in general. It is 145 Pa for a 1 mm water drop.' },
    { term: 'Capillary length', also: ['Laplace length', 'ℓc'], def: 'The size √(σ/ρg) at which gravity and surface tension are equal: 2.7 mm for water at 20 °C, 1.9 mm for mercury. Drops smaller than this are round, larger ones flatten.' },
    { term: 'Bond number', also: ['Eötvös number', 'Bo'], def: 'The ratio ρgL²/σ of gravity’s effect to surface tension’s at length scale L; it equals (L/ℓc)². Below 1, surface tension dominates.' },
    { term: 'Kelvin effect', also: ['Kelvin equation', 'curvature effect on vapour pressure'], def: 'The rise of vapour pressure over a curved surface: the vapour pressure above a small drop exceeds that over a flat surface by exp(2σM/ρRTr).' },
    { term: 'Soap bubble', also: ['bubble', 'liquid shell'], def: 'A thin film of soapy water enclosing air, with two surfaces. Its Laplace pressure is 4σ/r.' }
  ],
  formulas: [
    { name: 'Pressure inside a drop', expr: 'dp = 2*sig/r', tex: '\\Delta p = \\frac{2\\sigma}{r}',
      vars: { dp: { name: 'excess pressure inside', q: 'pressure', unit: 'Pa', tex: '\\Delta p' }, sig: { name: 'surface tension', q: 'surfacetension', unit: 'mN/m', value: 72.7, tex: '\\sigma' }, r: { name: 'radius of the drop', q: 'length', unit: 'mm', value: 1, tex: 'r', hint: 'A raindrop is about 1 mm; a cloud droplet 10 µm.' } },
      solveFor: 'dp', note: 'A drop in air has one surface. A drop of liquid inside another liquid has the same formula with the interfacial tension.',
      stories: { dp: 'A water drop of radius {r} has surface tension {sig}. How much higher is the pressure inside it than outside?', r: 'The pressure inside a water drop exceeds the outside pressure by {dp} (σ = {sig}). What is its radius?' } },
    { name: 'Pressure inside a soap bubble', expr: 'dp = 4*sig/r', tex: '\\Delta p = \\frac{4\\sigma}{r}',
      vars: { dp: { name: 'excess pressure inside', q: 'pressure', unit: 'Pa', tex: '\\Delta p' }, sig: { name: 'surface tension of the soap solution', q: 'surfacetension', unit: 'mN/m', value: 28, tex: '\\sigma', hint: 'Ordinary dishwashing liquid in water gives 25–30 mN/m.' }, r: { name: 'radius of the bubble', q: 'length', unit: 'cm', value: 2, tex: 'r' } },
      solveFor: 'dp', note: 'Two surfaces, so twice the drop result; the thickness of the film (a micrometre or less) is neglected against the radius.',
      stories: { dp: 'A soap bubble of radius {r} is made from a solution with σ = {sig}. What is the excess pressure inside?' } },
    { name: 'The capillary length', expr: 'lc = sqrt(sig/(rho*g))', tex: '\\ell_c = \\sqrt{\\frac{\\sigma}{\\rho g}}',
      vars: { lc: { name: 'capillary length', q: 'length', unit: 'mm', tex: '\\ell_c' }, sig: { name: 'surface tension', q: 'surfacetension', unit: 'mN/m', value: 72.7, tex: '\\sigma' }, rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 998.2, tex: '\\rho' }, g: { const: 'g' } },
      solveFor: 'lc', note: 'On the Moon (g = 1.62) it is 2.5 times larger: drops stay round up to 6.7 mm.',
      stories: { lc: 'Water has surface tension {sig} and density {rho}. What is its capillary length?', sig: 'A liquid of density {rho} has capillary length {lc}. What is its surface tension?' } },
    { name: 'The Bond number', expr: 'Bo = rho*g*L^2/sig', tex: '\\mathrm{Bo} = \\frac{\\rho g L^2}{\\sigma}',
      vars: { Bo: { name: 'Bond number', tex: '\\mathrm{Bo}', hint: 'Below 1 surface tension rules the shape; above 1 gravity does.' }, rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 998.2, tex: '\\rho' }, g: { const: 'g' }, L: { name: 'size of the drop or puddle', q: 'length', unit: 'mm', value: 5, tex: 'L' }, sig: { name: 'surface tension', q: 'surfacetension', unit: 'mN/m', value: 72.7, tex: '\\sigma' } },
      solveFor: 'Bo', note: 'It is (L/ℓc)²: a 2.7 mm drop has Bo = 1.',
      stories: { Bo: 'A water drop {L} across: what is its Bond number?', L: 'A water drop has Bond number {Bo}. How large is it?' } }
  ],
  examples: [
    { title: 'An inkjet drop', q: 'An inkjet printer ejects drops of 10 picolitres of water-based ink (σ about 50 mN/m). What are the drop’s radius and Laplace pressure?',
      steps: ['Volume $10\\ \\mathrm{pL} = 10^{-14}\\ \\mathrm{m^3}$. Radius: $r = (3V/4\\pi)^{1/3} = (2.39\\times10^{-15})^{1/3} = 13.4\\ \\mu\\mathrm{m}$.', { text: 'Pressure:', tex: '\\Delta p = \\frac{2\\sigma}{r} = \\frac{2\\times0.050}{13.4\\times10^{-6}} \\approx 7.5\\ \\mathrm{kPa}' }],
      a: 'A radius of 13 µm and an extra 7.5 kPa (0.075 bar), enough to make the drop resist deformation as it flies and to hold it to a round shape.' },
    { title: 'A bubble of soap', q: 'A soap bubble 4 cm across is blown with a solution of σ = 28 mN/m. How much higher than the room’s pressure is the pressure inside it?',
      steps: ['Radius 2 cm = 0.02 m.', { text: 'Two surfaces:', tex: '\\Delta p = \\frac{4\\sigma}{r} = \\frac{4\\times0.028}{0.02} = 5.6\\ \\mathrm{Pa}' }],
      a: '5.6 Pa, one eighteen-thousandth of an atmosphere: the bubble is not “inflated” in any real sense, it is just closed.' },
    { title: 'When is a drop round?', q: 'Compare the Bond number of a 1 mm drop and a 1 cm puddle of water at 20 °C.',
      steps: ['$\\ell_c = 2.7$ mm.', { text: 'For 1 mm:', tex: '\\mathrm{Bo} = (1/2.7)^2 \\approx 0.14' }, { text: 'For 10 mm:', tex: '\\mathrm{Bo} = (10/2.7)^2 \\approx 14' }],
      a: 'The millimetre drop is round (Bo ≈ 0.14); the centimetre puddle is flat-topped (Bo ≈ 14), with a thickness near 5 mm.' }
  ],
  quiz: [
    { q: 'A drop of radius 1 µm has what Laplace pressure, compared with a drop of radius 1 mm?', choices: ['The same', '10 times greater', '1,000 times greater', '1,000,000 times greater'], a: 2, why: 'The pressure goes as 1/r, so 1 µm is 1,000 times smaller than 1 mm and has 1,000 times the pressure: 145 kPa against 145 Pa.' },
    { q: 'A soap bubble has twice the Laplace pressure of a drop of the same radius and surface tension, because', choices: ['soap is denser', 'it has two surfaces, inside and outside', 'it contains air', 'soap has a higher surface tension'], a: 1, why: 'The film has an inner and an outer face, each pulling inward, so the excess pressure is 4σ/r instead of 2σ/r.' },
    { q: 'Two soap bubbles of different size are connected by a tube. Air flows', choices: ['from the large to the small one', 'from the small to the large one', 'in neither direction', 'back and forth'], a: 1, why: 'The small bubble has the higher pressure (4σ/r grows as r falls), so it empties into the large one. The unstable behaviour can be shown with a straw and two bubbles.' },
    { q: 'The capillary length of water is about 2.7 mm. A drop 20 cm across lying on a non-wetting surface would be', choices: ['a sphere', 'a puddle about 5 mm thick', 'a puddle 20 cm thick', 'a ring'], a: 1, why: 'Far above the capillary length, gravity flattens it to a thickness fixed by the capillary length (two of them, about 5.4 mm), however wide it is.' },
    { q: 'A falling raindrop of radius 3 mm keeps the teardrop shape of a drop at a tap.', a: false, why: 'Raindrops of that size are flattened, bun-shaped bodies; big ones break up. The teardrop is the shape of a drop about to detach from a tap, not of one in free fall.' }
  ],
  applications: ['Why a cloud needs dust: the Kelvin effect sets the supersaturation at which pure water droplets can form, and condensation nuclei lower it.', 'Spray, atomisation and inkjet printing, where drops of picolitres have kilopascals inside.', 'Foam and froth: in a foam the smaller bubbles empty into the larger ones (coarsening), which is why foam on beer slowly coarsens.', 'Premature babies’ breathing: the Laplace pressure of a wet air sac would collapse the lungs without surfactant (see [[soap-and-surfactants]]).', 'Raindrop size is measured by disdrometers and radar to estimate rainfall; flattened drops also change how polarised radar waves are returned.'],
  history: 'Thomas Young (1805) and Pierre-Simon Laplace (1806) independently showed that a curved liquid surface carries a pressure jump proportional to its curvature, which founded the theory of capillarity. Raindrop sizes were first measured in 1904 by W. A. Bentley (the snowflake photographer), who caught drops in flour, and falling speeds by Lenard the same year; Gunn and Kinzer’s 1949 measurements of falling speeds are still the standard.',
  sources: ['de Gennes, Brochard-Wyart and Quéré, *Capillarity and Wetting Phenomena*, ch. 1.', 'Pruppacher and Pitter, “A semi-empirical determination of the shape of cloud and rain drops”, *Journal of the Atmospheric Sciences* 28, 86 (1971).', 'Gunn and Kinzer, “The terminal velocity of fall for water droplets in stagnant air”, *Journal of Meteorology* 6, 243 (1949).', 'Isenberg, *The Science of Soap Films and Soap Bubbles* (Dover, 1992).'],
  sim: { id: 'surf-drops', params: { mode: 'free' } }
},

/* ================================================================ 3. capillary rise */
{
  id: 'capillary-rise', parent: 'surfaces-and-flow', title: 'Capillary rise', level: 2,
  short: 'Water climbs a narrow tube until the weight of the column balances the pull of the surface: h = 2σ cos θ / (ρ g r), 1.5 cm in a tube of 1 mm radius and 15 m in a pore of 1 µm. Halve the bore and the water rises twice as high.',
  keywords: ['capillary rise', 'capillary action', 'Jurin’s law', 'meniscus', 'wicking', 'paper towel', 'soil moisture', 'xylem', 'capillary tube', 'depression of mercury', 'Washburn', 'blotting paper'],
  prereq: ['surface-tension', 'drops-and-bubbles'],
  related: ['wetting-and-contact-angle', 'transpiration-pull', 'why-suction-stops-at-ten-metres', 'rivers-and-groundwater', 'physics:surface-tension', 'hydraulics:surface-tension', 'hydraulics:groundwater-darcy'],
  body: `
Dip the corner of a paper towel into spilled coffee and the liquid runs up the paper against gravity. Put a thin glass tube into a glass of water and the water inside stands higher than the water outside, higher the narrower the tube. A candle wick draws wax, the soil draws water from below the roots, and a cotton towel soaks the bath. All of these are **capillary action**: water pulled up a narrow space by the wall’s attraction for it and the surface tension at its edge.

### How the surface lifts the water
Water wets clean glass: it prefers to cover the glass rather than leave it bare, and where the water surface meets the wall the angle between them is nearly zero (the contact angle $\\theta$; see [[wetting-and-contact-angle]]). In a narrow tube this curls the whole surface into a concave cup, a **meniscus**. A curved surface has a pressure jump (see [[drops-and-bubbles]]): the water just under the meniscus is at a pressure *lower* than the air above it by $2\\sigma\\cos\\theta/r$. The liquid in the dish outside is at atmospheric pressure, so the water is pushed up the tube until the weight of the column makes up the difference, $\\rho g h = 2\\sigma\\cos\\theta/r$:

$$h = \\frac{2\\sigma\\cos\\theta}{\\rho g r}.$$

This is **Jurin’s law** (Jurin, 1718). It is the pressure balance of the Laplace pressure against the weight of a column of liquid, nothing more.

### The numbers
For clean water at 20 °C and $\\theta = 0$, $2\\sigma/(\\rho g) = 14.9$ mm², so $h\\,r = 14.9\\ \\mathrm{mm^2}$:

| Radius of tube or pore | Height of rise |
|---|---|
| 1 mm | 1.49 cm |
| 0.1 mm | 14.9 cm |
| 10 µm (a paper towel fibre gap) | 1.49 m |
| 1 µm (clay) | 14.9 m |
| 5 nm (a plant cell wall) | 3 km (as tension: 29 MPa) |

The law holds when the radius is much smaller than the capillary length ($r \\ll 2.7$ mm); in wider tubes the meniscus itself needs a small correction of about $r/3$.

### Three ways it goes
- **The contact angle sets the sign.** For $\\theta < 90^\\circ$ the liquid rises; at 90° nothing happens; for $\\theta > 90^\\circ$ the surface is convex and the liquid is *pushed down* below the outside level. Mercury makes about 140° with glass, so in a tube of 1 mm radius it stands 5.6 mm *below* the level outside. This is why a mercury barometer must be corrected for the bore of its tube.
- **Speed is another matter.** The height tells where the rise stops, not how fast. A narrow capillary is very resistive to flow ([[viscosity-of-water]]), so the water creeps up as the square root of time (the Lucas–Washburn law): a paper strip lifts coloured water a centimetre in seconds, ten centimetres in minutes.
- **Wide is not a capillary.** On a single large plate the water rises up the wall to only about $\\sqrt2\\,\\ell_c$ = 3.9 mm, the meniscus on the side of a full glass.

### In plants and soil
In soil the pores between the grains are the capillaries. Water rises a few centimetres in coarse sand, a metre in silt and several metres in clay (pores of about a micrometre), and farmers rely on this: it brings water from the water table up to the roots. A tree is a more extreme case. Its leaves hold water in cell walls with pores of about 5 nm, and a meniscus in a pore that fine can sustain a pressure of $2\\sigma/r$ = 29 MPa below atmospheric. That meniscus is the engine of the tallest trees: evaporation from it pulls a column of water up from the roots ([[transpiration-pull]]). The xylem vessels themselves (10–100 µm radius) are too wide for capillarity to lift water more than a metre or so, and it is the pull from the leaves, not the push from below, that does the work.

> [!key] Water rises in a narrow tube until the weight of the column balances the 2σ cos θ / r pull of its meniscus: 1.5 cm for a 1 mm radius, doubling each time the radius halves. A wetting angle above 90° reverses the effect, as mercury shows.`,
  ideas: ['The meniscus makes the pressure under it lower than the air’s by 2σ cos θ / r; the column rises until its weight balances this.', 'Jurin’s law: h = 2σ cos θ / (ρ g r), so h × r is a constant, 14.9 mm² for clean water.', 'A contact angle over 90° gives a convex meniscus and a depression, as with mercury in glass (about −5.6 mm at 1 mm radius).', 'The law gives the height, not the speed: the rise slows as the square root of time because narrow tubes resist flow.', 'In a tree, menisci in 5 nm cell-wall pores can hold 29 MPa of tension, which is what draws water to the top of a redwood.'],
  pitfalls: ['“Capillary action defies gravity and could be a perpetual motion machine” — The water is held up, not made to flow out. To make it do work you must remove it from the tube, and then the tube has to be wetted again; the energy comes from the wetting of the walls.', '“Capillary action lifts sap to the top of a tall tree” — The xylem tubes are far too wide for that (a 1.5 m limit at 10 µm radius). The lift comes from tension created by evaporation in the leaves, with capillarity in the cell walls only setting how much tension they can hold.', '“A tube of any width lifts water” — The height is inversely proportional to the radius. In a tube wider than the capillary length (2.7 mm) the water rises only a few millimetres, no longer a capillary effect.'],
  terms: [
    { term: 'Capillary action', also: ['capillarity', 'wicking'], def: 'The movement of a liquid into a narrow space, such as a tube, a fibre network or a soil pore, driven by the attraction of the walls and the surface tension of the liquid.' },
    { term: 'Meniscus', def: 'The curved surface of a liquid where it meets a wall or fills a narrow tube: concave (cup-shaped) where the liquid wets the wall, convex where it does not.' },
    { term: 'Jurin’s law', also: ['Jurin height', 'capillary rise equation'], def: 'The height h = 2σ cos θ / (ρ g r) to which a liquid rises (or falls, if the contact angle exceeds 90°) in a tube of radius r, with surface tension σ, density ρ and contact angle θ.' },
    { term: 'Lucas–Washburn law', also: ['Washburn equation'], def: 'The rate of a capillary rise or soaking: the distance L soaked into a narrow tube or porous material grows as √(σ r cos θ · t / 2η), where η is the viscosity.' },
    { term: 'Capillary fringe', def: 'The zone just above a water table where water is held up in the soil pores by capillary action; a few centimetres in sand, a metre or more in clay.' }
  ],
  formulas: [
    { name: 'Jurin’s law: the height of rise', expr: 'h = 2*sig*cos(theta)/(rho*g*r)', tex: 'h = \\frac{2\\sigma\\cos\\theta}{\\rho\\, g\\, r}',
      vars: { h: { name: 'height of rise', q: 'length', unit: 'cm', signed: true, tex: 'h', hint: 'Measured from the outside level to the bottom of the meniscus; negative when the liquid is pushed down.' }, sig: { name: 'surface tension', q: 'surfacetension', unit: 'mN/m', value: 72.7, tex: '\\sigma' }, theta: { name: 'contact angle with the wall', q: 'angle', unit: '°', value: 0, min: 0, max: 179, tex: '\\theta', hint: '0° for water on clean glass; about 140° for mercury on glass.' }, rho: { name: 'density of the liquid', q: 'density', unit: 'kg/m³', value: 998.2, tex: '\\rho' }, g: { const: 'g' }, r: { name: 'radius of the tube', q: 'length', unit: 'mm', value: 0.5, tex: 'r', hint: 'The inside radius at the meniscus.' } },
      solveFor: 'h', note: 'For r much less than 2.7 mm. Add −r/3 for the volume of the meniscus itself in a tube of larger bore.',
      stories: { h: 'Clean water (σ = {sig}) is in contact with a glass tube of radius {r} at contact angle {theta}. How high does it rise?', r: 'Water rises {h} in a clean glass capillary. What is the radius of the bore?', theta: 'Water in a tube of radius {r} rises {h}. What is the contact angle?' } },
    { name: 'The pull of a pore', expr: 'p = 2*sig*cos(theta)/r', tex: 'p_c = \\frac{2\\sigma\\cos\\theta}{r}',
      vars: { p: { name: 'capillary pressure (suction)', q: 'pressure', unit: 'kPa', tex: 'p_c', hint: 'How far below atmospheric the water is held under the meniscus; in a tree it becomes a tension.' }, sig: { name: 'surface tension', q: 'surfacetension', unit: 'mN/m', value: 72.7, tex: '\\sigma' }, theta: { name: 'contact angle', q: 'angle', unit: '°', value: 0, min: 0, max: 89, tex: '\\theta' }, r: { name: 'radius of the pore', q: 'length', unit: 'µm', value: 1, tex: 'r', hint: '1 µm for clay, 10–50 µm for sand, 5 nm for a cell wall.' } },
      solveFor: 'p', note: 'The suction of the soil: a 1 µm pore holds water at about −1.5 bar; the “permanent wilting point” of most crops, −15 bar, corresponds to pores of 0.1 µm.',
      stories: { p: 'Water meets a soil pore of radius {r} at contact angle {theta}. How much suction does the meniscus provide?', r: 'A meniscus holds water at a suction of {p}. What is the radius of the pore?' } },
    { name: 'The rise in a time t (Lucas–Washburn)', expr: 'L = sqrt(sig*r*cos(theta)*t/(2*eta))', tex: 'L = \\sqrt{\\frac{\\sigma\\, r \\cos\\theta\\; t}{2\\eta}}',
      vars: { L: { name: 'distance soaked in', q: 'length', unit: 'cm', tex: 'L' }, sig: { name: 'surface tension', q: 'surfacetension', unit: 'mN/m', value: 72.7, tex: '\\sigma' }, r: { name: 'radius of the pore', q: 'length', unit: 'µm', value: 20, tex: 'r' }, theta: { name: 'contact angle', q: 'angle', unit: '°', value: 30, min: 0, max: 89, tex: '\\theta' }, t: { name: 'time', q: 'time', unit: 's', value: 10, tex: 't' }, eta: { name: 'viscosity', q: 'viscosity', unit: 'mPa·s', value: 1.0, tex: '\\eta' } },
      solveFor: 'L', note: 'Valid while gravity is still negligible, i.e. well below the Jurin height. The distance grows as the square root of the time.',
      stories: { L: 'Water soaks into a horizontal pore of radius {r} (contact angle {theta}). How far does it go in {t}?', t: 'How long does water take to soak {L} into a pore of radius {r} (contact angle {theta})?' } }
  ],
  examples: [
    { title: 'A glass capillary', q: 'A glass tube of inner radius 0.25 mm stands in clean water at 20 °C. How high does the water rise in it?',
      steps: ['$h r = 2\\sigma/(\\rho g) = 2\\times0.0727/(998.2\\times9.81) = 1.485\\times10^{-5}\\ \\mathrm{m^2}$.', { text: 'Divide by $r = 0.25\\times10^{-3}$ m:', tex: 'h = \\frac{1.485\\times10^{-5}}{2.5\\times10^{-4}} = 0.0594\\ \\mathrm{m}' }],
      a: 'About 5.9 cm, four times the rise in a 1 mm radius tube.' },
    { title: 'The tube for a metre of rise', q: 'What pore radius would lift clean water 1.0 m by capillarity alone?',
      steps: ['$r = 2\\sigma\\cos\\theta/(\\rho g h)$ with $\\theta = 0$, $h = 1$ m.', { text: '', tex: 'r = \\frac{2\\times0.0727}{998.2\\times9.81\\times1.0} = 14.9\\ \\mu\\mathrm{m}' }],
      a: 'A radius of 15 µm: a tight bundle of fine fibres, like a tissue paper or a fine silt. This is also the size of a wide xylem vessel in a tree, which shows that capillarity alone could lift sap only to about a metre.' },
    { title: 'Mercury in a barometer tube', q: 'Mercury (σ = 486 mN/m, ρ = 13,534 kg/m³) makes a contact angle of 140° with glass. By how much is it depressed in a tube of radius 1 mm?',
      steps: [{ text: '', tex: 'h = \\frac{2\\sigma\\cos\\theta}{\\rho g r} = \\frac{2\\times0.486\\times\\cos140^\\circ}{13{,}534\\times9.81\\times10^{-3}}' }, '$\\cos 140^\\circ = -0.766$, so $h = -0.745/132.8 = -5.6\\times10^{-3}$ m.'],
      a: 'The mercury sits 5.6 mm below the level of the pool outside, so a barometer reading is too low by that much unless the tube is wide; the error shrinks rapidly as the bore grows.' }
  ],
  quiz: [
    { q: 'The radius of a capillary tube is halved. The water rises', choices: ['half as high', 'the same', 'twice as high', 'four times as high'], a: 2, why: 'Jurin’s law gives h ∝ 1/r, so halving the radius doubles the height.' },
    { q: 'A liquid makes a contact angle of 120° with the tube. The liquid level inside the tube is', choices: ['higher than outside', 'the same as outside', 'lower than outside', 'impossible to tell'], a: 2, why: 'For θ above 90°, cos θ is negative, so the meniscus is convex and the liquid is pushed down below the outside level, as mercury is in glass.' },
    { q: 'Capillary action alone can keep water in a tube of 5 µm radius up to about what height?', answer: 3, unit: 'm', why: 'h = 14.9 mm² / r = 14.9 mm² / 0.005 mm = 2,980 mm, about 3 m. This is comfortably more than the pore sizes of soil need, and comfortably less than a tree’s height.' },
    { q: 'A paper towel soaks up water fastest in the first seconds, then slows. This is because', choices: ['the water cools', 'the pores resist the flow of the lengthening column, so the rise goes as √t', 'the surface tension changes', 'gravity increases'], a: 1, why: 'The Lucas–Washburn law: a longer column of water in a narrow pore has a greater viscous resistance, so the distance goes as the square root of time.' },
    { q: 'Capillary action is what raises sap to the top of a 100 m tree.', a: false, why: 'The xylem vessels are too wide: at 10–100 µm radius they could hold water up only 15 cm to 1.5 m by capillarity. The tree uses the tension set up by evaporation in its leaves (transpiration pull).' }
  ],
  applications: ['Soil water: capillary rise from the water table moistens crop roots, and fine soils hold water against drainage and against the pull of the plant.', 'Paper chromatography and lateral-flow tests (pregnancy and COVID tests): the liquid sample wicks along a strip of porous membrane without a pump.', 'Towels, sponges, wicks, candles and lamp wicks; modern sports fabrics use channelled fibres that wick sweat away.', 'Blotting and inkjet paper, where the pore size is chosen so that ink soaks in at the right rate.', 'Microfluidic chips, where capillary forces at the micrometre scale replace pumps, and heat pipes, where a wick returns the condensed liquid to the hot end.'],
  history: 'Leonardo da Vinci noticed the rise of water in thin tubes about 1500. Hauksbee (1706) and Jurin (1718) established that the height varies inversely with the bore of the tube, Jurin giving his name to the law. Young and Laplace gave the explanation in 1805–06 in terms of surface tension and the contact angle. Lucas (1918) and Washburn (1921) described the rate of rise.',
  sources: ['de Gennes, Brochard-Wyart and Quéré, *Capillarity and Wetting Phenomena*, ch. 1 (Jurin’s law).', 'Taiz and Zeiger, *Plant Physiology*, ch. 4 (water movement in soil and plant).', 'Washburn, “The dynamics of capillary flow”, *Physical Review* 17, 273 (1921).', 'Zimmermann, *Xylem Structure and the Ascent of Sap* (Springer, 1983).'],
  sim: 'surf-capillary'
},

/* ================================================================ 4. wetting and the contact angle */
{
  id: 'wetting-and-contact-angle', parent: 'surfaces-and-flow', title: 'Wetting and the contact angle', level: 2,
  short: 'Where a drop meets a solid, its surface makes a fixed angle with it: near 0° on clean glass, 110° on Teflon, 160° on a lotus leaf. Young’s equation sets the angle from three surface tensions, and texture can push it far beyond what any smooth surface can reach.',
  keywords: ['contact angle', 'wetting', 'Young’s equation', 'hydrophobic', 'hydrophilic', 'superhydrophobic', 'lotus effect', 'Wenzel', 'Cassie–Baxter', 'hysteresis', 'Teflon', 'waxed car', 'self-cleaning', 'work of adhesion'],
  prereq: ['surface-tension', 'drops-and-bubbles'],
  related: ['capillary-rise', 'water-striders-and-floating-needles', 'soap-and-surfactants', 'the-hydrophobic-effect', 'like-dissolves-like', 'chemistry:intermolecular-forces', 'chemistry:hydrogen-bonding'],
  body: `
Rain on a clean windscreen smears into a film; on a freshly waxed bonnet it stands in round beads that roll off at a touch. The water is the same, and so is the glass or paint beneath; what has changed is what the water *prefers*. On the first surface it would rather lie against the solid than against the air; on the second it would rather keep to itself. The angle where the edge of a drop meets the solid is the measure of that preference.

### The contact angle
Three interfaces meet at the edge of a drop: solid–vapour (surface energy $\\sigma_{sv}$), solid–liquid ($\\sigma_{sl}$) and liquid–vapour ($\\sigma_{lv}$, the surface tension of the liquid). Along the solid the edge of the drop is pulled outward by $\\sigma_{sv}$ and inward by $\\sigma_{sl}$ and by the horizontal part of the liquid’s own tension, $\\sigma_{lv}\\cos\\theta$. At rest these balance, which is **Young’s equation** (1805):

$$\\cos\\theta = \\frac{\\sigma_{sv} - \\sigma_{sl}}{\\sigma_{lv}}.$$

If $\\sigma_{sv} - \\sigma_{sl}$ is larger than $\\sigma_{lv}$, there is no angle that balances and the liquid spreads out into a film (**complete wetting**). If it is negative, the angle exceeds 90° and the drop stands up.

### What decides it: bonds
A liquid wets a solid when the solid offers it something at least as good as its own kind. The work of adhesion between water and a surface is $W = \\sigma_{lv}(1 + \\cos\\theta)$, to be compared with the work of cohesion of water on itself, $2\\sigma_{lv} = 145.6\\ \\mathrm{mJ/m^2}$. Clean glass and metal oxides are covered with O–H groups to which water can [[what-a-hydrogen-bond-is|hydrogen-bond]], so adhesion equals cohesion, $\\theta \\approx 0$, and water spreads. Wax, polyethylene and Teflon are made of C–H and C–F groups that cannot make hydrogen bonds, so water gains almost nothing by touching them and pulls back into a ball. This is a small-scale version of the [[the-hydrophobic-effect|hydrophobic effect]].

| Surface (for water, in air) | Contact angle θ |
|---|---|
| clean glass, silica, metal oxides | 0°–20° |
| skin, paper, many fabrics | 40°–80° |
| polyethylene | about 95° |
| paraffin wax, car polish | 105°–110° |
| Teflon (PTFE) | 108°–112° |
| a flat, close-packed fluorinated surface | about 120°, the largest known on a flat surface |
| a lotus leaf, a good superhydrophobic coating | 150°–165° |

### Rough surfaces break the limit
No smooth surface goes beyond about 120°, but texture changes the *apparent* angle. There are two cases. On a rough surface where the liquid fills all the grooves (**Wenzel**, 1936), the angle is pushed away from 90°: $\\cos\\theta^* = r\\cos\\theta$ with $r \\ge 1$ the ratio of true to flat area, so a wettable surface wets more and a repellent one repels more. On a surface of fine pillars where the liquid sits on top of trapped air (**Cassie–Baxter**, 1944), only a fraction $f$ of the area under the drop touches the solid, and $\\cos\\theta^* = f(\\cos\\theta + 1) - 1$. With a wax of 110° and pillars that cover 5 % of the area, $\\theta^*$ is 165°. This is the lotus leaf (Barthlott and Neinhuis, 1997): papillae 10–20 µm tall, covered in wax crystals, so that a drop rides on air and on the tips of the wax. Dust grains lying on such a surface are collected by a rolling drop, which is the “lotus effect”.

### Why drops stick on a window
Real surfaces have two angles: the **advancing** angle at the front of a moving drop and the **receding** angle at the back, which is smaller by 10°–40° on ordinary glass because of dirt and roughness. The difference, the **hysteresis**, pins the edge, and a drop stays on a vertical window until its weight beats the pinning force. A water-repellent coating works by cutting hysteresis as well as raising the angle, so that drops roll at slight tilts.

> [!key] A drop’s contact angle comes from how much the solid likes water compared with how much water likes itself: 0° on hydrogen-bonding glass, 110° on Teflon, and up to 165° on a textured surface that holds the drop on a cushion of air.`,
  ideas: ['Young’s equation: cos θ = (σsv − σsl) / σlv; if the numerator exceeds σlv, water spreads completely.', 'Water wets surfaces that can hydrogen-bond (glass, oxides) and beads on those that cannot (wax, Teflon): the work of adhesion σ(1 + cos θ) falls from 145.6 to 48 mJ/m².', 'No smooth surface exceeds about 120°; texture can raise the apparent angle past 150° by trapping air (Cassie–Baxter, cos θ* = f(cos θ + 1) − 1).', 'Roughness makes a wettable surface wetter and a repellent surface more repellent (Wenzel: cos θ* = r cos θ).', 'Contact-angle hysteresis, the difference of advancing and receding angles, pins drops on windows; low hysteresis is what makes a lotus leaf self-cleaning.'],
  pitfalls: ['“A hydrophobic surface repels water through some sort of electrical push” — It exerts nothing special on water: the water simply gains almost nothing by touching it, and so closes up. The effect is the absence of hydrogen bonding.', '“Roughness always makes a surface more water-repellent” — Only if it is already repellent (θ > 90°). On a wettable surface roughness reduces the angle, which is why a rough clean ceramic soaks up water.', '“The contact angle is a property of the liquid alone” — It depends on the pair, liquid and solid (and on what is in the air): the same drop is flat on glass, round on Teflon, and gives different angles on clean and dirty glass.'],
  terms: [
    { term: 'Contact angle', also: ['wetting angle', 'θ'], def: 'The angle, measured through the liquid, between the solid surface and the liquid–vapour surface at the edge of a drop. Below 90° the surface is wetted, above 90° it is not.' },
    { term: 'Hydrophilic and hydrophobic', also: ['water-loving', 'water-hating'], def: 'A hydrophilic surface is wetted by water (contact angle below 90°), usually because it can hydrogen-bond; a hydrophobic one is not (above 90°). A superhydrophobic surface gives more than about 150°.' },
    { term: 'Young’s equation', also: ['Young relation'], def: 'The balance of interfacial tensions at a contact line: cos θ = (σsv − σsl) / σlv, with σsv the solid–vapour, σsl the solid–liquid and σlv the liquid–vapour tension.' },
    { term: 'Contact-angle hysteresis', also: ['advancing and receding angles'], def: 'The difference between the angle at the advancing edge of a drop (larger) and at its receding edge (smaller). It is what holds a drop on a tilted window.' },
    { term: 'Cassie–Baxter state', also: ['fakir state', 'composite wetting'], def: 'A drop resting on the tops of a rough surface with air trapped in the hollows below it. Only a fraction f of the area under the drop touches the solid, and the angle is cos θ* = f(cos θ + 1) − 1.' },
    { term: 'Wenzel state', also: ['wetted-grooves state'], def: 'A drop that has penetrated all the hollows of a rough surface, so that the apparent angle is given by cos θ* = r cos θ, with r the ratio of true to projected area.' }
  ],
  formulas: [
    { name: 'Young’s equation', expr: 'theta = acos((ssv - ssl)/slv)', tex: '\\theta = \\arccos\\frac{\\sigma_{sv} - \\sigma_{sl}}{\\sigma_{lv}}',
      vars: { theta: { name: 'contact angle', q: 'angle', unit: '°', tex: '\\theta', hint: 'Under 90° the liquid wets the surface; over 90° it beads up.' }, ssv: { name: 'solid–vapour tension', q: 'surfacetension', unit: 'mN/m', value: 18, tex: '\\sigma_{sv}', hint: 'About 18 mN/m for Teflon, 70 or more for clean glass.' }, ssl: { name: 'solid–liquid tension', q: 'surfacetension', unit: 'mN/m', value: 43, tex: '\\sigma_{sl}', hint: 'Cannot be measured directly; it is deduced from the angle.' }, slv: { name: 'liquid–vapour tension', q: 'surfacetension', unit: 'mN/m', value: 72.7, tex: '\\sigma_{lv}', hint: 'The surface tension of the liquid: 72.7 mN/m for water at 20 °C.' } },
      solveFor: 'theta', note: 'If the argument exceeds 1 the liquid spreads completely and no angle exists.',
      stories: { theta: 'A drop of water ({slv}) sits on a solid with σsv = {ssv} and σsl = {ssl}. What contact angle does it make?', ssl: 'Water (σ = {slv}) makes a contact angle of {theta} on a solid with σsv = {ssv}. What is the solid–liquid tension?' } },
    { name: 'Work of adhesion (Young–Dupré)', expr: 'Wa = slv*(1 + cos(theta))', tex: 'W_a = \\sigma_{lv}\\,(1 + \\cos\\theta)',
      vars: { Wa: { name: 'work of adhesion', q: 'surfacetension', unit: 'mN/m', tex: 'W_a', hint: 'Energy per unit area needed to pull the liquid off the solid. For comparison, water on itself: 145.6.' }, slv: { name: 'liquid–vapour tension', q: 'surfacetension', unit: 'mN/m', value: 72.7, tex: '\\sigma_{lv}' }, theta: { name: 'contact angle', q: 'angle', unit: '°', value: 110, min: 0, max: 180, tex: '\\theta' } },
      solveFor: 'Wa', note: 'Equal to 2σ (cohesion) at θ = 0: the liquid then wets the solid as well as it wets itself. (Units of mN/m are the same as mJ/m².)',
      stories: { Wa: 'Water ({slv}) makes an angle of {theta} on a surface. What is the work of adhesion?' } },
    { name: 'Rough surface, liquid in the grooves (Wenzel)', expr: 'thW = acos(r*cos(th))', tex: '\\theta_W = \\arccos\\left(r\\cos\\theta\\right)',
      vars: { thW: { name: 'apparent angle on the rough surface', q: 'angle', unit: '°', tex: '\\theta_W' }, r: { name: 'roughness (true area ÷ flat area)', value: 1.5, min: 1, tex: 'r', hint: 'Never below 1; 1.5 is a sandblasted metal.' }, th: { name: 'angle on the smooth surface', q: 'angle', unit: '°', value: 70, min: 0, max: 180, tex: '\\theta' } },
      solveFor: 'thW', note: 'If r cos θ is beyond ±1 the surface is completely wetted (or completely dry).',
      stories: { thW: 'On a smooth surface water makes {th}. The surface is roughened to r = {r}. What angle does the drop make now, if it fills the grooves?' } },
    { name: 'Drop on pillars (Cassie–Baxter)', expr: 'thC = acos(f*(cos(th) + 1) - 1)', tex: '\\theta_{CB} = \\arccos\\left[f(\\cos\\theta + 1) - 1\\right]',
      vars: { thC: { name: 'apparent angle on the textured surface', q: 'angle', unit: '°', tex: '\\theta_{CB}' }, f: { name: 'fraction of the area that touches the solid', value: 0.05, min: 0.001, max: 1, tex: 'f', hint: '5 % is typical of a lotus leaf, whose drops rest on wax crystals and air.' }, th: { name: 'angle on the smooth material', q: 'angle', unit: '°', value: 110, min: 0, max: 180, tex: '\\theta' } },
      solveFor: 'thC', note: 'The smaller f, the closer to 180°. The drop stays on the pillars only while the pressure under it is below the capillary pressure of the gaps.',
      stories: { thC: 'A wax surface (θ = {th}) is patterned so that only {f} of the area touches a drop. What angle does the drop show?', f: 'A surface of material with angle {th} shows an apparent angle of {thC}. What fraction of the drop’s footprint touches the solid?' } }
  ],
  examples: [
    { title: 'What a Teflon surface does', q: 'The surface energy of PTFE (σsv) is about 18 mN/m, and water on it makes 110°. Find the solid–liquid tension and the work of adhesion.',
      steps: [{ text: 'Young: $\\sigma_{sl} = \\sigma_{sv} - \\sigma_{lv}\\cos\\theta$:', tex: '\\sigma_{sl} = 18 - 72.7\\times(-0.342) = 18 + 24.9 = 42.9\\ \\mathrm{mN/m}' }, { text: 'Adhesion:', tex: 'W_a = 72.7\\,(1 - 0.342) = 47.8\\ \\mathrm{mJ/m^2}' }, 'Cohesion of water on itself is $2\\sigma = 145$ mJ/m².'],
      a: 'σsl ≈ 43 mN/m, and water adheres to Teflon with only a third of the energy by which it sticks to itself, so it balls up.' },
    { title: 'The lotus leaf', q: 'A wax surface has θ = 110°. It is textured with fine pillars so that only 5 % of the area under a drop touches the wax. What angle does the drop make?',
      steps: ['$\\cos 110^\\circ = -0.342$.', { text: 'Cassie–Baxter:', tex: '\\cos\\theta^* = 0.05\\,(1 - 0.342) - 1 = -0.967' }, '$\\theta^* = \\arccos(-0.967) = 165^\\circ$.'],
      a: 'About 165°: a drop that is almost a ball, which rolls off at a slope of a degree or so and takes dust with it.' },
    { title: 'Does roughness help a repellent coating?', q: 'A wax coating of 105° is applied to a surface roughened to r = 1.4 and the liquid fills the grooves. What is the angle? Then do the same for glass of 30°.',
      steps: ['Wax: $\\cos105^\\circ = -0.259$, times 1.4 gives $-0.362$, so $\\theta_W = 111^\\circ$.', 'Glass: $\\cos30^\\circ = 0.866$, times 1.4 gives $1.21$, which is beyond 1: complete wetting.'],
      a: 'Wenzel roughness raises the wax’s angle from 105° to 111°, and takes the glass from 30° to complete wetting. It amplifies whatever the surface already does.' }
  ],
  quiz: [
    { q: 'Glass is wetted by water much better than polyethylene is because', choices: ['glass is smoother', 'glass has O–H groups that hydrogen-bond with water', 'water is attracted to glass by gravity', 'polyethylene is a metal'], a: 1, why: 'The surface of glass is covered with Si–OH groups, which make hydrogen bonds with water. Polyethylene is a hydrocarbon with only C–H bonds, which cannot do so, so water gains nothing by touching it.' },
    { q: 'A contact angle of 0° means', choices: ['the drop is a perfect sphere', 'the liquid wets the surface completely and spreads out', 'the liquid has no surface tension', 'the surface is repelling the liquid'], a: 1, why: 'At zero angle the drop spreads into a film: the solid likes the liquid at least as much as the liquid likes itself.' },
    { q: 'Raising the roughness of a surface whose smooth contact angle is 40° (liquid fills the grooves) will give an apparent angle that is', choices: ['larger than 40°', 'smaller than 40°', 'exactly 40°', 'always 90°'], a: 1, why: 'Wenzel: cos θ* = r cos θ, with r ≥ 1. For a wetting liquid (cos θ > 0), the cosine increases and the angle falls, so roughness makes a wettable surface wetter.' },
    { q: 'A drop on pillars with a solid fraction f = 0.02 of a material with θ = 100° shows about what angle (Cassie–Baxter)?', choices: ['100°', '130°', '150°', '170°'], a: 3, why: 'cos θ* = 0.02 × (−0.174 + 1) − 1 = −0.9835, which gives θ* = 169.5°. With so little contact the drop is nearly a sphere on air.' },
    { q: 'A smooth surface can give a water contact angle of 150° if its chemistry is chosen well enough.', a: false, why: 'The largest angle found on a flat surface is about 120°, on fluorinated, close-packed CF₃ groups. Angles of 150° and more need texture that traps air.' }
  ],
  applications: ['Waxed cars, treated windscreens and umbrellas: low surface energy to bead water and low hysteresis to shed it.', 'Self-cleaning glass and fabrics, including lotus-inspired paints and titanium dioxide windows that spread water into a film to wash off dirt.', 'Anti-fog goggles and mirrors, whose hydrophilic coating makes condensation spread as a film instead of misting.', 'Flotation in mining: ground ore is stirred in water with bubbles, and the hydrophobic particles of valuable mineral stick to the bubbles and rise.', 'Soldering and painting, which need the molten solder or wet paint to wet the metal or wall (flux and primer lower the contact angle), and printing, where ink must wet the paper but not the printing plate.'],
  history: 'Thomas Young stated the balance of the three tensions in 1805. Wenzel (1936) and Cassie and Baxter (1944) extended it to rough and porous surfaces. The “lotus effect” was identified by Barthlott and Neinhuis in 1997, who showed that the sacred lotus’s leaves are cleaned by rolling drops because of the wax and microscopic papillae of its surface, and set off the design of superhydrophobic coatings.',
  sources: ['de Gennes, Brochard-Wyart and Quéré, *Capillarity and Wetting Phenomena*, ch. 1 and 9.', 'Barthlott and Neinhuis, “Purity of the sacred lotus, or escape from contamination in biological surfaces”, *Planta* 202, 1 (1997).', 'Cassie and Baxter, “Wettability of porous surfaces”, *Transactions of the Faraday Society* 40, 546 (1944).', 'Quéré, “Wetting and roughness”, *Annual Review of Materials Research* 38, 71 (2008).'],
  sim: { id: 'surf-drops', params: { mode: 'wet', theta: 110 } }
},

/* ================================================================ 5. water striders and floating needles */
{
  id: 'water-striders-and-floating-needles', parent: 'surfaces-and-flow', title: 'Water striders and floating needles', level: 2,
  short: 'Each millimetre of contact line can carry the surface’s vertical pull, up to 2σ = 14.8 mg per millimetre of needle. A steel needle floats if it is thinner than about 1.6 mm; a water strider, with hydrophobic legs a centimetre long, stands on the same surface with a safety margin of ten or more.',
  keywords: ['water strider', 'pond skater', 'floating needle', 'razor blade', 'surface tension force', 'dimple', 'meniscus', 'hydrophobic legs', 'Gerris', 'mosquito larva', 'walking on water', 'basilisk lizard', 'Bond number'],
  prereq: ['surface-tension', 'wetting-and-contact-angle'],
  related: ['drops-and-bubbles', 'soap-and-surfactants', 'capillary-rise', 'physics:buoyancy', 'physics:surface-tension', 'hydraulics:surface-tension'],
  body: `
A steel sewing needle is almost eight times denser than water, and yet it can be made to lie on the surface of a bowl and stay there. A pond skater, or water strider, does the same all day, running across a pond at up to a metre a second without wetting its feet. Neither is floating in the sense that a cork or a boat floats. They are *held up by the surface*.

### The force that holds them
Lay a needle on the surface. Its weight pushes the water down into a shallow trough, a **dimple**, and the surface, now curved, pulls up on each side of the needle along the line where it meets the metal. Each side supplies a pull $\\sigma$ per unit length, directed along the surface, so that its upward part is $\\sigma\\sin\\psi$, where $\\psi$ is the slope of the dimple at the needle. With two sides, the support per unit length of needle is $2\\sigma\\sin\\psi$. It grows as the dimple deepens, until the surface at the needle is vertical ($\\psi = 90^\\circ$) and the pull is as large as it can be:

$$\\left(\\frac{m}{L}\\right)_{\\max} = \\frac{2\\sigma}{g} = 14.8\\ \\text{mg per millimetre of needle}.$$

Beyond that the surface cannot hold and the needle plunges through. The needle will not support more than that however long it is: the limit is set by the length of the contact line, not by the area.

### The shape of the dimple
Gravity and surface tension together fix the shape: the depth of the contact line below the flat water is $2\\ell_c\\sin(\\psi/2)$, where $\\ell_c = 2.7$ mm is the capillary length. At the limit the dimple is $\\sqrt2\\,\\ell_c = 3.9$ mm deep. The dimple fades away over about three capillary lengths, 8 mm, and so a needle on a glass of water pulls the whole surface into a gentle bowl.

### Which needles float
A round needle of radius $r$ and density $\\rho$ weighs $\\rho\\pi r^2 g$ per unit length, so the limit is $\\rho\\pi r^2 g = 2\\sigma$, or

$$r_{\\max} = \\sqrt{\\frac{2\\sigma}{\\pi\\rho g}}.$$

For steel (7,800 kg/m³) that is 0.78 mm, a diameter of 1.6 mm; for aluminium (2,700) 1.3 mm radius. The estimate leaves out the buoyancy of the part of the needle and dimple below the original level, so thick needles can float a little beyond it. In the same way a razor blade floats, not because it is thin but because its contact line is long: a perimeter of 13 cm can carry $\\sigma P \\approx$ 9.5 mN, about 0.96 g, more than the 0.65 g weight of the blade, while a one-penny coin (3.6 g, perimeter 6.4 cm, a limit of 0.47 g) sinks at once. A soap-wetted needle sinks, because soap lowers $\\sigma$ and lets water creep up and over the metal (see [[soap-and-surfactants]]); and a clean needle that gets wet sinks too, because a wetted surface cannot hold a convex meniscus.

### How the strider does it
A water strider (*Gerris*) weighs about 10 mg, which is 0.1 mN. Each of its legs lies along the surface for a centimetre or so. If the contact line were as favourable as it could be, one leg could hold 2σ times 1 cm, about 1.5 mN. This is the point of Gao and Jiang’s measurements of the legs (2004): the leg is covered with thousands of tiny oriented hairs per square millimetre, each grooved on a nanometre scale, which trap a layer of air, and the leg is so water-repellent (contact angle about 168°, as in the [[wetting-and-contact-angle|lotus leaf]]) that a single leg can be pressed several millimetres into the surface without wetting, with a load of about fifteen times the animal’s weight. The animal stands at a few per cent of this, and rows with its middle legs, which shed little whirlpools (vortices) into the water that carry the momentum, rather than making ripples (Hu, Chan and Bush, 2003).

### Why only small things walk on water
The weight of an animal grows as the cube of its length, but the support of the surface only as the length itself. A strider is safe; a mouse is not. Large animals that run on water, such as the basilisk lizard, do it by slapping the surface with their feet fast enough that the water’s inertia holds them for the instant.

> [!key] The surface of water can hold up at most its tension σ along each line where it touches an object: 14.8 mg per millimetre of needle. Hydrophobic hairs let a strider spread its weight over centimetres of leg; a thin needle only just can.`,
  ideas: ['A floating needle is held up by surface tension acting along both sides: at most 2σ per unit length, 14.8 mg per millimetre.', 'The dimple’s depth is 2ℓc sin(ψ/2): at the limit (vertical surface) it is √2 ℓc = 3.9 mm.', 'A round steel needle floats only if thinner than about 1.6 mm; a razor floats because its contact line is long.', 'The strider’s legs are hydrophobic and covered with grooved microhairs, which keep the water from wetting them and let each leg hold fifteen times the animal’s weight.', 'Weight scales as length cubed, support as length: only small animals can use the surface.'],
  pitfalls: ['“The needle floats because of buoyancy, like a ship” — It floats mainly because surface tension holds it up, with buoyancy of its dimple a small help. Push it below the surface and it sinks, because water is not displacing its weight.', '“Striders are light enough that the surface does not notice them” — The surface is bent into a dimple under each foot, which you can see as a shadow on the pond bed, and if you add soap to the water they sink at once.', '“Anything that does not wet will float” — The limit is the length of the contact line times σ. A coin of the same weight as a razor blade has too short a perimeter and sinks.'],
  terms: [
    { term: 'Dimple', also: ['meniscus depression', 'surface depression'], def: 'The trough that a floating object presses in the water surface. Its depth is 2ℓc sin(ψ/2) for a surface that meets the object at slope ψ, up to √2 ℓc = 3.9 mm.' },
    { term: 'Contact line', also: ['three-phase line'], def: 'The line where the water surface meets a solid and the air. Surface tension pulls along it, and its length sets how much weight the surface can support.' },
    { term: 'Water strider', also: ['pond skater', 'Gerridae', 'Gerris'], def: 'An insect of the family Gerridae that stands and runs on the surface of still water, supported by surface tension on its hairy hydrophobic legs; it weighs about 10 mg.' },
    { term: 'Microsetae', also: ['hydrophobic hairs'], def: 'The fine oriented hairs on a strider’s legs, each with nanometre grooves, which trap air and make the leg superhydrophobic.' },
    { term: 'Hydrophobic leg', def: 'A leg whose cuticle and hairs are not wetted by water (contact angle near 170°), so that the water surface holds it up without creeping over it.' }
  ],
  formulas: [
    { name: 'The most weight per length the surface carries', expr: 'ml = 2*sig/g', tex: '\\mu_{\\max} = \\frac{2\\sigma}{g}',
      vars: { ml: { name: 'largest mass per length', q: 'lindensity', unit: 'g/m', tex: '\\mu_{\\max}', hint: '1 g/m is 1 mg per millimetre.' }, sig: { name: 'surface tension', q: 'surfacetension', unit: 'mN/m', value: 72.7, tex: '\\sigma' }, g: { const: 'g' } },
      solveFor: 'ml', note: 'For a long thin object with two contact lines, one along each side, when the surface at the object is vertical. Soap or heat lowers it.',
      stories: { ml: 'What is the greatest mass per length of a long needle that water of tension {sig} can hold up?', sig: 'A water surface holds up at most {ml} of needle. What is its surface tension?' } },
    { name: 'The thickest round needle that floats', expr: 'r = sqrt(2*sig/(pi*rho*g))', tex: 'r_{\\max} = \\sqrt{\\frac{2\\sigma}{\\pi\\rho g}}',
      vars: { r: { name: 'largest radius', q: 'length', unit: 'mm', tex: 'r_{\\max}' }, sig: { name: 'surface tension', q: 'surfacetension', unit: 'mN/m', value: 72.7, tex: '\\sigma' }, rho: { name: 'density of the needle', q: 'density', unit: 'kg/m³', value: 7800, tex: '\\rho', hint: 'Steel 7,800; aluminium 2,700; copper 8,960; gold 19,300.' }, g: { const: 'g' } },
      solveFor: 'r', note: 'Surface tension alone, with the buoyancy of the dimple neglected, so a real needle can be a little thicker.',
      stories: { r: 'A round needle of density {rho} floats on water of tension {sig}. What is the largest radius it can have?', rho: 'The thickest needle that floats on water has radius {r}. What is its density?' } },
    { name: 'The load on a given contact line', expr: 'm = sig*Lc/g', tex: 'm_{\\max} = \\frac{\\sigma\\,L_c}{g}',
      vars: { m: { name: 'largest mass supported', q: 'mass', unit: 'mg', tex: 'm_{\\max}' }, sig: { name: 'surface tension', q: 'surfacetension', unit: 'mN/m', value: 72.7, tex: '\\sigma' }, Lc: { name: 'total length of contact line', q: 'length', unit: 'cm', value: 13, tex: 'L_c', hint: 'A flat plate: its perimeter. A leg or needle: twice its length, one line along each side.' }, g: { const: 'g' } },
      solveFor: 'm', note: 'The vertical pull of the surface at its best, per metre of contact line: σ. A razor blade has a 13 cm perimeter.',
      stories: { m: 'An object has a contact line {Lc} long on water of tension {sig}. How large a mass can the surface hold at most?', Lc: 'An object of {m} floats at the limit on water of tension {sig}. How long is its contact line?' } },
    { name: 'Depth of the dimple', expr: 'z = 2*lc*sin(psi/2)', tex: 'z = 2\\ell_c\\sin\\frac{\\psi}{2}',
      vars: { z: { name: 'depth of the contact line below the flat surface', q: 'length', unit: 'mm', tex: 'z' }, lc: { name: 'capillary length', q: 'length', unit: 'mm', value: 2.73, tex: '\\ell_c', hint: '2.73 mm for water at 20 °C.' }, psi: { name: 'slope of the surface at the contact line', q: 'angle', unit: '°', value: 30, min: 0, max: 90, tex: '\\psi', hint: 'The load per length is 2σ sin ψ; at 90° the surface cannot hold more.' } },
      solveFor: 'z', note: 'The exact result for a long needle, a two-dimensional dimple.',
      stories: { z: 'A needle bends the water surface to a slope of {psi} at its contact line. How deep is the dimple (ℓc = {lc})?' } }
  ],
  examples: [
    { title: 'The needle on the limit', q: 'What is the largest diameter of steel wire (7,800 kg/m³) that surface tension can float on water at 20 °C, and at 80 °C (σ = 62.7 mN/m)?',
      steps: [{ text: 'At 20 °C:', tex: 'r = \\sqrt{\\frac{2\\times0.0727}{\\pi\\times7800\\times9.81}} = \\sqrt{6.05\\times10^{-7}} = 0.78\\ \\mathrm{mm}' }, { text: 'At 80 °C:', tex: 'r = \\sqrt{\\frac{2\\times0.0627}{\\pi\\times7800\\times9.81}} = 0.72\\ \\mathrm{mm}' }],
      a: 'Diameters of 1.56 mm at 20 °C and 1.45 mm at 80 °C: warm water holds a slightly thinner needle.' },
    { title: 'Razor blade or penny', q: 'A razor blade (43 mm × 22 mm, 0.65 g) and a 1p coin (diameter 20.3 mm, 3.56 g) are laid carefully on water. Which can float?',
      steps: ['Blade: perimeter $= 2(43 + 22) = 130$ mm. Maximum $= \\sigma P/g = 0.0727 \\times 0.130 / 9.81 = 0.96$ g. The blade is 0.65 g: 68 % of the limit.', 'Coin: perimeter $= \\pi\\times20.3 = 64$ mm. Maximum $= 0.47$ g. The coin weighs 3.56 g: 7.5 times the limit.'],
      a: 'The blade floats, with a third to spare; the coin cannot. The blade is lighter and its contact line twice as long.' },
    { title: 'The strider’s safety factor', q: 'A strider of 12 mg stands on six legs, each in contact with the water for 4 mm of its length. By what factor is the surface’s limit above its weight?',
      steps: ['Contact line: six legs × two sides × 4 mm $= 48$ mm.', { text: 'Limit:', tex: 'm_{\\max} = \\frac{\\sigma L_c}{g} = \\frac{0.0727\\times0.048}{9.81} = 3.6\\times10^{-4}\\ \\mathrm{kg} = 356\\ \\mathrm{mg}' }, 'Factor: $356/12 = 30$.'],
      a: 'About 30 times. The dimples are only a few hundredths of a millimetre deep, far from the limit, which is why the animals can leap and brake without breaking through.' }
  ],
  quiz: [
    { q: 'A steel needle floats on water but sinks if pushed below the surface. It is held up chiefly by', choices: ['buoyancy as for a ship', 'the surface tension pulling up along the sides of the dimple', 'the low density of the needle', 'air trapped inside the needle'], a: 1, why: 'The needle is denser than water; if submerged it displaces much less than its weight. On the surface, the curved surface pulls up on it along its length.' },
    { q: 'What is the most mass that water’s surface can carry per millimetre of long thin needle?', answer: 14.8, unit: 'mg', why: '2σ/g = 2 × 0.0727 N/m / 9.81 m/s² = 14.8 g/m, which is 14.8 mg per millimetre.' },
    { q: 'You add soap to the water. The needle and the water strider', choices: ['float better, since soap is slippery', 'sink, because surface tension falls and the surface can no longer hold them', 'are unaffected', 'float but move more quickly'], a: 1, why: 'Soap cuts σ from 73 to about 30 mN/m, and its molecules also coat the legs and needle and let the water wet them. A strider put on soapy water sinks.' },
    { q: 'A larger animal of ten times the length of a strider (and the same shape) would need a surface supporting', choices: ['10 times the weight', '100 times the weight', '1,000 times the weight', 'the same weight'], a: 2, why: 'Weight grows as length cubed: 10³ = 1,000. The support grows only with the length, 10, so the large animal is 100 times worse off.' },
    { q: 'A razor blade floats on water and a coin of similar weight does not, because the blade has a lower density than the coin.', a: false, why: 'The deciding quantity is the length of the contact line, and the blade’s perimeter (about 13 cm) is twice the coin’s. The blade is just lighter in weight; its density is that of steel.' }
  ],
  applications: ['Mosquito larvae hang from the surface film by their breathing tubes; a thin layer of oil on a pond breaks the film and drowns them, a method used for a century in mosquito control.', 'Surface-tension microrobots modelled on the strider (such as the “Water Strider Robot” built at Carnegie Mellon in 2007) that walk on water on hydrophobic legs.', 'The ecology of ponds: striders, whirligig beetles and others live in the surface layer, and soaps and oil spills kill them.', 'Water-repellent fabrics and coatings, which use the same chemistry and texture as the strider’s legs.', 'Sprinkling grain or pollen on a pond: a floating dust of hydrophobic grains is held on the surface by the same mechanism.'],
  history: 'Floating a needle on water has been a standard demonstration of surface tension in physics lectures since the nineteenth century. The mechanics of the strider were worked out by Denny (1993) and Hu, Chan and Bush (2003), who showed that the animal rows by vortices, not by ripples as had been thought, and Gao and Jiang (2004) found the nanogrooved hairs of its legs.',
  sources: ['Bush and Hu, “Walking on water: biolocomotion at the interface”, *Annual Review of Fluid Mechanics* 38, 339 (2006).', 'Gao and Jiang, “Water-repellent legs of water striders”, *Nature* 432, 36 (2004).', 'Hu, Chan and Bush, “The hydrodynamics of water strider locomotion”, *Nature* 424, 663 (2003).', 'Vella, “Floating versus sinking”, *Annual Review of Fluid Mechanics* 47, 115 (2015).'],
  sim: 'surf-floating'
},

/* ================================================================ 6. soap and surfactants */
{
  id: 'soap-and-surfactants', parent: 'surfaces-and-flow', title: 'Soap and surfactants', level: 2,
  short: 'A soap molecule has a water-loving head and an oily tail. It crowds into the surface with its tail out of the water and cuts the surface tension from 73 to 25–38 mN/m; above the critical micelle concentration the rest roll up into micelles that carry grease away.',
  keywords: ['soap', 'surfactant', 'detergent', 'amphiphile', 'micelle', 'critical micelle concentration', 'CMC', 'Marangoni effect', 'pepper and soap', 'SDS', 'soap bubble', 'lung surfactant', 'emulsifier', 'foam'],
  prereq: ['surface-tension', 'wetting-and-contact-angle'],
  related: ['the-hydrophobic-effect', 'membranes-assemble-themselves', 'like-dissolves-like', 'hard-water-and-limescale', 'drops-and-bubbles', 'chemistry:solutions'],
  body: `
Sprinkle pepper on a dish of water and touch the middle with a soapy finger. The pepper rushes away to the rim at once, as if frightened. A drop of washing-up liquid has done something to the whole surface of the dish, in a fraction of a second, and the same trick explains how soap bubbles survive, how grease comes off a plate and how a newborn baby’s lungs stay open.

### A molecule with two minds
A **surfactant** (surface-active agent) is an **amphiphile**: one end is hydrophilic, a charged or polar head such as a sulfate, carboxylate or a short chain of ethylene oxide, which water can hydrogen-bond; the other end is a hydrocarbon tail of 10 to 18 carbons, which cannot. Ordinary soap is the sodium salt of a fatty acid (sodium stearate); synthetic detergents such as sodium dodecyl sulfate (SDS) have a sulfate head on a 12-carbon tail.

Put the molecule in water and its tail is unwelcome. A hydrocarbon in water cannot take part in the hydrogen-bond network, and the waters nearby must reorganise around it ([[the-hydrophobic-effect]]). The easiest escape for the tail is out of the water, into the air. So surfactant molecules flock to the surface, tails up and heads down, and form a monolayer. Each one that lands there replaces a patch of water–air surface by a surface that the water cannot feel, and the surface tension falls. For SDS the fall is from 72.7 to about 38 mN/m when the surface is full, at an area of about 0.5 nm² per molecule; a dishwashing liquid, which has several surfactants, reaches 25–30.

### The critical micelle concentration
Once the surface is full, the extra molecules must go somewhere else. Above a threshold, the **critical micelle concentration** (CMC), they gather into **micelles**: balls of 50–100 molecules, 4 nm across, with the tails shut in a core of oil and the heads covering the outside. For SDS the CMC is 8.2 mmol/L, about 2.4 g/L. Above the CMC, the free concentration stays almost fixed, the surface tension stays at its floor and every further molecule goes into a micelle. (The simulation draws this: the curve is a fit to these two numbers.)

### How soap cleans
A greasy plate is cleaned in several steps. The solution wets the surface and spreads under the grease because its tension is low. Surfactant on the grease–water interface cuts that interfacial tension by a factor of a hundred or more, so that stirring breaks the grease into droplets. And the oily core of a micelle takes grease into itself, dissolving it. The charged heads covering each droplet repel one another, which keeps the grease from sticking back on the plate. This is why cleaning improves sharply near and above the CMC, where micelles are present to take the grease up.

### Why bubbles last, and the pepper trick
A soap film is not stable merely because the tension is low. It is stable because the surfactant makes it **self-repairing**. If a patch of film thins and stretches, its surfactant spreads over a larger area, the surface tension of that patch rises, and the higher tension pulls fresh liquid and surfactant towards it. The same Marangoni effect (Carlo Marangoni, 1865) explains the pepper: soap lowers the tension at the touched spot, and the surface is pulled outwards by the clean water, where the tension is still high, carrying the pepper with it. The flow is quick, a few centimetres per second.

### The lung
A lung has some 500 million alveoli, wet air sacs about 0.1 mm in radius. By the Laplace pressure of [[drops-and-bubbles]], the lining fluid at 50 mN/m would press the sac shut with 1 kPa, and small sacs would empty into big ones. The cells line them with a surfactant (mostly dipalmitoyl phosphatidylcholine) that cuts the tension to 5 mN/m or less when the sac is small, and a baby born too early may lack it, which is respiratory distress syndrome (Avery and Mead, 1959).

> [!key] Surfactants are molecules with a water-loving head and an oily tail: they fill the surface and lower its tension, and above the critical micelle concentration they form balls that dissolve grease. Gradients of surface tension (Marangoni flow) move the pepper, repair soap films and keep the lungs open.`,
  ideas: ['A surfactant has a hydrophilic head and a hydrocarbon tail, so it collects at the surface with its tail out of the water and lowers σ.', 'The surface fills at a concentration called the CMC (8.2 mmol/L for SDS, where σ ≈ 38 mN/m); beyond it the extra molecules form micelles.', 'Micelles (tails inside) carry oil in their cores; that, with a low interfacial tension, is how detergents lift grease.', 'Where surface tension differs from place to place, the surface flows towards high tension (Marangoni effect): pepper flees soap, and a stretched soap film repairs itself.', 'Lung surfactant lowers the tension of the lining fluid so that the alveoli do not collapse; without it a newborn cannot breathe.'],
  pitfalls: ['“Soap makes water wetter by thinning it” — Soap does not change the water’s viscosity or any bulk property; it lowers the surface tension, so water spreads and wets things more readily.', '“Soap dissolves dirt in the same way water dissolves sugar” — Soap does not dissolve grease in water. It breaks it into droplets and encloses it in micelles, so the grease is carried away in suspension.', '“A lower surface tension makes bubbles weaker” — Pure water, with the highest tension, does not make bubbles at all: it has no Marangoni elasticity to repair thin spots. Soap lowers the tension but gives the film the ability to heal.'],
  terms: [
    { term: 'Surfactant', also: ['surface-active agent', 'amphiphile', 'detergent'], def: 'A molecule with a hydrophilic head and a hydrophobic tail, which collects at interfaces and lowers the surface or interfacial tension. Soap, SDS and the phospholipids of cell membranes are surfactants.' },
    { term: 'Micelle', def: 'A ball, a few nanometres across, of 50–100 surfactant molecules, with their tails together in an oily core and their heads in the water outside. It can hold grease in its core.' },
    { term: 'Critical micelle concentration', also: ['CMC'], def: 'The concentration above which a surfactant forms micelles: 8.2 mmol/L for sodium dodecyl sulfate at 25 °C. Above it the surface tension no longer falls.' },
    { term: 'Marangoni effect', also: ['Marangoni flow', 'Gibbs–Marangoni effect'], def: 'The flow along an interface, or in a film, from a region of low surface tension to a region of high surface tension. It drives the spreading of soap, tears of wine and the self-repair of soap films.' },
    { term: 'Pulmonary surfactant', also: ['lung surfactant'], def: 'The mixture of phospholipids and proteins (mostly dipalmitoyl phosphatidylcholine) that lines the alveoli and lowers the surface tension of their wet lining to 5 mN/m or less, preventing the sacs from collapsing.' }
  ],
  formulas: [
    { name: 'Surface tension of a surfactant solution (Szyszkowski)', expr: 'sig = sig0 - R*T*Gm*ln(1 + c/a)', tex: '\\sigma = \\sigma_0 - R\\,T\\,\\Gamma_{\\max}\\,\\ln\\left(1 + \\frac{c}{a}\\right)',
      vars: { sig: { name: 'surface tension of the solution', q: 'surfacetension', unit: 'mN/m', tex: '\\sigma' }, sig0: { name: 'surface tension of pure water', q: 'surfacetension', unit: 'mN/m', value: 72.7, tex: '\\sigma_0' }, R: { const: 'R' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 20, tex: 'T' }, Gm: { name: 'saturated surface concentration', unit: 'mol/m²', value: 3.3e-6, tex: '\\Gamma_{\\max}', hint: 'About 3.3 µmol/m², or 0.5 nm² per molecule, for SDS.' }, c: { name: 'concentration', q: 'concentration', unit: 'mmol/L', value: 2, tex: 'c', hint: 'Valid up to the CMC (8.2 mmol/L for SDS); above it σ stays constant.' }, a: { name: 'adsorption constant', q: 'concentration', unit: 'mmol/L', value: 0.12, tex: 'a', hint: 'Fitted: 0.12 mmol/L makes SDS reach 38 mN/m at its CMC.' } },
      solveFor: 'sig', note: 'A Szyszkowski equation fitted to SDS. Use it up to the CMC.',
      stories: { sig: 'An SDS-like surfactant (Γmax = {Gm}, a = {a}) is added to water at {T} to reach {c}. What is the surface tension?', c: 'A surfactant solution has σ = {sig}. What is its concentration (Γmax = {Gm}, a = {a})?' } },
    { name: 'Area of one molecule at the surface', expr: 'A = 1/(Gm*NA)', tex: 'A = \\frac{1}{\\Gamma\\,N_A}',
      vars: { A: { name: 'area per molecule', q: 'area', unit: 'nm²', tex: 'A' }, Gm: { name: 'surface concentration', unit: 'mol/m²', value: 3.3e-6, tex: '\\Gamma' }, NA: { const: 'NA' } },
      solveFor: 'A', note: 'At saturation SDS packs at about 0.5 nm² per molecule, the cross-section of a hydrocarbon chain with its head.',
      stories: { A: 'A surfactant covers the surface at {Gm}. How much area does each molecule have?' } },
    { name: 'The share of surfactant in micelles', expr: 'fm = (c - cmc)/c', tex: 'f_m = \\frac{c - c_{\\mathrm{cmc}}}{c}',
      vars: { fm: { name: 'fraction in micelles', q: 'ratio', unit: '%', tex: 'f_m' }, c: { name: 'total concentration', q: 'concentration', unit: 'mmol/L', value: 30, tex: 'c', hint: 'Must exceed the CMC.' }, cmc: { name: 'critical micelle concentration', q: 'concentration', unit: 'mmol/L', value: 8.2, tex: 'c_{\\mathrm{cmc}}', hint: '8.2 mmol/L for SDS at 25 °C.' } },
      solveFor: 'fm', note: 'The free concentration stays at the CMC; everything beyond it is in micelles (the approximation of a sharp CMC).',
      stories: { fm: 'A solution holds {c} of surfactant with a CMC of {cmc}. What fraction is in micelles?' } },
    { name: 'The pressure to hold an alveolus open', expr: 'p = 2*sig/r', tex: 'p = \\frac{2\\sigma}{r}',
      vars: { p: { name: 'Laplace pressure', q: 'pressure', unit: 'kPa', tex: 'p' }, sig: { name: 'surface tension of the lining fluid', q: 'surfacetension', unit: 'mN/m', value: 50, tex: '\\sigma', hint: 'About 50 mN/m without surfactant, 5 mN/m or less with it at low volume.' }, r: { name: 'radius of the alveolus', q: 'length', unit: 'µm', value: 100, tex: 'r' } },
      solveFor: 'p', note: 'A one-surface sac. Real alveoli are not perfect spheres, and their radius changes in breathing.',
      stories: { p: 'An alveolus of radius {r} is lined with fluid of surface tension {sig}. What pressure would it take to keep it from collapsing?' } }
  ],
  examples: [
    { title: 'The curve of a surfactant', q: 'Using the fitted constants for SDS (Γmax = 3.3 µmol/m², a = 0.12 mmol/L) at 20 °C, what is the surface tension at 2 mmol/L?',
      steps: ['$RT\\Gamma_{\\max} = 8.314\\times293.15\\times3.3\\times10^{-6} = 8.04\\times10^{-3}$ N/m $= 8.04$ mN/m.', '$\\ln(1 + 2/0.12) = \\ln 17.7 = 2.87$.', { text: '', tex: '\\sigma = 72.7 - 8.04\\times2.87 = 49.6\\ \\mathrm{mN/m}' }],
      a: 'About 50 mN/m: a concentration of a quarter of the CMC has already cut the surface tension by a third.' },
    { title: 'Why a baby needs surfactant', q: 'Compare the Laplace pressure of an alveolus of radius 100 µm lined with fluid at 50 mN/m and with fluid at 5 mN/m.',
      steps: [{ text: 'Without:', tex: 'p = 2\\times0.050/10^{-4} = 1.0\\ \\mathrm{kPa}' }, { text: 'With:', tex: 'p = 2\\times0.005/10^{-4} = 0.1\\ \\mathrm{kPa}' }],
      a: '1.0 kPa (7.5 mmHg) against 0.1 kPa: the surfactant cuts the effort of inflating the lung to a tenth, and it stops the small sacs emptying into the large ones.' },
    { title: 'Where did the surfactant go?', q: 'A solution of SDS at 25 mmol/L is made. What fraction of the molecules is in micelles, and how many mmol/L are free in the water?',
      steps: ['Free: the CMC, 8.2 mmol/L.', { text: 'Fraction in micelles:', tex: 'f_m = \\frac{25 - 8.2}{25} = 0.67' }],
      a: 'Two-thirds are in micelles (16.8 mmol/L); the free concentration stays at 8.2 mmol/L, and so does the surface tension.' }
  ],
  quiz: [
    { q: 'Why do surfactant molecules collect at the surface of water?', choices: ['Their heads are heavier', 'Their oily tails are better out of the water, in the air', 'They are attracted by the air’s oxygen', 'Heat drives them upwards'], a: 1, why: 'The hydrocarbon tail does not fit in the hydrogen-bonded network of water. The surface lets the tail stand in the air, while the head stays in the water.' },
    { q: 'Above the critical micelle concentration, adding more surfactant', choices: ['lowers the surface tension to zero', 'does not lower it further, because the extra goes into micelles', 'raises the surface tension', 'turns the solution into a gel'], a: 1, why: 'The free concentration, and with it the surface tension, stays at its value at the CMC; the extra molecules are in micelles.' },
    { q: 'Pepper is sprinkled on water and a drop of detergent is placed in the middle. The pepper moves', choices: ['towards the soap', 'away from the soap, towards the high-tension clean water', 'in circles', 'not at all'], a: 1, why: 'The surface is pulled towards the region of higher tension, the clean water, so the surface flow sweeps the pepper away from the soap.' },
    { q: 'An alveolus of radius 0.1 mm lined with fluid at 5 mN/m has what Laplace pressure, in pascals?', answer: 100, unit: 'Pa', why: '2σ/r = 2 × 0.005 / 10⁻⁴ = 100 Pa, a tenth of the 1 kPa that fluid at 50 mN/m would produce.' },
    { q: 'Soap works by dissolving grease in the water as sugar dissolves.', a: false, why: 'Grease is not soluble in water. Soap lowers the oil–water tension so that stirring breaks the grease into droplets, and micelles hold part of it in their oily cores, carried away in suspension.' }
  ],
  applications: ['Washing: laundry and dish detergents, shampoos and soaps, all of which rely on wetting, emulsifying and micellar solubilisation.', 'Food: lecithin and other emulsifiers keep the oil and water of mayonnaise, chocolate and ice cream together.', 'Oil-spill dispersants break a slick into droplets small enough to be carried into the water and broken down by microbes.', 'Foams for firefighting, shaving, brewing and froth flotation, where surfactant-stabilised bubbles pick out minerals.', 'Medicine: artificial surfactant (poractant, beractant) given to premature babies since about 1990 has sharply cut deaths from respiratory distress.'],
  history: 'Soap was made in Babylon around 2800 BC by boiling fat with ash, and synthetic detergents were developed in Germany during the First World War, when fats were short. Carlo Marangoni described the flow caused by differences of surface tension in his 1865 doctoral thesis, and James Thomson (Kelvin’s brother) had explained the “tears” of wine in 1855. Avery and Mead showed in 1959 that premature infants’ lungs lack a surface-active substance.',
  sources: ['Israelachvili, *Intermolecular and Surface Forces* (3rd ed., Academic Press, 2011), ch. 20 (micelles and self-assembly).', 'Rosen and Kunjappu, *Surfactants and Interfacial Phenomena* (4th ed., Wiley, 2012).', 'Tanford, *The Hydrophobic Effect* (2nd ed., Wiley, 1980).', 'Avery and Mead, “Surface properties in relation to atelectasis and hyaline membrane disease”, *American Journal of Diseases of Children* 97, 517 (1959).'],
  sim: 'surf-surfactants'
},

/* ================================================================ 7. the viscosity of water */
{
  id: 'viscosity-of-water', parent: 'surfaces-and-flow', title: 'The viscosity of water', level: 2,
  short: 'Water flows with a viscosity of 1.00 mPa·s at 20 °C: six times less at 100 °C than at 0 °C, and not unusually thick for a liquid. A dust grain falls through it at Stokes’ speed, and its flow switches from smooth to turbulent at a Reynolds number of about two thousand.',
  keywords: ['viscosity', 'mPa·s', 'centipoise', 'Stokes’ law', 'terminal velocity', 'sedimentation', 'Reynolds number', 'Poiseuille', 'laminar', 'turbulent', 'kinematic viscosity', 'temperature dependence', 'pressure anomaly', 'honey'],
  prereq: ['what-a-hydrogen-bond-is', 'bonds-that-flicker'],
  related: ['viscosity-and-diffusion-under-pressure', 'the-list-of-anomalies', 'the-leidenfrost-effect', 'physics:viscosity', 'hydraulics:viscosity', 'hydraulics:viscosity-temperature', 'chemistry:surface-tension-viscosity', 'feynman:flow-of-wet-water', 'feynman:brownian-movement'],
  body: `
Stir a cup of tea and the swirl dies away in a few seconds. Stir honey and it holds its shape, and ropes off the spoon. The difference is **viscosity**, the internal friction of a fluid: how strongly layers of the liquid that slide past each other drag one another along. A sheet of area $A$ pulled across a liquid layer of thickness $d$ at speed $v$ meets a force $F = \\eta A v/d$, and the constant $\\eta$ is the viscosity.

### The numbers
For water at 20 °C, $\\eta = 1.00$ mPa·s, which is nearly the definition of the centipoise (1 cP is water at 20.2 °C). Divide by the density and you get the **kinematic viscosity** $\\nu = \\eta/\\rho = 1.00$ mm²/s, the centistokes. It falls steeply when water is heated:

| Temperature | η of water (mPa·s) |
|---|---|
| 0 °C | 1.78 |
| 10 °C | 1.31 |
| 20 °C | 1.00 |
| 40 °C | 0.65 |
| 60 °C | 0.47 |
| 100 °C | 0.28 |

| Fluid at about 20 °C | η (mPa·s) |
|---|---|
| air | 0.018 |
| hexane | 0.30 |
| ethanol | 1.07 |
| mercury | 1.53 |
| olive oil | 84 |
| glycerol | 1,412 |
| honey | 2,000–10,000 (depends on its water content) |

Pitch, at about 2×10¹¹ Pa·s, is some 10¹⁴ times as viscous as water, and a drop of it falls from a funnel once in a decade. The surprise is how ordinary water is: it is no thicker than ethanol, a third *less* viscous than mercury, and it flows as freely as its hydrogen bonds allow, since each lasts only a picosecond ([[bonds-that-flicker]]).

### Why it falls with heat
To flow, a molecule must move from one cage of neighbours into the next, and that requires breaking part of its bonds. The rate of such jumps grows as $\\exp(-E_a/RT)$, and viscosity is the inverse of it: $\\eta \\propto \\exp(E_a/RT)$. Between 0 and 100 °C water’s viscosity changes by a factor of 6.3, which gives $E_a \\approx 16$ kJ/mol, close to the 20 kJ/mol of one hydrogen bond. The fit is not a straight Arrhenius line (the Vogel equation in the calculator below is better), but the picture is right: the flow of water is limited by how often hydrogen bonds let go. This is also why heavy water, with its stronger bonds, is 23 % more viscous than ordinary water.

### Squeezing water makes it flow faster
Almost all liquids get more viscous when compressed. Water below about 33 °C does the opposite: at 0 °C, compression to 1,000 bar lowers the viscosity by about 8 %. Röntgen reported this in 1892. It is one of the anomalies of water, and an expression of the same structure that makes ice float: the open, hydrogen-bonded arrangement holds the molecules back, and pressure disrupts it ([[viscosity-and-diffusion-under-pressure]], [[the-list-of-anomalies]]).

### Things falling through water: Stokes’ law
A small sphere of radius $r$ moving at speed $v$ through a viscous fluid is dragged back by $F = 6\\pi\\eta r v$ (Stokes, 1851). A sphere that is denser than the fluid falls until the drag matches its weight less buoyancy, at the **terminal speed**

$$v = \\frac{2r^2(\\rho_p - \\rho_f)\\,g}{9\\eta}.$$

The speed grows as the square of the size. A 10 µm water droplet falls through air at about 3 mm/s (it takes four days to fall a kilometre, so clouds stay up); a 1 µm grain of clay falls through water at 0.9 µm/s, a metre in two weeks; a 100 µm grain of sand falls at 9 mm/s. This is the principle of the settling tank, of the separation of soil into sand, silt and clay, and of Millikan’s oil-drop measurement of the charge on the electron.

### Smooth and turbulent: the Reynolds number
Whether viscosity matters depends on size and speed through the **Reynolds number** $\\mathrm{Re} = \\rho v L/\\eta$, the ratio of inertia to viscous force. Below about 1 the flow is smooth, creeping and reversible, as Stokes’ law needs; in a pipe, flow stays smooth up to $\\mathrm{Re} \\approx 2{,}000$ and turns turbulent above 3,000–4,000. A swimmer in a pool has $\\mathrm{Re} \\approx 10^6$; a bacterium, about $10^{-5}$ (Purcell, 1977), for which water is as thick as treacle is to us, and a bacterium that stops pushing stops dead in a distance smaller than an atom.

> [!key] Water’s viscosity, 1.00 mPa·s at 20 °C, is that of an ordinary liquid and falls sixfold from 0 to 100 °C as hydrogen bonds let go more often. It sets the speed at which things settle (Stokes) and where the flow turns turbulent (Reynolds number about 2,000).`,
  ideas: ['The viscosity of water is 1.00 mPa·s at 20 °C (1.78 at 0 °C, 0.28 at 100 °C), the same order as ethanol and mercury: not unusually thick.', 'It falls with heat because bonds break more often: the apparent activation energy of flow, 16 kJ/mol, is close to one hydrogen bond.', 'Below about 33 °C compressing water makes it flow more easily, which is the reverse of other liquids (an anomaly).', 'Stokes’ law gives the terminal speed 2r²Δρg/(9η) of a small sphere; it grows as the square of the size.', 'The Reynolds number ρvL/η tells whether flow is smooth (below about 2,000 in a pipe) or turbulent; for bacteria it is 10⁻⁵.'],
  pitfalls: ['“Water is a very viscous liquid because it is so sticky” — Hydrogen bonds hold the molecules together, but they break every picosecond. Water’s viscosity is that of ethanol, and a third below mercury’s.', '“A heavy object always falls faster in water, in proportion to its weight” — For small objects the speed goes as the square of the radius (Stokes), not the weight, and a 1 µm grain falls a million times slower than a 1 mm one, at the same density.', '“Pressure always thickens a liquid” — That is true of most liquids and of cold water above about 33 °C, but below that temperature a moderate pressure lowers the viscosity of water.'],
  terms: [
    { term: 'Viscosity', also: ['dynamic viscosity', 'η', 'internal friction'], def: 'The resistance of a fluid to shear: the force per area needed to slide one layer past another, divided by the velocity gradient. Water: 1.00 mPa·s at 20 °C.' },
    { term: 'Kinematic viscosity', also: ['ν', 'centistokes'], def: 'The viscosity divided by the density, ν = η/ρ, which governs how quickly momentum diffuses through a fluid. Water at 20 °C: 1.00 mm²/s, which is one centistokes.' },
    { term: 'Stokes’ law', also: ['Stokes drag'], def: 'The drag on a small sphere of radius r moving slowly at speed v through a fluid of viscosity η: F = 6πηrv. It gives the terminal speed 2r²(ρp − ρf)g/(9η).' },
    { term: 'Reynolds number', also: ['Re'], def: 'The dimensionless ratio ρvL/η of inertial to viscous forces. Below about 1 the flow is creeping; in a pipe it becomes turbulent above about 2,300–4,000.' },
    { term: 'Poise and centipoise', also: ['P', 'cP'], def: 'Old units of viscosity: 1 P = 0.1 Pa·s, 1 cP = 1 mPa·s. The centipoise is almost exactly the viscosity of water at 20 °C (1.002).' },
    { term: 'Laminar flow', also: ['streamline flow'], def: 'Smooth flow in which layers of fluid slide past one another without mixing, found at low Reynolds number; it contrasts with turbulent flow.' }
  ],
  formulas: [
    { name: 'Terminal speed of a small sphere (Stokes)', expr: 'v = 2*r^2*drho*g/(9*eta)', tex: 'v = \\frac{2\\,r^2\\,\\Delta\\rho\\,g}{9\\,\\eta}',
      vars: { v: { name: 'terminal speed', q: 'speed', unit: 'mm/s', tex: 'v' }, r: { name: 'radius of the sphere', q: 'length', unit: 'µm', value: 5, tex: 'r' }, drho: { name: 'density of sphere minus density of fluid', q: 'density', unit: 'kg/m³', value: 997, tex: '\\Delta\\rho', hint: 'About 1,650 for sand or clay in water; 997 for a water droplet in air.' }, g: { const: 'g' }, eta: { name: 'viscosity of the fluid', q: 'viscosity', unit: 'mPa·s', value: 0.0181, tex: '\\eta', hint: '1.0 for water at 20 °C; 0.0181 for air.' } },
      solveFor: 'v', note: 'Valid for Reynolds number below about 1. A negative density difference means the sphere rises.',
      stories: { v: 'A sphere of radius {r} and excess density {drho} falls through a fluid of viscosity {eta}. How fast does it fall?', r: 'A particle with excess density {drho} falls at {v} in a fluid of viscosity {eta}. What is its radius?' } },
    { name: 'Drag on a slow sphere (Stokes)', expr: 'F = 6*pi*eta*r*v', tex: 'F = 6\\pi\\,\\eta\\,r\\,v',
      vars: { F: { name: 'drag force', q: 'force', unit: 'µN', tex: 'F' }, eta: { name: 'viscosity', q: 'viscosity', unit: 'mPa·s', value: 1.0, tex: '\\eta' }, r: { name: 'radius', q: 'length', unit: 'mm', value: 1, tex: 'r' }, v: { name: 'speed', q: 'speed', unit: 'mm/s', value: 1, tex: 'v' } },
      solveFor: 'F', note: 'Linear in speed and in radius (not in area): the signature of viscous drag at low Reynolds number.',
      stories: { F: 'A sphere of radius {r} moves at {v} through water of viscosity {eta}. What is the drag?' } },
    { name: 'The Reynolds number', expr: 'Re = rho*v*L/eta', tex: '\\mathrm{Re} = \\frac{\\rho\\,v\\,L}{\\eta}',
      vars: { Re: { name: 'Reynolds number', tex: '\\mathrm{Re}', hint: 'Below 1: creeping flow; about 2,000 in a pipe: the change to turbulence.' }, rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 998, tex: '\\rho' }, v: { name: 'speed', q: 'speed', unit: 'm/s', value: 2, tex: 'v' }, L: { name: 'size (pipe diameter, body length)', q: 'length', unit: 'cm', value: 1.5, tex: 'L' }, eta: { name: 'viscosity', q: 'viscosity', unit: 'mPa·s', value: 1.0, tex: '\\eta' } },
      solveFor: 'Re', note: 'A garden hose at 2 m/s (15 mm bore) has Re of about 30,000: fully turbulent.',
      stories: { Re: 'Water flows at {v} through a pipe of diameter {L}. What is the Reynolds number?', v: 'At what speed does water in a pipe of diameter {L} reach Re = {Re}?' } },
    { name: 'Laminar flow in a pipe (Hagen–Poiseuille)', expr: 'Q = pi*r^4*dp/(8*eta*L)', tex: 'Q = \\frac{\\pi\\,r^4\\,\\Delta p}{8\\,\\eta\\,L}',
      vars: { Q: { name: 'volume flow rate', q: 'flowrate', unit: 'mL/s', tex: 'Q' }, r: { name: 'radius of the tube', q: 'length', unit: 'mm', value: 1, tex: 'r', hint: 'The fourth power: halving the radius cuts the flow sixteenfold.' }, dp: { name: 'pressure drop along the tube', q: 'pressure', unit: 'kPa', value: 1, tex: '\\Delta p' }, eta: { name: 'viscosity', q: 'viscosity', unit: 'mPa·s', value: 1.0, tex: '\\eta' }, L: { name: 'length of the tube', q: 'length', unit: 'm', value: 1, tex: 'L' } },
      solveFor: 'Q', note: 'For smooth laminar flow in a round tube only (Re below about 2,000). In a turbulent pipe the flow rises only as the square root of the pressure drop.',
      stories: { Q: 'Water is driven through a tube of radius {r} and length {L} by a pressure drop of {dp}. What is the flow rate?', dp: 'A tube of radius {r} and length {L} carries {Q} of water. What pressure drop drives it?' } },
    { name: 'Viscosity of water against temperature (Vogel)', expr: 'eta = A*exp(B/(T - C))', tex: '\\eta = A\\,\\exp\\left(\\frac{B}{T - C}\\right)',
      vars: { eta: { name: 'viscosity', q: 'viscosity', unit: 'mPa·s', tex: '\\eta' }, A: { name: 'prefactor', q: 'viscosity', unit: 'mPa·s', value: 0.02939, fixed: true, tex: 'A' }, B: { name: 'constant B', q: 'dtemp', unit: 'K', value: 507.88, fixed: true, tex: 'B' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 20, min: 0, max: 150, tex: 'T' }, C: { name: 'constant C', q: 'temperature', unit: 'K', value: 149.3, fixed: true, tex: 'C' } },
      solveFor: 'eta', note: 'A fit good to about 1 % between 0 and 100 °C (the form used for the numbers in this topic).',
      stories: { eta: 'What is the viscosity of water at {T}?', T: 'At what temperature is the viscosity of water {eta}?' } }
  ],
  examples: [
    { title: 'A cloud droplet', q: 'How fast does a water droplet of 10 µm diameter fall through still air (η = 18.1 µPa·s, ρ = 1.2 kg/m³)? Is Stokes’ law valid?',
      steps: [{ text: 'Radius 5 µm, excess density $\\approx 997$ kg/m³:', tex: 'v = \\frac{2(5\\times10^{-6})^2(997)(9.81)}{9\\times1.81\\times10^{-5}} = 3.0\\times10^{-3}\\ \\mathrm{m/s}' }, { text: 'Check the Reynolds number:', tex: '\\mathrm{Re} = \\frac{1.2\\times3.0\\times10^{-3}\\times10^{-5}}{1.81\\times10^{-5}} = 0.002' }],
      a: '3 mm/s, with Re = 0.002 so Stokes’ law holds. At that speed it takes four days to fall a kilometre, which is why clouds hang in the sky until the droplets grow and merge.' },
    { title: 'Muddy water', q: 'How long does a clay grain of 1 µm diameter and density 2,650 kg/m³ take to settle 1 m in still water at 20 °C?',
      steps: [{ text: '', tex: 'v = \\frac{2(0.5\\times10^{-6})^2(1652)(9.81)}{9\\times1.0\\times10^{-3}} = 9.0\\times10^{-7}\\ \\mathrm{m/s}' }, 'Time for 1 m: $1/9.0\\times10^{-7} = 1.1\\times10^{6}$ s.'],
      a: 'About 13 days. Grains of 0.1 µm take a hundred times longer (3.5 years), and are kept in suspension indefinitely by Brownian motion: a river stays muddy long after the rain.' },
    { title: 'Why a thin tube is such a restriction', q: 'Water is driven by 1 kPa through 1 m of tube of radius 1 mm. What flow results, and what if the radius is halved?',
      steps: [{ text: '', tex: 'Q = \\frac{\\pi r^4\\Delta p}{8\\eta L} = \\frac{\\pi\\,(10^{-3})^4\\,(10^3)}{8\\,(10^{-3})(1)} = 3.9\\times10^{-7}\\ \\mathrm{m^3/s}' }, 'Halving $r$ divides $Q$ by $2^4 = 16$.'],
      a: '0.39 mL/s, and 0.025 mL/s with the thinner tube. The fourth power is why a vessel narrowed to half its radius would need sixteen times the pressure to carry the same flow.' }
  ],
  quiz: [
    { q: 'By what factor does the viscosity of water change between 0 °C and 100 °C?', choices: ['It doubles', 'It falls by a factor of about 6', 'It falls by a factor of about 60', 'It does not change'], a: 1, why: 'From 1.78 mPa·s at 0 °C to 0.28 mPa·s at 100 °C, a factor of 6.3. Hydrogen bonds break more often at higher temperature, so molecules can move more freely.' },
    { q: 'A sphere falls slowly through a viscous liquid. If its diameter is doubled (same material), its terminal speed (Stokes) is', choices: ['unchanged', 'doubled', '4 times greater', '8 times greater'], a: 2, why: 'The terminal speed is proportional to the radius squared, so doubling the diameter multiplies the speed by 4.' },
    { q: 'A bacterium swims with a Reynolds number of about 10⁻⁵. What does that mean?', choices: ['Inertia dominates: it coasts a long way', 'Viscous forces dominate: it stops almost at once when it stops pushing', 'The flow around it is turbulent', 'It is too small to experience viscosity'], a: 1, why: 'At low Reynolds number the viscous force overwhelms inertia, so motion stops almost instantly when the propulsion ceases, and the motion has to be non-reciprocal to get anywhere.' },
    { q: 'In laminar flow in a round tube, halving the radius (at the same pressure drop) cuts the flow by a factor of', answer: 16, why: 'Hagen–Poiseuille: Q is proportional to r⁴, and 2⁴ = 16.' },
    { q: 'Water is unusually viscous compared with other liquids.', a: false, why: 'Its viscosity (1.0 mPa·s) is about the same as ethanol’s (1.07) and lower than mercury’s (1.5); hexane is 0.3, olive oil 84. Water’s unusual feature is how its viscosity responds to pressure, not how large it is.' }
  ],
  applications: ['Settling tanks, clarifiers and sedimentation tests in water treatment, which rely on Stokes’ law to size the basins.', 'Soil texture analysis, where a hydrometer follows the settling of a soil suspension in water to find the shares of sand, silt and clay.', 'Blood flow and the design of intravenous lines: the fourth-power law of Poiseuille makes the needle gauge matter far more than its length.', 'Swimming and fish locomotion, set by the Reynolds number, from a bacterium (10⁻⁵) to a whale (10⁸).', 'Viscometers for oils and paints: the falling ball (Stokes’ law) and the capillary viscometer, used to grade lubricants.'],
  history: 'The physician Jean Poiseuille measured the flow of water and blood through narrow glass tubes in 1838–46 to understand the circulation (the unit poise is named after him), and Hagen reached the same law in 1839. Stokes derived the drag on a sphere in 1851. Reynolds showed in 1883, with a thread of dye in a glass pipe, that flow changes from smooth to turbulent at a critical value of $\\rho v d/\\eta$. Röntgen found in 1892 that pressure lowers the viscosity of cold water.',
  sources: ['Kestin, Sokolov and Wakeham, “Viscosity of liquid water in the range −8 °C to 150 °C”, *Journal of Physical and Chemical Reference Data* 7, 941 (1978).', 'Purcell, “Life at low Reynolds number”, *American Journal of Physics* 45, 3 (1977).', 'Eisenberg and Kauzmann, *The Structure and Properties of Water*, ch. 4 (transport properties).', 'IAPWS, *Release on the IAPWS Formulation 2008 for the Viscosity of Ordinary Water Substance*.'],
  sim: 'surf-viscosity'
},

/* ================================================================ 8. the Leidenfrost effect */
{
  id: 'the-leidenfrost-effect', parent: 'surfaces-and-flow', title: 'The Leidenfrost effect', level: 2,
  short: 'Above about 200 °C a drop of water on a hot pan does not boil in a second: it floats on a film of its own vapour, skates around for a minute and lasts longer the hotter the pan. The film conducts heat ten times worse than a boiling contact, and that is what saves the drop.',
  keywords: ['Leidenfrost effect', 'Leidenfrost point', 'film boiling', 'vapour cushion', 'boiling curve', 'nucleate boiling', 'critical heat flux', 'liquid nitrogen', 'hot pan', 'dancing drops', 'quenching', 'boiling crisis'],
  prereq: ['latent-heat-of-vaporisation', 'thermal-conductivity-of-water', 'drops-and-bubbles'],
  related: ['the-boiling-point-anomaly', 'evaporative-cooling', 'wetting-and-contact-angle', 'physics:latent-heat', 'physics:heat-transfer', 'hydraulics:cavitation'],
  body: `
Flick water at a frying pan. If the pan is warm, the drops hiss and vanish in a second. If it is very hot they do not: they gather into beads, rattle about like mercury and last a minute or more, sliding over the metal on nothing. This is the **Leidenfrost effect**, described by the German physician Johann Gottlob Leidenfrost in 1756. Cooks use it to tell when a pan is hot enough, and it is a good reason not to put out a fierce fire with a thrown cup of water.

### The boiling curve
The paradox is that a hotter plate cools the drop *less* well. Heat flows into a liquid on a hot plate in four regimes, which Shiro Nukiyama first mapped for boiling water in 1934:

| Plate temperature | Regime | Heat flux into the water |
|---|---|---|
| under 100 °C | the drop spreads and evaporates from its surface | a few kW/m² |
| 100 °C to about 130 °C | nucleate boiling: bubbles grow at spots on the plate and stir the liquid | rising to about 1 MW/m², the **critical heat flux** |
| about 130 °C up to the Leidenfrost point | transition boiling: patches of vapour film form and contact breaks up | falling steeply |
| above the Leidenfrost point | film boiling: a continuous vapour film separates liquid from metal | about 20–100 kW/m², a tenth of the peak or less |

(The temperatures are those for a drop on a plate; the transitions of a plate in a pool of water come somewhat higher.) As the plate gets hotter, a drop on it boils away faster, reaching a minimum lifetime of a few seconds at roughly 150–170 °C. Beyond that the film forms and the heat flux collapses; the lifetime of the drop leaps by an order of magnitude. On a clean polished metal the jump is at about 190–200 °C; on rough or oxidised metal it is at several tens of degrees higher.

### The cushion
In the film regime a layer of vapour, tens of micrometres thick, lies between the drop and the plate. It is made by the heat itself: vapour is evaporated from the bottom of the drop at a rate of a few milligrams per second and squeezed out sideways under the weight of the drop, and that flow keeps up a pressure of tens of pascals under the drop (a 0.3 g drop on 0.8 cm² needs only 40 Pa). The vapour is a poor conductor, around 0.03 W/(m·K) against water’s 0.6, so heat reaches the drop at a rate $q = k\\,\\Delta T/d$, here about 120 kW/m² for $\\Delta T = 100$ K and a film thickness $d = 25$ µm. The drop itself stays near 100 °C: it is not hot, only well insulated.

### How long it lives
Dividing the energy to evaporate the drop ($mL_v$ with $L_v$ = 2,257 kJ/kg at 100 °C) by the power through the film gives the lifetime $\\tau = mL_v d/(kA\\,\\Delta T)$. For 0.3 g of water on 0.8 cm² at 100 K excess it is about 70 s, of the order of what is seen (tens of seconds to a few minutes, depending on the size). A hotter plate makes the film conduct more, so the drop lives *less* long as the temperature rises beyond the Leidenfrost point, but the curve never returns to the short lifetime of the boiling regime. The effect was studied quantitatively by Biance, Clanet and Quéré in 2003.

### Cold things on a warm floor
The temperature that counts is that of the plate relative to the boiling point of the drop. Liquid nitrogen boils at −196 °C, so a room-temperature floor is 216 K above its boiling point, well past its Leidenfrost point, and a spilled drop skates across the floor and lasts for many seconds. The same effect briefly protects a hand from a splash of the liquid, which is no reason to touch it: nitrogen can be trapped in a sleeve or a glove, where the cushion cannot form, and burns.

### Where it is a nuisance
Hot metal quenched in water is wrapped in a vapour blanket that slows its cooling (and gives uneven hardness), so salts or polymers are added to break the blanket. In a nuclear reactor the same film would starve overheated fuel rods of cooling. The textbook claim that firewalkers are saved by the Leidenfrost effect is not well founded: the main protection is the poor thermal conductivity of burning wood and ash, and the brief contact.

> [!key] On a plate hotter than the Leidenfrost point (about 200 °C for water) a drop floats on a cushion of its own vapour, which conducts heat about ten times worse than a boiling contact. The drop lives a minute, not a second, because the pan is too hot to cool it.`,
  ideas: ['Above the Leidenfrost point a vapour film separates the drop from the plate, and heat has to cross it by conduction: about 20–100 kW/m² against about 1 MW/m² at peak nucleate boiling.', 'The lifetime of a drop shortens with plate temperature to a minimum near 150–170 °C, then jumps up by a factor of ten or more at the Leidenfrost point (about 190–200 °C on clean smooth metal).', 'The film, tens of micrometres thick, holds the drop up with a pressure of only tens of pascals; the drop stays near 100 °C.', 'Lifetime τ = m L_v d / (k A ΔT): it rises with the drop’s mass and the film’s thickness and falls with the temperature excess.', 'It happens with any liquid on a surface far above its boiling point, including liquid nitrogen on the floor.'],
  pitfalls: ['“The drop is levitating because it is boiling violently” — In the film regime it is calmer than in boiling: nothing touches the metal, so there are no nucleation sites and no bubbles; it merely evaporates quietly from its underside.', '“A hotter pan evaporates a drop faster, always” — Only up to the Leidenfrost point. Above it the lifetime is tens of times longer than just below it.', '“Firewalking proves the Leidenfrost effect protects the feet” — Doubtful: hot coals conduct and store heat poorly, and the contact is short; a vapour layer from sweat has not been shown to matter.'],
  terms: [
    { term: 'Leidenfrost point', also: ['Leidenfrost temperature'], def: 'The plate temperature above which a drop floats on a vapour film instead of boiling in contact with the plate: about 190–200 °C for water on a clean, smooth metal, higher on rough surfaces.' },
    { term: 'Film boiling', also: ['vapour blanket'], def: 'The regime of boiling in which a continuous vapour layer separates a hot surface from the liquid. It transfers heat poorly because the vapour is a poor conductor.' },
    { term: 'Nucleate boiling', def: 'The efficient boiling of a liquid on a surface only a few tens of kelvin above its boiling point, in which bubbles grow at nucleation sites on the surface and stir the liquid.' },
    { term: 'Critical heat flux', also: ['boiling crisis', 'burnout', 'CHF'], def: 'The peak heat flux (about 1 MW/m² for water at atmospheric pressure) reached in nucleate boiling, beyond which a vapour film starts to form and the flux falls.' },
    { term: 'Boiling curve', also: ['Nukiyama curve'], def: 'The graph of heat flux against the excess of a surface’s temperature above the boiling point, showing the nucleate, transition and film regimes (Nukiyama, 1934).' }
  ],
  formulas: [
    { name: 'Heat flux through the vapour film', expr: 'q = k*dT/d', tex: 'q = \\frac{k\\,\\Delta T}{d}',
      vars: { q: { name: 'heat flux into the drop', q: 'intensity', unit: 'kW/m²', tex: 'q' }, k: { name: 'thermal conductivity of the vapour', q: 'thermcond', unit: 'W/(m·K)', value: 0.03, tex: 'k', hint: 'About 0.03 W/(m·K) for steam at 150 °C; 0.6 for liquid water.' }, dT: { name: 'plate temperature above 100 °C', q: 'dtemp', unit: 'K', value: 100, tex: '\\Delta T' }, d: { name: 'thickness of the film', q: 'length', unit: 'µm', value: 25, tex: 'd', hint: 'Tens of micrometres.' } },
      solveFor: 'q', note: 'Conduction only; radiation adds a little above 300 °C.',
      stories: { q: 'A drop floats on a film of vapour of thickness {d} and conductivity {k}; the plate is {dT} above the boiling point. What is the heat flux into the drop?' } },
    { name: 'How long the drop lives', expr: 'tau = m*Lv*d/(k*A*dT)', tex: '\\tau = \\frac{m\\,L_v\\,d}{k\\,A\\,\\Delta T}',
      vars: { tau: { name: 'lifetime of the drop', q: 'time', unit: 's', tex: '\\tau' }, m: { name: 'mass of the drop', q: 'mass', unit: 'g', value: 0.3, tex: 'm' }, Lv: { name: 'latent heat of vaporisation', q: 'latent', unit: 'kJ/kg', value: 2257, tex: 'L_v', hint: '2,257 kJ/kg for water at 100 °C; 199 for liquid nitrogen.' }, d: { name: 'thickness of the film', q: 'length', unit: 'µm', value: 25, tex: 'd' }, k: { name: 'conductivity of the vapour', q: 'thermcond', unit: 'W/(m·K)', value: 0.03, tex: 'k' }, A: { name: 'area of the drop’s underside', q: 'area', unit: 'cm²', value: 0.8, tex: 'A' }, dT: { name: 'plate temperature above boiling', q: 'dtemp', unit: 'K', value: 100, tex: '\\Delta T' } },
      solveFor: 'tau', note: 'The film is assumed constant in thickness and the drop to stay at its boiling point; real drops shrink as they evaporate, and the film thins.',
      stories: { tau: 'A drop of {m} of water floats over {A} on a plate {dT} above its boiling point, on a vapour film {d} thick with conductivity {k}. How long does it last?', d: 'A drop of {m} lasts {tau} on a plate {dT} above its boiling point. How thick is the vapour film?' } },
    { name: 'Energy to boil the drop away', expr: 'E = m*Lv', tex: 'E = m\\,L_v',
      vars: { E: { name: 'energy needed', q: 'energy', unit: 'kJ', tex: 'E' }, m: { name: 'mass', q: 'mass', unit: 'g', value: 0.3, tex: 'm' }, Lv: { name: 'latent heat of vaporisation', q: 'latent', unit: 'kJ/kg', value: 2257, tex: 'L_v' } },
      solveFor: 'E', note: 'About 0.68 kJ for 0.3 g, nearly seven times as much as it takes to warm it from 20 °C to 100 °C.',
      stories: { E: 'How much energy does it take to boil away a drop of {m} of water?' } },
    { name: 'The pressure the film must supply', expr: 'p = m*g/A', tex: 'p = \\frac{m\\,g}{A}',
      vars: { p: { name: 'pressure under the drop', q: 'pressure', unit: 'Pa', tex: 'p' }, m: { name: 'mass of the drop', q: 'mass', unit: 'g', value: 0.3, tex: 'm' }, g: { const: 'g' }, A: { name: 'area of the vapour film', q: 'area', unit: 'cm²', value: 0.8, tex: 'A' } },
      solveFor: 'p', note: 'A small pressure: the vapour film only has to carry the weight of the drop.',
      stories: { p: 'A drop of {m} floats on a vapour film of area {A}. How much pressure does the vapour supply under it?' } }
  ],
  examples: [
    { title: 'A drop on a very hot pan', q: 'How long does a drop of 0.3 g last on a pan 100 K above boiling, if its underside is 0.8 cm² and it floats on 25 µm of vapour with k = 0.03 W/(m·K)?',
      steps: [{ text: 'Energy to evaporate it:', tex: 'E = mL_v = 0.3\\times10^{-3}\\times2.257\\times10^{6} = 677\\ \\mathrm{J}' }, { text: 'Heat flux and power:', tex: 'q = \\frac{k\\Delta T}{d} = \\frac{0.03\\times100}{25\\times10^{-6}} = 1.2\\times10^{5}\\ \\mathrm{W/m^2},\\quad P = qA = 9.6\\ \\mathrm{W}' }, 'Lifetime: $677/9.6 = 70$ s.'],
      a: 'About 70 s: the drop skates for more than a minute. It is evaporating at 4 mg a second, 9.6 W through the film.' },
    { title: 'Why the film is the problem', q: 'Compare the heat flux through the film above (120 kW/m²) with the critical heat flux of boiling water (about 1 MW/m²). How long would the same drop last if heat went in at the critical heat flux through its 0.8 cm²?',
      steps: ['Ratio: $1{,}000/120 = 8$.', { text: 'Power at critical heat flux:', tex: 'P = 10^6\\times0.8\\times10^{-4} = 80\\ \\mathrm{W}' }, 'Lifetime: $677/80 = 8.5$ s.'],
      a: 'About 8 s: with contact boiling the same drop would be gone in a tenth of the time. The film, not the heat, makes the difference.' },
    { title: 'A pan test', q: 'A cook sprinkles water on a pan, and the drops skate around for 40 s. What can be said about the pan?',
      steps: ['A drop lasts that long only in the film regime, where the lifetime is tens of seconds; below the Leidenfrost point drops last a few seconds.', 'So the pan is above the Leidenfrost point: roughly 200 °C or more.'],
      a: 'The pan is above about 200 °C, as hot as is needed for searing. If the drops hiss and vanish at once, it is under the Leidenfrost point.' }
  ],
  quiz: [
    { q: 'Why does a drop last much longer on a pan at 250 °C than on one at 150 °C?', choices: ['The hotter pan evaporates the water more slowly in each regime', 'At 250 °C a vapour film insulates the drop from the metal', 'The drop at 250 °C is smaller', 'Water cools when it is heated more'], a: 1, why: 'Above the Leidenfrost point the vapour film conducts heat only slowly to the drop, so it takes longer to evaporate, although the plate is hotter.' },
    { q: 'About what temperature is a Leidenfrost water drop floating on the pan?', choices: ['The temperature of the pan', 'About 100 °C', 'About 20 °C', 'Above 300 °C'], a: 1, why: 'The drop is held at its boiling point by evaporation. It is thermally insulated from the pan by the film.' },
    { q: 'Liquid nitrogen (boiling point −196 °C) spilled on a room-temperature floor shows the Leidenfrost effect because', choices: ['nitrogen is a gas', 'the floor is far above the nitrogen’s boiling point, so a vapour film forms', 'nitrogen is magnetic', 'air pressure is high'], a: 1, why: 'The Leidenfrost point is a temperature excess above the liquid’s boiling point of tens to a hundred kelvin; the floor is more than 200 K above.' },
    { q: 'The vapour film under a 0.3 g drop on 0.8 cm² must supply what pressure, in pascals, to hold it up?', answer: 37, unit: 'Pa', why: 'p = mg/A = 0.3×10⁻³ × 9.81 / 0.8×10⁻⁴ = 36.8 Pa: a tiny amount.' },
    { q: 'The Leidenfrost effect is why firewalkers do not burn their feet.', a: false, why: 'It is unproven and unlikely: the more convincing reasons are the poor thermal conductivity of the embers and ash and the short contact time.' }
  ],
  applications: ['The cook’s pan test: water drops that skate show the pan is above about 200 °C, hot enough for searing.', 'Metal quenching and heat treatment: the vapour blanket slows cooling, so quenchants contain salts or polymers to break it.', 'Nuclear and boiler safety: overheating beyond the critical heat flux can bring on film boiling, which cuts cooling and can melt the surface (“burnout”).', 'Cryogenics: handling liquid nitrogen, where drops skate over surfaces and the gas film can briefly protect and then fail.', 'Self-propelled Leidenfrost drops on ratchet-shaped surfaces (Linke and colleagues, 2006), which climb slopes and are studied as microfluidic pumps.'],
  history: 'Leidenfrost described the effect in *De aquae communis nonnullis qualitatibus tractatus* (1756), watching drops of water on a heated iron spoon; Boerhaave had noted something similar in 1732. Nukiyama’s 1934 boiling curve placed it in the film-boiling regime, and Biance, Clanet and Quéré (2003) gave the first full account of the drop’s shape and lifetime.',
  sources: ['Leidenfrost, *De aquae communis nonnullis qualitatibus tractatus* (Duisburg, 1756), in the English translation by C. Wares, *International Journal of Heat and Mass Transfer* 9, 1153 (1966).', 'Biance, Clanet and Quéré, “Leidenfrost drops”, *Physics of Fluids* 15, 1632 (2003).', 'Quéré, “Leidenfrost dynamics”, *Annual Review of Fluid Mechanics* 45, 197 (2013).', 'Nukiyama, “The maximum and minimum values of the heat Q transmitted from metal to boiling water under atmospheric pressure”, *Journal of the Japan Society of Mechanical Engineers* 37, 367 (1934); English translation in *International Journal of Heat and Mass Transfer* 9, 1419 (1966).'],
  sim: 'surf-leidenfrost'
},

/* ================================================================ 9. incompressibility and water hammer */
{
  id: 'incompressibility-and-water-hammer', parent: 'surfaces-and-flow', title: 'Incompressibility and water hammer', level: 2,
  short: 'Water is very stiff: its bulk modulus is 2.2 GPa, so a hundred bar squeezes it by only half a per cent. That stiffness makes a pressure pulse cross it at 1,480 m/s, and a valve that stops a 2 m/s flow suddenly adds about 30 bar, the hammer in the pipes. It is stiffest near 46 °C.',
  keywords: ['bulk modulus', 'compressibility', 'incompressible', 'water hammer', 'Joukowsky', 'surge', 'surge tank', 'pressure wave', 'valve closure', 'penstock', 'hydraulic ram', 'pipe knocking', 'minimum compressibility', '46 °C'],
  prereq: ['the-structure-of-liquid-water', 'the-density-maximum'],
  related: ['speed-of-sound-in-water', 'heat-capacity-and-compressibility-anomalies', 'cavitation-and-embolism', 'why-suction-stops-at-ten-metres', 'the-list-of-anomalies', 'physics:shear-bulk-modulus', 'hydraulics:bulk-modulus', 'hydraulics:water-hammer', 'hydraulics:cavitation'],
  body: `
Press on a water-filled syringe with the nozzle blocked and the plunger will not move. Air, in the same syringe, squeezes to a small fraction of its size. Water is the usual example of an incompressible liquid. It is not truly incompressible, only so stiff that engineers can treat it so, until something happens fast. Then its stiffness decides what happens, for good (a hydraulic jack) or ill (a burst pipe).

### How stiff
The **bulk modulus** $K$ is the pressure needed to compress a substance by a given fraction, $K = -\\Delta p/(\\Delta V/V)$, and its reciprocal is the **compressibility** $\\kappa = 1/K$. For water at 20 °C, $K$ = 2.18 GPa and $\\kappa = 4.6\\times10^{-10}$ Pa⁻¹. In words:
- one atmosphere (1 bar) compresses water by 0.0046 %, forty-six parts per million;
- 100 bar compresses it by 0.46 %, and 1,000 bar (the pressure at 10 km of sea) by about 4 %, a little less as the liquid stiffens under load;
- to compress water by 1 % takes 22 MPa, 220 bar.

| Substance | Bulk modulus |
|---|---|
| air (as an ideal gas, isothermal) | 0.1 MPa |
| ethanol | about 1.0 GPa |
| hydraulic oil | about 1.5 GPa |
| **water, 20 °C** | **2.18 GPa** |
| glycerol | about 4.5 GPa |
| mercury | 25 GPa |
| steel | about 160 GPa |

Water is stiffer than the alcohols and oils, and about seventy times less stiff than steel. Even so, a thin pipe wall stretches sideways enough under a pressure pulse to matter, as will be seen.

### A stiffness that goes the wrong way
In ordinary liquids the compressibility rises steadily with temperature: warm them and they are easier to squeeze. In water it **falls** from 5.1×10⁻¹⁰ Pa⁻¹ at 0 °C to a minimum of 4.41×10⁻¹⁰ near 46 °C (close to body heat) and only then rises, to 4.8 at 100 °C. Below 0 °C, in supercooled water, it climbs steeply, 9.5×10⁻¹⁰ at −30 °C. The explanation is the open structure of the liquid ([[the-density-maximum]]): cold water holds ice-like open patches, and pressure can crush those, which is why cold water is easy to squeeze, and why it grows stiffer as the patches are warmed away. The same behaviour shows in the heat capacity ([[heat-capacity-and-compressibility-anomalies]]).

### The ocean is 30 metres lower than it would be
If water were truly incompressible, the sea would be about 30 m deeper. The oceans average 3.7 km, and every layer is squeezed by the weight above it. Integrating the compression over the column (pressure $\\rho g z$ at depth $z$) gives a fall in level $\\Delta h = \\rho g H^2/(2K)$ = 30 m for $H$ = 3.7 km and $K$ = 2.3 GPa, a figure whose size shows that “incompressible” is only an approximation.

### The bang in the pipes
Close a tap quickly and the pipe knocks. The water in the pipe, moving at $v$, has to stop, but its far end does not know that the valve has shut. The stoppage travels up the pipe as a wave at the speed of sound, and at the wave front the water is brought to rest by an excess pressure. In a time $\\Delta t$ the wave passes a length $c\\,\\Delta t$ of pipe, whose water of mass $\\rho A c\\,\\Delta t$ loses the speed $\\Delta v$ under the force $\\Delta p\\,A$, so that $\\Delta p\\,A\\,\\Delta t = \\rho A c\\,\\Delta t\\,\\Delta v$, and

$$\\Delta p = \\rho\\,c\\,\\Delta v \\qquad \\text{(Joukowsky, 1898)}.$$

For water, $\\rho c = 1.48\\times10^6$ Pa per m/s. Every metre per second of flow stopped gives **14.8 bar**; a flow of 2 m/s stopped dead gives 30 bar, on top of the static pressure, about ten times the mains. The pulse runs to the end of the pipe, reflects (as a drop, if the end is a reservoir) and comes back, and the pressure at the valve oscillates with the period $4L/c$ until the pipe’s friction damps it away. (Run the simulation: a 200 m pipe has a round trip $2L/c$ of 0.3 s.)

### Pipes that give, and valves that are slow
A pipe wall that stretches softens the pulse and slows it. With a wall of Young’s modulus $E$, thickness $w$ and diameter $D$ the wave speed falls to $c = c_0/\\sqrt{1 + KD/(Ew)}$: 1,340 m/s in steel (with $D/w = 20$), 380 m/s in PVC, which is why a plastic pipe takes a hammer better than steel. The remedy for steel is to close slowly: if the valve takes longer than the round trip $2L/c$, the reflected relief wave arrives in time to soften the jump and the rise is only about $2\\rho L\\,\\Delta v/t_c$. Hydropower penstocks have surge tanks, vertical standpipes that take the shock; houses have air chambers or arrestors, small cushions of gas, since air is 20,000 times more compressible. The sharp negative wave behind the pulse can drop the pressure to the vapour pressure and boil the water cold, which is cavitation; its collapse is a second hammer ([[cavitation-and-embolism]], [[why-suction-stops-at-ten-metres]]).

> [!key] Water’s bulk modulus, 2.2 GPa, makes it nearly incompressible, and strangest of all it is stiffest near 46 °C. Because pressure pulses travel at 1,480 m/s, stopping a flow suddenly adds ρcΔv, 14.8 bar for every metre per second, which is why valves close slowly and pipes have air cushions.`,
  ideas: ['The bulk modulus of water is 2.18 GPa at 20 °C: 1 % compression takes 220 bar, 100 bar compresses it by 0.46 %.', 'The compressibility of water is lowest (4.41×10⁻¹⁰ Pa⁻¹) near 46 °C, and rises on cooling, because cold water has crushable open patches: the reverse of ordinary liquids.', 'If water were incompressible the oceans would be about 30 m deeper.', 'Water hammer: a flow stopped suddenly adds ρcΔv, 14.8 bar for every metre per second, which a pipe wall that flexes reduces.', 'Slow closure (longer than 2L/c), surge tanks and air cushions cut the surge; the negative wave can cause cavitation.'],
  pitfalls: ['“Water is incompressible, so water hammer cannot be explained by compression” — It is the very small compression, together with the inertia of the moving column, that makes the wave; a truly incompressible liquid would stop everywhere at once and need an infinite force.', '“Water hammer is a problem of high water pressure” — It is a problem of sudden changes of flow. A pipe at a low static pressure can be hammered much harder than the mains if the valve shuts fast.', '“A stiffer pipe is always safer” — It makes the wave faster and the hammer larger: ρcΔv grows with c. A flexible pipe or an air cushion softens it.'],
  terms: [
    { term: 'Bulk modulus', also: ['K', 'modulus of compression'], def: 'The pressure increase needed to compress a material by a given fraction of its volume: K = −Δp/(ΔV/V). For water at 20 °C, 2.18 GPa.' },
    { term: 'Compressibility', also: ['κ', 'isothermal compressibility'], def: 'The reciprocal of the bulk modulus: the fractional volume change per unit pressure. For water, 4.6×10⁻¹⁰ Pa⁻¹ at 20 °C, with a minimum near 46 °C.' },
    { term: 'Water hammer', also: ['hydraulic shock', 'pressure surge'], def: 'The pressure wave set up in a pipe by a sudden change of flow, such as a closing valve. Its size for an instant stop is ρcΔv.' },
    { term: 'Joukowsky equation', also: ['Zhukovsky equation', 'Joukowsky pressure'], def: 'The result Δp = ρcΔv for the pressure jump when a flow of speed Δv is stopped suddenly in a liquid with sound speed c and density ρ.' },
    { term: 'Surge tank', also: ['surge chamber', 'standpipe'], def: 'A vertical tank or standpipe connected to a pipeline or penstock which takes in or releases water to absorb pressure surges after a valve or turbine change.' }
  ],
  formulas: [
    { name: 'Joukowsky: the jump from stopping a flow', expr: 'dp = rho*c*dv', tex: '\\Delta p = \\rho\\,c\\,\\Delta v',
      vars: { dp: { name: 'pressure rise', q: 'pressure', unit: 'bar', tex: '\\Delta p' }, rho: { name: 'density of the water', q: 'density', unit: 'kg/m³', value: 998.2, tex: '\\rho' }, c: { name: 'speed of the pressure wave', q: 'speed', unit: 'm/s', value: 1480, tex: 'c', hint: '1,480 m/s in water alone; 1,340 in a steel pipe, about 380 in PVC.' }, dv: { name: 'change of flow speed', q: 'speed', unit: 'm/s', value: 2, tex: '\\Delta v', hint: 'The flow speed that the valve stops.' } },
      solveFor: 'dp', note: 'For a closure faster than 2L/c. Add the static pressure to get the pressure at the valve.',
      stories: { dp: 'Water flowing at {dv} is stopped at once by a valve; the wave speed is {c}. What is the pressure rise?', dv: 'A pressure surge of {dp} is produced when a valve stops a flow suddenly (wave speed {c}). How fast was the water moving?' } },
    { name: 'Wave speed in an elastic pipe', expr: 'c = c0/sqrt(1 + K*D/(E*w))', tex: 'c = \\frac{c_0}{\\sqrt{1 + \\dfrac{K\\,D}{E\\,w}}}',
      vars: { c: { name: 'wave speed in the pipe', q: 'speed', unit: 'm/s', tex: 'c' }, c0: { name: 'sound speed in the water alone', q: 'speed', unit: 'm/s', value: 1482, tex: 'c_0' }, K: { name: 'bulk modulus of the water', q: 'pressure', unit: 'GPa', value: 2.18, tex: 'K' }, D: { name: 'inside diameter of the pipe', q: 'length', unit: 'mm', value: 100, tex: 'D' }, E: { name: 'Young’s modulus of the wall', q: 'pressure', unit: 'GPa', value: 200, tex: 'E', hint: 'Steel 200, copper 120, PVC about 3, polyethylene about 1.' }, w: { name: 'wall thickness', q: 'length', unit: 'mm', value: 5, tex: 'w' } },
      solveFor: 'c', note: 'Thin-walled pipe, free to expand along its length. A flexible wall lowers the speed and so the hammer.',
      stories: { c: 'A pipe of diameter {D}, wall {w} and Young’s modulus {E} carries water (K = {K}, c₀ = {c0}). What is the speed of a pressure wave in it?' } },
    { name: 'A gradual closure', expr: 'dp = 2*rho*L*dv/tc', tex: '\\Delta p \\approx \\frac{2\\,\\rho\\,L\\,\\Delta v}{t_c}',
      vars: { dp: { name: 'pressure rise', q: 'pressure', unit: 'bar', tex: '\\Delta p' }, rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 998.2, tex: '\\rho' }, L: { name: 'length of the pipe', q: 'length', unit: 'm', value: 500, tex: 'L' }, dv: { name: 'change of flow speed', q: 'speed', unit: 'm/s', value: 2, tex: '\\Delta v' }, tc: { name: 'time the valve takes to close', q: 'time', unit: 's', value: 5, tex: 't_c', hint: 'Must be longer than the round trip 2L/c, about 0.7 s for a 500 m pipe.' } },
      solveFor: 'dp', note: 'Michaud’s estimate, valid when t_c exceeds 2L/c. The surge depends on the pipe length but not on c.',
      stories: { dp: 'A valve stops a flow of {dv} in {tc} in a pipe {L} long. Estimate the pressure rise.', tc: 'A pipe {L} long carrying water at {dv} may rise by {dp}. How long must the valve take to close?' } },
    { name: 'How much the sea is squeezed', expr: 'dh = rho*g*H^2/(2*K)', tex: '\\Delta h = \\frac{\\rho\\,g\\,H^2}{2K}',
      vars: { dh: { name: 'fall in sea level from compression', q: 'length', unit: 'm', tex: '\\Delta h' }, rho: { name: 'density of sea water', q: 'density', unit: 'kg/m³', value: 1025, tex: '\\rho' }, g: { const: 'g' }, H: { name: 'depth of the ocean', q: 'length', unit: 'km', value: 3.7, tex: 'H', hint: 'The mean depth of the oceans is 3.7 km.' }, K: { name: 'bulk modulus of sea water', q: 'pressure', unit: 'GPa', value: 2.3, tex: 'K' } },
      solveFor: 'dh', note: 'A uniform ocean with constant K; the answer is a rough 30 m.',
      stories: { dh: 'An ocean {H} deep has a bulk modulus of {K}. By how much does the compression lower its surface?' } }
  ],
  examples: [
    { title: 'The knock of a washing-machine valve', q: 'A solenoid valve shuts off water flowing at 1.5 m/s in a copper pipe in about 10 ms. Take c = 1,270 m/s. What is the surge, and is the closure sudden?',
      steps: [{ text: '', tex: '\\Delta p = \\rho c \\Delta v = 998\\times1270\\times1.5 = 1.9\\times10^{6}\\ \\mathrm{Pa}' }, 'Round trip for a 10 m pipe: $2L/c = 2\\times10/1270 = 16$ ms. The closure (10 ms) is shorter, so it is sudden and the full surge applies.'],
      a: 'About 19 bar above the mains pressure of 3–4 bar: enough to make the pipes jump on their brackets and knock, and the reason for the arrestors (small air chambers) fitted near such valves.' },
    { title: 'Slowing the valve', q: 'A 500 m pipe carries water at 2 m/s. The valve closes in 5 s. What is the surge, compared with an instant closure at c = 1,340 m/s?',
      steps: ['Round trip: $2\\times500/1340 = 0.75$ s, so 5 s is gradual.', { text: 'Gradual:', tex: '\\Delta p \\approx \\frac{2\\rho L \\Delta v}{t_c} = \\frac{2\\times998\\times500\\times2}{5} = 4.0\\times10^{5}\\ \\mathrm{Pa}' }, { text: 'Instant:', tex: '\\Delta p = \\rho c \\Delta v = 998\\times1340\\times2 = 26.7\\ \\mathrm{bar}' }],
      a: '4 bar against 27 bar: closing in 5 s instead of in 10 ms reduces the surge by a factor of seven, at no cost but time.' },
    { title: 'Sea level without compression', q: 'By how much does the compression of the oceans lower the sea surface? Take a uniform 3.7 km depth, ρ = 1,025 kg/m³ and K = 2.3 GPa.',
      steps: [{ text: '', tex: '\\Delta h = \\frac{\\rho g H^2}{2K} = \\frac{1025\\times9.81\\times(3700)^2}{2\\times2.3\\times10^{9}} = 29.9\\ \\mathrm{m}' }],
      a: 'About 30 m. If the sea were incompressible, it would stand 30 m higher and flood most coastal cities.' }
  ],
  quiz: [
    { q: 'A pipe of water at 2 m/s is stopped at once (c = 1,480 m/s). The pressure rise is about', choices: ['0.2 bar', '3 bar', '30 bar', '3,000 bar'], a: 2, why: 'Δp = ρcΔv = 998 × 1,480 × 2 = 2.95×10⁶ Pa, about 30 bar: 14.8 bar for every metre per second.' },
    { q: 'A valve in a 100 m pipe (c = 1,000 m/s) closes in 1.0 s. Is the closure sudden or gradual?', choices: ['Sudden, because 1.0 s is short', 'Gradual, because 1.0 s is longer than the round trip 2L/c = 0.2 s', 'Neither', 'It depends on the diameter only'], a: 1, why: 'A closure slower than 2L/c lets the relief wave return before the valve has finished closing, so the surge is only a fraction of the full Joukowsky value.' },
    { q: 'Which statement about the compressibility of water is true?', choices: ['It rises steadily on warming, as in other liquids', 'It is lowest near 46 °C and higher both above and below', 'It does not depend on temperature', 'It is the same as that of air'], a: 1, why: 'Compressibility falls from 5.1 (at 0 °C) to 4.41×10⁻¹⁰ Pa⁻¹ near 46 °C, then rises; the minimum is another of water’s anomalies.' },
    { q: 'By what percentage does a pressure of 100 bar compress water (K = 2.18 GPa)?', answer: 0.46, unit: '%', why: 'ΔV/V = Δp/K = 10⁷ Pa / 2.18×10⁹ Pa = 0.0046, or 0.46 %.' },
    { q: 'Replacing a copper pipe with a stiffer, thicker steel pipe would reduce the water hammer.', a: false, why: 'A stiffer wall raises the wave speed c, and Δp = ρcΔv grows with it. Flexibility (plastic pipe, an air cushion) softens the surge.' }
  ],
  applications: ['Hydraulic machines (jacks, presses, brakes and excavators), where the stiffness of the oil or water transmits force, and an air bubble in a brake line ruins them by making the fluid compressible.', 'Hydropower penstocks, where surge tanks and slow-closing valves protect turbines and pipes, since a gate shutting 200 m³/s can send a surge up the tunnel.', 'The hydraulic ram pump (Montgolfier, 1796), which uses the water hammer of a stream’s own flow to lift a part of it to a height with no other power.', 'Plumbing and fire-fighting: arrestors, hoses and slow-acting valves, so that the mains do not shake.', 'Medicine: the “water-hammer” or collapsing pulse of aortic regurgitation (Corrigan’s pulse), a sharp rise and fall of the arterial pulse that recalls the surge in a pipe.'],
  history: 'Menabrea described pressure surges in 1858, and Joukowsky (Zhukovsky) established the law Δp = ρcΔv in 1898 from tests on the water mains of Moscow. Allievi gave the complete theory of the pressure wave in 1902, and the method of characteristics came into the subject in the 1950s and 60s. The compressibility of water was first measured by Ørsted in 1822, and precise twentieth-century measurements (Kell, 1970) fixed the minimum near 46 °C.',
  sources: ['Wylie and Streeter, *Fluid Transients in Systems* (Prentice Hall, 1993), ch. 1–3 (Joukowsky and the wave speed).', 'Kell, “Isothermal compressibility of liquid water at 1 atm”, *Journal of Chemical and Engineering Data* 15, 119 (1970) — the data behind the minimum at 46 °C.', 'Eisenberg and Kauzmann, *The Structure and Properties of Water*, ch. 4 (compressibility).', 'Joukowsky, “Über den hydraulischen Stoss in Wasserleitungsröhren”, *Mémoires de l’Académie Impériale des Sciences de St.-Pétersbourg* 9 (1900), from the work of 1898.'],
  sim: { id: 'surf-waves', params: { mode: 'hammer' } }
},

/* ================================================================ 10. the speed of sound in water */
{
  id: 'speed-of-sound-in-water', parent: 'surfaces-and-flow', title: 'The speed of sound in water', level: 2,
  short: 'Sound crosses water at 1,482 m/s at 20 °C, four times as fast as in air, because water is so much stiffer than it is heavy: c = √(K/ρ). Unlike every other liquid it goes faster when warmed, peaking at 1,555 m/s at 74 °C, and in the sea a channel at 1 km depth carries sound across oceans.',
  keywords: ['speed of sound', 'sound in water', 'Newton–Laplace', 'sonar', 'SOFAR channel', 'whale song', 'ultrasound', 'Mackenzie', 'sea water', 'acoustic impedance', 'echo sounding', 'Colladon', 'maximum at 74 °C'],
  prereq: ['incompressibility-and-water-hammer', 'the-density-maximum'],
  related: ['heat-capacity-and-compressibility-anomalies', 'the-list-of-anomalies', 'the-salt-of-the-sea', 'ocean-currents', 'physics:speed-of-sound', 'physics:sound', 'aerodynamics:speed-of-sound', 'hydraulics:bulk-modulus'],
  body: `
Under water, a ship’s propeller can be heard from kilometres away, and a diver is deafened by a boat that cannot be seen. Sound is the sea’s own light: radio and light waves are absorbed within metres of the surface, but sound can cross an ocean. It is also why whales sing and why ships carry sonar.

### Why four times faster than air
A sound wave is a pressure wave: a squeezed layer pushes on the next, which is squeezed in turn. Its speed is set by two things, how stiff the medium is ($K$, bulk modulus) and how heavy ($\\rho$, density), as Newton worked out in 1687 and Laplace corrected in 1816:

$$c = \\sqrt{\\frac{K}{\\rho}}.$$

Water is 830 times denser than air, which slows it down, but 15,000 times stiffer ($K$ = 2.19 GPa against $\\gamma p$ = 0.14 MPa for air), which more than makes up for it: $c = \\sqrt{2.19\\times10^9/998} = 1{,}482$ m/s, against 343 m/s in air, a ratio of 4.3. (The stiffness that counts is the *adiabatic* one, since a sound wave is too quick for heat to leave the squeezed water; it is 0.7 % higher than the isothermal $K$ of the preceding page, and this accounts for the 4 m/s between the two estimates.) Colladon and Sturm made the first accurate measurement in Lake Geneva in 1826, striking a bell under the water and timing its sound over 13 km at 1,435 m/s at 8 °C.

### The speed climbs with temperature, to 74 °C
Every other liquid slows down when heated, because its density falls and it becomes easier to compress. Water at first does the opposite:

| Water | 0 °C | 10 °C | 20 °C | 40 °C | 60 °C | **74 °C** | 100 °C |
|---|---|---|---|---|---|---|---|
| speed (m/s) | 1,402 | 1,447 | 1,482 | 1,529 | 1,551 | **1,555** | 1,543 |

Near 0 °C it climbs by about 5 m/s for each kelvin, because warming stiffens water (the minimum of its compressibility near 46 °C, see [[incompressibility-and-water-hammer]]); only above 74 °C does the usual fall in density win. It is a peak of the “list of anomalies” ([[the-list-of-anomalies]]), and the same open structure lies behind it.

### In the sea
Salt makes sea water stiffer and heavier, and stiffening wins: each extra gram of salt per kilogram adds 1.3 m/s. So does depth, since pressure compresses and stiffens the water: 0.016 m/s for every metre. A good fit is the nine-term equation of Mackenzie (1981), valid for −2 to 30 °C, 25–40 g/kg and to 8 km. For 35 g/kg it gives 1,490 m/s at 10 °C and 1,521 m/s at 20 °C at the surface, and 1,483 m/s at 4 °C and 1,000 m.

### The sound channel
At the surface of the sea the water is warm, and the speed falls as the temperature drops with depth, to a minimum at about 1,000 m. Below that, the temperature hardly changes, and the speed rises with the pressure. Sound bends towards the region of lower speed, as light bends in glass, so a pulse sent out near that depth is turned back to it whenever it strays, and stays trapped in this **SOFAR channel** (SOund Fixing And Ranging), losing very little. Ewing and Worzel found it in 1944, and Brekhovskikh in the Soviet Union independently in 1946. In 1991 the Heard Island experiment sent low-frequency pulses from the southern Indian Ocean that were heard on both coasts of North America, 18,000 km away. Whales may use it: blue and fin whales call at 15–40 Hz, low enough to carry hundreds of kilometres or more.

### Across the surface and into the body
A wave goes from one medium to another with an energy transmission $4Z_1Z_2/(Z_1+Z_2)^2$, with $Z = \\rho c$ the acoustic impedance. For air (413 Pa·s/m) and water (1.48 MPa·s/m) it is 0.11 %: 99.9 % of the sound is reflected, 30 dB down. A voice from the shore is lost, and a swimmer hears little of the air. Underwater, human hearing cannot tell the direction of a sound, because with c four times greater the delay between the ears falls from 0.6 ms to 0.14 ms. Soft tissue has c = 1,540 m/s, the same as water at 50 °C, which is why a medical ultrasound scanner can convert echo times to depth: $d = ct/2$, at 5 MHz with a wavelength of 0.3 mm.

> [!key] Sound travels in water at $\\sqrt{K/\\rho}$ = 1,482 m/s at 20 °C, four times its speed in air, because water is far stiffer than it is dense. It is the only common liquid in which the speed rises with temperature (to 1,555 m/s at 74 °C), and the sea’s minimum at 1 km depth traps it into a channel that spans the oceans.`,
  ideas: ['The speed of sound is √(K/ρ): water is 830 times denser but 15,000 times stiffer than air, so sound goes 4.3 times faster, 1,482 m/s at 20 °C.', 'It rises with temperature from 1,402 m/s at 0 °C to a maximum of 1,555 m/s at 74 °C, unlike every other liquid, because water stiffens on warming.', 'In the sea it rises 4.6 m/s per kelvin, 1.3 m/s per g/kg of salt and 0.016 m/s per metre of depth (Mackenzie’s equation).', 'A minimum of the speed at about 1 km depth bends sound back into a channel (SOFAR) in which it travels across oceans.', 'At an air–water surface 99.9 % of the sound is reflected, because the impedance ρc differs by a factor of 3,600.'],
  pitfalls: ['“Sound travels faster in water because water is denser” — Density slows sound. Water is faster because it is stiffer by far more than it is heavier: c = √(K/ρ).', '“The speed of sound in water is about the same everywhere in the ocean” — It varies by 5 % with temperature, salinity and depth, and that variation is what makes the sound channel and the shadow zones of sonar.', '“Bubbly water carries sound fast” — A little air makes water spongy: 1 % of free air by volume cuts the speed from about 1,480 m/s to around 100 m/s (Wood, 1930), which is why wakes and breaking waves block sonar.'],
  terms: [
    { term: 'Speed of sound', also: ['sound velocity', 'c'], def: 'The speed at which small pressure disturbances travel through a medium: c = √(K/ρ), with K the (adiabatic) bulk modulus and ρ the density. In water, 1,482 m/s at 20 °C.' },
    { term: 'Newton–Laplace equation', also: ['Newton–Laplace formula'], def: 'The relation c = √(K/ρ) between the speed of sound, the bulk modulus and the density. Newton’s original used the isothermal modulus; Laplace corrected it with the adiabatic one.' },
    { term: 'SOFAR channel', also: ['sound channel', 'deep sound channel', 'sound fixing and ranging'], def: 'The layer, at about 1,000 m depth in mid-latitudes, where the speed of sound in the sea is a minimum; it bends sound back towards its axis and carries it over thousands of kilometres.' },
    { term: 'Acoustic impedance', also: ['Z', 'characteristic impedance'], def: 'The product Z = ρc of density and sound speed; the fraction of energy transmitted at a boundary between two media is 4Z₁Z₂/(Z₁ + Z₂)². Water: 1.48 MPa·s/m; air: 413 Pa·s/m.' },
    { term: 'Sonar', also: ['sound navigation and ranging', 'echo sounder'], def: 'Locating or surveying by sound in water: a pulse is sent out and the delay t of its echo gives the distance ct/2.' },
    { term: 'Mackenzie equation', def: 'A nine-term formula (1981) for the speed of sound in sea water as a function of temperature, salinity and depth, valid from −2 to 30 °C, 25 to 40 g/kg and to 8,000 m.' }
  ],
  formulas: [
    { name: 'The Newton–Laplace speed of sound', expr: 'c = sqrt(K/rho)', tex: 'c = \\sqrt{\\frac{K}{\\rho}}',
      vars: { c: { name: 'speed of sound', q: 'speed', unit: 'm/s', tex: 'c' }, K: { name: 'adiabatic bulk modulus', q: 'pressure', unit: 'GPa', value: 2.193, tex: 'K', hint: '2.19 GPa for water at 20 °C; 0.14 MPa (γp) for air.' }, rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 998.2, tex: '\\rho' } },
      solveFor: 'c', note: 'For small disturbances and frequencies low enough that K is the adiabatic modulus.',
      stories: { c: 'A liquid has an adiabatic bulk modulus of {K} and a density of {rho}. How fast does sound travel in it?', K: 'Sound travels at {c} in a liquid of density {rho}. What is its bulk modulus?' } },
    { name: 'Speed of sound in the sea (Mackenzie, 1981)', expr: 'c = 1448.96 + 4.591*T - 0.05304*T^2 + 0.0002374*T^3 + 1.340*(S - 35) + 0.01630*D + 1.675e-7*D^2 - 0.01025*T*(S - 35) - 7.139e-13*T*D^3', tex: 'c = 1448.96 + 4.591\\,T - 0.05304\\,T^2 + 2.374{\\times}10^{-4}\\,T^3 + 1.340\\,(S-35) + 0.0163\\,D + 1.675{\\times}10^{-7}\\,D^2 - 0.01025\\,T(S-35) - 7.139{\\times}10^{-13}\\,T D^3',
      vars: { c: { name: 'speed of sound in sea water (m/s)', tex: 'c' }, T: { name: 'temperature (°C, plain number)', value: 10, min: -2, max: 30, signed: true, tex: 'T', hint: 'Use a number in °C, between −2 and 30.' }, S: { name: 'salinity (g/kg, plain number)', value: 35, min: 25, max: 40, tex: 'S', hint: '35 g/kg is the average of the ocean.' }, D: { name: 'depth (m, plain number)', value: 0, min: 0, max: 8000, tex: 'D' } },
      solveFor: 'c', note: 'Mackenzie’s nine-term fit, good to about 0.1 m/s. The variables are plain numbers in °C, g/kg and metres.',
      stories: { c: 'What is the speed of sound in sea water at {T} °C, with a salinity of {S} g/kg at a depth of {D} m?' } },
    { name: 'Echo sounding', expr: 'd = c*t/2', tex: 'd = \\frac{c\\,t}{2}',
      vars: { d: { name: 'depth (distance)', q: 'length', unit: 'm', tex: 'd' }, c: { name: 'speed of sound', q: 'speed', unit: 'm/s', value: 1500, tex: 'c' }, t: { name: 'time for the echo to return', q: 'time', unit: 's', value: 2.6, tex: 't', hint: 'The round trip: there and back.' } },
      solveFor: 'd', note: 'An error of 1 % in the assumed speed of sound is 1 % in the depth; sonar processing corrects with measured profiles.',
      stories: { d: 'A pulse of sound comes back from the sea floor after {t}. With a speed of {c}, how deep is the water?', t: 'The sea floor is {d} below a ship; sound travels at {c}. How long does the echo take?' } },
    { name: 'Fraction of sound passing a boundary', expr: 'Tr = 4*rho1*c1*rho2*c2/(rho1*c1 + rho2*c2)^2', tex: 'T = \\frac{4\\,\\rho_1 c_1\\,\\rho_2 c_2}{(\\rho_1 c_1 + \\rho_2 c_2)^2}',
      vars: { Tr: { name: 'fraction of intensity transmitted', q: 'ratio', unit: '%', tex: 'T' }, rho1: { name: 'density of medium 1 (air)', q: 'density', unit: 'kg/m³', value: 1.204, tex: '\\rho_1' }, c1: { name: 'sound speed in medium 1', q: 'speed', unit: 'm/s', value: 343, tex: 'c_1' }, rho2: { name: 'density of medium 2 (water)', q: 'density', unit: 'kg/m³', value: 998.2, tex: '\\rho_2' }, c2: { name: 'sound speed in medium 2', q: 'speed', unit: 'm/s', value: 1482, tex: 'c_2' } },
      solveFor: 'Tr', note: 'Normal incidence. For air to water it is 0.11 %, about −30 dB.',
      stories: { Tr: 'Sound passes from a medium of density {rho1} and sound speed {c1} to one of density {rho2} and sound speed {c2}. What fraction of its energy is transmitted?' } }
  ],
  examples: [
    { title: 'Why sound is faster in water', q: 'Water has K = 2.19 GPa and ρ = 998 kg/m³; air has γp = 1.42×10⁵ Pa and ρ = 1.204 kg/m³. Find the speed of sound in each.',
      steps: [{ text: 'Water:', tex: 'c = \\sqrt{\\frac{2.19\\times10^{9}}{998}} = 1481\\ \\mathrm{m/s}' }, { text: 'Air:', tex: 'c = \\sqrt{\\frac{1.42\\times10^{5}}{1.204}} = 343\\ \\mathrm{m/s}' }],
      a: '1,481 and 343 m/s. The ratio of stiffnesses (15,400) over that of densities (830) is 18.5, and its square root is 4.3.' },
    { title: 'A sounding', q: 'An echo from the sea floor returns 2.6 s after the pulse. What is the depth, if c = 1,500 m/s? If the real c is 1,490, how big is the error?',
      steps: [{ text: '', tex: 'd = \\frac{ct}{2} = \\frac{1500\\times2.6}{2} = 1950\\ \\mathrm{m}' }, 'With 1,490: $d = 1937$ m, 13 m less (0.7 %).'],
      a: '1,950 m, with an uncertainty of about 13 m from the speed alone: this is why surveys measure the temperature and salinity profile.' },
    { title: 'Can a diver tell where a sound comes from?', q: 'The ears are 0.2 m apart. Find the largest difference in arrival time of a sound from the side in air and in water.',
      steps: [{ text: 'Air:', tex: '\\frac{0.2}{343} = 0.58\\ \\mathrm{ms}' }, { text: 'Water:', tex: '\\frac{0.2}{1482} = 0.13\\ \\mathrm{ms}' }],
      a: '0.58 ms in air and 0.13 ms in water: the brain’s timing cue is a quarter as large, and with sound also entering through the skull, direction is hard to tell under water.' }
  ],
  quiz: [
    { q: 'Sound is about four times faster in water than in air because', choices: ['water is denser', 'water is much stiffer, more than enough to offset its density', 'water is colder', 'water is wetter'], a: 1, why: 'c = √(K/ρ). Water is 830 times denser, which slows sound, but 15,000 times stiffer, which speeds it up by √15,000 ≈ 120 against √830 ≈ 29, a net ratio of 4.3.' },
    { q: 'How does the speed of sound in water change as it is warmed from 0 to 60 °C?', choices: ['It falls, as in all liquids', 'It rises by about 150 m/s', 'It stays constant', 'It rises by about 5 m/s'], a: 1, why: 'From 1,402 to 1,551 m/s, a rise of about 150 m/s, because warming makes water stiffer. It peaks at 1,555 m/s near 74 °C.' },
    { q: 'A ship’s echo sounder receives its echo 4.0 s after the ping. Taking c = 1,500 m/s, the depth, in metres, is', answer: 3000, unit: 'm', why: 'The pulse goes down and back, so d = ct/2 = 1,500 × 4.0 / 2 = 3,000 m.' },
    { q: 'Sound in the SOFAR channel travels so far because', choices: ['the speed is highest there', 'the speed is lowest there, bending the sound back towards the axis', 'there are no fish', 'the water is colder'], a: 1, why: 'Sound rays bend towards slower regions. A minimum of c at about 1 km depth acts as a lens that keeps the sound at that depth.' },
    { q: 'A voice from the shore is very easily heard by a person swimming just below the surface.', a: false, why: 'Only 0.1 % of the energy crosses from air into water (impedances 413 against 1.48×10⁶ Pa·s/m); the rest is reflected. Swimmers hear little of what is said above.' }
  ],
  applications: ['Sonar and echo sounding: charting the sea floor, finding fish and wrecks, and submarine detection.', 'Medical ultrasound: images of the heart and the unborn, and Doppler measurement of blood flow, with 1,540 m/s as the tissue speed.', 'Ocean acoustic tomography and the measurement of ocean temperature: the travel time of low-frequency sound across a basin gives its mean temperature to a fraction of a degree.', 'Monitoring the oceans: hydrophone networks in the sound channel record whales, ships, earthquakes and nuclear tests.', 'Industry: ultrasonic flow meters, cleaning baths, and the testing of materials.'],
  history: 'Colladon and Sturm measured the speed of sound in Lake Geneva in 1826 (1,435 m/s at 8 °C), the first accurate figure. Ewing and Worzel found the deep sound channel in the 1940s while looking for ways to rescue downed airmen by ranging on small explosions, and Brekhovskikh found it independently. Mackenzie published the sea-water equation in 1981.',
  sources: ['Bilaniuk and Wong, “Speed of sound in pure water as a function of temperature”, *Journal of the Acoustical Society of America* 93, 1609 (1993) — the pure-water values.', 'Mackenzie, “Nine-term equation for sound speed in the oceans”, *Journal of the Acoustical Society of America* 70, 807 (1981).', 'Urick, *Principles of Underwater Sound* (3rd ed., McGraw-Hill, 1983), ch. 5.', 'Munk, Worcester and Wunsch, *Ocean Acoustic Tomography* (Cambridge University Press, 1995).'],
  sim: { id: 'surf-waves', params: { mode: 'sound' } }
}

);
