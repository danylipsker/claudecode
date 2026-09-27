/* HYPER-HYDRAULICS · content/reference.js — the reference concept for hydraulics authors:
 * its depth, tone, numbers, safety wording and layout are the model (see also sims/reference.js). */
Hyper.add(

{
  id: 'hydraulic-cylinder', parent: 'cylinders', title: 'The hydraulic cylinder', level: 1,
  short: 'A piston in a tube: oil pressure on the full piston area pushes the rod out, pressure on the ring around the rod pulls it in. Force is pressure times area, speed is flow divided by area, and their product is the hydraulic power.',
  keywords: ['hydraulic cylinder', 'ram', 'piston', 'rod', 'bore', 'annulus', 'force', 'speed', 'double-acting', 'area ratio', 'extend', 'retract', 'push', 'pull'],
  prereq: ['pascals-law', 'pressure-flow-power', 'flow-rate', 'physics:pressure'],
  related: ['area-ratio', 'cylinder-speed', 'cylinder-types', 'rod-buckling', 'cushioning', 'regenerative-circuit', 'basic-circuit', 'directional-valves', 'relief-valve'],
  body: `
A hydraulic cylinder is the simplest way there is to turn fluid power into a straight push. A steel tube — the **barrel** — is closed at one end by the **cap** and at the other by the **head**, through which a polished **rod** slides. Inside, a **piston** on the end of the rod divides the barrel into two chambers, each with a port. Pump oil into the cap-end chamber and the piston is pushed along, driving the rod out; pump oil into the rod-end chamber and it is pulled back. That is a **double-acting** cylinder, the workhorse of every excavator, press and loader.

### Force is pressure times area
Pressure acts on every square millimetre of the piston, so the force is simply

$$F = p\\,A, \\qquad A_1 = \\frac{\\pi D^2}{4}, \\qquad A_2 = \\frac{\\pi\\,(D^2 - d^2)}{4}$$

where $D$ is the **bore** (piston diameter) and $d$ the rod diameter. On the way out the oil pushes on the full piston area $A_1$; on the way back it pushes only on the **annulus** $A_2$, the ring around the rod — so a cylinder pulls with less force than it pushes. A 63 mm bore at 200 bar pushes with $2\\times10^7 \\times 3.12\\times10^{-3} = 62$ kN — the weight of more than six tonnes — from a tube you could hold in one hand.

With pressure on both sides the net force is the difference:

$$F = p_1 A_1 - p_2 A_2$$

The oil leaving the other chamber is never at zero pressure: it must flow back through the valve and the return line, and that **back-pressure** $p_2$ costs force. In a meter-out circuit it is made deliberately high to control the speed (see [[meter-in-out]]).

| Bore × rod (mm) | $A_1$ (cm²) | $A_2$ (cm²) | Push at 160 bar | Pull at 160 bar |
|---|---|---|---|---|
| 32 × 18 | 8.04 | 5.50 | 12.9 kN | 8.8 kN |
| 63 × 36 | 31.2 | 21.0 | 49.9 kN | 33.6 kN |
| 100 × 56 | 78.5 | 53.9 | 126 kN | 86 kN |
| 200 × 140 | 314 | 160 | 503 kN | 256 kN |

### Speed is flow divided by area
The pump delivers a volume of oil per second; the piston must sweep that volume. So

$$v = \\frac{Q}{A}$$

and the rod retracts **faster** than it extends, because the same flow fills the smaller annulus. A pump giving 22 L/min ($3.67\\times10^{-4}$ m³/s) moves a 63 mm piston out at 0.12 m/s and back at 0.17 m/s. The oil pushed out of the other side is not equal to the pump flow either: when the rod retracts, the cap end returns $A_1/A_2$ times the pump flow — 1.5 times here — and the return line and valve must be sized for it (see [[area-ratio]]).

### Power
Multiply force by speed and the areas cancel:

$$P = F\\,v = p\\,Q$$

A cylinder is a converter: pressure becomes force, flow becomes speed, and the power in is the power out, less friction and leakage. Force is set by the **load**, not by the pump: the pressure rises only as high as the load needs, and the pump simply keeps pushing oil in. If the load needs more than the relief-valve setting allows, the relief valve opens, the pump's flow goes back to the tank, and the cylinder stalls — the whole of the pump's power then turns into heat.

> [!key] Pressure is set by the load and limited by the relief valve; speed is set by the flow; force and speed trade through the area. Choose the bore for the force, then the pump for the speed.

### What else a designer checks
- **Buckling**: a long, thin rod pushing a heavy load fails like a slender column — see [[rod-buckling]].
- **Cushioning**: a heavy load arriving at the end of the stroke at full speed hammers the end caps; cushions throttle the last few centimetres (see [[cushioning]]).
- **Side loads** wear the rod bearing and seals; mountings and guides must keep the load in line (see [[mounting-side-load]]).
- **Seals** hold the pressure but leak a little and add friction, typically 2–5 % of the force (see [[seals]]).
- **Intensification**: if the cap end is blocked while the annulus is pressurised — or the rod end is blocked while the cap end is driven — the trapped side can reach pressures far above the pump's, by the area ratio. Blocked rod-end ports have burst cylinders.

> [!warn] A raised load on a cylinder is stored energy. Before any work on a machine, lower or mechanically support the load, stop the pump, release the pressure and lock out the machine. Never search for a leak with your hand: oil from a pinhole at high pressure can be injected through the skin — an injury that looks small but needs emergency surgery. Seek emergency medical care at once.
`,
  ideas: [
    'Force = pressure × area: the full piston area pushes, the annulus around the rod pulls.',
    'Speed = flow ÷ area: the same pump flow retracts the rod faster than it extends it.',
    'Hydraulic power p·Q equals mechanical power F·v, less friction and leakage.',
    'The load sets the pressure; the relief valve caps it; a stalled cylinder turns all the pump power into heat.',
    'Back-pressure on the outlet side costs force, and blocked ports can intensify pressure dangerously.'
  ],
  pitfalls: [
    'A bigger pump makes a cylinder stronger — The pump sets the flow and so the speed. Force comes from pressure (limited by the relief valve) times area.',
    'The cylinder pulls as hard as it pushes — The rod takes away part of the area on the rod side, so at the same pressure the pull is smaller (and the retraction faster).',
    'The oil returning to the tank is at zero pressure — It must flow through the valve and the return line, so there is always some back-pressure, and it reduces the net force.'
  ],
  formulas: [
    {
      name: 'Piston area',
      expr: 'A1 = pi*D^2/4', tex: 'A_1 = \\dfrac{\\pi D^2}{4}',
      vars: {
        A1: { name: 'piston (cap-end) area', q: 'area', unit: 'cm²', tex: 'A_1' },
        D: { name: 'bore', q: 'length', unit: 'mm', value: 63 }
      },
      stories: { A1: 'What is the piston area of a cylinder with a bore of {D}?', D: 'A cylinder needs a piston area of {A1}. What bore does that take?' }
    },
    {
      name: 'Annulus (rod-end) area',
      expr: 'A2 = pi*(D^2 - d^2)/4', tex: 'A_2 = \\dfrac{\\pi\\,(D^2 - d^2)}{4}',
      vars: {
        A2: { name: 'annulus (rod-end) area', q: 'area', unit: 'cm²', tex: 'A_2' },
        D: { name: 'bore', q: 'length', unit: 'mm', value: 63 },
        d: { name: 'rod diameter', q: 'length', unit: 'mm', value: 36 }
      },
      stories: { A2: 'A cylinder has a bore of {D} and a rod of {d}. What is the area of the annulus?' }
    },
    {
      name: 'Cylinder force',
      expr: 'F = p1*A1 - p2*A2', tex: 'F = p_1 A_1 - p_2 A_2',
      vars: {
        F: { name: 'net force (extending)', q: 'force', unit: 'kN', signed: true },
        p1: { name: 'cap-end pressure (gauge)', q: 'pressure', unit: 'bar', value: 160, tex: 'p_1' },
        A1: { name: 'piston area', q: 'area', unit: 'cm²', value: 31.2, tex: 'A_1' },
        p2: { name: 'rod-end back-pressure (gauge)', q: 'pressure', unit: 'bar', value: 5, tex: 'p_2' },
        A2: { name: 'annulus area', q: 'area', unit: 'cm²', value: 21.0, tex: 'A_2' }
      },
      note: 'Gauge pressures: the atmosphere pushes on both sides and on the rod end outside, and cancels to within a few newtons. Seal friction takes a further 2–5 %.',
      practice: { unknowns: ['F', 'p1'] },
      stories: {
        F: 'A cylinder with {A1} of piston area and {A2} of annulus has {p1} on the cap end and {p2} of back-pressure on the rod end. What is the net force?',
        p1: 'A cylinder with a piston area of {A1} and an annulus of {A2} must push {F} against a back-pressure of {p2}. What cap-end pressure does it need?'
      }
    },
    {
      name: 'Cylinder speed',
      expr: 'v = Q/A', tex: 'v = \\dfrac{Q}{A}',
      vars: {
        v: { name: 'rod speed', q: 'speed', unit: 'm/s' },
        Q: { name: 'flow into the cylinder', q: 'flowrate', unit: 'L/min', value: 22 },
        A: { name: 'area the flow acts on', q: 'area', unit: 'cm²', value: 31.2 }
      },
      note: 'Use A₁ for extending and A₂ for retracting. Internal leakage past the piston seal makes the real speed slightly lower.',
      practice: { unknowns: ['v', 'Q'] },
      stories: { v: 'A pump sends {Q} into a cylinder whose piston area is {A}. How fast does the rod move?', Q: 'A rod must move at {v} with a piston area of {A}. What flow does it need?' }
    },
    {
      name: 'Hydraulic power',
      expr: 'P = p*Q', tex: 'P = p\\,Q',
      vars: {
        P: { name: 'hydraulic power', q: 'power', unit: 'kW' },
        p: { name: 'pressure (gauge)', q: 'pressure', unit: 'bar', value: 160 },
        Q: { name: 'flow', q: 'flowrate', unit: 'L/min', value: 22 }
      },
      note: 'A handy rule: P (kW) = p (bar) × Q (L/min) / 600. The same product gives the heat when oil flows over a relief valve.',
      stories: { P: 'Oil flows at {Q} under a pressure of {p}. How much power does it carry?', Q: 'A {P} power pack works at {p}. What flow can it deliver?' }
    }
  ],
  examples: [
    {
      title: 'Choosing a bore',
      q: 'A press must push 100 kN. The pump\'s relief valve is set to 200 bar, and the designer allows 15 % for back-pressure, friction and pressure losses. What bore is needed?',
      steps: [
        'Usable pressure: $200 \\times 0.85 = 170$ bar $= 1.7\\times10^7$ Pa.',
        'Area: $A_1 = F/p = 10^5 / 1.7\\times10^7 = 5.88\\times10^{-3}$ m² = 58.8 cm².',
        'Bore: $D = \\sqrt{4A_1/\\pi} = \\sqrt{4 \\times 5.88\\times10^{-3}/\\pi} = 0.0865$ m = 86.5 mm.',
        'The next standard bore (ISO 3320) is 100 mm, which at 170 bar gives 134 kN — a margin the designer can use to lower the working pressure.'
      ],
      a: 'At least 86.5 mm; the standard 100 mm bore is chosen.'
    },
    {
      title: 'Out and back',
      q: 'A 63/36 cylinder with a 400 mm stroke is fed with 22 L/min. How long do the extend and retract strokes take, and what flow returns from the cap end while retracting?',
      steps: [
        '$A_1 = 31.2$ cm², $A_2 = 21.0$ cm²; $Q = 22/60\\,000 = 3.67\\times10^{-4}$ m³/s.',
        'Extending: $v = 3.67\\times10^{-4}/3.12\\times10^{-3} = 0.118$ m/s, so $0.4/0.118 = 3.4$ s.',
        'Retracting: $v = 3.67\\times10^{-4}/2.10\\times10^{-3} = 0.175$ m/s, so 2.3 s.',
        'While retracting, the cap end sweeps $A_1 v = 3.12\\times10^{-3} \\times 0.175 = 5.46\\times10^{-4}$ m³/s = 32.7 L/min back to the tank — half as much again as the pump delivers.'
      ],
      a: 'About 3.4 s out and 2.3 s back; 33 L/min returns from the cap end during retraction.'
    },
    {
      title: 'Stalled against the relief valve',
      q: 'The same cylinder presses against a stop at the end of its stroke while the valve stays shifted. The relief valve is set at 160 bar and the pump delivers 22 L/min. Where does the power go?',
      steps: [
        'The rod cannot move, so no oil enters the cylinder; the pressure rises until the relief valve opens.',
        'All 22 L/min then passes the relief valve at 160 bar: $P = pQ = 1.6\\times10^7 \\times 3.67\\times10^{-4} = 5.9$ kW.',
        'None of it does work; all of it heats the oil. That is why circuits unload the pump (a tandem centre or an unloading valve) when the actuator waits.'
      ],
      a: 'About 5.9 kW, all turned into heat at the relief valve.'
    }
  ],
  quiz: [
    { q: 'At the same pressure, a double-acting cylinder with a rod through one end…', choices: ['pushes and pulls with the same force', 'pushes harder than it pulls', 'pulls harder than it pushes', 'pushes harder only when the rod is thin'], a: 1,
      why: 'Extending, the oil acts on the full piston area; retracting, only on the annulus around the rod. The pull is smaller by the rod\'s area.' },
    { q: 'The pump flow into a cylinder is doubled while the load stays the same. What happens?', choices: ['the force doubles', 'the speed doubles', 'both double', 'the pressure doubles'], a: 1,
      why: 'Speed = flow/area. The pressure is still set by the load (plus slightly higher line losses), so the force is unchanged.' },
    { q: 'What force does a 100 mm bore cylinder push with at 100 bar?', answer: 78.5, unit: 'kN', tol: 0.02,
      why: 'A = π × 0.1²/4 = 7.85×10⁻³ m²; F = 10⁷ × 7.85×10⁻³ = 78.5 kN.' },
    { q: 'When a cylinder with a thick rod retracts, the flow returning from the cap end is larger than the pump flow.', a: true,
      why: 'The piston sweeps the full area A₁ at the speed set by the annulus: return flow = Q·A₁/A₂. Return lines and valves must be sized for it.' },
    { q: 'A cylinder stalls against a load it cannot move. With a fixed pump running, the power…', choices: ['drops to zero, since nothing moves', 'goes into heat at the relief valve', 'is stored in the oil', 'goes back into the electric motor'], a: 1,
      why: 'The pump keeps delivering its flow, now all through the relief valve at its setting: pressure × flow becomes heat.' }
  ],
  problems: [
    { q: 'A log splitter has a 100 mm bore cylinder and a 180 bar relief setting. What is the largest splitting force (ignore losses)?', answer: 141.4, unit: 'kN', tol: 0.02,
      steps: ['$A = \\pi \\times 0.1^2/4 = 7.854\\times10^{-3}$ m².', '$F = 1.8\\times10^7 \\times 7.854\\times10^{-3} = 141.4$ kN — about 14 tonnes.'] },
    { q: 'A 50 mm bore cylinder must extend at 0.25 m/s. What pump flow is needed, in L/min?', answer: 29.5, unit: 'L/min', tol: 0.02,
      steps: ['$A = \\pi \\times 0.05^2/4 = 1.963\\times10^{-3}$ m².', '$Q = vA = 0.25 \\times 1.963\\times10^{-3} = 4.91\\times10^{-4}$ m³/s = 29.5 L/min.'] }
  ],
  applications: ['Excavator booms, arms and buckets — typically three or four cylinders per machine at 300–350 bar.', 'Presses, from a 10-tonne workshop press to forging presses of tens of thousands of tonnes.', 'Tipper trucks, lifts, loaders and the landing gear of aircraft.', 'Injection-moulding clamps, where the regenerative circuit gives a fast approach and full force at the end.'],
  history: 'Joseph Bramah patented the hydraulic press in 1795, using water; his ram was sealed by a self-tightening leather cup, the ancestor of every piston seal. Oil replaced water in machine hydraulics in the early twentieth century, and cylinders at 350 bar and beyond are routine today.',
  sim: ['ref-hyd-circuit', 'ref-cylinder']
}

);
