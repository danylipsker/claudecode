/* HYPER-AERODYNAMICS · content/rotors-nature.js — the branch "Rotors, Wind and Nature":
 *   rotorcraft      helicopter-rotor, hover-power, autorotation, multicopters, retreating-blade
 *   wind-energy     wind-turbines, betz-limit, tip-speed-ratio, sails
 *   natural-flight  bird-flight, insect-flight, seeds-gliders
 * Simulations are in sims/rotors-nature.js (ids rot-…). */
Hyper.add(

/* ================================================================ ROTORCRAFT */
{
  id: 'helicopter-rotor', parent: 'rotorcraft', title: 'The helicopter rotor', level: 2,
  short: 'A helicopter rotor is a set of long, thin wings turning at an almost constant speed. The pilot changes its thrust by changing the pitch of all the blades together (collective) and tilts the thrust by changing the pitch around the circle (cyclic), through a swashplate; a tail rotor cancels the torque that drives it.',
  keywords: ['helicopter', 'main rotor', 'collective pitch', 'cyclic pitch', 'swashplate', 'tail rotor', 'torque reaction', 'anti-torque', 'rotor solidity', 'tip speed', 'flapping hinge', 'lead-lag hinge', 'teetering rotor', 'coning', 'coaxial', 'tandem', 'NOTAR', 'fenestron'],
  prereq: ['lift-equation', 'momentum-theory', 'propellers', 'physics:torque'],
  related: ['hover-power', 'autorotation', 'retreating-blade', 'multicopters', 'ground-effect', 'aircraft-axes', 'physics:angular-momentum', 'physics:centripetal-force'],
  body: `
A helicopter rotor is a wing that travels in a circle. Each blade is a long, narrow wing — an [[aspect-ratio|aspect ratio]] of 15 to 20 — and each section of it meets the air at its own speed, $\\Omega r$, growing from nothing at the hub to the full **tip speed** $\\Omega R$ at the tip. Almost every helicopter, large or small, runs its tips at 200–220 m/s, about Mach 0.6–0.65: faster and the advancing tip in forward flight nears the speed of sound (see [[retreating-blade]]); slower and the rotor needs wider, heavier blades and stores less energy for an [[autorotation]]. So big rotors turn slowly:

| | Rotor diameter | Rotor speed | Blades | Tip speed |
|---|---|---|---|---|
| Light two-seat helicopter | 7.7 m | 530 rpm | 2 | 213 m/s |
| Light utility helicopter | 10.2 m | 394 rpm | 2 | 210 m/s |
| Medium utility helicopter | 16.4 m | 258 rpm | 4 | 221 m/s |
| Heavy-lift helicopter | 32 m | 132 rpm | 8 | 221 m/s |

A governor holds that speed nearly constant in flight. The pilot therefore controls the thrust not with rotor speed — as a [[multicopters|multicopter]] does — but with **blade pitch**, the angle at which each blade meets the air.

### Collective and cyclic
The **collective** lever changes the pitch of all the blades together: more pitch, more thrust, and the helicopter climbs (the engine is given more power at the same time). The **cyclic** stick changes the pitch once per revolution, following $\\theta = \\theta_0 + \\theta_{1c}\\cos\\psi + \\theta_{1s}\\sin\\psi$, where $\\psi$ is the blade's position around the circle. Each blade then flaps up where it has more pitch and down where it has less, and the whole disc — the tip-path plane — tilts. The thrust, perpendicular to the disc, tilts with it, and the helicopter accelerates in that direction.

The blade's flapping is a spring–mass system driven exactly at its natural frequency of once per revolution, so (as in any resonance, see [[physics:driven-oscillations|driven oscillations]]) the response lags the push by about 90°. To make the disc lowest at the front, the pitch must be smallest a quarter-turn earlier. The control linkages are rigged for this, so the pilot simply moves the stick in the direction of travel.

### The swashplate
Pitch reaches the spinning blades through the **swashplate**: a non-rotating lower plate moved by the controls, and an upper plate that turns with the mast on a bearing, linked to each blade's pitch horn. Raising the whole swashplate is collective; tilting it is cyclic.

### Hinges, coning and hubs
Juan de la Cierva's **flapping hinges** let each blade rise and fall freely, which spares the root the huge bending moments of lift and lets the blades balance the lopsided airflow of forward flight. The blades cone upward a few degrees, where lift is balanced by centrifugal force — and that force is enormous: a 25 kg blade on a light helicopter pulls outward with about 146 kN, some 15 tonnes-force, which keeps it straight like a rope. Lead-lag hinges with dampers let the blades swing a little in the plane of rotation. Two-bladed rotors often use a single see-saw **teetering** hinge; modern hingeless and bearingless hubs do the same jobs by flexing composite parts.

### Torque reaction and the tail rotor
The engine turns the rotor by pushing against the fuselage, so the fuselage is pushed the other way ([[physics:newtons-third-law|Newton's third law]]). A **tail rotor** at the end of a boom of length $l$ pushes sideways with $T_{tr} = Q/l$, where $Q = P/\\Omega$ is the main-rotor torque; the pedals change its pitch to turn the helicopter about its vertical axis. It costs roughly 8–12 % of the power in the hover. Other answers to the same problem: two rotors turning in opposite directions — coaxial, tandem or intermeshing — a ducted tail fan (fenestron), or a boom that blows air along its side (NOTAR).

> [!key] A helicopter rotor turns at nearly constant speed; its thrust is steered by pitch — collective for how much, cyclic for which way — while the tail rotor or a second rotor cancels the torque.

> [!warn] Rotor speeds, control techniques and limits differ between helicopter types. Real flying follows the helicopter's approved flight manual, proper training and the rules of the air, not these pages.
`,
  ideas: [
    'Each section of a blade meets air at Ωr; tips run at about 200–220 m/s on helicopters of every size, so big rotors turn slowly.',
    'Rotor speed stays nearly constant: collective pitch sets the size of the thrust, cyclic pitch tilts the disc and the thrust with it.',
    'Flapping responds to cyclic pitch 90° later, because the blade is a resonant system driven at its natural frequency.',
    'The swashplate carries pitch from the fixed controls to the spinning blades.',
    'Driving the rotor twists the fuselage the other way; a tail rotor pushing sideways with Q/l, or a second counter-rotating rotor, cancels it.'
  ],
  pitfalls: [
    'A helicopter climbs by spinning its rotor faster — Rotor speed is held nearly constant; the pilot raises the collective, which increases the pitch of every blade and so the thrust.',
    'The tail rotor pushes the helicopter forward — It pushes sideways, to cancel the torque reaction of the main rotor and to steer in yaw; forward thrust comes from tilting the main rotor disc.',
    'Cyclic pitch changes the lift where the stick points — The disc tilts where the flapping is greatest, a quarter of a turn after the pitch change; the linkages are rigged so the result is where the pilot pushes.'
  ],
  formulas: [
    {
      name: 'Blade tip speed',
      expr: 'Vt = Omega*R', tex: 'V_{tip} = \\Omega R',
      vars: {
        Vt: { name: 'tip speed', q: 'speed', unit: 'm/s', tex: 'V_{tip}' },
        Omega: { name: 'rotor speed', q: 'angvel', unit: 'rpm', value: 394, tex: '\\Omega' },
        R: { name: 'rotor radius', q: 'length', unit: 'm', value: 5.08 }
      },
      note: 'In the hover. In forward flight at speed V the advancing tip meets ΩR + V and the retreating tip ΩR − V.',
      stories: {
        Vt: 'A rotor of radius {R} turns at {Omega}. How fast do the blade tips move?',
        Omega: 'A designer wants a tip speed of {Vt} on a rotor of radius {R}. At what speed must it turn?'
      }
    },
    {
      name: 'Tail-rotor thrust to cancel the torque',
      expr: 'Ttr = P/(Omega*l)', tex: 'T_{tr} = \\dfrac{P}{\\Omega\\, l}',
      vars: {
        Ttr: { name: 'tail-rotor thrust', q: 'force', unit: 'N', tex: 'T_{tr}' },
        P: { name: 'main-rotor power', q: 'power', unit: 'kW', value: 220 },
        Omega: { name: 'main-rotor speed', q: 'angvel', unit: 'rpm', value: 394, tex: '\\Omega' },
        l: { name: 'distance from the mast to the tail rotor', q: 'length', unit: 'm', value: 5.9 }
      },
      note: 'The main-rotor torque is Q = P/Ω; the tail rotor must supply the opposite moment T·l. It needs power of its own — typically 8–12 % of the main rotor\'s in the hover.',
      stories: {
        Ttr: 'A main rotor absorbs {P} at {Omega}; the tail rotor sits {l} behind the mast. What sideways thrust must it make?',
        l: 'A tail rotor can make {Ttr} of thrust. The main rotor absorbs {P} at {Omega}. How far behind the mast must it be?'
      }
    },
    {
      name: 'Rotor solidity',
      expr: 'sigma = Nb*c/(pi*R)', tex: '\\sigma = \\dfrac{N_b\\, c}{\\pi R}',
      vars: {
        sigma: { name: 'solidity (blade area ÷ disc area)', tex: '\\sigma' },
        Nb: { name: 'number of blades', int: true, value: 2, tex: 'N_b' },
        c: { name: 'blade chord', q: 'length', unit: 'm', value: 0.33 },
        R: { name: 'rotor radius', q: 'length', unit: 'm', value: 5.08 }
      },
      note: 'For blades of constant chord. Helicopter rotors have solidities of about 0.04–0.1; a propeller or a farm windmill much more.',
      stories: { sigma: 'A rotor of radius {R} has {Nb} blades of chord {c}. What is its solidity?' }
    }
  ],
  examples: [
    {
      title: 'Tip speed and tip Mach number',
      q: 'A light utility helicopter has a rotor of radius 5.08 m turning at 394 rpm. Find the tip speed and its Mach number at 15 °C (speed of sound 340 m/s), and the Mach number of the advancing tip at 120 kt.',
      steps: [
        '$\\Omega = 394 \\times 2\\pi/60 = 41.26$ rad/s.',
        '$V_{tip} = \\Omega R = 41.26 \\times 5.08 = 209.6$ m/s, Mach $209.6/340.3 = 0.62$.',
        'At 120 kt $= 61.7$ m/s, the advancing tip meets $209.6 + 61.7 = 271.3$ m/s: Mach 0.80.'
      ],
      a: 'About 210 m/s (Mach 0.62) in the hover; Mach 0.80 on the advancing side at 120 kt.'
    },
    {
      title: 'Sizing the tail rotor',
      q: 'The main rotor of the same helicopter absorbs 220 kW at 394 rpm, and the tail rotor (diameter 1.65 m) is 5.9 m behind the mast. What thrust must it make, and roughly what power does that cost with a figure of merit of 0.65?',
      steps: [
        'Main-rotor torque: $Q = P/\\Omega = 220\\,000/41.26 = 5332$ N·m.',
        'Tail-rotor thrust: $T_{tr} = Q/l = 5332/5.9 = 904$ N.',
        'Its disc area is $\\pi \\times 0.825^2 = 2.14$ m², so by [[hover-power|momentum theory]] $v = \\sqrt{904/(2 \\times 1.225 \\times 2.14)} = 13.1$ m/s.',
        'Ideal power $904 \\times 13.1 = 11.9$ kW; divided by 0.65, about 18 kW.'
      ],
      a: 'About 900 N, costing some 18 kW — 8 % of the main rotor\'s power.'
    }
  ],
  quiz: [
    { q: 'The pilot raises the collective lever. What happens at the rotor?', choices: ['The rotor turns faster', 'All the blades take more pitch together, and the thrust rises', 'The swashplate tilts forward', 'The tail rotor stops'], a: 1,
      why: 'Collective moves the whole swashplate up, adding the same pitch to every blade. Rotor speed is held nearly constant by the governor; tilting the swashplate is cyclic.' },
    { q: 'A helicopter needs a tail rotor mainly because…', choices: ['it needs forward thrust', 'the engine, turning the main rotor, twists the fuselage the other way', 'the main rotor cannot lift the tail', 'it balances the weight of the engine'], a: 1,
      why: 'Torque reaction: whatever turns the rotor one way is pushed the other way. Coaxial and tandem helicopters cancel it with a second rotor turning the opposite way.' },
    { q: 'A helicopter climbs mainly by spinning its rotor faster.', a: false,
      why: 'Rotor speed stays within a few per cent of its set value. Climbing and descending are done with collective pitch (and engine power).' },
    { q: 'A 16.4 m rotor turns at 258 rpm. What is its tip speed, in m/s?', answer: 221, unit: 'm/s', tol: 0.02,
      why: 'Ω = 258 × 2π/60 = 27.0 rad/s; R = 8.18 m; ΩR = 221 m/s — the same tip speed as rotors half its size, turning twice as fast.' },
    { q: 'To tilt the disc forward (lowest at the front) on a rotor turning anticlockwise seen from above, where must the blade pitch be smallest?', choices: ['At the front of the disc', 'A quarter-turn earlier, on the advancing (right) side', 'At the back of the disc', 'On the retreating (left) side'], a: 1,
      why: 'Flapping is a resonance at one per revolution, so the lowest flap comes 90° after the lowest pitch. The blade reaches the front a quarter-turn after passing the right side.' }
  ],
  problems: [
    { q: 'A light helicopter\'s rotor absorbs 60 kW at 530 rpm. Its tail rotor is 4.6 m behind the mast. What thrust must the tail rotor make?', answer: 235, unit: 'N', tol: 0.03,
      steps: ['$\\Omega = 530 \\times 2\\pi/60 = 55.5$ rad/s; $Q = 60\\,000/55.5 = 1081$ N·m.', '$T_{tr} = 1081/4.6 = 235$ N.'] },
    { q: 'A four-bladed rotor of radius 7.3 m has blades of 0.53 m chord. What is its solidity?', answer: 0.0924, tol: 0.02,
      steps: ['$\\sigma = N_b c/(\\pi R) = 4 \\times 0.53/(\\pi \\times 7.3)$.', '$= 2.12/22.93 = 0.092$.'] }
  ],
  applications: ['Choosing a rotor: the tip speed near 200–220 m/s fixes the rotor speed once the diameter is chosen from the weight.', 'Anti-torque layouts: tail rotor, fenestron, NOTAR, coaxial, tandem and intermeshing rotors.', 'Swashplates also steer the cyclic of large unmanned helicopters and model helicopters.', 'Tiltrotors, which use collective and cyclic in the hover and fly as aeroplanes in cruise.'],
  history: 'Leonardo da Vinci sketched an "aerial screw" around 1490. Boris Yuriev described cyclic pitch control by a swashplate around 1911, and Juan de la Cierva gave rotor blades flapping hinges in his autogiros of 1922–23. The Focke-Wulf Fw 61 of 1936, with two side-by-side rotors, was the first practical helicopter; Igor Sikorsky\'s VS-300 of 1939–41 settled the layout still most common today, one main rotor and a tail rotor.',
  sim: 'rot-disc'
},

{
  id: 'hover-power', parent: 'rotorcraft', title: 'Power to hover', level: 2,
  short: 'A hovering rotor holds itself up by pushing air downward. Momentum theory gives the least power it can do it with, P = T^1.5 / √(2ρA): power grows faster than weight and falls as the rotor gets bigger — which is why helicopters have large rotors and why hovering is expensive.',
  keywords: ['hover', 'hover power', 'induced power', 'induced velocity', 'downwash', 'disc loading', 'power loading', 'figure of merit', 'momentum theory', 'actuator disc', 'hover ceiling', 'ground effect', 'IGE', 'OGE', 'hot and high'],
  prereq: ['momentum-theory', 'helicopter-rotor', 'air-density', 'physics:power'],
  related: ['multicopters', 'autorotation', 'density-altitude', 'ground-effect', 'propulsive-efficiency', 'betz-limit', 'insect-flight', 'physics:conservation-of-momentum'],
  body: `
To hover, a rotor must push up with a force equal to the weight, and the only thing it has to push against is the air. So it throws air downward. The thrust is the momentum given to that air each second; the power is the kinetic energy given to it each second. Treating the rotor as an **actuator disc** (see [[momentum-theory]]), the air passes through the disc at a speed $v_h$ and speeds up to $2v_h$ far below, where the stream has contracted to half the disc's area. The results are among the most useful in all of aerodynamics:

$$v_h = \\sqrt{\\frac{T}{2\\rho A}}, \\qquad P_{ideal} = T\\,v_h = \\frac{T^{3/2}}{\\sqrt{2\\rho A}}$$

### What the formula says
- **Weight to the power 1.5.** 20 % more weight needs $1.2^{1.5} = 1.31$ times the power. Heavy hovering is disproportionately costly.
- **Bigger is better.** Power falls as $1/\\sqrt{A}$, that is as $1/D$: double the rotor diameter and the ideal power halves. Throwing a lot of air gently beats throwing a little air hard — the same reason airliners have huge fans (see [[propulsive-efficiency]]).
- **Thin air costs.** Power grows as $1/\\sqrt{\\rho}$: 16 % more at 3000 m in the standard atmosphere, more still on a hot day — the [[density-altitude]] problem.
- **Power per newton is the downwash speed.** $P/T = v_h = \\sqrt{(T/A)/(2\\rho)}$. The thrust per unit disc area, $T/A$, is the **disc loading**; it sets the speed of the downwash and the kilograms lifted per kilowatt.

| | Mass | Rotors | Disc loading | $v_h$ | Ideal lift per power |
|---|---|---|---|---|---|
| Human-powered helicopter | 130 kg | four of 20 m | 1 N/m² | 0.6 m/s | 160 kg/kW |
| Camera drone | 1.5 kg | four of 0.25 m | 73 N/m² | 5.4 m/s | 19 kg/kW |
| Light helicopter | 620 kg | 7.7 m | 132 N/m² | 7.3 m/s | 14 kg/kW |
| Medium helicopter | 9 t | 16.4 m | 420 N/m² | 13 m/s | 7.8 kg/kW |
| Heavy-lift helicopter | 56 t | 32 m | 680 N/m² | 17 m/s | 6.1 kg/kW |
| Tiltrotor | 24 t | two of 11.6 m | 1100 N/m² | 21 m/s | 4.8 kg/kW |

A jet-lift fighter, with its whole thrust through a nozzle of about a square metre, has a "disc loading" of tens of kilonewtons per square metre and burns fuel accordingly in the hover.

### The figure of merit
Real rotors need more than the ideal. The inflow is not uniform, the tips lose lift, the wake swirls, and the blades have [[skin-friction|profile drag]]. The **figure of merit** rates a rotor against the ideal: $\\mathrm{FM} = P_{ideal}/P$. Good helicopter rotors reach 0.7–0.8; small drone propellers, working at low [[reynolds-number|Reynolds numbers]], 0.5–0.65. On top of the main rotor come the tail rotor (8–12 %) and the gearbox (3–5 %).

### Hover ceiling and ground effect
Engines also lose power in thin air, while the power needed rises, so at some height the two meet: the **hover ceiling**. Close to the ground the picture improves: the ground blocks the downwash, the induced velocity falls and so does the power. With the rotor at a height of one radius, it makes about 7 % more thrust for the same power (roughly 10 % less power for the same thrust); beyond about one diameter the benefit has gone (see [[ground-effect]]). Helicopter charts therefore give two weights for every altitude and temperature: hover in ground effect (IGE) and out of ground effect (OGE).

> [!key] $P = T v_h$: the power per newton of thrust is the speed you give the air. Lift a lot of air gently.

> [!warn] The weight a real helicopter can hover with, at a given altitude and temperature and in or out of ground effect, comes from the performance charts of its approved flight manual. These pages explain the physics; they are not for flight planning.
`,
  ideas: [
    'A hovering rotor pushes air down; momentum gives thrust T = 2ρAv_h², energy gives power P = T·v_h.',
    'Ideal hover power is T^1.5/√(2ρA): 20 % more weight needs 31 % more power; doubling the diameter halves it.',
    'Disc loading T/A sets the downwash speed and the kilograms lifted per kilowatt.',
    'Real rotors need the ideal power divided by the figure of merit, 0.7–0.8 for good rotors.',
    'Thin, hot air raises the power (∝ 1/√ρ); ground effect lowers it near the ground.'
  ],
  pitfalls: [
    'Hover power is proportional to weight — It grows as weight to the power 1.5, because a heavier load needs both more thrust and a faster downwash.',
    'A small, fast-spinning rotor is as good as a big slow one if it makes the same thrust — The small one must throw the air faster, and the power per newton is exactly that speed; the big rotor wins.',
    'The downwash under a hovering helicopter is the same speed as at the rotor — It keeps accelerating below the disc, to twice the speed far below, as the stream contracts.'
  ],
  derivation: {
    title: 'Derive the power to hover from momentum and energy',
    steps: [
      { text: 'Air, at rest far above, passes the disc at $v_h$ and leaves far below at $w$. The mass flow through the disc is', tex: '\\dot m = \\rho A v_h' },
      { text: 'The thrust is the momentum given to the air each second:', tex: 'T = \\dot m\\, w' },
      { text: 'The power is the kinetic energy given to the air each second — and also the thrust times the speed at which the disc pushes the air:', tex: 'P = \\tfrac12\\, \\dot m\\, w^2 = T\\, v_h' },
      { text: 'Equating the two gives the factor of two:', tex: '\\tfrac12\\, \\dot m\\, w^2 = \\dot m\\, w\\, v_h \\;\\Rightarrow\\; w = 2 v_h' },
      { text: 'So $T = 2\\rho A v_h^2$, and', tex: 'v_h = \\sqrt{\\frac{T}{2\\rho A}}, \\qquad P = T v_h = \\frac{T^{3/2}}{\\sqrt{2\\rho A}}' }
    ]
  },
  formulas: [
    {
      name: 'Induced velocity in the hover',
      expr: 'vh = sqrt(T/(2*rho*A))', tex: 'v_h = \\sqrt{\\dfrac{T}{2\\rho A}}',
      vars: {
        vh: { name: 'air speed through the disc', q: 'speed', unit: 'm/s', tex: 'v_h' },
        T: { name: 'thrust (equal to the weight in the hover)', q: 'force', unit: 'N', value: 6082 },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, min: 0.5, max: 1.4, tex: '\\rho' },
        A: { name: 'rotor disc area', q: 'area', unit: 'm²', value: 46.2 }
      },
      note: 'Momentum theory for an ideal actuator disc, out of ground effect. Far below, the downwash reaches 2v_h.',
      stories: {
        vh: 'A rotor of {A} hovers with a thrust of {T} in air of density {rho}. How fast does the air pass through it?',
        A: 'A designer wants the downwash through a rotor making {T} to be no faster than {vh} (air density {rho}). What disc area is needed?'
      }
    },
    {
      name: 'Power to hover',
      expr: 'P = T^1.5/(FM*sqrt(2*rho*A))', tex: 'P = \\dfrac{T^{3/2}}{\\mathrm{FM}\\sqrt{2\\rho A}}',
      vars: {
        P: { name: 'rotor power', q: 'power', unit: 'kW' },
        T: { name: 'thrust (equal to the weight in the hover)', q: 'force', unit: 'N', value: 6082 },
        FM: { name: 'figure of merit (1 for an ideal rotor)', value: 0.7, min: 0.2, max: 1, tex: '\\mathrm{FM}' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, min: 0.5, max: 1.4, tex: '\\rho' },
        A: { name: 'rotor disc area', q: 'area', unit: 'm²', value: 46.2 }
      },
      note: 'Main-rotor power out of ground effect. Add the tail rotor (8–12 %) and gearbox losses for the engine power.',
      practice: { unknowns: ['P', 'T', 'A', 'FM'] },
      stories: {
        P: 'A helicopter weighing {T} hovers on a rotor of {A} in air of density {rho}. The rotor\'s figure of merit is {FM}. What power does the rotor need?',
        T: 'A rotor of {A} with a figure of merit of {FM} is given {P} in air of density {rho}. What weight can it hover with?',
        FM: 'A rotor of {A} is measured to need {P} to hover with a thrust of {T} in air of density {rho}. What is its figure of merit?'
      }
    },
    {
      name: 'Ground effect (Cheeseman–Bennett)',
      expr: 'kGE = 1/(1 - (R/(4*z))^2)', tex: 'k_{GE} = \\dfrac{1}{1 - \\left(\\dfrac{R}{4z}\\right)^2}',
      vars: {
        kGE: { name: 'thrust in ground effect ÷ thrust out of it, at the same power', min: 1, max: 1.6, tex: 'k_{GE}' },
        R: { name: 'rotor radius', q: 'length', unit: 'm', value: 3.835 },
        z: { name: 'height of the rotor above the ground', q: 'length', unit: 'm', value: 3.8 }
      },
      note: 'A simple estimate from a mirror-image source (Cheeseman and Bennett, 1955), fair for heights above about half the radius. Real rotors are measured.',
      practice: { unknowns: ['kGE', 'z'] },
      stories: { kGE: 'A rotor of radius {R} hovers with its hub {z} above the ground. By what factor does ground effect raise its thrust at the same power?' }
    }
  ],
  examples: [
    {
      title: 'The power of a light helicopter',
      q: 'A light two-seat helicopter of 620 kg has a rotor of 7.67 m diameter. Find its disc loading, induced velocity, ideal power and rotor power (figure of merit 0.7) at sea level.',
      steps: [
        'Weight $T = 620 \\times 9.81 = 6082$ N; disc area $A = \\pi \\times 7.67^2/4 = 46.2$ m².',
        'Disc loading $T/A = 132$ N/m² (13.4 kg/m²).',
        '$v_h = \\sqrt{132/(2 \\times 1.225)} = 7.33$ m/s.',
        'Ideal power $T v_h = 6082 \\times 7.33 = 44.6$ kW; rotor power $44.6/0.7 = 63.7$ kW.',
        'With about 15 % more for the tail rotor and gearbox, the engine must give some 73 kW (about 100 hp).'
      ],
      a: 'About 64 kW for the main rotor and roughly 73 kW in all, with a downwash of 7.3 m/s through the disc.'
    },
    {
      title: 'Hot and high',
      q: 'The same helicopter hovers at 3000 m, first in the standard atmosphere ($\\rho = 0.909$ kg/m³), then on a day 20 °C warmer ($\\rho = 0.846$ kg/m³). How much more rotor power does it need?',
      steps: [
        'Power scales as $1/\\sqrt{\\rho}$ at the same weight.',
        'Standard day: $\\sqrt{1.225/0.909} = 1.161$, so $63.7 \\times 1.161 = 74.0$ kW (+16 %).',
        'Hot day: $\\sqrt{1.225/0.846} = 1.203$, so 76.6 kW (+20 %) — while the engine itself is making less power in the thin air.'
      ],
      a: '16 % more on a standard day and 20 % more on a hot one.'
    },
    {
      title: 'Measuring a figure of merit',
      q: 'A 1450 kg helicopter with a 10.16 m rotor is measured to need 170 kW at the main rotor to hover at sea level. What is its figure of merit?',
      steps: [
        '$T = 14\\,224$ N; $A = \\pi \\times 10.16^2/4 = 81.1$ m².',
        '$P_{ideal} = T^{3/2}/\\sqrt{2\\rho A} = 1.697\\times 10^6/\\sqrt{2 \\times 1.225 \\times 81.1} = 1.697 \\times 10^6/14.09 = 120.4$ kW.',
        '$\\mathrm{FM} = 120.4/170 = 0.71$.'
      ],
      a: 'FM ≈ 0.71 — a typical value for a good helicopter rotor.'
    }
  ],
  quiz: [
    { q: 'At the same weight, doubling the rotor diameter changes the ideal hover power by a factor of…', choices: ['2', '1/2', '1/4', '1 (no change)'], a: 1,
      why: 'P ∝ 1/√A and A ∝ D², so P ∝ 1/D. Twice the diameter moves four times the area of air at half the speed.' },
    { q: 'A helicopter takes on 20 % more load. Its hover power rises by about…', choices: ['20 %', '31 %', '44 %', '10 %'], a: 1,
      why: 'P ∝ T^1.5, and 1.2^1.5 = 1.31. Both the thrust and the downwash speed go up.' },
    { q: 'What is the ideal hover power of a rotor 5 m in diameter carrying 100 kg at sea level?', answer: 4430, unit: 'W', tol: 0.03,
      why: 'T = 981 N, A = 19.6 m², P = 981^1.5/√(2 × 1.225 × 19.6) = 30 730/6.94 ≈ 4430 W. A strong cyclist can give about a tenth of that for long — which is why human-powered helicopters need rotors of 20 m.' },
    { q: 'At the same weight, a rotor needs more power to hover in cold air than in hot air.', a: false,
      why: 'Cold air is denser. P ∝ 1/√ρ, so the rotor needs less power in cold air and more on a hot day.' },
    { q: 'Why does a jet-lift aircraft burn so much more fuel in the hover than a helicopter of the same weight?', choices: ['Jet engines are inefficient at any speed', 'It pushes a small mass of air very fast: its "disc loading" is huge, and power per newton is the air speed', 'It must also fly forward', 'Its wings produce drag in the hover'], a: 1,
      why: 'P/T = v_h = √(disc loading/2ρ). A nozzle of a square metre gives a jet of hundreds of metres per second instead of ten.' }
  ],
  problems: [
    { q: 'A 9 t helicopter pushes air through its rotor at 13 m/s in the hover. What ideal power does that represent?', answer: 1148, unit: 'kW', tol: 0.02,
      steps: ['$T = 9000 \\times 9.81 = 88\\,290$ N.', '$P = T v_h = 88\\,290 \\times 13 = 1.148$ MW.'] },
    { q: 'A rotor of 46.2 m² hovers with 6082 N at 2000 m, where ρ = 1.007 kg/m³. With a figure of merit of 0.7, what power does it need?', answer: 70.2, unit: 'kW', tol: 0.02,
      steps: ['$T^{3/2} = 6082^{1.5} = 474\\,300$.', '$\\sqrt{2 \\times 1.007 \\times 46.2} = 9.646$.', '$P = 474\\,300/(0.7 \\times 9.646) = 70.2$ kW.'] }
  ],
  applications: ['Sizing helicopters: disc loading is one of the first choices, trading rotor size and weight against power and downwash.', 'Hover performance charts, in and out of ground effect, for every helicopter.', 'Choosing drone propellers: the largest that fits usually hovers longest.', 'Downwash safety: at high disc loading the wake reaches 20–30 m/s, enough to throw debris and knock people over.'],
  history: 'Momentum theory for propellers goes back to William Rankine (1865) and R. E. Froude (1889); applied to hovering rotors, it gave the first helicopter designers their power estimates, and the figure of merit became the standard way to rate a rotor against the ideal. Human-powered helicopters show the extreme: AeroVelo\'s Atlas, with four 20 m rotors and a disc loading of about 1 N/m², hovered for 64 seconds in 2013 and won the Sikorsky Prize.',
  sim: 'rot-hover'
},

