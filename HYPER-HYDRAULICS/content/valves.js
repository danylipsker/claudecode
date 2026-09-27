/* HYPER-HYDRAULICS · content/valves.js — Hydraulic Valves: directional control valves (directional-valves-topic)
 * and pressure control valves (pressure-valves). Simulations in sims/valves.js (prefix valve-). */
Hyper.add(

{
  id: 'directional-valves', parent: 'directional-valves-topic', title: 'Directional control valves', level: 1,
  short: 'Valves that decide where the oil goes — from the pump to one side of an actuator, from the other side back to the tank, or nowhere. Most are a spool sliding in a bore; some are poppets on seats. Their size, pressure drop and leakage decide how well a machine works.',
  keywords: ['directional control valve', 'DCV', 'spool valve', 'poppet valve', 'seat valve', 'land', 'groove', 'NG6', 'NG10', 'CETOP', 'ISO 4401', 'subplate', 'pressure drop', 'leakage', 'spool clearance'],
  prereq: ['hydraulic-system', 'pressure-flow-power', 'hydraulic-cylinder'],
  related: ['spool-positions', 'centre-conditions', 'valve-actuation', 'check-valves', 'pilot-check', 'proportional-valves', 'cartridge-valves', 'iso-1219', 'port-designations', 'energy-losses-heat', 'minor-losses', 'pneumatics:directional-valves-pneu'],
  body: `
A directional control valve (DCV) is a switch for oil. It connects the pump line **P** to one actuator port, **A** or **B**, connects the other to the tank line **T**, or blocks them all. Every double-acting cylinder and every reversible motor has one; a mobile machine may have a bank of eight side by side. In a circuit diagram each valve is a row of boxes, one per position, with arrows for the paths — see [[spool-positions]] and the [ISO 1219 symbols](#/tools/iso).

### Spool or seat
Two constructions do nearly all the work.

- **Spool valves.** A hardened, ground steel spool slides in a honed bore. The bore has annular **grooves**, each drilled through to a port; the spool has full-diameter **lands** separated by narrow **necks**. Sliding the spool a few millimetres uncovers the edge of a groove and oil flows across the land. Because the pressure in each groove acts all round the spool, the spool is **pressure-balanced**: shifting it needs the same few tens of newtons at 5 bar or at 315 bar (apart from flow forces, see [[valve-actuation]]). One spool can give almost any combination of paths. The price is **leakage**: the spool must slide, so it has a radial clearance of a few micrometres, and oil seeps across every land.
- **Poppet (seat) valves.** A cone or ball is pressed onto a sharp seat. Closed, they are practically leak-free; they open fast and shrug off dirt that would jam a spool. But the pressure pushes on the poppet, so the force to open one grows with pressure unless it is balanced, and each path needs its own poppet — which is why complex poppet logic is built from [[cartridge-valves|cartridge valves]].

| | Spool valve | Poppet valve |
|---|---|---|
| Leakage when closed | some (tens of cm³/min) | practically none |
| Holding a load | drifts slowly | holds |
| Force to shift | small, independent of pressure | grows with pressure unless balanced |
| Dirt | can silt and stick | tolerant |
| Paths per valve | any combination | one per poppet |

### Sizes and mounting
Industrial valves bolt onto a **subplate** or manifold whose port pattern is standardised in ISO 4401:2005. The sizes are known by their nominal size (NG, roughly the port bore in mm) or the older CETOP numbers:

| Size | ISO 4401 | Typical flow | Typical rating |
|---|---|---|---|
| NG6 | 03 (CETOP 3) | up to 60–80 L/min | 315–350 bar at P, A, B |
| NG10 | 05 (CETOP 5) | up to 120–160 L/min | 315–350 bar |
| NG16 | 07 | up to 300 L/min | 350 bar |
| NG25 | 08 | up to 700 L/min | 350 bar |
| NG32 | 10 | over 1000 L/min | 350 bar |

The T port is often rated lower than P, A and B. Sandwich (modular) valves — checks, throttles, reducing valves — stack between the valve and its subplate; mobile machines use sectional or monoblock valves, one section per function.

### Pressure drop
Each open path behaves like an orifice, so its pressure drop grows with the square of the flow. Catalogues give a Δp–Q curve per path; scaled from a rated point,

$$\\Delta p = \\Delta p_n \\left(\\frac{Q}{Q_n}\\right)^2$$

Every bar lost is heat: $P = \\Delta p\\,Q$. Designers aim for 3–10 bar per path at the working flow; a valve pushed to twice its rated flow loses four times the pressure.

### Leakage
The clearance around a land is a thin annular slit, and laminar flow through it rises with the **cube** of the gap:

$$Q_L = \\frac{\\pi d\\, c^3\\, \\Delta p}{12\\,\\mu\\, L}$$

Double the clearance by wear and the leakage rises eightfold; an off-centre spool leaks up to 2.5 times more than a centred one; thin hot oil leaks more (see [[viscosity-temperature]]). A few tens of cm³/min is enough to let a raised load creep down, which is why loads are held by poppet valves — [[pilot-check]] and [[counterbalance-valve]].

> [!warn] A valve can shift when power returns, when someone presses its manual override, or when a sticking spool frees itself — and oil trapped between a closed valve and a cylinder keeps its pressure after the pump stops. Before any work, lower or mechanically support the load, stop and lock out the power unit, release the pressure in every line (including lines isolated by valves) and discharge accumulators. Never feel for a leak by hand: oil from a pinhole can be injected through the skin, an injury that needs emergency surgery — seek emergency medical care at once.
`,
  ideas: [
    'A directional valve connects P, T, A and B in different patterns; it steers flow but does not set pressure or speed by itself.',
    'Spool valves are pressure-balanced and flexible but leak through their clearance; poppet valves seal but need force against the pressure.',
    'A valve path is an orifice: its pressure drop rises with the square of the flow, and every bar of drop times the flow is heat.',
    'Leakage through a spool clearance rises with the cube of the gap, so wear and hot oil make held loads drift.',
    'Standard mounting faces (ISO 4401) let valves of different makers bolt onto the same subplate.'
  ],
  pitfalls: [
    'A closed-centre spool valve locks a cylinder solid — The spool clearance leaks, so a loaded cylinder creeps; holding a load for minutes or hours needs a poppet valve.',
    'A bigger valve is always better — An oversized valve costs more, meters poorly and can shift harshly; size it for 3–10 bar per path at the working flow.',
    'The flow through a valve is set by the valve — The pump and the actuator set the flow; the valve only adds a pressure drop, which rises with the square of that flow.'
  ],
  formulas: [
    {
      name: 'Pressure drop of a valve path, scaled from its rating',
      expr: 'dp = dpn*(Q/Qn)^2', tex: '\\Delta p = \\Delta p_n \\left(\\dfrac{Q}{Q_n}\\right)^2',
      vars: {
        dp: { name: 'pressure drop at the working flow', q: 'pressure', unit: 'bar', tex: '\\Delta p' },
        dpn: { name: 'rated pressure drop (catalogue)', q: 'pressure', unit: 'bar', value: 5, tex: '\\Delta p_n' },
        Q: { name: 'working flow through the path', q: 'flowrate', unit: 'L/min', value: 60 },
        Qn: { name: 'flow at the rated drop', q: 'flowrate', unit: 'L/min', value: 40, tex: 'Q_n' }
      },
      note: 'Valid for turbulent, orifice-like flow, which is the normal state of a valve path. Each path (P→A, B→T…) has its own curve.',
      stories: { dp: 'A valve path drops {dpn} at {Qn}. What does it drop at {Q}?', Q: 'A valve path drops {dpn} at {Qn}. At what flow does it drop {dp}?' }
    },
    {
      name: 'Leakage across a spool land',
      expr: 'QL = pi*d*c^3*dp/(12*mu*L)', tex: 'Q_L = \\dfrac{\\pi d\\, c^3\\, \\Delta p}{12\\,\\mu\\, L}',
      vars: {
        QL: { name: 'leakage flow', q: 'flowrate', unit: 'cm³/min', tex: 'Q_L' },
        d: { name: 'spool diameter', q: 'length', unit: 'mm', value: 10 },
        c: { name: 'radial clearance', q: 'length', unit: 'µm', value: 8 },
        dp: { name: 'pressure difference across the land', q: 'pressure', unit: 'bar', value: 200, tex: '\\Delta p' },
        mu: { name: 'dynamic viscosity of the oil', q: 'viscosity', unit: 'mPa·s', value: 30, tex: '\\mu' },
        L: { name: 'sealing length of the land', q: 'length', unit: 'mm', value: 2.5 }
      },
      note: 'Laminar flow through a concentric annular gap. A fully eccentric spool leaks 2.5 times as much. ISO VG 46 oil at 50 °C has μ ≈ 25–30 mPa·s.',
      practice: { unknowns: ['QL', 'c'] },
      stories: { QL: 'A {d} spool with {c} of radial clearance seals {dp} over a land {L} long, in oil of {mu}. How much leaks?', c: 'A {d} spool must leak no more than {QL} at {dp} across a {L} land, in oil of {mu}. What clearance is allowed?' }
    },
    {
      name: 'Drift of a load held by a leaking valve',
      expr: 'v = QL/A', tex: 'v = \\dfrac{Q_L}{A}',
      vars: {
        v: { name: 'creep speed of the rod', q: 'speed', unit: 'mm/s' },
        QL: { name: 'leakage out of the loaded chamber', q: 'flowrate', unit: 'cm³/min', value: 21, tex: 'Q_L' },
        A: { name: 'area of the loaded chamber', q: 'area', unit: 'cm²', value: 31.2 }
      },
      note: 'Multiply by 60 for mm/min, by 3600 for mm per hour.',
      stories: { v: 'A valve leaks {QL} out of a cylinder chamber of {A}. How fast does the load creep?' }
    }
  ],
  examples: [
    {
      title: 'Pushing a valve past its rating',
      q: 'An NG10 valve drops 5 bar per path at 40 L/min. It feeds 60 L/min into the cap end of a 63/36 cylinder ($A_1 = 31.2$ cm², $A_2 = 21.0$ cm²) that is extending. What pressure is lost in the valve, and what power becomes heat?',
      steps: [
        'P→A carries 60 L/min: $\\Delta p = 5 \\times (60/40)^2 = 11.3$ bar.',
        'B→T carries the annulus flow $60 \\times 21.0/31.2 = 40.4$ L/min: $\\Delta p = 5 \\times (40.4/40)^2 = 5.1$ bar. Acting on the annulus, it costs another $5.1 \\times 21.0/31.2 = 3.4$ bar at the cap end.',
        'The pump must supply $11.3 + 3.4 = 14.7$ bar more than the load needs.',
        'Heat: $11.3\\times10^5 \\times 1.0\\times10^{-3} + 5.1\\times10^5 \\times 6.73\\times10^{-4} = 1130 + 340 \\approx 1.5$ kW.'
      ],
      a: 'About 15 bar of extra pump pressure and 1.5 kW of heat; the next size up (NG16) would cut both to a fraction.'
    },
    {
      title: 'Why a spool valve cannot hold a boom',
      q: 'A boom cylinder (63 mm bore, $A_1 = 31.2$ cm²) is held at 200 bar by a closed-centre spool valve. The spool (10 mm, 2.5 mm lands) has an 8 µm radial clearance and the oil is at 30 mPa·s. How far does the boom rod creep in an hour?',
      steps: [
        { text: 'Leakage across the land:', tex: 'Q_L = \\dfrac{\\pi \\times 0.01 \\times (8\\times10^{-6})^3 \\times 2\\times10^7}{12 \\times 0.03 \\times 0.0025} = 3.6\\times10^{-7}\\ \\mathrm{m^3/s}' },
        'That is 21 cm³/min.',
        'Creep speed: $v = Q_L/A = 3.6\\times10^{-7}/3.12\\times10^{-3} = 1.1\\times10^{-4}$ m/s, or 6.9 mm/min.',
        'In an hour: about 0.41 m — and more if the spool sits off-centre or the oil warms up.'
      ],
      a: 'About 40 cm an hour; a pilot-operated check or a counterbalance valve is needed to hold it.'
    }
  ],
  quiz: [
    { q: 'Why can a small solenoid shift a spool valve working at 315 bar?', choices: ['The solenoid is much stronger than it looks', 'The pressure in each groove acts all round the spool, so it cancels along the axis', 'The pressure is released before the valve shifts', 'Spool valves only work at low pressure'], a: 1,
      why: 'A spool is pressure-balanced: the pressure in a groove pushes radially and on opposing land faces, so there is no net axial force apart from the smaller flow forces.' },
    { q: 'Wear doubles a spool\'s radial clearance. Its leakage becomes…', choices: ['twice as large', 'four times as large', 'eight times as large', 'sixteen times as large'], a: 2,
      why: 'Laminar leakage through a slit goes with the cube of the gap: 2³ = 8.' },
    { q: 'A valve path drops 4 bar at 30 L/min. What does it drop at 45 L/min?', answer: 9, unit: 'bar', tol: 0.03,
      why: 'Δp ∝ Q²: 4 × (45/30)² = 4 × 2.25 = 9 bar.' },
    { q: 'A closed-centre spool valve can hold a raised load in place indefinitely.', a: false,
      why: 'The clearance leaks, so the load creeps down — millimetres a minute, depending on clearance, pressure and oil temperature. Load holding needs a seated (poppet) valve.' },
    { q: 'Where does the power lost as pressure drop across a valve go?', choices: ['Back into the pump', 'Into the load', 'Into heat in the oil', 'Nowhere: pressure drop is not a power loss'], a: 2,
      why: 'Throttling turns pressure energy into heat: Δp × Q watts, which the cooler must remove.' }
  ],
  problems: [
    { q: 'A P→A path drops 12 bar at 80 L/min. How much heat does it make?', answer: 1.6, unit: 'kW', tol: 0.02,
      steps: ['$Q = 80/60\\,000 = 1.333\\times10^{-3}$ m³/s.', '$P = \\Delta p\\,Q = 1.2\\times10^6 \\times 1.333\\times10^{-3} = 1600$ W = 1.6 kW.'] },
    { q: 'A 16 mm spool with 3 mm lands and a 6 µm radial clearance seals 250 bar in oil of 25 mPa·s. How much leaks across one land, in cm³/min?', answer: 18.1, unit: 'cm³/min', tol: 0.03,
      steps: ['$Q_L = \\pi \\times 0.016 \\times (6\\times10^{-6})^3 \\times 2.5\\times10^7 / (12 \\times 0.025 \\times 0.003)$.', '$= 2.71\\times10^{-10}/9\\times10^{-4} = 3.02\\times10^{-7}$ m³/s = 18.1 cm³/min.'] }
  ],
  applications: ['Every excavator, loader and crane: a bank of spool valves, one section per function, worked by joysticks.', 'Industrial presses and machine tools: NG6–NG32 valves on manifolds, switched by the machine controller.', 'Aircraft flight controls and landing gear, where servo and selector valves steer 210–350 bar systems.', 'Tractor remote valves that let an implement\'s cylinders be raised, lowered, held or floated.'],
  history: 'The sliding valve is older than hydraulics: William Murdoch\'s D-slide valve of 1799 switched steam between the two ends of an engine cylinder, just as a spool switches oil today. Balanced cylindrical spools, precision-ground to a few micrometres, arrived with twentieth-century machine tools and made compact high-pressure valves possible.',
  sim: ['valve-spool-cutaway', 'valve-43-explorer']
},

{
  id: 'spool-positions', parent: 'directional-valves-topic', title: 'Positions and ways', level: 1,
  short: 'How directional valves are named and drawn: the number of ports ("ways") and of switching positions, one box per position, arrows for paths — 2/2, 3/2, 4/2, 4/3 and more — and how to read which box is working.',
  keywords: ['ways', 'positions', '2/2', '3/2', '4/2', '4/3', '5/2', 'valve symbol', 'normally closed', 'normally open', 'working position', 'ISO 1219', 'boxes', 'envelope'],
  prereq: ['directional-valves', 'iso-1219', 'port-designations'],
  related: ['centre-conditions', 'valve-actuation', 'reading-circuit-diagrams', 'basic-circuit', 'pneumatics:way-valves'],
  body: `
A valve is named by two numbers: **ways / positions**. The *ways* are the working ports — P, T, A, B (pilot and drain ports are not counted). The *positions* are the distinct states the spool can be switched to. A **4/3 valve** has four ports and three positions; a **3/2 valve** three ports and two positions. The symbol makes both visible at a glance.

### Reading the symbol
- **One box per position.** Three boxes side by side: three positions.
- **Ports are drawn on one box only**, as short stubs outside it — the box that is working in the state the diagram shows. Count them for the ways.
- **Inside each box**, arrows show paths and their direction of flow; a T-shaped stop shows a blocked port; lines joined by a dot are connected inside the valve.
- **Actuators at the ends** — spring, solenoid, lever, pilot — push the boxes. Imagine the row of boxes sliding under fixed ports: operating the actuator on the left slides the *left* box into place.
- A spring on one end sets the **normal** (rest) position; springs on both ends centre the valve. Circuit diagrams show every valve **at rest**, unactuated.

The [ISO 1219 symbol chart](#/tools/iso) shows the common valves, and ISO 1219-1:2012 gives the rules.

### The common valves
| Valve | Ports | What it does | Typical use |
|---|---|---|---|
| 2/2 NC or NO | P, A | opens or closes one line | shut-off, unloading, venting a relief valve |
| 3/2 | P, A, T | pressurises A or vents it to T | single-acting cylinder, pilot signal, brake |
| 4/2 | P, T, A, B | P to A and B to T, or crossed | double-acting cylinder that is always driven one way or the other |
| 4/3 | P, T, A, B | as 4/2 plus a centre position | double-acting cylinder or motor that must also stop |
| 5/2, 5/3 | 1, 2, 4, 3, 5 | separate exhausts for each side | pneumatics (see [[pneumatics:way-valves]]) |
| 6/3 (open-centre section) | adds a through port | pump flow passes on to the next section when neutral | mobile valve banks |

A 2/2 or 3/2 valve is **normally closed** (NC) when P is blocked at rest and **normally open** (NO) when it passes.

### Between the positions
A switching valve spends a few milliseconds passing from one box to the next. What happens then depends on the land geometry: if all ports are briefly blocked (*closed crossover*), a fixed pump sees a pressure spike; if all are briefly joined (*open crossover*), a load can dip. Catalogues show these transitions as narrow dashed boxes between the main ones. A **proportional** valve, which can stop anywhere in between, is drawn with two parallel lines along the boxes (see [[proportional-valves]]).

### One valve, many jobs
The same 4/3 body is sold with a dozen spools, each giving different centre and crossover connections. The outer boxes of a 4/3 valve almost always read P→A, B→T and P→B, A→T; the centre is where they differ — see [[centre-conditions]].
`,
  ideas: [
    'Ways count the working ports (P, T, A, B); positions count the boxes.',
    'Ports are drawn on the working box; operating an actuator slides the box next to it into place.',
    'Circuits are drawn at rest: the spring position of every valve is the one shown at the ports.',
    'Most 4/3 valves share their outer boxes; the centre box and the crossover are what set them apart.'
  ],
  pitfalls: [
    'A 4/3 valve has four positions — It has four ports (ways) and three positions (boxes).',
    'The diagram shows the valve in the position it takes during the machine\'s main work — It shows the rest (unactuated) position; the operated positions are the other boxes.',
    'Pilot and drain connections count as ways — Only working ports count; X, Y and L are extra.'
  ],
  examples: [
    {
      title: 'Reading an unknown symbol',
      q: 'A symbol has two boxes. The right-hand box, next to a spring, has ports P and T below and A above; inside it A has an arrow to T and P is blocked. The left box has an arrow from P to A and T blocked; a solenoid sits on the left. Name the valve and say what it does.',
      steps: [
        'Three ports on the working box (P, T, A) and two boxes: a 3/2 valve.',
        'At rest (spring box at the ports) A is vented to T and P is blocked: normally closed.',
        'Energising the solenoid slides the left box in: P→A, T blocked.',
        'It suits a single-acting, spring-return cylinder: energised it extends, released it vents and the spring retracts it.'
      ],
      a: 'A 3/2 normally closed solenoid valve with spring return, for a single-acting cylinder.'
    },
    {
      title: 'Choosing a valve for a job',
      q: 'A clamp cylinder must extend, retract, and be held still in between with the pump unloaded. Which valve type is needed, and which boxes?',
      steps: [
        'Two directions of movement: at least four ways (P, T, A, B).',
        'A third, holding state: three positions — a 4/3 valve.',
        'Outer boxes P→A, B→T and P→B, A→T; the centre must block A and B (to hold) and join P to T (to unload): a tandem centre.'
      ],
      a: 'A 4/3 valve with a tandem centre, spring-centred so that it holds when released.'
    }
  ],
  quiz: [
    { q: 'A symbol has three boxes, and four ports are drawn on the middle box. The valve is a…', choices: ['3/4 valve', '4/3 valve', '3/3 valve', '4/4 valve'], a: 1,
      why: 'Ways (ports) first, then positions (boxes): four ports, three boxes — a 4/3 valve.' },
    { q: 'The solenoid on the right-hand end of a 4/3 valve is energised. Which box is now working?', choices: ['The left box', 'The centre box', 'The right box', 'Whichever box has P→A'], a: 2,
      why: 'Operating an actuator slides the box next to it under the fixed ports.' },
    { q: 'What is the simplest valve that can extend a single-acting spring-return cylinder and let it retract?', choices: ['2/2', '3/2', '4/2', '4/3'], a: 1,
      why: 'The cylinder\'s one port must be connected either to pressure or to tank: three ports, two positions.' },
    { q: 'Pilot and drain ports are counted among a valve\'s ways.', a: false,
      why: 'Only the working ports count; pilot (X, Y) and drain (L) connections are extra.' },
    { q: 'A 4/2 valve drives a double-acting cylinder. What can it not do that a 4/3 valve can?', choices: ['Reverse the cylinder', 'Stop the cylinder in mid-stroke', 'Retract the cylinder', 'Extend it with full force'], a: 1,
      why: 'A 4/2 valve always connects P to one side and T to the other, so the cylinder is always driven; the third, centre position of a 4/3 valve is what stops it.' }
  ],
  applications: ['Reading circuit diagrams from machine manuals, where every valve is identified by its symbol alone.', 'Specifying replacement valves: the ways/positions, centre and actuation must match.', 'Mobile valve banks, where each section is a 6/3 or 4/3 valve with its own spool code.'],
  sim: ['valve-spool-cutaway', 'valve-43-explorer']
},

{
  id: 'centre-conditions', parent: 'directional-valves-topic', title: 'Centre conditions', level: 2,
  short: 'What a 4/3 valve connects in its middle position — closed, tandem, float, open or regenerative — and what that does to the pump (loaded or unloaded) and to the actuator (locked, free or moving).',
  keywords: ['centre condition', 'closed centre', 'tandem centre', 'float centre', 'open centre', 'regenerative centre', 'Y centre', 'motor spool', 'unloading', 'crossover', 'spool type'],
  prereq: ['spool-positions', 'relief-valve', 'hydraulic-cylinder'],
  related: ['open-closed-centre', 'regenerative-circuit', 'pilot-check', 'counterbalance-valve', 'energy-losses-heat', 'pressure-compensated-pump', 'hydraulic-motors', 'load-sensing'],
  body: `
The outer boxes of almost every 4/3 valve are the same: P→A with B→T, and P→B with A→T. The **centre** box is the designer's choice, and it answers two questions at once: *what does the pump do while the actuator waits*, and *what does the actuator do*? Each answer has a cost.

| Centre | Connections | Pump (fixed displacement) | Actuator | Typical use |
|---|---|---|---|---|
| **Closed** | all blocked | dead-headed: all flow over the relief valve | locked (creeps by leakage) | several valves fed in parallel; pressure-compensated pumps and accumulators |
| **Tandem** | P→T, A and B blocked | unloads at a few bar | locked (creeps) | single-valve machines; mobile valves in series |
| **Float** | P blocked, A and B→T | as closed | free to move | motors that must coast; blades that follow the ground; with pilot checks and counterbalance valves |
| **Open** | all joined | unloads | free to move | simple open-centre circuits, motors |
| **Regenerative** | P, A, B joined, T blocked | drives the rod out | extends at rod-area force | fast approach strokes |

### What the pump does
With a **fixed-displacement** pump the flow must go somewhere. In a closed or float centre it can only cross the relief valve, and the whole pump power becomes heat:

$$P = p\\,Q$$

22 L/min at 160 bar is 5.9 kW — a small electric heater running all day. A tandem or open centre lets the flow return to tank through the valve at 3–8 bar, a fortieth of that. So why use a closed centre at all? Because with a **pressure-compensated** pump (see [[pressure-compensated-pump]]) or an accumulator there is no surplus flow to dump, and because only a closed-centre valve can share a supply line with other valves: a tandem centre in one valve would unload the pump for all of them. Mobile valve banks turn this into a design: the neutral passage runs through every section in series (the open-centre system of [[open-closed-centre]]).

A solenoid-piloted valve with a tandem centre has a catch: in neutral the pressure at P falls to a few bar, too low to pilot the main spool. A back-pressure check valve (typically 4–5 bar) in the P line or an external pilot supply fixes it.

### What the actuator does
**Closed and tandem** centres trap oil in both chambers and lock the actuator hydraulically — but only as well as the spool seals, so a loaded cylinder creeps (see [[directional-valves]]). **Float and open** centres connect both chambers to tank: the actuator can be moved by outside forces — useful for a hydraulic motor that must coast to a stop instead of slamming into a locked circuit, or for a dozer blade that should ride the ground, and essential when a [[pilot-check]] or [[counterbalance-valve]] holds the load, because their pilot lines must be vented for them to close. Under a raised load with nothing else holding it, a float centre lets the load fall.

### The regenerative centre
Joining P, A and B with T blocked makes the rod-end oil flow round to the cap end. Both sides see the same pressure, so the net area is only the rod's:

$$v = \\frac{4\\,Q}{\\pi d^2}, \\qquad F = p\\,\\frac{\\pi d^2}{4}$$

With a 63/36 cylinder and 22 L/min, the rod goes out at 0.36 m/s instead of 0.12 m/s — three times faster — but pushes only 16 kN at 160 bar instead of 50 kN. It is a quick approach stroke; the working stroke switches to the P→A box (see [[regenerative-circuit]]).

### Crossover
While the spool moves between boxes it passes through intermediate connections. A spool with an *open* crossover briefly joins everything, which softens switching shocks but lets a load dip; a *closed* crossover briefly blocks everything, which holds the load but can spike the pressure. Catalogues code each spool with a letter and draw its crossover; replacing a spool with the wrong letter changes the machine's behaviour.
`,
  ideas: [
    'The centre condition decides both what the pump does while waiting (dumps over the relief or unloads) and what the actuator does (locked or free).',
    'With a fixed pump, a closed or float centre turns the whole pump power into heat; a tandem or open centre unloads it at a few bar.',
    'Closed centres suit pressure-compensated pumps, accumulators and valves fed in parallel.',
    'Float centres let actuators coast and let pilot checks and counterbalance valves close; they drop an unsupported load.',
    'A regenerative centre extends a rod fast with only the rod area pushing.'
  ],
  pitfalls: [
    'A tandem centre is always the efficient choice — It unloads the pump for every valve on the same supply line, and it starves solenoid-piloted valves of pilot pressure unless a back-pressure check is fitted.',
    'Any centre that blocks A and B holds a load for good — A spool leaks, so a loaded cylinder creeps whatever the centre; long-term holding needs seated valves.',
    'A float centre is safe because the valve is "off" — Both actuator ports are open to tank, so an outside force — gravity on a raised load — moves the actuator freely.'
  ],
  formulas: [
    {
      name: 'Power lost while the valve is centred',
      expr: 'P = p*Q', tex: 'P = p\\,Q',
      vars: {
        P: { name: 'power turned into heat', q: 'power', unit: 'kW' },
        p: { name: 'pump pressure in the centre position (gauge)', q: 'pressure', unit: 'bar', value: 160 },
        Q: { name: 'pump flow', q: 'flowrate', unit: 'L/min', value: 22 }
      },
      note: 'Closed or float centre with a fixed pump: p is the relief setting. Tandem or open centre: p is the few bar of the unloading path.',
      stories: { P: 'A fixed pump delivers {Q} and waits at {p}. How much heat does it make?', p: 'A pump delivering {Q} must waste no more than {P} while the machine waits. At what pressure must it unload?' }
    },
    {
      name: 'Regenerative extension speed',
      expr: 'v = 4*Q/(pi*d^2)', tex: 'v = \\dfrac{4\\,Q}{\\pi d^2}',
      vars: {
        v: { name: 'rod speed', q: 'speed', unit: 'm/s' },
        Q: { name: 'pump flow', q: 'flowrate', unit: 'L/min', value: 22 },
        d: { name: 'rod diameter', q: 'length', unit: 'mm', value: 36 }
      },
      note: 'The pump fills only the volume swept by the rod; valve losses at the doubled internal flow make the real speed somewhat lower.',
      stories: { v: 'A cylinder with a {d} rod extends regeneratively on {Q}. How fast does it move?', d: 'A regenerative extension must reach {v} with {Q}. What rod diameter is needed?' }
    },
    {
      name: 'Regenerative extension force',
      expr: 'F = p*pi*d^2/4', tex: 'F = p\\,\\dfrac{\\pi d^2}{4}',
      vars: {
        F: { name: 'force pushing the rod out', q: 'force', unit: 'kN' },
        p: { name: 'pressure in both chambers (gauge)', q: 'pressure', unit: 'bar', value: 160 },
        d: { name: 'rod diameter', q: 'length', unit: 'mm', value: 36 }
      },
      stories: { F: 'A cylinder with a {d} rod extends regeneratively at {p}. What force does it push with?' }
    }
  ],
  examples: [
    {
      title: 'The cost of waiting',
      q: 'A machine with a 22 L/min fixed pump and a 160 bar relief valve spends half of an 8-hour shift waiting with its 4/3 valve centred. Compare the heat made while waiting with a closed centre and with a tandem centre that unloads at 5 bar.',
      steps: [
        '$Q = 22/60\\,000 = 3.67\\times10^{-4}$ m³/s.',
        'Closed: $P = 1.6\\times10^7 \\times 3.67\\times10^{-4} = 5.9$ kW; over 4 h, 23 kWh of heat.',
        'Tandem: $P = 5\\times10^5 \\times 3.67\\times10^{-4} = 0.18$ kW; over 4 h, 0.7 kWh.',
        'The closed centre needs a cooler for 6 kW that the tandem centre does not.'
      ],
      a: 'About 23 kWh against 0.7 kWh — the tandem centre wastes 32 times less.'
    },
    {
      title: 'Fast approach',
      q: 'A 63/36 cylinder on a 22 L/min pump with a 160 bar relief uses a regenerative centre for its approach. Find its approach speed and the most it can push, and compare with a normal extension.',
      steps: [
        'Rod area $\\pi \\times 0.036^2/4 = 1.02\\times10^{-3}$ m²; piston area $3.12\\times10^{-3}$ m².',
        'Regenerative: $v = 3.67\\times10^{-4}/1.02\\times10^{-3} = 0.36$ m/s; $F = 1.6\\times10^7 \\times 1.02\\times10^{-3} = 16.3$ kN.',
        'Normal: $v = 3.67\\times10^{-4}/3.12\\times10^{-3} = 0.12$ m/s; $F = 1.6\\times10^7 \\times 3.12\\times10^{-3} = 49.9$ kN.'
      ],
      a: '0.36 m/s and 16 kN regenerative, against 0.12 m/s and 50 kN normal — three times the speed for a third of the force.'
    }
  ],
  quiz: [
    { q: 'A fixed pump feeds one 4/3 valve. Which centre lets the pump unload while the cylinder is held?', choices: ['Closed', 'Tandem', 'Float', 'Regenerative'], a: 1,
      why: 'The tandem centre joins P to T (unloading the pump) and blocks A and B (holding the cylinder).' },
    { q: 'A hydraulic winch motor must be allowed to coast to a stop when the valve is released, instead of stopping dead. Which centre suits it?', choices: ['Closed', 'Tandem', 'Float', 'Regenerative'], a: 2,
      why: 'Float (A and B to T) lets the motor keep turning, drawing and returning oil through the tank ports; a blocked centre would stop it hard and spike the pressure.' },
    { q: 'Three 4/3 valves are fed in parallel from one pressure-compensated pump. Which centre should they have?', choices: ['Tandem', 'Open', 'Closed', 'Any'], a: 2,
      why: 'A tandem or open centre in any one valve would short the common supply to tank. With a pressure-compensated pump a closed centre wastes little.' },
    { q: 'A cylinder has a 40 mm rod. On 30 L/min in a regenerative centre, how fast does it extend (in m/s)?', answer: 0.398, unit: 'm/s', tol: 0.02,
      why: 'Rod area = π × 0.04²/4 = 1.257×10⁻³ m²; v = 5×10⁻⁴/1.257×10⁻³ = 0.40 m/s.' },
    { q: 'A pilot-operated check valve holds a boom. With a closed-centre valve, the check may not close properly because…', choices: ['the closed centre leaks into it', 'its pilot line stays pressurised, trapped by the centre', 'closed centres cannot be used with cylinders', 'the pump keeps running'], a: 1,
      why: 'The pilot is taken from the other cylinder line; a blocked centre can trap pressure there and keep the check open. A float centre vents it.' }
  ],
  problems: [
    { q: 'A 45 L/min fixed pump waits against a 210 bar relief valve with a closed-centre valve. What power becomes heat?', answer: 15.75, unit: 'kW', tol: 0.02,
      steps: ['$Q = 45/60\\,000 = 7.5\\times10^{-4}$ m³/s.', '$P = 2.1\\times10^7 \\times 7.5\\times10^{-4} = 15\\,750$ W = 15.75 kW.'] }
  ],
  applications: ['Mobile valve banks with open-centre sections in series, unloading the pump when every lever is in neutral.', 'Industrial closed-centre systems with pressure-compensated pumps, where many valves share one supply.', 'Float positions on loader and dozer blades and on tractor hitches, so the tool follows the ground.', 'Motor spools (float centres) on winches and slewing drives, with separate brake valves.'],
  sim: 'valve-43-explorer'
},

{
  id: 'valve-actuation', parent: 'directional-valves-topic', title: 'How valves are operated', level: 2,
  short: 'What moves the spool: hands, cams and rollers, AC or DC solenoids, hydraulic or pneumatic pilot pressure, or a small solenoid valve piloting a big one — and the springs and detents that decide where it goes when released.',
  keywords: ['solenoid', 'DC solenoid', 'AC solenoid', 'wet-pin solenoid', 'inrush current', 'manual override', 'pilot operated', 'solenoid-piloted', 'two-stage valve', 'detent', 'spring centred', 'spring offset', 'roller', 'lever', 'flow force', 'switching time'],
  prereq: ['directional-valves', 'spool-positions', 'physics:pressure'],
  related: ['proportional-valves', 'servo-valves', 'electrohydraulic-control', 'electronics:relays', 'electronics:flyback-diode', 'electronics:inductors', 'pneumatics:valve-operation', 'pneumatics:solenoid-valves'],
  body: `
Something must push the spool, and something must decide where it goes when that push stops. The symbols at the ends of the valve's boxes say both.

### Hands and machines
- **Manual**: a lever, pushbutton or pedal. Levers on mobile valves meter as well as switch. Many hand valves are **spring-returned**, so letting go stops the machine.
- **Mechanical**: a roller, cam or plunger worked by the machine itself — a table that reverses when a dog on it strikes a roller valve at the end of its travel.

### Solenoids
A solenoid is an electromagnet whose armature pushes the spool through a pin. Industrial valves use **wet-pin** solenoids: the armature runs in oil inside a pressure-tight tube, so there is no sliding seal to leak. An NG6 solenoid pushes with a few tens of newtons and draws 20–40 W.

| | AC solenoid | DC solenoid |
|---|---|---|
| Switching on | fast, typically 10–25 ms | slower, typically 30–60 ms |
| Current | large inrush until the armature closes, then 4–6 times lower | steady, set by the coil resistance |
| If the spool sticks | stays at inrush current and burns out | no harm |
| Switching shock | harder | softer |
| Common supply | 110 or 230 V AC | 24 V DC (also rectified AC) |

The AC coil's weakness is the one that matters in a dirty system: a spool jammed by silt keeps the armature open, the current stays at its inrush value, and the coil overheats within minutes. That, and the 24 V control systems of modern machines, is why DC coils dominate. A DC coil stores magnetic energy; switching it off makes a voltage spike, which a suppression diode or varistor absorbs (see [[electronics:flyback-diode]]).

Most solenoid valves have a **manual override** — a pin to push the spool by hand when setting up or in an emergency. It moves the machine exactly as the solenoid would.

### Pilot pressure, and why big valves need it
Two things resist the spool: its springs and the **flow forces**. Oil leaving a metering edge as a jet at about 69° to the axis carries momentum, and the reaction pulls the spool towards closing:

$$F = 2\\,C_d\\,A\\,\\Delta p\\cos\\theta$$

At 20 bar across a 30 mm² opening that is about 30 N per edge — as much as a small solenoid can give, and it grows with the valve's size and flow. Above NG10, therefore, valves are **pilot-operated**: pilot oil at 5 bar or more acts on the whole end of the main spool,

$$F = p\\,\\frac{\\pi d^2}{4}$$

so 10 bar on a 32 mm spool pushes with 800 N. The pilot oil is switched by a small NG6 solenoid valve mounted on top: a **solenoid-piloted two-stage valve**. Pilot oil can be taken from P inside the valve (internal pilot) or from a separate supply at port X (external pilot), and returned to T (internal drain) or through port Y (external drain, needed when T sees pressure peaks). Small orifices in the pilot lines slow the main spool to soften switching shocks. Pilot pressure can also come straight from a hydraulic or pneumatic joystick.

### Springs and detents
- **Spring-centred** (4/3): released, it returns to the centre — the actuator stops.
- **Spring offset**: two positions, a spring returns it to one.
- **Detent**: a spring-loaded ball holds the spool in whatever position it was last put; a two-solenoid valve with a detent needs only a pulse and *remembers* its position when power fails.

What each valve does when power fails, or returns, is a safety decision: ISO 4413:2010 asks for it to be considered for every function. A spring-centred valve stops the machine; a detented valve keeps a clamp clamped but also keeps a press moving.

> [!warn] A manual override moves the machine as surely as the solenoid. Before pushing one — or working on a valve — make sure no one is in reach of the actuators, loads are supported, and stored pressure has been released. Pilot-operated valves can also shift when pilot pressure returns.
`,
  ideas: [
    'Solenoids, levers, rollers and pilot pressure all do one job: push the spool against its springs and flow forces.',
    'AC solenoids switch faster but burn out if the spool sticks; DC solenoids are slower, gentler and tolerant.',
    'Flow forces grow with a valve\'s size and flow, so large valves are shifted by pilot oil switched by a small solenoid valve.',
    'Springs and detents decide the position when the actuator releases — a safety choice as much as a functional one.'
  ],
  pitfalls: [
    'DC solenoids switch faster than AC ones — AC solenoids are typically faster; DC ones are chosen for robustness and gentler switching.',
    'A pilot-operated valve works at any pump pressure — It needs a minimum pilot pressure (often 5 bar or more); a tandem centre can drop P below it unless a back-pressure check or external pilot is fitted.',
    'A detented valve returns to neutral when the power fails — It stays where it was; that is its purpose, and it must be allowed for.'
  ],
  formulas: [
    {
      name: 'Pilot force on the end of a spool',
      expr: 'F = p*pi*d^2/4', tex: 'F = p\\,\\dfrac{\\pi d^2}{4}',
      vars: {
        F: { name: 'force on the spool', q: 'force', unit: 'N' },
        p: { name: 'pilot pressure (gauge)', q: 'pressure', unit: 'bar', value: 10 },
        d: { name: 'spool diameter', q: 'length', unit: 'mm', value: 25 }
      },
      stories: { F: 'Pilot oil at {p} acts on the end of a {d} spool. What force does it give?', p: 'A {d} main spool needs {F} to shift. What pilot pressure is needed?' }
    },
    {
      name: 'Steady flow force on a metering edge',
      expr: 'F = 2*Cd*A*dp*cos(theta)', tex: 'F = 2\\,C_d\\,A\\,\\Delta p\\cos\\theta',
      vars: {
        F: { name: 'axial flow force (towards closing)', q: 'force', unit: 'N' },
        Cd: { name: 'discharge coefficient', value: 0.7, tex: 'C_d' },
        A: { name: 'opening area of the edge', q: 'area', unit: 'mm²', value: 30 },
        dp: { name: 'pressure drop across the edge', q: 'pressure', unit: 'bar', value: 20, tex: '\\Delta p' },
        theta: { name: 'jet angle to the spool axis', q: 'angle', unit: '°', value: 69, min: 0, max: 90, tex: '\\theta' }
      },
      note: 'The jet leaves a sharp-edged spool port at about 69° to the axis. Two metering edges in a path give roughly twice the force.',
      practice: { unknowns: ['F', 'A'] },
      stories: { F: 'Oil crosses a metering edge opened to {A} with a drop of {dp}. What is the flow force (Cd = {Cd}, jet at {theta})?' }
    }
  ],
  examples: [
    {
      title: 'Why a big valve needs a pilot',
      q: 'An NG25 spool meters 300 L/min with 10 bar across each of its two edges. Estimate the flow force, and compare it with a solenoid\'s 80 N and with 10 bar of pilot pressure on the 32 mm spool end. (Take $C_d = 0.7$, ρ = 870 kg/m³, jet at 69°.)',
      steps: [
        { text: 'Opening area for one edge from the orifice law:', tex: 'A = \\dfrac{Q}{C_d\\sqrt{2\\Delta p/\\rho}} = \\dfrac{5\\times10^{-3}}{0.7\\sqrt{2\\times10^6/870}} = 1.49\\times10^{-4}\\ \\mathrm{m^2}' },
        'Flow force per edge: $F = 2 \\times 0.7 \\times 1.49\\times10^{-4} \\times 10^6 \\times \\cos 69° = 75$ N; two edges, about 150 N.',
        'Add centring springs of a few hundred newtons, and a solenoid of 80 N is hopeless.',
        'Pilot: $F = 10^6 \\times \\pi \\times 0.032^2/4 = 804$ N.'
      ],
      a: 'About 150 N of flow force plus spring force — far beyond a solenoid, easily within 800 N of pilot force.'
    },
    {
      title: 'Choosing the coil',
      q: 'A valve on a sawmill conveyor is switched by a 230 V AC solenoid. Wood dust in the oil occasionally makes the spool stick, and coils have been burning out. What is happening, and what would help?',
      steps: [
        'An AC coil draws a large inrush current until its armature closes; its impedance rises only when the magnetic circuit is closed.',
        'A stuck spool holds the armature open, so the coil stays at inrush current and overheats.',
        'A DC (or rectified-AC) coil draws a current set by its resistance whatever the armature does, so a stuck spool does not burn it.',
        'The root cause is contamination: better filtration and a reservoir breather that keeps dust out.'
      ],
      a: 'Stuck spools hold AC coils at inrush current; switch to DC coils — and clean up the oil.'
    }
  ],
  quiz: [
    { q: 'A spool sticks halfway. Which kind of solenoid is likely to burn out?', choices: ['DC', 'AC', 'Both equally', 'Neither'], a: 1,
      why: 'An AC coil\'s current falls only when the armature closes; held open, it stays at the inrush current and overheats. A DC coil\'s current is set by its resistance.' },
    { q: 'Power fails while a two-solenoid 4/2 valve with a detent is shifted. The valve…', choices: ['returns to its spring position', 'stays where it is', 'moves to the centre', 'moves to the opposite position'], a: 1,
      why: 'A detent holds the spool in its last position without power — the valve "remembers".' },
    { q: 'What pilot pressure puts 600 N on the end of a 25 mm spool?', answer: 12.2, unit: 'bar', tol: 0.03,
      why: 'Area = π × 0.025²/4 = 4.91×10⁻⁴ m²; p = 600/4.91×10⁻⁴ = 1.22×10⁶ Pa = 12.2 bar.' },
    { q: 'Flow forces on a spool tend to…', choices: ['open the metering edge further', 'close the metering edge', 'push the spool sideways only', 'cancel out exactly'], a: 1,
      why: 'The jet leaving the edge carries axial momentum; its reaction pulls the spool towards closing the opening.' },
    { q: 'A solenoid-piloted valve with a tandem centre will not shift from neutral. The most likely cause is…', choices: ['the coil is too strong', 'no pilot pressure: P is unloaded to T in neutral', 'the valve is too small', 'the oil is too cold'], a: 1,
      why: 'In neutral the tandem centre drops P to a few bar, below the pilot stage\'s minimum. A back-pressure check in P or an external pilot supply cures it.' }
  ],
  applications: ['24 V DC solenoid valves switched by PLCs in presses, injection-moulding machines and machine tools.', 'Hydraulic pilot joysticks in excavators, whose low-pressure pilot oil shifts the main valve spools.', 'Roller-operated valves that reverse a grinding-machine table at the ends of its travel.', 'Hand levers with detents on tractor remote valves, holding a function on without the driver\'s hand.'],
  sim: 'valve-spool-cutaway'
},

{
  id: 'check-valves', parent: 'directional-valves-topic', title: 'Check valves', level: 1,
  short: 'A one-way valve: a ball or poppet on a seat, held by a light spring, that lets oil through in one direction once the cracking pressure is reached and seals it the other way without leaking.',
  keywords: ['check valve', 'non-return valve', 'one-way valve', 'cracking pressure', 'poppet', 'ball check', 'bypass', 'anti-cavitation', 'make-up valve', 'back-pressure', 'Graetz', 'seat'],
  prereq: ['directional-valves', 'physics:pressure', 'orifice-equation'],
  related: ['pilot-check', 'counterbalance-valve', 'flow-control', 'filtration', 'braking-circuits', 'accumulator-circuits', 'water-hammer', 'pneumatics:check-valves-pneu'],
  body: `
The check valve is the simplest valve in hydraulics and one of the most used: a hydraulic diode. A hardened ball or a cone-shaped **poppet** sits on a sharp-edged **seat**, pressed there by a light spring. Pressure from the inlet side pushes it off the seat and oil flows; pressure from the other side only presses it harder onto the seat, and because metal seals on metal along a line there is practically no leakage — unlike a spool.

### Cracking pressure
The poppet lifts when the pressure difference across the seat, acting on the seat area, beats the spring:

$$p_c = \\frac{4F}{\\pi d^2}$$

That **cracking pressure** is chosen for the job:

| Use | Typical cracking pressure |
|---|---|
| In-line check, pump outlet | 0.3–1 bar |
| Bypass around a filter or cooler | 2–5 bar |
| Back-pressure in a return line | 3–5 bar |
| Pilot-pressure check ahead of a tandem-centre valve | 4–5 bar |

Once open, the gap between poppet and seat is a ring-shaped orifice — the "curtain" of area $\\pi d x$ — and the flow through it follows the orifice law:

$$Q = C_d\\,\\pi d\\,x\\sqrt{\\frac{2\\,\\Delta p}{\\rho}}$$

The lift grows with the flow, compressing the spring, so the pressure drop rises above the cracking value as flow increases. Lifting beyond a quarter of the seat diameter gains nothing: at $x = d/4$ the curtain area equals the seat area. An oversized check that only just opens at the working flow tends to chatter.

### Where they go
- **Pump outlet**: stops oil running back through the pump when it stops (which could turn it backwards) and keeps other pumps or an accumulator from driving it.
- **Bypasses**: a check in parallel with a filter or cooler opens if the element clogs or the cold oil is too thick — protecting the element, at the price of passing unfiltered or uncooled oil (see [[filtration]]).
- **Free reverse flow**: in parallel with a throttle, a sequence valve or a counterbalance valve, so oil can return freely the other way (see [[flow-control]]).
- **Anti-cavitation (make-up)**: from the tank line into a motor or cylinder line that is being pulled below atmospheric pressure — essential in [[braking-circuits]].
- **Rectifier bridge**: four checks (a Graetz circuit) let one flow control meter in both directions.
- **Holding**: the seat is leak-free, which is the whole point of the [[pilot-check]] and [[counterbalance-valve]].

In the ISO symbol a small circle (the ball) sits in a V (the seat); free flow is the direction that lifts the ball away from the V. A spring drawn on the ball means a cracking pressure above a few tenths of a bar.

> [!warn] A check valve traps pressure. A gauge at the pump can read zero while the line beyond a check still holds full pressure — and an accumulator or raised load behind it keeps it there. Release the pressure on both sides before opening any fitting; oil from a pinhole at high pressure can be injected through the skin, a surgical emergency.
`,
  ideas: [
    'A check valve passes flow one way once the cracking pressure is reached and seals the other way without leaking.',
    'Cracking pressure = spring force divided by seat area; it is chosen from a fraction of a bar to several bar depending on the job.',
    'The open valve is an annular orifice whose area is π d x, so the pressure drop rises with flow.',
    'Check valves appear everywhere: pump outlets, bypasses, free reverse flow, make-up lines and load holding.'
  ],
  pitfalls: [
    'A check valve has no pressure drop in its free direction — It needs its cracking pressure to open, and more as the flow rises.',
    'A bypass check around a filter is harmless — When it opens, unfiltered oil flows to the system; it is a last resort that must be signalled by a clogging indicator.',
    'With the pump stopped the circuit is safe — Oil trapped behind a check valve keeps its pressure until it is deliberately released.'
  ],
  formulas: [
    {
      name: 'Cracking pressure of a check valve',
      expr: 'pc = 4*F/(pi*d^2)', tex: 'p_c = \\dfrac{4F}{\\pi d^2}',
      vars: {
        pc: { name: 'cracking pressure (difference across the seat)', q: 'pressure', unit: 'bar', tex: 'p_c' },
        F: { name: 'spring force on the closed poppet', q: 'force', unit: 'N', value: 17 },
        d: { name: 'seat diameter', q: 'length', unit: 'mm', value: 12 }
      },
      stories: { pc: 'A check valve\'s spring presses its poppet onto a {d} seat with {F}. What is its cracking pressure?', F: 'A check valve with a {d} seat must crack at {pc}. What spring force is needed?' }
    },
    {
      name: 'Flow through a lifted poppet',
      expr: 'Q = Cd*pi*d*x*sqrt(2*dp/rho)', tex: 'Q = C_d\\,\\pi d\\,x\\sqrt{\\dfrac{2\\,\\Delta p}{\\rho}}',
      vars: {
        Q: { name: 'flow through the valve', q: 'flowrate', unit: 'L/min' },
        Cd: { name: 'discharge coefficient', value: 0.65, tex: 'C_d' },
        d: { name: 'seat diameter', q: 'length', unit: 'mm', value: 12 },
        x: { name: 'poppet lift', q: 'length', unit: 'mm', value: 1 },
        dp: { name: 'pressure drop across the seat', q: 'pressure', unit: 'bar', value: 3, tex: '\\Delta p' },
        rho: { name: 'oil density', q: 'density', unit: 'kg/m³', value: 870, tex: '\\rho' }
      },
      note: 'A flat poppet: the flow area is the curtain π d x. Valid up to x ≈ d/4, where the curtain equals the seat area.',
      practice: { unknowns: ['Q', 'x'] },
      stories: { Q: 'A poppet on a {d} seat lifts {x} with {dp} across it. What flows (Cd = {Cd}, oil {rho})?', x: 'A check valve with a {d} seat passes {Q} with {dp} across it. How far has the poppet lifted (Cd = {Cd}, oil {rho})?' }
    }
  ],
  examples: [
    {
      title: 'A filter bypass',
      q: 'A return filter has a bypass check valve with a 20 mm seat that must crack at 3.5 bar. What spring force is needed, and what happens when the element clogs?',
      steps: [
        'Seat area: $\\pi \\times 0.02^2/4 = 3.14\\times10^{-4}$ m².',
        'Spring force: $F = p_c A = 3.5\\times10^5 \\times 3.14\\times10^{-4} = 110$ N.',
        'As dirt builds up the pressure drop across the element rises; at 3.5 bar the check opens and oil bypasses the element — unfiltered.',
        'A clogging indicator (typically set a little below the bypass pressure) warns the operator to change the element first.'
      ],
      a: 'About 110 N; a clogged element sends unfiltered oil round it, so the indicator must be watched.'
    },
    {
      title: 'How far does it lift?',
      q: 'A check valve with a 16 mm seat passes 60 L/min with 2 bar across the seat beyond its cracking pressure. Taking $C_d = 0.65$ and ρ = 870 kg/m³, how far is the poppet lifted?',
      steps: [
        '$Q = 1.0\\times10^{-3}$ m³/s; $\\sqrt{2\\Delta p/\\rho} = \\sqrt{4\\times10^5/870} = 21.4$ m/s.',
        '$x = Q/(C_d\\,\\pi d\\sqrt{2\\Delta p/\\rho}) = 10^{-3}/(0.65 \\times \\pi \\times 0.016 \\times 21.4) = 1.43\\times10^{-3}$ m.',
        'That is 1.4 mm, well below the useful limit $d/4 = 4$ mm.'
      ],
      a: 'About 1.4 mm.'
    }
  ],
  quiz: [
    { q: 'Why is a check valve fitted at a pump outlet?', choices: ['To raise the pump pressure', 'To stop oil flowing back through the pump when it stops, and to stop other sources driving it', 'To filter the oil', 'To limit the flow'], a: 1,
      why: 'Without it, pressurised oil from the circuit, an accumulator or another pump can flow back and turn the stopped pump backwards.' },
    { q: 'A check valve has a 10 mm seat and a spring force of 12 N on the closed poppet. What is its cracking pressure?', answer: 1.53, unit: 'bar', tol: 0.03,
      why: 'A = π × 0.01²/4 = 7.85×10⁻⁵ m²; p = 12/7.85×10⁻⁵ = 1.53×10⁵ Pa = 1.53 bar.' },
    { q: 'The gauge at the pump outlet reads zero, so every line in the circuit is at zero pressure.', a: false,
      why: 'Check valves (and closed valves) can trap full pressure downstream, especially with an accumulator or a raised load behind them.' },
    { q: 'The element of a filter with a 3.5 bar bypass check becomes clogged. What reaches the system?', choices: ['Nothing: the flow stops', 'Unfiltered oil through the bypass', 'Filtered oil at a lower flow', 'Oil at 3.5 bar lower pressure only'], a: 1,
      why: 'Once the pressure drop reaches 3.5 bar the bypass opens and oil flows round the element, unfiltered.' },
    { q: 'Lifting a poppet further than a quarter of its seat diameter…', choices: ['doubles the flow', 'gains almost no more flow area', 'closes the valve', 'reduces the cracking pressure'], a: 1,
      why: 'At x = d/4 the curtain area π d x equals the seat area π d²/4; beyond that the seat bore itself is the restriction.' }
  ],
  problems: [
    { q: 'A back-pressure check valve with a 14 mm seat must crack at 4.5 bar. What spring force does it need?', answer: 69.3, unit: 'N', tol: 0.02,
      steps: ['$A = \\pi \\times 0.014^2/4 = 1.539\\times10^{-4}$ m².', '$F = 4.5\\times10^5 \\times 1.539\\times10^{-4} = 69.3$ N.'] }
  ],
  applications: ['Pump outlets, where a check protects the pump and lets pumps run in parallel.', 'Bypasses around return filters and oil coolers.', 'Anti-cavitation valves that feed a hydraulic motor from the tank line when its load drives it.', 'Hand pumps and hydraulic jacks: two checks turn the plunger\'s strokes into a one-way flow.'],
  history: 'Nikola Tesla patented a check valve with no moving parts at all in 1920 — a channel of looping bays that lets fluid pass easily one way and throws it back on itself the other. Hydraulic circuits still rely on the humble spring-loaded ball, but Tesla\'s "valvular conduit" lives on in microfluidics.'
},

{
  id: 'pilot-check', parent: 'directional-valves-topic', title: 'Pilot-operated check valves', level: 2,
  short: 'A check valve that pilot pressure can force open: it holds a load without leaking and releases it when the other cylinder line is pressurised. It needs a vented pilot to close, it chatters on overrunning loads, and trapped oil can build pressure when it warms.',
  keywords: ['pilot-operated check valve', 'POCV', 'pilot check', 'pilot ratio', 'load holding', 'hydraulic lock', 'double pilot check', 'decompression', 'thermal expansion', 'chatter', 'external drain'],
  prereq: ['check-valves', 'centre-conditions', 'hydraulic-cylinder'],
  related: ['counterbalance-valve', 'load-holding', 'bulk-modulus', 'physics:thermal-expansion', 'lifts-cranes', 'mobile-hydraulics', 'hydraulic-safety'],
  body: `
A spool valve cannot hold a load — it leaks. A plain check valve can hold one perfectly, but then nothing can let it down again. The **pilot-operated check valve** (POCV) does both. It is a check valve with a small piston behind the poppet: oil flows freely into the cylinder as through any check, is trapped there leak-free, and is released when pressure is applied to the **pilot port X**, whose piston pushes the poppet off its seat.

### How hard to push: the pilot ratio
The pilot piston is larger than the seat; the ratio of their areas is the **pilot ratio** $R$, typically 3:1 to 4:1 (up to 10:1 or more with a decompression poppet). With the load pressure $p_L$ on the cylinder side and a back-pressure $p_2$ on the valve side (which, in an internally drained valve, also pushes back on the pilot piston), the pilot pressure needed to open it is

$$p_X = \\frac{p_L - p_2}{R} + p_2$$

A boom held at 180 bar opens with about 45 bar of pilot pressure at 4:1. Where the valve side has high back-pressure, an **externally drained** POCV vents the back of its pilot piston to tank so that $p_2$ stops working against it.

Opening a poppet suddenly against 200 bar releases the compressed oil in the cylinder with a bang. **Decompression** POCVs first lift a tiny inner poppet to bleed the pressure, then open fully.

### Rules for using one
- **Vent the pilot in neutral.** The directional valve needs a float (A and B to T) centre, so that pilot pressure falls to zero and the check closes. A closed or tandem centre can trap pilot pressure and keep it open — and the load drifts.
- **Hydraulic lock.** Two POCVs, one in each line and each piloted by the other line (a *double pilot check*), lock a double-acting cylinder in both directions — steering and outrigger cylinders use them.
- **Mount it on the cylinder.** A POCV at the valve end of a hose protects nothing if the hose bursts; screwed into the cylinder port, it holds even then.

### Overrunning loads: the chatter
Lowering a load that pulls — gravity on a boom — the POCV has only two states, shut and wide open. As soon as the pilot opens it, the load falls faster than the pump can fill the other side, the pilot pressure collapses, and the valve slams shut; the pressure builds, it opens again. The load comes down in jerks, with pressure spikes each time. The cure is a [[counterbalance-valve]], or at least a throttle in the return line between the POCV and the directional valve so the pump must build pressure to lower the load.

### Warm oil in a closed box
Oil trapped between a closed POCV and a cylinder is a sealed volume. If it warms, it tries to expand and cannot, so its pressure rises by

$$\\Delta p = \\beta\\,\\alpha_V\\,\\Delta T$$

With a bulk modulus of 1.4 GPa and a volumetric expansion of 7×10⁻⁴ per kelvin that is about 10 bar per kelvin in a rigid container — a machine left in the sun can double its trapped pressure. Hoses and the cylinder barrel stretch and take some of it up, but outriggers and booms held for hours need a small **thermal relief valve** across the trapped volume (a counterbalance valve relieves by itself). See [[bulk-modulus]] and [[physics:thermal-expansion]].

> [!warn] A POCV keeps its trapped pressure after the pump stops — that is its job. Never loosen a fitting between it and the cylinder with the load raised or the pressure trapped: lower the load or support it mechanically and release the pressure by the maker's procedure first. A jet from a loosened fitting can inject oil through the skin; seek emergency medical care at once for any injection injury.
`,
  ideas: [
    'A pilot-operated check holds a load leak-free and releases it when pilot pressure pushes its poppet open.',
    'The pilot pressure needed is the load pressure (less back-pressure) divided by the pilot ratio, plus the back-pressure.',
    'It needs a float centre to close reliably, and should be mounted directly on the cylinder.',
    'On overrunning loads it opens and slams shut repeatedly: jerky lowering and pressure spikes.',
    'Trapped oil that warms gains about 10 bar per kelvin in a rigid container.'
  ],
  pitfalls: [
    'A pilot check can meter the lowering of a load — It has only two states, shut or open; with an overrunning load it chatters. Metering needs a counterbalance valve.',
    'Any 4/3 centre works with a pilot check — Centres that block A and B can trap pilot pressure and hold the check open; use a float centre.',
    'Trapped oil keeps the pressure it was left at — Its pressure follows its temperature: warming by a few kelvin can add tens of bar.'
  ],
  formulas: [
    {
      name: 'Pilot pressure to open a pilot-operated check',
      expr: 'pX = (pL - p2)/R + p2', tex: 'p_X = \\dfrac{p_L - p_2}{R} + p_2',
      vars: {
        pX: { name: 'pilot pressure needed (gauge)', q: 'pressure', unit: 'bar', tex: 'p_X' },
        pL: { name: 'load pressure on the cylinder side (gauge)', q: 'pressure', unit: 'bar', value: 150, tex: 'p_L' },
        p2: { name: 'back-pressure on the valve side (gauge)', q: 'pressure', unit: 'bar', value: 5, tex: 'p_2' },
        R: { name: 'pilot ratio (pilot piston area ÷ seat area)', value: 4, min: 1, max: 30 }
      },
      note: 'Internally drained valve, spring force neglected. For an externally drained valve the back-pressure acts only on the seat: p_X = (p_L − p_2)/R.',
      practice: { unknowns: ['pX', 'R'] },
      stories: { pX: 'A pilot-operated check with a {R}:1 pilot ratio holds {pL}, with {p2} of back-pressure on its outlet. What pilot pressure opens it?', R: 'A check holding {pL} against {p2} of back-pressure must open with {pX} of pilot pressure. What pilot ratio does it need?' }
    },
    {
      name: 'Pressure rise of trapped oil that warms',
      expr: 'dp = beta*alpha*dT', tex: '\\Delta p = \\beta\\,\\alpha_V\\,\\Delta T',
      vars: {
        dp: { name: 'pressure rise', q: 'pressure', unit: 'bar', tex: '\\Delta p' },
        beta: { name: 'bulk modulus of the oil', q: 'pressure', unit: 'GPa', value: 1.4, tex: '\\beta' },
        alpha: { name: 'volumetric expansion coefficient of the oil', q: 'expansion', unit: '1/K', value: 0.0007, tex: '\\alpha_V' },
        dT: { name: 'temperature rise', q: 'dtemp', unit: 'K', value: 10, tex: '\\Delta T' }
      },
      note: 'An upper bound, for a rigid container. Hoses and steel that stretch reduce it, often by half; free air in the oil reduces it much more.',
      stories: { dp: 'Oil ({beta}, {alpha}) trapped behind a pilot check warms by {dT}. How much does its pressure rise?', dT: 'Oil ({beta}, {alpha}) trapped in a cylinder may rise by no more than {dp}. What warming is allowed?' }
    }
  ],
  examples: [
    {
      title: 'Opening a boom check',
      q: 'An excavator boom cylinder is held by a pilot-operated check with a 4:1 pilot ratio at 180 bar. The return line to the valve has 3 bar of back-pressure. What pilot pressure opens it, and what if the valve were externally drained?',
      steps: [
        { text: 'Internally drained:', tex: 'p_X = \\dfrac{180 - 3}{4} + 3 = 47.3\\ \\mathrm{bar}' },
        'Externally drained: $p_X = (180 - 3)/4 = 44.3$ bar.',
        'Either way the rod side must reach about 45 bar before the boom moves — and the moment it moves, the chatter problem begins unless the lowering is metered.'
      ],
      a: 'About 47 bar (44 bar externally drained).'
    },
    {
      title: 'A crane left in the sun',
      q: 'The outrigger cylinders of a mobile crane are locked by pilot checks at 100 bar in the morning. By midday the oil in them has warmed by 15 K. Estimate the pressure, taking β = 1.4 GPa and $\\alpha_V$ = 7×10⁻⁴ /K, and say what protects the cylinders.',
      steps: [
        { text: 'Rigid-container estimate:', tex: '\\Delta p = 1.4\\times10^9 \\times 7\\times10^{-4} \\times 15 = 1.47\\times10^7\\ \\mathrm{Pa} = 147\\ \\mathrm{bar}' },
        'So up to about 250 bar; the stretching of barrel and hoses takes some of it, but not reliably enough.',
        'A thermal relief valve across the trapped volume, set above the highest load pressure and below the component ratings, limits it.'
      ],
      a: 'Up to about 250 bar in theory; a thermal relief valve protects the cylinders.'
    }
  ],
  quiz: [
    { q: 'Which centre condition should a 4/3 valve have when a pilot-operated check holds the cylinder?', choices: ['Closed', 'Tandem', 'Float (A and B to tank)', 'Regenerative'], a: 2,
      why: 'Float vents the pilot line to tank in neutral, so the check closes firmly; blocked A and B can trap pilot pressure and hold it open.' },
    { q: 'A pilot check with a 3:1 ratio holds 150 bar with no back-pressure. What pilot pressure opens it?', answer: 50, unit: 'bar', tol: 0.02,
      why: 'p_X = (150 − 0)/3 + 0 = 50 bar.' },
    { q: 'Lowering a heavy gravity load through a pilot-operated check alone is smooth, because the pilot meters the opening.', a: false,
      why: 'The poppet is either shut or open. The load runs ahead, the pilot pressure collapses and the check slams shut, again and again — jerky lowering with pressure spikes.' },
    { q: 'Oil trapped in a rigid cylinder (β = 1.4 GPa, α = 7×10⁻⁴ /K) warms by 5 K. By about how much does its pressure rise?', answer: 49, unit: 'bar', tol: 0.05,
      why: 'Δp = β α ΔT = 1.4×10⁹ × 7×10⁻⁴ × 5 = 4.9×10⁶ Pa = 49 bar.' },
    { q: 'Why is a load-holding check screwed straight into the cylinder port rather than fitted at the valve?', choices: ['It is cheaper', 'So that it still holds the load if a hose bursts', 'To reduce the pilot pressure', 'To keep the oil warm'], a: 1,
      why: 'A valve at the far end of a hose protects nothing if the hose fails; on the cylinder, it traps the oil in the cylinder itself.' }
  ],
  problems: [
    { q: 'A cylinder held at 210 bar must be released with no more than 60 bar of pilot pressure. The valve is externally drained and the back-pressure is negligible. What is the smallest pilot ratio?', answer: 3.5, tol: 0.02,
      steps: ['$p_X = p_L/R$, so $R = p_L/p_X = 210/60 = 3.5$.'] }
  ],
  applications: ['Outrigger and stabiliser cylinders on cranes and aerial platforms, locked by double pilot checks.', 'Holding a machine-tool slide or a press ram against gravity while the pump is off.', 'Tipper bodies and tail lifts held in the raised position.', 'Hydraulic locks on steering cylinders.'],
  sim: 'valve-counterbalance'
},

{
  id: 'relief-valve', parent: 'pressure-valves', title: 'Pressure-relief valves', level: 2,
  short: 'The valve that limits the highest pressure in a circuit: normally closed, it opens when the pressure on its poppet beats an adjustable spring and sends the surplus flow to tank. Its cracking pressure, override and heat are what a designer must know.',
  keywords: ['relief valve', 'pressure relief valve', 'direct-acting', 'cracking pressure', 'full-flow pressure', 'override', 'p-Q characteristic', 'setting', 'poppet', 'spring preload', 'safety valve', 'port relief', 'heat'],
  prereq: ['pressure-flow-power', 'check-valves', 'physics:hookes-law'],
  related: ['pilot-relief', 'reducing-valve', 'sequence-valve', 'counterbalance-valve', 'energy-losses-heat', 'heat-coolers', 'positive-displacement', 'braking-circuits', 'hydraulic-safety'],
  body: `
A positive-displacement pump pushes its flow out whatever it meets. Block the flow — a cylinder at the end of its stroke, a valve centred, a jammed tool — and the pressure would climb until something burst. The **pressure-relief valve** prevents that. It sits right after the pump, normally closed, and opens to send oil to tank when the pressure reaches its setting. ISO 4413:2010 requires every circuit to be protected by one, and nothing may be able to isolate it from the pump.

### The direct-acting valve
A poppet (or ball, or small spool) is held on its seat by a spring whose preload is set with a screw. The inlet pressure acts on the seat area; when $p\\,A$ exceeds the preload $F_0$ the poppet lifts — the **cracking pressure**:

$$p_c = \\frac{4F_0}{\\pi d^2}$$

To pass more flow the poppet must lift further, compressing the spring by $x$ and adding $k\\,x$ to its force, so the pressure rises with flow:

$$p = p_c + \\frac{4\\,k\\,x}{\\pi d^2}, \\qquad Q = C_d\\,\\pi d\\,x \\sin\\alpha \\sqrt{\\frac{2p}{\\rho}}$$

(for a cone of half-angle $\\alpha$ discharging to tank). The rise from the cracking pressure to the pressure at full flow is the **override**. Spring rate alone gives a few per cent; flow forces on the poppet add more, and a direct-acting valve typically rises 10–20 % across its flow range. That is the valve's **p–Q characteristic**.

| Setting | Seat | Preload force |
|---|---|---|
| 100 bar | 6 mm | 283 N |
| 200 bar | 6 mm | 565 N |
| 315 bar | 10 mm | 2470 N |

A big seat at high pressure needs a big, stiff spring — the reason direct-acting valves stay small (up to roughly 60–120 L/min) and larger ones are pilot-operated (see [[pilot-relief]]). Their virtue is speed: they crack within a few milliseconds, which makes them the choice for catching pressure peaks. A damping piston or orifice keeps the poppet from chattering or squealing.

### Setting it
The setting is usually 10–15 % (or 20–30 bar) above the highest working pressure, so that the valve stays shut in normal work: any flow over it is wasted. It is set with a calibrated gauge fitted, the actuator stalled, turning the screw in small steps and locking it — never by screwing it hard in "for more power", which removes the protection. Circuits also have **secondary** (port or cross-port) reliefs that protect one actuator from shock loads, for example a motor that is braked (see [[braking-circuits]]).

### Where the power goes
Every litre that crosses a relief valve drops from the setting to tank pressure, and all of that energy becomes heat: $P = p\\,Q$. The oil itself warms as it passes:

$$\\Delta T = \\frac{\\Delta p}{\\rho\\,c_p}$$

about 0.6 K for every 10 bar — 12 K for oil dumped from 200 bar. A circuit that sends its pump flow over the relief valve for long periods is a heater, which is why good circuits unload the pump instead (see [[centre-conditions]] and [[energy-losses-heat]]).

> [!warn] Never plug, bypass or screw a relief valve fully in, and never fit a shut-off valve between it and the pump. Adjust it only with a gauge fitted and the machine guarded, and seal the setting. Before any work on the circuit, stop and lock out the pump and release all stored pressure; a jet from a leak can inject oil through the skin — a surgical emergency.
`,
  ideas: [
    'A relief valve is normally closed and opens when inlet pressure times seat area beats its spring preload.',
    'Its pressure rises with the flow it passes — the override — because the spring compresses as the poppet lifts.',
    'It is set 10–15 % above the working pressure, so it stays shut in normal work.',
    'Everything that crosses it becomes heat: P = pQ, about 0.6 K of oil temperature per 10 bar dropped.',
    'Direct-acting valves are fast but limited in size; large flows need pilot-operated valves.'
  ],
  pitfalls: [
    'A relief valve controls the flow — It limits pressure; the flow is set by the pump, and the valve takes whatever surplus the circuit cannot.',
    'A higher relief setting makes the machine stronger and costs nothing — Components are rated for a pressure; raising the setting removes their protection and every stall then dumps more heat.',
    'The relief valve holds the pressure exactly at its setting — It cracks at the setting and the pressure rises with flow; at full pump flow it is the override above that.'
  ],
  formulas: [
    {
      name: 'Cracking pressure from the spring preload',
      expr: 'pc = 4*F0/(pi*d^2)', tex: 'p_c = \\dfrac{4F_0}{\\pi d^2}',
      vars: {
        pc: { name: 'cracking pressure (gauge, outlet at tank)', q: 'pressure', unit: 'bar', tex: 'p_c' },
        F0: { name: 'spring preload', q: 'force', unit: 'N', value: 565, tex: 'F_0' },
        d: { name: 'seat diameter', q: 'length', unit: 'mm', value: 6 }
      },
      stories: { pc: 'A relief valve\'s spring presses its poppet onto a {d} seat with {F0}. At what pressure does it crack?', F0: 'A relief valve with a {d} seat must crack at {pc}. What spring preload is needed?' }
    },
    {
      name: 'Pressure at a given lift (override)',
      expr: 'p = pc + 4*k*x/(pi*d^2)', tex: 'p = p_c + \\dfrac{4\\,k\\,x}{\\pi d^2}',
      vars: {
        p: { name: 'inlet pressure at this lift (gauge)', q: 'pressure', unit: 'bar' },
        pc: { name: 'cracking pressure (gauge)', q: 'pressure', unit: 'bar', value: 200, tex: 'p_c' },
        k: { name: 'spring rate', q: 'stiffness', unit: 'N/mm', value: 60 },
        x: { name: 'poppet lift', q: 'length', unit: 'mm', value: 0.5 },
        d: { name: 'seat diameter', q: 'length', unit: 'mm', value: 6 }
      },
      note: 'Spring rate only. Flow forces on the poppet add to the override in real valves.',
      stories: { p: 'A relief valve cracking at {pc} has a {k} spring and a {d} seat. What is the pressure when the poppet has lifted {x}?' }
    },
    {
      name: 'Flow through a conical poppet',
      expr: 'Q = Cd*pi*d*x*sin(alpha)*sqrt(2*p/rho)', tex: 'Q = C_d\\,\\pi d\\,x \\sin\\alpha \\sqrt{\\dfrac{2p}{\\rho}}',
      vars: {
        Q: { name: 'flow over the valve', q: 'flowrate', unit: 'L/min' },
        Cd: { name: 'discharge coefficient', value: 0.61, tex: 'C_d' },
        d: { name: 'seat diameter', q: 'length', unit: 'mm', value: 6 },
        x: { name: 'poppet lift', q: 'length', unit: 'mm', value: 0.5 },
        alpha: { name: 'cone half-angle', q: 'angle', unit: '°', value: 45, min: 1, max: 90, tex: '\\alpha' },
        p: { name: 'inlet pressure (gauge, outlet at tank)', q: 'pressure', unit: 'bar', value: 210 },
        rho: { name: 'oil density', q: 'density', unit: 'kg/m³', value: 870, tex: '\\rho' }
      },
      note: 'Small lifts, where the gap is a narrow cone-shaped ring of width x sin α.',
      practice: { unknowns: ['Q', 'x'] },
      stories: { Q: 'A {alpha} cone poppet on a {d} seat lifts {x} at {p}. What flows (Cd = {Cd}, oil {rho})?', x: 'A relief valve with a {d} seat and a {alpha} cone passes {Q} at {p}. How far has the poppet lifted (Cd = {Cd}, oil {rho})?' }
    },
    {
      name: 'Temperature rise of oil throttled to tank',
      expr: 'dT = dp/(rho*cp)', tex: '\\Delta T = \\dfrac{\\Delta p}{\\rho\\, c_p}',
      vars: {
        dT: { name: 'temperature rise of the oil', q: 'dtemp', unit: 'K', tex: '\\Delta T' },
        dp: { name: 'pressure dropped across the valve', q: 'pressure', unit: 'bar', value: 200, tex: '\\Delta p' },
        rho: { name: 'oil density', q: 'density', unit: 'kg/m³', value: 870, tex: '\\rho' },
        cp: { name: 'specific heat of the oil', q: 'specificheat', unit: 'J/(kg·K)', value: 1880, tex: 'c_p' }
      },
      note: 'All the pressure energy becomes heat in the oil that passes (none lost to the surroundings on the way).',
      stories: { dT: 'Oil ({rho}, {cp}) is throttled from {dp} to the tank. By how much does it warm?' }
    }
  ],
  examples: [
    {
      title: 'Sizing the spring',
      q: 'A direct-acting relief valve with a 6 mm seat is to crack at 200 bar, with a 60 N/mm spring. What preload force and preload compression does it need? What would a 12 mm seat need at 350 bar?',
      steps: [
        'Seat area: $\\pi \\times 0.006^2/4 = 2.83\\times10^{-5}$ m².',
        'Preload: $F_0 = 2\\times10^7 \\times 2.83\\times10^{-5} = 565$ N; compression $565/60 = 9.4$ mm.',
        'A 12 mm seat at 350 bar: $3.5\\times10^7 \\times 1.13\\times10^{-4} = 3960$ N — a heavy spring, long or very stiff, and a large override. Hence pilot operation for big valves.'
      ],
      a: '565 N and 9.4 mm; about 4 kN for the larger valve.'
    },
    {
      title: 'The override at 60 L/min',
      q: 'The same valve (cracking 200 bar, 6 mm seat, 60 N/mm, 45° cone, $C_d = 0.61$) must pass 60 L/min. Estimate the lift and the pressure.',
      steps: [
        'Guess $p \\approx 212$ bar: $\\sqrt{2p/\\rho} = \\sqrt{2 \\times 2.12\\times10^7/870} = 221$ m/s.',
        'Lift: $x = Q/(C_d\\,\\pi d \\sin 45°\\sqrt{2p/\\rho}) = 10^{-3}/(0.61 \\times \\pi \\times 0.006 \\times 0.707 \\times 221) = 5.6\\times10^{-4}$ m.',
        'Override: $4kx/(\\pi d^2) = 4 \\times 6\\times10^4 \\times 5.6\\times10^{-4}/1.13\\times10^{-4} = 1.18\\times10^6$ Pa = 11.8 bar, so $p = 211.8$ bar — consistent with the guess.'
      ],
      a: 'About 0.56 mm of lift and 212 bar: an override of 12 bar (6 %) from the spring alone.'
    },
    {
      title: 'A stall that heats the tank',
      q: 'A press stalls with its 40 L/min pump flow crossing a 200 bar relief valve. What power becomes heat, how much does the oil warm on each pass, and how fast does a 100 L tank warm with no cooling?',
      steps: [
        '$P = 2\\times10^7 \\times 6.67\\times10^{-4} = 13.3$ kW.',
        'Per pass: $\\Delta T = 2\\times10^7/(870 \\times 1880) = 12.2$ K.',
        'Tank: 87 kg of oil; $13.3\\times10^3/(87 \\times 1880) = 0.081$ K/s, about 5 K a minute.'
      ],
      a: '13.3 kW; 12 K per pass; the tank warms about 5 K a minute — 20 K in four minutes.'
    }
  ],
  quiz: [
    { q: 'What does a pressure-relief valve control?', choices: ['The flow to the actuator', 'The highest pressure in the circuit', 'The speed of the pump', 'The pressure in the tank'], a: 1,
      why: 'It limits pressure by sending surplus flow to tank; the flow comes from the pump.' },
    { q: 'A 30 L/min pump dumps all its flow over a relief valve set at 180 bar. How much heat is made?', answer: 9, unit: 'kW', tol: 0.02,
      why: 'P = pQ = 1.8×10⁷ × 5×10⁻⁴ = 9000 W.' },
    { q: 'Why does the pressure before a direct-acting relief valve rise as more flow passes through it?', choices: ['The oil warms up', 'The poppet must lift further, compressing the spring more', 'The seat wears', 'The pump speeds up'], a: 1,
      why: 'More flow needs a larger gap; the lift compresses the spring and adds k·x to its force, and flow forces add more.' },
    { q: 'A shut-off valve between the pump and the relief valve is acceptable if it is normally left open.', a: false,
      why: 'Nothing may be able to isolate a relief valve from the pump it protects (ISO 4413:2010): one mistake and the pump dead-heads with no protection.' },
    { q: 'A machine\'s maximum working pressure is 180 bar. A sensible relief setting is about…', choices: ['160 bar', '180 bar', '200–210 bar', '300 bar'], a: 2,
      why: '10–15 % (or 20–30 bar) above the working pressure keeps the valve shut in normal work without leaving the components unprotected.' }
  ],
  problems: [
    { q: 'A relief valve has an 8 mm seat. What spring preload makes it crack at 250 bar?', answer: 1257, unit: 'N', tol: 0.02,
      steps: ['$A = \\pi \\times 0.008^2/4 = 5.027\\times10^{-5}$ m².', '$F_0 = 2.5\\times10^7 \\times 5.027\\times10^{-5} = 1257$ N.'] },
    { q: 'Oil is throttled from 315 bar to tank. By how many kelvin does it warm (ρ = 870 kg/m³, c = 1880 J/(kg·K))?', answer: 19.3, unit: 'K', tol: 0.02,
      steps: ['$\\Delta T = 3.15\\times10^7/(870 \\times 1880) = 19.3$ K.'] }
  ],
  applications: ['The main relief valve on every hydraulic power unit, right after the pump.', 'Cross-port reliefs on hydraulic motors that cushion braking and shock loads.', 'Circuit (port) reliefs in each section of a mobile valve bank.', 'Thermal reliefs on locked cylinders and on long, closed pipe runs.'],
  history: 'The idea is older than hydraulics. Denis Papin\'s "steam digester" of 1679, a pressure cooker for bones, carried a weighted lever that lifted a plug when the pressure grew too high — the first safety valve. Boiler explosions through the nineteenth century taught engineers to make such valves impossible to tie down, a lesson carried into every hydraulic standard since.',
  sim: ['valve-relief-direct', 'valve-relief-compare']
},

{
  id: 'pilot-relief', parent: 'pressure-valves', title: 'Pilot-operated relief and unloading valves', level: 2,
  short: 'A two-stage relief valve: a small pilot poppet sets the pressure, a large main poppet passes the flow. Its characteristic is nearly flat, it can be set from a distance, and venting its spring chamber unloads the pump at a few bar.',
  keywords: ['pilot-operated relief valve', 'two-stage relief', 'balanced piston', 'main poppet', 'pilot poppet', 'orifice', 'vent', 'venting', 'unloading', 'unloading valve', 'remote control', 'soft start', 'override'],
  prereq: ['relief-valve', 'orifice-equation', 'centre-conditions'],
  related: ['accumulator-circuits', 'hi-lo-circuit', 'energy-losses-heat', 'cartridge-valves', 'pressure-compensated-pump', 'heat-coolers', 'proportional-valves'],
  body: `
A direct-acting relief valve for 250 L/min at 350 bar would need a spring pushing with many kilonewtons, and its pressure would rise by a third across its flow range. The **pilot-operated** (two-stage) valve splits the job: a tiny valve decides the pressure, and a big one, which only has to balance itself, passes the flow.

### How the two stages work
1. The **main poppet** (typically 15–30 mm) sits on its seat with system pressure below it. A small **orifice**, well under a millimetre, runs through it into the **spring chamber** above, so at rest the pressure above equals the pressure below; with nearly equal areas it is held shut only by a light spring worth 3–6 bar.
2. The spring chamber is connected to a small direct-acting **pilot poppet**, a few millimetres across, whose adjustable spring sets the pressure. Below the setting nothing flows.
3. At the setting the pilot cracks. A small flow, well under 1 L/min, now passes through the orifice, and the orifice's pressure drop makes the pressure below the main poppet higher than above it.
4. When that difference beats the light spring, the main poppet opens as far as the flow requires. Since the difference needed is always just the light spring's few bar, the inlet pressure barely changes:

$$p = p_p + \\frac{4F_s}{\\pi D^2}$$

with $p_p$ the pilot setting and $F_s$ the light main spring on a seat of diameter $D$. The pilot flow is set by the orifice:

$$q = C_d\\,\\frac{\\pi d^2}{4}\\sqrt{\\frac{2\\,\\Delta p}{\\rho}}$$

| At 200 bar setting | 60 L/min | 120 L/min | 250 L/min |
|---|---|---|---|
| Direct-acting (10 mm seat) | 217 bar | 233 bar | 264 bar |
| Pilot-operated (16 mm main) | 204 bar | 204 bar | 204 bar |

(Figures from the model in the simulation; real valves add a few bar of flow forces and passage losses.) The price is speed: the main stage waits for pilot flow to move oil in and out of its spring chamber, so it responds in tens of milliseconds, and a fast pressure spike can overshoot. Some valves add a small direct-acting stage for peaks, and the orifice must be protected from dirt — a blocked orifice leaves the valve unable to open its main stage.

### Venting and remote control
The spring chamber has a port, **X (vent)**. Connect it to tank — usually through a small 2/2 solenoid valve — and the pressure above the main poppet vanishes: the valve opens against its light spring alone and the pump circulates at 4–8 bar. That is **unloading**: the pump runs, but makes almost no heat. It is also a **soft start**: an electric motor started with the pump vented comes up to speed without load.

Connect X instead to a small direct-acting relief valve elsewhere — on a control panel, or through a selector valve to several of them — and that valve sets the system pressure, so long as it is set below the pilot's own setting: remote and multi-pressure control. A proportional pilot makes the setting electrically adjustable (see [[proportional-valves]]).

### Unloading valves
An **unloading valve** is a pilot-operated valve whose pilot is taken from somewhere else in the circuit. When an accumulator is full, its pressure pilots the unloading valve open and the pump idles until the accumulator needs recharging (see [[accumulator-circuits]]); in a hi-lo circuit, the large low-pressure pump is unloaded as soon as the pressing pressure rises (see [[hi-lo-circuit]]). The energy saved is large:

$$P = (p_1 - p_2)\\,Q$$

> [!warn] Venting drops the system pressure at once: anything held up by pump pressure alone will move. Never use venting or unloading as a way to make a machine safe for work — lock out the drive and release stored pressure first.
`,
  ideas: [
    'A small pilot poppet sets the pressure; a large balanced main poppet passes the flow.',
    'The main poppet opens on the few bar across its orifice, so the characteristic is nearly flat — a few bar of override across the whole flow range.',
    'Venting the spring chamber to tank opens the main stage at 4–8 bar: the pump unloads with almost no heat.',
    'The vent port also allows remote and multi-pressure control from small pilot valves.',
    'Two-stage valves are slower than direct-acting ones and their pilot orifice must be kept clean.'
  ],
  pitfalls: [
    'A pilot-operated relief valve passes most of its flow through the pilot — Only a fraction of a litre per minute passes the pilot; the rest goes through the main poppet.',
    'A remote relief can set the pressure higher than the valve\'s own pilot — The lower of the two settings wins; a remote valve can only lower the pressure.',
    'Unloading makes the circuit safe to work on — It removes pump pressure but not accumulators, trapped oil or raised loads.'
  ],
  formulas: [
    {
      name: 'Pressure at which the main poppet opens',
      expr: 'p = pp + 4*Fs/(pi*D^2)', tex: 'p = p_p + \\dfrac{4F_s}{\\pi D^2}',
      vars: {
        p: { name: 'inlet (system) pressure (gauge)', q: 'pressure', unit: 'bar' },
        pp: { name: 'pilot setting: spring-chamber pressure (gauge)', q: 'pressure', unit: 'bar', value: 200, tex: 'p_p' },
        Fs: { name: 'main-poppet spring force', q: 'force', unit: 'N', value: 60, tex: 'F_s' },
        D: { name: 'main seat diameter', q: 'length', unit: 'mm', value: 16 }
      },
      note: 'With the vent open, p_p is only the few tenths of a bar lost in the vent line, and the valve unloads at about the main spring\'s pressure.',
      stories: { p: 'A two-stage relief valve\'s pilot is set to {pp}; its main poppet ({D} seat) has a {Fs} spring. At what inlet pressure does the main stage open?' }
    },
    {
      name: 'Pilot flow through the main-poppet orifice',
      expr: 'q = Cd*pi*d^2/4*sqrt(2*dp/rho)', tex: 'q = C_d\\,\\dfrac{\\pi d^2}{4}\\sqrt{\\dfrac{2\\,\\Delta p}{\\rho}}',
      vars: {
        q: { name: 'pilot flow', q: 'flowrate', unit: 'L/min' },
        Cd: { name: 'discharge coefficient', value: 0.7, tex: 'C_d' },
        d: { name: 'orifice diameter', q: 'length', unit: 'mm', value: 0.8 },
        dp: { name: 'pressure difference across the orifice', q: 'pressure', unit: 'bar', value: 3, tex: '\\Delta p' },
        rho: { name: 'oil density', q: 'density', unit: 'kg/m³', value: 870, tex: '\\rho' }
      },
      stories: { q: 'A {d} orifice in a main poppet has {dp} across it. How much pilot oil flows (Cd = {Cd}, oil {rho})?', d: 'A main poppet opens at {dp} across its orifice, and the pilot flow should then be {q}. What orifice diameter is needed (Cd = {Cd}, oil {rho})?' }
    },
    {
      name: 'Power saved by unloading',
      expr: 'P = (p1 - p2)*Q', tex: 'P = (p_1 - p_2)\\,Q',
      vars: {
        P: { name: 'power no longer turned into heat', q: 'power', unit: 'kW' },
        p1: { name: 'relief setting the pump would otherwise work against (gauge)', q: 'pressure', unit: 'bar', value: 200, tex: 'p_1' },
        p2: { name: 'unloading pressure (gauge)', q: 'pressure', unit: 'bar', value: 5, tex: 'p_2' },
        Q: { name: 'pump flow', q: 'flowrate', unit: 'L/min', value: 100 }
      },
      stories: { P: 'A pump delivering {Q} is unloaded at {p2} instead of blowing over its relief valve at {p1}. How much power is saved?' }
    }
  ],
  examples: [
    {
      title: 'A flat characteristic',
      q: 'A pilot-operated relief valve has its pilot set to 200 bar. Its main poppet has a 16 mm seat and a 60 N spring. Estimate the inlet pressure when the main stage is open, and compare with a direct-acting valve that rises 32 % at the same flow.',
      steps: [
        'Main seat area: $\\pi \\times 0.016^2/4 = 2.01\\times10^{-4}$ m².',
        'Light-spring pressure: $60/2.01\\times10^{-4} = 2.98\\times10^5$ Pa = 3.0 bar.',
        'Inlet pressure: $200 + 3.0 = 203$ bar, plus about a bar of pilot override — some 204 bar whether 60 or 250 L/min flows.',
        'The direct-acting valve reaches $1.32 \\times 200 = 264$ bar at full flow.'
      ],
      a: 'About 204 bar across the range, against 264 bar for the direct-acting valve.'
    },
    {
      title: 'Venting while the machine waits',
      q: 'A power unit delivers 120 L/min against a 200 bar pilot-operated relief valve for 40 % of every shift while the press waits. Venting the relief valve unloads it at 5 bar instead. What power is saved while waiting?',
      steps: [
        '$Q = 120/60\\,000 = 2\\times10^{-3}$ m³/s.',
        'Without venting: $2\\times10^7 \\times 2\\times10^{-3} = 40$ kW of heat.',
        'Vented: $5\\times10^5 \\times 2\\times10^{-3} = 1$ kW.',
        'Saved: $(200 - 5)\\times10^5 \\times 2\\times10^{-3} = 39$ kW — and a cooler that no longer has to remove it.'
      ],
      a: 'About 39 kW while waiting.'
    }
  ],
  quiz: [
    { q: 'In a pilot-operated relief valve, what opens the main poppet?', choices: ['The pilot spring pushing on it', 'The pressure difference created across its orifice when pilot oil flows', 'A solenoid', 'The tank pressure'], a: 1,
      why: 'Once the pilot cracks, pilot flow through the orifice makes the pressure below the main poppet a few bar higher than above it — enough to beat the light spring.' },
    { q: 'Why is the characteristic of a pilot-operated relief valve so flat?', choices: ['Its main spring is very stiff', 'The main poppet only ever needs the few bar of its light spring to open, however far', 'It has no spring at all', 'Its pilot passes most of the flow'], a: 1,
      why: 'The system pressure is the pilot setting plus the light-spring pressure; neither changes much with flow.' },
    { q: 'The vent port X of a pilot-operated relief valve is connected to tank. The pump…', choices: ['stalls', 'unloads at a few bar', 'runs at the relief setting', 'reverses'], a: 1,
      why: 'With no pressure above the main poppet, it opens against its light spring alone: the pump circulates at 4–8 bar.' },
    { q: 'A 60 L/min pump is unloaded at 6 bar instead of running over a 210 bar relief valve. How much power is saved?', answer: 20.4, unit: 'kW', tol: 0.02,
      why: 'P = (210 − 6)×10⁵ × 10⁻³ = 20 400 W.' },
    { q: 'A remote relief valve set to 150 bar is connected to the vent port of a main valve whose pilot is set to 200 bar. The system pressure is limited to 150 bar.', a: true,
      why: 'The spring chamber cannot rise above what the remote valve allows, so the lower setting wins.' }
  ],
  problems: [
    { q: 'A main poppet has a 0.8 mm orifice (Cd = 0.7). What pilot flow passes when 4 bar acts across it (ρ = 870 kg/m³)?', answer: 0.64, unit: 'L/min', tol: 0.03,
      steps: ['$A = \\pi \\times (8\\times10^{-4})^2/4 = 5.03\\times10^{-7}$ m².', '$q = 0.7 \\times 5.03\\times10^{-7} \\times \\sqrt{8\\times10^5/870} = 0.7 \\times 5.03\\times10^{-7} \\times 30.3 = 1.07\\times10^{-5}$ m³/s = 0.64 L/min.'] }
  ],
  applications: ['Main relief valves on industrial power units above about 100 L/min.', 'Solenoid-vented relief valves that unload the pump between press cycles and give the motor a soft start.', 'Unloading valves that idle the pump while an accumulator supplies the circuit.', 'Multi-pressure presses, where a selector valve connects the vent port to one of several small remote reliefs.'],
  history: 'Harry Vickers, working in Detroit in the 1920s and 1930s, gave industrial hydraulics both the balanced vane pump and the balanced-piston relief valve — a two-stage valve whose large main element was hydraulically balanced and held by a light spring. The principle, a small pilot commanding a large balanced stage, now runs through almost every large hydraulic valve.',
  sim: 'valve-relief-compare'
},

{
  id: 'reducing-valve', parent: 'pressure-valves', title: 'Pressure-reducing valves', level: 2,
  short: 'A normally open valve that senses its own outlet and throttles to hold it at a lower pressure than the main circuit — for clamps, pilot supplies, brakes and lubrication — with its spring chamber drained to tank.',
  keywords: ['pressure-reducing valve', 'reducing valve', 'pressure control', 'secondary pressure', 'downstream pressure', 'outlet pressure', 'drain', 'external drain', 'three-way reducing valve', 'reducing-relieving', 'clamp pressure', 'normally open'],
  prereq: ['relief-valve', 'pascals-law', 'hydraulic-cylinder'],
  related: ['sequence-valve', 'pilot-relief', 'check-valves', 'energy-losses-heat', 'accumulator-circuits', 'sequencing-circuit', 'industrial-presses', 'pneumatics:pressure-regulators'],
  body: `
A relief valve limits the pressure of a whole circuit. Often one branch needs a *lower* pressure than the rest: a clamp that must hold a thin-walled part without crushing it while the press beside it works at 200 bar; a pilot supply at 30–40 bar for joysticks; a brake; a lubrication line. The **pressure-reducing valve** makes that branch's pressure independent of the main one.

### It watches its outlet
A reducing valve is **normally open**: at rest, its spring holds the spool wide open and oil passes freely. A passage feeds the **outlet** pressure to the spool's end, against the spring. As the outlet pressure approaches the setting, it pushes the spool towards closing, throttling the flow just enough to hold the outlet at the setting — however high the inlet climbs. When the branch takes no flow (a clamp that has closed on its part) the valve closes almost completely and holds the outlet at the setting.

That makes it the mirror image of the relief valve:

| | Relief valve | Sequence valve | Reducing valve |
|---|---|---|---|
| At rest | closed | closed | open |
| Senses | its inlet | its inlet | its outlet |
| Outlet goes to | tank | a working circuit | a working circuit |
| Spring chamber | drained internally to the outlet (tank) | drained externally (L) | drained externally (L) |

### The drain line
Oil leaks past the spool into the spring chamber, and a pilot-operated reducing valve also sends its pilot flow there — 0.5–1 L/min whenever it regulates. That chamber must be **drained separately to tank** (port L or Y), because the outlet is not at tank pressure: if the leakage could not escape, its pressure would add to the spring and the setting would creep up. A drain line blocked or tied into a return line with back-pressure is a classic fault.

### What it can and cannot do
- **Hold only while the inlet is higher.** If the main pressure falls below the setting, the valve is wide open and the branch follows it down — oil flows back out of the clamp. A **check valve** after the reducing valve keeps the clamp pressurised through such dips.
- **Not relieve.** A plain (two-way) reducing valve cannot let oil out of its outlet: if the clamped part is pushed back or the oil warms, the branch pressure rises above the setting. A **three-way** (reducing/relieving) valve adds a path from outlet to tank for that.
- **Reverse flow**: when the clamp retracts, its oil must return through the valve; many reducing valves have a built-in check for free reverse flow.

### Energy
The valve throttles: whatever flows into the branch drops from the main pressure to the branch pressure, and that is heat:

$$P = (p_1 - p_2)\\,Q$$

Negligible for a clamp that takes a litre and then stops; serious for a lubrication circuit fed continuously from 200 bar. Continuous low-pressure users are better served by their own small pump. The clamp force itself is simply

$$F = p_2\\,\\frac{\\pi D^2}{4}$$

> [!warn] A reduced-pressure branch still holds stored energy: a clamp keeps its force after the pump stops if a check valve traps its oil. Release clamps and branch pressure before removing a part or opening a fitting, and treat every line as live until a gauge shows zero.
`,
  ideas: [
    'A reducing valve is normally open and senses its outlet, throttling to hold the branch at its setting.',
    'Its spring chamber must drain separately to tank, or leakage raises the setting.',
    'It cannot raise the branch above the inlet pressure, and a plain two-way valve cannot relieve the branch.',
    'A check valve after it holds the branch pressure when the main pressure dips.',
    'Throttling from the main pressure to the branch pressure turns (p₁ − p₂)Q into heat.'
  ],
  pitfalls: [
    'A reducing valve lowers the pressure of the whole circuit — It acts only on its own outlet branch; the rest of the circuit is untouched.',
    'The drain port can be plugged if it only carries a drop — Leakage and pilot flow then build up in the spring chamber and push the setting up.',
    'The branch keeps its setting whatever happens upstream — If the inlet falls below the setting the valve opens wide and the branch follows the inlet down, unless a check valve holds it.'
  ],
  formulas: [
    {
      name: 'Force of a cylinder on the reduced branch',
      expr: 'F = p2*pi*D^2/4', tex: 'F = p_2\\,\\dfrac{\\pi D^2}{4}',
      vars: {
        F: { name: 'clamp force', q: 'force', unit: 'kN' },
        p2: { name: 'reduced (outlet) pressure (gauge)', q: 'pressure', unit: 'bar', value: 40, tex: 'p_2' },
        D: { name: 'clamp bore', q: 'length', unit: 'mm', value: 50 }
      },
      stories: { F: 'A {D} clamp cylinder is fed through a reducing valve set to {p2}. What force does it clamp with?', p2: 'A {D} clamp must press with no more than {F}. What should the reducing valve be set to?' }
    },
    {
      name: 'Heat made by throttling to the lower pressure',
      expr: 'P = (p1 - p2)*Q', tex: 'P = (p_1 - p_2)\\,Q',
      vars: {
        P: { name: 'heat made in the valve', q: 'power', unit: 'kW' },
        p1: { name: 'inlet (main) pressure (gauge)', q: 'pressure', unit: 'bar', value: 200, tex: 'p_1' },
        p2: { name: 'outlet (reduced) pressure (gauge)', q: 'pressure', unit: 'bar', value: 20, tex: 'p_2' },
        Q: { name: 'flow into the branch', q: 'flowrate', unit: 'L/min', value: 10 }
      },
      stories: { P: 'A reducing valve feeds {Q} from a {p1} main line into a {p2} branch. How much heat does it make?' }
    }
  ],
  examples: [
    {
      title: 'Clamping a thin part',
      q: 'A 50 mm clamp must hold a thin-walled casting with no more than 8 kN, while the press on the same pump works at up to 180 bar. What setting should the reducing valve have, and what would the clamp press with if it were fed straight from the main line?',
      steps: [
        'Clamp area: $\\pi \\times 0.05^2/4 = 1.96\\times10^{-3}$ m².',
        'Setting: $p_2 = F/A = 8000/1.96\\times10^{-3} = 4.07\\times10^6$ Pa — about 40 bar, giving 7.9 kN.',
        'From the main line: $1.8\\times10^7 \\times 1.96\\times10^{-3} = 35$ kN — more than four times too much.'
      ],
      a: 'About 40 bar (7.9 kN); unreduced it would press with 35 kN.'
    },
    {
      title: 'An expensive lubrication line',
      q: 'A gearbox lubrication line takes 10 L/min at 20 bar, fed through a reducing valve from a 200 bar main line. How much heat does the valve make, and what would a separate pump at 20 bar need?',
      steps: [
        '$Q = 1.67\\times10^{-4}$ m³/s.',
        'Heat in the valve: $(200 - 20)\\times10^5 \\times 1.67\\times10^{-4} = 3.0$ kW, all day.',
        'A dedicated pump delivers the same oil at 20 bar with $2\\times10^6 \\times 1.67\\times10^{-4} = 0.33$ kW of hydraulic power.'
      ],
      a: '3 kW of heat, against a third of a kilowatt for a separate small pump.'
    }
  ],
  quiz: [
    { q: 'Which pressure does a reducing valve sense to control itself?', choices: ['Its inlet pressure', 'Its outlet pressure', 'The tank pressure', 'The pump pressure'], a: 1,
      why: 'It feeds the outlet pressure to the spool against the spring, so it holds its outlet at the setting.' },
    { q: 'A reducing valve is set to 50 bar, but the main line supplying it drops to 30 bar. With no check valve, the branch pressure becomes…', choices: ['50 bar', 'about 30 bar', 'zero', '80 bar'], a: 1,
      why: 'Below its setting the valve is wide open; the branch follows the inlet down, and oil flows back out of the branch.' },
    { q: 'What force does a 63 mm clamp produce when fed through a reducing valve set to 60 bar?', answer: 18.7, unit: 'kN', tol: 0.02,
      why: 'A = π × 0.063²/4 = 3.12×10⁻³ m²; F = 6×10⁶ × 3.12×10⁻³ = 18.7 kN.' },
    { q: 'A reducing valve\'s drain line can safely be teed into a return line that sees 10 bar of back-pressure.', a: false,
      why: 'The back-pressure would act in the spring chamber and add to the setting — the branch pressure would rise by about that amount. The drain goes straight to tank.' },
    { q: 'The clamped part is pushed back by the press and the clamp\'s pressure rises above the setting. Which valve would limit it?', choices: ['A two-way reducing valve', 'A three-way (reducing/relieving) valve', 'A check valve', 'A sequence valve'], a: 1,
      why: 'A three-way valve has an extra path from outlet to tank that opens when the branch exceeds its setting; a two-way valve can only throttle the inflow.' }
  ],
  problems: [
    { q: 'A reducing valve feeds 4 L/min continuously from a 160 bar line into a 35 bar pilot supply. How much heat does it make?', answer: 0.833, unit: 'kW', tol: 0.02,
      steps: ['$Q = 4/60\\,000 = 6.67\\times10^{-5}$ m³/s.', '$P = (160 - 35)\\times10^5 \\times 6.67\\times10^{-5} = 833$ W.'] }
  ],
  applications: ['Workholding clamps on machine tools and presses, set to hold without crushing.', 'Pilot-oil supplies at 30–40 bar for joysticks on excavators and loaders, taken from the main pump.', 'Brake and clutch circuits in tractors and transmissions.', 'Test rigs and presses where a second, lower force is needed from the same power unit.'],
  sim: 'valve-reducing-clamp'
},

{
  id: 'sequence-valve', parent: 'pressure-valves', title: 'Sequence valves', level: 2,
  short: 'A normally closed pressure valve whose outlet feeds a second actuator: it keeps it waiting until the first has built up a set pressure, then passes flow while holding its inlet at that pressure. Its spring chamber must be drained separately.',
  keywords: ['sequence valve', 'sequencing', 'priority valve', 'external drain', 'externally piloted', 'clamp and drill', 'setting margin', 'kick-down', 'free reverse flow'],
  prereq: ['relief-valve', 'reducing-valve', 'hydraulic-cylinder'],
  related: ['sequencing-circuit', 'check-valves', 'energy-losses-heat', 'industrial-presses', 'electronics:sensors', 'hydraulic-safety'],
  body: `
Many machines must do two things in order: clamp, then drill; close a mould, then inject; extend one cylinder, then the next. A **sequence valve** does it with pressure alone. It looks like a relief valve — normally closed, opening when its inlet pressure beats an adjustable spring — but its outlet, instead of going to tank, feeds the **second** actuator.

### What happens in a cycle
1. The directional valve shifts. Both actuators are connected to the pump, but the sequence valve blocks the second, so all the flow goes to the first. The first actuator moves at whatever pressure its load needs — say 15 bar for a clamp.
2. The clamp closes on the part and stops. The pressure rises. At the sequence setting, say 40 bar, the valve opens.
3. The second actuator moves. The sequence valve now throttles just enough to keep its **inlet** at the setting, so the first actuator keeps at least that pressure — the clamp keeps clamping — even if the second needs less.
4. On the return stroke, a check valve built into or beside the sequence valve lets oil flow back freely.

### The external drain
Its outlet is a working line under pressure, so the sequence valve's spring chamber cannot drain into it as a relief valve's does into its tank-side outlet. It has its own drain port **L** to tank. If it were drained into its outlet, the outlet pressure would add to the spring, and a valve set to 50 bar feeding an actuator that needs 60 bar would not open until 110 bar.

Some sequence valves are **externally piloted**: the pressure that opens them is taken from another point in the circuit (port X) rather than from the inlet — for instance, to start a second pump's flow when the first actuator's pressure rises.

### Choosing the setting
The setting must sit clear of everything around it:

$$p_s = \\frac{F_1}{A_1} + \\Delta p_m$$

— above the pressure $F_1/A_1$ the first actuator needs to *move* (including friction and back-pressure), by a margin $\\Delta p_m$ of at least 10–15 bar so that pressure ripple and start-up peaks do not trigger it early; and below the relief setting by enough that the second actuator still gets the pressure it needs. While the second actuator works at a lower pressure $p_2$, the valve throttles and makes heat $(p_s - p_2)\\,Q$.

### Pressure is not position
A sequence valve knows only pressure. If the first actuator meets an obstruction halfway — a badly placed part, a hand — its pressure rises and the second actuator starts anyway, with the first one not where it should be. Where a wrong sequence could hurt someone or damage the machine, the sequence is confirmed by position: limit switches or position sensors in the control system (see [[electronics:sensors]] and [[sequencing-circuit]]), designed under ISO 4413:2010 and the functional-safety standards.

> [!warn] Pressure-sequenced machines move on their own once the pressure is reached. Never reach into a machine to free a jammed first actuator while the circuit is pressurised: the second actuator may start the moment it frees. Stop, lock out and release the pressure first.
`,
  ideas: [
    'A sequence valve is a normally closed, inlet-sensing valve whose outlet feeds a second actuator instead of tank.',
    'The second actuator waits until the first has built up the setting; the first keeps at least that pressure while the second moves.',
    'Its spring chamber drains separately to tank, or the outlet pressure adds to the setting.',
    'The setting sits at least 10–15 bar above the first actuator\'s moving pressure and well below the relief setting.',
    'Pressure sequencing does not prove position; safety-critical sequences need position sensing.'
  ],
  pitfalls: [
    'A sequence valve is a relief valve with a different name — Its outlet is a working line, so it needs an external drain, and it must keep its inlet up while passing flow.',
    'Setting the sequence valve just above the first actuator\'s working pressure is fine — Pressure peaks and friction variations then trigger it early; leave 10–15 bar of margin.',
    'If the second actuator moved, the first must have finished — The pressure may have risen because the first jammed; only position sensing proves it arrived.'
  ],
  formulas: [
    {
      name: 'Sequence-valve setting',
      expr: 'ps = F1/A1 + dpm', tex: 'p_s = \\dfrac{F_1}{A_1} + \\Delta p_m',
      vars: {
        ps: { name: 'sequence setting (gauge)', q: 'pressure', unit: 'bar', tex: 'p_s' },
        F1: { name: 'force the first actuator needs to move', q: 'force', unit: 'kN', value: 5, tex: 'F_1' },
        A1: { name: 'area of the first actuator', q: 'area', unit: 'cm²', value: 19.6, tex: 'A_1' },
        dpm: { name: 'safety margin', q: 'pressure', unit: 'bar', value: 15, tex: '\\Delta p_m' }
      },
      note: 'F₁ includes friction, spring and back-pressure forces. Check afterwards that the relief setting leaves the second actuator enough.',
      stories: { ps: 'A clamp of {A1} needs {F1} to move. With a margin of {dpm}, what should the sequence valve be set to?' }
    },
    {
      name: 'Heat in the sequence valve while the second actuator works',
      expr: 'P = (ps - p2)*Q', tex: 'P = (p_s - p_2)\\,Q',
      vars: {
        P: { name: 'heat made in the valve', q: 'power', unit: 'kW' },
        ps: { name: 'sequence setting: inlet pressure (gauge)', q: 'pressure', unit: 'bar', value: 60, tex: 'p_s' },
        p2: { name: 'pressure the second actuator needs (gauge)', q: 'pressure', unit: 'bar', value: 20, tex: 'p_2' },
        Q: { name: 'flow to the second actuator', q: 'flowrate', unit: 'L/min', value: 20 }
      },
      note: 'Only while the second actuator needs less than the setting; above it the valve is wide open and throttles nothing.',
      stories: { P: 'A sequence valve set to {ps} passes {Q} to a cylinder that needs only {p2}. How much heat does it make?' }
    }
  ],
  examples: [
    {
      title: 'Clamp, then drill',
      q: 'A 50 mm clamp cylinder needs 5 kN to overcome its friction and return spring while moving. The drill feed cylinder needs up to 90 bar; the relief valve is set to 140 bar. Choose the sequence setting and check it.',
      steps: [
        'Clamp area: $\\pi \\times 0.05^2/4 = 19.6$ cm².',
        { text: 'Setting with a 15 bar margin:', tex: 'p_s = \\dfrac{5000\\ \\mathrm{N}}{1.96\\times10^{-3}\\ \\mathrm{m^2}} + 15\\ \\mathrm{bar} = 25.5 + 15 = 40.5\\ \\mathrm{bar}' },
        'Round to 45 bar. The clamp then holds with at least $4.5\\times10^6 \\times 1.96\\times10^{-3} = 8.8$ kN while drilling.',
        'The drill needs up to 90 bar, well below the 140 bar relief: the sequence valve is then fully open and the clamp sees the drill pressure too.'
      ],
      a: 'About 45 bar; the clamp holds with at least 8.8 kN.'
    },
    {
      title: 'The missing drain',
      q: 'A sequence valve set to 50 bar was installed with its drain port plugged, so its spring chamber is connected to its outlet. The second actuator needs 60 bar to move. When does the valve open?',
      steps: [
        'The outlet pressure acts on the spring side and adds to the spring.',
        'To open, the inlet must exceed the spring setting plus the outlet pressure: $50 + 60 = 110$ bar.',
        'The first actuator is pushed to 110 bar and the relief valve may open first; the machine hesitates or stalls.'
      ],
      a: 'At about 110 bar — if at all; the drain must go straight to tank.'
    }
  ],
  quiz: [
    { q: 'How does a sequence valve differ from a relief valve?', choices: ['It senses its outlet', 'Its outlet feeds a working circuit, so its spring chamber drains separately', 'It is normally open', 'It has no spring'], a: 1,
      why: 'Both are normally closed and sense their inlet; the sequence valve\'s outlet is a pressurised working line, hence the external drain.' },
    { q: 'While the second actuator moves, the pressure at the first actuator is…', choices: ['zero', 'at least the sequence setting', 'the relief setting', 'the second actuator\'s pressure'], a: 1,
      why: 'The sequence valve throttles to keep its inlet at the setting, so the first actuator keeps at least that pressure.' },
    { q: 'A clamp of 12.6 cm² needs 3 kN to move. With a 15 bar margin, what should the sequence valve be set to?', answer: 38.8, unit: 'bar', tol: 0.03,
      why: '3000/1.26×10⁻³ = 23.8 bar; plus 15 bar = 38.8 bar.' },
    { q: 'If the second actuator has started, the first one must have completed its stroke.', a: false,
      why: 'The first actuator\'s pressure also rises if it jams part-way; a pressure-sequenced circuit cannot tell. Position sensors can.' },
    { q: 'A sequence valve set to 70 bar feeds a cylinder working at 30 bar with 25 L/min. How much heat does it make?', answer: 1.67, unit: 'kW', tol: 0.03,
      why: 'P = (70 − 30)×10⁵ × 4.17×10⁻⁴ = 1667 W.' }
  ],
  applications: ['Clamp-then-machine sequences on drilling and milling fixtures.', 'Mould-close-then-inject sequences on injection-moulding machines.', 'Priority valves that feed a vehicle\'s steering before its other functions.', 'Folding and unfolding sequences of booms and platforms, often backed by position sensors.']
},

{
  id: 'counterbalance-valve', parent: 'pressure-valves', title: 'Counterbalance valves', level: 3,
  short: 'A pilot-assisted relief valve in the return line of a load that pulls: it holds the load, and when lowering it throttles the outgoing oil so that the load descends at the speed the pump sets instead of running away. Set about 1.3 times the load pressure, with pilot ratios from 3:1 to 10:1.',
  keywords: ['counterbalance valve', 'overcentre valve', 'load control valve', 'overrunning load', 'negative load', 'pilot ratio', 'setting', 'load holding', 'hose-burst valve', 'motion control', 'lowering', 'meter-out', 'ISO 8643'],
  prereq: ['relief-valve', 'pilot-check', 'hydraulic-cylinder', 'area-ratio'],
  related: ['load-holding', 'meter-in-out', 'braking-circuits', 'centre-conditions', 'lifts-cranes', 'mobile-hydraulics', 'cavitation', 'physics:gravitational-potential-energy', 'physics:damped-oscillations', 'hydraulic-safety'],
  body: `
Most loads push back against the actuator; some pull. A boom being lowered, a crane letting out its hook, a vehicle's drive motor going downhill, a press ram falling under its own weight — these are **overrunning** (negative) loads, and they try to run ahead of the oil. Lower one through an open valve and gravity sets the speed: the cap-end oil rushes out, the pump cannot fill the rod end fast enough, the rod end cavitates, and nothing but the valve's passages limits the fall. A [[pilot-check]] only makes it worse, slamming open and shut. The answer is to meter the oil *leaving* the actuator, and the valve made for it is the **counterbalance valve** (in the USA often "overcentre valve").

### What it is
A counterbalance valve is a relief valve in the line from the load-holding chamber, with two additions:

- a **check valve** in parallel, so oil flows freely *into* the cylinder when raising;
- a **pilot** from the opposite line (usually the rod end), whose pressure helps to open it, multiplied by a **pilot ratio** $R$.

It opens when the load pressure $p_L$ plus $R$ times the pilot pressure beats its setting $p_s$. The pilot pressure needed to crack it is therefore

$$p_X = \\frac{p_s - p_L}{R}$$

and in a cylinder, where the pilot pressure also pushes on the annulus, the rod-end pressure at which lowering starts is

$$p_B = \\frac{p_s - p_L}{R + 1/\\varphi}$$

with $\\varphi = A_1/A_2$ the area ratio. Once open, the valve **modulates**: if the load speeds up, the rod end loses pressure and the valve closes a little; if it slows, the pressure builds and it opens. The load comes down at the speed the pump's flow into the rod end sets — the essence of meter-out control (see [[meter-in-out]]).

### Setting and pilot ratio
- **Setting**: about **1.3 times the highest load pressure**. Set it lower and the valve opens by itself under the load, or under a bounce of it; set it much higher and lowering needs more pilot pressure and makes more heat.
- **Pilot ratio**: low ratios (3:1) for loads that vary and systems that tend to oscillate — long booms, cranes: more stable, but more pilot pressure and heat. High ratios (8:1, 10:1) for stable loads, where efficiency matters. The simulation shows the trade: at 8:1 a heavy load starts to hunt.

| | Pilot-operated check | Counterbalance valve |
|---|---|---|
| Holding | leak-free | nearly leak-free (poppet types) |
| Lowering an overrunning load | jerky: opens fully, slams shut | smooth, metered |
| Relief function | none: needs a thermal relief | relieves shock and thermal pressure |
| Energy when lowering | little | the load's energy and some pump energy become heat |

### Rules for using one
- **Mount it on the cylinder port** (or motor), so it also holds the load if a hose bursts. On excavators that lift loads, a hose-burst (boom-lowering control) valve is required by ISO 8643:2017.
- **Float centre**: the directional valve should connect both actuator lines to tank in neutral so the pilot is vented and the valve closes firmly.
- **Watch back-pressure**: pressure in the line downstream adds to the setting of a standard valve; vented (atmospherically referenced) valves avoid it.
- **Motors**: a pair of counterbalance valves on a winch or travel motor controls it in both directions (see [[braking-circuits]]).

### Where the energy goes
Lowering a load throttles its whole return flow: the potential energy the load gives up, $m g v$ — 2.6 kW for 1.5 t at 0.175 m/s — plus the pump's energy, becomes heat in the valve and the oil.

> [!warn] Counterbalance valves hold loads on trapped oil. Never loosen a counterbalance valve or any fitting between it and the cylinder while the load is raised: support the load mechanically or lower it, and release the trapped pressure by the maker's procedure. Never adjust the setting below the load pressure — the load will come down by itself. A jet from a pressurised fitting can inject oil through the skin: seek emergency medical care at once.
`,
  ideas: [
    'Overrunning loads pull ahead of the oil; they must be controlled on the oil leaving the actuator.',
    'A counterbalance valve is a relief valve with a free-flow check and a pilot assist from the opposite line.',
    'It opens when load pressure plus R times pilot pressure reaches its setting, and modulates so that the pump\'s flow sets the lowering speed.',
    'Set it about 1.3 times the highest load pressure; low pilot ratios are stable, high ones are efficient.',
    'Mounted on the cylinder with a float-centre valve, it holds, meters, relieves and protects against hose bursts.'
  ],
  pitfalls: [
    'A pilot-operated check does the same job — It is either shut or fully open; on an overrunning load it chatters. Only a counterbalance valve meters the lowering.',
    'A higher pilot ratio is always better because it needs less pilot pressure — High ratios make the load–valve system prone to oscillation; unstable loads need low ratios.',
    'The setting only needs to exceed the static load pressure — Dynamic loads, bounces and back-pressure add to it; about 1.3 times the highest load pressure is the usual rule.'
  ],
  formulas: [
    {
      name: 'Load-holding pressure',
      expr: 'pL = m*g/A', tex: 'p_L = \\dfrac{m\\,g}{A}',
      vars: {
        pL: { name: 'pressure the load makes in the holding chamber (gauge)', q: 'pressure', unit: 'bar', tex: 'p_L' },
        m: { name: 'mass of the load', q: 'mass', unit: 'kg', value: 1500 },
        g: { const: 'g' },
        A: { name: 'area of the holding chamber', q: 'area', unit: 'cm²', value: 31.2 }
      },
      note: 'A vertical cylinder; for a boom, use the force on the cylinder from the geometry instead of m·g. The setting is then about 1.3 p_L.',
      stories: { pL: 'A cylinder whose holding chamber has {A} carries a {m} load vertically. What pressure does the load make?', m: 'A cylinder of {A} must hold its load at no more than {pL}. What is the largest mass?' }
    },
    {
      name: 'Pilot pressure to crack a counterbalance valve',
      expr: 'pX = (ps - pL)/R', tex: 'p_X = \\dfrac{p_s - p_L}{R}',
      vars: {
        pX: { name: 'pilot pressure needed (gauge)', q: 'pressure', unit: 'bar', tex: 'p_X' },
        ps: { name: 'counterbalance setting (gauge)', q: 'pressure', unit: 'bar', value: 65, tex: 'p_s' },
        pL: { name: 'load pressure at the valve (gauge)', q: 'pressure', unit: 'bar', value: 47.2, tex: 'p_L' },
        R: { name: 'pilot ratio', value: 4, min: 1, max: 20 }
      },
      note: 'Back-pressure downstream of a standard (non-vented) valve adds to the setting. Opening the valve wide enough for the flow takes more pilot pressure than cracking it.',
      practice: { unknowns: ['pX', 'ps'] },
      stories: { pX: 'A counterbalance valve set to {ps} with a {R}:1 pilot ratio holds a load at {pL}. What pilot pressure cracks it?', ps: 'With a {R}:1 pilot ratio and a load pressure of {pL}, the valve should crack at {pX} of pilot pressure. What is its setting?' }
    },
    {
      name: 'Rod-end pressure when lowering starts',
      expr: 'pB = (ps - pL)/(R + 1/phi)', tex: 'p_B = \\dfrac{p_s - p_L}{R + 1/\\varphi}',
      vars: {
        pB: { name: 'rod-end (pilot) pressure (gauge)', q: 'pressure', unit: 'bar', tex: 'p_B' },
        ps: { name: 'counterbalance setting (gauge)', q: 'pressure', unit: 'bar', value: 65, tex: 'p_s' },
        pL: { name: 'static load pressure in the cap end (gauge)', q: 'pressure', unit: 'bar', value: 47.2, tex: 'p_L' },
        R: { name: 'pilot ratio', value: 4, min: 1, max: 20 },
        phi: { name: 'area ratio A₁/A₂', value: 1.48, min: 1, max: 5, tex: '\\varphi' }
      },
      note: 'The rod-end pressure pilots the valve and also pushes on the annulus, raising the cap-end pressure by p_B/φ. Friction neglected.',
      stories: { pB: 'A cylinder with area ratio {phi} holds its load at {pL} through a counterbalance valve set to {ps} with a {R}:1 pilot. What rod-end pressure starts the lowering?' }
    }
  ],
  examples: [
    {
      title: 'Setting a boom valve',
      q: 'An excavator boom cylinder sees at most 180 bar in its holding chamber. Choose the counterbalance setting, and find the pilot pressure needed to crack it with a 4:1 pilot ratio when the boom is lowered with a load pressure of 120 bar.',
      steps: [
        'Setting: $1.3 \\times 180 = 234$ bar; round to 235 bar.',
        { text: 'Pilot pressure to crack at 120 bar of load pressure:', tex: 'p_X = \\dfrac{235 - 120}{4} = 28.8\\ \\mathrm{bar}' },
        'At the heaviest load (180 bar) only $(235 - 180)/4 = 14$ bar is needed; with an empty bucket the pump must work harder to lower the boom.'
      ],
      a: 'Set to about 235 bar; about 29 bar of pilot pressure cracks it at 120 bar of load pressure.'
    },
    {
      title: 'Lowering a 1.5 t load',
      q: 'A 63/36 cylinder ($A_1 = 31.2$ cm², φ = 1.48) holds 1500 kg vertically through a counterbalance valve set to 65 bar with a 4:1 pilot. Find the load pressure, the rod-end pressure at which lowering starts, and the heat made while lowering at 0.175 m/s.',
      steps: [
        'Load pressure: $p_L = 1500 \\times 9.81/3.12\\times10^{-3} = 4.72\\times10^6$ Pa = 47.2 bar. The setting is $65/47.2 = 1.38$ times it — within the rule.',
        { text: 'Rod-end pressure to start lowering:', tex: 'p_B = \\dfrac{65 - 47.2}{4 + 1/1.48} = \\dfrac{17.8}{4.68} = 3.8\\ \\mathrm{bar}' },
        'To open the valve far enough for the flow takes more — about 19 bar in the simulation\'s valve.',
        'The load gives up $m g v = 1500 \\times 9.81 \\times 0.175 = 2.6$ kW of potential energy, all turned into heat, plus the pump\'s own power.'
      ],
      a: '47 bar; lowering starts at about 4 bar at the rod end; about 2.6 kW plus the pump power becomes heat.'
    }
  ],
  quiz: [
    { q: 'What is an overrunning load?', choices: ['A load heavier than the relief setting allows', 'A load that pulls the actuator in the direction it is moving', 'A load that moves faster than the pump can deliver', 'A load on a motor only'], a: 1,
      why: 'An overrunning (negative) load drives the actuator — gravity on a descending boom, a vehicle going downhill — so it must be restrained on the outflow.' },
    { q: 'The highest load pressure on a cylinder is 150 bar. A sensible counterbalance setting is about…', choices: ['120 bar', '150 bar', '195 bar', '300 bar'], a: 2,
      why: 'About 1.3 × 150 = 195 bar: high enough that the load and its bounces cannot open the valve, not so high that lowering wastes excessive energy.' },
    { q: 'A counterbalance valve is set to 200 bar with an 8:1 pilot ratio, and the load pressure is 120 bar. What pilot pressure cracks it?', answer: 10, unit: 'bar', tol: 0.02,
      why: 'p_X = (200 − 120)/8 = 10 bar.' },
    { q: 'Compared with 8:1, a 3:1 pilot ratio makes the lowering of an unstable load…', choices: ['less stable but more efficient', 'more stable but less efficient', 'faster', 'impossible'], a: 1,
      why: 'A low ratio makes the valve less sensitive to pilot-pressure swings, damping oscillations, at the cost of more pilot pressure and heat.' },
    { q: 'A counterbalance valve belongs at the directional valve, where it is easy to reach.', a: false,
      why: 'It belongs on the cylinder or motor port, so that it still holds the load if a hose between them bursts.' }
  ],
  problems: [
    { q: 'An 80 mm cylinder (A₁ = 50.3 cm²) holds a 4 t load vertically. What is the load pressure, and what counterbalance setting follows from the 1.3 rule? Give the setting.', answer: 101.4, unit: 'bar', tol: 0.03,
      steps: ['$p_L = 4000 \\times 9.81/5.03\\times10^{-3} = 7.80\\times10^6$ Pa = 78.0 bar.', 'Setting: $1.3 \\times 78.0 = 101.4$ bar — about 100 bar.'] }
  ],
  applications: ['Boom, arm and hoist cylinders of excavators, cranes, telehandlers and aerial platforms.', 'Winch and slewing motors, with dual counterbalance valves controlling both directions.', 'Hydrostatic travel drives going downhill.', 'Vertical press rams and lifting tables that would otherwise fall under their own weight.'],
  sim: 'valve-counterbalance'
}

// ---- end of concepts
);
