/* HYPER-AERODYNAMICS · content/basics.js
 * Branch "Air and Flow Basics": the topics air-properties (air as a fluid) and similarity
 * (dimensional analysis and the dimensionless numbers). Simulations in sims/basics.js (basics-*). */
Hyper.add(

/* ================================================================ AIR AS A FLUID */
{
  id: 'what-is-a-fluid', parent: 'air-properties', title: 'What a fluid is', level: 1,
  short: 'A fluid is any substance that keeps deforming for as long as a sideways (shear) force acts on it, however small the force. Liquids and gases are both fluids; air is one made of widely spaced, fast-moving molecules, yet so many of them that it can be treated as a smooth continuum.',
  keywords: ['fluid', 'liquid', 'gas', 'shear', 'shear stress', 'solid', 'continuum', 'mean free path', 'Knudsen number', 'rarefied gas', 'Newtonian fluid', 'compressibility'],
  prereq: ['physics:density', 'physics:stress-strain', 'physics:kinetic-theory-gases'],
  related: ['air-viscosity', 'air-density', 'air-pressure', 'no-slip', 'navier-stokes', 'physics:mean-free-path', 'hypersonic-flight'],
  body: `
Push sideways on the top of a block of rubber and it leans over by a fixed amount, then stops: its deformation balances the push. Push the same way on the top of a layer of water, honey or air and it never stops leaning — it **flows**, and keeps flowing as long as you push. That is the definition: a **fluid** is a substance that cannot resist a shear stress by deforming a fixed amount. At rest a fluid can only push perpendicular to a surface — that push is [[air-pressure|pressure]] — and any tangential stress, however small, sets it moving.

### Rate, not amount
In a solid the stress depends on *how far* it has been deformed. In a fluid it depends on *how fast* it is being deformed. For air, water and most simple fluids the relation is a straight line — the shear stress is the [[air-viscosity|viscosity]] times the rate of shear, $\\tau = \\mu\\,du/dy$ — and such fluids are called **Newtonian**. Paint, blood and ketchup are not (their viscosity changes with the rate of shear), but aerodynamics deals almost entirely with air and water, which are.

### Liquids and gases
Both flow, but their molecules live very differently:

| | Air at sea level | Water at 20 °C |
|---|---|---|
| Density | 1.225 kg/m³ | 998 kg/m³ |
| Molecules in one cubic micrometre | $2.5\\times10^{7}$ | $3.3\\times10^{10}$ |
| Distance between molecules | ≈ 3.4 nm, about 10 diameters | ≈ 0.3 nm, touching |
| Volume change for 1 kPa more pressure | 0.7 % (sudden squeeze) | 0.00005 % |
| Viscosity $\\mu$ | $1.8\\times10^{-5}$ Pa·s | $1.0\\times10^{-3}$ Pa·s |

A gas is mostly empty space — the molecules themselves fill under 0.1 % of it — so it spreads to fill any container and is easily squeezed. Yet as long as the flow is slow compared with the [[speed-of-sound|speed of sound]], air hardly changes density as it flows round a body, and the same equations describe air and water. That is why aircraft shapes can be tested in water tunnels and submarine hulls in wind tunnels (see [[reynolds-number]]).

### The continuum
We describe air by a density, a pressure, a temperature and a velocity *at every point*, as if it were smooth rather than grainy. That works because the molecules are so many: a cube one micrometre on a side holds 25 million of them. It fails only when a body is not much bigger than the **mean free path** $\\lambda$, the average distance a molecule flies between collisions — about 66 nm at sea level. The ratio is the **Knudsen number** $\\mathrm{Kn} = \\lambda/L$:

| Kn | Regime | Examples |
|---|---|---|
| below 0.01 | continuum: ordinary aerodynamics | everything from insects to airliners |
| 0.01–0.1 | slip flow: the gas slides a little along walls | smoke particles, micro-machines |
| 0.1–10 | transitional | a capsule re-entering near 100 km |
| above 10 | free-molecular: single molecules hit the body | satellites in low orbit |

As the air thins with height the mean free path grows: about 0.2 µm at 11 km, 4.5 µm at 30 km, a few millimetres at 80 km, 15 cm at 100 km and kilometres at the height of the International Space Station.

> [!key] Everything in the rest of this app — [[air-pressure|pressure]], [[air-density|density]], [[streamlines]], [[boundary-layer|boundary layers]] — rests on two ideas from this page: air flows under any shear, and it can be treated as a smooth continuum.
`,
  ideas: [
    'A fluid keeps deforming under any shear stress, however small; a solid deforms a fixed amount and stops.',
    'In a fluid the shear stress depends on the rate of deformation (through viscosity), not on the amount.',
    'Liquids and gases are both fluids; at low Mach number air and water obey the same flow equations.',
    'Air can be treated as a continuum because a cubic micrometre holds 25 million molecules; the Knudsen number λ/L says when that fails.'
  ],
  pitfalls: [
    'A fluid has no strength, so it cannot push on anything — At rest it cannot resist shear, but it presses on every surface with pressure, and in motion it resists the rate of shear. Lift, drag and the ten tonnes of atmosphere on every square metre are fluid forces.',
    'Gases and liquids need different aerodynamics — Below about Mach 0.3 air behaves as an incompressible fluid and obeys the same equations as water; only the numbers (density, viscosity, cavitation) differ.',
    'Old church windows are thicker at the bottom because glass flows — At room temperature glass is so viscous that it would not sag visibly in the age of the universe; old panes were uneven when made and were often fitted thick edge down.'
  ],
  formulas: [
    {
      name: 'Mean free path of a gas molecule',
      expr: 'lambda = kB*T/(sqrt(2)*pi*d^2*p)', tex: '\\lambda = \\dfrac{k_B T}{\\sqrt{2}\\,\\pi d^2 p}',
      vars: {
        lambda: { name: 'mean free path', q: 'length', unit: 'nm', tex: '\\lambda' },
        kB: { const: 'kB' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 15, min: -90, max: 1000 },
        d: { name: 'effective molecular diameter', q: 'length', unit: 'nm', value: 0.365 },
        p: { name: 'pressure (absolute)', q: 'pressure', unit: 'hPa', value: 1013.25 }
      },
      note: 'Kinetic theory of hard spheres. For air an effective diameter of about 0.365 nm gives 66 nm at sea level; the path grows as the pressure falls.',
      practice: { unknowns: ['lambda', 'p'] },
      stories: {
        lambda: 'Air at {T} and {p} is made of molecules with an effective diameter of {d}. How far does a molecule travel, on average, between collisions?',
        p: 'At what pressure does the mean free path of air at {T} reach {lambda} (molecular diameter {d})?'
      }
    },
    {
      name: 'Knudsen number',
      expr: 'Kn = lambda/L', tex: '\\mathrm{Kn} = \\dfrac{\\lambda}{L}',
      vars: {
        Kn: { name: 'Knudsen number', tex: '\\mathrm{Kn}' },
        lambda: { name: 'mean free path', q: 'length', unit: 'nm', value: 66, tex: '\\lambda' },
        L: { name: 'size of the body', q: 'length', unit: 'µm', value: 1 }
      },
      note: 'Below 0.01 the continuum equations hold; 0.01–0.1 slip flow; above 10 free-molecular flow.',
      stories: {
        Kn: 'A particle {L} across moves through air whose mean free path is {lambda}. What is its Knudsen number?',
        L: 'Air has a mean free path of {lambda}. How small must a body be for its Knudsen number to reach {Kn}?'
      }
    }
  ],
  examples: [
    {
      title: 'How grainy is air?',
      q: 'How many molecules are there in one cubic micrometre of air at sea level (15 °C, 1013.25 hPa), and how far apart are they?',
      steps: [
        'Number density from the ideal-gas law: $n = p/(k_B T) = 101\\,325/(1.381\\times10^{-23} \\times 288.15) = 2.55\\times10^{25}\\ \\mathrm{m^{-3}}$.',
        'One cubic micrometre is $10^{-18}$ m³, so it holds $2.5\\times10^{7}$ molecules — 25 million.',
        'Average spacing: $n^{-1/3} = (2.55\\times10^{25})^{-1/3} = 3.4\\times10^{-9}$ m, about ten times the size of a molecule.'
      ],
      a: 'About 25 million molecules, some 3.4 nm apart — plenty for smooth averages even in a speck one micrometre across.'
    },
    {
      title: 'Can a pitot probe trust the continuum?',
      q: 'A probe 3 mm across measures airspeed on a high-altitude balloon at 30 km (−46.5 °C, 11.7 hPa) and on a rocket at 80 km, where the mean free path is about 4 mm. Find the Knudsen numbers.',
      steps: [
        'At 30 km: $\\lambda = k_B T/(\\sqrt2\\,\\pi d^2 p) = 1.381\\times10^{-23}\\times226.65/(1.414\\times\\pi\\times(0.365\\times10^{-9})^2\\times1172) = 4.5\\ \\mu\\mathrm{m}$.',
        '$\\mathrm{Kn} = 4.5\\times10^{-6}/3\\times10^{-3} = 0.0015$: continuum — the ordinary pitot formulas work.',
        'At 80 km: $\\mathrm{Kn} \\approx 4/3 \\approx 1.3$: transitional flow. Molecules reach the probe almost one by one and the continuum formulas no longer apply.'
      ],
      a: 'Kn ≈ 0.0015 at 30 km (fine), about 1.3 at 80 km (the continuum picture has broken down).'
    }
  ],
  quiz: [
    { q: 'Which property makes a substance a fluid?', choices: ['It has no fixed shape because it is light', 'It keeps deforming under any shear stress, however small', 'Its molecules are far apart', 'It cannot be compressed'], a: 1,
      why: 'That is the definition. Liquids have closely packed molecules and are hardly compressible, yet they are fluids; gases are fluids too. Lightness has nothing to do with it — mercury is a fluid.' },
    { q: 'Honey is a fluid, only a far more viscous one than water.', a: true,
      why: 'Honey flows under any shear stress, however slowly; it never settles at a fixed deformation as a solid does. Its viscosity is thousands of times that of water.' },
    { q: 'A smoke particle 1 µm across drifts in sea-level air (mean free path 66 nm). Its Knudsen number puts it in…', choices: ['the continuum regime (Kn ≈ 0.0001)', 'the slip-flow regime (Kn ≈ 0.07)', 'the free-molecular regime (Kn ≈ 7)', 'no regime — Kn applies only to aircraft'], a: 1,
      why: 'Kn = 66 nm / 1000 nm ≈ 0.07. The gas slips a little over the particle, which is why fine smoke settles somewhat faster than the continuum (Stokes) drag law predicts.' },
    { q: 'Because the molecules of air fill less than 0.1 % of its volume, air cannot push hard on anything.', a: false,
      why: 'About 3 × 10²³ molecules strike each square centimetre every second, and together they press with 101 kPa — the weight of ten tonnes on each square metre.' },
    { q: 'How many times denser is water at 20 °C (998 kg/m³) than air at ISA sea level (1.225 kg/m³)?', answer: 815, tol: 0.02,
      why: '998/1.225 = 815. This factor is why a swimmer at 2 m/s meets as much dynamic pressure as a cyclist would at 57 m/s.' }
  ],
  problems: [
    { q: 'What is the mean free path of air molecules at 20 km (−56.5 °C, 54.7 hPa), taking an effective molecular diameter of 0.365 nm? Give it in nanometres.', answer: 923, unit: 'nm', tol: 0.02,
      steps: ['$\\lambda = k_B T/(\\sqrt2\\,\\pi d^2 p) = 1.381\\times10^{-23}\\times216.65/(4.443\\times(0.365\\times10^{-9})^2\\times5475)$.', '$= 2.99\\times10^{-21}/3.24\\times10^{-15} = 9.2\\times10^{-7}$ m ≈ 920 nm — fourteen times the sea-level value, because the pressure is eighteen times lower and the air colder.'] }
  ],
  applications: [
    'Wind and water tunnels: because air and water obey the same equations at low Mach number, either can test the other\'s shapes.',
    'Rarefied-gas dynamics: satellite drag, re-entry heating above 80 km and vacuum technology, where the Knudsen number is large.',
    'Micro-devices and hard-disk read heads that fly on air films a few nanometres thick, well into the slip and transitional regimes.',
    'Aerosols and filters: the slip of air around fine particles changes how fast they settle and how well filters catch them.'
  ],
  history: 'Leonhard Euler wrote the equations of an ideal continuous fluid in 1757, treating it as a smooth substance long before atoms were accepted. A century later James Clerk Maxwell\'s kinetic theory explained pressure and viscosity from molecules in flight, and around 1909 Martin Knudsen\'s experiments on gases in very narrow tubes showed where the continuum picture breaks down.',
  sim: 'basics-couette'
},

{
  id: 'air-density', parent: 'air-properties', title: 'Air density', level: 1,
  short: 'Air has mass: a cubic metre at sea level weighs about 1.2 kg. Its density ρ rises with pressure, falls with temperature and humidity, and drops with height — and every aerodynamic force is proportional to it.',
  keywords: ['density', 'air density', 'rho', 'kg/m3', 'density ratio', 'sigma', 'hot day', 'high altitude', 'buoyancy', 'hot-air balloon', 'weight of air', 'density altitude'],
  prereq: ['what-is-a-fluid', 'physics:density', 'physics:ideal-gas-law'],
  related: ['ideal-gas-air', 'air-pressure', 'isa', 'density-altitude', 'humidity-air', 'dynamic-pressure', 'lift-equation', 'physics:buoyancy'],
  body: `
It is easy to forget that air weighs anything. It does: at sea level in the International Standard Atmosphere (15 °C, 1013.25 hPa) its density is

$$\\rho_0 = 1.225\\ \\mathrm{kg/m^3}$$

A living room of 5 × 4 × 2.5 m holds about 60 kg of air — as much as a person. A litre weighs 1.2 g, and the engines of a large twin-engined airliner swallow well over a tonne of it every second at takeoff. Water is 815 times denser, which is why a swimmer at 2 m/s feels what an aircraft feels at 57 m/s (see [[dynamic-pressure]]).

### Why density is everywhere in aerodynamics
Every aerodynamic force is proportional to density: [[lift-equation|lift]] $L = \\tfrac12\\rho V^2 S C_L$, drag in the same form, the thrust of a propeller, the power of a wind turbine. Halve the density and, at the same speed, you halve the lift. Engines suffer too: a piston engine or a gas turbine breathes a fixed *volume* of air per turn, so its power falls with the density of that air.

### What sets it
Air is an [[ideal-gas-air|ideal gas]], so its density follows from pressure and temperature, $\\rho = p/(R_\\text{air} T)$ with $R_\\text{air} = 287$ J/(kg·K):

- **Pressure up, density up**, in proportion: a high-pressure day at 1035 hPa gives air 2 % denser than a standard one.
- **Temperature up, density down**, in proportion to the absolute temperature: 35 °C instead of 15 °C costs 6.5 %.
- **Humidity up, density down (a little)**: a water molecule (18 g/mol) is lighter than the nitrogen and oxygen it replaces (29 g/mol on average), so humid air is *lighter* — by 1–2 % on a hot, muggy day (see [[humidity-air]]).
- **Height**: pressure falls much faster than temperature, so density falls — to 74 % of its sea-level value at 3000 m, 30 % at 11 000 m, 7 % at 20 000 m.

| Where | Temperature | Pressure | Density (kg/m³) | $\\sigma = \\rho/\\rho_0$ |
|---|---|---|---|---|
| ISA sea level | 15 °C | 1013 hPa | 1.225 | 1.00 |
| Cold winter morning, sea level | −20 °C | 1030 hPa | 1.42 | 1.16 |
| Hot summer afternoon, sea level | 40 °C | 1005 hPa | 1.12 | 0.91 |
| Airfield at 1600 m on a hot afternoon | 30 °C | 835 hPa | 0.96 | 0.78 |
| ISA 3000 m (10 000 ft) | −4.5 °C | 701 hPa | 0.909 | 0.74 |
| Airliner cruise, ISA 11 000 m | −56.5 °C | 226 hPa | 0.364 | 0.30 |
| Concorde cruise, 17 000 m | −56.5 °C | 88 hPa | 0.141 | 0.12 |
| Surface of Mars (carbon dioxide) | ≈ −60 °C | ≈ 6 hPa | ≈ 0.015 | ≈ 0.012 |

The ratio $\\sigma = \\rho/\\rho_0$ is the **density ratio**. Pilots meet it as [[density-altitude|density altitude]]: the height in the standard atmosphere that has the same density as the air they are actually in. The hot airfield in the table, at 1600 m, has a density altitude close to 2500 m.

> [!fact] Mars's air is so thin that the Ingenuity helicopter, a 1.8 kg craft, needed two rotors 1.2 m across spinning at about 2500 rpm — some five times faster than the same rotors would need to lift it on Earth, even allowing for Mars's weaker gravity.

### Weighing air: buoyancy
Anything immersed in air is pushed up by the weight of the air it displaces ([[physics:buoyancy|Archimedes' principle]]). For a person that is about 80 g — negligible. For a hot-air balloon it is the whole point: air heated to 100 °C has a density of 0.95 kg/m³ instead of 1.22, so each cubic metre of hot air lifts about 0.28 kg, and a 2800 m³ envelope lifts around 780 kg. The simulation below lets you fly one.

> [!warn] Aircraft performance on hot, high or humid days comes from the aircraft's approved flight manual and performance charts, not from these rounded figures.
`,
  ideas: [
    'At ISA sea level air has a density of 1.225 kg/m³; water is 815 times denser.',
    'ρ = p/(RT): density rises with pressure and falls with absolute temperature; humid air is slightly lighter than dry air.',
    'Density falls with height because pressure falls much faster than temperature: 30 % of sea level at 11 km.',
    'Every aerodynamic force and every air-breathing engine is proportional to air density.',
    'Buoyancy in air is small for dense bodies but is all that holds up balloons and airships.'
  ],
  pitfalls: [
    'Humid air is heavier because it contains water — Water vapour (18 g/mol) is lighter than the nitrogen and oxygen it displaces, so humid air is slightly less dense. Clouds and rain are liquid water, a different matter.',
    'Density falls with height because the air gets colder — Colder air is denser. Density falls because the pressure falls much faster: at 11 km the pressure is 22 % of its sea-level value, the absolute temperature still 75 %.',
    'Air is too light to matter — A cubic metre weighs 1.2 kg; a room holds a person\'s weight of it, and air at 30 m/s pushes with 550 N on each square metre it meets head-on.'
  ],
  formulas: [
    {
      name: 'Density from pressure and temperature',
      expr: 'rho = p/(Rair*T)', tex: '\\rho = \\dfrac{p}{R_\\text{air}\\, T}',
      vars: {
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', tex: '\\rho' },
        p: { name: 'pressure (absolute)', q: 'pressure', unit: 'hPa', value: 1013.25 },
        Rair: { const: 'Rair' },
        T: { name: 'air temperature', q: 'temperature', unit: '°C', value: 15, min: -90, max: 60 }
      },
      note: 'For dry air. Pressure must be absolute and the temperature is converted to kelvin. Humid air is slightly lighter (see humidity).',
      practice: { unknowns: ['rho', 'T', 'p'] },
      stories: {
        rho: 'What is the density of dry air at {p} and {T}?',
        T: 'Air at {p} has a density of {rho}. What is its temperature?',
        p: 'Air at {T} has a density of {rho}. What is its pressure?'
      }
    },
    {
      name: 'Density ratio',
      expr: 'sigma = rho/rhoSL', tex: '\\sigma = \\dfrac{\\rho}{\\rho_0}',
      vars: {
        sigma: { name: 'density ratio', tex: '\\sigma' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 0.909, tex: '\\rho' },
        rhoSL: { const: 'rhoSL' }
      },
      note: 'Density relative to the ISA sea-level value 1.225 kg/m³. At the same true airspeed, lift and drag scale with σ.',
      stories: { sigma: 'The air at an airfield has a density of {rho}. What is the density ratio?', rho: 'What air density corresponds to a density ratio of {sigma}?' }
    },
    {
      name: 'What a hot-air balloon can lift',
      expr: 'm = p*V/Rair*(1/Ta - 1/Th)', tex: 'm = \\dfrac{pV}{R_\\text{air}}\\left(\\dfrac{1}{T_a} - \\dfrac{1}{T_h}\\right)',
      vars: {
        m: { name: 'gross mass lifted', q: 'mass', unit: 'kg' },
        p: { name: 'air pressure (absolute)', q: 'pressure', unit: 'hPa', value: 1013.25 },
        V: { name: 'envelope volume', q: 'volume', unit: 'm³', value: 2800 },
        Rair: { const: 'Rair' },
        Ta: { name: 'outside air temperature', q: 'temperature', unit: '°C', value: 15, min: -40, max: 50, tex: 'T_a' },
        Th: { name: 'air temperature in the envelope', q: 'temperature', unit: '°C', value: 100, min: 0, max: 150, tex: 'T_h' }
      },
      note: 'The weight of outside air displaced minus the weight of the hot air inside, at the same pressure. The envelope, basket, burners, fuel and people must all come out of this.',
      practice: { unknowns: ['m', 'Th', 'V'] },
      stories: {
        m: 'A balloon envelope of {V} is filled with air at {Th} while the outside air is at {Ta} and {p}. What total mass can it lift?',
        Th: 'A balloon of {V} must lift {m} in air at {Ta} and {p}. How hot must the air inside be?',
        V: 'To lift {m} with air at {Th} inside and {Ta} outside at {p}, how large must the envelope be?'
      }
    }
  ],
  examples: [
    {
      title: 'The air in a room',
      q: 'How much does the air in a room 5 m × 4 m × 2.5 m weigh at 20 °C and 1013 hPa?',
      steps: [
        'Density: $\\rho = p/(RT) = 101\\,300/(287.05 \\times 293.15) = 1.204\\ \\mathrm{kg/m^3}$.',
        'Volume: $5 \\times 4 \\times 2.5 = 50\\ \\mathrm{m^3}$.',
        'Mass: $1.204 \\times 50 = 60.2$ kg.'
      ],
      a: 'About 60 kg — the mass of a person.'
    },
    {
      title: 'A hot afternoon at a high airfield',
      q: 'An airfield at 1600 m reports 30 °C and a pressure of 835 hPa. What are the density and the density ratio, and how much faster (true airspeed) must an aircraft fly to make the same lift as at ISA sea level?',
      steps: [
        '$\\rho = 83\\,500/(287.05 \\times 303.15) = 0.960\\ \\mathrm{kg/m^3}$, so $\\sigma = 0.960/1.225 = 0.78$.',
        'At the same angle of attack lift is proportional to $\\rho V^2$, so the speed must rise by $1/\\sqrt{\\sigma} = 1/\\sqrt{0.78} = 1.13$.',
        'The kinetic energy to reach that speed grows by $1.13^2 = 1.28$, and the engine, breathing thinner air, also gives less power — both lengthen the takeoff run.'
      ],
      a: 'ρ ≈ 0.96 kg/m³, σ ≈ 0.78: the aircraft needs about 13 % more true airspeed, and a markedly longer takeoff run.'
    },
    {
      title: 'How much can a hot-air balloon lift?',
      q: 'A balloon of 2800 m³ is heated to 100 °C inside, on a 15 °C day at 1013.25 hPa. What gross mass can it lift?',
      steps: [
        'Outside: $\\rho_a = 101\\,325/(287.06 \\times 288.15) = 1.225\\ \\mathrm{kg/m^3}$. Inside, at the same pressure: $\\rho_h = 101\\,325/(287.06 \\times 373.15) = 0.946\\ \\mathrm{kg/m^3}$.',
        'Each cubic metre gives $1.225 - 0.946 = 0.279$ kg of lift.',
        'Gross lift: $0.279 \\times 2800 = 781$ kg. The envelope, basket, burners and fuel take a large share of it, leaving room for a handful of passengers.'
      ],
      a: 'About 780 kg of gross lift.'
    }
  ],
  quiz: [
    { q: 'Which air is densest?', choices: ['A hot, humid afternoon at sea level', 'A cold winter morning at sea level with high pressure', 'A mild day at a mountain airfield', 'Air at 11 000 m'], a: 1,
      why: 'Density rises with pressure and falls with temperature and humidity. Cold, high-pressure, dry air is the densest; the mountain airfield and 11 000 m have much lower pressure.' },
    { q: 'At the same temperature and pressure, humid air is denser than dry air because it contains water.', a: false,
      why: 'Water vapour molecules (18 g/mol) replace heavier nitrogen and oxygen molecules (29 g/mol on average), so humid air is slightly less dense.' },
    { q: 'What is the density of dry air at 1000 hPa and 30 °C?', answer: 1.149, unit: 'kg/m³', tol: 0.02,
      why: 'ρ = p/(RT) = 100 000/(287.05 × 303.15) = 1.149 kg/m³ — about 6 % below the ISA sea-level value.' },
    { q: 'At 11 000 m in the standard atmosphere the density is about … of its sea-level value.', choices: ['a tenth', 'three tenths', 'a half', 'three quarters'], a: 1,
      why: '0.364/1.225 = 0.30. An airliner up there must fly about 1.8 times faster (true airspeed) than at sea level to make the same lift at the same angle of attack.' },
    { q: 'Why does air density fall with height?', choices: ['Because the air gets colder', 'Because the pressure falls with height much faster than the absolute temperature does', 'Because gravity is weaker higher up', 'Because there is less oxygen'], a: 1,
      why: 'Cold air on its own would be denser. Pressure falls to 22 % of its sea-level value by 11 km, while the absolute temperature only falls to 75 %; the oxygen fraction stays 21 % up to about 80 km.' }
  ],
  problems: [
    { q: 'An airfield at 2000 m reports 25 °C and a pressure of 795 hPa. What is the air density?', answer: 0.929, unit: 'kg/m³', tol: 0.02,
      steps: ['$\\rho = p/(RT) = 79\\,500/(287.05 \\times 298.15)$.', '$= 0.929\\ \\mathrm{kg/m^3}$, a density ratio of 0.76 — the density the standard atmosphere has at about 2800 m.'] },
    { q: 'A weather balloon holds 4.0 m³ of helium (0.169 kg/m³) in sea-level air (1.225 kg/m³). What gross mass can it lift, in kg?', answer: 4.22, unit: 'kg', tol: 0.02,
      steps: ['Buoyancy minus the weight of the gas: $(\\rho_\\text{air} - \\rho_\\text{He}) V = (1.225 - 0.169) \\times 4.0$.', '$= 4.22$ kg for the envelope, the instruments and the string.'] }
  ],
  applications: [
    'Takeoff and landing performance charts, which correct for pressure altitude, temperature and density altitude.',
    'Engine ratings: piston and turbine power fall with the density of the air they breathe.',
    'Hot-air balloons and airships, which fly on the difference in density between the gas inside and the air outside.',
    'Wind turbines, whose power output is proportional to air density.'
  ],
  history: 'Galileo tried to weigh air by pumping extra air into a flask and weighing it, and concluded that water is some 400 times heavier than air — about half the true ratio. The first people to fly were carried by density alone: on 21 November 1783 Jean-François Pilâtre de Rozier and the Marquis d\'Arlandes crossed Paris under a hot-air balloon built by the Montgolfier brothers.',
  sim: ['basics-balloon', 'basics-speed-altitude']
},

{
  id: 'air-pressure', parent: 'air-properties', title: 'Pressure in air', level: 1,
  short: 'Pressure is the push of the air on a surface per square metre — the combined impacts of countless molecules. At sea level it is about 101 kPa, the weight of the whole column of air above; it falls with height, acts equally in all directions, and is measured either from vacuum (absolute) or from the surrounding air (gauge).',
  keywords: ['pressure', 'atmospheric pressure', 'static pressure', 'absolute pressure', 'gauge pressure', 'differential pressure', 'hPa', 'millibar', 'inHg', 'barometer', 'hydrostatic', 'barometric formula', 'cabin pressure'],
  prereq: ['what-is-a-fluid', 'physics:pressure', 'physics:hydrostatic-pressure'],
  related: ['air-density', 'dynamic-pressure', 'pressure-altitude', 'isa', 'stagnation-point', 'pitot-tube', 'bernoulli', 'pressure-coefficient', 'physics:kinetic-theory-gases'],
  body: `
Every second, each square centimetre of your skin is struck by about $3\\times10^{23}$ air molecules, each bouncing off and handing over a little momentum. Added up, the pushes make **pressure**: force per unit area, $p = F/A$, in pascals (1 Pa = 1 N/m²). At sea level it averages 101 325 Pa — about 10 newtons on every square centimetre.

### Pressure has no direction
At any point in air at rest the pressure is the same whichever way a surface faces — up, down or sideways — and it always pushes perpendicular to the surface. That is why pressure is a single number (a scalar), why a soap bubble is round, and why a sheet of paper lying on a table is not crushed: the air beneath pushes up as hard as the air above pushes down.

### The weight of the sky
Sea-level pressure is simply the weight of all the air above each square metre: $101\\,325/9.81 \\approx 10\\,300$ kg, more than ten tonnes. We do not feel it because the air in our lungs, our houses and our aircraft pushes back equally. Climb and there is less air above you, so the pressure falls — by about 12 Pa per metre near the ground, $\\Delta p = \\rho g\\,\\Delta h$ ([[physics:hydrostatic-pressure|hydrostatic balance]]): 1 hPa for every 8.3 m, or 27 ft. Because air is compressible, the fall is roughly exponential:

| Height | Pressure (ISA) | Fraction of sea level |
|---|---|---|
| 0 m | 1013 hPa | 100 % |
| 1500 m (5000 ft) | 846 hPa | 83 % |
| 3000 m (10 000 ft) | 701 hPa | 69 % |
| 5500 m (18 000 ft) | 505 hPa | 50 % |
| 8850 m (summit of Everest) | 314 hPa | 31 % |
| 11 000 m (airliner cruise) | 226 hPa | 22 % |
| 16 000 m | 103 hPa | 10 % |

An altimeter is a barometer with a height scale: it measures the pressure and shows the standard-atmosphere height that goes with it (see [[pressure-altitude]]).

### Absolute, gauge and differential
**Absolute** pressure is measured from a perfect vacuum; it is the one that goes into the [[ideal-gas-air|gas law]]. **Gauge** pressure is measured from the surrounding air: a tyre at "2.2 bar" holds 3.2 bar absolute. A **differential** pressure is the difference between two places, and that is what pushes on walls, windows and wings. An airliner cabin kept at the pressure of 2400 m (756 hPa) while cruising at 11 000 m (226 hPa) carries a differential of 53 kPa: on a door of 2 m², over 100 kN — more than ten tonnes-force.

### Static, dynamic and total
In moving air, the pressure felt by a probe *moving with the air* is the **static pressure** $p$ — the ordinary pressure of the gas law. Bring the air to rest against a surface, as at the nose of a [[pitot-tube|pitot tube]], and it rises by the [[dynamic-pressure|dynamic pressure]] $q = \\tfrac12\\rho V^2$ to the **total** or stagnation pressure $p_0 = p + q$. Lift and drag come from small differences in static pressure over a body's surface. For a light aircraft they are under 1 % of the atmosphere: a wing loading of 700 N/m² held up against 101 000 N/m² — the force is large only because the wing is large.

| Unit | Standard sea-level pressure |
|---|---|
| pascal, hectopascal (= millibar) | 101 325 Pa = 1013.25 hPa |
| bar | 1.01325 bar |
| standard atmosphere | 1 atm |
| pound-force per square inch | 14.696 psi |
| inch and millimetre of mercury | 29.92 inHg = 760 mmHg |
`,
  ideas: [
    'Pressure is force per area, the sum of molecular impacts; at a point in still air it acts equally in all directions.',
    'Sea-level pressure (101 325 Pa) is the weight of the air column above: over ten tonnes per square metre.',
    'Pressure falls with height, about 1 hPa per 8.3 m near the ground and to half by 5500 m.',
    'Gas laws need absolute pressure; gauges usually read gauge pressure (above the surroundings).',
    'Static pressure is felt moving with the air; stopping the air adds the dynamic pressure to give the total pressure.'
  ],
  pitfalls: [
    'Air pressure pushes downwards — It acts perpendicular to every surface, whichever way it faces; a sheet of paper is pushed up from below as hard as down from above.',
    'A gauge shows the absolute pressure — Most gauges read above the surrounding atmosphere; add about 1 bar for the absolute pressure that the gas law needs.',
    'Wings need huge pressure differences — Under 1 % of the atmosphere holds a light aircraft up; the force is large because the area is large.'
  ],
  formulas: [
    {
      name: 'Pressure change with height (hydrostatic)',
      expr: 'dp = rho*g*dh', tex: '\\Delta p = \\rho\\, g\\, \\Delta h',
      vars: {
        dp: { name: 'pressure difference', q: 'pressure', unit: 'Pa', tex: '\\Delta p' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        g: { const: 'g' },
        dh: { name: 'height difference', q: 'length', unit: 'm', value: 30, tex: '\\Delta h' }
      },
      note: 'For height changes small enough that the density hardly changes (a few hundred metres). Pressure falls going up.',
      stories: {
        dp: 'How much lower is the pressure at the top of a {dh} building than at its foot, in air of density {rho}?',
        dh: 'A barometer reading drops by {dp} in a lift, in air of density {rho}. How far has the lift climbed?'
      }
    },
    {
      name: 'Pressure with height in an isothermal layer',
      expr: 'p = p0*exp(-g*h/(Rair*T))', tex: 'p = p_0\\, e^{-g h/(R_\\text{air} T)}',
      vars: {
        p: { name: 'pressure at height h (absolute)', q: 'pressure', unit: 'hPa' },
        p0: { name: 'pressure at the base (absolute)', q: 'pressure', unit: 'hPa', value: 1013.25, tex: 'p_0' },
        g: { const: 'g' },
        h: { name: 'height above the base', q: 'length', unit: 'm', value: 3000 },
        Rair: { const: 'Rair' },
        T: { name: 'mean temperature of the layer', q: 'temperature', unit: '°C', value: 5, min: -90, max: 50 }
      },
      note: 'Hydrostatic balance plus the gas law, for a layer at one (mean) temperature. With the mean temperature of the ISA layer from 0 to 3000 m (about 5 °C) it gives 701 hPa, the ISA value. The scale height RT/g is about 8 km.',
      practice: { unknowns: ['p', 'h'] },
      stories: {
        p: 'The pressure at the foot of a mountain is {p0}; the air between averages {T}. What is the pressure {h} higher up?',
        h: 'At the base the pressure is {p0}; at the summit {p}. With a mean air temperature of {T}, how high is the summit above the base?'
      }
    },
    {
      name: 'Force of a pressure difference',
      expr: 'F = dp*A', tex: 'F = \\Delta p\\, A',
      vars: {
        F: { name: 'force', q: 'force', unit: 'kN' },
        dp: { name: 'pressure difference across the wall', q: 'pressure', unit: 'kPa', value: 53, tex: '\\Delta p' },
        A: { name: 'area', q: 'area', unit: 'm²', value: 2 }
      },
      note: 'For a uniform difference over a flat area — a door, a window, a panel.',
      stories: { F: 'A cabin door of {A} holds back a pressure difference of {dp}. What force acts on it?', dp: 'A {A} window must withstand {F}. What pressure difference does that correspond to?' }
    },
    {
      name: 'Absolute and gauge pressure',
      expr: 'pabs = pg + patm', tex: 'p_\\text{abs} = p_g + p_\\text{atm}',
      vars: {
        pabs: { name: 'absolute pressure', q: 'pressure', unit: 'bar', tex: 'p_\\text{abs}' },
        pg: { name: 'gauge pressure (reading)', q: 'pressure', unit: 'bar', value: 2.2, signed: true, tex: 'p_g' },
        patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, tex: 'p_\\text{atm}' }
      },
      note: 'A gauge reads the pressure above the surroundings; a negative gauge pressure is a partial vacuum.',
      stories: { pabs: 'A tyre gauge reads {pg} where the atmosphere is at {patm}. What is the absolute pressure in the tyre?', pg: 'A container holds {pabs} absolute. What does a gauge read where the atmosphere is at {patm}?' }
    }
  ],
  examples: [
    {
      title: 'The weight of the atmosphere',
      q: 'What mass of air lies above each square metre at sea level, and roughly how much does the whole atmosphere weigh? (Earth\'s surface area is $5.1\\times10^{14}$ m².)',
      steps: [
        'Pressure is weight per area, so $m = pA/g = 101\\,325 \\times 1/9.807 = 10\\,330$ kg per square metre.',
        'For the whole Earth: $10\\,330 \\times 5.1\\times10^{14} \\approx 5.3\\times10^{18}$ kg (a little less in reality, because mountains stick up into it).'
      ],
      a: 'About 10.3 tonnes over every square metre; roughly 5 × 10¹⁸ kg for the whole atmosphere.'
    },
    {
      title: 'Ears popping in a lift',
      q: 'A lift climbs 100 m up a tower. By how much does the air pressure fall?',
      steps: [
        '$\\Delta p = \\rho g \\Delta h = 1.2 \\times 9.81 \\times 100 = 1180$ Pa, about 12 hPa.',
        'That is 1.2 % of the atmosphere — enough for the air trapped behind the eardrum to push it outwards until the Eustachian tube opens and the ear "pops".'
      ],
      a: 'About 12 hPa (1.2 kPa).'
    },
    {
      title: 'The load on a cabin door',
      q: 'At cruise the cabin is held at 756 hPa while the air outside is at 226 hPa. What force acts on a 2 m² door?',
      steps: [
        'Differential: $75\\,600 - 22\\,600 = 53\\,000$ Pa.',
        '$F = \\Delta p\\,A = 53\\,000 \\times 2 = 106\\,000$ N, the weight of about 10.8 tonnes.',
        'This is why many airliner doors are "plug" doors, larger than their frames: the cabin pressure presses them into their seats.'
      ],
      a: 'About 106 kN.'
    }
  ],
  quiz: [
    { q: 'You carry a barometer up a 300 m hill. Its reading falls by about…', choices: ['0.36 hPa', '3.6 hPa', '36 hPa', 'nothing: pressure depends only on the weather'], a: 2,
      why: 'Δp = ρgΔh = 1.2 × 9.81 × 300 ≈ 3500 Pa = 35 hPa, about 1 hPa per 8.3 m.' },
    { q: 'At a point in still air, the pressure pushes equally in all directions.', a: true,
      why: 'Pressure is a scalar: a small surface at that point feels the same push, perpendicular to itself, whichever way it is turned.' },
    { q: 'A tyre gauge reads 2.0 bar where the atmospheric pressure is 1.013 bar. What is the absolute pressure in the tyre, in bar?', answer: 3.013, unit: 'bar', tol: 0.01,
      why: 'p_abs = p_gauge + p_atm = 2.0 + 1.013 = 3.013 bar. The ideal-gas law must use this value.' },
    { q: 'At about what height in the standard atmosphere is the pressure half its sea-level value?', choices: ['1500 m', '5500 m', '11 000 m', '30 000 m'], a: 1,
      why: 'About 5500 m (18 000 ft): half the mass of the atmosphere lies below that height.' },
    { q: 'A light aircraft with a wing loading of 700 N/m² flies level. The average pressure difference between the lower and upper surfaces of its wing is about…', choices: ['0.7 % of atmospheric pressure', '7 % of it', 'one atmosphere', 'ten atmospheres'], a: 0,
      why: 'The difference must carry 700 N on each square metre: 700/101 325 ≈ 0.7 %.' }
  ],
  problems: [
    { q: 'The pressure at the foot of a hill is 1013.25 hPa and at its summit 900 hPa. If the air between averages 10 °C, how high is the summit above the foot?', answer: 982, unit: 'm', tol: 0.02,
      hint: 'Invert the isothermal barometric formula: h = (RT/g) ln(p₀/p).',
      steps: ['Scale height: $RT/g = 287.06 \\times 283.15/9.807 = 8288$ m.', '$h = 8288 \\times \\ln(1013.25/900) = 8288 \\times 0.1185 = 982$ m.'] }
  ],
  applications: [
    'Altimeters and vertical-speed indicators, which read height and climb rate from static pressure.',
    'Weather maps: isobars of sea-level pressure show highs, lows and (from their spacing) the wind.',
    'Cabin pressurisation, pressure bulkheads and door design in airliners.',
    'The pitot-static system, which compares total and static pressure to measure airspeed.'
  ],
  history: 'Evangelista Torricelli made the first mercury barometer in 1643: the air\'s weight held up a column 76 cm tall. In 1648 Blaise Pascal had his brother-in-law Florin Périer carry one up the Puy de Dôme, and the column was several centimetres shorter at the summit — proof that the air thins with height. In 1654 Otto von Guericke showed its force with two evacuated copper hemispheres that teams of horses could not pull apart.',
  sim: ['basics-pitot', 'basics-balloon']
},

{
  id: 'air-viscosity', parent: 'air-properties', title: 'Viscosity of air', level: 2,
  short: 'Viscosity is a fluid\'s internal friction — its resistance to layers sliding over one another. Air\'s dynamic viscosity is tiny, 1.8 × 10⁻⁵ Pa·s, fifty-five times less than water\'s; but its kinematic viscosity μ/ρ is fifteen times larger than water\'s, and unlike a liquid\'s it rises with temperature.',
  keywords: ['viscosity', 'dynamic viscosity', 'kinematic viscosity', 'mu', 'nu', 'shear stress', 'Newtonian fluid', 'Sutherland law', 'internal friction', 'Couette flow', 'momentum diffusion', 'Pa·s', 'centistokes'],
  prereq: ['what-is-a-fluid', 'physics:viscosity', 'air-density'],
  related: ['no-slip', 'boundary-layer', 'reynolds-number', 'skin-friction', 'navier-stokes', 'turbulence', 'physics:mean-free-path', 'physics:kinetic-theory-gases'],
  body: `
Slide a puck across a table on a thin film of air — an air-hockey table does exactly this — and it glides for metres; slide it on a film of honey and it barely moves. The difference is **viscosity**, a fluid's resistance to one layer sliding over the next.

### Newton's law of viscosity
Put a fluid between two plates a gap $h$ apart and drag the top one at speed $U$. The fluid touching each plate moves with it (the [[no-slip|no-slip condition]]), and in between the velocity rises steadily from 0 to $U$. Keeping the plate moving takes a force per unit area

$$\\tau = \\mu\\,\\frac{du}{dy} = \\mu\\,\\frac{U}{h}$$

where $du/dy$ is the rate of shear and $\\mu$, in Pa·s, is the **dynamic viscosity**. Fluids that obey this straight-line law — air, water, most oils — are called *Newtonian*.

### Two viscosities
Viscosity resists shear, but how strongly a flow *feels* it depends on how much mass there is to move. The ratio

$$\\nu = \\frac{\\mu}{\\rho}$$

is the **kinematic viscosity**, in m²/s. It measures how quickly momentum spreads sideways through the fluid by molecular action, and it is the one that appears in the [[reynolds-number|Reynolds number]] $VL/\\nu$.

| Fluid (20 °C, 1 atm) | $\\mu$ (Pa·s) | $\\nu$ (m²/s) |
|---|---|---|
| Air | $1.81\\times10^{-5}$ | $1.51\\times10^{-5}$ |
| Water | $1.00\\times10^{-3}$ | $1.00\\times10^{-6}$ |
| Olive oil | ≈ 0.08 | ≈ $9\\times10^{-5}$ |
| Honey | 2–10 | ≈ 0.001–0.007 |

Water is 55 times more viscous than air in the dynamic sense, but *air* has the larger kinematic viscosity, by a factor of 15. A flow pattern seen in water at 1 m/s appears in air, at the same size, only at 15 m/s.

### Gases thicken when hot
In a liquid the molecules cling to their neighbours; heat helps them break free, so liquids get runnier when warm (water at 100 °C: 0.28 mPa·s, less than a third of its value at 20 °C). In a gas the molecules fly freely and carry momentum from layer to layer as they go; hotter molecules fly faster and carry more, so a gas gets *more* viscous when warm. Air follows **Sutherland's law** closely:

| Temperature | −56.5 °C | 0 °C | 15 °C | 100 °C | 500 °C |
|---|---|---|---|---|---|
| $\\mu$ of air ($10^{-5}$ Pa·s) | 1.42 | 1.72 | 1.79 | 2.17 | 3.55 |

Kinetic theory predicts something stranger still, and experiment confirms it: the viscosity of a gas does **not** depend on its pressure. Double the density and twice as many molecules carry momentum, but each flies only half as far between collisions ([[physics:mean-free-path|mean free path]]). So high in the atmosphere $\\mu$ is set by temperature alone, while $\\nu = \\mu/\\rho$ grows as the air thins — 2.7 times its sea-level value at 11 000 m — and Reynolds numbers fall.

### Where viscosity matters
Viscosity spreads momentum a distance of roughly $\\sqrt{\\nu t}$ in a time $t$: in air, about 4 mm in a second. Air sweeping past a fast aircraft stays near the surface for only a fraction of a second, so the effects of viscosity are confined to a thin [[boundary-layer|boundary layer]]. Thin, but crucial: that layer makes the [[skin-friction|skin friction]] that is about half the cruise drag of an airliner, and its separation decides when a wing [[stall|stalls]].
`,
  ideas: [
    'Shear stress in a Newtonian fluid is viscosity times rate of shear: τ = μ du/dy.',
    'Kinematic viscosity ν = μ/ρ is the diffusivity of momentum; air\'s is 15 times water\'s.',
    'Gas viscosity rises with temperature (Sutherland\'s law); liquid viscosity falls.',
    'The viscosity of a gas does not depend on its pressure, so ν rises as air thins with height.',
    'Momentum diffuses only about √(νt), which confines viscous effects to thin boundary layers at high speed.'
  ],
  pitfalls: [
    'Water is more viscous than air, so viscosity matters more in water — In dynamic viscosity yes, 55 times; but flow patterns depend on ν = μ/ρ, and air\'s is 15 times larger. At the same size and speed, viscous effects matter more in air.',
    'Gases get runnier when hot, like oil — Gas viscosity rises with temperature (roughly as T^0.75 near room temperature); only liquids thin when heated.',
    'Air\'s viscosity is so small it can be ignored — Away from surfaces, often yes; but the boundary layer produces skin-friction drag and decides separation and stall.'
  ],
  formulas: [
    {
      name: 'Shear stress between two plates (Newton\'s law of viscosity)',
      expr: 'tau = mu*U/h', tex: '\\tau = \\mu\\,\\dfrac{U}{h}',
      vars: {
        tau: { name: 'shear stress on the plates', q: 'stress', unit: 'Pa', tex: '\\tau' },
        mu: { name: 'dynamic viscosity', q: 'viscosity', unit: 'Pa·s', value: 1.81e-5, tex: '\\mu' },
        U: { name: 'speed of the moving plate', q: 'speed', unit: 'm/s', value: 10 },
        h: { name: 'gap between the plates', q: 'length', unit: 'mm', value: 1 }
      },
      note: 'Steady flow of a Newtonian fluid between parallel plates (Couette flow), with a straight-line velocity profile.',
      practice: { unknowns: ['tau', 'mu', 'U'] },
      stories: {
        tau: 'A plate slides at {U} over a fluid film {h} thick with viscosity {mu}. What shear stress does it feel?',
        mu: 'A plate sliding at {U} over a film {h} thick needs a shear stress of {tau}. What is the viscosity of the film?',
        U: 'How fast can a plate slide over a film {h} thick of viscosity {mu} if the shear stress may not exceed {tau}?'
      }
    },
    {
      name: 'Kinematic viscosity',
      expr: 'nu = mu/rho', tex: '\\nu = \\dfrac{\\mu}{\\rho}',
      vars: {
        nu: { name: 'kinematic viscosity', q: 'kinvisc', unit: 'm²/s', tex: '\\nu' },
        mu: { name: 'dynamic viscosity', q: 'viscosity', unit: 'Pa·s', value: 1.789e-5, tex: '\\mu' },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' }
      },
      note: 'ISA sea level gives 1.46 × 10⁻⁵ m²/s (14.6 mm²/s, or cSt). Water at 20 °C: 1.0 × 10⁻⁶ m²/s.',
      stories: { nu: 'A fluid has a dynamic viscosity of {mu} and a density of {rho}. What is its kinematic viscosity?', rho: 'Air with a viscosity of {mu} has a kinematic viscosity of {nu}. What is its density?' }
    },
    {
      name: 'Sutherland\'s law for the viscosity of air',
      expr: 'mu = mu0*(T/Tr)^1.5*(Tr + S)/(T + S)', tex: '\\mu = \\mu_0 \\left(\\dfrac{T}{T_r}\\right)^{3/2} \\dfrac{T_r + S}{T + S}',
      vars: {
        mu: { name: 'dynamic viscosity', q: 'viscosity', unit: 'Pa·s', tex: '\\mu' },
        mu0: { name: 'viscosity at the reference temperature', q: 'viscosity', unit: 'Pa·s', value: 1.716e-5, fixed: true, tex: '\\mu_0' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 15, min: -150, max: 1500 },
        Tr: { name: 'reference temperature', q: 'temperature', unit: '°C', value: 0, fixed: true, tex: 'T_r' },
        S: { name: 'Sutherland constant of air', q: 'dtemp', unit: 'K', value: 110.4, fixed: true }
      },
      note: 'Accurate to about 2 % for air from roughly −100 °C to 1600 °C. The same law, with μ₀ = 1.716 × 10⁻⁵ Pa·s at 0 °C and S = 110.4 K, is built into the standard atmosphere.',
      practice: { unknowns: ['mu', 'T'] },
      stories: {
        mu: 'What is the dynamic viscosity of air at {T}?',
        T: 'At what temperature does air have a dynamic viscosity of {mu}?'
      }
    },
    {
      name: 'How far momentum diffuses',
      expr: 'delta = sqrt(nu*t)', tex: '\\delta = \\sqrt{\\nu\\, t}',
      vars: {
        delta: { name: 'distance momentum spreads', q: 'length', unit: 'mm', tex: '\\delta' },
        nu: { name: 'kinematic viscosity', q: 'kinvisc', unit: 'mm²/s', value: 15, tex: '\\nu' },
        t: { name: 'time', q: 'time', unit: 's', value: 1 }
      },
      note: 'An order-of-magnitude estimate (the exact factor depends on how the spread is defined). It is why boundary layers are thin on fast bodies: t is the time the air takes to pass.',
      stories: {
        delta: 'A plate is suddenly set moving in a fluid with kinematic viscosity {nu}. Roughly how far has the motion spread after {t}?',
        t: 'How long does it take momentum to diffuse {delta} through a fluid with kinematic viscosity {nu}?'
      }
    }
  ],
  examples: [
    {
      title: 'An air-hockey puck',
      q: 'A puck 6 cm across (area 2.8 × 10⁻³ m²) glides at 2 m/s on an air film about 0.1 mm thick. Estimate the viscous drag on it.',
      steps: [
        'Shear stress: $\\tau = \\mu U/h = 1.8\\times10^{-5} \\times 2/1\\times10^{-4} = 0.36$ Pa.',
        'Force: $F = \\tau A = 0.36 \\times 2.8\\times10^{-3} = 1.0\\times10^{-3}$ N.',
        'That is the weight of a tenth of a gram — which is why the puck slides so far.'
      ],
      a: 'About a millinewton.'
    },
    {
      title: 'Viscosity at cruising height',
      q: 'Find the dynamic and kinematic viscosity of the ISA air at 11 000 m (−56.5 °C, ρ = 0.364 kg/m³), and the Reynolds number of a 5 m wing chord at 230 m/s there and at sea level.',
      steps: [
        'Sutherland: $\\mu = 1.716\\times10^{-5}\\,(216.65/273.15)^{1.5}\\,(273.15 + 110.4)/(216.65 + 110.4) = 1.42\\times10^{-5}$ Pa·s — lower than at sea level, because the air is colder.',
        '$\\nu = \\mu/\\rho = 1.42\\times10^{-5}/0.364 = 3.9\\times10^{-5}$ m²/s: 2.7 times the sea-level value of $1.46\\times10^{-5}$.',
        'Reynolds number: $230 \\times 5/3.9\\times10^{-5} = 2.9\\times10^{7}$ at 11 000 m, against $230 \\times 5/1.46\\times10^{-5} = 7.9\\times10^{7}$ at sea level.'
      ],
      a: 'μ ≈ 1.42 × 10⁻⁵ Pa·s but ν ≈ 3.9 × 10⁻⁵ m²/s; the Reynolds number at cruise is about 3 × 10⁷, less than half the sea-level value at the same speed.'
    }
  ],
  quiz: [
    { q: 'Which has the larger kinematic viscosity at 20 °C?', choices: ['Water, because it is thicker', 'Air, by about 15 times', 'They are equal', 'It depends on the speed of the flow'], a: 1,
      why: 'ν = μ/ρ: air 1.8 × 10⁻⁵/1.2 = 1.5 × 10⁻⁵ m²/s, water 1.0 × 10⁻³/998 = 1.0 × 10⁻⁶ m²/s.' },
    { q: 'Heating air makes it less viscous, as heating honey does.', a: false,
      why: 'Gases become more viscous when heated — faster molecules carry more momentum between layers. Only liquids thin out.' },
    { q: 'At constant temperature, the pressure of a gas is doubled. Its dynamic viscosity μ and kinematic viscosity ν…', choices: ['both double', 'μ is unchanged; ν halves', 'μ doubles; ν is unchanged', 'both halve'], a: 1,
      why: 'Gas viscosity does not depend on pressure (Maxwell), but the density doubles, so ν = μ/ρ halves.' },
    { q: 'What is the kinematic viscosity of ISA sea-level air (μ = 1.79 × 10⁻⁵ Pa·s, ρ = 1.225 kg/m³), in mm²/s?', answer: 14.6, unit: 'mm²/s', tol: 0.02,
      why: '1.79 × 10⁻⁵/1.225 = 1.46 × 10⁻⁵ m²/s = 14.6 mm²/s (14.6 centistokes).' },
    { q: 'On a fast aircraft, viscous effects are confined to a thin boundary layer because…', choices: ['air has no viscosity away from walls', 'momentum diffuses only about √(νt) — millimetres — in the short time the air takes to pass', 'the engines suck away the viscous air', 'the paint is smooth'], a: 1,
      why: 'Viscosity acts everywhere, but it spreads momentum slowly. In the tenths of a second the air spends near a wing, the slowed layer grows only millimetres to centimetres thick.' }
  ],
  problems: [
    { q: 'A machine slide rides on an oil film 0.05 mm thick with a viscosity of 0.1 Pa·s and moves at 0.5 m/s. What shear stress (force per square metre) does the film exert?', answer: 1000, unit: 'Pa', tol: 0.02,
      steps: ['$\\tau = \\mu U/h = 0.1 \\times 0.5/0.000\\,05$.', '$= 1000$ Pa: 1 kN on every square metre of slide — the same film of air would need only 0.18 N.'] }
  ],
  applications: [
    'Air bearings, air-hockey tables and the heads of hard disks, which ride on thin air films.',
    'Skin-friction drag of aircraft, cars and trains, all of which starts with τ = μ du/dy at the wall.',
    'Computational fluid dynamics codes, which use Sutherland\'s law for the viscosity of air.',
    'Viscometers, which infer viscosity from the force or torque on a sheared film.'
  ],
  history: 'Isaac Newton proposed in the Principia (1687) that the resistance of a fluid to sliding is proportional to the rate of sliding. In 1860 James Clerk Maxwell derived from his kinetic theory that the viscosity of a gas should not depend on its pressure — so unexpected that he tested it himself, timing discs swinging in air at different pressures at his London home, with his wife Katherine helping; the results, published in 1866, confirmed it. William Sutherland gave the temperature law still used today in 1893.',
  sim: ['basics-couette', 'basics-cylinder-re']
},

{
  id: 'ideal-gas-air', parent: 'air-properties', title: 'Air as an ideal gas', level: 2,
  short: 'Air obeys the ideal-gas law p = ρRT to better than 0.1 % in almost all aerodynamics, with R = 287 J/(kg·K) and γ = cp/cv = 1.4. Squeeze it quickly and it heats; let it expand and it cools — the key to sound, nozzles, compressors and the temperature lapse of the atmosphere.',
  keywords: ['ideal gas', 'equation of state', 'p = rho R T', 'gas constant', 'specific gas constant', '287', 'gamma', 'ratio of specific heats', 'cp', 'cv', 'adiabatic', 'isentropic', 'compression heating', 'enthalpy', 'ram temperature rise'],
  prereq: ['air-density', 'air-pressure', 'physics:ideal-gas-law', 'physics:first-law-thermodynamics'],
  related: ['speed-of-sound', 'isentropic-flow', 'stagnation-properties', 'compressibility', 'lapse-rate', 'humidity-air', 'hypersonic-flight', 'physics:specific-heat', 'physics:thermodynamic-processes', 'physics:equipartition'],
  body: `
Dry air is 78.1 % nitrogen, 20.9 % oxygen, 0.9 % argon and a trace (0.04 %) of carbon dioxide, with an average molar mass of 28.96 g/mol. Its molecules are small, far apart and barely attract one another, so it behaves almost exactly as an **ideal gas**: at 1 atm and room temperature the deviation is about 0.03 %.

### The equation of state for engineers
Chemists write $pV = nRT$ with the universal constant $R = 8.314$ J/(mol·K). Aerodynamicists divide by the mass of gas and use the density instead:

$$p = \\rho\\, R_\\text{air}\\, T, \\qquad R_\\text{air} = \\frac{8.314}{0.028\\,96} = 287.05\\ \\mathrm{J/(kg\\,K)}$$

Pressure must be **absolute** and temperature in **kelvin**. Any two of $p$, $\\rho$ and $T$ fix the third: this one line gives the density of the [[isa|standard atmosphere]] at every height, the density in a wind tunnel, the mass of air in a tyre.

### Heat capacities and γ
Warming a kilogram of air by 1 K in a closed box takes $c_v = 718$ J; at constant pressure, where it also pushes its surroundings back as it expands, $c_p = 1005$ J. Their difference is exactly $R_\\text{air}$, and their ratio

$$\\gamma = \\frac{c_p}{c_v} = 1.40$$

runs through all of compressible aerodynamics. It is 7/5 because nitrogen and oxygen molecules are little dumbbells that store energy in three ways of moving and two ways of spinning ([[physics:equipartition|equipartition]]); for a single-atom gas such as helium or argon it is 5/3. When air is hot enough for its molecules to vibrate as well, $\\gamma$ drifts down (about 1.34 at 1000 K), and above about 2500 K oxygen molecules begin to break apart — the world of [[hypersonic-flight|re-entry]].

### Quick changes: adiabatic
When air is compressed or expanded quickly — in a sound wave, a compressor, a nozzle — there is no time for heat to flow in or out. Such an **adiabatic** change (called **isentropic** when there is also no friction) follows

$$\\frac{p}{\\rho^{\\gamma}} = \\text{const}, \\qquad \\frac{T_2}{T_1} = \\left(\\frac{p_2}{p_1}\\right)^{(\\gamma-1)/\\gamma}$$

| Process | Example | What happens |
|---|---|---|
| Rapid compression | bicycle pump, jet-engine compressor | air heats: squeezing it from 1 to 7 bar (absolute) takes it from 20 °C to about 240 °C |
| Rapid expansion | air leaving a nozzle or a spray can, air rising in the atmosphere | air cools: the dry lapse rate of 9.8 °C per kilometre comes from this |
| Slow change | a tyre warming in the sun | heat flows in: the temperature follows the surroundings |

### Energy in a moving gas
Per kilogram, a flowing gas carries its enthalpy $c_pT$ and its kinetic energy $V^2/2$. Along a streamline in steady adiabatic flow their sum stays constant, so air brought to rest warms by $V^2/(2c_p)$: 5 K from 100 m/s, 31 K from 250 m/s, 180 K from 600 m/s. That is the [[stagnation-properties|stagnation temperature]] that heats Concorde's nose and every temperature probe on a fast aircraft.

> [!note] Where the ideal gas fails: near condensation (water vapour forming clouds and contrails; the cryogenic nitrogen of some wind tunnels), at very high pressures, and at the thousands of kelvin behind a re-entry shock, where molecules split apart and ionise.
`,
  ideas: [
    'Air behaves as an ideal gas: p = ρRT with R = 287 J/(kg·K), absolute pressure and kelvin.',
    'cp = 1005 and cv = 718 J/(kg·K); cp − cv = R and γ = cp/cv = 1.4 for air (5/3 for single-atom gases).',
    'Fast changes are adiabatic: compressed air heats, expanding air cools, with T ∝ p^((γ−1)/γ).',
    'In steady adiabatic flow cpT + V²/2 is constant, so stopping the air warms it by V²/(2cp).'
  ],
  pitfalls: [
    'You can put °C into p = ρRT — The law needs absolute temperature in kelvin; using 15 instead of 288.15 makes the density 19 times too large.',
    'Gauge pressure works in the gas law — Only absolute pressure does: a tyre at "2.2 bar" holds 3.2 bar absolute.',
    'R is the same for every gas — The molar constant 8.314 J/(mol·K) is universal; the specific constant R/M is not: 287 J/(kg·K) for air, 2077 for helium, 189 for carbon dioxide.'
  ],
  formulas: [
    {
      name: 'Ideal-gas law for air',
      expr: 'p = rho*Rair*T', tex: 'p = \\rho\\, R_\\text{air}\\, T',
      vars: {
        p: { name: 'pressure (absolute)', q: 'pressure', unit: 'hPa' },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        Rair: { const: 'Rair' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 15, min: -150, max: 1500 }
      },
      note: 'Absolute pressure and absolute temperature. R_air = 287.058 J/(kg·K) for dry air.',
      practice: { unknowns: ['p', 'rho', 'T'] },
      stories: {
        p: 'Air of density {rho} is at {T}. What is its absolute pressure?',
        rho: 'What is the density of air at {p} (absolute) and {T}?',
        T: 'Air at {p} (absolute) has a density of {rho}. What is its temperature?'
      }
    },
    {
      name: 'Specific gas constant from the molar mass',
      expr: 'Rs = R/Mm', tex: 'R_s = \\dfrac{R}{M}',
      vars: {
        Rs: { name: 'specific gas constant', q: 'specificheat', unit: 'J/(kg·K)', tex: 'R_s' },
        R: { const: 'R' },
        Mm: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 28.96, tex: 'M' }
      },
      note: 'Air 28.96 g/mol → 287 J/(kg·K); helium 4.00 → 2077; carbon dioxide 44.0 → 189.',
      stories: { Rs: 'A gas has a molar mass of {Mm}. What is its specific gas constant?', Mm: 'A gas has a specific gas constant of {Rs}. What is its molar mass?' }
    },
    {
      name: 'Temperature after an adiabatic compression or expansion',
      expr: 'T2 = T1*(p2/p1)^((gamma - 1)/gamma)', tex: 'T_2 = T_1 \\left(\\dfrac{p_2}{p_1}\\right)^{(\\gamma - 1)/\\gamma}',
      vars: {
        T2: { name: 'final temperature', q: 'temperature', unit: '°C', tex: 'T_2' },
        T1: { name: 'initial temperature', q: 'temperature', unit: '°C', value: 20, min: -100, max: 500, tex: 'T_1' },
        p2: { name: 'final pressure (absolute)', q: 'pressure', unit: 'bar', value: 7, tex: 'p_2' },
        p1: { name: 'initial pressure (absolute)', q: 'pressure', unit: 'bar', value: 1, tex: 'p_1' },
        gamma: { name: 'ratio of specific heats', value: 1.4, min: 1.01, max: 1.7, tex: '\\gamma' }
      },
      note: 'Reversible adiabatic (isentropic) change of an ideal gas. Real compressors, with friction, deliver somewhat hotter air.',
      practice: { unknowns: ['T2', 'p2'] },
      stories: {
        T2: 'Air at {T1} and {p1} is compressed quickly to {p2} (both absolute), with γ = {gamma}. How hot does it get?',
        p2: 'Air at {T1} and {p1} is compressed adiabatically until it reaches {T2}. What is its pressure then?'
      }
    },
    {
      name: 'Warming of air brought to rest',
      expr: 'dT = V^2/(2*cp)', tex: '\\Delta T = \\dfrac{V^2}{2 c_p}',
      vars: {
        dT: { name: 'temperature rise', q: 'dtemp', unit: 'K', tex: '\\Delta T' },
        V: { name: 'flow speed', q: 'speed', unit: 'm/s', value: 250 },
        cp: { name: 'specific heat at constant pressure', q: 'specificheat', unit: 'J/(kg·K)', value: 1005, tex: 'c_p' }
      },
      note: 'Steady adiabatic flow: the kinetic energy turns into enthalpy. It is the difference between the stagnation and the static temperature.',
      stories: { dT: 'Air moving at {V} is brought to rest on the nose of an aircraft. By how much does it warm up?', V: 'A temperature probe reads {dT} above the outside air. How fast is the aircraft flying?' }
    }
  ],
  examples: [
    {
      title: 'The gas constant of air',
      q: 'Find the specific gas constant of dry air from its molar mass, 28.96 g/mol.',
      steps: ['$R_\\text{air} = R/M = 8.314/0.028\\,96 = 287.1$ J/(kg·K).', 'Check with the ISA: $p/(\\rho T) = 101\\,325/(1.225 \\times 288.15) = 287.05$ J/(kg·K).'],
      a: 'About 287 J/(kg·K).'
    },
    {
      title: 'Why compressors need coolers',
      q: 'A compressor squeezes air at 20 °C and 1 bar (absolute) to 7 bar (absolute) so quickly that no heat escapes. How hot is the delivered air?',
      steps: [
        '$T_2 = T_1 (p_2/p_1)^{(\\gamma-1)/\\gamma} = 293.15 \\times 7^{0.2857}$.',
        '$7^{0.2857} = 1.744$, so $T_2 = 511$ K = 238 °C.',
        'Workshop compressors therefore cool the air between stages and after the last one; a jet engine\'s compressor, squeezing 30 to 40 times, delivers air at 500–600 °C.'
      ],
      a: 'About 240 °C.'
    },
    {
      title: 'The air in an airliner cabin',
      q: 'At cruise a cabin is held at 756 hPa and 22 °C. What is the density of the air in it?',
      steps: ['$\\rho = p/(RT) = 75\\,600/(287.05 \\times 295.15) = 0.892\\ \\mathrm{kg/m^3}$.', 'That is 27 % less than at ISA sea level — the same as the air on a mountain 2400 m high, which is what the cabin is designed to feel like.'],
      a: 'About 0.89 kg/m³.'
    }
  ],
  quiz: [
    { q: 'A tyre holds 3.2 bar absolute at 20 °C. What is the density of the air inside?', answer: 3.80, unit: 'kg/m³', tol: 0.02,
      why: 'ρ = p/(RT) = 320 000/(287.05 × 293.15) = 3.80 kg/m³ — three times sea-level air, because the absolute pressure is three times larger.' },
    { q: 'Why is γ = 1.4 for air but 1.67 for helium?', choices: ['Helium is lighter', 'Air molecules are two-atom dumbbells that also store energy in rotation, so more heat goes in per degree at constant volume', 'Air contains water vapour', 'Helium cannot be compressed'], a: 1,
      why: 'Each way a molecule can store energy takes ½kT per molecule. Single atoms have 3 (motion), so γ = 5/3; dumbbells add 2 of rotation, so γ = 7/5.' },
    { q: 'Air that expands quickly, without time to exchange heat, cools down.', a: true,
      why: 'In an adiabatic expansion the gas does work on its surroundings from its own internal energy, so its temperature falls — rising air cools by about 9.8 °C per kilometre.' },
    { q: 'Someone computes ρ = p/(RT) with p = 1013 hPa and T = 15, forgetting to use kelvin. Their answer is…', choices: ['about right', 'about 19 times too large', 'too small by 273', 'negative'], a: 1,
      why: '101 300/(287 × 15) = 23.5 kg/m³ instead of 1.225 — the ratio 288.15/15 = 19.2.' },
    { q: 'By how many kelvin does air warm up when it is brought to rest from 250 m/s? (cp = 1005 J/(kg·K))', answer: 31.1, tol: 0.03,
      why: 'ΔT = V²/(2cp) = 62 500/2010 = 31.1 K. An airliner\'s outside-air-temperature probe must correct for this ram rise.' }
  ],
  problems: [
    { q: 'Treating air as an ideal gas, what mass of air is in a 10 L tank at 200 bar (absolute) and 20 °C?', answer: 2.38, unit: 'kg', tol: 0.02,
      steps: ['$m = pV/(RT) = 2.0\\times10^{7} \\times 0.010/(287.05 \\times 293.15)$.', '$= 2.38$ kg. (At 200 bar real air deviates from the ideal gas by a few per cent.)'] }
  ],
  applications: [
    'The standard atmosphere: density at every height from pressure and temperature.',
    'Compressors, turbines and jet engines, where adiabatic compression and expansion set temperatures and work.',
    'Meteorology: rising air cools adiabatically, forming clouds and setting the atmosphere\'s stability.',
    'Temperature probes on fast aircraft, which read the stagnation temperature and must be corrected to the static one.'
  ],
  history: 'Robert Boyle found in 1662 that a trapped gas halves its volume when the pressure doubles; Jacques Charles (about 1787) and Joseph Louis Gay-Lussac (1802) added the effect of temperature; and Émile Clapeyron combined them into one law in 1834. In 1816 Pierre-Simon Laplace realised that the quick squeezes of a sound wave are adiabatic, adding the factor γ to Newton\'s speed of sound — the first great success of the idea.',
  sim: ['basics-balloon', 'basics-sound-race']
},