{
  id: 'autorotation', parent: 'rotorcraft', title: 'Autorotation', level: 2,
  short: 'If a helicopter\'s engine stops, the pilot lowers the collective and the rotor keeps turning by itself: air flowing up through the disc as the helicopter descends drives it like a windmill. The helicopter glides down steeply, and a flare near the ground trades forward speed and rotor energy for a soft landing.',
  keywords: ['autorotation', 'engine failure', 'freewheel unit', 'rotor rpm', 'rotor inertia', 'flare', 'height–velocity diagram', 'dead man\'s curve', 'driving region', 'driven region', 'autogiro', 'gyroplane', 'windmill brake state', 'rate of descent', 'vertical autorotation'],
  prereq: ['helicopter-rotor', 'hover-power', 'physics:rotational-kinetic-energy'],
  related: ['gliding', 'seeds-gliders', 'wind-turbines', 'energy-management', 'tip-speed-ratio', 'physics:conservation-of-energy'],
  body: `
A helicopter's engine drives the rotor through a **freewheel** (a one-way clutch), so that if the engine stops the rotor can keep turning. It then has to get its energy from somewhere, and the only source left is height. The helicopter descends; air flows **up** through the disc; with the blade pitch lowered, the aerodynamic forces on the blades keep them turning — exactly as the wind turns a [[wind-turbines|wind turbine]]. In steady autorotation the energy of height, released at the rate $mg \\times$ (rate of descent), pays for all the rotor's losses.

### The first seconds
While the engine was running the rotor was absorbing its full power. The instant it stops, the rotor keeps losing energy at that rate, and all it has is its own kinetic energy $\\tfrac12 I\\Omega^2$. A light two-bladed rotor with $I \\approx 240$ kg·m² at 530 rpm stores about 370 kJ — but it can only lose about a fifth of that before the speed has dropped 10 % and the blades, needing ever more pitch, approach the stall. At 75 kW that takes under a second. So the pilot's first action is to **lower the collective** at once, cutting the blade pitch and drag and letting the upflow take over. Heavy, high-inertia rotors give more time; light ones very little.

### Why the upflow drives the blades
Look at one blade section. In powered flight the air comes at it from ahead and a little from above. In a descent it comes from ahead and from **below**, so the relative wind is tilted up. Lift is perpendicular to the relative wind, so it tilts forward — into the direction of rotation. Where its forward pull beats the section's drag, the air drives the blade; where it does not, the air brakes it. Along the blade in vertical autorotation:

- near the root the angle of attack is so large that the section is **stalled** and only brakes;
- the middle part, roughly 25–70 % of the radius, is the **driving region**;
- the fast outer part meets a flatter relative wind and is **driven**, a drag on the rotor.

The rotor settles at the speed where driving and braking balance; the pilot adjusts that balance — and the rotor speed — with the collective.

### The steady descent
Energy gives a good estimate: the rate of descent is roughly the power needed for level flight at that airspeed divided by the weight. Descending at the airspeed of minimum power, a light helicopter needing 45 kW and weighing 620 kg comes down at about 7.4 m/s (some 1500 ft/min), gliding about 4.5 m forward for every metre of height — steep beside a light aeroplane's 9 : 1, let alone a glider's 40 : 1. Without forward speed the rotor behaves like a parachute of its own disc area with a drag coefficient of about 1.2, and the same helicopter would descend at about 13 m/s: vertical autorotation is much faster.

### The flare and landing
Near the ground the pilot pulls the cyclic back. The disc tilts back, more air flows up through it, the rotor speeds up and its thrust rises, and the helicopter slows both forward and downward. The forward speed is the energy source: 620 kg at 33 m/s carries 340 kJ, as much as the rotor itself. Levelled, and a few feet up, the pilot raises the collective to cushion the touchdown, spending the rotor's kinetic energy as its speed decays.

### The height–velocity diagram
Autorotation needs speed or height, and time. Each helicopter's flight manual has a **height–velocity diagram** marking the combinations from which a safe autorotative landing is unlikely: a low hover or slow flight between a few metres and a few hundred feet, where there is neither time to lower the collective and gain speed nor height to trade; and fast flight very close to the ground, with no room to flare.

> [!warn] Autorotation is an emergency procedure that is trained and practised. Entry technique, airspeeds, rotor speed limits and the height–velocity diagram are specific to each helicopter type and come from its approved flight manual and flight training, together with the rules of the air — never from these pages.

A maple seed lives in permanent autorotation — the simulation on this page shows one, and [[seeds-gliders]] tells its story; the autogiro (gyroplane) flies in it too, with an unpowered rotor and a propeller for thrust.
`,
  ideas: [
    'After an engine failure the rotor is driven by air flowing up through it as the helicopter descends — like a wind turbine.',
    'The rotor\'s stored energy lasts only a second or two at full power, so the collective must be lowered at once.',
    'In a descent the relative wind comes from below, tilting the lift forward; the middle of the blade drives, the root stalls, the tip is driven.',
    'Rate of descent ≈ (power for level flight at that speed) ÷ weight; vertical autorotation is much faster.',
    'The flare turns forward speed and rotor energy into a soft landing; the height–velocity diagram marks where that is not possible.'
  ],
  pitfalls: [
    'When the engine stops, the rotor stops and the helicopter falls — A freewheel lets the rotor keep turning, and the upflow of a descent drives it; the helicopter glides down under control.',
    'The rotor\'s stored energy is enough to get down safely — It lasts a second or two at full power. Height and forward speed are the real energy sources; the rotor\'s own energy is spent in the final cushion.',
    'Descending straight down is the gentlest autorotation — Without forward speed the rotor acts only as a parachute, and the descent is much faster than at the best glide speed.'
  ],
  formulas: [
    {
      name: 'How long the rotor\'s energy lasts',
      expr: 't = 0.5*I*(Omega1^2 - Omega2^2)/P', tex: 't = \\dfrac{\\tfrac12 I\\,(\\Omega_1^2 - \\Omega_2^2)}{P}',
      vars: {
        t: { name: 'time', q: 'time', unit: 's' },
        I: { name: 'rotor moment of inertia', q: 'inertia', unit: 'kg·m²', value: 240 },
        Omega1: { name: 'rotor speed at the start', q: 'angvel', unit: 'rpm', value: 530, tex: '\\Omega_1' },
        Omega2: { name: 'lowest acceptable rotor speed', q: 'angvel', unit: 'rpm', value: 477, tex: '\\Omega_2' },
        P: { name: 'power the rotor is still absorbing', q: 'power', unit: 'kW', value: 75 }
      },
      note: 'The time for the rotor to slow from Ω₁ to Ω₂ if nothing replaces the power it absorbs. It shows why the pilot must lower the collective within about a second on light rotors.',
      practice: { unknowns: ['t', 'I', 'P'] },
      stories: {
        t: 'A rotor of inertia {I} turns at {Omega1} and is absorbing {P} when the engine stops. How long until it has slowed to {Omega2}?',
        I: 'A designer wants a rotor absorbing {P} to take {t} to slow from {Omega1} to {Omega2}. What moment of inertia does it need?'
      }
    },
    {
      name: 'Rate of descent in steady autorotation',
      expr: 'Vd = P/(m*g)', tex: 'V_d = \\dfrac{P}{m g}',
      vars: {
        Vd: { name: 'rate of descent', q: 'speed', unit: 'ft/min', tex: 'V_d' },
        P: { name: 'power needed for level flight at the same airspeed', q: 'power', unit: 'kW', value: 45 },
        m: { name: 'helicopter mass', q: 'mass', unit: 'kg', value: 620 },
        g: { const: 'g' }
      },
      note: 'An energy estimate: the loss of height must supply the power the rotor would need at that airspeed. Real values differ because the tail rotor and gearbox absorb less without the engine.',
      stories: { Vd: 'A helicopter of {m} needs {P} to fly level at its best-endurance speed. Estimate its rate of descent in autorotation at that speed.' }
    },
    {
      name: 'Vertical autorotation: the rotor as a parachute',
      expr: 'Vd = sqrt(2*m*g/(rho*A*CD))', tex: 'V_d = \\sqrt{\\dfrac{2 m g}{\\rho A\\, C_D}}',
      vars: {
        Vd: { name: 'rate of descent', q: 'speed', unit: 'm/s', tex: 'V_d' },
        m: { name: 'helicopter mass', q: 'mass', unit: 'kg', value: 620 },
        g: { const: 'g' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, min: 0.5, max: 1.4, tex: '\\rho' },
        A: { name: 'rotor disc area', q: 'area', unit: 'm²', value: 46.2 },
        CD: { name: 'drag coefficient based on the disc area', value: 1.2, min: 0.1, max: 2, tex: 'C_D' }
      },
      note: 'An ideal rotor in vertical autorotation descends at about 1.8 times its hover induced velocity, which is the same as C_D ≈ 1.2. Blade drag makes real rotors, and seeds, fall faster (a lower C_D).',
      stories: { Vd: 'A helicopter of {m} with a {A} rotor autorotates straight down in air of density {rho}. Taking $C_D$ = {CD} for the disc, how fast does it descend?' }
    }
  ],
  examples: [
    {
      title: 'A second of rotor energy',
      q: 'A light helicopter\'s two blades give its rotor a moment of inertia of 240 kg·m²; it turns at 530 rpm and absorbs 75 kW. If the engine stops and nothing changes, how long until the rotor is down to 90 % speed?',
      steps: [
        '$\\Omega_1 = 530 \\times 2\\pi/60 = 55.5$ rad/s; $\\Omega_2 = 0.9\\,\\Omega_1 = 49.95$ rad/s.',
        'Stored energy $\\tfrac12 \\times 240 \\times 55.5^2 = 370$ kJ.',
        'Energy between 100 % and 90 %: $\\tfrac12 \\times 240 \\times (55.5^2 - 49.95^2) = 70.2$ kJ — only 19 % of the store.',
        '$t = 70.2/75 = 0.94$ s.'
      ],
      a: 'Under one second — hence the immediate lowering of the collective.'
    },
    {
      title: 'Descent rate and glide',
      q: 'The same 620 kg helicopter needs about 45 kW for level flight at 65 kt, its speed of minimum power. Estimate its rate of descent and glide ratio in autorotation at that speed.',
      steps: [
        '$V_d = P/(mg) = 45\\,000/(620 \\times 9.81) = 7.4$ m/s, about 1460 ft/min.',
        '65 kt $= 33.4$ m/s, so the glide ratio is $33.4/7.4 = 4.5$.'
      ],
      a: 'About 7.4 m/s (1460 ft/min), gliding at roughly 4.5 : 1.'
    },
    {
      title: 'Straight down',
      q: 'If it autorotated with no forward speed, how fast would the same helicopter (rotor 46.2 m²) come down at sea level, taking $C_D = 1.2$ for the disc?',
      steps: [
        '$V_d = \\sqrt{2 \\times 6082/(1.225 \\times 46.2 \\times 1.2)} = \\sqrt{179} = 13.4$ m/s.',
        'That is about 2630 ft/min — nearly twice the descent rate with forward speed.'
      ],
      a: 'About 13 m/s: vertical autorotation is far faster than gliding autorotation.'
    }
  ],
  quiz: [
    { q: 'In autorotation, what keeps the rotor turning?', choices: ['A small emergency motor', 'Air flowing up through the disc as the helicopter descends', 'The rotor\'s stored energy, until it runs down', 'The tail rotor'], a: 1,
      why: 'The descent makes the air come up through the disc; with the pitch lowered, the lift on the middle of the blades tilts forward and drives them. The stored energy alone lasts only seconds.' },
    { q: 'Right after an engine failure in cruise, what must the pilot do first to keep rotor speed?', choices: ['Raise the collective to hold height', 'Lower the collective to reduce the blade pitch', 'Press a pedal', 'Increase the throttle'], a: 1,
      why: 'Lowering the collective cuts the blades\' drag and lets the upflow drive them. Raising it would spend the rotor\'s small store of energy in a second.' },
    { q: 'A helicopter descends more slowly in a vertical autorotation than in one with forward speed.', a: false,
      why: 'With forward speed the rotor works like a wing and needs less power — so less descent. Straight down it is only a parachute and falls about twice as fast.' },
    { q: 'In vertical autorotation, which part of the blade drives the rotor round?', choices: ['The tip', 'The middle part of the blade', 'The root', 'All of it equally'], a: 1,
      why: 'Near the root the section is stalled; the fast tip sees a flat relative wind and is dragged along; in between, the lift tilts far enough forward to drive.' },
    { q: 'A 1450 kg helicopter needs 110 kW for level flight at its best-endurance speed. Estimate its rate of descent in autorotation at that speed, in m/s.', answer: 7.73, unit: 'm/s', tol: 0.03,
      why: 'V_d ≈ P/(mg) = 110 000/(1450 × 9.81) = 7.7 m/s, about 1520 ft/min.' }
  ],
  problems: [
    { q: 'A rotor has a moment of inertia of 1100 kg·m² and turns at 394 rpm. How much kinetic energy does it store?', answer: 936, unit: 'kJ', tol: 0.02,
      steps: ['$\\Omega = 394 \\times 2\\pi/60 = 41.26$ rad/s.', '$E = \\tfrac12 I \\Omega^2 = 0.5 \\times 1100 \\times 41.26^2 = 936$ kJ.'] }
  ],
  applications: ['Helicopter emergency training and certification: every type must be able to land in autorotation, and its height–velocity diagram is measured in flight tests.', 'Rotor design: blade inertia is chosen partly for autorotation entry and the final flare.', 'Autogiros (gyroplanes), which fly in permanent autorotation.', 'Recovery of spacecraft and drones by autorotating rotors, and the maple seed\'s own way of falling.'],
  history: 'Juan de la Cierva set out to build an aircraft that could not stall after one of his aeroplanes crashed: his autogiro\'s unpowered rotor turned in permanent autorotation, and the C.4 flew in January 1923. The same physics made the helicopter survivable. The freewheel that lets the rotor spin on after the engine stops is in every helicopter, and autorotations to the ground are part of every helicopter pilot\'s training.',
  sim: 'rot-samara'
},

