/* HYPER-PNEUMATICS · content/function-control.js — function valves (non-return, speed controllers,
 * quick exhaust, shuttle and two-pressure valves, time delay, pressure switches) and basic control
 * circuits (direct and indirect control, speed control, logic, memory, pressure-dependent control).
 * Simulations in sims/function-control.js (fv-…). */
Hyper.add(

/* ================================================================ FUNCTION VALVES */
{
  id: 'check-valves-pneu', parent: 'function-valves', title: 'Non-return valves', level: 1,
  short: 'A valve that lets air through one way and shuts the other: a ball, disc or lip pushed off its seat by the flow and pressed back onto it by the reverse pressure. It opens only above its cracking pressure and costs a pressure drop when it passes air.',
  keywords: ['non-return valve', 'check valve', 'one-way valve', 'cracking pressure', 'ball check', 'pilot-operated check valve', 'poppet', 'lip seal', 'back-flow'],
  prereq: ['way-valves', 'sonic-conductance', 'physics:pressure'],
  related: ['flow-control-pneu', 'quick-exhaust', 'shuttle-valve', 'time-delay-valve', 'receivers', 'vacuum-circuits', 'hydraulics:check-valves', 'hydraulics:pilot-check'],
  body: `
A non-return valve is the simplest valve there is: a closing element — a ball, a disc, a poppet or a flexible lip — held against a seat. Air pushing from one side lifts it and flows through; air trying to come back presses it harder onto the seat. It needs no signal and no actuator, which is why it hides inside so many other components: the one-way flow control, the quick-exhaust valve, the time-delay valve and the compressor's discharge line all rely on one.

### Cracking pressure: the price of a spring
Many non-return valves have a light spring so that they close positively in any position and do not chatter. The spring must be pushed open, so the valve only starts to pass air once the pressure difference exceeds its **cracking pressure**,

$$p_c = \\frac{F_s}{\\pi d^2/4}$$

where $F_s$ is the spring preload and $d$ the seat diameter. Half a newton on a 5 mm seat gives 0.25 bar. Typical values:

| Type | Cracking pressure | Where |
|---|---|---|
| Springless disc or lip | 0.01–0.05 bar | vacuum lines, low-loss return paths |
| Light spring (ball or poppet) | 0.1–0.5 bar | flow controls, general lines |
| Stiff spring | 0.5–5 bar | holding a minimum pressure, a crude pressure valve |

A spring-loaded valve therefore always leaves the downstream side a little below the upstream side, and a line vented through a check valve keeps its cracking pressure trapped.

### Flow once open
When open, the valve is a restriction like any other and is rated by its sonic conductance $C$ and critical pressure ratio $b$ (see [[sonic-conductance]]). In the subsonic range the ISO 6358-1:2013 relation gives the flow for a given pressure drop — or the drop for a given flow. A valve with $C = 3$ dm³/(s·bar) passing 600 L/min of free air at 6 bar gauge loses about 0.55 bar: small in a supply line, large enough to matter in the exhaust path of a fast cylinder.

### Where they are used
- **Compressor to receiver:** the discharge check valve keeps the receiver from blowing back through the compressor when it stops or unloads (see [[receivers]]).
- **Inside function valves:** in parallel with a throttle to make a one-way flow control ([[flow-control-pneu]]); as the moving element of [[quick-exhaust]] and [[shuttle-valve|shuttle]] valves; as the fast reset path of a [[time-delay-valve]].
- **Vacuum:** a springless check between cup and generator holds the vacuum if the generator stops (see [[vacuum-circuits]]).
- **Pilot-operated non-return valves:** a pilot signal can hold the valve open against the reverse flow. Two of them in the cylinder lines lock a cylinder in position when the valve is centred or the air fails — the pneumatic cousin of the [[hydraulics:pilot-check|hydraulic pilot check]]. Air is springy, though: a locked pneumatic cylinder still gives way under a changing load, and any seal leak lets it creep.

> [!key] A non-return valve decides the direction of flow by itself: free one way above its cracking pressure, shut the other way. It is always a restriction too.

> [!warn] Non-return valves trap air. A line or a cylinder behind a check valve can stay pressurised after the supply has been shut off and exhausted — and a pilot-operated check valve holding a cylinder will release it when the pilot is pressurised. Before opening a fitting, exhaust every section of the circuit, check the gauges, support any load, and never point a released line at a person.
`,
  ideas: [
    'Flow lifts the closing element off its seat one way; reverse pressure presses it on harder.',
    'A spring gives positive closing but a cracking pressure: p_c = spring force ÷ seat area, typically 0.1–0.5 bar.',
    'Open, the valve is a restriction rated like any other by C and b (ISO 6358).',
    'Non-return valves hide inside flow controls, quick-exhaust, shuttle and time-delay valves and compressor outlets.',
    'Air trapped behind a check valve stays under pressure after the supply is exhausted.'
  ],
  pitfalls: [
    'A non-return valve has no pressure drop when open — It is a restriction like any other; at high flow it can lose half a bar, and its cracking pressure is lost as well.',
    'Two pilot-operated check valves hold a pneumatic cylinder rigidly — The trapped air is a spring: the rod moves when the load changes, and slowly creeps if a seal leaks.',
    'Shutting the supply makes the whole circuit safe — Sections behind non-return valves keep their pressure until they are exhausted separately.'
  ],
  formulas: [
    {
      name: 'Cracking pressure of a spring-loaded valve',
      expr: 'pc = Fs/(pi*d^2/4)', tex: 'p_c = \\dfrac{F_s}{\\pi d^2/4}',
      vars: {
        pc: { name: 'cracking pressure (difference across the valve)', q: 'pressure', unit: 'bar', tex: 'p_c' },
        Fs: { name: 'spring preload', q: 'force', unit: 'N', value: 0.5, tex: 'F_s' },
        d: { name: 'seat diameter', q: 'length', unit: 'mm', value: 5 }
      },
      note: 'The pressure difference at which the closing element just lifts. The spring is compressed further as the valve opens, so the drop grows a little with flow.',
      stories: { pc: 'A check valve has a spring preload of {Fs} on a seat of {d}. At what pressure difference does it start to open?', Fs: 'A check valve with a seat of {d} must crack at {pc}. What spring preload does it need?' }
    },
    {
      name: 'Flow through the open valve (ISO 6358, subsonic)',
      expr: 'Q = C*p1*sqrt(1 - ((p2/p1 - b)/(1 - b))^2)', tex: 'Q = C\\,p_1\\sqrt{1 - \\left(\\dfrac{p_2/p_1 - b}{1 - b}\\right)^2}',
      vars: {
        Q: { name: 'free-air flow', q: 'airflow', unit: 'L/min ANR' },
        C: { name: 'sonic conductance of the valve', q: 'flowcond', unit: 'dm³/(s·bar)', value: 2 },
        p1: { name: 'inlet pressure (absolute)', q: 'pressure', unit: 'bar', value: 7, tex: 'p_1' },
        p2: { name: 'outlet pressure (absolute)', q: 'pressure', unit: 'bar', value: 6.8, min: 0.5, max: 20, tex: 'p_2' },
        b: { name: 'critical pressure ratio', value: 0.3, min: 0.05, max: 0.8 }
      },
      note: 'Valid for p₂/p₁ > b and air at 20 °C. At or below p₂/p₁ = b the flow is choked: Q = C·p₁. Pressures absolute.',
      practice: { unknowns: ['Q', 'p2'] },
      stories: { Q: 'A non-return valve with C = {C} and b = {b} has {p1} at its inlet and {p2} at its outlet. How much free air passes?', p2: 'A non-return valve (C = {C}, b = {b}) passes {Q} with {p1} at its inlet. What is the outlet pressure?' }
    }
  ],
  examples: [
    {
      title: 'Choosing a spring',
      q: 'A non-return valve with a 6 mm seat must close reliably when mounted upside down, so it gets a spring with a preload of 1.2 N. What is its cracking pressure?',
      steps: [
        'Seat area: $\\pi \\times 0.006^2/4 = 2.83\\times10^{-5}$ m².',
        '$p_c = 1.2/2.83\\times10^{-5} = 42\\,400$ Pa = 0.42 bar.'
      ],
      a: 'About 0.42 bar — the downstream side never gets closer than that to the upstream pressure.'
    },
    {
      title: 'The pressure a check valve costs',
      q: 'A non-return valve with $C = 3$ dm³/(s·bar) and $b = 0.35$ passes 600 L/min of free air from a 6 bar gauge supply (7.013 bar absolute). What is the pressure after it?',
      steps: [
        'Choked flow would be $C\\,p_1 = 3\\times10^{-8} \\times 7.013\\times10^5 = 0.021$ m³/s = 1262 L/min; 600 L/min is 47.5 % of it.',
        'So $\\sqrt{1 - u^2} = 0.475$, $u^2 = 0.774$, $u = 0.880$, where $u = (p_2/p_1 - b)/(1 - b)$.',
        '$p_2/p_1 = 0.35 + 0.880 \\times 0.65 = 0.922$, so $p_2 = 6.47$ bar absolute.'
      ],
      a: 'About 6.47 bar absolute (5.45 bar gauge): the valve costs about 0.55 bar at this flow.'
    }
  ],
  quiz: [
    { q: 'A non-return valve has a 2 N spring preload on an 8 mm seat. What is its cracking pressure?', answer: 0.40, unit: 'bar', tol: 0.03,
      why: 'Seat area π × 0.008²/4 = 5.03×10⁻⁵ m²; 2/5.03×10⁻⁵ = 39 800 Pa ≈ 0.40 bar.' },
    { q: 'Why is a non-return valve fitted between a compressor and its receiver?', choices: ['To filter the air', 'So the receiver cannot blow back through the compressor when it stops or unloads', 'To lower the pressure', 'To cool the air'], a: 1,
      why: 'Without it the stored air would flow back through the compressor, which could then not start unloaded; the receiver would empty through it.' },
    { q: 'A machine\'s supply is shut off and exhausted at the service unit. Every line of the machine is now at atmospheric pressure.', a: false,
      why: 'Sections behind non-return valves (including those inside flow controls, pilot checks and quick-exhaust valves) can keep their pressure; they have to be exhausted separately.' },
    { q: 'A cylinder is locked mid-stroke by two pilot-operated non-return valves. A load is then added to the rod. What happens?', choices: ['Nothing: the cylinder is rigid', 'The rod gives way a little, because the trapped air is compressed until the pressures balance the new load', 'The check valves open', 'The cylinder extends'], a: 1,
      why: 'Trapped air is a spring. The rod moves until the change in chamber pressures balances the load — and any leak lets it creep further.' }
  ],
  problems: [
    { q: 'A check valve with $C = 2$ dm³/(s·bar) and $b = 0.3$ has 7.0 bar absolute at its inlet and 6.8 bar absolute at its outlet. How much free air passes?', answer: 238, unit: 'L/min', tol: 0.03,
      steps: ['$p_2/p_1 = 0.971$; $u = (0.971 - 0.3)/0.7 = 0.959$; $\\sqrt{1 - u^2} = 0.283$.', '$Q = 2\\times10^{-8} \\times 7\\times10^5 \\times 0.283 = 3.96\\times10^{-3}$ m³/s = 238 L/min of free air.'] }
  ],
  applications: ['The discharge line of every compressor feeding a receiver.', 'One-way flow controls screwed into cylinder ports.', 'Holding vacuum at a suction cup when the generator stops.', 'Pilot-operated check valves that hold a cylinder in place if the air fails.'],
  history: 'Nikola Tesla patented a "valvular conduit" in 1920: a channel of loops and pockets with no moving parts that passes a fluid far more easily one way than the other. It is still studied in microfluidics, but a ball on a seat remains the everyday answer.'
},

{
  id: 'flow-control-pneu', parent: 'function-valves', title: 'Speed controllers: meter-in and meter-out', level: 2,
  short: 'A one-way flow control — an adjustable throttle with a non-return valve beside it — slows a cylinder by restricting the air in one direction only. Throttling the air that leaves (meter-out) is the rule for double-acting cylinders; throttling the air that enters (meter-in) suits single-acting cylinders and small volumes.',
  keywords: ['one-way flow control', 'speed controller', 'meter-out', 'meter-in', 'throttle', 'needle valve', 'banjo flow control', 'back-pressure', 'cylinder speed', 'stick-slip', 'runaway load'],
  prereq: ['check-valves-pneu', 'double-acting-cylinders', 'cylinder-speed-pneu', 'sonic-conductance'],
  related: ['speed-control-circuits', 'quick-exhaust', 'pneumatic-cushioning', 'stick-slip', 'cylinder-motion', 'soft-start', 'single-acting-cylinders', 'hydraulics:meter-in-out', 'hydraulics:flow-control'],
  body: `
A pneumatic cylinder left to itself runs as fast as its valve and tubes allow — often far too fast. The usual brake is a **one-way flow control**: an adjustable throttle (a needle or a tapered slot) with a non-return valve in parallel. Air passing in the free direction lifts the check and bypasses the throttle; air going the other way must squeeze through the throttle. Most are "banjo" fittings screwed straight into the cylinder port, one per port.

### Meter-out: the rule for double-acting cylinders
Fit the flow controls so that the air **enters freely** and must **leave through the throttle**. Then the driving chamber fills to nearly the supply pressure while the exhausting chamber holds a back-pressure: the piston rides between two air cushions. The consequences are all good:

- **The speed hardly depends on the load.** While the throttle is choked (exhaust chamber above about $p_\\text{atm}/b$, 3.4 bar absolute), the volume of air it passes, measured at the chamber pressure, is fixed: $v = C\\,p_\\text{ref}/A$. A heavier or lighter load changes the pressures, not the speed.
- **Aiding loads are held.** A load that pulls the rod along — a vertical cylinder lowering a weight — is braked by the back-pressure.
- **Friction changes are absorbed.** A tight spot in a guide makes the piston pause briefly; when it frees, the compressed exhaust cushion stops it lurching forward.

The costs: the cylinder starts later (the exhausting chamber must blow down first), the first stroke after pressurising is uncontrolled if the exhaust side starts empty (see [[soft-start]]), and more air is thrown away at a higher pressure.

### Meter-in: when it is the right choice
Throttling the incoming air leaves the exhausting side at atmospheric pressure. The driving chamber sits just above the pressure the load needs, so the chamber is soft: a small change in load or friction changes the speed a lot ($v = C\\,p_1\\,p_\\text{ref}/(p_\\text{atm}A + F)$ while choked), a friction patch stalls it and the air it has stored then throws it forward, and an aiding load runs away. Yet meter-in is correct for a **single-acting cylinder**, whose only port must be throttled on the way in to slow the extension; for **small volumes** such as short-stroke clamps and grippers; and wherever an exhaust back-pressure must be avoided.

| | Meter-out | Meter-in |
|---|---|---|
| Speed vs load | nearly independent (choked) | falls as the load rises |
| Aiding load | held by back-pressure | runs away |
| Friction changes | absorbed | stall, then lurch |
| Start delay | longer | shorter |
| Typical use | double-acting cylinders | single-acting cylinders, small volumes |

> [!tip] Rule of thumb: throttle the exhaust of a double-acting cylinder, one flow control per port, as close to the cylinder as possible. Below roughly 20–50 mm/s either method starts to judder (see [[stick-slip]]).

> [!warn] A cylinder whose exhausting chamber is empty — after the air has been off — makes its first stroke with no meter-out control and can jump at full speed. Keep hands out of the stroke and use a soft-start valve when pressurising a machine.
`,
  ideas: [
    'A one-way flow control is a throttle with a check valve beside it: free one way, throttled the other.',
    'Meter-out throttles the air leaving the cylinder; the piston rides between two air cushions.',
    'While the exhaust throttle is choked, meter-out speed is v = C·p_ref/A, independent of the load.',
    'Meter-in speed depends on the load, stalls and lurches on friction changes, and cannot hold an aiding load.',
    'Meter-in is right for single-acting cylinders and small volumes; meter-out is the rule otherwise.'
  ],
  pitfalls: [
    'Meter-in and meter-out are the same thing done in a different place — The check valve\'s direction decides which air is throttled, and the behaviour is completely different: meter-in speed follows the load, meter-out speed does not.',
    'Closing the throttle further always gives a smoother, slower motion — Below a few centimetres a second the seal friction takes over and the piston moves in jerks (stick-slip); low-friction cylinders or other drives are needed.',
    'One flow control in the supply line to the valve slows both strokes nicely — It throttles the incoming air of both strokes (meter-in) and starves the valve; throttle the exhausts at the cylinder, or in the valve\'s exhaust ports.'
  ],
  formulas: [
    {
      name: 'Meter-out speed while the throttle is choked',
      expr: 'v = C*pref/A', tex: 'v = \\dfrac{C\\,p_\\text{ref}}{A}',
      vars: {
        v: { name: 'piston speed', q: 'speed', unit: 'm/s' },
        C: { name: 'sonic conductance of the exhaust path (throttle and valve in series)', q: 'flowcond', unit: 'dm³/(s·bar)', value: 0.15 },
        pref: { name: 'reference pressure (ISO 8778, absolute)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_\\text{ref}' },
        A: { name: 'area of the exhausting chamber', q: 'area', unit: 'cm²', value: 6.91 }
      },
      note: 'Choked flow through the exhaust: the mass flow is C·p·ρ₀, so the volume at the chamber pressure p is C·p_ref, whatever p is (air at 20 °C). Valid while the exhausting chamber stays above about p_atm/b; extending, A is the annulus.',
      practice: { unknowns: ['v', 'C'] },
      stories: { v: 'A cylinder extends under meter-out control; its annulus is {A} and the throttle and valve together have C = {C}. How fast does it run?', C: 'A cylinder with an annulus of {A} must extend at {v} under meter-out control. What conductance must the exhaust path have?' }
    },
    {
      name: 'Meter-in speed while the throttle is choked',
      expr: 'v = C*p1*pref/(patm*A + F)', tex: 'v = \\dfrac{C\\,p_1\\,p_\\text{ref}}{p_\\text{atm}A + F}',
      vars: {
        v: { name: 'piston speed', q: 'speed', unit: 'm/s' },
        C: { name: 'sonic conductance of the supply path (throttle and valve)', q: 'flowcond', unit: 'dm³/(s·bar)', value: 0.03 },
        p1: { name: 'supply pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.013, tex: 'p_1' },
        pref: { name: 'reference pressure (ISO 8778, absolute)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_\\text{ref}' },
        patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' },
        A: { name: 'area of the driving chamber', q: 'area', unit: 'cm²', value: 8.04 },
        F: { name: 'load plus friction', q: 'force', unit: 'N', value: 100 }
      },
      note: 'The exhaust is free (at atmospheric pressure), so the driving chamber holds p_atm + F/A absolute; the choked inflow C·p₁·ρ₀ fills it at that pressure. Valid while p_atm + F/A ≤ b·p₁ (about 1 bar gauge at a 6 bar supply). The speed falls as the load rises.',
      practice: { unknowns: ['v', 'F'] },
      stories: { v: 'A cylinder with a piston area of {A} is driven under meter-in control through C = {C} from {p1} against {F}. How fast does it move?' }
    }
  ],
  examples: [
    {
      title: 'Setting a meter-out throttle',
      q: 'A 32 mm cylinder with a 12 mm rod must extend at 0.2 m/s under meter-out control. Its valve has $C = 1.2$ dm³/(s·bar). What conductance must the throttle have?',
      steps: [
        'Exhausting area when extending: the annulus, $A_2 = \\pi(0.032^2 - 0.012^2)/4 = 6.91$ cm².',
        'Exhaust path: $C = v\\,A/p_\\text{ref} = 0.2 \\times 6.91\\times10^{-4}/10^5 = 1.38\\times10^{-9}$ m³/(s·Pa) = 0.138 dm³/(s·bar).',
        'Valve and throttle in series: $1/C_t^2 = 1/0.138^2 - 1/1.2^2 = 52.5 - 0.7$, so $C_t = 0.139$ dm³/(s·bar).'
      ],
      a: 'About 0.14 dm³/(s·bar): the throttle sets the speed almost alone; the valve hardly matters once the throttle is this small.'
    },
    {
      title: 'Why meter-in follows the load',
      q: 'The same cylinder (piston area 8.04 cm²) is instead run under meter-in control through $C = 0.03$ dm³/(s·bar) from 6 bar gauge. How fast does it extend against 100 N, and against 300 N? What would meter-out do?',
      steps: [
        'Numerator: $C\\,p_1\\,p_\\text{ref} = 0.03\\times10^{-8} \\times 7.013\\times10^5 \\times 10^5 = 21.0$.',
        'Against 100 N: $v = 21.0/(1.013\\times10^5 \\times 8.04\\times10^{-4} + 100) = 21.0/181 = 0.116$ m/s.',
        'Against 300 N: $v = 21.0/381 = 0.055$ m/s — less than half.',
        'Under meter-out with a choked throttle the speed is $C\\,p_\\text{ref}/A$ in both cases: the load only changes the pressures.'
      ],
      a: '0.116 m/s against 100 N but 0.055 m/s against 300 N; meter-out would hold the same speed for both.'
    }
  ],
  quiz: [
    { q: 'A double-acting cylinder extends under meter-out control. Which air passes through a throttle?', choices: ['The air entering the cap end', 'The air leaving the rod end', 'Both', 'Neither: the valve sets the speed'], a: 1,
      why: 'Meter-out throttles the exhausting chamber — the rod end while extending. The air entering the cap end passes freely through the check valve.' },
    { q: 'A 50 mm cylinder with a 20 mm rod extends under meter-out control with an exhaust-path conductance of 0.1 dm³/(s·bar). What speed does it reach while the throttle is choked?', answer: 0.061, unit: 'm/s', tol: 0.03,
      why: 'A₂ = π(0.05² − 0.02²)/4 = 16.5 cm²; v = 10⁻⁹ × 10⁵ / 1.65×10⁻³ = 0.061 m/s.' },
    { q: 'With a choked meter-out throttle, doubling the load on the cylinder roughly halves its speed.', a: false,
      why: 'The choked throttle passes a fixed volume at the chamber pressure, C·p_ref, so the speed stays the same; the load changes the chamber pressures instead (until the driving pressure runs out).' },
    { q: 'A single-acting cylinder must extend slowly and return quickly. How is its one-way flow control fitted?', choices: ['Throttling the air entering (meter-in), free flow out', 'Throttling the air leaving, free flow in', 'In the valve\'s supply port', 'It cannot be done'], a: 0,
      why: 'A single-acting cylinder has only one working port; to slow the extension the incoming air must be throttled, and the return air should pass the check freely.' },
    { q: 'A vertical cylinder lowers a heavy load (the load pulls the rod out). Which control keeps the descent steady?', choices: ['Meter-in on the cap end', 'Meter-out on the rod end', 'A quick-exhaust valve on the rod end', 'No flow control'], a: 1,
      why: 'Only a back-pressure in the exhausting (rod) chamber can hold an aiding load; meter-in lets it run away.' }
  ],
  problems: [
    { q: 'A 63 mm cylinder (20 mm rod) must retract at 0.25 m/s under meter-out control. What conductance must the exhaust path of the cap end have?', answer: 0.779, unit: 'dm³/(s·bar)', tol: 0.03,
      hint: 'Retracting, the cap end exhausts: use the full piston area.',
      steps: ['$A_1 = \\pi \\times 0.063^2/4 = 31.2$ cm².', '$C = v A/p_\\text{ref} = 0.25 \\times 3.117\\times10^{-3}/10^5 = 7.79\\times10^{-9}$ m³/(s·Pa) = 0.779 dm³/(s·bar).'] }
  ],
  applications: ['Every double-acting cylinder on a production line, set with a screwdriver at commissioning.', 'Vertical lifts and doors, where the back-pressure holds a descending load.', 'Grippers and short-stroke clamps, often meter-in.', 'Rotary actuators and swivel units, where the end-position impact must be tamed.'],
  sim: 'fv-meter'
},

{
  id: 'quick-exhaust', parent: 'function-valves', title: 'Quick-exhaust valves', level: 2,
  short: 'A valve screwed into a cylinder port that lets the chamber exhaust straight into the room through its own large port, instead of back through the tube and the directional valve — a cheap way to speed up a stroke when the exhaust path is the bottleneck.',
  keywords: ['quick-exhaust valve', 'QEV', 'quick exhaust', 'cylinder speed', 'exhaust', 'long tubes', 'single-acting return', 'conductance in series'],
  prereq: ['flow-control-pneu', 'cylinder-speed-pneu', 'conductance-series'],
  related: ['check-valves-pneu', 'speed-control-circuits', 'valve-sizing', 'tubing-length-effect', 'noise-silencers', 'pneumatic-cushioning', 'kinetic-energy-limits'],
  body: `
A cylinder that must move fast is often held back not by the air coming in but by the air that has to get out. With the directional valve on a manifold a few metres away, the exhausting chamber must push all its air back through a long tube and the valve's exhaust port. A **quick-exhaust valve** (QEV) short-circuits that path. Screwed into the cylinder port, it has three ports: 1 from the valve, 2 to the cylinder, and a large exhaust 3.

### How it works
Inside is a disc or lip that behaves like two non-return valves back to back. When the directional valve pressurises port 1, the disc is pushed onto the exhaust seat and air flows 1 → 2 into the cylinder. When port 1 is vented, the pressure in the cylinder pushes the disc the other way, onto the inlet seat: 1 is shut and the cylinder air rushes out through 3, right at the cylinder. Only the air in the tube returns through the valve, and it no longer delays the piston.

### How much faster?
Restrictions in series add as $1/C^2 = 1/C_1^2 + 1/C_2^2$ (see [[conductance-series]]). A valve of $C = 1.0$ dm³/(s·bar) with 3 m of 6 mm tubing ($C \\approx 0.8$) gives an exhaust path of only 0.62. A 50 mm cylinder with a 300 mm stroke that is exhaust-limited then takes about $t = A\\,s/(C\\,p_\\text{ref}) = 0.79$ s to extend. With a QEV of $C = 3$ on the rod end, the exhaust would allow 0.16 s: the stroke becomes limited by the incoming air instead, and in the simulation it drops from about 0.93 s to 0.33 s.

The gain is largest when
- the valve is small or far away (long, thin tubes);
- the stroke and bore are large, so there is a lot of air to move;
- a **single-acting cylinder** must return quickly: its spring is weak and must push the air out through the whole line otherwise.

It is small, or even negative, when the valve is large and close: the incoming air must also pass through the QEV, which adds a restriction to the filling side.

### Things to watch
- **No meter-out on that port.** A flow control between the directional valve and the QEV throttles only the incoming air; the exhaust bypasses it. Speed control and a QEV on the same port do not mix.
- **Harder end-stop impacts.** A faster piston carries more kinetic energy into the end cap: check the cushioning and [[kinetic-energy-limits]].
- **Noise and oil mist at the machine.** The exhaust now leaves at the cylinder: fit a silencer to port 3 (see [[noise-silencers]]).
- **Air saving.** When the tube no longer has to be exhausted through the valve, a QEV can be combined with pressure-reduced return strokes in [[air-saving-circuits]].

> [!warn] A quick-exhaust valve makes cylinders faster and the blast from port 3 louder: fit a silencer, keep the port pointing away from people, and check that the faster stroke is still guarded and cushioned.
`,
  ideas: [
    'A QEV vents a cylinder chamber straight to the room at the cylinder port instead of back through tube and valve.',
    'Inside, a disc seals the exhaust while air flows 1 → 2, and seals the inlet while the cylinder vents 2 → 3.',
    'Restrictions in series add as 1/C² — a long tube can halve the exhaust path of a good valve.',
    'The gain is largest with small or distant valves, long strokes and single-acting returns; small with a big nearby valve.',
    'A flow control upstream of a QEV cannot meter the exhaust.'
  ],
  pitfalls: [
    'A quick-exhaust valve speeds up any cylinder — Only where the exhaust path was the bottleneck; with a large valve close to the cylinder it gains nothing and adds a restriction to the filling side.',
    'A meter-out flow control can be kept between the valve and the QEV — The exhausting air leaves through port 3 at the cylinder and never passes the throttle; that stroke becomes uncontrolled.',
    'To speed up the extension, fit the QEV on the cap end — The cap end is the filling side when extending; the QEV must be on the rod end, whose air is exhausted.'
  ],
  formulas: [
    {
      name: 'Restrictions in series',
      expr: 'C = 1/sqrt(1/C1^2 + 1/C2^2)', tex: 'C = \\dfrac{1}{\\sqrt{1/C_1^2 + 1/C_2^2}}',
      vars: {
        C: { name: 'sonic conductance of the path', q: 'flowcond', unit: 'dm³/(s·bar)' },
        C1: { name: 'sonic conductance of the directional valve', q: 'flowcond', unit: 'dm³/(s·bar)', value: 1, tex: 'C_1' },
        C2: { name: 'sonic conductance of the tube', q: 'flowcond', unit: 'dm³/(s·bar)', value: 0.8, tex: 'C_2' }
      },
      note: 'The usual approximation for elements in series (ISO 6358-3 gives the full method, including the combined b). The smallest element dominates.',
      stories: { C: 'A valve with C = {C1} feeds a cylinder through a tube with C = {C2}. What is the conductance of the path?', C1: 'The path through a tube (C = {C2}) must reach C = {C}. What valve conductance is needed?' }
    },
    {
      name: 'Stroke time when the exhaust is the bottleneck',
      expr: 't = A*s/(C*pref)', tex: 't = \\dfrac{A\\,s}{C\\,p_\\text{ref}}',
      vars: {
        t: { name: 'stroke time (excluding the start delay)', q: 'time', unit: 's' },
        A: { name: 'area of the exhausting chamber', q: 'area', unit: 'cm²', value: 16.49 },
        s: { name: 'stroke', q: 'length', unit: 'mm', value: 300 },
        C: { name: 'sonic conductance of the exhaust path', q: 'flowcond', unit: 'dm³/(s·bar)', value: 0.625 },
        pref: { name: 'reference pressure (ISO 8778, absolute)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_\\text{ref}' }
      },
      note: 'While the exhaust is choked it passes a volume C·p_ref per second at the chamber pressure. Once the exhaust is fast (a QEV), the filling side limits the speed instead, so the real gain is smaller than the ratio of the conductances.',
      practice: { unknowns: ['t', 'C'] },
      stories: { t: 'A cylinder exhausts an annulus of {A} over a stroke of {s} through an exhaust path of C = {C}. How long does the stroke take, if the exhaust limits it?' }
    }
  ],
  examples: [
    {
      title: 'A valve at the end of long tubes',
      q: 'A 50 mm cylinder (20 mm rod, 300 mm stroke) is driven by a valve with $C = 1.0$ dm³/(s·bar) through 3 m of 6 mm tube ($C \\approx 0.8$). Estimate the exhaust-limited extension time with and without a QEV ($C = 3$) on the rod end.',
      steps: [
        'Exhaust path without a QEV: $C = 1/\\sqrt{1/1^2 + 1/0.8^2} = 0.62$ dm³/(s·bar).',
        'Annulus: $A_2 = \\pi(0.05^2 - 0.02^2)/4 = 16.5$ cm².',
        'Without: $t = 16.5\\times10^{-4} \\times 0.3/(0.62\\times10^{-8} \\times 10^5) = 0.79$ s.',
        'With the QEV the exhaust alone would allow $t = 16.5\\times10^{-4} \\times 0.3/(3\\times10^{-8} \\times 10^5) = 0.16$ s; the incoming air now limits the stroke, which the simulation puts at about 0.33 s.'
      ],
      a: 'About 0.8 s without and roughly 0.3 s with the QEV — a stroke more than twice as fast for a fitting that costs little.'
    }
  ],
  quiz: [
    { q: 'Where must a quick-exhaust valve be mounted to work well?', choices: ['At the directional valve\'s exhaust port', 'Directly at the cylinder port', 'In the supply line', 'Anywhere in the cylinder line'], a: 1,
      why: 'Its point is to vent the chamber where it is, without the air travelling back through the tube; mounted far away, the tube is still in the exhaust path.' },
    { q: 'To make a double-acting cylinder extend faster, the quick-exhaust valve goes on…', choices: ['the cap end', 'the rod end', 'the valve\'s port 1', 'the supply'], a: 1,
      why: 'Extending, the rod end exhausts; that is the air the QEV should release.' },
    { q: 'What is the conductance of a valve (1.2 dm³/(s·bar)) and a tube (0.9 dm³/(s·bar)) in series?', answer: 0.72, unit: 'dm³/(s·bar)', tol: 0.02,
      why: '1/C² = 1/1.44 + 1/0.81 = 0.694 + 1.235 = 1.929, so C = 0.72.' },
    { q: 'A one-way flow control fitted between the directional valve and a quick-exhaust valve still sets the exhaust speed of that chamber.', a: false,
      why: 'The chamber vents through port 3 of the QEV at the cylinder; the throttle only sees the incoming air and the little air left in the tube.' }
  ],
  applications: ['Fast single-acting cylinders: ejectors, stampers, returning on a weak spring.', 'Large cylinders on valve terminals a few metres away.', 'Rapid venting of clamps and brakes where the release must be quick.', 'Air-saving circuits where the return stroke runs at reduced pressure.'],
  sim: 'fv-qev'
},

{
  id: 'shuttle-valve', parent: 'function-valves', title: 'Shuttle valve: OR', level: 1,
  short: 'A valve with two inputs and one output and a free ball or disc between them: whichever input is pressurised pushes the ball against the other input and reaches the output. The pneumatic OR — the output is on if input one or input two (or both) is on.',
  keywords: ['shuttle valve', 'OR valve', 'OR function', 'double check valve', 'logic', 'two stations', 'higher pressure', 'selector'],
  prereq: ['check-valves-pneu', 'way-valves', 'valve-operation'],
  related: ['two-pressure-valve', 'logic-functions', 'direct-control', 'port-numbering', 'iso-1219-pneu', 'electronics:logic-gates'],
  body: `
Suppose a cylinder must be operable from two places — a push button at the front of a machine and one at the back, or a foot pedal and an automatic signal. Joining the two signal lines with a plain T fails at once: the air from the pressed valve escapes through the open exhaust of the other one, which is at rest and vented. The **shuttle valve** solves this. Its two inputs (both numbered 1) meet at a chamber with a free ball or disc; the output 2 leaves from the middle. Air arriving at one input throws the ball across onto the seat of the other input, sealing it, and flows on to the output.

### The OR function
| Input 1 | Input 1′ | Output 2 |
|---|---|---|
| 0 | 0 | 0 |
| 1 | 0 | 1 |
| 0 | 1 | 1 |
| 1 | 1 | 1 |

In Boolean notation $Y = a \\lor b$ (often written $a + b$). With both inputs pressurised the ball settles against the lower pressure, so the output carries the **higher** of the two — a property used on its own to select the higher of two pressures, as in the load-sensing lines of mobile hydraulics.

When the active input is vented, the output line empties back through that input and the signal valve's exhaust. The shuttle valve has no exhaust of its own: each input must come from a valve that vents when it is released — a 3/2 valve, not a 2/2 valve — or the output stays pressurised.

### More than two inputs
Three inputs need two shuttle valves, $n$ inputs need $n - 1$. Chained one after another, the signal from the first input passes through all of them, and restrictions in series add: $k$ equal valves in series have $C_\\text{eff} = C/\\sqrt{k}$, so a long chain fills its output line noticeably more slowly. A tree (pairs feeding pairs) keeps the longest path to $\\lceil \\log_2 n \\rceil$ valves.

### Where it is used
- Operating from two places: two stations, manual and automatic, inside and outside a door.
- Combining a normal and an override signal, or an operator signal with a sequence signal.
- Selecting the higher of two pressures — the old name "double check valve" says what it is.
- In the pneumatic logic of machines that still run without electricity: mining, explosive atmospheres, simple fixtures (see [[logic-functions]]).

> [!tip] An OR is only as good as the vents behind it: every input must be able to exhaust, or the output never switches off.
`,
  ideas: [
    'A shuttle valve passes whichever input is pressurised to the output and seals the other input with its ball.',
    'It is the pneumatic OR: output = input 1 OR input 1′.',
    'With both inputs on, the output carries the higher pressure.',
    'The output vents back through the active input; every input must come from a valve with an exhaust.',
    'n inputs need n − 1 shuttle valves; k in series have C/√k.'
  ],
  pitfalls: [
    'A T-piece does the same job more cheaply — The pressurised air escapes through the exhaust of the valve at rest; the shuttle\'s ball is what shuts the unused input.',
    'A shuttle valve can combine the outputs of two 2/2 valves — A 2/2 valve has no exhaust, so the output line cannot vent when the signal goes; the output stays on.',
    'With both inputs pressurised the output takes the lower pressure — That is the two-pressure (AND) valve. The shuttle\'s ball is pushed against the lower pressure, so the higher one passes.'
  ],
  formulas: [
    {
      name: 'Identical valves in series',
      expr: 'Ceff = C/sqrt(k)', tex: 'C_\\text{eff} = \\dfrac{C}{\\sqrt{k}}',
      vars: {
        Ceff: { name: 'sonic conductance of the chain', q: 'flowcond', unit: 'dm³/(s·bar)', tex: 'C_\\text{eff}' },
        C: { name: 'sonic conductance of one shuttle valve', q: 'flowcond', unit: 'dm³/(s·bar)', value: 0.5 },
        k: { name: 'number of valves the signal passes', int: true, value: 3, min: 1, max: 50 }
      },
      note: 'From 1/C² adding in series. It sets how quickly the signal can fill the line after the chain (see the two-pressure valve for the filling time).',
      stories: { Ceff: 'A signal passes through {k} shuttle valves in a row, each with C = {C}. What is the conductance of the chain?', k: 'Shuttle valves with C = {C} are chained. How many can a signal pass before the conductance falls to {Ceff}?' }
    }
  ],
  examples: [
    {
      title: 'Four stations',
      q: 'A door cylinder is to be opened from any of four push buttons. How many shuttle valves are needed, and what is the conductance of the longest signal path if they are chained, or arranged as a tree? Each shuttle valve has $C = 0.5$ dm³/(s·bar).',
      steps: [
        'Four inputs need $4 - 1 = 3$ shuttle valves either way.',
        'Chained, the first button\'s signal passes all three: $C_\\text{eff} = 0.5/\\sqrt{3} = 0.29$ dm³/(s·bar).',
        'As a tree (two pairs, then one valve joining them), every signal passes two: $C_\\text{eff} = 0.5/\\sqrt{2} = 0.35$ dm³/(s·bar).'
      ],
      a: 'Three shuttle valves; the tree gives every button the same, shorter path (0.35 against 0.29 dm³/(s·bar) for the worst button of a chain).'
    }
  ],
  quiz: [
    { q: 'Input 1 of a shuttle valve is at 0 bar and input 1′ at 6 bar. The output is…', choices: ['0 bar', '3 bar', '6 bar', 'undefined: the ball floats'], a: 2,
      why: 'The pressurised input pushes the ball onto the other seat and passes to the output: OR.' },
    { q: 'Why can two push-button valves not simply be joined by a T to operate one cylinder from two places?', choices: ['The T would restrict the flow too much', 'The air from the pressed valve would escape through the exhaust of the valve at rest', 'The two valves would switch each other', 'It works; the shuttle valve is only for looks'], a: 1,
      why: 'A 3/2 valve at rest connects its output to its exhaust; a T would vent the signal. The shuttle ball closes the idle input.' },
    { q: 'Input 1 is at 6 bar and input 1′ at 4 bar at the same time. What pressure is at the output?', answer: 6, unit: 'bar', tol: 0.01,
      why: 'The higher pressure pushes the ball against the lower one and reaches the output.' },
    { q: 'How many shuttle valves does an OR of five signals need?', answer: 4, tol: 0,
      why: 'Each shuttle valve combines two signals into one, so n inputs need n − 1 valves.' },
    { q: 'A shuttle valve joins the outputs of two 2/2 push-button valves. After a button is released, the output switches off.', a: false,
      why: 'A 2/2 valve has no exhaust; the output line stays pressurised. Signals feeding a shuttle valve must come from valves that vent, such as 3/2 valves.' }
  ],
  applications: ['Operating a cylinder from two stations, or by hand and automatically.', 'Door controls on buses and trains that open from inside or outside.', 'Selecting the higher of two pressures for a pilot or a gauge.', 'Pneumatic logic in explosive atmospheres and mining, where electricity is unwelcome.'],
  sim: { id: 'fv-logic', params: { mode: 'or' } }
},

{
  id: 'two-pressure-valve', parent: 'function-valves', title: 'Two-pressure valve: AND', level: 1,
  short: 'A valve with two inputs and one output whose spool lets air through only when both inputs are pressurised: a single input pushes the spool across and seals itself. The pneumatic AND — and when both are on, the lower pressure passes.',
  keywords: ['two-pressure valve', 'AND valve', 'AND function', 'dual pressure valve', 'interlock', 'logic', 'series connection', 'signal delay'],
  prereq: ['shuttle-valve', 'way-valves'],
  related: ['logic-functions', 'direct-control', 'two-hand-control', 'pressure-sequence', 'memory-circuits', 'electronics:logic-gates'],
  body: `
Some things should happen only when two conditions hold together: the press may stroke only when the start button is pressed **and** the guard is closed; the clamp may release only when the drill is back **and** the timer has run out. The **two-pressure valve** makes that decision with air. Its body has two inputs (both numbered 1) at the ends and an output 2 in the middle; inside is a spool with a sealing face at each end.

### How a lone signal seals itself
Air at one input pushes the spool towards the other end — and in doing so presses the spool's near sealing face onto its own seat. That input is blocked, and nothing reaches the output. Only when the second input is pressurised as well can air pass: the later (or lower) pressure flows round the spool to the output. So the output needs both:

| Input 1 | Input 1′ | Output 2 |
|---|---|---|
| 0 | 0 | 0 |
| 1 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 1 | 1 |

In Boolean notation $Y = a \\land b$ (often $a \\cdot b$). With unequal pressures the spool is pushed towards the lower one's side and the **lower** pressure reaches the output — the mirror image of the [[shuttle-valve]]. When either input vents, the output vents through it.

### AND without a special valve: in series
Two 3/2 valves in series do the same job: the first valve's output feeds the second valve's supply port. It is cheap and common, but not quite equivalent. The signal passes through both valves (two restrictions in series), the second valve's exhaust vents the output when it is released, and a limit valve in series is fed only while the first is operated — which matters for monitoring. The two-pressure valve takes two independent signals from anywhere in the circuit.

### Speed of a signal
A logic element does not switch its output instantly: the air must fill the line and the pilot chamber behind it. While the flow is choked the pressure rises linearly, and the time to reach a gauge pressure $p_g$ in a volume $V$ is

$$t = \\frac{V p_g}{C\\,p_1\\,p_\\text{ref}}$$

— about 14 ms to put 1 bar into 10 cm³ through $C = 0.1$ dm³/(s·bar) at a 6 bar supply. Beyond about 1 bar the flow is no longer choked and filling slows (see [[time-delay-valve]]). Signal delays of tens of milliseconds are normal in pneumatic logic, and they add up along a chain.

> [!warn] A two-pressure valve fed by two push buttons is **not** a two-hand safety control. It does not check that both hands pressed within half a second, cannot detect a button taped down, and fails to danger if a valve sticks. Two-hand control devices must meet ISO 13851:2019 (see [[two-hand-control]]).
`,
  ideas: [
    'A two-pressure valve passes air only when both inputs are pressurised: the pneumatic AND.',
    'A single input pushes the spool across and seals its own seat.',
    'With both inputs on, the lower pressure — usually the later signal — reaches the output.',
    'Two 3/2 valves in series also make an AND, with the signal passing through both.',
    'Filling a signal volume takes time: t = V·p_g/(C·p₁·p_ref) while choked.'
  ],
  pitfalls: [
    'A two-pressure valve behind two buttons makes a safe two-hand control — It checks neither simultaneity nor release; one button can be tied down. Safety two-hand devices are special, certified designs.',
    'The output of a two-pressure valve takes the higher pressure — It takes the lower one: the spool is pushed towards the lower pressure\'s side and that air passes.',
    'An AND from two valves in series is identical to a two-pressure valve — The series signal passes two restrictions and vents through the second valve; the second valve cannot signal on its own, which matters for monitoring and sequencing.'
  ],
  formulas: [
    {
      name: 'Time to pressurise a signal volume (choked filling)',
      expr: 't = V*pg/(C*p1*pref)', tex: 't = \\dfrac{V\\,p_g}{C\\,p_1\\,p_\\text{ref}}',
      vars: {
        t: { name: 'time to reach the pressure', q: 'time', unit: 'ms' },
        V: { name: 'volume of the signal line and pilot chamber', q: 'volume', unit: 'cm³', value: 10 },
        pg: { name: 'pressure to be reached (gauge)', q: 'pressure', unit: 'bar', value: 1, tex: 'p_g' },
        C: { name: 'sonic conductance of the path', q: 'flowcond', unit: 'dm³/(s·bar)', value: 0.1 },
        p1: { name: 'supply pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.013, tex: 'p_1' },
        pref: { name: 'reference pressure (ISO 8778, absolute)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_\\text{ref}' }
      },
      note: 'Isothermal filling from atmospheric pressure with choked flow, dp/dt = C·p₁·p_ref/V. Valid while the absolute pressure in the volume is below b·p₁ — up to about 1 bar gauge at a 6 bar supply; higher pressures take longer.',
      practice: { unknowns: ['t', 'V'] },
      stories: { t: 'A signal line and pilot of {V} are filled through C = {C} from {p1}. How long until they reach {pg}?' }
    }
  ],
  examples: [
    {
      title: 'Start only with the guard closed',
      q: 'A press cylinder must extend only when the start button S1 is pressed and the guard is closed (a roller valve S2 is then operated). Sketch the logic, and estimate how long the output takes to put 1 bar into its 10 cm³ pilot line through the two-pressure valve ($C = 0.1$ dm³/(s·bar)) at a 6 bar supply.',
      steps: [
        'Logic: $Y = S1 \\land S2$ — a two-pressure valve with S1 and S2 on its inputs; its output pilots the power valve.',
        'Filling: $t = V p_g/(C\\,p_1\\,p_\\text{ref}) = 10^{-5} \\times 10^5/(10^{-9} \\times 7.013\\times10^5 \\times 10^5) = 0.014$ s.',
        'The power valve needs perhaps 2–3 bar on its pilot, beyond the choked range, so allow two or three times as long.'
      ],
      a: 'A two-pressure valve (S1 AND S2); the signal takes about 14 ms to reach 1 bar and a few tens of milliseconds to switch the power valve.'
    }
  ],
  quiz: [
    { q: 'Only input 1 of a two-pressure valve is pressurised. What happens?', choices: ['Air reaches the output', 'The spool is pushed across and seals input 1: no output', 'The air escapes to atmosphere', 'The valve switches input 1′'], a: 1,
      why: 'A lone signal pushes the spool onto its own seat; the output needs both inputs.' },
    { q: 'Input 1 is at 6 bar and input 1′ at 4 bar. The output carries…', answer: 4, unit: 'bar', tol: 0.01,
      why: 'The spool is pushed towards the lower pressure\'s side, and that lower pressure passes to the output.' },
    { q: 'A 20 cm³ signal volume is filled to 1 bar gauge through C = 0.2 dm³/(s·bar) from 6 bar gauge. About how long does it take (choked filling)?', answer: 14.3, unit: 'ms', tol: 0.03,
      why: 't = 2×10⁻⁵ × 10⁵ /(2×10⁻⁹ × 7.013×10⁵ × 10⁵) = 0.0143 s.' },
    { q: 'Two push buttons feeding a two-pressure valve form an acceptable two-hand safety control.', a: false,
      why: 'It does not demand simultaneous operation within 0.5 s, cannot tell whether a button was released between cycles, and has no fault monitoring. Two-hand control devices must follow ISO 13851.' }
  ],
  applications: ['Interlocks: start AND guard closed, clamp AND part present.', 'Sequences in which a step needs two limit signals.', 'Machines whose controls must work without electricity.', 'Selecting the lower of two pressures for a pilot.'],
  sim: { id: 'fv-logic', params: { mode: 'and' } }
},

{
  id: 'time-delay-valve', parent: 'function-valves', title: 'Time-delay valves', level: 2,
  short: 'A pneumatic timer: a signal fills a small reservoir through an adjustable throttle, and when the reservoir reaches the switching pressure a 3/2 valve changes over. The delay is set by the filling time constant τ = V/(C·p_ref) — seconds to tens of seconds — and it drifts with the supply pressure.',
  keywords: ['time-delay valve', 'pneumatic timer', 'on-delay', 'off-delay', 'reservoir', 'throttle', 'time constant', 'switching pressure', 'accuracy', 'RC'],
  prereq: ['flow-control-pneu', 'filling-emptying', 'sonic-conductance'],
  related: ['check-valves-pneu', 'logic-functions', 'memory-circuits', 'choked-flow', 'electronics:rc-transient', 'electronics:timer-555', 'physics:rc-circuits', 'math:exponential-growth-decay'],
  body: `
Before every machine had a PLC, a pneumatic circuit that had to wait — hold a glued part for five seconds, blow off for two, dwell at the end of a press stroke — used a **time-delay valve**. It is three components in one body: a one-way flow control, a small air reservoir (typically 10–200 cm³), and a 3/2 valve piloted by the reservoir's pressure.

### How it works
**On-delay (normally closed):** the input signal enters through the throttle into the reservoir. The pressure rises; when it reaches the 3/2 valve's switching pressure (adjustable, typically 1.5–4 bar), the valve opens and the output comes on. When the signal goes, the reservoir empties at once through the non-return valve beside the throttle, and the timer resets. **Off-delay:** turn the flow control round — the reservoir fills at once and bleeds away through the throttle after the signal goes, holding the output on for the delay. With a normally open 3/2 valve the output goes **off** after a delay instead.

### The time constant
A throttle of sonic conductance $C$ feeding a volume $V$ has a natural time constant

$$\\tau = \\frac{V}{C\\,p_\\text{ref}}$$

While the flow is choked (reservoir below $b\\,p_1$) the pressure rises in a straight line at $p_1/\\tau$; after that the flow tapers off as the pressures approach each other. Integrating the ISO 6358 flow for slow, isothermal filling gives the delay to the switching pressure $p_s$ in closed form:

$$t_d = \\tau\\left[\\left(b - \\frac{p_0}{p_1}\\right) + (1 - b)\\arcsin\\frac{p_s/p_1 - b}{1 - b}\\right]$$

(all pressures absolute). For a 100 cm³ reservoir and $C = 0.01$ dm³/(s·bar), $\\tau = 10$ s and the delay to 3 bar gauge from a 6 bar supply is 4.35 s. It is the electrical [[electronics:rc-transient|RC delay]] in air: the reservoir is the capacitor, the throttle the resistor — except that the "resistor" chokes.

| Throttle C (dm³/(s·bar)) | τ for 100 cm³ | Delay to 3 bar at 6 bar supply |
|---|---|---|
| 0.1 | 1 s | 0.44 s |
| 0.01 | 10 s | 4.4 s |
| 0.003 | 33 s | 14.5 s |

### How accurate?
Not very, by electronic standards: a repeatability of 5–10 % is typical, and systematic drift is larger.
- **Supply pressure.** $p_1$ is in the formula: dropping from 6 to 5 bar gauge lengthens the 4.35 s delay to 5.18 s, +19 %.
- **Switching pressure close to the supply.** The last part of the filling is slow, so a small change there moves the delay a lot; keep $p_s$ well below $p_1$.
- **Temperature, dirt and wear** in the needle throttle, a leaking reservoir or seal.
- **Reset time.** If the signal returns before the reservoir has emptied, the next delay is shorter.

That is why pneumatic timers are used from fractions of a second to about 30 s, and electronic timers or a PLC beyond that.

> [!warn] A pneumatic timer is not a safety timer. Where a delay protects people — a door that may open only after a machine has stopped — use a safety-rated device with monitoring (see [[safety-functions]]).
`,
  ideas: [
    'A time-delay valve is a one-way flow control, a small reservoir and a 3/2 pilot valve in one body.',
    'On-delay: the throttle fills the reservoir; the check valve empties it at once to reset.',
    'The time constant is τ = V/(C·p_ref); the delay is a fraction of it that depends on p_s/p₁.',
    'The delay drifts with supply pressure, temperature and dirt; repeatability is about 5–10 %.',
    'Keep the switching pressure well below the supply; use electronics beyond about 30 s.'
  ],
  pitfalls: [
    'The delay is fixed once set — It depends on the supply pressure (and temperature, and whether the reservoir had fully emptied); a 1 bar drop in supply can lengthen it by a fifth.',
    'Setting the switching pressure just below the supply gives a sharp, precise delay — Near the supply pressure the filling is slowest, so tiny changes in either pressure shift the delay greatly.',
    'A short input pulse starts the timer, which then completes on its own — An on-delay needs the signal for the whole delay; if it goes early the reservoir empties through the check valve and nothing happens.'
  ],
  formulas: [
    {
      name: 'Time constant of a throttle and a volume',
      expr: 'tau = V/(C*pref)', tex: '\\tau = \\dfrac{V}{C\\,p_\\text{ref}}',
      vars: {
        tau: { name: 'time constant', q: 'time', unit: 's', tex: '\\tau' },
        V: { name: 'reservoir volume', q: 'volume', unit: 'L', value: 0.1 },
        C: { name: 'sonic conductance of the throttle', q: 'flowcond', unit: 'dm³/(s·bar)', value: 0.01 },
        pref: { name: 'reference pressure (ISO 8778, absolute)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_\\text{ref}' }
      },
      note: 'While choked, a reservoir fills at dp/dt = p₁/τ (isothermal, air at 20 °C) and empties at dp/dt = −p/τ.',
      stories: { tau: 'A time-delay valve has a {V} reservoir and a throttle set to C = {C}. What is its time constant?', C: 'A {V} reservoir must have a time constant of {tau}. What throttle conductance is needed?' }
    },
    {
      name: 'On-delay to the switching pressure',
      expr: 't = V/(C*pref)*((b - p0/p1) + (1 - b)*asin((ps/p1 - b)/(1 - b)))',
      tex: 't_d = \\dfrac{V}{C\\,p_\\text{ref}}\\left[\\left(b - \\dfrac{p_0}{p_1}\\right) + (1 - b)\\arcsin\\dfrac{p_s/p_1 - b}{1 - b}\\right]',
      vars: {
        t: { name: 'delay', q: 'time', unit: 's', tex: 't_d' },
        V: { name: 'reservoir volume', q: 'volume', unit: 'L', value: 0.1 },
        C: { name: 'sonic conductance of the throttle', q: 'flowcond', unit: 'dm³/(s·bar)', value: 0.01 },
        pref: { name: 'reference pressure (ISO 8778, absolute)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_\\text{ref}' },
        b: { name: 'critical pressure ratio of the throttle', value: 0.3, min: 0.15, max: 0.55 },
        p0: { name: 'reservoir pressure at the start (absolute)', q: 'pressure', unit: 'bar', value: 1.013, tex: 'p_0' },
        p1: { name: 'signal (supply) pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.013, min: 2, max: 15, tex: 'p_1' },
        ps: { name: 'switching pressure (absolute)', q: 'pressure', unit: 'bar', value: 4.013, min: 1.1, max: 15, tex: 'p_s' }
      },
      note: 'Isothermal filling through an ISO 6358 restriction: a choked stretch up to b·p₁, then the subsonic ellipse integrated exactly. Valid for p₀/p₁ ≤ b < p_s/p₁. Pressures absolute; the gauge setting plus 1.013 bar.',
      practice: { unknowns: ['t', 'C', 'V'] },
      stories: { t: 'A time-delay valve with a {V} reservoir and a throttle of C = {C} (b = {b}) is fed at {p1}, starting from {p0}. How long until it reaches its switching pressure of {ps}?', C: 'A {V} reservoir, fed at {p1}, must reach {ps} after {t}. What throttle conductance is needed (b = {b})?' }
    }
  ],
  examples: [
    {
      title: 'Setting a dwell',
      q: 'A time-delay valve has a 100 cm³ reservoir and its 3/2 valve switches at 3 bar gauge. It is fed at 6 bar gauge; the throttle is set to $C = 0.01$ dm³/(s·bar) ($b = 0.3$). What is the delay?',
      steps: [
        '$\\tau = V/(C\\,p_\\text{ref}) = 10^{-4}/(10^{-10} \\times 10^5) = 10$ s.',
        'Absolute pressures: $p_1 = 7.013$, $p_0 = 1.013$, $p_s = 4.013$ bar; $p_0/p_1 = 0.144$, $p_s/p_1 = 0.572$.',
        'Choked part: $b - p_0/p_1 = 0.156$. Subsonic part: $(1 - b)\\arcsin(0.272/0.7) = 0.7 \\times 0.399 = 0.280$.',
        '$t_d = 10 \\times (0.156 + 0.280) = 4.35$ s.'
      ],
      a: 'About 4.35 s — 0.44 of the time constant.'
    },
    {
      title: 'When the supply sags',
      q: 'The supply of the same timer drops to 5 bar gauge. What is the delay now?',
      steps: [
        '$p_1 = 6.013$ bar: $p_0/p_1 = 0.168$, $p_s/p_1 = 0.667$.',
        '$(0.3 - 0.168) + 0.7\\arcsin((0.667 - 0.3)/0.7) = 0.132 + 0.7 \\times 0.553 = 0.519$.',
        '$t_d = 10 \\times 0.519 = 5.18$ s.'
      ],
      a: '5.18 s — 19 % longer. A timer is only as steady as its air; a pressure regulator in front of it helps.'
    },
    {
      title: 'Choosing the throttle',
      q: 'A 200 cm³ reservoir should give 10 s under the conditions of the first example. What conductance must the throttle have?',
      steps: [
        'The bracket is 0.435 as before, so $\\tau = 10/0.435 = 23$ s.',
        '$C = V/(\\tau\\,p_\\text{ref}) = 2\\times10^{-4}/(23 \\times 10^5) = 8.7\\times10^{-11}$ m³/(s·Pa) = 0.0087 dm³/(s·bar).'
      ],
      a: 'About 0.009 dm³/(s·bar) — a needle opened only a crack, which is why such timers are sensitive to dirt.'
    }
  ],
  quiz: [
    { q: 'The reservoir of a time-delay valve is doubled and nothing else changes. The delay…', choices: ['stays the same', 'doubles', 'halves', 'rises by √2'], a: 1,
      why: 'The delay is a fixed fraction of τ = V/(C·p_ref), and τ is proportional to V.' },
    { q: 'A 50 cm³ reservoir fills through a throttle of C = 0.005 dm³/(s·bar). What is the time constant?', answer: 10, unit: 's', tol: 0.02,
      why: 'τ = 5×10⁻⁵ /(5×10⁻¹¹ × 10⁵) = 10 s.' },
    { q: 'An on-delay timer receives a signal that ends before the delay is over. What happens?', choices: ['The output comes on later anyway', 'The reservoir empties through the check valve and the output never comes on', 'The output comes on at once', 'The timer locks'], a: 1,
      why: 'The input line vents and the check valve lets the reservoir empty back into it: the timer resets. On-delays filter short signals.' },
    { q: 'The supply pressure of a pneumatic timer falls. Its on-delay becomes…', choices: ['shorter', 'longer', 'unchanged', 'zero'], a: 1,
      why: 'Less pressure drives less flow through the throttle, and the switching pressure is a larger fraction of the supply: the reservoir takes longer to get there.' },
    { q: 'Setting the switching pressure close to the supply pressure gives the most repeatable delay.', a: false,
      why: 'Near the supply pressure the filling curve is almost flat, so small changes in either pressure move the delay a lot.' }
  ],
  applications: ['Dwell times: holding a glued or pressed part, a blow-off pulse.', 'Delaying a signal until a cylinder has settled.', 'Turning an output off a set time after a signal (off-delay).', 'Simple machines and fixtures without electrical control.'],
  history: 'Pneumatic timers were standard parts of relay and air-logic control from the 1950s: industrial time-delay relays even used a small bellows and needle valve to time their contacts — the same reservoir-and-throttle idea behind the pneumatic time-delay valve.',
  sim: 'fv-delay'
},

{
  id: 'pressure-switches', parent: 'function-valves', title: 'Pressure switches and sensors', level: 2,
  short: 'Devices that turn a pressure into an electrical signal: a mechanical switch that changes over at an adjustable set point with some hysteresis, or an electronic sensor with switching outputs, an analogue 4–20 mA or 0–10 V signal or IO-Link. They confirm clamping, watch the supply and vacuum, and measure leaks.',
  keywords: ['pressure switch', 'pressure sensor', 'PE converter', 'set point', 'hysteresis', 'switch-back point', '4-20 mA', 'analogue output', 'IO-Link', 'vacuum switch', 'leak test', 'pressure decay', 'differential pressure'],
  prereq: ['absolute-gauge-pressure', 'cylinder-force', 'electronics:sensors'],
  related: ['pressure-sequence', 'sensors-pneu', 'fieldbus-io-link', 'plc-control', 'air-leaks', 'leak-management', 'compressor-regulation', 'vacuum-circuits', 'electronics:comparators', 'electronics:schmitt-trigger'],
  body: `
A cylinder's position is easy to sense; its force is not. But force is pressure times area, so the pressure in a chamber tells a controller how hard a clamp is pressing, whether a suction cup has sealed on a part, whether the supply is healthy. **Pressure switches** and **pressure sensors** are the bridge from air to electrics — the pneumatic-electric (PE) converters of the circuit diagram.

### Mechanical pressure switches
A diaphragm or small piston works against an adjustable spring and operates a microswitch. Above the **set point** the contact changes over; it changes back only when the pressure has fallen by the **hysteresis** (the switch-back difference, typically 0.2–1 bar), so a pressure hovering at the set point does not make the contact chatter — the pneumatic [[electronics:schmitt-trigger|Schmitt trigger]]. They are robust and need no power, but their accuracy is a few per cent of the range and the set point drifts with wear.

### Electronic sensors
A silicon membrane with a piezoresistive bridge (or a thin-film gauge on steel) measures the pressure itself; electronics turn it into:
- **switching outputs** (PNP or NPN), usually two, each with an adjustable set point and hysteresis, or a window mode (on between two limits);
- an **analogue output**, 4–20 mA or 0–10 V proportional to pressure — the 4 mA "live zero" lets a controller tell a zero reading from a broken wire;
- **IO-Link**: the value, the settings and diagnostics over a three-wire cable (see [[fieldbus-io-link]]).

Accuracy is typically ±0.5–2 % of full scale, response a few milliseconds, and most have a display.

| | Mechanical switch | Electronic sensor |
|---|---|---|
| Output | one contact | 1–2 switching outputs, analogue, IO-Link |
| Accuracy | ±2–5 % | ±0.5–2 % of full scale |
| Power | none | 10–30 V DC |
| Hysteresis | fixed or adjustable | adjustable, or window mode |

Sensors measure **gauge** pressure (relative to the room), **absolute** pressure (against a sealed vacuum — needed for vacuum levels independent of weather and altitude), **differential** pressure (across a filter), or vacuum.

### What they are used for
- **Supply monitoring:** the machine may not start below, say, 5 bar, and stops with a message if the supply sags.
- **Clamping confirmation:** a switch on the clamp line proves the force before machining starts ([[pressure-sequence]] is the all-air version).
- **Vacuum handling:** part present, part lost, cup leaking ([[vacuum-circuits]]).
- **Filters:** a differential sensor reports a clogging element.
- **Compressors:** the pressure band that loads and unloads them ([[compressor-regulation]]).
- **Leak testing:** pressurise, isolate, watch the pressure fall. The free-air leak rate follows from Boyle's law: $Q = V\\,\\Delta p/(p_\\text{ref}\\,t)$.

> [!warn] A pressure switch that protects people — a clamping interlock on a manually loaded fixture, a pressure-free check before a guard opens — is part of a safety function and must be chosen and wired to the required performance level (see [[safety-functions]]). Before maintenance, trust the exhausted system and a gauge you can read, not a switch alone.
`,
  ideas: [
    'Pressure × area is force: a pressure signal tells the controller how hard a cylinder is pushing or holding.',
    'A mechanical switch changes over at its set point and back after the hysteresis, so it does not chatter.',
    'Electronic sensors give switching outputs, an analogue 4–20 mA or 0–10 V signal, or IO-Link.',
    'Gauge, absolute, differential and vacuum sensors measure against different references.',
    'Pressure decay in a closed volume gives the leak rate: Q = V·Δp/(p_ref·t).'
  ],
  pitfalls: [
    'A pressure switch switches back at the same pressure it switched at — It has a hysteresis: it resets only after the pressure has fallen by the switch-back difference, so the two points must both be set with that in mind.',
    'A reading of 0 mA or 0 V on an analogue sensor means zero pressure — On a 4–20 mA sensor zero pressure reads 4 mA; 0 mA means a broken wire or a dead sensor — the reason for the live zero.',
    'A gauge-pressure vacuum switch reads the same everywhere — It measures against the room\'s pressure, which changes with weather and altitude; for absolute vacuum levels an absolute sensor is needed.'
  ],
  formulas: [
    {
      name: 'Leak rate from a pressure-decay test',
      expr: 'Q = V*dp/(pref*t)', tex: 'Q = \\dfrac{V\\,\\Delta p}{p_\\text{ref}\\,t}',
      vars: {
        Q: { name: 'leak rate (free air)', q: 'airflow', unit: 'L/min ANR' },
        V: { name: 'volume under test', q: 'volume', unit: 'L', value: 200 },
        dp: { name: 'pressure fall during the test', q: 'pressure', unit: 'bar', value: 1, tex: '\\Delta p' },
        pref: { name: 'reference pressure (ISO 8778, absolute)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_\\text{ref}' },
        t: { name: 'test time', q: 'time', unit: 's', value: 60 }
      },
      note: 'Boyle\'s law at constant temperature: the free air lost is V·Δp/p_ref. Let the temperature settle after pressurising, or the cooling air fakes a leak.',
      practice: { unknowns: ['Q', 'dp'] },
      stories: { Q: 'A system of {V} is pressurised, isolated, and loses {dp} in {t}. What is its leak rate in free air?', dp: 'A system of {V} leaks {Q}. How much pressure does it lose in {t}?' }
    },
    {
      name: 'Output of a 4–20 mA pressure sensor',
      expr: 'I = I0 + (I1 - I0)*p/pfs', tex: 'I = I_0 + (I_1 - I_0)\\,\\dfrac{p}{p_\\text{fs}}',
      vars: {
        I: { name: 'output current', q: 'current', unit: 'mA' },
        I0: { name: 'current at zero pressure (live zero)', q: 'current', unit: 'mA', value: 4, fixed: true, tex: 'I_0' },
        I1: { name: 'current at full scale', q: 'current', unit: 'mA', value: 20, fixed: true, tex: 'I_1' },
        p: { name: 'measured pressure (gauge)', q: 'pressure', unit: 'bar', value: 6 },
        pfs: { name: 'full-scale pressure (gauge)', q: 'pressure', unit: 'bar', value: 10, tex: 'p_\\text{fs}' }
      },
      note: 'A linear sensor with a 4 mA live zero; for 0–10 V outputs put 0 and 10 V in place of 4 and 20 mA.',
      practice: { unknowns: ['I', 'p'] },
      stories: { I: 'A 4–20 mA sensor with a range of 0 to {pfs} reads {p}. What current does it send?', p: 'A 4–20 mA sensor with a range of 0 to {pfs} sends {I}. What pressure does it read?' }
    }
  ],
  examples: [
    {
      title: 'A leak test on a machine',
      q: 'A machine\'s air system (receiver and pipes, 200 L) is pressurised to 7 bar, isolated at the end of a shift, and loses 1 bar in one minute. What is its leak rate?',
      steps: [
        '$Q = V\\,\\Delta p/(p_\\text{ref}\\,t) = 0.2 \\times 10^5/(10^5 \\times 60) = 3.33\\times10^{-3}$ m³/s.',
        'That is 200 L/min of free air — the air of several busy cylinders, blowing away day and night.'
      ],
      a: '200 L/min of free air (about 7 SCFM).'
    },
    {
      title: 'Reading an analogue sensor',
      q: 'A 0–10 bar sensor with a 4–20 mA output sends 13.6 mA. What pressure does it read, and what would 2.5 bar send?',
      steps: [
        '$p = p_\\text{fs}(I - I_0)/(I_1 - I_0) = 10 \\times 9.6/16 = 6.0$ bar.',
        '2.5 bar: $I = 4 + 16 \\times 0.25 = 8$ mA.'
      ],
      a: '6.0 bar; 2.5 bar would send 8 mA.'
    }
  ],
  quiz: [
    { q: 'A pressure switch is set to switch at 5 bar with a hysteresis of 0.5 bar. The pressure rises to 5.2 bar and then falls to 4.7 bar. The contact is…', choices: ['off: it fell below 5 bar', 'still on: it resets only below 4.5 bar', 'chattering', 'off: it was never on'], a: 1,
      why: 'It switched at 5 bar and switches back only at 5 − 0.5 = 4.5 bar.' },
    { q: 'What current does a 0–10 bar, 4–20 mA sensor send at 2.5 bar?', answer: 8, unit: 'mA', tol: 0.01,
      why: 'I = 4 + 16 × 2.5/10 = 8 mA.' },
    { q: 'Why does an analogue sensor output start at 4 mA rather than 0 mA?', choices: ['To save power', 'So that a broken wire (0 mA) can be told from zero pressure (4 mA), and to power the sensor', 'Because of the sensor\'s hysteresis', 'It is a historical accident with no use'], a: 1,
      why: 'The live zero makes a fault visible and leaves a few milliamps to power two-wire sensors.' },
    { q: 'A 50 L system loses 0.5 bar in 30 s after isolation. What is its leak rate in free air?', answer: 50, unit: 'L/min', tol: 0.02,
      why: 'Q = 0.05 × 0.5×10⁵ /(10⁵ × 30) = 8.33×10⁻⁴ m³/s = 50 L/min.' },
    { q: 'A vacuum switch measuring gauge pressure is set to −0.6 bar. On a mountain at lower atmospheric pressure, the same absolute vacuum in the cup reads the same.', a: false,
      why: 'Gauge pressure is measured from the room\'s pressure; with a lower atmosphere the same absolute pressure reads a smaller vacuum. Absolute sensors avoid this.' }
  ],
  applications: ['Minimum-supply interlocks on every automated machine.', 'Clamp and gripper force confirmation before machining or moving.', 'Part-present and part-lost detection in vacuum handling.', 'Filter monitoring, compressor pressure bands and end-of-line leak tests.'],
  history: 'Eugène Bourdon patented his curved-tube pressure gauge in 1849; a Bourdon tube or a diaphragm moving a contact was the pressure switch for a century, until silicon piezoresistive sensors, whose principle was found at Bell Laboratories in 1954, made electronic sensors cheap.',
  sim: 'fv-pseq'
},

/* ================================================================ BASIC CONTROL */
{
  id: 'direct-control', parent: 'basic-control', title: 'Direct and indirect control', level: 1,
  short: 'In direct control the valve the operator presses carries the working air to the cylinder; in indirect control a small signal valve only pilots a larger power valve next to the cylinder, which does the work. Direct is simple for small cylinders nearby; indirect is the rule for everything else.',
  keywords: ['direct control', 'indirect control', 'push-button valve', 'signal valve', 'power valve', 'pilot valve', 'single-acting cylinder', 'circuit diagram layout', 'signal path', 'power path', 'ISO 1219-2'],
  prereq: ['way-valves', 'valve-operation', 'single-acting-cylinders', 'double-acting-cylinders'],
  related: ['solenoid-valves', 'port-numbering', 'iso-1219-pneu', 'logic-functions', 'memory-circuits', 'two-pressure-valve', 'soft-start', 'electronics:relays', 'hydraulics:reading-circuit-diagrams'],
  body: `
The simplest pneumatic circuit has three parts: a supply, a 3/2 push-button valve and a single-acting cylinder. Press the button and the valve connects 1 to 2: air flows into the cylinder and the rod extends. Release it and the spring returns the valve, 2 connects to 3, the cylinder's spring pushes the air out and the rod retracts. A double-acting cylinder is controlled the same way with a 5/2 (or 4/2) manual valve. This is **direct control**: the valve under the operator's hand carries the working air.

### Where direct control runs out
- **Force on the button.** A poppet valve is held shut by the supply pressure on its seat: $F = p_g\\,\\pi d^2/4 + F_s$. An 8 mm seat at 6 bar needs about 40 N with its spring — fine for a thumb; a 15 mm seat needs over 100 N.
- **Flow.** A valve small enough to press easily ($C \\approx 0.2$ dm³/(s·bar)) starves a large cylinder: in the simulation a 50 mm cylinder takes 0.15 s to extend and over a second to return through it.
- **Location.** The working air must travel from the operator's station to the cylinder and back. Long, wide power lines are slow, cost air every stroke and put the cylinder's exhaust at the operator.

### Indirect control
Split the job. A small **signal valve** at the operator fills a thin signal tube; the signal **pilots** a large **power valve** (the final control element) mounted beside the cylinder, which switches the working air. Port numbers tell the story: a signal on pilot port 12 connects 1 to 2, on 14 connects 1 to 4 (see [[port-numbering]]). It is the pneumatic counterpart of a relay switching a motor from a small push button ([[electronics:relays]]).

The price is a short **signal delay**. The signal tube and pilot chamber must be filled to the pilot's switching pressure (about 2 bar). Their time constant is $\\tau = V/(C\\,p_\\text{ref})$ with $V = \\pi d^2 L/4$: 3 m of 4 mm-bore tube through a signal valve of $C = 0.2$ gives $\\tau = 0.19$ s and a delay of about 0.05 s; 20 m gives about 0.36 s. After the delay, the big valve moves the cylinder quickly.

| | Direct | Indirect |
|---|---|---|
| Valve at the operator | carries working air | carries only a signal |
| Cylinder size | small | any |
| Distance | short | long signal lines are fine |
| Response | immediate, flow-limited | signal delay, then fast |
| Logic, memory, sequences | hardly possible | natural (see [[logic-functions]]) |

### Reading a circuit diagram
Circuit diagrams are drawn with the energy flowing upwards: supply and service unit at the bottom, then the signal elements (push buttons, limit valves), the processing elements (logic, timers), the power valves, and the actuators at the top — whatever the physical layout. Components carry codes such as 1A1 (first actuator), 1V1 (its valve), 1S1 (a signal element) and 0Z1 (the service unit), a common scheme derived from ISO 1219-2; cylinders are drawn retracted and valves in their normal position (see [[iso-1219-pneu]]).

> [!warn] Even the simplest circuit can trap a hand: a cylinder extends with its full force as soon as the button is pressed, and a machine may move when the air is first switched on. Guard the stroke, keep hands out of reach, and exhaust and lock out the supply before working on it.
`,
  ideas: [
    'Direct control: the operator\'s valve carries the working air to the cylinder.',
    'Big valves are hard to press and small ones starve big cylinders, so direct control suits small, nearby cylinders.',
    'Indirect control: a small signal valve pilots a big power valve beside the cylinder.',
    'The signal tube adds a delay set by its time constant τ = V/(C·p_ref), typically tens of milliseconds.',
    'Diagrams run from the supply at the bottom to the actuators at the top.'
  ],
  pitfalls: [
    'Indirect control is always faster — It adds the signal delay; for a small cylinder close by, direct control can be as quick or quicker.',
    'The operator\'s valve should be as large as the cylinder needs — A large poppet valve needs a large force to open against the supply pressure; above a certain size it is piloted instead.',
    'The circuit diagram shows where things are on the machine — It shows the flow of energy and signals, bottom to top; the physical positions of limit valves are marked on the cylinders instead.'
  ],
  formulas: [
    {
      name: 'Force to operate a poppet valve',
      expr: 'F = p*pi*d^2/4 + Fs', tex: 'F = p_g\\,\\dfrac{\\pi d^2}{4} + F_s',
      vars: {
        F: { name: 'operating force', q: 'force', unit: 'N' },
        p: { name: 'supply pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        d: { name: 'seat diameter', q: 'length', unit: 'mm', value: 8 },
        Fs: { name: 'return spring force', q: 'force', unit: 'N', value: 10, tex: 'F_s' }
      },
      note: 'An unbalanced poppet held on its seat by the supply pressure. Balanced spool valves need far less force, which is also how pilot operation keeps large valves easy to switch.',
      stories: { F: 'A push-button poppet valve has a seat of {d}, a {Fs} return spring and a supply of {p}. What force is needed to open it?', d: 'A push button must open with at most {F} at {p}, with a {Fs} spring. What is the largest seat diameter?' }
    },
    {
      name: 'Time constant of a signal tube',
      expr: 'tau = pi*d^2/4*L/(C*pref)', tex: '\\tau = \\dfrac{\\pi d^2 L/4}{C\\,p_\\text{ref}}',
      vars: {
        tau: { name: 'time constant', q: 'time', unit: 's', tex: '\\tau' },
        d: { name: 'tube bore', q: 'length', unit: 'mm', value: 4 },
        L: { name: 'tube length', q: 'length', unit: 'm', value: 3 },
        C: { name: 'sonic conductance of the signal valve', q: 'flowcond', unit: 'dm³/(s·bar)', value: 0.2 },
        pref: { name: 'reference pressure (ISO 8778, absolute)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_\\text{ref}' }
      },
      note: 'The volume of the tube over the conductance filling it. The delay to a pilot switching pressure of about 2 bar at a 6 bar supply is roughly 0.29 τ (see the time-delay valve for the exact relation); add the pilot chamber\'s volume for short tubes.',
      practice: { unknowns: ['tau', 'L'] },
      stories: { tau: 'A signal valve with C = {C} fills {L} of tube of bore {d}. What is the time constant of the signal line?', L: 'A signal line of bore {d}, fed through C = {C}, may have a time constant of at most {tau}. How long may it be?' }
    }
  ],
  examples: [
    {
      title: 'Too heavy to press',
      q: 'A designer wants a push-button poppet valve with a 15 mm seat to drive a large cylinder directly at 6 bar. What force would the operator need?',
      steps: [
        'Pressure force on the seat: $6\\times10^5 \\times \\pi \\times 0.015^2/4 = 106$ N.',
        'Plus the return spring, perhaps 15 N: about 120 N — the weight of a 12 kg mass, on one thumb.'
      ],
      a: 'About 120 N: far too much. A small push button piloting a large power valve (indirect control) needs a few newtons.'
    },
    {
      title: 'How long may the signal tube be?',
      q: 'A signal valve ($C = 0.2$ dm³/(s·bar)) pilots a power valve through 4 mm-bore tube. How long are the time constant and the delay (about 0.29 τ to reach 2 bar at 6 bar supply) for 3 m and for 20 m of tube?',
      steps: [
        '3 m: $V = \\pi \\times 0.004^2/4 \\times 3 = 3.77\\times10^{-5}$ m³; $\\tau = 3.77\\times10^{-5}/(0.2\\times10^{-8} \\times 10^5) = 0.19$ s; delay ≈ 0.054 s.',
        '20 m: $\\tau = 1.26$ s; delay ≈ 0.36 s.'
      ],
      a: 'About 0.05 s for 3 m and 0.36 s for 20 m — signal lines of a few metres are harmless; tens of metres are noticed, and a larger signal valve or thinner tube helps.'
    }
  ],
  quiz: [
    { q: 'What force opens an unbalanced poppet valve with a 12 mm seat at 6 bar gauge, ignoring its spring?', answer: 68, unit: 'N', tol: 0.03,
      why: '6×10⁵ × π × 0.012²/4 = 67.9 N.' },
    { q: 'In an indirect circuit, a signal on pilot port 12 of a 3/2 valve…', choices: ['connects 1 to 2', 'connects 1 to 4', 'vents 2 to 3', 'connects 1 to 3'], a: 0,
      why: 'Pilot port numbers name the connection they make: 12 connects 1 with 2, 14 connects 1 with 4.' },
    { q: 'In a pneumatic circuit diagram drawn to ISO 1219, what is at the bottom?', choices: ['The actuators', 'The power valves', 'The energy supply and service unit', 'The limit valves'], a: 2,
      why: 'Diagrams show energy flowing upwards: supply, signal elements, processing, power valves, actuators.' },
    { q: 'Lengthening the signal tube of an indirect circuit delays the start of the stroke but hardly changes the stroke itself.', a: true,
      why: 'The tube only has to fill to the pilot pressure; once the power valve has switched, the working air takes its short path from the power valve to the cylinder.' },
    { q: 'When is direct control a sensible choice?', choices: ['A 100 mm cylinder 20 m from the operator', 'A small cylinder close to the operator, with no logic needed', 'Any circuit with a sequence', 'Whenever the cylinder must be fast'], a: 1,
      why: 'Direct control is simple and quick for small cylinders nearby; size, distance and logic all favour indirect control.' }
  ],
  applications: ['Manual fixtures and presses with a small cylinder beside the operator.', 'Foot-pedal clamps on workbenches.', 'Every machine where operator buttons, limit valves or a PLC command power valves at the cylinders.', 'Solenoid valves: indirect control with an electrical signal.'],
  sim: 'fv-direct'
},

{
  id: 'speed-control-circuits', parent: 'basic-control', title: 'Speed control circuits', level: 2,
  short: 'The standard ways to set a cylinder\'s speed: meter-out flow controls at both ports, one direction only, throttling silencers in the valve\'s exhausts, meter-in for single-acting cylinders, quick-exhaust valves for more speed, and two-speed circuits that slow down near the end.',
  keywords: ['speed control circuit', 'meter-out', 'meter-in', 'exhaust throttling', 'throttle silencer', 'fast approach', 'two-speed', 'single-acting speed control', 'stroke time', 'speed ratio'],
  prereq: ['flow-control-pneu', 'direct-control', 'quick-exhaust'],
  related: ['pneumatic-cushioning', 'soft-start', 'stick-slip', 'cylinder-speed-pneu', 'valve-sizing', 'kinetic-energy-limits', 'air-saving-circuits', 'hydraulics:meter-in-out'],
  body: `
Once a cylinder moves, the next question is always "how fast?" — fast enough for the cycle time, slow enough not to smash the end caps, the part or a hand. Pneumatics offers a small toolbox of circuits for it.

### 1. Meter-out in both directions
Two one-way flow controls, one screwed into each cylinder port, each throttling the air leaving its chamber. Each stroke has its own adjustment, and the speed is steady and nearly independent of the load (see [[flow-control-pneu]]). This is the default for double-acting cylinders. With a choked throttle a stroke takes about

$$t = \\frac{A\\,s}{C\\,p_\\text{ref}}$$

plus the start delay, where $A$ is the exhausting area. Because the extension exhausts the smaller annulus, equal settings make the rod **extend faster** than it retracts, by the ratio $D^2/(D^2 - d^2)$ — about 1.16 for a 32 mm cylinder with a 12 mm rod.

### 2. One direction only
A single flow control on one port: one stroke throttled, the other at full speed — a slow clamping stroke and a fast return, for example.

### 3. Throttling at the valve's exhausts
Throttle silencers in ports 3 and 5 of a 5/2 valve throttle each stroke's exhaust — meter-out, adjusted at the valve. It is cheap and keeps the adjustment in one place, but the tube between valve and cylinder is now on the cylinder side of the throttle: a long tube adds a soft, compressible volume and the control is less stiff than with flow controls at the cylinder. Which port does what follows from the valve: with port 4 feeding the cap end, port 3 (exhausting 2, the rod end) sets the extension speed.

### 4. Single-acting cylinders
The only working port carries both strokes. A one-way flow control throttling the incoming air slows the extension (meter-in); turned round, it slows the spring return. Two back to back set both.

### 5. More speed, and two speeds
- Larger valve, shorter or wider tubes, or a [[quick-exhaust]] valve on the exhausting port.
- **Fast approach, slow finish:** the exhaust passes a free path until a cam or limit valve near the end of the stroke switches a 2/2 bypass shut; the last few centimetres run through the throttle. Used for pressing and joining, where the tool must arrive gently.
- **End-position cushioning** built into the cylinder takes the energy out of the last millimetres ([[pneumatic-cushioning]]).

| Circuit | Controls | Use |
|---|---|---|
| Meter-out, both ports | each stroke, load-independent | standard double-acting |
| Meter-out, one port | one stroke | slow stroke + fast return |
| Throttle silencers at 3 and 5 | each stroke, at the valve | cheap, short tubes |
| Meter-in | extension of single-acting | single-acting, small volumes |
| QEV | more speed on one stroke | long tubes, weak spring returns |
| Bypass valve near the end | two speeds | pressing, joining |

> [!warn] Speed settings only work once the exhausting chamber holds air. After the supply has been off, the first stroke can run away at full speed. Pressurise machines through a soft-start valve and keep clear of the stroke (see [[soft-start]]).
`,
  ideas: [
    'Meter-out flow controls at both ports are the standard: each stroke set separately, speed nearly independent of load.',
    'A choked exhaust gives a stroke time of about A·s/(C·p_ref) plus the start delay.',
    'With equal settings a cylinder extends faster than it retracts, by D²/(D² − d²).',
    'Throttle silencers in the valve exhausts are cheap meter-out, softer with long tubes.',
    'Single-acting cylinders use one-way flow controls in their only port; QEVs and bypass valves add speed or a second speed.'
  ],
  pitfalls: [
    'Equal throttle settings give equal stroke speeds — The exhausted areas differ: extending exhausts the annulus, so it runs faster by D²/(D² − d²).',
    'Throttle silencers at the valve work exactly like flow controls at the cylinder — The tube between them becomes part of the cushion on the cylinder side; with long tubes the motion is softer and less steady.',
    'Speed control makes the first stroke after switching on safe — With the exhausting chamber empty there is no back-pressure to throttle; only a soft-start valve tames it.'
  ],
  formulas: [
    {
      name: 'Exhaust conductance for a stroke time',
      expr: 'C = A*s/(pref*t)', tex: 'C = \\dfrac{A\\,s}{p_\\text{ref}\\,t}',
      vars: {
        C: { name: 'sonic conductance of the exhaust path', q: 'flowcond', unit: 'dm³/(s·bar)' },
        A: { name: 'area of the exhausting chamber', q: 'area', unit: 'cm²', value: 16.49 },
        s: { name: 'stroke', q: 'length', unit: 'mm', value: 200 },
        pref: { name: 'reference pressure (ISO 8778, absolute)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_\\text{ref}' },
        t: { name: 'stroke time (without the start delay)', q: 'time', unit: 's', value: 1 }
      },
      note: 'Meter-out with a choked throttle (exhausting chamber above about p_atm/b). The start delay — the time for the exhausting chamber to blow down — comes on top.',
      practice: { unknowns: ['C', 't'] },
      stories: { C: 'A cylinder exhausts an area of {A} over a stroke of {s}. The stroke should take {t}. What conductance must the exhaust path have?' }
    },
    {
      name: 'Extension and retraction speeds with equal meter-out settings',
      expr: 'r = D^2/(D^2 - d^2)', tex: 'r = \\dfrac{D^2}{D^2 - d^2}',
      vars: {
        r: { name: 'extending speed ÷ retracting speed' },
        D: { name: 'bore', q: 'length', unit: 'mm', value: 50 },
        d: { name: 'rod diameter', q: 'length', unit: 'mm', value: 20 }
      },
      note: 'Each stroke\'s speed is C·p_ref divided by the area it exhausts: the annulus when extending, the full piston when retracting.',
      stories: { r: 'A cylinder of bore {D} with a rod of {d} has equal meter-out throttles on both ports. How much faster does it extend than retract?' }
    }
  ],
  examples: [
    {
      title: 'A one-second stroke',
      q: 'A 50 mm cylinder (20 mm rod, 200 mm stroke) must extend in about 1 s under meter-out control. What exhaust conductance is needed, and how fast will it retract with the same setting on the other port?',
      steps: [
        'Extending exhausts the annulus: $A_2 = 16.5$ cm².',
        '$C = A s/(p_\\text{ref} t) = 16.49\\times10^{-4} \\times 0.2/(10^5 \\times 1) = 3.30\\times10^{-9}$ m³/(s·Pa) = 0.33 dm³/(s·bar).',
        'Retracting exhausts the full piston (19.6 cm²): $t = 19.63\\times10^{-4} \\times 0.2/(3.30\\times10^{-9} \\times 10^5) = 1.19$ s — the ratio $50^2/(50^2 - 20^2) = 1.19$.'
      ],
      a: 'About 0.33 dm³/(s·bar); the retraction then takes about 1.2 s. Open the other throttle a little to match the strokes.'
    }
  ],
  quiz: [
    { q: 'A 5/2 valve feeds the cap end from port 4 and the rod end from port 2. Which exhaust-port throttle sets the extension speed?', choices: ['Port 3', 'Port 5', 'Both', 'Neither'], a: 0,
      why: 'Extending, 1 is connected to 4 and 2 to 3: the rod end exhausts through port 3.' },
    { q: 'With equal meter-out settings, which stroke of a double-acting cylinder is faster?', choices: ['Extension', 'Retraction', 'Both the same', 'It depends only on the load'], a: 0,
      why: 'Extending exhausts the smaller annulus, and a choked throttle passes a fixed volume, so the piston moves faster.' },
    { q: 'By what ratio does a 32 mm cylinder with a 12 mm rod extend faster than it retracts with equal meter-out throttles?', answer: 1.16, tol: 0.02,
      why: 'r = 32²/(32² − 12²) = 1024/880 = 1.16.' },
    { q: 'After the air supply has been off, the first stroke of a meter-out controlled cylinder may run at full speed.', a: true,
      why: 'The exhausting chamber is empty, so there is no back-pressure for the throttle to hold. Soft-start valves pressurise the system slowly for this reason.' }
  ],
  applications: ['Setting stroke times on packaging and assembly machines.', 'Slow clamping with fast release, and gentle arrival of pressing tools.', 'Doors and covers that must close slowly for safety.', 'Fast ejectors with quick-exhaust valves.'],
  sim: ['fv-meter', 'fv-qev']
},

{
  id: 'logic-functions', parent: 'basic-control', title: 'Logic with air: AND, OR, NOT', level: 2,
  short: 'Pneumatic signals are binary — pressure or no pressure — so valves can compute: a shuttle valve is OR, a two-pressure valve or two valves in series is AND, a normally open valve is NOT, and a double-pilot valve remembers. Boolean algebra designs and simplifies such circuits, as it does electrical ones.',
  keywords: ['pneumatic logic', 'Boolean algebra', 'AND', 'OR', 'NOT', 'NAND', 'NOR', 'INHIBIT', 'truth table', 'De Morgan', 'logic diagram', 'interlock', 'fluidics'],
  prereq: ['shuttle-valve', 'two-pressure-valve', 'direct-control', 'electronics:boolean-algebra'],
  related: ['memory-circuits', 'time-delay-valve', 'two-hand-control', 'cascade-method', 'plc-control', 'ladder-diagrams', 'electronics:logic-gates', 'electronics:karnaugh-maps'],
  body: `
A signal line either carries pressure or it does not. Call pressure 1 and no pressure 0 and the valves of a circuit become logic gates — the same algebra George Boole wrote down in 1854 and electronics runs on today ([[electronics:boolean-algebra]]).

### The elements
| Function | Boolean | Pneumatic element | Output is 1 when |
|---|---|---|---|
| YES (identity) | $Y = a$ | 3/2 NC valve piloted by $a$ | $a$ is 1 |
| NOT | $Y = \\lnot a$ | 3/2 NO valve piloted by $a$ | $a$ is 0 |
| AND | $Y = a \\land b$ | two-pressure valve, or two 3/2 valves in series | both are 1 |
| OR | $Y = a \\lor b$ | shuttle valve | either is 1 |
| NAND, NOR | $\\lnot(a \\land b)$, $\\lnot(a \\lor b)$ | AND or OR followed by a NO valve | — |
| INHIBIT | $Y = a \\land \\lnot b$ | 3/2 NO valve fed by $a$, piloted by $b$ | $a$ is 1 and $b$ is 0 |
| MEMORY | set/reset | 5/2 double-pilot valve | last signal was "set" |

A NOT needs its own supply, because a 1 must come from somewhere when the input is 0; the other elements pass on the air of their inputs. [[shuttle-valve|OR]] and [[two-pressure-valve|AND]] are passive, and memory is the [[memory-circuits|impulse valve]].

### Algebra that saves valves
The rules are those of switching logic: $a \\land 1 = a$, $a \\lor 0 = a$, $a \\lor a \\land b = a$ (absorption), and De Morgan's two laws,

$$\\lnot(a \\lor b) = \\lnot a \\land \\lnot b, \\qquad \\lnot(a \\land b) = \\lnot a \\lor \\lnot b.$$

"Stop if either door is open" ($\\lnot a \\land \\lnot b$ with $a, b$ = door open) can be two NO valves in series — or one shuttle valve and one NO valve. A function of $n$ signals has a truth table of $2^n$ rows; with more than three or four signals a Karnaugh map ([[electronics:karnaugh-maps]]) finds the smallest circuit.

### One signal or two
An OR circuit lets any one of several signals start a movement: an operator at either end of a conveyor, manual or automatic. An AND demands two: start **and** guard closed, clamp **and** part present, drill back **and** timer run out — the interlocks of a machine. Requiring two push buttons (an AND) keeps both hands busy, but a plain AND is not a safety two-hand control: one button can be wedged down, and nothing checks that both were pressed together. That needs a two-hand control block to ISO 13851:2019 ([[two-hand-control]]).

### Designing for the safe zero
In pneumatics a burst tube, a failed supply or an unplugged line all read as 0. Good circuits make 0 the safe state: movements that can hurt need a signal to happen, and a stop works by taking a permission signal away, so that a broken line stops the machine rather than disabling the stop.

> [!note] Moving-part air logic — valves like these — still runs machines in explosive atmospheres, mines and simple fixtures. Most machines now do the logic in a PLC and use air only for power ([[plc-control]]).
`,
  ideas: [
    'Pressure is 1, no pressure 0: valves compute Boolean functions.',
    'Shuttle valve = OR, two-pressure valve or series valves = AND, 3/2 NO valve = NOT, double-pilot valve = memory.',
    'A NOT needs its own supply; OR and AND pass on their inputs\' air.',
    'De Morgan\'s laws and Karnaugh maps simplify circuits; n signals give 2ⁿ truth-table rows.',
    'A broken line reads 0, so design dangerous movements to need a 1 and stops to work by removing pressure.'
  ],
  pitfalls: [
    'An AND of two push buttons is a two-hand safety control — It checks neither simultaneity nor release, and one button can be tied down; safety needs ISO 13851 devices.',
    'A NOT element can take its air from its input — When the input is 0 there is no air to pass on; a NOT is a normally open valve fed from the supply.',
    'Any Boolean expression is fine as long as the truth table is right — Pneumatic elements have delays, and a signal that is still present when the next step needs its opposite blocks the circuit (see signal overlap); timing matters as much as logic.'
  ],
  formulas: [
    {
      name: 'Rows of a truth table',
      expr: 'N = 2^n', tex: 'N = 2^n',
      vars: {
        N: { name: 'rows (input combinations)', int: true },
        n: { name: 'number of input signals', int: true, value: 3, min: 1, max: 20 }
      },
      note: 'Every input is 0 or 1, so n inputs combine in 2ⁿ ways.',
      stories: { N: 'A logic circuit has {n} input signals. How many rows does its truth table have?' }
    },
    {
      name: 'How many logic functions exist',
      expr: 'M = 2^N', tex: 'M = 2^N',
      vars: {
        M: { name: 'number of different logic functions', int: true },
        N: { name: 'rows of the truth table (2ⁿ)', int: true, value: 4, min: 1, max: 32 }
      },
      note: 'Each row\'s output can be 0 or 1 independently. Two inputs (4 rows) allow 16 functions: AND, OR, NAND, NOR, XOR, INHIBIT and the rest.',
      stories: { M: 'A truth table has {N} rows. How many different logic functions could it describe?' }
    }
  ],
  examples: [
    {
      title: 'A door with two buttons and a lock',
      q: 'A door cylinder may open when the inside button $a$ or the outside button $b$ is pressed, but only while the release signal $c$ is present. Write the function and choose the valves.',
      steps: [
        '$Y = (a \\lor b) \\land c$.',
        'A shuttle valve combines $a$ and $b$; its output and $c$ go to a two-pressure valve; the AND output pilots the door\'s power valve (port 14).',
        'Check with the truth table: 8 rows ($2^3$); the output is 1 in the three rows with $c = 1$ and at least one of $a$, $b$.'
      ],
      a: '$Y = (a \\lor b) \\land c$: one shuttle valve, one two-pressure valve, one power valve.'
    },
    {
      title: 'De Morgan saves a valve',
      q: 'A conveyor may run only while neither guard $a$ nor guard $b$ is open (the signals are 1 when a guard is open). Two NO valves in series would do it. Find a version with one NO valve.',
      steps: [
        'Required: $Y = \\lnot a \\land \\lnot b$.',
        'De Morgan: $\\lnot a \\land \\lnot b = \\lnot(a \\lor b)$.',
        'So: a shuttle valve (OR of the two guard signals) piloting one 3/2 NO valve fed from the supply.'
      ],
      a: 'One shuttle valve and one NO valve: $Y = \\lnot(a \\lor b)$. But note the snag: with these signals a broken guard line reads 0, "closed", and lets the conveyor run. Guard signals that are 1 when the guard is closed, combined with an AND, fail safe.'
    }
  ],
  quiz: [
    { q: 'How many rows does the truth table of a three-input logic function have?', answer: 8, tol: 0,
      why: '2³ = 8 input combinations.' },
    { q: 'Which pneumatic element gives $Y = a \\land \\lnot b$ (INHIBIT)?', choices: ['A shuttle valve', 'A two-pressure valve', 'A 3/2 normally open valve fed by $a$ and piloted by $b$', 'A 5/2 impulse valve'], a: 2,
      why: 'The NO valve passes $a$ to the output until $b$ pilots it shut.' },
    { q: 'By De Morgan\'s law, $\\lnot(a \\lor b)$ equals…', choices: ['$\\lnot a \\lor \\lnot b$', '$\\lnot a \\land \\lnot b$', '$a \\land b$', '$\\lnot a \\land b$'], a: 1,
      why: 'Not (a or b) is true only when both are false: ¬a ∧ ¬b.' },
    { q: 'Why does a pneumatic NOT element need a connection to the supply, while an OR does not?', choices: ['It uses more air', 'When its input is 0 it must still deliver a 1, and that air has to come from somewhere', 'Because of its spring', 'It does not; both are passive'], a: 1,
      why: 'Passive elements pass on their inputs\' air; a NOT must produce pressure when its input has none.' },
    { q: 'An AND built from two valves in series and one built with a two-pressure valve behave identically in every respect.', a: false,
      why: 'In series the signal passes both valves and vents through the second; the second valve only sees air while the first is operated. The two-pressure valve takes two independent signals.' }
  ],
  applications: ['Interlocks: start only with guards closed and the part clamped.', 'Controls from several stations (OR) and with permissions (AND).', 'Air-only machine controls in explosive atmospheres and mines.', 'Designing the logic that a PLC program will later implement.'],
  history: 'George Boole published his algebra of logic in 1854. In 1938 Claude Shannon showed that it describes relay switching circuits, and the same algebra was soon applied to air valves. In 1959 engineers at the US Army\'s Diamond Ordnance Fuze Laboratories demonstrated fluidic amplifiers — logic with jets of air and no moving parts — which had a brief vogue in the 1960s.',
  sim: { id: 'fv-logic', params: { mode: 'not' } }
},

{
  id: 'memory-circuits', parent: 'basic-control', title: 'Memory: the impulse valve', level: 2,
  short: 'A 5/2 valve with a pilot on each side and no spring stays where its last signal put it: a short pulse on 14 sets it, a pulse on 12 resets it, and with both signals present it does not move. It is pneumatic memory — convenient, but it also remembers through an air failure.',
  keywords: ['memory', 'impulse valve', 'double-pilot valve', 'bistable', 'set', 'reset', 'flip-flop', 'latch', 'self-holding', 'signal overlap', 'restart', 'manual override'],
  prereq: ['logic-functions', 'direct-control', 'way-valves'],
  related: ['signal-overlap', 'cascade-method', 'shift-register', 'soft-start', 'emergency-stop-pneu', 'solenoid-valves', 'electronics:latches', 'electronics:flip-flops'],
  body: `
Press a button for a moment and the cylinder should go out and **stay** out until something tells it to come back. A spring-return valve cannot do that: it returns the moment the button is released. The pneumatic answer is the **impulse valve** — a 5/2 (or 3/2) valve with a pilot on each end and no spring, also called a double-pilot or bistable valve.

### Set, reset, and both
- A signal on **14** pushes the spool across: 1 → 4, and the cylinder extends. When the signal goes, the spool stays — friction or a detent holds it.
- A signal on **12** pushes it back: 1 → 2, the cylinder retracts, and again it stays.
- A **short pulse** is enough: the pilot pressure must beat the spool friction, $p = F/(\\pi d^2/4)$, for the few milliseconds the spool needs to travel.
- With **both** signals present the spool is pushed equally from both sides and does not move: whichever position it had, it keeps.

| 14 (set) | 12 (reset) | Valve |
|---|---|---|
| 1 | 0 | switches to 14 |
| 0 | 1 | switches to 12 |
| 0 | 0 | stays (memory) |
| 1 | 1 | no change |

It is the pneumatic set–reset flip-flop ([[electronics:latches]]). That last row matters: if the set signal is still present — a limit valve still pressed, an operator still holding the button — when the reset arrives, the reset is simply ignored. In a sequence this is the classic trap of [[signal-overlap]], which the [[cascade-method]] and [[shift-register|step sequencers]] were invented to avoid.

### Memory without an impulse valve
A spring-return valve can be made to hold itself, like a relay's self-holding contact: its own output is fed back through a shuttle valve to its pilot, and a normally open valve in that feedback line breaks it to reset. Depending on how set and reset are combined, the circuit is **set-dominant** or **reset-dominant** when both are present — and unlike the impulse valve it forgets when the air fails, which is often exactly what is wanted.

### Memory and safety
An impulse valve keeps its position through an air failure. When the air returns, the cylinder moves at once to where the valve points — possibly finishing a stroke that was interrupted, possibly after someone has pushed the valve's manual override while the air was off. A spring-return valve instead comes back to a known position. Which behaviour is safer depends on the machine: a clamp holding a part may need memory; an axis that could crush a hand needs a predictable start. Either way, the restart must be designed, not left to chance ([[soft-start]], [[emergency-stop-pneu]]).

> [!warn] After an air failure, an impulse valve can make a cylinder move the moment air returns. Before switching the air back on, check where every memory valve points, clear the machine of people, and pressurise it slowly through a soft-start valve.
`,
  ideas: [
    'An impulse valve has a pilot on each side and no spring: it stays in its last position.',
    'A short pulse on 14 sets it, a pulse on 12 resets it; with both present it does not move.',
    'The pilot pressure must beat the spool friction: p = F/(π d²/4), typically 1–2 bar.',
    'A signal still present blocks the opposite one — the root of signal overlap in sequences.',
    'It remembers through an air failure, so the restart must be designed.'
  ],
  pitfalls: [
    'The newest signal always wins — With equal pilot areas the spool does not move while both signals are present; the older signal must go first.',
    'An impulse valve needs its signal held for the whole stroke — A short pulse is enough; the valve stays switched and the cylinder completes its stroke on its own.',
    'After an air failure everything starts from its normal position — An impulse valve keeps its last position (or one set by hand in the meantime), and the cylinder moves there as soon as the air returns.'
  ],
  formulas: [
    {
      name: 'Pilot pressure needed to move the spool',
      expr: 'p = F/(pi*d^2/4)', tex: 'p = \\dfrac{F}{\\pi d^2/4}',
      vars: {
        p: { name: 'minimum pilot pressure (gauge)', q: 'pressure', unit: 'bar' },
        F: { name: 'spool friction (and detent) force', q: 'force', unit: 'N', value: 8 },
        d: { name: 'pilot piston diameter', q: 'length', unit: 'mm', value: 10 }
      },
      note: 'For an impulse valve the same pressure on the opposite pilot cancels it, so the difference of the pilot pressures must exceed this. Catalogue minimum pilot pressures are typically 1.5–2.5 bar.',
      stories: { p: 'An impulse valve\'s spool has {F} of friction and pilot pistons of {d}. What pilot pressure moves it?' }
    },
    {
      name: 'Time for the spool to travel',
      expr: 't = sqrt(2*m*x/(p*pi*d^2/4 - F))', tex: 't = \\sqrt{\\dfrac{2 m x}{p\\,\\pi d^2/4 - F}}',
      vars: {
        t: { name: 'travel time', q: 'time', unit: 'ms' },
        m: { name: 'spool mass', q: 'mass', unit: 'g', value: 20 },
        x: { name: 'spool travel', q: 'length', unit: 'mm', value: 4 },
        p: { name: 'pilot pressure (gauge)', q: 'pressure', unit: 'bar', value: 6 },
        d: { name: 'pilot piston diameter', q: 'length', unit: 'mm', value: 10 },
        F: { name: 'spool friction force', q: 'force', unit: 'N', value: 8 }
      },
      note: 'Constant acceleration under the net pilot force, once the pilot chamber is full. Filling the pilot line and chamber usually takes longer than the travel itself, so real switching times are 5–30 ms.',
      stories: { t: 'A spool of {m} must travel {x}. Its pilot piston of {d} sees {p} against {F} of friction. How long does the travel take?' }
    }
  ],
  examples: [
    {
      title: 'How short can the pulse be?',
      q: 'An impulse valve has pilot pistons of 10 mm, a 20 g spool with 4 mm travel and 8 N of friction. What pilot pressure moves it, and how long does the spool take at 6 bar?',
      steps: [
        'Minimum: $p = 8/(\\pi \\times 0.01^2/4) = 1.02\\times10^5$ Pa ≈ 1 bar.',
        'At 6 bar the pilot force is $6\\times10^5 \\times 7.85\\times10^{-5} = 47$ N; the net force 39 N.',
        '$t = \\sqrt{2 \\times 0.02 \\times 0.004/39} = 2.0\\times10^{-3}$ s.'
      ],
      a: 'About 1 bar starts it moving; at 6 bar the spool crosses in about 2 ms — so a pulse of some tens of milliseconds, enough to fill the pilot line, is plenty.'
    }
  ],
  quiz: [
    { q: 'An impulse valve is in the 14 position. S1 (on 14) is still held when S2 (on 12) is pressed. What happens?', choices: ['The valve switches to 12', 'Nothing: with both pilots pressurised the spool does not move', 'The valve centres', 'The valve oscillates'], a: 1,
      why: 'Equal pressures on equal pilots cancel. The reset waits until S1 is released — signal overlap.' },
    { q: 'What minimum pilot pressure does a spool with 12 N of friction and 12 mm pilot pistons need?', answer: 1.06, unit: 'bar', tol: 0.03,
      why: 'p = 12/(π × 0.012²/4) = 12/1.131×10⁻⁴ = 1.06×10⁵ Pa.' },
    { q: 'The air supply fails while a cylinder driven by an impulse valve is in mid-stroke, and returns later. What happens?', choices: ['The cylinder returns to its start position', 'The cylinder continues to where the valve points', 'Nothing until a new signal arrives', 'The valve centres itself'], a: 1,
      why: 'The valve kept its position; as soon as there is air, the cylinder is driven there. A spring-return valve would instead go to its normal position.' },
    { q: 'An impulse valve needs its set signal for the whole length of the cylinder\'s stroke.', a: false,
      why: 'Once switched, it stays; a pulse long enough to fill the pilot and move the spool — tens of milliseconds — is enough.' }
  ],
  applications: ['Starting a cycle with a short button press.', 'Sequence controls: each step\'s power valve remembers until the next step resets it.', 'Clamps that must stay closed if the air fails.', 'Pneumatic cascade and step-sequencer circuits.'],
  sim: 'fv-memory'
},

{
  id: 'pressure-sequence', parent: 'basic-control', title: 'Pressure-dependent control', level: 2,
  short: 'Starting the next step when a pressure — and so a force — has been reached: a pressure sequence valve or a pressure switch watches the cylinder and signals when the clamp presses hard enough. It works only with a setting above the running pressure, below the supply, and usually together with a limit valve.',
  keywords: ['pressure-dependent control', 'pressure sequence valve', 'sequence valve', 'clamping force', 'embossing', 'pressing', 'set pressure', 'back-pressure', 'limit valve', 'AND', 'force control'],
  prereq: ['direct-control', 'memory-circuits', 'pressure-switches', 'cylinder-force'],
  related: ['logic-functions', 'flow-control-pneu', 'pressure-regulators', 'displacement-step-diagram', 'grippers', 'hydraulics:sequence-valve', 'hydraulics:sequencing-circuit'],
  body: `
Some steps should end on force, not position: an embossing die must press until the full force is on the part; a glued joint must be clamped hard before the adhesive is cured; a gripper must be proved to have gripped. A limit valve only says the rod has arrived — not how hard it is pushing. Since force is pressure times area, the answer is to watch the pressure.

### The pressure sequence valve
A pneumatic **pressure sequence valve** is a 3/2 valve held shut by an adjustable spring and piloted by the pressure to be watched (port 12). When that pressure reaches the setting $p_s$, the valve opens and passes a signal; below the setting (less a small hysteresis) it closes again. An electrical pressure switch does the same job for a PLC ([[pressure-switches]]). The classic circuit: a start button sets an impulse valve, the clamp extends and meets the part, the cap-end pressure climbs, the sequence valve opens and resets the impulse valve, and the clamp releases having pressed with about

$$F = p_s A_1 - p_B A_2$$

(gauge pressures). If the rod side has vented, that is simply $p_s A_1$: a 50 mm clamp set to 4.6 bar presses with 900 N.

### Why the setting is not the whole story
- **The running pressure.** The cap end is not near zero while the cylinder moves. It carries the load plus the rod side's back-pressure: $p_A = (F + p_B A_2)/A_1$. Under meter-out control the exhausting chamber is held at several bar, and the cap end runs at 70–95 % of the supply even with no load. At the very start of a stroke it shoots up almost to the supply while the rod side is still full. A cap-end signal alone cannot tell "moving" from "clamped".
- **Therefore: a limit valve in series.** A roller valve at the end position feeds (or is fed by) the sequence valve — an AND — so the pressure signal counts only once the rod has arrived. And the setting must still sit clearly above the running pressure, or the valve is already open when the rod arrives and the clamp lets go at once, before its force has built up.
- **Back-pressure at the moment of release.** While the rod side is still venting, the real force is $p_s A_1 - p_B A_2$, less than the setting suggests.
- **The supply.** The setting must stay below the lowest supply pressure the machine will ever see — if the supply sags below it, the clamp never releases and the machine waits for ever. A pressure regulator for the clamp circuit gives a steady margin.
- **Hysteresis and spikes.** A sharp impact at the part can spike the pressure past the setting for a moment; a small throttle in the pilot line smooths it.

Where the force really matters, better signals exist: a pressure switch on the rod side that reports when it has **emptied** (the full force is then on), a differential pressure measurement across the piston, a load cell — or a timer after the end position.

> [!warn] A clamp that releases on pressure also presses with that force on anything in its way, fingers included. Guard the clamping area, keep the force no higher than the job needs (a regulator), and remember that if the signal never comes the clamp stays shut — exhaust and lock out the circuit before freeing a part by hand.
`,
  ideas: [
    'Force is pressure times area, so a pressure level can end a step when a force is reached.',
    'A pressure sequence valve is a 3/2 valve held shut by an adjustable spring and piloted by the watched pressure.',
    'The setting must lie above the running pressure (load plus back-pressure) and below the lowest supply.',
    'A cylinder\'s driving chamber runs near the supply while moving, so a limit valve in series (AND) is the usual partner.',
    'At release the real force is p_s·A₁ − p_B·A₂; it equals p_s·A₁ only once the rod side has vented.'
  ],
  pitfalls: [
    'A sequence valve on the cap end measures the clamping force — It measures the cap-end pressure; while the rod side still holds air the force is p_s·A₁ − p_B·A₂, and while moving the pressure is high without any force on the part.',
    'Any setting between zero and the supply will do — Below the running pressure the valve fires during the stroke; above the lowest supply it never fires and the machine hangs.',
    'The pressure in a moving cylinder is low, because there is no load — The exhausting chamber\'s back-pressure must be overcome too; under meter-out the driving chamber runs close to the supply pressure.'
  ],
  formulas: [
    {
      name: 'Clamping force when the sequence valve switches',
      expr: 'F = ps*A1 - pB*A2', tex: 'F = p_s A_1 - p_B A_2',
      vars: {
        F: { name: 'force on the part', q: 'force', unit: 'N', signed: true },
        ps: { name: 'sequence valve setting (gauge)', q: 'pressure', unit: 'bar', value: 5.6, tex: 'p_s' },
        A1: { name: 'piston area', q: 'area', unit: 'cm²', value: 19.63, tex: 'A_1' },
        pB: { name: 'rod-end pressure at that moment (gauge)', q: 'pressure', unit: 'bar', value: 0.5, tex: 'p_B' },
        A2: { name: 'annulus area', q: 'area', unit: 'cm²', value: 16.49, tex: 'A_2' }
      },
      note: 'Friction neglected (at rest against the part it only reduces the force further). With the rod side vented, F = p_s·A₁.',
      practice: { unknowns: ['F', 'ps'] },
      stories: { F: 'A clamp (piston {A1}, annulus {A2}) releases when its cap end reaches {ps}, while the rod end still holds {pB}. What force was on the part?', ps: 'A clamp with a piston of {A1} must press with {F}; the rod end holds {pB}. What must the sequence valve be set to?' }
    },
    {
      name: 'Cap-end pressure while the cylinder moves',
      expr: 'pA = (F + pB*A2)/A1', tex: 'p_A = \\dfrac{F + p_B A_2}{A_1}',
      vars: {
        pA: { name: 'cap-end pressure (gauge)', q: 'pressure', unit: 'bar', tex: 'p_A' },
        F: { name: 'load plus friction', q: 'force', unit: 'N', value: 200 },
        pB: { name: 'rod-end back-pressure (gauge)', q: 'pressure', unit: 'bar', value: 4, tex: 'p_B' },
        A2: { name: 'annulus area', q: 'area', unit: 'cm²', value: 16.49, tex: 'A_2' },
        A1: { name: 'piston area', q: 'area', unit: 'cm²', value: 19.63, tex: 'A_1' }
      },
      note: 'Force balance at steady speed. The sequence valve must be set clearly above this running pressure.',
      stories: { pA: 'A cylinder (piston {A1}, annulus {A2}) moves against {F} with a meter-out back-pressure of {pB}. What is the cap-end pressure?' }
    }
  ],
  examples: [
    {
      title: 'Setting an embossing press',
      q: 'A 50 mm cylinder (20 mm rod) must emboss with 900 N before it returns. The supply varies between 5.5 and 6.5 bar gauge; while moving, the cap end runs at up to 4.4 bar. What should the sequence valve be set to, and is there room?',
      steps: [
        '$A_1 = \\pi \\times 0.05^2/4 = 19.6$ cm²; $p_s = F/A_1 = 900/1.963\\times10^{-3} = 4.58\\times10^5$ Pa ≈ 4.6 bar (with the rod side vented).',
        'Running pressure 4.4 bar: the setting is only 0.2 bar above it — too close; the valve would open at the first bump.',
        'Lowest supply 5.5 bar: 0.9 bar margin above the setting — acceptable.',
        'Better: a limit valve in series, so that the pressure signal counts only at the end position, and less back-pressure (a quick-exhaust valve on the rod end) to lower the running pressure.'
      ],
      a: 'About 4.6 bar, with a limit valve in series (AND) because the running pressure is almost as high.'
    },
    {
      title: 'When the rod side has not emptied',
      q: 'The same clamp is set to 5.6 bar, but under strong meter-out throttling its rod side still holds 5 bar when the cap end reaches the setting. What force does it release with?',
      steps: [
        '$F = p_s A_1 - p_B A_2 = 5.6\\times10^5 \\times 1.963\\times10^{-3} - 5\\times10^5 \\times 1.649\\times10^{-3}$.',
        '$F = 1100 - 825 = 275$ N.'
      ],
      a: 'About 275 N instead of the 1100 N the setting suggests — the signal came before the force.'
    }
  ],
  quiz: [
    { q: 'A 63 mm clamp must press with 1500 N (rod side vented). What should the sequence valve be set to?', answer: 4.81, unit: 'bar', tol: 0.02,
      why: 'A = π × 0.063²/4 = 31.2 cm²; p = 1500/3.117×10⁻³ = 4.81×10⁵ Pa.' },
    { q: 'Why is a pressure sequence valve usually combined with a limit valve at the end position?', choices: ['To save air', 'Because the driving chamber can reach the setting while the cylinder is starting or moving; the limit valve makes the pressure signal count only at the end', 'To make the clamp faster', 'Because sequence valves leak'], a: 1,
      why: 'The cap-end pressure is high at the start of a stroke and under meter-out; only together with the end-position signal (AND) does it mean "clamped".' },
    { q: 'The sequence valve is set to 6.5 bar and the supply is 6 bar. What happens?', choices: ['The clamp releases early', 'The clamp never releases', 'The clamp presses harder', 'The valve switches at 6 bar'], a: 1,
      why: 'The cap end can never exceed the supply, so the valve never opens: the machine waits for ever.' },
    { q: 'Under meter-out control, the cap-end pressure of a lightly loaded moving cylinder is typically far below the supply pressure.', a: false,
      why: 'The rod side holds a back-pressure of several bar; the cap end must exceed it by the area ratio, so it runs at 70–95 % of the supply.' },
    { q: 'A cylinder (A₁ = 19.6 cm², A₂ = 16.5 cm²) moves against 200 N with a rod-side back-pressure of 4 bar. What is its cap-end pressure (gauge)?', answer: 4.38, unit: 'bar', tol: 0.02,
      why: 'p_A = (200 + 4×10⁵ × 1.649×10⁻³)/1.963×10⁻³ = 860/1.963×10⁻³ = 4.38×10⁵ Pa.' }
  ],
  applications: ['Embossing, stamping and riveting presses that return when the force is reached.', 'Clamping before machining, with the force proved.', 'Gluing and pressing fixtures.', 'Proving a gripper has gripped before a robot moves.'],
  sim: 'fv-pseq'
}

);