{
  id: 'speed-of-sound', parent: 'air-properties', title: 'The speed of sound', level: 2,
  short: 'Sound is a small pressure disturbance that travels through air at a = √(γRT): 340 m/s at 15 °C, 295 m/s at airliner cruising height. It depends on temperature, not on pressure — and it is the speed at which the air ahead of a moving body can be warned that the body is coming.',
  keywords: ['speed of sound', 'sonic speed', 'a', 'sqrt(gamma R T)', 'temperature', 'Newton', 'Laplace', 'helium', 'pressure wave', 'acoustic', '661 knots', 'sound barrier', 'bulk modulus'],
  prereq: ['ideal-gas-air', 'physics:speed-of-sound', 'physics:sound-waves'],
  related: ['mach-number', 'compressibility', 'mach-cone', 'sonic-boom', 'isa', 'critical-mach', 'normal-shock', 'wave-drag', 'physics:doppler-effect', 'physics:shock-waves'],
  body: `
Clap your hands and you squeeze a thin layer of air; it pushes on the next layer, which pushes on the next, and a small pressure pulse runs outwards while the air itself only jiggles back and forth. The speed of that pulse is the **speed of sound** $a$. It is set by how stiff the air is against sudden squeezing and how much mass has to be moved:

$$a = \\sqrt{\\frac{\\gamma p}{\\rho}} = \\sqrt{\\gamma R T}$$

For air ($\\gamma = 1.4$, $R = 287$ J/(kg·K)) at 15 °C this gives **340.3 m/s** — 1225 km/h, 661 knots.

### Temperature only
Because $p/\\rho = RT$ for an [[ideal-gas-air|ideal gas]], pressure and density cancel: at a given temperature, sound runs as fast through thin air as through thick. Only the temperature matters, through its square root — near room temperature $a \\approx 331.3 + 0.6\\,\\theta$ m/s with $\\theta$ in °C.

| Air temperature | Where | $a$ (m/s) | km/h | knots |
|---|---|---|---|---|
| −56.5 °C | ISA 11–20 km (airliners, Concorde) | 295.1 | 1062 | 574 |
| −20 °C | a winter day | 319.0 | 1148 | 620 |
| 0 °C | | 331.3 | 1193 | 644 |
| 15 °C | ISA sea level | 340.3 | 1225 | 661 |
| 20 °C | a room | 343.2 | 1236 | 667 |
| 40 °C | a desert afternoon | 354.8 | 1277 | 690 |

The speed of sound is a molecular speed in disguise: the molecules carry the disturbance as they collide, and $a$ is about three quarters of their average speed (459 m/s in air at 15 °C). Light molecules move faster, so sound is much quicker in helium or hydrogen and slower in heavy gases:

| Gas at 20 °C | $\\gamma$ | Molar mass (g/mol) | $a$ (m/s) |
|---|---|---|---|
| Hydrogen | 1.41 | 2.0 | 1300 |
| Helium | 1.67 | 4.0 | 1007 |
| Methane | 1.30 | 16.0 | 446 |
| Air | 1.40 | 29.0 | 343 |
| Carbon dioxide | 1.29 | 44.0 | 267 |
| Sulfur hexafluoride | 1.10 | 146 | 135 |
| (Water, a liquid) | | | 1482 |

### Sound up high
In the [[isa|standard atmosphere]] the temperature falls by 6.5 °C per kilometre up to 11 km, so the speed of sound falls from 340 to 295 m/s, then stays constant through the cold lower stratosphere to 20 km. An airliner cruising at a [[mach-number|Mach number]] of 0.82 at 11 000 m flies at 242 m/s (470 knots) true airspeed; the same Mach number at sea level would be 279 m/s.

### Why aerodynamics cares
Sound is how the air ahead of a moving body learns that the body is coming. At low speed the pressure signals race far ahead and the air moves aside smoothly and early. As the body approaches $a$ the signals can no longer get ahead: the air piles up into [[normal-shock|shock waves]], drag climbs ([[wave-drag]]), and at supersonic speed the body drags a [[mach-cone|Mach cone]] behind it that reaches the ground as a [[sonic-boom|sonic boom]]. The ratio $V/a$ — the Mach number — measures all of this.

> [!history] Newton calculated the speed of sound in 1687 assuming that air keeps its temperature as it is squeezed, and got about 290 m/s — some 15 % too low, a discrepancy that puzzled physicists for over a century. In 1816 Laplace saw the error: the squeezes are too quick for heat to flow, so the air is stiffer by the factor $\\gamma$, and $\\sqrt{1.4} = 1.18$ closed the gap.
`,
  ideas: [
    'The speed of sound in a gas is a = √(γp/ρ) = √(γRT): 340 m/s at 15 °C, 295 m/s at −56.5 °C.',
    'At a given temperature it does not depend on pressure or density; it grows with the square root of absolute temperature.',
    'It is about three quarters of the mean molecular speed, so light gases carry sound fastest.',
    'It is the speed at which pressure signals travel ahead of a body; near and above it the air is compressed into shocks.'
  ],
  pitfalls: [
    'Sound travels faster in denser air — At a fixed temperature the density makes no difference; among gases, the heavier (denser) ones carry sound more slowly.',
    'The speed of sound is 343 m/s — Only at 20 °C: 295 m/s at airliner cruising height, 355 m/s on a 40 °C afternoon.',
    'Breathing helium makes the vocal cords vibrate faster — The pitch set by the vocal folds hardly changes; the resonances of the throat and mouth move up because sound crosses them faster, which changes the tone colour.'
  ],
  formulas: [
    {
      name: 'Speed of sound in air',
      expr: 'a = sqrt(gamma*Rair*T)', tex: 'a = \\sqrt{\\gamma\\, R_\\text{air}\\, T}',
      vars: {
        a: { name: 'speed of sound', q: 'speed', unit: 'm/s' },
        gamma: { name: 'ratio of specific heats', value: 1.4, min: 1.01, max: 1.7, tex: '\\gamma' },
        Rair: { const: 'Rair' },
        T: { name: 'air temperature', q: 'temperature', unit: '°C', value: 15, min: -100, max: 200 }
      },
      note: 'For dry air as an ideal gas. Humidity raises a slightly (by up to about 0.5 %).',
      practice: { unknowns: ['a', 'T'] },
      stories: {
        a: 'What is the speed of sound in air at {T}?',
        T: 'Sound is measured travelling at {a} through air. What is the air temperature?'
      }
    },
    {
      name: 'Speed of sound in any ideal gas',
      expr: 'a = sqrt(gamma*R*T/Mm)', tex: 'a = \\sqrt{\\dfrac{\\gamma R T}{M}}',
      vars: {
        a: { name: 'speed of sound', q: 'speed', unit: 'm/s' },
        gamma: { name: 'ratio of specific heats', value: 1.667, min: 1.01, max: 1.7, tex: '\\gamma' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 20, min: -200, max: 1000 },
        Mm: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 4.003, tex: 'M' }
      },
      note: 'Helium: γ = 5/3, M = 4.00 g/mol. Hydrogen: 1.41, 2.02. Carbon dioxide: 1.29, 44.0.',
      practice: { unknowns: ['a', 'Mm'] },
      stories: {
        a: 'A gas with γ = {gamma} and a molar mass of {Mm} is at {T}. How fast does sound travel in it?',
        Mm: 'Sound travels at {a} in a gas with γ = {gamma} at {T}. What is the molar mass of the gas?'
      }
    },
    {
      name: 'Speed of sound from stiffness and density',
      expr: 'a = sqrt(K/rho)', tex: 'a = \\sqrt{\\dfrac{K}{\\rho}}',
      vars: {
        a: { name: 'speed of sound', q: 'speed', unit: 'm/s' },
        K: { name: 'bulk modulus (stiffness against squeezing)', q: 'pressure', unit: 'GPa', value: 2.2 },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 998, tex: '\\rho' }
      },
      note: 'The Newton–Laplace form, for any fluid. Water: K ≈ 2.2 GPa. For a gas squeezed adiabatically K = γp — 142 kPa for air at sea level.',
      stories: { a: 'A liquid has a bulk modulus of {K} and a density of {rho}. What is the speed of sound in it?', K: 'Sound travels at {a} in a liquid of density {rho}. What is its bulk modulus?' }
    },
    {
      name: 'Distance from the delay of a sound',
      expr: 'd = a*t', tex: 'd = a\\, t',
      vars: {
        d: { name: 'distance', q: 'length', unit: 'km' },
        a: { name: 'speed of sound', q: 'speed', unit: 'm/s', value: 343 },
        t: { name: 'delay between flash and sound', q: 'time', unit: 's', value: 3 }
      },
      note: 'Light arrives almost at once, so the delay is the travel time of the sound: about 3 s per kilometre.',
      stories: { d: 'Thunder arrives {t} after the lightning, with sound travelling at {a}. How far away was the strike?', t: 'A storm is {d} away and sound travels at {a}. How long after the flash does the thunder arrive?' }
    }
  ],
  examples: [
    {
      title: 'Sound at cruising height',
      q: 'Find the speed of sound at 11 000 m in the standard atmosphere (−56.5 °C), and the true airspeed of an airliner cruising there at Mach 0.82.',
      steps: [
        '$T = 273.15 - 56.5 = 216.65$ K.',
        '$a = \\sqrt{1.4 \\times 287.05 \\times 216.65} = \\sqrt{87\\,070} = 295.1$ m/s.',
        '$V = M a = 0.82 \\times 295.1 = 242$ m/s = 470 knots.'
      ],
      a: 'a = 295 m/s; the airliner flies at 242 m/s (470 kt) true airspeed.'
    },
    {
      title: 'Newton\'s mistake',
      q: 'Newton assumed the air keeps its temperature as a sound wave squeezes it, so $a = \\sqrt{p/\\rho}$. What did that give at sea level (101 325 Pa, 1.225 kg/m³), and what does the adiabatic formula give?',
      steps: [
        'Isothermal: $a = \\sqrt{101\\,325/1.225} = 287.6$ m/s.',
        'Adiabatic: $a = \\sqrt{1.4 \\times 101\\,325/1.225} = 340.3$ m/s.',
        'The ratio is $\\sqrt{1.4} = 1.183$: Newton\'s value was 15 % low.'
      ],
      a: '288 m/s isothermal against 340 m/s adiabatic — the measured value.'
    },
    {
      title: 'The helium voice',
      q: 'The resonances of the vocal tract are fixed by its length and the speed of sound in it. By what factor do they rise when the tract is filled with helium instead of air, at the same temperature (20 °C)?',
      steps: [
        'Helium: $a = \\sqrt{1.667 \\times 8.314 \\times 293.15/0.004\\,003} = 1007$ m/s. Air: 343 m/s.',
        'Resonant frequencies scale with $a$: $1007/343 = 2.9$.',
        'In practice the lungs hold a mixture of helium and air, so the shift is smaller — but large enough to make the voice sound thin and cartoonish, though its pitch is almost unchanged.'
      ],
      a: 'Up to about 2.9 times higher resonances.'
    }
  ],
  quiz: [
    { q: 'At a given temperature, sound travels at the same speed in the thin air at 5000 m as in the dense air at sea level.', a: true,
      why: 'a = √(γp/ρ), and p/ρ = RT depends on temperature only. It is the colder temperature up high, not the thinner air, that slows sound there.' },
    { q: 'On a hot day an aircraft flies at the same true airspeed as on a cold day. Its Mach number is…', choices: ['higher on the hot day', 'lower on the hot day', 'the same', 'higher on the hot day only at altitude'], a: 1,
      why: 'Hot air has a higher speed of sound, so the same speed is a smaller fraction of it: M = V/a falls.' },
    { q: 'What is the speed of sound in air at −40 °C, in m/s?', answer: 306.1, unit: 'm/s', tol: 0.02,
      why: 'a = √(1.4 × 287.05 × 233.15) = √93 700 = 306 m/s.' },
    { q: 'Sound travels faster at the summit of Everest than at sea level because the air there is thinner.', a: false,
      why: 'Density does not matter at a given temperature, and the summit is colder (about −42 °C in the ISA), so sound is slower there: about 304 m/s.' },
    { q: 'Why is sound almost three times faster in helium than in air?', choices: ['Helium is at a higher pressure in a balloon', 'Its atoms are seven times lighter than air molecules and move faster; its larger γ adds a little', 'Helium is warmer', 'Sound travels through helium as light does'], a: 1,
      why: 'a = √(γRT/M): M falls from 29 to 4 g/mol (√7.2 = 2.7) and γ rises from 1.4 to 1.67 (√1.19 = 1.09): 2.9 times in all.' }
  ],
  problems: [
    { q: 'Thunder arrives 6.0 s after the lightning on a 25 °C day. How far away was the strike?', answer: 2.08, unit: 'km', tol: 0.02,
      steps: ['$a = \\sqrt{1.4 \\times 287.05 \\times 298.15} = 346.1$ m/s.', '$d = a t = 346.1 \\times 6.0 = 2077$ m ≈ 2.1 km.'] },
    { q: 'A sonic anemometer measures sound crossing 0.15 m of still air in 0.433 ms. What is the air temperature, in °C?', answer: 25, unit: '°C', tol: 0.05,
      steps: ['$a = 0.15/0.000\\,433 = 346.4$ m/s.', '$T = a^2/(\\gamma R) = 346.4^2/(1.4 \\times 287.05) = 298.6$ K ≈ 25 °C.'] }
  ],
  applications: [
    'Aircraft performance: Mach number, the machmeter and the speed limits of transonic aircraft all depend on the local speed of sound.',
    'Sonic anemometers and acoustic thermometers, which measure wind and temperature from the travel time of sound.',
    'Ranging: estimating the distance of lightning, and echo-sounding (in water, at 1480 m/s).',
    'Gas analysis: the speed of sound tells the helium content of a diver\'s breathing mix.'
  ],
  history: 'In the seventeenth century Marin Mersenne and others timed the flash and the bang of guns fired kilometres away, and by the eighteenth century cannon trials had the speed of sound in air to within about a per cent. The theory took longer: Newton\'s isothermal estimate of 1687 was 15 % short until Laplace\'s adiabatic correction of 1816.',
  sim: ['basics-sound-race', 'basics-speed-altitude']
},