{
  id: 'multicopters', parent: 'rotorcraft', title: 'Multicopters and drones', level: 1,
  short: 'A multicopter hovers on four, six or eight fixed-pitch propellers and steers by changing their speeds: more thrust on one side tilts it, and the difference in torque between the clockwise and anticlockwise propellers turns it. Its hover power and its battery set how long it can fly.',
  keywords: ['drone', 'quadcopter', 'hexacopter', 'octocopter', 'multirotor', 'flight time', 'endurance', 'battery', 'lithium polymer', 'LiPo', 'thrust per motor', 'yaw torque', 'differential thrust', 'propeller size', 'flight controller', 'eVTOL'],
  prereq: ['hover-power', 'physics:newtons-third-law', 'electric-propulsion'],
  related: ['helicopter-rotor', 'propellers', 'momentum-theory', 'fly-by-wire', 'insect-flight', 'physics:torque', 'electronics:batteries'],
  body: `
A helicopter keeps its rotor at a constant speed and changes thrust with blade pitch. A multicopter does the opposite: its propellers have fixed pitch, each on its own electric motor, and a flight controller changes their speeds hundreds of times a second, guided by gyroscopes and accelerometers. It needs no swashplate, no gearbox and no tail rotor — which is why multicopters became cheap once the electronics did.

### How it steers
- **Up and down**: all propellers faster or slower together.
- **Pitch and roll**: speed up the propellers on one side and slow those on the other. The craft tilts, its thrust tilts with it, and it accelerates sideways — the same trick as a helicopter's [[helicopter-rotor|cyclic]].
- **Yaw**: half the propellers turn clockwise and half anticlockwise, so their torque reactions cancel. Speed up one set and slow the other and the reactions no longer cancel: the frame turns about its vertical axis, without any change in total thrust.
- A multicopter is unstable on its own; the flight controller keeps it level, making it a small example of [[fly-by-wire]] flight.

### Thrust per motor and power
In the hover each of $N$ rotors carries $mg/N$. Momentum theory ([[hover-power]]) over the total disc area $N\\pi D^2/4$, divided by the figure of merit and by the efficiency $\\eta$ of motors and their speed controllers, gives the electrical power:

$$P = \\frac{(mg)^{3/2}}{\\mathrm{FM}\\;\\eta\\,\\sqrt{\\tfrac{\\pi}{2}\\,\\rho N D^2}}$$

Small propellers run at low [[reynolds-number|Reynolds numbers]] (about 50 000–150 000), where figures of merit are 0.5–0.65; motors and controllers manage 0.75–0.85. A 1.5 kg quadcopter on 10-inch propellers needs about 170 W, and pushes air down at 5.4 m/s through its discs.

### Battery and flight time
The battery's energy is capacity times voltage: 5000 mAh at 14.8 V (four lithium-polymer cells) is 74 Wh. Using 80 % of it, to leave a reserve and spare the cells, gives the hover time $t = 0.8\\,E/P$ — about 21 minutes for the quadcopter above. Forward flight at moderate speed can need a little less power than hovering, but wind, climbs and fast flight need more.

| Change from that quadcopter | Hover power | Hover time |
|---|---|---|
| As described: 1.5 kg, 10-inch propellers, 74 Wh | 167 W | 21 min |
| Carrying a 300 g payload | 219 W | 16 min |
| 12-inch propellers | 139 W | 26 min |
| Twice the battery (0.5 kg more) | 257 W | 28 min |
| Hovering at 3000 m | 194 W | 18 min |

Doubling the battery adds only a third to the flight time, because the extra battery has to be lifted too. With power growing as mass to the 1.5, the hover time $t \\propto m_b/(m_0 + m_b)^{3/2}$ peaks when the battery mass $m_b$ is **twice** the mass of everything else — two-thirds of the take-off mass — and the peak is flat: at half that battery the time is only 8 % shorter.

### Scale
Racing drones with 5-inch propellers spin them at 20 000–30 000 rpm; heavy agricultural drones carry tens of kilograms for ten minutes or so; electric air taxis with several rotors carry people, at disc loadings of several hundred newtons per square metre and with far larger batteries. Adding rotors adds disc area and redundancy: a hexacopter or octocopter can usually land after losing a motor, a quadcopter cannot.

> [!warn] Drones follow local rules: in many countries they must be registered, flown within sight, below about 120 m (400 ft) and away from airports and crowds. Lithium batteries store a great deal of energy; charge and store them as the maker directs — a damaged pack can catch fire.
`,
  ideas: [
    'A multicopter controls thrust with propeller speed, not pitch; the flight controller adjusts each motor hundreds of times a second.',
    'Tilting comes from differential thrust; yaw from the difference in torque between clockwise and anticlockwise propellers.',
    'Hover power follows momentum theory: P = (mg)^1.5/(FM η √(πρND²/2)); bigger propellers need less power.',
    'Hover time is usable battery energy ÷ power; doubling the battery gives much less than double the time.',
    'Hover time peaks when the battery is two-thirds of the take-off mass, and the peak is flat.'
  ],
  pitfalls: [
    'Twice the battery gives twice the flight time — The heavier craft needs more power (P ∝ m^1.5), so the gain is far smaller; past a point, more battery shortens the flight.',
    'A quadcopter turns (yaws) by tilting its propellers — The propellers do not tilt; it speeds up the pair turning one way and slows the pair turning the other way, and the unbalanced torque turns the frame.',
    'Smaller, faster propellers are as efficient as large ones if the motors are strong enough — Small propellers must throw air faster, and the power per newton is that speed; they also work at lower Reynolds numbers with lower figures of merit.'
  ],
  formulas: [
    {
      name: 'Thrust per rotor in the hover',
      expr: 'T1 = m*g/N', tex: 'T_1 = \\dfrac{m g}{N}',
      vars: {
        T1: { name: 'thrust of each rotor', q: 'force', unit: 'N', tex: 'T_1' },
        m: { name: 'take-off mass', q: 'mass', unit: 'kg', value: 1.5 },
        g: { const: 'g' },
        N: { name: 'number of rotors', int: true, value: 4, min: 3, max: 12 }
      },
      note: 'In a steady hover. To climb, manoeuvre and hold position in gusts each motor needs spare thrust — a thrust-to-weight ratio of about 2 is a common aim.',
      practice: { unknowns: ['T1', 'm'] },
      stories: { T1: 'A multicopter of {m} has {N} rotors. What thrust must each make in the hover?' }
    },
    {
      name: 'Electrical power to hover',
      expr: 'P = (m*g)^1.5/(FM*eta*sqrt(0.5*pi*rho*N*D^2))', tex: 'P = \\dfrac{(m g)^{3/2}}{\\mathrm{FM}\\,\\eta\\,\\sqrt{\\tfrac{\\pi}{2}\\,\\rho N D^2}}',
      vars: {
        P: { name: 'electrical power', q: 'power', unit: 'W' },
        m: { name: 'take-off mass', q: 'mass', unit: 'kg', value: 1.5 },
        g: { const: 'g' },
        FM: { name: 'figure of merit of the propellers', value: 0.6, min: 0.2, max: 1, tex: '\\mathrm{FM}' },
        eta: { name: 'efficiency of motors and controllers', value: 0.8, min: 0.3, max: 1, tex: '\\eta' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, min: 0.5, max: 1.4, tex: '\\rho' },
        N: { name: 'number of rotors', int: true, value: 4, min: 3, max: 12 },
        D: { name: 'propeller diameter', q: 'length', unit: 'in', value: 10 }
      },
      note: 'Momentum theory over the total disc area, out of ground effect, with propellers far enough apart not to disturb each other. Avionics and cameras add a few watts.',
      practice: { unknowns: ['P', 'm', 'D'] },
      stories: {
        P: 'A multicopter of {m} hovers on {N} propellers of {D} diameter (figure of merit {FM}, motor efficiency {eta}) in air of density {rho}. What electrical power does it draw?',
        D: 'A {m} multicopter with {N} rotors must hover on {P} (figure of merit {FM}, motor efficiency {eta}, air density {rho}). What propeller diameter does it need?'
      }
    },
    {
      name: 'Hover time from the battery',
      expr: 't = f*Q*U/P', tex: 't = \\dfrac{f\\, Q\\, U}{P}',
      vars: {
        t: { name: 'hover time', q: 'time', unit: 'min' },
        f: { name: 'share of the charge used', q: 'ratio', unit: '%', value: 80, min: 10, max: 100 },
        Q: { name: 'battery capacity', q: 'charge', unit: 'mA·h', value: 5000 },
        U: { name: 'battery voltage', q: 'voltage', unit: 'V', value: 14.8 },
        P: { name: 'electrical power in the hover', q: 'power', unit: 'W', value: 167 }
      },
      note: 'Capacity × voltage is the stored energy (5000 mAh × 14.8 V = 74 Wh). Voltage sags as the pack empties and in the cold, so real times are a little shorter.',
      stories: {
        t: 'A drone draws {P} in the hover from a {U} battery of {Q}. Using {f} of the charge, how long can it hover?',
        Q: 'A drone draws {P} from a {U} battery. What capacity gives {t} of hover using {f} of the charge?'
      }
    }
  ],
  examples: [
    {
      title: 'Hover time of a camera quadcopter',
      q: 'A quadcopter of 1.5 kg with 10-inch (0.254 m) propellers has a figure of merit of 0.6, motors and controllers of 80 % efficiency, and a 4-cell 5000 mAh (14.8 V) battery. How much power does it need to hover at sea level, and for how long can it hover using 80 % of the charge?',
      steps: [
        'Thrust per motor: $1.5 \\times 9.81/4 = 3.68$ N (375 g).',
        '$(mg)^{3/2} = 14.72^{1.5} = 56.5$; $\\sqrt{\\tfrac{\\pi}{2} \\times 1.225 \\times 4 \\times 0.254^2} = 0.705$.',
        '$P = 56.5/(0.6 \\times 0.8 \\times 0.705) = 167$ W, a current of $167/14.8 = 11.3$ A.',
        'Energy used: $0.8 \\times 5\\ \\mathrm{A\\,h} \\times 14.8\\ \\mathrm{V} = 59.2$ Wh; $t = 59.2/167 = 0.355$ h $= 21$ min.'
      ],
      a: 'About 167 W and 21 minutes of hover.'
    },
    {
      title: 'The best battery',
      q: 'Show that, if the power grows as the total mass to the 1.5 power, the hover time is longest when the battery mass is twice the mass of everything else.',
      steps: [
        'Energy is proportional to the battery mass $m_b$; power to $(m_0 + m_b)^{3/2}$, where $m_0$ is the rest of the craft. So $t \\propto m_b\\,(m_0 + m_b)^{-3/2}$.',
        { text: 'Differentiate and set to zero:', tex: '\\frac{dt}{dm_b} \\propto (m_0 + m_b)^{-5/2}\\left[(m_0 + m_b) - \\tfrac32 m_b\\right] = 0 \\;\\Rightarrow\\; m_b = 2m_0' },
        'At $m_b = m_0$ the time is $0.92$ of the best; at $m_b = m_0/2$ it is $0.71$ — the top of the curve is flat.'
      ],
      a: 'The best battery is two-thirds of the take-off mass, but carrying rather less costs little flight time.'
    }
  ],
  quiz: [
    { q: 'How does a quadcopter turn about its vertical axis (yaw)?', choices: ['By tilting two of its propellers', 'By speeding up the propellers that turn one way and slowing those that turn the other way', 'With a small tail rotor', 'By shifting its battery'], a: 1,
      why: 'The torque reactions of the clockwise and anticlockwise pairs no longer cancel, so the frame turns; total thrust can stay the same.' },
    { q: 'Doubling the battery of a drone doubles its hover time.', a: false,
      why: 'The heavier drone needs more power, growing as mass to the 1.5. In the example, doubling the battery added only about 30 %.' },
    { q: 'A 2 kg hexacopter hovers. What thrust must each motor give, in newtons?', answer: 3.27, unit: 'N', tol: 0.02,
      why: '2 × 9.81/6 = 3.27 N, the weight of about 333 g.' },
    { q: 'Why do larger propellers give a longer hover at the same mass?', choices: ['They spin faster', 'They push a larger mass of air more slowly, which needs less power', 'They are lighter', 'They have more blades'], a: 1,
      why: 'P = T·v_h, and v_h falls as the disc area grows. The same thrust from more air at lower speed costs less energy.' },
    { q: 'Compared with sea level, the same drone hovering at 3000 m (ρ = 0.909 kg/m³) needs about…', choices: ['the same power', '16 % more power', '16 % less power', '35 % more power'], a: 1,
      why: 'Power grows as 1/√ρ: √(1.225/0.909) = 1.16.' }
  ],
  problems: [
    { q: 'A drone draws 240 W in the hover from a 6-cell (22.2 V) battery of 4000 mAh. Using 80 % of the charge, for how many minutes can it hover?', answer: 17.8, unit: 'min', tol: 0.02,
      steps: ['Energy used: $0.8 \\times 4\\ \\mathrm{A\\,h} \\times 22.2\\ \\mathrm{V} = 71.0$ Wh.', '$t = 71.0/240 = 0.296$ h $= 17.8$ min.'] },
    { q: 'What is the ideal hover power (figure of merit and efficiency both 1) of a 2.5 kg quadcopter with 12-inch propellers at sea level?', answer: 144, unit: 'W', tol: 0.02,
      steps: ['$D = 0.3048$ m; total disc area $4 \\times \\pi \\times 0.3048^2/4 = 0.292$ m².', '$P = (24.5)^{1.5}/\\sqrt{2 \\times 1.225 \\times 0.292} = 121.4/0.846 = 144$ W.'] }
  ],
  applications: ['Aerial photography, mapping and inspection of bridges, power lines and wind-turbine blades.', 'Agricultural spraying and small-parcel delivery, where payload trades directly against flight time.', 'Electric air taxis with several rotors, which apply the same physics at hundreds of kilograms.', 'Research platforms for control theory, swarms and flapping-wing flight.'],
  history: 'The first machine to lift a person vertically was a quadrotor: the Breguet–Richet Gyroplane No. 1 of 1907, steadied by helpers on the ground. George de Bothezat and Étienne Oehmichen flew larger quadrotors in the early 1920s, but keeping four rotors in balance by hand was too hard and the single-rotor helicopter won. Multicopters returned in the 2000s, when cheap electronic gyroscopes, fast microcontrollers, brushless motors and lithium-polymer batteries made computer-stabilised flight practical.',
  sim: 'rot-multicopter'
},

