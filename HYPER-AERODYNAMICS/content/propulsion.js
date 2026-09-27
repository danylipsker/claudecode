/* HYPER-AERODYNAMICS · content/propulsion.js — the Propulsion branch:
 *   thrust-basics  thrust, momentum-theory, propulsive-efficiency, propellers, propeller-efficiency
 *   engines        turbojet, turbofan, tsfc, turboprop, ramjet-scramjet, rocket-propulsion, electric-propulsion
 * Simulations in sims/propulsion.js (prop-…). */
Hyper.add(

/* ================================================================ THRUST */
{
  id: 'thrust', parent: 'thrust-basics', title: 'How thrust is made', level: 1,
  short: 'Every propulsor throws mass backwards and is pushed forwards by the reaction: thrust is the mass flow times the speed it adds, T = ṁ(Ve − V₀), plus a pressure term at the nozzle exit.',
  keywords: ['thrust', 'net thrust', 'gross thrust', 'ram drag', 'pressure thrust', 'mass flow', 'jet velocity', 'exhaust velocity', 'reaction', 'thrust power', 'jet engine', 'static thrust'],
  prereq: ['physics:newtons-third-law', 'physics:conservation-of-momentum', 'momentum-equation'],
  related: ['propulsive-efficiency', 'momentum-theory', 'turbojet', 'turbofan', 'rocket-propulsion', 'four-forces', 'power-required', 'nozzles'],
  body: `
Every propulsor — a bird's wing, a ship's screw, a jet engine, a rocket — works the same way: it grabs some mass, throws it backwards and is pushed forwards by the reaction ([[physics:newtons-third-law|Newton's third law]]). The force equals the rate at which it changes the momentum of that mass. A propeller or a jet engine takes in air arriving at the flight speed $V_0$ and sends it back out at a higher speed $V_e$; the thrust is the mass flow times the speed it has added, plus a correction for pressure at the exit:

$$T = \\dot m\\,(V_e - V_0) + (p_e - p_a)\\,A_e$$

### Where the terms come from
Draw a box round the engine and count the momentum going in and out each second — the [[momentum-equation|momentum equation]] for a control volume, which is [[physics:conservation-of-momentum|conservation of momentum]] applied to a flow:
- $\\dot m V_e$ is the momentum leaving each second in the jet: the **gross thrust**.
- $\\dot m V_0$ is the momentum the air already had when it was swallowed. Taking it aboard costs a force, the **ram drag**, which grows with flight speed.
- $(p_e - p_a)A_e$ is the **pressure thrust**: if the jet leaves the nozzle above the ambient pressure $p_a$, the unbalanced pressure acting over the exit area $A_e$ pushes too. For a subsonic jet it is small; for a rocket it can be ten per cent of the total.

The fuel adds a little mass — about 2 % of the air through a turbojet, well under 1 % of all the air through a turbofan — so a fuller form is $T = (\\dot m_a + \\dot m_f)V_e - \\dot m_a V_0$. A rocket carries everything it throws out: it has no intake and no ram drag, so its $V_0$ term drops out.

### Where the force acts
Thrust is not the jet "pushing on the air behind". It is the sum of the pressures and friction on every surface inside the engine — compressor and fan blades, combustor walls, the nozzle, the propeller blades — pressed forward by the gas they accelerate and passed to the aircraft through the engine mounts. That is why a rocket works in a vacuum, and works slightly better there than at sea level.

### The same thrust, many ways
Thrust depends on a product, $\\dot m\\,(V_e - V_0)$. A large mass flow speeded up a little and a small one speeded up a lot can give the same force:

| Propulsor (static, sea level) | Mass flow | Jet speed | Thrust |
|---|---|---|---|
| Light-aircraft propeller | ≈ 70 kg/s of air | ≈ 40 m/s | ≈ 3 kN |
| Turbofan, CFM56 class, takeoff | ≈ 340 kg/s of air | 330–480 m/s | ≈ 120 kN |
| Kerosene rocket engine, Merlin class | ≈ 300 kg/s of propellant | ≈ 2800 m/s | ≈ 845 kN |

The two routes cost very different amounts of power, because the kinetic energy put into the jet grows with the *square* of its speed. That trade-off is [[propulsive-efficiency]]; it is why airliners carry enormous fans and rockets are hopeless at low speed but unbeatable in space.

> [!key] Thrust = mass flow × speed added, plus a pressure term. The rest of propulsion is about making that product cheaply.

At a fixed engine setting the thrust changes with speed and height: ram drag rises with $V_0$, and thinner air at altitude means less mass flow. A turbofan at cruise gives only about a fifth to a quarter of its sea-level takeoff thrust. The work done on the aircraft each second is the **thrust power** $T V_0$ — zero with the brakes on before takeoff, however loud the engines.
`,
  ideas: [
    'Thrust is the reaction to throwing mass backwards: mass flow × speed added, T = ṁ(Ve − V₀).',
    'The air swallowed at flight speed brings its momentum with it: the ram drag ṁV₀ is subtracted from the gross thrust ṁVe.',
    'If the jet leaves above ambient pressure, a pressure thrust (pe − pa)Ae adds; a rocket has no ram drag at all.',
    'The force acts on the engine\'s own blades and walls, not on the air behind it.',
    'The same thrust can come from much air slowly or little air fast; the energy cost is very different.'
  ],
  pitfalls: [
    'The exhaust pushes against the air behind the engine — Thrust is the reaction to accelerating the gas inside the engine; it acts on the engine\'s blades and walls. A rocket with nothing behind it, in vacuum, gives slightly more thrust than at sea level.',
    'Thrust equals mass flow times exhaust speed — That is only the gross thrust. The air arrived at the flight speed already, so the ram drag ṁV₀ must be taken off; at cruise it cancels more than half the gross thrust of a turbofan.',
    'Letting the jet leave above ambient pressure gives free extra thrust — The pressure term grows but the jet speed falls by more; for a given engine the thrust is greatest when the nozzle expands the gas exactly to ambient pressure.'
  ],
  formulas: [
    {
      name: 'Net thrust of a jet engine',
      expr: 'T = mdot*(Ve - V0) + (pe - pa)*Ae', tex: 'T = \\dot m\\,(V_e - V_0) + (p_e - p_a)\\,A_e',
      vars: {
        T: { name: 'net thrust', q: 'force', unit: 'kN' },
        mdot: { name: 'mass flow through the engine', q: 'massflow', unit: 'kg/s', value: 50, tex: '\\dot m' },
        Ve: { name: 'jet speed at the nozzle exit', q: 'speed', unit: 'm/s', value: 560, tex: 'V_e' },
        V0: { name: 'flight speed', q: 'speed', unit: 'm/s', value: 240, tex: 'V_0' },
        pe: { name: 'nozzle exit pressure (absolute)', q: 'pressure', unit: 'kPa', value: 30, tex: 'p_e' },
        pa: { name: 'ambient pressure (absolute)', q: 'pressure', unit: 'kPa', value: 22.6, tex: 'p_a' },
        Ae: { name: 'nozzle exit area', q: 'area', unit: 'm²', value: 0.25, tex: 'A_e' }
      },
      note: 'Fuel mass neglected (it adds 1–3 %). Pressures are absolute; the pressure term vanishes when the nozzle expands the jet exactly to ambient pressure. For a rocket there is no intake: set V₀ = 0. The starting values are a small turbojet at 11 000 m (22.6 kPa).',
      practice: { unknowns: ['T', 'Ve', 'mdot'] },
      stories: {
        T: 'A turbojet swallows {mdot} of air at {V0} and throws it out at {Ve}. Its nozzle exit of {Ae} is at {pe} while the air outside is at {pa}. What is the net thrust?',
        Ve: 'An engine flying at {V0} passes {mdot} and gives {T} of thrust; the nozzle exit of {Ae} is at {pe} in air at {pa}. How fast is the jet?',
        mdot: 'A jet flying at {V0} leaves its nozzle at {Ve} and {pe} (outside {pa}, exit area {Ae}) and gives {T}. What mass flow does it need?'
      }
    },
    {
      name: 'Thrust with the fuel counted',
      expr: 'T = (ma + mf)*Ve - ma*V0', tex: 'T = (\\dot m_a + \\dot m_f)\\,V_e - \\dot m_a V_0',
      vars: {
        T: { name: 'net thrust', q: 'force', unit: 'kN' },
        ma: { name: 'air mass flow', q: 'massflow', unit: 'kg/s', value: 60, tex: '\\dot m_a' },
        mf: { name: 'fuel mass flow', q: 'massflow', unit: 'kg/s', value: 1.2, tex: '\\dot m_f' },
        Ve: { name: 'jet speed', q: 'speed', unit: 'm/s', value: 650, tex: 'V_e' },
        V0: { name: 'flight speed', q: 'speed', unit: 'm/s', value: 250, tex: 'V_0' }
      },
      note: 'The nozzle is assumed to expand the jet to ambient pressure. The fuel enters with no momentum relative to the engine (it was carried aboard) but leaves at the jet speed.',
      stories: { T: 'A turbojet flying at {V0} takes in {ma} of air, burns {mf} of fuel and exhausts at {Ve}. What thrust does it give?' }
    },
    {
      name: 'Thrust power',
      expr: 'P = T*V0', tex: 'P = T\\,V_0',
      vars: {
        P: { name: 'thrust power (useful power)', q: 'power', unit: 'MW' },
        T: { name: 'thrust', q: 'force', unit: 'kN', value: 25 },
        V0: { name: 'flight speed', q: 'speed', unit: 'm/s', value: 240, tex: 'V_0' }
      },
      note: 'The work done on the aircraft per second. It is zero when the aircraft is not moving, however much thrust the engines give.',
      stories: { P: 'An engine gives {T} of thrust to an airliner flying at {V0}. What useful power does it deliver?', T: 'An aircraft at {V0} receives {P} of thrust power. What is the thrust?' }
    }
  ],
  examples: [
    {
      title: 'A turbojet in cruise',
      q: 'A turbojet flying at 250 m/s takes in 60 kg/s of air, burns 1.2 kg/s of fuel and exhausts at 650 m/s, its nozzle expanding the jet to ambient pressure. Find the net thrust, and how much the fuel mass adds.',
      steps: [
        'Momentum out: $(60 + 1.2) \\times 650 = 39\\,780$ N.',
        'Ram drag: $60 \\times 250 = 15\\,000$ N.',
        'Net thrust: $39\\,780 - 15\\,000 = 24\\,780$ N.',
        'Ignoring the fuel: $60 \\times (650 - 250) = 24\\,000$ N — the fuel adds about 3 %.'
      ],
      a: 'About 24.8 kN; the fuel mass accounts for 0.8 kN of it.'
    },
    {
      title: 'A rocket engine at sea level and in vacuum',
      q: 'A rocket engine burns 300 kg/s of propellant; the gas leaves the nozzle at 2900 m/s and 60 kPa through an exit of 0.9 m². Find the thrust at sea level (101.3 kPa) and in vacuum.',
      steps: [
        'Momentum thrust (no intake, so no ram drag): $300 \\times 2900 = 870$ kN.',
        'Sea level: $(60 - 101.3) \\times 0.9 = -37.2$ kN of pressure thrust — the nozzle is over-expanded — so $T = 833$ kN.',
        'Vacuum: $(60 - 0) \\times 0.9 = +54$ kN, so $T = 924$ kN.'
      ],
      a: 'About 833 kN at sea level and 924 kN in vacuum — 11 % more with nothing to "push against".'
    }
  ],
  quiz: [
    { q: 'An engine takes in 80 kg/s of air at 200 m/s and exhausts it at 500 m/s (fuel and pressure thrust neglected). What is the thrust?', answer: 24, unit: 'kN',
      why: 'T = ṁ(Ve − V₀) = 80 × (500 − 200) = 24 000 N. Forgetting the ram drag would give 40 kN.' },
    { q: 'Engine A accelerates 100 kg/s from rest to 300 m/s; engine B accelerates 400 kg/s from rest to 100 m/s. Which is true?', choices: ['A gives more thrust and needs less power', 'B gives more thrust and needs less than half the jet power', 'They give the same thrust and need the same power', 'B gives more thrust but needs more power'], a: 1,
      why: 'Thrust: A 30 kN, B 40 kN. Jet power ½ṁV²: A 4.5 MW, B 2.0 MW. More air, more slowly, is both stronger and cheaper — the idea behind propellers and fans.' },
    { q: 'A rocket engine gives slightly more thrust in vacuum than at sea level.', a: true,
      why: 'The pressure term (pe − pa)Ae grows when the ambient pressure pa falls to zero. Nothing behind the rocket is needed to push against.' },
    { q: 'Where does the thrust force of a jet engine act on the aircraft?', choices: ['On the air behind the nozzle', 'On the engine\'s internal surfaces — blades, casings, nozzle — and through the mounts', 'Only on the nozzle', 'On the wing, through the airflow over it'], a: 1,
      why: 'The gas is accelerated by the pressures on the engine\'s own surfaces; the reaction to those pressures, summed over every blade and wall, is the thrust, carried to the airframe by the mounts.' },
    { q: 'During the takeoff run, at a constant engine setting, the thrust of a turbofan…', choices: ['stays the same', 'falls, mainly because the ram drag ṁV₀ grows', 'rises, because the air is rammed in', 'falls to zero at rotation speed'], a: 1,
      why: 'The gross thrust changes little at low speed but ram drag grows with V₀; a high-bypass engine loses perhaps a fifth of its thrust by the time it lifts off.' }
  ],
  problems: [
    { q: 'A propeller at rest on the ground pulls 73 kg/s of air through its disc and throws it back at 41 m/s. What is its static thrust?', answer: 2.99, unit: 'kN', tol: 0.02,
      steps: ['With the aircraft at rest the air starts from rest: $T = \\dot m V_e = 73 \\times 41$.', '$T = 2993$ N ≈ 3.0 kN.'] },
    { q: 'An airliner cruising at 240 m/s needs 25 kN from each engine. If the average jet speed is 360 m/s, what air mass flow must each engine handle?', answer: 208, unit: 'kg/s', tol: 0.02,
      steps: ['$\\dot m = T/(V_e - V_0) = 25\\,000/(360 - 240)$.', '$\\dot m = 208$ kg/s.'] }
  ],
  applications: ['Sizing engines for takeoff, climb and cruise — each needs a different thrust at a different speed and height.', 'Thrust reversers, which turn the fan or core jet forwards to help brake on landing.', 'Rocket nozzles shaped for sea level or for vacuum, balancing jet speed against pressure thrust.', 'Engine test stands, which measure static thrust through load cells on the engine mounts.'],
  history: 'Hero of Alexandria\'s spinning steam "aeolipile" (1st century) turned by reaction, and Newton\'s laws (1687) explained why. Frank Whittle patented a turbojet in 1930 and ran his first engine in 1937; Hans von Ohain\'s engine was the first to fly, in the Heinkel He 178 on 27 August 1939.',
  sim: 'prop-efficiency'
},

/* ================================================================ MOMENTUM THEORY */
{
  id: 'momentum-theory', parent: 'thrust-basics', title: 'Actuator disc and momentum theory', level: 2,
  short: 'Replace a propeller or rotor by a thin disc that adds a pressure jump: conservation of mass, momentum and energy then give the induced velocity, the ideal power T(V + v), and the power to hover √(T³/2ρA).',
  keywords: ['actuator disc', 'momentum theory', 'Rankine-Froude', 'induced velocity', 'slipstream', 'stream tube', 'disc loading', 'ideal power', 'hover power', 'figure of merit', 'power loading'],
  prereq: ['thrust', 'bernoulli', 'continuity'],
  related: ['propellers', 'propulsive-efficiency', 'hover-power', 'helicopter-rotor', 'multicopters', 'betz-limit', 'physics:kinetic-energy'],
  body: `
How much power does it take to make a given thrust? Before any blade is drawn, Rankine and Froude answered with a bold simplification. Replace the propeller or rotor by an **actuator disc**: an infinitely thin disc of area $A$ that adds the same pressure jump $\\Delta p$ to all the air passing through it, with no swirl and no friction. Conservation of mass, momentum and energy then settle everything.

### The stream tube
Far ahead the air moves at the flight speed $V$; far behind, in the slipstream, at $V + 2v$. At the disc it moves at $V + v$: exactly **half** of the speed increase happens before the air reaches the disc, drawn in by the low pressure ahead of it, and half after, pushed by the high pressure behind. Because the air speeds up, the stream tube through the disc narrows ([[continuity]]): wider than the disc ahead of it, narrower behind. The quantity $v$ is the **induced velocity**.

- Mass flow through the disc: $\\dot m = \\rho A (V + v)$.
- Thrust = mass flow × speed added: $T = \\dot m \\cdot 2v = 2\\rho A\\, v\\,(V + v)$.
- The pressure jump is the thrust per unit area, $\\Delta p = T/A$ — the **disc loading**.
- Power given to the air = its gain in kinetic energy per second: $P = T\\,(V + v)$.

[[bernoulli|Bernoulli's equation]] holds ahead of the disc and behind it, but not across it, because the disc adds energy. Ahead, the pressure falls below ambient as the air speeds up; across the disc it jumps by $\\Delta p$; behind, it decays back to ambient while the air goes on accelerating.

### Efficiency and hover
The useful power is $TV$, so the ideal efficiency is $\\eta_i = V/(V + v)$ — the Froude efficiency $2/(1 + V_e/V_0)$ with $V_e = V + 2v$ (see [[propulsive-efficiency]]). A real propeller loses another 5–15 % to blade drag, swirl and tip losses.

In hover ($V = 0$) no useful work is done at all, yet the rotor needs

$$v_h = \\sqrt{\\frac{T}{2\\rho A}}, \\qquad P = T v_h = \\sqrt{\\frac{T^3}{2\\rho A}}$$

The power per unit thrust, $v_h = \\sqrt{(T/A)/(2\\rho)}$, grows with the square root of the disc loading. That one fact separates human-powered helicopters from jump jets:

| Hovering machine | Disc loading $T/A$ | Ideal power per kN of thrust |
|---|---|---|
| Human-powered helicopter, four 20 m rotors | ≈ 1 N/m² | ≈ 0.6 kW |
| 1.2 kg quadcopter drone | ≈ 60 N/m² | ≈ 5 kW |
| Light helicopter | ≈ 140 N/m² | ≈ 7.5 kW |
| Heavy-lift helicopter | ≈ 500 N/m² | ≈ 14 kW |
| Tiltrotor | ≈ 1000 N/m² | ≈ 20 kW |
| Jet lift (lift fan or vectored jet) | ≈ 50 000 N/m² | ≈ 140 kW |

Real rotors need more than the ideal: their **figure of merit**, ideal over actual hover power, is about 0.7 because of blade drag, swirl and uneven inflow. Thin air raises the power as $1/\\sqrt{\\rho}$ — about 10 % more at 2000 m. The same theory, run backwards, gives the [[betz-limit|Betz limit]] of a wind turbine, and it sizes the rotors of [[hover-power|helicopters]] and [[multicopters|drones]].

> [!key] Big, lightly loaded discs are efficient. At the same thrust, doubling the disc area cuts the ideal hover power by √2.
`,
  ideas: [
    'An actuator disc adds a uniform pressure jump Δp = T/A; mass, momentum and energy conservation give the rest.',
    'The air speeds up by v before the disc and by another v after it: the slipstream reaches V + 2v and the stream tube contracts.',
    'Thrust T = 2ρAv(V + v); ideal power P = T(V + v); ideal efficiency V/(V + v).',
    'In hover P = √(T³/2ρA): power per unit thrust grows with the square root of the disc loading.',
    'Real rotors reach about 70 % of the ideal (figure of merit ≈ 0.7); thin air costs power as 1/√ρ.'
  ],
  pitfalls: [
    'The air only speeds up after it has passed the propeller — Half the increase happens ahead of the disc: the low pressure there draws the air in, so the air reaches the disc at V + v, not V.',
    'Bernoulli\'s equation applies straight through a propeller — The disc adds energy, so the total pressure jumps across it. Bernoulli holds ahead of the disc and behind it separately.',
    'A hovering rotor is 100 % inefficient, so its design does not matter — It does no useful work, but the power it needs for a given thrust depends strongly on disc loading; a large rotor can need a tenth of the power of a small jet.'
  ],
  derivation: {
    title: 'Why half the speed increase comes before the disc',
    steps: [
      { text: 'Momentum: the thrust is the momentum added per second to the air through the disc, which leaves far downstream at speed $V_w$:', tex: 'T = \\dot m\\,(V_w - V)' },
      { text: 'Energy: the power put into the air is its gain in kinetic energy per second:', tex: 'P = \\tfrac12\\,\\dot m\\,(V_w^2 - V^2)' },
      { text: 'The disc does its work on air passing through it at speed $V_d$, so the same power is force times speed:', tex: 'P = T\\,V_d' },
      { text: 'Equate the two and cancel $\\dot m (V_w - V)$:', tex: 'V_d = \\tfrac12\\,(V + V_w)' },
      { text: 'Write $V_d = V + v$. Then $V_w = V + 2v$, the mass flow is $\\rho A(V + v)$, and', tex: 'T = 2\\rho A\\, v\\,(V + v)' }
    ]
  },
  formulas: [
    {
      name: 'Thrust of an actuator disc',
      expr: 'T = 2*rho*A*v*(V + v)', tex: 'T = 2\\rho A\\, v\\,(V + v)',
      vars: {
        T: { name: 'thrust', q: 'force', unit: 'N' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.007, tex: '\\rho' },
        A: { name: 'disc area', q: 'area', unit: 'm²', value: 2.84 },
        v: { name: 'induced velocity at the disc', q: 'speed', unit: 'm/s', value: 4.13 },
        V: { name: 'flight speed', q: 'speed', unit: 'm/s', value: 60 }
      },
      note: 'Ideal momentum theory: uniform loading, no swirl, no friction. The slipstream far behind moves at V + 2v. Starting values: a 1.9 m light-aircraft propeller cruising at 2000 m.',
      practice: { unknowns: ['T', 'v'] },
      stories: {
        T: 'A propeller disc of {A} flies at {V} through air of density {rho}, and the air speeds up by {v} as it passes through. What thrust does it give?',
        v: 'A propeller of disc area {A} gives {T} of thrust at {V} in air of density {rho}. What induced velocity does momentum theory predict at the disc?'
      }
    },
    {
      name: 'Ideal power of an actuator disc',
      expr: 'P = T*(V + v)', tex: 'P = T\\,(V + v)',
      vars: {
        P: { name: 'ideal power given to the air', q: 'power', unit: 'kW' },
        T: { name: 'thrust', q: 'force', unit: 'N', value: 1500 },
        V: { name: 'flight speed', q: 'speed', unit: 'm/s', value: 60 },
        v: { name: 'induced velocity at the disc', q: 'speed', unit: 'm/s', value: 4.13 }
      },
      note: 'Of this, T·V is useful; T·v is left in the slipstream. A real propeller needs 10–20 % more.',
      stories: { P: 'A propeller gives {T} at {V} with an induced velocity of {v}. What is the least power it can need?' }
    },
    {
      name: 'Induced velocity in hover',
      expr: 'vh = sqrt(T/(2*rho*A))', tex: 'v_h = \\sqrt{\\dfrac{T}{2\\rho A}}',
      vars: {
        vh: { name: 'induced velocity in hover', q: 'speed', unit: 'm/s', tex: 'v_h' },
        T: { name: 'thrust (= weight in hover)', q: 'force', unit: 'N', value: 10790 },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        A: { name: 'rotor disc area', q: 'area', unit: 'm²', value: 79.5 }
      },
      note: 'The downwash far below the rotor is twice this. Starting values: a 1100 kg light helicopter with a 10 m rotor at sea level.',
      stories: { vh: 'A rotor of {A} holds up {T} in air of density {rho}. How fast does the air move through it?' }
    },
    {
      name: 'Ideal power to hover',
      expr: 'P = sqrt(T^3/(2*rho*A))', tex: 'P = \\sqrt{\\dfrac{T^3}{2\\rho A}}',
      vars: {
        P: { name: 'ideal hover power', q: 'power', unit: 'kW' },
        T: { name: 'thrust (= weight)', q: 'force', unit: 'N', value: 10790 },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        A: { name: 'rotor disc area', q: 'area', unit: 'm²', value: 79.5 }
      },
      note: 'Divide by the figure of merit (about 0.7 for a good rotor) for the real rotor power; add tail-rotor, gearbox and accessory losses for the engine power.',
      practice: { unknowns: ['P', 'T', 'A'] },
      stories: {
        P: 'A helicopter weighing {T} hovers with a rotor of {A} in air of density {rho}. What is the least power its rotor can need?',
        A: 'A drone weighing {T} must hover on {P} of ideal rotor power in air of density {rho}. What total rotor area does it need?'
      }
    }
  ],
  examples: [
    {
      title: 'A light helicopter in hover',
      q: 'A 1100 kg helicopter has a rotor of 10.06 m diameter. Find the induced velocity and the ideal hover power at sea level, the power with a figure of merit of 0.7, and the ideal power at 2000 m ($\\rho = 1.007\\ \\mathrm{kg/m^3}$).',
      steps: [
        'Disc area $A = \\pi \\times 5.03^2 = 79.5\\ \\mathrm{m^2}$; thrust $T = 1100 \\times 9.807 = 10\\,790$ N; disc loading 136 N/m².',
        '$v_h = \\sqrt{10\\,790/(2 \\times 1.225 \\times 79.5)} = \\sqrt{55.4} = 7.44$ m/s; the downwash well below is about 15 m/s.',
        'Ideal power $P = T v_h = 10\\,790 \\times 7.44 = 80.3$ kW. With a figure of merit of 0.7: $80.3/0.7 = 115$ kW (154 hp) at the rotor.',
        'At 2000 m: $v_h = \\sqrt{10\\,790/(2 \\times 1.007 \\times 79.5)} = 8.21$ m/s, $P = 88.6$ kW — 10 % more.'
      ],
      a: 'About 7.4 m/s through the rotor, 80 kW ideal (≈ 115 kW real) at sea level, and 10 % more at 2000 m.'
    },
    {
      title: 'A propeller in cruise',
      q: 'A 1.9 m propeller gives 1.5 kN at 60 m/s in air of density 1.0 kg/m³. Find the induced velocity, the ideal efficiency and the ideal power.',
      steps: [
        '$A = \\pi \\times 0.95^2 = 2.835\\ \\mathrm{m^2}$.',
        'Solve $1500 = 2 \\times 1.0 \\times 2.835\\, v\\,(60 + v)$: $v^2 + 60v - 264.5 = 0$, so $v = -30 + \\sqrt{900 + 264.5} = 4.13$ m/s.',
        'Ideal efficiency $60/64.13 = 0.936$.',
        'Ideal power $1500 \\times 64.13 = 96.2$ kW, of which $1500 \\times 60 = 90$ kW is useful.'
      ],
      a: 'v ≈ 4.1 m/s, ideal efficiency about 94 %, 96 kW of which 90 kW does useful work.'
    }
  ],
  quiz: [
    { q: 'In momentum theory, where has the air gained half of its final speed increase?', choices: ['Far ahead of the disc', 'At the disc itself', 'Far behind the disc', 'Nowhere: the disc adds all the speed in one jump'], a: 1,
      why: 'Energy and momentum together give V_disc = (V + V_wake)/2: the air arrives at the disc at V + v and leaves the slipstream at V + 2v.' },
    { q: 'Two rotors give the same thrust; one has twice the diameter of the other. Its ideal hover power is…', choices: ['half', '1/√2 ≈ 0.71 times', 'a quarter', 'the same'], a: 0,
      why: 'Twice the diameter is four times the area; P = √(T³/2ρA) falls as 1/√A, so by √4 = 2.' },
    { q: 'Bernoulli\'s equation can be applied along a streamline passing straight through the actuator disc.', a: false,
      why: 'The disc adds energy — its pressure jump raises the total pressure — so Bernoulli holds only on each side separately.' },
    { q: 'A 2 kg drone with a total rotor area of 0.3 m² hovers at sea level (ρ = 1.225 kg/m³). What is its ideal hover power?', answer: 101, unit: 'W',
      why: 'T = 2 × 9.807 = 19.6 N; P = √(19.6³/(2 × 1.225 × 0.3)) = √10 260 ≈ 101 W. A real drone needs about 1.5 times that at the rotors.' },
    { q: 'The slipstream far behind a hovering helicopter\'s rotor is…', choices: ['wider than the rotor', 'narrower than the rotor', 'the same width as the rotor', 'wider close to the rotor, then narrower'], a: 1,
      why: 'The air keeps accelerating below the rotor, from v_h to 2v_h, so by continuity the tube contracts to half the rotor area (0.71 of its diameter).' }
  ],
  problems: [
    { q: 'A 1.2 kg quadcopter has four rotors of 0.254 m (10 in) diameter. What is its ideal hover power at sea level?', answer: 57.3, unit: 'W', tol: 0.02,
      steps: ['$A = 4 \\times \\pi \\times 0.127^2 = 0.2027\\ \\mathrm{m^2}$; $T = 1.2 \\times 9.807 = 11.77$ N.', '$v_h = \\sqrt{11.77/(2 \\times 1.225 \\times 0.2027)} = 4.87$ m/s.', '$P = T v_h = 57.3$ W — real drones need about 1.5–2 times this from their batteries.'] },
    { q: 'A 1.9 m propeller at rest at sea level receives 60 kW of ideal power. What static thrust does momentum theory predict?', answer: 2.92, unit: 'kN', tol: 0.02,
      hint: 'Eliminate v between T = 2ρAv² and P = Tv.',
      steps: ['From $P = \\sqrt{T^3/(2\\rho A)}$: $T = (2\\rho A P^2)^{1/3}$.', '$A = 2.835\\ \\mathrm{m^2}$: $T = (2 \\times 1.225 \\times 2.835 \\times 60\\,000^2)^{1/3} = (2.50 \\times 10^{10})^{1/3}$.', '$T = 2920$ N.'] }
  ],
  applications: ['Sizing helicopter rotors and drone propellers for the power available.', 'The Betz limit of wind turbines, which is momentum theory with the disc taking energy out.', 'First estimates of propeller efficiency before blade design begins.', 'Ducted fans and lift fans, where the duct changes the wake contraction.'],
  history: 'W. J. M. Rankine (1865) and R. E. Froude (1889) developed actuator-disc theory for ships\' propellers. Albert Betz used it in 1920 to find the most power a wind turbine can extract, and Hermann Glauert extended it to aircraft propellers and helicopter rotors in the 1920s.',
  sim: 'prop-actuator-disc'
},

/* ================================================================ PROPULSIVE EFFICIENCY */
{
  id: 'propulsive-efficiency', parent: 'thrust-basics', title: 'Propulsive efficiency', level: 2,
  short: 'The useful power T·V₀ divided by the power put into the jet: ηp = 2/(1 + Ve/V₀). A jet only a little faster than the aircraft wastes little energy but needs a huge mass flow — the trade-off behind every engine.',
  keywords: ['propulsive efficiency', 'Froude efficiency', 'jet velocity ratio', 'wasted kinetic energy', 'wake', 'overall efficiency', 'thermal efficiency', 'bypass', 'jet speed'],
  prereq: ['thrust', 'physics:kinetic-energy', 'physics:power'],
  related: ['momentum-theory', 'turbofan', 'turbojet', 'tsfc', 'breguet-range', 'rocket-propulsion', 'physics:efficiency'],
  body: `
Two engines can make the same thrust in very different ways: throw a lot of air backwards slowly, or a little air fast. The thrust depends on $\\dot m (V_e - V_0)$, but the kinetic energy given to the air depends on $\\dot m (V_e^2 - V_0^2)$ — and that is where they differ.

### Useful power and wasted power
Each second the engine pushes the aircraft with force $T$ through a distance $V_0$: the useful power is $T V_0$. The power it puts into the air is the air's gain in kinetic energy, $\\tfrac12 \\dot m (V_e^2 - V_0^2)$. Their ratio is the **propulsive (Froude) efficiency**:

$$\\eta_p = \\frac{T V_0}{\\tfrac12\\dot m\\,(V_e^2 - V_0^2)} = \\frac{2V_0}{V_0 + V_e} = \\frac{2}{1 + V_e/V_0}$$

The difference is left behind in the wake. Seen from the ground, the air ends up moving backwards at $V_e - V_0$ and carries away $\\tfrac12\\dot m (V_e - V_0)^2 = \\tfrac12 T (V_e - V_0)$ of power every second, never to be recovered.

- $V_e/V_0 = 1.1$: 95 %.
- $V_e/V_0 = 2$: 67 %.
- $V_e/V_0 = 3$: 50 %.
- $V_e/V_0 \\to 1$: 100 % — but then there is no thrust unless the mass flow is infinite.

### The trade-off every engine makes
High propulsive efficiency needs a jet only a little faster than the aircraft, and therefore a big mass flow: a big propeller or fan, heavy, in a large nacelle with its own drag. A fast, small jet is compact and light but wastes energy. Designs settle at:

| In cruise | Typical $V_e/V_0$ | $\\eta_p$ |
|---|---|---|
| Propeller (turboprop, 500 km/h) | ≈ 1.1 | ≈ 0.95 ideal; 0.8–0.88 real |
| High-bypass turbofan (bypass ratio 10) | ≈ 1.3–1.5 | ≈ 0.8 |
| Low-bypass turbofan (bypass ratio 1) | ≈ 2 | ≈ 0.65 |
| Turbojet at Mach 0.8 | 2.5–3 | ≈ 0.5 |
| Turbojet at Mach 2 (Concorde) | ≈ 1.6 | ≈ 0.75–0.8 |

The last line is why Concorde used turbojets: at Mach 2 the aircraft itself is fast, so a fast jet is no longer wasteful.

### Overall efficiency
An engine is two machines in series: a heat engine that turns fuel into jet kinetic energy (thermal efficiency $\\eta_{th}$) and a propulsor that turns that into useful work ($\\eta_p$). The **overall efficiency** is their product:

$$\\eta_0 = \\eta_{th}\\,\\eta_p$$

Modern cores reach $\\eta_{th} \\approx 0.5$; with $\\eta_p \\approx 0.8$ a large turbofan in cruise turns about 40 % of its fuel energy into useful work. Nearly all the fuel saved since the turbojets of the 1950s came from raising $\\eta_p$ with ever larger bypass ratios ([[turbofan]]) and $\\eta_{th}$ with hotter, higher-pressure cores ([[turbojet]]). The overall efficiency is what sets the fuel burn — see [[tsfc]] and the [[breguet-range|Breguet range equation]].

### Rockets are different
A rocket's propellant was already moving with the rocket before it was burned, so its kinetic energy counts on the input side too. The rocket's propulsive efficiency, $2(V/c)/(1 + (V/c)^2)$ with $c$ its exhaust velocity, reaches 100 % when the rocket flies at its own exhaust speed and the exhaust is left hanging still in space ([[rocket-propulsion]]).
`,
  ideas: [
    'Propulsive efficiency = useful power T·V₀ ÷ power put into the jet = 2/(1 + Ve/V₀).',
    'The energy lost each second is the kinetic energy left in the wake, ½ṁ(Ve − V₀)² = ½T(Ve − V₀).',
    'High efficiency needs a jet only slightly faster than the aircraft, which needs a very large mass flow.',
    'Overall efficiency = thermal × propulsive; bypass raised the second, hotter cores the first.',
    'A fast aircraft can afford a fast jet: Concorde\'s turbojets were efficient at Mach 2.'
  ],
  pitfalls: [
    'Propulsive efficiency is the efficiency of the engine — It only measures how well jet kinetic energy becomes useful work. The engine\'s overall efficiency also includes the thermal efficiency of turning fuel into that energy: η₀ = η_th·η_p.',
    'A faster jet is better because it gives more thrust per kilogram of air — More thrust per kilogram, yes, but at the price of energy wasted in the wake. For the same thrust a slower, bigger jet burns less fuel, as long as the extra weight and drag of the fan can be carried.',
    'A propulsor could reach 100 % with Ve = V₀ — At Ve = V₀ there is no thrust; efficiency approaches 1 only as the mass flow, and the size of the propulsor, grow without limit.'
  ],
  formulas: [
    {
      name: 'Propulsive (Froude) efficiency',
      expr: 'eta = 2/(1 + Ve/V0)', tex: '\\eta_p = \\dfrac{2}{1 + V_e/V_0}',
      vars: {
        eta: { name: 'propulsive efficiency', tex: '\\eta_p' },
        Ve: { name: 'jet speed', q: 'speed', unit: 'm/s', value: 330, tex: 'V_e' },
        V0: { name: 'flight speed', q: 'speed', unit: 'm/s', value: 245, tex: 'V_0' }
      },
      note: 'For a single jet expanded to ambient pressure, with the fuel mass neglected. Starting values: the fan stream of a high-bypass turbofan at Mach 0.83.',
      practice: { unknowns: ['eta', 'Ve'] },
      stories: {
        eta: 'An engine flying at {V0} produces a jet of {Ve}. What is its propulsive efficiency?',
        Ve: 'An aircraft flies at {V0}. How fast may its jet be for a propulsive efficiency of {eta}?'
      }
    },
    {
      name: 'Power left in the wake',
      expr: 'Pw = 0.5*T*(Ve - V0)', tex: 'P_w = \\tfrac12\\, T\\,(V_e - V_0)',
      vars: {
        Pw: { name: 'kinetic power left in the wake', q: 'power', unit: 'MW', tex: 'P_w' },
        T: { name: 'thrust', q: 'force', unit: 'kN', value: 25 },
        Ve: { name: 'jet speed', q: 'speed', unit: 'm/s', value: 330, tex: 'V_e' },
        V0: { name: 'flight speed', q: 'speed', unit: 'm/s', value: 245, tex: 'V_0' }
      },
      note: 'Equal to ½ṁ(Ve − V₀)², since ṁ(Ve − V₀) = T. Add the useful power T·V₀ to get the whole power put into the jet.',
      stories: { Pw: 'An engine gives {T} at {V0} with a jet of {Ve}. How much power does it leave in its wake?' }
    },
    {
      name: 'Overall efficiency',
      expr: 'eta0 = etath*etap', tex: '\\eta_0 = \\eta_{th}\\,\\eta_p',
      vars: {
        eta0: { name: 'overall efficiency (useful work ÷ fuel energy)', tex: '\\eta_0' },
        etath: { name: 'thermal efficiency (jet kinetic power ÷ fuel power)', value: 0.48, min: 0, max: 1, tex: '\\eta_{th}' },
        etap: { name: 'propulsive efficiency', value: 0.8, min: 0, max: 1, tex: '\\eta_p' }
      },
      note: 'Starting values: a modern high-bypass turbofan in cruise.',
      stories: { eta0: 'An engine\'s core has a thermal efficiency of {etath} and its jets a propulsive efficiency of {etap}. What is its overall efficiency?' }
    },
    {
      name: 'Propulsive efficiency of a rocket',
      expr: 'eta = 2*(V/c)/(1 + (V/c)^2)', tex: '\\eta_p = \\dfrac{2\\,(V/c)}{1 + (V/c)^2}',
      vars: {
        eta: { name: 'propulsive efficiency', tex: '\\eta_p' },
        V: { name: 'rocket speed', q: 'speed', unit: 'm/s', value: 1500 },
        c: { name: 'effective exhaust velocity', q: 'speed', unit: 'm/s', value: 3000 }
      },
      note: 'The propellant\'s kinetic energy before burning is counted as input. The efficiency is the same at V/c and c/V, so solving for V gives two speeds; it reaches 1 at V = c.',
      stories: { eta: 'A rocket with an exhaust velocity of {c} flies at {V}. What is its propulsive efficiency?' }
    }
  ],
  examples: [
    {
      title: 'Turbojet or turbofan for the same thrust',
      q: 'An airliner at 245 m/s needs 25 kN. Compare a turbojet with a jet speed of 600 m/s and a turbofan whose average jet speed is 330 m/s: mass flow, propulsive efficiency, power wasted and power put into the jet.',
      steps: [
        'Turbojet: $\\dot m = 25\\,000/(600 - 245) = 70.4$ kg/s; $\\eta_p = 2/(1 + 600/245) = 0.58$.',
        'Turbofan: $\\dot m = 25\\,000/(330 - 245) = 294$ kg/s; $\\eta_p = 2/(1 + 330/245) = 0.85$.',
        'Useful power for both: $T V_0 = 25\\,000 \\times 245 = 6.13$ MW.',
        'Wasted, $\\tfrac12 T (V_e - V_0)$: turbojet $4.44$ MW, turbofan $1.06$ MW. Power into the jet: $10.56$ MW against $7.19$ MW.'
      ],
      a: 'The fan moves four times the air and needs 32 % less jet power for the same thrust — a third less fuel at the same thermal efficiency.'
    },
    {
      title: 'A rocket at half its exhaust speed',
      q: 'A rocket with an exhaust velocity of 3000 m/s flies at 1500 m/s. What is its propulsive efficiency, and at what other speed would it be the same?',
      steps: [
        '$V/c = 0.5$: $\\eta_p = 2 \\times 0.5/(1 + 0.25) = 0.8$.',
        'The formula is unchanged when $V/c$ is replaced by $c/V$, so $V/c = 2$ — 6000 m/s — gives 0.8 too.'
      ],
      a: '80 %, the same as at 6000 m/s; it peaks at 100 % at 3000 m/s.'
    }
  ],
  quiz: [
    { q: 'A turbojet\'s jet leaves at three times the flight speed. What is its propulsive efficiency (as a fraction)?', answer: 0.5,
      why: 'η_p = 2/(1 + 3) = 0.5: half of the jet power is left behind in the wake.' },
    { q: 'At the same thrust and flight speed, a new engine has a jet 1.4 times the flight speed instead of 2.4 times. The power it must put into the jet is…', choices: ['about 29 % less', 'about 40 % less', 'the same, because the thrust is the same', 'larger, because it moves more air'], a: 0,
      why: 'Jet power = T·V₀/η_p = T·V₀(1 + Ve/V₀)/2, proportional to 1 + Ve/V₀: 2.4/3.4 = 0.71.' },
    { q: 'Concorde\'s turbojets had a better propulsive efficiency at Mach 2 than they would have had at Mach 0.8 with the same jet speed.', a: true,
      why: 'η_p = 2/(1 + Ve/V₀): at Mach 2 the flight speed is far closer to the jet speed, so less energy is left in the wake.' },
    { q: 'Seen from the ground, the kinetic energy left in the wake each second is…', choices: ['½ṁ(Ve − V₀)²', '½ṁVe²', '½ṁV₀²', 'ṁVe(Ve − V₀)'], a: 0,
      why: 'Relative to the ground the air ends up moving backwards at Ve − V₀; its kinetic energy per second is ½ṁ(Ve − V₀)².' },
    { q: 'Why don\'t airliners use even larger fans, with Ve/V₀ ≈ 1.1?', choices: ['The fan\'s weight, the nacelle\'s drag and the installation grow faster than the fuel saved', 'Propulsive efficiency falls above a bypass ratio of 10', 'A slower jet is noisier', 'The thrust would fall to zero'], a: 0,
      why: 'Propulsive efficiency keeps rising, but the gains shrink while the penalties grow; the optimum moves higher only as materials, gearboxes and nacelles improve.' }
  ],
  problems: [
    { q: 'An engine gives 30 kN at 230 m/s with a jet speed of 400 m/s. How much power does it put into the jet?', answer: 9.45, unit: 'MW', tol: 0.02,
      steps: ['Useful power $T V_0 = 30\\,000 \\times 230 = 6.90$ MW.', 'Wake power $\\tfrac12 T(V_e - V_0) = 0.5 \\times 30\\,000 \\times 170 = 2.55$ MW.', 'Total $6.90 + 2.55 = 9.45$ MW. Check: $\\eta_p = 2/(1 + 400/230) = 0.730$ and $6.90/0.730 = 9.45$ MW.'] }
  ],
  applications: ['Choosing a bypass ratio or between a propeller and a fan for a new aircraft.', 'Explaining why turboprops dominate short regional routes and turbofans long ones.', 'Estimating how much fuel a larger fan could save, and what it would cost in weight and drag.', 'Marine propulsion, where large slow propellers beat small fast ones for the same reason.'],
  sim: 'prop-efficiency'
},

/* ================================================================ PROPELLERS */
{
  id: 'propellers', parent: 'thrust-basics', title: 'Propellers', level: 1,
  short: 'A propeller is a set of rotating wings. Each blade section meets the air at the resultant of flight speed and rotation; blade angle minus inflow angle gives its angle of attack. Twist, pitch, tip speed, and fixed-pitch against constant-speed propellers.',
  keywords: ['propeller', 'blade angle', 'pitch', 'geometric pitch', 'twist', 'inflow angle', 'advance angle', 'tip speed', 'tip Mach number', 'constant speed propeller', 'variable pitch', 'feathering', 'reverse pitch', 'governor', 'slipstream', 'torque'],
  prereq: ['momentum-theory', 'lift-equation', 'airfoil-geometry'],
  related: ['propeller-efficiency', 'turboprop', 'helicopter-rotor', 'tip-speed-ratio', 'wind-turbines', 'mach-number', 'lift-to-drag'],
  body: `
A propeller is a set of small rotating wings. Each slice of blade meets the air at the combination of two speeds: the flight speed $V$ along the axis and its own rotational speed $\\Omega r = 2\\pi n r$ across it. The blade makes lift perpendicular to that relative wind, and the lift, tilted slightly back, has a large forward part — thrust — and a small part opposing the rotation, which the engine overcomes as torque.

### Blade angle and angle of attack
The chord of each section is set at the **blade angle** $\\beta$ to the plane of rotation. The air arrives at the **inflow angle** $\\varphi$, with $\\tan\\varphi = V/(2\\pi n r)$ plus a little induced velocity ([[momentum-theory]]), so the angle of attack is

$$\\alpha = \\beta - \\varphi$$

Every section works best at a few degrees, near its best [[lift-to-drag|lift-to-drag ratio]]. Near the hub $\\Omega r$ is small and $\\varphi$ large; near the tip the reverse. So the blade is **twisted**: coarse at the root, fine at the tip. A blade whose every section would advance the same distance per revolution, like a screw in wood, has a constant **geometric pitch**

$$p = 2\\pi r \\tan\\beta$$

and propellers are still sold by diameter and pitch — a "76 × 60" light-aircraft propeller is 76 inches across with 60 inches of pitch. In flight the aircraft advances less than the pitch each turn; the difference, once called slip, is what gives the blades their angle of attack.

### Tip speed
The tips move fastest, at a helical speed $\\sqrt{(\\pi n D)^2 + V^2}$, and it must stay well below the speed of sound, where drag and noise rise steeply:

| | Diameter | Propeller rpm | Tip Mach number (static, sea level) |
|---|---|---|---|
| Light aircraft, 2 blades | 1.9 m | 2700 | ≈ 0.80 |
| Regional turboprop, 6 blades | 3.9 m | 1200 | ≈ 0.72 |
| Military transport, 8 blades | 5.3 m | 860 | ≈ 0.70 |

That is why large propellers turn slowly behind reduction gearboxes, why more power is absorbed with more blades rather than a bigger diameter, and why propeller aircraft rarely cruise faster than about 670 km/h (360 knots): beyond that the helical tip Mach number approaches 1.

### Fixed pitch, variable pitch, constant speed
A **fixed-pitch** propeller is a compromise. A fine "climb" pitch lets the engine reach full rpm on takeoff but over-speeds it in a fast cruise; a coarse "cruise" pitch is efficient in cruise but partly stalls on takeoff. A **variable-pitch** propeller turns its blades in the hub. In the usual **constant-speed** form a governor adjusts the blade angle so that the engine holds the rpm the pilot has selected — fine at low speed, coarse at high — keeping every section near its best angle. The same mechanism can **feather** the blades (nearly 90°, edge-on to the flow) after an engine failure so that the dead propeller does not windmill and drag, and turboprops can go into **reverse pitch** to brake on the runway. How efficiency varies with speed is the propeller's map: [[propeller-efficiency]].

A propeller also twists its slipstream into a spiral that meets the fin at an angle, and its reaction torque tries to roll the aircraft the other way; single-engine aircraft are rigged and trimmed for both.

> [!warn] A turning propeller is nearly invisible and can kill. Stay clear of the propeller arc of any engine that might start, and treat every propeller as live. Procedures such as feathering after an engine failure follow the aircraft's approved manuals and training.
`,
  ideas: [
    'Each blade section is a wing meeting the resultant of the flight speed V and its rotational speed 2πnr.',
    'Angle of attack = blade angle − inflow angle, α = β − φ, with tan φ = V/(2πnr).',
    'Blades are twisted — coarse at the root, fine at the tip — so every section works near its best angle.',
    'Helical tip speed √((πnD)² + V²) must stay subsonic: big propellers turn slowly and use more blades.',
    'A constant-speed propeller changes its blade angle to hold rpm, working well from takeoff to cruise; it can also feather and reverse.'
  ],
  pitfalls: [
    'A propeller pushes air like a paddle — Its blades are wings: the thrust comes from lift on each section, and like any wing a blade stalls if it meets the air at too large an angle.',
    'A constant-speed propeller keeps its blade angle constant — It keeps the rpm constant; the governor changes the blade angle continuously as speed and power change.',
    'Bigger diameter and higher rpm always mean more thrust — Once the tips approach the speed of sound, drag and noise soar and efficiency collapses; the tip Mach number caps both.'
  ],
  formulas: [
    {
      name: 'Helical tip speed',
      expr: 'Vtip = sqrt((pi*n*D)^2 + V^2)', tex: 'V_{tip} = \\sqrt{(\\pi n D)^2 + V^2}',
      vars: {
        Vtip: { name: 'helical tip speed', q: 'speed', unit: 'm/s', tex: 'V_{tip}' },
        n: { name: 'propeller speed', q: 'frequency', unit: 'rpm', value: 2700 },
        D: { name: 'propeller diameter', q: 'length', unit: 'm', value: 1.93 },
        V: { name: 'flight speed', q: 'speed', unit: 'm/s', value: 60 }
      },
      note: 'Divide by the speed of sound (340 m/s at sea level in the standard atmosphere, 295 m/s at 11 000 m) for the tip Mach number; keep it below about 0.85–0.9.',
      stories: {
        Vtip: 'A {D} propeller turns at {n} while the aircraft flies at {V}. How fast do its tips move through the air?',
        n: 'A {D} propeller at {V} must keep its tips below {Vtip}. What is the highest rpm allowed?'
      }
    },
    {
      name: 'Geometric pitch',
      expr: 'p = 2*pi*r*tan(beta)', tex: 'p = 2\\pi r \\tan\\beta',
      vars: {
        p: { name: 'geometric pitch (advance per revolution)', q: 'length', unit: 'm' },
        r: { name: 'radius of the blade section', q: 'length', unit: 'm', value: 0.72 },
        beta: { name: 'blade angle', q: 'angle', unit: '°', value: 18.5, min: 0, max: 89, tex: '\\beta' }
      },
      note: 'A constant-pitch blade has the same p at every radius, so tan β falls as 1/r: that is the twist. The pitch named on a propeller is usually taken at 75 % of the radius.',
      practice: { unknowns: ['p', 'beta'] },
      stories: {
        p: 'A blade section at radius {r} is set at {beta}. What geometric pitch does it have?',
        beta: 'A propeller has a pitch of {p}. At what blade angle must the section at radius {r} be set?'
      }
    },
    {
      name: 'Angle of attack of a blade section',
      expr: 'alpha = beta - atan(V/(2*pi*n*r))', tex: '\\alpha = \\beta - \\arctan\\dfrac{V}{2\\pi n r}',
      vars: {
        alpha: { name: 'angle of attack of the section', q: 'angle', unit: '°', min: -40, max: 70, signed: true, tex: '\\alpha' },
        beta: { name: 'blade angle', q: 'angle', unit: '°', value: 25, min: 0, max: 89, tex: '\\beta' },
        V: { name: 'flight speed', q: 'speed', unit: 'm/s', value: 55 },
        n: { name: 'propeller speed', q: 'frequency', unit: 'rpm', value: 2400 },
        r: { name: 'radius of the section', q: 'length', unit: 'm', value: 0.7 }
      },
      note: 'Ignores the induced velocity, which lowers α by a degree or two in cruise and more at takeoff. The arctangent term is the inflow angle φ.',
      practice: { unknowns: ['alpha', 'V'] },
      stories: {
        alpha: 'A propeller turns at {n}; its section at {r} is set at {beta}. At what angle does it meet the air when the aircraft flies at {V}?',
        V: 'A section at {r} of a propeller turning at {n} is set at {beta}. At what flight speed does it meet the air at {alpha}?'
      }
    }
  ],
  examples: [
    {
      title: 'Tip Mach number of a light-aircraft propeller',
      q: 'A 1.93 m propeller turns at 2700 rpm. What is its tip Mach number static at sea level, and at 60 m/s?',
      steps: [
        '$n = 2700/60 = 45$ rev/s; rotational tip speed $\\pi \\times 45 \\times 1.93 = 273$ m/s.',
        'Static: $273/340 = 0.80$.',
        'At 60 m/s: $\\sqrt{273^2 + 60^2} = 279$ m/s, Mach 0.82.'
      ],
      a: 'About Mach 0.80 static and 0.82 in flight — close enough to the speed of sound to be the main source of propeller noise.'
    },
    {
      title: 'The twist of a constant-pitch blade',
      q: 'A 76 × 60 propeller has a diameter of 1.93 m and a pitch of 60 in = 1.52 m. What blade angle does it have at 0.25 m, at 75 % of the radius (0.724 m) and at the tip (0.965 m)?',
      steps: [
        '$\\tan\\beta = p/(2\\pi r)$.',
        '$r = 0.25$ m: $\\tan\\beta = 1.52/1.571 = 0.968$, $\\beta = 44.1°$.',
        '$r = 0.724$ m: $\\tan\\beta = 1.52/4.549 = 0.334$, $\\beta = 18.5°$.',
        '$r = 0.965$ m: $\\tan\\beta = 1.52/6.063 = 0.251$, $\\beta = 14.1°$.'
      ],
      a: 'From 44° near the hub to 18.5° at 75 % radius and 14° at the tip — 30° of twist.'
    },
    {
      title: 'Why a coarse propeller takes off badly',
      q: 'A section at 0.7 m is set at 25° on a propeller turning at 2400 rpm. What is its angle of attack in a 55 m/s climb and at 15 m/s on the takeoff roll (ignoring induced velocity)?',
      steps: [
        '$2\\pi n r = 2\\pi \\times 40 \\times 0.7 = 176$ m/s.',
        'At 55 m/s: $\\varphi = \\arctan(55/176) = 17.4°$, so $\\alpha = 7.6°$ — a good working angle.',
        'At 15 m/s: $\\varphi = \\arctan(15/176) = 4.9°$, so $\\alpha = 20.1°$ — beyond the stall of a typical section.'
      ],
      a: '7.6° in the climb but about 20° on the takeoff roll: the blade is stalled, the engine is loaded down and the thrust is poor.'
    }
  ],
  quiz: [
    { q: 'Why is a propeller blade twisted?', choices: ['For strength against centrifugal force', 'Because the rotational speed grows with radius, so the inflow angle falls towards the tip', 'To reduce noise', 'So that the tips stall first'], a: 1,
      why: 'tan φ = V/(2πnr) is large near the hub and small near the tip; the blade angle must fall with radius to keep each section at a sensible angle of attack.' },
    { q: 'A constant-speed propeller keeps its blade angle constant throughout the flight.', a: false,
      why: 'It keeps the rpm constant. Its governor coarsens the blades as speed rises and fines them as speed falls or power is reduced.' },
    { q: 'What is the tip speed of a 2 m propeller at 2400 rpm with the aircraft at rest?', answer: 251, unit: 'm/s',
      why: 'π n D = π × 40 × 2 = 251 m/s, Mach 0.74 at sea level.' },
    { q: 'On the takeoff roll, a fixed-pitch propeller chosen for fast cruise…', choices: ['runs at its best efficiency', 'meets the air at a large angle of attack, partly stalls and holds the engine below full rpm', 'over-speeds the engine', 'gives negative thrust'], a: 1,
      why: 'At low speed the inflow angle is small, so a coarse blade meets the air at a large angle: stalled sections, high torque, low rpm and poor thrust.' },
    { q: 'Feathering a propeller means…', choices: ['turning the blades edge-on to the airflow to cut drag after the engine stops', 'reversing the blade angle to brake', 'selecting the finest pitch for takeoff', 'stopping it with a brake'], a: 0,
      why: 'A windmilling propeller on a dead engine makes a large drag; feathered, it stops and its drag falls to a small fraction.' }
  ],
  problems: [
    { q: 'A blade section at 0.7 m radius is set at 20°. What is its geometric pitch?', answer: 1.60, unit: 'm', tol: 0.02,
      steps: ['$p = 2\\pi r\\tan\\beta = 2\\pi \\times 0.7 \\times \\tan 20°$.', '$p = 4.398 \\times 0.364 = 1.60$ m.'] }
  ],
  applications: ['Light aircraft, turboprops, airships and propeller-driven drones.', 'Ship and boat propellers, where cavitation plays the part of compressibility.', 'Cooling fans and ducted fans, designed by the same blade-element methods.', 'Wind turbines — propellers working in reverse.'],
  history: 'The Wright brothers were the first to treat propeller blades as rotating wings, designing their 1903 propellers from their own wind-tunnel data; later tests of replicas put their efficiency at about 70–75 %, far better than the ship-style propellers of their rivals. Controllable-pitch propellers entered service in the early 1930s, and constant-speed propellers with governors followed before the end of the decade.',
  sim: 'prop-map'
},

/* ================================================================ PROPELLER EFFICIENCY */
{
  id: 'propeller-efficiency', parent: 'thrust-basics', title: 'Advance ratio and propeller efficiency', level: 2,
  short: 'Dimensional analysis reduces a propeller to the advance ratio J = V/(nD) and the coefficients C_T and C_P; efficiency is η = J·C_T/C_P. The propeller map shows η against J for every blade angle, and why constant-speed propellers win.',
  keywords: ['advance ratio', 'J', 'thrust coefficient', 'power coefficient', 'torque coefficient', 'propeller efficiency', 'propeller map', 'blade angle', 'constant speed', 'figure of merit', 'static thrust'],
  prereq: ['propellers', 'dimensional-analysis', 'propulsive-efficiency'],
  related: ['turboprop', 'power-required', 'climb-performance', 'force-coefficients', 'similarity-testing', 'momentum-theory'],
  body: `
A propeller's thrust and power depend on its flight speed, rpm, diameter and the air density — far too many variables to tabulate one by one. [[dimensional-analysis|Dimensional analysis]] reduces them to one speed ratio and a few coefficients.

### The advance ratio
$$J = \\frac{V}{nD}$$
is the distance the aircraft moves in one revolution divided by the diameter ($n$ in revolutions per second). It fixes the shape of the velocity triangle at every blade section — the inflow angle at the tip is $\\arctan(J/\\pi)$ — so two propellers of the same shape and blade angle at the same $J$ work alike, whatever their size. $J$ plays for a propeller the part the angle of attack plays for a wing.

### The coefficients
$$T = C_T\\,\\rho n^2 D^4, \\qquad P = C_P\\,\\rho n^3 D^5, \\qquad \\eta = \\frac{TV}{P} = J\\,\\frac{C_T}{C_P}$$

and the torque is $Q = P/(2\\pi n)$. $C_T$ and $C_P$ depend on $J$ and the blade angle $\\beta$ (and, weakly, on Reynolds number and tip Mach number). Measured once in a [[wind-tunnel|wind tunnel]] or computed by blade-element theory, they give the thrust and power of the propeller at any speed, rpm, size and altitude.

### The propeller map
Follow one blade angle as $J$ rises from zero:
1. At $J = 0$ (static) the efficiency is zero — no work is done on an aircraft that is not moving — although the thrust is at its largest. The inner blade is often partly stalled.
2. The efficiency climbs as the sections' angle of attack falls towards its best value, and peaks at about 0.80–0.88 for good propellers.
3. Past the peak it collapses: the blades meet the air nearly edge-on, the thrust falls to zero at a $J$ a little above pitch ÷ diameter, and beyond that the propeller windmills, driven by the air.

Each blade angle has its own curve, the coarser ones peaking at higher $J$. The envelope of their peaks is what a **constant-speed** propeller follows: its governor coarsens the blades as the aircraft speeds up. A fixed-pitch propeller rides a single curve and is efficient near one speed only.

| Light aircraft, 1.9 m propeller at 2400 rpm | V | J | Typical η, fixed pitch |
|---|---|---|---|
| Takeoff roll | 15 m/s | 0.2 | ≈ 0.3 |
| Climb | 40 m/s | 0.53 | ≈ 0.7 |
| Cruise | 60 m/s | 0.79 | ≈ 0.84 |

The static case needs a different yardstick — thrust per unit power, or the **figure of merit** of [[momentum-theory]]. At the other end, compressibility at the tips caps performance: once the helical tip Mach number passes about 0.85–0.9, efficiency falls away. That limits propeller aircraft to modest cruise speeds and is why faster aircraft use [[turbofan|turbofans]].

For performance work, the thrust available from a propeller in flight is $T = \\eta P/V$: at fixed power, thrust falls with speed — the reason propeller aircraft accelerate briskly but have a lower top speed than their power suggests (see [[power-required]]).
`,
  ideas: [
    'The advance ratio J = V/(nD) sets the velocity triangles: same shape, same J, same behaviour at any size.',
    'T = C_T ρn²D⁴ and P = C_P ρn³D⁵; efficiency η = J·C_T/C_P.',
    'For one blade angle, η rises from zero at J = 0 to a peak of about 0.85, then collapses as thrust falls to zero.',
    'Coarser blade angles peak at higher J; a constant-speed propeller follows the envelope of the peaks.',
    'Tip compressibility caps propeller efficiency at high speed.'
  ],
  pitfalls: [
    'Zero efficiency at J = 0 means the propeller is useless there — Static thrust is at its largest at J = 0; efficiency is zero only because the aircraft is not moving, so no useful work is being done.',
    'The best propeller is the one with the highest peak efficiency — A fixed-pitch propeller with a superb peak at cruise may be poor on takeoff and in the climb; what matters is efficiency across the flight, which is why constant-speed propellers exist.',
    'C_T and C_P are constants of a propeller — They are functions of J and blade angle; quoting one value without the J it applies to means nothing.'
  ],
  formulas: [
    {
      name: 'Advance ratio',
      expr: 'J = V/(n*D)', tex: 'J = \\dfrac{V}{n D}',
      vars: {
        J: { name: 'advance ratio' },
        V: { name: 'flight speed', q: 'speed', unit: 'm/s', value: 60 },
        n: { name: 'propeller speed', q: 'frequency', unit: 'rpm', value: 2400 },
        D: { name: 'propeller diameter', q: 'length', unit: 'm', value: 1.9 }
      },
      note: 'n is counted in revolutions per second inside the formula (enter it in rpm). J is the distance flown per revolution divided by the diameter.',
      stories: { J: 'A {D} propeller turns at {n} while the aircraft flies at {V}. What is the advance ratio?', V: 'At what speed does a {D} propeller turning at {n} reach an advance ratio of {J}?' }
    },
    {
      name: 'Propeller thrust from its coefficient',
      expr: 'T = CT*rho*n^2*D^4', tex: 'T = C_T\\,\\rho\\, n^2 D^4',
      vars: {
        T: { name: 'thrust', q: 'force', unit: 'N' },
        CT: { name: 'thrust coefficient', value: 0.05, min: -0.3, max: 0.5, signed: true, tex: 'C_T' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.0, tex: '\\rho' },
        n: { name: 'propeller speed', q: 'frequency', unit: 'rpm', value: 2400 },
        D: { name: 'propeller diameter', q: 'length', unit: 'm', value: 1.9 }
      },
      note: 'n in revolutions per second inside the formula. C_T is read from the propeller map at the operating J and blade angle.',
      practice: { unknowns: ['T', 'CT'] },
      stories: { T: 'A {D} propeller at {n} works at a thrust coefficient of {CT} in air of density {rho}. What thrust does it give?', CT: 'A {D} propeller at {n} gives {T} in air of density {rho}. What is its thrust coefficient?' }
    },
    {
      name: 'Propeller power from its coefficient',
      expr: 'P = CP*rho*n^3*D^5', tex: 'P = C_P\\,\\rho\\, n^3 D^5',
      vars: {
        P: { name: 'shaft power absorbed', q: 'power', unit: 'kW' },
        CP: { name: 'power coefficient', value: 0.047, min: -0.3, max: 1, signed: true, tex: 'C_P' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.0, tex: '\\rho' },
        n: { name: 'propeller speed', q: 'frequency', unit: 'rpm', value: 2400 },
        D: { name: 'propeller diameter', q: 'length', unit: 'm', value: 1.9 }
      },
      note: 'Power grows with the cube of rpm and the fifth power of diameter at the same J. The torque coefficient is C_Q = C_P/2π.',
      stories: { P: 'A {D} propeller at {n} in air of density {rho} runs at a power coefficient of {CP}. How much power does it absorb?' }
    },
    {
      name: 'Propeller efficiency',
      expr: 'eta = J*CT/CP', tex: '\\eta = J\\,\\dfrac{C_T}{C_P}',
      vars: {
        eta: { name: 'propeller efficiency (thrust power ÷ shaft power)', tex: '\\eta' },
        J: { name: 'advance ratio', value: 0.79 },
        CT: { name: 'thrust coefficient', value: 0.05, tex: 'C_T' },
        CP: { name: 'power coefficient', value: 0.047, tex: 'C_P' }
      },
      note: 'Equivalent to η = TV/P. Good propellers peak at about 0.80–0.88.',
      stories: { eta: 'At an advance ratio of {J} a propeller has C_T = {CT} and C_P = {CP}. What is its efficiency?' }
    }
  ],
  examples: [
    {
      title: 'A light aircraft in cruise',
      q: 'A 1.9 m propeller turns at 2400 rpm at 60 m/s where $\\rho = 1.0\\ \\mathrm{kg/m^3}$. Its map gives $C_T = 0.050$ and $C_P = 0.047$. Find J, the efficiency, the thrust and the power.',
      steps: [
        '$n = 40$ rev/s; $J = 60/(40 \\times 1.9) = 0.789$.',
        '$\\eta = 0.789 \\times 0.050/0.047 = 0.84$.',
        '$T = 0.050 \\times 1.0 \\times 40^2 \\times 1.9^4 = 0.050 \\times 1600 \\times 13.03 = 1043$ N.',
        '$P = 0.047 \\times 1.0 \\times 40^3 \\times 1.9^5 = 0.047 \\times 64\\,000 \\times 24.76 = 74.5$ kW (100 hp). Check: $TV = 62.6$ kW $= 0.84 \\times 74.5$.'
      ],
      a: 'J = 0.79, η ≈ 0.84, about 1.04 kN of thrust from 74.5 kW.'
    },
    {
      title: 'Testing a model propeller',
      q: 'A quarter-scale model of that propeller (0.475 m) is tested at the same J and the same tip speed. At what rpm and airspeed, and how does its thrust compare?',
      steps: [
        'Same tip speed: $nD$ constant, so $n = 4 \\times 2400 = 9600$ rpm.',
        'Same J: $V = J n D = 0.789 \\times 160 \\times 0.475 = 60$ m/s — the same airspeed.',
        '$T = C_T \\rho n^2 D^4 = 0.050 \\times 1.0 \\times 160^2 \\times 0.475^4 = 65.2$ N, one sixteenth of full size: at equal $J$ and tip speed, thrust scales with $D^2$.'
      ],
      a: '9600 rpm at 60 m/s, giving 65 N — 1/16 of the full-size thrust.'
    }
  ],
  quiz: [
    { q: 'What is the advance ratio of a 1.8 m propeller turning at 2500 rpm at 50 m/s?', answer: 0.667,
      why: 'n = 41.67 rev/s; J = 50/(41.67 × 1.8) = 0.667.' },
    { q: 'At J = 0 a propeller\'s efficiency is zero because…', choices: ['it produces no thrust', 'the aircraft is not moving, so no useful work is done even though the thrust is large', 'its blades are feathered', 'the engine is idling'], a: 1,
      why: 'Efficiency is TV/P; with V = 0 it is zero, while the static thrust is the largest the propeller gives.' },
    { q: 'For a fixed blade angle, a propeller gives its greatest thrust at the advance ratio of peak efficiency.', a: false,
      why: 'Thrust is greatest at low J (static or slow flight) and falls steadily as J rises; the efficiency peak comes much later, near where the thrust is falling fast.' },
    { q: 'A propeller at J = 0.6 has C_T = 0.08 and C_P = 0.06. What is its efficiency?', answer: 0.8,
      why: 'η = J·C_T/C_P = 0.6 × 0.08/0.06 = 0.80.' },
    { q: 'A constant-speed propeller stays efficient from climb to cruise because…', choices: ['its governor changes the blade angle, moving it from curve to curve on the map near their peaks', 'its rpm changes with speed', 'its diameter changes', 'it has more blades'], a: 0,
      why: 'Each blade angle has its own η–J curve; changing β as J changes keeps the operating point near the envelope of the peaks.' }
  ],
  problems: [
    { q: 'A 2.0 m propeller at 2200 rpm in air of density 1.1 kg/m³ works at C_T = 0.07. What thrust does it give?', answer: 1.66, unit: 'kN', tol: 0.02,
      steps: ['$n = 36.67$ rev/s; $n^2 = 1344$; $D^4 = 16$.', '$T = 0.07 \\times 1.1 \\times 1344 \\times 16 = 1656$ N.'] }
  ],
  applications: ['Matching a propeller to an engine and an aircraft: choosing diameter, blade count and pitch.', 'Performance charts: thrust available against speed for takeoff and climb.', 'Wind-tunnel testing of propeller models and scaling the results.', 'Drone and model-aircraft propeller selection, from published C_T and C_P data.'],
  history: 'William Durand and Everett Lesley at Stanford tested dozens of model propellers for the NACA from 1916, publishing their results in coefficient form; their data and the idea of the propeller map guided propeller design for decades.',
  sim: 'prop-map'
},

/* ================================================================ TURBOJET */
{
  id: 'turbojet', parent: 'engines', title: 'The turbojet', level: 2,
  short: 'A gas turbine whose whole output is a fast jet: intake, compressor, combustor, turbine, nozzle. It runs the Brayton cycle, whose ideal efficiency 1 − r^(−(γ−1)/γ) rises with the pressure ratio; its thrust rises with turbine temperature.',
  keywords: ['turbojet', 'gas turbine', 'Brayton cycle', 'Joule cycle', 'compressor', 'combustor', 'turbine', 'nozzle', 'pressure ratio', 'turbine entry temperature', 'afterburner', 'reheat', 'Whittle', 'von Ohain', 'thermal efficiency'],
  prereq: ['thrust', 'physics:heat-engines', 'stagnation-properties'],
  related: ['turbofan', 'tsfc', 'ramjet-scramjet', 'nozzles', 'isentropic-flow', 'propulsive-efficiency', 'physics:thermodynamic-processes', 'physics:carnot-cycle'],
  body: `
A turbojet is a gas turbine whose whole output is a fast jet. The air passes through five parts:
1. **Intake** — slows the air to about Mach 0.5 at the compressor face; in flight the ram effect already compresses it (1.6 times at Mach 0.85).
2. **Compressor** — rows of rotating and stationary blades squeeze it: 10–20 axial stages in a modern core, each raising the pressure by 15–40 %.
3. **Combustor** — fuel burns at nearly constant pressure, heating the gas to the **turbine entry temperature**, 1400–2000 K.
4. **Turbine** — takes from the hot gas just the work needed to drive the compressor through the shaft.
5. **Nozzle** — expands what is left into a jet of 500–1000 m/s.

### The Brayton cycle
As a [[physics:heat-engines|heat engine]] the turbojet runs the Brayton (or Joule) cycle: adiabatic compression, heating at constant pressure, adiabatic expansion, and — outside the engine, in the atmosphere — cooling at constant pressure. With ideal components its thermal efficiency depends only on the overall pressure ratio $r$ (ram × compressor):

$$\\eta_{th} = 1 - \\frac{1}{r^{(\\gamma-1)/\\gamma}}$$

| Overall pressure ratio | 4 | 10 | 20 | 30 | 50 |
|---|---|---|---|---|---|
| Ideal $\\eta_{th}$ ($\\gamma$ = 1.4) | 33 % | 48 % | 58 % | 62 % | 67 % |

Whittle's first engine ran at a pressure ratio of about 4; modern cores reach 40–60. Real compressors and turbines are 85–92 % efficient, so real efficiencies are lower and the gains flatten, but the direction is clear: higher pressure, higher efficiency.

### Turbine temperature and the jet
The compressor work is enormous. Squeezing air 30 times heats it from 15 °C to about 570 °C and takes some 560 kJ for every kilogram — 56 MW for 100 kg/s. The turbine must give all of that back, and only the energy left over makes the jet, whose speed follows from the [[isentropic-flow|isentropic expansion]] in the [[nozzles|nozzle]]. So the hotter the gas entering the turbine, the more is left: specific thrust (thrust per kg/s of air) rises steeply with turbine entry temperature, and the engine for a given thrust gets smaller. Modern turbines run in gas hotter than the melting point of their nickel-alloy blades, kept alive by single-crystal casting, ceramic coatings and cooling air bled from the compressor.

### Where turbojets fit
A turbojet's jet is fast, so at airliner speeds its [[propulsive-efficiency]] is only about 50 %, and civil turbojets gave way to [[turbofan|turbofans]] in the 1960s. At Mach 2 a fast jet is no longer wasteful: Concorde's Olympus turbojets reached an overall efficiency of about 40 %. An **afterburner** (reheat) burns more fuel in the jet pipe behind the turbine: thrust rises by half or more, fuel per newton roughly doubles — for takeoff, combat and supersonic acceleration. Faster still, ram compression alone suffices and the compressor can go: the [[ramjet-scramjet|ramjet]].
`,
  ideas: [
    'Intake, compressor, combustor, turbine, nozzle: the turbine drives the compressor; what is left makes the jet.',
    'The Brayton cycle\'s ideal thermal efficiency, 1 − r^(−(γ−1)/γ), rises with the overall pressure ratio.',
    'Compression costs a great deal of work; a hotter turbine entry leaves more for the jet and raises specific thrust.',
    'Turbojets have fast jets and poor propulsive efficiency at subsonic speeds, but suit Mach 2 flight.',
    'An afterburner adds much thrust for much more fuel per newton.'
  ],
  pitfalls: [
    'The turbine produces the thrust — The turbine only drives the compressor; the thrust is the reaction to the gas accelerated through the whole engine, finally in the nozzle.',
    'A higher pressure ratio always gives more thrust — It raises efficiency, but at a fixed turbine temperature the specific thrust peaks at a moderate pressure ratio and then falls, because the compressor delivers the air ever hotter and less fuel can be added.',
    'Jet engines are inefficient because they are jets — Their cores are among the most efficient heat engines in use; it is the fast jet of a pure turbojet that wastes energy at low flight speed.'
  ],
  formulas: [
    {
      name: 'Ideal Brayton cycle efficiency',
      expr: 'eta = 1 - r^(-(gamma - 1)/gamma)', tex: '\\eta_{th} = 1 - r^{-(\\gamma-1)/\\gamma}',
      vars: {
        eta: { name: 'ideal thermal efficiency', tex: '\\eta_{th}' },
        r: { name: 'overall pressure ratio (ram × compressor)', value: 30, min: 1, max: 200 },
        gamma: { name: 'ratio of specific heats', value: 1.4, min: 1.05, max: 1.67, tex: '\\gamma' }
      },
      note: 'Perfect components and a perfect gas with constant properties. Real engines reach perhaps 75–85 % of this.',
      practice: { unknowns: ['eta', 'r'] },
      stories: { eta: 'An engine has an overall pressure ratio of {r}. What is the ideal efficiency of its Brayton cycle with γ = {gamma}?', r: 'What overall pressure ratio would give an ideal Brayton efficiency of {eta} with γ = {gamma}?' }
    },
    {
      name: 'Compressor exit temperature',
      expr: 'T3 = T2*(1 + (r^((gamma - 1)/gamma) - 1)/etac)', tex: 'T_3 = T_2\\left[1 + \\dfrac{r^{(\\gamma-1)/\\gamma} - 1}{\\eta_c}\\right]',
      vars: {
        T3: { name: 'compressor exit temperature', q: 'temperature', unit: 'K', tex: 'T_3' },
        T2: { name: 'compressor inlet temperature', q: 'temperature', unit: 'K', value: 288.15, tex: 'T_2' },
        r: { name: 'compressor pressure ratio', value: 30, min: 1, max: 80 },
        gamma: { name: 'ratio of specific heats', value: 1.4, min: 1.05, max: 1.67, tex: '\\gamma' },
        etac: { name: 'compressor isentropic efficiency', value: 0.85, min: 0.5, max: 1, tex: '\\eta_c' }
      },
      note: 'Stagnation temperatures. η_c = 1 gives the ideal (isentropic) temperature; losses heat the air further.',
      practice: { unknowns: ['T3', 'r'] },
      stories: { T3: 'A compressor with an isentropic efficiency of {etac} raises the pressure {r} times, taking in air at {T2}. How hot is the air it delivers (γ = {gamma})?' }
    },
    {
      name: 'Compressor work per kilogram',
      expr: 'w = cp*(T3 - T2)', tex: 'w = c_p\\,(T_3 - T_2)',
      vars: {
        w: { name: 'work per kilogram of air', q: 'specificenergy', unit: 'kJ/kg' },
        cp: { name: 'specific heat of air', q: 'specificheat', unit: 'J/(kg·K)', value: 1004.5, tex: 'c_p' },
        T3: { name: 'compressor exit temperature', q: 'temperature', unit: 'K', value: 845, tex: 'T_3' },
        T2: { name: 'compressor inlet temperature', q: 'temperature', unit: 'K', value: 288.15, tex: 'T_2' }
      },
      note: 'The steady-flow energy equation; the turbine must supply the same work (plus a little for bearings and accessories).',
      stories: { w: 'A compressor takes air in at {T2} and delivers it at {T3}. How much work does each kilogram need (c_p = {cp})?' }
    },
    {
      name: 'Ideal jet speed from the nozzle',
      expr: 'Ve = sqrt(2*cp*Tt*(1 - (pa/pt)^((gamma - 1)/gamma)))', tex: 'V_e = \\sqrt{2c_p T_t\\left[1 - \\left(\\dfrac{p_a}{p_t}\\right)^{(\\gamma-1)/\\gamma}\\right]}',
      vars: {
        Ve: { name: 'jet speed', q: 'speed', unit: 'm/s', tex: 'V_e' },
        cp: { name: 'specific heat of the gas', q: 'specificheat', unit: 'J/(kg·K)', value: 1150, tex: 'c_p' },
        Tt: { name: 'stagnation temperature entering the nozzle', q: 'temperature', unit: 'K', value: 900, tex: 'T_t' },
        pa: { name: 'ambient pressure (absolute)', q: 'pressure', unit: 'kPa', value: 22.6, tex: 'p_a' },
        pt: { name: 'stagnation pressure entering the nozzle (absolute)', q: 'pressure', unit: 'kPa', value: 90, tex: 'p_t' },
        gamma: { name: 'ratio of specific heats of the gas', value: 1.33, min: 1.05, max: 1.67, tex: '\\gamma' }
      },
      note: 'Isentropic expansion to ambient pressure (a convergent–divergent nozzle if the pressure ratio exceeds about 1.85). Hot combustion gas: c_p ≈ 1150 J/(kg·K), γ ≈ 1.33.',
      practice: { unknowns: ['Ve', 'Tt'] },
      stories: { Ve: 'Gas at {Tt} and {pt} expands in a nozzle to the ambient {pa}. How fast is the jet (c_p = {cp}, γ = {gamma})?' }
    }
  ],
  examples: [
    {
      title: 'Pressure ratio and efficiency',
      q: 'Compare the ideal Brayton efficiency of an early engine (overall pressure ratio 4) with a modern core (30).',
      steps: [
        '$(\\gamma - 1)/\\gamma = 0.2857$.',
        '$r = 4$: $4^{0.2857} = 1.486$, $\\eta = 1 - 1/1.486 = 0.327$.',
        '$r = 30$: $30^{0.2857} = 2.643$, $\\eta = 1 - 1/2.643 = 0.622$.'
      ],
      a: 'About 33 % against 62 %: pressure ratio is the main lever on a gas turbine\'s efficiency.'
    },
    {
      title: 'The cost of compression',
      q: 'A compressor with an isentropic efficiency of 0.85 raises air at 288 K to 30 times its pressure. Find the delivery temperature, the work per kilogram and the power for 100 kg/s.',
      steps: [
        'Ideal: $T_{3s} = 288.15 \\times 30^{0.2857} = 761.5$ K, a rise of 473 K.',
        'Real: $\\Delta T = 473.3/0.85 = 557$ K, so $T_3 = 845$ K (572 °C).',
        '$w = 1004.5 \\times 557 = 559$ kJ/kg; for 100 kg/s, 55.9 MW.'
      ],
      a: 'About 845 K and 559 kJ/kg — 56 MW (75 000 hp) for 100 kg/s, all of which the turbine must return.'
    },
    {
      title: 'The jet speed',
      q: 'Gas leaves a turbojet\'s turbine at a stagnation temperature of 900 K and 90 kPa and expands to 22.6 kPa at 11 000 m. How fast is the jet ($c_p$ = 1150 J/(kg·K), $\\gamma$ = 1.33)?',
      steps: [
        '$(22.6/90)^{0.33/1.33} = 0.2511^{0.2481} = 0.710$.',
        '$V_e = \\sqrt{2 \\times 1150 \\times 900 \\times (1 - 0.710)} = \\sqrt{600\\,900} = 775$ m/s.'
      ],
      a: 'About 775 m/s — more than three times the cruise speed of an airliner, hence the poor propulsive efficiency.'
    }
  ],
  quiz: [
    { q: 'What is the ideal Brayton efficiency at an overall pressure ratio of 16 (γ = 1.4)?', answer: 0.547,
      why: '16^0.2857 = 2.208; η = 1 − 1/2.208 = 0.547.' },
    { q: 'The turbine of a turbojet…', choices: ['drives the compressor, taking just the work the compressor needs', 'provides most of the thrust directly', 'cools the combustor', 'compresses the exhaust gas'], a: 0,
      why: 'Its job is to power the compressor (and accessories); the energy left in the gas after it goes into the jet.' },
    { q: 'Raising the turbine entry temperature mainly raises the specific thrust — the thrust per kg/s of air.', a: true,
      why: 'More heat is added per kilogram while the compressor work stays the same, so more energy is left for the jet; the engine can be smaller for the same thrust.' },
    { q: 'Why did airliners give up pure turbojets in the 1960s?', choices: ['Their jets were too fast for good propulsive efficiency at airliner speeds', 'They could not fly above 10 000 m', 'Their thermal efficiency was higher than turbofans\'', 'They were too quiet for airports'], a: 0,
      why: 'A jet two or three times faster than the aircraft leaves half its energy in the wake; turbofans cut the jet speed and the fuel burn.' },
    { q: 'An afterburner…', choices: ['raises the thrust a lot and the fuel per newton even more', 'raises the thrust and lowers the fuel per newton', 'is used for economical cruise', 'recovers heat from the exhaust'], a: 0,
      why: 'Burning fuel at low pressure behind the turbine is thermally inefficient; reheat buys thrust at a high price in fuel.' }
  ],
  problems: [
    { q: 'A compressor with a pressure ratio of 25 and an isentropic efficiency of 0.88 takes in air at 250 K. What is the delivery temperature?', answer: 679, unit: 'K', tol: 0.02,
      steps: ['$25^{0.2857} = 2.508$; ideal rise $250 \\times 1.508 = 377$ K.', 'Real rise $377/0.88 = 429$ K; $T_3 = 679$ K.'] }
  ],
  applications: ['Supersonic aircraft and missiles, where a fast jet is not wasteful.', 'The cores of every turbofan, turboprop and turboshaft.', 'Industrial and marine gas turbines, which use the same Brayton cycle for power.', 'Auxiliary power units in airliners.'],
  history: 'Frank Whittle patented the turbojet in 1930 and ran his first engine in April 1937; Hans von Ohain\'s engine flew first, in the Heinkel He 178 on 27 August 1939, and Whittle\'s in the Gloster E.28/39 in May 1941. The Junkers Jumo 004 of the Messerschmitt Me 262 was the first to be mass-produced; with a pressure ratio near 3 and poor high-temperature alloys it lasted only tens of hours between overhauls.',
  sim: 'prop-brayton'
},

/* ================================================================ TURBOFAN */
{
  id: 'turbofan', parent: 'engines', title: 'The turbofan and bypass ratio', level: 2,
  short: 'A turbojet core that also drives a large fan: most of the air bypasses the core and leaves as a slower, cooler jet. The bypass ratio sets the balance — higher ratios burn less fuel and make less noise, at the cost of size and weight.',
  keywords: ['turbofan', 'bypass ratio', 'BPR', 'fan', 'fan pressure ratio', 'high bypass', 'low bypass', 'geared turbofan', 'open rotor', 'core', 'nacelle', 'jet noise', 'thrust lapse', 'CFM56', 'GE9X'],
  prereq: ['turbojet', 'propulsive-efficiency'],
  related: ['tsfc', 'turboprop', 'propellers', 'breguet-range', 'range-endurance', 'momentum-theory'],
  body: `
A turbofan is a turbojet that shares its energy. Its core — compressor, combustor, turbine — is a [[turbojet]], but the turbine also drives a large **fan** at the front. Some of the fan's air goes through the core; most goes round it, through the bypass duct, and leaves as a cool, slower jet. The **bypass ratio** is the mass flow round the core divided by the mass flow through it:

$$\\mathrm{BPR} = \\frac{\\dot m_b}{\\dot m_c}$$

### Why bypass
From [[propulsive-efficiency]]: the same thrust from more air, speeded up less, wastes less energy in the wake. A turbojet at cruise throws its jet back at two to three times the flight speed; a high-bypass fan jet is only about 1.3–1.5 times faster than the aircraft. The core's thermal efficiency hardly changes — the fan takes energy that would have made a fast core jet and spreads it over five to twelve times as much air. The net thrust is the sum of the two streams:

$$T = \\dot m_c\\,(V_c - V_0) + \\dot m_b\\,(V_b - V_0)$$

In a high-bypass engine the fan stream gives about 80 % of the thrust.

| Engine class | Bypass ratio | Fan pressure ratio | Cruise TSFC, lb/(lbf·h) |
|---|---|---|---|
| Turbojet (1950s) | 0 | — | ≈ 1.0 |
| Early civil turbofan (1960s) | ≈ 1 | ≈ 2 | ≈ 0.8 |
| Military afterburning turbofan | 0.3–0.7 | 3–4.5 | ≈ 0.8 dry |
| CFM56 class (single-aisle airliners) | 5–6 | ≈ 1.7 | ≈ 0.63 |
| GE90 and GE9X class (large twins) | 8–10 | ≈ 1.5 | ≈ 0.52 |
| Geared turbofan | 11–12.5 | ≈ 1.4 | ≈ 0.5 |

The trend continues towards 15 and beyond (the Rolls-Royce UltraFan demonstrator first ran in 2023) and to open fans with no duct at all. Each step costs a larger, heavier fan, a bigger nacelle with more drag, and a harder installation under a wing — the GE9X's fan is 3.4 m across. Big fans must turn slowly to keep their tips subsonic, while the low-pressure turbine that drives them wants to turn fast, so **geared turbofans** put a gearbox of about 3:1 between them.

### The fan and the core
For each bypass ratio there is a fan pressure ratio that burns least fuel — roughly when the fan jet and the core jet have similar speeds. A core can drive only so much fan: ask for too high a fan pressure ratio at a high bypass ratio and the turbine runs out of energy, the core jet dies. Bigger bypass ratios therefore need hotter, higher-pressure cores, which is why engine makers push both together ([[tsfc]] shows the result).

### Other effects
- **Noise**: jet noise grows roughly with the eighth power of jet speed (Lighthill's law), so slower jets are far quieter — the main reason airliners became so much quieter than the turbojets before them.
- **Thrust lapse**: a high-bypass engine's thrust falls faster with flight speed than a turbojet's, because its slow fan jet has little margin over $V_0$. An engine sized for cruise has ample takeoff thrust.
- **Military engines** keep low bypass ratios: they need high thrust from a small frontal area, supersonic flight and afterburning.
`,
  ideas: [
    'A turbofan\'s core drives a fan; most of the air bypasses the core. Bypass ratio = ṁ_bypass/ṁ_core.',
    'Moving more air more slowly raises propulsive efficiency: thrust = ṁ_c(V_c − V₀) + ṁ_b(V_b − V₀).',
    'From bypass ratio 0 to 10 the cruise fuel per newton falls by about 40–50 %.',
    'Bigger fans cost weight, drag and installation difficulty; geared fans let fan and turbine each turn at their best speed.',
    'Slower jets are much quieter; high-bypass thrust lapses faster with speed.'
  ],
  pitfalls: [
    'The fan is just a big compressor stage feeding the core — Most of the fan\'s air never enters the core; in a high-bypass engine the fan stream itself gives about 80 % of the thrust.',
    'Higher bypass ratio saves fuel because the core becomes more efficient — The saving is almost all propulsive: the same core energy spread over more air. A better core (pressure ratio, temperature) is a separate gain.',
    'A turbofan is best at every speed — At supersonic speeds a fast jet is no longer wasteful and a big fan is a liability, which is why fighters and Concorde used low or zero bypass.'
  ],
  formulas: [
    {
      name: 'Bypass ratio',
      expr: 'BPR = mb/mc', tex: '\\mathrm{BPR} = \\dfrac{\\dot m_b}{\\dot m_c}',
      vars: {
        BPR: { name: 'bypass ratio', tex: '\\mathrm{BPR}' },
        mb: { name: 'mass flow through the bypass duct', q: 'massflow', unit: 'kg/s', value: 284, tex: '\\dot m_b' },
        mc: { name: 'mass flow through the core', q: 'massflow', unit: 'kg/s', value: 55.7, tex: '\\dot m_c' }
      },
      note: 'Starting values: a CFM56-7B-class engine at takeoff (about 340 kg/s in all).',
      stories: { BPR: 'A turbofan passes {mb} round its core and {mc} through it. What is its bypass ratio?', mc: 'An engine with a bypass ratio of {BPR} passes {mb} through its bypass duct. How much air goes through the core?' }
    },
    {
      name: 'Thrust of a separate-jet turbofan',
      expr: 'T = mc*(Vc - V0) + mb*(Vb - V0)', tex: 'T = \\dot m_c\\,(V_c - V_0) + \\dot m_b\\,(V_b - V_0)',
      vars: {
        T: { name: 'net thrust', q: 'force', unit: 'kN' },
        mc: { name: 'core mass flow', q: 'massflow', unit: 'kg/s', value: 17.3, tex: '\\dot m_c' },
        Vc: { name: 'core jet speed', q: 'speed', unit: 'm/s', value: 444, tex: 'V_c' },
        mb: { name: 'bypass mass flow', q: 'massflow', unit: 'kg/s', value: 173, tex: '\\dot m_b' },
        Vb: { name: 'bypass (fan) jet speed', q: 'speed', unit: 'm/s', value: 359, tex: 'V_b' },
        V0: { name: 'flight speed', q: 'speed', unit: 'm/s', value: 236, tex: 'V_0' }
      },
      note: 'Fuel mass and pressure thrust neglected. Starting values: a bypass-ratio-10 engine in cruise at Mach 0.8, 11 000 m.',
      practice: { unknowns: ['T', 'Vb'] },
      stories: { T: 'At {V0} a turbofan passes {mc} through its core, leaving at {Vc}, and {mb} through its fan duct, leaving at {Vb}. What is its thrust?', Vb: 'At {V0} an engine needs {T}. Its core passes {mc} at {Vc}; its fan duct passes {mb}. How fast must the fan jet be?' }
    },
    {
      name: 'Specific thrust',
      expr: 'Fs = T/ma', tex: 'F_s = \\dfrac{T}{\\dot m_a}',
      vars: {
        Fs: { name: 'specific thrust (N per kg/s of air)', q: 'speed', unit: 'm/s', tex: 'F_s' },
        T: { name: 'thrust', q: 'force', unit: 'kN', value: 25 },
        ma: { name: 'total air mass flow (core + bypass)', q: 'massflow', unit: 'kg/s', value: 190, tex: '\\dot m_a' }
      },
      note: 'N·s/kg is the same as m/s: specific thrust is the average speed added to the air. High-bypass engines in cruise: 100–150; turbojets: 600–900. Low specific thrust means a big, efficient engine.',
      stories: { Fs: 'An engine gives {T} from {ma} of air. What is its specific thrust?', ma: 'An engine with a specific thrust of {Fs} must give {T}. How much air must it handle?' }
    }
  ],
  examples: [
    {
      title: 'A CFM56-class engine at takeoff',
      q: 'An engine with a bypass ratio of 5.1 passes 340 kg/s in all. On the brakes, its core jet leaves at 480 m/s and its fan jet at 330 m/s. Find the thrust and the fan\'s share.',
      steps: [
        'Core: $\\dot m_c = 340/6.1 = 55.7$ kg/s; bypass $284.3$ kg/s.',
        'Static ($V_0 = 0$): $T = 55.7 \\times 480 + 284.3 \\times 330 = 26\\,760 + 93\\,800 = 120\\,600$ N.',
        'Fan share: $93.8/120.6 = 78$ %.'
      ],
      a: 'About 121 kN, 78 % of it from the fan stream.'
    },
    {
      title: 'The same thrust from a turbojet',
      q: 'How much jet power would a turbojet with a 700 m/s jet need for the same 120.6 kN static thrust, compared with the turbofan above?',
      steps: [
        'Turbojet: $\\dot m = 120\\,600/700 = 172$ kg/s; jet power $\\tfrac12 \\times 172 \\times 700^2 = 42.2$ MW.',
        'Turbofan: $\\tfrac12(55.7 \\times 480^2 + 284.3 \\times 330^2) = 21.9$ MW.'
      ],
      a: 'The turbojet needs about 42 MW of jet power, nearly twice the turbofan\'s 22 MW, for the same thrust.'
    }
  ],
  quiz: [
    { q: 'A turbofan moves 600 kg/s in all, 60 kg/s of it through the core. What is its bypass ratio?', answer: 9,
      why: 'Bypass flow 540 kg/s; BPR = 540/60 = 9.' },
    { q: 'The main reason a high-bypass turbofan burns less fuel than a turbojet at airliner speeds is…', choices: ['higher propulsive efficiency: slower, bigger jets', 'a much more efficient core', 'the fan adds energy without fuel', 'the nacelle has less drag'], a: 0,
      why: 'The core\'s energy is spread over more air, lowering the jet speed and the energy left in the wake.' },
    { q: 'In a modern high-bypass turbofan most of the thrust comes from the core jet.', a: false,
      why: 'About 80 % comes from the fan stream; the core is mostly a gas generator driving the fan.' },
    { q: 'Why do geared turbofans have a gearbox?', choices: ['The big fan must turn slowly to keep its tips subsonic, while the turbine driving it is efficient only when it turns fast', 'To reverse the fan for braking', 'To drive the electrical generator', 'So the fan can stop in cruise'], a: 0,
      why: 'Without a gearbox the low-pressure turbine must turn at fan speed and needs many stages; the gearbox lets each run at its best speed.' },
    { q: 'Why do fighter engines keep low bypass ratios?', choices: ['They need high thrust from a small frontal area and fly supersonic, where a fast jet is not wasteful', 'Low bypass is quieter', 'High-bypass engines cannot be made to work at altitude', 'Fighters never fly at cruise power'], a: 0,
      why: 'Specific thrust (thrust per unit of air and of frontal area) matters more than propulsive efficiency for supersonic combat aircraft.' }
  ],
  problems: [
    { q: 'On the brakes, a turbofan\'s core passes 40 kg/s at 450 m/s and its fan duct 360 kg/s at 300 m/s. What is the static thrust?', answer: 126, unit: 'kN', tol: 0.02,
      steps: ['Static: $V_0 = 0$.', '$T = 40 \\times 450 + 360 \\times 300 = 18\\,000 + 108\\,000 = 126\\,000$ N.'] }
  ],
  applications: ['Nearly every airliner and business jet flying today.', 'Military transports and tankers (high bypass) and fighters (low bypass with afterburning).', 'Engine design studies trading fan size against weight, drag and fuel burn.', 'Noise certification: slower jets and acoustic liners made modern airliners far quieter.'],
  history: 'The Rolls-Royce Conway, in airline service from 1960 on the Boeing 707 and Douglas DC-8, was the first bypass engine in service, with a bypass ratio of about 0.3; the Pratt & Whitney JT3D fan followed within a year. The first high-bypass engine, General Electric\'s TF39 (bypass ratio 8) for the C-5 Galaxy, flew in the late 1960s, and its civil cousins — the JT9D, CF6 and RB211 — made the wide-body airliner possible.',
  sim: 'prop-turbofan'
},

/* ================================================================ TSFC */
{
  id: 'tsfc', parent: 'engines', title: 'Specific fuel consumption', level: 2,
  short: 'Thrust-specific fuel consumption is the fuel burned per unit thrust per hour: 0.5–0.6 lb/(lbf·h) for a modern turbofan in cruise, about 1 for a turbojet. It is linked to overall efficiency by η₀ = gV₀/(c_t Q_R) and to specific impulse by I_sp = 1/c_t.',
  keywords: ['TSFC', 'SFC', 'specific fuel consumption', 'thrust specific fuel consumption', 'fuel flow', 'lb/lbf/h', 'g/kN/s', 'overall efficiency', 'specific impulse', 'PSFC', 'BSFC', 'fuel burn'],
  prereq: ['thrust', 'propulsive-efficiency', 'turbojet'],
  related: ['breguet-range', 'range-endurance', 'turbofan', 'turboprop', 'rocket-propulsion', 'electric-propulsion'],
  body: `
How thirsty is an engine? For a jet the natural measure is the fuel burned per unit of thrust per unit of time: the **thrust-specific fuel consumption**, TSFC. It is the number that enters the range of an aircraft through the [[breguet-range|Breguet equation]], and the one engine makers compete on.

### Units
TSFC is quoted as mass of fuel per hour per unit thrust. In SI, grams per kilonewton per second, g/(kN·s) (the same as mg/(N·s)). In the English units still common in the industry, pounds of fuel per hour per pound of thrust, lb/(lbf·h) — numerically the same as kg/(kgf·h). Because a pound of fuel *weighs* one pound-force, that number is really a weight flow divided by a force: a pure rate, "per hour":

$$c_t = \\frac{g\\,\\dot m_f}{T}, \\qquad 1\\ \\mathrm{lb/(lbf\\cdot h)} = 1\\ \\mathrm{h^{-1}} = 28.3\\ \\mathrm{g/(kN\\cdot s)}$$

A $c_t$ of 0.6 per hour means the engine burns its own thrust's weight of fuel every 1/0.6 = 1.7 hours.

| Engine | Condition | TSFC, lb/(lbf·h) | g/(kN·s) |
|---|---|---|---|
| High-bypass turbofan | static, sea level | 0.28–0.36 | 8–10 |
| High-bypass turbofan (bypass ratio 10) | cruise, Mach 0.85 | 0.50–0.55 | 14–16 |
| CFM56 class (bypass ratio 5–6) | cruise | ≈ 0.63 | ≈ 18 |
| Turbojet | cruise, Mach 0.8 | 0.9–1.1 | 25–31 |
| Concorde's Olympus turbojet | cruise, Mach 2 | ≈ 1.2 | ≈ 34 |
| Afterburning turbofan | full reheat | ≈ 2 | ≈ 57 |
| Hydrogen–oxygen rocket | vacuum, $I_{sp}$ = 450 s | 8 | 227 |

### TSFC rises with speed — and that is not bad
Compare engines only at the same flight speed. The overall efficiency is the useful power over the fuel power:

$$\\eta_0 = \\frac{T V_0}{\\dot m_f\\, Q_R} = \\frac{g\\,V_0}{c_t\\, Q_R}$$

with $Q_R \\approx 43$ MJ/kg for kerosene. A turbofan burns roughly twice as much fuel per newton in cruise as on the runway — but in cruise it does work at 240 m/s, on the runway at none. Concorde's 1.2 looks dreadful beside 0.55, yet at Mach 2 it means an overall efficiency of about 40 %, as good as the best subsonic engines of its day.

### Specific impulse
Rocket engineers use the inverse, the [[rocket-propulsion|specific impulse]] $I_{sp} = T/(\\dot m g_0)$ in seconds. With TSFC counted per hour, the link is simply $I_{sp} = 1/c_t$ (with $c_t$ in s⁻¹): a turbofan at 0.55 lb/(lbf·h) has an $I_{sp}$ of about 6500 s, a hydrogen rocket 450 s. Air-breathing engines look so good because the oxygen and most of the mass they throw back come free from the atmosphere.

### Shaft engines
Piston engines, turboprops and turboshafts deliver power, not thrust, and are rated by **power-specific fuel consumption** (PSFC, or BSFC for pistons) in kg per kW per hour. A good aviation piston engine uses 0.23–0.27 kg/(kW·h), a turboprop 0.28–0.33 in cruise. Since 1 kW·h is 3.6 MJ, the thermal efficiency is $3.6/(\\text{PSFC} \\times Q_R)$ with $Q_R$ in MJ/kg: 0.25 kg/(kW·h) means about 33 %.

> [!note] Fuel figures here are typical and rounded; flight planning uses the aircraft's approved performance data.
`,
  ideas: [
    'TSFC = fuel flow per unit thrust; 1 lb/(lbf·h) = 1 per hour = 28.3 g/(kN·s).',
    'Modern high-bypass turbofans: about 0.5–0.55 per hour in cruise; turbojets about 1.',
    'Overall efficiency η₀ = gV₀/(c_t Q_R): TSFC must be compared at the same flight speed.',
    'Specific impulse is the inverse of TSFC: I_sp = 1/c_t, thousands of seconds for air-breathers.',
    'Shaft engines are rated per unit power: 0.25 kg/(kW·h) is about 33 % thermal efficiency.'
  ],
  pitfalls: [
    'A lower TSFC always means a more efficient engine — Only at the same flight speed. An engine at takeoff has a far lower TSFC than in cruise yet is doing almost no useful work; Concorde\'s high TSFC at Mach 2 hid an excellent overall efficiency.',
    'lb/(lbf·h) mixes mass and force, so it cannot be converted cleanly — Because a pound of fuel weighs a pound-force at standard gravity, the unit is simply per hour; in SI it is 28.3 g/(kN·s).',
    'Air-breathing engines have a high specific impulse because they burn better than rockets — They carry only the fuel; the oxidiser and nearly all the mass they throw back come from the air, which does not count as propellant.'
  ],
  formulas: [
    {
      name: 'Thrust-specific fuel consumption',
      expr: 'ct = g*mf/T', tex: 'c_t = \\dfrac{g_0\\,\\dot m_f}{T}',
      vars: {
        ct: { name: 'TSFC (1/h is the same as lb/(lbf·h))', q: 'rate', unit: '1/h', tex: 'c_t' },
        g: { const: 'g', tex: 'g_0' },
        mf: { name: 'fuel mass flow', q: 'massflow', unit: 'kg/h', value: 1300, tex: '\\dot m_f' },
        T: { name: 'thrust', q: 'force', unit: 'kN', value: 21 }
      },
      note: 'Weight-based TSFC. Multiply by 28.33 to get g/(kN·s). Starting values: one engine of a single-aisle airliner in cruise.',
      practice: { unknowns: ['ct', 'mf'] },
      stories: { ct: 'An engine giving {T} burns {mf} of fuel. What is its TSFC?', mf: 'An engine with a TSFC of {ct} gives {T}. How much fuel does it burn?' }
    },
    {
      name: 'Overall efficiency from TSFC',
      expr: 'eta = g*V0/(ct*QR)', tex: '\\eta_0 = \\dfrac{g_0\\,V_0}{c_t\\,Q_R}',
      vars: {
        eta: { name: 'overall efficiency', tex: '\\eta_0' },
        g: { const: 'g', tex: 'g_0' },
        V0: { name: 'flight speed', q: 'speed', unit: 'm/s', value: 240, tex: 'V_0' },
        ct: { name: 'TSFC', q: 'rate', unit: '1/h', value: 0.6, tex: 'c_t' },
        QR: { name: 'fuel heating value (lower)', q: 'specificenergy', unit: 'MJ/kg', value: 43, tex: 'Q_R' }
      },
      note: 'Kerosene: about 43 MJ/kg; hydrogen: 120 MJ/kg.',
      stories: { eta: 'An engine flying at {V0} has a TSFC of {ct} on fuel of {QR}. What is its overall efficiency?', ct: 'What TSFC would give an overall efficiency of {eta} at {V0} on fuel of {QR}?' }
    },
    {
      name: 'TSFC and specific impulse',
      expr: 'Isp = 1/ct', tex: 'I_{sp} = \\dfrac{1}{c_t}',
      vars: {
        Isp: { name: 'specific impulse', q: 'time', unit: 's', tex: 'I_{sp}' },
        ct: { name: 'TSFC', q: 'rate', unit: '1/h', value: 0.6, tex: 'c_t' }
      },
      note: 'For an air-breathing engine the propellant counted is the fuel only. In lb/(lbf·h), I_sp = 3600/TSFC seconds.',
      stories: { Isp: 'A turbofan has a TSFC of {ct}. What is its specific impulse?', ct: 'A rocket engine has a specific impulse of {Isp}. What is its TSFC?' }
    },
    {
      name: 'Fuel burned in a cruise',
      expr: 'mfuel = ct*T*t/g', tex: 'm_{fuel} = \\dfrac{c_t\\,T\\,t}{g_0}',
      vars: {
        mfuel: { name: 'fuel burned', q: 'mass', unit: 'kg', tex: 'm_{fuel}' },
        ct: { name: 'TSFC', q: 'rate', unit: '1/h', value: 0.6, tex: 'c_t' },
        T: { name: 'total thrust', q: 'force', unit: 'kN', value: 42 },
        t: { name: 'time', q: 'time', unit: 'h', value: 2 },
        g: { const: 'g', tex: 'g_0' }
      },
      note: 'At constant thrust. In reality the thrust needed falls as fuel is burned and the aircraft gets lighter — the Breguet equation accounts for that.',
      stories: { mfuel: 'Two engines give {T} in all at a TSFC of {ct} for {t}. How much fuel do they burn?', t: 'An aircraft has {mfuel} of fuel for its cruise, needing {T} at a TSFC of {ct}. How long can it cruise?' }
    }
  ],
  examples: [
    {
      title: 'Fuel flow of an airliner in cruise',
      q: 'A twin-engine airliner cruises with each engine giving 21 kN at a TSFC of 0.60 per hour. Find the fuel flow of each engine, the total, and the fuel for two hours.',
      steps: [
        '$\\dot m_f = c_t T/g = (0.60/3600) \\times 21\\,000/9.807 = 0.357$ kg/s = 1285 kg/h per engine.',
        'Both engines: 2570 kg/h.',
        'Two hours: about 5140 kg.'
      ],
      a: 'About 1.3 t/h per engine, 2.6 t/h in all, some 5.1 t in two hours.'
    },
    {
      title: 'Concorde\'s efficiency',
      q: 'Concorde\'s engines cruised at about 590 m/s with a TSFC of 1.19 per hour. What was their overall efficiency?',
      steps: [
        '$c_t = 1.19/3600 = 3.31 \\times 10^{-4}$ per second.',
        '$\\eta_0 = g V_0/(c_t Q_R) = 9.807 \\times 590/(3.31 \\times 10^{-4} \\times 43 \\times 10^6) = 5786/14\\,210 = 0.41$.'
      ],
      a: 'About 41 % — better than subsonic turbofans of the 1970s, despite the high TSFC.'
    },
    {
      title: 'Jets and rockets on one scale',
      q: 'Express a turbofan\'s 0.55 lb/(lbf·h) as a specific impulse, and the RS-25 rocket\'s 452 s as a TSFC.',
      steps: ['$I_{sp} = 3600/0.55 = 6545$ s.', '$c_t = 3600/452 = 7.96$ per hour.'],
      a: 'About 6500 s for the turbofan against 452 s for the best chemical rocket — 14 times more thrust per kilogram of propellant carried.'
    }
  ],
  quiz: [
    { q: 'An engine gives 30 kN while burning 1500 kg of fuel per hour. What is its TSFC in lb/(lbf·h) (per hour)?', answer: 0.49,
      why: 'c_t = g·ṁ_f/T = 9.807 × 1500/30 000 = 0.49 per hour.' },
    { q: 'The TSFC of a turbofan is lower at takeoff than in cruise. This shows that…', choices: ['nothing about efficiency: at takeoff the aircraft barely moves, so little useful work is done', 'the engine is more efficient at takeoff', 'cruise is badly designed', 'fuel is denser at sea level'], a: 0,
      why: 'Overall efficiency is gV₀/(c_t Q_R): at V₀ ≈ 0 it is near zero, however low the TSFC.' },
    { q: 'A turbofan\'s TSFC is 0.5 lb/(lbf·h). What is its equivalent specific impulse?', answer: 7200, unit: 's',
      why: 'I_sp = 3600/0.5 = 7200 s.' },
    { q: 'Two engines with the same TSFC at different flight speeds have the same overall efficiency.', a: false,
      why: 'η₀ = gV₀/(c_t Q_R) grows with V₀: at the same TSFC the faster engine is doing more useful work per kilogram of fuel.' },
    { q: 'What is the overall efficiency of an engine flying at 250 m/s with a TSFC of 0.55 per hour on kerosene (43 MJ/kg)?', answer: 0.373,
      why: 'η₀ = 9.807 × 250/((0.55/3600) × 43 × 10⁶) = 2452/6569 = 0.373.' }
  ],
  problems: [
    { q: 'Two engines each give 24 kN at a TSFC of 0.58 per hour. How much fuel do they burn in a three-hour cruise at constant thrust?', answer: 8520, unit: 'kg', tol: 0.02,
      steps: ['$m = c_t T t/g = (0.58/3600) \\times 48\\,000 \\times 10\\,800/9.807$.', '$m = 8520$ kg.'] }
  ],
  applications: ['Range and endurance calculations with the Breguet equation.', 'Comparing engine offers for a new aircraft at its design cruise condition.', 'Relating air-breathing and rocket propulsion on one scale (TSFC and I_sp).', 'Fuel-burn and emissions estimates: every kilogram of kerosene burned makes about 3.16 kg of CO₂.'],
  sim: 'prop-turbofan'
},

/* ================================================================ TURBOPROP */
{
  id: 'turboprop', parent: 'engines', title: 'Turboprops and turboshafts', level: 2,
  short: 'A gas turbine whose turbine takes almost all the energy and drives a propeller through a gearbox (turboprop) or a rotor or shaft (turboshaft). Efficient and strong at low speed, limited by propeller tip speed to about 670 km/h.',
  keywords: ['turboprop', 'turboshaft', 'free turbine', 'power turbine', 'reduction gearbox', 'shaft power', 'torque', 'equivalent shaft horsepower', 'PSFC', 'propfan', 'open rotor', 'helicopter engine', 'beta range'],
  prereq: ['turbojet', 'propellers', 'propulsive-efficiency'],
  related: ['propeller-efficiency', 'tsfc', 'turbofan', 'helicopter-rotor', 'hover-power', 'physics:torque', 'electric-propulsion'],
  body: `
Put a gearbox and a propeller in front of a gas turbine and let the turbine take nearly all the energy out of the gas: that is a **turboprop**. The jet that remains is slow and gives only 5–10 % of the thrust. Make the same machine drive a helicopter rotor, a generator or a ship's shaft and it is a **turboshaft**.

### How it is built
- **Gas generator**: compressor, combustor and turbine, as in a [[turbojet]] — in small engines spinning at 30 000–40 000 rpm.
- **Power turbine**: further turbine stages that take the remaining energy. In a **free-turbine** engine (the PT6A family, the PW127 of regional airliners) the power turbine is on its own shaft, so the propeller speed is independent of the gas generator; in a **single-shaft** engine (the TPE331) one shaft carries everything.
- **Reduction gearbox**: the propeller must turn at 1000–2000 rpm to keep its tips subsonic ([[propellers]]), so gear ratios of 15:1 or more are common.

Shaft power follows from torque and speed, $P = 2\\pi n Q$; turboprop cockpits show torque and propeller rpm rather than thrust. A regional-airliner engine delivers about 2 MW at takeoff, the Europrop TP400 of the A400M about 8 MW, and the Kuznetsov NK-12 of the Tu-95, with contra-rotating propellers, about 11 MW.

### Why turboprops
A propeller is the ultimate high-bypass engine: it moves a very large mass of air only a little faster than the aircraft, so its [[propulsive-efficiency]] is excellent at low speed. On a short route at 500 km/h a turboprop burns roughly a quarter to two-fifths less fuel than a jet of similar size, climbs well and uses short runways. The price is speed: propeller efficiency falls away as the helical tip Mach number nears 1, so most turboprops cruise at 450–670 km/h (250–360 knots), and the cabin hears the blades. Contra-rotating propellers and thin, highly swept blades — **propfans** or **open rotors** — push the limit up; the GE36 unducted fan flew in 1986, and the idea is being revived for the next generation of airliner engines.

### Power, thrust and speed
In steady flight the propeller's thrust is

$$T = \\frac{\\eta_p\\, P}{V}$$

so at fixed power the thrust falls with speed: large at takeoff, modest in cruise ([[propeller-efficiency]]). The shaft power itself comes from the fuel: $P = \\eta\\,\\dot m_f Q_R$, with a thermal efficiency of about 30 % for a regional turboprop — a **power-specific fuel consumption** near 0.28 kg/(kW·h) ([[tsfc]]). A constant-speed propeller adjusts its blade angle to absorb the power at the selected rpm; on the ground, "beta range" and reverse pitch let the pilot control the blade angle directly for taxiing and braking.

### Turboshafts
Almost every helicopter bigger than a light trainer is turbine-powered: turboshafts give several times the power per kilogram of a piston engine and run on kerosene. A twin-engine utility helicopter carries two of about 1.4 MW each. The same engines, as aeroderivatives, drive generators, pumps and ships.

> [!warn] Engine handling — power and torque limits, propeller feathering and reverse — follows the aircraft's approved manuals and training, not these typical figures.
`,
  ideas: [
    'A turboprop\'s turbine drives a propeller through a reduction gearbox; the jet gives only 5–10 % of the thrust.',
    'Shaft power P = 2πnQ; cockpits show torque and propeller rpm.',
    'The propeller\'s high propulsive efficiency makes turboprops economical at low speed; tip Mach number limits them to about 360 knots.',
    'At fixed power, thrust T = η_p P/V falls with speed.',
    'Turboshafts drive helicopter rotors, generators and ships with the same gas-generator core.'
  ],
  pitfalls: [
    'A turboprop is a jet engine with a propeller bolted on the front — Its turbine is designed to take nearly all the energy out of the gas to drive the propeller; the leftover jet is weak.',
    'A turboprop makes the same thrust at all speeds — It delivers roughly constant power; thrust = η_p·P/V is large at low speed and falls as speed rises.',
    'Turboprops are old technology that jets replaced — On short routes they burn markedly less fuel than jets and remain the choice for regional airliners, transports and utility aircraft.'
  ],
  formulas: [
    {
      name: 'Shaft power from torque and speed',
      expr: 'P = 2*pi*n*Q', tex: 'P = 2\\pi n\\, Q',
      vars: {
        P: { name: 'shaft power', q: 'power', unit: 'MW' },
        n: { name: 'shaft (propeller) speed', q: 'frequency', unit: 'rpm', value: 1200 },
        Q: { name: 'torque', q: 'torque', unit: 'kN·m', value: 16 }
      },
      note: 'n in revolutions per second inside the formula (enter rpm). Starting values: a regional-airliner turboprop at takeoff.',
      stories: { P: 'A propeller shaft turns at {n} with a torque of {Q}. How much power does it carry?', Q: 'An engine delivers {P} to a propeller turning at {n}. What torque does the shaft carry?' }
    },
    {
      name: 'Shaft power from the fuel',
      expr: 'P = eta*mf*QR', tex: 'P = \\eta\\,\\dot m_f\\,Q_R',
      vars: {
        P: { name: 'shaft power', q: 'power', unit: 'MW' },
        eta: { name: 'thermal efficiency (fuel to shaft)', value: 0.3, min: 0, max: 1, tex: '\\eta' },
        mf: { name: 'fuel mass flow', q: 'massflow', unit: 'kg/h', value: 560, tex: '\\dot m_f' },
        QR: { name: 'fuel heating value', q: 'specificenergy', unit: 'MJ/kg', value: 43, tex: 'Q_R' }
      },
      note: 'PSFC = ṁ_f/P; 0.28 kg/(kW·h) corresponds to η ≈ 0.30 with kerosene.',
      practice: { unknowns: ['P', 'mf', 'eta'] },
      stories: { mf: 'A turboshaft delivers {P} at a thermal efficiency of {eta} on fuel of {QR}. How much fuel does it burn?', eta: 'An engine burns {mf} of fuel ({QR}) and delivers {P}. What is its thermal efficiency?' }
    },
    {
      name: 'Propeller thrust in flight',
      expr: 'T = etap*P/V', tex: 'T = \\dfrac{\\eta_p\\,P}{V}',
      vars: {
        T: { name: 'thrust', q: 'force', unit: 'kN' },
        etap: { name: 'propeller efficiency', value: 0.85, min: 0, max: 1, tex: '\\eta_p' },
        P: { name: 'shaft power', q: 'power', unit: 'MW', value: 2 },
        V: { name: 'true airspeed', q: 'speed', unit: 'm/s', value: 140 }
      },
      note: 'Not valid at V → 0, where the static thrust is finite (see momentum theory). The small residual jet thrust is not included.',
      stories: { T: 'A turboprop delivers {P} to a propeller of efficiency {etap} at {V}. What thrust does it give?', P: 'An aircraft at {V} needs {T} from a propeller of efficiency {etap}. What shaft power is required?' }
    }
  ],
  examples: [
    {
      title: 'Torque at takeoff',
      q: 'A regional-airliner turboprop delivers 2.05 MW at a propeller speed of 1200 rpm. What torque does the propeller shaft carry?',
      steps: ['$n = 20$ rev/s; $Q = P/(2\\pi n) = 2.05 \\times 10^6/(2\\pi \\times 20)$.', '$Q = 16.3$ kN·m.'],
      a: 'About 16 kN·m — the reason the reduction gearbox is one of the heaviest parts of the engine.'
    },
    {
      title: 'A turboprop in cruise',
      q: 'Each of two engines delivers 1.6 MW at 140 m/s (272 knots) with a propeller efficiency of 0.85 and a thermal efficiency of 0.30. Find the thrust and fuel flow per engine, and the PSFC.',
      steps: [
        'Thrust $T = 0.85 \\times 1.6 \\times 10^6/140 = 9.7$ kN per engine.',
        'Fuel $\\dot m_f = P/(\\eta Q_R) = 1.6 \\times 10^6/(0.30 \\times 43 \\times 10^6) = 0.124$ kg/s = 447 kg/h.',
        'PSFC $= 447/1600 = 0.28$ kg/(kW·h). Both engines: about 19 kN of thrust and 890 kg/h of fuel.'
      ],
      a: 'About 9.7 kN and 450 kg/h per engine (PSFC ≈ 0.28 kg/(kW·h)).'
    }
  ],
  quiz: [
    { q: 'In a turboprop most of the thrust comes from…', choices: ['the propeller', 'the jet exhaust', 'the compressor', 'the gearbox'], a: 0,
      why: 'The turbine takes nearly all the energy for the propeller; the residual jet gives only 5–10 % of the thrust.' },
    { q: 'A turboprop shaft turns at 1200 rpm with a torque of 15 kN·m. How much power does it carry?', answer: 1885, unit: 'kW',
      why: 'P = 2πnQ = 2π × 20 × 15 000 = 1.885 MW.' },
    { q: 'At constant shaft power, a turboprop gives more thrust at takeoff than in cruise.', a: true,
      why: 'T = η_p P/V: at low speed the same power gives a much larger thrust.' },
    { q: 'Why do turboprops rarely cruise faster than about 360 knots?', choices: ['The propeller tips approach the speed of sound and efficiency collapses', 'Turbines cannot turn faster', 'The gearbox limits the aircraft\'s speed', 'The fuel system cannot keep up'], a: 0,
      why: 'The helical tip speed is √((πnD)² + V²); as flight speed rises, the tips near Mach 1 and losses and noise soar.' },
    { q: 'A "free power turbine" means…', choices: ['the turbine that drives the propeller is on its own shaft, separate from the gas generator', 'the turbine runs without fuel', 'the propeller has no gearbox', 'the turbine blades are uncooled'], a: 0,
      why: 'In engines such as the PT6A, the gas generator and the power turbine are linked only by the gas flow, so the propeller rpm can be chosen independently.' }
  ],
  problems: [
    { q: 'A turboshaft delivers 1.5 MW at a thermal efficiency of 30 % on kerosene (43 MJ/kg). What is its fuel flow in kg/h?', answer: 419, unit: 'kg/h', tol: 0.02,
      steps: ['$\\dot m_f = P/(\\eta Q_R) = 1.5 \\times 10^6/(0.30 \\times 43 \\times 10^6) = 0.116$ kg/s.', '× 3600 = 419 kg/h.'] }
  ],
  applications: ['Regional airliners, military transports and maritime patrol aircraft.', 'Utility and agricultural aircraft on short, rough strips.', 'Helicopters, tiltrotors and auxiliary power units (turboshafts).', 'Aeroderivative gas turbines for power stations, pipelines and ships.'],
  history: 'The first turboprop to fly was the Rolls-Royce Trent — a Derwent jet with a gearbox and propeller — in a Gloster Meteor in September 1945. The Vickers Viscount, with four Rolls-Royce Darts, began airline service in 1953 and showed passengers how smooth turbine power could be; the Dart stayed in production for four decades.',
  sim: { id: 'prop-map', params: { B: 6, mode: 'cs', P: 1600, V: 270, rpm: 1000, D: 3.9, h: 6000 } }
},

/* ================================================================ RAMJET / SCRAMJET */
{
  id: 'ramjet-scramjet', parent: 'engines', title: 'Ramjets and scramjets', level: 3,
  short: 'At high speed, slowing the air compresses it enough to make the compressor unnecessary: a ramjet is a duct with an intake, a combustor and a nozzle. It gives no static thrust. Above Mach 5–6 the air must burn while still supersonic — the scramjet.',
  keywords: ['ramjet', 'scramjet', 'supersonic combustion', 'ram compression', 'ram pressure ratio', 'hypersonic', 'X-43A', 'X-51A', 'HyShot', 'intake', 'stagnation temperature', 'dual-mode', 'air-breathing'],
  prereq: ['turbojet', 'stagnation-properties', 'normal-shock'],
  related: ['oblique-shock', 'hypersonic-flight', 'de-laval-nozzle', 'mach-regimes', 'isentropic-flow', 'rocket-propulsion'],
  body: `
At high speed the air arrives with so much kinetic energy that simply slowing it down compresses it. Bring air at Mach 3 nearly to rest and its pressure rises about 37 times — more than most compressors achieve. Why then carry a compressor and a turbine at all? A **ramjet** is a shaped duct: a supersonic intake that slows the air through a system of shock waves, a combustor where fuel burns in the slowed air behind flame holders, and a convergent–divergent nozzle.

### Ram compression
For an ideal intake the pressure and temperature ratios are those of [[isentropic-flow|isentropic flow]] brought to rest ([[stagnation-properties]]):

$$\\frac{p_t}{p} = \\left(1 + \\frac{\\gamma-1}{2}M^2\\right)^{\\gamma/(\\gamma-1)}, \\qquad \\frac{T_t}{T} = 1 + \\frac{\\gamma-1}{2}M^2$$

| Flight Mach number | 0.8 | 2 | 3 | 5 |
|---|---|---|---|---|
| Ideal ram pressure ratio | 1.5 | 7.8 | 37 | 530 |
| Ideal ramjet thermal efficiency | 11 % | 44 % | 64 % | 83 % |

An ideal ramjet is a Brayton cycle whose whole pressure ratio is ram, so its thermal efficiency is $1 - 1/(1 + \\tfrac{\\gamma-1}{2}M^2)$ — zero at rest. A ramjet gives **no static thrust**: it must be boosted by a rocket or carried to speed by another aircraft. Real intakes lose stagnation pressure in their [[oblique-shock|oblique]] and [[normal-shock|normal]] shocks, more as Mach number rises, so practical ramjets fly between about Mach 2 and 5. Surface-to-air missiles such as Bloodhound, the ducted-rocket Meteor air-to-air missile and cruise missiles near Mach 3 use them. The J58 engines of the SR-71 worked partly as ramjets at Mach 3.2: much of the air bypassed the turbojet core, and most of the thrust came from the intake and the ejector nozzle.

### Why scramjets
Above about Mach 5–6, slowing the air to subsonic speed becomes self-defeating. At Mach 6 the stagnation temperature is about 1800 K; at Mach 8 over 3000 K — as hot as a flame, so burning fuel adds little more heat (the products dissociate instead) and the normal-shock losses are huge. The answer is to slow the air only partly and burn the fuel in a flow that is still supersonic: the **supersonic-combustion ramjet**, or scramjet.

It is extraordinarily hard. Air crosses a one-metre combustor in about half a millisecond, so the fuel must be injected, mixed and burned in that time; hydrogen, which ignites and burns fastest, is the usual fuel. Heating is fierce, and the net thrust is a small difference between large forces on the intake and the nozzle, so the engine is really the whole underside of the vehicle. Flights have been brief:
- **HyShot II** (University of Queensland, 2002): the first supersonic combustion measured in flight.
- **NASA X-43A** (2004): hydrogen-fuelled, about 10 s of powered flight each at Mach 6.8 (March) and Mach 9.6 (November) — the air-breathing speed record.
- **X-51A Waverider** (2013): hydrocarbon-fuelled, about 210 s of powered flight, reaching Mach 5.1.

Scramjets might one day power hypersonic aircraft or the air-breathing first stage of a launcher; for now they remain experiments. See [[hypersonic-flight]] for the heating they must survive.
`,
  ideas: [
    'At supersonic speed the intake alone can compress the air tens of times: no compressor or turbine is needed.',
    'An ideal ramjet\'s efficiency, 1 − 1/(1 + (γ−1)M²/2), is zero at rest: ramjets need a boost to operating speed.',
    'Practical ramjets work from about Mach 2 to 5; shock losses and heating grow with speed.',
    'Above Mach 5–6, slowing the air to subsonic heats it to flame temperature: scramjets burn in supersonic flow.',
    'Scramjet combustion must happen in about a millisecond; hydrogen is the usual fuel.'
  ],
  pitfalls: [
    'A ramjet can take off on its own if it is given enough fuel — With no forward speed there is no ram compression, the combustor pressure is no higher than ambient and there is no thrust; a booster is always needed.',
    'A scramjet is a ramjet that flies faster — Its combustor flow is supersonic, which changes everything: combustion in about a millisecond, and an engine that is the whole vehicle underside.',
    'Higher Mach number always makes a ramjet better — The ideal efficiency rises, but real intake losses, heating and structural limits grow faster; above Mach 5–6 a subsonic-combustion ramjet loses its advantage.'
  ],
  formulas: [
    {
      name: 'Ram pressure ratio of an ideal intake',
      expr: 'r = (1 + (gamma - 1)/2*M^2)^(gamma/(gamma - 1))', tex: 'r = \\left(1 + \\dfrac{\\gamma-1}{2}M^2\\right)^{\\gamma/(\\gamma-1)}',
      vars: {
        r: { name: 'ram pressure ratio p_t/p' },
        gamma: { name: 'ratio of specific heats', value: 1.4, min: 1.05, max: 1.67, tex: '\\gamma' },
        M: { name: 'flight Mach number', value: 3, min: 0, max: 20 }
      },
      note: 'Isentropic deceleration to rest. Real intakes recover less: about 90 % of it at Mach 2, 75 % at Mach 3 (from the shocks).',
      practice: { unknowns: ['r', 'M'] },
      stories: { r: 'A ramjet flies at Mach {M}. How much could an ideal intake compress the air (γ = {gamma})?', M: 'At what Mach number does ideal ram compression reach a pressure ratio of {r} (γ = {gamma})?' }
    },
    {
      name: 'Ideal ramjet thermal efficiency',
      expr: 'eta = 1 - 1/(1 + (gamma - 1)/2*M^2)', tex: '\\eta_{th} = 1 - \\dfrac{1}{1 + \\frac{\\gamma-1}{2}M^2}',
      vars: {
        eta: { name: 'ideal thermal efficiency', tex: '\\eta_{th}' },
        gamma: { name: 'ratio of specific heats', value: 1.4, min: 1.05, max: 1.67, tex: '\\gamma' },
        M: { name: 'flight Mach number', value: 3, min: 0, max: 20 }
      },
      note: 'The Brayton efficiency with ram as the only compression. Zero at M = 0: no static thrust.',
      stories: { eta: 'What is the ideal thermal efficiency of a ramjet flying at Mach {M} (γ = {gamma})?' }
    },
    {
      name: 'Stagnation temperature entering the combustor',
      expr: 'Tt = T*(1 + (gamma - 1)/2*M^2)', tex: 'T_t = T\\left(1 + \\dfrac{\\gamma-1}{2}M^2\\right)',
      vars: {
        Tt: { name: 'stagnation temperature', q: 'temperature', unit: 'K', tex: 'T_t' },
        T: { name: 'ambient (static) temperature', q: 'temperature', unit: 'K', value: 216.65 },
        gamma: { name: 'ratio of specific heats', value: 1.4, min: 1.05, max: 1.67, tex: '\\gamma' },
        M: { name: 'flight Mach number', value: 6, min: 0, max: 20 }
      },
      note: 'The temperature of air brought to rest, whatever the losses. Above about 2000 K air and combustion products begin to dissociate and γ falls.',
      practice: { unknowns: ['Tt', 'M'] },
      stories: { Tt: 'An engine flies at Mach {M} through air at {T}. How hot is the air when brought to rest (γ = {gamma})?', M: 'At what Mach number does air at {T} reach {Tt} when brought to rest (γ = {gamma})?' }
    },
    {
      name: 'Specific thrust of an ideal ramjet',
      expr: 'Fs = V0*(sqrt(Tt4/Tt0) - 1)', tex: 'F_s = V_0\\left(\\sqrt{T_{t4}/T_{t0}} - 1\\right)',
      vars: {
        Fs: { name: 'specific thrust (N per kg/s of air)', q: 'speed', unit: 'm/s', tex: 'F_s' },
        V0: { name: 'flight speed', q: 'speed', unit: 'm/s', value: 885, tex: 'V_0' },
        Tt4: { name: 'combustor exit stagnation temperature', q: 'temperature', unit: 'K', value: 2200, tex: 'T_{t4}' },
        Tt0: { name: 'free-stream stagnation temperature', q: 'temperature', unit: 'K', value: 606.6, tex: 'T_{t0}' }
      },
      note: 'Ideal ramjet with full expansion, fuel mass neglected and the same gas properties throughout: the jet speed is V₀√(T_t4/T_t0). Starting values: Mach 3 at 20 000 m.',
      stories: { Fs: 'A ramjet flies at {V0}; its air is at {Tt0} when brought to rest and leaves the combustor at {Tt4}. What thrust does each kg/s of air give?' }
    }
  ],
  examples: [
    {
      title: 'A Mach 3 ramjet',
      q: 'A ramjet flies at Mach 3 at 20 000 m (T = 216.65 K, speed of sound 295 m/s) and heats the air to 2200 K. Find the ideal ram pressure ratio, the stagnation temperature, the ideal thermal efficiency, and the ideal thrust for 30 kg/s of air.',
      steps: [
        '$1 + 0.2 \\times 9 = 2.8$: ram pressure ratio $2.8^{3.5} = 36.7$.',
        '$T_{t0} = 216.65 \\times 2.8 = 607$ K; $\\eta_{th} = 1 - 1/2.8 = 0.64$.',
        '$V_0 = 3 \\times 295 = 885$ m/s; $F_s = 885\\,(\\sqrt{2200/607} - 1) = 885 \\times 0.904 = 801$ N·s/kg.',
        'Thrust $= 30 \\times 801 = 24$ kN (a real engine, with its intake losses, gives perhaps two-thirds of that).'
      ],
      a: 'Pressure ratio 37, 607 K, 64 % ideal efficiency and about 24 kN (ideal) from 30 kg/s of air.'
    },
    {
      title: 'Why not a ramjet at Mach 8?',
      q: 'What is the stagnation temperature of air at Mach 8 at 30 000 m (T = 226.5 K)?',
      steps: ['$T_t = 226.5 \\times (1 + 0.2 \\times 64) = 226.5 \\times 13.8$.', '$T_t = 3130$ K.'],
      a: 'Over 3100 K before any fuel is burned — hotter than a kerosene flame, which is why the combustor flow must stay supersonic.'
    }
  ],
  quiz: [
    { q: 'A ramjet on a test stand, with no airflow and its fuel lit, produces…', choices: ['no useful thrust', 'its full thrust', 'half its thrust', 'thrust only with a convergent nozzle'], a: 0,
      why: 'Without forward speed there is no ram compression, so the combustor is at ambient pressure and the gas cannot be expanded into a jet.' },
    { q: 'What is the ideal ram pressure ratio at Mach 2 (γ = 1.4)?', answer: 7.82,
      why: '(1 + 0.2 × 4)^3.5 = 1.8^3.5 = 7.82.' },
    { q: 'A scramjet burns its fuel in air that is still moving supersonically relative to the engine.', a: true,
      why: 'That is what "supersonic combustion" means; it avoids the heating and losses of slowing the air to subsonic speed.' },
    { q: 'Why is a subsonic-combustion ramjet impractical at Mach 8?', choices: ['Slowing the air to subsonic heats it to about flame temperature and the shock losses are huge', 'The air is too cold to burn', 'There is no oxygen at that altitude', 'The nozzle would choke'], a: 0,
      why: 'T_t ≈ 3100 K at Mach 8: added fuel dissociates rather than heats, and a strong normal shock wastes stagnation pressure.' },
    { q: 'Why is hydrogen the usual scramjet fuel?', choices: ['It ignites and burns fastest, and the air stays in the combustor for only about a millisecond', 'It is the densest fuel', 'It gives the most energy per litre', 'It needs no oxygen'], a: 0,
      why: 'Reaction time is the bottleneck; hydrogen also cools the structure well. Its low density is a disadvantage that designers accept.' }
  ],
  problems: [
    { q: 'What is the stagnation temperature of air at Mach 5 at 25 000 m, where T = 221.6 K?', answer: 1330, unit: 'K', tol: 0.02,
      steps: ['$T_t = 221.6 \\times (1 + 0.2 \\times 25) = 221.6 \\times 6$.', '$T_t = 1330$ K.'] }
  ],
  applications: ['Long-range and anti-ship missiles cruising near Mach 3.', 'Air-to-air missiles with ducted rockets, which keep thrust to the end of a long flight.', 'Hypersonic research vehicles and proposed air-breathing launchers.', 'Combined-cycle engines: turbo-ramjets and rocket-based combined cycles.'],
  history: 'René Lorin described the ramjet in 1913, with no way to reach the speed it needed. The French Leduc 010, air-launched from a larger aircraft, made the first ramjet-powered flight in 1949. Supersonic combustion was studied from the late 1950s, but it was 2002 before HyShot demonstrated it in flight.',
  sim: { id: 'prop-brayton', params: { M: 3, h: 18000, opr: 1, tt4: 2000 } }
},

/* ================================================================ ROCKET PROPULSION */
{
  id: 'rocket-propulsion', parent: 'engines', title: 'Rocket propulsion', level: 2,
  short: 'A rocket carries its fuel and oxidiser, so it needs no air. Its economy is the specific impulse, I_sp = c/g₀; its speed gain is the rocket equation Δv = I_sp g₀ ln(m₀/m₁). Reaching orbit takes about 9.4 km/s — and staging.',
  keywords: ['rocket', 'rocket equation', 'Tsiolkovsky', 'specific impulse', 'Isp', 'exhaust velocity', 'mass ratio', 'delta-v', 'staging', 'propellant', 'liquid rocket', 'solid rocket', 'ion thruster', 'nozzle expansion', 'orbit'],
  prereq: ['thrust', 'physics:rocket-propulsion', 'math:logarithms'],
  related: ['de-laval-nozzle', 'nozzles', 'tsfc', 'propulsive-efficiency', 'ramjet-scramjet', 'hypersonic-flight', 'physics:conservation-of-momentum'],
  body: `
A rocket carries everything it throws out — fuel and oxidiser — so it needs no air and works best in space. It burns its propellants in a chamber at high pressure (typically 7–30 MPa in large liquid engines) and expands the hot gas through a convergent–divergent [[de-laval-nozzle|de Laval nozzle]] into a supersonic jet. With no intake there is no ram drag:

$$T = \\dot m\\, v_e + (p_e - p_a)A_e$$

The ratio $c = T/\\dot m$ is the **effective exhaust velocity**; divided by standard gravity it is the **specific impulse** $I_{sp} = c/g_0$, in seconds — the rocket's fuel economy.

| Propellants | Example engine | $I_{sp}$ at sea level | $I_{sp}$ in vacuum |
|---|---|---|---|
| Solid (aluminium and ammonium perchlorate) | Shuttle booster | ≈ 240 s | ≈ 270 s |
| Kerosene and oxygen | Merlin 1D | 282 s | 311 s (348 s with a vacuum nozzle) |
| Methane and oxygen | Raptor | ≈ 330 s | ≈ 380 s (vacuum version) |
| Hydrogen and oxygen | RS-25 | 366 s | 452 s |
| Nuclear thermal (tested, never flown) | NERVA | — | ≈ 850 s |
| Electric: Hall thruster | — | — | 1500–2000 s |
| Electric: gridded ion thruster | NSTAR (Dawn) | — | ≈ 3100 s |

A hot gas of light molecules gives the fastest jet — roughly $c \\propto \\sqrt{T_c/\\mathcal{M}}$ — which is why hydrogen, burning to light water vapour and run fuel-rich, beats kerosene. Vacuum figures are higher because the pressure term turns positive and a longer nozzle can expand the gas further; a nozzle long enough for vacuum would, at sea level, over-expand the jet until it separated from the walls.

### The rocket equation
Each bit of propellant pushed out at speed $c$ speeds up the rest of the rocket a little; adding it all up ([[physics:rocket-propulsion]], with [[math:logarithms|logarithms]]):

$$\\Delta v = I_{sp}\\, g_0 \\ln\\frac{m_0}{m_1}$$

where $m_0$ is the mass at ignition and $m_1$ at burnout. The logarithm is merciless. Low Earth orbit needs about 7.8 km/s of orbital speed plus some 1.5 km/s lost to gravity and drag on the way up — about **9.4 km/s** in all. With $I_{sp}$ = 300 s that needs $m_0/m_1 = e^{9400/2942} \\approx 24$: 96 % of the lift-off mass must be propellant, leaving 4 % for tanks, engines and payload. Even with hydrogen ($I_{sp}$ = 450 s) the ratio is about 8.4.

### Staging
The cure is to throw away the empty tanks and the engines that lifted them. A multi-stage rocket applies the rocket equation once per stage, and each upper stage starts light because the dead weight below has gone. In the second example below, a two-stage rocket reaches orbit while the same propellant and structure in one stage falls about 2 km/s short. Launchers use two or three stages; reusable first stages give up some payload to keep fuel for landing.

### Efficiency
A rocket at rest wastes all its jet power, but one flying at its own exhaust speed wastes none — its exhaust is left motionless in space. Hopeless as an aircraft engine, the rocket is the only engine that works where orbital speeds are reached (see [[propulsive-efficiency]]).

> [!warn] Rocket propellants and motors are dangerous. Amateur rocketry follows the national rules and the safety codes of the recognised rocketry associations; never make propellants or motors yourself.
`,
  ideas: [
    'A rocket carries fuel and oxidiser: no intake, no ram drag, thrust T = ṁv_e + (p_e − p_a)A_e.',
    'Specific impulse I_sp = c/g₀ measures exhaust velocity: about 300 s for kerosene, 450 s for hydrogen, thousands for electric thrusters.',
    'The rocket equation Δv = I_sp g₀ ln(m₀/m₁): speed grows only with the logarithm of the mass ratio.',
    'Orbit needs about 9.4 km/s; a single chemical stage can barely carry its own structure there, so rockets stage.',
    'Rocket engines give more thrust and higher I_sp in vacuum than at sea level.'
  ],
  pitfalls: [
    'A rocket needs air to push against — It pushes on its own exhaust gas; the thrust is higher in vacuum, where the pressure term turns positive.',
    'Doubling the propellant doubles the Δv — The Δv grows with the logarithm of the mass ratio; each extra tonne of propellant must also accelerate all the propellant still unburned.',
    'Specific impulse is how long the engine can burn — It is thrust per unit weight of propellant burned per second; the unit comes out in seconds, but it measures exhaust velocity (c = I_sp g₀), not burn time.'
  ],
  formulas: [
    {
      name: 'The rocket equation',
      expr: 'dv = Isp*g*ln(m0/m1)', tex: '\\Delta v = I_{sp}\\, g_0 \\ln\\dfrac{m_0}{m_1}',
      vars: {
        dv: { name: 'change of velocity', q: 'speed', unit: 'km/s', tex: '\\Delta v' },
        Isp: { name: 'specific impulse', q: 'time', unit: 's', value: 345, tex: 'I_{sp}' },
        g: { const: 'g', tex: 'g_0' },
        m0: { name: 'mass at ignition', q: 'mass', unit: 't', value: 125, tex: 'm_0' },
        m1: { name: 'mass at burnout', q: 'mass', unit: 't', value: 25, tex: 'm_1' }
      },
      note: 'Ideal: no gravity or drag losses, constant exhaust velocity. g₀ is standard gravity, used only to convert I_sp to exhaust velocity.',
      practice: { unknowns: ['dv', 'm1', 'm0'] },
      stories: {
        dv: 'A stage of {m0} with a specific impulse of {Isp} burns down to {m1}. How much speed does it gain?',
        m1: 'A stage of {m0} with a specific impulse of {Isp} must gain {dv}. What may its burnout mass be?',
        m0: 'An upper stage with a specific impulse of {Isp} must give its burnout mass of {m1} a speed change of {dv}. What must it weigh at ignition?'
      }
    },
    {
      name: 'Effective exhaust velocity',
      expr: 'c = Isp*g', tex: 'c = I_{sp}\\, g_0',
      vars: {
        c: { name: 'effective exhaust velocity', q: 'speed', unit: 'm/s' },
        Isp: { name: 'specific impulse', q: 'time', unit: 's', value: 311, tex: 'I_{sp}' },
        g: { const: 'g', tex: 'g_0' }
      },
      note: 'Starting value: a kerosene–oxygen engine in vacuum.',
      stories: { c: 'A rocket engine has a specific impulse of {Isp}. What is its effective exhaust velocity?', Isp: 'A thruster ejects its propellant at an effective {c}. What is its specific impulse?' }
    },
    {
      name: 'Rocket thrust',
      expr: 'T = mdot*ve + (pe - pa)*Ae', tex: 'T = \\dot m\\, v_e + (p_e - p_a)\\,A_e',
      vars: {
        T: { name: 'thrust', q: 'force', unit: 'kN' },
        mdot: { name: 'propellant mass flow', q: 'massflow', unit: 'kg/s', value: 300, tex: '\\dot m' },
        ve: { name: 'exhaust speed at the nozzle exit', q: 'speed', unit: 'm/s', value: 2900, tex: 'v_e' },
        pe: { name: 'nozzle exit pressure (absolute)', q: 'pressure', unit: 'kPa', value: 60, tex: 'p_e' },
        pa: { name: 'ambient pressure (absolute)', q: 'pressure', unit: 'kPa', value: 101.325, tex: 'p_a' },
        Ae: { name: 'nozzle exit area', q: 'area', unit: 'm²', value: 0.9, tex: 'A_e' }
      },
      note: 'Set p_a = 0 for vacuum. p_e < p_a means an over-expanded nozzle (negative pressure thrust).',
      practice: { unknowns: ['T', 'mdot'] },
      stories: { T: 'A rocket engine burns {mdot}; its exhaust leaves a {Ae} nozzle at {ve} and {pe} into air at {pa}. What is its thrust?' }
    },
    {
      name: 'Burn time at constant thrust',
      expr: 'tb = mp*Isp*g/T', tex: 't_b = \\dfrac{m_p\\, I_{sp}\\, g_0}{T}',
      vars: {
        tb: { name: 'burn time', q: 'time', unit: 's', tex: 't_b' },
        mp: { name: 'propellant mass', q: 'mass', unit: 't', value: 400, tex: 'm_p' },
        Isp: { name: 'specific impulse', q: 'time', unit: 's', value: 300, tex: 'I_{sp}' },
        g: { const: 'g', tex: 'g_0' },
        T: { name: 'thrust', q: 'force', unit: 'kN', value: 7600 }
      },
      note: 'The propellant flow is T/(I_sp g₀). Starting values: a large kerosene first stage.',
      stories: { tb: 'A first stage carries {mp} of propellant and gives {T} at a specific impulse of {Isp}. How long does it burn?' }
    }
  ],
  examples: [
    {
      title: 'Why one stage is not enough',
      q: 'A kerosene rocket ($I_{sp}$ ≈ 300 s averaged over the climb) is 92 % propellant at lift-off and carries no payload. What Δv can it reach?',
      steps: ['$m_0/m_1 = 1/0.08 = 12.5$.', '$\\Delta v = 300 \\times 9.807 \\times \\ln 12.5 = 2942 \\times 2.526 = 7430$ m/s.'],
      a: 'About 7.4 km/s — short of the 9.4 km/s orbit needs, even with nothing on top.'
    },
    {
      title: 'Two stages',
      q: 'A 550 t rocket has a first stage of 400 t propellant and 25 t structure ($I_{sp}$ = 300 s), a second stage of 100 t propellant and 7 t structure ($I_{sp}$ = 345 s), and an 18 t payload. Find the Δv of each stage.',
      steps: [
        'Stage 1: from 550 t to 150 t: $\\Delta v_1 = 2942 \\times \\ln 3.667 = 3820$ m/s.',
        'Stage 1 is dropped: stage 2 starts at $100 + 7 + 18 = 125$ t and burns out at 25 t: $\\Delta v_2 = 3383 \\times \\ln 5 = 5450$ m/s.',
        'Total $\\approx 9.27$ km/s. The same propellant in one 300 s stage: $2942 \\times \\ln(550/50) = 7050$ m/s.'
      ],
      a: 'About 3.8 + 5.4 = 9.3 km/s — enough for low orbit; as a single stage the same rocket would reach only about 7 km/s.'
    },
    {
      title: 'Propellant flow of a rocket engine',
      q: 'A kerosene engine gives 845 kN at sea level with a sea-level $I_{sp}$ of 282 s. What is its propellant flow?',
      steps: ['$\\dot m = T/(I_{sp} g_0) = 845\\,000/(282 \\times 9.807)$.', '$\\dot m = 306$ kg/s.'],
      a: 'About 306 kg of propellant every second.'
    }
  ],
  quiz: [
    { q: 'An upper stage with a specific impulse of 450 s burns from 30 t down to 10 t. What Δv does it give?', answer: 4.85, unit: 'km/s',
      why: 'Δv = 450 × 9.807 × ln 3 = 4413 × 1.099 = 4850 m/s.' },
    { q: 'Doubling the propellant of a stage, with the same structure and payload…', choices: ['raises its Δv, but by much less than double', 'doubles its Δv', 'leaves its Δv unchanged', 'quadruples its Δv'], a: 0,
      why: 'Δv depends on ln(m₀/m₁); more propellant raises m₀ but the logarithm grows slowly.' },
    { q: 'A rocket engine\'s specific impulse is higher in vacuum than at sea level.', a: true,
      why: 'In vacuum the pressure term (p_e − p_a)A_e is positive, and nozzles can be made longer to expand the gas further.' },
    { q: 'Why do launchers use stages?', choices: ['Dropping empty tanks and engines lets the upper stages start light, beating the logarithm of the rocket equation', 'Each stage must use a different fuel', 'Engines cannot burn for more than a few minutes', 'To reduce aerodynamic drag'], a: 0,
      why: 'Structure that has done its job no longer has to be accelerated; each stage gets a fresh, favourable mass ratio.' },
    { q: 'A rocket\'s propulsive efficiency is highest when it flies…', choices: ['at its own exhaust velocity', 'at rest', 'at half its exhaust velocity', 'inside the atmosphere'], a: 0,
      why: 'At V = c the exhaust is left at rest relative to the ground and carries away no kinetic energy.' }
  ],
  problems: [
    { q: 'What mass ratio m₀/m₁ does an engine with a specific impulse of 350 s need for a Δv of 4 km/s?', answer: 3.21, tol: 0.02,
      steps: ['$m_0/m_1 = \\exp(\\Delta v/(I_{sp} g_0)) = \\exp(4000/3432)$.', '$= e^{1.165} = 3.21$.'] }
  ],
  applications: ['Launch vehicles and upper stages.', 'Spacecraft manoeuvres and station-keeping, increasingly with electric thrusters.', 'Missiles, ejection seats and rocket-assisted takeoff.', 'Research aircraft such as the X-15, and boosters for ramjets and scramjets.'],
  history: 'Konstantin Tsiolkovsky published the rocket equation in 1903 and argued for liquid hydrogen and oxygen and for multi-stage "rocket trains". Robert Goddard flew the first liquid-fuelled rocket at Auburn, Massachusetts, on 16 March 1926; it rose about 12 m. Four decades later the five F-1 engines of the Saturn V, each giving 6.8 MN, sent Apollo to the Moon.',
  sim: 'prop-rocket'
},

/* ================================================================ ELECTRIC PROPULSION */
{
  id: 'electric-propulsion', parent: 'engines', title: 'Electric aircraft propulsion', level: 1,
  short: 'Electric motors are light, efficient and quiet, but batteries store about 50 times less energy per kilogram than kerosene and do not get lighter as they empty. Range = usable energy ÷ drag; distributed propulsion and air taxis are where electric flight starts.',
  keywords: ['electric aircraft', 'battery', 'specific energy', 'Wh/kg', 'lithium-ion', 'electric motor', 'range', 'distributed electric propulsion', 'eVTOL', 'air taxi', 'hybrid-electric', 'hydrogen', 'fuel cell', 'X-57', 'Velis Electro'],
  prereq: ['propellers', 'tsfc', 'breguet-range'],
  related: ['multicopters', 'range-endurance', 'turboprop', 'lift-to-drag', 'winglets', 'high-lift-devices', 'physics:electric-power'],
  body: `
Electric motors are almost ideal aircraft engines. They turn 90–97 % of their electrical input into shaft power (a good piston engine turns about 30 % of its fuel energy into shaft power, a turboprop 30–35 %), weigh little for their power (5 kW/kg or more for the motor alone), keep their power at altitude, need little maintenance, and are quiet and clean where they fly. The problem is not the motor. It is the battery.

### Energy per kilogram
| Energy store | Specific energy |
|---|---|
| Kerosene (jet fuel) | ≈ 12 000 Wh/kg (43 MJ/kg) |
| Hydrogen (without its tank) | ≈ 33 000 Wh/kg (120 MJ/kg) |
| Lithium-ion cell | 250–300 Wh/kg |
| Lithium-ion pack (with cooling, structure and safety systems) | 150–200 Wh/kg |

Kerosene holds about 50 times more energy per kilogram than a lithium-ion cell. After the efficiencies — about 90 % from battery to shaft against about 30–35 % from fuel to shaft — the gap is still about **15 to 20 times**. And a battery does not get lighter as it empties, while an aircraft burning fuel lands lighter: the fuel aircraft gains the logarithm of the [[breguet-range|Breguet equation]], the electric one does not.

### Range on a battery
In steady cruise thrust equals drag, so the range is the energy delivered as thrust divided by the drag:

$$R = \\frac{\\eta\\, e_b\\, m_b}{D}, \\qquad D = \\frac{m g}{L/D}$$

where $e_b$ is the pack's specific energy, $m_b$ its mass and $\\eta$ the efficiency from battery to thrust (motor, controller and propeller: about 0.7–0.8). Range depends on the battery fraction $m_b/m$, the [[lift-to-drag|lift-to-drag ratio]] and the efficiencies — not on the size of the aircraft. A 1200 kg aircraft with $L/D$ = 13 and 30 % of its mass in batteries at 200 Wh/kg flies about 200 km; the same aircraft with 30 % fuel could fly several thousand. Electric aircraft therefore start where missions are short: training aircraft flying circuits (the Pipistrel Velis Electro, in June 2020 the first electric aircraft to receive a type certificate, flies for about 50 minutes plus a reserve), self-launching gliders, and drones.

### What electric propulsion makes possible
Because motors are small, light and efficient at any size, power can be spread along a wing — **distributed electric propulsion**. Many small propellers blowing over the wing raise its lift at low speed, so a smaller wing can still land slowly; NASA's X-57 Maxwell was built to test this with twelve small high-lift propellers and two cruise propellers at the wingtips, where they turn against the tip vortex and reduce induced drag. Electric vertical-takeoff air taxis use the same freedom: several rotors, each simple, with no gearboxes or drive shafts between them ([[multicopters]]). Hybrids pair a turbine generator with batteries; hydrogen, burned or in fuel cells, is the leading candidate for longer zero-carbon flights, at the cost of bulky, heavy tanks.

> [!warn] Lithium batteries can overheat and burn (thermal runaway). Charging, storing and flying battery-powered aircraft and drones follows the manufacturer's instructions and the local rules.
`,
  ideas: [
    'Electric motors are 90–97 % efficient, light and power-independent of altitude; batteries are the limit.',
    'Kerosene stores about 50 times more energy per kilogram than lithium-ion cells; after efficiencies, 15–20 times more usable energy.',
    'Battery range R = η e_b m_b/D: usable energy divided by drag. Batteries do not get lighter as they empty.',
    'Range depends on energy fraction, L/D and efficiency, not on aircraft size.',
    'Distributed propulsion and electric air taxis exploit small, light motors placed anywhere.'
  ],
  pitfalls: [
    'Electric aircraft are limited by their motors — Motors are light and efficient; the limit is the battery\'s energy per kilogram, 15–20 times below kerosene\'s usable energy.',
    'An electric aircraft gets lighter as it flies, like a fuelled one — A battery weighs the same full or empty, so the electric aircraft carries its full weight to the end; the fuelled aircraft gains range as it burns fuel.',
    'A bigger electric aircraft flies further — Range depends on the battery fraction, L/D and efficiency; scaling up the whole aircraft keeps the fractions and the range the same.'
  ],
  formulas: [
    {
      name: 'Range on a battery',
      expr: 'R = eta*eb*mb/D', tex: 'R = \\dfrac{\\eta\\, e_b\\, m_b}{D}',
      vars: {
        R: { name: 'range', q: 'length', unit: 'km' },
        eta: { name: 'battery-to-thrust efficiency (motor, controller, propeller)', value: 0.7, min: 0, max: 1, tex: '\\eta' },
        eb: { name: 'battery pack specific energy', q: 'specificenergy', unit: 'kWh/kg', value: 0.2, tex: 'e_b' },
        mb: { name: 'battery mass', q: 'mass', unit: 'kg', value: 300, tex: 'm_b' },
        D: { name: 'drag in cruise (= mg ÷ L/D)', q: 'force', unit: 'N', value: 900 }
      },
      note: '0.2 kWh/kg = 200 Wh/kg. Steady level cruise; no climb, reserves or battery ageing. The whole pack is assumed usable — real operations keep a reserve.',
      practice: { unknowns: ['R', 'mb', 'eb'] },
      stories: {
        R: 'An electric aircraft cruises with {D} of drag. It carries {mb} of batteries at {eb}, with a battery-to-thrust efficiency of {eta}. How far can it fly?',
        mb: 'An electric aircraft with {D} of drag must fly {R}. With packs of {eb} and an efficiency of {eta}, what battery mass does it need?',
        eb: 'What pack specific energy would let {mb} of batteries carry an aircraft with {D} of drag for {R} at an efficiency of {eta}?'
      }
    },
    {
      name: 'Battery mass for a flight',
      expr: 'mb = P*t/(eta*eb)', tex: 'm_b = \\dfrac{P\\,t}{\\eta\\, e_b}',
      vars: {
        mb: { name: 'battery mass', q: 'mass', unit: 'kg', tex: 'm_b' },
        P: { name: 'shaft power needed', q: 'power', unit: 'kW', value: 40 },
        t: { name: 'flight time', q: 'time', unit: 'h', value: 1 },
        eta: { name: 'battery-to-shaft efficiency', value: 0.9, min: 0, max: 1, tex: '\\eta' },
        eb: { name: 'battery pack specific energy', q: 'specificenergy', unit: 'kWh/kg', value: 0.2, tex: 'e_b' }
      },
      note: 'At constant power. Climb, reserves and the loss of capacity at low temperature and with age all add to it.',
      practice: { unknowns: ['mb', 't'] },
      stories: { mb: 'A trainer needs {P} at the shaft for {t}. With packs of {eb} and a battery-to-shaft efficiency of {eta}, how much battery must it carry?', t: 'An aircraft carries {mb} of packs at {eb} and needs {P} at the shaft ({eta} efficient). How long can it fly?' }
    }
  ],
  examples: [
    {
      title: 'Battery against kerosene',
      q: 'A 1200 kg aircraft with $L/D$ = 13 carries 30 % of its mass as energy store. Compare the range on 200 Wh/kg batteries (battery-to-thrust efficiency 0.7) with the Breguet range on kerosene (43 MJ/kg, fuel-to-thrust efficiency 0.25).',
      steps: [
        'Battery: $R = \\eta\\, e_b\\,(L/D)\\,(m_b/m)/g = 0.7 \\times 720\\,000 \\times 13 \\times 0.3/9.807 = 200$ km.',
        'Kerosene: $R = \\eta_0\\,(Q_R/g)\\,(L/D)\\,\\ln\\frac{1}{1 - 0.3} = 0.25 \\times 4.385 \\times 10^6 \\times 13 \\times 0.357 = 5080$ km.',
        'Ratio about 25: a factor of 21 from the usable energy per kilogram ($0.25 \\times 11\\,900$ against $0.7 \\times 200$ Wh/kg), the remaining 1.2 from the fuelled aircraft getting lighter.'
      ],
      a: 'About 200 km on batteries against about 5000 km on fuel.'
    },
    {
      title: 'A one-hour training flight',
      q: 'An electric trainer needs 40 kW at the propeller shaft in cruise. How much battery at 200 Wh/kg does an hour take, with 90 % from battery to shaft?',
      steps: ['Energy at the shaft: 40 kWh; from the battery: $40/0.9 = 44.4$ kWh.', '$m_b = 44.4/0.2 = 222$ kg.'],
      a: 'About 220 kg of batteries for one hour — before any reserve, which is why electric trainers fly short circuits.'
    }
  ],
  quiz: [
    { q: 'Per kilogram, kerosene stores roughly how much more energy than a lithium-ion cell?', choices: ['About 50 times', 'About 5 times', 'About 500 times', 'About the same'], a: 0,
      why: '≈ 12 000 Wh/kg against 250–300 Wh/kg. Engine efficiencies narrow the usable gap to 15–20 times.' },
    { q: 'An electric aircraft gets lighter as its battery discharges, like an aircraft burning fuel.', a: false,
      why: 'The battery\'s mass does not change; the aircraft lands as heavy as it took off, so there is no logarithmic gain as in the Breguet equation.' },
    { q: 'An electric aircraft has 400 kg of batteries at 180 Wh/kg, a battery-to-thrust efficiency of 0.75 and 1.2 kN of cruise drag. What is its range?', answer: 162, unit: 'km',
      why: 'R = η e_b m_b/D = 0.75 × 648 000 J/kg × 400/1200 = 162 000 m.' },
    { q: 'Distributed electric propulsion helps an aircraft because…', choices: ['small motors spread along the wing can blow it for more lift at low speed and work against the tip vortices', 'many small propellers are always more efficient than one large one', 'batteries are lighter when split up', 'it removes the need for a tail'], a: 0,
      why: 'Blowing raises the wing\'s maximum lift, allowing a smaller wing; tip propellers turning against the vortex reduce induced drag.' },
    { q: 'Which change doubles the range of a battery aircraft, other things equal?', choices: ['Doubling the pack\'s specific energy at the same battery mass', 'Doubling the aircraft\'s mass', 'Doubling the cruise speed', 'Doubling the motor power'], a: 0,
      why: 'R = η e_b m_b/D: range is proportional to the energy carried; a heavier aircraft has more drag, and power or speed do not add energy.' }
  ],
  problems: [
    { q: 'How much battery at 180 Wh/kg is needed for 30 minutes at 60 kW of shaft power, with 90 % efficiency from battery to shaft?', answer: 185, unit: 'kg', tol: 0.02,
      steps: ['Energy from the battery: $60 \\times 0.5/0.9 = 33.3$ kWh.', '$m_b = 33.3/0.18 = 185$ kg.'] }
  ],
  applications: ['Electric training aircraft and self-launching gliders.', 'Drones and multicopters of every size.', 'Electric and hybrid vertical-takeoff air taxis.', 'Research into distributed propulsion, boundary-layer ingestion and hydrogen-electric airliners.'],
  history: 'The first crewed electric aircraft flight was made by the Militky MB-E1, a converted motor glider, in Austria on 21 October 1973. Solar Impulse 2 flew round the world on sunlight and batteries in 2015–2016, and in 2020 the Pipistrel Velis Electro became the first electric aircraft with a type certificate.',
  sim: 'prop-electric'
}

);