/* ================================================================ DIMENSIONLESS NUMBERS */
{
  id: 'dimensional-analysis', parent: 'similarity', title: 'Dimensional analysis', level: 2,
  short: 'Every physical law must balance in its dimensions — mass, length, time, temperature. That alone can reveal the form of a law, and the Buckingham Π theorem shrinks a problem with n quantities to n − k dimensionless groups: the drag of a sphere becomes C_D = f(Re).',
  keywords: ['dimensional analysis', 'dimensions', 'Buckingham Pi theorem', 'dimensionless group', 'Pi group', 'similarity', 'scaling', 'Rayleigh method', 'MLT', 'units', 'G. I. Taylor'],
  prereq: ['math:exponents', 'math:systems-of-equations', 'physics:newtons-second-law'],
  related: ['reynolds-number', 'mach-number', 'force-coefficients', 'strouhal-froude', 'similarity-testing', 'wind-tunnel', 'dynamic-pressure', 'math:scaling-laws'],
  body: `
A formula in physics is a statement about quantities, not numbers: both sides must be the same *kind* of thing. Force is mass × length ÷ time², written $[F] = \\mathrm{M\\,L\\,T^{-2}}$, and anything that equals a force must have those dimensions too. The bookkeeping is so strict that it can find the shape of a law before any physics is done.

### A pendulum without physics
Suppose the period $t$ of a pendulum could depend on its length $L$, on gravity $g$ and on the mass $m$ of the bob. Try $t = C\\,L^a g^b m^c$ and match the dimensions of both sides: $\\mathrm{T^1} = \\mathrm{L}^a\\,(\\mathrm{L\\,T^{-2}})^b\\,\\mathrm{M}^c$. Mass: $c = 0$. Time: $-2b = 1$, so $b = -\\tfrac12$. Length: $a + b = 0$, so $a = \\tfrac12$:

$$t = C\\sqrt{L/g}$$

The mass cannot appear — nothing else in the list carries kilograms to cancel them. Dimensional analysis cannot give the constant $C$ (it is $2\\pi$ for small swings) or tell how it changes with the size of the swing, an angle and so dimensionless; but it has found the square root and ruled out the mass.

### The Π theorem
Edgar Buckingham's rule (1914): if a problem involves $n$ quantities built from $k$ independent dimensions, the physics can always be written as a relation between $n - k$ **dimensionless groups** $\\Pi_1, \\Pi_2, \\ldots$

Take the drag $F$ on a sphere. It can depend on the air's density $\\rho$ and viscosity $\\mu$, the speed $V$ and the diameter $D$: five quantities, three dimensions (M, L, T), so two groups:

$$\\frac{F}{\\rho V^2 D^2} = f\\!\\left(\\frac{\\rho V D}{\\mu}\\right) \\quad\\Longleftrightarrow\\quad C_D = f(\\mathrm{Re})$$

The first group is a [[force-coefficients|force coefficient]], the second the [[reynolds-number|Reynolds number]]. Add the speed of sound $a$ and a third group appears, the [[mach-number|Mach number]] $V/a$; add gravity for a ship at the surface and you get the [[strouhal-froude|Froude number]].

| Quantity | Dimensions | Quantity | Dimensions |
|---|---|---|---|
| Speed | L T⁻¹ | Density | M L⁻³ |
| Force | M L T⁻² | Pressure, stress | M L⁻¹ T⁻² |
| Energy | M L² T⁻² | Power | M L² T⁻³ |
| Dynamic viscosity $\\mu$ | M L⁻¹ T⁻¹ | Kinematic viscosity $\\nu$ | L² T⁻¹ |
| Frequency | T⁻¹ | Angle, strain, any ratio | none |

### Why it matters
The saving is enormous. Measuring how the drag of a sphere depends on four quantities, ten values of each, would take $10^4$ experiments; one curve of $C_D$ against Re, ten points long, contains them all. And the groups say which tests are equivalent: a model in a [[wind-tunnel|wind tunnel]] predicts the full-size aircraft exactly when every group matches — **similarity** (see [[similarity-testing]]). In practice not all can be matched at once, and choosing which to match is the art of testing.

> [!warn] Dimensional analysis is only as good as the list of quantities. Leave out one that matters (surface roughness, the speed of sound, a free surface) and the result is confidently wrong; put in one that does not matter and you get a harmless extra group that experiment shows has no effect.
`,
  ideas: [
    'Every term of a physical equation has the same dimensions (M, L, T, Θ); a quantity that nothing else can cancel cannot appear.',
    'Buckingham\'s Π theorem: n quantities with k independent dimensions give n − k dimensionless groups.',
    'Drag of a body: C_D = f(Re) at low speed, f(Re, M) when compressibility matters, f(Re, Fr) for a ship.',
    'Dimensional analysis gives the form of a law but not its constants or its function; those come from theory or experiment.',
    'Flows with the same dimensionless groups are similar: a model predicts the full-size object.'
  ],
  pitfalls: [
    'Dimensional analysis proves the formula — It gives the combination of quantities, not the number in front (2π for a pendulum) nor the shape of the function f; those need theory or measurement.',
    'Any list of quantities will do — The result depends on the list: leave out a quantity that matters and the answer is wrong, however neat it looks.',
    'Dimensionless means unimportant — Reynolds, Mach and Froude numbers are dimensionless and decide the whole character of a flow.'
  ],
  formulas: [
    {
      name: 'Number of dimensionless groups (Buckingham)',
      expr: 'NP = n - k', tex: 'N_\\Pi = n - k',
      vars: {
        NP: { name: 'number of dimensionless groups', int: true, tex: 'N_\\Pi' },
        n: { name: 'number of quantities in the problem', int: true, value: 5 },
        k: { name: 'number of independent dimensions', int: true, value: 3 }
      },
      note: 'k is usually 3 (M, L, T) in mechanics, 4 when temperature enters. More precisely it is the rank of the matrix of dimensions.',
      stories: { NP: 'A problem involves {n} quantities built from {k} independent dimensions. How many dimensionless groups describe it?', n: 'A problem has {NP} dimensionless groups and {k} independent dimensions. How many quantities does it involve?' }
    },
    {
      name: 'Pendulum period from dimensional analysis',
      expr: 't = C*sqrt(L/g)', tex: 't = C\\sqrt{\\dfrac{L}{g}}',
      vars: {
        t: { name: 'period', q: 'time', unit: 's' },
        C: { name: 'dimensionless constant (2π for small swings)', value: 6.2832 },
        L: { name: 'length of the pendulum', q: 'length', unit: 'm', value: 1 },
        g: { const: 'g' }
      },
      note: 'Dimensional analysis gives √(L/g); the constant C = 2π comes from solving the equation of motion (see the simple pendulum in physics).',
      practice: { unknowns: ['t', 'L'] },
      stories: { t: 'A pendulum is {L} long, with C = {C}. What is its period?', L: 'How long must a pendulum be to have a period of {t} (C = {C})?' }
    },
    {
      name: 'Speed of deep-water waves',
      expr: 'c = C*sqrt(g*lam)', tex: 'c = C\\sqrt{g\\,\\lambda}',
      vars: {
        c: { name: 'wave speed', q: 'speed', unit: 'm/s' },
        C: { name: 'dimensionless constant (1/√(2π) ≈ 0.399)', value: 0.3989 },
        g: { const: 'g' },
        lam: { name: 'wavelength', q: 'length', unit: 'm', value: 100, tex: '\\lambda' }
      },
      note: 'If a deep-water wave can depend only on g and its wavelength λ, dimensions force c ∝ √(gλ); water-wave theory supplies C = 1/√(2π).',
      practice: { unknowns: ['c', 'lam'] },
      stories: { c: 'Ocean swell has a wavelength of {lam}. With C = {C}, how fast does it travel?', lam: 'Swell travels at {c}. With C = {C}, what is its wavelength?' }
    }
  ],
  examples: [
    {
      title: 'The drag of a sphere, step by step',
      q: 'Find the dimensionless groups for the drag $F$ on a sphere that depends on $\\rho$, $V$, $D$ and $\\mu$.',
      steps: [
        'Five quantities, three dimensions (M, L, T): two groups. Choose $\\rho$, $V$, $D$ as the "repeating" quantities — together they contain M, L and T.',
        'First group $F\\rho^a V^b D^c$: mass $1 + a = 0$, so $a = -1$; time $-2 - b = 0$, so $b = -2$; length $1 - 3a + b + c = 0$, so $c = -2$. $\\Pi_1 = F/(\\rho V^2 D^2)$.',
        'Second group $\\mu\\rho^a V^b D^c$: mass $a = -1$; time $b = -1$; length $-1 + 3 - 1 + c = 0$, so $c = -1$. $\\Pi_2 = \\mu/(\\rho V D) = 1/\\mathrm{Re}$.',
        'So $F/(\\rho V^2 D^2) = f(\\mathrm{Re})$ — equivalently $C_D = f(\\mathrm{Re})$, since constants like $\\tfrac12$ and $\\pi/4$ can be absorbed.'
      ],
      a: 'C_D = f(Re): one curve describes the drag of every smooth sphere in every fluid.'
    },
    {
      title: 'The energy of a blast from a photograph',
      q: 'After a very large explosion, the radius $R$ of the fireball depends only on the energy released $E$, the time $t$ and the air density $\\rho$. A photograph shows $R = 130$ m at $t = 25$ ms. Estimate $E$.',
      steps: [
        'Four quantities, three dimensions: one group, $\\Pi = R^5\\rho/(E t^2)$. So $R = C\\,(E t^2/\\rho)^{1/5}$ with $C$ close to 1 for air.',
        'Taking $C = 1$: $E = \\rho R^5/t^2 = 1.2 \\times 130^5/0.025^2 = 1.2 \\times 3.71\\times10^{10}/6.25\\times10^{-4}$.',
        '$E \\approx 7\\times10^{13}$ J — the energy of about 17 000 tonnes of TNT.'
      ],
      a: 'About 7 × 10¹³ J — G. I. Taylor\'s famous estimate of 1950, made from published photographs alone.'
    }
  ],
  quiz: [
    { q: 'The drag F on a car depends on ρ, V, its length L, the air\'s viscosity μ and the speed of sound a. How many dimensionless groups describe it?', choices: ['2', '3', '5', '6'], a: 1,
      why: 'Six quantities (F, ρ, V, L, μ, a), three dimensions: 6 − 3 = 3 groups — C_D, Re and M.' },
    { q: 'What are the dimensions of dynamic viscosity μ?', choices: ['L² T⁻¹', 'M L⁻¹ T⁻¹', 'M L T⁻²', 'M L⁻³'], a: 1,
      why: 'τ = μ du/dy: stress (M L⁻¹ T⁻²) divided by a rate of shear (T⁻¹) gives M L⁻¹ T⁻¹. L² T⁻¹ is the kinematic viscosity μ/ρ.' },
    { q: 'Dimensional analysis shows that a pendulum\'s period is exactly 2π√(L/g).', a: false,
      why: 'It shows only that the period is proportional to √(L/g). The 2π comes from solving the equation of motion.' },
    { q: 'Why can the mass of the bob not appear in a pendulum\'s period?', choices: ['Because heavy and light objects fall alike', 'Because no other quantity in the list contains mass, so its kilograms could not cancel', 'Because the string is massless', 'Because mass is dimensionless'], a: 1,
      why: 'Among t, L and g only m contains M; any power of m would leave kilograms in a quantity that must be a pure time.' },
    { q: 'Which combination is dimensionless?', choices: ['ρV²/μ', 'ρVL/μ', 'μV/L', 'ρVL'], a: 1,
      why: 'ρVL/μ: (M L⁻³)(L T⁻¹)(L)/(M L⁻¹ T⁻¹) = 1 — the Reynolds number.' }
  ],
  problems: [
    { q: 'By what factor is the period of a pendulum longer on the Moon (g = 1.62 m/s²) than on Earth (9.81 m/s²), for the same length?', answer: 2.46, tol: 0.02,
      steps: ['$t \\propto \\sqrt{L/g}$, so at equal $L$ the ratio is $\\sqrt{9.81/1.62}$.', '$= \\sqrt{6.06} = 2.46$ — the unknown constant cancels, which is why dimensional analysis alone answers a ratio like this.'] }
  ],
  applications: [
    'Planning wind-tunnel and towing-tank tests so that model results scale to the full-size vehicle.',
    'Presenting data compactly: one C_D–Re curve instead of thousands of force measurements.',
    'Checking equations: a formula whose terms have different dimensions is wrong.',
    'Quick estimates: blast waves, wave speeds, the power of animals and machines from scaling laws.'
  ],
  history: 'Lord Rayleigh used the "method of dimensions" for problems from the colour of the sky to the pitch of Aeolian tones in the 1870s–1910s, and Edgar Buckingham stated the Π theorem in 1914. Its most famous use came in 1950, when G. I. Taylor estimated the energy of the first nuclear explosion from a sequence of published photographs of its fireball, using exactly the argument in the example above — to the discomfort of the authorities, for whom the figure was secret.',
  sim: 'basics-dimensional'
},

