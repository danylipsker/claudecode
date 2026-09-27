/* HYPER-HYDRAULICS · content/actuators-care.js
 *   branch "Cylinders and Actuators" (the reference page hydraulic-cylinder is in reference.js)
 *     cylinders               cylinder-types, area-ratio, cylinder-speed, cushioning, rod-buckling, seals, mounting-side-load
 *     rotary-actuators-topic  rotary-actuators, intensifiers
 *   branch "Design, Conditioning and Maintenance"
 *     contamination-topic     contamination, iso-4406, filtration, troubleshooting, hydraulic-safety
 * Simulations in sims/actuators-care.js (ids act-*). The example cylinders used throughout: 63/36
 * (A1 31.2 cm², A2 21.0 cm², φ 1.49) and 100/70 (A1 78.5 cm², A2 40.1 cm², φ 1.96), steel rods (E = 210 GPa),
 * mineral oil of density 870 kg/m³. */
Hyper.add(

/* ================================================================ CYLINDERS */
{
  id: 'cylinder-types', parent: 'cylinders', title: 'Single-acting, double-acting and telescopic cylinders', level: 1,
  short: 'Cylinders differ in how the rod comes back (oil, a spring or gravity), whether the rod itself is the piston, how many stages nest inside each other, and how the ends are held on. Each answer suits a different machine.',
  keywords: ['single-acting', 'double-acting', 'spring return', 'gravity return', 'plunger', 'ram', 'telescopic cylinder', 'stages', 'tipper', 'double-rod', 'through-rod', 'differential cylinder', 'tie-rod', 'welded cylinder', 'mill-type'],
  prereq: ['hydraulic-cylinder', 'pascals-law', 'physics:pressure'],
  related: ['area-ratio', 'cylinder-speed', 'rod-buckling', 'mounting-side-load', 'lifts-cranes', 'mobile-hydraulics', 'hydraulic-press', 'pneumatics:single-acting-cylinders'],
  body: `
Every hydraulic cylinder turns pressure into a straight push, but not every job needs the same cylinder. Four questions sort them: does oil drive the rod both ways or only one? Is there a separate piston, or is the rod itself the piston? Must a long stroke fold into a short body? And how are the ends held on?

### Single-acting: oil one way, something else back
A **single-acting** cylinder has one working port. Oil pushes the rod out; something else brings it back — the **weight of the load** (a car lift, a tipper body, a bottle jack), a **spring** inside the cylinder (clamps, short-stroke tools), or an outside force. The other chamber breathes through a vent, which must be filtered: it draws in air, and dust and moisture with it, on every stroke. A gravity return costs the pump nothing — the lowering speed is set by a throttle on the way back to the tank — but a single-acting cylinder cannot pull, and cannot hold a load down.

A spring return costs force. The spring is compressed on every outstroke, so the useful push is $F = p A_1 - F_s$, and $F_s$ grows along the stroke. Springs also limit the stroke, so spring-return cylinders are short.

### Plungers (rams)
In a **plunger** or **ram** cylinder the rod *is* the piston: a thick, ground plunger slides through a seal and bearing in the head, and the pressure acts on its whole cross-section. There is no piston seal to wear and the barrel bore need not be finished, so rams are simple and nearly indestructible — the choice for presses, jacks, lifts and dock levellers. They are single-acting, and because the plunger is supported only at the head they need a guided load.

### Double-acting and double-rod
A **double-acting** cylinder has a port at each end and is powered both ways (see [[hydraulic-cylinder]]). With a rod on one side only — a **differential** cylinder — the two working areas differ by the rod's area, so it pulls less hard and returns faster, by the [[area-ratio]]. A **double-rod** (through-rod) cylinder has a rod out of both ends: equal areas, equal forces, equal speeds and equal flows in and out, which is why steering cylinders, machine-tool tables and servo actuators use it.

### Telescopic cylinders
A **telescopic** cylinder nests several tubes — **stages** — inside one another, so its stroke can be three to five times its collapsed length. A tipper truck lifts its body with one: collapsed it fits under the front of the body, extended it reaches several metres.

All stages see the same pressure, so the stage with the **largest area moves first**: at a given load it needs the least pressure. When it reaches its stop the pressure rises until the next smaller stage moves, and so on. With a steady pump flow each stage is therefore **faster** and **weaker** than the one before. A three-stage cylinder pushing 110 kN with 80 L/min:

| Stage | Diameter | Area | Pressure for 110 kN | Speed at 80 L/min |
|---|---|---|---|---|
| 1 | 125 mm | 122.7 cm² | 90 bar | 0.11 m/s |
| 2 | 100 mm | 78.5 cm² | 140 bar | 0.17 m/s |
| 3 | 80 mm | 50.3 cm² | 219 bar | 0.27 m/s |

That order suits a tipper: the force needed along the cylinder is greatest at the start of the lift, when the biggest stage acts, and falls as the body rises and its centre of gravity swings towards the hinge. Lowering under gravity, the **smallest stage retracts first** (it needs the highest pressure to hold, so it is the first to give way as the pressure falls). Most telescopics are single-acting; double-acting ones, with passages feeding each stage's annulus, are used where the load cannot pull them back.

### How the ends are held on
- **Tie-rod** cylinders: square end caps clamped to the barrel by four or more long bolts. Easy to take apart and repair; the usual industrial type, generally rated up to about 160–210 bar (mounting dimensions for the 160 bar compact series are standardised in ISO 6020-2:2015).
- **Welded** cylinders: the cap welded to the barrel and the head screwed or wired in. Compact, dirt-tight and good for 250–350 bar — the standard on mobile machines.
- **Mill-type** cylinders: heavy bolted flanges on a thick barrel, for steel mills and presses where high pressure and easy repair both matter.

> [!tip] In a circuit diagram (ISO 1219-1:2012) the cylinder symbol shows its type: one port and a spring for single-acting with spring return, a rod out of both ends for a double-rod cylinder, stepped nested rectangles for a telescope, and small rectangles at the ends for cushions.

> [!warn] A raised tipper body, lift platform or press ram on a single-acting cylinder is held up only by the oil trapped beneath it. Before anyone reaches or works under it, lower it or support it mechanically — with the body prop or safety strut the maker provides — and lock out the controls.
`,
  ideas: [
    'Single-acting cylinders are driven one way by oil and returned by gravity, a spring or the load; double-acting cylinders are driven both ways.',
    'A plunger (ram) uses the rod as the piston: rugged and simple, single-acting, and in need of a guided load.',
    'A double-rod cylinder has equal areas both sides, so equal forces, speeds and flows in each direction.',
    'In a telescopic cylinder the largest stage moves first; each following stage is faster but needs more pressure for the same load.',
    'Tie-rod cylinders are easy to repair; welded ones are compact and take higher pressures; mill-type ones are for the heaviest duty.'
  ],
  pitfalls: [
    'All stages of a telescopic cylinder move together — They share one pressure, so the one needing the least pressure (the largest) moves first; the next moves only when the first reaches its stop.',
    'A spring-return cylinder pushes with the full p·A — Part of the force goes into compressing the spring, and that part grows along the stroke.',
    'A single-acting cylinder can hold a load down — Oil acts on one side only; a load that lifts the rod simply pulls it out.'
  ],
  formulas: [
    {
      name: 'Single-acting cylinder with spring return: net push',
      expr: 'F = p*pi*D^2/4 - Fs', tex: 'F = p\\,\\dfrac{\\pi D^2}{4} - F_s',
      vars: {
        F: { name: 'net push at the rod', q: 'force', unit: 'kN', signed: true },
        p: { name: 'pressure (gauge)', q: 'pressure', unit: 'bar', value: 100 },
        D: { name: 'bore', q: 'length', unit: 'mm', value: 50 },
        Fs: { name: 'spring force at this point of the stroke', q: 'force', unit: 'kN', value: 1.2, tex: 'F_s' }
      },
      note: 'The spring force grows along the stroke: use its value at the position that matters (usually the end of the stroke). Seal friction takes a further few per cent.',
      practice: { unknowns: ['F', 'p'] },
      stories: {
        F: 'A single-acting clamp with a bore of {D} is fed at {p}. Its return spring pushes back with {Fs} at the end of the stroke. What clamping force is left?',
        p: 'A spring-return cylinder with a bore of {D} must clamp with {F} against a spring force of {Fs}. What pressure does it need?'
      }
    },
    {
      name: 'Telescopic cylinder: pressure to move a stage',
      expr: 'p = 4*F/(pi*Di^2)', tex: 'p = \\dfrac{4F}{\\pi D_i^2}',
      vars: {
        p: { name: 'pressure needed (gauge)', q: 'pressure', unit: 'bar' },
        F: { name: 'load along the cylinder', q: 'force', unit: 'kN', value: 110 },
        Di: { name: 'effective diameter of the moving stage', q: 'length', unit: 'mm', value: 125, tex: 'D_i' }
      },
      note: 'All stages share one pressure; the stage needing the least (the largest) moves first. Stage friction adds a few bar.',
      stories: {
        p: 'A telescopic stage of effective diameter {Di} must push {F}. What pressure does it need?',
        Di: 'A relief valve limits a tipper to {p}. What is the smallest stage diameter that can still push {F}?'
      }
    },
    {
      name: 'Telescopic cylinder: speed of a stage',
      expr: 'v = 4*Q/(pi*Di^2)', tex: 'v = \\dfrac{4Q}{\\pi D_i^2}',
      vars: {
        v: { name: 'extension speed', q: 'speed', unit: 'm/s' },
        Q: { name: 'pump flow', q: 'flowrate', unit: 'L/min', value: 80 },
        Di: { name: 'effective diameter of the moving stage', q: 'length', unit: 'mm', value: 125, tex: 'D_i' }
      },
      stories: {
        v: 'A pump delivers {Q} to a telescopic cylinder whose moving stage has an effective diameter of {Di}. How fast does it extend?',
        Q: 'A telescopic stage of {Di} must extend at {v}. What pump flow does it need?'
      }
    }
  ],
  examples: [
    {
      title: 'A tipper, stage by stage',
      q: 'A tipper\'s three-stage cylinder has stages of 125, 100 and 80 mm and a stroke of 1.0 m per stage. It is fed with 80 L/min. If the load along the cylinder stayed at 110 kN, what pressure and speed would each stage need, and how long would the lift take?',
      steps: [
        'Flow: $Q = 80/60\\,000 = 1.333\\times10^{-3}$ m³/s. Areas: $\\pi D^2/4$ = 122.7, 78.5 and 50.3 cm².',
        'Pressures $p = F/A$: $1.1\\times10^5/1.227\\times10^{-2}$ = 89.6 bar, then 140.1 bar, then 218.8 bar.',
        'Speeds $v = Q/A$: 0.109, 0.170 and 0.265 m/s; times for 1 m each: 9.2 s, 5.9 s and 3.8 s.',
        'The lift takes about 19 s — slowly at first, faster as the smaller stages take over. The last stage needs almost 220 bar; in a real tipper the load has fallen by then, as the body\'s weight swings towards the hinge.'
      ],
      a: '90, 140 and 219 bar; 0.11, 0.17 and 0.27 m/s; about 19 s in all.'
    },
    {
      title: 'A spring-return clamp',
      q: 'A single-acting clamp has a 50 mm bore and a return spring giving 0.6 kN when retracted and 1.2 kN at the end of its 25 mm stroke. It is fed at 100 bar. What pressure starts it moving, and what force does it clamp with?',
      steps: [
        'Piston area: $A = \\pi \\times 0.05^2/4 = 1.963\\times10^{-3}$ m².',
        'To start, the oil must overcome the spring preload: $p = 600/1.963\\times10^{-3} = 3.1\\times10^5$ Pa, about 3 bar (plus seal breakaway).',
        'At 100 bar the piston pushes $10^7 \\times 1.963\\times10^{-3} = 19.6$ kN; at the end of the stroke the spring takes 1.2 kN.',
        'Clamping force: $19.6 - 1.2 = 18.4$ kN.'
      ],
      a: 'It starts at about 3 bar and clamps with about 18.4 kN.'
    }
  ],
  quiz: [
    { q: 'A three-stage telescopic cylinder lifts a load. Which stage extends first?', choices: ['the smallest', 'the largest', 'all three together', 'whichever has the least friction'], a: 1,
      why: 'All stages see the same pressure. The largest area needs the least pressure to carry the load, so it moves first; the next starts only when it reaches its stop.' },
    { q: 'With a constant pump flow, as the stages of a telescopic cylinder extend in turn, the extension speed…', choices: ['rises and the pressure needed rises', 'falls and the pressure falls', 'stays the same', 'rises and the pressure falls'], a: 0,
      why: 'Each stage is smaller: v = Q/A rises and p = F/A rises. That is why the smallest stage is the one closest to the relief setting.' },
    { q: 'A plunger (ram) cylinder can be powered in both directions.', a: false,
      why: 'The rod is the piston: there is no annulus for oil to act on, so a ram is single-acting and returns by gravity or an outside force.' },
    { q: 'What force does an 80 mm plunger push with at 200 bar?', answer: 100.5, unit: 'kN', tol: 0.02,
      why: 'A = π × 0.08²/4 = 5.03×10⁻³ m²; F = 2×10⁷ × 5.03×10⁻³ = 100.5 kN — the whole cross-section of the plunger is the piston.' },
    { q: 'An excavator boom cylinder working at 350 bar in mud and dust is most likely…', choices: ['a tie-rod cylinder', 'a welded cylinder', 'a spring-return cylinder', 'a double-rod cylinder'], a: 1,
      why: 'Welded cylinders are compact, dirt-tight and rated for the high pressures of mobile machines; tie-rod cylinders are the industrial type for moderate pressures.' }
  ],
  problems: [
    { q: 'The second stage of a telescopic cylinder has an effective diameter of 100 mm. The pump gives 60 L/min. How fast does it extend?', answer: 0.127, unit: 'm/s', tol: 0.02,
      steps: ['$A = \\pi \\times 0.1^2/4 = 7.854\\times10^{-3}$ m².', '$v = Q/A = 10^{-3}/7.854\\times10^{-3} = 0.127$ m/s.'] },
    { q: 'A relief valve limits a telescopic cylinder to 180 bar. Its smallest stage is 70 mm. What is the largest load that stage can move (ignore friction)?', answer: 69.3, unit: 'kN', tol: 0.02,
      steps: ['$A = \\pi \\times 0.07^2/4 = 3.848\\times10^{-3}$ m².', '$F = pA = 1.8\\times10^7 \\times 3.848\\times10^{-3} = 69.3$ kN.'] }
  ],
  applications: [
    'Tipper trucks and trailers: single-acting telescopic cylinders of three to five stages under the front of the body.',
    'Bottle jacks, workshop presses and passenger lifts: plunger rams, returned by the load.',
    'Power steering, machine-tool slides and flight-control actuators: double-rod cylinders with equal speeds both ways.',
    'Clamps and fixtures: short spring-return cylinders that release by themselves when the pressure goes.'
  ],
  history: 'Before electric motors took over, whole cities ran lifts, cranes and bridges from water mains at high pressure. The London Hydraulic Power Company pumped water at about 50 bar through some 290 km of pipes from 1883 until 1977, and many of its customers\' lifts were plunger rams sunk into boreholes as deep as the lift was tall.',
  sim: 'act-telescopic'
},

{
  id: 'area-ratio', parent: 'cylinders', title: 'Area ratio and differential cylinders', level: 2,
  short: 'A cylinder with a rod on one side has a big piston area and a smaller annulus. Their ratio φ sets how much weaker and faster the return stroke is, how much oil comes back, and how high the pressure in a blocked rod end can climb.',
  keywords: ['area ratio', 'phi', 'differential cylinder', 'annulus', 'return flow', 'intensification', 'pressure intensification', 'meter-out', 'regeneration', 'rod-end pressure', '2:1 cylinder'],
  prereq: ['hydraulic-cylinder', 'cylinder-types', 'physics:static-equilibrium'],
  related: ['regenerative-circuit', 'meter-in-out', 'cylinder-speed', 'intensifiers', 'counterbalance-valve', 'filtration', 'line-sizing', 'cushioning'],
  body: `
A **differential cylinder** — a piston with a rod on one side only — has two working areas: the full piston area $A_1$ on the cap side and the ring-shaped **annulus** $A_2$ on the rod side. Their ratio

$$\\varphi = \\frac{A_1}{A_2} = \\frac{D^2}{D^2 - d^2}$$

is the **area ratio**, and a surprising amount of a circuit's behaviour follows from this one number.

| Bore × rod (mm) | $A_1$ (cm²) | $A_2$ (cm²) | $\\varphi$ |
|---|---|---|---|
| 63 × 36 | 31.2 | 21.0 | 1.49 |
| 63 × 45 | 31.2 | 15.3 | 2.04 |
| 100 × 56 | 78.5 | 53.9 | 1.46 |
| 100 × 70 | 78.5 | 40.1 | 1.96 |
| 125 × 90 | 122.7 | 59.1 | 2.08 |

A rod about 0.7 of the bore gives $\\varphi \\approx 2$. ISO 3320:2013 lists the standard bores and rods together with nominal area ratios, from about 1.25 for thin rods to 2.5 and more for thick ones.

### Forces, speeds and flows
At the same pressure the **pull is the push divided by φ**. With the same flow the **retraction speed is the extension speed times φ**. And the flows at the two ports are never equal:

- extending, the rod end returns $Q/\\varphi$ — less than the pump delivers;
- retracting, the cap end returns $\\varphi\\,Q$ — **more** than the pump delivers.

A 100/70 cylinder fed with 60 L/min extends at 0.13 m/s and retracts at 0.25 m/s, and while it retracts **118 L/min** pours out of the cap end. The valve's A→T path, the return line, the cooler and the return filter must all be sized for that, not for the pump: a return filter chosen for 60 L/min would open its bypass on every stroke ([[filtration]]). The tank level also rises and falls by the volume of the rods, and the tank breathes that much air in and out.

### Pressure intensification
Now shut the rod-end outlet while the cap end is pressurised — a meter-out throttle closed down, a blocked valve port, a counterbalance valve set too high. The piston stops or creeps, and its forces balance:

$$p_1 A_1 = p_2 A_2 + F \\quad\\Rightarrow\\quad p_2 = \\varphi\\,p_1 - \\frac{F}{A_2}$$

With no load the trapped annulus reaches **φ times** the supply pressure. A 2:1 cylinder on a 200 bar supply holds about 390 bar in its rod end — far beyond the 250 bar it may be rated for — and an **overrunning** load, one that pulls the rod outwards ($F < 0$), raises it further still. That is how rod glands are blown out and rod seals extruded. Every meter-out circuit relies on raising $p_2$ to control the speed, so its designer must check this pressure ([[meter-in-out]]). The reverse case — driving the annulus with the cap end blocked — gives $p_1 = p_2/\\varphi$: lower, and harmless.

> [!warn] Never plug the rod-end port of a double-acting cylinder and pressurise the cap end to "test" it: the annulus pressure rises to φ times the supply. Cylinders whose outlet can be closed while the inlet is driven are protected by a rod-end (or cross-port) relief valve set below their rating.

### Using the ratio
- **Regeneration.** Connect the rod end to the cap end while extending: the rod-end oil joins the pump flow, only the rod's area pushes, and the rod shoots out at $Q/(A_1 - A_2)$. With $\\varphi = 2$ that equals the retraction speed $Q/A_2$ — a 2:1 cylinder in a [[regenerative-circuit]] goes out and back equally fast.
- **Equal forces and speeds** need $\\varphi = 1$: a double-rod cylinder ([[cylinder-types]]).
- **Load holding.** A counterbalance valve on the rod end of a cylinder holding a hanging load must be set above the load pressure; its pilot ratio and the area ratio together decide how much cap-end pressure is needed to lower it ([[counterbalance-valve]]).
- **Pump-controlled cylinders.** A single pump driving a differential cylinder directly must take in and deliver different flows at its two ports; such closed circuits need extra valves and a charge pump to make up or remove the difference.
`,
  ideas: [
    'φ = A₁/A₂ = D²/(D² − d²): about 1.5 for a rod of 0.57 D, 2 for a rod of 0.71 D.',
    'At equal pressure the pull is the push ÷ φ; at equal flow the retraction speed is the extension speed × φ.',
    'Retracting, the cap end returns φ × the pump flow: size the return path for it.',
    'A blocked or throttled rod end reaches p₂ = φ·p₁ − F/A₂, above the supply pressure; an overrunning load makes it worse.',
    'With φ = 2 a regenerative extension is exactly as fast as the retraction.'
  ],
  pitfalls: [
    'No pressure in a hydraulic circuit can exceed the relief setting — The relief valve limits the pump side. A trapped annulus is multiplied by φ above it, with nothing to stop it unless the rod end has its own relief valve.',
    'The return flow equals the pump flow — Only for a double-rod cylinder. Retracting a differential cylinder returns φ times the pump flow; extending, 1/φ of it.',
    'A thicker rod only makes the cylinder stronger — It stiffens the rod against buckling, but it shrinks the annulus: less pull, faster return, more return flow and more intensification.'
  ],
  formulas: [
    {
      name: 'Area ratio',
      expr: 'phi = D^2/(D^2 - d^2)', tex: '\\varphi = \\dfrac{A_1}{A_2} = \\dfrac{D^2}{D^2 - d^2}',
      vars: {
        phi: { name: 'area ratio φ = A₁/A₂', tex: '\\varphi' },
        D: { name: 'bore', q: 'length', unit: 'mm', value: 100 },
        d: { name: 'rod diameter', q: 'length', unit: 'mm', value: 70 }
      },
      practice: { unknowns: ['phi', 'd'] },
      stories: {
        phi: 'A cylinder has a bore of {D} and a rod of {d}. What is its area ratio?',
        d: 'A cylinder with a bore of {D} is to have an area ratio of {phi}. What rod diameter does that need?'
      }
    },
    {
      name: 'Rod-end pressure with the outlet throttled or blocked',
      expr: 'p2 = phi*p1 - F/A2', tex: 'p_2 = \\varphi\\,p_1 - \\dfrac{F}{A_2}',
      vars: {
        p2: { name: 'rod-end pressure (gauge)', q: 'pressure', unit: 'bar', tex: 'p_2' },
        phi: { name: 'area ratio', value: 1.96, tex: '\\varphi' },
        p1: { name: 'cap-end pressure (gauge)', q: 'pressure', unit: 'bar', value: 200, tex: 'p_1' },
        F: { name: 'load resisting extension (negative if it pulls the rod out)', q: 'force', unit: 'kN', value: 50, signed: true },
        A2: { name: 'annulus area', q: 'area', unit: 'cm²', value: 40.06, tex: 'A_2' }
      },
      note: 'The force balance p₁A₁ = p₂A₂ + F of a piston at rest or moving steadily, divided by A₂; friction ignored. In a meter-out circuit p₁ is usually the relief setting.',
      practice: { unknowns: ['p2', 'F'] },
      stories: {
        p2: 'A cylinder with an area ratio of {phi} and an annulus of {A2} has {p1} on its cap end and a load of {F} resisting extension. Its rod-end outlet is throttled. What pressure is in the rod end?',
        F: 'A cylinder with area ratio {phi} and annulus {A2} has {p1} at the cap end and {p2} in its throttled rod end. What load is it holding?'
      }
    },
    {
      name: 'Flow out of the cap end while retracting',
      expr: 'Qout = phi*Q', tex: 'Q_\\text{out} = \\varphi\\,Q',
      vars: {
        Qout: { name: 'flow leaving the cap end', q: 'flowrate', unit: 'L/min', tex: 'Q_\\text{out}' },
        phi: { name: 'area ratio', value: 1.96, tex: '\\varphi' },
        Q: { name: 'flow into the rod end', q: 'flowrate', unit: 'L/min', value: 60 }
      },
      note: 'Extending, the rod end returns Q/φ instead.',
      stories: {
        Qout: 'A pump sends {Q} into the rod end of a cylinder with area ratio {phi}. How much oil comes out of the cap end?',
        Q: 'The return line from a cylinder with area ratio {phi} can pass {Qout}. What is the largest flow that may be sent into the rod end?'
      }
    }
  ],
  examples: [
    {
      title: 'Where the oil goes',
      q: 'A 100/70 cylinder is fed with 60 L/min. Find the speeds out and back and the flow leaving the cylinder in each direction.',
      steps: [
        '$A_1 = 78.54$ cm², $A_2 = 78.54 - 38.48 = 40.06$ cm², so $\\varphi = 1.96$. $Q = 10^{-3}$ m³/s.',
        'Extending: $v = Q/A_1 = 0.127$ m/s; the rod end returns $Q/\\varphi$ = 30.6 L/min.',
        'Retracting: $v = Q/A_2 = 0.250$ m/s; the cap end returns $\\varphi Q$ = 117.6 L/min.',
        'The valve\'s A→T path, the return line and the return filter must pass almost twice the pump flow.'
      ],
      a: '0.13 m/s out with 31 L/min returning; 0.25 m/s back with 118 L/min returning.'
    },
    {
      title: 'A meter-out throttle multiplies the pressure',
      q: 'The same 100/70 cylinder (rated 250 bar) extends with a meter-out throttle in its rod-end line, the relief valve at 200 bar. What is the rod-end pressure when the load resists with 80 kN, and when the load pulls the rod out with 30 kN?',
      steps: [
        'With the throttle controlling the speed, the pump flow is more than the cylinder takes and the cap end sits at the relief setting, $p_1$ = 200 bar.',
        'Resisting load: $p_2 = 1.96 \\times 200 - 8\\times10^4/4.006\\times10^{-3}\\,\\text{Pa} = 392 - 200 = 192$ bar.',
        'Overrunning load ($F = -30$ kN): $p_2 = 392 + 3\\times10^4/4.006\\times10^{-3}\\,\\text{Pa} = 392 + 75 = 467$ bar.',
        'With the throttle closed and no load it would be 392 bar. Only the first case is within the 250 bar rating: this circuit needs a lower relief setting, a rod-end relief valve or meter-in control.'
      ],
      a: '192 bar resisting; 467 bar overrunning — nearly twice the cylinder\'s rating.'
    }
  ],
  quiz: [
    { q: 'A 2:1 cylinder retracts with 50 L/min going into its rod end. How much oil leaves the cap end?', choices: ['25 L/min', '50 L/min', '100 L/min', '200 L/min'], a: 2,
      why: 'The piston sweeps the full area A₁ at the speed set by the annulus: Q_out = φQ = 2 × 50 = 100 L/min.' },
    { q: 'The rod-end port of an unloaded cylinder with φ = 1.6 is blocked and the cap end is held at 150 bar. What pressure is trapped in the rod end?', answer: 240, unit: 'bar', tol: 0.02,
      why: 'p₂A₂ = p₁A₁, so p₂ = φp₁ = 1.6 × 150 = 240 bar — above the supply pressure.' },
    { q: 'At the same pressure a cylinder with φ = 2 pulls with half the force it pushes with.', a: true,
      why: 'Push = pA₁, pull = pA₂ = pA₁/φ.' },
    { q: 'Why are 2:1 cylinders popular in regenerative circuits?', choices: ['they are cheaper', 'regenerative extension then equals the retraction speed', 'they cannot intensify pressure', 'they need no return line'], a: 1,
      why: 'Regenerative extension runs at Q/(A₁ − A₂) = Q/A_rod; retraction at Q/A₂. With A₁ = 2A₂ the rod area equals the annulus, so the two speeds are equal.' },
    { q: 'What rod diameter gives a 100 mm bore an area ratio of exactly 2?', answer: 70.7, unit: 'mm', tol: 0.02,
      why: 'φ = 2 means D² − d² = D²/2, so d = D/√2 = 70.7 mm (the standard 70 mm rod gives 1.96).' }
  ],
  problems: [
    { q: 'A 63/45 cylinder extends against no load with its rod-end outlet throttled nearly shut and 160 bar at the cap end. Estimate the rod-end pressure.', answer: 326.6, unit: 'bar', tol: 0.02,
      steps: ['$\\varphi = 63^2/(63^2 - 45^2) = 3969/1944 = 2.042$.', '$p_2 = \\varphi p_1 = 2.042 \\times 160 = 327$ bar.'] },
    { q: 'An 80/56 cylinder is retracted with 40 L/min. What flow leaves the cap end?', answer: 78.4, unit: 'L/min', tol: 0.02,
      steps: ['$\\varphi = 80^2/(80^2 - 56^2) = 6400/3264 = 1.961$.', '$Q_\\text{out} = 1.961 \\times 40 = 78.4$ L/min.'] }
  ],
  applications: [
    'Presses and injection-moulding machines that use regeneration for a fast approach with a 2:1 cylinder.',
    'Sizing return lines, coolers and return filters on excavators and loaders, where retracting cylinders return up to twice the pump flow.',
    'Choosing counterbalance settings on cranes and aerial platforms that hold loads on the rod end.',
    'Rod-end relief valves on cylinders in meter-out and load-holding circuits.'
  ],
  sim: 'act-intensify'
},

{
  id: 'cylinder-speed', parent: 'cylinders', title: 'Cylinder speed and flow', level: 1,
  short: 'A cylinder moves as fast as the oil can fill it: speed is flow divided by area, stroke time is swept volume divided by flow. Seals, ports, stopping and the springiness of the oil set the practical limits.',
  keywords: ['cylinder speed', 'stroke time', 'cycle time', 'flow', 'pump sizing', 'port velocity', 'decompression', 'prefill valve', 'dwell', 'speed limit', 'seal speed'],
  prereq: ['hydraulic-cylinder', 'flow-rate', 'area-ratio'],
  related: ['hi-lo-circuit', 'accumulator-circuits', 'regenerative-circuit', 'flow-control', 'line-sizing', 'bulk-modulus', 'cushioning', 'industrial-presses', 'pump-efficiencies'],
  body: `
Speed is the easy half of a cylinder: the piston must sweep out the oil that arrives, so $v = Q/A$ (see [[hydraulic-cylinder]]). Turned round, it sizes the pump: a 100 mm bore moving at 0.2 m/s needs $0.2 \\times 7.85\\times10^{-3} = 1.57\\times10^{-3}$ m³/s, or 94 L/min.

### Stroke time and cycle time
The time for a full stroke is the swept volume divided by the flow,

$$t = \\frac{L\\,A}{Q}$$

and a machine's **cycle** adds the other stroke and the pauses: a dwell at the end (a press holding its force), the 30–80 ms a solenoid valve needs to shift, and — for large presses — the time to **decompress** the oil before reversing. Extend, dwell and retract take

$$t_c = \\frac{L\\,(A_1 + A_2)}{Q} + t_d$$

A cylinder that works in bursts need not have a pump sized for its peak flow: an [[accumulators|accumulator]] can store oil during the pauses and give it back during the stroke ([[accumulator-circuits]]), and a [[hi-lo-circuit|hi-lo circuit]] uses a large low-pressure pump for the fast approach and a small high-pressure one for the pressing.

### What limits the speed
| Limit | Typical figure |
|---|---|
| Standard elastomer seals | up to about 0.5 m/s (1 m/s briefly) |
| Low-friction PTFE seals | 2–5 m/s |
| Stopping at the end without cushions | about 0.1 m/s |
| Oil in pressure lines and ports | 4–6 m/s |
| Oil in return lines | 2–4 m/s |
| Oil in suction lines | 0.6–1.2 m/s |
| Smooth motion (below this, stick-slip) | a few mm/s to a few cm/s, depending on the seals |

The **ports** are often the real limit. Retracting a 100/70 cylinder at 0.25 m/s with 60 L/min sends 118 L/min out of the cap port; through a 20 mm port bore that is

$$v = \\frac{4Q}{\\pi d_i^2} = 6.2 \\text{ m/s}$$

— noisy, wasteful and heating the oil ([[line-sizing]]). Fast cylinders get larger ports or two ports, and large vertical presses fill their main ram through a **prefill valve**: a big check valve that lets the ram suck oil straight from an overhead tank while it falls under its own weight, so the pump only has to supply the pressing stroke.

### Load changes the speed a little
A fixed pump delivers slightly less as the pressure rises, because its internal leakage grows ([[pump-efficiencies]]), and a cylinder leaks a little past its piston seal; a heavily loaded cylinder is therefore a few per cent slower than an unloaded one. Where the speed must not change with load, a pressure-compensated [[flow-control|flow control valve]] or a proportional valve with a pressure compensator holds it. A load that pulls instead of resisting — lowering a boom — runs ahead of the pump unless the outlet is throttled ([[meter-in-out]]) or held by a [[counterbalance-valve|counterbalance valve]].

### Decompression
Oil is springy: its bulk modulus is 1.4–1.8 GPa (less with air in it), so every 100 bar squeezes it by 0.6–0.7 %. A press whose cylinder and lines hold 200 L of oil at 300 bar has stored

$$\\Delta V = \\frac{V\\,\\Delta p}{K} = \\frac{0.2 \\times 3\\times10^7}{1.4\\times10^9} = 4.3 \\text{ L}$$

of compression, and several kilojoules of energy with it. Switching straight to "retract" lets that oil burst out of the cap end with a bang that shakes the whole machine — a decompression shock. Presses first release it through a small valve for a fraction of a second ([[bulk-modulus]]).

> [!tip] Choose the bore for the force and the flow for the speed — then check the flows that result everywhere else: the return flow ($\\varphi Q$), the port velocities, and the pump's flow at the pressure it actually works at.
`,
  ideas: [
    'v = Q/A, and the stroke time is the swept volume over the flow, t = LA/Q.',
    'A cycle adds both strokes, dwells and valve switching; accumulators or hi-lo circuits cover peak flows without a huge pump.',
    'Port and line velocities, seals and the need to stop at the end limit how fast a cylinder can usefully go.',
    'Pressure lowers the speed slightly through leakage; overrunning loads need meter-out or counterbalance control.',
    'Large volumes of oil under high pressure store energy and must be decompressed before reversing.'
  ],
  pitfalls: [
    'A bigger pump always makes the machine faster — Only if the ports, valves and lines can pass the flow; above 5–6 m/s in the ports the pressure losses and heat grow with the square of the flow.',
    'A cylinder takes the same time to extend and retract — A differential cylinder retracts φ times faster with the same flow.',
    'Reversing a press immediately saves time — The compressed oil must be released first; reversing at full pressure causes a decompression shock.'
  ],
  formulas: [
    {
      name: 'Stroke time',
      expr: 't = L*A/Q', tex: 't = \\dfrac{L\\,A}{Q}',
      vars: {
        t: { name: 'stroke time', q: 'time', unit: 's' },
        L: { name: 'stroke', q: 'length', unit: 'mm', value: 500 },
        A: { name: 'area the flow fills (A₁ out, A₂ back)', q: 'area', unit: 'cm²', value: 78.54 },
        Q: { name: 'flow into the cylinder', q: 'flowrate', unit: 'L/min', value: 60 }
      },
      practice: { unknowns: ['t', 'Q'] },
      stories: {
        t: 'A cylinder with a piston area of {A} and a stroke of {L} is fed with {Q}. How long does the stroke take?',
        Q: 'A cylinder with {A} of piston area must complete a stroke of {L} in {t}. What flow does it need?'
      }
    },
    {
      name: 'Cycle time: out, dwell and back',
      expr: 'tc = L*(A1 + A2)/Q + td', tex: 't_c = \\dfrac{L\\,(A_1 + A_2)}{Q} + t_d',
      vars: {
        tc: { name: 'cycle time', q: 'time', unit: 's', tex: 't_c' },
        L: { name: 'stroke', q: 'length', unit: 'mm', value: 500 },
        A1: { name: 'piston area', q: 'area', unit: 'cm²', value: 78.54, tex: 'A_1' },
        A2: { name: 'annulus area', q: 'area', unit: 'cm²', value: 40.06, tex: 'A_2' },
        Q: { name: 'pump flow', q: 'flowrate', unit: 'L/min', value: 60 },
        td: { name: 'dwell and valve switching time', q: 'time', unit: 's', value: 1.5, tex: 't_d' }
      },
      practice: { unknowns: ['tc', 'Q'] },
      stories: {
        tc: 'A cylinder with {A1} of piston area and {A2} of annulus makes strokes of {L} out and back with {Q}, pausing {td} in all. How long is a cycle?',
        Q: 'A machine must complete a cycle in {tc}, with {td} of dwell, using a cylinder with areas {A1} and {A2} and a stroke of {L}. What pump flow does it need?'
      }
    },
    {
      name: 'Oil velocity in a port or line',
      expr: 'v = 4*Q/(pi*di^2)', tex: 'v = \\dfrac{4Q}{\\pi d_i^2}',
      vars: {
        v: { name: 'mean oil velocity', q: 'speed', unit: 'm/s' },
        Q: { name: 'flow through the port', q: 'flowrate', unit: 'L/min', value: 60 },
        di: { name: 'inside diameter of the port or line', q: 'length', unit: 'mm', value: 16, tex: 'd_i' }
      },
      note: 'Guide values: 4–6 m/s in pressure lines, 2–4 m/s in return lines, 0.6–1.2 m/s in suction lines.',
      stories: {
        v: 'A flow of {Q} passes through a port of {di} bore. How fast is the oil moving?',
        di: 'A return line must carry {Q} at no more than {v}. What bore does it need?'
      }
    },
    {
      name: 'Decompression volume',
      expr: 'dV = V*dp/K', tex: '\\Delta V = \\dfrac{V\\,\\Delta p}{K}',
      vars: {
        dV: { name: 'oil to be released', q: 'volume', unit: 'L', tex: '\\Delta V' },
        V: { name: 'volume of oil under pressure', q: 'volume', unit: 'L', value: 200 },
        dp: { name: 'pressure to be released', q: 'pressure', unit: 'bar', value: 300, tex: '\\Delta p' },
        K: { name: 'effective bulk modulus of the oil', q: 'stress', unit: 'GPa', value: 1.4 }
      },
      note: 'Hoses and air bubbles make the effective bulk modulus lower and the volume to release larger.',
      stories: {
        dV: '{V} of oil in a press is pressurised to {dp}. With a bulk modulus of {K}, how much oil must be let out to decompress it?'
      }
    }
  ],
  examples: [
    {
      title: 'Sizing a press cycle',
      q: 'A press with a 100/70 cylinder and a 500 mm stroke must extend in 3 s. What pump flow does it need, how long does the retraction take with that flow, and what is the cycle time with a 1.5 s dwell? Check a 1-inch (25 mm bore) cap-end port.',
      steps: [
        'Extending volume: $L A_1 = 0.5 \\times 7.854\\times10^{-3} = 3.93\\times10^{-3}$ m³; in 3 s that is $1.309\\times10^{-3}$ m³/s = 78.5 L/min.',
        'Retracting: $t = L A_2/Q = 0.5 \\times 4.006\\times10^{-3}/1.309\\times10^{-3} = 1.53$ s.',
        'Cycle: $3 + 1.53 + 1.5 = 6.0$ s.',
        'Return flow while retracting: $\\varphi Q = 1.96 \\times 78.5 = 154$ L/min. In a 25 mm port: $v = 4 \\times 2.57\\times10^{-3}/(\\pi \\times 0.025^2) = 5.2$ m/s — acceptable; a 19 mm port would give 9 m/s.'
      ],
      a: 'About 79 L/min; 1.5 s to retract; a 6.0 s cycle; the 25 mm port carries 154 L/min at 5.2 m/s.'
    },
    {
      title: 'Why a big press pauses before it opens',
      q: 'A press holds 200 L of oil at 300 bar. Taking an effective bulk modulus of 1.4 GPa, how much oil must leave the cap end before the pressure is gone?',
      steps: [
        '$\\Delta V = V \\Delta p/K = 0.2 \\times 3\\times10^7/1.4\\times10^9 = 4.3\\times10^{-3}$ m³.',
        'That is 4.3 L — released in a fraction of a second if the main valve is thrown open, with a bang. A small decompression valve lets it out over 0.2–0.5 s first.'
      ],
      a: 'About 4.3 L of oil.'
    }
  ],
  quiz: [
    { q: 'The bore of a cylinder is doubled; the pump flow stays the same. The extension speed…', choices: ['halves', 'falls to a quarter', 'doubles', 'is unchanged'], a: 1,
      why: 'The area grows with the square of the bore: four times the area, a quarter of the speed (and four times the force).' },
    { q: 'How long does an 80 mm bore cylinder take to extend 600 mm with 30 L/min?', answer: 6.03, unit: 's', tol: 0.02,
      why: 'A₁ = 50.27 cm²; volume = 0.6 × 5.027×10⁻³ = 3.016 L; t = 3.016/30 min = 6.0 s.' },
    { q: 'With the same flow, a single-rod cylinder retracts faster than it extends.', a: true,
      why: 'Retracting, the flow fills only the annulus A₂, which is smaller than A₁ by the rod area.' },
    { q: 'Why do large presses release their pressure before the main valve reverses?', choices: ['to save pump power', 'the compressed oil would burst out with a shock', 'to cool the oil', 'to let the seals relax'], a: 1,
      why: 'Oil under high pressure is compressed by a few per cent; released suddenly it expands violently. A decompression valve lets it out gently first.' },
    { q: 'A cylinder must retract faster. The pump is big enough, but the cap-end oil leaves at 9 m/s through its port. What is the sensible fix?', choices: ['a bigger pump', 'a larger port or a second return path', 'a stronger rod', 'a higher relief setting'], a: 1,
      why: 'The return flow is φQ and it must get out: port and line velocities above about 5–6 m/s cost pressure, noise and heat.' }
  ],
  problems: [
    { q: 'A 63/36 cylinder with a 400 mm stroke works with 25 L/min and a total dwell of 2 s. What is its cycle time?', answer: 7.01, unit: 's', tol: 0.02,
      steps: ['$A_1 + A_2 = 31.17 + 20.99 = 52.16$ cm².', '$L(A_1 + A_2) = 0.4 \\times 5.216\\times10^{-3} = 2.086\\times10^{-3}$ m³; $Q = 4.167\\times10^{-4}$ m³/s.', '$t_c = 2.086\\times10^{-3}/4.167\\times10^{-4} + 2 = 5.01 + 2 = 7.0$ s.'] },
    { q: 'What bore must a return line have to carry 120 L/min at no more than 3 m/s?', answer: 29.1, unit: 'mm', tol: 0.02,
      steps: ['$Q = 2\\times10^{-3}$ m³/s.', '$d = \\sqrt{4Q/(\\pi v)} = \\sqrt{8\\times10^{-3}/(3\\pi)} = 0.0291$ m = 29 mm; choose the next size up.'] }
  ],
  applications: [
    'Sizing the pump of a power unit from the fastest stroke a machine must make.',
    'Press cycles: fast approach through a prefill valve, slow pressing, decompression, fast return.',
    'Injection moulding and die casting, where accumulators deliver shot speeds far beyond what the pump could supply.',
    'Mobile machines, where engine speed sets the pump flow and so every cylinder\'s speed.'
  ],
  sim: ['ref-cylinder', 'ref-hyd-circuit']
},

{
  id: 'cushioning', parent: 'cylinders', title: 'Cushioning', level: 2,
  short: 'A cushion traps oil in the last few centimetres of the stroke and lets it out through a small throttle, so the piston stops hydraulically instead of hammering the end cap. It must absorb the kinetic energy of the load and the work the pump keeps doing.',
  keywords: ['cushion', 'cushioning', 'end-of-stroke', 'deceleration', 'kinetic energy', 'cushion spear', 'needle valve', 'pressure spike', 'progressive cushion', 'impact', 'end cap'],
  prereq: ['hydraulic-cylinder', 'physics:kinetic-energy', 'orifice-equation', 'area-ratio'],
  related: ['cylinder-speed', 'proportional-valves', 'check-valves', 'water-hammer', 'hydraulic-stiffness', 'physics:work-energy-theorem', 'pneumatics:pneumatic-cushioning', 'pneumatics:kinetic-energy-limits'],
  body: `
A heavy load arriving at the end of the stroke at full speed must stop somewhere. Without help it stops against the end cap in a fraction of a millimetre: the impact hammers the piston, the cap, the tie rods and the machine, and the oil is squeezed into a pressure spike. A **cushion** stops the piston hydraulically over the last 20–40 mm instead.

### How a cushion works
Just before the end of the stroke a **cushion spear** — a collar on the rod, or a plug on the piston — enters a close-fitting bore in the head or cap. The main outlet is now cut off, and the oil trapped in the **cushion chamber** can escape only through a small adjustable **needle throttle**. Its pressure rises and brakes the piston. A **check valve** beside the needle lets oil flow freely *into* the chamber, so the next stroke starts at full force instead of waiting for the oil to trickle in through the needle. In a circuit symbol the cushion is a small rectangle inside each end of the cylinder, crossed by an arrow when it is adjustable.

### How much it must absorb
The moving mass carries kinetic energy $\\tfrac12 m v^2$. But the pump does not stop pushing when the cushion starts: as the piston slows, the pump's flow has nowhere to go, the pressure behind the piston climbs to the relief setting, and the drive force $F_d$ — that pressure on the piston, plus gravity for a load moving down, less friction and the working load — keeps pushing over the whole cushion length $s$. The cushion must absorb

$$W = \\tfrac12 m v^2 + F_d\\,s$$

and to stop the load evenly over $s$ its chamber, of area $A_c$, needs a mean pressure

$$p_c = \\frac{1}{A_c}\\left(\\frac{m v^2}{2 s} + F_d\\right)$$

Take a 63/36 cylinder ($A_1$ = 31.2 cm²) with a rod-end cushion around a 40 mm collar ($A_c$ = 18.6 cm²), moving 1500 kg at 0.4 m/s into a 25 mm cushion with the relief set at 100 bar. The kinetic energy is only 120 J, but the drive does 31.2 kN × 0.025 m = 780 J, and the mean cushion pressure is **193 bar** — nearly twice the relief setting. The drive term alone is $p_1 A_1/A_c$: the [[area-ratio]] intensification again. A rod-end cushion on a high-pressure cylinder therefore runs well above the supply pressure even with no load at all.

### The spike
A plain spear with a fixed needle does not brake evenly. The needle obeys the [[orifice-equation]]: the pressure needed to push oil through it grows with the **square** of the flow, and the flow is largest at the moment of entry, when the piston is fastest:

$$p_e = \\frac{\\rho}{2}\\left(\\frac{A_c\\,v}{C_d\\,A_o}\\right)^2$$

With the needle nearly shut this entry pressure can be many times the mean, limited in the end only by the springiness of the oil and the steel: a sharp spike, a hard deceleration, then a slow creep into the end. With the needle open too far the pressure never builds and the piston hits the cap at almost full speed. In between lies a setting that suits one load and one speed — which is why cushion needles are adjusted on the machine and readjusted when the load changes.

**Progressive** cushions shape the spear — a taper, steps or grooves — so that the escape area shrinks along the cushion: wide while the piston is fast, narrow as it slows. The pressure then stays nearly constant, the deceleration is smooth and the peak far lower. Self-adjusting cushions go further, with spring-loaded throttles that open as the pressure rises.

| Symptom | Likely cause |
|---|---|
| Bang at the end of the stroke | needle open too far; cushion too short; speed or mass beyond the cushion's rating |
| Piston stops short, then creeps into the end | needle nearly shut: high peak pressure, slow finish |
| Sluggish start of the return stroke | cushion check valve stuck or missing |
| Cushion works one day, not the next | dirt in the needle; oil much hotter or colder (viscosity) |

Above roughly 0.1 m/s most cylinders need cushions — or an outside deceleration: a [[proportional-valves|proportional valve]] ramping the flow down before the end, or a cam-operated deceleration valve. Pneumatic cylinders face the same problem at far higher speeds ([[pneumatics:pneumatic-cushioning]]).

> [!warn] The pressure in a cushion chamber can be far above the system's relief setting. Keep within the cylinder maker's permitted cushion energy, and never adjust a cushion needle with the system pressurised or the load raised: a needle screwed too far out can be blown from its thread, followed by a high-pressure jet. Lower the load, stop the pump and release the pressure first.
`,
  ideas: [
    'A cushion traps oil near the end of the stroke and meters it out through a needle, braking the piston over 20–40 mm.',
    'It must absorb the kinetic energy ½mv² plus the work of the drive force over the cushion length — often the larger part.',
    'A rod-end cushion is intensified by the area ratio: its pressure can exceed the relief setting.',
    'With a fixed needle the pressure peaks at entry (it goes with v²); progressive spears keep it nearly constant.',
    'A check valve lets the next stroke start freely; the needle is set for one load and speed.'
  ],
  pitfalls: [
    'The cushion only has to absorb the load\'s kinetic energy — The pump keeps pushing at up to the relief setting, and that drive work over the cushion length is usually larger than ½mv².',
    'The cushion pressure cannot exceed the relief setting — The trapped chamber is a separate volume; its pressure is set by the forces on the piston, and on the rod end it is multiplied by A₁/A_c.',
    'Closing the needle further always cushions better — It raises the entry spike and makes the piston crawl into the end; the right setting balances spike against impact.'
  ],
  formulas: [
    {
      name: 'Kinetic energy of the moving load',
      expr: 'E = m*v^2/2', tex: 'E = \\tfrac12 m v^2',
      vars: {
        E: { name: 'kinetic energy', q: 'energy', unit: 'J' },
        m: { name: 'moving mass (load, piston and rod)', q: 'mass', unit: 'kg', value: 1500 },
        v: { name: 'speed entering the cushion', q: 'speed', unit: 'm/s', value: 0.4 }
      },
      stories: { E: 'A mass of {m} arrives at the cushion at {v}. How much kinetic energy must be absorbed?', v: 'A cushion may absorb at most {E} of kinetic energy from a {m} load. What is the fastest the load may arrive?' }
    },
    {
      name: 'Energy the cushion must absorb',
      expr: 'W = m*v^2/2 + Fd*s', tex: 'W = \\tfrac12 m v^2 + F_d\\,s',
      vars: {
        W: { name: 'energy to absorb', q: 'energy', unit: 'J' },
        m: { name: 'moving mass', q: 'mass', unit: 'kg', value: 1500 },
        v: { name: 'speed entering the cushion', q: 'speed', unit: 'm/s', value: 0.4 },
        Fd: { name: 'drive force during cushioning (pressure × piston area, ± gravity, − load)', q: 'force', unit: 'kN', value: 31.2, signed: true, tex: 'F_d' },
        s: { name: 'cushion length', q: 'length', unit: 'mm', value: 25 }
      },
      note: 'Compare W with the energy the cylinder maker allows for that cushion and bore.',
      practice: { unknowns: ['W', 'm'] },
      stories: {
        W: 'A load of {m} enters a {s} cushion at {v} while the drive keeps pushing with {Fd}. How much energy must the cushion absorb?',
        m: 'A cushion {s} long may absorb {W}. The drive pushes with {Fd} and the load arrives at {v}. What is the largest mass it can stop?'
      }
    },
    {
      name: 'Mean cushion pressure for an even stop',
      expr: 'pc = (m*v^2/(2*s) + Fd)/Ac', tex: 'p_c = \\dfrac{1}{A_c}\\left(\\dfrac{m v^2}{2 s} + F_d\\right)',
      vars: {
        pc: { name: 'mean cushion pressure (gauge)', q: 'pressure', unit: 'bar', tex: 'p_c' },
        m: { name: 'moving mass', q: 'mass', unit: 'kg', value: 1500 },
        v: { name: 'speed entering the cushion', q: 'speed', unit: 'm/s', value: 0.4 },
        s: { name: 'cushion length', q: 'length', unit: 'mm', value: 25 },
        Fd: { name: 'drive force during cushioning', q: 'force', unit: 'kN', value: 31.2, signed: true, tex: 'F_d' },
        Ac: { name: 'cushion chamber area', q: 'area', unit: 'cm²', value: 18.6, tex: 'A_c' }
      },
      note: 'Uniform deceleration a = v²/2s. A plain spear with a fixed needle peaks well above this mean.',
      practice: { unknowns: ['pc', 'v'] },
      stories: {
        pc: 'A load of {m} enters a {s} cushion at {v}; the drive pushes with {Fd} and the cushion chamber has an area of {Ac}. What mean pressure must the cushion hold?',
        v: 'A cushion of area {Ac} and length {s} may hold a mean of {pc}. With {m} moving and {Fd} of drive, how fast may the load arrive?'
      }
    },
    {
      name: 'Entry pressure with a fixed throttle',
      expr: 'pe = rho/2*(Ac*v/(Cd*Ao))^2', tex: 'p_e = \\dfrac{\\rho}{2}\\left(\\dfrac{A_c\\,v}{C_d\\,A_o}\\right)^2',
      vars: {
        pe: { name: 'pressure needed to pass the flow at entry (gauge)', q: 'pressure', unit: 'bar', tex: 'p_e' },
        rho: { name: 'oil density', q: 'density', unit: 'kg/m³', value: 870 },
        Ac: { name: 'cushion chamber area', q: 'area', unit: 'cm²', value: 18.6, tex: 'A_c' },
        v: { name: 'speed at entry', q: 'speed', unit: 'm/s', value: 0.4 },
        Cd: { name: 'discharge coefficient', value: 0.62, tex: 'C_d' },
        Ao: { name: 'needle opening', q: 'area', unit: 'mm²', value: 6, tex: 'A_o' }
      },
      note: 'The quasi-steady orifice law: if this is far above the mean pressure the piston is snatched to a lower speed at once (a spike); if far below, the cushion barely brakes.',
      practice: { unknowns: ['pe', 'Ao'] },
      stories: {
        pe: 'A piston enters a cushion of area {Ac} at {v}; the oil escapes through a needle opening of {Ao}. What pressure does it take to push that flow through?',
        Ao: 'A cushion of area {Ac} is entered at {v}. What needle opening keeps the entry pressure to {pe}?'
      }
    }
  ],
  examples: [
    {
      title: 'Where the energy comes from',
      q: 'A 63/36 cylinder moves a 1500 kg slide at 0.4 m/s into a 25 mm rod-end cushion (chamber area 18.6 cm²). The relief valve is at 100 bar. How much energy must the cushion absorb, and what mean pressure does it need?',
      steps: [
        'Kinetic energy: $\\tfrac12 \\times 1500 \\times 0.4^2 = 120$ J.',
        'Drive force as the pump pressure rises to the relief setting: $F_d = 10^7 \\times 3.117\\times10^{-3} = 31.2$ kN; its work over 25 mm: $31.2\\times10^3 \\times 0.025 = 780$ J.',
        'Total: $W = 900$ J — the pump, not the load, supplies 87 % of it.',
        'Mean pressure: $p_c = (1500 \\times 0.16/0.05 + 31\\,200)/1.86\\times10^{-3} = (4800 + 31\\,200)/1.86\\times10^{-3} = 1.94\\times10^7$ Pa = 193 bar.'
      ],
      a: '900 J, needing a mean cushion pressure of about 193 bar.'
    },
    {
      title: 'Setting the needle',
      q: 'For the same cushion entered at 0.4 m/s, what pressure is needed at entry to push the oil through a needle opening of 6 mm², and of 3 mm² ($C_d$ = 0.62, ρ = 870 kg/m³)?',
      steps: [
        'Flow at entry: $A_c v = 1.86\\times10^{-3} \\times 0.4 = 7.44\\times10^{-4}$ m³/s (45 L/min).',
        '6 mm²: jet velocity $7.44\\times10^{-4}/(0.62 \\times 6\\times10^{-6}) = 200$ m/s; $p_e = 435 \\times 200^2 = 1.74\\times10^7$ Pa = 174 bar — close to the 193 bar mean: a fairly even stop.',
        '3 mm²: twice the jet velocity, four times the pressure: 696 bar. The oil cannot pass, so the piston is snatched to a crawl with a spike far above any rating, then creeps into the end.'
      ],
      a: 'About 174 bar with 6 mm² (reasonable); about 700 bar with 3 mm² (a violent spike).'
    }
  ],
  quiz: [
    { q: 'A cylinder cushions a light load while the pump keeps pushing at the relief setting. Most of the energy the cushion absorbs comes from…', choices: ['the load\'s kinetic energy', 'the pump, through the drive force over the cushion length', 'the oil\'s compressibility', 'friction in the seals'], a: 1,
      why: 'W = ½mv² + F_d·s. With a light load, F_d·s — the pump pushing at relief pressure through the cushion — dominates.' },
    { q: 'A cushion needle is screwed almost shut. What happens at the end of each stroke?', choices: ['the piston stops gently', 'a pressure spike, then a slow creep into the end', 'the piston hits the cap at full speed', 'nothing changes'], a: 1,
      why: 'The oil cannot escape fast enough at entry speed, so the pressure spikes and the piston is braked hard; it then creeps the rest of the way at the small flow the needle passes.' },
    { q: 'The pressure in a rod-end cushion chamber can be higher than the relief-valve setting.', a: true,
      why: 'The trapped chamber is not connected to the relief valve. Balancing the drive force p₁A₁ alone already needs p₁A₁/A_c, which is above p₁.' },
    { q: 'What is the kinetic energy of an 800 kg load moving at 0.5 m/s?', answer: 100, unit: 'J', tol: 0.02,
      why: '½ × 800 × 0.5² = 100 J.' },
    { q: 'With a fixed cushion needle, the entry speed is doubled. The entry pressure…', choices: ['doubles', 'rises four times', 'stays the same', 'halves'], a: 1,
      why: 'Flow is proportional to speed, and the orifice pressure drop to the square of the flow: twice the speed, four times the pressure.' }
  ],
  problems: [
    { q: 'A 2000 kg load moving at 0.5 m/s is to stop evenly in a 30 mm cushion whose chamber area is 18.6 cm²; the drive force during cushioning is 25 kN. What mean cushion pressure is needed?', answer: 179, unit: 'bar', tol: 0.02,
      steps: ['Deceleration force: $m v^2/(2s) = 2000 \\times 0.25/0.06 = 8333$ N.', '$p_c = (8333 + 25\\,000)/1.86\\times10^{-3} = 1.79\\times10^7$ Pa = 179 bar.'] }
  ],
  applications: [
    'Press and injection-moulding clamps that close large platens quickly and must not slam.',
    'Excavator and loader boom cylinders, which cushion the ends of their strokes to protect the machine and the operator.',
    'Steel-mill and foundry cylinders moving heavy doors and ladles.',
    'Ship hatch covers and bridge spans, where tonnes move and must stop softly.'
  ],
  sim: 'act-cushion'
},

{
  id: 'rod-buckling', parent: 'cylinders', title: 'Rod buckling', level: 3,
  short: 'A long cylinder rod pushing a load is a slender column: above a critical load it bows sideways and collapses. Euler\'s formula gives that load from the rod\'s stiffness, its diameter to the fourth power and the square of its buckling length, which the mounting decides.',
  keywords: ['buckling', 'Euler', 'critical load', 'buckling length', 'end fixity', 'Euler cases', 'slenderness ratio', 'second moment of area', 'safety factor', 'Tetmajer', 'Johnson', 'ISO/TS 13725', 'stroke', 'rod diameter'],
  prereq: ['hydraulic-cylinder', 'physics:elasticity', 'physics:stress-strain'],
  related: ['mounting-side-load', 'cylinder-types', 'area-ratio', 'relief-valve', 'mobile-hydraulics', 'physics:static-equilibrium', 'math:second-order-odes'],
  body: `
Push on the end of a long, thin rod and at first it only shortens a little. At a certain load it suddenly bows sideways and folds — it **buckles**. That load depends not on the strength of the steel but on its **stiffness** and on how slender the rod is, and a cylinder rod pushing a load at the end of a long stroke is exactly such a column.

### Euler's formula
For a slender, straight, centrally loaded column Euler found the critical load

$$F_k = \\frac{\\pi^2 E\\,I}{L_k^2}, \\qquad I = \\frac{\\pi d^4}{64} \\text{ for a solid rod}$$

where $E$ is Young's modulus (210 GPa for steel), $I$ the second moment of area of the rod's section and $L_k$ the **buckling length**. Two things jump out. The load falls with the **square of the length**: double the stroke, a quarter of the load. And it rises with the **fourth power of the diameter**: a rod only 19 % thicker carries twice as much. The yield strength of the steel does not appear at all — a high-strength steel rod buckles at the same load as a mild-steel one ([[physics:elasticity]]).

### The mounting sets the buckling length
How the two ends are held decides the shape the rod bends into, and so its buckling length $L_k = K\\,L$:

| Euler case | Ends | $K$ | Typical cylinder arrangement |
|---|---|---|---|
| 1 | fixed – free | 2 | flange or foot mounting, rod end free and unguided |
| 2 | pinned – pinned | 1 | rear clevis or trunnion with a rod eye (the most common) |
| 3 | fixed – pinned | 0.7 | flange mounting, rod end pinned and guided |
| 4 | fixed – fixed | 0.5 | flange mounting, rod end rigidly fixed and guided |

For a pinned cylinder $L$ is the pin-to-pin length at **full extension**; for a flange-mounted one it is measured from the flange to the load. Case 1 is four times weaker than case 2 at the same length and sixteen times weaker than case 4, which is why a free, unguided rod end is avoided on long strokes. Mountings are covered in [[mounting-side-load]].

### A safety factor, and short rods
Real rods are never perfectly straight, loads never exactly central; pins and guides have play, and the barrel bends too. Cylinder makers therefore allow only a fraction of the Euler load, with a **safety factor** $S$ of about 3.5 (2.5–4 in practice):

$$F_\\text{perm} = \\frac{F_k}{S} = \\frac{\\pi^3 E\\,d^4}{64\\,S\\,L_k^2}$$

ISO/TS 13725 (first published in 2001) describes a fuller method: it treats the cylinder as a stepped column — a stiff barrel and a slimmer rod — includes the clearances of the piston and rod guides, the tilt they allow and the cylinder's own weight, and usually gives a lower buckling load than Euler on the rod alone.

Euler's formula holds only for **slender** rods. The slenderness ratio is

$$\\lambda = \\frac{L_k}{i} = \\frac{4 L_k}{d}$$

with the radius of gyration $i = d/4$ for a solid rod. Below $\\lambda \\approx$ 90–110 for common rod steels the rod would yield before it could buckle elastically, and Euler overestimates what it can carry. There European practice uses Tetmajer's straight-line formula and American practice **Johnson's parabola**, which both fall towards the plain compressive yield load $\\sigma_y\\,\\pi d^2/4$ for very short rods:

$$F_J = \\frac{\\pi d^2}{4}\\left(\\sigma_y - \\frac{1}{E}\\left(\\frac{\\sigma_y\\,\\lambda}{2\\pi}\\right)^2\\right) \\quad\\text{for } \\lambda < \\pi\\sqrt{2E/\\sigma_y}$$

### Checking a design
1. Take the **largest** push, not the working load: relief pressure × piston area. A cylinder that stalls pushes as hard as the relief valve allows.
2. Find $L$ at full extension from the mounting, and $L_k = K L$.
3. Compute $F_k$, divide by $S$, and compare with the push; check $\\lambda$ to see whether Euler applies.
4. If it fails: a thicker rod, a shorter stroke, a stiffer mounting (guide the rod end), or a lower relief setting.

The [cylinder calculator](#/tools/fpower/cylinder) runs this check for a steel rod with any mounting case.

> [!warn] A buckling rod gives no warning: it collapses and releases its load at once. Never replace a rod with a thinner one, or a guided mounting with a free one, without rechecking buckling — and remember that a rod bent by a side load buckles at a lower load still.
`,
  ideas: [
    'Euler: F_k = π²EI/L_k², with I = πd⁴/64 for a solid rod.',
    'Double the buckling length, a quarter of the load; a rod 19 % thicker carries twice as much.',
    'The mounting sets L_k = K·L: K = 2 fixed–free, 1 pinned–pinned, 0.7 fixed–pinned, 0.5 fixed–fixed.',
    'Allow about F_k/3.5, and check against the relief pressure × piston area, not the working load.',
    'Below a slenderness of about 90–110 the rod yields first: use Tetmajer or Johnson instead of Euler.'
  ],
  pitfalls: [
    'A stronger (higher-yield) steel stops a slender rod buckling — Elastic buckling depends on Young\'s modulus, which is the same for all steels; only a thicker rod, a shorter length or a better mounting help.',
    'The buckling check uses the working load — A cylinder can push up to the relief pressure times its piston area whenever it stalls; that is the load to check.',
    'The stroke is the buckling length — For a pinned cylinder it is the whole pin-to-pin length at full extension, roughly twice the stroke plus the cylinder\'s dead length.'
  ],
  formulas: [
    {
      name: 'Euler buckling load of a solid rod',
      expr: 'Fk = pi^3*E*d^4/(64*Lk^2)', tex: 'F_k = \\dfrac{\\pi^2 E\\,I}{L_k^2} = \\dfrac{\\pi^3 E\\,d^4}{64\\,L_k^2}',
      vars: {
        Fk: { name: 'critical (buckling) load', q: 'force', unit: 'kN', tex: 'F_k' },
        E: { name: 'Young\'s modulus of the rod', q: 'stress', unit: 'GPa', value: 210 },
        d: { name: 'rod diameter', q: 'length', unit: 'mm', value: 36 },
        Lk: { name: 'buckling length', q: 'length', unit: 'mm', value: 1250, tex: 'L_k' }
      },
      note: 'Valid for slender rods (λ = 4L_k/d above about 100 for rod steels).',
      practice: { unknowns: ['Fk', 'd', 'Lk'] },
      stories: {
        Fk: 'A steel rod of {d} diameter (E = {E}) has a buckling length of {Lk}. At what load does it buckle?',
        d: 'A rod with a buckling length of {Lk} must not buckle below {Fk}. What diameter does it need (E = {E})?',
        Lk: 'A {d} steel rod (E = {E}) must carry {Fk} before buckling. What is the longest buckling length allowed?'
      }
    },
    {
      name: 'Buckling length',
      expr: 'Lk = K*L', tex: 'L_k = K\\,L',
      vars: {
        Lk: { name: 'buckling length', q: 'length', unit: 'mm', tex: 'L_k' },
        K: { name: 'end-fixity factor (2, 1, 0.7 or 0.5)', value: 1 },
        L: { name: 'length at full extension (pin to pin, or flange to load)', q: 'length', unit: 'mm', value: 1250 }
      },
      stories: { Lk: 'A cylinder whose mounting gives an end-fixity factor of {K} is {L} long at full extension. What is its buckling length?' }
    },
    {
      name: 'Permissible push with a safety factor',
      expr: 'F = pi^3*E*d^4/(64*S*Lk^2)', tex: 'F_\\text{perm} = \\dfrac{\\pi^3 E\\,d^4}{64\\,S\\,L_k^2}',
      vars: {
        F: { name: 'permissible push', q: 'force', unit: 'kN', tex: 'F_\\text{perm}' },
        E: { name: 'Young\'s modulus of the rod', q: 'stress', unit: 'GPa', value: 210 },
        d: { name: 'rod diameter', q: 'length', unit: 'mm', value: 36 },
        S: { name: 'safety factor', value: 3.5 },
        Lk: { name: 'buckling length', q: 'length', unit: 'mm', value: 1250, tex: 'L_k' }
      },
      note: 'Solve for d to find the smallest rod for a given push (relief pressure × piston area) and buckling length.',
      practice: { unknowns: ['F', 'd'] },
      stories: {
        F: 'A {d} steel rod (E = {E}) has a buckling length of {Lk}. With a safety factor of {S}, what push may it carry?',
        d: 'A cylinder can push {F} at its relief setting and has a buckling length of {Lk}. With a safety factor of {S}, what is the smallest steel rod (E = {E}) it may have?'
      }
    },
    {
      name: 'Slenderness ratio of a solid rod',
      expr: 'lam = 4*Lk/d', tex: '\\lambda = \\dfrac{L_k}{i} = \\dfrac{4 L_k}{d}',
      vars: {
        lam: { name: 'slenderness ratio', tex: '\\lambda' },
        Lk: { name: 'buckling length', q: 'length', unit: 'mm', value: 1250, tex: 'L_k' },
        d: { name: 'rod diameter', q: 'length', unit: 'mm', value: 36 }
      },
      stories: { lam: 'A {d} rod has a buckling length of {Lk}. What is its slenderness ratio — does Euler\'s formula apply?' }
    },
    {
      name: 'Short rods: Johnson\'s parabola',
      expr: 'Fj = pi*d^2/4*(sy - (sy*lam/(2*pi))^2/E)', tex: 'F_J = \\dfrac{\\pi d^2}{4}\\left(\\sigma_y - \\dfrac{1}{E}\\left(\\dfrac{\\sigma_y\\,\\lambda}{2\\pi}\\right)^2\\right)',
      vars: {
        Fj: { name: 'critical load (inelastic buckling)', q: 'force', unit: 'kN', tex: 'F_J' },
        d: { name: 'rod diameter', q: 'length', unit: 'mm', value: 50 },
        sy: { name: 'yield strength of the rod', q: 'stress', unit: 'MPa', value: 355, min: 100, max: 1500, tex: '\\sigma_y' },
        lam: { name: 'slenderness ratio', value: 64, tex: '\\lambda' },
        E: { name: 'Young\'s modulus', q: 'stress', unit: 'GPa', value: 210 }
      },
      note: 'For λ below π√(2E/σ_y), about 108 for σ_y = 355 MPa; above it use Euler. At λ = 0 it gives the yield load σ_y·πd²/4.',
      practice: { unknowns: ['Fj'] },
      stories: { Fj: 'A {d} rod of steel with a yield strength of {sy} has a slenderness ratio of {lam}. Estimate its buckling load by Johnson\'s parabola (E = {E}).' }
    }
  ],
  examples: [
    {
      title: 'Is the rod thick enough?',
      q: 'A 63/36 cylinder with rear clevis and rod eye (Euler case 2) is 1250 mm pin to pin at full extension. The relief is set at 160 bar. Check buckling with a safety factor of 3.5.',
      steps: [
        'Largest push: $1.6\\times10^7 \\times 3.117\\times10^{-3} = 49.9$ kN.',
        '$I = \\pi \\times 0.036^4/64 = 8.24\\times10^{-8}$ m⁴; $L_k = L = 1.25$ m.',
        '$F_k = \\pi^2 \\times 2.1\\times10^{11} \\times 8.24\\times10^{-8}/1.25^2 = 109$ kN; permitted $109/3.5 = 31.2$ kN — less than 49.9 kN. It fails.',
        'Smallest rod: $d = (64 S F L_k^2/\\pi^3 E)^{1/4} = 40.5$ mm, so the next standard rod, 45 mm: $F_k = 267$ kN, permitted 76 kN. It passes.',
        'Slenderness with 45 mm: $\\lambda = 4 \\times 1250/45 = 111$ — just in Euler\'s range.'
      ],
      a: 'The 36 mm rod is too slender (31 kN allowed against 50 kN); a 45 mm rod passes with 76 kN allowed.'
    },
    {
      title: 'Guiding the rod end',
      q: 'A front-flange cylinder with a 40 mm rod is 600 mm from flange to load at full extension. Compare a free rod end (case 1) with a pinned, guided one (case 3), for a steel of 355 MPa yield.',
      steps: [
        'Case 1: $L_k = 2 \\times 600 = 1200$ mm, $\\lambda = 4 \\times 1200/40 = 120$ — Euler applies: $F_k = \\pi^3 \\times 2.1\\times10^{11} \\times 0.04^4/(64 \\times 1.2^2) = 181$ kN, permitted 52 kN.',
        'Case 3: $L_k = 0.7 \\times 600 = 420$ mm, $\\lambda = 42$ — far below the transition (108), so Euler (1476 kN) would be wildly optimistic.',
        'Johnson: $F_J = 1.257\\times10^{-3} \\times (3.55\\times10^8 - (3.55\\times10^8 \\times 42/2\\pi)^2/2.1\\times10^{11}) = 412$ kN, close to the yield load of 446 kN.',
        'Guiding the rod end multiplies the capacity by more than two — the rod is now limited by its strength, not its stiffness.'
      ],
      a: 'Free end: 181 kN critical (52 kN allowed). Guided and pinned: about 412 kN, set by yielding rather than elastic buckling.'
    }
  ],
  quiz: [
    { q: 'A cylinder\'s buckling length is doubled (a longer stroke). Its Euler buckling load…', choices: ['halves', 'falls to a quarter', 'is unchanged', 'falls to an eighth'], a: 1,
      why: 'F_k ∝ 1/L_k²: twice the length gives a quarter of the load.' },
    { q: 'Which rod carries about twice the buckling load of a 50 mm rod of the same length?', choices: ['a 60 mm rod', 'a 71 mm rod', 'a 100 mm rod', 'a 50 mm rod of stronger steel'], a: 0,
      why: 'F_k ∝ d⁴, so doubling it needs d × 2^¼ = 50 × 1.19 = 59.5 mm. A stronger steel changes nothing: E is the same.' },
    { q: 'For the same rod and length, which mounting is the most likely to buckle?', choices: ['fixed flange, rod end free', 'clevis and rod eye', 'fixed flange, rod end pinned and guided', 'fixed flange, rod end fixed and guided'], a: 0,
      why: 'Fixed–free has K = 2, a buckling length twice the real length, and so a quarter of the pinned–pinned load.' },
    { q: 'Replacing a slender cylinder rod with one of the same size in a higher-yield steel raises its Euler buckling load.', a: false,
      why: 'Elastic buckling depends on the modulus E, which hardly differs between steels. Only for short, stocky rods (small λ) does the yield strength matter.' },
    { q: 'What is the Euler buckling load of a 50 mm steel rod (E = 210 GPa) with a buckling length of 2 m?', answer: 159, unit: 'kN', tol: 0.02,
      why: 'I = π × 0.05⁴/64 = 3.07×10⁻⁷ m⁴; F_k = π² × 2.1×10¹¹ × 3.07×10⁻⁷/4 = 1.59×10⁵ N.' }
  ],
  problems: [
    { q: 'A pinned–pinned cylinder is 2.0 m pin to pin at full extension and can push 80 kN at its relief setting. With a safety factor of 3.5, what is the smallest steel rod (E = 210 GPa)?', answer: 57.6, unit: 'mm', tol: 0.02,
      steps: ['$F_k$ needed: $3.5 \\times 80 = 280$ kN.', '$d^4 = 64 F_k L_k^2/(\\pi^3 E) = 64 \\times 2.8\\times10^5 \\times 4/(31.0 \\times 2.1\\times10^{11}) = 1.101\\times10^{-5}$ m⁴.', '$d = 0.0576$ m = 57.6 mm: choose a 63 mm rod.'] },
    { q: 'What is the slenderness ratio of a 45 mm rod with a buckling length of 1.8 m?', answer: 160, tol: 0.01,
      steps: ['$\\lambda = 4 L_k/d = 4 \\times 1800/45 = 160$ — well within Euler\'s range.'] }
  ],
  applications: [
    'Long-stroke cylinders on tippers, loaders, aerial platforms and forestry cranes, where the rod pushes at full extension.',
    'Presses and injection-moulding machines with guided rod ends, where the guide lets a slim rod carry a large force.',
    'Hydraulic jacks and props, whose extension length is limited by buckling rather than by pressure.',
    'The buckling check built into cylinder makers\' selection software and the fluid-power calculators.'
  ],
  history: 'Leonhard Euler derived the buckling load of an elastic column in 1744. Engineers soon found it far too optimistic for short, stocky struts; in the 1880s–90s Ludwig von Tetmajer in Zürich fitted a straight line to hundreds of tests, and J. B. Johnson proposed his parabola in 1893. Both are still used for the short range where Euler fails.',
  sim: 'act-buckling'
},

{
  id: 'seals', parent: 'cylinders', title: 'Seals and leakage', level: 2,
  short: 'Wipers keep dirt out, rod and piston seals keep oil in and the chambers apart, guide rings carry side loads. Their material must suit the fluid and temperature; their friction decides how smoothly a cylinder can move, and their leakage how long it can hold a load.',
  keywords: ['seal', 'rod seal', 'piston seal', 'wiper', 'scraper', 'guide ring', 'wear band', 'O-ring', 'back-up ring', 'NBR', 'FKM', 'PU', 'polyurethane', 'PTFE', 'EPDM', 'friction', 'stick-slip', 'leakage', 'drift', 'extrusion'],
  prereq: ['hydraulic-cylinder', 'physics:friction', 'viscosity'],
  related: ['contamination', 'fluid-selection', 'fire-resistant-fluids', 'pilot-check', 'load-holding', 'mounting-side-load', 'troubleshooting', 'pneumatics:stick-slip', 'laminar-pipe-flow'],
  body: `
A cylinder is only as good as the few grams of polymer that keep its oil in and its dirt out. Every cylinder carries a small family of seals, each with its own job.

| Part | Where | Job |
|---|---|---|
| **Wiper** (scraper) | outermost, in the head | scrapes dust, mud and water off the rod as it retracts — the main barrier against [[contamination]] |
| **Rod seal** | in the head, inside the wiper | holds the pressure around the moving rod; often a buffer seal and a main seal in tandem |
| **Guide rings** (wear bands) | on the piston and in the head | carry side loads, so metal never rubs on metal |
| **Piston seal** | on the piston | separates the two chambers, in both directions on a double-acting cylinder |
| **Static seals** | between barrel, head and cap | O-rings, with back-up rings at high pressure |

A **rod seal** is meant to be **dry**. On the outstroke the rod carries a microscopic film of oil out through the seal — it lubricates the wiper and protects the rod — and on the instroke the seal must drag that film back in. Its lip is shaped so the film it lets back is at least as thick as the film it lets out. A seal that fails this test weeps a little oil every stroke, and the oily rod collects dust that the wiper then has to fight.

### Materials
| Material | Typical temperature | Suits | Avoid |
|---|---|---|---|
| NBR (nitrile rubber) | −30 to +100 °C | mineral oils, water–glycol | phosphate esters, ozone, heat |
| HNBR | −25 to +150 °C | mineral oils, many biodegradable fluids | phosphate esters |
| FKM (fluoroelastomer) | −20 to +200 °C | mineral oils, synthetic esters, phosphate esters, heat | hot water, cold |
| PU (polyurethane) | −35 to +110 °C | mineral oils; tough, wear- and extrusion-resistant | hot water-based fluids (it hydrolyses) |
| PTFE (filled with bronze, glass or carbon) | −200 to +260 °C | nearly every fluid; very low friction | must be energised by an elastomer ring; creeps |
| EPDM | −45 to +150 °C | phosphate esters, water, glycol brake fluid | **mineral oil** — it swells and fails |

The last line catches people out: brake fluid based on glycols needs EPDM seals; a drop of mineral oil ruins them, and a mineral-oil seal fails in brake fluid. Always check a seal against the fluid ([[fluid-selection]], [[fire-resistant-fluids]]).

### Friction and stick-slip
A seal is pressed against its sliding surface by its own preload and by the pressure it seals, so its friction grows with pressure — roughly $F_f \\approx \\mu\\,\\pi d\\,b\\,p$ for a lip with contact width $b$. The seals of a working cylinder typically take 2–5 % of its force; its mechanical efficiency is 90–97 %.

Friction at rest (**breakaway**) is higher than friction in motion, and at very low speed friction falls as speed rises. Add the springiness of the oil and you get **stick-slip**: the piston sticks, pressure builds and compresses the oil, the seal breaks free, friction drops, the piston lunges, the pressure falls and it sticks again — a jerky crawl at speeds below a few centimetres per second. The cures: low-friction PTFE seals, less trapped oil (short hoses, stiff tubes), meter-out control that holds the piston between two columns of oil, and clean, well-finished rods ([[pneumatics:stick-slip]]).

### Leakage, outside and inside
**External** leakage past the rod seal is a fault: it wastes oil, pollutes, and brings dirt in. **Internal** leakage past the piston seal slows the cylinder and lets a held load drift. Elastomer piston seals are practically leak-tight when new; PTFE compact seals and metal piston rings leak a little by design. A seal-less servo cylinder leaks through the clearance between piston and bore — a thin laminar film, like [[laminar-pipe-flow|Hagen–Poiseuille flow]] unrolled into a slit:

$$Q = \\frac{\\pi d\\,h^3\\,\\Delta p}{12\\,\\eta\\,L}$$

(up to 2.5 times more if the piston lies against one side). A 63 mm piston with a 10 µm gap 30 mm long leaks about 8 mL/min at 100 bar in VG 46 oil at 40 °C; double the gap and it leaks eight times as much.

Often it is not the cylinder that lets a load sink but the directional valve holding it: a spool valve leaks through its clearance even when centred. Loads that must stay put are held by poppet-type [[pilot-check|pilot-operated check valves]] or [[counterbalance-valve|counterbalance valves]] mounted on the cylinder itself ([[load-holding]]). And a cylinder can drift with every seal perfect, simply because the trapped oil cools and shrinks ([[troubleshooting]]).

### Surfaces and gaps
Seals live or die by what they slide on. Rods are usually induction-hardened, hard-chrome plated, ground and polished to about Ra 0.1–0.3 µm — smooth enough not to cut the seal, rough enough to hold a lubricating film. Under pressure an elastomer is squeezed into the gap between the moving parts; above about 200 bar it needs gaps of a few hundredths of a millimetre, or a harder **back-up ring** of PTFE or polyamide, to stop it extruding and nibbling away. A scored rod, a dented barrel or a guide worn by [[mounting-side-load|side loads]] destroys new seals in hours.

> [!warn] Before replacing seals: lower or support the load, stop and lock out the pump, and release the pressure in both chambers and in any accumulator. Never search for a leaking seal with your hand — oil from a pinhole can be injected through the skin, an injury that needs emergency surgery. Use a piece of card.
`,
  ideas: [
    'Wiper out front, rod seal behind it, guide rings for side loads, a piston seal between the chambers, O-rings where nothing moves.',
    'The seal material must suit the fluid and temperature: NBR for mineral oil, FKM for heat and esters, EPDM for phosphate esters and brake fluid — never mineral oil.',
    'Seal friction grows with pressure and takes 2–5 % of the force; breakaway friction above running friction causes stick-slip at low speed.',
    'Clearance leakage grows with the cube of the gap; a held load drifts through the valve spool as often as through the piston seal.',
    'Rod finish, hardness and the extrusion gap matter as much as the seal itself.'
  ],
  pitfalls: [
    'A seal that fits the groove will suit any fluid — The material must be compatible: EPDM swells in mineral oil, PU hydrolyses in hot water-based fluids, NBR is attacked by phosphate esters.',
    'Doubling a clearance doubles the leakage — Laminar leakage goes with the cube of the gap: double the gap, eight times the leakage.',
    'A drifting cylinder always has a worn piston seal — The directional valve\'s spool leaks too, and cooling oil contracts; test before you strip the cylinder.'
  ],
  formulas: [
    {
      name: 'Friction of a pressure-energised seal (estimate)',
      expr: 'Ff = mu*pi*d*b*p', tex: 'F_f \\approx \\mu\\,\\pi d\\,b\\,p',
      vars: {
        Ff: { name: 'friction force', q: 'force', unit: 'N', tex: 'F_f' },
        mu: { name: 'friction coefficient (lubricated elastomer on steel)', value: 0.05, tex: '\\mu' },
        d: { name: 'sliding diameter', q: 'length', unit: 'mm', value: 36 },
        b: { name: 'contact width of the lip', q: 'length', unit: 'mm', value: 2 },
        p: { name: 'pressure sealed (gauge)', q: 'pressure', unit: 'bar', value: 160 }
      },
      note: 'A rough model: add a preload term at low pressure, and expect breakaway friction to be one and a half to three times the running value. PTFE seals have μ about half that of elastomers.',
      stories: { Ff: 'A rod seal on a {d} rod has a contact width of {b} and seals {p}. With a friction coefficient of {mu}, estimate its friction.' }
    },
    {
      name: 'Leakage through an annular clearance (laminar, concentric)',
      expr: 'Q = pi*d*h^3*dp/(12*eta*L)', tex: 'Q = \\dfrac{\\pi d\\,h^3\\,\\Delta p}{12\\,\\eta\\,L}',
      vars: {
        Q: { name: 'leakage flow', q: 'flowrate', unit: 'cm³/min' },
        d: { name: 'diameter of the gap', q: 'length', unit: 'mm', value: 63 },
        h: { name: 'radial clearance', q: 'length', unit: 'µm', value: 10 },
        dp: { name: 'pressure difference across the gap', q: 'pressure', unit: 'bar', value: 100, tex: '\\Delta p' },
        eta: { name: 'dynamic viscosity of the oil', q: 'viscosity', unit: 'mPa·s', value: 40, tex: '\\eta' },
        L: { name: 'length of the gap', q: 'length', unit: 'mm', value: 30 }
      },
      note: 'Multiply by up to 2.5 for a fully eccentric piston. Viscosity falls steeply with temperature, so a hot system leaks much more.',
      practice: { unknowns: ['Q', 'h'] },
      stories: {
        Q: 'A {d} piston without seals has a radial clearance of {h} over a length of {L}. How much oil leaks past it at {dp} with oil of viscosity {eta}?',
        h: 'A {d} servo piston {L} long may leak at most {Q} at {dp} with oil of {eta}. What radial clearance is allowed?'
      }
    }
  ],
  examples: [
    {
      title: 'How much force do the seals take?',
      q: 'Estimate the friction of the rod seal (36 mm) and the piston seal (63 mm) of a 63/36 cylinder working at 160 bar, each with a 2 mm contact width and μ = 0.05. Compare it with the cylinder\'s push.',
      steps: [
        'Rod seal: $0.05 \\times \\pi \\times 0.036 \\times 0.002 \\times 1.6\\times10^7 = 181$ N.',
        'Piston seal: $0.05 \\times \\pi \\times 0.063 \\times 0.002 \\times 1.6\\times10^7 = 317$ N.',
        'With a wiper and guide rings, about 0.6 kN in all, against a push of 49.9 kN: roughly 1 %. Breakaway friction may be two or three times as much, which is what the pressure must overcome to start the cylinder moving.'
      ],
      a: 'About 0.5–0.6 kN running (about 1 % of the push), more at breakaway.'
    },
    {
      title: 'A servo cylinder that drifts',
      q: 'A seal-less 63 mm servo piston has a radial clearance of 10 µm over 30 mm and holds a load with 100 bar across it (oil: 40 mPa·s). How much does it leak, and how fast does the load sink if nothing else holds it?',
      steps: [
        '$Q = \\pi \\times 0.063 \\times (10^{-5})^3 \\times 10^7/(12 \\times 0.04 \\times 0.03) = 1.37\\times10^{-7}$ m³/s = 8.2 cm³/min.',
        'Drift on the 31.2 cm² piston: $1.37\\times10^{-7}/3.117\\times10^{-3} = 4.4\\times10^{-5}$ m/s, about 2.6 mm per minute.',
        'A servo system corrects this continuously; a load that must stand still with the power off needs a valve that seals by a poppet.'
      ],
      a: 'About 8 cm³/min, letting the load sink about 2.6 mm a minute.'
    }
  ],
  quiz: [
    { q: 'Which seal is the main barrier against dirt getting into a cylinder?', choices: ['the piston seal', 'the wiper', 'the static O-ring', 'the guide ring'], a: 1,
      why: 'The wiper (scraper) at the outside of the head cleans the rod as it retracts, before dirt can reach the rod seal and the oil.' },
    { q: 'A cylinder sealed with EPDM is filled with mineral hydraulic oil. What happens?', choices: ['nothing, EPDM suits all oils', 'the seals swell and fail', 'the seals harden and crack in the cold', 'friction falls'], a: 1,
      why: 'EPDM is for phosphate esters, water and glycol brake fluids; mineral oil swells it and it loses its strength.' },
    { q: 'Stick-slip happens because…', choices: ['the oil is too thin', 'breakaway friction exceeds running friction, and the oil is springy', 'the pump pulsates', 'the rod is too thick'], a: 1,
      why: 'Pressure builds while the seal sticks, it breaks free, friction drops, the piston lunges and the pressure collapses — a cycle made possible by static friction above dynamic friction and the oil\'s compressibility.' },
    { q: 'Doubling the radial clearance of a sealless piston doubles its leakage.', a: false,
      why: 'Laminar leakage through a narrow gap is proportional to h³: twice the gap gives eight times the leakage.' },
    { q: 'What carries side loads inside a cylinder so that metal does not rub on metal?', choices: ['the rod seal', 'the guide rings (wear bands)', 'the wiper', 'the oil film alone'], a: 1,
      why: 'Guide rings on the piston and in the head are bearings; seals are not designed to take side loads and wear out quickly if they must.' }
  ],
  problems: [
    { q: 'A sealless valve spool of 10 mm diameter has a radial clearance of 4 µm over a sealing length of 5 mm. How much leaks at 200 bar with oil of 30 mPa·s, in cm³/min?', answer: 1.34, unit: 'cm³/min', tol: 0.03,
      steps: ['$Q = \\pi \\times 0.01 \\times (4\\times10^{-6})^3 \\times 2\\times10^7/(12 \\times 0.03 \\times 0.005)$.', '$= 4.02\\times10^{-11}/1.8\\times10^{-3} = 2.23\\times10^{-8}$ m³/s = 1.3 cm³/min — small, but with a worn spool (8 µm) it would be eight times as much.'] }
  ],
  applications: [
    'Mobile machines, where wipers must survive mud, ice and grit and rod seals must stay dry for thousands of hours.',
    'Servo and test cylinders with PTFE or clearance seals for smooth, low-friction motion without stick-slip.',
    'Fire-resistant systems in steel mills and mines, which need seals matched to water–glycol or phosphate-ester fluids.',
    'Load-holding cylinders on cranes and platforms, where leakage decides how long a load may be left raised.'
  ],
  history: 'Joseph Bramah\'s press of 1795 leaked until his foreman Henry Maudslay devised a self-tightening leather cup, pressed harder against the ram the higher the pressure — the principle of every lip seal since. The rubber O-ring was patented in the United States by Niels Christensen in the late 1930s and became universal during the Second World War.'
},

{
  id: 'mounting-side-load', parent: 'cylinders', title: 'Mountings and side loads', level: 2,
  short: 'A cylinder is built to push along its axis. Flanges, feet, clevises and trunnions decide how its force reaches the machine; any side load is multiplied many times at the rod and piston guides, bends the rod and wears out the seals.',
  keywords: ['mounting', 'flange mounting', 'foot mounting', 'clevis', 'trunnion', 'rod eye', 'spherical bearing', 'side load', 'misalignment', 'stop tube', 'bearing separation', 'guide ring', 'bending stress', 'alignment'],
  prereq: ['hydraulic-cylinder', 'physics:torque', 'physics:static-equilibrium'],
  related: ['rod-buckling', 'seals', 'cylinder-types', 'mobile-hydraulics', 'lifts-cranes', 'physics:stress-strain'],
  body: `
A cylinder is built to push and pull along its own axis. Every other force — a load pressing sideways, a bending moment from a misaligned mounting, the weight of a long cylinder lying flat — ends up on the two small bearings inside it: the **rod guide** in the head and the **guide ring** on the piston. How the cylinder is mounted decides whether such forces arise at all.

### Mounting styles
| Group | Examples | Use |
|---|---|---|
| Fixed, on the centreline | head (front) flange, cap (rear) flange, tie-rod extensions | straight-line thrust into a rigid frame; guided loads |
| Fixed, off the centreline | foot mountings, side lugs, tapped holes in the side | cylinders lying on a surface; the thrust line is offset, so the mounting also carries a moment |
| Pivoting | rear clevis or eye, trunnions at head, cap or middle, spherical bearings | loads moving on an arc: booms, arms, tipping bodies, doors |

Two rules of thumb for flanges: use a **cap flange** on a cylinder that mainly **pushes**, and a **head flange** on one that mainly **pulls** — in both cases the working force presses the flange against the frame instead of stretching the bolts. A foot-mounted cylinder needs a shear key or dowels so the bolts do not carry the thrust in shear, and a stiff base: its offset thrust tries to tip it.

Pivot mountings let a cylinder follow its load round an arc, but only in their own plane: a plain clevis pin allows no misalignment across it. **Spherical plain bearings** in the rod eye and the rear eye take up small misalignments in every direction. A pivoted cylinder must also be free to swing through its whole arc without its ports, hoses or barrel touching anything.

### Side loads are multiplied inside
Suppose a side force $F_s$ acts at the rod end, a distance $a$ outside the rod guide, and the rod guide and the piston guide are a distance $B$ apart. The rod is a lever resting on two bearings, and taking moments gives

$$R_1 = F_s\\,\\frac{a + B}{B} \\;\\;\\text{(rod guide)}, \\qquad R_2 = F_s\\,\\frac{a}{B} \\;\\;\\text{(piston guide)}$$

At full extension $a$ is largest and $B$ smallest, so the guides carry many times the side load. A 63/36 cylinder with a 1000 mm stroke and a 1 kN side load 50 mm beyond the head has $a$ = 1050 mm and, fully out, $B \\approx$ 80 mm: the rod guide carries **14 kN** and the piston guide 13 kN. The rod is bent too: the moment $F_s a$ = 1050 N·m gives

$$\\sigma = \\frac{32\\,F_s\\,a}{\\pi d^3} \\approx 230 \\text{ MPa}$$

at the rod guide — most of the strength of the steel, before any thrust is added, and a bent rod [[rod-buckling|buckles]] at a lower load. Guide forces like these wear the guide rings, then the rod and bore, then the [[seals]], and the cylinder begins to leak.

### What to do about it
Best first:
- **Guide the load**, not the cylinder: slides, rails or linkages take the side force and the cylinder only pushes.
- **Pivot** both ends, so that the arc the load follows cannot bend the cylinder, and use spherical bearings for out-of-plane misalignment.
- **Align** carefully: a fixed-mounted cylinder driving a guided slide must be parallel to the guide, or it fights the guide along the whole stroke. Floating couplings between the rod and the load absorb small errors.
- Add a **stop tube**, a spacer on the rod behind the piston, which lengthens the barrel and increases $B$ at full extension. A common rule adds about 25 mm of stop tube for every 250 mm of stroke beyond about 1 m.
- Choose a thicker rod and longer guides.

### Horizontal cylinders and their own weight
A long cylinder pivoted at both ends and lying flat sags under its own weight and that of its oil, and at full extension the joint between rod and barrel is a hinge with play. Long horizontal cylinders get a trunnion near their centre of gravity, a support under the barrel, or a larger rod.

> [!warn] Before removing a mounting pin or loosening a mounting: lower or support the load, stop and lock out the pump, and release the pressure in both chambers. A cylinder that still carries its load can swing, drop or shoot its pin out, and one still under pressure can move as soon as it is free.
`,
  ideas: [
    'Flanges and centreline mounts carry thrust best; foot mounts add a moment; clevises and trunnions let the cylinder follow an arc.',
    'Side loads are multiplied at the guides: R₁ = F_s(a + B)/B, worst at full extension.',
    'A side load also bends the rod (σ = 32F_s·a/πd³) and lowers its buckling load.',
    'Guide the load, pivot the cylinder, align it, and use stop tubes on long strokes.',
    'Worn guides lead to scored rods and leaking seals: most early seal failures are side-load failures.'
  ],
  pitfalls: [
    'A small side load does no harm — At full extension the rod guide may carry ten or twenty times the side load, and the rod is bent by the moment.',
    'A clevis mounting takes care of every misalignment — A plain clevis pivots in one plane only; misalignment across it needs spherical bearings.',
    'A stop tube shortens the stroke and so wastes cylinder — It is there to keep the bearings apart; the barrel is made longer so the stroke is kept.'
  ],
  formulas: [
    {
      name: 'Reaction at the rod guide',
      expr: 'R1 = Fs*(a + B)/B', tex: 'R_1 = F_s\\,\\dfrac{a + B}{B}',
      vars: {
        R1: { name: 'force on the rod guide', q: 'force', unit: 'kN', tex: 'R_1' },
        Fs: { name: 'side load at the rod end', q: 'force', unit: 'kN', value: 1, tex: 'F_s' },
        a: { name: 'distance from the rod guide to the load', q: 'length', unit: 'mm', value: 1050 },
        B: { name: 'distance between rod guide and piston guide', q: 'length', unit: 'mm', value: 80 }
      },
      practice: { unknowns: ['R1', 'B'] },
      stories: {
        R1: 'A side load of {Fs} acts {a} outside the rod guide of a cylinder whose guides are {B} apart. What force does the rod guide carry?',
        B: 'A side load of {Fs} acts {a} outside the rod guide. How far apart must the guides be to keep the rod-guide force to {R1}?'
      }
    },
    {
      name: 'Reaction at the piston guide',
      expr: 'R2 = Fs*a/B', tex: 'R_2 = F_s\\,\\dfrac{a}{B}',
      vars: {
        R2: { name: 'force on the piston guide ring', q: 'force', unit: 'kN', tex: 'R_2' },
        Fs: { name: 'side load at the rod end', q: 'force', unit: 'kN', value: 1, tex: 'F_s' },
        a: { name: 'distance from the rod guide to the load', q: 'length', unit: 'mm', value: 1050 },
        B: { name: 'distance between rod guide and piston guide', q: 'length', unit: 'mm', value: 80 }
      },
      stories: { R2: 'A side load of {Fs} acts {a} outside the rod guide; the guides are {B} apart. What does the piston guide ring carry?' }
    },
    {
      name: 'Bending stress in the rod at the guide',
      expr: 'sigma = 32*Fs*a/(pi*d^3)', tex: '\\sigma = \\dfrac{32\\,F_s\\,a}{\\pi d^3}',
      vars: {
        sigma: { name: 'bending stress', q: 'stress', unit: 'MPa', tex: '\\sigma' },
        Fs: { name: 'side load at the rod end', q: 'force', unit: 'kN', value: 1, tex: 'F_s' },
        a: { name: 'distance from the rod guide to the load', q: 'length', unit: 'mm', value: 1050 },
        d: { name: 'rod diameter', q: 'length', unit: 'mm', value: 36 }
      },
      practice: { unknowns: ['sigma', 'd'] },
      stories: {
        sigma: 'A {d} rod carries a side load of {Fs} at {a} from its guide. What bending stress does that cause?',
        d: 'A side load of {Fs} acts {a} from the rod guide. What rod diameter keeps the bending stress to {sigma}?'
      }
    },
    {
      name: 'Surface pressure on a guide',
      expr: 'pb = R/(d*w)', tex: 'p_b = \\dfrac{R}{d\\,w}',
      vars: {
        pb: { name: 'mean surface pressure on the projected area', q: 'stress', unit: 'N/mm²', tex: 'p_b' },
        R: { name: 'force on the guide', q: 'force', unit: 'kN', value: 14.1 },
        d: { name: 'diameter of the guide', q: 'length', unit: 'mm', value: 36 },
        w: { name: 'width of the guide', q: 'length', unit: 'mm', value: 25 }
      },
      note: 'Compare with the permitted surface pressure the guide-ring maker gives for the material, speed and temperature.',
      stories: { pb: 'A rod guide {w} wide on a {d} rod carries {R}. What is its surface pressure?' }
    }
  ],
  examples: [
    {
      title: 'A 1 kN side load, multiplied',
      q: 'A 63/36 cylinder with a 1000 mm stroke carries a 1 kN side load 50 mm beyond the head. At full extension its guides are 80 mm apart. Find the guide forces and the rod\'s bending stress, then repeat with a 75 mm stop tube.',
      steps: [
        '$a = 1000 + 50 = 1050$ mm. Guide forces: $R_1 = 1 \\times 1130/80 = 14.1$ kN; $R_2 = 1 \\times 1050/80 = 13.1$ kN.',
        'Surface pressure on a 25 mm wide rod guide: $14\\,100/(36 \\times 25) = 15.7$ N/mm².',
        'Bending stress: $32 \\times 1000 \\times 1.05/(\\pi \\times 0.036^3) = 2.29\\times10^8$ Pa = 229 MPa.',
        'With a 75 mm stop tube, $B$ = 155 mm: $R_1 = 1 \\times 1205/155 = 7.8$ kN and $R_2 = 6.8$ kN — the guide forces are roughly halved. The bending stress is unchanged: only guiding the load removes it.'
      ],
      a: '14.1 kN and 13.1 kN on the guides and 229 MPa in the rod; a 75 mm stop tube cuts the guide forces to 7.8 and 6.8 kN.'
    }
  ],
  quiz: [
    { q: 'A flange-mounted cylinder mainly pushes. Where should the flange be?', choices: ['on the head (rod end)', 'on the cap (rear end)', 'it makes no difference', 'in the middle'], a: 1,
      why: 'A cap flange is pressed against the frame by the push, so the bolts are not stretched; for a cylinder that mainly pulls, the head flange is better.' },
    { q: 'What does a stop tube do?', choices: ['stops the piston before the cap', 'keeps the guides further apart at full extension', 'cushions the stroke', 'prevents rotation of the rod'], a: 1,
      why: 'The spacer lengthens the barrel so that at full extension the piston guide is further from the rod guide; the guide reactions fall roughly in proportion.' },
    { q: 'The force a side load puts on the rod guide grows as the rod extends.', a: true,
      why: 'The lever arm a grows and the bearing separation B shrinks, so R₁ = F_s(a + B)/B rises steeply towards full extension.' },
    { q: 'A 2 kN side load acts 600 mm from the rod guide; the guides are 100 mm apart. What does the rod guide carry?', answer: 14, unit: 'kN', tol: 0.02,
      why: 'R₁ = 2 × (600 + 100)/100 = 14 kN — seven times the side load.' },
    { q: 'A cylinder raises a boom that swings through an arc. Which mounting suits it?', choices: ['a foot mounting', 'a head flange', 'a rear clevis with a rod eye', 'side-tapped holes'], a: 2,
      why: 'Pivot mountings let the cylinder rotate as the boom swings, so it only pushes along its axis; a fixed mounting would be bent by the arc.' }
  ],
  problems: [
    { q: 'What bending stress does a 0.5 kN side load acting 800 mm from the rod guide cause in a 28 mm rod?', answer: 186, unit: 'MPa', tol: 0.02,
      steps: ['$M = 500 \\times 0.8 = 400$ N·m.', '$\\sigma = 32M/(\\pi d^3) = 12\\,800/(\\pi \\times 2.195\\times10^{-5}) = 1.86\\times10^8$ Pa = 186 MPa.'] }
  ],
  applications: [
    'Excavators and loaders: every cylinder pinned at both ends with spherical bearings so that the linkage, not the cylinder, carries the side loads.',
    'Press and machine-tool slides: a flange-mounted cylinder driving a guided slide through a floating coupling.',
    'Long-stroke cylinders on aerial platforms and dump bodies, fitted with stop tubes.',
    'Trunnion-mounted cylinders on hinged gates, hatches and bridge spans.'
  ],
  sim: 'act-sideload'
},

/* ================================================================ ROTARY ACTUATORS AND INTENSIFIERS */
{
  id: 'rotary-actuators', parent: 'rotary-actuators-topic', title: 'Rotary actuators', level: 2,
  short: 'Actuators that turn through a limited angle with great torque: rack-and-pinion, vane and helical-spline types. Torque is pressure times a displacement per radian; the angle, backlash and leakage decide which type suits the job.',
  keywords: ['rotary actuator', 'rack and pinion', 'vane actuator', 'helical actuator', 'spline actuator', 'torque', 'swing angle', 'backlash', 'steering gear', 'tilt-rotator', 'semi-rotary', 'displacement per radian'],
  prereq: ['hydraulic-cylinder', 'physics:torque', 'motor-torque-speed'],
  related: ['hydraulic-motors', 'lsht-motors', 'counterbalance-valve', 'cushioning', 'mobile-hydraulics', 'intensifiers', 'pneumatics:rotary-actuators-pneu'],
  body: `
Many machines need not a shaft that spins round and round but one that turns through a limited angle with great force: a valve to open, a rudder to swing, a pipe to roll over, a bucket to tilt. A **rotary actuator** (semi-rotary actuator) does it directly, without a cylinder and a lever — compact, with the same torque over the whole angle and nothing sticking out.

### Rack and pinion
One or two pistons drive toothed **racks** that turn a **pinion** on the output shaft. Each piston pushes with $p A$ at the pinion's pitch radius $r$, so with $n$ racks

$$T = n\\,p\\,\\frac{\\pi D^2}{4}\\,r$$

Two racks on opposite sides of the pinion double the torque and cancel the side load on the shaft bearings. Angles of 90°, 180°, 360° or more are simply a matter of rack length. The pistons have ordinary cylinder seals, so internal leakage is low and a rack-and-pinion actuator can hold its position; the gear teeth have a little backlash, which preloaded double-rack designs remove.

### Vane actuators
A **vane** fixed to the shaft swings in a cylindrical chamber; pressure on one face and tank on the other turn it. The pressure acts on the vane's area $b\\,(R - r)$ at a mean radius $(R + r)/2$, so for $n$ vanes

$$T = n\\,p\\,\\frac{b\\,(R^2 - r^2)}{2}$$

A single vane turns up to about 280°; a double vane, with two vanes and two fixed stops, turns about 100° with twice the torque and no net load on the bearings. Vane actuators are short, have no backlash and are ideal for fast indexing — but the seals round the vane's edges and corners leak more than piston seals, so they cannot hold a load in position for long without a brake or a valve.

### Helical (spline) actuators
A piston with helical splines inside and out slides along the housing and twists the shaft as it goes, like a nut on a very steep screw. They give very high torque in a slim body and carry large bending loads through their bearings, which is why they turn excavator tilt-rotators, marine davits and cranes.

| Type | Typical angle | Backlash | Holding (leakage) | Typical uses |
|---|---|---|---|---|
| Rack and pinion | 90–360° and more | small, can be removed | good | valve actuators, clamps, turntables |
| Single vane | up to about 280° | none | moderate | steering gear, indexing, flipping |
| Double vane | up to about 100° | none | moderate | high torque in little space |
| Helical spline | 90–360° | small | good | tilt-rotators, davits, aircraft |

### Speed, flow and control
A rotary actuator is a [[hydraulic-motors|hydraulic motor]] that never completes a turn. Its **displacement per radian** $V_\\theta$ gives the torque and the speed just as a motor's displacement per revolution does ([[motor-torque-speed]]):

$$T = \\Delta p\\,V_\\theta, \\qquad \\omega = \\frac{Q}{V_\\theta}$$

For a vane actuator $V_\\theta = n\\,b\\,(R^2 - r^2)/2$, so the time to swing through an angle $\\theta$ is $t = V_\\theta\\,\\theta/Q$. Speed is controlled like a cylinder's — throttles, flow controls or a proportional valve — and a heavy swinging load must be decelerated at the ends (internal [[cushioning|cushions]] or valves) and held against gravity by a [[counterbalance-valve|counterbalance valve]], just as for a cylinder. Remember that the actuator's rated torque is at its rated pressure: a heavy load swinging past the end stop can drive the pressure in the outlet chamber far above it.

### The alternative: a cylinder on a lever
A plain cylinder driving a crank is often cheaper and stronger, but its torque changes with the angle — it is $F\\,r\\,\\sin\\beta$, where β is the angle between the rod and the lever — and the useful swing is well under 180°. Ships' rudders are turned both ways: by ram-type steering gears, in which cylinders push a tiller, and by rotary-vane steering gears mounted straight on the rudder stock.

> [!warn] A rotary actuator stores the same kind of energy as a cylinder: a raised or swung load held by trapped oil. Support or lower the load and release the pressure on both sides before disconnecting it; a vane actuator in particular will let a load drift down as it leaks.
`,
  ideas: [
    'Rotary actuators turn through a limited angle with high, constant torque: rack-and-pinion, vane and helical types.',
    'Rack and pinion: T = n·p·A·r. Vane: T = n·p·b(R² − r²)/2.',
    'Torque is pressure times displacement per radian, and speed is flow divided by it — as for a motor.',
    'Vanes have no backlash but leak more; rack-and-pinion and helical types hold position better.',
    'A cylinder on a lever is simpler, but its torque varies with the angle.'
  ],
  pitfalls: [
    'A vane actuator can hold a load in position like a cylinder — Its vane seals leak more than piston seals; a held load slowly drifts unless a brake or a leak-free valve holds it.',
    'Doubling the vanes doubles the angle — A double vane doubles the torque but roughly halves the available angle, because the second vane and stop take up the chamber.',
    'A cylinder on a crank gives constant torque — Its torque is F·r·sin β and falls away towards the ends of the swing.'
  ],
  formulas: [
    {
      name: 'Rack-and-pinion torque',
      expr: 'T = n*p*pi*D^2/4*r', tex: 'T = n\\,p\\,\\dfrac{\\pi D^2}{4}\\,r',
      vars: {
        T: { name: 'output torque', q: 'torque', unit: 'N·m' },
        n: { name: 'number of racks (pistons)', int: true, value: 2, min: 1, max: 4 },
        p: { name: 'pressure difference across the pistons', q: 'pressure', unit: 'bar', value: 160 },
        D: { name: 'piston bore', q: 'length', unit: 'mm', value: 80 },
        r: { name: 'pitch radius of the pinion', q: 'length', unit: 'mm', value: 40 }
      },
      note: 'Friction in the teeth and seals takes 5–10 %.',
      practice: { unknowns: ['T', 'p', 'D'] },
      stories: {
        T: 'A rack-and-pinion actuator has {n} racks driven by pistons of {D} bore on a pinion of pitch radius {r}. What torque does it give at {p}?',
        p: 'A rack-and-pinion actuator with {n} racks, {D} bore and a pinion of pitch radius {r} must deliver {T}. What pressure does it need?',
        D: 'An actuator with {n} racks on a pinion of pitch radius {r} must give {T} at {p}. What piston bore does it need?'
      }
    },
    {
      name: 'Vane actuator torque',
      expr: 'T = n*p*b*(R^2 - r^2)/2', tex: 'T = n\\,p\\,\\dfrac{b\\,(R^2 - r^2)}{2}',
      vars: {
        T: { name: 'output torque', q: 'torque', unit: 'N·m' },
        n: { name: 'number of vanes', int: true, value: 1, min: 1, max: 3 },
        p: { name: 'pressure difference across the vane', q: 'pressure', unit: 'bar', value: 160 },
        b: { name: 'axial width of the vane', q: 'length', unit: 'mm', value: 120 },
        R: { name: 'outer radius (housing)', q: 'length', unit: 'mm', value: 100 },
        r: { name: 'hub radius', q: 'length', unit: 'mm', value: 40 }
      },
      practice: { unknowns: ['T', 'p'] },
      stories: {
        T: 'A vane actuator with {n} vane(s) {b} wide, housing radius {R} and hub radius {r} works at {p}. What torque does it give?',
        p: 'A vane actuator with {n} vane(s), {b} wide, outer radius {R} and hub radius {r} must deliver {T}. What pressure does it need?'
      }
    },
    {
      name: 'Time to swing a vane actuator',
      expr: 't = n*b*(R^2 - r^2)*theta/(2*Q)', tex: 't = \\dfrac{n\\,b\\,(R^2 - r^2)\\,\\theta}{2\\,Q}',
      vars: {
        t: { name: 'time to swing', q: 'time', unit: 's' },
        n: { name: 'number of vanes', int: true, value: 1, min: 1, max: 3 },
        b: { name: 'axial width of the vane', q: 'length', unit: 'mm', value: 120 },
        R: { name: 'outer radius (housing)', q: 'length', unit: 'mm', value: 100 },
        r: { name: 'hub radius', q: 'length', unit: 'mm', value: 40 },
        theta: { name: 'swing angle', q: 'angle', unit: '°', value: 270, min: 0, max: 360 },
        Q: { name: 'flow', q: 'flowrate', unit: 'L/min', value: 20 }
      },
      practice: { unknowns: ['t', 'Q'] },
      stories: {
        t: 'A single-vane actuator {b} wide, with radii {R} and {r}, is fed with {Q}. How long does it take to swing {theta}?',
        Q: 'A vane actuator {b} wide with radii {R} and {r} must swing {theta} in {t}. What flow does it need?'
      }
    }
  ],
  examples: [
    {
      title: 'A double-rack valve actuator',
      q: 'A double-rack actuator has 80 mm pistons on a pinion of 40 mm pitch radius. What torque does it give at 160 bar, and how long does it take to turn 90° with 10 L/min?',
      steps: [
        'Force of each piston: $1.6\\times10^7 \\times \\pi \\times 0.08^2/4 = 80.4$ kN.',
        'Torque: $T = 2 \\times 80.4\\times10^3 \\times 0.04 = 6430$ N·m.',
        'Oil needed for 90°: each rack moves $r\\theta = 0.04 \\times \\pi/2 = 62.8$ mm, so the two pistons sweep $2 \\times 5.03\\times10^{-3} \\times 0.0628 = 6.32\\times10^{-4}$ m³ = 0.63 L.',
        'Time: $0.63/10$ min = 3.8 s.'
      ],
      a: 'About 6.4 kN·m, turning 90° in about 3.8 s.'
    },
    {
      title: 'A vane actuator for a tilting table',
      q: 'A single-vane actuator is 120 mm wide with a housing radius of 100 mm and a hub radius of 40 mm. Find its torque at 160 bar and the time to swing 270° with 20 L/min. What would a double vane give?',
      steps: [
        '$R^2 - r^2 = 0.01 - 0.0016 = 8.4\\times10^{-3}$ m².',
        'Torque: $T = 1.6\\times10^7 \\times 0.12 \\times 8.4\\times10^{-3}/2 = 8060$ N·m.',
        'Volume for 270° (4.71 rad): $0.12 \\times 8.4\\times10^{-3}/2 \\times 4.71 = 2.38\\times10^{-3}$ m³ = 2.4 L; at 20 L/min, 7.1 s.',
        'A double vane gives 16.1 kN·m, but over only about 100°.'
      ],
      a: '8.1 kN·m, 270° in about 7 s; a double vane gives 16 kN·m over about 100°.'
    }
  ],
  quiz: [
    { q: 'What torque does a single-rack actuator with a 63 mm piston and a 30 mm pitch radius give at 100 bar?', answer: 935, unit: 'N·m', tol: 0.02,
      why: 'F = 10⁷ × π × 0.063²/4 = 31.2 kN; T = 31.2×10³ × 0.03 = 935 N·m.' },
    { q: 'Which actuator is the best choice to hold a heavy load at an angle for hours without a brake?', choices: ['a single-vane actuator', 'a rack-and-pinion actuator with a pilot-operated check valve', 'a double-vane actuator', 'any, they all seal perfectly'], a: 1,
      why: 'Piston seals leak very little and a poppet check valve does not leak at all; vane seals leak more around the corners of the vane.' },
    { q: 'Adding a second vane to a vane actuator doubles its torque but reduces its swing angle.', a: true,
      why: 'Two vanes act at once, but the second vane and its stop take up room in the chamber: about 100° instead of 280°.' },
    { q: 'The torque of a vane actuator is proportional to…', choices: ['R − r', 'R² − r²', 'R³', '(R + r)/2 only'], a: 1,
      why: 'Force p·b(R − r) at mean radius (R + r)/2 gives p·b(R² − r²)/2.' },
    { q: 'A cylinder turns a lever through 120°. Its torque at the ends of the swing compared with the middle is…', choices: ['the same', 'larger', 'smaller', 'zero'], a: 2,
      why: 'Torque = F·r·sin β; at the ends the rod is far from perpendicular to the lever, so sin β and the torque are smaller.' }
  ],
  problems: [
    { q: 'A double-vane actuator (n = 2) is 80 mm wide with radii 70 mm and 30 mm. What torque does it give at 200 bar?', answer: 6400, unit: 'N·m', tol: 0.02,
      steps: ['$R^2 - r^2 = 0.0049 - 0.0009 = 0.004$ m².', '$T = 2 \\times 2\\times10^7 \\times 0.08 \\times 0.004/2 = 6400$ N·m.'] }
  ],
  applications: [
    'Rotary-vane steering gears turning ships\' rudders through about ±35°.',
    'Tilt-rotators between an excavator\'s arm and its bucket, turned by helical or vane actuators.',
    'Rack-and-pinion actuators opening large ball and butterfly valves in pipelines and water works.',
    'Pipe handling, log turning, coil flipping and indexing tables in industry.'
  ]
},

{
  id: 'intensifiers', parent: 'rotary-actuators-topic', title: 'Pressure intensifiers', level: 2,
  short: 'Two pistons of different size on one rod turn a large flow at low pressure into a small flow at high pressure: p₂ = p₁·A₁/A₂. Intensifiers clamp, rivet, test and cut with water at thousands of bar — and every differential cylinder can become one by accident.',
  keywords: ['intensifier', 'pressure intensifier', 'booster', 'air-over-oil', 'area ratio', 'high pressure', 'water jet', 'bolt tensioner', 'reciprocating intensifier', 'single-stroke', 'clamping'],
  prereq: ['pascals-law', 'area-ratio', 'pressure-flow-power'],
  related: ['force-multiplication', 'hydraulic-press', 'relief-valve', 'hydraulic-safety', 'rotary-actuators', 'pneumatics:pressure-boosters', 'physics:pascals-principle'],
  body: `
Sometimes a job needs a pressure far above what the pump makes, but only a little oil at that pressure: a clamp that must hold with 50 tonnes, a riveting tool, a bolt tensioner, a pipe to be proof-tested, a water jet that cuts steel. A **pressure intensifier** (booster) provides it by trading flow for pressure.

### Two pistons on one rod
Two pistons of different diameter share one rod. Oil at the low pressure $p_1$ pushes the large piston (area $A_1$); the small piston or plunger (area $A_2$) pushes into the high-pressure side. The forces balance:

$$p_1 A_1 = p_2 A_2 \\quad\\Rightarrow\\quad p_2 = p_1\\,\\frac{A_1}{A_2} = p_1\\left(\\frac{D_1}{D_2}\\right)^2$$

less a few per cent for seal friction ($p_2 = \\eta\\,p_1 A_1/A_2$ with η about 0.9–0.97). The flow is traded the other way: the small plunger sweeps $Q_2 = Q_1\\,A_2/A_1$. Power in equals power out, less the losses — an intensifier multiplies pressure, never energy. It is the hydraulic press of [[force-multiplication]] turned into a pressure converter.

| Application | Input | Ratio | Output |
|---|---|---|---|
| Air-over-oil booster (workshop press, clamping, riveting) | 6 bar air | 25–60 | 150–360 bar oil |
| Clamping intensifier on a machine tool | 60–100 bar oil | 2–5 | 200–400 bar |
| Air-driven pump for bolt tensioning | 6 bar air | about 250 | 1500 bar |
| Water-jet cutting intensifier | 200 bar oil | about 20 | 4000 bar water |

### Single-stroke and continuous
A **single-stroke** intensifier delivers one plunger-full of high-pressure fluid — enough to close a clamp or crimp a fitting. Its plunger volume must cover everything the job consumes: the stroke of the work cylinder, the swelling of the hoses and the compression of the oil itself (about 0.7 % per 100 bar). A **reciprocating** intensifier reverses itself at each end of its stroke with its own pilot valves and so pumps high pressure continuously in small doses. In-line versions give up to about 800 bar from a 200 bar supply and simply stop when the pressure is reached, holding it without heating the oil; water-jet intensifiers cycle a double-ended plunger a few times a second to feed a 0.1–0.4 mm nozzle at about 4000 bar, with a small accumulator to smooth the pulses.

### Air-over-oil
Air-over-oil boosters join pneumatics to hydraulics ([[pneumatics:pressure-boosters]]). A large air piston drives a small oil plunger: a 200 mm air piston at 6 bar on a 25 mm plunger gives $6 \\times (200/25)^2 = 384$ bar. They suit workshops that have compressed air but no hydraulic power unit. Two-stage versions first push the tool forward quickly with oil displaced by low-pressure air, then boost only for the short working stroke.

### The accidental intensifier
Every differential cylinder is an intensifier waiting to happen. Block its rod-end outlet while the cap end is pressurised and the annulus climbs to $\\varphi\\,p_1$ ([[area-ratio]]): a 2:1 cylinder on a 200 bar supply becomes a 400 bar source. A cylinder driving another cylinder of smaller bore does the same, and so does a pneumatic cylinder pushing on a hydraulic one. Wherever areas differ and a volume can be trapped, check the pressure it can reach.

> [!warn] Everything on the high-pressure side of an intensifier — hoses, fittings, gauges, the tool and the workpiece — must be rated for the output pressure, and the output needs its own relief valve set below that rating. A water jet at 4000 bar cuts flesh and bone as easily as steel: cutting heads are interlocked, never pointed at anyone, and a jet injury, however small it looks, is a surgical emergency — seek emergency medical care at once.
`,
  ideas: [
    'An intensifier balances forces on two pistons of different area: p₂ = p₁·A₁/A₂, less a few per cent friction.',
    'Flow is divided by the same ratio: Q₂ = Q₁·A₂/A₁. Pressure is multiplied, power is not.',
    'Single-stroke intensifiers deliver one plunger-full; reciprocating ones pump high pressure continuously.',
    'Air-over-oil boosters make 150–400 bar of oil from shop air; water-jet intensifiers make about 4000 bar of water from 200 bar of oil.',
    'Any differential cylinder with a blocked rod end is an accidental intensifier.'
  ],
  pitfalls: [
    'An intensifier increases the hydraulic power — Pressure rises by the area ratio but flow falls by the same ratio; the power out is the power in minus the losses.',
    'The output pressure is limited by the pump\'s relief valve — The relief valve limits p₁; the output is p₁ times the ratio and needs a relief valve of its own.',
    'A single-stroke intensifier only needs the work cylinder\'s volume — The oil compresses and the hoses swell at high pressure; the plunger must supply that too, or it bottoms out before the pressure is reached.'
  ],
  formulas: [
    {
      name: 'Intensifier output pressure',
      expr: 'p2 = eta*p1*(D1/D2)^2', tex: 'p_2 = \\eta\\,p_1\\left(\\dfrac{D_1}{D_2}\\right)^2 = \\eta\\,p_1\\,\\dfrac{A_1}{A_2}',
      vars: {
        p2: { name: 'output pressure (gauge)', q: 'pressure', unit: 'bar', tex: 'p_2' },
        eta: { name: 'efficiency (seal friction)', q: 'ratio', unit: '%', value: 95, min: 50, max: 100, tex: '\\eta' },
        p1: { name: 'input pressure (gauge)', q: 'pressure', unit: 'bar', value: 200, tex: 'p_1' },
        D1: { name: 'diameter of the low-pressure piston', q: 'length', unit: 'mm', value: 200, tex: 'D_1' },
        D2: { name: 'diameter of the high-pressure plunger', q: 'length', unit: 'mm', value: 45, tex: 'D_2' }
      },
      note: 'Gauge pressures on both sides, the back of the large piston vented. For an air-over-oil booster p₁ is the air pressure.',
      practice: { unknowns: ['p2', 'p1', 'D2'] },
      stories: {
        p2: 'An intensifier has a {D1} piston driving a {D2} plunger and is fed at {p1}. With an efficiency of {eta}, what output pressure does it give?',
        p1: 'An intensifier with a {D1} piston and a {D2} plunger must deliver {p2}. With an efficiency of {eta}, what input pressure does it need?',
        D2: 'An intensifier with a {D1} piston is fed at {p1} and must deliver {p2} (efficiency {eta}). What plunger diameter does it need?'
      }
    },
    {
      name: 'Intensifier output flow',
      expr: 'Q2 = Q1*(D2/D1)^2', tex: 'Q_2 = Q_1\\left(\\dfrac{D_2}{D_1}\\right)^2',
      vars: {
        Q2: { name: 'high-pressure output flow', q: 'flowrate', unit: 'L/min', tex: 'Q_2' },
        Q1: { name: 'low-pressure input flow', q: 'flowrate', unit: 'L/min', value: 20, tex: 'Q_1' },
        D2: { name: 'diameter of the high-pressure plunger', q: 'length', unit: 'mm', value: 45, tex: 'D_2' },
        D1: { name: 'diameter of the low-pressure piston', q: 'length', unit: 'mm', value: 200, tex: 'D_1' }
      },
      note: 'For a double-acting reciprocating intensifier, averaged over its strokes and ignoring the compression of the fluid.',
      stories: { Q2: 'An intensifier with a {D1} piston and a {D2} plunger is fed with {Q1}. How much high-pressure flow does it deliver?' }
    }
  ],
  examples: [
    {
      title: 'A clamping intensifier',
      q: 'A machine tool\'s hydraulic unit gives 160 bar, but a fixture needs 600 bar. With a 32 mm plunger and an efficiency of 93 %, what low-pressure piston is needed? What will a standard 70 mm piston give?',
      steps: [
        'Ratio needed: $600/(0.93 \\times 160) = 4.03$, so $D_1 = 32 \\times \\sqrt{4.03} = 64.3$ mm.',
        'With 70 mm: $p_2 = 0.93 \\times 160 \\times (70/32)^2 = 0.93 \\times 160 \\times 4.785 = 712$ bar.',
        'That exceeds the 600 bar needed, so the output gets its own relief valve set at 600 bar — and everything downstream must be rated for it.'
      ],
      a: 'At least 64 mm; a 70 mm piston gives about 710 bar, limited to 600 bar by an output relief valve.'
    },
    {
      title: 'A water-jet intensifier',
      q: 'A water-jet intensifier has a 200 mm oil piston and 45 mm water plungers, driven by oil at 200 bar and 20 L/min. Estimate the water pressure (95 % efficient) and the water flow.',
      steps: [
        'Ratio: $(200/45)^2 = 19.8$. Pressure: $0.95 \\times 200 \\times 19.8 = 3750$ bar.',
        'Water flow: $20 \\times (45/200)^2 = 1.0$ L/min — enough for one fine cutting nozzle.',
        'Power check: oil in, $200 \\times 20/600 = 6.7$ kW; water out, $3750 \\times 1.0/600 = 6.3$ kW. The power is conserved (less the losses); only its form changes.'
      ],
      a: 'About 3750 bar and 1.0 L/min of water.'
    }
  ],
  quiz: [
    { q: 'An intensifier has an area ratio of 5 and is fed with 150 bar. Ignoring friction, what is its output pressure?', answer: 750, unit: 'bar', tol: 0.02,
      why: 'p₂ = p₁·A₁/A₂ = 150 × 5 = 750 bar.' },
    { q: 'Compared with the flow into it, the flow out of an intensifier with a ratio of 5 is…', choices: ['five times larger', 'the same', 'one fifth', 'one twenty-fifth'], a: 2,
      why: 'The plunger sweeps A₂ while the piston sweeps A₁ over the same stroke: Q₂ = Q₁·A₂/A₁ = Q₁/5.' },
    { q: 'An intensifier increases the hydraulic power available at its output.', a: false,
      why: 'Pressure goes up by the area ratio and flow down by the same ratio; power p·Q is at best conserved and in practice slightly reduced by friction.' },
    { q: 'An air-over-oil booster has a 125 mm air piston and a 25 mm oil plunger. What oil pressure does 6 bar of air give (ideal)?', answer: 150, unit: 'bar', tol: 0.02,
      why: '(125/25)² = 25; 6 × 25 = 150 bar.' },
    { q: 'Why does the output side of an intensifier need its own relief valve?', choices: ['to save energy', 'because the pump relief valve only limits the input pressure', 'to cool the oil', 'to prevent cavitation'], a: 1,
      why: 'The output is the input times the ratio. Only a relief valve on the output side, set below the rating of the high-pressure parts, protects them.' }
  ],
  problems: [
    { q: 'An intensifier must turn 100 bar into 700 bar at 92 % efficiency, with a 25 mm plunger. What diameter must its low-pressure piston have?', answer: 69.0, unit: 'mm', tol: 0.02,
      steps: ['Ratio: $700/(0.92 \\times 100) = 7.61$.', '$D_1 = 25\\sqrt{7.61} = 69.0$ mm.'] }
  ],
  applications: [
    'Clamping fixtures on machine tools and injection moulds, fed from a low-pressure unit.',
    'Air-over-oil presses, riveters and punches in workshops with only compressed air.',
    'Water-jet cutting of stone, glass, metals and food at about 4000 bar.',
    'Bolt tensioners, pipe and pressure-vessel proof testing, and autofrettage of gun barrels and injector pipes.'
  ],
  history: 'Cutting with pure water jets grew out of experiments in the 1950s and 60s, notably by the forestry engineer Norman Franz, who wanted to slice timber without sawdust; oil-driven intensifiers reaching thousands of bar made it an industrial tool in the 1970s, and abrasive water jets that cut steel followed in the 1980s.',
  sim: 'act-intensify'
},

/* ================================================================ CONTAMINATION AND MAINTENANCE */
{
  id: 'contamination', parent: 'contamination-topic', title: 'Contamination', level: 1,
  short: 'Particles, water, air and the products of heat slowly poison a hydraulic system. The most harmful particles are about as big as the working clearances — a few micrometres, far too small to see — so cleanliness has to be measured and designed in.',
  keywords: ['contamination', 'particles', 'clearance', 'wear', 'abrasion', 'erosion', 'silting', 'silt lock', 'water in oil', 'ppm', 'saturation', 'oxidation', 'varnish', 'ingress', 'breather', 'new oil', 'Karl Fischer'],
  prereq: ['hydraulic-system', 'hydraulic-oils'],
  related: ['iso-4406', 'filtration', 'troubleshooting', 'seals', 'air-in-oil', 'reservoirs', 'servo-valves', 'heat-coolers', 'pneumatics:iso-8573'],
  body: `
Most hydraulic failures are not sudden breakages but slow poisoning — by dirt, water, air and heat — and dirt is the worst of them. Component and filter makers alike trace most wear-related failures of pumps and valves back to particles in the oil.

### Particles meet clearances
Inside every pump, motor and valve, surfaces slide past each other on oil films a few micrometres thick. A particle about the size of that gap is the most harmful: much smaller ones pass through, much larger ones cannot get in, but one that just fits is dragged into the gap, trapped, and pulled along, ploughing both surfaces (three-body abrasion).

| Component | Typical working clearance |
|---|---|
| Servo-valve spool in its sleeve | 1–4 µm |
| Proportional and directional valve spools | 1–8 µm |
| Vane-pump vane tips | 0.5–1 µm |
| Piston pump: piston in its bore | 5–40 µm |
| Piston pump: valve plate to cylinder block | 0.5–5 µm |
| Gear pump: tooth tips and side plates | 0.5–5 µm |
| Rolling bearings and gear teeth (oil film) | below 1 µm |
| Cylinder: piston in its bore (sealed) | 50–250 µm |

| For comparison | Size |
|---|---|
| Smallest particle the eye can see | about 40 µm |
| Human hair | 50–80 µm |
| Fine flour, talcum powder | 5–20 µm |
| Red blood cell | about 8 µm |
| Bacterium | 1–2 µm |

So the particles that do the damage are **invisible**: oil can look bright and clear and still be wearing a pump out. Cleanliness is counted, not judged by eye ([[iso-4406]]).

### Where dirt comes from
- **Built in**: machining swarf, casting sand, weld spatter, paint flakes and the rubber dust of cut hoses, left by manufacture and repair. New and repaired systems are flushed before they are put to work.
- **Let in**: through rod wipers (dust clings to the oil film on the rod), the reservoir breather — the tank breathes in the volume of every cylinder rod on every stroke — open covers and careless maintenance. **New oil is not clean oil**: from a drum it is typically around 21/19/16 or worse, dirtier than most systems accept, so it is filled through a filter.
- **Made inside**: wear debris. It feeds itself — particles make particles — so a rising particle count is an early warning of a component wearing.

### Water, air and heat
- **Water** comes from condensation in the tank, washing down, leaking coolers and damp air. A mineral oil dissolves only a few hundred ppm (roughly 200–500 ppm, more when hot); beyond that the water is free or emulsified and the oil turns cloudy. Water rusts steel, weakens the lubricating film, attacks additives, speeds up oxidation and shortens the life of rolling bearings markedly. Keep it below about half the saturation level; measure it in ppm by Karl Fischer titration, or as percent saturation with a humidity sensor in the oil.
- **Air** dissolves harmlessly, but released as bubbles or foam it makes pumps noisy, cylinders spongy and oil age faster — see [[air-in-oil]].
- **Heat** drives oxidation, which makes the oil acidic and leaves sludge and varnish that make spools stick. A common rule: above about 60 °C the rate of oxidation **doubles for every 10 °C** — a hot-running system eats its oil ([[heat-coolers]]).

### How contamination destroys
- **Abrasion** in close clearances: leakage grows, efficiency falls, heat rises.
- **Erosion**: fine particles in fast jets round off the metering edges of valves, which then leak and control badly.
- **Silting**: a spool that stands still collects fine silt in its clearance and sticks (silt lock) — one reason valves in standby are cycled from time to time.
- **Surface fatigue**: particles pressed into rolling contacts dent them and start pits and spalls.
- **Seizure**: a large particle jams a spool or a pump piston outright.

> [!key] Cleanliness is cheaper than repair. Keep dirt out (good wipers, breather filters, sealed tanks, filtered filling), take it out ([[filtration]]), and measure it regularly: a particle count predicts trouble months before a failure.

> [!warn] Taking oil samples and changing breathers or filters means opening a system that may be hot and under pressure: follow the machine's procedure, release the pressure first where required, and never open a sampling point towards your face or hands.
`,
  ideas: [
    'The most harmful particles are about the size of the working clearances: 1–10 µm, far below what the eye can see.',
    'Dirt is built in, let in (breathers, wipers, new oil) and made inside (wear debris, which breeds more).',
    'Water beyond a few hundred ppm, air and heat are contaminants too; oxidation roughly doubles for every 10 °C.',
    'Contamination causes abrasion, erosion of metering edges, silting and sticking, fatigue and seizure.',
    'Clean oil must be designed in, kept in and measured.'
  ],
  pitfalls: [
    'Oil that looks clear is clean — Particles below about 40 µm are invisible, and the harmful ones are 1–15 µm. Only a particle count tells.',
    'Fresh oil from the drum is clean — New oil is typically dirtier than most hydraulic systems allow and must be filtered on the way in.',
    'Water only matters when the oil turns milky — By the time oil is cloudy it is past saturation; dissolved water below that already ages the oil and harms bearings.'
  ],
  formulas: [
    {
      name: 'Water content',
      expr: 'w = Vw/Vo', tex: 'w = \\dfrac{V_w}{V_o}',
      vars: {
        w: { name: 'water content', q: 'ratio', unit: 'ppm' },
        Vw: { name: 'volume of water', q: 'volume', unit: 'mL', value: 0.2, tex: 'V_w' },
        Vo: { name: 'volume of oil', q: 'volume', unit: 'L', value: 1, tex: 'V_o' }
      },
      note: 'By volume. Karl Fischer titration reports by mass, about 15 % higher for mineral oil (densities 1000 and 870 kg/m³).',
      stories: { w: 'A 1-litre sample holds {Vw} of water. What is its water content in ppm?', Vw: 'A system holds {Vo} of oil at {w} of water. How much water is that?' }
    },
    {
      name: 'Oil life and temperature (rule of thumb)',
      expr: 'L2 = L1*2^(-dT/10)', tex: 'L_2 = L_1 \\cdot 2^{-\\Delta T/10\\,\\mathrm{K}}',
      vars: {
        L2: { name: 'expected oil life at the higher temperature', q: 'time', unit: 'h', tex: 'L_2' },
        L1: { name: 'expected oil life at the reference temperature', q: 'time', unit: 'h', value: 10000, tex: 'L_1' },
        dT: { name: 'temperature above the reference', q: 'dtemp', unit: 'K', value: 20, signed: true, tex: '\\Delta T' }
      },
      note: 'An Arrhenius-type rule for oxidation above about 60 °C; the real factor depends on the oil, its additives, water and metals present.',
      stories: { L2: 'An oil lasts about {L1} at 60 °C. How long might it last running {dT} hotter?', dT: 'An oil that lasts {L1} at 60 °C is found to need changing after {L2}. How much hotter than 60 °C has it been running?' }
    },
    {
      name: 'Air breathed by the reservoir per cylinder stroke',
      expr: 'Vb = n*pi*d^2/4*s', tex: 'V_b = n\\,\\dfrac{\\pi d^2}{4}\\,s',
      vars: {
        Vb: { name: 'air drawn in (and pushed out) per stroke', q: 'volume', unit: 'L', tex: 'V_b' },
        n: { name: 'number of cylinders moving together', int: true, value: 2 },
        d: { name: 'rod diameter', q: 'length', unit: 'mm', value: 70 },
        s: { name: 'stroke', q: 'length', unit: 'mm', value: 1000 }
      },
      note: 'The tank level changes by the rod volume of every differential cylinder; the air it breathes carries dust and moisture unless the breather filters it.',
      stories: { Vb: '{n} cylinders with {d} rods and a stroke of {s} retract together. How much air does the reservoir breathe in?' }
    }
  ],
  examples: [
    {
      title: 'How wet is the oil?',
      q: 'Karl Fischer titration finds 0.2 mL of water in a 1 L sample. The oil\'s saturation at its working temperature of 40 °C is about 300 ppm. Is that acceptable?',
      steps: [
        '$w = 0.2\\,\\text{mL}/1000\\,\\text{mL} = 2\\times10^{-4}$ = 200 ppm by volume.',
        'As a share of saturation: $200/300 = 67$ %. The oil is still clear, but above the usual limit of about half the saturation.',
        'At night, as the oil cools, its saturation falls and free water appears: time to find the source (condensation, a cooler, washing) and dry the oil.'
      ],
      a: '200 ppm, about two thirds of saturation — too wet, though it still looks clear.'
    },
    {
      title: 'A hot system eats its oil',
      q: 'An oil is expected to last 10 000 h at 60 °C. A blocked cooler makes the system run at 80 °C. Using the doubling-per-10 °C rule, what life can be expected?',
      steps: [
        '$\\Delta T = 20$ K, so the life is divided by $2^{20/10} = 4$.',
        '$L_2 = 10\\,000/4 = 2500$ h — a quarter of the expected life, plus more varnish and sticking valves on the way.'
      ],
      a: 'About 2500 h instead of 10 000 h.'
    },
    {
      title: 'A reservoir that breathes',
      q: 'Two 100/70 cylinders with 1 m strokes work together. How much air does the tank breathe per stroke, and per 8-hour shift at 50 cycles an hour?',
      steps: [
        'Rod volume of each: $\\pi \\times 0.07^2/4 \\times 1 = 3.85$ L; two cylinders: 7.7 L.',
        'Each cycle the tank breathes 7.7 L out and 7.7 L in. Per shift: $7.7 \\times 50 \\times 8 = 3080$ L of air drawn in.',
        'Through an open breather cap, three cubic metres of workshop or site air a shift carry dust and moisture straight into the tank — hence fine breather filters, often with a desiccant.'
      ],
      a: '7.7 L per stroke, about 3 m³ of air per shift.'
    }
  ],
  quiz: [
    { q: 'A servo valve has a spool clearance of about 3 µm. Which particles are the most dangerous to it?', choices: ['0.1 µm', 'about 3 µm', 'about 50 µm', '200 µm'], a: 1,
      why: 'Particles about the size of the clearance are drawn in and trapped, cutting both surfaces; much smaller ones pass through, much larger ones cannot enter.' },
    { q: 'Hydraulic oil that is clear and bright is clean enough for servo valves.', a: false,
      why: 'The eye sees particles down to about 40 µm; the damaging ones are 1–15 µm. Only a particle count shows the real cleanliness.' },
    { q: 'New oil from a drum is typically…', choices: ['cleaner than any system needs', 'about as clean as a servo system needs', 'dirtier than most systems accept', 'free of water'], a: 2,
      why: 'Drummed oil is typically around 21/19/16 or worse. It should be filtered as it is put in.' },
    { q: 'By the doubling rule, how much faster does oil oxidise at 75 °C than at 65 °C?', choices: ['about 10 % faster', 'about twice as fast', 'four times as fast', 'the same'], a: 1,
      why: 'Above about 60 °C the rate roughly doubles for each 10 °C rise.' },
    { q: 'What is the water content of a sample with 0.5 mL of water in 2 L of oil?', answer: 250, unit: 'ppm', tol: 0.02,
      why: '0.5/2000 = 2.5×10⁻⁴ = 250 ppm.' }
  ],
  problems: [
    { q: 'An oil lasting 12 000 h at 60 °C runs at 75 °C. Using the doubling rule, what life can be expected?', answer: 4243, unit: 'h', tol: 0.02,
      steps: ['$2^{15/10} = 2.83$.', '$12\\,000/2.83 = 4243$ h.'] }
  ],
  applications: [
    'Condition monitoring: regular particle counts and water tests of excavators, presses and wind-turbine hydraulics.',
    'Flushing new and repaired systems before they are commissioned.',
    'Desiccant breathers and sealed reservoirs on machines in dusty or wet environments.',
    'Aircraft and servo systems, where the cleanliness of the oil is specified as strictly as any dimension.'
  ],
  sim: 'act-clearance'
},

{
  id: 'iso-4406', parent: 'contamination-topic', title: 'Cleanliness codes: ISO 4406', level: 2,
  short: 'ISO 4406:2021 turns a particle count into three numbers, such as 18/16/13: scale numbers for the particles per millilitre at or above 4, 6 and 14 µm(c). Each step up doubles the count, so the code is a logarithmic scale and targets are set by the most sensitive component.',
  keywords: ['ISO 4406', 'cleanliness code', '18/16/13', 'particle count', 'scale number', 'µm(c)', 'ISO 11171', 'particle counter', 'NAS 1638', 'SAE AS4059', 'target cleanliness', 'oil sample', 'ISO 4407'],
  prereq: ['contamination', 'math:logarithms'],
  related: ['filtration', 'troubleshooting', 'servo-valves', 'proportional-valves', 'math:logarithmic-scales', 'math:exponential-growth-decay', 'pneumatics:iso-8573'],
  body: `
Counting particles turns "clean" and "dirty" into numbers. ISO 4406:2021 condenses a particle count into a code of three numbers, such as **18/16/13**, that anyone can compare with a target.

### Three sizes, one scale
An automatic particle counter, calibrated to ISO 11171 (the "(c)" after each size), counts the particles **equal to or larger than** 4 µm(c), 6 µm(c) and 14 µm(c) in every millilitre of oil. Each count is replaced by a **scale number** from a table in which each step **doubles** the count:

| Scale number | More than (per mL) | Up to and including |
|---|---|---|
| 12 | 20 | 40 |
| 13 | 40 | 80 |
| 14 | 80 | 160 |
| 15 | 160 | 320 |
| 16 | 320 | 640 |
| 17 | 640 | 1 300 |
| 18 | 1 300 | 2 500 |
| 19 | 2 500 | 5 000 |
| 20 | 5 000 | 10 000 |
| 21 | 10 000 | 20 000 |
| 22 | 20 000 | 40 000 |

The upper limits are $0.01 \\times 2^R$ particles per mL, rounded to two figures, from 0.01 for scale number 0 to 2.5 million for 28. One step is a factor of two, three steps a factor of eight, ten steps a factor of a thousand: a [[math:logarithmic-scales|logarithmic scale]] in base 2.

### Reading 18/16/13
- **18**: between 1300 and 2500 particles ≥ 4 µm(c) per mL;
- **16**: between 320 and 640 particles ≥ 6 µm(c) per mL;
- **13**: between 40 and 80 particles ≥ 14 µm(c) per mL.

The counts are **cumulative** — every particle ≥ 14 µm is also ≥ 6 µm and ≥ 4 µm — so the numbers can never rise from left to right. The first number follows the fine silt that erodes and silts valves; the last, the large particles that jam and cut. Codes found by microscope counting (ISO 4407) have only the ≥ 5 µm and ≥ 15 µm counts and are written with a dash: −/16/13.

### Typical targets
The most sensitive component in the system sets the target. Typical values for mineral-oil systems in normal duty — the component maker's own requirement comes first:

| Most sensitive component | Target ≥4/≥6/≥14 µm(c) |
|---|---|
| Servo valves | 16/14/11 |
| Proportional valves | 17/15/12 |
| Variable-displacement piston pumps | 17/15/13 |
| Fixed piston pumps and vane pumps | 18/16/13 |
| Gear pumps; directional and pressure valves | 19/17/14 |
| Cylinders; low-speed high-torque motors | 20/18/15 |
| For comparison: new oil as delivered | 21/19/16 or worse |

Aim one code **cleaner** for pressures above about 200 bar, heavy duty cycles, water-based fluids, or machines whose failure would be dangerous or costly. The reward is large: each code cleaner halves the number of particles, and component makers report service lives rising steeply with cleanliness.

### Getting a trustworthy number
A particle count is only as good as its sample. Take it from a turbulent line while the system runs (ISO 4021), through a flushed sampling valve, into a certified clean bottle — or measure online with a counter permanently connected. Optical counters count air bubbles and water droplets as particles, so a sudden jump in all three numbers may be aeration or water rather than dirt. Older codes are still met: NAS 1638 classes (from US aerospace, counts per 100 mL in five size bands) and their successor SAE AS4059; NAS class 7 is roughly 18/16/13.
`,
  ideas: [
    'An ISO 4406 code gives scale numbers for the counts per mL at ≥ 4, ≥ 6 and ≥ 14 µm(c).',
    'Each scale number doubles the count: upper limit ≈ 0.01 × 2^R per mL.',
    'Counts are cumulative, so the three numbers never increase from left to right.',
    'The most sensitive component sets the target: about 16/14/11 for servo valves, 20/18/15 for cylinders.',
    'A sample must be representative: from a turbulent running line, into a clean bottle, with air and water in mind.'
  ],
  pitfalls: [
    'A code of 18 means 18 particles per millilitre — It is a scale number: 18 stands for 1300 to 2500 particles per mL.',
    'Going from 18 to 15 is a small improvement — Three steps is a factor of eight: an eighth of the particles.',
    'The code 16/18/13 is possible — Counts are cumulative: there cannot be more particles ≥ 6 µm than ≥ 4 µm.'
  ],
  formulas: [
    {
      name: 'Upper limit of a scale number',
      expr: 'N = 0.01*2^R', tex: 'N_\\text{max} \\approx 0.01 \\times 2^{R}',
      vars: {
        N: { name: 'upper limit of the count (particles per mL)', tex: 'N_\\text{max}' },
        R: { name: 'ISO 4406 scale number', int: true, value: 18, min: 0, max: 28 }
      },
      note: 'The standard rounds these limits to two figures: 2621 becomes 2500, 1311 becomes 1300. Solving for R from a count gives a fractional value; the scale number is the next whole number up.',
      stories: { N: 'What is the upper limit, per millilitre, of ISO 4406 scale number {R}?', R: 'A sample has {N} particles per mL at one size. Which scale number is that?' }
    },
    {
      name: 'Change in particle count between two codes',
      expr: 'k = 2^dR', tex: 'k = \\dfrac{N_2}{N_1} = 2^{\\Delta R}',
      vars: {
        k: { name: 'ratio of particle counts' },
        dR: { name: 'change in scale number', int: true, value: 3, signed: true, tex: '\\Delta R' }
      },
      stories: { k: 'A scale number rises by {dR}. By what factor has the particle count grown?', dR: 'Filtering cut the particle count by a factor of {k}. By how many scale numbers did the code fall?' }
    }
  ],
  examples: [
    {
      title: 'Decoding a count',
      q: 'A particle counter reports 1850 particles ≥ 4 µm(c), 410 ≥ 6 µm(c) and 55 ≥ 14 µm(c) per mL. What is the ISO 4406 code, and does it meet a target of 17/15/12 for proportional valves?',
      steps: [
        '1850 lies between 1300 and 2500: scale number 18. 410 lies between 320 and 640: 16. 55 lies between 40 and 80: 13.',
        'Code: 18/16/13.',
        'Against 17/15/12 each number is one too high: the oil holds up to twice as many particles as the target at every size. The filtration needs improving (finer or larger filters, an off-line loop) before the valves suffer.'
      ],
      a: '18/16/13 — one code too dirty at every size.'
    },
    {
      title: 'What a clean-up is worth',
      q: 'A machine\'s oil goes from 20/18/15 to 17/15/12 after an off-line filter is fitted. By what factor has the number of particles fallen?',
      steps: [
        'Each number fell by 3 scale steps.',
        '$k = 2^{3} = 8$: roughly one particle in eight is left at every size.'
      ],
      a: 'By a factor of about 8.'
    }
  ],
  quiz: [
    { q: 'A sample has 4000 particles ≥ 4 µm(c) per mL. What is its first scale number?', answer: 19, tol: 0.001,
      why: '4000 lies above 2500 and at most 5000: scale number 19.' },
    { q: 'The code improves from 19/17/14 to 16/14/11. The particle counts have fallen by a factor of…', choices: ['3', '6', '8', '30'], a: 2,
      why: 'Three scale numbers at each size: 2³ = 8.' },
    { q: 'A code of 16/18/13 is possible.', a: false,
      why: 'The counts are cumulative: every particle ≥ 6 µm is also ≥ 4 µm, so the second number cannot exceed the first.' },
    { q: 'The first number of an ISO 4406:2021 code counts particles of…', choices: ['4 µm(c) and larger', 'exactly 4 µm', '2 µm and larger', '5 µm and larger, by microscope'], a: 0,
      why: 'The three sizes are ≥ 4, ≥ 6 and ≥ 14 µm(c), cumulative counts from a counter calibrated to ISO 11171.' },
    { q: 'Which target would you choose for a system with servo valves?', choices: ['21/19/16', '20/18/15', '19/17/14', '16/14/11'], a: 3,
      why: 'Servo valves, with clearances of 1–4 µm, are the most sensitive common components: about 16/14/11 or cleaner.' }
  ],
  problems: [
    { q: 'What is the upper limit of scale number 15, per mL, from 0.01 × 2^R (before the standard\'s rounding)?', answer: 327.7, tol: 0.01,
      steps: ['$0.01 \\times 2^{15} = 0.01 \\times 32\\,768 = 327.7$ — the table rounds it to 320.'] }
  ],
  applications: [
    'Specifying the cleanliness of a new machine at acceptance, and of the oil delivered for it.',
    'Condition monitoring: trend the code of each machine and act when it drifts upwards.',
    'Checking that a filter change, a flushing or an off-line filter has done its job.',
    'Aerospace, wind turbines, steel mills and injection moulding, where the target code is written into maintenance manuals.'
  ],
  history: 'The first ISO 4406, of 1987, used two numbers, for particles of 5 and 15 µm and more, counted against a test dust that was later found poorly controlled. The 1999 revision brought the three-number code at 4, 6 and 14 µm(c), tied to a new calibration of particle counters (ISO 11171) with a traceable test dust; the scale itself — doubling at each step — has not changed. The current edition is ISO 4406:2021.',
  sim: 'act-iso4406'
},

{
  id: 'filtration', parent: 'contamination-topic', title: 'Filters and beta ratios', level: 2,
  short: 'A filter is rated by its beta ratio: particles upstream divided by particles downstream at a given size. Where it sits — suction, pressure, return, off-line — and how much flow passes it decide how clean the system becomes and how fast.',
  keywords: ['filter', 'filtration', 'beta ratio', 'β', 'efficiency', 'multi-pass test', 'ISO 16889', 'pressure filter', 'return filter', 'suction strainer', 'off-line filter', 'kidney loop', 'bypass valve', 'clogging indicator', 'dirt-holding capacity', 'glass fibre'],
  prereq: ['contamination', 'iso-4406', 'math:exponential-models'],
  related: ['reservoirs', 'area-ratio', 'cavitation', 'troubleshooting', 'servo-valves', 'math:first-order-odes', 'pneumatics:air-filters'],
  body: `
A filter's job is to take particles out faster than they arrive. How well it does that at each particle size is measured by one number, the **beta ratio**.

### The beta ratio
In the multi-pass test of ISO 16889 a test dust is fed steadily into oil circulating through the filter, and particle counters count upstream and downstream. For each size $x$:

$$\\beta_{x(c)} = \\frac{N_u}{N_d}$$

— the particles ≥ $x$ µm(c) per mL upstream divided by those downstream. The share caught follows directly:

$$E_x = 1 - \\frac{1}{\\beta_x}$$

| $\\beta_x$ | 2 | 10 | 20 | 75 | 200 | 1000 |
|---|---|---|---|---|---|---|
| Capture efficiency | 50 % | 90 % | 95 % | 98.7 % | 99.5 % | 99.9 % |

A filter element is described by the size at which it reaches a stated beta, for example $\\beta_{10(c)} \\ge 1000$: at least 999 of every 1000 particles ≥ 10 µm(c) are stopped. Above about 75 the efficiency changes only in its decimals, but the particles let through do not: β = 1000 passes five times fewer than β = 200. A "nominal 10 µm" rating without a beta can mean almost anything — often that only about half the 10 µm particles are caught.

Beta rises steeply with particle size. A glass-fibre element rated $\\beta_{10(c)} = 200$ may manage only 2–5 at 4 µm and many thousands at 14 µm, so a filter must be chosen for the smallest size that matters — the first number of the target code.

### Where filters go
| Position | Purpose | Typical rating |
|---|---|---|
| **Suction** strainer | keep large debris out of the pump | 100–150 µm mesh — finer suction filters starve the pump and cause [[cavitation]] |
| **Pressure** filter, after the pump | protect servo and proportional valves; catch debris from a failing pump | $\\beta_{3-10(c)} \\ge 1000$, high-pressure housing, often without a bypass |
| **Return** filter | catch what the system makes and lets in, at low pressure | $\\beta_{10-25(c)} \\ge 200$, with a bypass valve |
| **Off-line** (kidney loop) | a small pump circulating the tank through a fine filter all the time, often with a water-absorbing element or a cooler | $\\beta_{3-6(c)} \\ge 1000$ |
| **Breather** and **filling** filters | stop the dirt the tank breathes in and the dirt in new oil | 3–10 µm; desiccant breathers against moisture |

Return filters must pass the **peak** return flow, which with differential cylinders is φ times the pump flow ([[area-ratio]]). Off-line filters work best of all: a steady flow with no surges to shake particles loose, running even while the machine waits.

### Bypass valves and indicators
As an element fills with dirt its pressure drop rises. A **bypass valve**, typically set at 1.5–3.5 bar on a return filter, opens before the element collapses — and from then on dirty oil flows round it unfiltered. A **clogging indicator** warns before that point. Change the element when it trips, not by the calendar alone, and look at the old element: metal particles in it tell you something is wearing. Cold, thick oil at start-up opens the bypass briefly on every machine; that is expected.

### How clean does the system get?
In a system of volume $V$, with dirt arriving at a rate $G$ (particles per minute) and a filter passing a flow $Q$ with capture efficiency $1 - 1/\\beta$, the concentration $c$ in the tank obeys

$$V\\frac{dc}{dt} = G - Q\\left(1 - \\frac{1}{\\beta}\\right)c$$

a [[math:first-order-odes|first-order equation]]. It settles at $c = G/[Q(1 - 1/\\beta)]$ with a time constant $\\tau = V/[Q(1 - 1/\\beta)]$. Two lessons follow. The steady level falls in proportion to **more flow** through the filter and **less ingress**; once β is above about 20, a higher β barely lowers the tank level — but the oil just **downstream** of a pressure filter is another factor β cleaner, and that is what the servo valve after it sees. And cleaning up a dirty system takes several time constants. With no fresh dirt, $n$ passes through a filter leave $N_0/\\beta^n$ — a [[math:exponential-models|geometric decay]].

A 400 L system with a 60 L/min off-line filter ($\\beta$ = 200) has $\\tau$ = 6.7 min; to go from 21/19/16 down five codes (32 times fewer particles) takes $\\tau \\ln 32$ ≈ 23 min with perfect mixing — in practice hours, because tanks and dead-end lines never mix perfectly.

> [!warn] Before changing a filter element: stop the pump, release the pressure (a pressure filter holds full system pressure, and an accumulator may keep it there), let hot oil cool, and have a tray ready. Fill new elements' housings with filtered oil and bleed the air.
`,
  ideas: [
    'β_x = particles ≥ x upstream ÷ particles ≥ x downstream; efficiency = 1 − 1/β.',
    'β rises steeply with particle size; choose it at the smallest size that matters.',
    'Suction strainers are coarse; pressure filters protect sensitive valves; return filters catch what the system makes; off-line filters clean best.',
    'Bypass valves protect the element but pass dirty oil; indicators say when to change it.',
    'The tank settles where removal balances ingress: c = G/[Q(1 − 1/β)], reached over a few time constants V/[Q(1 − 1/β)].'
  ],
  pitfalls: [
    'A 10 µm filter stops everything larger than 10 µm — Only a stated beta says how many: β₁₀ = 2 lets half of them through, β₁₀ = 1000 one in a thousand.',
    'A finer suction filter protects the pump better — It restricts the pump inlet, causing cavitation that destroys the pump; fine filtration belongs on the pressure, return or off-line side.',
    'Doubling β from 200 to 400 halves the dirt in the tank — The tank level depends on the removal efficiency (99.5 % against 99.75 %) and hardly changes; the downstream concentration halves.'
  ],
  formulas: [
    {
      name: 'Beta ratio',
      expr: 'beta = Nu/Nd', tex: '\\beta_x = \\dfrac{N_u}{N_d}',
      vars: {
        beta: { name: 'beta ratio at size x', tex: '\\beta_x' },
        Nu: { name: 'particles ≥ x µm(c) per mL upstream', value: 12000, tex: 'N_u' },
        Nd: { name: 'particles ≥ x µm(c) per mL downstream', value: 60, tex: 'N_d' }
      },
      stories: { beta: 'In a multi-pass test a filter has {Nu} particles per mL upstream and {Nd} downstream at one size. What is its beta ratio?', Nd: 'A filter with a beta ratio of {beta} sees {Nu} particles per mL upstream. How many get through?' }
    },
    {
      name: 'Capture efficiency',
      expr: 'E = 1 - 1/beta', tex: 'E_x = 1 - \\dfrac{1}{\\beta_x}',
      vars: {
        E: { name: 'capture efficiency', q: 'ratio', unit: '%', tex: 'E_x' },
        beta: { name: 'beta ratio', value: 200, tex: '\\beta_x' }
      },
      stories: { E: 'What share of the particles does a filter with β = {beta} catch?', beta: 'A filter catches {E} of the particles at one size. What is its beta ratio?' }
    },
    {
      name: 'Steady contamination level',
      expr: 'c = G/(1000*Q*(1 - 1/beta))', tex: 'c = \\dfrac{G}{1000\\,Q\\,(1 - 1/\\beta_x)}',
      vars: {
        c: { name: 'steady particle count (≥ x µm) in the tank', q: false, unit: '1/mL' },
        G: { name: 'ingress of particles ≥ x µm', q: false, unit: '1/min', value: 3e7 },
        Q: { name: 'flow through the filter', q: false, unit: 'L/min', value: 100 },
        beta: { name: 'beta ratio at size x', value: 200, tex: '\\beta_x' }
      },
      note: 'Assumes the tank is well mixed; the 1000 turns litres into millilitres. Downstream of the filter the count is c/β.',
      practice: { unknowns: ['c', 'Q'] },
      stories: {
        c: 'Particles enter a system at {G} and a filter with β = {beta} passes {Q}. What particle count per mL does the tank settle at?',
        Q: 'A system takes in {G} particles; the filter has β = {beta}. What filter flow keeps the tank at {c}?'
      }
    },
    {
      name: 'Clean-up time constant',
      expr: 'tau = V/(Q*(1 - 1/beta))', tex: '\\tau = \\dfrac{V}{Q\\,(1 - 1/\\beta_x)}',
      vars: {
        tau: { name: 'time constant', q: 'time', unit: 'min', tex: '\\tau' },
        V: { name: 'oil volume', q: 'volume', unit: 'L', value: 400 },
        Q: { name: 'flow through the filter', q: 'flowrate', unit: 'L/min', value: 60 },
        beta: { name: 'beta ratio', value: 200, tex: '\\beta_x' }
      },
      note: 'With no ingress, the count falls by a factor e in each τ: a fall of 2ⁿ (n codes) takes n·τ·ln 2. Real tanks mix imperfectly and take longer.',
      stories: { tau: 'A {V} system is cleaned by a filter with β = {beta} passing {Q}. What is the clean-up time constant?', Q: 'A {V} system must clean up with a time constant of {tau}, using a filter with β = {beta}. What flow must pass the filter?' }
    },
    {
      name: 'Particles left after n passes',
      expr: 'Nn = N0/beta^n', tex: 'N_n = \\dfrac{N_0}{\\beta_x^{\\,n}}',
      vars: {
        Nn: { name: 'particles per mL after n passes', tex: 'N_n' },
        N0: { name: 'particles per mL at the start', value: 5000, tex: 'N_0' },
        beta: { name: 'beta ratio', value: 10, tex: '\\beta_x' },
        n: { name: 'number of passes', int: true, value: 2 }
      },
      note: 'A batch of oil passed through the same filter n times, with nothing added — the idealised multi-pass result.',
      stories: { Nn: 'Oil with {N0} particles per mL is passed {n} times through a filter with β = {beta}. How many are left?' }
    }
  ],
  examples: [
    {
      title: 'Rating a filter',
      q: 'In a multi-pass test a filter has 12 000 particles ≥ 10 µm(c) per mL upstream and 60 downstream. What is its beta ratio and efficiency?',
      steps: [
        '$\\beta_{10(c)} = 12\\,000/60 = 200$.',
        '$E = 1 - 1/200 = 0.995$ = 99.5 %: it stops 199 of every 200 particles of 10 µm and larger.'
      ],
      a: 'β₁₀(c) = 200, 99.5 % efficient.'
    },
    {
      title: 'Cleaning up after new oil',
      q: 'A 400 L system is filled with new oil at 21/19/16. An off-line filter with β = 200 passes 60 L/min. Ignoring fresh dirt, how long until the oil is 16/14/11?',
      steps: [
        'Time constant: $\\tau = 400/(60 \\times 0.995) = 6.7$ min.',
        'Five scale numbers: a factor of $2^5 = 32$. Time: $\\tau \\ln 32 = 6.7 \\times 3.47 = 23$ min.',
        'That assumes perfect mixing; real systems need several hours of running, and the filter must be finer at 4 µm than its 10 µm rating suggests.'
      ],
      a: 'About 23 minutes in theory; hours in practice.'
    },
    {
      title: 'Where the steady level lies',
      q: 'Particles ≥ 6 µm(c) enter a machine at $3\\times10^7$ a minute. Its return filter ($\\beta_6$ = 200) passes 100 L/min. Where does the tank settle, and what does a valve just downstream of a pressure filter with the same beta see?',
      steps: [
        '$c = 3\\times10^7/(1000 \\times 100 \\times 0.995) = 302$ per mL — scale number 15.',
        'Downstream of a pressure filter: $302/200 = 1.5$ per mL — scale number 8.',
        'Doubling the flow through the filter would halve the tank level; raising β to 1000 would barely change it, but would cut the downstream count five times.'
      ],
      a: 'About 300 per mL (15) in the tank; about 1.5 per mL just after a pressure filter.'
    }
  ],
  quiz: [
    { q: 'What capture efficiency does β = 75 correspond to?', choices: ['75 %', '93.3 %', '98.7 %', '99.9 %'], a: 2,
      why: 'E = 1 − 1/75 = 0.9867.' },
    { q: 'Which filter position protects a servo valve most directly?', choices: ['a suction strainer', 'a pressure filter just upstream of the valve', 'a return filter', 'the breather'], a: 1,
      why: 'Only a pressure-line filter cleans the oil on its way to the valve; it is often a non-bypass type with a high-collapse element.' },
    { q: 'A return filter sized for the pump flow is always big enough.', a: false,
      why: 'A retracting differential cylinder returns φ times the pump flow. The filter must pass the peak return flow without opening its bypass.' },
    { q: 'A test shows 1000 particles per mL upstream and 5 downstream. What is the beta ratio?', answer: 200, tol: 0.01,
      why: 'β = 1000/5 = 200.' },
    { q: 'A filter\'s clogging indicator has been showing red for a month. What is happening?', choices: ['the filter is filtering extra well', 'the bypass valve is probably open and the oil is passing unfiltered', 'nothing, the indicator is only advisory', 'the oil is too clean'], a: 1,
      why: 'Once the pressure drop reaches the bypass setting the valve opens and dirty oil flows round the element.' }
  ],
  problems: [
    { q: 'A 250 L system has an off-line filter with β = 1000 passing 20 L/min. What is its clean-up time constant, in minutes?', answer: 12.5, unit: 'min', tol: 0.02,
      steps: ['$\\tau = V/(Q(1 - 1/\\beta)) = 250/(20 \\times 0.999) = 12.5$ min.'] },
    { q: 'Oil with 8000 particles per mL at one size passes three times through a filter with β = 5 at that size. How many are left per mL?', answer: 64, tol: 0.01,
      steps: ['$N_3 = 8000/5^3 = 8000/125 = 64$ per mL.'] }
  ],
  applications: [
    'High-pressure filters in front of servo and proportional valves in presses, test rigs and aircraft.',
    'Return filters with bypass valves and indicators on almost every mobile machine.',
    'Off-line filter carts used to clean up new or contaminated systems, and kidney loops on large power units.',
    'Filtering new oil as it is pumped into a machine, and desiccant breathers on reservoirs.'
  ],
  history: 'The beta ratio and the multi-pass test grew out of work at Oklahoma State University\'s Fluid Power Research Center around 1970, led by E. C. Fitch, which replaced vague "nominal" and "absolute" ratings with a measured ratio of counts. It was standardised internationally and later became ISO 16889, with counters calibrated to ISO 11171.',
  sim: 'act-beta'
},

{
  id: 'troubleshooting', parent: 'contamination-topic', title: 'Troubleshooting', level: 2,
  short: 'Finding a hydraulic fault is methodical detective work: know the circuit, observe and measure, split the system in halves and test one suspect at a time. Noise, heat, slowness and drift each have a short list of usual causes.',
  keywords: ['troubleshooting', 'fault finding', 'noise', 'cavitation', 'aeration', 'heat', 'overheating', 'slow cylinder', 'drift', 'creep', 'erratic motion', 'flow test', 'volumetric efficiency', 'case drain', 'thermal contraction', 'infrared thermometer', 'test point'],
  prereq: ['hydraulic-system', 'reading-circuit-diagrams', 'energy-losses-heat', 'contamination'],
  related: ['hydraulic-safety', 'relief-valve', 'cavitation', 'air-in-oil', 'pump-efficiencies', 'seals', 'pilot-check', 'heat-coolers', 'filtration', 'pneumatics:troubleshooting-pneu'],
  body: `
Troubleshooting a hydraulic system is detective work with a pressure gauge: understand how it should work, find out exactly how it misbehaves, and test the suspects one at a time. Most faults come down to a handful of causes — and most of those come back to contamination, air or heat.

> [!warn] Safety before anything else. Before opening any part of a hydraulic system, lower or mechanically support every load, stop and lock out the power unit, discharge accumulators and release trapped pressure — then check that the gauges read zero. Never loosen a fitting to "see if there is pressure", never feel for a leak with a hand (pass a piece of card along the line), and keep clear of hot oil and surfaces. See [[hydraulic-safety]].

### A method
1. **Know the circuit.** Get the diagram ([[reading-circuit-diagrams]]) and the settings: relief pressures, flows, what each valve should do in each step of the cycle.
2. **Ask and observe.** When did it start, and after what? One function or all? Hot or cold? Listen, look, and take temperatures with an infrared thermometer.
3. **Check the simple things first**: oil level, filter indicators, the electrical signal to each solenoid, visible leaks, and the oil itself (milky = water, dark and burnt-smelling = overheating, foamy = air).
4. **Measure**: pressures at the test points built into manifolds for this purpose, flow with a flow tester, temperatures, solenoid currents.
5. **Split the system** into halves — supply, pressure control, direction control, actuator — and find which half holds the fault.
6. **Fix the cause, not the symptom**: a pump worn out by dirty oil will wear out its replacement too.

### Symptoms and usual causes
| Symptom | Usual causes |
|---|---|
| **Pump whines or rattles** | cavitation — blocked suction strainer, suction line too small or long, oil too cold and thick, pump too fast, tank too far below the pump ([[cavitation]]); aeration — air drawn in at a loose suction fitting or shaft seal, low oil level, returns splashing above the oil ([[air-in-oil]]) |
| **Squeal or chatter** | relief valve chattering near its setting; worn or misadjusted valve; resonance in pipes |
| **Oil too hot** | flow over a relief valve (pump not unloaded, relief set below the working pressure, valve stuck open); internal leakage in a worn pump, motor, valve or cylinder; cooler fouled or its fan stopped; lines and valves too small; wrong viscosity; low oil level ([[heat-coolers]]) |
| **Slow or no movement** | pump worn or turning slowly; relief valve open or set too low; valve not fully shifted (low voltage, sticking spool, silt); flow control closed down; internal leakage; load too heavy for the pressure |
| **Held load drifts** | spool-valve leakage (hold with poppet [[pilot-check|pilot-operated checks]]); piston seal bypassing; leaking counterbalance or cross-port relief valve; oil cooling and contracting |
| **Jerky or erratic motion** | air in the actuator or lines; stick-slip in seals; dirt in valves; unstable proportional control |
| **Bangs and shocks** | valves switching too fast; large volumes not decompressed; cushions misadjusted; water hammer in long lines |
| **External leaks** | worn or wrong seals, overpressure, loose or badly made fittings, vibration, hoses past their life |

### Three tests worth knowing
**The thermometer.** Oil throttled through a valve without doing work turns all its pressure energy into heat, so it leaves hotter by

$$\\Delta T = \\frac{\\Delta p}{\\rho\\,c_p}$$

about 0.6 K for every 10 bar in mineral oil. A relief valve whose outlet line runs 10 °C warmer than its inlet is passing oil at about 160 bar — that is where the heat comes from. The same trick finds a bypassing piston seal (a warm return line from a cylinder that should be idle) or a worn pump (a hot case drain).

**The flow test.** A pump's volumetric efficiency is its measured flow at working pressure divided by its theoretical flow, $\\eta_v = Q/(V_g n)$ ([[pump-efficiencies]]). New gear and piston pumps give roughly 90–97 %; one that has lost 10–15 % of its new flow at working pressure is usually due for replacement. A piston pump's case-drain flow tells the same story: if it has grown to about twice its value when new, the pump is wearing.

**Drift that is not a leak.** A cylinder holding a load on trapped oil drifts when the oil cools, because oil shrinks by about 0.07 % per kelvin (steel much less). A 1 m column cooling by 20 K shortens by about 14 mm — with every seal perfect:

$$x = L\\,\\alpha\\,\\Delta T$$

Measure the oil temperature before blaming the seals.

Testing a cylinder's piston seal for bypass is done only by the machine's own procedure: the load supported or the cylinder against its end stop, one end pressurised, and what comes out of the other port collected in a container through a proper hose — never from an open port pointing at anyone. Remember that blocking the rod end while pressurising the cap end multiplies the pressure by the [[area-ratio]].
`,
  ideas: [
    'Work from the circuit diagram: observe, check the simple things, measure, split the system, fix the root cause.',
    'Noise is mostly cavitation or aeration at the pump; heat is mostly flow over a relief valve or internal leakage.',
    'Throttled oil heats by Δp/(ρc_p), about 0.6 K per 10 bar: a thermometer finds where the energy is lost.',
    'A flow test at working pressure gives the pump\'s volumetric efficiency; a rising case drain means wear.',
    'A held load can drift through valve leakage, seal bypass — or simply because the oil cools and shrinks.'
  ],
  pitfalls: [
    'A drifting cylinder always has a worn piston seal — Spool valves leak through their clearance, and trapped oil contracts as it cools; both cause drift with perfect seals.',
    'If the pressure gauge reaches the relief setting, the pump is fine — A worn pump still reaches full pressure when dead-headed; only its flow at working pressure shows the wear.',
    'Raising the relief setting cures a slow machine — If the pump is worn or the valve bypassing, a higher setting only adds heat and risk; find why the flow is missing.'
  ],
  formulas: [
    {
      name: 'Temperature rise of oil throttled through a valve',
      expr: 'dT = dp/(rho*cp)', tex: '\\Delta T = \\dfrac{\\Delta p}{\\rho\\,c_p}',
      vars: {
        dT: { name: 'temperature rise', q: 'dtemp', unit: 'K', tex: '\\Delta T' },
        dp: { name: 'pressure drop across the valve', q: 'pressure', unit: 'bar', value: 160, tex: '\\Delta p' },
        rho: { name: 'oil density', q: 'density', unit: 'kg/m³', value: 870, tex: '\\rho' },
        cp: { name: 'specific heat of the oil', q: 'specificheat', unit: 'kJ/(kg·K)', value: 1.9, tex: 'c_p' }
      },
      note: 'Assumes no heat is lost on the way through; measure just upstream and just downstream of the valve.',
      stories: {
        dT: 'Oil drops {dp} across a relief valve without doing work. How much hotter is it downstream?',
        dp: 'The outlet line of a valve runs {dT} hotter than its inlet. Roughly what pressure drop is the oil passing through it?'
      }
    },
    {
      name: 'Volumetric efficiency from a flow test',
      expr: 'etav = Q/(Vg*n)', tex: '\\eta_v = \\dfrac{Q}{V_g\\,n}',
      vars: {
        etav: { name: 'volumetric efficiency', q: 'ratio', unit: '%', tex: '\\eta_v' },
        Q: { name: 'measured flow at working pressure', q: 'flowrate', unit: 'L/min', value: 57 },
        Vg: { name: 'pump displacement', q: 'displacement', unit: 'cm³/rev', value: 45, tex: 'V_g' },
        n: { name: 'shaft speed', q: 'frequency', unit: 'rpm', value: 1480 }
      },
      stories: {
        etav: 'A {Vg} pump turning at {n} delivers {Q} at working pressure. What is its volumetric efficiency?',
        Q: 'A {Vg} pump at {n} should have a volumetric efficiency of at least {etav}. What flow should a test show?'
      }
    },
    {
      name: 'Drift of a locked cylinder as its oil cools',
      expr: 'x = L*alpha*dT', tex: 'x = L\\,\\alpha\\,\\Delta T',
      vars: {
        x: { name: 'drift of the piston', q: 'length', unit: 'mm' },
        L: { name: 'length of the oil column holding the load', q: 'length', unit: 'mm', value: 1000 },
        alpha: { name: 'volumetric expansion coefficient of the oil', q: 'expansion', unit: '1/K', value: 0.0007, tex: '\\alpha' },
        dT: { name: 'cooling of the oil', q: 'dtemp', unit: 'K', value: 20, tex: '\\Delta T' }
      },
      note: 'For oil trapped in the cylinder chamber itself; oil in hoses and pipes adds its share. The steel contracts too, but about twenty times less.',
      stories: { x: 'A cylinder holds a load on a column of oil {L} long, which cools by {dT}. How far does the piston drift?', dT: 'A cylinder holding a load on {L} of oil has drifted {x} overnight with no leaks. How much has the oil cooled?' }
    }
  ],
  examples: [
    {
      title: 'Finding the heat',
      q: 'A power unit runs hot. With the machine idle, the line leaving the relief valve is 9.7 °C warmer than the pump outlet. The relief is set at 160 bar and the pump delivers 60 L/min. What is happening, and how much power is wasted?',
      steps: [
        'Throttling from 160 bar: $\\Delta T = 1.6\\times10^7/(870 \\times 1900) = 9.7$ K. The whole pump flow is crossing the relief valve at full pressure.',
        'Power into heat: $P = pQ = 1.6\\times10^7 \\times 10^{-3} = 16$ kW.',
        'The circuit is not unloading the pump while idle — a closed-centre valve with a fixed pump, or an unloading valve that has failed. A tandem centre or a working unloading valve would bring the heat down to a few hundred watts.'
      ],
      a: 'All the pump flow is going over the relief valve: about 16 kW of heat.'
    },
    {
      title: 'Is the pump worn?',
      q: 'A 45 cm³/rev gear pump turns at 1480 rpm and delivers 57 L/min at its working pressure of 200 bar. What is its volumetric efficiency?',
      steps: [
        'Theoretical flow: $45 \\times 1480 = 66\\,600$ cm³/min = 66.6 L/min.',
        '$\\eta_v = 57/66.6 = 0.856$ = 86 %.',
        'A new gear pump would give about 93–95 % at that pressure: this one has lost around 9–10 % of its flow and should be watched — and the oil\'s cleanliness checked, since dirt is what wears pumps.'
      ],
      a: 'About 86 % — noticeably worn.'
    },
    {
      title: 'The overnight drift',
      q: 'A press ram holds a die on 1 m of trapped oil at 50 °C. Overnight the oil cools to 30 °C. How far does the ram sink?',
      steps: [
        '$x = L\\,\\alpha\\,\\Delta T = 1000 \\times 7\\times10^{-4} \\times 20 = 14$ mm.',
        'No seal or valve is leaking: the oil has simply shrunk. Mechanical locks or props, not hydraulics, must hold a die that people work under.'
      ],
      a: 'About 14 mm, with every seal perfect.'
    }
  ],
  quiz: [
    { q: 'A pump whines loudly and the oil in the tank is foamy. What is the most likely cause?', choices: ['the relief valve is set too high', 'air is being drawn in on the suction side', 'the cylinder seals are worn', 'the oil is too clean'], a: 1,
      why: 'Foam and a whine point to aeration: air entering at a loose suction fitting, a leaking shaft seal, a low oil level or returns splashing above the oil.' },
    { q: 'A machine with a fixed pump and a closed-centre valve overheats when it stands idle. Where is the heat made?', choices: ['in the cylinders', 'at the relief valve', 'in the filter', 'in the cooler'], a: 1,
      why: 'With every port blocked, the whole pump flow crosses the relief valve at its setting: all that power becomes heat.' },
    { q: 'About how much does oil heat up when throttled from 100 bar to tank pressure?', answer: 6, unit: 'K', tol: 0.1,
      why: 'ΔT = Δp/(ρc_p) = 10⁷/(870 × 1900) ≈ 6 K.' },
    { q: 'A cylinder that drifts under load always has a leaking piston seal.', a: false,
      why: 'Spool valves leak through their clearances and cooling oil contracts; both cause drift with the seals in perfect order.' },
    { q: 'What comes first before opening any part of a hydraulic system?', choices: ['loosening a fitting to check for pressure', 'supporting loads, locking out the power and releasing stored pressure', 'running the pump to warm the oil', 'removing the filter'], a: 1,
      why: 'Stored energy — raised loads, trapped pressure, accumulators — must be made safe and the power locked out before anything is opened.' }
  ],
  problems: [
    { q: 'A 28 cm³/rev pump at 1450 rpm delivers 36 L/min at working pressure. What is its volumetric efficiency, in per cent?', answer: 88.7, unit: '%', tol: 0.02,
      steps: ['Theoretical flow: $28 \\times 1450 = 40\\,600$ cm³/min = 40.6 L/min.', '$\\eta_v = 36/40.6 = 0.887$ = 88.7 %.'] }
  ],
  applications: [
    'Maintenance of mobile machines in the field with a flow tester, pressure gauges and an infrared thermometer.',
    'Energy audits of industrial power units, finding relief valves and leaking components that turn power into heat.',
    'Condition monitoring with pressure, temperature and particle sensors, predicting faults before they stop production.',
    'Commissioning new machines: checking settings and flows against the circuit diagram.'
  ],
  sim: 'ref-hyd-circuit'
},

{
  id: 'hydraulic-safety', parent: 'contamination-topic', title: 'Hydraulic safety', level: 1,
  short: 'Hydraulic systems keep their energy after they are switched off — in trapped pressure, accumulators and raised loads. Safe work means lock-out and a proven zero-energy state; the special dangers are oil injected through the skin, whipping hoses, hot oil and fire.',
  keywords: ['safety', 'stored energy', 'lock-out', 'tag-out', 'LOTO', 'injection injury', 'high-pressure injection', 'hose whip', 'burns', 'accumulator', 'nitrogen', 'trapped pressure', 'raised load', 'ISO 4413', 'ISO 12100', 'fire', 'hose restraint'],
  prereq: ['hydraulic-system', 'hydraulic-cylinder', 'accumulators'],
  related: ['troubleshooting', 'hoses-fittings', 'load-holding', 'fire-resistant-fluids', 'accumulator-circuits', 'area-ratio', 'intensifiers', 'water-hammer', 'pneumatics:pneumatic-safety'],
  body: `
Hydraulic machines hurt people in a few well-known ways, and nearly all of them come from energy that is still there after the machine has been switched off.

### Stored energy
Stopping the pump does not make a hydraulic system safe. Energy remains in:
- **Trapped pressure**: oil locked in cylinders and lines by check valves, pilot-operated checks, counterbalance valves or a closed-centre valve — at full working pressure, for hours.
- **Accumulators**: a gas-charged accumulator holds its oil at pressure until it is deliberately discharged. A 10 L accumulator charged from 90 to 210 bar stores about 77 kJ — enough to lift a 1.5-tonne car more than 5 m.
- **Raised loads**: a boom, a tipper body, a press ram or a fork held up only by oil. Cut a hose or loosen a fitting and it falls.
- **Springs and motion**: spring-return cylinders and valves, and heavy loads still coasting.
- **Heat**: oil at 60–80 °C and surfaces hotter still; a spray of hot oil burns and can catch fire.

### Lock-out, tag-out, try-out
Before maintenance every energy source is isolated and made safe, in order:
1. Tell the people affected and stop the machine normally.
2. **Lower loads to the ground or support them mechanically** — props, blocks, the maker's safety struts — never on the hydraulics alone.
3. **Isolate** the power: switch off and padlock the electrical isolator, each worker with a personal lock and tag; stop engines and remove the key.
4. **Release the pressure**: open the accumulator's discharge valve and watch its gauge fall; with the loads supported, operate the control valves both ways to vent trapped oil; release oil trapped behind check and counterbalance valves by the maker's method.
5. **Try out**: confirm the gauges read zero and the machine cannot start or move.
6. Only then work; afterwards remove tools, refit guards and take off the locks when everyone is clear.

### High-pressure injection
Oil escaping from a pinhole or a hairline crack leaves as a jet as thin as a needle, at a speed of $\\sqrt{2p/\\rho}$ — about 214 m/s at 200 bar. It passes through skin as if it were not there. Injection injuries have been reported at pressures as low as about 7 bar.

> [!warn] A hydraulic injection injury looks like a small puncture and may hardly hurt at first, but the oil is spreading through the tissue and destroying it. It is a **surgical emergency**: seek emergency medical care at once — call your local emergency number — and tell the doctors that hydraulic oil was injected under pressure. Delay can cost a finger, a hand or a life.

Never search for a leak with your hand or finger: pass a piece of cardboard or wood along the suspect line, and wear eye protection and gloves. Never hold or bend a hose, or tighten a fitting, while it is under pressure.

### Hoses and fittings
A failing hose or fitting releases a jet, and the free end of a hose can **whip** with great force: the jet's reaction is about $2pA$ — some 5 kN for a 12.7 mm bore at 200 bar. Prevention: hoses and fittings rated for the pressure and assembled by a competent shop; routing without twists, tight bends or rubbing; **whip restraints** and **shields or sleeves** on hoses near people; replacement at the first sign of damage — blisters, cracks, weeping, exposed wire — and on age (DIN 20066 recommends at most six years of service including storage). See [[hoses-fittings]].

### Other hazards
- **Crushing and unexpected movement**: a valve shifted by hand or by a stray signal, a load creeping down. Load-holding valves mounted directly on the cylinder stop a load falling if a hose bursts ([[load-holding]]).
- **Pressure multiplication**: a blocked rod end or an intensifier can raise pressures far above the relief setting ([[area-ratio]], [[intensifiers]]).
- **Accumulators**: charge only with dry **nitrogen** — never oxygen or air, which can explode with oil — using the proper charging kit; check the precharge only with the oil side discharged.
- **Fire**: a fine oil mist from a small leak ignites easily on hot surfaces; fire-resistant fluids are used where the risk is high ([[fire-resistant-fluids]]).
- **Slips, noise and spills**: oil on floors and steps, pump noise, oil in drains and soil.

### Standards
Hydraulic systems on machines are designed to ISO 4413:2010 (general rules and safety requirements for hydraulic fluid power), after a risk assessment to ISO 12100:2010; safety-related control functions are rated by performance level under ISO 13849-1. The machine's own manual and local regulations govern any work on it.
`,
  ideas: [
    'Switching off does not remove the energy: trapped pressure, accumulators, raised loads and heat remain.',
    'Lock-out, tag-out, try-out: support the loads, isolate and lock the power, release the pressure, prove zero energy.',
    'An oil injection injury is a surgical emergency, however small it looks; never feel for leaks by hand.',
    'Hoses can whip and spray: restraints, shields, correct assembly and timely replacement.',
    'Accumulators are charged with nitrogen only; blocked rod ends and intensifiers can exceed the relief setting.'
  ],
  pitfalls: [
    'With the pump stopped, the system is safe — Accumulators, check valves and raised loads keep energy for hours; it must be released and proved gone.',
    'A tiny puncture from oil is a minor injury — Injected oil destroys tissue from the inside; it needs emergency surgery at once.',
    'Cracking a fitting is a quick way to release pressure — It sprays oil at full pressure towards the person holding the spanner; use the designed release valves.'
  ],
  formulas: [
    {
      name: 'Speed of a jet from a pinhole',
      expr: 'v = sqrt(2*p/rho)', tex: 'v = \\sqrt{\\dfrac{2p}{\\rho}}',
      vars: {
        v: { name: 'jet speed', q: 'speed', unit: 'm/s' },
        p: { name: 'pressure in the line (gauge)', q: 'pressure', unit: 'bar', value: 200 },
        rho: { name: 'oil density', q: 'density', unit: 'kg/m³', value: 870, tex: '\\rho' }
      },
      note: 'An ideal jet; a real pinhole jet is a little slower, but still fast enough to pierce skin.',
      stories: { v: 'Oil at {p} escapes from a pinhole. How fast is the jet?', p: 'A jet of oil leaves a crack at {v}. What is the pressure in the line?' }
    },
    {
      name: 'Energy stored in a gas accumulator (isothermal)',
      expr: 'E = p0*V0*ln(p2/p0)', tex: 'E = p_0 V_0 \\ln\\dfrac{p_2}{p_0}',
      vars: {
        E: { name: 'energy the oil can deliver', q: 'energy', unit: 'kJ' },
        p0: { name: 'precharge pressure (absolute)', q: 'pressure', unit: 'bar', value: 91, min: 1, max: 1000, tex: 'p_0' },
        V0: { name: 'gas volume at precharge (nominal size)', q: 'volume', unit: 'L', value: 10, tex: 'V_0' },
        p2: { name: 'charged pressure (absolute)', q: 'pressure', unit: 'bar', value: 211, tex: 'p_2' }
      },
      note: 'Absolute pressures: add about 1 bar to the gauge readings. A fast (adiabatic) discharge delivers somewhat less.',
      stories: { E: 'A {V0} accumulator precharged to {p0} is charged to {p2} (both absolute). How much energy can it release?' }
    },
    {
      name: 'Reaction of a jet from an open hose end (ideal)',
      expr: 'F = p*pi*d^2/2', tex: 'F \\approx 2p\\,\\dfrac{\\pi d^2}{4}',
      vars: {
        F: { name: 'reaction force on the hose end', q: 'force', unit: 'kN' },
        p: { name: 'pressure in the hose (gauge)', q: 'pressure', unit: 'bar', value: 200 },
        d: { name: 'bore of the hose', q: 'length', unit: 'mm', value: 12.7 }
      },
      note: 'The momentum flux of an ideal jet, ρAv² = 2pA; losses make the real force somewhat smaller, but it can still swing a hose like a flail.',
      stories: { F: 'A {d} bore hose at {p} is torn from its fitting. What force does the escaping jet exert on its free end?' }
    }
  ],
  examples: [
    {
      title: 'A pinhole at 200 bar',
      q: 'A hose has a pinhole leak at 200 bar. How fast is the jet, and why is it dangerous?',
      steps: [
        '$v = \\sqrt{2 \\times 2\\times10^7/870} = 214$ m/s.',
        'A jet a fraction of a millimetre thick at over 200 m/s concentrates its force on a tiny area and pierces skin; oil then spreads along the tissue.',
        'The leak is found with a piece of card held at a safe distance — never a hand — and the hose is replaced with the system depressurised.'
      ],
      a: 'About 214 m/s — fast enough to inject oil through the skin.'
    },
    {
      title: 'The energy in an accumulator',
      q: 'A 10 L accumulator is precharged with nitrogen to 90 bar and charged to 210 bar (gauge). How much energy does it store, if it discharges slowly?',
      steps: [
        'Absolute pressures: $p_0 = 91$ bar, $p_2 = 211$ bar.',
        '$E = p_0 V_0 \\ln(p_2/p_0) = 9.1\\times10^6 \\times 0.01 \\times \\ln(211/91) = 91\\,000 \\times 0.841 = 76.5$ kJ.',
        'That would lift a 1500 kg car $76\\,500/(1500 \\times 9.81) = 5.2$ m. Released through a loosened fitting it drives oil out at full pressure — which is why accumulators are discharged, and the gauge checked, before any work.'
      ],
      a: 'About 77 kJ.'
    },
    {
      title: 'A hose that whips',
      q: 'A 12.7 mm bore hose at 200 bar pulls out of its fitting. Estimate the reaction force of the jet on the free end.',
      steps: [
        'Area: $\\pi \\times 0.0127^2/4 = 1.27\\times10^{-4}$ m².',
        '$F \\approx 2pA = 2 \\times 2\\times10^7 \\times 1.27\\times10^{-4} = 5.1$ kN — the weight of half a tonne, swinging a steel-reinforced hose.',
        'Whip restraints anchored to the machine hold the hose ends; shields stop the jet.'
      ],
      a: 'About 5 kN.'
    }
  ],
  quiz: [
    { q: 'A machine\'s pump has been switched off. Is it safe to disconnect a cylinder hose?', choices: ['yes, with the pump off there is no pressure', 'only after the load is supported, the power locked out and the trapped pressure released and checked', 'yes, if done slowly', 'only if the oil is cold'], a: 1,
      why: 'Check valves, counterbalance valves and accumulators keep pressure after the pump stops, and a raised load keeps pushing on its oil.' },
    { q: 'A worker feels a sting while wiping a hose at 150 bar and sees a tiny puncture in a finger. What should happen?', choices: ['clean it and carry on', 'watch it for a day', 'emergency medical care at once, telling the doctors oil was injected', 'put a plaster on it'], a: 2,
      why: 'A high-pressure injection injury is a surgical emergency, however small it looks: the oil destroys tissue as it spreads.' },
    { q: 'What is the right way to look for a suspected pinhole leak?', choices: ['run a hand along the hose', 'pass a piece of cardboard along it at a safe distance', 'loosen fittings one by one', 'squeeze the hose'], a: 1,
      why: 'Cardboard or wood shows the jet without putting skin in its path; with eye protection and gloves.' },
    { q: 'A hydraulic accumulator should be precharged with…', choices: ['oxygen', 'compressed air', 'dry nitrogen', 'any gas at hand'], a: 2,
      why: 'Nitrogen is inert. Oxygen or air with oil under compression can ignite and explode (the diesel effect).' },
    { q: 'How fast is an ideal jet of oil (870 kg/m³) from a pinhole at 100 bar?', answer: 152, unit: 'm/s', tol: 0.02,
      why: 'v = √(2p/ρ) = √(2 × 10⁷/870) = 152 m/s.' }
  ],
  problems: [
    { q: 'A 4 L accumulator is precharged to 50 bar and charged to 150 bar (absolute). How much energy does it store (isothermal)?', answer: 22.0, unit: 'kJ', tol: 0.02,
      steps: ['$E = p_0 V_0 \\ln(p_2/p_0) = 5\\times10^6 \\times 0.004 \\times \\ln 3$.', '$= 20\\,000 \\times 1.0986 = 22.0$ kJ.'] }
  ],
  applications: [
    'Lock-out procedures for excavators, presses, injection-moulding machines and aircraft ground maintenance.',
    'Hose restraints and shields on test benches, mining machines and anywhere people work near high-pressure hoses.',
    'Load-holding valves on crane, platform and loader cylinders that keep loads up if a hose bursts.',
    'Training of fitters and operators, where injection injuries and stored energy are the first lessons.'
  ]
}


);
