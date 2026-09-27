/* HYPER-PNEUMATICS · content/valves.js — the Valves branch: directional control valves (ports and positions,
 * operation, poppet and spool, solenoid and pilot valves, valve terminals), valve flow capacity (Cv, Kv and nominal
 * flow, ISO 6358 sonic conductance, sizing a valve for a cylinder) and the ISO 1219 symbols and port numbers.
 * Simulations in sims/valves.js. */
Hyper.add(

{
  id: 'way-valves', parent: 'directional-valves-pneu', title: 'Ports and positions: 2/2 to 5/3', level: 1,
  short: 'A directional valve is named by its ports and its positions — 3/2, 5/2, 5/3 — and drawn as one square per position. What each position connects decides what the cylinder does: extend, retract, hold, float or creep.',
  keywords: ['directional control valve', 'way valve', '2/2 valve', '3/2 valve', '4/2 valve', '5/2 valve', '5/3 valve', 'normally closed', 'normally open', 'closed centre', 'exhausted centre', 'pressurised centre', 'ports', 'positions', 'monostable', 'bistable'],
  prereq: ['pneumatic-cylinder', 'single-acting-cylinders', 'double-acting-cylinders'],
  related: ['valve-operation', 'port-numbering', 'iso-1219-pneu', 'poppet-spool', 'solenoid-valves', 'direct-control', 'memory-circuits', 'emergency-stop-pneu', 'pneumatic-spring', 'hydraulics:directional-valves', 'hydraulics:spool-positions'],
  body: `
A directional control valve decides where the air goes: from the supply into a cylinder, from the cylinder out to the atmosphere, or nowhere at all. Pneumatic valves are named by two numbers — the number of **ports** (working connections, not counting pilot ports) and the number of **positions** the valve can take. A 5/2 valve ("five-two") has five ports and two positions; a 5/3 valve has three positions.

### Reading the name and the symbol
The symbol draws one square per position. Inside each square, lines with arrowheads show which ports are joined and which way the air flows; a short T marks a blocked port. The ports are drawn on the square that is working in the state shown — on a circuit diagram, the rest position — and the operators sit at the ends: whatever is drawn at the left end pushes the left square into place. Read a valve by sliding its squares in your mind (see [[iso-1219-pneu]] and [[port-numbering]]).

| Valve | Ports | What it does | Typical use |
|---|---|---|---|
| 2/2 | 1, 2 | opens or shuts one path | shut-off, blow-off nozzles, vacuum on and off |
| 3/2 normally closed | 1, 2, 3 | output 2 fed when operated, vented to 3 at rest | single-acting cylinders, signal and pilot valves |
| 3/2 normally open | 1, 2, 3 | output 2 fed at rest, vented when operated | functions that must stay on without a signal |
| 4/2 | 1, 2, 4, 3 | two outputs, one shared exhaust | double-acting cylinders (older designs) |
| 5/2 | 1, 2, 4, 3, 5 | two outputs, an exhaust for each | the standard valve for a double-acting cylinder |
| 5/3 | 1, 2, 4, 3, 5 | as a 5/2, plus a centre position | stopping in mid-stroke, a defined safe state |

Why five ports rather than four? With separate exhausts 3 and 5, each side of the cylinder can be throttled or silenced on its own, and a five-port spool is easy to build. A 4/2 valve with one exhaust moves a cylinder just as well but gives less control.

### The three centres of a 5/3 valve
A 5/3 valve is usually spring-centred: with neither solenoid energised it sits in the middle, and what the middle connects is the point of choosing it.
- **Closed centre**: all five ports blocked. The cylinder stops and is held by the air trapped on both sides — but air is springy, so a change of load moves the rod, and any leak lets it drift (see [[pneumatic-spring]]). Good for short intermediate stops, not for precise holding.
- **Exhausted centre**: outputs 2 and 4 vented, 1 blocked. The cylinder is free: it can be pushed by hand, and a vertical load falls. Often combined with pilot-operated non-return valves at the cylinder ports, which close when their pilot air is vented and lock the air in.
- **Pressurised centre**: 1 feeds both 2 and 4. With a single-rod cylinder the forces do not balance: the rod is pushed out with the supply pressure times the **rod** area, about 68 N for a 12 mm rod at 6 bar, unless a regulator lowers one side.

### Monostable and bistable
A valve with a spring return goes back to its normal position the moment the signal ends: it is **monostable**. A 5/2 valve with a signal on each side and no spring stays where the last signal put it: it is **bistable** — an impulse or memory valve (see [[valve-operation]] and [[memory-circuits]]). A spring-centred 5/3 valve is monostable with three positions.

> [!key] Count the squares for the positions and the connections on one square for the ports; then ask what each square does to the actuator. That is the whole art of reading a valve.

> [!warn] A closed-centre valve traps pressure in the cylinder and its tubes: stored energy that can move the rod when a fitting is loosened. An exhausted centre lets loads fall. Before maintenance, exhaust every part of the circuit — including air trapped behind closed valves and non-return valves — support raised loads and lock out the supply.
`,
  ideas: [
    'A valve is named ports/positions: a 5/2 valve has five ports and two positions, and its symbol one square per position.',
    'The square drawn at the ports is the one working in the state shown; operators push the square next to them into place.',
    '3/2 valves drive single-acting cylinders and make signals; 5/2 valves drive double-acting cylinders, with a separate exhaust for each side.',
    'The centre of a 5/3 valve decides what happens between strokes: hold on trapped air (closed), float (exhausted) or creep out with p × rod area (pressurised).',
    'Spring-return valves are monostable; double-pilot or double-solenoid 5/2 valves are bistable memories.'
  ],
  pitfalls: [
    'A closed-centre valve holds a cylinder rigidly — Air is compressible: the rod moves when the load changes and drifts as air leaks. For a firm hold use a clamping unit, a brake or pilot-operated non-return valves.',
    'In a pressurised centre the forces balance because both sides have the same pressure — The piston area is larger than the annulus, so the rod is pushed out with the pressure times the rod area.',
    'The number of positions is the number of operators — A 5/2 valve with a solenoid and a spring has two positions and two operators, but an impulse valve with two solenoids also has two positions; a 5/3 has two solenoids and three positions.'
  ],
  formulas: [
    {
      name: 'Net push in a pressurised centre',
      expr: 'F = p*pi*d^2/4', tex: 'F = p_g\\,\\dfrac{\\pi d^2}{4}',
      vars: {
        F: { name: 'net force pushing the rod out', q: 'force', unit: 'N' },
        p: { name: 'supply pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        d: { name: 'rod diameter', q: 'length', unit: 'mm', value: 20 }
      },
      note: 'Both chambers at supply pressure: the piston area minus the annulus area leaves the rod area. Friction must be overcome before the rod creeps.',
      stories: { F: 'A cylinder with a {d} rod sits in the pressurised centre of a 5/3 valve at {p}. With what force is the rod pushed out?', d: 'A pressurised centre may push the rod out with no more than {F} at {p}. What is the largest rod diameter?' }
    }
  ],
  examples: [
    {
      title: 'A rod that will not stay put',
      q: 'A 50 mm cylinder with a 20 mm rod is stopped in mid-stroke with a 5/3 pressurised-centre valve at 6 bar. A load of 100 N pushes against extension and seal friction is about 30 N. What happens?',
      steps: [
        'Both chambers are at 6 bar gauge. The net push is the pressure times the rod area: $F = 6\\times10^5 \\times \\pi \\times 0.02^2/4 = 188$ N outwards.',
        'Against it: 100 N of load plus up to 30 N of friction, 130 N in all.',
        'Since 188 N > 130 N, the rod creeps out until the load or the end stop balances it.'
      ],
      a: 'It creeps outwards with a spare push of about 58 N. Use a closed or exhausted centre with non-return valves, a regulator on the cap side, or a double-rod cylinder.'
    },
    {
      title: 'Choosing a valve for a clamp',
      q: 'A pneumatic clamp holds a part while it is machined. If the electricity fails the clamp must stay closed. Which valve suits: a 5/2 solenoid valve with spring return, or a 5/2 double-solenoid valve?',
      steps: [
        'A spring-return valve falls back to its normal position when the coil loses power. It keeps the clamp closed only if the normal position is the clamping one — then the clamp opens whenever the coil is energised.',
        'A double-solenoid (impulse) valve keeps its last position when power fails: the clamp stays closed as long as air remains.',
        'Either works if chosen deliberately; what matters is to decide the safe state first and then pick the valve. Neither keeps the clamp closed if the air fails — that needs a non-return valve or a mechanical lock.'
      ],
      a: 'A double-solenoid 5/2 valve (it remembers its position), or a spring-return valve arranged so that its rest position clamps. Plan for air failure separately.'
    }
  ],
  quiz: [
    { q: 'A 5/2 valve has…', choices: ['five positions and two ports', 'five ports and two positions', 'two inlets and five outlets', 'five ports and two pilot signals'], a: 1,
      why: 'The first number counts the ports (1, 2, 3, 4, 5), the second the positions, drawn as two squares.' },
    { q: 'A cylinder stopped by a 5/3 closed-centre valve is held rigidly in place.', a: false,
      why: 'It is held by trapped air, which is compressible: the rod gives way when the load changes and creeps as air leaks.' },
    { q: 'With a 5/3 pressurised-centre valve at 6 bar gauge, with what net force is a 16 mm rod pushed out?', answer: 121, unit: 'N', tol: 0.03,
      why: 'F = p × rod area = 6×10⁵ × π × 0.016²/4 = 121 N.' },
    { q: 'Which centre of a 5/3 valve lets you push the rod by hand while the valve is centred?', choices: ['closed centre', 'exhausted centre', 'pressurised centre', 'none of them'], a: 1,
      why: 'With both outputs vented, only friction resists. The closed centre traps air on both sides; the pressurised centre pushes the rod out.' },
    { q: 'Why is a 5/2 valve usually preferred to a 4/2 valve for a double-acting cylinder?', choices: ['it gives more force', 'each side has its own exhaust, so it can be throttled or silenced separately', 'it uses less air', 'a 4/2 valve cannot reverse a cylinder'], a: 1,
      why: 'Both reverse the cylinder with the same force and air. The separate exhausts 3 and 5 are what the fifth port buys.' }
  ],
  problems: [
    { q: 'A 32 mm cylinder with a 12 mm rod sits in the pressurised centre of a 5/3 valve at 5 bar gauge. What net force pushes the rod out?', answer: 56.5, unit: 'N', tol: 0.02,
      steps: ['Only the rod area is unbalanced: $\\pi \\times 0.012^2/4 = 1.131\\times10^{-4}$ m².', '$F = 5\\times10^5 \\times 1.131\\times10^{-4} = 56.5$ N.'] }
  ],
  applications: ['5/2 valves drive the double-acting cylinders of almost every automated machine.', '3/2 valves as signal elements: push buttons, limit valves and pilot valves.', '5/3 closed-centre valves for intermediate stops of doors and slides; exhausted centres where parts must be positioned by hand.', '2/2 valves switching blow-off nozzles and vacuum.'],
  history: 'The ancestor of the spool valve is the steam engine\'s slide valve: William Murdoch\'s D slide valve of 1799 switched steam between the two ends of a cylinder and exhausted the other end — a 4/2 valve in today\'s language.',
  sim: 'valve-explorer'
},

{
  id: 'valve-operation', parent: 'directional-valves-pneu', title: 'How valves are operated', level: 1,
  short: 'Valves are switched by hand, by the machine (rollers and plungers), by solenoids or by pilot air — and brought back by a spring, held by a detent, or left where they are, which makes an impulse valve a memory.',
  keywords: ['valve actuation', 'push button', 'lever', 'roller', 'idle-return roller', 'solenoid', 'pilot', 'spring return', 'detent', 'impulse valve', 'memory valve', 'bistable', 'monostable', 'minimum pilot pressure', 'air spring'],
  prereq: ['way-valves', 'port-numbering'],
  related: ['solenoid-valves', 'poppet-spool', 'memory-circuits', 'signal-overlap', 'direct-control', 'emergency-stop-pneu', 'iso-1219-pneu', 'hydraulics:valve-actuation'],
  body: `
A valve moves only when something moves it, and comes back only when something brings it back. How it is operated decides where it can sit in a circuit; how it returns decides whether it remembers.

### Ways to operate a valve
| Kind | Examples | Where it is used |
|---|---|---|
| Manual | push button, mushroom button, lever, pedal, key or selector switch | start signals, manual control, setting up |
| Mechanical | plunger, roller lever, one-way (idle-return) roller | limit valves at the ends of a stroke |
| Electrical | solenoid, usually with a pilot stage and a manual override | almost every automated machine |
| Pneumatic | pilot pressure applied (signals 12 and 14) or released | all-pneumatic logic, large valves |

In the symbol each operator is drawn against the square it pushes into place: a solenoid is a rectangle with a diagonal, a pneumatic pilot a hollow triangle fed by a dashed line, a spring a zigzag (see [[iso-1219-pneu]]). An **idle-return roller** is hinged so that it is operated only when the cam passes one way; in the other direction it folds away. It gives a short signal instead of a long one, a classic cure for signals that overlap (see [[signal-overlap]]).

### Direct and pilot operation
Pushing a valve directly takes force. A poppet valve must open against the pressure on its seat (see [[poppet-spool]]); a spool must overcome its spring and seal friction. A hand manages tens of newtons, a small solenoid only a few. Larger valves are therefore **pilot-operated**: the solenoid or button opens a tiny pilot valve, and supply air does the heavy work on a piston. The pilot piston shifts the valve only when its force beats the return spring and the seal friction, which sets a minimum pilot pressure:

$$p_\\text{min} = \\frac{F_s + F_f}{\\pi d_p^2/4}$$

For a 12 mm pilot piston, a spring that reaches 20 N at the end of travel and 6 N of friction, that is 2.3 bar. Typical valves quote 1.5–3 bar. Below it a valve does not switch — or, worse, stops part-way with both paths half open. Valves used at low pressure or on vacuum take their pilot air from a separate supply (see [[solenoid-valves]]).

### Coming back: spring, air spring, detent — or not at all
- **Spring return** (monostable): the valve returns to its normal position when the signal ends. Its state with no signal is known.
- **Air spring**: supply pressure on a small differential piston does the spring's job — a stronger return with no spring to break, but only while there is air.
- **Detent**: a notch holds a lever where it was put; common on manual valves.
- **Impulse (memory) valve**: a signal on each side and no spring — a double-pilot or double-solenoid 5/2 valve, bistable. A short pulse on 14 switches it and it stays until a pulse on 12. If both signals are present at once it stays where it is (or, on designs with unequal pilot areas, one side dominates).

The memory is a gift for sequences — a short signal is enough — and a trap: a signal that lasts too long on one side blocks the other (see [[memory-circuits]]).

### When the power fails
What a valve does when the electricity fails is a design decision. A spring-return valve drops to its normal position; a double-solenoid valve stays where it was; a spring-centred 5/3 valve centres. Choose with the machine in mind: a clamp that must not open, a press that must return, a vertical axis that must not fall (see [[emergency-stop-pneu]]).

> [!warn] Manual overrides and hand levers move machines. Operate them only when the danger zone is clear, and never "to see what happens" with people near moving parts.
`,
  ideas: [
    'Valves are operated manually, mechanically (rollers, plungers), electrically (solenoids) or pneumatically (pilot signals).',
    'Large valves are pilot-operated: a small signal opens a pilot and the supply air shifts the main stage.',
    'A pilot-operated valve needs a minimum pilot pressure, (spring + friction) / piston area — typically 1.5–3 bar.',
    'Spring return makes a valve monostable; a double-pilot or double-solenoid valve without a spring is bistable and remembers its last signal.',
    'What each valve does on a power or air failure is a safety decision, not an accident.'
  ],
  pitfalls: [
    'A pilot-operated valve works at any pressure — Below its minimum pilot pressure it will not switch, or stops half-way. Low-pressure and vacuum circuits need external pilot air or direct-acting valves.',
    'An impulse valve follows the latest signal — It follows a signal only while the opposite one is absent. With both pilots pressurised it simply stays put, which is how long signals jam sequences.',
    'A roller valve is an electrical sensor — It is a pneumatic valve operated mechanically: its output is air, sent straight to a pilot port.'
  ],
  formulas: [
    {
      name: 'Minimum pilot pressure',
      expr: 'p = (Fs + Ff)/(pi*d^2/4)', tex: 'p_\\text{min} = \\dfrac{F_s + F_f}{\\pi d_p^2/4}',
      vars: {
        p: { name: 'minimum pilot pressure (gauge)', q: 'pressure', unit: 'bar', tex: 'p_\\text{min}' },
        Fs: { name: 'return-spring force at the end of travel', q: 'force', unit: 'N', value: 20, tex: 'F_s' },
        Ff: { name: 'seal friction', q: 'force', unit: 'N', value: 6, tex: 'F_f' },
        d: { name: 'pilot piston diameter', q: 'length', unit: 'mm', value: 12, tex: 'd_p' }
      },
      note: 'Gauge pressure, because the other side of the pilot piston is vented. Below this pressure the valve does not complete its travel.',
      stories: { p: 'A pilot piston of {d} must beat a spring of {Fs} and friction of {Ff}. What pilot pressure does the valve need?', d: 'A valve must switch with {p} of pilot air against {Fs} of spring and {Ff} of friction. What pilot piston diameter is needed?' }
    }
  ],
  examples: [
    {
      title: 'Will it switch at 2 bar?',
      q: 'A pilot-operated 5/2 valve has a 12 mm pilot piston. Its return spring starts at 14 N and reaches 20 N at the end of travel; seal friction is 6 N. The valve takes its pilot air from port 1. What happens on a line at 2 bar gauge, and what is the minimum pressure?',
      steps: [
        'Pilot piston area: $\\pi \\times 0.012^2/4 = 1.131\\times10^{-4}$ m².',
        'At 2 bar the pilot force is $2\\times10^5 \\times 1.131\\times10^{-4} = 22.6$ N.',
        'To start moving it must beat 14 + 6 = 20 N: it does. To finish it must beat 20 + 6 = 26 N: it does not. The spool stops where spring and friction balance 22.6 N, part-way.',
        'Minimum pressure for full travel: $(20 + 6)/1.131\\times10^{-4} = 2.3\\times10^5$ Pa = 2.3 bar.'
      ],
      a: 'At 2 bar the spool stops part-way — the worst outcome. It needs 2.3 bar, or external pilot air.'
    },
    {
      title: 'A memory that jams',
      q: 'An impulse valve drives a cylinder. The operator holds the start button (signal 14) down; at the end of the stroke a limit valve sends signal 12 to return the cylinder. What happens?',
      steps: [
        'Signal 14 shifted the valve and the cylinder extends.',
        'At the end of the stroke 12 arrives while 14 is still present. With equal pilot areas the forces cancel and the valve stays where it is.',
        'The cylinder stays out until the button is released; only then does 12 act and the cylinder return.'
      ],
      a: 'The cylinder waits at the end of its stroke until the start button is released. Short signals — or an idle-return roller or a cascade — prevent the overlap.'
    }
  ],
  quiz: [
    { q: 'A 5/2 valve with a solenoid on one side and a spring on the other is…', choices: ['monostable', 'bistable', 'a three-position valve', 'a detented valve'], a: 0,
      why: 'It has one stable position, the spring position, and returns to it whenever the solenoid is off.' },
    { q: 'An impulse valve (equal pilot areas) receives a signal at 14 while 12 is still pressurised. It…', choices: ['switches to the 14 side', 'switches to the 12 side', 'stays where it was', 'moves to a centre position'], a: 2,
      why: 'Equal forces on both pilots cancel; with no spring, friction keeps the spool where it was.' },
    { q: 'A pilot piston of 10 mm must beat a 12 N spring and 4 N of friction. What minimum pilot pressure (gauge) is needed?', answer: 2.04, unit: 'bar', tol: 0.03,
      why: 'Area π × 0.01²/4 = 7.85×10⁻⁵ m²; p = 16/7.85×10⁻⁵ = 2.04×10⁵ Pa = 2.04 bar.' },
    { q: 'A roller-operated limit valve is an electrical sensor.', a: false,
      why: 'It is a pneumatic valve operated mechanically by a cam; its output is air, usually sent to a pilot port.' },
    { q: 'Why are most solenoid valves pilot-operated?', choices: ['pilots make valves leak less', 'a small coil cannot give the force needed to shift a large valve against pressure, springs and friction', 'pilot air cools the coil', 'solenoids cannot switch air directly'], a: 1,
      why: 'A few watts of coil give a few newtons. Letting the supply air do the work on a piston lets a small coil switch a large valve.' }
  ],
  applications: ['Mushroom-headed push buttons and key switches as start and mode signals on pneumatic control panels.', 'Roller limit valves reporting the end positions of cylinders in all-pneumatic machines.', 'Pilot-operated valves in explosive atmospheres, where no electricity may go.', 'Double-solenoid valves holding clamps and grippers through a power failure.'],
  history: 'Before the programmable controller arrived at the end of the 1960s, whole machines were sequenced by valves alone: push buttons, roller limit valves and impulse valves joined by pilot lines. The methods invented then for avoiding overlapping signals — the cascade and the step sequencer — are still taught today.',
  sim: { id: 'valve-explorer', params: { kind: 'i52' } }
},

{
  id: 'poppet-spool', parent: 'directional-valves-pneu', title: 'Poppet and spool valves', level: 2,
  short: 'Two ways to open an air path: a poppet lifts a disc off a seat — short stroke, no leakage, tolerant of dirt, but pushed shut by the pressure; a spool slides lands past grooves — balanced forces and any function, but friction or leakage and a longer stroke.',
  keywords: ['poppet valve', 'seat valve', 'spool valve', 'slide valve', 'soft seal', 'lapped spool', 'metal-to-metal', 'overlap', 'underlap', 'positive overlap', 'negative overlap', 'leakage', 'curtain area', 'balanced spool'],
  prereq: ['way-valves', 'valve-operation', 'hydraulics:orifice-equation'],
  related: ['solenoid-valves', 'flow-coefficients', 'sonic-conductance', 'air-leaks', 'lubricators', 'maintenance-pneu', 'hydraulics:directional-valves'],
  body: `
Inside every directional valve something must open and close the paths. There are two families, each with its own character.

### Poppet valves: lift a disc off a seat
A poppet (seat) valve closes by pressing a disc, ball or cone with a rubber face onto a seat. Lift it and air flows through the ring-shaped gap between disc and seat, the **curtain** $A = \\pi d h$. The curtain equals the seat's own area at a lift of a quarter of the seat diameter — only 1.25 mm for a 5 mm seat — so poppet valves have a **short stroke** and switch fast. The rubber face seals completely (**zero leakage**), and the flowing air blows dirt off the seat, so they **tolerate contamination** well.

Their weakness is **force**. The supply pressure presses on the closed disc, so opening it takes

$$F = p_g\\,\\frac{\\pi d^2}{4} + F_s$$

— 12 N plus the spring for a 5 mm seat at 6 bar, but 106 N plus the spring for a 15 mm seat. Large poppet valves are therefore pilot-operated or pressure-balanced. A 3/2 poppet valve has two seats: pressing its hollow stem first seals the stem against the disc, closing the exhaust (2→3), and only then pushes the disc off the supply seat (1→2). Supply never blows straight to exhaust.

### Spool valves: slide lands past grooves
A spool valve has a cylindrical spool with raised **lands** sliding in a bore with an annular groove for each port. Moving the spool uncovers and covers the grooves, and one body can make a 3/2, 4/2, 5/2 or 5/3 function. The pressure acts equally all round the spool, so the forces **balance**: a small solenoid or pilot moves a large valve. The stroke is longer, several millimetres. There are two ways to seal a spool:
- **Soft seals** (O-rings or lip seals on the lands or in the bore): zero leakage and forgiving clearances, but friction — a breakaway force after standing, and wear.
- **Lapped metal spool** in a metal sleeve with a radial clearance of a few micrometres: almost no friction, very long life, fast — but a small permanent leak and sensitivity to dirt and oil varnish. The leak through a narrow gap is laminar and goes with the **cube** of the clearance:

$$\\dot V_\\text{free} = \\frac{\\pi D c^3 (p_1^2 - p_2^2)}{24\\,\\mu R_\\text{air} T L \\rho_0}$$

For an 8 mm spool, a 4 µm radial clearance and a 1 mm sealing length, from 6 bar gauge to the atmosphere, that is about 1 L/min of free air per land.

### Overlap
What happens in mid-stroke is set by the **overlap** (lap) of the lands over the grooves. With **positive overlap** every path is shut for a moment as the spool passes the middle: no air is wasted, but the outputs are briefly blocked. With **negative overlap** (underlap) supply and exhaust are both open for a moment and air blows straight through — a short burst of wasted air and a pressure dip, in exchange for a smoother changeover. Pneumatic spool valves usually have positive overlap; a poppet valve has it built in.

| | Poppet | Spool, soft seals | Spool, lapped metal |
|---|---|---|---|
| Stroke | short, 1–2 mm | long, 4–10 mm | long |
| Leakage | none | none | small, permanent |
| Operating force | high; grows with pressure and size | moderate (seal friction) | very low |
| Dirt tolerance | good | fair | poor |
| Functions | mostly 2/2 and 3/2 | any | any |
| Life | long | limited by seal wear | very long |

> [!tip] A valve that sticks after a weekend is usually a soft-sealed spool that has lost its lubricant film, or one gummed with oil varnish carried over from the compressor. A metal spool that sticks has usually swallowed dirt. Good filtration (see [[air-filters]]) cures both.
`,
  ideas: [
    'A poppet opens a seat: its curtain area πdh reaches the full seat area at a lift of only d/4.',
    'Supply pressure pushes a poppet shut, so its operating force grows with pressure and seat size; a spool is pressure-balanced.',
    'Soft-sealed spools do not leak but have friction; lapped metal spools barely rub but leak a little, in proportion to the clearance cubed.',
    'Positive overlap shuts every path in mid-stroke; negative overlap lets supply blow through to exhaust for a moment.',
    'Poppets tolerate dirt best; lapped metal spools least.'
  ],
  pitfalls: [
    'A spool valve needs more force at higher pressure, like a poppet — The pressure acts all round the spool and cancels; only springs and friction resist it.',
    'A metal spool leaks because it is worn — Every lapped spool leaks a little by design; a worn one leaks much more, since the leak grows with the cube of the clearance.',
    'Negative overlap is a defect — It is a design choice that trades a burst of air for a smooth changeover; in pneumatics positive overlap is simply more common.'
  ],
  formulas: [
    {
      name: 'Force to open a poppet',
      expr: 'F = p*pi*d^2/4 + Fs', tex: 'F = p_g\\,\\dfrac{\\pi d^2}{4} + F_s',
      vars: {
        F: { name: 'force to lift the poppet off its seat', q: 'force', unit: 'N' },
        p: { name: 'supply pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        d: { name: 'seat diameter', q: 'length', unit: 'mm', value: 5 },
        Fs: { name: 'closing spring force', q: 'force', unit: 'N', value: 4, tex: 'F_s' }
      },
      note: 'The supply acts on the closed disc across the seat; the other side is at the outlet pressure, here taken as atmospheric. Pressure-balanced poppets avoid most of this force.',
      stories: { F: 'A poppet valve with a {d} seat and a {Fs} spring is supplied at {p}. What force opens it?', d: 'A push button can apply {F}. With a spring of {Fs} and a supply of {p}, how large can the seat be?' }
    },
    {
      name: 'Curtain area of a poppet',
      expr: 'A = pi*d*h', tex: 'A = \\pi d h',
      vars: {
        A: { name: 'flow area (curtain)', q: 'area', unit: 'mm²' },
        d: { name: 'seat diameter', q: 'length', unit: 'mm', value: 5 },
        h: { name: 'lift of the poppet', q: 'length', unit: 'mm', value: 1.25 }
      },
      note: 'Valid while the curtain is smaller than the seat area πd²/4, that is for lifts up to d/4; beyond that the seat itself limits the flow.',
      stories: { h: 'How far must a poppet on a {d} seat lift to open a flow area of {A}?' }
    },
    {
      name: 'Leakage through a spool clearance',
      expr: 'Q = pi*D*c^3*(p1^2 - p2^2)/(24*mu*Rair*T*L*rho0)', tex: '\\dot V_\\text{free} = \\dfrac{\\pi D c^3 (p_1^2 - p_2^2)}{24\\,\\mu R_\\text{air} T L \\rho_0}',
      vars: {
        Q: { name: 'leakage (free air)', q: 'airflow', unit: 'L/min ANR', tex: '\\dot V_\\text{free}' },
        D: { name: 'spool diameter', q: 'length', unit: 'mm', value: 8 },
        c: { name: 'radial clearance', q: 'length', unit: 'µm', value: 4 },
        p1: { name: 'high-side pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.013, tex: 'p_1' },
        p2: { name: 'low-side pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.013, tex: 'p_2' },
        mu: { name: 'viscosity of air', q: 'viscosity', unit: 'mPa·s', value: 0.0181, tex: '\\mu' },
        Rair: { const: 'Rair' },
        T: { name: 'air temperature', q: 'temperature', unit: '°C', value: 20 },
        L: { name: 'sealing length of the land', q: 'length', unit: 'mm', value: 1 },
        rho0: { name: 'density of free air (ANR)', q: 'density', unit: 'kg/m³', value: 1.185, fixed: true, tex: '\\rho_0' }
      },
      note: 'Laminar flow of a gas through a narrow annular gap (the clearance much smaller than the diameter), at steady temperature. The cube of the clearance dominates: twice the gap, eight times the leak.',
      stories: { Q: 'A lapped spool of {D} with a radial clearance of {c} seals over {L} between {p1} and {p2}. How much free air leaks past one land?', c: 'A metal spool of {D} may leak no more than {Q} per land from {p1} to {p2} over a sealing length of {L}. What radial clearance is allowed?' }
    }
  ],
  examples: [
    {
      title: 'Pressing a poppet valve',
      q: 'A push-button 3/2 poppet valve has a 5 mm seat and a 4 N closing spring. What force does the button need at 6 bar and at 10 bar, and what would a 15 mm seat need at 6 bar?',
      steps: [
        'Seat area: $\\pi \\times 0.005^2/4 = 1.96\\times10^{-5}$ m². At 6 bar: $6\\times10^5 \\times 1.96\\times10^{-5} = 11.8$ N, plus 4 N: 15.8 N.',
        'At 10 bar: $19.6 + 4 = 23.6$ N — the button gets harder to press as the pressure rises.',
        'A 15 mm seat: $6\\times10^5 \\times \\pi \\times 0.015^2/4 = 106$ N, plus the spring — too much for a thumb.'
      ],
      a: '15.8 N at 6 bar, 23.6 N at 10 bar; a 15 mm seat needs over 100 N, which is why large poppet valves are pilot-operated.'
    },
    {
      title: 'What small leaks cost',
      q: 'A machine has 20 valves with lapped metal spools, each leaking about 2 L/min of free air (two sealing lands at about 1 L/min each), around the clock. With 0.11 kWh per m³ of free air and electricity at 0.15 per kWh, what does the leakage cost a year?',
      steps: [
        'Leakage: $20 \\times 2 = 40$ L/min.',
        'Per year: $40 \\times 60 \\times 8760 = 2.1\\times10^7$ L = 21 000 m³.',
        'Energy: $21\\,000 \\times 0.11 = 2310$ kWh; cost $2310 \\times 0.15 \\approx 347$.'
      ],
      a: 'About 21 000 m³ of free air, 2300 kWh and ¤350 a year — small beside a leaking fitting, but not zero.'
    }
  ],
  quiz: [
    { q: 'Why does a 3/2 poppet valve never blow supply air straight to exhaust while it switches?', choices: ['its spring is very stiff', 'the stem closes the exhaust before it opens the supply seat', 'it has negative overlap', 'poppets cannot pass exhaust air'], a: 1,
      why: 'The hollow stem first seals against the disc (closing 2→3) and only then pushes the disc off its seat (opening 1→2): positive overlap by construction.' },
    { q: 'Halving the radial clearance of a lapped metal spool reduces its leakage to about…', choices: ['a half', 'a quarter', 'an eighth', 'the same'], a: 2,
      why: 'Laminar leakage through a narrow gap goes with the cube of the gap: (½)³ = ⅛.' },
    { q: 'A spool valve needs more operating force at higher supply pressure, just like a poppet valve.', a: false,
      why: 'The pressure acts all round the spool and its forces cancel; the operator only fights the spring and friction.' },
    { q: 'What force opens a poppet valve with an 8 mm seat at 6 bar gauge against a 5 N spring?', answer: 35.2, unit: 'N', tol: 0.02,
      why: '6×10⁵ × π × 0.008²/4 = 30.2 N, plus 5 N = 35.2 N.' },
    { q: 'Which valve design tolerates dirty air best?', choices: ['poppet valve', 'soft-sealed spool', 'lapped metal spool', 'they are all equally tolerant'], a: 0,
      why: 'The air rushing through an opening seat blows particles away and the rubber face seals over small ones; a metal spool with a few micrometres of clearance can jam on one.' }
  ],
  problems: [
    { q: 'How far must a poppet with a 6 mm seat lift before its curtain area equals the seat area?', answer: 1.5, unit: 'mm', tol: 0.02,
      steps: ['πdh = πd²/4 gives h = d/4.', 'h = 6/4 = 1.5 mm.'] }
  ],
  applications: ['Poppet valves for push buttons, limit valves and valves in dusty or unlubricated service.', 'Soft-sealed spool valves on most valve terminals and single solenoid valves.', 'Lapped metal spool valves where long life and fast, frictionless switching matter, such as high-cycle packaging machines.', 'Pressure-balanced poppets in large valves for blow-off and process air.'],
  sim: 'valve-poppet-spool'
},

{
  id: 'solenoid-valves', parent: 'directional-valves-pneu', title: 'Solenoid and pilot-operated valves', level: 2,
  short: 'A solenoid turns an electrical signal into a small force; direct-acting valves use it on the seat, pilot-operated valves use it to open a tiny pilot that lets the air shift the main valve. That needs a minimum pilot pressure and takes typically 5–30 ms.',
  keywords: ['solenoid valve', 'coil', 'armature', 'plunger', 'direct-acting', 'pilot-operated', 'servo-assisted', 'internal pilot', 'external pilot', 'minimum pilot pressure', 'response time', 'switching time', 'coil power', 'manual override', 'freewheeling diode', '24 V DC'],
  prereq: ['valve-operation', 'poppet-spool', 'physics:solenoid'],
  related: ['solenoids-relays', 'valve-terminals', 'plc-control', 'ladder-diagrams', 'soft-start', 'electronics:flyback-diode', 'electronics:rl-transient', 'electronics:relays'],
  body: `
Most pneumatic valves are switched by electricity. A **solenoid** is a coil around an iron armature (plunger): current through the coil magnetises the iron, and the armature is pulled into the coil (see [[physics:solenoid|solenoids and electromagnets]] and [[solenoids-relays]]). Its force is modest — a few newtons from a coil of a few watts — and it grows with the square of the current and steeply as the air gap closes.

### Direct-acting and pilot-operated
In a **direct-acting** valve the armature carries the seal and opens the seat itself. It is simple and works from zero pressure, even on vacuum, but a few newtons can only open a small seat against the pressure (see [[poppet-spool]]): direct-acting valves are for small flows, pilot stages and vacuum.

A **pilot-operated** (indirect, servo-assisted) valve puts a tiny direct-acting 3/2 valve — the pilot — on top of a main valve. The armature opens a pilot seat under a millimetre across; the air it lets through pushes a piston that shifts the main spool or poppet. The coil stays small however large the main valve. The price is that the pilot needs pressure: typically 2–3 bar to shift the main stage against its spring and seal friction (see [[valve-operation]]).
- **Internal pilot supply** takes the pilot air from port 1. Simple — but if port 1 carries low pressure or vacuum, or is only pressurised after the valve has switched (behind a soft-start valve), the valve will not switch.
- **External pilot supply** feeds the pilot from a separate port, often marked 12/14, at full pressure whatever is at port 1.

### How fast it switches
Switching on is a chain of steps. The coil current rises with the time constant of the coil,

$$\\tau = \\frac{L}{R}$$

typically a few milliseconds; the magnet force must beat the pilot spring and the pressure on the pilot seat, which may take half the final current; the armature moves; pilot air fills the piston chamber; the main spool travels. Small pilot valves switch on in 5–15 ms, larger ones in 10–30 ms. Switching off is often slower: the coil's energy must go somewhere, and a plain freewheeling diode lets the current die away slowly, so the armature drops late. A Zener diode or varistor clamp lets the current collapse faster and cuts several milliseconds (see [[electronics:flyback-diode|flyback diodes]]). ISO 12238:2001 describes how switching times are measured.

### Coils
| Coil | Typical power | Current at 24 V DC |
|---|---|---|
| Pilot on a valve terminal | 0.3–1 W | 13–42 mA |
| Standard DC coil | 1.5–3 W | 63–125 mA |
| Large or AC coil | 4–10 W (AC: inrush several times the holding value) | 170–420 mA |

Coils are usually rated for continuous duty at ±10 % of their voltage. Low-power coils often use a strong pull-in pulse and then drop to a smaller holding current, since a closed armature needs only a fraction of the force. Every coil also sets a **maximum pressure**: above it the magnet cannot lift the pilot seat against the air.

### Manual override
Most solenoid valves have a small button or screw on the pilot that opens it by hand — for commissioning and fault finding, not for running a machine. Pressing it moves the cylinder exactly as the coil would.

> [!warn] Operating a manual override or energising a coil "to see what happens" moves the machine. Make sure nobody is in the danger zone, know which actuator will move, and remember that a pilot-operated valve may do nothing at all until the air is on — and then move at once.
`,
  ideas: [
    'A solenoid gives a small force that grows with the square of the current; its current rises with the time constant L/R.',
    'Direct-acting valves work from zero pressure but only for small seats; pilot-operated valves switch large valves with a small coil but need a minimum pilot pressure.',
    'Internal pilot air comes from port 1; low pressure, vacuum or soft-start circuits need external pilot air.',
    'Switching takes 5–30 ms: current rise, armature, pilot filling, spool travel — and switching off depends on how the coil current is allowed to decay.',
    'Manual overrides move machines: use them only when the danger zone is clear.'
  ],
  pitfalls: [
    'A pilot-operated valve switches as soon as its coil is energised — It needs pilot pressure too: below about 2–3 bar, or with port 1 unpressurised, it stays put or stops half-way.',
    'A bigger coil is always better — It switches on a little sooner but costs power all the time it is on, heats the valve and can switch off later, because more energy is stored in its field.',
    'The freewheeling diode only protects the transistor — It does, but it also keeps current flowing in the coil after switch-off and so delays the valve; a Zener clamp shortens the delay.'
  ],
  formulas: [
    {
      name: 'Coil current',
      expr: 'I = P/U', tex: 'I = \\dfrac{P}{U}',
      vars: {
        I: { name: 'coil current', q: 'current', unit: 'mA' },
        P: { name: 'coil power', q: 'power', unit: 'W', value: 1.5 },
        U: { name: 'coil voltage', q: 'voltage', unit: 'V', value: 24 }
      },
      note: 'DC coils. The coil resistance is U²/P: 384 Ω for 1.5 W at 24 V. A controller output must supply this current for every coil it drives.',
      stories: { I: 'What current does a {P} coil draw at {U}?', P: 'A controller output can supply {I} at {U}. What is the largest coil power it can drive?' }
    },
    {
      name: 'Time constant of the coil',
      expr: 'tau = L/R', tex: '\\tau = \\dfrac{L}{R}',
      vars: {
        tau: { name: 'time constant', q: 'time', unit: 'ms', tex: '\\tau' },
        L: { name: 'coil inductance', q: 'inductance', unit: 'H', value: 1.15 },
        R: { name: 'coil resistance', q: 'resistance', unit: 'Ω', value: 384 }
      },
      note: 'The current reaches 63 % of its final value U/R after one time constant and 95 % after three. The inductance rises as the armature closes, so this is a starting estimate.',
      stories: { tau: 'A coil has an inductance of {L} and a resistance of {R}. What is its time constant?' }
    },
    {
      name: 'Delay until the armature pulls in',
      expr: 't = tau*ln(1/(1 - k))', tex: 't = \\tau \\ln\\dfrac{1}{1 - k}',
      vars: {
        t: { name: 'delay after switching on', q: 'time', unit: 'ms' },
        tau: { name: 'coil time constant', q: 'time', unit: 'ms', value: 3, tex: '\\tau' },
        k: { name: 'pull-in current as a share of the final current', q: 'ratio', unit: '%', value: 53, min: 1, max: 99 }
      },
      note: 'From i = I(1 − e^(−t/τ)). The pull-in share rises with the pressure on the pilot seat and falls with a stronger coil; the armature\'s own travel and the pilot stage add a few more milliseconds.',
      stories: { t: 'A coil with a time constant of {tau} must reach {k} of its final current before the armature moves. How long does that take?' }
    }
  ],
  examples: [
    {
      title: 'Where the milliseconds go',
      q: 'A pilot-operated 5/2 valve has a 24 V, 1.5 W coil with an inductance of 1.15 H. Its armature pulls in at 53 % of the final current, travels in about 0.8 ms, and the pilot stage then needs about 5 ms to fill the pilot piston and move the spool. Estimate the switch-on time.',
      steps: [
        'Current: $I = 1.5/24 = 62.5$ mA; resistance $R = 24^2/1.5 = 384$ Ω.',
        'Time constant: $\\tau = 1.15/384 = 3.0$ ms.',
        'Pull-in delay: $t = 3.0 \\times \\ln(1/0.47) = 2.3$ ms.',
        'Total: $2.3 + 0.8 + 5 \\approx 8$ ms.'
      ],
      a: 'About 8 ms, most of it spent in the coil and the pilot stage rather than in moving the spool.'
    },
    {
      title: 'A valve that will not switch on a low-pressure line',
      q: 'A pilot-operated 5/2 valve with internal pilot supply is fitted to a gripper line regulated to 1.5 bar gauge. Its data sheet gives a minimum pilot pressure of 2.2 bar. The coil is energised, the LED lights, nothing moves. Why, and what are the cures?',
      steps: [
        'With internal pilot supply the pilot piston sees at most the 1.5 bar on port 1.',
        'That is below the 2.2 bar the spool needs to overcome its spring and friction, so the main stage does not move (or stops part-way).',
        'Cures: a valve with external pilot supply, fed from the 6 bar main; a direct-acting valve; or regulate the pressure after the valve instead of before it.'
      ],
      a: 'The pilot pressure is too low. Feed the pilot externally, use a direct-acting valve, or put the regulator downstream of the valve.'
    },
    {
      title: 'What coils cost to keep on',
      q: 'A plant has 200 valves whose 1.5 W coils are energised around the clock. What does that cost a year at 0.15 per kWh?',
      steps: [
        'Energy per coil: $1.5 \\times 8760 = 13.1$ kWh.',
        'For 200 coils: 2630 kWh; at 0.15 per kWh about 394.'
      ],
      a: 'About 2600 kWh, ¤394 a year — a reason for low-power pilots, holding-current reduction and impulse valves that need no current to hold.'
    }
  ],
  quiz: [
    { q: 'A pilot-operated 5/2 valve on a line at 1.5 bar gauge does not switch although its coil is energised. The most likely reason is…', choices: ['the coil is too weak', 'the pilot pressure is below the minimum the spool needs', 'the valve has negative overlap', 'the exhaust is blocked'], a: 1,
      why: 'With internal pilot air the pilot piston sees only 1.5 bar, less than the 2–3 bar most pilot stages need.' },
    { q: 'What current does a 2.5 W coil draw at 24 V DC?', answer: 104, unit: 'mA', tol: 0.02,
      why: 'I = P/U = 2.5/24 = 0.104 A.' },
    { q: 'Which change shortens the switch-off time of a solenoid valve?', choices: ['a stronger coil', 'replacing the plain freewheeling diode with a diode and Zener clamp', 'a lower supply voltage', 'a longer cable'], a: 1,
      why: 'The clamp lets the coil current collapse against a higher voltage, so the armature drops sooner. A stronger coil stores more energy and releases later.' },
    { q: 'A direct-acting solenoid valve can switch vacuum; a pilot-operated valve with internal pilot supply cannot.', a: true,
      why: 'The direct-acting valve needs no pressure to move; the internally piloted one needs pilot pressure from port 1, which vacuum cannot provide.' },
    { q: 'Why does a low-power coil set a maximum operating pressure for its valve?', choices: ['the coil overheats at high pressure', 'the pressure on the pilot seat holds it shut with a force the weak magnet cannot overcome', 'high pressure demagnetises the armature', 'the pilot piston is too small'], a: 1,
      why: 'Pressure times the pilot seat area adds to the spring force holding the seat shut; above some pressure the magnet cannot lift it.' }
  ],
  applications: ['Pilot-operated 5/2 and 5/3 valves driven by PLC outputs on almost every automated machine.', 'Direct-acting 2/2 and 3/2 valves for vacuum, blow-off and low-pressure functions.', 'Externally piloted valves behind soft-start valves and in low-pressure zones.', 'Low-power pilots on valve terminals, where hundreds of coils share one power supply.'],
  sim: 'valve-solenoid-timing'
},

{
  id: 'valve-terminals', parent: 'directional-valves-pneu', title: 'Valve terminals and manifolds', level: 2,
  short: 'A valve terminal mounts many valves on one manifold that shares their supply and exhaust channels and connects all their coils through one plug or fieldbus node: less tubing and wiring, diagnostics — and shared channels that must be sized for valves that switch together.',
  keywords: ['valve terminal', 'valve island', 'valve manifold', 'sub-base', 'fieldbus', 'multipin', 'IO-Link', 'PROFINET', 'EtherNet/IP', 'EtherCAT', 'pressure zones', 'output byte', 'diagnostics', 'exhaust back-pressure'],
  prereq: ['solenoid-valves', 'way-valves', 'sonic-conductance'],
  related: ['fieldbus-io-link', 'plc-control', 'safety-functions', 'emergency-stop-pneu', 'digital-pneumatics', 'port-numbering', 'noise-silencers', 'electronics:serial-buses'],
  body: `
A machine with thirty cylinders once needed thirty valves, each with its own supply tube, silencers and a cable to the control cabinet. A **valve terminal** (valve island, valve manifold) mounts them side by side on one manifold that shares the supply and exhaust channels, and connects all their coils through one electrical interface.

### What sits on a terminal
- **Valve stations**: 5/2 and 5/3 valves, pairs of 3/2 valves in one station, 2/2 and vacuum valves. Station widths run from about 10 mm to 26 mm, with sonic conductances from roughly 0.3 to 5 dm³/(s·bar).
- **The manifold**: channel 1 feeds every station; channels 3 and 5 collect the exhaust to a common silencer or a ducted outlet. Plugs between stations split the channels into **pressure zones** — 6 bar for the main cylinders, 2 bar for a gentle gripper, vacuum for suction cups.
- **Station options**: pressure regulators and non-return valves in the station, soft-start and dump valves, pressure sensors.
- **The electrical interface**: a multipin plug (one wire per coil plus a common), or a **fieldbus node** — PROFINET, EtherNet/IP, EtherCAT, IO-Link (IEC 61131-9) and others — so that one cable carries every coil command and returns diagnostics: open or shorted coils, low coil voltage, switching-cycle counts (see [[fieldbus-io-link]] and [[plc-control]]).

### The output byte
To the controller a terminal is a block of outputs, one bit per coil. Six single-solenoid valves use six bits of one output byte; eight double-solenoid valves use sixteen bits. Writing 0x0B — binary 00001011 — energises coils Y0, Y1 and Y3 at once.

### Shared channels: the catch
The stations share air. When several valves switch together, each chamber they fill starts near atmospheric pressure and draws a choked flow, and the supply channel sags; when they exhaust together, the common exhaust channel and its silencer see a surge of back-pressure. The supply connection should pass what all the valves switching at once draw:

$$C_s \\ge \\frac{n\\,C_v\\,r}{\\sqrt{1 - \\left(\\frac{r - b}{1 - b}\\right)^2}}$$

where $r$ is the lowest acceptable ratio of channel pressure to supply pressure (absolute) and $b$ the critical ratio of the supply connection (see [[sonic-conductance]]). Six valves of $C_v = 0.5$ switching together with no more than a 10 % dip ($r = 0.9$, $b = 0.3$) need $C_s \\ge 5.2$ dm³/(s·bar) — a bigger connection than any single valve. Long terminals are therefore fed from both ends, and exhaust channels given large silencers or ducted away. Exhaust back-pressure can even push air backwards into a station that is venting a cylinder, nudging a cylinder that should stand still; separate exhausts or non-return valves in the exhaust channel prevent it.

### Zones for safety
A terminal can be divided into zones whose coil power or air supply is switched off by a safety relay, so that an emergency stop vents or holds exactly the right cylinders while others keep their state (see [[safety-functions]] and [[emergency-stop-pneu]]).

> [!warn] Before changing a valve on a terminal, exhaust the manifold and lock out both the air and the electrical supply. Stations share channels: removing one valve from a live manifold vents the channel — and can move cylinders driven by its neighbours.
`,
  ideas: [
    'A valve terminal shares supply and exhaust channels and one electrical interface among many valves.',
    'Over a fieldbus each coil is one bit of the controller\'s output image, and the terminal reports faults back.',
    'Plugs in the channels make pressure zones; separate power zones let safety circuits switch groups of valves.',
    'Valves switching together draw choked flow at once: the supply connection needs a larger conductance than any single valve, and the exhaust a large silencer.',
    'Exhaust back-pressure in a shared channel can move cylinders that are not being switched.'
  ],
  pitfalls: [
    'The supply connection only needs to match one valve — Several valves switching at once draw several times as much air; size the connection for the valves that switch together.',
    'A shared exhaust cannot affect other stations — A surge of exhaust raises the channel pressure, which reaches every station whose output is connected to exhaust.',
    'A fieldbus terminal makes the valves safe — The bus carries commands; a safe state needs a safety-rated way of removing coil power or air, designed as a safety function.'
  ],
  formulas: [
    {
      name: 'Supply connection for valves switching together',
      expr: 'Cs = n*Cv*r/sqrt(1 - ((r - b)/(1 - b))^2)', tex: 'C_s = \\dfrac{n\\,C_v\\,r}{\\sqrt{1 - \\left(\\dfrac{r - b}{1 - b}\\right)^2}}',
      vars: {
        Cs: { name: 'sonic conductance of the supply connection', q: 'flowcond', unit: 'dm³/(s·bar)', tex: 'C_s' },
        n: { name: 'number of valves switching at once', q: 'count', value: 6, int: true },
        Cv: { name: 'sonic conductance of each valve', q: 'flowcond', unit: 'dm³/(s·bar)', value: 0.5, tex: 'C_v' },
        r: { name: 'lowest channel pressure over supply pressure (absolute)', value: 0.9, min: 0.31, max: 0.999 },
        b: { name: 'critical pressure ratio of the connection', value: 0.3, min: 0, max: 0.8 }
      },
      note: 'Worst case: every valve is filling a nearly empty chamber, so each draws a choked flow C_v times the channel pressure, while the connection passes a subsonic flow by ISO 6358. Channel volume and staggered switching make real dips shorter.',
      stories: { Cs: 'On a terminal, {n} valves of {Cv} each switch together. The channel pressure must not fall below {r} of the supply (absolute), and the connection has b = {b}. What sonic conductance must the supply connection have?', r: 'A supply connection of {Cs} (b = {b}) feeds {n} valves of {Cv} switching together. To what fraction of the supply pressure does the channel sag?' }
    }
  ],
  examples: [
    {
      title: 'Sizing a terminal\'s supply',
      q: 'Six valves of C = 0.5 dm³/(s·bar) on one terminal often switch together. The channel should stay above 90 % of the supply pressure (absolute); the supply fitting has b = 0.3. What conductance must the supply connection have?',
      steps: [
        '$(r - b)/(1 - b) = (0.9 - 0.3)/0.7 = 0.857$; squared 0.735; $\\sqrt{1 - 0.735} = 0.515$.',
        '$C_s = 6 \\times 0.5 \\times 0.9/0.515 = 5.2$ dm³/(s·bar).',
        'That is more than a typical G1/4 connection with its tube; feed the terminal from both ends or through a larger fitting.'
      ],
      a: 'About 5.2 dm³/(s·bar) — ten times one valve\'s conductance.'
    },
    {
      title: 'Reading an output byte',
      q: 'A controller writes the byte 0x2C to a terminal with eight single-solenoid valves, bit 0 driving coil Y0. Which coils are energised?',
      steps: [
        '0x2C = 2 × 16 + 12 = 44 = binary 0010 1100.',
        'Reading from bit 0: bits 2, 3 and 5 are 1.'
      ],
      a: 'Coils Y2, Y3 and Y5.'
    }
  ],
  quiz: [
    { q: 'An output byte of 0x05 on a terminal (bit 0 = coil Y0) energises…', choices: ['Y5', 'Y0 and Y2', 'Y0 and Y5', 'Y1 and Y3'], a: 1,
      why: '0x05 is binary 0000 0101: bits 0 and 2.' },
    { q: 'Valves on one manifold can work at different pressures.', a: true,
      why: 'Plugs in the supply channel, or regulators in the stations, divide a terminal into pressure zones.' },
    { q: 'Six cylinders on one terminal retract at the same moment. What is the most likely effect on the terminal?', choices: ['nothing: each valve has its own air', 'a dip in the supply channel and a surge of back-pressure in the exhaust channel', 'the coils overheat', 'the fieldbus slows down'], a: 1,
      why: 'All six fill and exhaust through the shared channels at once.' },
    { q: 'How many output bits does a terminal with 12 double-solenoid valves need?', answer: 24, why: 'One bit per coil: 12 × 2 = 24.' },
    { q: 'The main advantage of a fieldbus terminal over individually wired valves is…', choices: ['the valves switch faster', 'one cable carries every coil command and the terminal reports faults', 'it needs no compressed air supply', 'it makes the machine safe on its own'], a: 1,
      why: 'Wiring collapses to one bus cable, and diagnostics such as open or shorted coils come back to the controller. Safety still needs its own design.' }
  ],
  applications: ['Packaging and assembly machines with dozens of cylinders driven from one terminal on the machine frame.', 'Process plants where valve terminals pilot the actuators of process valves.', 'Robot end-of-arm tooling with a compact terminal and IO-Link node on the robot.', 'Terminals with integrated pressure zones feeding grippers, cylinders and vacuum from one block.'],
  sim: 'valve-terminal'
},

{
  id: 'flow-coefficients', parent: 'valve-flow', title: 'Cv, Kv and nominal flow', level: 2,
  short: 'Catalogues rate a valve\'s flow capacity with Kv (m³/h of water at 1 bar drop), Cv (US gal/min of water at 1 psi) or the nominal flow Q_n (L/min of air from 6 to 5 bar). Each is a single point; converting between them is only approximate.',
  keywords: ['Cv', 'Kv', 'flow coefficient', 'nominal flow', 'Qn', 'standard nominal flow', 'valve capacity', 'SCFM', 'L/min ANR', 'effective area', 'flow rate'],
  prereq: ['standard-air', 'air-flow-basics', 'way-valves'],
  related: ['sonic-conductance', 'valve-sizing', 'choked-flow', 'conductance-series', 'hydraulics:orifice-equation', 'hydraulics:minor-losses'],
  body: `
How much air does a valve pass? Catalogues answer with one of several numbers that come from different traditions. They look alike and are easily confused.

### Kv and Cv: born with liquids
The **flow coefficient Kv** is the flow of water, in cubic metres per hour, that passes the valve with a pressure drop of 1 bar (at 5–30 °C). The American **Cv** is the flow of water in US gallons per minute with a drop of 1 psi (at 60 °F). For a liquid the flow goes with the square root of the pressure drop, like flow through any orifice (see [[hydraulics:orifice-equation|the orifice equation]]):

$$Q = K_v\\sqrt{\\frac{\\Delta p}{G}}$$

with $Q$ in m³/h, $\\Delta p$ in bar and $G$ the relative density (water = 1). A change of units gives $K_v \\approx 0.865\\,C_v$.

For air the same idea is stretched by treating the air as a liquid with the density it has downstream. In free air (ANR, see [[standard-air]]) at about 20 °C, with both pressures absolute in bar:

$$Q_\\text{ANR} \\approx 485\\,K_v\\sqrt{(p_1 - p_2)\\,p_2}\\quad\\text{L/min}$$

That holds while the drop is moderate, roughly $p_2 > p_1/2$. Nearer to choking it overestimates the flow, and it cannot say where the valve chokes at all (see [[choked-flow]]).

### Nominal flow
Many catalogues give the **standard nominal flow** $Q_n$: litres per minute of free air through the valve with 6 bar gauge at the inlet and 5 bar at the outlet — a 1 bar drop at a typical working pressure. It is one point on the valve's flow curve: good for comparing valves at that point, silent about the flow from 6 bar to the atmosphere or from 4 bar to 3.

### Sonic conductance
ISO 6358-1:2013 replaces all of these with two numbers measured with air: the sonic conductance $C$ and the critical pressure ratio $b$. Together they give the flow at any pair of pressures, choked or not (see [[sonic-conductance]]). Try them in the [valve flow calculator](#/tools/pneu/valve).

### Rough equivalents
| From | To | Rule |
|---|---|---|
| Cv | Kv | Kv ≈ 0.865 Cv (a change of units) |
| Cv | C | C ≈ 4 Cv, C in dm³/(s·bar) |
| C | Q_n | Q_n ≈ 250 C in L/min (for b ≈ 0.3) |
| Cv | Q_n | Q_n ≈ 1000 Cv in L/min |
| C | effective area S | S ≈ 5 C in mm² |

Only the first is a plain conversion. The others assume a particular shape of the flow curve and can be 10–20 % out for a given valve: use them to compare catalogues, and C and b to size.

> [!note] American practice counts free air in SCFM, standard cubic feet per minute: 1 SCFM ≈ 29 L/min ANR (the two standard atmospheres differ slightly). A valve's Cv of 1 passes very roughly 35 SCFM at a 1 bar drop from 6 bar.
`,
  ideas: [
    'Kv is m³/h of water at a 1 bar drop; Cv is US gal/min of water at a 1 psi drop; Kv ≈ 0.865 Cv.',
    'For liquids the flow goes with √Δp; for air the liquid coefficients work only for moderate drops and cannot show choking.',
    'The nominal flow Q_n is free air at 6 → 5 bar gauge: one point on the flow curve.',
    'C ≈ 4 Cv, Q_n ≈ 250 C ≈ 1000 Cv — rough equivalences for comparing catalogues, not for sizing.',
    'ISO 6358\'s C and b describe the whole flow curve of a pneumatic component.'
  ],
  pitfalls: [
    'All flow ratings are the same thing in different units — Only Kv and Cv are related by a units conversion; Q_n and C describe air at particular or all pressures, and converting to them assumes a curve shape.',
    'Q_n is the flow a valve gives when exhausting a cylinder — Q_n is measured at a 1 bar drop; exhausting from 5 bar to the atmosphere, the valve is choked and passes considerably more.',
    'Doubling the pressure drop doubles the flow — For a liquid it multiplies it by √2; for air, once choked, lowering the outlet pressure adds nothing.'
  ],
  formulas: [
    {
      name: 'Kv: flow of a liquid',
      expr: 'Q = Kv*sqrt(dp/G)', tex: 'Q = K_v\\sqrt{\\dfrac{\\Delta p}{G}}',
      vars: {
        Q: { name: 'liquid flow', q: false, unit: 'm³/h' },
        Kv: { name: 'flow coefficient', q: false, unit: 'm³/h', value: 2.5, tex: 'K_v' },
        dp: { name: 'pressure drop across the valve', q: false, unit: 'bar', value: 0.5, tex: '\\Delta p' },
        G: { name: 'relative density (water = 1)', value: 1 }
      },
      note: 'The definition of Kv, for turbulent flow of a liquid. Empirical units: m³/h and bar.',
      stories: { Q: 'A water valve with Kv = {Kv} has a pressure drop of {dp}. What flow passes?', dp: 'A valve with Kv = {Kv} must pass {Q} of water. What pressure drop will it cause?' }
    },
    {
      name: 'Kv from Cv',
      expr: 'Kv = 0.865*Cv', tex: 'K_v = 0.865\\,C_v',
      vars: {
        Kv: { name: 'flow coefficient Kv', q: false, unit: 'm³/h', tex: 'K_v' },
        Cv: { name: 'flow coefficient Cv', q: false, unit: 'US gal/min', value: 0.5, tex: 'C_v' }
      },
      note: 'A change of units (1 US gal/min = 0.2271 m³/h; 1 psi = 0.06895 bar), rounded to three figures.',
      stories: { Kv: 'A valve is rated Cv = {Cv}. What is its Kv?', Cv: 'A valve is rated Kv = {Kv}. What is its Cv?' }
    },
    {
      name: 'Air through a Kv (moderate pressure drop)',
      expr: 'Q = 485*Kv*sqrt((p1 - p2)*p2)', tex: 'Q_\\text{ANR} = 485\\,K_v\\sqrt{(p_1 - p_2)\\,p_2}',
      vars: {
        Q: { name: 'free-air flow', q: false, unit: 'L/min ANR', tex: 'Q_\\text{ANR}' },
        Kv: { name: 'flow coefficient', q: false, unit: 'm³/h', value: 0.43, tex: 'K_v' },
        p1: { name: 'inlet pressure (absolute)', q: false, unit: 'bar', value: 7.013, tex: 'p_1' },
        p2: { name: 'outlet pressure (absolute)', q: false, unit: 'bar', value: 6.013, tex: 'p_2' }
      },
      note: 'Air at about 20 °C treated as a liquid of its outlet density; for p₂ above about half of p₁. Solving for p₂ gives two answers; the one above p₁/2 is the physical one. For choked flow and exact results use C and b.',
      stories: { Q: 'A valve with Kv = {Kv} has {p1} at its inlet and {p2} at its outlet. About how much free air passes?', Kv: 'A valve must pass {Q} of free air from {p1} to {p2}. What Kv does it need?' }
    }
  ],
  examples: [
    {
      title: 'A water valve',
      q: 'A valve with Kv = 2.5 m³/h controls cooling water with a pressure drop of 0.5 bar. What flow passes?',
      steps: ['$Q = 2.5\\sqrt{0.5/1} = 1.77$ m³/h.', 'In litres per minute: $1.77 \\times 1000/60 = 29.5$ L/min.'],
      a: 'About 1.8 m³/h, 29.5 L/min.'
    },
    {
      title: 'From Cv to air flow',
      q: 'A small valve is rated Cv = 0.5. Estimate its Kv and the free air it passes from 6 bar to 5 bar gauge — its nominal flow.',
      steps: [
        '$K_v = 0.865 \\times 0.5 = 0.43$ m³/h.',
        'Absolute pressures: 7.013 and 6.013 bar.',
        '$Q = 485 \\times 0.43 \\times \\sqrt{1.0 \\times 6.013} = 485 \\times 0.43 \\times 2.452 = 514$ L/min ANR.',
        'The rule Q_n ≈ 1000 Cv gives 500 L/min, and C ≈ 4 Cv = 2 dm³/(s·bar) with b = 0.3 gives 509 L/min by ISO 6358: all within a few per cent here.'
      ],
      a: 'Kv ≈ 0.43 m³/h and Q_n ≈ 510 L/min.'
    },
    {
      title: 'Two catalogues, one choice',
      q: 'Valve A is listed with Q_n = 780 L/min, valve B with Cv = 0.7. Which passes more?',
      steps: [
        'B: Q_n ≈ 1000 × 0.7 = 700 L/min; or C ≈ 4 × 0.7 = 2.8 dm³/(s·bar).',
        'A: C ≈ 780/250 = 3.1 dm³/(s·bar).',
        'A is about 10 % larger — within the uncertainty of the conversions. Ask both makers for C and b before choosing on flow alone.'
      ],
      a: 'Probably A, by about 10 %, which is too close to call from these rough rules.'
    }
  ],
  quiz: [
    { q: 'Kv is defined as…', choices: ['the flow of air in L/min at 6 bar', 'the flow of water in m³/h at a 1 bar pressure drop', 'the flow of water in US gal/min at 1 psi', 'the sonic conductance in dm³/(s·bar)'], a: 1,
      why: 'Kv: m³/h of water at 1 bar drop. Cv is the American US gal/min at 1 psi; sonic conductance is ISO 6358\'s air rating.' },
    { q: 'A valve is rated Cv = 1.2. What is its Kv?', answer: 1.04, unit: 'm³/h', tol: 0.02,
      why: 'Kv = 0.865 × 1.2 = 1.04 m³/h.' },
    { q: 'A valve\'s nominal flow Q_n tells you the flow when it exhausts a cylinder at 5 bar to the atmosphere.', a: false,
      why: 'Q_n is measured at a 1 bar drop (6 → 5 bar gauge). Exhausting to the atmosphere the valve is choked and passes much more.' },
    { q: 'Doubling the pressure drop across a water valve multiplies the flow by…', choices: ['2', '√2', '4', '½'], a: 1,
      why: 'Q = Kv √Δp: twice the drop gives √2 ≈ 1.41 times the flow.' },
    { q: 'Which of these is a plain change of units, not an approximation that depends on the valve?', choices: ['C ≈ 4 Cv', 'Kv ≈ 0.865 Cv', 'Q_n ≈ 250 C', 'Q_n ≈ 1000 Cv'], a: 1,
      why: 'Kv and Cv measure the same thing (water at a set drop) in different units. The others assume a particular flow curve for air.' }
  ],
  applications: ['Comparing valves from catalogues that quote different ratings.', 'Sizing water, oil and process valves by Kv or Cv.', 'Estimating the free-air flow of an older valve documented only with Cv.'],
  history: 'The Cv coefficient came from the American control-valve industry in the 1940s, for sizing valves on liquids; Kv is its metric counterpart. Neither was made for air, which is why pneumatics adopted the sonic conductance of ISO 6358, first published in 1989.',
  sim: 'valve-flow-curve'
},

{
  id: 'sonic-conductance', parent: 'valve-flow', title: 'Sonic conductance and critical pressure ratio', level: 3,
  short: 'ISO 6358 rates a pneumatic component with two numbers: the sonic conductance C, the choked flow per bar of upstream absolute pressure, and the critical pressure ratio b, below which the flow is choked. Above b the flow falls along a quarter-ellipse to zero.',
  keywords: ['sonic conductance', 'critical pressure ratio', 'ISO 6358', 'choked flow', 'subsonic flow', 'flow characteristic', 'effective area', 'subsonic index', 'dm³/(s·bar)', 'valve flow', 'conductances in series'],
  prereq: ['choked-flow', 'flow-coefficients', 'absolute-gauge-pressure'],
  related: ['valve-sizing', 'conductance-series', 'filling-emptying', 'tubing-length-effect', 'air-flow-basics', 'standard-air', 'aerodynamics:de-laval-nozzle', 'aerodynamics:isentropic-flow'],
  body: `
Air through a valve behaves like air through a nozzle: push harder and more flows — up to a point. When the downstream pressure falls low enough, the air in the narrowest passage reaches the speed of sound and the flow is **choked**: lowering the downstream pressure further no longer increases it (see [[choked-flow]] and [[aerodynamics:de-laval-nozzle|nozzles]]). ISO 6358-1:2013 describes any pneumatic component — valve, fitting, silencer, tube — by where it chokes and how much it passes then.

### Two numbers for a whole curve
- The **sonic conductance** $C$ is the choked flow of free air divided by the upstream absolute pressure: $Q = C\\,p_1$. It is quoted in dm³/(s·bar). A valve with $C = 2$ passes 2 dm³/s of free air for every bar of absolute upstream pressure — 14 dm³/s, or 842 L/min, from 6 bar gauge (7.013 bar absolute).
- The **critical pressure ratio** $b$ is the ratio $p_2/p_1$ of absolute pressures below which the flow is choked. An ideal convergent nozzle has 0.528; real valves, with losses before and after their narrowest passage, have 0.2–0.5.

Above $b$ the flow falls along a quarter-ellipse to zero at $p_2 = p_1$:

$$Q = C\\,p_1\\sqrt{1 - \\left(\\frac{p_2/p_1 - b}{1 - b}\\right)^2}\\,\\sqrt{\\frac{T_0}{T_1}}$$

with $T_0$ = 293.15 K. Hot air passes less free air: at 60 °C, 6 % less. Flows are free air (ANR, see [[standard-air]]); multiply by $\\rho_0$ = 1.185 kg/m³ for the mass flow. The 2013 edition generalises the square root to an exponent $m$, the subsonic index (0.5 gives the ellipse), and adds a cracking pressure for components such as non-return valves that need a little pressure before they open.

| $p_2/p_1$ (absolute) | 0.2 | 0.3 | 0.5 | 0.7 | 0.85 | 0.95 |
|---|---|---|---|---|---|---|
| Share of the choked flow ($b$ = 0.3) | 100 % | 100 % | 96 % | 82 % | 62 % | 37 % |

The curve is flat for a long way: even at a ratio of 0.7 the valve passes four-fifths of its choked flow.

### What it means for a cylinder
Pneumatic valves spend much of their working life choked. Filling a cylinder chamber from 6 bar gauge, the flow stays choked until the chamber reaches $b\\,p_1$ — about 1.1 bar gauge with $b$ = 0.3 — and only then begins to fall off. Exhausting a chamber at 4 bar gauge to the atmosphere, the ratio 1.013/5.013 = 0.2 is below $b$: choked, and the flow is simply $C$ times the chamber's absolute pressure. That is why a cylinder's speed is so often set by its exhaust path (see [[valve-sizing]] and [[filling-emptying]]).

### Effective area
An ideal nozzle of area $S$ chokes at a mass flow $\\dot m \\approx 0.0404\\,S\\,p_1/\\sqrt{T_1}$ (SI units), so a conductance corresponds to an **effective area** of about $S \\approx 5\\,C$ (mm², with C in dm³/(s·bar)). A valve with $C = 2$ flows like a perfect nozzle of 10 mm², 3.6 mm across — however large its ports look. The older ratings are single points on the same curve (see [[flow-coefficients]]): $C \\approx 4\\,C_v$ is only a rough equivalence.

### Components in series
A valve, its fittings, a tube and a silencer each have their own $C$ and $b$. In series the combined conductance is smaller than the smallest of them, approximately

$$\\frac{1}{C^2} \\approx \\sum_i \\frac{1}{C_i^2}$$

and the combined $b$ is lower too. ISO 6358-3:2014 gives the full method (see [[conductance-series]]). Try any values in the [valve flow calculator](#/tools/pneu/valve).

> [!key] Two numbers — $C$ for how much flows when choked, $b$ for where choking starts — describe a component's flow at every pair of pressures. Cv, Kv and Q_n are single points on that curve.
`,
  ideas: [
    'Choked flow is Q = C p₁: it depends only on the upstream absolute pressure (and temperature), not on the downstream pressure.',
    'The flow is choked for p₂/p₁ ≤ b; real valves have b ≈ 0.2–0.5, an ideal nozzle 0.528.',
    'Above b the flow falls along a quarter-ellipse, slowly at first: at p₂/p₁ = 0.7 it is still about 80 % of the choked flow (b = 0.3).',
    'An exhausting cylinder chamber is usually choked, so the exhaust conductance often sets the speed.',
    'C ≈ S/5: a conductance of 1 dm³/(s·bar) is an ideal nozzle of about 5 mm².'
  ],
  pitfalls: [
    'Lowering the downstream pressure always increases the flow — Once p₂/p₁ is below b the flow is choked; only a higher upstream pressure (or cooler air) increases it.',
    'C can be used with gauge pressures — The ISO 6358 relations use absolute pressures: 6 bar gauge is 7.013 bar absolute, and the choked flow is C × 7.013.',
    'A valve\'s port size tells its flow — The effective area is set by the narrowest passage inside; two valves with G1/4 ports can differ by a factor of two in C.'
  ],
  formulas: [
    {
      name: 'Choked flow',
      expr: 'Q = C*p1*sqrt(T0/T1)', tex: 'Q = C\\,p_1\\sqrt{\\dfrac{T_0}{T_1}}',
      vars: {
        Q: { name: 'free-air flow', q: 'airflow', unit: 'L/min ANR' },
        C: { name: 'sonic conductance', q: 'flowcond', unit: 'dm³/(s·bar)', value: 2 },
        p1: { name: 'upstream pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.013, tex: 'p_1' },
        T0: { name: 'reference temperature (ISO 8778)', q: 'temperature', unit: '°C', value: 20, fixed: true, tex: 'T_0' },
        T1: { name: 'upstream air temperature', q: 'temperature', unit: '°C', value: 20, tex: 'T_1' }
      },
      note: 'Valid while p₂/p₁ ≤ b. Pressures absolute; the flow is free air at 20 °C and 1 bar (ANR).',
      practice: { unknowns: ['Q', 'C', 'p1'] },
      stories: { Q: 'A valve with C = {C} is supplied at {p1} with air at {T1} and exhausts to the atmosphere (choked). How much free air passes?', C: 'A choked valve must pass {Q} of free air with {p1} upstream. What sonic conductance does it need?' }
    },
    {
      name: 'Subsonic flow (ISO 6358 ellipse)',
      expr: 'Q = C*p1*sqrt(1 - ((p2/p1 - b)/(1 - b))^2)', tex: 'Q = C\\,p_1\\sqrt{1 - \\left(\\dfrac{p_2/p_1 - b}{1 - b}\\right)^2}',
      vars: {
        Q: { name: 'free-air flow', q: 'airflow', unit: 'L/min ANR' },
        C: { name: 'sonic conductance', q: 'flowcond', unit: 'dm³/(s·bar)', value: 2 },
        p1: { name: 'upstream pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.013, tex: 'p_1' },
        p2: { name: 'downstream pressure (absolute)', q: 'pressure', unit: 'bar', value: 5.013, tex: 'p_2' },
        b: { name: 'critical pressure ratio', value: 0.3, min: 0, max: 0.6 }
      },
      note: 'For b < p₂/p₁ ≤ 1, air at 20 °C; below b use the choked flow C p₁. Pressures absolute.',
      practice: { unknowns: ['Q', 'C', 'p2'] },
      stories: { Q: 'A valve with C = {C} and b = {b} has {p1} upstream and {p2} downstream. What free-air flow passes?', p2: 'A valve (C = {C}, b = {b}) supplied at {p1} passes {Q}. What is the downstream pressure?' }
    },
    {
      name: 'Choked flow of an ideal nozzle',
      expr: 'm = k*S*p1/sqrt(T1)', tex: '\\dot m = k\\,\\dfrac{S\\,p_1}{\\sqrt{T_1}}',
      vars: {
        m: { name: 'mass flow', q: 'massflow', unit: 'g/s', tex: '\\dot m' },
        k: { name: 'nozzle constant for air, √(γ/R) (2/(γ+1))^((γ+1)/(2(γ−1)))', unit: 's·√K/m', value: 0.0404, fixed: true },
        S: { name: 'effective area', q: 'area', unit: 'mm²', value: 10 },
        p1: { name: 'upstream pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.013, tex: 'p_1' },
        T1: { name: 'upstream air temperature', q: 'temperature', unit: '°C', value: 20, tex: 'T_1' }
      },
      note: 'For γ = 1.4 and R = 287 J/(kg·K). Comparing with ṁ = ρ₀ C p₁ gives S ≈ 5 C (mm² against dm³/(s·bar)).',
      practice: { unknowns: ['m', 'S'] },
      stories: { m: 'An ideal nozzle of effective area {S} is supplied at {p1} and {T1}. What mass flow passes when choked?', S: 'A component passes {m} when choked at {p1} and {T1}. What is its effective area?' }
    }
  ],
  examples: [
    {
      title: 'Choked: exhausting to the atmosphere',
      q: 'A valve with C = 2 dm³/(s·bar) and b = 0.3 is supplied at 6 bar gauge and exhausts to the atmosphere. How much free air passes?',
      steps: [
        'Absolute pressures: $p_1 = 7.013$ bar, $p_2 = 1.013$ bar; ratio 0.144 < b: choked.',
        '$Q = C\\,p_1 = 2 \\times 7.013 = 14.0$ dm³/s = 842 L/min ANR.'
      ],
      a: '842 L/min of free air, whatever the downstream pressure below 2.1 bar absolute.'
    },
    {
      title: 'Subsonic: filling a chamber at 4 bar',
      q: 'The same valve feeds a chamber that is at 4 bar gauge. How much free air passes now?',
      steps: [
        'Ratio: $5.013/7.013 = 0.715 > 0.3$: subsonic.',
        '$(0.715 - 0.3)/0.7 = 0.593$; squared 0.351; $\\sqrt{1 - 0.351} = 0.805$.',
        '$Q = 842 \\times 0.805 = 678$ L/min ANR.'
      ],
      a: '678 L/min — still 81 % of the choked flow with the chamber at 4 bar.'
    },
    {
      title: 'C and b from two measurements',
      q: 'On a test bench a valve passes 600 L/min of free air from 7.013 bar absolute to the atmosphere, and 360 L/min with the outlet held at 6.013 bar absolute. Find C and b.',
      steps: [
        'Choked flow: $C = Q/p_1 = (600/60\\,\\text{dm}^3/\\text{s})/7.013 = 1.43$ dm³/(s·bar).',
        'At the second point $Q/(C p_1) = 360/600 = 0.6$, so $1 - x^2 = 0.36$ and $x = 0.8$, with $x = (r - b)/(1 - b)$ and $r = 6.013/7.013 = 0.857$.',
        '$0.857 - b = 0.8 - 0.8\\,b$ gives $b = 0.057/0.2 = 0.29$.'
      ],
      a: 'C ≈ 1.43 dm³/(s·bar), b ≈ 0.29. ISO 6358 fits the whole measured curve rather than two points, but the idea is the same.'
    }
  ],
  quiz: [
    { q: 'A valve (b = 0.3) is supplied at 6 bar gauge. Its outlet pressure is lowered from 1 bar gauge to 0 bar gauge. The flow…', choices: ['rises by about 15 %', 'stays the same', 'doubles', 'falls'], a: 1,
      why: 'At 1 bar gauge the ratio is 2.013/7.013 = 0.29, already below b: the flow is choked and does not depend on the outlet pressure.' },
    { q: 'A valve with C = 1.5 dm³/(s·bar) is supplied at 5 bar gauge and choked. How much free air passes?', answer: 541, unit: 'L/min ANR', tol: 0.02,
      why: 'Q = C p₁ = 1.5 × 6.013 = 9.02 dm³/s = 541 L/min.' },
    { q: 'The critical pressure ratio b of a real valve is usually larger than the 0.528 of an ideal nozzle.', a: false,
      why: 'Losses before and after the narrowest passage keep the flow choked down to lower ratios: real valves have b of about 0.2–0.5.' },
    { q: 'The upstream air warms from 20 °C to 80 °C, with the same pressures and the valve choked. The free-air flow changes by about…', choices: ['+9 %', '−9 %', '−27 %', 'nothing'], a: 1,
      why: 'Q goes with √(T₀/T₁) = √(293/353) = 0.91.' },
    { q: 'A valve of C = 2 and a tube of C = 2 in series pass, when choked, about as much as a single restriction of C ≈…', choices: ['4', '2', '1.4', '1'], a: 2,
      why: '1/C² ≈ 1/4 + 1/4 = 1/2, so C ≈ 1.41 — less than either alone, but more than half.' }
  ],
  problems: [
    { q: 'A silencer has C = 3 dm³/(s·bar). A cylinder chamber at 5 bar gauge exhausts through it (choked). What free-air flow leaves the chamber at that moment?', answer: 1082, unit: 'L/min', tol: 0.02,
      steps: ['$p_1 = 6.013$ bar absolute; the ratio 1.013/6.013 = 0.17 is below any realistic b: choked.', '$Q = 3 \\times 6.013 = 18.0$ dm³/s = 1082 L/min.'] }
  ],
  applications: ['Comparing and sizing valves, fittings, silencers and tubes on one basis.', 'Simulating pneumatic drives: chamber filling and emptying by ISO 6358 (as in the simulations of this app).', 'Diagnosing slow cylinders: the component with the smallest C in the exhaust path sets the speed.'],
  history: 'ISO 6358 was first published in 1989, after measurements showed that pneumatic components follow a nozzle-like curve with their own critical ratio. The 2013 revision split it into parts, added the subsonic index and a cracking pressure, and ISO 6358-3:2014 covered components in series.',
  sim: 'valve-flow-curve'
},

{
  id: 'valve-sizing', parent: 'valve-flow', title: 'Sizing a valve for a cylinder', level: 3,
  short: 'A cylinder\'s running speed is roughly v ≈ C p_ref / A when its exhaust path is choked, so the stroke time sets the conductance the whole path needs; take off the tubes in series, add a margin and choose the next valve size up.',
  keywords: ['valve sizing', 'cylinder speed', 'stroke time', 'sonic conductance', 'choked exhaust', 'tubes in series', 'valve size', 'port size', 'margin', 'G1/8', 'G1/4', 'M5'],
  prereq: ['sonic-conductance', 'cylinder-speed-pneu', 'air-consumption'],
  related: ['conductance-series', 'tubing-length-effect', 'sizing-procedure', 'cylinder-motion', 'filling-emptying', 'flow-control-pneu', 'pneumatic-cushioning', 'kinetic-energy-limits', 'pneumatic-cylinder', 'hydraulics:valve-sizing-dynamics'],
  body: `
A cylinder that is too slow has usually been given too small a valve — or too long a tube. Sizing means finding the sonic conductance the whole flow path needs for the speed or stroke time the machine requires, then adding a margin.

### Where the speed comes from
In steady motion the piston pushes air out of the exhausting chamber as fast as the exhaust path lets it go. With meter-out flow controls, and in most circuits anyway, that path is choked (see [[sonic-conductance]]): the free-air flow out is $C\\,p_B$, with $p_B$ the chamber's absolute pressure. The chamber gives up air at $A\\,v\\,p_B/p_\\text{ref}$ (Boyle's law at steady temperature). Setting the two equal, $p_B$ cancels:

$$v \\approx \\frac{C\\,p_\\text{ref}}{A}$$

where $A$ is the area the exhausting air leaves from — the annulus when extending, the full piston when retracting — and $p_\\text{ref}$ = 1 bar. A conductance of 1 dm³/(s·bar) lets 1 dm³ of chamber volume out per second: 0.61 m/s for the 16.5 cm² annulus of a 50 mm cylinder with a 20 mm rod. The back-pressure settles wherever the force balance needs it. This is the **running speed**; a whole stroke also spends time building and dropping pressures and accelerating the load (see [[cylinder-motion]]).

### A sizing procedure
1. **Average speed**: $\\bar v = s/t$ for the stroke $s$ and the time $t$.
2. **Running speed**: aim for about $1.5\\,\\bar v$ — more for heavily loaded or short-stroke cylinders, whose start-up delay is a larger share of the time.
3. **Conductance of the path**: $C = A\\,v/p_\\text{ref}$.
4. **Take off the tubes and fittings**: they are in series with the valve, $1/C^2 \\approx 1/C_\\text{valve}^2 + 1/C_\\text{tube}^2$ (see [[conductance-series]] and [[tubing-length-effect]]).
5. **Add a margin** of 20–30 % for friction that grows, supply pressure that sags and flow controls that are never fully open; choose the next valve size up.
6. **Check** by simulation or test, and check the free air the cylinder draws at that speed, $Q = A_1 v\\,(p_g + p_\\text{atm})/p_\\text{atm}$, against the supply lines (see [[air-consumption]]).

| Port size | Typical C (dm³/(s·bar)) | ≈ Cv | ≈ Q_n (L/min) | Bores at about 0.5 m/s |
|---|---|---|---|---|
| M5 | 0.2–0.5 | 0.05–0.12 | 50–130 | up to 20–25 mm |
| G1/8 | 1–2 | 0.25–0.5 | 250–500 | 25–50 mm |
| G1/4 | 2.5–4.5 | 0.6–1.1 | 600–1100 | 50–80 mm |
| G3/8 | 5–7 | 1.2–1.8 | 1200–1800 | 80–100 mm |
| G1/2 | 8–12 | 2–3 | 2000–3000 | 100–125 mm |

Round figures only: valves with the same port size differ by a factor of two.

### Bigger is not always better
An oversized valve costs more, fills and empties its own passages with every stroke, and makes the cylinder arrive harder at the end cap, needing better cushioning (see [[pneumatic-cushioning]] and [[kinetic-energy-limits]]); flow controls then throttle the extra capacity away. And past a point a bigger valve changes nothing: long thin tubes, a small silencer or a restrictive fitting set the speed. Size the whole path, not only the valve.

> [!tip] If a cylinder is too slow, check in this order: the flow controls, the silencers, the tube length and bore, the fittings — then the valve. Raising the pressure is the last resort (see [[pneumatic-cylinder]]).
`,
  ideas: [
    'With a choked exhaust the running speed is v ≈ C p_ref/A: set by the exhaust conductance and the area the air leaves from, not by the back-pressure.',
    'Retracting, the air leaves the larger piston area, so the same valve retracts more slowly than it extends when the exhaust limits.',
    'Design for a running speed about 1.5 times the average speed, to allow for pressure build-up and acceleration.',
    'Tubes and fittings are in series with the valve: 1/C² ≈ Σ 1/Cᵢ². Long thin tubes can make any valve too slow.',
    'Add 20–30 % margin and choose the next size up — but no bigger than needed.'
  ],
  pitfalls: [
    'A bigger valve always makes the cylinder faster — Only while the valve is the smallest restriction in the path; with long thin tubes or small silencers a bigger valve changes little.',
    'The average speed is the speed the valve must give — The stroke includes time to build pressure and accelerate; the running speed must be higher, typically 1.3–1.7 times the average.',
    'Raising the supply pressure is the way to a faster cylinder — With a choked exhaust the running speed hardly depends on pressure; it mostly adds air consumption and harder end-stop impacts.'
  ],
  formulas: [
    {
      name: 'Running speed with a choked exhaust',
      expr: 'v = C*pref/A', tex: 'v = \\dfrac{C\\,p_\\text{ref}}{A}',
      vars: {
        v: { name: 'running speed of the piston', q: 'speed', unit: 'm/s' },
        C: { name: 'sonic conductance of the exhaust path', q: 'flowcond', unit: 'dm³/(s·bar)', value: 1.24 },
        pref: { name: 'reference pressure (absolute, ANR)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_\\text{ref}' },
        A: { name: 'area the air leaves from (annulus when extending)', q: 'area', unit: 'cm²', value: 16.49 }
      },
      note: 'Steady motion at steady temperature, exhaust path choked (chamber above about 2–3 bar absolute). A whole stroke is slower: add the time to build pressure and accelerate.',
      stories: { v: 'A cylinder exhausts from an area of {A} through a path of C = {C}. What running speed can it reach?', C: 'A cylinder must run at {v}; the air leaves from an area of {A}. What conductance must the exhaust path have?' }
    },
    {
      name: 'Valve needed with a tube in series',
      expr: 'Cvl = 1/sqrt(1/C^2 - 1/Ct^2)', tex: 'C_\\text{valve} = \\dfrac{1}{\\sqrt{1/C^2 - 1/C_\\text{tube}^2}}',
      vars: {
        Cvl: { name: 'sonic conductance the valve needs', q: 'flowcond', unit: 'dm³/(s·bar)', tex: 'C_\\text{valve}' },
        C: { name: 'conductance the whole path needs', q: 'flowcond', unit: 'dm³/(s·bar)', value: 1.24 },
        Ct: { name: 'conductance of the tube and fittings', q: 'flowcond', unit: 'dm³/(s·bar)', value: 2.8, tex: 'C_\\text{tube}' }
      },
      note: 'From the approximate series rule 1/C² = 1/C_valve² + 1/C_tube². If the tube alone has less conductance than the path needs, no valve is big enough.',
      stories: { Cvl: 'The exhaust path must reach C = {C}, and the tube and fittings have {Ct}. What conductance must the valve have?' }
    },
    {
      name: 'Free air drawn at running speed',
      expr: 'Q = A*v*(p + patm)/patm', tex: 'Q = A_1\\,v\\,\\dfrac{p_g + p_\\text{atm}}{p_\\text{atm}}',
      vars: {
        Q: { name: 'free-air flow into the cylinder', q: 'airflow', unit: 'L/min ANR' },
        A: { name: 'area being filled (piston when extending)', q: 'area', unit: 'cm²', value: 19.63, tex: 'A_1' },
        v: { name: 'piston speed', q: 'speed', unit: 'm/s', value: 0.75 },
        p: { name: 'supply pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' }
      },
      note: 'An upper estimate, taking the driving chamber at full supply pressure. This peak flow must also get through the supply line and the service unit.',
      stories: { Q: 'A cylinder with a piston area of {A} extends at {v} with {p} supply. What peak free-air flow does it draw?' }
    }
  ],
  examples: [
    {
      title: 'A valve for 300 mm in 0.6 s',
      q: 'A 50 mm cylinder with a 20 mm rod must extend 300 mm in 0.6 s at 6 bar, moving 5 kg against a load of 30 % of its force. The valve is connected by 1 m of 8 mm tube (5.5 mm bore) with fittings, together C ≈ 2.8 dm³/(s·bar). Which valve?',
      steps: [
        'Average speed $\\bar v = 0.3/0.6 = 0.5$ m/s; design running speed $1.5 \\times 0.5 = 0.75$ m/s.',
        'Annulus: $\\pi(0.05^2 - 0.02^2)/4 = 16.49$ cm². Path conductance: $C = 16.49\\times10^{-4} \\times 0.75/10^5 = 1.24\\times10^{-8}$ m³/(s·Pa) = 1.24 dm³/(s·bar).',
        'Take off the tube: $C_\\text{valve} = 1/\\sqrt{1/1.24^2 - 1/2.8^2} = 1.38$ dm³/(s·bar).',
        'With a 25 % margin: 1.73 — a large G1/8 valve or a G1/4 one.',
        'Check: a simulation of the full stroke (the one on this page) gives 0.60 s with C = 1.38, and 0.35 s with a typical G1/4 valve.'
      ],
      a: 'A valve of at least C ≈ 1.7 dm³/(s·bar), such as a G1/4 valve; the unmargined 1.38 just meets 0.6 s.'
    },
    {
      title: 'Why it retracts more slowly',
      q: 'The same cylinder and path (C = 1.24 dm³/(s·bar)) retract with the exhaust leaving the cap end. Compare the running speeds.',
      steps: [
        'Extending, the air leaves the annulus: $v = 1.24\\times10^{-8} \\times 10^5/16.49\\times10^{-4} = 0.75$ m/s.',
        'Retracting, it leaves the full piston area of 19.63 cm²: $v = 1.24\\times10^{-3}/19.63\\times10^{-4} = 0.63$ m/s.'
      ],
      a: 'About 16 % slower retracting, unless the meter-out controls are set differently.'
    },
    {
      title: 'When the tubes win',
      q: 'The valve sits 5 m from the same cylinder, connected by 6 mm tube (4 mm bore): C_tube ≈ 0.67 dm³/(s·bar). How fast can the cylinder run, whatever the valve?',
      steps: [
        'Even with an unlimited valve, the path conductance is at most that of the tube, 0.67.',
        '$v = 0.67\\times10^{-3}/16.49\\times10^{-4} = 0.41$ m/s running; the whole 300 mm stroke then takes over a second.'
      ],
      a: 'At most about 0.4 m/s: the target of 0.6 s cannot be met. Move the valve to the cylinder or use wider tubes.'
    }
  ],
  quiz: [
    { q: 'A cylinder\'s exhaust path is choked. Raising the supply from 6 to 7 bar changes its running speed…', choices: ['by about +15 %', 'hardly at all', 'by +100 %', 'by −15 %'], a: 1,
      why: 'With a choked exhaust v ≈ C p_ref/A: the back-pressure cancels out. The higher pressure mainly adds air consumption and impact energy.' },
    { q: 'A 32 mm cylinder with a 12 mm rod extends with an exhaust path of C = 0.5 dm³/(s·bar), choked. What running speed can it reach?', answer: 0.72, unit: 'm/s', tol: 0.03,
      why: 'Annulus 8.04 − 1.13 = 6.91 cm²; v = 0.5×10⁻⁸ × 10⁵/6.91×10⁻⁴ = 0.72 m/s.' },
    { q: 'A valve of C = 3 is connected through a tube of C = 1.5. The path conductance is about…', choices: ['4.5', '3', '1.34', '1.5'], a: 2,
      why: '1/C² = 1/9 + 1/2.25 = 0.556, so C = 1.34 — below the smaller of the two.' },
    { q: 'Doubling the valve\'s conductance always halves the stroke time.', a: false,
      why: 'Tubes, fittings and silencers in series, the start-up delay and the load all limit the gain; past a point a bigger valve changes little.' },
    { q: 'A cylinder is too slow. What should you check first?', choices: ['raise the supply pressure', 'the flow controls and silencers', 'fit a bigger bore', 'change the valve'], a: 1,
      why: 'Closed flow controls and blocked silencers are the commonest causes, and the cheapest to fix. A bigger bore needs even more air.' }
  ],
  problems: [
    { q: 'A 63 mm cylinder with a 20 mm rod must run at 0.8 m/s while extending. What conductance must its exhaust path have (choked, p_ref = 1 bar)?', answer: 2.24, unit: 'dm³/(s·bar)', tol: 0.02,
      steps: ['Annulus: $\\pi(0.063^2 - 0.02^2)/4 = 2.803\\times10^{-3}$ m².', '$C = A v/p_\\text{ref} = 2.803\\times10^{-3} \\times 0.8/10^5 = 2.24\\times10^{-8}$ m³/(s·Pa) = 2.24 dm³/(s·bar).'] }
  ],
  applications: ['Choosing valve sizes and tube bores for new machines from the cycle times they must meet.', 'Finding why an existing cylinder is slow: the smallest conductance in its path.', 'Placing valves close to their cylinders (valve terminals on the machine, valves on the cylinder) to cut tube losses.'],
  sim: 'valve-sizing'
},

{
  id: 'iso-1219-pneu', parent: 'pneumatic-symbols', title: 'ISO 1219 symbols for pneumatics', level: 1,
  short: 'Pneumatic circuits are drawn in the graphic symbols of ISO 1219-1:2012 and laid out by ISO 1219-2:2012: squares for valve positions, hollow triangles for air, dashed pilot lines, supply at the bottom and actuators at the top — a language that shows what a circuit does, not how its parts are built.',
  keywords: ['ISO 1219', 'ISO 1219-1', 'ISO 1219-2', 'graphic symbols', 'circuit diagram', 'pneumatic symbols', 'valve symbol', 'pilot line', 'exhaust', 'silencer', 'service unit', 'designation', 'rest position'],
  prereq: ['way-valves', 'port-numbering', 'valve-operation'],
  related: ['direct-control', 'displacement-step-diagram', 'frl-units', 'check-valves-pneu', 'flow-control-pneu', 'shuttle-valve', 'two-pressure-valve', 'hydraulics:iso-1219'],
  body: `
A pneumatic circuit diagram is a language: a few shapes, combined by rules, describe any system without drawing its hardware. The graphic symbols are standardised in ISO 1219-1:2012 and the way a diagram is laid out in ISO 1219-2:2012; oil hydraulics uses the same language (see [[hydraulics:iso-1219|ISO 1219 in hydraulics]]).

### The rules that make symbols readable
- **Function, not construction.** A symbol says what a component does, never how it is built: a poppet 3/2 valve and a spool 3/2 valve have the same symbol (see [[poppet-spool]]).
- **Squares are positions.** A directional valve has one square per position; the ports are drawn on the square that is working in the state shown; arrows inside show flow paths and a T a blocked port (see [[way-valves]]).
- **Operators at the ends**: solenoid (a rectangle with a diagonal), push button, lever, roller, spring (a zigzag), pneumatic pilot (a hollow triangle fed by a dashed line). Each pushes the square next to it into place (see [[valve-operation]]).
- **Hollow means air.** Triangles showing flow or energy are hollow for pneumatics and filled for hydraulics: a compressor is a circle with a hollow triangle pointing out, an air motor one with the triangle pointing in.
- **Exhausts**: an open triangle at a port vents to the atmosphere; a small rectangle there is a silencer.
- **Lines**: solid for working lines, long dashes for pilot (control) lines, short dashes for drains; a dot marks a junction, and lines that cross without a dot are not connected. A dash-dot frame encloses components built as one assembly, such as a service unit.
- **The state drawn** is the rest position: the system pressurised and ready, before the start signal. A limit valve that the machine holds operated at rest is drawn operated.

### Common symbols
| Symbol | Meaning |
|---|---|
| Circle with a dot | compressed-air source |
| Circle with a hollow triangle pointing out | compressor |
| Diamond with a dashed line across | filter |
| Dash-dot frame: filter, regulator with gauge, lubricator | service unit (see [[frl-units]]) |
| Barrel with piston and rod, a port at each end | double-acting cylinder; with a spring inside, single-acting |
| Throttle with an arrow across it, beside a non-return valve | one-way flow control valve (see [[flow-control-pneu]]) |
| Ball on a V-shaped seat | non-return valve (see [[check-valves-pneu]]) |
| Box with two inlets and a ball between them | shuttle valve, OR (see [[shuttle-valve]]) |
| Box with two inlets that must both be fed | two-pressure valve, AND (see [[two-pressure-valve]]) |
| Circle with a needle | pressure gauge |

### Laying out a circuit
ISO 1219-2 lays a diagram out so that energy flows up the page: the supply and service unit at the bottom, signal elements (push buttons, limit valves) above them, then processing elements (logic and memory valves), the final control valves, and the actuators at the top. Every component carries a code. In the simple convention widely used in training, 1A1 is the first actuator of control chain 1, 1V1 its valve, 1S1 and 1S2 its signal elements, and 0Z1 the service unit that feeds everything. Limit valves are drawn at the bottom with the other signals, and a short mark with their name at the cylinder shows where the rod operates them. Every symbol used in these pages is in the [ISO 1219 symbol chart](#/tools/iso).

> [!tip] Read a circuit from the actuator down: what moves it, what switches that valve, what gives that signal. Then follow one cycle, sliding each valve's squares as the signals change — the simulation on this page lets you do exactly that.
`,
  ideas: [
    'Symbols show function, not construction; a valve is one square per position, with its ports on the square working now.',
    'Hollow triangles mean air, filled triangles oil; an open triangle at a port is an exhaust.',
    'Working lines are solid, pilot lines dashed; only a dot joins crossing lines.',
    'Circuits are drawn in their rest position, energy flowing up the page from the supply to the actuators.',
    'Components carry codes such as 1A1, 1V1 and 1S1, and limit valves are marked where the rod operates them.'
  ],
  pitfalls: [
    'A symbol shows how the valve is built — Two valves of completely different construction share a symbol if they do the same thing.',
    'Crossing lines are connected — Only a dot makes a junction; lines crossing without one pass each other.',
    'The diagram shows where the parts are on the machine — It shows how they are connected. Limit valves sit at the bottom of the diagram, however far away they are mounted.'
  ],
  examples: [
    {
      title: 'Reading one cycle',
      q: 'In the circuit on this page, what happens, step by step, after the start button 1S1 is pressed briefly?',
      steps: [
        '1S1 (a 3/2 push-button valve, normally closed) connects its port 1 to 2: air goes along the dashed pilot line to 14 of 1V1.',
        '1V1, an impulse 5/2 valve, shifts to its 14 side: 1 → 4 feeds the cap end of 1A1 through the free-flow check of 1V2; 2 → 3 lets the rod end exhaust through the throttle of 1V3 and a silencer.',
        'The rod extends at a speed set by the throttle in 1V3 (meter-out). 1S1 is released, but 1V1 remembers.',
        'At the end of the stroke the rod operates the roller of 1S2, which signals 12. 1V1 shifts back: 1 → 2 feeds the rod end, 4 → 5 exhausts the cap end through 1V2\'s throttle, and the rod returns.'
      ],
      a: 'One complete out-and-back cycle, speeds set by the two meter-out flow controls.'
    },
    {
      title: 'Describing a symbol in words',
      q: 'Describe the ISO 1219 symbol of a 5/2 solenoid valve with spring return and silenced exhausts.',
      steps: [
        'Two squares side by side (two positions).',
        'Right square (at the ports, the rest position): arrows 1 → 2 and 4 → 5, port 3 blocked. Left square: 1 → 4 and 2 → 3, port 5 blocked.',
        'Ports: 2 and 4 on top, 5, 1 and 3 below; small rectangles (silencers) on 3 and 5.',
        'Left end: a rectangle with a diagonal (solenoid, signal 14). Right end: a zigzag (spring).'
      ],
      a: 'Two squares, flow arrows as above, solenoid on the left, spring on the right, silencers on the exhausts.'
    }
  ],
  quiz: [
    { q: 'In ISO 1219, a hollow triangle at a pilot means that the pilot is…', choices: ['hydraulic', 'pneumatic', 'electrical', 'mechanical'], a: 1,
      why: 'Hollow triangles stand for air, filled ones for oil.' },
    { q: 'Two lines cross on a circuit diagram with no dot where they meet. They are…', choices: ['connected', 'not connected', 'connected only if both are pilot lines', 'a drawing error'], a: 1,
      why: 'Only a dot marks a junction. Crossing lines without one simply pass each other.' },
    { q: 'A circuit diagram is normally drawn…', choices: ['with every valve operated', 'in the rest position, pressurised and ready to start', 'at the end of the cycle', 'with the air switched off and all cylinders mid-stroke'], a: 1,
      why: 'The rest position is the reference state; valves held operated at rest, such as a limit valve pressed by the retracted rod, are drawn operated.' },
    { q: 'A poppet 3/2 valve and a spool 3/2 valve with the same operators have different ISO 1219 symbols.', a: false,
      why: 'Symbols show function, not construction; both are drawn the same way.' },
    { q: 'On a diagram laid out by ISO 1219-2, the actuators are placed…', choices: ['at the bottom', 'at the top', 'on the left', 'wherever they are on the machine'], a: 1,
      why: 'Energy flows up the page: supply at the bottom, signals and valves in between, actuators at the top.' }
  ],
  applications: ['Reading and drawing machine documentation and spare-part lists.', 'Designing and simulating circuits before building them.', 'Fault finding: following a signal from the actuator back to its source on the diagram.', 'Training, where the same symbols are used for real and simulated components.'],
  history: 'Before ISO 1219 each country drew its own symbols — Germany used DIN 24300, for instance. The international standard unified them for hydraulics and pneumatics alike; Part 1 (symbols) and Part 2 (circuit diagrams) were last revised in 2012.',
  sim: 'valve-symbols'
},

{
  id: 'port-numbering', parent: 'pneumatic-symbols', title: 'Port numbering: 1, 2, 3, 4, 5, 12, 14', level: 1,
  short: 'Pneumatic valve ports are numbered by ISO 11727: 1 supply, 2 and 4 outputs, 3 and 5 exhausts; a two-digit pilot port says what its signal connects — 14 joins 1 to 4, 12 joins 1 to 2, 10 shuts the output off.',
  keywords: ['port numbering', 'port identification', 'ISO 11727', 'port 1', 'port 2', 'port 4', 'exhaust 3', 'exhaust 5', 'pilot 12', 'pilot 14', 'pilot 10', 'P A B R S', 'sub-base', 'ISO 5599', 'ISO 15407'],
  prereq: ['way-valves'],
  related: ['iso-1219-pneu', 'valve-operation', 'solenoid-valves', 'valve-terminals', 'direct-control', 'memory-circuits'],
  body: `
Every port of a pneumatic valve carries a number, cast or printed next to it, and the same numbers appear on the circuit diagram. Knowing them lets you connect a valve without its data sheet and read a diagram at a glance. They are set out in ISO 11727:1999.

### The numbers
| Number | Port | Older letters |
|---|---|---|
| 1 | supply (pressure inlet) | P |
| 2, 4 | working outputs | A, B |
| 3, 5 | exhausts | R, S (also EA, EB) |
| 12 | pilot signal that connects 1 to 2 | pilot letters such as X, Y, Z |
| 14 | pilot signal that connects 1 to 4 | |
| 10 | pilot signal that shuts off the output | |

Even numbers are outputs, odd numbers supply and exhausts; on a 5/2 valve output 2 exhausts through 3 and output 4 through 5. A pilot port's two digits read as a sentence: **14** means "this signal connects 1 to 4", **12** "this signal connects 1 to 2". On a 3/2 normally closed valve the operating signal is therefore 12; on a 3/2 normally open valve, whose signal shuts its output off, it is **10**. The numbers belong to the solenoids as well: the coil that makes 1 → 4 is often labelled 14 on the valve.

### On valves and sub-bases
Pilot-operated valves with external pilot supply have one more port for it, commonly marked 12/14; pilot exhausts are often marked 82/84. Valves that mount on a sub-base or manifold follow standard interfaces with the same numbering — ISO 5599-1:2001 for five-port valves and ISO 15407-1:2000 for the compact 18 mm and 26 mm sizes — so that valves of different makers fit the same base (see [[valve-terminals]]).

### A cylinder, port by port
The usual convention for a double-acting cylinder on a 5/2 valve: output 4 to the cap end, output 2 to the rod end. At rest (spring position) 1 feeds 2 and the cylinder is held retracted; signal 14 connects 1 to 4 and extends it. On a 5/3 valve 14 extends, 12 retracts, and neither leaves the valve in its centre (see [[way-valves]]). In an all-pneumatic circuit a limit valve's output 2 goes to the 14 or 12 pilot of the next valve: the numbers tell you what a signal will do before you trace its line (see [[direct-control]]).

> [!tip] Port 1 is the supply and 3 and 5 are exhausts — except on valves designed for reversed flow, vacuum or two supply pressures, where the data sheet says so. A valve supplied through an exhaust port by mistake may switch sluggishly, leak or not seal at all.

> [!warn] Before disconnecting any port, exhaust the valve and the lines on both sides of it: outputs 2 and 4 can hold full pressure behind a closed valve, a non-return valve or a closed-centre 5/3 valve.
`,
  ideas: [
    '1 is the supply, 2 and 4 the outputs, 3 and 5 the exhausts; 2 exhausts through 3 and 4 through 5.',
    'A pilot port\'s two digits say what the signal connects: 14 joins 1 to 4, 12 joins 1 to 2.',
    '10 marks a signal that shuts the output off, as on a normally open 3/2 valve.',
    'The older letters P, A, B, R, S still appear on older drawings and valves.',
    'Standard sub-base interfaces (ISO 5599-1, ISO 15407-1) keep the numbering, so valves of different makers are interchangeable.'
  ],
  pitfalls: [
    'Pilot port 12 belongs to port 1 and 14 to port 4 — Both digits matter: 12 is the signal that connects 1 to 2, 14 the one that connects 1 to 4.',
    'A 3/2 valve\'s pilot is always 12 — On a normally open 3/2 valve the signal shuts the output off and is marked 10.',
    'Any port can take the supply — Most valves are made for flow from 1; supplying an exhaust port works only on valves designed for it.'
  ],
  examples: [
    {
      title: 'Connecting a 5/2 valve',
      q: 'Connect a 5/2 single-solenoid valve with spring return so that a double-acting cylinder is retracted at rest and extends when the coil is energised.',
      steps: [
        'Supply to port 1; silencers (or exhaust flow controls) on 3 and 5.',
        'Output 2 to the rod end: at rest the spring position connects 1 → 2, holding the cylinder retracted, while 4 → 5 vents the cap end.',
        'Output 4 to the cap end: the coil (signal 14) connects 1 → 4 and 2 → 3, and the cylinder extends.'
      ],
      a: '1 supply, 2 to the rod end, 4 to the cap end, 3 and 5 to silencers.'
    },
    {
      title: 'What does 10 mean?',
      q: 'A small 3/2 valve has a pilot port marked 10. What kind of valve is it, and what happens when the pilot is pressurised?',
      steps: [
        '10 is the signal that shuts off the output: without it, 1 is connected to 2.',
        'So the valve is normally open. Pressurising 10 blocks 1 and vents 2 to 3.'
      ],
      a: 'A normally open 3/2 valve; the signal at 10 switches its output off.'
    }
  ],
  quiz: [
    { q: 'Pilot port 14 on a 5/2 valve carries the signal that…', choices: ['connects 1 to 4', 'connects 1 to 2', 'exhausts 4', 'supplies the pilot stage'], a: 0,
      why: 'Read the digits as a sentence: 1 to 4.' },
    { q: 'On a 5/2 valve, output 4 exhausts through port…', choices: ['3', '5', '1', '2'], a: 1,
      why: 'Each output pairs with the next odd number: 2 with 3, 4 with 5.' },
    { q: 'A 3/2 valve whose pilot port is marked 10 is…', choices: ['normally closed', 'normally open', 'a 2/2 valve', 'externally piloted'], a: 1,
      why: '10 is the signal that shuts the output off, so without it the output is on: normally open.' },
    { q: 'Odd numbers (1, 3, 5) are supply and exhausts; even numbers (2, 4) are outputs.', a: true,
      why: 'That is the pattern of ISO 11727, which makes a valve easy to connect without its data sheet.' },
    { q: 'On older valves and drawings the supply port is marked with the letter…', choices: ['A', 'R', 'P', 'S'], a: 2,
      why: 'P for pressure; A and B were the outputs, R and S the exhausts.' }
  ],
  applications: ['Connecting and replacing valves on machines without the data sheet at hand.', 'Reading circuit diagrams and wiring solenoids to the right coil (12 or 14).', 'Specifying interchangeable valves and sub-bases to the ISO interfaces.'],
  sim: ['valve-symbols', { id: 'valve-explorer', params: { kind: 'c53' } }]
}

);