{
  id: 'dynamic-pressure', parent: 'similarity', title: 'Dynamic pressure', level: 1,
  short: 'Dynamic pressure q = ½ρV² is the kinetic energy of a cubic metre of moving air — and the rise in pressure when that air is brought to rest. Every aerodynamic force and pressure scales with it, F = C·q·S, and it grows with the square of the speed.',
  keywords: ['dynamic pressure', 'q', 'half rho V squared', 'stagnation pressure', 'total pressure', 'pitot', 'equivalent airspeed', 'EAS', 'max q', 'kinetic energy per volume', 'wind pressure', 'manometer'],
  prereq: ['air-density', 'air-pressure', 'physics:kinetic-energy', 'physics:bernoullis-equation'],
  related: ['lift-equation', 'drag-equation', 'force-coefficients', 'pressure-coefficient', 'stagnation-point', 'pitot-tube', 'airspeeds', 'bernoulli', 'mach-number', 'wind-loads'],
  body: `
A cubic metre of air moving at speed $V$ carries a kinetic energy of $\\tfrac12 m V^2 = \\tfrac12\\rho V^2$ joules — and a joule per cubic metre is a pascal. That quantity is the **dynamic pressure**:

$$q = \\tfrac12\\,\\rho V^2$$

It is the most useful single number in aerodynamics, because it is the natural *scale* of every pressure and every force that moving air can exert.

### The pressure of stopping air
Point a tube straight into the wind. The air arriving at its mouth has to stop, and as it slows its pressure rises — by exactly $q$, according to [[bernoulli|Bernoulli's equation]] (at low Mach number). The pressure at the mouth, the **total** or **stagnation pressure**, is

$$p_0 = p + \\tfrac12\\rho V^2$$

A [[pitot-tube|pitot-static tube]] measures $p_0 - p$, and so measures $q$. Every blunt nose, every leading edge and the front of every car has a [[stagnation-point|stagnation point]] where this full pressure acts.

### The yardstick of forces
Dimensional analysis says that any aerodynamic force is $F = C\\,q\\,S$: dynamic pressure, times a reference area, times a dimensionless [[force-coefficients|coefficient]] that holds the shape. [[lift-equation|Lift]], [[drag-equation|drag]], downforce, the wind load on a wall — all follow this pattern. Pressures around a body scale the same way: from $p + q$ at the stagnation point down to $p - q$ or lower over the shoulders of a car or a cylinder, and $p - 3q$ or more in the suction peak near the nose of a wing at a high angle of attack. The ratio $(p - p_\\infty)/q$ is the [[pressure-coefficient|pressure coefficient]].

Because of the square, speed rules: going from 100 to 130 km/h raises $q$ — and with it the drag — by 69 %.

### A table of dynamic pressures

| Situation | Fluid | Speed | $q$ |
|---|---|---|---|
| Brisk walk | air | 1.5 m/s | 1.4 Pa |
| Fresh breeze (Beaufort 5) | air | 10 m/s | 61 Pa |
| Racing cyclist | air | 13 m/s (47 km/h) | 104 Pa |
| Car on a motorway | air | 33 m/s (120 km/h) | 680 Pa |
| Hurricane wind | air | 50 m/s | 1.5 kPa |
| Light aircraft cruising at 2400 m | air | 63 m/s | 1.9 kPa |
| Airliner approaching to land | air | 72 m/s (140 kt) | 3.2 kPa |
| Formula 1 car on a straight | air | 92 m/s (330 km/h) | 5.1 kPa |
| Airliner cruising at M 0.82, 11 000 m | air | 242 m/s | 10.7 kPa |
| Concorde cruising at M 2.0, 17 000 m | air | 590 m/s | 25 kPa |
| Space launcher at "max q" | air | ≈ 450 m/s at ≈ 12 km | ≈ 30–35 kPa |
| River current | water | 1 m/s | 0.5 kPa |
| Swimmer sprinting | water | 2 m/s | 2.0 kPa |
| Hydrofoil ferry | water | 20 m/s | 200 kPa |

Water is 815 times denser than air, so a swimmer at 2 m/s meets the same dynamic pressure as air at 57 m/s (205 km/h). That is why a boat's rudder or a hydrofoil can be so small compared with an aircraft's tail or wing.

### Height, and what the airspeed indicator shows
Up high the air is thin: an airliner at 11 000 m flies at 242 m/s true airspeed, yet its $q$ is that of sea-level air at 132 m/s. The airspeed indicator is a pressure gauge on $p_0 - p$ calibrated with sea-level density, so it shows (very nearly) this **equivalent airspeed** $V_E = V\\sqrt{\\rho/\\rho_0}$. Lift, drag and the stall all depend on $q$, so flying by indicated speed keeps the aircraft's handling the same at every height (see [[airspeeds]]). A launch vehicle meets the opposite trade: its speed rises fast while the air thins, so $q$ climbs to a maximum — **max q**, typically about a minute after liftoff — and then falls; the vehicle's structure is sized for that moment.

### When the air compresses
At higher Mach numbers the air brought to rest is compressed as well as slowed, and the true pressure rise $p_0 - p$ exceeds $q$:

| Mach number | 0.3 | 0.5 | 0.7 | 0.85 | 1.0 |
|---|---|---|---|---|---|
| $(p_0 - p)/q$ | 1.023 | 1.064 | 1.129 | 1.194 | 1.276 |

$q$ itself stays defined as $\\tfrac12\\rho V^2$. With $\\rho = p/(RT)$ and $a^2 = \\gamma RT$ it can also be written $q = \\tfrac12\\gamma p M^2$ — handy at altitude, where the static pressure and the [[mach-number|Mach number]] are what the instruments know.

> [!key] $q$ converts coefficients into forces. Know $q$ and a coefficient and you know the force, whatever the size, speed or height.

> [!warn] Speeds and loads here are rounded examples. Airspeed and structural limits of real aircraft come from their approved flight manuals.
`,
  ideas: [
    'q = ½ρV² is the kinetic energy per unit volume of the flow, measured in pascals.',
    'Stopping the air at a stagnation point raises its pressure by q: p₀ = p + q at low Mach number.',
    'Every aerodynamic force is F = C q S and every pressure difference scales with q.',
    'q grows with V²: 30 % more speed means 69 % more force.',
    'The airspeed indicator measures q and shows it as equivalent airspeed; at high Mach number the pitot rise exceeds q.'
  ],
  pitfalls: [
    'Dynamic pressure is a pressure you could measure with a barometer in the moving air — A probe moving with the air feels only the static pressure; q appears only when the air is brought to rest (or as the difference p₀ − p).',
    'Double the speed, double the force — Forces scale with q, which quadruples when the speed doubles.',
    'The airspeed indicator shows the true speed — It measures q and assumes sea-level density; at 11 000 m it reads little more than half the true airspeed.'
  ],
  formulas: [
    {
      name: 'Dynamic pressure',
      expr: 'q = 0.5*rho*V^2', tex: 'q = \\tfrac{1}{2}\\,\\rho V^2',
      vars: {
        q: { name: 'dynamic pressure', q: 'pressure', unit: 'Pa' },
        rho: { name: 'fluid density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'flow speed', q: 'speed', unit: 'km/h', value: 120 }
      },
      note: 'Air at ISA sea level: 1.225 kg/m³; water: about 1000 kg/m³. At low Mach number this is the pressure rise at a stagnation point.',
      practice: { unknowns: ['q', 'V'] },
      stories: {
        q: 'What is the dynamic pressure of a fluid of density {rho} moving at {V}?',
        V: 'A pitot tube in a fluid of density {rho} measures a dynamic pressure of {q}. How fast is the flow?',
        rho: 'A flow at {V} has a dynamic pressure of {q}. What is the density of the fluid?'
      }
    },
    {
      name: 'Dynamic pressure from Mach number',
      expr: 'q = 0.5*gamma*p*M^2', tex: 'q = \\tfrac{1}{2}\\,\\gamma\\, p\\, M^2',
      vars: {
        q: { name: 'dynamic pressure', q: 'pressure', unit: 'kPa' },
        gamma: { name: 'ratio of specific heats', value: 1.4, min: 1.01, max: 1.7, tex: '\\gamma' },
        p: { name: 'static pressure (absolute)', q: 'pressure', unit: 'hPa', value: 226.3 },
        M: { name: 'Mach number', value: 0.82, min: 0, max: 30 }
      },
      note: 'Exactly the same q = ½ρV², rewritten with ρ = p/(RT) and a² = γRT. 226.3 hPa is the ISA pressure at 11 000 m.',
      practice: { unknowns: ['q', 'M'] },
      stories: {
        q: 'An aircraft flies at Mach {M} where the static pressure is {p}. What is its dynamic pressure?',
        M: 'At a static pressure of {p}, what Mach number gives a dynamic pressure of {q}?'
      }
    },
    {
      name: 'Equivalent airspeed',
      expr: 'VE = V*sqrt(rho/rhoSL)', tex: 'V_E = V\\sqrt{\\dfrac{\\rho}{\\rho_0}}',
      vars: {
        VE: { name: 'equivalent airspeed', q: 'speed', unit: 'kt', tex: 'V_E' },
        V: { name: 'true airspeed', q: 'speed', unit: 'kt', value: 470 },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 0.3639, tex: '\\rho' },
        rhoSL: { const: 'rhoSL' }
      },
      note: 'The sea-level speed with the same dynamic pressure. The indicated airspeed equals it apart from instrument, position and compressibility corrections.',
      practice: { unknowns: ['VE', 'V'] },
      stories: {
        VE: 'An airliner flies at {V} true airspeed where the air density is {rho}. What is its equivalent airspeed?',
        V: 'An aircraft holds an equivalent airspeed of {VE} in air of density {rho}. What is its true airspeed?'
      }
    },
    {
      name: 'Water column of a manometer',
      expr: 'h = q/(rhoW*g)', tex: 'h = \\dfrac{q}{\\rho_w\\, g}',
      vars: {
        h: { name: 'height difference of the water columns', q: 'length', unit: 'mm' },
        q: { name: 'dynamic pressure', q: 'pressure', unit: 'Pa', value: 680 },
        rhoW: { const: 'rhoW' },
        g: { const: 'g' }
      },
      note: 'A U-tube connected to the total and static holes of a pitot-static tube. 1 kPa is about 102 mm of water.',
      stories: { h: 'A pitot-static tube reads a dynamic pressure of {q}. How far apart are the water levels in its U-tube manometer?', q: 'The water levels of a manometer differ by {h}. What dynamic pressure does that indicate?' }
    }
  ],
  examples: [
    {
      title: 'A hand out of a car window',
      q: 'At 120 km/h you hold your flat hand (about 0.015 m²) face-on to the wind. With a drag coefficient of about 1.2, what force do you feel?',
      steps: [
        '$V = 120/3.6 = 33.3$ m/s, so $q = \\tfrac12 \\times 1.225 \\times 33.3^2 = 680$ Pa.',
        '$F = C_D\\,q\\,A = 1.2 \\times 680 \\times 0.015 = 12$ N — the weight of 1.2 kg.',
        'At 60 km/h the force would be a quarter of that, 3 N.'
      ],
      a: 'About 12 N.'
    },
    {
      title: 'A swimmer and an aircraft',
      q: 'A swimmer moves at 2 m/s through water of density 998 kg/m³. At what speed must sea-level air move to have the same dynamic pressure?',
      steps: [
        'Swimmer: $q = \\tfrac12 \\times 998 \\times 2^2 = 1996$ Pa.',
        'Air: $V = \\sqrt{2q/\\rho} = \\sqrt{2 \\times 1996/1.225} = 57$ m/s (205 km/h).'
      ],
      a: '57 m/s — the same q as an aircraft taking off.'
    },
    {
      title: 'Cruise: q from the Mach number',
      q: 'An airliner cruises at Mach 0.82 at 11 000 m, where $p = 22\\,630$ Pa and $\\rho = 0.364\\ \\mathrm{kg/m^3}$. Find $q$ two ways, and the equivalent airspeed.',
      steps: [
        '$q = \\tfrac12\\gamma p M^2 = 0.7 \\times 22\\,630 \\times 0.82^2 = 10\\,650$ Pa.',
        'Check: $V = 0.82 \\times 295.1 = 242$ m/s and $\\tfrac12 \\times 0.364 \\times 242^2 = 10\\,660$ Pa.',
        '$V_E = \\sqrt{2q/\\rho_0} = \\sqrt{2 \\times 10\\,650/1.225} = 131.9$ m/s = 256 kt.'
      ],
      a: 'q ≈ 10.7 kPa; the airspeed indicator shows about 256 knots while the true airspeed is 470.'
    }
  ],
  quiz: [
    { q: 'To double the dynamic pressure at the same altitude, the speed must rise by a factor of…', choices: ['2', '√2 ≈ 1.41', '4', '1.2'], a: 1,
      why: 'q ∝ V², so V must grow by √2 for q to double.' },
    { q: 'What is the dynamic pressure of sea-level air (1.225 kg/m³) moving at 100 m/s, in pascals?', answer: 6125, unit: 'Pa', tol: 0.02,
      why: 'q = ½ × 1.225 × 100² = 6125 Pa — about 6 % of the atmospheric pressure.' },
    { q: 'Which has the larger dynamic pressure: water flowing at 1 m/s, or sea-level air at 25 m/s?', choices: ['The water: about 500 Pa against 383 Pa', 'The air, because it is faster', 'They are equal', 'They cannot be compared: different fluids'], a: 0,
      why: 'Water: ½ × 1000 × 1² = 500 Pa. Air: ½ × 1.225 × 25² = 383 Pa. Density matters as much as speed.' },
    { q: 'At 11 000 m an airspeed indicator shows the aircraft\'s true airspeed.', a: false,
      why: 'It measures the dynamic pressure and converts it with sea-level density, so it shows (nearly) the equivalent airspeed — about 55 % of the true airspeed at 11 000 m.' },
    { q: 'Why does a rocket\'s dynamic pressure pass through a maximum during its ascent?', choices: ['The engines are throttled back', 'Its speed keeps rising, but higher up the air density falls even faster, so ½ρV² first grows and then shrinks', 'The air gets warmer', 'The rocket gets lighter'], a: 1,
      why: 'Near the ground V² grows faster than ρ falls; later ρ falls faster than V² grows. The peak — max q — usually comes about a minute after liftoff, around 10–14 km.' }
  ],
  problems: [
    { q: 'A pitot-static tube in sea-level air (ρ = 1.225 kg/m³) reads p₀ − p = 1.20 kPa. What is the airspeed?', answer: 44.3, unit: 'm/s', tol: 0.02,
      steps: ['$V = \\sqrt{2(p_0 - p)/\\rho} = \\sqrt{2 \\times 1200/1.225}$.', '$= \\sqrt{1959} = 44.3$ m/s (160 km/h).'] },
    { q: 'What height difference does a water manometer show for a 50 m/s airflow at sea level?', answer: 156, unit: 'mm', tol: 0.02,
      steps: ['$q = \\tfrac12 \\times 1.225 \\times 50^2 = 1531$ Pa.', '$h = q/(\\rho_w g) = 1531/(1000 \\times 9.81) = 0.156$ m = 156 mm.'] }
  ],
  applications: [
    'Airspeed measurement with pitot-static systems, and the airspeed limits of aircraft, which are limits on q.',
    'Structural design: gust loads and control-surface hinge moments scale with q; launchers are designed for max q.',
    'Wind loading of buildings: design codes give a reference q and pressure coefficients for each face.',
    'Planning wind-tunnel tests: the balance loads and the tunnel power both follow from q.'
  ],
  history: 'In 1732 Henri Pitot lowered a bent glass tube into the Seine, its mouth facing the current, and saw the water inside rise above the river surface by an amount that grew with the square of the current\'s speed. Daniel Bernoulli\'s Hydrodynamica (1738) and Euler\'s equations of the 1750s supplied the theory: the rise is the kinetic energy of the water per unit volume.',
  sim: ['basics-pitot', 'basics-speed-altitude']
},

