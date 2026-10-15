/* HYPER-WATER · content/oceans-in-the-dark.js — the topic "Oceans in the dark" (branch Water in the Universe), simulation ids ow-.
 *   europa                          the ocean under the ice that Jupiter’s magnetic field gave away
 *   enceladus                       the plume that Cassini flew through
 *   titan                           the other liquid on a surface, and the water ocean far below
 *   ganymede-and-callisto           the ice sandwich and the quiet old world
 *   ceres-pluto-and-the-dwarfs      brines, a cryovolcano and an ocean inferred from where a basin sits
 *   tidal-heating                   why a moon is warm: e² R⁵ / a⁶
 *   what-life-needs                 water, energy, the six elements, time
 *   water-worlds-around-other-stars hycean worlds, TRAPPIST-1 and the limits of reading starlight
 * The numbers of the sims come from sims/oceans-in-the-dark.js and kit.water. Dates are current to 2026-10: Europa Clipper launched
 * 14 October 2024 (arrives April 2030); JUICE launched 14 April 2023 (Jupiter 2031, orbit round Ganymede from 2034); Dragonfly is due
 * to launch in 2028 and reach Titan in 2034; Cassini ended in September 2017.
 */
Hyper.add(

/* ================================================================ Europa */
{
  id: 'europa', parent: 'oceans-in-the-dark', title: 'Europa', level: 2,
  short: 'A moon of Jupiter with a cracked ice shell 15–25 km thick over a salty ocean 60–150 km deep — two to three times the water of all Earth’s seas, betrayed by the way it bends Jupiter’s magnetic field. Its gravity is so weak that the pressure on its seafloor is only about 1.5 times that at the bottom of Earth’s deepest trench.',
  keywords: ['Europa', 'Jupiter moon', 'subsurface ocean', 'ice shell', 'Galileo', 'induced magnetic field', 'chaos terrain', 'Conamara', 'plumes', 'Europa Clipper', 'ocean world', 'seafloor pressure'],
  prereq: ['why-ice-floats', 'the-phase-diagram', 'physics:hydrostatic-pressure'],
  related: ['enceladus', 'ganymede-and-callisto', 'tidal-heating', 'what-life-needs', 'ice-beyond-earth', 'the-salt-of-the-sea', 'the-search-follows-the-water', 'physics:planets'],
  body: `
Europa is the smallest of Jupiter's four big moons, a little smaller than our own (radius 1,561 km), and it is the best-studied candidate for a hidden ocean. Its surface is ice — bright, cracked, almost free of craters, which means young, tens of millions of years old. Nearly every line of evidence says that beneath that ice lies liquid water, and more of it than all of Earth's seas. The lid is ice and not rock because ice floats ([[why-ice-floats]]): the same open lattice that keeps a pond liquid under a lid of ice keeps Europa's ocean liquid under its own.

### The evidence
- **A magnetic echo.** Europa has no field of its own, but Jupiter's tilted field rotates past it, so the field at Europa swings back and forth every 11.2 hours. Galileo's magnetometer, passing between 1997 and 2000, saw Europa answer: currents were induced in a conducting layer near the surface, and they made a field opposing the change. Ice does not conduct; salty water does ([[the-salt-of-the-sea]]). The size of the response fits a global layer of salt water some tens of kilometres thick (Kivelson and colleagues, 2000).
- **A broken surface.** In the *chaos terrain* slabs of ice a few kilometres across have tilted, turned and frozen into a smooth matrix, like pack ice in a spring bay.
- **Plumes, probably.** Hubble saw ultraviolet light from hydrogen and oxygen near the south pole in 2012, consistent with water vapour, and in 2014 and 2016 dark silhouettes about 100 km high against Jupiter in the same place. A re-analysis of Galileo data fits a plume too. No spacecraft has yet flown through one, so they remain *probable*, not confirmed.
- **Salt and carbon on the surface.** Hubble images showed sodium chloride in the chaos terrain (2019); JWST found carbon dioxide at Tara Regio (2023) that appears to come from below.

### How thick, how deep
The usual picture is an ice shell 15–25 km thick over an ocean 60–150 km deep. The geometry is generous: a 100-km ocean over a body 3,100 km across holds about 2.8 billion cubic kilometres — roughly **two to three Earth oceans** of water.

### A deep ocean, a gentle seafloor
| | Depth of water | Gravity | Pressure at the bottom |
|---|---|---|---|
| Challenger Deep, Earth | 10.9 km | 9.8 m/s² | 109 MPa |
| Europa (20 km ice, 100 km ocean) | 120 km | 1.31 m/s² | about 160 MPa |

Pressure is density times gravity times depth, and Europa's gravity is one-seventh of Earth's. The seafloor, 120 km down, is at only 1.5 times the pressure of Earth's deepest trench — below the 209 MPa at which ice Ih gives way to denser ices, so the ocean can touch the rock, unlike the great ocean of [[ganymede-and-callisto]].

### What keeps it liquid, and what it could feed
The surface is at −160 °C. Heat comes from inside: Jupiter's tide squeezing Europa on an orbit kept slightly eccentric by its neighbours ([[tidal-heating]]), with some from radioactive decay. Above, Jupiter's radiation splits surface ice into oxygen and hydrogen peroxide; if some is carried down through the shell, it can meet reduced chemicals from the seafloor — the pairing that powers life at Earth's vents ([[what-life-needs]]). How much is mixed down is not known.

### What comes next
**Europa Clipper** launched on 14 October 2024 and reaches Jupiter in April 2030, then makes about fifty flybys, some within 25 km. It carries an ice-penetrating radar, cameras, a thermal imager, a mass spectrometer and a dust analyser (to taste any plume) and a magnetometer. It does not land; it will measure the shell, the salinity and whether the ocean touches rock.

> [!key] Europa’s induced magnetic field shows a salty ocean 60–150 km deep under a 15–25 km ice shell, holding two to three Earth oceans of water; because gravity is weak, the seafloor pressure is only about 1.5 times Earth’s trench. Clipper arrives in April 2030 to measure it.`,
  ideas: ['Jupiter’s changing field induces currents in a salty layer under Europa’s ice; Galileo saw the response.', 'An ice shell 15–25 km thick floats on an ocean 60–150 km deep: two to three times the water of Earth’s oceans.', 'Low gravity (1.31 m/s²) keeps the pressure at even a 120-km-deep seafloor to about 160 MPa, 1.5 times Earth’s deepest trench.', 'Plumes are probable, not confirmed; Europa Clipper (arrival April 2030) will test them and measure the shell.'],
  pitfalls: ['“Europa’s ocean must be crushed by enormous pressure” — Pressure is density × gravity × depth, and gravity is one-seventh of Earth’s: the seafloor is at about 160 MPa, 1.5 times Earth’s deepest trench.', '“Europa has erupting geysers, like Enceladus” — The plumes are probable (Hubble, 2012–2016) but no spacecraft has flown through one; Enceladus’s are sampled, Europa’s are not.', '“A warm moon has a warm ocean” — The ocean sits near its freezing point under a surface at −160 °C; tidal heat keeps it from freezing, not hot.'],
  terms: [
    { term: 'Induced magnetic field', also: ['magnetic induction', 'induction response'], def: 'The magnetic field generated by electric currents that a changing external field drives in a conducting body. Europa, Ganymede and Callisto show one in Jupiter’s field, which points to a salty ocean beneath their ice.' },
    { term: 'Chaos terrain', also: ['chaos', 'Conamara Chaos'], def: 'Regions of Europa where the ice shell is broken into blocks that have tilted and shifted in a smoother matrix, thought to mark places where the shell was warmed or melted from below.' },
    { term: 'Ocean world', also: ['ocean moon', 'water world (in the Solar System)'], def: 'A planet or moon with a large body of liquid water beneath its surface, or on it. In this app it means the icy moons and dwarf planets that are covered in ice and hold an ocean inside.' },
    { term: 'Europa Clipper', also: ['Clipper'], def: 'NASA’s mission to Europa, launched 14 October 2024 and arriving at Jupiter in April 2030; about fifty close flybys carrying radar, cameras, spectrometers and a magnetometer.' }
  ],
  formulas: [
    { name: 'Pressure at the bottom of an ocean under ice', expr: 'p = g*(rhoI*hI + rhoO*hO)', tex: 'p = g\\left(\\rho_i\\,h_i + \\rho_o\\,h_o\\right)',
      vars: { p: { name: 'pressure at the seafloor', q: 'pressure', unit: 'MPa', hint: 'Gauge pressure: the weight of ice and water per unit area. Earth’s Challenger Deep is about 109 MPa.' },
        g: { name: 'surface gravity', q: 'accel', unit: 'm/s²', value: 1.315, hint: '1.315 for Europa, 0.113 for Enceladus, 1.428 for Ganymede. It changes little through the water layer.' },
        rhoI: { name: 'density of the ice', q: 'density', unit: 'kg/m³', value: 931, tex: '\\rho_i', hint: 'Ice Ih at about −100 °C is 931 kg/m³: a little denser than at 0 °C because it has contracted.' },
        hI: { name: 'thickness of the ice shell', q: 'length', unit: 'km', value: 20, tex: 'h_i', hint: '15–25 km is the usual estimate for Europa.' },
        rhoO: { name: 'density of the ocean', q: 'density', unit: 'kg/m³', value: 1030, tex: '\\rho_o', hint: 'About 1,026 for sea water; more if the ocean is saltier.' },
        hO: { name: 'depth of the ocean', q: 'length', unit: 'km', value: 100, tex: 'h_o', hint: '60–150 km for Europa.' } },
      solveFor: 'p', note: 'Valid while the pressure is below about 209 MPa, where ice III would form; gravity is taken as uniform, which is close for a layer this shallow.',
      stories: { p: 'On a moon with surface gravity {g}, an ice shell {hI} thick (density {rhoI}) floats on an ocean {hO} deep (density {rhoO}). What is the pressure on the seafloor?', hO: 'The pressure at the seafloor is {p}, under {hI} of ice, with gravity {g}. How deep is the ocean?' } },
    { name: 'Ocean volume from the shell and ocean thicknesses', expr: 'N = 4*pi*((Rm - hI)^3 - (Rm - hI - hO)^3)/(3*Voc)', tex: 'N = \\frac{4\\pi}{3}\\,\\frac{(R - h_i)^3 - (R - h_i - h_o)^3}{V_\\mathrm{E}}',
      vars: { N: { name: 'ocean volume in Earth oceans', hint: 'How many times the volume of all Earth’s oceans the moon’s ocean holds.' },
        Rm: { name: 'radius of the moon', q: 'length', unit: 'km', value: 1560.8, tex: 'R', hint: '1,560.8 km for Europa, 252.1 for Enceladus.' },
        hI: { name: 'thickness of the ice shell', q: 'length', unit: 'km', value: 20, tex: 'h_i' },
        hO: { name: 'depth of the ocean', q: 'length', unit: 'km', value: 100, tex: 'h_o' },
        Voc: { name: 'volume of Earth’s oceans', q: 'volume', unit: 'm³', value: 1.338e18, fixed: true, tex: 'V_\\mathrm{E}', hint: '1.338 billion km³ (USGS).' } },
      solveFor: 'N', note: 'The volume of a spherical shell between the base of the ice (radius R − hᵢ) and the top of the rock (R − hᵢ − hₒ).',
      stories: { N: 'A moon of radius {Rm} has an ice shell {hI} thick over an ocean {hO} deep. How many Earth oceans of water does the ocean hold?' } },
    { name: 'Thickness of a conducting ice shell', expr: 'h = k*dT/qf', tex: 'h = \\frac{k\\,\\Delta T}{q}',
      vars: { h: { name: 'shell thickness', q: 'length', unit: 'km' },
        k: { name: 'thermal conductivity of the ice', q: 'thermcond', unit: 'W/(m·K)', value: 3.2, hint: 'Cold ice conducts better than warm ice: about 567/T W/(m·K), so 3.2 near 180 K.' },
        dT: { name: 'temperature difference across the shell', q: 'dtemp', unit: 'K', value: 170, tex: '\\Delta T', hint: 'From about 100 K at the surface to about 270 K at the ocean.' },
        qf: { name: 'heat flux through the shell', q: 'intensity', unit: 'mW/m²', value: 20, tex: 'q', hint: 'Tidal and radioactive heat leaving the moon, per square metre. Earth’s average is 87 mW/m².' } },
      solveFor: 'h', note: 'A simple conductive estimate. A real shell may also convect in its lower part, which changes the numbers but not the idea: more heat, thinner shell.',
      stories: { h: 'Heat leaves a moon at {qf} through ice of conductivity {k} between a surface and an ocean {dT} warmer. How thick is the shell if it is purely conductive?' } }
  ],
  examples: [
    { title: 'The pressure at the bottom of Europa’s ocean', q: 'Take a shell of 20 km of ice (931 kg/m³) over an ocean 100 km deep (1,030 kg/m³) on a moon with g = 1.315 m/s². Find the pressure on the seafloor, and compare with the bottom of Earth’s Challenger Deep (109 MPa).',
      steps: ['The ice presses on the ocean: $\\rho_i g h_i = 931 \\times 1.315 \\times 20{,}000 = 24.5$ MPa.', 'The ocean adds its own weight: $1030 \\times 1.315 \\times 100{,}000 = 135.5$ MPa.', { text: 'The sum:', tex: 'p = 24.5 + 135.5 = 160\\ \\mathrm{MPa}' }, 'Compared with Earth: $160/109 = 1.5$.'],
      a: 'About 160 MPa — 1,600 atmospheres, only 1.5 times the deepest trench on Earth, though the water is ten times deeper.' },
    { title: 'How many Earth oceans?', q: 'Europa has radius 1,560.8 km, an ice shell 20 km thick and an ocean 100 km deep. How many times Earth’s ocean volume (1.338 × 10⁹ km³) is that?',
      steps: ['Outer radius of the ocean $R - h_i = 1540.8$ km; inner radius $1440.8$ km.', { text: 'Volume of the shell between them:', tex: 'V = \\tfrac{4}{3}\\pi\\,(1540.8^3 - 1440.8^3) = 2.79\\times 10^{9}\\ \\mathrm{km^3}' }, 'Divide by Earth’s ocean volume: $2.79/1.338 = 2.1$.'],
      a: 'About two Earth oceans. Thicken the ocean to 150 km and it is nearly three.' }
  ],
  quiz: [
    { q: 'Why does the way Europa responds to Jupiter’s magnetic field point to a subsurface ocean?', choices: ['Ice is magnetic and would amplify the field', 'A changing field induces currents only in a conductor, and salty water conducts where ice does not', 'Ocean water is warmer than ice, and warm things emit magnetic fields', 'Only a liquid can have a magnetic field of its own'], a: 1, why: 'Europa has no field of its own to speak of; what Galileo saw is the field of currents that Jupiter’s changing field drives in a conducting layer near the surface. Salty water fits; ice and dry rock do not.' },
    { q: 'The pressure at the bottom of Europa’s ocean is far higher than at the bottom of Earth’s deepest trench, because the water is ten times deeper.', a: false, why: 'Pressure goes with depth times gravity, and Europa’s gravity is only 1.31 m/s². The seafloor is at about 160 MPa, about 1.5 times the pressure of the Challenger Deep.' },
    { q: 'What is the pressure at the bottom of a layer of water 100 km deep on Europa (g = 1.315 m/s², density 1,000 kg/m³), in MPa, ignoring the ice?', answer: 131.5, unit: 'MPa', why: '$p = \\rho g h = 1000 \\times 1.315 \\times 100{,}000 = 1.315\\times10^{8}$ Pa. On Earth the same 100 km would give 980 MPa.' },
    { q: 'Why are Europa’s plumes still described as “probable”?', choices: ['Hubble saw them only once', 'They were seen in remote observations (Hubble), but no spacecraft has flown through one or sampled it', 'They have been disproved by Galileo', 'They are visible only in infrared'], a: 1, why: 'Hubble saw hints in 2012, 2014 and 2016 and a Galileo flyby may have passed through one, but nobody has sampled a plume directly, as Cassini did at Enceladus. Clipper will look.' },
    { q: 'Doubling the heat that leaves through Europa’s ice shell, with the same surface and ocean temperatures, would make a conductive shell…', choices: ['twice as thick', 'half as thick', 'unchanged', 'four times as thick'], a: 1, why: 'The thickness is $h = k\\Delta T/q$: for a given temperature difference, doubling the heat flux halves the thickness.' }
  ],
  applications: ['Planning Europa Clipper: its radar, magnetometer and gravity experiments are designed to measure the shell thickness, the ocean’s salinity and depth, and whether the ocean touches rock.', 'Ice-penetrating radar of the same kind finds subglacial lakes under the Antarctic ice sheet, such as Lake Vostok under about 4 km of ice — the nearest thing on Earth to what Clipper will look for.', 'Magnetic induction is used on Earth in magnetotelluric surveys that map salty groundwater and hot rock below the ground.', 'Sets the target list for planetary protection: spacecraft that reach a possible ocean must not carry Earth life to it.'],
  history: 'Galileo discovered Europa in January 1610. In 1979, before the Voyager flybys, Peale, Cassen and Reynolds calculated that tidal heating could keep a hidden ocean liquid; Voyager’s cracked, young surface and then Galileo’s magnetometer (1997–2000) made the ocean the standard picture. The Galileo spacecraft ended its mission in 2003 by plunging into Jupiter to protect Europa from contamination.',
  sources: ['NASA JPL, “NASA missions provide new insights into ‘ocean worlds’” (13 April 2017) — Hubble’s probable plume of 2016 and the Clipper plan.', 'Kivelson, Khurana, Russell and colleagues, “Galileo magnetometer measurements: a stronger case for a subsurface ocean at Europa”, *Science* (2000).', 'Roth and colleagues, “Transient water vapor at Europa’s south pole”, *Science* (2014); Sparks and colleagues, *Astrophysical Journal Letters* (2017).', 'NASA, Europa Clipper mission pages (launch 14 October 2024; arrival April 2030).'],
  sim: { id: 'ow-ocean-section', params: { world: 'europa' } }
},

/* ================================================================ Enceladus */
{
  id: 'enceladus', parent: 'oceans-in-the-dark', title: 'Enceladus', level: 2,
  short: 'A 500-km moon of Saturn whose south pole sprays water, salt, silica and hydrogen into space from a global ocean 20–40 km deep under 5–30 km of ice. Cassini flew through the plume in 2015 and tasted hydrogen and carbon dioxide — the food of the oldest kind of life on Earth.',
  keywords: ['Enceladus', 'Saturn moon', 'plume', 'tiger stripes', 'Cassini', 'hydrogen', 'methanogenesis', 'hydrothermal', 'E ring', 'silica nanoparticles', 'phosphates', 'libration', 'JWST plume'],
  prereq: ['europa', 'the-phase-diagram'],
  related: ['tidal-heating', 'what-life-needs', 'titan', 'lifes-start-in-water', 'the-deuterium-clock', 'the-salt-of-the-sea', 'the-search-follows-the-water'],
  body: `
Enceladus is a small, white moon of Saturn, 504 km across — about the straight-line distance from London to Edinburgh. It reflects nearly all the light that falls on it, because it is covered in fresh ice. In 2005 Cassini found something no one had expected: at the south pole, along four long fractures nicknamed the **tiger stripes**, jets of vapour and ice grains burst into space, hundreds of kilograms every second. Where there is a spray of water there is a source of water, and Cassini spent a decade learning what the source was.

### What comes out
Cassini's deepest flight through the plume, on 28 October 2015, found it to be about **98 % water**, with about **1 % molecular hydrogen** and smaller amounts of carbon dioxide, methane and ammonia (Waite and colleagues, 2017). Dust detectors added more:
- **Salt.** Grains of sodium chloride, sodium carbonate and bicarbonate: a salty, alkaline sea (roughly 0.5–2 % salt by mass, pH between about 9 and 12 in different analyses).
- **Silica nanoparticles** a few nanometres wide (Hsu and colleagues, 2015). Silica dissolves from rock only in water above about 90 °C, so they point to hot, hydrothermal water at the seafloor.
- **Phosphates** (Postberg and colleagues, 2023), the ingredient life is usually short of.
- **Organic molecules**, some large.
In 2023 JWST saw the plume reach nearly 10,000 km into space, forty times the moon's diameter, feeding a torus of water round Saturn (Villanueva and colleagues).

### An ocean the wobble gave away
Tracking surface features in Cassini images taken between 2004 and 2015, Thomas and colleagues found that the ice shell *librates* (rocks back and forth as the moon orbits) much more than a solid moon would. That is possible only if the shell is cut loose from the core by a **global ocean**, 20–40 km deep under a shell of ice 5–30 km thick, thinnest at the south pole.

### A food for life
The hydrogen is the clue. Hot water reacting with rock makes hydrogen; hydrogen and carbon dioxide are the raw material of **methanogenesis**:

$$4\\,\\ce{H2} + \\ce{CO2} \\to \\ce{CH4} + 2\\,\\ce{H2O}\\qquad \\Delta G^\\circ \\approx -131\\ \\mathrm{kJ/mol}$$

This is the reaction by which methanogens, among the oldest organisms on Earth, make a living at vents, with no sunlight. Enceladus supplies the hydrogen, the carbon dioxide, the heat, the salt and (so far as measured) the phosphorus. Whether anything eats it is not known: models show the plume's hydrogen could come from chemistry alone ([[what-life-needs]]).

### Why so much heat?
Between roughly 5 and 16 GW comes out of the south polar region, depending on what is counted — far more than simple models of tidal heating give ([[tidal-heating]]). The ocean is kept liquid by that heat; the shell above it is ice because ice floats and insulates ([[why-ice-floats]]).

### Escape and fallback
Gravity is 0.113 m/s², the escape speed 239 m/s. The gas leaves at near a kilometre per second, but most grains are slower and fall back as snow; only the fast fraction escapes, and builds Saturn's **E ring**, the diffuse outermost ring.

> [!key] Enceladus’s south pole vents a salty alkaline ocean — water, hydrogen, carbon dioxide, silica, phosphates — through an ice shell 5–30 km thick, from a global ocean 20–40 km deep that its wobble revealed. The hydrogen and carbon dioxide are the food of methanogens; whether anything lives on them is open.`,
  ideas: ['The plume is ~98 % water, ~1 % hydrogen, with CO₂, methane and ammonia (Cassini, 28 October 2015).', 'Silica nanoparticles imply water hotter than 90 °C at the seafloor; salts and phosphates were found in the grains (2023).', 'The ice shell’s libration needs a global ocean, 20–40 km deep under 5–30 km of ice.', 'H₂ + CO₂ → CH₄ is food for methanogens, but the hydrogen may be made without life.', 'With escape speed 239 m/s only the fastest grains leave and feed the E ring.'],
  pitfalls: ['“Cassini found life on Enceladus” — It found chemical food and ingredients; it carried no instrument able to tell life from chemistry, and it ended in 2017.', '“The plume is a geyser fed by a lake” — It is a curtain of about a hundred jets along four fractures, fed from a global ocean, with pressure and tides opening and closing the cracks.', '“Hydrogen in the plume means there must be life” — Hot water and rock make hydrogen without life; the hydrogen is a clue to energy, not to biology.'],
  terms: [
    { term: 'Tiger stripes', also: ['sulci', 'Damascus, Baghdad, Cairo and Alexandria Sulci'], def: 'Four roughly parallel fractures, about 130 km long and 35 km apart, across Enceladus’s south pole, warmer than their surroundings and the source of the plume jets.' },
    { term: 'E ring', also: ['Saturn’s E ring'], def: 'The faint, wide outer ring of Saturn, made of micrometre-sized ice grains that escape from Enceladus’s plume; it is continually replenished because the grains are lost in decades.' },
    { term: 'Libration', also: ['physical libration', 'wobble'], def: 'A small rocking of a body’s rotation as it orbits. Enceladus’s ice shell librates much more than a solid body would, which shows that it is not rigidly attached to the core: a global ocean lies between.' },
    { term: 'Methanogenesis', also: ['methanogen metabolism'], def: 'The chemical reaction 4 H₂ + CO₂ → CH₄ + 2 H₂O (about −131 kJ per mole of methane under standard conditions) by which methanogenic archaea gain energy; the metabolism is also made without life in hydrothermal rock.' },
    { term: 'Hydrothermal activity', also: ['hydrothermal vent', 'water–rock reaction'], def: 'Hot water circulating through rock, dissolving minerals and making chemicals such as hydrogen and silica. On Earth it feeds the vent ecosystems; on Enceladus it is inferred from silica grains and hydrogen.' }
  ],
  formulas: [
    { name: 'Escape speed', expr: 'v = sqrt(2*G*M/Rm)', tex: 'v_\\mathrm{esc} = \\sqrt{\\frac{2GM}{R}}',
      vars: { v: { name: 'escape speed', q: 'speed', unit: 'm/s', tex: 'v_\\mathrm{esc}', hint: 'The speed above which a grain thrown upwards from the surface leaves for good.' }, G: { const: 'G' },
        M: { name: 'mass of the moon', q: 'mass', unit: 'kg', value: 1.08e20, hint: '1.08 × 10²⁰ kg for Enceladus; 4.8 × 10²² for Europa.' },
        Rm: { name: 'radius of the moon', q: 'length', unit: 'km', value: 252.1, tex: 'R' } },
      solveFor: 'v', note: 'Ignores Saturn’s pull, the moon’s rotation and the gas drag that accelerates grains in the vent.',
      stories: { v: 'A moon of mass {M} and radius {Rm}. How fast must a grain leave the surface to escape?' } },
    { name: 'Height of a grain in low gravity', expr: 'h = v^2/(2*g)', tex: 'h = \\frac{v^2}{2g}',
      vars: { h: { name: 'greatest height', q: 'length', unit: 'km' }, v: { name: 'launch speed', q: 'speed', unit: 'm/s', value: 80, hint: 'About 80 m/s is a typical grain speed in the plume; the gas is much faster.' },
        g: { name: 'surface gravity', q: 'accel', unit: 'm/s²', value: 0.113, hint: '0.113 m/s² on Enceladus, one eighty-seventh of Earth’s.' } },
      solveFor: 'h', note: 'Good while the height is small beside the radius (a few tens of kilometres here); at higher launch speeds use the escape condition.',
      stories: { h: 'A grain leaves the vent at {v} on a moon with gravity {g}. How high does it rise?', v: 'To rise {h} on a moon with gravity {g}, a grain must leave at what speed?' } },
    { name: 'Power from methanogenesis', expr: 'P = F*dG/4', tex: 'P = \\frac{F\\,\\Delta G}{4}',
      vars: { P: { name: 'chemical power', q: 'power', unit: 'W' }, F: { name: 'hydrogen consumed', unit: 'mol/s', value: 10, tex: 'F', hint: 'Moles of H₂ reacted per second. Hypothetical here: the real supply to any ocean is unknown.' },
        dG: { name: 'energy released per mole of CH₄', q: 'molarenergy', unit: 'kJ/mol', value: 131, tex: '\\Delta G', hint: 'Under standard conditions 131 kJ per mole of methane; less in the cold, dilute ocean.' } },
      solveFor: 'P', note: 'Four hydrogen molecules are consumed for each methane made, hence the 4.',
      stories: { P: 'An ocean’s microbes can react {F} of hydrogen, each four moles releasing {dG}. What is the chemical power?' } }
  ],
  examples: [
    { title: 'The escape speed of Enceladus', q: 'Enceladus has mass 1.08 × 10²⁰ kg and radius 252.1 km. What is the escape speed, and what share of Earth’s?',
      steps: [{ text: 'Use the formula with G = 6.674 × 10⁻¹¹:', tex: 'v = \\sqrt{\\frac{2 \\times 6.674\\times10^{-11} \\times 1.08\\times10^{20}}{2.521\\times 10^{5}}} = \\sqrt{5.72\\times10^{4}} = 239\\ \\mathrm{m/s}' }, 'Earth’s escape speed is 11,186 m/s: Enceladus’s is 2 % of it.'],
      a: '239 m/s (860 km/h) — a fast cyclist’s throw is not enough, but a vent can manage.' },
    { title: 'How high does a typical grain rise?', q: 'A grain leaves a tiger-stripe fracture at 80 m/s, vertically. How high does it climb, and how long is it in the air?',
      steps: [{ text: 'Using constant gravity:', tex: 'h = \\frac{v^2}{2g} = \\frac{80^2}{2\\times0.113} = 28\\ \\mathrm{km}' }, 'The flight takes $2v/g = 2\\times80/0.113 \\approx 1{,}400$ s, about 24 minutes.', 'On Earth the same throw would reach 330 m and last 16 seconds.'],
      a: 'About 28 km (32 km allowing for gravity falling with height) and 24 minutes in the air — a slow snowfall.' }
  ],
  quiz: [
    { q: 'What showed that Enceladus’s ice shell is not frozen solidly to its rocky core?', choices: ['The shell’s libration is larger than a solid moon’s', 'The shell is thinner than Earth’s', 'The moon’s density is low', 'The surface is white'], a: 0, why: 'The measured rocking of the surface (libration) is much larger than for a moon locked rigidly together, so the shell must float free on a global ocean.' },
    { q: 'Why do silica nanoparticles in Saturn’s E ring point to hot water at the seafloor?', choices: ['Silica forms only in the cold', 'Silica dissolves from rock in water hotter than about 90 °C and then condenses into tiny grains when it cools', 'They are made by sunlight', 'They come from Saturn’s atmosphere'], a: 1, why: 'The grains are so small and so uniform that they must have formed from silica-rich water cooling quickly in the ocean, which needs hydrothermal temperatures of about 90 °C or more (Hsu and colleagues, 2015).' },
    { q: 'Most of the ice grains that leave Enceladus’s vents escape from the moon.', a: false, why: 'The escape speed is 239 m/s and most grains are slower, so most fall back as snow; only the fastest fraction escapes and builds the E ring.' },
    { q: 'What is the escape speed from a moon of mass 1.08 × 10²⁰ kg and radius 252.1 km, in m/s?', answer: 239, unit: 'm/s', why: '$v = \\sqrt{2GM/R} = \\sqrt{2\\times6.674\\times10^{-11}\\times1.08\\times10^{20}/2.521\\times10^{5}} \\approx 239$ m/s.' },
    { q: 'Molecular hydrogen in the plume is most important because it', choices: ['proves there is life', 'shows that water is reacting with hot rock, and is an energy source for methanogens', 'makes the plume visible', 'is the main part of the plume'], a: 1, why: 'Hydrogen is the product of water–rock reactions and the fuel of methanogens; it makes the ocean chemically useful. It does not distinguish life from chemistry, and is only about 1 % of the plume.' }
  ],
  applications: ['Mission design: NASA’s 2023–2032 planetary science decadal survey ranked an Enceladus Orbilander, which would orbit and land to sample the plume, as the second flagship mission after a Uranus orbiter.', 'Testing for life: the plume lets a spacecraft sample the ocean without drilling, the model for “fly through the spray” instruments.', 'Understanding Saturn’s rings: the E ring is a laboratory for how a moon’s vents shape a planet’s environment.', 'Earth analogues: hydrothermal fields such as Lost City in the Atlantic make hydrogen and methane from rock and sea water, as Enceladus is thought to do.'],
  history: 'William Herschel discovered Enceladus in 1789. Voyager 2 (1981) saw its smooth, young plains. Cassini’s magnetometer and cameras found the south polar plume in 2005 (Porco and colleagues, 2006); its dust analyser, mass spectrometer and cameras then mapped the grains and gas until the mission ended, deliberately, in Saturn’s atmosphere in September 2017 to keep Enceladus uncontaminated.',
  sources: ['NASA JPL, “NASA missions provide new insights into ‘ocean worlds’” (13 April 2017); Waite and colleagues, *Science* (2017) — hydrogen in the plume.', 'Hsu and colleagues, “Ongoing hydrothermal activities within Enceladus”, *Nature* (2015).', 'Postberg and colleagues, “Detection of phosphates originating from Enceladus’s ocean”, *Nature* (2023).', 'Villanueva and colleagues, “JWST molecular mapping and characterization of Enceladus’ water plume feeding its torus”, *Nature Astronomy* (2023).'],
  sim: 'ow-plume'
},
/* ================================================================ Titan */
{
  id: 'titan', parent: 'oceans-in-the-dark', title: 'Titan', level: 2,
  short: 'Saturn’s giant moon has rivers, rain and seas of liquid methane and ethane at −179 °C — the only liquid standing on the surface of a world other than Earth — over a crust of water ice as hard as rock and, probably, a water–ammonia ocean far below. Whether that ocean is open water or slush is now an open question.',
  keywords: ['Titan', 'Saturn moon', 'methane lakes', 'Kraken Mare', 'Ligeia Mare', 'Huygens', 'Dragonfly', 'Love number', 'ammonia', 'subsurface ocean', 'methane cycle', 'liquid methane', 'ethane'],
  prereq: ['vapour-pressure-and-evaporation', 'surface-tension', 'europa'],
  related: ['could-life-use-another-liquid', 'the-boiling-point-anomaly', 'colligative-properties', 'ganymede-and-callisto', 'what-life-needs', 'the-search-follows-the-water', 'chemistry:colligative-properties', 'physics:tides'],
  body: `
Titan, the largest moon of Saturn, is bigger than the planet Mercury (radius 2,575 km) and the only moon with a thick atmosphere: nitrogen at 1.47 bar on the ground, with a few per cent methane. At −179 °C (94 K) it is the only world besides Earth with liquid standing on its surface — and that liquid is not water. Water is here too, in two roles: as the bedrock, and as an ocean far underneath.

### The other water cycle
On Titan methane does what water does on Earth. It evaporates, collects in clouds, falls as rare, heavy rain, cuts river valleys and fills lakes. The northern seas, *Kraken Mare* (about 400,000 km², the size of the Caspian) and *Ligeia Mare* (larger than Lake Superior, measured by Cassini's radar to be more than 100 m deep), are liquid methane and ethane with nitrogen dissolved in them.

The liquid behaves differently from water, for a reason that goes straight back to the hydrogen bond: methane forms none. Its density is 0.45 g/cm³, less than half of water's; its surface tension is 18 mN/m, a quarter of water's; its boiling point is −162 °C, while water, of almost the same mass, boils 262 K higher ([[the-boiling-point-anomaly]]). Evaporating a cubic metre of it takes a tenth of the energy it takes for water, so the lakes give up their vapour readily. The simulation lays the two lakes side by side.

### Water as rock
At 94 K water ice is as hard as granite. The ground, the hills and the rounded pebbles that the Huygens probe saw when it landed on 14 January 2005 are water ice, smoothed by flowing methane. The dunes are made of dark organic grains, from the chemistry of methane in the haze.

### An ocean beneath
Titan's orbit round Saturn is slightly eccentric, so it is stretched and relaxed by Saturn's tide. Cassini's radio tracking measured how much, as the **Love number** $k_2$. A rigid Titan would give about 0.1; Cassini found about 0.6 (Iess and colleagues, 2012). The inside must be deformable. The simplest reading was a global ocean of water and ammonia: ammonia is an antifreeze ([[colligative-properties]]; a eutectic at −97 °C), under an ice crust 50–150 km thick and above a floor of high-pressure ice, as the sandwich for [[ganymede-and-callisto]].

In 2025 a re-analysis of the same radio data (Petricca and colleagues, *Nature*) found that Titan dissipates more tidal energy than an open ocean would, and argued for slushy ice with pockets of liquid instead. The question is open; the lakes on the surface are unaffected.

### What is next
NASA's **Dragonfly**, a nuclear-powered rotorcraft, is due to launch in 2028 and reach Titan in 2034. It will hop between sites, starting in the dune fields and ending at Selk crater, where an impact once melted ice and mixed it with organic material, and it carries a seismometer to listen to the interior.

> [!key] Titan has a methane water-cycle at −179 °C (the only other liquid on a world’s surface) over water-ice bedrock; Cassini’s tide measurement (Love number about 0.6) points to a deformable interior, a water–ammonia ocean or a slush, which Dragonfly (arriving 2034) will help test.`,
  ideas: ['Titan has rain, rivers and seas of liquid methane and ethane at 94 K — the only surface liquid known besides Earth’s water.', 'Methane forms no hydrogen bonds: it is light, low in surface tension and easy to evaporate.', 'At 94 K water ice is the bedrock: as hard as granite.', 'Cassini’s Love number k₂ ≈ 0.6 shows a deformable interior; ammonia in water would keep an ocean liquid. A 2025 reanalysis argues for slush.', 'Dragonfly (launch 2028, arrival 2034) will sample the surface.'],
  pitfalls: ['“Titan’s seas are an ocean of methane” — They are lakes and seas on the surface, up to a few hundred metres deep; the water ocean (or slush) is far larger and lies 50–150 km down, beneath the crust.', '“Methane on Titan is like water on Earth, so Titan is like Earth” — The cycle is analogous, but at 94 K, without hydrogen bonds, the liquid is a very different solvent, and the rain is rare.', '“Titan has a water ocean for sure” — The tide shows a deformable interior; whether that is an ocean or a slush with pockets of liquid is being debated after the 2025 analysis.'],
  terms: [
    { term: 'Methane cycle', also: ['Titan’s hydrological cycle'], def: 'The circulation of methane on Titan through evaporation from the lakes, clouds, rain, rivers and groundwater, driven by sunlight — the counterpart of Earth’s water cycle at 94 K.' },
    { term: 'Love number (k₂)', also: ['k2', 'tidal Love number'], def: 'A dimensionless number measuring how much a body’s gravity field changes as the tide deforms it. About 0.0–0.1 for a rigid rocky or icy body, 1.5 for a uniform fluid, so it tells how yielding the interior is.' },
    { term: 'Mare', also: ['maria', 'sea (Titan)'], def: 'A large lake on Titan, named for a sea; Kraken Mare, Ligeia Mare and Punga Mare are the three biggest, all near the north pole.' },
    { term: 'Ammonia antifreeze', also: ['ammonia–water ocean', 'water–ammonia eutectic'], def: 'Ammonia dissolved in water lowers its freezing point, to a minimum of 176 K (−97 °C) at about 32 % ammonia by mass; it is thought to keep subsurface oceans liquid on cold moons.' },
    { term: 'Dragonfly', def: 'NASA’s New Frontiers mission to Titan: a rotorcraft lander due to launch in 2028 and arrive in 2034, to fly between sites and sample the surface and its organic chemistry.' }
  ],
  formulas: [
    { name: 'Freezing-point depression by a dissolved antifreeze', expr: 'dT = iF*Kf*m', tex: '\\Delta T = i\\,K_f\\,m',
      vars: { dT: { name: 'lowering of the freezing point', q: 'dtemp', unit: 'K', tex: '\\Delta T' }, iF: { name: 'van’t Hoff factor', value: 1, tex: 'i', hint: 'About 1 for ammonia, which stays mostly as molecules; about 2 for common salt, which splits into two ions.' },
        Kf: { name: 'cryoscopic constant of water', q: 'colligative', unit: 'K·kg/mol', value: 1.86, fixed: true, tex: 'K_f' },
        m: { name: 'molality of the dissolved substance', q: 'molality', unit: 'mol/kg', value: 6.5, hint: 'Moles of solute per kilogram of water. 10 % ammonia by mass is about 6.5 mol/kg.' } },
      solveFor: 'dT', note: 'A dilute-solution law, good to a few per cent of salt; for strong ammonia solutions it is only a first estimate, since the real freezing curve bottoms out at a eutectic of 176 K.',
      stories: { dT: 'An ocean holds {m} of an antifreeze with van’t Hoff factor {iF}. By how much is its freezing point lowered?', m: 'To lower the freezing point by {dT} with a solute of factor {iF}, how many moles per kilogram of water are needed?' } },
    { name: 'Speed of a surface wave on a lake', expr: 'c = sqrt(g*lam/(2*pi) + 2*pi*sigma/(rho*lam))', tex: 'c = \\sqrt{\\frac{g\\lambda}{2\\pi} + \\frac{2\\pi\\sigma}{\\rho\\lambda}}',
      vars: { c: { name: 'wave speed', q: 'speed', unit: 'm/s' }, g: { name: 'gravity', q: 'accel', unit: 'm/s²', value: 1.352, hint: '1.352 m/s² on Titan, 9.81 on Earth.' },
        lam: { name: 'wavelength', q: 'length', unit: 'm', value: 1, tex: '\\lambda' }, sigma: { name: 'surface tension', q: 'surfacetension', unit: 'mN/m', value: 18, tex: '\\sigma', hint: '18 mN/m for liquid methane at 94 K, 73 for water at 15 °C.' },
        rho: { name: 'density of the liquid', q: 'density', unit: 'kg/m³', value: 450, tex: '\\rho', hint: '450 kg/m³ for liquid methane at 94 K, 999 for water at 15 °C.' } },
      solveFor: 'c', note: 'Deep-liquid waves of small steepness. Long waves are gravity waves (the first term), short ones are ripples (the second); in between there is a slowest wave, which sets the wind needed to start waves.',
      stories: { c: 'Waves of wavelength {lam} cross a lake of density {rho} and surface tension {sigma}, in gravity {g}. How fast do they travel?' } },
    { name: 'Love number of a uniform body', expr: 'k2 = 1.5/(1 + 19*mu/(2*rho*g*Rm))', tex: 'k_2 = \\frac{3/2}{1 + \\dfrac{19\\,\\mu}{2\\rho g R}}',
      vars: { k2: { name: 'Love number', tex: 'k_2', hint: 'Near 0 for a stiff body; 1.5 for a uniform fluid body.' }, mu: { name: 'rigidity (shear modulus)', q: 'pressure', unit: 'GPa', value: 3.5, tex: '\\mu', hint: 'About 3.5 GPa for cold ice, 50–70 GPa for rock.' },
        rho: { name: 'mean density', q: 'density', unit: 'kg/m³', value: 1880, tex: '\\rho', hint: '1,880 kg/m³ for Titan.' }, g: { name: 'surface gravity', q: 'accel', unit: 'm/s²', value: 1.352 },
        Rm: { name: 'radius', q: 'length', unit: 'km', value: 2574.7, tex: 'R' } },
      solveFor: 'k2', note: 'A homogeneous, incompressible, elastic body. Real moons are layered, which is why a measured k₂ is compared with models, but the trend holds: the softer the interior, the higher k₂.',
      stories: { k2: 'A uniform body of mean density {rho}, radius {Rm}, gravity {g} and rigidity {mu}. What is its Love number?', mu: 'A uniform moon of density {rho}, radius {Rm} and gravity {g} has a Love number of {k2}. What rigidity does it have?' } }
  ],
  examples: [
    { title: 'A little ammonia', q: 'An ocean is 10 % ammonia by mass. Estimate how far the freezing point falls. (Ammonia: 17.03 g/mol; K_f = 1.86 K·kg/mol; i ≈ 1.)',
      steps: ['In 1 kg of solution there are 100 g of ammonia (5.87 mol) and 900 g of water.', { text: 'Molality:', tex: 'm = \\frac{5.87\\ \\mathrm{mol}}{0.900\\ \\mathrm{kg}} = 6.5\\ \\mathrm{mol/kg}' }, { text: 'Freezing-point drop:', tex: '\\Delta T = 1 \\times 1.86 \\times 6.5 = 12\\ \\mathrm{K}' }],
      a: 'About 12 K as a first estimate. The measured freezing curve falls further as the ammonia increases, down to −97 °C at 32 % — so a cold Titan crust can sit over liquid.' },
    { title: 'How soft is Titan?', q: 'Titan has mean density 1,880 kg/m³, radius 2,574.7 km and surface gravity 1.352 m/s². What effective rigidity does a uniform Titan need to have the observed k₂ = 0.6?',
      steps: [{ text: 'Solve the formula for $\\mu$:', tex: '\\mu = \\frac{2\\rho g R}{19}\\left(\\frac{3/2}{k_2} - 1\\right)' }, '$2\\rho g R = 2\\times1880\\times1.352\\times2.5747\\times10^{6} = 1.309\\times10^{10}$ Pa.', 'The factor in brackets is $2.5 - 1 = 1.5$, so $\\mu = 1.309\\times10^{10}\\times1.5/19 = 1.03\\times10^{9}$ Pa.'],
      a: 'About 1 GPa — three times softer than cold ice (3.5 GPa) and fifty times softer than rock. A solid Titan would give k₂ of about 0.1; this is why the interior must contain liquid or slush.' }
  ],
  quiz: [
    { q: 'What are the lakes of Titan made of?', choices: ['Liquid water mixed with ammonia', 'Liquid methane and ethane with some dissolved nitrogen', 'Liquid nitrogen', 'Molten ice'], a: 1, why: 'At 94 K water is a rock; the liquids are methane (boiling point −162 °C) and ethane (−89 °C), the only common molecules liquid at that temperature, with nitrogen dissolved from the atmosphere.' },
    { q: 'Why does liquid methane evaporate far more easily than water at its own temperature, per kilogram?', choices: ['Methane is lighter', 'It forms no hydrogen bonds, so there is far less attraction to overcome', 'It is under higher pressure', 'Titan is hotter'], a: 1, why: 'Water must break about 3.7 hydrogen bonds per molecule to escape; methane has only weak dispersion forces, so its latent heat is about 510 kJ/kg against water’s 2,450.' },
    { q: 'A Love number near 0.6 means that Titan’s interior is stiffer than a rock-and-ice solid would be.', a: false, why: 'A rigid body gives about 0.1 or less; 0.6 means the interior yields much more, as it would with a liquid or slush layer under the crust.' },
    { q: 'By how much does 5 mol/kg of an antifreeze with van’t Hoff factor 1 lower the freezing point of water, in K? (K_f = 1.86 K·kg/mol)', answer: 9.3, unit: 'K', why: '$\\Delta T = iK_fm = 1\\times1.86\\times5 = 9.3$ K.' },
    { q: 'Which statement about the Titan ocean is the most accurate in 2026?', choices: ['It has been sampled by the Huygens probe', 'Its existence as an open global ocean is debated; the tide fits a deformable interior, and a 2025 analysis favours slush with liquid pockets', 'It has been disproved', 'It is thinner than Earth’s ocean'], a: 1, why: 'Cassini’s tides show a soft interior; whether it is a free ocean or slush with pockets of liquid is the question that the 2025 analysis raised and that Dragonfly may help to settle.' }
  ],
  applications: ['A natural laboratory for liquid-surface processes in a different fluid: the wave and wind data tell how waves start on liquids with other densities and surface tensions.', 'Planning Dragonfly: a rotorcraft can fly only because Titan’s dense air and low gravity make flight easy.', 'Testing what “habitable” means: if life could use methane as a solvent, Titan’s lakes would be a place to look ([[could-life-use-another-liquid]]).', 'Antifreeze science on Earth: the same freezing-point arithmetic is used for road salt, de-icing fluids and the ammonia in refrigeration.'],
  history: 'Christiaan Huygens discovered Titan in 1655. Voyager 1 (1980) showed its orange haze; Cassini–Huygens arrived in 2004, and Huygens parachuted to the surface on 14 January 2005, the farthest landing from Earth. Cassini’s radar found the lakes in 2006 and its radio tracking the tide in 2012.',
  sources: ['Iess and colleagues, “The tides of Titan”, *Science* (2012) — the Love number about 0.6.', 'Mastrogiuseppe and colleagues, “The bathymetry of a Titan sea”, *Geophysical Research Letters* (2014); Hayes, “The lakes and seas of Titan”, *Annual Review of Earth and Planetary Sciences* (2016).', 'Petricca and colleagues, “Titan’s strong tidal dissipation precludes a subsurface ocean”, *Nature* (2025).', 'NASA, Dragonfly mission pages (launch 2028, arrival 2034).'],
  sim: 'ow-lake-compare'
},

/* ================================================================ Ganymede and Callisto */
{
  id: 'ganymede-and-callisto', parent: 'oceans-in-the-dark', title: 'Ganymede and Callisto', level: 2,
  short: 'The two outer big moons of Jupiter, near-twins in size, hold the most water of any moons — and two different kinds of ocean. Ganymede’s is sandwiched between layers of ice because the pressure at the base of its water is high enough to make denser ices; Callisto’s is quieter and thinner.',
  keywords: ['Ganymede', 'Callisto', 'largest moon', 'high-pressure ice', 'ice sandwich', 'club sandwich', 'magnetic field', 'aurora', 'Hubble', 'JUICE', 'ice VI', 'induced field', 'differentiation'],
  prereq: ['europa', 'high-pressure-ices', 'the-phase-diagram'],
  related: ['ice-beyond-earth', 'tidal-heating', 'titan', 'what-life-needs', 'the-search-follows-the-water', 'physics:planets', 'physics:pressure'],
  body: `
Ganymede is the largest moon in the Solar System. At 2,634 km in radius it is bigger than Mercury, though far less massive, because it is nearly half water. Callisto (2,410 km) is the third largest, much like it in size and composition. Together they hold more water than any other moons: by the best estimates Ganymede has about fifty Earth oceans' worth of water and ice, and Callisto about forty. They look alike on the outside and differ within, and the difference is a lesson in what controls an ocean.

### Ganymede: a field, an aurora and a sandwich
Ganymede is the only moon known to have a magnetic field of its own, made in a liquid iron core and found by Galileo in 1996. That field gives it its own aurorae. In 2015, Hubble measured how the glowing ovals near its poles rock as Jupiter's field sweeps by: they should rock by about 6° if Ganymede had no ocean, and they rock by only about 2°. A salty ocean at least 100 km thick, some 150 km down, damps the rocking by pushing back with its own induced field (Saur and colleagues, 2015).

The ocean has a strange floor. Ganymede's water layer is 800 km or more deep, and the pressure at its base is above a gigapascal: $\\rho g h \\approx 1150 \\times 1.43 \\times 800{,}000 \\approx 1.3$ GPa. But ice Ih, the floating ice, exists only below 209 MPa, at about 150 km depth here. Deeper, the ices that form — III, V and VI — are *denser* than the water, so they sink and pile up. The ocean therefore sits between a floating lid of Ih above and a floor of high-pressure ice below ([[high-pressure-ices]], [[ice-beyond-earth]]): an ice sandwich, in which some models stack several oceans, a "club sandwich". The seafloor is ice, not rock.

That matters for life. On Europa the ocean touches rock and can react with it ([[what-life-needs]]). On Ganymede the rock is behind an ice floor, and the supply of dissolved minerals depends on slow convection of warm ice, or salty water forced through. The question is open, not closed.

### Callisto: old, cold and quiet
Callisto has the most heavily cratered surface of any large body, about four billion years old. Its interior is only partly sorted into rock and ice, as the pull of its gravity on Galileo showed. The magnetometer found a changing, induced field like Europa's, most simply read as a salty layer some 100–200 km below the surface (Khurana and colleagues, 1998), though not everyone agrees. Callisto is outside the resonance that heats the inner moons ([[tidal-heating]]); only radioactive decay, and an antifreeze such as ammonia, would hold an ocean liquid, and it would be thin.

| | Distance from Jupiter | Main heat | Ocean? | Floor |
|---|---|---|---|---|
| Io | 422,000 km | tides, ~10¹⁴ W | no | — |
| Europa | 671,000 km | tides, ~1 TW | yes | rock |
| Ganymede | 1,070,000 km | weak tides, decay | yes, ≥ 100 km | high-pressure ice |
| Callisto | 1,883,000 km | decay | possible | ice and rock mixed |

### How we will know
ESA's **JUICE** launched on 14 April 2023 and reaches Jupiter in July 2031. It will fly past Europa and Callisto and, in December 2034, enter orbit around Ganymede, the first spacecraft to orbit a moon of another planet. A radar looks through the ice, a laser altimeter measures the tide, and a magnetometer separates Ganymede's own field from the induced one.

> [!key] Ganymede’s ocean is at least 100 km thick and lies between a floating ice lid and a floor of dense high-pressure ice (pressures above 1 GPa), so its seafloor is ice, not rock; Callisto’s, if it exists, is thin and quiet. JUICE orbits Ganymede from December 2034.`,
  ideas: ['Ganymede is the biggest moon and has its own magnetic field; Hubble’s auroral measurement shows a salty ocean ≥ 100 km thick.', 'The pressure at the base of its water layer is above 1 GPa, so ices III, V and VI form; they are denser than water and sink to form a floor.', 'Ganymede’s ocean is a sandwich: floating ice Ih, ocean, high-pressure ice — and the seafloor is ice, not rock.', 'Callisto is old, cratered and only partly sorted; its induced field suggests a thin ocean kept by decay heat and antifreeze.', 'JUICE (launched April 2023) reaches Jupiter in 2031 and orbits Ganymede from 2034.'],
  pitfalls: ['“Ganymede’s ocean would be crushed by pressure to ice” — The pressure does turn the deeper water into ice VI, and that is exactly the floor; the ocean above it, at 150–400 MPa, is liquid.', '“All ice floats” — Only ice Ih does; the ices that form above 209 MPa (III, V, VI) are denser than water and sink.', '“Callisto has no heat, so no ocean” — Radioactive decay heat plus a little ammonia could keep a thin ocean, as the induced field suggests; it is not proved.'],
  terms: [
    { term: 'High-pressure ice', also: ['ice III, V, VI', 'dense ices'], def: 'Crystalline forms of ice that exist above about 209 MPa (ice III, V, VI up to 2.2 GPa and beyond). They are denser than liquid water, so they sink in it, and form the floor of the oceans of large icy moons.' },
    { term: 'Differentiation', also: ['differentiated body'], def: 'The separation of a planet or moon into layers by density — metal core, rock, ice — once enough heat was available to melt it. Ganymede is fully differentiated, Callisto only partly.' },
    { term: 'Auroral oval', also: ['aurora', 'auroral ellipse'], def: 'A ring of glowing gas round a magnetic pole where charged particles strike the atmosphere. Ganymede’s ovals rock with Jupiter’s changing field; the small amount of rocking showed an ocean.' },
    { term: 'Ice sandwich', also: ['club sandwich ocean', 'ice–ocean–ice stack'], def: 'The layering of a large icy moon in which an ocean lies between a lid of low-pressure ice and a floor of high-pressure ice, so that it does not touch rock; some models stack several such layers.' },
    { term: 'JUICE', also: ['Jupiter Icy Moons Explorer'], def: 'ESA’s mission, launched 14 April 2023, reaching Jupiter in July 2031 and orbiting Ganymede from December 2034 after flybys of Europa and Callisto.' }
  ],
  formulas: [
    { name: 'Surface gravity of a moon', expr: 'g = G*M/Rm^2', tex: 'g = \\frac{GM}{R^2}',
      vars: { g: { name: 'surface gravity', q: 'accel', unit: 'm/s²' }, G: { const: 'G' }, M: { name: 'mass', q: 'mass', unit: 'kg', value: 1.4819e23, hint: '1.482 × 10²³ kg for Ganymede; 1.076 × 10²³ for Callisto.' }, Rm: { name: 'radius', q: 'length', unit: 'km', value: 2634.1, tex: 'R' } },
      solveFor: 'g', note: 'Ganymede: 1.43 m/s², a seventh of Earth’s.',
      stories: { g: 'A moon of mass {M} and radius {Rm}. What is the gravity at its surface?' } },
    { name: 'Pressure at the base of a water layer', expr: 'p = rho*g*h', tex: 'p = \\rho\\,g\\,h',
      vars: { p: { name: 'pressure', q: 'pressure', unit: 'GPa', hint: 'Compare ice Ih (below 0.209 GPa), ice VI (0.63–2.2 GPa).' }, rho: { name: 'mean density of the ice and water', q: 'density', unit: 'kg/m³', value: 1150, tex: '\\rho', hint: 'Between 931 for the shell and about 1,300 for ice VI.' },
        g: { name: 'gravity', q: 'accel', unit: 'm/s²', value: 1.428 }, h: { name: 'depth', q: 'length', unit: 'km', value: 800, hint: 'About 800 km is the thickness of Ganymede’s water layer.' } },
      solveFor: 'p', note: 'Uniform gravity and mean density: good to about 10 %. The point is the order of magnitude, a gigapascal.',
      stories: { p: 'A water layer {h} deep, with mean density {rho}, on a moon with gravity {g}. What is the pressure at its base?', h: 'At what depth does the pressure reach {p} on a moon with gravity {g} and mean density {rho}?' } },
    { name: 'Water fraction from the mean density', expr: 'x = (1/rho - 1/rhoR)/(1/rhoI - 1/rhoR)', tex: 'x = \\frac{1/\\rho - 1/\\rho_r}{1/\\rho_i - 1/\\rho_r}',
      vars: { x: { name: 'water (ice) mass fraction', q: 'ratio', unit: '%', hint: 'Mass share of water and ice in the moon.' }, rho: { name: 'mean density of the moon', q: 'density', unit: 'kg/m³', value: 1936, tex: '\\rho', hint: '1,936 for Ganymede, 1,834 for Callisto.' },
        rhoR: { name: 'density of rock and metal', q: 'density', unit: 'kg/m³', value: 3500, tex: '\\rho_r', hint: 'Compressed silicate and iron: 3,000–4,000.' }, rhoI: { name: 'density of the water and ice layer', q: 'density', unit: 'kg/m³', value: 1200, tex: '\\rho_i', hint: 'Ice at depth is denser than surface ice.' } },
      solveFor: 'x', note: 'Two components mixed by volume. A rough estimate: the true figure depends on the metal core and on the compressed densities.',
      stories: { x: 'A moon of mean density {rho} is made of rock and metal of density {rhoR} and ice of density {rhoI}. What fraction of its mass is water?' } }
  ],
  examples: [
    { title: 'The pressure under Ganymede’s sandwich', q: 'The water layer of Ganymede is 800 km deep. With a mean density of 1,150 kg/m³ and g = 1.43 m/s², find the pressure at its base, and say which ice that is.',
      steps: [{ text: 'Pressure:', tex: 'p = \\rho g h = 1150 \\times 1.43 \\times 8.0\\times10^{5} = 1.3\\times10^{9}\\ \\mathrm{Pa}' }, 'On the phase diagram of water, 1.3 GPa at a temperature of about 270 K is in the field of **ice VI** (0.63–2.2 GPa).', 'Ice VI has a density of about 1,310 kg/m³, 30 % more than the liquid.'],
      a: 'About 1.3 GPa, in the stability field of ice VI. The seafloor of Ganymede is plausibly a layer of ice VI.' },
    { title: 'How much of Ganymede is water?', q: 'Ganymede’s mean density is 1,936 kg/m³. Suppose it is a mixture of rock and metal (3,500 kg/m³) and water ice (1,200 kg/m³). Estimate the mass fraction of water.',
      steps: [{ text: 'Mix the two by volume:', tex: 'x = \\frac{1/1936 - 1/3500}{1/1200 - 1/3500} = \\frac{2.31\\times10^{-4}}{5.48\\times10^{-4}} = 0.42' }, 'So about 42 % by mass is water or ice; the more detailed models, with a metal core, give 40–50 %.'],
      a: 'About 40 %: close to half of Ganymede, by mass, is water in some form.' }
  ],
  quiz: [
    { q: 'Why can Ganymede’s ocean not rest directly on its rocky mantle?', choices: ['The rock is too hot', 'The pressure at the base of the water layer makes the ices (III, V, VI) denser than water, so a layer of them forms beneath the ocean', 'There is no rock', 'Ocean water cannot touch rock'], a: 1, why: 'At gigapascal pressures water freezes into ices denser than liquid water. They sink and form a floor between the ocean and the rock.' },
    { q: 'Hubble’s observation of the aurorae of Ganymede suggested an ocean because the oval rocks…', choices: ['more than expected, as the ocean amplifies Jupiter’s field', 'much less than a body without an ocean would, because induced currents in the salt water oppose Jupiter’s changing field', 'in step with the moon’s orbit', 'only at night'], a: 1, why: 'The rocking was about 2° against 6° for a plain conductor: a salty ocean at least 100 km thick makes a field that opposes Jupiter’s and damps the motion.' },
    { q: 'All forms of ice are less dense than liquid water.', a: false, why: 'Only ice Ih (the ordinary ice) is. Ices III, V and VI, which form at hundreds of megapascals, are 15 to 30 % denser and would sink in liquid water.' },
    { q: 'What pressure, in GPa, lies at the base of a layer of water of mean density 1,150 kg/m³ and depth 800 km on Ganymede (g = 1.428 m/s²)?', answer: 1.31, unit: 'GPa', why: '$p = 1150\\times1.428\\times8\\times10^5 = 1.31\\times10^9$ Pa.' },
    { q: 'Why is Callisto’s ocean, if it exists, expected to be thinner than Ganymede’s?', choices: ['Callisto is bigger', 'Callisto is outside the resonance that gives tidal heating and relies on radioactive decay and an antifreeze', 'Callisto has no water', 'Callisto is nearer to Jupiter'], a: 1, why: 'Io, Europa and Ganymede are tied in the Laplace resonance; Callisto is not, so it lacks that source of heat, and its interior is also less sorted.' }
  ],
  applications: ['JUICE’s instruments will test the sandwich: the radar searches for the shell’s base, the altimeter measures the tide, and the magnetometer measures the ocean’s depth and salinity.', 'Geophysics of exoplanets: the water-rich planets of other stars are expected to have high-pressure ice floors too; Ganymede is the nearby example.', 'High-pressure experiments on Earth, with diamond anvils, measure the ices III–VII for these models (and found ice VII inside diamonds).', 'The case for a magnetic-induction method: the same analysis is used for Europa, Callisto and (planned) Clipper.'],
  history: 'Galileo Galilei discovered the four large moons in January 1610; Ganymede and Callisto are named for a Trojan prince and a nymph in Greek myth. The Galileo spacecraft (1995–2003) found Ganymede’s magnetic field in 1996 and the induced fields of Callisto and Europa. Juno passed Ganymede within 1,046 km in June 2021, the closest since Galileo.',
  sources: ['Saur and colleagues, “The search for a subsurface ocean in Ganymede with Hubble Space Telescope observations of its auroral ellipses”, *Journal of Geophysical Research: Space Physics* (2015).', 'Vance and colleagues, “Ganymede’s internal structure including thermodynamics of magnesium sulfate oceans in contact with ice”, *Planetary and Space Science* (2014).', 'Khurana and colleagues, “Induced magnetic fields as evidence for subsurface oceans in Europa and Callisto”, *Nature* (1998).', 'ESA, JUICE mission pages (launched 14 April 2023).'],
  sim: { id: 'ow-ice-sandwich', params: { world: 'ganymede' } }
},
/* ================================================================ Ceres, Pluto and the dwarfs */
{
  id: 'ceres-pluto-and-the-dwarfs', parent: 'oceans-in-the-dark', title: 'Ceres, Pluto and the dwarf worlds', level: 2,
  short: 'Small, cold worlds should have frozen solid long ago — yet Ceres shows salt left by brines, Pluto’s ice-filled basin sits where only an ocean would let it, and Mimas, a 400-km moon of Saturn, seems to hide one. How a small world keeps an ocean is a question of heat, insulation and antifreeze.',
  keywords: ['Ceres', 'Pluto', 'Triton', 'Mimas', 'dwarf planet', 'Dawn', 'Occator', 'sodium carbonate', 'Ahuna Mons', 'cryovolcano', 'Sputnik Planitia', 'New Horizons', 'brine', 'gas hydrate', 'ocean inferred'],
  prereq: ['europa', 'the-snow-line', 'colligative-properties'],
  related: ['enceladus', 'titan', 'tidal-heating', 'ganymede-and-callisto', 'clathrate-hydrates', 'the-salt-of-the-sea', 'what-life-needs', 'chemistry:colligative-properties'],
  body: `
Beyond the big moons of Jupiter and Saturn the ocean worlds shrink. A body a thousand kilometres across has a lot of surface for its volume, so it loses heat fast, and a liquid ocean inside it ought to freeze in a geological instant. The surprise of the last decade is how many small worlds seem to have, or have had, liquid water anyway.

### How long can an ocean last?
Ice grows on the underside of a frozen lid as heat leaks upwards through it. The time to freeze a layer of thickness $h$ is $t = \\rho L h^2/(2k\\,\\Delta T)$, with $L$ the latent heat of fusion, $k$ the conductivity of ice and $\\Delta T$ the temperature drop across it. For $h = 100$ km that is about **100 million years** — against a Solar System that is 4,500 million years old. A small world keeps an ocean only if something replenishes the heat (radioactive decay in the rock; tidal heating), slows its loss (a layer of insulating gas hydrate, [[clathrate-hydrates]]), or lowers the freezing point (ammonia and salts, [[colligative-properties]]) — and probably a mixture.

### Ceres: the brine that reached the surface
Ceres, 940 km across, is the largest body in the asteroid belt, about a quarter water by mass. The Dawn spacecraft orbited it from 2015 to 2018. The bright patches in Occator crater turned out to be **sodium carbonate** and other salts (De Sanctis and colleagues, 2016), left when brine reached the surface and its water vapour escaped. Gravity and geology point to a reservoir of brine under the crater, hundreds of kilometres wide, a remnant of an ocean (Raymond and colleagues, 2020). Ahuna Mons, a 4-km mountain with steep sides, is a **cryovolcano** of ice, salt and mud (Ruesch and colleagues, 2016). Ceres may have had a global ocean once; a briny remnant may still be there.

### Pluto: an ocean from where a basin sits
New Horizons flew by Pluto in July 2015. Its most striking feature is **Sputnik Planitia**, a basin about 1,000 km wide, filled with nitrogen ice that convects like a slow lava lamp. The basin sits close to the line joining Pluto and Charon. A load on a spinning world drifts to such a place only if it is an *excess* of mass — but a basin is a hole, a shortage. For it to be an excess, the base of the ice under it must be pushed up, with dense water in place of light ice: **an ocean** (Nimmo and colleagues, 2016). What keeps it liquid? Radioactive decay in the rock, a cap of gas hydrate that insulates the ice (Kamata and colleagues, 2019), and ammonia.

### Triton and Mimas
**Triton**, the big moon of Neptune, was captured from the Kuiper belt; the heat of its capture may have left a liquid layer, and Voyager 2 saw geysers of nitrogen and dark dust in 1989. No data show an ocean. **Mimas**, the Saturn moon with the huge crater, was a surprise in 2024: the way its rotation and orbit wobble, measured over years of Cassini data, fits a young ocean about 20–30 km under a shell of ice of the same thickness (Lainey and colleagues). The surface shows no sign of it; if it is right, the ocean is only a few million to a few tens of millions of years old.

| World | Radius | Evidence | Status |
|---|---|---|---|
| Ceres | 470 km | salts from brine; cryovolcano | brine remnant; global ocean not shown |
| Pluto | 1,188 km | basin position (reorientation) | probable |
| Triton | 1,353 km | geysers; capture heat | possible |
| Mimas | 198 km | orbital libration and precession | probable, young |

> [!key] A small world’s ocean would freeze in about a hundred million years if left alone, so those of Ceres, Pluto, Triton and Mimas need decay heat, tidal heat, insulation or antifreeze. Dawn found salts left by Ceres’s brines; the position of Pluto’s Sputnik Planitia needs an ocean beneath; Mimas appears to hold a young one.`,
  ideas: ['A 100-km ocean would freeze in about 100 million years without heat: small worlds need decay or tidal heat, insulation or antifreeze.', 'Ceres: sodium carbonate in Occator crater and a cryovolcano show brines reaching the surface; a remnant reservoir may persist.', 'Pluto’s Sputnik Planitia sits near the Pluto–Charon axis, which for a hole in the surface needs an excess of mass beneath: an ocean raising the base of the ice.', 'Mimas’s libration and orbit fit a young ocean; Triton’s geysers and capture history make an ocean possible.'],
  pitfalls: ['“Dwarf planets are just dead ice balls” — Ceres shows fresh salts from brines, Pluto’s ice is geologically active, and several small worlds may hold oceans.', '“Pluto’s ocean is proved” — It is inferred from the position of one basin and from modelling; no instrument has measured it, and other explanations are discussed.', '“An ocean needs a warm world” — Salts and ammonia can keep water liquid at −50 °C or below, and a few mW/m² of decay heat, insulated by thick ice, is enough.'],
  terms: [
    { term: 'Cryovolcanism', also: ['ice volcano', 'cryovolcano'], def: 'Eruption of water, brine, ammonia or other volatiles instead of molten rock. Ahuna Mons on Ceres, and the geysers of Enceladus and Triton, are examples.' },
    { term: 'Dwarf planet', def: 'A body that orbits the Sun, is large enough to be round, but has not cleared its orbit. Ceres, Pluto and Eris are examples; some of them, like Pluto, may hold oceans.' },
    { term: 'Sputnik Planitia', also: ['Pluto’s heart', 'Tombaugh Regio (the west lobe)'], def: 'A basin about 1,000 km wide on Pluto, filled with nitrogen ice, which lies close to the line joining Pluto and Charon; its position is evidence of an ocean below.' },
    { term: 'Brine', also: ['salt solution'], def: 'Water with a lot of dissolved salt. Brines freeze at lower temperatures than pure water, so they can remain liquid in the cold interiors of small worlds.' },
    { term: 'Gas hydrate insulation', also: ['clathrate cap'], def: 'A layer of ice in which gas molecules (such as methane) fill cages; it conducts heat much worse than plain ice, so a layer a few kilometres thick could keep an ocean from freezing.' }
  ],
  formulas: [
    { name: 'Time for an ocean to freeze under a conducting lid', expr: 't = rho*Lf*h^2/(2*k*dT)', tex: 't = \\frac{\\rho\\,L_f\\,h^2}{2\\,k\\,\\Delta T}',
      vars: { t: { name: 'freezing time', q: 'time', unit: 'Myr' }, rho: { name: 'density of the ice', q: 'density', unit: 'kg/m³', value: 920, tex: '\\rho' },
        Lf: { name: 'latent heat of fusion of water', q: 'latent', unit: 'kJ/kg', value: 333.55, fixed: true, tex: 'L_f' },
        h: { name: 'thickness of ice to grow', q: 'length', unit: 'km', value: 100, hint: 'The time grows as the square of the thickness.' },
        k: { name: 'thermal conductivity of the ice', q: 'thermcond', unit: 'W/(m·K)', value: 3, hint: 'About 567/T W/(m·K); 3 near 190 K.' },
        dT: { name: 'temperature difference across the ice', q: 'dtemp', unit: 'K', value: 170, tex: '\\Delta T', hint: 'From the freezing ocean at about 270 K to a surface near 100 K.' } },
      solveFor: 't', note: 'A steady-conduction estimate with no heat from the rock: an upper limit on how fast the ocean freezes. Heat from below only lengthens the time.',
      stories: { t: 'The ocean of a small world is capped by ice and loses heat across {dT}. How long to freeze {h} of ice, if conductivity is {k}?', h: 'How much ice can grow in {t} across {dT}, with conductivity {k}?' } },
    { name: 'Heat flow from radioactive decay in a rocky core', expr: 'qf = Hm*rho*r/3', tex: 'q = \\frac{H_m\\,\\rho\\,r}{3}',
      vars: { qf: { name: 'heat flux at the top of the core', q: 'intensity', unit: 'mW/m²', tex: 'q', hint: 'Compare with 87 mW/m² for Earth’s average.' }, Hm: { name: 'radioactive heating per kilogram of rock', unit: 'W/kg', value: 4e-12, tex: 'H_m', hint: 'About 4 × 10⁻¹² W/kg for a chondritic rock today, from uranium, thorium and potassium.' },
        rho: { name: 'density of the rock', q: 'density', unit: 'kg/m³', value: 3000, tex: '\\rho' }, r: { name: 'radius of the rocky core', q: 'length', unit: 'km', value: 850, hint: 'About 850 km for Pluto.' } },
      solveFor: 'qf', note: 'A uniformly heated sphere loses all its heat through its surface: flux equals power per unit volume times r over 3. The flux at Pluto’s surface is smaller, spread over a larger sphere.',
      stories: { qf: 'A rocky core of radius {r} and density {rho} produces {Hm} of radioactive heat per kilogram. What is the heat flux leaving the core?' } }
  ],
  examples: [
    { title: 'How long would a 100-km ocean last without help?', q: 'A world’s ocean freezes from a lid of ice whose top is at 100 K and base at 270 K. Take ice of conductivity 3 W/(m·K), density 920 kg/m³, latent heat 333.55 kJ/kg. How long to grow 100 km of ice?',
      steps: [{ text: 'Use the formula:', tex: 't = \\frac{920 \\times 3.3355\\times10^{5} \\times (10^{5})^2}{2 \\times 3 \\times 170} = 3.0\\times10^{15}\\ \\mathrm{s}' }, 'Divide by the seconds in a year, $3.156\\times10^{7}$: about $9.5\\times10^{7}$ years.'],
      a: 'About 95 million years — a fiftieth of the age of the Solar System. A small ocean that has lasted billions of years has been fed.' },
    { title: 'Can radioactive decay hold up Pluto’s ocean?', q: 'Pluto’s rocky core, radius 850 km and density 3,000 kg/m³, makes 4 × 10⁻¹² W per kilogram. How thick an ice shell (conductivity 3 W/(m·K), temperature drop 170 K) would carry exactly that heat?',
      steps: [{ text: 'Heat flux from the core:', tex: 'q = \\frac{4\\times10^{-12}\\times3000\\times8.5\\times10^{5}}{3} = 3.4\\times10^{-3}\\ \\mathrm{W/m^2}' }, { text: 'Shell that conducts this much:', tex: 'h = \\frac{k\\,\\Delta T}{q} = \\frac{3 \\times 170}{3.4\\times10^{-3}} \\approx 150\\ \\mathrm{km}' }],
      a: 'About 150 km. A shell thicker than that insulates the core enough for an ocean to survive on decay heat alone — one reason a thick, insulating ice shell (or gas hydrate) matters. The spread over a larger surface and the geometry change the number, not the idea.' }
  ],
  quiz: [
    { q: 'What are the bright spots in Occator crater on Ceres mostly made of?', choices: ['Water ice', 'Sodium carbonate and other salts left by brine', 'Sulfur', 'Frozen methane'], a: 1, why: 'Dawn’s spectrometer identified sodium carbonate: brine reached the surface and its water left, depositing the salt.' },
    { q: 'Why does the position of Sputnik Planitia suggest a subsurface ocean on Pluto?', choices: ['It is the coldest place on Pluto', 'A basin is a hole, yet it sits where only a positive mass anomaly would drift; that implies the base of the ice under it is raised, with dense water in place of light ice', 'It is made of water', 'It is near the north pole'], a: 1, why: 'A load reorients a spinning world toward the tidal axis only if it is an excess of mass. The basin is a topographic low, so something beneath must compensate with extra mass: dense liquid water raised under thin ice.' },
    { q: 'Ceres has been proved to have a global ocean today.', a: false, why: 'Dawn showed that brines once reached the surface and a brine reservoir probably remains under Occator, but a global ocean today is not demonstrated.' },
    { q: 'A 100-km layer of ice would take about 95 million years to grow across the same temperature drop. How many million years for 50 km?', answer: 23.8, unit: 'Myr', why: 'The time goes as the square of the thickness: half the thickness is a quarter of the time, $95/4 = 23.8$.' },
    { q: 'What is unusual about the ocean proposed for Mimas?', choices: ['It is the biggest', 'It is thought to be young, only millions of years old, and shows no sign on the surface', 'It is made of methane', 'It has been sampled by a plume'], a: 1, why: 'The wobble of Mimas’s rotation and orbit fits an ocean, but the heavily cratered surface looks ancient, so the ocean would be a recent arrival hidden under an old shell.' }
  ],
  applications: ['Choosing targets: the dwarf worlds are visited by flyby only, so each one’s evidence for water guides which would be worth an orbiter.', 'Cryovolcanic salts on Ceres are used as a model for how brines move through ice and rock on other worlds.', 'Geophysics from orbit: Pluto’s ocean was found by combining mapping with a model of how a world spins and reorients — the same method works wherever a basin and a gravity field are known.', 'Thermal modelling: the freezing-time formula is also used for lake ice and sea ice on Earth (Stefan’s law).'],
  history: 'Giuseppe Piazzi found Ceres on 1 January 1801. New Horizons reached Pluto on 14 July 2015 after nine and a half years, Dawn orbited Ceres from March 2015 until its fuel ran out in 2018. Voyager 2 flew past Triton in 1989; it is the only spacecraft to have visited.',
  sources: ['De Sanctis and colleagues, “Bright carbonate deposits as evidence of aqueous alteration on (1) Ceres”, *Nature* (2016); Ruesch and colleagues, “Cryovolcanism on Ceres”, *Science* (2016); Raymond and colleagues, *Nature Astronomy* (2020).', 'Nimmo and colleagues, “Reorientation of Sputnik Planitia implies a subsurface ocean on Pluto”, *Nature* (2016); Kamata and colleagues, “Pluto’s ocean is capped and insulated by gas hydrates”, *Nature Geoscience* (2019).', 'Lainey and colleagues, “A recently formed ocean inside Saturn’s moon Mimas”, *Nature* (2024).'],
  sim: { id: 'ow-ocean-map', params: { sel: 'ceres' } }
},

/* ================================================================ Tidal heating */
{
  id: 'tidal-heating', parent: 'oceans-in-the-dark', title: 'Tidal heating', level: 3,
  short: 'A moon on a slightly eccentric orbit is squeezed and relaxed by its planet once every orbit, and the friction in the kneading is heat: about 10¹⁴ watts in Io, enough for hundreds of volcanoes. The power grows as the square of the eccentricity and the fifth power of the radius, and falls steeply with distance. It keeps oceans liquid far from the Sun.',
  keywords: ['tidal heating', 'Io', 'Laplace resonance', 'eccentricity', 'Love number', 'Q', 'k2/Q', 'Enceladus heat puzzle', 'tidal dissipation', 'mean motion', 'orbital resonance', 'tidal flexing'],
  prereq: ['europa', 'enceladus', 'physics:tides'],
  related: ['ganymede-and-callisto', 'titan', 'ceres-pluto-and-the-dwarfs', 'the-tides', 'what-life-needs', 'physics:planets'],
  body: `
A moon that always shows one face to its planet has a tidal bulge fixed in place, pointing at the planet. A fixed bulge does no work and makes no heat. Now make the orbit slightly eccentric, not quite circular. The moon is closer to the planet at one end of its orbit and farther at the other, so the tide rises and falls; the moon also rocks a little from side to side. Rock and ice flexed back and forth warm up, as a paper clip does when it is bent. The heat comes out of the energy of the orbit and of the planet's spin.

### Io
Io, the innermost big moon of Jupiter, is the extreme. Jupiter's tide raises and lowers its surface by about 100 m every 1.77 days, and the kneading yields about **10¹⁴ W**, roughly 2 W per square metre of surface — twenty-five times the average heat flow of the Earth. The result is hundreds of active volcanoes. Peale, Cassen and Reynolds predicted that Io must be melting from tides in a paper published days before Voyager 1 saw its first eruptions in March 1979.

### Why the orbit stays eccentric
Tidal dissipation also circularises the orbit, in millions of years. Io stays eccentric because of the **Laplace resonance**: Io, Europa and Ganymede orbit Jupiter in periods very close to 1 : 2 : 4 (1.77, 3.55, 7.15 days). Every second orbit of Io, Europa lines up at the same point and tugs it the same way; the repeated nudges keep the eccentricity of Io (0.0041), Europa (0.0094) and Ganymede (0.0013) from dying away. The energy in the end comes from Jupiter's spin, which slows by a tiny amount. Enceladus and Dione do the same in a 2 : 1 resonance.

### The formula
For a moon in synchronous rotation, the standard result (Peale and colleagues, 1979) is

$$\\dot E = \\frac{21}{2}\\,\\frac{k_2}{Q}\\,\\frac{G M_p^2 R^5 n\\,e^2}{a^6}$$

with $M_p$ the planet's mass, $R$ the moon's radius, $a$ its orbit, $n$ its orbital angular speed and $e$ its eccentricity. The two numbers $k_2$ (Love number: how far the moon yields) and $Q$ (the quality factor: the fraction of the energy of each flex that is lost) are properties of its interior. The consequences: **double the eccentricity, four times the heat; double the radius, 32 times**; and since $n \\propto a^{-3/2}$, the power falls as the **−7.5 power** of the distance, so moving 10 % farther out halves it.

| Moon | a (thousand km) | e | Period (days) | Heat |
|---|---|---|---|---|
| Io | 422 | 0.0041 | 1.77 | about 10¹⁴ W, measured |
| Europa | 671 | 0.0094 | 3.55 | about 10¹² W, models |
| Enceladus | 238 | 0.0047 | 1.37 | 5–16 GW observed, about 1 GW predicted |

### The Enceladus puzzle
Enceladus emits between about 5 and 16 GW from its south pole, depending on what is counted — far more than the roughly 1 GW the equilibrium models give for its eccentricity (Meyer and Wisdom, 2007). The suggestions: the heating rises and falls over hundreds of millions of years and we see a peak; much of it is generated in a porous, water-filled rocky core rather than the ice (Choblet and colleagues, 2017); the thin south polar shell concentrates it. The puzzle is open.

> [!key] Tidal heating is the friction of a moon being squeezed and relaxed on an eccentric orbit: power ∝ e² R⁵ n / a⁶. It gives Io 10¹⁴ W, keeps Europa’s ocean liquid, and for Enceladus the observed heat exceeds the standard prediction by several times — the puzzle is unsolved.`,
  ideas: ['A fixed tide makes no heat; an eccentric orbit makes the tide rise and fall, and friction turns the flexing into heat.', 'The power goes as e² R⁵ n / a⁶: double e for four times, double the radius for 32 times, move out 10 % for about half.', 'Resonances (the Laplace 1 : 2 : 4 of Io, Europa and Ganymede) keep the eccentricity from dying away.', 'Io: 10¹⁴ W and hundreds of volcanoes; Europa: about 1 TW in models; Enceladus: observed heat is several times what the simple formula gives.'],
  pitfalls: ['“Tidal heating is friction between the moon and the planet” — The heat is made inside the moon, by the flexing of its own rock and ice; the energy is taken from the orbit and the planet’s spin.', '“The closer a moon, the hotter it is” — Distance matters, but so do the eccentricity (squared) and the size (to the fifth power): small Mimas, near Saturn, is far cooler than Io.', '“Enceladus’s heat is explained by tides” — The simplest tidal estimates give about a fifth to a tenth of what Cassini saw; the puzzle is unresolved.'],
  terms: [
    { term: 'Tidal heating', also: ['tidal dissipation', 'tidal flexing'], def: 'Heat made inside a moon or planet by the repeated deformation of its body by a changing tide; the energy comes from the orbit and the spin of the bodies.' },
    { term: 'Laplace resonance', also: ['1:2:4 resonance', 'orbital resonance of Io, Europa and Ganymede'], def: 'The locking of the orbital periods of Io, Europa and Ganymede at almost exactly 1 : 2 : 4, so that their mutual tugs repeat at the same points of each orbit and keep their orbits eccentric.' },
    { term: 'Orbital eccentricity', also: ['eccentricity', 'e'], def: 'How far an orbit departs from a circle: 0 for a circle, close to 1 for a long ellipse. Tidal heating goes as its square.' },
    { term: 'Quality factor (Q)', also: ['tidal quality factor', 'tidal dissipation function'], def: 'The inverse of the fraction of the energy of a flex that is lost as heat in each cycle: a high Q means little loss. Io’s interior is thought to have Q of about 100.' },
    { term: 'Mean motion', also: ['n', 'orbital angular speed'], def: 'The angle an orbiting body sweeps per unit time on average, n = 2π/P; for a small moon n = √(GM/a³).' }
  ],
  formulas: [
    { name: 'Tidal heating power of a synchronously rotating moon', expr: 'P = 10.5*kq*G*Mp^2*Rm^5*n*ecc^2/a^6', tex: 'P = \\frac{21}{2}\\,\\kappa\\,\\frac{G\\,M_p^2\\,R^5\\,n\\,e^2}{a^6}',
      vars: { P: { name: 'tidal heating power', q: 'power', unit: 'W' }, kq: { name: 'k₂/Q', value: 0.015, tex: '\\kappa', hint: 'The Love number over the quality factor: how far the moon yields times how much it loses. About 0.015 for Io in the classic estimate; much smaller for a stiff icy moon.' }, G: { const: 'G' },
        Mp: { name: 'mass of the planet', q: 'mass', unit: 'kg', value: 1.898e27, tex: 'M_p', hint: '1.898 × 10²⁷ kg for Jupiter, 5.683 × 10²⁶ for Saturn.' },
        Rm: { name: 'radius of the moon', q: 'length', unit: 'km', value: 1821.6, tex: 'R' },
        n: { name: 'mean motion (orbital angular speed)', q: 'angvel', unit: 'rad/s', value: 4.11e-5, hint: '2π over the orbital period: 4.11 × 10⁻⁵ rad/s for Io (1.77 days).' },
        ecc: { name: 'orbital eccentricity', value: 0.0041, tex: 'e', min: 0, max: 0.9, hint: '0.0041 for Io, 0.0094 for Europa, 0.0047 for Enceladus.' },
        a: { name: 'orbit radius', q: 'length', unit: 'km', value: 421800, hint: '421,800 km for Io.' } },
      solveFor: 'P', note: 'Peale, Cassen and Reynolds’ (1979) formula for a moon in synchronous rotation on a slightly eccentric orbit. Its k₂/Q is the weak link: it depends on the interior, and for icy moons is very uncertain.',
      stories: { P: 'A moon of radius {Rm} orbits at {a} round a planet of mass {Mp} with eccentricity {ecc}, mean motion {n} and k₂/Q of {kq}. How much heat is made in it?' } },
    { name: 'Mean motion of an orbit', expr: 'n = sqrt(G*Mp/a^3)', tex: 'n = \\sqrt{\\frac{G\\,M_p}{a^3}}',
      vars: { n: { name: 'mean motion', q: 'angvel', unit: 'rad/s' }, G: { const: 'G' }, Mp: { name: 'mass of the planet', q: 'mass', unit: 'kg', value: 1.898e27, tex: 'M_p' }, a: { name: 'orbit radius', q: 'length', unit: 'km', value: 421800 } },
      solveFor: 'n', note: 'Kepler’s third law with the moon’s mass neglected. The period is 2π/n.',
      stories: { n: 'A moon orbits at {a} a planet of mass {Mp}. What is its mean motion?' } },
    { name: 'Scaling the heat from one moon to another', expr: 'ratio = (ecc2/ecc1)^2*(R2/R1)^5*(a1/a2)^7.5', tex: 'r_P = \\left(\\frac{e_2}{e_1}\\right)^2\\left(\\frac{R_2}{R_1}\\right)^5\\left(\\frac{a_1}{a_2}\\right)^{7.5}',
      vars: { ratio: { name: 'heat of moon 2 over heat of moon 1', tex: 'r_P' }, ecc1: { name: 'eccentricity of moon 1', value: 0.0041, tex: 'e_1', min: 0 }, ecc2: { name: 'eccentricity of moon 2', value: 0.0094, tex: 'e_2', min: 0 },
        R1: { name: 'radius of moon 1', value: 1821.6, tex: 'R_1', hint: 'Any unit, the same for both.' }, R2: { name: 'radius of moon 2', value: 1560.8, tex: 'R_2' },
        a1: { name: 'orbit of moon 1', value: 421.8, tex: 'a_1', hint: 'Any unit, the same for both.' }, a2: { name: 'orbit of moon 2', value: 671.1, tex: 'a_2' } },
      solveFor: 'ratio', note: 'Same planet and same k₂/Q for both. The exponent 7.5 is 6 from the formula plus 1.5 from n ∝ a^(−3/2). Real moons differ in k₂/Q, so this is the geometric part only.',
      stories: { ratio: 'Two moons orbit the same planet with the same k₂/Q. The second has eccentricity {ecc2}, radius {R2} and orbit {a2}; the first {ecc1}, {R1} and {a1}. How does its heating compare?' } }
  ],
  examples: [
    { title: 'How hot is Io?', q: 'Io (R = 1,821.6 km) orbits Jupiter (1.898 × 10²⁷ kg) at a = 421,800 km with e = 0.0041 and n = 4.11 × 10⁻⁵ rad/s. Take k₂/Q = 0.015. Find the tidal heating power and the heat flux over its surface.',
      steps: [{ text: 'Put the numbers in:', tex: 'P = 10.5\\times0.015\\times\\frac{6.674\\times10^{-11}(1.898\\times10^{27})^2(1.8216\\times10^{6})^5(4.11\\times10^{-5})(0.0041)^2}{(4.218\\times10^{8})^6}' },
        'The numerator is $6.674\\times10^{-11}\\times3.60\\times10^{54}\\times2.01\\times10^{31}\\times4.11\\times10^{-5}\\times1.68\\times10^{-5} = 3.3\\times10^{66}$ and the denominator $5.63\\times10^{51}$. Then $P = 0.1575\\times5.9\\times10^{14} \\approx 9.3\\times10^{13}$ W.',
        'Io’s surface area is $4\\pi R^2 = 4.17\\times10^{13}$ m², so the flux is $9.3\\times10^{13}/4.17\\times10^{13} = 2.2$ W/m².'],
      a: 'About 9 × 10¹³ W, or 2.2 W/m² — matching the measured 10¹⁴ W. For comparison Earth’s mean heat flow is 0.087 W/m².' },
    { title: 'What if Europa were Io’s size and eccentricity?', q: 'Keeping k₂/Q the same, by what factor would Europa’s heating rise if its eccentricity were doubled, and by what factor if its orbit were moved 10 % farther out?',
      steps: ['Doubling $e$: the factor is $2^2 = 4$.', 'Moving out by 10 %: the factor is $1.1^{-7.5} = 0.49$.', 'Both together: $4\\times0.49 = 2.0$.'],
      a: 'Four times the heat for twice the eccentricity; half for a 10 % wider orbit. This steepness is why a small change in an orbit can switch an ocean on or off.' }
  ],
  quiz: [
    { q: 'Why does a moon in a perfectly circular, synchronous orbit make no tidal heat?', choices: ['Tides need a rotating moon', 'Its tidal bulge is fixed, so nothing flexes', 'Circular orbits have no gravity', 'The planet’s tide cancels'], a: 1, why: 'The bulge is stationary and the body is not deformed repeatedly; friction needs a changing deformation, which comes from the moon’s varying distance (eccentricity) or its libration.' },
    { q: 'Tidal heating is greatest in a moon with a perfectly circular orbit.', a: false, why: 'The power goes as the square of the eccentricity: a circular orbit gives none. Resonances matter because they keep the orbits eccentric.' },
    { q: 'How many times more tidal heat does a moon make if its radius doubles, with everything else the same?', answer: 32, why: 'The power goes as $R^5$, and $2^5 = 32$.' },
    { q: 'A moon is moved 10 % farther from its planet (keeping e, R, k₂/Q). The tidal heat becomes about', choices: ['91 % of the original', '57 % of it', '49 % of it', '25 % of it'], a: 2, why: 'The heat goes as $n/a^6$ and $n \\propto a^{-3/2}$, so as $a^{-7.5}$: $1.1^{-7.5} = 0.49$. Using only $a^{-6}$ would give 0.57.' },
    { q: 'What is the Enceladus puzzle?', choices: ['It has no heat', 'More heat leaves its south pole than the usual tidal-heating calculation allows', 'It is not in a resonance', 'Its orbit is circular'], a: 1, why: 'Observed emission of 5–16 GW is several to ten times the roughly 1 GW the equilibrium models give; explanations include episodic heating, heating in a porous core and a thin polar shell.' }
  ],
  applications: ['Understanding why Io has hundreds of volcanoes and Europa, perhaps, a liquid ocean: the same arithmetic, with different e, R and a.', 'Predicting heat in exoplanets near low-mass stars: the TRAPPIST-1 planets are in a resonant chain and may be tidally heated.', 'Measuring the interior: a flux that is measured, such as Io’s, gives the product k₂/Q, and so tells how soft or molten the interior is.', 'Earth’s own ocean tides dissipate about 3.7 TW, slowing the planet’s spin and lengthening the day by about two milliseconds per century.'],
  history: 'Laplace analysed the 1 : 2 : 4 relation of Io, Europa and Ganymede in the late eighteenth century. Peale, Cassen and Reynolds’ paper “Melting of Io by tidal dissipation” appeared in Science on 2 March 1979, days before Voyager 1 found the first active volcano on another world; Linda Morabito had spotted a plume on Io in a navigation image on 9 March.',
  sources: ['Peale, Cassen and Reynolds, “Melting of Io by tidal dissipation”, *Science* 203, 892 (1979).', 'Meyer and Wisdom, “Tidal heating in Enceladus”, *Icarus* (2007).', 'Howett, Spencer, Pearl and Segura, “High heat flow from Enceladus’ south polar region measured using 10–600 cm⁻¹ Cassini/CIRS data”, *Journal of Geophysical Research* (2011).', 'Choblet and colleagues, “Powering prolonged hydrothermal activity inside Enceladus”, *Nature Astronomy* (2017).'],
  sim: 'ow-tidal-flex'
},
/* ================================================================ What life needs */
{
  id: 'what-life-needs', parent: 'oceans-in-the-dark', title: 'What life needs', level: 2,
  short: 'Liquid water, an energy source, the six elements C, H, N, O, P and S, and time. Under kilometres of ice there is no sunlight, so the energy has to be chemical; at Earth’s vents and perhaps on Enceladus it is hydrogen, and a hydrogen concentration of a few millionths of a bar is enough to pay for a cell.',
  keywords: ['habitability', 'CHNOPS', 'redox', 'chemosynthesis', 'hydrothermal vents', 'methanogens', 'extremophiles', 'water activity', 'Gibbs free energy', 'energy source', 'time', 'ladder', 'Lost City', 'serpentinization', 'serpentinisation'],
  prereq: ['enceladus', 'europa', 'lifes-start-in-water'],
  related: ['the-matrix-of-life', 'could-life-use-another-liquid', 'the-search-follows-the-water', 'titan', 'ganymede-and-callisto', 'tidal-heating', 'chemistry:equilibrium', 'biology:water-in-life'],
  body: `
Nobody knows what alien life would need, so the search uses the one example we have — life on Earth — and asks which other worlds supply what it needs. NASA's short list, set out in its April 2017 announcement of Cassini's hydrogen and Hubble's probable Europa plume, has four items: **liquid water, an energy source, the chemical elements C, H, N, O, P and S, and time.** This page follows each one into the ocean worlds. The simulation scores each world on a ladder of five rungs — those four, and a fifth that is easy to forget: whether anything from the ocean can ever reach us.

### Liquid water
Water is the solvent, the reagent and the scaffold of living cells ([[the-matrix-of-life]]); a liquid with its range, its solvent power and its network of hydrogen bonds is hard to replace ([[could-life-use-another-liquid]]). The ocean worlds provide it, in the largest volumes in the Solar System outside the giant planets.

### Energy, when there is no sunlight
Photosynthesis needs light, and under kilometres of ice there is none. The alternative is **chemistry**: any reaction that moves electrons from a donor to an acceptor which are out of equilibrium with each other gives energy a cell can use. At Earth's vents hot water reacting with rock (serpentinisation) makes hydrogen, and organisms live on it:

| Reaction | Energy per mole of H₂ (standard conditions) |
|---|---|
| methanogenesis: 4 H₂ + CO₂ → CH₄ + 2 H₂O | about 33 kJ (−131 kJ per CH₄) |
| sulfate reduction: 4 H₂ + SO₄²⁻ + H⁺ → HS⁻ + 4 H₂O | about 38 kJ |
| oxidation by oxygen: 2 H₂ + O₂ → 2 H₂O | about 237 kJ |

These are standard values. What a cell really gets depends on the concentrations, through $\\Delta G = \\Delta G^\\circ + RT\\ln Q$, and in a cold, dilute ocean it is much smaller — but it is positive as long as the hydrogen is not too scarce (see the example). Europa's surface offers the oxidants (made by radiation from ice); Enceladus's plume has measured the hydrogen and the carbon dioxide ([[enceladus]]).

### The six elements and time
Carbon, hydrogen, nitrogen, oxygen, phosphorus and sulfur make up about 97 % of the mass of a human body. Water supplies H and O; carbon dioxide, methane and organic molecules supply C; ammonia supplies N (about 1 % of Enceladus's plume); phosphates were found in the grains of Enceladus in 2023, the first time phosphorus was detected in an ocean beyond Earth. Sulfur compounds are suggested for Europa's surface but are not yet confirmed in the plume of Enceladus. Time is the last: on Earth, oceans existed by about 4.4 billion years ago and life appeared within a few hundred million years; an ocean only a few million years old, like the one suggested for Mimas, is probably too young.

### The limits of known life
- **Heat:** growth at 122 °C in a methanogen from a black smoker (high pressure keeps the water liquid); 113 °C in *Pyrolobus*.
- **Cold:** cells reproducing at −15 °C in salt brine; metabolism measured lower still.
- **Pressure:** microbes thrive 11 km down in the Challenger Deep, at 110 MPa.
- **Dryness:** life requires a **water activity** above about 0.6 — saturated salt is 0.75; some magnesium brines kill by their chemistry even when they are wetter.
- **Alkalinity:** soda lakes of pH 10 or more.
Every one of the ocean worlds' conditions — cold, salty, alkaline, 100–150 MPa — lies inside these limits. That makes them **habitable** in the sense of being possible, not **inhabited**. Hydrogen and methane can both be made without life; telling the difference is the hard problem.

> [!key] Life as we know it needs liquid water, an energy source, C, H, N, O, P and S, and time. Under ice the energy is chemical — hydrogen plus carbon dioxide in Enceladus’s plume, worth 33 kJ per mole of hydrogen — and every ingredient has been seen on at least one ocean world, but a habitat is not life.`,
  ideas: ['The four needs: liquid water, an energy source, the six elements C, H, N, O, P, S, and time.', 'Without sunlight the energy must be chemical: an electron donor (H₂) and an acceptor (CO₂, sulfate, oxidants) out of equilibrium.', 'The actual energy depends on concentrations: ΔG = ΔG° + RT ln Q, and a hydrogen pressure of a few millionths of a bar is enough for methanogens.', 'Known life reaches 122 °C, −15 °C, 110 MPa, water activity 0.6 and pH 12; ocean worlds lie inside these limits.', 'A habitat is not an inhabited world, and hydrogen or methane do not by themselves signal life.'],
  pitfalls: ['“If an ocean has water and is warm enough, it has life” — Water is one of four needs; energy, the elements and time must all be there, and even then life must have started.', '“Methane in a plume proves life” — Methane (and hydrogen) can be made by water–rock reactions with no life; the distinction needs more than one gas, or isotopes, or a pattern.', '“Life needs a warm planet” — Known microbes grow below −15 °C and above 120 °C; energy and liquid water matter more than the temperature.'],
  terms: [
    { term: 'CHNOPS', also: ['the six elements of life', 'biogenic elements'], def: 'Carbon, hydrogen, nitrogen, oxygen, phosphorus and sulfur: together about 97 % of the mass of a living cell, and the list of elements searched for in ocean-world plumes.' },
    { term: 'Chemosynthesis', also: ['chemolithoautotrophy'], def: 'Making the molecules of life using the energy of chemical reactions rather than light. Hydrothermal-vent communities and, possibly, any life under the ice of an ocean world live this way.' },
    { term: 'Extremophile', also: ['extreme microbe'], def: 'An organism that grows in conditions that would kill most life: very hot, cold, salty, acidic, alkaline, dry or under great pressure. They define the limits used to judge ocean worlds.' },
    { term: 'Water activity', also: ['a_w', 'aw'], def: 'The ratio of the vapour pressure of water over a solution to that over pure water at the same temperature, equal to the relative humidity in equilibrium with it. Known life needs a value above about 0.6.' },
    { term: 'Gibbs free energy of reaction', also: ['ΔG', 'free energy'], def: 'The maximum useful energy per mole that a reaction can supply at constant temperature and pressure; it is negative for a reaction that can be used, and depends on the concentrations of the reactants and products.' }
  ],
  formulas: [
    { name: 'Free energy of methanogenesis at the conditions of the ocean', expr: 'dG = dG0 + R*T*ln(pCH4*p0^4/(pH2^4*pCO2))', tex: '\\Delta G = \\Delta G^\\circ + RT\\ln\\frac{p_{\\mathrm{CH4}}\\,p_0^4}{p_{\\mathrm{H2}}^4\\,p_{\\mathrm{CO2}}}',
      vars: { dG: { name: 'free energy of the reaction', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta G', hint: 'Per mole of methane made. Negative means the reaction releases energy a cell can use; below about −20 kJ/mol there is little left for a cell.' },
        dG0: { name: 'standard free energy', q: 'molarenergy', unit: 'kJ/mol', signed: true, value: -130.7, tex: '\\Delta G^\\circ', hint: '−130.7 kJ/mol for gases at 1 bar and liquid water at 25 °C.' }, R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 0, min: -50, max: 150 },
        pCH4: { name: 'methane pressure', q: 'pressure', unit: 'bar', value: 0.001, tex: 'p_{\\mathrm{CH4}}', hint: 'The partial pressure in equilibrium with the water; the dissolved amount follows from Henry’s law.' },
        pH2: { name: 'hydrogen pressure', q: 'pressure', unit: 'bar', value: 0.0001, tex: 'p_{\\mathrm{H2}}' },
        pCO2: { name: 'carbon dioxide pressure', q: 'pressure', unit: 'bar', value: 0.01, tex: 'p_{\\mathrm{CO2}}' },
        p0: { name: 'standard pressure', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_0' } },
      solveFor: 'dG', note: 'Ideal gases in equilibrium with the water. The hydrogen pressure enters to the fourth power, so a tenfold drop in H₂ costs 4RT ln 10 ≈ 21 kJ/mol at 0 °C.',
      stories: { dG: 'An ocean at {T} has methane at {pCH4}, hydrogen at {pH2} and carbon dioxide at {pCO2}. What is the free energy of methanogenesis?', pH2: 'At {T}, with methane at {pCH4} and carbon dioxide at {pCO2}, methanogenesis yields {dG}. What hydrogen pressure is that?' } },
    { name: 'How many cells a hydrogen supply can sustain', expr: 'N = F*Eq/(4*Pc)', tex: 'N = \\frac{F\\,E}{4\\,P_c}',
      vars: { N: { name: 'cells sustained', hint: 'An upper bound: every joule is assumed to go to maintenance.' }, F: { name: 'hydrogen consumed', unit: 'mol/s', value: 10, tex: 'F', hint: 'Moles of H₂ reacted per second. Hypothetical here: the real supply to any ocean is not known.' },
        Eq: { name: 'energy released per mole of CH₄', q: 'molarenergy', unit: 'kJ/mol', value: 50, tex: 'E', hint: 'The free energy actually available, less than the 131 kJ/mol of standard conditions.' },
        Pc: { name: 'maintenance power of one cell', q: 'power', unit: 'W', value: 1e-18, tex: 'P_c', hint: 'The smallest power a cell needs just to stay alive. Estimates in the literature range from about 10⁻²¹ to 10⁻¹⁵ W depending on the setting.' } },
      solveFor: 'N', note: 'Four moles of hydrogen make one mole of methane, hence the 4. A teaching estimate, not a prediction: maintenance power is uncertain by orders of magnitude.',
      stories: { N: 'An ocean’s microbes react {F} of hydrogen, each mole of methane releasing {Eq}. If one cell needs {Pc} to stay alive, how many cells does the supply sustain?' } },
    { name: 'Water activity', expr: 'aw = pv/ps', tex: 'a_w = \\frac{p_v}{p_s}',
      vars: { aw: { name: 'water activity', tex: 'a_w', min: 0, max: 1 }, pv: { name: 'vapour pressure over the solution', q: 'pressure', unit: 'kPa', value: 1.75, tex: 'p_v' }, ps: { name: 'vapour pressure of pure water', q: 'pressure', unit: 'kPa', value: 2.339, tex: 'p_s', hint: '2.339 kPa at 20 °C.' } },
      solveFor: 'aw', note: 'Equal to the relative humidity of the air in equilibrium with the solution. Saturated sodium chloride has 0.75 at 20 °C; known life stops near 0.6.',
      stories: { aw: 'A brine at 20 °C has a vapour pressure of {pv}, against {ps} for pure water. What is its water activity?' } }
  ],
  examples: [
    { title: 'How little hydrogen will a methanogen live on?', q: 'In an ocean at 0 °C with methane at 0.001 bar and carbon dioxide at 0.01 bar, find the hydrogen pressure at which methanogenesis yields only −20 kJ/mol (the least a cell can use).',
      steps: [{ text: 'From $\\Delta G = \\Delta G^\\circ + RT\\ln Q$ we need $RT\\ln Q = -20 + 130.7 = 110.7$ kJ/mol, and $RT = 2.27$ kJ/mol at 273 K:', tex: '\\ln Q = \\frac{110.7}{2.27} = 48.8,\\qquad Q = 1.5\\times10^{21}' },
        { text: 'With $Q = p_{\\mathrm{CH4}}/(p_{\\mathrm{H2}}^4\\,p_{\\mathrm{CO2}})$ in bar:', tex: 'p_{\\mathrm{H2}}^4 = \\frac{10^{-3}}{1.5\\times10^{21}\\times10^{-2}} = 6.8\\times10^{-23}\\ \\Rightarrow\\ p_{\\mathrm{H2}} = 3\\times10^{-6}\\ \\mathrm{bar}' }],
      a: 'About 3 millionths of a bar — roughly 3 nanomoles of hydrogen per litre of water. That is the order of the threshold measured for methanogens in the laboratory, which is why even a very thin supply of hydrogen is energetically useful.' },
    { title: 'A hypothetical hydrogen supply', q: 'Suppose an ocean consumes 10 mol of H₂ per second, releasing 50 kJ per mole of methane made. If a cell needs 10⁻¹⁸ W for maintenance, how many cells could it keep alive, and how much mass is that (a cell weighs about 10⁻¹⁵ kg)?',
      steps: [{ text: 'Power available:', tex: 'P = \\frac{10 \\times 5\\times10^{4}}{4} = 1.25\\times10^{5}\\ \\mathrm{W}' }, { text: 'Cells:', tex: 'N = \\frac{1.25\\times10^{5}}{10^{-18}} = 1.25\\times10^{23}' }, 'Mass: $1.25\\times10^{23}\\times10^{-15} = 1.25\\times10^{8}$ kg, or 125,000 tonnes.'],
      a: 'About 10²³ cells, 125,000 tonnes — a tiny biosphere on a world of such size, and an upper bound that assumes the cells do nothing but survive. The numbers are illustrations, not measurements of any ocean.' }
  ],
  quiz: [
    { q: 'Which of these is not one of the four needs of life as listed for ocean worlds?', choices: ['Liquid water', 'An energy source', 'A thick atmosphere', 'The elements C, H, N, O, P and S'], a: 2, why: 'The list is liquid water, energy, the six elements and time. A thick atmosphere is not required; the ocean beneath ice has none.' },
    { q: 'Why does hydrogen in Enceladus’s plume matter for habitability?', choices: ['It shows that water is reacting with rock, and it is an energy source for methanogens', 'It makes the plume buoyant', 'It proves there are cells', 'It shows the ocean is hot'], a: 0, why: 'Hydrogen is the product of water–rock reactions and the fuel of methanogens. It is a source of energy, not a sign of life, and says nothing about the temperature of the ocean.' },
    { q: 'Finding methane in a plume would prove that something is alive.', a: false, why: 'Methane can form by water–rock chemistry with no life at all. Only a pattern — several gases out of equilibrium, isotope ratios, large organic molecules — makes a stronger case.' },
    { q: 'How much energy does methanogenesis release per mole of H₂, in kJ, if it releases 131 kJ per mole of CH₄ under standard conditions?', answer: 32.75, unit: 'kJ', why: 'Four moles of H₂ are consumed per mole of methane: 131/4 = 32.75 kJ per mole of hydrogen.' },
    { q: 'A brine has a water activity of 0.45. Known life would find it…', choices: ['an ideal home', 'too dry for growth: below the limit of about 0.6', 'similar to sea water', 'full of oxygen'], a: 1, why: 'Sea water has a water activity of 0.98 and saturated sodium chloride 0.75. At 0.45 no known organism can grow; the water is held too tightly by the dissolved salt.' }
  ],
  applications: ['Choosing instruments for Clipper, JUICE and the Enceladus Orbilander: each is designed to measure one rung of this ladder (liquid water, energy, elements, age of the ocean).', 'Reading the plumes: the ratios of H₂, CO₂ and CH₄ in the spray are fed to models like the free-energy formula to ask whether the hydrogen is being consumed.', 'Planetary protection: the same limits of life set how clean a spacecraft must be before it can visit an ocean world.', 'Understanding Earth’s deep biosphere: microbes in rocks kilometres under the seafloor live on the same low-power chemistry.'],
  history: 'Chemosynthetic life was found at the Galápagos Rift in 1977, when the submersible Alvin met a vent community living on sulfide. The Lost City vent field, which makes hydrogen and methane from rock by serpentinisation with no volcanic heat, was found in 2000 and became the model for what Enceladus’s seafloor might do. The 2017 announcement of hydrogen in the plume made the list of four needs the standard frame for ocean-world exploration.',
  sources: ['NASA JPL, “NASA missions provide new insights into ‘ocean worlds’” (13 April 2017); Waite and colleagues, *Science* (2017) — hydrogen in the Enceladus plume and the list of the four needs.', 'Takai and colleagues, “Cell proliferation at 122 °C and isotopically heavy CH₄ production by a hyperthermophilic methanogen under high-pressure cultivation”, *Proceedings of the National Academy of Sciences* (2008).', 'Stevenson and colleagues, “Multiplication of microbes below 0.690 water activity: implications for terrestrial and extraterrestrial life”, *Environmental Microbiology* (2015).', 'Postberg and colleagues, “Detection of phosphates originating from Enceladus’s ocean”, *Nature* (2023).'],
  sim: { id: 'ow-ocean-map', params: { mode: 'ladder', sel: 'enceladus' } }
},

/* ================================================================ Water worlds around other stars */
{
  id: 'water-worlds-around-other-stars', parent: 'oceans-in-the-dark', title: 'Water worlds around other stars', level: 3,
  short: 'Thousands of planets are known, and some are probably half water. Hycean worlds — oceans under hydrogen — and the seven planets of TRAPPIST-1 are the leading cases; JWST can read the gases in a planet’s air by the light that grazes it, but a claimed biosignature on K2-18 b in 2025 shows how thin the margin is.',
  keywords: ['exoplanet', 'water world', 'ocean planet', 'hycean', 'K2-18 b', 'TRAPPIST-1', 'Proxima b', 'GJ 1214 b', 'transmission spectrum', 'JWST', 'dimethyl sulfide', 'biosignature', 'mini-Neptune', 'scale height', 'equilibrium temperature'],
  prereq: ['the-habitable-zone', 'the-snow-line', 'what-life-needs'],
  related: ['venus-lost-its-ocean', 'comets-asteroids-and-earths-water', 'supercritical-water', 'the-search-follows-the-water', 'europa', 'physics:planets'],
  body: `
Beyond the Solar System more than six thousand planets are known. We cannot see their oceans. What we measure is a radius (from the dip in starlight when a planet crosses its star), a mass (from the star's wobble) and sometimes the colours of starlight filtered through the planet's atmosphere. From these we try to guess which planets are wet.

### Water worlds by density
Many planets of 1.6 to 4 Earth radii are less dense than rock and denser than hydrogen. The mass and radius fit two different stories: a rocky core wrapped in thick hydrogen (a **mini-Neptune**), or a rocky core under a deep layer of water — 10 to 50 % water by mass — an **ocean planet** (Léger and colleagues, 2004). Water formed beyond the snow line ([[the-snow-line]]) and could have migrated in. At depth the water would turn to high-pressure ice or, on a hot planet, to steam and supercritical fluid ([[supercritical-water]]). The two stories are hard to tell apart.

### Hycean worlds and K2-18 b
In 2021 Nikku Madhusudhan and colleagues named a middle case, the **hycean world**: a water ocean under a hydrogen-rich atmosphere. The hydrogen blanket is a strong greenhouse, so a hycean planet could be habitable much farther from its star than the usual zone ([[the-habitable-zone]]). The candidate is **K2-18 b**, 124 light-years away: 2.6 Earth radii, 8.6 Earth masses, orbiting a red dwarf every 33 days at a temperature of about 250–300 K. JWST found **methane and carbon dioxide** in its air in 2023 and no ammonia, as a hycean model predicts. In 2025 a team claimed a signal of dimethyl sulfide (DMS), a molecule that on Earth is made by living things; later analyses of the same and new data did not find it with confidence, and the same spectrum also fits a mini-Neptune or a magma ocean. The claim is **disputed**, and the planet's nature is open.

### Other cases
- **TRAPPIST-1** (40 light-years): seven Earth-sized planets round a tiny, cool star, three of them in the habitable zone (Gillon and colleagues, 2017). Their densities fit rock with a few per cent of water or other volatiles. JWST found that the two innermost, b and c, have no thick atmosphere; the others are being observed.
- **Proxima b** (4.2 light-years): at least 1.07 Earth masses, 11-day orbit, in the habitable zone of a flaring red dwarf. It does not transit, so its radius and water are unknown.
- **GJ 1214 b**: a hot sub-Neptune whose spectrum was found to be flat (Kreidberg and colleagues, 2014), from clouds or from a heavy steam atmosphere.

### Reading starlight
When a planet crosses its star, light that passes through its atmosphere has a slightly bigger shadow where gases absorb. The size of the effect is set by the scale height $H = k_BT/(\\mu m_H g)$ of the atmosphere against the star's size: for K2-18 b, 74 km of scale height gives about 26 parts per million per scale height, for Earth in front of the Sun 0.2. Small stars, light atmospheres and hot planets make the signal larger. Rocky planets with heavy air are the hardest. The lesson of 2025 is caution: the claim, the check and the rebuttal are part of the method.

> [!key] Water worlds and hycean worlds are likely, but mass and radius cannot tell them from mini-Neptunes; JWST reads gases from the starlight at the rim of a planet. K2-18 b shows methane and carbon dioxide, and the claim of dimethyl sulfide is disputed.`,
  ideas: ['A planet’s mass and radius fit both a hydrogen-rich mini-Neptune and a water world; the spectrum is needed to choose.', 'A hycean world is an ocean under a hydrogen atmosphere; K2-18 b is the leading candidate, with methane and carbon dioxide seen by JWST in 2023.', 'The 2025 claim of dimethyl sulfide on K2-18 b is disputed; later analyses did not confirm it.', 'TRAPPIST-1 has seven Earth-sized planets, three in the habitable zone; JWST found no thick air on b and c.', 'The transmission signal grows with the scale height and with a small star: Earth around a Sun twin gives less than a part per million.'],
  pitfalls: ['“K2-18 b has been shown to have life” — A signal of dimethyl sulfide was claimed in 2025; later analyses did not support it with confidence, and even if present the molecule has non-biological sources.', '“Every planet in the habitable zone has an ocean” — The zone means a temperature that could allow liquid water on a surface, given an atmosphere and water; a planet may be dry, or hidden under thick hydrogen.', '“A planet that is half water is mostly ocean” — Half water by mass would mean a layer hundreds of kilometres deep, much of it high-pressure ice beneath a liquid ocean, not a single sea.'],
  terms: [
    { term: 'Hycean world', also: ['hydrogen-ocean planet', 'hycean planet'], def: 'A proposed class of planet with a deep water ocean under a hydrogen-rich atmosphere, up to about 2.6 Earth radii; the hydrogen greenhouse could keep the ocean liquid at larger distances from the star.' },
    { term: 'Water world', also: ['ocean planet', 'water-rich planet'], def: 'A planet with a very large fraction of water (10–50 % of its mass), more than Earth’s 0.02 %, so that the ocean floor is high-pressure ice. Candidates are known; none is proved.' },
    { term: 'Mini-Neptune', also: ['sub-Neptune', 'gas dwarf'], def: 'A planet of 1.7–4 Earth radii with a rocky core and a thick hydrogen–helium envelope, the common alternative to a water world for planets of that size.' },
    { term: 'Transmission spectrum', also: ['transit spectrum'], def: 'The change in a star’s light during a transit, wavelength by wavelength. Bands appear where gases in the planet’s atmosphere absorb, making the planet look larger at those colours.' },
    { term: 'Scale height', also: ['atmospheric scale height', 'H'], def: 'The height over which an atmosphere’s density falls by a factor of e: H = kT/(μ m g). It sets how much atmosphere the starlight crosses and so the size of a transmission spectrum.' },
    { term: 'Equilibrium temperature', also: ['T_eq'], def: 'The temperature a planet would have if it absorbed starlight and re-radiated it evenly as a black body, ignoring any greenhouse effect: T = 278.6 K × L^¼ (1 − A)^¼ / √d for luminosity L in Suns and distance d in AU.' }
  ],
  formulas: [
    { name: 'Equilibrium temperature of a planet', expr: 'T = 278.6*L^0.25*(1 - A)^0.25/sqrt(d)', tex: 'T = 278.6\\ \\mathrm{K}\\,\\frac{L^{1/4}(1-A)^{1/4}}{\\sqrt{d}}',
      vars: { T: { name: 'equilibrium temperature', q: 'temperature', unit: 'K', hint: 'Without a greenhouse effect: Earth would be 255 K (−18 °C); with it, it is 288 K.' }, L: { name: 'luminosity of the star', value: 5.5e-4, hint: 'In units of the Sun’s luminosity. 5.5 × 10⁻⁴ for TRAPPIST-1; 0.023 for K2-18.' },
        A: { name: 'albedo (Bond)', value: 0.3, min: 0, max: 0.99, hint: 'The fraction of starlight reflected. Earth 0.3; an ocean world with thick clouds may be higher.' },
        d: { name: 'distance from the star', q: 'length', unit: 'AU', value: 0.02925, hint: '0.029 AU for TRAPPIST-1 e; 0.143 AU for K2-18 b.' } },
      solveFor: 'T', note: 'The constant 278.6 K is the equilibrium temperature of a black body at 1 AU from the Sun. Gives the starting point for the habitable zone: for liquid water, a greenhouse must raise it to about 273–373 K at the surface.',
      stories: { T: 'A planet of albedo {A} orbits at {d} a star of {L} solar luminosities. What is its equilibrium temperature?', d: 'At what distance does a planet of albedo {A} round a star of {L} solar luminosities have an equilibrium temperature of {T}?' } },
    { name: 'Scale height of an atmosphere', expr: 'H = kB*T/(mu*mH*g)', tex: 'H = \\frac{k_B\\,T}{\\mu\\,m_H\\,g}',
      vars: { H: { name: 'scale height', q: 'length', unit: 'km' }, kB: { const: 'kB' }, T: { name: 'temperature', q: 'temperature', unit: 'K', value: 255, hint: 'The temperature of the part of the atmosphere being probed.' },
        mu: { name: 'mean molecular weight', value: 2.3, tex: '\\mu', hint: '2.3 for a hydrogen-rich atmosphere; 18 for steam; 29 for air; 44 for carbon dioxide.' }, mH: { name: 'mass of a hydrogen atom', q: 'mass', unit: 'kg', value: 1.6735e-27, fixed: true, tex: 'm_H' },
        g: { name: 'gravity', q: 'accel', unit: 'm/s²', value: 12.4, hint: '12.4 m/s² for K2-18 b; 9.8 for Earth.' } },
      solveFor: 'H', note: 'Light atmospheres, hot and low-gravity planets have large scale heights, and so large transmission spectra.',
      stories: { H: 'An atmosphere of mean molecular weight {mu} at {T} on a planet with gravity {g}. What is its scale height?' } },
    { name: 'Size of an atmospheric absorption band', expr: 'dD = 2*Rp*H*n/Rs^2', tex: '\\Delta D = \\frac{2\\,R_p\\,H\\,n}{R_\\star^2}',
      vars: { dD: { name: 'extra transit depth in a band', q: 'ratio', unit: 'ppm', tex: '\\Delta D', hint: 'How much deeper the dip is, in parts per million, at a wavelength where a gas absorbs.' }, Rp: { name: 'planet radius', q: 'length', unit: 'R⊕', value: 2.61, tex: 'R_p' },
        H: { name: 'scale height', q: 'length', unit: 'km', value: 74 }, n: { name: 'scale heights probed', value: 5, hint: 'About 1 in a weak band, 5–8 in a strong band.' },
        Rs: { name: 'star radius', q: 'length', unit: 'R☉', value: 0.445, tex: 'R_\\star' } },
      solveFor: 'dD', note: 'Valid for an atmosphere much thinner than the planet. The ring of atmosphere of height nH has an area 2πR_p·nH, divided by the star’s disc πR★².',
      stories: { dD: 'A planet of radius {Rp} with an atmosphere of scale height {H}, whose strong band probes {n} scale heights, crosses a star of radius {Rs}. How much deeper is the transit in that band?' } }
  ],
  examples: [
    { title: 'How warm is TRAPPIST-1 e?', q: 'TRAPPIST-1 has a luminosity of 5.5 × 10⁻⁴ that of the Sun. Planet e orbits at 0.02925 AU. Find its equilibrium temperature for albedo 0.3 and for albedo 0.',
      steps: [{ text: 'The factor for luminosity:', tex: 'L^{1/4} = (5.5\\times10^{-4})^{1/4} = 0.153' }, { text: 'Distance:', tex: '1/\\sqrt{0.02925} = 5.85' }, { text: 'For albedo 0.3:', tex: 'T = 278.6\\times0.153\\times0.915\\times5.85 = 228\\ \\mathrm{K}' }, 'For albedo 0 the factor $(1-A)^{1/4} = 1$ and $T = 250$ K.'],
      a: 'About 228 K (−45 °C) with a Earth-like albedo, 250 K for a dark planet: below freezing without a greenhouse, but within reach of one, as Earth’s 255 K becomes 288 K.' },
    { title: 'Why Earth is so hard to read', q: 'Compare the transmission signal per scale height of K2-18 b (R = 2.61 R⊕, H = 74 km, star 0.445 R☉) with that of Earth in front of the Sun (H = 7.4 km).',
      steps: [{ text: 'K2-18 b:', tex: '\\frac{2R_pH}{R_\\star^2} = \\frac{2\\times1.663\\times10^{7}\\times7.4\\times10^{4}}{(3.096\\times10^{8})^2} = 2.6\\times10^{-5}\\ (26\\ \\mathrm{ppm})' }, { text: 'Earth:', tex: '\\frac{2\\times6.371\\times10^{6}\\times7.4\\times10^{3}}{(6.957\\times10^{8})^2} = 2\\times10^{-7}\\ (0.2\\ \\mathrm{ppm})' }],
      a: 'K2-18 b’s signal is more than a hundred times larger per scale height: a big planet with a puffy, light atmosphere in front of a small star, against a small planet with a heavy atmosphere in front of a big star. Reading Earth’s twin would need a far better telescope.' }
  ],
  quiz: [
    { q: 'Why can a planet’s mass and radius alone not show that it is a water world?', choices: ['Water has no mass', 'A rocky core under a deep hydrogen envelope can have the same mass and radius as a rocky core under a deep layer of water', 'Radius cannot be measured', 'Water is the same density as rock'], a: 1, why: 'Both a mini-Neptune and a water world give a mean density between rock and hydrogen. A spectrum, or many planets compared statistically, is needed to separate them.' },
    { q: 'Dimethyl sulfide has been firmly detected in the atmosphere of K2-18 b.', a: false, why: 'A 2025 analysis claimed a signal at the edge of significance; later analyses of the same and new data did not find it with confidence. The claim is disputed.' },
    { q: 'What is the equilibrium temperature, in K, of a planet at 1 AU from the Sun with an albedo of 0.3?', answer: 254.8, unit: 'K', why: '$T = 278.6\\times(0.7)^{1/4} = 278.6\\times0.9147 = 254.8$ K — about −18 °C. The greenhouse effect warms Earth to 288 K.' },
    { q: 'Which makes the transmission signal of a planet larger?', choices: ['A heavier atmosphere (higher mean molecular weight)', 'A small star and a hydrogen-rich atmosphere', 'A planet closer to a bigger star', 'A cooler atmosphere'], a: 1, why: 'The band depth goes as $R_pH/R_\\star^2$; a small star and a large scale height (light gas, warm, low gravity) give a large signal.' },
    { q: 'Why is the planet K2-18 b described as a “hycean” candidate and not simply as an ocean world?', choices: ['It has no water', 'Its radius and mass suggest a hydrogen-rich atmosphere over a deep ocean; the spectrum shows carbon dioxide and methane without ammonia, but it is not proved', 'It is a gas giant', 'It orbits a hot star'], a: 1, why: 'The hycean label names a predicted structure that fits the data; alternatives such as a gas-rich mini-Neptune or a magma ocean fit too, so it remains a candidate.' }
  ],
  applications: ['Choosing targets for JWST and future telescopes (Ariel, PLATO, and a later large space observatory for habitable worlds): the scale-height arithmetic shows which planets can be read.', 'Testing planet-formation theory: whether a population of water worlds exists tells how far planets migrate from beyond the snow line.', 'Setting standards of evidence for biosignatures: K2-18 b is already a case study in how a claim should be checked.', 'Comparing with the ocean worlds of the Solar System: the physics of high-pressure ice floors in Ganymede applies to planets with hundreds of kilometres of water.'],
  history: 'The first confirmed planet round a Sun-like star, 51 Pegasi b, came in 1995; Kepler (launched 2009) found thousands. The idea of ocean planets was set out by Léger and colleagues in 2004, the TRAPPIST-1 system was announced in February 2017, and JWST (launched December 2021) began reading small planets’ atmospheres in 2022. The hycean proposal is from 2021.',
  sources: ['Madhusudhan, Piette and Constantinou, “Habitability and biosignatures of Hycean worlds”, *The Astrophysical Journal* (2021).', 'Madhusudhan and colleagues, “Carbon-bearing molecules in a possible Hycean atmosphere”, *The Astrophysical Journal Letters* (2023).', 'Gillon and colleagues, “Seven temperate terrestrial planets around the nearby ultracool dwarf star TRAPPIST-1”, *Nature* (2017).', 'Kreidberg and colleagues, “Clouds in the atmosphere of the super-Earth exoplanet GJ 1214b”, *Nature* (2014).'],
  sim: 'ow-transit-spectrum'
}
);
