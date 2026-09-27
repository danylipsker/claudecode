/* HYPER-PNEUMATICS · content/sizing.js — Sizing and Dynamics
 * cylinder-dynamics: cylinder-motion, filling-emptying, pneumatic-spring, chamber-temperature, kinetic-energy-limits, stick-slip
 * system-sizing:     sizing-procedure, conductance-series, tubing-length-effect, consumption-budget
 * Simulations in sims/sizing.js (dyn-*). */
Hyper.add(

/* ================================================================ CYLINDER DYNAMICS */
{
  id: 'cylinder-motion', parent: 'cylinder-dynamics', title: 'How a cylinder moves', level: 2,
  short: 'A pneumatic stroke is a sequence of phases: the valve shifts, the pressures change while nothing moves, the piston accelerates, runs at the speed its exhaust path allows, is cushioned at the end — and only afterwards does the pressure climb to give full force. Each phase has its own physics and its own cure.',
  keywords: ['stroke time', 'dead time', 'response time', 'pressure build-up', 'acceleration', 'steady speed', 'meter-out', 'choked flow', 'back pressure', 'end of stroke', 'impact', 'pressure trace', 'cycle time', 'breakaway'],
  prereq: ['pneumatic-cylinder', 'sonic-conductance', 'choked-flow', 'flow-control-pneu'],
  related: ['filling-emptying', 'pneumatic-spring', 'kinetic-energy-limits', 'cylinder-speed-pneu', 'valve-sizing', 'sizing-procedure', 'pneumatic-cushioning', 'conductance-series', 'hydraulics:valve-sizing-dynamics'],
  body: `
Put pressure sensors on both ports of a cylinder and a position sensor on its rod, switch the valve, and record. The traces tell a story that the catalogue formula "speed = flow / area" misses completely: for the first tens of milliseconds nothing moves at all, the speed is set by the air *leaving* rather than the air arriving, the exhausting side can end up above the supply pressure, and the piston reaches the end cap well before the cylinder can push with its full force.

### The phases of a stroke
The simulation below records a 32 mm cylinder (12 mm rod, 200 mm stroke) moving 2 kg against a load of 20 % of its force, with a valve of $C = 1.2$ dm³/(s·bar), meter-out throttles set to $C = 0.4$ and air cushioning, at 6 bar:

| Phase | What happens | Time |
|---|---|---|
| Valve shifts | the solenoid pilot moves the spool | 12 ms |
| Pressure build-up | the cap end fills from its dead volume, the rod end blows down; the forces do not yet beat load and friction | 44 ms |
| Acceleration | the net force accelerates the load; both pressures swing | 65 ms |
| Steady speed | the rod-end air is pushed out through the throttle as fast as it can go | 297 ms |
| Cushioning | the cushion traps the last air; the piston slows to about 0.1 m/s | 84 ms |
| Pressure to supply | the piston has stopped; the cap end fills to supply, the rod end empties | 117 ms |

The piston arrives after 0.50 s, but full force is available only after 0.62 s — the difference matters for a clamp that must hold before a drill starts.

### Nothing moves until the forces balance
The piston breaks away when the pressure difference beats the load and the seals' breakaway friction. In gauge pressures,

$$(p_A - p_\\text{atm})A_1 - (p_B - p_\\text{atm})A_2 \\ge F_\\text{load} + F_\\text{friction}$$

Extending a lightly loaded cylinder, this happens almost at once: the cap end is small (just its dead volume and tube) and fills in a few milliseconds, and the piston area is larger than the annulus, so equal pressures on both sides already push outwards. Retracting is slower: the whole cap-end chamber, full at supply pressure, must first blow down until the smaller annulus can win. With no load, the simulated dead time (valve included) is 23 ms extending and 81 ms retracting. The blow-down is the emptying of a volume through a conductance ([[filling-emptying]]), which gives the estimate below.

### The exhaust sets the speed
With meter-out control, the air ahead of the piston is squeezed until it leaves through the throttle as fast as the piston sweeps it. While that restriction is choked, the mass flow is $\\dot m = C\\,p_B\\,\\rho_0$ — proportional to the chamber pressure — and the volume it takes out of the chamber is $\\dot m/\\rho_B = C\\,p_0$ at 20 °C, *whatever the pressure*. So

$$v = \\frac{C\\,p_0}{A}$$

with $C$ the conductance of the whole exhaust path (valve, throttle, tube, silencer in series, see [[conductance-series]]), $A$ the area of the exhausting side and $p_0 = 1$ bar, the reference of free air. In the example, $C = 0.38$ dm³/(s·bar) on 6.91 cm² gives 0.55 m/s — and it stays 0.55 m/s at 4 bar supply as well. Raising the pressure does not make a meter-out cylinder faster; opening the throttle, or a bigger valve and tube, does.

A surprise hides in the force balance: the rod-end pressure during extension can exceed the supply pressure. The cap end sits a little below supply (the valve cannot fill it completely while the piston moves), and the same force acting on the smaller annulus needs a higher pressure — about 6.1 bar gauge against a 6.0 bar supply in the example.

### The end of the stroke
At the end the kinetic energy must go somewhere: into the air cushion, an elastic bumper or a shock absorber ([[kinetic-energy-limits]], [[pneumatic-cushioning]]). A cushion that is too tight stops the piston short and lets it creep the last millimetres, adding tenths of a second; one that is too open lets it bang.

> [!key] A stroke time is a sum: valve response + pressure build-up + acceleration + stroke at the exhaust-limited speed + cushioning — and full force comes later still. Speed up the part that dominates.

> [!warn] A cylinder under test moves suddenly and hard. Keep hands and tools out of its path, secure the load, and remember that a system being pressurised can move cylinders before any valve is switched: use a soft-start valve and exhaust the air before touching the mechanism.
`,
  ideas: [
    'Nothing moves until the pressure difference beats load and breakaway friction: that wait is the dead time.',
    'With meter-out control the speed is set by the exhaust path: v = C·p₀/A while the restriction is choked, independent of pressure.',
    'Retracting usually has the longer dead time: the full cap-end chamber must blow down first.',
    'The rod-end pressure can exceed supply during extension, because the annulus is smaller than the piston.',
    'The piston arrives before the full force does: the driving chamber must still fill to supply.'
  ],
  pitfalls: [
    'Stroke time = stroke / (valve flow / area) — That ignores the dead time, the acceleration, the cushioning and the fact that the exhaust side, not the supply side, limits a meter-out cylinder.',
    'More supply pressure makes a slow cylinder faster — While the exhaust restriction is choked the speed is C·p₀/A, independent of pressure; more pressure only adds force at the end cap and air consumption.',
    'When the piston stops, the job is done — A clamp or press reaches full force only when its chamber has filled to supply, often 0.1–0.3 s later.'
  ],
  formulas: [
    {
      name: 'Speed set by a choked meter-out restriction',
      expr: 'v = C*p0/A', tex: 'v = \\dfrac{C\\,p_0}{A}',
      vars: {
        v: { name: 'piston speed', q: 'speed', unit: 'm/s' },
        C: { name: 'sonic conductance of the exhaust path (valve, throttle, tube in series)', q: 'flowcond', unit: 'dm³/(s·bar)', value: 0.38 },
        p0: { name: 'reference pressure of free air (ANR, absolute)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_0' },
        A: { name: 'area of the exhausting side (the annulus when extending)', q: 'area', unit: 'cm²', value: 6.91 }
      },
      note: 'Valid while the exhaust path is choked: the exhausting chamber above about p_atm/b (≈ 3.4 bar absolute for b = 0.3). Air at 20 °C; colder exhaust air runs a few per cent slower.',
      practice: { unknowns: ['v', 'C'] },
      stories: { v: 'The exhaust path of a cylinder — valve and meter-out throttle together — has a sonic conductance of {C}, and the exhausting side has an area of {A}. How fast does the piston run while the throttle is choked?', C: 'A cylinder must run at {v}; its exhausting side has an area of {A}. What conductance must the exhaust path have?' }
    },
    {
      name: 'Back pressure on the annulus (force balance)',
      expr: 'pB = (pA*A1 - F)/A2', tex: 'p_B = \\dfrac{p_A A_1 - F}{A_2}',
      vars: {
        pB: { name: 'rod-end pressure (gauge)', q: 'pressure', unit: 'bar', tex: 'p_B' },
        pA: { name: 'cap-end pressure (gauge)', q: 'pressure', unit: 'bar', value: 5.8, tex: 'p_A' },
        A1: { name: 'piston area', q: 'area', unit: 'cm²', value: 8.04, tex: 'A_1' },
        A2: { name: 'annulus area', q: 'area', unit: 'cm²', value: 6.91, tex: 'A_2' },
        F: { name: 'load and friction to overcome', q: 'force', unit: 'N', value: 43 }
      },
      note: 'Steady speed, extending, gauge pressures. With F = load + breakaway friction it also gives the rod-end pressure at which the piston starts to move.',
      stories: { pB: 'A cylinder with a piston of {A1} and an annulus of {A2} extends at steady speed with {pA} on the cap end against {F} of load and friction. What is the rod-end pressure?' }
    },
    {
      name: 'Dead time: blowing down the exhausting chamber',
      expr: 't = V/(n*C*p0)*ln(p1/p2)', tex: 't_d = \\dfrac{V}{n\\,C\\,p_0}\\,\\ln\\dfrac{p_1}{p_2}',
      vars: {
        t: { name: 'dead time (blow-down)', q: 'time', unit: 'ms', tex: 't_d' },
        V: { name: 'volume of the exhausting chamber and its tube', q: 'volume', unit: 'cm³', value: 176 },
        n: { name: 'polytropic exponent (1 slow, 1.4 fast)', value: 1 },
        C: { name: 'sonic conductance of the exhaust path', q: 'flowcond', unit: 'dm³/(s·bar)', value: 0.38 },
        p0: { name: 'reference pressure of free air (ANR, absolute)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_0' },
        p1: { name: 'starting pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.013, tex: 'p_1' },
        p2: { name: 'pressure at which the piston breaks away (absolute)', q: 'pressure', unit: 'bar', value: 5.9, tex: 'p_2' }
      },
      note: 'Choked blow-down (p₂ above p_atm/b). n = 1 treats the air as staying at 20 °C, n = 1.4 as adiabatic; real blow-downs lie between. Add the valve response time.',
      practice: { unknowns: ['t', 'V'] },
      stories: { t: 'Retracting, a cap-end chamber of {V} at {p1} must blow down to {p2} through an exhaust path of {C} before the piston moves (take n = {n}). How long is the dead time?' }
    }
  ],
  examples: [
    {
      title: 'Why pressure does not buy speed',
      q: 'A 32 mm cylinder (12 mm rod) extends with meter-out control; valve $C = 1.2$ and throttle $C = 0.4$ dm³/(s·bar). What is its steady speed at 6 bar, and at 4 bar? Take $b = 0.3$.',
      steps: [
        'Exhaust path in series: $C = 1/\\sqrt{1/1.2^2 + 1/0.4^2} = 1/\\sqrt{0.694 + 6.25} = 0.38$ dm³/(s·bar).',
        'Annulus: $A_2 = \\pi(0.032^2 - 0.012^2)/4 = 6.91$ cm².',
        '$v = C p_0/A_2 = 0.38\\times10^{-8} \\times 10^5 / 6.91\\times10^{-4} = 0.55$ m/s.',
        'At 6 bar supply the rod end runs at about 6.1 bar gauge (7.1 bar absolute); at 4 bar about 4 bar gauge (5 bar absolute). Both are well above $p_\\text{atm}/b = 3.4$ bar absolute, so the throttle is choked in both cases and the speed is the same.'
      ],
      a: '0.55 m/s at both pressures — the simulation gives 0.54 m/s. To go faster, open the throttle or enlarge the exhaust path.'
    },
    {
      title: 'Where the retract time goes',
      q: 'The same cylinder retracts with no load. The cap-end chamber and its tube hold 176 cm³ at 7.0 bar absolute; the piston moves once the cap end has fallen to about 5.9 bar absolute. The exhaust path has $C = 0.38$ dm³/(s·bar). Estimate the dead time.',
      steps: [
        'Time constant: $V/(C p_0) = 1.76\\times10^{-4}/(0.38\\times10^{-8} \\times 10^5) = 0.463$ s.',
        'Blow-down: $\\ln(7.013/5.9) = 0.173$.',
        'Isothermal ($n = 1$): $t_d = 0.463 \\times 0.173 = 80$ ms; adiabatic ($n = 1.4$): 57 ms.',
        'Add the valve response of about 12 ms, and some time for the rod end to fill: the simulation gives 81 ms in all.'
      ],
      a: 'About 60–80 ms of blow-down plus the valve time — several times the extending dead time.'
    }
  ],
  quiz: [
    { q: 'A meter-out cylinder runs at 0.5 m/s with its throttle choked. The supply is raised from 6 to 8 bar. The steady speed…', choices: ['rises by a third', 'hardly changes', 'doubles', 'rises by √(8/6)'], a: 1,
      why: 'While the exhaust restriction is choked, the volume it removes from the chamber is C·p₀, independent of the chamber pressure, so v = C·p₀/A. Higher supply pressure only raises the back pressure.' },
    { q: 'Nothing moves until the driving chamber has reached full supply pressure.', a: false,
      why: 'The piston breaks away as soon as the pressure difference beats load and breakaway friction — usually far below supply. The driving chamber reaches supply only after the piston has stopped.' },
    { q: 'The exhaust path of a 32 mm cylinder (annulus 6.91 cm²) has C = 0.5 dm³/(s·bar). What is the steady extending speed (m/s)?', answer: 0.724, unit: 'm/s', tol: 0.03,
      why: 'v = C·p₀/A = 0.5×10⁻⁸ × 10⁵ / 6.91×10⁻⁴ = 0.72 m/s.' },
    { q: 'During meter-out extension the rod-end pressure can exceed the supply pressure because…', choices: ['the compressor surges', 'the annulus is smaller than the piston, so the same force needs a higher pressure there', 'the throttle adds pressure', 'the air heats up'], a: 1,
      why: 'Force balance: p_B·A₂ ≈ p_A·A₁ − F. With A₁/A₂ ≈ 1.16 and a light load, p_B ends up above p_A and even above supply.' },
    { q: 'A clamp cylinder reaches its work piece 0.3 s after the valve switches. When does it clamp with full force?', choices: ['at 0.3 s', 'later, once the driving chamber has filled to supply and the other side has emptied', 'before 0.3 s', 'never, the throttle limits it'], a: 1,
      why: 'At the moment of contact the driving chamber is below supply and the other chamber still holds air; both must settle, typically another 0.1–0.3 s.' }
  ],
  problems: [
    { q: 'A 50 mm cylinder (20 mm rod) extends with a meter-out exhaust path of C = 1.0 dm³/(s·bar). What is its steady speed?', answer: 0.606, unit: 'm/s', tol: 0.03,
      steps: ['Annulus: $\\pi(0.05^2 - 0.02^2)/4 = 16.49$ cm².', '$v = 1.0\\times10^{-8} \\times 10^5 / 16.49\\times10^{-4} = 0.61$ m/s.'] },
    { q: 'A cap-end chamber of 250 cm³ blows down from 7.0 to 5.5 bar absolute through an exhaust path of C = 0.5 dm³/(s·bar). Isothermal estimate of the dead time, in ms?', answer: 121, unit: 'ms', tol: 0.03,
      steps: ['$V/(C p_0) = 2.5\\times10^{-4}/(0.5\\times10^{-8} \\times 10^5) = 0.5$ s.', '$\\ln(7.0/5.5) = 0.241$.', '$t_d = 0.5 \\times 0.241 = 0.121$ s = 121 ms.'] }
  ],
  applications: ['Estimating the cycle time of a pick-and-place unit before it is built.', 'Diagnosing a slow machine from pressure traces: a long build-up points to the exhaust, a slow steady phase to the throttle or tubes.', 'Waiting for full clamping pressure (a pressure switch, not a position sensor) before machining.', 'Choosing between a bigger valve and shorter tubes.'],
  sim: 'dyn-stroke-phases'
},

{
  id: 'filling-emptying', parent: 'cylinder-dynamics', title: 'Filling and emptying a volume', level: 2,
  short: 'Filling a volume through a valve or blowing it down: while the flow is choked the pressure rises at a constant rate (filling) or falls exponentially (emptying), on a time scale V/(C·p₀). Fast processes are adiabatic — filling heats the air, emptying chills it — and the pressure drifts afterwards as the air returns to room temperature.',
  keywords: ['filling time', 'emptying time', 'blow-down', 'time constant', 'choked flow', 'subsonic flow', 'ISO 6358', 'adiabatic filling', 'isothermal', 'receiver', 'pressure sag', 'heat of compression', 'Clément–Desormes'],
  prereq: ['sonic-conductance', 'choked-flow', 'isothermal-adiabatic', 'standard-air'],
  related: ['cylinder-motion', 'chamber-temperature', 'receivers', 'receiver-sizing', 'tubing-length-effect', 'vacuum-circuits', 'aerodynamics:nozzles', 'physics:first-law-thermodynamics'],
  body: `
Every pneumatic movement begins by filling a volume and ends by emptying one — a cylinder chamber, a tube, a receiver, a vacuum cup. The two processes are governed by the flow through the valve, described by ISO 6358-1:2013 with a sonic conductance $C$ and a critical pressure ratio $b$ ([[sonic-conductance]]):

$$q = C\\,p_1\\sqrt{\\tfrac{293\\,\\mathrm{K}}{T_1}} \\quad\\text{(choked, } p_2/p_1 \\le b\\text{)}$$

and less, along an elliptical curve, when the downstream pressure is higher. $q$ is free air (ANR), $p_1$ absolute.

### Filling: a straight line, then a slow finish
While the volume is below $b\\,p_s$ the flow is choked and constant, so mass arrives at a steady rate and the pressure climbs in a straight line:

$$\\frac{dp}{dt} = \\frac{n\\,C\\,p_s\\,p_0}{V}$$

with $p_0 = 1$ bar (the ANR reference) and $n = 1$ if the air stays at room temperature, 1.4 if it has no time to lose heat. Above $b\\,p_s$ the flow tapers off, and the last few per cent take longest. With $b = 0.3$ and a 6 bar supply the choked phase ends at only 2.1 bar absolute, so most of a real filling is subsonic.

### Emptying: an exponential decay
Blowing down through a choked restriction, the outflow is proportional to the pressure, so the pressure decays exponentially:

$$p = p_1\\,e^{-n C p_0 t/V}$$

until it reaches $p_\\text{atm}/b$ (3.4 bar absolute for $b = 0.3$); below that the flow is subsonic and the tail is slower.

### The time scale V/(C·p₀)
Both processes run on the same clock, $\\tau = V/(C\\,p_0)$: one litre through $C = 1$ dm³/(s·bar) has $\\tau = 1$ s. Double the volume or halve the conductance and everything takes twice as long. In the simulation (1 L, $C = 1$, $b = 0.3$, 6 bar):

| | Isothermal | Adiabatic | Real (walls, 4 s) |
|---|---|---|---|
| Fill to 98 % | 1.10 s | 0.79 s | 0.85 s |
| Peak temperature | 20 °C | 115 °C | 99 °C |
| Empty to 2 % | 1.98 s | 1.63 s | 1.96 s |
| Lowest temperature | 20 °C | −99 °C | −57 °C |

### Why the temperature changes
Air pushed into a closed volume does work on the air already there: each kilogram brings in its enthalpy, $c_p T$, but can only hold internal energy, $c_v T$. Filled quickly from atmospheric pressure to 7 bar absolute, the air ends at about 115 °C (see [[chamber-temperature]]) — which also means the pressure rose 1.4 times faster than the isothermal estimate. Close the valve and wait: the air cools back to 20 °C at constant volume, and the gauge falls from 6.0 to about 4.3 bar. Emptying is the mirror image: the air left behind expands and cools, and after the valve closes the pressure creeps back up as it warms.

> [!tip] A pressure-decay leak test must wait for the air to settle after filling; otherwise cooling looks exactly like a leak. Receivers, tyres and test fixtures all show the effect.

> [!warn] A volume being emptied through a small restriction can hold pressure for longer than expected. Check a gauge reads zero before opening anything, and never point an exhaust or blow-down at a person.
`,
  ideas: [
    'Filling through a choked valve raises the pressure at a constant rate; emptying through one lets it decay exponentially.',
    'The time scale of both is V/(C·p₀): one litre through C = 1 dm³/(s·bar) takes about a second.',
    'Most real fillings end subsonic: the last few per cent of pressure are the slowest.',
    'Fast filling heats the air and fast emptying chills it, so the pressure drifts afterwards as the temperature returns.',
    'Adiabatic filling raises the pressure up to 1.4 times faster than isothermal filling for the same mass flow.'
  ],
  pitfalls: [
    'A vessel filled to 6 bar stays at 6 bar — If it was filled quickly, the air is hot; as it cools at constant volume the pressure can fall by a bar or more.',
    'Emptying time is proportional to the pressure — While choked, the pressure falls by the same fraction in each time interval (exponentially), so halving from 8 to 4 bar takes as long as from 4 to 2.',
    'The valve with the bigger nominal flow fills faster at any pressure — Near the end of a filling the flow is subsonic, and a valve with a higher b keeps more of its flow there; C alone does not tell the whole story.'
  ],
  formulas: [
    {
      name: 'Choked flow of free air (ISO 6358)',
      expr: 'Q = C*p1', tex: 'Q = C\\,p_1',
      vars: {
        Q: { name: 'free-air flow', q: 'airflow', unit: 'L/min ANR' },
        C: { name: 'sonic conductance', q: 'flowcond', unit: 'dm³/(s·bar)', value: 1.2 },
        p1: { name: 'upstream pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.013, tex: 'p_1' }
      },
      note: 'Choked flow (p₂/p₁ ≤ b), upstream air at 20 °C. For other upstream temperatures multiply by √(293 K / T₁).',
      stories: { Q: 'A valve of sonic conductance {C} passes air from {p1} into a chamber at low pressure. How much free air flows?', C: 'A valve must pass {Q} of free air, choked, from {p1}. What sonic conductance does it need?' }
    },
    {
      name: 'Filling time while choked',
      expr: 't = V*(p2 - p1)/(n*C*ps*p0)', tex: 't = \\dfrac{V\\,(p_2 - p_1)}{n\\,C\\,p_s\\,p_0}',
      vars: {
        t: { name: 'filling time', q: 'time', unit: 's' },
        V: { name: 'volume filled', q: 'volume', unit: 'L', value: 1 },
        p2: { name: 'pressure reached (absolute, at most b·p_s)', q: 'pressure', unit: 'bar', value: 2.1, tex: 'p_2' },
        p1: { name: 'starting pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.013, tex: 'p_1' },
        n: { name: 'polytropic exponent (1 isothermal, 1.4 adiabatic)', value: 1 },
        C: { name: 'sonic conductance of the path', q: 'flowcond', unit: 'dm³/(s·bar)', value: 1 },
        ps: { name: 'supply pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.013, tex: 'p_s' },
        p0: { name: 'reference pressure of free air (ANR, absolute)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_0' }
      },
      note: 'Valid while the flow is choked, p₂ ≤ b·p_s. The rest of the filling (subsonic) takes longer, typically as long again as V/(C·p₀).',
      practice: { unknowns: ['t', 'V', 'C'] },
      stories: { t: 'A volume of {V} is filled through a path of {C} from a supply at {ps}, from {p1} to {p2} (take n = {n}). How long does it take?', C: 'A volume of {V} must go from {p1} to {p2} in {t} from a supply at {ps} (n = {n}). What conductance is needed?' }
    },
    {
      name: 'Emptying while choked',
      expr: 'p2 = p1*exp(-n*C*p0*t/V)', tex: 'p_2 = p_1\\,e^{-n C p_0 t/V}',
      vars: {
        p2: { name: 'pressure after time t (absolute)', q: 'pressure', unit: 'bar', tex: 'p_2' },
        p1: { name: 'starting pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.013, tex: 'p_1' },
        n: { name: 'polytropic exponent (1 isothermal, 1.4 adiabatic)', value: 1 },
        C: { name: 'sonic conductance of the path', q: 'flowcond', unit: 'dm³/(s·bar)', value: 1 },
        p0: { name: 'reference pressure of free air (ANR, absolute)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_0' },
        t: { name: 'time', q: 'time', unit: 's', value: 0.5 },
        V: { name: 'volume', q: 'volume', unit: 'L', value: 1 }
      },
      note: 'Valid down to p_atm/b (3.4 bar absolute for b = 0.3); below that the flow is subsonic and the tail is slower. The adiabatic case is approximate, because the cooling air flows out more densely.',
      practice: { unknowns: ['p2', 't'] },
      stories: { p2: 'A volume of {V} at {p1} blows down through {C} for {t} (n = {n}). What pressure is left?', t: 'How long does a volume of {V} take to blow down from {p1} to {p2} through {C} (n = {n})?' }
    }
  ],
  examples: [
    {
      title: 'Filling one litre',
      q: 'A 1 L volume at atmospheric pressure is filled from a 6 bar gauge supply through a path with $C = 1$ dm³/(s·bar), $b = 0.3$. How long is the choked phase, and what is the time scale of the whole filling?',
      steps: [
        'Supply 7.013 bar absolute; the flow is choked until $b\\,p_s = 0.3 \\times 7.013 = 2.10$ bar absolute.',
        'Isothermal: $t = V(p_2 - p_1)/(C p_s p_0) = 10^{-3}\\times(2.104 - 1.013)\\times10^5/(10^{-8} \\times 7.013\\times10^5 \\times 10^5) = 0.156$ s. Adiabatic: $0.156/1.4 = 0.111$ s.',
        'Time scale: $\\tau = V/(C p_0) = 10^{-3}/(10^{-8}\\times10^5) = 1$ s.',
        'The subsonic rest dominates: the simulation reaches 98 % after 1.10 s (isothermal), 0.79 s (adiabatic) and 0.85 s with realistic heat exchange.'
      ],
      a: 'Choked for only 0.16 s; about 1 s in all.'
    },
    {
      title: 'The pressure that sags',
      q: 'A small tank is filled very quickly from 1.013 to 7.013 bar absolute and the valve closed. The air ends at about 115 °C (adiabatic filling). What does the gauge read once the air has cooled to 20 °C?',
      steps: [
        'At constant volume and mass, $p \\propto T$ (absolute).',
        '$p = 7.013 \\times 293.15/388.0 = 5.30$ bar absolute.',
        'Gauge: $5.30 - 1.013 = 4.29$ bar.'
      ],
      a: 'About 4.3 bar gauge instead of 6.0. With heat exchange during the filling the sag is smaller — 4.5 bar in the simulation.'
    },
    {
      title: 'Blowing down a receiver',
      q: 'A 50 L receiver at 7 bar gauge is vented through a valve of $C = 5$ dm³/(s·bar), $b = 0.3$. How long does the choked phase last (isothermal)?',
      steps: [
        '$\\tau = V/(C p_0) = 0.05/(5\\times10^{-8} \\times 10^5) = 10$ s.',
        'Choked down to $p_\\text{atm}/b = 1.013/0.3 = 3.38$ bar absolute.',
        '$t = \\tau\\ln(p_1/p_2) = 10 \\ln(8.013/3.38) = 8.6$ s.'
      ],
      a: 'About 8.6 s, followed by a subsonic tail of several seconds more — which is why dump valves on large receivers are big.'
    }
  ],
  quiz: [
    { q: 'While a valve fills a closed volume with choked flow, the pressure in it rises…', choices: ['exponentially', 'linearly, at a constant rate', 'with the square root of time', 'only after the valve is fully open'], a: 1,
      why: 'Choked flow depends only on the upstream (supply) pressure, so mass arrives at a constant rate and dp/dt = n·C·p_s·p₀/V is constant.' },
    { q: 'What is the time constant V/(C·p₀) of a 5 L volume behind a valve of C = 2 dm³/(s·bar), in seconds?', answer: 2.5, unit: 's', tol: 0.02,
      why: '5×10⁻³ / (2×10⁻⁸ × 10⁵) = 2.5 s.' },
    { q: 'A vessel filled quickly to 6 bar gauge and then isolated will still read 6 bar an hour later if nothing leaks.', a: false,
      why: 'Fast filling heats the air. As it cools to room temperature at constant volume, its pressure falls in proportion to the absolute temperature — by more than a bar after a fully adiabatic filling.' },
    { q: 'For the same mass flow, adiabatic filling raises the pressure faster than isothermal filling because…', choices: ['the incoming air does work on the air inside, heating it', 'the valve opens wider when hot', 'the volume shrinks', 'choked flow is faster when adiabatic'], a: 0,
      why: 'Each kilogram brings c_p·T of enthalpy but holds only c_v·T of internal energy; the difference heats the gas, so dp/dt is γ = 1.4 times the isothermal rate.' },
    { q: 'Emptying 1 L through C = 1 dm³/(s·bar) while choked (isothermal), how long does it take the pressure to halve (s)?', answer: 0.693, unit: 's', tol: 0.03,
      why: 'Exponential decay with τ = V/(C·p₀) = 1 s: halving takes τ·ln 2 = 0.69 s.' }
  ],
  problems: [
    { q: 'A 10 L receiver is filled from 1.013 to 2.0 bar absolute through C = 2 dm³/(s·bar) from a 7.013 bar absolute supply. How long does it take (isothermal, choked)?', answer: 0.704, unit: 's', tol: 0.03,
      steps: ['$t = V(p_2 - p_1)/(C p_s p_0)$.', '$= 0.01 \\times 0.987\\times10^5/(2\\times10^{-8} \\times 7.013\\times10^5 \\times 10^5) = 0.70$ s.'] },
    { q: 'A 2 L chamber at 7.013 bar absolute blows down through C = 0.8 dm³/(s·bar) for 0.5 s (isothermal, choked). What absolute pressure is left?', answer: 5.74, unit: 'bar', tol: 0.03,
      steps: ['$\\tau = 2\\times10^{-3}/(0.8\\times10^{-8}\\times10^5) = 2.5$ s.', '$p = 7.013\\, e^{-0.5/2.5} = 7.013 \\times 0.819 = 5.74$ bar absolute — still above $p_\\text{atm}/b$, so the flow stayed choked.'] }
  ],
  applications: ['Estimating how long a receiver takes to charge or how fast a dump valve empties a machine.', 'Pressure-decay leak testing, where the settling time after filling is critical.', 'Vacuum cups and ejectors: evacuation time is an emptying problem.', 'Air brakes: how quickly a brake chamber fills sets the response of a truck or train.'],
  history: 'Describing a valve by a sonic conductance and a critical pressure ratio was proposed by F. E. Sanville in the early 1970s; it became ISO 6358 in 1989 and was revised as ISO 6358-1:2013. Its companion part allows C and b to be found from exactly the process on this page — blowing a tank down through the component and recording its pressure.',
  sim: 'dyn-fill-empty'
},

{
  id: 'pneumatic-spring', parent: 'cylinder-dynamics', title: 'Air as a spring: stiffness and natural frequency', level: 2,
  short: 'Trapped air is a soft spring: each chamber has a stiffness k = n·p·A²/V with absolute pressure. A load on a cylinder whose ports are closed bounces at a few hertz to a few tens of hertz — about a thousand times softer than oil — which is why cylinders bounce and why pneumatic positioning is hard.',
  keywords: ['air spring', 'pneumatic stiffness', 'natural frequency', 'trapped air', 'closed centre', 'bounce', 'oscillation', 'compressibility', 'bulk modulus of air', 'positioning', 'servo-pneumatics', 'air suspension'],
  prereq: ['pneumatic-cylinder', 'isothermal-adiabatic', 'physics:simple-harmonic-motion', 'physics:hookes-law'],
  related: ['servo-pneumatics', 'stick-slip', 'cylinder-motion', 'bellows-muscles', 'tyres-air-springs', 'hydraulics:hydraulic-stiffness', 'physics:mass-spring-system', 'physics:damped-oscillations'],
  body: `
Block both ports of a cylinder — a 5/3 closed-centre valve does exactly that — and push on the rod. It gives: the air on one side is squeezed, the air on the other side expands, and the pressure difference pushes back in proportion to the movement. Trapped air is a spring, and a soft one.

### The stiffness of a column of air
Push a piston of area $A$ into a trapped volume $V$ by $\\Delta x$. The volume shrinks by $A\\,\\Delta x$, and for a polytropic change ($pV^n$ constant) the pressure rises by $\\Delta p = n\\,p\\,A\\,\\Delta x/V$. The force rises by $A\\,\\Delta p$, so

$$k = \\frac{n\\,p\\,A^2}{V}$$

with $p$ the **absolute** pressure — air at 0 bar gauge still resists — and $n = 1.4$ for quick movements (vibration, bouncing) or 1 for slow ones where the air keeps its temperature. The product $n\\,p$ plays the part of the bulk modulus: about 1 MPa for air at 6 bar gauge, against 1.4 GPa for hydraulic oil ([[hydraulics:hydraulic-stiffness]]). Air is roughly a thousand times softer.

### A cylinder with both ports closed
The two chambers act as springs in parallel:

$$k = n\\left(\\frac{p_A A_1^2}{V_1} + \\frac{p_B A_2^2}{V_2}\\right)$$

where $V_1$ and $V_2$ include the dead volumes of the end caps and tubes up to the valve. A load of mass $m$ on that spring oscillates at

$$f = \\frac{1}{2\\pi}\\sqrt{\\frac{k}{m}}$$

For a 32 mm cylinder (12 mm rod, 200 mm stroke) stopped with both chambers at 6 bar gauge:

| Stopping position | Stiffness | $f$ with 2 kg | $f$ with 20 kg |
|---|---|---|---|
| 10 % of stroke | 27.7 N/mm | 18.7 Hz | 5.9 Hz |
| 50 % | 13.6 N/mm | 13.1 Hz | 4.2 Hz |
| 90 % | 33.2 N/mm | 20.5 Hz | 6.5 Hz |

The cylinder is softest near mid-stroke and stiffens towards the ends, where one chamber becomes tiny. For equal areas at mid-stroke with no dead volume the formula reduces to $k = 4\\,n\\,p\\,A/s$. At 2 bar gauge instead of 6 the stiffness drops by the ratio of absolute pressures, and the 2 kg load rings at 8.6 Hz.

### Why cylinders bounce
When a closed-centre valve stops a cylinder whose chambers are both at supply pressure, the piston area is larger than the annulus, so the forces do not balance: in the example 68 N push outwards and the load lurches about 5 mm before the air on the rod side has been squeezed enough to hold it. It then rings about the new balance, damped only by seal friction — air has almost no damping of its own. A heavy load arriving at an end cushion, or a load that is suddenly pushed, does the same.

### Why positioning with air is hard
Push a stopped 32 mm cylinder with 50 N and it gives about 3.7 mm; a machining force that varies makes it vibrate. A position controller cannot correct faster than a fraction of the natural frequency, so a heavy load on a pneumatic axis can only be positioned slowly and with modest stiffness — the domain of [[servo-pneumatics]], with proportional valves, pressure feedback and friction compensation. Where a load must stop anywhere and stay put against a force, a mechanical brake, an oil damper or an electric axis is usually the better answer.

### Springs of air on purpose
The same softness is welcome elsewhere: air suspension on buses, lorries and trains gives a low natural frequency (around 1 Hz) and a ride height held constant by adding or venting air; air-spring isolators carry machines and optical tables ([[tyres-air-springs]], [[bellows-muscles]]).

> [!warn] Air trapped behind closed valves is not a lock. The load can bounce when the valve closes, sink as air leaks past seals, and move without warning when a valve is operated. Never work under or between parts held only by air: support them mechanically.
`,
  ideas: [
    'Trapped air is a spring of stiffness k = n·p·A²/V, with absolute pressure p.',
    'Air\'s effective bulk modulus n·p is about 1 MPa at 6 bar gauge — roughly a thousand times softer than oil.',
    'A stopped double-acting cylinder is two springs in parallel; it is softest near mid-stroke and stiff near the ends.',
    'A load on the air springs oscillates at f = √(k/m)/2π: a few hertz to a few tens of hertz, with little damping.',
    'Stiffness grows with pressure and area and falls with volume: dead volumes and long tubes make the spring softer.'
  ],
  pitfalls: [
    'A cylinder with both ports closed holds its load rigidly — It holds it on a soft spring: the load gives several millimetres under a moderate force, bounces when stopped and creeps as air leaks.',
    'The stiffness depends on gauge pressure — It depends on absolute pressure; at 0 bar gauge the trapped air still has a stiffness proportional to 1 bar.',
    'A bigger valve makes a pneumatic axis stiffer — The valve adds flow, not stiffness; with the valve closed only the trapped air holds the load.'
  ],
  formulas: [
    {
      name: 'Stiffness of one chamber of trapped air',
      expr: 'k = n*p*A^2/V', tex: 'k = \\dfrac{n\\,p\\,A^2}{V}',
      vars: {
        k: { name: 'stiffness', q: 'stiffness', unit: 'N/mm' },
        n: { name: 'polytropic exponent (1.4 fast, 1 slow)', value: 1.4 },
        p: { name: 'pressure in the chamber (absolute)', q: 'pressure', unit: 'bar', value: 7.013 },
        A: { name: 'piston area (or annulus)', q: 'area', unit: 'cm²', value: 8.04 },
        V: { name: 'trapped volume, dead volume included', q: 'volume', unit: 'cm³', value: 85 }
      },
      note: 'Small movements about the present position. Absolute pressure.',
      practice: { unknowns: ['k', 'V'] },
      stories: { k: 'Air at {p} is trapped in {V} behind a piston of {A}. How stiff is it for quick movements (n = {n})?' }
    },
    {
      name: 'Stiffness of a cylinder with both ports closed',
      expr: 'k = n*(pA*A1^2/V1 + pB*A2^2/V2)', tex: 'k = n\\left(\\dfrac{p_A A_1^2}{V_1} + \\dfrac{p_B A_2^2}{V_2}\\right)',
      vars: {
        k: { name: 'total stiffness', q: 'stiffness', unit: 'N/mm' },
        n: { name: 'polytropic exponent (1.4 fast, 1 slow)', value: 1.4 },
        pA: { name: 'cap-end pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.013, tex: 'p_A' },
        A1: { name: 'piston area', q: 'area', unit: 'cm²', value: 8.04, tex: 'A_1' },
        V1: { name: 'cap-end volume', q: 'volume', unit: 'cm³', value: 85.4, tex: 'V_1' },
        pB: { name: 'rod-end pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.013, tex: 'p_B' },
        A2: { name: 'annulus area', q: 'area', unit: 'cm²', value: 6.91, tex: 'A_2' },
        V2: { name: 'rod-end volume', q: 'volume', unit: 'cm³', value: 74.1, tex: 'V_2' }
      },
      note: 'The two chambers are springs in parallel. The defaults: a 32 mm cylinder at mid-stroke of 200 mm with 5 cm³ of dead volume each side.',
      practice: { unknowns: ['k'] },
      stories: { k: 'A cylinder is stopped with {pA} on a piston of {A1} ({V1} of air) and {pB} on an annulus of {A2} ({V2}). How stiff is it for quick movements?' }
    },
    {
      name: 'Natural frequency of a load on the air',
      expr: 'f = sqrt(k/m)/(2*pi)', tex: 'f = \\dfrac{1}{2\\pi}\\sqrt{\\dfrac{k}{m}}',
      vars: {
        f: { name: 'natural frequency', q: 'frequency', unit: 'Hz' },
        k: { name: 'stiffness of the trapped air', q: 'stiffness', unit: 'N/mm', value: 13.6 },
        m: { name: 'moving mass', q: 'mass', unit: 'kg', value: 2 }
      },
      stories: { f: 'A load of {m} sits on air springs of total stiffness {k}. At what frequency does it bounce?', m: 'Air springs of {k} must give a natural frequency of {f}. What mass do they carry?' }
    },
    {
      name: 'Mid-stroke estimate (equal areas, no dead volume)',
      expr: 'k = 4*n*p*A/s', tex: 'k = \\dfrac{4\\,n\\,p\\,A}{s}',
      vars: {
        k: { name: 'stiffness', q: 'stiffness', unit: 'N/mm' },
        n: { name: 'polytropic exponent (1.4 fast, 1 slow)', value: 1.4 },
        p: { name: 'pressure in both chambers (absolute)', q: 'pressure', unit: 'bar', value: 7.013 },
        A: { name: 'piston area', q: 'area', unit: 'cm²', value: 8.04 },
        s: { name: 'stroke', q: 'length', unit: 'mm', value: 200 }
      },
      note: 'Each chamber holds A·s/2 at mid-stroke. An upper bound: dead volumes and the rod make the real cylinder softer.',
      stories: { k: 'Roughly how stiff is a cylinder with a piston of {A} and a stroke of {s}, stopped at mid-stroke with {p} in both chambers?' }
    }
  ],
  examples: [
    {
      title: 'How stiff is a stopped cylinder?',
      q: 'A 32 mm cylinder (12 mm rod, 200 mm stroke) is stopped at mid-stroke with both chambers at 6 bar gauge; each side has 5 cm³ of dead volume. How stiff is it, and how far does a 50 N push move it?',
      steps: [
        '$A_1 = 8.04$ cm², $V_1 = 8.04 \\times 10 + 5 = 85.4$ cm³; $A_2 = 6.91$ cm², $V_2 = 6.91 \\times 10 + 5 = 74.1$ cm³; $p = 7.013$ bar absolute.',
        '$k_A = 1.4 \\times 7.013\\times10^5 \\times (8.04\\times10^{-4})^2/8.54\\times10^{-5} = 7430$ N/m.',
        '$k_B = 1.4 \\times 7.013\\times10^5 \\times (6.91\\times10^{-4})^2/7.41\\times10^{-5} = 6330$ N/m.',
        '$k = 13.8$ N/mm; a 50 N push moves it $50/13.8 = 3.6$ mm.'
      ],
      a: 'About 13.8 N/mm; 50 N moves the rod by some 3.6 mm.'
    },
    {
      title: 'Air against oil',
      q: 'Compare the "bulk modulus" of air at 6 bar gauge, compressed quickly, with that of hydraulic oil (1.4 GPa).',
      steps: [
        'For air, $n\\,p = 1.4 \\times 7.013\\times10^5 = 0.98$ MPa.',
        'Ratio: $1.4\\times10^9/0.98\\times10^6 \\approx 1400$.',
        'For the same area and column length, an oil column is about 1400 times stiffer, and its natural frequency $\\sqrt{1400} \\approx 37$ times higher.'
      ],
      a: 'Air is about 1400 times softer than oil — a 13 Hz pneumatic axis would be a 500 Hz hydraulic one.'
    }
  ],
  quiz: [
    { q: 'The effective bulk modulus of air at 6 bar gauge, compressed quickly, is about…', choices: ['0.6 MPa', '1 MPa', '1.5 GPa', '6 bar'], a: 1,
      why: 'n·p = 1.4 × 0.70 MPa (absolute) ≈ 1 MPa. Oil is about 1.4 GPa.' },
    { q: 'A cylinder stopped with both ports closed holds its load rigidly.', a: false,
      why: 'The trapped air is a soft spring: the load gives under force, bounces at a few hertz when disturbed and creeps if seals leak.' },
    { q: 'Air at 7 bar absolute fills 200 cm³ behind a 20 cm² piston. How stiff is it for quick movements (N/mm)?', answer: 19.6, unit: 'N/mm', tol: 0.03,
      why: 'k = 1.4 × 7×10⁵ × (2×10⁻³)² / 2×10⁻⁴ = 19 600 N/m = 19.6 N/mm.' },
    { q: 'Doubling the mass on an air spring changes its natural frequency by a factor of…', choices: ['2', '1/√2', '1/2', '1 (no change)'], a: 1,
      why: 'f ∝ √(k/m): twice the mass gives a frequency 1/√2 ≈ 0.71 times as high.' },
    { q: 'Where along its stroke is a stopped double-acting cylinder softest?', choices: ['at the cap end', 'near mid-stroke', 'at the rod end', 'the same everywhere'], a: 1,
      why: 'Near either end one chamber is tiny and very stiff; around mid-stroke both columns are long, so the sum of A²/V terms is smallest there.' }
  ],
  problems: [
    { q: 'A 50 mm cylinder with a 300 mm stroke is stopped at mid-stroke with 7.013 bar absolute on both sides. Using the equal-area estimate, what is the natural frequency with a 10 kg load?', answer: 8.07, unit: 'Hz', tol: 0.03,
      steps: ['$A = 19.63$ cm².', '$k = 4 \\times 1.4 \\times 7.013\\times10^5 \\times 1.963\\times10^{-3}/0.3 = 25\\,700$ N/m.', '$f = \\sqrt{25\\,700/10}/(2\\pi) = 8.1$ Hz.'] }
  ],
  applications: ['Air suspension on buses, lorries, trains and car seats: a low natural frequency and adjustable ride height.', 'Vibration isolation of machines, measuring equipment and optical tables on air springs.', 'Judging whether a pneumatic axis can hold a position against a varying force, or needs a brake or an electric drive.', 'Explaining why a cylinder stopped by a closed-centre valve lurches and rings.'],
  history: 'Air springs were patented for vehicles early in the twentieth century; rubber-bellows air suspension spread on buses and heavy lorries from the 1950s, and today almost every coach and many trains ride on it. Servo-pneumatic positioning, which must fight the same softness, became practical in the 1980s with fast proportional valves and microprocessor control.',
  sim: 'dyn-air-spring'
},

{
  id: 'chamber-temperature', parent: 'cylinder-dynamics', title: 'Heating and cooling in a cylinder', level: 3,
  short: 'Air heats when it is squeezed and cools when it expands. A chamber filled quickly gets hot, an exhausting chamber gets cold — often well below 0 °C — so the exhaust air can freeze its own moisture in silencers; afterwards the walls bring everything back towards room temperature.',
  keywords: ['temperature', 'adiabatic compression', 'adiabatic expansion', 'exhaust temperature', 'icing', 'frost', 'silencer', 'dew point', 'heat of compression', 'cushion temperature', 'Clément–Desormes', 'isentropic', 'heat transfer'],
  prereq: ['isothermal-adiabatic', 'filling-emptying', 'pressure-dew-point', 'physics:first-law-thermodynamics'],
  related: ['noise-silencers', 'refrigerated-dryers', 'desiccant-dryers', 'cylinder-motion', 'pneumatic-cushioning', 'energy-in-compressed-air', 'aerodynamics:isentropic-flow', 'aerodynamics:stagnation-properties', 'physics:thermodynamic-processes'],
  body: `
A cylinder stroke lasts a fraction of a second — far too short for the air to exchange much heat with the metal around it. So the air in the chambers follows the adiabatic laws ([[isothermal-adiabatic]]), and its temperature swings by tens of kelvin every stroke.

### Expansion chills, compression heats
Air that expands without taking in heat cools, and air that is compressed heats:

$$T_2 = T_1\\left(\\frac{p_2}{p_1}\\right)^{(n-1)/n}$$

with absolute temperatures and pressures, $n = 1.4$ in the adiabatic limit and about 1.2–1.3 in practice. Air at 7 bar absolute and 20 °C left to expand to 1 bar would reach **−105 °C**. The air trapped in an end cushion and squeezed from 5 to 15 bar absolute reaches 128 °C for an instant.

### The exhausting chamber
When a chamber vents, the air that remains inside has expanded — it has pushed the departing air out — and has cooled. The air leaving carries the chamber's temperature at that moment, and in the sonic jet at the valve its static temperature is lower still, $2/(\\gamma+1) = 0.83$ times the absolute value. Heat from the barrel and especially from the long wall of the tube warms it again. The simulation of a 32 mm cylinder cycling at 6 bar gives:

| Heat exchange | Exhausting chamber, lowest | Filling chamber, highest |
|---|---|---|
| None (adiabatic) | −97 °C | 71 °C |
| Typical barrel and tubes | −18 °C | 60 °C |
| Three times typical | 4 °C | 38 °C |

### The filling chamber
Air arriving at 20 °C should not make a chamber hotter than 20 °C — but it does, because the incoming air pushes on and compresses the air already there ([[filling-emptying]]). For a closed volume filled adiabatically from $p_i$ to $p_f$ the final temperature is

$$T_f = \\frac{p_f}{\\dfrac{p_f - p_i}{\\gamma T_s} + \\dfrac{p_i}{T_i}}$$

— 115 °C from 1 to 7 bar absolute, and $\\gamma T_s = 137$ °C when filling from vacuum. Once the valve closes, the air cools at constant volume and the pressure falls in proportion, $p_2 = p_1 T_2/T_1$.

### Water and ice
Compressed air carries water vapour ([[pressure-dew-point]]). Expanded to atmospheric pressure its vapour is spread over seven times the volume, so its dew point falls: air dried to a pressure dew point of +3 °C in a [[refrigerated-dryers|refrigerated dryer]] has a dew point of about −22 °C once it is back at 1 atm; undried air leaving an aftercooler at +25 °C, about −4 °C. If the exhaust air is colder than that, its water condenses and freezes — in the silencer, around the exhaust port, sometimes on the valve spool. Iced silencers raise the back pressure, slow the cylinders and can make valves stick. The cures: drier air ([[desiccant-dryers]] give −40 °C and lower), larger or heated silencers, exhausts piped away, lower cycle rates, and no oil mist to glue the ice together.

> [!history] In 1819 Nicolas Clément and Charles Désormes let a little air escape from a large flask, closed it again and watched the pressure creep back up as the chilled air warmed. The two pressure readings gave the ratio of the specific heats of air — the γ in every formula on this page.

> [!warn] Exhaust air is cold as well as loud, and it carries oil mist and dust. Never direct an exhaust or silencer at people; wear hearing protection near unsilenced exhausts, and keep frosted metal parts away from bare skin.
`,
  ideas: [
    'In a fast stroke the air in each chamber follows the adiabatic law: expansion cools it, compression heats it.',
    'Adiabatic expansion from 7 to 1 bar absolute would take air from 20 °C to about −105 °C; walls and tubes limit the real drop to tens of kelvin.',
    'Filling a chamber heats its air above the supply temperature, because the incoming air compresses what is already there.',
    'Expanded air has a much lower dew point, but the exhaust can be colder still: then water freezes in silencers.',
    'After filling, the air cools at constant volume and the pressure sags in proportion to absolute temperature.'
  ],
  pitfalls: [
    'Air arriving at 20 °C cannot heat a chamber above 20 °C — The incoming air does work on the air already inside; a fast filling from 1 to 7 bar absolute can reach over 100 °C.',
    'Dried air cannot freeze — Refrigerated-dried air at +3 °C pressure dew point still carries water; expanded and chilled to −30 °C in an exhaust it can form ice.',
    'The exhaust temperature is the room temperature because the air came from the room — The air left in an exhausting chamber has expanded adiabatically; it leaves at the chamber\'s temperature, often far below 0 °C.'
  ],
  formulas: [
    {
      name: 'Temperature after a fast (adiabatic) change of pressure',
      expr: 'T2 = T1*(p2/p1)^((n - 1)/n)', tex: 'T_2 = T_1\\left(\\dfrac{p_2}{p_1}\\right)^{(n-1)/n}',
      vars: {
        T2: { name: 'temperature afterwards', q: 'temperature', unit: '°C', tex: 'T_2' },
        T1: { name: 'temperature before', q: 'temperature', unit: '°C', value: 20, tex: 'T_1' },
        p2: { name: 'pressure afterwards (absolute)', q: 'pressure', unit: 'bar', value: 1.013, tex: 'p_2' },
        p1: { name: 'pressure before (absolute)', q: 'pressure', unit: 'bar', value: 7.013, tex: 'p_1' },
        n: { name: 'polytropic exponent (1.4 adiabatic, 1.2–1.3 real)', value: 1.4 }
      },
      note: 'Air that stays in the volume and exchanges no heat. The calculator works in kelvin; temperatures may be entered in °C.',
      practice: { unknowns: ['T2', 'p2'] },
      stories: { T2: 'Air at {T1} and {p1} expands quickly to {p2} (n = {n}). How cold does it get?', p2: 'Air at {T1} and {p1} is compressed quickly (n = {n}) until it reaches {T2}. To what pressure?' }
    },
    {
      name: 'Temperature after filling a closed volume quickly',
      expr: 'Tf = pf/((pf - pini)/(gamma*Ts) + pini/Ti)', tex: 'T_f = \\dfrac{p_f}{\\dfrac{p_f - p_i}{\\gamma T_s} + \\dfrac{p_i}{T_i}}',
      vars: {
        Tf: { name: 'temperature at the end of filling', q: 'temperature', unit: '°C', tex: 'T_f' },
        pf: { name: 'final pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.013, tex: 'p_f' },
        pini: { name: 'initial pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.013, tex: 'p_i' },
        gamma: { name: 'ratio of specific heats of air', value: 1.4, fixed: true, tex: '\\gamma' },
        Ts: { name: 'temperature of the supply air', q: 'temperature', unit: '°C', value: 20, tex: 'T_s' },
        Ti: { name: 'initial temperature in the volume', q: 'temperature', unit: '°C', value: 20, tex: 'T_i' }
      },
      note: 'Energy balance with no heat exchange: each kilogram brings c_p·T_s and holds c_v·T. Filling from vacuum (p_i = 0) gives γ·T_s.',
      practice: { unknowns: ['Tf'] },
      stories: { Tf: 'A closed volume at {pini} and {Ti} is filled very quickly to {pf} with supply air at {Ts}. How hot is the air at the end?' }
    },
    {
      name: 'Pressure change as trapped air cools',
      expr: 'p2 = p1*T2/T1', tex: 'p_2 = p_1\\,\\dfrac{T_2}{T_1}',
      vars: {
        p2: { name: 'pressure after cooling (absolute)', q: 'pressure', unit: 'bar', tex: 'p_2' },
        p1: { name: 'pressure when the valve closed (absolute)', q: 'pressure', unit: 'bar', value: 7.013, tex: 'p_1' },
        T2: { name: 'temperature after cooling', q: 'temperature', unit: '°C', value: 20, tex: 'T_2' },
        T1: { name: 'temperature when the valve closed', q: 'temperature', unit: '°C', value: 114.8, tex: 'T_1' }
      },
      note: 'Constant volume and mass (Gay-Lussac\'s law); absolute pressures, and the temperatures are converted to kelvin.',
      stories: { p2: 'A volume filled quickly to {p1} holds air at {T1} when the valve closes. What pressure is left when it has cooled to {T2}?' }
    }
  ],
  examples: [
    {
      title: 'How cold can the exhaust get?',
      q: 'A chamber at 7.013 bar absolute and 20 °C blows down to atmospheric pressure. What is the adiabatic limit of its temperature, and what does the simulation with realistic heat exchange give?',
      steps: [
        '$T_2 = 293.15 \\times (1.013/7.013)^{0.286} = 293.15 \\times 0.575 = 168.5$ K = −105 °C.',
        'In the sonic jet the static temperature is $0.83$ times the absolute temperature in the chamber.',
        'With heat from the barrel and tubes the simulated chamber bottoms out near −18 °C (−61 °C for an instant in the jet).'
      ],
      a: 'At most −105 °C; in practice tens of kelvin below room temperature — enough to freeze water.'
    },
    {
      title: 'Will the silencer ice up?',
      q: 'Air dried to a pressure dew point of +3 °C at 7.013 bar absolute is exhausted to 1.013 bar. Its exhaust reaches −25 °C. Will ice form?',
      steps: [
        'Saturation vapour pressure at +3 °C: about 758 Pa.',
        'After expansion the vapour pressure falls in proportion to the total pressure: $758 \\times 1.013/7.013 = 109$ Pa.',
        'The temperature whose saturation pressure is 109 Pa is about −22 °C: the dew (frost) point of the exhaust air.',
        '−25 °C is below −22 °C, so moisture freezes out.'
      ],
      a: 'Yes, marginally. With desiccant-dried air (−40 °C pressure dew point, about −57 °C expanded) it would not.'
    },
    {
      title: 'The heat of filling',
      q: 'A closed volume at 1.013 bar absolute and 20 °C is filled very quickly to 7.013 bar absolute with 20 °C air. How hot does it get, and what pressure remains after cooling?',
      steps: [
        '$\\dfrac{p_f - p_i}{\\gamma T_s} = \\dfrac{6.0}{1.4 \\times 293.15} = 0.01462$; $\\dfrac{p_i}{T_i} = \\dfrac{1.013}{293.15} = 0.00346$ (bar/K).',
        '$T_f = 7.013/(0.01462 + 0.00346) = 388$ K = 115 °C.',
        'After cooling to 20 °C: $p_2 = 7.013 \\times 293.15/388 = 5.30$ bar absolute = 4.29 bar gauge.'
      ],
      a: '115 °C, and the gauge sags from 6.0 to 4.3 bar as the air cools.'
    }
  ],
  quiz: [
    { q: 'Air at 20 °C and 7 bar absolute expands quickly to 1 bar absolute. Its temperature becomes about…', choices: ['20 °C', '−20 °C', '−105 °C', '−273 °C'], a: 2,
      why: 'T₂ = 293 × (1/7)^0.286 ≈ 168 K ≈ −105 °C in the adiabatic limit.' },
    { q: 'Air arriving at 20 °C cannot make a chamber hotter than 20 °C.', a: false,
      why: 'The incoming air does flow work on the air already inside. A fast filling from 1 to 7 bar absolute can reach about 115 °C.' },
    { q: 'Why do silencers ice up on fast-cycling machines with poorly dried air?', choices: ['Oil freezes at room temperature', 'The exhaust air is cooled by expansion below its own dew point, so its water freezes', 'Silencers are made of cold materials', 'Air from the compressor is below 0 °C'], a: 1,
      why: 'Expansion chills the air far below 0 °C; if that is below the dew point of the expanded air, its vapour condenses and freezes.' },
    { q: 'Air trapped in an end cushion is compressed quickly from 5 to 15 bar absolute, starting at 20 °C. What temperature does it reach (°C)?', answer: 128, unit: '°C', tol: 0.03,
      why: 'T₂ = 293.15 × 3^0.286 = 401 K ≈ 128 °C (n = 1.4).' },
    { q: 'After a quick fill to 6 bar gauge, a closed vessel is left alone. Its gauge will…', choices: ['stay at 6 bar', 'fall as the air cools', 'rise as the air settles', 'oscillate'], a: 1,
      why: 'The air was heated by the filling; at constant volume its pressure falls in proportion to the absolute temperature as it cools.' }
  ],
  problems: [
    { q: 'Air at 20 °C and 7.013 bar absolute expands adiabatically (n = 1.4) to 3.0 bar absolute. What is its temperature?', answer: -43.1, unit: '°C', tol: 0.03,
      steps: ['$T_2 = 293.15 \\times (3.0/7.013)^{0.2857}$.', '$= 293.15 \\times 0.7846 = 230.0$ K = −43.1 °C.'] }
  ],
  applications: ['Preventing ice in silencers and valve exhausts on fast machines and in cold rooms.', 'Choosing a dryer: the dew point needed so that exhaust air never freezes.', 'Pressure-decay leak testing, where the air must settle thermally before measuring.', 'Understanding why cushion seals and end caps run warm on fast cylinders.'],
  sim: 'dyn-chamber-temp'
},

{
  id: 'kinetic-energy-limits', parent: 'cylinder-dynamics', title: 'Kinetic energy and end-stop limits', level: 2,
  short: 'A moving load arrives at the end of the stroke with kinetic energy ½mv². Elastic bumpers take a fraction of a joule, adjustable air cushions a few joules, hydraulic shock absorbers far more — and the cylinder keeps pushing while they work. Check it with the impact speed, not the average speed.',
  keywords: ['kinetic energy', 'impact energy', 'end stop', 'cushioning', 'elastic bumper', 'shock absorber', 'effective mass', 'impact speed', 'allowable energy', 'deceleration', 'end cap damage'],
  prereq: ['pneumatic-cushioning', 'cylinder-motion', 'physics:kinetic-energy'],
  related: ['sizing-procedure', 'pneumatic-spring', 'chamber-temperature', 'rodless-guided', 'pick-and-place', 'physics:work-energy-theorem', 'physics:impulse', 'hydraulics:cushioning'],
  body: `
Whatever moves with the piston — rod, piston, tooling, gripper, payload — arrives at the end of the stroke with kinetic energy

$$E = \\tfrac12 m v^2$$

and something must absorb it in the last few millimetres. Pneumatic cylinders are fast and their loads often light, but the energy grows with the *square* of the speed: 5 kg at 1 m/s carries 2.5 J, at 0.5 m/s only 0.63 J. Exceeding what the end stop can take does not usually break things at once; it loosens pistons, cracks end caps and bends rods over a few hundred thousand strokes, and it makes a hammering noise long before.

### Impact speed, not average speed
A stroke of 200 mm in 0.5 s averages 0.4 m/s, but the dead time and the acceleration eat part of that time, so the piston must run faster the rest of the way. In the stroke simulation it enters the cushion at 0.55 m/s — 1.4 times the average. Speeds at the end of 1.2–2 times the average are common; use the real one, measured or simulated, for the energy check.

### What the end of the cylinder can take
| Bore | Elastic bumpers | Adjustable air cushion | Mass at 0.5 m/s with air cushion |
|---|---|---|---|
| 16 mm | ≈ 0.07 J | ≈ 0.15 J | 1.2 kg |
| 25 mm | ≈ 0.15 J | ≈ 0.4 J | 3 kg |
| 32 mm | ≈ 0.3 J | ≈ 1 J | 8 kg |
| 50 mm | ≈ 0.6 J | ≈ 3 J | 24 kg |
| 63 mm | ≈ 0.8 J | ≈ 5 J | 40 kg |
| 100 mm | ≈ 1.6 J | ≈ 16 J | 130 kg |

These are typical orders of magnitude; each maker publishes its own limits, usually as a diagram of mass against speed, and those rule. An **air cushion** ([[pneumatic-cushioning]]) closes the main exhaust bore over the last 15–40 mm and lets the trapped air out through a needle; the trapped air is squeezed, heats and pushes back. Set too tight, it stops the piston short and lets it creep the rest of the way — the stroke gets slower and may even bounce back; too open, and the piston hits the cap.

### Shock absorbers
For more energy, an external hydraulic shock absorber takes the hit. It must absorb not only the kinetic energy but also the work of the drive force over its own stroke $s$, because the cylinder keeps pushing:

$$W = \\tfrac12 m v^2 + F s$$

$F$ is the cylinder force plus any weight component. A 50 mm cylinder (1.18 kN at 6 bar) moving 30 kg at 0.8 m/s into a 25 mm absorber: 9.6 J of kinetic energy but 29.5 J of drive work — 39 J in all. A good absorber brakes almost evenly, so the peak force is about $W/(\\eta\\,s)$ with $\\eta \\approx 0.8$–0.9: here 1.8 kN. Catalogues also quote an *effective mass* $m_e = 2W/v^2$ (122 kg here) and a limit per hour, because the energy ends as heat.

### Lowering the energy
Slow the end of the stroke (meter-out, a smaller exhaust path in the last part, end-position cushioning valves), lower the moving mass, reduce the pressure for the return stroke, or let a bigger cylinder's cushions do the work. For light, fast loads the energy check, not the force, often decides the bore ([[sizing-procedure]]).

> [!warn] A cylinder that bangs into its end stop is a failure waiting to happen: parts fly when a rod thread or tooling breaks. Keep guards in place, check the cushioning after any change of load, speed or pressure, and never test a new setting with hands near the moving parts.
`,
  ideas: [
    'The end stop must absorb E = ½mv² of everything that moves with the piston.',
    'Energy grows with the square of speed: halving the impact speed quarters the energy.',
    'Use the impact speed, which is often 1.2–2 times the average stroke speed.',
    'A shock absorber must take the drive work F·s as well as the kinetic energy.',
    'For light, fast loads, cushioning capacity often decides the bore.'
  ],
  pitfalls: [
    'The average speed is good enough for the energy check — The piston runs faster than average to make up for dead time and acceleration; at 1.5 times the average the energy is 2.25 times higher.',
    'A shock absorber only absorbs ½mv² — The cylinder keeps pushing throughout the absorber\'s stroke; with light loads the drive work F·s can be several times the kinetic energy.',
    'Closing the cushion needle further always makes a gentler stop — Too tight a cushion stops the piston short, makes it creep or bounce back, and lengthens the stroke time.'
  ],
  formulas: [
    {
      name: 'Kinetic energy at the end stop',
      expr: 'E = m*v^2/2', tex: 'E = \\tfrac12 m v^2',
      vars: {
        E: { name: 'kinetic energy', q: 'energy', unit: 'J' },
        m: { name: 'moving mass (piston, rod, tooling, payload)', q: 'mass', unit: 'kg', value: 4 },
        v: { name: 'speed at the start of cushioning or impact', q: 'speed', unit: 'm/s', value: 0.6 }
      },
      practice: { unknowns: ['E', 'v', 'm'] },
      stories: { E: 'A slide of {m} reaches the end cushion at {v}. How much energy must the cushion absorb?', v: 'A cylinder\'s cushion may absorb {E}. What is the highest speed for a moving mass of {m}?', m: 'The cushion takes {E} at an impact speed of {v}. What is the largest moving mass?' }
    },
    {
      name: 'Energy per stroke for a shock absorber',
      expr: 'W = m*v^2/2 + F*s', tex: 'W = \\tfrac12 m v^2 + F\\,s',
      vars: {
        W: { name: 'energy per stroke', q: 'energy', unit: 'J' },
        m: { name: 'moving mass', q: 'mass', unit: 'kg', value: 30 },
        v: { name: 'impact speed', q: 'speed', unit: 'm/s', value: 0.8 },
        F: { name: 'drive force (cylinder force plus weight component)', q: 'force', unit: 'N', value: 1178 },
        s: { name: 'stroke of the shock absorber', q: 'length', unit: 'mm', value: 25 }
      },
      note: 'Compare with the absorber\'s energy per stroke; multiply by strokes per hour for its heat limit.',
      practice: { unknowns: ['W', 'v'] },
      stories: { W: 'A load of {m} hits a shock absorber at {v} while the cylinder pushes with {F}. The absorber\'s stroke is {s}. How much energy does it absorb per stroke?' }
    },
    {
      name: 'Peak stopping force',
      expr: 'Fm = W/(eta*s)', tex: 'F_m = \\dfrac{W}{\\eta\\,s}',
      vars: {
        Fm: { name: 'peak stopping force', q: 'force', unit: 'N', tex: 'F_m' },
        W: { name: 'energy per stroke', q: 'energy', unit: 'J', value: 39.1 },
        eta: { name: 'efficiency of the absorber (evenness of braking)', q: 'ratio', unit: '%', value: 85, tex: '\\eta' },
        s: { name: 'stroke of the shock absorber', q: 'length', unit: 'mm', value: 25 }
      },
      note: 'η = 100 % would be perfectly even braking; good adjustable absorbers reach 80–90 %, rubber bumpers far less.',
      stories: { Fm: 'A shock absorber with a stroke of {s} and an efficiency of {eta} absorbs {W} per stroke. What is the peak force on the frame?' }
    },
    {
      name: 'Effective mass',
      expr: 'me = 2*W/v^2', tex: 'm_e = \\dfrac{2W}{v^2}',
      vars: {
        me: { name: 'effective mass', q: 'mass', unit: 'kg', tex: 'm_e' },
        W: { name: 'energy per stroke', q: 'energy', unit: 'J', value: 39.1 },
        v: { name: 'impact speed', q: 'speed', unit: 'm/s', value: 0.8 }
      },
      note: 'The mass that, moving at v, would carry the whole energy W — the number shock-absorber diagrams are read with.',
      stories: { me: 'A shock absorber takes {W} per stroke at an impact speed of {v}. What effective mass is that?' }
    }
  ],
  examples: [
    {
      title: 'Is the air cushion enough?',
      q: 'A 32 mm cylinder moves 4 kg; the piston enters the cushion at 0.6 m/s. Compare with typical limits of about 0.3 J (elastic bumpers) and 1 J (adjustable air cushion).',
      steps: ['$E = \\tfrac12 \\times 4 \\times 0.6^2 = 0.72$ J.', 'Too much for elastic bumpers (0.3 J); within the air cushion\'s 1 J, with some margin.', 'At 0.8 m/s it would be 1.28 J — too much.'],
      a: '0.72 J: an adjustable air cushion is needed, and the speed must not grow.'
    },
    {
      title: 'Choosing a shock absorber',
      q: 'A 50 mm cylinder pushing 1178 N moves 30 kg horizontally into a shock absorber at 0.8 m/s. The absorber\'s stroke is 25 mm and its efficiency 85 %. Find the energy per stroke, the effective mass and the peak force.',
      steps: [
        'Kinetic: $\\tfrac12 \\times 30 \\times 0.8^2 = 9.6$ J. Drive: $1178 \\times 0.025 = 29.5$ J. Total $W = 39.1$ J.',
        'Effective mass: $m_e = 2 \\times 39.1/0.8^2 = 122$ kg.',
        'Peak force: $39.1/(0.85 \\times 0.025) = 1840$ N.',
        'At 10 cycles a minute the absorber turns $39.1 \\times 600 = 23$ kJ an hour into heat.'
      ],
      a: '39 J per stroke (three quarters of it from the drive), an effective mass of 122 kg and about 1.8 kN on the frame.'
    },
    {
      title: 'Average speed is not impact speed',
      q: 'An 8 kg load moves 300 mm in 0.5 s. What energy does the average speed suggest, and what if the impact speed is 1.5 times the average?',
      steps: ['Average: $0.3/0.5 = 0.6$ m/s → $E = \\tfrac12 \\times 8 \\times 0.36 = 1.44$ J.', 'Impact: $0.9$ m/s → $E = \\tfrac12 \\times 8 \\times 0.81 = 3.24$ J.'],
      a: '1.44 J by the average, 3.24 J in reality — 2.25 times as much.'
    }
  ],
  quiz: [
    { q: 'Halving the impact speed changes the kinetic energy to…', choices: ['half', 'a quarter', 'the same', '√2 times less'], a: 1,
      why: 'E ∝ v²: half the speed gives a quarter of the energy.' },
    { q: 'What is the kinetic energy of 12 kg arriving at 0.5 m/s (J)?', answer: 1.5, unit: 'J', tol: 0.02,
      why: '½ × 12 × 0.25 = 1.5 J.' },
    { q: 'A hydraulic shock absorber on a pneumatic cylinder only has to absorb ½mv².', a: false,
      why: 'The cylinder keeps pushing during the absorber\'s stroke, adding the work F·s, which is often larger than the kinetic energy.' },
    { q: 'The cushion needle is screwed almost shut. What happens?', choices: ['the piston bangs harder', 'the piston stops short and creeps to the end, lengthening the stroke', 'the cylinder cannot start', 'nothing changes'], a: 1,
      why: 'The trapped cushion air can hardly escape; it stops the piston early (it may even bounce back) and the last millimetres take a long time.' },
    { q: 'Which speed should be used for the end-stop energy check?', choices: ['the average stroke speed', 'the speed at the start of cushioning or at impact', 'the speed at mid-stroke', 'the speed of sound'], a: 1,
      why: 'The energy is absorbed at the end; that speed is often 1.2–2 times the average.' }
  ],
  problems: [
    { q: 'A 25 kg slide hits a shock absorber at 1.2 m/s; the cylinder pushes 750 N; the absorber\'s stroke is 20 mm. How much energy is absorbed per stroke?', answer: 33, unit: 'J', tol: 0.02,
      steps: ['Kinetic: $\\tfrac12 \\times 25 \\times 1.44 = 18$ J.', 'Drive: $750 \\times 0.02 = 15$ J.', 'Total 33 J.'] }
  ],
  applications: ['Sizing end-of-stroke cushioning for pick-and-place slides and rodless cylinders.', 'Choosing shock absorbers for conveyor stops, turntables and swivel units.', 'Setting cushion needles after a change of payload, pressure or speed.', 'Deciding whether a faster cycle is possible without damaging the cylinder.'],
  sim: { id: 'dyn-stroke-phases', params: { mass: 5, thr: 1 } }
},

{
  id: 'stick-slip', parent: 'cylinder-dynamics', title: 'Low speed and stick-slip', level: 2,
  short: 'Below roughly 10–20 mm/s a standard pneumatic cylinder stops moving smoothly: its seals grip harder at rest than they slide, the soft air behind the piston winds up until the seal breaks free, and the piston jumps and sticks again. Low-friction seals, meter-out control, oil damping or an electric axis cure it.',
  keywords: ['stick-slip', 'breakaway friction', 'static friction', 'dynamic friction', 'Stribeck curve', 'low speed', 'jerky motion', 'judder', 'low-friction seals', 'hydro-pneumatic feed unit', 'oil damper', 'slow speed cylinder'],
  prereq: ['pneumatic-spring', 'flow-control-pneu', 'physics:friction'],
  related: ['cylinder-motion', 'servo-pneumatics', 'pneumatic-vs-electric', 'lubricators', 'rodless-guided', 'hydraulics:seals', 'physics:damped-oscillations'],
  body: `
Ask a pneumatic cylinder to move at 5 mm/s and watch the rod closely: it stands, jumps a few millimetres, stands again. Nothing is broken; this is **stick-slip**, and it sets the lower speed limit of pneumatic drives.

### Two ingredients: friction that drops, and a spring
Seals hold harder at rest than when sliding. A standard cylinder's breakaway friction is typically 1.5–2 times its running friction, and at low speeds the friction *falls* as the speed rises — the Stribeck curve — before viscous drag makes it climb again. After a long standstill the seals bed in and the breakaway grows further (the "first stroke on Monday morning").

The second ingredient is a spring between the drive and the load, and pneumatics has a soft one built in: the air in the chambers ([[pneumatic-spring]]).

### The cycle
With meter-out control the air ahead of the piston bleeds away slowly, so the net force on the piston creeps upwards. At the breakaway friction $F_s$ the seal lets go and the friction drops to the sliding value $F_k$: the surplus $F_s - F_k$ accelerates the load, which overshoots the balance point by about as much as it was short of it. It stops after travelling roughly

$$\\Delta x \\approx \\frac{2\\,(F_s - F_k)}{k}$$

and sticks again, and the cycle repeats. For a 32 mm cylinder at 6 bar with standard seals ($F_s \\approx 48$ N, $F_k \\approx 27$ N) on an air spring of about 9 N/mm, that is a jump of nearly 5 mm, taking about $\\pi\\sqrt{m/k} = 0.05$ s with 2 kg. Low-friction seals ($F_s \\approx 15$ N, $F_k \\approx 14$ N) cut the jump to a fraction of a millimetre.

### Where the limit lies
| Drive | Smooth down to about |
|---|---|
| Standard cylinder, meter-out | 15–20 mm/s |
| Low-friction ("slow-speed") cylinder | 3–5 mm/s |
| Cylinder with hydro-pneumatic feed unit | below 1 mm/s |
| Servo-pneumatic axis, friction compensated | a few mm/s |
| Electric axis | practically zero |

The simulation reproduces these with a Stribeck friction model; the exact limit depends on mass, pressure, lubrication and wear.

### Cures
- **Meter-out, never meter-in** for slow motion: the piston runs between two pressurised chambers, a stiffer spring that also holds the load back.
- **Low-friction seals** and cylinders designed for slow speed, kept lubricated and free of side loads ([[lubricators]]); guides that carry the load so the seals do not.
- **Higher pressure** stiffens the air but also presses the seals harder, so it helps less than hoped.
- A **hydro-pneumatic feed unit**: an oil-filled damping cylinder alongside, whose throttle sets the speed. The air provides force; the nearly incompressible oil provides stiffness and damping. Drilling and milling feeds have used it for decades.
- **Servo-pneumatics** with a position sensor and proportional valve ([[servo-pneumatics]]), or simply an electric axis ([[pneumatic-vs-electric]]) when slow, even motion is the main requirement.

> [!tip] The throttle opening for a slow speed is tiny: by $C = A\\,v/p_0$, 10 mm/s on a 32 mm annulus needs 0.007 dm³/(s·bar) — a hole about 0.2 mm across. Such settings drift with temperature and clog with dirt, one more reason slow pneumatic motion is fragile.
`,
  ideas: [
    'Stick-slip needs friction that is higher at rest than in motion, plus a spring — the air — between the drive and the load.',
    'Each jump is roughly 2(F_s − F_k)/k long: lower the friction difference or stiffen the air to shrink it.',
    'Standard cylinders become jerky below about 15–20 mm/s; low-friction cylinders go to a few mm/s.',
    'A hydro-pneumatic feed unit lets air supply the force and oil set the speed: smooth below 1 mm/s.',
    'Meter-out control, clean lubricated seals and guides that take side loads all push the limit down.'
  ],
  pitfalls: [
    'Stick-slip means the valve or throttle is faulty — It is the combination of seal friction and air compressibility; the parts can be perfectly sound.',
    'Raising the pressure cures stick-slip — It stiffens the air, but also raises seal friction; the gain is modest.',
    'A heavier load smooths the motion — More mass on the same air spring lowers its frequency and lengthens each jump; it does not remove the friction difference.'
  ],
  formulas: [
    {
      name: 'Length of a stick-slip jump',
      expr: 'dx = 2*(Fs - Fk)/k', tex: '\\Delta x = \\dfrac{2\\,(F_s - F_k)}{k}',
      vars: {
        dx: { name: 'jump length', q: 'length', unit: 'mm', tex: '\\Delta x' },
        Fs: { name: 'breakaway (static) friction', q: 'force', unit: 'N', value: 48, tex: 'F_s' },
        Fk: { name: 'sliding friction', q: 'force', unit: 'N', value: 27, tex: 'F_k' },
        k: { name: 'stiffness of the air', q: 'stiffness', unit: 'N/mm', value: 9 }
      },
      note: 'A step from static to sliding friction with no damping: the load overshoots the balance by as much as it was short of it.',
      practice: { unknowns: ['dx', 'k'] },
      stories: { dx: 'A cylinder\'s seals break away at {Fs} and slide at {Fk}; the air behind the piston has a stiffness of {k}. How far does each jump go?' }
    },
    {
      name: 'Duration of a jump',
      expr: 't = pi*sqrt(m/k)', tex: 't = \\pi\\sqrt{\\dfrac{m}{k}}',
      vars: {
        t: { name: 'time the load slides', q: 'time', unit: 'ms' },
        m: { name: 'moving mass', q: 'mass', unit: 'kg', value: 2 },
        k: { name: 'stiffness of the air', q: 'stiffness', unit: 'N/mm', value: 9 }
      },
      note: 'Half a period of the mass on the air spring.',
      stories: { t: 'A load of {m} on air of stiffness {k} breaks free. For how long does it slide before sticking again?' }
    },
    {
      name: 'Throttle opening for a slow speed',
      expr: 'C = A*v/p0', tex: 'C = \\dfrac{A\\,v}{p_0}',
      solveFor: 'C',
      vars: {
        C: { name: 'sonic conductance of the meter-out path', q: 'flowcond', unit: 'dm³/(s·bar)' },
        A: { name: 'area of the exhausting side', q: 'area', unit: 'cm²', value: 6.91 },
        v: { name: 'speed wanted', q: 'speed', unit: 'mm/s', value: 10 },
        p0: { name: 'reference pressure of free air (ANR, absolute)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_0' }
      },
      note: 'The choked meter-out rule. C in dm³/(s·bar) is about one fifth of the equivalent orifice area in mm².',
      stories: { C: 'A cylinder\'s exhausting side has an area of {A}. What meter-out conductance gives {v}?' }
    },
    {
      name: 'Speed with an oil damper (feed unit)',
      expr: 'v = (F - Ff)/c', tex: 'v = \\dfrac{F - F_f}{c}',
      vars: {
        v: { name: 'feed speed', q: 'speed', unit: 'mm/s' },
        F: { name: 'force of the air cylinder', q: 'force', unit: 'N', value: 482 },
        Ff: { name: 'friction and process force', q: 'force', unit: 'N', value: 27, tex: 'F_f' },
        c: { name: 'damping coefficient of the oil unit (N·s/m)', value: 45500 }
      },
      note: 'The oil throttle sets c; the air cylinder supplies the force.',
      stories: { v: 'An air cylinder pushes with {F} against {Ff} of friction; an oil damper with a coefficient of {c} N·s/m runs alongside. What is the feed speed?' }
    }
  ],
  examples: [
    {
      title: 'How far does it jump?',
      q: 'A 32 mm cylinder with standard seals breaks away at 48 N and slides at 27 N; the air spring is about 9 N/mm; the load is 2 kg. Estimate the jump and its duration.',
      steps: ['$\\Delta x = 2(48 - 27)/9000 = 4.7$ mm.', '$t = \\pi\\sqrt{2/9000} = 0.047$ s.', 'The simulation shows jumps of this size, separated by standstills, when 10 mm/s is asked for.'],
      a: 'Jumps of about 5 mm lasting some 50 ms — anything but smooth.'
    },
    {
      title: 'The throttle for 10 mm/s',
      q: 'What meter-out conductance gives 10 mm/s on a 32 mm cylinder extending (annulus 6.91 cm²), and what hole is that?',
      steps: ['$C = A v/p_0 = 6.91\\times10^{-4} \\times 0.01/10^5 = 6.9\\times10^{-11}$ m³/(s·Pa) = 0.0069 dm³/(s·bar).', 'An ideal orifice passes about 0.2 dm³/(s·bar) per mm², so the effective area is 0.035 mm².', 'Diameter: $\\sqrt{4 \\times 0.035/\\pi} = 0.21$ mm.'],
      a: 'About 0.007 dm³/(s·bar): an opening of roughly 0.2 mm, easily upset by dirt and temperature.'
    },
    {
      title: 'A feed unit for a drilling head',
      q: 'A drilling head is pushed by an air cylinder giving 482 N; friction and cutting force take 82 N. What damping coefficient gives a feed of 5 mm/s?',
      steps: ['$c = (F - F_f)/v = (482 - 82)/0.005 = 80\\,000$ N·s/m.', 'Set on the oil unit\'s throttle; the speed then barely depends on the air.'],
      a: 'About 80 000 N·s/m (80 N·s/mm).'
    }
  ],
  quiz: [
    { q: 'Stick-slip in a pneumatic cylinder needs…', choices: ['breakaway friction higher than sliding friction, and a spring (the air) between drive and load', 'only a heavy load', 'a pressure above 8 bar', 'meter-in control only'], a: 0,
      why: 'The friction drop lets the wound-up air spring fling the load forward; without the drop, or with a stiff connection, the motion is smooth.' },
    { q: 'Raising the supply pressure reliably cures stick-slip.', a: false,
      why: 'It stiffens the air spring, but presses the seals harder too, raising friction; the improvement is usually small.' },
    { q: 'Seals break away at 30 N and slide at 20 N; the air stiffness is 10 N/mm. How long is each jump (mm)?', answer: 2, unit: 'mm', tol: 0.02,
      why: 'Δx = 2 × (30 − 20)/10 000 N/m = 2 mm.' },
    { q: 'Which of these gives smooth motion at 2 mm/s?', choices: ['a standard cylinder with meter-in', 'a standard cylinder with meter-out', 'a cylinder with a hydro-pneumatic feed unit', 'a larger valve'], a: 2,
      why: 'The oil damper provides stiffness and damping; the speed is set by oil flow, not by bleeding air.' },
    { q: 'For slow motion, meter-out is better than meter-in because…', choices: ['it uses less air', 'the piston runs between two pressurised chambers: a stiffer air spring that also holds the load back', 'the valve switches faster', 'it heats the air'], a: 1,
      why: 'With meter-in the exhausting side is near atmospheric: a very soft spring and nothing to stop the load running ahead.' }
  ],
  problems: [
    { q: 'A 2.5 kg load slides on air of 12 N/mm stiffness after breaking free. How long does the slide last (ms)?', answer: 45.3, unit: 'ms', tol: 0.03,
      steps: ['$t = \\pi\\sqrt{2.5/12\\,000} = \\pi \\times 0.01443 = 0.0453$ s.'] }
  ],
  applications: ['Slow feeds for drilling, milling and screwdriving heads (hydro-pneumatic feed units).', 'Dispensing and gluing axes that need even, slow motion.', 'Choosing between a low-friction cylinder, a servo-pneumatic axis and an electric axis.', 'Diagnosing jerky cylinders: dry seals, side loads, meter-in circuits.'],
  history: 'In 1902 Richard Stribeck published measurements of friction in journal and roller bearings against speed; the dip he found at low speeds — friction falling as the speed rises until a lubricating film builds up — is now called the Stribeck curve, and it is the root of stick-slip in machine tools, brakes, violin strings and pneumatic cylinders alike.',
  sim: 'dyn-stick-slip'
},

/* ================================================================ SIZING A SYSTEM */
{
  id: 'sizing-procedure', parent: 'system-sizing', title: 'Sizing a pneumatic drive', level: 2,
  short: 'A drive is sized in a fixed order: the force — load plus acceleration — sets the bore; the stroke time sets the speed, and so the conductance the valve, tubes and fittings must pass; the end-stop energy is checked against cushions or shock absorbers; and the air it uses is counted for the compressor.',
  keywords: ['sizing', 'cylinder sizing', 'valve sizing', 'bore selection', 'load ratio', 'stroke time', 'required conductance', 'design speed', 'kinetic energy check', 'air consumption', 'peak flow', 'procedure'],
  prereq: ['pneumatic-cylinder', 'cylinder-force', 'sonic-conductance', 'cylinder-motion'],
  related: ['valve-sizing', 'conductance-series', 'tubing-length-effect', 'kinetic-energy-limits', 'consumption-budget', 'air-consumption', 'iso-15552', 'pneumatic-vs-electric', 'hydraulics:valve-sizing-dynamics'],
  body: `
Sizing a pneumatic drive is a short chain of decisions, each resting on the one before. Done in order, it takes a quarter of an hour and avoids the two classic failures: a cylinder that is strong but slow, and one that is fast but destroys itself at the end of every stroke.

### 1. Force: load plus acceleration
Add up what the cylinder must overcome: the weight when lifting, guide friction ($\\mu m g$, with $\\mu \\approx 0.1$ for good linear guides) when pushing sideways, process forces — and the force to accelerate the load. A usable estimate: reach the design speed within a quarter of the stroke, $a = 2v^2/s$, so

$$F = F_L + \\frac{2\\,m\\,v^2}{s}$$

Then choose the bore from the load ratio $\\lambda$ ([[cylinder-force]]): $D = \\sqrt{4F/(\\pi p_g \\lambda)}$ with $\\lambda \\approx 0.5$–0.7 for moving loads (up to 0.85 for slow clamping), and round up to the next ISO bore (16, 20, 25, 32, 40, 50, 63, 80, 100 mm …). Check the retracting force on the annulus too.

### 2. Speed
The mean speed is stroke over time, but part of the time goes to dead time, acceleration and cushioning ([[cylinder-motion]]). Design the steady speed about 1.3–1.5 times the mean.

### 3. Conductance
With meter-out control the steady speed is set by the exhaust path, $v = C\\,p_0/A$, so the path must reach $C = A\\,v/p_0$ — with a margin of about 1.25 so the throttle has something to trim:

| Bore / rod | Annulus | $C$ for 0.5 m/s | $C$ for 1 m/s |
|---|---|---|---|
| 16 / 6 | 1.73 cm² | 0.11 | 0.22 |
| 25 / 10 | 4.12 cm² | 0.26 | 0.52 |
| 32 / 12 | 6.91 cm² | 0.43 | 0.86 |
| 50 / 20 | 16.5 cm² | 1.0 | 2.1 |
| 63 / 20 | 28.0 cm² | 1.8 | 3.5 |
| 100 / 25 | 73.6 cm² | 4.6 | 9.2 |

(dm³/(s·bar), for the whole path, margin included.)

### 4. Valve, tubes and fittings
The path is a chain — valve, fittings, tube, throttle, silencer — and conductances in series combine as $1/C^2 = \\sum 1/C_i^2$ ([[conductance-series]]). Choose the tube and its length first (short, and matched to the bore: [[tubing-length-effect]]), then the smallest valve that makes the chain reach the target. If no valve does, the tube is the problem.

### 5. Energy at the end
Check $\\tfrac12 m v^2$ at the design speed against the cylinder's cushioning ([[kinetic-energy-limits]]). For light, fast loads this check — not the force — often decides the bore; otherwise add shock absorbers or slow the end of the stroke.

### 6. Air
Count the free air per cycle — both strokes, plus the tubes — and the peak flow while the piston moves, $Q = A\\,v\\,(p_g + p_\\text{atm})/p_\\text{atm}$, which the supply line and service unit must pass. Add the drive to the machine's [[consumption-budget]].

### 7. Check
Simulate or test, with pressure traces if you can. The simulation below runs exactly this procedure and then checks the result with the engine's cylinder model.

> [!key] Force → bore; time → speed → conductance → valve and tube; speed → energy → cushioning; everything → air. When a step fails, go back one step, not forward.
`,
  ideas: [
    'Size in order: force and bore, speed, conductance, valve and tube, energy, air — then check.',
    'The force includes accelerating the load, roughly 2mv²/s to reach speed within a quarter of the stroke.',
    'Design the steady speed about 1.3–1.5 times stroke/time to cover dead time and acceleration.',
    'The exhaust path needs C = A·v/p₀, with about 25 % margin, counting valve, tubes and fittings in series.',
    'For light, fast loads the end-stop energy often decides the bore.'
  ],
  pitfalls: [
    'Choose the valve by its port thread — Port size says little about flow; two valves with the same thread can differ by a factor of three in conductance.',
    'If the valve has exactly the C the speed needs, the cylinder will reach that speed — Tubes, fittings, silencer and throttle are in series and lower the total; size the whole path with a margin.',
    'A bigger bore is always the safe choice — It needs more air per stroke, a bigger valve for the same speed, and costs more to run; oversizing also makes slow motion jerkier.'
  ],
  formulas: [
    {
      name: 'Force to move and accelerate the load',
      expr: 'F = FL + 2*m*v^2/s', tex: 'F = F_L + \\dfrac{2\\,m\\,v^2}{s}',
      vars: {
        F: { name: 'force the cylinder must provide', q: 'force', unit: 'N' },
        FL: { name: 'static load (weight, guide friction, process force)', q: 'force', unit: 'N', value: 49.05, tex: 'F_L' },
        m: { name: 'moving mass', q: 'mass', unit: 'kg', value: 5 },
        v: { name: 'design speed', q: 'speed', unit: 'm/s', value: 0.525 },
        s: { name: 'stroke', q: 'length', unit: 'mm', value: 150 }
      },
      note: 'Acceleration to the design speed within a quarter of the stroke, a = 2v²/s. Divide by the load ratio to get the theoretical force the bore must give.',
      practice: { unknowns: ['F', 'v'] },
      stories: { F: 'A cylinder must lift {FL} of load of mass {m} and reach {v} within a quarter of its {s} stroke. What force must it provide?' }
    },
    {
      name: 'Design speed from the stroke time',
      expr: 'v = kv*s/t', tex: 'v = k_v\\,\\dfrac{s}{t}',
      vars: {
        v: { name: 'design (steady) speed', q: 'speed', unit: 'm/s' },
        kv: { name: 'ratio of steady to mean speed (1.3–1.5)', value: 1.4, tex: 'k_v' },
        s: { name: 'stroke', q: 'length', unit: 'mm', value: 150 },
        t: { name: 'required stroke time', q: 'time', unit: 's', value: 0.4 }
      },
      stories: { v: 'A stroke of {s} must be done in {t}. What steady speed should the drive be designed for (factor {kv})?' }
    },
    {
      name: 'Conductance the exhaust path needs',
      expr: 'C = km*A*v/p0', tex: 'C = k_m\\,\\dfrac{A\\,v}{p_0}',
      vars: {
        C: { name: 'sonic conductance of the path (valve, tube, fittings)', q: 'flowcond', unit: 'dm³/(s·bar)' },
        km: { name: 'margin for trimming and losses', value: 1.25, tex: 'k_m' },
        A: { name: 'area of the exhausting side', q: 'area', unit: 'cm²', value: 6.91 },
        v: { name: 'design speed', q: 'speed', unit: 'm/s', value: 0.525 },
        p0: { name: 'reference pressure of free air (ANR, absolute)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_0' }
      },
      note: 'From v = C·p₀/A for a choked meter-out path.',
      practice: { unknowns: ['C', 'v'] },
      stories: { C: 'A cylinder with an exhausting area of {A} must run at {v}. What conductance should its exhaust path have, with a margin of {km}?' }
    },
    {
      name: 'Peak free-air flow while the piston moves',
      expr: 'Q = A*v*(p + patm)/patm', tex: 'Q = A\\,v\\,\\dfrac{p_g + p_\\text{atm}}{p_\\text{atm}}',
      vars: {
        Q: { name: 'peak free-air flow', q: 'airflow', unit: 'L/min ANR' },
        A: { name: 'area being filled (piston or annulus)', q: 'area', unit: 'cm²', value: 8.04 },
        v: { name: 'piston speed', q: 'speed', unit: 'm/s', value: 0.525 },
        p: { name: 'working pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' }
      },
      note: 'What the supply line, service unit and valve must pass during the stroke — several times the average consumption.',
      stories: { Q: 'A piston of {A} moves at {v} at {p}. What free-air flow must reach it while it moves?' }
    }
  ],
  examples: [
    {
      title: 'A lifting drive, step by step',
      q: 'A 5 kg part is lifted 150 mm in 0.4 s at 6 bar gauge, with 1 m of 6 mm tube (4 mm bore) between valve and cylinder. Size the drive.',
      steps: [
        'Speed: mean $0.15/0.4 = 0.375$ m/s; design $1.4 \\times 0.375 = 0.525$ m/s.',
        'Force: $F = 5 \\times 9.81 + 2 \\times 5 \\times 0.525^2/0.15 = 49.1 + 18.4 = 67.5$ N.',
        'Bore at $\\lambda = 0.5$: $D = \\sqrt{4 \\times 67.5/(\\pi \\times 6\\times10^5 \\times 0.5)} = 16.9$ mm → 20 mm.',
        'Energy: $\\tfrac12 \\times 5 \\times 0.525^2 = 0.69$ J — far above the 0.25 J a 20 mm cylinder\'s cushion takes. The next bore whose cushion covers it is 32 mm (about 1 J). Choose 32 mm (or keep 20 mm with a shock absorber).',
        'Conductance: annulus 6.91 cm²: $C = 1.25 \\times 6.91\\times10^{-4} \\times 0.525/10^5 = 0.45$ dm³/(s·bar).',
        'Tube: 1 m of 4 mm bore with its fittings ≈ 1.27 dm³/(s·bar). Valve: $1/C_v^2 = 1/0.45^2 - 1/1.27^2$ → $C_v = 0.48$: choose a valve of 0.5 or more.',
        'Air per cycle: $(8.04 + 6.91)\\times15$ cm³ × 7.013/1.013 = 1.55 L, plus 2 × 12.6 cm³ of tube × 6/1.013 = 0.15 L: 1.7 L.',
        'Peak flow while lifting: $8.04\\times10^{-4} \\times 0.525 \\times 6.92 = 2.9$ L/s = 175 L/min.'
      ],
      a: 'A 32 mm cylinder (chosen for its cushioning, not its force), a valve of C ≥ 0.5 dm³/(s·bar), 1.7 L of free air per cycle and a peak of 175 L/min.'
    },
    {
      title: 'When the tube matters as much as the valve',
      q: 'A 63 mm cylinder (20 mm rod) must run at 1 m/s. Which path conductance is needed, and can a valve of C = 4.5 with 1 m of 12 mm tube (9 mm bore, C ≈ 7.9) or of 10 mm tube (7.5 mm bore, C ≈ 5.3) provide it?',
      steps: [
        'Annulus 28.0 cm²: $C = 1.25 \\times 28.0\\times10^{-4} \\times 1/10^5 = 3.5$ dm³/(s·bar).',
        'With 12 mm tube: $1/\\sqrt{1/4.5^2 + 1/7.9^2} = 3.9$ — enough.',
        'With 10 mm tube: $1/\\sqrt{1/4.5^2 + 1/5.3^2} = 3.4$ — just short.'
      ],
      a: 'About 3.5 dm³/(s·bar): the 4.5 valve works with the 12 mm tube, not quite with the 10 mm one.'
    }
  ],
  quiz: [
    { q: 'In which order is a pneumatic drive best sized?', choices: ['valve, then bore, then energy', 'force and bore, speed, conductance (valve and tube), energy, air', 'air consumption first, then everything else', 'bore from the port thread of the valve'], a: 1,
      why: 'Each step needs the one before: the bore sets the areas for the conductance, the speed sets the energy, and everything sets the air.' },
    { q: 'With no margin, what path conductance does a 50 mm cylinder (annulus 16.49 cm²) need for 1 m/s (dm³/(s·bar))?', answer: 1.65, unit: 'dm³/(s·bar)', tol: 0.03,
      why: 'C = A·v/p₀ = 16.49×10⁻⁴ × 1 / 10⁵ = 1.65×10⁻⁸ m³/(s·Pa) = 1.65 dm³/(s·bar).' },
    { q: 'If the valve alone has the conductance the speed formula asks for, the cylinder will reach that speed.', a: false,
      why: 'Tubes, fittings, throttle and silencer are in series and lower the total conductance; the whole path must reach the target, with a margin.' },
    { q: 'A light load must move fast. What often decides the bore?', choices: ['the force', 'the energy the end-stop cushioning can absorb', 'the port thread', 'the rod buckling'], a: 1,
      why: '½mv² grows with the square of speed and small cylinders\' cushions take little energy; a bigger bore may be chosen purely for its cushioning.' },
    { q: 'The design steady speed is taken above stroke/time because…', choices: ['air heats up', 'the dead time, acceleration and cushioning use part of the stroke time', 'valves are slower than stated', 'the rod is heavier than the piston'], a: 1,
      why: 'Only part of the stroke time is spent at steady speed, so that speed must exceed the average — typically by 30–50 %.' }
  ],
  problems: [
    { q: 'An 8 kg load is lifted vertically and must reach 0.6 m/s within a quarter of a 200 mm stroke. What force must the cylinder provide?', answer: 107.3, unit: 'N', tol: 0.02,
      steps: ['Weight: $8 \\times 9.81 = 78.5$ N.', 'Acceleration: $2 \\times 8 \\times 0.6^2/0.2 = 28.8$ N.', 'Total 107.3 N.'] },
    { q: 'A 50 mm piston (19.63 cm²) moves at 0.5 m/s at 6 bar gauge. What peak free-air flow must reach it (L/min)?', answer: 408, unit: 'L/min', tol: 0.03,
      steps: ['$Q = 19.63\\times10^{-4} \\times 0.5 \\times 7.013/1.013 = 6.80\\times10^{-3}$ m³/s.', '= 408 L/min of free air.'] }
  ],
  applications: ['Designing the axes of assembly machines, handling units and presses.', 'Checking why an existing drive is too slow — a thin tube or a tiny fitting, rather than the valve, is often the culprit.', 'Estimating air consumption and running cost before a machine is built.', 'Comparing a pneumatic axis with an electric one on the same data.'],
  sim: 'dyn-sizer'
},

{
  id: 'conductance-series', parent: 'system-sizing', title: 'Conductances in series', level: 2,
  short: 'Air from the valve to the cylinder passes several restrictions in a row — valve, fittings, tube, throttle, silencer. Their sonic conductances combine roughly as 1/C² = Σ 1/C_i²: the total is always below the smallest, and the smallest element dominates.',
  keywords: ['sonic conductance', 'series', 'parallel', 'combination', 'restriction', 'tube conductance', 'fittings', 'silencer', 'bottleneck', 'ISO 6358-3', 'flow path', 'critical pressure ratio'],
  prereq: ['sonic-conductance', 'choked-flow', 'tubing-fittings'],
  related: ['tubing-length-effect', 'sizing-procedure', 'valve-sizing', 'flow-coefficients', 'pressure-drop-air', 'noise-silencers', 'hydraulics:pipes-series-parallel', 'hydraulics:equivalent-length', 'physics:resistors-combinations'],
  body: `
A catalogue gives the sonic conductance of a valve, but the cylinder never sees the valve alone. Between the supply and the piston the air passes a push-in fitting, a tube, another fitting, perhaps a flow-control valve, a manifold channel — and on the way out a throttle and a silencer. What counts is the conductance of the whole chain.

### The rule
For restrictions whose flow follows the ISO 6358 ellipse with $b = 0$ — which is how a long tube behaves — the combination is exact. Each element obeys $p_\\text{in}^2 - p_\\text{out}^2 = (q/C_i)^2$; adding them up, the intermediate pressures cancel:

$$\\frac{1}{C^2} = \\frac{1}{C_1^2} + \\frac{1}{C_2^2} + \\dots$$

For valves with $b$ between 0.2 and 0.5 it is an approximation; some makers use a cube law ($1/C^3 = \\sum 1/C_i^3$), which gives a slightly larger total, and ISO 6358-3:2014 describes how to compute a system's $C$ and $b$ from its parts. The differences are smaller than the scatter of catalogue data. The chain's critical pressure ratio is lower than any of its parts: a long chain behaves like a tube.

### What it means
- Two equal elements give $C/\\sqrt2 = 0.71\\,C$; three give $0.58\\,C$.
- The smallest element dominates: a valve of 2.0 with a tube of 0.5 gives 0.49 — upgrading the valve to 5.0 raises it only to 0.50.
- Improve the weakest link first. Doubling the valve of the example below gains 18 %; a wider tube gains 33 %.
- In parallel, conductances simply add: two identical tubes or valves side by side double $C$.

### Tubes as conductances
A tube is a restriction spread along its length. For isothermal flow with friction, $p_1^2 - p_2^2$ is proportional to the square of the mass flow — the $b = 0$ ellipse — with

$$C = \\frac{\\pi d^2/4}{\\rho_0\\sqrt{R\\,T\\,f\\,L/d}}$$

where $f \\approx 0.02$ is the Darcy friction factor of a smooth tube at typical flows ($\\rho_0$ = 1.185 kg/m³, the density of free air). Combining it with an entry loss like a nozzle of the tube's bore gives these estimates:

| Tube (outside × bore) | Volume per metre | 0.5 m | 1 m | 3 m | 10 m |
|---|---|---|---|---|---|
| 4 × 2.5 mm | 4.9 cm³ | 0.53 | 0.42 | 0.27 | 0.16 |
| 6 × 4 mm | 12.6 cm³ | 1.5 | 1.3 | 0.85 | 0.50 |
| 8 × 5.5 mm | 23.8 cm³ | 3.1 | 2.6 | 1.8 | 1.1 |
| 10 × 7.5 mm | 44.2 cm³ | 6.0 | 5.3 | 3.8 | 2.4 |
| 12 × 9 mm | 63.6 cm³ | 8.8 | 7.9 | 5.9 | 3.7 |

(dm³/(s·bar)). Three metres of 6 mm tube have less conductance than many valves of the same port size. Elbows, tees and push-in fittings each add the equivalent of a fraction of a metre ([[hydraulics:equivalent-length]]); quick couplings and the narrow bores of some fittings can be the real bottleneck.

### The exhaust side counts too
With meter-out control the exhaust path sets the speed ([[cylinder-motion]]): valve exhaust channel, throttle and silencer in series. A silencer clogged with oil and dust can halve that path's conductance — and the cylinder slows down for no visible reason ([[noise-silencers]]).

> [!tip] When a cylinder is too slow, list every element in the path with its conductance and look for the smallest. It is often not the valve.
`,
  ideas: [
    'Sonic conductances in series combine as 1/C² = Σ 1/C_i² — exactly for tube-like elements, approximately for valves.',
    'The total is always smaller than the smallest element; the smallest dominates.',
    'Improving anything but the weakest element gains little.',
    'In parallel, conductances add.',
    'A few metres of thin tube can have less conductance than the valve that feeds it.'
  ],
  pitfalls: [
    'A bigger valve always makes the cylinder faster — Not if a tube, fitting or silencer is the smallest conductance in the chain; then the gain is a few per cent.',
    'Conductances in series add like resistances, 1/C = Σ 1/C_i — For gas flow it is the squares: two equal elements give 0.71 C, not 0.5 C.',
    'Only the supply side matters — With meter-out control the exhaust path — valve exhaust, throttle, silencer — sets the speed.'
  ],
  formulas: [
    {
      name: 'Two elements in series',
      expr: 'C = 1/sqrt(1/C1^2 + 1/C2^2)', tex: 'C = \\dfrac{1}{\\sqrt{1/C_1^2 + 1/C_2^2}}',
      vars: {
        C: { name: 'conductance of the pair', q: 'flowcond', unit: 'dm³/(s·bar)' },
        C1: { name: 'first element', q: 'flowcond', unit: 'dm³/(s·bar)', value: 1.2, tex: 'C_1' },
        C2: { name: 'second element', q: 'flowcond', unit: 'dm³/(s·bar)', value: 0.4, tex: 'C_2' }
      },
      practice: { unknowns: ['C', 'C2'] },
      stories: { C: 'A valve of {C1} feeds a throttle of {C2}. What is their combined conductance?', C2: 'A path must reach {C}; the valve has {C1}. What conductance may the rest of the path have at least?' }
    },
    {
      name: 'Three elements in series',
      expr: 'C = 1/sqrt(1/C1^2 + 1/C2^2 + 1/C3^2)', tex: 'C = \\dfrac{1}{\\sqrt{1/C_1^2 + 1/C_2^2 + 1/C_3^2}}',
      vars: {
        C: { name: 'conductance of the chain', q: 'flowcond', unit: 'dm³/(s·bar)' },
        C1: { name: 'valve', q: 'flowcond', unit: 'dm³/(s·bar)', value: 1.2, tex: 'C_1' },
        C2: { name: 'tube with its fittings', q: 'flowcond', unit: 'dm³/(s·bar)', value: 1.0, tex: 'C_2' },
        C3: { name: 'throttle or silencer', q: 'flowcond', unit: 'dm³/(s·bar)', value: 3.0, tex: 'C_3' }
      },
      stories: { C: 'Air passes a valve of {C1}, a tube of {C2} and a throttle of {C3}. What is the conductance of the whole path?' }
    },
    {
      name: 'Conductance of a tube (friction)',
      expr: 'C = pi*d^2/4/(rho0*sqrt(Rair*T*f*L/d))', tex: 'C = \\dfrac{\\pi d^2/4}{\\rho_0\\sqrt{R_\\text{air}\\,T\\,f\\,L/d}}',
      vars: {
        C: { name: 'sonic conductance of the tube (friction only)', q: 'flowcond', unit: 'dm³/(s·bar)' },
        d: { name: 'bore of the tube', q: 'length', unit: 'mm', value: 4 },
        rho0: { name: 'density of free air (ANR: 20 °C, 100 kPa)', q: 'density', unit: 'kg/m³', value: 1.185, fixed: true, tex: '\\rho_0' },
        Rair: { const: 'Rair' },
        T: { name: 'air temperature', q: 'temperature', unit: '°C', value: 20 },
        f: { name: 'Darcy friction factor (≈ 0.02 for smooth tubes)', value: 0.02 },
        L: { name: 'length', q: 'length', unit: 'm', value: 1 }
      },
      note: 'Isothermal flow with friction follows the ISO 6358 ellipse with b = 0. Put the result in series with an entry loss (about 0.16 dm³/(s·bar) per mm² of bore) for short tubes and fittings.',
      practice: { unknowns: ['C', 'L'] },
      stories: { C: 'What is the friction conductance of {L} of tube with a bore of {d} (f = {f})?', L: 'How long may a tube of {d} bore be before its friction conductance falls to {C} (f = {f})?' }
    }
  ],
  examples: [
    {
      title: 'Valve, tube and throttle',
      q: 'A 32 mm cylinder exhausts through a valve of $C = 1.2$, 2 m of 6 mm tube (4 mm bore, $C \\approx 1.0$ with fittings) and an open throttle ($C = 3.0$). What is the path conductance and the meter-out speed? What does a valve of twice the conductance gain, and what does 8 mm tube ($C \\approx 2.1$ for 2 m) gain?',
      steps: [
        '$1/C^2 = 1/1.44 + 1/1.0 + 1/9 = 0.694 + 1.0 + 0.111 = 1.81$ → $C = 0.74$ dm³/(s·bar).',
        'Speed on the 6.91 cm² annulus: $0.74\\times10^{-3}/6.91\\times10^{-4} = 1.08$ m/s.',
        'Valve 2.4: $1/C^2 = 0.174 + 1.0 + 0.111 = 1.29$ → $C = 0.88$ (+18 %).',
        '8 mm tube: $1/C^2 = 0.694 + 0.227 + 0.111 = 1.03$ → $C = 0.99$ (+33 %).'
      ],
      a: '0.74 dm³/(s·bar), about 1.1 m/s. The tube, not the valve, is the element to improve.'
    },
    {
      title: 'The clogged silencer',
      q: 'A valve\'s exhaust channel has $C = 1.2$. With a new silencer ($C = 3.0$) the path has what conductance? And when the silencer has clogged to $C = 0.6$?',
      steps: ['New: $1/\\sqrt{1/1.44 + 1/9} = 1.11$.', 'Clogged: $1/\\sqrt{1/1.44 + 1/0.36} = 0.54$.'],
      a: 'The path drops from 1.11 to 0.54 dm³/(s·bar): a meter-out cylinder exhausting through it runs at half speed.'
    }
  ],
  quiz: [
    { q: 'Two elements of C = 1 dm³/(s·bar) each in series give…', choices: ['0.5', '0.71', '1', '2'], a: 1,
      why: '1/C² = 1 + 1 = 2, so C = 1/√2 = 0.71.' },
    { q: 'The conductance of a series chain can be larger than that of its smallest element.', a: false,
      why: 'Every term 1/C_i² is positive, so 1/C² exceeds the largest of them: C is below the smallest C_i.' },
    { q: 'A valve of C = 2.0 feeds a tube of C = 1.0. What is the combined conductance (dm³/(s·bar))?', answer: 0.894, unit: 'dm³/(s·bar)', tol: 0.02,
      why: '1/C² = 0.25 + 1 = 1.25 → C = 0.894.' },
    { q: 'A cylinder is too slow. The valve has C = 3, the 5 m tube C = 0.6. The best improvement is…', choices: ['a valve of C = 6', 'a shorter or wider tube', 'higher pressure', 'a smaller throttle'], a: 1,
      why: 'The tube dominates: with the tube at 0.6 the chain is 0.59; a C = 6 valve would make it 0.60. Shortening or widening the tube attacks the bottleneck.' },
    { q: 'Conductances in parallel combine as…', choices: ['1/C = Σ 1/C_i', 'C = Σ C_i', '1/C² = Σ 1/C_i²', 'the largest one'], a: 1,
      why: 'The flows through parallel paths add at the same pressures, so the conductances add.' }
  ],
  problems: [
    { q: 'A valve of C = 0.8, a fitting of C = 1.5 and a tube of C = 2.5 dm³/(s·bar) are in series. What is the total?', answer: 0.679, unit: 'dm³/(s·bar)', tol: 0.02,
      steps: ['$1/C^2 = 1/0.64 + 1/2.25 + 1/6.25 = 1.5625 + 0.4444 + 0.16 = 2.167$.', '$C = 0.679$ dm³/(s·bar).'] }
  ],
  applications: ['Finding the bottleneck in a slow pneumatic drive.', 'Choosing tube sizes and lengths when valves are grouped on a valve terminal.', 'Specifying silencers and quick couplings that do not throttle the machine.', 'Estimating the flow of long pilot lines and blow-off hoses.'],
  history: 'Adding the inverse squares is the gas-flow cousin of adding resistances in series. It was used informally with ISO 6358\'s conductances from the start; ISO 6358-3:2014 set down methods for predicting the flow characteristics of a whole system from those of its components.',
  sim: 'dyn-tubing'
},

{
  id: 'tubing-length-effect', parent: 'system-sizing', title: 'Tube length and dead volume', level: 1,
  short: 'The tube between valve and cylinder costs twice: its volume must be filled and thrown away every stroke, and its friction adds a restriction in series with the valve. Long or oversized tubes waste air; long thin tubes make cylinders slow and late. Put the valve close to the cylinder.',
  keywords: ['tube length', 'dead volume', 'tubing', 'hose', 'valve location', 'valve terminal', 'air consumption', 'response time', 'signal delay', 'pilot line', 'tube bore', 'dead time'],
  prereq: ['tubing-fittings', 'conductance-series', 'air-consumption'],
  related: ['valve-terminals', 'filling-emptying', 'cylinder-motion', 'sizing-procedure', 'air-saving-circuits', 'pressure-drop-air', 'physics:speed-of-sound'],
  body: `
On many machines the valves sit together on a valve terminal in the control cabinet, and a bundle of tubes runs several metres to the cylinders. It is tidy, but every one of those tubes is both a small receiver that is filled and emptied each stroke and a long restriction in the air path.

### The volume
A tube of bore $d$ and length $L$ holds $V = \\pi d^2 L/4$:

| Tube (outside × bore) | Volume per metre | Free air per metre and fill at 6 bar |
|---|---|---|
| 4 × 2.5 mm | 4.9 cm³ | 0.029 L |
| 6 × 4 mm | 12.6 cm³ | 0.074 L |
| 8 × 5.5 mm | 23.8 cm³ | 0.14 L |
| 10 × 7.5 mm | 44.2 cm³ | 0.26 L |
| 12 × 9 mm | 63.6 cm³ | 0.38 L |

After each exhaust a tube is left full of air at atmospheric pressure, so each filling takes $V\\,p_g/p_\\text{atm}$ of free air from the compressor — 5.9 times its volume at 6 bar — and throws it away on the next exhaust. For short strokes this can match the cylinder itself: a 32 mm cylinder with a 50 mm stroke sweeps 75 cm³ per cycle (0.52 L of free air); with 3 m of 6 mm tube to each port the tubes add $2 \\times 37.7$ cm³ × 5.9 = 0.45 L — 86 % more. (The simulation, whose air stays warm after filling, shows +58 %.)

### The resistance
The same tube is a restriction in series with the valve ([[conductance-series]]): 3 m of 6 mm tube has a conductance of about 0.85 dm³/(s·bar), less than many valves that feed it. Together with a valve of $C = 1$ it cuts the path to 0.65. The cylinder runs slower, and — because the tube must fill before pressure reaches the cylinder at all — it starts later: in the simulation the 32 mm cylinder's dead time grows from 6 ms with the valve on the cylinder to 31 ms with it 3 m away.

### Signals are not instant
A pressure change travels down a tube at about the speed of sound ([[physics:speed-of-sound]]), 343 m/s: 3 m take 9 ms before anything arrives, and the tube then needs to fill. For pilot signals in purely pneumatic controls, long lines add tens of milliseconds to every step.

### Choosing tubes
- Mount valves near the cylinders: on the cylinder, on a valve terminal on the machine, or a fieldbus terminal close to the actuators ([[valve-terminals]]).
- Match the tube to the bore: about 4 mm tube for 16–20 mm cylinders, 6 mm for 25–40 mm, 8 mm for 50–63 mm, 10–12 mm for 80–100 mm. Too thin throttles; too large wastes air and slows the pressure build-up.
- Count the tubes in the [[air-consumption]] and the [[consumption-budget]]; for small, fast cylinders they are often a third or more.
- Where tubes must be long, pipe the supply close to the actuator and switch there, or use quick-exhaust valves at the cylinder so the exhaust does not travel back ([[quick-exhaust]]).

> [!key] Every metre of tube between valve and cylinder is paid for twice: in air on every stroke, and in speed.
`,
  ideas: [
    'Each tube is filled and emptied every stroke: it takes V·p_g/p_atm of free air each time.',
    'For short strokes and small bores, tubes can use as much air as the cylinder.',
    'A long thin tube is a restriction in series with the valve and often the smallest in the path.',
    'Pressure signals travel at about 343 m/s, and tubes must fill before the cylinder feels anything.',
    'Put valves close to their cylinders and match the tube to the bore.'
  ],
  pitfalls: [
    'A bigger tube is always better — It lowers the resistance but raises the dead volume, the air per stroke and the time to build pressure.',
    'Tube air does not count because it never reaches the cylinder — It is compressed and exhausted every stroke just like the cylinder\'s air, and the compressor pays for it.',
    'Pneumatic signals arrive instantly — They travel at the speed of sound and then have to fill the line; long pilot lines add tens of milliseconds.'
  ],
  formulas: [
    {
      name: 'Volume of a tube',
      expr: 'V = pi*d^2/4*L', tex: 'V = \\dfrac{\\pi d^2}{4}\\,L',
      vars: {
        V: { name: 'tube volume', q: 'volume', unit: 'cm³' },
        d: { name: 'bore of the tube', q: 'length', unit: 'mm', value: 4 },
        L: { name: 'length', q: 'length', unit: 'm', value: 3 }
      },
      stories: { V: 'How much volume does {L} of tube with a bore of {d} hold?' }
    },
    {
      name: 'Free air to fill both tubes of a cylinder each cycle',
      expr: 'Vf = 2*pi*d^2/4*L*p/patm', tex: 'V_f = 2\\,\\dfrac{\\pi d^2}{4}\\,L\\,\\dfrac{p_g}{p_\\text{atm}}',
      vars: {
        Vf: { name: 'free air per cycle for the tubes', q: 'volume', unit: 'L', tex: 'V_f' },
        d: { name: 'bore of the tube', q: 'length', unit: 'mm', value: 4 },
        L: { name: 'length of each tube', q: 'length', unit: 'm', value: 3 },
        p: { name: 'working pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' }
      },
      note: 'Each tube starts its filling full of air at atmospheric pressure, so only the gauge pressure counts. Air that has not cooled when the valve switches takes a little less.',
      practice: { unknowns: ['Vf', 'L'] },
      stories: { Vf: 'A cylinder is connected by two tubes of {L}, bore {d}, and works at {p}. How much free air do the tubes take each cycle?' }
    },
    {
      name: 'Time for a pressure signal to travel down a tube',
      expr: 't = L/vs', tex: 't = \\dfrac{L}{v_s}',
      vars: {
        t: { name: 'travel time', q: 'time', unit: 'ms' },
        L: { name: 'tube length', q: 'length', unit: 'm', value: 3 },
        vs: { const: 'vs' }
      },
      note: 'The front of the pressure change; the tube must then fill, which takes longer.',
      stories: { t: 'A valve switches {L} away from a cylinder. How long before the pressure change arrives?' }
    }
  ],
  examples: [
    {
      title: 'Short stroke, long tubes',
      q: 'A 32 mm cylinder (12 mm rod) with a 50 mm stroke works at 6 bar gauge. Its valve is 3 m away, with 6 mm tube (4 mm bore) to each port. Compare the free air of cylinder and tubes per cycle.',
      steps: [
        'Cylinder: $(8.04 + 6.91) \\times 5 = 74.8$ cm³ swept, × 7.013/1.013 = 0.52 L.',
        'Tubes: each holds 12.57 mm² × 3000 mm = 37.7 cm³; both together 75.4 cm³, × 6/1.013 = 0.45 L.',
        'Total 0.97 L: the tubes add 86 %.'
      ],
      a: 'The tubes use almost as much air as the cylinder; a valve on the cylinder would save nearly half.'
    },
    {
      title: 'Moving the valve terminal',
      q: 'Twenty 25 mm cylinders (100 mm stroke) cycle 20 times a minute at 6 bar, each with two 4 m tubes of 6 mm (4 mm bore). What do the tubes cost, and what is saved by moving the valves to 0.5 m? Take 6.5 kW per m³/min, 4000 h a year and ¤0.15 per kWh.',
      steps: [
        'Each tube holds 12.57 mm² × 4000 mm = 50.3 cm³; per cycle $2 \\times 50.3 \\times 6/1.013 = 596$ cm³ = 0.60 L; per minute $0.596 \\times 20 \\times 20 = 238$ L/min.',
        'At 0.5 m: 30 L/min. Saving: 208 L/min = 0.21 m³/min.',
        'Power: $0.21 \\times 6.5 = 1.35$ kW; energy $1.35 \\times 4000 = 5400$ kWh; cost ¤810 a year.'
      ],
      a: 'About 0.2 m³/min of free air, 1.35 kW and ¤810 a year — for moving the valves.'
    }
  ],
  quiz: [
    { q: 'Tube air is counted with p_g/p_atm rather than (p_g + p_atm)/p_atm because…', choices: ['the tube is smaller than the cylinder', 'the tube starts each filling full of air at atmospheric pressure; only the difference comes from the compressor', 'tubes do not heat up', 'the valve closes early'], a: 1,
      why: 'After the exhaust the tube still holds its volume of atmospheric air; the filling adds V·p_g/p_atm of free air.' },
    { q: 'A larger tube always makes a cylinder better.', a: false,
      why: 'It lowers the resistance but adds dead volume: more air per stroke and a slower pressure build-up.' },
    { q: 'What volume do 5 m of 8 mm tube with a 6 mm bore hold (cm³)?', answer: 141.4, unit: 'cm³', tol: 0.02,
      why: 'π × 0.6² / 4 × 500 cm = 141 cm³.' },
    { q: 'Where should a valve be mounted for the quickest response and the least air use?', choices: ['in the control cabinet', 'as close to the cylinder as possible', 'next to the compressor', 'it makes no difference'], a: 1,
      why: 'Short tubes mean small dead volume, little series resistance and short signal paths.' },
    { q: 'A pressure signal travels down a 17 m tube in about…', choices: ['5 ms', '50 ms', '0.5 s', 'no time at all'], a: 1,
      why: '17 m / 343 m/s ≈ 50 ms — and the tube must still fill after that.' }
  ],
  problems: [
    { q: 'How much free air does it take to fill two 2 m tubes of 4 mm bore from atmospheric pressure to 6 bar gauge (L)?', answer: 0.298, unit: 'L', tol: 0.03,
      steps: ['Volume: $2 \\times \\pi \\times 0.4^2/4 \\times 200 = 50.3$ cm³.', 'Free air: $50.3 \\times 6/1.013 = 298$ cm³ = 0.30 L.'] }
  ],
  applications: ['Deciding between a central valve terminal and valves distributed on the machine.', 'Choosing tube sizes for each cylinder bore.', 'Air-saving projects: shorter tubes are one of the cheapest savings.', 'Keeping pneumatic logic and pilot lines short for fast response.'],
  sim: 'dyn-tubing'
},

{
  id: 'consumption-budget', parent: 'system-sizing', title: 'An air consumption budget', level: 1,
  short: 'A machine\'s compressed-air demand is the sum of its cylinders, blow-off nozzles, vacuum ejectors, air motors and leaks. The average sets the compressor and the energy bill; the peak sets the pipes, service units and receiver. Blow-offs and leaks usually dominate.',
  keywords: ['air consumption', 'air budget', 'demand', 'average flow', 'peak flow', 'duty cycle', 'blow-off nozzle', 'ejector', 'leakage', 'compressor sizing', 'free air delivery', 'receiver', 'energy cost', 'SCFM'],
  prereq: ['air-consumption', 'standard-air', 'choked-flow', 'fad-capacity'],
  related: ['air-leaks', 'cost-of-compressed-air', 'receiver-sizing', 'ejectors', 'air-saving-circuits', 'artificial-demand', 'air-audits', 'pressure-optimisation', 'sizing-procedure', 'tubing-length-effect'],
  body: `
Before a compressor is bought, a pipe sized or an energy project argued, someone must add up what the machines take. The result is an air budget: a table of consumers with their average and peak flows of free air (ANR, see [[standard-air]]).

### The consumers
- **Cylinders.** Free air per cycle is the swept volume of both strokes times $(p_g + p_\\text{atm})/p_\\text{atm}$, plus the tubes ([[air-consumption]], [[tubing-length-effect]]); multiply by cycles per minute and by the number of cylinders.
- **Blow-off nozzles.** Continuous consumers while open. A hole or nozzle is choked at working pressure, so its flow is $Q = C\\,p_1$ with $C \\approx 0.1\\,d^2$ dm³/(s·bar) for a sharp-edged hole and about $0.13\\,d^2$ for a rounded nozzle ($d$ in mm). One 2 mm nozzle at 6 bar takes about 220 L/min — as much as seven 32 mm cylinders cycling 30 times a minute.
- **Vacuum ejectors.** 20–200 L/min each while they run, whether or not a part is held ([[ejectors]]).
- **Air motors and tools.** Hundreds to over a thousand L/min each while running.
- **Leaks.** Typically 20–30 % of the total in an ordinary plant, sometimes half; they flow day and night ([[air-leaks]]).

### Average and peak
Each consumer runs only part of the time: an ejector on for 40 % of the cycle, a nozzle for 30 %. The **average** flow — each consumer's flow while running times its share of the time — sets the compressor and the electricity bill. The **peak** — the flow when several cylinders fill at once while nozzles blow — sets the supply pipe, the service unit and the valves; it is commonly two to five times the average. A receiver close to the machine bridges the peaks, so the compressor can be sized nearer the average ([[receiver-sizing]]).

The simulation's example machine:

| Consumer | Average | Share |
|---|---|---|
| 4 × 50 mm cylinders, 150 mm stroke, 12 cycles/min | 180 L/min | 29 % |
| 10 × 20 mm cylinders, 50 mm stroke, 30 cycles/min | 60 L/min | 10 % |
| 2 nozzles of 2 mm, open 30 % | 134 L/min | 21 % |
| 4 ejectors of 60 L/min, on 40 % | 96 L/min | 15 % |
| Leaks (25 % of the total) | 157 L/min | 25 % |
| **Total** | **627 L/min** | |

The peak reaches about 2240 L/min, 3.6 times the average. With 25 % reserve the compressor must deliver 0.78 m³/min; at 6.5 kW per m³/min the average demand draws about 4.1 kW — some ¤2,400 a year over 4000 hours at ¤0.15 per kWh.

### From budget to compressor
Add a reserve of 20–30 % for growth and to keep a load/unload compressor from cycling too often, and compare with the compressor's free air delivery at the working pressure ([[fad-capacity]]). Lowering the pressure helps every consumer at once: cylinders and nozzles use air in proportion to absolute pressure, so going from 7 to 6 bar gauge saves 12.5 % ([[pressure-optimisation]]). Budgets on paper miss things; a flow meter in the machine's supply confirms them, and ISO 11011:2013 describes how to assess a whole system ([[air-audits]]).

> [!warn] Blow-off guns are consumers and hazards. Never point one at a person or use it to clean skin or clothes; in the United States OSHA limits cleaning air to 30 psi (about 2 bar) at a blocked nozzle, and safety nozzles with side vents are good practice everywhere. Wear eye and hearing protection.
`,
  ideas: [
    'An air budget adds cylinders, nozzles, ejectors, motors and leaks, each in free air (ANR).',
    'The average sets the compressor and the cost; the peak sets pipes, service units and receivers.',
    'A choked nozzle takes Q = C·p₁; a 2 mm nozzle at 6 bar uses about 220 L/min.',
    'Leaks of 20–30 % are normal and run day and night; blow-offs are often the largest single item.',
    'Consumption is proportional to absolute pressure: 1 bar less saves about an eighth.'
  ],
  pitfalls: [
    'The compressor must supply the peak demand — A receiver bridges short peaks; the compressor is sized for the average plus a reserve.',
    'Leaks only matter while machines run — Leaks flow whenever the system is pressurised, including nights and weekends unless the supply is shut off.',
    'A blow-off nozzle is a small consumer because it is small — A 2 mm nozzle at 6 bar takes about 220 L/min, as much as seven 32 mm cylinders cycling 30 times a minute.'
  ],
  formulas: [
    {
      name: 'Flow of a blow-off nozzle or hole (choked)',
      expr: 'Q = Cd*pi*d^2/4*p1*k0', tex: 'Q = C_d\\,\\dfrac{\\pi d^2}{4}\\,p_1\\,k_0',
      vars: {
        Q: { name: 'free-air flow', q: 'airflow', unit: 'L/min ANR' },
        Cd: { name: 'discharge coefficient (0.6 sharp hole, 0.85 rounded nozzle)', value: 0.85, tex: 'C_d' },
        d: { name: 'nozzle bore', q: 'length', unit: 'mm', value: 2 },
        p1: { name: 'pressure before the nozzle (absolute)', q: 'pressure', unit: 'bar', value: 7.013, tex: 'p_1' },
        k0: { name: 'free air per unit area and pressure of an ideal choked nozzle, air at 20 °C', unit: 's/m', value: 1.992e-3, fixed: true, tex: 'k_0' }
      },
      note: 'Choked whenever the absolute pressure is above about 1.9 bar. k₀ = √(γ/RT)·(2/(γ+1))^((γ+1)/(2(γ−1)))/ρ_ANR.',
      practice: { unknowns: ['Q', 'd'] },
      stories: { Q: 'A blow-off nozzle of {d} bore (discharge coefficient {Cd}) is fed at {p1}. How much free air does it use?', d: 'A nozzle may use at most {Q} at {p1} (Cd = {Cd}). What is the largest bore?' }
    },
    {
      name: 'Average flow of an intermittent consumer',
      expr: 'Q = N*Qon*D', tex: 'Q = N\\,Q_\\text{on}\\,D',
      vars: {
        Q: { name: 'average free-air flow', q: 'airflow', unit: 'L/min ANR' },
        N: { name: 'number of consumers', q: 'count', int: true, value: 4 },
        Qon: { name: 'flow of each while running', q: 'airflow', unit: 'L/min ANR', value: 60, tex: 'Q_\\text{on}' },
        D: { name: 'share of the time running (duty)', q: 'ratio', unit: '%', value: 40 }
      },
      stories: { Q: '{N} vacuum ejectors each take {Qon} while on, and are on {D} of the time. What is their average demand?' }
    },
    {
      name: 'Air flow of a group of cylinders',
      expr: 'Q = N*n*(A1 + A2)*s*(p + patm)/patm', tex: 'Q = N\\,n\\,(A_1 + A_2)\\,s\\,\\dfrac{p_g + p_\\text{atm}}{p_\\text{atm}}',
      vars: {
        Q: { name: 'average free-air flow', q: 'airflow', unit: 'L/min ANR' },
        N: { name: 'number of cylinders', q: 'count', int: true, value: 4 },
        n: { name: 'cycles per minute', q: 'frequency', unit: '1/min', value: 12 },
        A1: { name: 'piston area', q: 'area', unit: 'cm²', value: 19.63, tex: 'A_1' },
        A2: { name: 'annulus area', q: 'area', unit: 'cm²', value: 16.49, tex: 'A_2' },
        s: { name: 'stroke', q: 'length', unit: 'mm', value: 150 },
        p: { name: 'working pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' }
      },
      note: 'Double-acting cylinders; add the tubes (see tube length and dead volume).',
      practice: { unknowns: ['Q', 'n'] },
      stories: { Q: '{N} double-acting cylinders ({A1} piston, {A2} annulus, {s} stroke) cycle {n} at {p}. What is their average demand?' }
    },
    {
      name: 'Compressor capacity',
      expr: 'Qc = Qu*(1 + r)/(1 - fL)', tex: 'Q_c = \\dfrac{Q_u\\,(1 + r)}{1 - f_L}',
      vars: {
        Qc: { name: 'compressor free air delivery needed', q: 'airflow', unit: 'm³/min ANR', tex: 'Q_c' },
        Qu: { name: 'average demand of the users', q: 'airflow', unit: 'L/min ANR', value: 470, tex: 'Q_u' },
        r: { name: 'reserve', q: 'ratio', unit: '%', value: 25 },
        fL: { name: 'leaks as a share of the total', q: 'ratio', unit: '%', value: 25, min: 0, max: 90, tex: 'f_L' }
      },
      practice: { unknowns: ['Qc', 'fL'] },
      stories: { Qc: 'The users of a plant take {Qu} on average; leaks are {fL} of the total and a reserve of {r} is wanted. What compressor capacity is needed?' }
    }
  ],
  examples: [
    {
      title: 'Budget for a small machine',
      q: 'Add up the machine in the table: 180 L/min of large cylinders, 60 L/min of small ones, two 2 mm nozzles open 30 % of the time, four 60 L/min ejectors on 40 %, leaks 25 % of the total, 25 % reserve.',
      steps: [
        'Nozzles: $0.85 \\times \\pi \\times 0.002^2/4 \\times 7.013\\times10^5 \\times 1.992\\times10^{-3} = 3.73\\times10^{-3}$ m³/s = 224 L/min each; two at 30 %: 134 L/min.',
        'Ejectors: $4 \\times 60 \\times 0.4 = 96$ L/min.',
        'Users: $180 + 60 + 134 + 96 = 470$ L/min; with leaks at 25 % of the total: $470/0.75 = 627$ L/min.',
        'Compressor: $627 \\times 1.25 = 783$ L/min = 0.78 m³/min.'
      ],
      a: 'About 630 L/min on average and a compressor of 0.8 m³/min; the nozzles and leaks together are almost half.'
    },
    {
      title: 'Nozzle against cylinder',
      q: 'Compare one 2 mm rounded nozzle open 30 % of the time with a 32 mm × 100 mm cylinder cycling 30 times a minute, both at 6 bar.',
      steps: ['Nozzle: $224 \\times 0.3 = 67$ L/min.', 'Cylinder: about 1.04 L per cycle × 30 = 31 L/min ([[pneumatic-cylinder]]).'],
      a: 'The little nozzle, open less than a third of the time, uses twice as much as the working cylinder.'
    },
    {
      title: 'One bar less',
      q: 'The machine\'s pressure is lowered from 6 to 5 bar gauge. By how much do its cylinders and nozzles consume less?',
      steps: ['Both are proportional to absolute pressure.', '$6.013/7.013 = 0.857$: 14 % less.'],
      a: 'About 14 % — if every drive still has enough force at 5 bar.'
    }
  ],
  quiz: [
    { q: 'Which demand sets the size of the compressor?', choices: ['the peak', 'the average, plus a reserve', 'the demand of the largest cylinder', 'the leaks alone'], a: 1,
      why: 'A receiver bridges short peaks; the compressor must keep up with the average demand with some reserve.' },
    { q: 'A 3 mm sharp-edged hole (C ≈ 0.9 dm³/(s·bar)) leaks from 6 bar gauge. How much free air is lost (L/min)?', answer: 379, unit: 'L/min', tol: 0.03,
      why: 'Choked: Q = C·p₁ = 0.9 × 7.013 = 6.31 dm³/s = 379 L/min.' },
    { q: 'Leaks only matter while the machines are running.', a: false,
      why: 'Leaks flow whenever the network is under pressure — nights and weekends included, unless the supply is shut off.' },
    { q: 'Users take 600 L/min; leaks are 25 % of the total. What is the total (L/min)?', answer: 800, unit: 'L/min', tol: 0.02,
      why: 'The users are the remaining 75 %: 600/0.75 = 800 L/min.' },
    { q: 'Lowering the working pressure from 7 to 6 bar gauge reduces a nozzle\'s consumption by about…', choices: ['1/7', '12.5 %', '50 %', 'nothing, the nozzle is choked'], a: 1,
      why: 'Choked flow is proportional to the absolute pressure: 7.013/8.013 = 0.875, 12.5 % less.' }
  ],
  problems: [
    { q: 'Users need 1.2 m³/min; leaks are 20 % of the total and a 20 % reserve is wanted. What compressor capacity is needed (m³/min)?', answer: 1.8, unit: 'm³/min', tol: 0.02,
      steps: ['With leaks: $1.2/0.8 = 1.5$ m³/min.', 'With reserve: $1.5 \\times 1.2 = 1.8$ m³/min.'] }
  ],
  applications: ['Specifying a compressor and receiver for a new line.', 'Finding the biggest consumers before an energy-saving project.', 'Sizing the supply pipe and service unit of a machine for its peak flow.', 'Checking a machine builder\'s air-consumption figure.'],
  history: 'Air budgets grew from rules of thumb into a discipline with the energy audits of the 1990s and 2000s, when plants discovered that compressed air could take a tenth of their electricity. ISO 11011:2013 now sets out how to assess a compressed-air system from the users back to the compressors.',
  sim: 'dyn-air-budget'
}

);
