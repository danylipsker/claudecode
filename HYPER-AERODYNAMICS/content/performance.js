/* HYPER-AERODYNAMICS · content/performance.js — Flight Performance:
 *   forces-in-flight     the four forces, level flight, thrust and power required, the best speeds,
 *                        load factor, turning flight, the V–n diagram
 *   mission-performance  climb, gliding, range and endurance, Breguet, takeoff and landing,
 *                        ceilings, energy height
 * The example aircraft are used throughout, with the parabolic polar C_D = C_D0 + k C_L²:
 *   light aircraft  1100 kg, 16.2 m², AR 7.5, e 0.8, C_D0 0.03, 119 kW (160 hp) engine
 *   airliner        70 t, 122.6 m², AR 9.5, e 0.8, C_D0 0.02, 2 × 120 kN turbofans
 *   sailplane       400 kg, 10.5 m², AR 21.4, e 0.9, C_D0 0.0086 (best L/D ≈ 42)
 * Simulations: sims/performance.js (perf-*). */
Hyper.add(

/* ================================================================ FORCES IN FLIGHT */
{
  id: 'four-forces', parent: 'forces-in-flight', title: 'The four forces', level: 1,
  short: 'Lift, weight, thrust and drag. In steady flight they balance; in a climb lift carries a little less than the weight and the thrust must carry the rest, so a wing lets a small push hold up a large weight.',
  keywords: ['four forces', 'lift', 'weight', 'thrust', 'drag', 'equilibrium', 'steady flight', 'flight path angle', 'climb angle', 'free-body diagram', 'lift-to-drag ratio', 'thrust-to-weight'],
  prereq: ['lift-equation', 'drag-equation', 'physics:newtons-second-law', 'physics:free-body-diagrams'],
  related: ['level-flight', 'climb-performance', 'gliding', 'lift-to-drag', 'thrust', 'center-of-gravity', 'trim', 'energy-management'],
  body: `
Every aircraft in flight is pushed and pulled by four forces, and nearly all of flight performance is the bookkeeping of how they balance:

- **Weight** $W = mg$ acts straight down through the [[center-of-gravity|centre of gravity]].
- **Lift** $L$ is the part of the aerodynamic force *perpendicular to the oncoming air* — not "upwards". In a climb it tilts back with the flight path; in a turn it tilts sideways with the wings.
- **Drag** $D$ is the part of the aerodynamic force *along* the oncoming air, pointing backwards.
- **Thrust** $T$ comes from the propeller or the engines, roughly along the flight path.

Lift and drag are two components of one aerodynamic force, split by convention relative to the airflow (see [[lift-equation]] and [[drag-equation]]).

### Steady flight is balance
When neither the speed nor the direction of flight changes, [[physics:newtons-first-law|Newton's first law]] says the forces add up to zero. In straight and level flight that gives two short equations:

$$L = W, \\qquad T = D$$

The sizes are very different. A light aircraft of 1100 kg weighs 10.8 kN; at 75 knots its drag is only about 0.86 kN, so the propeller pushes with less than a tenth of the weight. An airliner of 70 t (687 kN) cruising with a lift-to-drag ratio of 17 needs just $687/17 = 40$ kN of thrust. The wing is a lever that lets a small forward push hold up a large weight, and the leverage is the [[lift-to-drag|lift-to-drag ratio]]:

$$T = D = \\frac{W}{L/D}$$

### Climbing and descending
On a path tilted up by the angle $\\gamma$, resolve the forces along and across the path. Across it, lift balances only part of the weight; along it, thrust must overcome drag *and* the component of weight pulling back:

$$L = W\\cos\\gamma, \\qquad T = D + W\\sin\\gamma$$

So in a steady climb lift is slightly **less** than the weight, and it is the thrust that carries the difference — a climb is paid for by the engine, not the wing. For a 5° climb $\\cos\\gamma = 0.996$ and $\\sin\\gamma = 0.087$: the light aircraft needs about 940 N of extra thrust, more than doubling its level-flight thrust. In a glide there is no thrust: the weight component $W\\sin\\gamma$ along the path pulls the aircraft forward against its drag, and $\\tan\\gamma = D/L$ ([[gliding]]).

| Case | Weight | Lift | Drag | Thrust |
|---|---|---|---|---|
| Light aircraft, level, 75 kt | 10.8 kN | 10.8 kN | 0.86 kN | 0.86 kN |
| Light aircraft, 5° climb, 75 kt | 10.8 kN | 10.75 kN | 0.86 kN | 1.80 kN |
| Airliner, cruise, L/D = 17 | 687 kN | 687 kN | 40 kN | 40 kN |
| Sailplane, 1 : 40 glide | 3.9 kN | 3.9 kN | 0.10 kN | 0 |

### When the forces do not balance
If the sums are not zero the aircraft accelerates, $\\sum \\vec F = m\\vec a$ ([[physics:newtons-second-law|Newton's second law]]). Extra thrust in level flight speeds the aircraft up until the growing drag catches it; extra lift curves the path upward, or round a turn when the wings are banked ([[turning-flight]]). The ratio of lift to weight is the [[load-factor|load factor]] the occupants feel.

### Moments too
The forces act at different points — weight at the centre of gravity, lift near the wing's [[center-of-pressure|centre of pressure]], thrust along the engine line, drag spread over the whole aircraft — so they also make pitching moments. The tailplane supplies the small extra force that balances them ([[trim]]); performance calculations fold its effect into the drag.

> [!key] Steady flight: $L = W\\cos\\gamma$ and $T = D + W\\sin\\gamma$. The thrust decides whether the aircraft climbs; the angle of attack, through the lift, decides its speed.
`,
  ideas: [
    'Four forces act on an aircraft: weight (down), lift (across the airflow), drag (along it, backwards) and thrust (along the path).',
    'In steady level flight L = W and T = D; the thrust needed is only W/(L/D), a small fraction of the weight.',
    'In a steady climb L = W cos γ, slightly less than the weight, and T = D + W sin γ: the engine pays for the climb.',
    'In a glide the weight component along the path replaces thrust: tan γ = D/L.',
    'Unbalanced forces accelerate the aircraft — along the path (speed) or across it (a curved path or a turn).'
  ],
  pitfalls: [
    'In a steady climb lift must be larger than weight — It is slightly smaller, L = W cos γ. What holds the aircraft on its rising path is the extra thrust, T = D + W sin γ.',
    'Lift always points straight up — Lift is defined perpendicular to the oncoming air. It tilts back in a climb, forward in a glide and sideways in a banked turn.',
    'To fly, an aircraft needs a thrust equal to its weight — Only a rocket or a hovering helicopter does. A wing turns a small thrust into a large lift: in level flight T = W/(L/D), a tenth to a twentieth of the weight.'
  ],
  formulas: [
    {
      name: 'Thrust in a steady climb',
      expr: 'T = D + m*g*sin(gamma)', tex: 'T = D + m g\\sin\\gamma',
      vars: {
        T: { name: 'thrust', q: 'force', unit: 'kN' },
        D: { name: 'drag at that speed', q: 'force', unit: 'kN', value: 0.86 },
        m: { name: 'aircraft mass', q: 'mass', unit: 'kg', value: 1100 },
        g: { const: 'g' },
        gamma: { name: 'climb angle (flight path angle)', q: 'angle', unit: '°', value: 5, min: -30, max: 30, signed: true, tex: '\\gamma' }
      },
      note: 'Along the flight path, for a steady (unaccelerated) climb or descent with the thrust along the path. A negative angle is a descent; with T = 0 it is a glide.',
      practice: { unknowns: ['T', 'gamma'] },
      stories: {
        T: 'An aircraft of {m} climbs steadily at {gamma}, and its drag at that speed is {D}. How much thrust must the engine give?',
        gamma: 'An aircraft of {m} has {T} of thrust and {D} of drag. At what angle can it climb steadily?'
      }
    },
    {
      name: 'Lift in a steady climb or descent',
      expr: 'L = m*g*cos(gamma)', tex: 'L = m g\\cos\\gamma',
      vars: {
        L: { name: 'lift', q: 'force', unit: 'kN' },
        m: { name: 'aircraft mass', q: 'mass', unit: 'kg', value: 1100 },
        g: { const: 'g' },
        gamma: { name: 'climb or descent angle', q: 'angle', unit: '°', value: 5, min: 0, max: 60, tex: '\\gamma' }
      },
      note: 'Across the flight path. Lift is a little less than the weight in any steady climb or descent; at 5° the difference is only 0.4 %.',
      stories: { L: 'An aircraft of {m} climbs steadily on a path inclined at {gamma}. How much lift does its wing make?' }
    },
    {
      name: 'Thrust for steady level flight',
      expr: 'T = m*g/LD', tex: 'T = \\dfrac{m g}{\\text{L/D}}',
      vars: {
        T: { name: 'thrust (= drag)', q: 'force', unit: 'kN' },
        m: { name: 'aircraft mass', q: 'mass', unit: 't', value: 70 },
        g: { const: 'g' },
        LD: { name: 'lift-to-drag ratio', value: 17, min: 1, max: 80, tex: '\\text{L/D}' }
      },
      note: 'Because L = W and T = D, the thrust is the weight divided by the lift-to-drag ratio at that speed.',
      stories: {
        T: 'An airliner of {m} cruises with a lift-to-drag ratio of {LD}. How much thrust do its engines give together?',
        LD: 'An aircraft of {m} flies level with {T} of thrust. What is its lift-to-drag ratio?'
      }
    }
  ],
  examples: [
    {
      title: 'The thrust of an airliner in cruise',
      q: 'An airliner of 70 t cruises with $L/D = 17$. How much lift and thrust are needed, and how does the thrust compare with the 120 kN each engine gives at takeoff?',
      steps: [
        'Weight: $W = 70\\,000 \\times 9.81 = 686.7$ kN. In level flight the lift equals it.',
        'Thrust equals drag: $T = W/(L/D) = 686.7/17 = 40.4$ kN, about 20 kN per engine.',
        'That is a sixth of the sea-level takeoff thrust: in thin air at 11 km a turbofan gives far less thrust, and the aircraft needs far less.'
      ],
      a: 'Lift 687 kN; thrust about 40 kN in all — only 6 % of the weight.'
    },
    {
      title: 'Paying for a climb',
      q: 'The 1100 kg light aircraft climbs steadily at 5° at 75 kt (38.6 m/s), where its drag is 0.86 kN. Find the lift, the thrust, the thrust power and the rate of climb.',
      steps: [
        'Weight $W = 1100 \\times 9.81 = 10.79$ kN.',
        'Lift: $L = W\\cos 5° = 10.79 \\times 0.9962 = 10.75$ kN — a little less than the weight.',
        'Thrust: $T = D + W\\sin 5° = 0.86 + 10.79 \\times 0.0872 = 0.86 + 0.94 = 1.80$ kN.',
        'Thrust power: $TV = 1800 \\times 38.6 = 69.5$ kW, twice the 33 kW of level flight at this speed.',
        'Rate of climb: $V\\sin\\gamma = 38.6 \\times 0.0872 = 3.36$ m/s, about 660 ft/min.'
      ],
      a: 'L = 10.75 kN, T = 1.80 kN (69.5 kW of thrust power), climbing at 3.4 m/s.'
    }
  ],
  quiz: [
    { q: 'In a steady, straight climb at constant speed, the lift compared with the weight is…', choices: ['slightly smaller', 'exactly equal', 'larger, by the force needed to climb', 'zero — the engine holds the aircraft up'], a: 0,
      why: 'Across the path, L = W cos γ, which is less than W. Along the path the thrust carries the extra, T = D + W sin γ. A steady climb has no acceleration, so no net upward force is needed.' },
    { q: 'An airliner cruising with L/D = 17 needs a thrust of roughly what fraction of its weight?', choices: ['6 %', '17 %', '50 %', '100 %'], a: 0,
      why: 'T = W/(L/D) = W/17 ≈ 0.06 W. The wing turns a small push into a large lift.' },
    { q: 'In steady level flight at high speed, the thrust is larger than the drag — that is what keeps the aircraft moving fast.', a: false,
      why: 'At constant speed the net force is zero, so T = D. Motion needs no net force (Newton\'s first law); thrust larger than drag would make the aircraft accelerate.' },
    { q: 'A 600 kg glider descends steadily with a glide ratio of 30. How large is its drag?', answer: 196, unit: 'N', tol: 0.03,
      why: 'With no thrust, D = W sin γ and tan γ = 1/30, so γ = 1.91° and D = 5886 × 0.0333 = 196 N — about W/30.' },
    { q: 'Flying level, a pilot adds power but holds the same angle of attack, so the airspeed stays the same. What happens?', choices: ['The aircraft climbs: the extra thrust balances W sin γ', 'The aircraft speeds up at the same height', 'Nothing changes: thrust only matters at takeoff', 'The aircraft descends, because the propeller pulls the nose down'], a: 0,
      why: 'Same angle of attack and speed means the same lift and drag. The surplus thrust must then go into T − D = W sin γ: the path tilts upward until the forces balance again.' }
  ],
  problems: [
    { q: 'A 5000 kg aircraft climbs steadily at 8°. Its drag at the climb speed is 3.2 kN. How much thrust does it need?', answer: 10.0, unit: 'kN', tol: 0.02,
      steps: ['$W = 5000 \\times 9.81 = 49.0$ kN; $W\\sin 8° = 49.0 \\times 0.139 = 6.82$ kN.', '$T = D + W\\sin\\gamma = 3.2 + 6.82 = 10.0$ kN.'] },
    { q: 'An aircraft of 2000 kg has a lift-to-drag ratio of 12 at its cruise speed. What thrust does it need in level flight?', answer: 1.63, unit: 'kN', tol: 0.02,
      steps: ['$T = mg/(L/D) = 2000 \\times 9.81/12 = 1635$ N.'] }
  ],
  applications: ['Sizing engines: cruise thrust is weight divided by L/D, while takeoff and climb (with an engine failed, for a twin) usually decide how big the engines must be.', 'Free-body diagrams in flight testing, where thrust and drag are separated by measuring climbs and glides.', 'Climb gradients for obstacle clearance, which follow directly from T − D.'],
  history: 'Sir George Cayley engraved a small silver disc in 1799 showing, on one side, a fixed-wing glider and on the other a diagram splitting the air\'s force on a wing into lift and drag. Separating the lifting surface from the thrust-making machine was the idea that made the aeroplane possible.',
  sim: 'perf-energy'
},

{
  id: 'level-flight', parent: 'forces-in-flight', title: 'Steady level flight', level: 1,
  short: 'In level flight lift equals weight and thrust equals drag. The first condition ties every airspeed to its own lift coefficient and angle of attack; height and weight move the speeds but not the equivalent airspeed.',
  keywords: ['level flight', 'straight and level', 'lift equals weight', 'angle of attack', 'equivalent airspeed', 'EAS', 'true airspeed', 'density ratio', 'step climb', 'cruise climb', 'wing loading'],
  prereq: ['four-forces', 'lift-equation', 'air-density'],
  related: ['power-required', 'airspeeds', 'density-altitude', 'lift-curve', 'minimum-drag-speed', 'breguet-range'],
  body: `
In straight and level flight at constant speed the four forces balance in pairs: lift equals weight, thrust equals drag. The first condition is the one that sets the speed. From the [[lift-equation|lift equation]], $L = \\tfrac12\\rho V^2 S C_L = W$, so every airspeed has its own lift coefficient — and through the [[lift-curve|lift curve]] its own angle of attack:

$$V = \\sqrt{\\frac{2W}{\\rho\\, S\\, C_L}}$$

### Speed and angle of attack go together
The elevator does not directly command speed or height: it sets the wing's angle of attack, and the aircraft settles at the speed where that angle makes lift equal to weight. Slow flight needs a high $C_L$ and a nose-high attitude; fast flight a low $C_L$ and a flat one. For the 1100 kg light aircraft with 16.2 m² of wing at sea level (lift slope about 0.086 per degree, zero-lift angle −2°):

| Airspeed | $C_L$ needed | Wing angle of attack |
|---|---|---|
| 55 kt (28 m/s) | 1.36 | ≈ 14°, close to the stall |
| 70 kt (36 m/s) | 0.84 | ≈ 8° |
| 100 kt (51 m/s) | 0.41 | ≈ 3° |
| 125 kt (64 m/s) | 0.26 | ≈ 1° |

The slowest possible level flight is the stall speed, where $C_L$ reaches $C_{L,\\max}$.

### Height: true and equivalent airspeed
At altitude the air is thinner, so the same $C_L$ needs more true airspeed $V$; what stays the same is the [[dynamic-pressure|dynamic pressure]] $\\tfrac12\\rho V^2$. Aerodynamicists express it as the **equivalent airspeed**, the speed at sea-level density that gives the same dynamic pressure:

$$V_E = V\\sqrt{\\rho/\\rho_0} = V\\sqrt{\\sigma}$$

An aircraft at 100 kt EAS at 3000 m, where the density ratio $\\sigma$ is 0.742, moves through the air at 116 kt. Its airspeed indicator, which senses dynamic pressure, reads close to the EAS (see [[airspeeds]]). That is why stall and approach speeds are the same indicated numbers at every airfield, while the true speeds — and the ground runs — grow at high or hot ones ([[density-altitude]]).

### Weight: slower, or higher, as fuel burns
At a given $C_L$ the level-flight speed goes as $\\sqrt W$. An airliner that burns 8 of its 70 tonnes is 11 % lighter. To keep its best cruise $C_L$ it could fly 6 % slower at the same height — or keep its speed and climb to air 11 % thinner, about 770 m higher. Long-haul flights do the second in **step climbs** of 600 m (2000 ft) as they grow lighter; the ideal would be a slow continuous cruise climb ([[breguet-range]]).

### Two speeds for one throttle setting
Level flight also needs $T = D$. Because drag is high both at low speed (induced drag) and at high speed (parasite drag), one thrust setting usually balances the drag at two speeds: a fast one, and a slow one on the "back side" of the drag curve where slowing down needs *more* thrust. That is the subject of [[power-required]].

> [!tip] A useful picture: the angle of attack sets the speed, and the thrust sets whether the aircraft climbs or descends at that speed. In a real aircraft the two act together, so pilots adjust pitch and power at the same time.
`,
  ideas: [
    'Level flight needs L = W and T = D.',
    'Lift equal to weight gives every airspeed its own lift coefficient and angle of attack: V = √(2W/(ρSC_L)).',
    'Equivalent airspeed V_E = V√σ is the same for the same C_L at any height; true airspeed grows as the air thins.',
    'Level-flight speed at a given C_L goes as √W: a lighter aircraft flies slower, or climbs to thinner air at the same speed.',
    'One thrust setting usually balances the drag at two speeds, one on each side of the minimum-drag speed.'
  ],
  pitfalls: [
    'The elevator controls height and the throttle controls speed — Each affects both. In steady flight the elevator (angle of attack) sets the airspeed, and the thrust decides whether the aircraft climbs or descends at that airspeed.',
    'An aircraft at altitude flies at the same true airspeed for the same wing angle — It flies at the same equivalent (and roughly indicated) airspeed. Its true airspeed is higher by 1/√σ: 16 % at 3000 m, 83 % at 11 000 m.',
    'Burning fuel makes an aircraft faster — At the same angle of attack and height it makes it slower (speed ∝ √W). It only goes faster if the pilot lowers the angle of attack, which moves it away from its best lift-to-drag ratio.'
  ],
  formulas: [
    {
      name: 'Speed for level flight',
      expr: 'V = sqrt(2*m*g/(rho*S*CL))', tex: 'V = \\sqrt{\\dfrac{2\\, m g}{\\rho\\, S\\, C_L}}',
      vars: {
        V: { name: 'true airspeed', q: 'speed', unit: 'kt' },
        m: { name: 'aircraft mass', q: 'mass', unit: 'kg', value: 1100 },
        g: { const: 'g' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        S: { name: 'wing area', q: 'area', unit: 'm²', value: 16.2 },
        CL: { name: 'lift coefficient', value: 0.5, min: 0.02, max: 4, tex: 'C_L' }
      },
      note: 'Lift equals weight. Use the air density at the flight altitude (standard atmosphere or measured); the result is the true airspeed.',
      practice: { unknowns: ['V', 'CL', 'm'] },
      stories: {
        V: 'An aircraft of {m} with {S} of wing flies level at a lift coefficient of {CL} in air of density {rho}. How fast does it fly?',
        CL: 'An aircraft of {m} with a {S} wing flies level at {V} in air of density {rho}. What lift coefficient does it fly at?',
        m: 'A wing of {S} at a lift coefficient of {CL} flies level at {V} in air of density {rho}. What mass does it carry?'
      }
    },
    {
      name: 'Equivalent airspeed',
      expr: 'VE = V*sqrt(rho/rho0)', tex: 'V_E = V\\sqrt{\\dfrac{\\rho}{\\rho_0}}',
      vars: {
        VE: { name: 'equivalent airspeed', q: 'speed', unit: 'kt', tex: 'V_E' },
        V: { name: 'true airspeed', q: 'speed', unit: 'kt', value: 116 },
        rho: { name: 'air density at altitude', q: 'density', unit: 'kg/m³', value: 0.909, tex: '\\rho' },
        rho0: { const: 'rhoSL' }
      },
      note: 'The sea-level speed with the same dynamic pressure. At low Mach numbers an accurate airspeed indicator reads close to the EAS; √(ρ/ρ₀) = √σ is 0.862 at 3000 m and 0.545 at 11 000 m in the standard atmosphere.',
      stories: {
        VE: 'An aircraft flies at {V} true airspeed where the air density is {rho}. What is its equivalent airspeed?',
        V: 'An aircraft flies at an equivalent airspeed of {VE} where the air density is {rho}. What is its true airspeed?'
      }
    }
  ],
  examples: [
    {
      title: 'True and equivalent airspeed at 2000 m',
      q: 'The 1100 kg light aircraft (16.2 m²) cruises at 2000 m, where $\\rho = 1.007\\ \\mathrm{kg/m^3}$, at $C_L = 0.4$. Find its true and equivalent airspeeds.',
      steps: [
        '$V = \\sqrt{2W/(\\rho S C_L)} = \\sqrt{2 \\times 10\\,790/(1.007 \\times 16.2 \\times 0.4)} = \\sqrt{3308} = 57.5$ m/s = 112 kt.',
        '$\\sigma = 1.007/1.225 = 0.822$, $\\sqrt\\sigma = 0.906$.',
        '$V_E = 57.5 \\times 0.906 = 52.1$ m/s = 101 kt — the speed at which the same $C_L$ would be flown at sea level.'
      ],
      a: '112 kt true airspeed, 101 kt equivalent airspeed.'
    },
    {
      title: 'Growing lighter in cruise',
      q: 'An airliner cruises at 11 000 m ($\\rho = 0.364\\ \\mathrm{kg/m^3}$) at its best $C_L$ and Mach 0.78, weighing 70 t. After burning 8 t, to what density — and roughly what height — must it climb to keep the same $C_L$ and true airspeed?',
      steps: [
        'At fixed $C_L$ and $V$, lift $\\propto \\rho$, so $\\rho$ must fall with the weight: $\\rho_1 = 0.364 \\times 62/70 = 0.322\\ \\mathrm{kg/m^3}$.',
        'Above 11 km the temperature is constant (216.65 K) and density falls exponentially with a scale height $RT/g = 287 \\times 216.65/9.81 = 6340$ m.',
        '$\\Delta h = 6340 \\ln(0.364/0.322) = 6340 \\times 0.122 = 770$ m, to about 11 770 m.'
      ],
      a: 'To ρ ≈ 0.322 kg/m³, about 770 m higher — in practice a step climb of 600 m (2000 ft).'
    }
  ],
  quiz: [
    { q: 'At a constant weight, to fly level more slowly the pilot must…', choices: ['raise the angle of attack (higher C_L)', 'lower the angle of attack', 'keep the same angle and reduce power', 'lower the flaps — there is no other way'], a: 0,
      why: 'Lower speed means lower dynamic pressure, so C_L must rise to keep L = W: the nose goes up. Flaps help near the stall but are not needed for moderate slowing.' },
    { q: 'An aircraft flies at 100 kt equivalent airspeed at 3000 m, where σ = 0.742. What is its true airspeed?', answer: 116, unit: 'kt', tol: 0.02,
      why: 'V = V_E/√σ = 100/0.861 = 116 kt.' },
    { q: 'An aircraft that becomes lighter by burning fuel must either slow down or climb if it is to keep the same angle of attack.', a: true,
      why: 'At a fixed C_L, lift ∝ ρV². Less weight needs less lift: lower V at the same height, or lower ρ (higher up) at the same V.' },
    { q: 'If the air density were halved, the true airspeed needed at the same C_L and weight would be multiplied by…', choices: ['√2 ≈ 1.41', '2', '4', '1/√2'], a: 0,
      why: 'V ∝ 1/√ρ; halving ρ multiplies V by √2. The equivalent airspeed is unchanged.' }
  ],
  problems: [
    { q: 'A 600 kg glider has 12 m² of wing. At what speed does it fly level (in a steady glide, nearly the same) at $C_L = 1.0$ at sea level?', answer: 28.3, unit: 'm/s', tol: 0.02,
      steps: ['$V = \\sqrt{2mg/(\\rho S C_L)} = \\sqrt{2 \\times 5886/(1.225 \\times 12 \\times 1.0)}$.', '$= \\sqrt{800.8} = 28.3$ m/s, about 102 km/h.'] },
    { q: 'The same aircraft flies at the same $C_L$ at 3000 m ($\\rho = 0.909\\ \\mathrm{kg/m^3}$). How fast must it fly?', answer: 32.9, unit: 'm/s', tol: 0.02,
      steps: ['$V \\propto 1/\\sqrt\\rho$: $28.3 \\times \\sqrt{1.225/0.909} = 28.3 \\times 1.161 = 32.9$ m/s.'] }
  ],
  applications: ['Cruise planning: choosing a cruise level and speed for the weight, and the step climbs of long flights.', 'Airspeed systems, which display the equivalent (indicated) airspeed that the wing actually feels.', 'Flight testing, where measurements at different heights and weights are reduced to equivalent airspeed and standard weight.'],
  sim: ['perf-drag-curve', 'ref-lift-balance']
},

{
  id: 'power-required', parent: 'forces-in-flight', title: 'Thrust and power required', level: 2,
  short: 'The drag of an aircraft in level flight is the sum of parasite drag, growing as V², and induced drag, falling as 1/V²: a U-shaped curve. Power required is drag times speed. Where the engine\'s available thrust or power crosses these curves lie the maximum speed and the climb.',
  keywords: ['drag curve', 'thrust required', 'power required', 'power available', 'thrust available', 'parasite drag', 'induced drag', 'maximum speed', 'excess power', 'back side of the power curve', 'speed stability', 'drag polar'],
  prereq: ['level-flight', 'drag-polar', 'induced-drag', 'physics:power'],
  related: ['minimum-drag-speed', 'parasite-drag', 'climb-performance', 'propeller-efficiency', 'turbofan', 'oswald-efficiency', 'aspect-ratio', 'ceiling'],
  body: `
To fly level the engine must supply a thrust equal to the drag, and a power equal to drag times speed. Both depend on speed in a characteristic way that is the backbone of aircraft performance.

### The drag curve
Take the parabolic [[drag-polar|drag polar]] $C_D = C_{D,0} + kC_L^2$, where $k = 1/(\\pi e\\,\\mathit{AR})$ contains the [[aspect-ratio|aspect ratio]] and the [[oswald-efficiency|Oswald factor]] $e$, and put in the lift coefficient of level flight, $C_L = 2W/(\\rho V^2 S)$. The drag splits into two parts that pull in opposite directions:

$$D = \\underbrace{\\tfrac12\\rho V^2 S\\,C_{D,0}}_{\\text{parasite}} + \\underbrace{\\frac{2kW^2}{\\rho V^2 S}}_{\\text{induced}}$$

[[parasite-drag|Parasite drag]] — skin friction and form drag — grows with the square of the speed. [[induced-drag|Induced drag]], the price of making lift with a wing of finite span, *falls* with the square of the speed, because a fast wing needs only a small $C_L$. The sum is a U-shaped curve with a minimum in between. For the light aircraft (1100 kg, 16.2 m², $C_{D,0}$ = 0.03, $e$ = 0.8, $\\mathit{AR}$ = 7.5) at sea level:

| Speed | $C_L$ | Parasite drag | Induced drag | Total drag | Power required |
|---|---|---|---|---|---|
| 58 kt (30 m/s) | 1.21 | 268 N | 691 N | 959 N | 28.8 kW |
| 74 kt (38 m/s) | 0.75 | 430 N | 431 N | 861 N | 32.7 kW |
| 97 kt (50 m/s) | 0.43 | 744 N | 249 N | 993 N | 49.7 kW |
| 126 kt (65 m/s) | 0.26 | 1258 N | 147 N | 1405 N | 91.3 kW |

At 58 kt and at 97 kt the thrust needed is almost the same — but the power differs by a factor of 1.7.

### Power required
Power is force times speed, $P = DV$:

$$P = \\tfrac12\\rho V^3 S\\,C_{D,0} + \\frac{2kW^2}{\\rho V S}$$

The parasite part now grows as $V^3$ — doubling the cruise speed of a given aircraft takes roughly eight times the power — and the induced part falls as $1/V$. The bottom of the power curve lies at a lower speed than the bottom of the drag curve ([[minimum-drag-speed]]).

### What the engine can give
Draw the available thrust or power on the same axes. A **jet** gives a thrust that changes little with speed (it falls with height, roughly with the air density), so its available power $TV$ rises with speed. A **piston engine or turboprop with a propeller** gives a roughly constant shaft power; the [[propeller-efficiency|propeller efficiency]] rises from zero at rest to about 0.8 in cruise, so its available thrust is largest at low speed and falls as $\\eta_p P/V$ at high speed.

Where the available curve crosses the required curve on the right is the **maximum level speed**. For the light aircraft, with a 119 kW (160 hp) engine and a propeller efficiency near 0.75, that is about 125 kt at sea level. Between the crossings, the gap between available and required power is the **excess power** that can climb or accelerate the aircraft ([[climb-performance]]).

The airliner (70 t) at 11 000 m and Mach 0.78 (230 m/s) needs about 40 kN of thrust and 9.3 MW of thrust power. Its two engines can give only about 45 kN up there, which is why that height is close to its ceiling at that weight ([[ceiling]]).

### Height and weight move the curves
With height the thrust curve slides to higher true airspeeds without changing its minimum (the same dynamic pressure gives the same drag), while the power curve slides up and to the right by $1/\\sqrt\\sigma$. A heavier aircraft needs more of everything: at the same $C_L$ the drag scales with $W$, the speed with $\\sqrt W$ and the power with $W^{3/2}$.

### The back side of the curve
Below the minimum-power speed, flying slower needs *more* power. There the aircraft is speed-unstable: a small loss of speed increases the power deficit, which costs more speed unless power is added. Aircraft approach to land not far from this region, one reason approach speeds carry a margin above the stall and slow approaches are flown with an active hand on the throttle.

> [!warn] The figures are rounded examples. Speeds, power settings and limits for a real aircraft come from its approved flight manual, and slow flight near the ground is learned with an instructor.
`,
  ideas: [
    'Level-flight drag = parasite drag (∝ V²) + induced drag (∝ 1/V²): a U-shaped curve.',
    'Power required = drag × speed: parasite part ∝ V³, induced part ∝ 1/V; its minimum is at a lower speed than the minimum drag.',
    'A jet gives roughly constant thrust; a propeller aircraft roughly constant power, so its thrust falls with speed.',
    'The right-hand crossing of available and required curves is the maximum level speed; the gap between them is the excess power for climbing.',
    'Below the minimum-power speed ("back side") slower flight needs more power, and speed is unstable.'
  ],
  pitfalls: [
    'Drag always grows with speed — Only parasite drag does. Induced drag falls with speed, so an aircraft flying slowly near the stall can have more total drag than at a moderate cruise speed.',
    'Twice the speed needs twice the power — Well above the minimum-drag speed, drag grows almost as V², so power grows almost as V³: twice the speed takes nearly eight times the power.',
    'Minimum drag and minimum power happen at the same speed — Power is drag times speed, so its minimum lies lower, at about 0.76 of the minimum-drag speed, where induced drag is three times parasite drag.'
  ],
  formulas: [
    {
      name: 'The parabolic drag polar',
      expr: 'CD = CD0 + CL^2/(pi*eo*AR)', tex: 'C_D = C_{D,0} + \\dfrac{C_L^2}{\\pi e\\,\\mathit{AR}}',
      vars: {
        CD: { name: 'drag coefficient', tex: 'C_D' },
        CD0: { name: 'zero-lift (parasite) drag coefficient', value: 0.03, min: 0.003, max: 0.2, tex: 'C_{D,0}' },
        CL: { name: 'lift coefficient', value: 0.5, min: -1.5, max: 3, signed: true, tex: 'C_L' },
        eo: { name: 'Oswald efficiency factor', value: 0.8, min: 0.3, max: 1, tex: 'e' },
        AR: { name: 'aspect ratio', value: 7.5, min: 1, max: 40, tex: '\\mathit{AR}' }
      },
      note: 'A good fit to real aircraft over the normal flying range (away from the stall and the transonic drag rise). k = 1/(πe·AR) is the induced-drag factor.',
      practice: { unknowns: ['CD', 'CL', 'CD0'] },
      stories: {
        CD: 'An aircraft with a zero-lift drag coefficient of {CD0}, aspect ratio {AR} and Oswald factor {eo} flies at a lift coefficient of {CL}. What is its drag coefficient?',
        CL: 'An aircraft with C_D0 = {CD0}, aspect ratio {AR} and e = {eo} flies with a drag coefficient of {CD}. At what lift coefficient?'
      }
    },
    {
      name: 'Drag in level flight',
      expr: 'D = 0.5*rho*V^2*S*CD0 + 2*(m*g)^2/(pi*eo*AR*rho*V^2*S)',
      tex: 'D = \\tfrac12\\rho V^2 S\\,C_{D,0} + \\dfrac{2\\,(m g)^2}{\\pi e\\,\\mathit{AR}\\,\\rho V^2 S}',
      vars: {
        D: { name: 'drag (= thrust required)', q: 'force', unit: 'N' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'true airspeed', q: 'speed', unit: 'm/s', value: 50 },
        S: { name: 'wing area', q: 'area', unit: 'm²', value: 16.2 },
        CD0: { name: 'zero-lift drag coefficient', value: 0.03, min: 0.003, max: 0.2, tex: 'C_{D,0}' },
        m: { name: 'aircraft mass', q: 'mass', unit: 'kg', value: 1100 },
        g: { const: 'g' },
        eo: { name: 'Oswald efficiency factor', value: 0.8, min: 0.3, max: 1, tex: 'e' },
        AR: { name: 'aspect ratio', value: 7.5, min: 1, max: 40, tex: '\\mathit{AR}' }
      },
      note: 'Parasite plus induced drag for L = W with the parabolic polar. Solving for the speed gives two answers — one on each side of the minimum-drag speed.',
      practice: { unknowns: ['D', 'V'] },
      stories: {
        D: 'The light aircraft ({m}, {S}, C_D0 = {CD0}, aspect ratio {AR}, e = {eo}) flies level at {V} in air of density {rho}. What is its drag?',
        V: 'An aircraft of {m} with {S} of wing (C_D0 = {CD0}, aspect ratio {AR}, e = {eo}) has {D} of thrust in air of density {rho}. At what speeds can it fly level?'
      }
    },
    {
      name: 'Power required in level flight',
      expr: 'P = 0.5*rho*V^3*S*CD0 + 2*(m*g)^2/(pi*eo*AR*rho*V*S)',
      tex: 'P = \\tfrac12\\rho V^3 S\\,C_{D,0} + \\dfrac{2\\,(m g)^2}{\\pi e\\,\\mathit{AR}\\,\\rho V S}',
      vars: {
        P: { name: 'power required (thrust power)', q: 'power', unit: 'kW' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'true airspeed', q: 'speed', unit: 'm/s', value: 50 },
        S: { name: 'wing area', q: 'area', unit: 'm²', value: 16.2 },
        CD0: { name: 'zero-lift drag coefficient', value: 0.03, min: 0.003, max: 0.2, tex: 'C_{D,0}' },
        m: { name: 'aircraft mass', q: 'mass', unit: 'kg', value: 1100 },
        g: { const: 'g' },
        eo: { name: 'Oswald efficiency factor', value: 0.8, min: 0.3, max: 1, tex: 'e' },
        AR: { name: 'aspect ratio', value: 7.5, min: 1, max: 40, tex: '\\mathit{AR}' }
      },
      note: 'The power delivered to the air, P = DV. The engine must supply P/η_p at the shaft, where η_p is the propeller efficiency.',
      practice: { unknowns: ['P', 'V'] },
      stories: {
        P: 'How much thrust power does an aircraft of {m} ({S}, C_D0 = {CD0}, aspect ratio {AR}, e = {eo}) need to fly level at {V} in air of density {rho}?',
        V: 'An aircraft of {m} ({S}, C_D0 = {CD0}, aspect ratio {AR}, e = {eo}) has {P} of thrust power available in air of density {rho}. At what speeds can it fly level?'
      }
    }
  ],
  examples: [
    {
      title: 'Same drag, different power',
      q: 'Find the drag and the power required of the 1100 kg light aircraft at sea level at 30 m/s and at 50 m/s.',
      steps: [
        'At 30 m/s: $q = \\tfrac12 \\times 1.225 \\times 30^2 = 551$ Pa; $C_L = 10\\,790/(551 \\times 16.2) = 1.21$.',
        'Parasite $= qSC_{D,0} = 551 \\times 16.2 \\times 0.03 = 268$ N; induced $= qS\\,kC_L^2 = 8930 \\times 0.0531 \\times 1.46 = 691$ N; total 959 N; power $959 \\times 30 = 28.8$ kW.',
        'At 50 m/s: $q = 1531$ Pa, $C_L = 0.435$; parasite 744 N, induced 249 N, total 993 N; power $993 \\times 50 = 49.7$ kW.',
        'Nearly the same thrust, but the slow flight needs only 58 % of the power: it sits on the other side of the drag curve.'
      ],
      a: '959 N and 28.8 kW at 30 m/s; 993 N and 49.7 kW at 50 m/s.'
    },
    {
      title: 'An airliner in cruise',
      q: 'The 70 t airliner (122.6 m², $C_{D,0}$ = 0.02, $e$ = 0.8, $\\mathit{AR}$ = 9.5) cruises at 11 000 m ($\\rho = 0.364\\ \\mathrm{kg/m^3}$) at Mach 0.78, 230 m/s. Find $C_L$, the drag and the thrust power.',
      steps: [
        '$q = \\tfrac12 \\times 0.364 \\times 230.2^2 = 9640$ Pa.',
        '$C_L = W/(qS) = 686\\,700/(9640 \\times 122.6) = 0.581$.',
        '$k = 1/(\\pi \\times 0.8 \\times 9.5) = 0.0419$; $C_D = 0.02 + 0.0419 \\times 0.581^2 = 0.0341$; $L/D = 17.0$.',
        '$D = W/(L/D) = 40.3$ kN; $P = DV = 40.3 \\times 230.2 = 9.3$ MW.'
      ],
      a: 'C_L ≈ 0.58, drag ≈ 40 kN, thrust power ≈ 9.3 MW.'
    }
  ],
  quiz: [
    { q: 'Well above its minimum-drag speed, an aircraft doubles its speed in level flight. Its drag becomes roughly…', choices: ['twice as large', 'four times as large', 'eight times as large', 'the same'], a: 1,
      why: 'At high speed parasite drag dominates and grows as V²: ×4. The power, drag × speed, grows about ×8.' },
    { q: 'The induced drag of an aircraft in level flight is largest when it flies…', choices: ['slowly', 'fast', 'at the minimum-drag speed', 'it does not depend on speed'], a: 0,
      why: 'Induced drag = 2kW²/(ρV²S) ∝ 1/V²: slow flight needs a high C_L, and induced drag grows with C_L².' },
    { q: 'For a propeller aircraft the available thrust is highest at low speed, while for a jet it is nearly the same at all flight speeds.', a: true,
      why: 'A piston engine gives roughly constant power, and thrust = η_p P/V falls with speed. A turbofan\'s thrust changes only moderately with speed.' },
    { q: 'What is the parasite drag of the light aircraft (16.2 m², C_D0 = 0.03) at 60 m/s at sea level?', answer: 1072, unit: 'N', tol: 0.02,
      why: 'D_p = ½ρV²S C_D0 = 0.5 × 1.225 × 3600 × 16.2 × 0.03 = 1072 N.' },
    { q: 'An aircraft flying slowly on the back side of the power curve loses a little speed. With the throttle unchanged it will…', choices: ['keep slowing and start to sink, because slower flight needs more power', 'speed up again by itself', 'hold the new speed exactly', 'climb'], a: 0,
      why: 'On the back side the power required rises as the speed falls, so the deficit grows: the aircraft slows further or sinks until power is added.' }
  ],
  problems: [
    { q: 'How much thrust power does the light aircraft (1100 kg, 16.2 m², C_D0 = 0.03, e = 0.8, AR = 7.5) need at 40 m/s at sea level?', answer: 34.6, unit: 'kW', tol: 0.02,
      steps: ['$q = 980$ Pa, $C_L = 10\\,790/(980 \\times 16.2) = 0.680$, $k = 0.0531$.', '$D = qS(C_{D,0} + kC_L^2) = 15\\,876 \\times (0.03 + 0.0245) = 865$ N.', '$P = 865 \\times 40 = 34.6$ kW.'] }
  ],
  applications: ['Choosing an engine: the maximum speed and climb follow from where available and required power cross.', 'Performance flight testing, which measures the drag curve by timed climbs, descents and level runs.', 'Approach technique, which is shaped by speed instability on the back side of the power curve.'],
  history: 'The Wright brothers worked the problem from both ends in 1903: from their wind-tunnel data they estimated the power their Flyer would need, found no engine maker who could supply a light enough one, and had their mechanic Charlie Taylor build a four-cylinder engine of about 12 horsepower — a few horsepower more than they had calculated.',
  sim: 'perf-drag-curve'
},

{
  id: 'minimum-drag-speed', parent: 'forces-in-flight', title: 'Minimum-drag and minimum-power speeds', level: 2,
  short: 'Drag is least where induced drag equals parasite drag — the speed of the best lift-to-drag ratio. Power is least at 0.76 of that speed, where induced drag is three times parasite drag. These speeds set the best glide, the longest endurance and the longest range.',
  keywords: ['minimum drag speed', 'minimum power speed', 'V_md', 'V_mp', 'best lift-to-drag', 'L/D max', 'best glide speed', 'endurance speed', 'Carson speed', 'optimum lift coefficient'],
  prereq: ['power-required', 'lift-to-drag', 'math:extrema'],
  related: ['gliding', 'range-endurance', 'climb-performance', 'drag-polar', 'oswald-efficiency', 'aspect-ratio', 'critical-mach'],
  body: `
The drag curve and the power curve each have a minimum, and those two speeds — with a third that follows from them — are the most useful numbers in aircraft performance.

### Minimum drag: induced equals parasite
Setting the derivative of the drag with respect to speed to zero gives a neat result: **drag is least where the induced drag equals the parasite drag**, $kC_L^2 = C_{D,0}$. That fixes the lift coefficient, the best [[lift-to-drag|lift-to-drag ratio]] and the speed:

$$C_{L,md} = \\sqrt{\\frac{C_{D,0}}{k}}, \\qquad (L/D)_{\\max} = \\frac12\\sqrt{\\frac{\\pi e\\,\\mathit{AR}}{C_{D,0}}}, \\qquad V_{md} = \\sqrt{\\frac{2W}{\\rho S C_{L,md}}}$$

The maximum L/D depends only on the shape — a span-efficient wing (large $e\\,\\mathit{AR}$) and a clean airframe (small $C_{D,0}$) — and not on weight or height. Weight and density only move the speed at which it is reached, which is why flight manuals give the best-glide speed as an indicated airspeed, adjusted for weight.

### Minimum power: induced three times parasite
Power $DV$ is least where $C_L^{3/2}/C_D$ is greatest. There the induced drag is **three times** the parasite drag, $C_L = \\sqrt3\\,C_{L,md}$, and

$$V_{mp} = 3^{-1/4}\\,V_{md} \\approx 0.76\\,V_{md}, \\qquad (L/D)_{mp} = \\tfrac{\\sqrt3}{2}\\,(L/D)_{\\max} \\approx 0.87\\,(L/D)_{\\max}$$

The power needed there is about 12 % less than at $V_{md}$. A third speed, $3^{1/4}V_{md} \\approx 1.32\\,V_{md}$, where parasite drag is three times induced drag, gives the most speed per unit drag (the largest $V/D$); it is sometimes called **Carson's speed**, "the fastest way to fly for the least extra fuel". There, too, $L/D$ is 0.87 of its maximum.

### The numbers
| | $(L/D)_{\\max}$ | $C_{L,md}$ | $V_{md}$ at sea level | $V_{mp}$ at sea level |
|---|---|---|---|---|
| Light aircraft (1100 kg, AR 7.5, $C_{D,0}$ 0.03) | 12.5 | 0.75 | 38 m/s (74 kt) | 29 m/s (56 kt) |
| Airliner (70 t, AR 9.5, $C_{D,0}$ 0.02) | 17.3 | 0.69 | 115 m/s (224 kt) | 87 m/s (170 kt) |
| Sailplane (400 kg, AR 21.4, $C_{D,0}$ 0.0086) | 42 | 0.72 | 29 m/s (105 km/h) | 22 m/s (80 km/h) |

At 11 000 m the airliner's $V_{md}$ becomes 211 m/s true airspeed, Mach 0.72 — the same equivalent airspeed as 224 kt at sea level. Real jets cruise a little faster, near Mach 0.78, where L/D is still 98 % of its maximum and the flight is shorter; compressibility drag ([[critical-mach]]) stops them going much faster.

### What each speed is for
| Speed | Best for |
|---|---|
| $V_{mp} \\approx 0.76\\,V_{md}$ | least power: longest endurance of a propeller aircraft; minimum sink of a glider |
| $V_{md}$ | least drag: best glide; longest endurance of a jet; best range of a propeller aircraft |
| $\\approx 1.32\\,V_{md}$ | most speed per unit drag: best range of a jet (before compressibility) |

The reasons are in [[range-endurance]]: a jet burns fuel in proportion to thrust, a piston engine in proportion to power. On a real propeller aircraft $V_{mp}$ is so close to the stall, and the propeller so inefficient there, that endurance is flown a little faster.

> [!warn] The best-glide speed and other speeds of a real aircraft are published in its flight manual for its weights and configurations. These formulas explain them; they do not replace them.
`,
  ideas: [
    'Minimum drag occurs where induced drag equals parasite drag; the lift coefficient there is √(C_D0/k).',
    '(L/D)max = ½√(πe·AR/C_D0) depends only on the aircraft\'s shape, not on weight or height.',
    'Minimum power occurs at V_mp = 3^(−1/4) V_md ≈ 0.76 V_md, where induced drag is three times parasite drag.',
    'The most speed per unit drag is at about 1.32 V_md (Carson\'s speed).',
    'All these speeds scale with √(W/ρ): constant equivalent airspeed at any height, higher when heavier.'
  ],
  pitfalls: [
    'A heavier aircraft has a lower best lift-to-drag ratio — The maximum L/D is the same; it is only reached at a higher speed (∝ √W). A heavier glider glides just as far from the same height, only faster.',
    'Minimum drag and minimum power are the same point — Power is drag × speed, so it is least at a lower speed, 0.76 V_md, where L/D is 87 % of its maximum.',
    'Flying faster than V_md always wastes fuel — For a jet the best range is at about 1.32 V_md: 32 % more speed for only 15 % more drag.'
  ],
  formulas: [
    {
      name: 'Minimum-drag speed',
      expr: 'Vmd = sqrt(2*m*g/(rho*S*sqrt(pi*eo*AR*CD0)))',
      tex: 'V_{md} = \\sqrt{\\dfrac{2\\, m g}{\\rho\\, S\\,\\sqrt{\\pi e\\,\\mathit{AR}\\,C_{D,0}}}}',
      vars: {
        Vmd: { name: 'minimum-drag speed (true airspeed)', q: 'speed', unit: 'kt', tex: 'V_{md}' },
        m: { name: 'aircraft mass', q: 'mass', unit: 'kg', value: 1100 },
        g: { const: 'g' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        S: { name: 'wing area', q: 'area', unit: 'm²', value: 16.2 },
        eo: { name: 'Oswald efficiency factor', value: 0.8, min: 0.3, max: 1, tex: 'e' },
        AR: { name: 'aspect ratio', value: 7.5, min: 1, max: 40, tex: '\\mathit{AR}' },
        CD0: { name: 'zero-lift drag coefficient', value: 0.03, min: 0.003, max: 0.2, tex: 'C_{D,0}' }
      },
      note: 'Level flight at C_L,md = √(πe·AR·C_D0), where induced and parasite drag are equal. This is also the best-glide speed.',
      practice: { unknowns: ['Vmd', 'm', 'rho'] },
      stories: {
        Vmd: 'An aircraft of {m} with {S} of wing, aspect ratio {AR}, e = {eo} and C_D0 = {CD0} flies in air of density {rho}. At what speed is its drag least?',
        m: 'An aircraft with {S} of wing (aspect ratio {AR}, e = {eo}, C_D0 = {CD0}) has its minimum drag at {Vmd} in air of density {rho}. What is its mass?'
      }
    },
    {
      name: 'Best lift-to-drag ratio',
      expr: 'LDmax = 0.5*sqrt(pi*eo*AR/CD0)', tex: '\\text{L/D}_{\\max} = \\tfrac12\\sqrt{\\dfrac{\\pi e\\,\\mathit{AR}}{C_{D,0}}}',
      vars: {
        LDmax: { name: 'maximum lift-to-drag ratio', tex: '\\text{L/D}_{\\max}' },
        eo: { name: 'Oswald efficiency factor', value: 0.9, min: 0.3, max: 1, tex: 'e' },
        AR: { name: 'aspect ratio', value: 21.4, min: 1, max: 40, tex: '\\mathit{AR}' },
        CD0: { name: 'zero-lift drag coefficient', value: 0.0086, min: 0.003, max: 0.2, tex: 'C_{D,0}' }
      },
      note: 'For the parabolic polar. The defaults are a 15 m standard-class sailplane.',
      stories: {
        LDmax: 'A sailplane has an aspect ratio of {AR}, an Oswald factor of {eo} and a zero-lift drag coefficient of {CD0}. What is its best glide ratio?',
        CD0: 'A wing of aspect ratio {AR} and Oswald factor {eo} should give a best L/D of {LDmax}. How small must the zero-lift drag coefficient be?'
      }
    },
    {
      name: 'Lift coefficient for minimum drag',
      expr: 'CLmd = sqrt(pi*eo*AR*CD0)', tex: 'C_{L,md} = \\sqrt{\\pi e\\,\\mathit{AR}\\,C_{D,0}}',
      vars: {
        CLmd: { name: 'lift coefficient of minimum drag', tex: 'C_{L,md}' },
        eo: { name: 'Oswald efficiency factor', value: 0.8, min: 0.3, max: 1, tex: 'e' },
        AR: { name: 'aspect ratio', value: 7.5, min: 1, max: 40, tex: '\\mathit{AR}' },
        CD0: { name: 'zero-lift drag coefficient', value: 0.03, min: 0.003, max: 0.2, tex: 'C_{D,0}' }
      },
      note: 'Where k C_L² = C_D0. Minimum power is at √3 times this lift coefficient.',
      stories: { CLmd: 'An aircraft has aspect ratio {AR}, e = {eo} and C_D0 = {CD0}. At what lift coefficient is its drag least?' }
    },
    {
      name: 'Minimum-power speed',
      expr: 'Vmp = Vmd*3^(-1/4)', tex: 'V_{mp} = 3^{-1/4}\\,V_{md} \\approx 0.760\\,V_{md}',
      vars: {
        Vmp: { name: 'minimum-power speed', q: 'speed', unit: 'kt', tex: 'V_{mp}' },
        Vmd: { name: 'minimum-drag speed', q: 'speed', unit: 'kt', value: 74, tex: 'V_{md}' }
      },
      note: 'Same weight and density. This is the speed of minimum sink for a glider and of longest endurance for a propeller aircraft (in the parabolic model).',
      stories: { Vmp: 'An aircraft\'s minimum-drag speed is {Vmd}. At what speed does it need the least power?' }
    }
  ],
  examples: [
    {
      title: 'The light aircraft\'s best speeds',
      q: 'For the 1100 kg light aircraft (16.2 m², $e$ = 0.8, $\\mathit{AR}$ = 7.5, $C_{D,0}$ = 0.03), find $(L/D)_{\\max}$, $V_{md}$ and $V_{mp}$ at sea level and at 3000 m ($\\rho = 0.909\\ \\mathrm{kg/m^3}$).',
      steps: [
        '$\\pi e\\,\\mathit{AR} = 18.85$; $(L/D)_{\\max} = \\tfrac12\\sqrt{18.85/0.03} = 12.5$; $C_{L,md} = \\sqrt{18.85 \\times 0.03} = 0.752$.',
        'Sea level: $V_{md} = \\sqrt{2 \\times 10\\,790/(1.225 \\times 16.2 \\times 0.752)} = 38.0$ m/s = 74 kt; $V_{mp} = 0.76 \\times 74 = 56$ kt.',
        'At 3000 m both grow by $\\sqrt{1.225/0.909} = 1.161$: $V_{md}$ = 86 kt, $V_{mp}$ = 65 kt true airspeed — the same equivalent airspeeds.',
        'The minimum drag, $W/(L/D)_{\\max} = 861$ N, is the same at both heights.'
      ],
      a: 'L/D max 12.5; V_md 74 kt and V_mp 56 kt at sea level, 86 kt and 65 kt (TAS) at 3000 m.'
    },
    {
      title: 'Water ballast in a sailplane',
      q: 'The sailplane (400 kg) has its best glide of 42 at 105 km/h and its minimum sink of 0.61 m/s at 80 km/h. Its pilot adds 100 kg of water. What changes?',
      steps: [
        'Speeds scale with $\\sqrt{W}$: $\\sqrt{500/400} = 1.118$.',
        'Best glide: still 42, now at $105 \\times 1.118 = 117$ km/h.',
        'Minimum sink at $80 \\times 1.118 = 89$ km/h, with a sink rate of $0.61 \\times 1.118 = 0.68$ m/s — the sink rate scales with the speed at a fixed L/D.'
      ],
      a: 'The same glide ratio 12 % faster; minimum sink 0.68 m/s at 89 km/h — better for fast cross-country flights between strong thermals, worse for climbing in weak ones.'
    }
  ],
  quiz: [
    { q: 'At the minimum-drag speed, the induced drag is…', choices: ['equal to the parasite drag', 'three times the parasite drag', 'a third of the parasite drag', 'zero'], a: 0,
      why: 'dD/dV = 0 where the two parts are equal (k C_L² = C_D0). Three times is the minimum-power point.' },
    { q: 'The minimum-power speed of an aircraft is about what fraction of its minimum-drag speed?', choices: ['0.76', '0.87', '1.00', '1.32'], a: 0,
      why: 'V_mp = 3^(−1/4) V_md = 0.760 V_md. (0.87 is the ratio of L/D there to L/D max; 1.32 is Carson\'s speed.)' },
    { q: 'The maximum lift-to-drag ratio of an aircraft depends on its weight.', a: false,
      why: '(L/D)max = ½√(πe·AR/C_D0) contains only the shape. Weight changes the speed at which it is reached, not its value.' },
    { q: 'An aircraft\'s minimum-drag speed is 74 kt at 1100 kg. What is it at 900 kg, at the same height?', answer: 66.9, unit: 'kt', tol: 0.02,
      why: 'V ∝ √W: 74 × √(900/1100) = 74 × 0.905 = 66.9 kt.' },
    { q: 'A glider pilot wants to stay airborne as long as possible in still air. The best speed to fly is…', choices: ['the minimum-sink (minimum-power) speed', 'the best-glide (minimum-drag) speed', 'Carson\'s speed', 'as slow as possible, just above the stall'], a: 0,
      why: 'Staying up longest means the smallest sink rate, which (sink = power / weight) is at the minimum-power speed. Best glide gives the longest distance, not the longest time.' }
  ],
  problems: [
    { q: 'What is the maximum lift-to-drag ratio of a sailplane with aspect ratio 21.4, Oswald factor 0.9 and $C_{D,0}$ = 0.0086?', answer: 41.9, tol: 0.02,
      steps: ['$(L/D)_{\\max} = \\tfrac12\\sqrt{\\pi \\times 0.9 \\times 21.4/0.0086}$', '$= \\tfrac12\\sqrt{7036} = \\tfrac12 \\times 83.9 = 41.9$.'] },
    { q: 'An airliner has $V_{md}$ = 224 kt (equivalent airspeed). What is Carson\'s speed, $3^{1/4}V_{md}$?', answer: 295, unit: 'kt', tol: 0.02,
      steps: ['$3^{1/4} = 1.316$; $1.316 \\times 224 = 295$ kt.'] }
  ],
  applications: ['Best-glide speeds after an engine failure, published in every light-aircraft flight manual.', 'Holding speeds of airliners, flown near the minimum-drag speed to save fuel while waiting.', 'Sailplane design, where aspect ratios over 20 and extremely clean surfaces push (L/D)max beyond 50.', 'Long-endurance drones, which loiter near the minimum-power speed.'],
  history: 'That minimum drag occurs where induced and parasite drag are equal followed from Prandtl\'s lifting-line theory (1918). The "1.32 V_md" optimum was popularised by Bernard Carson in a 1980 paper on the fuel efficiency of small aircraft, which argued that flying a little faster than the best-L/D speed costs very little.',
  sim: { id: 'perf-drag-curve', params: { show: 'P' } }
},

{
  id: 'load-factor', parent: 'forces-in-flight', title: 'Load factor', level: 1,
  short: 'The load factor n is lift divided by weight: the "g" felt by everything on board. Turns, pull-ups and gusts raise it; the structure is designed to limit load factors, and the stall speed grows as √n.',
  keywords: ['load factor', 'g', 'g-force', 'limit load', 'ultimate load', 'accelerated stall', 'pull-up', 'normal category', 'utility category', 'aerobatic category', 'g tolerance'],
  prereq: ['four-forces', 'lift-equation', 'physics:centripetal-force'],
  related: ['turning-flight', 'v-n-diagram', 'stall', 'atmospheric-turbulence', 'spins', 'flight-testing'],
  body: `
The **load factor** $n$ is the lift divided by the weight:

$$n = \\frac{L}{W}$$

In straight and level flight $n = 1$. In a turn or a pull-up the wing must make more lift than the weight, and everything on board — people, fuel, the wing's own structure — is pressed down as if it weighed $n$ times as much. That is the "g" a pilot feels and the number a g-meter shows. Pushing over into a dive gives $n < 1$; $n < 0$ means the load pulls the occupants up out of their seats.

### Where load factor comes from
- **Level turns.** The lift is tilted by the bank angle $\\varphi$ and its vertical part must still carry the weight, so $n = 1/\\cos\\varphi$: 1.15 at 30°, 1.41 at 45°, 2 at 60° ([[turning-flight]]).
- **Pull-ups.** At the bottom of a curved path of radius $r$, lift must supply the weight and the [[physics:centripetal-force|centripetal force]]: $n = 1 + V^2/(gr)$. At the top of a loop, $n = V^2/(gr) - 1$.
- **Gusts.** A vertical gust suddenly changes the angle of attack; at high speed a strong gust can load the aircraft more than any deliberate manoeuvre ([[v-n-diagram]]).

### Load factor and the stall
Lift is limited by $C_{L,\\max}$, so the stall speed grows with the square root of the load factor:

$$V_{s,n} = V_s\\sqrt n$$

A light aircraft that stalls at 52 kt in level flight stalls at 74 kt in a 2 g turn and at 102 kt at 3.8 g. This **accelerated stall** can happen at any speed: a wing stalls at an angle of attack, not at a speed ([[stall]]).

### Load factor and the structure
Aircraft are designed to a **limit load factor**, the largest load expected in service, which must cause no permanent deformation; certification then requires the structure to carry 1.5 times that — the **ultimate load** — for at least three seconds without breaking.

| Aircraft (typical category) | Limit load factors |
|---|---|
| Light aircraft, normal category | +3.8 / −1.52 |
| Utility category | +4.4 / −1.76 |
| Aerobatic category | +6.0 / −3.0 |
| Airliner, flaps up | +2.5 / −1.0 |
| Sailplane, utility | +5.3 / −2.65 |
| Fighter | about +9 / −3 |

For the 1100 kg light aircraft, +3.8 g means the wing must carry 41 kN at the limit and 61.5 kN at ultimate load, from a structure weighing a few hundred kilograms.

### And the people
Seated people tolerate positive g poorly beyond about 4–5 g without training and anti-g equipment: blood drains from the head, vision greys out, and consciousness can be lost. Fighter pilots tense their muscles and wear g-suits to reach 9 g. Negative g is much less tolerable — −2 to −3 g is already very unpleasant.

> [!warn] Load limits and manoeuvring speeds for a real aircraft are in its approved flight manual. Exceeding them, or manoeuvring abruptly near the stall, is dangerous; aerobatics need a suitable aircraft, training and the rules of the air.
`,
  ideas: [
    'Load factor n = L/W; in level flight n = 1.',
    'A level turn at bank φ needs n = 1/cos φ; a pull-up on radius r needs n = 1 + V²/(gr).',
    'The stall speed grows as √n: a wing can stall at any speed if the load factor is high enough.',
    'Structures are designed to a limit load factor (no permanent deformation) with 1.5 times that as the ultimate load.',
    'People tolerate about 4–5 g untrained, 9 g with training and g-suits, and much less negative g.'
  ],
  pitfalls: [
    'A stall happens below a certain speed — It happens above a certain angle of attack. At a load factor n the stall speed is V_s√n: 3.8 g doubles it.',
    'Load factor is the same as acceleration — n is lift over weight. In a steady level turn the aircraft accelerates towards the centre at g·√(n² − 1), not n·g, while the occupants feel n g.',
    'An aircraft that survives its limit load is fine — The limit load is the most the structure may see without permanent damage; loads beyond it may bend or weaken it even if nothing breaks, and the margin to ultimate load is not for routine use.'
  ],
  formulas: [
    {
      name: 'Load factor',
      expr: 'n = L/(m*g)', tex: 'n = \\dfrac{L}{m g}',
      vars: {
        n: { name: 'load factor', min: -10, max: 15, signed: true },
        L: { name: 'lift', q: 'force', unit: 'kN', value: 21.6, signed: true },
        m: { name: 'aircraft mass', q: 'mass', unit: 'kg', value: 1100 },
        g: { const: 'g' }
      },
      note: 'Lift in units of the weight; the "g" the occupants and structure feel.',
      stories: {
        n: 'The wing of an aircraft of {m} is making {L} of lift. What load factor is it pulling?',
        L: 'An aircraft of {m} pulls a load factor of {n}. How much lift does its wing make?'
      }
    },
    {
      name: 'Pull-up at the bottom of a curved path',
      expr: 'n = 1 + V^2/(g*r)', tex: 'n = 1 + \\dfrac{V^2}{g r}',
      vars: {
        n: { name: 'load factor', min: 1, max: 15 },
        V: { name: 'airspeed', q: 'speed', unit: 'kt', value: 110 },
        g: { const: 'g' },
        r: { name: 'radius of the pull-up', q: 'length', unit: 'm', value: 150 }
      },
      note: 'At the lowest point of a vertical circular arc, where lift supplies the weight and the centripetal force.',
      practice: { unknowns: ['n', 'r', 'V'] },
      stories: {
        n: 'An aircraft pulls out of a dive at {V} along an arc of radius {r}. What load factor does the pilot feel at the bottom?',
        r: 'A pilot pulls out of a dive at {V} with a load factor of {n}. What is the radius of the arc?'
      }
    },
    {
      name: 'Stall speed under load',
      expr: 'Vsn = Vs*sqrt(n)', tex: 'V_{s,n} = V_s\\sqrt{n}',
      vars: {
        Vsn: { name: 'stall speed at load factor n', q: 'speed', unit: 'kt', tex: 'V_{s,n}' },
        Vs: { name: 'stall speed in level flight (1 g)', q: 'speed', unit: 'kt', value: 52, tex: 'V_s' },
        n: { name: 'load factor', value: 2, min: 0.01, max: 15 }
      },
      note: 'Same weight, configuration and C_L,max. In a level turn n = 1/cos φ.',
      stories: {
        Vsn: 'An aircraft stalls at {Vs} in level flight. At what speed does it stall while pulling {n} g?',
        n: 'An aircraft that stalls at {Vs} in level flight stalls at {Vsn} in a pull-up. What load factor was it pulling?'
      }
    }
  ],
  examples: [
    {
      title: 'Pulling out of a dive',
      q: 'The light aircraft ($V_s$ = 52 kt at 1 g) pulls out of a dive at 110 kt (56.6 m/s) along an arc of radius 150 m. What load factor does it pull at the bottom, and how close is it to stalling or to its +3.8 limit?',
      steps: [
        '$n = 1 + V^2/(gr) = 1 + 56.6^2/(9.81 \\times 150) = 1 + 3203/1472 = 3.18$.',
        'Stall speed at 3.18 g: $52\\sqrt{3.18} = 52 \\times 1.78 = 93$ kt — below 110 kt, so the wing is not stalled.',
        'The load factor is within the +3.8 limit, but only by 0.6 g; a tighter arc of about 115 m would reach it.'
      ],
      a: 'About 3.2 g: unstalled (stall speed 93 kt), 0.6 g below the limit load factor.'
    },
    {
      title: 'What the wing carries',
      q: 'How much lift must the 1100 kg aircraft\'s wing carry at its limit load factor of +3.8, and at ultimate load?',
      steps: ['Weight: $1100 \\times 9.81 = 10.8$ kN.', 'Limit: $3.8 \\times 10.8 = 41$ kN.', 'Ultimate, 1.5 × limit = 5.7 g: 61.5 kN, without failure for 3 s.'],
      a: '41 kN at the limit, 61.5 kN at ultimate load.'
    }
  ],
  quiz: [
    { q: 'In a level turn at 60° of bank, a 70 kg pilot is pressed into the seat with a force of about…', choices: ['690 N', '1370 N', '1190 N', '2060 N'], a: 1,
      why: 'n = 1/cos 60° = 2, so the seat pushes with 2 × 70 × 9.81 = 1373 N.' },
    { q: 'A wing can stall at a speed well above its published (1 g) stall speed.', a: true,
      why: 'The stall happens at the critical angle of attack. At load factor n the stall speed is V_s√n, so a hard pull at high speed can stall the wing — the accelerated stall.' },
    { q: 'An aircraft stalls at 50 kt in level flight. At what speed does it stall while pulling 3 g?', answer: 86.6, unit: 'kt', tol: 0.02,
      why: 'V = 50 × √3 = 86.6 kt.' },
    { q: 'A normal-category light aircraft has a limit load factor of +3.8. Its ultimate load factor is…', choices: ['3.8', '5.7', '7.6', '4.4'], a: 1,
      why: 'Ultimate = 1.5 × limit = 5.7. (4.4 is the utility category\'s limit.)' },
    { q: 'An aerobatic aircraft goes over the top of a loop at 30 m/s on a circle of 60 m radius. What load factor does the pilot feel at the top?', answer: 0.53, tol: 0.03,
      why: 'At the top lift and weight both point down, towards the centre: n = V²/(gr) − 1 = 900/588.6 − 1 = 0.53. The pilot feels light.' }
  ],
  problems: [
    { q: 'A glider pulls out of a dive at 50 m/s on an arc of radius 100 m. What load factor does it pull at the bottom?', answer: 3.55, tol: 0.02,
      steps: ['$n = 1 + V^2/(gr) = 1 + 2500/981 = 3.55$.'] }
  ],
  applications: ['Structural design and certification of aircraft to their category\'s limit load factors.', 'g-meters and flight-data monitoring, which record over-g events for inspection.', 'Aerobatic and military pilot training in g tolerance.'],
  sim: ['perf-turn', 'perf-vn']
},

{
  id: 'turning-flight', parent: 'forces-in-flight', title: 'Turning flight', level: 2,
  short: 'An aircraft turns by banking: the tilted lift supplies the centripetal force. In a level turn n = 1/cos φ, the radius is V²/(g tan φ) and the rate g tan φ/V — the same for any aircraft at the same speed and bank. The price is more lift, more drag and a higher stall speed.',
  keywords: ['turn', 'bank angle', 'turn radius', 'rate of turn', 'standard rate turn', 'rate one turn', 'coordinated turn', 'corner speed', 'steep turn', 'load factor', 'stall speed in a turn', 'slip', 'skid'],
  prereq: ['load-factor', 'physics:uniform-circular-motion', 'stall'],
  related: ['v-n-diagram', 'control-surfaces', 'spins', 'induced-drag', 'power-required', 'dutch-roll'],
  body: `
An aircraft turns the way a cyclist does: by leaning. Banking the wings tilts the lift, and its sideways part supplies the [[physics:centripetal-force|centripetal force]] that curves the path. In a level, coordinated turn at bank angle $\\varphi$:

$$L\\cos\\varphi = W, \\qquad L\\sin\\varphi = \\frac{mV^2}{r}$$

### The results
Dividing and rearranging gives everything a pilot needs:

$$n = \\frac{1}{\\cos\\varphi}, \\qquad r = \\frac{V^2}{g\\tan\\varphi} = \\frac{V^2}{g\\sqrt{n^2-1}}, \\qquad \\omega = \\frac{V}{r} = \\frac{g\\tan\\varphi}{V}$$

The mass has cancelled: **the radius and rate of a level turn depend only on speed and bank**, not on weight — a sailplane and an airliner at the same speed and bank fly the same circle. What depends on the aircraft is whether it *can*: the wing must make $n$ times the weight in lift without stalling, and the engine must overcome the extra drag.

At 100 kt (51.4 m/s):

| Bank | Load factor $n$ | Stall speed × $\\sqrt n$ | Radius | Rate of turn | Time for 360° |
|---|---|---|---|---|---|
| 15° | 1.04 | × 1.02 | 1010 m | 2.9 °/s | 123 s |
| 30° | 1.15 | × 1.07 | 467 m | 6.3 °/s | 57 s |
| 45° | 1.41 | × 1.19 | 270 m | 10.9 °/s | 33 s |
| 60° | 2.00 | × 1.41 | 156 m | 18.9 °/s | 19 s |
| 75° | 3.86 | × 1.97 | 72 m | 40.8 °/s | 8.8 s |

Beyond about 60° the load factor climbs steeply; a level turn at 90° of bank would need infinite lift.

### The standard-rate turn
Instrument flying uses a **rate-one** turn of 3° per second — a full circle in two minutes. The bank it needs grows with speed, $\\tan\\varphi = \\omega V/g$: about 15° at 100 kt (the rule of thumb is a tenth of the speed in knots plus seven), but 34° at 250 kt. Airliners, which rarely bank beyond 25–30°, therefore turn at about two-thirds of that rate at high speed; a rate-one turn at 250 kt would have a radius of about 2.5 km.

### Turning hard: the corner speed
Slow flight gives a small radius, but the lift available falls with $V^2$; fast flight allows high load factors, but the radius grows with $V^2$. The two limits meet at the **corner speed** — the manoeuvring speed $V_A = V_s\\sqrt{n_{\\max}}$ where the stall curve and the structural limit cross ([[v-n-diagram]]). There the turn is both as tight and as quick as the aircraft allows. For the light aircraft ($V_s$ = 52 kt, $n_{\\max}$ = 3.8) the corner speed is about 102 kt, where a 3.8 g turn has a radius of 76 m and a rate of 39° per second — a circle in 9 s, if the engine could hold the speed.

### The cost of a turn
Induced drag grows with the square of the lift, so with $n^2$. At the minimum-drag speed a 60° bank quadruples the induced drag and multiplies the total drag by 2.5; without more power the aircraft slows or descends. Steep turns are flown with added power and a firm pull.

### Coordination
In a coordinated turn the combination of gravity and the turn's acceleration lies along the aircraft's own vertical axis: the ball of the slip indicator stays centred and a cup of coffee would not spill. Too little rudder and the aircraft slips inwards; too much and it skids outwards. Aileron deflection also causes [[control-surfaces|adverse yaw]] that the rudder must cancel.

> [!warn] A skidding turn close to the stall — typically an overshooting turn onto final approach, low and slow — can drop a wing into a [[spins|spin]] with no height to recover. This page explains the physics; how to fly turns safely comes from an instructor, the aircraft's flight manual and the rules of the air.
`,
  ideas: [
    'Banking tilts the lift; its horizontal part is the centripetal force of the turn.',
    'Level turn: n = 1/cos φ, radius r = V²/(g tan φ) = V²/(g√(n² − 1)), rate ω = g tan φ/V.',
    'Radius and rate depend only on speed and bank, not on the aircraft\'s weight.',
    'The stall speed in a turn is V_s/√cos φ, and induced drag grows with n².',
    'The tightest and fastest turn is at the corner speed V_A = V_s√n_max.'
  ],
  pitfalls: [
    'A heavier aircraft turns in a wider circle — At the same speed and bank the radius V²/(g tan φ) contains no mass. Weight matters only for whether the wing and engine can sustain that bank.',
    'The rudder turns an aircraft — The rudder only keeps the turn coordinated. The turn comes from banking the lift with the ailerons and pulling with the elevator; yawing with the rudder alone gives a skid.',
    'A steep turn is just a gentle turn at more bank — The load factor, the stall speed and the drag all rise sharply: at 60° of bank the stall speed is 41 % higher and the induced drag four times larger.'
  ],
  formulas: [
    {
      name: 'Load factor in a level turn',
      expr: 'n = 1/cos(phi)', tex: 'n = \\dfrac{1}{\\cos\\varphi}',
      vars: {
        n: { name: 'load factor', min: 1, max: 60 },
        phi: { name: 'bank angle', q: 'angle', unit: '°', value: 45, min: 0, max: 89, tex: '\\varphi' }
      },
      note: 'Level, coordinated turn: the vertical part of the lift equals the weight.',
      stories: {
        n: 'What load factor does an aircraft pull in a level turn at {phi} of bank?',
        phi: 'A pilot pulls {n} g in a level turn. At what bank angle?'
      }
    },
    {
      name: 'Radius of a level turn',
      expr: 'r = V^2/(g*sqrt(n^2 - 1))', tex: 'r = \\dfrac{V^2}{g\\sqrt{n^2 - 1}}',
      vars: {
        r: { name: 'turn radius', q: 'length', unit: 'm' },
        V: { name: 'true airspeed', q: 'speed', unit: 'kt', value: 100 },
        g: { const: 'g' },
        n: { name: 'load factor', value: 1.414, min: 1, max: 15 }
      },
      note: 'Equivalent to r = V²/(g tan φ), since tan φ = √(n² − 1). Uses the true airspeed.',
      practice: { unknowns: ['r', 'n', 'V'] },
      stories: {
        r: 'An aircraft turns level at {V} pulling a load factor of {n}. What is the radius of its turn?',
        n: 'An aircraft must turn level at {V} on a circle of radius {r}. What load factor must it pull?',
        V: 'An aircraft turning level at a load factor of {n} flies a circle of radius {r}. How fast is it flying?'
      }
    },
    {
      name: 'Rate of a level turn',
      expr: 'omega = g*tan(phi)/V', tex: '\\omega = \\dfrac{g\\tan\\varphi}{V}',
      vars: {
        omega: { name: 'rate of turn', q: 'angvel', unit: '°/s', tex: '\\omega' },
        g: { const: 'g' },
        phi: { name: 'bank angle', q: 'angle', unit: '°', value: 45, min: 0, max: 89, tex: '\\varphi' },
        V: { name: 'true airspeed', q: 'speed', unit: 'kt', value: 100 }
      },
      note: 'A rate-one (standard-rate) turn is 3 °/s, a full circle in two minutes.',
      practice: { unknowns: ['omega', 'phi'] },
      stories: {
        omega: 'An aircraft turns level at {V} with {phi} of bank. How fast does its heading change?',
        phi: 'What bank angle gives a turn rate of {omega} at {V}?'
      }
    },
    {
      name: 'Stall speed in a level turn',
      expr: 'Vst = Vs/sqrt(cos(phi))', tex: 'V_{s,\\varphi} = \\dfrac{V_s}{\\sqrt{\\cos\\varphi}}',
      vars: {
        Vst: { name: 'stall speed in the turn', q: 'speed', unit: 'kt', tex: 'V_{s,\\varphi}' },
        Vs: { name: 'stall speed in level flight', q: 'speed', unit: 'kt', value: 52, tex: 'V_s' },
        phi: { name: 'bank angle', q: 'angle', unit: '°', value: 45, min: 0, max: 89, tex: '\\varphi' }
      },
      note: 'V_s√n with n = 1/cos φ, for the same weight and configuration.',
      stories: {
        Vst: 'An aircraft stalls at {Vs} in level flight. At what speed does it stall in a level turn at {phi} of bank?',
        phi: 'An aircraft that stalls at {Vs} wings level must not stall above {Vst} in a turn. What is the steepest level bank it can hold at that speed?'
      }
    }
  ],
  examples: [
    {
      title: 'A 45° turn at 100 kt',
      q: 'The light aircraft ($V_s$ = 52 kt) turns level at 100 kt (51.4 m/s) with 45° of bank. Find the load factor, radius, rate of turn, time for a full circle and stall speed.',
      steps: [
        '$n = 1/\\cos 45° = 1.41$.',
        '$r = V^2/(g\\tan\\varphi) = 51.4^2/(9.81 \\times 1) = 270$ m.',
        '$\\omega = g\\tan\\varphi/V = 9.81/51.4 = 0.191$ rad/s = 10.9 °/s; a circle takes $360/10.9 = 33$ s.',
        'Stall speed: $52/\\sqrt{\\cos 45°} = 52 \\times 1.19 = 62$ kt — still a comfortable margin at 100 kt.'
      ],
      a: 'n = 1.41, r ≈ 270 m, 10.9 °/s (33 s per circle), stall speed ≈ 62 kt.'
    },
    {
      title: 'An airliner at 250 kt',
      q: 'What bank would an airliner need for a rate-one turn at 250 kt (128.6 m/s)? If it limits itself to 25°, what are its rate and radius?',
      steps: [
        'Rate one: $\\omega = 3$ °/s = 0.0524 rad/s. $\\tan\\varphi = \\omega V/g = 0.0524 \\times 128.6/9.81 = 0.687$, so $\\varphi = 34.5°$ ($n$ = 1.21), radius $V/\\omega$ = 2.46 km.',
        'At 25°: $\\omega = 9.81 \\times 0.466/128.6 = 0.0356$ rad/s = 2.04 °/s — a circle in 177 s.',
        'Radius: $r = V/\\omega = 128.6/0.0356 = 3.6$ km.'
      ],
      a: '34.5° for rate one; at 25° it turns at 2.0 °/s on a 3.6 km radius.'
    },
    {
      title: 'The tightest turn',
      q: 'For the light aircraft ($V_s$ = 52 kt = 26.9 m/s, $n_{\\max}$ = 3.8), find the corner speed and the radius and rate of a turn there.',
      steps: [
        '$V_A = V_s\\sqrt{n_{\\max}} = 26.9 \\times 1.95 = 52.4$ m/s = 102 kt.',
        '$\\sqrt{n^2 - 1} = \\sqrt{14.44 - 1} = 3.67$ (a bank of 74.7°).',
        '$r = V^2/(g\\sqrt{n^2-1}) = 2746/(9.81 \\times 3.67) = 76$ m; $\\omega = V/r = 0.69$ rad/s = 39 °/s.'
      ],
      a: 'About 102 kt: radius 76 m, 39 °/s — though the drag at 3.8 g is far more than the engine can match, so the speed bleeds away.'
    }
  ],
  quiz: [
    { q: 'A 400 kg sailplane and a 70 t airliner both turn level at 45° of bank and 120 kt. Which flies the smaller circle?', choices: ['the sailplane', 'the airliner', 'they fly the same circle', 'it depends on their wing areas'], a: 2,
      why: 'r = V²/(g tan φ) contains only speed and bank. The airliner\'s wing must make far more lift, but the geometry of the turn is the same.' },
    { q: 'At a fixed bank angle, doubling the airspeed makes the turn…', choices: ['radius twice as large, rate halved', 'radius four times as large, rate halved', 'radius four times as large, rate a quarter', 'unchanged'], a: 1,
      why: 'r ∝ V² (×4) and ω = g tan φ/V ∝ 1/V (×½).' },
    { q: 'What bank angle gives a rate-one turn (3 °/s) at 120 kt?', answer: 18.2, unit: '°', tol: 0.03,
      why: 'tan φ = ωV/g = 0.05236 × 61.7/9.81 = 0.330, φ = 18.2° — close to the rule of thumb 120/10 + 7 = 19°.' },
    { q: 'In a level turn at 60° of bank the stall speed is about 41 % higher than in level flight.', a: true,
      why: 'n = 2, and the stall speed grows as √n = 1.41.' },
    { q: 'To turn through 180° in the shortest time, a pilot should fly…', choices: ['as slowly as possible', 'at the corner (manoeuvring) speed, at the maximum load factor', 'at the maximum level speed', 'at the best-glide speed with 30° of bank'], a: 1,
      why: 'Turn rate = g√(n² − 1)/V. Below the corner speed the stall limits n; above it the structure does, and extra speed only widens the turn. The peak is at the corner.' }
  ],
  problems: [
    { q: 'How long does a full 360° level turn take at 90 kt with 30° of bank?', answer: 51.4, unit: 's', tol: 0.02,
      steps: ['$V = 46.3$ m/s; $\\omega = 9.81 \\tan 30°/46.3 = 0.1223$ rad/s.', '$t = 2\\pi/\\omega = 51.4$ s.'] }
  ],
  applications: ['Instrument procedures, built around rate-one turns and their radii.', 'Airspace and approach design, which must fit the turn radius of fast aircraft.', 'Air combat, where the corner speed and the sustained turn rate decide who gets behind whom.', 'Drone flight controllers, which bank multicopters by the same geometry.'],
  sim: 'perf-turn'
},

{
  id: 'v-n-diagram', parent: 'forces-in-flight', title: 'The V–n diagram', level: 3,
  short: 'The flight envelope on a chart of airspeed against load factor: stall curves on the left, the limit load factors at top and bottom, the dive speed on the right, and the gust lines of rough air. Its corner is the manoeuvring speed.',
  keywords: ['V-n diagram', 'flight envelope', 'manoeuvring speed', 'maneuvering speed', 'V_A', 'V_NE', 'V_NO', 'V_C', 'V_D', 'gust load', 'gust line', 'limit load factor', 'turbulence penetration'],
  prereq: ['load-factor', 'turning-flight', 'stall', 'atmospheric-turbulence'],
  related: ['flutter', 'airspeeds', 'lift-curve', 'dynamic-pressure', 'lift-equation', 'wind-shear'],
  body: `
The **V–n diagram**, or flight envelope, draws on one chart every combination of airspeed and load factor an aircraft is designed for. Equivalent airspeed runs along the bottom, load factor up the side, and the boundary is a fence: inside it the aircraft is safe from both the stall and structural damage; outside it the wing stalls or the structure is overloaded.

### The four edges
- **The stall curves** on the left. The most lift the wing can make at speed $V$ gives the largest load factor $n = \\rho_0 V_E^2 S C_{L,\\max}/(2W) = (V_E/V_s)^2$ — a parabola from the origin through $n = 1$ at the stall speed. The negative side uses the smaller $C_L$ the wing can make upside down. Beyond these curves the aircraft cannot go: the wing stalls first.
- **The limit load factors** at top and bottom — +3.8 and −1.52 for a normal-category light aircraft ([[load-factor]]). Beyond them the structure may be permanently damaged.
- **The design dive speed** $V_D$ on the right: the highest speed shown in flight tests, set by [[flutter]], control forces and structural loads. The never-exceed speed $V_{NE}$ is set at 0.9 $V_D$.

### The corner: manoeuvring speed
The stall curve meets the positive limit at the **manoeuvring speed**

$$V_A = V_s\\sqrt{n_{\\max}}$$

Below it, pulling the stick fully back stalls the wing before it can overload the structure; above it, a full deflection can do damage. For the light aircraft ($V_s$ = 52.3 kt clean at 1100 kg, $n_{\\max}$ = 3.8) $V_A$ is about 102 kt. Because $V_s$ grows with $\\sqrt W$, **a lighter aircraft has a lower $V_A$**: 90 kt at 850 kg. And $V_A$ does not make every control input safe: design rules assume one full deflection on one axis, not rapid reversals or combined inputs.

### Gusts
A vertical gust of speed $U$ meeting an aircraft at speed $V$ suddenly raises its angle of attack by about $U/V$, and its load factor by

$$\\Delta n = \\frac{\\rho_0\\, U_{de}\\, V_E\\, a\\, K_g}{2\\,W/S}$$

where $a$ is the aircraft's lift-curve slope per radian and the gust alleviation factor $K_g$ (about 0.6–0.8) allows for the aircraft starting to rise before the gust is fully felt. The increment grows **linearly with speed** and **inversely with wing loading**. Design rules for light aircraft use derived gusts of 15.24 m/s (50 ft/s) at the design cruising speed $V_C$ and 7.62 m/s (25 ft/s) at $V_D$; these **gust lines** fan out from $n = 1$ at zero speed.

For the light aircraft ($a$ = 4.96 per radian, $K_g \\approx$ 0.65) at $V_C$ = 128 kt, the 15.24 m/s gust gives $\\Delta n \\approx 3.0$ — a load factor of 4.0, beyond the 3.8 manoeuvre limit. For small, lightly loaded aircraft the gust case can be the critical one, and the airspeed indicator's green arc ends at $V_{NO}$, the maximum structural cruising speed, above which the aircraft should be flown only in smooth air. Airliners, with wing loadings of 5000–7000 N/m², feel the same gust far less.

| Speed | Meaning | Light aircraft example |
|---|---|---|
| $V_S$ | stall speed at 1 g | 52 kt |
| $V_A$ | manoeuvring speed | 102 kt at 1100 kg |
| $V_{NO}$ ≈ $V_C$ | maximum structural cruising speed | 128 kt |
| $V_{NE}$ | never exceed (0.9 $V_D$) | 157 kt |
| $V_D$ | design dive speed | 175 kt |

> [!warn] These are illustrative numbers for a generic aircraft. The limits of a real aircraft are its placards, airspeed-indicator markings and approved flight manual; in turbulence, slow to the speed its manual recommends.
`,
  ideas: [
    'The V–n diagram bounds the safe combinations of equivalent airspeed and load factor.',
    'Left edges: the stall curves n = (V/V_s)²; top and bottom: the limit load factors; right edge: the design dive speed V_D.',
    'The manoeuvring (corner) speed V_A = V_s√n_max is where the stall curve meets the limit load; it falls as the aircraft gets lighter.',
    'Gusts add Δn ∝ V/(W/S): at high speed and low wing loading they can exceed the manoeuvre limits.',
    'V_NO bounds cruising in rough air; V_NE = 0.9 V_D is never to be exceeded.'
  ],
  pitfalls: [
    'At or below V_A any control input is safe — V_A protects against a single full deflection on one axis. Repeated or alternating full inputs, or combined inputs, can overload the structure even below V_A.',
    'A lighter aircraft can safely manoeuvre at the heavy-weight V_A — V_A falls with √W. A lighter aircraft reaches its limit load factor at a lower speed, and gusts load it more.',
    'The edges of the envelope are margins to use — They are design limits; the structure\'s reserve beyond them (ultimate load) is a safety factor, not an extension of the envelope.'
  ],
  formulas: [
    {
      name: 'The stall boundary',
      expr: 'n = rho0*VE^2*S*CLmax/(2*m*g)', tex: 'n = \\dfrac{\\rho_0 V_E^2\\, S\\, C_{L,\\max}}{2\\, m g}',
      vars: {
        n: { name: 'largest load factor the wing can reach', min: 0, max: 20 },
        rho0: { const: 'rhoSL' },
        VE: { name: 'equivalent airspeed', q: 'speed', unit: 'kt', value: 80, tex: 'V_E' },
        S: { name: 'wing area', q: 'area', unit: 'm²', value: 16.2 },
        CLmax: { name: 'maximum lift coefficient', value: 1.5, min: 0.1, max: 5, tex: 'C_{L,\\max}' },
        m: { name: 'aircraft mass', q: 'mass', unit: 'kg', value: 1100 },
        g: { const: 'g' }
      },
      note: 'The upper-left edge of the envelope; with equivalent airspeed and sea-level density it holds at any height. It equals (V_E/V_s)².',
      practice: { unknowns: ['n', 'VE'] },
      stories: {
        n: 'An aircraft of {m} with {S} of wing and C_L,max = {CLmax} flies at {VE} (equivalent airspeed). What is the largest load factor it can pull before stalling?',
        VE: 'An aircraft of {m} ({S}, C_L,max = {CLmax}) must be able to pull {n} without stalling. What is the lowest equivalent airspeed at which it can?'
      }
    },
    {
      name: 'Manoeuvring (corner) speed',
      expr: 'VA = Vs*sqrt(nmax)', tex: 'V_A = V_s\\sqrt{n_{\\max}}',
      vars: {
        VA: { name: 'manoeuvring speed', q: 'speed', unit: 'kt', tex: 'V_A' },
        Vs: { name: 'stall speed at 1 g', q: 'speed', unit: 'kt', value: 52, tex: 'V_s' },
        nmax: { name: 'positive limit load factor', value: 3.8, min: 1, max: 12, tex: 'n_{\\max}' }
      },
      note: 'Where the stall curve meets the positive limit load factor. Both V_s and V_A scale with √W.',
      stories: {
        VA: 'An aircraft stalls at {Vs} and has a limit load factor of {nmax}. What is its manoeuvring speed?',
        Vs: 'An aircraft with a limit load factor of {nmax} has a manoeuvring speed of {VA}. What is its 1 g stall speed?'
      }
    },
    {
      name: 'Gust load factor increment',
      expr: 'dn = rho0*U*VE*a*Kg*S/(2*m*g)', tex: '\\Delta n = \\dfrac{\\rho_0\\, U_{de}\\, V_E\\, a\\, K_g\\, S}{2\\, m g}',
      vars: {
        dn: { name: 'load factor increment', signed: true, tex: '\\Delta n' },
        rho0: { const: 'rhoSL' },
        U: { name: 'derived gust velocity (EAS, up positive)', q: 'speed', unit: 'm/s', value: 15.24, signed: true, tex: 'U_{de}' },
        VE: { name: 'equivalent airspeed', q: 'speed', unit: 'kt', value: 128, tex: 'V_E' },
        a: { name: 'lift-curve slope of the aircraft (per radian)', value: 4.96, min: 1, max: 7 },
        Kg: { name: 'gust alleviation factor', value: 0.65, min: 0.1, max: 1, tex: 'K_g' },
        S: { name: 'wing area', q: 'area', unit: 'm²', value: 16.2 },
        m: { name: 'aircraft mass', q: 'mass', unit: 'kg', value: 1100 },
        g: { const: 'g' }
      },
      note: 'The gust formula used for light-aircraft certification; K_g = 0.88μ/(5.3 + μ) with μ = 2(W/S)/(ρ c̄ a g). The gust load factor is 1 + Δn (or 1 − Δn for a down gust).',
      practice: { unknowns: ['dn', 'VE'] },
      stories: {
        dn: 'An aircraft of {m} with {S} of wing (lift slope {a} per radian, K_g = {Kg}) meets an upward gust of {U} at {VE}. By how much does its load factor jump?',
        VE: 'An aircraft of {m} ({S}, lift slope {a} per radian, K_g = {Kg}) must not gain more than {dn} g from a {U} gust. What is the highest speed at which that holds?'
      }
    }
  ],
  examples: [
    {
      title: 'Building the envelope',
      q: 'The light aircraft at 1100 kg stalls at 52.3 kt with the flaps up ($C_{L,\\max}$ = 1.5); upside down its wing reaches $C_L$ = −0.8. Its limits are +3.8 and −1.52. Find the positive and negative corners.',
      steps: [
        'Positive corner: $V_A = 52.3\\sqrt{3.8} = 52.3 \\times 1.95 = 102$ kt.',
        'Negative stall curve: $n = -(V/V_s)^2 \\times 0.8/1.5$. It reaches −1.52 where $(V/V_s)^2 = 1.52 \\times 1.5/0.8 = 2.85$: $V = 52.3 \\times 1.69 = 88$ kt.',
        'So between 102 kt and $V_D$ the full +3.8 is available, and between 88 kt and $V_C$ the full −1.52.'
      ],
      a: 'Positive corner at 102 kt, negative corner at about 88 kt.'
    },
    {
      title: 'A gust at cruising speed',
      q: 'The same aircraft cruises at $V_C$ = 128 kt (65.8 m/s) and meets a 15.24 m/s upward gust. With $a$ = 4.96 per radian and $K_g$ = 0.65, what load factor results?',
      steps: [
        '$\\Delta n = \\rho_0 U V a K_g S/(2mg) = 1.225 \\times 15.24 \\times 65.8 \\times 4.96 \\times 0.65 \\times 16.2/(2 \\times 10\\,790)$.',
        'Numerator: $1.225 \\times 15.24 = 18.67$; $\\times 65.8 = 1228$; $\\times 4.96 = 6093$; $\\times 0.65 = 3960$; $\\times 16.2 = 64\\,160$.',
        '$\\Delta n = 64\\,160/21\\,580 = 2.97$, so $n = 3.97$ — more than the +3.8 manoeuvre limit.'
      ],
      a: 'n ≈ 4.0: the design gust at V_C loads this light aircraft beyond its manoeuvre limit, so the gust case sets the structure.'
    },
    {
      title: 'Lighter is not safer',
      q: 'The aircraft flies solo with little fuel at 850 kg. What are its stall speed and manoeuvring speed, and how does the gust load change?',
      steps: [
        '$V_s \\propto \\sqrt W$: $52.3\\sqrt{850/1100} = 52.3 \\times 0.879 = 46.0$ kt.',
        '$V_A = 46.0\\sqrt{3.8} = 90$ kt, 12 kt lower than at maximum weight.',
        'The gust increment goes as $K_g/W$. The mass ratio $\\mu$ falls with the wing loading, from 15.2 to 11.7, so $K_g$ drops a little, from 0.65 to 0.61: $\\Delta n = 2.97 \\times (1100/850) \\times (0.61/0.65) = 3.6$ at 128 kt — a load factor of about 4.6.'
      ],
      a: 'V_s ≈ 46 kt, V_A ≈ 90 kt; the same gust adds about 20 % more load factor (4.6 g instead of 4.0 g).'
    }
  ],
  quiz: [
    { q: 'Below the manoeuvring speed, a single full pull on the elevator will…', choices: ['stall the wing before the limit load factor is reached', 'always exceed the limit load factor', 'break the tailplane', 'have no effect'], a: 0,
      why: 'Below V_A the stall curve lies under the limit load line: the wing cannot make enough lift to reach n_max.' },
    { q: 'The manoeuvring speed of an aircraft is lower when it is lighter.', a: true,
      why: 'V_A = V_s√n_max and V_s ∝ √W. At lower weight the wing reaches the limit load factor at a lower speed.' },
    { q: 'By how much does the gust load factor increment change if the speed doubles (same gust)?', choices: ['it doubles', 'it quadruples', 'it halves', 'it stays the same'], a: 0,
      why: 'Δn ∝ V: the gust changes the angle of attack by U/V, but the dynamic pressure grows as V², so the lift increment grows as V.' },
    { q: 'An aircraft stalls at 60 kt and has a limit load factor of 4.4. What is its manoeuvring speed?', answer: 125.9, unit: 'kt', tol: 0.02,
      why: 'V_A = 60 × √4.4 = 60 × 2.098 = 125.9 kt.' },
    { q: 'What bounds the right-hand edge of the V–n diagram?', choices: ['the design dive speed V_D, set by flutter, control and structural loads', 'the stall', 'the maximum level speed at full power', 'the speed of sound'], a: 0,
      why: 'V_D is a design and flight-test limit; V_NE = 0.9 V_D. It is usually well above the maximum level speed, reachable in a dive.' }
  ],
  problems: [
    { q: 'An aircraft of 1100 kg (16.2 m², $C_{L,\\max}$ = 1.5) flies at 80 kt equivalent airspeed. What is the largest load factor it can pull?', answer: 2.34, tol: 0.02,
      steps: ['$V_E = 41.2$ m/s; $n = \\rho_0 V_E^2 S C_{L,\\max}/(2mg) = 1.225 \\times 1694 \\times 16.2 \\times 1.5/21\\,580$', '$= 2.34$ — or simply $(80/52.3)^2$.'] }
  ],
  applications: ['Structural design and certification: every load case is a point on or inside the envelope.', 'Airspeed indicator markings — white, green and yellow arcs and the red line — which draw the envelope\'s speeds on the instrument.', 'Turbulence procedures: slowing to the rough-air speed before entering turbulence.'],
  history: 'Load-factor envelopes entered aircraft design codes in the 1920s and 1930s. The gust formula with its alleviation factor comes from NACA work in the early 1950s by Kermit Pratt and colleagues, who fitted a simple rule to thousands of gust loads recorded on airliners in service.',
  sim: 'perf-vn'
},

/* ================================================================ MISSION PERFORMANCE */
{
  id: 'climb-performance', parent: 'mission-performance', title: 'Climb performance', level: 2,
  short: 'An aircraft climbs with whatever the engine gives beyond what level flight needs: the climb angle comes from excess thrust, the rate of climb from excess power. Best angle V_x and best rate V_y, and why both shrink with height, weight and heat.',
  keywords: ['rate of climb', 'climb angle', 'climb gradient', 'excess power', 'excess thrust', 'best rate of climb', 'best angle of climb', 'V_y', 'V_x', 'vertical speed', 'engine failure climb', 'obstacle clearance'],
  prereq: ['power-required', 'four-forces', 'physics:gravitational-potential-energy'],
  related: ['ceiling', 'takeoff-landing', 'density-altitude', 'energy-management', 'minimum-drag-speed', 'propeller-efficiency'],
  body: `
A climb costs energy: lifting a 1100 kg aircraft by one metre stores 10.8 kJ of [[physics:gravitational-potential-energy|potential energy]]. The engine can pay for it only with what is left after the drag has been overcome.

### Climb angle from excess thrust
Along a straight path climbing at angle $\\gamma$, thrust balances drag plus the backward component of the weight ([[four-forces]]):

$$\\sin\\gamma = \\frac{T - D}{W}$$

The climb **gradient** — height gained per distance flown — depends on the *excess thrust* per unit weight. It is what matters for clearing obstacles after takeoff. Transport aircraft are certified to climb at a guaranteed gradient even with an engine failed: at least 2.4 % for a twin in the critical segment after takeoff.

### Rate of climb from excess power
Multiply by the speed and the vertical speed appears:

$$RC = V\\sin\\gamma = \\frac{TV - DV}{W} = \\frac{P_{av} - P_{req}}{W}$$

The rate of climb is the *excess power* per unit weight: every kilowatt left over lifts the aircraft at a definite rate. For the 1100 kg light aircraft at sea level at 78 kt, the 119 kW engine with a propeller efficiency of about 0.61 at that speed gives 72.9 kW of thrust power; level flight needs 34.6 kW, and the 38.3 kW left over lifts 10.8 kN at 3.5 m/s — about 700 ft/min.

### Best angle and best rate
- **$V_x$, best angle**: the speed of the largest excess thrust — the steepest climb over an obstacle.
- **$V_y$, best rate**: the speed of the largest excess power — the most height per minute.

For a jet, whose thrust hardly changes with speed, the largest excess thrust comes where the drag is least, so $V_x \\approx V_{md}$ ([[minimum-drag-speed]]), and $V_y$ is well above it. For a propeller aircraft, whose thrust falls with speed, $V_x$ is lower still — often only 10–15 kt above the stall — and $V_y$ lies near $V_{md}$. Always $V_x < V_y$. The light aircraft of these pages climbs best at about 75–80 kt ($V_y$) and most steeply at about 60 kt ($V_x$).

A jet with plenty of thrust has a $V_y$ faster than it is allowed to fly low down, so airliners climb at a set indicated airspeed (250 kt below 10 000 ft in much of the world) and then at a set Mach number, typically at 1500–3000 ft/min.

### Rate or gradient?
The two are different questions. Air traffic control and time care about the rate; mountains care about the gradient. Climbing at 700 ft/min at 78 kt, the light aircraft gains about 540 ft per nautical mile, a gradient of 8.9 %; into a headwind the rate is unchanged but the gradient over the ground is steeper.

### Height, weight and temperature
Climb performance shrinks with height: the engine gives less power in thin air — a normally aspirated piston engine loses about 30 % by 3000 m — while the power required at the best speed grows. The light aircraft's rate of climb falls from about 700 ft/min at sea level to about 300 ft/min at 3000 m and reaches zero at its absolute [[ceiling]]. A heavier aircraft climbs worse on both counts: more power is required, and the excess lifts a larger weight. Hot air is thin air, so a hot day at a high airfield ([[density-altitude]]) can halve the climb of a light aircraft just when it is most needed.

> [!warn] Climb speeds, gradients and obstacle clearance for a real aircraft come from its approved flight manual and performance charts, corrected for weight, temperature and airfield altitude. The numbers here illustrate the physics.
`,
  ideas: [
    'Climb angle: sin γ = (T − D)/W — excess thrust per unit weight.',
    'Rate of climb: RC = (P_av − P_req)/W — excess power per unit weight.',
    'V_x (best angle) is the speed of maximum excess thrust; V_y (best rate) the speed of maximum excess power; V_x < V_y.',
    'For a jet V_x ≈ V_md; for a propeller aircraft V_y ≈ V_md and V_x is lower.',
    'Height, weight and temperature all reduce the excess power, and with it the climb.'
  ],
  pitfalls: [
    'The best rate of climb also gives the steepest climb — The steepest climb (V_x) is at a lower speed than the fastest climb (V_y). Over an obstacle close ahead, the angle matters, not the rate.',
    'The wing makes the climb — In a steady climb lift is slightly less than weight. The climb is paid for by the excess power of the engine; pulling the nose up without more power only trades speed for a brief climb.',
    'A climb that works at sea level works everywhere — Excess power falls quickly with height and temperature; at a hot, high airfield the same aircraft may climb at half the rate.'
  ],
  formulas: [
    {
      name: 'Rate of climb from excess power',
      expr: 'RC = (Pa - Pr)/(m*g)', tex: '\\mathit{RC} = \\dfrac{P_{av} - P_{req}}{m g}',
      vars: {
        RC: { name: 'rate of climb', q: 'speed', unit: 'ft/min', signed: true, tex: '\\mathit{RC}' },
        Pa: { name: 'thrust power available (after the propeller)', q: 'power', unit: 'kW', value: 72.9, tex: 'P_{av}' },
        Pr: { name: 'power required for level flight at that speed', q: 'power', unit: 'kW', value: 34.6, tex: 'P_{req}' },
        m: { name: 'aircraft mass', q: 'mass', unit: 'kg', value: 1100 },
        g: { const: 'g' }
      },
      note: 'A steady climb at small angles (the power required is taken at level flight, a good approximation below about 15°). A negative result is a descent.',
      practice: { unknowns: ['RC', 'Pa', 'm'] },
      stories: {
        RC: 'An aircraft of {m} has {Pa} of thrust power available at its climb speed, where level flight needs {Pr}. How fast can it climb?',
        Pa: 'An aircraft of {m} must climb at {RC} at a speed where level flight needs {Pr}. How much thrust power must be available?',
        m: 'An aircraft with {Pa} of thrust power available and {Pr} required for level flight climbs at {RC}. What is its mass?'
      }
    },
    {
      name: 'Climb angle from excess thrust',
      expr: 'gamma = asin((T - D)/(m*g))', tex: '\\gamma = \\arcsin\\dfrac{T - D}{m g}',
      vars: {
        gamma: { name: 'climb angle', q: 'angle', unit: '°', min: -30, max: 30, signed: true, tex: '\\gamma' },
        T: { name: 'thrust', q: 'force', unit: 'kN', value: 100 },
        D: { name: 'drag', q: 'force', unit: 'kN', value: 68.7 },
        m: { name: 'aircraft mass', q: 'mass', unit: 't', value: 70 },
        g: { const: 'g' }
      },
      note: 'The climb gradient in per cent is 100 tan γ ≈ 100 (T − D)/W. The defaults: a 70 t twin-jet climbing on one engine after takeoff.',
      practice: { unknowns: ['gamma', 'T'] },
      stories: {
        gamma: 'A twin-jet of {m} has lost an engine after takeoff. The other gives {T} and the drag is {D}. At what angle can it climb?',
        T: 'An aircraft of {m} with {D} of drag must climb at {gamma}. How much thrust does it need?'
      }
    },
    {
      name: 'Rate of climb from speed and angle',
      expr: 'RC = V*sin(gamma)', tex: '\\mathit{RC} = V\\sin\\gamma',
      vars: {
        RC: { name: 'rate of climb', q: 'speed', unit: 'ft/min', signed: true, tex: '\\mathit{RC}' },
        V: { name: 'true airspeed', q: 'speed', unit: 'kt', value: 80 },
        gamma: { name: 'climb angle', q: 'angle', unit: '°', value: 5, min: -30, max: 30, signed: true, tex: '\\gamma' }
      },
      note: 'The vertical component of the velocity.',
      stories: {
        RC: 'An aircraft climbs at {V} on a path inclined at {gamma}. What does its vertical speed indicator show?',
        gamma: 'An aircraft climbs at {RC} at a true airspeed of {V}. What is its climb angle?'
      }
    }
  ],
  examples: [
    {
      title: 'The light aircraft\'s best rate of climb',
      q: 'At 78 kt (40 m/s) at sea level the 1100 kg light aircraft\'s engine delivers 119 kW, its propeller is 61 % efficient, and level flight needs 34.6 kW. What is the rate of climb, and the climb angle?',
      steps: [
        'Thrust power available: $0.612 \\times 119 = 72.9$ kW.',
        'Excess power: $72.9 - 34.6 = 38.3$ kW.',
        '$RC = 38\\,300/10\\,790 = 3.55$ m/s $= 3.55/0.00508 = 699$ ft/min.',
        '$\\sin\\gamma = RC/V = 3.55/40 = 0.089$: $\\gamma = 5.1°$, a gradient of 8.9 %.'
      ],
      a: 'About 700 ft/min (3.5 m/s) at a climb angle of about 5°.'
    },
    {
      title: 'Climbing on one engine',
      q: 'A 70 t twin-jet loses an engine just after takeoff. The remaining engine gives 100 kN; with the gear up and takeoff flaps, the drag at the safety speed is 68.7 kN. Can it meet the 2.4 % minimum gradient?',
      steps: [
        'Excess thrust: $100 - 68.7 = 31.3$ kN; weight $70\\,000 \\times 9.81 = 686.7$ kN.',
        '$\\sin\\gamma = 31.3/686.7 = 0.0456$: $\\gamma = 2.6°$, a gradient of 4.6 %.',
        'That exceeds 2.4 %, with some margin for a hot day or a heavier takeoff.'
      ],
      a: 'Yes: about 4.6 % (2.6°) against the 2.4 % required.'
    }
  ],
  quiz: [
    { q: 'Which speed gives the most height gained per minute?', choices: ['V_y, the speed of maximum excess power', 'V_x, the speed of maximum excess thrust', 'the stall speed', 'the maximum level speed'], a: 0,
      why: 'Rate of climb = excess power / weight, so V_y is where P_av − P_req is greatest. V_x gives the most height per distance.' },
    { q: 'For any aircraft, which is the slower of the two climb speeds?', choices: ['V_x (best angle)', 'V_y (best rate)', 'they are equal', 'it depends on the altitude only'], a: 0,
      why: 'Excess power = excess thrust × V. Going a little faster than the speed of maximum excess thrust always adds more power (the V factor) than it loses, so V_y > V_x. The two meet only at the absolute ceiling.' },
    { q: 'An aircraft of 1000 kg has 20 kW more thrust power available than it needs for level flight. How fast can it climb?', answer: 2.04, unit: 'm/s', tol: 0.02,
      why: 'RC = ΔP/(mg) = 20 000/9807 = 2.04 m/s, about 400 ft/min.' },
    { q: 'With the same engine, a heavier aircraft climbs more slowly.', a: true,
      why: 'It needs more power for level flight (P_req grows about as W^(3/2)) and the excess must lift a larger weight.' },
    { q: 'Why does a jet\'s best climb-angle speed lie near its minimum-drag speed?', choices: ['its thrust hardly changes with speed, so T − D is largest where D is smallest', 'its engines are most efficient there', 'jets must never fly slower than V_md', 'the induced drag is zero there'], a: 0,
      why: 'sin γ = (T − D)/W. With T nearly constant, the maximum of T − D is at the minimum of D.' }
  ],
  problems: [
    { q: 'An aircraft climbs at 80 kt with a flight path angle of 5°. What is its rate of climb in ft/min?', answer: 706, unit: 'ft/min', tol: 0.02,
      steps: ['$V = 80 \\times 0.5144 = 41.2$ m/s; $RC = 41.2 \\sin 5° = 3.59$ m/s.', '$3.59/0.00508 = 706$ ft/min.'] }
  ],
  applications: ['Takeoff performance and obstacle clearance, including climb gradients with an engine failed.', 'Departure procedures, which publish required climb gradients in feet per nautical mile.', 'Engine and propeller selection, often decided by the climb rather than the cruise.'],
  sim: 'perf-climb'
},

{
  id: 'gliding', parent: 'mission-performance', title: 'Gliding flight', level: 1,
  short: 'Without thrust an aircraft glides downhill at an angle whose tangent is D/L: the glide ratio equals the lift-to-drag ratio. Best glide at the minimum-drag speed, least sink at the minimum-power speed, and in wind or sinking air: fly faster.',
  keywords: ['glide', 'glide ratio', 'glide angle', 'sink rate', 'best glide speed', 'minimum sink', 'glide polar', 'speed to fly', 'MacCready', 'water ballast', 'sailplane', 'engine failure'],
  prereq: ['four-forces', 'lift-to-drag', 'minimum-drag-speed'],
  related: ['energy-management', 'thermals-waves', 'bird-flight', 'seeds-gliders', 'wind-gradient', 'drag-polar'],
  body: `
Take the thrust away and an aircraft can still fly steadily — downhill. Gravity provides the push: the component of weight along the path, $W\\sin\\gamma$, balances the drag, while lift balances the rest, $W\\cos\\gamma$. Dividing the two:

$$\\tan\\gamma = \\frac{D}{L} = \\frac{1}{L/D}$$

### Glide ratio is lift-to-drag ratio
In still air the distance covered for each metre of height is the **glide ratio**, and it is exactly the aircraft's [[lift-to-drag|lift-to-drag ratio]]:

$$d = h\\,(L/D)$$

| | Best glide ratio | Glide angle | Distance from 1000 m |
|---|---|---|---|
| Paraglider | ≈ 9 | 6.3° | 9 km |
| Light aircraft, engine idling | ≈ 9–12 | ≈ 5° | 9–12 km |
| Hang glider | ≈ 15 | 3.8° | 15 km |
| Airliner, engines idling | ≈ 17 | 3.4° | 17 km |
| Standard-class sailplane | ≈ 42 | 1.4° | 42 km |
| Open-class sailplane | 60 or more | ≈ 1° | 60 km |

An airliner at 11 km with no engine power can glide about 190 km. It has happened: in 1983 a Boeing 767 that had run out of fuel glided to a landing on a disused runway at Gimli in Canada, and in 2001 an Airbus A330 glided about 120 km to the Azores.

### Best glide and minimum sink
The best glide ratio comes at the minimum-drag speed $V_{md}$ ([[minimum-drag-speed]]). The **sink rate**, $w = V\\sin\\gamma \\approx V/(L/D)$, is least at the lower minimum-power speed $V_{mp} \\approx 0.76\\,V_{md}$ — the speed that keeps a glider up longest, used for circling in a thermal. For the sailplane of these pages (400 kg, 10.5 m²): minimum sink 0.61 m/s at 80 km/h, best glide 42 at 105 km/h, and at 150 km/h a glide ratio of 33 and a sink of 1.3 m/s. A graph of sink rate against airspeed is the **glide polar**; the best glide is where a straight line from the origin just touches it.

### Weight does not change the ratio
A heavier glider glides at the same best ratio, only faster: all its speeds and sink rates scale with $\\sqrt W$. That is why competition sailplanes carry up to 150–200 kg of water ballast on strong days — the same angle at a higher speed covers more ground between thermals — and dump it before landing or when the thermals weaken.

### Wind and sinking air: the speed to fly
What counts is the glide *over the ground*. In a headwind $U$ the ground speed is $V - U$ and the ground glide ratio $(L/D)(V - U)/V$ falls. The best speed is then **higher** than $V_{md}$: draw the tangent to the polar from a point moved along the speed axis by the headwind. In sinking air the tangent starts from a point moved down by the sink, and again the answer is to fly faster, to spend less time in the bad air. With a tailwind, or in rising air, fly slower. Into a 30 km/h headwind the sailplane's best speed rises from 105 to about 115 km/h and its ground glide ratio falls from 42 to about 30.

> [!warn] The glide performance of a real aircraft — its best-glide speed at each weight and how far it can reach — is in its flight manual. After an engine failure pilots follow the manual's procedures, their training and the rules of the air; these numbers explain why those procedures work.
`,
  ideas: [
    'In a steady glide tan γ = D/L: the glide ratio equals the lift-to-drag ratio.',
    'Best glide (greatest distance) at V_md; minimum sink (longest time) at V_mp ≈ 0.76 V_md.',
    'Weight changes the speeds (∝ √W), not the best glide ratio.',
    'Fly faster into a headwind or through sinking air; slower with a tailwind or in rising air.',
    'Glide ratios range from about 9 (paraglider) through 17 (airliner) to 60 (open-class sailplane).'
  ],
  pitfalls: [
    'A heavier glider sinks faster, so it glides less far — It sinks faster but also flies faster, at the same glide ratio. It covers the same distance from the same height, in less time.',
    'Stretching a glide by raising the nose gets you further — Below the best-glide speed the glide ratio gets worse, and near the stall much worse. The furthest glide is at the best-glide speed (faster into a headwind).',
    'Minimum sink speed gives the longest glide — It gives the longest time aloft. The longest distance is at the higher minimum-drag speed.'
  ],
  formulas: [
    {
      name: 'Glide distance in still air',
      expr: 'd = h*LD', tex: 'd = h\\,\\text{L/D}',
      vars: {
        d: { name: 'distance over the ground', q: 'length', unit: 'km' },
        h: { name: 'height to lose', q: 'length', unit: 'm', value: 1000 },
        LD: { name: 'glide ratio (lift-to-drag ratio)', value: 42, min: 1, max: 80, tex: '\\text{L/D}' }
      },
      note: 'Steady glide in still air; the glide ratio is taken at the speed flown.',
      stories: {
        d: 'A sailplane with a glide ratio of {LD} is {h} above the ground. How far can it glide in still air?',
        h: 'An aircraft with a glide ratio of {LD} must reach a field {d} away. How much height does it need?',
        LD: 'An aircraft glides {d} while losing {h}. What is its glide ratio?'
      }
    },
    {
      name: 'Glide angle',
      expr: 'gamma = atan(1/LD)', tex: '\\gamma = \\arctan\\dfrac{1}{\\text{L/D}}',
      vars: {
        gamma: { name: 'glide angle below the horizontal', q: 'angle', unit: '°', min: 0.1, max: 45, tex: '\\gamma' },
        LD: { name: 'glide ratio (lift-to-drag ratio)', value: 17, min: 1, max: 80, tex: '\\text{L/D}' }
      },
      note: 'Relative to the air mass.',
      stories: { gamma: 'An airliner glides with its engines idling at a lift-to-drag ratio of {LD}. How steep is its descent?' }
    },
    {
      name: 'Sink rate',
      expr: 'w = V/LD', tex: 'w = \\dfrac{V}{\\text{L/D}}',
      vars: {
        w: { name: 'sink rate', q: 'speed', unit: 'm/s' },
        V: { name: 'airspeed', q: 'speed', unit: 'km/h', value: 100 },
        LD: { name: 'glide ratio at that speed', value: 42, min: 1, max: 80, tex: '\\text{L/D}' }
      },
      note: 'Small-angle form of w = V sin γ (exact to 0.1 % for glide ratios above 20).',
      stories: {
        w: 'A sailplane flies at {V} with a glide ratio of {LD}. How fast does it sink?',
        LD: 'A glider sinks at {w} while flying at {V}. What is its glide ratio?'
      }
    },
    {
      name: 'Glide over the ground in a wind',
      expr: 'dg = h*LD*(V - Uw)/V', tex: 'd_g = h\\,\\text{L/D}\\,\\dfrac{V - U}{V}',
      vars: {
        dg: { name: 'distance over the ground', q: 'length', unit: 'km', tex: 'd_g' },
        h: { name: 'height to lose', q: 'length', unit: 'm', value: 1000 },
        LD: { name: 'glide ratio at the speed flown', value: 41.7, min: 1, max: 80, tex: '\\text{L/D}' },
        V: { name: 'airspeed', q: 'speed', unit: 'km/h', value: 110 },
        Uw: { name: 'headwind (negative for a tailwind)', q: 'speed', unit: 'km/h', value: 30, min: -100, max: 100, signed: true, tex: 'U' }
      },
      note: 'Steady wind along the track; the ground speed is V − U.',
      practice: { unknowns: ['dg', 'Uw'] },
      stories: {
        dg: 'A sailplane {h} up flies at {V} (glide ratio {LD}) into a headwind of {Uw}. How far over the ground can it glide?',
        Uw: 'A glider {h} up flying at {V} with a glide ratio of {LD} only reaches {dg} over the ground. What is the headwind?'
      }
    }
  ],
  examples: [
    {
      title: 'An airliner with no engines',
      q: 'An airliner at 11 000 m loses all engine power. With a lift-to-drag ratio of 17, how far can it glide in still air, and at what angle?',
      steps: [
        '$d = h(L/D) = 11 \\times 17 = 187$ km.',
        '$\\gamma = \\arctan(1/17) = 3.4°$.',
        'In practice the ratio falls with gear and flaps down, and the crew must also manoeuvre to line up, so the usable distance is less.'
      ],
      a: 'About 190 km at 3.4°.'
    },
    {
      title: 'Into a headwind',
      q: 'The sailplane is 1000 m up, 28 km downwind of its home field, with a 30 km/h headwind on the way home. At 100 km/h its glide ratio is 41.8; at 115 km/h, 41.3. Which speed gets it home?',
      steps: [
        'At 100 km/h: ground ratio $41.8 \\times (100 - 30)/100 = 29.2$ → 29.2 km.',
        'At 115 km/h: $41.3 \\times 85/115 = 30.5$ → 30.5 km.',
        'Both reach 28 km in principle, but faster gives a margin of 2.5 km instead of 1.2 km. Slower than 100 km/h would be worse still: at 80 km/h the ground ratio is only 22.8.'
      ],
      a: 'Fly about 115 km/h: 30.5 km of reach against 29.2 km at the still-air best-glide speed.'
    },
    {
      title: 'Staying up',
      q: 'How long does the sailplane take to descend 1000 m in still air at its minimum-sink speed (80 km/h, 0.61 m/s)?',
      steps: ['$t = h/w = 1000/0.61 = 1640$ s = 27 min.', 'At its best-glide speed (105 km/h, 0.70 m/s) it would take 24 min but go 42 km instead of 36 km.'],
      a: 'About 27 minutes.'
    }
  ],
  quiz: [
    { q: 'A glider pilot adds 100 kg of water ballast. The best glide ratio…', choices: ['stays the same, reached at a higher speed', 'gets better', 'gets worse', 'stays the same, reached at a lower speed'], a: 0,
      why: '(L/D)max depends only on the shape; the speeds for any C_L scale with √W.' },
    { q: 'A tailwind increases the distance a glider covers over the ground from a given height.', a: true,
      why: 'The ground speed is V + U while the time to lose the height is the same, so the ground glide ratio is (L/D)(V + U)/V.' },
    { q: 'An aircraft with a glide ratio of 10 is 2000 m above flat ground. How far can it glide in still air?', answer: 20, unit: 'km', tol: 0.02,
      why: 'd = h × L/D = 2 km × 10 = 20 km.' },
    { q: 'Gliding into a strong headwind, the speed that gives the longest glide over the ground is…', choices: ['faster than the still-air best-glide speed', 'the still-air best-glide speed', 'the minimum-sink speed', 'as slow as possible, to stay up longer'], a: 0,
      why: 'Time spent in the air is time the wind pushes you back. Flying faster cuts that time; the tangent to the polar from the headwind point is at a higher speed.' },
    { q: 'Which is lower, the minimum-sink speed or the best-glide speed?', choices: ['the minimum-sink speed', 'the best-glide speed', 'they are always equal', 'it depends on the wind'], a: 0,
      why: 'Minimum sink is at the minimum-power speed ≈ 0.76 V_md; best glide is at V_md.' }
  ],
  problems: [
    { q: 'A sailplane flies at 150 km/h with a glide ratio of 33. What is its sink rate?', answer: 1.26, unit: 'm/s', tol: 0.02,
      steps: ['$V = 41.7$ m/s; $w = V/(L/D) = 41.7/33 = 1.26$ m/s.'] },
    { q: 'An aircraft with a glide ratio of 12 must reach a field 15 km away in still air. What is the least height it needs?', answer: 1250, unit: 'm', tol: 0.02,
      steps: ['$h = d/(L/D) = 15\\,000/12 = 1250$ m.'] }
  ],
  applications: ['Engine-failure planning: best-glide speed and gliding range from every point of a flight.', 'Cross-country soaring, where speed-to-fly theory decides how fast to fly between thermals.', 'Descent planning of airliners, whose idle descent is a shallow glide.', 'Unpowered drones, gliding seeds and gliding animals.'],
  history: 'Otto Lilienthal made some two thousand glides from hills near Berlin between 1891 and 1896, measuring glide ratios of about 6–8 with his hang gliders. The speed-to-fly theory — fly faster in sink and headwind — was worked out by German glider pilots in the late 1930s and made popular by Paul MacCready\'s speed ring; he used it to win the World Gliding Championships in 1956.',
  sim: 'perf-glide'
},

{
  id: 'range-endurance', parent: 'mission-performance', title: 'Range and endurance', level: 2,
  short: 'Endurance is time aloft per kilogram of fuel, range is distance per kilogram. A jet burns fuel in proportion to thrust, a piston engine in proportion to power, so their best speeds differ: jets stay up longest at V_md and go furthest faster; propeller aircraft go furthest at V_md and stay up longest slower.',
  keywords: ['range', 'endurance', 'specific air range', 'fuel flow', 'specific fuel consumption', 'TSFC', 'best range speed', 'long range cruise', 'holding speed', 'cruise altitude', 'jet stream', 'wind effect on range'],
  prereq: ['minimum-drag-speed', 'tsfc', 'power-required'],
  related: ['breguet-range', 'turbofan', 'turboprop', 'propeller-efficiency', 'level-flight', 'wind-gradient'],
  body: `
Two different questions: **how long** can an aircraft stay up on its fuel (endurance), and **how far** can it go (range)? The first needs the smallest fuel flow; the second the greatest distance per kilogram of fuel, the **specific air range** $V/\\dot m_f$.

### What burns the fuel
- A **jet** burns fuel in proportion to its thrust: $\\dot m_f g = c_T\\,T$, where $c_T$ is the [[tsfc|thrust-specific fuel consumption]] — about 0.55–0.6 per hour for a modern turbofan in cruise. (Engine data quote it as 0.56 lb of fuel per lbf of thrust per hour, or 0.057 kg per newton-hour; per unit *weight* of fuel it is the same number, 0.56 per hour.) In steady flight $T = W/(L/D)$, so the fuel flow is simply
$$\\dot m_f = \\frac{c_T\\,m}{L/D}$$
- A **piston engine** or turboprop burns fuel in proportion to its shaft *power*, about 0.25 kg per kWh for a good piston engine; the propeller turns that power into thrust power with efficiency $\\eta_p$.

### Which speed for which job
| | Longest endurance | Longest range |
|---|---|---|
| Jet (fuel ∝ thrust) | least drag: $V_{md}$ | most speed per drag: ≈ 1.32 $V_{md}$ |
| Propeller (fuel ∝ power) | least power: $V_{mp} \\approx 0.76\\,V_{md}$ | least drag: $V_{md}$ |

For a jet, flying 32 % faster than $V_{md}$ costs only 15 % more drag, so each kilogram of fuel carries it further. Real airliners fly a "long-range cruise" a little faster still (1 % less range for a few per cent more speed), and compressibility caps them near Mach 0.78–0.85.

### Why jets fly high
A jet's range goes as $V(L/D)/c_T$. At a fixed $C_L$ the true airspeed grows as $1/\\sqrt\\sigma$ with height while $L/D$ stays the same and $c_T$ changes little, so a jet gains range by climbing — until its engines run out of thrust or its speed runs into the drag rise. That is why airliners cruise at 10–12 km. A propeller aircraft's range goes as $\\eta_p(L/D)$ and hardly depends on height; it climbs for weather, terrain and true airspeed rather than to save fuel.

### The numbers
The 70 t airliner at 11 000 m and Mach 0.78 (829 km/h), with $L/D$ = 17 and $c_T$ = 0.56 per hour, burns $70\\,000 \\times 0.56/17 \\approx$ 2300 kg of fuel per hour: 0.36 km per kilogram, 2.8 kg per kilometre, shared by some 180 passengers. The light aircraft at 100 kt (185 km/h) needs 52.6 kW of thrust power, 66 kW at the shaft, and burns about 16 kg (23 L) of fuel per hour: 11 km per kilogram. At its minimum-drag speed it would manage 13 km per kilogram.

### Wind
Range over the ground is ground speed divided by fuel flow. Into a headwind the best-range speed rises (less time spent fighting the wind); with a tailwind it falls. Jets can also choose their height and track to use the jet streams, which at 9–12 km often blow at 150–250 km/h in winter — one reason eastbound crossings of the North Atlantic are about an hour shorter than westbound ones.

The fuel burned makes the aircraft lighter, and a lighter aircraft needs less thrust, so range is not simply fuel flow times time: that calculation is the [[breguet-range|Breguet equation]].

> [!warn] Fuel planning for a real flight follows the aircraft's manuals and the regulations, including reserves for diversion and holding. The figures here are rounded illustrations.
`,
  ideas: [
    'Endurance needs the least fuel per hour; range the most distance per kilogram of fuel (specific air range).',
    'A jet\'s fuel flow is c_T m/(L/D); a piston engine\'s is proportional to power.',
    'Jet: endurance at V_md, range near 1.32 V_md. Propeller: endurance at V_mp, range at V_md.',
    'Jets gain range by flying high (more true airspeed at the same L/D); propeller aircraft hardly do.',
    'A headwind raises the best-range speed; a tailwind lowers it.'
  ],
  pitfalls: [
    'The speed for the longest flight time is also the speed for the longest distance — They differ: a slower speed saves fuel per hour but covers less ground per hour. For a jet, range speed is about 1.32 times endurance speed.',
    'Flying higher always saves fuel — For jets it does up to an optimum height set by thrust and compressibility; for piston aircraft the range hardly changes with height, and a long climb itself costs fuel.',
    'Range is fuel flow multiplied by flight time at the start — The aircraft grows lighter as it burns fuel, needing less thrust; the Breguet equation accounts for it with a logarithm.'
  ],
  formulas: [
    {
      name: 'Fuel flow of a jet in steady flight',
      expr: 'mdot = cT*m/LD', tex: '\\dot m_f = \\dfrac{c_T\\, m}{\\text{L/D}}',
      vars: {
        mdot: { name: 'fuel mass flow', q: 'massflow', unit: 'kg/h', tex: '\\dot m_f' },
        cT: { name: 'thrust-specific fuel consumption (fuel weight per thrust per time)', q: 'rate', unit: '1/h', value: 0.56, tex: 'c_T' },
        m: { name: 'aircraft mass', q: 'mass', unit: 't', value: 70 },
        LD: { name: 'lift-to-drag ratio', value: 17, min: 1, max: 80, tex: '\\text{L/D}' }
      },
      note: 'c_T in 1/h is numerically the familiar "lb/(lbf·h)" or "kg/(kgf·h)" figure; per newton it is c_T/g = 0.057 kg/(N·h).',
      stories: {
        mdot: 'An airliner of {m} cruises with a lift-to-drag ratio of {LD}; its engines have a TSFC of {cT}. How much fuel does it burn per hour?',
        LD: 'An aircraft of {m} burns {mdot} of fuel with engines of TSFC {cT}. What lift-to-drag ratio is it flying at?'
      }
    },
    {
      name: 'Endurance of a jet',
      expr: 'E = LD/cT*ln(m0/m1)', tex: 'E = \\dfrac{\\text{L/D}}{c_T}\\,\\ln\\dfrac{m_0}{m_1}',
      vars: {
        E: { name: 'endurance (time aloft)', q: 'time', unit: 'h' },
        LD: { name: 'lift-to-drag ratio', value: 16, min: 1, max: 80, tex: '\\text{L/D}' },
        cT: { name: 'thrust-specific fuel consumption', q: 'rate', unit: '1/h', value: 0.56, tex: 'c_T' },
        m0: { name: 'mass at the start', q: 'mass', unit: 't', value: 70, tex: 'm_0' },
        m1: { name: 'mass at the end', q: 'mass', unit: 't', value: 60, tex: 'm_1' }
      },
      note: 'At constant L/D and c_T; longest at (L/D)max, the minimum-drag speed.',
      practice: { unknowns: ['E', 'm1'] },
      stories: {
        E: 'An airliner holds at a lift-to-drag ratio of {LD} with engines of TSFC {cT}, burning down from {m0} to {m1}. How long can it hold?',
        m1: 'An aircraft of {m0} must hold for {E} at a lift-to-drag ratio of {LD} (TSFC {cT}). What will it weigh at the end?'
      }
    },
    {
      name: 'Best-range speed of a jet (parabolic polar)',
      expr: 'Vbr = 3^(1/4)*Vmd', tex: 'V_{br} = 3^{1/4}\\,V_{md} \\approx 1.316\\,V_{md}',
      vars: {
        Vbr: { name: 'best-range speed', q: 'speed', unit: 'kt', tex: 'V_{br}' },
        Vmd: { name: 'minimum-drag speed', q: 'speed', unit: 'kt', value: 224, tex: 'V_{md}' }
      },
      note: 'Maximum V/D (Carson\'s speed), ignoring compressibility, which in practice limits airliners to below about Mach 0.85.',
      stories: { Vbr: 'A jet has a minimum-drag speed of {Vmd}. At what speed does it fly furthest per kilogram of fuel?' }
    }
  ],
  examples: [
    {
      title: 'An airliner\'s fuel burn',
      q: 'The 70 t airliner cruises at 829 km/h with $L/D$ = 17; its engines have $c_T$ = 0.56 per hour. Find its fuel flow and specific air range.',
      steps: [
        '$\\dot m_f = c_T m/(L/D) = 0.56 \\times 70\\,000/17 = 2306$ kg/h.',
        'Specific air range: $829/2306 = 0.36$ km/kg; its inverse is 2.8 kg per km.',
        'Per passenger (180 seats): about 16 g of fuel per kilometre, or 2 L per 100 km.'
      ],
      a: 'About 2300 kg/h — 0.36 km per kg of fuel.'
    },
    {
      title: 'Loiter or go?',
      q: 'The light aircraft at sea level needs 28.7 kW of thrust power at $V_{mp}$ = 104 km/h and 32.7 kW at $V_{md}$ = 137 km/h. With a propeller efficiency of 0.8 and 0.25 kg of fuel per kWh, compare fuel per hour and per kilometre.',
      steps: [
        'At $V_{mp}$: shaft power $28.7/0.8 = 35.9$ kW; fuel $0.25 \\times 35.9 = 9.0$ kg/h; $104/9.0 = 11.6$ km/kg.',
        'At $V_{md}$: shaft $40.9$ kW; fuel 10.2 kg/h; $137/10.2 = 13.4$ km/kg.',
        '$V_{mp}$ burns least per hour (endurance); $V_{md}$ goes furthest per kilogram (range).'
      ],
      a: 'Endurance: 9.0 kg/h at V_mp. Range: 13.4 km/kg at V_md, 15 % better than at V_mp.'
    }
  ],
  quiz: [
    { q: 'A jet told to hold while waiting to land should fly at about…', choices: ['its minimum-drag speed', 'its minimum-power speed', '1.32 times its minimum-drag speed', 'its maximum speed'], a: 0,
      why: 'A jet\'s fuel flow is proportional to thrust = drag; least drag means least fuel per hour. Holding speeds are set close to V_md.' },
    { q: 'For a propeller aircraft, the speed of maximum range is…', choices: ['the minimum-drag speed', 'the minimum-power speed', 'Carson\'s speed', 'the maximum level speed'], a: 0,
      why: 'Fuel ∝ power, so fuel per distance ∝ power/speed = drag. Least drag, most range.' },
    { q: 'A jet gains range by cruising high, while the best range of a piston aircraft hardly depends on altitude.', a: true,
      why: 'Jet range ∝ V(L/D)/c_T and V grows with height at fixed C_L; propeller range ∝ η_p(L/D)/BSFC with no speed in it.' },
    { q: 'A 200 t jet cruises with L/D = 19 on engines of c_T = 0.52 per hour. What is its fuel flow?', answer: 5474, unit: 'kg/h', tol: 0.02,
      why: 'ṁ = c_T m/(L/D) = 0.52 × 200 000/19 = 5474 kg/h.' },
    { q: 'With a strong headwind, the speed for the best range over the ground…', choices: ['increases', 'decreases', 'stays the same', 'becomes the minimum-power speed'], a: 0,
      why: 'Ground range per kilogram is (V − U)/ṁ. The tangent from the headwind point on the speed axis touches the fuel-flow curve at a higher speed.' }
  ],
  problems: [
    { q: 'An airliner holds at L/D = 16 with $c_T$ = 0.56 per hour, burning down from 70 t to 60 t. How long can it hold?', answer: 4.40, unit: 'h', tol: 0.02,
      steps: ['$E = (L/D)/c_T \\cdot \\ln(m_0/m_1) = 16/0.56 \\times \\ln(70/60)$.', '$= 28.57 \\times 0.1542 = 4.40$ h.'] }
  ],
  applications: ['Cost-index and long-range-cruise speeds in airline flight management systems.', 'Holding patterns, flown near the minimum-drag speed.', 'Search, patrol and surveillance aircraft and drones, designed for endurance at low speed.', 'Choosing tracks across oceans to ride the jet streams.'],
  history: 'Charles Lindbergh\'s Spirit of St. Louis (1927) took off for Paris with about 450 US gallons of fuel — more than half its takeoff weight — and he throttled back to the slow, fuel-saving speeds that range theory recommends as the aircraft grew lighter, arriving after 5800 km with fuel to spare.',
  sim: ['perf-breguet', { id: 'perf-drag-curve', params: { craft: 'jet' } }]
},

{
  id: 'breguet-range', parent: 'mission-performance', title: 'The Breguet range equation', level: 3,
  short: 'Range = speed × L/D ÷ fuel consumption × ln(start mass / end mass). Aerodynamics, engine and structure multiply; the logarithm is the price of carrying the fuel you will burn. One form with the overall efficiency covers jets and propellers alike.',
  keywords: ['Breguet', 'range equation', 'range factor', 'fuel fraction', 'TSFC', 'overall efficiency', 'lower heating value', 'cruise climb', 'step climb', 'logarithm', 'electric aircraft range'],
  prereq: ['range-endurance', 'math:integration', 'math:logarithms'],
  related: ['tsfc', 'turbofan', 'electric-propulsion', 'lift-to-drag', 'rocket-propulsion', 'level-flight'],
  body: `
An aircraft that burns fuel becomes lighter, so as the flight goes on it needs less lift, less thrust and less fuel per hour. Adding up that shrinking fuel flow gives one of the central results of aeronautics, the **Breguet range equation**.

### The jet
A jet in steady cruise needs a thrust $T = W/(L/D)$ and burns fuel weight at the rate $c_T T$ ([[range-endurance]]). Its weight therefore falls as

$$\\frac{dW}{dt} = -\\,c_T\\,\\frac{W}{L/D}$$

while it covers ground at $dR/dt = V$. Dividing one by the other and integrating from the start weight $W_0$ to the end weight $W_1$, with $V$, $L/D$ and $c_T$ held constant:

$$R = \\frac{V}{c_T}\\,\\frac{L}{D}\\,\\ln\\frac{W_0}{W_1} = \\frac{V}{g\\,c}\\,\\frac{L}{D}\\,\\ln\\frac{W_0}{W_1}$$

where $c = c_T/g$ is the fuel consumption in kilograms per newton-second. Three groups multiply:

- $V(L/D)$ — the aerodynamics: speed times efficiency;
- $1/c_T$ — the engine;
- $\\ln(W_0/W_1)$ — the structure and the fuel load: how much of the takeoff mass is fuel.

The product $V(L/D)/c_T$ is the **range factor**. For the airliner at Mach 0.78 (829 km/h), $L/D$ = 17 and $c_T$ = 0.56 per hour it is about 25 000 km, and burning 10 t of fuel from 70 t gives $25\\,170 \\times \\ln(70/60) \\approx$ 3880 km of cruise.

### One formula for every engine
Write the engine as an efficiency: the useful propulsive power $TV$ is a fraction $\\eta_0$, the **overall efficiency**, of the heat released by the fuel, $\\dot m_f\\,LHV$, where the lower heating value of kerosene is about 43 MJ/kg. Then $V/c_T = \\eta_0\\,LHV/g$ and

$$R = \\eta_0\\,\\frac{LHV}{g}\\,\\frac{L}{D}\\,\\ln\\frac{m_0}{m_1}$$

$LHV/g \\approx$ 4400 km is the height to which a kilogram of kerosene could lift itself if all its heat became work. A modern turbofan in cruise reaches $\\eta_0 \\approx$ 0.34–0.40, against about 0.2 for the first jets; 0.34 reproduces the 3900 km above. For a **propeller aircraft** the engine's shaft work per kilogram of fuel, $E_f$ (4 kWh/kg for a fuel consumption of 0.25 kg/kWh), and the propeller efficiency give

$$R = \\eta_p\\,\\frac{E_f}{g}\\,\\frac{L}{D}\\,\\ln\\frac{m_0}{m_1}$$

The speed has vanished: a propeller aircraft's range depends on how efficiently it flies, not how fast.

### The logarithm
Range grows only with the *logarithm* of the mass ratio, because the fuel for the far end of the trip must itself be carried from the start. With a range factor of 25 000 km:

| Cruise distance | Fuel as a share of the starting mass |
|---|---|
| 2 000 km | 7.6 % |
| 5 000 km | 18 % |
| 10 000 km | 33 % |
| 15 000 km | 45 % |

The longest airline flights take off with close to half their mass in fuel. Doubling the fuel does not double the range; halving $c_T$ or doubling $L/D$ does. The same logarithm, for the same reason, is in the [[rocket-propulsion|rocket equation]].

### Assumptions
Constant $V$, $L/D$ and $c_T$ mean a constant $C_L$, so as the weight falls the density must fall with it: the aircraft drifts upward in a **cruise climb** ([[level-flight]]). Air traffic control prefers constant levels, and airliners approximate the cruise climb by step climbs. Taxi, climb, descent and reserves come on top. For a battery-electric aircraft the mass does not change and the logarithm disappears: $R = \\eta\\,(e_b/g)(L/D)(m_b/m)$, with a battery energy $e_b$ of about 0.25 kWh/kg against 12 kWh/kg for kerosene ([[electric-propulsion]]).
`,
  ideas: [
    'Jet range: R = (V/c_T)(L/D) ln(W₀/W₁) — aerodynamics × engine × structure.',
    'The range factor V(L/D)/c_T is about 25 000 km for a modern airliner.',
    'With the overall efficiency, R = η₀ (LHV/g)(L/D) ln(m₀/m₁) for any engine; for propellers the speed drops out.',
    'Range grows with the logarithm of the mass ratio: very long flights need nearly half their mass in fuel.',
    'Constant V, L/D and c_T imply a cruise climb; batteries, whose mass does not change, give a linear law.'
  ],
  pitfalls: [
    'Twice the fuel gives twice the range — The fuel must carry itself: with the same aircraft and payload, doubling the cruise fuel from 10 % to 20 % of the dry mass raises the range by about 1.9 times, and the gain shrinks as the fuel load grows.',
    'Flying faster always shortens a jet\'s range — In the Breguet equation for a jet, speed multiplies the range at a given L/D and c_T. Faster costs range only when it lowers L/D (above the best-range speed) or raises c_T.',
    'The Breguet equation includes the whole trip — It covers the cruise at constant conditions. Taxi, takeoff, climb, descent, approach and the reserves must be added.'
  ],
  derivation: {
    title: 'Derive the Breguet range equation for a jet',
    steps: [
      { text: 'In steady cruise, lift equals weight and thrust equals drag, so the thrust is the weight divided by the lift-to-drag ratio:', tex: 'T = \\frac{W}{L/D}' },
      { text: 'The engines burn fuel weight at a rate proportional to the thrust, and the aircraft loses that weight:', tex: '\\frac{dW}{dt} = -c_T\\,T = -\\frac{c_T\\,W}{L/D}' },
      { text: 'In the same time it covers the distance $dR = V\\,dt$. Eliminate $dt$:', tex: 'dR = -\\frac{V}{c_T}\\,\\frac{L}{D}\\,\\frac{dW}{W}' },
      { text: 'Integrate from the start weight to the end weight, holding $V$, $L/D$ and $c_T$ constant:', tex: 'R = \\frac{V}{c_T}\\,\\frac{L}{D}\\int_{W_1}^{W_0}\\frac{dW}{W} = \\frac{V}{c_T}\\,\\frac{L}{D}\\,\\ln\\frac{W_0}{W_1}' }
    ]
  },
  formulas: [
    {
      name: 'Breguet range of a jet',
      expr: 'R = V/cT*LD*ln(m0/m1)', tex: 'R = \\dfrac{V}{c_T}\\,\\text{L/D}\\,\\ln\\dfrac{m_0}{m_1}',
      vars: {
        R: { name: 'cruise range', q: 'length', unit: 'km' },
        V: { name: 'cruise true airspeed', q: 'speed', unit: 'km/h', value: 829 },
        cT: { name: 'thrust-specific fuel consumption (fuel weight per thrust per time)', q: 'rate', unit: '1/h', value: 0.56, tex: 'c_T' },
        LD: { name: 'lift-to-drag ratio', value: 17, min: 1, max: 80, tex: '\\text{L/D}' },
        m0: { name: 'mass at the start of cruise', q: 'mass', unit: 't', value: 70, tex: 'm_0' },
        m1: { name: 'mass at the end of cruise', q: 'mass', unit: 't', value: 60, tex: 'm_1' }
      },
      note: 'Constant speed, L/D and TSFC (a cruise climb). c_T in 1/h equals the TSFC in lb/(lbf·h); in kg/(N·h) multiply by g.',
      practice: { unknowns: ['R', 'm1', 'LD'] },
      stories: {
        R: 'An airliner cruises at {V} with a lift-to-drag ratio of {LD} on engines of TSFC {cT}, burning down from {m0} to {m1}. How far does it go?',
        m1: 'A jet of {m0} must cruise {R} at {V} with L/D = {LD} and TSFC {cT}. What will it weigh at the end of the cruise?',
        LD: 'A jet flies {R} at {V} on engines of TSFC {cT}, burning down from {m0} to {m1}. What lift-to-drag ratio did it average?'
      }
    },
    {
      name: 'Breguet range of a propeller aircraft',
      expr: 'R = etap*Ef/g*LD*ln(m0/m1)', tex: 'R = \\eta_p\\,\\dfrac{E_f}{g}\\,\\text{L/D}\\,\\ln\\dfrac{m_0}{m_1}',
      vars: {
        R: { name: 'cruise range', q: 'length', unit: 'km' },
        etap: { name: 'propeller efficiency', value: 0.8, min: 0.1, max: 0.95, tex: '\\eta_p' },
        Ef: { name: 'shaft work per kilogram of fuel (1/BSFC)', q: 'specificenergy', unit: 'kWh/kg', value: 4, tex: 'E_f' },
        g: { const: 'g' },
        LD: { name: 'lift-to-drag ratio', value: 11, min: 1, max: 80, tex: '\\text{L/D}' },
        m0: { name: 'mass at the start', q: 'mass', unit: 'kg', value: 1100, tex: 'm_0' },
        m1: { name: 'mass at the end', q: 'mass', unit: 'kg', value: 992, tex: 'm_1' }
      },
      note: 'E_f = 1/BSFC: 4 kWh/kg for 0.25 kg/kWh (a good piston engine); a turboprop in cruise gives about 3.3–3.7 kWh/kg. No speed appears.',
      practice: { unknowns: ['R', 'm1'] },
      stories: {
        R: 'A light aircraft burns down from {m0} to {m1} with a propeller efficiency of {etap}, an engine giving {Ef} of shaft work per kilogram of fuel and L/D = {LD}. How far can it fly?',
        m1: 'A light aircraft of {m0} (η_p = {etap}, {Ef} per kg of fuel, L/D = {LD}) must fly {R}. What will it weigh on arrival?'
      }
    },
    {
      name: 'Fuel fraction for a given range',
      expr: 'ff = 1 - exp(-R*cT/(V*LD))', tex: 'f = 1 - \\exp\\!\\left(-\\dfrac{R\\, c_T}{V\\,\\text{L/D}}\\right)',
      vars: {
        ff: { name: 'fuel burned as a share of the starting mass', q: 'ratio', unit: '%', tex: 'f' },
        R: { name: 'cruise range', q: 'length', unit: 'km', value: 5000 },
        cT: { name: 'thrust-specific fuel consumption', q: 'rate', unit: '1/h', value: 0.56, tex: 'c_T' },
        V: { name: 'cruise true airspeed', q: 'speed', unit: 'km/h', value: 829 },
        LD: { name: 'lift-to-drag ratio', value: 17, min: 1, max: 80, tex: '\\text{L/D}' }
      },
      note: 'The jet Breguet equation solved for (m₀ − m₁)/m₀.',
      practice: { unknowns: ['ff', 'R'] },
      stories: {
        ff: 'A jet cruising at {V} with L/D = {LD} and TSFC {cT} must fly {R}. What share of its starting mass must be fuel for the cruise?',
        R: 'A jet cruising at {V} with L/D = {LD} and TSFC {cT} can burn {ff} of its starting mass in fuel. How far can it cruise?'
      }
    },
    {
      name: 'Range with the overall efficiency',
      expr: 'R = eta0*LHV/g*LD*ln(m0/m1)', tex: 'R = \\eta_0\\,\\dfrac{\\mathit{LHV}}{g}\\,\\text{L/D}\\,\\ln\\dfrac{m_0}{m_1}',
      vars: {
        R: { name: 'cruise range', q: 'length', unit: 'km' },
        eta0: { name: 'overall efficiency (propulsive power / fuel heat)', value: 0.34, min: 0.01, max: 0.8, tex: '\\eta_0' },
        LHV: { name: 'lower heating value of the fuel', q: 'specificenergy', unit: 'MJ/kg', value: 43.2, tex: '\\mathit{LHV}' },
        g: { const: 'g' },
        LD: { name: 'lift-to-drag ratio', value: 17, min: 1, max: 80, tex: '\\text{L/D}' },
        m0: { name: 'mass at the start', q: 'mass', unit: 't', value: 70, tex: 'm_0' },
        m1: { name: 'mass at the end', q: 'mass', unit: 't', value: 60, tex: 'm_1' }
      },
      note: 'Valid for any engine burning its fuel; η₀ = thermal × propulsive (× propeller) efficiency. Kerosene: about 43 MJ/kg.',
      practice: { unknowns: ['R', 'eta0'] },
      stories: {
        R: 'An aircraft with an overall efficiency of {eta0} burns fuel of heating value {LHV} at L/D = {LD}, going from {m0} to {m1}. How far does it fly?',
        eta0: 'An aircraft flies {R} at L/D = {LD}, burning fuel of heating value {LHV} from {m0} down to {m1}. What was its overall efficiency?'
      }
    }
  ],
  examples: [
    {
      title: 'An airliner\'s cruise',
      q: 'The airliner starts its cruise at 70 t and may burn 10 t. It flies at 829 km/h with $L/D$ = 17 and $c_T$ = 0.56 per hour. How far does it cruise?',
      steps: [
        'Range factor: $V(L/D)/c_T = 829 \\times 17/0.56 = 25\\,170$ km.',
        '$\\ln(70/60) = 0.1542$.',
        '$R = 25\\,170 \\times 0.1542 = 3880$ km.'
      ],
      a: 'About 3900 km — roughly Tel Aviv to London, or New York to Los Angeles.'
    },
    {
      title: 'The fuel for 5000 km',
      q: 'What share of its starting mass must the same airliner burn to cruise 5000 km, and how many tonnes is that from 70 t?',
      steps: [
        '$m_1/m_0 = \\exp(-5000/25\\,170) = \\exp(-0.199) = 0.820$.',
        'Fuel fraction $1 - 0.820 = 0.180$: 18 %.',
        '$0.18 \\times 70 = 12.6$ t of cruise fuel, before climb, descent and reserves.'
      ],
      a: '18 % — about 12.6 t.'
    },
    {
      title: 'A light aircraft',
      q: 'The light aircraft (1100 kg) carries 108 kg (150 L) of fuel for cruise. With $\\eta_p$ = 0.8, 0.25 kg/kWh ($E_f$ = 4 kWh/kg = 14.4 MJ/kg) and $L/D$ = 11 in cruise, what is its Breguet range?',
      steps: [
        '$\\eta_p E_f/g = 0.8 \\times 14.4 \\times 10^6/9.81 = 1175$ km.',
        '$\\times L/D$: $1175 \\times 11 = 12\\,920$ km.',
        '$\\times \\ln(1100/992) = 0.1034$: $R \\approx 1340$ km.'
      ],
      a: 'About 1340 km, before reserves.'
    }
  ],
  quiz: [
    { q: 'An aircraft with a zero-fuel mass of 60 t carries 6 t of cruise fuel. If it could carry 12 t instead, its Breguet range would be multiplied by about…', choices: ['1.5', '1.9', '2.0', '2.2'], a: 1,
      why: 'ln(72/60)/ln(66/60) = 0.182/0.0953 = 1.91. The extra fuel must itself be carried, so the range does not quite double.' },
    { q: 'In the Breguet equation for a propeller aircraft, flying faster at the same L/D and efficiencies increases the range.', a: false,
      why: 'The propeller form R = η_p (E_f/g)(L/D) ln(m₀/m₁) contains no speed: fuel goes with power, which is drag × speed.' },
    { q: 'A jet has a range factor of 25 000 km. What percentage of its starting mass must be fuel to cruise 10 000 km?', answer: 33, unit: '%', tol: 0.03,
      why: 'f = 1 − exp(−10 000/25 000) = 1 − e^(−0.4) = 0.33.' },
    { q: 'Which change raises a jet\'s range by the same factor as a 10 % higher lift-to-drag ratio?', choices: ['a 10 % lower thrust-specific fuel consumption (roughly)', 'a 10 % larger fuel load', 'a 10 % lower cruise altitude', 'a 10 % larger wing area'], a: 0,
      why: 'R ∝ (L/D)/c_T. A 10 % higher L/D multiplies R by 1.10; a c_T lower by 9 % does the same. More fuel gives less than proportional gain.' },
    { q: 'Why does the logarithm disappear from the range equation of a battery-electric aircraft?', choices: ['its mass does not change as the energy is used', 'electric motors have no losses', 'batteries store more energy per kilogram than fuel', 'it cruises at constant altitude'], a: 0,
      why: 'The logarithm comes from the aircraft getting lighter. A battery weighs the same full or empty, so R = η (e_b/g)(L/D)(m_b/m) is linear in the battery share.' }
  ],
  problems: [
    { q: 'A business jet cruises at 850 km/h with $L/D$ = 15 and $c_T$ = 0.65 per hour, burning from 20 t to 15 t. What is its cruise range?', answer: 5643, unit: 'km', tol: 0.02,
      steps: ['Range factor $850 \\times 15/0.65 = 19\\,615$ km.', '$\\ln(20/15) = 0.2877$; $R = 19\\,615 \\times 0.2877 = 5643$ km.'] },
    { q: 'A turbofan airliner flies at 829 km/h on engines with $c_T$ = 0.56 per hour. With a heating value of 43.2 MJ/kg, what is the engines\' overall efficiency?', answer: 0.336, tol: 0.02,
      steps: ['$V/c_T = 230.3\\ \\mathrm{m/s} \\div (0.56/3600\\ \\mathrm{s^{-1}}) = 1.480 \\times 10^6$ m.', '$\\eta_0 = (V/c_T)\\,g/LHV = 1.480 \\times 10^6 \\times 9.81/43.2 \\times 10^6 = 0.336$.'] }
  ],
  applications: ['Conceptual aircraft design, where the range equation links wing, engine and structure in the first sizing loop.', 'Comparing new technologies — a better engine, a longer wing, a lighter structure — in one common currency, range.', 'Judging electric and hydrogen aircraft, whose energy stores behave very differently from kerosene tanks.'],
  history: 'The equation carries the name of the French aircraft builder Louis Breguet, whose company\'s long-range aircraft set distance records in the 1920s; in its propeller form it was used to size aircraft for record flights between the wars. Its logarithm is the same as in the rocket equation that Konstantin Tsiolkovsky published in 1903.',
  sim: 'perf-breguet'
},

{
  id: 'takeoff-landing', parent: 'mission-performance', title: 'Takeoff and landing', level: 2,
  short: 'The takeoff run is an acceleration against drag and wheel friction to the liftoff speed, 1.1–1.2 times the stall speed; its length grows with the square of the weight and falls with density, thrust and headwind. Landing is the same problem run backwards with brakes.',
  keywords: ['takeoff distance', 'ground roll', 'liftoff speed', 'rotation speed', 'V_R', 'V_LOF', 'landing distance', 'braking', 'rolling friction', 'headwind', 'tailwind', 'hot and high', 'density altitude', 'runway length', 'screen height'],
  prereq: ['lift-equation', 'physics:newtons-second-law', 'density-altitude', 'stall'],
  related: ['climb-performance', 'high-lift-devices', 'ground-effect', 'wind-shear', 'thrust', 'propellers'],
  body: `
Takeoff and landing are where performance meets the length of a runway. Both are short, accelerated manoeuvres, so instead of force balances they need [[physics:newtons-second-law|Newton's second law]].

### The takeoff run
On the ground the aircraft accelerates under thrust against drag and the rolling friction of the wheels, which falls as the wing takes over the weight:

$$m\\frac{dV}{dt} = T - D - \\mu\\,(W - L)$$

with a rolling-friction coefficient $\\mu$ of about 0.02–0.03 on a paved runway and 0.05–0.10 on grass. The aircraft lifts off at $V_{LOF} \\approx$ 1.1–1.2 $V_s$ — a margin above the stall in the takeoff configuration. Taking the net accelerating force $F$ at its average (roughly its value at 0.7 $V_{LOF}$), the ground roll is $s = V_{LOF}^2/(2F/m)$, and with $V_{LOF} = 1.2\\,V_s$:

$$s_g \\approx \\frac{1.44\\, m^2 g}{\\rho\\, S\\, C_{L,\\max}\\, F}$$

For the 1100 kg light aircraft ($C_{L,\\max}$ = 1.5, mean net force about 1.9 kN) at sea level this gives about 300 m, close to what light-aircraft handbooks show. The airborne part, to a screen height of 15 m (50 ft), adds another half to three-quarters of that.

### What makes it longer
The formula shows the sensitivities at a glance:

- **Weight** enters squared: 10 % heavier means about 21 % more runway — a higher liftoff speed *and* less acceleration.
- **Air density** enters directly, and again through the engine: a normally aspirated piston engine's power falls roughly as $1.13\\sigma - 0.13$. At an airfield 1500 m high on a 30 °C day the density is 0.79 of sea level (a [[density-altitude|density altitude]] of about 2350 m) and the power 0.77, so the ground roll grows by about 65 %, to 500 m.
- **Wind.** The aircraft needs its liftoff speed relative to the air, so a headwind $U$ is a head start: $s \\approx s_0(1 - U/V_{LOF})^2$. Ten knots of headwind cuts the 300 m roll by about 30 %; five knots of tailwind lengthens it by about 17 %.
- **Surface and slope**: long wet grass can double a takeoff run; an uphill slope of 2 % adds roughly 10 %.

### Landing
An aircraft approaches at about 1.3 times its stall speed in the landing configuration, flares, touches down near 1.1–1.2 $V_s$, and stops with brakes, spoilers and reverse thrust. At an average deceleration $a$ the ground roll is

$$s = \\frac{V_{TD}^2}{2a}$$

Wheel braking gives about 0.3–0.4 g on a dry runway, less than half that when wet and very little on ice. An airliner touching down at 125 kt (64 m/s) and averaging 3 m/s² needs about 690 m; a light aircraft touching down at 52 kt needs about 120 m at 0.3 g. The energy to be removed, $\\tfrac12 mV^2$, is about 130 MJ for a 64 t airliner — which is why brakes glow after a rejected takeoff at high speed.

> [!warn] Takeoff and landing distances for a real aircraft must come from its approved flight manual, corrected for weight, pressure altitude, temperature, wind, slope and surface, with the safety factors the regulations and the manual require. The estimates here show why the charts look as they do; they are not a substitute for them.
`,
  ideas: [
    'The ground roll is an acceleration: m dV/dt = T − D − μ(W − L), to a liftoff speed of 1.1–1.2 V_s.',
    'Estimate: s ≈ 1.44 m²g/(ρ S C_L,max F) — weight squared over density, wing, lift and net force.',
    'Hot and high airfields lengthen the run twice: higher true liftoff speed and less engine power.',
    'A headwind shortens the run as (1 − U/V_LOF)²; a tailwind lengthens it sharply.',
    'Landing roll s = V²/(2a): halving the braking deceleration (a wet runway) doubles it.'
  ],
  pitfalls: [
    'A 10 % heavier aircraft needs 10 % more runway — About 21 % more: the liftoff speed rises as √W, so its square rises as W, and the acceleration falls as 1/W.',
    'A hot day only matters for the engine — It also thins the air, so the wing needs a higher true airspeed to lift off. Both effects lengthen the run.',
    'A tailwind just adds its speed to the ground speed, a small effect — The ground roll goes as the square of the ground speed at liftoff: 5 kt of tailwind at a 63 kt liftoff lengthens it by about 17 %, and landing distances by a similar share.'
  ],
  formulas: [
    {
      name: 'Takeoff ground roll estimate',
      expr: 's = 1.44*m^2*g/(rho*S*CLmax*F)', tex: 's_g = \\dfrac{1.44\\, m^2 g}{\\rho\\, S\\, C_{L,\\max}\\, F}',
      vars: {
        s: { name: 'ground roll', q: 'length', unit: 'm', tex: 's_g' },
        m: { name: 'aircraft mass', q: 'mass', unit: 'kg', value: 1100 },
        g: { const: 'g' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        S: { name: 'wing area', q: 'area', unit: 'm²', value: 16.2 },
        CLmax: { name: 'maximum lift coefficient (takeoff configuration)', value: 1.5, min: 0.5, max: 4, tex: 'C_{L,\\max}' },
        F: { name: 'mean net accelerating force (T − D − friction)', q: 'force', unit: 'N', value: 1900 }
      },
      note: 'Liftoff at 1.2 V_s, still air, level runway, with the net force averaged over the run (take it at about 0.7 V_LOF).',
      practice: { unknowns: ['s', 'm', 'F'] },
      stories: {
        s: 'An aircraft of {m} with {S} of wing (C_L,max = {CLmax}) accelerates with a mean net force of {F} in air of density {rho}. How long is its ground roll?',
        m: 'An aircraft with {S} of wing (C_L,max = {CLmax}) and a mean net force of {F} must lift off within {s} in air of density {rho}. What is the heaviest it can be?',
        F: 'An aircraft of {m} ({S}, C_L,max = {CLmax}) lifts off after {s} in air of density {rho}. What mean net force accelerated it?'
      }
    },
    {
      name: 'Effect of a headwind on the ground roll',
      expr: 'sw = s0*(1 - Uw/VLOF)^2', tex: 's_w = s_0\\left(1 - \\dfrac{U}{V_{LOF}}\\right)^2',
      vars: {
        sw: { name: 'ground roll with the wind', q: 'length', unit: 'm', tex: 's_w' },
        s0: { name: 'ground roll in still air', q: 'length', unit: 'm', value: 300, tex: 's_0' },
        Uw: { name: 'headwind component (negative for a tailwind)', q: 'speed', unit: 'kt', value: 10, min: -30, max: 40, signed: true, tex: 'U' },
        VLOF: { name: 'liftoff airspeed', q: 'speed', unit: 'kt', value: 63, tex: 'V_{LOF}' }
      },
      note: 'Assumes the same mean acceleration; the aircraft only has to reach V_LOF − U over the ground.',
      practice: { unknowns: ['sw', 'Uw'] },
      stories: {
        sw: 'An aircraft needs {s0} of ground roll in still air and lifts off at {VLOF}. How long is the roll into a headwind of {Uw}?',
        Uw: 'An aircraft that needs {s0} in still air (liftoff at {VLOF}) has only {sw} of runway for its ground roll. What headwind does it need?'
      }
    },
    {
      name: 'Stopping distance at constant deceleration',
      expr: 's = V^2/(2*a)', tex: 's = \\dfrac{V_{TD}^2}{2a}',
      vars: {
        s: { name: 'ground roll to a stop', q: 'length', unit: 'm' },
        V: { name: 'touchdown ground speed', q: 'speed', unit: 'kt', value: 125, tex: 'V_{TD}' },
        a: { name: 'mean deceleration', q: 'accel', unit: 'm/s²', value: 3 }
      },
      note: 'Dry runway with good braking about 3–4 m/s²; wet about half; icy much less.',
      stories: {
        s: 'An airliner touches down at {V} and decelerates at {a} on average. How far does it roll?',
        a: 'An aircraft touching down at {V} must stop within {s}. What average deceleration does it need?'
      }
    }
  ],
  examples: [
    {
      title: 'A light aircraft\'s ground roll',
      q: 'Estimate the sea-level ground roll of the 1100 kg light aircraft (16.2 m², $C_{L,\\max}$ = 1.5) with a mean net accelerating force of 1.9 kN. What is its liftoff speed?',
      steps: [
        '$s = 1.44\\, m^2 g/(\\rho S C_{L,\\max} F) = 1.44 \\times 1100^2 \\times 9.81/(1.225 \\times 16.2 \\times 1.5 \\times 1900)$.',
        'Numerator $1.709 \\times 10^7$; denominator $56\\,560$; $s = 302$ m.',
        '$V_{LOF} = 1.2 V_s = 1.2 \\times 52 = 63$ kt.'
      ],
      a: 'About 300 m, lifting off at about 63 kt.'
    },
    {
      title: 'Hot and high',
      q: 'The same aircraft takes off from an airfield 1500 m high on a 30 °C day. The pressure there is 845.6 hPa. By how much does the ground roll grow?',
      steps: [
        'Density: $\\rho = p/(R_{air}T) = 84\\,560/(287 \\times 303.15) = 0.972\\ \\mathrm{kg/m^3}$, $\\sigma = 0.793$ (a density altitude of about 2350 m).',
        'Engine power (and roughly the net force) falls to $1.132 \\times 0.793 - 0.132 = 0.766$.',
        'The roll grows by $1/(0.793 \\times 0.766) = 1.65$: $302 \\times 1.65 \\approx 500$ m.'
      ],
      a: 'About 65 % longer — some 500 m.'
    },
    {
      title: 'An airliner\'s landing',
      q: 'A 64 t airliner touches down at 125 kt (64.3 m/s) and decelerates at 3 m/s² on average. How far does it roll, and how much energy do the brakes and reversers remove?',
      steps: [
        '$s = V^2/(2a) = 64.3^2/6 = 689$ m.',
        'Kinetic energy: $\\tfrac12 \\times 64\\,000 \\times 64.3^2 = 132$ MJ — enough to bring about 400 litres of water from room temperature to the boil.'
      ],
      a: 'About 690 m; about 130 MJ.'
    }
  ],
  quiz: [
    { q: 'An aircraft is loaded 10 % heavier. Its takeoff ground roll becomes about…', choices: ['10 % longer', '21 % longer', '5 % longer', 'unchanged'], a: 1,
      why: 's ∝ m²: 1.1² = 1.21. The liftoff speed squared grows as the weight, and the acceleration falls as 1/weight.' },
    { q: 'A takeoff into a headwind needs less runway because the aircraft reaches its liftoff airspeed at a lower ground speed.', a: true,
      why: 'Lift depends on airspeed. With a headwind U the aircraft needs only V_LOF − U over the ground, and s ∝ (V_LOF − U)².' },
    { q: 'An aircraft needs a 400 m ground roll in still air and lifts off at 60 kt. What is its ground roll into a 15 kt headwind?', answer: 225, unit: 'm', tol: 0.02,
      why: 's = 400 × (1 − 15/60)² = 400 × 0.5625 = 225 m.' },
    { q: 'Why does a hot day lengthen the takeoff run at the same airfield?', choices: ['the thinner air needs a higher true liftoff speed and gives less engine power', 'hot tyres have more rolling friction', 'hot air is more viscous, so drag rises', 'the stall speed shown on the airspeed indicator rises'], a: 0,
      why: 'Density falls with temperature: the indicated liftoff speed is the same but the true speed is higher, and a normally aspirated engine loses power in thin air.' },
    { q: 'An aircraft touches down at 60 m/s and brakes at an average of 2.5 m/s². How far does it roll?', answer: 720, unit: 'm', tol: 0.02,
      why: 's = V²/(2a) = 3600/5 = 720 m.' }
  ],
  problems: [
    { q: 'The light aircraft\'s still-air ground roll is 300 m with a liftoff speed of 63 kt. How long is it with a 5 kt tailwind?', answer: 350, unit: 'm', tol: 0.02,
      steps: ['A tailwind is a negative headwind: $s = 300(1 + 5/63)^2 = 300 \\times 1.165 = 350$ m.'] }
  ],
  applications: ['Performance charts and tables in every flight manual, and the airline takeoff-performance software built on them.', 'Airport design: runway lengths for the hottest days and heaviest aircraft expected.', 'Short-takeoff aircraft and carrier aviation, which attack every term: high C_L,max, high thrust, headwind, catapults and arresting gear.'],
  sim: 'perf-takeoff'
},

{
  id: 'ceiling', parent: 'mission-performance', title: 'Service and absolute ceiling', level: 2,
  short: 'As an aircraft climbs, the power or thrust available falls while the minimum needed grows; where the rate of climb reaches zero is the absolute ceiling, where it falls to 100 ft/min the service ceiling. Jets meet a second limit: the coffin corner.',
  keywords: ['ceiling', 'absolute ceiling', 'service ceiling', 'cruise ceiling', 'time to climb', 'coffin corner', 'buffet', 'turbocharger', 'critical altitude', 'maximum altitude', 'oxygen'],
  prereq: ['climb-performance', 'isa', 'power-required'],
  related: ['critical-mach', 'transonic-flow', 'density-altitude', 'turbofan', 'level-flight', 'energy-management'],
  body: `
Climb performance shrinks with height. The engine breathes thinner air and gives less power or thrust, while the least power needed for level flight grows (the same equivalent airspeed means a higher true airspeed, so $P_{req,\\min} \\propto 1/\\sqrt\\sigma$). Somewhere the two meet and the aircraft can climb no more.

### Defining the ceilings
- **Absolute ceiling**: the height where the maximum rate of climb falls to zero. It can be approached but never quite reached — the last metres take for ever.
- **Service ceiling**: where the maximum rate of climb is 100 ft/min (0.5 m/s), a practical upper limit.
- **Cruise ceiling** (jets): where it is 300 ft/min; military aircraft use a combat ceiling of 500 ft/min.

For many aircraft the maximum rate of climb falls almost linearly with height, $RC \\approx RC_0(1 - h/H)$, where $H$ is the absolute ceiling. Then the time to climb to height $h$ is

$$t = \\frac{H}{RC_0}\\,\\ln\\frac{H}{H-h}$$

which grows without limit as $h$ approaches $H$.

The light aircraft of these pages climbs at about 700 ft/min at sea level and has an absolute ceiling near 5500 m. Its service ceiling is then about 4700 m (15 500 ft); climbing to 3000 m takes 20 minutes and to 4500 m 44 minutes. Handbook service ceilings of four-seaters with 160–180 hp engines are 11 000–15 000 ft.

### Engines and ceilings
- A **normally aspirated piston engine** loses power with density, to about half at 6000 m. A **turbocharger** keeps sea-level power up to a critical altitude of 5000–7000 m, lifting the ceiling to about 7500 m.
- A **turbofan's** thrust falls roughly with density, and faster at cruise Mach numbers. Its ceiling is where the maximum thrust equals the minimum drag $W/(L/D)_{\\max}$, so a lighter aircraft has a higher ceiling — which is why airliners climb as they burn fuel.

| Aircraft | Typical service or certified ceiling |
|---|---|
| Light aircraft, normally aspirated | 3.5–4.5 km (11 000–15 000 ft) |
| Light aircraft, turbocharged | ≈ 7.5 km (25 000 ft) |
| Single-aisle airliner | ≈ 12 km (39 000 ft) |
| Long-haul twin | ≈ 13 km (43 000 ft) |
| Concorde | ≈ 18 km (60 000 ft) |
| High-altitude reconnaissance jet | above 21 km (70 000 ft) |

### The coffin corner
For a jet a second limit closes in. The stall speed, in true airspeed and Mach number, rises as the air thins, while the maximum speed is capped by the Mach number at which shock waves bring buffet and a steep drag rise ([[critical-mach]]). At some height the two meet: the **coffin corner**. For the 70 t airliner at 12 km, a wing that starts to buffet at $C_L$ = 0.9 reaches it at Mach 0.68 in level flight and at Mach 0.77 in a 1.3 g gust or turn — close to its cruise Mach number. So airliners are not flown up to their thrust ceiling: a margin against buffet (typically 1.3 g) sets the usable maximum altitude for each weight.

> [!warn] Above about 3000–4000 m people need supplemental oxygen, and the rules of the air say when it must be used; pressurised aircraft have their own procedures. The ceilings and maximum altitudes of a real aircraft are in its approved manuals.
`,
  ideas: [
    'The excess power for climbing shrinks with height: the engine gives less, level flight needs more.',
    'Absolute ceiling: maximum rate of climb zero. Service ceiling: 100 ft/min. Cruise ceiling (jets): 300 ft/min.',
    'With a rate of climb falling linearly with height, the time to climb is (H/RC₀) ln(H/(H − h)) — infinite at the absolute ceiling.',
    'A lighter aircraft has a higher ceiling; turbocharging raises a piston aircraft\'s ceiling.',
    'At high altitude a jet\'s stall speed and its Mach limit converge: the coffin corner.'
  ],
  pitfalls: [
    'The absolute ceiling is the height an aircraft can reach — It can only approach it: the rate of climb dwindles to nothing, and the time to reach it is infinite. The service ceiling is the practical limit.',
    'An airliner can always climb to its certified maximum altitude — Only when light enough. At high weight the thrust or the buffet margin limits it to a lower level, which rises as fuel burns.',
    'At high altitude an aircraft has plenty of margin between its stall and its maximum speed — The margin shrinks with height; near the coffin corner a jet can have only a few per cent between low-speed and high-speed buffet.'
  ],
  formulas: [
    {
      name: 'Rate of climb falling linearly with height',
      expr: 'RC = RC0*(1 - h/H)', tex: '\\mathit{RC} = \\mathit{RC}_0\\left(1 - \\dfrac{h}{H}\\right)',
      vars: {
        RC: { name: 'maximum rate of climb at height h', q: 'speed', unit: 'ft/min', signed: true, tex: '\\mathit{RC}' },
        RC0: { name: 'maximum rate of climb at sea level', q: 'speed', unit: 'ft/min', value: 700, tex: '\\mathit{RC}_0' },
        h: { name: 'height', q: 'length', unit: 'm', value: 3000 },
        H: { name: 'absolute ceiling', q: 'length', unit: 'm', value: 5500 }
      },
      note: 'An approximation that fits many aircraft well below the ceiling.',
      practice: { unknowns: ['RC', 'H'] },
      stories: {
        RC: 'An aircraft climbs at {RC0} at sea level and has an absolute ceiling of {H}. How fast can it climb at {h}?',
        H: 'An aircraft climbs at {RC0} at sea level and at {RC} at {h}. Where is its absolute ceiling?'
      }
    },
    {
      name: 'Time to climb',
      expr: 't = H/RC0*ln(H/(H - h))', tex: 't = \\dfrac{H}{\\mathit{RC}_0}\\,\\ln\\dfrac{H}{H - h}',
      vars: {
        t: { name: 'time to climb from sea level', q: 'time', unit: 'min' },
        H: { name: 'absolute ceiling', q: 'length', unit: 'm', value: 5500 },
        RC0: { name: 'maximum rate of climb at sea level', q: 'speed', unit: 'ft/min', value: 700, tex: '\\mathit{RC}_0' },
        h: { name: 'height to reach', q: 'length', unit: 'm', value: 3000 }
      },
      note: 'Integral of dh/RC with RC falling linearly; valid for h < H.',
      practice: { unknowns: ['t', 'h'] },
      stories: {
        t: 'An aircraft climbs at {RC0} at sea level and its absolute ceiling is {H}. How long does it take to climb to {h}?',
        h: 'An aircraft (sea-level climb {RC0}, absolute ceiling {H}) climbs at full power for {t}. How high does it get?'
      }
    },
    {
      name: 'Service ceiling from the linear model',
      expr: 'Hs = H*(1 - RCs/RC0)', tex: 'H_s = H\\left(1 - \\dfrac{\\mathit{RC}_s}{\\mathit{RC}_0}\\right)',
      vars: {
        Hs: { name: 'service ceiling', q: 'length', unit: 'm', tex: 'H_s' },
        H: { name: 'absolute ceiling', q: 'length', unit: 'm', value: 5500 },
        RCs: { name: 'rate of climb that defines the ceiling', q: 'speed', unit: 'ft/min', value: 100, tex: '\\mathit{RC}_s' },
        RC0: { name: 'maximum rate of climb at sea level', q: 'speed', unit: 'ft/min', value: 700, tex: '\\mathit{RC}_0' }
      },
      note: '100 ft/min for the service ceiling, 300 ft/min for a jet\'s cruise ceiling.',
      stories: { Hs: 'An aircraft climbs at {RC0} at sea level and its absolute ceiling is {H}. Where is the height at which it can still climb at {RCs}?' }
    }
  ],
  examples: [
    {
      title: 'A light aircraft\'s ceilings',
      q: 'The light aircraft climbs at 700 ft/min (3.56 m/s) at sea level and its absolute ceiling is 5500 m. Find its service ceiling, its rate of climb at 3000 m, and the times to climb to 3000 m and 4500 m.',
      steps: [
        'Service ceiling: $5500(1 - 100/700) = 4714$ m, about 15 500 ft.',
        'At 3000 m: $700(1 - 3000/5500) = 318$ ft/min.',
        'Time to 3000 m: $(5500/3.556)\\ln(5500/2500) = 1547 \\times 0.788 = 1220$ s = 20 min.',
        'Time to 4500 m: $1547 \\times \\ln(5500/1000) = 1547 \\times 1.705 = 2637$ s = 44 min — the second 1500 m takes longer than the first 3000 m.'
      ],
      a: 'Service ceiling ≈ 4700 m; 318 ft/min at 3000 m; 20 min to 3000 m and 44 min to 4500 m.'
    },
    {
      title: 'The coffin corner',
      q: 'The 70 t airliner (122.6 m²) flies at 12 000 m, where $\\rho = 0.311\\ \\mathrm{kg/m^3}$ and the speed of sound is 295 m/s. Its wing buffets at $C_L$ = 0.9 at that Mach number. What is the lowest Mach number it can fly level, and with a 1.3 g margin?',
      steps: [
        '$V = \\sqrt{2W/(\\rho S C_L)} = \\sqrt{2 \\times 686\\,700/(0.311 \\times 122.6 \\times 0.9)} = 200$ m/s: Mach 0.68.',
        'For 1.3 g the lift coefficient must stay below $0.9/1.3$, so the speed rises by $\\sqrt{1.3}$: 228 m/s, Mach 0.77.',
        'Its maximum operating Mach number is about 0.82, so the usable band is only 0.77–0.82: it should not fly this high at this weight.'
      ],
      a: 'Mach 0.68 at 1 g, 0.77 with a 1.3 g margin — close to the Mach limit: the coffin corner.'
    }
  ],
  quiz: [
    { q: 'The service ceiling is the height at which the maximum rate of climb has fallen to…', choices: ['100 ft/min (0.5 m/s)', 'zero', '300 ft/min', '1000 ft/min'], a: 0,
      why: 'Zero defines the absolute ceiling; 300 ft/min is the cruise ceiling used for jets.' },
    { q: 'An airliner can climb higher at the end of a long flight than at its start.', a: true,
      why: 'Its ceiling rises as it gets lighter: less thrust is needed (W/(L/D)) and the buffet margin grows.' },
    { q: 'An aircraft climbs at 1000 ft/min at sea level and its absolute ceiling is 6000 m. How long does it take to climb to 3000 m, if the rate falls linearly with height?', answer: 13.6, unit: 'min', tol: 0.03,
      why: 't = (H/RC₀) ln(H/(H − h)) = (6000/5.08) × ln 2 = 819 s = 13.6 min.' },
    { q: 'What raises the ceiling of a piston-engined aircraft the most?', choices: ['a turbocharger that keeps sea-level power up to a critical altitude', 'a larger propeller spinner', 'flying faster', 'a rearward centre of gravity'], a: 0,
      why: 'The ceiling is set by the engine\'s power falling with density; turbocharging holds the power up to 5000–7000 m.' },
    { q: 'What closes the "coffin corner" of a high-flying jet?', choices: ['the stall (low-speed buffet) speed rising to meet the Mach limit (high-speed buffet)', 'the engines overheating', 'the cabin pressure limit', 'the wing icing'], a: 0,
      why: 'In thin air the stall speed in TAS and Mach number rises, while the Mach number of the shock-induced buffet stays fixed; with height the two approach.' }
  ],
  problems: [
    { q: 'An aircraft climbs at 900 ft/min at sea level and has an absolute ceiling of 7000 m. Estimate its service ceiling.', answer: 6222, unit: 'm', tol: 0.02,
      steps: ['$H_s = H(1 - RC_s/RC_0) = 7000(1 - 100/900) = 6222$ m.'] }
  ],
  applications: ['Choosing cruise levels for weight and temperature — the "maximum" and "optimum" altitudes in an airliner\'s flight management system.', 'Mountain flying and oxygen planning for light aircraft.', 'High-altitude reconnaissance and research aircraft, designed around the coffin corner.'],
  sim: 'perf-climb'
},

{
  id: 'energy-management', parent: 'mission-performance', title: 'Energy height and energy management', level: 2,
  short: 'Height and speed are two stores of the same energy. Energy height h + V²/2g measures their total; the specific excess power (T − D)V/W is how fast it grows. The throttle adds or removes energy, the elevator trades one form for the other.',
  keywords: ['energy height', 'specific energy', 'specific excess power', 'P_s', 'zoom climb', 'energy management', 'total energy', 'total energy variometer', 'energy manoeuvrability', 'stabilised approach', 'descent planning', 'Rutowski'],
  prereq: ['physics:conservation-of-energy', 'climb-performance', 'four-forces'],
  related: ['phugoid', 'gliding', 'ceiling', 'wind-shear', 'thermals-waves', 'physics:kinetic-energy'],
  body: `
An aircraft carries two stores of mechanical energy: potential energy in its height and [[physics:kinetic-energy|kinetic energy]] in its speed. Dividing their sum by the weight gives a length, the **energy height**:

$$h_E = h + \\frac{V^2}{2g}$$

— the height the aircraft could reach if it traded all its speed for height without losses. A light aircraft at 1000 m and 100 kt has $h_E$ = 1135 m; an airliner at 11 000 m and 230 m/s has 2700 m of height stored in its speed, $h_E \\approx$ 13.7 km.

### Two controls for two things
The rate of change of energy height is the **specific excess power**:

$$P_s = \\frac{dh_E}{dt} = \\frac{(T - D)\\,V}{W}$$

It says what the pilot's two main controls do. The **throttle** changes $T$, and with it the *total* energy — how fast it is added or removed. The **elevator**, by changing the angle of attack, mainly *trades* one form for the other: pull up and speed becomes height; push over and height becomes speed. Drag always bleeds energy away; with the engine idling $P_s$ is negative, and that is a glide ([[gliding]]).

A **zoom climb** trades speed for height: slowing from $V_1$ to $V_2$ buys

$$\\Delta h = \\frac{V_1^2 - V_2^2}{2g}$$

less what drag takes on the way. A sailplane pulling up from 200 to 90 km/h gains about 125 m. That is why glider pilots use a **total-energy variometer**, which measures $dh_E/dt$, so that a pull-up does not look like rising air. Left to itself after such a disturbance, an aircraft swaps speed and height back and forth in the slow oscillation called the [[phugoid]], with its energy height nearly constant.

### Energy in climbs and air combat
In 1954 Edward Rutowski showed that the quickest way to a given height and speed is not the steepest climb but the path with the highest $P_s$ at each energy height — for a supersonic fighter, often accelerating low down and then climbing, even diving through the transonic drag rise. In the 1960s John Boyd and Thomas Christie turned $P_s$ into **energy–manoeuvrability** charts that compare fighters by where each can gain energy faster than its opponent, and those charts shaped the fighters of the 1970s.

### Managing energy on the approach
Coming down, the problem reverses: a clean airliner with an L/D near 17 is hard to slow down and bring down at the same time. Pilots plan descents with the rule of **three nautical miles per thousand feet** — a ratio of 18, close to the glide ratio at idle — plus extra distance for slowing down. Speed brakes, flaps and landing gear add drag when energy must be shed. Too much energy near the ground (high and fast) is a common factor in runway overruns; too little (low and slow) in loss-of-control accidents. Operators therefore require an approach to be **stabilised** — on speed, on path, in the landing configuration with the right power — by a set height, and a go-around if it is not.

> [!warn] Stabilised-approach criteria, descent planning and energy management for a real aircraft come from its manuals, the operator's procedures, training and the rules of the air. This page explains the physics behind them.
`,
  ideas: [
    'Energy height h_E = h + V²/2g adds the height and the speed of an aircraft in one number.',
    'Specific excess power P_s = (T − D)V/W is the rate of change of energy height.',
    'The throttle adds or removes total energy; the elevator trades speed for height and back.',
    'A zoom climb from V₁ to V₂ gains (V₁² − V₂²)/2g of height, less the drag losses.',
    'Approach and descent planning is energy management: the 3-to-1 rule and stabilised approaches.'
  ],
  pitfalls: [
    'Pulling the nose up makes the aircraft gain energy — It only trades kinetic for potential energy; without extra thrust the total falls, because drag keeps acting (and rises with the higher load factor).',
    'A glider that rises after a pull-up has found lift — Its energy height may not have changed at all. That is why gliders use total-energy variometers.',
    'Speed can always be exchanged for the full height V²/2g — Drag takes a share during the manoeuvre, and a zoom that ends too slow ends near the stall.'
  ],
  formulas: [
    {
      name: 'Energy height',
      expr: 'hE = h + V^2/(2*g)', tex: 'h_E = h + \\dfrac{V^2}{2g}',
      vars: {
        hE: { name: 'energy height', q: 'length', unit: 'm', tex: 'h_E' },
        h: { name: 'height', q: 'length', unit: 'm', value: 1000 },
        V: { name: 'true airspeed', q: 'speed', unit: 'kt', value: 100 },
        g: { const: 'g' }
      },
      note: 'Mechanical energy per unit weight. Use the true airspeed.',
      practice: { unknowns: ['hE', 'V'] },
      stories: {
        hE: 'An aircraft flies at {h} at {V}. What is its energy height?',
        V: 'An aircraft at {h} has an energy height of {hE}. How fast is it flying?'
      }
    },
    {
      name: 'Specific excess power',
      expr: 'Ps = (T - D)*V/(m*g)', tex: 'P_s = \\dfrac{(T - D)\\,V}{m g}',
      vars: {
        Ps: { name: 'specific excess power (rate of change of energy height)', q: 'speed', unit: 'm/s', signed: true, tex: 'P_s' },
        T: { name: 'thrust', q: 'force', unit: 'kN', value: 1.8 },
        D: { name: 'drag', q: 'force', unit: 'kN', value: 0.87 },
        V: { name: 'true airspeed', q: 'speed', unit: 'kt', value: 75 },
        m: { name: 'aircraft mass', q: 'mass', unit: 'kg', value: 1100 },
        g: { const: 'g' }
      },
      note: 'P_s can be spent as rate of climb, as acceleration (V dV/dt / g), or any mix. It is negative when drag exceeds thrust.',
      practice: { unknowns: ['Ps', 'T'] },
      stories: {
        Ps: 'An aircraft of {m} at {V} has {T} of thrust and {D} of drag. How fast is its energy height changing?',
        T: 'An aircraft of {m} flying at {V} with {D} of drag must gain energy height at {Ps}. How much thrust does it need?'
      }
    },
    {
      name: 'Height gained in a zoom climb',
      expr: 'dh = (V1^2 - V2^2)/(2*g)', tex: '\\Delta h = \\dfrac{V_1^2 - V_2^2}{2g}',
      vars: {
        dh: { name: 'height gained (drag neglected)', q: 'length', unit: 'm', signed: true, tex: '\\Delta h' },
        V1: { name: 'speed at the start', q: 'speed', unit: 'km/h', value: 200, tex: 'V_1' },
        V2: { name: 'speed at the end', q: 'speed', unit: 'km/h', value: 90, tex: 'V_2' },
        g: { const: 'g' }
      },
      note: 'An upper bound: drag during the manoeuvre takes a share. A negative Δh is a dive that gains speed.',
      practice: { unknowns: ['dh', 'V2'] },
      stories: {
        dh: 'A glider pulls up from {V1} and slows to {V2}. How much height can it gain at most?',
        V2: 'An aircraft at {V1} zooms up by {dh}. What is the least speed it can end with (neglecting drag)?'
      }
    }
  ],
  examples: [
    {
      title: 'How much energy is in the speed?',
      q: 'Compare the energy heights of the light aircraft at 1000 m and 100 kt (51.4 m/s) and of the airliner at 11 000 m and 230 m/s.',
      steps: [
        'Light aircraft: $V^2/2g = 51.4^2/19.6 = 135$ m, so $h_E = 1135$ m — speed is 12 % of its energy.',
        'Airliner: $230^2/19.6 = 2700$ m, so $h_E = 13\\,700$ m — speed is 20 % of its energy.',
        'A fighter at 400 m/s would carry 8.2 km of height in its speed alone.'
      ],
      a: '1135 m and 13 700 m.'
    },
    {
      title: 'Planning a descent',
      q: 'An airliner at 35 000 ft must descend to the runway. With the 3-to-1 rule, how far out should it start down, and what glide ratio does that assume?',
      steps: [
        '$35 \\times 3 = 105$ nautical miles, about 195 km.',
        'The ratio: 3 nm = 18 230 ft for every 1000 ft: 18.2 — about the aircraft\'s lift-to-drag ratio with the engines at idle.',
        'Add some 10 nm to slow from cruise to approach speed, and more with a tailwind.'
      ],
      a: 'About 105 nm (≈ 195 km) out, plus a margin to slow down — an implied glide ratio of 18.'
    }
  ],
  quiz: [
    { q: 'A pilot pulls up into a climb without touching the throttle. The energy height…', choices: ['stays about the same, falling slowly because of drag', 'rises, because the aircraft climbs', 'falls to zero', 'rises by V²/2g'], a: 0,
      why: 'The elevator trades speed for height; only thrust can add energy. Drag keeps removing it.' },
    { q: 'An aircraft slows from 60 m/s to 40 m/s in a zoom climb. Neglecting drag, how much height does it gain?', answer: 102, unit: 'm', tol: 0.02,
      why: 'Δh = (60² − 40²)/(2 × 9.81) = 2000/19.62 = 102 m.' },
    { q: 'An aircraft at 2000 m and 50 m/s has more energy height than one at 2100 m and 20 m/s.', a: true,
      why: '2000 + 50²/19.62 = 2127 m against 2100 + 20²/19.62 = 2120 m.' },
    { q: 'In energy terms, the throttle mainly controls…', choices: ['the total energy (the rate of change of energy height)', 'the split between height and speed', 'the load factor', 'nothing — only the elevator matters'], a: 0,
      why: 'P_s = (T − D)V/W: thrust sets how fast total energy grows or shrinks. The elevator decides how it is shared.' },
    { q: 'A total-energy variometer in a glider shows…', choices: ['the rate of change of height plus speed energy, dh_E/dt', 'only the rate of change of height', 'the airspeed', 'the wind'], a: 0,
      why: 'It compensates for speed changes, so that a pull-up (trading speed for height) reads zero and only real rising or sinking air is shown.' }
  ],
  problems: [
    { q: 'The light aircraft (1100 kg) flies at 75 kt with 1.8 kN of thrust and 0.87 kN of drag. What is its specific excess power?', answer: 3.33, unit: 'm/s', tol: 0.02,
      steps: ['$V = 38.6$ m/s; $P_s = (T - D)V/(mg) = 930 \\times 38.6/10\\,790 = 3.33$ m/s.', 'It could climb at 3.3 m/s at constant speed, or accelerate, or any mix.'] }
  ],
  applications: ['Energy management and stabilised-approach criteria in airline operations.', 'Minimum-time climb schedules and energy–manoeuvrability comparisons of fighters.', 'Total-energy variometers and final-glide computers in sailplanes.', 'Flight-path displays that show pilots a "total energy" or flight-path-acceleration cue.'],
  history: 'Edward Rutowski\'s 1954 paper "Energy approach to the general aircraft performance problem" introduced energy height as a single state variable for climb planning. John Boyd, a US Air Force fighter pilot, and the mathematician Thomas Christie developed energy–manoeuvrability theory in the early 1960s using $P_s$ charts.',
  sim: 'perf-energy'
}
);
