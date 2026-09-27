/* HYPER-PNEUMATICS · content/actuators.js
 * Branch "Cylinders and Actuators": the topic cylinders-topic (all but the reference page
 * pneumatic-cylinder, which is in reference.js) and the topic other-actuators.
 * Simulations in sims/actuators.js (prefix act-). */
Hyper.add(

/* ================================================================ CYLINDERS */

{
  id: 'single-acting-cylinders', parent: 'cylinders-topic', title: 'Single-acting cylinders', level: 1,
  short: 'A cylinder with one air port: air drives the piston one way and a spring (or the load) drives it back. Simple, fail-safe and frugal with air, but its force falls along the stroke as the spring is compressed, and its strokes are short.',
  keywords: ['single-acting', 'spring return', 'spring-return cylinder', 'push type', 'pull type', '3/2 valve', 'fail-safe', 'spring preload', 'spring rate', 'short stroke', 'breather', 'diaphragm actuator'],
  prereq: ['pneumatic-cylinder', 'absolute-gauge-pressure', 'physics:hookes-law'],
  related: ['double-acting-cylinders', 'cylinder-force', 'air-consumption', 'way-valves', 'bellows-muscles', 'air-brakes', 'emergency-stop-pneu', 'hydraulics:cylinder-types'],
  body: `
A single-acting cylinder has one air port. Air drives the piston one way; a spring — or the weight of the load, or some outside force — brings it back. From the valve's side it is the simplest actuator there is: a 3/2 valve fills the chamber to extend it and exhausts the chamber to let the spring return it. Half the plumbing of a [[double-acting-cylinders|double-acting cylinder]], and a little over half the air.

### Push type and pull type
In the common **push type** the spring sits on the rod side and holds the rod in; air on the piston pushes it out. In the **pull type** the spring sits behind the piston and holds the rod out; air on the rod side pulls it in. The choice is usually made by asking what must happen when the air fails, because then the spring always wins. A clamp that must stay closed, a brake that must apply or a process valve that must shut is arranged so that the spring does the job that has to survive the failure. The spring brakes of trucks and the spring-return actuators on process valves work exactly this way.

### The force falls along the stroke
The spring is compressed further as the piston advances, so it takes more and more of the air force:

$$F(x) = p_g\\,\\frac{\\pi D^2}{4} - (F_0 + k\\,x)$$

where $F_0$ is the spring's preload with the rod retracted and $k$ its rate. The useful force is largest at the start of the stroke and smallest at the end — which is often where a clamp or a press needs it. Seal friction takes a further 5–10 %.

| Bore | Air force at 6 bar | Typical spring, retracted → extended | Left at the end, before friction |
|---|---|---|---|
| 10 mm | 47 N | 3 → 6 N | ≈ 41 N |
| 16 mm | 121 N | 8 → 14 N | ≈ 107 N |
| 25 mm | 295 N | 20 → 40 N | ≈ 255 N |
| 32 mm | 483 N | 30 → 60 N | ≈ 423 N |

At 6 bar the spring costs 5–15 %; at 2 bar the same spring takes three times that share. The return force is only the spring force — a few tens of newtons in small bores — so the return is weaker and usually slower than the working stroke, and the spring must beat seal friction with a margin or the rod stops short of home.

### Short strokes
A long spring is bulky, heavy and would take a large and varying share of the force, so single-acting cylinders are built with short strokes: up to about 25–50 mm in small round cylinders, about 100 mm in larger ones. Diaphragm and bellows actuators take the idea further — no sliding seals at all, but only millimetres to a few centimetres of travel (see [[bellows-muscles]]).

### Air on one stroke only
Only the working stroke fills the cylinder; the return empties it and fills nothing. Per cycle it uses $\\tfrac{\\pi D^2}{4}\\,s\\,(p_g + p_\\text{atm})/p_\\text{atm}$ of free air — about 54 % of a double-acting cylinder of the same bore and stroke, which fills the annulus as well (see [[air-consumption]]).

> [!tip] The spring side of a push-type cylinder breathes through a vent. In dust, coolant or wash-down it sucks dirt in on every stroke: fit a filter-silencer to the vent or pipe it to a clean place.

> [!warn] A spring-return cylinder moves by itself when its air is exhausted, and a pull-type one holds its spring loaded with no air at all — the spring is stored energy. Exhaust the air, lock out the supply and keep hands out of the rod's path before working on a machine; never dismantle a spring-loaded cylinder or actuator except by the maker's procedure.
`,
  ideas: [
    'One air port: air drives one way, a spring (or the load) drives back, switched by a 3/2 valve.',
    'The useful force falls along the stroke: air force minus a spring force that grows from F₀ to F₀ + k·s.',
    'The spring sets the position the cylinder takes when the air fails — choose push or pull type for that.',
    'Air is used on the working stroke only: a little over half of what a double-acting cylinder uses.',
    'Strokes are short and the return is weak; the spring must beat friction with a margin.'
  ],
  pitfalls: [
    'A single-acting cylinder gives its full p·A at the end of its stroke — The spring is most compressed there, so the output is p·A minus the largest spring force of the stroke.',
    'The spring return is as quick and strong as an air stroke — The return force is only the spring force, a few per cent of the air force; the return is slower and can stall on friction, dirt or a restricted exhaust.',
    'At a lower pressure the cylinder is simply gentler — The spring force does not scale with pressure: at 2 bar a spring that took 10 % of the force at 6 bar takes 30 %, and the rod may not reach the end at all.'
  ],
  formulas: [
    {
      name: 'Output force of a spring-return cylinder',
      expr: 'F = p*pi*D^2/4 - (F0 + k*x)', tex: 'F = p_g\\,\\dfrac{\\pi D^2}{4} - (F_0 + k\\,x)',
      vars: {
        F: { name: 'output force at position x (before friction)', q: 'force', unit: 'N', signed: true },
        p: { name: 'supply pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        D: { name: 'bore', q: 'length', unit: 'mm', value: 25 },
        F0: { name: 'spring force with the rod retracted (preload)', q: 'force', unit: 'N', value: 20, tex: 'F_0' },
        k: { name: 'spring rate', q: 'stiffness', unit: 'N/mm', value: 0.4 },
        x: { name: 'position along the stroke', q: 'length', unit: 'mm', value: 50 }
      },
      note: 'Push type, extending. Seal friction takes a further 5–10 %. A negative result means the air cannot push the rod that far.',
      practice: { unknowns: ['F', 'p', 'x'] },
      stories: {
        F: 'A single-acting cylinder of {D} bore works at {p}. Its spring pushes back with {F0} when retracted and stiffens by {k}. What force is left {x} along the stroke?',
        p: 'A spring-return cylinder of {D} bore must still give {F} at {x} along its stroke. Its spring gives {F0} retracted and has a rate of {k}. What gauge pressure does it need?',
        x: 'A {D} spring-return cylinder at {p} has a spring of {F0} preload and {k} rate. How far along its stroke does its output fall to {F}?'
      }
    },
    {
      name: 'Free air per cycle, single-acting',
      expr: 'V = pi*D^2/4*s*(p + patm)/patm', tex: 'V_\\text{free} = \\dfrac{\\pi D^2}{4}\\,s\\,\\dfrac{p_g + p_\\text{atm}}{p_\\text{atm}}',
      vars: {
        V: { name: 'free air per cycle', q: 'volume', unit: 'L', tex: 'V_\\text{free}' },
        D: { name: 'bore', q: 'length', unit: 'mm', value: 25 },
        s: { name: 'stroke', q: 'length', unit: 'mm', value: 50 },
        p: { name: 'supply pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' }
      },
      note: 'Only the working stroke is filled. Add the volume of the tube between valve and cylinder, which is filled and emptied on every cycle too.',
      practice: { unknowns: ['V', 's'] },
      stories: { V: 'A single-acting cylinder of {D} bore and {s} stroke works at {p}. How much free air does one cycle use?' }
    }
  ],
  examples: [
    {
      title: 'Force at the start and at the end of the stroke',
      q: 'A push-type single-acting cylinder of 25 mm bore and 50 mm stroke works at 6 bar gauge. Its spring pushes back with 20 N when retracted and has a rate of 0.4 N/mm; seal friction takes about 15 N. What force is left at the start and at the end of the stroke?',
      steps: [
        'Air force: $p_g A = 6\\times10^5 \\times \\pi \\times 0.025^2/4 = 6\\times10^5 \\times 4.91\\times10^{-4} = 295$ N.',
        'Spring force: 20 N at the start, $20 + 0.4 \\times 50 = 40$ N at the end.',
        'Useful force: $295 - 20 - 15 = 260$ N at the start, $295 - 40 - 15 = 240$ N at the end.'
      ],
      a: 'About 260 N at the start, falling to about 240 N at the end: spring and friction take 12–19 % of the air force.'
    },
    {
      title: 'The lowest pressure that still does the job',
      q: 'The same cylinder must still press a part with 100 N at the end of its stroke when the plant pressure sags. Friction at low pressure is about 10 N. What is the lowest supply pressure that works, and below what pressure does the rod not move at all?',
      steps: [
        'At the end of the stroke the air must beat the spring (40 N), the friction (10 N) and the 100 N: 150 N in all.',
        '$p_g = 150/4.91\\times10^{-4} = 3.06\\times10^5$ Pa = 3.1 bar gauge.',
        'To leave the retracted position at all it must beat the preload and the friction: $(20 + 10)/4.91\\times10^{-4} = 0.61$ bar.'
      ],
      a: 'About 3.1 bar gauge; below about 0.6 bar the rod does not move at all.'
    },
    {
      title: 'Single against double-acting: the air',
      q: 'Compare the free air used per minute at 6 bar gauge by a 25 mm cylinder with a 50 mm stroke cycling 20 times a minute: single-acting, and double-acting with a 10 mm rod.',
      steps: [
        'Pressure ratio: $(6 + 1.013)/1.013 = 6.92$.',
        'Single-acting, the working stroke only: $4.91\\times10^{-4} \\times 0.05 \\times 6.92 = 1.70\\times10^{-4}$ m³ = 0.170 L per cycle; 3.4 L/min at 20 cycles a minute.',
        'Double-acting: the annulus is $4.91 - 0.79 = 4.12$ cm², so $(4.91 + 4.12)\\times10^{-4} \\times 0.05 \\times 6.92 = 0.313$ L per cycle; 6.25 L/min.',
        'The single-acting cylinder uses 54 % of the air — it saves 46 %, paid for with a weak return and a force that falls along the stroke.'
      ],
      a: '3.4 L/min against 6.25 L/min of free air: the single-acting cylinder saves almost half.'
    }
  ],
  quiz: [
    { q: 'Why does the useful force of a push-type spring-return cylinder fall as the rod extends?', choices: ['The chamber pressure falls as the chamber grows', 'The spring is compressed further and pushes back harder', 'Seal friction grows along the stroke', 'The piston area gets smaller'], a: 1,
      why: 'Once the chamber has filled it is at supply pressure wherever the piston is; the spring force $F_0 + kx$ is simply largest at full stroke. Friction is roughly constant and the area does not change.' },
    { q: 'A 20 mm single-acting cylinder works at 5 bar gauge; its spring pushes back with 25 N at full stroke. What force does it give at the end of its stroke, before friction?', answer: 132, unit: 'N', tol: 0.02,
      why: '$p_g A = 5\\times10^5 \\times 3.14\\times10^{-4} = 157$ N; minus the 25 N of the spring leaves 132 N.' },
    { q: 'A clamp must keep holding its part if the compressed air fails. Which drive does that without extra valves?', choices: ['A double-acting cylinder with a 5/2 valve', 'A single-acting cylinder whose spring clamps and whose air unclamps', 'A single-acting cylinder whose air clamps and whose spring unclamps', 'A double-acting cylinder with a 5/3 exhaust-centre valve'], a: 1,
      why: 'When the air goes the spring always wins, so the spring must do the job that has to survive the failure. A double-acting cylinder loses its force with the air, and an exhaust-centre valve vents both sides on purpose.' },
    { q: 'A single-acting cylinder uses exactly half the free air of a double-acting cylinder of the same bore and stroke.', a: false,
      why: 'It fills only the piston side; the double-acting one fills the piston side and the smaller annulus. The share is $A_1/(A_1 + A_2)$ — about 54 % for a 25 mm bore with a 10 mm rod — so it saves a little less than half.' },
    { q: 'Why are single-acting cylinders built with short strokes?', choices: ['Air cannot push a piston far', 'A long spring would be bulky and take a large, varying share of the force', 'The valve cannot fill a long chamber', 'The standards forbid longer strokes'], a: 1,
      why: 'Spring force grows with compression. A long stroke needs a long, heavy spring whose force at full stroke eats much of the air force, and whose return force at home is still small.' }
  ],
  problems: [
    { q: 'A 16 mm push-type single-acting cylinder with a 25 mm stroke works at 6 bar gauge. Its spring gives 8 N retracted and has a rate of 0.25 N/mm. What force is left at the end of the stroke, before friction?', answer: 106.4, unit: 'N', tol: 0.02,
      steps: ['$p_g A = 6\\times10^5 \\times \\pi \\times 0.016^2/4 = 120.6$ N.', 'Spring at full stroke: $8 + 0.25 \\times 25 = 14.25$ N.', '$120.6 - 14.25 = 106.4$ N.'] },
    { q: 'A 32 mm single-acting cylinder with a 40 mm stroke cycles 30 times a minute at 6 bar gauge. What average free-air flow does it need (ignore the tube)?', answer: 6.68, unit: 'L/min', tol: 0.03,
      steps: ['$A = 8.04$ cm²; swept volume $8.04 \\times 4 = 32.2$ cm³.', 'Free air per cycle: $32.2 \\times 6.92 = 223$ cm³ = 0.223 L.', 'Thirty cycles a minute: $0.223 \\times 30 = 6.68$ L/min.'] }
  ],
  applications: [
    'Clamping, stamping, marking and ejecting, where the return needs no force.',
    'Spring-return actuators on process valves that must close (or open) when the air fails.',
    'Spring brakes on trucks and trailers: air holds the brake off, the spring applies it.',
    'Short-stroke diaphragm and bellows actuators for presses and lifting tables.'
  ],
  history: 'George Westinghouse\'s railway air brake, patented in 1869 and made automatic in 1872, applied the brakes with air-driven cylinders that springs released again. The modern spring brake of heavy vehicles reverses the roles: the spring applies the brake and air holds it off, so that any loss of air stops the vehicle.',
  sim: 'act-single-acting'
},

{
  id: 'double-acting-cylinders', parent: 'cylinders-topic', title: 'Double-acting cylinders', level: 1,
  short: 'A cylinder with a port at each end, powered both ways: it pushes with the full piston area and pulls with the smaller annulus. Driven by a 5/2 or 5/3 valve, it is the workhorse of pneumatic automation.',
  keywords: ['double-acting', 'push force', 'pull force', 'annulus', 'area ratio', 'rod area', 'through-rod', 'double rod', 'tandem cylinder', 'multi-position', '5/2 valve', '5/3 valve', 'back pressure', 'magnetic piston'],
  prereq: ['pneumatic-cylinder', 'absolute-gauge-pressure', 'way-valves'],
  related: ['single-acting-cylinders', 'cylinder-force', 'air-consumption', 'cylinder-speed-pneu', 'flow-control-pneu', 'pneumatic-spring', 'sensors-pneu', 'hydraulics:area-ratio', 'hydraulics:hydraulic-cylinder'],
  body: `
A double-acting cylinder has a port at each end, so air drives it both ways: into the cap end to extend, into the rod end to retract, while the other chamber exhausts through the valve. Both strokes are powered and can be given their own speed; the rod can be held against a stop in either direction; and there is no spring to take force, wear out or limit the stroke. It is the workhorse of automation.

### Push and pull
Extending, the air acts on the whole piston, $A_1 = \\pi D^2/4$. Retracting, it acts on the annulus around the rod, $A_2 = \\pi(D^2 - d^2)/4$, so the pull is smaller. The **area ratio** $\\varphi = A_1/A_2$ is only about 1.07–1.2 for standard pneumatic cylinders — much less than in hydraulics, where thick rods give 1.25–2 (see [[hydraulics:area-ratio]]).

| Bore / rod (mm) | $A_1$ (cm²) | $A_2$ (cm²) | Push at 6 bar | Pull at 6 bar | $\\varphi$ |
|---|---|---|---|---|---|
| 32 / 12 | 8.04 | 6.91 | 483 N | 415 N | 1.16 |
| 40 / 16 | 12.6 | 10.6 | 754 N | 633 N | 1.19 |
| 50 / 20 | 19.6 | 16.5 | 1.18 kN | 990 N | 1.19 |
| 63 / 20 | 31.2 | 28.0 | 1.87 kN | 1.68 kN | 1.11 |
| 80 / 25 | 50.3 | 45.4 | 3.02 kN | 2.72 kN | 1.11 |
| 100 / 25 | 78.5 | 73.6 | 4.71 kN | 4.42 kN | 1.07 |

### The other chamber is never empty
While the piston moves, the exhausting chamber still holds air — on purpose with meter-out speed control, where the throttle keeps it at several bar (see [[flow-control-pneu]]). The net force is then

$$F = p_A A_1 - p_B A_2$$

with both pressures gauge. That back pressure is what makes the motion steady: the piston runs between two air springs instead of being flung by one. It also means that a cylinder moving a light load quickly has only part of its theoretical force to spare.

### Valves and middle positions
A 5/2 valve drives it. With a single solenoid and a spring return the cylinder goes home when the power fails; with a double-solenoid (impulse) valve it stays where it was. A 5/3 valve adds a middle position: **closed centre** traps the air and stops the piston roughly where it is; **exhaust centre** vents both sides so the rod can be moved by hand; **pressure centre** pressurises both sides, and the area difference pushes the rod slowly out. None of them holds a position firmly — trapped air is a spring (see [[pneumatic-spring]]) and seals leak.

### Variants
- **Through-rod** cylinders have a rod out of each end: equal areas, equal forces and speeds both ways, and a second rod end for a cam, a stop or a sensor.
- **Tandem** cylinders put two pistons on one rod, nearly doubling the push in the same bore.
- **Multi-position** cylinders join two cylinders back to back, giving three or four fixed positions.
- **Magnetic pistons** carry a ring magnet, so that sensors clipped to the barrel report the end positions (see [[sensors-pneu]]).

> [!warn] Air trapped on both sides of a piston keeps the rod loaded even when nothing seems to be happening. Exhaust **both** chambers before removing a cylinder, a load or a fitting — venting only one side can shoot the rod out.
`,
  ideas: [
    'Both strokes are powered: push with the piston area, pull with the annulus π(D² − d²)/4.',
    'The area ratio of pneumatic cylinders is small, about 1.07–1.2, so push and pull are similar.',
    'The exhausting side keeps a back pressure while moving; net force = p_A·A₁ − p_B·A₂.',
    'A 5/3 valve can stop the piston in mid-stroke, but trapped air is a spring, not a lock.',
    'Through-rod, tandem and multi-position cylinders are variations on the same idea.'
  ],
  pitfalls: [
    'Push and pull are the same because the pressure is the same — The rod takes part of the area on the pull side; the pull is smaller by the rod\'s area, about 7–16 % for standard cylinders.',
    'The exhausting chamber is at atmospheric pressure while the piston moves — With meter-out control it is held at several bar on purpose, and that back pressure takes part of the force.',
    'A closed-centre 5/3 valve locks the rod in place — Trapped air compresses and leaks; an outside force moves the rod, and over minutes it drifts. Use a rod lock or a brake when the position must be held.'
  ],
  formulas: [
    {
      name: 'Pull force (annulus)',
      expr: 'F = p*pi*(D^2 - d^2)/4', tex: 'F = p_g\\,\\dfrac{\\pi (D^2 - d^2)}{4}',
      vars: {
        F: { name: 'theoretical pull force', q: 'force', unit: 'N' },
        p: { name: 'supply pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        D: { name: 'bore', q: 'length', unit: 'mm', value: 50 },
        d: { name: 'rod diameter', q: 'length', unit: 'mm', value: 20 }
      },
      note: 'Retracting: the air acts on the annulus around the rod. The push uses the full piston area πD²/4.',
      practice: { unknowns: ['F', 'D', 'p'] },
      stories: { F: 'A cylinder of {D} bore with a {d} rod is supplied at {p}. With what force does it pull?', D: 'A cylinder with a {d} rod must pull {F} at {p}. What bore does it need (theoretical)?' }
    },
    {
      name: 'Area ratio',
      expr: 'phi = D^2/(D^2 - d^2)', tex: '\\varphi = \\dfrac{A_1}{A_2} = \\dfrac{D^2}{D^2 - d^2}',
      vars: {
        phi: { name: 'area ratio (piston area over annulus)', tex: '\\varphi' },
        D: { name: 'bore', q: 'length', unit: 'mm', value: 50 },
        d: { name: 'rod diameter', q: 'length', unit: 'mm', value: 20 }
      },
      note: 'Push over pull at the same pressure; also the ratio of the free air used extending and retracting.',
      practice: { unknowns: ['phi', 'd'] },
      stories: { phi: 'What is the area ratio of a cylinder with a {D} bore and a {d} rod?', d: 'A cylinder of {D} bore must pull with 1/{phi} of its push. What rod diameter does that imply?' }
    },
    {
      name: 'Net force with back pressure',
      expr: 'F = pA*pi*D^2/4 - pB*pi*(D^2 - d^2)/4', tex: 'F = p_A\\,\\dfrac{\\pi D^2}{4} - p_B\\,\\dfrac{\\pi (D^2 - d^2)}{4}',
      vars: {
        F: { name: 'net force on the rod, extending', q: 'force', unit: 'N', signed: true },
        pA: { name: 'cap-end pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_A' },
        pB: { name: 'rod-end back pressure (gauge)', q: 'pressure', unit: 'bar', value: 4, tex: 'p_B' },
        D: { name: 'bore', q: 'length', unit: 'mm', value: 50 },
        d: { name: 'rod diameter', q: 'length', unit: 'mm', value: 20 }
      },
      note: 'While the piston moves the exhausting chamber is not empty: meter-out throttles keep it at several bar. Friction is extra.',
      practice: { unknowns: ['F', 'pB'] },
      stories: { F: 'A cylinder of {D} bore with a {d} rod extends with {pA} in the cap end while the meter-out throttle holds {pB} in the rod end. What net force pushes the load?', pB: 'A cylinder of {D} bore ({d} rod) at {pA} moves steadily against {F}. What back pressure holds the rod end?' }
    }
  ],
  examples: [
    {
      title: 'Push and pull of a 50 mm cylinder',
      q: 'A 50 mm cylinder with a 20 mm rod works at 6 bar gauge. What are its theoretical push and pull, and its area ratio?',
      steps: [
        '$A_1 = \\pi \\times 0.05^2/4 = 19.63$ cm²; push $= 6\\times10^5 \\times 19.63\\times10^{-4} = 1178$ N.',
        'Rod area $\\pi \\times 0.02^2/4 = 3.14$ cm², so $A_2 = 16.49$ cm²; pull $= 6\\times10^5 \\times 16.49\\times10^{-4} = 990$ N.',
        '$\\varphi = 19.63/16.49 = 1.19$.'
      ],
      a: 'About 1.18 kN push and 990 N pull; area ratio 1.19.'
    },
    {
      title: 'A through-rod cylinder',
      q: 'A through-rod cylinder of 40 mm bore has a 16 mm rod out of each end, a 150 mm stroke and works at 6 bar gauge. What force does it give each way, and how much free air does it use per cycle?',
      steps: [
        'Both sides are annuli: $A = \\pi(0.04^2 - 0.016^2)/4 = 10.56$ cm².',
        'Force each way: $6\\times10^5 \\times 10.56\\times10^{-4} = 633$ N.',
        'Free air per cycle: $2 \\times 10.56 \\times 15 \\times 6.92 = 2192$ cm³ ≈ 2.19 L.'
      ],
      a: '633 N both ways; about 2.2 L of free air per cycle.'
    },
    {
      title: 'Which way is faster?',
      q: 'A 50 mm cylinder (20 mm rod) has the same meter-out setting on both sides, giving an exhaust path of sonic conductance 0.54 dm³/(s·bar). With a light load the exhaust flow is choked. How fast does it extend and retract?',
      steps: [
        'With a choked exhaust the piston speed is about $v = C\\,p_\\text{ref}/A$ of the exhausting side (see [[cylinder-speed-pneu]]); $C\\,p_\\text{ref} = 0.54$ L/s.',
        'Extending, the annulus exhausts: $v = 0.54\\times10^{-3}/16.49\\times10^{-4} = 0.33$ m/s.',
        'Retracting, the full piston side exhausts: $v = 0.54\\times10^{-3}/19.63\\times10^{-4} = 0.27$ m/s.'
      ],
      a: 'About 0.33 m/s out and 0.27 m/s back: with equal meter-out settings the return is slower, by the area ratio.'
    }
  ],
  quiz: [
    { q: 'What is the theoretical pull of a 40 mm cylinder with a 16 mm rod at 6 bar gauge?', answer: 633, unit: 'N', tol: 0.02,
      why: '$A_2 = \\pi(0.04^2 - 0.016^2)/4 = 10.56$ cm²; $6\\times10^5 \\times 10.56\\times10^{-4} = 633$ N.' },
    { q: 'With the same meter-out throttle setting on both sides, a standard cylinder with a light load…', choices: ['extends and retracts at the same speed', 'retracts more slowly, because the exhaust must now empty the larger cap-end chamber', 'retracts faster, because the annulus holds less air', 'retracts more slowly because its pull force is smaller'], a: 1,
      why: 'With a choked exhaust the speed is the volume flow the exhaust can carry divided by the exhausting area. Extending exhausts the annulus, retracting the full piston side, so the return is slower by the area ratio (about 1.1–1.2). Meter-in, or no throttles at all, changes the picture.' },
    { q: 'A 5/3 closed-centre valve holds a cylinder rigidly in mid-stroke.', a: false,
      why: 'The trapped air is a spring: an outside force moves the rod until the pressures balance it, and leakage makes it drift. For a firm hold use a rod lock or a brake.' },
    { q: 'What is the area ratio of a 50 mm cylinder with a 20 mm rod?', answer: 1.19, tol: 0.02,
      why: '$\\varphi = D^2/(D^2 - d^2) = 2500/2100 = 1.19$.' },
    { q: 'Why choose a through-rod cylinder?', choices: ['It uses less air', 'Equal forces and speeds both ways, and a second rod end for a stop, cam or sensor', 'It needs no valve', 'It cannot buckle'], a: 1,
      why: 'With a rod on both sides the areas are equal, so push and pull, and extend and retract speeds with equal throttles, match. It uses the air of two annuli, and its rods can buckle like any other.' }
  ],
  problems: [
    { q: 'A 63 mm cylinder (20 mm rod) extends at 6 bar gauge while its meter-out throttle holds 4 bar gauge in the rod end. What net force pushes the load (ignore friction)?', answer: 749, unit: 'N', tol: 0.02,
      steps: ['$A_1 = 31.17$ cm², $A_2 = 31.17 - 3.14 = 28.03$ cm².', '$F = 6\\times10^5 \\times 31.17\\times10^{-4} - 4\\times10^5 \\times 28.03\\times10^{-4} = 1870 - 1121 = 749$ N.'] }
  ],
  applications: [
    'Pushing, lifting, transferring and clamping in assembly and packaging machines.',
    'Doors on buses and trains, driven both ways and cushioned at the ends.',
    'Multi-position cylinders for sorting gates and diverters.',
    'Tandem cylinders where the bore is limited but the force is not.'
  ],
  sim: 'ref-pneu-cylinder'
},

{
  id: 'cylinder-force', parent: 'cylinders-topic', title: 'Cylinder force and load ratio', level: 1,
  short: 'The theoretical force of a cylinder is gauge pressure times area; friction, back pressure, pressure losses and acceleration eat part of it. The load ratio — load over theoretical force — tells whether the motion will be brisk, sluggish or stalled.',
  keywords: ['cylinder force', 'theoretical force', 'effective force', 'load ratio', 'friction', 'breakaway', 'seal friction', 'load on a slope', 'inclined load', 'vertical load', 'acceleration force', 'force table', 'lbf', 'psi', 'sizing a cylinder'],
  prereq: ['pneumatic-cylinder', 'double-acting-cylinders', 'physics:friction', 'physics:newtons-second-law'],
  related: ['cylinder-speed-pneu', 'sizing-procedure', 'pressure-optimisation', 'stick-slip', 'rodless-guided', 'grippers', 'physics:inclined-plane', 'hydraulics:cylinder-types'],
  body: `
The theoretical force of a cylinder is gauge pressure times area: 483 N for a 32 mm bore at 6 bar. What it can actually move is less, and how much less decides whether the motion will be brisk, sluggish or no motion at all.

### What eats the force
- **Seal friction.** Lip seals on piston and rod press harder at higher pressure. Breakaway friction after a pause is larger than running friction; together they take about 3–20 % of the theoretical force — the larger share in small bores, where the seal's perimeter is large compared with the area.
- **Back pressure.** The exhausting chamber is not empty while the piston moves (see [[double-acting-cylinders]]); with meter-out control it pushes back with several bar.
- **Pressure losses.** While air flows, the driving chamber sits below the supply pressure — by a bar or more behind a small valve or long thin tubing.
- **Acceleration.** Getting a mass moving takes $m a$ on top of the static load.

### The load ratio
So designers compare the load with the theoretical force through the **load ratio**
$$\\lambda = \\frac{F_L}{p_g\\,A}$$
and keep it to what the job allows:

| The motion | Load ratio λ |
|---|---|
| Clamping, pressing, holding — the load is met at standstill | up to 0.85 |
| Slow or moderate motion | about 0.7 |
| Brisk motion; horizontal loads with high acceleration | 0.3–0.5 |

Near λ = 1 a cylinder moves slowly and jerkily, and stalls whenever friction rises or the pressure sags. At λ = 0.1 it is oversized: it uses far more air than needed and slams into its end caps.

### What the load is
Horizontally on a guide, only friction resists, $\\mu m g$ — but the mass still has to be accelerated. Vertically, the cylinder carries the whole weight $m g$. On a slope at angle $\\alpha$:
$$F_L = m\\left[g(\\sin\\alpha + \\mu\\cos\\alpha) + a\\right]$$
Moving a load **down**, the weight helps, but the cylinder must then brake it: the cushioning, not the force, becomes the limit (see [[pneumatic-cushioning]]).

### Forces per bore
| Bore (mm) | 4 bar | 6 bar | 8 bar | λ = 0.7 at 6 bar |
|---|---|---|---|---|
| 12 | 45 N | 68 N | 90 N | 48 N |
| 16 | 80 N | 121 N | 161 N | 84 N |
| 20 | 126 N | 188 N | 251 N | 132 N |
| 25 | 196 N | 295 N | 393 N | 206 N |
| 32 | 322 N | 483 N | 643 N | 338 N |
| 40 | 503 N | 754 N | 1.01 kN | 528 N |
| 50 | 785 N | 1.18 kN | 1.57 kN | 825 N |
| 63 | 1.25 kN | 1.87 kN | 2.49 kN | 1.31 kN |
| 80 | 2.01 kN | 3.02 kN | 4.02 kN | 2.11 kN |
| 100 | 3.14 kN | 4.71 kN | 6.28 kN | 3.30 kN |
| 125 | 4.91 kN | 7.36 kN | 9.82 kN | 5.15 kN |

These are pushes; pulls are smaller by the rod's area. In American practice pressures are in psi and forces in pounds-force: at 90 psi (6.2 bar) a 2 in bore pushes $90 \\times 3.14 = 283$ lbf.

> [!tip] Size for the lowest pressure the machine really sees — at the end of a long line during peak demand, not the compressor's setting. At 5 bar instead of 6, every cylinder loses a sixth of its force.
`,
  ideas: [
    'Theoretical force = gauge pressure × area; friction, back pressure, pressure losses and acceleration take part of it.',
    'Load ratio λ = load ÷ theoretical force: up to 0.85 for clamping, about 0.7 for slow motion, 0.3–0.5 for brisk motion.',
    'The load is friction μmg horizontally, the weight mg vertically, and m[g(sin α + μ cos α) + a] on a slope.',
    'Force scales with the square of the bore: double the bore, four times the force (and the air).',
    'Size for the lowest pressure the machine will see, not the compressor setting.'
  ],
  pitfalls: [
    'A cylinder can move any load up to its theoretical force — Friction, back pressure and pressure losses take part of it, and with nothing left to accelerate the load the motion is slow and jerky or stalls.',
    'A bigger cylinder is always the safe choice — An oversized cylinder uses more air on every stroke, reaches its end caps harder and needs more cushioning; a load ratio near 0.1 is as much a mistake as one near 1.',
    'Moving a load downwards needs no thought because gravity helps — The cylinder must then brake the load at the end of the stroke; kinetic energy and cushioning become the limit.'
  ],
  formulas: [
    {
      name: 'Load ratio',
      expr: 'LR = FL/(p*pi*D^2/4)', tex: '\\lambda = \\dfrac{F_L}{p_g\\,\\pi D^2/4}',
      vars: {
        LR: { name: 'load ratio', q: 'ratio', unit: '%', tex: '\\lambda' },
        FL: { name: 'load force (static load plus m·a)', q: 'force', unit: 'N', value: 400, tex: 'F_L' },
        p: { name: 'supply pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        D: { name: 'bore', q: 'length', unit: 'mm', value: 40 }
      },
      note: 'Extending. Up to 85 % for clamping at standstill, about 70 % for slow motion, 30–50 % for brisk motion.',
      practice: { unknowns: ['LR', 'D', 'FL'] },
      stories: { LR: 'A cylinder of {D} bore at {p} moves a load of {FL}. What is its load ratio?', D: 'A load of {FL} is to be moved at {p} with a load ratio of {LR}. What bore is needed?', FL: 'What load can a cylinder of {D} bore move at {p} with a load ratio of {LR}?' }
    },
    {
      name: 'Load of a mass on a slope',
      expr: 'FL = m*(g*(sin(alpha) + mu*cos(alpha)) + a)', tex: 'F_L = m\\left[g(\\sin\\alpha + \\mu\\cos\\alpha) + a\\right]',
      vars: {
        FL: { name: 'load force on the cylinder', q: 'force', unit: 'N', tex: 'F_L' },
        m: { name: 'moving mass', q: 'mass', unit: 'kg', value: 50 },
        g: { const: 'g' },
        alpha: { name: 'slope angle (0 horizontal, 90° vertical)', q: 'angle', unit: '°', value: 30, min: 0, max: 90, tex: '\\alpha' },
        mu: { name: 'friction coefficient of the guide', value: 0.1, min: 0, max: 1, tex: '\\mu' },
        a: { name: 'acceleration wanted', q: 'accel', unit: 'm/s²', value: 1 }
      },
      note: 'Moving up the slope. α = 0 gives a horizontal slide, μmg + ma; α = 90° a vertical lift, m(g + a).',
      practice: { unknowns: ['FL', 'm', 'a'] },
      stories: { FL: 'A {m} slide runs up a {alpha} slope on a guide with a friction coefficient of {mu}. What force must the cylinder give to accelerate it at {a}?', m: 'A cylinder can give {FL} to a slide on a {alpha} slope (friction coefficient {mu}). What mass can it accelerate at {a}?' }
    },
    {
      name: 'Effective force after friction',
      expr: 'F = eta*p*pi*D^2/4', tex: 'F_\\text{eff} = \\eta\\, p_g\\, \\dfrac{\\pi D^2}{4}',
      vars: {
        F: { name: 'effective force', q: 'force', unit: 'N', tex: 'F_\\text{eff}' },
        eta: { name: 'force efficiency (friction)', q: 'ratio', unit: '%', value: 90, min: 50, max: 100, tex: '\\eta' },
        p: { name: 'supply pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        D: { name: 'bore', q: 'length', unit: 'mm', value: 32 }
      },
      note: 'Typical efficiencies: 80–85 % for small bores, 90–95 % for large ones; lower after a long pause (breakaway).',
      practice: { unknowns: ['F', 'D'] },
      stories: { F: 'A cylinder of {D} bore works at {p}; friction leaves {eta} of the theoretical force. What force does it really give?' }
    }
  ],
  examples: [
    {
      title: 'Lifting a load',
      q: 'A cylinder must lift 30 kg vertically, accelerating it at 2 m/s², at 6 bar gauge. The designer wants a load ratio of no more than 60 %. Which standard bore?',
      steps: [
        'Load: $F_L = m(g + a) = 30 \\times (9.81 + 2) = 354$ N.',
        'Theoretical force needed: $354/0.6 = 590$ N.',
        '$D = \\sqrt{4 \\times 590/(\\pi \\times 6\\times10^5)} = 0.0354$ m = 35.4 mm, so the next standard bore is 40 mm.',
        'Check: a 40 mm bore gives 754 N, so $\\lambda = 354/754 = 47$ %.'
      ],
      a: 'A 40 mm bore; its load ratio is 47 %.'
    },
    {
      title: 'A slide on a slope',
      q: 'An 80 kg carriage runs up a 15° slope on a plain guide (μ = 0.1) and must accelerate at 1 m/s². At 6 bar gauge and a load ratio of about 70 %, is a 32 mm or a 40 mm cylinder right?',
      steps: [
        '$F_L = 80 \\times [9.81 \\times (\\sin 15° + 0.1\\cos 15°) + 1] = 80 \\times [9.81 \\times 0.355 + 1] = 359$ N.',
        '32 mm: $\\lambda = 359/483 = 74$ % — a little above 70 %; the motion will be sluggish if friction rises.',
        '40 mm: $\\lambda = 359/754 = 48$ % — brisk, with margin for pressure sags.'
      ],
      a: 'The 40 mm cylinder (λ ≈ 48 %); the 32 mm one (λ ≈ 74 %) would be marginal.'
    },
    {
      title: 'The pressure sags',
      q: 'A 40 mm cylinder moves a 450 N load, designed at 6 bar gauge. During peak demand the pressure at the machine drops to 5 bar. What happens to the load ratio?',
      steps: [
        'At 6 bar: $450/754 = 60$ %.',
        'At 5 bar the theoretical force is $5\\times10^5 \\times 12.57\\times10^{-4} = 628$ N, so $\\lambda = 450/628 = 72$ %.'
      ],
      a: 'It rises from 60 % to 72 %: the motion becomes noticeably slower and less even exactly when the plant is busiest.'
    }
  ],
  quiz: [
    { q: 'What is the load ratio of a 32 mm cylinder at 6 bar gauge moving a 300 N load?', answer: 62, unit: '%', tol: 0.03,
      why: 'Theoretical force $6\\times10^5 \\times 8.04\\times10^{-4} = 483$ N; $300/483 = 0.62$.' },
    { q: 'Doubling the bore of a cylinder at the same pressure makes its force…', choices: ['double', 'four times as large', 'rise by √2', 'stay the same, only the speed changes'], a: 1,
      why: 'Force is pressure times area, and area grows with the square of the diameter. So does the air per stroke.' },
    { q: 'A cylinder should move a load briskly and evenly. Which load ratio is sensible?', choices: ['About 95 %', 'About 85 %', 'About 40–50 %', 'About 5 %'], a: 2,
      why: 'Spare force accelerates the load and rides over friction variations. At 85–95 % the motion is slow and jerky; at 5 % the cylinder is oversized, wastes air and hits its end caps hard.' },
    { q: 'For a load moving vertically downwards, the weight can be ignored because it helps the cylinder.', a: false,
      why: 'It helps the motion, but at the end of the stroke the cylinder must stop it: the weight adds to the energy the cushions must absorb, and the back pressure must hold the load back all the way down.' },
    { q: 'What is the load on a cylinder lifting 20 kg vertically at an acceleration of 3 m/s²?', answer: 256, unit: 'N', tol: 0.02,
      why: '$F_L = m(g + a) = 20 \\times (9.81 + 3) = 256$ N.' }
  ],
  problems: [
    { q: 'A press must hold a part with 1.2 kN at 6 bar gauge; at standstill a load ratio of 85 % is acceptable. What is the smallest theoretical bore?', answer: 54.7, unit: 'mm', tol: 0.02,
      hint: 'Theoretical force = 1200/0.85.',
      steps: ['Theoretical force: $1200/0.85 = 1412$ N.', '$D = \\sqrt{4 \\times 1412/(\\pi \\times 6\\times10^5)} = 0.0547$ m = 54.7 mm.', 'The next standard bore is 63 mm.'] },
    { q: 'A 50 kg carriage is pushed horizontally on a guide with μ = 0.15 and must accelerate at 4 m/s². What force must the cylinder give?', answer: 273.5, unit: 'N', tol: 0.02,
      steps: ['$F_L = m(\\mu g + a) = 50 \\times (0.15 \\times 9.81 + 4) = 50 \\times 5.47 = 273.5$ N.'] }
  ],
  applications: [
    'Sizing cylinders for clamps, presses, lifts and transfer units.',
    'Checking an existing machine after the plant pressure is lowered to save energy.',
    'Choosing between one large cylinder and a guided or tandem unit when space is short.'
  ],
  sim: 'act-speed'
},

{
  id: 'air-consumption', parent: 'cylinders-topic', title: 'Air consumption', level: 2,
  short: 'How much free air a cylinder uses per stroke, per cycle and per minute — including the dead volumes in its end caps and the tubes to the valve, which can double the use of a small cylinder — and the difference between the average flow the compressor must make and the peak flow the valve and pipes must pass.',
  keywords: ['air consumption', 'free air', 'ANR', 'litres per stroke', 'per cycle', 'per minute', 'dead volume', 'tube volume', 'peak flow', 'average flow', 'compression ratio', 'air budget', 'L/min ANR', 'SCFM'],
  prereq: ['pneumatic-cylinder', 'standard-air', 'boyles-law'],
  related: ['consumption-budget', 'cost-of-compressed-air', 'air-saving-circuits', 'tubing-length-effect', 'single-acting-cylinders', 'double-acting-cylinders', 'fad-capacity', 'pressure-optimisation', 'valve-sizing'],
  body: `
Every stroke of a pneumatic cylinder fills a chamber with air at supply pressure and then throws that air into the room. The compressor has to make it again, so a cylinder's running cost is simply how much air it throws away — counted as **free air**, the volume the air takes at the reference atmosphere of ISO 8778:2003 (20 °C, 100 kPa; see [[standard-air]]).

### Per stroke, per cycle, per minute
A chamber of volume $V$ filled to absolute pressure $p_g + p_\\text{atm}$ holds, by [[boyles-law|Boyle's law]], $V(p_g + p_\\text{atm})/p_\\text{atm}$ of free air — 6.9 times its volume at 6 bar. For a double-acting cylinder, one cycle fills the piston side on the way out and the annulus on the way back:

$$V_\\text{cycle} = \\left[(A_1 + A_2)\\,s + V_d\\right]\\frac{p_g + p_\\text{atm}}{p_\\text{atm}}$$

where $V_d$ collects everything else that is filled and emptied: the dead volumes in the end caps and ports, and the **tubes** between valve and cylinder. Times the cycles per minute, it is the average free-air flow.

| Bore / rod (mm) | Free air per 10 mm of stroke, per cycle, at 6 bar |
|---|---|
| 16 / 6 | 0.026 L |
| 25 / 10 | 0.063 L |
| 32 / 12 | 0.104 L |
| 50 / 20 | 0.250 L |
| 63 / 20 | 0.410 L |
| 100 / 25 | 1.05 L |

### The tubes count
Tubing is filled and emptied every stroke too:

| Tube (outside × bore) | Volume per metre |
|---|---|
| 4 × 2.5 mm | 4.9 cm³ |
| 6 × 4 mm | 12.6 cm³ |
| 8 × 5.5 mm | 23.8 cm³ |
| 10 × 7.5 mm | 44.2 cm³ |
| 12 × 9 mm | 63.6 cm³ |

For a big cylinder with short tubes this adds a few per cent. For a small cylinder at the end of long tubes it can dominate: a 12 mm cylinder with a 20 mm stroke sweeps 4 cm³ a cycle, while two 3 m lengths of 4 mm tube hold 29 cm³. Mounting the valve close to the cylinder saves that air, and makes the cylinder faster too (see [[tubing-length-effect]]).

### Average and peak
The compressor sees the **average** flow of all its consumers. The valve, the tubes, the service unit and the branch pipe must pass the **peak** flow while a stroke fills — the stroke's free air divided by the stroke time, often five to ten times the average. A 50 mm cylinder filling 3.1 L of free air in 0.4 s draws 470 L/min while it moves, though it averages 70 L/min at 12 cycles a minute. Size the supply for the peak and the compressor for the average (see [[consumption-budget]]).

### A subtlety: heat
Fast filling heats the air in the chamber, so the pressure first overshoots and then sags as the air cools — and the valve tops it up. Once the chamber is back at room temperature and supply pressure, the mass of air in it is just what Boyle's law says, however fast it filled. That is why the simple formula is right for consumption, even though the process was not isothermal.

For your own cylinders use the [cylinder & air calculator](#/tools/pneu/cylinder).

> [!tip] Three cheap savings: lower the pressure to what the load needs (every bar less saves about 14 % of the air at 6 bar); feed the unloaded return stroke from a reducing valve at 2–3 bar; and shorten the tubes by mounting the valves close to the cylinders.
`,
  ideas: [
    'Count air as free air: chamber volume × (p_g + p_atm)/p_atm, about 7 times the volume at 6 bar.',
    'A double-acting cycle fills the piston side and the annulus; add the dead volumes and the tubes.',
    'Tubes can use more air than a small cylinder itself; keep valves close to the cylinders.',
    'The compressor sees the average flow; valves, tubes and service units must pass the peak flow of a stroke.',
    'Fast filling heats the air, but once it has cooled the mass in the chamber is what Boyle\'s law gives.'
  ],
  pitfalls: [
    'A cylinder uses its swept volume of air — It uses the swept volume times the absolute pressure ratio, about 7 at 6 bar, plus the dead volumes and tubes.',
    'The average flow is enough to size the valve and the supply line — While a stroke fills, the flow is often five to ten times the average; a line sized for the average starves the cylinder and slows it.',
    'Tubes are only connections — Every stroke fills and empties them; with small cylinders and long tubes they can use several times the air of the cylinder.'
  ],
  formulas: [
    {
      name: 'Free air per cycle, with dead volumes',
      expr: 'V = ((A1 + A2)*s + Vd)*(p + patm)/patm', tex: 'V_\\text{cycle} = \\left[(A_1 + A_2)\\,s + V_d\\right]\\dfrac{p_g + p_\\text{atm}}{p_\\text{atm}}',
      vars: {
        V: { name: 'free air per cycle', q: 'volume', unit: 'L', tex: 'V_\\text{cycle}' },
        A1: { name: 'piston area', q: 'area', unit: 'cm²', value: 19.63, tex: 'A_1' },
        A2: { name: 'annulus area', q: 'area', unit: 'cm²', value: 16.49, tex: 'A_2' },
        s: { name: 'stroke', q: 'length', unit: 'mm', value: 200 },
        Vd: { name: 'dead volumes and tubes, both sides', q: 'volume', unit: 'cm³', value: 115, tex: 'V_d' },
        p: { name: 'supply pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' }
      },
      note: 'Double-acting: one extend and one retract stroke. For a single-acting cylinder leave out A₂ and the dead volume on the spring side.',
      practice: { unknowns: ['V', 's', 'Vd'] },
      stories: { V: 'A cylinder ({A1} piston, {A2} annulus, stroke {s}) has {Vd} of dead volume and tubing in all and works at {p}. How much free air does one cycle use?' }
    },
    {
      name: 'Volume of a tube',
      expr: 'Vt = pi*di^2/4*L', tex: 'V_t = \\dfrac{\\pi d_i^2}{4}\\,L',
      vars: {
        Vt: { name: 'inner volume of the tube', q: 'volume', unit: 'cm³', tex: 'V_t' },
        di: { name: 'inside diameter of the tube', q: 'length', unit: 'mm', value: 5.5, tex: 'd_i' },
        L: { name: 'tube length', q: 'length', unit: 'm', value: 2 }
      },
      note: 'A tube is filled to supply pressure and emptied on every stroke on its side of the cylinder.',
      practice: { unknowns: ['Vt', 'L'] },
      stories: { Vt: 'A tube of {di} bore runs {L} from the valve to the cylinder. What volume must be filled on each stroke?' }
    },
    {
      name: 'Average free-air flow',
      expr: 'Q = Vc*n', tex: 'Q = V_\\text{cycle}\\,n',
      vars: {
        Q: { name: 'average free-air flow', q: 'airflow', unit: 'L/min ANR' },
        Vc: { name: 'free air per cycle', q: 'volume', unit: 'L', value: 5.8, tex: 'V_\\text{cycle}' },
        n: { name: 'cycles per minute', q: 'frequency', unit: '1/min', value: 12 }
      },
      note: 'Add the flows of all consumers (with how often each really runs) for the compressor\'s load.',
      practice: { unknowns: ['Q', 'n'] },
      stories: { Q: 'A cylinder uses {Vc} of free air per cycle and cycles {n}. What average flow does it take from the compressor?' }
    },
    {
      name: 'Peak flow while a stroke fills',
      expr: 'Qp = V*(p + patm)/(patm*t)', tex: 'Q_p = \\dfrac{V}{t}\\cdot\\dfrac{p_g + p_\\text{atm}}{p_\\text{atm}}',
      vars: {
        Qp: { name: 'peak free-air flow during the stroke', q: 'airflow', unit: 'L/min ANR', tex: 'Q_p' },
        V: { name: 'volume filled in the stroke (chamber, dead volume and tube)', q: 'volume', unit: 'cm³', value: 450 },
        p: { name: 'supply pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' },
        t: { name: 'stroke time', q: 'time', unit: 's', value: 0.4 }
      },
      note: 'A mean over the stroke; the flow is higher still just after the valve opens. Size the valve, tubes, service unit and branch line for it.',
      practice: { unknowns: ['Qp', 't'] },
      stories: { Qp: 'A stroke fills {V} to {p} in {t}. What free-air flow must the supply pass during the stroke?' }
    }
  ],
  examples: [
    {
      title: 'A cylinder with its tubes',
      q: 'A 50 mm cylinder (20 mm rod, 200 mm stroke) at 6 bar gauge cycles 12 times a minute. It is fed by 2 m of 8 × 5.5 mm tube on each side and has about 10 cm³ of dead volume in each end cap. What does it use per cycle and per minute, and what share goes into tubes and dead volumes?',
      steps: [
        'Swept volume: $(19.63 + 16.49) \\times 20 = 722.6$ cm³.',
        'Tubes: $\\pi \\times 0.55^2/4 \\times 200 = 47.5$ cm³ each, 95.0 cm³ both; dead volumes 20 cm³; $V_d = 115$ cm³.',
        'Free air per cycle: $(722.6 + 115) \\times 6.92 = 5800$ cm³ = 5.80 L.',
        'Per minute: $5.80 \\times 12 = 69.6$ L/min; without tubes and dead volumes it would be 60.0 L/min.'
      ],
      a: '5.8 L per cycle, about 70 L/min; the tubes and dead volumes add 16 %.'
    },
    {
      title: 'Peak against average',
      q: 'The same cylinder extends in 0.4 s. What free-air flow must the valve and supply pass while it extends?',
      steps: [
        'Volume filled extending: piston side $19.63 \\times 20 = 392.7$ cm³, plus one tube (47.5 cm³) and one end cap (10 cm³): 450 cm³.',
        'Free air: $450 \\times 6.92 = 3117$ cm³ = 3.12 L.',
        'In 0.4 s: $3.12/0.4 = 7.8$ L/s = 468 L/min.'
      ],
      a: 'About 470 L/min while it moves — nearly seven times its 70 L/min average.'
    },
    {
      title: 'A small cylinder at the end of long tubes',
      q: 'A 12 mm cylinder (6 mm rod) with a 20 mm stroke is fed through 3 m of 4 × 2.5 mm tube on each side, at 6 bar gauge. Compare the air used by the cylinder and by its tubes.',
      steps: [
        'Swept volume: $(1.131 + 0.848) \\times 2 = 3.96$ cm³ per cycle.',
        'Tubes: $\\pi \\times 0.25^2/4 \\times 300 = 14.7$ cm³ each, 29.5 cm³ both — 7.4 times the swept volume.',
        'Free air per cycle: $(3.96 + 29.5) \\times 6.92 = 231$ cm³, of which the cylinder itself uses only 27 cm³.'
      ],
      a: 'The tubes use seven times as much air as the cylinder; a valve mounted at the cylinder would cut the consumption by almost 90 %.'
    }
  ],
  quiz: [
    { q: 'Which stroke of a double-acting cylinder uses more free air?', choices: ['Extending', 'Retracting', 'Both use the same', 'It depends on the load'], a: 0,
      why: 'Extending fills the full piston area, retracting only the annulus. The load changes the force, not the volume filled.' },
    { q: 'What is the inner volume of 2 m of tube with a 5.5 mm bore?', answer: 47.5, unit: 'cm³', tol: 0.02,
      why: '$\\pi \\times 0.55^2/4 \\times 200 = 0.2376 \\times 200 = 47.5$ cm³.' },
    { q: 'Raising the supply from 6 to 8 bar gauge increases a cylinder\'s air consumption by one third.', a: false,
      why: 'Consumption follows the absolute pressure: $9.013/7.013 = 1.285$, an increase of 28.5 %, not 33 %.' },
    { q: 'A plant has 40 cylinders whose average flows add up to 1.2 m³/min. What must that figure be used for?', choices: ['Sizing each cylinder\'s valve', 'Sizing the compressor (with a margin and the leaks)', 'Sizing each cylinder\'s tubes', 'Nothing: only peaks matter'], a: 1,
      why: 'The compressor and the receiver see the average of all consumers. Each valve, tube and branch line must pass its own cylinder\'s peak flow while a stroke fills.' },
    { q: 'A 40 mm cylinder (16 mm rod) with a 150 mm stroke cycles 20 times a minute at 6 bar gauge. What is its average free-air flow, ignoring tubes and dead volumes?', answer: 48, unit: 'L/min', tol: 0.03,
      why: '$(12.57 + 10.56) \\times 15 = 347$ cm³ per cycle; $\\times 6.92 = 2.40$ L; $\\times 20 = 48$ L/min.' }
  ],
  problems: [
    { q: 'A 32 mm cylinder (12 mm rod) with a 100 mm stroke cycles 30 times a minute at 5 bar gauge, fed by 1.5 m of 6 × 4 mm tube on each side. What is its average free-air flow?', answer: 33.3, unit: 'L/min', tol: 0.03,
      steps: ['Swept: $(8.04 + 6.91) \\times 10 = 149.5$ cm³.', 'Tubes: $\\pi \\times 0.4^2/4 \\times 150 = 18.8$ cm³ each, 37.7 cm³ both.', 'Ratio at 5 bar: $6.013/1.013 = 5.94$.', 'Per cycle: $(149.5 + 37.7) \\times 5.94 = 1111$ cm³ = 1.11 L.', 'Per minute: $1.11 \\times 30 = 33.3$ L/min.'],
      hint: 'Swept volume of both strokes plus both tubes, times the absolute pressure ratio.' }
  ],
  applications: [
    'Building an air budget for a new machine and sizing its supply.',
    'Choosing between long tubes and valves mounted on the cylinders.',
    'Estimating the savings of a lower pressure or a reduced return-stroke pressure.'
  ],
  sim: 'ref-air-consumption'
},

{
  id: 'cylinder-speed-pneu', parent: 'cylinders-topic', title: 'Cylinder speed', level: 2,
  short: 'A pneumatic cylinder\'s speed comes from a race between a filling and an emptying chamber. With meter-out control the choked exhaust sets it — v ≈ C·p_ref/A — so the valve, tubes and throttle decide the speed, and the supply pressure hardly does.',
  keywords: ['cylinder speed', 'piston speed', 'stroke time', 'meter-out', 'meter-in', 'choked exhaust', 'sonic conductance', 'back pressure', 'dead time', 'delay', 'overshoot', 'valve size', 'speed control', 'm/s'],
  prereq: ['pneumatic-cylinder', 'choked-flow', 'sonic-conductance', 'flow-control-pneu'],
  related: ['cylinder-motion', 'valve-sizing', 'conductance-series', 'tubing-length-effect', 'stick-slip', 'pneumatic-cushioning', 'quick-exhaust', 'double-acting-cylinders', 'hydraulics:cylinder-speed', 'hydraulics:meter-in-out'],
  body: `
A hydraulic cylinder moves at pump flow divided by area (see [[hydraulics:cylinder-speed]]). A pneumatic cylinder has no such simple master: its speed comes out of a race between two chambers, one filling through the valve and one emptying through its exhaust. Standard cylinders run at 0.1–1.5 m/s; special seals and bearings allow 3 m/s and more, while below about 20–50 mm/s the motion turns jerky — the realm of [[stick-slip]].

### Anatomy of a stroke
1. **Delay.** The valve switches; the driving chamber starts to fill and the other to empty, but nothing moves until the pressure difference beats friction and load. With a heavy load this dead time can be a large part of the stroke time.
2. **Acceleration.** The piston speeds up; the moving mass on its two air springs often overshoots and oscillates a little.
3. **Steady speed.** The speed settles where the air leaving the exhausting chamber matches the volume the piston sweeps.
4. **The end.** The cushion brakes the piston, the driving chamber fills to supply pressure, and the stroke is over.

### What sets the steady speed
With meter-out control and a moderate load the exhausting chamber stays at several bar and its outflow is **choked** (see [[choked-flow]]). By ISO 6358-1:2013 the mass flow is then $\\dot m = C\\,p_B\\,\\rho_\\text{ref}$, set by the sonic conductance $C$ of the exhaust path and the chamber pressure $p_B$. The chamber gives up volume at $A_2 v$, filled with air of density $\\rho_\\text{ref}\\,p_B/p_\\text{ref}$. Equate the two and the pressure cancels:

$$v = \\frac{C\\,p_\\text{ref}}{A_2}$$

As long as the exhaust is choked, **the speed depends neither on the supply pressure nor on the load** — only on the exhaust path's conductance and the area it drains. A 50 mm cylinder whose exhaust path has $C$ = 0.54 dm³/(s·bar) runs at $0.54\\times10^{-3}/16.5\\times10^{-4} = 0.33$ m/s at 4, 6 or 8 bar alike.

The exhaust stays choked while $p_\\text{atm}/p_B$ is below the critical pressure ratio $b$ (0.2–0.5 for valves) — while the back pressure $p_B = (p_A A_1 - F)/A_2$ stays above roughly 2–4 bar absolute. A heavy load lowers that back pressure until the flow is no longer choked: the cylinder then runs slower than $C p_\\text{ref}/A_2$ and starts later — the familiar slowdown above a load ratio of about 0.6. Valve, fittings, tubes and throttle in series combine roughly as $1/C^2 = \\sum 1/C_i^2$ (see [[conductance-series]]).

### What changes it
| Change | Effect (meter-out, choked exhaust) |
|---|---|
| Twice the exhaust conductance | about twice the speed |
| Higher supply pressure | little change of speed; shorter delay, harder impact, more air |
| Larger bore, same valve | slower, $v \\propto 1/A$ |
| Load ratio above about 0.6 | slower, longer delay, less even |
| More moving mass | longer acceleration and overshoot, harder impact; similar top speed |
| Long thin tubes | slower, and a longer delay while their volume fills |

Meter-in control throttles the incoming air instead and leaves no back pressure: the piston is pushed by a soft air spring against friction and moves in jerks. It suits single-acting cylinders and a few special cases (see [[flow-control-pneu]]).

> [!key] With meter-out control a cylinder's speed is set by its exhaust: $v \\approx C\\,p_\\text{ref}/A_2$. To go faster, open the throttle or fit a bigger valve and tubes — raising the pressure mostly buys harder end impacts.
`,
  ideas: [
    'A stroke has a delay, an acceleration, a steady phase and a braked end.',
    'With meter-out control and a choked exhaust, v ≈ C·p_ref/A of the exhausting side: pressure and load cancel out.',
    'The exhaust stays choked while the back pressure is above roughly 2–4 bar absolute; heavy loads lose that and slow down.',
    'Valve, tubes and throttle in series add as 1/C² = Σ 1/Cᵢ²: the smallest one dominates.',
    'Typical speeds are 0.1–1.5 m/s; below about 20–50 mm/s motion becomes stick-slip.'
  ],
  pitfalls: [
    'Raise the pressure to make a cylinder faster — With a choked exhaust the steady speed does not depend on the pressure; more pressure shortens the start delay a little and makes the end impact harder.',
    'A bigger valve on the supply side is what matters — With meter-out control the exhaust path sets the speed; the supply side must only keep up.',
    'A cylinder moves the instant its valve switches — The chambers must first fill and empty until the pressure difference beats friction and load; with heavy loads this delay can be hundreds of milliseconds.'
  ],
  formulas: [
    {
      name: 'Speed with a choked exhaust',
      expr: 'v = C*pref/A2', tex: 'v = \\dfrac{C\\,p_\\text{ref}}{A_2}',
      vars: {
        v: { name: 'steady piston speed', q: 'speed', unit: 'm/s' },
        C: { name: 'sonic conductance of the exhaust path (valve, tube, throttle)', q: 'flowcond', unit: 'dm³/(s·bar)', value: 0.54 },
        pref: { name: 'reference pressure (ISO 8778, 100 kPa absolute)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_\\text{ref}' },
        A2: { name: 'area of the exhausting side (annulus when extending)', q: 'area', unit: 'cm²', value: 16.49, tex: 'A_2' }
      },
      note: 'Meter-out control, air near 20 °C. Valid while the exhaust is choked (back pressure above about 2–4 bar absolute); the cooling of the expanding air makes the real speed a few per cent lower. Retracting, use the piston area.',
      practice: { unknowns: ['v', 'C'] },
      stories: { v: 'A cylinder extends with meter-out control; its annulus is {A2} and its exhaust path has a sonic conductance of {C}. How fast does it run while the exhaust is choked?', C: 'A cylinder whose annulus is {A2} must extend at {v}. What sonic conductance must its exhaust path have?' }
    },
    {
      name: 'Back pressure in steady motion',
      expr: 'pB = (pA*A1 - F)/A2', tex: 'p_B = \\dfrac{p_A A_1 - F}{A_2}',
      vars: {
        pB: { name: 'rod-end back pressure (gauge)', q: 'pressure', unit: 'bar', tex: 'p_B' },
        pA: { name: 'cap-end pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_A' },
        A1: { name: 'piston area', q: 'area', unit: 'cm²', value: 19.63, tex: 'A_1' },
        A2: { name: 'annulus area', q: 'area', unit: 'cm²', value: 16.49, tex: 'A_2' },
        F: { name: 'load plus friction', q: 'force', unit: 'N', value: 400 }
      },
      note: 'Force balance at constant speed. Add 1.013 bar for the absolute pressure; the exhaust is choked while p_atm/p_B(abs) < b.',
      practice: { unknowns: ['pB', 'F'] },
      stories: { pB: 'A cylinder ({A1} piston, {A2} annulus) extends steadily against {F} with {pA} in the cap end. What back pressure holds the rod end?' }
    },
    {
      name: 'Estimated stroke time',
      expr: 't = t0 + s/v', tex: 't = t_0 + \\dfrac{s}{v}',
      vars: {
        t: { name: 'stroke time', q: 'time', unit: 's' },
        t0: { name: 'delay before the piston moves', q: 'time', unit: 's', value: 0.06, tex: 't_0' },
        s: { name: 'stroke', q: 'length', unit: 'mm', value: 200 },
        v: { name: 'steady speed', q: 'speed', unit: 'm/s', value: 0.33 }
      },
      note: 'A first estimate; acceleration and cushioning add a little. The delay is tens of milliseconds for light loads and grows with the load ratio.',
      practice: { unknowns: ['t', 'v'] },
      stories: { t: 'A cylinder with a {s} stroke runs at {v} after a delay of {t0}. About how long does a stroke take?', v: 'A {s} stroke must take {t}, of which {t0} is the start delay. What steady speed is needed?' }
    }
  ],
  examples: [
    {
      title: 'Speed from the exhaust conductance',
      q: 'A 50 mm cylinder (20 mm rod) extends with its meter-out throttle set to 0.6 dm³/(s·bar), behind a valve of 1.2 dm³/(s·bar). Estimate its steady speed and the time for a 200 mm stroke.',
      steps: [
        'Conductances in series: $C = 1/\\sqrt{1/1.2^2 + 1/0.6^2} = 0.54$ dm³/(s·bar), so $C\\,p_\\text{ref} = 0.54$ L/s.',
        'Annulus: $A_2 = 16.49$ cm²; $v = 0.54\\times10^{-3}/16.49\\times10^{-4} = 0.33$ m/s.',
        'Stroke time: $0.06 + 0.2/0.33 = 0.67$ s.'
      ],
      a: 'About 0.33 m/s and 0.67 s per stroke — the same at 4, 6 or 8 bar.'
    },
    {
      title: 'When the load gets heavy',
      q: 'The same cylinder at 6 bar gauge moves loads (with friction) of 400 N and 900 N. Is the exhaust choked in each case, if the critical pressure ratio is 0.3?',
      steps: [
        '400 N: $p_B = (6\\times10^5 \\times 19.63\\times10^{-4} - 400)/16.49\\times10^{-4} = 4.72$ bar gauge = 5.73 bar absolute; $1.013/5.73 = 0.18 < 0.3$: choked, and $v = 0.33$ m/s.',
        '900 N: $p_B = (1178 - 900)/16.49\\times10^{-4} = 1.69$ bar gauge = 2.70 bar absolute; $1.013/2.70 = 0.375 > 0.3$: not choked.',
        'With the heavy load the exhaust passes less than $C p_B$, so the cylinder runs slower than 0.33 m/s — and it starts much later, because the rod end must first empty to 1.7 bar.'
      ],
      a: 'Choked at 400 N (0.33 m/s); not at 900 N, which runs slower and starts later.'
    },
    {
      title: 'Choosing the valve for a speed',
      q: 'A 63 mm cylinder (20 mm rod) must extend at 0.8 m/s. What conductance must its exhaust path have, and how big a valve is sensible if tubes and throttle together have about 3 dm³/(s·bar)?',
      steps: [
        '$A_2 = 31.17 - 3.14 = 28.03$ cm²; $C = v A_2/p_\\text{ref} = 0.8 \\times 28.03\\times10^{-4}/10^5 = 2.24\\times10^{-8}$ m³/(s·Pa) = 2.24 dm³/(s·bar).',
        'With 3 dm³/(s·bar) for tubes and throttle in series: $1/C_v^2 = 1/2.24^2 - 1/3^2 = 0.088$, so $C_v = 3.4$ dm³/(s·bar).'
      ],
      a: 'The exhaust path needs about 2.2 dm³/(s·bar); with the tubes and throttle, a valve of about 3.5 dm³/(s·bar).'
    }
  ],
  quiz: [
    { q: 'A cylinder with meter-out control runs at 0.3 m/s at 6 bar. The supply is raised to 8 bar. Its steady speed becomes about…', choices: ['0.3 m/s — hardly any change', '0.4 m/s', '0.53 m/s', '0.23 m/s'], a: 0,
      why: 'With a choked exhaust $v = C p_\\text{ref}/A_2$: pressure does not appear. The start delay shortens a little and the end impact grows.' },
    { q: 'What steady speed does a 32 mm cylinder (12 mm rod) reach extending, if its exhaust path has C = 0.5 dm³/(s·bar) and the flow is choked?', answer: 0.72, unit: 'm/s', tol: 0.03,
      why: '$A_2 = 8.04 - 1.13 = 6.91$ cm²; $v = 0.5\\times10^{-3}/6.91\\times10^{-4} = 0.72$ m/s.' },
    { q: 'Meter-out control gives a steadier motion than meter-in control.', a: true,
      why: 'Meter-out holds the piston between two pressurised chambers, a stiff pair of air springs; meter-in leaves the exhausting side empty, so the piston is pushed by one soft spring against friction and jerks.' },
    { q: 'Closing a meter-out throttle so that the exhaust path\'s conductance halves makes the steady speed…', choices: ['half', 'a quarter', 'about 70 %', 'unchanged'], a: 0,
      why: 'The speed is proportional to the conductance of the exhaust path: $v = C p_\\text{ref}/A_2$.' },
    { q: 'Why does a cylinder not move for the first tens of milliseconds after its valve switches?', choices: ['The valve is slow to open', 'The chambers must fill and empty until the pressure difference beats friction and load', 'Air travels slowly in tubes', 'The piston must first overcome its magnet'], a: 1,
      why: 'Solenoid valves switch in about 10–30 ms, and pressure waves cross a tube in milliseconds; most of the delay is the filling and emptying of the chambers.' }
  ],
  problems: [
    { q: 'A 40 mm cylinder (16 mm rod) with a 300 mm stroke has an exhaust path of C = 0.8 dm³/(s·bar) and a start delay of 0.05 s. Estimate its extending stroke time.', answer: 0.446, unit: 's', tol: 0.03,
      steps: ['$A_2 = 12.57 - 2.01 = 10.56$ cm².', '$v = 0.8\\times10^{-3}/10.56\\times10^{-4} = 0.758$ m/s.', '$t = 0.05 + 0.3/0.758 = 0.446$ s.'] }
  ],
  applications: [
    'Setting cycle times of packaging and assembly machines with meter-out throttles.',
    'Choosing valve and tube sizes for a required stroke time.',
    'Diagnosing a slow machine: a kinked tube, a clogged silencer or a small valve.'
  ],
  sim: 'act-speed'
},

{
  id: 'pneumatic-cushioning', parent: 'cylinders-topic', title: 'Cushioning', level: 2,
  short: 'Stopping the moving mass at the end of each stroke: elastic bumpers for small energies, adjustable pneumatic cushions that trap the last of the exhaust air, and hydraulic shock absorbers for large ones. The kinetic energy ½mv² must stay below what the cushioning can absorb, or end caps crack.',
  keywords: ['cushioning', 'end-position cushioning', 'air cushion', 'pneumatic cushion', 'cushion needle', 'cushion spigot', 'elastic bumpers', 'shock absorber', 'kinetic energy', 'impact energy', 'impact speed', 'end cap', 'self-adjusting cushioning', 'bounce'],
  prereq: ['physics:kinetic-energy', 'cylinder-speed-pneu', 'pneumatic-cylinder'],
  related: ['kinetic-energy-limits', 'pneumatic-spring', 'rotary-actuators-pneu', 'cylinder-force', 'noise-silencers', 'hydraulics:cushioning', 'physics:work-energy-theorem'],
  body: `
At the end of every stroke the moving mass must stop. Left to hit the end cap, its kinetic energy
$$E = \\tfrac12 m v^2$$
goes into the piston, the end cap, the tie rods and the rod thread in one sharp blow — the kind that cracks end caps, loosens pistons, breaks rod threads, shakes the machine and makes a great deal of noise. A 5 kg slide at 1 m/s carries 2.5 J; at 2 m/s it carries four times as much. Cushioning turns that energy into heat over a controlled distance.

### Elastic bumpers
Rings of polyurethane or rubber on the piston or in the end caps. They deflect a millimetre or two, so the braking force is high — stopping 1 J in 1 mm takes an average of 1 kN — and they can take only small energies. They are standard on small and compact cylinders.

### Adjustable pneumatic cushioning
Near the end of the stroke a cushion spigot on the piston enters a seal in the end cap and traps the last of the exhaust air, which can now escape only through a small adjustable needle valve. The trapped air is compressed, its pressure climbs well above the supply, and it brakes the piston over the cushion length of about 15–30 mm. A check valve lets air bypass the needle for a quick start on the return. After the first braking the piston runs on at the speed the choked needle allows, $C_n\\,p_\\text{ref}/A_2$ — the rule of [[cylinder-speed-pneu]] again. Set correctly, the piston glides into its end position; with the needle too open it still hits hard; with the needle closed too far it stops short, bounces back and creeps home as the air leaks away, costing cycle time. Self-adjusting cushions replace the needle with grooves shaped to suit a range of loads.

### Shock absorbers
Hydraulic shock absorbers against an external stop absorb far more — from about 1 J per stroke for the smallest (M8 thread) through tens of joules (M20–M25) to hundreds for large ones — at a nearly constant force over their 6–25 mm stroke. For them count the **drive force** too: the cylinder keeps pushing while the absorber brakes, so each stroke brings

$$E_c = \\tfrac12 m v^2 + F_d L$$

with $F_d$ the cylinder force (plus $m g$ for a load moving down) and $L$ the absorber's stroke. Often the drive term is the larger one. Absorbers also have a limit per hour, because the heat must go somewhere.

### How much can a cylinder take?
Typical figures for standard cylinders at 6 bar; the maker's figure for the actual cylinder is what counts:

| Bore (mm) | Elastic bumpers | Adjustable air cushion | Cushion length |
|---|---|---|---|
| 16 | 0.1 J | 0.2 J | ≈ 10 mm |
| 25 | 0.3 J | 0.5 J | ≈ 14 mm |
| 32 | 0.4 J | 1 J | ≈ 18 mm |
| 50 | 1 J | 2.5 J | ≈ 20 mm |
| 63 | 1.3 J | 4 J | ≈ 22 mm |
| 80 | 2 J | 6 J | ≈ 26 mm |
| 100 | 2.5 J | 10 J | ≈ 28 mm |

Use the **impact speed**, not the average over the stroke: each stroke starts slowly, so the final speed is often 1.3–2 times the average. A load moving down arrives with gravity's help, and the cushion must also hold its weight — check it separately. When the energy is too large, lower the speed (the energy falls with its square), lower the mass, add shock absorbers, or choose a larger bore with more cushioning.

> [!warn] An end cap cracked by repeated overloading can let go suddenly and throw the rod and its load. Check the kinetic energy whenever a cylinder is given a heavier load or a higher speed, and never stand in line with a cylinder being tested for the first time.
`,
  ideas: [
    'The energy to stop is ½mv²: double the speed, four times the energy.',
    'Elastic bumpers stop in a millimetre or two and take only small energies.',
    'A pneumatic cushion traps the last exhaust air behind a needle valve and brakes over 15–30 mm; too open hits, too closed bounces.',
    'Shock absorbers take the most, but the cylinder\'s drive force over their stroke adds to the energy.',
    'Use the impact speed, often 1.3–2 times the average speed over the stroke.'
  ],
  pitfalls: [
    'Closing the cushion needle fully gives the best cushioning — The trapped air then stops the piston short and throws it back; it creeps home as the air leaks, and the cycle slows. The best setting just lets the piston arrive gently.',
    'The average speed over the stroke tells the impact energy — Strokes start slowly, so the final speed is higher, often 1.3–2 times the average; the energy goes with its square.',
    'A shock absorber only has to absorb the kinetic energy — The cylinder keeps pushing while the absorber brakes; its force times the absorber stroke often exceeds the kinetic energy.'
  ],
  formulas: [
    {
      name: 'Kinetic energy at the end of the stroke',
      expr: 'E = m*v^2/2', tex: 'E = \\tfrac12 m v^2',
      vars: {
        E: { name: 'kinetic energy at impact', q: 'energy', unit: 'J' },
        m: { name: 'moving mass (piston, rod and load)', q: 'mass', unit: 'kg', value: 5 },
        v: { name: 'impact speed', q: 'speed', unit: 'm/s', value: 1 }
      },
      note: 'Compare with the energy the bumpers or the cushion can absorb (maker\'s data).',
      practice: { unknowns: ['E', 'v', 'm'] },
      stories: { E: 'A cylinder moves {m} and arrives at its end position at {v}. What energy must the cushioning absorb?', v: 'A cylinder\'s cushioning can absorb {E}. What is the highest impact speed allowed for a moving mass of {m}?' }
    },
    {
      name: 'Energy per stroke for a shock absorber',
      expr: 'Ec = m*v^2/2 + Fd*L', tex: 'E_c = \\tfrac12 m v^2 + F_d L',
      vars: {
        Ec: { name: 'energy the absorber takes per stroke', q: 'energy', unit: 'J', tex: 'E_c' },
        m: { name: 'moving mass', q: 'mass', unit: 'kg', value: 20 },
        v: { name: 'impact speed', q: 'speed', unit: 'm/s', value: 1 },
        Fd: { name: 'drive force while braking (cylinder force, plus mg moving down)', q: 'force', unit: 'N', value: 1374, tex: 'F_d' },
        L: { name: 'absorber stroke', q: 'length', unit: 'mm', value: 16 }
      },
      note: 'Conservative: the full cylinder force pushes through the whole absorber stroke. Check the energy per hour too.',
      practice: { unknowns: ['Ec', 'v'] },
      stories: { Ec: 'A {m} load arrives at {v} at a shock absorber with a {L} stroke while the cylinder pushes with {Fd}. What energy must the absorber take per stroke?' }
    },
    {
      name: 'Average braking force',
      expr: 'F = m*v^2/(2*L)', tex: 'F_b = \\dfrac{m v^2}{2L}',
      vars: {
        F: { name: 'average braking force', q: 'force', unit: 'N', tex: 'F_b' },
        m: { name: 'moving mass', q: 'mass', unit: 'kg', value: 6 },
        v: { name: 'impact speed', q: 'speed', unit: 'm/s', value: 0.8 },
        L: { name: 'braking distance (cushion length, bumper deflection)', q: 'length', unit: 'mm', value: 20 }
      },
      note: 'The mean force over the braking distance; the peak is higher. Divided by m it is the deceleration.',
      practice: { unknowns: ['F', 'L'] },
      stories: { F: 'A {m} load at {v} is stopped over {L}. What average braking force does that take?' }
    }
  ],
  examples: [
    {
      title: 'Bumpers or air cushion?',
      q: 'A 50 mm cylinder moves a 6 kg slide and arrives at 0.8 m/s. It can be had with elastic bumpers (about 1 J) or adjustable air cushions (about 2.5 J). Which will do?',
      steps: [
        '$E = \\tfrac12 \\times 6 \\times 0.8^2 = 1.92$ J.',
        'Bumpers: 1.92 J against 1 J — nearly twice the limit.',
        'Air cushion: 1.92 J against 2.5 J — 77 %, acceptable with a correctly set needle.',
        'With bumpers the speed would have to fall to $\\sqrt{2 \\times 1/6} = 0.58$ m/s.'
      ],
      a: 'The air-cushioned cylinder (77 % of its limit); bumpers would need the speed cut to 0.58 m/s.'
    },
    {
      title: 'A shock absorber for a falling load',
      q: 'A 50 mm cylinder at 6 bar lowers a 20 kg load vertically and arrives at 1 m/s at a shock absorber with a 16 mm stroke. Which absorber size: about 30 J (M20) or about 60 J (M25)?',
      steps: [
        'Kinetic energy: $\\tfrac12 \\times 20 \\times 1^2 = 10$ J.',
        'Drive force: the cylinder pushes with 1178 N and the weight adds 196 N: $F_d = 1374$ N.',
        'Drive work over 16 mm: $1374 \\times 0.016 = 22$ J; total $E_c = 32$ J.'
      ],
      a: 'About 32 J per stroke: the 30 J absorber is overloaded; take the 60 J size. The drive work, not the kinetic energy, was the larger part.'
    },
    {
      title: 'Why bumpers take little',
      q: 'Compare the average braking force and deceleration when the 6 kg slide at 0.8 m/s is stopped in a 20 mm air cushion and by a bumper deflecting 1 mm.',
      steps: [
        'Air cushion: $F_b = 6 \\times 0.8^2/(2 \\times 0.02) = 96$ N; deceleration $96/6 = 16$ m/s², about 1.6 g.',
        'Bumper: $F_b = 6 \\times 0.64/(2 \\times 0.001) = 1920$ N; deceleration 320 m/s², about 33 g.'
      ],
      a: '96 N (1.6 g) against 1.9 kN (33 g): the short stop multiplies the force twenty times, which the parts and the load must survive.'
    }
  ],
  quiz: [
    { q: 'Doubling the impact speed of a cylinder\'s load makes the energy its cushions must absorb…', choices: ['double', 'four times as large', 'eight times as large', 'unchanged'], a: 1,
      why: 'Kinetic energy is ½mv²: it grows with the square of the speed.' },
    { q: 'What kinetic energy does a 3 kg load have at 1.2 m/s?', answer: 2.16, unit: 'J', tol: 0.02,
      why: '$\\tfrac12 \\times 3 \\times 1.2^2 = 2.16$ J.' },
    { q: 'Closing the cushion needle fully gives the best cushioning.', a: false,
      why: 'The trapped air then stops the piston short of the end and throws it back; it creeps home only as the air leaks out. The right setting lets the piston arrive gently without bouncing.' },
    { q: 'A 12 kg load must stop from 1.5 m/s (13.5 J) at the end of a 50 mm cylinder. What is the practical solution?', choices: ['Close the cushion needle further', 'External shock absorbers, or a lower speed', 'Raise the supply pressure', 'Fit harder bumpers'], a: 1,
      why: '13.5 J is several times what a 50 mm cylinder\'s own cushions take (about 2.5 J). Shock absorbers take tens of joules; halving the speed would quarter the energy.' },
    { q: 'The mass on a cylinder is doubled. To keep the same impact energy, the impact speed must fall to about…', choices: ['half', '71 % (1/√2)', 'a quarter', 'the same speed'], a: 1,
      why: '$E = \\tfrac12 m v^2$; with $2m$, $v$ must fall by $\\sqrt2$ to keep $E$.' }
  ],
  problems: [
    { q: 'A cylinder\'s cushions can absorb 2.5 J. What is the highest impact speed for a 10 kg moving mass?', answer: 0.707, unit: 'm/s', tol: 0.02,
      steps: ['$v = \\sqrt{2E/m} = \\sqrt{2 \\times 2.5/10} = 0.707$ m/s.'] }
  ],
  applications: [
    'Setting the cushion needles of a new machine, stroke by stroke, until each piston arrives without a knock.',
    'Choosing shock absorbers for fast transfer units and heavy slides.',
    'Diagnosing loud end impacts and cracked end caps after a load or speed was increased.'
  ],
  sim: 'act-cushion'
},

{
  id: 'rodless-guided', parent: 'cylinders-topic', title: 'Rodless, guided and compact cylinders', level: 1,
  short: 'Cylinders built around what the machine needs: rodless cylinders (band or magnetic coupling) move a carriage along the barrel with little more length than the stroke; guided cylinders and slides carry side loads and torques; compact cylinders give short strokes in a very short body.',
  keywords: ['rodless cylinder', 'band cylinder', 'slot cylinder', 'sealing band', 'magnetic coupling', 'decoupling', 'carriage', 'guided cylinder', 'guide rods', 'ball bushings', 'slide unit', 'compact cylinder', 'short-stroke', 'ISO 21287', 'non-rotating rod', 'moments', 'load factor'],
  prereq: ['double-acting-cylinders', 'cylinder-force', 'physics:torque'],
  related: ['iso-15552', 'pneumatic-cushioning', 'pick-and-place', 'grippers', 'servo-pneumatics', 'hydraulics:mounting-side-load', 'physics:magnetic-materials'],
  body: `
A standard cylinder needs room for its body and then as much again for its rod: a 1 m stroke takes more than 2 m when extended. And its rod, supported only by one bearing, is not meant to carry side loads. Rodless and guided cylinders answer both problems.

### Rodless cylinders
A rodless cylinder keeps its piston inside the barrel and passes the force to a **carriage** running along the outside. The installation length is little more than the stroke, the piston areas are equal on both sides (so are the forces and, with equal throttles, the speeds), and very long strokes become practical.

- **Band (slot) cylinders.** The barrel has a slot along its length; a yoke through the slot joins piston and carriage. A flexible steel sealing band closes the slot from inside — lifted locally by the piston and pressed back behind it — and a cover band keeps dirt out. Strokes of several metres, strong carriages with integrated guides that carry the loads and moments. The price is a slight leakage and wear along the bands.
- **Magnetically coupled cylinders.** A closed round barrel with a stack of magnets in the piston and a matching one in the carriage. Nothing leaks and no slot collects dirt, which suits clean rooms and food machines. But the coupling force $F_m$ is limited: if the load, the acceleration or a hard stop asks for more, the carriage **decouples** and the piston runs on alone, to be recoupled by driving it back. So the usable pressure is limited to about $F_m/A$, and so is the energy at the ends.
- **Cable and belt cylinders**, older designs, pull the carriage with a cable or belt round pulleys at the ends.

### Guided and compact cylinders
A **guided cylinder** puts two or four guide rods, running in plain bearings or ball bushings, beside the piston rod and joins them with a yoke plate. The guides take side loads and torques and stop the plate turning, so it can carry a gripper or a tool directly. **Slide units** do the same with a table on rail guides. **Compact** (short-stroke) cylinders, standardised from 20 to 100 mm bore by ISO 21287:2004, trade stroke for a very short body, for clamping, stopping and lifting. **Non-rotating** rods (hexagonal, oval, or with flats) are the cheap answer when only rotation must be prevented.

### Loads and moments
A guided carriage is rated for a largest force and largest moments about its three axes: roll $M_x$, pitch $M_y$ and yaw $M_z$. A mass $m$ offset by $r$ gives a static moment $m g r$; accelerating at $a$ with its centre of mass at a height $h$ above the guide, it adds a dynamic moment $m a h$. With several at once, the usual check is that the load factors add up to no more than one:

$$f = \\frac{F_z}{F_{z,\\text{max}}} + \\frac{M_x}{M_{x,\\text{max}}} + \\frac{M_y}{M_{y,\\text{max}}} \\le 1$$

Plain-bearing guides are robust and cheap; ball bushings run with less friction and more precision but dislike shocks.

> [!warn] A decoupled magnetic carriage, or a carriage whose band cylinder has been exhausted, can slide on its own — on a slope or a vertical axis it will fall. Support the carriage mechanically before exhausting and working on the drive.
`,
  ideas: [
    'Rodless cylinders move a carriage outside the barrel: installation length ≈ stroke plus a little, equal forces both ways.',
    'Band cylinders seal a slotted barrel with steel bands; magnetic ones couple through a closed barrel.',
    'A magnetic coupling decouples when overloaded: limit the pressure, acceleration and end-stop energy.',
    'Guided cylinders and slides carry side loads and torques that a bare piston rod must not.',
    'Check guides with load factors: F/F_max + M_x/M_x,max + M_y/M_y,max ≤ 1.'
  ],
  pitfalls: [
    'A piston rod can serve as a guide if the cylinder is big enough — The rod bearing is short and the seals wear under side load; use a guided cylinder, a slide or external guides.',
    'A magnetically coupled cylinder can be run at any pressure the barrel takes — Above F_m/A the piston can pull away from the carriage; hard accelerations and end impacts can decouple it even below that.',
    'A rodless cylinder needs no thought about moments because its carriage is guided — The guide has ratings too; a long overhanging load or a gripper high above the carriage can exceed them, especially while accelerating.'
  ],
  formulas: [
    {
      name: 'Magnetic coupling: highest usable pressure',
      expr: 'pmax = Fm/(pi*D^2/4)', tex: 'p_\\text{max} = \\dfrac{F_m}{\\pi D^2/4}',
      vars: {
        pmax: { name: 'highest usable pressure (gauge)', q: 'pressure', unit: 'bar', tex: 'p_\\text{max}' },
        Fm: { name: 'breakaway force of the magnetic coupling', q: 'force', unit: 'N', value: 350, tex: 'F_m' },
        D: { name: 'bore', q: 'length', unit: 'mm', value: 25 }
      },
      note: 'A static limit: accelerations and hard end stops need a margin below it.',
      practice: { unknowns: ['pmax', 'Fm'] },
      stories: { pmax: 'A magnetically coupled rodless cylinder of {D} bore has a coupling force of {Fm}. Above what pressure can the piston pull away from its carriage?' }
    },
    {
      name: 'Tilting moment from acceleration',
      expr: 'M = m*a*h', tex: 'M = m\\,a\\,h',
      vars: {
        M: { name: 'dynamic moment on the carriage', q: 'torque', unit: 'N·m' },
        m: { name: 'mass carried', q: 'mass', unit: 'kg', value: 4 },
        a: { name: 'acceleration', q: 'accel', unit: 'm/s²', value: 10 },
        h: { name: 'height of the centre of mass above the guide', q: 'length', unit: 'mm', value: 50 }
      },
      note: 'Pitch (or yaw, for a sideways offset). Add the static moments m·g·r of offset loads.',
      practice: { unknowns: ['M', 'a'] },
      stories: { M: 'A {m} gripper sits {h} above a slide that accelerates at {a}. What tilting moment does the acceleration put on the guide?' }
    },
    {
      name: 'Combined load factor of a guide',
      expr: 'f = Fz/Fzm + Mx/Mxm + My/Mym', tex: 'f = \\dfrac{F_z}{F_{z,\\text{max}}} + \\dfrac{M_x}{M_{x,\\text{max}}} + \\dfrac{M_y}{M_{y,\\text{max}}}',
      vars: {
        f: { name: 'load factor (must not exceed 1)' },
        Fz: { name: 'force across the guide', q: 'force', unit: 'N', value: 40, tex: 'F_z' },
        Fzm: { name: 'rated force across the guide', q: 'force', unit: 'N', value: 800, tex: 'F_{z,\\text{max}}' },
        Mx: { name: 'roll moment', q: 'torque', unit: 'N·m', value: 3.1, tex: 'M_x' },
        Mxm: { name: 'rated roll moment', q: 'torque', unit: 'N·m', value: 15, tex: 'M_{x,\\text{max}}' },
        My: { name: 'pitch moment', q: 'torque', unit: 'N·m', value: 2, tex: 'M_y' },
        Mym: { name: 'rated pitch moment', q: 'torque', unit: 'N·m', value: 20, tex: 'M_{y,\\text{max}}' }
      },
      note: 'The usual linear check of guide data sheets; add a yaw term M_z/M_z,max when there is one.',
      practice: { unknowns: ['f', 'Mx'] },
      stories: { f: 'A carriage rated for {Fzm}, {Mxm} roll and {Mym} pitch carries {Fz} with a roll moment of {Mx} and a pitch moment of {My}. What is its load factor?' }
    }
  ],
  examples: [
    {
      title: 'Room for a 1 m stroke',
      q: 'Compare the space needed by a standard cylinder and a rodless cylinder, both with a 1000 mm stroke, if the standard cylinder\'s body is about 150 mm longer than its stroke and the rodless carriage and end caps add about 300 mm.',
      steps: [
        'Standard cylinder: body 1150 mm, plus 1000 mm of rod out when extended: about 2.15 m.',
        'Rodless: $1000 + 300 = 1300$ mm, and the carriage stays within it.'
      ],
      a: 'About 2.15 m against 1.3 m: the rodless cylinder needs 60 % of the space.'
    },
    {
      title: 'A magnetic coupling',
      q: 'A 25 mm magnetically coupled rodless cylinder has a coupling force of 350 N. What force does the piston give at 6 bar, and what is the highest usable pressure?',
      steps: [
        'At 6 bar: $6\\times10^5 \\times 4.91\\times10^{-4} = 295$ N, below the 350 N coupling force.',
        '$p_\\text{max} = 350/4.91\\times10^{-4} = 7.13\\times10^5$ Pa = 7.1 bar.'
      ],
      a: '295 N at 6 bar; above about 7.1 bar the piston could pull away — and hard end stops need a margin even at 6 bar.'
    },
    {
      title: 'Checking a guided slide',
      q: 'A slide carries a 4 kg gripper whose centre of mass is 80 mm to the side of the guide axis and 50 mm above it; it accelerates at 10 m/s². The guide is rated for 800 N across, 15 N·m roll and 20 N·m pitch. Is it within its ratings?',
      steps: [
        'Force across: $4 \\times 9.81 = 39$ N.',
        'Roll from the offset weight: $39 \\times 0.08 = 3.1$ N·m.',
        'Pitch from the acceleration: $4 \\times 10 \\times 0.05 = 2$ N·m.',
        '$f = 39/800 + 3.1/15 + 2/20 = 0.05 + 0.21 + 0.10 = 0.36$.'
      ],
      a: 'Load factor 0.36: comfortably within the ratings, with the offset roll moment the largest part.'
    }
  ],
  quiz: [
    { q: 'Which rodless design has no leakage path from the barrel to the outside?', choices: ['Band (slot) cylinder', 'Magnetically coupled cylinder', 'Cable cylinder', 'None: all rodless cylinders leak'], a: 1,
      why: 'Its barrel is a closed tube: the force passes through the wall magnetically. Band cylinders seal their slot with a band, which leaks a little and wears.' },
    { q: 'A magnetically coupled rodless cylinder is overloaded. What happens?', choices: ['The barrel bursts', 'The carriage decouples and the piston runs on alone', 'The magnets are demagnetised at once', 'Nothing: the coupling is rigid'], a: 1,
      why: 'The magnetic force is limited. Above it, the piston pulls away; the carriage must then be recoupled by driving the piston back to it.' },
    { q: 'The piston rod of a large standard cylinder is a good guide for side loads.', a: false,
      why: 'The rod runs in one short bearing next to its seal. Side loads wear bearing and seal and bend the rod; guided cylinders or external guides carry them.' },
    { q: 'A 20 mm magnetically coupled cylinder has a coupling force of 250 N. Above what gauge pressure can the piston force exceed it?', answer: 7.96, unit: 'bar', tol: 0.02,
      why: '$A = 3.14$ cm²; $250/3.14\\times10^{-4} = 7.96\\times10^5$ Pa = 7.96 bar.' },
    { q: 'A 3 kg gripper sits 60 mm above a slide that accelerates at 15 m/s². What pitch moment does the acceleration cause?', answer: 2.7, unit: 'N·m', tol: 0.02,
      why: '$M = m a h = 3 \\times 15 \\times 0.06 = 2.7$ N·m.' }
  ],
  applications: [
    'Long transfer axes and gantries, where rodless cylinders save space.',
    'Clean-room and food machines with magnetically coupled cylinders.',
    'Guided cylinders lifting grippers and stopping parts on conveyors.',
    'Compact cylinders in clamping fixtures.'
  ],
  history: 'Rodless cylinders with a slotted barrel sealed by flexible bands spread in the 1970s and 1980s as factory automation needed long, space-saving axes; magnetically coupled versions followed as strong rare-earth magnets became affordable.'
},

{
  id: 'iso-15552', parent: 'cylinders-topic', title: 'Standard cylinders: ISO 15552 and ISO 6432', level: 1,
  short: 'International standards fix the dimensions where a cylinder meets the machine — bores, rods and rod threads, ports, the screw pattern for the mountings, the lengths — so that cylinders from different makers are interchangeable. ISO 15552:2018 covers 32–320 mm, ISO 6432:2015 the small round cylinders of 8–25 mm.',
  keywords: ['ISO 15552', 'ISO 6432', 'ISO 6431', 'VDMA 24562', 'ISO 21287', 'standard cylinder', 'interchangeability', 'mounting dimensions', 'rod thread', 'port thread', 'TG', 'mountings', 'clevis', 'trunnion', 'flange', 'foot', 'buckling', 'Euler', 'NFPA'],
  prereq: ['double-acting-cylinders', 'cylinder-force', 'physics:stress-strain'],
  related: ['pneumatic-cylinder', 'rodless-guided', 'pneumatic-cushioning', 'sensors-pneu', 'hydraulics:rod-buckling', 'hydraulics:mounting-side-load'],
  body: `
Before these standards, a cylinder that failed had to be replaced by one from the same maker, because each drilled its own mounting holes and cut its own rod threads. The international cylinder standards fix the **dimensions where the cylinder meets the machine**, so that one maker's cylinder bolts in where another's was.

### What the standards fix
**ISO 15552:2018** covers double-acting cylinders with detachable mountings from 32 to 320 mm bore for up to 10 bar; its first edition replaced ISO 6431 and the German VDMA 24562 in 2004. It fixes the bores, rod diameters and rod-end threads, the port threads, the square pattern of screw holes in each end cap (dimension TG) to which all mountings attach, the body length for zero stroke, and the mountings themselves — foot, flange, rear clevis, swivel and trunnion. Whether the barrel is an aluminium profile or a round tube with tie rods is the maker's choice.

| Bore (mm) | Rod (mm) | Rod thread | Port | Screw pattern TG |
|---|---|---|---|---|
| 32 | 12 | M10 × 1.25 | G 1/8 | 32.5 mm |
| 40 | 16 | M12 × 1.25 | G 1/4 | 38 mm |
| 50 | 20 | M16 × 1.5 | G 1/4 | 46.5 mm |
| 63 | 20 | M16 × 1.5 | G 3/8 | 56.5 mm |
| 80 | 25 | M20 × 1.5 | G 3/8 | 72 mm |
| 100 | 25 | M20 × 1.5 | G 1/2 | 89 mm |
| 125 | 32 | M27 × 2 | G 1/2 | 110 mm |

The series continues with 160, 200, 250 and 320 mm bores.

**ISO 6432:2015** does the same for small round cylinders of 8 to 25 mm bore, with rods of 4 mm (8 and 10 mm bores), 6 mm (12 and 16), 8 mm (20) and 10 mm (25), usually with a threaded nose and a rear eye. **ISO 21287:2004** covers compact cylinders from 20 to 100 mm. In North America inch-bore tie-rod cylinders follow NFPA dimensions instead, so metric and inch cylinders do not swap.

### What they leave open
Interchangeable means it fits, not that it behaves alike. Each maker still chooses the seals and their friction, the cushioning — its length, its adjustment and the energy it absorbs — the sensor slots, the materials, the temperature range and the life. Check these when changing makes, above all the cushioning if the old cylinder was working near its limit (see [[pneumatic-cushioning]]).

### Long strokes: buckling
A long, slender rod pushing a load can buckle long before its steel yields. Its Euler load

$$F_\\text{cr} = \\frac{\\pi^2 E}{(K L)^2}\\cdot\\frac{\\pi d^4}{64}$$

falls with the square of the free length $L$, and $K$ depends on the mounting: about 2 for a cylinder fixed at its base with a free, unguided rod end, 1 for one pinned at both ends, 0.7 or less when the load is guided. Keep the cylinder force below it with a margin of about three or more (see [[hydraulics:rod-buckling]]); makers' tables of permitted stroke for each mounting do the sum for you. Side loads on the rod make it worse — carry them on guides.

> [!tip] When a standard cylinder is replaced, keep the old mounting accessories and rod-end parts — they fit — but set the new cylinder's cushions afresh; the needles of two makes are not turned alike.
`,
  ideas: [
    'ISO 15552:2018 fixes the mounting dimensions of 32–320 mm cylinders so that makes are interchangeable.',
    'ISO 6432:2015 does the same for small round cylinders of 8–25 mm; ISO 21287 for compact cylinders.',
    'The rod thread, ports and the TG screw pattern are fixed; seals, cushioning and sensors are not.',
    'Long strokes can buckle the rod: F_cr = π²EI/(KL)², with a margin of about three.'
  ],
  pitfalls: [
    'Two ISO 15552 cylinders of the same bore behave the same — Only the dimensions where they meet the machine are fixed; cushioning capacity, friction and sensor slots differ between makes.',
    'A rod that is strong enough in tension is strong enough pushing — A long rod in compression buckles at the Euler load, which falls with the square of its free length, long before the steel yields.'
  ],
  formulas: [
    {
      name: 'Euler buckling load of a piston rod',
      expr: 'F = pi^3*E*d^4/(64*(K*L)^2)', tex: 'F_\\text{cr} = \\dfrac{\\pi^2 E}{(K L)^2}\\cdot\\dfrac{\\pi d^4}{64}',
      vars: {
        F: { name: 'critical buckling load', q: 'force', unit: 'kN', tex: 'F_\\text{cr}' },
        E: { name: 'Young\'s modulus of the rod (steel ≈ 210 GPa)', q: 'stress', unit: 'GPa', value: 210 },
        d: { name: 'rod diameter', q: 'length', unit: 'mm', value: 20 },
        K: { name: 'effective-length factor (2 free end, 1 pinned both ends, 0.7 guided)', value: 2, min: 0.5, max: 4 },
        L: { name: 'free length from mounting to load', q: 'length', unit: 'mm', value: 1000 }
      },
      note: 'Keep the cylinder force below F_cr with a safety factor of about 3 or more. Slender rods only; side loads lower the limit.',
      practice: { unknowns: ['F', 'L', 'd'] },
      stories: { F: 'A cylinder\'s {d} steel rod (E = {E}) has a free length of {L} and an effective-length factor of {K}. At what load does it buckle?', L: 'A {d} steel rod (E = {E}, factor {K}) must carry {F} before buckling. How long may its free length be?' }
    }
  ],
  examples: [
    {
      title: 'A long stroke on a flange',
      q: 'A 50 mm cylinder (20 mm rod) with an 800 mm stroke is flange-mounted and pushes a load that is not guided (K ≈ 2); the free length is about 1.0 m. At 6 bar is it safe against buckling? What if the load were guided (K ≈ 0.7)?',
      steps: [
        '$F_\\text{cr} = \\pi^3 \\times 210\\times10^9 \\times 0.02^4/(64 \\times (2 \\times 1)^2) = 4.07$ kN.',
        'Cylinder force: 1.18 kN; safety factor $4.07/1.18 = 3.5$ — acceptable, but not for a longer stroke.',
        'Guided, $K = 0.7$: $F_\\text{cr} = 4.07 \\times (2/0.7)^2 = 33$ kN, a factor of 28.'
      ],
      a: 'About 4.1 kN, a factor of 3.5 over the 1.18 kN push; guiding the load raises it to 33 kN.'
    },
    {
      title: 'Swapping makes',
      q: 'A 63 mm ISO 15552 cylinder from one maker is replaced by one from another. What carries over, and what must be checked?',
      steps: [
        'Carries over: the mountings (TG pattern 56.5 mm), the rod-end parts (thread M16 × 1.5), the fittings (G 3/8 ports) and the body length for the same stroke.',
        'Check: the cushioning energy the new cylinder is rated for, the type of sensor slot and the sensors, the seals (temperature, lubrication, friction) and the maximum pressure.'
      ],
      a: 'The mechanical interface carries over; performance items — cushioning, sensors, seals — must be checked.'
    }
  ],
  quiz: [
    { q: 'Which standard covers a small round cylinder of 20 mm bore with a threaded nose?', choices: ['ISO 15552', 'ISO 6432', 'ISO 21287', 'ISO 1219'], a: 1,
      why: 'ISO 6432 covers round cylinders of 8–25 mm; ISO 15552 starts at 32 mm; ISO 21287 is for compact cylinders; ISO 1219 is the symbol standard.' },
    { q: 'ISO 15552 fixes…', choices: ['the energy the cushions absorb', 'the mounting dimensions, rod-end thread and ports', 'the seal material and friction', 'the highest permitted speed'], a: 1,
      why: 'It fixes where the cylinder meets the machine. Performance — cushioning, friction, speed — is left to each maker.' },
    { q: 'Two ISO 15552 cylinders of the same bore and stroke from different makers can be swapped without checking anything.', a: false,
      why: 'They fit, but cushioning capacity, sensor slots, seals and friction differ.' },
    { q: 'What is the Euler buckling load of a 16 mm steel rod (E = 210 GPa) with a free length of 600 mm, fixed at the base and free at the end (K = 2)?', answer: 4.63, unit: 'kN', tol: 0.03,
      why: '$F_\\text{cr} = \\pi^3 \\times 210\\times10^9 \\times 0.016^4/(64 \\times 1.2^2) = 4.63$ kN.' },
    { q: 'Guiding the load so that K falls from 2 to 1 raises the buckling load…', choices: ['by half', 'twice', 'four times', 'not at all'], a: 2,
      why: 'The buckling load goes with $1/(KL)^2$: halving $K$ multiplies it by four.' }
  ],
  applications: [
    'Replacing cylinders across makes without changing the machine.',
    'Designing machines around standard mountings and rod ends.',
    'Checking long-stroke cylinders against buckling.'
  ],
  history: 'Pneumatic cylinder dimensions were first standardised internationally in ISO 6431 in 1981, alongside national rules such as VDMA 24562 in Germany; ISO 15552 merged them in 2004 and was revised in 2018. ISO 6432 has fixed the small round cylinders since the 1980s; its current edition dates from 2015.'
},

/* ================================================================ OTHER ACTUATORS */

{
  id: 'rotary-actuators-pneu', parent: 'other-actuators', title: 'Rotary actuators', level: 2,
  short: 'Actuators that swing through a limited angle — 90°, 180°, up to 360° — by rack and pinion, vane or scotch yoke. Their torque is pressure × effective area × radius; what usually limits them is the kinetic energy of the swinging load at the end stop.',
  keywords: ['rotary actuator', 'swivel unit', 'rack and pinion', 'vane actuator', 'double vane', 'scotch yoke', 'quarter turn', 'process valve actuator', 'spring return', 'torque', 'moment of inertia', 'kinetic energy', 'swing time', 'end stop'],
  prereq: ['pneumatic-cylinder', 'physics:torque', 'physics:rotational-kinetic-energy'],
  related: ['pneumatic-cushioning', 'air-motors', 'grippers', 'pick-and-place', 'kinetic-energy-limits', 'hydraulics:rotary-actuators', 'physics:moment-of-inertia'],
  body: `
Many machines need a swing rather than a push: turn a part over, swing a gripper from one station to the next, open a quarter-turn valve. A rotary actuator turns air pressure into a limited rotation — typically 90°, 180° or up to 360° — with adjustable end positions.

### Rack and pinion
One or two pistons drive a toothed rack that turns a pinion. The torque is the piston force times the pinion's pitch radius:
$$T = n\\,p_g\\,\\frac{\\pi D^2}{4}\\,r$$
with $n$ = 1 for a single piston and 2 for twin pistons acting on opposite sides of the pinion. The torque is constant over the whole swing, the angle can be anything the rack allows, the end positions are set by stops at the pistons, and cushions or shock absorbers can be fitted. On process valves, double-rack actuators — with springs that close the valve when the air fails — are the standard.

### Vane
A vane fixed to the shaft swings in a sector-shaped chamber, pushed round by the air on one side. A single vane swings up to about 270°; a double vane (two vanes, twice the torque) up to about 90°. The pressure on the vane's area acts at the arm to its centre:
$$T = p_g\\,b\\,\\frac{R^2 - r^2}{2}$$
for a vane of width $b$ from the hub radius $r$ to the outer radius $R$. Vane units are compact and simple, but their long seal lines leak a little and their small internal stops take little energy.

### Other designs
**Scotch-yoke** actuators turn a piston's push into rotation through a slotted lever. Their torque is highest at the two ends of the swing and lowest in the middle — a good match for valves, which need the most torque to break away from their seats. **Helical** (screw-driven) units give a smooth rotation in a slim body.

### The real limit: energy at the stop
A rotary actuator nearly always has more torque than it needs; what breaks it is the **energy** of the swinging load at the end stop. Accelerated evenly through an angle $\\theta$ in a time $t$, a load of moment of inertia $J$ arrives at $\\omega = 2\\theta/t$, carrying

$$E = \\tfrac12 J\\omega^2 = \\frac{2J\\theta^2}{t^2}$$

Energy grows with the square of the speed: halve the swing time and the energy quadruples. A long arm with a gripper at its end is the classic trap — most of the inertia sits at its tip, $J \\approx m L^2$. Small vane units tolerate thousandths to hundredths of a joule, cushioned rack-and-pinion units tenths, and units with shock absorbers several joules.

| Design | Typical angle | Torque at 6 bar, roughly | Energy at the stop |
|---|---|---|---|
| Single vane | up to 270° | 0.1–20 N·m | small |
| Twin-piston rack and pinion | 90–360° | 1–100 N·m | moderate; more with shock absorbers |
| Scotch yoke, process valves | 90° | 10 N·m to over 10 kN·m | valves swing slowly |

> [!warn] A rotary actuator swings its load through a whole arc and can trap fingers between the arm and the frame or fling a badly held part. Guard the swept arc, exhaust and lock out before reaching in, and remember that a spring-return valve actuator moves by itself when its air is released.
`,
  ideas: [
    'Rack and pinion: T = n·p·A·r, constant over the swing; vane: T = p·b(R² − r²)/2.',
    'Double-rack actuators with spring return are the standard drive for quarter-turn process valves.',
    'Scotch yokes give most torque at the ends of the swing, where valves need it.',
    'The usual limit is kinetic energy at the stop: E = ½Jω² with ω ≈ 2θ/t.',
    'Halving the swing time quadruples the energy; mass at the tip of an arm counts with L².'
  ],
  pitfalls: [
    'Rotary actuators fail for lack of torque — Most have torque to spare; they fail when the swinging load arrives at the stop with more energy than the stop can take.',
    'A small mass at the end of an arm is a small load — Its moment of inertia grows with the square of the arm length; at 250 mm a 0.4 kg gripper already has J = 0.025 kg·m².',
    'Swinging faster only costs a little more energy — The energy grows with the square of the angular speed; halving the time multiplies it by four.'
  ],
  formulas: [
    {
      name: 'Torque of a rack-and-pinion actuator',
      expr: 'T = n*p*pi*D^2/4*r', tex: 'T = n\\,p_g\\,\\dfrac{\\pi D^2}{4}\\,r',
      vars: {
        T: { name: 'output torque', q: 'torque', unit: 'N·m' },
        n: { name: 'pistons driving the pinion (1 or 2)', int: true, value: 2, min: 1, max: 4 },
        p: { name: 'supply pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        D: { name: 'piston bore', q: 'length', unit: 'mm', value: 32 },
        r: { name: 'pitch radius of the pinion', q: 'length', unit: 'mm', value: 12 }
      },
      note: 'Theoretical; friction takes 5–15 %. Spring-return versions lose the spring force on the air stroke and deliver only the spring torque on the return.',
      practice: { unknowns: ['T', 'D', 'p'] },
      stories: { T: 'A rack-and-pinion actuator has {n} pistons of {D} bore driving a pinion of {r} pitch radius. What torque does it give at {p}?', D: 'An actuator with {n} pistons on a pinion of {r} pitch radius must give {T} at {p}. What piston bore is needed?' }
    },
    {
      name: 'Torque of a single-vane actuator',
      expr: 'T = p*b*(R^2 - r^2)/2', tex: 'T = p_g\\,b\\,\\dfrac{R^2 - r^2}{2}',
      vars: {
        T: { name: 'output torque', q: 'torque', unit: 'N·m' },
        p: { name: 'supply pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        b: { name: 'vane width (along the shaft)', q: 'length', unit: 'mm', value: 20 },
        R: { name: 'outer radius of the vane', q: 'length', unit: 'mm', value: 25 },
        r: { name: 'hub radius', q: 'length', unit: 'mm', value: 8 }
      },
      note: 'A double vane gives twice the torque over a smaller angle. Seal friction and leakage lower the real torque.',
      practice: { unknowns: ['T', 'b'] },
      stories: { T: 'A vane {b} wide spans from a hub of {r} radius to {R}. What torque does it give at {p}?' }
    },
    {
      name: 'Kinetic energy of a swinging load',
      expr: 'E = 2*J*theta^2/t^2', tex: 'E = \\tfrac12 J\\omega^2 = \\dfrac{2J\\theta^2}{t^2}',
      vars: {
        E: { name: 'kinetic energy at the end stop', q: 'energy', unit: 'J' },
        J: { name: 'moment of inertia of the swinging load', q: 'inertia', unit: 'kg·m²', value: 0.002 },
        theta: { name: 'swing angle', q: 'angle', unit: '°', value: 180, min: 1, max: 360, tex: '\\theta' },
        t: { name: 'swing time', q: 'time', unit: 's', value: 0.5 }
      },
      note: 'Assumes an even acceleration, so the final angular speed is ω = 2θ/t. Compare with the maker\'s allowed energy.',
      practice: { unknowns: ['E', 't'] },
      stories: { E: 'A load with a moment of inertia of {J} swings through {theta} in {t}. What energy must the end stop absorb?', t: 'A rotary actuator may absorb {E} at its stop. How long must a swing of {theta} take for a load of {J}?' }
    }
  ],
  examples: [
    {
      title: 'An actuator for a process valve',
      q: 'A quarter-turn ball valve needs 20 N·m to break away. With a safety factor of 1.3, at a worst-case supply of 5.5 bar gauge, what piston bore does a twin-piston rack-and-pinion actuator need if its pinion has a 15 mm pitch radius?',
      steps: [
        'Torque to provide: $1.3 \\times 20 = 26$ N·m.',
        'Area per piston: $A = T/(2 p r) = 26/(2 \\times 5.5\\times10^5 \\times 0.015) = 1.58\\times10^{-3}$ m², so $D = 44.8$ mm.',
        'The next bore is 50 mm: $T = 2 \\times 5.5\\times10^5 \\times 19.6\\times10^{-4} \\times 0.015 = 32$ N·m.'
      ],
      a: 'A 50 mm bore, giving about 32 N·m at 5.5 bar.'
    },
    {
      title: 'The arm with a gripper',
      q: 'A 0.25 m aluminium arm of 0.6 kg carries a 0.4 kg gripper at its tip and swings through 180° in 0.6 s. What energy reaches the end stop, and how slowly would it have to swing to stay below 0.1 J?',
      steps: [
        'Moment of inertia: arm $m L^2/3 = 0.6 \\times 0.25^2/3 = 0.0125$ kg·m²; gripper $0.4 \\times 0.25^2 = 0.025$ kg·m²; $J = 0.0375$ kg·m².',
        '$\\omega = 2\\theta/t = 2\\pi/0.6 = 10.5$ rad/s; $E = \\tfrac12 \\times 0.0375 \\times 10.5^2 = 2.06$ J.',
        'For 0.1 J the time must grow by $\\sqrt{2.06/0.1} = 4.5$: about 2.7 s.'
      ],
      a: 'About 2.1 J — twenty times a small actuator\'s limit. Swing in 2.7 s, or choose a unit with shock absorbers.'
    },
    {
      title: 'A vane actuator\'s torque',
      q: 'A vane 20 mm wide spans from an 8 mm hub to a 25 mm outer radius. What torque does it give at 6 bar gauge, single and double vane?',
      steps: [
        '$T = 6\\times10^5 \\times 0.02 \\times (0.025^2 - 0.008^2)/2 = 6\\times10^5 \\times 0.02 \\times 2.81\\times10^{-4} = 3.37$ N·m.',
        'A double vane gives twice that, 6.7 N·m, over at most about 90°.'
      ],
      a: '3.4 N·m single, 6.7 N·m double.'
    }
  ],
  quiz: [
    { q: 'A twin-piston rack-and-pinion actuator has 25 mm pistons and a pinion of 10 mm pitch radius. What torque does it give at 6 bar gauge?', answer: 5.89, unit: 'N·m', tol: 0.02,
      why: '$T = 2 \\times 6\\times10^5 \\times 4.91\\times10^{-4} \\times 0.01 = 5.89$ N·m.' },
    { q: 'Halving the swing time of a rotary actuator (same load, same angle) makes the energy at the stop…', choices: ['half', 'double', 'four times as large', 'unchanged'], a: 2,
      why: '$\\omega = 2\\theta/t$ doubles, and $E = \\tfrac12 J\\omega^2$ grows with its square.' },
    { q: 'A quarter-turn process valve must close when the air fails. Which drive suits it?', choices: ['A single-vane actuator', 'A spring-return rack-and-pinion or scotch-yoke actuator', 'An air motor', 'A double-acting actuator with a 5/3 closed-centre valve'], a: 1,
      why: 'The spring stores the energy to close the valve without air. A trapped-air arrangement leaks away; a vane unit has no spring.' },
    { q: 'Most rotary actuators that fail in service have failed for lack of torque.', a: false,
      why: 'Torque is rarely the problem. Overloaded end stops — too much kinetic energy — crack housings, shear keys and wear racks.' },
    { q: 'A gripper on an arm is moved from 125 mm to 250 mm from the axis. Its contribution to the moment of inertia becomes…', choices: ['twice as large', 'four times as large', 'eight times as large', 'unchanged'], a: 1,
      why: 'A point mass contributes $m r^2$: twice the radius, four times the inertia — and four times the energy at the same swing time.' }
  ],
  problems: [
    { q: 'A disc with a moment of inertia of 0.004 kg·m² swings through 90° in 0.3 s. What kinetic energy reaches the end stop?', answer: 0.219, unit: 'J', tol: 0.02,
      steps: ['$\\theta = \\pi/2$ rad; $\\omega = 2\\theta/t = \\pi/0.3 = 10.5$ rad/s.', '$E = \\tfrac12 \\times 0.004 \\times 10.5^2 = 0.219$ J.'] }
  ],
  applications: [
    'Turning parts over between assembly stations.',
    'Swinging grippers in pick-and-place units.',
    'Opening and closing ball and butterfly valves in process plants.',
    'Diverter flaps and gates on conveyors.'
  ]
},

{
  id: 'grippers', parent: 'other-actuators', title: 'Grippers', level: 2,
  short: 'Pneumatic grippers close jaws on a part — parallel, angular, three-jaw or toggle-lever. Held by friction, a part needs a gripping force of S·m(g + a)/μ, often twenty to forty times its weight; a form-fit grip needs far less.',
  keywords: ['gripper', 'parallel gripper', 'angular gripper', 'three-jaw gripper', 'toggle lever', 'gripping force', 'friction grip', 'form fit', 'safety factor', 'friction coefficient', 'jaw', 'finger length', 'gripping point', 'grip retention', 'pick and place'],
  prereq: ['cylinder-force', 'physics:friction', 'physics:newtons-second-law'],
  related: ['pick-and-place', 'suction-cups', 'holding-force', 'rodless-guided', 'rotary-actuators-pneu', 'soft-robotics', 'check-valves-pneu', 'emergency-stop-pneu'],
  body: `
A pneumatic gripper is a small cylinder that closes jaws on a part — the hand of most pick-and-place units and robots. Sizing one is a lesson in friction.

### Kinds
- **Parallel grippers** move their jaws in straight lines towards each other through a wedge, a lever or a rack; the jaw faces stay parallel, so the grip does not depend on the part's size.
- **Angular grippers** swing their jaws about pivots, about 20–30° each (up to 180° for radial types that swing clear of the part). Simple and cheap, but the force falls with the finger length, $F = T/L$.
- **Three-jaw** (centric) grippers centre round parts; **toggle-lever** grippers lock mechanically at the end of their stroke and give very high forces.
- Suction cups, magnetic and needle grippers do the same job for sheets, cartons and textiles (see [[suction-cups]]).

### Friction grip or form fit
Most parts are held by **friction**: the jaws squeeze, and friction between jaws and part carries the weight and the inertial forces. The friction available is $\\mu F_G$, where $F_G$ is the total gripping force (the sum of the jaw forces) and $\\mu$ the friction coefficient — about 0.1–0.2 for steel on steel, 0.5 or more with rubber-faced jaws. For a part lifted vertically at an acceleration $a$:

$$F_G = \\frac{S\\,m\\,(g + a)}{\\mu}$$

with a safety factor $S$ of 2 or more. With smooth steel jaws ($\\mu$ = 0.1) and $S$ = 2, a part lifted gently needs 20 times its own weight in gripping force, and 40 times when it is accelerated at 1 g — the reason friction grippers are bigger than people expect. When the part moves sideways, the friction must carry $m\\sqrt{g^2 + a^2}$ instead; rotations and emergency stops can add more.

A **form-fit** grip shapes the jaws around the part — a step under it, a V round it — so the jaws carry the weight directly and the gripping force only has to keep them closed. It needs a fraction of the force and does not depend on friction, at the price of jaws made for each part.

### From force to gripper
The piston supplies the force: $F_G = i\\,\\eta\\,p_g A$, with the mechanism's force ratio $i$ (wedges and levers give 1–3) and an efficiency $\\eta$ of about 0.8–0.9. Makers' curves show how the force falls as the gripping point moves out along longer fingers, and how long and heavy the fingers may be — heavy, long fingers wear the jaw guides.

| Parallel-gripper piston | Total gripping force at 6 bar (i = 1, η = 0.85) |
|---|---|
| 10 mm | 40 N |
| 16 mm | 103 N |
| 25 mm | 250 N |
| 40 mm | 641 N |
| 63 mm | 1.59 kN |

> [!warn] A friction grip holds only while there is pressure. On a loss of air, or an emergency stop that exhausts the valves, a gripper can drop its part. Where a falling part could hurt someone, use grippers with a spring that keeps the grip, pilot-operated check valves that trap the air, or a form-fit grip — and never reach under a gripped load.
`,
  ideas: [
    'A friction grip needs F_G = S·m(g + a)/μ: 20–40 times the part\'s weight with smooth steel jaws.',
    'Rubber jaw pads (μ ≈ 0.5) or a form-fit grip cut the force needed several times.',
    'Gripping force comes from the piston: F_G = i·η·p·A; it falls with longer fingers.',
    'Parallel jaws suit varying part sizes; angular jaws are simple but lose force with finger length.',
    'Plan for air failure: spring-assisted grippers, check valves or a form-fit grip keep the part.'
  ],
  pitfalls: [
    'A gripper needs only a little more force than the part weighs — With friction coefficients of 0.1–0.2 and a safety factor, the gripping force must be tens of times the weight.',
    'The force in the data sheet applies at any finger length — It is given at a stated gripping-point distance; longer fingers lower it, and heavy fingers wear the guides.',
    'A closed gripper keeps its part if the air fails — Without pressure most grippers open or lose their force; grip retention needs a spring or trapped air by design.'
  ],
  formulas: [
    {
      name: 'Gripping force needed for a friction grip',
      expr: 'FG = S*m*(g + a)/mu', tex: 'F_G = \\dfrac{S\\,m\\,(g + a)}{\\mu}',
      vars: {
        FG: { name: 'total gripping force (sum of the jaw forces)', q: 'force', unit: 'N', tex: 'F_G' },
        S: { name: 'safety factor', value: 2, min: 1, max: 10 },
        m: { name: 'mass of the part', q: 'mass', unit: 'kg', value: 0.5 },
        g: { const: 'g' },
        a: { name: 'acceleration of the lift', q: 'accel', unit: 'm/s²', value: 10 },
        mu: { name: 'friction coefficient between jaws and part', value: 0.1, min: 0.01, max: 2, tex: '\\mu' }
      },
      note: 'Vertical lifting with the jaws gripping from the sides. For sideways motion replace g + a with √(g² + a²); a form-fit grip needs much less.',
      practice: { unknowns: ['FG', 'm', 'mu'] },
      stories: { FG: 'A gripper lifts a {m} part at {a}. The friction coefficient is {mu} and the safety factor {S}. What total gripping force is needed?', m: 'A gripper with a total force of {FG} lifts parts at {a} (friction coefficient {mu}, safety factor {S}). What is the heaviest part it may carry?' }
    },
    {
      name: 'Gripping force of a pneumatic gripper',
      expr: 'FG = i*eta*p*pi*D^2/4', tex: 'F_G = i\\,\\eta\\,p_g\\,\\dfrac{\\pi D^2}{4}',
      vars: {
        FG: { name: 'total gripping force', q: 'force', unit: 'N', tex: 'F_G' },
        i: { name: 'force ratio of the jaw mechanism', value: 1, min: 0.2, max: 5 },
        eta: { name: 'efficiency of the mechanism', q: 'ratio', unit: '%', value: 85, min: 30, max: 100, tex: '\\eta' },
        p: { name: 'supply pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        D: { name: 'piston bore of the gripper', q: 'length', unit: 'mm', value: 25 }
      },
      note: 'At the gripping-point distance of the data sheet; longer fingers give less. Closing and opening forces differ by the rod area.',
      practice: { unknowns: ['FG', 'D'] },
      stories: { FG: 'A gripper with a {D} piston and a mechanism of ratio {i} and efficiency {eta} works at {p}. What total gripping force does it give?', D: 'A gripper must give {FG} at {p} through a mechanism of ratio {i} and efficiency {eta}. What piston bore does it need?' }
    },
    {
      name: 'Angular gripper: force at the gripping point',
      expr: 'F = T/L', tex: 'F = \\dfrac{T}{L}',
      vars: {
        F: { name: 'gripping force of one jaw', q: 'force', unit: 'N' },
        T: { name: 'torque at the jaw pivot', q: 'torque', unit: 'N·m', value: 0.6 },
        L: { name: 'distance from the pivot to the gripping point', q: 'length', unit: 'mm', value: 40 }
      },
      note: 'Longer fingers give proportionally less force.',
      practice: { unknowns: ['F', 'L'] },
      stories: { F: 'An angular gripper\'s jaw has a torque of {T} at its pivot and grips {L} from it. With what force does it press?' }
    }
  ],
  examples: [
    {
      title: 'A steel part lifted quickly',
      q: 'A 0.5 kg steel part is lifted at 10 m/s² between smooth steel jaws (μ = 0.1) with a safety factor of 2. What total gripping force is needed, and which parallel-gripper bore gives it at 6 bar gauge (i = 1, η = 0.85)?',
      steps: [
        '$F_G = 2 \\times 0.5 \\times (9.81 + 10)/0.1 = 198$ N — 40 times the part\'s weight of 4.9 N.',
        '$D = \\sqrt{4 \\times 198/(0.85 \\times 6\\times10^5 \\times \\pi)} = 22.2$ mm.',
        'The next bore, 25 mm, gives $0.85 \\times 6\\times10^5 \\times 4.91\\times10^{-4} = 250$ N.'
      ],
      a: 'About 200 N; a 25 mm gripper (250 N).'
    },
    {
      title: 'Rubber jaw pads',
      q: 'The same part is gripped with rubber-faced jaws (μ = 0.5). What force and bore now?',
      steps: [
        '$F_G = 2 \\times 0.5 \\times 19.81/0.5 = 39.6$ N.',
        'A 10 mm gripper gives $0.85 \\times 6\\times10^5 \\times 7.85\\times10^{-5} = 40$ N — just enough; a 12 mm one (58 N) leaves a margin for pressure sags.'
      ],
      a: 'About 40 N: a 10–12 mm gripper instead of 25 mm, because the friction is five times better.'
    },
    {
      title: 'Longer fingers on an angular gripper',
      q: 'An angular gripper\'s jaws have 0.6 N·m at their pivots. What force does each jaw give at 40 mm and at 80 mm from the pivot?',
      steps: ['At 40 mm: $0.6/0.04 = 15$ N.', 'At 80 mm: $0.6/0.08 = 7.5$ N.'],
      a: '15 N and 7.5 N per jaw: doubling the finger length halves the force.'
    }
  ],
  quiz: [
    { q: 'A 2 kg part is lifted at 5 m/s² with a friction grip (μ = 0.15, safety factor 2). What total gripping force is needed?', answer: 395, unit: 'N', tol: 0.02,
      why: '$F_G = 2 \\times 2 \\times (9.81 + 5)/0.15 = 395$ N.' },
    { q: 'A form-fit grip depends on the friction between jaws and part.', a: false,
      why: 'The jaws are shaped to hold the part by its shape — a step or a V — so the weight bears on the jaws directly and the gripping force only keeps them closed.' },
    { q: 'Changing from smooth steel jaws (μ = 0.1) to rubber pads (μ = 0.5) changes the gripping force needed to…', choices: ['a fifth', 'half', 'five times as much', 'no change'], a: 0,
      why: 'The force needed is inversely proportional to μ.' },
    { q: 'An angular gripper is given fingers twice as long. Its gripping force…', choices: ['stays the same', 'halves', 'doubles', 'falls to a quarter'], a: 1,
      why: 'The jaw torque is fixed; the force at the gripping point is $T/L$.' },
    { q: 'What keeps a gripped part from falling when an emergency stop exhausts the air?', choices: ['Nothing can', 'A spring-assisted gripper, check valves trapping the air, or a form-fit grip', 'A larger gripper', 'A higher supply pressure'], a: 1,
      why: 'Without pressure, a plain gripper loses its force. A spring keeps the grip, pilot-operated check valves trap the air for a while, and a form fit holds the part by its shape.' }
  ],
  problems: [
    { q: 'A 1.2 kg part is carried sideways at 8 m/s² by a gripper holding it from the sides (μ = 0.2, safety factor 2). What total gripping force is needed?', answer: 152, unit: 'N', tol: 0.02,
      hint: 'Sideways, the friction carries m√(g² + a²).',
      steps: ['$\\sqrt{9.81^2 + 8^2} = 12.66$ m/s².', '$F_G = 2 \\times 1.2 \\times 12.66/0.2 = 152$ N.'] }
  ],
  applications: [
    'Pick-and-place units and robot end effectors in assembly.',
    'Loading machine tools with round parts, using three-jaw grippers.',
    'Toggle-lever grippers for welding fixtures and body shops.'
  ],
  sim: 'act-gripper'
},

{
  id: 'air-motors', parent: 'other-actuators', title: 'Air motors', level: 2,
  short: 'Motors that turn compressed air into continuous rotation — vane, piston, turbine and gear types. Their torque falls in a straight line from stall to free speed, so their power peaks at half the free speed; they stall without harm, but use air equal to many times their shaft power in compressor electricity.',
  keywords: ['air motor', 'pneumatic motor', 'vane motor', 'piston motor', 'radial piston', 'turbine', 'free speed', 'stall torque', 'torque curve', 'power curve', 'half free speed', 'air tools', 'throttling', 'pressure regulation', 'explosion-proof', 'efficiency'],
  prereq: ['physics:power', 'physics:torque', 'air-consumption'],
  related: ['air-tools', 'pneumatic-vs-electric', 'cost-of-compressed-air', 'noise-silencers', 'rotary-actuators-pneu', 'hydraulics:hydraulic-motors', 'hydraulics:motor-torque-speed', 'physics:efficiency'],
  body: `
An air motor turns compressed air into continuous rotation. It drives air tools — drills, grinders, nutrunners, hoists — and mixers, winches, pumps and engine starters, especially where an electric motor would be a risk or a nuisance.

### Kinds
- **Vane motors**, the most common: a slotted rotor turns off-centre in its housing, and air pushing on the vanes that slide in its slots turns it. Light and simple, from a few hundred watts to about 20 kW, with free speeds of a few thousand to over 20 000 rpm — often with a planetary gearbox for torque.
- **Piston motors**, radial or axial, turn a crankshaft or a swash plate with several pistons: high starting torque and smooth running at low speed, up to about 20–30 kW, for winches and hoists.
- **Turbines** spin very fast with little torque; a dental drill runs at 300 000–400 000 rpm.
- **Gear motors** are robust machines for large powers in mines and on ships.

### Torque, speed and power
At a steady supply pressure an air motor's torque falls roughly in a straight line from its stall torque $T_s$ at standstill to zero at its free speed $n_0$:
$$T = T_s\\left(1 - \\frac{n}{n_0}\\right)$$
The power $P = 2\\pi n T$ is then a parabola with its peak at **half the free speed**:
$$P_\\text{max} = \\frac{\\pi n_0 T_s}{2}$$
The motor settles where its torque line meets the load's: more load slows it down and raises its torque until the two balance. If the load exceeds the stall torque it simply **stalls**, holding that torque without damage or overheating, and starts again when the load falls. It can be reversed and started as often as you like, and runs in heat, wet, dust and explosive atmospheres.

| Air motor at 6 bar | Free speed | Stall torque | Peak power (at n₀/2) |
|---|---|---|---|
| Small vane | 20 000 rpm | 0.6 N·m | 0.3 kW |
| Vane, 1 kW | 6 000 rpm | 6.4 N·m | 1.0 kW |
| Vane with 10:1 gearbox | 600 rpm | about 58 N·m | 0.9 kW |
| Radial piston | 1 500 rpm | 50 N·m | 2.0 kW |

### Controlling it
**Throttling** the supply lowers the free speed but keeps the stall torque: the motor slows at light load yet still starts heavy loads. **Lowering the pressure** with a regulator lowers the torque at every speed, roughly in proportion, and the power falls faster still. The exhaust should be silenced and piped away: it is loud, and the expanding air cools so much that its moisture can freeze.

### The catch: efficiency
An air motor uses roughly 1–1.5 m³/min of free air (17–25 L/s) for each kilowatt at its shaft, and a compressor needs 6–7 kW of electricity for each m³/min. A kilowatt at the shaft therefore costs 7–10 kW at the compressor — an overall efficiency of 10–15 %, against 85–95 % for an electric motor. Air motors earn their place where lightness, ruggedness and safety matter more than the energy bill (see [[pneumatic-vs-electric]]).

> [!warn] A stalled air motor still holds its full torque, and a tool that jams can kick back hard. Shut off and exhaust the air before changing a bit or clearing a jam, and wear hearing protection near unsilenced exhausts.
`,
  ideas: [
    'Torque falls linearly from the stall torque to zero at the free speed: T = T_s(1 − n/n₀).',
    'Power P = 2πnT peaks at half the free speed: P_max = πn₀T_s/2.',
    'An air motor stalls without harm and restarts by itself; it can be reversed and run in hostile places.',
    'Throttling lowers the speed but keeps the stall torque; lowering the pressure lowers the torque.',
    'Overall efficiency from the compressor\'s electricity is only about 10–15 %.'
  ],
  pitfalls: [
    'An air motor gives most power at its free speed — At free speed the torque is zero; the power peaks at half the free speed.',
    'Stalling an air motor damages it, as it would an electric motor — It simply holds its stall torque; nothing overheats, and it restarts when the load falls.',
    'Air motors are cheap to run because air is free — Each shaft kilowatt costs 7–10 kW of compressor electricity.'
  ],
  formulas: [
    {
      name: 'Torque against speed',
      expr: 'T = Ts*(1 - n/n0)', tex: 'T = T_s\\left(1 - \\dfrac{n}{n_0}\\right)',
      vars: {
        T: { name: 'torque at speed n', q: 'torque', unit: 'N·m' },
        Ts: { name: 'stall torque', q: 'torque', unit: 'N·m', value: 6.4, tex: 'T_s' },
        n: { name: 'speed', q: 'frequency', unit: 'rpm', value: 3000 },
        n0: { name: 'free speed', q: 'frequency', unit: 'rpm', value: 6000, tex: 'n_0' }
      },
      note: 'At a steady supply pressure; the starting torque of vane motors is a little below the stall torque.',
      practice: { unknowns: ['T', 'n'] },
      stories: { T: 'An air motor with a stall torque of {Ts} and a free speed of {n0} runs at {n}. What torque does it give?', n: 'An air motor ({Ts} stall torque, {n0} free speed) drives a load needing {T}. At what speed does it run?' }
    },
    {
      name: 'Shaft power',
      expr: 'P = 2*pi*n*T', tex: 'P = 2\\pi n T',
      vars: {
        P: { name: 'shaft power', q: 'power', unit: 'kW' },
        n: { name: 'speed', q: 'frequency', unit: 'rpm', value: 3000 },
        T: { name: 'torque', q: 'torque', unit: 'N·m', value: 3.2 }
      },
      note: 'n in revolutions per unit time; the calculator converts rpm.',
      practice: { unknowns: ['P', 'T'] },
      stories: { P: 'An air motor gives {T} at {n}. What is its shaft power?' }
    },
    {
      name: 'Peak power',
      expr: 'Pmax = pi*n0*Ts/2', tex: 'P_\\text{max} = \\dfrac{\\pi n_0 T_s}{2}',
      vars: {
        Pmax: { name: 'peak power (at half the free speed)', q: 'power', unit: 'kW', tex: 'P_\\text{max}' },
        n0: { name: 'free speed', q: 'frequency', unit: 'rpm', value: 6000, tex: 'n_0' },
        Ts: { name: 'stall torque', q: 'torque', unit: 'N·m', value: 6.4, tex: 'T_s' }
      },
      note: 'From the straight torque line: P = 2π(n₀/2)(T_s/2).',
      practice: { unknowns: ['Pmax', 'Ts'] },
      stories: { Pmax: 'An air motor has a free speed of {n0} and a stall torque of {Ts}. What is its peak power?', Ts: 'An air motor of {Pmax} peak power has a free speed of {n0}. What is its stall torque?' }
    },
    {
      name: 'Overall efficiency from the compressor',
      expr: 'eta = P/(Q*w)', tex: '\\eta = \\dfrac{P}{Q\\,w}',
      vars: {
        eta: { name: 'overall efficiency', q: 'ratio', unit: '%', tex: '\\eta' },
        P: { name: 'shaft power', q: false, unit: 'kW', value: 1 },
        Q: { name: 'free-air consumption', q: false, unit: 'm³/min', value: 1.2 },
        w: { name: 'compressor specific power', q: false, unit: 'kW per m³/min', value: 6.5 }
      },
      note: 'Shaft power over the compressor\'s electrical power for the air. Rules of thumb in their own units: 1–1.5 m³/min per shaft kW, 6–7 kW per m³/min.',
      practice: { unknowns: ['eta', 'Q'] },
      stories: { eta: 'An air motor gives {P} while using {Q} of free air; the compressor needs {w}. What is the overall efficiency?' }
    }
  ],
  examples: [
    {
      title: 'A 1 kW vane motor',
      q: 'A vane motor has a peak power of 1 kW and a free speed of 6000 rpm. What is its stall torque, and what torque and power does it give at 4500 rpm?',
      steps: [
        '$T_s = 2P_\\text{max}/(\\pi n_0) = 2 \\times 1000/(\\pi \\times 100) = 6.4$ N·m (6000 rpm = 100 rev/s).',
        'At 4500 rpm: $T = 6.4 \\times (1 - 4500/6000) = 1.6$ N·m.',
        '$P = 2\\pi \\times 75 \\times 1.6 = 754$ W.'
      ],
      a: 'Stall torque 6.4 N·m; at 4500 rpm 1.6 N·m and 0.75 kW.'
    },
    {
      title: 'Where the motor settles',
      q: 'The same motor drives a hoist drum needing a steady 4 N·m. At what speed does it run and with what power? What happens if the load rises to 7 N·m?',
      steps: [
        '$n = n_0(1 - T/T_s) = 6000 \\times (1 - 4/6.4) = 2250$ rpm.',
        '$P = 2\\pi \\times 37.5 \\times 4 = 942$ W — close to the peak, because the speed is near half the free speed.',
        'At 7 N·m the load exceeds the stall torque: the motor stalls, holding 6.4 N·m without harm, and the load hangs (a hoist needs its brake).'
      ],
      a: '2250 rpm and 0.94 kW; at 7 N·m it stalls safely.'
    },
    {
      title: 'What the air costs',
      q: 'The motor gives 1 kW using 1.2 m³/min of free air; the compressor needs 6.5 kW per m³/min and electricity costs ¤0.15 per kWh. Compare a year of 2000 hours with an electric motor of 87 % efficiency.',
      steps: [
        'Compressor power: $1.2 \\times 6.5 = 7.8$ kW; overall efficiency $1/7.8 = 12.8$ %.',
        'Air motor: $7.8 \\times 2000 = 15\\,600$ kWh, ¤2,340 a year.',
        'Electric: $1/0.87 = 1.15$ kW, $2300$ kWh, ¤345 a year.'
      ],
      a: 'About ¤2,340 against ¤345: the air motor costs almost seven times as much to run.'
    }
  ],
  quiz: [
    { q: 'At what speed does an air motor give its greatest power?', choices: ['At stall', 'At half its free speed', 'At its free speed', 'At a third of its free speed'], a: 1,
      why: 'With a straight torque line, $P = 2\\pi n T_s(1 - n/n_0)$ is a parabola with its peak at $n_0/2$.' },
    { q: 'An air motor is overloaded and stalls. What happens?', choices: ['It overheats and burns out', 'It holds its stall torque without harm and restarts when the load falls', 'Its vanes break', 'It runs backwards'], a: 1,
      why: 'Nothing overheats: the air simply cannot turn the rotor. Stalling is a normal duty for air tools such as nutrunners.' },
    { q: 'What is the peak power of an air motor with a stall torque of 10 N·m and a free speed of 3000 rpm?', answer: 785, unit: 'W', tol: 0.02,
      why: '$P_\\text{max} = \\pi n_0 T_s/2 = \\pi \\times 50 \\times 10/2 = 785$ W (3000 rpm = 50 rev/s).' },
    { q: 'An air motor should run slower at light load but keep its full starting torque. You should…', choices: ['lower the supply pressure with a regulator', 'throttle the air supply to the motor', 'use a larger motor', 'remove the silencer'], a: 1,
      why: 'At standstill no air flows, so the throttle drops no pressure and the stall torque stays; at speed it limits the flow and the speed. A regulator lowers the torque at every speed.' },
    { q: 'An air motor gives its highest torque at its free speed.', a: false,
      why: 'The torque is highest at standstill and falls to zero at the free speed.' }
  ],
  problems: [
    { q: 'A vane motor with a stall torque of 8 N·m and a free speed of 5000 rpm drives a load needing 3 N·m. At what speed does it run?', answer: 3125, unit: 'rpm', tol: 0.02,
      steps: ['$n = n_0(1 - T/T_s) = 5000 \\times (1 - 3/8) = 3125$ rpm.', 'Power: $2\\pi \\times 52.1 \\times 3 = 982$ W.'] }
  ],
  applications: [
    'Hand-held air tools: drills, grinders, sanders, impact wrenches and nutrunners.',
    'Mixers and pumps in paint shops and chemical plants, where sparks are not allowed.',
    'Winches and hoists in mines and offshore.',
    'Starters for large diesel and gas engines.'
  ],
  history: 'Compressed-air motors drove the rock drills and haulage of 19th-century mines and tunnels, where steam was impractical underground and electricity a fire risk; the Mont Cenis tunnel (1857–1871) was one of the first great works to rely on them.',
  sim: 'act-air-motor'
},

{
  id: 'bellows-muscles', parent: 'other-actuators', title: 'Bellows, air springs and fluidic muscles', level: 2,
  short: 'Actuators without pistons or sliding seals: rubber bellows that push with a large effective area over a short stroke, air springs that carry vehicles and machines at a low natural frequency, and fluidic muscles that pull many times harder than a cylinder of the same bore over about a quarter of their length.',
  keywords: ['bellows actuator', 'air bellows', 'convoluted bellows', 'effective area', 'air spring', 'air suspension', 'natural frequency', 'vibration isolation', 'levelling valve', 'fluidic muscle', 'McKibben muscle', 'pneumatic artificial muscle', 'braid angle', 'contraction', 'soft actuator'],
  prereq: ['single-acting-cylinders', 'absolute-gauge-pressure', 'physics:mass-spring-system'],
  related: ['pneumatic-spring', 'tyres-air-springs', 'soft-robotics', 'isothermal-adiabatic', 'stick-slip', 'proportional-pressure', 'physics:simple-harmonic-motion'],
  body: `
Take away the piston and its sliding seals and let a flexible wall do the work: that is the idea behind bellows actuators, air springs and fluidic muscles. No seal friction and no stick-slip, no lubrication, no wear from dirt — and much larger forces than a cylinder of the same size, over short strokes.

### Bellows actuators
A bellows actuator is a rubber-and-fabric bellows of one, two or three convolutions between two plates. Air pushes the plates apart with $F = p_g A_\\text{eff}$, but the **effective area** is not constant: it is largest when the bellows is squashed and shrinks as it extends, so the force falls along the stroke — often by a third or more between its lowest and highest positions. A 250 mm double-convoluted bellows lifts about 15 kN at 6 bar near its lowest height. Bellows tolerate misaligned and tilting plates, work in dust, swarf and wash-down, and are single-acting: the load, a spring or a second bellows brings them back. They lift tables, drive presses and clamps, tension rollers and serve as emergency actuators that must never stick.

### Air springs
The same bellows, closed on a volume of air, is an **air spring** — the suspension of buses, trucks and trains, and the isolator under machines. Its stiffness comes from compressing the enclosed air:
$$k = \\frac{n\\,(p_g + p_\\text{atm})\\,A^2}{V}$$
with $n$ between 1 for slow and 1.4 for fast (adiabatic) changes (see [[isothermal-adiabatic]]); a mass $m$ on it bounces at
$$f = \\frac{1}{2\\pi}\\sqrt{\\frac{k}{m}}$$
Add load and the pressure must rise to carry it; the stiffness rises with it, so the natural frequency hardly changes — a vehicle rides alike empty or laden. A levelling valve adds or releases air to hold the ride height, and an extra volume softens the spring: vehicle air springs run at about 1–1.5 Hz, machine isolators at 2–3 Hz.

### Fluidic muscles
A fluidic (McKibben) muscle is a rubber tube inside a braided sleeve of strong fibres crossing in a rhombic mesh. Pressurised, the tube swells; the fibres cannot stretch, so as the muscle gets fatter it must get shorter — it **pulls**, like a biological muscle. For fibres at an angle $\\theta_0$ to the axis the ideal braid gives

$$F = p_g\\,\\frac{\\pi d^2}{4}\\left[\\frac{3(1 - \\varepsilon)^2}{\\tan^2\\theta_0} - \\frac{1}{\\sin^2\\theta_0}\\right]$$

where $\\varepsilon$ is the contraction. At the start a muscle pulls several times harder than a cylinder of the same bore — a 20 mm muscle about 1.5 kN at 6 bar, against 190 N — but the force falls steadily as it contracts, reaching zero where the fibres would stand at 54.7°. Real muscles, stiffened by their walls and end fittings, stop at about 25 % contraction. They are light and hermetically sealed, have no stick-slip, and can be held at intermediate positions by setting the pressure with a proportional regulator; but the stroke is short and the force depends on the position.

> [!warn] Bellows and muscles store air and can move suddenly, and a bellows under a table is a crushing point. Support the load mechanically before reaching under it, and exhaust and lock out first. Never inflate an air spring that is not held in its mountings — it can burst or fly apart.
`,
  ideas: [
    'No sliding seals: no friction, no stick-slip, no wear from dirt.',
    'A bellows pushes with p·A_eff, and its effective area shrinks as it extends.',
    'An air spring\'s stiffness is n·p_abs·A²/V; its natural frequency stays nearly constant as the load changes.',
    'A fluidic muscle pulls; its force is largest at the start and falls to zero at about 25 % contraction.',
    'At zero contraction a muscle pulls several times harder than a cylinder of the same bore.'
  ],
  pitfalls: [
    'A fluidic muscle can push as well as pull — A braided tube only contracts; pushing needs a spring, a load or an opposing muscle.',
    'A bellows gives the same force over its whole stroke — Its effective area shrinks as it extends, so the force falls, often by a third or more.',
    'A stiffer ride needs a bigger air spring — The stiffness grows with the pressure and the area squared and falls with the volume; a larger volume makes the spring softer.'
  ],
  formulas: [
    {
      name: 'Force of a fluidic muscle (ideal braid)',
      expr: 'F = p*pi*d^2/4*(3*(1 - eps)^2/tan(theta)^2 - 1/sin(theta)^2)', tex: 'F = p_g\\,\\dfrac{\\pi d^2}{4}\\left[\\dfrac{3(1 - \\varepsilon)^2}{\\tan^2\\theta_0} - \\dfrac{1}{\\sin^2\\theta_0}\\right]',
      vars: {
        F: { name: 'pulling force', q: 'force', unit: 'N', signed: true },
        p: { name: 'pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        d: { name: 'inside diameter at rest', q: 'length', unit: 'mm', value: 20 },
        eps: { name: 'contraction', q: 'ratio', unit: '%', value: 10, min: 0, max: 60, tex: '\\varepsilon' },
        theta: { name: 'braid angle at rest (to the axis)', q: 'angle', unit: '°', value: 25, min: 5, max: 54, tex: '\\theta_0' }
      },
      note: 'The ideal thin-walled braid; real muscles give less, and stop at about 25 % contraction because of their walls and end fittings. A negative result means the muscle cannot contract that far.',
      practice: { unknowns: ['F', 'p'] },
      stories: { F: 'A fluidic muscle of {d} bore with a braid angle of {theta} is pressurised to {p}. What does it pull with at a contraction of {eps}?', p: 'A muscle of {d} bore (braid angle {theta}) must pull {F} at a contraction of {eps}. What pressure does it need?' }
    },
    {
      name: 'Stiffness of an air spring',
      expr: 'k = n*(p + patm)*A^2/V', tex: 'k = \\dfrac{n\\,(p_g + p_\\text{atm})\\,A^2}{V}',
      vars: {
        k: { name: 'spring stiffness', q: 'stiffness', unit: 'N/mm' },
        n: { name: 'polytropic index (1 slow, 1.4 fast)', value: 1.3, min: 1, max: 1.4 },
        p: { name: 'spring pressure (gauge)', q: 'pressure', unit: 'bar', value: 4.9, tex: 'p_g' },
        patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' },
        A: { name: 'effective area', q: 'area', unit: 'cm²', value: 300 },
        V: { name: 'enclosed volume (spring and any extra tank)', q: 'volume', unit: 'L', value: 5 }
      },
      note: 'For an effective area that does not change with height; shaped pistons add a term. The load carried is p_g·A.',
      practice: { unknowns: ['k', 'V'] },
      stories: { k: 'An air spring of {A} effective area and {V} volume is at {p}. What is its stiffness for fast motions (n = {n})?', V: 'An air spring of {A} at {p} must have a stiffness of {k} (n = {n}). What volume must it enclose?' }
    },
    {
      name: 'Natural frequency on a spring',
      expr: 'f = sqrt(k/m)/(2*pi)', tex: 'f = \\dfrac{1}{2\\pi}\\sqrt{\\dfrac{k}{m}}',
      vars: {
        f: { name: 'natural frequency', q: 'frequency', unit: 'Hz' },
        k: { name: 'spring stiffness', q: 'stiffness', unit: 'N/mm', value: 138 },
        m: { name: 'mass carried', q: 'mass', unit: 'kg', value: 1500 }
      },
      note: 'Vehicle air springs run at about 1–1.5 Hz, machine isolators at 2–3 Hz; vibrations well above √2 f are isolated.',
      practice: { unknowns: ['f', 'k'] },
      stories: { f: 'A mass of {m} rests on an air spring of stiffness {k}. At what frequency does it bounce?', k: 'A {m} mass should bounce at {f}. What spring stiffness is needed?' }
    }
  ],
  examples: [
    {
      title: 'A muscle against a cylinder',
      q: 'A fluidic muscle of 20 mm bore with a braid angle of 25° is pressurised to 6 bar gauge. What does the ideal braid pull at 0 % and at 10 % contraction, compared with a 20 mm cylinder?',
      steps: [
        '$p_g A = 6\\times10^5 \\times 3.14\\times10^{-4} = 188.5$ N — what a 20 mm cylinder pushes.',
        'At 0 %: $3/\\tan^2 25° - 1/\\sin^2 25° = 13.80 - 5.60 = 8.20$, so $F = 8.20 \\times 188.5 = 1545$ N.',
        'At 10 %: $3 \\times 0.81/0.2174 - 5.60 = 5.58$, so $F = 1051$ N.'
      ],
      a: 'About 1.55 kN at the start and 1.05 kN at 10 % — eight and five times the cylinder\'s 190 N.'
    },
    {
      title: 'The ride of an air-sprung axle',
      q: 'An air spring of 300 cm² effective area and 5 L volume carries 1500 kg. What pressure does it need, what is its stiffness (n = 1.3), and at what frequency does the load bounce? What if a 10 L tank is added?',
      steps: [
        'Pressure: $p_g = m g/A = 1500 \\times 9.81/0.03 = 4.9\\times10^5$ Pa = 4.9 bar gauge.',
        '$k = 1.3 \\times 5.91\\times10^5 \\times 0.03^2/0.005 = 1.38\\times10^5$ N/m = 138 N/mm.',
        '$f = \\sqrt{1.38\\times10^5/1500}/(2\\pi) = 1.53$ Hz.',
        'With the tank, $V = 15$ L: the stiffness falls to a third and $f = 1.53/\\sqrt3 = 0.88$ Hz.'
      ],
      a: '4.9 bar, 138 N/mm and 1.5 Hz; with the extra tank 0.9 Hz.'
    },
    {
      title: 'A bellows lifting table',
      q: 'A double-convoluted bellows has an effective area of 150 cm² at mid-height. What does it lift at 6 bar gauge? Near full extension its effective area is about 100 cm².',
      steps: ['Mid-height: $6\\times10^5 \\times 0.015 = 9$ kN.', 'Near full extension: $6\\times10^5 \\times 0.010 = 6$ kN.'],
      a: 'About 9 kN at mid-height, falling to 6 kN near the top of its stroke.'
    }
  ],
  quiz: [
    { q: 'A fluidic muscle with both ends fixed is pressurised. What does it do?', choices: ['Pushes its ends apart', 'Pulls its ends together', 'Twists', 'Nothing — it only swells'], a: 1,
      why: 'The braid cannot stretch, so as the muscle swells it must shorten: it pulls on its fixings.' },
    { q: 'Where along its stroke is a fluidic muscle\'s pull largest?', choices: ['At the start of its contraction', 'At the end of its contraction', 'It is the same throughout', 'Halfway'], a: 0,
      why: 'The force falls steadily with contraction and reaches zero at the end of the stroke, about 25 % for real muscles.' },
    { q: 'Adding an extra air volume to an air spring makes the suspension softer.', a: true,
      why: 'The stiffness $k = n p A^2/V$ falls with the volume: the same displacement compresses more air by a smaller fraction.' },
    { q: 'An air spring of 120 N/mm carries 1200 kg. What is its natural frequency?', answer: 1.59, unit: 'Hz', tol: 0.02,
      why: '$f = \\sqrt{120\\,000/1200}/(2\\pi) = 10/(2\\pi) = 1.59$ Hz.' },
    { q: 'Why does the natural frequency of an air-sprung vehicle hardly change with its load?', choices: ['Air springs have no stiffness', 'More load needs more pressure, which raises the stiffness in step with the mass', 'The levelling valve changes the volume', 'The tyres take the load'], a: 1,
      why: 'Carrying twice the load takes about twice the gauge pressure; the stiffness grows with the absolute pressure, nearly in proportion, so k/m and the frequency change little.' }
  ],
  applications: [
    'Air suspension of buses, trucks, trailers and trains, and cab seats.',
    'Vibration isolation of presses, test rigs and measuring machines.',
    'Lifting tables, presses and clamps driven by bellows.',
    'Fluidic muscles in grippers, orthoses, climbing and walking robots and soft robotics.'
  ],
  history: 'The braided pneumatic muscle is named after the physicist Joseph McKibben, who built it in the late 1950s to move the fingers of people paralysed by polio. It was revived for robotics in the 1980s, and industrial muscles followed in the 1990s.',
  sim: 'act-muscle'
}

);
