/* HYPER-PNEUMATICS · content/sequences-safety.js
 * Pneumatic Circuits → Sequences (displacement–step diagrams, notation, signal overlap, the cascade
 * method, step sequencers) and Safety circuits (two-hand control, emergency stop, soft start);
 * Safety and Maintenance → pneumatic safety, ISO 4414, pressure equipment, noise, maintenance and
 * troubleshooting. Simulations in sims/sequences-safety.js (prefix seq-).
 */
Hyper.add(

/* ================================================================ SEQUENCES */
{
  id: 'displacement-step-diagram', parent: 'sequences', title: 'Displacement–step diagrams', level: 1,
  short: 'A chart of a machine\'s motion: every cylinder\'s position drawn against the steps of the sequence (or against time), with the start and limit-valve signals underneath — the drawing in which pneumatic sequences are specified, checked and debugged.',
  keywords: ['displacement-step diagram', 'displacement-time diagram', 'motion diagram', 'function diagram', 'sequence chart', 'step', 'cycle', 'limit valve', 'signal line', 'VDI 3260', 'GRAFCET', 'timing diagram'],
  prereq: ['pneumatic-cylinder', 'direct-control', 'memory-circuits'],
  related: ['sequence-notation', 'signal-overlap', 'cascade-method', 'shift-register', 'cylinder-speed-pneu', 'plc-control', 'hydraulics:sequencing-circuit', 'electronics:state-machines'],
  body: `
"Clamp the part, drill it, pull the drill out, unclamp" is clear enough in words until someone asks what happens if the clamp is still moving when the drill starts, or which switch tells the drill to go. A **displacement–step diagram** answers such questions at a glance. It is the first thing to draw for any machine with more than one cylinder — before a single valve is chosen.

### How it is drawn
Each cylinder gets a row with two horizontal lines: the lower one is **retracted (0)**, the upper one **extended (1)**. The horizontal axis is divided into **steps**, numbered 1, 2, 3 … A move is a sloping line across one step; a cylinder standing still is a horizontal line. Two cylinders that move in the same step move together. The last step line is the first one again — the machine is back where it started, ready for the next cycle — so a four-move sequence has five step lines, the fifth identical to the first.

The rows are labelled with the cylinder names (A, B, C in teaching; codes like 1A1, 2A1 on a formal circuit diagram), and beside each row it helps to write what the cylinder does: *clamp*, *feed*, *eject*.

### Signals underneath
Below the motion rows go the **signals**: the start button and the limit valves that report each end position — $a_0$ when A is retracted, $a_1$ when it is extended. Each is drawn as a bar that is high while the valve is actuated. Arrows (signal lines) run from a signal to the move it starts: at the end of step 1, $a_1$ is reached and starts B's stroke in step 2. Read this way, the diagram *is* the control logic: every move is started by the signal that confirms the move before it.

The signal bars also show trouble early. If the signal that commands one move of a cylinder is still high when the opposite move of the same cylinder is wanted, the two commands collide — [[signal-overlap]] — and you can see it in the diagram before building anything.

### Against time
The **displacement–time diagram** draws the same motion with each step as wide as it takes. The time for a step is the valve's response and the pressure build-up plus the stroke over the mean speed:

$$t = t_0 + \\frac{s}{\\bar{v}}$$

| Step | Move | Stroke | Mean speed | Time |
|---|---|---|---|---|
| 1 | A+ clamp | 50 mm | 0.25 m/s | 0.23 s |
| 2 | B+ drill feed | 100 mm | 0.05 m/s | 2.03 s |
| 3 | B− drill return | 100 mm | 0.40 m/s | 0.28 s |
| 4 | A− unclamp | 50 mm | 0.30 m/s | 0.20 s |

with $t_0 = 30$ ms each. The whole sequence takes 2.74 s, three quarters of it in the drill feed — so that is where to look first if the machine must run faster. The steps where nothing moves (loading, a dwell for glue to set) are drawn as flat stretches.

> [!key] One row per cylinder, one column per step, signals underneath: every move starts on the signal that confirms the move before it. Draw this before the circuit.

> [!note] The conventions were fixed by the German guideline VDI 3260 (1977, since withdrawn but still taught everywhere). The modern language for sequential control is GRAFCET (IEC 60848:2013), close cousin of the sequential function charts of PLCs; the displacement–step diagram remains the quickest sketch of what a pneumatic machine does.
`,
  ideas: [
    'Each cylinder has a row between retracted (0) and extended (1); the horizontal axis is divided into steps.',
    'A sloping line is a move, a horizontal line is standing still; moves in the same column happen together.',
    'The last step line equals the first: the diagram shows one closed cycle.',
    'Limit-valve signals are drawn underneath as bars; each move is started by the signal that confirms the previous move.',
    'The displacement–time version draws each step as long as it takes: t = t₀ + s/v̄.'
  ],
  pitfalls: [
    'The step diagram shows how long each move takes — In a displacement–step diagram every step has the same width; only the displacement–time diagram is drawn to time.',
    'A limit valve gives a short pulse when the cylinder arrives — An ordinary roller limit valve stays actuated for as long as the cylinder stays at that end, which is exactly why signals can overlap later in the sequence.',
    'The diagram is a nicety for documentation — It is a design tool: overlaps, parallel moves and the slowest step are visible in it before any valve is chosen.'
  ],
  formulas: [
    {
      name: 'Time for one step',
      expr: 't = t0 + s/v', tex: 't = t_0 + \\dfrac{s}{\\bar{v}}',
      vars: {
        t: { name: 'time for the step', q: 'time', unit: 's' },
        t0: { name: 'response time (valve switching and pressure build-up)', q: 'time', unit: 'ms', value: 30, tex: 't_0' },
        s: { name: 'stroke', q: 'length', unit: 'mm', value: 100 },
        v: { name: 'mean speed over the stroke', q: 'speed', unit: 'm/s', value: 0.4, tex: '\\bar{v}' }
      },
      note: 'The mean speed includes the acceleration and the cushioned end of the stroke; the response time is typically 10–50 ms for a pilot-operated valve and a short tube.',
      practice: { unknowns: ['t', 'v'] },
      stories: { t: 'A cylinder with a stroke of {s} moves at a mean {v}, and the valve and the pressure build-up take {t0}. How long is the step?', v: 'A step with a stroke of {s} must be over in {t}, with {t0} of response. What mean speed is needed?' }
    },
    {
      name: 'Output of a machine',
      expr: 'n = 1/(T + tl)', tex: 'n = \\dfrac{1}{T + t_l}',
      vars: {
        n: { name: 'cycles (parts) per hour', q: 'rate', unit: '1/h' },
        T: { name: 'sequence time, the sum of the steps', q: 'time', unit: 's', value: 2.74 },
        tl: { name: 'loading and dwell time outside the moves', q: 'time', unit: 's', value: 2, tex: 't_l' }
      },
      note: 'One part per cycle. Steps that run in parallel count once.',
      practice: { unknowns: ['n', 'T'] },
      stories: { n: 'A station\'s moves take {T} in total and loading adds {tl}. How many parts an hour can it make?', T: 'A station must make {n}, and loading takes {tl}. How long may the moves take in total?' }
    }
  ],
  examples: [
    {
      title: 'Timing a clamp-and-drill station',
      q: 'A clamp A (stroke 50 mm) and a drill feed B (stroke 100 mm) run A+ B+ B− A−. Mean speeds: A+ 0.25 m/s, B+ 0.05 m/s (the feed is slowed by a hydraulic check unit), B− 0.40 m/s, A− 0.30 m/s; every step adds 30 ms of response. Loading takes 2 s. How long is a cycle, and how many parts an hour?',
      steps: [
        'A+: $0.03 + 0.05/0.25 = 0.23$ s. B+: $0.03 + 0.1/0.05 = 2.03$ s.',
        'B−: $0.03 + 0.1/0.4 = 0.28$ s. A−: $0.03 + 0.05/0.3 = 0.20$ s.',
        'Sequence: $T = 0.23 + 2.03 + 0.28 + 0.20 = 2.74$ s; with loading, 4.74 s per part.',
        '$n = 1/4.74\\ \\mathrm{s} = 0.211$ per second $= 760$ parts an hour. The drill feed alone is 74 % of the sequence.'
      ],
      a: 'About 4.74 s a cycle, 760 parts an hour; speeding up the drill feed is the only change that matters much.'
    },
    {
      title: 'Reading a diagram',
      q: 'In a diagram with three rows, A rises in step 1 and falls in step 6; B rises in step 2 and falls in step 5; C rises in step 3 and falls in step 4. Write the sequence and the signal that starts each move.',
      steps: [
        'Reading the columns left to right: A+ B+ C+ C− B− A−.',
        'Each move starts on the signal that confirms the move before it: B+ on $a_1$, C+ on $b_1$, C− on $c_1$, B− on $c_0$, A− on $b_0$.',
        'The first move follows the last one of the previous cycle: A+ on start AND $a_0$.'
      ],
      a: 'A+ B+ C+ C− B− A−, started by start·a₀, a₁, b₁, c₁, c₀, b₀.'
    }
  ],
  quiz: [
    { q: 'In a displacement–step diagram, a horizontal line in a cylinder\'s row means that the cylinder…', choices: ['is standing still at one end', 'is moving at constant speed', 'is half-way through its stroke', 'has lost its air supply'], a: 0,
      why: 'A move is a sloping line across a step; a horizontal line on the 0 or 1 level is a cylinder waiting at that end.' },
    { q: 'A sequence of four moves is drawn with how many step lines?', choices: ['4', '5, the last one the same as the first', '8', '2 per cylinder'], a: 1,
      why: 'Each move occupies the space between two step lines; after the fourth move the machine is back at its starting state, drawn as a fifth line that equals the first.' },
    { q: 'A displacement–step diagram shows how long each move takes.', a: false,
      why: 'All steps are drawn the same width. To see durations, draw the displacement–time diagram, where each step is as wide as it takes.' },
    { q: 'A drill feed of 120 mm runs at a mean 0.06 m/s, with 30 ms of response time. How long is the step?', answer: 2.03, unit: 's', tol: 0.02,
      why: '$t = 0.03 + 0.12/0.06 = 2.03$ s.' },
    { q: 'In the diagram, the move B+ is started by…', choices: ['the signal confirming the move before it (for example a₁)', 'the start button, always', 'b₁', 'a timer'], a: 0,
      why: 'The chain of the sequence is that each move starts when the previous one is confirmed by its limit valve; b₁ is only reached after B+ is complete.' }
  ],
  problems: [
    { q: 'A station runs moves of 0.35, 0.42, 0.30 and 0.28 s in sequence, and loading takes 1.6 s. How many parts can it make an hour?', answer: 1220, unit: '1/h', tol: 0.02,
      steps: ['Sequence: $0.35 + 0.42 + 0.30 + 0.28 = 1.35$ s; cycle 2.95 s.', '$n = 3600/2.95 = 1220$ parts an hour.'] }
  ],
  applications: ['Specifying a new assembly or packaging station before the circuit is drawn.', 'Checking a proposed circuit for signal overlaps.', 'Finding the bottleneck step when a machine must run faster.', 'Commissioning and fault-finding: comparing what the machine does with what the diagram says.'],
  history: 'Motion diagrams of this kind grew up with cam-driven machines, whose cam charts showed each follower\'s lift against the rotation of the camshaft. Pneumatic automation took over the idea in the 1950s and 60s, and VDI 3260 (1977) standardised the symbols for signals and signal lines.',
  sim: 'seq-step-diagram'
},

{
  id: 'sequence-notation', parent: 'sequences', title: 'Sequence notation: A+ B+ A− B−', level: 1,
  short: 'A compact way to write what a pneumatic machine does: capital letters for cylinders, + for extending and − for retracting, limit valves a₀, a₁, b₀, b₁ for the end positions — and from it the signal that starts every move.',
  keywords: ['sequence notation', 'A+ B+', 'cylinder sequence', 'limit valve', 'a0 a1', 'signal equation', 'start condition', 'parallel moves', 'cycle', 'sequence', 'motion sequence'],
  prereq: ['displacement-step-diagram', 'pneumatic-cylinder', 'logic-functions'],
  related: ['signal-overlap', 'cascade-method', 'shift-register', 'direct-control', 'electronics:logic-gates'],
  body: `
A machine's whole motion fits on one line. Name the cylinders A, B, C…, write **+** for extending and **−** for retracting, and list the moves in order:

$$\\text{A+ B+ A− B−}$$

reads "A extends, then B extends, then A retracts, then B retracts, and the cycle repeats". Every letter appears with both signs, because a machine that repeats must bring each cylinder back.

### The pieces of the notation
- **Limit valves** report the ends of each stroke: $a_0$ (A retracted) and $a_1$ (A extended), $b_0$, $b_1$ and so on. On a formal circuit diagram the same parts carry codes like 1S1, 1S2.
- **Parallel moves** are bracketed or stacked: (A+ B+) C+ means A and B start together and C waits for both.
- **Repeated moves** are simply written again: A+ A− A+ A− B+ B− punches twice before ejecting.
- **Timed waits** are written in place: A+ (2 s) A− holds a glued joint for two seconds.
- **Groups** for the [[cascade-method]] are separated by slashes: A+ B+ / B− A−.

### From notation to signals
The sequence says what the logic must do. Each move is started by the signal that confirms the move before it; the first move of the cycle by the start button AND the confirmation of the last move. For A+ B+ A− B−:

| Move | Started by | Meaning |
|---|---|---|
| A+ | start · $b_0$ | cycle start, once B is home |
| B+ | $a_1$ | A has extended |
| A− | $b_1$ | B has extended |
| B− | $a_0$ | A is back |

These are **signal equations**: $\\text{A+} = \\text{start}\\cdot b_0$ and so on (· is AND, as in [[logic-functions]]). Wired directly — each limit valve piloting one side of a double-pilot 5/2 valve — this sequence runs. Written in the mirrored order A+ B+ B− A−, the same recipe fails: when A should extend, $b_0$ is also asking it to retract. The notation lets you find that on paper; see [[signal-overlap]].

### How many sequences are there?
With $n$ cylinders that each go out and back once per cycle, a sequence is an order of $2n$ moves in which each cylinder's + comes before its −:

$$N = \\frac{(2n)!}{2^n}$$

Two cylinders allow 6 sequences, three allow 90, four allow 2520. Count the ones that pass through the same set of positions twice with different next moves — which limit valves alone cannot handle — and you find 4 of the 6, 66 of the 90 and 1872 of the 2520: about three in four. That is why methods exist that work for *every* sequence ([[cascade-method]], [[shift-register]]) rather than a trick for each.

> [!tip] Translate the job into notation first, then check each move's start signal against the opposite move of the same cylinder. Five minutes with a pencil saves a morning of re-piping.
`,
  ideas: [
    'Letters are cylinders, + extends and − retracts; the sequence repeats as a cycle.',
    'Limit valves a₀/a₁ confirm the retracted and extended positions of A.',
    'Each move is started by the confirmation of the move before it; the first move also needs the start signal.',
    'Signal equations such as A+ = start·b₀ turn the notation into logic.',
    'With n cylinders going out and back once there are (2n)!/2ⁿ possible sequences.'
  ],
  pitfalls: [
    'a₁ is the valve that makes A extend — a₁ is the valve that reports that A is extended; it starts whatever move comes after A+.',
    'Any sequence can be wired by connecting each limit valve to the next valve\'s pilot — Only sequences without signal overlap can; mirrored sequences such as A+ B+ B− A− jam.',
    'Parallel moves happen at exactly the same moment — (A+ B+) only starts them together; the next move must wait for both confirmations (a₁ AND b₁).'
  ],
  formulas: [
    {
      name: 'Number of possible sequences',
      expr: 'N = fact(2*n)/2^n', tex: 'N = \\dfrac{(2n)!}{2^n}',
      vars: {
        N: { name: 'number of different sequences' },
        n: { name: 'number of cylinders, each out and back once', value: 3, int: true, min: 1, max: 8 }
      },
      note: 'Each cylinder\'s + must come before its −, which divides the (2n)! orders of the moves by 2 for each cylinder. Parallel and repeated moves are not counted.',
      practice: { unknowns: ['N'] },
      stories: { N: 'A machine has {n} cylinders, each extending and retracting once per cycle. How many different sequences could it run?' }
    }
  ],
  examples: [
    {
      title: 'From words to notation',
      q: 'A feed cylinder A pushes a blank from a magazine under a press; a clamp B holds it; the press cylinder C stamps it and returns; the clamp opens and the feed returns. Write the sequence and the start signal of every move.',
      steps: [
        'In order: A+ (feed), B+ (clamp), C+ (stamp), C− (press returns), B− (unclamp), A− (feed returns): A+ B+ C+ C− B− A−.',
        'Start signals: A+ = start·$a_0$ (the last move was A−), B+ = $a_1$, C+ = $b_1$, C− = $c_1$, B− = $c_0$, A− = $b_0$.',
        'Check A+: its opposite, A−, is started by $b_0$ — and B is retracted at the start. Both of A\'s commands are present: this sequence has an overlap and needs a [[cascade-method|cascade]] or a sequencer.'
      ],
      a: 'A+ B+ C+ C− B− A−, with start signals start·a₀, a₁, b₁, c₁, c₀, b₀ — and an overlap at A+.'
    }
  ],
  quiz: [
    { q: 'What does A+ B+ A− B− describe?', choices: ['A extends, B extends, A retracts, B retracts', 'A and B extend together, then both retract', 'A extends twice', 'B moves only when A is retracted'], a: 0,
      why: 'Moves are listed in the order they happen; + is extend and − is retract.' },
    { q: 'Which limit valve confirms that B has extended?', choices: ['b₁', 'b₀', 'a₁', 'the start button'], a: 0,
      why: 'Index 1 marks the extended end, 0 the retracted end.' },
    { q: 'In A+ B+ A− B−, which signal starts B−?', choices: ['a₀', 'a₁', 'b₁', 'start'], a: 0,
      why: 'B− follows A−, so it starts when A is confirmed back: a₀.' },
    { q: 'How many different sequences can three cylinders run if each goes out and back once per cycle?', answer: 90, tol: 0.001,
      why: '$6!/2^3 = 720/8 = 90$.' },
    { q: '(A+ B+) C+ means that C starts as soon as either A or B has finished its stroke.', a: false,
      why: 'C+ must wait for both parallel moves to be confirmed: its start signal is a₁ AND b₁.' }
  ],
  applications: ['Writing the specification of a new machine in one line.', 'Deriving the logic (signal equations) for pneumatic, relay or PLC control.', 'Checking a sequence for overlaps before the circuit is drawn.'],
  sim: { id: 'seq-step-diagram', params: { seq: 'A+ B+ C+ C- B- A-' } }
},

{
  id: 'signal-overlap', parent: 'sequences', title: 'Signal overlap', level: 2,
  short: 'Why A+ B+ B− A− jams when limit valves pilot the main valves directly: a signal still present from an earlier step holds a double-pilot valve against the opposite command. The positions of the machine repeat with different next moves, so something must remember.',
  keywords: ['signal overlap', 'opposing signals', 'blocked signal', 'trapped signal', 'jam', 'idle return roller', 'one-way trip valve', 'overriding signal', 'signal cut-off', 'double pilot valve', 'impulse valve'],
  prereq: ['sequence-notation', 'memory-circuits', 'displacement-step-diagram'],
  related: ['cascade-method', 'shift-register', 'time-delay-valve', 'valve-operation', 'plc-control', 'electronics:state-machines'],
  body: `
Pipe the sequence **A+ B+ B− A−** the obvious way — each limit valve pilots one side of a double-pilot 5/2 valve — press start, and nothing happens. No leak, no fault: the circuit is logically impossible.

### Where it jams
A double-pilot (impulse) valve moves only when one pilot is pressurised and the other is not; with both pressurised its spool feels equal forces and stays where it is. Now list, for each move, the signal that starts it and the signal that commands the *opposite* move of the same cylinder:

| Move | Started by | Opposite command at that moment | Result |
|---|---|---|---|
| A+ | start · $a_0$ | A− is piloted by $b_0$ — ON, B is retracted | **blocked** |
| B+ | $a_1$ | B− is piloted by $b_1$ — off | runs |
| B− | $b_1$ | B+ is piloted by $a_1$ — ON, A is still out | **blocked** |
| A− | $b_0$ | A+ is piloted by start · $a_0$ — off | runs |

Two overlaps: $b_0$, which is needed at the end to retract A, is held all through the start; and $a_1$, which extended B, is still held when B must come back. In the [[displacement-step-diagram]] the bars of both commands of one cylinder are high in the same step.

### The deeper reason
After A+ the machine is in the state (A out, B in). After B− it is in *exactly the same state* — and the next move is different (B+ the first time, A− the second). Limit valves only see positions, so no wiring of them alone can tell the two moments apart. The circuit needs **memory** of where it is in the sequence. Sequences whose second half repeats the first in the same order (A+ B+ A− B−, A+ B+ C+ A− B− C−) never revisit a state and run on limit valves alone; mirrored ones (A+ B+ B− A−, A+ B+ C+ C− B− A−) always overlap.

### Ways out
- **Idle-return (one-way trip) rollers.** The roller folds when the cam passes one way and trips the valve only the other way, and it sits a few millimetres short of the end, so the signal is a short pulse instead of a lasting one. Cheap, but the pulse lasts only $t_p = L/v$ — 12 ms for a 6 mm cam at 0.5 m/s, about what a valve needs to switch — and the end position is never actually confirmed.
- **Cutting the signal** with a time-delay valve or a pulse shortener: fragile, sensitive to pressure and temperature.
- **Differential pilots**: a larger pilot area on one side gives that command priority, $F = p_{14}A_{14} - p_{12}A_{12}$. It works only where the same side must always win.
- **Memory**: the [[cascade-method]] switches off whole groups of signals; a [[shift-register|step sequencer]] keeps one memory per step; a [[plc-control|PLC]] does the same in software. These are the real cures.

> [!warn] A jammed sequence is a machine full of pressurised air waiting for a signal. Operating valves by hand to "help it along" can release a move at full force; exhaust and lock out before reaching in.
`,
  ideas: [
    'A double-pilot valve with both pilots pressurised does not move: equal forces, no switching.',
    'Overlap: the signal commanding one move of a cylinder is still present when the opposite move is wanted.',
    'In A+ B+ B− A−, b₀ blocks A+ at the start and a₁ blocks B− at step 3.',
    'The root cause is a repeated machine state with different next moves: the logic needs memory.',
    'One-way rollers give pulses of length L/v; cascades, sequencers and PLCs remove the problem properly.'
  ],
  pitfalls: [
    'A stronger or higher-pressure signal will push the valve over — With equal pilot areas the forces cancel whatever the pressure; only a signal that is switched off, or deliberately unequal areas, lets the other win.',
    'Idle-return rollers are a clean fix — Their pulse shrinks as the cylinder speeds up, and they never confirm that the end position is actually reached; they are a patch, not a design.',
    'Overlap is a component fault — It is a logical property of the sequence and the wiring; a brand-new circuit built exactly to its diagram jams just the same.'
  ],
  formulas: [
    {
      name: 'Pulse from a one-way roller',
      expr: 'tp = L/v', tex: 't_p = \\dfrac{L}{v}',
      vars: {
        tp: { name: 'length of the signal pulse', q: 'time', unit: 'ms', tex: 't_p' },
        L: { name: 'length of cam travel that holds the roller down', q: 'length', unit: 'mm', value: 6 },
        v: { name: 'cylinder speed as the cam passes', q: 'speed', unit: 'm/s', value: 0.5 }
      },
      note: 'The pulse must last longer than the time the pilot line takes to fill and the valve to switch, typically 10–30 ms. Fast cylinders make one-way rollers unreliable.',
      practice: { unknowns: ['tp', 'v'] },
      stories: { tp: 'A one-way roller is held down over {L} of cam travel by a cylinder moving at {v}. How long is the pulse?', v: 'A valve needs a pulse of {tp} to switch, and the cam holds the roller for {L}. What is the fastest the cylinder may pass?' }
    },
    {
      name: 'Net force on a double-pilot spool',
      expr: 'F = p14*A14 - p12*A12', tex: 'F = p_{14} A_{14} - p_{12} A_{12}',
      vars: {
        F: { name: 'net pilot force towards the 14 side', q: 'force', unit: 'N', signed: true },
        p14: { name: 'pilot pressure at 14 (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_{14}' },
        A14: { name: 'pilot piston area at 14', q: 'area', unit: 'mm²', value: 78.5, tex: 'A_{14}' },
        p12: { name: 'pilot pressure at 12 (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_{12}' },
        A12: { name: 'pilot piston area at 12', q: 'area', unit: 'mm²', value: 50.3, tex: 'A_{12}' }
      },
      note: 'With equal areas and both pilots at supply pressure the force is zero and the spool stays put: the jam of signal overlap. A valve with a larger pilot on one side gives that side priority.',
      practice: { unknowns: ['F', 'p12'] },
      stories: { F: 'A valve has pilot areas of {A14} and {A12}; both pilots see {p14} and {p12}. What net force acts on the spool?' }
    }
  ],
  examples: [
    {
      title: 'Finding the overlaps in A+ B+ C+ C− B− A−',
      q: 'Wire A+ B+ C+ C− B− A− with limit valves feeding the pilots directly. Which moves are blocked, and by which signals?',
      steps: [
        'Start signals: A+ = start·$a_0$, B+ = $a_1$, C+ = $b_1$, C− = $c_1$, B− = $c_0$, A− = $b_0$.',
        'A+ at the start: its opposite A− is piloted by $b_0$, and B is retracted — blocked.',
        'B+ at step 2: B− is piloted by $c_0$, and C is retracted — blocked.',
        'C+ at step 3: C− is piloted by $c_1$ — off. C− at step 4: C+ by $b_1$ — B is still out, blocked.',
        'B− at step 5: B+ by $a_1$ — A is still out, blocked. A− at step 6: A+ by start·$a_0$ — off.'
      ],
      a: 'Four overlaps: A+ (by b₀), B+ (by c₀), C− (by b₁) and B− (by a₁). The mirrored sequence needs memory; a two-group cascade (A+ B+ C+ / C− B− A−) cures all of them.'
    },
    {
      title: 'How fast may a one-way roller be passed?',
      q: 'A main valve needs its pilot pressurised for at least 15 ms to switch. The cam holds a one-way roller down over 5 mm. What is the highest cylinder speed at which the signal still works?',
      steps: ['$t_p = L/v \\ge 15$ ms, so $v \\le L/t_p = 0.005/0.015 = 0.33$ m/s.', 'With a margin for tolerance and wear, keep the cylinder below about 0.25 m/s where it passes the roller — or better, use a cascade.'],
      a: 'At most 0.33 m/s, and in practice rather less.'
    }
  ],
  quiz: [
    { q: 'In A+ B+ B− A− wired with plain limit valves, what stops the first move?', choices: ['b₀ is still piloting A− when start·a₀ pilots A+', 'a₁ is not actuated yet', 'the start button is not connected', 'the supply is too low'], a: 0,
      why: 'At rest B is retracted, so b₀ is actuated and holds valve A on its retract side; the start signal meets an equal opposing force.' },
    { q: 'Which of these sequences runs with limit valves piloting the main valves directly?', choices: ['A+ B+ A− B−', 'A+ B+ B− A−', 'A+ B+ C+ C− B− A−', 'A+ A− B+ B− with rollers only'], a: 0,
      why: 'In A+ B+ A− B− no machine state repeats, so each move\'s opposite command is off when it is needed.' },
    { q: 'A double-pilot 5/2 valve with equal pilot areas has 6 bar on both pilots. It…', choices: ['stays in its last position', 'switches to the 14 side', 'switches to the 12 side', 'moves to a middle position'], a: 0,
      why: 'The forces cancel; the spool is held by friction where it was. That is the jam.' },
    { q: 'A cam holds a one-way roller for 5 mm while the cylinder passes at 0.8 m/s. How long is the pulse, in milliseconds?', answer: 6.25, unit: 'ms', tol: 0.02,
      why: '$t_p = 0.005/0.8 = 6.25$ ms — too short for most valves to switch reliably.' },
    { q: 'Making the pilot lines longer is a reliable way to cure signal overlap.', a: false,
      why: 'Longer lines only delay signals; a signal that is present stays present. Overlap needs the opposing signal removed, which takes memory.' }
  ],
  applications: ['Checking a proposed circuit before building it.', 'Diagnosing a new machine that "does nothing" when started.', 'Choosing between one-way rollers, a cascade, a step sequencer or a PLC.'],
  sim: ['seq-overlap', { id: 'seq-step-diagram', params: { seq: 'A+ B+ B- A-' } }]
},

{
  id: 'cascade-method', parent: 'sequences', title: 'The cascade method', level: 2,
  short: 'A systematic cure for signal overlap: cut the sequence into groups in which no cylinder appears twice, give each group its own supply line, and let a chain of memory valves keep exactly one line alive — every signal of the other groups is then simply dead.',
  keywords: ['cascade', 'cascade method', 'group line', 'group', 'memory valve', 'cascade valve', 'reversing valve', 'A+ B+ B− A−', 'signal overlap', 'sequence', 'pneumatic logic', 'bus line'],
  prereq: ['signal-overlap', 'sequence-notation', 'memory-circuits'],
  related: ['shift-register', 'displacement-step-diagram', 'conductance-series', 'soft-start', 'plc-control', 'hydraulics:sequencing-circuit'],
  body: `
The trouble with [[signal-overlap]] is a signal that is still there when it is no longer wanted. The cascade method removes it at its source: it takes the *air* away from every signal that is not needed now.

### The idea
Cut the sequence into **groups** in which no letter appears twice. Inside a group no cylinder moves both ways, so no overlap can arise inside it. Give each group its own supply line — a **group line** I, II, III — and arrange that only one line is pressurised at a time. Feed every limit valve of a group from its group line. When a line is dead, its limit valves pass nothing, whatever the cams are touching: a signal from another group cannot interfere. The live line is chosen by double-pilot 5/2 or 4/2 **cascade valves**, which are memories; $g$ groups need $g - 1$ of them.

### The recipe
1. Write the sequence and cut it into groups, starting a new group whenever a letter would repeat. If the last group and the first together repeat no letter, merge them — one valve fewer.
2. Draw $g$ group lines and $g-1$ cascade valves.
3. The **first move** of each group is piloted directly by its group line.
4. Each **further move** in a group is piloted by the limit valve that confirms the move before it, fed from the group line.
5. The **last limit valve** of a group, fed from its line, switches the cascade to the next group; the last group's last limit valve, in series with the start valve, switches back to group I.
6. At rest the **last group is live**, so the start signal has air.

### Two groups: A+ B+ / B− A−
| Signal | Fed from | Pilots |
|---|---|---|
| line I | cascade valve | A+ (14 of valve A) |
| $a_1$ | line I | B+ |
| $b_1$ | line I | cascade to line II |
| line II | cascade valve | B− (12 of valve B) |
| $b_0$ | line II | A− |
| $a_0$ · start | line II | cascade to line I |

At rest line II is live and $b_0$ holds A back. Start switches the cascade: line II empties — taking $b_0$'s signal with it — and line I fills and extends A. When B is out, $b_1$ selects line II: line I empties, so $a_1$ can no longer hold B+, and line II retracts B. Both overlaps are gone.

### Three groups: A+ B+ / B− C+ / C− A−
Clamp, drill, withdraw, stamp, release, unclamp. The cascade valves are chained: the first chooses between line I and "the lines after I", the second between II and III.

| Group | First move (from the line) | Next | Group change |
|---|---|---|---|
| I | A+ | $a_1$ → B+ | $b_1$ → line II (both valves) |
| II | B− | $b_0$ → C+ | $c_1$ → line III (second valve) |
| III | C− | $c_0$ → A− | $a_0$ · start → line I (first valve) |

### The price
A signal to a far group passes through several valves in series, and small valves in series add up: with $n$ equal valves the equivalent [[sonic-conductance]] falls to $C/\\sqrt{n}$. Every group change also empties one line and fills another before anything moves — tens of milliseconds, and a little air each time. Cascades are neat up to about four groups; beyond that a [[shift-register|step sequencer]] or a PLC is simpler to build and to find faults in.

> [!key] No letter twice in a group; one line per group; $g-1$ memory valves; every signal fed from its own group line; the last group live at rest.

> [!warn] Cascade valves remember their group through an air failure. After an emergency stop or maintenance the machine may try to resume mid-sequence when the air returns: provide a reset that brings the cylinders home and sets the last group, and restore the pressure through a [[soft-start]] valve.
`,
  ideas: [
    'Groups contain no letter twice, so there is no overlap inside a group.',
    'Only one group line is live at a time; signals are fed from their group line, so the other groups\' signals are dead.',
    'g groups need g − 1 cascade (memory) valves; merge the last and first groups when they share no letter.',
    'The first move of a group is piloted by the line itself; the last limit valve of a group switches to the next group.',
    'Series valves slow the signals to far groups: C_eq = C/√n. Beyond about four groups use a sequencer or a PLC.'
  ],
  pitfalls: [
    'Each limit valve can be fed from the main supply — Then its signal is always alive and the overlap returns; the point of the method is that each signal is fed from its own group line.',
    'The number of groups equals the number of cylinders — It depends on the order of the moves: A+ B+ C+ C− B− A− needs only two groups, A+ B+ B− C+ C− A− needs three.',
    'A cascade restarts cleanly after an air failure — Its valves are memories and keep their last group; it needs a deliberate reset.'
  ],
  formulas: [
    {
      name: 'Cascade valves in series',
      expr: 'Ceq = C/sqrt(g - 1)', tex: 'C_\\text{eq} = \\dfrac{C}{\\sqrt{g - 1}}',
      vars: {
        Ceq: { name: 'sonic conductance of the path to the last group', q: 'flowcond', unit: 'dm³/(s·bar)', tex: 'C_\\text{eq}' },
        C: { name: 'sonic conductance of one cascade valve', q: 'flowcond', unit: 'dm³/(s·bar)', value: 0.4 },
        g: { name: 'number of groups', value: 3, int: true, min: 2, max: 8 }
      },
      note: 'Conductances in series combine as 1/C² = Σ 1/Cᵢ²; the last group\'s air passes all g − 1 valves. The critical pressure ratio of the chain is ignored here.',
      practice: { unknowns: ['Ceq', 'C'] },
      stories: { Ceq: 'A cascade of {g} groups is built from valves of {C} each. What is the conductance of the path to the last group line?', C: 'The path to the last of {g} group lines must have at least {Ceq}. How large must each cascade valve be?' }
    },
    {
      name: 'Filling a group line',
      expr: 't = V*dp/(pr*C*p1)', tex: 't = \\dfrac{V\\,\\Delta p}{p_\\text{ref}\\,C\\,p_1}',
      vars: {
        t: { name: 'time until the pilots switch', q: 'time', unit: 'ms' },
        V: { name: 'volume of the line and the pilot chambers', q: 'volume', unit: 'mL', value: 16 },
        dp: { name: 'pressure at which the pilots switch (gauge)', q: 'pressure', unit: 'bar', value: 2.5, tex: '\\Delta p' },
        C: { name: 'sonic conductance of the path', q: 'flowcond', unit: 'dm³/(s·bar)', value: 0.28 },
        p1: { name: 'supply pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.0, tex: 'p_1' },
        pr: { name: 'reference pressure of free air (ANR)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_\\text{ref}' }
      },
      note: 'Choked flow of Cp₁ free air per second into the line, isothermal filling. A first estimate: fast filling heats the air and runs a little quicker, and the flow is no longer choked near the end.',
      practice: { unknowns: ['t', 'V'] },
      stories: { t: 'A group line and its pilots hold {V}; the pilots switch at {dp} and the path has {C} from a supply of {p1}. How long before the first move of the group starts?' }
    }
  ],
  examples: [
    {
      title: 'A two-group cascade for A+ B+ B− A−',
      q: 'Design the cascade for A+ B+ B− A−: groups, valves and the signal of every move.',
      steps: [
        'Groups: A+ B+ / B− A− (a new group at B−, because B already appears). Merging the last with the first would repeat A, so $g = 2$ and one cascade valve.',
        'Line I pilots A+ directly. $a_1$, fed from line I, pilots B+. $b_1$, fed from line I, switches the cascade to line II.',
        'Line II pilots B− directly. $b_0$, fed from line II, pilots A−. $a_0$ in series with the start valve, fed from line II, switches back to line I.',
        'At rest line II is live. When the cascade switches to line I, line II empties and $b_0$ loses its air: A+ is no longer blocked.'
      ],
      a: 'Two groups, one 5/2 double-pilot cascade valve, four limit valves and a start valve.'
    },
    {
      title: 'Three groups: clamp, drill, stamp',
      q: 'Group A+ B+ B− C+ C− A− and say how many cascade valves it needs and what switches each group.',
      steps: [
        'Cut where a letter would repeat: A+ B+ / B− C+ / C− A−.',
        'Merge last and first? C− A− A+ B+ repeats A: no. So $g = 3$, two cascade valves.',
        'Group changes: $b_1$ (from line I) selects line II; $c_1$ (from line II) selects line III; $a_0$·start (from line III) selects line I.',
        'Within groups: $a_1$ → B+ (line I), $b_0$ → C+ (line II), $c_0$ → A− (line III); A+, B− and C− come straight from their lines.'
      ],
      a: 'Three groups, two cascade valves.'
    },
    {
      title: 'How long does a group change take?',
      q: 'A group line of 3 m of tube with a 2.5 mm bore feeds pilots with 1.3 mL of volume. It is supplied through two cascade valves of C = 0.4 dm³/(s·bar) each from 6 bar gauge, and the pilots switch at 2.5 bar. Estimate the delay.',
      steps: [
        'Volume: $\\pi/4 \\times 0.0025^2 \\times 3 = 14.7$ mL, plus 1.3 mL: 16 mL.',
        'Two valves in series: $C_\\text{eq} = 0.4/\\sqrt{2} = 0.283$ dm³/(s·bar).',
        'Free air needed: $16 \\times 2.5/1 = 40$ mL; flow $0.283 \\times 7.01 = 1.98$ dm³/s.',
        '$t = 0.040/1.98 = 0.020$ s.'
      ],
      a: 'About 20 ms per group change — negligible here, but it grows with long lines, small valves and many groups.'
    }
  ],
  quiz: [
    { q: 'How many groups does A+ B+ C+ C− B− A− need?', choices: ['2: A+ B+ C+ / C− B− A−', '3', '6', 'none, it has no overlap'], a: 0,
      why: 'Cut where a letter would repeat: after C+, because C− follows. The two halves each contain every letter once; one cascade valve suffices.' },
    { q: 'How many cascade valves does A+ B+ B− C+ C− A− need?', answer: 2, tol: 0.001,
      why: 'Groups A+ B+ / B− C+ / C− A−; the last and first cannot be merged (A would repeat), so g = 3 and g − 1 = 2 valves.' },
    { q: 'In a cascade, the limit valve that ends group I is fed from…', choices: ['group line I', 'group line II', 'the main supply', 'the start valve'], a: 0,
      why: 'Every signal of a group is fed from that group\'s line, so it can only act while the group is live.' },
    { q: 'A+ A− B+ B− grouped naively gives A+ / A− B+ / B−. How many groups remain after merging the last with the first?', answer: 2, tol: 0.001,
      why: 'B− A+ repeats no letter, so the last and first groups merge: (B− A+) / (A− B+) — two groups, one cascade valve; the start then gates A+ inside its group.' },
    { q: 'Four equal cascade valves lie in series in the path to the last group. The path has…', choices: ['half the conductance of one valve', 'a quarter of it', 'the same conductance', 'four times it'], a: 0,
      why: '$1/C_\\text{eq}^2 = 4/C^2$, so $C_\\text{eq} = C/2$.' }
  ],
  problems: [
    { q: 'A cascade of 4 groups uses valves with C = 0.5 dm³/(s·bar). What is the sonic conductance of the path to the last group line?', answer: 0.289, unit: 'dm³/(s·bar)', tol: 0.02,
      steps: ['The last line passes $g - 1 = 3$ valves.', '$C_\\text{eq} = 0.5/\\sqrt{3} = 0.289$ dm³/(s·bar).'] }
  ],
  applications: ['All-pneumatic machines in explosive atmospheres, where electrical control is costly.', 'Simple assembly and packaging stations with two or three cylinders.', 'Training rigs, where the method teaches sequential logic in a form you can see and hear.'],
  history: 'The cascade method was developed in the 1950s and 60s, when all-air logic was the cheapest way to automate; it is still taught because it makes the idea of state — which group are we in? — visible as air in a pipe.',
  sim: 'seq-cascade'
},

{
  id: 'shift-register', parent: 'sequences', title: 'Step sequencers and shift registers', level: 2,
  short: 'One memory module per step, chained so that only one step is active at a time: each module sets when the previous step is active and its confirming signal arrives, gives its command and resets the step before. Overlap cannot occur, any sequence can be built, and the PLC does the same in software.',
  keywords: ['step sequencer', 'shift register', 'stepper module', 'sequence module', 'step chain', 'pneumatic sequencer', 'PLC', 'sequential function chart', 'SFC', 'GRAFCET', 'step bit', 'state machine', 'reset'],
  prereq: ['cascade-method', 'memory-circuits', 'logic-functions'],
  related: ['plc-control', 'displacement-step-diagram', 'signal-overlap', 'sensors-pneu', 'electronics:shift-registers', 'electronics:state-machines'],
  body: `
The [[cascade-method|cascade]] divides a sequence into groups; a **step sequencer** goes all the way and gives *every step* its own memory. The machine's state is then simply "which module is set" — a single token passing along a chain, exactly like the bit in an electronic [[electronics:shift-registers|shift register]] or the state of a [[electronics:state-machines|finite state machine]].

### How a module works
Each module holds a small memory valve and two logic elements. It **sets** when the previous module is active AND its transition signal — the limit valve confirming the previous move — is present. When it sets, it gives its **output** (the command for its move), **resets** the module before it and **enables** the next. So exactly one module is active in normal running, and exactly one command reaches the main valves at a time: no double-pilot valve ever sees both of its pilots, and [[signal-overlap]] cannot occur.

Commercial modules stack on a common base. The chain connections — enable, reset, supply — run through the base; only the transition inputs and the command outputs are piped. The last module's enable loops back to the first. A **reset** input sets the final module and clears the others, so the machine starts from a known home step.

### A+ B+ B− A− on four modules
| Module | Sets when | Output |
|---|---|---|
| 1 | module 4 active · start · $a_0$ | A+ |
| 2 | module 1 active · $a_1$ | B+ |
| 3 | module 2 active · $b_1$ | B− |
| 4 | module 3 active · $b_0$ | A− |

Four modules for four steps. A sequence with repeated moves (A+ A− A+ A− B+ B−) or branches is built the same way — a module per step — where a cascade would need many groups.

### Which method when?
| Method | Extra parts | Handles | Fault-finding |
|---|---|---|---|
| Limit valves only | none | sequences that never repeat a state | poor |
| One-way rollers | special rollers | slow, simple machines | poor: ends not confirmed |
| Cascade | $g-1$ memory valves | any sequence; best to ~4 groups | the live group line |
| Step sequencer | one module per step | any sequence, long ones too | an indicator on each step |
| PLC | inputs, outputs, program | anything; changed in software | the active step on a screen |

### The PLC equivalent
A [[plc-control|PLC]] runs the same structure in software: a step bit per step, set by the previous step AND the transition condition, reset by the next step; outputs follow the step bits. Written as a sequential function chart (IEC 61131-3) or in GRAFCET, it reads almost like the displacement–step diagram. Reed switches on the cylinders replace roller valves, solenoid valves replace pilot valves, and each step adds a small reaction time:

$$t_r = t_f + 2\\,t_\\text{sc} + t_v$$

— the input filter, up to two program scans (the signal may arrive just after the input was read) and the valve's response. With 3 ms, 5 ms and 15 ms that is 28 ms per step.

> [!warn] A reset changes which command is active, and a sequencer keeps its step through an air failure. A cylinder may move the moment the reset is given or the pressure returns: design the reset so the machine goes home deliberately, and keep people clear.
`,
  ideas: [
    'A step sequencer has one memory module per step; only one is active at a time.',
    'A module sets on "previous step active AND transition signal", gives its command and resets the previous step.',
    'Because only one command is active at a time, signal overlap is impossible by construction.',
    'Sequencers handle any sequence, including repeated moves; the active step shows where a machine stopped.',
    'A PLC does the same with step bits; each step adds a reaction of input filter + two scans + valve response.'
  ],
  pitfalls: [
    'A sequencer needs a module per cylinder — It needs one per step: A+ B+ B− A− takes four modules.',
    'In a PLC a signal is acted on the instant it arrives — The program reads its inputs once per scan, so a signal can wait up to a full scan before being seen and another before the output changes.',
    'After an air failure the sequencer starts again from step 1 — The memories keep their state; without a reset the machine resumes where it stopped.'
  ],
  formulas: [
    {
      name: 'Worst-case reaction of a PLC-controlled step',
      expr: 'tr = tf + 2*tsc + tv', tex: 't_r = t_f + 2\\,t_\\text{sc} + t_v',
      vars: {
        tr: { name: 'reaction time of one step', q: 'time', unit: 'ms', tex: 't_r' },
        tf: { name: 'input filter delay', q: 'time', unit: 'ms', value: 3, tex: 't_f' },
        tsc: { name: 'program scan time', q: 'time', unit: 'ms', value: 5, tex: 't_\\text{sc}' },
        tv: { name: 'valve response time', q: 'time', unit: 'ms', value: 15, tex: 't_v' }
      },
      note: 'Up to two scans: the signal may arrive just after the inputs were read, and the output is written at the end of the next scan. Add the time the pressure takes to build in the cylinder.',
      practice: { unknowns: ['tr', 'tsc'] },
      stories: { tr: 'A PLC with a scan time of {tsc} and an input filter of {tf} drives a valve that responds in {tv}. What is the worst-case reaction of one step?' }
    },
    {
      name: 'Share of a cycle spent switching',
      expr: 'f = N*tr/T', tex: 'f = \\dfrac{N\\,t_r}{T}',
      vars: {
        f: { name: 'share of the cycle spent in reactions', q: 'ratio', unit: '%' },
        N: { name: 'number of steps', value: 8, int: true },
        tr: { name: 'reaction time per step', q: 'time', unit: 'ms', value: 28, tex: 't_r' },
        T: { name: 'cycle time', q: 'time', unit: 's', value: 6 }
      },
      note: 'Every step waits for its reaction before any motion; on short, fast strokes it can be a large part of the cycle.',
      stories: { f: 'A machine runs {N} steps in a cycle of {T}; each step has a reaction of {tr}. What share of the cycle is spent reacting?' }
    }
  ],
  examples: [
    {
      title: 'Sequencer or cascade?',
      q: 'A riveting station runs A+ B+ B− B+ B− A− (clamp, rivet twice, unclamp). Compare a cascade with a step sequencer.',
      steps: [
        'Cascade groups: A+ B+ / B− / B+ / B− A− — a new group at every change of B\'s direction.',
        'Merge last and first? B− A− A+ B+ repeats A: no. Four groups, three cascade valves, and the signal to line IV passes through three valves.',
        'Step sequencer: six moves, six modules, each identical; the indicator shows at a glance which rivet stroke the machine is on.',
        'With four groups the cascade is at its practical limit; the sequencer (or a small PLC) is the better choice.'
      ],
      a: 'Cascade: 4 groups, 3 valves in series. Sequencer: 6 identical modules — simpler to build and to diagnose.'
    },
    {
      title: 'The time the logic costs',
      q: 'A PLC with a 10 ms scan and a 3 ms input filter drives valves that respond in 12 ms. The machine has 10 steps and a 4 s cycle. What is the worst-case reaction per step, and what share of the cycle is it?',
      steps: ['$t_r = 3 + 2 \\times 10 + 12 = 35$ ms.', 'Per cycle: $10 \\times 35 = 350$ ms, $f = 0.35/4 = 8.8$ %.'],
      a: '35 ms per step, nearly 9 % of the cycle — a faster scan or event-driven outputs would win back most of it.'
    }
  ],
  quiz: [
    { q: 'How many modules does a step sequencer need for A+ B+ B− A−?', answer: 4, tol: 0.001,
      why: 'One module per step (move), not per cylinder.' },
    { q: 'Why can a step sequencer not suffer from signal overlap?', choices: ['Only one module is active, so only one command reaches the main valves at a time', 'Its valves switch faster', 'It uses one-way rollers', 'It runs at lower pressure'], a: 0,
      why: 'Each command comes from its module\'s output, and setting a module resets the one before; two opposing commands are never present together.' },
    { q: 'A PLC with a 5 ms scan, 3 ms input filter and 15 ms valve: worst-case reaction?', answer: 28, unit: 'ms', tol: 0.02,
      why: '$3 + 2 \\times 5 + 15 = 28$ ms.' },
    { q: 'In normal running, two modules of a step sequencer can be active at the same time.', a: false,
      why: 'Setting a module resets the previous one; the design keeps one token in the chain (parallel branches use explicit parallel modules).' },
    { q: 'After an air failure, a pneumatic step sequencer…', choices: ['keeps its active step and may resume there', 'always returns to step 1', 'loses all its steps and does nothing', 'switches to manual mode'], a: 0,
      why: 'The memory valves hold their positions without air; a reset is needed to bring the machine to a known home step.' }
  ],
  applications: ['Long all-pneumatic sequences in mining and explosive atmospheres.', 'Machines whose sequence changes, built from stackable modules.', 'The PLC sequential function chart that runs most modern pneumatic machines.'],
  sim: { id: 'seq-step-diagram', params: { seq: 'A+ B+ B- B+ B- A-' } }
},

/* ================================================================ SAFETY CIRCUITS */
{
  id: 'two-hand-control', parent: 'safety-circuits', title: 'Two-hand control', level: 2,
  short: 'A control that starts a dangerous stroke only while both of the operator\'s hands are on two separate buttons, pressed within about half a second of each other, and stops it the moment either hand lets go — which keeps that operator\'s hands out of the danger zone, and nobody else\'s.',
  keywords: ['two-hand control', 'two hand control', 'ISO 13851', 'type IIIA', 'synchronous actuation', '0.5 s', 'palm button', 'anti-tie-down', 'press safety', 'safety distance', 'ISO 13855', 'two-hand safety block'],
  prereq: ['two-pressure-valve', 'time-delay-valve', 'direct-control'],
  related: ['emergency-stop-pneu', 'iso-4414', 'safety-functions', 'pneumatic-safety', 'logic-functions', 'hydraulics:hydraulic-safety'],
  body: `
A small pneumatic press, a riveter, a crimping tool: the operator loads a part by hand and then the ram comes down where the hand just was. A **two-hand control** makes the machine wait until both hands are occupied — each on its own button, away from the danger zone — and keeps them there while the dangerous motion runs.

### What the device must do
ISO 13851:2019 (two-hand control devices) builds the requirements up in types:

| Type | Adds |
|---|---|
| I | both hands needed; releasing either one ends the output |
| II | both buttons must be released before a new cycle can start |
| III | **synchronous actuation**: both pressed within 0.5 s, otherwise no output |
| IIIA / IIIB / IIIC | type III built to ISO 13849-1 category 1, 3 or 4 |

The 0.5 s window is what defeats cheating: an operator who ties one button down with tape will press the second one seconds later, and the device refuses. The buttons are placed and shrouded so that one hand, or a hand and an elbow, cannot reach both — at least 260 mm apart, more or covered against a forearm — and they are shaped so that they cannot be pressed by accident.

### Pneumatically
Two 3/2 palm-button valves feed a **two-hand safety block**. Inside, an AND element (a [[two-pressure-valve]]) passes the signal only when both inputs are present, and a timing element — a small volume filled through a throttle, as in a [[time-delay-valve]] — blocks the output if one input has been present alone for longer than about half a second. The output pilots the main valve, whose spring returns the ram as soon as the output drops. All-pneumatic blocks usually meet type IIIA; the higher categories need redundant, monitored channels, which is the work of electronic safety relays.

### How far from the danger?
The buttons must be far enough away that a hand leaving a button cannot reach the danger zone before the motion has stopped. ISO 13855:2010 gives the minimum distance as

$$S = K\\,T + C$$

with $K = 1600$ mm/s for the speed of a hand, $T$ the whole stopping time from release (block, valve, exhaust and the ram coming to rest) and an allowance $C = 250$ mm for reaching in (reducible to zero when the buttons are shrouded so that a hand cannot encroach). A ram that stops 0.15 s after release needs the buttons at least $1600 \\times 0.15 + 250 = 490$ mm from the danger zone. A slow valve or a small exhaust makes $T$ — and the machine — larger; a quick-exhaust valve at the cylinder shortens it.

> [!warn] A two-hand control protects the hands of the one operator using it, and only if it is not defeated. Other people near the machine need guards, and a stroke that continues or restarts after release is a fault to be fixed before the machine runs again.
`,
  ideas: [
    'Both hands must be on separate buttons; releasing either ends the dangerous motion.',
    'Type III adds synchronous actuation: both buttons within 0.5 s, which defeats a tied-down button.',
    'A new cycle needs both buttons released first.',
    'A pneumatic two-hand block combines an AND element with a 0.5 s timing element; it usually meets type IIIA.',
    'The buttons must be at least S = K·T + C from the danger zone, with K = 1600 mm/s.'
  ],
  pitfalls: [
    'A two-hand control makes the machine safe for everyone — It only holds the operator\'s own hands; helpers and passers-by need guards.',
    'Pressing both buttons at any time starts the stroke — The presses must come within about 0.5 s; later than that the device refuses until both are released.',
    'Put the buttons as close to the work as possible for convenience — They must be far enough away that a released hand cannot reach the danger zone before the ram stops.'
  ],
  formulas: [
    {
      name: 'Minimum distance of the buttons (ISO 13855)',
      expr: 'S = K*T + C', tex: 'S = K\\,T + C',
      vars: {
        S: { name: 'minimum distance from the buttons to the danger zone', q: 'length', unit: 'mm' },
        K: { name: 'approach speed of the hand', q: 'speed', unit: 'mm/s', value: 1600, fixed: true },
        T: { name: 'overall stopping time after release', q: 'time', unit: 's', value: 0.15 },
        C: { name: 'intrusion allowance', q: 'length', unit: 'mm', value: 250 }
      },
      note: 'For two-hand controls: K = 1600 mm/s, C = 250 mm, or 0 where shrouding stops the hand from encroaching. T includes the block, the valve, the exhaust and the stopping of the motion.',
      practice: { unknowns: ['S', 'T'] },
      stories: { S: 'A press stops {T} after either button is released. With an allowance of {C}, how far from the danger zone must the buttons be?', T: 'The buttons of a press are {S} from the danger zone, with an allowance of {C}. Within what time must the ram stop after release?' }
    }
  ],
  examples: [
    {
      title: 'Placing the buttons of a pneumatic press',
      q: 'After a button is released, the two-hand block and the valve take 40 ms and the ram then takes 110 ms to stop and reverse. How far from the danger zone must the buttons be, unshrouded and shrouded?',
      steps: [
        '$T = 0.04 + 0.11 = 0.15$ s.',
        'Unshrouded: $S = 1600 \\times 0.15 + 250 = 490$ mm.',
        'Shrouded so that a hand cannot encroach: $C = 0$, $S = 240$ mm.',
        'A quick-exhaust valve that halves the stopping time of the ram would bring the unshrouded distance to about 400 mm.'
      ],
      a: '490 mm unshrouded, 240 mm with shrouded buttons.'
    },
    {
      title: 'What the block does with late and early presses',
      q: 'An operator presses the left button, then the right one 0.7 s later. Then she releases both, presses them 0.2 s apart, and lifts the left hand half-way through the stroke. What happens each time?',
      steps: [
        'First try: the second press comes after the 0.5 s window, so there is no output. Nothing moves.',
        'Both released: the block is ready again. Presses 0.2 s apart: within the window, the output appears and the ram moves.',
        'Left hand lifted: the AND condition fails, the output drops, the valve spring returns the ram.',
        'To go again she must release the right button too, then press both within 0.5 s.'
      ],
      a: 'No stroke; a stroke; the ram returns at once; a fresh start needs both buttons released.'
    }
  ],
  quiz: [
    { q: 'The operator presses the right button 0.7 s after the left one. What happens?', choices: ['Nothing: both must be released and pressed again within 0.5 s', 'The stroke starts 0.7 s late', 'The stroke starts at half speed', 'The machine starts but stops after 0.5 s'], a: 0,
      why: 'Synchronous actuation (type III) requires both inputs within about 0.5 s; otherwise there is no output until both are released.' },
    { q: 'During the stroke the operator lifts one hand. The ram…', choices: ['stops or returns, because the output ends', 'finishes the stroke', 'continues until the other hand lifts too', 'pauses and resumes when the hand returns'], a: 0,
      why: 'Releasing either button ends the output; resuming would need both released and re-pressed.' },
    { q: 'A press stops 0.2 s after release. With C = 250 mm, what is the minimum distance of the buttons from the danger zone?', answer: 570, unit: 'mm', tol: 0.02,
      why: '$S = 1600 \\times 0.2 + 250 = 570$ mm.' },
    { q: 'A two-hand control protects everyone standing near the machine.', a: false,
      why: 'It only keeps the operator\'s own hands on the buttons; anyone else needs guards.' },
    { q: 'Why can a button tied down with tape not be used to run the machine with one hand?', choices: ['The second press comes far outside the 0.5 s window', 'Tape blocks the exhaust', 'The block counts presses', 'The pressure falls'], a: 0,
      why: 'The first input has been present alone for longer than about 0.5 s, so the timing element blocks the output.' }
  ],
  applications: ['Small pneumatic presses, riveting, crimping and staking machines.', 'Hand-loaded assembly fixtures with clamping or pressing strokes.', 'Guillotines and punches for paper, leather and plastic.'],
  history: 'Two-hand controls appeared on mechanical presses in the early twentieth century, when press injuries were among the commonest in industry; the synchronous-actuation requirement came later, once operators were found tying buttons down to work faster.',
  sim: 'seq-two-hand'
},

{
  id: 'emergency-stop-pneu', parent: 'safety-circuits', title: 'Emergency stop and safe exhaust', level: 2,
  short: 'What "stop" means for an axis full of compressed air: exhaust it, hold it, balance it or send it home. Each choice is safe for some hazards and dangerous for others, and upstream sits a lockable dump valve that cuts and exhausts the air of the whole machine.',
  keywords: ['emergency stop', 'e-stop', 'safe exhaust', 'dump valve', '5/3 valve', 'closed centre', 'exhaust centre', 'pressure centre', 'pilot check valve', 'ISO 13850', 'stop category', 'energy isolation', 'lock-out', 'ISO 14118', 'stored energy'],
  prereq: ['way-valves', 'check-valves-pneu', 'pneumatic-cylinder'],
  related: ['soft-start', 'two-hand-control', 'iso-4414', 'pneumatic-safety', 'safety-functions', 'quick-exhaust', 'vacuum-safety', 'hydraulics:load-holding'],
  body: `
Press the red button of an electric machine and the power goes: motors coast or brake to a halt, and the energy is gone. A pneumatic axis is different. Its energy is **stored** in the air in its chambers, its tubes and its receiver, and "cut the power" leaves a question that must be answered for each axis: should the air be *let out* or *kept in*?

### Four ways to stop an axis
| Stop by | The axis… | Suits | Beware |
|---|---|---|---|
| **Exhausting** both chambers (5/3 exhaust centre, dump valve) | loses its force; a moving load coasts; a vertical load falls | clamps and grippers: a trapped hand can be freed | gravity loads, momentum |
| **Blocking** both chambers (5/3 closed centre, pilot-operated check valves at the ports) | stops after a springy overshoot and holds | vertical loads, stopping mid-stroke | energy stays trapped; creeps as seals leak; a trapped hand stays trapped |
| **Pressurising** both sides (5/3 pressure centre) | a single-rod cylinder creeps out with the force $p$ × rod area | light holding forces | slow drift, stored energy |
| **Reversing** to a safe end | drives to a defined position | presses retracting, doors opening | the reversal is itself a motion |

No single choice is "the safe one". A vertical axis carrying a tool must not fall — it is blocked, best by pilot-operated check valves screwed straight into the cylinder ports, so that a burst tube cannot drop it, and often with a mechanical rod lock as well. A gripper that could crush a finger should open or go soft. The risk assessment decides, axis by axis (see [[iso-4414]]).

Air is springy, so even a blocked cylinder does not stop dead. The moving mass compresses the air ahead of the piston and bounces; the distance it travels after the signal is roughly

$$s = v\\,t_r + \\frac{v^2}{2a}$$

— the reaction of valve and control, then braking. A 0.6 m/s slide with 30 ms of reaction and 40 m/s² of air braking runs on another 22 mm.

### Exhausting takes time
A chamber empties through its exhaust path at a rate set by its [[sonic-conductance]]. While the flow is choked the pressure falls exponentially, and the time from $p_1$ to $p_2$ (absolute) is about

$$t = \\frac{V}{C\\,p_\\text{ref}}\\ln\\frac{p_1}{p_2}$$

A 63 mm cylinder with a 200 mm stroke (0.64 L) venting through a valve of $C = 1$ dm³/(s·bar) takes about 0.8 s to fall from 6 to 1 bar gauge; a [[quick-exhaust]] valve at the port with $C = 4$ does it in 0.2 s.

### Upstream: the dump valve
Every machine needs a means to cut off its air *and exhaust it*: a **dump valve** at the inlet, lockable in the off position for [[pneumatic-safety|lock-out/tag-out]] (ISO 14118:2017, prevention of unexpected start-up). In safety circuits it is electrically piloted by the emergency-stop or guard circuit; for the higher performance levels two dump valves in series, each with a sensor proving its spool has moved, are monitored by a safety relay. The emergency stop itself (ISO 13850:2015) is a stop of category 0 or 1 in the sense of IEC 60204-1 — it must stop the hazard in the best way the risk assessment found, not simply make everything go limp.

> [!warn] After an emergency stop, air may still be trapped in blocked cylinders, behind check valves and in receivers. Before anyone reaches in: exhaust, prove zero pressure at a gauge, support or lower vertical loads mechanically, and lock out the supply.
`,
  ideas: [
    'A pneumatic axis stores energy in its air, so "stop" must choose between exhausting, blocking, balancing and reversing.',
    'Exhausting frees a trapped hand but lets vertical loads fall; blocking holds loads but keeps the energy trapped.',
    'Air is springy: a blocked axis overshoots, s ≈ v·tᵣ + v²/(2a), and creeps as seals leak.',
    'Venting time grows with volume and falls with exhaust conductance: t ≈ V/(C·p_ref)·ln(p₁/p₂).',
    'A lockable dump valve that cuts and exhausts the air is the machine\'s energy isolation; monitored double valves reach the higher categories.'
  ],
  pitfalls: [
    'Exhausting everything is always the safe stop — A vertical load then falls and a moving mass coasts on; exhausting is right for crushing hazards, blocking for gravity loads.',
    'A 5/3 closed-centre valve holds a cylinder rigidly — Air is compressible and seals and spools leak: the cylinder overshoots, bounces and creeps. Check valves at the ports and a rod lock hold far better.',
    'After the emergency stop the machine is safe to touch — Blocked chambers, check valves and receivers can still hold pressure; exhaust and verify first.'
  ],
  formulas: [
    {
      name: 'Stopping distance after a stop signal',
      expr: 's = v*tr + v^2/(2*a)', tex: 's = v\\,t_r + \\dfrac{v^2}{2a}',
      vars: {
        s: { name: 'distance travelled after the signal', q: 'length', unit: 'mm' },
        v: { name: 'speed at the moment of the signal', q: 'speed', unit: 'm/s', value: 0.6 },
        tr: { name: 'reaction time of control and valve', q: 'time', unit: 'ms', value: 30, tex: 't_r' },
        a: { name: 'mean deceleration', q: 'accel', unit: 'm/s²', value: 40 }
      },
      note: 'Constant deceleration after the reaction time. A blocked pneumatic axis brakes on its trapped air, typically 10–100 m/s²; an exhausted one hardly brakes at all.',
      practice: { unknowns: ['s', 'a'] },
      stories: { s: 'A slide moving at {v} is stopped; the control and valve react in {tr}, and the air then decelerates it at {a}. How far does it travel?', a: 'A slide at {v} must stop within {s}; the reaction takes {tr}. What deceleration is needed?' }
    },
    {
      name: 'Venting time of a chamber',
      expr: 't = V/(C*pr)*ln(p1/p2)', tex: 't = \\dfrac{V}{C\\,p_\\text{ref}}\\ln\\dfrac{p_1}{p_2}',
      vars: {
        t: { name: 'time to vent from p₁ to p₂', q: 'time', unit: 's' },
        V: { name: 'volume of the chamber and its tube', q: 'volume', unit: 'L', value: 0.64 },
        C: { name: 'sonic conductance of the exhaust path', q: 'flowcond', unit: 'dm³/(s·bar)', value: 1 },
        pr: { name: 'reference pressure of free air (ANR)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_\\text{ref}' },
        p1: { name: 'starting pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.0, tex: 'p_1' },
        p2: { name: 'final pressure (absolute)', q: 'pressure', unit: 'bar', value: 2.0, tex: 'p_2' }
      },
      note: 'Isothermal, choked outflow: valid while the chamber is above roughly 2–3 bar absolute. A fast discharge cools the air and runs somewhat quicker; the last bar above atmosphere takes longer.',
      practice: { unknowns: ['t', 'C'] },
      stories: { t: 'A chamber of {V} vents through an exhaust path of {C}, from {p1} to {p2}. How long does it take?', C: 'A chamber of {V} must fall from {p1} to {p2} within {t}. What exhaust conductance is needed?' }
    }
  ],
  examples: [
    {
      title: 'How far does the slide run on?',
      q: 'A horizontal slide moves at 0.6 m/s when the emergency stop is pressed. The control and the 5/3 closed-centre valve react in 30 ms; the trapped air then decelerates it at about 40 m/s². How far does it travel?',
      steps: ['Reaction: $0.6 \\times 0.03 = 0.018$ m.', 'Braking: $0.6^2/(2 \\times 40) = 0.0045$ m.', 'Total: 22.5 mm — and then it bounces back a little on the compressed air.'],
      a: 'About 22 mm, plus a springy rebound.'
    },
    {
      title: 'Venting a 63 mm cylinder',
      q: 'A 63 mm cylinder with a 200 mm stroke (plus 20 mL of tube) is exhausted from 6 bar gauge. How long until it is down to 1 bar gauge through the valve (C = 1 dm³/(s·bar)), and through a quick-exhaust valve (C = 4)?',
      steps: [
        '$V = \\pi/4 \\times 0.063^2 \\times 0.2 + 0.00002 = 0.643$ L.',
        'Absolute pressures: 7.01 and 2.01 bar; $\\ln(7.01/2.01) = 1.25$.',
        'Through the valve: $t = 0.643\\times10^{-3}/(10^{-8} \\times 10^5) \\times 1.25 = 0.80$ s.',
        'Through the quick-exhaust valve: a quarter of that, 0.20 s.'
      ],
      a: 'About 0.8 s through the valve, 0.2 s with a quick-exhaust valve.'
    }
  ],
  quiz: [
    { q: 'A vertical cylinder holds a 30 kg tool up. On emergency stop its 5/3 valve goes to the exhaust centre. What happens?', choices: ['The tool falls', 'The tool stays where it is', 'The tool rises slowly', 'The cylinder locks mechanically'], a: 0,
      why: 'With both chambers exhausted nothing holds the weight. Gravity loads need blocking — best with pilot-operated check valves at the ports — and often a rod lock.' },
    { q: 'A clamp could trap an operator\'s fingers. Which stop suits it best?', choices: ['Exhaust both chambers, so the clamp can be pushed open', 'Block both chambers', 'Pressurise both sides', 'Keep the valve in its last position'], a: 0,
      why: 'For crushing hazards, removing the force lets a trapped hand be freed; blocking would keep it clamped.' },
    { q: 'A slide at 0.8 m/s, 25 ms reaction, 30 m/s² deceleration: stopping distance in mm?', answer: 30.7, unit: 'mm', tol: 0.02,
      why: '$0.8 \\times 0.025 + 0.64/60 = 0.020 + 0.0107 = 0.0307$ m.' },
    { q: 'A 5/3 closed-centre valve holds a cylinder rigidly in position.', a: false,
      why: 'Air is compressible and leaks past seals and spools: the cylinder overshoots, bounces and creeps.' },
    { q: 'Doubling the exhaust conductance of a chamber makes its venting time…', choices: ['half as long', 'twice as long', 'a quarter as long', 'unchanged'], a: 0,
      why: '$t \\propto V/C$.' }
  ],
  applications: ['Emergency-stop and guard-door circuits on pneumatic machines.', 'Holding vertical axes and lifting devices safely on air failure.', 'Energy isolation for maintenance with a lockable dump valve.'],
  sim: 'seq-estop'
},

{
  id: 'soft-start', parent: 'safety-circuits', title: 'Soft start and dump valves', level: 2,
  short: 'A valve at the machine\'s inlet that lets the air back in slowly after the system has been exhausted, so that cylinders creep rather than slam into position, then opens fully — usually combined with a dump valve that cuts and exhausts the supply.',
  keywords: ['soft start', 'soft-start valve', 'slow start', 'progressive start', 'dump valve', 'safe exhaust', 'start-up valve', 'unexpected movement', 'pressurisation', 'meter-out', 'filling time'],
  prereq: ['emergency-stop-pneu', 'flow-control-pneu', 'frl-units'],
  related: ['iso-4414', 'pneumatic-safety', 'cascade-method', 'filling-emptying', 'cylinder-speed-pneu'],
  body: `
Exhaust a machine for a repair, open the supply again, and something alarming can happen: a cylinder that was left in mid-stroke, or whose valve points the other way, shoots across its whole stroke at full speed. The [[flow-control-pneu|meter-out]] throttles that normally tame it are useless now — they throttle the air *leaving* the far chamber, and that chamber is empty. With no air cushion ahead of the piston, the only brake is the end cap.

### What a soft-start valve does
It sits at the machine's inlet, after the service unit. When it is opened, air first enters through a small adjustable throttle, so the pressure in the machine rises slowly. Cylinders that must move to match their valves now creep there gently, because the flow into the driving chamber is small. When the downstream pressure reaches about half the supply, a built-in pilot opens the main passage and the machine gets its full flow.

The time the machine takes to fill to the switch-over point, with the throttle choked, is about

$$t = \\frac{V\\,\\Delta p}{p_\\text{ref}\\,C\\,p_1}$$

and the speed of a cylinder that takes the whole trickle $q$ of free air into a chamber of area $A$ at absolute pressure $p$ is

$$v = \\frac{q\\,p_\\text{ref}}{A\\,p}$$

A machine of 1.5 L behind a throttle of 0.08 dm³/(s·bar), fed from 6 bar, takes about 8 s to reach 3 bar; its 34 L/min of free air can move a 50 mm cylinder at only about 0.2 m/s — against the metre per second or more it would reach unchecked.

### The dump valve
The other half of the job is removing the air. A **dump valve** is a 3/2 valve at the inlet that, when switched off, blocks the supply and exhausts the machine through a large port. Soft-start and dump are often one unit, electrically piloted by the safety circuit: the guard opens, the air is dumped; the guard closes and the reset is given, the air returns softly. A manual version with a padlock hasp is the machine's lockable isolation for maintenance.

### Getting it right
- The exhaust of a dump valve must be at least as large as the supply to the machine, or the exhaust takes seconds.
- Put the valves into a known state *before* the pressure returns, so that every cylinder creeps towards a planned position.
- A cylinder whose motion is dangerous even at creeping speed must be positioned or guarded before restart — soft start reduces the energy, it does not remove the motion.
- Circuits with memory ([[cascade-method|cascades]], sequencers, impulse valves) keep their state through the stop and act on it when the air returns.

> [!warn] Expect cylinders to move when a system is pressurised. Before opening the supply, check that nobody is in reach of any actuator and that tools and parts are clear; bring the pressure back through the soft-start valve, never by opening a hand valve quickly.
`,
  ideas: [
    'After a system has been exhausted, meter-out throttles cannot slow the first stroke: the exhausting chamber is empty.',
    'A soft-start valve fills the machine through a small throttle, then opens fully at about half the supply pressure.',
    'Filling time t ≈ V·Δp/(p_ref·C·p₁); a trickle q moves a piston at v = q·p_ref/(A·p).',
    'A dump valve cuts the supply and exhausts the machine; lockable, it is the energy isolation for maintenance.',
    'Soft start reduces the energy of unexpected motion; it does not remove the motion itself.'
  ],
  pitfalls: [
    'The meter-out throttles will keep the first stroke slow — They throttle air leaving the far chamber, which is empty after a dump; the cylinder runs away until the end cap stops it.',
    'Soft start makes it safe to stand near the machine during pressurisation — Cylinders still move, only more slowly; people must be clear.',
    'Any 3/2 valve will do as a dump valve — Its exhaust must be large, or the machine vents slowly; for safety functions it must also be monitored.'
  ],
  formulas: [
    {
      name: 'Time to fill a machine through a soft-start throttle',
      expr: 't = V*dp/(pr*C*p1)', tex: 't = \\dfrac{V\\,\\Delta p}{p_\\text{ref}\\,C\\,p_1}',
      vars: {
        t: { name: 'time to reach the switch-over pressure', q: 'time', unit: 's' },
        V: { name: 'volume of the machine downstream', q: 'volume', unit: 'L', value: 1.5 },
        dp: { name: 'switch-over pressure (gauge)', q: 'pressure', unit: 'bar', value: 3, tex: '\\Delta p' },
        C: { name: 'sonic conductance of the soft-start throttle', q: 'flowcond', unit: 'dm³/(s·bar)', value: 0.08 },
        p1: { name: 'supply pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.0, tex: 'p_1' },
        pr: { name: 'reference pressure of free air (ANR)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_\\text{ref}' }
      },
      note: 'Isothermal filling with choked flow through the throttle (downstream below about half the supply). The volume includes tubes, valves and the cylinder chambers being filled.',
      practice: { unknowns: ['t', 'C'] },
      stories: { t: 'A machine of {V} is filled through a soft-start throttle of {C} from a supply of {p1}. How long until it reaches {dp}?', C: 'A machine of {V} fed from {p1} should take {t} to reach {dp}. What throttle conductance is needed?' }
    },
    {
      name: 'Speed of a piston fed by a limited flow',
      expr: 'v = q*pr/(A*p)', tex: 'v = \\dfrac{q\\,p_\\text{ref}}{A\\,p}',
      vars: {
        v: { name: 'piston speed', q: 'speed', unit: 'm/s' },
        q: { name: 'free-air flow into the chamber', q: 'airflow', unit: 'L/min ANR', value: 34 },
        A: { name: 'piston area', q: 'area', unit: 'cm²', value: 19.6 },
        p: { name: 'pressure in the driving chamber (absolute)', q: 'pressure', unit: 'bar', value: 1.5 },
        pr: { name: 'reference pressure of free air (ANR)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_\\text{ref}' }
      },
      note: 'The free air expands to the chamber pressure and sweeps the piston at the same temperature. Low chamber pressure (a light load) makes the same trickle move the piston faster.',
      practice: { unknowns: ['v', 'q'] },
      stories: { v: 'A trickle of {q} flows into a cylinder of {A} that moves at a chamber pressure of {p}. How fast does the piston move?' }
    }
  ],
  examples: [
    {
      title: 'Choosing the soft-start throttle',
      q: 'A machine holds 1.5 L of volume downstream of its soft-start valve and is fed from 6 bar gauge. The valve switches over at 3 bar gauge. How long does filling take with the throttle at 0.08 dm³/(s·bar), and how fast can a 50 mm cylinder (19.6 cm²) move meanwhile, if it takes the whole flow at 1.5 bar absolute?',
      steps: [
        'Flow: $q = C p_1 = 0.08 \\times 7.01 = 0.561$ dm³/s $= 33.7$ L/min of free air.',
        'Free air needed: $1.5 \\times 3/1 = 4.5$ L; $t = 4.5/0.561 = 8.0$ s.',
        'Piston speed: $v = 0.561\\times10^{-3} \\times 1/(19.6\\times10^{-4} \\times 1.5) = 0.19$ m/s.'
      ],
      a: 'About 8 s to switch over; any cylinder that moves meanwhile creeps at 0.2 m/s or less.'
    }
  ],
  quiz: [
    { q: 'Why does a meter-out throttle fail to slow the first stroke after a machine has been exhausted?', choices: ['The chamber it throttles is empty, so there is no air to hold back', 'The throttle closes when the pressure is low', 'The valve is in its middle position', 'The supply pressure is too high'], a: 0,
      why: 'Meter-out control needs back-pressure in the exhausting chamber; after a dump there is none.' },
    { q: 'A soft-start valve opens its main passage at about…', choices: ['half the supply pressure', 'atmospheric pressure', 'full supply pressure only', '0.5 bar'], a: 0,
      why: 'Typically 50–60 % of the supply; by then every cylinder has crept to its valve-commanded position.' },
    { q: 'A 2 L machine behind a soft-start throttle of 0.1 dm³/(s·bar) is fed from 7.0 bar absolute. How many seconds to reach 3.5 bar gauge?', answer: 10, unit: 's', tol: 0.03,
      why: 'Free air needed $2 \\times 3.5 = 7$ L; flow $0.1 \\times 7 = 0.7$ L/s; $t = 10$ s.' },
    { q: 'With a soft-start valve fitted, it is safe to stand near the cylinders while the machine is pressurised.', a: false,
      why: 'Cylinders still move, only slowly; people and objects must be clear before the air returns.' }
  ],
  applications: ['Restoring air after an emergency stop, a guard opening or maintenance.', 'Machines with large cylinders or heavy slides that could slam on start-up.', 'Lockable energy isolation at the inlet of every pneumatic machine.'],
  sim: { id: 'seq-estop', params: { scenario: 'restart' } }
},

/* ================================================================ SAFETY AND MAINTENANCE */
{
  id: 'pneumatic-safety', parent: 'pneumatic-safety-topic', title: 'Pneumatic safety', level: 1,
  short: 'The hazards of compressed air and the habits that prevent them: never point air at a person, release stored energy and lock out before work, restrain hoses and use safety couplings, expect cylinders to move, protect eyes and ears.',
  keywords: ['compressed air safety', 'air injury', 'air embolism', 'blow gun', 'safety nozzle', 'lock-out tag-out', 'LOTO', 'stored energy', 'whipping hose', 'hose whip restraint', 'safety coupling', 'excess flow valve', 'eye injury', 'hearing', 'filter bowl'],
  prereq: ['absolute-gauge-pressure', 'energy-in-compressed-air', 'pneumatic-cylinder'],
  related: ['iso-4414', 'pressure-equipment', 'noise-silencers', 'emergency-stop-pneu', 'soft-start', 'vacuum-safety', 'maintenance-pneu', 'hydraulics:hydraulic-safety', 'aerodynamics:nozzles'],
  body: `
Air feels harmless — it is what we breathe — and that is exactly why it hurts people. Almost every serious compressed-air accident comes from treating a 6 bar supply as if it were a breeze.

### Air against the body
A jet from a blow gun leaves the nozzle at around the speed of sound. It drives grit into eyes, can burst an eardrum, and — pressed against the skin, a cut or a body opening — can force air into the tissues or the bloodstream. Air in the blood (an air embolism) can reach the heart or the brain; air blown into the body as a "joke" has torn internal organs and killed people. So: **never point compressed air at anyone, never blow dust off skin or clothing** (use a vacuum cleaner or a brush), and wear eye protection when blowing parts clean. Safety blow nozzles limit the pressure at a blocked tip to a low value (US rules require under 30 psi, about 2 bar, when the nozzle is dead-ended) and vent sideways — that makes them safer for blowing chips off a part, not safe to point at a person.

### Stored energy
Receivers, pipes, hoses and cylinder chambers hold energy long after the compressor stops. A cylinder can move when a valve is pressed by hand, when a fitting is loosened or when the air returns; a filter bowl unscrewed under pressure becomes a projectile — at 7 bar a 60 mm bowl carries 2 kN. Before any work, **lock-out/tag-out**:

1. Tell the people affected; stop the machine normally.
2. Close and lock the isolating (dump) valve; hang your own tag and padlock.
3. Release stored energy: exhaust, open drains, lower or support loads, vent trapped chambers.
4. Prove it: a gauge at zero, a try at starting that does nothing.
5. Work; then clear tools and people, remove locks yourself, and restore the air through the [[soft-start]] valve.

### Hoses and couplings
An open hose end at 6 bar is a jet engine on a string: its thrust is about $F = \\tfrac{\\pi D^2}{4}\\,(1.268\\,p_0 - p_\\text{atm})$ with $p_0$ absolute, some 60 N for a 10 mm bore and more than 100 N for 13 mm — enough to whip the coupling across a room. Use **safety couplings** that vent the downstream line before they release, **whip restraints** (cables across each joint) on large hoses, excess-flow valves that shut when a hose bursts, and never uncouple a hose under pressure.

| Hazard | Typical cause | Defence |
|---|---|---|
| Air forced into eyes, ears, skin | blow gun used on people or clothes | never; eye protection; safety nozzles |
| Unexpected motion | stored air, manual overrides, air returning | lock-out, exhaust, [[soft-start]], [[emergency-stop-pneu|safe stop]] |
| Projectiles | bowls, plugs, fittings loosened under pressure | exhaust before opening; rated parts |
| Whipping hose | coupling or fitting failure | safety couplings, restraints, excess-flow valves |
| Hearing damage | exhausts, blowing, leaks | silencers, hearing protection ([[noise-silencers]]) |
| Vessel failure | corrosion, blocked relief valve | inspection, draining ([[pressure-equipment]]) |
| Falling loads | air or vacuum lost | check valves, rod locks, [[vacuum-safety]] |

> [!warn] Never point compressed air at a person or use it to clean skin or clothes. Before working on a machine, shut off and exhaust the air, lock out the supply, support any load that could fall, and prove that the pressure is zero.
`,
  ideas: [
    'Never point compressed air at a person or use it to clean skin or clothes: it can drive air and grit into the body.',
    'Air systems store energy: cylinders move, bowls and plugs fly, hoses whip.',
    'Lock-out/tag-out: isolate, lock, release stored energy, prove zero, then work.',
    'An open hose end at 6 bar pushes with tens to hundreds of newtons: use safety couplings and restraints.',
    'Noise, pressure vessels and falling loads are the other everyday hazards.'
  ],
  pitfalls: [
    'A safety nozzle makes it safe to blow air at skin — It only limits the pressure at a blocked tip and vents sideways; air must still never be pointed at people.',
    'Once the compressor is off, the system is safe — Receivers, pipes and blocked cylinders keep their pressure for hours; exhaust and prove zero.',
    'Low-pressure air cannot hurt — Even 2 bar can drive air through broken skin, and a 6 bar jet carries grit at near the speed of sound.'
  ],
  formulas: [
    {
      name: 'Thrust of an open hose end',
      expr: 'F = pi*D^2/4*(1.268*(p + patm) - patm)', tex: 'F = \\dfrac{\\pi D^2}{4}\\left(1.268\\,(p_g + p_\\text{atm}) - p_\\text{atm}\\right)',
      vars: {
        F: { name: 'reaction force of the jet', q: 'force', unit: 'N' },
        D: { name: 'bore of the open end', q: 'length', unit: 'mm', value: 10 },
        p: { name: 'pressure in the hose (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' }
      },
      note: 'A choked jet from a short, smooth end: momentum flux plus the excess pressure at the exit, (1 + γ)(2/(γ + 1))^(γ/(γ − 1)) = 1.268 for air. Losses along the hose make it a little smaller.',
      practice: { unknowns: ['F', 'D'] },
      stories: { F: 'A hose with a bore of {D} parts from its coupling at {p}. What thrust whips its end about?' }
    },
    {
      name: 'Force on a bowl, cap or plug',
      expr: 'F = p*pi*D^2/4', tex: 'F = p_g\\,\\dfrac{\\pi D^2}{4}',
      vars: {
        F: { name: 'force pushing the part off', q: 'force', unit: 'N' },
        p: { name: 'pressure behind it (gauge)', q: 'pressure', unit: 'bar', value: 7, tex: 'p_g' },
        D: { name: 'diameter sealed', q: 'length', unit: 'mm', value: 60 }
      },
      note: 'The whole force is carried by the last threads or the retaining ring: never loosen anything under pressure.',
      practice: { unknowns: ['F', 'p'] },
      stories: { F: 'A filter bowl seals a diameter of {D} at {p}. What force acts on its threads?' }
    }
  ],
  examples: [
    {
      title: 'The filter bowl under pressure',
      q: 'A filter bowl seals on a 60 mm diameter and the line is at 7 bar gauge. What force pushes it off, and why must the line be exhausted before it is unscrewed?',
      steps: ['$A = \\pi \\times 0.06^2/4 = 2.83\\times10^{-3}$ m².', '$F = 7\\times10^5 \\times 2.83\\times10^{-3} = 1980$ N — the weight of 200 kg.', 'As the thread disengages, the last turn carries all of it and lets go at once: the bowl leaves like a shell. Most filter housings have a lock that only releases when the bowl is vented.'],
      a: 'About 2 kN; exhaust first, and check the gauge reads zero.'
    },
    {
      title: 'A hose comes off',
      q: 'A 13 mm bore hose at 7 bar gauge parts from its coupling. Estimate the thrust at its free end.',
      steps: ['$A = \\pi \\times 0.013^2/4 = 1.33\\times10^{-4}$ m²; $p_0 = 8.01$ bar absolute.', '$F = 1.33\\times10^{-4} \\times (1.268 \\times 8.01 - 1.013)\\times10^5 = 121$ N.', 'The hose accelerates its own few hundred grams sideways at hundreds of m/s²: it whips violently until the air is shut off.'],
      a: 'About 120 N; a whip restraint or an excess-flow valve keeps it from flailing.'
    }
  ],
  quiz: [
    { q: 'Is it acceptable to blow dust off your overalls with a safety nozzle limited to 2 bar?', choices: ['No: compressed air is never used on clothes or skin', 'Yes, below 2 bar it is harmless', 'Yes, if the nozzle is 30 cm away', 'Only with gloves'], a: 0,
      why: 'Air can enter the body through the skin, cuts and openings, and clothing can channel the jet; use a vacuum cleaner or a brush.' },
    { q: 'What is the thrust of a 10 mm open hose end at 6 bar gauge?', answer: 62, unit: 'N', tol: 0.03,
      why: '$\\pi \\times 0.01^2/4 \\times (1.268 \\times 7.013 - 1.013)\\times10^5 = 62$ N.' },
    { q: 'Before removing a filter bowl you must…', choices: ['isolate the line, exhaust it and check the gauge reads zero', 'turn the regulator down to 2 bar', 'drain the bowl first', 'stop the compressor'], a: 0,
      why: 'Only an exhausted line is safe; a regulator setting or a stopped compressor leaves the line pressurised.' },
    { q: 'A safety coupling…', choices: ['vents the downstream hose before it releases the plug', 'cannot be disconnected under pressure at all', 'limits the pressure to 2 bar', 'filters the air'], a: 0,
      why: 'Two-stage couplings first shut off and vent, so the hose is at atmospheric pressure when it comes free and cannot whip.' },
    { q: 'Once the compressor has stopped, the air system is safe to work on.', a: false,
      why: 'The receiver and lines stay pressurised; isolate, exhaust, prove zero and lock out.' }
  ],
  applications: ['Workshop rules for blow guns, couplings and hoses.', 'Lock-out/tag-out procedures for pneumatic machines.', 'Training for operators and maintenance staff.'],
  sim: { id: 'seq-estop', params: { scenario: 'restart' } }
},

{
  id: 'iso-4414', parent: 'pneumatic-safety-topic', title: 'ISO 4414 and machine safety', level: 2,
  short: 'ISO 4414:2010 sets the general rules and safety requirements for pneumatic systems on machines: assess the risks, use components within their ratings, isolate and exhaust the energy, prevent unexpected motion on loss and return of air, protect lines, limit noise and document everything — inside the machinery-safety framework of ISO 12100 and ISO 13849.',
  keywords: ['ISO 4414', 'ISO 4414:2010', 'machine safety', 'Machinery Directive', 'risk assessment', 'ISO 12100', 'ISO 13849', 'performance level', 'B10d', 'MTTFd', 'energy isolation', 'unexpected start-up', 'circuit diagram', 'ISO 4413'],
  prereq: ['pneumatic-safety', 'emergency-stop-pneu', 'iso-1219-pneu'],
  related: ['safety-functions', 'soft-start', 'two-hand-control', 'pressure-equipment', 'noise-silencers', 'hydraulics:hydraulic-safety'],
  body: `
**ISO 4414:2010**, *Pneumatic fluid power — General rules and safety requirements for systems and their components*, is the pneumatic companion of ISO 4413 for hydraulics. It does not tell you how to design a particular machine; it lists what every pneumatic system on a machine must take care of, so that nothing is forgotten. In Europe it is one of the standards whose use presumes conformity with the machinery rules (the Machinery Directive 2006/42/EC, followed by Regulation (EU) 2023/1230 from 2027); elsewhere it is simply good practice that inspectors recognise.

### The principles, in plain words
- **Assess the risks** of every mode — automatic, setting, cleaning, maintenance, faults, loss of power and of air — following ISO 12100:2010, and remove hazards by design first.
- **Use components within their ratings** — pressure, temperature, flow, environment — and protect the system against pressures above its rating (a relief valve or a limited supply).
- **Energy isolation**: a means to cut off the supply *and exhaust the system*, lockable, easy to reach and clearly marked ([[emergency-stop-pneu|dump valve]]).
- **No unexpected motion**: neither when the air fails nor when it returns — [[soft-start]], valves in defined positions, loads held against gravity, memories reset deliberately.
- **Stored energy** is released automatically when the system is isolated, or clearly labelled where it cannot be (receivers, trapped chambers).
- **Controls**: manual overrides guarded against accidental use; control parts that perform safety functions designed to ISO 13849-1.
- **Lines**: tubes and hoses routed and secured so they cannot be damaged, trip anyone or whip; hose assemblies within their life.
- **Air quality** chosen for the components (ISO 8573-1:2010 classes), **noise** reduced at source ([[noise-silencers]]).
- **Information**: an [[iso-1219-pneu|ISO 1219]] circuit diagram, parts list, pressure settings, commissioning checks and maintenance instructions.

| Hazard | ISO 4414 asks for | Typical solution |
|---|---|---|
| Unexpected start-up | safe pressurisation | soft-start valve, valves reset |
| Loss of air | no hazardous motion | check valves at ports, rod locks, spring-return valves chosen with care |
| Maintenance | isolation and exhaust | lockable dump valve, pressure gauge |
| Over-pressure | protection | relief valve, regulator locked |
| Hose failure | restraint | safety couplings, whip restraints |

### How reliable is a pneumatic safety component?
Where a valve performs a safety function, ISO 13849-1 asks how long it lasts before a dangerous failure. Makers give **B10d**, the number of cycles after which 10 % of valves have failed dangerously — typically tens of millions. From the operations per year,

$$n_\\text{op} = \\frac{d_\\text{op}\\,h_\\text{op}\\,3600}{t_\\text{cycle}},\\qquad \\mathrm{MTTF}_D = \\frac{B_{10D}}{0.1\\,n_\\text{op}}$$

A valve switching every 5 s, 16 h a day on 220 days, makes 2.53 million operations a year; with $B_{10D} = 20$ million its MTTF_D is 79 years, "high" in the scale of the standard (low 3–10, medium 10–30, high 30–100 years). It should also be replaced before $B_{10D}/n_\\text{op} \\approx 8$ years of use.

> [!note] The details of performance levels and categories — redundancy, diagnostics, common-cause failures — are on [[safety-functions]].

> [!warn] A standard is a checklist, not a guarantee. Every machine needs its own risk assessment, and every safety function its own validation after installation and after every change.
`,
  ideas: [
    'ISO 4414:2010 lists the general safety requirements for pneumatic systems on machines.',
    'Risk assessment (ISO 12100) comes first; hazards are designed out before they are guarded.',
    'Every system needs lockable isolation that also exhausts, and no hazardous motion on loss or return of air.',
    'Documentation — ISO 1219 diagram, settings, maintenance — is part of the requirement.',
    'For safety functions, component reliability comes from B10d: MTTF_D = B10d/(0.1·n_op).'
  ],
  pitfalls: [
    'Complying with ISO 4414 makes a machine safe — It is a list of general rules; the specific risk assessment and validation are still needed.',
    'A closed ball valve is enough isolation — Isolation must also exhaust the downstream air and be lockable; a closed valve leaves the machine pressurised.',
    'A valve rated for 20 million cycles lasts 20 million cycles — B10d is when 10 % have failed dangerously; the standard\'s MTTF_D and replacement interval come from it.'
  ],
  formulas: [
    {
      name: 'Operations per year',
      expr: 'nop = dop*hop*3600/tc', tex: 'n_\\text{op} = \\dfrac{d_\\text{op}\\,h_\\text{op}\\,3600}{t_\\text{cycle}}',
      vars: {
        nop: { name: 'operations per year', q: false, unit: 'cycles/year', tex: 'n_\\text{op}' },
        dop: { name: 'operating days per year', q: false, unit: 'days/year', value: 220, tex: 'd_\\text{op}' },
        hop: { name: 'operating hours per day', q: false, unit: 'h/day', value: 16, tex: 'h_\\text{op}' },
        tc: { name: 'time between operations', q: 'time', unit: 's', value: 5, tex: 't_\\text{cycle}' }
      },
      note: 'As in ISO 13849-1 for components that wear by cycles.',
      practice: { unknowns: ['nop', 'tc'] },
      stories: { nop: 'A valve operates every {tc}, {hop} on {dop}. How many operations does it make in a year?' }
    },
    {
      name: 'Mean time to dangerous failure from B10d',
      expr: 'MTTF = B10/(0.1*nop)', tex: '\\mathrm{MTTF}_D = \\dfrac{B_{10D}}{0.1\\,n_\\text{op}}',
      vars: {
        MTTF: { name: 'mean time to dangerous failure', q: false, unit: 'years', tex: '\\mathrm{MTTF}_D' },
        B10: { name: 'cycles until 10 % fail dangerously (B10d)', q: false, unit: 'cycles', value: 20000000, tex: 'B_{10D}' },
        nop: { name: 'operations per year', q: false, unit: 'cycles/year', value: 2534400, tex: 'n_\\text{op}' }
      },
      note: 'ISO 13849-1 grades a channel: low 3–10 years, medium 10–30, high 30–100. Replace the component before B10d/n_op years of use.',
      practice: { unknowns: ['MTTF', 'nop'] },
      stories: { MTTF: 'A valve with a B10d of {B10} makes {nop}. What is its MTTF_D?' }
    }
  ],
  examples: [
    {
      title: 'The dump valve of a safety circuit',
      q: 'A dump valve with B10d = 20 million cycles is switched every time a guard door opens — every 5 s, 16 h a day, 220 days a year. Find its MTTF_D and when it should be replaced.',
      steps: [
        '$n_\\text{op} = 220 \\times 16 \\times 3600/5 = 2.53\\times10^6$ operations a year.',
        '$\\mathrm{MTTF}_D = 2\\times10^7/(0.1 \\times 2.53\\times10^6) = 79$ years: high.',
        'Replacement: $B_{10D}/n_\\text{op} = 7.9$ years.'
      ],
      a: 'MTTF_D ≈ 79 years (high); replace after about 8 years.'
    }
  ],
  quiz: [
    { q: 'ISO 4414 requires a means of isolating a pneumatic system that…', choices: ['cuts the supply, exhausts the system and can be locked', 'only closes the supply', 'is operated from the control panel only', 'is a relief valve'], a: 0,
      why: 'Isolation must remove the energy — supply cut and downstream exhausted — and be lockable for maintenance.' },
    { q: 'What must happen when the air supply fails and later returns?', choices: ['No hazardous motion either time', 'The machine resumes where it stopped', 'All cylinders retract fully', 'The machine must restart on its own'], a: 0,
      why: 'Loss and restoration of energy must not cause hazardous motion; soft start, defined valve positions and load holding take care of it.' },
    { q: 'A valve with B10d = 10 million cycles makes 1 million operations a year. Its MTTF_D, in years?', answer: 100, unit: 'years', tol: 0.01,
      why: '$10^7/(0.1 \\times 10^6) = 100$ years.' },
    { q: 'Following ISO 4414 replaces the need for a risk assessment of the machine.', a: false,
      why: 'It is a general standard; the specific machine still needs its risk assessment (ISO 12100) and validated safety functions.' },
    { q: 'Which document must come with a pneumatic system under ISO 4414?', choices: ['A circuit diagram with symbols to ISO 1219, with settings and maintenance instructions', 'A photograph of the machine', 'The compressor\'s invoice', 'Nothing, if it is small'], a: 0,
      why: 'Information for use — diagram, parts, settings, maintenance — is part of the requirements.' }
  ],
  applications: ['Designing and approving new pneumatic machines.', 'Modifying existing machines without losing their conformity.', 'Estimating the reliability of pneumatic safety components.'],
  history: 'ISO 4414 first appeared in 1982 and was revised in 1998 and 2010; the 2010 edition brought it into line with ISO 12100 and the risk-assessment approach of the Machinery Directive.'
},

{
  id: 'pressure-equipment', parent: 'pneumatic-safety-topic', title: 'Pressure equipment: receivers and inspection', level: 2,
  short: 'Air receivers, dryers and filter housings are pressure vessels: designed for a maximum allowable pressure, protected by a safety valve, drained of the condensate that corrodes them from inside, and inspected at intervals set by the maker and the law — because the energy they hold can level a room.',
  keywords: ['air receiver', 'pressure vessel', 'PED', 'Pressure Equipment Directive', 'simple pressure vessel', 'PS·V', 'safety valve', 'relief valve', 'inspection', 'written scheme of examination', 'hydrostatic test', 'hoop stress', 'corrosion', 'drain', 'ASME'],
  prereq: ['receivers', 'energy-in-compressed-air', 'pneumatic-safety'],
  related: ['receiver-sizing', 'condensate-drains', 'iso-4414', 'maintenance-pneu', 'physics:stress-strain', 'hydraulics:accumulators'],
  body: `
A receiver is a quiet steel tank in a corner, and it is easy to forget that it is the most energetic object in most workshops. A 500 L receiver at 10 bar holds about 0.7 MJ — as much energy as a one-tonne car at 130 km/h — and the air releases it in milliseconds if the shell tears. That is why pressure vessels are designed, built, marked, installed and inspected under rules of their own.

### Design: pressure, stress and a margin
The wall of a cylindrical shell carries the **hoop stress**

$$\\sigma = \\frac{p\\,D}{2\\,t}$$

twice the stress along the axis, so vessels split lengthwise. A receiver of 600 mm diameter with a 4 mm wall at 11 bar gauge sees 82 MPa; corroded to 2.5 mm the stress rises to 132 MPa, well on the way to the 235 MPa at which a common structural steel yields. The **maximum allowable pressure PS** on the nameplate is the limit the design allows with its margins; the safety valve is set at or below it.

### The fittings that keep it safe
- **Safety valve**, set at or below PS and able to pass the full output of the compressor. Nothing may be fitted between the vessel and its safety valve that could isolate it. Never adjust, plug or weight it; lift its test lever as the maker advises.
- **Pressure gauge**, readable, with PS marked.
- **Drain** at the lowest point. Condensate collects in the bottom and corrodes the shell from inside, where nobody sees it — drain daily or fit an automatic drain and check it works ([[condensate-drains]]).
- **Nameplate**: maker, year, serial number, PS, volume, temperature range, test pressure.

### Rules and inspection
The law classifies vessels by pressure and by the product $PS\\cdot V$ in bar·litres. In the EU, welded air receivers up to 30 bar and 10 000 bar·L fall under the Simple Pressure Vessels Directive 2014/29/EU (very small ones, up to 50 bar·L, are built to sound engineering practice), larger or higher-pressure equipment under the Pressure Equipment Directive 2014/68/EU. In the USA, receivers are built to the ASME Boiler and Pressure Vessel Code and OSHA requires a drain, a gauge and a safety valve; in the UK the Pressure Systems Safety Regulations 2000 require a written scheme of examination by a competent person. Other countries have similar schemes: the user must know which applies.

Typical in-service inspection: an external look every year (corrosion, damage, the drain, the valve), and an internal inspection or wall-thickness measurement every few years. Pressure tests are **hydrostatic** — with water, which stores almost no energy — never with air.

> [!warn] Never weld on, drill, heat or modify a receiver, and never raise its pressure above PS. Exhaust it completely before opening any fitting, and treat a dented, bulging or badly corroded vessel as dangerous until a competent person has examined it.
`,
  ideas: [
    'A receiver stores energy of order p·V: hundreds of kilojoules for a workshop tank.',
    'Hoop stress σ = pD/(2t) is twice the axial stress; corrosion thins the wall and raises it.',
    'A safety valve set at or below PS, a gauge, a drain and a nameplate are required — nothing may isolate the safety valve.',
    'Condensate corrodes receivers from inside: drain daily or check the automatic drain.',
    'The law classifies vessels by PS and PS·V; inspection intervals come from the maker and national rules; tests are hydrostatic.'
  ],
  pitfalls: [
    'A receiver is just a tank — It is a pressure vessel storing energy comparable to a car at speed; it is designed, marked and inspected accordingly.',
    'A pressure test with air is the most realistic — A pneumatic test stores the full energy of the air; a failure becomes an explosion. Tests are done with water.',
    'Corrosion shows on the outside first — Condensate attacks the bottom of the shell from inside; only draining, inspection and thickness measurement reveal it.'
  ],
  formulas: [
    {
      name: 'Hoop stress in a receiver shell',
      expr: 'sigma = p*D/(2*t)', tex: '\\sigma = \\dfrac{p_g\\,D}{2\\,t}',
      vars: {
        sigma: { name: 'hoop stress in the wall', q: 'stress', unit: 'MPa', tex: '\\sigma' },
        p: { name: 'internal pressure (gauge)', q: 'pressure', unit: 'bar', value: 11, tex: 'p_g' },
        D: { name: 'shell diameter', q: 'length', unit: 'mm', value: 600 },
        t: { name: 'wall thickness', q: 'length', unit: 'mm', value: 4 }
      },
      note: 'Thin-walled cylinder (t much smaller than D). The axial stress is half of it; heads, nozzles and welds need their own rules.',
      practice: { unknowns: ['sigma', 't'] },
      stories: { sigma: 'A receiver of {D} diameter with a wall of {t} holds {p}. What is the hoop stress?', t: 'A receiver of {D} diameter at {p} must keep the hoop stress to {sigma}. What wall is needed?' }
    },
    {
      name: 'Energy released if a receiver fails',
      expr: 'E = (p + patm)*V/(g - 1)*(1 - (patm/(p + patm))^((g - 1)/g))', tex: 'E = \\dfrac{(p_g + p_\\text{atm})V}{\\gamma - 1}\\left[1 - \\left(\\dfrac{p_\\text{atm}}{p_g + p_\\text{atm}}\\right)^{(\\gamma - 1)/\\gamma}\\right]',
      vars: {
        E: { name: 'energy of adiabatic expansion', q: 'energy', unit: 'kJ' },
        p: { name: 'pressure in the receiver (gauge)', q: 'pressure', unit: 'bar', value: 10, tex: 'p_g' },
        V: { name: 'receiver volume', q: 'volume', unit: 'L', value: 500 },
        patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' },
        g: { name: 'ratio of specific heats of air', value: 1.4, fixed: true, tex: '\\gamma' }
      },
      note: 'The work the air does expanding adiabatically to atmospheric pressure — the usual measure of the blast energy of a burst gas vessel.',
      practice: { unknowns: ['E', 'V'] },
      stories: { E: 'A receiver of {V} holds air at {p}. How much energy would it release if it burst?' }
    },
    {
      name: 'Pressure–volume product',
      expr: 'PV = PS*V', tex: '\\Pi = \\mathrm{PS}\\cdot V',
      vars: {
        PV: { name: 'pressure–volume product Π', q: false, unit: 'bar·L', tex: '\\Pi' },
        PS: { name: 'maximum allowable pressure PS (gauge)', q: false, unit: 'bar', value: 11, tex: '\\mathrm{PS}' },
        V: { name: 'volume', q: false, unit: 'L', value: 500 }
      },
      note: 'The figure by which pressure-equipment rules sort vessels into classes (for example 50, 200, 3000 and 10 000 bar·L in the EU simple-pressure-vessel rules).',
      practice: { unknowns: ['PV', 'V'] },
      stories: { PV: 'A receiver of {V} has a maximum allowable pressure of {PS}. What is its PS·V?' }
    }
  ],
  examples: [
    {
      title: 'What a workshop receiver holds',
      q: 'A 500 L receiver is charged to 10 bar gauge. How much energy would its air release in an adiabatic expansion to atmosphere, and what does that compare with?',
      steps: [
        '$p_1 = 11.01$ bar absolute; $p_1 V = 1.101\\times10^6 \\times 0.5 = 5.51\\times10^5$ J.',
        '$(1.013/11.01)^{0.2857} = 0.506$; $E = 5.51\\times10^5/0.4 \\times (1 - 0.506) = 6.80\\times10^5$ J.',
        'A 1000 kg car with that kinetic energy would move at $\\sqrt{2 \\times 680\\,000/1000} = 36.9$ m/s = 133 km/h.'
      ],
      a: 'About 0.68 MJ — a tonne of car at 133 km/h.'
    },
    {
      title: 'Corrosion and the wall stress',
      q: 'A 600 mm receiver built with a 4 mm wall runs at 11 bar gauge. Inspection finds the bottom corroded to 2.5 mm. What happened to the hoop stress?',
      steps: ['New: $\\sigma = 1.1\\times10^6 \\times 0.6/(2 \\times 0.004) = 82.5$ MPa.', 'Corroded: $1.1\\times10^6 \\times 0.6/(2 \\times 0.0025) = 132$ MPa.', 'A rise of 60 %, with pits concentrating stress further: the vessel must be taken out of service or re-rated by a competent person.'],
      a: 'From 82 to 132 MPa — the vessel is no longer fit for its PS.'
    }
  ],
  quiz: [
    { q: 'Where may a shut-off valve be fitted between a receiver and its safety valve?', choices: ['Nowhere: nothing may isolate the safety valve', 'Anywhere, if it is locked open', 'Only on large receivers', 'Only during inspection'], a: 0,
      why: 'A closed valve there would leave the vessel unprotected; the safety valve must always see the vessel\'s pressure.' },
    { q: 'What is the hoop stress in a 500 mm receiver with a 3 mm wall at 10 bar gauge?', answer: 83.3, unit: 'MPa', tol: 0.02,
      why: '$\\sigma = 10^6 \\times 0.5/(2 \\times 0.003) = 83.3$ MPa.' },
    { q: 'Why are pressure vessels proof-tested with water rather than air?', choices: ['Water stores almost no energy, so a failure does not explode', 'Water is cheaper', 'Air would corrode the vessel', 'Water tests at a higher pressure'], a: 0,
      why: 'Liquid is nearly incompressible; a test failure only leaks. Air would release its stored energy as a blast.' },
    { q: 'Why must a receiver be drained regularly?', choices: ['Condensate collects inside and corrodes the shell', 'To lower the pressure', 'To cool the air', 'To remove oil for recycling only'], a: 0,
      why: 'Water sits in the bottom and thins the wall from inside, out of sight.' },
    { q: 'Doubling a receiver\'s volume at the same pressure doubles the energy it would release.', a: true,
      why: 'At a given pressure the expansion energy is proportional to the volume.' }
  ],
  problems: [
    { q: 'A 270 L receiver is charged to 11 bar gauge. What is its PS·V, and roughly how much energy would a burst release?', answer: 411, unit: 'kJ', tol: 0.03,
      steps: ['$PS\\cdot V = 11 \\times 270 = 2970$ bar·L.', '$p_1 = 12.01$ bar; $(1.013/12.01)^{0.2857} = 0.4933$.', '$E = 12.01\\times10^5 \\times 0.27/0.4 \\times (1 - 0.4933) = 4.11\\times10^5$ J ≈ 410 kJ.'] }
  ],
  applications: ['Specifying, siting and registering air receivers.', 'Planning inspections and draining routines.', 'Assessing a corroded or damaged vessel before it is used again.'],
  history: 'Boiler explosions killed thousands in the nineteenth century; the inspection societies and design codes founded in response (the ASME code dates from 1914) grew into today\'s pressure-equipment rules, which apply to compressed-air receivers as much as to boilers.'
},

{
  id: 'noise-silencers', parent: 'pneumatic-safety-topic', title: 'Noise and silencers', level: 1,
  short: 'An unsilenced valve exhaust at 6 bar can exceed 100 dB(A) at a metre — loud enough to damage hearing within minutes a day. Silencers take 15–30 dB off, blow nozzles and piped exhausts do the rest, and hearing protection covers what is left.',
  keywords: ['noise', 'silencer', 'muffler', 'exhaust noise', 'dB(A)', 'decibel', 'noise exposure', 'LEX,8h', 'hearing protection', 'hearing loss', 'blow gun noise', 'sintered silencer', 'action value', 'Directive 2003/10/EC'],
  prereq: ['way-valves', 'choked-flow', 'physics:sound-intensity'],
  related: ['pneumatic-safety', 'iso-4414', 'troubleshooting-pneu', 'maintenance-pneu', 'air-leaks', 'electronics:decibels', 'physics:the-ear'],
  body: `
Every stroke of a pneumatic cylinder ends with a burst of air leaving its valve: the air in the chamber, at six or seven times atmospheric pressure, escapes through a small port at the speed of sound. The turbulent jet it forms is loud — an unsilenced ¼-inch exhaust at 6 bar can exceed **100 dB(A) at one metre** — and a machine with a dozen valves cycling all day is a serious hearing hazard.

### Decibels in a line
Sound levels are logarithmic ([[physics:sound-intensity]]): every 10 dB is ten times the sound energy, every 3 dB twice. Two equal sources are 3 dB louder than one, ten are 10 dB louder; moving from 1 m to 2 m from a small source takes off 6 dB in the open (less in a reverberant hall). An exhaust that sounds only in short bursts counts by its share of the time: 96 dB(A) for 0.3 s every 3 s averages to $96 + 10\\log_{10}0.1 = 86$ dB(A).

| Source, at 1 m | Typical level |
|---|---|
| Open exhaust of a ¼ in valve, 6 bar | 95–105 dB(A) |
| The same with a sintered silencer | 75–85 dB(A) |
| Open blow gun, 6 bar | 95–105 dB(A) |
| Multi-hole quiet blow nozzle | 75–85 dB(A) |
| Enclosed screw compressor | 65–75 dB(A) |

### How much is too much
Hearing damage depends on the **dose**: level and time together, summed as the daily exposure $L_{EX,8h} = L_A + 10\\log_{10}(T/8\\,\\mathrm{h})$. Every 3 dB more halves the safe time: 85 dB(A) for 8 h, 88 for 4 h, 94 for 1 h, 100 dB(A) for only 15 minutes. In the EU (Directive 2003/10/EC) the lower and upper exposure action values are 80 and 85 dB(A), and the limit, counting hearing protection, is 87 dB(A); above 85 hearing protection must be worn and the noise reduced by a programme of measures. In the USA, OSHA sets 90 dBA over 8 h with a 5 dB exchange rate and requires a hearing-conservation programme from 85 dBA. Hearing lost to noise does not come back ([[physics:the-ear]]).

### Silencers and other cures
- **Silencers** screwed into the exhaust ports slow and spread the jet in a porous body — sintered bronze or plastic, woven wire, fibre — and take 15–30 dB off. The bigger and finer the body, the quieter; high-performance types reach 30 dB and more.
- They also **restrict** the exhaust: a silencer is a [[sonic-conductance|conductance]] in series with the valve, and one that clogs with oil and dirt slows the cylinder — a classic fault ([[troubleshooting-pneu]]). Size them for the port and clean or replace them.
- **Central exhausts** pipe many valves' exhaust into one large silencer or out of the room.
- **Blowing**: use multi-hole or air-amplifying nozzles at the lowest pressure that works, and blow only when a part is present.
- **Leaks** hiss: fixing them saves air and noise together ([[leak-management]]).
- **Hearing protection** — plugs or muffs rated at 20–35 dB, which deliver less in real use — is the last line, not the first.

> [!warn] Pneumatic exhausts and blow guns can damage hearing within minutes a day. Fit silencers to every exhaust, reduce noise at the source, and wear hearing protection wherever the levels call for it; never use an open blow gun near someone's ear.
`,
  ideas: [
    'A choked exhaust jet at 6 bar can exceed 100 dB(A) at 1 m; a silencer takes 15–30 dB off.',
    'Decibels add logarithmically: 2 equal sources +3 dB, 10 sources +10 dB; doubling the distance −6 dB in the open.',
    'The daily exposure L_EX,8h = L + 10 log₁₀(T/8 h): every 3 dB more halves the safe time.',
    'EU action values 80 and 85 dB(A), limit 87 dB(A); OSHA 90 dBA with a 5 dB exchange rate.',
    'A silencer is also a restriction: a clogged one slows the cylinder.'
  ],
  pitfalls: [
    'Two 90 dB exhausts make 180 dB — Decibels are logarithmic: two equal sources are 93 dB.',
    'Short bursts do not count — Exposure is energy over time; many short loud bursts add up to a real dose.',
    'A clogged silencer is quieter, so no harm done — It chokes the exhaust, slows the cylinder, and a silencer that bursts or is removed in frustration leaves an open exhaust.'
  ],
  formulas: [
    {
      name: 'Daily noise exposure',
      expr: 'LEX = LA + 10*log10(T/T0)', tex: 'L_{EX,8h} = L_A + 10\\log_{10}\\dfrac{T}{T_0}',
      vars: {
        LEX: { name: 'daily noise exposure level (A-weighted)', q: 'soundlevel', unit: 'dB', tex: 'L_{EX,8h}' },
        LA: { name: 'equivalent sound level while exposed (A-weighted)', q: 'soundlevel', unit: 'dB', value: 90, tex: 'L_A' },
        T: { name: 'exposure time per day', q: 'time', unit: 'h', value: 4 },
        T0: { name: 'reference day', q: 'time', unit: 'h', value: 8, fixed: true, tex: 'T_0' }
      },
      note: 'Equal-energy rule with a 3 dB exchange rate, as in ISO 9612 and the EU directive. OSHA in the USA uses 5 dB for its permissible limit.',
      practice: { unknowns: ['LEX', 'T'] },
      stories: { LEX: 'A fitter works for {T} a day at a level of {LA}. What is the daily exposure?', T: 'The level near a machine is {LA}. How long a day can someone work there before the daily exposure reaches {LEX}?' }
    },
    {
      name: 'Level of several equal sources',
      expr: 'L = L1 + 10*log10(n)', tex: 'L = L_1 + 10\\log_{10} n',
      vars: {
        L: { name: 'combined level', q: 'soundlevel', unit: 'dB' },
        L1: { name: 'level of one source', q: 'soundlevel', unit: 'dB', value: 85, tex: 'L_1' },
        n: { name: 'number of equal sources', value: 4, int: true }
      },
      note: 'Energies add; for unequal sources add 10^(Lᵢ/10) and take 10 log₁₀ of the sum.',
      practice: { unknowns: ['L', 'n'] },
      stories: { L: 'A machine has {n} exhausts, each producing {L1} at the operator. What is the combined level?' }
    },
    {
      name: 'Level of an intermittent source',
      expr: 'Leq = L + 10*log10(f)', tex: 'L_\\text{eq} = L + 10\\log_{10} f',
      vars: {
        Leq: { name: 'equivalent continuous level', q: 'soundlevel', unit: 'dB', tex: 'L_\\text{eq}' },
        L: { name: 'level while it sounds', q: 'soundlevel', unit: 'dB', value: 96 },
        f: { name: 'share of the time it sounds', q: 'ratio', unit: '%', value: 10, min: 0.01, max: 100 }
      },
      note: 'A burst of level L lasting a fraction f of the time carries the energy of a steady level L + 10 log₁₀ f.',
      practice: { unknowns: ['Leq', 'f'] },
      stories: { Leq: 'An exhaust reaches {L} and sounds for {f} of the time. What is its equivalent continuous level?' }
    },
    {
      name: 'Level at another distance',
      expr: 'L2 = L1 - 20*log10(r2/r1)', tex: 'L_2 = L_1 - 20\\log_{10}\\dfrac{r_2}{r_1}',
      vars: {
        L2: { name: 'level at distance r₂', q: 'soundlevel', unit: 'dB', tex: 'L_2' },
        L1: { name: 'level at distance r₁', q: 'soundlevel', unit: 'dB', value: 96, tex: 'L_1' },
        r1: { name: 'distance r₁', q: 'length', unit: 'm', value: 1, tex: 'r_1' },
        r2: { name: 'distance r₂', q: 'length', unit: 'm', value: 4, tex: 'r_2' }
      },
      note: 'A small source in the open (inverse-square law): −6 dB per doubling of distance. In a hall, reflections make the level fall more slowly.',
      practice: { unknowns: ['L2', 'r2'] },
      stories: { L2: 'An exhaust gives {L1} at {r1}. What level reaches a workstation {r2} away?' }
    }
  ],
  examples: [
    {
      title: 'The operator beside an unsilenced press',
      q: 'An operator stands 1 m from a press whose exhaust reaches 96 dB(A) in bursts of 0.3 s every 3 s, for a full 8 h shift. What is her daily exposure, and what does a 25 dB silencer change?',
      steps: [
        'Share of time: $0.3/3 = 10$ %; $L_\\text{eq} = 96 + 10\\log_{10}0.1 = 86$ dB(A).',
        'Over 8 h, $L_{EX,8h} = 86$ dB(A): above the EU upper action value of 85 — hearing protection is compulsory and the noise must be reduced.',
        'With the silencer: $86 - 25 = 61$ dB(A), comfortably below the lower action value.'
      ],
      a: '86 dB(A) unsilenced; about 61 dB(A) with the silencer.'
    },
    {
      title: 'Twelve exhausts',
      q: 'A machine has 12 valves whose silenced exhausts each give 78 dB(A) at the operator. What is the combined level, and what if the silencers were all removed (+25 dB each)?',
      steps: ['$L = 78 + 10\\log_{10}12 = 78 + 10.8 = 88.8$ dB(A).', 'Without silencers: $88.8 + 25 = 113.8$ dB(A) — a safe time of well under a minute a day.'],
      a: 'About 89 dB(A) silenced, nearly 114 dB(A) without.'
    }
  ],
  quiz: [
    { q: 'Two exhausts each produce 88 dB(A) at a workstation. Together they give…', choices: ['91 dB(A)', '176 dB(A)', '88 dB(A)', '94 dB(A)'], a: 0,
      why: 'Twice the energy is +3 dB.' },
    { q: 'By what factor does a 25 dB silencer reduce the sound energy?', answer: 316, tol: 0.02,
      why: '$10^{25/10} = 10^{2.5} = 316$.' },
    { q: 'Someone works 2 h a day at 94 dB(A). What is the daily exposure?', answer: 88, unit: 'dB', tol: 0.01,
      why: '$94 + 10\\log_{10}(2/8) = 94 - 6 = 88$ dB(A).' },
    { q: 'Moving from 1 m to 4 m from a small exhaust in the open lowers the level by…', choices: ['12 dB', '6 dB', '4 dB', '24 dB'], a: 0,
      why: 'Two doublings of distance at 6 dB each.' },
    { q: 'A silencer that has clogged with oil is quieter and therefore does no harm.', a: false,
      why: 'It restricts the exhaust and slows the cylinder; it should be cleaned or replaced.' }
  ],
  applications: ['Choosing silencers and blow nozzles for a machine.', 'Noise assessments and hearing-conservation programmes.', 'Finding the cause of a slow cylinder: clogged silencers.'],
  sim: 'seq-silencer'
},

{
  id: 'maintenance-pneu', parent: 'pneumatic-safety-topic', title: 'Maintenance', level: 1,
  short: 'Keeping a pneumatic system reliable and cheap to run: drains that work, filters changed on pressure drop, leaks found and fixed, lubrication kept consistent, cylinders and hoses inspected, safety devices tested — on a schedule, with records, and always after isolating the air.',
  keywords: ['maintenance', 'preventive maintenance', 'schedule', 'drain', 'filter element', 'pressure drop', 'leak survey', 'pressure decay test', 'lubrication', 'seal kit', 'rod seal', 'piston seal', 'hose inspection', 'silencer', 'logbook'],
  prereq: ['frl-units', 'condensate-drains', 'air-leaks'],
  related: ['troubleshooting-pneu', 'leak-management', 'air-filters', 'lubricators', 'pressure-equipment', 'noise-silencers', 'pressure-optimisation', 'hydraulics:troubleshooting'],
  body: `
Most pneumatic failures are slow ones: water that the drains no longer remove, a filter that chokes a little more each month, a seal that wears until the cylinder hisses, a leak that nobody hears over the machines. Maintenance catches them while they are still cheap.

### A schedule
| When | What |
|---|---|
| Daily | check automatic drains discharge (or drain receivers and filters by hand); read the pressure at the machines; listen for leaks; top up lubricators where used |
| Weekly | look at filter bowls and the dryer's dew-point indicator; check silencers for oil and dirt |
| Monthly | leak survey with an ultrasonic detector during a quiet shift; read filter pressure drops; inspect hoses for cracks, kinks and chafing; check cylinder mountings and rod alignment |
| Every 6–12 months | change filter elements (at the maker's pressure-drop limit, typically 0.3–0.7 bar, and at least yearly); test safety valves; test emergency stops, two-hand controls and dump valves |
| Yearly and by law | compressor service; receiver inspection to the national scheme ([[pressure-equipment]]) |

### The jobs that matter most
- **Water.** A drain that has failed floods the pipes: corrosion, washed-out grease, sticking valves and frozen lines follow. Test every automatic drain; they are the cheapest insurance in the system ([[condensate-drains]]).
- **Filters.** A dirty element costs energy: every bar of pressure lost upstream must be made up by the compressor at roughly 7 % more power ([[pressure-optimisation]]). Change elements on pressure drop, not on the calendar alone.
- **Leaks.** Typically a quarter of a plant's air leaks away ([[air-leaks]]). Measure the total with a pressure-decay test: with production stopped, charge the system, shut off the compressor and time the fall — the leak flow is the volume times the pressure drop per minute. Tag leaks, fix them, measure again.
- **Lubrication.** Most modern valves and cylinders are greased for life and run on dry air. Once lubricated air has been used, though, the oil washes the factory grease out: the lubricator must then be kept filled and set as the maker advises — never switched off, never turned up to flood the exhausts.
- **Cylinders.** A continuous hiss at the valve exhaust while a cylinder stands still means a worn piston seal; air or oil at the rod means the rod seal or a scored rod. Replace seals with the kit specified, clean and grease on reassembly, and remove the side load that wore them.
- **Records.** A logbook of pressures, pressure drops, leak totals and repairs turns maintenance into trends — and trends into [[digital-pneumatics|condition monitoring]].

> [!warn] Before maintenance, isolate and lock out the air, exhaust the system, prove zero pressure at a gauge and support any load that could move or fall. Never loosen a fitting, a bowl or a silencer under pressure, and restore the air through the soft-start valve with everyone clear.
`,
  ideas: [
    'Most failures come from water, dirt, leaks and wear — all slow, all cheap to catch early.',
    'Test drains daily; change filter elements on pressure drop.',
    'Measure leakage by pressure decay: q = V·Δp/(p_ref·t), then tag, fix and measure again.',
    'Once lubricated air is used, keep lubricating; dry-running components rely on their factory grease.',
    'Isolate, exhaust, lock out and prove zero before any work.'
  ],
  pitfalls: [
    'A filter element is changed once a year whatever happens — It is changed when its pressure drop reaches the limit; a clogged element wastes energy every hour until then.',
    'Adding a lubricator to a dry-running system can only help — Once started it must never stop, because the oil washes out the factory grease; most modern components are better left dry.',
    'Leaks are small, so they are cheap — Together they are typically a quarter of the compressor\'s output, paid for around the clock.'
  ],
  formulas: [
    {
      name: 'Leakage from a pressure-decay test',
      expr: 'q = V*(p1 - p2)/(pr*t)', tex: 'q = \\dfrac{V\\,(p_1 - p_2)}{p_\\text{ref}\\,t}',
      vars: {
        q: { name: 'leakage (free air)', q: 'airflow', unit: 'L/min ANR' },
        V: { name: 'volume of receivers and pipes', q: 'volume', unit: 'L', value: 2000 },
        p1: { name: 'pressure at the start (gauge)', q: 'pressure', unit: 'bar', value: 7.0, tex: 'p_1' },
        p2: { name: 'pressure at the end (gauge)', q: 'pressure', unit: 'bar', value: 6.2, tex: 'p_2' },
        t: { name: 'time of the test', q: 'time', unit: 'min', value: 4 },
        pr: { name: 'reference pressure of free air (ANR)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_\\text{ref}' }
      },
      note: 'With production stopped and the compressor off; isothermal (let the air settle). The leaks at a lower pressure are a little smaller than at working pressure.',
      practice: { unknowns: ['q', 'V'] },
      stories: { q: 'A system of {V} falls from {p1} to {p2} in {t} with everything stopped. How much air is leaking?', V: 'A known leak of {q} makes a system fall from {p1} to {p2} in {t}. What is the system volume?' }
    },
    {
      name: 'Yearly cost of an extra pressure drop',
      expr: 'Cy = P*k/100*dp*h*c', tex: 'C_y = P\\,\\dfrac{k}{100}\\,\\Delta p\\,h\\,c',
      vars: {
        Cy: { name: 'extra cost per year', q: 'money', unit: '$', tex: 'C_y' },
        P: { name: 'compressor power', q: false, unit: 'kW', value: 75 },
        k: { name: 'extra power per bar of pressure', q: false, unit: '% per bar', value: 7 },
        dp: { name: 'extra pressure drop to make up', q: false, unit: 'bar', value: 0.5, tex: '\\Delta p' },
        h: { name: 'running hours per year', q: false, unit: 'h', value: 4000 },
        c: { name: 'electricity price per kWh', q: 'money', unit: '$', value: 0.15 }
      },
      note: 'Rule of thumb: raising a compressor\'s discharge pressure by 1 bar around 7 bar costs about 7 % more power.',
      practice: { unknowns: ['Cy'] },
      stories: { Cy: 'A clogged filter drops {dp}, and the {P} compressor is set that much higher; it runs {h} a year at {c} per kWh. What does the filter cost a year?' }
    }
  ],
  examples: [
    {
      title: 'A weekend leak test',
      q: 'On a Sunday a plant with 1500 L of receivers and about 500 L of pipes is charged to 7.0 bar and the compressors stopped. After 4 minutes the pressure has fallen to 6.2 bar. How much air leaks, and what does it cost at 0.11 kWh per m³ and 0.15 per kWh over 6000 hours?',
      steps: [
        '$q = 2000 \\times 0.8/(1 \\times 4) = 400$ L/min of free air.',
        'Per year: $0.4 \\times 60 \\times 6000 = 144\\,000$ m³.',
        'Energy $144\\,000 \\times 0.11 = 15\\,800$ kWh; cost about ¤2,380 a year.'
      ],
      a: 'About 400 L/min — some 15 800 kWh and ¤2,400 a year.'
    },
    {
      title: 'What a dirty filter costs',
      q: 'The main filter of a 75 kW compressor has a pressure drop of 0.6 bar instead of 0.1 bar when clean, and the compressor is set 0.5 bar higher to compensate. It runs 4000 h a year at 0.15 per kWh. What does the dirty element cost?',
      steps: ['Extra power: $75 \\times 0.07 \\times 0.5 = 2.6$ kW.', 'Per year: $2.6 \\times 4000 = 10\\,500$ kWh, about ¤1,575.'],
      a: 'About ¤1,575 a year — many times the price of a new element.'
    }
  ],
  quiz: [
    { q: 'A system that has run on lubricated air for years is switched to dry air. What is likely?', choices: ['Valves and cylinders wear or stick, because the oil washed out their factory grease', 'They run better', 'Nothing changes', 'The compressor uses less oil'], a: 0,
      why: 'Once lubricated, always lubricated: the original grease is gone.' },
    { q: 'A 3000 L system falls from 7.0 to 6.0 bar in 5 min with production stopped. What is the leakage in L/min of free air?', answer: 600, unit: 'L/min', tol: 0.02,
      why: '$3000 \\times 1/(1 \\times 5) = 600$ L/min.' },
    { q: 'When should a filter element be changed?', choices: ['When its pressure drop reaches the maker\'s limit, and at least yearly', 'Only when it bursts', 'Every week', 'Never, it cleans itself'], a: 0,
      why: 'The pressure drop tells you it is loading up; every extra bar costs about 7 % of the compressor\'s power.' },
    { q: 'A continuous hiss at a valve\'s exhaust while its cylinder stands still at the end of its stroke points to…', choices: ['a worn piston seal (or a leaking spool)', 'a rod seal', 'a clogged silencer', 'a leak in the receiver'], a: 0,
      why: 'Air passing the piston from the pressurised chamber leaves through the other chamber\'s exhaust.' }
  ],
  applications: ['Preventive-maintenance plans for pneumatic machines and compressor rooms.', 'Leak surveys and energy audits.', 'Keeping the documentation that pressure-equipment rules and ISO 4414 require.'],
  sim: 'seq-trouble'
},

{
  id: 'troubleshooting-pneu', parent: 'pneumatic-safety-topic', title: 'Troubleshooting', level: 2,
  short: 'Finding faults in pneumatic systems methodically: describe the symptom exactly, check the supply during a stroke, then follow the circuit diagram from signals to valves to actuators — with tables of the usual causes of slow, jerky, drifting, dead, leaking and noisy behaviour.',
  keywords: ['troubleshooting', 'fault finding', 'diagnosis', 'slow cylinder', 'jerky', 'stick-slip', 'drifting', 'valve not switching', 'leak', 'hiss', 'noisy', 'pressure drop', 'clogged silencer', 'worn seal', 'symptom', 'cause'],
  prereq: ['maintenance-pneu', 'flow-control-pneu', 'iso-1219-pneu'],
  related: ['noise-silencers', 'signal-overlap', 'stick-slip', 'valve-sizing', 'conductance-series', 'sensors-pneu', 'hydraulics:troubleshooting'],
  body: `
Pneumatic faults hide behind vague reports — "the machine is slow", "it sometimes sticks". The skill is to turn the report into a precise symptom and let the circuit diagram point to the few components that could cause it.

### A method
1. **Describe exactly**: which actuator, which direction, always or sometimes, since when, what changed (a new part, a pressure setting, a filter change, the weather).
2. **Check the supply during the stroke**, not at rest: a gauge that reads 6 bar standing still and 3 bar while cylinders move means the supply is starved — a choked filter, an undersized line or a failing regulator.
3. **Follow the diagram** from the signal (is the solenoid energised? is the pilot there?) to the valve (does it switch — try the manual override with everyone clear) to the actuator (what are the chamber pressures?).
4. **Measure and listen**: gauges teed into the cylinder ports, a flow meter in the supply, an ultrasonic detector for leaks.
5. **Swap or half-split**: replace the suspect with a known good part, or cut the system in two and test each half.

### Symptoms and usual causes
| Symptom | Usual causes |
|---|---|
| Slow both ways | supply pressure drops during strokes (choked filter, small regulator or line); valve too small; long or kinked tubing |
| Slow one way | that direction's meter-out throttle closed; the silencer on that exhaust clogged; kinked tube on the exhausting side; extra load or friction that way |
| Jerky, stick-slip | very low speed; meter-in control; dry seals (grease washed out); side load; too little spare force |
| Drifts when it should hold | worn piston seal or leaking spool with a closed-centre valve; leaking pilot check; exhaust-centre valve with a gravity load |
| Does not switch | no electrical signal (coil, cable, controller output); pilot pressure too low; spool stuck by dirt, varnish or swollen seals; both pilots on ([[signal-overlap]]) |
| Hisses | at the valve exhaust while standing: piston or spool seal; at the rod: rod seal or scored rod; at fittings: tube cut badly, not pushed home, damaged O-ring |
| Noisy | missing or broken silencer; cushioning not adjusted (bangs at the ends); speed too high |
| Water in the lines | failed drains or dryer; drops taken from the bottom of the main |

### Why the exhaust usually sets the speed
With meter-out control the air leaving the cylinder is choked in the exhaust path. The free-air flow through it is $C p_B$, which at the chamber pressure $p_B$ is a volume flow $C p_\\text{ref}$ — independent of $p_B$. So the piston runs at about

$$v = \\frac{C\\,p_\\text{ref}}{A}$$

where $C$ is the [[conductance-series|series conductance]] of valve, throttle and silencer. A 50 mm cylinder extending — so exhausting its 16.5 cm² annulus — through valve (1.0), throttle (1.0) and silencer (2.0 dm³/(s·bar)) has $C = 0.67$ and runs at about 0.4 m/s; clog the silencer to 0.3 and the speed falls to 0.17 m/s. Raising the pressure does not help — it only pushes harder against the same choked exhaust.

> [!warn] Fault-finding happens on live machines, so it is dangerous. Keep hands out of the reach of actuators when operating valves by hand or giving signals; exhaust and lock out before disconnecting anything; never search for leaks by feeling for them, and wear eye protection near exhausts.
`,
  ideas: [
    'Turn a vague complaint into an exact symptom: which actuator, which direction, always or sometimes, what changed.',
    'Check the supply pressure during the stroke, not at rest.',
    'Follow the diagram: signal → valve → actuator; measure, listen, swap, half-split.',
    'Slow in one direction points to that direction\'s exhaust path: throttle, silencer, tube.',
    'With a choked exhaust the speed is v ≈ C·p_ref/A, independent of the supply pressure.'
  ],
  pitfalls: [
    'A slow cylinder needs more pressure — With meter-out control the choked exhaust sets the speed; more pressure only adds force and air consumption.',
    'If the coil is energised the valve must switch — A stuck spool, low pilot pressure or a blocked pilot exhaust can all stop it; so can the opposite pilot being held (signal overlap).',
    'A gauge reading at rest shows the supply is fine — Only a reading during the stroke reveals a starved supply.'
  ],
  formulas: [
    {
      name: 'Speed set by a choked exhaust',
      expr: 'v = C*pr/A', tex: 'v = \\dfrac{C\\,p_\\text{ref}}{A}',
      vars: {
        v: { name: 'piston speed', q: 'speed', unit: 'm/s' },
        C: { name: 'sonic conductance of the exhaust path', q: 'flowcond', unit: 'dm³/(s·bar)', value: 0.667 },
        pr: { name: 'reference pressure of free air (ANR)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_\\text{ref}' },
        A: { name: 'area of the exhausting chamber', q: 'area', unit: 'cm²', value: 16.5 }
      },
      note: 'Isothermal, with the exhaust choked (the chamber above roughly 2–3 bar absolute), as it usually is with meter-out control and a moderate load. The supply side must keep up.',
      practice: { unknowns: ['v', 'C'] },
      stories: { v: 'A cylinder exhausts from a chamber of {A} through a path of {C}. How fast does it move?', C: 'A cylinder with an exhausting area of {A} must reach {v}. What conductance must the exhaust path have?' }
    },
    {
      name: 'Three restrictions in series',
      expr: 'C = 1/sqrt(1/C1^2 + 1/C2^2 + 1/C3^2)', tex: 'C = \\dfrac{1}{\\sqrt{1/C_1^2 + 1/C_2^2 + 1/C_3^2}}',
      vars: {
        C: { name: 'combined sonic conductance', q: 'flowcond', unit: 'dm³/(s·bar)' },
        C1: { name: 'valve', q: 'flowcond', unit: 'dm³/(s·bar)', value: 1, tex: 'C_1' },
        C2: { name: 'flow control', q: 'flowcond', unit: 'dm³/(s·bar)', value: 1, tex: 'C_2' },
        C3: { name: 'silencer', q: 'flowcond', unit: 'dm³/(s·bar)', value: 2, tex: 'C_3' }
      },
      note: 'The usual approximation for sonic conductances in series. The smallest one dominates: a clogged silencer or a closed throttle sets the flow of the whole path.',
      practice: { unknowns: ['C', 'C3'] },
      stories: { C: 'An exhaust path runs through a valve of {C1}, a flow control of {C2} and a silencer of {C3}. What is its combined conductance?', C3: 'A path with a valve of {C1} and a flow control of {C2} must keep {C}. How large must the silencer be?' }
    }
  ],
  examples: [
    {
      title: 'The cylinder that got slow',
      q: 'A 50 mm cylinder (20 mm rod) used to extend at 0.4 m/s; now extending takes more than twice as long, while retracting is unchanged. While extending, its rod end exhausts through the valve (1.0), a meter-out throttle (1.0) and a silencer rated 2.0 dm³/(s·bar). What is the likely cause, and what conductance has the path now?',
      steps: [
        'Only one direction is slow: look at the path that exhausts the rod end while extending — its throttle and the silencer on that exhaust.',
        'Before: $C = 1/\\sqrt{1 + 1 + 0.25} = 0.667$ dm³/(s·bar), and with the 16.5 cm² annulus $v = 0.667\\times10^{-8} \\times 10^5/16.5\\times10^{-4} = 0.40$ m/s.',
        'Now below 0.2 m/s: the path must have fallen below about 0.33. With the throttle unchanged, a silencer clogged to $C_3 \\approx 0.3$ gives $C = 1/\\sqrt{1 + 1 + 11.1} = 0.28$ and $v = 0.17$ m/s.',
        'Unscrew the silencer (with the air exhausted): if the cylinder now runs fast and loud, replace it.'
      ],
      a: 'A clogged silencer on the exhaust used while extending; the path is down to about 0.28 dm³/(s·bar).'
    },
    {
      title: 'The gauge that lies',
      q: 'A machine\'s gauge reads 6.0 bar whenever someone looks, yet a clamp sometimes fails to hold its part. A gauge fitted near the clamp shows 6.0 bar at rest and 3.4 bar while three other cylinders move. What is wrong?',
      steps: ['The pressure collapses only under flow: the supply cannot deliver the peak demand.', 'Suspects: a choked filter element, a small regulator, a long thin supply line, a sticking regulator.', 'Measure the pressure drop across the filter during the strokes; if it is large, change the element — and consider a local receiver near the machine for the peak demand.'],
      a: 'A starved supply — most often a clogged filter or an undersized regulator or line.'
    }
  ],
  quiz: [
    { q: 'A cylinder extends slowly but retracts normally. Where do you look first?', choices: ['The throttle and silencer on the exhaust used while extending (rod end)', 'The compressor', 'The piston seal', 'The solenoid coil'], a: 0,
      why: 'With meter-out control the exhausting side sets the speed; while extending, the rod end exhausts.' },
    { q: 'The gauge at a machine reads 6 bar at rest and 3 bar during strokes. The likely cause is…', choices: ['a starved supply: clogged filter, small regulator or line', 'a worn piston seal', 'a clogged silencer', 'a solenoid fault'], a: 0,
      why: 'A pressure that sags only under flow points upstream, to a restriction in the supply.' },
    { q: 'An exhausting chamber of 8 cm² vents through a path of C = 0.5 dm³/(s·bar). About how fast does the piston move?', answer: 0.625, unit: 'm/s', tol: 0.02,
      why: '$v = 0.5\\times10^{-8} \\times 10^5/8\\times10^{-4} = 0.625$ m/s.' },
    { q: 'The coil of a solenoid valve is energised, the valve does not switch, but the manual override moves the cylinder. Which of these is not a possible cause?', choices: ['A worn piston seal in the cylinder', 'A burnt-out coil', 'Too little pilot pressure', 'A blocked pilot exhaust'], a: 0,
      why: 'The cylinder moves with the override, so the cylinder is fine; the fault lies in the valve\'s operation — coil, pilot supply or pilot exhaust.' },
    { q: 'Raising the supply pressure is a good cure for a cylinder slowed by a clogged silencer.', a: false,
      why: 'The choked exhaust still limits the speed; replace or clean the silencer.' }
  ],
  applications: ['Fault-finding on production machines.', 'Commissioning new machines: comparing measured and expected stroke times.', 'Training maintenance technicians.'],
  sim: 'seq-trouble'
}

);
