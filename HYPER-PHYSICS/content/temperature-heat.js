/* HYPER-PHYSICS · content/temperature-heat.js — Temperature and heat: what a thermometer
 * measures, how materials expand, what heat is, and how much of it a change of
 * temperature or of phase takes. */
Hyper.add(

{
  id: 'temperature', parent: 'temperature-heat', title: 'Temperature and temperature scales', level: 1,
  short: 'How hot or cold something is, read on a scale fixed by reproducible reference points; at the molecular level, a measure of the average energy of random motion.',
  keywords: ['temperature', 'thermometer', 'Celsius', 'Fahrenheit', 'Kelvin', 'kelvin', 'absolute zero', 'absolute temperature', 'triple point', 'thermocouple', 'thermistor', 'gas thermometer', 'temperature conversion'],
  prereq: ['kinetic-energy', 'math:linear-functions'],
  related: ['zeroth-law', 'kinetic-theory-gases', 'third-law', 'ideal-gas-law', 'thermal-expansion'],
  body: `
Take a metal spoon and a wooden spoon out of the same drawer: the metal one feels colder. Yet both have been sitting side by side for hours and are at exactly the same **temperature**. Our sense of touch reports how fast heat leaves the skin, not temperature, so physics needs something better: a **thermometer**.

Temperature is the property two bodies share once they have stopped exchanging heat — once they are in *thermal equilibrium* (the [[zeroth-law|zeroth law]] is what makes this a sound definition). Any property that changes smoothly with hotness can be turned into a thermometer: the length of a liquid column in a glass tube, the pressure of a gas held at constant volume, the electrical resistance of a platinum wire, the voltage across a junction of two metals (a thermocouple), or the infrared light a surface gives off.

### Three scales
- **Celsius**: 0 °C where ice melts and 100 °C where water boils at standard atmospheric pressure.
- **Fahrenheit**: the same two points are 32 °F and 212 °F, 180 degrees apart, so a change of 1 °C is a change of 1.8 °F:
$$t_F = \\tfrac{9}{5}\\,t_C + 32$$
- **Kelvin**: an *absolute* scale that starts at the lowest temperature there can be. A kelvin is the same size as a Celsius degree, and
$$T = t_C + 273.15$$

### Why an absolute zero?
Hold a sample of dilute gas at constant volume and plot its pressure against Celsius temperature: you get a straight line. Do it with any gas, any amount — every line, extended downwards, reaches zero pressure at the same point, **−273.15 °C**. That is **absolute zero**, 0 K. Nothing can be colder, and it can be approached but never reached (the [[third-law|third law]]). Since 2019 the kelvin has been defined by fixing the Boltzmann constant at exactly $k_B = 1.380649\\times10^{-23}\\ \\mathrm{J/K}$.

Every law in which temperature appears on its own — [[ideal-gas-law|$pV = nRT$]], [[thermal-radiation|radiated power $\\propto T^4$]], [[carnot-cycle|engine efficiency $1 - T_c/T_h$]] — needs the kelvin. Temperature *differences* are the same in K and °C.

### What temperature means
In a gas, temperature measures the average kinetic energy of the molecules' random motion: $\\tfrac12 m\\overline{v^2} = \\tfrac32 k_B T$ ([[kinetic-theory-gases|kinetic theory]]). At room temperature $k_B T$ is about $4\\times10^{-21}$ J, or 1/40 of an electronvolt — the typical energy that thermal jostling can hand to a molecule.

| | K | °C |
|---|---|---|
| Absolute zero | 0 | −273.15 |
| Helium boils | 4.2 | −269 |
| Nitrogen boils | 77 | −196 |
| Ice melts | 273.15 | 0 |
| Human body | 310 | 37 |
| Water boils (1 atm) | 373.15 | 100 |
| Iron melts | 1811 | 1538 |
| Surface of the Sun | ≈ 5800 | ≈ 5500 |

> [!tip] −40 is the one temperature that reads the same in Celsius and Fahrenheit. In kelvin there are no negative temperatures at all.
`,
  ideas: [
    'Temperature is what two bodies in thermal equilibrium have in common; a thermometer reaches equilibrium with what it measures.',
    'Celsius and kelvin degrees are the same size; T in kelvin = t in °C + 273.15.',
    'A change of 1 °C equals a change of 1 K and of 1.8 °F.',
    'Absolute zero, 0 K = −273.15 °C, is where the pressure of an ideal gas would vanish.',
    'Laws that use T on its own (gas law, radiation, efficiency) need absolute temperature.'
  ],
  pitfalls: [
    'Twice the Celsius temperature is twice as hot — Only ratios of kelvin temperatures mean anything: going from 10 °C to 20 °C raises the absolute temperature by 3.5 %, not 100 %.',
    'Metal in a cold room is colder than wood — Both are at room temperature; metal conducts heat away from your hand faster, so it feels colder.',
    'Adding 273 to a temperature change — A difference of 15 °C is a difference of 15 K. Only temperatures themselves are shifted by 273.15.'
  ],
  formulas: [
    {
      name: 'Celsius and Fahrenheit readings',
      expr: 'tF = 9/5*tC + 32', tex: 't_F = \\tfrac{9}{5}\\, t_C + 32',
      vars: {
        tF: { name: 'reading in degrees Fahrenheit', tex: 't_F', signed: true },
        tC: { name: 'reading in degrees Celsius', tex: 't_C', value: 37, signed: true }
      },
      note: 'Plain numbers read off the two scales. In every other calculator on this site temperatures carry units, and °C, °F and K are converted for you.',
      stories: {
        tF: 'A thermometer reads {tC} degrees Celsius. What does a Fahrenheit thermometer show?',
        tC: 'An American weather forecast promises {tF} degrees Fahrenheit. What is that in degrees Celsius?'
      }
    },
    {
      name: 'Constant-volume gas thermometer',
      expr: 'T = Ttp*p/ptp', tex: 'T = T_{tp}\\,\\frac{p}{p_{tp}}',
      vars: {
        T: { name: 'temperature of the gas', q: 'temperature', unit: '°C' },
        Ttp: { name: 'triple point of water', q: 'temperature', unit: 'K', value: 273.16, fixed: true, tex: 'T_{tp}' },
        p: { name: 'gas pressure at the unknown temperature', q: 'pressure', unit: 'kPa', value: 36.47 },
        ptp: { name: 'gas pressure at the triple point of water', q: 'pressure', unit: 'kPa', value: 26.70, tex: 'p_{tp}' }
      },
      note: 'Dilute gas at fixed volume: its pressure is proportional to absolute temperature. Calibrate once at the triple point of water, 273.16 K.',
      stories: {
        T: 'A sealed bulb of helium reads {ptp} at the triple point of water and {p} when dipped into a liquid. How hot is the liquid?',
        p: 'The same gas thermometer reads {ptp} at the triple point of water. What pressure will it show at {T}?'
      }
    },
    {
      name: 'Two-point calibration (platinum resistance thermometer)',
      expr: 'T = T1 + (T2 - T1)*(R - R1)/(R2 - R1)', tex: 'T = T_1 + (T_2 - T_1)\\,\\frac{R - R_1}{R_2 - R_1}',
      vars: {
        T: { name: 'temperature being measured', q: 'temperature', unit: '°C' },
        T1: { name: 'first calibration temperature', q: 'temperature', unit: '°C', value: 0 },
        T2: { name: 'second calibration temperature', q: 'temperature', unit: '°C', value: 100 },
        R: { name: 'resistance now', q: 'resistance', unit: 'Ω', value: 119.4 },
        R1: { name: 'resistance at the first point', q: 'resistance', unit: 'Ω', value: 100 },
        R2: { name: 'resistance at the second point', q: 'resistance', unit: 'Ω', value: 138.5 }
      },
      note: 'Assumes the property changes linearly between the fixed points. A standard "Pt100" sensor reads 100 Ω at 0 °C and 138.5 Ω at 100 °C.',
      practice: { unknowns: ['T', 'R'] },
      stories: {
        T: 'A platinum sensor reads {R1} at {T1} and {R2} at {T2}. In a bath it reads {R}. What is the bath temperature?',
        R: 'A sensor calibrated at {R1} for {T1} and {R2} for {T2} is placed in an oven at {T}. What resistance will it show?'
      }
    }
  ],
  examples: [
    {
      title: 'A body temperature in three scales',
      q: 'Normal body temperature is 37.0 °C. Express it in °F and in kelvin.',
      steps: [
        'Fahrenheit: $t_F = \\tfrac95 (37.0) + 32 = 66.6 + 32 = 98.6\\ \\text{°F}$.',
        'Kelvin: $T = 37.0 + 273.15 = 310.15\\ \\mathrm{K}$.',
        'A fever of 39 °C is 2 K (or 3.6 °F) above normal.'
      ],
      a: '98.6 °F and 310 K'
    },
    {
      title: 'How much hotter is "twice as warm"?',
      q: 'Air is warmed from 10 °C to 20 °C. By what factor does the average kinetic energy of its molecules increase?',
      steps: [
        'The average kinetic energy is proportional to the absolute temperature, so convert: 283.15 K and 293.15 K.',
        'Ratio: $293.15 / 283.15 = 1.035$.',
        'The molecules move with 3.5 % more kinetic energy — not twice as much, though the Celsius number doubled.'
      ],
      a: 'A factor of 1.035 (3.5 % more)'
    }
  ],
  quiz: [
    { q: 'A metal spoon and a wooden spoon have lain in the same drawer overnight. Which is colder?', choices: ['The metal one', 'The wooden one', 'Neither: they are at the same temperature', 'It depends on their masses'], a: 2,
      why: 'Both are in equilibrium with the drawer. The metal feels colder only because it draws heat from your skin faster.' },
    { q: 'The temperature of a room rises by 10 °C. In the other scales the rise is…', choices: ['10 K and 10 °F', '283 K and 50 °F', '10 K and 18 °F', '283 K and 18 °F'], a: 2,
      why: 'Kelvin and Celsius degrees are the same size; a Fahrenheit degree is 5/9 as big, so 10 °C of change is 18 °F.' },
    { q: 'At what temperature do the Celsius and Fahrenheit scales show the same number?', choices: ['0', '−40', '−273', '100'], a: 1,
      why: 'Set $t = \\tfrac95 t + 32$: then $-\\tfrac45 t = 32$ and $t = -40$.' },
    { q: 'A gas is at 27 °C. To double its absolute temperature you must heat it to…', choices: ['54 °C', '327 °C', '600 °C', '273 °C'], a: 1,
      why: '27 °C is 300 K. Doubling gives 600 K, which is 327 °C.' },
    { q: 'At 0 °C the molecules of a gas have no thermal energy.', a: false,
      why: 'The zero of the Celsius scale is just the melting point of ice. At 0 °C (273 K) nitrogen molecules move at around 500 m/s; only at 0 K would the random motion reach its minimum.' }
  ],
  applications: ['Clinical and kitchen thermometers, and infrared ear thermometers.', 'Thermocouples and platinum sensors that control ovens, engines and chemical plants.', 'Weather records, and the absolute temperatures used in every thermodynamics calculation.'],
  history: 'Daniel Fahrenheit built reliable mercury thermometers and published his scale in 1724. Anders Celsius proposed a hundred-degree scale in 1742 — with 0 at boiling and 100 at freezing; it was turned the other way up soon after his death. William Thomson (Lord Kelvin) argued for an absolute scale in 1848, and in 2019 the kelvin was redefined by fixing the Boltzmann constant.',
  sim: 'heat-gas-box'
},

{
  id: 'thermal-expansion', parent: 'temperature-heat', title: 'Thermal expansion', level: 1,
  short: 'Most materials grow slightly when heated: every length by a fixed fraction per kelvin, and every volume by about three times that fraction.',
  keywords: ['thermal expansion', 'coefficient of linear expansion', 'volume expansion', 'expansion joint', 'bimetallic strip', 'thermal stress', 'anomalous expansion of water', 'alpha', 'shrink fit', 'invar'],
  prereq: ['temperature', 'math:linear-approximation'],
  related: ['stress-strain', 'density', 'ideal-gas-law', 'kinetic-theory-gases'],
  body: `
Railway lines have small gaps between the rails, long bridges rest on toothed joints, and power lines sag lower on a hot afternoon. All of these allow for **thermal expansion**.

### Why things expand
The atoms of a solid vibrate about their places, held by springs of electric force. Those springs are lopsided: two atoms resist being squeezed together much more strongly than being pulled apart. As the temperature rises and the vibrations grow, each atom spends more of its time on the stretched side, so the average spacing grows — and so does the whole object.

### Linear expansion
For a rod of length $L_0$, a temperature change $\\Delta T$ changes its length by

$$\\Delta L = \\alpha\\, L_0\\, \\Delta T$$

where $\\alpha$, the **coefficient of linear expansion**, is a property of the material, in 1/K. The change is proportional to the original length: every centimetre of the rod grows by the same fraction.

| Material | $\\alpha$ (10⁻⁶ /K) |
|---|---|
| Invar (iron–nickel alloy) | 1.2 |
| Borosilicate glass (Pyrex) | 3.3 |
| Window glass | 9 |
| Concrete, steel | 12 |
| Copper | 17 |
| Aluminium | 23 |
| Ice | 51 |

A 100 m steel bridge span warmed by 60 K between a winter night and a summer afternoon grows by $12\\times10^{-6} \\times 100 \\times 60 = 0.072$ m — 7 cm, which the expansion joints must absorb.

### Areas and volumes
Every dimension grows by the same fraction, so the object scales up like a photographic enlargement. **Holes grow too**: heating a metal lid loosens it on a glass jar because the ring of the lid expands outwards. A cube of side $L$ becomes $L^3(1 + \\alpha\\Delta T)^3 \\approx L^3(1 + 3\\alpha\\Delta T)$, so

$$\\Delta V = \\beta\\, V_0\\, \\Delta T, \\qquad \\beta \\approx 3\\alpha$$

Liquids have no shape of their own and are quoted by $\\beta$ alone: water about $2.1\\times10^{-4}$ /K at 20 °C, petrol about $9.5\\times10^{-4}$ /K, ethanol about $1.1\\times10^{-3}$ /K — which is why a liquid-in-glass thermometer works: the liquid expands far more than the glass. An [[ideal-gas-law|ideal gas]] at constant pressure has $\\beta = 1/T$, about $3.4\\times10^{-3}$ /K at room temperature.

### When expansion is blocked
A rod clamped between rigid walls cannot grow, so it pushes. The stress is the one that would squeeze it back by $\\alpha\\Delta T$ ([[stress-strain|Young's modulus]] $E$ times the strain):

$$\\sigma = E\\,\\alpha\\,\\Delta T$$

For steel rail ($E = 200$ GPa) heated 30 K, that is 72 MPa — enough to buckle track that was laid without allowance. Uneven heating causes the same stresses inside one object: that is why thick ordinary glass cracks under boiling water while low-$\\alpha$ borosilicate survives.

### Water breaks the rule
Between 0 °C and 4 °C water *contracts* as it warms; it is densest at about 4 °C. And water expands by about 9 % when it freezes, so ice floats. So in winter a lake cools until its whole depth reaches 4 °C, then the colder water stays on top and freezes, leaving liquid water below the ice for fish to survive in.
`,
  ideas: [
    'Heating makes most materials expand because atomic vibrations are asymmetric.',
    'ΔL = αL₀ΔT: the change is a fixed fraction of the length per kelvin.',
    'Every dimension scales up by the same factor, including holes; for volume β ≈ 3α.',
    'Blocked expansion produces thermal stress σ = EαΔT.',
    'Water is an exception between 0 °C and 4 °C, and ice floats.'
  ],
  pitfalls: [
    'A hole in a heated plate shrinks because the metal expands into it — The whole plate scales up, holes included, like an enlarged photograph.',
    'ΔT must be converted to kelvin by adding 273 — ΔT is a difference: a change of 20 °C is a change of 20 K.',
    'The volume coefficient equals the linear one — For an isotropic solid β ≈ 3α, because all three dimensions grow.'
  ],
  formulas: [
    {
      name: 'Linear expansion',
      expr: 'dL = alpha*L0*dT', tex: '\\Delta L = \\alpha\\, L_0\\, \\Delta T',
      vars: {
        dL: { name: 'change in length', q: 'length', unit: 'mm', tex: '\\Delta L', signed: true },
        alpha: { name: 'coefficient of linear expansion', q: 'expansion', unit: '1/K', value: 12e-6 },
        L0: { name: 'original length', q: 'length', unit: 'm', value: 100 },
        dT: { name: 'temperature change', q: 'dtemp', unit: 'K', value: 60, tex: '\\Delta T', signed: true }
      },
      stories: {
        dL: 'A steel bridge span {L0} long (α = {alpha}) warms by {dT} from a winter night to a summer afternoon. How much longer does it get?',
        alpha: 'A rod {L0} long grows by {dL} when heated by {dT}. What is its coefficient of linear expansion?',
        dT: 'By how much must a rod {L0} long with α = {alpha} be heated to grow by {dL}?'
      }
    },
    {
      name: 'Volume expansion',
      expr: 'dV = beta*V0*dT', tex: '\\Delta V = \\beta\\, V_0\\, \\Delta T',
      vars: {
        dV: { name: 'change in volume', q: 'volume', unit: 'L', tex: '\\Delta V', signed: true },
        beta: { name: 'coefficient of volume expansion', q: 'expansion', unit: '1/K', value: 9.5e-4 },
        V0: { name: 'original volume', q: 'volume', unit: 'L', value: 60 },
        dT: { name: 'temperature change', q: 'dtemp', unit: 'K', value: 20, tex: '\\Delta T', signed: true }
      },
      note: 'For liquids use the measured β; for an isotropic solid β ≈ 3α.',
      stories: {
        dV: 'A car tank is filled to the brim with {V0} of cold petrol (β = {beta}). The car is parked in the sun and the fuel warms by {dT}. How much overflows (ignoring the tank\'s own expansion)?'
      }
    },
    {
      name: 'Thermal stress in a clamped rod',
      expr: 'sigma = E*alpha*dT', tex: '\\sigma = E\\,\\alpha\\,\\Delta T',
      vars: {
        sigma: { name: 'compressive stress', q: 'stress', unit: 'MPa' },
        E: { name: 'Young\'s modulus', q: 'stress', unit: 'GPa', value: 200 },
        alpha: { name: 'coefficient of linear expansion', q: 'expansion', unit: '1/K', value: 12e-6 },
        dT: { name: 'temperature rise', q: 'dtemp', unit: 'K', value: 30, tex: '\\Delta T' }
      },
      note: 'The rod is held at fixed length, so the thermal strain αΔT is cancelled by an elastic strain σ/E.',
      stories: { sigma: 'A steel rail (E = {E}, α = {alpha}) is welded end to end with no gaps and then warms by {dT}. What stress builds up in it?' }
    }
  ],
  examples: [
    {
      title: 'Will the ring fit?',
      q: 'An aluminium ring has an inner diameter of 49.95 mm at 20 °C. It must slide onto a steel shaft 50.00 mm across. How much must the ring be heated?',
      steps: [
        'The inner diameter must grow by $\\Delta D = 0.05$ mm. A hole grows like the metal around it, so use $\\Delta D = \\alpha D_0 \\Delta T$ with $\\alpha = 23\\times10^{-6}$ /K.',
        '$\\Delta T = \\dfrac{\\Delta D}{\\alpha D_0} = \\dfrac{0.05}{23\\times10^{-6} \\times 49.95} = 43.5\\ \\mathrm{K}$.',
        'So heat the ring to at least 64 °C, slide it on, and let it cool: it grips the shaft tightly. This is a *shrink fit*.'
      ],
      a: 'By about 44 K, to roughly 64 °C'
    },
    {
      title: 'Expansion joints for a bridge',
      q: 'A concrete bridge deck is 250 m long. Its temperature ranges from −15 °C in winter to 45 °C in summer. What total movement must the joints allow?',
      steps: [
        'Temperature range: $\\Delta T = 45 - (-15) = 60\\ \\mathrm{K}$.',
        '$\\Delta L = \\alpha L_0 \\Delta T = 12\\times10^{-6} \\times 250 \\times 60 = 0.18\\ \\mathrm{m}$.',
        'Eighteen centimetres, usually split between joints at both ends.'
      ],
      a: 'About 0.18 m'
    }
  ],
  quiz: [
    { q: 'A steel plate with a circular hole in it is heated. The hole…', choices: ['gets smaller', 'gets larger', 'stays the same size', 'becomes oval'], a: 1,
      why: 'Every dimension of the plate grows by the same fraction, including the hole — just as a photograph enlarged shows a larger hole.' },
    { q: 'A bimetallic strip is brass ($\\alpha = 19\\times10^{-6}$ /K) bonded to steel ($12\\times10^{-6}$ /K). When heated it bends so that…', choices: ['the brass is on the outside of the curve', 'the steel is on the outside of the curve', 'it stays straight', 'it twists'], a: 0,
      why: 'Brass grows more, and the longer strip must lie on the outer, longer side of the curve. Thermostats use this bending to open and close contacts.' },
    { q: 'For an isotropic solid, the coefficient of volume expansion is about…', choices: ['$\\alpha$', '$2\\alpha$', '$3\\alpha$', '$\\alpha^3$'], a: 2,
      why: '$(1 + \\alpha\\Delta T)^3 \\approx 1 + 3\\alpha\\Delta T$ for small changes: three dimensions each grow by $\\alpha\\Delta T$.' },
    { q: 'A steel tape measure marked correctly at 20 °C is used on a hot day at 40 °C to measure a board. The reading is…', choices: ['slightly too large', 'slightly too small', 'exactly right', 'too large by 20 %'], a: 1,
      why: 'The tape has expanded, so its millimetre marks are slightly farther apart; fewer of them fit along the board, and the reading comes out a little small.' },
    { q: 'A lake freezes from the top down because water is densest at about 4 °C.', a: true,
      why: 'Once the whole lake is at 4 °C, colder water is lighter and stays at the surface, where it freezes. Ice, lighter still, floats on top.' }
  ],
  applications: ['Expansion joints in bridges, pipelines and railway track.', 'Bimetallic thermostats and old-style dial thermometers.', 'Shrink-fitting gears and bearings onto shafts.', 'Low-expansion glass for cookware and telescope mirrors; invar for precision clocks and instruments.']
},

{
  id: 'heat-internal-energy', parent: 'temperature-heat', title: 'Heat and internal energy', level: 1,
  short: 'Internal energy is the total energy of a body\'s jiggling molecules; heat is energy that flows from hot to cold because of a temperature difference.',
  keywords: ['heat', 'internal energy', 'thermal energy', 'calorie', 'kilocalorie', 'joule', 'mechanical equivalent of heat', 'Joule experiment', 'energy transfer', 'caloric theory', 'work and heat'],
  prereq: ['temperature', 'conservation-of-energy', 'work'],
  related: ['first-law-thermodynamics', 'specific-heat', 'equipartition', 'kinetic-theory-gases'],
  body: `
Three words are easily muddled: temperature, internal energy and heat.

- **Internal energy** $U$ is all the energy stored inside a body at the molecular scale: the kinetic energy of molecules moving, spinning and vibrating, plus the potential energy of the forces between them. It is the body's own energy, like money in a bank account.
- **Temperature** measures the average random kinetic energy *per molecule*. A bath of warm water has a lower temperature than a cup of boiling water, but far more internal energy — it has many more molecules.
- **Heat** $Q$ is energy *in transit* because of a temperature difference: from the stove into the pan, from your hand into the cold spoon. Once it has arrived it is simply internal energy. A body does not "contain heat", just as an account does not contain "deposits".

There is a second way to change internal energy: **work**, energy handed over by a force acting through a distance. Rub your hands together and they warm up without any heat flowing in; pump up a bicycle tyre and the pump barrel gets hot. The [[first-law-thermodynamics|first law of thermodynamics]] keeps the accounts: $\\Delta U = Q - W$, where $W$ is the work done *by* the system.

### Heat is energy
For much of the 18th century heat was thought to be an invisible fluid, "caloric", that flowed from hot bodies into cold ones. Two observations undermined it. Count Rumford, supervising the boring of cannon in Munich in the 1790s, saw that blunt drills could make heat without limit as long as the horses kept turning them. In the 1840s James Joule let falling weights turn a paddle wheel in insulated water and found that the water warmed by an amount strictly proportional to the work done: about 4.2 joules for every calorie of heat. Heat and work are two forms of the same thing — energy.

The temperature rises are tiny. A 10 kg weight falling 2 m does $196$ J of work; stirred into 1 kg of water it warms it by only $196/4186 = 0.047$ K. Joule even reasoned that water at the foot of a waterfall should be warmer than at the top — by $g h / c$, about 0.23 K for every 100 m of drop.

### Units
The SI unit of heat, as of all energy, is the **joule**. The **calorie** (4.184 J) is the heat that warms 1 g of water by 1 K. Food labels use the kilocalorie, written "Calorie": a 2000 kcal daily diet is 8.4 MJ, an average power of about 97 W — roughly a bright old-fashioned light bulb, running all day.

### Inside an ideal gas
For a monatomic ideal gas such as helium, the only internal energy is the translational kinetic energy of the atoms, $U = \\tfrac32 nRT$ ([[equipartition]] extends this to other molecules). One mole of helium at 300 K holds 3.7 kJ. For such a gas, internal energy depends on temperature alone.
`,
  ideas: [
    'Internal energy is the total molecular kinetic and potential energy inside a body.',
    'Heat is energy transferred because of a temperature difference; work is energy transferred by a force.',
    'Heat always flows spontaneously from higher to lower temperature, not from more energy to less.',
    'Joule showed that a fixed amount of work always produces the same warming: heat is a form of energy.',
    '1 cal = 4.184 J; a food Calorie is 1 kcal = 4184 J.'
  ],
  pitfalls: [
    'A hot object contains a lot of heat — It contains internal energy. "Heat" is the name for energy only while it is flowing because of a temperature difference.',
    'Heat flows from the body with more energy to the one with less — It flows from higher temperature to lower. A sparkler\'s sparks are above 1000 °C but carry so little energy that they barely warm your hand; the flow is still from spark to skin.',
    'Temperature and internal energy are the same thing — Internal energy also depends on the amount of material and its phase: ice and water at 0 °C have the same temperature, but the water holds 334 kJ more per kilogram.'
  ],
  formulas: [
    {
      name: 'Warming by work (Joule\'s paddle wheel)',
      expr: 'dT = N*M*g*h/(m*c)', tex: '\\Delta T = \\frac{N M g h}{m c}',
      vars: {
        dT: { name: 'temperature rise of the water', q: 'dtemp', unit: 'K', tex: '\\Delta T' },
        N: { name: 'number of drops of the weight', q: 'count', int: true, value: 20 },
        M: { name: 'falling mass', q: 'mass', unit: 'kg', value: 10 },
        g: { const: 'g' },
        h: { name: 'height of each drop', q: 'length', unit: 'm', value: 2 },
        m: { name: 'mass of the water', q: 'mass', unit: 'kg', value: 1 },
        c: { name: 'specific heat of the water', q: 'specificheat', unit: 'J/(kg·K)', value: 4186 }
      },
      note: 'All the work done by the falling weight ends up as internal energy of the water; the container is assumed to take none.',
      stories: {
        dT: 'A {M} weight falls {h}, {N} times over, turning paddles in {m} of water. How much does the water warm up?',
        N: 'How many times must a {M} weight fall {h} to warm {m} of water by {dT}?'
      }
    },
    {
      name: 'The warmer water at the foot of a waterfall',
      expr: 'dT = g*h/c', tex: '\\Delta T = \\frac{g h}{c}',
      vars: {
        dT: { name: 'temperature rise', q: 'dtemp', unit: 'K', tex: '\\Delta T' },
        g: { const: 'g' },
        h: { name: 'height of the fall', q: 'length', unit: 'm', value: 51 },
        c: { name: 'specific heat of water', q: 'specificheat', unit: 'J/(kg·K)', value: 4186 }
      },
      note: 'If all the gravitational potential energy becomes internal energy of the water (none carried off as spray, sound or evaporation).',
      stories: { dT: 'Water plunges {h} over a waterfall. If all its potential energy turned into internal energy, how much warmer would it be at the bottom?' }
    },
    {
      name: 'Internal energy of a monatomic ideal gas',
      expr: 'U = 3/2*n*R*T', tex: 'U = \\tfrac32\\, n R T',
      vars: {
        U: { name: 'internal energy', q: 'energy', unit: 'kJ' },
        n: { name: 'amount of gas', q: 'amount', unit: 'mol', value: 1 },
        R: { const: 'R' },
        T: { name: 'absolute temperature', q: 'temperature', unit: 'K', value: 300 }
      },
      stories: { U: 'How much internal energy do {n} of helium atoms have at {T}?', T: 'At what temperature do {n} of argon hold {U} of internal energy?' }
    }
  ],
  examples: [
    {
      title: 'Joule\'s experiment in numbers',
      q: 'A 15 kg weight is lowered 1.8 m, 30 times, turning paddles in 2.0 kg of water. How much does the water warm?',
      steps: [
        'Work done: $W = N M g h = 30 \\times 15 \\times 9.81 \\times 1.8 = 7946\\ \\mathrm{J}$.',
        'All of it becomes internal energy of the water: $\\Delta T = \\dfrac{W}{m c} = \\dfrac{7946}{2.0 \\times 4186} = 0.95\\ \\mathrm{K}$.',
        'Less than one degree for thirty lifts of a heavy weight — Joule needed thermometers readable to a few hundredths of a degree.'
      ],
      a: 'About 0.95 K'
    },
    {
      title: 'Your daily power',
      q: 'An adult eats about 2000 kcal a day. What average power is that?',
      steps: [
        'Energy: $2000 \\times 4184\\ \\mathrm{J} = 8.37\\times10^{6}\\ \\mathrm{J}$.',
        'A day is 86 400 s, so $P = 8.37\\times10^{6} / 86\\,400 = 97\\ \\mathrm{W}$.',
        'Almost all of it leaves your body as heat — which is why a crowded room warms up.'
      ],
      a: 'About 97 W'
    }
  ],
  quiz: [
    { q: 'A cup of tea at 90 °C floats in a bath of water at 40 °C. Heat flows…', choices: ['from the bath to the tea, because the bath has more internal energy', 'from the tea to the bath, because the tea is hotter', 'neither way', 'both ways equally'], a: 1,
      why: 'Heat flows from higher to lower temperature. The amounts of internal energy do not decide the direction.' },
    { q: 'You warm your cold hands by rubbing them together. Their internal energy rises mainly because of…', choices: ['heat from the air', 'work done against friction', 'heat from your blood only', 'radiation from the Sun'], a: 1,
      why: 'Friction converts the work of your muscles into internal energy at the skin. No temperature difference is needed.' },
    { q: 'The statement "a hot iron contains a lot of heat" is correct physics.', a: false,
      why: 'It contains a lot of internal energy. Heat is energy in transfer; it becomes heat only as it flows out to something cooler.' },
    { q: 'A food label says 250 kcal. How many joules is that?', choices: ['250 J', '1046 J', '1.05 × 10⁶ J', '60 J'], a: 2,
      why: '1 kcal = 4184 J, so 250 kcal = 1.05 × 10⁶ J, about 1 MJ.' },
    { q: 'Air in a bicycle pump heats up when you push the handle down quickly. No heat has been added, so why does its temperature rise?', choices: ['Friction between the air molecules', 'Work is done on the air, raising its internal energy', 'Heat flows in from your hand', 'Compression lowers its specific heat'], a: 1,
      why: 'Compressing the air is work done on it; with no time for heat to leave, the internal energy — and so the temperature — rises.' }
  ],
  applications: ['Brakes, which turn the kinetic energy of a car into internal energy of discs and pads.', 'Food energy labels and nutrition.', 'The design of engines and power stations, which convert internal energy into work.'],
  history: 'Benjamin Thompson, Count Rumford, reported in 1798 that boring cannon produced heat without limit. Julius Robert Mayer (1842) and James Prescott Joule (1843–1850) established the equivalence of heat and work; Joule\'s careful paddle-wheel measurements gave a value within about 1 % of today\'s.'
},

{
  id: 'specific-heat', parent: 'temperature-heat', title: 'Specific heat and calorimetry', level: 1,
  short: 'How much energy it takes to warm a kilogram of a substance by one kelvin, and how to use it to predict the temperature when hot and cold things are mixed.',
  keywords: ['specific heat', 'specific heat capacity', 'heat capacity', 'calorimetry', 'Q = mcΔT', 'molar heat capacity', 'calorimeter', 'method of mixtures', 'thermal mass', 'final temperature'],
  prereq: ['heat-internal-energy', 'temperature'],
  related: ['latent-heat', 'heat-capacity-solids', 'equipartition', 'newtons-law-of-cooling'],
  body: `
On a sunny beach the sand burns your feet while the sea stays cool, though both have had the same sunshine all day. Water needs far more energy to warm up than sand. The quantity that says how much is the **specific heat capacity** $c$: the energy needed to raise 1 kg of a substance by 1 K. Heating a mass $m$ through $\\Delta T$ takes

$$Q = m\\,c\\,\\Delta T$$

and cooling it by $\\Delta T$ releases the same amount.

| Substance | $c$ (J/(kg·K)) |
|---|---|
| Water | 4186 |
| Human body (average) | about 3500 |
| Ice | 2100 |
| Steam | 2010 |
| Air (at constant pressure) | 1005 |
| Aluminium | 900 |
| Glass | 840 |
| Iron, steel | 450 |
| Copper | 385 |
| Lead | 128 |

Water's value is exceptionally high. The same energy that warms a kilogram of water by 1 K would warm a kilogram of copper by 11 K. That is why oceans smooth out coastal climates — the top few metres of the sea can store as much heat as the whole atmosphere above it — and why water is used to carry heat in radiators and to cool engines.

### Heat capacity and molar heat capacity
An object's **heat capacity** $C = mc$ (in J/K) is the energy per kelvin for the object as a whole: a large pot has more than a small one of the same metal. Chemists often use the **molar** heat capacity, per mole instead of per kilogram. Measured that way, most solid elements come out close to 25 J/(mol·K), because each atom stores about the same energy at a given temperature ([[equipartition]], [[heat-capacity-solids]]). Lead's small specific heat just reflects its heavy atoms: there are fewer of them in a kilogram.

### Calorimetry: mixing hot and cold
Put hot and cold things in contact inside an insulated container and wait. Energy is conserved, so the heat lost by the hot parts equals the heat gained by the cold ones: $\\sum m c\\,(T_f - T_i) = 0$. Solving for the common final temperature gives a weighted average,

$$T_f = \\frac{m_1 c_1 T_1 + m_2 c_2 T_2}{m_1 c_1 + m_2 c_2}$$

weighted by heat capacity. It works in °C or in K, since it is an average. Measuring $T_f$ is also how specific heats are found: drop a hot sample of known mass into water and see how far the water warms.

### How long will it take?
A 2 kW kettle holding 1 L of water at 20 °C must supply $Q = 1 \\times 4186 \\times 80 = 335$ kJ to reach boiling: $t = Q/P = 167$ s, just under three minutes, if no heat escapes. In practice a little more, because the kettle itself warms and some heat leaks away.

> [!note] For gases, the specific heat depends on the conditions: warming at constant pressure takes more energy than at constant volume, because the expanding gas also does work. See [[thermodynamic-processes]].
`,
  ideas: [
    'Q = mcΔT: the energy to warm a body is proportional to its mass, its specific heat and the temperature rise.',
    'Water has one of the highest specific heats of any common substance, 4186 J/(kg·K).',
    'An object\'s heat capacity C = mc is the energy per kelvin for the whole object.',
    'In an insulated mixture, heat lost by the hot parts equals heat gained by the cold ones.',
    'The final temperature of a mixture is an average weighted by heat capacity.'
  ],
  pitfalls: [
    'Converting ΔT by adding 273 — A change of 1 °C is a change of 1 K, so use the difference as it is.',
    'The final temperature of a mixture is the average of the two temperatures — Only when the heat capacities mc are equal. The side with the larger mc pulls the result towards its own temperature.',
    'Specific heat and heat capacity mean the same — c is a property of the material (per kilogram); C = mc belongs to a particular object.'
  ],
  formulas: [
    {
      name: 'Heat for a temperature change',
      expr: 'Q = m*c*dT', tex: 'Q = m\\,c\\,\\Delta T',
      vars: {
        Q: { name: 'heat added (negative if removed)', q: 'energy', unit: 'kJ', signed: true },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 1 },
        c: { name: 'specific heat capacity', q: 'specificheat', unit: 'J/(kg·K)', value: 4186 },
        dT: { name: 'temperature change', q: 'dtemp', unit: 'K', value: 80, tex: '\\Delta T', signed: true }
      },
      stories: {
        Q: 'How much energy does it take to warm {m} of water (c = {c}) by {dT}?',
        dT: 'A {m} block of metal with c = {c} absorbs {Q}. How much does its temperature change?',
        c: 'Adding {Q} to {m} of an unknown liquid raises its temperature by {dT}. What is its specific heat capacity?',
        m: 'What mass of water can {Q} warm by {dT} (c = {c})?'
      }
    },
    {
      name: 'Heating with a steady power',
      expr: 'P*t = m*c*dT', tex: 'P\\,t = m\\,c\\,\\Delta T', solveFor: 't',
      vars: {
        P: { name: 'heater power', q: 'power', unit: 'W', value: 2000 },
        t: { name: 'heating time', q: 'time', unit: 's' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 1 },
        c: { name: 'specific heat capacity', q: 'specificheat', unit: 'J/(kg·K)', value: 4186 },
        dT: { name: 'temperature rise', q: 'dtemp', unit: 'K', value: 80, tex: '\\Delta T' }
      },
      note: 'Assumes every joule from the heater goes into the material: no losses and no heating of the container.',
      stories: {
        t: 'A {P} kettle heats {m} of water (c = {c}) through {dT}. Ignoring losses, how long does it take?',
        P: 'What heater power would warm {m} of water by {dT} in {t}?'
      }
    },
    {
      name: 'Final temperature of a mixture',
      expr: 'Tf = (m1*c1*T1 + m2*c2*T2)/(m1*c1 + m2*c2)', tex: 'T_f = \\frac{m_1 c_1 T_1 + m_2 c_2 T_2}{m_1 c_1 + m_2 c_2}',
      vars: {
        Tf: { name: 'final common temperature', q: 'temperature', unit: '°C', tex: 'T_f' },
        m1: { name: 'mass of the first body', q: 'mass', unit: 'kg', value: 0.5 },
        c1: { name: 'specific heat of the first body', q: 'specificheat', unit: 'J/(kg·K)', value: 450 },
        T1: { name: 'starting temperature of the first body', q: 'temperature', unit: '°C', value: 200 },
        m2: { name: 'mass of the second body', q: 'mass', unit: 'kg', value: 2 },
        c2: { name: 'specific heat of the second body', q: 'specificheat', unit: 'J/(kg·K)', value: 4186 },
        T2: { name: 'starting temperature of the second body', q: 'temperature', unit: '°C', value: 20 }
      },
      note: 'Insulated container, no phase change, and no heat taken up by the container itself.',
      practice: { unknowns: ['Tf', 'c1', 'T1'] },
      stories: {
        Tf: 'A {m1} iron block (c = {c1}) at {T1} is dropped into {m2} of water (c = {c2}) at {T2}. What is the final temperature?',
        c1: 'A {m1} metal sample at {T1} is dropped into {m2} of water (c = {c2}) at {T2}; everything settles at {Tf}. What is the metal\'s specific heat?'
      }
    }
  ],
  examples: [
    {
      title: 'Identifying a metal',
      q: 'A 0.200 kg metal sample is heated to 100.0 °C in boiling water and dropped into 0.250 kg of water at 20.0 °C in an insulated cup. The water settles at 31.7 °C. What is the metal\'s specific heat, and what might it be?',
      steps: [
        'Heat gained by the water: $Q = 0.250 \\times 4186 \\times (31.7 - 20.0) = 12\\,244\\ \\mathrm{J}$.',
        'The metal lost the same heat while cooling from 100.0 °C to 31.7 °C, a drop of 68.3 K.',
        '$c = \\dfrac{Q}{m\\,\\Delta T} = \\dfrac{12\\,244}{0.200 \\times 68.3} = 896\\ \\mathrm{J/(kg\\cdot K)}$.',
        'That matches aluminium (900 J/(kg·K)).'
      ],
      a: 'About 900 J/(kg·K): aluminium'
    },
    {
      title: 'Hot-water tank',
      q: 'A 150 L hot-water tank is heated from 15 °C to 60 °C by a 3.0 kW element. How long does it take, ignoring losses?',
      steps: [
        '150 L of water has a mass of 150 kg.',
        '$Q = m c \\Delta T = 150 \\times 4186 \\times 45 = 2.83\\times10^{7}\\ \\mathrm{J}$.',
        '$t = Q/P = 2.83\\times10^{7} / 3000 = 9420\\ \\mathrm{s}$, about 2.6 hours.'
      ],
      a: 'About 2.6 hours'
    }
  ],
  quiz: [
    { q: 'The same energy is given to 1 kg of water and 1 kg of copper, both starting at 20 °C. Which ends up hotter?', choices: ['The water', 'The copper, by far', 'They end up equal', 'It depends on the energy'], a: 1,
      why: 'Copper\'s specific heat, 385 J/(kg·K), is about 11 times smaller than water\'s, so the same energy gives an 11 times larger temperature rise.' },
    { q: 'You mix 1 kg of water at 80 °C with 3 kg of water at 20 °C. The final temperature is…', choices: ['50 °C', '35 °C', '40 °C', '65 °C'], a: 1,
      why: 'A weighted average: $(1 \\times 80 + 3 \\times 20)/4 = 35$ °C. The larger mass pulls the result towards its temperature.' },
    { q: 'On a sunny day sand gets much hotter than the sea mainly because…', choices: ['sand absorbs more sunlight', 'water has a much larger specific heat, and the sea mixes heat downwards', 'sand has a higher temperature to start with', 'water reflects all the sunlight'], a: 1,
      why: 'Water needs about five times more energy per kilogram per kelvin than dry sand, and waves and currents spread the heat through a deep layer.' },
    { q: 'A swimming pool and a glass of water taken from it have the same specific heat capacity.', a: true,
      why: 'Specific heat is a property of the material. Their heat capacities $C = mc$ differ enormously.' },
    { q: 'A 1500 W heater warms 0.5 kg of water from 20 °C to 80 °C. About how long does it take?', choices: ['8 s', '84 s', '14 min', '2 h'], a: 1,
      why: '$Q = 0.5 \\times 4186 \\times 60 = 125.6$ kJ; $t = 125\\,600/1500 = 84$ s.' }
  ],
  applications: ['Cooling systems in cars and power stations, which carry heat away in water.', 'Night storage heaters and hot-water tanks that store energy as warm material.', 'Coastal climates, moderated by the sea\'s huge heat capacity.', 'Calorimeters that measure the energy content of foods and fuels.'],
  sim: 'heat-heating-curve'
},