{
  id: 'retreating-blade', parent: 'rotorcraft', title: 'Forward flight and retreating-blade stall', level: 3,
  short: 'In forward flight the blade moving into the wind meets faster air than the blade moving away. To keep the rotor from rolling, the retreating blade must work at a higher angle of attack, and at high speed it stalls, while the advancing tip nears the speed of sound. Between them they hold a conventional helicopter to about 150–170 knots.',
  keywords: ['retreating blade stall', 'advancing blade', 'dissymmetry of lift', 'advance ratio', 'reverse flow region', 'flapping', 'blowback', 'cyclic trim', 'never-exceed speed', 'VNE', 'compressibility', 'tip Mach number', 'compound helicopter', 'advancing blade concept', 'tiltrotor'],
  prereq: ['helicopter-rotor', 'stall', 'mach-number', 'physics:relative-velocity'],
  related: ['hover-power', 'transonic-flow', 'critical-mach', 'propeller-efficiency', 'autorotation', 'density-altitude', 'load-factor'],
  body: `
In the hover every blade section at radius $r$ meets air at $\\Omega r$, wherever the blade is. In forward flight at speed $V$, the speed of the helicopter adds to the blade's on one side of the disc and subtracts on the other. With the blade's position measured by the azimuth $\\psi$ (zero pointing aft, 90° on the side where blades move forward):

$$u_T = \\Omega r + V\\sin\\psi, \\qquad \\mu = \\frac{V}{\\Omega R}$$

The **advance ratio** $\\mu$ measures how lopsided the flow is. At $\\mu = 0.35$ — about 150 knots for a typical rotor — the advancing tip meets 1.35 times the hover tip speed and the retreating tip only 0.65 times. Dynamic pressure goes with the square of speed, so at three-quarters radius the advancing section feels about 7.6 times the dynamic pressure of the retreating one.

| Forward speed | $\\mu$ | Advancing tip | Its Mach number | Retreating tip |
|---|---|---|---|---|
| hover | 0 | 220 m/s | 0.65 | 220 m/s |
| 100 kt | 0.23 | 271 m/s | 0.80 | 169 m/s |
| 150 kt | 0.35 | 297 m/s | 0.87 | 143 m/s |
| 200 kt | 0.47 | 323 m/s | 0.95 | 117 m/s |

*Tip speed 220 m/s, sea level at 15 °C.*

### Dissymmetry of lift, and its cure
If every blade kept the same pitch all the way round, the advancing side would lift far more than the retreating side and the helicopter would roll over — which is what Juan de la Cierva's first autogiros did. His cure was the **flapping hinge**: the advancing blade, lifting more, rises, which reduces its angle of attack; the retreating blade sinks, which increases it, until the lift moments balance. The disc then tilts back ("blowback") and the pilot holds it with forward cyclic. Hingeless rotors get the same balance from cyclic pitch — less pitch on the advancing side, more on the retreating side — and from flexing. Either way the advancing blade flies fast at a small angle of attack and the retreating blade slow at a large one, and the disc makes most of its lift at the front and the back.

### The reverse-flow region
Where $\\Omega r < V$ on the retreating side, the air meets the blade from its **trailing edge**. This reverse-flow region is a circle of diameter $\\mu R$ touching the hub on the retreating side — 35 % of the radius at $\\mu = 0.35$. It makes no useful lift, and the blade sections that border it work very hard.

### Retreating-blade stall
As speed rises, the retreating blade needs ever more pitch, and its outer part reaches the [[stall]] first. Rapid pitching delays the stall a little (dynamic stall), but not for long. The signs are a growing vibration and then, because of the 90° lag between a blade's lift and its flapping, a **nose pitch-up and roll toward the retreating side**. Everything that raises the angle of attack brings it on sooner: high weight, high [[density-altitude|density altitude]], turbulence, steep turns and pull-ups (a higher [[load-factor|load factor]]), and low rotor speed.

### The advancing tip
On the other side, the advancing tip approaches [[mach-number|Mach]] 0.9: shock waves form on the blade (see [[transonic-flow]]), drag and power jump, the noise becomes a harsh slap, and the blades twist. Thin, swept tips help. Slowing the rotor would relieve the tip but raise $\\mu$ and make the retreating side worse — a squeeze from both sides that holds conventional helicopters to about 150–170 knots in cruise, with never-exceed speeds not much higher.

### Going faster
Compound helicopters add wings to unload the rotor and propellers for thrust, and slow the rotor down. Coaxial rigid rotors let each rotor lift mainly with its advancing side, the two balancing each other (the "advancing blade concept"). Tiltrotors escape by turning their rotors into propellers.

> [!warn] Never-exceed speeds, and how they fall with weight, altitude and temperature, are set out in each helicopter's approved flight manual. Real operations follow those limits, training and the rules of the air.
`,
  ideas: [
    'In forward flight a section meets air at Ωr + V sin ψ: fast on the advancing side, slow on the retreating side.',
    'The advance ratio μ = V/ΩR measures the asymmetry; conventional helicopters reach about 0.35–0.4.',
    'Flapping (or cyclic pitch) balances the lift: the retreating blade works at a high angle of attack, the advancing one at a low one.',
    'The retreating blade stalls first at high speed, weight and altitude — vibration, nose pitch-up and roll toward the retreating side.',
    'The advancing tip nearing Mach 0.9 is the other limit; together they cap a conventional rotor near 150–170 kt.'
  ],
  pitfalls: [
    'The advancing side of the rotor makes most of the lift in fast flight — The lift moments of the two sides must balance or the helicopter would roll; the advancing blade works at a small angle, and the disc lifts mostly at the front and back.',
    'Retreating-blade stall happens at a fixed airspeed — It depends on weight, density altitude, load factor, rotor speed and turbulence; the flight manual\'s never-exceed speed falls with altitude for this reason.',
    'Turning the rotor faster cures retreating-blade stall — It helps the retreating side but pushes the advancing tip toward the speed of sound; both limits close in together.'
  ],
  formulas: [
    {
      name: 'Advance ratio',
      expr: 'mu = V/(Omega*R)', tex: '\\mu = \\dfrac{V}{\\Omega R}',
      vars: {
        mu: { name: 'advance ratio', min: 0, max: 0.6, tex: '\\mu' },
        V: { name: 'forward speed', q: 'speed', unit: 'kt', value: 150 },
        Omega: { name: 'rotor speed', q: 'angvel', unit: 'rpm', value: 290, tex: '\\Omega' },
        R: { name: 'rotor radius', q: 'length', unit: 'm', value: 7.3 }
      },
      note: 'Strictly V cos α_d/ΩR, with α_d the small tilt of the disc. The reverse-flow circle has a diameter of μR.',
      practice: { unknowns: ['mu', 'V'] },
      stories: {
        mu: 'A rotor of radius {R} turning at {Omega} flies at {V}. What is its advance ratio?',
        V: 'A rotor of radius {R} turns at {Omega}. At what speed does its advance ratio reach {mu}?'
      }
    },
    {
      name: 'Mach number of the advancing tip',
      expr: 'M = (Omega*R + V)/a', tex: 'M_{adv} = \\dfrac{\\Omega R + V}{a}',
      vars: {
        M: { name: 'advancing-tip Mach number', min: 0.4, max: 0.98, tex: 'M_{adv}' },
        Omega: { name: 'rotor speed', q: 'angvel', unit: 'rpm', value: 290, tex: '\\Omega' },
        R: { name: 'rotor radius', q: 'length', unit: 'm', value: 7.3 },
        V: { name: 'forward speed', q: 'speed', unit: 'kt', value: 150 },
        a: { name: 'speed of sound', q: 'speed', unit: 'm/s', value: 340.3, min: 280, max: 360 }
      },
      note: 'The speed of sound falls with temperature (about 328 m/s at −5 °C), so the tip limit arrives sooner on cold days and high up.',
      practice: { unknowns: ['M', 'V'] },
      stories: {
        M: 'A rotor of radius {R} turns at {Omega}. At {V}, with the speed of sound {a}, what is the Mach number of the advancing tip?',
        V: 'A rotor of radius {R} turns at {Omega}. At what forward speed does the advancing tip reach Mach {M}, with the speed of sound {a}?'
      }
    },
    {
      name: 'Dynamic pressure, advancing against retreating',
      expr: 'rq = ((x + mu)/(x - mu))^2', tex: 'r_q = \\left(\\dfrac{x + \\mu}{x - \\mu}\\right)^2',
      vars: {
        rq: { name: 'dynamic pressure at ψ = 90° ÷ that at ψ = 270°, same radius', tex: 'r_q' },
        x: { name: 'radius as a fraction of the tip radius, r/R', value: 0.75, min: 0.5, max: 1 },
        mu: { name: 'advance ratio', value: 0.35, min: 0, max: 0.45, tex: '\\mu' }
      },
      note: 'For sections outside the reverse-flow region (x > μ). It shows how hard the retreating side must work to carry its share of the lift.',
      stories: { rq: 'At an advance ratio of {mu}, how many times more dynamic pressure does a blade section at {x} of the radius feel on the advancing side than on the retreating side?' }
    }
  ],
  examples: [
    {
      title: 'A medium helicopter at 150 knots',
      q: 'A rotor of radius 7.3 m turns at 290 rpm. At 150 kt at sea level (speed of sound 340.3 m/s), find the advance ratio, the speeds and Mach number of the tips, and the size of the reverse-flow region.',
      steps: [
        '$\\Omega = 290 \\times 2\\pi/60 = 30.37$ rad/s; $\\Omega R = 221.7$ m/s. 150 kt $= 77.2$ m/s.',
        '$\\mu = 77.2/221.7 = 0.348$.',
        'Advancing tip $221.7 + 77.2 = 298.9$ m/s, Mach 0.88; retreating tip $221.7 - 77.2 = 144.5$ m/s.',
        'Reverse-flow circle: diameter $\\mu R = 2.54$ m, on the retreating side next to the hub.'
      ],
      a: 'μ ≈ 0.35; advancing tip at Mach 0.88, retreating tip at 145 m/s; a reverse-flow circle 2.5 m across.'
    },
    {
      title: 'Why the retreating blade stalls first',
      q: 'At μ = 0.35, compare the dynamic pressure on a blade section at 75 % radius on the advancing and retreating sides. If the retreating section must carry even half the lift of its advancing twin, what lift coefficient does it need when the advancing one works at 0.3?',
      steps: [
        'Advancing: $u_T \\propto 0.75 + 0.35 = 1.10$; retreating: $0.75 - 0.35 = 0.40$.',
        'Dynamic pressure ratio: $(1.10/0.40)^2 = 7.6$.',
        'Half the lift at 1/7.6 of the dynamic pressure needs $0.3 \\times 7.6/2 = 1.13$ — close to the maximum lift coefficient of a rotor airfoil.'
      ],
      a: 'The retreating section feels 7.6 times less dynamic pressure and must work near its stall.'
    }
  ],
  quiz: [
    { q: 'At an advance ratio of 0.3, where is the reverse-flow region?', choices: ['A circle on the advancing side', 'A circle on the retreating side, of diameter 0.3R, touching the hub', 'A ring at the blade tips', 'There is none below μ = 1'], a: 1,
      why: 'Reverse flow needs Ωr < V|sin ψ|, which happens only on the retreating side and inside a circle of diameter μR.' },
    { q: 'Retreating-blade stall makes a helicopter with an anticlockwise rotor pitch nose-up and roll toward the retreating side.', a: true,
      why: 'Lift is lost on the retreating side; because flapping lags by 90°, the disc drops at the back, pitching the nose up, and the helicopter rolls toward the side that lost lift.' },
    { q: 'Which combination makes retreating-blade stall most likely?', choices: ['Light, low and slow', 'Heavy, high density altitude, turning steeply', 'Light, high rotor speed, smooth air', 'Hovering in ground effect'], a: 1,
      why: 'Weight, thin air and load factor all demand more lift coefficient from the retreating blade, which is already near the stall.' },
    { q: 'A rotor with a tip speed of 210 m/s flies at 60 m/s. What is its advance ratio?', answer: 0.286, tol: 0.02,
      why: 'μ = V/ΩR = 60/210 = 0.286.' },
    { q: 'Why not simply turn the rotor faster to help the retreating blade?', choices: ['The engine could not provide the power', 'The advancing tip would approach the speed of sound', 'The blades would flap less', 'The tail rotor would stall'], a: 1,
      why: 'Tip speed plus flight speed is already near Mach 0.9 on the advancing side; faster turning brings shocks, drag, noise and vibration.' }
  ],
  problems: [
    { q: 'A rotor has a tip speed of 215 m/s. On a day when the speed of sound is 336 m/s, at what forward speed does the advancing tip reach Mach 0.92? Give it in knots.', answer: 183, unit: 'kt', tol: 0.02,
      steps: ['Tip limit: $0.92 \\times 336 = 309.1$ m/s.', '$V = 309.1 - 215 = 94.1$ m/s $= 183$ kt.'] }
  ],
  applications: ['Setting never-exceed speeds and their reduction with altitude, weight and temperature.', 'Blade design: swept, thin tips for the advancing side; high-lift sections inboard for the retreating side.', 'High-speed rotorcraft: compounds, coaxial rigid rotors and tiltrotors.', 'Wind-turbine and propeller blades in yawed or inclined flow meet the same once-per-revolution variation.'],
  history: 'Juan de la Cierva\'s first autogiros rolled over on their take-off runs because the advancing side lifted more than the retreating side; hinging the blades so that they could flap, in 1922–23, made the lift balance itself. The speed limit that remained has been pushed with better blades and new layouts: a Westland Lynx with swept, paddle-shaped tips set a speed record for helicopters of 400.87 km/h (216 kt) in 1986, and Sikorsky\'s coaxial X2 demonstrator flew at 250 knots in 2010.',
  sim: 'rot-disc'
},

/* ================================================================ WIND ENERGY */
{
  id: 'wind-turbines', parent: 'wind-energy', title: 'Wind turbines', level: 1,
  short: 'A wind turbine is a propeller run backwards: it slows the wind and turns part of its kinetic energy into shaft power, P = ½ρAV³C_P. The cube of the wind speed rules everything — where turbines stand, how tall their towers are and how they are controlled.',
  keywords: ['wind turbine', 'wind power', 'power coefficient', 'cube law', 'swept area', 'power curve', 'cut-in speed', 'rated wind speed', 'cut-out speed', 'capacity factor', 'pitch control', 'variable speed', 'yaw drive', 'nacelle', 'horizontal-axis', 'vertical-axis', 'Darrieus', 'Savonius', 'offshore wind', 'hub height'],
  prereq: ['momentum-theory', 'lift-equation', 'physics:power', 'physics:kinetic-energy'],
  related: ['betz-limit', 'tip-speed-ratio', 'wind-gradient', 'propellers', 'wind-loads', 'autorotation', 'seeds-gliders', 'atmospheric-turbulence'],
  body: `
Air moving at speed $V$ through a disc of area $A$ carries mass at the rate $\\rho A V$, and each kilogram carries kinetic energy $\\tfrac12 V^2$. So the wind brings power $\\tfrac12\\rho A V^3$ through the rotor's swept area. A turbine can take only part of it — the **power coefficient** $C_P$:

$$P = \\tfrac12\\,\\rho A V^3 C_P$$

No turbine can exceed $C_P = 16/27 \\approx 0.59$ (the [[betz-limit]]); the best modern rotors reach 0.45–0.50 at the rotor.

### The cube law
Power grows with the **cube** of the wind speed. Double the wind and the power grows eightfold; a site averaging 7 m/s yields about 60 % more energy than one averaging 6 m/s. Three consequences shape the whole industry:

- **Height pays.** The wind grows with height above the ground (see [[wind-gradient]]). With the common "one-seventh power" rule, 5 m/s at 10 m becomes 6.9 m/s at 100 m, and the power available 2.6 times as much — hence hub heights of 100–150 m.
- **Size pays.** Power grows with the swept area, the square of the diameter: rotors grew from 15 m across in the early 1980s to more than 230 m for offshore machines in the 2020s.
- **Gusty wind carries more energy than its average suggests.** The energy depends on the average of $V^3$, not the cube of the average $V$. For the typical spread of wind speeds (a Rayleigh distribution) the average of $V^3$ is 1.9 times the cube of the average.

Density matters too, in proportion: cold winter air is about 10 % denser than summer air, and a site at 1500 m has 14 % less.

### Anatomy of a modern turbine
Three long, slender blades face the wind upwind of the tower. They are wings: each section meets the relative wind made of the wind and its own motion, and its lift, tilted forward, drives the rotor (see [[tip-speed-ratio]]). The blades twist from root to tip because that relative wind flattens toward the tip. A **pitch** bearing at each root turns the blade about its long axis; a **yaw** drive keeps the rotor facing the wind; a gearbox and generator, or a large direct-drive generator, sit in the nacelle; power electronics let the rotor run at variable speed. Three blades are the usual compromise between efficiency, cost, smooth running and appearance. Vertical-axis machines — the lift-driven Darrieus "eggbeater" and the drag-driven Savonius — accept wind from any direction but convert less of it.

### The power curve
A generic 5 MW turbine with a 126 m rotor:

| Wind at hub (m/s) | 3 | 4 | 6 | 8 | 10 | 11.3 | 15 | 25 |
|---|---|---|---|---|---|---|---|---|
| Power (MW) | 0.04 | 0.22 | 0.79 | 1.9 | 3.7 | 5.0 | 5.0 | 5.0 |

- **Cut-in**, about 3 m/s: enough wind to make useful power.
- Between cut-in and rated, the controller varies the rotor speed to hold the best tip-speed ratio, and the power follows the cube law.
- **Rated**, about 11–13 m/s: the generator's full power. Above it the blades pitch toward feather to shed the surplus and hold the power constant.
- **Cut-out**, about 25 m/s: the blades are feathered and the rotor stopped to protect the structure.

### Capacity factor
Because the wind varies, a turbine averages only part of its rating: the **capacity factor**, roughly 25–40 % onshore and 40–55 % offshore. A 5 MW turbine at 35 % produces about 15 300 MWh a year — the electricity used by some 3800 households using 4000 kWh each.

> [!warn] Turbines are serviced by trained technicians only, with the rotor locked and the brake and pitch systems made safe: a turning rotor stores a great deal of energy. In icing weather, blades can shed ice, and the area around a turbine is kept clear.
`,
  ideas: [
    'The wind carries power ½ρAV³ through the swept area; a turbine extracts the fraction C_P, at most 16/27.',
    'Power grows with the cube of the wind speed: double the wind, eight times the power.',
    'Tall towers and big rotors pay because the wind grows with height and power grows with swept area.',
    'The power curve: cut-in near 3 m/s, cube-law rise, rated power near 11–13 m/s held by pitching, cut-out near 25 m/s.',
    'Capacity factor — average output over rated — is about 25–40 % onshore and 40–55 % offshore.'
  ],
  pitfalls: [
    'A turbine with a capacity factor of 35 % is broken or idle 65 % of the time — It turns most of the time, but usually below its rated power; 35 % is its average output divided by its rating.',
    'Twice the wind speed gives twice the power — The power in the wind grows with the cube of the speed: eight times, until the turbine reaches its rated power.',
    'The energy at a site follows from its average wind speed cubed — It follows from the average of the cube, which is larger; two sites with the same average can differ a lot.'
  ],
  formulas: [
    {
      name: 'Power from the wind',
      expr: 'P = Cp*rho*pi*D^2*V^3/8', tex: 'P = \\tfrac12\\,\\rho\\,\\dfrac{\\pi D^2}{4}\\,V^3\\,C_P',
      vars: {
        P: { name: 'rotor power', q: 'power', unit: 'MW' },
        Cp: { name: 'power coefficient', value: 0.45, min: 0, max: 0.593, tex: 'C_P' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, min: 0.5, max: 1.4, tex: '\\rho' },
        D: { name: 'rotor diameter', q: 'length', unit: 'm', value: 126 },
        V: { name: 'wind speed at the hub', q: 'speed', unit: 'm/s', value: 11.4 }
      },
      note: 'Below rated power. C_P cannot exceed 16/27 ≈ 0.593 (the Betz limit); good rotors reach 0.45–0.50. Electrical power is a few per cent lower after the gearbox and generator.',
      practice: { unknowns: ['P', 'D', 'V', 'Cp'] },
      stories: {
        P: 'A turbine with a {D} rotor works at $C_P$ = {Cp} in a {V} wind (air density {rho}). What power does it produce?',
        D: 'A turbine must make {P} in a {V} wind with $C_P$ = {Cp} (air density {rho}). What rotor diameter does it need?',
        V: 'A {D} rotor with $C_P$ = {Cp} makes {P} in air of density {rho}. What is the wind speed?'
      }
    },
    {
      name: 'Energy in a year from the capacity factor',
      expr: 'E = CF*Pr*t', tex: 'E = \\mathrm{CF}\\; P_r\\, t',
      vars: {
        E: { name: 'energy produced', q: false, unit: 'MWh' },
        CF: { name: 'capacity factor', q: 'ratio', unit: '%', value: 35, min: 1, max: 100, tex: '\\mathrm{CF}' },
        Pr: { name: 'rated power', q: false, unit: 'MW', value: 5, tex: 'P_r' },
        t: { name: 'hours in an average year', q: false, unit: 'h', value: 8766, fixed: true }
      },
      note: 'Capacity factors vary with the site, the turbine and the year. For another period, change the number of hours.',
      practice: { unknowns: ['E', 'CF', 'Pr'] },
      stories: {
        E: 'A {Pr} turbine runs at a capacity factor of {CF} for a year. How much energy does it produce?',
        CF: 'A {Pr} turbine produced {E} in a year. What was its capacity factor?',
        Pr: 'A wind farm must produce {E} a year at a capacity factor of {CF}. What rated power does it need?'
      }
    },
    {
      name: 'Wind speed at height (power law)',
      expr: 'V2 = V1*(h2/h1)^alpha', tex: 'V_2 = V_1 \\left(\\dfrac{h_2}{h_1}\\right)^{\\alpha}',
      vars: {
        V2: { name: 'wind speed at the hub height', q: 'speed', unit: 'm/s', tex: 'V_2' },
        V1: { name: 'wind speed measured at h₁', q: 'speed', unit: 'm/s', value: 5, tex: 'V_1' },
        h1: { name: 'measuring height', q: 'length', unit: 'm', value: 10, min: 2, max: 60, tex: 'h_1' },
        h2: { name: 'hub height', q: 'length', unit: 'm', value: 100, min: 20, max: 300, tex: 'h_2' },
        alpha: { name: 'shear exponent (≈ 0.14 over open land, 0.1 over the sea)', value: 0.14, min: 0.05, max: 0.5, tex: '\\alpha' }
      },
      note: 'An empirical rule for the average wind; the exponent is larger over rough ground and in stable night-time air.',
      practice: { unknowns: ['V2', 'alpha', 'h2'] },
      stories: {
        V2: 'The wind measured at {h1} averages {V1}. With a shear exponent of {alpha}, what does it average at a hub height of {h2}?',
        alpha: 'The wind averages {V1} at {h1} and {V2} at {h2}. What shear exponent fits?'
      }
    }
  ],
  examples: [
    {
      title: 'A 5 MW turbine at rated wind and below',
      q: 'A turbine has a 126 m rotor. What power is in the wind through its disc at 11.4 m/s at sea level, and what does it make with $C_P = 0.45$? What does it make at 7 m/s with $C_P = 0.48$?',
      steps: [
        'Swept area $A = \\pi \\times 126^2/4 = 12\\,470$ m².',
        'At 11.4 m/s: $\\tfrac12 \\times 1.225 \\times 12\\,470 \\times 11.4^3 = 11.3$ MW in the wind; $\\times\\,0.45 = 5.1$ MW.',
        'At 7 m/s: $\\tfrac12 \\times 1.225 \\times 12\\,470 \\times 343 = 2.62$ MW; $\\times\\,0.48 = 1.26$ MW.'
      ],
      a: 'About 5.1 MW at 11.4 m/s but only 1.26 MW at 7 m/s: 61 % of the wind speed gives a quarter of the power.'
    },
    {
      title: 'What a taller tower is worth',
      q: 'The wind at 10 m averages 5 m/s. With a shear exponent of 0.14, what does it average at 100 m, and how much more power does that wind carry?',
      steps: [
        '$V_{100} = 5 \\times (100/10)^{0.14} = 5 \\times 1.380 = 6.9$ m/s.',
        'Power ratio $1.380^3 = 2.63$.'
      ],
      a: '6.9 m/s — and 2.6 times the power per square metre of rotor.'
    },
    {
      title: 'A year of output',
      q: 'A 5 MW turbine runs at a capacity factor of 35 %. How much energy does it produce in a year?',
      steps: ['$E = 0.35 \\times 5\\ \\mathrm{MW} \\times 8766\\ \\mathrm{h} = 15\\,340$ MWh.', 'At 4000 kWh per household that supplies about 3800 homes.'],
      a: 'About 15 300 MWh a year.'
    }
  ],
  quiz: [
    { q: 'Below rated power, the wind speed doubles. The turbine\'s power becomes about…', choices: ['2 times as much', '4 times as much', '8 times as much', '16 times as much'], a: 2,
      why: 'P ∝ V³ at a constant power coefficient: 2³ = 8.' },
    { q: 'A turbine\'s capacity factor of 35 % means it is out of service 65 % of the time.', a: false,
      why: 'It is its average output divided by its rated power. Most of the time it turns in winds below rated speed, producing part of its rating.' },
    { q: 'Why are the blades pitched above the rated wind speed?', choices: ['To catch more wind', 'To shed the surplus power and keep the generator and structure within their ratings', 'To stop the rotor turning', 'To reduce noise at night'], a: 1,
      why: 'Above rated wind the turbine could take more than its generator can handle; pitching lowers C_P to hold the power at its rating.' },
    { q: 'How much power (in MW) does a 10 m/s wind carry through a 100 m rotor disc at sea level?', answer: 4.81, unit: 'MW', tol: 0.02,
      why: '½ × 1.225 × (π × 50²) × 10³ = 0.6125 × 7854 × 1000 = 4.81 MW. A turbine could take at most 59 % of it.' },
    { q: 'Two sites have the same average wind speed. One wind is steady, the other gusty and variable. Which carries more energy?', choices: ['The steady one', 'The gusty one', 'Both the same', 'It depends only on the direction'], a: 1,
      why: 'Energy depends on the average of V³, which is larger when the speed varies: strong gusts contribute far more than lulls take away.' }
  ],
  problems: [
    { q: 'A turbine with a 90 m rotor works at C_P = 0.44 in a 9 m/s wind at sea level. What power does it make?', answer: 1.25, unit: 'MW', tol: 0.02,
      steps: ['$A = \\pi \\times 45^2 = 6362$ m².', '$P = \\tfrac12 \\times 1.225 \\times 6362 \\times 9^3 \\times 0.44 = 1.25$ MW.'] },
    { q: 'A 3 MW turbine produced 7900 MWh in a year (8766 h). What was its capacity factor?', answer: 30.0, unit: '%', tol: 0.02,
      steps: ['$\\mathrm{CF} = 7900/(3 \\times 8766) = 0.300$.', 'About 30 %.'] }
  ],
  applications: ['Choosing sites from wind measurements: the cube law makes a few tenths of a metre per second of average wind decisive.', 'Wind farm design, spacing turbines so that each is not too deep in the wake of another.', 'Grid planning with capacity factors and forecasts.', 'Small turbines for boats and remote sites, and the same physics in tidal-stream turbines, where water is 800 times denser than air.'],
  history: 'Charles Brush lit his Cleveland mansion with a 12 kW wind dynamo in 1888, and Poul la Cour tested turbines scientifically in Denmark from 1891. The 1.25 MW Smith–Putnam machine ran in Vermont from 1941 until a blade failed in 1945. Johannes Juul\'s Gedser turbine of 1956–57 — three blades, upwind, stall-regulated — set the "Danish concept" that, scaled up and given pitch control and variable speed, became the modern turbine; rotors passed 200 m across in the early 2020s.',
  sim: 'rot-turbine'
},

