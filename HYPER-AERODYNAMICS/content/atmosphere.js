/* HYPER-AERODYNAMICS · content/atmosphere.js — branch "The Atmosphere":
 *   standard-atmosphere: isa, atmospheric-layers, lapse-rate, pressure-altitude, density-altitude, humidity-air
 *   weather-flight:      wind-gradient, atmospheric-turbulence, thermals-waves, wind-shear, icing
 * Simulations in sims/atmosphere.js (ids atm-*). */
Hyper.add(

/* ============================================================== THE STANDARD ATMOSPHERE */
{
  id: 'isa', parent: 'standard-atmosphere', title: 'The International Standard Atmosphere', level: 1,
  short: 'An agreed, average atmosphere — 15 °C and 1013.25 hPa at sea level, cooling by 6.5 °C per kilometre to −56.5 °C at 11 km — against which altimeters are calibrated and every aircraft performance figure is quoted.',
  keywords: ['ISA', 'standard atmosphere', 'ICAO standard atmosphere', 'sea-level conditions', '1013.25 hPa', '15 °C', 'tropopause', 'hydrostatic equation', 'density ratio', 'pressure ratio', 'geopotential altitude', 'US Standard Atmosphere', 'ISO 2533'],
  prereq: ['air-pressure', 'air-density', 'ideal-gas-air', 'physics:hydrostatic-pressure'],
  related: ['atmospheric-layers', 'lapse-rate', 'pressure-altitude', 'density-altitude', 'speed-of-sound', 'air-viscosity', 'airspeeds', 'lift-equation'],
  body: `
The real atmosphere never holds still: the sea-level pressure wanders between about 960 and 1040 hPa with the weather, the temperature swings with the seasons, and the air is warmer over the tropics than over the poles. Yet to compare two aircraft, to calibrate an altimeter or an airspeed indicator, or to print a takeoff chart, everyone needs the *same* air. The answer is a made-up atmosphere, agreed internationally: the **International Standard Atmosphere (ISA)** of ICAO and ISO 2533, identical below 32 km to the US Standard Atmosphere of 1976. It is dry air, at rest, obeying the [[ideal-gas-air|ideal gas law]] and [[physics:hydrostatic-pressure|hydrostatic balance]], with a temperature profile close to a year-round mid-latitude average.

### The recipe
A handful of sea-level numbers and a temperature profile define the whole thing:

| Sea-level quantity | ISA value |
|---|---|
| Temperature $T_0$ | 15 °C = 288.15 K |
| Pressure $p_0$ | 1013.25 hPa = 101 325 Pa = 29.92 inHg |
| Density $\\rho_0$ | 1.225 kg/m³ |
| [[speed-of-sound|Speed of sound]] $a_0$ | 340.3 m/s = 661.5 kt |
| [[air-viscosity|Viscosity]] $\\mu_0$ | 1.789 × 10⁻⁵ Pa·s |
| Gravity $g$ | 9.80665 m/s² |

The temperature falls linearly with height at the **lapse rate** $L = 6.5$ K per kilometre (about 2 °C per 1000 ft) up to the **tropopause** at 11 km, where it has reached −56.5 °C. It stays at −56.5 °C up to 20 km, then rises by 1 K/km to 32 km and by 2.8 K/km to 47 km, where the stratosphere ends near −2.5 °C (see [[atmospheric-layers]]).

### Where the pressure comes from
Pressure at any height is the weight of the air above each square metre. Climbing a thin layer $dh$ sheds the weight of that layer, $dp = -\\rho g\\, dh$, and the density follows from the gas law, $\\rho = p/(RT)$. Together, $dp/p = -g\\,dh/(RT)$: pressure falls by the same *fraction* for each metre, faster where the air is cold and dense. With the temperature falling linearly this integrates to a power law,

$$p = p_0\\left(1 - \\frac{L h}{T_0}\\right)^{g/(R L)},\\qquad \\frac{g}{RL} = 5.256,$$

and in the isothermal layer above 11 km to a plain exponential with a **scale height** $RT/g = 6.34$ km: every 6.34 km of climb divides the pressure by e.

### The numbers worth knowing

| Height | T (°C) | p (hPa) | ρ (kg/m³) | σ = ρ/ρ₀ | a (m/s) |
|---|---|---|---|---|---|
| 0 | 15.0 | 1013.25 | 1.225 | 1.000 | 340.3 |
| 1000 m | 8.5 | 898.7 | 1.112 | 0.907 | 336.4 |
| 2000 m | 2.0 | 795.0 | 1.007 | 0.822 | 332.5 |
| 3000 m | −4.5 | 701.1 | 0.909 | 0.742 | 328.6 |
| 5000 m | −17.5 | 540.2 | 0.736 | 0.601 | 320.5 |
| 8000 m | −37.0 | 356.0 | 0.525 | 0.429 | 308.1 |
| 11 000 m | −56.5 | 226.3 | 0.364 | 0.297 | 295.1 |
| 15 000 m | −56.5 | 120.4 | 0.194 | 0.158 | 295.1 |
| 20 000 m | −56.5 | 54.7 | 0.088 | 0.072 | 295.1 |

Pressure halves by about 5.5 km, density by 6.7 km. At an airliner's cruising height the air presses with less than a quarter of its sea-level pressure and has under a third of the density — which is why the same wing must fly about 1.8 times faster up there (see [[lift-equation]]). Heights in ISA are *geopotential*: they allow for gravity weakening with height, a correction of only 19 m at 11 km.

### What ISA is not
It is a ruler, not a forecast. A summer afternoon may be ISA + 20 (35 °C at sea level), a winter night ISA − 25; the tropopause lies near 8 km over the poles and 17 km over the equator; real air carries water vapour. Performance charts therefore quote the **ISA deviation** — "ISA + 15" means 15 °C warmer than standard at that height — and the day is summed up by the [[density-altitude|density altitude]]. Altimeters, for their part, turn pressure into height *as if* the day were standard (see [[pressure-altitude]]).

> [!key] Two laws — the weight of the air above (hydrostatics) and $p = \\rho R T$ — plus an agreed temperature profile give the whole standard atmosphere. Try any height in the [atmosphere calculator](#/tools/flight/atmosphere).
`,
  ideas: [
    'ISA is an agreed average atmosphere: 15 °C, 1013.25 hPa and 1.225 kg/m³ at sea level.',
    'Temperature falls 6.5 °C per km (about 2 °C per 1000 ft) up to the tropopause at 11 km, then stays at −56.5 °C to 20 km.',
    'Hydrostatic balance plus the ideal gas law give the pressure: a power law in the troposphere, an exponential (scale height 6.34 km) above.',
    'Pressure halves by about 5.5 km; at 11 km the density is under a third of its sea-level value.',
    'Real days are described by their deviation from ISA; altimeters and performance charts are built on it.'
  ],
  pitfalls: [
    'ISA describes the actual weather — It describes a standard, average day. Real temperatures and pressures differ every day, which is why pilots set the altimeter and correct performance for the actual conditions.',
    'Pressure falls linearly with height — It falls by a fixed fraction per metre (exactly exponentially where the temperature is constant), so the first kilometre loses 115 hPa but the kilometre from 10 to 11 km loses only 38 hPa.',
    'Temperature keeps falling all the way up — It stops at the tropopause; in the stratosphere it is constant and then rises, because ozone absorbs sunlight there.'
  ],
  formulas: [
    {
      name: 'Temperature in the troposphere',
      expr: 'T = T0 - L*h', tex: 'T = T_0 - L\\,h',
      vars: {
        T: { name: 'temperature at height h', q: 'temperature', unit: '°C' },
        T0: { name: 'sea-level temperature', q: 'temperature', unit: '°C', value: 15, tex: 'T_0' },
        L: { name: 'temperature lapse rate', unit: 'K/m', value: 0.0065 },
        h: { name: 'geopotential height', q: 'length', unit: 'm', value: 3000, min: 0, max: 11000 }
      },
      note: 'From sea level to the tropopause at 11 km. ISA: T₀ = 15 °C and L = 0.0065 K/m (6.5 °C per km, about 2 °C per 1000 ft). Raising T₀ models a warm day with the same lapse rate.',
      practice: { unknowns: ['T', 'h'] },
      stories: {
        T: 'On a standard day with {T0} at sea level, what is the temperature at {h}?',
        h: 'On a standard day with {T0} at sea level, the outside air temperature reads {T}. At what height is the aircraft?'
      }
    },
    {
      name: 'Pressure in the troposphere',
      expr: 'p = p0*(1 - L*h/T0)^(g/(Rair*L))', tex: 'p = p_0\\left(1 - \\frac{L\\,h}{T_0}\\right)^{g/(R\\,L)}',
      vars: {
        p: { name: 'pressure at height h', q: 'pressure', unit: 'hPa' },
        p0: { name: 'sea-level pressure', q: 'pressure', unit: 'hPa', value: 1013.25, tex: 'p_0' },
        L: { name: 'temperature lapse rate', unit: 'K/m', value: 0.0065 },
        h: { name: 'geopotential height', q: 'length', unit: 'm', value: 3000, min: 0, max: 11000 },
        T0: { name: 'sea-level temperature', q: 'temperature', unit: '°C', value: 15, tex: 'T_0' },
        g: { const: 'g' },
        Rair: { const: 'Rair', tex: 'R' }
      },
      note: 'Hydrostatic balance with a linear temperature fall. With the ISA values the exponent g/(RL) is 5.256. Valid to 11 km.',
      practice: { unknowns: ['p', 'h'] },
      stories: {
        p: 'What is the standard-atmosphere pressure at {h}, with {p0} and {T0} at sea level?',
        h: 'The outside pressure is {p}. At what height does the standard atmosphere (sea level {p0}, {T0}) have this pressure?'
      }
    },
    {
      name: 'Density from the gas law',
      expr: 'rho = p/(Rair*T)', tex: '\\rho = \\frac{p}{R\\,T}',
      vars: {
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', tex: '\\rho' },
        p: { name: 'pressure', q: 'pressure', unit: 'hPa', value: 701.1 },
        Rair: { const: 'Rair', tex: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: -4.5 }
      },
      note: 'Dry air, R = 287.05 J/(kg·K). The defaults are ISA at 3000 m.',
      stories: {
        rho: 'What is the density of dry air at {p} and {T}?',
        T: 'Dry air at {p} has a density of {rho}. What is its temperature?'
      }
    },
    {
      name: 'Pressure in the isothermal layer (11–20 km)',
      expr: 'p = p11*exp(-g*(h - h11)/(Rair*T11))', tex: 'p = p_{11}\\, e^{-g\\,(h - h_{11})/(R\\,T_{11})}',
      vars: {
        p: { name: 'pressure at height h', q: 'pressure', unit: 'hPa' },
        p11: { name: 'pressure at the tropopause', q: 'pressure', unit: 'hPa', value: 226.32, tex: 'p_{11}' },
        g: { const: 'g' },
        h: { name: 'geopotential height', q: 'length', unit: 'm', value: 15000, min: 11000, max: 20000 },
        h11: { name: 'height of the tropopause', q: 'length', unit: 'm', value: 11000, fixed: true, tex: 'h_{11}' },
        Rair: { const: 'Rair', tex: 'R' },
        T11: { name: 'temperature of the layer', q: 'temperature', unit: '°C', value: -56.5, tex: 'T_{11}' }
      },
      note: 'At constant temperature the pressure falls exponentially, by a factor e every RT/g = 6.34 km.',
      practice: { unknowns: ['p', 'h'] },
      stories: {
        p: 'Above the tropopause ({p11} at 11 km, {T11}), what is the pressure at {h}?',
        h: 'A high-altitude aircraft measures {p} outside, in the isothermal layer at {T11}. How high is it?'
      }
    }
  ],
  examples: [
    {
      title: 'A standard day at 3000 m',
      q: 'Find the ISA temperature, pressure and density at 3000 m, and the density ratio σ.',
      steps: [
        'Temperature: $T = 288.15 - 0.0065 \\times 3000 = 268.65$ K $= -4.5$ °C.',
        'Pressure: $p = 1013.25 \\times (268.65/288.15)^{5.256} = 1013.25 \\times 0.6919 = 701.1$ hPa.',
        'Density: $\\rho = p/(RT) = 70\\,110/(287.05 \\times 268.65) = 0.909$ kg/m³.',
        'Density ratio: $\\sigma = 0.909/1.225 = 0.742$ — the air is about a quarter thinner than at sea level.'
      ],
      a: '−4.5 °C, 701 hPa, 0.909 kg/m³, σ = 0.742.'
    },
    {
      title: 'Where is the half-way point?',
      q: 'At what height does the standard atmosphere have half its sea-level pressure, 506.6 hPa? What does that say about the mass of the air?',
      steps: [
        'Invert the power law: $1 - Lh/T_0 = (p/p_0)^{RL/g} = 0.5^{0.1903} = 0.8764$.',
        '$h = (T_0/L)(1 - 0.8764) = 44\\,331 \\times 0.1236 = 5480$ m.',
        'Pressure is the weight of the air above, so half of the atmosphere\'s mass lies below about 5.5 km — lower than the summit of Kilimanjaro (5895 m).'
      ],
      a: 'About 5.5 km: half of all the air is below that height.'
    },
    {
      title: 'Above the tropopause',
      q: 'Find the ISA pressure at 15 000 m, in the isothermal layer that starts at 11 000 m with 226.32 hPa and −56.5 °C.',
      steps: [
        'Scale height: $RT/g = 287.05 \\times 216.65/9.807 = 6341$ m.',
        '$p = 226.32 \\times e^{-4000/6341} = 226.32 \\times 0.5322 = 120.4$ hPa.',
        'That is 12 % of sea-level pressure; the density is $12\\,045/(287.05 \\times 216.65) = 0.194$ kg/m³.'
      ],
      a: '120 hPa, with a density of 0.194 kg/m³ (σ = 0.158).'
    }
  ],
  quiz: [
    { q: 'From sea level to about 5.5 km, the ISA pressure falls by roughly…', choices: ['a tenth', 'a quarter', 'a half', 'three quarters'], a: 2,
      why: 'At 5.5 km the pressure is about 505 hPa, half of 1013 hPa — so half of the atmosphere\'s mass lies below that height.' },
    { q: 'Why does the temperature stop falling at the tropopause?', choices: ['the air there is too thin to cool any further', 'above it, ozone absorbs sunlight and warms the air, so convection from below cannot continue', 'the jet stream mixes warm air upwards', 'the speed of sound becomes constant there'], a: 1,
      why: 'The troposphere is heated from the ground and cools upwards; the stratosphere is heated from within by ozone absorbing ultraviolet light. That warm lid stops convection, so the lapse rate changes sign.' },
    { q: 'Using ISA, find the density ratio σ at 11 000 m, where p = 226.3 hPa and T = −56.5 °C.', answer: 0.297, tol: 0.02,
      why: 'σ = (p/p₀)(T₀/T) = (226.3/1013.25) × (288.15/216.65) = 0.2233 × 1.3300 = 0.297.' },
    { q: 'In ISA, the speed of sound at 11 km equals the speed of sound at 20 km.', a: true,
      why: 'The speed of sound depends only on temperature, a = √(γRT), and ISA holds −56.5 °C from 11 to 20 km: 295.1 m/s at both.' },
    { q: 'A performance chart gives figures for "ISA + 20". What does that mean?', choices: ['the aircraft is 20 % heavier than standard', 'the air is 20 °C warmer than the standard atmosphere at that height', 'the pressure is 20 hPa above standard', 'the height is 20 000 ft'], a: 1,
      why: 'ISA deviation is a temperature difference: at sea level ISA + 20 is 35 °C; at 3000 m, where ISA is −4.5 °C, it is +15.5 °C.' }
  ],
  problems: [
    { q: 'What is the ISA air density at 1500 m?', answer: 1.058, unit: 'kg/m³', tol: 0.02,
      steps: ['$T = 288.15 - 0.0065 \\times 1500 = 278.4$ K.', '$p = 1013.25 \\times (278.4/288.15)^{5.256} = 845.6$ hPa.', '$\\rho = 84\\,560/(287.05 \\times 278.4) = 1.058$ kg/m³.'] },
    { q: 'At what height is the ISA temperature 0 °C?', answer: 2308, unit: 'm', tol: 0.02,
      steps: ['$h = (T_0 - T)/L = 15/0.0065 = 2308$ m — about 7600 ft: the freezing level of a standard day.'] }
  ],
  applications: [
    'Calibrating altimeters and airspeed indicators, which convert pressures into heights and speeds using ISA.',
    'Aircraft and engine performance charts, quoted for ISA and for deviations from it (ISA + 15, ISA − 10).',
    'Reducing wind-tunnel and flight-test data to standard conditions so that different days can be compared.',
    'First estimates of drag and lift for rockets, balloons and high-flying drones.'
  ],
  history: 'Standard atmospheres began in the 1920s, when the performance of aircraft had to be compared between countries and days. NACA published one in 1925; ICAO adopted its Standard Atmosphere in 1952 and extended it in 1964, and ISO 2533 (1975) carries the same numbers. The US Standard Atmosphere of 1976 continues it to 1000 km for spaceflight; below 32 km they all agree.',
  sim: 'atm-isa-profile'
},

{
  id: 'atmospheric-layers', parent: 'standard-atmosphere', title: 'Layers of the atmosphere', level: 1,
  short: 'The atmosphere is layered by how its temperature changes with height: the weather-filled troposphere, the calm stratosphere warmed by ozone, the frigid mesosphere and the thin, hot thermosphere — with nearly all the air, and all the flying, in the lowest two.',
  keywords: ['troposphere', 'tropopause', 'stratosphere', 'ozone layer', 'mesosphere', 'thermosphere', 'exosphere', 'Kármán line', 'scale height', 'jet stream', 'mass of the atmosphere', 'stratopause'],
  prereq: ['isa', 'air-pressure', 'physics:hydrostatic-pressure'],
  related: ['lapse-rate', 'thermals-waves', 'atmospheric-turbulence', 'hypersonic-flight', 'ceiling', 'turbofan'],
  body: `
Climb straight up and the thermometer tells a story in chapters. Each chapter — a **layer** — is named for what the temperature does in it, and each boundary is called a "-pause".

| Layer | Height | Temperature | What happens there |
|---|---|---|---|
| Troposphere | 0 to 8 km (poles) – 17 km (tropics) | falls about 6.5 °C per km | all the weather; three quarters of the mass; nearly all flying |
| Stratosphere | tropopause to about 50 km | constant, then rising to near 0 °C | ozone absorbs ultraviolet light; very stable air |
| Mesosphere | 50 to 85 km | falls to about −90 °C | meteors burn up; the coldest place on Earth |
| Thermosphere | 85 to 500–1000 km | rises to 500–1500 °C | aurora; the International Space Station (≈ 400 km) |
| Exosphere | above | — | atoms leak away into space |

### Why the layers exist
The **troposphere** ("turning sphere") is heated from below: sunlight warms the ground, the ground warms the air, and the warm air rises, expands and cools. It is constantly stirred — convection, clouds, storms. Its top, the **tropopause**, lies where convection runs out of strength: high over the tropics, where the ground is hot and storms tower (16–17 km, about −75 °C — colder than over the poles), low near the poles (about 8 km). The jet streams blow just under it.

In the **stratosphere** ("layered sphere") ozone absorbs the sun's ultraviolet light and warms the air from inside. Warm air above cool air is stable (see [[lapse-rate]]), so the stratosphere is calm and layered — the reason airliners like to cruise near the tropopause, above most of the weather. Concorde cruised at 18 km, the U-2 at 21 km, research balloons float above 40 km.

Higher still, the **mesosphere** has too little ozone to heat it and cools to the coldest temperatures in the atmosphere; meteors burn up there. The **thermosphere** absorbs the sun's extreme ultraviolet: its few molecules move very fast — a "temperature" of over 1000 °C — but there are so few of them that they could not warm your hand. The **Kármán line** at 100 km is the conventional edge of space: to hold itself up by wing lift there, an aircraft would need nearly orbital speed.

### How the mass is stacked
The pressure at any height is the weight of all the air above one square metre, so $p/p_0$ is the fraction of the atmosphere's mass that lies *above* that height. Pressure falls roughly exponentially, $p \\approx p_0 e^{-h/H}$, with a **scale height** $H = RT/g$ of 8.4 km at 15 °C and 6.3 km at −56.5 °C. So:

- half of the air lies below 5.5 km;
- about 78 % lies below the ISA tropopause (11 km);
- 90 % below 16 km, 99 % below 31 km.

Everything above the lower stratosphere is, for an aerodynamicist, nearly a vacuum — but a vacuum that still heats a returning spacecraft to thousands of degrees (see [[hypersonic-flight]]).

The whole atmosphere weighs about $5 \\times 10^{18}$ kg: the mean surface pressure times the Earth's surface area, divided by $g$. That is a millionth of the Earth's mass.

> [!fact] Standing on the summit of Everest (8849 m) you are above two thirds of the atmosphere: the standard atmosphere gives 314 hPa there.
`,
  ideas: [
    'The layers are defined by the temperature trend: falling in the troposphere, rising in the stratosphere, falling in the mesosphere, rising in the thermosphere.',
    'The troposphere is heated from the ground and stirred by convection; its top is highest (and coldest) over the tropics.',
    'Ozone heating makes the stratosphere stable and calm; airliners cruise near its base.',
    'Pressure is the weight of the air above, so p/p₀ is the fraction of the atmosphere\'s mass above that height: half is below 5.5 km, 99 % below 31 km.',
    'The scale height RT/g (about 6–8 km) is the height over which pressure falls by a factor e.'
  ],
  pitfalls: [
    'The tropopause is at the same height everywhere — It lies near 17 km over the equator and near 8 km over the poles, and moves with the seasons and the weather.',
    'The thermosphere is hot, so a spacecraft there would burn — Its molecules are very energetic, but so sparse that they carry almost no heat; objects in orbit there are cold on their shaded side.',
    'The atmosphere ends at a definite height — It thins out gradually; the Kármán line at 100 km is a convention, and drag still slowly pulls down satellites at 400 km.'
  ],
  formulas: [
    {
      name: 'Scale height',
      expr: 'Hs = Rair*T/g', tex: 'H = \\frac{R\\,T}{g}',
      vars: {
        Hs: { name: 'scale height', q: 'length', unit: 'km', tex: 'H' },
        Rair: { const: 'Rair', tex: 'R' },
        T: { name: 'temperature of the layer', q: 'temperature', unit: '°C', value: -56.5 },
        g: { const: 'g' }
      },
      note: 'The height over which the pressure of an isothermal layer falls by a factor e (to 37 %). 6.34 km at −56.5 °C, 8.43 km at 15 °C.',
      stories: { Hs: 'What is the scale height of a layer of air at {T}?', T: 'A layer of air has a scale height of {Hs}. What is its temperature?' }
    },
    {
      name: 'Barometric law (isothermal atmosphere)',
      expr: 'p = p0*exp(-h/Hs)', tex: 'p = p_0\\, e^{-h/H}',
      vars: {
        p: { name: 'pressure at height h', q: 'pressure', unit: 'hPa' },
        p0: { name: 'pressure at the base', q: 'pressure', unit: 'hPa', value: 1013.25, tex: 'p_0' },
        h: { name: 'height above the base', q: 'length', unit: 'km', value: 5.5 },
        Hs: { name: 'scale height', q: 'length', unit: 'km', value: 8, tex: 'H' }
      },
      note: 'Exact for a layer at constant temperature; with an average scale height of about 8 km it is a fair first estimate for the lower atmosphere.',
      practice: { unknowns: ['p', 'h'] },
      stories: {
        p: 'With a scale height of {Hs}, what is the pressure {h} above a base where it is {p0}?',
        h: 'With a scale height of {Hs} and {p0} at the base, at what height is the pressure {p}?'
      }
    },
    {
      name: 'Mass of an atmosphere',
      expr: 'M = 4*pi*Re^2*ps/g', tex: 'M = \\frac{4\\pi R_\\oplus^2\\, p_s}{g}',
      vars: {
        M: { name: 'mass of the atmosphere', q: 'mass', unit: 'kg' },
        Re: { const: 'Rearth' },
        ps: { name: 'mean surface pressure', q: 'pressure', unit: 'hPa', value: 985, tex: 'p_s' },
        g: { const: 'g' }
      },
      note: 'Surface pressure is the weight of the air per square metre. The mean surface pressure (985 hPa) is lower than the sea-level value because much of the land is high. For Mars use R = 3390 km, p = 6.1 hPa, g = 3.71 m/s².',
      stories: { M: 'A planet of radius {Re} has a mean surface pressure of {ps} and surface gravity {g}. What is the mass of its atmosphere?' }
    }
  ],
  examples: [
    {
      title: 'How much of the air is below the tropopause?',
      q: 'In ISA the pressure at 11 km is 226.3 hPa. What fraction of the atmosphere\'s mass lies below 11 km?',
      steps: [
        'The pressure is the weight of the air above, so the fraction above 11 km is $226.3/1013.25 = 0.223$.',
        'The fraction below is $1 - 0.223 = 0.777$.'
      ],
      a: 'About 78 % of the atmosphere\'s mass is in the troposphere (at mid-latitudes; more over the tropics).'
    },
    {
      title: 'Weighing the atmosphere',
      q: 'Estimate the mass of the Earth\'s atmosphere from a mean surface pressure of 985 hPa.',
      steps: [
        'Surface area of the Earth: $4\\pi R^2 = 4\\pi (6.371 \\times 10^6)^2 = 5.10 \\times 10^{14}$ m².',
        'Total weight: $98\\,500 \\times 5.10 \\times 10^{14} = 5.02 \\times 10^{19}$ N.',
        'Mass: $5.02 \\times 10^{19}/9.807 = 5.1 \\times 10^{18}$ kg.'
      ],
      a: 'About 5.1 × 10¹⁸ kg — roughly a millionth of the Earth\'s mass.'
    }
  ],
  quiz: [
    { q: 'Why is the tropopause over the equator colder (about −75 °C) than over the poles (about −55 °C)?', choices: ['the equator receives less sunlight', 'vigorous tropical convection lifts it to 16–17 km, and the air keeps cooling with height all the way up', 'the ozone layer is thicker over the equator', 'the Earth spins faster at the equator'], a: 1,
      why: 'The troposphere cools with height at roughly the same rate everywhere; over the tropics it simply goes much higher before convection stops, so its top is colder.' },
    { q: 'Airliners like to cruise near the tropopause mainly because…', choices: ['the air there is warmest', 'thin air cuts drag at a given true airspeed, jet engines are efficient there, and most weather lies below', 'the ozone protects passengers from radiation', 'there is never any wind there'], a: 1,
      why: 'Low density means low drag for the speed, cold air helps engine efficiency, and the stable stratosphere above the tropopause is mostly free of convective weather — though jet streams and clear-air turbulence live there.' },
    { q: 'The thermosphere, at 500–1500 °C, would feel hot to a bare hand.', a: false,
      why: 'Temperature measures the energy of each molecule, but the thermosphere has so few molecules that almost no heat reaches the hand; it would lose heat by radiation instead.' },
    { q: 'With a scale height of 8 km, what fraction of sea-level pressure remains at 16 km?', answer: 0.135, tol: 0.03,
      why: 'p/p₀ = e^(−16/8) = e^(−2) = 0.135.' },
    { q: 'Roughly what fraction of the atmosphere\'s mass lies below 11 km?', choices: ['about 25 %', 'about 50 %', 'about 78 %', 'about 99 %'], a: 2,
      why: 'In ISA the pressure at 11 km is 22 % of the sea-level value, so 78 % of the mass is below.' }
  ],
  problems: [
    { q: 'What is the scale height of air at the ISA sea-level temperature of 15 °C?', answer: 8.43, unit: 'km', tol: 0.02,
      steps: ['$H = RT/g = 287.05 \\times 288.15/9.807 = 8434$ m.'] }
  ],
  applications: [
    'Choosing cruise altitudes near the tropopause, above most convective weather.',
    'High-altitude balloons and solar "pseudo-satellites" that loiter in the calm lower stratosphere near 20 km.',
    'Re-entry and satellite-drag calculations, which need the thin upper layers.',
    'Weather forecasting: the height of the tropopause limits how tall thunderstorms grow.'
  ],
  history: 'In 1902 Léon Teisserenc de Bort in France and Richard Assmann in Germany, launching hundreds of instrumented balloons, found independently that the temperature stops falling at around 11 km. Teisserenc de Bort later named the two regions the troposphere and the stratosphere.',
  sim: { id: 'atm-isa-profile', params: { view: 47 } }
},

{
  id: 'lapse-rate', parent: 'standard-atmosphere', title: 'The temperature lapse rate', level: 2,
  short: 'How fast the temperature falls with height. Comparing the actual (environmental) lapse rate with the rate at which a rising parcel of air cools — 9.8 °C per km when dry, about 5–6 °C per km in cloud — decides whether the air is stable or ready to break into thermals and storms.',
  keywords: ['lapse rate', 'environmental lapse rate', 'dry adiabatic lapse rate', 'saturated adiabatic lapse rate', 'moist adiabatic', 'stability', 'inversion', 'conditional instability', 'potential temperature', 'Brunt–Väisälä frequency', 'buoyancy frequency', 'cloud base', 'freezing level'],
  prereq: ['isa', 'physics:thermodynamic-processes', 'physics:first-law-thermodynamics', 'physics:buoyancy'],
  related: ['thermals-waves', 'humidity-air', 'atmospheric-layers', 'atmospheric-turbulence', 'icing', 'wind-gradient'],
  body: `
### Three lapse rates
The **environmental lapse rate** (ELR) is what a weather balloon measures: how fast the temperature of the surrounding air actually falls with height today. The standard atmosphere uses 6.5 °C per km, but real air may cool by 10 °C per km over a sun-baked field, or even warm with height in an **inversion**.

The **dry adiabatic lapse rate** (DALR) is how fast a *parcel* of air cools if it is lifted without exchanging heat with its surroundings. Rising, it meets lower pressure, expands, and pays for the expansion with its own internal energy. The first law of thermodynamics with hydrostatic balance gives $c_p\\,dT = -g\\,dh$, so

$$\\Gamma_d = \\frac{g}{c_p} = 9.8\\ \\mathrm{K/km}\\ (\\approx 3\\ ^\\circ\\mathrm{C}\\ \\text{per}\\ 1000\\ \\mathrm{ft}).$$

The **saturated (moist) adiabatic lapse rate** (SALR) applies once the parcel is saturated and cloud is forming: condensation releases latent heat, so the parcel cools more slowly — about 4 K/km in warm, moist air near the ground, 6–7 K/km higher up, approaching the dry value in very cold air.

### The parcel test: stable or unstable?
Push a parcel up a little. It cools at its adiabatic rate; the air around it has the environment's temperature. If the parcel ends up **colder** (denser) than its surroundings it sinks back — the air is **stable**. If it ends up **warmer** it keeps rising — **unstable**.

| Environment cools… | Clear (unsaturated) air | Cloudy (saturated) air | Called |
|---|---|---|---|
| slower than the SALR (or warms: inversion) | stable | stable | absolutely stable |
| between the SALR and the DALR | stable | unstable | conditionally unstable |
| faster than the DALR | unstable | unstable | absolutely unstable |

The middle case is the usual one: clear air is stable until something lifts it to its cloud base, after which the cloud grows on its own — the recipe for towering cumulus and thunderstorms. Absolutely unstable layers exist only in the lowest few hundred metres over hot ground, where they drive [[thermals-waves|thermals]].

A tidy way to test stability is the **potential temperature** $\\theta = T(p_0/p)^{R/c_p}$, the temperature a parcel would have if brought dry-adiabatically to 1000 hPa. Air is stable where $\\theta$ increases with height.

### Stable air rings like a spring
A parcel displaced in stable air overshoots and oscillates about its level at the **buoyancy (Brunt–Väisälä) frequency** $N = \\sqrt{(g/T)(\\Gamma_d - \\Gamma)}$. In the standard troposphere $N \\approx 0.011\\ \\mathrm{s^{-1}}$ — a period of about 10 minutes; in the stratosphere or an inversion the air is stiffer, with $N \\approx 0.02\\ \\mathrm{s^{-1}}$ (5 minutes). This springiness is what turns wind over a ridge into mountain waves.

### Cloud base and freezing level
A rising unsaturated parcel cools at 9.8 K/km while its dew point falls only about 1.8 K/km; the two meet at the cloud base, $h \\approx 125\\ \\mathrm{m} \\times (T - T_d)$, about 400 ft per °C of **spread**. With 25 °C and a dew point of 13 °C, cumulus bases are near 1500 m. The **freezing level** — where [[icing]] can begin — is roughly the surface temperature divided by the lapse rate: 15 °C at 6.5 K/km puts it at 2.3 km.

> [!tip] Stable air: smooth flight, stratus, haze and fog trapped under inversions. Unstable air: bumps, good visibility, cumulus, showers and storms.
`,
  ideas: [
    'The environmental lapse rate is measured; the adiabatic lapse rates describe a parcel that is lifted.',
    'A dry parcel cools at g/c_p = 9.8 K/km; a saturated one at about 4–7 K/km, because condensation releases latent heat.',
    'If a lifted parcel ends up colder than its surroundings the air is stable; if warmer, unstable.',
    'Stable air oscillates at the buoyancy frequency N (a period of about 10 minutes in the troposphere).',
    'Cloud base is about 125 m (400 ft) per °C of temperature–dew point spread.'
  ],
  pitfalls: [
    'The standard 6.5 °C per km is how a rising parcel cools — A dry parcel cools at 9.8 °C per km. The 6.5 is an average of the environment; stability depends on comparing the two.',
    'Warm air rises, so a warm day is always unstable — What matters is how quickly the temperature falls with height. A warm day with a warm layer aloft (an inversion) is very stable.',
    'Rising air cools because it gets closer to cold space — It cools because it expands as the pressure drops; no heat is lost.'
  ],
  formulas: [
    {
      name: 'Dry adiabatic lapse rate',
      expr: 'Gd = g/cp', tex: '\\Gamma_d = \\frac{g}{c_p}',
      vars: {
        Gd: { name: 'dry adiabatic lapse rate', unit: 'K/m', tex: '\\Gamma_d' },
        g: { const: 'g' },
        cp: { name: 'specific heat of air at constant pressure', q: 'specificheat', unit: 'J/(kg·K)', value: 1004.7, tex: 'c_p' }
      },
      note: '0.0098 K/m = 9.8 K per km for dry air. On Mars (g = 3.71 m/s², CO₂ with c_p ≈ 770 J/(kg·K)) it is about 4.8 K/km.',
      stories: { Gd: 'How fast does a rising parcel of gas with {cp} cool, with gravity {g}?' }
    },
    {
      name: 'Potential temperature',
      expr: 'theta = T*(p0/p)^kappa', tex: '\\theta = T\\left(\\frac{p_0}{p}\\right)^{\\kappa}',
      vars: {
        theta: { name: 'potential temperature', q: 'temperature', unit: 'K', tex: '\\theta' },
        T: { name: 'air temperature', q: 'temperature', unit: '°C', value: 5 },
        p0: { name: 'reference pressure', q: 'pressure', unit: 'hPa', value: 1000, fixed: true, tex: 'p_0' },
        p: { name: 'air pressure', q: 'pressure', unit: 'hPa', value: 850 },
        kappa: { name: 'R/c_p of dry air', value: 0.2857, fixed: true, tex: '\\kappa' }
      },
      note: 'The temperature the air would have if brought dry-adiabatically to 1000 hPa. It stays constant for a parcel moving without condensation; air is stable where θ rises with height.',
      practice: { unknowns: ['theta', 'T'] },
      stories: { theta: 'Air at {p} has a temperature of {T}. What is its potential temperature?', T: 'Air with a potential temperature of {theta} is at {p}. What is its actual temperature?' }
    },
    {
      name: 'Buoyancy (Brunt–Väisälä) frequency',
      expr: 'N = sqrt(g/T*(Gd - G))', tex: 'N = \\sqrt{\\frac{g}{T}\\left(\\Gamma_d - \\Gamma\\right)}',
      vars: {
        N: { name: 'buoyancy frequency', q: 'angvel', unit: 'rad/s' },
        g: { const: 'g' },
        T: { name: 'air temperature', q: 'temperature', unit: '°C', value: 0 },
        Gd: { name: 'dry adiabatic lapse rate', unit: 'K/m', value: 0.0098, tex: '\\Gamma_d' },
        G: { name: 'environmental lapse rate', unit: 'K/m', value: 0.0065, signed: true, tex: '\\Gamma' }
      },
      note: 'Only real when the air is stable (Γ < Γ_d). A displaced parcel oscillates with period 2π/N; negative for an inversion Γ, which makes N larger.',
      practice: { unknowns: ['N', 'G'] },
      stories: { N: 'Air at {T} cools with height at {G}. At what frequency does a displaced parcel oscillate?', G: 'A parcel at {T} oscillates at {N}. What is the environmental lapse rate?' }
    },
    {
      name: 'Cloud base of a rising parcel',
      expr: 'hb = (T - Td)/(Gd - Gdp)', tex: 'h_b = \\frac{T - T_d}{\\Gamma_d - \\Gamma_{dp}}',
      vars: {
        hb: { name: 'height of the cloud base above the ground', q: 'length', unit: 'm', tex: 'h_b' },
        T: { name: 'surface temperature', q: 'temperature', unit: '°C', value: 25 },
        Td: { name: 'surface dew point', q: 'temperature', unit: '°C', value: 13, tex: 'T_d' },
        Gd: { name: 'dry adiabatic lapse rate', unit: 'K/m', value: 0.0098, tex: '\\Gamma_d' },
        Gdp: { name: 'fall of the dew point in a rising parcel', unit: 'K/m', value: 0.0018, tex: '\\Gamma_{dp}' }
      },
      note: 'The lifting condensation level: 1/(0.0098 − 0.0018) = 125 m per kelvin of spread, about 400 ft per °C. For cumulus formed by thermals from the surface.',
      practice: { unknowns: ['hb', 'Td'] },
      stories: { hb: 'At the surface it is {T} with a dew point of {Td}. Where will cumulus clouds form?', Td: 'Cumulus bases are at {hb} and the surface temperature is {T}. What is the dew point?' }
    }
  ],
  examples: [
    {
      title: 'Stable or unstable?',
      q: 'A sounding shows the temperature falling 8 °C per km through the lowest 3 km. How will clear air and cloudy air behave?',
      steps: [
        'Clear air: a lifted parcel cools at 9.8 °C/km, faster than the environment\'s 8, so it ends up colder than its surroundings and sinks back — stable.',
        'Cloudy air: a saturated parcel cools at about 6 °C/km, slower than 8, so it ends up warmer and keeps rising — unstable.',
        'The layer is conditionally unstable: once thermals or a hill lift air to its cloud base, cumulus will grow vigorously.'
      ],
      a: 'Conditionally unstable — stable for clear air, unstable for cloud: expect building cumulus.'
    },
    {
      title: 'Cloud base and freezing level in a cumulus',
      q: 'At the surface it is 25 °C with a dew point of 13 °C. Where is the cloud base, and at what height inside the cloud is 0 °C reached if the cloud air cools at 6 °C per km?',
      steps: [
        'Cloud base: $h_b = 12/0.008 = 1500$ m (about 4900 ft).',
        'Temperature at cloud base: $25 - 9.8 \\times 1.5 = 10.3$ °C.',
        'Freezing level in the cloud: $10.3/6 = 1.7$ km above the base, so about 3.2 km.'
      ],
      a: 'Cloud base 1500 m; the cloud air reaches 0 °C at about 3.2 km — above that, supercooled droplets can cause icing.'
    },
    {
      title: 'How long does stable air take to ring?',
      q: 'Find the buoyancy frequency and period for air at 0 °C cooling at the standard 6.5 K/km.',
      steps: [
        '$N^2 = (9.807/273.15)(0.0098 - 0.0065) = 0.0359 \\times 0.0033 = 1.18 \\times 10^{-4}\\ \\mathrm{s^{-2}}$.',
        '$N = 0.0109$ rad/s; period $2\\pi/N = 577$ s.'
      ],
      a: 'N ≈ 0.011 s⁻¹: a displaced parcel bobs with a period of about 10 minutes.'
    }
  ],
  quiz: [
    { q: 'A parcel of clear, dry air is lifted 1 km. By about how much does it cool?', choices: ['6.5 °C', '9.8 °C', '2 °C', 'it depends on the surrounding air'], a: 1,
      why: 'An unsaturated parcel cools at the dry adiabatic rate g/c_p = 9.8 °C per km whatever the surroundings do; 6.5 °C per km is the average environment in ISA.' },
    { q: 'Why does a saturated (cloudy) parcel cool more slowly than a dry one as it rises?', choices: ['cloud droplets absorb sunlight', 'water vapour condensing releases latent heat, which offsets part of the expansion cooling', 'moist air has a higher density', 'clouds are insulated by the air around them'], a: 1,
      why: 'Every gram of vapour that condenses gives up about 2.5 kJ of latent heat to the parcel, so it cools at about 4–7 °C per km instead of 9.8.' },
    { q: 'The environment cools at 7 °C per km. The air is…', choices: ['absolutely stable', 'conditionally unstable: stable for clear air, unstable once saturated', 'absolutely unstable', 'neutral'], a: 1,
      why: '7 lies between the saturated rate (about 6) and the dry rate (9.8).' },
    { q: 'Inside a temperature inversion the air is very stable, and smoke and haze are trapped below it.', a: true,
      why: 'In an inversion the temperature rises with height, so any parcel pushed up is immediately colder than its surroundings and sinks back: nothing mixes through.' },
    { q: 'The surface temperature is 30 °C and the dew point 18 °C. Estimate the height of cumulus bases, in metres.', answer: 1500, unit: 'm', tol: 0.05,
      why: '125 m per °C of spread: 125 × 12 = 1500 m, about 4900 ft.' }
  ],
  problems: [
    { q: 'Find the potential temperature of air at 700 hPa and −5 °C.', answer: 296.9, unit: 'K', tol: 0.01,
      steps: ['$\\theta = T (1000/p)^{0.2857} = 268.15 \\times (1000/700)^{0.2857}$.', '$= 268.15 \\times 1.1073 = 296.9$ K (23.8 °C).'] }
  ],
  applications: [
    'Forecasting cumulus, showers and thunderstorms from a morning sounding.',
    'Glider pilots estimating the strength and height of thermals and the cloud base.',
    'Predicting the freezing level, and so the heights where icing is possible.',
    'Air-quality forecasts: inversions trap pollution over cities.'
  ],
  sim: 'atm-parcel'
},

{
  id: 'pressure-altitude', parent: 'standard-atmosphere', title: 'Pressure altitude and the altimeter', level: 2,
  short: 'An altimeter is a barometer with a height scale: it converts the outside static pressure into a height using the standard atmosphere. Set to QNH it shows altitude above sea level, to QFE height above the airfield, and to 1013.25 hPa the pressure altitude that flight levels are built on.',
  keywords: ['altimeter', 'pressure altitude', 'QNH', 'QFE', 'QNE', 'altimeter setting', 'flight level', 'transition altitude', 'Kollsman window', 'subscale', '1013.25 hPa', '29.92 inHg', 'temperature error', 'high to low look out below', 'cold temperature correction', 'true altitude'],
  prereq: ['isa', 'air-pressure', 'pitot-tube'],
  related: ['density-altitude', 'airspeeds', 'lapse-rate', 'atmospheric-layers', 'ceiling', 'flight-testing'],
  body: `
### A barometer in disguise
Inside an altimeter is a stack of sealed, evacuated capsules connected to the aircraft's **static ports**. As the outside pressure falls the capsules expand, and gears turn the expansion into pointers. The dial, though, is marked in feet, not hectopascals — engraved by the [[isa|standard atmosphere]]. Near sea level 1 hPa corresponds to 8.3 m (27 ft); higher up the air is thinner and each hectopascal is worth more height: about 14 m at 5 km and 25 m at 10 km.

The **pressure altitude** is the height at which the standard atmosphere has the pressure outside the aircraft:

$$h_p = \\frac{T_0}{L}\\left[1 - \\left(\\frac{p}{p_0}\\right)^{RL/g}\\right]$$

with the ISA constants ($T_0 = 288.15$ K, $L = 0.0065$ K/m, $p_0 = 1013.25$ hPa). An outside pressure of 850 hPa is a pressure altitude of 1457 m (4780 ft) — whatever the weather.

### The knob: choosing the zero
Real sea-level pressure is rarely 1013.25 hPa, so the altimeter has a **subscale** (the Kollsman window) that shifts the zero of its scale to any chosen pressure. The three standard choices, named in the old Q-code:

| Setting | The altimeter shows | Used |
|---|---|---|
| **QNH** — the sea-level pressure the local station computes | altitude above mean sea level; the airfield's elevation on the ground | below the transition altitude: departure, approach, terrain clearance |
| **QFE** — the pressure at the airfield | height above the airfield; zero on the runway | some military flying, gliding and circuit work |
| **Standard** — 1013.25 hPa (29.92 inHg) | pressure altitude, read as a **flight level**: FL 350 is 35 000 ft | above the transition altitude, en route |

The **transition altitude** is 18 000 ft in the United States and Canada and as low as 3000 ft in parts of Europe. Above it, every aircraft sets the same 1013.25: none of them then shows its true height, but they all make the *same* error, so aircraft assigned different flight levels stay safely apart. A rule worth remembering: **pressure altitude ≈ elevation + 27 ft × (1013 − QNH)**.

### High to low, look out below
Keep the subscale fixed and the altimeter holds the aircraft on a surface of constant pressure. Fly from an area of high pressure into low pressure and that surface slopes down — the aircraft descends while the altimeter reads the same. With QNH 1025 set and the local value 1001, an indicated 3000 ft is really about 2350 ft. That is why QNH is updated en route below the transition altitude.

### Temperature error
The altimeter also assumes the standard *temperature*. Cold air is denser, the pressure falls faster with height, and the pressure surfaces crowd closer to the ground: in air colder than ISA the aircraft is **lower** than indicated, by about 4 % for every 10 °C below standard. At a sea-level airfield at −30 °C, an indicated 3000 ft above the field is only about 2530 ft — nearly 500 ft low. Warm air makes the aircraft higher than indicated. Hence the second rhyme, "from hot to cold, look out below", and the cold-temperature corrections added to minimum altitudes on approach charts.

> [!warn] Altimeter settings, transition altitudes and levels, and cold-temperature corrections are laid down by each country's rules of the air and the aircraft's approved procedures. The numbers here explain the physics; they are not a substitute for those procedures.

The altimeter shares the static pressure with the airspeed indicator (see [[pitot-tube]] and [[airspeeds]]). Performance, on the other hand, depends on density, not pressure alone — see [[density-altitude]].
`,
  ideas: [
    'An altimeter measures static pressure and converts it to height with the standard atmosphere.',
    'The subscale sets the zero: QNH gives altitude above sea level, QFE height above the airfield, 1013.25 hPa pressure altitude (flight levels).',
    'Near sea level 1 hPa ≈ 27 ft (8.3 m); pressure altitude ≈ elevation + 27 ft × (1013 − QNH).',
    'Flying into lower pressure with the subscale unchanged, the aircraft is lower than indicated: high to low, look out below.',
    'Air colder than ISA makes the aircraft lower than indicated, by about 4 % per 10 °C.'
  ],
  pitfalls: [
    'The altimeter measures height above the ground — It measures pressure. Only with QFE set and standard temperature does it read height above the airfield; terrain clearance must come from charts.',
    'With QNH set, the altimeter always shows true altitude — It shows true altitude only where the temperature is standard and the QNH is the local one; cold air and pressure changes en route both make the aircraft lower than indicated.',
    'Flight levels are heights above sea level — A flight level is a pressure altitude: FL 100 can be 9500 ft or 10 500 ft above sea level depending on the day.'
  ],
  formulas: [
    {
      name: 'Pressure altitude from the static pressure',
      expr: 'hp = T0/L*(1 - (p/p0)^(Rair*L/g))', tex: 'h_p = \\frac{T_0}{L}\\left[1 - \\left(\\frac{p}{p_0}\\right)^{R L/g}\\right]',
      vars: {
        hp: { name: 'pressure altitude', q: 'length', unit: 'ft', signed: true, tex: 'h_p' },
        T0: { name: 'ISA sea-level temperature', q: 'temperature', unit: 'K', value: 288.15, fixed: true, tex: 'T_0' },
        L: { name: 'ISA lapse rate', unit: 'K/m', value: 0.0065, fixed: true },
        p: { name: 'static pressure outside', q: 'pressure', unit: 'hPa', value: 850 },
        p0: { name: 'ISA sea-level pressure', q: 'pressure', unit: 'hPa', value: 1013.25, fixed: true, tex: 'p_0' },
        Rair: { const: 'Rair', tex: 'R' },
        g: { const: 'g' }
      },
      note: 'What an altimeter set to 1013.25 hPa shows (below 11 km). The exponent RL/g is 0.1903.',
      practice: { unknowns: ['hp', 'p'] },
      stories: { hp: 'The static pressure outside an aircraft is {p}. What is its pressure altitude?', p: 'An aircraft flies at a pressure altitude of {hp}. What is the pressure outside?' }
    },
    {
      name: 'Pressure altitude from QNH',
      expr: 'hp = h + k*(p0 - QNH)', tex: 'h_p \\approx h + k\\,(p_0 - \\mathrm{QNH})',
      vars: {
        hp: { name: 'pressure altitude', q: 'length', unit: 'ft', signed: true, tex: 'h_p' },
        h: { name: 'elevation (or altitude on QNH)', q: 'length', unit: 'ft', value: 1200, signed: true },
        k: { name: 'height per hectopascal near sea level', unit: 'm/hPa', value: 8.3, fixed: true },
        p0: { name: 'standard setting', q: false, unit: 'hPa', value: 1013.25, fixed: true, tex: 'p_0' },
        QNH: { name: 'QNH', q: false, unit: 'hPa', value: 998, min: 900, max: 1085, tex: '\\mathrm{QNH}' }
      },
      note: '8.3 m (27 ft) per hPa holds within a few hundred metres of sea level; higher up each hectopascal is worth more height.',
      practice: { unknowns: ['hp', 'QNH'] },
      stories: { hp: 'An airfield at {h} reports QNH {QNH} hPa. What is its pressure altitude?', QNH: 'An airfield at {h} has a pressure altitude of {hp}. What QNH is it reporting (in hPa)?' }
    },
    {
      name: 'Temperature error of the altimeter',
      expr: 'ht = hi*T/Ts', tex: 'h_t = h_i\\,\\frac{T}{T_s}',
      vars: {
        ht: { name: 'true height above the station', q: 'length', unit: 'ft', tex: 'h_t' },
        hi: { name: 'indicated height above the altimeter-setting station', q: 'length', unit: 'ft', value: 3000, tex: 'h_i' },
        T: { name: 'actual mean temperature of the air column', q: 'temperature', unit: '°C', value: -33 },
        Ts: { name: 'ISA mean temperature of the same column', q: 'temperature', unit: '°C', value: 12, tex: 'T_s' }
      },
      note: 'Thickness of a layer is proportional to its mean absolute temperature (the hypsometric equation). Cold air: lower than indicated; warm air: higher. Approach procedures use tabulated corrections built on this.',
      practice: { unknowns: ['ht'] },
      stories: { ht: 'An altimeter shows {hi} above the airfield. The air column averages {T}, where the standard atmosphere would average {Ts}. How high is the aircraft really?' }
    }
  ],
  examples: [
    {
      title: 'A hill-top airfield on a low-pressure day',
      q: 'An airfield at 1200 ft reports QNH 998 hPa. What will the altimeter read on the ground with QNH, with 1013 hPa, and with QFE?',
      steps: [
        'With QNH set it reads the elevation: 1200 ft.',
        'With 1013.25 set it reads the pressure altitude: $1200 + 27 \\times (1013.25 - 998) = 1200 + 412 = 1612$ ft.',
        'With QFE set (about 998 − 1200/27 ≈ 954 hPa) it reads 0 ft.'
      ],
      a: '1200 ft (QNH), about 1610 ft (standard), 0 ft (QFE).'
    },
    {
      title: 'High to low',
      q: 'A pilot departs with QNH 1025 hPa set and holds 3000 ft indicated towards an area where the QNH is 1001 hPa, without resetting. How high is the aircraft above sea level on arrival (standard temperature)?',
      steps: [
        'The altimeter holds the pressure level that would be 3000 ft above the 1025 hPa level.',
        'The sea-level pressure is now 24 hPa lower, so every pressure surface has sunk by about $24 \\times 27 = 650$ ft.',
        'True altitude $\\approx 3000 - 650 = 2350$ ft.'
      ],
      a: 'About 2350 ft — 650 ft lower than the altimeter shows.'
    },
    {
      title: 'A cold-day approach',
      q: 'At a sea-level airfield it is −30 °C (ISA − 45). An aircraft is 3000 ft above the field by its altimeter. The standard column would average 12 °C; the real one averages −33 °C. How high is it?',
      steps: [
        'Layer thickness scales with the mean absolute temperature: $h_t = 3000 \\times 240.15/285.15$.',
        '$h_t = 3000 \\times 0.842 = 2527$ ft.'
      ],
      a: 'About 2530 ft — some 470 ft lower than indicated.'
    }
  ],
  quiz: [
    { q: 'With QFE set, what does the altimeter read after landing at the airfield?', choices: ['the airfield elevation', 'zero', 'the pressure altitude', '1013'], a: 1,
      why: 'QFE is the airfield\'s own pressure, so the altimeter shows height above the airfield: zero on the runway.' },
    { q: 'You fly from high pressure into low pressure without resetting the subscale, holding 4000 ft indicated. Your true altitude…', choices: ['rises', 'stays at 4000 ft', 'falls', 'depends only on the temperature'], a: 2,
      why: 'The altimeter holds a constant pressure surface, and in low pressure that surface lies lower: high to low, look out below.' },
    { q: 'An airfield at 500 ft reports QNH 1023 hPa. Using 1013 hPa and 27 ft per hPa, what is its pressure altitude in feet?', answer: 230, unit: 'ft', tol: 0.05,
      why: '500 + 27 × (1013 − 1023) = 500 − 270 = 230 ft: high pressure makes the pressure altitude lower than the elevation.' },
    { q: 'On a very cold day an aircraft flying at an indicated altitude is higher than the altimeter shows.', a: false,
      why: 'Cold air is dense and the pressure surfaces crowd closer to the ground; the aircraft is lower than indicated — about 4 % for every 10 °C below standard.' },
    { q: 'Why do all aircraft above the transition altitude set 1013.25 hPa?', choices: ['because it is the true sea-level pressure there', 'so that they all use the same reference and stay vertically separated, even though none shows its true altitude', 'because altimeters cannot be set above that height', 'to show height above the ground'], a: 1,
      why: 'Separation needs a common ruler, not a correct one: two aircraft at FL 100 and FL 110 are 1000 ft apart whatever the weather.' }
  ],
  problems: [
    { q: 'Using the ISA formula, what is the pressure altitude, in metres, where the static pressure is 700 hPa?', answer: 3012, unit: 'm', tol: 0.01,
      steps: ['$(700/1013.25)^{0.1903} = 0.9321$.', '$h_p = 44\\,331 \\times (1 - 0.9321) = 3012$ m (9880 ft).'] }
  ],
  applications: [
    'Vertical separation of aircraft on flight levels.',
    'Terrain clearance on approach, with QNH and cold-temperature corrections.',
    'Performance charts, which are entered with pressure altitude and temperature.',
    'Barometric altimeters in drones, watches and phones, which drift with the weather unless recalibrated.'
  ],
  history: 'Barometric height-finding goes back to Blaise Pascal, who had his brother-in-law carry a mercury barometer up the Puy de Dôme in 1648. In 1928 Paul Kollsman in New York made the first precision altimeter with an adjustable pressure setting, which Jimmy Doolittle used for the first flight flown entirely on instruments in 1929.',
  sim: 'atm-altimeter'
},

{
  id: 'density-altitude', parent: 'standard-atmosphere', title: 'Density altitude', level: 2,
  short: 'The height in the standard atmosphere at which the air would be as thin as it is now. On a hot day at a high airfield it can be thousands of feet above the field\'s elevation — and wings, propellers and engines all perform as if they were up there.',
  keywords: ['density altitude', 'hot and high', 'takeoff performance', 'density ratio', 'sigma', 'ISA deviation', 'ground roll', 'takeoff distance', 'high-altitude airfield', 'climb performance', 'true airspeed', 'Gagg–Ferrar', 'engine power lapse'],
  prereq: ['isa', 'pressure-altitude', 'air-density', 'lift-equation'],
  related: ['humidity-air', 'takeoff-landing', 'climb-performance', 'airspeeds', 'power-required', 'hover-power', 'ceiling', 'propellers'],
  body: `
Wings, propellers, rotors and piston engines do not respond to height as such: they respond to how many kilograms of air pass through them each second. That depends on the **density**, which the weather changes as much as the altitude does. **Density altitude** folds pressure, temperature (and humidity) into one number: *the height in the standard atmosphere where the density equals today's.*

### From pressure and temperature to density altitude
The density ratio follows from the gas law, $\\sigma = \\rho/\\rho_0 = (p/p_0)(T_0/T)$. In the ISA troposphere density falls as $\\sigma = (1 - Lh/T_0)^{4.256}$, so

$$h_d = \\frac{T_0}{L}\\left[1 - \\sigma^{0.235}\\right].$$

A handy rule: **density altitude ≈ pressure altitude + 120 ft for every °C above the ISA temperature** (36 m per °C). It slightly overestimates on hot days, but it shows the size of the effect at once: a day 20 °C warmer than standard adds some 2400 ft.

| Airfield | Temperature | Pressure altitude | Density altitude |
|---|---|---|---|
| sea level | 15 °C (ISA) | 0 | 0 |
| sea level | 35 °C | 0 | 690 m (2300 ft) |
| 1650 m (5400 ft), like Denver | 33 °C | 1650 m | 2630 m (8600 ft) |
| 2230 m (7300 ft), like Mexico City | 28 °C | 2230 m | 3170 m (10 400 ft) |
| 4060 m (13 300 ft), like La Paz–El Alto | 15 °C | 4060 m | 4960 m (16 300 ft) |

(standard sea-level pressure; add about 8 m for each hectopascal of QNH below 1013)

### What thin air does
- **The wing** needs the same *indicated* airspeed to lift off, but the true airspeed — and so the ground speed — is higher by $1/\\sqrt{\\sigma}$. At σ = 0.77 that is 14 % faster over the ground and 30 % more kinetic energy to build up on the runway.
- **The propeller or rotor** moves less air per turn and makes less thrust.
- **A normally aspirated piston engine** breathes less oxygen: its power falls roughly in proportion, $P/P_0 \\approx 1.132\\,\\sigma - 0.132$ (the Gagg–Ferrar rule) — 74 % at σ = 0.77. Turbocharged engines hold their power up to a critical altitude; turbines lose thrust with temperature.

The ground roll combines these. A simple estimate, liftoff at 1.1 times the stall speed with a mean accelerating force $\\bar F$, is $s_g \\approx 1.21\\,m^2 g/(\\rho S C_{L,\\max} \\bar F)$: with $\\bar F$ falling roughly like σ as well, the roll grows roughly like $1/\\sigma^2$. Rolling friction and drag do not shrink with density, so the real growth is faster still. In the simulation below, a light aircraft that needs 250 m at sea level on a standard day needs about 540 m at the Denver-like field at 33 °C — more than twice as far. The climb afterwards suffers even more, because it lives on the power left over after drag: a normally aspirated light aircraft typically loses half or more of its sea-level rate of climb by a density altitude of 8000 ft.

> [!warn] Density altitude is behind many takeoff accidents at high and hot airfields, often with a heavy aircraft and a short, rising or soft strip. Real takeoff and climb performance comes only from the aircraft's approved flight manual, with its corrections and safety factors — never from rules of thumb or from this page.

### Humidity
Water vapour is lighter than dry air, so humid air is slightly less dense; on a hot, muggy day it adds a few hundred feet of density altitude and costs a piston engine a few per cent of power (see [[humidity-air]]).

### Who else cares
Helicopters and drones hover on thrust alone, and their [[hover-power|hover power]] rises as $1/\\sqrt{\\sigma}$ just when the engine has less to give — mountain rescue at high density altitude is at the edge of the envelope. Race-car engines, wind turbines and even baseballs (which carry about 5 % further in Denver) feel it too.
`,
  ideas: [
    'Density altitude is the standard-atmosphere height with the same air density as today.',
    'σ = (p/p₀)(T₀/T); hot, high, humid and low-pressure days all raise density altitude.',
    'Rule of thumb: add about 120 ft (36 m) for every °C above the ISA temperature.',
    'Thin air raises the true airspeed at liftoff and cuts propeller thrust and engine power, so the takeoff roll grows faster than 1/σ.',
    'The aircraft still lifts off at the same indicated airspeed.'
  ],
  pitfalls: [
    'Density altitude is what the altimeter shows — The altimeter shows pressure-based altitude. Density altitude has to be calculated from pressure altitude and temperature.',
    'A high density altitude means the aircraft must lift off at a higher indicated airspeed — The indicated speeds are the same; the true airspeed and ground speed are higher, which is why the run is longer.',
    'Only mountain airfields have a density-altitude problem — A sea-level airfield at 40 °C already has a density altitude near 3000 ft; with a heavy load and a short runway that matters.'
  ],
  formulas: [
    {
      name: 'Density ratio',
      expr: 'sigma = (p/p0)*(T0/T)', tex: '\\sigma = \\frac{p}{p_0}\\,\\frac{T_0}{T}',
      vars: {
        sigma: { name: 'density ratio ρ/ρ₀', tex: '\\sigma' },
        p: { name: 'static pressure', q: 'pressure', unit: 'hPa', value: 830.1 },
        p0: { name: 'ISA sea-level pressure', q: 'pressure', unit: 'hPa', value: 1013.25, fixed: true, tex: 'p_0' },
        T0: { name: 'ISA sea-level temperature', q: 'temperature', unit: '°C', value: 15, fixed: true, tex: 'T_0' },
        T: { name: 'outside air temperature', q: 'temperature', unit: '°C', value: 33 }
      },
      note: 'Dry air. The defaults are an airfield at 1650 m on a 33 °C day: σ = 0.771.',
      practice: { unknowns: ['sigma', 'T'] },
      stories: { sigma: 'The pressure is {p} and the temperature {T}. What is the density ratio?', T: 'At a pressure of {p}, what temperature makes the density ratio {sigma}?' }
    },
    {
      name: 'Density altitude from the density ratio',
      expr: 'hd = T0/L*(1 - sigma^(Rair*L/(g - Rair*L)))', tex: 'h_d = \\frac{T_0}{L}\\left[1 - \\sigma^{\\,R L/(g - R L)}\\right]',
      vars: {
        hd: { name: 'density altitude', q: 'length', unit: 'ft', signed: true, tex: 'h_d' },
        T0: { name: 'ISA sea-level temperature', q: 'temperature', unit: 'K', value: 288.15, fixed: true, tex: 'T_0' },
        L: { name: 'ISA lapse rate', unit: 'K/m', value: 0.0065, fixed: true },
        sigma: { name: 'density ratio ρ/ρ₀', value: 0.771, tex: '\\sigma' },
        Rair: { const: 'Rair', tex: 'R' },
        g: { const: 'g' }
      },
      note: 'The exponent RL/(g − RL) is 0.235. Valid up to the tropopause (σ > 0.297).',
      practice: { unknowns: ['hd', 'sigma'] },
      stories: { hd: 'The air density is {sigma} of the sea-level standard. What is the density altitude?', sigma: 'The density altitude is {hd}. What is the density ratio?' }
    },
    {
      name: 'Density altitude: rule of thumb',
      expr: 'hd = hp + k*(T - (T0 - L*hp))', tex: 'h_d \\approx h_p + k\\left[T - (T_0 - L\\,h_p)\\right]',
      vars: {
        hd: { name: 'density altitude', q: 'length', unit: 'ft', signed: true, tex: 'h_d' },
        hp: { name: 'pressure altitude', q: 'length', unit: 'ft', value: 5400, signed: true, tex: 'h_p' },
        k: { name: 'height per kelvin above ISA (120 ft)', unit: 'm/K', value: 36.6, fixed: true },
        T: { name: 'outside air temperature', q: 'temperature', unit: '°C', value: 33 },
        T0: { name: 'ISA sea-level temperature', q: 'temperature', unit: '°C', value: 15, fixed: true, tex: 'T_0' },
        L: { name: 'ISA lapse rate', unit: 'K/m', value: 0.0065, fixed: true }
      },
      note: 'T₀ − L·h_p is the ISA temperature at that pressure altitude. The rule overestimates by a few per cent on very hot days.',
      practice: { unknowns: ['hd', 'T'] },
      stories: { hd: 'An airfield has a pressure altitude of {hp} and the temperature is {T}. Estimate the density altitude.', T: 'At a pressure altitude of {hp}, what temperature gives a density altitude of {hd}?' }
    },
    {
      name: 'Takeoff ground roll (simple estimate)',
      expr: 'sg = 1.21*m^2*g/(rho*S*CLmax*F)', tex: 's_g \\approx \\frac{1.21\\, m^2 g}{\\rho\\, S\\, C_{L,\\max}\\, \\bar F}',
      vars: {
        sg: { name: 'ground roll', q: 'length', unit: 'm', tex: 's_g' },
        m: { name: 'aircraft mass', q: 'mass', unit: 'kg', value: 1100 },
        g: { const: 'g' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        S: { name: 'wing area', q: 'area', unit: 'm²', value: 16.2 },
        CLmax: { name: 'maximum lift coefficient (takeoff flaps)', value: 1.75, min: 0.5, max: 4, tex: 'C_{L,\\max}' },
        F: { name: 'mean accelerating force (thrust − drag − friction)', q: 'force', unit: 'N', value: 1700, tex: '\\bar F' }
      },
      note: 'Liftoff at 1.1 V_s: s = V²/(2a) with V² = 1.21 · 2mg/(ρSC_L,max) and a = F/m. Both ρ and F fall with density altitude, so the roll grows roughly like 1/σ². Illustrative only — real distances come from the flight manual.',
      practice: { unknowns: ['sg', 'F'] },
      stories: { sg: 'An aircraft of {m} with {S} of wing and C_L,max {CLmax} accelerates with a mean net force of {F} in air of density {rho}. Estimate its ground roll.' }
    }
  ],
  examples: [
    {
      title: 'A hot afternoon at a high airfield',
      q: 'An airfield at 1650 m (5400 ft) has standard pressure (830 hPa) and 33 °C. Find the density ratio and the density altitude. What would they be at dawn, at 5 °C?',
      steps: [
        'Afternoon: $\\sigma = (830.1/1013.25)(288.15/306.15) = 0.8193 \\times 0.9412 = 0.771$.',
        '$h_d = 44\\,331 \\times (1 - 0.771^{0.235}) = 44\\,331 \\times 0.0593 = 2627$ m (8620 ft).',
        'Rule of thumb: ISA at 1650 m is 4.3 °C, so the day is ISA + 28.7: $5400 + 120 \\times 28.7 \\approx 8840$ ft — close.',
        'Dawn at 5 °C: $\\sigma = 0.8193 \\times 288.15/278.15 = 0.849$, $h_d = 1677$ m (5500 ft) — hardly above the field.'
      ],
      a: 'σ = 0.77 and a density altitude of about 2600 m (8600 ft) in the afternoon, against 1680 m (5500 ft) at dawn.'
    },
    {
      title: 'Why the takeoff roll more than doubles',
      q: 'A light aircraft lifts off at 53 kt true airspeed at sea level (ISA) after 250 m. At σ = 0.771, how do its liftoff speed and engine power change, and roughly how long is the roll?',
      steps: [
        'Liftoff true airspeed: $53/\\sqrt{0.771} = 60$ kt; the kinetic energy to build is $1/0.771 = 1.30$ times larger.',
        'Engine power (Gagg–Ferrar): $1.132 \\times 0.771 - 0.132 = 0.74$ of sea-level power; thin air also costs the propeller efficiency.',
        'With the net force also about $\\sigma$ times smaller: $s \\approx 250/0.771^2 = 420$ m.',
        'Friction and drag do not fall with density, so the net force falls faster; the simulation\'s fuller model gives about 540 m.'
      ],
      a: 'Liftoff at 60 kt true instead of 53, three quarters of the power, and a roll of roughly 420–540 m instead of 250 m.'
    }
  ],
  quiz: [
    { q: 'Which day gives the highest density altitude at the same airfield?', choices: ['cold, dry, high pressure', 'hot, humid, low pressure', 'hot, dry, high pressure', 'cold, humid, low pressure'], a: 1,
      why: 'Density falls with temperature, with humidity (water vapour is light) and with lower pressure; all three together give the thinnest air.' },
    { q: 'At a high density altitude, the indicated airspeed at which the aircraft lifts off is…', choices: ['higher', 'about the same, but the true airspeed and ground speed are higher', 'lower', 'unrelated to the air density'], a: 1,
      why: 'Lift depends on dynamic pressure ½ρV², which is what the airspeed indicator measures. The same indicated speed in thin air means a higher true speed, so a longer run.' },
    { q: 'At a sea-level airfield it is 40 °C with standard pressure. Using 120 ft per °C above ISA, estimate the density altitude in feet.', answer: 3000, unit: 'ft', tol: 0.03,
      why: 'ISA at sea level is 15 °C; the day is 25 °C warmer: 25 × 120 = 3000 ft.' },
    { q: 'A density altitude of 8000 ft means the altimeter will read 8000 ft on the runway.', a: false,
      why: 'The altimeter measures pressure: with QNH set it reads the airfield elevation. Density altitude is a calculated performance figure.' },
    { q: 'If the takeoff roll grows as 1/σ², by what factor does it grow at σ = 0.8?', answer: 1.5625, tol: 0.02,
      why: '1/0.8² = 1.56 — over 50 % longer, from a density only 20 % lower. The real growth is larger still.' }
  ],
  problems: [
    { q: 'What is the density ratio at a pressure of 900 hPa and a temperature of 25 °C?', answer: 0.858, tol: 0.01,
      steps: ['$\\sigma = (900/1013.25)(288.15/298.15) = 0.8882 \\times 0.9665 = 0.858$.'] },
    { q: 'What density altitude, in metres, corresponds to σ = 0.8?', answer: 2264, unit: 'm', tol: 0.02,
      steps: ['$0.8^{0.235} = e^{0.235 \\ln 0.8} = e^{-0.05243} = 0.9489$.', '$h_d = 44\\,331 \\times (1 - 0.9489) = 44\\,331 \\times 0.0511 = 2264$ m (7430 ft).'] }
  ],
  applications: [
    'Takeoff and climb planning at high or hot airfields, using the flight manual\'s performance charts.',
    'Helicopter and drone hover limits in mountains and deserts.',
    'Engine testing and motorsport, where power is corrected to standard air density.',
    'Sports: balls carry further in thin air, as at high-altitude stadiums.'
  ],
  sim: 'atm-density-altitude'
},

{
  id: 'humidity-air', parent: 'standard-atmosphere', title: 'Humidity and air density', level: 2,
  short: 'Water vapour is lighter than the nitrogen and oxygen it replaces, so humid air is less dense than dry air at the same pressure and temperature — by 1 to 2 % on a hot, muggy day. Humidity also sets the dew point, where clouds, fog and icing begin.',
  keywords: ['humidity', 'relative humidity', 'dew point', 'vapour pressure', 'saturation vapour pressure', 'Magnus formula', 'virtual temperature', 'moist air density', 'spread', 'fog', 'carburettor icing', 'mixing ratio'],
  prereq: ['ideal-gas-air', 'air-density', 'physics:ideal-gas-law', 'physics:latent-heat'],
  related: ['density-altitude', 'lapse-rate', 'icing', 'thermals-waves', 'isa'],
  body: `
### Lighter, not heavier
"Heavy, humid air" is a figure of speech with the physics backwards. At the same pressure and temperature, a cubic metre of any gas holds the same number of molecules (Avogadro). Dry air is a mixture with a mean molar mass of 28.96 g/mol; a water molecule weighs only 18.02 g/mol. Every water molecule that joins the mix pushes out a heavier nitrogen or oxygen molecule, so **moist air is less dense than dry air**. Dalton's law splits the pressure into the dry-air part $p - e$ and the vapour part $e$, each with its own gas constant:

$$\\rho = \\frac{p - e}{R_d T} + \\frac{e}{R_v T},\\qquad R_d = 287.05,\\ R_v = 461.5\\ \\mathrm{J/(kg\\,K)}.$$

Meteorologists fold the effect into a **virtual temperature** $T_v = T/[1 - (e/p)(1 - \\varepsilon)]$, with $\\varepsilon = 0.622$: moist air has the density of dry air at $T_v$. At 30 °C and 80 % humidity $T_v$ is 3.9 K higher than $T$ — worth about 140 m (460 ft) of [[density-altitude|density altitude]].

### How much water the air can hold
The vapour pressure cannot exceed the **saturation vapour pressure** $e_s$, which depends only on temperature and roughly doubles for every 10–11 °C:

| Temperature | −20 °C | 0 °C | 10 °C | 20 °C | 30 °C | 40 °C |
|---|---|---|---|---|---|---|
| $e_s$ (over water) | 1.26 hPa | 6.11 hPa | 12.3 hPa | 23.3 hPa | 42.3 hPa | 73.7 hPa |

**Relative humidity** is $\\mathrm{RH} = e/e_s$. The **dew point** $T_d$ is the temperature to which the air must be cooled, at constant pressure, to become saturated: $e = e_s(T_d)$. Weather reports give the dew point rather than RH because the **spread** $T - T_d$ says directly how close the air is to cloud or fog — and it hardly changes during the day, while RH swings with the temperature. A spread of 2 °C or less at dusk warns of fog; the spread also gives the cumulus base, about 125 m per °C (see [[lapse-rate]]).

### Where humidity matters in flight
- **Performance.** The density effect is small — 1 to 2 % at most — but a piston engine also loses the oxygen the vapour displaces, a few per cent of power on a tropical day. Performance charts usually ignore humidity; good practice leaves margin for it.
- **Cloud, fog and visibility** all begin where the air reaches its dew point.
- **Carburettor icing.** Fuel evaporating in the carburettor's venturi, and the pressure drop across it, can cool the mixture by 20–30 °C. In humid air, ice can then form in the intake even on a warm day — outside temperatures up to about 30 °C, worst between about −5 and +20 °C with a small dew-point spread.
- **Airframe icing** needs liquid water below freezing (see [[icing]]).

> [!tip] Remember "lighter when wetter": humid air is thinner air.
`,
  ideas: [
    'Water vapour (18 g/mol) is lighter than dry air (29 g/mol), so humid air is less dense than dry air at the same p and T.',
    'The saturation vapour pressure depends only on temperature and roughly doubles every 10–11 °C.',
    'The dew point is the temperature at which the air becomes saturated; the spread T − T_d measures how close it is to cloud or fog.',
    'Moist air behaves like dry air at the virtual temperature, a few kelvin warmer on a humid day.',
    'Humidity costs a little density and some engine power, and makes carburettor icing possible on warm days.'
  ],
  pitfalls: [
    'Humid air is heavy — It is lighter: water molecules are lighter than the nitrogen and oxygen they replace.',
    'Relative humidity tells you how much water is in the air — It tells you how close to saturation the air is at its current temperature. 50 % at 30 °C holds about four times as much water as 50 % at 5 °C.',
    'Icing needs sub-zero outside temperatures — Carburettor ice can form on warm humid days, because the carburettor cools the mixture well below the outside temperature.'
  ],
  formulas: [
    {
      name: 'Saturation vapour pressure (Magnus formula)',
      expr: 'es = 6.112*exp(17.62*T/(243.12 + T))', tex: 'e_s = 6.112\\,\\exp\\!\\left(\\frac{17.62\\,T}{243.12 + T}\\right)',
      vars: {
        es: { name: 'saturation vapour pressure', q: false, unit: 'hPa', tex: 'e_s' },
        T: { name: 'air temperature', q: false, unit: '°C', value: 30, signed: true, min: -45, max: 60 }
      },
      note: 'Over liquid water, with the constants recommended by the WMO; within about 0.1 % between −45 and 60 °C. Empirical: T in °C, e_s in hPa.',
      stories: { es: 'What is the saturation vapour pressure at {T} °C (in hPa)?', T: 'At what temperature (°C) is the saturation vapour pressure {es} hPa?' }
    },
    {
      name: 'Density of moist air',
      expr: 'rho = (p - pv)/(Rair*T) + pv/(Rv*T)', tex: '\\rho = \\frac{p - e}{R_d\\,T} + \\frac{e}{R_v\\,T}',
      vars: {
        rho: { name: 'density of the moist air', q: 'density', unit: 'kg/m³', tex: '\\rho' },
        p: { name: 'total pressure', q: 'pressure', unit: 'hPa', value: 1013.25 },
        pv: { name: 'water vapour pressure', q: 'pressure', unit: 'hPa', value: 33.9, tex: 'e' },
        Rair: { const: 'Rair', tex: 'R_d' },
        Rv: { name: 'gas constant of water vapour', q: 'specificheat', unit: 'J/(kg·K)', value: 461.5, fixed: true, tex: 'R_v' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 30 }
      },
      note: 'Dalton\'s law: each gas contributes its own partial pressure. The defaults are 30 °C at 80 % humidity: 1.150 kg/m³, against 1.164 for dry air.',
      practice: { unknowns: ['rho', 'pv'] },
      stories: { rho: 'Air at {p} and {T} holds water vapour at {pv}. What is its density?', pv: 'Air at {p} and {T} has a density of {rho}. What is its vapour pressure?' }
    },
    {
      name: 'Virtual temperature',
      expr: 'Tv = T/(1 - (pv/p)*(1 - eps))', tex: 'T_v = \\frac{T}{1 - \\dfrac{e}{p}\\,(1 - \\varepsilon)}',
      vars: {
        Tv: { name: 'virtual temperature', q: 'temperature', unit: '°C', tex: 'T_v' },
        T: { name: 'actual temperature', q: 'temperature', unit: '°C', value: 30 },
        pv: { name: 'water vapour pressure', q: 'pressure', unit: 'hPa', value: 33.9, tex: 'e' },
        p: { name: 'total pressure', q: 'pressure', unit: 'hPa', value: 1013.25 },
        eps: { name: 'molar mass ratio water/dry air', value: 0.622, fixed: true, tex: '\\varepsilon' }
      },
      note: 'The temperature at which dry air would have the density of this moist air. Use it in place of T in density-altitude calculations.',
      practice: { unknowns: ['Tv'] },
      stories: { Tv: 'Air at {T} and {p} has a vapour pressure of {pv}. What is its virtual temperature?' }
    },
    {
      name: 'Dew point from temperature and humidity',
      expr: 'Td = 243.12*(ln(RH) + 17.62*T/(243.12 + T))/(17.62 - ln(RH) - 17.62*T/(243.12 + T))',
      tex: 'T_d = \\frac{243.12\\,\\gamma}{17.62 - \\gamma},\\qquad \\gamma = \\ln \\mathrm{RH} + \\frac{17.62\\,T}{243.12 + T}',
      vars: {
        Td: { name: 'dew point', q: false, unit: '°C', signed: true, tex: 'T_d' },
        RH: { name: 'relative humidity', q: 'ratio', unit: '%', value: 50, min: 1, max: 100, tex: '\\mathrm{RH}' },
        T: { name: 'air temperature', q: false, unit: '°C', value: 30, signed: true, min: -45, max: 60 }
      },
      note: 'The Magnus formula solved for the temperature at which the present vapour pressure would saturate the air.',
      practice: { unknowns: ['Td', 'RH'] },
      stories: { Td: 'It is {T} °C with a relative humidity of {RH}. What is the dew point (°C)?', RH: 'It is {T} °C and the dew point is {Td} °C. What is the relative humidity?' }
    }
  ],
  examples: [
    {
      title: 'A muggy afternoon',
      q: 'Compare the density of air at 30 °C and 1013.25 hPa when dry and at 80 % relative humidity.',
      steps: [
        'Saturation vapour pressure at 30 °C: $e_s = 6.112\\,e^{17.62 \\times 30/273.12} = 42.3$ hPa; at 80 % $e = 33.9$ hPa.',
        'Moist: $\\rho = (101\\,325 - 3390)/(287.05 \\times 303.15) + 3390/(461.5 \\times 303.15) = 1.1254 + 0.0242 = 1.1497$ kg/m³.',
        'Dry: $\\rho = 101\\,325/(287.05 \\times 303.15) = 1.1644$ kg/m³.',
        'Virtual temperature: $T_v = 303.15/(1 - 0.0335 \\times 0.378) = 307.0$ K, 3.9 K above $T$ — about 140 m (460 ft) of density altitude.'
      ],
      a: 'The humid air is 1.3 % less dense: 1.150 kg/m³ against 1.164.'
    },
    {
      title: 'Dew point and cloud base',
      q: 'It is 30 °C with 50 % relative humidity. Find the dew point and estimate the cumulus base.',
      steps: [
        '$\\gamma = \\ln 0.5 + 17.62 \\times 30/273.12 = -0.693 + 1.935 = 1.242$.',
        '$T_d = 243.12 \\times 1.242/(17.62 - 1.242) = 18.4$ °C.',
        'Spread 11.6 °C: cloud base $\\approx 125 \\times 11.6 = 1450$ m (4750 ft).'
      ],
      a: 'Dew point 18.4 °C; cumulus bases near 1450 m.'
    }
  ],
  quiz: [
    { q: 'At the same temperature and pressure, humid air is…', choices: ['denser than dry air, because water is heavy', 'less dense than dry air, because water molecules are lighter than N₂ and O₂', 'exactly as dense as dry air', 'denser, but only above 30 °C'], a: 1,
      why: 'Equal volumes at the same p and T hold equal numbers of molecules; swapping 29 g/mol molecules for 18 g/mol ones lowers the mass.' },
    { q: 'The dew point is…', choices: ['the temperature to which the air must be cooled at constant pressure to become saturated', 'the temperature of the ground at dawn', 'the humidity at which rain starts', 'always 0 °C'], a: 0,
      why: 'Cool the air to its dew point and its vapour pressure equals the saturation value: dew, fog or cloud form.' },
    { q: 'The air is at 20 °C with a dew point of 20 °C. What is the relative humidity, in per cent?', answer: 100, unit: '%', tol: 0.01,
      why: 'Temperature equals dew point means the air is saturated: e = e_s, RH = 100 %.' },
    { q: 'Carburettor icing can occur on a warm, humid summer day with the outside temperature well above freezing.', a: true,
      why: 'Fuel evaporation and the venturi\'s pressure drop can cool the mixture 20–30 °C below the outside air; with plenty of moisture, ice forms in the intake.' },
    { q: 'The saturation vapour pressure at 20 °C is 23.4 hPa. What is the vapour pressure at 50 % relative humidity, in hPa?', answer: 11.7, unit: 'hPa', tol: 0.02,
      why: 'e = RH × e_s = 0.5 × 23.4 = 11.7 hPa.' }
  ],
  applications: [
    'Forecasting fog and low cloud from the dew-point spread.',
    'Correcting engine and aircraft performance for humid tropical conditions.',
    'Warning of carburettor icing on piston engines.',
    'Air conditioning and compressed-air drying, which use the same dew-point physics.'
  ],
  sim: { id: 'atm-density-altitude', params: { T: 35, rh: 90, elev: 0 } }
},

/* ============================================================== WIND AND WEATHER */
{
  id: 'wind-gradient', parent: 'weather-flight', title: 'Wind and the wind gradient', level: 2,
  short: 'Friction with the ground slows the wind near the surface, so the wind grows with height through the lowest few hundred metres — roughly logarithmically. It matters for aircraft and gliders on the approach, for wind turbines and for tall buildings.',
  keywords: ['wind gradient', 'wind profile', 'atmospheric boundary layer', 'log law', 'logarithmic wind profile', 'power law', 'Hellmann exponent', 'roughness length', 'friction velocity', 'geostrophic wind', 'Ekman spiral', 'hub height', 'low-level jet', 'wind at 10 m'],
  prereq: ['boundary-layer', 'turbulent-boundary-layer', 'math:logarithms'],
  related: ['wind-shear', 'wind-turbines', 'atmospheric-turbulence', 'gliding', 'wind-loads', 'takeoff-landing', 'betz-limit', 'bird-flight'],
  body: `
### The planet's boundary layer
The wind is a flow over a very rough plate — the Earth — and it has a [[boundary-layer|boundary layer]] like any other, only 300 m to 2 km deep and always turbulent. Above it the wind is nearly frictionless: it blows along the isobars, balancing the pressure gradient against the Coriolis effect (the **geostrophic wind**). Inside it, friction slows the air and turns it towards low pressure, by about 10–15° over the sea and 25–40° over land (the Ekman spiral). A pilot descending through it feels the wind both weaken and **back** (turn anticlockwise, in the northern hemisphere).

### The logarithmic profile
Near the ground, in neutral conditions (overcast, windy), the wind grows with the logarithm of height:

$$u(z) = \\frac{u_*}{\\kappa}\\ln\\frac{z}{z_0},$$

where $\\kappa = 0.41$ is von Kármán's constant, $u_*$ the **friction velocity** (a measure of the shear stress, $\\tau = \\rho u_*^2$) and $z_0$ the **roughness length**, a small fraction of the height of the obstacles. Engineers often use the simpler **power law** $u = u_{\\mathrm{ref}}(z/z_{\\mathrm{ref}})^{\\alpha}$, with α about 1/7 over open country.

| Surface | Roughness length $z_0$ | Power-law α |
|---|---|---|
| Open sea | 0.0002 m | 0.10 |
| Short grass, airfield | 0.03 m | 0.14 |
| Farmland with hedges | 0.1 m | 0.18 |
| Woodland, suburbs | 0.5 m | 0.25 |
| City centre | 1.5 m | 0.35 |

Over an airfield, 5 m/s measured at the standard anemometer height of 10 m becomes 7 m/s at 100 m and about 3.6 m/s at 2 m. Over a city the same upper wind is much weaker at street level and grows much more steeply.

### Day and night
Sunshine stirs the boundary layer with [[thermals-waves|thermals]], which carry fast air down and flatten the profile (α ≈ 0.1). On clear nights the ground cools, the air near it becomes stable and stops mixing, and the surface wind can die away while a **low-level jet** of 15–20 m/s blows a few hundred metres up — a steep gradient (α of 0.3–0.5) and, where the two layers meet, genuine [[wind-shear]].

### In the air
On final approach an aircraft descends from stronger wind into weaker. Its inertia carries its ground speed, so each knot of headwind lost is a knot of **airspeed** lost unless the pilot adds power. Descending from 300 ft to the runway in a 15-knot surface wind can cost 8–9 knots. Gliders are most exposed: on a low final turn the lower wing sits in slower air than the upper one, and a steep gradient has caused many accidents. Taking off, the opposite happens — the headwind grows as the aircraft climbs, adding airspeed. Albatrosses exploit the gradient over the waves to soar for hours without flapping (dynamic soaring, see [[bird-flight]]).

> [!warn] The approach speed additives for wind and gusts, and how to handle a gradient on final, come from the aircraft's approved manual and flight training — not from this page.

### Turbines and buildings
The power in the wind grows with the cube of its speed, $P = \\tfrac12 \\rho A u^3$, so 40 % more wind at hub height gives 2.7 times the power — the reason turbine towers are 100–150 m tall ([[wind-turbines]]). A 150 m rotor spans a large slice of the profile: each blade meets stronger wind at the top of its circle than at the bottom, a once-per-turn load that fatigue design must carry. Buildings feel wind pressure that grows up their height ([[wind-loads]]).
`,
  ideas: [
    'Surface friction makes the wind grow with height through the boundary layer, 0.3–2 km deep.',
    'Near the ground the profile is logarithmic, u = (u*/κ) ln(z/z₀); rougher ground means slower low-level wind and a steeper gradient.',
    'The power law u ∝ z^α with α ≈ 1/7 is a convenient engineering fit over open country.',
    'Descending through a gradient costs airspeed; climbing through it adds airspeed.',
    'Wind power grows as u³, so taller towers reach much more energy.'
  ],
  pitfalls: [
    'The wind reported at an airfield is the wind the aircraft flies in — The report is at 10 m; a few hundred feet up the wind is typically 30–50 % stronger and turned in direction.',
    'An aircraft moving with the air cannot feel a change of wind — Its inertia is relative to the ground, so a change of wind changes its airspeed until drag and thrust restore it.',
    'The wind profile is fixed for a place — It changes with stability: flat on sunny afternoons, very steep on clear, calm nights.'
  ],
  formulas: [
    {
      name: 'Logarithmic wind profile',
      expr: 'u = us/kappa*ln(z/z0)', tex: 'u = \\frac{u_*}{\\kappa}\\ln\\frac{z}{z_0}',
      vars: {
        u: { name: 'wind speed at height z', q: 'speed', unit: 'm/s' },
        us: { name: 'friction velocity', q: 'speed', unit: 'm/s', value: 0.353, tex: 'u_*' },
        kappa: { name: 'von Kármán constant', value: 0.41, fixed: true, tex: '\\kappa' },
        z: { name: 'height above the ground', q: 'length', unit: 'm', value: 100 },
        z0: { name: 'roughness length', q: 'length', unit: 'm', value: 0.03, tex: 'z_0' }
      },
      note: 'Neutral stability, in the lowest ~100–200 m, well above the roughness elements. The surface stress is τ = ρu*².',
      practice: { unknowns: ['u', 'us', 'z'] },
      stories: { u: 'Over ground with a roughness length of {z0}, the friction velocity is {us}. What is the wind at {z}?', us: 'The wind is {u} at {z} over ground with roughness length {z0}. What is the friction velocity?' }
    },
    {
      name: 'Power-law wind profile',
      expr: 'u = uref*(z/zref)^alpha', tex: 'u = u_{\\mathrm{ref}}\\left(\\frac{z}{z_{\\mathrm{ref}}}\\right)^{\\alpha}',
      vars: {
        u: { name: 'wind speed at height z', q: 'speed', unit: 'm/s' },
        uref: { name: 'wind at the reference height', q: 'speed', unit: 'm/s', value: 5, tex: 'u_{\\mathrm{ref}}' },
        z: { name: 'height', q: 'length', unit: 'm', value: 100 },
        zref: { name: 'reference height', q: 'length', unit: 'm', value: 10, tex: 'z_{\\mathrm{ref}}' },
        alpha: { name: 'shear exponent', value: 0.14, min: 0.05, max: 0.6, tex: '\\alpha' }
      },
      note: 'The Hellmann power law; α ≈ 0.10 over the sea, 1/7 over open country, 0.25–0.4 over towns and on stable nights.',
      practice: { unknowns: ['u', 'alpha'] },
      stories: { u: 'The wind is {uref} at {zref}. With a shear exponent of {alpha}, what is it at {z}?', alpha: 'The wind is {uref} at {zref} and {u} at {z}. What is the shear exponent?' }
    },
    {
      name: 'Power in the wind',
      expr: 'P = 0.5*rho*A*u^3', tex: 'P = \\tfrac12\\,\\rho A u^3',
      vars: {
        P: { name: 'power carried by the wind through the area', q: 'power', unit: 'MW' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        A: { name: 'swept area', q: 'area', unit: 'm²', value: 7854 },
        u: { name: 'wind speed', q: 'speed', unit: 'm/s', value: 7 }
      },
      note: 'The kinetic energy flux through the area. A turbine can extract at most 16/27 of it (the Betz limit). 7854 m² is a 100 m rotor.',
      practice: { unknowns: ['P', 'u'] },
      stories: { P: 'How much power does a {u} wind carry through a rotor of {A} in air of density {rho}?', u: 'What wind speed carries {P} through {A} in air of density {rho}?' }
    }
  ],
  examples: [
    {
      title: 'From the anemometer to the hub',
      q: 'An anemometer at 10 m over grass ($z_0$ = 0.03 m) reads 5 m/s. Estimate the wind at a 100 m hub, and how much more power per square metre it carries.',
      steps: [
        'Friction velocity: $u_* = \\kappa u/\\ln(z/z_0) = 0.41 \\times 5/\\ln 333 = 2.05/5.81 = 0.353$ m/s.',
        'At 100 m: $u = (0.353/0.41)\\ln(100/0.03) = 0.861 \\times 8.11 = 6.98$ m/s. (The 1/7 power law gives 6.95.)',
        'Power ratio: $(6.98/5)^3 = 2.72$.'
      ],
      a: 'About 7 m/s at the hub, carrying 2.7 times the power per square metre of the 10 m wind.'
    },
    {
      title: 'Airspeed lost on final',
      q: 'The surface wind over a grass airfield is 15 kt (at 10 m), straight down the runway. Using the log law, how much headwind is lost between 90 m (300 ft) and 3 m?',
      steps: [
        'Scale by $\\ln(z/z_0)$: $\\ln(10/0.03) = 5.81$.',
        'At 90 m: $15 \\times \\ln 3000/5.81 = 15 \\times 8.01/5.81 = 20.7$ kt. At 3 m: $15 \\times \\ln 100/5.81 = 11.9$ kt.',
        'Headwind lost on the way down: about 9 kt — airspeed that must be made up with power.'
      ],
      a: 'About 9 kt of headwind disappears in the last 300 ft.'
    }
  ],
  quiz: [
    { q: 'The same upper wind blows over a smooth sea and over a city. Near the ground (10 m) the wind is…', choices: ['stronger over the city', 'weaker over the city, because the rougher surface slows the air more', 'the same over both', 'zero over the city'], a: 1,
      why: 'A larger roughness length takes more momentum out of the flow, so the wind near the ground is weaker and the gradient steeper.' },
    { q: 'Descending on final approach into a wind that weakens towards the ground, the airspeed tends to…', choices: ['increase', 'decrease', 'stay constant, because the aircraft moves with the air', 'oscillate without changing on average'], a: 1,
      why: 'The aircraft\'s inertia keeps its ground speed for a while; a smaller headwind at the same ground speed means a lower airspeed.' },
    { q: 'With a power-law exponent of 1/7, by what factor is the wind at 80 m stronger than at 10 m?', answer: 1.346, tol: 0.02,
      why: '(80/10)^(1/7) = 8^0.1429 = 1.35.' },
    { q: 'By what factor does the power in the wind grow when the wind speed grows by 30 %?', answer: 2.197, tol: 0.02,
      why: 'P ∝ u³: 1.3³ = 2.2.' },
    { q: 'On a clear, calm night the wind at 100 m can be much stronger than at the ground.', a: true,
      why: 'The ground cools, the air near it becomes stable and stops mixing momentum down; a low-level jet can form a few hundred metres up.' }
  ],
  applications: [
    'Choosing hub heights and estimating the energy yield of wind farms.',
    'Approach-speed additives for strong winds and gradients.',
    'Wind loads on tall buildings, towers and bridges.',
    'Dynamic soaring by albatrosses and radio-controlled gliders.'
  ],
  history: 'Theodore von Kármán and Ludwig Prandtl worked out the logarithmic velocity profile of turbulent wall flows around 1930; meteorologists soon found the same law in the wind over the ground. The Hellmann power law is older, from Gustav Hellmann\'s wind measurements on masts near Berlin in 1914.',
  sim: 'atm-wind-profile'
},

{
  id: 'atmospheric-turbulence', parent: 'weather-flight', title: 'Atmospheric turbulence and gusts', level: 2,
  short: 'Irregular air motion — over rough ground, in thermals, where the wind shears near the jet stream, under mountain waves and in the wakes of other aircraft — that jolts an aircraft by changing its angle of attack. How hard it jolts depends on the gust, the airspeed and the wing loading.',
  keywords: ['turbulence', 'gust', 'gust load', 'clear-air turbulence', 'CAT', 'mechanical turbulence', 'convective turbulence', 'gust load factor', 'Pratt formula', 'gust alleviation factor', 'mass ratio', 'turbulence penetration speed', 'manoeuvring speed', 'Richardson number', 'Kelvin–Helmholtz'],
  prereq: ['turbulence', 'load-factor', 'lift-curve', 'wind-gradient'],
  related: ['v-n-diagram', 'wingtip-vortices', 'thermals-waves', 'wind-shear', 'stall', 'flutter', 'lapse-rate'],
  body: `
### Where the bumps come from
- **Mechanical turbulence**: wind flowing over hills, trees and buildings breaks into eddies, strongest in winds above about 20 kt and in the lee of obstacles.
- **Convective turbulence**: [[thermals-waves|thermals]] and cumulus make the familiar bumps of a sunny afternoon; thunderstorms contain the most violent turbulence in the atmosphere.
- **Clear-air turbulence** (CAT): near the jet streams the wind may change by 20–40 kt per thousand feet. Stable air resists overturning, but when the shear is strong enough — when the **Richardson number** $Ri = N^2/(du/dz)^2$ falls below about 0.25 — the layer rolls up into Kelvin–Helmholtz billows and breaks, with no cloud to warn of it.
- **Mountain-wave rotors**, and the **wake vortices** of other aircraft ([[wingtip-vortices]]).

### A gust is a change of angle of attack
A vertical gust $U$ met at airspeed $V$ tilts the relative wind by $\\Delta\\alpha = \\arctan(U/V)$ — 7.9° for a 7.6 m/s (25 ft/s) gust at 55 m/s. The lift jumps by $\\tfrac12\\rho V^2 S\\,a\\,\\Delta\\alpha$, and dividing by the weight gives the load-factor increment of a **sharp-edged gust**:

$$\\Delta n = \\frac{\\rho V a U S}{2W}.$$

Two consequences stand out. The jolt grows only **linearly** with speed (the dynamic pressure grows as $V^2$ but the angle change falls as $1/V$). And it falls with **wing loading** $W/S$: a glider or a paraglider is bounced about far more than an airliner in the same air.

Real gusts build up over tens of metres, and the aircraft starts to rise with them, which softens the blow. Pratt's formula (1953) captures that with a gust alleviation factor $K_g = 0.88\\mu_g/(5.3 + \\mu_g)$, where the **mass ratio** $\\mu_g = 2W/(\\rho S \\bar c\\, a g)$ compares the aircraft's mass with the mass of air around its wing.

| 7.6 m/s gust | $W/S$ | Airspeed | Δn sharp-edged | $K_g$ | Δn (Pratt) |
|---|---|---|---|---|---|
| Glider | 330 N/m² | 30 m/s (58 kt) | 2.24 | 0.60 | 1.35 |
| Light aircraft | 670 N/m² | 55 m/s (107 kt) | 1.83 | 0.66 | 1.20 |
| Airliner, low level | 6000 N/m² | 128 m/s (250 kt) | 0.50 | 0.79 | 0.39 |

### Designing for it, and slowing down
Aircraft are certified to survive specified gusts: light aircraft to 50 ft/s (15 m/s) at their design cruising speed; airliners to a family of "one-minus-cosine" gusts, with a reference of 17 m/s at sea level falling with altitude, and to continuous turbulence. Because $\\Delta n \\propto V$, slowing down reduces gust loads; and below the **manoeuvring speed** the wing stalls before it can make a load that would damage the structure. Hence the recommended turbulence penetration speeds — a compromise between too fast (structural load) and too slow (stall margin); see [[v-n-diagram]].

### How strong is severe?
Pilots grade turbulence by what it does: *light* — slight, erratic changes, under about half a g; *moderate* — definite strain against seat belts, unsecured objects move, up to about 1 g; *severe* — large abrupt changes, the aircraft momentarily out of control, people and objects thrown about. Airlines now also report turbulence objectively as the **eddy dissipation rate**, which does not depend on the aircraft type.

> [!warn] Most turbulence injuries happen to people not wearing a seat belt. Turbulence speeds, seat-belt use and avoidance of storms and wave rotors follow the aircraft's approved manuals, airline procedures and the rules of the air.
`,
  ideas: [
    'Turbulence comes from terrain, thermals, jet-stream shear (clear-air turbulence), mountain waves and aircraft wakes.',
    'A vertical gust changes the angle of attack by about U/V, so the lift and load factor jump.',
    'The sharp-edged gust load Δn = ρVaUS/(2W) grows linearly with airspeed and falls with wing loading.',
    'Real gusts are softened as the aircraft rises with them: Pratt\'s factor K_g, from the mass ratio.',
    'Flying slower in turbulence reduces gust loads and lets the wing stall before the structure is overloaded.'
  ],
  pitfalls: [
    'Gust loads grow with the square of speed, like lift — The angle-of-attack change falls as 1/V while the dynamic pressure grows as V², so the gust load grows only linearly with speed.',
    'Heavy aircraft feel turbulence more — Aircraft with high wing loading feel it less; the same gust gives a light, lightly loaded aircraft a much larger g increment.',
    'Clear air is smooth air — Clear-air turbulence near the jet stream gives no visual warning; it is found from forecasts, reports and wind-shear diagnostics.'
  ],
  formulas: [
    {
      name: 'Angle-of-attack change from a vertical gust',
      expr: 'dalpha = atan(U/V)', tex: '\\Delta\\alpha = \\arctan\\frac{U}{V}',
      vars: {
        dalpha: { name: 'change in angle of attack', q: 'angle', unit: '°', signed: true, min: -45, max: 45, tex: '\\Delta\\alpha' },
        U: { name: 'vertical gust velocity (up positive)', q: 'speed', unit: 'm/s', value: 7.6, signed: true },
        V: { name: 'true airspeed', q: 'speed', unit: 'm/s', value: 55 }
      },
      note: '7.6 m/s is 25 ft/s; 15.2 m/s (50 ft/s) is a typical design gust for light aircraft at cruising speed.',
      stories: { dalpha: 'An aircraft at {V} flies into an updraft of {U}. By how much does its angle of attack change?', U: 'An aircraft at {V} feels its angle of attack change by {dalpha}. How strong was the vertical gust?' }
    },
    {
      name: 'Gust load factor (Pratt)',
      expr: 'dn = Kg*rho*V*a*U*S/(2*W)', tex: '\\Delta n = \\frac{K_g\\,\\rho\\, V a\\, U S}{2W}',
      vars: {
        dn: { name: 'load-factor increment', signed: true, tex: '\\Delta n' },
        Kg: { name: 'gust alleviation factor', value: 0.656, min: 0, max: 1, tex: 'K_g' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'true airspeed', q: 'speed', unit: 'm/s', value: 55 },
        a: { name: 'lift-curve slope of the aircraft (per radian)', value: 4.8 },
        U: { name: 'gust velocity', q: 'speed', unit: 'm/s', value: 7.6, signed: true },
        S: { name: 'wing area', q: 'area', unit: 'm²', value: 16.2 },
        W: { name: 'weight', q: 'force', unit: 'kN', value: 10.85 }
      },
      note: 'With K_g = 1 this is the sharp-edged gust. Certification uses equivalent airspeed and sea-level density, which give the same product ρVU.',
      practice: { unknowns: ['dn', 'U', 'V'] },
      stories: {
        dn: 'An aircraft of weight {W} with {S} of wing (slope {a} per radian, K_g = {Kg}) flies at {V} in air of density {rho} into a gust of {U}. What load-factor increment does it feel?',
        V: 'An aircraft of {W} with {S} of wing ({a} per radian, K_g {Kg}) must keep the increment from a {U} gust to {dn} in air of density {rho}. How fast may it fly?'
      }
    },
    {
      name: 'Gust alleviation factor',
      expr: 'Kg = 0.88*mu/(5.3 + mu)', tex: 'K_g = \\frac{0.88\\,\\mu_g}{5.3 + \\mu_g}',
      vars: {
        Kg: { name: 'gust alleviation factor', tex: 'K_g' },
        mu: { name: 'aeroplane mass ratio', value: 15.5, tex: '\\mu_g' }
      },
      note: 'Pratt and Walker\'s fit for a "one-minus-cosine" gust 25 chords long. Light, lightly loaded aircraft (small μ_g) rise with the gust and are relieved most.',
      stories: { Kg: 'An aircraft has a mass ratio of {mu}. What is its gust alleviation factor?' }
    },
    {
      name: 'Aeroplane mass ratio',
      expr: 'mu = 2*W/(rho*S*c*a*g)', tex: '\\mu_g = \\frac{2W}{\\rho\\, S\\, \\bar c\\, a\\, g}',
      vars: {
        mu: { name: 'aeroplane mass ratio', tex: '\\mu_g' },
        W: { name: 'weight', q: 'force', unit: 'kN', value: 10.85 },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        S: { name: 'wing area', q: 'area', unit: 'm²', value: 16.2 },
        c: { name: 'mean chord', q: 'length', unit: 'm', value: 1.5, tex: '\\bar c' },
        a: { name: 'lift-curve slope (per radian)', value: 4.8 },
        g: { const: 'g' }
      },
      note: 'Grows with wing loading and with altitude (smaller ρ).',
      stories: { mu: 'An aircraft of {W} has {S} of wing with a mean chord of {c} and a lift slope of {a} per radian. What is its mass ratio in air of density {rho}?' }
    }
  ],
  examples: [
    {
      title: 'A light aircraft meets a 25 ft/s gust',
      q: 'A 1100 kg aircraft (16.2 m² of wing, mean chord 1.5 m, a = 4.8 per radian) flies at 55 m/s at sea level into a 7.6 m/s vertical gust. Find Δα, the sharp-edged Δn and Pratt\'s Δn.',
      steps: [
        '$\\Delta\\alpha = \\arctan(7.6/55) = 7.9°$.',
        'Sharp-edged: $\\Delta n = 1.225 \\times 55 \\times 4.8 \\times 7.6 \\times 16.2/(2 \\times 10\\,790) = 1.84$.',
        'Mass ratio: $\\mu_g = 2 \\times 10\\,790/(1.225 \\times 16.2 \\times 1.5 \\times 4.8 \\times 9.81) = 15.4$; $K_g = 0.88 \\times 15.4/20.7 = 0.66$.',
        'Pratt: $\\Delta n = 0.66 \\times 1.84 = 1.21$: the load factor swings from about −0.2 to +2.2 g.'
      ],
      a: 'Δα ≈ 8°, Δn ≈ 1.8 for a sharp edge and about 1.2 with alleviation.'
    },
    {
      title: 'Why slowing down helps',
      q: 'The same aircraft slows to 40 m/s in turbulence. What is the Pratt Δn now, and at what load factor does the wing stall if C_L,max = 1.5?',
      steps: [
        'Δn scales with V (the mass ratio does not change with speed): $1.21 \\times 40/55 = 0.88$.',
        'In level flight at 40 m/s: $C_L = 2W/(\\rho V^2 S) = 21\\,580/(1.225 \\times 1600 \\times 16.2) = 0.68$.',
        'The wing can make at most $1.5/0.68 = 2.2$ times its weight at this speed: a bigger gust stalls it momentarily instead of loading the structure beyond that.'
      ],
      a: 'Δn falls to about 0.9, and the wing cannot exceed about 2.2 g at 40 m/s — well inside the 3.8 g limit of such an aircraft.'
    }
  ],
  quiz: [
    { q: 'Two aircraft fly through the same gust at the same speed. Which is jolted harder?', choices: ['the one with the higher wing loading', 'the one with the lower wing loading', 'both equally', 'always the heavier one'], a: 1,
      why: 'Δn = ρVaUS/(2W): the same extra lift divided by a smaller weight per square metre gives a bigger load factor.' },
    { q: 'Halving the airspeed through a sharp-edged gust changes the load-factor increment by a factor of…', choices: ['4', '2', '1/2', '1/4'], a: 2,
      why: 'Δn ∝ V: the angle change doubles (U/V) while the dynamic pressure falls to a quarter.' },
    { q: 'A 10 m/s vertical gust hits an aircraft flying at 100 m/s. By how many degrees does its angle of attack change?', answer: 5.71, unit: '°', tol: 0.02,
      why: 'arctan(10/100) = 5.71°.' },
    { q: 'Clear-air turbulence is often found near the jet stream, where the wind speed changes sharply with height.', a: true,
      why: 'Strong vertical wind shear can overcome the stability of the air (Richardson number below about 0.25) and break into turbulent billows.' },
    { q: 'The Richardson number compares…', choices: ['buoyancy (stability) with wind shear: below about 0.25 the shear wins and the air can overturn', 'the Reynolds number with the Mach number', 'lift with drag', 'the gust speed with the airspeed'], a: 0,
      why: 'Ri = N²/(du/dz)²: stability tries to keep layers flat, shear tries to roll them up.' }
  ],
  applications: [
    'Structural design against certification gusts and continuous turbulence.',
    'Choosing turbulence penetration speeds.',
    'Gust load alleviation by moving ailerons and spoilers on modern airliners.',
    'Forecasting clear-air turbulence from wind shear and stability.'
  ],
  history: 'Kermit Pratt and Walter Walker at the NACA analysed gust loads recorded on airliners since the 1930s and in the early 1950s proposed the alleviation factor still used for light aircraft certification. The Kelvin–Helmholtz instability behind clear-air turbulence was described by Lord Kelvin (1871) and Hermann von Helmholtz (1868) long before aircraft met it.',
  sim: 'atm-gust'
},

{
  id: 'thermals-waves', parent: 'weather-flight', title: 'Thermals and mountain waves', level: 2,
  short: 'Two ways the atmosphere lifts a glider for free: thermals — bubbles and columns of sun-warmed air rising through unstable air — and mountain waves, standing oscillations set up when stable air flows over a ridge, which can reach into the stratosphere.',
  keywords: ['thermal', 'thermal soaring', 'cumulus', 'convection', 'convective velocity scale', 'Deardorff velocity', 'mountain wave', 'lee wave', 'lenticular cloud', 'rotor', 'buoyancy frequency', 'wave soaring', 'ridge lift', 'dust devil', 'cloud street'],
  prereq: ['lapse-rate', 'physics:buoyancy', 'physics:convection', 'gliding'],
  related: ['atmospheric-turbulence', 'wind-gradient', 'bird-flight', 'humidity-air', 'wind-shear', 'physics:simple-harmonic-motion'],
  body: `
### Thermals
The sun heats the ground unevenly — dry fields, rock, towns and car parks faster than woods, lakes and wet meadows — and the ground heats the air above it. Over a hot patch a thin **superadiabatic** layer forms, cooling faster than 9.8 °C per km with height ([[lapse-rate]]): it is absolutely unstable and sooner or later breaks away as a bubble or a column of rising air. A parcel just 1 K warmer than its surroundings feels an upward acceleration $g\\,\\Delta T/T \\approx 0.033\\ \\mathrm{m/s^2}$; drag and mixing with the surroundings balance that at typical climb speeds of 1–5 m/s (200–1000 ft/min), and 8–10 m/s over deserts.

How strong the thermals will be is set by how much heat the ground pumps into the air and how deep the mixed layer is. The **convective velocity scale**

$$w_* = \\left(\\frac{g\\, z_i\\, Q_s}{\\rho\\, c_p\\, T}\\right)^{1/3}$$

gives about 2.2 m/s for a surface heat flux of 250 W/m² and a 1500 m convective layer — a good summer soaring day. Thermals stop where they meet an inversion or where the rising air is no longer warmer than its surroundings; if they reach their condensation level first, each is capped by a **cumulus** cloud, which is why cumulus bases are flat and all at the same height, and why glider pilots head for young, crisp clouds. Between thermals the air sinks. In a strong wind thermals line up into **cloud streets**.

A glider climbs by circling in the core, banked 40–50° on a radius of 50–100 m. It sinks relative to the air by about 0.8–1 m/s in the turn, so its climb is the thermal's strength minus that sink. Storks, vultures and eagles do the same; so do paragliders and hang gliders.

### Mountain waves
When **stable** air flows across a ridge it is lifted, and — like a spring — overshoots on the other side and oscillates as it goes on downwind. Seen from the ground the oscillation stands still: a train of **lee waves** anchored to the mountain, with a wavelength set by the wind speed and the buoyancy frequency $N$,

$$\\lambda = \\frac{2\\pi U}{N}.$$

With $U$ = 20 m/s and $N$ = 0.01 s⁻¹ the crests are 12.6 km apart. Waves need a wind of at least 15–20 kt roughly across the ridge, increasing with height, and a stable layer near the ridge top. Their ascending sides give smooth lift of 2–10 m/s, and where the air is moist, smooth, lens-shaped **lenticular** clouds sit motionless in the crests while the wind blows through them. Under the crests, near the ground, the flow can overturn into **rotors**: violent turbulence, with rags of cloud tumbling in them. Waves can rise far into the stratosphere: gliders have reached 23 km (76 000 ft) in Patagonian waves, and have flown more than 3000 km along the Andes in a single day.

**Ridge lift** is simpler: wind striking a slope is deflected upwards, and gulls, gliders and paragliders soar along the ridge.

> [!warn] The descending side of a strong wave can sink faster than a light aircraft can climb, and rotors can exceed an aircraft's structural limits. Flight near mountains in strong winds follows the aircraft's approved manuals, local knowledge and the rules of the air.
`,
  ideas: [
    'Uneven heating of the ground makes unstable surface air that rises in bubbles and columns: thermals, typically 1–5 m/s.',
    'The buoyancy of a parcel is g ΔT/T; the convective velocity scale w* predicts how strong thermals will be.',
    'Thermals are capped by inversions or by cumulus at the condensation level.',
    'Stable air flowing over a ridge oscillates: standing lee waves with wavelength 2πU/N.',
    'Waves give smooth, strong lift and lenticular clouds; rotors beneath them are violently turbulent.'
  ],
  pitfalls: [
    'Thermals need a hot day — They need an unstable lapse rate near the ground. A cool, clear day after a cold front often has excellent thermals; a hot, hazy day under an inversion may have none.',
    'Lenticular clouds drift with the wind — They are stationary: air flows through them, condensing as it rises into the crest and evaporating as it descends.',
    'Mountain waves are always turbulent — The wave itself is often glassy smooth; the violent turbulence is in the rotors below the crests.'
  ],
  formulas: [
    {
      name: 'Buoyant acceleration of a warm parcel',
      expr: 'b = g*(Tp - Te)/Te', tex: 'b = g\\,\\frac{T_p - T_e}{T_e}',
      vars: {
        b: { name: 'upward acceleration (buoyancy)', q: 'accel', unit: 'm/s²', signed: true },
        g: { const: 'g' },
        Tp: { name: 'temperature of the parcel', q: 'temperature', unit: '°C', value: 27, tex: 'T_p' },
        Te: { name: 'temperature of the surrounding air', q: 'temperature', unit: '°C', value: 25, tex: 'T_e' }
      },
      note: 'Archimedes for a gas at equal pressure: density is inversely proportional to absolute temperature. Before drag and mixing.',
      practice: { unknowns: ['b', 'Tp'] },
      stories: { b: 'A bubble of air at {Tp} rises through air at {Te}. What is its buoyant acceleration?' }
    },
    {
      name: 'Strength of thermals (convective velocity scale)',
      expr: 'ws = (g*zi*Qs/(rho*cp*T))^(1/3)', tex: 'w_* = \\left(\\frac{g\\, z_i\\, Q_s}{\\rho\\, c_p\\, T}\\right)^{1/3}',
      vars: {
        ws: { name: 'convective velocity scale', q: 'speed', unit: 'm/s', tex: 'w_*' },
        g: { const: 'g' },
        zi: { name: 'depth of the convective layer', q: 'length', unit: 'm', value: 1500, tex: 'z_i' },
        Qs: { name: 'sensible heat flux from the ground', q: 'intensity', unit: 'W/m²', value: 250, tex: 'Q_s' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.15, tex: '\\rho' },
        cp: { name: 'specific heat of air', q: 'specificheat', unit: 'J/(kg·K)', value: 1005, tex: 'c_p' },
        T: { name: 'air temperature', q: 'temperature', unit: '°C', value: 27 }
      },
      note: 'Deardorff\'s scale for the updrafts of a sunny convective boundary layer; the cores of good thermals are 1–2 times w*.',
      practice: { unknowns: ['ws', 'Qs', 'zi'] },
      stories: { ws: 'The ground heats the air with {Qs} and the convective layer is {zi} deep. How strong are the thermals likely to be?' }
    },
    {
      name: 'Lee-wave wavelength',
      expr: 'lambda = 2*pi*U/N', tex: '\\lambda = \\frac{2\\pi U}{N}',
      vars: {
        lambda: { name: 'wavelength of the lee waves', q: 'length', unit: 'km', tex: '\\lambda' },
        U: { name: 'wind speed across the ridge', q: 'speed', unit: 'm/s', value: 20 },
        N: { name: 'buoyancy frequency', q: 'angvel', unit: 'rad/s', value: 0.01 }
      },
      note: 'A parcel carried at speed U completes one buoyancy oscillation (period 2π/N) over one wavelength. Typical lee waves: 5–25 km.',
      practice: { unknowns: ['lambda', 'U'] },
      stories: { lambda: 'A {U} wind blows across a ridge in air with a buoyancy frequency of {N}. How far apart are the wave crests?', U: 'Lenticular clouds are {lambda} apart in air with a buoyancy frequency of {N}. What is the wind speed?' }
    }
  ],
  examples: [
    {
      title: 'How strong are today\'s thermals?',
      q: 'The ground heats the air with 250 W/m², thermals reach 1500 m, and it is 27 °C (ρ = 1.15 kg/m³). Estimate the thermal strength and the climb of a glider that sinks 0.9 m/s in the turn.',
      steps: [
        '$w_* = (9.81 \\times 1500 \\times 250/(1.15 \\times 1005 \\times 300.15))^{1/3} = (10.6)^{1/3} = 2.2$ m/s.',
        'Climb in the core: $2.2 - 0.9 = 1.3$ m/s (about 250 ft/min), better in the strongest cores.',
        'From 300 m to the 1500 m top: $1200/1.3 = 920$ s, about 15 minutes of circling.'
      ],
      a: 'Thermals of about 2 m/s; the glider climbs at about 1.3 m/s.'
    },
    {
      title: 'Where is the next wave crest?',
      q: 'A 20 m/s wind blows across a ridge in stable air with N = 0.01 s⁻¹. How far downwind are the crests spaced, and how long does air take to travel from one to the next?',
      steps: [
        '$\\lambda = 2\\pi \\times 20/0.01 = 12\\,600$ m.',
        'Travel time: $12\\,600/20 = 630$ s — exactly one buoyancy period $2\\pi/N$.'
      ],
      a: 'Crests about 12.6 km apart; the air takes about 10.5 minutes from crest to crest.'
    }
  ],
  quiz: [
    { q: 'Thermals are strongest when…', choices: ['the lapse rate near the ground is steep (unstable) and the sun is strong', 'there is an inversion at the surface', 'the sky is completely overcast', 'the air is very stable'], a: 0,
      why: 'Thermals are buoyant air rising through an unstable layer; strong heating and a steep lapse rate make them strong and deep.' },
    { q: 'Mountain waves need…', choices: ['unstable air', 'stable air and a strong wind blowing across the ridge', 'no wind', 'a thunderstorm nearby'], a: 1,
      why: 'Stability supplies the restoring force (N) that makes the displaced air oscillate; the wind carries the oscillation downstream.' },
    { q: 'A 15 m/s wind crosses a ridge in air with N = 0.012 s⁻¹. What is the lee-wave wavelength, in km?', answer: 7.85, unit: 'km', tol: 0.02,
      why: 'λ = 2π × 15/0.012 = 7854 m.' },
    { q: 'Lenticular clouds drift downwind with the wind, like other clouds.', a: false,
      why: 'They mark the crests of a standing wave: air condenses as it rises into the crest and evaporates as it leaves, so the cloud stays put.' },
    { q: 'The rotor under a mountain wave is dangerous because…', choices: ['it contains severe turbulence and strong up- and downdrafts near the ground', 'it is always full of hail', 'it lowers the air pressure to half', 'it only forms at night'], a: 0,
      why: 'The flow overturns under the wave crests, close to the terrain, with turbulence that can exceed an aircraft\'s structural limits.' }
  ],
  problems: [
    { q: 'A parcel of air is 1.5 K warmer than its surroundings at 20 °C. What is its buoyant acceleration?', answer: 0.0502, unit: 'm/s²', tol: 0.02,
      steps: ['$b = 9.807 \\times 1.5/293.15 = 0.0502$ m/s².'] }
  ],
  applications: [
    'Cross-country soaring in gliders, hang gliders and paragliders.',
    'High-altitude research flights in stratospheric mountain waves.',
    'Forecasting convection, cumulus and showers.',
    'Birds of prey, storks and vultures migrating on thermals.'
  ],
  history: 'Glider pilots found thermals in the 1920s and discovered wave lift over the Riesengebirge (Krkonoše) in 1933, beneath a lenticular cloud the local people called the Moazagotl; Paul Queney (1948) and Richard Scorer (1949) worked out the theory of lee waves. In 2003 Klaus Ohlmann flew a glider more than 3000 km in a day along the Andes, and in 2018 the Perlan 2 glider reached about 23 km in waves over Patagonia.',
  sim: 'atm-parcel'
},

{
  id: 'wind-shear', parent: 'weather-flight', title: 'Wind shear and microbursts', level: 2,
  short: 'A change of wind speed or direction over a short distance. Near the ground — in a microburst\'s outflow, at a front or under a low-level jet — it can take airspeed and height from an aircraft faster than its engines can give them back.',
  keywords: ['wind shear', 'microburst', 'downburst', 'low-level wind shear', 'LLWS', 'F-factor', 'windshear escape manoeuvre', 'performance-decreasing shear', 'headwind loss', 'downdraft', 'gust front', 'LLWAS', 'Doppler weather radar', 'predictive windshear', 'dry microburst'],
  prereq: ['wind-gradient', 'energy-management', 'lift-equation', 'airspeeds'],
  related: ['atmospheric-turbulence', 'thermals-waves', 'takeoff-landing', 'climb-performance', 'stall', 'phugoid', 'power-required'],
  body: `
### Why shear changes the airspeed
An aircraft flies through the air, but its inertia belongs to the ground frame. If the headwind drops suddenly by 20 kt, the aircraft still has its ground speed for a moment — so its **airspeed** drops by 20 kt, and with it the lift. Drag and thrust restore the airspeed only over many seconds. Shear that raises the airspeed (headwind increasing, tailwind decreasing, an updraft) is **performance-increasing**: the aircraft balloons above its path. Shear that lowers it (headwind decreasing, tailwind increasing, a downdraft) is **performance-decreasing**, and near the ground it is dangerous.

### The microburst
A thunderstorm — or just a shaft of rain evaporating under a high cloud base (a *dry* microburst, with **virga** as its only sign) — sends down a column of cold, heavy air. It hits the ground and spreads out in all directions like water from a tap, curling up at its edge. A **microburst** is less than 4 km across and lives 5–15 minutes, at its worst for a few minutes; downdrafts reach 10–20 m/s at a few hundred feet, and the outflow can change from a 40-knot headwind to a 40-knot tailwind across its width.

An aircraft on the approach meets it in a deadly order: first a **headwind** — airspeed rises, the aircraft floats above the glide path, and the natural reaction is to reduce thrust; then the **downdraft**; then a growing **tailwind** that takes away the airspeed just as the aircraft is lowest, with engines that need several seconds to spool back up.

### The energy view and the F-factor
The hazard is best measured as a loss of energy. The **F-factor**

$$F = \\frac{\\dot W_x}{g} - \\frac{W_h}{V}$$

adds the rate of change of the horizontal wind along the path ($\\dot W_x$, tailwind positive) and the downdraft ($W_h$, up positive) into a single number, a loss of **climb gradient**: with $F$ = 0.1 the aircraft needs a 10 % climb gradient's worth of excess thrust just to keep its energy. A twin-jet at full thrust in the landing configuration has $(T - D)/W$ of roughly 0.15–0.25, so a sustained $F$ above 0.1 is hazardous, and on-board systems alert at about that level. Airspeed is stored height: slowing from 140 kt to 110 kt releases $\\Delta h = (V_1^2 - V_2^2)/2g \\approx 100$ m of energy — and at 300 ft on the approach, there are only 90 m.

### Escaping
Industry training, built after the accidents of the 1970s and 1980s, teaches the escape: maximum thrust at once, pitch towards about 15° nose-up (or as the flight director commands), respect the stick shaker, do not change the configuration until clear, and trade airspeed for height rather than the other way round — near the ground, height is what counts. Pitching the nose down to keep the airspeed, the instinctive reaction, flies the aircraft into the ground. The simulation lets you try all of these.

### Detection
Airports have networks of anemometers (LLWAS) and terminal Doppler weather radars that see the outflow; aircraft have **reactive** wind-shear warnings that compute $F$ from air data and inertial sensors, and **predictive** systems that use the weather radar to look for the Doppler signature ahead. Since they arrived in the 1990s, microburst accidents to airliners have become rare.

> [!warn] Wind-shear avoidance and recovery follow the aircraft's approved manuals, operator procedures and recurrent training, and air-traffic warnings. The numbers and the simulation here illustrate the physics only.
`,
  ideas: [
    'A sudden change of wind changes the airspeed by the same amount, because the aircraft\'s inertia is in the ground frame.',
    'A microburst on the approach gives a headwind, then a downdraft, then a tailwind — the worst sequence near the ground.',
    'The F-factor, F = Ẇx/g − W_h/V, measures the shear as a lost climb gradient; above about 0.1 it is hazardous.',
    'Airspeed is stored height: (V₁² − V₂²)/2g.',
    'The escape trades airspeed for height with full thrust and a high pitch attitude, up to the stick shaker.'
  ],
  pitfalls: [
    'An aircraft moves with the air mass, so a change in wind is harmless — Its momentum is relative to the ground; the change appears first as a change of airspeed and lift.',
    'The initial headwind is good news — It is often the first part of a microburst; reducing thrust in response leaves the engines slow when the downdraft and tailwind arrive.',
    'Wind shear always comes with a thunderstorm and heavy rain — Dry microbursts come from high-based showers whose rain evaporates before reaching the ground; virga and dust rings may be the only signs.'
  ],
  formulas: [
    {
      name: 'F-factor (wind-shear hazard index)',
      expr: 'F = Wxd/g - Wh/V', tex: 'F = \\frac{\\dot W_x}{g} - \\frac{W_h}{V}',
      vars: {
        F: { name: 'F-factor (positive = energy lost)', signed: true },
        Wxd: { name: 'rate of change of the horizontal wind along the path (tailwind positive)', q: 'accel', unit: 'm/s²', value: 0.7, signed: true, tex: '\\dot W_x' },
        g: { const: 'g' },
        Wh: { name: 'vertical wind (up positive)', q: 'speed', unit: 'm/s', value: -5, signed: true, tex: 'W_h' },
        V: { name: 'airspeed', q: 'speed', unit: 'kt', value: 140 }
      },
      note: 'F is a loss of climb gradient. Averaged over about a kilometre, F above roughly 0.1 is treated as hazardous.',
      practice: { unknowns: ['F', 'Wh'] },
      stories: { F: 'At {V}, an aircraft meets a horizontal wind changing at {Wxd} (towards tailwind) and a vertical wind of {Wh}. What is the F-factor?', Wh: 'At {V} with no horizontal shear ({Wxd}), the F-factor is {F}. What is the vertical wind?' }
    },
    {
      name: 'Height equivalent of lost airspeed',
      expr: 'dh = (V1^2 - V2^2)/(2*g)', tex: '\\Delta h = \\frac{V_1^2 - V_2^2}{2g}',
      vars: {
        dh: { name: 'height worth of the kinetic energy lost', q: 'length', unit: 'ft', signed: true, tex: '\\Delta h' },
        V1: { name: 'airspeed before', q: 'speed', unit: 'kt', value: 140, tex: 'V_1' },
        V2: { name: 'airspeed after', q: 'speed', unit: 'kt', value: 110, tex: 'V_2' },
        g: { const: 'g' }
      },
      note: 'Energy per unit weight: speed and height can be traded one for the other (see energy management).',
      practice: { unknowns: ['dh', 'V2'] },
      stories: { dh: 'An airliner loses airspeed from {V1} to {V2} in a shear. How much height is that energy worth?', V2: 'A pilot trades {dh} of energy height at {V1}. What airspeed remains?' }
    },
    {
      name: 'Climb gradient left in a shear',
      expr: 'G = (T - D)/W - F', tex: 'G = \\sin\\gamma = \\frac{T - D}{W} - F',
      vars: {
        G: { name: 'sustainable climb gradient (sine of the climb angle)', signed: true },
        T: { name: 'thrust', q: 'force', unit: 'kN', value: 180 },
        D: { name: 'drag', q: 'force', unit: 'kN', value: 70 },
        W: { name: 'weight', q: 'force', unit: 'kN', value: 588 },
        F: { name: 'F-factor', value: 0.14, signed: true }
      },
      note: 'Holding airspeed constant; a negative result means the aircraft must lose speed or height.',
      practice: { unknowns: ['G', 'F'] },
      stories: { G: 'An aircraft of {W} has {T} of thrust and {D} of drag in a shear with F = {F}. What climb gradient can it hold?', F: 'An aircraft of {W} with {T} of thrust and {D} of drag can just hold a climb gradient of {G}. What F-factor is it flying through?' }
    }
  ],
  examples: [
    {
      title: 'How hazardous is this shear?',
      q: 'On the approach at 140 kt (72 m/s), an aircraft flies from a 15 m/s headwind into a 15 m/s tailwind over 3 km, at a ground speed of 70 m/s, with a 5 m/s downdraft. Find the F-factor.',
      steps: [
        'Horizontal: the wind changes by 30 m/s in $3000/70 = 43$ s, so $\\dot W_x = 0.70$ m/s² and $\\dot W_x/g = 0.071$.',
        'Vertical: $-W_h/V = 5/72 = 0.069$.',
        '$F = 0.071 + 0.069 = 0.14$.'
      ],
      a: 'F ≈ 0.14 — above the 0.1 alert level: a hazardous shear.'
    },
    {
      title: 'Airspeed as height',
      q: 'The shear costs an airliner 30 kt, from 140 to 110 kt. How much height is that energy worth?',
      steps: [
        '$V_1 = 72.0$ m/s, $V_2 = 56.6$ m/s.',
        '$\\Delta h = (72.0^2 - 56.6^2)/(2 \\times 9.81) = (5187 - 3202)/19.6 = 101$ m (330 ft).'
      ],
      a: 'About 100 m (330 ft) — more height than an aircraft has at 300 ft on the approach.'
    },
    {
      title: 'Can it climb out?',
      q: 'A 60 t twin-jet (588 kN) has 180 kN of thrust and 70 kN of drag during the escape. What climb gradient can it hold in F = 0.14?',
      steps: [
        'Excess thrust ratio: $(180 - 70)/588 = 0.187$.',
        'Left for climbing: $0.187 - 0.14 = 0.047$ — a 4.7 % gradient, about 2.7°.'
      ],
      a: 'A shallow climb of about 4.7 % — barely positive, and only with full thrust at once.'
    }
  ],
  quiz: [
    { q: 'Entering a microburst on the approach, the first thing the crew usually notices is…', choices: ['a sudden loss of airspeed', 'an increase in headwind and airspeed, with the aircraft rising above the glide path', 'a strong crosswind from the left', 'ice forming on the windscreen'], a: 1,
      why: 'The outflow first blows towards the aircraft as a headwind, a performance-increasing shear; the downdraft and tailwind follow.' },
    { q: 'Why is it dangerous to reduce thrust in response to that initial airspeed gain?', choices: ['the engines may overheat', 'the downdraft and tailwind follow within seconds, and engines need several seconds to spool back up', 'it breaks the autopilot', 'it is not dangerous'], a: 1,
      why: 'The headwind is the leading edge of the outflow; the airspeed will soon collapse, and thrust lags by seconds.' },
    { q: 'A 6 m/s downdraft is met at an airspeed of 70 m/s, with no horizontal shear. What is the F-factor?', answer: 0.0857, tol: 0.02,
      why: 'F = −W_h/V = 6/70 = 0.086.' },
    { q: 'A microburst can occur without any rain reaching the ground.', a: true,
      why: 'In a dry microburst the rain evaporates on the way down, cooling the air and making it plunge; virga and a ring of dust may be the only clues.' },
    { q: 'In the wind-shear escape manoeuvre, pilots trade…', choices: ['height for airspeed, diving to keep the speed up', 'airspeed for height, with full thrust and a high pitch attitude up to the stick shaker', 'thrust for drag, by lowering more flap', 'nothing — they hold the attitude and wait'], a: 1,
      why: 'Near the ground height keeps the aircraft alive; airspeed is spent to hold it, down to the stall-warning limit.' }
  ],
  applications: [
    'Airport wind-shear alerting systems (LLWAS, terminal Doppler radar).',
    'Reactive and predictive wind-shear warnings on airliners.',
    'Escape manoeuvres in flight simulators and recurrent training.',
    'Forecasting dry microbursts under high-based showers in deserts and plains.'
  ],
  history: 'Tetsuya Theodore Fujita identified the downburst and the microburst while investigating the crash of Eastern Air Lines Flight 66 at New York in 1975. Pan Am 759 (New Orleans, 1982) and Delta 191 (Dallas–Fort Worth, 1985, 137 lives lost) followed. The JAWS project near Denver (1982) measured microbursts with Doppler radar, and the FAA\'s Windshear Training Aid (1987), airport Doppler radars and on-board warnings made such accidents rare.',
  sim: 'atm-microburst'
},

{
  id: 'icing', parent: 'weather-flight', title: 'Icing', level: 2,
  short: 'Supercooled water droplets — liquid below 0 °C — freeze on the parts of an aircraft they hit. A few millimetres of rough ice on a wing\'s leading edge can cut the maximum lift by a third, raise the stall speed and the drag, and upset the tailplane and the instruments.',
  keywords: ['icing', 'airframe icing', 'supercooled water', 'rime ice', 'clear ice', 'glaze ice', 'mixed ice', 'SLD', 'freezing rain', 'freezing drizzle', 'collection efficiency', 'liquid water content', 'de-icing', 'anti-icing', 'de-icing boots', 'tailplane stall', 'frost', 'pitot icing', 'Stokes number'],
  prereq: ['humidity-air', 'stall', 'lapse-rate', 'boundary-layer'],
  related: ['lift-curve', 'high-lift-devices', 'stagnation-properties', 'pitot-tube', 'flow-separation', 'reynolds-number', 'special-airfoils'],
  body: `
### Supercooled water
Cloud droplets are tiny — 10 to 50 µm — and pure; without a speck of dust or ice to start on, they stay **liquid well below 0 °C**. Clouds between 0 and −20 °C are mostly supercooled water; only below about −40 °C does everything freeze on its own. When a supercooled droplet hits an aircraft it freezes at once, or within moments. Most icing therefore happens between 0 and −20 °C, the worst near the top of that range; it needs **visible moisture** — cloud, drizzle, rain — at or below freezing. In the atmosphere that often means just above the freezing level (see [[lapse-rate]]).

### Which parts ice: droplet inertia
Air bends smoothly around a wing's nose; a droplet, a thousand times denser, cannot follow the curve and flies on into the surface. How well it follows is measured by the **Stokes number** $K = \\rho_w d^2 V/(18\\mu R)$ — its relaxation time compared with the time the air takes to pass the body. Big droplets, high speed and **small bodies** mean a high $K$ and a high **collection efficiency** $E$. That is why thin things ice first and worst: temperature probes, antennas, wing tips, the tailplane's sharp leading edge, propeller blades. A thick wing root may stay nearly clean. The ice collected per square metre of frontal area each second is $E \\cdot \\mathrm{LWC} \\cdot V$, where the **liquid water content** of cloud is typically 0.1–1 g/m³.

### Kinds of ice

| Ice | Conditions | Appearance | Effect |
|---|---|---|---|
| Rime | small droplets, colder (−10 to −20 °C), freeze on impact | white, opaque, brittle; grows into the flow | rough, moderate shape change |
| Clear (glaze) | larger droplets, 0 to −10 °C, freeze slowly and run back | transparent, hard, heavy; "horns" | the worst shapes, hard to shed |
| Mixed | in between | both | both |
| Freezing rain, drizzle (SLD) | drops of 50 µm to several mm | clear ice far behind the protected leading edge | beyond what many aircraft are certified for |
| Frost | clear night, surface below the dew point | fine crystals | sandpaper roughness — enough to matter |

### What ice does aerodynamically
Even a thin, rough layer trips the [[boundary-layer|boundary layer]] to turbulence and hastens [[flow-separation|separation]]. Typical results: $C_{L,\\max}$ falls by 20–40 % (frost alone can take 20–30 %), the stall comes several degrees earlier — possibly before a stall warning tuned for the clean wing — and drag rises by 50–100 % or more. With 30 % of $C_{L,\\max}$ gone, the stall speed rises by $1/\\sqrt{0.7}$ = 20 %. The **tailplane**, thin and working at a negative angle that grows when the flaps go down, can stall first, pitching the nose down sharply. Ice blocks pitot tubes (they are heated for that reason), clogs engine intakes, and in piston engines forms in the carburettor even in warm weather (see [[humidity-air]]).

### Protection
**Anti-icing** stops ice forming: leading edges heated by engine bleed air or electric elements, glycol fluid weeping through porous panels. **De-icing** removes it: pneumatic boots that inflate to crack it off, electro-impulse systems. On the ground, glycol fluids remove frost, snow and ice (Type I, sprayed hot) and keep it off until takeoff (thickened Type IV, with a *holdover time*). The rule is the **clean aircraft concept**: no frost, ice or snow on critical surfaces at takeoff.

Speed helps a little: air brought to rest on the leading edge is warmed by $\\Delta T \\approx r V^2/(2c_p)$ — about 2 K at 70 m/s but some 10 K at 150 m/s, so fast aircraft collect less clear ice in marginal conditions.

> [!warn] Flight into known or forecast icing is allowed only for aircraft approved for it, and then only within their certified limits. Icing procedures, ground de-icing and holdover times follow the approved flight manual, operator procedures and the rules of the air.
`,
  ideas: [
    'Cloud droplets stay liquid below 0 °C (supercooled) and freeze when they hit an aircraft.',
    'Droplet inertia (the Stokes number) decides what gets hit: thin parts and fast aircraft collect the most.',
    'Rime (small, cold droplets) is white and brittle; clear ice (large droplets near 0 °C) is heavy and grows horns.',
    'A thin rough layer can cut C_L,max by 20–40 %, stall the wing earlier and much raise the drag.',
    'Anti-icing prevents ice, de-icing removes it; the aircraft must be clean for takeoff.'
  ],
  pitfalls: [
    'Water always freezes at 0 °C — Small, pure droplets stay liquid down to about −40 °C; that supercooled water is what makes icing possible.',
    'A little ice only adds weight — The weight is minor; the harm is aerodynamic: lost lift, earlier stall and much more drag.',
    'The big wing ices first — Thin parts collect droplets far more efficiently, so the tailplane, probes and wing tips ice first and worst.'
  ],
  formulas: [
    {
      name: 'Ice collection rate',
      expr: 'mdot = E*LWC*V', tex: '\\dot m = E\\,\\mathrm{LWC}\\,V',
      vars: {
        mdot: { name: 'ice collected per square metre of frontal area', q: false, unit: 'g/(m²·s)', tex: '\\dot m' },
        E: { name: 'collection efficiency', value: 0.6, min: 0, max: 1 },
        LWC: { name: 'liquid water content of the cloud', q: false, unit: 'g/m³', value: 0.5, tex: '\\mathrm{LWC}' },
        V: { name: 'true airspeed', q: 'speed', unit: 'm/s', value: 70 }
      },
      note: 'Every drop in the swept volume that hits the surface. E is highest (often 0.5–0.9) at the leading edge of thin bodies and falls to zero at the impingement limits.',
      practice: { unknowns: ['mdot', 'LWC'] },
      stories: { mdot: 'An aircraft flies at {V} through cloud with {LWC} g/m³ of liquid water; the leading edge collects with an efficiency of {E}. How much ice builds up per square metre each second?' }
    },
    {
      name: 'Growth rate of ice thickness',
      expr: 'dsdt = E*LWC*V/rhoi', tex: '\\dot s = \\frac{E\\,\\mathrm{LWC}\\,V}{\\rho_i}',
      vars: {
        dsdt: { name: 'growth rate of the ice thickness', q: false, unit: 'mm/s', tex: '\\dot s' },
        E: { name: 'collection efficiency', value: 0.6, min: 0, max: 1 },
        LWC: { name: 'liquid water content', q: false, unit: 'g/m³', value: 0.5, tex: '\\mathrm{LWC}' },
        V: { name: 'true airspeed', q: 'speed', unit: 'm/s', value: 70 },
        rhoi: { name: 'density of the ice (rime 500–900)', q: 'density', unit: 'kg/m³', value: 900, tex: '\\rho_i' }
      },
      note: 'All the water freezing where it hits. (g/m³)·(m/s)/(kg/m³) comes out in mm/s. Multiply by 60 for mm per minute.',
      practice: { unknowns: ['dsdt', 'V'] },
      stories: { dsdt: 'At {V} in cloud with {LWC} g/m³ of water and a collection efficiency of {E}, how fast does ice of density {rhoi} thicken?' }
    },
    {
      name: 'Stall speed with a contaminated wing',
      expr: 'Vsi = Vs*sqrt(CLmax/CLmaxi)', tex: 'V_{s,i} = V_s\\sqrt{\\frac{C_{L,\\max}}{C_{L,\\max,i}}}',
      vars: {
        Vsi: { name: 'stall speed with ice', q: 'speed', unit: 'kt', tex: 'V_{s,i}' },
        Vs: { name: 'clean stall speed', q: 'speed', unit: 'kt', value: 50, tex: 'V_s' },
        CLmax: { name: 'clean maximum lift coefficient', value: 1.5, min: 0.3, max: 4, tex: 'C_{L,\\max}' },
        CLmaxi: { name: 'maximum lift coefficient with ice', value: 1.05, min: 0.2, max: 4, tex: 'C_{L,\\max,i}' }
      },
      note: 'Same weight and wing area; V_s ∝ 1/√C_L,max. It ignores the weight of the ice and the tailplane.',
      practice: { unknowns: ['Vsi', 'CLmaxi'] },
      stories: { Vsi: 'Ice cuts a wing\'s C_L,max from {CLmax} to {CLmaxi}. If it stalled at {Vs} when clean, at what speed does it stall now?' }
    },
    {
      name: 'Kinetic heating at the leading edge',
      expr: 'dT = r*V^2/(2*cp)', tex: '\\Delta T = \\frac{r\\,V^2}{2\\,c_p}',
      vars: {
        dT: { name: 'surface temperature rise', q: 'dtemp', unit: 'K', tex: '\\Delta T' },
        r: { name: 'recovery factor', value: 0.9, min: 0, max: 1 },
        V: { name: 'true airspeed', q: 'speed', unit: 'm/s', value: 70 },
        cp: { name: 'specific heat of air', q: 'specificheat', unit: 'J/(kg·K)', value: 1005, tex: 'c_p' }
      },
      note: 'With r = 1 this is the stagnation-temperature rise that a total-air-temperature probe measures (see stagnation properties).',
      practice: { unknowns: ['dT', 'V'] },
      stories: { dT: 'By how much is the leading edge warmed at {V} (recovery factor {r})?', V: 'How fast must an aircraft fly for kinetic heating to warm its leading edge by {dT} (recovery factor {r})?' }
    }
  ],
  examples: [
    {
      title: 'How fast does the ice grow?',
      q: 'A light aircraft flies at 70 m/s through cloud with 0.5 g/m³ of supercooled water. The leading edge collects with E = 0.6 and the ice has a density of 900 kg/m³. How thick is it after 10 minutes?',
      steps: [
        'Mass flux: $\\dot m = 0.6 \\times 0.5 \\times 70 = 21$ g/(m²·s).',
        'Thickening: $21/900 = 0.023$ mm/s $= 1.4$ mm per minute.',
        'In 10 minutes: about 14 mm on the leading edge (in practice the shape is uneven and rime is less dense).'
      ],
      a: 'About 1.4 mm a minute — 14 mm in ten minutes.'
    },
    {
      title: 'Ice and the stall speed',
      q: 'A wing with a clean C_L,max of 1.5 stalls at 50 kt. Ice cuts C_L,max by 30 %. What is the new stall speed?',
      steps: [
        '$C_{L,\\max,i} = 0.7 \\times 1.5 = 1.05$.',
        '$V_{s,i} = 50\\sqrt{1.5/1.05} = 50 \\times 1.195 = 60$ kt.',
        'The stall warning, set for the clean wing, may sound only after the iced wing has already stalled.'
      ],
      a: 'About 60 kt — 20 % higher.'
    },
    {
      title: 'Why speed helps a little',
      q: 'Compare the kinetic warming of the leading edge (r = 0.9) of a light aircraft at 60 m/s and an airliner descending at 150 m/s.',
      steps: [
        'Light aircraft: $0.9 \\times 60^2/(2 \\times 1005) = 1.6$ K.',
        'Airliner: $0.9 \\times 150^2/2010 = 10$ K: in cloud at −8 °C its leading edges are near 0 °C and collect little clear ice, while the light aircraft\'s are near −6 °C.'
      ],
      a: 'About 1.6 K against 10 K.'
    }
  ],
  quiz: [
    { q: 'Which parts of an aircraft usually ice first?', choices: ['the thick wing root', 'thin parts such as probes, antennas, the tailplane leading edge and wing tips', 'the fuselage belly', 'the engine exhausts'], a: 1,
      why: 'Small bodies bend the air sharply over a short distance, so droplets cannot follow and hit: their collection efficiency is high.' },
    { q: 'Clear ice forms mostly…', choices: ['at −30 °C from small droplets', 'with large droplets near 0 to −10 °C, which freeze slowly and run back before freezing', 'only on the ground', 'in dry air'], a: 1,
      why: 'Large, warm droplets do not freeze at once; the water spreads back and freezes into hard, clear, often horn-shaped ice.' },
    { q: 'Ice reduces C_L,max from 1.6 to 1.2. By what factor does the stall speed rise?', answer: 1.155, tol: 0.01,
      why: '√(1.6/1.2) = 1.155: about 15 % faster.' },
    { q: 'A thin layer of frost, no rougher than sandpaper, can reduce a wing\'s maximum lift noticeably and must be removed before takeoff.', a: true,
      why: 'Roughness at the leading edge thickens the boundary layer and brings on separation early; frost can cost 20–30 % of C_L,max.' },
    { q: 'Supercooled droplets are…', choices: ['small ice crystals', 'liquid water below 0 °C, which freezes when it hits something', 'water vapour', 'hailstones'], a: 1,
      why: 'Without a nucleus to freeze on, small droplets stay liquid well below 0 °C; the impact provides the trigger.' }
  ],
  problems: [
    { q: 'How much is the leading edge of an aircraft at 100 m/s warmed by kinetic heating (r = 0.9, c_p = 1005 J/(kg·K))?', answer: 4.48, unit: 'K', tol: 0.02,
      steps: ['$\\Delta T = 0.9 \\times 100^2/(2 \\times 1005) = 4.48$ K.'] }
  ],
  applications: [
    'Designing and certifying ice-protection systems with icing tunnels and tankers.',
    'Ground de-icing and anti-icing with holdover times before takeoff.',
    'Heated pitot tubes, angle-of-attack vanes and windscreens.',
    'Wind turbines and power lines in cold climates, which ice the same way.'
  ],
  history: 'NACA\'s Icing Research Tunnel in Cleveland opened in 1944 and is still in use. Lewis Rodert\'s work on heating wings with engine exhaust heat won the Collier Trophy for 1946. After an ATR 72 crashed in freezing drizzle near Roselawn, Indiana, in 1994, certification rules were extended to supercooled large drops.',
  sim: 'atm-droplets'
}

);