{
  id: 'latent-heat', parent: 'temperature-heat', title: 'Phase changes and latent heat', level: 1,
  short: 'Melting, boiling and their reverses take or release energy without changing the temperature; the energy per kilogram is the latent heat.',
  keywords: ['latent heat', 'phase change', 'melting', 'freezing', 'boiling', 'evaporation', 'condensation', 'sublimation', 'heat of fusion', 'heat of vaporization', 'heating curve', 'phase diagram', 'triple point', 'boiling point', 'evaporative cooling'],
  prereq: ['specific-heat', 'heat-internal-energy'],
  related: ['kinetic-theory-gases', 'maxwell-boltzmann', 'entropy', 'pressure', 'refrigerators-heat-pumps'],
  body: `
Put a pan of ice at −20 °C on a steady flame and watch a thermometer in it. The temperature climbs to 0 °C — and stops. It stays at 0 °C, while the flame keeps pouring energy in, until the last of the ice has melted. Then it climbs again, to 100 °C, and stops once more while the water boils away.

The energy supplied on these plateaus does not make the molecules move faster, so it does not raise the temperature. It pulls them apart: in melting, it breaks the rigid bonds of the crystal so molecules can slide past each other; in boiling, it separates them completely against their mutual attraction. It goes into the *potential* energy part of the [[heat-internal-energy|internal energy]]. Because it seems to vanish without warming anything, it is called **latent** (hidden) heat:

$$Q = m\\,L$$

where $L$ is the specific latent heat in J/kg: $L_f$ for fusion (melting) and $L_v$ for vaporization (boiling). The same energy comes back out when the vapour condenses or the liquid freezes.

| Substance | Melts at | $L_f$ (kJ/kg) | Boils at (1 atm) | $L_v$ (kJ/kg) |
|---|---|---|---|---|
| Water | 0 °C | 334 | 100 °C | 2256 |
| Ethanol | −114 °C | 108 | 78 °C | about 850 |
| Nitrogen | −210 °C | 26 | −196 °C | 199 |
| Iron | 1538 °C | 247 | 2862 °C | about 6100 |

For water, melting takes as much energy as warming the melted water by 80 K, and boiling takes more than five times as much as heating the water all the way from 0 °C to 100 °C. Open the heating-curve simulation below and compare the lengths of the plateaus.

### Steam burns and frosty oranges
Steam at 100 °C scalds far worse than water at 100 °C: every gram that condenses on skin releases 2256 J before it even starts cooling. The reverse is used by fruit growers: on a frosty night they spray their trees with water, and as it freezes it releases 334 kJ per kilogram, holding the fruit at 0 °C instead of letting it drop lower.

### Evaporation below the boiling point
A puddle dries up on a cool day. Molecules in a liquid have a spread of speeds ([[maxwell-boltzmann|Maxwell–Boltzmann]]), and the fastest near the surface escape even far below the boiling point. They take more than their share of energy with them, so the liquid left behind cools. Sweating works this way: at skin temperature each litre of sweat that evaporates removes about 2.4 MJ. A refrigerator does the same with a refrigerant that evaporates inside the cold compartment ([[refrigerators-heat-pumps]]).

### The boiling point depends on pressure
Water boils when its vapour pressure matches the pressure above it. On the summit of Everest (about a third of an atmosphere) that happens at about 71 °C, too cool to cook an egg properly; in a pressure cooker at about two atmospheres it happens near 120 °C, and food cooks much faster. A **phase diagram** maps which phase is stable at each pressure and temperature. All three phases of water coexist only at the **triple point**, 0.01 °C and 612 Pa. Below its triple-point pressure a solid turns straight into vapour: this *sublimation* is why dry ice (solid carbon dioxide) at −78.5 °C leaves no puddle.
`,
  ideas: [
    'During melting or boiling, added energy breaks bonds instead of raising the temperature.',
    'Q = mL, with the same energy released on freezing or condensing.',
    'For water, boiling takes far more energy (2256 kJ/kg) than melting (334 kJ/kg).',
    'Evaporation removes the fastest molecules and cools what remains.',
    'The boiling point rises with pressure: lower on mountains, higher in a pressure cooker.'
  ],
  pitfalls: [
    'Adding heat always raises the temperature — Not during a phase change: the energy goes into separating molecules while the temperature stays fixed.',
    'Water always boils at 100 °C — Only at standard atmospheric pressure. It boils near 71 °C on Everest and near 120 °C in a pressure cooker.',
    'Turning up the gas under boiling pasta cooks it faster — The water just boils away faster; its temperature stays at the boiling point.'
  ],
  formulas: [
    {
      name: 'Latent heat of a phase change',
      expr: 'Q = m*L', tex: 'Q = m\\,L',
      vars: {
        Q: { name: 'heat absorbed (or released)', q: 'energy', unit: 'kJ' },
        m: { name: 'mass changing phase', q: 'mass', unit: 'kg', value: 0.5 },
        L: { name: 'specific latent heat', q: 'latent', unit: 'kJ/kg', value: 334 }
      },
      note: 'Water: $L_f = 334$ kJ/kg, $L_v = 2256$ kJ/kg at 100 °C (about 2420 kJ/kg at skin temperature).',
      stories: {
        Q: 'How much heat does it take to melt {m} of ice already at 0 °C (L = {L})?',
        m: 'A kettle delivers {Q} to water already at 100 °C. What mass boils away (L = {L})?'
      }
    },
    {
      name: 'Ice needed to cool a drink',
      expr: 'mi*(Lf + cW*(Tf - T0)) = m*cW*(T - Tf)', tex: 'm_i\\left(L_f + c_w (T_f - T_0)\\right) = m\\, c_w (T - T_f)', solveFor: 'mi',
      vars: {
        mi: { name: 'mass of ice (starting at 0 °C)', q: 'mass', unit: 'g', tex: 'm_i' },
        Lf: { name: 'latent heat of fusion of water', q: 'latent', unit: 'kJ/kg', value: 334, tex: 'L_f' },
        cW: { const: 'cW' },
        Tf: { name: 'final temperature of the drink', q: 'temperature', unit: '°C', value: 5, tex: 'T_f' },
        T0: { const: 'T0' },
        m: { name: 'mass of the drink', q: 'mass', unit: 'kg', value: 0.3 },
        T: { name: 'starting temperature of the drink', q: 'temperature', unit: '°C', value: 25 }
      },
      note: 'The ice melts, and its meltwater then warms from 0 °C to the final temperature; the drink is treated as water, and the glass and surroundings are ignored.',
      practice: { unknowns: ['mi', 'Tf'] },
      stories: {
        mi: 'How much ice at 0 °C must you add to {m} of lemonade at {T} to bring it down to {Tf}?',
        Tf: 'You drop {mi} of ice at 0 °C into {m} of juice at {T}. What temperature does it settle at once the ice has melted?'
      }
    },
    {
      name: 'Cooling power of sweating',
      expr: 'P = r*Lv', tex: 'P = r\\,L_v',
      vars: {
        P: { name: 'rate of heat removal', q: 'power', unit: 'W' },
        r: { name: 'rate of evaporation', q: 'massflow', unit: 'kg/h', value: 0.5 },
        Lv: { name: 'latent heat of vaporization at skin temperature', q: 'latent', unit: 'MJ/kg', value: 2.42, tex: 'L_v' }
      },
      note: 'Only sweat that actually evaporates cools you; drips carry almost no heat away.',
      stories: { P: 'A cyclist evaporates {r} of sweat. At what rate is heat being removed from her body?', r: 'A runner must shed {P} by sweating alone. How much sweat must evaporate per hour?' }
    }
  ],
  examples: [
    {
      title: 'From ice to steam',
      q: 'How much energy does it take to turn 0.50 kg of ice at −20 °C into steam at 100 °C?',
      steps: [
        'Warm the ice to 0 °C: $0.50 \\times 2100 \\times 20 = 21\\ \\mathrm{kJ}$.',
        'Melt it: $0.50 \\times 334 = 167\\ \\mathrm{kJ}$.',
        'Warm the water to 100 °C: $0.50 \\times 4186 \\times 100 = 209\\ \\mathrm{kJ}$.',
        'Boil it: $0.50 \\times 2256 = 1128\\ \\mathrm{kJ}$.',
        'Total $\\approx 1525\\ \\mathrm{kJ}$, of which boiling alone is 74 %.'
      ],
      a: 'About 1.5 MJ, three quarters of it for boiling'
    },
    {
      title: 'Why steam scalds',
      q: 'Compare the heat delivered to skin (at 37 °C) by 10 g of water at 100 °C and by 10 g of steam at 100 °C.',
      steps: [
        'Water cooling from 100 °C to 37 °C: $0.010 \\times 4186 \\times 63 = 2.6\\ \\mathrm{kJ}$.',
        'Steam first condenses, releasing $0.010 \\times 2256 = 22.6\\ \\mathrm{kJ}$, and then cools like the water: another 2.6 kJ.',
        'Total from steam: 25.2 kJ — nearly ten times as much.'
      ],
      a: 'Steam delivers about 25 kJ, water about 2.6 kJ'
    }
  ],
  quiz: [
    { q: 'A pan of ice and water at 0 °C sits on a hot stove, and there is still some ice left. The temperature of the mixture…', choices: ['rises steadily', 'stays at 0 °C until the ice has melted', 'falls', 'jumps to 100 °C'], a: 1,
      why: 'The heat goes into melting the ice. Only when it has all melted can the temperature rise.' },
    { q: 'Why does steam at 100 °C cause worse burns than boiling water?', choices: ['Steam is hotter', 'Steam releases its latent heat when it condenses on the skin', 'Steam molecules move faster', 'Water cools on contact but steam does not'], a: 1,
      why: 'Both are at 100 °C, but each gram of steam releases 2256 J as it condenses, before any cooling starts.' },
    { q: 'Evaporation can happen only at the boiling point.', a: false,
      why: 'The fastest molecules escape from the surface at any temperature, which is why puddles dry and why sweating cools you.' },
    { q: 'Which takes more energy: melting 1 kg of ice at 0 °C, or warming 1 kg of water from 0 °C to 80 °C?', choices: ['Melting the ice', 'Warming the water', 'About the same', 'It depends on the pressure'], a: 2,
      why: '334 kJ against $1 \\times 4186 \\times 80 = 335$ kJ: almost exactly equal.' },
    { q: 'A pressure cooker cooks vegetables faster because…', choices: ['the steam moves faster', 'the higher pressure raises the boiling point, so the water is hotter', 'pressure breaks down food', 'less water evaporates, so less energy is wasted'], a: 1,
      why: 'At about two atmospheres water boils near 120 °C instead of 100 °C, and cooking rates rise steeply with temperature.' }
  ],
  applications: ['Sweating and panting, the body\'s evaporative cooling.', 'Refrigerators, air conditioners and heat pumps, which move heat by evaporating and condensing a refrigerant.', 'Frost protection of crops by spraying water that releases heat as it freezes.', 'Thermal storage in phase-change materials, and ice packs.'],
  sim: 'heat-heating-curve'
}

);