{
  id: 'betz-limit', parent: 'wind-energy', title: 'The Betz limit', level: 2,
  short: 'No wind turbine can extract more than 16/27 — about 59 % — of the kinetic energy flowing through its disc. Stop the air completely and nothing flows through; leave it untouched and nothing is taken. The best compromise slows the wind by a third at the rotor and by two-thirds far behind.',
  keywords: ['Betz limit', 'Lanchester–Betz–Joukowsky limit', '16/27', '59 percent', 'actuator disc', 'axial induction factor', 'slow-down factor', 'power coefficient', 'thrust coefficient', 'stream tube', 'wake', 'momentum theory', 'ducted turbine', 'Glauert'],
  prereq: ['wind-turbines', 'momentum-theory', 'continuity', 'bernoulli'],
  related: ['tip-speed-ratio', 'hover-power', 'propulsive-efficiency', 'physics:conservation-of-momentum', 'physics:bernoullis-equation', 'math:derivative', 'math:optimization'],
  body: `
A turbine takes energy from the wind by slowing it down. But it cannot stop the wind: air brought to rest behind the rotor would block the air behind it, and the wind would simply flow around. Nor can it leave the wind untouched: then it takes nothing. Somewhere between lies a best slowing — and a limit that holds for every turbine, whatever its blades.

### The actuator disc
Replace the rotor by a thin disc that takes energy from the air passing through it (see [[momentum-theory]]). The air in the **stream tube** that passes through the disc slows gradually, so by [[continuity|conservation of mass]] the tube widens. Write the speed at the disc as $V(1-a)$, where $a$ is the **slow-down factor** (axial induction factor). Momentum and energy together show that the air slows by as much again after the disc: far behind, the wake moves at $V(1 - 2a)$. The speed is continuous through the disc, but the pressure is not: it rises ahead of the disc as the air slows ([[bernoulli|Bernoulli]]), drops sharply across it — that jump, times the area, is the thrust — and recovers downstream.

The power taken out, and the thrust on the rotor, are

$$P = 2\\rho A V^3 a(1-a)^2, \\qquad C_P = \\frac{P}{\\tfrac12\\rho A V^3} = 4a(1-a)^2, \\qquad C_T = 4a(1-a)$$

Setting $dC_P/da = 4(1-a)(1-3a) = 0$ gives $a = 1/3$ and

$$C_{P,\\max} = \\frac{16}{27} = 0.593$$

| Slow-down factor $a$ | 0.1 | 0.2 | 1/3 | 0.4 | 0.5 |
|---|---|---|---|---|---|
| Power coefficient $C_P$ | 0.324 | 0.512 | 0.593 | 0.576 | 0.500 |
| Thrust coefficient $C_T$ | 0.36 | 0.64 | 0.889 | 0.96 | 1.00 |
| Wake speed $/V$ | 0.8 | 0.6 | 0.33 | 0.2 | 0 |

At the optimum the wind is slowed to two-thirds of its speed at the rotor and one-third far behind, and the stream tube arriving from upstream is only two-thirds the area of the rotor. Near the top the curve is flat: slowing the wind by a quarter or by two-fifths costs only a few per cent of power. Beyond $a \\approx 0.4$ the simple theory fails: the slow wake becomes turbulent and mixes with the outer flow, and real rotors follow measured curves instead.

### What stops real rotors reaching it
Real rotors reach $C_P$ of about 0.45–0.50, 75–85 % of the limit. Three losses account for the gap: the **swirl** left in the wake by the rotor's torque (Glauert's analysis: the limit falls to about 0.42 at a tip-speed ratio of 1 and approaches 16/27 only at high [[tip-speed-ratio|tip-speed ratios]]), the loss at the **tips** of a finite number of blades, and the **drag** of the blade sections.

### The thrust that comes with it
At the Betz optimum $C_T = 8/9$. A 126 m rotor in a 10 m/s wind is pushed downwind by about 680 kN — the load the tower and foundation must carry, and a reason turbines pitch their blades in storms.

### Can it be beaten?
- **Ducts.** A diffuser around the rotor can draw more air through it, and measured against the rotor's own area $C_P$ can exceed 16/27; measured against the area of the duct exit — the size of what has to be built — ducted turbines have not clearly beaten open rotors.
- **Confined channels.** A turbine that fills most of a narrow tidal channel works against the blockage and can exceed the limit for its area, because the flow cannot go around it.
- **Kites and flying turbines** sweep an area much larger than their wings; the limit applies to the area swept.

> [!key] 16/27 follows from conservation of mass, momentum and energy alone. It holds for any number of blades, any shape and any fluid — tidal turbines included.
`,
  ideas: [
    'A turbine must slow the wind to take energy, but cannot stop it; the best slowing is by 1/3 at the rotor and 2/3 far behind.',
    'Momentum and energy give C_P = 4a(1 − a)², with a maximum of 16/27 ≈ 0.593 at a = 1/3.',
    'The stream tube widens as the air slows; the pressure jumps down across the disc, and that jump is the thrust.',
    'Real rotors reach about 0.45–0.50: wake swirl, tip losses and blade drag take the rest.',
    'At the optimum the thrust coefficient is 8/9 — a large load on the tower.'
  ],
  pitfalls: [
    'A better blade design could beat the Betz limit — The limit comes from mass, momentum and energy alone; no rotor of any shape in an open stream can exceed it for its swept area.',
    'The best turbine stops the wind completely — Stopped air would block the flow and the wind would go around; the best slowing leaves a third of the speed in the far wake.',
    'The wind slows suddenly at the rotor — It slows gradually, half the slowing before the disc and half after; it is the pressure that jumps at the disc, not the speed.'
  ],
  derivation: {
    title: 'Derive the Betz limit',
    steps: [
      { text: 'The wind $V$ slows to $V(1-a)$ at the disc and to $V_w$ far behind. The mass flow through the disc is', tex: '\\dot m = \\rho A V (1-a)' },
      { text: 'The thrust is the momentum the air loses each second:', tex: 'T = \\dot m\\,(V - V_w)' },
      { text: 'The power is the kinetic energy the air loses each second — and also the thrust times the speed at the disc:', tex: 'P = \\tfrac12\\, \\dot m\\,(V^2 - V_w^2) = T\\, V(1-a)' },
      { text: 'Equating the two, the speed at the disc is the average of the upstream and wake speeds, so $V_w = V(1-2a)$:', tex: '\\tfrac12\\,(V + V_w) = V(1-a)' },
      { text: 'Substituting, $T = \\rho A V(1-a)\\cdot 2aV$ and', tex: 'P = 2\\rho A V^3 a(1-a)^2' },
      { text: 'Divide by the power in the wind through the disc, $\\tfrac12\\rho A V^3$:', tex: 'C_P = 4a(1-a)^2' },
      { text: 'The maximum is where the derivative vanishes:', tex: '\\frac{dC_P}{da} = 4(1-a)(1-3a) = 0 \\;\\Rightarrow\\; a = \\tfrac13, \\quad C_{P,\\max} = \\tfrac{16}{27} \\approx 0.593' }
    ]
  },
  formulas: [
    {
      name: 'Power coefficient of an ideal rotor',
      expr: 'Cp = 4*a*(1 - a)^2', tex: 'C_P = 4a(1-a)^2',
      vars: {
        Cp: { name: 'power coefficient', tex: 'C_P' },
        a: { name: 'slow-down (axial induction) factor', value: 0.25, min: 0, max: 0.5 }
      },
      note: 'Momentum theory of the actuator disc, valid up to a ≈ 0.4. Maximum 16/27 at a = 1/3; most values of C_P below the maximum come from two different a.',
      stories: { Cp: 'An ideal rotor slows the wind by a fraction {a} at the disc. What power coefficient does it reach?' }
    },
    {
      name: 'Thrust coefficient of an ideal rotor',
      expr: 'CT = 4*a*(1 - a)', tex: 'C_T = 4a(1-a)',
      vars: {
        CT: { name: 'thrust coefficient', tex: 'C_T' },
        a: { name: 'slow-down (axial induction) factor', value: 0.25, min: 0, max: 0.5 }
      },
      note: 'C_T = T/(½ρAV²). At the Betz optimum (a = 1/3) it is 8/9.',
      stories: { CT: 'An ideal rotor slows the wind by a fraction {a} at the disc. What is its thrust coefficient?' }
    },
    {
      name: 'Thrust on a turbine rotor',
      expr: 'T = CT*rho*pi*D^2*V^2/8', tex: 'T = \\tfrac12\\,\\rho\\,\\dfrac{\\pi D^2}{4}\\,V^2\\,C_T',
      vars: {
        T: { name: 'rotor thrust', q: 'force', unit: 'kN' },
        CT: { name: 'thrust coefficient', value: 0.889, min: 0, max: 1.2, tex: 'C_T' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, min: 0.5, max: 1.4, tex: '\\rho' },
        D: { name: 'rotor diameter', q: 'length', unit: 'm', value: 126 },
        V: { name: 'wind speed', q: 'speed', unit: 'm/s', value: 10 }
      },
      note: 'The load that pushes the rotor downwind and bends the tower. Above rated wind, pitching the blades lowers C_T as well as C_P.',
      stories: { T: 'A {D} rotor works at a thrust coefficient of {CT} in a {V} wind (air density {rho}). What thrust does the wind put on it?' }
    }
  ],
  examples: [
    {
      title: 'Betz against a real rotor',
      q: 'A 126 m rotor faces a 10 m/s wind at sea level. How much power is in the wind through its disc, what is the most any rotor could take, and what does a rotor with $C_P = 0.47$ take?',
      steps: [
        '$A = 12\\,470$ m²; $\\tfrac12 \\times 1.225 \\times 12\\,470 \\times 10^3 = 7.64$ MW.',
        'Betz limit: $7.64 \\times 16/27 = 4.53$ MW.',
        'Real rotor: $7.64 \\times 0.47 = 3.59$ MW, 79 % of the limit.'
      ],
      a: '7.64 MW in the wind, 4.53 MW at most, about 3.6 MW in practice.'
    },
    {
      title: 'The thrust at the optimum',
      q: 'What thrust does the wind put on the same rotor if it works at the Betz optimum?',
      steps: ['$C_T = 4 \\times \\tfrac13 \\times \\tfrac23 = 8/9$.', '$T = \\tfrac89 \\times \\tfrac12 \\times 1.225 \\times 12\\,470 \\times 10^2 = 679$ kN.'],
      a: 'About 680 kN — the weight of some 69 tonnes, pushing sideways at the top of the tower.'
    }
  ],
  quiz: [
    { q: 'At the Betz optimum, how fast is the wind far behind the turbine?', choices: ['2/3 of V', '1/3 of V', 'Zero', 'Half of V'], a: 1,
      why: 'a = 1/3, and the far wake moves at V(1 − 2a) = V/3. At the rotor itself the speed is 2V/3.' },
    { q: 'A turbine with enough blades could beat the Betz limit.', a: false,
      why: 'The limit follows from mass, momentum and energy for any disc that extracts energy in an open stream. More blades change how close a rotor gets to it, not the limit.' },
    { q: 'At the Betz optimum, the wind speed at the rotor itself is…', choices: ['V/3', '2V/3', 'V/2', '8V/9'], a: 1,
      why: 'V(1 − a) with a = 1/3. Half the slowing happens before the disc and half after.' },
    { q: 'Differentiate $C_P = 4a(1-a)^2$ with respect to $a$.', answer: '4*(1-a)*(1-3*a)', vars: ['a'],
      why: 'd/da[4a(1 − a)²] = 4(1 − a)² − 8a(1 − a) = 4(1 − a)(1 − 3a). It vanishes at a = 1/3 (the maximum) and a = 1.' },
    { q: 'What is the power coefficient of an ideal rotor that slows the wind by 20 % at the disc (a = 0.2)?', answer: 0.512, tol: 0.02,
      why: '4 × 0.2 × 0.8² = 0.512 — 86 % of the Betz maximum, from slowing the wind rather less than the optimum.' }
  ],
  problems: [
    { q: 'A rotor of 50 m diameter faces an 8 m/s wind at sea level. What is the most power any turbine of this size could take from it?', answer: 365, unit: 'kW', tol: 0.02,
      steps: ['$A = \\pi \\times 25^2 = 1963$ m².', 'Wind power $\\tfrac12 \\times 1.225 \\times 1963 \\times 512 = 615.7$ kW.', '$\\times\\,16/27 = 365$ kW.'] }
  ],
  applications: ['Judging turbine designs: C_P as a fraction of 16/27.', 'Tidal-stream turbines, where the same limit applies to water.', 'Rotor loads: the thrust coefficient that comes with high power sets tower and foundation design.', 'Wake models of wind farms, which start from the slowed stream tube behind each rotor.'],
  history: 'Frederick Lanchester reached the result in 1915 in a study of ship propellers; Albert Betz published it for wind turbines in 1920, and Nikolai Joukowsky found it independently the same year, so it is fairly called the Lanchester–Betz–Joukowsky limit. Hermann Glauert extended the theory in 1935 to include the swirl of the wake, which lowers the limit for slow-running rotors.',
  sim: 'rot-betz'
},