{
  id: 'force-coefficients', parent: 'similarity', title: 'Force and moment coefficients', level: 2,
  short: 'A force coefficient is an aerodynamic force divided by the dynamic pressure and a reference area, C = F/(qS). Lift, drag, side-force, moment and pressure coefficients describe a shape by pure numbers that hardly change with size or speed — as long as the Reynolds and Mach numbers match.',
  keywords: ['force coefficient', 'lift coefficient', 'drag coefficient', 'moment coefficient', 'pressure coefficient', 'CL', 'CD', 'Cm', 'Cp', 'reference area', 'drag area', 'CdA', 'frontal area', 'planform area', 'wetted area'],
  prereq: ['dynamic-pressure', 'dimensional-analysis', 'physics:torque'],
  related: ['lift-equation', 'drag-equation', 'pressure-coefficient', 'pitching-moment', 'drag-polar', 'reynolds-number', 'force-balance', 'wind-tunnel', 'vehicle-aerodynamics', 'bluff-bodies', 'streamlining', 'drag-crisis'],
  body: `
A wind-tunnel balance measures newtons, but newtons depend on the size of the model, the speed of the air and its density. Divide those out and what remains describes the *shape* alone:

$$C_F = \\frac{F}{q\\,S} = \\frac{F}{\\tfrac12\\rho V^2 S}$$

[[dimensional-analysis|Dimensional analysis]] guarantees that this works: $F/(\\rho V^2 L^2)$ can depend only on other dimensionless numbers — the attitude of the body and the [[reynolds-number|Reynolds]] and [[mach-number|Mach]] numbers — so a coefficient measured on a small model at low speed applies to the full-size vehicle at the same Re and M.

### The family
- **Lift** $C_L = L/(qS)$, perpendicular to the oncoming flow; **drag** $C_D = D/(qS)$, along it; **side force** $C_Y$.
- **Moments** need a length as well: the pitching moment $C_m = M/(qS\\bar c)$ uses the mean chord $\\bar c$; rolling and yawing moments $C_l$ and $C_n$ use the span $b$. A positive pitching moment raises the nose.
- **Pressure** at a point: $C_p = (p - p_\\infty)/q$. It is +1 at a low-speed stagnation point, 0 where the local speed equals the free stream, and negative where the air has sped up. Integrating $C_p$ round a body gives its pressure lift and drag (see [[pressure-coefficient]]).
- Two-dimensional airfoil sections use lower case — $c_l$, $c_d$, $c_m$ — per unit span, based on the chord.

### Which area?
A coefficient means nothing without its reference area, and different fields use different ones:

| Field | Reference area | Why |
|---|---|---|
| Aircraft and wings | wing planform area $S$, even for drag | lift and drag of the whole aircraft on one basis |
| Cars, trucks, cyclists, spheres | frontal area $A$ | bluff bodies: drag scales with the area facing the flow |
| Skin friction | wetted area | friction acts on every square metre of surface |
| Rotors and propellers | disc area (with the tip speed) | the swept disc does the work |

Where the area is unclear, engineers quote the **drag area** $C_D A$ in square metres — the drag per unit dynamic pressure, which compares a car, a cyclist and a parachute directly.

### Typical values

| Body | Basis | $C_D$ |
|---|---|---|
| Square flat plate, face-on | frontal | 1.17 |
| Long flat plate, face-on (two-dimensional) | frontal | 2.0 |
| Long circular cylinder across the flow | frontal | 1.0–1.2 |
| Sphere, Re $10^3$ to $2\\times10^5$ | frontal | 0.4–0.5 |
| Sphere after the drag crisis, Re above $4\\times10^5$ | frontal | 0.1–0.2 |
| Streamlined body (teardrop) | frontal | 0.04–0.05 |
| Modern car | frontal | 0.25–0.35 |
| Heavy truck | frontal | 0.6–0.8 |
| Light aircraft, whole, cruising | wing area | 0.03–0.04 |
| Airliner, whole, cruising | wing area | 0.025–0.03 |

Lift coefficients are of order one: a wing cruises at $C_L \\approx 0.3$–0.5 and reaches $C_{L,\\max} \\approx 1.3$–1.6 clean, 2.5–3 with flaps and slats. Pitching-moment coefficients of cambered airfoils about the quarter chord are small and negative, −0.02 to −0.1 (nose-down).

### When coefficients change
Coefficients are "constant" only while the flow pattern stays the same. A sphere's $C_D$ collapses from 0.47 to about 0.1 when its boundary layer turns turbulent (the [[drag-crisis|drag crisis]]); a wing's $C_D$ climbs steeply above its [[critical-mach|critical Mach number]]; its $C_L$ collapses at the [[stall]]. So coefficients are always quoted with their Re and M, and a good wind-tunnel test matches both — or corrects for the difference.

> [!tip] A car with $C_D = 0.30$ and a frontal area of 2.2 m² has a drag area of 0.66 m². At 120 km/h ($q$ = 680 Pa) it needs 450 N — 15 kW — just to push the air aside.
`,
  ideas: [
    'A coefficient is a force divided by q times a reference area (and a reference length for moments).',
    'Coefficients depend only on shape, attitude, Re and M, so model tests predict full-size forces.',
    'The reference area must be stated: planform for aircraft, frontal for cars and bluff bodies, wetted for friction.',
    'C_p = (p − p∞)/q: +1 at a stagnation point, negative where the flow speeds up.',
    'Drag area C_D A compares bodies whose reference areas differ.'
  ],
  pitfalls: [
    'A shape has one drag coefficient — It depends on Re, Mach number and attitude; a sphere\'s C_D drops from 0.47 to about 0.1 through the drag crisis.',
    'Any two drag coefficients can be compared — Only on the same reference area: an aircraft\'s 0.03 (on wing area) and a car\'s 0.30 (on frontal area) say nothing about which has more drag; compare drag areas.',
    'A coefficient above 1 is impossible — Coefficients are ratios to qS, not fractions of anything: C_L reaches 3 with flaps and a long plate face-on has C_D = 2.'
  ],
  formulas: [
    {
      name: 'Drag coefficient',
      expr: 'CD = D/(0.5*rho*V^2*A)', tex: 'C_D = \\dfrac{D}{\\tfrac{1}{2}\\rho V^2 A}',
      vars: {
        CD: { name: 'drag coefficient', tex: 'C_D' },
        D: { name: 'drag force', q: 'force', unit: 'N', value: 450 },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'speed', q: 'speed', unit: 'km/h', value: 120 },
        A: { name: 'reference area', q: 'area', unit: 'm²', value: 2.2 }
      },
      note: 'The same form defines C_L (with the lift) and C_Y (with the side force). State the reference area: frontal for cars, wing area for aircraft.',
      practice: { unknowns: ['CD', 'D', 'V'] },
      stories: {
        CD: 'A car with a frontal area of {A} needs {D} to overcome air drag at {V} (air density {rho}). What is its drag coefficient?',
        D: 'A body with C_D = {CD} and a reference area of {A} moves at {V} through air of density {rho}. What is its drag?',
        V: 'At what speed does a body with C_D = {CD} and area {A} feel {D} of drag, in air of density {rho}?'
      }
    },
    {
      name: 'Pitching moment',
      expr: 'M = Cm*0.5*rho*V^2*S*c', tex: 'M = C_m\\, \\tfrac{1}{2}\\rho V^2 S\\, \\bar c',
      vars: {
        M: { name: 'pitching moment (nose-up positive)', q: 'torque', unit: 'N·m', signed: true },
        Cm: { name: 'pitching-moment coefficient', value: -0.08, min: -1, max: 1, signed: true, tex: 'C_m' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'airspeed', q: 'speed', unit: 'm/s', value: 60 },
        S: { name: 'wing area', q: 'area', unit: 'm²', value: 16.2 },
        c: { name: 'mean aerodynamic chord', q: 'length', unit: 'm', value: 1.5, tex: '\\bar c' }
      },
      note: 'About a stated point, usually the quarter chord or the centre of gravity. A cambered wing has a small nose-down (negative) moment about its quarter chord.',
      practice: { unknowns: ['M', 'Cm'] },
      stories: {
        M: 'A wing of {S} with a mean chord of {c} flies at {V} in air of density {rho}; its moment coefficient is {Cm}. What pitching moment does it produce?',
        Cm: 'A wing of {S} with a mean chord of {c} produces a pitching moment of {M} at {V} in air of density {rho}. What is its moment coefficient?'
      }
    },
    {
      name: 'Pressure coefficient',
      expr: 'Cp = (p - pinf)/(0.5*rho*V^2)', tex: 'C_p = \\dfrac{p - p_\\infty}{\\tfrac{1}{2}\\rho V^2}',
      vars: {
        Cp: { name: 'pressure coefficient', signed: true, tex: 'C_p' },
        p: { name: 'local pressure (absolute)', q: 'pressure', unit: 'hPa', value: 1000 },
        pinf: { name: 'free-stream pressure (absolute)', q: 'pressure', unit: 'hPa', value: 1013.25, tex: 'p_\\infty' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'free-stream speed', q: 'speed', unit: 'm/s', value: 60 }
      },
      note: 'In incompressible flow C_p = 1 − (v/V)², with v the local speed: +1 at a stagnation point, negative where the air speeds up.',
      practice: { unknowns: ['Cp', 'p'] },
      stories: {
        Cp: 'A pressure tap on a wing reads {p} while the free stream, at {V} and density {rho}, is at {pinf}. What is the pressure coefficient there?',
        p: 'At a point where C_p = {Cp}, what pressure acts, if the free stream is at {pinf}, {V} and density {rho}?'
      }
    },
    {
      name: 'Power to overcome drag',
      expr: 'P = 0.5*rho*V^3*CD*A', tex: 'P = \\tfrac{1}{2}\\rho V^3 C_D A',
      vars: {
        P: { name: 'power', q: 'power', unit: 'kW' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'speed', q: 'speed', unit: 'km/h', value: 120 },
        CD: { name: 'drag coefficient', value: 0.30, tex: 'C_D' },
        A: { name: 'reference (frontal) area', q: 'area', unit: 'm²', value: 2.2 }
      },
      note: 'Drag times speed: power grows with the cube of speed. Still air assumed; rolling resistance and drivetrain losses come on top.',
      practice: { unknowns: ['P', 'V'] },
      stories: {
        P: 'A car with C_D = {CD} and a frontal area of {A} drives at {V} (air density {rho}). What power goes into air drag?',
        V: 'A vehicle with C_D = {CD} and area {A} has {P} available for air drag. How fast can it go in air of density {rho}?'
      }
    }
  ],
  examples: [
    {
      title: 'From the wind tunnel to the road',
      q: 'A 1:4 model of a car (frontal area 0.1375 m²) is tested at 50 m/s in air of density 1.20 kg/m³ and its drag is 62 N. Predict the drag of the full-size car at 120 km/h.',
      steps: [
        'Model: $q = \\tfrac12 \\times 1.20 \\times 50^2 = 1500$ Pa, so $C_D = 62/(1500 \\times 0.1375) = 0.30$.',
        'Full size: area $16 \\times 0.1375 = 2.2$ m², $q = 680$ Pa at 120 km/h, so $D = 0.30 \\times 680 \\times 2.2 = 449$ N.',
        'Caveat: the model\'s Reynolds number (about $4\\times10^6$) is below the car\'s ($1\\times10^7$). For a bluff car the drag coefficient changes little in this range, but for a sphere or a smooth rounded body it could.'
      ],
      a: 'About 450 N.'
    },
    {
      title: 'Reading a pressure tap',
      q: 'A wing in sea-level air at 60 m/s has a pressure tap reading 12.5 hPa below the free-stream pressure. What is $C_p$ there, and how fast is the air moving past that point?',
      steps: [
        '$q = \\tfrac12 \\times 1.225 \\times 60^2 = 2205$ Pa, so $C_p = -1250/2205 = -0.57$.',
        'Bernoulli: $C_p = 1 - (v/V)^2$, so $v = V\\sqrt{1 - C_p} = 60 \\times \\sqrt{1.57} = 75$ m/s.'
      ],
      a: 'C_p ≈ −0.57; the air there moves at about 75 m/s, 25 % faster than the free stream.'
    }
  ],
  quiz: [
    { q: 'A family car (C_D = 0.30, A = 2.2 m²) and an SUV (C_D = 0.35, A = 2.8 m²) drive at the same speed. The SUV\'s drag is larger by about…', choices: ['17 %', '27 %', '48 %', '100 %'], a: 2,
      why: 'Compare drag areas: 0.35 × 2.8 = 0.98 m² against 0.30 × 2.2 = 0.66 m²; the ratio is 1.48.' },
    { q: 'An aircraft\'s drag coefficient is normally based on its frontal area.', a: false,
      why: 'Aircraft coefficients, drag included, use the wing planform area, so that lift and drag coefficients can be compared directly (their ratio is L/D).' },
    { q: 'What is the pressure coefficient at a stagnation point in low-speed flow?', answer: 1, tol: 0.01,
      why: 'There the air is at rest, so p − p∞ = q and C_p = 1 exactly (a little more at high Mach number).' },
    { q: 'A wing of 20 m² flies at a dynamic pressure of 2000 Pa with C_L = 0.4. How much lift does it make, in kN?', answer: 16, unit: 'kN', tol: 0.02,
      why: 'L = C_L q S = 0.4 × 2000 × 20 = 16 000 N.' },
    { q: 'A model is made twice as large and tested at the same speed in the same air. If its drag coefficient stays the same, its drag becomes…', choices: ['twice as large', 'four times as large', 'eight times as large', 'the same'], a: 1,
      why: 'D = C_D q A: q is unchanged and the area grows as the square of size. (Re doubles too, which may change C_D a little.)' }
  ],
  problems: [
    { q: 'A racing cyclist has a drag area C_D A of 0.30 m². What power goes into air drag at 40 km/h in still sea-level air?', answer: 252, unit: 'W', tol: 0.02,
      steps: ['$V = 40/3.6 = 11.1$ m/s.', '$P = \\tfrac12 \\rho V^3 C_D A = 0.5 \\times 1.225 \\times 11.1^3 \\times 0.30 = 252$ W — most of what a strong amateur can sustain.'] }
  ],
  applications: [
    'Wind-tunnel testing: balances measure forces and moments, which are reduced to coefficients and scaled to full size.',
    'Comparing vehicles by drag area C_D A — cars, trucks, cyclists, skydivers.',
    'Aircraft performance and stability, built from C_L, C_D and C_m curves.',
    'Structural wind loads, from pressure coefficients tabulated in building codes.'
  ],
  history: 'Gustave Eiffel, after building his tower, turned to aerodynamics and from 1909 measured the forces on plates, spheres and wings in his laboratories in Paris. In 1912 he found that a sphere\'s drag suddenly fell as the speed rose — contradicting measurements in Göttingen — until Ludwig Prandtl showed in 1914 that the boundary layer was turning turbulent, by tripping it with a thin wire. The episode taught aerodynamicists that coefficients belong to a Reynolds number.',
  sim: ['basics-cylinder-re', 'ref-airfoil']
},

