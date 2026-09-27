/* HYPER-HYDRAULICS · content/pumps.js — the branch "Pumps and Turbines":
 *   centrifugal-pumps  centrifugal-pump, pump-head-power, pump-curves, system-curve, operating-point,
 *                      affinity-laws, specific-speed, pumps-series-parallel
 *   cavitation-npsh    cavitation, npsh, priming-suction
 *   hydro-turbines     hydropower, pelton-wheel, francis-kaplan, pumped-storage
 * Simulations in sims/pumps.js (ids pump-*). The example pump used throughout (and in the sims):
 * 1450 rpm, BEP 100 m³/h at 32 m and 78 %, shut-off head 40 m, NPSHr 2.0 m at the BEP. */
Hyper.add(

/* ================================================================ CENTRIFUGAL PUMPS */
{
  id: 'centrifugal-pump', parent: 'centrifugal-pumps', title: 'The centrifugal pump', level: 1,
  short: 'A spinning impeller flings liquid outwards and a volute or diffuser turns its speed into pressure. The head it gives grows with the square of the tip speed, and Euler\'s equation says exactly how much energy the vanes hand over.',
  keywords: ['centrifugal pump', 'impeller', 'volute', 'diffuser', 'eye', 'vane', 'tip speed', 'Euler pump equation', 'velocity triangle', 'backward-curved', 'wear ring', 'mechanical seal', 'multistage', 'head', 'slip'],
  prereq: ['energy-equation', 'physics:angular-momentum', 'physics:uniform-circular-motion'],
  related: ['pump-head-power', 'pump-curves', 'specific-speed', 'positive-displacement', 'priming-suction', 'cavitation', 'francis-kaplan', 'aerodynamics:propellers'],
  body: `
A centrifugal pump is a spinning wheel that throws liquid outwards. The **impeller** — a disc of curved **vanes** between two shrouds — turns inside a **casing**. Liquid arrives along the shaft axis into the **eye** at the centre, the vanes carry it round and outwards, and it leaves the rim fast and swirling. The casing collects it: either a **volute**, a spiral passage that widens towards the outlet, or a ring of fixed **diffuser** vanes. Both slow the liquid down and turn most of its speed into pressure, as the [[energy-equation|energy equation]] says they must. A shaft seal (today usually a mechanical seal) stops the liquid escaping along the shaft, and **wear rings** — a running clearance of a few tenths of a millimetre — limit the leakage from the high-pressure outlet back to the eye.

### Head comes from tip speed
The energy handed to each kilogram depends on how fast the rim of the impeller moves, the **tip speed** $u_2 = \\pi D_2 n$. A good first estimate of the head at the best-efficiency point is

$$H \\approx \\psi\\,\\frac{u_2^2}{2g}, \\qquad \\psi \\approx 0.9 \\text{ to } 1.1$$

so the head grows with the **square** of both diameter and speed:

| Impeller $D_2$ | 1450 rpm (4-pole motor) | 2900 rpm (2-pole motor) |
|---|---|---|
| 160 mm | $u_2$ = 12.1 m/s, $H$ ≈ 7.5 m | 24.3 m/s, ≈ 30 m |
| 250 mm | 19.0 m/s, ≈ 18 m | 38.0 m/s, ≈ 73 m |
| 400 mm | 30.4 m/s, ≈ 47 m | 60.7 m/s, ≈ 190 m |

For more head than one impeller can give, several are put in series on one shaft: **multistage** pumps feed boilers, high-rise buildings and reverse-osmosis plants with hundreds or even thousands of metres of head.

### Euler's equation
Exactly how much energy the vanes hand over follows from [[physics:angular-momentum|angular momentum]]: the torque on the liquid equals the rate at which its moment of momentum grows. Per unit weight of liquid this gives **Euler's pump equation**

$$H_E = \\frac{u_2 c_{u2} - u_1 c_{u1}}{g}$$

where $c_u$ is the tangential (swirl) part of the liquid's absolute velocity at the outlet (2) and the inlet (1). Liquid usually enters without swirl, $c_{u1} = 0$, so only the outlet matters. The outlet swirl comes from the **velocity triangle**: the liquid slides along the vane, relative to the impeller, with velocity $\\vec w_2$, and its absolute velocity is $\\vec c_2 = \\vec u_2 + \\vec w_2$ — a [[physics:relative-velocity|relative-velocity]] sum. With **backward-curved** vanes (outlet angle $\\beta_2$ of 15–35° to the tangent) the more flow is pushed through, the more $\\vec w_2$ points backwards, the less swirl is left and the lower the head: a falling, stable curve.

Real pumps give less. The liquid does not follow the vanes perfectly (**slip**, which costs 10–25 % of the ideal head), and friction and turbulence take another 5–15 % (**hydraulic losses**). A real pump typically delivers 65–80 % of the Euler head of its vane angles.

### Head, not pressure
A centrifugal pump gives the same **head** to any thin liquid: the same impeller at the same speed lifts water, petrol or milk to the same height. The pressure it adds is $\\rho g H$, so it scales with density — 30 m of head is 2.9 bar in water, 2.2 bar in petrol, and a mere 0.35 kPa in air. That is why a pump full of air cannot suck water up its suction pipe ([[priming-suction]]).

Unlike a [[positive-displacement]] pump, a centrifugal pump does not force a fixed volume through with each turn: its flow depends on the head the system demands, and against a closed valve it simply churns at its shut-off head. That is harmless for a minute, not for an hour — the churned liquid heats up ([[pump-curves]]).

> [!warn] Before opening a pump casing or its pipes: stop the motor and lock it out, close and lock the suction and discharge valves, relieve the pressure and drain the casing — it can hold hot or pressurised liquid. Keep coupling guards in place, and never run a pump dry or against closed valves for long.
`,
  ideas: [
    'The impeller hands energy to the liquid; the volute or diffuser turns its speed into pressure.',
    'Head rises with the square of tip speed, H ≈ u₂²/2g: double the speed, four times the head.',
    'Euler\'s equation, H = (u₂c_u2 − u₁c_u1)/g, is angular momentum per unit weight, read off the velocity triangles.',
    'A pump gives a head in metres of liquid, the same for any thin liquid; the pressure rise is ρgH.',
    'Its flow is not fixed: it depends on the system it feeds, unlike a positive-displacement pump.'
  ],
  pitfalls: [
    'A centrifugal pump makes a fixed pressure — It makes a head; the pressure rise is ρgH, so a denser liquid gets more pressure and a lighter one less, at the same head.',
    'A centrifugal pump pushes a fixed volume with every turn — That is a positive-displacement pump. A centrifugal pump\'s flow depends on the system: close the outlet valve and the flow falls to zero while the impeller keeps turning.',
    'Forward-curved vanes would make better pumps because they give more head — They do give more head per tip speed, but that head rises with flow, which makes operation unstable and lets the power run away; nearly all pumps use backward-curved vanes.'
  ],
  derivation: {
    title: 'Euler\'s pump equation from angular momentum',
    steps: [
      { text: 'Liquid passes through the impeller at a mass rate $\\rho Q$. It enters at radius $r_1$ with swirl velocity $c_{u1}$ and leaves at $r_2$ with $c_{u2}$. The torque the vanes exert equals the rate of increase of its angular momentum:', tex: 'T = \\rho Q\\,(r_2 c_{u2} - r_1 c_{u1})' },
      { text: 'Power is torque times angular speed, and $\\omega r$ is the vane speed $u$ at each radius:', tex: 'P = T\\omega = \\rho Q\\,(u_2 c_{u2} - u_1 c_{u1})' },
      { text: 'Head is energy per unit weight, so divide by the weight flow $\\rho g Q$:', tex: 'H_E = \\frac{P}{\\rho g Q} = \\frac{u_2 c_{u2} - u_1 c_{u1}}{g}' },
      { text: 'With no inlet swirl and vanes at angle $\\beta_2$ to the tangent, the outlet triangle gives $c_{u2} = u_2 - c_{m2}/\\tan\\beta_2$, where $c_{m2} = Q/(\\pi D_2 b_2)$ is the radial velocity through an outlet of width $b_2$:', tex: 'H_E = \\frac{u_2^2}{g} - \\frac{u_2}{g\\,\\pi D_2 b_2 \\tan\\beta_2}\\,Q' },
      { text: 'A straight line that falls with flow for backward-curved vanes ($\\beta_2 < 90°$), is flat for radial vanes and rises for forward-curved ones. Slip and hydraulic losses bend it down into the real pump curve.' }
    ]
  },
  formulas: [
    {
      name: 'Impeller tip speed',
      expr: 'u2 = pi*D2*n', tex: 'u_2 = \\pi D_2 n',
      vars: {
        u2: { name: 'tip speed of the impeller', q: 'speed', unit: 'm/s', tex: 'u_2' },
        D2: { name: 'impeller outside diameter', q: 'length', unit: 'mm', value: 250, tex: 'D_2' },
        n: { name: 'shaft speed', q: 'frequency', unit: 'rpm', value: 1450 }
      },
      note: 'n in revolutions per unit time; the calculator converts rpm.',
      stories: { u2: 'A {D2} impeller turns at {n}. How fast does its rim move?', D2: 'The rim of an impeller turning at {n} must move at {u2}. What diameter is needed?' }
    },
    {
      name: 'Head from tip speed (estimate)',
      expr: 'H = psi*u2^2/(2*g)', tex: 'H = \\psi\\,\\dfrac{u_2^2}{2g}',
      vars: {
        H: { name: 'pump head at the best-efficiency point', q: 'length', unit: 'm' },
        psi: { name: 'head coefficient (about 0.9–1.1 for radial impellers)', value: 1.0, tex: '\\psi' },
        u2: { name: 'impeller tip speed', q: 'speed', unit: 'm/s', value: 19, tex: 'u_2' },
        g: { const: 'g' }
      },
      note: 'A rule of thumb for radial impellers near their best point, not a law: ψ depends on the vane angle and the specific speed.',
      practice: { unknowns: ['H', 'u2'] },
      stories: { H: 'An impeller rim moves at {u2}. Taking a head coefficient of {psi}, roughly what head does the pump give?', u2: 'A single impeller must give {H}. With a head coefficient of {psi}, what tip speed does it need?' }
    },
    {
      name: 'Euler\'s pump equation',
      expr: 'HE = (u2*cu2 - u1*cu1)/g', tex: 'H_E = \\dfrac{u_2 c_{u2} - u_1 c_{u1}}{g}',
      vars: {
        HE: { name: 'Euler (theoretical) head', q: 'length', unit: 'm', tex: 'H_E' },
        u2: { name: 'vane speed at the outlet', q: 'speed', unit: 'm/s', value: 19, tex: 'u_2' },
        cu2: { name: 'swirl velocity at the outlet', q: 'speed', unit: 'm/s', value: 15.2, tex: 'c_{u2}' },
        u1: { name: 'vane speed at the inlet', q: 'speed', unit: 'm/s', value: 7.6, tex: 'u_1' },
        cu1: { name: 'swirl velocity at the inlet (0 without pre-swirl; negative for counter-swirl)', q: 'speed', unit: 'm/s', value: 1, signed: true, tex: 'c_{u1}' },
        g: { const: 'g' }
      },
      note: 'Ideal: no slip and no losses. Most pumps take their liquid in without swirl (c_u1 = 0); pre-swirl in the direction of rotation, from an inlet bend or guide vanes, lowers the head.',
      practice: { unknowns: ['HE', 'cu2'] },
      stories: { HE: 'Liquid leaves an impeller whose rim moves at {u2} with a swirl velocity of {cu2}; it enters with {cu1} of swirl where the vanes move at {u1}. What is the Euler head?', cu2: 'An impeller with a rim speed of {u2} must give an Euler head of {HE}. The liquid enters with {cu1} of swirl where the vanes move at {u1}. What outlet swirl velocity is needed?' }
    }
  ],
  examples: [
    {
      title: 'Two motors, one impeller',
      q: 'A 250 mm impeller is fitted first to a 4-pole motor (1450 rpm), then to a 2-pole motor (2900 rpm). Taking $\\psi = 1.0$, estimate the head in each case.',
      steps: [
        'Tip speed at 1450 rpm: $u_2 = \\pi \\times 0.25 \\times 1450/60 = 18.98$ m/s.',
        'Head: $H \\approx u_2^2/2g = 18.98^2/19.62 = 18.4$ m.',
        'At 2900 rpm the tip speed doubles to 37.96 m/s and the head is four times as large: $37.96^2/19.62 = 73.4$ m.',
        'The flow at the best point doubles too ([[affinity-laws]]), so the power rises eightfold: the 2-pole version needs a far bigger motor.'
      ],
      a: 'About 18 m at 1450 rpm and 73 m at 2900 rpm.'
    },
    {
      title: 'Euler head from the outlet triangle',
      q: 'An impeller has $D_2$ = 250 mm, an outlet width $b_2$ = 20 mm and vanes at $\\beta_2$ = 25° to the tangent. At 1450 rpm it passes 100 m³/h with no inlet swirl. Find the Euler head, then allow for slip (slip factor 0.83) and a hydraulic efficiency of 85 %.',
      steps: [
        '$u_2 = 18.98$ m/s. Radial velocity through the outlet: $c_{m2} = Q/(\\pi D_2 b_2) = 0.02778/(\\pi \\times 0.25 \\times 0.020) = 1.77$ m/s.',
        'Outlet swirl if the liquid followed the vanes exactly: $c_{u2} = u_2 - c_{m2}/\\tan 25° = 18.98 - 1.77 \\times 2.145 = 15.19$ m/s.',
        'Euler head: $H_E = u_2 c_{u2}/g = 18.98 \\times 15.19/9.81 = 29.4$ m.',
        'With slip the swirl is $0.83 \\times 18.98 - 3.79 = 12.0$ m/s, giving 23.3 m; 85 % of that is 19.8 m — close to the tip-speed estimate of 18.4 m.'
      ],
      a: 'Euler head 29.4 m; about 20 m in practice.'
    }
  ],
  quiz: [
    { q: 'A pump gives 30 m of head on water. On a thin liquid of density 800 kg/m³, at the same speed and flow, the pressure rise across it is…', choices: ['the same as with water', '20 % lower than with water', '25 % higher than with water', 'zero: it cannot pump it'], a: 1,
      why: 'The head (in metres of the liquid) stays the same; the pressure rise is ρgH, so it falls in proportion to the density.' },
    { q: 'Doubling the speed of a centrifugal pump roughly…', choices: ['doubles its head', 'quadruples its head', 'halves its head', 'leaves its head unchanged'], a: 1,
      why: 'Head goes with the square of tip speed, H ≈ ψu₂²/2g.' },
    { q: 'A centrifugal pump whose casing is full of air lifts water up its suction pipe just as well as when it is primed.', a: false,
      why: 'It gives the same head in metres of air — about 1/800 of the pressure it makes in water. A few centimetres of water is all it can lift.' },
    { q: 'What is the tip speed of a 320 mm impeller at 1450 rpm?', answer: 24.3, unit: 'm/s',
      why: 'u₂ = πDn = π × 0.32 × 1450/60 = 24.3 m/s.' },
    { q: 'Why do almost all centrifugal pumps use backward-curved vanes?', choices: ['they give the highest head per tip speed', 'their head falls steadily as flow rises, giving stable running and good efficiency', 'they need no casing', 'they cannot cavitate'], a: 1,
      why: 'With backward vanes the outlet swirl, and so the head, falls as the flow rises: a stable curve. Forward-curved vanes give more head per tip speed but a rising, unstable curve.' }
  ],
  problems: [
    { q: 'A single-stage pump must give 45 m of head at 2900 rpm. Taking a head coefficient ψ = 1.0, what impeller diameter is needed?', answer: 196, unit: 'mm', tol: 0.02,
      steps: ['Tip speed: $u_2 = \\sqrt{2gH/\\psi} = \\sqrt{2 \\times 9.81 \\times 45} = 29.7$ m/s.', 'Diameter: $D_2 = u_2/(\\pi n) = 29.7/(\\pi \\times 2900/60) = 0.196$ m = 196 mm.'] }
  ],
  applications: ['Water supply, drainage and irrigation — by far the most common machine in water engineering.', 'Heating and chilled-water circuits in buildings, from 50 W circulators to hundreds of kilowatts.', 'Boiler feed and reverse-osmosis plants, with multistage pumps giving hundreds to thousands of metres of head.', 'Car engine cooling, fire pumps, process plants and slurry dredging.'],
  history: 'Denis Papin described a centrifugal pump with straight vanes in 1689. Leonhard Euler derived the turbine equation that bears his name in the 1750s. The pump became efficient when John Appold showed curved vanes at the Great Exhibition in London in 1851, and in 1875 Osborne Reynolds patented a pump with guide vanes round the impeller — the ancestor of the diffuser and of the multistage pump.',
  sim: 'pump-triangles'
},

{
  id: 'pump-head-power', parent: 'centrifugal-pumps', title: 'Pump head, power and efficiency', level: 1,
  short: 'Head is the energy a pump gives each newton of liquid, measured in metres and read from two pressure gauges. Hydraulic power is ρgQH; the shaft must supply that divided by the efficiency, which collects hydraulic, leakage and mechanical losses.',
  keywords: ['pump head', 'total dynamic head', 'hydraulic power', 'shaft power', 'water power', 'efficiency', 'wire-to-water', 'volumetric efficiency', 'disc friction', 'life-cycle cost', 'kWh per cubic metre', 'suction gauge', 'discharge gauge'],
  prereq: ['centrifugal-pump', 'energy-equation', 'physics:power'],
  related: ['pump-curves', 'operating-point', 'pressure-flow-power', 'physics:efficiency', 'gauge-absolute', 'hydropower'],
  body: `
A pump's job is described by two numbers: how much liquid it moves, the **flow** $Q$, and how much energy it gives each unit of weight of that liquid, the **head** $H$. Head is measured in metres because an energy per newton (J/N) *is* a length: the height the pump could lift the liquid if all its energy went into lifting.

### Head from two gauges
Across the pump, the [[energy-equation|energy equation]] gives the head as the rise in pressure head, velocity head and height from the suction flange (s) to the discharge flange (d):

$$H = \\frac{p_d - p_s}{\\rho g} + \\frac{V_d^2 - V_s^2}{2g} + \\Delta z$$

Both pressures may be gauge pressures — the atmosphere cancels in the difference — but the suction reading is often **negative**, below atmospheric, when the pump lifts from a sump. The velocity term is small when the two pipes are of similar size; $\\Delta z$ is the height of the discharge gauge above the suction gauge. Acceptance tests follow ISO 9906:2012, and the published curves come from the same measurement on a test stand.

### Hydraulic power and shaft power
Lifting a weight flow $\\rho g Q$ through a head $H$ takes the **hydraulic power** (water power)

$$P_h = \\rho g Q H$$

and the shaft must supply more, because the pump is not perfect: $P = \\rho g Q H/\\eta$. The pump efficiency $\\eta$ gathers three kinds of loss:

- **hydraulic** — friction on the vanes and casing, turbulence, and shock where the liquid meets the vanes at the wrong angle ($\\eta_h$ ≈ 0.85–0.95);
- **volumetric** — liquid leaking back from the outlet to the eye through the wear-ring gaps and balance holes, so the impeller handles more than it delivers ($\\eta_v$ ≈ 0.90–0.98);
- **mechanical** — bearings, the shaft seal and **disc friction**, the drag of the shrouds spinning in the liquid ($\\eta_m$ ≈ 0.95–0.99).

Small pumps suffer most, because leakage and disc friction do not shrink with the flow:

| Pump | Flow | Head | Efficiency | Shaft power |
|---|---|---|---|---|
| Heating circulator (with its motor) | 2 m³/h | 5 m | ≈ 35 % | ≈ 80 W |
| End-suction pump in a building | 100 m³/h | 32 m | ≈ 78 % | 11 kW |
| Split-case water-supply pump | 1500 m³/h | 80 m | ≈ 88 % | 370 kW |
| Power-station cooling-water pump | 30 000 m³/h | 20 m | ≈ 90 % | 1.8 MW |

The motor adds its own loss (a 15 kW motor is about 92–93 % efficient, a variable-speed drive 97–98 %), so the **wire-to-water** efficiency is the product of all of them.

### Energy per cubic metre
Dividing the power by the flow gives the energy to pump one cubic metre, $\\rho g H/\\eta$. Lifting water 100 m at 75 % costs 0.36 kWh per m³. Pumps run for decades, so the electricity they use is usually by far the largest part of their **life-cycle cost** — often many times the purchase price. A few points of efficiency, or a pump that runs where its efficiency is highest, pay back quickly.

> [!key] Power = ρgQH/η. The job sets the head and the flow; efficiency is what the designer and the operator can win.

> [!tip] At the same head and flow, the power is proportional to the density: brine at 1200 kg/m³ takes 20 % more than water and can overload a motor that was sized for water.
`,
  ideas: [
    'Head is energy per unit weight: metres of the liquid being pumped.',
    'From gauges: the pressure difference over ρg, plus the change in velocity head, plus the height between the gauges.',
    'Hydraulic power is ρgQH; the shaft power is that divided by the pump efficiency.',
    'Efficiency combines hydraulic, volumetric and mechanical losses; small pumps are the least efficient.',
    'Over a pump\'s life, its energy costs far more than the pump.'
  ],
  pitfalls: [
    'The suction gauge can be read as a positive number like the discharge gauge — When the pump lifts from below, the suction gauge reads a vacuum: it must be entered as a negative gauge pressure (or both converted to absolute), or the head is wrong by twice that vacuum.',
    'A pump takes the same power whatever it pumps — At the same head and flow the power is proportional to the density; a denser liquid needs proportionally more.',
    'Pump efficiency is a fixed number — It varies along the curve and peaks at one flow, the best-efficiency point.'
  ],
  formulas: [
    {
      name: 'Pump head from gauge readings',
      expr: 'H = (pd - ps)/(rho*g) + (vd^2 - vs^2)/(2*g) + dz',
      tex: 'H = \\dfrac{p_d - p_s}{\\rho g} + \\dfrac{V_d^2 - V_s^2}{2g} + \\Delta z',
      vars: {
        H: { name: 'pump head', q: 'length', unit: 'm' },
        pd: { name: 'discharge pressure (gauge)', q: 'pressure', unit: 'kPa', value: 290, signed: true, tex: 'p_d' },
        ps: { name: 'suction pressure (gauge; negative below atmospheric)', q: 'pressure', unit: 'kPa', value: -20, signed: true, tex: 'p_s' },
        rho: { name: 'liquid density', q: 'density', unit: 'kg/m³', value: 998, tex: '\\rho' },
        g: { const: 'g' },
        vd: { name: 'velocity in the discharge pipe', q: 'speed', unit: 'm/s', value: 2.26, tex: 'V_d' },
        vs: { name: 'velocity in the suction pipe', q: 'speed', unit: 'm/s', value: 1.57, tex: 'V_s' },
        dz: { name: 'height of the discharge gauge above the suction gauge', q: 'length', unit: 'm', value: 0.3, signed: true, tex: '\\Delta z' }
      },
      note: 'Both pressures gauge, or both absolute: the atmosphere cancels. Take them at the flanges, or correct for the pipe losses between gauge and flange.',
      practice: { unknowns: ['H', 'pd'] },
      stories: {
        H: 'A pump\'s suction gauge reads {ps} and its discharge gauge {pd}. The liquid ({rho}) moves at {vs} in the suction pipe and {vd} in the discharge pipe, and the discharge gauge is {dz} higher. What head does the pump give?',
        pd: 'A pump must give {H} of head. Its suction gauge reads {ps}; the pipe velocities are {vs} and {vd} and the discharge gauge is {dz} higher. What should the discharge gauge read ({rho})?'
      }
    },
    {
      name: 'Hydraulic power',
      expr: 'Ph = rho*g*Q*H', tex: 'P_h = \\rho g Q H',
      vars: {
        Ph: { name: 'hydraulic (water) power', q: 'power', unit: 'kW', tex: 'P_h' },
        rho: { name: 'liquid density', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        g: { const: 'g' },
        Q: { name: 'flow', q: 'flowrate', unit: 'm³/h', value: 100 },
        H: { name: 'pump head', q: 'length', unit: 'm', value: 32 }
      },
      stories: { Ph: 'A pump delivers {Q} of liquid ({rho}) against {H} of head. How much power does the liquid receive?', H: 'A pump puts {Ph} into {Q} of water ({rho}). What head does it give?' }
    },
    {
      name: 'Shaft power',
      expr: 'P = rho*g*Q*H/eta', tex: 'P = \\dfrac{\\rho g Q H}{\\eta}',
      vars: {
        P: { name: 'shaft power', q: 'power', unit: 'kW' },
        rho: { name: 'liquid density', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        g: { const: 'g' },
        Q: { name: 'flow', q: 'flowrate', unit: 'm³/h', value: 100 },
        H: { name: 'pump head', q: 'length', unit: 'm', value: 32 },
        eta: { name: 'pump efficiency', q: 'ratio', unit: '%', value: 78, min: 1, max: 100, tex: '\\eta' }
      },
      note: 'Divide further by the motor (and drive) efficiency for the electrical input.',
      practice: { unknowns: ['P', 'Q', 'eta'] },
      stories: {
        P: 'A pump moves {Q} of liquid ({rho}) against {H} at {eta} efficiency. What shaft power does it need?',
        Q: 'A pump with {P} on its shaft works at {eta} against {H} ({rho}). What flow does it deliver?',
        eta: 'A pump taking {P} delivers {Q} against {H} ({rho}). What is its efficiency?'
      }
    },
    {
      name: 'Energy to pump one cubic metre',
      expr: 'ev = rho*g*H/(3600000*eta)', tex: 'e_V = \\dfrac{\\rho g H}{3.6\\times10^{6}\\,\\eta}',
      vars: {
        ev: { name: 'energy per cubic metre pumped', q: false, unit: 'kWh/m³', tex: 'e_V' },
        rho: { name: 'liquid density', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        g: { const: 'g' },
        H: { name: 'pump head', q: 'length', unit: 'm', value: 100 },
        eta: { name: 'efficiency (pump, or wire-to-water)', q: 'ratio', unit: '%', value: 75, min: 1, max: 100, tex: '\\eta' }
      },
      note: 'ρgH/η in J/m³; dividing by 3.6 × 10⁶ J/kWh gives kWh per m³.',
      practice: { unknowns: ['ev', 'H'] },
      stories: { ev: 'Water ({rho}) is lifted through {H} at {eta} overall efficiency. How much electricity does each cubic metre take?', H: 'A pumping station uses {ev} at {eta} wire-to-water efficiency ({rho}). What head does it work against?' }
    }
  ],
  examples: [
    {
      title: 'Reading the gauges',
      q: 'A pump delivers 100 m³/h of water at 20 °C (998 kg/m³). The suction gauge reads −20 kPa and the discharge gauge 290 kPa; the suction pipe is 150 mm, the discharge 125 mm, and the discharge gauge sits 0.3 m above the suction gauge. What is the pump head?',
      steps: [
        'Velocities: $Q = 0.02778$ m³/s; $V_s = Q/(\\pi 0.15^2/4) = 1.57$ m/s; $V_d = Q/(\\pi 0.125^2/4) = 2.26$ m/s.',
        'Pressure head: $(290 - (-20))\\times10^3/(998 \\times 9.81) = 31.66$ m — note the minus sign on the suction reading.',
        'Velocity head gained: $(2.26^2 - 1.57^2)/19.62 = 0.14$ m. Height: 0.3 m.',
        'Total: $H = 31.66 + 0.14 + 0.30 = 32.1$ m.'
      ],
      a: 'About 32.1 m of head.'
    },
    {
      title: 'Sizing the motor and the bill',
      q: 'The pump of the previous example gives 32 m at 100 m³/h with an efficiency of 78 %; its motor is 93 % efficient. What are the hydraulic, shaft and electrical powers, and the energy used in 6000 hours a year? At run-out (150 m³/h) the curve shows 14.0 kW on the shaft.',
      steps: [
        'Hydraulic power: $P_h = 1000 \\times 9.81 \\times 0.02778 \\times 32 = 8.72$ kW.',
        'Shaft power: $8.72/0.78 = 11.2$ kW. Electrical input: $11.2/0.93 = 12.0$ kW.',
        'Energy: $12.0 \\times 6000 = 72\\,000$ kWh a year — 0.12 kWh for every cubic metre delivered.',
        'The motor must also cover run-out, where the shaft needs 14.0 kW: a 15 kW motor is chosen.'
      ],
      a: '8.7 kW hydraulic, 11.2 kW shaft, 12.0 kW electrical; about 72 MWh a year; a 15 kW motor.'
    }
  ],
  quiz: [
    { q: 'A pump moves 50 L/s of water against 40 m at 75 % efficiency. What shaft power does it need?', answer: 26.2, unit: 'kW',
      why: 'P = ρgQH/η = 1000 × 9.81 × 0.05 × 40/0.75 = 26.2 kW.' },
    { q: 'The same pump, at the same head and flow, is switched from water to a brine of 1200 kg/m³. The shaft power…', choices: ['stays the same', 'rises by 20 %', 'falls by 20 %', 'rises by 44 %'], a: 1,
      why: 'Power is ρgQH/η: at the same Q and H it is proportional to density.' },
    { q: 'A pump\'s efficiency is the same at every point on its curve.', a: false,
      why: 'Efficiency is zero at shut-off, peaks at the best-efficiency point and falls again towards run-out.' },
    { q: 'Why are very small pumps much less efficient than large ones?', choices: ['their pipes are rougher', 'leakage through clearances and disc friction do not shrink in proportion to the flow', 'their motors run faster', 'they always cavitate'], a: 1,
      why: 'Clearances and surface finish cannot be scaled down with the pump, so leakage and friction take a larger share of a small flow.' },
    { q: 'A suction gauge reads −30 kPa and the discharge gauge 270 kPa; the pipes are the same size and the gauges at the same height. What head does the pump give on water (1000 kg/m³)?', answer: 30.6, unit: 'm',
      why: 'H = (270 − (−30)) × 10³/(1000 × 9.81) = 30.6 m.' }
  ],
  problems: [
    { q: 'A borehole pump lifts water 85 m with a wire-to-water efficiency of 55 %. How much electricity does each cubic metre take?', answer: 0.421, unit: 'kWh/m³', tol: 0.02,
      steps: ['$e = \\rho g H/\\eta = 1000 \\times 9.81 \\times 85/0.55 = 1.516\\times10^6$ J/m³.', 'Divide by $3.6\\times10^6$ J/kWh: 0.421 kWh per m³.'] }
  ],
  applications: ['Energy audits of pumping stations: comparing measured wire-to-water efficiency with the pump curve.', 'Motor sizing, which must cover the whole range of flows the pump may see.', 'Water utilities, where pumping is often the largest single use of electricity.'],
  sim: 'pump-operating'
},

{
  id: 'pump-curves', parent: 'centrifugal-pumps', title: 'Pump performance curves', level: 2,
  short: 'A pump is described by four curves against flow at a fixed speed: head, efficiency, shaft power and NPSH required. They show the shut-off head, the best-efficiency point, where the motor load is highest and where the pump likes to run.',
  keywords: ['pump curve', 'H-Q curve', 'performance curve', 'best efficiency point', 'BEP', 'shut-off head', 'run-out', 'power curve', 'NPSHr curve', 'impeller trim', 'preferred operating region', 'minimum flow', 'drooping curve', 'dead-head', 'recirculation'],
  prereq: ['pump-head-power', 'centrifugal-pump'],
  related: ['system-curve', 'operating-point', 'affinity-laws', 'npsh', 'specific-speed', 'pumps-series-parallel'],
  body: `
Every pump comes with a set of curves, measured on a test stand at a fixed speed. Together they tell you how it will behave — if you read all of them, not just the head.

### The four curves
- **Head–flow (H–Q)**: head falls as the flow rises. At zero flow the pump gives its **shut-off head**, for radial pumps typically 10–30 % above the head at the best point; at the far end, the **run-out**, the curve stops where the maker stopped testing.
- **Efficiency–flow (η–Q)**: a hill whose top is the **best-efficiency point (BEP)** — the flow the impeller and casing were designed for, where the liquid meets the vanes without shock.
- **Power–flow (P–Q)**: for radial pumps the shaft power rises with flow and is greatest at run-out, so the motor is chosen for the run-out power (a "non-overloading" selection). For mixed-flow and axial pumps it is the other way round — power is highest at shut-off, and they are started with the valve open ([[specific-speed]]).
- **NPSH required–flow**: the suction head the pump needs to avoid serious cavitation; it climbs steeply beyond the BEP ([[npsh]]).

A catalogue sheet usually shows several H–Q curves for different **impeller diameters** — the casing is the same and the impeller is turned down to fit the duty — with islands of equal efficiency drawn across them. Here is a typical end-suction pump at 1450 rpm, the one used in the simulations:

| Q (m³/h) | 0 | 50 | 80 | 100 (BEP) | 120 | 150 |
|---|---|---|---|---|---|---|
| Head (m) | 40.0 | 38.0 | 34.9 | 32.0 | 28.5 | 22.0 |
| Efficiency (%) | 0 | 62 | 76 | 78 | 76 | 64 |
| Shaft power (kW) | 5.6 | 8.4 | 10.1 | 11.2 | 12.3 | 14.0 |
| NPSHr (m) | 1.2 | 1.4 | 1.7 | 2.0 | 2.4 | 3.0 |

Near the BEP a parabola fits the head curve well: $H = H_0 - (H_0 - H_b)(Q/Q_b)^2$.

### Where a pump likes to run
Away from its BEP a pump is not only less efficient but rougher. At part load the flow separates and **recirculates** in the eye and at the outlet, the uneven pressure round a volute pushes the shaft sideways (radial thrust), vibration and noise rise, and seals and bearings wear. Beyond the BEP the velocities rise, NPSHr climbs and cavitation threatens. Hence a **preferred operating region** of roughly 70–120 % of BEP flow — the band described by API 610 (12th edition, 2021) and the Hydraulic Institute — and a maker's **minimum continuous flow**, often 20–40 % of BEP flow.

### Steep, flat and drooping curves
A **steep** curve keeps the flow nearly constant when the head changes — good where the static head varies. A **flat** curve keeps the pressure nearly constant as consumers open and close — good for pressure boosting. A **drooping** curve, whose head *rises* from shut-off before falling, can cut a system curve twice and make pumps in parallel hunt; it is best avoided where there is static head.

### Churning at shut-off
At zero flow all the shaft power becomes heat in a few litres of liquid. The temperature rise of the liquid passing through a pump is $\\Delta T = gH(1-\\eta)/(c\\,\\eta)$: only 0.02 K at the BEP here, but growing without limit as the flow, and with it the efficiency, goes to zero.

> [!warn] A pump running against a closed valve heats its contents steadily. With hot water or a small casing the liquid can flash to steam and the casing can burst. Protect pumps that may run at very low flow with a minimum-flow bypass, and never leave one churning.
`,
  ideas: [
    'Read four curves, not one: head, efficiency, power and NPSH required, all against flow at one speed.',
    'The best-efficiency point is where the pump was designed to run; stay within roughly 70–120 % of its flow.',
    'Radial pumps draw most power at run-out; axial pumps at shut-off.',
    'Low flow brings recirculation, radial thrust and heating; high flow brings cavitation.',
    'At shut-off every watt heats the liquid in the casing.'
  ],
  pitfalls: [
    'A pump can run anywhere on its curve as long as the motor is not overloaded — Far from the BEP it vibrates, recirculates, heats or cavitates, and wears out its seals and bearings early.',
    'Power is lowest at shut-off for every pump — True for radial pumps; for mixed-flow and axial pumps the power is highest at shut-off, so starting against a closed valve can trip or burn the motor.',
    'The last point of the published curve is a safe duty — Run-out is simply where testing stopped: power and NPSH required are at their highest there.'
  ],
  formulas: [
    {
      name: 'Pump curve near the BEP (parabola)',
      expr: 'H = H0 - (H0 - Hb)*(Q/Qb)^2', tex: 'H = H_0 - (H_0 - H_b)\\left(\\dfrac{Q}{Q_b}\\right)^2',
      vars: {
        H: { name: 'pump head at flow Q', q: 'length', unit: 'm' },
        H0: { name: 'shut-off head (zero flow)', q: 'length', unit: 'm', value: 40, tex: 'H_0' },
        Hb: { name: 'head at the best-efficiency point', q: 'length', unit: 'm', value: 32, tex: 'H_b' },
        Q: { name: 'flow', q: 'flowrate', unit: 'm³/h', value: 80 },
        Qb: { name: 'flow at the best-efficiency point', q: 'flowrate', unit: 'm³/h', value: 100, tex: 'Q_b' }
      },
      note: 'A fit, not a law: good within about 50–150 % of the BEP flow for radial pumps.',
      practice: { unknowns: ['H', 'Q'] },
      stories: { H: 'A pump has a shut-off head of {H0} and gives {Hb} at its best point of {Qb}. What head does it give at {Q}?', Q: 'A pump with a shut-off head of {H0} gives {Hb} at {Qb}. At what flow does it give {H}?' }
    },
    {
      name: 'Temperature rise of the liquid through a pump',
      expr: 'dT = g*H*(1 - eta)/(c*eta)', tex: '\\Delta T = \\dfrac{g H\\,(1-\\eta)}{c\\,\\eta}',
      vars: {
        dT: { name: 'temperature rise from inlet to outlet', q: 'dtemp', unit: 'K', tex: '\\Delta T' },
        g: { const: 'g' },
        H: { name: 'pump head', q: 'length', unit: 'm', value: 38 },
        eta: { name: 'pump efficiency at that flow', q: 'ratio', unit: '%', value: 20, min: 0.1, max: 100, tex: '\\eta' },
        c: { name: 'specific heat of the liquid', q: 'specificheat', unit: 'J/(kg·K)', value: 4186 }
      },
      note: 'All the losses are assumed to heat the liquid passing through. At zero flow there is no through-flow to carry the heat away: see the next formula.',
      practice: { unknowns: ['dT', 'eta'] },
      stories: { dT: 'At low flow a pump gives {H} with an efficiency of only {eta}. How much warmer is the water ({c}) leaving it?', eta: 'Water ({c}) leaves a pump giving {H} {dT} warmer than it entered. What is the pump\'s efficiency?' }
    },
    {
      name: 'Time for a churning pump to heat its contents',
      expr: 't = m*c*dT/P', tex: 't = \\dfrac{m\\,c\\,\\Delta T}{P}',
      vars: {
        t: { name: 'time', q: 'time', unit: 'min' },
        m: { name: 'mass of liquid trapped in the casing and pipes', q: 'mass', unit: 'kg', value: 15 },
        c: { name: 'specific heat of the liquid', q: 'specificheat', unit: 'J/(kg·K)', value: 4186 },
        dT: { name: 'temperature rise', q: 'dtemp', unit: 'K', value: 80, tex: '\\Delta T' },
        P: { name: 'shaft power at shut-off', q: 'power', unit: 'kW', value: 7 }
      },
      note: 'An upper bound on the time: some heat escapes through the metal, but with hot liquid in a small casing boiling can come within minutes.',
      practice: { unknowns: ['t', 'P'] },
      stories: { t: 'A pump taking {P} at shut-off churns {m} of water ({c}) behind closed valves. How long until the water is {dT} hotter?', P: 'A pump\'s {m} of trapped water ({c}) warmed by {dT} in {t} against a closed valve. What power was it drawing?' }
    }
  ],
  examples: [
    {
      title: 'Reading the curve',
      q: 'The pump in the table must deliver 80 m³/h. What head does it give there, what shaft power does it take, and how far is it from its best point?',
      steps: [
        'Head from the parabola: $H = 40 - 8 \\times (80/100)^2 = 34.9$ m.',
        'Efficiency from the curve: 76 %. Shaft power: $1000 \\times 9.81 \\times 0.02222 \\times 34.9/0.756 = 10.1$ kW.',
        '80 m³/h is 80 % of the BEP flow — inside the preferred operating region of about 70–120 %.'
      ],
      a: '34.9 m, 10.1 kW, at 80 % of the BEP flow.'
    },
    {
      title: 'A pump left churning',
      q: 'A pump takes 7 kW at shut-off. Its casing and the pipe between two closed valves hold 15 kg of water at 20 °C. How soon could the water reach 100 °C?',
      steps: [
        'Heat needed: $m c \\Delta T = 15 \\times 4186 \\times 80 = 5.02\\times10^6$ J.',
        'Time: $t = 5.02\\times10^6/7000 = 718$ s, about 12 minutes.',
        'Some heat leaks through the metal, but the answer is minutes, not hours — and once the water flashes to steam the seal fails and the casing may burst.'
      ],
      a: 'About 12 minutes.'
    }
  ],
  quiz: [
    { q: 'Where on its curve does a radial centrifugal pump draw the most shaft power?', choices: ['at shut-off', 'at the best-efficiency point', 'at run-out, the highest flow', 'the same everywhere'], a: 2,
      why: 'For radial (low specific speed) pumps power rises with flow; that is why motors are sized for run-out.' },
    { q: 'An axial-flow (propeller) pump should be started…', choices: ['against a closed discharge valve, like a radial pump', 'with the discharge valve open', 'dry, then primed', 'only at half speed'], a: 1,
      why: 'Axial pumps draw their highest power at shut-off; starting against a closed valve can overload the motor.' },
    { q: 'Running a pump at 30 % of its best-efficiency flow is harmless as long as the motor is not overloaded.', a: false,
      why: 'At low flow the pump recirculates, suffers radial thrust and vibration, and heats the liquid; its seals and bearings wear fast.' },
    { q: 'A pump with H₀ = 50 m and 40 m at its best point of 200 m³/h follows H = H₀ − (H₀ − H_b)(Q/Q_b)². What head does it give at 250 m³/h?', answer: 34.4, unit: 'm',
      why: 'H = 50 − 10 × (250/200)² = 50 − 15.6 = 34.4 m.' },
    { q: 'A steep head curve is the better choice when…', choices: ['the static head varies a lot but the flow should stay nearly constant', 'many taps open and close and the pressure should stay constant', 'the pump runs at shut-off', 'the liquid is viscous'], a: 0,
      why: 'On a steep curve a change of head moves the flow only a little. A flat curve does the opposite: nearly constant pressure over a wide range of flow.' }
  ],
  problems: [
    { q: 'A pump has a shut-off head of 45 m and gives 36 m at its best point of 60 L/s. Using the parabolic fit, at what flow does it give 30 m?', answer: 77.5, unit: 'L/s', tol: 0.02,
      steps: ['$Q = Q_b\\sqrt{(H_0 - H)/(H_0 - H_b)} = 60\\sqrt{15/9}$.', '$Q = 60 \\times 1.291 = 77.5$ L/s — at 129 % of the BEP flow, near the edge of the preferred region.'] }
  ],
  applications: ['Choosing a pump from a catalogue: the duty should sit a little left of the BEP on a mid-size impeller, leaving room to trim or change speed.', 'Condition monitoring: a head–flow point below the original curve reveals worn wear rings or a damaged impeller.', 'Setting minimum-flow bypasses and motor sizes.'],
  sim: ['pump-operating', 'pump-nq']
},

{
  id: 'system-curve', parent: 'centrifugal-pumps', title: 'The system curve', level: 2,
  short: 'The head a piping system needs to pass each flow: a static part — lift plus any pressure difference — and a dynamic part, the friction and fitting losses, which grow with the square of the flow.',
  keywords: ['system curve', 'system head', 'static head', 'dynamic head', 'friction head', 'head loss', 'closed loop', 'open system', 'throttle', 'control curve', 'pipe ageing', 'Darcy-Weisbach'],
  prereq: ['darcy-weisbach', 'minor-losses', 'energy-equation'],
  related: ['operating-point', 'pump-curves', 'pipe-sizing', 'roughness-ageing', 'friction-factor', 'pipes-series-parallel'],
  body: `
A pump does not decide by itself how much it delivers; the pipes it feeds decide with it. The **system curve** says how much head the system needs to pass each flow.

### Two parts: static and dynamic
$$H_{sys} = H_{st} + h_L(Q)$$

- The **static head** $H_{st}$ is needed even at zero flow: the height from the suction liquid surface to the discharge surface, plus any difference between the pressures on those surfaces, $(p_2 - p_1)/\\rho g$. A pressurised boiler drum or the pressure a spray nozzle needs counts here.
- The **dynamic head** $h_L$ is the friction in the pipes ([[darcy-weisbach]]) plus the losses in bends, valves, strainers and the outlet ([[minor-losses]]):

$$h_L = \\left(\\frac{fL}{D} + \\sum K\\right)\\frac{V^2}{2g}, \\qquad V = \\frac{4Q}{\\pi D^2}$$

In turbulent flow the friction factor $f$ hardly changes with flow, so $h_L$ grows with $Q^2$ and the system curve is a parabola lifted by the static head.

### An example
Water is pumped 20 m up through 280 m of 125 mm steel pipe with bends, two valves, a check valve and an outlet ($\\sum K$ = 6). At 100 m³/h the velocity is 2.26 m/s and the velocity head 0.26 m; with $f$ = 0.018 the losses are $(0.018 \\times 280/0.125 + 6) \\times 0.26 = 12.1$ m:

| Q (m³/h) | 0 | 50 | 80 | 100 | 120 |
|---|---|---|---|---|---|
| System head (m) | 20.0 | 23.0 | 27.7 | 32.1 | 37.4 |

Because $V$ goes as $1/D^2$ and the pipe loss as $V^2/D$, friction head scales as $1/D^5$: the same flow in a 100 mm pipe would lose about three times as much. Choosing a pipe size is a trade between the pipe's cost and the energy to pump through it for its whole life ([[pipe-sizing]]).

### Kinds of systems
- **Closed loops** — heating and chilled-water circuits — have no static head: the liquid returns to where it started, and the curve passes through the origin.
- **Open systems** lifting to a tank have a large static head, and it may **vary**: a tank filling, a river rising, a well drawing down. Draw the curves for the lowest and the highest level; the pump must work across the whole band.
- A **throttle valve** adds a loss that grows as it closes: each opening gives its own, steeper curve.
- **Controlled systems** — a booster set holding the pressure at the far end of a network — follow a control curve set by the controller rather than a fixed parabola.
- **Ageing** pipes grow rougher and scale up. A pump chosen for old pipes runs further out on its curve in a new, clean system ([[roughness-ageing]]).

> [!tip] Engineers add margins to the calculated losses; the real, smaller system curve then puts the pump to the right of its design point. A good estimate of the true system curve is worth more than a safety factor.
`,
  ideas: [
    'System head = static head + losses; the losses grow roughly with the square of the flow.',
    'Static head is the lift plus any pressure difference between the two liquid surfaces.',
    'Closed loops have no static head: their curve starts at the origin.',
    'Friction head goes as 1/D⁵: pipe size matters enormously.',
    'Throttles, changing levels and ageing all move the system curve, and with it the operating point.'
  ],
  pitfalls: [
    'Closing a valve changes the pump curve — It changes the system curve; the pump curve stays where it is and the operating point slides along it.',
    'A closed heating loop must be pumped up to the top of the building — In a closed loop the water going up is balanced by the water coming down; the pump only overcomes friction.',
    'Adding a generous safety margin to the losses is harmless — The pump then runs further right on its curve than intended: more flow, more power, more noise and higher NPSH required.'
  ],
  formulas: [
    {
      name: 'System curve from one design point',
      expr: 'H = Hst + hf*(Q/Qd)^2', tex: 'H = H_{st} + h_f\\left(\\dfrac{Q}{Q_d}\\right)^2',
      vars: {
        H: { name: 'system head at flow Q', q: 'length', unit: 'm' },
        Hst: { name: 'static head (lift plus pressure difference)', q: 'length', unit: 'm', value: 20, signed: true, tex: 'H_{st}' },
        hf: { name: 'loss head at the design flow', q: 'length', unit: 'm', value: 12, tex: 'h_f' },
        Q: { name: 'flow', q: 'flowrate', unit: 'm³/h', value: 70 },
        Qd: { name: 'design flow', q: 'flowrate', unit: 'm³/h', value: 100, tex: 'Q_d' }
      },
      note: 'Assumes fully turbulent flow (a constant friction factor). A negative static head means the delivery point is below the source.',
      practice: { unknowns: ['H', 'Q'] },
      stories: { H: 'A system has {Hst} of static head and {hf} of losses at {Qd}. What head does it need at {Q}?', Q: 'A system with {Hst} of static head loses {hf} at {Qd}. At what flow does it need {H}?' }
    },
    {
      name: 'System head from the pipe',
      expr: 'H = Hst + (f*L/D + K)*(4*Q/(pi*D^2))^2/(2*g)',
      tex: 'H = H_{st} + \\left(\\dfrac{fL}{D} + \\sum K\\right)\\dfrac{1}{2g}\\left(\\dfrac{4Q}{\\pi D^2}\\right)^2',
      vars: {
        H: { name: 'system head', q: 'length', unit: 'm' },
        Hst: { name: 'static head', q: 'length', unit: 'm', value: 20, signed: true, tex: 'H_{st}' },
        f: { name: 'Darcy friction factor', value: 0.018 },
        L: { name: 'pipe length', q: 'length', unit: 'm', value: 280 },
        D: { name: 'pipe inside diameter', q: 'length', unit: 'mm', value: 125 },
        K: { name: 'sum of the minor-loss coefficients, ΣK', value: 6 },
        Q: { name: 'flow', q: 'flowrate', unit: 'm³/h', value: 100 },
        g: { const: 'g' }
      },
      note: 'Take f from the Moody chart or the Colebrook equation at the design flow; it barely changes with flow in fully turbulent pipes.',
      practice: { unknowns: ['H', 'Q', 'D'] },
      stories: {
        H: 'Water is pumped up {Hst} through {L} of pipe of {D} bore (f = {f}, fittings ΣK = {K}) at {Q}. What head must the pump give?',
        Q: 'A pump gives {H} to a system with {Hst} of lift, {L} of {D} pipe (f = {f}) and fittings with ΣK = {K}. What flow passes?',
        D: 'A {L} line lifting {Hst} must pass {Q} with a pump head of {H} (f = {f}, ΣK = {K}). What pipe bore is needed?'
      }
    }
  ],
  examples: [
    {
      title: 'One pipe size smaller',
      q: 'In the example system (20 m lift, 280 m of pipe, ΣK = 6, 100 m³/h) the 125 mm pipe is replaced by a 100 mm one ($f$ ≈ 0.0185). How much more head is needed, and what does it cost in power at 75 % efficiency?',
      steps: [
        'Velocity: $V = 0.02778/(\\pi \\times 0.1^2/4) = 3.54$ m/s; velocity head $3.54^2/19.62 = 0.638$ m.',
        'Losses: $(0.0185 \\times 280/0.1 + 6) \\times 0.638 = (51.8 + 6) \\times 0.638 = 36.9$ m, against 12.1 m before.',
        'System head: $20 + 36.9 = 56.9$ m instead of 32.1 m — 24.8 m more.',
        'Extra power: $1000 \\times 9.81 \\times 0.02778 \\times 24.8/0.75 = 9.0$ kW — about 54 MWh over 6000 hours a year, every year.'
      ],
      a: 'About 25 m more head, costing roughly 9 kW continuously.'
    },
    {
      title: 'A heating loop',
      q: 'A closed heating circuit needs 6 m of head at 20 m³/h. On a mild day the valves call for only 14 m³/h. What head does the loop need then?',
      steps: [
        'A closed loop has no static head, so $H = h_f (Q/Q_d)^2$.',
        '$H = 6 \\times (14/20)^2 = 6 \\times 0.49 = 2.94$ m.'
      ],
      a: 'About 2.9 m — less than half, for 70 % of the flow.'
    }
  ],
  quiz: [
    { q: 'A heating circuit with no open tank has a system curve that…', choices: ['starts at the height of the building', 'passes through the origin', 'is horizontal', 'is a straight line'], a: 1,
      why: 'In a closed loop there is no net lift: at zero flow no head is needed, and the losses grow with Q².' },
    { q: 'The flow through a turbulent pipe system with no static head is doubled. The head it needs…', choices: ['doubles', 'roughly quadruples', 'rises eightfold', 'stays the same'], a: 1,
      why: 'Losses go as V², so as Q².' },
    { q: 'Closing a throttle valve on the discharge changes the pump curve.', a: false,
      why: 'It adds a loss to the system, making the system curve steeper; the pump curve is unchanged.' },
    { q: 'A system has 15 m of static head and 8 m of losses at 60 m³/h. What head does it need at 90 m³/h?', answer: 33, unit: 'm',
      why: 'H = 15 + 8 × (90/60)² = 15 + 18 = 33 m.' },
    { q: 'A pipe of 100 mm bore is replaced by one of 125 mm at the same flow. The friction head falls to about…', choices: ['80 % of what it was', '64 %', 'a third', 'a tenth'], a: 2,
      why: 'Friction head goes as 1/D⁵: (100/125)⁵ = 0.33.' }
  ],
  problems: [
    { q: 'A system has 12 m of static head and 9 m of losses at 150 m³/h. What head does it need at 200 m³/h?', answer: 28, unit: 'm', tol: 0.02,
      steps: ['$H = 12 + 9 \\times (200/150)^2 = 12 + 9 \\times 1.778$.', '$H = 12 + 16 = 28$ m.'] }
  ],
  applications: ['Every pump selection starts from a system curve — or two, for the lowest and highest tank levels.', 'Commissioning: measuring one point of the real system curve shows how far the design margins were off.', 'Pipe sizing, trading pipe cost against pumping energy.'],
  sim: 'pump-operating'
},

{
  id: 'operating-point', parent: 'centrifugal-pumps', title: 'The operating point', level: 2,
  short: 'A pump runs where its head–flow curve crosses the system curve. Throttling, speed, impeller size, tank levels and extra pumps move that point — and throttling wastes the energy that speed control saves.',
  keywords: ['operating point', 'duty point', 'intersection', 'throttling', 'throttle valve', 'variable speed drive', 'VFD', 'bypass', 'oversized pump', 'energy saving', 'impeller trimming', 'hunting', 'unstable curve'],
  prereq: ['pump-curves', 'system-curve'],
  related: ['affinity-laws', 'pumps-series-parallel', 'npsh', 'electronics:pwm', 'electronics:three-phase'],
  body: `
Put a pump into a system and it settles where its curve crosses the system curve: the one flow at which the head the pump gives equals the head the system needs. Nothing else can last. If the flow were larger, the system would need more head than the pump makes and the liquid would slow down; if smaller, the pump's surplus head would speed it up.

### Moving the operating point
- **Throttling** a discharge valve adds a loss and steepens the system curve: the point slides **left** along the pump curve — less flow at *more* pump head, the extra burnt in the valve.
- A **bypass** returns part of the flow to the suction: the pump runs further right while the system gets less. It wastes even more than throttling, but protects a pump that must not run at low flow.
- **Changing speed** moves the whole pump curve ([[affinity-laws]]): the point slides along the system curve, and no head is thrown away.
- **Trimming the impeller** does the same, once and for all.
- **Changing static head** — a tank filling, a river falling — moves the system curve up or down.
- **Adding pumps** in parallel or series builds a new combined pump curve ([[pumps-series-parallel]]).

### Throttling versus speed control
Take the pump of [[pump-curves]] on a system with 20 m of static head and 12 m of losses at 100 m³/h. It runs at 100 m³/h and 32 m, right at its best point. Now only 70 m³/h is wanted:

| | Throttle valve, 1450 rpm | Variable speed, valve open |
|---|---|---|
| Pump speed | 1450 rpm | 1252 rpm |
| Pump head | 36.1 m | 25.9 m |
| System needs | 25.9 m | 25.9 m |
| Burnt in the valve | 10.2 m | 0 |
| Pump efficiency | 72 % | 76 % |
| Shaft power | 9.5 kW | 6.5 kW |

The speed-controlled pump saves 3 kW, almost a third. The saving is larger in systems with little static head — circulating loops, where power falls with the cube of speed — and smaller where static head dominates, because the lift must be paid for however the flow is controlled. The drive itself costs 2–3 % in losses, and slowing below the speed at which the shut-off head equals the static head stops the delivery altogether. The speed is set by a variable-frequency drive, which synthesises the motor's [[electronics:three-phase|three-phase]] supply by [[electronics:pwm|pulse-width modulation]].

### Where it goes wrong
- **Oversizing.** Margins piled on margins give a pump that, unthrottled, runs far to the right of its design point, near run-out, with high power, noise and cavitation. Many pumps are throttled permanently for this reason; trimming the impeller or slowing the pump recovers the energy.
- **Drooping curves and static head.** If the pump curve rises before it falls, a flat system curve can cut it twice; the pump may jump between the two points or hunt.
- **Varying static head.** The operating point moves with the level; it must stay inside the pump's preferred region at both extremes.

> [!key] The pump and the system decide the flow together. To change it, change one of the two curves — and prefer changing the pump's (speed) to spoiling the system's (throttle).
`,
  ideas: [
    'The operating point is where pump head equals system head.',
    'Throttling moves the point left along the pump curve and burns the surplus head in the valve.',
    'Speed control moves the pump curve and wastes nothing; it saves most where static head is small.',
    'Oversized pumps run to the right of their design point unless something reins them in.',
    'Check the operating point at every tank level the system will see.'
  ],
  pitfalls: [
    'The pump sets the flow — The flow is where pump and system curves cross; change either and it changes.',
    'Throttling a pump saves as much energy as slowing it — A throttled pump still makes the extra head and burns it in the valve; slowing the pump avoids making it.',
    'Halving the speed halves the flow in any system — Only in a system with no static head. With a large lift the flow falls much faster, and stops once the shut-off head drops below the static head.'
  ],
  formulas: [
    {
      name: 'Operating point: parabolic pump and system curves',
      expr: 'Q = Qb*sqrt((H0 - Hst)/(H0 - Hb + hf))', tex: 'Q = Q_b\\sqrt{\\dfrac{H_0 - H_{st}}{H_0 - H_b + h_f}}',
      vars: {
        Q: { name: 'operating flow', q: 'flowrate', unit: 'm³/h' },
        Qb: { name: 'pump\'s best-efficiency flow', q: 'flowrate', unit: 'm³/h', value: 100, tex: 'Q_b' },
        H0: { name: 'pump shut-off head', q: 'length', unit: 'm', value: 40, tex: 'H_0' },
        Hst: { name: 'static head of the system', q: 'length', unit: 'm', value: 20, tex: 'H_{st}' },
        Hb: { name: 'pump head at its best point', q: 'length', unit: 'm', value: 32, tex: 'H_b' },
        hf: { name: 'system losses at the flow Q_b', q: 'length', unit: 'm', value: 10, tex: 'h_f' }
      },
      note: 'Sets H₀ − (H₀ − H_b)(Q/Q_b)² equal to H_st + h_f(Q/Q_b)². No real root means the static head exceeds the shut-off head: no flow.',
      practice: { unknowns: ['Q', 'Hst'] },
      stories: { Q: 'A pump with a shut-off head of {H0} gives {Hb} at {Qb}. The system has {Hst} of static head and loses {hf} at {Qb}. At what flow does the pump run?', Hst: 'A pump (shut-off {H0}, {Hb} at {Qb}) must deliver {Q} into a system that loses {hf} at {Qb}. What is the largest static head it can serve?' }
    },
    {
      name: 'Power wasted in a throttle valve',
      expr: 'Pv = rho*g*Q*hv/eta', tex: 'P_v = \\dfrac{\\rho g Q\\,h_v}{\\eta}',
      vars: {
        Pv: { name: 'shaft power spent on the valve\'s loss', q: 'power', unit: 'kW', tex: 'P_v' },
        rho: { name: 'liquid density', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        g: { const: 'g' },
        Q: { name: 'flow', q: 'flowrate', unit: 'm³/h', value: 70 },
        hv: { name: 'head burnt in the valve', q: 'length', unit: 'm', value: 10.2, tex: 'h_v' },
        eta: { name: 'pump efficiency', q: 'ratio', unit: '%', value: 72, min: 1, max: 100, tex: '\\eta' }
      },
      practice: { unknowns: ['Pv', 'hv'] },
      stories: { Pv: 'A throttle valve burns {hv} of head at {Q} ({rho}); the pump is {eta} efficient. How much shaft power goes into the valve?', hv: 'A valve wastes {Pv} of pump power at {Q} ({rho}, pump {eta}). How much head does it burn?' }
    }
  ],
  examples: [
    {
      title: 'Finding the operating point',
      q: 'A pump has a shut-off head of 40 m and gives 32 m at 100 m³/h. The system has 20 m of static head and 10 m of losses at 100 m³/h. Where does the pump run?',
      steps: [
        'Pump: $H = 40 - 8(Q/100)^2$. System: $H = 20 + 10(Q/100)^2$.',
        'Equal when $40 - 20 = (8 + 10)(Q/100)^2$, so $Q = 100\\sqrt{20/18} = 105.4$ m³/h.',
        'Head: $20 + 10 \\times 1.111 = 31.1$ m. The pump runs at 105 % of its BEP flow — fine.'
      ],
      a: '105 m³/h at 31.1 m.'
    },
    {
      title: 'Throttle or slow down?',
      q: 'The same pump serves a system with 20 m of static head and 12 m of losses at 100 m³/h. The demand drops to 70 m³/h. Compare throttling at 1450 rpm with slowing the pump (valve open). Efficiency: 72 % at 70 m³/h on the full-speed curve, 76 % at 81 m³/h.',
      steps: [
        'System needs $20 + 12 \\times 0.7^2 = 25.9$ m. At full speed the pump gives $40 - 8 \\times 0.49 = 36.1$ m, so the valve must burn 10.2 m.',
        'Throttled: $P = 1000 \\times 9.81 \\times 0.01944 \\times 36.1/0.72 = 9.5$ kW.',
        'Slowed: at speed ratio $r$ the curve is $H = 40r^2 - 8(Q/100)^2$. Setting it to 25.9 m at 70 m³/h: $r^2 = (25.9 + 3.92)/40 = 0.745$, $r = 0.863$, 1252 rpm.',
        'That point is similar to 70/0.863 = 81 m³/h at full speed, where the efficiency is 76 %: $P = 1000 \\times 9.81 \\times 0.01944 \\times 25.9/0.76 = 6.5$ kW.'
      ],
      a: 'Throttling takes 9.5 kW, speed control 6.5 kW: 3 kW, about 31 %, saved.'
    }
  ],
  quiz: [
    { q: 'A throttle valve downstream of a pump is closed a little. The operating point moves…', choices: ['right along the pump curve: more flow', 'left along the pump curve: less flow, more pump head', 'down the old system curve', 'nowhere: the pump sets the flow'], a: 1,
      why: 'The valve steepens the system curve, which now cuts the unchanged pump curve at a lower flow and higher head.' },
    { q: 'Slowing a pump with a variable-speed drive saves more energy in a closed heating loop than in a system that must lift water 30 m.', a: true,
      why: 'In the loop, head goes with Q² and power with the cube of speed; in the lifting system the static head must be supplied whatever the speed.' },
    { q: 'A pump gives 36 m at 70 m³/h; the system needs only 26 m and a throttle burns the rest. With the pump at 71 % efficiency, how much power is wasted in the valve?', answer: 2.69, unit: 'kW',
      why: 'P = ρgQh_v/η = 1000 × 9.81 × (70/3600) × 10/0.71 = 2.69 kW.' },
    { q: 'An oversized pump installed without a throttle will…', choices: ['run at its design point anyway', 'run to the right of its design point, with more flow and power, perhaps near run-out', 'run at shut-off', 'deliver less than designed'], a: 1,
      why: 'The real system curve is below the one it was chosen for, so it crosses the pump curve further right.' },
    { q: 'Why does a bypass back to the suction waste even more energy than a throttle?', choices: ['the bypass flow is pumped for nothing, and the pump runs at higher flow and power', 'bypasses cause cavitation', 'the bypass raises the static head', 'it does not; it saves energy'], a: 0,
      why: 'With a radial pump, more flow through the pump means more power; the recirculated part does no useful work at all.' }
  ],
  problems: [
    { q: 'A pump with a shut-off head of 50 m gives 40 m at 60 L/s. The system has 25 m of static head and loses 20 m at 60 L/s. What flow results?', answer: 54.8, unit: 'L/s', tol: 0.02,
      steps: ['$Q = Q_b\\sqrt{(H_0 - H_{st})/(H_0 - H_b + h_f)} = 60\\sqrt{25/30}$.', '$Q = 60 \\times 0.913 = 54.8$ L/s.'] }
  ],
  applications: ['Retrofitting variable-speed drives on throttled pumps — one of the quickest energy savings in industry and water utilities.', 'Checking a new pump against the lowest and highest tank levels before buying it.', 'Explaining noisy, cavitating pumps that turn out to run near run-out.'],
  sim: 'pump-operating'
},

{
  id: 'affinity-laws', parent: 'centrifugal-pumps', title: 'The affinity laws', level: 2,
  short: 'How a pump\'s curve scales with speed and size: flow with speed, head with its square, power with its cube. They explain why slowing a pump saves so much energy — and why static head limits the saving.',
  keywords: ['affinity laws', 'fan laws', 'pump laws', 'similarity', 'cube law', 'speed change', 'variable speed', 'impeller trimming', 'affinity parabola', 'model testing', 'scaling'],
  prereq: ['operating-point', 'pump-curves', 'aerodynamics:dimensional-analysis'],
  related: ['specific-speed', 'system-curve', 'math:scaling-laws', 'aerodynamics:similarity-testing', 'pumps-series-parallel'],
  body: `
Change a pump's speed and its whole curve moves in a predictable way. The rule comes from [[aerodynamics:dimensional-analysis|dimensional analysis]]: the flow in two geometrically similar pumps — or in one pump at two speeds — is the same pattern, scaled, when the velocity triangles have the same shape. Then three dimensionless groups are equal,

$$\\frac{Q}{nD^3}, \\qquad \\frac{gH}{n^2D^2}, \\qquad \\frac{P}{\\rho\\, n^3 D^5}$$

and so, to a first approximation, is the efficiency.

### One pump, a new speed
For the same impeller, corresponding points on the two curves are linked by

$$\\frac{Q_2}{Q_1} = \\frac{n_2}{n_1}, \\qquad \\frac{H_2}{H_1} = \\left(\\frac{n_2}{n_1}\\right)^2, \\qquad \\frac{P_2}{P_1} = \\left(\\frac{n_2}{n_1}\\right)^3$$

| Speed | 100 % | 90 % | 80 % | 70 % | 50 % |
|---|---|---|---|---|---|
| Flow | 100 % | 90 % | 80 % | 70 % | 50 % |
| Head | 100 % | 81 % | 64 % | 49 % | 25 % |
| Power | 100 % | 73 % | 51 % | 34 % | 12.5 % |

Every point of the curve moves this way: the shut-off head scales with $n^2$, and the BEP moves to $(Q_b n_2/n_1,\\; H_b (n_2/n_1)^2)$. The BEPs at all speeds lie on one parabola through the origin, $H \\propto Q^2$ — an **affinity parabola** — and along it the efficiency stays nearly constant.

### The catch: static head
The affinity laws link points on two *pump* curves; they do not say where the pump runs. The system curve decides that. In a closed loop the system curve *is* an affinity parabola, so the flow really is proportional to speed and the power falls with its cube: 80 % speed, 51 % power. With static head the system curve is lifted above the parabola, the flow falls faster than the speed, and the saving is smaller. Once the shut-off head $H_0 (n/n_0)^2$ has shrunk to the static head, the flow stops altogether: for the example pump (40 m at shut-off) on a 20 m lift, that happens at 71 % speed, 1025 rpm.

### Changing the diameter
- **Geometrically similar pumps** of different size (a model and its prototype): $Q \\propto D^3$, $H \\propto D^2$, $P \\propto D^5$ at the same speed. Large pumps and turbines are proven on models this way ([[aerodynamics:similarity-testing]]). The big machine comes out a few points more efficient, because its clearances and surface roughness do not scale up with it.
- **Trimming** (turning down) an impeller in the same casing is not a similar change — the outlet width and the casing stay. A practical rule is $Q \\propto D$, $H \\propto D^2$, $P \\propto D^3$, good for trims up to about 10–15 %; beyond that the efficiency drops noticeably.

> [!tip] The affinity laws predict how the *pump* changes. To find the new flow, always intersect the new pump curve with the system curve.
`,
  ideas: [
    'At similar points: Q ∝ n, H ∝ n², P ∝ n³ (and Q ∝ D³, H ∝ D², P ∝ D⁵ for similar pumps).',
    'Points linked by the laws lie on parabolas through the origin, with nearly equal efficiency.',
    'Where the pump runs is still set by the system curve: static head reduces the saving.',
    'Below the speed whose shut-off head equals the static head, a pump delivers nothing.',
    'Impeller trimming follows roughly Q ∝ D, H ∝ D², P ∝ D³ for modest trims.'
  ],
  pitfalls: [
    'At 80 % speed a pump always uses 51 % of its power — Only if it moves along an affinity parabola, as in a closed loop. With static head the operating point moves differently and the saving is smaller.',
    'The affinity laws give the new operating point — They give the new pump curve. The operating point is where that curve meets the system curve.',
    'Trimming an impeller scales it like a smaller similar pump — The casing and outlet width stay the same, so the D³ and D⁵ rules of similar pumps do not apply; use Q ∝ D and H ∝ D² as an approximation.'
  ],
  formulas: [
    {
      name: 'Flow at a new speed',
      expr: 'Q2 = Q1*n2/n1', tex: 'Q_2 = Q_1\\,\\dfrac{n_2}{n_1}',
      vars: {
        Q2: { name: 'flow at the new speed', q: 'flowrate', unit: 'm³/h', tex: 'Q_2' },
        Q1: { name: 'flow at the original speed', q: 'flowrate', unit: 'm³/h', value: 100, tex: 'Q_1' },
        n2: { name: 'new speed', q: 'frequency', unit: 'rpm', value: 1160, tex: 'n_2' },
        n1: { name: 'original speed', q: 'frequency', unit: 'rpm', value: 1450, tex: 'n_1' }
      },
      stories: { Q2: 'A pump delivers {Q1} at {n1}. What flow does the similar point give at {n2}?', n2: 'A pump gives {Q1} at {n1}. At what speed does the similar point give {Q2}?' }
    },
    {
      name: 'Head at a new speed',
      expr: 'H2 = H1*(n2/n1)^2', tex: 'H_2 = H_1\\left(\\dfrac{n_2}{n_1}\\right)^2',
      vars: {
        H2: { name: 'head at the new speed', q: 'length', unit: 'm', tex: 'H_2' },
        H1: { name: 'head at the original speed', q: 'length', unit: 'm', value: 32, tex: 'H_1' },
        n2: { name: 'new speed', q: 'frequency', unit: 'rpm', value: 1160, tex: 'n_2' },
        n1: { name: 'original speed', q: 'frequency', unit: 'rpm', value: 1450, tex: 'n_1' }
      },
      stories: { H2: 'A pump gives {H1} at {n1}. What head does the similar point give at {n2}?', n2: 'A pump gives {H1} at {n1}. To what speed must it be slowed for {H2} at the similar point?' }
    },
    {
      name: 'Power at a new speed',
      expr: 'P2 = P1*(n2/n1)^3', tex: 'P_2 = P_1\\left(\\dfrac{n_2}{n_1}\\right)^3',
      vars: {
        P2: { name: 'shaft power at the new speed', q: 'power', unit: 'kW', tex: 'P_2' },
        P1: { name: 'shaft power at the original speed', q: 'power', unit: 'kW', value: 11.2, tex: 'P_1' },
        n2: { name: 'new speed', q: 'frequency', unit: 'rpm', value: 1160, tex: 'n_2' },
        n1: { name: 'original speed', q: 'frequency', unit: 'rpm', value: 1450, tex: 'n_1' }
      },
      note: 'At similar points only — along an affinity parabola, as in a closed loop.',
      stories: { P2: 'A pump takes {P1} at {n1}. What does it take at the similar point at {n2}?', n2: 'A pump takes {P1} at {n1}. At what speed does the similar point need only {P2}?' }
    },
    {
      name: 'Head after trimming the impeller (approximate)',
      expr: 'H2 = H1*(D2/D1)^2', tex: 'H_2 = H_1\\left(\\dfrac{D_2}{D_1}\\right)^2',
      vars: {
        H2: { name: 'head with the trimmed impeller', q: 'length', unit: 'm', tex: 'H_2' },
        H1: { name: 'head with the full impeller', q: 'length', unit: 'm', value: 32, tex: 'H_1' },
        D2: { name: 'trimmed diameter', q: 'length', unit: 'mm', value: 225, tex: 'D_2' },
        D1: { name: 'original diameter', q: 'length', unit: 'mm', value: 250, tex: 'D_1' }
      },
      note: 'With the flow scaling as Q₂/Q₁ = D₂/D₁. Reasonable for trims up to about 10–15 %.',
      stories: { H2: 'An impeller of {D1} gives {H1}. Roughly what head does it give when turned down to {D2}?', D2: 'An impeller of {D1} gives {H1}; the duty needs {H2}. To what diameter should it be trimmed?' }
    }
  ],
  examples: [
    {
      title: 'Slowing a pump to 80 %',
      q: 'The example pump has its BEP at 100 m³/h, 32 m and 11.2 kW at 1450 rpm, and a shut-off head of 40 m. Where are these at 1160 rpm?',
      steps: [
        'Speed ratio $r = 1160/1450 = 0.8$.',
        'BEP flow $100 \\times 0.8 = 80$ m³/h; BEP head $32 \\times 0.64 = 20.5$ m; power $11.2 \\times 0.512 = 5.7$ kW.',
        'Shut-off head $40 \\times 0.64 = 25.6$ m. On a system with 20 m of static head the pump now has only 5.6 m to spare at zero flow.'
      ],
      a: 'BEP 80 m³/h at 20.5 m and 5.7 kW; shut-off head 25.6 m.'
    },
    {
      title: 'Trimming to a duty',
      q: 'The pump (full impeller 250 mm, $H = 40 - 8(Q/100)^2$ m) must deliver 90 m³/h at 26 m; at 90 m³/h it gives 33.5 m. Using $Q \\propto D$ and $H \\propto D^2$, what diameter is needed?',
      steps: [
        'With $k = D_2/D_1$, the trimmed curve is $H = k^2 \\cdot 40 - 8(Q/100)^2$ — the same algebra as a speed change.',
        'At 90 m³/h: $40k^2 - 8 \\times 0.81 = 26$, so $k^2 = 32.48/40 = 0.812$ and $k = 0.901$.',
        '$D_2 = 0.901 \\times 250 = 225$ mm — a 10 % trim, within the range where the rule holds.'
      ],
      a: 'About 225 mm.'
    }
  ],
  quiz: [
    { q: 'A pump at 1450 rpm takes 11.2 kW. At the similar point at 1160 rpm (80 %) it takes about…', choices: ['8.96 kW', '7.2 kW', '5.7 kW', '4.5 kW'], a: 2,
      why: 'Power goes with the cube of speed: 11.2 × 0.8³ = 5.7 kW.' },
    { q: 'In a system with a large static head, halving the pump speed halves the flow.', a: false,
      why: 'Halving the speed quarters the shut-off head. If that falls below the static head, the flow stops entirely; in any case it falls by much more than half.' },
    { q: 'To what percentage of its original speed must a pump be slowed to halve its head at similar points?', answer: 70.7, unit: '%',
      why: 'H ∝ n², so n₂/n₁ = √0.5 = 0.707.' },
    { q: 'At a speed ratio r = n₂/n₁, by what factor does the power change at similar points? (Write it in r.)', answer: 'r^3', vars: ['r'], positive: true,
      why: 'P ∝ n³ at similar points, so the factor is r³.' },
    { q: 'Why is an affinity parabola also (nearly) a line of constant efficiency?', choices: ['because the velocity triangles keep their shape, so the flow meets the vanes the same way', 'because the power is constant along it', 'because the head is constant along it', 'it is not: efficiency falls along it'], a: 0,
      why: 'Similar points have similar velocity triangles, so the same fraction of energy is lost; only friction effects at very low speed spoil this slightly.' }
  ],
  problems: [
    { q: 'A pump delivers 150 m³/h at 45 m and takes 24 kW at 1480 rpm. It is slowed to 1200 rpm. What power does it take at the similar point?', answer: 12.8, unit: 'kW', tol: 0.02,
      steps: ['$P_2 = P_1 (n_2/n_1)^3 = 24 \\times (1200/1480)^3$.', '$(0.8108)^3 = 0.533$, so $P_2 = 12.8$ kW — at 122 m³/h and 29.6 m.'] }
  ],
  applications: ['Variable-speed drives on pumps and fans, the classic cube-law saving in building services.', 'Impeller trimming to fit a standard pump to a particular duty.', 'Model tests of large pumps and turbines, scaled to the full-size machine.'],
  sim: 'pump-operating'
},

{
  id: 'specific-speed', parent: 'centrifugal-pumps', title: 'Specific speed and pump types', level: 3,
  short: 'A single number, n_q = n√Q/H^¾ at the best point, that fixes the shape a pump must have: narrow radial impellers for high head and little flow, mixed-flow impellers in between, propellers for huge flows at low head.',
  keywords: ['specific speed', 'n_q', 'N_s', 'type number', 'radial impeller', 'mixed flow', 'axial flow', 'propeller pump', 'impeller shape', 'multistage', 'double suction', 'shape number'],
  prereq: ['affinity-laws', 'pump-curves'],
  related: ['centrifugal-pump', 'francis-kaplan', 'npsh', 'positive-displacement', 'aerodynamics:dimensional-analysis'],
  body: `
Pumps for different duties look very different: a boiler-feed impeller is a wide, thin disc; a flood-control pump is a ship's propeller in a tube. One number, the **specific speed**, predicts which shape a duty calls for. Eliminate the diameter between the flow and head groups of the [[affinity-laws]] and what is left is

$$n_q = \\frac{n\\sqrt{Q}}{H^{3/4}}$$

with $n$ in rpm, $Q$ in m³/s and $H$ in m, taken at the best-efficiency point — per impeller eye (halve $Q$ for a double-suction impeller) and per stage (divide $H$ by the number of stages). Physically, $n_q$ is the speed at which a scaled copy of the pump would deliver 1 m³/s against 1 m of head. It is the same for every size and speed of one design, so it labels the **shape**, not the particular pump.

### Shapes and curves
| $n_q$ | Impeller | Flow leaves | Head per stage |
|---|---|---|---|
| 8–25 | radial, narrow, large outlet-to-eye ratio | radially | high |
| 25–50 | radial, wider | radially | medium |
| 50–100 | mixed flow (Francis-type) | diagonally | moderate |
| 100–160 | mixed flow, open | diagonally | low |
| 160–400 | axial (propeller) | along the axis | very low |

As $n_q$ rises, the curves change character. Radial pumps have flat head curves (shut-off 10–30 % above the BEP head) and power rising with flow. Axial pumps have steep head curves (shut-off head two to three times the BEP head), power **highest at shut-off**, and often a dip in the head curve at part load — so they are started with the valve open and never throttled far.

### Efficiency and the choice of speed
Efficiency is best around $n_q$ = 40–60, where large pumps reach 90 % and more. Low-$n_q$ pumps lose to disc friction and leakage, which do not shrink with the flow. So the designer uses $n_q$ to choose the speed and the number of stages:

- 50 m³/h at 120 m in one stage at 2900 rpm gives $n_q$ = 9.4 — a poor, narrow impeller. Three stages of 40 m each give $n_q$ = 21.5: a much better pump.
- 2000 m³/h at 6 m at 980 rpm gives $n_q$ = 190: a propeller pump.

Below $n_q$ ≈ 8–10 a [[positive-displacement]] pump usually does the job better.

### Other conventions
Beware of units. American practice uses $N_s$ with US gallons per minute and feet: $N_s \\approx 51.6\\,n_q$. The truly dimensionless form uses the angular speed and $gH$: $\\omega_s = \\omega\\sqrt{Q}/(gH)^{3/4} \\approx n_q/52.9$. Turbine engineers often use a power-based $n_s = n\\sqrt{P}/H^{5/4}$ ([[francis-kaplan]]). The idea is always the same: the shape of the machine follows from its duty.
`,
  ideas: [
    'n_q = n√Q/H^¾ at the best point, per eye and per stage.',
    'It is a property of a shape: the same for every size and speed of one design.',
    'Low n_q means narrow radial impellers; high n_q means mixed-flow, then axial propellers.',
    'Efficiency peaks around n_q = 40–60; low n_q calls for more stages, more speed or a positive-displacement pump.',
    'Always check which units a quoted specific speed uses.'
  ],
  pitfalls: [
    'Running a pump faster raises its specific speed — n_q is taken at the best point, where Q scales with n and H with n²; they cancel exactly, so a given pump keeps its n_q at any speed.',
    'Specific speed is a speed you can set on the motor — It is a shape number, the speed of an imaginary scaled pump for 1 m³/s at 1 m.',
    'All specific speeds are comparable — US N_s, metric n_q, the dimensionless ω_s and the power-based turbine n_s differ by large factors.'
  ],
  formulas: [
    {
      name: 'Specific speed (metric)',
      expr: 'nq = n*sqrt(Q)/H^0.75', tex: 'n_q = \\dfrac{n\\sqrt{Q}}{H^{3/4}}',
      vars: {
        nq: { name: 'specific speed n_q', tex: 'n_q' },
        n: { name: 'speed', q: false, unit: 'rpm', value: 1450 },
        Q: { name: 'flow per impeller eye at the best point', q: false, unit: 'm³/s', value: 0.0278 },
        H: { name: 'head per stage at the best point', q: false, unit: 'm', value: 32 }
      },
      note: 'An empirical convention: n in rpm, Q in m³/s, H in m. US N_s (rpm, US gpm, ft) ≈ 51.6 n_q.',
      practice: { unknowns: ['nq', 'n', 'H'] },
      stories: {
        nq: 'A pump delivers {Q} against {H} at its best point, turning at {n}. What is its specific speed?',
        n: 'A duty of {Q} at {H} per stage is to be met by an impeller of specific speed {nq}. At what speed should it turn?',
        H: 'An impeller of specific speed {nq} turns at {n} and passes {Q}. What head per stage suits it?'
      }
    },
    {
      name: 'Dimensionless specific speed',
      expr: 'ws = w*sqrt(Q)/(g*H)^0.75', tex: '\\omega_s = \\dfrac{\\omega\\sqrt{Q}}{(gH)^{3/4}}',
      vars: {
        ws: { name: 'dimensionless specific speed', tex: '\\omega_s' },
        w: { name: 'shaft speed', q: 'angvel', unit: 'rpm', value: 1450, tex: '\\omega' },
        Q: { name: 'flow per eye at the best point', q: 'flowrate', unit: 'm³/h', value: 100 },
        g: { const: 'g' },
        H: { name: 'head per stage at the best point', q: 'length', unit: 'm', value: 32 }
      },
      note: 'Pure number in any consistent units; ω_s ≈ n_q/52.9.',
      practice: { unknowns: ['ws', 'H'] },
      stories: { ws: 'A pump turning at {w} delivers {Q} at {H} at its best point. What is its dimensionless specific speed?' }
    }
  ],
  examples: [
    {
      title: 'The example pump',
      q: 'The example pump delivers 100 m³/h at 32 m at 1450 rpm. What is its specific speed, and what would a pump for the same duty at 2900 rpm be like?',
      steps: [
        '$Q = 0.02778$ m³/s, $\\sqrt{Q} = 0.1667$; $H^{3/4} = 32^{0.75} = 13.45$.',
        '$n_q = 1450 \\times 0.1667/13.45 = 18.0$: a radial impeller, fairly narrow.',
        'At 2900 rpm the same duty gives $n_q$ = 35.9: a smaller, wider impeller, and a somewhat better efficiency.'
      ],
      a: 'n_q ≈ 18 (radial); a 2900 rpm design would have n_q ≈ 36.'
    },
    {
      title: 'How many stages?',
      q: 'A pump must deliver 50 m³/h at 120 m at 2900 rpm. Compare one stage with three.',
      steps: [
        '$\\sqrt{Q} = \\sqrt{0.01389} = 0.1179$.',
        'One stage: $n_q = 2900 \\times 0.1179/120^{0.75} = 342/36.3 = 9.4$ — very narrow, with heavy disc-friction losses.',
        'Three stages of 40 m: $n_q = 342/40^{0.75} = 342/15.9 = 21.5$ — a normal radial impeller.'
      ],
      a: 'n_q = 9.4 for one stage, 21.5 for three: the multistage pump will be markedly more efficient.'
    }
  ],
  quiz: [
    { q: 'A pump must move 2000 m³/h against 6 m at 980 rpm. Its specific speed suggests…', choices: ['a narrow radial impeller', 'a mixed-flow or axial (propeller) impeller', 'a multistage pump', 'a gear pump'], a: 1,
      why: 'n_q = 980 × √0.556/6^0.75 ≈ 190: axial territory.' },
    { q: 'Doubling the speed of a given pump doubles its specific speed.', a: false,
      why: 'At the new BEP, Q has doubled and H quadrupled: 2n√(2Q)/(4H)^¾ = n√Q/H^¾. The shape number is unchanged.' },
    { q: 'What is n_q for a pump delivering 0.1 m³/s at 40 m at 1450 rpm?', answer: 28.8,
      why: 'n_q = 1450 × 0.3162/40^0.75 = 458.5/15.9 = 28.8.' },
    { q: 'A single-stage design comes out at n_q = 8. What should the designer consider?', choices: ['more stages or a higher speed, to raise n_q per stage', 'a lower speed', 'an axial impeller', 'nothing: low n_q is the most efficient'], a: 0,
      why: 'Dividing the head among stages, or turning faster, raises n_q towards the efficient range; below about 8–10 a positive-displacement pump may be better.' },
    { q: 'Which statement about a propeller (axial) pump is true?', choices: ['its power is lowest at shut-off', 'its head curve is flat', 'its power is highest at shut-off, so it is started with the valve open', 'it suits high heads'], a: 2,
      why: 'High-n_q machines have steep head curves and power that falls as flow rises.' }
  ],
  problems: [
    { q: 'A double-suction pump delivers 1.2 m³/s at 60 m, turning at 990 rpm. What is its specific speed n_q?', answer: 35.6, tol: 0.02,
      steps: ['Per eye: $Q = 0.6$ m³/s, $\\sqrt{Q} = 0.775$.', '$n_q = 990 \\times 0.775/60^{0.75} = 767/21.6 = 35.6$: a radial impeller of medium width.'] }
  ],
  applications: ['Choosing speed, number of stages and single- or double-suction at the start of a pump design.', 'Recognising what kind of impeller a catalogue pump has from its duty.', 'Turbine selection by the same reasoning (Pelton, Francis, Kaplan).'],
  sim: 'pump-nq'
},

{
  id: 'pumps-series-parallel', parent: 'centrifugal-pumps', title: 'Pumps in series and parallel', level: 2,
  short: 'Pumps in parallel add their flows at the same head; pumps in series add their heads at the same flow. What the combination actually delivers depends on the system curve — often far less than double.',
  keywords: ['parallel pumps', 'series pumps', 'combined curve', 'duty and standby', 'booster pump', 'multistage', 'check valve', 'pump staging', 'run-out', 'dead-head'],
  prereq: ['operating-point', 'pump-curves'],
  related: ['system-curve', 'pipes-series-parallel', 'check-valves', 'npsh', 'water-supply'],
  body: `
One pump rarely suits every duty. Two or more can share the work — side by side, **in parallel**, for more flow, or one after another, **in series**, for more head. What they achieve together depends, as always, on the system curve.

### Adding curves
- **Parallel**: the pumps draw from a common suction and deliver into a common header, so they all work at the **same head** and their **flows add**. The combined curve is found by adding flows horizontally at each head; for $N$ identical pumps, $H = H_0 - (H_0 - H_b)\\,(Q/NQ_b)^2$.
- **Series**: the second pump takes what the first delivers, so the **flow is the same** and the **heads add** — vertical addition: $H = N\\left[H_0 - (H_0 - H_b)(Q/Q_b)^2\\right]$. A multistage pump is a series set in one casing.

### What you actually get
Two identical pumps in parallel give double the flow only if the system curve is flat. With the example pump (40 m shut-off, 32 m at 100 m³/h):

| System | One pump | Two in parallel | Gain | Each pump runs at |
|---|---|---|---|---|
| 20 m lift, 12 m of losses at 100 m³/h | 100 m³/h | 120 m³/h | +20 % | 60 m³/h, 68 % efficiency |
| 30 m lift, 2 m of losses at 100 m³/h | 100 m³/h | 158 m³/h | +58 % | 79 m³/h, 75 % efficiency |

In the friction-heavy system the second pump buys 20 % more flow for 60 % more power, and both pumps run far back on their curves. Parallel pumps suit flat systems (mostly static head) and varying duties, where one, two or three pumps are switched in as demand grows.

Series operation raises the head: on the first system two pumps in series give 146 m³/h at 45.7 m. It suits steep, high-head systems — long pipelines with booster stations along the way, or a static head higher than one pump's shut-off head.

### Practical rules
- Each parallel pump needs its own **check valve** ([[check-valves]]) and isolating valves; otherwise the running pumps drive flow backwards through a stopped one and spin it in reverse.
- When one of two parallel pumps stops, the other runs out to the right, alone against a system curve it now meets at a much higher flow: its power and NPSHr rise. Size its motor and check its suction for single-pump running.
- **Unequal pumps** in parallel are risky: if the system head rises above the weaker pump's shut-off head, its check valve closes and it churns, dead-headed, heating up.
- In series, the second pump's casing and shaft seal see the first pump's discharge pressure; start the upstream pump first.
- Pumps with drooping curves are poor partners in parallel: they can share the flow unevenly or hunt.

> [!warn] Before working on one pump of a running set, close and lock its suction and discharge valves and lock out its motor: the other pumps keep the header under pressure, and a leaking check valve can spin a pump backwards.
`,
  ideas: [
    'Parallel: same head, flows add. Series: same flow, heads add.',
    'The gain depends on the system curve: little from a second parallel pump in a friction-dominated system.',
    'Parallel pumps each run back on their curves; one pump alone runs out to the right.',
    'Unequal parallel pumps can dead-head the weaker one.',
    'Series pumps suit high static heads and long pipelines; a multistage pump is a series set in one casing.'
  ],
  pitfalls: [
    'Two pumps in parallel give twice the flow — Only against a flat system curve. The more friction, the smaller the gain.',
    'In parallel, each pump delivers more than it would alone — Each runs at the higher common head, so it delivers less than it would alone.',
    'A standby pump can share the duty without its own check valve — Without one, the running pump drives flow back through the idle pump, wasting flow and turning it backwards.'
  ],
  formulas: [
    {
      name: 'N identical pumps in parallel: operating flow',
      expr: 'Q = N*Qb*sqrt((H0 - Hst)/(H0 - Hb + N^2*hf))', tex: 'Q = N Q_b\\sqrt{\\dfrac{H_0 - H_{st}}{H_0 - H_b + N^2 h_f}}',
      vars: {
        Q: { name: 'total flow', q: 'flowrate', unit: 'm³/h' },
        N: { name: 'number of pumps running', value: 2, int: true, min: 1, max: 20 },
        Qb: { name: 'each pump\'s best-efficiency flow', q: 'flowrate', unit: 'm³/h', value: 100, tex: 'Q_b' },
        H0: { name: 'shut-off head of each pump', q: 'length', unit: 'm', value: 40, tex: 'H_0' },
        Hst: { name: 'static head of the system', q: 'length', unit: 'm', value: 20, tex: 'H_{st}' },
        Hb: { name: 'head of each pump at its best point', q: 'length', unit: 'm', value: 32, tex: 'H_b' },
        hf: { name: 'system losses at the flow Q_b', q: 'length', unit: 'm', value: 12, tex: 'h_f' }
      },
      note: 'Parabolic pump curves H = H₀ − (H₀ − H_b)(Q/Q_b)² and system curve H = H_st + h_f(Q/Q_b)². Each pump delivers Q/N.',
      practice: { unknowns: ['Q', 'Hst'] },
      stories: { Q: '{N} identical pumps (shut-off {H0}, {Hb} at {Qb}) run in parallel into a system with {Hst} of static head and {hf} of losses at {Qb}. What is the total flow?' }
    },
    {
      name: 'N identical pumps in series: operating flow',
      expr: 'Q = Qb*sqrt((N*H0 - Hst)/(N*(H0 - Hb) + hf))', tex: 'Q = Q_b\\sqrt{\\dfrac{N H_0 - H_{st}}{N(H_0 - H_b) + h_f}}',
      vars: {
        Q: { name: 'flow', q: 'flowrate', unit: 'm³/h' },
        N: { name: 'number of pumps in series', value: 2, int: true, min: 1, max: 20 },
        Qb: { name: 'each pump\'s best-efficiency flow', q: 'flowrate', unit: 'm³/h', value: 100, tex: 'Q_b' },
        H0: { name: 'shut-off head of each pump', q: 'length', unit: 'm', value: 40, tex: 'H_0' },
        Hst: { name: 'static head of the system', q: 'length', unit: 'm', value: 50, tex: 'H_{st}' },
        Hb: { name: 'head of each pump at its best point', q: 'length', unit: 'm', value: 32, tex: 'H_b' },
        hf: { name: 'system losses at the flow Q_b', q: 'length', unit: 'm', value: 12, tex: 'h_f' }
      },
      note: 'The heads add at the common flow. With N = 1 and a static head above the shut-off head there is no flow at all.',
      practice: { unknowns: ['Q', 'Hst'] },
      stories: { Q: '{N} identical pumps (shut-off {H0}, {Hb} at {Qb}) run in series into a system with {Hst} of static head and {hf} of losses at {Qb}. What flow results?' }
    }
  ],
  examples: [
    {
      title: 'A second pump in a friction-heavy system',
      q: 'The example pump (40 m shut-off, 32 m at 100 m³/h, 11.2 kW) serves a system with 20 m of static head and 12 m of losses at 100 m³/h. A second identical pump is started in parallel. What flow results, and at what cost?',
      steps: [
        'One pump: $40 - 8x^2 = 20 + 12x^2$ with $x = Q/100$, so $x = 1$: 100 m³/h.',
        'Two pumps: $Q = 2 \\times 100\\sqrt{20/(8 + 4 \\times 12)} = 200 \\times 0.598 = 119.5$ m³/h.',
        'Each pump delivers 59.8 m³/h at $20 + 12 \\times 1.195^2 = 37.1$ m, at 68 % efficiency, taking 8.9 kW.',
        'Total 17.9 kW for 119.5 m³/h: 20 % more flow for 60 % more power.'
      ],
      a: 'About 120 m³/h — a 20 % gain that costs 60 % more power.'
    },
    {
      title: 'Lifting above one pump\'s reach',
      q: 'The same pumps must lift into a tank 50 m up (12 m of losses at 100 m³/h). One pump alone has a shut-off head of only 40 m. What do two in series deliver?',
      steps: [
        'One pump: 40 m < 50 m of static head, so it cannot deliver anything.',
        'Two in series: $Q = 100\\sqrt{(80 - 50)/(2 \\times 8 + 12)} = 100\\sqrt{30/28} = 103.5$ m³/h.',
        'Head: $50 + 12 \\times 1.035^2 = 62.9$ m, 31.4 m from each pump.'
      ],
      a: 'About 104 m³/h at 63 m.'
    }
  ],
  quiz: [
    { q: 'Two identical pumps in parallel feed a long pipeline with almost no static head. Compared with one pump, the flow is…', choices: ['doubled', 'somewhat higher, far from double', 'halved', 'unchanged'], a: 1,
      why: 'In a friction-dominated system the extra flow needs much more head, so the pumps run back on their curves and the gain is small.' },
    { q: 'In parallel operation, each pump delivers more flow than it would running alone.', a: false,
      why: 'Both work at the common, higher head, so each delivers less than it would alone.' },
    { q: 'Why must each pump of a parallel set have a check valve?', choices: ['to limit the pressure', 'so the running pumps cannot drive flow backwards through a stopped one', 'to prevent cavitation', 'to measure the flow'], a: 1,
      why: 'Without a check valve the header pressure pushes liquid back through the idle pump to the suction, spinning it in reverse.' },
    { q: 'Two identical pumps in series each follow H = 40 − 8(Q/100)² (m, Q in m³/h). What head do they give together at 100 m³/h?', answer: 64, unit: 'm',
      why: 'At the same flow the heads add: 2 × 32 = 64 m.' },
    { q: 'One of two parallel pumps trips. The survivor…', choices: ['runs at a lower flow', 'runs at a higher flow and power, perhaps near run-out, with a higher NPSH required', 'stops too', 'keeps exactly its previous flow'], a: 1,
      why: 'The system head falls with the total flow, so the remaining pump slides right on its curve.' }
  ],
  problems: [
    { q: 'Three identical pumps (40 m shut-off, 32 m at 100 m³/h) run in parallel into a system with 20 m of static head and 12 m of losses at 100 m³/h. What is the total flow?', answer: 124.6, unit: 'm³/h', tol: 0.02,
      steps: ['$Q = 3 \\times 100\\sqrt{20/(8 + 9 \\times 12)} = 300\\sqrt{20/116}$.', '$Q = 300 \\times 0.415 = 124.6$ m³/h — the third pump adds only 5 m³/h.'] }
  ],
  applications: ['Water-supply stations with duty, assist and standby pumps switched in as demand grows.', 'Pressure-boosting sets in tall buildings, several small pumps in parallel under one controller.', 'Booster stations along long pipelines, and multistage pumps, in series.'],
  sim: 'pump-series-parallel'
},

/* ================================================================ CAVITATION AND NPSH */
{
  id: 'cavitation', parent: 'cavitation-npsh', title: 'Cavitation', level: 2,
  short: 'Where a flowing liquid speeds up and its pressure falls to the vapour pressure, it boils into bubbles; when they reach higher pressure they collapse violently, pitting metal, making noise and robbing pumps of head.',
  keywords: ['cavitation', 'vapour pressure', 'bubble collapse', 'micro-jet', 'pitting', 'erosion', 'cavitation number', 'noise', 'inception', 'propeller cavitation', 'valve cavitation', 'boiling', 'Antoine equation'],
  prereq: ['vapour-pressure', 'energy-equation', 'centrifugal-pump'],
  related: ['npsh', 'priming-suction', 'francis-kaplan', 'air-in-oil', 'column-separation', 'physics:bernoullis-equation'],
  body: `
Water boils at 100 °C only at sea-level pressure. Lower the pressure and it boils colder: at 2.3 kPa absolute — barely 2 % of an atmosphere — it boils at 20 °C. Wherever a flowing liquid speeds up, its pressure falls ([[physics:bernoullis-equation|Bernoulli]]), and if the local absolute pressure reaches the [[vapour-pressure]] the liquid flashes into bubbles of vapour. That is **cavitation**. The bubbles themselves do little harm; the damage comes when the flow carries them into higher pressure and they **collapse**.

### Why the collapse destroys metal
A vapour bubble has almost nothing inside to cushion it. When the pressure around it rises it implodes within microseconds. Near a wall the collapse is lopsided: a tiny **micro-jet** of liquid punches through the bubble into the surface, and a shock wave follows. Local pressures reach hundreds of megapascals. One collapse does nothing visible; millions of them every second fatigue the surface into a spongy, pitted mass. Cavitation is also **noisy** — a cavitating pump sounds as if it were pumping gravel — it shakes the machine, and it eats performance: the vapour blocks the passages, and head and efficiency fall.

### Where it happens
- **Pumps**: the lowest pressure is not at the suction flange but just inside the impeller eye, where the liquid accelerates onto the leading edges of the vanes. Damage appears on the suction (back) side of the vanes, a little way in from the leading edge. At very low flow, recirculation makes cavitation at the outlet and in the eye as well.
- **Turbines**: the runner blades and draft tubes of reaction turbines ([[francis-kaplan]]).
- **Valves** throttling a large pressure drop: the jet through the valve cavitates and erodes the trim.
- **Ship propellers**, hydrofoils, spillways and dam outlets, orifices and fuel injectors.

It is not the same as air coming out of solution or drawn in through a leak (**gaseous cavitation** or aeration, see [[air-in-oil]]): such bubbles contain gas, collapse softly, and bring noise and sponginess rather than pitting.

### Vapour pressure of water
| Temperature | 10 °C | 20 °C | 40 °C | 60 °C | 80 °C | 100 °C |
|---|---|---|---|---|---|---|
| $p_v$ (kPa, absolute) | 1.23 | 2.34 | 7.38 | 19.9 | 47.4 | 101.3 |
| as head (m of water) | 0.13 | 0.24 | 0.76 | 2.06 | 4.96 | 10.8 |

Hot water is much nearer to boiling: at 80 °C nearly half of the atmosphere's pressure is already used up.

### Measuring the risk
The **cavitation number** compares the margin above the vapour pressure with the dynamic pressure of the flow:

$$\\sigma = \\frac{p - p_v}{\\tfrac12 \\rho V^2}$$

Each shape starts to cavitate below its own critical value. For pumps the same idea is expressed as a head, the [[npsh|NPSH]].

### Fighting it
Raise the pressure at the inlet (a higher tank, a lower pump, a shorter and larger suction pipe, fewer fittings, a pressurised vessel); cool the liquid; lower the speed; choose a pump with a larger eye, a double-suction impeller or an **inducer**; run near the best-efficiency point. Where some cavitation cannot be avoided, choose resistant materials: stainless steels and hard facings last many times longer than cast iron or ordinary bronze.
`,
  ideas: [
    'Cavitation is boiling caused by low pressure, not by heat.',
    'The damage comes from bubbles collapsing next to surfaces: micro-jets and shock waves, repeated millions of times.',
    'In a pump the lowest pressure is just inside the impeller eye, not at the suction flange.',
    'Warm water cavitates far more easily: its vapour pressure rises steeply with temperature.',
    'Cavitation number σ = (p − p_v)/(½ρV²): below a critical value, bubbles form.'
  ],
  pitfalls: [
    'Cavitation is air getting into the pump — True cavitation is the liquid itself turning to vapour at low pressure; air leaks and dissolved gas give gaseous cavitation, which is milder.',
    'The damage is done where the bubbles form — It is done where they collapse, downstream, in higher pressure.',
    'A pump that is not yet losing head is not cavitating — Bubbles appear well before the head falls; the 3 % head-drop value (NPSH3) already means substantial cavitation.'
  ],
  formulas: [
    {
      name: 'Cavitation number',
      expr: 'sigma = (p - pv)/(0.5*rho*V^2)', tex: '\\sigma = \\dfrac{p - p_v}{\\tfrac12 \\rho V^2}',
      vars: {
        sigma: { name: 'cavitation number', tex: '\\sigma' },
        p: { name: 'local or reference pressure (absolute)', q: 'pressure', unit: 'kPa', value: 150 },
        pv: { name: 'vapour pressure (absolute)', q: 'pressure', unit: 'kPa', value: 2.34, tex: 'p_v' },
        rho: { name: 'liquid density', q: 'density', unit: 'kg/m³', value: 998, tex: '\\rho' },
        V: { name: 'flow velocity', q: 'speed', unit: 'm/s', value: 15 }
      },
      note: 'Absolute pressures. A shape cavitates when σ falls below its critical (inception) value, found by test.',
      practice: { unknowns: ['sigma', 'V'] },
      stories: { sigma: 'Water ({rho}, vapour pressure {pv}) flows at {V} past a hydrofoil where the pressure is {p}. What is the cavitation number?', V: 'A shape cavitates below σ = {sigma}. At what speed does water ({rho}, vapour pressure {pv}) at {p} start to cavitate on it?' }
    },
    {
      name: 'Vapour pressure of water (Antoine equation)',
      expr: 'pv = 0.133322*10^(8.07131 - 1730.63/(233.426 + T))', tex: 'p_v = 0.1333\\times 10^{\\,8.0713 - \\frac{1730.63}{233.426 + T}}',
      vars: {
        pv: { name: 'vapour pressure (absolute)', q: false, unit: 'kPa', tex: 'p_v' },
        T: { name: 'water temperature', q: false, unit: '°C', value: 20, min: 1, max: 100 }
      },
      note: 'An empirical fit for water from 1 to 100 °C, accurate to a fraction of a per cent; T in °C, p_v in kPa.',
      practice: { unknowns: ['pv', 'T'] },
      stories: { pv: 'What is the vapour pressure of water at {T}?', T: 'At what temperature does water boil under an absolute pressure of {pv}?' }
    }
  ],
  examples: [
    {
      title: 'How fast before a throat cavitates?',
      q: 'Water at 20 °C ($p_v$ = 2.34 kPa, 998 kg/m³) approaches a nozzle at 2 m/s and 200 kPa absolute. Ignoring losses, what throat velocity brings the throat to the vapour pressure?',
      steps: [
        'Bernoulli between the approach and the throat: $p_1 + \\tfrac12\\rho V_1^2 = p_v + \\tfrac12\\rho V_2^2$.',
        '$V_2 = \\sqrt{V_1^2 + 2(p_1 - p_v)/\\rho} = \\sqrt{4 + 2 \\times 197\\,660/998} = \\sqrt{400} = 20.0$ m/s.',
        'Real throats cavitate a little earlier, because turbulent eddies dip below the average pressure.'
      ],
      a: 'About 20 m/s.'
    },
    {
      title: 'What heating costs',
      q: 'How much of the atmosphere\'s pressure is used up by the vapour pressure of water at 20 °C and at 80 °C?',
      steps: [
        'Antoine at 20 °C: $p_v = 0.1333 \\times 10^{8.0713 - 1730.63/253.43} = 2.33$ kPa, 0.24 m of water.',
        'At 80 °C: $p_v = 0.1333 \\times 10^{8.0713 - 1730.63/313.43} = 47.3$ kPa, 4.96 m of water (at 972 kg/m³).',
        'Of the 10.3 m that the atmosphere provides, 4.7 m more are lost at 80 °C — enough to turn a comfortable suction lift into heavy cavitation.'
      ],
      a: '2.3 kPa at 20 °C; 47 kPa, nearly half an atmosphere, at 80 °C.'
    }
  ],
  quiz: [
    { q: 'Cavitation damage is caused mainly by…', choices: ['bubbles forming', 'bubbles collapsing next to surfaces', 'air dissolved in the water', 'chemical attack by the vapour'], a: 1,
      why: 'The implosion near a wall drives a micro-jet and a shock wave into the surface, over and over.' },
    { q: 'Heating the water in a pump\'s supply tank from 20 °C to 80 °C makes cavitation more likely.', a: true,
      why: 'The vapour pressure rises from 2.3 to 47 kPa, eating almost 5 m of the suction head.' },
    { q: 'Where is the pressure lowest in a centrifugal pump?', choices: ['at the discharge flange', 'at the suction flange', 'just inside the impeller eye, at the leading edges of the vanes', 'at the volute tongue'], a: 2,
      why: 'The liquid accelerates as it turns onto the vanes, so the pressure dips below the flange value — that is why a pump needs NPSH.' },
    { q: 'Water (998 kg/m³, p_v = 2.3 kPa) flows at 12 m/s where the absolute pressure is 120 kPa. What is the cavitation number?', answer: 1.64,
      why: 'σ = (120 − 2.3) × 10³/(0.5 × 998 × 144) = 1.64.' },
    { q: 'A pump sounds as if it were pumping gravel. The most likely cause is…', choices: ['a worn bearing', 'cavitation', 'a loose coupling guard', 'too much flow through the relief valve'], a: 1,
      why: 'The crackle of collapsing vapour bubbles is the classic sound of a cavitating pump.' }
  ],
  problems: [
    { q: 'Water at 20 °C (p_v = 2.34 kPa, ρ = 998 kg/m³) approaches a valve at 3 m/s and 180 kPa absolute. Ignoring losses, at what velocity in the valve\'s narrowest jet does the pressure reach the vapour pressure?', answer: 19.1, unit: 'm/s', tol: 0.02,
      steps: ['$V_2 = \\sqrt{V_1^2 + 2(p_1 - p_v)/\\rho} = \\sqrt{9 + 2 \\times 177\\,660/998}$.', '$V_2 = \\sqrt{9 + 356} = 19.1$ m/s.'] }
  ],
  applications: ['Pump selection and suction design, to keep the impeller free of erosion.', 'Control valves with anti-cavitation trims that drop the pressure in several stages.', 'Propeller and hydrofoil design, and aeration slots on dam spillways.', 'Put to work in ultrasonic cleaning baths and in some water-treatment reactors.'],
  history: 'Cavitation forced itself on engineers in the 1890s, when the first fast steam-turbine ships lost thrust as their propellers spun in clouds of vapour; Charles Parsons built a small cavitation tunnel in 1895 to study the problem. In 1917 Lord Rayleigh worked out how quickly an empty spherical bubble collapses and how large the pressures become.',
  sim: 'pump-npsh'
},

{
  id: 'npsh', parent: 'cavitation-npsh', title: 'NPSH available and required', level: 2,
  short: 'Net positive suction head: how far the total head at the pump inlet stands above boiling. The system offers NPSH available; the pump needs NPSH required; the difference, the margin, keeps the impeller free of cavitation.',
  keywords: ['NPSH', 'NPSHa', 'NPSHr', 'NPSH3', 'net positive suction head', 'suction head', 'suction lift', 'margin', 'vapour pressure', 'deaerator', 'suction specific speed', 'altitude', 'flooded suction'],
  prereq: ['cavitation', 'gauge-absolute', 'darcy-weisbach'],
  related: ['priming-suction', 'pump-curves', 'specific-speed', 'vapour-pressure', 'minor-losses'],
  body: `
Whether a pump cavitates is decided by two numbers compared at its suction flange. **NPSH** — net positive suction head — is the margin, in metres of liquid, by which the total head at the pump inlet exceeds the head at which the liquid would boil:

$$\\mathrm{NPSH} = \\frac{p_{s,abs}}{\\rho g} + \\frac{V_s^2}{2g} - \\frac{p_v}{\\rho g}$$

The **system** offers some of it: **NPSH available**. The **pump** needs some of it, because the pressure falls further as the liquid enters the impeller eye: **NPSH required**.

### NPSH available
Following the liquid from the surface of the tank it comes from to the pump inlet:

$$\\mathrm{NPSH}_a = \\frac{p_a - p_v}{\\rho g} + z_s - h_L$$

- $p_a$ — the **absolute** pressure on the liquid surface: the atmosphere for an open tank (101.3 kPa at sea level, 89.9 kPa at 1000 m, 79.5 kPa at 2000 m), the gas pressure for a closed vessel.
- $p_v$ — the vapour pressure at the liquid's temperature ([[cavitation]] has a table).
- $z_s$ — the height of the liquid surface **above** the pump centreline: positive for a flooded suction, negative for a suction lift.
- $h_L$ — every loss in the suction line: entrance, foot valve, strainer, pipe, bends and valves.

On an installed pump NPSHa can be measured with a gauge at the suction flange: add the barometric pressure to the gauge reading, subtract the vapour pressure, convert to head, and add the velocity head and the gauge's height above the centreline.

### NPSH required
The maker measures NPSHr on a test stand by lowering the suction pressure step by step at constant flow until the head has fallen by 3 %. That suction head is **NPSH3**, the value printed on the curve (ISO 9906:2012 and the Hydraulic Institute standards define it this way). At NPSH3 the pump is **already cavitating**: bubbles appear at a suction head two to five times higher, the inception value. NPSHr rises steeply with flow beyond the BEP, and with the square of the speed.

### The margin
So NPSHa must exceed NPSH3 by a margin: at least 0.5–1 m, and a ratio NPSHa/NPSH3 of about 1.1–1.5 for ordinary water service, rising to 2 or more for large, high-energy or hot-water pumps that must run for decades without erosion (guidance in ANSI/HI 9.6.1).

| Budget: cold water at sea level | Head (m) |
|---|---|
| Atmosphere, 101.3 kPa | +10.35 |
| Vapour pressure at 20 °C | −0.24 |
| Water surface 4 m below the pump | −4.00 |
| Suction-line losses | −1.20 |
| **NPSH available** | **4.91** |
| NPSH required at the duty point | 3.50 |
| **Margin** | **1.41** (ratio 1.4) |

The same system with water at 80 °C has NPSHa = 0.46 m: the pump would cavitate hard.

### Liquids at their boiling point
Condensate, boiler feedwater from a deaerator, refrigerants and liquefied gases are stored at their boiling point: $p_a = p_v$, and the first term vanishes. Then **only height** provides NPSH: $\\mathrm{NPSH}_a = z_s - h_L$. That is why deaerators stand 10–20 m above the boiler-feed pumps, and why some pumps are sunk in a pit or a can below floor level.

### Suction specific speed
The pump's side can be judged by a specific speed built on NPSH3: $S = n\\sqrt{Q}/\\mathrm{NPSH}_3^{3/4}$ (rpm, m³/s, m, at the BEP). Typical values are 150–250. Designs pushed much higher have a low NPSHr at the BEP but a narrow comfortable range, with recirculation trouble at part load.
`,
  ideas: [
    'NPSH is the head at the pump inlet above the vapour head, in metres of liquid.',
    'NPSHa is the system\'s: atmosphere (absolute) − vapour pressure ± static height − suction losses.',
    'NPSHr (NPSH3) is the pump\'s: the suction head at which its head has already dropped 3 %.',
    'Keep a margin: NPSHa at least 0.5–1 m and 10–50 % above NPSH3, more for large or hot-water pumps.',
    'For boiling liquids only elevation provides NPSH.'
  ],
  pitfalls: [
    'NPSH can be worked out with gauge pressures — The atmosphere is part of what pushes the liquid in: use absolute pressure on the liquid surface, and remember that it falls with altitude.',
    'NPSHa = NPSHr is the safe limit — At NPSH3 the pump is already cavitating and has lost 3 % of its head; a margin above it is essential.',
    'NPSH required is one number for the pump — It rises with flow, especially beyond the BEP, and with speed; check it at the highest flow the pump can reach.'
  ],
  formulas: [
    {
      name: 'NPSH available from the supply tank',
      expr: 'NPSHa = (pa - pv)/(rho*g) + zs - hL', tex: '\\mathrm{NPSH}_a = \\dfrac{p_a - p_v}{\\rho g} + z_s - h_L',
      vars: {
        NPSHa: { name: 'NPSH available', q: 'length', unit: 'm', tex: '\\mathrm{NPSH}_a' },
        pa: { name: 'pressure on the liquid surface (absolute)', q: 'pressure', unit: 'kPa', value: 101.3, tex: 'p_a' },
        pv: { name: 'vapour pressure (absolute)', q: 'pressure', unit: 'kPa', value: 2.34, tex: 'p_v' },
        rho: { name: 'liquid density', q: 'density', unit: 'kg/m³', value: 998, tex: '\\rho' },
        g: { const: 'g' },
        zs: { name: 'liquid surface above the pump centreline (negative for a lift)', q: 'length', unit: 'm', value: -4, signed: true, tex: 'z_s' },
        hL: { name: 'losses in the suction line', q: 'length', unit: 'm', value: 1.2, tex: 'h_L' }
      },
      practice: { unknowns: ['NPSHa', 'zs', 'hL'] },
      stories: {
        NPSHa: 'A pump draws water ({rho}, vapour pressure {pv}) from a tank whose surface is at {zs} relative to the pump centreline, under {pa} absolute; the suction line loses {hL}. What NPSH is available?',
        zs: 'A pump needs {NPSHa} available. Water ({rho}, vapour pressure {pv}) comes from an open tank at {pa} absolute through a suction line losing {hL}. Where must the water surface be relative to the pump centreline?',
        hL: 'Water ({rho}, {pv} vapour pressure) at {pa} absolute stands at {zs} relative to a pump that must have {NPSHa}. What is the most the suction line may lose?'
      }
    },
    {
      name: 'NPSH available from a suction gauge',
      expr: 'NPSHa = (ps + pb - pv)/(rho*g) + vs^2/(2*g) + zg', tex: '\\mathrm{NPSH}_a = \\dfrac{p_s + p_b - p_v}{\\rho g} + \\dfrac{V_s^2}{2g} + z_g',
      vars: {
        NPSHa: { name: 'NPSH available', q: 'length', unit: 'm', tex: '\\mathrm{NPSH}_a' },
        ps: { name: 'suction gauge reading (gauge; negative for vacuum)', q: 'pressure', unit: 'kPa', value: -45, signed: true, tex: 'p_s' },
        pb: { name: 'barometric pressure', q: 'pressure', unit: 'kPa', value: 101.3, tex: 'p_b' },
        pv: { name: 'vapour pressure (absolute)', q: 'pressure', unit: 'kPa', value: 2.34, tex: 'p_v' },
        rho: { name: 'liquid density', q: 'density', unit: 'kg/m³', value: 998, tex: '\\rho' },
        g: { const: 'g' },
        vs: { name: 'velocity in the suction pipe at the gauge', q: 'speed', unit: 'm/s', value: 2, tex: 'V_s' },
        zg: { name: 'height of the gauge above the pump centreline', q: 'length', unit: 'm', value: 0.2, signed: true, tex: 'z_g' }
      },
      practice: { unknowns: ['NPSHa', 'ps'] },
      stories: { NPSHa: 'A suction gauge {zg} above a pump\'s centreline reads {ps}; the barometer reads {pb}, the water ({rho}) has a vapour pressure of {pv} and flows at {vs}. What NPSH is available?', ps: 'A pump needs {NPSHa}. What is the lowest acceptable reading of a suction gauge {zg} above the centreline, with the barometer at {pb}, water at {vs} ({rho}, vapour pressure {pv})?' }
    },
    {
      name: 'Suction specific speed',
      expr: 'S = n*sqrt(Q)/NPSHr^0.75', tex: 'S = \\dfrac{n\\sqrt{Q}}{\\mathrm{NPSH}_r^{3/4}}',
      vars: {
        S: { name: 'suction specific speed' },
        n: { name: 'speed', q: false, unit: 'rpm', value: 1450 },
        Q: { name: 'flow per eye at the best point', q: false, unit: 'm³/s', value: 0.0278 },
        NPSHr: { name: 'NPSH required (NPSH3) at the best point', q: false, unit: 'm', value: 2.0, tex: '\\mathrm{NPSH}_r' }
      },
      note: 'Empirical units: n in rpm, Q in m³/s, NPSH in m. Typical values 150–250; US units (gpm, ft) give about 51.6 times more.',
      practice: { unknowns: ['S', 'NPSHr'] },
      stories: { S: 'A pump turning at {n} passes {Q} per eye at its best point, where it needs {NPSHr}. What is its suction specific speed?', NPSHr: 'A pump of suction specific speed {S} turns at {n} and passes {Q} per eye. What NPSH will it need at its best point?' }
    }
  ],
  examples: [
    {
      title: 'Hot water from a sump',
      q: 'A pump needing 3.5 m of NPSH draws water from a sump 4 m below its centreline, at sea level, with 1.2 m of suction losses. Check it with water at 20 °C and at 80 °C, and find how high the sump must be at 80 °C for a 0.5 m margin.',
      steps: [
        'At 20 °C: $(101\\,300 - 2340)/(998 \\times 9.81) - 4 - 1.2 = 10.11 - 5.2 = 4.91$ m. Margin 1.4 m: acceptable.',
        'At 80 °C ($p_v$ = 47.4 kPa, 972 kg/m³): $(101\\,300 - 47\\,400)/(972 \\times 9.81) - 5.2 = 5.65 - 5.2 = 0.46$ m, far below 3.5 m: heavy cavitation.',
        'For NPSHa = 4.0 m: $5.65 + z_s - 1.2 = 4.0$, so $z_s = -0.45$ m: the water surface may be at most 0.45 m below the centreline.',
        'In practice hot water is always given a flooded suction — the tank above the pump.'
      ],
      a: '4.9 m at 20 °C (fine); 0.46 m at 80 °C (cavitating); the hot sump must be no more than 0.45 m below the pump.'
    },
    {
      title: 'Measuring NPSHa on site',
      q: 'On a running pump the suction gauge, 0.2 m above the centreline, reads −45 kPa. The barometer reads 101.3 kPa, the water is at 20 °C and moves at 2.0 m/s in the suction pipe. What NPSH is available?',
      steps: [
        'Absolute pressure at the gauge: $-45 + 101.3 = 56.3$ kPa; minus the vapour pressure: 53.96 kPa.',
        'As head: $53\\,960/(998 \\times 9.81) = 5.51$ m.',
        'Add the velocity head $2.0^2/19.62 = 0.20$ m and the gauge height 0.2 m: NPSHa = 5.91 m.'
      ],
      a: 'About 5.9 m.'
    }
  ],
  quiz: [
    { q: 'The NPSHr (NPSH3) printed on a pump curve is the suction head at which…', choices: ['cavitation first begins', 'the head has already dropped by 3 % because of cavitation', 'the pump is destroyed', 'the pump loses its prime'], a: 1,
      why: 'NPSH3 is defined by a 3 % head drop, well after bubbles first appear. Hence the need for a margin.' },
    { q: 'NPSH available depends only on the pump.', a: false,
      why: 'NPSHa belongs to the system: the pressure on the liquid, its temperature, the level and the suction losses. NPSHr belongs to the pump.' },
    { q: 'A pump draws boiling condensate from a vessel. What provides its NPSH available?', choices: ['the vessel pressure', 'the liquid height above the pump, less the suction losses', 'the atmosphere', 'the pump speed'], a: 1,
      why: 'At the boiling point p_a = p_v, so the pressure term vanishes and only elevation remains.' },
    { q: 'Open tank at sea level (101.3 kPa), water at 20 °C (p_v = 2.3 kPa, 998 kg/m³), surface 2 m above the pump, suction losses 0.8 m. What is NPSHa?', answer: 11.3, unit: 'm',
      why: '(101.3 − 2.3) × 10³/(998 × 9.81) + 2 − 0.8 = 10.11 + 1.2 = 11.3 m.' },
    { q: 'Which change raises NPSH available?', choices: ['a smaller suction pipe', 'warmer water', 'raising the supply tank', 'a partly blocked strainer'], a: 2,
      why: 'Height adds directly to NPSHa; the others add losses or vapour pressure.' }
  ],
  problems: [
    { q: 'A pump at 2000 m altitude (79.5 kPa) lifts water at 20 °C (p_v = 2.34 kPa, 998 kg/m³) from a sump 3 m below its centreline, with 1 m of suction losses. What NPSH is available?', answer: 3.88, unit: 'm', tol: 0.02,
      steps: ['$(79\\,500 - 2340)/(998 \\times 9.81) = 7.88$ m.', 'NPSHa $= 7.88 - 3 - 1 = 3.88$ m — 2.2 m less than the same installation at sea level.'] }
  ],
  applications: ['Pump selection: the NPSH check is made at the highest flow and the warmest liquid the pump will see.', 'Boiler-feed, condensate and refinery pumps, where elevation is the only source of NPSH.', 'Diagnosing noisy, eroding pumps from suction-gauge readings.'],
  sim: 'pump-npsh'
},

{
  id: 'priming-suction', parent: 'cavitation-npsh', title: 'Suction lift and priming', level: 1,
  short: 'The atmosphere, not the pump, pushes water up a suction pipe — at most 10 m, and in practice 5–7 m. A centrifugal pump full of air cannot lift water at all, so it must be primed; the suction line must be airtight, rising and well submerged.',
  keywords: ['suction lift', 'priming', 'self-priming pump', 'foot valve', 'flooded suction', 'vacuum priming', 'air lock', 'submergence', 'vortex', 'eccentric reducer', 'dry running', 'borehole pump', 'jet pump'],
  prereq: ['npsh', 'pressure-with-depth', 'centrifugal-pump'],
  related: ['cavitation', 'siphons', 'gauge-absolute', 'check-valves', 'froude-number'],
  body: `
A pump does not suck water up its suction pipe; the **atmosphere pushes** it up. The impeller lowers the pressure at the top of the column, and the atmosphere, pressing on the open water surface, drives water up to fill the gap. Even a perfect vacuum could only hold a column whose weight balances the atmosphere: $p_{atm}/\\rho g$ = 10.3 m of water at sea level.

### How high can a pump lift?
Less than that, for four reasons: water boils long before a perfect vacuum ([[vapour-pressure]]), the suction line has losses, the pump needs its NPSH at the eye, and a margin is wise:

$$z_{max} = \\frac{p_a - p_v}{\\rho g} - h_L - \\mathrm{NPSH}_r - M$$

At sea level with cold water, 1 m of losses, 3.5 m of NPSH required and a 0.6 m margin, that leaves about **5 m**; 6–7 m is the practical ceiling for a good installation. At 2000 m altitude the atmosphere gives 2.2 m less, and hot water far less again ([[npsh]]). Water from deeper wells must be **pushed**, not pulled: by submersible pumps at the bottom of the borehole, vertical line-shaft pumps, or jet (ejector) pumps that send part of the flow down the well to entrain more.

### Priming: why a pump will not pump air
A centrifugal pump gives the same *head* to whatever fluid it spins — in metres of that fluid. Full of air at 1.2 kg/m³, a pump rated for 32 m of water makes a pressure of only $1.2 \\times 9.81 \\times 32 \\approx 380$ Pa: enough to lift water about **4 cm**. So before it can work, the casing and the suction line must be full of liquid — the pump must be **primed**.

- **Flooded suction**: the liquid level is above the pump. Open the valves, vent the air from the casing's high point, and the pump primes itself.
- **Foot valve and filling**: a check valve with a strainer at the bottom of the suction pipe holds the water in, and the casing is filled through a priming plug before starting. A leaking foot valve lets the line drain and the pump loses its prime.
- **Self-priming pumps** keep a reservoir of liquid in the casing. On starting, the impeller whips air into that liquid; in a separating chamber the air escapes to the discharge and the liquid returns, until the suction line is empty of air — a minute or two for a few metres of lift. The casing itself must hold its first fill.
- **Vacuum priming**: a small vacuum pump or ejector draws the air out of the casing and the suction line — used on large drainage pumps and to start [[siphons]].

### A good suction line
- Short, straight and one size **larger** than the pump inlet, with a velocity of about 1–2 m/s.
- Rising **continuously** towards the pump on a lift, with no high points where air can gather, and an **eccentric reducer** with its flat side on top.
- Five to ten diameters of straight pipe before the inlet: a bend right at the pump crowds the liquid into one side of the eye, causing noise, uneven loading and cavitation.
- Airtight: on a suction lift every joint is below atmospheric pressure, so a leak draws air **in** instead of dripping water out.
- Deep enough: a shallow intake pulls air down in a whirlpool. The Hydraulic Institute's guideline for the minimum submergence of an intake of diameter $D$ is $S = D(1 + 2.3\\,Fr)$, with the [[froude-number|Froude number]] $Fr = V/\\sqrt{gD}$ at the intake.

> [!warn] Never run a pump dry: its mechanical seal is cooled and lubricated by the liquid and can be destroyed in seconds. Sumps, wet wells and tanks are confined spaces — the air may be toxic or short of oxygen (hydrogen sulphide in sewage wells) and there is a risk of drowning. Enter only under a permit, after gas testing and ventilation, with the pumps locked out and a standby person outside.
`,
  ideas: [
    'The atmosphere pushes liquid up the suction pipe: never more than about 10 m of cold water at sea level.',
    'Vapour pressure, losses, NPSHr and a margin cut the practical lift to about 5–7 m.',
    'A pump full of air makes only a few centimetres of water\'s worth of suction: it must be primed.',
    'Self-priming pumps work by keeping liquid in the casing and separating the air they pump out.',
    'Suction lines: short, larger than the inlet, rising to the pump, airtight, well submerged.'
  ],
  pitfalls: [
    'A stronger pump can suck water up higher — The atmosphere does the lifting; no pump can raise water more than about 10 m by suction at sea level, whatever its power.',
    'A self-priming pump can start completely dry — It needs its casing filled once; it then keeps liquid in the casing and can evacuate the air from the suction line.',
    'A small air leak on the suction side just drips a little — On a lift the pipe is below atmospheric pressure, so the leak draws air in, which can stop the pump pumping.'
  ],
  formulas: [
    {
      name: 'The lift a pump full of air can make',
      expr: 'h = rhoA/rho*H', tex: 'h = \\dfrac{\\rho_a}{\\rho_w}\\,H',
      vars: {
        h: { name: 'height of water that can be lifted', q: 'length', unit: 'mm' },
        rhoA: { name: 'density of the gas in the pump (air)', q: 'density', unit: 'kg/m³', value: 1.2, tex: '\\rho_a' },
        rho: { const: 'rhoW' },
        H: { name: 'pump head (in metres of whatever it spins)', q: 'length', unit: 'm', value: 32 }
      },
      note: 'The pump gives its head in metres of air; the pressure ρ_a g H then holds up only ρ_a/ρ_w as much water.',
      stories: { h: 'A pump rated for {H} of head is full of air ({rhoA}). How high can it raise water up its suction pipe?' }
    },
    {
      name: 'Maximum suction lift',
      expr: 'zmax = (pa - pv)/(rho*g) - hL - NPSHr - M', tex: 'z_{max} = \\dfrac{p_a - p_v}{\\rho g} - h_L - \\mathrm{NPSH}_r - M',
      vars: {
        zmax: { name: 'largest height of the pump centreline above the liquid surface', q: 'length', unit: 'm', signed: true, tex: 'z_{max}' },
        pa: { name: 'pressure on the liquid surface (absolute)', q: 'pressure', unit: 'kPa', value: 101.3, tex: 'p_a' },
        pv: { name: 'vapour pressure (absolute)', q: 'pressure', unit: 'kPa', value: 2.34, tex: 'p_v' },
        rho: { name: 'liquid density', q: 'density', unit: 'kg/m³', value: 998, tex: '\\rho' },
        g: { const: 'g' },
        hL: { name: 'suction-line losses', q: 'length', unit: 'm', value: 1.0, tex: 'h_L' },
        NPSHr: { name: 'NPSH required at the duty', q: 'length', unit: 'm', value: 3.5, tex: '\\mathrm{NPSH}_r' },
        M: { name: 'safety margin', q: 'length', unit: 'm', value: 0.6 }
      },
      note: 'A negative result means the liquid surface must be above the pump (a flooded suction).',
      practice: { unknowns: ['zmax', 'hL'] },
      stories: { zmax: 'Water ({rho}, vapour pressure {pv}) stands in an open sump under {pa}. The suction line loses {hL}, the pump needs {NPSHr} and you want a {M} margin. How far above the water can the pump be?', hL: 'A pump needing {NPSHr} is to sit {zmax} above water ({rho}, vapour pressure {pv}) under {pa}, with a {M} margin. What is the most the suction line may lose?' }
    },
    {
      name: 'Submergence of an intake (Hydraulic Institute guideline)',
      expr: 'S = D*(1 + 2.3*V/sqrt(g*D))', tex: 'S = D\\left(1 + 2.3\\,\\dfrac{V}{\\sqrt{gD}}\\right)',
      vars: {
        S: { name: 'minimum depth of the intake below the surface', q: 'length', unit: 'm' },
        D: { name: 'intake (bell-mouth) diameter', q: 'length', unit: 'mm', value: 300 },
        V: { name: 'velocity at the intake', q: 'speed', unit: 'm/s', value: 1.2 },
        g: { const: 'g' }
      },
      note: 'A guideline against air-drawing vortices (ANSI/HI 9.8); sump geometry matters as much.',
      practice: { unknowns: ['S', 'V'] },
      stories: { S: 'A {D} bell-mouth draws water at {V}. How deep below the surface should it be?', V: 'A {D} intake can only be {S} below the surface. What is the highest intake velocity the guideline allows?' }
    }
  ],
  examples: [
    {
      title: 'How high above the sump?',
      q: 'A pump needs 3.5 m of NPSH. Its suction line loses 1.0 m and a 0.6 m margin is wanted. How high above cold water (20 °C) can it be placed at sea level, and in a town at 2000 m (79.5 kPa)?',
      steps: [
        'Sea level: $(101\\,300 - 2340)/(998 \\times 9.81) = 10.11$ m; $z_{max} = 10.11 - 1.0 - 3.5 - 0.6 = 5.0$ m.',
        'At 2000 m: $(79\\,500 - 2340)/(998 \\times 9.81) = 7.88$ m; $z_{max} = 7.88 - 5.1 = 2.8$ m.',
        'The same pump must be set 2.2 m lower in the mountains.'
      ],
      a: 'About 5.0 m at sea level, 2.8 m at 2000 m.'
    },
    {
      title: 'Deep enough to stop vortices',
      q: 'A vertical pump draws through a 300 mm bell-mouth at 1.2 m/s. What submergence does the guideline $S = D(1 + 2.3Fr)$ ask for?',
      steps: [
        'Froude number: $Fr = V/\\sqrt{gD} = 1.2/\\sqrt{9.81 \\times 0.3} = 1.2/1.716 = 0.70$.',
        '$S = 0.3 \\times (1 + 2.3 \\times 0.70) = 0.3 \\times 2.61 = 0.78$ m.'
      ],
      a: 'At least about 0.78 m of water above the intake.'
    }
  ],
  quiz: [
    { q: 'The absolute limit of suction lift for cold water at sea level is about…', choices: ['1 m', '10 m', '30 m', 'unlimited with a strong enough pump'], a: 1,
      why: 'Atmospheric pressure can support a water column of p_atm/ρg ≈ 10.3 m; less the vapour pressure, about 10.1 m.' },
    { q: 'A self-priming pump can prime itself even if its casing is completely dry.', a: false,
      why: 'It needs liquid in the casing to entrain and separate the air; after the first fill it keeps that liquid.' },
    { q: 'Why does an elbow bolted straight onto the pump inlet cause trouble?', choices: ['it adds static head', 'it sends the liquid unevenly into the eye, causing noise, vibration and cavitation', 'it makes the pump self-priming', 'it lowers the vapour pressure'], a: 1,
      why: 'The flow leaves a bend crowded to its outside; the impeller then sees uneven velocities and local low pressures.' },
    { q: 'How high can a dry pump rated for 50 m of head lift water up its suction pipe, with air at 1.2 kg/m³?', answer: 60, unit: 'mm',
      why: 'h = (ρ_air/ρ_water) H = (1.2/1000) × 50 = 0.06 m.' },
    { q: 'A suction line has a hump — a high point — before the pump. What happens?', choices: ['nothing', 'air collects there and can block the flow or make the pump lose its prime', 'it raises NPSHa', 'it prevents vortices'], a: 1,
      why: 'Air comes out of the water at the low pressure and gathers at high points; an air lock can stop the flow entirely.' }
  ],
  problems: [
    { q: 'A pump needing 2.5 m of NPSH lifts water at 40 °C (p_v = 7.38 kPa, ρ = 992 kg/m³) at sea level (101.3 kPa), with 0.8 m of suction losses and a 0.5 m margin. How high above the water can it be set?', answer: 5.85, unit: 'm', tol: 0.02,
      steps: ['$(101\\,300 - 7380)/(992 \\times 9.81) = 9.65$ m.', '$z_{max} = 9.65 - 0.8 - 2.5 - 0.5 = 5.85$ m.'] }
  ],
  applications: ['Farm and garden pumps lifting from ponds and shallow wells, with foot valves or self-priming casings.', 'Drainage and construction dewatering with vacuum-assisted self-priming pumps.', 'Deep wells, where submersible pumps push the water up instead.'],
  sim: { id: 'pump-npsh', params: { z: -5 } }
},

/* ================================================================ TURBINES AND HYDROPOWER */
{
  id: 'hydropower', parent: 'hydro-turbines', title: 'Hydropower', level: 1,
  short: 'Falling water through a turbine: P = ηρgQH. Net head, the parts of a plant, the kinds of scheme, and why hydro is the most efficient and most flexible large source of electricity.',
  keywords: ['hydropower', 'hydroelectric', 'turbine', 'head', 'net head', 'gross head', 'penstock', 'dam', 'run-of-river', 'water-to-wire efficiency', 'capacity factor', 'intake', 'tailrace', 'surge tank'],
  prereq: ['energy-equation', 'physics:power', 'physics:gravitational-potential-energy'],
  related: ['pelton-wheel', 'francis-kaplan', 'pumped-storage', 'darcy-weisbach', 'surge-protection', 'dams-spillways', 'physics:generators', 'aerodynamics:wind-turbines'],
  body: `
Water that falls gives up its [[physics:gravitational-potential-energy|potential energy]]. Catch it in a pipe, send it through a turbine, and the power is

$$P = \\eta\\,\\rho g Q H$$

— the hydraulic power of a pump ([[pump-head-power]]) run backwards, with the efficiency now multiplying instead of dividing. One cubic metre falling 100 m carries 0.98 MJ, or 0.27 kWh. With a water-to-wire efficiency of about 0.87, a handy rule is $P$ (kW) ≈ 8.5 $QH$, with $Q$ in m³/s and $H$ in m.

### Gross head and net head
The **gross head** is the level difference between the water surface at the intake and the tailwater below the plant. The turbine receives less, the **net head**, after the losses in the intake screens (trash racks), the tunnel or **penstock** ([[darcy-weisbach]]), valves and bends. A well-designed plant loses a few per cent. A long, undersized penstock can lose much more — every hour, for the life of the plant — the same trade as pipe sizing for pumps.

### The parts of a plant
An intake with trash racks and gates; a headrace canal or tunnel; a **surge tank** to absorb the water hammer when the turbine closes quickly ([[surge-protection]]); the penstock; the **turbine** with its flow control (wicket gates or spear valves); the **generator** ([[physics:generators]]), turning at a speed locked to the grid frequency; and the draft tube and tailrace returning the water to the river.

### Kinds of scheme
- **Storage** plants behind a dam keep water from wet seasons for dry ones and can follow demand hour by hour ([[dams-spillways]]).
- **Run-of-river** plants use the river's flow as it comes, with little storage — often low head and large flow.
- **Diversion** schemes lead water along a canal or tunnel to gain head where a river falls steeply.
- **Pumped storage** stores energy by pumping water uphill ([[pumped-storage]]).

| Scheme (illustrative) | Head | Flow | Power |
|---|---|---|---|
| Micro-hydro on a mountain stream | 25 m | 0.08 m³/s | ≈ 15 kW |
| Small run-of-river weir | 8 m | 30 m³/s | ≈ 2 MW |
| Alpine storage plant | 800 m | 20 m³/s | ≈ 140 MW |
| Large river dam, one of many units | 100 m | 700 m³/s | ≈ 630 MW |

### Why it matters
Large hydro plants turn about 90 % of the water's energy into electricity — no thermal plant comes close — and can go from standstill to full load in a minute or two, which makes them the grid's natural balancers. Hydropower gave about 15 % of the world's electricity in the early 2020s, and until recently more than all other renewable sources together; the largest plants exceed 20 GW. Dams also change rivers: they block fish and sediment, alter flows and temperatures, can emit methane from flooded vegetation in warm climates, and have displaced communities — costs weighed in every new project.

> [!warn] Below dams and power stations the water can rise within minutes, without warning, when turbines start or gates open: keep off river beds and low banks below them and obey signs and sirens. Intakes and spillways can pull swimmers under. Penstocks, scroll cases and draft tubes are confined spaces: enter only after the gates are closed and locked, the water drained, the machines locked out and the air tested.
`,
  ideas: [
    'Power = ηρgQH: head and flow matter equally.',
    'Net head is gross head minus the losses in intake, tunnel and penstock.',
    'Large hydro converts about 90 % of the water\'s energy into electricity.',
    'Storage, run-of-river, diversion and pumped-storage schemes serve different needs.',
    'Hydro plants start and change load quickly, balancing the grid.'
  ],
  pitfalls: [
    'A high dam always means a big power station — Power needs flow as well as head; a high dam on a small stream gives little.',
    'The turbine receives the full level difference — It receives the net head: gross head less the intake, tunnel and penstock losses.',
    'Hydropower has no losses because the water is free — Water-to-wire efficiency is about 85–92 %; friction in long penstocks and part-load running cost real energy.'
  ],
  formulas: [
    {
      name: 'Hydroelectric power',
      expr: 'P = eta*rho*g*Q*H', tex: 'P = \\eta\\,\\rho_w g Q H',
      vars: {
        P: { name: 'electrical power', q: 'power', unit: 'kW' },
        eta: { name: 'water-to-wire efficiency', q: 'ratio', unit: '%', value: 85, min: 1, max: 100, tex: '\\eta' },
        rho: { const: 'rhoW' },
        g: { const: 'g' },
        Q: { name: 'flow through the turbine', q: 'flowrate', unit: 'm³/s', value: 2 },
        H: { name: 'net head', q: 'length', unit: 'm', value: 38 }
      },
      practice: { unknowns: ['P', 'Q', 'H'] },
      stories: {
        P: 'A turbine takes {Q} under a net head of {H} with a water-to-wire efficiency of {eta}. What power does the plant produce?',
        Q: 'A plant with {H} of net head and {eta} efficiency must produce {P}. What flow does it need?',
        H: 'A turbine passing {Q} at {eta} efficiency produces {P}. What net head does it work under?'
      }
    },
    {
      name: 'Net head after penstock friction',
      expr: 'Hn = Hg - f*L/D*(4*Q/(pi*D^2))^2/(2*g)', tex: 'H_n = H_g - \\dfrac{fL}{D}\\,\\dfrac{1}{2g}\\left(\\dfrac{4Q}{\\pi D^2}\\right)^2',
      vars: {
        Hn: { name: 'net head at the turbine', q: 'length', unit: 'm', signed: true, tex: 'H_n' },
        Hg: { name: 'gross head', q: 'length', unit: 'm', value: 40, tex: 'H_g' },
        f: { name: 'Darcy friction factor of the penstock', value: 0.012 },
        L: { name: 'penstock length', q: 'length', unit: 'm', value: 300 },
        D: { name: 'penstock diameter', q: 'length', unit: 'm', value: 0.9 },
        Q: { name: 'flow', q: 'flowrate', unit: 'm³/s', value: 2 },
        g: { const: 'g' }
      },
      note: 'Pipe friction only; add the intake, valve and bend losses for a full budget.',
      practice: { unknowns: ['Hn', 'D'] },
      stories: { Hn: 'A {L} penstock of {D} diameter (f = {f}) carries {Q} from an intake {Hg} above the turbine. What net head reaches the turbine?', D: 'A {L} penstock (f = {f}) must carry {Q} with a gross head of {Hg} and still deliver {Hn} to the turbine. What diameter is needed?' }
    }
  ],
  examples: [
    {
      title: 'A small hydro plant',
      q: 'A stream gives 2 m³/s with 40 m of gross head. The penstock is 300 m long and 0.9 m across ($f$ = 0.012); the plant is 85 % efficient water-to-wire. Find the power, and the yearly energy if the plant averages half its full output.',
      steps: [
        'Velocity: $V = 2/(\\pi \\times 0.9^2/4) = 3.14$ m/s; velocity head 0.504 m.',
        'Penstock loss: $0.012 \\times 300/0.9 \\times 0.504 = 2.0$ m, so the net head is 38.0 m (5 % lost).',
        'Power: $P = 0.85 \\times 1000 \\times 9.81 \\times 2 \\times 38.0 = 634$ kW.',
        'Energy: $634 \\times 8760 \\times 0.5 = 2.78\\times10^6$ kWh, about 2.8 GWh a year — enough for several hundred homes.'
      ],
      a: 'About 630 kW and 2.8 GWh a year.'
    },
    {
      title: 'Flow for 100 MW',
      q: 'What flow does a 100 MW unit need under 400 m of net head at 90 % efficiency?',
      steps: [
        '$Q = P/(\\eta\\rho g H) = 10^8/(0.9 \\times 1000 \\times 9.81 \\times 400)$.',
        '$Q = 28.3$ m³/s — at 400 m, a Pelton or a high-head Francis turbine.'
      ],
      a: 'About 28 m³/s.'
    }
  ],
  quiz: [
    { q: 'At the same flow, doubling the head of a hydro plant…', choices: ['doubles the power', 'quadruples the power', 'leaves the power unchanged', 'raises the power by √2'], a: 0,
      why: 'P = ηρgQH is proportional to H at fixed Q.' },
    { q: 'The net head is the level difference between the reservoir and the tailwater.', a: false,
      why: 'That is the gross head; the net head is what remains after the losses in intake, tunnel and penstock.' },
    { q: 'What power (MW) does 10 m³/s under 50 m of net head give at 90 % efficiency?', answer: 4.41, unit: 'MW',
      why: 'P = 0.9 × 1000 × 9.81 × 10 × 50 = 4.41 × 10⁶ W.' },
    { q: 'Compared with a thermal power station, a large hydro plant…', choices: ['is 35–45 % efficient and takes hours to start', 'is about 90 % efficient and can reach full load in a minute or two', 'cannot change its output', 'loses most of its energy as heat'], a: 1,
      why: 'Water-to-wire efficiencies near 90 % and fast response are hydropower\'s great strengths.' },
    { q: 'The energy in one cubic metre of water falling 100 m is about…', choices: ['0.027 kWh', '0.27 kWh', '2.7 kWh', '27 kWh'], a: 1,
      why: 'ρgVH = 1000 × 9.81 × 1 × 100 = 0.98 MJ = 0.27 kWh.' }
  ],
  problems: [
    { q: 'A micro-hydro scheme has 30 m of net head and should give 20 kW at 70 % efficiency. What flow is needed, in litres per second?', answer: 97.1, unit: 'L/s', tol: 0.02,
      steps: ['$Q = P/(\\eta\\rho g H) = 20\\,000/(0.7 \\times 1000 \\times 9.81 \\times 30)$.', '$Q = 0.0971$ m³/s = 97 L/s.'] }
  ],
  applications: ['National grids, where storage hydro provides both energy and fast balancing.', 'Run-of-river plants on large rivers, and weirs converted from old mills.', 'Micro-hydro for remote villages, farms and mountain huts.'],
  history: 'Water wheels have driven mills for two thousand years. The first hydroelectric installations date from 1878–1882 — among them a country house at Cragside in England and a small commercial plant at Appleton, Wisconsin — and the Niagara Falls plant of 1895 showed that alternating current could send hydropower far away.',
  sim: 'pump-turbine-chart'
},

{
  id: 'pelton-wheel', parent: 'hydro-turbines', title: 'The Pelton wheel', level: 2,
  short: 'An impulse turbine for high heads: a jet at nearly √(2gH) strikes split buckets that turn it back through about 165°. The power peaks when the buckets move at half the jet speed; a spear valve sets the flow without changing the jet speed.',
  keywords: ['Pelton wheel', 'impulse turbine', 'jet', 'bucket', 'splitter', 'spear valve', 'needle valve', 'deflector', 'jet speed', 'speed ratio', 'runaway speed', 'multi-jet', 'high head'],
  prereq: ['hydropower', 'jet-forces', 'physics:relative-velocity'],
  related: ['francis-kaplan', 'momentum-principle', 'water-hammer', 'torricelli', 'physics:momentum'],
  body: `
At high heads, the simplest way to use water is to turn all its head into speed and throw it at a wheel. A **nozzle** at the end of the penstock makes a jet moving at nearly $\\sqrt{2gH}$ — 99 m/s under 500 m of head, as [[torricelli|Torricelli]] would predict — and the jet strikes a ring of **buckets** on the rim of a wheel turning in air. This is an **impulse** turbine: the water is at atmospheric pressure everywhere outside the nozzle, and the wheel is driven purely by the change in the jet's momentum ([[jet-forces]]).

### The bucket
Each bucket is a double cup with a sharp **splitter** ridge down the middle. The jet hits the ridge, divides, runs round the two halves and leaves sideways and backwards, turned through about 165° — not quite 180°, so that water leaving one bucket clears the back of the next. A notch in the bucket's lip lets it enter the jet cleanly.

### How fast should the buckets move?
Relative to a bucket moving at $u$, the jet arrives at $c_1 - u$ ([[physics:relative-velocity|relative velocity]]) and leaves backwards at about $k(c_1 - u)$, where $k$ ≈ 0.9–0.97 accounts for friction in the bucket. By the [[momentum-principle]] the force and power are

$$F = \\rho Q\\,(c_1 - u)(1 + k\\cos\\phi), \\qquad P = F u$$

with $\\phi$ ≈ 15° the angle by which the outflow falls short of a full reversal. The power is zero with the wheel held still ($u = 0$: a large force, no motion) and zero when the buckets run as fast as the jet ($u = c_1$: no force). In between it peaks at **$u = c_1/2$**: then, ideally, the water leaves the bucket with no velocity at all, having given up all its energy, and simply falls out of the wheel. The efficiency relative to the jet's energy is

$$\\eta = 2\\,\\frac{u}{c_1}\\left(1 - \\frac{u}{c_1}\\right)(1 + k\\cos\\phi)$$

— 93 % at the best point with $k$ = 0.9. Real wheels peak at $u/c_1$ ≈ 0.46–0.47 and, after the nozzle, windage and bearing losses, reach 90–92 % overall.

### Control and protection
The flow is set by a **spear** (needle) valve inside the nozzle. Moving it changes the jet's area but not its speed, so the velocity triangles — and the efficiency — stay nearly the same from about 20 % to full load, even more so with **multi-jet** wheels (up to six jets on a vertical shaft), which shut jets off at low load. When the generator suddenly loses its load, the spear cannot close quickly: the long penstock would suffer severe [[water-hammer]]. Instead a **deflector** swings into the jet within a second or two and throws it clear of the buckets, while the spear closes slowly over tens of seconds. A small **brake jet** on the backs of the buckets stops the wheel.

Unloaded, a wheel runs away towards $u \\approx c_1$ — about 1.8–1.9 times its normal speed — and the generator must be built to survive that runaway speed.

### Where Peltons are used
From about 100 m to nearly 1900 m of head, with small flows per jet; single units reach several hundred megawatts. The wheel's pitch diameter follows from the head and the generator's synchronous speed: under 500 m, a 500 rpm wheel with $u$ = 0.47 × 97 m/s has a pitch diameter of 1.74 m.
`,
  ideas: [
    'All the head becomes jet speed, c₁ ≈ Cᵥ√(2gH); the wheel turns in air.',
    'Buckets split the jet and turn it back through about 165°.',
    'Power peaks when the buckets move at about half the jet speed; the water then leaves with little energy.',
    'A spear valve varies the flow without changing the jet speed, so part-load efficiency stays high.',
    'A deflector cuts the jet in a second or two; the spear closes slowly to avoid water hammer.'
  ],
  pitfalls: [
    'The faster the wheel turns, the more power it gives — Power is zero at standstill and again when the buckets move as fast as the jet; it peaks at about half the jet speed.',
    'A Pelton wheel is stopped quickly by closing the spear valve — A quick closure would send a water-hammer surge up the penstock; the deflector diverts the jet instead while the spear closes slowly.',
    'Turning the jet through a full 180° would be best — The leaving water would then strike the back of the next bucket; about 165° is the practical optimum.'
  ],
  derivation: {
    title: 'The best bucket speed',
    steps: [
      { text: 'In the bucket\'s frame the jet arrives at $w_1 = c_1 - u$ and leaves at $w_2 = k w_1$, turned back through $180° - \\phi$.' },
      { text: 'The water\'s momentum along the direction of motion changes, per second, by $\\rho Q$ times the change in its velocity component, which is the force on the buckets:', tex: 'F = \\rho Q\\,(w_1 + w_2\\cos\\phi) = \\rho Q\\,(c_1 - u)(1 + k\\cos\\phi)' },
      { text: 'Power is force times bucket speed. Dividing by the jet power $\\tfrac12 \\rho Q c_1^2$:', tex: '\\eta = \\frac{F u}{\\tfrac12 \\rho Q c_1^2} = 2\\,\\frac{u}{c_1}\\left(1 - \\frac{u}{c_1}\\right)(1 + k\\cos\\phi)' },
      { text: 'The product $x(1 - x)$ with $x = u/c_1$ is greatest at $x = 1/2$. With a perfect bucket ($k = 1$, $\\phi = 0$) the efficiency there is exactly 1: the water leaves with no velocity at all.' }
    ]
  },
  formulas: [
    {
      name: 'Jet velocity',
      expr: 'c1 = Cv*sqrt(2*g*H)', tex: 'c_1 = C_v\\sqrt{2gH}',
      vars: {
        c1: { name: 'jet velocity', q: 'speed', unit: 'm/s', tex: 'c_1' },
        Cv: { name: 'nozzle velocity coefficient (0.97–0.99)', value: 0.98, tex: 'C_v' },
        g: { const: 'g' },
        H: { name: 'net head at the nozzle', q: 'length', unit: 'm', value: 500 }
      },
      stories: { c1: 'A Pelton nozzle (velocity coefficient {Cv}) works under {H} of net head. How fast is the jet?', H: 'A jet leaves a nozzle (Cᵥ = {Cv}) at {c1}. What net head drives it?' }
    },
    {
      name: 'Flow through the jets',
      expr: 'Q = z*pi*d^2/4*c1', tex: 'Q = z\\,\\dfrac{\\pi d^2}{4}\\,c_1',
      vars: {
        Q: { name: 'total flow', q: 'flowrate', unit: 'm³/s' },
        z: { name: 'number of jets', value: 1, int: true, min: 1, max: 6 },
        d: { name: 'jet diameter', q: 'length', unit: 'mm', value: 150 },
        c1: { name: 'jet velocity', q: 'speed', unit: 'm/s', value: 97, tex: 'c_1' }
      },
      practice: { unknowns: ['Q', 'd'] },
      stories: { Q: '{z} jet(s) of {d} diameter leave the nozzles at {c1}. What is the total flow?', d: 'A Pelton wheel with {z} jet(s) at {c1} must pass {Q}. What jet diameter is needed?' }
    },
    {
      name: 'Runner efficiency',
      expr: 'eta = 2*x*(1 - x)*(1 + k*cos(phi))', tex: '\\eta = 2x(1 - x)(1 + k\\cos\\phi)',
      vars: {
        eta: { name: 'runner efficiency (of the jet\'s energy)', q: 'ratio', unit: '%', tex: '\\eta' },
        x: { name: 'speed ratio x = u/c₁ (bucket speed over jet speed)', value: 0.47, min: 0, max: 1 },
        k: { name: 'bucket friction factor w₂/w₁', value: 0.9, min: 0, max: 1 },
        phi: { name: 'shortfall of the outflow angle from 180°', q: 'angle', unit: '°', value: 15, min: 0, max: 90, tex: '\\phi' }
      },
      note: 'Ignores windage, spray and bearing losses, and the nozzle loss (multiply by C_v² for the efficiency on the head).',
      practice: { unknowns: ['eta', 'x'] },
      stories: { eta: 'Pelton buckets (k = {k}, outflow {phi} short of a full reversal) move at a speed ratio u/c₁ = {x}. What is the runner efficiency?', x: 'Buckets with k = {k} and a {phi} shortfall must reach {eta}. At what speed ratio u/c₁?' }
    },
    {
      name: 'Bucket speed and pitch diameter',
      expr: 'u = pi*D*n', tex: 'u = \\pi D n',
      vars: {
        u: { name: 'bucket speed on the pitch circle', q: 'speed', unit: 'm/s' },
        D: { name: 'pitch-circle diameter (where the jet strikes)', q: 'length', unit: 'm', value: 1.74 },
        n: { name: 'wheel speed', q: 'frequency', unit: 'rpm', value: 500 }
      },
      practice: { unknowns: ['u', 'D'] },
      stories: { u: 'A Pelton wheel of {D} pitch diameter turns at {n}. How fast do its buckets move?', D: 'A wheel turning at {n} needs a bucket speed of {u}. What pitch diameter should it have?' }
    }
  ],
  examples: [
    {
      title: 'Designing a wheel for 500 m',
      q: 'A Pelton unit works under 500 m of net head with one 150 mm jet ($C_v$ = 0.98), driving a 50 Hz generator at 500 rpm. Choose $u/c_1$ = 0.47. Find the jet speed, the flow, the pitch diameter and the power at 90 % overall efficiency.',
      steps: [
        'Jet: $c_1 = 0.98\\sqrt{2 \\times 9.81 \\times 500} = 97.1$ m/s.',
        'Flow: $Q = \\pi \\times 0.15^2/4 \\times 97.1 = 1.72$ m³/s.',
        'Bucket speed $u = 0.47 \\times 97.1 = 45.6$ m/s; pitch diameter $D = u/(\\pi n) = 45.6/(\\pi \\times 500/60) = 1.74$ m.',
        'Power: $P = 0.9 \\times 1000 \\times 9.81 \\times 1.72 \\times 500 = 7.6$ MW.'
      ],
      a: 'Jet 97 m/s, 1.72 m³/s, pitch diameter 1.74 m, about 7.6 MW.'
    },
    {
      title: 'Too slow',
      q: 'With $k$ = 0.9 and $\\phi$ = 15°, compare the runner efficiency at $u/c_1$ = 0.47 and 0.3. Where does the lost energy go?',
      steps: [
        '$1 + k\\cos\\phi = 1 + 0.9 \\times 0.966 = 1.869$.',
        'At 0.47: $\\eta = 2 \\times 0.47 \\times 0.53 \\times 1.869 = 93.1$ %. At 0.3: $\\eta = 2 \\times 0.3 \\times 0.7 \\times 1.869 = 78.5$ %.',
        'At the low speed the water leaves the buckets still moving backwards at $k(c_1 - u)\\cos\\phi - u = 0.9 \\times 0.7c_1 \\times 0.966 - 0.3c_1 = 0.31c_1$ — carrying away its kinetic energy.'
      ],
      a: '93 % against 79 %: a slow wheel throws water back with energy still in it.'
    }
  ],
  quiz: [
    { q: 'In an ideal Pelton wheel the best bucket speed is…', choices: ['equal to the jet speed', 'half the jet speed', 'a quarter of the jet speed', 'twice the jet speed'], a: 1,
      why: 'The power ρQ(c₁ − u)u(1 + k cos φ) is greatest at u = c₁/2.' },
    { q: 'A Pelton wheel\'s spear valve controls the flow without changing the jet velocity.', a: true,
      why: 'It changes the jet\'s area; the speed is still set by the head. That keeps the part-load efficiency high.' },
    { q: 'How fast is the jet (C_v = 0.98) under 800 m of net head?', answer: 122.8, unit: 'm/s',
      why: 'c₁ = 0.98 × √(2 × 9.81 × 800) = 0.98 × 125.3 = 122.8 m/s.' },
    { q: 'Why does a Pelton unit have a jet deflector as well as a spear valve?', choices: ['to cool the jet', 'to take the jet off the wheel within seconds while the spear closes slowly, avoiding water hammer in the penstock', 'to add power', 'to aim the jet at the next bucket'], a: 1,
      why: 'Closing the spear quickly would stop the water column in the penstock abruptly; deflecting the jet removes the power at once without changing the flow.' },
    { q: 'What happens to the water leaving the buckets when the wheel is held stationary?', choices: ['it drops straight down', 'it is thrown back towards the nozzle at almost the jet speed, carrying its energy away', 'it stays in the bucket', 'it passes through the wheel'], a: 1,
      why: 'With u = 0 the jet is simply reversed: a large force, but no work is done, and all the energy leaves with the water.' }
  ],
  problems: [
    { q: 'A Pelton wheel works under 300 m of net head (C_v = 0.98) at 750 rpm. For a speed ratio u/c₁ = 0.46, what pitch diameter is needed?', answer: 0.881, unit: 'm', tol: 0.02,
      steps: ['$c_1 = 0.98\\sqrt{2 \\times 9.81 \\times 300} = 75.2$ m/s; $u = 0.46 \\times 75.2 = 34.6$ m/s.', '$D = u/(\\pi n) = 34.6/(\\pi \\times 12.5) = 0.881$ m.'] }
  ],
  applications: ['Alpine, Himalayan, Andean and Norwegian high-head power stations.', 'Micro-hydro on steep mountain streams, often with one or two jets.', 'Energy recovery from high-pressure water, such as the brine of reverse-osmosis plants.'],
  history: 'Lester Allan Pelton, working among the gold mines of California in the 1870s, found that a jet striking the edge of a cup gave more power than one striking its centre; his split bucket, patented in 1880, is essentially the one used today.',
  sim: 'pump-pelton'
},

{
  id: 'francis-kaplan', parent: 'hydro-turbines', title: 'Francis and Kaplan turbines', level: 2,
  short: 'Reaction turbines run full of water under pressure: the Francis for medium heads, the Kaplan — a propeller with adjustable blades — for low heads and large flows. A draft tube recovers the exit energy; specific speed and cavitation decide the choice and the setting.',
  keywords: ['Francis turbine', 'Kaplan turbine', 'reaction turbine', 'propeller turbine', 'bulb turbine', 'wicket gates', 'guide vanes', 'spiral casing', 'draft tube', 'Thoma coefficient', 'turbine specific speed', 'synchronous speed', 'vortex rope', 'double regulation', 'turbine selection'],
  prereq: ['hydropower', 'specific-speed', 'centrifugal-pump'],
  related: ['pelton-wheel', 'cavitation', 'npsh', 'pumped-storage', 'aerodynamics:propellers', 'aerodynamics:wind-turbines'],
  body: `
Below a few hundred metres of head a jet would be too slow, and a Pelton wheel too large and slow-turning for the flow. **Reaction turbines** take over. Their runner is completely filled with water under pressure, and the pressure falls as the water passes through it: the runner is pushed both by the change in the water's direction and by the pressure difference across its blades — as a lawn sprinkler is pushed round by its own jets.

### The Francis turbine
Water from the penstock enters a **spiral casing** (scroll) that wraps round the machine and feeds it evenly from all sides. Fixed **stay vanes** carry the casing's load; adjustable **wicket gates** (guide vanes) set the flow and give it the right swirl. The **runner** — a crown and a band joined by 13–19 curved blades — takes the water in radially at its rim and turns it to leave axially at the centre: a mixed-flow machine, a [[centrifugal-pump]] run backwards. The water then enters the **draft tube**, a widening bend that slows it down before the tailrace.

Francis turbines cover the widest range of all, from about 20 m to 700 m of head, and are built from a few hundred kilowatts to 1000 MW per unit. At their best point large units exceed 95 % efficiency. At part load the fixed blades meet the flow at the wrong angle; below about half load a spiralling vortex — the **rope** — forms in the draft tube and shakes the machine, so Francis units are run mostly near their design flow.

### The Kaplan turbine
For low heads and large flows the runner becomes a **propeller** of four to eight blades, the water flowing along the axis ([[aerodynamics:propellers]] in reverse). Viktor Kaplan's idea was to make the **blades adjustable** as well as the wicket gates: the governor sets both together (double regulation), so the flow meets the blades correctly at every load and the efficiency stays high from about 30 % to full flow. Kaplans work from about 2 m to 40 m of head, some up to 70 m. **Bulb** turbines put the generator in a watertight capsule in the flow itself, for the lowest heads — river barrages and tidal plants. Fixed-blade propeller turbines are cheaper where the flow is steady.

### The draft tube and cavitation
The water leaving the runner still moves fast. The draft tube slows it down, recovering much of that kinetic energy, and — like the suction leg of a pump — lets the runner sit **above** the tailwater without losing that height: the pressure under the runner simply falls below atmospheric. That is exactly where [[cavitation]] threatens. Thoma's cavitation coefficient $\\sigma = \\mathrm{NPSH}/H$ must stay above the turbine's critical value, which fixes the highest allowed runner position above tailwater:

$$H_s = \\frac{p_a - p_v}{\\rho g} - \\sigma H$$

A Kaplan under 20 m with $\\sigma$ = 0.7 must be set 3.9 m **below** tailwater — one reason low-head plants have deep foundations.

### Choosing a turbine
| Turbine | Head (m) | Flow per unit | $n_q$ | $n_s$ (kW units) |
|---|---|---|---|---|
| Pelton (per jet) | 100–1900 | small | 2–10 | 7–30 |
| Francis | 20–700 | medium to very large | 15–110 | 50–330 |
| Kaplan, propeller | 2–70 | large | 90–300 | 270–900 |
| Bulb | 1.5–25 | very large | 200–400 | 600–1200 |

The ranges overlap and differ between makers; small hydro also uses Turgo and crossflow turbines. The [[specific-speed]] decides. Given the head, the power and a speed the grid frequency allows ($n = 60f/p$ for $p$ pole pairs), the power-based specific speed $n_s = n\\sqrt{P}/H^{5/4}$ (P in kW) points to the shape. Designers choose the fastest synchronous speed whose specific speed the type can still reach without cavitation — a faster machine is smaller and cheaper.
`,
  ideas: [
    'Reaction turbines run full, and the water\'s pressure falls through the runner.',
    'Francis: radial in, axial out, 20–700 m, very efficient near its design point.',
    'Kaplan: an axial propeller whose blades and gates are both adjusted — flat efficiency over a wide flow range.',
    'The draft tube recovers exit energy and lets the runner sit above tailwater, within the Thoma cavitation limit.',
    'Specific speed, from head, power and synchronous speed, points to the turbine type.'
  ],
  pitfalls: [
    'A reaction turbine is driven only by the water\'s speed, like a Pelton — It is driven mostly by the pressure drop across the runner; the whole runner is full of water under pressure.',
    'The draft tube is just a pipe to the river — It slows the water to recover energy and holds the runner\'s outlet below atmospheric pressure, which is why it is shaped as a widening diffuser.',
    'A turbine can be placed as high above the tailwater as convenient — Too high, and the low pressure under the runner makes it cavitate; Thoma\'s coefficient sets the limit, often below tailwater for low-head machines.'
  ],
  formulas: [
    {
      name: 'Turbine specific speed (power-based)',
      expr: 'ns = n*sqrt(P)/H^1.25', tex: 'n_s = \\dfrac{n\\sqrt{P}}{H^{5/4}}',
      vars: {
        ns: { name: 'specific speed n_s (rpm, kW, m)', tex: 'n_s' },
        n: { name: 'turbine speed', q: false, unit: 'rpm', value: 214.3 },
        P: { name: 'power per runner', q: false, unit: 'kW', value: 100000 },
        H: { name: 'net head', q: false, unit: 'm', value: 100 }
      },
      note: 'An empirical convention; with P in metric horsepower instead of kW the numbers are about 17 % higher. n_s ≈ 3 n_q for water turbines.',
      practice: { unknowns: ['ns', 'n'] },
      stories: { ns: 'A turbine gives {P} under {H} of net head at {n}. What is its specific speed?', n: 'A site offers {H} of head for {P} per unit. At what speed would a runner of specific speed {ns} turn?' }
    },
    {
      name: 'Synchronous speed',
      expr: 'n = 60*f/p', tex: 'n = \\dfrac{60 f}{p}',
      vars: {
        n: { name: 'generator (and turbine) speed', q: false, unit: 'rpm' },
        f: { name: 'grid frequency', q: false, unit: 'Hz', value: 50 },
        p: { name: 'number of pole pairs', value: 14, int: true, min: 1 }
      },
      note: 'A synchronous generator must turn at exactly this speed; 50 Hz grids allow 3000, 1500, 1000, 750, 600, 500, 428.6, 375, … rpm.',
      practice: { unknowns: ['n', 'p'] },
      stories: { n: 'A {f} generator has {p} pole pairs. At what speed must the turbine turn?', p: 'A turbine should turn at about {n} on a {f} grid. How many pole pairs does the generator need?' }
    },
    {
      name: 'Turbine setting height (Thoma)',
      expr: 'Hs = (pa - pv)/(rho*g) - sigma*H', tex: 'H_s = \\dfrac{p_a - p_v}{\\rho g} - \\sigma H',
      vars: {
        Hs: { name: 'runner height above tailwater (negative: below)', q: 'length', unit: 'm', signed: true, tex: 'H_s' },
        pa: { name: 'atmospheric pressure at the plant (absolute)', q: 'pressure', unit: 'kPa', value: 101.3, tex: 'p_a' },
        pv: { name: 'vapour pressure of the water', q: 'pressure', unit: 'kPa', value: 2.34, tex: 'p_v' },
        rho: { name: 'water density', q: 'density', unit: 'kg/m³', value: 998, tex: '\\rho' },
        g: { const: 'g' },
        sigma: { name: 'Thoma cavitation coefficient of the turbine', value: 0.7, tex: '\\sigma' },
        H: { name: 'net head', q: 'length', unit: 'm', value: 20 }
      },
      note: 'σ grows with specific speed: roughly 0.05–0.15 for Francis turbines, 0.5–1.5 for Kaplans. Makers give it from model tests.',
      practice: { unknowns: ['Hs', 'sigma'] },
      stories: { Hs: 'A turbine with a Thoma coefficient of {sigma} works under {H} at a site where the air pressure is {pa} (water {rho}, vapour pressure {pv}). How high above the tailwater may its runner be set?', sigma: 'A runner set at {Hs} relative to tailwater works under {H} ({pa}, {pv}, {rho}). What Thoma coefficient can it tolerate?' }
    }
  ],
  examples: [
    {
      title: 'Choosing the type and the speed',
      q: 'A site offers 100 m of net head for a 100 MW unit on a 50 Hz grid. The generator is to have 14 pole pairs. What is the specific speed, and what turbine does it suggest?',
      steps: [
        'Speed: $n = 60 \\times 50/14 = 214.3$ rpm.',
        '$n_s = 214.3 \\times \\sqrt{100\\,000}/100^{1.25} = 214.3 \\times 316.2/316.2 = 214$.',
        'That is well inside the Francis range (about 50–330). Fewer poles — a faster, smaller machine — would push $n_s$ up towards its limit and the cavitation risk with it.'
      ],
      a: 'n_s ≈ 214: a Francis turbine at 214 rpm.'
    },
    {
      title: 'Setting a Kaplan',
      q: 'A Kaplan turbine with $\\sigma$ = 0.7 works under 20 m of head. How high may its runner be above the tailwater at sea level (101.3 kPa, water at 20 °C), and in a valley at 1500 m where the air pressure is 84.6 kPa?',
      steps: [
        'At sea level: $(101\\,300 - 2340)/(998 \\times 9.81) = 10.11$ m; $H_s = 10.11 - 0.7 \\times 20 = -3.9$ m.',
        'At 1500 m: $(84\\,600 - 2340)/(998 \\times 9.81) = 8.40$ m; $H_s = 8.40 - 14 = -5.6$ m.',
        'The runner must sit 3.9 m, and in the mountains 5.6 m, below the tailwater.'
      ],
      a: '3.9 m below tailwater at sea level; 5.6 m below at 1500 m.'
    }
  ],
  quiz: [
    { q: 'Which turbine suits a river weir with 6 m of head and 200 m³/s of flow?', choices: ['Pelton', 'Kaplan or bulb', 'a high-speed Francis', 'Turgo'], a: 1,
      why: 'Very low head and very large flow mean a very high specific speed: an axial propeller runner.' },
    { q: 'A draft tube lets a reaction turbine sit above the tailwater without losing that part of the head.', a: true,
      why: 'The water column in the draft tube hangs below the runner, lowering the pressure there; the head below the runner is still used — up to the cavitation limit.' },
    { q: 'At what speed does a 50 Hz generator with 16 pole pairs turn?', answer: 187.5, unit: 'rpm',
      why: 'n = 60 × 50/16 = 187.5 rpm.' },
    { q: 'Why does a Kaplan keep its efficiency over a wide range of flow?', choices: ['its blades and wicket gates are adjusted together, so the flow always meets the blades correctly', 'it has no draft tube', 'it runs at variable frequency', 'its head is low'], a: 0,
      why: 'Double regulation keeps the velocity triangles right at every load; a fixed-blade propeller loses efficiency quickly away from its design flow.' },
    { q: 'In a Francis turbine, the pressure of the water…', choices: ['stays constant through the runner, as in a Pelton wheel', 'falls as it passes through the runner', 'rises through the runner', 'is atmospheric throughout'], a: 1,
      why: 'That is what makes it a reaction turbine: the runner takes energy from the pressure drop as well as from the change of swirl.' }
  ],
  problems: [
    { q: 'A Francis turbine gives 50 MW under 200 m of net head at 375 rpm. What is its specific speed n_s (rpm, kW, m)?', answer: 111.5, tol: 0.02,
      steps: ['$\\sqrt{P} = \\sqrt{50\\,000} = 223.6$; $H^{1.25} = 200^{1.25} = 752$.', '$n_s = 375 \\times 223.6/752 = 111.5$ — a medium-speed Francis runner.'] }
  ],
  applications: ['Large river dams, with Francis units of hundreds of megawatts each.', 'Low-head barrages and tidal plants with Kaplan and bulb units.', 'Reversible Francis pump-turbines in pumped-storage plants.'],
  history: 'James B. Francis, engineer to the mills of Lowell, Massachusetts, tested and refined the inward-flow turbine in the late 1840s, and his careful measurements made it the standard medium-head machine. Viktor Kaplan, a professor in Brno, developed the adjustable-blade propeller turbine in the 1910s; cavitation damage troubled the first units until it was understood in the 1920s. The tidal plant on the Rance estuary in France, opened in 1966, runs 24 bulb turbines of 10 MW.',
  sim: 'pump-turbine-chart'
},

{
  id: 'pumped-storage', parent: 'hydro-turbines', title: 'Pumped storage', level: 2,
  short: 'Two reservoirs at different heights: pump water up when electricity is plentiful, let it run back through turbines when it is scarce. The largest form of grid storage, with a round-trip efficiency of 70–80 % and a response measured in seconds to minutes.',
  keywords: ['pumped storage', 'pumped hydro', 'energy storage', 'round-trip efficiency', 'pump-turbine', 'reversible', 'ternary set', 'variable speed', 'grid balancing', 'upper reservoir', 'GWh', 'Dinorwig'],
  prereq: ['hydropower', 'francis-kaplan', 'physics:efficiency'],
  related: ['pump-head-power', 'centrifugal-pump', 'affinity-laws', 'physics:gravitational-potential-energy', 'physics:conservation-of-energy'],
  body: `
Electricity is hard to store; water on a hill is easy. A **pumped-storage** plant has two reservoirs at different heights joined by tunnels or penstocks. When electricity is plentiful — at night, on sunny middays, in windy spells — it pumps water up; when it is scarce, the water runs back down through the same machines working as turbines. It is the oldest and still by far the largest form of grid storage: well over 150 GW worldwide in the early 2020s, and most of the world's stored energy.

### How much energy?
The energy stored is the water's potential energy, less what the turbines lose:

$$E = \\eta_t\\,\\rho g V H$$

One cubic metre at 500 m gives 1.2 kWh at 90 %. A gigawatt-hour needs about 0.73 million m³ of water at 500 m of head, but 3.7 million m³ at 100 m — so the best sites have a large height difference over a short distance. A scheme with 7 million m³ of usable water at 500 m holds about 8.6 GWh: five hours at 1.7 GW.

### Round-trip efficiency
Every loss is paid twice — once going up, once coming down:
- pumping: motor about 98 %, pump 90–92 %, and the friction in the tunnels, so the pump lifts against $H + h_L$;
- generating: turbine 90–93 %, generator about 98 %, and the same friction, so the turbine sees only $H - h_L$;
- transformers both ways.

The **round-trip efficiency** is therefore typically **70–80 %**: of 100 kWh bought for pumping, 70–80 kWh come back. With a pumping chain of 89 %, a generating chain of 90 % and 10 m of friction on 500 m of head,

$$\\eta_{rt} = \\eta_p\\,\\eta_t\\,\\frac{H - h_L}{H + h_L} = 0.89 \\times 0.90 \\times \\frac{490}{510} = 77\\ \\%$$

Evaporation and leakage from the reservoirs take a little more over longer periods.

### The machines
Most plants use **reversible pump-turbines**: a Francis-type runner that pumps when driven one way and generates when the water drives it the other, coupled to a motor-generator. Being a compromise between a pump and a turbine shape costs a few points of efficiency. **Ternary sets** — a separate pump and turbine on one shaft with the motor-generator — switch modes in seconds and can even pump and generate at once. **Variable-speed** units can vary their pumping power continuously, helping the grid absorb fluctuating wind and solar output.

### Speed of response
A unit already spinning — in air, with its runner blown dry, or in the water — can take full load within seconds to a minute or two; from standstill in a few minutes. Britain's Dinorwig, built inside a Welsh mountain and able to deliver about 1.7 GW, is known for picking up load in seconds when millions of kettles go on at once after a televised event.

### Why build them
Pumped storage moves energy in **time**, from hours of surplus to hours of shortage, and supports the grid with fast reserve, frequency control and the ability to restart a blacked-out grid. The 20–30 % of the energy it loses is the price of that flexibility. Batteries now serve many short-duration needs, but for storing many hours of energy at gigawatt scale, water on a hill is still hard to beat.

> [!warn] Pumped-storage reservoirs can rise and fall by metres within hours, and their intakes and outlets carry strong, sudden currents. Swimming and boating near them are dangerous and usually forbidden.
`,
  ideas: [
    'Pump up when power is plentiful, generate when it is scarce: energy moved in time.',
    'Stored energy E = η ρ g V H: high heads need far less water.',
    'Every loss is paid twice, so the round trip is 70–80 %.',
    'Reversible pump-turbines, ternary sets and variable-speed units trade cost, efficiency and flexibility.',
    'Response in seconds to minutes makes pumped storage a grid stabiliser as well as a store.'
  ],
  pitfalls: [
    'Pumped storage produces energy — It consumes more than it returns (70–80 % comes back); its value is in shifting energy to when it is needed and in fast reserve.',
    'Pipe friction matters only when generating — The pump must overcome it too: friction lowers the turbine\'s head and raises the pump\'s, so it counts twice.',
    'Any two reservoirs make a good scheme — Energy is proportional to head times volume; low heads need enormous volumes, so steep sites are prized.'
  ],
  formulas: [
    {
      name: 'Energy stored in the upper reservoir',
      expr: 'E = eta*rho*g*V*H/(3.6*10^12)', tex: 'E = \\dfrac{\\eta_t\\,\\rho_w g V H}{3.6\\times10^{12}}',
      vars: {
        E: { name: 'recoverable energy', q: false, unit: 'GWh' },
        eta: { name: 'generating efficiency', q: 'ratio', unit: '%', value: 90, min: 1, max: 100, tex: '\\eta_t' },
        rho: { const: 'rhoW' },
        g: { const: 'g' },
        V: { name: 'usable water volume', q: 'volume', unit: 'm³', value: 7000000 },
        H: { name: 'average head', q: 'length', unit: 'm', value: 500 }
      },
      note: 'ρgVH in joules; 1 GWh = 3.6 × 10¹² J. Use the average head as the reservoirs change level.',
      practice: { unknowns: ['E', 'V'] },
      stories: { E: 'An upper reservoir holds {V} of usable water {H} above the lower one. At {eta} generating efficiency, how much energy does it store?', V: 'A scheme with {H} of head must store {E} at {eta} generating efficiency. How much water does it need?' }
    },
    {
      name: 'Round-trip efficiency',
      expr: 'etaRT = etaP*etaT*(H - hL)/(H + hL)', tex: '\\eta_{rt} = \\eta_p\\,\\eta_t\\,\\dfrac{H - h_L}{H + h_L}',
      vars: {
        etaRT: { name: 'round-trip efficiency', q: 'ratio', unit: '%', tex: '\\eta_{rt}' },
        etaP: { name: 'pumping chain (motor and pump)', q: 'ratio', unit: '%', value: 89, min: 1, max: 100, tex: '\\eta_p' },
        etaT: { name: 'generating chain (turbine and generator)', q: 'ratio', unit: '%', value: 90, min: 1, max: 100, tex: '\\eta_t' },
        H: { name: 'gross head', q: 'length', unit: 'm', value: 500 },
        hL: { name: 'friction loss in the waterways (each way)', q: 'length', unit: 'm', value: 10, tex: 'h_L' }
      },
      note: 'Assumes the same flow, and so the same friction loss, both ways. Transformer losses and evaporation lower it a little more.',
      practice: { unknowns: ['etaRT', 'hL'] },
      stories: { etaRT: 'A pumped-storage plant has {H} of gross head and loses {hL} in its tunnels each way; the pumping chain is {etaP} and the generating chain {etaT} efficient. What is its round-trip efficiency?', hL: 'A plant with {H} of head, a {etaP} pumping chain and a {etaT} generating chain achieves {etaRT} round trip. How much head does it lose each way?' }
    },
    {
      name: 'Power when generating',
      expr: 'P = eta*rho*g*Q*(H - hL)', tex: 'P = \\eta_t\\,\\rho_w g Q\\,(H - h_L)',
      vars: {
        P: { name: 'electrical output', q: 'power', unit: 'MW' },
        eta: { name: 'generating efficiency', q: 'ratio', unit: '%', value: 90, min: 1, max: 100, tex: '\\eta_t' },
        rho: { const: 'rhoW' },
        g: { const: 'g' },
        Q: { name: 'flow', q: 'flowrate', unit: 'm³/s', value: 390 },
        H: { name: 'gross head', q: 'length', unit: 'm', value: 500 },
        hL: { name: 'friction loss in the waterways', q: 'length', unit: 'm', value: 10, tex: 'h_L' }
      },
      practice: { unknowns: ['P', 'Q'] },
      stories: { P: 'A pumped-storage plant with {H} of gross head and {hL} of losses passes {Q} through its turbines at {eta}. What does it generate?', Q: 'A plant with {H} of head, {hL} of losses and {eta} efficiency must deliver {P}. What flow does it need?' }
    }
  ],
  examples: [
    {
      title: 'How much can it store?',
      q: 'An upper reservoir holds 7 million m³ of usable water 500 m above the lower one. At 90 % generating efficiency, how much energy does it store, and for how long can it deliver 1.7 GW?',
      steps: [
        '$E = 0.9 \\times 1000 \\times 9.81 \\times 7\\times10^6 \\times 500 = 3.09\\times10^{13}$ J.',
        'In GWh: $3.09\\times10^{13}/3.6\\times10^{12} = 8.6$ GWh.',
        'At 1.7 GW: $8.6/1.7 = 5.0$ hours.'
      ],
      a: 'About 8.6 GWh — five hours at 1.7 GW.'
    },
    {
      title: 'A night of pumping',
      q: 'The same plant pumps for 6 hours at 1.8 GW of electrical input, with a pumping chain of 89 %, 500 m of head and 10 m of friction. How much water goes up, and how much energy comes back at 90 % generating efficiency?',
      steps: [
        'Pumping flow: $Q = 0.89 \\times 1.8\\times10^9/(1000 \\times 9.81 \\times 510) = 320$ m³/s; in 6 hours, $6.9\\times10^6$ m³.',
        'Energy in: $1.8 \\times 6 = 10.8$ GWh.',
        'Energy out: $0.9 \\times 9810 \\times 6.9\\times10^6 \\times 490/3.6\\times10^{12} = 8.3$ GWh — at 1.7 GW, 4.9 hours of generation.',
        'Round trip: $8.3/10.8 = 77$ %.'
      ],
      a: '6.9 million m³ pumped up; 8.3 of the 10.8 GWh come back (77 %).'
    }
  ],
  quiz: [
    { q: 'The round-trip efficiency of a modern pumped-storage plant is about…', choices: ['30–40 %', '50–60 %', '70–80 %', '95–99 %'], a: 2,
      why: 'About 90 % each way for the machines, plus friction and transformer losses paid twice.' },
    { q: 'For the same energy stored, a scheme with twice the head needs half the volume of water.', a: true,
      why: 'E = ηρgVH: at fixed E, V is inversely proportional to H.' },
    { q: 'How much electricity (kWh) does 1 m³ of water give falling 500 m at 90 % efficiency?', answer: 1.23, unit: 'kWh',
      why: '0.9 × 1000 × 9.81 × 500 = 4.41 MJ = 1.23 kWh.' },
    { q: 'Why are some pumped-storage units kept spinning in air, with their runners blown dry?', choices: ['to cool them', 'so they can take load within seconds', 'to pump air into the reservoir', 'to stop cavitation'], a: 1,
      why: 'A spinning, synchronised unit only has to admit water to generate: response in seconds rather than minutes.' },
    { q: 'Which losses count twice in a pumped-storage cycle?', choices: ['the friction in the waterways and the machine losses, once pumping and once generating', 'evaporation only', 'none: they cancel', 'only the generator\'s'], a: 0,
      why: 'Going up the pump must overcome friction and its own losses; coming down the turbine loses them again.' }
  ],
  problems: [
    { q: 'A scheme has 300 m of head and an upper reservoir holding 2 million m³ of usable water. At 90 % generating efficiency (ignoring friction), how much energy does a full reservoir store, in GWh?', answer: 1.47, unit: 'GWh', tol: 0.02,
      steps: ['$E = 0.9 \\times 1000 \\times 9.81 \\times 2\\times10^6 \\times 300 = 5.30\\times10^{12}$ J.', 'Divide by $3.6\\times10^{12}$ J/GWh: 1.47 GWh.'] }
  ],
  applications: ['Daily shifting of energy from night or midday surpluses to evening peaks.', 'Fast reserve and frequency control, and restarting a grid after a blackout.', 'Absorbing surplus wind and solar output that would otherwise be curtailed.'],
  history: 'The first pumped-storage plants were built in Italy and Switzerland in the 1890s. Most of today\'s large schemes date from the 1960s to the 1980s, when they stored the night-time output of big thermal and nuclear stations; the growth of wind and solar power has brought a new wave of projects.',
  sim: 'pump-storage-day'
}

);