{
  id: 'tip-speed-ratio', parent: 'wind-energy', title: 'Tip-speed ratio', level: 2,
  short: 'The tip-speed ratio λ = ΩR/V compares how fast the blade tips move with the speed of the wind. Each rotor has a best value — about 7 to 9 for a modern three-bladed turbine, about 1 for an old farm windmill — and good control keeps it there.',
  keywords: ['tip-speed ratio', 'lambda', 'Cp-lambda curve', 'rotor speed', 'variable speed', 'solidity', 'blade count', 'torque', 'gearbox', 'direct drive', 'maximum power point tracking', 'optimal torque control', 'farm windmill', 'Savonius', 'Darrieus', 'inflow angle'],
  prereq: ['wind-turbines', 'betz-limit', 'physics:angular-kinematics'],
  related: ['helicopter-rotor', 'propeller-efficiency', 'seeds-gliders', 'lift-to-drag', 'physics:torque', 'autorotation'],
  body: `
A section of a turbine blade at radius $r$ moves at $\\Omega r$ across the wind, while the wind — slowed to about two-thirds of its speed at the rotor — comes at it head-on. The blade feels the sum, a relative wind arriving at a small **inflow angle** $\\varphi$ to the plane of rotation, with $\\tan\\varphi \\approx \\tfrac23 V/(\\Omega r)$. Its angle of attack is that inflow angle minus the blade's pitch, $\\alpha = \\varphi - \\beta$, and its lift, perpendicular to the relative wind, leans forward and drives the rotor. How steep that relative wind is depends on one number, the **tip-speed ratio**:

$$\\lambda = \\frac{\\Omega R}{V}$$

At $\\lambda = 8$ the relative wind meets the tip at under 5° to the rotor plane; a blade twisted and pitched for that angle works well only near that $\\lambda$.

### The $C_P$–λ curve
Plot the power coefficient against $\\lambda$ and every rotor shows a hill:

- at **low** $\\lambda$ the blades move slowly, the relative wind comes at a steep angle and they stall; much of the wind passes between them untouched, and the swirl left in the wake is large;
- at **high** $\\lambda$ the blades sweep the disc so fast that it behaves like a solid wall; they work at small or even negative angles of attack, their drag grows, and the air spills around;
- in between is the peak. For the generic 5 MW turbine of the simulation, $C_P$ reaches 0.48 near $\\lambda = 8$.

| Rotor | Blades | Best $\\lambda$ | Best $C_P$ (roughly) |
|---|---|---|---|
| Farm water-pumping windmill | 12–24 | about 1 | 0.15–0.3 |
| Savonius (drag-driven) | 2–3 cups | about 1 | 0.15–0.2 |
| Darrieus (vertical axis) | 2–3 | 4–6 | 0.35–0.4 |
| Modern three-bladed | 3 | 7–9 | 0.45–0.50 |
| Two-bladed | 2 | 9–11 | 0.43–0.47 |

Slow rotors lose more to swirl: including it, the ideal limit is about 0.42 at $\\lambda = 1$, 0.51 at $\\lambda = 2$, 0.57 at $\\lambda = 5$, and it reaches 16/27 only as $\\lambda$ grows large (Glauert).

### Solidity and blade count
A fast rotor needs little blade area to catch the wind — the blades sweep the whole disc many times a second — so high-$\\lambda$ rotors have low **solidity**: few, slender blades. A slow rotor needs many wide blades. Tip speed is limited by noise and by rain erosion of the leading edges to roughly 80–90 m/s on land, somewhat more offshore.

### Torque and speed
A big rotor therefore turns slowly: 126 m at 12 rpm. Its torque is $Q = P/\\Omega$ — at 5 MW and 12.1 rpm, about 3.9 MN·m. A gearbox of about 97 : 1 steps it up to a 1200 rpm generator; direct-drive turbines use a large, slow generator instead. The farm windmill's low speed and high torque suit a piston pump, and it starts in light winds.

### Keeping λ at its best
Below rated power, a variable-speed turbine turns faster as the wind rises, holding $\\Omega = \\lambda_{opt} V/R$. It does not even need to measure the wind: at the best $\\lambda$ the power is proportional to $\\Omega^3$, so if the generator is made to resist with a torque $Q = k\\Omega^2$, the rotor settles by itself at the speed where $\\lambda = \\lambda_{opt}$. Above rated power the speed is held and the blades pitch instead.
`,
  ideas: [
    'λ = ΩR/V compares blade-tip speed with wind speed; it sets the angle at which the relative wind meets the blades.',
    'Every rotor has a C_P–λ hill: blades stall at low λ and the disc blocks the flow at high λ.',
    'Fast rotors (λ 7–9) have few slender blades; slow rotors (λ ≈ 1) many wide ones, and lose more to wake swirl.',
    'Big rotors turn slowly with a huge torque, stepped up by a gearbox or taken by a slow direct-drive generator.',
    'Variable-speed turbines hold the best λ below rated power, often with the simple rule Q = kΩ².'
  ],
  pitfalls: [
    'A rotor with more blades catches more wind and makes more power — At its own best tip-speed ratio a three-bladed rotor beats a many-bladed one; extra blades suit slow, high-torque rotors like water pumps.',
    'A turbine should spin as fast as possible — Past the best λ the blades work at too small an angle and block the flow; C_P falls and can even turn negative, when the rotor would have to be driven.',
    'The blade tips move at the wind speed — On a modern turbine they move seven to nine times faster than the wind.'
  ],
  formulas: [
    {
      name: 'Tip-speed ratio',
      expr: 'lambda = Omega*R/V', tex: '\\lambda = \\dfrac{\\Omega R}{V}',
      vars: {
        lambda: { name: 'tip-speed ratio', tex: '\\lambda' },
        Omega: { name: 'rotor speed', q: 'angvel', unit: 'rpm', value: 12.1, tex: '\\Omega' },
        R: { name: 'blade tip radius', q: 'length', unit: 'm', value: 63 },
        V: { name: 'wind speed', q: 'speed', unit: 'm/s', value: 11.4 }
      },
      note: 'For a propeller the same quantity, inverted, is the advance ratio.',
      stories: {
        lambda: 'A rotor of radius {R} turns at {Omega} in a {V} wind. What is its tip-speed ratio?',
        Omega: 'A rotor of radius {R} should run at a tip-speed ratio of {lambda} in a {V} wind. How fast must it turn?'
      }
    },
    {
      name: 'Rotor torque',
      expr: 'Q = P/Omega', tex: 'Q = \\dfrac{P}{\\Omega}',
      vars: {
        Q: { name: 'rotor torque', q: 'torque', unit: 'kN·m' },
        P: { name: 'rotor power', q: 'power', unit: 'MW', value: 5 },
        Omega: { name: 'rotor speed', q: 'angvel', unit: 'rpm', value: 12.1, tex: '\\Omega' }
      },
      note: 'The torque on the main shaft; after a gearbox of ratio i the generator sees about Q/i at i times the speed.',
      stories: { Q: 'A rotor delivers {P} at {Omega}. What torque does its main shaft carry?' }
    },
    {
      name: 'Optimal-torque control law',
      expr: 'Q = 0.5*rho*pi*R^5*Cp*Omega^2/lambda^3', tex: 'Q = \\dfrac{\\rho\\,\\pi R^5 C_P}{2\\lambda^3}\\,\\Omega^2',
      vars: {
        Q: { name: 'generator torque (referred to the rotor)', q: 'torque', unit: 'kN·m' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, min: 0.5, max: 1.4, tex: '\\rho' },
        R: { name: 'blade tip radius', q: 'length', unit: 'm', value: 63 },
        Cp: { name: 'best power coefficient', value: 0.48, min: 0.01, max: 0.593, tex: 'C_P' },
        Omega: { name: 'rotor speed', q: 'angvel', unit: 'rpm', value: 9.82, tex: '\\Omega' },
        lambda: { name: 'best tip-speed ratio', value: 8.1, min: 1, max: 15, tex: '\\lambda' }
      },
      note: 'At the best λ, P = ½ρπR²V³C_P with V = ΩR/λ, so P ∝ Ω³ and Q = P/Ω ∝ Ω². A generator set to resist with this torque makes the rotor settle at the best λ in any wind below rated.',
      practice: { unknowns: ['Q', 'Omega'] },
      stories: { Q: 'A rotor of radius {R} has its best power coefficient {Cp} at λ = {lambda}. What generator torque should the controller set when the rotor turns at {Omega} (air density {rho})?' }
    }
  ],
  examples: [
    {
      title: 'The tip-speed ratio of a large turbine',
      q: 'A 126 m rotor turns at 12.1 rpm in an 11.4 m/s wind. What are its tip speed and tip-speed ratio? At what speed should it turn in an 8 m/s wind to hold its best λ of 8.1?',
      steps: [
        '$\\Omega = 12.1 \\times 2\\pi/60 = 1.267$ rad/s; tip speed $1.267 \\times 63 = 79.8$ m/s.',
        '$\\lambda = 79.8/11.4 = 7.0$.',
        'At 8 m/s: $\\Omega = 8.1 \\times 8/63 = 1.029$ rad/s $= 9.8$ rpm.'
      ],
      a: 'Tip speed 80 m/s, λ = 7.0; it should slow to 9.8 rpm in an 8 m/s wind.'
    },
    {
      title: 'Torque through the gearbox',
      q: 'The same turbine makes 5 MW at 12.1 rpm. What is the torque on its main shaft, and on a generator driven through a 97 : 1 gearbox (ignoring losses)?',
      steps: [
        '$Q = P/\\Omega = 5\\times 10^6/1.267 = 3.95$ MN·m.',
        'Generator: $12.1 \\times 97 = 1174$ rpm, torque $3.95\\times 10^6/97 = 40.7$ kN·m.'
      ],
      a: 'About 3.9 MN·m on the main shaft — and 41 kN·m at 1174 rpm on the generator.'
    }
  ],
  quiz: [
    { q: 'A turbine running at constant speed meets a stronger wind. Its tip-speed ratio…', choices: ['rises', 'falls', 'stays the same', 'first rises, then falls'], a: 1,
      why: 'λ = ΩR/V: V grows, Ω does not. Above rated wind this pushes the operating point to the left of the C_P peak — helping to limit power.' },
    { q: 'A farm windmill with many blades is designed to run at a high tip-speed ratio.', a: false,
      why: 'Its many wide blades (high solidity) catch the wind at a low λ, about 1, giving high torque for a pump.' },
    { q: 'A rotor of 40 m diameter turns at 30 rpm in a 7 m/s wind. What is its tip-speed ratio?', answer: 8.98, tol: 0.02,
      why: 'Ω = 30 × 2π/60 = 3.14 rad/s; ΩR = 3.14 × 20 = 62.8 m/s; λ = 62.8/7 = 8.98.' },
    { q: 'Why do large turbines turn so slowly?', choices: ['To protect the gearbox', 'Tip speed is limited by noise and blade erosion, and a big radius reaches it at low rpm', 'Slow rotors catch more wind', 'Because of air traffic rules'], a: 1,
      why: 'At a tip speed near 80–90 m/s, a 63 m blade turns at only about 12–13 rpm.' },
    { q: 'Under the optimal-torque law, if the wind (below rated) doubles, the generator torque becomes about…', choices: ['2 times as large', '4 times as large', '8 times as large', 'unchanged'], a: 1,
      why: 'The rotor speed doubles to hold λ, and Q = kΩ², so the torque quadruples — while the power grows eightfold.' }
  ],
  problems: [
    { q: 'A turbine with 55 m blades should run at λ = 8 in a 6 m/s wind. At what rotor speed, in rpm?', answer: 8.33, unit: 'rpm', tol: 0.02,
      steps: ['$\\Omega = \\lambda V/R = 8 \\times 6/55 = 0.873$ rad/s.', '$\\times\\,60/(2\\pi) = 8.33$ rpm.'] }
  ],
  applications: ['Variable-speed control of modern turbines (maximum power point tracking).', 'Choosing blade count and solidity for a rotor\'s purpose: electricity, pumping, or a small turbine that must start in light winds.', 'Gearbox and generator design from the rotor\'s torque and speed.', 'The same ratio describes autorotating rotors and maple seeds.'],
  history: 'The American farm windmill, spread by Daniel Halladay\'s self-governing design from the 1850s, ran at a tip-speed ratio of about one and pumped water on millions of farms. Fast-running, lift-driven rotors came with aeronautics: in the 1920s Albert Betz and others applied airfoil theory to windmills, and Ulrich Hütter\'s slender two-bladed turbines of the 1950s ran at tip-speed ratios of eight and more.',
  sim: { id: 'rot-turbine', params: { mode: 'manual' } }
},

{
  id: 'sails', parent: 'wind-energy', title: 'Sails as wings', level: 2,
  short: 'A sail is a soft wing stood on end. It works in the apparent wind — the true wind plus the headwind of the boat\'s own motion — and its lift, turned forward, drives the boat while the keel, a second wing in the water, stops it sliding sideways. A fast enough craft can sail faster than the wind.',
  keywords: ['sail', 'sailing', 'apparent wind', 'true wind', 'points of sail', 'close-hauled', 'beam reach', 'broad reach', 'running', 'no-go zone', 'tacking', 'VMG', 'velocity made good', 'keel', 'centreboard', 'leeway', 'heeling force', 'driving force', 'iceboat', 'faster than the wind', 'slot effect', 'wing sail'],
  prereq: ['lift-equation', 'lift-to-drag', 'math:vector-addition', 'physics:relative-velocity'],
  related: ['how-lift-works', 'induced-drag', 'aspect-ratio', 'stall', 'wind-gradient', 'wind-turbines', 'drag-polar'],
  body: `
### The apparent wind
A sail feels the wind as it is on board. That **apparent wind** is the true wind plus the headwind made by the boat's own motion — a vector sum ([[math:vector-addition|vector addition]]). With the course at an angle $\\beta$ from the direction the true wind comes from:

$$\\vec V_A = \\vec V_T - \\vec V_B, \\qquad V_A^2 = V_T^2 + V_B^2 + 2V_T V_B\\cos\\beta$$

Sailing toward the wind, the apparent wind is **stronger** than the true wind and comes from **further ahead**; sailing away from it, it is weaker. A keelboat doing 3 m/s at 45° to a 6 m/s true wind feels 8.4 m/s at only 30° off the bow.

### Lift, drag and the two forces that matter
The sail is a wing of high camber and low [[aspect-ratio|aspect ratio]]. Its lift is perpendicular to the apparent wind and its drag along it; what matters to the sailor is how their sum splits along the boat:

$$F_{drive} = L\\sin\\gamma - D\\cos\\gamma, \\qquad F_{side} = L\\cos\\gamma + D\\sin\\gamma$$

where $\\gamma$ is the apparent wind angle from the bow. Close to the wind the side force is two to three times the driving force. It is resisted by the **keel** or centreboard — a hydrofoil moving through the water at a small leeway angle of 3–6°, whose lift balances the sail's side force and whose [[induced-drag|induced drag]] the sail must pay for. The side force also heels the boat, and that sets a limit: past it the crew must ease the sail, flatten it or reef.

The sail stops driving when $\\gamma$ falls below the angle whose tangent is $D/L$ for the whole rig, hull and crew included. That is why no boat sails straight into the wind: typical boats sail no closer than 40–45° to the true wind (20–30° to the apparent), and reach a point upwind by tacking, trading angle against speed for the best **velocity made good** (VMG).

| Point of sail | Course from the true wind | What the sail does |
|---|---|---|
| In the no-go zone ("in irons") | less than about 40° | flaps: no drive |
| Close-hauled | about 40–45° | a wing at a small angle of attack, sheeted in hard |
| Beam reach | 90° | lift points mostly forward; often the fastest course |
| Broad reach | about 135° | eased out; lift and drag both help |
| Running | 180° | stalled — a drag device, like a parachute |

### Faster than the wind
On a reach, the faster the boat goes the stronger its apparent wind becomes, so if the craft's own drag is small it can go faster than the wind itself. Iceboats can reach three or four times the wind speed, foiling catamarans and kiteboards two to three times. At such speeds the apparent wind comes from almost dead ahead — 15–20° off the bow — and the whole craft's lift-to-drag ratio decides its speed, much as a glider's does. With sails alone, dead downwind, a boat can never pass the wind speed, since its apparent wind would vanish; but a cart driving a propeller from its wheels did so in 2010, at about 2.8 times the wind speed, by using the wind's speed relative to the ground.

### Two sails and the "slot"
The old explanation of a jib — that it speeds up the air in the slot and energises the mainsail — is backwards. The jib sits in the **upwash** ahead of the mainsail, so the wind reaching it is turned further aft — a "lift", in sailors' words — and it can carry more load; the mainsail sits in the jib's **downwash**, which lowers the suction peak at its leading edge and helps the flow stay attached. Together they beat either alone, but not through a jet in the slot.
`,
  ideas: [
    'The sail works in the apparent wind: the true wind plus the headwind of the boat\'s motion.',
    'Lift is perpendicular to the apparent wind; it splits into a driving force and a larger side (heeling) force close to the wind.',
    'The keel is a hydrofoil at a small leeway angle that balances the side force; heeling limits how much sail force the boat can use.',
    'No boat sails straight into the wind: drive vanishes when the apparent wind angle falls below the rig\'s drag angle; upwind means tacking for the best VMG.',
    'Craft with little drag of their own — iceboats, foilers — can sail several times faster than the wind on a reach.'
  ],
  pitfalls: [
    'The wind pushes a sail like a hand pushing a door — On most courses the sail is a wing: its lift, perpendicular to the apparent wind, drives the boat. Only on a run is it a drag device.',
    'A sailboat can never go faster than the wind — On a reach, a craft with little drag of its own can: its apparent wind grows as it speeds up. Only dead downwind under sail alone is the wind speed a limit.',
    'The jib speeds up the air in the slot, which helps the mainsail — The air in the slot is slowed near the mainsail; the jib gains from the mainsail\'s upwash, and the mainsail from the jib\'s downwash, which lowers its leading-edge suction peak.'
  ],
  formulas: [
    {
      name: 'Apparent wind speed',
      expr: 'VA = sqrt(VT^2 + VB^2 + 2*VT*VB*cos(beta))', tex: 'V_A = \\sqrt{V_T^2 + V_B^2 + 2V_T V_B\\cos\\beta}',
      vars: {
        VA: { name: 'apparent wind speed', q: 'speed', unit: 'kt', tex: 'V_A' },
        VT: { name: 'true wind speed', q: 'speed', unit: 'kt', value: 12, tex: 'V_T' },
        VB: { name: 'boat speed', q: 'speed', unit: 'kt', value: 6, tex: 'V_B' },
        beta: { name: 'course from the direction of the true wind (0° = head to wind)', q: 'angle', unit: '°', value: 45, min: 0, max: 180, tex: '\\beta' }
      },
      note: 'The law of cosines for the vector sum of the true wind and the headwind of the boat\'s motion (leeway ignored).',
      stories: {
        VA: 'A boat sails at {VB} on a course {beta} from a true wind of {VT}. How strong is the apparent wind?',
        VT: 'A boat doing {VB} on a course {beta} from the true wind feels an apparent wind of {VA}. How strong is the true wind?'
      }
    },
    {
      name: 'Apparent wind angle',
      expr: 'gA = atan2(VT*sin(beta), VT*cos(beta) + VB)', tex: '\\gamma = \\arctan\\dfrac{V_T\\sin\\beta}{V_T\\cos\\beta + V_B}',
      vars: {
        gA: { name: 'apparent wind angle from the bow', q: 'angle', unit: '°', min: 0, max: 180, tex: '\\gamma' },
        VT: { name: 'true wind speed', q: 'speed', unit: 'kt', value: 12, tex: 'V_T' },
        beta: { name: 'course from the direction of the true wind', q: 'angle', unit: '°', value: 45, min: 0, max: 180, tex: '\\beta' },
        VB: { name: 'boat speed', q: 'speed', unit: 'kt', value: 6, tex: 'V_B' }
      },
      note: 'Measured on the same side as β; when the denominator is negative the angle lies beyond 90° (the calculator takes the right quadrant).',
      practice: { unknowns: ['gA', 'VB'] },
      stories: {
        gA: 'A boat sails at {VB} on a course {beta} from a true wind of {VT}. At what angle from the bow does the apparent wind come?',
        VB: 'In a true wind of {VT}, on a course {beta} from the wind, the crew feel the apparent wind at {gA} from the bow. How fast is the boat going?'
      }
    },
    {
      name: 'Driving force of a sail',
      expr: 'Fd = 0.5*rho*VA^2*S*(CL*sin(gA) - CD*cos(gA))', tex: 'F_d = \\tfrac12\\,\\rho V_A^2 S\\,(C_L\\sin\\gamma - C_D\\cos\\gamma)',
      vars: {
        Fd: { name: 'driving force along the course', q: 'force', unit: 'N', signed: true, tex: 'F_d' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, min: 0.5, max: 1.4, tex: '\\rho' },
        VA: { name: 'apparent wind speed', q: 'speed', unit: 'm/s', value: 8.39, tex: 'V_A' },
        S: { name: 'sail area', q: 'area', unit: 'm²', value: 30 },
        CL: { name: 'sail lift coefficient', value: 1.2, min: 0, max: 2.5, tex: 'C_L' },
        CD: { name: 'sail (and rig) drag coefficient', value: 0.2, min: 0.01, max: 2, tex: 'C_D' },
        gA: { name: 'apparent wind angle from the bow', q: 'angle', unit: '°', value: 30.4, min: 0, max: 180, tex: '\\gamma' }
      },
      note: 'A negative result means the sail cannot drive on this heading. The side force is ½ρV_A²S(C_L cos γ + C_D sin γ).',
      practice: { unknowns: ['Fd', 'VA', 'S'] },
      stories: {
        Fd: 'A {S} sail works at $C_L$ = {CL} and $C_D$ = {CD} in an apparent wind of {VA} coming {gA} off the bow (air density {rho}). What driving force does it give?',
        S: 'A boat needs a driving force of {Fd} from a sail at $C_L$ = {CL} and $C_D$ = {CD}, in an apparent wind of {VA} at {gA} off the bow (air density {rho}). What sail area does it need?'
      }
    }
  ],
  examples: [
    {
      title: 'The apparent wind close-hauled',
      q: 'A keelboat sails at 3 m/s (5.8 kt) on a course 45° from a true wind of 6 m/s (11.7 kt). Find the apparent wind speed and angle.',
      steps: [
        '$V_A^2 = 36 + 9 + 2 \\times 6 \\times 3 \\times \\cos 45° = 70.5$, so $V_A = 8.39$ m/s (16.3 kt).',
        '$\\tan\\gamma = 6\\sin 45°/(6\\cos 45° + 3) = 4.243/7.243$, so $\\gamma = 30.4°$.'
      ],
      a: '8.4 m/s at 30° off the bow — stronger than the true wind and further forward.'
    },
    {
      title: 'Drive against heel',
      q: 'The boat carries 30 m² of sail working at $C_L = 1.2$ and $C_D = 0.2$ in that apparent wind. Find the driving and side forces.',
      steps: [
        'Dynamic pressure $\\tfrac12 \\times 1.225 \\times 8.39^2 = 43.2$ Pa; times the area, 1295 N.',
        'Drive: $1295 \\times (1.2\\sin 30.4° - 0.2\\cos 30.4°) = 1295 \\times 0.434 = 562$ N.',
        'Side: $1295 \\times (1.2\\cos 30.4° + 0.2\\sin 30.4°) = 1295 \\times 1.136 = 1471$ N.'
      ],
      a: 'About 560 N of drive against 1470 N of side force — 2.6 times as much, all of it carried by the keel.'
    },
    {
      title: 'An iceboat at three times the wind',
      q: 'An iceboat sails at 18 m/s on a course 100° from a 6 m/s true wind. What apparent wind does its sail meet?',
      steps: [
        '$V_A^2 = 36 + 324 + 2 \\times 6 \\times 18 \\times \\cos 100° = 322.5$, so $V_A = 18.0$ m/s.',
        '$\\tan\\gamma = 6\\sin 100°/(6\\cos 100° + 18) = 5.91/16.96$, so $\\gamma = 19.2°$.'
      ],
      a: 'Three times the true wind, from only 19° off the bow — the iceboat sails "close-hauled" to its own wind.'
    }
  ],
  quiz: [
    { q: 'As a boat on a beam reach speeds up, its apparent wind…', choices: ['moves aft and weakens', 'moves forward and strengthens', 'does not change', 'moves aft and strengthens'], a: 1,
      why: 'The boat\'s own headwind adds to the true wind, which comes from the side: the sum grows and swings toward the bow.' },
    { q: 'Sailing dead downwind with sails alone, a boat cannot go faster than the wind.', a: true,
      why: 'On a run the sail works by drag in the apparent wind, which is the true wind minus the boat speed; at the wind speed it would vanish. On a reach, and with a propeller-driven cart, the wind speed is not a limit.' },
    { q: 'What stops a sailboat sliding sideways?', choices: ['The rudder alone', 'The keel or centreboard, a hydrofoil at a small leeway angle', 'The mast', 'The friction of the hull alone'], a: 1,
      why: 'Like any wing, the keel gives a large side force at a small angle of attack — the leeway angle, typically 3–6°.' },
    { q: 'The true wind is 10 kt and a boat sails at 5 kt on a course 90° from it. What is the apparent wind speed, in knots?', answer: 11.18, unit: 'kt', tol: 0.02,
      why: 'With cos 90° = 0, V_A = √(10² + 5²) = 11.2 kt, from 63° off the bow.' },
    { q: 'Why can\'t a sailboat sail straight into the wind?', choices: ['The sail would be hidden behind the mast', 'The apparent wind angle becomes smaller than the rig\'s drag angle, so the force has no forward component', 'The keel stalls', 'The rudder cannot steer'], a: 1,
      why: 'Drive = L sin γ − D cos γ; it is negative when tan γ < D/L. The sail just flaps.' }
  ],
  problems: [
    { q: 'An iceboat sails at 25 m/s on a course 110° from an 8 m/s true wind. At what angle from the bow does it feel the apparent wind?', answer: 18.7, unit: '°', tol: 0.02,
      steps: ['$\\tan\\gamma = 8\\sin 110°/(8\\cos 110° + 25) = 7.518/22.26 = 0.338$.', '$\\gamma = 18.7°$.'] }
  ],
  applications: ['Sail design and trimming: camber, twist and angle of attack chosen for the apparent wind.', 'Polar diagrams and routing software, which pick the course of best VMG.', 'Rigid wing sails on racing yachts, and wind-assisted propulsion (rotor sails and wing sails) on cargo ships.', 'Iceboats, land yachts, kites and foiling boats that sail faster than the wind.'],
  history: 'Sails were used for at least five thousand years before anyone explained them as wings. In the 1920s Manfred Curry tested sails in a wind tunnel and described their lift; in the 1970s Arvel Gentry used flow analysis to overturn the old slot-effect story of how a jib helps a mainsail. Rigid wing sails, raced on C-class catamarans from the 1960s and on America\'s Cup yachts from 2010 to 2017, made the analogy literal.',
  sim: 'rot-sail'
},