{
  id: 'reynolds-number', parent: 'similarity', title: 'The Reynolds number', level: 2,
  short: 'The Reynolds number Re = ρVL/μ = VL/ν compares the inertia of a flow with its viscosity. It decides the character of every flow — creeping, laminar or turbulent — and runs from 10⁻⁵ for a swimming bacterium to 10⁹ for a ship. Two flows with the same shape and the same Re look the same.',
  keywords: ['Reynolds number', 'Re', 'inertia', 'viscosity', 'laminar', 'turbulent', 'transition', 'critical Reynolds number', 'similarity', 'scale effect', 'characteristic length', 'Re per metre', 'low Reynolds number', 'creeping flow'],
  prereq: ['air-viscosity', 'dynamic-pressure', 'dimensional-analysis'],
  related: ['boundary-layer', 'transition', 'laminar-boundary-layer', 'turbulent-boundary-layer', 'drag-crisis', 'vortex-shedding', 'reynolds-effects-airfoil', 'similarity-testing', 'wind-tunnel', 'insect-flight', 'skin-friction', 'turbulence', 'mach-number'],
  body: `
Honey poured on toast flows smoothly and stops the moment you stop pouring; water from a tap splashes, swirls and keeps going. The difference lies less in the fluid than in a number that Osborne Reynolds made famous in 1883:

$$\\mathrm{Re} = \\frac{\\rho V L}{\\mu} = \\frac{V L}{\\nu}$$

with $V$ a speed, $L$ a length that describes the body and $\\nu = \\mu/\\rho$ the [[air-viscosity|kinematic viscosity]].

### What it compares
The inertial pressures in a flow are of order $\\rho V^2$ (the [[dynamic-pressure|dynamic pressure]]); the viscous stresses are of order $\\mu V/L$. Their ratio is Re. A second reading is about time: viscosity spreads momentum across a distance $L$ in a time of about $L^2/\\nu$, while the flow sweeps past in $L/V$; the ratio of the two is again $VL/\\nu$. At **low Re** viscosity has time to reach everywhere and damps every disturbance: the flow is orderly, and it stops the instant it is no longer driven. At **high Re** viscosity acts only in thin [[boundary-layer|boundary layers]] and wakes; outside them the flow is nearly frictionless, and small disturbances grow into [[turbulence]].

Always say which length you mean: the chord of a wing; the diameter of a sphere, a cylinder or a pipe; or the distance $x$ from a leading edge ($\\mathrm{Re}_x$, for a boundary layer).

### One shape, many flows
Flow past a long circular cylinder shows the whole story — try it in the simulation:

| Re (on diameter) | What the flow does |
|---|---|
| below 1 | creeping flow: the streamlines close smoothly behind, almost the same front and back |
| 5–47 | the flow separates; two steady eddies sit behind the cylinder, growing longer with Re |
| 47–200 | the eddies break away alternately: a laminar **vortex street** ([[vortex-shedding]]) |
| 200 to $2\\times10^5$ | the wake is turbulent; the boundary layer stays laminar and separates early; $C_D \\approx 1.2$ |
| about $3\\times10^5$ to $5\\times10^5$ | the boundary layer turns turbulent before separating, clings on longer, and the drag falls by two thirds: the [[drag-crisis|drag crisis]] |

Other landmarks: flow in a pipe stays laminar below Re ≈ 2300 (on the diameter); the boundary layer on a smooth flat plate becomes turbulent at $\\mathrm{Re}_x$ between about $3\\times10^5$ and $3\\times10^6$, typically $5\\times10^5$ ([[transition]]).

### From a bacterium to a ship
In sea-level air $\\mathrm{Re} \\approx 68\\,000 \\times V\\,[\\mathrm{m/s}] \\times L\\,[\\mathrm{m}]$; in water at 20 °C, $\\mathrm{Re} \\approx 10^6 \\times V \\times L$.

| Swimmer or flyer | Length $L$ | Speed | Fluid | Re |
|---|---|---|---|---|
| Bacterium (*E. coli*) | 2 µm | 30 µm/s | water | $6\\times10^{-5}$ |
| Fog droplet, settling | 10 µm | 3 mm/s | air | 0.002 |
| Fruit-fly wing | 1 mm chord | 2 m/s | air | 130 |
| Honeybee wing | 3 mm chord | 5 m/s | air | 1000 |
| Small drone propeller blade | 2 cm chord | 40 m/s | air | $5\\times10^4$ |
| Pigeon wing | 10 cm chord | 15 m/s | air | $1\\times10^5$ |
| Football in flight | 22 cm diameter | 25 m/s | air | $4\\times10^5$ |
| Trout | 30 cm | 1 m/s | water | $3\\times10^5$ |
| Human swimmer | 2 m | 2 m/s | water | $4\\times10^6$ |
| Light aircraft wing | 1.5 m chord | 60 m/s | air | $6\\times10^6$ |
| Car | 4.5 m | 30 m/s | air | $9\\times10^6$ |
| Airliner wing at cruise (11 000 m) | 5 m chord | 240 m/s | air | $3\\times10^7$ |
| Blue whale | 25 m | 5 m/s | sea water | $1\\times10^8$ |
| Container ship | 300 m | 12 m/s | sea water | $3\\times10^9$ |

Across this range the character of the flow changes completely. A bacterium lives where inertia is irrelevant: stop swimming and it coasts less than the width of an atom. Insects fly at Re $10^2$–$10^4$, where wings have poor lift-to-drag ratios and flapping tricks matter ([[insect-flight]]). Model aircraft and small drones, at $10^4$–$10^5$, suffer laminar separation bubbles ([[reynolds-effects-airfoil]]). Full-size aircraft fly at millions to tens of millions.

### Matching Re: the tunnel's problem
Two geometrically similar flows are identical when their Reynolds numbers (and [[mach-number|Mach numbers]]) are equal. A 1/10-scale model of a light aircraft in ordinary air would need 600 m/s to match Re — supersonic, and so a quite different flow. The ways out: test in water, whose $\\nu$ is 15 times smaller; pressurise the tunnel (density up, $\\nu$ down); cool the gas (cryogenic nitrogen at about −160 °C and several bar reaches full-scale airliner Re); or accept a lower Re and trip the boundary layer to turbulence where it would be turbulent on the real aircraft (see [[similarity-testing]]).

> [!key] Same shape, same Re (and same Mach number) → same flow pattern and same coefficients. Re is the first number to ask about any flow.
`,
  ideas: [
    'Re = ρVL/μ = VL/ν: inertial stresses over viscous stresses, or viscous diffusion time over the time to flow past.',
    'Low Re: smooth, viscous, reversible flow; high Re: thin boundary layers, wakes and turbulence.',
    'Each flow has its own critical values: 2300 in a pipe, about 5 × 10⁵ on a flat plate, 47 for vortex shedding, 3 × 10⁵ for a cylinder\'s drag crisis.',
    'In sea-level air Re ≈ 68 000 × V × L; in water about 10⁶ × V × L.',
    'Similar shapes at equal Re have similar flows — the basis of model testing.'
  ],
  pitfalls: [
    'A high Reynolds number means a very viscous flow — The opposite: viscosity is in the denominator. High Re means viscous effects are confined to thin layers.',
    'There is one critical Reynolds number — Each flow has its own, depending on the length used and on disturbances: 2300 in a pipe, about 5 × 10⁵ on a plate, 47 for vortex shedding, 3 × 10⁵ for a cylinder\'s drag crisis.',
    'A scale model in the same air at the same speed reproduces the flow — Its Reynolds number is smaller; boundary layers stay laminar longer and separate differently, so small models often show too much drag and too early a stall.'
  ],
  formulas: [
    {
      name: 'Reynolds number',
      expr: 'Re = rho*V*L/mu', tex: '\\mathrm{Re} = \\dfrac{\\rho V L}{\\mu}',
      vars: {
        Re: { name: 'Reynolds number', tex: '\\mathrm{Re}' },
        rho: { name: 'fluid density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'speed', q: 'speed', unit: 'm/s', value: 60 },
        L: { name: 'characteristic length (chord, diameter…)', q: 'length', unit: 'm', value: 1.5 },
        mu: { name: 'dynamic viscosity', q: 'viscosity', unit: 'Pa·s', value: 1.789e-5, tex: '\\mu' }
      },
      note: 'ISA sea-level air: ρ = 1.225 kg/m³, μ = 1.789 × 10⁻⁵ Pa·s. Always state which length L is.',
      practice: { unknowns: ['Re', 'V', 'L'] },
      stories: {
        Re: 'A wing with a chord of {L} flies at {V} through air of density {rho} and viscosity {mu}. What is its Reynolds number?',
        V: 'At what speed does a body of length {L} reach a Reynolds number of {Re} in a fluid of density {rho} and viscosity {mu}?',
        L: 'A flow at {V} (density {rho}, viscosity {mu}) must reach Re = {Re}. What length does that take?'
      }
    },
    {
      name: 'Reynolds number with kinematic viscosity',
      expr: 'Re = V*L/nu', tex: '\\mathrm{Re} = \\dfrac{V L}{\\nu}',
      vars: {
        Re: { name: 'Reynolds number', tex: '\\mathrm{Re}' },
        V: { name: 'speed', q: 'speed', unit: 'm/s', value: 5 },
        L: { name: 'characteristic length', q: 'length', unit: 'mm', value: 3 },
        nu: { name: 'kinematic viscosity', q: 'kinvisc', unit: 'mm²/s', value: 15, tex: '\\nu' }
      },
      note: 'Air near 20 °C: ν ≈ 15 mm²/s; water at 20 °C: 1.0 mm²/s. The default values are a honeybee wing.',
      practice: { unknowns: ['Re', 'V'] },
      stories: {
        Re: 'A wing with a chord of {L} moves at {V} through air with ν = {nu}. What is its Reynolds number?',
        V: 'How fast must a body {L} long move through a fluid with ν = {nu} to reach Re = {Re}?'
      }
    },
    {
      name: 'Model speed for equal Reynolds numbers',
      expr: 'Vm = Vp*(Lp/Lm)*(num/nup)', tex: 'V_m = V_p\\,\\dfrac{L_p}{L_m}\\,\\dfrac{\\nu_m}{\\nu_p}',
      vars: {
        Vm: { name: 'model speed', q: 'speed', unit: 'm/s', tex: 'V_m' },
        Vp: { name: 'full-size (prototype) speed', q: 'speed', unit: 'm/s', value: 30, tex: 'V_p' },
        Lp: { name: 'full-size length', q: 'length', unit: 'm', value: 4.5, tex: 'L_p' },
        Lm: { name: 'model length', q: 'length', unit: 'm', value: 1.125, tex: 'L_m' },
        num: { name: 'kinematic viscosity of the model fluid', q: 'kinvisc', unit: 'mm²/s', value: 1.0, tex: '\\nu_m' },
        nup: { name: 'kinematic viscosity of the full-size fluid', q: 'kinvisc', unit: 'mm²/s', value: 15, tex: '\\nu_p' }
      },
      note: 'From Re_model = Re_prototype. The default values: a 1:4 model of a car at 30 m/s, tested in water instead of air.',
      practice: { unknowns: ['Vm', 'Lm'] },
      stories: {
        Vm: 'A body {Lp} long moves at {Vp} in a fluid with ν = {nup}. A model {Lm} long is tested in a fluid with ν = {num}. How fast must the model go for the same Reynolds number?',
        Lm: 'A body {Lp} long moves at {Vp} in a fluid with ν = {nup}. A tunnel with ν = {num} can reach {Vm}. How long must the model be for equal Reynolds numbers?'
      }
    },
    {
      name: 'Where a boundary layer turns turbulent',
      expr: 'xtr = Retr*nu/V', tex: 'x_{tr} = \\dfrac{\\mathrm{Re}_{tr}\\,\\nu}{V}',
      vars: {
        xtr: { name: 'distance from the leading edge to transition', q: 'length', unit: 'cm', tex: 'x_{tr}' },
        Retr: { name: 'transition Reynolds number', value: 5e5, tex: '\\mathrm{Re}_{tr}' },
        nu: { name: 'kinematic viscosity', q: 'kinvisc', unit: 'mm²/s', value: 14.6, tex: '\\nu' },
        V: { name: 'flow speed', q: 'speed', unit: 'm/s', value: 60 }
      },
      note: 'A flat-plate estimate: Re_tr ranges from about 3 × 10⁵ (rough, disturbed) to 3 × 10⁶ (very smooth, quiet flow). Favourable pressure gradients on laminar-flow airfoils delay it.',
      practice: { unknowns: ['xtr', 'V'] },
      stories: {
        xtr: 'Air with ν = {nu} flows at {V} over a smooth plate. If transition occurs at Re = {Retr}, how far from the leading edge does the boundary layer turn turbulent?',
        V: 'At what speed does transition (Re = {Retr}) move to {xtr} from the leading edge, in air with ν = {nu}?'
      }
    }
  ],
  examples: [
    {
      title: 'A honeybee and an airliner',
      q: 'Compare the Reynolds numbers of a honeybee wing (chord 3 mm, 5 m/s, ν = 1.5 × 10⁻⁵ m²/s) and an airliner wing at cruise (chord 5 m, 240 m/s, ν = 3.9 × 10⁻⁵ m²/s).',
      steps: [
        'Bee: $\\mathrm{Re} = 5 \\times 0.003/1.5\\times10^{-5} = 1000$.',
        'Airliner: $\\mathrm{Re} = 240 \\times 5/3.9\\times10^{-5} = 3.1\\times10^{7}$.',
        'Ratio: 30 000. At Re = 1000 viscosity thickens the boundary layer over the whole wing, which is why insects rely on unsteady flapping tricks rather than the smooth attached flow of a large wing.'
      ],
      a: 'About 10³ against 3 × 10⁷: two different aerodynamic worlds.'
    },
    {
      title: 'Testing a car in a water tunnel',
      q: 'A car 4.5 m long drives at 30 m/s. How fast must a 1:4 model move to match its Reynolds number (a) in air, (b) in water (ν = 1.0 × 10⁻⁶ against 1.5 × 10⁻⁵ m²/s)?',
      steps: [
        'In air: $V_m = 30 \\times 4 = 120$ m/s — Mach 0.35, where compressibility starts to distort the flow.',
        'In water: $V_m = 30 \\times 4 \\times (1.0/15) = 8$ m/s — easy.',
        'The forces then scale with the dynamic pressure of the water, $\\tfrac12 \\times 1000 \\times 8^2 = 32$ kPa, so the model must be strong.'
      ],
      a: '120 m/s in air; only 8 m/s in water.'
    },
    {
      title: 'Where the boundary layer turns turbulent',
      q: 'A light aircraft flies at 60 m/s at sea level (ν = 1.46 × 10⁻⁵ m²/s). Using a transition Reynolds number of 5 × 10⁵, how far from the leading edge does its wing\'s boundary layer turn turbulent?',
      steps: [
        '$x_{tr} = \\mathrm{Re}_{tr}\\,\\nu/V = 5\\times10^5 \\times 1.46\\times10^{-5}/60 = 0.12$ m.',
        'On a 1.5 m chord that leaves most of the wing — over 90 % by this estimate — with a turbulent boundary layer. Laminar-flow airfoils, with a pressure falling over their front half, push transition back to 30–50 % of the chord.'
      ],
      a: 'About 12 cm behind the leading edge.'
    }
  ],
  quiz: [
    { q: 'What is the Reynolds number of a fruit-fly wing (chord 1 mm) moving at 2 m/s through air (ν = 1.5 × 10⁻⁵ m²/s)?', answer: 133, tol: 0.03,
      why: 'Re = VL/ν = 2 × 0.001/1.5 × 10⁻⁵ = 133 — a flow dominated by viscosity compared with any aircraft.' },
    { q: 'A model is built at half size and tested at twice the speed in the same air. Its Reynolds number is…', choices: ['half the full-size value', 'the same as full size', 'twice the full-size value', 'four times the full-size value'], a: 1,
      why: 'Re ∝ VL: (2V)(L/2) = VL. (Its Mach number, though, has doubled.)' },
    { q: 'To match the Reynolds number of a test in air, a model in water can run about 15 times slower.', a: true,
      why: 'Water\'s kinematic viscosity (1.0 × 10⁻⁶ m²/s) is about 15 times smaller than air\'s, so the same VL/ν needs V fifteen times smaller.' },
    { q: 'An aircraft flies at the same true airspeed at 11 000 m as at 3000 m. At 11 000 m its Reynolds number is…', choices: ['higher, because the air is colder', 'lower, because the kinematic viscosity is about twice as large up there', 'the same, since speed and size are unchanged', 'higher, because the dynamic viscosity is smaller'], a: 1,
      why: 'ν = μ/ρ: μ falls a little in the cold, but ρ falls much more (0.909 → 0.364 kg/m³), so ν roughly doubles and Re halves.' },
    { q: 'Which of these flows has the lowest Reynolds number?', choices: ['a fruit fly in flight', 'a bacterium swimming', 'a fog droplet settling', 'a honeybee in flight'], a: 1,
      why: 'Bacterium ~ 6 × 10⁻⁵, fog droplet ~ 2 × 10⁻³, fruit fly ~ 130, bee ~ 1000.' }
  ],
  problems: [
    { q: 'A cyclist\'s forearm, 7 cm across, meets air at 12 m/s (ν = 1.5 × 10⁻⁵ m²/s). What is its Reynolds number?', answer: 56000, tol: 0.02,
      steps: ['$\\mathrm{Re} = VD/\\nu = 12 \\times 0.07/1.5\\times10^{-5}$.', '$= 5.6\\times10^{4}$: below the drag crisis of a cylinder, so its drag coefficient is about 1.2.'] },
    { q: 'A 1:8 model of a car (full size 4.5 m, 30 m/s in air with ν = 1.5 × 10⁻⁵ m²/s) is tested in water (ν = 1.0 × 10⁻⁶ m²/s). At what speed does it match the full-size Reynolds number?', answer: 16, unit: 'm/s', tol: 0.02,
      steps: ['$V_m = V_p (L_p/L_m)(\\nu_m/\\nu_p) = 30 \\times 8 \\times (1.0/15)$.', '$= 16$ m/s.'] }
  ],
  applications: [
    'Wind- and water-tunnel testing, where matching (or correcting for) Re decides whether results transfer to full size.',
    'Pipe and duct design: laminar below Re ≈ 2300, turbulent friction above.',
    'Small drones, model aircraft and wind-turbine blade roots, which need airfoils designed for low Re.',
    'Biology: how bacteria swim, insects fly and fish glide depends on their Reynolds numbers.'
  ],
  history: 'In 1883 Osborne Reynolds, in Manchester, injected a thin stream of dye into water flowing through glass tubes. At low speeds the dye stayed a straight thread; above a critical value of VD/ν it suddenly flickered and mixed across the whole tube. The ratio had appeared in George Stokes\'s work in 1851, and Arnold Sommerfeld gave it Reynolds\'s name in 1908.',
  sim: ['basics-cylinder-re', { id: 'basics-dimensional', params: { problem: 'drag' } }]
},

{
  id: 'mach-number', parent: 'similarity', title: 'The Mach number', level: 2,
  short: 'The Mach number M = V/a compares a speed with the local speed of sound. It measures how much the air is compressed: below M ≈ 0.3 hardly at all, near M = 1 the flow is transonic with shock waves, and above it the air ahead gets no warning. Same Mach number, same compressible flow pattern.',
  keywords: ['Mach number', 'M', 'speed of sound', 'subsonic', 'transonic', 'supersonic', 'hypersonic', 'compressibility', 'Mach angle', 'Mach cone', 'machmeter', 'stagnation temperature', 'Ernst Mach', 'sound barrier'],
  prereq: ['speed-of-sound', 'dynamic-pressure', 'dimensional-analysis'],
  related: ['compressibility', 'mach-regimes', 'mach-cone', 'sonic-boom', 'critical-mach', 'normal-shock', 'isentropic-flow', 'stagnation-properties', 'transonic-flow', 'wave-drag', 'airspeeds', 'hypersonic-flight', 'reynolds-number'],
  body: `
A body moving through air sends pressure signals ahead of it at the [[speed-of-sound|speed of sound]], telling the air to move aside. How well the warning works depends on one ratio, the **Mach number**:

$$M = \\frac{V}{a}, \\qquad a = \\sqrt{\\gamma R T}$$

$V$ is the speed of the body relative to the air (or of the air past a point), and $a$ the speed of sound *in that air, at its temperature*. At $M = 0.5$ the signals outrun the body two to one and the air parts smoothly; at $M = 1$ they only keep pace; above 1 the air ahead gets no warning at all until a [[normal-shock|shock wave]] reaches it.

### A measure of compressibility
Slowing air by $\\Delta V$ raises its pressure by about $\\rho V\\,\\Delta V$, and a pressure change $\\Delta p$ changes the density by $\\Delta p/a^2$. Together, the fractional change of density in a flow is of order

$$\\frac{\\Delta\\rho}{\\rho} \\approx \\tfrac12 M^2$$

so compressibility grows with the *square* of the Mach number. At $M = 0.3$ the density at a stagnation point is 4.6 % above that of the free stream — the usual limit for treating air as incompressible. At $M = 0.8$ it is 35 %, and the flow must be treated as compressible ([[compressibility]]). $M^2$ also compares the kinetic energy of the flow with the thermal energy of its molecules: at high Mach numbers most of the air's energy is in its motion, and stopping it heats it fiercely.

### The regimes

| Mach number | Regime | What changes | Examples |
|---|---|---|---|
| below 0.3 | incompressible | density constant to a few per cent | cars, wind turbines, light aircraft, birds |
| 0.3–0.8 | subsonic, compressible | pressures and lift grow faster than $q$ | turboprops, airliners climbing |
| 0.8–1.2 | transonic | pockets of supersonic flow and shocks on the wing; drag rises steeply | airliners cruising at 0.78–0.85 |
| 1.2–5 | supersonic | shocks and expansion fans; no influence travels upstream | Concorde 2.0, fighters 1.5–2.2 |
| above 5 | hypersonic | thin shock layers, extreme heating, chemistry | re-entry capsules, the X-15 at 6.7 |

(See [[mach-regimes]].) Some everyday Mach numbers: a car at 120 km/h, 0.1; a Formula 1 car at 330 km/h, 0.27; the tips of a light aircraft's propeller, 0.7–0.85; a rifle bullet, about 2.5; the tip of a cracking whip, just over 1 — the crack is a small sonic boom.

### The same speed is not the same Mach number
Because $a$ depends on temperature, a given true airspeed means different Mach numbers at different heights. At 250 m/s an aircraft flies at $M = 0.73$ at sea level but at $M = 0.85$ at 11 000 m, where $a$ is 295 m/s. Airliners therefore cruise at a constant Mach number rather than a constant speed, and above about 8000 m it is their Mach limit, not their airspeed limit, that bounds them. A **machmeter** needs no thermometer: it computes $M$ from the ratio of total to static pressure, $p_0/p = (1 + 0.2M^2)^{3.5}$ below $M = 1$.

### Heat and cones
Air brought to rest from Mach $M$ reaches the [[stagnation-properties|stagnation temperature]] $T_0 = T\\,(1 + \\tfrac{\\gamma-1}{2}M^2)$: 31 K above the outside air for an airliner at $M = 0.85$, 117 °C on Concorde's nose at $M = 2$, nearly 400 °C for an SR-71 at $M = 3.2$. Above $M = 1$ a body's disturbances fill a cone behind it, the [[mach-cone|Mach cone]], with half-angle $\\mu = \\arcsin(1/M)$ — 30° at $M = 2$ — which sweeps the ground as a [[sonic-boom|sonic boom]].

### Mach number as a similarity number
Dimensional analysis puts $V/a$ beside the Reynolds number in every compressible problem: $C_D = f(\\mathrm{Re}, M)$. A model reproduces the full-size compressible flow only at the same Mach number, which is why transonic tunnels run near $M = 0.8$ even with small models — and why matching the [[reynolds-number|Reynolds number]] at the same time needs pressurised or cryogenic tunnels.

> [!warn] Mach numbers of real aircraft here are typical and rounded. Speed and Mach limits come from each aircraft's approved flight manual.
`,
  ideas: [
    'M = V/a, with a the speed of sound at the local temperature.',
    'Density changes grow as ½M²: under 5 % below M = 0.3, tens of per cent near M = 0.8.',
    'Regimes: incompressible, subsonic, transonic (0.8–1.2), supersonic, hypersonic (above 5).',
    'The same true airspeed is a higher Mach number up high, where the air is colder.',
    'Stagnation temperature T₀ = T(1 + 0.2M²) and the Mach angle arcsin(1/M) follow from M.'
  ],
  pitfalls: [
    'Mach 1 is a fixed speed of 1225 km/h — It is the local speed of sound: 1225 km/h at 15 °C, 1062 km/h at −56.5 °C.',
    'Compressibility matters only above Mach 1 — Density changes grow as M², reaching tens of per cent at M 0.7–0.8; airliner wings already carry supersonic pockets and shocks at M 0.8.',
    'The sonic boom happens only at the moment an aircraft "breaks the sound barrier" — The Mach cone travels with the aircraft, so a continuous boom carpet sweeps the ground for as long as it flies supersonically.'
  ],
  formulas: [
    {
      name: 'Mach number',
      expr: 'M = V/a', tex: 'M = \\dfrac{V}{a}',
      vars: {
        M: { name: 'Mach number' },
        V: { name: 'true airspeed', q: 'speed', unit: 'm/s', value: 242 },
        a: { name: 'local speed of sound', q: 'speed', unit: 'm/s', value: 295.1 }
      },
      note: 'a = 340.3 m/s at ISA sea level, 295.1 m/s from 11 to 20 km.',
      practice: { unknowns: ['M', 'V'] },
      stories: {
        M: 'An aircraft flies at {V} where the speed of sound is {a}. What is its Mach number?',
        V: 'An aircraft cruises at Mach {M} where the speed of sound is {a}. What is its true airspeed?'
      }
    },
    {
      name: 'Mach number from speed and temperature',
      expr: 'M = V/sqrt(gamma*Rair*T)', tex: 'M = \\dfrac{V}{\\sqrt{\\gamma\\, R_\\text{air}\\, T}}',
      vars: {
        M: { name: 'Mach number' },
        V: { name: 'true airspeed', q: 'speed', unit: 'kt', value: 470 },
        gamma: { name: 'ratio of specific heats', value: 1.4, min: 1.01, max: 1.7, tex: '\\gamma' },
        Rair: { const: 'Rair' },
        T: { name: 'outside air temperature', q: 'temperature', unit: '°C', value: -56.5, min: -90, max: 60 }
      },
      note: 'The temperature is the static (outside) air temperature, not the warmer reading of a probe in the flow.',
      practice: { unknowns: ['M', 'V', 'T'] },
      stories: {
        M: 'An aircraft flies at {V} true airspeed in air at {T}. What is its Mach number?',
        V: 'An aircraft holds Mach {M} in air at {T}. What is its true airspeed?',
        T: 'An aircraft at {V} true airspeed flies at Mach {M}. What is the outside air temperature?'
      }
    },
    {
      name: 'Mach angle',
      expr: 'mu = asin(1/M)', tex: '\\mu = \\arcsin\\dfrac{1}{M}',
      vars: {
        mu: { name: 'Mach angle (half-angle of the Mach cone)', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\mu' },
        M: { name: 'Mach number (1 or more)', value: 2, min: 1, max: 30 }
      },
      note: 'Only for supersonic flow. The cone of weak disturbances behind a supersonic body; real shocks near a body are somewhat steeper.',
      stories: { mu: 'A projectile flies at Mach {M}. What is the half-angle of its Mach cone?', M: 'A schlieren photograph shows a Mach cone with a half-angle of {mu}. How fast is the body flying?' }
    },
    {
      name: 'Stagnation temperature',
      expr: 'T0 = T*(1 + (gamma - 1)/2*M^2)', tex: 'T_0 = T\\left(1 + \\dfrac{\\gamma - 1}{2}M^2\\right)',
      vars: {
        T0: { name: 'stagnation (total) temperature', q: 'temperature', unit: '°C', tex: 'T_0' },
        T: { name: 'static air temperature', q: 'temperature', unit: '°C', value: -56.5, min: -90, max: 60 },
        gamma: { name: 'ratio of specific heats', value: 1.4, min: 1.01, max: 1.7, tex: '\\gamma' },
        M: { name: 'Mach number', value: 2, min: 0, max: 10 }
      },
      note: 'The temperature of air brought adiabatically to rest; a nose, a leading edge or a probe approaches it. γ = 1.4 is good to about Mach 5.',
      practice: { unknowns: ['T0', 'M'] },
      stories: {
        T0: 'Concorde cruises at Mach {M} in air at {T}. What temperature does the air reach at its nose?',
        M: 'A temperature probe reads {T0} while the outside air is at {T}. What is the Mach number?'
      }
    },
    {
      name: 'Machmeter: Mach number from pressures (subsonic)',
      expr: 'M = sqrt(5*((p0/p)^(2/7) - 1))', tex: 'M = \\sqrt{5\\left(\\left(\\dfrac{p_0}{p}\\right)^{2/7} - 1\\right)}',
      vars: {
        M: { name: 'Mach number' },
        p0: { name: 'total (pitot) pressure, absolute', q: 'pressure', unit: 'kPa', value: 34.5, tex: 'p_0' },
        p: { name: 'static pressure, absolute', q: 'pressure', unit: 'kPa', value: 22.63 }
      },
      note: 'Isentropic flow with γ = 1.4, valid below M = 1. Above it a shock stands in front of the pitot tube and Rayleigh\'s formula applies instead.',
      practice: { unknowns: ['M', 'p0'] },
      stories: {
        M: 'A pitot tube reads {p0} and the static port {p}. What Mach number does the machmeter show?',
        p0: 'At a static pressure of {p}, what total pressure does a pitot tube read at Mach {M}?'
      }
    }
  ],
  examples: [
    {
      title: 'Same speed, different Mach number',
      q: 'An aircraft flies at 250 m/s true airspeed. What is its Mach number at sea level (15 °C) and at 11 000 m (−56.5 °C)?',
      steps: [
        'Sea level: $a = \\sqrt{1.4 \\times 287.05 \\times 288.15} = 340.3$ m/s, so $M = 250/340.3 = 0.73$.',
        '11 000 m: $a = \\sqrt{1.4 \\times 287.05 \\times 216.65} = 295.1$ m/s, so $M = 250/295.1 = 0.85$.'
      ],
      a: 'M = 0.73 at sea level, 0.85 at 11 000 m — well into the transonic range.'
    },
    {
      title: 'Concorde\'s hot nose',
      q: 'Concorde cruised at Mach 2.0 at about 17 000 m, where the air is at −56.5 °C. What temperature did the air reach at its nose?',
      steps: [
        '$T_0 = T(1 + 0.2 M^2) = 216.65 \\times (1 + 0.2 \\times 4) = 216.65 \\times 1.8 = 390$ K.',
        '$390 - 273 = 117$ °C. The aluminium skin ran hot enough that the airframe grew measurably longer in cruise, and the Mach 2 limit was set partly by what the aluminium alloys could stand.'
      ],
      a: 'About 117 °C.'
    },
    {
      title: 'When do you hear the boom?',
      q: 'An aircraft flies at Mach 2 at 17 km altitude directly over you. Ignoring the bending of sound by the atmosphere, how long after it passes overhead does the boom arrive?',
      steps: [
        'Mach angle: $\\mu = \\arcsin(1/2) = 30°$.',
        'The cone reaches the ground a distance $h/\\tan\\mu = 17/\\tan 30° = 29.4$ km behind the aircraft.',
        'At $V = 2 \\times 295 = 590$ m/s the aircraft covers that in $29\\,400/590 \\approx 50$ s.'
      ],
      a: 'About 50 s after it passed overhead.'
    }
  ],
  quiz: [
    { q: 'An aircraft keeps a constant true airspeed while climbing from sea level to 11 000 m. Its Mach number…', choices: ['falls, because the air is thinner', 'rises, because the speed of sound falls in the colder air', 'stays the same', 'rises, because the pressure falls'], a: 1,
      why: 'a = √(γRT) falls from 340 to 295 m/s with the temperature; the same V is then a larger fraction of a. Pressure and density do not enter.' },
    { q: 'What is the Mach angle (half-angle of the Mach cone) at M = 1.5, in degrees?', answer: 41.8, tol: 0.02,
      why: 'μ = arcsin(1/1.5) = arcsin(0.667) = 41.8°. The faster the body, the narrower the cone.' },
    { q: 'Below Mach 0.3, air flowing round a body changes its density by less than about 5 %.', a: true,
      why: 'Δρ/ρ ≈ ½M² = 0.045 at M = 0.3 (the exact stagnation value is 4.6 %), which is why low-speed aerodynamics treats air as incompressible.' },
    { q: 'Why do airliners cruise at a constant Mach number rather than a constant true airspeed?', choices: ['to save fuel during the climb', 'because the drag rise and buffet on the wing depend on the Mach number', 'because the airspeed indicator fails at altitude', 'because the speed of sound is the same at all heights'], a: 1,
      why: 'Shock formation, drag rise and buffet on a transonic wing are set by M. Holding M keeps the wing where it was designed to work as the temperature changes.' },
    { q: 'By how many kelvin is the stagnation temperature above the outside air for M = 0.85 at −56.5 °C?', answer: 31.3, tol: 0.03,
      why: 'ΔT = T × 0.2M² = 216.65 × 0.2 × 0.7225 = 31.3 K. A probe on the aircraft reads close to −25 °C.' }
  ],
  problems: [
    { q: 'A rifle bullet leaves the muzzle at 850 m/s on a 15 °C day. What is its Mach number?', answer: 2.50, tol: 0.02,
      steps: ['$a = 340.3$ m/s at 15 °C.', '$M = 850/340.3 = 2.50$.'] },
    { q: 'At what true airspeed, in knots, does an aircraft fly Mach 0.78 at 11 000 m (−56.5 °C)?', answer: 447, unit: 'kt', tol: 0.02,
      steps: ['$a = 295.1$ m/s at −56.5 °C.', '$V = 0.78 \\times 295.1 = 230.2$ m/s $= 230.2 \\times 3600/1852 = 447$ kt.'] }
  ],
  applications: [
    'Flight at high altitude, where the Mach limit (M_MO) rather than the airspeed limit bounds the aircraft.',
    'Transonic and supersonic wind tunnels, which must match the full-size Mach number.',
    'Propeller and rotor design, where tip Mach numbers above about 0.85 cause noise and a sharp loss of efficiency.',
    'Ballistics, turbomachinery and rocket nozzles, all governed by Mach-number effects.'
  ],
  history: 'In 1887 the Austrian physicist Ernst Mach and Peter Salcher photographed the shock waves around supersonic bullets, and Mach explained the angle of the cone. The Swiss aerodynamicist Jakob Ackeret proposed the name "Mach number" in 1929. On 14 October 1947 Chuck Yeager flew the rocket-powered Bell X-1 beyond Mach 1 in level flight.',
  sim: ['basics-speed-altitude', 'basics-pitot']
},

{
  id: 'strouhal-froude', parent: 'similarity', title: 'Strouhal, Froude and other numbers', level: 2,
  short: 'Beyond Reynolds and Mach: the Strouhal number fL/V measures unsteadiness (vortex shedding, flapping wings), the Froude number V/√(gL) the balance of inertia and gravity (ship waves, towing tanks, walking), the Weber number surface tension — and a handful of others each capture one more piece of physics.',
  keywords: ['Strouhal number', 'Froude number', 'Weber number', 'Knudsen number', 'Prandtl number', 'reduced frequency', 'advance ratio', 'vortex shedding frequency', 'hull speed', 'aeolian tones', 'towing tank', 'dimensionless numbers', 'vortex-induced vibration'],
  prereq: ['dimensional-analysis', 'reynolds-number', 'physics:wave-properties'],
  related: ['vortex-shedding', 'galloping-bridges', 'wind-loads', 'flutter', 'bird-flight', 'insect-flight', 'similarity-testing', 'propeller-efficiency', 'mach-number', 'what-is-a-fluid', 'physics:surface-tension'],
  body: `
Every new piece of physics in a problem brings a new quantity, and with it — by the [[dimensional-analysis|Π theorem]] — a new dimensionless group. The Reynolds and Mach numbers cover viscosity and compressibility; these cover much of the rest.

### Strouhal number: how unsteady?
When a flow has a frequency $f$ — a wake shedding vortices, a flapping wing, a rotating blade — the group

$$\\mathrm{St} = \\frac{f L}{V}$$

compares the time the flow takes to pass the body, $L/V$, with the period of the motion, $1/f$. Behind a cylinder the vortices peel off alternately at $\\mathrm{St} = fD/V \\approx 0.2$ over a remarkable range, from Re ≈ 300 to $2\\times10^5$ (see [[vortex-shedding]]). That gives the **aeolian tones** of wires singing in the wind: a 3 mm wire in a 10 m/s breeze sheds at $0.2 \\times 10/0.003 \\approx 670$ Hz. It also gives danger: if the shedding frequency matches a natural frequency of a chimney, a cable or a bridge deck, the structure can lock in and oscillate violently — the reason tall steel chimneys wear helical strakes. And it gives a rule of nature: birds, bats, insects, fish and whales cruise with wings or tails beating at $\\mathrm{St} \\approx 0.2$–0.4, the range where flapping makes thrust most efficiently.

### Froude number: inertia against gravity
Where gravity shapes the flow — waves on water, the bow wave of a ship, liquid sloshing in a tank — the group is

$$\\mathrm{Fr} = \\frac{V}{\\sqrt{g L}}$$

A ship makes a bow wave and a stern wave. When its length matches the wavelength of its own waves, at $\\mathrm{Fr} \\approx 0.4$, the stern sinks into the trough and wave drag climbs steeply: this is the **hull speed** of a displacement hull, about $2.4\\sqrt{L\\,[\\mathrm{m}]}$ knots. Towing tanks test ship models at the full-scale Froude number (a 1:25 model runs at one fifth of the ship's speed) and correct separately for the Reynolds number they cannot also match. The same number governs walking: animals of every size change from walking to running near $V^2/(gL) \\approx 0.5$, with $L$ the leg length. In aeronautics it matters for seaplane hulls, fuel sloshing and stores dropped from aircraft.

### A gallery of dimensionless numbers

| Number | Definition | Compares | Where it matters | Typical values |
|---|---|---|---|---|
| Reynolds | $\\rho VL/\\mu$ | inertia / viscosity | every flow | $10^{-5}$ to $10^{9}$ |
| Mach | $V/a$ | flow speed / sound speed | compressibility | 0 to 25 |
| Strouhal | $fL/V$ | flow time / period | wakes, flapping, rotors | 0.2 for a cylinder wake |
| Froude | $V/\\sqrt{gL}$ | inertia / gravity | ships, waves, walking | hull speed at about 0.4 |
| Weber | $\\rho V^2 L/\\sigma$ | inertia / surface tension | drops, sprays, icing | drops break up above about 12 |
| Knudsen | $\\lambda/L$ | molecular path / size | rarefied gas | below 0.01: continuum |
| Prandtl | $\\nu/\\alpha$ | momentum / heat diffusion | heat transfer, hot flows | air 0.71, water 7 |
| Reduced frequency | $\\omega c/(2V)$ | unsteadiness of a wing | gusts, flutter, flapping | below 0.05: quasi-steady |
| Advance ratio | $V/(nD)$ | forward / rotational speed | propellers and rotors | 0.5–1 for light-aircraft propellers |

### Which ones to match?
A model can rarely match them all. A ship model can match Fr or Re but not both; a wind-tunnel model can seldom match Re and M together without a pressurised or cryogenic tunnel. The engineer's skill is to decide which numbers control the flow of interest and to correct for the rest ([[similarity-testing]]).
`,
  ideas: [
    'The Strouhal number fL/V measures how unsteady a flow is; cylinder wakes shed at St ≈ 0.2.',
    'Resonance between vortex shedding and a structure\'s natural frequency drives vortex-induced vibration.',
    'The Froude number V/√(gL) governs gravity waves: ships, towing tanks and even walking.',
    'Weber, Knudsen, Prandtl, reduced frequency and advance ratio each capture one extra effect.',
    'Models seldom match every number; engineers match the dominant one and correct for the rest.'
  ],
  pitfalls: [
    'Vortex shedding is a strong-wind effect — It happens at almost any Re above about 47; the danger is a match between shedding frequency and a structure\'s natural frequency, which for a large chimney can come in a moderate breeze.',
    'A good model matches every dimensionless number — Usually impossible: Froude and Reynolds matching need opposite speed scalings, so one is matched and the other corrected for.',
    'The Froude number is just another form of the Reynolds number — It contains gravity and no viscosity; it matters only where gravity shapes the flow, as at a free surface.'
  ],
  formulas: [
    {
      name: 'Vortex-shedding frequency',
      expr: 'f = St*V/D', tex: 'f = \\dfrac{\\mathrm{St}\\,V}{D}',
      vars: {
        f: { name: 'shedding frequency', q: 'frequency', unit: 'Hz' },
        St: { name: 'Strouhal number (≈ 0.2 for a cylinder)', value: 0.2, tex: '\\mathrm{St}' },
        V: { name: 'wind speed', q: 'speed', unit: 'm/s', value: 10 },
        D: { name: 'diameter', q: 'length', unit: 'mm', value: 3 }
      },
      note: 'St ≈ 0.2 for a circular cylinder from Re ≈ 300 to 2 × 10⁵; a pair of vortices (one from each side) is shed per cycle.',
      practice: { unknowns: ['f', 'V'] },
      stories: {
        f: 'A wire {D} thick stands in a {V} wind. With St = {St}, at what frequency does it shed vortices — the pitch of its aeolian tone?',
        V: 'A chimney {D} across has a natural frequency of {f}. With St = {St}, at what wind speed could vortex shedding excite it?'
      }
    },
    {
      name: 'Froude number',
      expr: 'Fr = V/sqrt(g*L)', tex: '\\mathrm{Fr} = \\dfrac{V}{\\sqrt{g L}}',
      vars: {
        Fr: { name: 'Froude number', tex: '\\mathrm{Fr}' },
        V: { name: 'speed', q: 'speed', unit: 'kt', value: 7.3 },
        g: { const: 'g' },
        L: { name: 'waterline length', q: 'length', unit: 'm', value: 9 }
      },
      note: 'For ships L is the waterline length; the hull speed of a displacement hull is near Fr = 0.4.',
      practice: { unknowns: ['Fr', 'V'] },
      stories: {
        Fr: 'A yacht with a waterline length of {L} sails at {V}. What is its Froude number?',
        V: 'A displacement hull {L} long reaches its hull speed near Fr = {Fr}. How fast is that?'
      }
    },
    {
      name: 'Weber number',
      expr: 'We = rho*V^2*D/sig', tex: '\\mathrm{We} = \\dfrac{\\rho V^2 D}{\\sigma}',
      vars: {
        We: { name: 'Weber number', tex: '\\mathrm{We}' },
        rho: { name: 'density of the air flowing past the drop', q: 'density', unit: 'kg/m³', value: 1.2, tex: '\\rho' },
        V: { name: 'speed of the drop relative to the air', q: 'speed', unit: 'm/s', value: 9 },
        D: { name: 'drop diameter', q: 'length', unit: 'mm', value: 5 },
        sig: { name: 'surface tension', q: 'surfacetension', unit: 'N/m', value: 0.072, tex: '\\sigma' }
      },
      note: 'Aerodynamic pressure against surface tension. Drops break up above We ≈ 12, which caps falling raindrops at roughly 8 mm; most are broken up, or split by collisions, well before that.',
      stories: {
        We: 'A raindrop {D} across falls at {V} through air of density {rho}; water\'s surface tension is {sig}. What is its Weber number?',
        D: 'Drops break up at We = {We}. How large can a drop falling at {V} through air of density {rho} grow (surface tension {sig})?'
      }
    },
    {
      name: 'Reduced frequency of an oscillating wing',
      expr: 'k = pi*f*c/V', tex: 'k = \\dfrac{\\pi f c}{V}',
      vars: {
        k: { name: 'reduced frequency' },
        f: { name: 'frequency of the oscillation or gust', q: 'frequency', unit: 'Hz', value: 2 },
        c: { name: 'chord', q: 'length', unit: 'm', value: 1.5 },
        V: { name: 'airspeed', q: 'speed', unit: 'm/s', value: 60 }
      },
      note: 'k = ωc/(2V) with ω = 2πf. Below about 0.05 the flow is quasi-steady; above about 0.2 unsteady effects dominate (flutter, flapping flight).',
      stories: { k: 'A wing with a chord of {c} flying at {V} oscillates at {f}. What is the reduced frequency?', f: 'At what frequency does a {c} wing at {V} reach a reduced frequency of {k}?' }
    }
  ],
  examples: [
    {
      title: 'The singing wire',
      q: 'A 3 mm wire stands in a 10 m/s wind. At what frequency does it shed vortices, and is its Reynolds number in the range where St ≈ 0.2?',
      steps: [
        '$f = \\mathrm{St}\\,V/D = 0.2 \\times 10/0.003 = 667$ Hz — a clear whistle.',
        '$\\mathrm{Re} = VD/\\nu = 10 \\times 0.003/1.5\\times10^{-5} = 2000$: inside the range 300 to $2\\times10^5$.'
      ],
      a: 'About 670 Hz.'
    },
    {
      title: 'A chimney that could shake itself',
      q: 'A steel chimney 2 m in diameter has a natural frequency of 0.8 Hz. At what wind speed does vortex shedding match it?',
      steps: [
        '$V = fD/\\mathrm{St} = 0.8 \\times 2/0.2 = 8$ m/s.',
        'That is an ordinary breeze, so the chimney would meet it often. Helical strakes break up the regular shedding; tuned dampers absorb the motion.'
      ],
      a: 'About 8 m/s — a common wind, hence the strakes on steel chimneys.'
    },
    {
      title: 'Hull speed of a yacht',
      q: 'Estimate the hull speed of a yacht with a waterline length of 9 m, taking Fr = 0.4.',
      steps: [
        '$V = \\mathrm{Fr}\\sqrt{gL} = 0.4 \\times \\sqrt{9.81 \\times 9} = 0.4 \\times 9.40 = 3.76$ m/s.',
        'In knots: $3.76 \\times 3600/1852 = 7.3$ kt — the same as the sailors\' rule $1.34\\sqrt{L\\,[\\mathrm{ft}]}$ with 29.5 ft.'
      ],
      a: 'About 7.3 knots.'
    }
  ],
  quiz: [
    { q: 'A 2 mm wire stands in a 15 m/s wind. Taking St = 0.2, at what frequency does it shed vortices, in Hz?', answer: 1500, unit: 'Hz', tol: 0.02,
      why: 'f = St V/D = 0.2 × 15/0.002 = 1500 Hz.' },
    { q: 'A ship model tested in a towing tank at the full-scale Froude number also has the full-scale Reynolds number.', a: false,
      why: 'Froude scaling makes the model slower (V ∝ √L), while Reynolds scaling in the same water would need it faster (V ∝ 1/L). Towing tanks match Fr and correct the friction drag for Re.' },
    { q: 'Which number decides whether a raindrop is torn apart by the air?', choices: ['Reynolds', 'Weber', 'Froude', 'Strouhal'], a: 1,
      why: 'The Weber number compares the aerodynamic pressure (ρV²) with the surface tension holding the drop together (σ/D); drops break up above about 12.' },
    { q: 'Flying and swimming animals cruise at a Strouhal number of about…', choices: ['0.002–0.004', '0.2–0.4', '2–4', '20–40'], a: 1,
      why: 'Across birds, bats, insects, fish and whales the flapping frequency × stroke amplitude / speed falls in 0.2–0.4, where flapping propulsion is most efficient.' },
    { q: 'A displacement ship twice as long has a hull speed about…', choices: ['the same', '1.41 times higher', 'twice as high', 'four times as high'], a: 1,
      why: 'At a fixed Froude number V ∝ √L, so doubling L raises V by √2.' }
  ],
  problems: [
    { q: 'A ship with a service speed of 20 knots is tested as a 1:25 model at the same Froude number. How fast must the model be towed, in knots?', answer: 4, unit: 'kt', tol: 0.02,
      steps: ['Equal Fr: $V_m/\\sqrt{L_m} = V_p/\\sqrt{L_p}$, so $V_m = V_p\\sqrt{L_m/L_p} = 20 \\times \\sqrt{1/25}$.', '$= 4$ kt (2.1 m/s).'] }
  ],
  applications: [
    'Designing chimneys, cables, pipelines and bridge decks against vortex-induced vibration.',
    'Ship design and towing-tank testing at the full-scale Froude number.',
    'Sprays, fuel injection and aircraft icing, where the Weber number sets drop size.',
    'Propeller selection by advance ratio, and flutter analysis by reduced frequency.'
  ],
  history: 'In 1878 Vincenc Strouhal, in Würzburg, whirled wires through the air and found that the pitch of their tone was proportional to speed divided by diameter. A few years earlier William Froude had built the first ship-model towing tank at Torquay and proved his scaling law by predicting the resistance of the sloop HMS Greyhound from a model, before the ship itself was towed to check.',
  sim: [{ id: 'basics-cylinder-re', params: { re: 150 } }, { id: 'basics-dimensional', params: { problem: 'ship' } }]
}

);
