/* HYPER-AERODYNAMICS · content/stability.js
 * Branch "Stability and Control": topics static-stability and control-dynamics.
 * Simulations in sims/stability.js (ids stab-…).
 * Aircraft figures are typical, rounded illustrations — never operating limits.
 */
Hyper.add(

/* ================================================================ STATIC STABILITY */

{
  id: 'aircraft-axes', parent: 'static-stability', title: 'Axes and angles of an aircraft', level: 1,
  short: 'An aircraft rotates about three body axes — roll about the nose-to-tail axis, pitch about the wing-to-wing axis, yaw about the vertical one. Three Euler angles give its attitude, and the angle of attack α and the sideslip β say how the air meets it.',
  keywords: ['roll', 'pitch', 'yaw', 'body axes', 'Euler angles', 'bank angle', 'heading', 'pitch attitude', 'angle of attack', 'sideslip', 'flight-path angle', 'stability axes', 'rolling moment', 'yawing moment', 'gimbal lock'],
  prereq: ['math:vectors', 'math:coordinate-systems-3d', 'physics:torque'],
  related: ['center-of-gravity', 'longitudinal-stability', 'control-surfaces', 'force-coefficients', 'lift-equation', 'turning-flight', 'dynamic-stability'],
  body: `
Describing how an aircraft moves takes two things: a set of axes fixed to the aircraft, and a way to say how those axes are turned relative to the ground. Aerodynamicists use the same conventions everywhere, so a stability derivative from a 1960s report and a modern flight-control law speak the same language.

### Three axes through the centre of gravity
The **body axes** start at the [[center-of-gravity|centre of gravity]] and turn with the aircraft:

| Axis | Points | Rotation about it | Rate | Moment | Main control |
|---|---|---|---|---|---|
| $x$, longitudinal | out of the nose | **roll** | $p$ | rolling moment $\\mathcal{L}$ | ailerons |
| $y$, lateral | out of the right wing | **pitch** | $q$ | pitching moment $M$ | elevator |
| $z$, normal | down through the floor | **yaw** | $r$ | yawing moment $N$ | rudder |

The $z$ axis points *down* so that the set is right-handed with $x$ forward and $y$ to the right. The reward is that the positive senses are the natural ones: positive pitch is nose up, positive roll is right wing down, positive yaw is nose right. The rolling moment gets a script $\\mathcal{L}$ so that it is not confused with lift. As with [[force-coefficients|force coefficients]], moments are made dimensionless: $C_l = \\mathcal{L}/(qSb)$ and $C_n = N/(qSb)$ use the wingspan $b$, while $C_m = M/(qS\\bar c)$ uses the mean aerodynamic chord $\\bar c$.

### Attitude: three Euler angles
Where the aircraft points relative to the Earth is given by three angles applied **in a fixed order**: yaw through the heading $\\psi$, then pitch through the pitch attitude $\\theta$, then roll through the bank angle $\\phi$. The order matters because finite rotations do not commute — roll a book 90° and then pitch it 90°, then try the other order. At $\\theta = \\pm 90°$ heading and bank can no longer be told apart (gimbal lock), which is why inertial systems and flight simulators store attitude as a quaternion and convert to $\\psi, \\theta, \\phi$ only for display.

### How the air meets the aircraft: α and β
Resolve the velocity relative to the air into body components $u$ (forward), $v$ (to the right) and $w$ (downward). Two angles then say how the air arrives:

$$\\alpha = \\arctan\\frac{w}{u}, \\qquad \\beta = \\arcsin\\frac{v}{V}$$

The **angle of attack** α lies in the aircraft's plane of symmetry; the **sideslip angle** β is the angle out of it. Positive β means the aircraft is moving slightly to its right, so the relative wind comes from the right of the nose. In a well-flown turn β stays near zero; in a crosswind landing a pilot may hold several degrees on purpose.

Attitude and angle of attack are different things. With the wings level and no sideslip,

$$\\gamma = \\theta - \\alpha$$

where γ is the **flight-path angle**, the climb or descent angle of the velocity. An airliner descending on a 3° glide slope at α = 6° has its nose 3° *above* the horizon; a light aircraft climbing at γ = 5° with α = 8° shows 13° of nose-up attitude.

> [!key] Three questions, three angles: where the nose points (θ), where the aircraft goes (γ), and how the air meets the wing (α). Only α sets the lift coefficient.

### Other axis systems
Dynamicists also use **Earth axes** (north, east, down), **wind axes** ($x$ along the velocity) and **stability axes** — body axes turned in pitch so that $x$ points into the relative wind of the trimmed flight, which keeps the linearised equations of [[dynamic-stability|dynamic stability]] simplest. The physics is the same in all of them; only the components change, through the rotation matrices of [[math:linear-transformations|linear transformations]].
`,
  ideas: [
    'Body axes: x out of the nose (roll, p), y out of the right wing (pitch, q), z downward (yaw, r); positive means nose up, right wing down, nose right.',
    'Attitude is three Euler angles applied in order: heading ψ, then pitch θ, then bank φ. Finite rotations do not commute.',
    'The angle of attack α = arctan(w/u) and the sideslip β = arcsin(v/V) say how the relative wind meets the aircraft.',
    'Pitch attitude, flight-path angle and angle of attack differ: with wings level and no sideslip, γ = θ − α.',
    'Moments are made dimensionless with qSb for roll and yaw and with qSc̄ for pitch.'
  ],
  pitfalls: [
    'The angle of attack is the angle of the nose above the horizon — That is the pitch attitude θ. The angle of attack is measured from the flight path, so a descending airliner can have its nose above the horizon and still meet the air at 6°.',
    'The order of the three Euler angles does not matter — It does: rotations through finite angles do not commute. Aviation uses heading, then pitch, then bank; any other order gives a different attitude for the same three numbers.',
    'Sideslip is the same as yaw — Yaw is a rotation of the aircraft; sideslip is the angle between the nose and the relative wind. An aircraft can yaw steadily in a coordinated turn with zero sideslip, or hold a steady sideslip without yawing at all.'
  ],
  formulas: [
    {
      name: 'Angle of attack from the velocity components',
      expr: 'alpha = atan(w/u)', tex: '\\alpha = \\arctan\\frac{w}{u}',
      vars: {
        alpha: { name: 'angle of attack', q: 'angle', unit: '°', min: -90, max: 90, signed: true, tex: '\\alpha' },
        w: { name: 'downward velocity component (body axes)', q: 'speed', unit: 'm/s', value: 4, signed: true, tex: 'w' },
        u: { name: 'forward velocity component (body axes)', q: 'speed', unit: 'm/s', value: 60, tex: 'u' }
      },
      note: 'u and w are components of the velocity relative to the air, in body axes. An air-data probe or a vane measures α directly.',
      stories: {
        alpha: 'An aircraft moves through the air at {u} along its body x axis and {w} along its z axis. What is its angle of attack?',
        w: 'An aircraft flying with a forward velocity component of {u} is at an angle of attack of {alpha}. What is the downward component w?'
      }
    },
    {
      name: 'Sideslip angle',
      expr: 'beta = asin(v/V)', tex: '\\beta = \\arcsin\\frac{v}{V}',
      vars: {
        beta: { name: 'sideslip angle', q: 'angle', unit: '°', min: -90, max: 90, signed: true, tex: '\\beta' },
        v: { name: 'sideways velocity component (to the right)', q: 'speed', unit: 'm/s', value: 3, signed: true, tex: 'v' },
        V: { name: 'true airspeed', q: 'speed', unit: 'm/s', value: 60, tex: 'V' }
      },
      note: 'Positive β: the aircraft moves towards its right wing and the relative wind comes from the right of the nose.',
      stories: { beta: 'An aircraft flying at {V} drifts sideways through the air at {v}. What is its sideslip angle?' }
    },
    {
      name: 'Flight-path angle',
      expr: 'gamma = theta - alpha', tex: '\\gamma = \\theta - \\alpha',
      vars: {
        gamma: { name: 'flight-path angle (climb positive)', q: 'angle', unit: '°', min: -90, max: 90, signed: true, tex: '\\gamma' },
        theta: { name: 'pitch attitude', q: 'angle', unit: '°', value: 9, min: -90, max: 90, signed: true, tex: '\\theta' },
        alpha: { name: 'angle of attack', q: 'angle', unit: '°', value: 4, min: -20, max: 40, signed: true, tex: '\\alpha' }
      },
      note: 'For wings-level flight without sideslip. In a banked turn the relation involves the bank angle as well.',
      practice: { unknowns: ['gamma', 'theta'] },
      stories: {
        gamma: 'An aircraft holds a pitch attitude of {theta} at an angle of attack of {alpha}, wings level. What is its flight-path angle?',
        theta: 'An aircraft follows a flight path of {gamma} at an angle of attack of {alpha}. Where is its nose relative to the horizon?'
      }
    }
  ],
  examples: [
    {
      title: 'Reading α and β from air data',
      q: 'An air-data system measures body-axis velocity components $u = 62$ m/s, $v = -2.5$ m/s and $w = 5.2$ m/s. Find the airspeed, the angle of attack and the sideslip.',
      steps: [
        'Airspeed: $V = \\sqrt{62^2 + 2.5^2 + 5.2^2} = \\sqrt{3877} = 62.3$ m/s.',
        'Angle of attack: $\\alpha = \\arctan(5.2/62) = 4.8°$.',
        'Sideslip: $\\beta = \\arcsin(-2.5/62.3) = -2.3°$. Negative: the aircraft drifts to its left and the relative wind comes from the left of the nose.'
      ],
      a: 'V ≈ 62.3 m/s, α ≈ 4.8°, β ≈ −2.3° (air from the left).'
    },
    {
      title: 'Nose up, going down',
      q: 'An airliner follows a 3° glide slope at an angle of attack of 6°, wings level. What pitch attitude does the pilot see?',
      steps: [
        'Descending means $\\gamma = -3°$.',
        '$\\theta = \\gamma + \\alpha = -3° + 6° = +3°$.'
      ],
      a: 'The nose is 3° above the horizon although the aircraft is descending.'
    }
  ],
  quiz: [
    { q: 'About which body axis does the elevator mainly rotate the aircraft?', choices: ['the x axis, through the nose', 'the y axis, along the wings', 'the z axis, through the floor', 'the axis of the relative wind'], a: 1,
      why: 'The elevator changes the pitching moment, which rotates the aircraft about the lateral (y) axis. Ailerons act about x, the rudder about z.' },
    { q: 'A glider descends along a path 4° below the horizon at an angle of attack of 6°, wings level. Its nose is…', choices: ['10° below the horizon', '2° below the horizon', '2° above the horizon', '6° above the horizon'], a: 2,
      why: 'θ = γ + α = −4° + 6° = +2°. The nose points slightly up even though the glider goes down; the angle of attack is measured from the flight path, not from the horizon.' },
    { q: 'Rolling 90° right and then pitching 30° up gives the same attitude as pitching 30° up and then rolling 90° right.', a: false,
      why: 'Finite rotations do not commute. In the first case the "pitch" happens about the rolled y axis and swings the nose sideways; in the second the nose ends 30° above the horizon. That is why the Euler angles have a fixed order.' },
    { q: 'An aircraft has body velocity components u = 50 m/s and w = 3.5 m/s. What is its angle of attack in degrees?', answer: 4.0, unit: '°',
      why: 'α = arctan(3.5/50) = arctan(0.07) = 4.0°.' },
    { q: 'Positive sideslip β means…', choices: ['the nose is to the right of the flight path', 'the relative wind comes from the right of the nose', 'the aircraft is yawing to the right', 'the right wing is low'], a: 1,
      why: 'β > 0 when v > 0: the aircraft moves towards its right, so the air meets it from the right. The nose is then to the left of the flight path. Yaw rate and bank are separate quantities.' }
  ],
  applications: ['Flight data recorders and flight-test instrumentation, which log attitude, α and β in these conventions.', 'Inertial navigation and flight simulators, which carry attitude as quaternions and display Euler angles.', 'Angle-of-attack vanes and multi-hole air-data probes, whose readings feed stall warning and flight-control computers.'],
  history: 'Leonhard Euler described a rigid body\'s orientation by three successive rotations in the eighteenth century. In 1911 George Hartley Bryan published *Stability in Aviation*, which set up the body-axis equations of an aircraft with the stability derivatives still used today.',
  sim: 'stab-axes'
},

{
  id: 'center-of-gravity', parent: 'static-stability', title: 'Centre of gravity and balance', level: 1,
  short: 'The centre of gravity is the point where the aircraft\'s whole weight acts. Where it sits relative to the wing decides how stable and how controllable the aircraft is, so every flight starts with a weight-and-balance calculation that keeps it inside a certified envelope.',
  keywords: ['centre of gravity', 'center of gravity', 'CG', 'weight and balance', 'datum', 'arm', 'moment', 'loading', 'CG envelope', 'forward limit', 'aft limit', 'mean aerodynamic chord', 'MAC', 'per cent MAC', 'fuel burn', 'load sheet'],
  prereq: ['physics:center-of-mass', 'physics:torque', 'aircraft-axes'],
  related: ['longitudinal-stability', 'neutral-point', 'trim', 'stall', 'spins', 'four-forces'],
  body: `
Every part of an aircraft — structure, engine, fuel, people, bags — has weight, and all of it together acts as one force through one point: the **centre of gravity** (CG). In flight the CG is the pivot about which the aircraft pitches, rolls and yaws. Its position relative to the wing and tail decides whether the aircraft is stable, how hard the tail must work to [[trim]] it, and whether the elevator is strong enough to flare for landing. Keeping it in the right place is called **weight and balance**.

### Moments about a datum
Positions are measured along the fuselage from a reference plane, the **datum**, chosen by the manufacturer (often the firewall or a point ahead of the nose). The distance of an item from the datum is its **arm**, and mass × arm is its **moment**. The CG is the total moment divided by the total mass — the [[physics:center-of-mass|centre of mass]] in one dimension:

$$x_{cg} = \\frac{\\sum m_i x_i}{\\sum m_i}$$

A loading of a generic four-seat trainer (illustrative figures, not those of any real type):

| Item | Mass (kg) | Arm (m) | Moment (kg·m) |
|---|---|---|---|
| Empty aircraft | 760 | 2.20 | 1672 |
| Pilot and front passenger | 160 | 2.10 | 336 |
| Rear passengers | 80 | 3.00 | 240 |
| Fuel, 150 L | 108 | 2.45 | 265 |
| Baggage | 20 | 3.60 | 72 |
| **Total** | **1128** | **2.29** | **2585** |

### Per cent of the mean chord
Aerodynamicists give the CG as a fraction of the **mean aerodynamic chord** $\\bar c$, measured from its leading edge (LEMAC): $h = (x_{cg} - x_{LE})/\\bar c$. If the trainer's MAC starts 1.95 m behind the datum and is 1.50 m long, the CG above sits at $h = 0.227$, or 22.7 % MAC. In these units the CG can be compared directly with the wing's aerodynamic centre (about 25 %) and with the [[neutral-point|neutral point]].

### Why there is a forward and an aft limit
| CG too far forward | CG too far aft |
|---|---|
| Tail must push down harder: more trim drag, higher [[stall]] speed | Small static margin: weak return to trim, light and twitchy pitch |
| Elevator may run out of authority to rotate or to flare | Stick forces fall and can reverse; overstressing is easier |
| Heavy stick forces | Stall and [[spins|spin]] recovery can become hard or impossible |

The certified range is typically 15–25 % of the MAC wide. On the **loading envelope** — mass on one axis, CG on the other — the limits form a polygon; the forward limit often moves aft at high mass, because a heavy aircraft needs more elevator to flare.

### Fuel burn and moving loads
The CG moves in flight as fuel burns, as passengers walk and as a trolley rolls down the aisle. Fuel stored aft of the CG moves the CG forward as it burns, and fuel stored ahead of it moves the CG aft, so a loading has to be inside the envelope at takeoff, at landing and with zero fuel. Moving a mass $m$ through a distance $d$ in an aircraft of total mass $M$ shifts the CG by

$$\\Delta x_{cg} = \\frac{m\\,d}{M}$$

— which is how a load planner decides how much cargo to shift, and why 20 kg moved 1.5 m in an 1100 kg aircraft is worth nearly 3 cm.

> [!warn] The figures here are an illustration. The weight-and-balance limits, loading procedures and envelope of a real aircraft come from its approved flight manual and weight-and-balance documents; flight operations follow them and the rules of the air.
`,
  ideas: [
    'The CG is the mass-weighted average position: total moment divided by total mass.',
    'Arms are measured from a datum; moments (mass × arm) simply add.',
    'The CG is quoted in per cent of the mean aerodynamic chord so it can be compared with the aerodynamic centre and the neutral point.',
    'A forward limit protects elevator authority and stall speed; an aft limit protects stability and recoverability.',
    'Fuel burn and moving loads shift the CG in flight: the loading must stay inside the envelope from takeoff to zero fuel.'
  ],
  pitfalls: [
    'If the total mass is below the maximum, the loading is fine — The CG must also be inside its limits. A light aircraft with two heavy rear passengers and full baggage can be under its maximum mass and still dangerously tail-heavy.',
    'A forward CG is always the safe side — Only up to the forward limit. Beyond it the elevator may not be able to raise the nose for rotation or the landing flare, and the stall speed and trim drag rise.',
    'The CG stays put during a flight — Burning fuel, moving passengers and dropping loads all move it; a loading that is legal at takeoff can drift out of the envelope before landing.'
  ],
  formulas: [
    {
      name: 'Centre of gravity of three items',
      expr: 'xcg = (m1*x1 + m2*x2 + m3*x3)/(m1 + m2 + m3)', tex: 'x_{cg} = \\frac{m_1 x_1 + m_2 x_2 + m_3 x_3}{m_1 + m_2 + m_3}',
      vars: {
        xcg: { name: 'CG position aft of the datum', q: 'length', unit: 'm', signed: true, tex: 'x_{cg}' },
        m1: { name: 'empty aircraft mass', q: 'mass', unit: 'kg', value: 760, tex: 'm_1' },
        x1: { name: 'empty aircraft CG arm', q: 'length', unit: 'm', value: 2.2, signed: true, tex: 'x_1' },
        m2: { name: 'front-seat occupants', q: 'mass', unit: 'kg', value: 160, tex: 'm_2' },
        x2: { name: 'front-seat arm', q: 'length', unit: 'm', value: 2.1, signed: true, tex: 'x_2' },
        m3: { name: 'rear-seat occupants', q: 'mass', unit: 'kg', value: 80, tex: 'm_3' },
        x3: { name: 'rear-seat arm', q: 'length', unit: 'm', value: 3.0, signed: true, tex: 'x_3' }
      },
      note: 'Any number of items works the same way: add all the moments, divide by the total mass. Arms are measured aft of the datum (ahead of it they are negative).',
      practice: { unknowns: ['xcg', 'm3'] },
      stories: {
        xcg: 'An aircraft of {m1} with its empty CG at {x1} carries {m2} of front-seat occupants at {x2} and {m3} in the rear seats at {x3}. Where is the loaded CG?',
        m3: 'An aircraft of {m1} (CG {x1}) carries {m2} at {x2}. How much mass at {x3} brings the CG to {xcg}?'
      }
    },
    {
      name: 'CG in per cent of the mean aerodynamic chord',
      expr: 'h = (xcg - xle)/c', tex: 'h = \\frac{x_{cg} - x_{LE}}{\\bar{c}}',
      vars: {
        h: { name: 'CG position in per cent MAC', q: 'ratio', unit: '%', signed: true, tex: 'h' },
        xcg: { name: 'CG position aft of the datum', q: 'length', unit: 'm', value: 2.29, signed: true, tex: 'x_{cg}' },
        xle: { name: 'leading edge of the MAC aft of the datum', q: 'length', unit: 'm', value: 1.95, signed: true, tex: 'x_{LE}' },
        c: { name: 'mean aerodynamic chord', q: 'length', unit: 'm', value: 1.5, tex: '\\bar{c}' }
      },
      stories: { h: 'The mean aerodynamic chord of {c} begins {xle} behind the datum, and the CG is at {xcg}. Where is the CG in per cent MAC?' }
    },
    {
      name: 'CG shift when a mass is moved',
      expr: 'dx = m*d/M', tex: '\\Delta x_{cg} = \\frac{m\\,d}{M}',
      vars: {
        dx: { name: 'shift of the CG', q: 'length', unit: 'cm', signed: true, tex: '\\Delta x_{cg}' },
        m: { name: 'mass moved', q: 'mass', unit: 'kg', value: 20, tex: 'm' },
        d: { name: 'distance it is moved (aft positive)', q: 'length', unit: 'm', value: 1.5, signed: true, tex: 'd' },
        M: { name: 'total aircraft mass', q: 'mass', unit: 'kg', value: 1128, tex: 'M' }
      },
      note: 'The total mass does not change, only the moment. Solve for m to find how much load must be moved to bring the CG within limits.',
      practice: { unknowns: ['dx', 'm'] },
      stories: {
        dx: 'A {m} bag is moved {d} aft in an aircraft of {M}. How far does the CG move?',
        m: 'The CG of an aircraft of {M} must move {dx}. How much load must be shifted through {d}?'
      }
    }
  ],
  examples: [
    {
      title: 'A loading that is too heavy',
      q: 'The trainer in the table above (1128 kg, CG 2.29 m) takes 30 kg more baggage at 3.60 m. Its maximum mass is 1150 kg, and at that mass its CG must lie between 2.22 m and 2.40 m. Is the loading legal, and what could fix it?',
      steps: [
        'New mass $1128 + 30 = 1158$ kg: 8 kg over the maximum.',
        'New moment $2585 + 30 \\times 3.60 = 2693$ kg·m, so the CG is at $2693/1158 = 2.325$ m — inside the CG limits.',
        'Removing 8 kg of fuel (about 11 L) at 2.45 m gives 1150 kg and a moment of $2693 - 8 \\times 2.45 = 2673$ kg·m: CG $2673/1150 = 2.324$ m.'
      ],
      a: 'Overweight by 8 kg although the CG is fine; offloading about 11 L of fuel makes it legal (CG 2.32 m).'
    },
    {
      title: 'Moving a bag forward',
      q: 'A 20 kg bag is moved from the baggage area (3.60 m) to the front seats (2.10 m) of the 1128 kg aircraft. How far does the CG move, in centimetres and in per cent of the 1.50 m MAC?',
      steps: [
        'Distance moved: $d = 2.10 - 3.60 = -1.50$ m (forward).',
        '$\\Delta x_{cg} = m d/M = 20 \\times (-1.50)/1128 = -0.0266$ m = −2.7 cm.',
        'In MAC: $-0.0266/1.50 = -1.8$ %, from 22.7 % to 20.9 %.'
      ],
      a: 'The CG moves 2.7 cm forward, 1.8 % of the MAC.'
    },
    {
      title: 'Fuel burn moves the CG',
      q: 'During the flight the trainer burns 100 L of fuel (72 kg) from tanks at 2.45 m. Where is the CG at landing?',
      steps: [
        'New mass $1128 - 72 = 1056$ kg; new moment $2585 - 72 \\times 2.45 = 2408$ kg·m.',
        'CG $= 2408/1056 = 2.281$ m, 1 cm further forward, because the fuel sat behind the CG.'
      ],
      a: 'About 2.28 m — a small forward shift, since the tanks are just aft of the CG.'
    }
  ],
  quiz: [
    { q: 'Heavy bags are loaded in the rear baggage compartment. The CG moves…', choices: ['forward, and the aircraft becomes more stable in pitch', 'aft, and the aircraft becomes less stable and lighter in pitch', 'aft, and the stall speed rises', 'nowhere, since only the mass changes'], a: 1,
      why: 'Mass added behind the CG moves the CG aft. The static margin shrinks, so the aircraft is less stable and the controls lighter. A forward CG, not an aft one, raises the stall speed.' },
    { q: 'Why does a forward CG raise the stall speed?', choices: ['The wing\'s lift slope falls', 'The tail must push down harder, so the wing must lift more than the weight', 'The air meets the wing at a smaller angle', 'Forward CG increases the drag of the fuselage'], a: 1,
      why: 'With the CG further ahead of the wing\'s lift, the tailplane must carry a larger download to trim. The wing then supports the weight plus that download, so it reaches C_L,max at a higher speed.' },
    { q: 'An 800 kg aircraft has its CG at 2.0 m; 200 kg of load is added at 3.0 m. Where is the new CG, in metres from the datum?', answer: 2.2, unit: 'm',
      why: 'x = (800 × 2.0 + 200 × 3.0)/(800 + 200) = 2200/1000 = 2.2 m.' },
    { q: 'As long as the total mass is below the maximum, the CG may be anywhere.', a: false,
      why: 'Mass and CG are separate limits. An aircraft under its maximum mass can still have its CG ahead of the forward limit or behind the aft limit, with dangerous consequences for control or stability.' },
    { q: 'Fuel is carried in a tank aft of the CG. As it burns, the CG moves…', choices: ['aft', 'forward', 'up', 'it does not move'], a: 1,
      why: 'Removing mass that sits behind the CG shifts the balance point forward — the opposite of adding it.' }
  ],
  problems: [
    { q: 'A 1000 kg aircraft has its CG at 2.45 m, 5 cm behind its aft limit. How much baggage must be moved from the rear compartment (3.60 m) to the front seats (2.10 m) to bring the CG to the limit?', answer: 33.3, unit: 'kg', tol: 0.03,
      hint: 'Δx = m d/M; solve for m with Δx = −0.05 m and d = −1.50 m.',
      steps: ['$m = M\\,\\Delta x/d = 1000 \\times (-0.05)/(-1.50)$.', '$= 33.3$ kg.'] },
    { q: 'An aircraft\'s MAC is 1.60 m long and starts 2.00 m behind the datum. Its aft limit is 32 % MAC. What is the aft limit as an arm from the datum?', answer: 2.512, unit: 'm', tol: 0.02,
      steps: ['$x = x_{LE} + h\\,\\bar c = 2.00 + 0.32 \\times 1.60$.', '$= 2.512$ m.'] }
  ],
  applications: ['Load sheets and trim sheets for every airline departure, now computed by software from the passenger and cargo loads.', 'Placing batteries and payloads in drones and model aircraft, where a few millimetres of CG change the handling.', 'Helicopters, whose CG must stay close under the rotor mast, with even tighter limits than aeroplanes.'],
  history: 'The Wright brothers learnt balance the hard way: their canard aircraft were nose-light and pitch-sensitive, and in 1904 they added ballast near the front elevator to tame them. Formal weight-and-balance control became routine with the airliners of the 1930s.',
  sim: 'stab-weight-balance'
},

{
  id: 'longitudinal-stability', parent: 'static-stability', title: 'Longitudinal static stability', level: 2,
  short: 'An aircraft is statically stable in pitch when a nose-up disturbance creates a nose-down moment: its pitching-moment curve slopes downward, C_mα < 0, and crosses zero at a positive angle of attack, where it trims.',
  keywords: ['static stability', 'pitch stability', 'longitudinal stability', 'pitching moment', 'Cm alpha', 'Cmα', 'trim point', 'restoring moment', 'tailplane', 'horizontal stabiliser', 'canard', 'flying wing', 'reflex', 'stick-fixed', 'stick-free', 'speed stability'],
  prereq: ['pitching-moment', 'center-of-gravity', 'lift-curve', 'physics:static-equilibrium'],
  related: ['neutral-point', 'trim', 'short-period', 'phugoid', 'fly-by-wire', 'center-of-pressure', 'downwash'],
  body: `
Balance a pencil on its point and it falls; hang it from its top and it swings back. Pitch stability asks the same question of an aircraft: when a gust raises the nose, does the aircraft answer with a moment that lowers it again? If it does, the aircraft is **statically stable** in pitch. "Static" refers only to the *first* tendency; whether the motion that follows dies out is the business of [[dynamic-stability|dynamic stability]].

### The pitching-moment curve
Plot the pitching-moment coefficient about the CG, $C_m$, against the angle of attack. Two properties make a flyable aircraft:

1. **The slope is negative**, $C_{m_\\alpha} = dC_m/d\\alpha < 0$: more α brings a nose-down moment, less α a nose-up one.
2. **The line crosses zero at a useful, positive angle of attack**, which needs $C_{m_0} > 0$. The crossing is the trim point, where the aircraft flies hands-off.

$$C_m = C_{m_0} + C_{m_\\alpha}\\,\\alpha$$

A light aircraft typically has $C_{m_\\alpha}$ between −0.5 and −1.5 per radian (−0.01 to −0.025 per degree). With a positive slope a disturbance grows — the nose keeps rising — and the aircraft is statically unstable.

### Where the stability comes from
Take moments about the CG. The wing's lift acts at its [[pitching-moment|aerodynamic centre]] near the quarter chord, and a cambered wing also carries a nose-down moment $C_{m,ac}$. The tail's lift acts far behind. For the whole aircraft

$$C_m = C_{m,ac} + C_L\\,(h - h_{ac}) - \\eta\\,V_H\\,C_{L,t}$$

with $h$ and $h_{ac}$ the CG and aerodynamic-centre positions as fractions of the mean chord, $V_H$ the tail volume coefficient and η the tail's share of the dynamic pressure.

- **The wing** destabilises when the CG is behind its aerodynamic centre: the extra lift from a gust acts ahead of the CG and raises the nose further.
- **The tailplane** is the stabiliser. A gust raises its angle of attack too, and its extra lift acts on a long arm behind the CG, pushing the nose back down — the feathers on an arrow. The wing's [[downwash]] blunts this: the tail feels only a fraction $1 - d\\varepsilon/d\\alpha$, typically 0.5–0.6, of each change in α.
- **The fuselage and engine nacelles** destabilise: a body inclined to the flow makes a nose-up moment that grows with the angle.

Moving the CG aft lengthens the wing's destabilising lever and shortens the tail's, so the slope becomes less negative until, at the [[neutral-point|neutral point]], it is zero.

### Canards and flying wings
A **canard** puts the small surface in front. It still works if the CG is ahead of the aircraft's neutral point; for safety the foreplane is loaded more heavily than the wing so that it stalls first and drops the nose before the main wing can stall. A **flying wing** has no tail: it is stable with the CG ahead of its aerodynamic centre, and it gets its positive $C_{m_0}$ from a reflexed airfoil (the trailing edge turned up) or from swept wings whose tips are twisted nose-down and act as a tail.

### What the pilot feels
With the elevator free to float, the tail loses part of its effect and the aircraft is a little less stable ("stick-free" rather than "stick-fixed"). A pilot senses stability as **stick force**: a stable aircraft trimmed at 100 knots needs a pull to fly slower and a push to fly faster, and drifts back towards 100 knots when released. Certification rules require that gradient to be stable and noticeable.

> [!key] Static stability is about slopes; trim is about zeros. $C_{m_\\alpha} < 0$ makes the aircraft return; $C_m = 0$ says where it returns to.
`,
  ideas: [
    'Static stability is the initial tendency after a disturbance: a nose-up gust must produce a nose-down moment.',
    'The test is the slope of the pitching-moment curve about the CG: C_mα < 0.',
    'Trim needs C_m = 0 at a positive angle of attack, so C_m0 must be positive.',
    'The tail stabilises, the fuselage destabilises, and the wing destabilises when the CG is behind its aerodynamic centre.',
    'Moving the CG aft weakens stability until it vanishes at the neutral point.'
  ],
  pitfalls: [
    'A stable aircraft returns smoothly to trim — Static stability only guarantees the initial push back. The motion can overshoot and oscillate; whether it settles is a question of dynamic stability.',
    'The tail stabilises because it always lifts upward — It stabilises because its lift *changes* with angle of attack on a long arm. Its trim load is usually downward, and it stabilises all the same.',
    'Stability means the aircraft holds its altitude — Pitch stability returns the angle of attack (and so the trimmed speed), not the height. A stable aircraft disturbed in speed will climb and descend in a phugoid.'
  ],
  formulas: [
    {
      name: 'The linear pitching-moment curve',
      expr: 'Cm = Cm0 + Cma*alpha', tex: 'C_m = C_{m_0} + C_{m_\\alpha}\\,\\alpha',
      vars: {
        Cm: { name: 'pitching-moment coefficient about the CG', value: 0, signed: true, tex: 'C_m' },
        Cm0: { name: 'moment coefficient at zero angle of attack', value: 0.06, signed: true, tex: 'C_{m_0}' },
        Cma: { name: 'pitch stiffness C_mα (per radian)', value: -0.8, signed: true, tex: 'C_{m_\\alpha}' },
        alpha: { name: 'angle of attack', q: 'angle', unit: '°', min: -10, max: 25, signed: true, tex: '\\alpha' }
      },
      solveFor: 'alpha',
      note: 'With C_m = 0 the angle is the trim angle of attack. α enters in radians, so C_mα is per radian (divide by 57.3 for per degree). Stable when C_mα < 0.',
      practice: { unknowns: ['alpha', 'Cm', 'Cma'] },
      stories: {
        alpha: 'An aircraft has C_m0 = {Cm0} and a pitch stiffness of {Cma} per radian. At what angle of attack does it trim (C_m = {Cm})?',
        Cm: 'An aircraft with C_m0 = {Cm0} and C_mα = {Cma} per radian flies at {alpha}. What is its pitching-moment coefficient?',
        Cma: 'An aircraft with C_m0 = {Cm0} trims at {alpha} (C_m = {Cm}). What is its pitch stiffness per radian?'
      }
    },
    {
      name: 'Moment balance of wing and tail',
      expr: 'Cm = Cmac + CL*(h - hac) - eta*VH*CLt', tex: 'C_m = C_{m,ac} + C_L\\,(h - h_{ac}) - \\eta\\,V_H\\,C_{L,t}',
      vars: {
        Cm: { name: 'pitching-moment coefficient about the CG', value: 0, signed: true, tex: 'C_m' },
        Cmac: { name: 'wing moment coefficient about its aerodynamic centre', value: -0.05, signed: true, tex: 'C_{m,ac}' },
        CL: { name: 'wing lift coefficient', value: 0.5, signed: true, tex: 'C_L' },
        h: { name: 'CG position', q: 'ratio', unit: '%', value: 30, signed: true, tex: 'h' },
        hac: { name: 'aerodynamic-centre position', q: 'ratio', unit: '%', value: 25, tex: 'h_{ac}' },
        eta: { name: 'tail dynamic-pressure ratio', value: 0.9, min: 0.5, max: 1.2, tex: '\\eta' },
        VH: { name: 'tail volume coefficient', value: 0.6, tex: 'V_H' },
        CLt: { name: 'tail lift coefficient (up positive)', signed: true, tex: 'C_{L,t}' }
      },
      solveFor: 'CLt',
      note: 'Positions are fractions of the mean aerodynamic chord from its leading edge. Setting C_m = 0 gives the tail lift needed to trim; a negative C_L,t means the tail pushes down.',
      practice: { unknowns: ['CLt', 'h'] },
      stories: {
        CLt: 'A wing with C_m,ac = {Cmac} flies at C_L = {CL} with the CG at {h} and its aerodynamic centre at {hac}. The tail volume is {VH} and η = {eta}. What tail lift coefficient trims it?',
        h: 'A wing (C_m,ac = {Cmac}, aerodynamic centre {hac}) flies at C_L = {CL}; the tail (V_H = {VH}, η = {eta}) works at C_L,t = {CLt}. Where must the CG be for trim?'
      }
    },
    {
      name: 'Pitching moment from its coefficient',
      expr: 'M = Cm*0.5*rho*V^2*S*c', tex: 'M = C_m\\,\\tfrac{1}{2}\\rho V^2 S\\,\\bar{c}',
      vars: {
        M: { name: 'pitching moment (nose-up positive)', q: 'torque', unit: 'N·m', signed: true, tex: 'M' },
        Cm: { name: 'pitching-moment coefficient', value: 0.02, signed: true, tex: 'C_m' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'true airspeed', q: 'speed', unit: 'm/s', value: 50, tex: 'V' },
        S: { name: 'wing area', q: 'area', unit: 'm²', value: 16.2, tex: 'S' },
        c: { name: 'mean aerodynamic chord', q: 'length', unit: 'm', value: 1.5, tex: '\\bar{c}' }
      },
      stories: { M: 'A light aircraft ({S} of wing, mean chord {c}) flies at {V} in air of density {rho} with C_m = {Cm}. What pitching moment acts on it?' }
    }
  ],
  examples: [
    {
      title: 'Stability from two wind-tunnel points',
      q: 'A model measured about its CG gives $C_m = +0.030$ at α = 2° and $C_m = -0.010$ at α = 6°. Is it stable, and where does it trim?',
      steps: [
        'Slope: $C_{m_\\alpha} = (-0.010 - 0.030)/(6° - 2°) = -0.010$ per degree $= -0.57$ per radian. Negative: stable.',
        'Zero crossing: $\\alpha_{trim} = 2° + 0.030/0.010 = 5.0°$, and $C_{m_0} = 0.030 + 2 \\times 0.010 = 0.050 > 0$.'
      ],
      a: 'Stable, with C_mα ≈ −0.57 per radian, trimming at α = 5°.'
    },
    {
      title: 'How hard the tail works',
      q: 'A wing with $C_{m,ac} = -0.05$ flies at $C_L = 0.5$ with the CG at 30 % and the aerodynamic centre at 25 % of the MAC. The tail volume is 0.6 and η = 0.9. What tail lift coefficient trims the aircraft? On a 3 m² tail at 60 m/s at sea level, what force is that?',
      steps: [
        'Set $C_m = 0$: $\\eta V_H C_{L,t} = C_{m,ac} + C_L(h - h_{ac}) = -0.05 + 0.5 \\times 0.05 = -0.025$.',
        '$C_{L,t} = -0.025/(0.9 \\times 0.6) = -0.046$.',
        'Force: $0.9 \\times \\tfrac12 \\times 1.225 \\times 60^2 \\times 3.0 \\times (-0.046) = -275$ N.'
      ],
      a: 'C_L,t ≈ −0.046: the tail pushes down with about 275 N.'
    },
    {
      title: 'The restoring moment after a gust',
      q: 'A light aircraft ($C_{m_\\alpha} = -0.8$ per radian, $S = 16.2$ m², $\\bar c = 1.5$ m, $I_{yy} = 1825$ kg·m²) flies at 50 m/s at sea level. A gust raises α by 2°. What moment results, and what pitch acceleration?',
      steps: [
        '$\\Delta C_m = -0.8 \\times 0.0349 = -0.0279$.',
        '$M = \\Delta C_m\\, q S \\bar c = -0.0279 \\times 1531 \\times 16.2 \\times 1.5 = -1040$ N·m (nose-down).',
        '$\\dot q = M/I_{yy} = -1040/1825 = -0.57$ rad/s² ≈ −33 °/s².'
      ],
      a: 'About 1.0 kN·m nose-down, starting the nose back down at about 33 °/s².'
    }
  ],
  quiz: [
    { q: 'Which pitching-moment curve (C_m about the CG against α) belongs to a statically stable aircraft that trims at a positive angle of attack?', choices: ['rising, and negative at α = 0', 'falling, and positive at α = 0', 'falling, and negative at α = 0', 'flat, and zero everywhere'], a: 1,
      why: 'A negative slope gives a restoring moment; a positive C_m0 puts the zero crossing, the trim point, at a positive α. Falling and negative at zero trims only at negative α — the aircraft would fly upside down.' },
    { q: 'Moving the CG aft makes C_mα…', choices: ['more negative: more stable', 'less negative: less stable', 'unchanged, since C_mα depends only on the tail', 'positive at once'], a: 1,
      why: 'Moving the CG aft lengthens the wing\'s destabilising lever and shortens the tail\'s stabilising one. The slope rises towards zero, reached at the neutral point.' },
    { q: 'A statically stable aircraft always returns to its trim angle of attack without overshooting.', a: false,
      why: 'Static stability is only the first tendency. The return can overshoot and oscillate (the short-period mode), and in principle an oscillation can even grow. That is dynamic stability.' },
    { q: 'An aircraft has C_m0 = 0.05 and C_mα = −0.010 per degree. At what angle of attack does it trim, in degrees?', answer: 5, unit: '°',
      why: 'C_m = 0.05 − 0.010 α = 0 gives α = 5°.' },
    { q: 'Why is the foreplane of a canard aircraft usually loaded more heavily than the main wing?', choices: ['to carry most of the weight', 'so that it stalls first and lowers the nose before the wing stalls', 'to reduce drag', 'because the CG is behind the wing'], a: 1,
      why: 'A more heavily loaded foreplane works at a higher lift coefficient, so it reaches its stall first; the nose drops and the main wing is protected from stalling.' }
  ],
  applications: ['Designing the tail and choosing the CG range of any new aircraft.', 'Paper darts and model gliders, trimmed with a paperclip on the nose or a bend in the trailing edge.', 'Flying wings and blended-wing bodies, stabilised by reflex and sweep instead of a tail.', 'Kites, rockets and arrows, which all rely on the same "feathers behind the CG" principle.'],
  history: 'George Cayley\'s gliders of 1799–1853 already had a tail set at a smaller angle than the wing. In 1871 Alphonse Pénaud flew a rubber-powered model, the planophore, whose tailplane was deliberately set at a negative angle to the wing — the first clear demonstration of longitudinal stability in powered flight.',
  sim: 'stab-pitch'
},

{
  id: 'neutral-point', parent: 'static-stability', title: 'Neutral point and static margin', level: 3,
  short: 'The neutral point is the CG position at which an aircraft is neutrally stable in pitch. The static margin — how far the CG sits ahead of it, as a fraction of the mean chord — measures how stable the aircraft is.',
  keywords: ['neutral point', 'static margin', 'tail volume coefficient', 'horizontal tail volume', 'VH', 'aft CG limit', 'stick-free neutral point', 'manoeuvre point', 'aerodynamic centre of the aircraft', 'downwash gradient', 'tail efficiency', 'elevator angle to trim'],
  prereq: ['longitudinal-stability', 'center-of-gravity', 'downwash', 'lift-curve'],
  related: ['trim', 'fly-by-wire', 'short-period', 'pitching-moment', 'aspect-ratio', 'flight-testing'],
  body: `
Slide the CG aft and the pitching-moment slope $C_{m_\\alpha}$ becomes less and less negative. At one particular CG position it reaches zero: the aircraft is **neutrally stable**, and a disturbance neither grows nor shrinks — the aircraft simply stays at its new angle of attack. That position is the **neutral point**, $h_n$. It is the aerodynamic centre of the whole aircraft: the point about which the total pitching moment does not change with angle of attack. Measured from it,

$$C_{m_\\alpha} = -a\\,(h_n - h)$$

where $a$ is the aircraft's lift-curve slope (per radian) and $h$, $h_n$ are measured from the leading edge of the mean chord as fractions of it. The distance $h_n - h$ is the **static margin** $K_n$ — the single most important number in longitudinal stability.

### Where the neutral point is: the tail volume
The tail's power depends on its area $S_t$ and its arm $l_t$, compared with the wing's area and chord. Their ratio is the **horizontal tail volume coefficient**

$$V_H = \\frac{S_t\\,l_t}{S\\,\\bar c}$$

and, leaving out the fuselage, the neutral point lies at

$$h_n = h_{ac} + \\eta\\,V_H\\,\\frac{a_t}{a}\\left(1 - \\varepsilon_\\alpha\\right)$$

with $h_{ac} \\approx 0.25$ the wing's aerodynamic centre, η ≈ 0.9 the tail's share of the dynamic pressure, $a_t/a$ the ratio of tail and wing lift slopes (the tail's lower [[aspect-ratio]] makes it about 0.7–0.8) and $\\varepsilon_\\alpha = d\\varepsilon/d\\alpha$ the [[downwash]] gradient, about 0.4–0.5. For a light aircraft with $V_H = 0.57$ this puts $h_n$ near 0.48; the fuselage then moves it forward by several per cent, to about 0.42. Designers start from historical values:

| Type | Typical $V_H$ |
|---|---|
| Sailplane | 0.5 |
| Single-engine light aircraft | 0.7 |
| Twin-engine light aircraft | 0.8 |
| Jet transport | 1.0 |
| Fighter with stability augmentation | 0.4 |

### How much margin
| Static margin | Behaviour |
|---|---|
| 15–25 % | Very stable: heavy and reluctant in pitch, much trim drag |
| 5–15 % | The usual range for conventional aircraft |
| 0 | Neutral: no preferred angle of attack |
| negative | Unstable: flyable only with a [[fly-by-wire|flight-control computer]] |

The aft CG limit sits a safe margin ahead of the neutral point, so that stability survives loading errors, a floating elevator, and the loss of tail effectiveness with power or flaps.

### Stick-free, manoeuvring and supersonic
If the elevator is free to float, the **stick-free** neutral point lies a few per cent of the MAC ahead of the stick-fixed one. In a pull-up, the extra angle of attack the tail gets from the pitch rate adds stability, so the **manoeuvre point**, where the stick force per g falls to zero, lies behind the neutral point. At supersonic speed the wing's aerodynamic centre moves from about 25 % to about 50 % of the chord, so the static margin — and the trim drag — jump; Concorde pumped fuel to a tail tank to move its CG aft as it accelerated, and forward again before descending.

### Finding it in flight
Flight testers trim at several speeds and plot the elevator angle against the lift coefficient, at two or more CG positions. The slope of that line is proportional to the static margin, so extrapolating the slopes to zero locates the neutral point without ever flying there — one of the classic [[flight-testing|flight tests]].
`,
  ideas: [
    'The neutral point is the CG position at which C_mα = 0: the aerodynamic centre of the whole aircraft.',
    'Static margin K_n = h_n − h; the pitch stiffness is C_mα = −a K_n.',
    'The tail volume coefficient V_H = S_t l_t/(S c̄) is the main lever on the neutral point; downwash and the fuselage move it forward.',
    'Conventional aircraft fly with 5–15 % static margin; the aft CG limit is set well ahead of the neutral point.',
    'The stick-free neutral point lies ahead of the stick-fixed one; the manoeuvre point lies behind it.'
  ],
  pitfalls: [
    'The neutral point is the wing\'s aerodynamic centre — It is the aerodynamic centre of the whole aircraft. The tail moves it well aft of the wing\'s quarter chord, to 40–50 % of the MAC on a typical light aircraft.',
    'More static margin is always better — A large margin makes the aircraft heavy in pitch, raises trim drag and the stall speed, and can leave the elevator too weak to flare. Designers aim for enough margin, not the most.',
    'At the neutral point the aircraft cannot be trimmed — It can: the pitching moment is simply the same at every angle of attack. What vanishes is the tendency to return after a disturbance.'
  ],
  formulas: [
    {
      name: 'Horizontal tail volume coefficient',
      expr: 'VH = St*lt/(S*c)', tex: 'V_H = \\frac{S_t\\, l_t}{S\\,\\bar{c}}',
      vars: {
        VH: { name: 'tail volume coefficient', tex: 'V_H' },
        St: { name: 'tailplane area', q: 'area', unit: 'm²', value: 3.0, tex: 'S_t' },
        lt: { name: 'tail arm (CG to tail aerodynamic centre)', q: 'length', unit: 'm', value: 4.6, tex: 'l_t' },
        S: { name: 'wing area', q: 'area', unit: 'm²', value: 16.2, tex: 'S' },
        c: { name: 'mean aerodynamic chord', q: 'length', unit: 'm', value: 1.5, tex: '\\bar{c}' }
      },
      practice: { unknowns: ['VH', 'St'] },
      stories: {
        VH: 'A tailplane of {St} sits {lt} behind the CG of an aircraft with {S} of wing and a mean chord of {c}. What is the tail volume coefficient?',
        St: 'A designer wants a tail volume coefficient of {VH} with a tail arm of {lt}, on a wing of {S} with a mean chord of {c}. How large must the tailplane be?'
      }
    },
    {
      name: 'Stick-fixed neutral point (wing and tail)',
      expr: 'hn = hac + eta*VH*(at/a)*(1 - de)', tex: 'h_n = h_{ac} + \\eta\\,V_H\\,\\frac{a_t}{a}\\left(1 - \\varepsilon_\\alpha\\right)',
      vars: {
        hn: { name: 'neutral point', q: 'ratio', unit: '%', tex: 'h_n' },
        hac: { name: 'wing aerodynamic centre', q: 'ratio', unit: '%', value: 25, tex: 'h_{ac}' },
        eta: { name: 'tail dynamic-pressure ratio', value: 0.9, min: 0.5, max: 1.2, tex: '\\eta' },
        VH: { name: 'tail volume coefficient', value: 0.57, tex: 'V_H' },
        at: { name: 'tail lift slope (per radian)', value: 4.0, tex: 'a_t' },
        a: { name: 'wing lift slope (per radian)', value: 5.0, tex: 'a' },
        de: { name: 'downwash gradient dε/dα', value: 0.45, min: 0, max: 0.9, tex: '\\varepsilon_\\alpha' }
      },
      note: 'Positions in per cent of the MAC from its leading edge. The fuselage and nacelles, left out here, typically move the neutral point forward by 5–10 % of the MAC.',
      practice: { unknowns: ['hn', 'VH'] },
      stories: {
        hn: 'A wing (aerodynamic centre {hac}, lift slope {a} per radian) has a tail of volume {VH}, lift slope {at} per radian and η = {eta}; the downwash gradient is {de}. Where is the neutral point?',
        VH: 'With the wing aerodynamic centre at {hac}, a = {a}, a_t = {at}, η = {eta} and a downwash gradient of {de}, what tail volume puts the neutral point at {hn}?'
      }
    },
    {
      name: 'Pitch stiffness from the static margin',
      expr: 'Cma = -a*(hn - h)', tex: 'C_{m_\\alpha} = -a\\,(h_n - h)',
      vars: {
        Cma: { name: 'pitch stiffness C_mα (per radian)', signed: true, tex: 'C_{m_\\alpha}' },
        a: { name: 'aircraft lift slope (per radian)', value: 5.0, tex: 'a' },
        hn: { name: 'neutral point', q: 'ratio', unit: '%', value: 42, tex: 'h_n' },
        h: { name: 'CG position', q: 'ratio', unit: '%', value: 30, signed: true, tex: 'h' }
      },
      note: 'h_n − h is the static margin. Negative C_mα (CG ahead of the neutral point) is stable.',
      practice: { unknowns: ['Cma', 'h'] },
      stories: {
        Cma: 'An aircraft with a lift slope of {a} per radian has its neutral point at {hn} and its CG at {h}. What is its pitch stiffness?',
        h: 'An aircraft (lift slope {a} per radian, neutral point {hn}) should have C_mα = {Cma}. Where must its CG be?'
      }
    }
  ],
  examples: [
    {
      title: 'The neutral point of a light aircraft',
      q: 'A light aircraft has a 3.0 m² tailplane 4.6 m behind the CG, a 16.2 m² wing with a 1.5 m mean chord, $a = 5.0$ and $a_t = 4.0$ per radian, η = 0.9 and $d\\varepsilon/d\\alpha = 0.45$. The fuselage moves the neutral point 6 % of the MAC forward. Find $V_H$, the neutral point and the static margin with the CG at 30 %.',
      steps: [
        '$V_H = 3.0 \\times 4.6/(16.2 \\times 1.5) = 13.8/24.3 = 0.568$.',
        'Wing and tail: $h_n = 0.25 + 0.9 \\times 0.568 \\times 0.8 \\times 0.55 = 0.25 + 0.225 = 0.475$.',
        'With the fuselage: $h_n \\approx 0.475 - 0.06 = 0.415$.',
        'Static margin at $h = 0.30$: $0.415 - 0.30 = 0.115$, and $C_{m_\\alpha} = -5.0 \\times 0.115 = -0.58$ per radian.'
      ],
      a: 'V_H ≈ 0.57, neutral point ≈ 41.5 % MAC, static margin ≈ 11.5 %.'
    },
    {
      title: 'Placing the aft CG limit',
      q: 'For the same aircraft (neutral point 41.5 % MAC, MAC 1.50 m starting 1.95 m behind the datum), the designer wants at least 5 % static margin. Where is the aft limit, in % MAC and in metres from the datum?',
      steps: [
        '$h_{max} = h_n - 0.05 = 0.365$.',
        '$x = 1.95 + 0.365 \\times 1.50 = 2.50$ m.'
      ],
      a: 'About 36.5 % MAC, 2.50 m aft of the datum (real limits add further margin for the stick-free case).'
    },
    {
      title: 'Finding the neutral point in flight',
      q: 'Flight tests give the gradient of elevator angle with lift coefficient, $d\\delta_e/dC_L$, as −6.0° per unit $C_L$ with the CG at 20 % MAC and −3.5° with the CG at 30 %. Where is the stick-fixed neutral point?',
      steps: [
        'The gradient changes by $2.5°$ per 10 % of MAC, i.e. by 0.25° per per cent.',
        'It reaches zero $3.5/0.25 = 14$ % further aft than 30 %.'
      ],
      a: 'At about 44 % MAC.'
    }
  ],
  quiz: [
    { q: 'Enlarging the tailplane (or lengthening its arm) moves the neutral point…', choices: ['forward', 'aft', 'nowhere; only the CG moves', 'onto the wing\'s quarter chord'], a: 1,
      why: 'A larger V_H increases the tail term in h_n = h_ac + ηV_H(a_t/a)(1 − dε/dα), moving the neutral point aft and allowing a wider CG range.' },
    { q: 'With the CG exactly at the neutral point, the aircraft…', choices: ['cannot be trimmed', 'stays at any new angle of attack after a disturbance', 'diverges rapidly', 'is maximally stable'], a: 1,
      why: 'C_mα = 0: a change of angle of attack brings no change of moment, so there is no push back and no push away. The aircraft can still be trimmed.' },
    { q: 'The neutral point is at 42 % MAC and the CG at 28 %. What is the static margin, in per cent of the MAC?', answer: 14, unit: '%',
      why: 'K_n = h_n − h = 42 − 28 = 14 % of the MAC.' },
    { q: 'The stick-free neutral point lies aft of the stick-fixed neutral point.', a: false,
      why: 'A floating elevator reduces the tail\'s effectiveness, so the stick-free neutral point is ahead of the stick-fixed one, usually by a few per cent of the MAC.' },
    { q: 'Which change reduces the static margin?', choices: ['moving the CG forward', 'a larger tailplane', 'a steeper downwash gradient at the tail', 'a longer tail arm'], a: 2,
      why: 'More downwash gradient means the tail feels less of each change in α, weakening its contribution and moving the neutral point forward. The other three increase the margin.' }
  ],
  problems: [
    { q: 'An aircraft has a lift slope of 5.2 per radian and its neutral point at 44 % MAC. What CG position gives C_mα = −0.78 per radian? Give per cent MAC.', answer: 29, unit: '%', tol: 0.02,
      steps: ['$h_n - h = 0.78/5.2 = 0.15$.', '$h = 0.44 - 0.15 = 0.29$, i.e. 29 % MAC.'] }
  ],
  applications: ['Setting the certified CG envelope of every aircraft type.', 'Sizing tailplanes in conceptual design from historical tail volume coefficients.', 'Model aircraft design, where free calculators find the neutral point and a 5–15 % margin is chosen.'],
  history: 'The idea of a neutral point, and the flight-test method of finding it from the elevator angle needed to trim, were worked out at the Royal Aircraft Establishment and the NACA in the 1930s and 1940s, as higher speeds made ad hoc balancing inadequate.',
  sim: 'stab-pitch'
},

{
  id: 'trim', parent: 'static-stability', title: 'Trim and the tailplane', level: 2,
  short: 'To trim is to make the pitching moment zero at the angle of attack — and so the speed — the pilot wants. The elevator or an all-moving tail sets that angle; a trim tab or a movable stabiliser takes away the stick force.',
  keywords: ['trim', 'trim tab', 'elevator angle to trim', 'stabiliser trim', 'trimmable horizontal stabiliser', 'THS', 'stick force', 'hinge moment', 'tail download', 'trim drag', 'speed stability', 'servo tab', 'anti-servo tab', 'stabilator'],
  prereq: ['longitudinal-stability', 'lift-equation', 'physics:torque'],
  related: ['neutral-point', 'center-of-gravity', 'control-surfaces', 'level-flight', 'fly-by-wire', 'induced-drag'],
  body: `
An aircraft is **trimmed** when all the moments about its CG add up to zero, so that it holds its attitude with the controls released. In pitch that means $C_m = 0$ — the crossing point of the pitching-moment curve. Trim is not the same as stability: a stable aircraft has exactly one trimmed angle of attack for each elevator setting and returns to it; an unstable one can be trimmed too, but will not stay there by itself.

### One elevator angle, one speed
Deflecting the elevator shifts the whole $C_m$ line up or down without changing its slope much, so it moves the trim angle of attack. At a given weight, each angle of attack fixes a lift coefficient, and the [[lift-equation|lift equation]] turns that into a speed:

$$V = \\sqrt{\\frac{2mg}{\\rho S C_L}}$$

So in steady flight the elevator is, in effect, a **speed selector**: trim nose-up and the aircraft settles at a higher $C_L$ and a lower speed; trim nose-down and it speeds up. Power then decides whether it climbs or descends at that speed. The elevator angle needed is

$$\\delta_{e} = -\\frac{C_{m_0} + C_{m_\\alpha}\\,\\alpha}{C_{m_{\\delta}}}$$

where $C_{m_\\delta}$ — negative, about −1 to −1.5 per radian on a light aircraft — is the elevator's power (a trailing-edge-down deflection is positive and pitches the nose down). A stable aircraft needs more trailing-edge-up elevator the slower it flies — the gradient that flight testers extrapolate to find the [[neutral-point|neutral point]].

### The tail usually pushes down
Take moments about the wing's aerodynamic centre, with the CG a distance $d$ behind it and the tail an arm $l_t$ behind it. The tail must carry

$$L_t = \\frac{m g\\, d + M_{ac}}{l_t}$$

The wing's own moment $M_{ac}$ is nose-down for a cambered wing and $d$ is small, so $L_t$ is usually **negative**: the tailplane pushes down with a few per cent of the weight, and the wing must lift that much more. The extra lift costs [[induced-drag|induced drag]] — **trim drag** — and raises the stall speed. The further forward the CG, the bigger the download: with the CG at the forward limit a light aircraft's wing may carry 7 % more than the weight, near the aft limit only 3–4 %. Some long-range airliners carry fuel in a tail tank partly to cruise with an aft CG and save a per cent or two of fuel.

### Taking the force away
Holding a deflected elevator takes a force, because the air pressing on the surface makes a **hinge moment**. A **trim tab** — a small hinged strip on the elevator's trailing edge — is set the opposite way to the elevator, so that its small force balances the elevator's hinge moment and the stick force falls to zero at the chosen speed. Relatives: a **servo tab** is linked to move automatically and help the pilot; an **anti-servo tab** on an all-moving tail (a stabilator) moves the same way as the surface to add feel. Airliners trim by moving the whole horizontal stabiliser — a **trimmable horizontal stabiliser**, driven by a jackscrew — which gives a large trim range while leaving the full elevator travel for manoeuvring. [[fly-by-wire|Fly-by-wire]] aircraft trim themselves.

> [!warn] Trim settings for takeoff and landing depend on mass and CG and come from the aircraft's approved manuals; a mis-set stabiliser changes the rotation forces markedly. The numbers on this page are illustrations.
`,
  ideas: [
    'Trim means zero pitching moment about the CG: C_m = 0.',
    'For a stable aircraft each elevator (or trim) setting gives one angle of attack, one lift coefficient and, at a given weight, one speed.',
    'The elevator angle to trim is δ_e = −(C_m0 + C_mα α)/C_mδ; its gradient with C_L measures the static margin.',
    'The tail of a conventional aircraft usually pushes down; the wing lifts the weight plus that download, which costs trim drag.',
    'Trim tabs and movable stabilisers remove the stick force without using up elevator travel.'
  ],
  pitfalls: [
    'The tailplane of a conventional aircraft lifts upward in cruise — Usually it pushes down, because the CG lies close to the wing\'s aerodynamic centre and the cambered wing pitches nose-down. Only with a far-aft CG does the tail share the lift.',
    'Trimming nose-up makes the aircraft climb — It makes a stable aircraft fly slower. Whether it climbs depends on power: at the same power the lower speed may give a small climb, but the elevator sets the speed, not the height.',
    'A trim tab moves in the same direction as the elevator — A trim tab is deflected opposite to the elevator so that its small force holds the elevator where it is. (Anti-servo tabs on stabilators are the exception, and are there to add feel, not remove it.)'
  ],
  formulas: [
    {
      name: 'Elevator angle to trim',
      expr: 'de = -(Cm0 + Cma*alpha)/Cmde', tex: '\\delta_{e} = -\\frac{C_{m_0} + C_{m_\\alpha}\\,\\alpha}{C_{m_{\\delta}}}',
      vars: {
        de: { name: 'elevator angle (trailing edge down positive)', q: 'angle', unit: '°', min: -30, max: 30, signed: true, tex: '\\delta_{e}' },
        Cm0: { name: 'moment coefficient at zero α with the elevator neutral', value: 0.05, signed: true, tex: 'C_{m_0}' },
        Cma: { name: 'pitch stiffness C_mα (per radian)', value: -0.8, signed: true, tex: 'C_{m_\\alpha}' },
        alpha: { name: 'angle of attack to trim at', q: 'angle', unit: '°', value: 6, min: -5, max: 20, signed: true, tex: '\\alpha' },
        Cmde: { name: 'elevator power C_mδ (per radian)', value: -1.2, signed: true, tex: 'C_{m_{\\delta}}' }
      },
      note: 'A negative result means trailing edge up. As the trim angle of attack rises (slower flight), a stable aircraft needs more trailing-edge-up elevator.',
      practice: { unknowns: ['de', 'alpha'] },
      stories: {
        de: 'An aircraft with C_m0 = {Cm0}, C_mα = {Cma} and elevator power {Cmde} (both per radian) is to be trimmed at {alpha}. What elevator angle is needed?',
        alpha: 'An aircraft with C_m0 = {Cm0}, C_mα = {Cma} and elevator power {Cmde} per radian has its elevator at {de}. At what angle of attack is it trimmed?'
      }
    },
    {
      name: 'Tail load for trim',
      expr: 'Lt = (m*g*d + Mac)/lt', tex: 'L_t = \\frac{m g\\, d + M_{ac}}{l_t}',
      vars: {
        Lt: { name: 'tail lift (up positive)', q: 'force', unit: 'N', signed: true, tex: 'L_t' },
        m: { name: 'aircraft mass', q: 'mass', unit: 'kg', value: 1100, tex: 'm' },
        g: { const: 'g' },
        d: { name: 'CG distance behind the wing aerodynamic centre', q: 'length', unit: 'm', value: 0.075, signed: true, tex: 'd' },
        Mac: { name: 'wing moment about its aerodynamic centre (nose-up positive)', q: 'torque', unit: 'N·m', value: -2680, signed: true, tex: 'M_{ac}' },
        lt: { name: 'tail arm from the wing aerodynamic centre', q: 'length', unit: 'm', value: 4.6, tex: 'l_t' }
      },
      note: 'Moments about the wing\'s aerodynamic centre in steady level flight; the wing then carries the weight minus L_t. M_ac = C_m,ac qSc̄ (−2680 N·m is C_m,ac = −0.05 at 60 m/s on a 16.2 m² wing with a 1.5 m chord).',
      practice: { unknowns: ['Lt', 'd'] },
      stories: {
        Lt: 'An aircraft of {m} has its CG {d} behind the wing\'s aerodynamic centre; the wing\'s moment is {Mac} and the tail sits {lt} behind. What tail load trims it?',
        d: 'An aircraft of {m} with a wing moment of {Mac} and a tail arm of {lt} trims with a tail load of {Lt}. Where is the CG relative to the wing\'s aerodynamic centre?'
      }
    },
    {
      name: 'Trimmed speed from the trimmed lift coefficient',
      expr: 'V = sqrt(2*m*g/(rho*S*CL))', tex: 'V = \\sqrt{\\dfrac{2 m g}{\\rho S C_L}}',
      vars: {
        V: { name: 'trimmed airspeed (true)', q: 'speed', unit: 'kt', tex: 'V' },
        m: { name: 'aircraft mass', q: 'mass', unit: 'kg', value: 1100, tex: 'm' },
        g: { const: 'g' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        S: { name: 'wing area', q: 'area', unit: 'm²', value: 16.2, tex: 'S' },
        CL: { name: 'trimmed lift coefficient', value: 0.5, min: 0.05, max: 3, tex: 'C_L' }
      },
      note: 'Level flight, lift = weight. Each trim setting fixes C_L, so the speed follows.',
      stories: { V: 'An aircraft of {m} with {S} of wing is trimmed at C_L = {CL}. At what speed does it fly level in air of density {rho}?' }
    }
  ],
  examples: [
    {
      title: 'Elevator for slow and fast flight',
      q: 'An aircraft has $C_{m_0} = 0.05$, $C_{m_\\alpha} = -0.8$ and $C_{m_\\delta} = -1.2$ (per radian). What elevator angle trims it at α = 6° (slow) and at α = 2° (fast)?',
      steps: [
        'At 6°: $C_{m_0} + C_{m_\\alpha}\\alpha = 0.05 - 0.8 \\times 0.1047 = -0.0338$, so $\\delta_e = -(-0.0338)/(-1.2) = -0.0281$ rad = −1.6° (trailing edge up).',
        'At 2°: $0.05 - 0.8 \\times 0.0349 = +0.0221$, so $\\delta_e = -0.0221/(-1.2) = +0.0184$ rad = +1.1° (trailing edge down).'
      ],
      a: 'About −1.6° slow and +1.1° fast: the slower the speed, the more trailing-edge-up elevator a stable aircraft needs.'
    },
    {
      title: 'Tail download at forward and aft CG',
      q: 'An 1100 kg aircraft at 60 m/s has a wing moment $M_{ac} = -2680$ N·m and a tail arm of 4.6 m. Find the tail load with the CG 7.5 cm behind the wing\'s aerodynamic centre, and 7.5 cm ahead of it.',
      steps: [
        'Weight: $1100 \\times 9.81 = 10\\,790$ N; $W d = \\pm 809$ N·m.',
        'CG aft: $L_t = (809 - 2680)/4.6 = -407$ N — a download of 3.8 % of the weight.',
        'CG forward: $L_t = (-809 - 2680)/4.6 = -758$ N — 7.0 % of the weight.',
        'The wing lifts 11 200 N or 11 550 N respectively; the stall speed with the forward CG is about $\\sqrt{11\\,550/11\\,200} - 1 \\approx 1.5$ % higher.'
      ],
      a: 'About 410 N down with the CG aft, 760 N down with it forward: more trim drag and a slightly higher stall speed at the forward limit.'
    }
  ],
  quiz: [
    { q: 'To trim out a steady nose-down stick force, a trim tab on the elevator is moved…', choices: ['in the same direction as the elevator', 'opposite to the elevator', 'to its neutral position', 'up and down alternately'], a: 1,
      why: 'The tab\'s small aerodynamic force on its long lever about the hinge holds the elevator deflected; for that it must be deflected the other way.' },
    { q: 'With the CG at its forward limit, which phase of flight is most likely to run out of elevator?', choices: ['cruise at high speed', 'the landing flare with flaps down', 'a descent at idle', 'a turn at cruise speed'], a: 1,
      why: 'The flare needs a high lift coefficient at low speed, flaps add a nose-down moment and ground effect reduces the tail\'s downwash — all needing more up-elevator, which is scarcest when the CG is far forward.' },
    { q: 'A 1000 kg aircraft has its CG 0.05 m behind the wing aerodynamic centre, a wing moment of −2000 N·m and a tail arm of 5 m. What is the tail load (up positive), in newtons?', answer: -302, unit: 'N',
      why: 'L_t = (m g d + M_ac)/l_t = (1000 × 9.81 × 0.05 − 2000)/5 = (490 − 2000)/5 = −302 N: a download.' },
    { q: 'In steady level flight the tailplane of a conventional aircraft always lifts upward.', a: false,
      why: 'Usually it pushes down, to balance the nose-down moment of the cambered wing and a CG close to the wing\'s aerodynamic centre.' },
    { q: 'A stable aircraft flying hands-off is trimmed further nose-up. After the transient, it will…', choices: ['climb steadily at the same speed', 'settle at a lower speed', 'settle at a higher speed', 'keep pitching up until it stalls'], a: 1,
      why: 'The trim change moves the trim point to a higher angle of attack, i.e. a higher C_L, which at the same weight means a lower speed.' }
  ],
  problems: [
    { q: 'An aircraft (C_m0 = 0.04, C_mα = −0.7, C_mδ = −1.1, per radian) has its elevator at −2°. At what angle of attack is it trimmed, in degrees?', answer: 6.4, unit: '°', tol: 0.03,
      hint: 'Set C_m0 + C_mα α + C_mδ δ = 0 and solve for α.',
      steps: ['$C_{m_\\delta}\\delta = -1.1 \\times (-0.0349) = +0.0384$.', '$\\alpha = (0.04 + 0.0384)/0.7 = 0.112$ rad = 6.4°.'] }
  ],
  applications: ['Electric pitch trim and autopilot trim servos in light aircraft.', 'Trimmable horizontal stabilisers of airliners, moved by jackscrews during every flight.', 'Fuel transfer to tail tanks to reduce trim drag in cruise.', 'Hand-launched gliders, trimmed by bending a tab on the tailplane.'],
  sim: 'stab-pitch'
},

{
  id: 'directional-stability', parent: 'static-stability', title: 'Directional stability', level: 2,
  short: 'Directional, or weathercock, stability is an aircraft\'s tendency to turn its nose into the relative wind when it sideslips. It comes mostly from the fin and is measured by the yawing-moment slope C_nβ > 0.',
  keywords: ['directional stability', 'weathercock stability', 'yaw stability', 'fin', 'vertical tail', 'vertical stabiliser', 'rudder', 'sideslip', 'Cn beta', 'Cnβ', 'fin volume coefficient', 'dorsal fin', 'ventral fin', 'engine failure', 'minimum control speed', 'VMC'],
  prereq: ['aircraft-axes', 'longitudinal-stability', 'lift-curve'],
  related: ['lateral-stability', 'dutch-roll', 'control-surfaces', 'spins', 'propellers', 'supersonic-airfoils'],
  body: `
A weathercock swings to face the wind because it has more side area behind its pivot than in front. An aircraft has the same instinct for the same reason: its **fin** (vertical stabiliser) sits far behind the CG. When the aircraft sideslips, the fin meets the air at an angle, makes a sideways lift, and that force on its long arm yaws the nose back into the relative wind. That is **directional** or **weathercock stability**.

### Sign and size
With the sideslip β positive when the air comes from the right, a stable aircraft makes a positive (nose-right) yawing moment, so

$$C_{n_\\beta} = \\frac{\\partial C_n}{\\partial \\beta} > 0$$

Typical values are 0.05–0.15 per radian, roughly 0.001–0.0025 per degree. The moment grows with dynamic pressure: $N = C_{n_\\beta}\\,\\beta\\,qSb$.

### Who contributes
- **The fin** stabilises. Its power is measured by the **vertical tail volume coefficient** $V_V = S_v l_v/(S b)$: about 0.02 for sailplanes, 0.04 for light singles, 0.07 for light twins and 0.09 for jet transports.
- **The fuselage** destabilises. A long nose and a propeller in front make a body that, like an arrow without feathers, would rather turn broadside.
- **Sweepback** adds a little stability; the wing's other contributions are small.

A useful estimate is $C_{n_\\beta} \\approx \\eta_v V_V a_v + C_{n,f}$, where $a_v$ is the fin's lift slope — about 2.5–3.5 per radian, because a fin is a wing of low aspect ratio — and $C_{n,f}$ the negative fuselage term.

### What sizes a fin
On a single-engine aircraft the fin is sized mostly by stability and crosswind landings. On a twin the hardest case is an engine failure at low speed: the live engine's thrust on its arm makes a yawing moment $T y_e$, and the fin and rudder must balance it. The rudder's force falls with $V^2$, so there is a speed below which even full rudder is not enough — the **minimum control speed** $V_{MC}$. On twin-engine airliners this case sets the size of the fin.

### When the fin runs out
At large sideslip a fin stalls like any wing; a **dorsal fin**, the long fillet ahead of it, sheds a vortex that delays the stall. At high angle of attack the fin can sit in the wake of the wing and fuselage, which is why many fighters have **ventral fins** or twin fins set outboard. At supersonic speed a fin's lift slope falls roughly as $1/\\sqrt{M^2 - 1}$, so the fast aircraft of the 1950s needed ever larger fins; the X-15 rocket aircraft used a thick wedge-shaped fin to stay stable near Mach 6.

> [!tip] Directional stability points the nose into the *relative wind*, not at a compass heading. A taxiing aircraft weathercocks into a crosswind; in the air a disturbed aircraft yaws back to zero sideslip, whatever its heading is by then.

How much directional stability is right depends on the [[lateral-stability|dihedral effect]] too: a big fin with little dihedral effect gives spiral divergence, a small fin with a lot of it a poorly damped [[dutch-roll|Dutch roll]].

> [!warn] Engine-failure handling and the minimum control speeds of a real aircraft come from its approved flight manual and training; the numbers here are illustrative.
`,
  ideas: [
    'Directional stability turns the nose into the relative wind after a sideslip: C_nβ > 0.',
    'The fin provides it, measured by the vertical tail volume V_V = S_v l_v/(S b); the fuselage and a propeller ahead of the CG oppose it.',
    'The yawing moment from sideslip grows with dynamic pressure: N = C_nβ β qSb.',
    'On multi-engine aircraft the fin and rudder are often sized by engine failure at low speed, which defines the minimum control speed.',
    'Dorsal and ventral fins keep the fin effective at large sideslip and high angle of attack.'
  ],
  pitfalls: [
    'Directional stability keeps the aircraft on its compass heading — It keeps the nose pointed into the relative wind. After a gust the aircraft settles at zero sideslip on whatever heading it has reached; holding a heading is the pilot\'s or the autopilot\'s job.',
    'The rudder is what makes the aircraft directionally stable — Stability comes from the fixed fin; the rudder is a control. With the rudder free to float, stability is slightly less than with it held.',
    'More fin is always better — Too much directional stability relative to the dihedral effect makes the aircraft spirally unstable, and a big fin adds weight and drag.'
  ],
  formulas: [
    {
      name: 'Vertical tail volume coefficient',
      expr: 'VV = Sv*lv/(S*b)', tex: 'V_V = \\frac{S_v\\, l_v}{S\\, b}',
      vars: {
        VV: { name: 'vertical tail volume coefficient', tex: 'V_V' },
        Sv: { name: 'fin area', q: 'area', unit: 'm²', value: 1.6, tex: 'S_v' },
        lv: { name: 'fin arm (CG to fin aerodynamic centre)', q: 'length', unit: 'm', value: 4.8, tex: 'l_v' },
        S: { name: 'wing area', q: 'area', unit: 'm²', value: 16.2, tex: 'S' },
        b: { name: 'wingspan', q: 'length', unit: 'm', value: 11.0, tex: 'b' }
      },
      practice: { unknowns: ['VV', 'Sv'] },
      stories: {
        VV: 'A fin of {Sv} sits {lv} behind the CG of an aircraft with {S} of wing and a span of {b}. What is its vertical tail volume coefficient?',
        Sv: 'A designer wants V_V = {VV} with a fin arm of {lv} on a wing of {S} and span {b}. How large must the fin be?'
      }
    },
    {
      name: 'Weathercock stability estimate',
      expr: 'Cnb = eta*VV*av + Cnf', tex: 'C_{n_\\beta} = \\eta_v\\,V_V\\,a_v + C_{n,f}',
      vars: {
        Cnb: { name: 'directional stability C_nβ (per radian)', signed: true, tex: 'C_{n_\\beta}' },
        eta: { name: 'fin dynamic-pressure ratio', value: 0.9, min: 0.5, max: 1.2, tex: '\\eta_v' },
        VV: { name: 'vertical tail volume coefficient', value: 0.043, tex: 'V_V' },
        av: { name: 'fin lift slope (per radian)', value: 3.0, tex: 'a_v' },
        Cnf: { name: 'fuselage contribution (per radian, negative)', value: -0.05, signed: true, tex: 'C_{n,f}' }
      },
      note: 'Leaves out sidewash at the fin and the small wing terms. Stable when C_nβ > 0.',
      practice: { unknowns: ['Cnb', 'VV'] },
      stories: {
        Cnb: 'A fin of volume coefficient {VV} and lift slope {av} per radian works at η = {eta}; the fuselage contributes {Cnf}. What is the aircraft\'s C_nβ?',
        VV: 'With a fin lift slope of {av}, η = {eta} and a fuselage term of {Cnf}, what vertical tail volume gives C_nβ = {Cnb}?'
      }
    },
    {
      name: 'Yawing moment from sideslip',
      expr: 'N = Cnb*beta*0.5*rho*V^2*S*b', tex: 'N = C_{n_\\beta}\\,\\beta\\,\\tfrac{1}{2}\\rho V^2 S b',
      vars: {
        N: { name: 'yawing moment (nose-right positive)', q: 'torque', unit: 'N·m', signed: true, tex: 'N' },
        Cnb: { name: 'directional stability C_nβ (per radian)', value: 0.066, signed: true, tex: 'C_{n_\\beta}' },
        beta: { name: 'sideslip angle', q: 'angle', unit: '°', value: 5, min: -30, max: 30, signed: true, tex: '\\beta' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'true airspeed', q: 'speed', unit: 'm/s', value: 50, tex: 'V' },
        S: { name: 'wing area', q: 'area', unit: 'm²', value: 16.2, tex: 'S' },
        b: { name: 'wingspan', q: 'length', unit: 'm', value: 11.0, tex: 'b' }
      },
      stories: { N: 'An aircraft with C_nβ = {Cnb} per radian ({S} of wing, span {b}) sideslips by {beta} at {V} in air of density {rho}. What yawing moment brings its nose back?' }
    },
    {
      name: 'Rudder needed with one engine out',
      expr: 'dr = T*ye/(0.5*rho*V^2*S*b*Cndr)', tex: '\\delta_r = \\frac{T\\, y_e}{\\tfrac{1}{2}\\rho V^2 S b\\, C_{n_{\\delta r}}}',
      vars: {
        dr: { name: 'rudder deflection', q: 'angle', unit: '°', min: 0, max: 40, tex: '\\delta_r' },
        T: { name: 'thrust of the live engine', q: 'force', unit: 'N', value: 3000, tex: 'T' },
        ye: { name: 'engine distance from the centreline', q: 'length', unit: 'm', value: 1.8, tex: 'y_e' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'airspeed', q: 'speed', unit: 'm/s', value: 45, tex: 'V' },
        S: { name: 'wing area', q: 'area', unit: 'm²', value: 17, tex: 'S' },
        b: { name: 'wingspan', q: 'length', unit: 'm', value: 11.6, tex: 'b' },
        Cndr: { name: 'rudder power, magnitude (per radian)', value: 0.08, tex: 'C_{n_{\\delta r}}' }
      },
      note: 'Straight flight, wings level, zero sideslip; drag of the dead engine and the bank a pilot would use are ignored. Setting δ_r to the maximum rudder and solving for V gives a rough minimum control speed.',
      practice: { unknowns: ['dr', 'V'] },
      stories: {
        dr: 'A light twin ({S} of wing, span {b}, rudder power {Cndr} per radian) flies at {V} in air of density {rho} with one engine giving {T} at {ye} from the centreline. How much rudder holds it straight?',
        V: 'The same twin has {dr} of rudder available. Below what speed can it no longer hold straight flight with {T} of thrust {ye} off the centreline?'
      }
    }
  ],
  examples: [
    {
      title: 'The weathercock of a light aircraft',
      q: 'A light aircraft has a 1.6 m² fin 4.8 m behind the CG, a 16.2 m² wing of 11.0 m span, a fin lift slope of 3.0 per radian, η = 0.9 and a fuselage term of −0.05. Find $V_V$, $C_{n_\\beta}$, and the yawing moment at 50 m/s with 5° of sideslip at sea level.',
      steps: [
        '$V_V = 1.6 \\times 4.8/(16.2 \\times 11.0) = 7.68/178.2 = 0.043$.',
        '$C_{n_\\beta} = 0.9 \\times 0.043 \\times 3.0 - 0.05 = 0.116 - 0.05 = 0.066$ per radian.',
        '$qSb = 1531 \\times 16.2 \\times 11.0 = 272\\,900$ N·m; $N = 0.066 \\times 0.0873 \\times 272\\,900 = 1570$ N·m.'
      ],
      a: 'V_V ≈ 0.043, C_nβ ≈ 0.066 per radian, and about 1.6 kN·m of restoring yaw moment — the fuselage cancels almost half the fin\'s contribution.'
    },
    {
      title: 'A rough minimum control speed',
      q: 'A light twin (17 m² wing, 11.6 m span) loses an engine; the other gives 3000 N at 1.8 m from the centreline. The rudder power is 0.08 per radian and the rudder travel 25°. Estimate the speed below which the rudder cannot hold it straight, at sea level.',
      steps: [
        'Yawing moment to balance: $T y_e = 3000 \\times 1.8 = 5400$ N·m.',
        'Full rudder gives $\\tfrac12\\rho V^2 S b\\,C_{n_{\\delta r}}\\,\\delta_r = 0.6125 \\times 17 \\times 11.6 \\times 0.08 \\times 0.436\\,V^2 = 4.22\\,V^2$.',
        '$V = \\sqrt{5400/4.22} = 35.8$ m/s ≈ 70 kt.'
      ],
      a: 'About 36 m/s (70 kt) — in the range of real light twins; certified values include bank, drag and margins.'
    }
  ],
  quiz: [
    { q: 'For a directionally stable aircraft, the yawing-moment slope C_nβ is…', choices: ['positive', 'negative', 'zero', 'positive only at high speed'], a: 0,
      why: 'With β positive for air from the right, a stable aircraft yaws its nose right (positive N) to face the wind: C_nβ > 0.' },
    { q: 'Why do many aircraft have a dorsal fin — a long fillet in front of the fin?', choices: ['to hold fuel', 'to keep the fin working at large sideslip angles', 'to reduce drag in cruise', 'to add dihedral effect'], a: 1,
      why: 'The dorsal fin makes a vortex over the fin at large sideslip, delaying the fin\'s stall and keeping directional stability when it is needed most.' },
    { q: 'Which of these reduces directional stability?', choices: ['a larger fin', 'a longer tail arm', 'a longer nose and a propeller far ahead of the CG', 'sweepback'], a: 2,
      why: 'Side area ahead of the CG, including a propeller in front, makes a destabilising yawing moment in sideslip. The other three add stability.' },
    { q: 'A strongly directionally stable aircraft will return to its original compass heading after a gust.', a: false,
      why: 'It returns to zero sideslip, pointing into the relative wind. The heading it ends on depends on the whole disturbed motion; nothing in the aerodynamics remembers the old heading.' },
    { q: 'A fin of 2.0 m² sits 5.0 m behind the CG of an aircraft with 18 m² of wing and 11 m span. What is its vertical tail volume coefficient?', answer: 0.0505,
      why: 'V_V = S_v l_v/(S b) = 2.0 × 5.0/(18 × 11) = 10/198 = 0.0505.' }
  ],
  applications: ['Fin and rudder sizing for engine-out control on multi-engine aircraft.', 'Dorsal fins, ventral fins and strakes added to aircraft that met directional problems in testing.', 'Weathervanes, wind socks and the feathers of arrows and darts.'],
  history: 'The early supersonic fighters of the 1950s ran into directional instability at high Mach numbers and high roll rates; several types had their fins enlarged after test-flight accidents, and the problem helped launch the study of roll-coupling.',
  sim: 'stab-lateral'
},

{
  id: 'lateral-stability', parent: 'static-stability', title: 'Lateral stability and dihedral effect', level: 2,
  short: 'A banked aircraft slips sideways towards its low wing, and the dihedral effect — from wing dihedral, a high wing or sweepback — turns that sideslip into a rolling moment that raises the low wing: C_lβ < 0.',
  keywords: ['lateral stability', 'roll stability', 'dihedral', 'dihedral effect', 'anhedral', 'Cl beta', 'Clβ', 'sideslip', 'high wing', 'low wing', 'sweepback', 'pendulum fallacy', 'rolling moment', 'spiral stability'],
  prereq: ['directional-stability', 'aircraft-axes', 'lift-curve', 'sweep'],
  related: ['dutch-roll', 'control-surfaces', 'turning-flight', 'wing-planform', 'spins'],
  body: `
Bank an aircraft a few degrees and let go. Nothing about the bank itself pushes it back: the lift is still symmetric, and there is no "spring" in roll the way there is in pitch. What happens instead is indirect. The tilted lift has a sideways component that nothing balances, so the aircraft begins to **slip sideways towards the low wing**. The relative wind now comes from that side — a sideslip — and it is the aircraft's response to sideslip that decides whether the wings come back level. That response is the **dihedral effect**. It is stabilising when a sideslip to the right produces a rolling moment to the left:

$$C_{l_\\beta} = \\frac{\\partial C_l}{\\partial \\beta} < 0$$

### Geometric dihedral
Tilt each wing up from root to tip by the dihedral angle Γ. In a sideslip, the wing on the windward side meets part of the sideways flow from below, which raises its angle of attack by about βΓ; the other wing's falls by the same amount. The windward wing — the low one in a slip — lifts more and rolls the aircraft level. For a straight, untapered wing, strip theory gives

$$C_{l_\\beta} \\approx -\\frac{a\\,\\Gamma}{4}$$

per radian of sideslip; tapering the wing moves area inboard and cuts this to roughly $a\\Gamma/6$. Five degrees of dihedral on a wing with $a = 5$ per radian gives about −0.1 per radian, a typical value for a whole light aircraft.

### Other sources of dihedral effect
- **Wing position.** In a sideslip the flow around the fuselage rises past a high wing on the windward side and drops past it on the lee side, which acts like extra dihedral; a low wing gets the opposite. A high wing is worth one or two degrees of dihedral, which is why high-wing aircraft need little geometric dihedral and low-wing ones more.
- **Sweepback.** In a sideslip the windward swept wing sees more of the flow at right angles to its leading edge and lifts more. The effect grows with the lift coefficient and can be large: swept high-wing transports have so much that they use **anhedral** (drooping wings) to reduce it.
- **The fin**, standing above the roll axis, adds a little: its sideways lift in a slip rolls the aircraft away from the slip.

| Configuration | Typical geometric dihedral |
|---|---|
| Low-wing light aircraft | 5–7° |
| High-wing light aircraft | 1–2° |
| Sailplane | 2–4° |
| Swept low-wing airliner | 5–7° |
| Swept high-wing transport | −3 to −5° (anhedral) |

### How much is enough
With too little dihedral effect the aircraft is **spirally unstable**: a small bank grows slowly into a steepening, descending turn. With too much it rocks sharply in every gust, and the yaw-and-roll oscillation called the [[dutch-roll|Dutch roll]] becomes poorly damped. The designer balances $C_{l_\\beta}$ against the [[directional-stability|directional stability]] $C_{n_\\beta}$. Dihedral effect has a useful side: it lets the rudder alone bank an aircraft, which is how many simple models and some early aircraft were steered.

> [!note] The pendulum picture — a fuselage hanging below a high wing swings back like a weight on a string — is not why high wings are stable in roll. Lift and weight both act on the one rigid aircraft, and a bank alone makes no restoring moment about its CG; the real mechanism is the sideslip and the cross-flow around the fuselage.
`,
  ideas: [
    'A bank by itself makes no restoring moment; the aircraft slips towards the low wing, and the reaction to that sideslip levels the wings.',
    'Dihedral effect is measured by C_lβ, which must be negative: a slip to the right rolls the aircraft left.',
    'Geometric dihedral, a high wing and sweepback all add dihedral effect; for a straight wing C_lβ ≈ −aΓ/4.',
    'Swept high-wing transports have so much dihedral effect that they need anhedral.',
    'Too little dihedral effect gives spiral divergence; too much gives a poorly damped Dutch roll.'
  ],
  pitfalls: [
    'A high wing is stable in roll because the fuselage hangs below it like a pendulum — Lift and weight act on one rigid body; a bank makes no pendulum moment about its CG. The high wing\'s stability comes from the cross-flow round the fuselage in a sideslip.',
    'Dihedral rolls the wings level directly as soon as the aircraft banks — Nothing happens until the aircraft sideslips. The dihedral effect acts on sideslip, not on bank angle.',
    'More dihedral always makes an aircraft safer — Too much dihedral effect gives a lively, poorly damped Dutch roll and a strong roll in every side gust; designers aim for a balance with the fin.'
  ],
  formulas: [
    {
      name: 'Dihedral effect of a straight wing',
      expr: 'Clb = -a*Gamma/4', tex: 'C_{l_\\beta} = -\\frac{a\\,\\Gamma}{4}',
      vars: {
        Clb: { name: 'dihedral effect C_lβ (per radian)', signed: true, tex: 'C_{l_\\beta}' },
        a: { name: 'wing lift slope (per radian)', value: 5.0, tex: 'a' },
        Gamma: { name: 'dihedral angle (anhedral negative)', q: 'angle', unit: '°', value: 5, min: -15, max: 15, signed: true, tex: '\\Gamma' }
      },
      note: 'Strip theory for an untapered, unswept wing; a tapered wing gives about two-thirds of this. The fuselage, the fin and sweep add their own terms.',
      stories: {
        Clb: 'A straight wing with a lift slope of {a} per radian has {Gamma} of dihedral. What is its dihedral effect?',
        Gamma: 'How much dihedral gives a straight wing with a lift slope of {a} per radian a dihedral effect of {Clb}?'
      }
    },
    {
      name: 'Rolling moment from sideslip',
      expr: 'Lr = Clb*beta*0.5*rho*V^2*S*b', tex: '\\mathcal{L} = C_{l_\\beta}\\,\\beta\\,\\tfrac{1}{2}\\rho V^2 S b',
      vars: {
        Lr: { name: 'rolling moment (right wing down positive)', q: 'torque', unit: 'N·m', signed: true, tex: '\\mathcal{L}' },
        Clb: { name: 'dihedral effect C_lβ (per radian)', value: -0.1, signed: true, tex: 'C_{l_\\beta}' },
        beta: { name: 'sideslip angle', q: 'angle', unit: '°', value: 3, min: -30, max: 30, signed: true, tex: '\\beta' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'true airspeed', q: 'speed', unit: 'm/s', value: 50, tex: 'V' },
        S: { name: 'wing area', q: 'area', unit: 'm²', value: 16.2, tex: 'S' },
        b: { name: 'wingspan', q: 'length', unit: 'm', value: 11.0, tex: 'b' }
      },
      stories: { Lr: 'An aircraft with C_lβ = {Clb} per radian ({S} of wing, span {b}) sideslips by {beta} at {V} in air of density {rho}. What rolling moment results?' }
    },
    {
      name: 'How fast sideslip builds in an uncoordinated bank',
      expr: 'bd = g*sin(phi)/V', tex: '\\dot{\\beta} = \\frac{g \\sin\\phi}{V}',
      vars: {
        bd: { name: 'rate of change of sideslip', q: 'angvel', unit: '°/s', signed: true, tex: '\\dot{\\beta}' },
        g: { const: 'g' },
        phi: { name: 'bank angle', q: 'angle', unit: '°', value: 10, min: -80, max: 80, signed: true, tex: '\\phi' },
        V: { name: 'true airspeed', q: 'speed', unit: 'm/s', value: 50, tex: 'V' }
      },
      note: 'The initial rate, before the aircraft yaws or rolls in response; the unbalanced side component of lift, g sin φ per unit mass, turns the velocity sideways.',
      stories: { bd: 'An aircraft at {V} is banked {phi} without any turn being made. How fast does its sideslip begin to build?' }
    }
  ],
  examples: [
    {
      title: 'Rolling moment of a dihedral wing',
      q: 'A straight wing ($a = 5.0$ per radian, 16.2 m², 11.0 m span) has 5° of dihedral. At 50 m/s at sea level it sideslips by 3°. Find $C_{l_\\beta}$, the rolling moment and the initial roll acceleration if $I_{xx} = 1285$ kg·m².',
      steps: [
        '$C_{l_\\beta} = -5.0 \\times 0.0873/4 = -0.109$ per radian.',
        '$\\mathcal{L} = -0.109 \\times 0.0524 \\times 1531 \\times 16.2 \\times 11.0 = -1560$ N·m (rolling away from the slip).',
        '$\\dot p = \\mathcal{L}/I_{xx} = -1560/1285 = -1.21$ rad/s².'
      ],
      a: 'C_lβ ≈ −0.11 per radian; about 1.6 kN·m rolls the low wing up, at an initial 1.2 rad/s² (70 °/s²).'
    },
    {
      title: 'Slipping in a bank',
      q: 'A glider at 40 m/s is banked 15° while the pilot keeps the rudder central and the nose does not follow. How quickly does the sideslip build at first?',
      steps: [
        '$\\dot\\beta = g\\sin\\phi/V = 9.81 \\times 0.259/40 = 0.0635$ rad/s.',
        'That is 3.6 °/s: within a second or two there are several degrees of sideslip for the dihedral effect and the fin to act on.'
      ],
      a: 'About 3.6 degrees per second — slower flight slips faster.'
    }
  ],
  quiz: [
    { q: 'An aircraft with dihedral sideslips to the right (the air comes from the right). Its dihedral effect rolls it…', choices: ['right wing down', 'left wing down (right wing up)', 'not at all', 'nose up'], a: 1,
      why: 'The right (windward) wing gains angle of attack and lifts more, rolling the aircraft left, away from the slip: C_lβ < 0.' },
    { q: 'Compared with a low-wing aircraft, a high-wing aircraft usually needs…', choices: ['more geometric dihedral', 'less geometric dihedral', 'the same', 'anhedral always'], a: 1,
      why: 'The high wing gains dihedral effect from the cross-flow around the fuselage, worth one or two degrees, so it needs less geometric dihedral.' },
    { q: 'Why do swept high-wing cargo aircraft have anhedral?', choices: ['to lower the engines for maintenance', 'because sweep and a high wing together give too much dihedral effect', 'to improve directional stability', 'to reduce induced drag'], a: 1,
      why: 'Sweepback and the high wing both add dihedral effect; together they would make a lively, poorly damped Dutch roll, so the wings are drooped to reduce it.' },
    { q: 'A high-wing aircraft is stable in roll because its fuselage hangs below the wing like a pendulum.', a: false,
      why: 'Lift and weight act on the same rigid body, so a bank produces no pendulum moment about the CG. The stability comes from the sideslip that follows a bank and the cross-flow around the fuselage.' },
    { q: 'Estimate C_lβ (per radian) for a straight wing with a lift slope of 4.8 per radian and 6° of dihedral.', answer: -0.126,
      why: 'C_lβ = −aΓ/4 = −4.8 × 0.1047/4 = −0.126 per radian.' }
  ],
  applications: ['Free-flight model aircraft and hand-launched gliders, which rely on generous dihedral to stay upright.', 'Rudder-only radio-controlled models, steered through the dihedral effect.', 'Anhedral on swept high-wing transports and on some fighters to tame excessive dihedral effect.'],
  history: 'George Cayley recognised in 1809 that wings tilted up in a shallow V keep a glider upright. The Wright brothers, by contrast, gave their 1903 Flyer a slight droop, finding it easier to handle in the gusty sideways winds at Kitty Hawk — and relied on wing warping to control roll.',
  sim: { id: 'stab-lateral', params: { gam: 0 } }
},

/* ================================================================ CONTROL AND DYNAMICS */

{
  id: 'control-surfaces', parent: 'control-dynamics', title: 'Control surfaces and adverse yaw', level: 1,
  short: 'Elevator, ailerons and rudder change the camber of a tail or wing to make a force on a long arm. The ailerons\' side effect — extra drag on the rising wing pulling the nose the wrong way — is adverse yaw, tamed by differential and Frise ailerons, spoilers and the rudder.',
  keywords: ['control surfaces', 'elevator', 'aileron', 'rudder', 'adverse yaw', 'differential ailerons', 'Frise ailerons', 'spoilers', 'roll spoilers', 'elevons', 'ruddervators', 'flaperons', 'stabilator', 'hinge moment', 'aerodynamic balance', 'mass balance', 'roll rate', 'roll damping', 'coordinated flight', 'slip ball', 'aileron reversal'],
  prereq: ['aircraft-axes', 'lift-curve', 'induced-drag'],
  related: ['trim', 'lateral-stability', 'directional-stability', 'high-lift-devices', 'flutter', 'fly-by-wire', 'dutch-roll'],
  body: `
An aircraft is steered by changing the camber of its lifting surfaces. A hinged rear part deflected downwards curves the section more, adds lift and shifts the [[lift-curve|lift curve]] up; deflected upwards it does the opposite. Mounted on a surface far from the CG, that change of lift becomes a moment, and the moment turns the aircraft about one of its [[aircraft-axes|axes]].

| Surface | Where | Axis | How it moves |
|---|---|---|---|
| Elevator (or all-moving stabilator) | tailplane | pitch | both sides together |
| Ailerons | outer trailing edge of the wing | roll | opposite ways |
| Rudder | fin | yaw | one surface |
| Roll spoilers | top of the wing | roll (and drag) | up on one side |
| Elevons | trailing edge of a delta or flying wing | pitch and roll | mixed |
| Ruddervators | V-tail | pitch and yaw | mixed |

### How much force a hinged surface makes
A control surface covering part of the chord changes its surface's lift coefficient by

$$\\Delta C_L = \\tau\\, a\\, \\delta$$

where δ is the deflection, $a$ the lift slope and τ the **flap effectiveness**: about 0.4 for a surface of 20 % of the chord, 0.55 for 30 %. Deflect a 30 % elevator by 10° on a tail with $a = 4$ per radian and its $C_L$ changes by about 0.38 — at 50 m/s on a 3 m² tail, some 1.7 kN acting 4.6 m behind the CG.

### Rolling and roll rate
The ailerons make a rolling moment, but the aircraft does not keep accelerating: as it rolls, the down-going wing meets the air at a larger angle and the up-going wing at a smaller one, which opposes the roll — **roll damping**, $C_{l_p} < 0$. Within a fraction of a second the two balance at a steady roll rate

$$p = -\\frac{2V\\,C_{l_{\\delta a}}\\,\\delta_a}{b\\,C_{l_p}}$$

The combination $pb/2V$, the helix angle traced by the wingtip, is about 0.07–0.1 at full aileron for most aircraft. Because that number is fixed, **roll rate grows with speed**, and slow flight feels sluggish. At high speed a flexible wing can twist under a deflected aileron and even reverse the roll — **aileron reversal** — which is why airliners switch to inboard ailerons and spoilers when fast.

### Adverse yaw
Roll right with ailerons alone and the nose first swings *left*. Two effects add up:

1. The left aileron goes down, raising the left wing's lift — and its [[induced-drag|induced drag]]. The right aileron goes up and that wing's drag falls. The drag difference yaws the nose left.
2. While rolling, the rising left wing meets the air slightly from above, so its lift tilts backwards; the falling right wing's lift tilts forwards. That also yaws the nose left.

The yaw is towards the rising wing, away from the turn: **adverse yaw**. It is worst at low speed and high lift coefficient, and on long wings — a sailplane needs a lot of rudder with every aileron input. The cures:

- **Differential ailerons**: the up-going aileron moves further than the down-going one (say 20° up, 12° down).
- **Frise ailerons**: the nose of the up-going aileron dips below the wing and adds drag on the descending wing.
- **Roll spoilers**: raised on the down-going wing, they cut its lift *and* add drag on the inside of the turn — favourable (proverse) yaw.
- **The rudder**, used with the ailerons to keep the slip ball centred (*coordinated flight*), or an interconnect or yaw damper doing it automatically.

### Holding the surfaces
A deflected surface makes a **hinge moment**, growing with $V^2$, that the pilot feels as stick force. A set-back hinge or a horn balance reduces it, tabs trim it out (see [[trim]]), and large aircraft use powered controls with artificial feel. Weights ahead of the hinge line (**mass balance**) stop the surface joining with wing bending in [[flutter]].
`,
  ideas: [
    'A control surface changes camber: ΔC_L = τaδ, with the flap effectiveness τ set by the fraction of chord it covers.',
    'Ailerons give a roll rate, not a roll angle: roll damping balances them at p = −2V C_lδa δa/(b C_lp), so roll rate grows with speed.',
    'Adverse yaw swings the nose away from the turn, from the drag of the down-going aileron and the tilt of the lift on the rolling wings.',
    'Differential and Frise ailerons, roll spoilers and coordinated rudder counter adverse yaw.',
    'Hinge moments grow with V²; balance, tabs and powered controls keep stick forces manageable, mass balance prevents flutter.'
  ],
  pitfalls: [
    'The ailerons turn the aircraft — They bank it. The turn comes from the horizontal component of the tilted lift; the rudder\'s job is to keep the nose aligned with the airflow as it does.',
    'Adverse yaw comes only from aileron drag — The tilt of the lift on the rising and falling wings during the roll adds a second adverse yawing moment, which differential ailerons cannot remove.',
    'Full aileron gives the same roll rate at any speed — The helix angle pb/2V is roughly fixed, so the roll rate is proportional to speed: near the stall, full aileron rolls slowly.'
  ],
  formulas: [
    {
      name: 'Lift change from a control surface',
      expr: 'dCL = tau*a*delta', tex: '\\Delta C_L = \\tau\\, a\\, \\delta',
      vars: {
        dCL: { name: 'change of the surface\'s lift coefficient', signed: true, tex: '\\Delta C_L' },
        tau: { name: 'flap effectiveness', value: 0.55, min: 0, max: 1, tex: '\\tau' },
        a: { name: 'lift slope of the surface (per radian)', value: 4.0, tex: 'a' },
        delta: { name: 'control deflection', q: 'angle', unit: '°', value: 10, min: -30, max: 30, signed: true, tex: '\\delta' }
      },
      note: 'τ ≈ 0.4 for a surface of 20 % of the chord, ≈ 0.55 for 30 %, ≈ 0.65 for 40 %; valid for moderate deflections before the flow separates.',
      practice: { unknowns: ['dCL', 'delta'] },
      stories: {
        dCL: 'An elevator with flap effectiveness {tau} on a tail of lift slope {a} per radian is deflected {delta}. How much does the tail\'s lift coefficient change?',
        delta: 'How far must a control surface (effectiveness {tau}, lift slope {a} per radian) be deflected to change the lift coefficient by {dCL}?'
      }
    },
    {
      name: 'Steady roll rate',
      expr: 'p = -2*V*Clda*da/(b*Clp)', tex: 'p = -\\frac{2V\\, C_{l_{\\delta a}}\\,\\delta_a}{b\\, C_{l_p}}',
      vars: {
        p: { name: 'steady roll rate', q: 'angvel', unit: '°/s', signed: true, tex: 'p' },
        V: { name: 'true airspeed', q: 'speed', unit: 'm/s', value: 55, tex: 'V' },
        Clda: { name: 'aileron power C_lδa (per radian)', value: 0.14, tex: 'C_{l_{\\delta a}}' },
        da: { name: 'aileron deflection', q: 'angle', unit: '°', value: 15, min: -30, max: 30, signed: true, tex: '\\delta_a' },
        b: { name: 'wingspan', q: 'length', unit: 'm', value: 11, tex: 'b' },
        Clp: { name: 'roll damping C_lp (per radian, negative)', value: -0.45, min: -2, max: -0.01, signed: true, tex: 'C_{l_p}' }
      },
      note: 'The balance of aileron moment and roll damping, reached within a fraction of a second. Leaves out yaw coupling and wing twist.',
      practice: { unknowns: ['p', 'V', 'da'] },
      stories: {
        p: 'An aircraft of {b} span, with aileron power {Clda} and roll damping {Clp} per radian, flies at {V} with {da} of aileron. What roll rate does it reach?',
        V: 'An aircraft ({b} span, C_lδa = {Clda}, C_lp = {Clp}) rolls at {p} with {da} of aileron. How fast is it flying?',
        da: 'How much aileron gives a roll rate of {p} at {V}, for a span of {b}, C_lδa = {Clda} and C_lp = {Clp}?'
      }
    }
  ],
  examples: [
    {
      title: 'Roll rate at cruise and near the stall',
      q: 'A light aircraft (11 m span, $C_{l_{\\delta a}} = 0.14$, $C_{l_p} = -0.45$ per radian) uses 15° of aileron. Find the steady roll rate at 55 m/s and at 30 m/s, and the time to roll from 30° left to 30° right at the lower speed.',
      steps: [
        'At 55 m/s: $p = 2 \\times 55 \\times 0.14 \\times 0.262/(11 \\times 0.45) = 0.815$ rad/s = 47 °/s; the helix angle is $pb/2V = 0.081$.',
        'At 30 m/s the roll rate scales with speed: $47 \\times 30/55 = 25$ °/s.',
        'Rolling through 60° at 25 °/s takes about 2.4 s, plus a fraction of a second to build up the rate.'
      ],
      a: 'About 47 °/s at 55 m/s but only 25 °/s at 30 m/s — roughly 2.5 s to reverse a 30° bank when slow.'
    },
    {
      title: 'The force of an elevator',
      q: 'A 30 % chord elevator (τ = 0.55) on a 3.0 m² tail with $a = 4.0$ per radian is deflected 10°. At 50 m/s at sea level, what extra tail force results, and what pitching moment on a 4.6 m arm?',
      steps: [
        '$\\Delta C_L = 0.55 \\times 4.0 \\times 0.1745 = 0.384$.',
        '$\\Delta L = 0.384 \\times \\tfrac12 \\times 1.225 \\times 50^2 \\times 3.0 = 1760$ N.',
        '$\\Delta M = 1760 \\times 4.6 = 8100$ N·m.'
      ],
      a: 'About 1.8 kN, giving roughly 8 kN·m of pitching moment.'
    }
  ],
  quiz: [
    { q: 'A pilot rolls to the right using ailerons alone. The nose first swings…', choices: ['right, into the turn', 'left, away from the turn', 'up', 'nowhere'], a: 1,
      why: 'Adverse yaw: the down-going left aileron raises the left wing\'s lift and induced drag, and the rolling motion tilts the rising wing\'s lift backwards. Both yaw the nose left.' },
    { q: 'Differential ailerons move…', choices: ['both ailerons down together', 'the up-going aileron further than the down-going one', 'the down-going aileron further than the up-going one', 'only the aileron on the inside of the turn'], a: 1,
      why: 'Less down-travel means less extra lift and induced drag on the rising wing, and the larger up-travel adds some drag on the other side — both reduce adverse yaw.' },
    { q: 'Roll spoilers raised on the down-going wing produce…', choices: ['adverse yaw, like ailerons', 'favourable (proverse) yaw', 'no yaw at all', 'a pitch-up'], a: 1,
      why: 'The spoiler adds drag on the wing on the inside of the turn, yawing the nose into the turn.' },
    { q: 'Full aileron gives about the same roll rate at every airspeed.', a: false,
      why: 'The steady helix angle pb/2V is roughly constant, so the roll rate is proportional to speed.' },
    { q: 'An aircraft rolls at 47 °/s with full aileron at 55 m/s. Roughly what roll rate does full aileron give at 40 m/s, in °/s?', answer: 34.2, unit: '°/s',
      why: 'p scales with V: 47 × 40/55 = 34 °/s.' }
  ],
  applications: ['Roll spoilers and inboard high-speed ailerons on airliners.', 'Elevons on delta-wing and flying-wing aircraft, and on many drones.', 'V-tail ruddervators on light aircraft and uninhabited aircraft.', 'Mass balance weights on control surfaces to prevent flutter.'],
  history: 'The Wright brothers found adverse yaw in their 1901 and 1902 gliders: warping the wings to roll made the aircraft yaw the wrong way and slip into the ground. Their 1902 fix — a movable rudder linked to the warping — made the first fully controllable aeroplane. Ailerons came into general use in Europe and the USA in 1908–09, and the Frise aileron was devised at the Bristol Aeroplane Company between the wars.',
  sim: 'stab-adverse-yaw'
},

{
  id: 'dynamic-stability', parent: 'control-dynamics', title: 'Dynamic stability', level: 2,
  short: 'Static stability says which way an aircraft starts to move after a disturbance; dynamic stability says whether the motion that follows dies away. An aircraft\'s motion splits into a few natural modes, each with its own period and damping.',
  keywords: ['dynamic stability', 'damping', 'damping ratio', 'natural frequency', 'modes of motion', 'eigenvalues', 'time to half amplitude', 'time to double', 'oscillation', 'divergence', 'subsidence', 'stability derivatives', 'pitch damping', 'yaw damper', 'handling qualities', 'Cooper-Harper'],
  prereq: ['longitudinal-stability', 'physics:damped-oscillations', 'math:damped-oscillator-ode'],
  related: ['phugoid', 'short-period', 'dutch-roll', 'fly-by-wire', 'flight-testing', 'math:eigenvalues'],
  body: `
Static stability tells you which way an aircraft *starts* to move after a disturbance. It does not say what happens next. A statically stable aircraft is like a mass on a spring: pushed aside, it heads back — and may overshoot, swing through and come back again. Whether those swings shrink, persist or grow is **dynamic stability**.

### Five ways a motion can end
| Response after a disturbance | Static | Dynamic |
|---|---|---|
| Returns without overshoot (subsidence) | stable | stable |
| Oscillates with shrinking swings | stable | stable |
| Oscillates with constant swings | stable | neutral |
| Oscillates with growing swings | stable | unstable |
| Moves steadily away (divergence) | unstable | unstable |

### Spring, mass and damper
Linearise the equations of motion about steady flight and each mode behaves like a [[physics:damped-oscillations|damped oscillator]]. In pitch the "spring" is the stiffness $C_{m_\\alpha}$, the "mass" the moment of inertia $I_{yy}$, and the "damper" the pitch damping $C_{m_q}$: when the aircraft pitches nose-up at rate $q$, the tail moves down through the air at $q\\,l_t$, gains an angle of attack of about $q\\,l_t/V$ and pushes back. Each mode obeys

$$\\ddot x + 2\\zeta\\omega_n \\dot x + \\omega_n^2 x = 0$$

with roots $\\lambda = -\\zeta\\omega_n \\pm i\\,\\omega_n\\sqrt{1-\\zeta^2}$ (see [[math:damped-oscillator-ode|the damped-oscillator equation]]). A negative real part means the motion decays; its amplitude halves in

$$t_{1/2} = \\frac{\\ln 2}{\\zeta\\,\\omega_n}$$

and it repeats every $T_d = 2\\pi/(\\omega_n\\sqrt{1-\\zeta^2})$. With a positive real part the same formula gives the **time to double**. Aerodynamic damping comes from forces, which scale with air density: at 11 000 m the air has less than a third of its sea-level density, so every mode is less damped at altitude — the reason jets carry pitch and yaw dampers.

### The natural modes
The linear equations of a rigid aircraft split almost exactly into a longitudinal set and a lateral–directional set. Their [[math:eigenvalues|eigenvalues]] are the natural modes:

| Mode | What moves | Light aircraft | Jet airliner in cruise |
|---|---|---|---|
| [[short-period|Short period]] | α and pitch rate | period 1–2 s, ζ ≈ 0.5–0.8 | 3–5 s, ζ ≈ 0.3–0.6 |
| [[phugoid|Phugoid]] | speed and height | 20–40 s, ζ ≈ 0.05–0.1 | 90–120 s, ζ ≈ 0.02–0.05 |
| Roll subsidence | roll rate | time constant 0.1–0.3 s | 0.5–1 s |
| [[dutch-roll|Spiral]] | bank and heading | 20–100 s to halve or double | minutes |
| [[dutch-roll|Dutch roll]] | yaw with roll | 2–3 s, ζ ≈ 0.1–0.3 | 5–8 s, ζ ≈ 0.05–0.1 without a yaw damper |

The modes separate because their time scales are so different: the short period is over before the speed can change, and the phugoid is so slow that the angle of attack hardly changes during it.

### What pilots want
Handling-qualities standards, such as the US military specification MIL-F-8785C of 1980 and its successors, set bands for each mode: roughly a short-period damping ratio between 0.35 and 1.3, a phugoid that is at least lightly damped, a Dutch roll damping ratio of at least about 0.08, and a spiral that, if it diverges, takes at least about 20 s to double its bank angle. Test pilots grade the result on the ten-point Cooper–Harper scale of 1969, from "excellent" to "control will be lost".
`,
  ideas: [
    'Static stability is the first tendency; dynamic stability is whether the whole motion dies away.',
    'Each mode behaves like a mass–spring–damper: stiffness from C_mα or C_nβ, damping from the rate derivatives C_mq, C_lp, C_nr.',
    'Eigenvalues λ = −ζω_n ± iω_n√(1 − ζ²): the real part sets the time to half (or double), the imaginary part the period.',
    'An aircraft has five classical modes: short period and phugoid (longitudinal); roll subsidence, spiral and Dutch roll (lateral–directional).',
    'Aerodynamic damping weakens with air density, so jets need dampers at altitude.'
  ],
  pitfalls: [
    'A statically stable aircraft is dynamically stable too — Static stability only ensures a restoring tendency. With too little damping the aircraft can oscillate with growing swings.',
    'A dynamically unstable mode makes an aircraft unflyable — A slow divergence, like a spiral that doubles in 30 s, is easily handled by a pilot or autopilot. What matters is how fast the divergence is compared with human reaction.',
    'Damping stays the same at all heights — Aerodynamic damping scales with air density; at cruise altitude the Dutch roll and short period of a jet are much less damped than near the ground.'
  ],
  formulas: [
    {
      name: 'Time to half amplitude',
      expr: 'th = ln(2)/(zeta*wn)', tex: 't_{1/2} = \\frac{\\ln 2}{\\zeta\\,\\omega_n}',
      vars: {
        th: { name: 'time to half amplitude', q: 'time', unit: 's', tex: 't_{1/2}' },
        zeta: { name: 'damping ratio', value: 0.2, min: 0.001, max: 5, tex: '\\zeta' },
        wn: { name: 'undamped natural frequency', q: 'angvel', unit: 'rad/s', value: 3.0, tex: '\\omega_n' }
      },
      note: 'For a divergent mode (negative damping) the same expression with |ζ| gives the time to double.',
      practice: { unknowns: ['th', 'zeta'] },
      stories: {
        th: 'A mode has a damping ratio of {zeta} and a natural frequency of {wn}. How long does it take to halve its amplitude?',
        zeta: 'An oscillation with natural frequency {wn} halves in {th}. What is its damping ratio?'
      }
    },
    {
      name: 'Damped period',
      expr: 'Td = 2*pi/(wn*sqrt(1 - zeta^2))', tex: 'T_d = \\frac{2\\pi}{\\omega_n\\sqrt{1 - \\zeta^2}}',
      vars: {
        Td: { name: 'period of the damped oscillation', q: 'time', unit: 's', tex: 'T_d' },
        wn: { name: 'undamped natural frequency', q: 'angvel', unit: 'rad/s', value: 3.0, tex: '\\omega_n' },
        zeta: { name: 'damping ratio', value: 0.2, min: 0, max: 0.99, tex: '\\zeta' }
      },
      practice: { unknowns: ['Td', 'wn'] },
      stories: {
        Td: 'A Dutch roll has a natural frequency of {wn} and a damping ratio of {zeta}. What period does a pilot see?',
        wn: 'An oscillation with damping ratio {zeta} repeats every {Td}. What is its undamped natural frequency?'
      }
    },
    {
      name: 'Damping ratio from two successive peaks',
      expr: 'zeta = ln(r)/sqrt(4*pi^2 + ln(r)^2)', tex: '\\zeta = \\frac{\\ln r}{\\sqrt{4\\pi^2 + (\\ln r)^2}}',
      vars: {
        zeta: { name: 'damping ratio (negative if growing)', signed: true, tex: '\\zeta' },
        r: { name: 'ratio of one peak to the next, A₁/A₂', value: 1.43, min: 0.01, max: 1000, tex: 'r' }
      },
      note: 'The logarithmic decrement ln r, measured from a flight-test trace of any lightly damped mode.',
      stories: {
        zeta: 'In a flight test two successive peaks of an oscillation have the ratio {r}. What is the damping ratio?',
        r: 'A mode has a damping ratio of {zeta}. By what ratio does each peak exceed the next?'
      }
    }
  ],
  examples: [
    {
      title: 'Damping from a flight-test trace',
      q: 'After a speed disturbance, the airspeed trace of an aircraft peaks at +10 kt and, 30 s later, at +7 kt. Find the damping ratio and the time to half amplitude of this phugoid.',
      steps: [
        '$r = 10/7 = 1.429$, $\\ln r = 0.357$.',
        '$\\zeta = 0.357/\\sqrt{4\\pi^2 + 0.357^2} = 0.357/6.29 = 0.057$.',
        '$\\omega_d = 2\\pi/30 = 0.209$ rad/s ≈ $\\omega_n$; $t_{1/2} = 0.693/(0.057 \\times 0.21) = 58$ s.'
      ],
      a: 'ζ ≈ 0.057, halving in about a minute — a typical lightly damped phugoid.'
    },
    {
      title: 'Counting Dutch-roll cycles',
      q: 'A Dutch roll has $\\omega_n = 2$ rad/s and ζ = 0.1. What is its period, how long does it take to halve, and how many cycles is that?',
      steps: [
        '$T_d = 2\\pi/(2\\sqrt{1 - 0.01}) = 3.16$ s.',
        '$t_{1/2} = 0.693/(0.1 \\times 2) = 3.47$ s.',
        'Cycles to half amplitude: $3.47/3.16 = 1.1$.'
      ],
      a: 'Period 3.2 s, halving in 3.5 s — about one cycle, near the lower limit pilots accept.'
    }
  ],
  quiz: [
    { q: 'An aircraft can be statically stable but dynamically unstable.', a: true,
      why: 'It pushes back after a disturbance but overshoots by more each time, so the oscillation grows: a restoring tendency with negative damping.' },
    { q: 'Which natural mode of an aircraft has the shortest period?', choices: ['the phugoid', 'the short period', 'the spiral', 'the Dutch roll'], a: 1,
      why: 'The short period of a light aircraft lasts 1–2 s. The Dutch roll takes 2–8 s, the phugoid tens of seconds, and the spiral does not oscillate at all.' },
    { q: 'A mode has ζ = 0.5 and ω_n = 4 rad/s. How long does it take to halve its amplitude, in seconds?', answer: 0.347, unit: 's',
      why: 't_1/2 = ln 2/(ζω_n) = 0.693/2 = 0.35 s.' },
    { q: 'An eigenvalue of the linearised equations has a positive real part. The corresponding motion…', choices: ['decays', 'grows', 'oscillates at constant amplitude', 'does not exist'], a: 1,
      why: 'The motion goes as e^{λt}; a positive real part makes it grow — oscillating if λ is complex, steadily if it is real.' },
    { q: 'Why do jet transports carry yaw dampers?', choices: ['to stop spins', 'to damp the Dutch roll, which is weakly damped at high altitude', 'to reduce drag', 'to trim out engine failures'], a: 1,
      why: 'Aerodynamic damping scales with air density; in thin air at cruise altitude the swept-wing Dutch roll is poorly damped, so a yaw damper adds artificial damping.' }
  ],
  applications: ['Specifying handling qualities for new aircraft and checking them in flight test.', 'Designing autopilots and stability augmentation, which move the eigenvalues where pilots want them.', 'Analysing ships, cars and trains, whose modes are found the same way.'],
  history: 'G. H. Bryan and W. E. Williams worked out the small-disturbance theory of aircraft stability in 1903–04, before the first powered flight was widely known; Bryan\'s 1911 book set the notation still used. Leonard Bairstow and colleagues at the National Physical Laboratory measured the derivatives in wind tunnels during the First World War, and the theory entered design practice.',
  sim: ['stab-short-period', 'stab-phugoid']
},

{
  id: 'phugoid', parent: 'control-dynamics', title: 'The phugoid', level: 2,
  short: 'The phugoid is a slow, lightly damped roller-coaster in which an aircraft trades speed for height and back at almost constant angle of attack. Lanchester showed in 1908 that its period is about π√2·V/g — some 0.45 s for every metre per second of speed.',
  keywords: ['phugoid', 'long-period mode', 'Lanchester', 'energy exchange', 'period', 'airspeed oscillation', 'porpoising', 'paper plane', 'damping', 'lift to drag', 'loss of hydraulics', 'propulsion-controlled aircraft', 'wavelength'],
  prereq: ['dynamic-stability', 'lift-equation', 'physics:conservation-of-energy'],
  related: ['short-period', 'energy-management', 'lift-to-drag', 'gliding', 'level-flight', 'physics:simple-harmonic-motion'],
  body: `
Trim a model glider carefully, launch it a little too fast, and it climbs, slows, dips its nose, dives, speeds up and climbs again — a slow roller-coaster that may carry on for several swoops. Full-size aircraft do exactly the same. The motion is the **phugoid**, the long-period longitudinal mode, and it is an exchange of kinetic and potential energy at almost constant angle of attack.

### Why it oscillates
Suppose the aircraft is a little too fast. At the same angle of attack its lift, $\\tfrac12\\rho V^2 S C_L$, is more than the weight, so the flight path curves upward. Climbing, it trades speed for height; the lift falls below the weight and the path curves over into a descent, which trades the height back into speed — and the cycle repeats. The angle of attack hardly changes, because the aircraft's pitch stability keeps the nose pointed along the flight path; what swings is the **speed**, the **height** and the **pitch attitude**, together.

### Lanchester's period
With no drag, energy is conserved: $V^2 + 2gh$ stays constant, so a height gain Δh costs a speed loss of about $g\\,\\Delta h/V$. Lift proportional to $V^2$ then gives a vertical restoring force proportional to Δh, and the height follows [[physics:simple-harmonic-motion|simple harmonic motion]] with angular frequency $\\omega = \\sqrt{2}\\,g/V$ (see the derivation). The period is

$$T = \\frac{\\pi\\sqrt{2}\\,V}{g} \\approx 0.45\\,V\\ \\text{seconds}$$

with $V$ in metres per second — or $0.138\\,V$ with $V$ in feet per second, the form found in older books. Remarkably, it depends on **nothing but the speed**: not the mass, the wing, the air density or the altitude. The distance flown in one cycle, $\\lambda = VT = \\pi\\sqrt2\\,V^2/g$, is the phugoid's wavelength.

| Flyer | Speed | Period | Wavelength |
|---|---|---|---|
| Paper glider | 5 m/s | 2.3 s | 11 m |
| Sailplane | 25 m/s | 11 s | 280 m |
| Light aircraft | 55 m/s | 25 s | 1.4 km |
| Airliner in cruise | 230 m/s | 104 s | 24 km |

### Damping
Drag drains energy. For an aircraft holding its angle of attack at constant thrust, the damping ratio is about

$$\\zeta \\approx \\frac{1}{\\sqrt{2}\\,(L/D)}$$

so the more efficient the aircraft, the weaker the damping: 0.07 for a light aircraft with L/D = 10, under 0.02 for a sailplane. The phugoid is so slow, though, that pilots correct it without noticing and autopilots hold the height. In real aircraft the period and damping are shifted by how thrust varies with speed, by compressibility near Mach 1, and by the fall of density with height: lift drops off faster at the top of each swoop, which shortens the period of a jet cruising at 11 000 m by up to about a fifth.

### When it matters
The phugoid becomes the main problem when the elevator is lost. In accidents in which all hydraulic power failed, crews had only engine thrust to control pitch — more thrust raises the nose, less lowers it — and struggled to damp a phugoid lasting a minute or more. NASA's propulsion-controlled-aircraft flights of the 1990s showed that a computer moving the throttles could damp it well enough to land.

> [!key] The phugoid is energy sloshing between speed and height. Its period depends only on speed: $T \\approx 0.45\\,V$ seconds with $V$ in m/s.
`,
  ideas: [
    'The phugoid is a slow exchange of speed and height at nearly constant angle of attack.',
    'Lanchester\'s period T = π√2·V/g ≈ 0.45 V (V in m/s) depends only on speed.',
    'Its wavelength is λ = π√2·V²/g: about 1.4 km for a light aircraft, 24 km for an airliner in cruise.',
    'Damping comes from drag: ζ ≈ 1/(√2·L/D), so efficient aircraft have weakly damped phugoids.',
    'Without the elevator, thrust alone must control the phugoid.'
  ],
  pitfalls: [
    'A heavier aircraft has a longer phugoid — In Lanchester\'s theory the period depends only on speed and gravity. Two aircraft of any size at the same true airspeed have the same phugoid period.',
    'During the phugoid the nose pitches up and down because the angle of attack changes — The angle of attack stays almost constant; the pitch attitude follows the flight path as it climbs and descends.',
    'A cleaner, lower-drag aircraft damps its phugoid better — The reverse: drag is what removes the energy, so the higher the lift-to-drag ratio, the weaker the damping.'
  ],
  derivation: {
    title: 'Lanchester\'s phugoid period',
    intro: 'Hold the angle of attack, so $C_L$ is constant; ignore drag and thrust; keep the path angles small.',
    steps: [
      { text: 'With no drag or thrust, energy per unit mass is conserved:', tex: 'V^2 + 2 g h = V_0^2 + 2 g h_0' },
      { text: 'For a small height change Δh the speed changes by ΔV, with', tex: '2 V_0\\,\\Delta V \\approx -2 g\\,\\Delta h \\quad\\Rightarrow\\quad \\Delta V \\approx -\\frac{g\\,\\Delta h}{V_0}' },
      { text: 'At constant $C_L$ lift is the weight times $(V/V_0)^2$, so the unbalanced vertical force per unit mass is', tex: '\\frac{L - W}{m} = g\\left(\\frac{V^2}{V_0^2} - 1\\right) \\approx \\frac{2g\\,\\Delta V}{V_0} = -\\frac{2g^2}{V_0^2}\\,\\Delta h' },
      { text: 'For small path angles this force accelerates the height directly:', tex: '\\ddot{h} = -\\frac{2g^2}{V_0^2}\\,\\Delta h' },
      { text: 'That is simple harmonic motion, with', tex: '\\omega = \\frac{\\sqrt{2}\\,g}{V_0}, \\qquad T = \\frac{2\\pi}{\\omega} = \\frac{\\pi\\sqrt{2}\\,V_0}{g}' }
    ],
    outro: 'Adding drag at constant thrust gives the damping ratio ζ ≈ 1/(√2·L/D) to first order.'
  },
  formulas: [
    {
      name: 'Lanchester\'s phugoid period',
      expr: 'T = pi*sqrt(2)*V/g', tex: 'T = \\frac{\\pi\\sqrt{2}\\,V}{g}',
      vars: {
        T: { name: 'phugoid period', q: 'time', unit: 's', tex: 'T' },
        V: { name: 'true airspeed', q: 'speed', unit: 'm/s', value: 55, tex: 'V' },
        g: { const: 'g' }
      },
      note: 'Constant angle of attack, small amplitude, thrust independent of speed, density constant with height. Real periods are usually within 10–20 % of this.',
      stories: {
        T: 'An aircraft cruises at {V}. What is its phugoid period?',
        V: 'A phugoid repeats every {T}. How fast is the aircraft flying?'
      }
    },
    {
      name: 'Phugoid damping ratio',
      expr: 'zeta = 1/(sqrt(2)*LD)', tex: '\\zeta = \\frac{1}{\\sqrt{2}\\,E}',
      vars: {
        zeta: { name: 'phugoid damping ratio', tex: '\\zeta' },
        LD: { name: 'lift-to-drag ratio L/D', value: 10, min: 1, max: 80, tex: 'E' }
      },
      note: 'E is the lift-to-drag ratio L/D (the glide ratio). For constant angle of attack and thrust that does not change with speed.',
      stories: {
        zeta: 'An aircraft flies with a lift-to-drag ratio of {LD}. Roughly what is the damping ratio of its phugoid?',
        LD: 'A phugoid has a damping ratio of {zeta}. What lift-to-drag ratio does that suggest?'
      }
    },
    {
      name: 'Phugoid wavelength',
      expr: 'lam = pi*sqrt(2)*V^2/g', tex: '\\lambda = \\frac{\\pi\\sqrt{2}\\,V^2}{g}',
      vars: {
        lam: { name: 'distance flown in one phugoid cycle', q: 'length', unit: 'm', tex: '\\lambda' },
        V: { name: 'true airspeed', q: 'speed', unit: 'm/s', value: 55, tex: 'V' },
        g: { const: 'g' }
      },
      stories: { lam: 'An aircraft flies at {V}. How far does it travel during one phugoid cycle?' }
    }
  ],
  examples: [
    {
      title: 'An airliner\'s phugoid',
      q: 'An airliner cruises at 230 m/s true airspeed with L/D = 18. Estimate its phugoid period, wavelength, damping ratio and time to half amplitude.',
      steps: [
        '$T = \\pi\\sqrt2 \\times 230/9.81 = 104$ s; $\\lambda = 230 \\times 104 = 24$ km.',
        '$\\zeta = 1/(\\sqrt2 \\times 18) = 0.039$.',
        '$\\omega = 2\\pi/104 = 0.060$ rad/s; $t_{1/2} = 0.693/(0.039 \\times 0.060) = 290$ s.'
      ],
      a: 'A period of about 1¾ minutes over 24 km, halving only after about 5 minutes — which is why an autopilot holds the height.'
    },
    {
      title: 'A sailplane barely damps it',
      q: 'A sailplane flies at 25 m/s with L/D = 40. How many phugoid cycles does it take to halve the amplitude?',
      steps: [
        '$T = 0.453 \\times 25 = 11.3$ s; $\\zeta = 1/(\\sqrt2 \\times 40) = 0.018$.',
        'Cycles to half amplitude: $t_{1/2}/T = \\ln 2/(2\\pi\\zeta) = 0.693/0.111 = 6.2$.'
      ],
      a: 'About six cycles — more than a minute of gentle porpoising if the pilot does nothing.'
    },
    {
      title: 'Height swing from a speed swing',
      q: 'A light aircraft trimmed at 55 m/s oscillates in a phugoid with a speed swing of ±5 m/s. How much height does it gain and lose?',
      steps: [
        'Energy exchange: $V\\,\\Delta V \\approx -g\\,\\Delta h$.',
        '$\\Delta h \\approx 55 \\times 5/9.81 = 28$ m.'
      ],
      a: 'About ±28 m.'
    }
  ],
  quiz: [
    { q: 'An aircraft doubles its true airspeed. Its phugoid period…', choices: ['halves', 'stays the same', 'doubles', 'quadruples'], a: 2,
      why: 'T = π√2·V/g is proportional to speed. (The wavelength, proportional to V², quadruples.)' },
    { q: 'Which quantity stays almost constant during a phugoid?', choices: ['airspeed', 'height', 'angle of attack', 'pitch attitude'], a: 2,
      why: 'The aircraft\'s pitch stiffness keeps the angle of attack nearly fixed; speed, height and pitch attitude all oscillate.' },
    { q: 'At the same speed, a heavier aircraft has a longer phugoid period.', a: false,
      why: 'Mass cancels out of Lanchester\'s analysis: the period depends only on V and g.' },
    { q: 'What is Lanchester\'s phugoid period at 100 m/s, in seconds?', answer: 45.3, unit: 's',
      why: 'T = π√2 × 100/9.81 = 444/9.81 = 45 s.' },
    { q: 'Improving an aircraft\'s lift-to-drag ratio makes its phugoid…', choices: ['better damped', 'less damped', 'shorter', 'disappear'], a: 1,
      why: 'ζ ≈ 1/(√2·L/D): less drag means less energy removed per cycle, so weaker damping.' }
  ],
  problems: [
    { q: 'How far does an aircraft flying at 70 m/s travel in one phugoid cycle?', answer: 2220, unit: 'm', tol: 0.02,
      steps: ['$\\lambda = \\pi\\sqrt2\\,V^2/g = 4.443 \\times 4900/9.81$.', '$= 2220$ m.'] },
    { q: 'At what true airspeed is the phugoid period one minute?', answer: 132.4, unit: 'm/s', tol: 0.02,
      steps: ['$V = gT/(\\pi\\sqrt2) = 9.81 \\times 60/4.443$.', '$= 132$ m/s (about 257 kt).'] }
  ],
  applications: ['Autopilot altitude-hold design, which must damp the phugoid.', 'Propulsion-controlled aircraft research: steering with thrust after a control failure.', 'Paper planes and hand-launched gliders, whose swoops are phugoids.', 'Flight-test measurement of drag, which the phugoid damping reflects.'],
  history: 'Frederick Lanchester analysed the long-period motion in *Aerodonetics* (1908) and named it the phugoid, meaning to evoke flight — but the Greek root he borrowed means flight in the sense of fleeing. The name stuck anyway.',
  sim: 'stab-phugoid'
},

{
  id: 'short-period', parent: 'control-dynamics', title: 'The short-period mode', level: 3,
  short: 'The short-period mode is the quick, usually well-damped pitch oscillation — a second or two long — in which angle of attack and pitch rate swing together at almost constant speed. Its stiffness comes from C_mα and its damping mostly from the tail.',
  keywords: ['short period', 'pitch oscillation', 'angle of attack', 'pitch rate', 'pitch damping', 'Cmq', 'Cmα', 'natural frequency', 'damping ratio', 'elevator pulse', 'load factor', 'control anticipation parameter', 'pilot-induced oscillation', 'PIO', 'pitch damper', 'manoeuvre point'],
  prereq: ['dynamic-stability', 'longitudinal-stability', 'physics:moment-of-inertia', 'math:second-order-linear'],
  related: ['phugoid', 'neutral-point', 'fly-by-wire', 'load-factor', 'flutter'],
  body: `
Hit a pitch gust and the nose bobs once or twice and settles within a couple of seconds. That quick, usually well-damped motion is the **short-period mode**. It is over so fast that the speed has no time to change: what oscillates is the angle of attack and the pitch rate, and the aircraft behaves like a weathervane in pitch, hung on a spring ($C_{m_\\alpha}$) and a damper ($C_{m_q}$).

### Two equations
At constant speed only the angle of attack α and the pitch rate $q$ are needed:

$$\\dot\\alpha = q + \\frac{Z_\\alpha}{V}\\,\\alpha, \\qquad \\dot q = M_\\alpha\\,\\alpha + M_q\\,q + M_\\delta\\,\\delta_e$$

The first says the nose can rotate faster than the flight path: the extra lift from α bends the path upward and so takes some of the α away, with $Z_\\alpha/V = -\\bar q S C_{L_\\alpha}/(mV)$ (often written $Z_w$) and $\\bar q = \\tfrac12\\rho V^2$ the dynamic pressure. The second is [[physics:rotational-dynamics|Newton's law for rotation]], with

$$M_\\alpha = \\frac{\\bar q S\\bar c\\,C_{m_\\alpha}}{I_{yy}}, \\qquad M_q = \\frac{\\bar q S\\bar c\\,C_{m_q}}{I_{yy}}\\,\\frac{\\bar c}{2V}$$

where $C_{m_q}$ is usually taken to include the lag of the downwash at the tail. The characteristic equation of the pair gives

$$\\omega_n^2 = \\frac{Z_\\alpha}{V}\\,M_q - M_\\alpha, \\qquad 2\\zeta\\omega_n = -\\left(\\frac{Z_\\alpha}{V} + M_q\\right)$$

### Numbers for a light aircraft
Take 1100 kg, $S = 16.2$ m², $\\bar c = 1.5$ m, $I_{yy} = 1825$ kg·m², $C_{L_\\alpha} = 4.8$, a 15 % static margin ($C_{m_\\alpha} = -0.72$) and $C_{m_q} = -17$, at 60 m/s at sea level. Then $Z_\\alpha/V = -2.6$ s⁻¹, $M_\\alpha = -21.1$ s⁻² and $M_q = -6.2$ s⁻¹, so $\\omega_n = 6.1$ rad/s and ζ = 0.72: a damped period of about 1.5 s with only a small overshoot. The stiffness alone, $\\sqrt{-M_\\alpha} = 4.6$ rad/s, underestimates the frequency, because lift damping and pitch damping together act as a second spring.

### What changes it
- **Speed.** Every derivative grows with dynamic pressure, so $\\omega_n$ rises roughly in proportion to $V$ while ζ stays about the same.
- **Altitude.** At the same true airspeed, thinner air weakens stiffness and damping alike; ζ falls roughly as $\\sqrt{\\rho}$. A jet in cruise has a slower, less damped short period than on approach, and often a **pitch damper**.
- **CG position.** Moving the CG aft shrinks $M_\\alpha$ and lowers the frequency. At the [[neutral-point|neutral point]] the lift-and-damping "spring" still holds the short period together; only when the CG passes the **manoeuvre point**, a little further aft, does the short period itself diverge. (Between the two points the full aircraft still diverges — slowly, through its speed.)

### What pilots feel
The short period shapes the first second after every stick input: how quickly the nose answers, and how far the angle of attack and the [[load-factor|load factor]] overshoot. Too slow and the aircraft feels sluggish; too fast or too lightly damped and it feels twitchy, and a pilot correcting hard can fall out of phase with it — a **pilot-induced oscillation** (PIO). The Space Shuttle's last free-flight approach and landing test in 1977 and the YF-22 prototype's landing accident in 1992 both ended in PIOs, driven by delays and rate limits in the flight controls. Handling-qualities standards specify the short-period frequency and damping to keep aircraft out of that region; [[fly-by-wire]] systems shape it with feedback.
`,
  ideas: [
    'The short period is a fast oscillation of angle of attack and pitch rate at nearly constant speed.',
    'Its stiffness comes from C_mα, its damping from C_mq (the tail) and from lift (Z_α).',
    'ω_n² = (Z_α/V)M_q − M_α and 2ζω_n = −(Z_α/V + M_q).',
    'Frequency rises with speed; damping falls with altitude; moving the CG aft slows the mode.',
    'A badly tuned short period invites pilot-induced oscillations; fly-by-wire shapes it with feedback.'
  ],
  pitfalls: [
    'The short period is the pitching you see during a phugoid — The phugoid is a slow speed–height exchange at constant α; the short period is a quick α oscillation at constant speed, finished in a couple of seconds.',
    'The short-period frequency is simply √(−M_α) — That is the stiffness alone. Lift damping and pitch damping add a term Z_α M_q/V that can be as large, so the real frequency is higher.',
    'A pitch damper is needed most at low speed near the ground — Damping falls with air density, so pitch and yaw dampers matter most at high altitude, where the air is thin.'
  ],
  formulas: [
    {
      name: 'Short-period frequency from pitch stiffness alone',
      expr: 'wn = sqrt(-rho*V^2*S*c*Cma/(2*Iyy))', tex: '\\omega_n \\approx \\sqrt{-\\frac{\\rho V^2 S\\,\\bar{c}\\,C_{m_\\alpha}}{2 I_{yy}}}',
      vars: {
        wn: { name: 'natural frequency (stiffness only)', q: 'angvel', unit: 'rad/s', tex: '\\omega_n' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'true airspeed', q: 'speed', unit: 'm/s', value: 60, tex: 'V' },
        S: { name: 'wing area', q: 'area', unit: 'm²', value: 16.2, tex: 'S' },
        c: { name: 'mean aerodynamic chord', q: 'length', unit: 'm', value: 1.5, tex: '\\bar{c}' },
        Cma: { name: 'pitch stiffness C_mα (per radian)', value: -0.72, min: -10, max: -0.001, signed: true, tex: 'C_{m_\\alpha}' },
        Iyy: { name: 'pitch moment of inertia', q: 'inertia', unit: 'kg·m²', value: 1825, tex: 'I_{yy}' }
      },
      note: 'The weathervane frequency √(−M_α). It underestimates the true short-period frequency, which adds the lift–damping term Z_α M_q/V.',
      practice: { unknowns: ['wn', 'Cma'] },
      stories: {
        wn: 'A light aircraft ({S} of wing, mean chord {c}, I_yy = {Iyy}) with C_mα = {Cma} per radian flies at {V} in air of density {rho}. Estimate its pitch frequency from the stiffness alone.',
        Cma: 'What pitch stiffness C_mα gives a stiffness frequency of {wn} for an aircraft with {S} of wing, chord {c} and I_yy = {Iyy} at {V} in air of density {rho}?'
      }
    },
    {
      name: 'Short-period natural frequency',
      expr: 'wn = sqrt(ZaV*Mq - Ma)', tex: '\\omega_n = \\sqrt{Z_w M_q - M_\\alpha}',
      vars: {
        wn: { name: 'natural frequency', q: 'angvel', unit: 'rad/s', tex: '\\omega_n' },
        ZaV: { name: 'lift damping Z_w = Z_α/V (negative)', q: 'rate', unit: '1/s', value: -2.6, signed: true, tex: 'Z_w' },
        Mq: { name: 'pitch damping M_q (negative)', q: 'rate', unit: '1/s', value: -6.24, signed: true, tex: 'M_q' },
        Ma: { name: 'pitch stiffness M_α (negative when stable)', q: false, unit: '1/s²', value: -21.1, signed: true, tex: 'M_\\alpha' }
      },
      note: 'Dimensional derivatives: Z_w = Z_α/V = −q̄SC_Lα/(mV), M_α = q̄Sc̄C_mα/I_yy, M_q = q̄Sc̄C_mq(c̄/2V)/I_yy.',
      practice: { unknowns: ['wn', 'Ma'] },
      stories: {
        wn: 'An aircraft has Z_α/V = {ZaV}, M_q = {Mq} and M_α = {Ma}. What is its short-period natural frequency?',
        Ma: 'An aircraft with Z_α/V = {ZaV} and M_q = {Mq} has a short-period frequency of {wn}. What is M_α?'
      }
    },
    {
      name: 'Short-period damping ratio',
      expr: 'zeta = -(ZaV + Mq)/(2*wn)', tex: '\\zeta = -\\frac{Z_w + M_q}{2\\,\\omega_n}',
      vars: {
        zeta: { name: 'damping ratio', tex: '\\zeta' },
        ZaV: { name: 'lift damping Z_w = Z_α/V (negative)', q: 'rate', unit: '1/s', value: -2.6, signed: true, tex: 'Z_w' },
        Mq: { name: 'pitch damping M_q (negative)', q: 'rate', unit: '1/s', value: -6.24, signed: true, tex: 'M_q' },
        wn: { name: 'natural frequency', q: 'angvel', unit: 'rad/s', value: 6.11, tex: '\\omega_n' }
      },
      stories: { zeta: 'An aircraft has Z_α/V = {ZaV}, M_q = {Mq} and a short-period frequency of {wn}. What is the damping ratio?' }
    }
  ],
  examples: [
    {
      title: 'A light aircraft\'s short period',
      q: 'Using the light aircraft above at 60 m/s ($\\bar q = 2205$ Pa), compute $Z_\\alpha/V$, $M_\\alpha$, $M_q$, the frequency, the damping ratio and the damped period.',
      steps: [
        '$Z_\\alpha/V = -2205 \\times 16.2 \\times 4.8/(1100 \\times 60) = -2.60$ s⁻¹.',
        '$M_\\alpha = 2205 \\times 16.2 \\times 1.5 \\times (-0.72)/1825 = -21.1$ s⁻².',
        '$M_q = 2205 \\times 16.2 \\times 1.5 \\times (-17) \\times (1.5/120)/1825 = -6.24$ s⁻¹.',
        '$\\omega_n = \\sqrt{2.60 \\times 6.24 + 21.1} = \\sqrt{37.3} = 6.11$ rad/s; $\\zeta = (2.60 + 6.24)/(2 \\times 6.11) = 0.72$.',
        '$T_d = 2\\pi/(6.11\\sqrt{1 - 0.52}) = 1.49$ s.'
      ],
      a: 'ω_n ≈ 6.1 rad/s, ζ ≈ 0.72, period ≈ 1.5 s — brisk and well damped.'
    },
    {
      title: 'Moving the CG aft',
      q: 'The same aircraft is loaded so that the static margin halves to 7.5 %. What happens to the short period?',
      steps: [
        '$M_\\alpha$ halves to −10.6 s⁻²; $Z_\\alpha/V$ and $M_q$ are unchanged.',
        '$\\omega_n = \\sqrt{16.2 + 10.6} = 5.2$ rad/s; $\\zeta = 8.84/(2 \\times 5.2) = 0.85$.'
      ],
      a: 'The frequency falls from 6.1 to 5.2 rad/s and the response becomes more sluggish, though the damping ratio rises to 0.85.'
    }
  ],
  quiz: [
    { q: 'During the short-period oscillation, which quantity stays nearly constant?', choices: ['angle of attack', 'pitch rate', 'airspeed', 'load factor'], a: 2,
      why: 'The mode is over in a second or two, far too quickly for the speed to change; α, pitch rate and load factor all oscillate.' },
    { q: 'Moving the CG aft (still ahead of the neutral point) makes the short-period frequency…', choices: ['higher', 'lower', 'unchanged', 'zero at once'], a: 1,
      why: 'The stiffness M_α shrinks with the static margin, so ω_n² = (Z_α/V)M_q − M_α falls.' },
    { q: 'The short-period oscillation of a light aircraft typically has a period of 20–40 seconds.', a: false,
      why: 'That is the phugoid. The short period of a light aircraft lasts about 1–2 seconds.' },
    { q: 'An aircraft has Z_α/V = −2 s⁻¹, M_q = −5 s⁻¹ and M_α = −20 s⁻². What is its short-period natural frequency, in rad/s?', answer: 5.48, unit: 'rad/s',
      why: 'ω_n = √((−2)(−5) − (−20)) = √30 = 5.48 rad/s.' },
    { q: 'At the same true airspeed, flying higher makes the short-period damping ratio…', choices: ['larger', 'smaller', 'unchanged', 'negative at once'], a: 1,
      why: 'Every aerodynamic derivative scales with density, and the damping ratio falls roughly as √ρ. That is why jets use pitch dampers at altitude.' }
  ],
  applications: ['Specifying the pitch response of fighters and airliners in handling-qualities standards.', 'Designing pitch dampers and fly-by-wire pitch laws.', 'Investigating pilot-induced oscillations in flight test.'],
  sim: 'stab-short-period'
},

{
  id: 'dutch-roll', parent: 'control-dynamics', title: 'Dutch roll and the spiral mode', level: 3,
  short: 'Disturbed sideways, an aircraft shows three lateral motions: a quick roll subsidence, a slow spiral that may tighten or unwind, and the Dutch roll — a weaving yaw-and-roll oscillation. Dihedral effect and fin size pull the last two in opposite directions.',
  keywords: ['Dutch roll', 'spiral mode', 'spiral divergence', 'roll subsidence', 'roll mode', 'lateral-directional modes', 'yaw damper', 'sideslip', 'yaw rate', 'roll rate', 'dihedral', 'fin', 'Clβ', 'Cnβ', 'Cnr', 'spiral stability criterion', 'graveyard spiral'],
  prereq: ['dynamic-stability', 'lateral-stability', 'directional-stability'],
  related: ['control-surfaces', 'fly-by-wire', 'spins', 'sweep', 'turning-flight'],
  body: `
Disturb an aircraft sideways — a gust from the side, a jab of rudder — and three motions follow, mixing yaw, roll and sideslip in different proportions. They are the lateral–directional modes, and two of them are shaped by the tug-of-war between the [[directional-stability|fin]] and the [[lateral-stability|dihedral effect]].

### Roll subsidence
An aileron input starts a roll that settles to a steady rate almost at once, because of roll damping. The rate approaches its final value exponentially with the time constant

$$\\tau = -\\frac{4 I_{xx}}{\\rho V S b^2\\,C_{l_p}}$$

— under 0.1 s for a light aircraft at cruise, up to a second for a large airliner. It is stable on every normal aircraft (until the [[spins|spin]], where the damping reverses).

### The Dutch roll
Yaw the nose to the right. The aircraft now sideslips with the air coming from the left; the fin swings the nose back — and overshoots, as a weathervane does. Meanwhile the sideslip, through the dihedral effect, rolls the aircraft, so the wings rock as the nose swings and a wingtip traces an ellipse against the horizon. The rolling, weaving stride is traditionally likened to a Dutch skater. Its frequency comes mainly from the weathercock stiffness,

$$\\omega_{DR} \\approx \\sqrt{\\frac{C_{n_\\beta}\\,\\tfrac12\\rho V^2 S b}{I_{zz}}}$$

and its damping mainly from the fin's resistance to yaw rate ($C_{n_r}$) and from side force. A light aircraft has a Dutch roll of 2–3 s period with a damping ratio of 0.1–0.3. A swept-wing jet at high altitude is worse off: its dihedral effect is large at high lift coefficient and the thin air weakens the damping, so the roll dominates and the damping ratio can fall below 0.05. Every jet transport therefore has a **yaw damper**, which moves the rudder against the yaw rate.

### The spiral mode
Now let the aircraft bank slightly and wait. It slips towards the low wing, and the dihedral effect tries to lift that wing. But the fin also swings the nose into the slip, yawing the aircraft into the turn, and a yaw rate makes the outer wing move faster than the inner and lift more ($C_{l_r} > 0$), which steepens the bank. Which effect wins decides the **spiral mode**, a slow motion without oscillation. It is stable when

$$C_{l_\\beta}\\,C_{n_r} - C_{n_\\beta}\\,C_{l_r} > 0$$

Most aircraft are neutral or mildly unstable in spiral, doubling a small bank in 20 s or more — easy to correct for a pilot who can see the horizon. In cloud, without instruments or training, the slow tightening is not felt, and the aircraft winds into a steepening, accelerating descending turn: the "graveyard spiral".

### The designer's balance
| Change | Dutch roll | Spiral |
|---|---|---|
| Bigger fin (more $C_{n_\\beta}$, more yaw damping) | better damped | less stable |
| More dihedral effect (more negative $C_{l_\\beta}$) | less damped, more roll | more stable |
| Yaw damper | much better | slightly better |
| Slower flight (higher $C_L$, so larger $C_{l_r}$) | slower | less stable |

Designers aim for a mildly unstable or neutral spiral and a well-damped Dutch roll, and close the gap with a yaw damper.

> [!warn] Spatial disorientation and spiral dives are countered by instrument training and the procedures in the aircraft's approved manuals; this page explains the physics only. Flight in cloud follows the rules of the air.
`,
  ideas: [
    'Three lateral modes: a fast roll subsidence, a slow spiral and the oscillating Dutch roll.',
    'The Dutch roll is a yaw-and-roll oscillation; its frequency comes from C_nβ, its damping mainly from the fin (C_nr).',
    'The spiral is stable when C_lβ C_nr − C_nβ C_lr > 0; most aircraft are nearly neutral.',
    'More fin helps the Dutch roll but hurts the spiral; more dihedral effect does the opposite.',
    'Swept-wing jets at altitude have poorly damped Dutch rolls and rely on yaw dampers.'
  ],
  pitfalls: [
    'A yaw damper is there to stop spiral divergence — It is there to damp the Dutch roll. The spiral is slow enough for the pilot or autopilot to handle; the yaw damper only helps it slightly.',
    'More dihedral always improves lateral behaviour — It stabilises the spiral but makes the Dutch roll more roll-dominated and less damped.',
    'A spirally unstable aircraft is dangerous to fly — A spiral that doubles in 20–60 s is normal and easy to correct with a visible horizon. The danger comes when the slow divergence goes unnoticed, as in cloud without instrument skills.'
  ],
  formulas: [
    {
      name: 'Dutch-roll frequency (weathercock estimate)',
      expr: 'wd = sqrt(Cnb*0.5*rho*V^2*S*b/Izz)', tex: '\\omega_{DR} \\approx \\sqrt{\\frac{C_{n_\\beta}\\,\\tfrac{1}{2}\\rho V^2 S b}{I_{zz}}}',
      vars: {
        wd: { name: 'Dutch-roll natural frequency', q: 'angvel', unit: 'rad/s', tex: '\\omega_{DR}' },
        Cnb: { name: 'directional stability C_nβ (per radian)', value: 0.065, min: 0.001, max: 1, tex: 'C_{n_\\beta}' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'true airspeed', q: 'speed', unit: 'm/s', value: 55, tex: 'V' },
        S: { name: 'wing area', q: 'area', unit: 'm²', value: 16.2, tex: 'S' },
        b: { name: 'wingspan', q: 'length', unit: 'm', value: 11, tex: 'b' },
        Izz: { name: 'yaw moment of inertia', q: 'inertia', unit: 'kg·m²', value: 2667, tex: 'I_{zz}' }
      },
      note: 'The weathercock frequency. Side force, roll coupling and damping change the true value by typically 10–20 %.',
      practice: { unknowns: ['wd', 'Cnb'] },
      stories: {
        wd: 'An aircraft ({S} of wing, span {b}, I_zz = {Izz}) with C_nβ = {Cnb} per radian flies at {V} in air of density {rho}. Estimate its Dutch-roll frequency.',
        Cnb: 'What C_nβ gives a Dutch-roll frequency of {wd} for an aircraft with {S} of wing, span {b} and I_zz = {Izz} at {V} in air of density {rho}?'
      }
    },
    {
      name: 'Spiral stability criterion',
      expr: 'Es = Clb*Cnr - Cnb*Clr', tex: 'E = C_{l_\\beta}\\,C_{n_r} - C_{n_\\beta}\\,C_{l_r}',
      vars: {
        Es: { name: 'spiral stability number (positive: stable)', signed: true, tex: 'E' },
        Clb: { name: 'dihedral effect C_lβ (per radian)', value: -0.092, signed: true, tex: 'C_{l_\\beta}' },
        Cnr: { name: 'yaw damping C_nr (per radian)', value: -0.099, signed: true, tex: 'C_{n_r}' },
        Cnb: { name: 'directional stability C_nβ (per radian)', value: 0.065, signed: true, tex: 'C_{n_\\beta}' },
        Clr: { name: 'roll due to yaw rate C_lr (per radian)', value: 0.096, signed: true, tex: 'C_{l_r}' }
      },
      note: 'From the constant term of the lateral characteristic equation. C_lr is roughly C_L/4 plus a small fin term, so the spiral becomes less stable at low speed.',
      practice: { unknowns: ['Es', 'Clb'] },
      stories: {
        Es: 'An aircraft has C_lβ = {Clb}, C_nr = {Cnr}, C_nβ = {Cnb} and C_lr = {Clr}. Is its spiral stable? Compute the criterion.',
        Clb: 'An aircraft has C_nr = {Cnr}, C_nβ = {Cnb} and C_lr = {Clr}. What dihedral effect C_lβ gives the criterion a value of {Es}?'
      }
    },
    {
      name: 'Roll-subsidence time constant',
      expr: 'tau = -4*Ixx/(rho*V*S*b^2*Clp)', tex: '\\tau = -\\frac{4 I_{xx}}{\\rho V S b^2\\,C_{l_p}}',
      vars: {
        tau: { name: 'roll time constant', q: 'time', unit: 's', tex: '\\tau' },
        Ixx: { name: 'roll moment of inertia', q: 'inertia', unit: 'kg·m²', value: 1285, tex: 'I_{xx}' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'true airspeed', q: 'speed', unit: 'm/s', value: 55, tex: 'V' },
        S: { name: 'wing area', q: 'area', unit: 'm²', value: 16.2, tex: 'S' },
        b: { name: 'wingspan', q: 'length', unit: 'm', value: 11, tex: 'b' },
        Clp: { name: 'roll damping C_lp (per radian)', value: -0.47, min: -2, max: -0.01, signed: true, tex: 'C_{l_p}' }
      },
      note: 'Single-degree-of-freedom roll: I_xx ṗ = L_p p, with L_p = q̄Sb C_lp (b/2V).',
      stories: { tau: 'An aircraft (I_xx = {Ixx}, {S} of wing, span {b}, C_lp = {Clp}) flies at {V} in air of density {rho}. What is its roll time constant?' }
    }
  ],
  examples: [
    {
      title: 'Estimating the Dutch roll',
      q: 'A light aircraft (16.2 m², 11 m span, $I_{zz} = 2667$ kg·m², $C_{n_\\beta} = 0.065$ per radian) flies at 55 m/s at sea level. Estimate its Dutch-roll frequency and period.',
      steps: [
        '$\\tfrac12\\rho V^2 S b = 0.6125 \\times 3025 \\times 16.2 \\times 11 = 330\\,000$ N·m.',
        '$\\omega_{DR} \\approx \\sqrt{0.065 \\times 330\\,000/2667} = \\sqrt{8.05} = 2.84$ rad/s.',
        'Period $\\approx 2\\pi/2.84 = 2.2$ s. A full four-degree-of-freedom model of this aircraft gives 3.1 rad/s and 2.1 s, with ζ ≈ 0.22.'
      ],
      a: 'About 2.8 rad/s, a period of roughly 2 s.'
    },
    {
      title: 'Dihedral and the spiral',
      q: 'The aircraft has $C_{n_r} = -0.099$, $C_{n_\\beta} = 0.065$ and $C_{l_r} = 0.096$. Check the spiral with 3° of dihedral ($C_{l_\\beta} = -0.092$) and with none ($C_{l_\\beta} = -0.042$).',
      steps: [
        '3°: $E = (-0.092)(-0.099) - (0.065)(0.096) = 0.0091 - 0.0062 = +0.0029$: stable.',
        '0°: $E = (-0.042)(-0.099) - 0.0062 = 0.0042 - 0.0062 = -0.0021$: unstable.'
      ],
      a: 'Three degrees of dihedral make the spiral stable; without it the spiral slowly diverges.'
    },
    {
      title: 'How fast the roll settles',
      q: 'Find the roll time constant of the light aircraft ($I_{xx} = 1285$ kg·m², $C_{l_p} = -0.47$) at 55 m/s and at 30 m/s.',
      steps: [
        '55 m/s: $\\tau = 4 \\times 1285/(1.225 \\times 55 \\times 16.2 \\times 121 \\times 0.47) = 5140/62\\,070 = 0.083$ s.',
        '30 m/s: τ scales as $1/V$: $0.083 \\times 55/30 = 0.15$ s.'
      ],
      a: 'About 0.08 s at 55 m/s and 0.15 s at 30 m/s — the roll rate settles almost at once.'
    }
  ],
  quiz: [
    { q: 'Enlarging the fin tends to…', choices: ['improve Dutch-roll damping and make the spiral less stable', 'worsen Dutch-roll damping and make the spiral more stable', 'improve both', 'change neither'], a: 0,
      why: 'More fin adds yaw damping (better Dutch roll) and more directional stability, which in the spiral criterion C_lβC_nr − C_nβC_lr increases the destabilising term.' },
    { q: 'Which lateral mode is most treacherous for a pilot flying in cloud without instrument skills?', choices: ['roll subsidence', 'Dutch roll', 'spiral', 'short period'], a: 2,
      why: 'The spiral is slow and non-oscillating, so its tightening is not felt; unnoticed, it becomes a steep descending turn.' },
    { q: 'A yaw damper is fitted mainly to stop spiral divergence.', a: false,
      why: 'Its main job is to damp the Dutch roll, especially at high altitude; it only slightly helps the spiral.' },
    { q: 'An aircraft has C_lβ = −0.06, C_nr = −0.08, C_nβ = 0.07 and C_lr = 0.10. Compute the spiral criterion C_lβC_nr − C_nβC_lr.', answer: -0.0022,
      why: '(−0.06)(−0.08) − (0.07)(0.10) = 0.0048 − 0.0070 = −0.0022: negative, so the spiral is (mildly) unstable.' },
    { q: 'At high altitude the Dutch roll of a swept-wing jet tends to be…', choices: ['better damped than at sea level', 'poorly damped and roll-dominated', 'replaced by the phugoid', 'non-oscillatory'], a: 1,
      why: 'Thin air weakens aerodynamic damping, and the swept wing\'s dihedral effect is large at the high lift coefficient of cruise, so the oscillation is weakly damped with large roll.' }
  ],
  applications: ['Yaw dampers on every jet transport and many business jets.', 'Autopilot wing-levellers that counter spiral divergence in light aircraft.', 'Instrument flight training, which teaches pilots to trust instruments over the inner ear.'],
  history: 'The first swept-wing jet bombers of the late 1940s wallowed in Dutch roll so badly that accurate bombing was difficult; the yaw damper developed for the Boeing B-47 around 1948 became standard equipment on the jet transports that followed.',
  sim: 'stab-lateral'
},

{
  id: 'fly-by-wire', parent: 'control-dynamics', title: 'Fly-by-wire and relaxed stability', level: 2,
  short: 'In a fly-by-wire aircraft the pilot\'s controls send signals to computers, which move the surfaces to give the response asked for. This lets designers relax — or even reverse — the natural static stability, and lets the computers keep the aircraft inside its flight envelope.',
  keywords: ['fly-by-wire', 'FBW', 'relaxed static stability', 'RSS', 'negative static margin', 'control laws', 'normal law', 'alternate law', 'direct law', 'envelope protection', 'sidestick', 'stability augmentation', 'redundancy', 'F-16', 'A320', 'X-29', 'time to double', 'C-star'],
  prereq: ['neutral-point', 'short-period', 'control-surfaces'],
  related: ['trim', 'longitudinal-stability', 'dynamic-stability', 'flight-testing', 'multicopters', 'load-factor'],
  body: `
In a conventional aircraft the pilot's stick is joined to the control surfaces by cables, rods or hydraulic valves: a stick position means a surface position. In a **fly-by-wire** (FBW) aircraft the stick is only a transducer. Its signal goes to flight-control computers, which also read the aircraft's motion from gyros, accelerometers and air-data sensors, and they move the surfaces so that the aircraft does what the pilot asked — a pitch rate, a roll rate, a load factor — rather than simply deflecting the elevator by a set amount.

### Why designers wanted it: relaxed stability
A conventionally stable aircraft pays for its stability. With the CG well ahead of the [[neutral-point|neutral point]] the tail must push down to [[trim]], the wing lifts extra, and the aircraft is reluctant to change its angle of attack. Move the CG to the neutral point or behind it and all of that turns round: the tail can lift, it can be smaller, trim drag falls and pitch response becomes quick. The price is **instability**: with the CG far enough aft a disturbance grows, doubling in

$$t_2 = \\frac{\\ln 2}{\\lambda}$$

where λ is the positive root of the pitch motion. With the damping sum $d = -(Z_\\alpha/V + M_q)$ and the net destabilising stiffness $k = M_\\alpha - (Z_\\alpha/V)M_q$ (positive once the CG is behind the manoeuvre point; see [[short-period]]),

$$\\lambda = \\sqrt{\\frac{d^2}{4} + k} - \\frac{d}{2}$$

No pilot can catch a divergence that doubles every third of a second, but a computer running its control law 50–100 times a second can, with ease. The General Dynamics F-16 was the first production aircraft designed with relaxed static stability, flying with a slightly negative static margin at subsonic speed; the experimental Grumman X-29 of 1984, with forward-swept wings, was about 35 % unstable and depended entirely on its computers.

### Control laws
Freed from mechanical linkages, the stick can command a *response*. A common pitch law blends pitch rate and load factor (the "C*" criterion), so the aircraft feels alike at all speeds and trims itself; roll laws usually command a roll rate and hold the bank angle when the stick is released. On top sit **envelope protections**: the computer keeps the angle of attack short of the [[stall]], holds the [[load-factor|load factor]] within structural limits (about +2.5 g to −1 g for a transport with flaps up), and limits bank and speed. After sensor or computer failures the system steps down to simpler **degraded laws** — on Airbus aircraft called alternate and direct law — with fewer or no protections. Manufacturers differ in philosophy: some make the limits hard, others let a determined pilot push through them against rising force.

### Trusting the computer
Everything depends on the system not failing. FBW systems use three or four independent channels that vote, often with dissimilar processors and software written by separate teams, separate power supplies and separately routed wiring, so that a total loss of control is expected less than about once in 10⁹ flight hours. The remaining risks are subtler: sensors that agree on a wrong value, logic that behaves unexpectedly in a situation nobody foresaw, and actuator rate limits, which can trigger pilot-induced oscillations. Every multicopter drone is fly-by-wire too — without its flight controller it could not hover for a second.

> [!note] Control laws differ between aircraft types and are described here only in general terms; how a particular aircraft behaves, and what the crew does after a failure, is set out in its approved manuals.
`,
  ideas: [
    'Fly-by-wire replaces mechanical links with computers that command a response (pitch rate, load factor, roll rate) rather than a surface angle.',
    'Relaxed static stability — CG near or behind the neutral point — cuts trim drag and tail size and quickens the response.',
    'An unstable aircraft diverges with time to double t₂ = ln 2/λ; computers acting 50–100 times a second can stabilise divergences far too fast for a pilot.',
    'Envelope protections keep angle of attack, load factor, bank and speed within limits; degraded laws take over after failures.',
    'Safety rests on redundant, voting, often dissimilar channels.'
  ],
  pitfalls: [
    'In a fly-by-wire airliner the sidestick positions the elevators directly, just electrically — The stick commands a response; the computers choose the surface deflections, adding stability, trim and protections.',
    'Relaxed stability means the aircraft is dangerous — The bare airframe is unstable, but the augmented aircraft the pilot flies is stable and has better handling; the risk is transferred to the reliability of the control system.',
    'A fly-by-wire aircraft cannot be stalled or overstressed in any circumstances — Protections work in the normal law with valid sensor data. After failures, in degraded laws, some or all protections are lost.'
  ],
  formulas: [
    {
      name: 'Time to double of a divergence',
      expr: 't2 = ln(2)/lam', tex: 't_2 = \\frac{\\ln 2}{\\lambda}',
      vars: {
        t2: { name: 'time to double', q: 'time', unit: 's', tex: 't_2' },
        lam: { name: 'growth rate (positive real root)', q: 'rate', unit: '1/s', value: 2.0, tex: '\\lambda' }
      },
      stories: {
        t2: 'An unstable aircraft\'s pitch divergence grows as e^(λt) with λ = {lam}. How long does it take to double?',
        lam: 'A divergence doubles every {t2}. What is its growth rate?'
      }
    },
    {
      name: 'Growth rate of an unstable pitch motion',
      expr: 'lam = sqrt(d^2/4 + k) - d/2', tex: '\\lambda = \\sqrt{\\frac{d^2}{4} + k} - \\frac{d}{2}',
      vars: {
        lam: { name: 'growth rate', q: 'rate', unit: '1/s', signed: true, tex: '\\lambda' },
        d: { name: 'damping sum −(Z_α/V + M_q)', q: 'rate', unit: '1/s', value: 9, tex: 'd' },
        k: { name: 'net destabilising stiffness M_α − (Z_α/V)M_q', q: false, unit: '1/s²', value: 12, signed: true, tex: 'k' }
      },
      note: 'The larger root of λ² + dλ − k = 0 from the short-period equations. For k < 0 (stable) the result is negative: no divergence.',
      practice: { unknowns: ['lam', 'k'] },
      stories: {
        lam: 'An unstable fighter has a damping sum of {d} and a net destabilising stiffness of {k}. How fast does a pitch disturbance grow?',
        k: 'A pitch divergence grows at {lam} with a damping sum of {d}. What is the destabilising stiffness?'
      }
    }
  ],
  examples: [
    {
      title: 'How unstable is too unstable for a pilot?',
      q: 'An aircraft has a damping sum $d = 9$ s⁻¹. Its CG is moved aft until $k = 12$ s⁻², and then further until $k = 24$ s⁻². Find the time to double in each case.',
      steps: [
        '$k = 12$: $\\lambda = \\sqrt{20.25 + 12} - 4.5 = 5.68 - 4.5 = 1.18$ s⁻¹; $t_2 = 0.693/1.18 = 0.59$ s.',
        '$k = 24$: $\\lambda = \\sqrt{20.25 + 24} - 4.5 = 6.65 - 4.5 = 2.15$ s⁻¹; $t_2 = 0.32$ s.'
      ],
      a: 'About 0.6 s and 0.3 s — both too quick for a human to control reliably, both easy for a computer.'
    },
    {
      title: 'Is the computer fast enough?',
      q: 'A flight-control computer updates its commands 80 times a second. How many updates does it make during one doubling time of 0.32 s?',
      steps: ['$80 \\times 0.32 = 26$ updates.'],
      a: 'About 26 — ample to catch the divergence long before it grows.'
    }
  ],
  quiz: [
    { q: 'Relaxed static stability means the CG is…', choices: ['far ahead of the neutral point', 'near or behind the neutral point', 'on the wing\'s leading edge', 'below the wing'], a: 1,
      why: 'A small or negative static margin: the CG sits close to or aft of the neutral point, so the bare aircraft is weakly stable or unstable.' },
    { q: 'What do designers gain by relaxing static stability?', choices: ['a bigger tail', 'less trim drag and quicker pitch response', 'a slower short period', 'simpler flight controls'], a: 1,
      why: 'The tail no longer pushes down against a forward CG, cutting trim drag, and the aircraft changes its angle of attack readily.' },
    { q: 'In a fly-by-wire airliner, a given sidestick position always means the same elevator angle.', a: false,
      why: 'The stick commands a response (for example a load factor or pitch rate); the computers vary the elevator and stabiliser to achieve it, trimming automatically.' },
    { q: 'Why do fly-by-wire systems use three or four computers?', choices: ['to go faster', 'so that a failed channel can be outvoted and the system survives failures', 'to share the weight', 'because each surface needs its own'], a: 1,
      why: 'Redundancy with voting lets the system detect and ignore a faulty channel, so no single failure can take away control.' },
    { q: 'A pitch divergence grows at λ = 3 s⁻¹. What is its time to double, in seconds?', answer: 0.231, unit: 's',
      why: 't₂ = ln 2/λ = 0.693/3 = 0.23 s.' }
  ],
  applications: ['Fighters with relaxed or negative static stability (F-16, Eurofighter, Rafale, Gripen).', 'Airliners with flight-envelope protection (Airbus A320 onwards, Boeing 777 and 787).', 'Every multicopter drone, whose flight controller stabilises an inherently unstable craft.'],
  history: 'Concorde (1969) had analogue electrical signalling with a mechanical backup. NASA flew an F-8 Crusader with digital fly-by-wire built round an Apollo guidance computer in 1972, and the F-16 (first flown 1974) had no mechanical backup at all. The Airbus A320 (1987) brought digital fly-by-wire and sidesticks to airliners, followed by the Boeing 777 (1994).',
  sim: { id: 'stab-short-period', params: { sm: -15, aug: true } }
},

{
  id: 'spins', parent: 'control-dynamics', title: 'Spins', level: 2,
  short: 'A spin is a stalled, autorotating descent: one wing is more deeply stalled than the other, so the aircraft rolls and yaws continuously while it corkscrews down at low airspeed. The physics explains why spins start, why they sustain themselves, and why recovery needs the stall broken first.',
  keywords: ['spin', 'autorotation', 'incipient spin', 'developed spin', 'flat spin', 'spin recovery', 'stall', 'yaw', 'spiral dive', 'spin resistance', 'anti-spin parachute', 'inertia coupling', 'roll damping'],
  prereq: ['stall', 'lateral-stability', 'control-surfaces'],
  related: ['stall-patterns', 'center-of-gravity', 'directional-stability', 'dutch-roll', 'flight-testing', 'autorotation'],
  body: `
A spin is what happens when a stalled wing is also yawing: the aircraft rolls and yaws continuously and corkscrews down about a vertical axis, nose well down, at low and nearly constant airspeed. It is the one flight condition in which the wing keeps itself stalled, and it has killed many pilots — most of them close to the ground, where a spin that starts in a turn cannot be recovered in the height available.

### Autorotation
Below the stall, rolling is resisted: the down-going wing meets the air at a larger angle of attack, gains lift and pushes back (roll damping, $C_{l_p} < 0$, see [[control-surfaces]]). Beyond the [[stall]] the [[lift-curve|lift curve]] slopes the other way. Now the down-going wing, at a still larger angle, has *less* lift than the up-going one, so the rolling moment feeds the roll instead of opposing it; and its drag is higher, which yaws the aircraft towards it. Roll damping has turned into roll *driving*: the wing **autorotates**. Anything that adds yaw at the stall — an uncoordinated turn, too much rudder, one wing stalling first — can start it.

### The phases
1. **Incipient spin**: the first two or three irregular turns, from the stall and wing drop to steady rotation.
2. **Developed spin**: a steady balance — angle of attack typically 30–50°, a turn every 2–4 s, descending at 20–40 m/s (4000–8000 ft/min) on a tight helix, often losing 60–150 m per turn.
3. **Recovery**, or its failure.

In the developed spin the weight is carried mostly by the drag of a wing meeting the air at a large angle. With a resultant-force coefficient $C_R \\approx 1$–1.3,

$$V_d = \\sqrt{\\frac{2mg}{\\rho S C_R}}$$

which is why the descent is fast but not far above the stall speed.

### Spin or spiral dive?
| | Spin | Spiral dive |
|---|---|---|
| Wing | stalled | flying (not stalled) |
| Airspeed | low, steady | high and rising fast |
| Load factor | about 1 g | high and rising |
| Rotation | rapid, tight | a steepening turn |

### Inertia, tail and flat spins
A spinning aircraft is a rotating body, and its mass distribution produces [[physics:angular-momentum|inertial]] pitching moments that tend to flatten the spin. Near 60–90° angle of attack the aircraft is in a **flat spin**: the rudder sits in the wake of the stalled wing and tailplane, loses its power, and recovery may be impossible. Tail geometry, mass distribution and the CG all matter — an aft CG flattens the spin, one reason for the aft limit in [[center-of-gravity|weight and balance]]. Prototypes are therefore spin-tested with an anti-spin parachute on the tail, and many types are designed to be spin-resistant or placarded against intentional spins.

### Why recovery works
The recovery methods taught for many light training aircraft act on these effects: taking the power off removes the gyroscopic and slipstream moments that can sustain a spin; rudder against the rotation produces a yawing moment that opposes it; and moving the elevator forward lowers the angle of attack below the stall so that the wing stops autorotating. Once the rotation stops, the aircraft is in a dive that must be recovered without overstressing it or stalling again. The order and the details differ between aircraft types, and some types need quite different actions.

> [!warn] This page explains the physics; it is not a procedure. Spin recovery technique is specific to each aircraft and is given in its approved flight manual. Intentional spins are flown only in aircraft approved for them, with a qualified instructor and ample height, following the rules of the air. Near the ground, avoiding the stall and the spin — not recovering from them — is the real defence.
`,
  ideas: [
    'A spin is stall plus yaw: the wing autorotates because beyond the stall the down-going wing has less lift and more drag.',
    'Roll damping turns into roll driving past C_L,max; that is what sustains the rotation.',
    'In a developed spin the airspeed is low and steady and the descent rate is set roughly by V_d = √(2mg/(ρSC_R)).',
    'A spiral dive is different: the wing is not stalled and the speed rises fast.',
    'Flat spins, aft CG and a blanketed rudder make recovery hard or impossible; recovery technique is aircraft-specific.'
  ],
  pitfalls: [
    'A spin needs a low airspeed — It needs a stalled wing. A wing can stall at any speed if the angle of attack is high enough, for example in a hard pull-up, so an accelerated spin can begin at a surprisingly high speed.',
    'A spin and a spiral dive are the same thing — In a spin the wing is stalled and the airspeed stays low; in a spiral dive the wing is flying and the speed and load factor build rapidly. The physics — and the correct response — differ.',
    'Pulling back on the stick stops a spin — Pulling back raises the angle of attack and keeps the wing stalled; autorotation can only stop once the angle of attack is below the stall.'
  ],
  formulas: [
    {
      name: 'Descent speed in a developed spin',
      expr: 'Vd = sqrt(2*m*g/(rho*S*CR))', tex: 'V_d = \\sqrt{\\dfrac{2 m g}{\\rho S C_R}}',
      vars: {
        Vd: { name: 'descent speed', q: 'speed', unit: 'm/s', tex: 'V_d' },
        m: { name: 'aircraft mass', q: 'mass', unit: 'kg', value: 1000, tex: 'm' },
        g: { const: 'g' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        S: { name: 'wing area', q: 'area', unit: 'm²', value: 16.2, tex: 'S' },
        CR: { name: 'resultant-force coefficient of the stalled wing', value: 1.1, min: 0.5, max: 2, tex: 'C_R' }
      },
      note: 'A rough balance of weight against the aerodynamic force of a wing at high angle of attack; real spins vary with the aircraft and its loading.',
      practice: { unknowns: ['Vd', 'CR'] },
      stories: {
        Vd: 'An aircraft of {m} with {S} of wing spins with a resultant-force coefficient of {CR} in air of density {rho}. How fast does it descend?',
        CR: 'An aircraft of {m} with {S} of wing descends at {Vd} in a spin, in air of density {rho}. What resultant-force coefficient does that imply?'
      }
    },
    {
      name: 'Height lost per turn',
      expr: 'dh = Vd*Tt', tex: '\\Delta h = V_d\\, T_t',
      vars: {
        dh: { name: 'height lost per turn', q: 'length', unit: 'm', tex: '\\Delta h' },
        Vd: { name: 'descent speed', q: 'speed', unit: 'm/s', value: 30, tex: 'V_d' },
        Tt: { name: 'time for one turn', q: 'time', unit: 's', value: 2.5, tex: 'T_t' }
      },
      stories: { dh: 'An aircraft descends at {Vd} in a steady spin, taking {Tt} per turn. How much height does each turn cost?' }
    }
  ],
  examples: [
    {
      title: 'How fast a light aircraft spins down',
      q: 'A 1000 kg aircraft with 16.2 m² of wing spins at sea level with $C_R \\approx 1.1$, taking 2.5 s per turn. Find its descent speed and the height lost per turn.',
      steps: [
        '$V_d = \\sqrt{2 \\times 1000 \\times 9.81/(1.225 \\times 16.2 \\times 1.1)} = \\sqrt{898} = 30$ m/s ≈ 5900 ft/min.',
        '$\\Delta h = 30 \\times 2.5 = 75$ m (about 250 ft) per turn.'
      ],
      a: 'About 30 m/s, losing some 75 m every turn — before counting the height needed for the dive after the rotation stops.'
    },
    {
      title: 'Higher up, faster down',
      q: 'The same aircraft spins at 3000 m, where the standard atmosphere gives ρ = 0.909 kg/m³. What is its descent speed?',
      steps: ['$V_d \\propto 1/\\sqrt{\\rho}$: $30 \\times \\sqrt{1.225/0.909} = 30 \\times 1.16 = 34.8$ m/s.'],
      a: 'About 35 m/s true — the same indicated behaviour, but the height goes faster.'
    }
  ],
  quiz: [
    { q: 'In a steady, developed spin, the airspeed is…', choices: ['high and rising', 'low and roughly constant', 'zero', 'oscillating wildly between high and low'], a: 1,
      why: 'The wing is stalled and the aircraft descends at a steady rate on a helix; the indicated airspeed stays low and nearly constant. Rising speed indicates a spiral dive.' },
    { q: 'Autorotation of a stalled wing happens because, beyond the stall…', choices: ['lift increases faster with angle of attack', 'lift decreases as the angle of attack increases', 'drag falls to zero', 'the aileron becomes more effective'], a: 1,
      why: 'Past C_L,max the lift curve slopes downward, so the down-going wing (at the higher angle) loses lift and the rolling moment reinforces the roll.' },
    { q: 'An aircraft can spin only if its wing is stalled.', a: true,
      why: 'Autorotation needs the wing beyond the stall. That is why a spin can begin at any speed at which the wing is stalled, and why unstalling the wing is central to recovery.' },
    { q: 'Estimate the spin descent speed (m/s) of an 800 kg aircraft with 15 m² of wing and C_R = 1.2 at sea level.', answer: 26.7, unit: 'm/s',
      why: 'V_d = √(2 × 800 × 9.81/(1.225 × 15 × 1.2)) = √(15 696/22.05) = √712 = 26.7 m/s.' },
    { q: 'Why does an aft CG make spins more dangerous?', choices: ['it makes the stall speed higher', 'it tends to flatten the spin and weaken the controls\' power to recover', 'it increases the descent rate only', 'it has no effect on spins'], a: 1,
      why: 'With the CG aft the tail has a shorter arm and the aircraft is less stable in pitch, so the spin flattens, the angle of attack rises and the elevator and rudder struggle to break it.' }
  ],
  applications: ['Spin testing of new aircraft types with anti-spin parachutes.', 'Spin-resistant wing designs, such as drooped outer leading edges, from NASA research of the 1970s and 1980s.', 'Stall and spin awareness training for pilots.'],
  history: 'Spins killed many early aviators before anyone understood them. In 1917 the physicist Frederick Lindemann, having worked out the aerodynamics, learned to fly at Farnborough and deliberately spun an aircraft to show that recovery could be analysed and taught.'
}

);