/* ================================================================ NATURAL FLIGHT */
{
  id: 'bird-flight', parent: 'natural-flight', title: 'How birds fly', level: 1,
  short: 'Birds are aircraft that flap: the downstroke makes lift and thrust together, the wing twisting and folding to do it. Each species\' wings are a compromise between wing loading, aspect ratio and the way it lives — the albatross\'s long glider wings, the vulture\'s broad slotted ones, the hummingbird\'s hovering blur.',
  keywords: ['bird flight', 'flapping flight', 'wing loading', 'aspect ratio', 'soaring', 'thermal soaring', 'dynamic soaring', 'slope soaring', 'slotted wingtips', 'primary feathers', 'alula', 'V formation', 'Strouhal number', 'wingbeat frequency', 'hummingbird', 'albatross', 'scaling'],
  prereq: ['lift-equation', 'induced-drag', 'aspect-ratio', 'gliding'],
  related: ['insect-flight', 'seeds-gliders', 'winglets', 'thermals-waves', 'wind-gradient', 'wingtip-vortices', 'high-lift-devices', 'strouhal-froude', 'math:scaling-laws'],
  body: `
A bird obeys the same [[lift-equation|lift equation]] as an aircraft. In level flight its weight is carried at a speed set by its **wing loading** $w = mg/S$ and the lift coefficient it flies at:

$$V = \\sqrt{\\frac{2w}{\\rho C_L}}$$

| Bird (typical, rounded) | Mass | Wing area | Wing loading | Speed at $C_L = 0.5$ |
|---|---|---|---|---|
| Ruby-throated hummingbird | 3 g | 12 cm² | 26 N/m² | 9 m/s |
| Common swift | 40 g | 165 cm² | 24 N/m² | 9 m/s |
| House sparrow | 28 g | 90 cm² | 31 N/m² | 10 m/s |
| Pigeon | 350 g | 600 cm² | 57 N/m² | 14 m/s |
| Golden eagle | 4.5 kg | 0.60 m² | 74 N/m² | 16 m/s |
| Wandering albatross | 9 kg | 0.62 m² | 140 N/m² | 22 m/s |
| Mute swan | 10 kg | 0.65 m² | 150 N/m² | 22 m/s |

### Size sets the pace
For birds of the same shape, weight grows as length cubed and wing area as length squared, so wing loading grows in proportion to length, as $m^{1/3}$, and flight speed as $m^{1/6}$ ([[math:scaling-laws|scaling laws]]). The power to fly is roughly weight times speed, growing as $m^{7/6}$, while the power flight muscles can deliver grows more slowly. Big birds therefore run short of power: the heaviest flapping fliers, bustards and swans, weigh around 15 kg, and the largest birds that ever flew — extinct giants with wingspans of 6 m or more — like today's vultures, must have soared rather than flapped.

### Flapping: lift and thrust from one stroke
On the **downstroke** the wing moves down and forward, so the air meets it from below and ahead. The lift, perpendicular to that relative wind, tilts forward: the wing lifts and pulls at once. The wing twists as it beats — the outer wing more nose-down than the inner — so the outer part acts like a propeller while the inner part lifts much like a fixed wing. On the **upstroke** small birds fold their wings close, making little force; larger birds keep the inner wing lifting and flex the outer wing, letting air slip between the feathers.

Efficient flappers — birds, bats, insects, and fish and whales swimming — cruise with a **Strouhal number** $\\mathrm{St} = fA/V$ between about 0.2 and 0.4, where $f$ is the beat frequency and $A$ the tip's peak-to-peak amplitude. Wingbeat frequency falls with size: about 50 Hz for a hummingbird, some 15 Hz for a sparrow, 6–7 Hz for a pigeon and 3 Hz for a swan. Hummingbirds hover like insects, sweeping their wings in a flat figure of eight and making lift on both strokes (see [[insect-flight]]).

### Soaring
- **Thermal soaring**: vultures, storks and eagles have broad wings of low wing loading, to circle tightly in narrow rising currents (see [[thermals-waves]]).
- **Dynamic soaring**: the albatross, with wings of [[aspect-ratio|aspect ratio]] about 15, takes energy from the [[wind-gradient|wind gradient]] over the waves — climbing into the wind, turning, and diving downwind — and crosses oceans with hardly a wingbeat.
- **Slope soaring**: gulls and ravens ride the air deflected up by cliffs and ridges.

### Slotted tips, the alula and formations
The separated primary feathers at the tips of soaring land birds each act like a small winglet: they spread the tip vortex vertically and reduce the [[induced-drag|induced drag]] at the low speeds and high lift coefficients of thermalling (compare [[winglets]]). The **alula**, a tuft of feathers on the "thumb", lifts at high angles of attack and works like a leading-edge slat when a bird lands ([[high-lift-devices]]).

In a **V formation** each bird flies just outboard of the wingtip of the bird ahead, in the rising air (upwash) of its tip vortex ([[wingtip-vortices]]), and needs less power. Pelicans flying in formation have lower heart rates than alone, and northern bald ibises have been shown to hold the spacing theory predicts and even to time their wingbeats to catch the upwash. Airliners have been flight-tested doing the same, and saved a few per cent of fuel.
`,
  ideas: [
    'A bird obeys the lift equation: its wing loading and lift coefficient set its flight speed.',
    'Bigger birds of the same shape have higher wing loading (∝ m^1/3), fly faster (∝ m^1/6) and run short of power, so the largest soar.',
    'The downstroke gives lift and thrust together; the twisting outer wing acts like a propeller.',
    'Efficient flapping sits at a Strouhal number fA/V of about 0.2–0.4.',
    'Soarers use thermals, slopes and wind gradients; slotted tips cut induced drag, and formations share upwash.'
  ],
  pitfalls: [
    'Birds push down on the air with a flat wing like a paddle — The wing is an airfoil moving through the air; its lift, tilted forward on the downstroke, gives both lift and thrust.',
    'Big birds fly slowly because they are heavy — Heavier birds of the same shape have higher wing loading and must fly faster; big birds that seem slow are soaring on broad wings of low wing loading.',
    'Geese fly in a V so the leader can break the wind — The trailing birds gain from the rising air outboard of the wingtips ahead; the leader gains least.'
  ],
  formulas: [
    {
      name: 'Wing loading',
      expr: 'w = m*g/S', tex: 'w = \\dfrac{m g}{S}',
      vars: {
        w: { name: 'wing loading', q: 'pressure', unit: 'N/m²' },
        m: { name: 'body mass', q: 'mass', unit: 'kg', value: 0.35 },
        g: { const: 'g' },
        S: { name: 'wing area (both wings)', q: 'area', unit: 'm²', value: 0.06 }
      },
      note: 'Biologists sometimes include the body between the wings in S; values then come out lower.',
      stories: { w: 'A bird of {m} has {S} of wing. What is its wing loading?' }
    },
    {
      name: 'Flight speed from wing loading',
      expr: 'V = sqrt(2*w/(rho*CL))', tex: 'V = \\sqrt{\\dfrac{2w}{\\rho\\, C_L}}',
      vars: {
        V: { name: 'flight speed', q: 'speed', unit: 'm/s' },
        w: { name: 'wing loading', q: 'pressure', unit: 'N/m²', value: 57 },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, min: 0.5, max: 1.4, tex: '\\rho' },
        CL: { name: 'lift coefficient', value: 0.5, min: 0.05, max: 3, tex: 'C_L' }
      },
      note: 'Level, gliding or steady flapping flight where lift equals weight.',
      stories: {
        V: 'A bird with a wing loading of {w} flies at a lift coefficient of {CL} in air of density {rho}. How fast does it fly?',
        CL: 'A bird with a wing loading of {w} flies at {V} in air of density {rho}. What lift coefficient does it use?'
      }
    },
    {
      name: 'Strouhal number of flapping',
      expr: 'St = f*Amp/V', tex: '\\mathrm{St} = \\dfrac{f A}{V}',
      vars: {
        St: { name: 'Strouhal number', tex: '\\mathrm{St}' },
        f: { name: 'wingbeat frequency', q: 'frequency', unit: 'Hz', value: 6 },
        Amp: { name: 'peak-to-peak amplitude of the wingtip', q: 'length', unit: 'm', value: 0.35, tex: 'A' },
        V: { name: 'flight speed', q: 'speed', unit: 'm/s', value: 10 }
      },
      note: 'Cruising birds, bats, insects and swimming animals cluster between about 0.2 and 0.4, where flapping propulsion is most efficient.',
      stories: {
        St: 'A bird beats its wings {f} times a second with a tip amplitude of {Amp} while flying at {V}. What is its Strouhal number?',
        V: 'A bird flaps at {f} with a tip amplitude of {Amp} and cruises at a Strouhal number of {St}. How fast does it fly?'
      }
    }
  ],
  examples: [
    {
      title: 'A pigeon\'s speed from its wing loading',
      q: 'A pigeon of 350 g has 0.06 m² of wing. What is its wing loading, and how fast must it fly at a lift coefficient of 0.5 at sea level?',
      steps: [
        '$w = 0.35 \\times 9.81/0.06 = 57.2$ N/m².',
        '$V = \\sqrt{2 \\times 57.2/(1.225 \\times 0.5)} = \\sqrt{187} = 13.7$ m/s (49 km/h).',
        'Racing pigeons cruise faster still, at a lower lift coefficient.'
      ],
      a: 'About 57 N/m² and 14 m/s.'
    },
    {
      title: 'Strouhal number of a flapping pigeon',
      q: 'The pigeon beats its wings 6 times a second with a tip amplitude of 0.35 m while flying at 10 m/s. What is its Strouhal number?',
      steps: ['$\\mathrm{St} = fA/V = 6 \\times 0.35/10 = 0.21$.'],
      a: '0.21 — inside the efficient band of 0.2 to 0.4.'
    },
    {
      title: 'The price of size',
      q: 'A bird is eight times heavier than another of the same shape. Compare their wing loadings, flight speeds and flight power.',
      steps: [
        'Eight times the mass means twice the length; wing area grows four times, so the wing loading doubles.',
        'Speed grows as $\\sqrt{w}$: $\\sqrt2 = 1.41$ times faster.',
        'Power ≈ weight × speed: $8 \\times 1.41 = 11.3$ times as much — 41 % more per kilogram of bird.'
      ],
      a: 'Twice the wing loading, 1.4 times the speed and 11 times the power.'
    }
  ],
  quiz: [
    { q: 'Two birds have the same shape; one is 8 times heavier. Its wing loading is…', choices: ['the same', '2 times larger', '4 times larger', '8 times larger'], a: 1,
      why: 'Weight grows 8 times, wing area 4 times (length doubled), so W/S doubles.' },
    { q: 'In flapping flight the downstroke produces both lift and thrust.', a: true,
      why: 'The wing moving down and forward meets air from below and ahead; its lift tilts forward, so it has both an upward and a forward part.' },
    { q: 'Slotted primary feathers help a soaring vulture mainly by…', choices: ['saving weight', 'spreading the tip vortex and cutting induced drag at low speed', 'making it quieter', 'cooling the bird'], a: 1,
      why: 'Each separated feather works like a small winglet at its own angle, reducing induced drag when the bird circles slowly at a high lift coefficient.' },
    { q: 'A golden eagle of 4.5 kg has 0.6 m² of wing. What is its wing loading, in N/m²?', answer: 73.6, unit: 'N/m²', tol: 0.02,
      why: 'w = 4.5 × 9.81/0.6 = 73.6 N/m².' },
    { q: 'Why do geese fly in a V formation?', choices: ['To see each other', 'Each bird flies in the upwash from the wingtip vortex of the bird ahead', 'To shelter behind the leader from the wind', 'To follow the leader\'s navigation'], a: 1,
      why: 'Outboard of a wingtip the air rises; a bird placed there needs less induced power. The benefit is shared along the V.' }
  ],
  problems: [
    { q: 'A swift of 40 g with 0.0165 m² of wing glides at a lift coefficient of 0.6 at sea level. How fast does it fly?', answer: 8.04, unit: 'm/s', tol: 0.02,
      steps: ['$w = 0.04 \\times 9.81/0.0165 = 23.8$ N/m².', '$V = \\sqrt{2 \\times 23.8/(1.225 \\times 0.6)} = 8.04$ m/s.'] }
  ],
  applications: ['Bird-inspired drones: flapping and morphing wings, slotted and folding tips.', 'Formation flight of aircraft to save fuel.', 'Collision avoidance at airports and wind farms, which starts from how and where birds fly.', 'Understanding migration: range, speed and fat reserves follow from the same aerodynamics.'],
  history: 'Otto Lilienthal measured bird wings and built his gliders on what he learned, publishing "Birdflight as the Basis of Aviation" in 1889; the Wright brothers took their idea of twisting the wings for roll control from watching buzzards. The aerodynamics of flapping was worked out much later — with high-speed film, wind tunnels in which birds were trained to fly, and, from the 2000s, laser measurements of the vortices in their wakes.'
},

