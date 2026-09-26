/* HYPER-PHYSICS · content/heat-transfer.js — the three ways heat travels (conduction,
 * convection, radiation) and the exponential cooling they add up to. */
Hyper.add(

{
  id: 'conduction', parent: 'heat-transfer', title: 'Conduction', level: 2,
  short: 'Heat passing through a material from its hot side to its cold side, handed on by vibrating atoms and free electrons; the flow is proportional to the temperature gradient.',
  keywords: ['conduction', 'thermal conductivity', 'Fourier\'s law', 'insulation', 'R-value', 'U-value', 'thermal resistance', 'temperature gradient', 'heat flux', 'double glazing', 'thermal diffusivity', 'heat equation'],
  prereq: ['heat-internal-energy', 'temperature', 'math:derivative'],
  related: ['convection', 'thermal-radiation', 'math:heat-equation', 'resistors-combinations', 'free-electron-model'],
  body: `
Hold one end of a metal rod in a flame and the other end soon becomes too hot to touch, though no part of the rod has moved. The atoms at the hot end vibrate more violently and jostle their neighbours, which jostle theirs: energy is passed along the rod like a rumour, while the material stays put. That is **conduction**. In metals, free electrons do most of the carrying — which is why good electrical conductors are also good conductors of heat.

### Fourier's law
Take a slab of thickness $L$ and area $A$, one face held at a temperature $\\Delta T$ above the other. Once things have settled, the heat flowing through per second is

$$P = \\frac{k\\,A\\,\\Delta T}{L}$$

More area, more flow; a thicker slab, less. The **thermal conductivity** $k$, in W/(m·K), is the material's property. In general the heat flux follows the temperature [[math:derivative|gradient]], $q = -k\\,dT/dx$, flowing downhill in temperature.

| Material | $k$ (W/(m·K)) |
|---|---|
| Diamond | about 2000 |
| Copper | 401 |
| Aluminium | 237 |
| Carbon steel | 50 |
| Stainless steel | 16 |
| Glass, concrete | about 1 |
| Water | 0.6 |
| Wood (across the grain) | 0.12 |
| Mineral wool, expanded polystyrene | 0.03–0.04 |
| Still air | 0.026 |

Look at the bottom of the table: the best insulators are mostly **trapped still air** — in wool, feathers, foam, the gap in double glazing. The solid fibres are only there to stop the air from moving and carrying heat by [[convection]].

This also explains the spoons in the drawer. At room temperature a metal spoon feels colder than a wooden one because metal carries heat away from your fingertip hundreds of times faster, so the skin surface cools more.

### Layers add like resistors
Write Fourier's law as $P = A\\,\\Delta T / R$ with $R = L/k$, the **thermal resistance** of the layer per square metre (the "R-value" of builders, in m²·K/W). The same heat flows through each layer of a wall, so the temperature drops add up and so do the resistances, exactly as for [[resistors-combinations|resistors in series]]:

$$P = \\frac{A\\,\\Delta T}{R_1 + R_2 + \\dots}$$

The layer with the largest $R$ takes the largest share of the temperature drop. A single pane of window glass, 4 mm thick, has $R = 0.004$ m²·K/W; on its own it would let 5 kW through each square metre for a 20 K difference. What actually limits the flow are the thin films of still air clinging to either side, worth about 0.17 m²·K/W together: the real loss is nearer 115 W per square metre.

### How fast does heat soak in?
Before the steady state is reached, the material must first be warmed. How quickly depends on the **thermal diffusivity** $\\alpha = k/(\\rho c)$: conduction against heat capacity. Heat spreads a distance $L$ in a time of order $L^2/\\alpha$ — the [[math:heat-equation|heat equation]] at work. Across 10 cm, that is about 90 s for copper but most of a day for wood. Try both in the simulation below.
`,
  ideas: [
    'Conduction passes energy from atom to atom (and by free electrons in metals) without moving the material.',
    'Fourier\'s law: P = kAΔT/L — the heat flow is proportional to area and temperature difference, and inversely to thickness.',
    'Good insulators work by trapping still air; metals are good conductors because of their free electrons.',
    'Thermal resistances of layers in series add, like electrical resistors.',
    'The time for heat to soak through grows with the square of the thickness: t ~ L²/α.'
  ],
  pitfalls: [
    'Metal objects are colder than wooden ones in the same room — Both are at room temperature. Metal draws heat from your skin faster, so it feels colder.',
    'Insulation keeps the cold out — It slows the flow of heat in whichever direction it goes; the same loft insulation keeps a house cooler in a heatwave.',
    'Doubling the thickness of a wall halves the time heat takes to get through — The steady flow halves, but the time for heat to soak through quadruples, because it scales with L².'
  ],
  formulas: [
    {
      name: 'Fourier\'s law for a slab',
      expr: 'P = k*A*dT/L', tex: 'P = \\frac{k\\,A\\,\\Delta T}{L}',
      vars: {
        P: { name: 'rate of heat flow', q: 'power', unit: 'W' },
        k: { name: 'thermal conductivity', q: 'thermcond', unit: 'W/(m·K)', value: 0.04 },
        A: { name: 'area', q: 'area', unit: 'm²', value: 50 },
        dT: { name: 'temperature difference across the slab', q: 'dtemp', unit: 'K', value: 20, tex: '\\Delta T' },
        L: { name: 'thickness', q: 'length', unit: 'cm', value: 10 }
      },
      note: 'Steady state: the temperatures of the two faces are held fixed and nothing is still warming up.',
      stories: {
        P: 'A loft floor of {A} is covered with {L} of mineral wool (k = {k}). The house is {dT} warmer than the loft. How much heat leaks through?',
        L: 'How thick must insulation with k = {k} be to keep the loss through {A} down to {P} for a difference of {dT}?',
        k: 'A panel {L} thick and {A} in area passes {P} when one face is {dT} warmer than the other. What is its thermal conductivity?'
      }
    },
    {
      name: 'Thermal resistance of a layer (R-value)',
      expr: 'R = L/k',
      vars: {
        R: { name: 'thermal resistance per unit area', q: 'thermres', unit: 'm²·K/W' },
        L: { name: 'thickness', q: 'length', unit: 'cm', value: 10 },
        k: { name: 'thermal conductivity', q: 'thermcond', unit: 'W/(m·K)', value: 0.04 }
      },
      stories: { R: 'What is the R-value of a {L} layer of insulation with k = {k}?', L: 'What thickness of a material with k = {k} gives an R-value of {R}?' }
    },
    {
      name: 'Two layers in series',
      expr: 'P = A*dT/(L1/k1 + L2/k2)', tex: 'P = \\frac{A\\,\\Delta T}{L_1/k_1 + L_2/k_2}',
      vars: {
        P: { name: 'rate of heat flow', q: 'power', unit: 'W' },
        A: { name: 'area', q: 'area', unit: 'm²', value: 10 },
        dT: { name: 'temperature difference across both layers', q: 'dtemp', unit: 'K', value: 20, tex: '\\Delta T' },
        L1: { name: 'thickness of layer 1', q: 'length', unit: 'cm', value: 10 },
        k1: { name: 'conductivity of layer 1', q: 'thermcond', unit: 'W/(m·K)', value: 0.7 },
        L2: { name: 'thickness of layer 2', q: 'length', unit: 'cm', value: 5 },
        k2: { name: 'conductivity of layer 2', q: 'thermcond', unit: 'W/(m·K)', value: 0.03 }
      },
      note: 'Default: 10 cm of brick with 5 cm of foam insulation. Add the surface air films (about 0.17 m²·K/W in total) for a real wall.',
      practice: { unknowns: ['P', 'L2'] },
      stories: {
        P: 'A wall of {A} is made of {L1} of brick (k = {k1}) lined with {L2} of foam (k = {k2}). Inside is {dT} warmer than outside. How much heat passes through?',
        L2: 'A {A} wall has {L1} of brick (k = {k1}). What thickness of foam with k = {k2} must be added to cut the loss to {P} for a difference of {dT}?'
      }
    }
  ],
  derivation: {
    title: 'Why thermal resistances in series add',
    steps: [
      { text: 'In the steady state no heat piles up anywhere, so the same power $P$ crosses each layer. For layer $i$, Fourier\'s law gives its temperature drop:', tex: '\\Delta T_i = P\\,\\frac{L_i}{k_i A} = \\frac{P R_i}{A}' },
      { text: 'The drops across the layers add up to the whole temperature difference:', tex: '\\Delta T = \\Delta T_1 + \\Delta T_2 + \\dots = \\frac{P}{A}\\left(R_1 + R_2 + \\dots\\right)' },
      { text: 'Solve for the heat flow:', tex: 'P = \\frac{A\\,\\Delta T}{R_1 + R_2 + \\dots}' },
      { text: 'Each layer takes a share of the temperature drop in proportion to its resistance — so the insulating layer takes almost all of it.' }
    ]
  },
  examples: [
    {
      title: 'Where a window really loses heat',
      q: 'A 1 m² single-glazed window has glass 4 mm thick ($k = 1.0$ W/(m·K)). Inside is 20 K warmer than outside. Estimate the heat loss (a) from the glass alone, (b) including the still air films on both sides (0.13 and 0.04 m²·K/W).',
      steps: [
        'Glass alone: $R = L/k = 0.004/1.0 = 0.004$ m²·K/W, so $P = A\\Delta T/R = 1 \\times 20/0.004 = 5000$ W.',
        'With the air films: $R_{tot} = 0.13 + 0.004 + 0.04 = 0.174$ m²·K/W.',
        '$P = 1 \\times 20 / 0.174 = 115$ W. The glass itself contributes barely 2 % of the resistance.'
      ],
      a: 'About 115 W; the glass alone would suggest an impossible 5 kW'
    },
    {
      title: 'Insulating a loft',
      q: 'A loft floor of 50 m² has 10 cm of mineral wool ($k = 0.040$ W/(m·K)) and the house is 20 K warmer than the loft. What is the heat loss? What if the wool were 27 cm thick?',
      steps: [
        '$P = \\dfrac{kA\\Delta T}{L} = \\dfrac{0.040 \\times 50 \\times 20}{0.10} = 400$ W.',
        'With 27 cm: $P = 400 \\times 10/27 = 148$ W.',
        'Over a heating season of about 4000 hours, the thicker layer saves roughly 1000 kWh.'
      ],
      a: '400 W with 10 cm, about 150 W with 27 cm'
    }
  ],
  quiz: [
    { q: 'Barefoot, a tiled floor feels colder than a carpet in the same room because…', choices: ['the tiles are at a lower temperature', 'tile conducts heat away from your feet much faster', 'carpet produces heat', 'tile has a higher specific heat'], a: 1,
      why: 'Both are at room temperature. Tile\'s higher conductivity drains heat from your skin faster, and the nerves sense the skin cooling.' },
    { q: 'You double the thickness of the insulation in a wall (and it provides nearly all the wall\'s resistance). The heat loss…', choices: ['doubles', 'stays the same', 'roughly halves', 'drops to a quarter'], a: 2,
      why: '$P = kA\\Delta T/L$: twice the thickness, half the flow.' },
    { q: 'A wall has a thin layer of brick and a thick layer of foam. Across which layer is the larger temperature drop?', choices: ['The brick', 'The foam', 'They share it equally', 'It depends on which side is warm'], a: 1,
      why: 'The same heat flows through both, so the drop is proportional to each layer\'s resistance $L/k$ — far larger for the foam.' },
    { q: 'A down jacket keeps you warm mainly because…', choices: ['feathers produce heat', 'feathers conduct heat very well', 'it traps a thick layer of still air', 'it reflects your body\'s radiation'], a: 2,
      why: 'Still air conducts heat very poorly ($k \\approx 0.026$ W/(m·K)). The feathers stop the air from moving and carrying heat by convection.' },
    { q: 'A copper bar and a steel bar of the same size are heated at one end. Both reach their final, steady temperature profile at the same time.', a: false,
      why: 'The soaking-in time scales as $L^2/\\alpha$ with $\\alpha = k/\\rho c$. Copper\'s diffusivity is about nine times steel\'s, so it settles about nine times faster.' }
  ],
  applications: ['Building insulation, U-values and double glazing.', 'Heat sinks, heat spreaders and thermal paste for electronics.', 'Copper- and aluminium-clad bases on cooking pans.', 'Vacuum flasks: no material in the gap, so no conduction across it.'],
  sim: 'heat-conduction-bar'
},

{
  id: 'convection', parent: 'heat-transfer', title: 'Convection', level: 2,
  short: 'Heat carried by a moving fluid: warm fluid rises and cool fluid sinks on its own (natural convection), or a fan or pump drives it (forced convection).',
  keywords: ['convection', 'natural convection', 'free convection', 'forced convection', 'heat transfer coefficient', 'convection current', 'sea breeze', 'wind chill', 'radiator', 'boundary layer', 'buoyancy'],
  prereq: ['conduction', 'buoyancy', 'density'],
  related: ['newtons-law-of-cooling', 'thermal-expansion', 'viscosity', 'specific-heat'],
  body: `
Heat a pan of water from below. The water at the bottom warms, [[thermal-expansion|expands]] and becomes less dense; [[buoyancy]] lifts it, and cooler, denser water sinks to take its place. A circulation sets in — a **convection current** — and it carries internal energy along with the moving water, far faster than conduction through still water could. Add a pinch of pepper to see the loops.

That is **natural** (or free) convection: the flow is driven by density differences under gravity. Blow on the fluid with a fan or push it with a pump and you get **forced** convection, which is faster still.

### Convection everywhere
- A "radiator" warms a room mostly by convection: air heated at the panel rises to the ceiling, spreads out, cools and sinks on the far side of the room.
- On a sunny day land heats up faster than the sea ([[specific-heat]]); air rises over the land and cooler sea air flows in — a sea breeze. At night the circulation reverses.
- Thunderclouds, ocean currents, the slow churning of the Earth's mantle and the bubbling granules on the Sun's surface are all convection.
- A candle flame on the International Space Station is a dim sphere: without gravity there is no buoyancy, no natural convection and no updraught to feed it fresh air.

### The heat transfer coefficient
Where a fluid flows past a surface, a thin, slower-moving **boundary layer** clings to the surface, and heat must be conducted across it. The whole messy process is summarised by the **heat transfer coefficient** $h$:

$$P = h\\,A\\,(T_s - T_f)$$

where $T_s$ is the surface temperature and $T_f$ that of the fluid far away. $h$ is not a material constant: it depends on the fluid, its speed and the shape of the surface. Typical values:

| Situation | $h$ (W/(m²·K)) |
|---|---|
| Air, natural convection | 2–25 |
| Air, forced (fan, wind) | 10–200 |
| Water, natural convection | 50–1000 |
| Water, forced | 500–10 000 |
| Boiling water | 2500–100 000 |

Wind thins the boundary layer and raises $h$, so a windy day at 5 °C chills you like a still day several degrees colder — "wind chill". An unclothed person in still air ($h \\approx 4$ W/(m²·K), 1.8 m² of skin 12 K warmer than the room) loses about 86 W by convection, the same order as by [[thermal-radiation|radiation]].

### Heat carried by a stream
When a fluid flows through a pipe and is warmed by $\\Delta T$, it carries away heat at the rate

$$P = \\dot m\\,c\\,\\Delta T$$

with $\\dot m$ the mass flow rate. A shower delivering 8 L of water per minute, warmed from 10 °C to 40 °C, needs $0.133 \\times 4186 \\times 30 \\approx 17$ kW — which is why an electric shower of 9 kW can manage only about 4.3 L/min. The same relation sizes car radiators, central-heating pumps and the cooling water of power stations.

> [!note] Whether a layer of fluid heated from below starts to convect at all depends on the balance of buoyancy against viscosity and heat conduction, measured by the Rayleigh number. Thin layers stay still — which is why the gap in double glazing is kept to a centimetre or two.
`,
  ideas: [
    'Convection carries heat by moving the fluid itself.',
    'Natural convection is driven by buoyancy: warm, less dense fluid rises. Forced convection uses fans or pumps.',
    'P = hAΔT, where h depends on the fluid, the flow and the geometry.',
    'Moving fluid thins the boundary layer and raises h: wind chill.',
    'A stream of fluid carries heat at the rate ṁcΔT.'
  ],
  pitfalls: [
    'Heat rises — Hot fluid rises, because buoyancy lifts it. Heat itself flows in every direction from hot to cold, downwards included.',
    'Convection can carry heat through a solid — Convection needs the material to flow. In a solid, heat moves by conduction (and by radiation if it is transparent).',
    'h is a property of the fluid, like k — It also depends on the flow speed, the shape of the surface and whether the fluid boils; that is why it is quoted as a wide range.'
  ],
  formulas: [
    {
      name: 'Convective heat transfer',
      expr: 'P = h*A*dT', tex: 'P = h\\,A\\,\\Delta T',
      vars: {
        P: { name: 'rate of heat transfer', q: 'power', unit: 'W' },
        h: { name: 'heat transfer coefficient', q: 'heattransfer', unit: 'W/(m²·K)', value: 4 },
        A: { name: 'surface area', q: 'area', unit: 'm²', value: 1.8 },
        dT: { name: 'surface temperature minus fluid temperature', q: 'dtemp', unit: 'K', value: 12, tex: '\\Delta T' }
      },
      stories: {
        P: 'A person with {A} of skin stands unclothed in still air ({h}). The skin is {dT} warmer than the air. How much heat is lost by convection?',
        h: 'A {A} radiator panel {dT} warmer than the room gives off {P} by convection. What is the heat transfer coefficient?'
      }
    },
    {
      name: 'Heat carried by a flowing fluid',
      expr: 'P = mdot*c*dT', tex: 'P = \\dot m\\, c\\, \\Delta T',
      vars: {
        P: { name: 'rate at which heat is carried', q: 'power', unit: 'kW' },
        mdot: { name: 'mass flow rate', q: 'massflow', unit: 'kg/h', value: 480, tex: '\\dot m' },
        c: { name: 'specific heat of the fluid', q: 'specificheat', unit: 'J/(kg·K)', value: 4186 },
        dT: { name: 'temperature rise of the fluid', q: 'dtemp', unit: 'K', value: 30, tex: '\\Delta T' }
      },
      note: 'For water, 1 L is 1 kg: 8 L/min is 480 kg/h.',
      stories: {
        P: 'A shower delivers {mdot} of water, heated by {dT}. What heating power does that take?',
        mdot: 'A {P} electric shower heats water by {dT}. What flow of water can it supply?'
      }
    }
  ],
  examples: [
    {
      title: 'How much hot water can a 9 kW shower give?',
      q: 'An electric shower has a 9.0 kW heater. Mains water arrives at 10 °C and a comfortable shower is 40 °C. What flow can it deliver?',
      steps: [
        'From $P = \\dot m c \\Delta T$: $\\dot m = \\dfrac{P}{c\\,\\Delta T} = \\dfrac{9000}{4186 \\times 30} = 0.072\\ \\mathrm{kg/s}$.',
        'That is 0.072 L/s, or $0.072 \\times 60 = 4.3$ L/min.',
        'In winter, with mains water at 5 °C, the flow drops to 3.7 L/min — electric showers feel weaker in winter.'
      ],
      a: 'About 4.3 L/min'
    },
    {
      title: 'A radiator',
      q: 'A radiator panel has 1.6 m² of surface at 55 °C in a room at 20 °C, and $h \\approx 7$ W/(m²·K). How much does it give off by convection?',
      steps: [
        '$\\Delta T = 55 - 20 = 35$ K.',
        '$P = hA\\Delta T = 7 \\times 1.6 \\times 35 = 392$ W.',
        'Radiation adds a similar amount, so the panel delivers roughly 0.7–0.8 kW in all.'
      ],
      a: 'About 390 W by convection'
    }
  ],
  quiz: [
    { q: 'An air-conditioning unit that blows out cold air is best mounted…', choices: ['near the floor', 'high on the wall', 'it makes no difference', 'behind furniture'], a: 1,
      why: 'Cold air is denser and sinks, spreading through the room on its way down. Heaters, conversely, work best low down.' },
    { q: 'A candle burns with a tall flame on Earth but a small blue sphere on the Space Station, because in orbit there is…', choices: ['no oxygen', 'no natural convection', 'no radiation', 'too much pressure'], a: 1,
      why: 'Without apparent gravity, hot gases are not buoyant, so no updraught forms to draw in fresh air and carry away exhaust.' },
    { q: 'Blowing on hot soup cools it faster mainly because…', choices: ['your breath is very cold', 'it thins the warm, moist layer over the surface, raising convection and evaporation', 'it adds cold air to the soup', 'it reduces radiation'], a: 1,
      why: 'Forced convection sweeps away the boundary layer of warm humid air, increasing both the convective transfer coefficient and the evaporation rate.' },
    { q: 'Making the air gap in double glazing wider always improves its insulation.', a: false,
      why: 'Beyond a couple of centimetres, convection currents start circulating inside the gap and carry heat across it, so wider gaps can insulate worse.' },
    { q: 'Doubling the flow rate of water through a boiler while its heating power stays fixed makes the temperature rise of the water…', choices: ['double', 'stay the same', 'halve', 'quarter'], a: 2,
      why: 'With $P = \\dot m c \\Delta T$ fixed, doubling $\\dot m$ halves $\\Delta T$.' }
  ],
  applications: ['Central heating: radiators and underfloor systems.', 'Car radiators and computer fans (forced convection).', 'Weather: sea breezes, thermals used by gliders, thunderstorms.', 'Cooling towers and industrial heat exchangers.'],
  sim: 'heat-cooling'
},

{
  id: 'thermal-radiation', parent: 'heat-transfer', title: 'Thermal radiation (Stefan–Boltzmann)', level: 2,
  short: 'Every object glows with electromagnetic radiation set by its temperature; the power rises as the fourth power of the absolute temperature, and the peak moves to shorter wavelengths as it gets hotter.',
  keywords: ['thermal radiation', 'Stefan-Boltzmann law', 'Stefan–Boltzmann', 'emissivity', 'blackbody', 'black body', 'Wien\'s law', 'Wien displacement', 'infrared', 'T^4', 'radiant heat', 'thermal imaging', 'Kirchhoff'],
  prereq: ['temperature', 'em-spectrum', 'math:power-functions'],
  related: ['blackbody-radiation', 'solar-constant', 'stellar-spectra', 'conduction', 'convection'],
  body: `
The Sun warms your face across 150 million kilometres of empty space: neither conduction nor convection can do that. The energy travels as **electromagnetic radiation**. Every object above absolute zero emits it, because its jiggling charged particles act as tiny antennas. At room temperature the radiation is almost all infrared, invisible to us but plain to a thermal camera; heat a poker to 800 K and a faint red glow appears; the tungsten of an old light bulb at 2800 K shines yellow-white.

### Stefan–Boltzmann law
The power radiated by a surface of area $A$ at absolute temperature $T$ is

$$P = \\varepsilon\\,\\sigma\\,A\\,T^4, \\qquad \\sigma = 5.67\\times10^{-8}\\ \\mathrm{W/(m^2\\,K^4)}$$

The **emissivity** $\\varepsilon$, between 0 and 1, says how close the surface comes to a perfect emitter (a **blackbody**, $\\varepsilon = 1$). Soot and matt black paint are near 0.95, human skin 0.98 in the infrared, polished aluminium only about 0.05.

The fourth power makes temperature overwhelmingly important. Double the absolute temperature and the radiated power rises sixteen-fold. The Sun's surface, at 5772 K, emits 63 MW from every square metre; multiplied by its whole surface that is $3.8\\times10^{26}$ W.

### Emitting and absorbing
A body also absorbs radiation from its surroundings. A good emitter is an equally good absorber at the same wavelength (Kirchhoff's law), so an object at $T$ in surroundings at $T_s$ loses heat at the net rate

$$P_{net} = \\varepsilon\\,\\sigma\\,A\\left(T^4 - T_s^4\\right)$$

When $T = T_s$ it still radiates, but absorbs exactly as much. Your skin at 33 °C, facing walls at 20 °C, radiates about 880 W from 1.8 m² and absorbs about 740 W: a net loss near 140 W — a little less in practice, since arms and legs partly face each other. That is as much as your whole resting metabolism, which is why a room with cold walls feels chilly even when the air is warm.

### Wien's law: the colour of heat
The emitted spectrum is a broad hump ([[blackbody-radiation]]), and its peak shifts to shorter wavelengths as the temperature rises:

$$\\lambda_{\\text{max}} = \\frac{b}{T}, \\qquad b = 2.898\\times10^{-3}\\ \\mathrm{m\\,K}$$

| Object | $T$ (K) | $\\lambda_{\\text{max}}$ |
|---|---|---|
| Human body | 310 | 9.3 µm (far infrared) |
| Glowing coals | 1000 | 2.9 µm |
| Lamp filament | 2800 | 1.0 µm |
| Sun's surface | 5772 | 0.50 µm (green) |

Thermal cameras work in the 8–14 µm band where bodies at room temperature peak. Astronomers read star temperatures from their colours: red stars are cool, blue-white stars are hot ([[stellar-spectra]]). Even the dim filament example is revealing: at 2800 K the peak still lies in the infrared, and only about a tenth of the output is visible light — the reason incandescent bulbs were abandoned.

> [!tip] Shiny surfaces are poor emitters as well as good reflectors. Vacuum flasks are silvered and space blankets are aluminised for this reason: both slow radiative heat loss.
`,
  ideas: [
    'All matter above absolute zero emits electromagnetic radiation; no medium is needed.',
    'P = εσAT⁴: doubling the absolute temperature multiplies the power by 16.',
    'A body absorbs from its surroundings too; the net loss is εσA(T⁴ − Tₛ⁴).',
    'Good absorbers are good emitters; shiny surfaces are poor at both.',
    'Wien\'s law: the peak wavelength λmax = b/T moves to shorter wavelengths as T rises.'
  ],
  pitfalls: [
    'Only hot things radiate — Everything above absolute zero does. You radiate nearly a kilowatt of infrared; you just absorb most of it back from your surroundings.',
    'Using °C in σT⁴ — The law needs absolute temperature. Using 20 instead of 293 K gives an answer about 46 000 times too small.',
    'A shiny surface radiates heat well because it reflects well — The reverse: a good reflector is a poor absorber and therefore a poor emitter.'
  ],
  formulas: [
    {
      name: 'Stefan–Boltzmann law',
      expr: 'P = eps*sigma*A*T^4', tex: 'P = \\varepsilon\\,\\sigma A\\,T^4',
      vars: {
        P: { name: 'radiated power', q: 'power', unit: 'W' },
        eps: { name: 'emissivity', value: 0.98, min: 0, max: 1, tex: '\\varepsilon' },
        sigma: { const: 'sigma' },
        A: { name: 'surface area', q: 'area', unit: 'm²', value: 1.8 },
        T: { name: 'absolute temperature of the surface', q: 'temperature', unit: '°C', value: 33 }
      },
      stories: {
        P: 'How much power does {A} of skin (ε = {eps}) at {T} radiate?',
        T: 'A blackened plate of {A} with ε = {eps} radiates {P}. What is its temperature?'
      }
    },
    {
      name: 'Net radiation to the surroundings',
      expr: 'P = eps*sigma*A*(T^4 - Ts^4)', tex: 'P_{net} = \\varepsilon\\,\\sigma A\\left(T^4 - T_s^4\\right)',
      vars: {
        P: { name: 'net power lost', q: 'power', unit: 'W', signed: true, tex: 'P_{net}' },
        eps: { name: 'emissivity', value: 0.98, min: 0, max: 1, tex: '\\varepsilon' },
        sigma: { const: 'sigma' },
        A: { name: 'surface area', q: 'area', unit: 'm²', value: 1.8 },
        T: { name: 'temperature of the body', q: 'temperature', unit: '°C', value: 33 },
        Ts: { name: 'temperature of the surroundings', q: 'temperature', unit: '°C', value: 20, tex: 'T_s' }
      },
      note: 'Negative when the surroundings are hotter than the body (it gains heat).',
      practice: { unknowns: ['P', 'T'] },
      stories: { P: 'A person with {A} of skin (ε = {eps}) at {T} stands in a room whose walls are at {Ts}. What is the net radiative heat loss?' }
    },
    {
      name: 'Wien\'s displacement law',
      expr: 'lam = bW/T', tex: '\\lambda_{\\text{max}} = \\frac{b}{T}',
      vars: {
        lam: { name: 'wavelength of peak emission', q: 'length', unit: 'µm', tex: '\\lambda_{\\text{max}}' },
        bW: { const: 'bW' },
        T: { name: 'absolute temperature', q: 'temperature', unit: 'K', value: 5772 }
      },
      stories: {
        lam: 'At what wavelength does a surface at {T} radiate most strongly?',
        T: 'A star\'s light peaks at {lam}. What is its surface temperature?'
      }
    }
  ],
  examples: [
    {
      title: 'Losing heat by radiation',
      q: 'An unclothed person has 1.8 m² of skin at 33 °C (emissivity 0.98) in a room whose walls are at 20 °C. Find the power radiated, the power absorbed and the net loss.',
      steps: [
        'Absolute temperatures: $T = 306.15$ K, $T_s = 293.15$ K.',
        'Emitted: $P = \\varepsilon\\sigma A T^4 = 0.98 \\times 5.67\\times10^{-8} \\times 1.8 \\times 306.15^4 = 879$ W.',
        'Absorbed from the walls: $0.98 \\times 5.67\\times10^{-8} \\times 1.8 \\times 293.15^4 = 739$ W.',
        'Net loss: $879 - 739 = 140$ W — comparable to resting metabolism, which is why clothes (a cooler outer surface) matter.'
      ],
      a: 'About 880 W out, 740 W in, 140 W net'
    },
    {
      title: 'Taking the Sun\'s temperature',
      q: 'Sunlight is most intense near a wavelength of 500 nm. Estimate the temperature of the Sun\'s surface, and the power each square metre of it emits.',
      steps: [
        'Wien: $T = b/\\lambda_{\\text{max}} = 2.898\\times10^{-3} / 5.00\\times10^{-7} = 5800$ K.',
        'Stefan–Boltzmann with $\\varepsilon \\approx 1$: $\\sigma T^4 = 5.67\\times10^{-8} \\times 5800^4 = 6.4\\times10^{7}$ W/m².',
        'About 64 MW from every square metre, from light that left the Sun 8 minutes ago.'
      ],
      a: 'About 5800 K and 64 MW/m²'
    }
  ],
  quiz: [
    { q: 'The absolute temperature of a hot plate doubles, from 400 K to 800 K. The power it radiates is multiplied by…', choices: ['2', '4', '8', '16'], a: 3,
      why: '$P \\propto T^4$ and $2^4 = 16$.' },
    { q: 'Emergency space blankets are shiny because…', choices: ['a shiny surface emits little infrared, so the body loses less heat by radiation', 'shiny material conducts heat away', 'it makes the wearer visible to rescuers only', 'it absorbs sunlight'], a: 0,
      why: 'Low emissivity means low emission. The shiny side also reflects the body\'s own radiation back towards it.' },
    { q: 'Of these glowing objects, which is the hottest?', choices: ['one glowing deep red', 'one glowing orange', 'one glowing yellow-white', 'one glowing blue-white'], a: 3,
      why: 'Wien\'s law: the hotter the body, the shorter the peak wavelength, so its colour moves from red through white to blue-white.' },
    { q: 'Thermal radiation needs air or some other medium to travel through.', a: false,
      why: 'It is electromagnetic radiation and crosses a vacuum — that is how sunlight reaches us.' },
    { q: 'If the walls of a room were at exactly your skin temperature, you would…', choices: ['stop radiating', 'radiate as usual but absorb just as much, so no net radiative loss', 'gain heat by radiation', 'radiate only visible light'], a: 1,
      why: 'Emission depends only on your own temperature. The net exchange $\\varepsilon\\sigma A(T^4 - T_s^4)$ is zero when $T = T_s$.' }
  ],
  applications: ['Thermal imaging cameras for buildings, medicine and search and rescue.', 'Vacuum flasks, space blankets and the gold foil on satellites.', 'Measuring the temperatures of stars and of molten metal from their colour (pyrometry).', 'The energy balance of planets and the greenhouse effect.'],
  history: 'Josef Stefan found the $T^4$ law in 1879 from experimental data; his former student Ludwig Boltzmann derived it from thermodynamics in 1884. Wilhelm Wien found the displacement law in 1893. Explaining the full shape of the spectrum needed Planck\'s quantum hypothesis of 1900.',
  sim: 'heat-radiation'
},

{
  id: 'newtons-law-of-cooling', parent: 'heat-transfer', title: 'Newton\'s law of cooling', level: 2,
  short: 'A warm object in cooler surroundings loses heat at a rate proportional to the temperature difference, so its excess temperature decays exponentially.',
  keywords: ['Newton\'s law of cooling', 'cooling curve', 'exponential decay', 'time constant', 'coffee cooling', 'time of death', 'lumped capacitance', 'Biot number', 'half-time', 'thermal time constant'],
  prereq: ['convection', 'specific-heat', 'math:exponential-growth-decay'],
  related: ['math:separable-equations', 'conduction', 'thermal-radiation', 'rc-circuits'],
  body: `
Pour a mug of coffee and leave it on the desk. At first it cools quickly; after half an hour it is barely changing. The reason is simple: the rate of heat loss depends on how much hotter the coffee is than the room. As the difference shrinks, so does the loss.

### The law
For [[convection]], $P = hA\\,(T - T_a)$, where $T_a$ is the ambient temperature; for small differences radiation behaves the same way, since $T^4 - T_a^4 \\approx 4T_a^3(T - T_a)$. The heat lost lowers the object's temperature according to its heat capacity $mc$ ([[specific-heat]]):

$$m c\\,\\frac{dT}{dt} = -hA\\,(T - T_a)$$

This is a first-order [[math:separable-equations|separable differential equation]], and its solution is an [[math:exponential-growth-decay|exponential decay]] of the *excess* temperature:

$$T(t) = T_a + (T_0 - T_a)\\,e^{-t/\\tau}, \\qquad \\tau = \\frac{m c}{h A}$$

The **time constant** $\\tau$ is the heat capacity divided by the heat-loss coefficient. After one $\\tau$ the excess over room temperature has fallen to $1/e \\approx 37\\ \\%$ of its starting value; after two, to 14 %; after five, to under 1 %. The excess halves every $\\tau \\ln 2 \\approx 0.69\\,\\tau$.

### What sets the time constant
- More mass (more heat capacity) cools more slowly: a pot of soup outlasts a spoonful.
- More surface area or a larger $h$ cools faster: soup in a wide bowl cools faster than in a mug, and blowing on it raises $h$.
- An insulated travel mug has a tiny $hA$ and a time constant of hours instead of half an hour.

A ceramic mug of coffee typically has $\\tau$ of 30–40 minutes. The same maths describes a capacitor discharging through a resistor ([[rc-circuits|RC circuits]]): the thermal resistance $1/hA$ plays the part of $R$, and the heat capacity $mc$ the part of $C$.

### When it works, and when it does not
The model assumes that the object has one uniform temperature (heat spreads inside it faster than it escapes — true for a small, well-stirred or highly conducting object), that $h$ is constant, and that the surroundings stay at a fixed temperature. For large temperature differences, natural convection and radiation both grow faster than linearly, and evaporation from an open cup adds extra cooling early on, so a real cup cools a little faster at first than the pure exponential suggests.

### The milk puzzle
You want your coffee as cool as possible in ten minutes and have cold milk to add. Add it now, or at the end? Add it **at the end**. Until then the black coffee stays hotter, and a hotter drink loses heat faster; adding the milk first lowers the temperature difference that drives the cooling. The simulation lets you race the two cups.

> [!note] Forensic scientists use a refined version of this law to estimate the time of death from body temperature, correcting for clothing, posture and an initial plateau during which the body's core barely cools.
`,
  ideas: [
    'The rate of heat loss is proportional to the excess temperature over the surroundings.',
    'The excess temperature decays exponentially: T − Tₐ = (T₀ − Tₐ)e^(−t/τ).',
    'The time constant τ = mc/hA grows with heat capacity and shrinks with area and heat transfer coefficient.',
    'The excess falls to 37 % after one τ and halves every 0.69 τ.',
    'The model needs a uniform object temperature, constant h and steady surroundings.'
  ],
  pitfalls: [
    'The temperature falls by the same number of degrees every minute — The fall is fastest at first; it is the excess over room temperature that shrinks by the same fraction in equal times.',
    'Applying the exponential to T itself — It is T − Tₐ that decays. Forgetting the room temperature predicts coffee cooling towards 0 °C (or 0 K).',
    'The coffee reaches room temperature after five time constants — It gets within 1 % of the starting difference, but mathematically never quite arrives.'
  ],
  formulas: [
    {
      name: 'Temperature after a time',
      expr: 'T = Ta + (T0 - Ta)*exp(-t/tau)', tex: 'T = T_a + (T_0 - T_a)\\, e^{-t/\\tau}',
      vars: {
        T: { name: 'temperature at time t', q: 'temperature', unit: '°C' },
        Ta: { name: 'temperature of the surroundings', q: 'temperature', unit: '°C', value: 20, tex: 'T_a' },
        T0: { name: 'starting temperature', q: 'temperature', unit: '°C', value: 85, tex: 'T_0' },
        t: { name: 'time elapsed', q: 'time', unit: 'min', value: 10 },
        tau: { name: 'time constant', q: 'time', unit: 'min', value: 20, tex: '\\tau' }
      },
      practice: { unknowns: ['T', 't', 'tau'] },
      stories: {
        T: 'A mug of coffee at {T0} is left in a {Ta} room. Its cooling time constant is {tau}. What is its temperature after {t}?',
        t: 'Coffee at {T0} in a {Ta} room cools with a time constant of {tau}. How long until it is down to {T}?',
        tau: 'Tea poured at {T0} in a {Ta} room has cooled to {T} after {t}. What is its time constant?'
      }
    },
    {
      name: 'The time constant',
      expr: 'tau = m*c/(h*A)', tex: '\\tau = \\frac{m\\,c}{h\\,A}',
      vars: {
        tau: { name: 'time constant', q: 'time', unit: 'min', tex: '\\tau' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 0.25 },
        c: { name: 'specific heat', q: 'specificheat', unit: 'J/(kg·K)', value: 4186 },
        h: { name: 'heat transfer coefficient (convection and radiation)', q: 'heattransfer', unit: 'W/(m²·K)', value: 15 },
        A: { name: 'surface area', q: 'area', unit: 'm²', value: 0.03 }
      },
      stories: {
        tau: 'A mug holds {m} of coffee (c = {c}) and loses heat through {A} of surface with h = {h}. What is its cooling time constant?',
        h: 'A {m} can of drink (c = {c}) with {A} of surface has a cooling time constant of {tau}. What is the effective heat transfer coefficient?'
      }
    }
  ],
  derivation: {
    title: 'Solve the cooling equation',
    steps: [
      { text: 'Energy balance: the heat lost each second lowers the internal energy of the object.', tex: 'm c\\,\\frac{dT}{dt} = -hA\\,(T - T_a)' },
      { text: 'Let $\\theta = T - T_a$ be the excess temperature. Since $T_a$ is constant, $d\\theta/dt = dT/dt$, and with $\\tau = mc/hA$:', tex: '\\frac{d\\theta}{dt} = -\\frac{\\theta}{\\tau}' },
      { text: 'Separate the variables and integrate from $\\theta_0$ at $t = 0$:', tex: '\\int_{\\theta_0}^{\\theta} \\frac{d\\theta\'}{\\theta\'} = -\\frac{1}{\\tau}\\int_0^t dt\' \\;\\Rightarrow\\; \\ln\\frac{\\theta}{\\theta_0} = -\\frac{t}{\\tau}' },
      { text: 'Exponentiate and put back $T$:', tex: 'T = T_a + (T_0 - T_a)\\, e^{-t/\\tau}' }
    ]
  },
  examples: [
    {
      title: 'When will it be drinkable?',
      q: 'Coffee poured at 85 °C in a 20 °C room is down to 60 °C after 10 minutes. How long after pouring does it reach 40 °C?',
      steps: [
        'Excess temperatures: 65 K at the start, 40 K after 10 min. So $e^{-10/\\tau} = 40/65$ and $\\tau = 10/\\ln(65/40) = 20.6$ min.',
        'At 40 °C the excess is 20 K: $t = \\tau \\ln(65/20) = 20.6 \\times 1.179 = 24.3$ min.',
        'Notice: the first 25 K of cooling took 10 minutes, the next 20 K took over 14.'
      ],
      a: 'About 24 minutes after pouring'
    },
    {
      title: 'A time of death',
      q: 'A body is found at 07:00 at 30.0 °C in a room at 15.0 °C; at 08:00 it is at 28.0 °C. Assuming simple Newtonian cooling from 37.0 °C, estimate the time of death.',
      steps: [
        'Excess over the room: 15.0 K at 07:00 and 13.0 K at 08:00, so $\\tau = 1\\ \\mathrm{h} / \\ln(15/13) = 6.99$ h.',
        'At death the excess was 22.0 K. Time to fall from 22.0 K to 15.0 K: $t = \\tau\\ln(22/15) = 6.99 \\times 0.383 = 2.68$ h.',
        '2.68 h is 2 h 41 min before 07:00: about 04:20. Real estimates correct for the initial plateau and give a range of times.'
      ],
      a: 'Around 04:20'
    }
  ],
  quiz: [
    { q: 'Coffee at 80 °C in a 20 °C room cools at 2 °C per minute. When it has reached 50 °C it cools at about…', choices: ['2 °C per minute', '1 °C per minute', '0.5 °C per minute', '4 °C per minute'], a: 1,
      why: 'The rate is proportional to the excess over room temperature, which has halved from 60 K to 30 K.' },
    { q: 'You want your coffee as cool as possible in ten minutes. Add the cold milk…', choices: ['straight away', 'at the end', 'halfway through', 'it makes no difference'], a: 1,
      why: 'Black coffee stays hotter until the end, and a hotter drink loses heat faster, so more heat escapes in total before the milk is added.' },
    { q: 'How long does it take for the excess temperature to fall to a quarter of its starting value?', choices: ['$\\tau$', '$1.39\\,\\tau$', '$2\\,\\tau$', '$4\\,\\tau$'], a: 1,
      why: 'A quarter is two halvings, and each halving takes $\\tau\\ln 2$: $2\\tau\\ln 2 = 1.39\\,\\tau$.' },
    { q: 'The same soup is served in a deep mug and in a wide shallow bowl. Which cools faster?', choices: ['The mug', 'The bowl', 'Both the same', 'It depends only on the soup'], a: 1,
      why: 'The bowl exposes more surface area, so $hA$ is larger and $\\tau = mc/hA$ smaller.' },
    { q: 'According to Newton\'s law, the coffee reaches room temperature exactly after five time constants.', a: false,
      why: 'After $5\\tau$ the excess is $e^{-5} \\approx 0.7\\ \\%$ of the start: very close, but the exponential never reaches zero.' }
  ],
  applications: ['Estimating time of death in forensic science.', 'Designing insulated cups, lunch boxes and food transport.', 'Thermal time constants of sensors and electronic components.', 'Checking how quickly cooked food must be chilled for safety.'],
  history: 'Isaac Newton described the law in an anonymous paper of 1701, in which he used the steady cooling of a heated iron bar to extend a temperature scale up to the melting points of metals.',
  sim: 'heat-cooling'
}

);
