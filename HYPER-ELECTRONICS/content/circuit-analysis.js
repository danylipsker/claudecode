/* HYPER-ELECTRONICS · content/circuit-analysis.js — systematic ways to find every
 * voltage and current, and to replace a network by something simpler. The running
 * example (12 V behind 2 Ω and 6 V behind 4 Ω sharing a 6 Ω load) is the default of
 * the fund-kirchhoff simulation, so every method can be checked against it. */
Hyper.add(

{
  id: 'kirchhoffs-laws', parent: 'circuit-analysis', title: 'Kirchhoff\'s laws', level: 1,
  short: 'The current law: what flows into a node flows out. The voltage law: round any loop the voltages add to zero. Together with each part\'s own law they solve any circuit.',
  keywords: ['Kirchhoff', 'KCL', 'KVL', 'current law', 'voltage law', 'junction rule', 'loop rule', 'node', 'loop', 'branch', 'conservation of charge', 'sign convention'],
  prereq: ['series-parallel', 'charge-and-current', 'voltage', 'physics:kirchhoffs-laws'],
  related: ['nodal-analysis', 'mesh-analysis', 'superposition', 'power-energy'],
  body: `
Two laws, both bookkeeping, are enough to analyse any circuit made of lumped parts. Gustav Kirchhoff stated them in 1845, and every circuit simulator — including the one that runs the simulations on these pages — is built on them.

### The current law (KCL): what flows in flows out
At any node the currents flowing in add up to the currents flowing out. Counting currents in as positive and out as negative,

$$\\sum_k I_k = 0$$

Charge is conserved and a node cannot store it, so there is nothing else it can do. The law holds for any closed boundary, not just a single junction: draw a box round a whole chip and the currents in all its pins add to zero; the current into a board's supply connector comes back out of its ground connector, every milliamp of it. Remember that when you lay out a PCB — the **return current** is as real as the supply current, and it flows along the path of least impedance back to the source.

### The voltage law (KVL): round a loop, the sum is zero
Go round any closed loop adding the voltages, rises positive and drops negative, and the total is zero:

$$\\sum_k V_k = 0$$

Voltage is a difference of potential, and back at the starting point you are back at the starting potential — like a round walk in the hills. The rises across the sources exactly pay for the drops across everything else. KVL is energy conservation, per unit of charge.

### Signs, and why a negative answer is fine
Before solving, draw an arrow for every branch current and mark + and − on every voltage. These are **reference directions** — guesses. Write the laws using them, solve, and any quantity that comes out negative simply points the other way. Use the **passive sign convention** for each part (current arrow entering at its + mark), and $V = IR$ keeps a plus sign for every resistor.

### How many equations?
A circuit with $n$ nodes and $b$ branches has $n - 1$ independent KCL equations (the last node's follows from the others) and $b - n + 1$ independent KVL equations — one per window of a circuit drawn flat. With each branch's own law ($V = IR$ and the like) that is exactly enough to find every current and voltage. The systematic versions are [[nodal-analysis]] (KCL at every node) and [[mesh-analysis]] (KVL round every window).

### Two sources sharing a load
Take a 12 V source with 2 Ω of internal resistance and a 6 V source with 4 Ω, both connected across a 6 Ω load — the circuit of the simulation below. Call the voltage at the top of the load $V_A$. KCL at that node says the currents arriving through the two sources' resistances leave through the load:

$$\\frac{12 - V_A}{2} + \\frac{6 - V_A}{4} = \\frac{V_A}{6}$$

so $V_A = 90/11 = 8.18\\ \\mathrm{V}$. The 6 V source's current, $(6 - 8.18)/4 = -0.55\\ \\mathrm{A}$, is negative: it flows **into** its + terminal. The stronger source is charging the weaker one — just what happens when a flat battery is connected in parallel with a good one.

### When the laws bend
KCL and KVL assume **lumped** circuits: parts small compared with the wavelength of the signals, and no changing magnetic flux threading the loop. A loop that links a changing magnetic field has an induced EMF around it ([[physics:faradays-law|Faraday's law]]) — the principle of the transformer, and the reason a large loop area in a fast or high-current circuit picks up hum and noise. At high frequencies wires become [[transmission-lines]], and the lumped picture has to be replaced.
`,
  ideas: [
    'KCL: at every node the currents in equal the currents out (charge is conserved).',
    'KVL: round every closed loop the voltage rises equal the drops (potential is single-valued).',
    'Reference directions are guesses; a negative result means the opposite direction.',
    'n nodes and b branches give n − 1 independent KCL and b − n + 1 independent KVL equations.',
    'KCL applies to any closed boundary: the return current always equals the supply current.'
  ],
  pitfalls: [
    'A negative current means a mistake — It means the current flows against the arrow you drew; the magnitude is still right.',
    'You can write KVL around every loop you can find and get new information — Only b − n + 1 loops are independent; the others are sums of those.',
    'KVL holds for any loop whatsoever — Not when the loop encloses a changing magnetic flux: then an induced EMF appears round it, which is exactly how transformers work.'
  ],
  formulas: [
    {
      name: 'Current law at a node with three branches',
      expr: 'I3 = I1 + I2', tex: 'I_3 = I_1 + I_2',
      vars: {
        I3: { name: 'current leaving through branch 3', q: 'current', unit: 'mA', signed: true, tex: 'I_3' },
        I1: { name: 'current arriving through branch 1', q: 'current', unit: 'mA', value: 12, signed: true, tex: 'I_1' },
        I2: { name: 'current arriving through branch 2', q: 'current', unit: 'mA', value: -3, signed: true, tex: 'I_2' }
      },
      note: 'A negative arriving current is really leaving. The sum of everything in equals the sum of everything out.',
      stories: { I2: '{I1} arrives at a node through one wire and {I3} leaves through another. What arrives through the third wire?' }
    },
    {
      name: 'Voltage law round a loop',
      expr: 'Vs = V1 + V2 + V3', tex: 'V_s = V_1 + V_2 + V_3',
      vars: {
        Vs: { name: 'source voltage (the rise)', q: 'voltage', unit: 'V', value: 12, signed: true, tex: 'V_s' },
        V1: { name: 'drop across the first part', q: 'voltage', unit: 'V', value: 3.3, signed: true, tex: 'V_1' },
        V2: { name: 'drop across the second part', q: 'voltage', unit: 'V', value: 5.1, signed: true, tex: 'V_2' },
        V3: { name: 'drop across the third part', q: 'voltage', unit: 'V', signed: true, tex: 'V_3' }
      },
      solveFor: 'V3',
      stories: { V3: 'A {Vs} supply drives a loop of three parts. Two drop {V1} and {V2}. What does the third drop?' }
    }
  ],
  examples: [
    {
      title: 'Two sources sharing a load',
      q: 'A 12 V source with 2 Ω internal resistance and a 6 V source with 4 Ω are both connected across a 6 Ω load (positive terminals to the top of the load). Find all three currents and check the power balance.',
      steps: [
        'Let $V_A$ be the voltage at the top of the load. KCL: $\\frac{12 - V_A}{2} + \\frac{6 - V_A}{4} = \\frac{V_A}{6}$.',
        'Multiply by 12: $72 - 6V_A + 18 - 3V_A = 2V_A$, so $V_A = 90/11 = 8.18\\ \\mathrm{V}$.',
        'Currents: from the 12 V source $(12 - 8.18)/2 = 1.91\\ \\mathrm{A}$; from the 6 V source $(6 - 8.18)/4 = -0.55\\ \\mathrm{A}$ (so 0.55 A flows into it); load $8.18/6 = 1.36\\ \\mathrm{A}$. KCL: $1.91 - 0.55 = 1.36$.',
        'KVL round the outer loop: $12 - 2 \\times 1.91 - 4 \\times 0.55 - 6 = 12 - 3.82 - 2.18 - 6 = 0$.',
        'Power: the 12 V source delivers $12 \\times 1.91 = 22.9\\ \\mathrm{W}$. Absorbed: 6 V source 3.3 W (being charged), resistors $7.3 + 1.2 + 11.2 = 19.6\\ \\mathrm{W}$. Total 22.9 W — the books balance.'
      ],
      a: '1.91 A from the 12 V source, 0.55 A into the 6 V source, 1.36 A in the load.'
    },
    {
      title: 'KVL with an LED',
      q: 'A 9 V battery drives a red LED (2.0 V) and a series resistor. What voltage does the resistor drop, and what resistor gives 10 mA?',
      steps: [
        'KVL round the single loop: $9 = V_\\text{LED} + V_R$, so $V_R = 9 - 2.0 = 7.0\\ \\mathrm{V}$.',
        'For 10 mA: $R = 7.0/0.010 = 700\\ \\Omega$; the nearest E12 value above is 820 Ω (8.5 mA), or 680 Ω (10.3 mA).'
      ],
      a: '7.0 V across the resistor; about 700 Ω (680 Ω standard).'
    }
  ],
  quiz: [
    { q: 'At a node, 5 mA flows in through one wire and 2 mA flows out through a second. The third wire carries…', choices: ['7 mA in', '3 mA out', '3 mA in', '7 mA out'], a: 1,
      why: 'In must equal out: 5 = 2 + x, so 3 mA leaves through the third wire.' },
    { q: 'A 9 V battery, a 2 V LED and a resistor form a single loop. The resistor drops…', choices: ['9 V', '2 V', '7 V', '11 V'], a: 2,
      why: 'KVL: the 9 V rise is shared by the drops, 2 V + V_R = 9 V, so V_R = 7 V.' },
    { q: 'A circuit has 4 nodes and 6 branches. How many independent KVL (loop) equations does it have?', choices: ['2', '3', '4', '6'], a: 1,
      why: 'b − n + 1 = 6 − 4 + 1 = 3. There are also n − 1 = 3 independent KCL equations: 6 in all, one per branch current.' },
    { q: 'KVL holds around a loop that encloses a changing magnetic flux.', a: false,
      why: 'A changing flux induces an EMF round the loop (Faraday\'s law), so the sum of the component voltages is no longer zero. Lumped-circuit analysis assumes no such coupling.' },
    { q: 'You measure 250 mA into a board\'s supply pin, 180 mA into its motor driver and 45 mA into its microcontroller. What must be true?', choices: ['The meter is wrong', 'About 25 mA flows somewhere else on the board', 'The board is creating current', 'The ground pin carries 475 mA'], a: 1,
      why: 'KCL for the whole board: whatever enters must leave, so 25 mA is going through parts you have not measured — a regulator, an LED, or a fault.' }
  ],
  applications: ['Every hand analysis and every circuit simulator (SPICE).', 'Fault finding: currents that do not add up point to a hidden path.', 'Checking measurements: the voltages round a loop must sum to zero.', 'PCB layout: planning where return currents flow.'],
  history: 'Gustav Kirchhoff published the two laws in 1845, as a 21-year-old student in Königsberg, extending Ohm\'s work to networks with many branches. He is also known for his laws of spectroscopy and thermal radiation.',
  sim: 'fund-kirchhoff'
},

{
  id: 'nodal-analysis', parent: 'circuit-analysis', title: 'Nodal analysis', level: 2,
  short: 'Choose a ground, make the other node voltages the unknowns, and write Kirchhoff\'s current law at each node: a recipe that solves any circuit, and the method inside SPICE.',
  keywords: ['nodal analysis', 'node voltage method', 'conductance matrix', 'supernode', 'modified nodal analysis', 'MNA', 'SPICE', 'Millman', 'simultaneous equations', 'floating node'],
  prereq: ['kirchhoffs-laws', 'resistance-ohms-law', 'math:systems-of-equations', 'math:gaussian-elimination'],
  related: ['mesh-analysis', 'superposition', 'summing-amplifier', 'thevenin-norton'],
  body: `
Nodal analysis turns [[kirchhoffs-laws|Kirchhoff's current law]] into a recipe that never fails:

1. **Choose a reference node** (ground) — usually the one with the most connections, or the negative supply.
2. **Name the voltage of every other node**: $V_1, V_2, \\dots$ These are the unknowns.
3. **Write KCL at each unknown node**, expressing every branch current through Ohm's law: the current from node $a$ to node $b$ through $R$ is $(V_a - V_b)/R$.
4. **Solve** the simultaneous equations; every branch current then follows from the voltages at its two ends.

A circuit with $n$ nodes gives only $n - 1$ unknowns — usually far fewer than it has branch currents.

### The pattern: a conductance matrix
Write the equations with conductances ($G = 1/R$) and a pattern appears. Each node's own voltage is multiplied by the **sum of the conductances touching it**; each neighbour's voltage by **minus the conductance joining them**; the right-hand side is the current that sources inject into the node. For two nodes:

$$\\begin{pmatrix} G_{11} & -G_{12} \\\\ -G_{12} & G_{22} \\end{pmatrix} \\begin{pmatrix} V_1 \\\\ V_2 \\end{pmatrix} = \\begin{pmatrix} I_1 \\\\ I_2 \\end{pmatrix}$$

For resistor networks the matrix is symmetric and can be written straight from the schematic by inspection. Solving it is [[math:gaussian-elimination|Gaussian elimination]] — the same operation that SPICE performs, on matrices of thousands of nodes, at every step of a simulation.

### One node, several sources: Millman's formula
When one node is joined to several sources $V_k$ through resistors $R_k$ (a resistor to ground counts as a source of 0 V), KCL gives its voltage in one line:

$$V = \\frac{\\sum_k V_k/R_k}{\\sum_k 1/R_k}$$

The node settles at a conductance-weighted **average** of the source voltages. It solves the two-source circuit of [[kirchhoffs-laws]] at a glance, and it is the principle of a passive audio mixer and of the [[summing-amplifier]].

### Voltage sources
A voltage source from a node to ground simply fixes that node's voltage — one unknown fewer. A source between two unknown nodes needs a trick: treat both nodes and the source as one **supernode**, write KCL for all the currents leaving the group, and add the equation $V_a - V_b = V_s$. Simulators instead add the source's current as an extra unknown; that is **modified nodal analysis**, and it is how the simulations on these pages are solved.

### What goes wrong
- **A floating node.** A node with no DC path to ground — between two capacitors, say, or a CMOS input left unconnected — makes the matrix singular: SPICE stops with an error. The real circuit has the same problem: the node's voltage is undefined and drifts.
- **Nonlinear parts.** Diodes and transistors make the equations nonlinear. Simulators linearise them about a guess and iterate ([[math:newtons-method|Newton's method]]); by hand, you guess each device's state (diode on or off), solve, and check the guess.
- **Sign slips.** Write every current as *leaving* the node, $(V_\\text{node} - V_\\text{other})/R$, and set their sum equal to the source current *entering* it; then the signs look after themselves.
`,
  ideas: [
    'Unknowns are the node voltages, measured from a chosen ground.',
    'KCL at each node, with branch currents (V_a − V_b)/R, gives n − 1 equations.',
    'In conductance form the matrix can be written by inspection: sums on the diagonal, minus the shared conductances off it.',
    'A node joined to several sources through resistors sits at their conductance-weighted average (Millman).',
    'Simulators use modified nodal analysis: node voltages plus the currents of voltage sources.'
  ],
  pitfalls: [
    'Nodal analysis only works for circuits that can be drawn flat — That restriction belongs to mesh analysis; nodal analysis works for any circuit.',
    'Every node needs its own equation, including ground and nodes fixed by a source — Ground is the reference, and a node tied to ground by a voltage source is already known.',
    'A node connected only through capacitors is fine at DC — With no DC path to ground its voltage is undefined; SPICE reports a singular matrix and real circuits drift.'
  ],
  formulas: [
    {
      name: 'Millman: one node fed by three sources',
      expr: 'V = (V1/R1 + V2/R2 + V3/R3)/(1/R1 + 1/R2 + 1/R3)',
      tex: 'V = \\frac{V_1/R_1 + V_2/R_2 + V_3/R_3}{1/R_1 + 1/R_2 + 1/R_3}',
      vars: {
        V: { name: 'node voltage', q: 'voltage', unit: 'V', signed: true, tex: 'V' },
        V1: { name: 'first source voltage', q: 'voltage', unit: 'V', value: 12, signed: true, tex: 'V_1' },
        R1: { name: 'resistance to the first source', q: 'resistance', unit: 'Ω', value: 2, tex: 'R_1' },
        V2: { name: 'second source voltage', q: 'voltage', unit: 'V', value: 6, signed: true, tex: 'V_2' },
        R2: { name: 'resistance to the second source', q: 'resistance', unit: 'Ω', value: 4, tex: 'R_2' },
        V3: { name: 'third source voltage (0 for a resistor to ground)', q: 'voltage', unit: 'V', value: 0, signed: true, tex: 'V_3' },
        R3: { name: 'resistance to the third source', q: 'resistance', unit: 'Ω', value: 6, tex: 'R_3' }
      },
      note: 'The defaults are the two-source example of Kirchhoff\'s laws: 12 V behind 2 Ω and 6 V behind 4 Ω, with a 6 Ω load to ground.',
      practice: { unknowns: ['V', 'V2', 'R3'] },
      stories: { V: 'A node connects to {V1} through {R1}, to {V2} through {R2}, and to {V3} through {R3}. What is its voltage?' }
    }
  ],
  examples: [
    {
      title: 'A two-node circuit by matrix',
      q: 'A 10 V source feeds node 1 through 1 kΩ. Node 1 has 2 kΩ to ground and 1 kΩ to node 2. Node 2 has 2 kΩ to ground and a 1 mA current source feeding into it. Find both node voltages and every current.',
      steps: [
        'Work in kΩ, mA and V (conductances in mS). KCL at node 1, currents leaving: $\\frac{V_1 - 10}{1} + \\frac{V_1}{2} + \\frac{V_1 - V_2}{1} = 0$, i.e. $2.5V_1 - V_2 = 10$.',
        'KCL at node 2: $\\frac{V_2 - V_1}{1} + \\frac{V_2}{2} = 1$, i.e. $-V_1 + 1.5V_2 = 1$.',
        { text: 'In matrix form — the diagonal holds each node\'s total conductance, the off-diagonal minus the shared one:', tex: '\\begin{pmatrix} 2.5 & -1 \\\\ -1 & 1.5 \\end{pmatrix} \\begin{pmatrix} V_1 \\\\ V_2 \\end{pmatrix} = \\begin{pmatrix} 10 \\\\ 1 \\end{pmatrix}' },
        'Determinant $2.5 \\times 1.5 - 1 = 2.75$. Cramer\'s rule: $V_1 = (10 \\times 1.5 + 1)/2.75 = 5.82\\ \\mathrm{V}$, $V_2 = (2.5 \\times 1 + 10)/2.75 = 4.55\\ \\mathrm{V}$.',
        'Currents: 4.18 mA in from the source, 2.91 mA down the first 2 kΩ, 1.27 mA from node 1 to node 2, 2.27 mA down the second 2 kΩ. Check node 2: $1.27 + 1 = 2.27$.'
      ],
      a: 'V₁ = 5.82 V, V₂ = 4.55 V.'
    },
    {
      title: 'A passive mixer',
      q: 'Three sensors at 1.0 V, 2.5 V and 4.0 V each connect through 10 kΩ to a common node, which has another 10 kΩ to ground. What is the node voltage?',
      steps: [
        'Millman, with the resistor to ground as a fourth source of 0 V: $V = \\frac{(1.0 + 2.5 + 4.0 + 0)/10}{4/10}$.',
        'With equal resistors this is simply the average of the four "sources": $7.5/4 = 1.875\\ \\mathrm{V}$.'
      ],
      a: '1.875 V — the average of 1.0, 2.5, 4.0 and 0 V.'
    }
  ],
  quiz: [
    { q: 'A node has 1 kΩ, 2 kΩ and 500 Ω connected to it. Its diagonal entry in the conductance matrix is…', choices: ['3.5 kΩ', '3.5 mS', '0.29 mS', '286 Ω'], a: 1,
      why: 'The diagonal holds the sum of conductances: 1 + 0.5 + 2 = 3.5 mS.' },
    { q: 'A circuit has 5 nodes, one of which is ground. With no voltage sources, how many unknowns does nodal analysis have?', choices: ['3', '4', '5', 'One per branch'], a: 1,
      why: 'One unknown per node except ground: 5 − 1 = 4.' },
    { q: 'Nodal analysis only works for circuits that can be drawn without crossing wires.', a: false,
      why: 'Nodal analysis works for any circuit; it is mesh analysis that needs a planar circuit. That generality is why simulators use it.' },
    { q: 'A node connects to 10 V through 1 kΩ, to ground through 1 kΩ, and to 4 V through 2 kΩ. What is its voltage, in volts?', answer: 4.8, unit: 'V',
      why: 'Millman: (10/1 + 0/1 + 4/2)/(1 + 1 + 0.5) = 12/2.5 = 4.8 V.' },
    { q: 'A voltage source connects node 3 directly to ground. In nodal analysis…', choices: ['node 3 needs two equations', 'node 3\'s voltage is known, so there is one unknown fewer', 'the source must be removed', 'the method fails'], a: 1,
      why: 'The source fixes V₃ outright. Only a source between two unknown nodes needs the supernode treatment.' }
  ],
  applications: ['SPICE and every other circuit simulator (modified nodal analysis).', 'Hand analysis of bias networks and resistive ladders.', 'Passive mixers and summing junctions (Millman\'s formula).', 'Finding floating nodes that make simulations fail.'],
  history: 'SPICE, written at Berkeley in the early 1970s under Donald Pederson, used modified nodal analysis; almost every circuit simulator since has followed it.',
  sim: 'fund-kirchhoff'
},

{
  id: 'mesh-analysis', parent: 'circuit-analysis', title: 'Mesh analysis', level: 2,
  short: 'Give each window of a flat circuit its own circulating current and write Kirchhoff\'s voltage law round each: the dual of nodal analysis, handy for series-heavy circuits.',
  keywords: ['mesh analysis', 'loop current', 'mesh current', 'resistance matrix', 'supermesh', 'planar circuit', 'KVL', 'Cramer\'s rule'],
  prereq: ['kirchhoffs-laws', 'math:systems-of-equations', 'math:matrices'],
  related: ['nodal-analysis', 'superposition', 'wheatstone-bridge'],
  body: `
Mesh analysis is the mirror image of [[nodal-analysis]]: the unknowns are **loop currents** instead of node voltages. Draw the circuit flat, so that no wires cross, and it divides into windows — the **meshes**. Imagine a current circulating round each window, all in the same sense (clockwise, say). Every branch current is then either one mesh current (on the outer edge) or the **difference** of two (on a branch shared by neighbouring windows). KCL takes care of itself, because each mesh current enters and leaves every node it passes through.

The recipe:
1. Give each mesh a clockwise current $I_1, I_2, \\dots$
2. Write [[kirchhoffs-laws|KVL]] round each mesh. The sources that push the mesh current forward equal the drops in the resistors — where a resistor shared with mesh $j$ carries $I_i - I_j$.
3. Solve the simultaneous equations; each branch current is a mesh current or a difference of two.

### The resistance matrix
The pattern mirrors the conductance matrix: each mesh's own current is multiplied by the **total resistance round that mesh**, a neighbour's current by **minus the shared resistance**, and the right-hand side is the sum of the source voltages that drive the mesh clockwise. For the two-source circuit — 12 V behind $R_1$ on the left, 6 V behind $R_2$ on the right, a shared load $R_3$ in the middle:

$$\\begin{pmatrix} R_1 + R_3 & -R_3 \\\\ -R_3 & R_2 + R_3 \\end{pmatrix} \\begin{pmatrix} I_1 \\\\ I_2 \\end{pmatrix} = \\begin{pmatrix} V_1 \\\\ -V_2 \\end{pmatrix}$$

The second source opposes mesh 2's clockwise current, hence its minus sign. The load current is $I_1 - I_2$, and solving gives it in closed form:

$$I_3 = \\frac{V_1 R_2 + V_2 R_1}{R_1 R_2 + R_2 R_3 + R_1 R_3}$$

### Current sources
A current source on an outer branch fixes that mesh's current outright. One shared by two meshes needs a **supermesh**: write KVL round the larger loop that avoids the source, and add the equation that ties the two mesh currents to the source's value.

### Nodal or mesh?
Count the unknowns: nodal needs one per node (less ground), mesh one per window. A ladder of many series parts favours mesh; many branches meeting at a few nodes favour nodal. Mesh analysis only works for **planar** circuits — ones that can be drawn without crossings — which is one reason simulators use nodal analysis instead. By hand, pick whichever gives fewer equations, and use the other as a check.

### Checking the answer
Every branch current must satisfy KCL at each node, and the power must balance: what the sources deliver equals the $I^2R$ in the resistors plus whatever other sources absorb. A second, independent method — [[superposition]] is a good one for two sources — catches sign slips.
`,
  ideas: [
    'Unknowns are circulating mesh currents, one per window of a flat circuit.',
    'A branch shared by two meshes carries the difference of their currents.',
    'The resistance matrix: loop totals on the diagonal, minus the shared resistances off it.',
    'Mesh analysis needs a planar circuit; nodal analysis does not.',
    'Choose the method with fewer unknowns, and check with the other.'
  ],
  pitfalls: [
    'Mesh currents are the real branch currents — Only on outer branches. A shared branch carries the difference of two mesh currents.',
    'Mesh analysis also needs KCL at every node — KCL is satisfied automatically by circulating currents; only KVL equations are written.',
    'Mesh analysis works on any circuit — Only on planar ones; a circuit that cannot be drawn without crossings has no well-defined windows.'
  ],
  derivation: {
    title: 'The load current of two sources',
    steps: [
      { text: 'Mesh 1 (left, clockwise) passes up through $V_1$ and down through the shared $R_3$:', tex: 'V_1 = (R_1 + R_3) I_1 - R_3 I_2' },
      { text: 'Mesh 2 (right, clockwise) passes up through $R_3$ and down through $V_2$ from + to −, which opposes it:', tex: '-V_2 = -R_3 I_1 + (R_2 + R_3) I_2' },
      { text: 'The determinant of the resistance matrix:', tex: '\\Delta = (R_1 + R_3)(R_2 + R_3) - R_3^2 = R_1 R_2 + R_2 R_3 + R_1 R_3' },
      { text: 'Cramer\'s rule gives the two mesh currents:', tex: 'I_1 = \\frac{V_1 (R_2 + R_3) - R_3 V_2}{\\Delta}, \\qquad I_2 = \\frac{R_3 V_1 - (R_1 + R_3) V_2}{\\Delta}' },
      { text: 'The shared branch carries their difference; the $R_3$ terms cancel:', tex: 'I_3 = I_1 - I_2 = \\frac{V_1 R_2 + V_2 R_1}{R_1 R_2 + R_2 R_3 + R_1 R_3}' }
    ]
  },
  formulas: [
    {
      name: 'Two sources sharing a load',
      expr: 'I3 = (V1*R2 + V2*R1)/(R1*R2 + R2*R3 + R1*R3)',
      tex: 'I_3 = \\frac{V_1 R_2 + V_2 R_1}{R_1 R_2 + R_2 R_3 + R_1 R_3}',
      vars: {
        I3: { name: 'load current', q: 'current', unit: 'A', signed: true, tex: 'I_3' },
        V1: { name: 'first source', q: 'voltage', unit: 'V', value: 12, signed: true, tex: 'V_1' },
        R1: { name: 'resistance in series with the first source', q: 'resistance', unit: 'Ω', value: 2, tex: 'R_1' },
        V2: { name: 'second source', q: 'voltage', unit: 'V', value: 6, signed: true, tex: 'V_2' },
        R2: { name: 'resistance in series with the second source', q: 'resistance', unit: 'Ω', value: 4, tex: 'R_2' },
        R3: { name: 'load resistance', q: 'resistance', unit: 'Ω', value: 6, tex: 'R_3' }
      },
      note: 'Both sources have their + terminal towards the load. Make a source negative to reverse it.',
      practice: { unknowns: ['I3', 'V2', 'R3'] },
      stories: { I3: 'Two batteries, {V1} behind {R1} and {V2} behind {R2}, feed a {R3} load together. What current flows in the load?' }
    }
  ],
  examples: [
    {
      title: 'The two-source circuit by meshes',
      q: 'Solve the circuit of 12 V behind 2 Ω and 6 V behind 4 Ω sharing a 6 Ω load, using mesh currents.',
      steps: [
        'Mesh 1: $12 = (2 + 6)I_1 - 6I_2$. Mesh 2: $-6 = -6I_1 + (4 + 6)I_2$.',
        'From the first, $I_1 = (12 + 6I_2)/8$. Substituting: $-6 = -0.75(12 + 6I_2) + 10I_2 = -9 + 5.5I_2$, so $I_2 = 0.545\\ \\mathrm{A}$ and $I_1 = 1.909\\ \\mathrm{A}$.',
        'Load current $I_1 - I_2 = 1.364\\ \\mathrm{A}$ downwards; the formula gives $(12 \\times 4 + 6 \\times 2)/44 = 60/44 = 1.364\\ \\mathrm{A}$.',
        'Mesh 2 flows clockwise, down through the 6 V source from + to −: it is being charged at 0.545 A — the same answer nodal analysis gave.'
      ],
      a: 'I₁ = 1.91 A, I₂ = 0.55 A, load 1.36 A.'
    },
    {
      title: 'A ladder network',
      q: 'A 10 V source drives 1 kΩ in series, then 1 kΩ to ground, then another 1 kΩ in series into a 1 kΩ load. Find the load voltage by meshes.',
      steps: [
        'Mesh 1 (source, first series resistor, first shunt): $10 = (1 + 1)I_1 - 1 \\cdot I_2$ (kΩ, mA).',
        'Mesh 2 (shunt, second series resistor, load): $0 = -1 \\cdot I_1 + (1 + 1 + 1)I_2$.',
        'So $I_1 = 3I_2$ and $10 = 6I_2 - I_2$, giving $I_2 = 2\\ \\mathrm{mA}$ and $I_1 = 6\\ \\mathrm{mA}$.',
        'The load carries $I_2$: $V = 2\\ \\mathrm{mA} \\times 1\\ \\mathrm{k\\Omega} = 2\\ \\mathrm{V}$.'
      ],
      a: '2 V across the load.'
    }
  ],
  quiz: [
    { q: 'Mesh 1 carries 2 A clockwise and mesh 2 carries 0.5 A clockwise. The branch they share carries…', choices: ['2.5 A', '1.5 A', '0.5 A', '2 A'], a: 1,
      why: 'In the shared branch the two clockwise currents flow in opposite directions, so the branch current is their difference, 1.5 A (in mesh 1\'s direction).' },
    { q: 'Mesh analysis can be applied directly only to circuits that…', choices: ['have no current sources', 'can be drawn flat, without crossing wires', 'contain only resistors', 'have a single voltage source'], a: 1,
      why: 'Meshes are the windows of a planar drawing. Current sources are handled with supermeshes; non-planar circuits need nodal analysis.' },
    { q: 'In mesh analysis you must also write KCL at every node.', a: false,
      why: 'A circulating current enters and leaves every node it passes through, so KCL is satisfied automatically.' },
    { q: 'A flat circuit has 3 windows and 5 nodes. Which method needs fewer simultaneous equations (no sources between nodes)?', choices: ['Mesh: 3 equations against nodal\'s 4', 'Nodal: 3 against mesh\'s 5', 'Both need 5', 'Both need 3'], a: 0,
      why: 'Mesh: one per window, 3. Nodal: one per node except ground, 4.' }
  ],
  applications: ['Series-heavy networks: ladders, attenuators, bridge circuits.', 'Hand checks of simulation results.', 'Transformer and motor equivalent circuits, which are naturally loops.'],
  sim: 'fund-kirchhoff'
},

{
  id: 'superposition', parent: 'circuit-analysis', title: 'Superposition', level: 2,
  short: 'In a linear circuit, the response to several sources is the sum of the responses to each alone — with the others switched off: voltage sources shorted, current sources opened.',
  keywords: ['superposition', 'linearity', 'linear circuit', 'switch off a source', 'short circuit', 'open circuit', 'contributions', 'bias and signal', 'error budget'],
  prereq: ['kirchhoffs-laws', 'sources', 'series-parallel', 'math:linear-functions'],
  related: ['thevenin-norton', 'nodal-analysis', 'summing-amplifier', 'offset-bias', 'common-emitter'],
  body: `
In a **linear** circuit — resistors, capacitors, inductors, linear controlled sources and independent sources — every voltage and current is a sum of contributions, one from each independent source acting alone. That is the **superposition principle**. It follows because Kirchhoff's laws and Ohm's law are all linear equations: scale a source and every response scales with it; add two sources and the responses add ([[math:linear-functions|linearity]]).

To use it:
1. Keep one independent source and **switch off** all the others.
2. Solve the simpler circuit for the quantity you want.
3. Repeat for each source, then add the results, keeping track of signs.

**Switching off** a source means setting its value to zero. A voltage source of 0 V is a **short circuit** — a wire. A current source of 0 A is an **open circuit** — it is removed. Internal resistances stay where they are. **Dependent** (controlled) sources are never switched off: they are part of the circuit, not its drive.

### The two-source circuit again
With 12 V behind 2 Ω, 6 V behind 4 Ω and a 6 Ω load (the example of [[kirchhoffs-laws]]):
- **12 V alone**: the 6 V source becomes a wire, so its 4 Ω sits in parallel with the load: $4 \\parallel 6 = 2.4\\ \\Omega$. The load gets $12 \\times 2.4/(2 + 2.4) = 6.55\\ \\mathrm{V}$.
- **6 V alone**: $2 \\parallel 6 = 1.5\\ \\Omega$, and the load gets $6 \\times 1.5/(4 + 1.5) = 1.64\\ \\mathrm{V}$.
- **Together**: $6.55 + 1.64 = 8.18\\ \\mathrm{V}$ — the same as the direct solution, found with two voltage dividers and no simultaneous equations.

The simulation lets you switch each source off and check the sum.

### What it is really for
Superposition is seldom the quickest way to crunch numbers, but it is how engineers **think** about circuits:
- **Bias plus signal.** An amplifier has a DC supply and a small AC signal. The DC operating point and the AC response are worked out separately and added; the whole of small-signal analysis rests on this ([[common-emitter]]).
- **Error budgets.** The output error of an op-amp circuit is the sum of the contributions of the offset voltage, each bias current and each resistor tolerance, each found alone ([[offset-bias]]).
- **Mixing and summing.** A resistive mixer's output is a weighted sum of its inputs ([[summing-amplifier]]).
- **Interference.** Hum, ripple and noise ride on top of the wanted signal, and each can be traced through the circuit on its own.

### Where it fails
- **Power does not superpose.** Power goes as the square of current. If two sources each drive 1 A through a resistor, together they drive 2 A and produce four times the heat of one — not twice. Add the currents or voltages first, then compute the power.
- **Nonlinear parts.** A diode that conducts with both sources present may be off with either alone, and even a conducting diode's current is not proportional to its voltage. Superposition only applies to small changes about an operating point, where the part behaves linearly.
`,
  ideas: [
    'In a linear circuit, each voltage and current is the sum of the contributions of each independent source alone.',
    'To switch off a voltage source, replace it by a short; a current source, by an open circuit.',
    'Internal resistances and dependent sources stay in the circuit.',
    'Power does not superpose: add currents or voltages, then square.',
    'It underlies bias-plus-signal analysis and error budgets.'
  ],
  pitfalls: [
    'Switching off a voltage source means removing it — Removing it leaves an open circuit; a 0 V source is a short, so it must be replaced by a wire.',
    'The power in a resistor is the sum of the powers from each source — Power is quadratic: add the currents first, then compute I²R.',
    'Superposition works for any circuit — Only for linear ones. Diodes and transistors can be handled only for small signals about an operating point.'
  ],
  formulas: [
    {
      name: 'Two-input resistive mixer',
      expr: 'Vout = V1*R2/(R1 + R2) + V2*R1/(R1 + R2)',
      tex: 'V_{\\text{out}} = V_1 \\frac{R_2}{R_1 + R_2} + V_2 \\frac{R_1}{R_1 + R_2}',
      vars: {
        Vout: { name: 'output (no load)', q: 'voltage', unit: 'V', signed: true, tex: 'V_{\\text{out}}' },
        V1: { name: 'first input', q: 'voltage', unit: 'V', value: 5, signed: true, tex: 'V_1' },
        R1: { name: 'resistor from the first input', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_1' },
        V2: { name: 'second input', q: 'voltage', unit: 'V', value: 1, signed: true, tex: 'V_2' },
        R2: { name: 'resistor from the second input', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_2' }
      },
      note: 'Each term is one input acting alone, with the other input shorted to ground: two voltage dividers added.',
      stories: { Vout: 'Two signals, {V1} through {R1} and {V2} through {R2}, meet at a node with nothing else connected. What voltage does it sit at?' }
    }
  ],
  examples: [
    {
      title: 'A voltage source and a current source',
      q: 'A 10 V source with a 1 kΩ series resistor feeds node A, which has 1 kΩ to ground. A 5 mA current source also feeds into node A. Find the voltage at A and the power in the grounded resistor.',
      steps: [
        '10 V alone (current source opened): a plain divider, $V_A\' = 10 \\times 1/(1 + 1) = 5\\ \\mathrm{V}$.',
        '5 mA alone (voltage source shorted): the current sees $1\\ \\mathrm{k\\Omega} \\parallel 1\\ \\mathrm{k\\Omega} = 500\\ \\Omega$, so $V_A\'\' = 5\\ \\mathrm{mA} \\times 0.5\\ \\mathrm{k\\Omega} = 2.5\\ \\mathrm{V}$.',
        'Together: $V_A = 5 + 2.5 = 7.5\\ \\mathrm{V}$. Check by nodal analysis: $(V - 10)/1 + V/1 = 5$ gives $V = 7.5$.',
        'Power in the grounded resistor: $7.5^2/1000 = 56.3\\ \\mathrm{mW}$. The powers from each source alone, 25 mW and 6.25 mW, add to only 31.3 mW — power does not superpose.'
      ],
      a: 'V_A = 7.5 V; 56.3 mW in the grounded resistor.'
    }
  ],
  quiz: [
    { q: 'When applying superposition, an independent current source that is "switched off" is replaced by…', choices: ['a short circuit', 'an open circuit', 'a 1 Ω resistor', 'a voltage source of the same value'], a: 1,
      why: 'Zero current means no path: an open circuit. A switched-off voltage source (zero volts) is a short.' },
    { q: 'Two sources, each acting alone, would dissipate 1 W and 4 W in a resistor. With both acting (currents in the same direction), the resistor dissipates…', choices: ['5 W', '9 W', '3 W', '1 W'], a: 1,
      why: 'Currents add: if 1 W comes from current I, 4 W comes from 2I, and together (3I)² gives 9 W. Power does not superpose.' },
    { q: 'At a node, source A alone gives +3 V and source B alone gives −1 V. With both on, the node is at…', choices: ['4 V', '2 V', '3 V', 'It cannot be found without solving again'], a: 1,
      why: 'In a linear circuit the contributions add with their signs: 3 + (−1) = 2 V.' },
    { q: 'Superposition can be used on a circuit containing a transistor\'s small-signal model with a dependent source, provided the dependent source is left in place.', a: true,
      why: 'Linear dependent sources belong to the circuit. Only independent sources are switched off one at a time.' }
  ],
  applications: ['Separating DC bias from the AC signal in amplifiers.', 'Error budgets for offsets, bias currents and tolerances.', 'Mixers and summing junctions.', 'Tracing hum, ripple and noise from each source to the output.'],
  sim: { id: 'fund-kirchhoff', params: { superpose: true } }
},

{
  id: 'thevenin-norton', parent: 'circuit-analysis', title: 'Thévenin and Norton equivalents', level: 2,
  short: 'Seen from two terminals, any linear network behaves exactly like one voltage source behind one resistance (Thévenin) — or one current source across it (Norton).',
  keywords: ['Thevenin', 'Thévenin', 'Norton', 'equivalent circuit', 'open-circuit voltage', 'short-circuit current', 'output impedance', 'output resistance', 'source resistance', 'loading', 'black box'],
  prereq: ['superposition', 'sources', 'voltage-divider', 'kirchhoffs-laws'],
  related: ['max-power-transfer', 'meter-loading', 'wheatstone-bridge', 'bjt-biasing', 'impedance'],
  body: `
Look into any two terminals of a linear circuit — however many resistors and sources are behind them — and what you see can be copied exactly by just **one source and one resistor**:
- **Thévenin**: a voltage source $V_\\text{th}$ in series with a resistance $R_\\text{th}$;
- **Norton**: a current source $I_\\text{N}$ in parallel with the same resistance.

Any load connected to the terminals gets exactly the same voltage and current from the equivalent as from the real network. The two forms are one [[sources|source transformation]] apart:

$$V_\\text{th} = I_\\text{N} R_\\text{th}$$

### Finding the equivalent
- $V_\\text{th}$ is the **open-circuit voltage** at the terminals, with nothing connected.
- $I_\\text{N}$ is the **short-circuit current**, with the terminals joined by a wire.
- $R_\\text{th}$ is their ratio, $V_\\text{oc}/I_\\text{sc}$. Or: switch off every independent source — voltage sources shorted, current sources opened, as in [[superposition]] — and find the resistance seen at the terminals.

For a [[voltage-divider]] of $R_1$ over $R_2$ across $V_\\text{in}$: $V_\\text{th} = V_\\text{in} R_2/(R_1 + R_2)$ and $R_\\text{th} = R_1 \\parallel R_2$. Add a resistor $R_3$ in series with the output and it simply adds to $R_\\text{th}$.

### Measuring it on the bench
You can find the equivalent of a box without opening it. Read the open-circuit voltage with a high-impedance voltmeter; then connect a known load $R_L$ and read the voltage $V_L$ again. The sag gives

$$R_\\text{th} = R_L \\left( \\frac{V_\\text{oc}}{V_L} - 1 \\right)$$

Choose $R_L$ so the voltage drops noticeably but safely — a dead short works for a current-limited source but is a bad idea on a battery or a mains adaptor. A signal generator that shows 2 V open-circuit and 1 V across a 50 Ω load has a 50 Ω output resistance, which is standard; that is why generators let you set the amplitude "into 50 Ω" or "high-Z".

### Why engineers use it constantly
- **Loading in one line.** Any stage driving the next is a Thévenin source driving a load, and the load gets $V_\\text{th} R_L/(R_\\text{th} + R_L)$. Keep $R_L \\gg R_\\text{th}$ — ten times for 10 % loss, a hundred for 1 % — and stages barely interact.
- **Output impedance.** "Output impedance" is just the $R_\\text{th}$ of an output. A good voltage source has a small one (a regulator, milliohms); a good current source a large one (a transistor's collector, a photodiode) — which is naturally described by Norton.
- **Focusing on one part.** Replace the rest of the circuit by two numbers and vary the part you care about: the load in [[max-power-transfer]], the base network in [[bjt-biasing]], the detector in a [[wheatstone-bridge]], the meter in [[meter-loading]].

### Limits
The equivalent is exact **only at the terminals**, and only for linear circuits. It tells you nothing about what happens inside: an open-circuited Thévenin equivalent dissipates nothing, while the real divider it replaces keeps drawing current. Nonlinear networks have equivalents that hold only for small changes about an operating point. For AC the same idea works with complex [[impedance]] in place of resistance.
`,
  ideas: [
    'Any linear two-terminal network equals a source V_th in series with R_th (Thévenin) or I_N in parallel with R_th (Norton).',
    'V_th is the open-circuit voltage, I_N the short-circuit current, R_th = V_oc/I_sc.',
    'R_th is also the resistance seen with all independent sources switched off.',
    'Loaded output: V_L = V_th R_L/(R_th + R_L); keep R_L ≫ R_th.',
    'The equivalent is exact at the terminals only; it says nothing about the power inside.'
  ],
  pitfalls: [
    'The Thévenin equivalent dissipates the same power as the network — It matches only what the load sees. With no load the equivalent dissipates nothing, while a real divider still draws current.',
    'To find R_th, remove the voltage sources — Removing leaves an open circuit; a switched-off voltage source must be replaced by a short.',
    'Output impedance only matters for power circuits — It decides how much any stage\'s output sags when the next stage loads it, in signal circuits too.'
  ],
  formulas: [
    {
      name: 'Thévenin resistance from open- and short-circuit tests',
      expr: 'Rth = Voc/Isc', tex: 'R_{\\text{th}} = \\frac{V_{\\text{oc}}}{I_{\\text{sc}}}',
      vars: {
        Rth: { name: 'Thévenin resistance', q: 'resistance', unit: 'Ω', tex: 'R_{\\text{th}}' },
        Voc: { name: 'open-circuit voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_{\\text{oc}}' },
        Isc: { name: 'short-circuit current', q: 'current', unit: 'mA', value: 10, tex: 'I_{\\text{sc}}' }
      },
      stories: { Rth: 'A sensor reads {Voc} open-circuit and delivers {Isc} into a short. What is its internal resistance?' }
    },
    {
      name: 'Voltage across a load',
      expr: 'VL = Vth*RL/(Rth + RL)', tex: 'V_L = V_{\\text{th}} \\frac{R_L}{R_{\\text{th}} + R_L}',
      vars: {
        VL: { name: 'load voltage', q: 'voltage', unit: 'V', tex: 'V_L' },
        Vth: { name: 'Thévenin voltage', q: 'voltage', unit: 'V', value: 4, tex: 'V_{\\text{th}}' },
        Rth: { name: 'Thévenin resistance', q: 'resistance', unit: 'kΩ', value: 3, tex: 'R_{\\text{th}}' },
        RL: { name: 'load resistance', q: 'resistance', unit: 'kΩ', value: 5, tex: 'R_L' }
      },
      stories: { VL: 'A source of {Vth} with {Rth} output resistance drives {RL}. What voltage does the load get?', RL: 'A source of {Vth} behind {Rth} must deliver at least {VL}. What is the smallest load it can drive?' }
    },
    {
      name: 'Thévenin resistance from a loaded measurement',
      expr: 'Rth = RL*(Voc/VL - 1)', tex: 'R_{\\text{th}} = R_L \\left( \\frac{V_{\\text{oc}}}{V_L} - 1 \\right)',
      vars: {
        Rth: { name: 'Thévenin (output) resistance', q: 'resistance', unit: 'Ω', tex: 'R_{\\text{th}}' },
        RL: { name: 'test load', q: 'resistance', unit: 'Ω', value: 50, tex: 'R_L' },
        Voc: { name: 'voltage with no load', q: 'voltage', unit: 'V', value: 2, tex: 'V_{\\text{oc}}' },
        VL: { name: 'voltage with the load', q: 'voltage', unit: 'V', value: 1, tex: 'V_L' }
      },
      stories: { Rth: 'A generator reads {Voc} with no load and {VL} across a {RL} resistor. What is its output resistance?' }
    },
    {
      name: 'Norton current',
      expr: 'IN = Vth/Rth', tex: 'I_{\\text{N}} = \\frac{V_{\\text{th}}}{R_{\\text{th}}}',
      vars: {
        IN: { name: 'Norton (short-circuit) current', q: 'current', unit: 'mA', tex: 'I_{\\text{N}}' },
        Vth: { name: 'Thévenin voltage', q: 'voltage', unit: 'V', value: 4, tex: 'V_{\\text{th}}' },
        Rth: { name: 'Thévenin resistance', q: 'resistance', unit: 'kΩ', value: 3, tex: 'R_{\\text{th}}' }
      }
    }
  ],
  examples: [
    {
      title: 'Equivalent of a divider with a series resistor',
      q: 'A 12 V supply feeds R₁ = 6 kΩ over R₂ = 3 kΩ; the output is taken from their junction through R₃ = 1 kΩ. Find the Thévenin and Norton equivalents, and the voltage across a 5 kΩ load.',
      steps: [
        'Open circuit: no current in R₃, so $V_\\text{th}$ is the divider voltage, $12 \\times 3/(6 + 3) = 4\\ \\mathrm{V}$.',
        'Sources off (12 V shorted): looking in, R₃ in series with $R_1 \\parallel R_2 = 2\\ \\mathrm{k\\Omega}$, so $R_\\text{th} = 3\\ \\mathrm{k\\Omega}$.',
        'Norton: $I_\\text{N} = 4/3 = 1.33\\ \\mathrm{mA}$ in parallel with 3 kΩ.',
        'With 5 kΩ: $V_L = 4 \\times 5/(3 + 5) = 2.5\\ \\mathrm{V}$, $I_L = 0.5\\ \\mathrm{mA}$ — the same as solving the whole network.'
      ],
      a: 'V_th = 4 V, R_th = 3 kΩ, I_N = 1.33 mA; 2.5 V across 5 kΩ.'
    },
    {
      title: 'Measuring a sensor\'s output resistance',
      q: 'A sensor module reads 1.50 V on a 10 MΩ voltmeter, and 1.20 V when a 10 kΩ resistor is connected across its output. What is its output resistance, and is it safe to feed a 50 kΩ input?',
      steps: [
        '$R_\\text{th} = 10\\ \\mathrm{k\\Omega} \\times (1.50/1.20 - 1) = 2.5\\ \\mathrm{k\\Omega}$.',
        'Into 50 kΩ: $1.50 \\times 50/52.5 = 1.43\\ \\mathrm{V}$ — a 4.8 % error, too much for a measurement; a [[voltage-follower]] buffer would fix it.'
      ],
      a: '2.5 kΩ; a 50 kΩ input would read about 5 % low.'
    }
  ],
  quiz: [
    { q: 'A network has an open-circuit voltage of 6 V and a short-circuit current of 3 mA. Its Thévenin resistance is…', choices: ['18 kΩ', '2 kΩ', '0.5 kΩ', '2 Ω'], a: 1,
      why: 'R_th = V_oc/I_sc = 6 V / 3 mA = 2 kΩ.' },
    { q: 'To find R_th by switching off the sources, voltage sources are replaced by ___ and current sources by ___.', choices: ['opens; shorts', 'shorts; opens', 'shorts; shorts', 'opens; opens'], a: 1,
      why: 'A voltage source set to zero volts is a wire; a current source set to zero amps is a gap.' },
    { q: 'A Thévenin equivalent dissipates the same internal power as the original network, for every load.', a: false,
      why: 'Equivalence holds only for what the load sees at the terminals. Inside, the power can be completely different — zero for the open-circuited equivalent of a divider that is still drawing current.' },
    { q: 'A source of 10 V behind 1 kΩ drives a 4 kΩ load. What is the load voltage, in volts?', answer: 8, unit: 'V',
      why: 'V_L = 10 × 4/(1 + 4) = 8 V.' },
    { q: 'The Norton equivalent of a 9 V source with 3 Ω internal resistance is…', choices: ['3 A in series with 3 Ω', '3 A in parallel with 3 Ω', '27 A in parallel with 3 Ω', '9 V in parallel with 3 Ω'], a: 1,
      why: 'I_N = V_th/R_th = 3 A, with the same 3 Ω in parallel.' }
  ],
  applications: ['Output and input impedance of every amplifier stage.', 'Predicting the loading of dividers, sensors and signal sources.', 'Simplifying a bias network to a single source and resistor.', 'Measuring an unknown source with two voltage readings.'],
  history: 'Hermann von Helmholtz described the idea in 1853; Léon Charles Thévenin, a French telegraph engineer, published it in 1883. The current-source form was found in 1926, independently by Edward Norton at Bell Labs and Hans Ferdinand Mayer at Siemens.',
  sim: 'fund-thevenin'
},

{
  id: 'max-power-transfer', parent: 'circuit-analysis', title: 'Maximum power transfer', level: 2,
  short: 'A source delivers the most power into a load equal to its own internal resistance — at only 50 % efficiency. Right for weak signals and radio, wrong for power systems.',
  keywords: ['maximum power transfer', 'matching', 'impedance matching', 'load matching', 'efficiency', '50 ohm', 'conjugate match', 'damping factor', 'MPPT'],
  prereq: ['thevenin-norton', 'power-energy', 'math:optimization'],
  related: ['sources', 'reflections-matching', 'solar-cells', 'impedance', 'batteries'],
  body: `
A source with internal resistance $R_\\text{th}$ drives a load $R_L$. What load takes the most power? A very small load draws a large current but has almost no voltage across it; a very large one has nearly the full voltage but draws almost no current. In between, the load power

$$P_L = I^2 R_L = \\frac{V_\\text{th}^2 R_L}{(R_\\text{th} + R_L)^2}$$

has a peak exactly where the load **matches** the source:

$$R_L = R_\\text{th}, \\qquad P_\\text{max} = \\frac{V_\\text{th}^2}{4 R_\\text{th}}$$

At that point half the source voltage appears across the load — and **the same power is burnt inside the source**. The efficiency,

$$\\eta = \\frac{R_L}{R_\\text{th} + R_L}$$

is only 50 %.

### A broad peak
The peak is flat-topped. Writing $k = R_L/R_\\text{th}$, the load gets $4k/(1 + k)^2$ of the maximum: a load twice or half the ideal still takes 89 %, and a factor of three 75 %. Near enough is good enough, which is why a standard resistor value, or a cable of slightly the wrong impedance, costs little power.

### When to match
The theorem answers one specific question: *the source is fixed — how do I get the most power out of it?* That is the situation in:
- **Radio and fast signals.** Antennas, cables, amplifier inputs and outputs are all designed around 50 Ω (75 Ω for television); matching also stops signals reflecting back from the load ([[reflections-matching]]).
- **Weak sources.** Getting the most from a thermoelectric generator, a piezo energy harvester or a small solar panel. A solar cell is nonlinear, but a maximum-power-point tracker does the same job: it adjusts the load until the power peaks ([[solar-cells]]).
- **Valve audio amplifiers**, whose output transformers matched the loudspeaker to the valves.

### When not to
It is the **wrong** goal whenever efficiency matters — which is almost always when the power is large. A car battery with 8 mΩ inside and 12.6 V across it could deliver $12.6^2/(4 \\times 0.008) \\approx 5\\ \\mathrm{kW}$ into a matched 8 mΩ load, while heating itself with another 5 kW. Power systems do the opposite of matching: the source resistance is kept **tiny** compared with the load, so nearly all the power reaches the load and the voltage stays steady whatever it draws. A modern audio amplifier with 0.05 Ω output resistance driving an 8 Ω loudspeaker is deliberately unmatched; its "damping factor" of $8/0.05 = 160$ is a mark of quality, because a stiff source controls the cone's motion.

> [!warn] Do not turn the theorem around. If the **load** is fixed and you can choose the source, the most power reaches the load when the source resistance is as **small** as possible — zero, not equal to the load.

### For AC
With reactive sources — an antenna, a transformer — the load that takes most power is the **complex conjugate** of the source impedance: the same resistance, and the opposite reactance so that the two cancel ([[impedance]]).
`,
  ideas: [
    'For a fixed source, load power peaks when R_L = R_th, at P_max = V_th²/4R_th.',
    'At the match, half the power is lost in the source: 50 % efficiency.',
    'Efficiency is R_L/(R_th + R_L): a large load relative to the source is efficient.',
    'The peak is broad: a factor of two mismatch still delivers 89 %.',
    'Match for weak sources and radio; keep the source resistance small for power.'
  ],
  pitfalls: [
    'Matching gives the best efficiency — It gives the most power from a given source, at exactly 50 % efficiency; efficiency keeps rising as the load gets larger.',
    'For a fixed load, the source resistance should equal the load — The load gets most power when the source resistance is as small as possible.',
    'An amplifier should be matched to its loudspeaker — Solid-state amplifiers are designed with output resistance far below the speaker\'s, for efficiency and to damp the cone.'
  ],
  derivation: {
    title: 'Where the peak is',
    steps: [
      { text: 'The load power as a function of the load:', tex: 'P_L = \\frac{V_{\\text{th}}^2 R_L}{(R_{\\text{th}} + R_L)^2}' },
      { text: 'Differentiate with respect to $R_L$ (quotient rule):', tex: '\\frac{dP_L}{dR_L} = V_{\\text{th}}^2 \\frac{(R_{\\text{th}} + R_L)^2 - 2R_L (R_{\\text{th}} + R_L)}{(R_{\\text{th}} + R_L)^4} = V_{\\text{th}}^2 \\frac{R_{\\text{th}} - R_L}{(R_{\\text{th}} + R_L)^3}' },
      { text: 'This is zero only at $R_L = R_\\text{th}$; it is positive below and negative above, so that is the maximum. Substituting:', tex: 'P_{\\max} = \\frac{V_{\\text{th}}^2 R_{\\text{th}}}{(2R_{\\text{th}})^2} = \\frac{V_{\\text{th}}^2}{4R_{\\text{th}}}' }
    ]
  },
  formulas: [
    {
      name: 'Power delivered to a load',
      expr: 'P = Vth^2*RL/(Rth + RL)^2', tex: 'P_L = \\frac{V_{\\text{th}}^2 R_L}{(R_{\\text{th}} + R_L)^2}',
      vars: {
        P: { name: 'load power', q: 'power', unit: 'W', tex: 'P_L' },
        Vth: { name: 'source (open-circuit) voltage', q: 'voltage', unit: 'V', value: 4, tex: 'V_{\\text{th}}' },
        Rth: { name: 'source resistance', q: 'resistance', unit: 'Ω', value: 3, tex: 'R_{\\text{th}}' },
        RL: { name: 'load resistance', q: 'resistance', unit: 'Ω', value: 5, tex: 'R_L' }
      },
      note: 'Solving for R_L gives two loads, one above and one below R_th, that take the same power.',
      stories: { P: 'A generator with {Vth} open-circuit and {Rth} inside drives a {RL} load. What power reaches the load?' }
    },
    {
      name: 'The most power a source can deliver',
      expr: 'Pmax = Vth^2/(4*Rth)', tex: 'P_{\\max} = \\frac{V_{\\text{th}}^2}{4 R_{\\text{th}}}',
      vars: {
        Pmax: { name: 'maximum load power', q: 'power', unit: 'W', tex: 'P_{\\max}' },
        Vth: { name: 'source (open-circuit) voltage', q: 'voltage', unit: 'V', value: 4, tex: 'V_{\\text{th}}' },
        Rth: { name: 'source resistance', q: 'resistance', unit: 'Ω', value: 3, tex: 'R_{\\text{th}}' }
      },
      stories: { Pmax: 'A thermoelectric module gives {Vth} open-circuit with {Rth} internal resistance. What is the most power it can deliver?' }
    },
    {
      name: 'Efficiency of power transfer',
      expr: 'eta = RL/(Rth + RL)', tex: '\\eta = \\frac{R_L}{R_{\\text{th}} + R_L}',
      vars: {
        eta: { name: 'efficiency (share of power reaching the load)', q: 'ratio', unit: '%', tex: '\\eta' },
        RL: { name: 'load resistance', q: 'resistance', unit: 'Ω', value: 8, tex: 'R_L' },
        Rth: { name: 'source resistance', q: 'resistance', unit: 'Ω', value: 0.05, tex: 'R_{\\text{th}}' }
      },
      stories: { eta: 'An amplifier with {Rth} output resistance drives an {RL} loudspeaker. What fraction of its power reaches the speaker?' }
    }
  ],
  examples: [
    {
      title: 'Loading a thermoelectric generator',
      q: 'A thermoelectric module on a stove gives 4.0 V open-circuit and has 3 Ω internal resistance. What load gets the most power, and how much? What does a 6 Ω load get?',
      steps: [
        'Match: $R_L = 3\\ \\Omega$. Then $V_L = 2\\ \\mathrm{V}$, $I = 0.67\\ \\mathrm{A}$ and $P_\\text{max} = 16/12 = 1.33\\ \\mathrm{W}$, with another 1.33 W heating the module.',
        'With 6 Ω: $I = 4/9 = 0.444\\ \\mathrm{A}$, $P = 0.444^2 \\times 6 = 1.19\\ \\mathrm{W}$ — 89 % of the maximum, at 67 % efficiency.',
        'A DC–DC converter between the module and a battery can present the matched load whatever the battery voltage — the idea behind maximum-power-point tracking.'
      ],
      a: '3 Ω takes 1.33 W; 6 Ω still takes 1.19 W.'
    },
    {
      title: 'Why not match a battery?',
      q: 'A 9 V PP3 battery has about 1.5 Ω internal resistance. What is the most power it can deliver, and what would happen?',
      steps: [
        '$P_\\text{max} = 9^2/(4 \\times 1.5) = 13.5\\ \\mathrm{W}$ into 1.5 Ω, at 4.5 V and 3 A.',
        'The battery would dissipate the same 13.5 W internally. It would heat rapidly, its internal resistance would rise, and it would be flat in minutes. Batteries are rated for loads far larger than their internal resistance.'
      ],
      a: '13.5 W in theory, with as much again heating the battery.'
    }
  ],
  quiz: [
    { q: 'At maximum power transfer, what fraction of the source\'s total power reaches the load?', choices: ['100 %', '75 %', '50 %', '25 %'], a: 2,
      why: 'With R_L = R_th the same current flows through equal resistances, so they share the power equally.' },
    { q: 'A power station should match the impedance of its generators to the grid\'s load.', a: false,
      why: 'That would waste half the power in the generators. Power systems keep the source impedance far below the load impedance, for efficiency and steady voltage.' },
    { q: 'A source has an open-circuit voltage of 10 V and an internal resistance of 50 Ω. What is the most power it can deliver, in watts?', answer: 0.5, unit: 'W',
      why: 'P_max = V²/4R = 100/200 = 0.5 W, into a 50 Ω load.' },
    { q: 'A load of twice the source resistance receives what fraction of the maximum power?', choices: ['50 %', '67 %', '89 %', '100 %'], a: 2,
      why: '4k/(1 + k)² with k = 2 gives 8/9 ≈ 89 %. The peak is broad.' },
    { q: 'You must drive a fixed 8 Ω loudspeaker and can design the amplifier\'s output resistance. For the most power into the speaker it should be…', choices: ['8 Ω', '16 Ω', 'as low as possible', '4 Ω'], a: 2,
      why: 'With the load fixed, P = V²R_L/(R_s + R_L)² grows as R_s falls. Matching applies only when the source is the thing you cannot change.' }
  ],
  applications: ['50 Ω radio-frequency systems: antennas, cables, amplifiers.', 'Energy harvesting and maximum-power-point tracking.', 'Choosing a load for a weak sensor or generator.', 'Understanding why power systems are deliberately mismatched.'],
  history: 'The result is often called Jacobi\'s law, after Moritz von Jacobi, who studied it around 1840 while building electric motors. It misled early engineers into thinking 50 % was the best efficiency achievable, until Edison and others showed that a low-resistance generator could do far better.',
  sim: 'fund-maxpower'
},

{
  id: 'wheatstone-bridge', parent: 'circuit-analysis', title: 'The Wheatstone bridge', level: 2,
  short: 'Two voltage dividers side by side, with a meter between their midpoints: zero when the ratios match. It measures resistance by nulling, and turns tiny sensor changes into a measurable voltage.',
  keywords: ['Wheatstone bridge', 'bridge circuit', 'balance', 'null measurement', 'galvanometer', 'strain gauge', 'load cell', 'quarter bridge', 'half bridge', 'full bridge', 'mV/V', 'RTD'],
  prereq: ['voltage-divider', 'kirchhoffs-laws', 'thevenin-norton'],
  related: ['strain-gauges', 'instrumentation-amplifier', 'thermistors-rtd', 'sensor-interfacing', 'mesh-analysis'],
  body: `
Put two [[voltage-divider|voltage dividers]] side by side across one supply and measure the voltage **between their midpoints**. If the two dividers have the same ratio, the midpoints sit at the same voltage and the difference is exactly zero — whatever the supply voltage. That is the Wheatstone bridge, and its trick is to turn a measurement of resistance into the detection of **nothing**.

Call the left divider $R_1$ (top) over $R_2$ (bottom) and the right one $R_3$ over $R_4$. The output between the midpoints is

$$V_\\text{out} = V_s \\left( \\frac{R_2}{R_1 + R_2} - \\frac{R_4}{R_3 + R_4} \\right)$$

and it is zero — the bridge is **balanced** — when

$$\\frac{R_1}{R_2} = \\frac{R_3}{R_4}$$

### Measuring a resistance by balancing
Put the unknown in one arm, $R_4 = R_x$, and adjust a calibrated resistor $R_3$ until a sensitive meter between the midpoints reads zero. Then

$$R_x = R_3 \\frac{R_2}{R_1}$$

The accuracy depends only on the known resistors: the supply voltage and the meter's calibration drop out, because the meter only has to tell zero from not-zero. The ratio $R_2/R_1$ — 1:10, 1:1, 10:1 — sets the range. With a galvanometer as the detector, nineteenth-century laboratories measured resistance to better than 0.1 % this way.

### The bridge as a sensor
Today the bridge is mostly run slightly *out of* balance, as a sensor's front end. A resistive sensor with nominal value $R$ changes by a small $\\Delta R$; with the other three arms equal to $R$, the output is very nearly

$$V_\\text{out} \\approx V_s \\frac{\\Delta R}{4R}$$

(a **quarter bridge**). The bridge subtracts the large constant part of the signal and leaves only the change, which an [[instrumentation-amplifier]] can then amplify hundreds of times.
- **Strain gauges** ([[strain-gauges]]) change their resistance by only a fraction of a percent — about 0.25 % at a strain that nearly yields mild steel — so the output is millivolts. Two active gauges, one stretched and one compressed, make a **half bridge** with twice the output; four make a **full bridge**, $V_\\text{out} = V_s\\,\\Delta R/R$.
- **Load cells** are full bridges, specified by their output per volt of excitation at full load — typically 2 mV/V, so 10 V of excitation gives 20 mV at full scale.
- **Pressure sensors** (piezoresistive), hot-wire anemometers and platinum RTDs ([[thermistors-rtd]]) use the same arrangement.

Gauges in opposite arms that see the same temperature cancel its effect, while the strains they are placed to measure add — the reason bridges are laid out as they are.

### Practical points
- The output is **differential**: neither midpoint is at ground. Measure it with a differential or instrumentation amplifier, never by clipping a grounded oscilloscope probe to one side.
- The detector sees the bridge's [[thevenin-norton|Thévenin resistance]], $R_1 \\parallel R_2 + R_3 \\parallel R_4$, which loads it like any source.
- A quarter bridge is slightly nonlinear for larger changes; half and full bridges with gauges in tension and compression are linear.
- Long leads to a remote sensor add their resistance to its arm. A **three-wire** connection puts one lead in each of two adjacent arms, where their effects cancel.
`,
  ideas: [
    'The bridge output is the difference of two divider voltages.',
    'Balance (zero output) when R₁/R₂ = R₃/R₄, independent of the supply voltage.',
    'At balance an unknown arm is R_x = R₃R₂/R₁: a null measurement.',
    'Out of balance, a quarter bridge gives V_s ΔR/4R; half and full bridges give two and four times that.',
    'The output is differential and small: it needs an instrumentation amplifier.'
  ],
  pitfalls: [
    'A balanced bridge only stays balanced at one supply voltage — Balance depends only on the resistance ratios; any supply voltage gives zero.',
    'The bridge output can be measured to ground from one midpoint — The signal is the difference between two midpoints, both sitting near half the supply.',
    'A quarter bridge is perfectly linear — Its output is linear only for small ΔR; half and full bridges with opposing gauges remove the nonlinearity.'
  ],
  formulas: [
    {
      name: 'Bridge output',
      expr: 'Vout = Vs*(R2/(R1 + R2) - R4/(R3 + R4))',
      tex: 'V_{\\text{out}} = V_s \\left( \\frac{R_2}{R_1 + R_2} - \\frac{R_4}{R_3 + R_4} \\right)',
      vars: {
        Vout: { name: 'output between the midpoints', q: 'voltage', unit: 'mV', signed: true, tex: 'V_{\\text{out}}' },
        Vs: { name: 'supply (excitation) voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_s' },
        R1: { name: 'left upper arm', q: 'resistance', unit: 'Ω', value: 350, tex: 'R_1' },
        R2: { name: 'left lower arm (the gauge)', q: 'resistance', unit: 'Ω', value: 350.7, tex: 'R_2' },
        R3: { name: 'right upper arm', q: 'resistance', unit: 'Ω', value: 350, tex: 'R_3' },
        R4: { name: 'right lower arm', q: 'resistance', unit: 'Ω', value: 350, tex: 'R_4' }
      },
      practice: { unknowns: ['Vout', 'R2', 'Vs'] },
      stories: { Vout: 'A 350 Ω bridge has one arm at {R2} and is excited at {Vs}. What is its output?' }
    },
    {
      name: 'Unknown resistance at balance',
      expr: 'Rx = R3*R2/R1', tex: 'R_x = R_3 \\frac{R_2}{R_1}',
      vars: {
        Rx: { name: 'unknown resistance', q: 'resistance', unit: 'kΩ', tex: 'R_x' },
        R3: { name: 'adjustable arm at balance', q: 'resistance', unit: 'kΩ', value: 0.472, tex: 'R_3' },
        R2: { name: 'ratio arm under R₁', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_2' },
        R1: { name: 'ratio arm over R₂', q: 'resistance', unit: 'kΩ', value: 1, tex: 'R_1' }
      },
      stories: { Rx: 'A bridge with ratio arms {R1} and {R2} balances when the adjustable arm is {R3}. What is the unknown?' }
    },
    {
      name: 'Quarter-bridge output for a small change',
      expr: 'Vout = Vs*dR/(4*R)', tex: 'V_{\\text{out}} \\approx V_s \\frac{\\Delta R}{4R}',
      vars: {
        Vout: { name: 'output', q: 'voltage', unit: 'mV', signed: true, tex: 'V_{\\text{out}}' },
        Vs: { name: 'excitation voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_s' },
        dR: { name: 'change of the sensor\'s resistance', q: 'resistance', unit: 'Ω', value: 0.7, signed: true, tex: '\\Delta R' },
        R: { name: 'nominal resistance of each arm', q: 'resistance', unit: 'Ω', value: 350, tex: 'R' }
      },
      note: 'Valid for ΔR much smaller than R. Double it for a half bridge, multiply by four for a full bridge.',
      stories: { Vout: 'A {R} strain gauge in a quarter bridge excited at {Vs} changes by {dR}. What output does the bridge give?' }
    }
  ],
  examples: [
    {
      title: 'Measuring an unknown resistor',
      q: 'A bridge has R₁ = 1 kΩ and R₂ = 10 kΩ as ratio arms. The detector nulls when the decade box R₃ is set to 472 Ω. What is the unknown R₄?',
      steps: [
        'Balance: $R_1/R_2 = R_3/R_x$, so $R_x = R_3 R_2/R_1 = 472 \\times 10 = 4720\\ \\Omega$.',
        'The supply voltage never enters; the precision is that of the three known resistors. A decade box with 1 Ω steps resolves the unknown to 10 Ω here — choose the ratio so that the decade box works near its top.'
      ],
      a: '4.72 kΩ.'
    },
    {
      title: 'A strain gauge in a quarter bridge',
      q: 'A 350 Ω strain gauge with gauge factor 2.0 sits in a quarter bridge of 350 Ω resistors excited at 5 V. The part is strained by 1000 µε (0.1 %). What is the bridge output, and what gain gives 1 V?',
      steps: [
        'Resistance change: $\\Delta R = GF \\cdot \\varepsilon \\cdot R = 2.0 \\times 0.001 \\times 350 = 0.70\\ \\Omega$.',
        'Output: $V_\\text{out} \\approx 5 \\times 0.70/(4 \\times 350) = 2.50\\ \\mathrm{mV}$. The exact bridge formula gives 2.497 mV — the small-change formula is excellent here.',
        'An instrumentation amplifier with a gain of 400 turns this into 1.0 V. A 1 °C change of an uncompensated gauge can produce a similar output, which is why real designs use half or full bridges.'
      ],
      a: '2.5 mV; a gain of 400 gives 1 V.'
    }
  ],
  quiz: [
    { q: 'A bridge is balanced. The supply voltage is then doubled. The output…', choices: ['doubles', 'stays at zero', 'halves', 'becomes negative'], a: 1,
      why: 'Both midpoint voltages double, and their difference stays zero: balance depends only on the resistance ratios.' },
    { q: 'At balance, R₁ = 1 kΩ, R₂ = 2 kΩ and R₃ = 3 kΩ. What is R₄ (the unknown), in kΩ?', answer: 6, unit: 'kΩ',
      why: 'R₄ = R₃R₂/R₁ = 3 × 2/1 = 6 kΩ, which makes R₁/R₂ = R₃/R₄ = 0.5.' },
    { q: 'Why is a strain gauge usually read with a bridge rather than by measuring the voltage across it directly?', choices: ['A bridge makes the gauge more sensitive', 'The bridge subtracts the large constant voltage, leaving only the tiny change to be amplified', 'Strain gauges only work with AC', 'A bridge needs no power'], a: 1,
      why: 'A 0.1 % change on top of 2.5 V is hard to see; the bridge removes the 2.5 V and presents the millivolt change alone, which can be amplified with high gain.' },
    { q: 'It is fine to look at a bridge\'s output by clipping a mains-earthed oscilloscope\'s ground lead to one midpoint.', a: false,
      why: 'If the bridge supply is also referenced to earth, the ground clip shorts that midpoint to earth and upsets the bridge. Measure the difference with two probes and the subtract function, or with a differential probe.' },
    { q: 'Four active gauges in a full bridge give how much more output than one gauge in a quarter bridge?', choices: ['The same', 'Twice', 'Four times', 'Sixteen times'], a: 2,
      why: 'Quarter bridge: V_s ΔR/4R. Full bridge with two gauges in tension and two in compression: V_s ΔR/R.' }
  ],
  applications: ['Load cells in scales and force measurement.', 'Strain gauges on structures and machine parts.', 'Piezoresistive pressure sensors and RTD thermometers.', 'Precision resistance measurement by null methods.'],
  history: 'Samuel Hunter Christie described the circuit in 1833; Charles Wheatstone made it widely known in 1843, and his name stuck.',
  sim: 'fund-bridge'
}

);