{
  id: 'insect-flight', parent: 'natural-flight', title: 'Insect flight and unsteady lift', level: 3,
  short: 'Insects fly at Reynolds numbers of about 10 to 10 000, sweeping their wings back and forth up to hundreds of times a second at high angles of attack. Steady-wing theory cannot hold them up; unsteady tricks do — a leading-edge vortex that never sheds, clap and fling, fast wing rotation and wake capture.',
  keywords: ['insect flight', 'leading-edge vortex', 'LEV', 'delayed stall', 'clap and fling', 'Weis-Fogh mechanism', 'unsteady aerodynamics', 'low Reynolds number', 'wingbeat frequency', 'hovering', 'bumblebee myth', 'rotational lift', 'wake capture', 'fruit fly', 'hawkmoth', 'asynchronous flight muscle'],
  prereq: ['reynolds-number', 'stall', 'vorticity-circulation', 'bird-flight'],
  related: ['delta-wings', 'special-airfoils', 'hover-power', 'multicopters', 'strouhal-froude', 'magnus-effect', 'physics:viscosity'],
  body: `
### Tiny wings, sticky air
The [[reynolds-number|Reynolds number]] $\\mathrm{Re} = Uc/\\nu$ of an insect wing is small: about 100–200 for a fruit fly, 1000–2000 for a honeybee or bumblebee, 5000 for a hawkmoth, and near 10 for the smallest wasps, which fly with bristled wings as if rowing through syrup. At these Reynolds numbers smooth airfoils lose their advantage: a thin flat or corrugated plate works about as well, and the best lift-to-drag ratios are only 5–10, against 100 or more for a glider's wing (compare [[special-airfoils]]).

### The bumblebee myth
In the 1930s a French book on insect flight repeated a quick calculation: a bee's wings, treated as fixed aircraft wings moving at the bee's flying speed, could not carry its weight. The calculation was right and the conclusion was wrong: bees do not glide. A bumblebee of 175 mg on 1.1 cm² of fixed wing at 3 m/s would make at most about 0.5 mN of lift with a steady lift coefficient of 0.8 — against a weight of 1.7 mN. But its wings sweep at about 4.5 m/s even when it hovers, and the flow they make is anything but steady.

### The hovering stroke
Most insects hover with the wings sweeping almost horizontally, back and forth through 120–160°, at angles of attack of 35–45° in mid-stroke. At each end the wing flips over, so that the same leading edge leads on both strokes and both make lift — like a helicopter blade that reverses. Wingbeat frequencies run from about 10 Hz in butterflies and 25 Hz in hawkmoths to about 200 Hz in fruit flies and bees and 600 Hz or more in mosquitoes, whose "asynchronous" flight muscles contract many times for each nerve impulse.

The lift coefficient an insect needs follows from the lift equation with the mean wing speed at the radius of gyration $r_2$ (about 0.55 of the wing length): a fruit fly needs about 1.9, a bumblebee about 1.2 — well above the 0.6–0.8 a steadily moving wing manages at these Reynolds numbers.

### Four unsteady tricks
1. **The leading-edge vortex (delayed stall).** At the high angle of attack the flow separates at the sharp leading edge and rolls up into a vortex lying over the wing. Its low pressure adds lift, as the vortices over a [[delta-wings|delta wing]] do. On a wing moving in a straight line such a vortex grows and sheds after a few chord lengths — the stall. On a flapping, revolving insect wing it stays attached for the whole stroke, kept stable by the flow running out along the span and by the rotation of the wing. Lift coefficients reach 1.5–1.8.
2. **Clap and fling.** At the top of the stroke the wings clap together, then peel apart from their leading edges. Air rushing into the opening gap sets up circulation around each wing at once, instead of the delay a wing starting from rest normally suffers. Tiny wasps depend on it; butterflies use it at take-off.
3. **Rotational lift.** Flipping the wing quickly at the end of each stroke adds circulation, much like a spinning ball's [[magnus-effect|Magnus effect]].
4. **Wake capture.** Reversing into the swirling wake of its own previous stroke, the wing collects a brief extra push.

### Why it matters
These mechanisms explain how insects hover, dodge and carry loads, and they guide the design of flapping-wing micro drones, some of which weigh less than a tenth of a gram. They also show the limits of steady-flow theory: the same equations of fluid motion hold, but at low Reynolds numbers and high rates of change, the flow is a different world.
`,
  ideas: [
    'Insect wings work at Reynolds numbers of about 10–10 000, where steady airfoils are poor and flat plates do as well.',
    'Hovering insects sweep their wings back and forth at 35–45° angle of attack, flipping them so both strokes lift.',
    'They need mean lift coefficients of about 1–2, more than any steady wing gives at their Reynolds number.',
    'A leading-edge vortex that stays attached through the stroke supplies most of the extra lift.',
    'Clap and fling, rotational lift and wake capture add more; all are unsteady effects.'
  ],
  pitfalls: [
    'Science proved that bumblebees cannot fly — A calculation treated the bee as a fixed-wing glider. It proved only that the model was wrong: flapping wings at high angles make far more lift through unsteady flow.',
    'Insect wings stall at high angles of attack like aircraft wings — A steadily moving wing would; a flapping, revolving insect wing keeps its leading-edge vortex attached and goes on lifting at 45°.',
    'Small insects fly like scaled-down birds — At their low Reynolds numbers viscosity dominates; the smallest use bristled wings and clap and fling, closer to rowing than to gliding.'
  ],
  formulas: [
    {
      name: 'Reynolds number of a flapping wing',
      expr: 'Re = 2*Phi*f*R*c/nu', tex: '\\mathrm{Re} = \\dfrac{2\\Phi f R\\, c}{\\nu}',
      vars: {
        Re: { name: 'Reynolds number', tex: '\\mathrm{Re}' },
        Phi: { name: 'stroke amplitude', q: 'angle', unit: '°', value: 150, min: 20, max: 180, tex: '\\Phi' },
        f: { name: 'wingbeat frequency', q: 'frequency', unit: 'Hz', value: 200 },
        R: { name: 'wing length', q: 'length', unit: 'mm', value: 2.5 },
        c: { name: 'mean chord', q: 'length', unit: 'mm', value: 0.8 },
        nu: { name: 'kinematic viscosity of air', q: 'kinvisc', unit: 'mm²/s', value: 15, tex: '\\nu' }
      },
      note: '2ΦfR is the mean speed of the wingtip over a stroke (Φ in radians). The values are for a fruit fly; ν = 15 mm²/s for air at 20 °C.',
      stories: {
        Re: 'An insect sweeps wings {R} long with a mean chord of {c} through {Phi}, {f} times a second, in air of kinematic viscosity {nu}. What is the Reynolds number of its wings?',
        f: 'An insect with wings {R} long (mean chord {c}) sweeps them through {Phi}. At what wingbeat frequency does its Reynolds number reach {Re} (ν = {nu})?'
      }
    },
    {
      name: 'Mean lift coefficient needed to hover',
      expr: 'CL = 2*m*g/(rho*S*(2*Phi*f*r2)^2)', tex: 'C_L = \\dfrac{2 m g}{\\rho S\\,(2\\Phi f r_2)^2}',
      vars: {
        CL: { name: 'mean lift coefficient', tex: 'C_L' },
        m: { name: 'insect mass', q: 'mass', unit: 'mg', value: 1 },
        g: { const: 'g' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, min: 0.5, max: 1.4, tex: '\\rho' },
        S: { name: 'area of both wings', q: 'area', unit: 'mm²', value: 4 },
        Phi: { name: 'stroke amplitude', q: 'angle', unit: '°', value: 150, min: 20, max: 180, tex: '\\Phi' },
        f: { name: 'wingbeat frequency', q: 'frequency', unit: 'Hz', value: 200 },
        r2: { name: 'radius of gyration of the wing (≈ 0.55 × its length)', q: 'length', unit: 'mm', value: 1.375, tex: 'r_2' }
      },
      note: 'A quasi-steady estimate: weight = ½ρU²SC_L with U the mean speed of the wing at its radius of gyration. It ignores the slower speeds at stroke reversal, so real peak coefficients are higher still.',
      practice: { unknowns: ['CL', 'f', 'm'] },
      stories: {
        CL: 'An insect of {m} hovers with wings of total area {S}, sweeping through {Phi} at {f}; the radius of gyration of its wing is {r2}. What mean lift coefficient does it need (air density {rho})?',
        f: 'An insect of {m} with {S} of wing (radius of gyration {r2}) can reach a mean lift coefficient of {CL} with a stroke of {Phi}. What wingbeat frequency must it use to hover (air density {rho})?'
      }
    }
  ],
  examples: [
    {
      title: 'The Reynolds number of a fruit fly',
      q: 'A fruit fly sweeps wings 2.5 mm long (mean chord 0.8 mm) through 150° about 200 times a second. What is the Reynolds number of its wings in air ($\\nu = 1.5\\times10^{-5}$ m²/s)?',
      steps: [
        'Mean tip speed: $2\\Phi f R = 2 \\times 2.618 \\times 200 \\times 0.0025 = 2.62$ m/s.',
        '$\\mathrm{Re} = 2.62 \\times 0.0008/1.5\\times10^{-5} = 140$.'
      ],
      a: 'About 140 — a flow in which viscosity matters almost as much as inertia.'
    },
    {
      title: 'How much lift a fruit fly needs',
      q: 'The fly weighs 1 mg and its two wings have 4 mm² of area, with a radius of gyration of 1.375 mm. What mean lift coefficient must it make?',
      steps: [
        'Mean wing speed at $r_2$: $2 \\times 2.618 \\times 200 \\times 0.001375 = 1.44$ m/s.',
        'Dynamic pressure $\\tfrac12 \\times 1.225 \\times 1.44^2 = 1.27$ Pa; times the area, $5.08\\times10^{-6}$ N.',
        'Weight $9.81\\times10^{-6}$ N, so $C_L = 9.81/5.08 = 1.93$.'
      ],
      a: 'About 1.9 — more than twice what a steady wing gives at Re ≈ 140.'
    },
    {
      title: 'The bumblebee, done properly',
      q: 'A 175 mg bumblebee has 1.1 cm² of wing. Compare the lift of its wings held still at 3 m/s ($C_L = 0.8$) with its weight, then find the mean lift coefficient it needs when hovering with a stroke of 115° at 150 Hz and a radius of gyration of 7.5 mm.',
      steps: [
        'Fixed wing: $\\tfrac12 \\times 1.225 \\times 3^2 \\times 1.1\\times10^{-4} \\times 0.8 = 0.49$ mN, against a weight of 1.72 mN.',
        'Flapping: $U = 2 \\times 2.007 \\times 150 \\times 0.0075 = 4.5$ m/s at $r_2$.',
        '$C_L = 2 \\times 1.72\\times10^{-3}/(1.225 \\times 1.1\\times10^{-4} \\times 4.5^2) = 1.26$.'
      ],
      a: 'A fixed wing would carry under a third of its weight; flapping, it needs C_L ≈ 1.3 — high, but within reach of a leading-edge vortex.'
    }
  ],
  quiz: [
    { q: 'Why does the leading-edge vortex on a fruit fly\'s wing not shed, as it would on an aircraft wing at high angle of attack?', choices: ['The wing is too small for vortices', 'Flow along the span and the rotation of the flapping wing keep it stable', 'The insect flies too slowly for vortices to form', 'The vortex is sucked into the body'], a: 1,
      why: 'On a revolving wing, air runs outward along the span and carries vorticity out of the vortex, and rotational effects hold it in place, so it stays attached for the whole stroke.' },
    { q: 'Engineers once proved that bumblebees cannot fly.', a: false,
      why: 'A quick calculation treated the bee as a fixed-wing glider; it showed only that the model did not apply. Flapping wings with unsteady flow make ample lift.' },
    { q: 'Clap and fling helps a small insect because…', choices: ['the clap makes a sound that frightens predators', 'air rushing into the opening gap creates circulation at once, without the usual delay', 'the wings stick together to rest', 'it cools the flight muscles'], a: 1,
      why: 'A wing starting from rest normally needs a few chord lengths of travel for its circulation to build up; the fling creates it immediately.' },
    { q: 'A honeybee sweeps wings 10 mm long (mean chord 3 mm) through 130° at 230 Hz. With ν = 1.5 × 10⁻⁵ m²/s, what is the Reynolds number of its wings?', answer: 2090, tol: 0.03,
      why: 'Mean tip speed 2 × 2.269 × 230 × 0.010 = 10.4 m/s; Re = 10.4 × 0.003/1.5 × 10⁻⁵ ≈ 2090.' },
    { q: 'At a Reynolds number of about 100, which wing section works about as well as a carefully shaped airfoil?', choices: ['A thin flat or corrugated plate', 'A thick laminar-flow airfoil', 'A supercritical airfoil', 'None: all perform equally badly'], a: 0,
      why: 'At low Reynolds numbers thickness and smooth curvature bring little; thin plates, and the corrugated wings of dragonflies, do as well or better.' }
  ],
  problems: [
    { q: 'A hawkmoth of 1.6 g hovers with wings of total area 18 cm², sweeping them through 120° at 26 Hz; the radius of gyration of its wing is 25 mm. What mean lift coefficient does it need?', answer: 1.92, tol: 0.03,
      steps: ['$U = 2 \\times 2.094 \\times 26 \\times 0.025 = 2.72$ m/s.', '$\\tfrac12 \\rho U^2 S = 0.5 \\times 1.225 \\times 7.41 \\times 0.0018 = 8.17$ mN.', 'Weight 15.7 mN, so $C_L = 15.7/8.17 = 1.92$.'] }
  ],
  applications: ['Flapping-wing micro air vehicles and insect-sized robots.', 'Understanding how pollinators carry loads of pollen and nectar.', 'Unsteady aerodynamics of helicopter blades and wind turbines in gusts, where dynamic stall and leading-edge vortices also appear.', 'Mosquito and pest control research, which studies the tones of wingbeats.'],
  history: 'In 1934 the French entomologist Antoine Magnan, citing a calculation with the engineer André Sainte-Laguë, remarked that by the rules of aircraft a bee should not fly — the seed of a lasting myth. Torkel Weis-Fogh described clap and fling in the tiny wasp Encarsia in 1973; Charles Ellington\'s group saw the stable leading-edge vortex on hawkmoths with smoke in 1996, and Michael Dickinson measured the forces on a robotic fruit-fly wing flapping in oil in 1999.'
},

{
  id: 'seeds-gliders', parent: 'natural-flight', title: 'Seeds that glide and spin', level: 1,
  short: 'Plants spread their seeds on the wind by making them fall slowly. A maple seed autorotates like a tiny one-bladed helicopter rotor and falls at about 1 m/s; a dandelion floats under a parachute of bristles; the Javan cucumber\'s paper-thin seed glides like a flying wing. The slower the fall, the farther the wind carries it.',
  keywords: ['samara', 'maple seed', 'sycamore seed', 'autorotation', 'seed dispersal', 'dandelion', 'pappus', 'separated vortex ring', 'Alsomitra', 'Javan cucumber', 'Zanonia', 'flying wing', 'descent speed', 'disc loading', 'tip-speed ratio', 'Etrich Taube'],
  prereq: ['autorotation', 'gliding', 'terminal-velocity'],
  related: ['tip-speed-ratio', 'wind-turbines', 'insect-flight', 'bird-flight', 'hover-power', 'drag-equation', 'longitudinal-stability', 'phugoid'],
  body: `
A seed released from 15 m that falls at 1 m/s spends 15 seconds in the air, and a 5 m/s breeze carries it about 75 m: the drift is roughly the release height times the wind speed divided by the descent speed, $x \\approx HU/V_d$. Every halving of the descent speed doubles the reach — and in gusty, rising air, the slowest seeds can travel kilometres. Plants have found three ways to fall slowly: spin, float and glide.

### The maple seed: a one-bladed rotor
A maple seed (a **samara**) has a heavy nut at one end of a thin, veined wing. Dropped, it tumbles for a moment, then settles into a steady spin: the nut near the axis, the wing coned up a little and pitched a few degrees, sweeping a whole disc. It is in permanent [[autorotation]]. The air rising past it as it falls drives the wing round exactly as the wind drives a [[wind-turbines|wind turbine]] — a maple seed is a turbine with no generator — and the spin settles where the torque on the wing is zero.

The spinning wing makes the seed a parachute the size of its disc. A sycamore maple seed of about 0.1 g with a 4 cm wing sweeps about 50 cm² — some fourteen times the area of the wing itself — and falls at roughly 1 m/s, turning somewhere around 15–20 times a second: its tips move about four to five times faster than it falls, the [[tip-speed-ratio|tip-speed ratio]] of a slow-running turbine. The same wing falling flat without spinning would drop at about 2 m/s, and the bare nut at over 10 m/s. As a parachute of the disc's area, the seed's drag coefficient is about 0.35 — lower than the 1.2 of an ideal rotor, because at a [[reynolds-number|Reynolds number]] of about 2000 the wing's own drag takes much of the energy. As on an insect wing, a leading-edge vortex sits on the samara and raises its lift.

Its descent speed follows from the disc loading $W/A$, with $A = \\pi R^2$ for a wing of length $R$:

$$V_d = \\sqrt{\\frac{2mg}{\\rho\\,\\pi R^2\\, C_D}}$$

so a heavier seed falls as the square root of its mass, and a longer wing slows it in proportion. Maples, sycamores and ash trees shed single-winged samaras; some tropical trees shed two- to five-winged ones that spin like multi-bladed rotors.

### The dandelion: a porous parachute
A dandelion seed hangs under a pappus of about a hundred fine bristles — mostly empty space. Air flowing through the bristles forms a stable ring vortex that floats just above them without touching: a **separated vortex ring**, first described in 2018. It gives the pappus several times more drag, for the material it is made of, than a solid disc would have. The seed sinks at only a few tenths of a metre per second, and the faintest updraughts can carry it for kilometres.

### Alsomitra: the flying wing
The Javan cucumber, *Alsomitra macrocarpa*, a climbing vine of the South-East Asian rainforest, releases seeds with a papery wing about 13 cm across. With the seed at the front and the wing swept and gently turned up at its trailing edge and tips, it is a stable tailless glider: its centre of gravity lies ahead of the wing's aerodynamic centre (see [[longitudinal-stability]]). It glides at about a metre per second, descending roughly one metre for every three to four forward, often in long gentle swoops (a [[phugoid]]). Its shape inspired early tailless aircraft.

> [!tip] The simulation lets you vary the samara's mass, wing length and pitch, and see the torque balance that sets its spin.
`,
  ideas: [
    'Seeds spread farther the slower they fall: drift ≈ release height × wind speed ÷ descent speed.',
    'A maple seed autorotates: the rising air drives its wing like a wind turbine, and the spin settles where the torque is zero.',
    'The spinning wing sweeps a disc many times its own area, so the seed falls like a parachute of that disc, at about 1 m/s.',
    'A dandelion floats under a porous pappus with a separated vortex ring above it.',
    'Alsomitra\'s seed is a stable tailless glider, its centre of gravity ahead of its aerodynamic centre.'
  ],
  pitfalls: [
    'A maple seed spins because it was twisted when it grew — It spins because the air rising past it drives the wing; a flat card with a weight at one end, cut to the same shape, autorotates too.',
    'A spinning seed falls slowly because spinning makes it lighter — Its weight is unchanged; the spinning wing acts on all the air passing through its disc, many times the wing\'s own area.',
    'A dandelion pappus works like a solid umbrella — It is mostly holes; air passing through the bristles sets up a detached vortex ring that makes more drag than a solid disc of the same material would.'
  ],
  formulas: [
    {
      name: 'Descent speed of a spinning seed',
      expr: 'Vd = sqrt(2*m*g/(rho*pi*R^2*CD))', tex: 'V_d = \\sqrt{\\dfrac{2mg}{\\rho\\,\\pi R^2\\, C_D}}',
      vars: {
        Vd: { name: 'descent speed', q: 'speed', unit: 'm/s', tex: 'V_d' },
        m: { name: 'seed mass', q: 'mass', unit: 'g', value: 0.1 },
        g: { const: 'g' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, min: 0.5, max: 1.4, tex: '\\rho' },
        R: { name: 'wing length (radius of the disc swept)', q: 'length', unit: 'cm', value: 4 },
        CD: { name: 'drag coefficient on the swept disc', value: 0.35, min: 0.05, max: 2, tex: 'C_D' }
      },
      note: 'C_D here is the thrust coefficient of the autorotating seed on its disc area: about 0.35 in the simulation\'s model of a maple seed, about 1.2 for an ideal rotor.',
      stories: {
        Vd: 'A maple seed of {m} has a wing {R} long. Taking a drag coefficient of {CD} on its disc, how fast does it fall in air of density {rho}?',
        R: 'A seed of {m} with a disc drag coefficient of {CD} should fall no faster than {Vd} (air density {rho}). How long must its wing be?'
      }
    },
    {
      name: 'How far the wind carries it',
      expr: 'x = H*U/Vd', tex: 'x = \\dfrac{H\\, U}{V_d}',
      vars: {
        x: { name: 'drift distance', q: 'length', unit: 'm' },
        H: { name: 'release height', q: 'length', unit: 'm', value: 15 },
        U: { name: 'wind speed', q: 'speed', unit: 'm/s', value: 5 },
        Vd: { name: 'descent speed', q: 'speed', unit: 'm/s', value: 0.95, tex: 'V_d' }
      },
      note: 'Steady wind and still vertical air. Gusts and updraughts carry the slowest seeds much farther.',
      stories: {
        x: 'A seed falling at {Vd} is released {H} up in a {U} wind. How far does it land from the tree?',
        Vd: 'Seeds released {H} up in a {U} wind land about {x} away. How fast do they fall?'
      }
    },
    {
      name: 'Tip-speed ratio of a samara',
      expr: 'lambda = 2*pi*n*R/Vd', tex: '\\lambda = \\dfrac{2\\pi n R}{V_d}',
      vars: {
        lambda: { name: 'tip-speed ratio', tex: '\\lambda' },
        n: { name: 'spin rate (turns per second)', q: 'frequency', unit: 'Hz', value: 17.4 },
        R: { name: 'wing length', q: 'length', unit: 'cm', value: 4 },
        Vd: { name: 'descent speed', q: 'speed', unit: 'm/s', value: 0.95, tex: 'V_d' }
      },
      note: 'The same ratio as for a wind turbine, with the descent speed as the "wind".',
      stories: { lambda: 'A samara with a {R} wing spins at {n} while falling at {Vd}. What is its tip-speed ratio?' }
    }
  ],
  examples: [
    {
      title: 'A maple seed as a parachute',
      q: 'A maple seed of 0.1 g has a 4 cm wing. With a drag coefficient of 0.35 on its swept disc, how fast does it fall at sea level, and how does that compare with the same wing (3.6 cm² of area) falling flat with $C_D = 1.2$?',
      steps: [
        'Disc area $\\pi \\times 0.04^2 = 50.3$ cm²; disc loading $9.81\\times10^{-4}/5.03\\times10^{-3} = 0.195$ N/m².',
        '$V_d = \\sqrt{2 \\times 9.81\\times10^{-4}/(1.225 \\times 5.03\\times10^{-3} \\times 0.35)} = 0.95$ m/s.',
        'Flat wing: $\\sqrt{2 \\times 9.81\\times10^{-4}/(1.225 \\times 3.6\\times10^{-4} \\times 1.2)} = 1.9$ m/s.'
      ],
      a: 'About 0.95 m/s spinning — half the speed of the same wing falling flat.'
    },
    {
      title: 'How far it travels',
      q: 'The seed is released 15 m up in a steady 5 m/s wind. How far away does it land? And a seed that falls at 2 m/s?',
      steps: ['$x = HU/V_d = 15 \\times 5/0.95 = 79$ m.', 'At 2 m/s: $15 \\times 5/2 = 37.5$ m.'],
      a: 'About 80 m — twice as far as a seed falling twice as fast.'
    }
  ],
  quiz: [
    { q: 'Why does a spinning maple seed fall more slowly than the same wing falling flat?', choices: ['Spinning makes it lighter', 'The spinning wing sweeps a disc many times its own area and acts on all the air passing through it', 'The spin warms the air, which rises', 'The spin makes the air thinner below it'], a: 1,
      why: 'Like a rotor, the seed slows the air through its whole disc; its "parachute" is the disc, not the wing.' },
    { q: 'In steady autorotation a maple seed\'s wing is driven by the air in some places and braked in others, and the two balance so that the net torque is zero.', a: true,
      why: 'Exactly as in a helicopter\'s autorotation: the spin rises or falls until the driving and braking torques cancel.' },
    { q: 'A seed falling at 0.8 m/s is released 20 m up in a 4 m/s wind. How far does it drift, in metres?', answer: 100, unit: 'm', tol: 0.02,
      why: 'Time in the air 20/0.8 = 25 s; drift 25 × 4 = 100 m.' },
    { q: 'A samara twice as heavy, with the same wing, falls…', choices: ['twice as fast', '√2 times as fast', 'at the same speed', '4 times as fast'], a: 1,
      why: 'V_d ∝ √(mg/A): doubling the mass raises the speed by √2 ≈ 1.41, and the seed spins faster at the same tip-speed ratio.' },
    { q: 'What keeps an Alsomitra seed stable in its glide without a tail?', choices: ['It spins', 'Its centre of gravity is ahead of the wing\'s aerodynamic centre, and the swept wing is turned up at the rear and tips', 'It is heavier at the back', 'It has a small parachute'], a: 1,
      why: 'That is the recipe of a stable flying wing: weight forward and a reflexed, swept wing to trim it.' }
  ],
  problems: [
    { q: 'A samara with a 3.5 cm wing spins 20 times a second while falling at 1.1 m/s. What is its tip-speed ratio?', answer: 4.0, tol: 0.02,
      steps: ['Tip speed $2\\pi \\times 20 \\times 0.035 = 4.40$ m/s.', '$\\lambda = 4.40/1.1 = 4.0$.'] }
  ],
  applications: ['Seed-dispersal ecology: how far forests spread and how plants colonise new ground.', 'Samara-inspired sensor drones and single-winged "monocopters" that descend slowly.', 'Paper and card models of samaras for teaching autorotation.', 'The Alsomitra seed as an early model for tailless, flying-wing aircraft.'],
  history: 'The German professor Friedrich Ahlborn studied the gliding seed of Alsomitra (then called Zanonia) in the 1890s, and Igo Etrich and Franz Wels built a tailless glider on its pattern in 1906–07; the curved, swept-back wings of Etrich\'s later Taube monoplane still echoed it. The samara\'s secrets came much later: in 2009 David Lentink and colleagues showed a stable leading-edge vortex on autorotating seeds, and in 2018 Cathal Cummins and colleagues in Edinburgh found the dandelion\'s separated vortex ring.',
  sim: 'rot-samara'
}

);
