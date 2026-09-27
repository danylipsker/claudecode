/* HYPER-PNEUMATICS · content/air-physics.js — the branch "Air and Gas Physics"
 *   gas-laws-topic: air-composition, absolute-gauge-pressure, boyles-law, charles-gay-lussac, ideal-gas-law,
 *                   partial-pressures, isothermal-adiabatic, energy-in-compressed-air
 *   air-quantities: standard-air, humidity-dew-point, pressure-dew-point, air-flow-basics, choked-flow
 * Simulations in sims/air-physics.js (prefix air-). */
Hyper.add(

/* ================================================================ WHAT AIR IS */
{
  id: 'air-composition', parent: 'gas-laws-topic', title: 'What air is', level: 1,
  short: 'Air is a mixture — about 78 % nitrogen, 21 % oxygen, 1 % argon and a variable amount of water vapour — that behaves almost exactly like a single ideal gas with a molar mass of 28.96 g/mol, a specific gas constant of 287 J/(kg·K) and a ratio of specific heats of 1.4.',
  keywords: ['air', 'composition of air', 'nitrogen', 'oxygen', 'argon', 'water vapour', 'molar mass', 'specific gas constant', 'gas constant of air', 'density of air', 'ratio of specific heats', 'gamma', 'diatomic gas', 'dry air', 'moist air'],
  prereq: ['physics:ideal-gas-law', 'physics:kinetic-theory-gases', 'chemistry:molar-mass'],
  related: ['ideal-gas-law', 'partial-pressures', 'humidity-dew-point', 'isothermal-adiabatic', 'choked-flow', 'aerodynamics:air-properties', 'chemistry:gas-laws'],
  body: `
Pneumatics works with the one fluid that costs nothing to fetch and nothing to throw away: the air around us. To the gas laws it is almost perfectly simple — one ideal gas with a fixed molar mass — with a single troublesome ingredient, water vapour, whose amount changes with the weather.

### What is in it
Dry air has the same make-up everywhere in the lower atmosphere, because winds stir it far faster than anything can separate it:

| Gas | By volume | By mass | Molar mass (g/mol) |
|---|---|---|---|
| Nitrogen, N₂ | 78.08 % | 75.5 % | 28.01 |
| Oxygen, O₂ | 20.95 % | 23.1 % | 32.00 |
| Argon, Ar | 0.93 % | 1.3 % | 39.95 |
| Carbon dioxide, CO₂ | about 0.04 % | 0.06 % | 44.01 |
| Water vapour, H₂O | 0 to 4 %, varies | 0 to 2.5 % | 18.02 |

For an ideal gas the fraction by volume equals the fraction of the molecules (the mole fraction $y_i$), so the mean molar mass of dry air is the weighted average, $M = \\sum y_i M_i = 28.96$ g/mol.

### One gas for engineering
Dividing the molar gas constant by that molar mass gives the **specific gas constant** of air,

$$R_\\text{air} = \\frac{R}{M} = \\frac{8.314}{0.02896} = 287\\,\\mathrm{J/(kg\\cdot K)}$$

and with it the whole of pneumatic thermodynamics: $pV = mR_\\text{air}T$ ([[ideal-gas-law]]). At 1.013 bar and 20 °C a cubic metre of air has a mass of 1.20 kg; at 6 bar gauge, 8.3 kg. Air is a very good ideal gas at pneumatic pressures: its molecules are small, far apart (at 1 bar they fill about a thousandth of the space) and far above their boiling points (−196 °C for nitrogen, −183 °C for oxygen), so the deviations stay well under 1 % up to a hundred bar ([[chemistry:real-gases]]).

### Two atoms per molecule: γ = 1.4
Nitrogen and oxygen molecules are little dumbbells. Besides flying in three directions they can spin about two axes, and at room temperature each of these five motions holds the same share of the energy ([[physics:kinetic-theory-gases]]). That makes $c_v = \\tfrac{5}{2}R_\\text{air} = 718$ J/(kg·K), $c_p = c_v + R_\\text{air} = 1005$ J/(kg·K) and their ratio $\\gamma = c_p/c_v = 1.40$ — the exponent of fast, adiabatic compression that heats the air in a compressor ([[isothermal-adiabatic]]), and the number inside the speed of sound, 343 m/s at 20 °C, which caps the flow through a valve ([[choked-flow]]).

### Water vapour, the troublemaker
Only the water varies: a fraction of a per cent of the molecules on a frosty day, up to 4 % on a hot, humid one. Being lighter (18 g/mol against 29), it makes humid air slightly *less* dense than dry air. Compressing the air concentrates the vapour, and cooling the compressed air turns it back into liquid — the origin of almost every water problem in a compressed-air system ([[partial-pressures]], [[humidity-dew-point]], [[pressure-dew-point]]).

> [!key] For pneumatics, air is one ideal gas: M = 28.96 g/mol, R = 287 J/(kg·K), γ = 1.4 — plus a variable pinch of water vapour.

> [!warn] Never connect oxygen, or any gas other than air or nitrogen, to a compressed-air system. Oil and grease in valves, cylinders and hoses can ignite violently in oxygen under pressure.
`,
  ideas: [
    'Dry air is 78 % nitrogen, 21 % oxygen and 1 % argon by volume, the same everywhere near the ground.',
    'Its mean molar mass is 28.96 g/mol, so its specific gas constant is R/M = 287 J/(kg·K).',
    'Air behaves as an ideal gas to well within 1 % at all pneumatic pressures.',
    'Its molecules have two atoms, which gives γ = cp/cv = 1.4 — the exponent of adiabatic compression.',
    'Water vapour is the one variable part, and the cause of most trouble in compressed-air systems.'
  ],
  pitfalls: [
    'Humid air is heavier than dry air — Water molecules (18 g/mol) replace heavier nitrogen and oxygen molecules (28–32 g/mol), so at the same pressure and temperature humid air is lighter.',
    'Compressed air is a different gas from air — It is the same mixture at a higher density; only its water vapour may leave it as liquid when it is compressed and cooled.',
    'The gas laws need a special value of R for every pressure — R = 287 J/(kg·K) holds for air from vacuum to far beyond pneumatic pressures, because air is so nearly ideal.'
  ],
  formulas: [
    {
      name: 'Specific gas constant',
      expr: 'Rs = R/M', tex: 'R_s = \\dfrac{R}{M}',
      vars: {
        Rs: { name: 'specific gas constant', q: 'specificheat', unit: 'J/(kg·K)', tex: 'R_s' },
        R: { const: 'R' },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 28.96 }
      },
      note: 'For dry air M = 28.96 g/mol gives 287.1 J/(kg·K); for nitrogen 296.8, for water vapour 461.5.',
      stories: { Rs: 'A gas has a mean molar mass of {M}. What is its specific gas constant?', M: 'A gas has a specific gas constant of {Rs}. What is its molar mass?' }
    },
    {
      name: 'Density of a gas from its molar mass',
      expr: 'rho = p*M/(R*T)', tex: '\\rho = \\dfrac{p\\,M}{R\\,T}',
      vars: {
        rho: { name: 'density', q: 'density', unit: 'kg/m³', tex: '\\rho' },
        p: { name: 'pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.013 },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 28.96 },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 20 }
      },
      note: 'The ideal gas law per unit volume. Absolute pressure, absolute temperature (the calculator converts °C).',
      practice: { unknowns: ['rho', 'p', 'M'] },
      stories: { rho: 'What is the density of air ({M}) at {p} and {T}?', p: 'At {T}, air ({M}) has a density of {rho}. What is its absolute pressure?' }
    },
    {
      name: 'Molar mass of moist air',
      expr: 'M = (1 - yw)*Md + yw*Mw', tex: 'M = (1 - y_w)\\,M_d + y_w\\,M_w',
      vars: {
        M: { name: 'mean molar mass of the moist air', q: 'molarmass', unit: 'g/mol' },
        yw: { name: 'mole fraction of water vapour', q: 'ratio', unit: '%', value: 4, min: 0, max: 100, tex: 'y_w' },
        Md: { name: 'molar mass of dry air', q: 'molarmass', unit: 'g/mol', value: 28.96, fixed: true, tex: 'M_d' },
        Mw: { name: 'molar mass of water', q: 'molarmass', unit: 'g/mol', value: 18.02, fixed: true, tex: 'M_w' }
      },
      note: 'A mole-weighted average. Four per cent of water vapour — a hot, humid day — makes air 1.5 % lighter.',
      practice: { unknowns: ['M', 'yw'] },
      stories: { M: 'On a humid day water vapour makes up {yw} of the molecules in the air. What is the mean molar mass of the air?' }
    }
  ],
  examples: [
    {
      title: 'Air in the room and in the line',
      q: 'What is the density of air at 1.013 bar absolute and 20 °C, and in a line at 7 bar gauge and 20 °C?',
      steps: [
        'In the room: $\\rho = p/(R_\\text{air}T) = 101\\,300/(287.06 \\times 293.15) = 1.204$ kg/m³.',
        'In the line the absolute pressure is $7 + 1.013 = 8.013$ bar: $\\rho = 801\\,300/(287.06 \\times 293.15) = 9.52$ kg/m³.',
        'The ratio is simply the ratio of absolute pressures, $8.013/1.013 = 7.9$.'
      ],
      a: '1.20 kg/m³ in the room and 9.52 kg/m³ in the line — 7.9 times denser.'
    },
    {
      title: 'Humid air is lighter',
      q: 'On a tropical afternoon water vapour makes up 4 % of the molecules of the air. By how much is the air lighter than dry air at the same pressure and temperature?',
      steps: [
        '$M = 0.96 \\times 28.96 + 0.04 \\times 18.02 = 27.80 + 0.72 = 28.52$ g/mol.',
        'At the same $p$ and $T$ density is proportional to $M$: $28.52/28.96 = 0.985$.'
      ],
      a: 'About 1.5 % lighter.'
    }
  ],
  quiz: [
    { q: 'By volume, dry air is roughly…', choices: ['78 % N₂, 21 % O₂, 1 % Ar', '50 % N₂, 50 % O₂', '21 % N₂, 78 % O₂, 1 % Ar', '78 % O₂, 21 % CO₂, 1 % N₂'], a: 0,
      why: 'Nitrogen dominates, oxygen is about a fifth, argon nearly one per cent; carbon dioxide is only 0.04 %.' },
    { q: 'Which component of air varies most from day to day and from place to place?', choices: ['argon', 'water vapour', 'nitrogen', 'oxygen'], a: 1,
      why: 'Dry air is well mixed and constant; water vapour ranges from almost nothing to about 4 % of the molecules.' },
    { q: 'Humid air is denser than dry air at the same pressure and temperature.', a: false,
      why: 'Each water molecule (18 g/mol) takes the place of a heavier nitrogen or oxygen molecule, so humid air is lighter.' },
    { q: 'What is the density of air at 7 bar absolute and 20 °C, with R = 287 J/(kg·K)?', answer: 8.32, unit: 'kg/m³',
      why: '$\\rho = 7\\times10^5/(287 \\times 293.15) = 8.32$ kg/m³.' },
    { q: 'Why is γ = cp/cv equal to 1.4 for air?', choices: ['Its molecules have two atoms: they store energy in three directions of motion and two of rotation', 'Air is 1.4 times denser than water vapour', 'Forty per cent of air is oxygen', 'It is an empirical constant with no explanation'], a: 0,
      why: 'Five degrees of freedom give cv = 5/2 R and cp = 7/2 R, so γ = 7/5 = 1.4.' }
  ],
  problems: [
    { q: 'What is the specific gas constant of pure nitrogen (28.01 g/mol)?', answer: 296.8, unit: 'J/(kg·K)', tol: 0.01,
      steps: ['$R_s = R/M = 8.3145/0.02801 = 296.8$ J/(kg·K).'] },
    { q: 'What mass of air, in grams, is in an empty 50 L receiver at 1.013 bar absolute and 20 °C?', answer: 60.2, unit: 'g', tol: 0.02,
      steps: ['$\\rho = 101\\,300/(287.06 \\times 293.15) = 1.204$ kg/m³.', '$m = 1.204 \\times 0.050 = 0.0602$ kg = 60.2 g.'] }
  ],
  applications: [
    'Every gas-law calculation in a compressed-air system, with R = 287 J/(kg·K).',
    'Nitrogen generators separate the 78 % of nitrogen from compressed air for inerting food packs and laser cutting.',
    'Density corrections for flowmeters, fans and compressors at altitude or on hot days.',
    'Breathing-air systems, whose composition is checked against the natural 21 % of oxygen.'
  ],
  history: 'Daniel Rutherford isolated nitrogen in 1772, and Scheele and Priestley oxygen in 1772–74. More than a century later Lord Rayleigh noticed that nitrogen taken from air was half a per cent denser than nitrogen made chemically; with William Ramsay he tracked the difference down in 1894 to a gas nobody had seen — argon, the first of the noble gases.',
  sim: 'air-mixture'
},

/* ================================================================ ABSOLUTE AND GAUGE */
{
  id: 'absolute-gauge-pressure', parent: 'gas-laws-topic', title: 'Absolute and gauge pressure', level: 1,
  short: 'Absolute pressure counts from a perfect vacuum; gauge pressure counts from the atmosphere around the gauge. Workshop gauges read gauge pressure — 6 bar in a line is about 7 bar absolute — while the gas laws, flow through valves and dew points always need absolute pressure. Vacuum is a negative gauge pressure.',
  keywords: ['absolute pressure', 'gauge pressure', 'bar(g)', 'bar(a)', 'barg', 'bara', 'psig', 'psia', 'atmospheric pressure', 'vacuum', 'barometer', 'altitude', 'relative pressure', 'Bourdon gauge', 'overpressure'],
  prereq: ['physics:pressure', 'air-composition', 'hydraulics:gauge-absolute'],
  related: ['boyles-law', 'ideal-gas-law', 'standard-air', 'vacuum-basics', 'vacuum-units', 'pressure-switches', 'aerodynamics:standard-atmosphere', 'aerodynamics:pressure-altitude'],
  body: `
A pressure is always measured *from* something, and in pneumatics it matters which. Say "6 bar" in a workshop and everyone means 6 bar above the atmosphere; say it to the gas laws and they hear 6 bar above a perfect vacuum — a different amount of air.

### Two zeros
**Absolute pressure** counts from a perfect vacuum, where no molecules strike the walls at all. A barometer measures the atmosphere this way: about 1013 mbar at sea level. **Gauge pressure** counts from the atmosphere around the gauge. The common Bourdon gauge — a flattened, curved tube that straightens as the pressure inside rises — sits in a case open to the air, so it reads the difference between inside and outside:

$$p_\\text{abs} = p_g + p_\\text{atm}$$

| Situation | Gauge | Absolute | psig / psia |
|---|---|---|---|
| Perfect vacuum | −1.013 bar | 0 | −14.7 / 0 |
| Suction cup on a good ejector | −0.85 bar | 0.16 bar | −12.3 / 2.4 |
| The atmosphere at sea level | 0 | 1.013 bar | 0 / 14.7 |
| Car tyre | 2.2 bar | 3.2 bar | 32 / 47 |
| Workshop air line | 6 bar | 7.0 bar | 87 / 102 |
| Compressor switching off | 8 bar | 9.0 bar | 116 / 131 |

Write the reference whenever it matters: bar(g) and bar(a) — often "barg" and "bara" — or psig and psia. Catalogues and gauges quote gauge pressure unless they say otherwise; flow standards such as ISO 6358-1:2013 and every gas law use absolute.

### Which one to use
- **Gauge** for forces and differences. A piston has the atmosphere on its other side, so its force is gauge pressure times area ([[pneumatic-cylinder]]); relief settings, regulator settings and pressure drops are gauge too.
- **Absolute** for anything about the *amount* of air: [[boyles-law]], $pV = mRT$, free air ([[standard-air]]), compression ratios, flow through valves ([[choked-flow]]) and dew points ([[pressure-dew-point]]).

The classic slip: raising the supply from 3 to 6 bar doubles a cylinder's force but not its air — the absolute pressure goes from 4.0 to 7.0 bar, so each stroke uses 1.75 times as much. And a compressor delivering 7 bar gauge from the atmosphere has a pressure ratio of $8.01/1.01 = 7.9$, not 7.

### Vacuum: a negative gauge pressure
Below the atmosphere the gauge pressure turns negative. A suction cup at −0.7 bar has 0.31 bar absolute inside. The deepest possible "vacuum" at sea level is −1.013 bar, and that caps the holding force of any cup: the atmosphere does the pushing ([[vacuum-basics]], [[vacuum-units]]).

### The atmosphere moves
The zero of every gauge moves with the weather (about ±30 mbar) and falls with altitude:

| Altitude | 0 m | 1000 m | 1600 m | 2000 m | 3000 m | 5000 m |
|---|---|---|---|---|---|---|
| Atmosphere (ISA) | 1013 mbar | 899 mbar | 835 mbar | 795 mbar | 701 mbar | 540 mbar |

A receiver sealed at sea level and driven to Denver reads 0.18 bar more on its gauge with exactly the same air inside. A regulator holds a gauge pressure, so at altitude it delivers less absolute pressure and less air per stroke; a vacuum cup holds less, because there is less atmosphere to push on it ([[aerodynamics:standard-atmosphere]]).

> [!warn] A gauge reading zero means no pressure at that gauge — not in the whole system. Air can stay trapped behind closed valves and non-return valves, in cylinders and in receivers. Exhaust the system through its dump valve, check each section, and lock out the supply before loosening a fitting.
`,
  ideas: [
    'Absolute pressure = gauge pressure + atmospheric pressure.',
    'Gauges, catalogues and regulator settings are gauge pressures; gas laws, compression ratios, valve flow and dew points need absolute.',
    'Forces on pistons come from gauge pressure, because the atmosphere pushes on the other side too.',
    'Vacuum is a negative gauge pressure, never below −1 atmosphere.',
    'The atmosphere falls with altitude and changes with the weather, and every gauge reading moves with it.'
  ],
  pitfalls: [
    'Doubling the gauge pressure doubles the air in a volume — The amount of air follows the absolute pressure: 3 to 6 bar gauge is 4.0 to 7.0 bar absolute, 1.75 times as much.',
    'A gauge at zero means the system is empty and safe — It means no pressure at that gauge. Air can be trapped elsewhere behind closed and non-return valves; exhaust and check every section.',
    'Vacuum can be as strong as you like — The best vacuum is zero absolute, only about 1 bar below the atmosphere at sea level, and less at altitude.'
  ],
  formulas: [
    {
      name: 'Absolute pressure from gauge pressure',
      expr: 'pabs = pg + patm', tex: 'p_\\text{abs} = p_g + p_\\text{atm}',
      vars: {
        pabs: { name: 'absolute pressure', q: 'pressure', unit: 'bar', tex: 'p_\\text{abs}' },
        pg: { name: 'gauge pressure (negative for vacuum)', q: 'pressure', unit: 'bar', value: 6, signed: true, tex: 'p_g' },
        patm: { name: 'atmospheric pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.013, tex: 'p_\\text{atm}' }
      },
      note: 'Choose psi in the unit menus for psig and psia. A vacuum of −0.8 bar gauge is 0.21 bar absolute at sea level.',
      practice: { unknowns: ['pabs', 'pg'] },
      stories: { pabs: 'A line gauge reads {pg} where the barometer shows {patm}. What is the absolute pressure in the line?', pg: 'A vessel holds air at {pabs} and the atmosphere is at {patm}. What does its gauge read?' }
    },
    {
      name: 'Atmospheric pressure at altitude (troposphere)',
      expr: 'patm = p0*(1 - 2.25577e-5*h)^5.25588', tex: 'p_\\text{atm} = p_0\\left(1 - 2.2558\\times10^{-5}\\,h\\right)^{5.2559}',
      vars: {
        patm: { name: 'atmospheric pressure (absolute)', q: 'pressure', unit: 'mbar', tex: 'p_\\text{atm}' },
        p0: { name: 'sea-level pressure (absolute)', q: 'pressure', unit: 'mbar', value: 1013.25, tex: 'p_0' },
        h: { name: 'altitude', q: 'length', unit: 'm', value: 1600, min: 0, max: 11000 }
      },
      note: 'The ISA standard atmosphere up to 11 km, with h in metres in the formula (other units are converted). The weather moves p₀ by about ±3 %.',
      practice: { unknowns: ['patm', 'h'] },
      stories: { patm: 'A factory stands at {h}. What is the standard atmospheric pressure there, with {p0} at sea level?', h: 'A barometer reads {patm} on a standard day ({p0} at sea level). How high is it?' }
    },
    {
      name: 'Gauge reading of a sealed vessel when the atmosphere changes',
      expr: 'pg2 = pg1 + patm1 - patm2', tex: 'p_{g2} = p_{g1} + p_{\\text{atm}1} - p_{\\text{atm}2}',
      vars: {
        pg2: { name: 'gauge reading afterwards', q: 'pressure', unit: 'bar', signed: true, tex: 'p_{g2}' },
        pg1: { name: 'gauge reading when sealed', q: 'pressure', unit: 'bar', value: 7, signed: true, tex: 'p_{g1}' },
        patm1: { name: 'atmospheric pressure when sealed (absolute)', q: 'pressure', unit: 'bar', value: 1.013, tex: 'p_{\\text{atm}1}' },
        patm2: { name: 'atmospheric pressure afterwards (absolute)', q: 'pressure', unit: 'bar', value: 0.835, tex: 'p_{\\text{atm}2}' }
      },
      note: 'The absolute pressure inside stays the same (at the same temperature); only the zero of the gauge moves.',
      practice: { unknowns: ['pg2', 'patm2'] },
      stories: { pg2: 'A receiver is sealed at {pg1} where the atmosphere is {patm1}, then taken to a site where the atmosphere is {patm2}. What does its gauge read now?' }
    }
  ],
  examples: [
    {
      title: 'A receiver goes to Denver',
      q: 'A receiver is filled to 7.0 bar gauge at sea level (1.013 bar) and sealed. It is taken to Denver, 1600 m up, where the atmosphere is 0.835 bar. What does its gauge read at the same temperature?',
      steps: [
        'Absolute pressure inside: $7.0 + 1.013 = 8.013$ bar. Nothing enters or leaves, so it stays 8.013 bar.',
        'Gauge reading in Denver: $8.013 - 0.835 = 7.18$ bar.'
      ],
      a: '7.18 bar gauge — 0.18 bar more, with exactly the same air inside.'
    },
    {
      title: 'The pressure ratio of a compressor',
      q: 'A compressor draws air from the room at 1.013 bar and delivers it at 7 bar gauge. What is its pressure ratio?',
      steps: [
        'Delivery, absolute: $7 + 1.013 = 8.013$ bar.',
        'Ratio of absolute pressures: $8.013/1.013 = 7.91$.'
      ],
      a: '7.9 — the number that sets its discharge temperature and its work, not 7.'
    },
    {
      title: 'A suction cup in the mountains',
      q: 'An ejector pulls a 50 mm suction cup down to 0.15 bar absolute. What is the most force the cup can hold at sea level (1.013 bar) and at 2000 m (0.795 bar)?',
      steps: [
        'Cup area: $\\pi \\times 0.025^2 = 1.963\\times10^{-3}$ m².',
        'Sea level: $(1.013 - 0.15)\\times10^5 \\times 1.963\\times10^{-3} = 169$ N.',
        'At 2000 m: $(0.795 - 0.15)\\times10^5 \\times 1.963\\times10^{-3} = 127$ N.'
      ],
      a: '169 N at sea level, 127 N at 2000 m — a quarter less, because the atmosphere does the pushing.'
    }
  ],
  quiz: [
    { q: 'A tyre gauge reads 2.2 bar. The absolute pressure in the tyre is about…', choices: ['2.2 bar', '3.2 bar', '1.2 bar', '2.2 × 1.013 bar'], a: 1,
      why: 'Add the atmosphere: 2.2 + 1.013 ≈ 3.2 bar absolute.' },
    { q: 'Which calculation needs absolute pressure?', choices: ['the force of a cylinder', `Boyle's law and free-air conversions`, 'the pressure drop along a pipe', 'the setting of a relief valve'], a: 1,
      why: 'The amount of air follows absolute pressure. Forces, drops and settings are differences from the atmosphere and use gauge pressure.' },
    { q: 'A receiver sealed at sea level shows a higher gauge pressure at the top of a mountain (same temperature).', a: true,
      why: 'Its absolute pressure is unchanged but the atmosphere, the zero of the gauge, is lower.' },
    { q: 'An ejector holds a suction cup at 0.25 bar absolute at sea level (1.013 bar). What is the gauge pressure in the cup, in bar?', answer: -0.763, unit: 'bar',
      why: '$p_g = p_\\text{abs} - p_\\text{atm} = 0.25 - 1.013 = -0.763$ bar.' },
    { q: 'Raising the supply from 3 to 6 bar gauge multiplies the air used per stroke by about…', choices: ['2', '1.75', '1.5', '4'], a: 1,
      why: 'Air per stroke follows the absolute pressure: 7.013/4.013 = 1.75. The force doubles, the air does not.' }
  ],
  problems: [
    { q: 'A barometer reads 985 mbar and a line gauge reads 6.5 bar. What is the absolute pressure in the line?', answer: 7.485, unit: 'bar', tol: 0.01,
      steps: ['$p_\\text{abs} = 6.5 + 0.985 = 7.485$ bar.'] },
    { q: 'What is the standard (ISA) atmospheric pressure at 3000 m?', answer: 701, unit: 'mbar', tol: 0.01,
      steps: ['$p = 1013.25 \\times (1 - 2.2558\\times10^{-5} \\times 3000)^{5.2559} = 1013.25 \\times 0.93233^{5.2559}$.', '$= 1013.25 \\times 0.6919 = 701$ mbar.'] },
    { q: 'A regulator holds 6.0 bar gauge. What absolute pressure does it deliver at 2000 m, where the atmosphere is 795 mbar?', answer: 6.795, unit: 'bar', tol: 0.01,
      steps: ['$p_\\text{abs} = 6.0 + 0.795 = 6.795$ bar — 3 % less than the 7.013 bar it delivers at sea level.'] }
  ],
  applications: [
    'Tyre pressures (gauge) and aircraft cabins, which are pressurised to an absolute pressure.',
    'Specifying compressors and dryers: compression ratios and pressure dew points use absolute pressures.',
    'Vacuum handling, where the holding force depends on the local atmosphere.',
    'Pressure transmitters, made as gauge, absolute or differential types — the wrong type drifts with the weather.'
  ],
  history: 'Torricelli\'s mercury tube of 1643 measured the atmosphere from a vacuum — the first absolute pressure measurement; in 1648 Pascal had one carried up the Puy de Dôme and the column fell by about 8 cm. Eugène Bourdon patented his curved-tube gauge in 1849. Because its tube is surrounded by the atmosphere it reads gauge pressure, and gauge pressure became the language of the workshop.',
  sim: 'air-gauges'
},

/* ================================================================ BOYLE */
{
  id: 'boyles-law', parent: 'gas-laws-topic', title: 'Boyle\'s law', level: 1,
  short: 'At constant temperature the absolute pressure of a trapped quantity of gas is inversely proportional to its volume: p₁V₁ = p₂V₂. Halve the volume and the absolute pressure doubles. It is the law behind free air, air consumption, receivers and the springiness of trapped air.',
  keywords: ['Boyle\'s law', 'Boyle–Mariotte law', 'Mariotte', 'isothermal', 'pressure and volume', 'compression', 'expansion', 'receiver', 'free air', 'inverse proportion', 'air spring'],
  prereq: ['absolute-gauge-pressure', 'air-composition', 'physics:pressure'],
  related: ['charles-gay-lussac', 'ideal-gas-law', 'isothermal-adiabatic', 'standard-air', 'air-consumption', 'receiver-sizing', 'pneumatic-spring', 'chemistry:gas-laws'],
  body: `
Put a finger over the outlet of a bicycle pump and push the handle. The air resists more the further you push, and springs the handle back when you let go. Boyle's law puts a number on that springiness.

### The law
For a fixed quantity of gas kept at the same temperature, pressure and volume are inversely proportional:

$$p_1V_1 = p_2V_2$$

with **absolute** pressures. The reason is counting: the same molecules, moving at the same speeds (the same temperature), shut into half the space strike each square centimetre of wall twice as often ([[physics:kinetic-theory-gases]]).

| Volume of 1 L of room air | 1 L | 0.5 L | 0.25 L | 0.143 L (1/7) | 0.1 L |
|---|---|---|---|---|---|
| Absolute pressure | 1.013 bar | 2.03 bar | 4.05 bar | 7.09 bar | 10.1 bar |
| Gauge pressure | 0 | 1.0 bar | 3.0 bar | 6.1 bar | 9.1 bar |

Halving the volume doubles the absolute pressure — but the gauge goes from 0 to 1 bar, not "double". Working in gauge pressure is the commonest mistake with this law.

### Pneumatics in Boyle's terms
- **Free air.** One litre at 6 bar gauge (7 bar absolute) holds seven litres of atmospheric air, which is why air consumption is counted in free air ([[standard-air]], [[air-consumption]]).
- **Receivers.** When a receiver of volume $V_R$ falls from $p_1$ to $p_2$ it gives out $V_R(p_1 - p_2)/p_\\text{atm}$ of free air — a difference, so gauge or absolute pressures give the same answer. A 500 L receiver falling from 8 to 6 bar gives out about 1000 L of free air: a minute's supply for a 1000 L/min demand ([[receiver-sizing]]).
- **Trapped air as a spring.** Air shut in a cylinder by a closed-centre valve resists being squeezed: compress it by 20 % and its absolute pressure rises by 25 %. That spring is why a pneumatic cylinder is hard to stop precisely in mid-stroke ([[pneumatic-spring]]).
- **Leak testing.** A part pressurised and isolated loses pressure in proportion to the air it leaks, so a falling gauge measures the leak — once the temperature has settled ([[charles-gay-lussac]]).

### What Boyle does not say
The law compares two states **at the same temperature**. It says nothing about the path between them: squeeze air quickly and it heats up, so its pressure rises more than Boyle predicts, then sags as the heat leaks away until Boyle is right again ([[isothermal-adiabatic]]). Compressors, fast cylinders and air springs live in that difference.

> [!key] Boyle's law uses absolute pressures: going from 6 to 3 bar gauge does not double the volume of trapped air — 7.0/4.0 = 1.75.
`,
  ideas: [
    'p₁V₁ = p₂V₂ for a fixed quantity of gas at one temperature, with absolute pressures.',
    'A volume of compressed air holds (absolute pressure ÷ atmospheric) times its own volume of free air.',
    'A receiver gives out V(p₁ − p₂)/p_atm of free air as its pressure falls.',
    'Trapped air is a spring: squeeze it by 20 % and its absolute pressure rises by 25 %.',
    'Boyle compares states at the same temperature; fast compression heats the air and departs from it on the way.'
  ],
  pitfalls: [
    'Boyle\'s law works with gauge pressure — It needs absolute pressure. Compressing air at 0 bar gauge to half its volume gives 1 bar gauge, not 0.',
    'Boyle\'s law holds during a fast compression — It relates states at the same temperature. During a fast stroke the air heats and its pressure runs above Boyle\'s value.',
    'A receiver\'s whole volume of air is available — Only the part between the highest and the lowest usable pressure can be used: V(p₁ − p₂)/p_atm.'
  ],
  formulas: [
    {
      name: 'Boyle\'s law',
      expr: 'p1*V1 = p2*V2', tex: 'p_1 V_1 = p_2 V_2',
      vars: {
        p1: { name: 'initial pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.013 },
        V1: { name: 'initial volume', q: 'volume', unit: 'L', value: 10 },
        p2: { name: 'final pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.013 },
        V2: { name: 'final volume', q: 'volume', unit: 'L' }
      },
      solveFor: 'V2',
      note: 'The same quantity of gas, starting and ending at the same temperature. Absolute pressures.',
      stories: { V2: '{V1} of air at {p1} is compressed and cooled back to its starting temperature at {p2}. What volume does it occupy?', p2: 'A trapped volume of {V1} at {p1} is squeezed slowly to {V2}. What is its pressure now?', V1: 'After compression to {p2} the air fills {V2}. What volume did it fill at {p1}?' }
    },
    {
      name: 'Free air given out by a receiver',
      expr: 'Vf = VR*(p1 - p2)/patm', tex: 'V_\\text{free} = V_R\\,\\dfrac{p_1 - p_2}{p_\\text{atm}}',
      vars: {
        Vf: { name: 'free air given out', q: 'volume', unit: 'L', tex: 'V_\\text{free}' },
        VR: { name: 'receiver volume', q: 'volume', unit: 'L', value: 500, tex: 'V_R' },
        p1: { name: 'starting pressure (gauge)', q: 'pressure', unit: 'bar', value: 8 },
        p2: { name: 'final pressure (gauge)', q: 'pressure', unit: 'bar', value: 6 },
        patm: { name: 'atmospheric pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' }
      },
      note: 'Only the pressure difference counts, so gauge and absolute give the same result. The air is assumed back at its starting temperature.',
      practice: { unknowns: ['Vf', 'VR', 'p2'] },
      stories: { Vf: 'A {VR} receiver falls from {p1} to {p2}. How much free air has it given out?', VR: 'A machine needs {Vf} of free air while the pressure may fall from {p1} to {p2}. What receiver volume is needed?' }
    },
    {
      name: 'How long a receiver can supply a demand',
      expr: 't = VR*(p1 - p2)/(patm*Q)', tex: 't = \\dfrac{V_R\\,(p_1 - p_2)}{p_\\text{atm}\\,Q}',
      vars: {
        t: { name: 'time', q: 'time', unit: 's' },
        VR: { name: 'receiver volume', q: 'volume', unit: 'L', value: 500, tex: 'V_R' },
        p1: { name: 'starting pressure (gauge)', q: 'pressure', unit: 'bar', value: 8 },
        p2: { name: 'lowest usable pressure (gauge)', q: 'pressure', unit: 'bar', value: 6 },
        patm: { name: 'atmospheric pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' },
        Q: { name: 'free-air demand', q: 'airflow', unit: 'L/min ANR', value: 900 }
      },
      note: 'With no compressor running. Free air here is counted at the atmosphere; against ANR\'s 1.000 bar the difference is 1.3 %.',
      practice: { unknowns: ['t', 'VR', 'Q'] },
      stories: { t: 'The compressor stops. A {VR} receiver at {p1} must keep a demand of {Q} going until the pressure reaches {p2}. How long does it last?', VR: 'A demand of {Q} must be carried for {t} while the pressure falls from {p1} to {p2}. What receiver volume is needed?' }
    }
  ],
  examples: [
    {
      title: 'Ten litres into a small space',
      q: 'Ten litres of room air (1.013 bar absolute) are compressed and cooled back to room temperature at 6 bar gauge. What volume do they fill?',
      steps: [
        'Absolute final pressure: $6 + 1.013 = 7.013$ bar.',
        '$V_2 = V_1 p_1/p_2 = 10 \\times 1.013/7.013 = 1.44$ L.',
        'With gauge pressures the calculation would divide by zero at the start — a sure sign that absolute pressure is needed.'
      ],
      a: '1.44 L.'
    },
    {
      title: 'How long does the receiver last?',
      q: 'The compressor of a small plant fails. Its 500 L receiver is at 8 bar gauge, the machines need 900 L/min of free air and stop working below 6 bar. How long can they run?',
      steps: [
        'Free air available: $500 \\times (8 - 6)/1.013 = 987$ L.',
        'Time: $987/900 = 1.10$ min.'
      ],
      a: 'About 66 seconds — enough to finish a cycle safely, not to keep producing.'
    },
    {
      title: 'Trapped air as a spring',
      q: 'A 5/3 valve with a closed centre traps 0.20 L of air at 7.0 bar absolute in a cylinder chamber. A load pushes the piston slowly until the chamber holds 0.16 L. What is the pressure now?',
      steps: [
        '$p_2 = p_1V_1/V_2 = 7.0 \\times 0.20/0.16 = 8.75$ bar absolute.',
        'A 20 % smaller volume raised the pressure by 25 % — the load moved the piston against a soft spring.'
      ],
      a: '8.75 bar absolute (7.7 bar gauge).'
    }
  ],
  quiz: [
    { q: 'Air trapped at 2 bar gauge is compressed slowly to half its volume. Its new gauge pressure is about…', choices: ['4 bar', '5 bar', '3 bar', '6 bar'], a: 1,
      why: 'Absolute: 3.013 bar doubles to 6.03 bar, which is 5.0 bar gauge.' },
    { q: '5 L of air at 1 bar absolute is compressed isothermally to 8 bar absolute. What volume does it fill, in litres?', answer: 0.625, unit: 'L',
      why: '$V_2 = 5 \\times 1/8 = 0.625$ L.' },
    { q: 'Boyle\'s law describes the pressure during a fast compression, as long as the air ends at room temperature.', a: false,
      why: 'It relates two states at the same temperature. During a fast compression the air heats and its pressure is higher than Boyle predicts; only after it cools does Boyle hold again.' },
    { q: 'Doubling the absolute pressure of a gas at constant temperature…', choices: ['halves its volume and doubles its density', 'halves its volume and leaves its density unchanged', 'doubles its volume', 'halves its mass'], a: 0,
      why: 'The same mass in half the volume: twice the density.' },
    { q: 'A 200 L receiver falls from 9 to 7 bar gauge. About how much free air has it given out?', choices: ['about 400 L', 'about 2 L', 'about 200 L', 'about 1600 L'], a: 0,
      why: '$200 \\times 2/1.013 = 395$ L of free air.' }
  ],
  problems: [
    { q: 'A diver\'s 12 L cylinder is at 200 bar gauge. Treating air as ideal, how many litres of free air (at 1.013 bar) does it hold?', answer: 2381, unit: 'L', tol: 0.02,
      steps: ['Absolute: $201.013$ bar.', '$V_\\text{free} = 12 \\times 201.013/1.013 = 2381$ L. (Real air at 200 bar is slightly less compressible, so about 2300 L.)'] },
    { q: 'A chamber of 0.30 L at 7.0 bar absolute is sealed and slowly compressed until the pressure is 9.0 bar absolute. What is its volume now?', answer: 0.2333, unit: 'L', tol: 0.01,
      steps: ['$V_2 = 0.30 \\times 7.0/9.0 = 0.233$ L.'] }
  ],
  applications: [
    'Air consumption of cylinders and tools: swept volume times the absolute pressure ratio.',
    'Sizing receivers for peak demand or a stand-by supply.',
    'Pressure-decay leak testing of parts, valves and whole systems.',
    'Air springs and pneumatic suspension, whose stiffness is set by the trapped volume.'
  ],
  history: 'Robert Boyle, working with Robert Hooke\'s air pump, published the inverse relation in 1662 from a J-shaped glass tube: pouring mercury into the open arm squeezed the air trapped in the closed one. Edme Mariotte found it independently in France in 1676 and stressed that it holds only at constant temperature — so on the Continent it is often called the Boyle–Mariotte law.',
  sim: 'air-gas-piston'
},

/* ================================================================ CHARLES AND GAY-LUSSAC */
{
  id: 'charles-gay-lussac', parent: 'gas-laws-topic', title: 'Charles\'s and Gay-Lussac\'s laws', level: 1,
  short: 'At constant pressure the volume of a gas grows in proportion to its absolute temperature (Charles); at constant volume its absolute pressure does (Gay-Lussac). A receiver in the sun gains pressure, a warm system loses pressure overnight without leaking, and hot air from a compressor shrinks as it cools — with temperatures in kelvin and pressures absolute.',
  keywords: ['Charles\'s law', 'Gay-Lussac\'s law', 'Amontons', 'absolute temperature', 'kelvin', 'thermal expansion of gases', 'combined gas law', 'constant volume', 'constant pressure', 'receiver temperature', 'leak test'],
  prereq: ['boyles-law', 'absolute-gauge-pressure', 'physics:temperature'],
  related: ['ideal-gas-law', 'isothermal-adiabatic', 'standard-air', 'chamber-temperature', 'aftercoolers', 'receivers', 'chemistry:gas-laws'],
  body: `
Warm a balloon and it swells; warm a closed tin and its pressure rises until the lid pops. Both are one fact seen twice: the pressure of a gas comes from the motion of its molecules, and that motion *is* temperature — counted from absolute zero.

### Charles: constant pressure
Keep the pressure fixed (a free piston, a balloon) and the volume grows in proportion to the absolute temperature:

$$\\frac{V_1}{T_1} = \\frac{V_2}{T_2}$$

Near room temperature that is about 0.34 % per kelvin: air warmed from 20 °C to 50 °C takes 10 % more room ($323/293 = 1.10$).

### Gay-Lussac: constant volume
Shut the gas in a rigid vessel and its absolute pressure follows the absolute temperature:

$$\\frac{p_1}{T_1} = \\frac{p_2}{T_2}$$

A receiver filled to 6 bar gauge at 20 °C and left in the sun at 50 °C reaches $7.013 \\times 323/293 = 7.73$ bar absolute, 6.7 bar on the gauge. The other way round, a system shut down warm at 35 °C and read the next morning at 15 °C has lost half a bar with no leak at all — which is why pressure-decay leak tests must wait for the temperature to settle.

### Always in kelvin
Both laws need absolute temperatures, $T = t + 273.15$. Going from 10 °C to 20 °C doubles nothing: it is 283 K to 293 K, 3.5 % more. Extend either law towards zero pressure or zero volume and it points at −273.15 °C, the absolute zero of the kelvin scale.

| Temperature | −20 °C | 0 °C | 20 °C | 50 °C | 80 °C | 150 °C |
|---|---|---|---|---|---|---|
| Absolute | 253 K | 273 K | 293 K | 323 K | 353 K | 423 K |
| Volume (or pressure) relative to 20 °C | 0.86 | 0.93 | 1 | 1.10 | 1.20 | 1.44 |

### All three together
Put Boyle, Charles and Gay-Lussac together for a fixed mass of gas and you have the **combined gas law**,

$$\\frac{p_1V_1}{T_1} = \\frac{p_2V_2}{T_2}$$

the working tool for converting a volume of air measured in one state to another — hot compressed air in a pipe to free air at standard conditions ([[standard-air]]), or the flow of a compressor before and after its aftercooler.

### Where it shows in pneumatics
- **Aftercoolers.** Air leaving a compressor at 80 °C shrinks by 14 % when cooled to 30 °C, and drops much of its water on the way ([[aftercoolers]]).
- **Cylinders.** A chamber filled quickly is heated by the compression and loses pressure as it cools ([[chamber-temperature]]).
- **Outdoor lines.** Cold nights lower the pressure in closed sections and freeze any condensate.
- **Flowmeters.** A meter that measures actual volume in a hot line must be corrected to a reference temperature.

> [!warn] A closed vessel heated by a fire or strong sun gains pressure in proportion to its absolute temperature while the heat weakens its walls. Receivers need a working safety valve, and must not stand near heat sources or be used above their rated temperature.
`,
  ideas: [
    'At constant pressure, volume is proportional to absolute temperature (Charles).',
    'At constant volume, absolute pressure is proportional to absolute temperature (Gay-Lussac).',
    'Temperatures in the gas laws are always in kelvin, pressures always absolute.',
    'The combined law p₁V₁/T₁ = p₂V₂/T₂ converts gas volumes between any two states.',
    'A pressure change in a closed system may be a temperature change, not a leak.'
  ],
  pitfalls: [
    'Doubling the Celsius temperature doubles the pressure — Only the absolute temperature counts: 20 °C to 40 °C is 293 K to 313 K, 7 % more.',
    'A falling pressure in a closed system always means a leak — Air cooling after filling loses pressure too: 35 °C to 15 °C is 6.5 % of the absolute pressure.',
    'Gauge pressure is proportional to temperature — Absolute pressure is; the gauge reading rises by more than the percentage change of temperature.'
  ],
  formulas: [
    {
      name: 'Charles\'s law (constant pressure)',
      expr: 'V1/T1 = V2/T2', tex: '\\dfrac{V_1}{T_1} = \\dfrac{V_2}{T_2}',
      vars: {
        V1: { name: 'volume before', q: 'volume', unit: 'L', value: 10 },
        T1: { name: 'temperature before', q: 'temperature', unit: '°C', value: 20 },
        V2: { name: 'volume after', q: 'volume', unit: 'L' },
        T2: { name: 'temperature after', q: 'temperature', unit: '°C', value: 50 }
      },
      solveFor: 'V2',
      note: 'A fixed mass of gas at constant pressure. Temperatures are used in kelvin (°C are converted).',
      stories: { V2: '{V1} of air at {T1} is warmed to {T2} at constant pressure. What volume does it fill?', T2: 'Air at constant pressure grows from {V1} at {T1} to {V2}. What is its temperature now?' }
    },
    {
      name: 'Gay-Lussac\'s law (constant volume)',
      expr: 'p1/T1 = p2/T2', tex: '\\dfrac{p_1}{T_1} = \\dfrac{p_2}{T_2}',
      vars: {
        p1: { name: 'pressure before (absolute)', q: 'pressure', unit: 'bar', value: 7.013 },
        T1: { name: 'temperature before', q: 'temperature', unit: '°C', value: 20 },
        p2: { name: 'pressure after (absolute)', q: 'pressure', unit: 'bar' },
        T2: { name: 'temperature after', q: 'temperature', unit: '°C', value: 50 }
      },
      solveFor: 'p2',
      note: 'A closed rigid vessel. Absolute pressures, absolute temperatures.',
      stories: { p2: 'A receiver at {p1} and {T1} warms in the sun to {T2}. What is its pressure now?', T2: 'A closed vessel at {p1} and {T1} is found at {p2}. What temperature has it reached?' }
    },
    {
      name: 'Combined gas law (fixed mass)',
      expr: 'p1*V1/T1 = p2*V2/T2', tex: '\\dfrac{p_1 V_1}{T_1} = \\dfrac{p_2 V_2}{T_2}',
      vars: {
        p1: { name: 'pressure in state 1 (absolute)', q: 'pressure', unit: 'bar', value: 1.013 },
        V1: { name: 'volume in state 1', q: 'volume', unit: 'L', value: 1000 },
        T1: { name: 'temperature in state 1', q: 'temperature', unit: '°C', value: 20 },
        p2: { name: 'pressure in state 2 (absolute)', q: 'pressure', unit: 'bar', value: 8.013 },
        V2: { name: 'volume in state 2', q: 'volume', unit: 'L' },
        T2: { name: 'temperature in state 2', q: 'temperature', unit: '°C', value: 80 }
      },
      solveFor: 'V2',
      note: 'Contains Boyle (T constant), Charles (p constant) and Gay-Lussac (V constant).',
      practice: { unknowns: ['V2', 'V1', 'T2'] },
      stories: { V2: '{V1} of air at {p1} and {T1} leaves a compressor at {p2} and {T2}. What volume does it fill?', V1: 'A compressor delivers {V2} of air at {p2} and {T2}. How much air did it take in at {p1} and {T1}?' }
    }
  ],
  examples: [
    {
      title: 'A receiver in the sun',
      q: 'A receiver is filled to 6.0 bar gauge at 20 °C and sealed, then stands in the sun until the air inside reaches 50 °C. What does the gauge read?',
      steps: [
        'Absolute: $p_1 = 7.013$ bar; $T_1 = 293.15$ K, $T_2 = 323.15$ K.',
        '$p_2 = 7.013 \\times 323.15/293.15 = 7.731$ bar absolute.',
        'Gauge: $7.731 - 1.013 = 6.72$ bar.'
      ],
      a: '6.7 bar gauge — 0.7 bar more with no air added.'
    },
    {
      title: 'Is it leaking?',
      q: 'A distribution system is pressurised to 7.0 bar gauge at 35 °C just before the weekend shutdown. On Monday morning the air is at 15 °C. What should the gauge read if nothing leaks?',
      steps: [
        '$p_2 = 8.013 \\times 288.15/308.15 = 7.493$ bar absolute.',
        'Gauge: $7.493 - 1.013 = 6.48$ bar.'
      ],
      a: '6.48 bar gauge — half a bar lower from cooling alone. Only a fall below that points to leaks.'
    },
    {
      title: 'Hot air from the compressor',
      q: 'A compressor takes in 1 m³ of air at 1.013 bar and 20 °C and delivers it at 8.013 bar absolute and 80 °C; the aftercooler then cools it to 30 °C. What volume does the air fill at each stage?',
      steps: [
        'Leaving the compressor: $V = 1 \\times (1.013/8.013) \\times (353.15/293.15) = 0.152$ m³.',
        'After the aftercooler: $V = 1 \\times (1.013/8.013) \\times (303.15/293.15) = 0.131$ m³.'
      ],
      a: '0.152 m³ hot and 0.131 m³ cooled — the aftercooler shrinks it by 14 %.'
    }
  ],
  quiz: [
    { q: 'Air in a closed receiver warms from 10 °C to 40 °C. Its absolute pressure rises by about…', choices: ['300 %', '10.6 %', '4 %', 'nothing'], a: 1,
      why: '$313.15/283.15 = 1.106$: about 10.6 %.' },
    { q: 'Doubling the Celsius temperature of a gas at constant volume doubles its absolute pressure.', a: false,
      why: 'Only absolute temperatures are proportional: 20 °C → 40 °C is 293 K → 313 K, 6.8 % more.' },
    { q: '50 L of air at constant pressure is cooled from 60 °C to 20 °C. What is its new volume, in litres?', answer: 44.0, unit: 'L',
      why: '$50 \\times 293.15/333.15 = 44.0$ L.' },
    { q: 'A pressure-decay leak test starts right after the part is filled with warm air, and the pressure falls. Apart from a leak, the likeliest cause is…', choices: ['the air cooling to room temperature', 'the gauge wearing out', 'air dissolving into the metal', 'the atmosphere rising'], a: 0,
      why: 'Cooling air loses absolute pressure in proportion to its absolute temperature; the test must wait for the temperature to settle.' },
    { q: 'Which temperature scale must be used in the gas laws?', choices: ['Celsius', 'kelvin (absolute)', 'Fahrenheit', 'any scale, if used consistently'], a: 1,
      why: 'The laws are proportions, which only hold on a scale that starts at absolute zero.' }
  ],
  problems: [
    { q: 'A tyre at 2.2 bar gauge and 15 °C warms to 45 °C on a long drive. Taking the volume as constant and the atmosphere as 1.013 bar, what does the gauge read now?', answer: 2.53, unit: 'bar', tol: 0.02,
      steps: ['Absolute: $3.213 \\times 318.15/288.15 = 3.548$ bar.', 'Gauge: $3.548 - 1.013 = 2.53$ bar.'] },
    { q: 'At what temperature does air at constant pressure fill 10 % more volume than at 20 °C?', answer: 49.3, unit: '°C', tol: 0.02,
      steps: ['$T_2 = 1.10 \\times 293.15 = 322.5$ K.', 'In Celsius: $322.5 - 273.15 = 49.3$ °C.'] }
  ],
  applications: [
    'Aftercoolers, which shrink the air and condense its water.',
    'Correcting flowmeter readings and compressor capacity to standard conditions.',
    'Pressure-decay leak tests that wait for thermal stability.',
    'Receivers and outdoor lines exposed to sun and frost.'
  ],
  history: 'Guillaume Amontons noticed around 1700 that the pressure of air rises steadily with temperature, and guessed it would vanish at some very low temperature. Jacques Charles measured the expansion of gases in the 1780s without publishing; Joseph Louis Gay-Lussac published careful measurements in 1802 and credited Charles. Extending their straight lines to zero pointed to about −273 °C — the absolute zero that William Thomson (Lord Kelvin) put at the base of his temperature scale in 1848.',
  sim: 'air-gas-piston'
},

/* ================================================================ IDEAL GAS LAW */
{
  id: 'ideal-gas-law', parent: 'gas-laws-topic', title: 'The ideal gas law', level: 2,
  short: 'pV = mRT ties together the absolute pressure, volume, absolute temperature and mass of a gas; for air R = 287 J/(kg·K). It contains Boyle, Charles and Gay-Lussac, and answers what they cannot: how many kilograms a receiver holds, how dense the air in a line is, what mass a valve passes.',
  keywords: ['ideal gas law', 'equation of state', 'pV = mRT', 'pV = nRT', 'specific gas constant', 'density of compressed air', 'mass of air', 'moles', 'compressibility factor', 'real gas', 'mass flow'],
  prereq: ['boyles-law', 'charles-gay-lussac', 'air-composition', 'physics:ideal-gas-law'],
  related: ['partial-pressures', 'standard-air', 'isothermal-adiabatic', 'receivers', 'chemistry:ideal-gas-law', 'chemistry:real-gases', 'aerodynamics:ideal-gas-air'],
  body: `
Boyle, Charles and Gay-Lussac each hold one thing fixed. The ideal gas law holds nothing fixed and contains all three — and it answers the questions they cannot: how many kilograms of air a receiver holds, how dense the air in a line is, what mass of air a valve passes.

### One equation
$$pV = m\\,R_\\text{air}\\,T$$

with $p$ absolute, $T$ in kelvin and $R_\\text{air} = 287$ J/(kg·K) ([[air-composition]]). Counting the gas in moles instead of kilograms, $pV = nRT$ with $R = 8.314$ J/(mol·K); a mole of any ideal gas fills 24.1 L at 20 °C and 1.013 bar ([[physics:ideal-gas-law]]). Dividing by the volume gives the density,

$$\\rho = \\frac{p}{R_\\text{air}\\,T}$$

— proportional to the absolute pressure, inversely proportional to the absolute temperature.

| Held fixed | Law |
|---|---|
| mass and temperature | Boyle: $pV$ constant |
| mass and pressure | Charles: $V/T$ constant |
| mass and volume | Gay-Lussac: $p/T$ constant |
| nothing | $pV = mR_\\text{air}T$ |

### How dense is compressed air?
| Air at | Density |
|---|---|
| 1.013 bar, 0 °C | 1.29 kg/m³ |
| 1.013 bar, 20 °C | 1.20 kg/m³ |
| ANR: 1 bar, 20 °C, 65 % RH | 1.185 kg/m³ |
| 6 bar gauge, 20 °C | 8.33 kg/m³ |
| 7 bar gauge, 20 °C | 9.52 kg/m³ |
| 7 bar gauge, 80 °C | 7.90 kg/m³ |

### Mass is what is conserved
Along a pipe with no leaks the *mass* flow is the same everywhere; the volume flow changes with every change of pressure and temperature. A compressor has to supply mass, a valve passes mass, a leak loses mass. That is why pneumatics counts air as **free air** — a volume at one fixed reference state, which is a mass in disguise: at ANR one litre is 1.185 g ([[standard-air]]).

### How ideal is air?
The ratio $Z = pV/(mR_\\text{air}T)$, the compressibility factor, stays within about half a per cent of 1 for air at room temperature all the way to 100 bar, because nitrogen and oxygen are so far above their boiling points. For industrial pneumatics the ideal gas law is exact enough; only breathing-air and gas cylinders at 200–300 bar need corrections of a few per cent ([[chemistry:real-gases]]).

> [!tip] Units: with $p$ in pascals, $V$ in cubic metres and $T$ in kelvin, $m$ comes out in kilograms. A handy mixed unit for pneumatics: 1 bar·L = 100 J.
`,
  ideas: [
    'pV = mRT with absolute pressure, absolute temperature and R = 287 J/(kg·K) for air.',
    'The density of air is proportional to absolute pressure over absolute temperature: 1.2 kg/m³ in the room, 9.5 kg/m³ at 7 bar gauge.',
    'Mass flow is conserved along a line; volume flow is not — hence free air.',
    'Air is ideal to within about half a per cent up to 100 bar at room temperature.'
  ],
  pitfalls: [
    'pV = mRT works with gauge pressure if T is in kelvin — Both must be absolute; with gauge pressure a vessel open to the room would hold no air at all.',
    'The volume flow of air is the same all along a line — Mass flow is; the volume flow grows wherever the pressure falls or the temperature rises.',
    'Compressed air is too dense to count as an ideal gas — At pneumatic pressures the error is a fraction of a per cent.'
  ],
  formulas: [
    {
      name: 'Ideal gas law (mass form)',
      expr: 'p*V = m*Rair*T', tex: 'p\\,V = m\\,R_\\text{air}\\,T',
      vars: {
        p: { name: 'pressure (absolute)', q: 'pressure', unit: 'bar', value: 9.013 },
        V: { name: 'volume', q: 'volume', unit: 'L', value: 500 },
        m: { name: 'mass of air', q: 'mass', unit: 'kg' },
        Rair: { const: 'Rair' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25 }
      },
      solveFor: 'm',
      note: 'Absolute pressure and temperature. R_air = 287 J/(kg·K) for dry air; humid air differs by well under 1 %.',
      stories: { m: 'A {V} receiver holds air at {p} and {T}. What mass of air is in it?', p: 'A {V} tank holds {m} of air at {T}. What is the absolute pressure?', T: 'A {V} vessel holds {m} of air at {p}. What is its temperature?' }
    },
    {
      name: 'Ideal gas law (molar form)',
      expr: 'p*V = n*R*T', tex: 'p\\,V = n\\,R\\,T',
      vars: {
        p: { name: 'pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.013 },
        V: { name: 'volume', q: 'volume', unit: 'L' },
        n: { name: 'amount of gas', q: 'amount', unit: 'mol', value: 1 },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 20 }
      },
      solveFor: 'V',
      note: 'One mole fills 24.1 L at 20 °C and 1.013 bar, 22.4 L at 0 °C.',
      practice: { unknowns: ['V', 'n'] },
      stories: { V: 'What volume does {n} of air fill at {p} and {T}?', n: 'How many moles of air are in {V} at {p} and {T}?' }
    },
    {
      name: 'Density of air',
      expr: 'rho = p/(Rair*T)', tex: '\\rho = \\dfrac{p}{R_\\text{air}\\,T}',
      vars: {
        rho: { name: 'density', q: 'density', unit: 'kg/m³', tex: '\\rho' },
        p: { name: 'pressure (absolute)', q: 'pressure', unit: 'bar', value: 8.013 },
        Rair: { const: 'Rair' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 20 }
      },
      note: 'At 7 bar gauge and 20 °C: 9.52 kg/m³.',
      practice: { unknowns: ['rho', 'p', 'T'] },
      stories: { rho: 'What is the density of compressed air at {p} and {T}?', T: 'Air at {p} has a density of {rho}. What is its temperature?' }
    }
  ],
  examples: [
    {
      title: 'The air in a receiver',
      q: 'A 500 L receiver is at 8 bar gauge and 25 °C. What mass of air does it hold, and how much free air is that at ANR (1.185 kg/m³)?',
      steps: [
        '$p = 9.013\\times10^5$ Pa, $V = 0.5$ m³, $T = 298.15$ K.',
        '$m = pV/(R_\\text{air}T) = 9.013\\times10^5 \\times 0.5/(287.06 \\times 298.15) = 5.27$ kg.',
        'As free air: $5.27/1.185 = 4.44$ m³ ANR.'
      ],
      a: '5.27 kg of air, or 4.44 m³ of free air.'
    },
    {
      title: 'Filling a tank by weight',
      q: 'A 50 L tank receives 0.40 kg of air and settles at 30 °C. What does its gauge read (atmosphere 1.013 bar)?',
      steps: [
        '$p = mR_\\text{air}T/V = 0.40 \\times 287.06 \\times 303.15/0.050 = 6.96\\times10^5$ Pa.',
        'That is 6.96 bar absolute, or $6.96 - 1.013 = 5.95$ bar gauge.'
      ],
      a: 'About 5.95 bar gauge.'
    }
  ],
  quiz: [
    { q: 'At the same temperature, air at 7 bar gauge is about how many times denser than the air in the room?', choices: ['6', '7', '8', '49'], a: 2,
      why: 'Density follows absolute pressure: 8.013/1.013 = 7.9.' },
    { q: 'How many kilograms of air does a 1 m³ receiver hold at 10 bar absolute and 20 °C?', answer: 11.88, unit: 'kg',
      why: '$m = 10^6 \\times 1/(287.06 \\times 293.15) = 11.9$ kg.' },
    { q: 'In pV = mRT, gauge pressure may be used as long as the temperature is in kelvin.', a: false,
      why: 'The law counts molecules striking the wall from zero: both pressure and temperature must be absolute.' },
    { q: 'Along a steady compressed-air line with no leaks, which quantity is the same at every section?', choices: ['the volume flow at line conditions', 'the mass flow', 'the velocity', 'the pressure'], a: 1,
      why: 'Mass is conserved; volume flow, velocity and pressure all change along the line.' },
    { q: 'A sealed volume of air is heated from 293 K to 586 K. Its pressure…', choices: ['doubles', 'rises about 15-fold', 'stays the same', 'halves'], a: 0,
      why: 'At constant volume and mass, absolute pressure is proportional to absolute temperature.' }
  ],
  problems: [
    { q: 'A 20 L tank holds air at 8 bar absolute and 20 °C. What mass of air is in it?', answer: 0.190, unit: 'kg', tol: 0.02,
      steps: ['$m = 8\\times10^5 \\times 0.020/(287.06 \\times 293.15) = 0.190$ kg.'] },
    { q: 'What is the density of compressed air at 6 bar gauge (7.013 bar absolute) and 40 °C?', answer: 7.80, unit: 'kg/m³', tol: 0.02,
      steps: ['$\\rho = 7.013\\times10^5/(287.06 \\times 313.15) = 7.80$ kg/m³.'] }
  ],
  applications: [
    'The mass of air in receivers and how long it can supply a demand.',
    'Converting between volume flow at line conditions, free air and mass flow.',
    'Airbag inflators, tyre inflation and pneumatic conveying calculations.',
    'Density corrections for flowmeters.'
  ],
  history: 'Émile Clapeyron combined the laws of Boyle and Charles into a single equation of state in 1834. The universal gas constant took its modern meaning with Avogadro\'s hypothesis and the mole; since the 2019 revision of the SI its value is exact, the product of the Boltzmann and Avogadro constants.'
},

/* ================================================================ PARTIAL PRESSURES */
{
  id: 'partial-pressures', parent: 'gas-laws-topic', title: 'Mixtures and partial pressures', level: 2,
  short: 'In a mixture of gases each component behaves as if it were alone: its partial pressure is its share of the molecules times the total pressure, and the partial pressures add up to the total (Dalton). Compressing air raises every partial pressure — including the water vapour\'s, which has a ceiling, and that is why compressed air drops water.',
  keywords: ['Dalton\'s law', 'partial pressure', 'mole fraction', 'mixture of gases', 'water vapour pressure', 'oxygen partial pressure', 'moisture content', 'humidity ratio', 'mixing ratio', 'g/kg', 'saturation', 'condensation'],
  prereq: ['ideal-gas-law', 'air-composition', 'chemistry:partial-pressures'],
  related: ['humidity-dew-point', 'pressure-dew-point', 'condensate', 'desiccant-dryers', 'chemistry:vapor-pressure', 'physics:kinetic-theory-gases'],
  body: `
Air is a crowd of different molecules — nitrogen, oxygen, argon, water — all bouncing independently. Each kind strikes the walls as if the others were not there, so each contributes its own share of the pressure.

### Dalton's law
The total pressure of a mixture of ideal gases is the sum of the **partial pressures** of its components, and each partial pressure is the component's share of the molecules — its mole fraction $y_i$, equal to its fraction by volume — times the total:

$$p = \\sum p_i, \\qquad p_i = y_i\\,p$$

Compressing air multiplies every partial pressure by the same factor, as long as nothing condenses:

| Component | Share | At 1.013 bar | At 7 bar gauge (8.01 bar absolute) |
|---|---|---|---|
| Nitrogen | 78.1 % | 0.791 bar | 6.26 bar |
| Oxygen | 20.9 % | 0.212 bar | 1.68 bar |
| Argon | 0.93 % | 0.009 bar | 0.075 bar |
| Water vapour (20 °C, 65 % RH) | 1.5 % | 15.2 hPa | 120 hPa, if it could stay vapour |

### The gas that cannot be compressed
Water vapour is different. At each temperature there is a ceiling on its partial pressure, the **saturation vapour pressure** — 23.3 hPa at 20 °C, 124 hPa at 50 °C ([[humidity-dew-point]]). Push the vapour above it and the excess condenses to liquid. Compressing room air to 7 bar gauge raises the vapour to 120 hPa: fine while the air is still hot from the compressor, but cooled back to 20 °C only 23.3 hPa can remain as vapour — four-fifths of the water turns to liquid. That single fact drives the whole of air treatment ([[pressure-dew-point]], [[condensate]]).

### Counting the water: moisture content
Engineers track water as a **moisture content** $x$, grams of water per kilogram of dry air. It does not change when air is compressed or heated — only when water condenses or evaporates:

$$x = 0.622\\,\\frac{p_w}{p - p_w}$$

where 0.622 = 18.02/28.96 is the ratio of the molar masses of water and air. Air at 20 °C and 65 % carries 9.4 g/kg. Saturated at 8 bar absolute and 20 °C it can carry only 1.8 g/kg: compressing and cooling air *dries* it — at the price of a lot of liquid water to drain.

### Oxygen under pressure
At 7 bar gauge the oxygen alone is at 1.7 bar, eight times its partial pressure in the room, and combustion speeds up with it. Oil mist and carbon in a hot compressor discharge line burn more readily than they would in the open — one reason for the temperature limits on compressors.

### Separating by partial pressure
Membrane dryers and nitrogen generators run on partial-pressure differences: water and oxygen molecules pass through the walls of hollow fibres faster than nitrogen, driven by their partial pressure inside against outside ([[desiccant-dryers]]).

> [!key] Each gas in air behaves as if it were alone. Compression raises every partial pressure alike — but water vapour has a ceiling, and everything above it becomes liquid.
`,
  ideas: [
    'The total pressure of a gas mixture is the sum of the partial pressures of its components.',
    'A partial pressure is the mole (volume) fraction times the total pressure.',
    'Compressing air multiplies every partial pressure by the pressure ratio.',
    'Water vapour cannot exceed its saturation pressure; the excess condenses.',
    'Moisture content in g/kg of dry air only changes when water condenses or evaporates.'
  ],
  pitfalls: [
    'Compressing air leaves the water vapour pressure unchanged — It rises with the pressure ratio, eight-fold at 7 bar gauge, until it reaches saturation and condenses.',
    'Relative humidity stays the same when air is compressed — The vapour partial pressure rises with the total pressure, so the relative humidity at the same temperature shoots up past 100 %.',
    'The gases in air share the pressure by mass — They share it by number of molecules (mole fraction), not by mass.'
  ],
  formulas: [
    {
      name: 'Partial pressure (Dalton)',
      expr: 'pc = yi*p', tex: 'p_i = y_i\\,p',
      vars: {
        pc: { name: 'partial pressure of the component (absolute)', q: 'pressure', unit: 'bar', tex: 'p_i' },
        yi: { name: 'mole (volume) fraction of the component', q: 'ratio', unit: '%', value: 20.95, min: 0, max: 100, tex: 'y_i' },
        p: { name: 'total pressure (absolute)', q: 'pressure', unit: 'bar', value: 8.013 }
      },
      note: 'For ideal gases the mole fraction equals the volume fraction: N₂ 78.08 %, O₂ 20.95 %, Ar 0.93 % of dry air.',
      practice: { unknowns: ['pc', 'yi'] },
      stories: { pc: 'Air at {p} contains {yi} of oxygen. What is the partial pressure of the oxygen?', yi: 'In a mixture at {p} one component has a partial pressure of {pc}. What fraction of the molecules is it?' }
    },
    {
      name: 'Vapour pressure after compression',
      expr: 'pw2 = pw1*p2/p1', tex: 'p_{w2} = p_{w1}\\,\\dfrac{p_2}{p_1}',
      vars: {
        pw2: { name: 'vapour partial pressure after compression', q: 'pressure', unit: 'hPa', tex: 'p_{w2}' },
        pw1: { name: 'vapour partial pressure in the intake air', q: 'pressure', unit: 'hPa', value: 15.2, tex: 'p_{w1}' },
        p1: { name: 'intake pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.013 },
        p2: { name: 'working pressure (absolute)', q: 'pressure', unit: 'bar', value: 8.013 }
      },
      note: 'Valid until the vapour reaches the saturation pressure at the air temperature; beyond that the excess condenses.',
      practice: { unknowns: ['pw2', 'p2'] },
      stories: { pw2: 'Air with a vapour pressure of {pw1} at {p1} is compressed to {p2}. What is the vapour pressure now, if nothing condenses?' }
    },
    {
      name: 'Moisture content (humidity ratio)',
      expr: 'x = 0.622*pw/(p - pw)', tex: 'x = 0.622\\,\\dfrac{p_w}{p - p_w}',
      vars: {
        x: { name: 'moisture content, g of water per kg of dry air', q: 'ratio', unit: '‰' },
        pw: { name: 'vapour partial pressure', q: 'pressure', unit: 'hPa', value: 15.2, tex: 'p_w' },
        p: { name: 'total pressure (absolute)', q: 'pressure', unit: 'hPa', value: 1013 }
      },
      note: '1 ‰ = 1 g of water per kg of dry air. 0.622 is the ratio of the molar masses of water and dry air.',
      practice: { unknowns: ['x', 'pw'] },
      stories: { x: 'Air at {p} has a vapour partial pressure of {pw}. How much water does it carry per kilogram of dry air?', pw: 'Air at {p} carries {x} of water. What is its vapour partial pressure?' }
    }
  ],
  examples: [
    {
      title: 'Oxygen in a compressed-air line',
      q: 'What is the partial pressure of oxygen in a line at 7 bar gauge?',
      steps: [
        'Total absolute pressure: $8.013$ bar.',
        '$p_{O_2} = 0.2095 \\times 8.013 = 1.68$ bar.'
      ],
      a: '1.68 bar — eight times the 0.21 bar in the room.'
    },
    {
      title: 'Where the water goes',
      q: 'Room air at 20 °C and 65 % RH (vapour pressure 15.2 hPa) is compressed to 8.013 bar absolute and cooled back to 20 °C, where the saturation pressure is 23.3 hPa. What share of its water condenses?',
      steps: [
        'Without condensation the vapour would reach $15.2 \\times 8.013/1.013 = 120$ hPa.',
        'Only 23.3 hPa can stay as vapour at 20 °C. Moisture content before: $x = 0.622 \\times 15.2/(1013 - 15.2) = 9.47$ g/kg.',
        'After: $x = 0.622 \\times 23.3/(8013 - 23.3) = 1.81$ g/kg.',
        'Condensed: $(9.47 - 1.81)/9.47 = 81$ %.'
      ],
      a: 'About 81 % of the water — 7.7 g per kg of air — becomes liquid.'
    }
  ],
  quiz: [
    { q: 'Air at 1 bar absolute is compressed to 8 bar absolute without cooling. The partial pressure of its oxygen…', choices: ['stays 0.21 bar', 'rises to about 1.7 bar', 'rises to 8 bar', 'falls'], a: 1,
      why: 'Every partial pressure scales with the total: 0.21 × 8 = 1.68 bar.' },
    { q: 'Compressing humid air raises its water vapour partial pressure in proportion to the total pressure — until the vapour starts to condense.', a: true,
      why: 'Dalton: the vapour keeps its mole fraction, so its partial pressure follows the total — up to the saturation ceiling.' },
    { q: 'Air at 20 °C with a vapour pressure of 12 hPa is compressed from 1 to 7 bar absolute and cooled back to 20 °C, where the saturation pressure is 23.3 hPa. What is the vapour partial pressure after cooling, in hPa?', answer: 23.3, unit: 'hPa',
      why: 'Without condensation it would be 84 hPa, above the 23.3 hPa ceiling, so the excess condenses and the vapour sits at saturation.' },
    { q: 'In an ideal-gas mixture, the mole fraction of a component equals…', choices: ['its fraction by volume', 'its fraction by mass', 'its density', 'its molar mass over 29'], a: 0,
      why: 'Equal volumes of ideal gases at the same p and T hold equal numbers of molecules.' },
    { q: 'Why does air hold fewer grams of water per kilogram after it has been compressed and cooled back to its starting temperature?', choices: ['Water condensed out: the same saturation pressure is a smaller share of a higher total pressure', 'Compression destroys water molecules', 'The dry air gets heavier', 'It does not: moisture content never changes'], a: 0,
      why: 'x = 0.622 p_w/(p − p_w): with p_w capped at saturation and p eight times larger, x falls about eight-fold.' }
  ],
  problems: [
    { q: 'What is the partial pressure of argon (0.93 %) in dry air at 10 bar absolute?', answer: 0.093, unit: 'bar', tol: 0.02,
      steps: ['$p_{Ar} = 0.0093 \\times 10 = 0.093$ bar.'] },
    { q: 'Saturated air at 8 bar absolute and 35 °C has a vapour pressure of 56.1 hPa. What is its moisture content in g/kg?', answer: 4.39, unit: '‰', tol: 0.02,
      steps: ['$x = 0.622 \\times 56.1/(8000 - 56.1) = 4.39\\times10^{-3}$ = 4.39 g/kg.'] }
  ],
  applications: [
    'Predicting the condensate from compressors, aftercoolers and dryers.',
    'Membrane dryers and nitrogen generators, driven by partial-pressure differences.',
    'Fire safety in compressors: oxygen at eight times its usual partial pressure.',
    'Mixing gases for welding shields and food packaging.'
  ],
  history: 'John Dalton, a Manchester teacher who kept a weather diary all his life, puzzled over how water vapour could coexist with air. In 1801 he proposed that each gas in a mixture presses independently of the others — an idea that led him, a few years later, to his atomic theory.',
  sim: 'air-mixture'
},

/* ================================================================ ISOTHERMAL AND ADIABATIC */
{
  id: 'isothermal-adiabatic', parent: 'gas-laws-topic', title: 'Isothermal and adiabatic processes', level: 2,
  short: 'Compress air slowly, letting heat flow away, and it follows pV = const (isothermal); compress it quickly and it follows pV^1.4 = const and heats up (adiabatic) — to about 250 °C when squeezed from 1 to 8 bar absolute. Adiabatic compression needs more work, real machines lie in between, and the difference sets discharge temperatures, compressor energy and how air behaves in cylinders.',
  keywords: ['isothermal', 'adiabatic', 'isentropic', 'polytropic', 'pV^n', 'heat of compression', 'discharge temperature', 'compression work', 'ratio of specific heats', 'gamma', 'kappa', 'indicator diagram', 'first law of thermodynamics', 'expansion cooling'],
  prereq: ['boyles-law', 'ideal-gas-law', 'physics:first-law-thermodynamics', 'physics:thermodynamic-processes'],
  related: ['energy-in-compressed-air', 'compression-work', 'multistage-intercooling', 'chamber-temperature', 'pneumatic-spring', 'aftercoolers', 'physics:heat-engines', 'aerodynamics:isentropic-flow'],
  body: `
Pump up a bicycle tyre and touch the bottom of the pump: it is warm. Nothing burned; the air got hot simply because it was squeezed. How hot depends on how fast the heat can get away, and between the two extremes lies most of the thermodynamics of compressors and cylinders.

### Two limits
- **Isothermal** — so slow, or so well cooled, that the temperature never changes. Every joule of work pushed into the air leaves at once as heat, and the air follows Boyle's law, $pV$ = const.
- **Adiabatic** — so fast, or so well insulated, that no heat leaves. The work stays in the air as internal energy and its temperature climbs. For an ideal gas compressed without friction,

$$pV^{\\gamma} = \\text{const}, \\qquad \\frac{T_2}{T_1} = \\left(\\frac{p_2}{p_1}\\right)^{(\\gamma-1)/\\gamma}$$

with $\\gamma = 1.4$ for air, so the exponent $(\\gamma-1)/\\gamma$ is 0.286.

Real processes lie in between and are described as **polytropic**, $pV^n$ = const with $1 < n < 1.4$. A cylinder stroke lasting a fraction of a second is nearly adiabatic; air left in a receiver for a minute is back to isothermal.

| Pressure ratio (absolute) | 2 | 4 | 8 | 10 | 16 |
|---|---|---|---|---|---|
| Volume, isothermal | 0.50 | 0.25 | 0.125 | 0.10 | 0.063 |
| Volume, adiabatic | 0.61 | 0.37 | 0.23 | 0.19 | 0.14 |
| Temperature from 20 °C, adiabatic | 84 °C | 162 °C | 258 °C | 293 °C | 374 °C |

Compressing room air from 1 to 8 bar absolute in one adiabatic stroke would heat it to about **250 °C**. Single-stage piston compressors lose some heat through their finned cylinders but still run hot, which is why pressures above about 8 bar are made in two stages with an intercooler ([[multistage-intercooling]]); oil-injected screw compressors flood the air with oil that soaks up the heat and keep the discharge at 80–95 °C ([[screw-compressors]]).

### Why the air heats: the first law
The first law, $\\Delta U = Q + W$, says it all ([[physics:first-law-thermodynamics]]). The internal energy of an ideal gas depends on its temperature alone. Isothermal: $\\Delta U = 0$, so all the work $W$ done on the air leaves as heat. Adiabatic: $Q = 0$, so all the work raises $U$ — and the temperature. Expansion runs the other way: air expanding adiabatically from 8 bar to 1 bar would cool from 20 °C to −111 °C, which is why air motors can ice up.

### The price of heat: compression work
An ideal compressor draws in a volume $V_1$ at $p_1$, compresses it and pushes it out at $p_2$. Its work is the area enclosed on the p–V diagram:

$$W_\\text{iso} = p_1V_1\\ln\\frac{p_2}{p_1}, \\qquad W_\\text{ad} = \\frac{\\gamma}{\\gamma-1}\\,p_1V_1\\left[\\left(\\frac{p_2}{p_1}\\right)^{(\\gamma-1)/\\gamma} - 1\\right]$$

For one cubic metre of free air to 7 bar gauge: 210 kJ (0.058 kWh) isothermal, 286 kJ (0.079 kWh) adiabatic — 36 % more, because hot air is harder to squeeze, and its heat is thrown away in the aftercooler anyway. Two stages with cooling between them need 244 kJ. The isothermal work is the ideal every compressor designer chases ([[compression-work]], [[energy-in-compressed-air]]).

### Where else it matters
- **Air springs and cylinders:** trapped air is stiffer when squeezed fast — by the factor γ = 1.4 ([[pneumatic-spring]]).
- **Chamber temperatures:** a chamber filling quickly heats up, one exhausting quickly cools, and the pressure drifts afterwards as the walls restore the temperature ([[chamber-temperature]]).
- **Sound:** sound waves are adiabatic compressions, which is why the speed of sound contains γ ([[physics:speed-of-sound]]).

> [!warn] The heat of compression can ignite oil. Oil and carbon deposits in the discharge line of a lubricated compressor can reach temperatures where the vapour ignites. Keep the compressor's temperature protection working, use the specified oil, and never pressurise a hose, vessel or tool beyond its rating.
`,
  ideas: [
    'Isothermal: slow, heat flows away, pV = const, no temperature rise.',
    'Adiabatic: fast, no heat flow, pV^1.4 = const, T₂/T₁ = (p₂/p₁)^0.286 — about 250 °C at 8 bar from 20 °C.',
    'Real compressions are polytropic, pV^n = const with n between 1 and 1.4.',
    'Adiabatic compression to 7 bar gauge needs about 36 % more work than isothermal; intercooling recovers much of it.',
    'Expanding air cools just as compressed air heats: air motors and exhausts can ice up.'
  ],
  pitfalls: [
    'Isothermal compression needs no work because the temperature does not change — It needs work; all of it leaves the air as heat.',
    'Fast compression is more efficient because it is quick — The heat of compression raises the pressure on the way and is then thrown away; adiabatic compression needs more work than isothermal.',
    'The discharge temperature depends on the gauge pressure — It depends on the ratio of absolute pressures: 7 bar gauge from 1.013 bar is a ratio of 7.9.'
  ],
  derivation: {
    title: 'Why pV^γ is constant in an adiabatic compression',
    steps: [
      { text: 'No heat flows, so the work done on the air goes into its internal energy:', tex: 'm\\,c_v\\,dT = -p\\,dV' },
      { text: 'Replace $p$ with the ideal gas law, $p = mR_\\text{air}T/V$, and separate the variables:', tex: 'c_v\\,\\frac{dT}{T} = -R_\\text{air}\\,\\frac{dV}{V}' },
      { text: 'Integrate, using $R_\\text{air}/c_v = (c_p - c_v)/c_v = \\gamma - 1$:', tex: 'T\\,V^{\\gamma - 1} = \\text{const}' },
      { text: 'Replace $T$ with $pV/(mR_\\text{air})$ to get the pressure–volume form, or eliminate $V$ for the temperature–pressure form:', tex: 'p\\,V^{\\gamma} = \\text{const}, \\qquad \\frac{T_2}{T_1} = \\left(\\frac{p_2}{p_1}\\right)^{(\\gamma-1)/\\gamma}' }
    ]
  },
  formulas: [
    {
      name: 'Adiabatic compression: pressure and volume',
      expr: 'p1*V1^gamma = p2*V2^gamma', tex: 'p_1 V_1^{\\gamma} = p_2 V_2^{\\gamma}',
      vars: {
        p1: { name: 'initial pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.013 },
        V1: { name: 'initial volume', q: 'volume', unit: 'L', value: 1 },
        p2: { name: 'final pressure (absolute)', q: 'pressure', unit: 'bar', value: 8.013 },
        V2: { name: 'final volume', q: 'volume', unit: 'L' },
        gamma: { name: 'ratio of specific heats (1.4 for air)', value: 1.4, min: 1.01, max: 1.8, tex: '\\gamma' }
      },
      solveFor: 'V2',
      note: 'Reversible and without heat exchange. For a real polytropic process put n (between 1 and 1.4) in place of γ.',
      practice: { unknowns: ['V2', 'p2'] },
      stories: { V2: '{V1} of air at {p1} is compressed adiabatically to {p2}. What volume does it fill?', p2: '{V1} of air at {p1} is compressed quickly (adiabatically) to {V2}. What is its pressure?' }
    },
    {
      name: 'Temperature after adiabatic compression',
      expr: 'T2 = T1*(p2/p1)^((gamma - 1)/gamma)', tex: 'T_2 = T_1\\left(\\dfrac{p_2}{p_1}\\right)^{(\\gamma-1)/\\gamma}',
      vars: {
        T2: { name: 'temperature after compression', q: 'temperature', unit: '°C' },
        T1: { name: 'temperature before compression', q: 'temperature', unit: '°C', value: 20 },
        p1: { name: 'initial pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.013 },
        p2: { name: 'final pressure (absolute)', q: 'pressure', unit: 'bar', value: 8.013 },
        gamma: { name: 'ratio of specific heats (1.4 for air)', value: 1.4, min: 1.01, max: 1.8, tex: '\\gamma' }
      },
      note: 'Absolute temperatures and pressures. Expansion (p₂ < p₁) gives the cooling of expanding air.',
      practice: { unknowns: ['T2', 'p2'] },
      stories: { T2: 'Air at {T1} and {p1} is compressed adiabatically to {p2}. How hot does it get?', p2: 'Air at {T1} and {p1} must not exceed {T2} in an adiabatic compression. To what pressure can it be compressed in one stage?' }
    },
    {
      name: 'Isothermal compression work',
      expr: 'W = p1*V1*ln(p2/p1)', tex: 'W_\\text{iso} = p_1 V_1 \\ln\\dfrac{p_2}{p_1}',
      vars: {
        W: { name: 'work of compression (isothermal)', q: 'energy', unit: 'kJ', tex: 'W_\\text{iso}' },
        p1: { name: 'intake pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.013 },
        V1: { name: 'volume taken in (at the intake pressure)', q: 'volume', unit: 'm³', value: 1 },
        p2: { name: 'delivery pressure (absolute)', q: 'pressure', unit: 'bar', value: 8.013 }
      },
      note: 'The work of an ideal compressor (intake, compression and delivery) with perfect cooling: the minimum possible.',
      practice: { unknowns: ['W', 'V1'] },
      stories: { W: 'What is the least work needed to compress {V1} of air at {p1} to {p2}?', V1: 'An ideal isothermal compressor spends {W} compressing air from {p1} to {p2}. How much air did it take in?' }
    },
    {
      name: 'Adiabatic compression work',
      expr: 'W = gamma/(gamma - 1)*p1*V1*((p2/p1)^((gamma - 1)/gamma) - 1)', tex: 'W_\\text{ad} = \\dfrac{\\gamma}{\\gamma-1}\\,p_1 V_1\\left[\\left(\\dfrac{p_2}{p_1}\\right)^{(\\gamma-1)/\\gamma} - 1\\right]',
      vars: {
        W: { name: 'work of compression (adiabatic)', q: 'energy', unit: 'kJ', tex: 'W_\\text{ad}' },
        gamma: { name: 'ratio of specific heats (1.4 for air)', value: 1.4, min: 1.01, max: 1.8, tex: '\\gamma' },
        p1: { name: 'intake pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.013 },
        V1: { name: 'volume taken in (at the intake pressure)', q: 'volume', unit: 'm³', value: 1 },
        p2: { name: 'delivery pressure (absolute)', q: 'pressure', unit: 'bar', value: 8.013 }
      },
      note: 'An ideal compressor with no cooling during compression. For a polytropic compressor put n in place of γ.',
      practice: { unknowns: ['W', 'p2'] },
      stories: { W: 'An uncooled ideal compressor takes in {V1} at {p1} and delivers it at {p2}. What work does it need?' }
    }
  ],
  examples: [
    {
      title: 'How hot does one stage get?',
      q: 'A single-stage compressor takes in air at 20 °C and 1.013 bar and delivers it at 7 bar gauge. What would the discharge temperature be for adiabatic compression, and with two stages and cooling to 30 °C between them?',
      steps: [
        'Pressure ratio: $8.013/1.013 = 7.91$.',
        'One stage: $T_2 = 293.15 \\times 7.91^{0.2857} = 293.15 \\times 1.806 = 529$ K = 256 °C.',
        'Two stages share the ratio: $\\sqrt{7.91} = 2.81$ each. First stage: $293.15 \\times 2.81^{0.2857} = 394$ K = 121 °C.',
        'Second stage from 30 °C: $303.15 \\times 1.344 = 407$ K = 134 °C.'
      ],
      a: 'About 256 °C in one stage; 121 °C and 134 °C in two stages with an intercooler.'
    },
    {
      title: 'The price of heat',
      q: 'What work does it take to compress 1 m³ of air from 1.013 bar to 8.013 bar absolute, isothermally and adiabatically?',
      steps: [
        'Isothermal: $W = 1.013\\times10^5 \\times 1 \\times \\ln 7.91 = 1.013\\times10^5 \\times 2.068 = 209.5$ kJ.',
        'Adiabatic: $W = 3.5 \\times 1.013\\times10^5 \\times (7.91^{0.2857} - 1) = 3.5 \\times 1.013\\times10^5 \\times 0.806 = 285.6$ kJ.',
        'Ratio: $285.6/209.5 = 1.36$.'
      ],
      a: '210 kJ against 286 kJ: adiabatic compression needs 36 % more work.'
    },
    {
      title: 'Why the bicycle pump is only warm',
      q: 'A pump barrel holds 0.25 L of air (0.30 g). Pushed quickly from 1 to 5 bar absolute, how hot does the air get, and how much heat does it carry?',
      steps: [
        '$T_2 = 293.15 \\times 5^{0.2857} = 464$ K = 191 °C.',
        'Heat in the air: $m c_v \\Delta T = 0.00030 \\times 718 \\times 171 = 37$ J.',
        'Thirty-seven joules warms a 200 g aluminium barrel by only 0.2 K per stroke — but many strokes add up.'
      ],
      a: 'The air reaches about 190 °C, but holds only 37 J: the barrel warms slowly, stroke by stroke.'
    }
  ],
  quiz: [
    { q: 'Air is compressed from 1 to 8 bar absolute. Compared with slow isothermal compression, fast adiabatic compression ends with…', choices: ['a larger volume and a higher temperature', 'a smaller volume and a lower temperature', 'the same volume and a higher temperature', 'the same volume and temperature'], a: 0,
      why: 'Hot air needs more room at the same pressure: 0.23 of the starting volume against 0.125, at about 258 °C.' },
    { q: 'Air at 20 °C is compressed adiabatically from 1 to 4 bar absolute. What is its final temperature in °C?', answer: 162.5, unit: '°C',
      why: '$T_2 = 293.15 \\times 4^{0.2857} = 435.6$ K = 162 °C.' },
    { q: 'An isothermal compression needs no work, because the temperature does not change.', a: false,
      why: 'Work is done on the air; because its internal energy cannot rise, all of that work leaves as heat.' },
    { q: 'Why do oil-injected screw compressors deliver air at only 80–95 °C at 8 bar?', choices: ['The injected oil absorbs the heat of compression and is cooled in an oil cooler', 'Screw compressors compress isothermally by design', 'The air is compressed in many stages', 'The rotors turn slowly'], a: 0,
      why: 'The oil, with a much larger heat capacity than the air, takes up the heat as the air is compressed.' },
    { q: 'The work to compress 1 m³ of air to 8 bar absolute is least when the compression is…', choices: ['isothermal', 'adiabatic', 'polytropic with n = 1.2', 'the same in every case'], a: 0,
      why: 'Keeping the air cool keeps its pressure low during compression, so the area on the p–V diagram is smallest.' }
  ],
  problems: [
    { q: 'Air at 1 bar absolute and 20 °C is compressed adiabatically to one-fifth of its volume. What is its absolute pressure?', answer: 9.52, unit: 'bar', tol: 0.02,
      steps: ['$p_2 = p_1 (V_1/V_2)^{\\gamma} = 1 \\times 5^{1.4} = 9.52$ bar.'] },
    { q: 'What is the least (isothermal) work, in kJ, to compress 1 m³ of air from 1 to 10 bar absolute?', answer: 230.3, unit: 'kJ', tol: 0.02,
      steps: ['$W = 10^5 \\times 1 \\times \\ln 10 = 2.303\\times10^5$ J = 230 kJ.'] },
    { q: 'Air at 8 bar absolute and 20 °C expands adiabatically to 1 bar absolute. What would its temperature be, in °C?', answer: -111.3, unit: '°C', tol: 0.02,
      steps: ['$T_2 = 293.15 \\times (1/8)^{0.2857} = 161.8$ K.', 'In Celsius: $161.8 - 273.15 = -111$ °C. Real air motors stay much warmer, because heat flows in from their bodies — but they do ice up.'] }
  ],
  applications: [
    'Compressor discharge temperatures, intercoolers and aftercoolers.',
    'The diesel engine and the fire piston: ignition by the heat of compression.',
    'Air springs and cylinders, whose fast stiffness is 1.4 times their slow stiffness.',
    'Air motors and tools that ice up as their exhaust air expands and cools.'
  ],
  history: 'Newton\'s formula for the speed of sound assumed isothermal compressions and came out 15 % low; Laplace corrected it in 1816 by recognising that sound compresses air adiabatically, and Poisson worked out the relation pV^γ = const in 1823. Rudolf Diesel patented his compression-ignition engine in 1892 — though the fire piston, a closed tube with a tight plunger that lights tinder when struck, had long been used in Southeast Asia.',
  sim: ['air-gas-piston', 'air-compression-heat']
},

/* ================================================================ ENERGY STORED */
{
  id: 'energy-in-compressed-air', parent: 'gas-laws-topic', title: 'Energy stored in compressed air', level: 2,
  short: 'A receiver of compressed air stores energy, but not much: a cubic metre at 7 bar gauge can deliver at most about a quarter of a kilowatt-hour. All the electricity a compressor draws ends up as heat, only the air\'s ability to do work travels down the pipe, and a cylinder that fills with air and throws it away uses a small part of that — typically 10–15 % from socket to load.',
  keywords: ['energy storage', 'exergy', 'stored energy', 'efficiency', 'end-to-end efficiency', 'specific energy', 'kWh per m³', 'isothermal efficiency', 'expansion', 'compressed air energy storage', 'CAES', 'receiver energy'],
  prereq: ['isothermal-adiabatic', 'ideal-gas-law', 'physics:work', 'physics:efficiency'],
  related: ['cost-of-compressed-air', 'compression-work', 'heat-recovery', 'air-saving-circuits', 'pneumatic-vs-electric', 'air-leaks', 'pressure-optimisation', 'pressure-equipment'],
  body: `
Compressed air is often called the fourth utility, after electricity, gas and water. It is also by far the most expensive way to deliver mechanical work, and the reasons are pure thermodynamics.

### What a receiver stores
Air at room temperature in a receiver has no more internal energy than the air around it — for an ideal gas internal energy depends on temperature alone. What it has is the ability to do work, its **exergy**. The most work a volume $V$ at absolute pressure $p$ can deliver comes from letting it expand slowly, at room temperature, down to the atmosphere $p_0$:

$$W_\\text{max} = V\\left[p\\ln\\frac{p}{p_0} - (p - p_0)\\right]$$

(the second term is the work spent pushing the atmosphere aside). A cubic metre at 7 bar gauge holds 0.96 MJ — **0.27 kWh**, enough to run a 1.5 kW drill for ten minutes.

| Store | Energy |
|---|---|
| 1 m³ receiver at 7 bar gauge | 0.27 kWh |
| 50 L breathing-air cylinder at 300 bar | about 2 kWh |
| 12 V, 60 Ah car battery | about 0.7 kWh |
| 1 L of diesel fuel | about 10 kWh |

### From the socket to the air
Compressing a cubic metre of free air to 7 bar gauge takes at least 0.058 kWh ([[isothermal-adiabatic]]). A good compressor package needs 6–7 kW for every m³/min it delivers — **0.10–0.12 kWh per m³**, about twice the minimum, the rest lost to the heat of real compression, the motor and the drive. And because the air is cooled back to room temperature, *all* of the electricity leaves as heat, around 90 % of it at the compressor, in its cooling air or water, where much of it can be recovered for heating ([[heat-recovery]]). Only the exergy travels down the pipe.

### From the air to the work
A cylinder then spends that exergy badly. It fills with air at full pressure, pushes, and at the end of the stroke throws the still-compressed air away through its silencer: the expansion work the air could have done is lost. Per unit of free air a stroke delivers $p_g\\,p_0/(p_g + p_0)$ of work — at 6 bar about 44 % of the air's exergy. Against electricity at 0.11 kWh per m³ that is **22 % at best** ([[air-consumption]]).

| Step (a typical plant) | Left of 100 kWh |
|---|---|
| Electricity into the compressor | 100 |
| Exergy of the delivered air (compressor about 50 % of the isothermal ideal) | 50 |
| After leaks (25 %) and pressure drops in the network | 35 |
| After the cylinder exhausts its air unexpanded | 15 |
| After spare force (load ratio about 70 %) | 10 |

An end-to-end efficiency of **10–15 %** is typical for a pneumatic drive, and less is common. That is the case for every air-saving measure — fixing leaks ([[air-leaks]]), lowering the pressure ([[pressure-optimisation]]), returning strokes at low pressure ([[air-saving-circuits]]) — and sometimes for an electric drive instead ([[pneumatic-vs-electric]]).

### Storing energy at grid scale
Compressed-air energy storage plants pump air into underground salt caverns at roughly 45–75 bar and later run it back through turbines. The first, at Huntorf in Germany (1978), and McIntosh in Alabama (1991) reheat the air with natural gas before expanding it and return roughly 40–55 % of the energy. The heat of compression is the obstacle at that scale too.

> [!warn] A receiver's stored energy is released in milliseconds if it fails: a 500 L receiver at 10 bar gauge holds about 1 MJ, comparable to a few hundred grams of explosive. Receivers are pressure vessels — they need a working safety valve, regular draining and inspection as the local pressure-equipment rules require ([[pressure-equipment]]). Release the pressure before working on any part of the system.
`,
  ideas: [
    'Compressed air at room temperature stores exergy, the ability to do work, not extra internal energy.',
    'A cubic metre at 7 bar gauge holds at most about 0.27 kWh.',
    'All the electricity a compressor draws ends up as heat, most of it recoverable at the compressor.',
    'A cylinder that exhausts its air unexpanded uses less than half of the air\'s exergy.',
    'End to end, a pneumatic drive typically turns 10–15 % of its electricity into useful work.'
  ],
  pitfalls: [
    'Compressed air stores the energy the compressor used — It stores only its exergy, about half the electricity at best; the rest left as heat at the compressor.',
    'Higher pressure makes a pneumatic drive more efficient — Beyond what the load needs, higher pressure adds leakage and throws away more expansion energy at every exhaust.',
    'A receiver is safe because air is harmless — A receiver stores enough energy to be dangerous if it fails; it is a pressure vessel with rules for its safety valve and inspection.'
  ],
  formulas: [
    {
      name: 'Most work from a receiver (isothermal expansion)',
      expr: 'W = V*(p*ln(p/p0) - (p - p0))', tex: 'W_\\text{max} = V\\left[p\\ln\\dfrac{p}{p_0} - (p - p_0)\\right]',
      vars: {
        W: { name: 'most work available', q: 'energy', unit: 'kJ', tex: 'W_\\text{max}' },
        V: { name: 'receiver volume', q: 'volume', unit: 'm³', value: 1 },
        p: { name: 'receiver pressure (absolute)', q: 'pressure', unit: 'bar', value: 8.013 },
        p0: { name: 'atmospheric pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.013, tex: 'p_0' }
      },
      note: 'The exergy of the stored air, at ambient temperature. Choose kWh in the unit menu: 1 m³ at 7 bar gauge gives 0.27 kWh.',
      practice: { unknowns: ['W', 'V'] },
      stories: { W: 'A {V} receiver is at {p}, the atmosphere at {p0}. What is the most work its air can do?', V: 'A reserve of {W} of work is wanted from air at {p} (atmosphere {p0}). What receiver volume is needed?' }
    },
    {
      name: 'Least energy to compress free air',
      expr: 'E = Vf*p0*ln(p/p0)', tex: 'E_\\text{min} = V_\\text{free}\\,p_0\\ln\\dfrac{p}{p_0}',
      vars: {
        E: { name: 'least energy (isothermal)', q: 'energy', unit: 'kWh', tex: 'E_\\text{min}' },
        Vf: { name: 'free air compressed', q: 'volume', unit: 'm³', value: 1, tex: 'V_\\text{free}' },
        p0: { name: 'intake pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.013, tex: 'p_0' },
        p: { name: 'delivery pressure (absolute)', q: 'pressure', unit: 'bar', value: 8.013 }
      },
      note: 'The thermodynamic minimum; real compressor packages need about twice as much (0.10–0.12 kWh/m³ at 7 bar gauge).',
      practice: { unknowns: ['E', 'p'] },
      stories: { E: 'What is the least energy needed to compress {Vf} of free air from {p0} to {p}?' }
    },
    {
      name: 'Best-case efficiency of a cylinder stroke',
      expr: 'eta = pg*p0/((pg + p0)*es)', tex: '\\eta = \\dfrac{p_g\\,p_0}{(p_g + p_0)\\,e_s}',
      vars: {
        eta: { name: 'electricity-to-work efficiency', q: 'ratio', unit: '%', tex: '\\eta' },
        pg: { name: 'supply pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        p0: { name: 'atmospheric pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.013, tex: 'p_0' },
        es: { name: 'compressor electricity per volume of free air', q: 'energydensity', unit: 'kJ/m³', value: 396, tex: 'e_s' }
      },
      note: 'Work of a stroke p_g·V against the electricity for its free air, (p_g + p₀)V/p₀ × e_s. 0.11 kWh/m³ = 396 kJ/m³. Leaks, pressure drops and spare force come on top.',
      practice: { unknowns: ['eta', 'es'] },
      stories: { eta: 'A cylinder works at {pg}; the compressor needs {es} of electricity per cubic metre of free air. What share of the electricity can become useful work at best?' }
    }
  ],
  examples: [
    {
      title: 'The energy in a receiver',
      q: 'How much work can the air in a 1 m³ receiver at 7 bar gauge deliver at most?',
      steps: [
        '$p = 8.013$ bar, $p_0 = 1.013$ bar, $\\ln(p/p_0) = \\ln 7.91 = 2.068$.',
        '$W = 1 \\times (8.013\\times10^5 \\times 2.068 - 7.0\\times10^5) = 1.657\\times10^6 - 0.700\\times10^6 = 0.957$ MJ.',
        'In kilowatt-hours: $0.957/3.6 = 0.27$ kWh.'
      ],
      a: 'About 0.96 MJ, or 0.27 kWh — ten minutes of a 1.5 kW drill.'
    },
    {
      title: 'Where the electricity goes',
      q: 'A cylinder works at 6 bar gauge; the compressor needs 0.11 kWh (396 kJ) per m³ of free air. The load uses 60 % of the cylinder\'s force and a quarter of the plant\'s air leaks away. Estimate the end-to-end efficiency.',
      steps: [
        'Best case, per stroke: $\\eta = 6 \\times 1.013/(7.013 \\times 3.96) = 0.219$.',
        'Only 60 % of the force moves the load: $0.219 \\times 0.6 = 0.131$.',
        'A quarter of all air is lost to leaks: $0.131 \\times 0.75 = 0.099$.'
      ],
      a: 'About 10 % — a tenth of the electricity reaches the load as work.'
    }
  ],
  quiz: [
    { q: 'Compressed air that has cooled back to room temperature holds, compared with the air around it…', choices: ['the same internal energy, but the ability to do work', 'much more internal energy', 'less mass per litre', 'more heat'], a: 0,
      why: 'For an ideal gas internal energy depends only on temperature. The compressed air has exergy: it can do work while expanding.' },
    { q: 'Where does most of the electricity a compressor draws end up?', choices: ['as heat at the compressor, in its cooling air, water or oil', 'stored in the air', 'as work at the cylinders', 'in the receiver walls'], a: 0,
      why: 'Because the compressed air is cooled back to room temperature, essentially all the electrical input leaves as heat — about 90 % at the compressor itself.' },
    { q: 'What is the most work, in kJ, obtainable from a 0.5 m³ receiver at 9 bar absolute expanding isothermally to 1 bar?', answer: 588.8, unit: 'kJ',
      why: '$W = 0.5 \\times (9\\times10^5 \\ln 9 - 8\\times10^5) = 0.5 \\times (1.978 - 0.8)\\times10^6 = 589$ kJ.' },
    { q: 'Raising the supply from 6 to 8 bar makes a cylinder that already moves its load fast enough more energy-efficient.', a: false,
      why: 'It uses 29 % more air per stroke, leaks more, and throws away more expansion energy at every exhaust — for no extra useful work.' },
    { q: 'The end-to-end efficiency of a typical pneumatic drive, electricity to useful work, is about…', choices: ['10–15 %', '50–60 %', '80–90 %', '1 %'], a: 0,
      why: 'Compressor losses, leaks, pressure drops, unexpanded exhausts and spare force each take their share.' }
  ],
  problems: [
    { q: 'What is the least (isothermal) energy, in kWh, to compress 1 m³ of free air from 1 to 10 bar absolute?', answer: 0.0640, unit: 'kWh', tol: 0.02,
      steps: ['$E = 10^5 \\times 1 \\times \\ln 10 = 2.303\\times10^5$ J.', '$2.303\\times10^5/3.6\\times10^6 = 0.064$ kWh.'] },
    { q: 'A cylinder works at 5 bar gauge; the compressor needs 0.10 kWh (360 kJ) per m³ of free air. What is the best-case efficiency of a stroke, in per cent?', answer: 23.4, unit: '%', tol: 0.02,
      steps: ['$\\eta = 5 \\times 1.013/((5 + 1.013) \\times 3.60) = 5.065/21.65 = 0.234$ = 23.4 %.'] }
  ],
  applications: [
    'Judging air-saving measures by the energy they save, not only the air.',
    'Heat recovery from compressors for space heating and hot water.',
    'Large compressed-air energy storage in underground caverns.',
    'Choosing between pneumatic and electric actuators over a machine\'s life.'
  ],
  history: 'In the 1880s Victor Popp built a compressed-air network under the streets of Paris. It started by driving public clocks with pulses of air and grew into a power supply for workshops, lifts and small engines across the city; parts of it kept working for about a century.',
  sim: ['air-energy-chain', 'air-compression-heat']
},

/* ================================================================ STANDARD AIR */
{
  id: 'standard-air', parent: 'air-quantities', title: 'Free air, ANR and standard conditions', level: 1,
  short: 'Because a litre of compressed air contains several litres of atmospheric air, flows and consumptions are counted as free air: the volume the air would fill at a stated reference state. Pneumatics uses ANR (ISO 8778: 20 °C, 100 kPa, 65 % RH); gas engineering uses normal cubic metres (DIN 1343: 0 °C, 1013.25 mbar); American catalogues use SCFM. Converting between them is the combined gas law.',
  keywords: ['free air', 'ANR', 'ISO 8778', 'standard reference atmosphere', 'normal cubic metre', 'Nm³', 'DIN 1343', 'SCFM', 'ACFM', 'free air delivery', 'FAD', 'ISO 1217', 'standard litres', 'Nl/min', 'reference conditions', 'flowmeter'],
  prereq: ['ideal-gas-law', 'charles-gay-lussac', 'absolute-gauge-pressure'],
  related: ['air-consumption', 'fad-capacity', 'sonic-conductance', 'air-audits', 'pneumatic-cylinder', 'cost-of-compressed-air', 'humidity-dew-point'],
  body: `
"This cylinder uses 100 litres a minute." Of what? A hundred litres of air at 6 bar gauge is seven hundred litres of air from the room — and seven times the compressor's work. A volume of gas means nothing until its pressure and temperature are stated, so pneumatics counts air as **free air**: the volume it would fill at an agreed reference state. Because that state is fixed, a litre of free air is a fixed mass of air — a flow in free air is a mass flow in volume units.

### The reference states
| Name | Used for | Temperature | Pressure | Humidity | Density |
|---|---|---|---|---|---|
| ANR, ISO 8778:2003 | pneumatic components, valve flow (ISO 6358) | 20 °C | 100 kPa (1 bar) | 65 % | 1.185 kg/m³ |
| Normal, DIN 1343:1990 (Nm³) | gas industry, dryers, many flowmeters | 0 °C | 101.325 kPa | dry | 1.293 kg/m³ |
| Standard (SCFM) | American catalogues | 60 °F (some 68 °F) | 14.696 psia (some 14.5) | dry or 36 % | about 1.22 kg/m³ |
| Free air delivery, ISO 1217:2009 | compressor capacity | as at the intake | as at the intake | as at the intake | varies |

ANR stands for *atmosphère normale de référence*. The same mass of air is about 9 % more cubic metres ANR than Nm³ — 1 Nm³ = 1.087 m³ ANR — more than most flowmeters' error. SCFM is worse: there are several American "standards", 3–4 % apart. This app uses 60 °F and 14.696 psia, for which 1 SCFM = 29.1 L/min ANR; and 1 m³/min is about 35.3 cubic feet per minute.

### Converting: the combined gas law
A volume $V$ measured at absolute pressure $p$ and temperature $T$ fills, at the reference state $(p_n, T_n)$,

$$V_n = V\\,\\frac{p}{p_n}\\,\\frac{T_n}{T}$$

For compressed air at the reference temperature this is just Boyle: a litre at 6 bar gauge is $7.013/1.0 = 7.0$ L ANR. Humidity is left out of these conversions; at 65 % it changes the result by about 1 %.

Strictly, free air at the local atmosphere (1.013 bar) and ANR (1.000 bar) differ by 1.3 %. Formulas on these pages that divide by the atmospheric pressure count free air at the local atmosphere; valve data use ANR. For most engineering the difference is smaller than the other uncertainties — but know which one you are using.

### Free air delivery
A compressor's capacity is its **free air delivery** (FAD, measured to ISO 1217:2009): the flow it delivers, counted as a volume at the conditions *at its intake*. On a hot day at altitude that is less mass than at ANR: 10 m³/min FAD with 35 °C and 0.95 bar at the intake is only 9.0 m³/min ANR. Size compressors for the worst intake conditions they will meet ([[fad-capacity]]).

### Flowmeters
Thermal mass flowmeters read standard volume directly — to *their* reference, often 0 °C or 15 °C. Vortex and differential-pressure meters measure the actual volume in the pipe and must be corrected for line pressure and temperature. Before comparing a meter with a compressor or a consumption budget, check both references ([[air-audits]]).

> [!tip] Always write the reference with the number: "L/min ANR", "Nm³/h", "SCFM (60 °F, 14.7 psia)". Mixing a 0 °C and a 20 °C reference is a 7 % error before anything has been measured.
`,
  ideas: [
    'Free air is the volume the air would fill at a reference state — in effect, its mass.',
    'Pneumatics uses ANR (ISO 8778): 20 °C, 100 kPa, 65 % RH, 1.185 kg/m³.',
    'Normal cubic metres (0 °C, 1013.25 mbar) are about 9 % "larger": 1 Nm³ = 1.087 m³ ANR.',
    'Convert with the combined gas law: V_n = V (p/p_n)(T_n/T), absolute pressure and temperature.',
    'Compressor FAD refers to intake conditions; hot or high intakes deliver less mass.'
  ],
  pitfalls: [
    'A litre of air is a litre of air — A litre at 6 bar gauge holds seven litres of free air; a volume means nothing without its pressure and temperature.',
    'Nm³ and m³ ANR are the same — They differ by about 9 %: 0 °C and 1.013 bar against 20 °C and 1.000 bar.',
    'SCFM is one well-defined unit — Several American standard conditions are in use, 3–4 % apart; check which one a data sheet means.'
  ],
  formulas: [
    {
      name: 'A gas volume at reference conditions',
      expr: 'Vn = V*p*Tn/(pn*T)', tex: 'V_n = V\\,\\dfrac{p}{p_n}\\,\\dfrac{T_n}{T}',
      vars: {
        Vn: { name: 'volume at the reference state', q: 'volume', unit: 'L', tex: 'V_n' },
        V: { name: 'actual volume', q: 'volume', unit: 'L', value: 10 },
        p: { name: 'actual pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.013 },
        T: { name: 'actual temperature', q: 'temperature', unit: '°C', value: 35 },
        pn: { name: 'reference pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.0, tex: 'p_n' },
        Tn: { name: 'reference temperature', q: 'temperature', unit: '°C', value: 20, tex: 'T_n' }
      },
      note: 'ANR: pₙ = 1.000 bar, Tₙ = 20 °C. DIN 1343: pₙ = 1.01325 bar, Tₙ = 0 °C.',
      practice: { unknowns: ['Vn', 'V'] },
      stories: { Vn: '{V} of air at {p} and {T}: how much is that at the reference state {pn}, {Tn}?', V: 'What volume at {p} and {T} holds {Vn} of air counted at {pn} and {Tn}?' }
    },
    {
      name: 'Flow in the line to free air (ANR)',
      expr: 'Qf = Q*(pg + patm)/pn*Tn/T', tex: 'Q_\\text{ANR} = Q\\,\\dfrac{p_g + p_\\text{atm}}{p_n}\\,\\dfrac{T_n}{T}',
      vars: {
        Qf: { name: 'free-air flow', q: 'airflow', unit: 'L/min ANR', tex: 'Q_\\text{ANR}' },
        Q: { name: 'actual volume flow in the line', q: 'flowrate', unit: 'L/min', value: 450 },
        pg: { name: 'line pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        patm: { name: 'atmospheric pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.013, tex: 'p_\\text{atm}' },
        pn: { name: 'reference pressure (ANR, absolute)', q: 'pressure', unit: 'bar', value: 1.0, fixed: true, tex: 'p_n' },
        Tn: { name: 'reference temperature (ANR)', q: 'temperature', unit: '°C', value: 20, fixed: true, tex: 'T_n' },
        T: { name: 'line temperature', q: 'temperature', unit: '°C', value: 35 }
      },
      note: 'For meters that measure actual volume (vortex, turbine, differential pressure). Choose SCFM or m³/h ANR in the unit menu.',
      practice: { unknowns: ['Qf', 'Q'] },
      stories: { Qf: 'A meter in a line at {pg} and {T} shows an actual flow of {Q}. What is the flow in free air?', Q: 'A machine needs {Qf}. What actual flow does that make in its supply line at {pg} and {T}?' }
    },
    {
      name: 'Between two reference states',
      expr: 'Q2 = Q1*(p1/p2)*(T2/T1)', tex: 'Q_2 = Q_1\\,\\dfrac{p_1}{p_2}\\,\\dfrac{T_2}{T_1}',
      vars: {
        Q2: { name: 'flow counted at reference state 2', q: false, unit: 'm³/h' },
        Q1: { name: 'flow counted at reference state 1', q: false, unit: 'm³/h', value: 100 },
        p1: { name: 'reference pressure 1 (absolute)', q: 'pressure', unit: 'kPa', value: 100 },
        T1: { name: 'reference temperature 1', q: 'temperature', unit: '°C', value: 20 },
        p2: { name: 'reference pressure 2 (absolute)', q: 'pressure', unit: 'kPa', value: 101.325 },
        T2: { name: 'reference temperature 2', q: 'temperature', unit: '°C', value: 0 }
      },
      note: 'The defaults turn 100 m³/h ANR into 91.96 Nm³/h (DIN 1343). The same mass of air, counted two ways.',
      practice: { unknowns: ['Q2', 'Q1'] },
      stories: { Q2: 'A flow of {Q1} is counted at {p1} and {T1}. What is it at {p2} and {T2}?' }
    }
  ],
  examples: [
    {
      title: 'Reading a line flowmeter',
      q: 'A vortex meter in a line at 6 bar gauge and 35 °C shows 450 L/min of actual flow. What is the flow in L/min ANR, in Nm³/h and in SCFM?',
      steps: [
        'ANR: $450 \\times (7.013/1.0) \\times (293.15/308.15) = 3002$ L/min ANR.',
        'Normal: $3002 \\times 0.9196 = 2761$ L/min = 165.6 Nm³/h.',
        'SCFM (60 °F, 14.696 psia): $3002/29.13 = 103$ SCFM.'
      ],
      a: 'About 3.0 m³/min ANR — 166 Nm³/h, or 103 SCFM.'
    },
    {
      title: 'A compressor on a hot day at altitude',
      q: 'A compressor is rated 10 m³/min FAD. At a site where the intake air is at 35 °C and 0.95 bar, how much free air does it deliver in m³/min ANR?',
      steps: [
        'FAD is counted at the intake: 10 m³/min at 0.95 bar and 308.15 K.',
        'At ANR: $10 \\times (0.95/1.0) \\times (293.15/308.15) = 9.04$ m³/min.'
      ],
      a: '9.0 m³/min ANR — 10 % less air than a demand budget in ANR might assume.'
    }
  ],
  quiz: [
    { q: 'The standard reference atmosphere of ISO 8778 (ANR) is…', choices: ['20 °C, 100 kPa, 65 % RH', '0 °C, 101.325 kPa, dry', '15 °C, 101.325 kPa, dry', '60 °F, 14.7 psia'], a: 0,
      why: 'ANR is the pneumatic reference: a comfortable workshop day at 1 bar.' },
    { q: 'A flow of 1000 L/min ANR is how many Nm³/h (DIN 1343: 0 °C, 101.325 kPa)?', answer: 55.2,
      why: '$1000 \\times (100/101.325) \\times (273.15/293.15) = 919.6$ L/min = 55.2 Nm³/h.' },
    { q: 'A litre of free air (ANR) contains the same mass of air whatever the line pressure it came from.', a: true,
      why: 'That is the point of free air: a fixed reference state makes a volume stand for a mass, 1.185 g per litre at ANR.' },
    { q: 'A flowmeter reads 10 Nm³/min (0 °C reference) and a compressor data sheet says 10 m³/min ANR. Which is more air?', choices: ['the flowmeter\'s, by about 9 %', 'the compressor\'s, by about 9 %', 'they are the same', 'they cannot be compared'], a: 0,
      why: 'A cubic metre at 0 °C and 1.013 bar holds 1.293 kg; at ANR 1.185 kg. 1 Nm³ = 1.087 m³ ANR.' },
    { q: 'Why is air consumption counted as free air rather than as compressed volume?', choices: ['Free air stands for mass, which is what the compressor must supply; compressed volume changes with pressure', 'Free air is cheaper', 'Gauges read free air', 'It gives smaller numbers'], a: 0,
      why: 'A compressed volume means different amounts of air at different pressures; free air at a fixed reference does not.' }
  ],
  problems: [
    { q: 'How much free air (L ANR) does 20 L of air at 8 bar gauge and 20 °C contain? Take the atmosphere as 1.013 bar.', answer: 180.3, unit: 'L', tol: 0.02,
      steps: ['Absolute: $9.013$ bar.', '$V_n = 20 \\times 9.013/1.0 = 180.3$ L ANR.'] },
    { q: 'Convert 5 Nm³/min (0 °C, 101.325 kPa) into m³/min ANR.', answer: 5.44, tol: 0.02,
      steps: ['$5 \\times (101.325/100) \\times (293.15/273.15) = 5 \\times 1.0874 = 5.44$ m³/min ANR.'] }
  ],
  applications: [
    'Air consumption tables of cylinders, tools and blow-off nozzles.',
    'Comparing compressor capacity (FAD) with plant demand.',
    'Setting up flowmeters for air audits and leak surveys.',
    'Valve flow data to ISO 6358, given in litres of free air.'
  ],
  history: 'Standard conditions multiplied with industries: chemists chose 0 °C and one atmosphere, the gas industry 15 °C, American engineers 60 °F. Pneumatics settled on a comfortable workshop day — 20 °C, 100 kPa and 65 % humidity — in ISO 8778, now in its 2003 edition.'
},

/* ================================================================ HUMIDITY */
{
  id: 'humidity-dew-point', parent: 'air-quantities', title: 'Humidity and dew point', level: 2,
  short: 'Air holds water vapour up to a ceiling that rises steeply with temperature — the saturation vapour pressure, given closely by the Magnus formula. Relative humidity says how near the air is to that ceiling; absolute humidity how many grams of water a cubic metre carries; the dew point, the temperature at which it would be saturated and water would start to condense.',
  keywords: ['humidity', 'relative humidity', 'absolute humidity', 'dew point', 'frost point', 'saturation vapour pressure', 'Magnus formula', 'water vapour', 'condensation', 'g/m³', 'moisture', 'hygrometer', 'chilled mirror'],
  prereq: ['partial-pressures', 'air-composition', 'chemistry:vapor-pressure', 'physics:latent-heat'],
  related: ['pressure-dew-point', 'condensate', 'refrigerated-dryers', 'desiccant-dryers', 'iso-8573', 'aerodynamics:humidity-air', 'hydraulics:vapour-pressure'],
  body: `
A glass of cold water on a summer day beads with drops: the air touching it has been cooled below its dew point. Compressed air does the same inside pipes, receivers and valves, and the water it drops is the chief enemy of a pneumatic system.

### Saturation
Water vapour mixes with air like any other gas, but at each temperature its partial pressure has a ceiling — the **saturation vapour pressure** $p_s$, where evaporation and condensation balance ([[chemistry:vapor-pressure]]). It rises steeply, roughly doubling every 11 K, and the Magnus formula gives it within a few tenths of a per cent from −45 to 60 °C:

$$p_s = 611.2\\,\\mathrm{Pa}\\cdot\\exp\\left(\\frac{17.62\\,t}{243.12 + t}\\right)$$

with $t$ in °C. Below 0 °C, over ice, the ceiling is a little lower; dew points below freezing are strictly frost points.

| Temperature | −20 °C | 0 °C | 10 °C | 20 °C | 30 °C | 40 °C | 50 °C |
|---|---|---|---|---|---|---|---|
| $p_s$ | 1.3 hPa | 6.1 hPa | 12.3 hPa | 23.3 hPa | 42.3 hPa | 73.7 hPa | 124 hPa |
| Water in saturated air | 1.1 g/m³ | 4.8 g/m³ | 9.4 g/m³ | 17.2 g/m³ | 30.3 g/m³ | 51 g/m³ | 83 g/m³ |

### Three ways to say how humid
- **Relative humidity** $\\varphi = p_w/p_s$: how close the air is to saturation at its present temperature. Warm the air and it falls, with no water removed.
- **Absolute humidity** $\\rho_w = p_w/(R_wT)$, in g/m³, with $R_w = 461.5$ J/(kg·K) for water vapour. The ANR atmosphere (20 °C, 65 %) carries 11.2 g/m³.
- **Dew point** $t_d$: the temperature to which the air must be cooled, at its present pressure, to become saturated. It depends only on the amount of vapour, not on the air's temperature, which makes it the natural measure of dryness. Inverting Magnus, air at 20 °C and 65 % has a dew point of 13.2 °C.

### Why pneumatics cares
A compressor swallows the air with all its water. On a summer day at 30 °C and 70 %, each cubic metre carries 21 g; a compressor delivering 10 m³/min takes in 13 kg of water an hour. Wherever the compressed air later meets a surface colder than its dew point — aftercooler, receiver, a pipe along a cold wall — liquid water collects: rust and scale in steel pipes, grease washed out of valves, frozen lines outdoors, spoiled paint and food. How compression moves the dew point is the subject of [[pressure-dew-point]]; removing the water, of [[condensate]] and the dryers.

Dew points are measured with chilled-mirror instruments (the reference) and with capacitive polymer or aluminium-oxide sensors. Try your own numbers with the [water in the air](#/tools/pneu/air) calculator.

> [!key] Relative humidity says how full the air is; the dew point says how much water it carries. Air drops water wherever it is cooled below its dew point.
`,
  ideas: [
    'The saturation vapour pressure caps the water vapour in air and roughly doubles every 11 K.',
    'Relative humidity = vapour pressure ÷ saturation pressure at the air\'s temperature.',
    'Absolute humidity is grams of water per cubic metre: 11.2 g/m³ at 20 °C and 65 %.',
    'The dew point depends only on the water content: it is the natural measure of dryness.',
    'Air drops liquid water wherever it touches something colder than its dew point.'
  ],
  pitfalls: [
    'Relative humidity measures how much water the air holds — It measures how close to saturation the air is at its temperature; 50 % at 30 °C is four times the water of 50 % at 5 °C.',
    'Heating air dries it — Heating lowers its relative humidity but leaves its water, and its dew point, unchanged.',
    'Air at 100 % relative humidity is full of liquid water — It is saturated vapour; liquid appears only when it is cooled further or more water is added.'
  ],
  formulas: [
    {
      name: 'Saturation vapour pressure (Magnus)',
      expr: 'ps = 611.2*exp(17.62*t/(243.12 + t))', tex: 'p_s = 611.2\\,\\mathrm{Pa}\\cdot\\exp\\left(\\dfrac{17.62\\,t}{243.12 + t}\\right)',
      vars: {
        ps: { name: 'saturation vapour pressure (absolute)', q: 'pressure', unit: 'hPa', tex: 'p_s' },
        t: { name: 'air temperature', q: false, unit: '°C', value: 20, signed: true, min: -45, max: 60 }
      },
      note: 'Over liquid water, with the widely used coefficients 611.2 Pa, 17.62 and 243.12 °C; empirical, t in °C.',
      stories: { ps: 'What is the saturation vapour pressure of water at {t}?', t: 'At what temperature is the saturation vapour pressure {ps}?' }
    },
    {
      name: 'Relative humidity',
      expr: 'phi = pw/ps', tex: '\\varphi = \\dfrac{p_w}{p_s}',
      vars: {
        phi: { name: 'relative humidity', q: 'ratio', unit: '%', min: 0, max: 100, tex: '\\varphi' },
        pw: { name: 'water vapour partial pressure', q: 'pressure', unit: 'hPa', value: 15.2, tex: 'p_w' },
        ps: { name: 'saturation vapour pressure at the air temperature', q: 'pressure', unit: 'hPa', value: 23.3, tex: 'p_s' }
      },
      practice: { unknowns: ['phi', 'pw'] },
      stories: { phi: 'Air holds water vapour at {pw}; at its temperature the saturation pressure is {ps}. What is its relative humidity?', pw: 'Air at {phi} relative humidity has a saturation pressure of {ps} at its temperature. What is its vapour pressure?' }
    },
    {
      name: 'Absolute humidity',
      expr: 'rhow = pw/(Rw*T)', tex: '\\rho_w = \\dfrac{p_w}{R_w\\,T}',
      vars: {
        rhow: { name: 'absolute humidity (water per volume of air)', q: 'density', unit: 'g/m³', tex: '\\rho_w' },
        pw: { name: 'water vapour partial pressure', q: 'pressure', unit: 'hPa', value: 15.2, tex: 'p_w' },
        Rw: { name: 'gas constant of water vapour', q: 'specificheat', unit: 'J/(kg·K)', value: 461.5, fixed: true, tex: 'R_w' },
        T: { name: 'air temperature', q: 'temperature', unit: '°C', value: 20 }
      },
      note: 'The ideal gas law for the vapour alone (Dalton).',
      practice: { unknowns: ['rhow', 'pw'] },
      stories: { rhow: 'Air at {T} has a vapour pressure of {pw}. How many grams of water does each cubic metre carry?', pw: 'Air at {T} carries {rhow} of water. What is its vapour pressure?' }
    },
    {
      name: 'Dew point (Magnus)',
      expr: 'td = 243.12*(ln(phi) + 17.62*t/(243.12 + t))/(17.62 - ln(phi) - 17.62*t/(243.12 + t))',
      tex: 't_d = \\dfrac{243.12\\left(\\ln\\varphi + \\dfrac{17.62\\,t}{243.12 + t}\\right)}{17.62 - \\ln\\varphi - \\dfrac{17.62\\,t}{243.12 + t}}',
      vars: {
        td: { name: 'dew point', q: false, unit: '°C', signed: true, tex: 't_d' },
        phi: { name: 'relative humidity', q: 'ratio', unit: '%', value: 65, min: 1, max: 100, tex: '\\varphi' },
        t: { name: 'air temperature', q: false, unit: '°C', value: 20, signed: true, min: -45, max: 60 }
      },
      note: 'The Magnus formula solved for the temperature at which the present vapour pressure saturates the air.',
      practice: { unknowns: ['td', 'phi'] },
      stories: { td: 'Air is at {t} with a relative humidity of {phi}. What is its dew point?', phi: 'Air at {t} has a dew point of {td}. What is its relative humidity?' }
    }
  ],
  examples: [
    {
      title: 'The ANR atmosphere',
      q: 'Find the vapour pressure, absolute humidity and dew point of air at 20 °C and 65 % RH.',
      steps: [
        '$p_s = 611.2\\,\\exp(17.62 \\times 20/263.12) = 611.2 \\times 3.817 = 2333$ Pa.',
        '$p_w = 0.65 \\times 2333 = 1516$ Pa; $\\rho_w = 1516/(461.5 \\times 293.15) = 0.0112$ kg/m³ = 11.2 g/m³.',
        'Dew point: $\\gamma = \\ln 0.65 + 1.3393 = 0.9085$; $t_d = 243.12 \\times 0.9085/(17.62 - 0.9085) = 13.2$ °C.'
      ],
      a: '15.2 hPa, 11.2 g/m³, dew point 13.2 °C.'
    },
    {
      title: 'A summer day at the compressor intake',
      q: 'The air at a compressor intake is at 30 °C and 70 %. How much water does each cubic metre carry, what is its dew point, and how much water does a 10 m³/min compressor take in each hour?',
      steps: [
        '$p_s(30\\,°\\mathrm{C}) = 4234$ Pa; $p_w = 0.7 \\times 4234 = 2964$ Pa.',
        '$\\rho_w = 2964/(461.5 \\times 303.15) = 21.2$ g/m³.',
        'Dew point: $\\gamma = \\ln 0.7 + 17.62 \\times 30/273.12 = 1.579$; $t_d = 243.12 \\times 1.579/16.04 = 23.9$ °C.',
        'Water taken in: $21.2 \\times 600 = 12\\,700$ g/h.'
      ],
      a: '21 g/m³, dew point 24 °C, and about 13 kg of water an hour.'
    }
  ],
  quiz: [
    { q: 'Air at 20 °C and 50 % RH is warmed to 30 °C without adding water. Its relative humidity becomes about…', choices: ['28 %', '50 %', '75 %', '100 %'], a: 0,
      why: 'The vapour pressure stays 11.7 hPa while the saturation pressure rises to 42.3 hPa: 11.7/42.3 = 28 %.' },
    { q: 'The dew point of a sample of air tells you…', choices: ['how much water vapour it holds, whatever its temperature', 'how close to saturation it is at its present temperature', 'its temperature', 'how much liquid water it carries'], a: 0,
      why: 'The dew point is set by the vapour partial pressure alone; relative humidity also depends on the temperature.' },
    { q: 'Using the Magnus formula, what is the saturation vapour pressure of water at 35 °C, in hPa?', answer: 56.1, unit: 'hPa',
      why: '$611.2\\,\\exp(17.62 \\times 35/278.12) = 5613$ Pa = 56.1 hPa.' },
    { q: 'Air at 100 % relative humidity holds the same amount of water vapour at 10 °C as at 30 °C.', a: false,
      why: 'Saturated air holds 9.4 g/m³ at 10 °C and 30.3 g/m³ at 30 °C.' },
    { q: 'Saturated air at 30 °C holds about 30 g/m³ of water, saturated air at 10 °C about 9 g/m³. Cooling 1 m³ of saturated air from 30 to 10 °C condenses roughly…', choices: ['21 g', '9 g', '30 g', 'nothing, since the relative humidity stays 100 %'], a: 0,
      why: 'The vapour content falls from 30 to about 9 g, so about 21 g becomes liquid (a little more, since the air also shrinks as it cools).' }
  ],
  problems: [
    { q: 'What is the dew point of air at 25 °C and 40 % relative humidity?', answer: 10.5, unit: '°C', tol: 0.03,
      steps: ['$\\gamma = \\ln 0.40 + 17.62 \\times 25/268.12 = -0.916 + 1.643 = 0.727$.', '$t_d = 243.12 \\times 0.727/(17.62 - 0.727) = 10.5$ °C.'] },
    { q: 'What is the absolute humidity of air at 30 °C and 70 % RH, in g/m³?', answer: 21.2, unit: 'g/m³', tol: 0.02,
      steps: ['$p_w = 0.7 \\times 4234 = 2964$ Pa.', '$\\rho_w = 2964/(461.5 \\times 303.15) = 0.0212$ kg/m³ = 21.2 g/m³.'] }
  ],
  applications: [
    'Specifying dryers and checking compressed-air quality by dew point.',
    'Predicting where condensation forms in pipes, machines and control cabinets.',
    'Weather: dew, fog and clouds form where air cools below its dew point.',
    'Paint shops, food and pharmaceutical plants, where water in the air spoils products.'
  ],
  history: 'Horace-Bénédict de Saussure built a hair hygrometer in 1783 — human hair lengthens as the air grows damp. John Frederic Daniell introduced the dew-point hygrometer in 1820, cooling a polished surface until mist formed on it; its descendant, the chilled-mirror instrument, is still the reference for dew point. Gustav Magnus published his vapour-pressure formula in 1844.',
  sim: 'air-dewpoint-chart'
},

/* ================================================================ PRESSURE DEW POINT */
{
  id: 'pressure-dew-point', parent: 'air-quantities', title: 'Pressure dew point', level: 2,
  short: 'The pressure dew point is the temperature at which water starts to condense from compressed air at its working pressure. Compression multiplies the vapour partial pressure by the pressure ratio, so a pleasant 13 °C dew point outside becomes about 49 °C at 7 bar gauge — and the air drops water as soon as it cools. Dryers are rated by the pressure dew point they reach.',
  keywords: ['pressure dew point', 'PDP', 'atmospheric dew point', 'ADP', 'condensate', 'drying compressed air', 'aftercooler', 'refrigerated dryer', 'desiccant dryer', 'ISO 8573-1', 'humidity class', 'water content', 'condensate quantity'],
  prereq: ['humidity-dew-point', 'partial-pressures', 'boyles-law'],
  related: ['condensate', 'aftercoolers', 'refrigerated-dryers', 'desiccant-dryers', 'iso-8573', 'condensate-drains', 'drops-drains'],
  body: `
A compressor on a pleasant spring day is a rain machine. The reason is Dalton's law: squeezing the air squeezes its water vapour too.

### Compression raises the dew point
Compress air from $p_1$ to $p_2$ (absolute) and the partial pressure of its water vapour rises in the same ratio ([[partial-pressures]]):

$$p_{w2} = p_{w1}\\,\\frac{p_2}{p_1}$$

The temperature at which *that* partial pressure is saturated is the **pressure dew point** (PDP): the temperature at which water starts to condense from the air at its working pressure. Room air at 20 °C and 65 % (dew point 13 °C), compressed to 7 bar gauge, has a pressure dew point of **49 °C**. Leaving the compressor at 80–90 °C it is still all vapour; the aftercooler brings it to about 10 K above the cooling air or water — say 30 °C, far below 49 °C — and most of the water condenses there, to be caught by the separator ([[aftercoolers]]). The air leaves saturated, its PDP equal to its temperature, and drops more water wherever the line is colder still.

| Intake air | Dew point | PDP at 7 bar gauge | Condensed on cooling to 30 °C | Per hour, 10 m³/min FAD |
|---|---|---|---|---|
| 5 °C, 80 % | 2 °C | 35 °C | 1.3 g/m³ | 0.8 L |
| 20 °C, 65 % | 13 °C | 49 °C | 7.3 g/m³ | 4.4 L |
| 30 °C, 70 % | 24 °C | 63 °C | 17.4 g/m³ | 10.4 L |
| 35 °C, 80 % | 31 °C | 73 °C | 27.8 g/m³ | 16.7 L |

(grams per m³ of free air at intake conditions). A day of humid summer running is a couple of hundred litres of oily water ([[condensate]], [[condensate-drains]]).

### Pressure and atmospheric dew points
The same water content has two dew points: one at the working pressure, and a lower one if the air were expanded to the atmosphere. A refrigerated dryer's +3 °C pressure dew point at 7 bar gauge is an atmospheric dew point of about −23 °C. Dryers are rated by their PDP at the working pressure; a sensor sampling air vented to the atmosphere reads the atmospheric dew point. Reducing the pressure with a regulator lowers the dew point the same way: +3 °C at 7 bar gauge becomes about −10 °C after regulating to 2 bar gauge.

### How dry is dry enough?
ISO 8573-1:2010 grades compressed air by its pressure dew point ([[iso-8573]]):

| Humidity class | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| PDP at most | −70 °C | −40 °C | −20 °C | +3 °C | +7 °C | +10 °C |

A refrigerated dryer reaches class 4 or 5 ([[refrigerated-dryers]]); desiccant dryers classes 1–3 ([[desiccant-dryers]]). The working rule: choose a PDP about 10 K below the coldest temperature the compressed air will meet. Indoor lines at 15 °C are fine with +3 °C; lines across a roof in winter need −20 °C or −40 °C; instrument air, paint shops and food plants follow their own specifications ([[drops-drains]]).

Try it with the [water in the air](#/tools/pneu/air) calculator.

> [!key] Compression multiplies the vapour pressure by the pressure ratio: a 13 °C dew point outside becomes 49 °C at 7 bar gauge. Specify dryers by pressure dew point, about 10 K below the coldest point on the air's path.
`,
  ideas: [
    'Compression multiplies the water vapour partial pressure by the ratio of absolute pressures.',
    'The pressure dew point is the dew point at the working pressure: 49 °C at 7 bar gauge for 20 °C, 65 % intake air.',
    'Cooled below its pressure dew point, compressed air drops liquid water — mostly in the aftercooler.',
    'The same air has a lower dew point at atmospheric pressure: +3 °C PDP at 7 bar gauge is about −23 °C atmospheric.',
    'Choose a pressure dew point about 10 K below the coldest point the air will meet.'
  ],
  pitfalls: [
    'Air that is dry outside stays dry when compressed — Compression raises its dew point by tens of kelvin; cooled afterwards it drops water.',
    'A +3 °C refrigerated dryer protects outdoor lines in frost — Below +3 °C the air condenses again and the water freezes; outdoor lines need a desiccant dryer.',
    'Pressure and atmospheric dew points are interchangeable — They describe the same water at different pressures and can differ by more than 25 K.'
  ],
  formulas: [
    {
      name: 'Pressure dew point after compression',
      expr: 'tpd = 243.12*(ln(phi*p2/p1) + 17.62*t/(243.12 + t))/(17.62 - ln(phi*p2/p1) - 17.62*t/(243.12 + t))',
      tex: 't_\\text{pd} = \\dfrac{243.12\\left(\\ln\\dfrac{\\varphi\\,p_2}{p_1} + \\dfrac{17.62\\,t}{243.12 + t}\\right)}{17.62 - \\ln\\dfrac{\\varphi\\,p_2}{p_1} - \\dfrac{17.62\\,t}{243.12 + t}}',
      vars: {
        tpd: { name: 'pressure dew point', q: false, unit: '°C', signed: true, tex: 't_\\text{pd}' },
        phi: { name: 'relative humidity of the intake air', q: 'ratio', unit: '%', value: 65, min: 1, max: 100, tex: '\\varphi' },
        p2: { name: 'working pressure (absolute)', q: 'pressure', unit: 'bar', value: 8.013 },
        p1: { name: 'intake pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.013 },
        t: { name: 'intake air temperature', q: false, unit: '°C', value: 20, signed: true, min: -40, max: 60 }
      },
      note: 'Dalton\'s law and the Magnus formula: the vapour pressure φ·p_s(t) multiplied by p₂/p₁, then the temperature at which it saturates.',
      practice: { unknowns: ['tpd', 'p2'] },
      stories: { tpd: 'Air at {t} and {phi} relative humidity is taken in at {p1} and compressed to {p2}. What is its pressure dew point?', p2: 'Air at {t} and {phi} (taken in at {p1}) is compressed until its pressure dew point is {tpd}. To what pressure?' }
    },
    {
      name: 'Atmospheric dew point from a pressure dew point',
      expr: 'tad = 243.12*(ln(pa/p) + 17.62*tpd/(243.12 + tpd))/(17.62 - ln(pa/p) - 17.62*tpd/(243.12 + tpd))',
      tex: 't_\\text{ad} = \\dfrac{243.12\\left(\\ln\\dfrac{p_a}{p} + \\dfrac{17.62\\,t_\\text{pd}}{243.12 + t_\\text{pd}}\\right)}{17.62 - \\ln\\dfrac{p_a}{p} - \\dfrac{17.62\\,t_\\text{pd}}{243.12 + t_\\text{pd}}}',
      vars: {
        tad: { name: 'dew point at the lower pressure', q: false, unit: '°C', signed: true, tex: 't_\\text{ad}' },
        pa: { name: 'lower pressure, e.g. the atmosphere (absolute)', q: 'pressure', unit: 'bar', value: 1.013, tex: 'p_a' },
        p: { name: 'working pressure (absolute)', q: 'pressure', unit: 'bar', value: 8.013 },
        tpd: { name: 'pressure dew point at the working pressure', q: false, unit: '°C', value: 3, signed: true, min: -80, max: 60, tex: 't_\\text{pd}' }
      },
      note: 'The same water content at a lower pressure; with pₐ set to a regulated pressure it gives the dew point after a regulator.',
      practice: { unknowns: ['tad', 'tpd'] },
      stories: { tad: 'A dryer delivers air at {p} with a pressure dew point of {tpd}. What is its dew point when expanded to {pa}?', tpd: 'Air expanded to {pa} shows a dew point of {tad}. What was its pressure dew point at {p}?' }
    },
    {
      name: 'Condensate from compressing and cooling air',
      expr: 'mw = Q*(phi*611.2*exp(17.62*t1/(243.12 + t1)) - 611.2*exp(17.62*t2/(243.12 + t2))*p1/p2)/(Rw*(t1 + 273.15))',
      tex: '\\dot m_w = \\dfrac{Q\\left[\\varphi\\,p_s(t_1) - p_s(t_2)\\,p_1/p_2\\right]}{R_w\\,(t_1 + 273.15)}',
      vars: {
        mw: { name: 'condensate flow (negative: nothing condenses)', q: 'massflow', unit: 'kg/h', signed: true, tex: '\\dot m_w' },
        Q: { name: 'free air delivery (at intake conditions)', q: 'flowrate', unit: 'm³/h', value: 600 },
        phi: { name: 'relative humidity of the intake air', q: 'ratio', unit: '%', value: 70, min: 0, max: 100, tex: '\\varphi' },
        t1: { name: 'intake air temperature', q: false, unit: '°C', value: 30, signed: true, min: -30, max: 50, tex: 't_1' },
        t2: { name: 'temperature the compressed air is cooled to', q: false, unit: '°C', value: 35, signed: true, min: -40, max: 80, tex: 't_2' },
        p1: { name: 'intake pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.013 },
        p2: { name: 'working pressure (absolute)', q: 'pressure', unit: 'bar', value: 8.013 },
        Rw: { name: 'gas constant of water vapour', q: 'specificheat', unit: 'J/(kg·K)', value: 461.5, fixed: true, tex: 'R_w' }
      },
      note: 'p_s(t) is the Magnus saturation pressure. 1 kg of condensate is about 1 L. A negative result means the air stays unsaturated.',
      practice: { unknowns: ['mw', 'Q'] },
      stories: { mw: 'A compressor delivering {Q} takes in air at {t1} and {phi}, compresses it from {p1} to {p2} and cools it to {t2}. How much water condenses?', Q: 'At {t1} and {phi}, a compressor from {p1} to {p2} with cooling to {t2} yields {mw} of condensate. What is its free air delivery?' }
    }
  ],
  examples: [
    {
      title: 'From 13 °C to 49 °C',
      q: 'Air at 20 °C and 65 % is compressed from 1.013 bar to 7 bar gauge. What is its pressure dew point?',
      steps: [
        'Vapour pressure at the intake: $0.65 \\times 2333 = 1516$ Pa.',
        'After compression: $1516 \\times 8.013/1.013 = 11\\,990$ Pa.',
        'Magnus inverted: $\\gamma = \\ln(11\\,990/611.2) = 2.976$; $t_\\text{pd} = 243.12 \\times 2.976/(17.62 - 2.976) = 49.4$ °C.'
      ],
      a: '49 °C — against 13 °C for the same air at the intake.'
    },
    {
      title: 'A summer day\'s water',
      q: 'A compressor delivers 10 m³/min FAD at 7 bar gauge from air at 30 °C and 70 %. The aftercooler cools the air to 35 °C and a refrigerated dryer then to +3 °C. How much water does each remove per hour and per day?',
      steps: [
        'Water in the intake air: $\\varphi p_s/(R_wT) = 2964/(461.5 \\times 303.15) = 21.2$ g/m³.',
        'Left as vapour at 35 °C and 8.013 bar: $5613 \\times (1.013/8.013)/(461.5 \\times 303.15) = 5.1$ g/m³, so the aftercooler removes 16.1 g/m³ — $16.1 \\times 600 = 9.7$ kg/h.',
        'Left at +3 °C: $758 \\times (1.013/8.013)/(461.5 \\times 303.15) = 0.7$ g/m³, so the dryer removes 4.4 g/m³ — 2.6 kg/h.',
        'Over 24 hours: about 232 L from the aftercooler and 63 L from the dryer.'
      ],
      a: 'About 9.7 L/h at the aftercooler and 2.6 L/h at the dryer — some 300 litres a day.'
    },
    {
      title: 'Reading a dew-point meter',
      q: 'A refrigerated dryer is rated at a +3 °C pressure dew point at 7 bar gauge. A portable meter samples the air after venting it to the atmosphere. What should it read?',
      steps: [
        'Vapour pressure at +3 °C saturation: $p_s = 758$ Pa at 8.013 bar.',
        'Expanded to 1.013 bar: $758 \\times 1.013/8.013 = 95.8$ Pa.',
        '$\\gamma = \\ln(95.8/611.2) = -1.853$; $t_\\text{ad} = 243.12 \\times (-1.853)/(17.62 + 1.853) = -23.1$ °C.'
      ],
      a: 'About −23 °C: a correct reading, not a dryer twenty-six kelvin better than its rating.'
    }
  ],
  quiz: [
    { q: 'Air at 20 °C with a dew point of 10 °C is compressed from 1 to 8 bar absolute. Its dew point at pressure is about…', choices: ['10 °C', 'about 45 °C', 'about 80 °C', '−10 °C'], a: 1,
      why: 'The vapour pressure rises from 12.3 hPa to 98 hPa, which saturates at about 45 °C.' },
    { q: 'A refrigerated dryer with a +3 °C pressure dew point delivers air that is safe from condensation in a pipe outdoors at −10 °C.', a: false,
      why: 'The air is saturated at +3 °C; colder than that it drops water, which freezes. Outdoor lines need a desiccant dryer.' },
    { q: 'Reducing the pressure of dried air with a regulator makes its dew point…', choices: ['lower', 'higher', 'unchanged', 'equal to the air temperature'], a: 0,
      why: 'The vapour partial pressure falls in proportion to the total pressure, so it saturates only at a lower temperature.' },
    { q: 'Air at 25 °C and 50 % RH (saturation pressure 31.6 hPa) is compressed from 1.0 to 7.0 bar absolute. What is its vapour partial pressure before any condensation, in hPa?', answer: 110.6, unit: 'hPa',
      why: '$0.5 \\times 31.6 \\times 7 = 110.6$ hPa — more than the saturation pressure at 25 °C, so it will condense as soon as it cools to 25 °C.' },
    { q: 'Which ISO 8573-1:2010 humidity class requires a pressure dew point of −40 °C or lower?', choices: ['class 2', 'class 4', 'class 6', 'class 1'], a: 0,
      why: 'Class 1 is −70 °C, class 2 −40 °C, class 3 −20 °C, class 4 +3 °C.' }
  ],
  problems: [
    { q: 'Air at 25 °C and 60 % is compressed from 1.013 bar to 10 bar gauge. What is its pressure dew point?', answer: 60.7, unit: '°C', tol: 0.02,
      steps: ['$p_w = 0.6 \\times 3160 = 1896$ Pa; compressed: $1896 \\times 11.013/1.013 = 20\\,610$ Pa.', '$\\gamma = \\ln(20\\,610/611.2) = 3.518$; $t_\\text{pd} = 243.12 \\times 3.518/(17.62 - 3.518) = 60.7$ °C.'] },
    { q: 'A desiccant dryer delivers a −40 °C pressure dew point at 7 bar gauge. What is the atmospheric dew point?', answer: -58.1, unit: '°C', tol: 0.02,
      steps: ['$\\gamma = \\ln(1.013/8.013) + 17.62 \\times (-40)/203.12 = -2.068 - 3.470 = -5.538$.', '$t_\\text{ad} = 243.12 \\times (-5.538)/(17.62 + 5.538) = -58.1$ °C.'] }
  ],
  applications: [
    'Choosing between refrigerated and desiccant dryers for a plant.',
    'Instrument air and outdoor lines that must never freeze.',
    'Sizing condensate drains and oil–water separators.',
    'Checking dryer performance with a dew-point sensor.'
  ],
  sim: 'air-dewpoint-chart'
},

/* ================================================================ FLOW THROUGH RESTRICTIONS */
{
  id: 'air-flow-basics', parent: 'air-quantities', title: 'Flow of air through restrictions', level: 2,
  short: 'Air flows through an orifice, a valve or a fitting because of a pressure difference. For small drops it behaves like a liquid, the flow growing with the square root of the drop; for larger drops its density changes on the way and the flow depends on the ratio of absolute pressures — until, at about half the upstream absolute pressure, it can grow no further.',
  keywords: ['orifice', 'restriction', 'flow through a valve', 'compressible flow', 'pressure ratio', 'discharge coefficient', 'mass flow', 'Saint-Venant', 'nozzle', 'effective area', 'subsonic flow', 'throttle', 'pressure drop'],
  prereq: ['ideal-gas-law', 'isothermal-adiabatic', 'hydraulics:orifice-equation', 'physics:bernoullis-equation'],
  related: ['choked-flow', 'sonic-conductance', 'flow-coefficients', 'flow-control-pneu', 'pressure-drop-air', 'air-leaks', 'conductance-series', 'aerodynamics:nozzles'],
  body: `
Every pneumatic component is a restriction: a valve seat, a fitting, a throttle, a silencer, a hole in a hose. The flow through each is driven by the pressure difference across it — but air, unlike oil, changes its density on the way through, and that gives its flow a character of its own.

### Small pressure drops: air as a liquid
When the drop is small compared with the absolute pressure — less than about 10 % — the density hardly changes, and the orifice equation of hydraulics applies ([[hydraulics:orifice-equation]], [[physics:bernoullis-equation]]):

$$\\dot m = C_d A\\sqrt{2\\,\\rho_1\\,\\Delta p}$$

The flow grows only with the square root of the drop: four times the drop, twice the flow. The discharge coefficient $C_d$ is about 0.6–0.65 for a sharp-edged hole and 0.95–0.99 for a smooth nozzle. And because $\\rho_1$ is proportional to the absolute pressure, the same drop passes more air in a high-pressure line — one reason why air lines are sized for a drop of a few per cent of the pressure ([[pressure-drop-air]]).

### Larger drops: the jet expands
With a bigger drop the air expands and accelerates through the restriction; its density falls as its speed rises. For a smooth nozzle without losses the energy balance gives the flow as a function of the **pressure ratio** $r = p_2/p_1$, absolute pressures:

$$\\dot m = C_d A\\,p_1\\sqrt{\\frac{2\\gamma}{(\\gamma - 1)R_\\text{air}T_1}\\left[r^{2/\\gamma} - r^{(\\gamma+1)/\\gamma}\\right]}$$

Two things are new. At a given ratio the flow is proportional to the upstream **absolute** pressure $p_1$; and as $r$ falls the flow rises steeply at first, then flattens:

| $p_2/p_1$ | 0.99 | 0.95 | 0.9 | 0.8 | 0.7 | 0.6 | 0.528 and below |
|---|---|---|---|---|---|---|---|
| Ideal nozzle, share of the largest flow | 21 % | 45 % | 62 % | 82 % | 93 % | 99 % | 100 % |
| Valve to ISO 6358 with b = 0.3 | 17 % | 37 % | 52 % | 70 % | 82 % | 90 % | 95 % |

At $r = 0.528$ the jet in the throat reaches the speed of sound and the flow is at its maximum: lowering the downstream pressure further changes nothing upstream. The flow is **choked** ([[choked-flow]]). Real valves, with their internal losses, have a flatter curve that chokes at a lower ratio $b$ — described by ISO 6358's sonic conductance and critical pressure ratio ([[sonic-conductance]]).

### What happens to the temperature
The jet cools as it speeds up — to about −29 °C at the throat of a choked nozzle fed with air at 20 °C — and warms again as it slows down downstream. Overall, throttling leaves an ideal gas at its starting temperature; real air cools by about a quarter of a kelvin per bar, negligible here. Frost on silencers has another cause: the air left in an exhausting cylinder chamber expands and cools ([[isothermal-adiabatic]]).

### Restrictions in series
Valve, fittings and tube share the pressure drop between them, and the smallest dominates. Their conductances combine roughly as $1/C^2 = \\sum 1/C_i^2$ ([[conductance-series]]). Try it with the [valve flow](#/tools/pneu/valve) calculator.

> [!key] For a small drop, flow grows with the square root of the drop; for a large one it depends on the ratio of absolute pressures — and it stops growing once that ratio falls below about one half.
`,
  ideas: [
    'For small pressure drops, air flows like a liquid: mass flow ∝ √(ρ₁ Δp).',
    'For larger drops the flow depends on the ratio of absolute pressures and on the upstream absolute pressure.',
    'The flow rises steeply as the downstream pressure falls, then flattens and chokes near p₂/p₁ = 0.53.',
    'Real valves have flatter curves and choke at a lower critical ratio b (ISO 6358).',
    'Throttling leaves air at almost its starting temperature, although the fast jet itself is cold.'
  ],
  pitfalls: [
    'Doubling the pressure drop doubles the flow — For small drops the flow grows only with the square root; for large drops it saturates altogether.',
    'Flow depends only on the pressure difference — For air it depends on the ratio of absolute pressures and on the upstream absolute pressure.',
    'Throttled air comes out much colder — Only the fast jet is cold; once it slows down, an ideal gas is back at its starting temperature.'
  ],
  formulas: [
    {
      name: 'Small pressure drop (incompressible approximation)',
      expr: 'm = Cd*A*sqrt(2*rho*dp)', tex: '\\dot m = C_d\\,A\\sqrt{2\\,\\rho_1\\,\\Delta p}',
      vars: {
        m: { name: 'mass flow', q: 'massflow', unit: 'g/s', tex: '\\dot m' },
        Cd: { name: 'discharge coefficient', value: 0.65, min: 0.1, max: 1, tex: 'C_d' },
        A: { name: 'orifice area', q: 'area', unit: 'mm²', value: 3.14 },
        rho: { name: 'upstream density', q: 'density', unit: 'kg/m³', value: 8.33, tex: '\\rho_1' },
        dp: { name: 'pressure drop', q: 'pressure', unit: 'bar', value: 0.3, tex: '\\Delta p' }
      },
      note: 'Good while Δp is below about a tenth of the upstream absolute pressure. Divide the mass flow by 1.185 g/L for free air (ANR).',
      practice: { unknowns: ['m', 'dp', 'A'] },
      stories: { m: 'Air of density {rho} flows through an orifice of {A} (discharge coefficient {Cd}) with a drop of {dp}. What mass flow passes?', dp: 'An orifice of {A} ({Cd}) must pass {m} of air of density {rho}. What pressure drop does it need?' }
    },
    {
      name: 'Isentropic nozzle, subsonic (Saint-Venant–Wantzel)',
      expr: 'm = Cd*A*p1*sqrt(2*gamma/((gamma - 1)*Rair*T1)*(r^(2/gamma) - r^((gamma + 1)/gamma)))',
      tex: '\\dot m = C_d A\\,p_1\\sqrt{\\dfrac{2\\gamma}{(\\gamma-1)R_\\text{air}T_1}\\left[r^{2/\\gamma} - r^{(\\gamma+1)/\\gamma}\\right]}',
      vars: {
        m: { name: 'mass flow', q: 'massflow', unit: 'g/s', tex: '\\dot m' },
        Cd: { name: 'discharge coefficient', value: 0.65, min: 0.1, max: 1, tex: 'C_d' },
        A: { name: 'throat area', q: 'area', unit: 'mm²', value: 3.14 },
        p1: { name: 'upstream pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.013 },
        gamma: { name: 'ratio of specific heats', value: 1.4, fixed: true, tex: '\\gamma' },
        Rair: { const: 'Rair' },
        T1: { name: 'upstream temperature', q: 'temperature', unit: '°C', value: 20 },
        r: { name: 'pressure ratio p₂/p₁ (absolute)', value: 0.8, min: 0.5283, max: 1 }
      },
      note: 'Valid from r = 1 down to the critical ratio 0.528; below it the flow is choked and stays at its value for r = 0.528.',
      practice: { unknowns: ['m', 'r', 'A'] },
      stories: { m: 'Air at {p1} and {T1} flows through a nozzle of {A} ({Cd}) to a pressure ratio of {r}. What is the mass flow?', r: 'A nozzle of {A} ({Cd}) fed with air at {p1} and {T1} passes {m}. What is the pressure ratio across it?' }
    }
  ],
  examples: [
    {
      title: 'A small drop through a 2 mm hole',
      q: 'Air at 6 bar gauge and 20 °C (density 8.33 kg/m³) flows through a sharp-edged 2 mm hole ($C_d$ = 0.65) with a drop of 0.3 bar. What is the flow, and does the nozzle formula agree?',
      steps: [
        'Area: $\\pi \\times 1^2 = 3.14$ mm². Small drop: $\\dot m = 0.65 \\times 3.14\\times10^{-6}\\sqrt{2 \\times 8.33 \\times 30\\,000} = 1.44$ g/s.',
        'Nozzle formula with $r = 6.713/7.013 = 0.957$: $\\dot m = 1.41$ g/s — 2 % lower, as the drop is 4 % of the pressure.',
        'In free air: $1.44/1.185 \\times 60 = 73$ L/min ANR.'
      ],
      a: 'About 1.4 g/s, or 73 L/min ANR — the two formulas agree within 2 %.'
    },
    {
      title: 'Lowering the downstream pressure',
      q: 'A smooth 2 mm nozzle ($C_d$ = 0.97) is fed with air at 7.013 bar absolute and 20 °C. What does it pass at pressure ratios of 0.9, 0.7 and 0.528?',
      steps: [
        '$r = 0.9$: $\\dot m = 3.11$ g/s (158 L/min ANR).',
        '$r = 0.7$: $\\dot m = 4.70$ g/s (238 L/min ANR).',
        '$r = 0.528$: $\\dot m = 5.04$ g/s (255 L/min ANR) — the maximum; any lower downstream pressure gives the same.'
      ],
      a: 'The flow rises from 158 to 238 L/min as the ratio falls from 0.9 to 0.7, and only to 255 L/min at the critical ratio.'
    }
  ],
  quiz: [
    { q: 'For a small pressure drop across an orifice, doubling the drop multiplies the flow by about…', choices: ['√2 ≈ 1.41', '2', '4', '1'], a: 0,
      why: 'The flow follows the square root of the drop, as for a liquid.' },
    { q: 'Two identical orifices each have a 0.5 bar drop, one fed at 7 bar absolute and one at 2 bar absolute. Which passes more mass of air?', choices: ['the one at 7 bar absolute', 'the one at 2 bar absolute', 'both the same', 'it depends only on the orifice'], a: 0,
      why: 'ṁ = C_d A √(2ρ₁Δp): the denser air at 7 bar passes about √3.5 ≈ 1.9 times the mass.' },
    { q: 'In compressible flow through a restriction, the flow depends on the ratio of the absolute pressures as well as on the upstream pressure.', a: true,
      why: 'For large drops the flow is p₁ times a function of p₂/p₁.' },
    { q: 'The flow through a throttle stops rising when the downstream pressure falls below about…', choices: ['half the upstream absolute pressure (0.53 for an ideal nozzle, less for real valves)', 'zero gauge', 'half the upstream gauge pressure', 'it never stops rising'], a: 0,
      why: 'At the critical ratio the throat reaches the speed of sound and the flow chokes.' },
    { q: 'An orifice passes 50 L/min ANR with a 0.1 bar drop. About what flow does it pass with a 0.4 bar drop, both drops being small compared with the line pressure?', answer: 100, unit: 'L/min',
      why: 'Four times the drop gives √4 = 2 times the flow.' }
  ],
  problems: [
    { q: 'What mass flow, in g/s, passes a 1 mm² orifice ($C_d$ = 0.62) with a 0.2 bar drop from air of density 9.5 kg/m³?', answer: 0.382, unit: 'g/s', tol: 0.02,
      steps: ['$\\dot m = 0.62 \\times 10^{-6}\\sqrt{2 \\times 9.5 \\times 20\\,000} = 0.62\\times10^{-6} \\times 616.4 = 3.82\\times10^{-4}$ kg/s.'] }
  ],
  applications: [
    'Speed controllers, which set cylinder speed by throttling the exhaust air.',
    'Leaks — holes whose loss depends on their size and the line pressure.',
    'Blow-off nozzles and air knives.',
    'Pressure drops across filters, fittings and quick couplings.'
  ],
  history: 'Adhémar Barré de Saint-Venant and Pierre Laurent Wantzel derived the flow of a gas through an orifice from energy conservation in 1839. Their formula has a maximum near half the upstream pressure, which puzzled them; Osborne Reynolds showed in 1886 that the throat reaches the speed of sound there, so the flow simply stays at its maximum.',
  sim: 'air-orifice-flow'
},

/* ================================================================ CHOKED FLOW */
{
  id: 'choked-flow', parent: 'air-quantities', title: 'Sonic and choked flow', level: 3,
  short: 'When the downstream absolute pressure falls below a critical fraction of the upstream — 0.528 for an ideal nozzle, typically 0.2–0.5 for a real valve — the air in the narrowest section moves at the speed of sound and the flow is choked: it no longer depends on the downstream pressure, only on the upstream absolute pressure and temperature. ISO 6358 describes valves this way, by a sonic conductance C and a critical pressure ratio b.',
  keywords: ['choked flow', 'sonic flow', 'critical pressure ratio', 'speed of sound', 'Mach 1', 'sonic conductance', 'ISO 6358', 'b value', 'C value', 'effective area', 'leak flow', 'critical flow', 'blow gun'],
  prereq: ['air-flow-basics', 'absolute-gauge-pressure', 'physics:speed-of-sound', 'aerodynamics:isentropic-flow'],
  related: ['sonic-conductance', 'valve-sizing', 'flow-coefficients', 'air-leaks', 'filling-emptying', 'conductance-series', 'noise-silencers', 'aerodynamics:de-laval-nozzle'],
  body: `
Open the valve of a tyre and it hisses with a steady roar until the pressure inside has fallen to about twice atmospheric. Through all that time the flow does not care about the air outside: it is **choked**.

### Why the flow stops rising
A change of pressure travels through air as a sound wave, at the speed of sound relative to the moving air. Once the air in the narrowest section of a restriction is itself moving at the speed of sound, a drop in the downstream pressure can no longer travel upstream to draw more air through. The throat passes the most mass it can, and the rest of the pressure difference is spent downstream in a noisy, shock-laced jet. For an ideal nozzle this happens when

$$\\frac{p_2}{p_1} \\le r^* = \\left(\\frac{2}{\\gamma + 1}\\right)^{\\gamma/(\\gamma - 1)} = 0.528$$

At the throat the air is then at 0.833 of its upstream absolute temperature — −29 °C when fed at 20 °C — and moving at 313 m/s ([[aerodynamics:isentropic-flow]]). A diverging section after the throat can make the jet supersonic, as in a rocket or a de Laval nozzle ([[aerodynamics:de-laval-nozzle]]); pneumatic components simply let it break up.

### The choked flow
Once choked, the mass flow is fixed by the upstream state alone:

$$\\dot m = C_d A\\,p_1\\sqrt{\\frac{\\gamma}{R_\\text{air}T_1}}\\left(\\frac{2}{\\gamma + 1}\\right)^{\\frac{\\gamma + 1}{2(\\gamma - 1)}} \\approx 0.0404\\,\\frac{C_d A\\,p_1}{\\sqrt{T_1}}$$

in SI units. It is proportional to the upstream **absolute** pressure and falls slowly as the air gets warmer. That is why a leak's flow is almost exactly proportional to the absolute line pressure: every leak in a 6 bar system is choked.

| Hole (sharp-edged, $C_d$ = 0.65) at 6 bar gauge | 0.5 mm | 1 mm | 2 mm | 3 mm | 5 mm |
|---|---|---|---|---|---|
| Air lost, L/min ANR | 11 | 43 | 171 | 385 | 1070 |
| Electricity a year at 0.11 kWh/m³ | 620 kWh | 2 500 kWh | 9 900 kWh | 22 000 kWh | 62 000 kWh |

### Real components: ISO 6358
A valve is no ideal nozzle: its passages lose energy, so its flow keeps rising down to a lower pressure ratio. ISO 6358-1:2013 describes a component by two measured numbers — the **sonic conductance** $C$, the choked flow per unit of upstream absolute pressure, in dm³/(s·bar) of free air (ANR), and the **critical pressure ratio** $b$ at which it chokes — with a quarter ellipse in between:

$$Q = C\\,p_1\\sqrt{\\frac{T_0}{T_1}} \\;\\;(r \\le b), \\qquad Q = C\\,p_1\\sqrt{\\frac{T_0}{T_1}}\\sqrt{1 - \\left(\\frac{r - b}{1 - b}\\right)^2} \\;\\;(r > b)$$

with $T_0 = 293.15$ K. Typical values: $b$ = 0.2–0.5 for valves; $C$ roughly 0.3–0.8 for valves with M5 ports, 1.5–3 with G1/8 ports and 3–6 with G1/4 (always check the data sheet). An ideal nozzle has $b = 0.528$, and its **effective area** in mm² is about five times $C$. The 2013 edition generalises the ellipse with a subsonic index $m$; the classic form used here has $m = 0.5$. See [[sonic-conductance]] and [[valve-sizing]], or try the [valve flow](#/tools/pneu/valve) calculator.

### Where choking rules pneumatics
- **Filling a cylinder** from a 7 bar absolute supply is choked until the chamber passes $b\\,p_1$, so the flow is steady at first ([[filling-emptying]]).
- **Exhausting** a chamber above about 2 bar absolute is choked: the meter-out throttle's flow is proportional to the chamber's absolute pressure.
- **Leaks** are choked, so lowering the pressure from 7 to 6 bar gauge cuts every leak by 12.5 % ([[air-leaks]]).
- **Noise:** choked jets are loud; silencers slow them down ([[noise-silencers]]).

> [!warn] Jets from choked outlets and blow guns leave at up to the speed of sound, are loud enough to damage hearing, and can drive dirt or air through skin and into eyes. Never point compressed air at a person or clean clothes or skin with it; use safety blow guns (in the US, OSHA limits cleaning air to 30 psi, about 2 bar, at a dead-ended nozzle) and wear eye and hearing protection.
`,
  ideas: [
    'Below a critical pressure ratio the throat runs at the speed of sound and the flow is choked.',
    'For an ideal nozzle the critical ratio is 0.528; for real valves b is typically 0.2–0.5.',
    'Choked flow is proportional to the upstream absolute pressure and independent of the downstream pressure.',
    'ISO 6358 describes a component by its sonic conductance C and critical pressure ratio b.',
    'Every leak in a compressed-air system is choked: its loss is proportional to the absolute line pressure.'
  ],
  pitfalls: [
    'A lower downstream pressure always gives more flow — Once the flow is choked, nothing downstream affects it.',
    'Choked flow is proportional to the gauge pressure — It is proportional to the upstream absolute pressure.',
    'Choked means blocked — It means the flow has reached its maximum for that upstream state; the restriction still passes air, at the speed of sound in its throat.'
  ],
  formulas: [
    {
      name: 'Critical pressure ratio of an ideal nozzle',
      expr: 'rc = (2/(gamma + 1))^(gamma/(gamma - 1))', tex: 'r^* = \\left(\\dfrac{2}{\\gamma + 1}\\right)^{\\gamma/(\\gamma - 1)}',
      vars: {
        rc: { name: 'critical pressure ratio p*/p₁ (absolute)', tex: 'r^*' },
        gamma: { name: 'ratio of specific heats (1.4 for air)', value: 1.4, min: 1.01, max: 1.8, tex: '\\gamma' }
      },
      note: 'Air 0.528; monatomic gases such as argon (γ = 1.67) 0.487; steam (γ ≈ 1.3) 0.546.',
      stories: { rc: 'A gas has a ratio of specific heats of {gamma}. At what ratio of downstream to upstream absolute pressure does an ideal nozzle choke?', gamma: 'An ideal nozzle chokes at a pressure ratio of {rc}. What is the ratio of specific heats of the gas?' }
    },
    {
      name: 'Choked flow through an ideal nozzle or hole',
      expr: 'm = Cd*A*p1*sqrt(gamma/(Rair*T1))*(2/(gamma + 1))^((gamma + 1)/(2*(gamma - 1)))',
      tex: '\\dot m = C_d A\\,p_1\\sqrt{\\dfrac{\\gamma}{R_\\text{air}T_1}}\\left(\\dfrac{2}{\\gamma + 1}\\right)^{\\frac{\\gamma + 1}{2(\\gamma - 1)}}',
      vars: {
        m: { name: 'mass flow', q: 'massflow', unit: 'g/s', tex: '\\dot m' },
        Cd: { name: 'discharge coefficient (sharp-edged hole about 0.65)', value: 0.65, min: 0.1, max: 1, tex: 'C_d' },
        A: { name: 'hole area', q: 'area', unit: 'mm²', value: 7.07 },
        p1: { name: 'upstream pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.013 },
        gamma: { name: 'ratio of specific heats', value: 1.4, fixed: true, tex: '\\gamma' },
        Rair: { const: 'Rair' },
        T1: { name: 'upstream temperature', q: 'temperature', unit: '°C', value: 20 }
      },
      note: 'Valid while p₂/p₁ ≤ 0.528. The default is a 3 mm leak at 6 bar gauge: 7.6 g/s, about 385 L/min ANR.',
      practice: { unknowns: ['m', 'A', 'p1'] },
      stories: { m: 'A hole of {A} ({Cd}) leaks air at {p1} and {T1} into the room. What mass flow does it lose?', A: 'A leak loses {m} from a line at {p1} and {T1}. What is its effective area, with a discharge coefficient of {Cd}?', p1: 'A hole of {A} ({Cd}) passes {m} of air at {T1}. What is the upstream absolute pressure?' }
    },
    {
      name: 'ISO 6358: choked flow',
      expr: 'Q = C*p1*sqrt(T0/T1)', tex: 'Q = C\\,p_1\\sqrt{\\dfrac{T_0}{T_1}}',
      vars: {
        Q: { name: 'flow (free air)', q: 'airflow', unit: 'L/min ANR' },
        C: { name: 'sonic conductance', q: 'flowcond', unit: 'dm³/(s·bar)', value: 1.2 },
        p1: { name: 'upstream pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.013 },
        T0: { name: 'reference temperature (ANR)', q: 'temperature', unit: '°C', value: 20, fixed: true, tex: 'T_0' },
        T1: { name: 'upstream temperature', q: 'temperature', unit: '°C', value: 20 }
      },
      note: 'Valid while p₂/p₁ ≤ b. C is measured to ISO 6358-1:2013; effective area S (mm²) ≈ 5 C.',
      practice: { unknowns: ['Q', 'C'] },
      stories: { Q: 'A valve with a sonic conductance of {C} is fed at {p1} and {T1} and runs choked. What flow does it pass?', C: 'A valve must pass {Q} choked from {p1} at {T1}. What sonic conductance does it need?' }
    },
    {
      name: 'ISO 6358: subsonic flow',
      expr: 'Q = C*p1*sqrt(T0/T1)*sqrt(1 - ((p2/p1 - b)/(1 - b))^2)', tex: 'Q = C\\,p_1\\sqrt{\\dfrac{T_0}{T_1}}\\sqrt{1 - \\left(\\dfrac{p_2/p_1 - b}{1 - b}\\right)^2}',
      vars: {
        Q: { name: 'flow (free air)', q: 'airflow', unit: 'L/min ANR' },
        C: { name: 'sonic conductance', q: 'flowcond', unit: 'dm³/(s·bar)', value: 1.2 },
        p1: { name: 'upstream pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.013 },
        p2: { name: 'downstream pressure (absolute)', q: 'pressure', unit: 'bar', value: 6.013 },
        b: { name: 'critical pressure ratio', value: 0.3, min: 0, max: 0.6 },
        T0: { name: 'reference temperature (ANR)', q: 'temperature', unit: '°C', value: 20, fixed: true, tex: 'T_0' },
        T1: { name: 'upstream temperature', q: 'temperature', unit: '°C', value: 20 }
      },
      note: 'Valid for b < p₂/p₁ < 1 (the classic ellipse, subsonic index m = 0.5). When solving for p₂ take the root above b·p₁.',
      practice: { unknowns: ['Q', 'p2'] },
      stories: { Q: 'A valve (C = {C}, b = {b}) is fed at {p1} and {T1} and its outlet is at {p2}. What flow does it pass?', p2: 'A valve (C = {C}, b = {b}) fed at {p1} and {T1} passes {Q}. What is the downstream pressure?' }
    }
  ],
  examples: [
    {
      title: 'What a 3 mm leak costs',
      q: 'A 3 mm hole ($C_d$ = 0.65) leaks from a 6 bar gauge line at 20 °C, all year round. The compressor needs 0.11 kWh per m³ of free air and electricity costs 0.15 per kWh. What does the leak cost?',
      steps: [
        'Area: $7.07$ mm². $\\dot m = 0.0404 \\times 0.65 \\times 7.07\\times10^{-6} \\times 7.013\\times10^5/\\sqrt{293.15} = 7.6$ g/s.',
        'Free air: $7.6/1.185 = 6.4$ L/s = 385 L/min ANR = 23.1 m³/h.',
        'Electricity: $23.1 \\times 0.11 = 2.54$ kW, over 8760 h: 22 300 kWh.',
        'Cost: $22\\,300 \\times 0.15 = 3340$ a year.'
      ],
      a: 'About 385 L/min of free air, 22 000 kWh and ¤3,300 a year.'
    },
    {
      title: 'A valve at choked and subsonic flow',
      q: 'A valve has C = 1.2 dm³/(s·bar) and b = 0.3 and is fed at 6 bar gauge (7.013 bar absolute), 20 °C. What does it pass choked, and with the outlet at 5 bar gauge? What outlet pressure gives 90 % of the choked flow?',
      steps: [
        'Choked: $Q = 1.2 \\times 7.013 = 8.42$ dm³/s = 505 L/min ANR.',
        'Outlet at 6.013 bar absolute: $r = 0.857$, $(0.857 - 0.3)/0.7 = 0.796$, $\\sqrt{1 - 0.634} = 0.605$: $Q = 305$ L/min ANR.',
        '90 %: $\\sqrt{1 - x^2} = 0.9$ gives $x = 0.436$, $r = 0.3 + 0.436 \\times 0.7 = 0.605$: $p_2 = 4.24$ bar absolute, 3.2 bar gauge.'
      ],
      a: '505 L/min choked, 305 L/min with a 1 bar drop; 90 % of the maximum needs the outlet down at 3.2 bar gauge.'
    },
    {
      title: 'Lowering the pressure cuts leaks',
      q: 'A plant lowers its line pressure from 7 to 6 bar gauge. By how much does the air lost through its leaks fall?',
      steps: [
        'The leaks are choked, so their flow is proportional to the absolute pressure: $7.013/8.013 = 0.875$.'
      ],
      a: 'By 12.5 % — before counting any saving at the compressor itself.'
    }
  ],
  quiz: [
    { q: 'Air flows from a 6 bar gauge line through a small hole into a room. If the room were a vacuum chamber at 0.5 bar absolute, the flow would…', choices: ['stay the same: it is already choked', 'double', 'rise by 50 %', 'fall'], a: 0,
      why: 'The ratio is already 1.013/7.013 = 0.14, far below the critical ratio; the downstream pressure does not matter.' },
    { q: 'For γ = 1.4, what is the critical pressure ratio of an ideal nozzle?', answer: 0.528,
      why: '$(2/2.4)^{3.5} = 0.528$.' },
    { q: 'In choked flow the mass flow is proportional to the upstream gauge pressure.', a: false,
      why: 'It is proportional to the upstream absolute pressure: a hole at 0 bar gauge still leaks nothing, but doubling 6 bar gauge to 12 bar gauge raises the flow by 13/7, not 2.' },
    { q: 'A valve has C = 2 dm³/(s·bar). With 7 bar absolute upstream, 20 °C and choked flow, how much air does it pass, in L/min ANR?', answer: 840, unit: 'L/min',
      why: '$Q = 2 \\times 7 = 14$ dm³/s = 840 L/min ANR.' },
    { q: 'Why do real valves have critical pressure ratios b lower than 0.528?', choices: ['Losses inside the valve mean the downstream pressure must fall further before the narrowest section chokes', 'Real air has a different γ', 'Valves are larger than nozzles', 'They do not: b is always 0.528'], a: 0,
      why: 'Part of the pressure difference is lost to friction and sudden expansions before the throat, so the throat reaches sonic speed only at a lower overall ratio.' }
  ],
  problems: [
    { q: 'What is the choked mass flow, in g/s, through a 1 mm hole ($C_d$ = 0.65) from air at 8 bar absolute and 20 °C?', answer: 0.964, unit: 'g/s', tol: 0.02,
      steps: ['$A = 0.785$ mm².', '$\\dot m = 0.0404 \\times 0.65 \\times 0.785\\times10^{-6} \\times 8\\times10^5/\\sqrt{293.15} = 9.64\\times10^{-4}$ kg/s.'] },
    { q: 'A valve with C = 3 dm³/(s·bar) and b = 0.35 passes air from 7 to 5 bar absolute at 20 °C. What is the flow in L/min ANR?', answer: 1043.5, unit: 'L/min', tol: 0.02,
      steps: ['$r = 5/7 = 0.714$; $(0.714 - 0.35)/0.65 = 0.560$; $\\sqrt{1 - 0.314} = 0.828$.', '$Q = 3 \\times 7 \\times 0.828 = 17.4$ dm³/s = 1044 L/min ANR.'] }
  ],
  applications: [
    'Sizing valves by ISO 6358 sonic conductance and critical pressure ratio.',
    'Estimating leak losses and their cost from hole size and line pressure.',
    'Sonic nozzles used as flow standards and fixed flow limiters.',
    'Filling and exhausting cylinders, receivers and vacuum volumes.'
  ],
  history: 'Osborne Reynolds explained in 1886 why air flow through a small orifice stops increasing as the downstream pressure falls: the throat velocity reaches the speed of sound. Gustaf de Laval\'s diverging nozzle of 1888 went further, letting the jet run supersonic beyond the throat to drive his steam turbines. For pneumatic components the sonic conductance and critical pressure ratio were standardised in ISO 6358, first published in 1989 and revised in 2013.',
  sim: 'air-orifice-flow'
}

);
