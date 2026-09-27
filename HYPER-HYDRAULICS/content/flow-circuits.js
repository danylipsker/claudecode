/* HYPER-HYDRAULICS · content/flow-circuits.js — two topics:
 *   flow-valves      (branch "Hydraulic Valves")   flow-control, orifice-equation, pressure-compensation,
 *                                                  proportional-valves, servo-valves, cartridge-valves
 *   basic-circuits   (branch "Hydraulic Circuits") basic-circuit, meter-in-out, regenerative-circuit,
 *                                                  sequencing-circuit, synchronizing, load-holding
 * Simulations in sims/flow-circuits.js (ids fc-*). The example machine used throughout matches the
 * reference: a 16 cm³/rev pump at 1450 rpm (22 L/min), a 63/36 mm cylinder (A₁ = 31.2 cm², A₂ = 21.0 cm²),
 * relief at 160 bar, ISO VG 46 mineral oil at 40 °C (ρ = 870 kg/m³, ν = 46 mm²/s, μ = 40 mPa·s). */
Hyper.add(

/* ================================================================ FLOW CONTROL VALVES */
{
  id: 'flow-control', parent: 'flow-valves', title: 'Flow control valves', level: 1,
  short: 'A flow control valve sets how fast an actuator moves by making the oil squeeze through an adjustable restriction. A plain throttle fixes a relation between flow and pressure drop, not the flow itself, and every bar it drops turns into heat.',
  keywords: ['flow control valve', 'throttle', 'needle valve', 'one-way flow control', 'check valve bypass', 'restrictor', 'orifice', 'speed control', 'laminar restrictor', 'sharp-edged orifice', 'temperature compensation', 'viscosity', 'heat'],
  prereq: ['directional-valves', 'pressure-flow-power', 'energy-losses-heat', 'physics:viscosity'],
  related: ['orifice-equation', 'pressure-compensation', 'meter-in-out', 'check-valves', 'cylinder-speed', 'laminar-pipe-flow', 'viscosity-temperature', 'pneumatics:flow-control-pneu'],
  body: `
An actuator's speed is set by the flow it receives: a cylinder moves at $v = Q/A$, a motor turns at $n = Q/V_g$. A fixed-displacement pump delivers the same flow whatever happens, so the only way to slow one actuator is to make its oil pass a **restriction** and send the pump's surplus elsewhere — normally over the [[relief-valve|relief valve]]. The restriction is a **flow control valve**, and it is the most common way of setting speed in simple hydraulic machines.

### The throttle
The simplest flow control is an adjustable **throttle** or **needle valve**: a tapered needle or a notched sleeve that opens or closes a small passage. The flow through it follows the [[orifice-equation|orifice equation]], $Q = C_d A\\sqrt{2\\Delta p/\\rho}$, which has an uncomfortable consequence: a throttle does not fix the flow, it fixes a *relation* between the flow and the pressure drop across it. Heavier load, higher pressure behind the throttle, smaller drop across it — and the actuator slows.

For a throttle opened to 4 mm² ($C_d = 0.65$, mineral oil):

| Pressure drop | Flow | Heat made in the throttle |
|---|---|---|
| 5 bar | 5.3 L/min | 0.04 kW |
| 20 bar | 10.6 L/min | 0.35 kW |
| 50 bar | 16.7 L/min | 1.4 kW |
| 100 bar | 23.7 L/min | 3.9 kW |

Flow grows only with the **square root** of the pressure drop: quartering the drop halves the flow. That is why a plain throttle is fine where the load is steady and unsuitable where it swings — there you need a [[pressure-compensation|pressure-compensated]] flow control, which holds the drop across its orifice constant.

### One-way flow control
A throttle with a [[check-valves|check valve]] in parallel is a **one-way flow control valve**: oil flowing one way must pass the throttle, oil flowing back lifts the check and passes almost freely. It slows a cylinder in one direction only — the lowering of a platform, the working feed of a slide — while the return stroke runs at full speed. Its ISO 1219 symbol is exactly that picture: the two arcs of a restriction with an arrow through them for adjustment, and a check valve beside it.

### Long passage or sharp edge
How a restriction behaves with temperature depends on its shape. In a **long, narrow passage** — a capillary, a thread, a deep annular gap — the flow is laminar and obeys Hagen–Poiseuille: the flow is proportional to $\\Delta p/\\mu$, so it follows the oil's [[physics:viscosity|viscosity]]. An ISO VG 46 oil has about 570 mm²/s at 0 °C, 46 at 40 °C and 11 at 80 °C: a laminar restrictor passes some fifty times more at the hot end than at the cold end. A **sharp-edged orifice** in a thin plate works on inertia instead: the oil accelerates into a jet and the flow depends on density, not viscosity, as long as the Reynolds number stays above a few hundred. Flow controls sold as *temperature-compensated* use a sharp-edged metering orifice for exactly this reason; laminar restrictors are kept for damping jobs — in pilot lines, gauge snubbers and door closers — where some temperature drift does not matter.

### Where the energy goes
A throttle makes no power disappear: the product of its pressure drop and its flow, $P = \\Delta p\\,Q$, becomes heat in the oil. With a fixed pump, the surplus flow meanwhile crosses the relief valve at full pressure. Speed control by throttling is simple, cheap and precise, and also one of the least efficient things a hydraulic system does; variable pumps, [[load-sensing|load sensing]] and variable-speed drives exist largely to avoid it. Where the throttle sits — in the line into the actuator, out of it, or in a bleed branch to tank — changes both the efficiency and whether an overrunning load can be held: see [[meter-in-out]].

> [!warn] A flow control in the outlet of a cylinder may be all that stops a load from falling. Before a flow control valve is adjusted, removed or replaced, lower the load or support it mechanically, stop the pump, release the pressure (and discharge any accumulator) and lock the machine out. Never feel for a leak with your hand: oil from a pinhole at high pressure can be injected through the skin — seek emergency medical care at once if it happens.
`,
  ideas: [
    'Speed is set by flow; with a fixed pump the only way to slow one actuator is a restriction plus somewhere for the surplus to go.',
    'A plain throttle fixes a relation Q ∝ √Δp, so the speed falls when the load rises.',
    'A one-way flow control is a throttle with a check valve in parallel: throttled one way, free the other.',
    'Long narrow passages are laminar and follow the viscosity; sharp-edged orifices barely care about temperature.',
    'Every throttle turns Δp × Q into heat.'
  ],
  pitfalls: [
    'Closing a throttle makes the pump deliver less — A fixed pump always delivers its displacement times its speed. The throttle only diverts the surplus, usually over the relief valve at full pressure, so the power drawn stays the same and more of it becomes heat.',
    'A flow control valve holds a set speed whatever the load — Only a pressure-compensated one does, and only within its pressure range. A plain throttle passes flow in proportion to the square root of its pressure drop, which the load changes.',
    'A needle valve is a needle valve — A needle with a long, narrow passage behaves like a laminar restrictor and drifts strongly with oil temperature; a sharp-edged orifice of the same flow hardly does.'
  ],
  formulas: [
    {
      name: 'Heat made by a throttle',
      expr: 'P = dp*Q', tex: 'P = \\Delta p\\,Q',
      vars: {
        P: { name: 'power turned into heat', q: 'power', unit: 'kW', tex: 'P' },
        dp: { name: 'pressure drop across the throttle', q: 'pressure', unit: 'bar', value: 50, tex: '\\Delta p' },
        Q: { name: 'flow through the throttle', q: 'flowrate', unit: 'L/min', value: 20, tex: 'Q' }
      },
      note: 'A handy form: P (kW) = Δp (bar) × Q (L/min) / 600. It applies to any restriction — throttle, valve, relief valve or line.',
      stories: { P: 'A throttle passes {Q} with a pressure drop of {dp}. How much heat does it put into the oil?', dp: 'A throttle passing {Q} puts {P} of heat into the oil. What is its pressure drop?' }
    },
    {
      name: 'A plain throttle when the pressure drop changes',
      expr: 'Q2 = Q1*sqrt(dp2/dp1)', tex: 'Q_2 = Q_1\\sqrt{\\dfrac{\\Delta p_2}{\\Delta p_1}}',
      vars: {
        Q2: { name: 'new flow', q: 'flowrate', unit: 'L/min', tex: 'Q_2' },
        Q1: { name: 'flow before', q: 'flowrate', unit: 'L/min', value: 12, tex: 'Q_1' },
        dp2: { name: 'new pressure drop across the throttle', q: 'pressure', unit: 'bar', value: 50, tex: '\\Delta p_2' },
        dp1: { name: 'pressure drop before', q: 'pressure', unit: 'bar', value: 120, tex: '\\Delta p_1' }
      },
      note: 'The opening is unchanged; only the pressure drop differs (for example because the load changed). Follows from Q = C_d A √(2Δp/ρ).',
      practice: { unknowns: ['Q2', 'dp2'] },
      stories: {
        Q2: 'A throttle passes {Q1} with {dp1} across it. The load rises and the drop across the throttle falls to {dp2}. What flow does it pass now?',
        dp2: 'A throttle passes {Q1} with {dp1} across it. What pressure drop would make it pass {Q2}?'
      }
    },
    {
      name: 'Laminar restrictor (a long, narrow passage)',
      expr: 'Q = pi*d^4*dp/(128*mu*L)', tex: 'Q = \\dfrac{\\pi d^4\\,\\Delta p}{128\\,\\mu L}',
      vars: {
        Q: { name: 'flow', q: 'flowrate', unit: 'L/min', tex: 'Q' },
        d: { name: 'passage diameter', q: 'length', unit: 'mm', value: 1, tex: 'd' },
        dp: { name: 'pressure drop', q: 'pressure', unit: 'bar', value: 5, tex: '\\Delta p' },
        mu: { name: 'dynamic viscosity of the oil', q: 'viscosity', unit: 'mPa·s', value: 40, tex: '\\mu' },
        L: { name: 'passage length', q: 'length', unit: 'mm', value: 50, tex: 'L' }
      },
      note: 'Hagen–Poiseuille, valid while the flow stays laminar (Reynolds number below about 2000) and the passage is long compared with its diameter. ISO VG 46 oil: μ ≈ 40 mPa·s at 40 °C, ≈ 500 mPa·s at 0 °C.',
      practice: { unknowns: ['Q', 'd', 'mu'] },
      stories: {
        Q: 'A damping restrictor is a passage {d} across and {L} long. What flow passes at {dp} with an oil viscosity of {mu}?',
        mu: 'A passage {d} across and {L} long passes {Q} at {dp}. What is the oil\'s viscosity?'
      }
    }
  ],
  examples: [
    {
      title: 'A feed that slows under load',
      q: 'A plain throttle in the inlet of a cylinder is fed from a pump whose relief valve holds 160 bar. With a light load the cylinder needs 40 bar and the throttle passes 12 L/min. The load increases until the cylinder needs 110 bar. What flow does the throttle pass now, and how much has the speed changed?',
      steps: [
        'The throttle sits between 160 bar and the cylinder, so its drop is $160 - 40 = 120$ bar at first and $160 - 110 = 50$ bar later.',
        { text: 'The opening is the same, so the flow scales with the square root of the drop:', tex: 'Q_2 = 12\\sqrt{\\frac{50}{120}} = 7.75\\ \\mathrm{L/min}' },
        'The speed is proportional to the flow: it falls by $1 - 7.75/12 = 35\\ \\%$ although nobody touched the valve.'
      ],
      a: 'About 7.7 L/min — the cylinder slows by roughly a third.'
    },
    {
      title: 'A cold morning in a pilot line',
      q: 'A damping restrictor 1 mm across and 50 mm long passes pilot oil at a 5 bar drop. How much does it pass at 40 °C, and at 0 °C? The ISO VG 46 oil has 46 mm²/s at 40 °C and 572 mm²/s at 0 °C; take ρ = 870 kg/m³.',
      steps: [
        'Dynamic viscosities: $\\mu = \\rho\\nu = 870 \\times 46\\times10^{-6} = 0.040$ Pa·s at 40 °C and $870 \\times 572\\times10^{-6} = 0.497$ Pa·s at 0 °C.',
        { text: 'At 40 °C:', tex: 'Q = \\frac{\\pi\\,(10^{-3})^4 \\times 5\\times10^{5}}{128 \\times 0.040 \\times 0.05} = 6.14\\times10^{-6}\\ \\mathrm{m^3/s} = 0.37\\ \\mathrm{L/min}' },
        'Check the regime: $v = Q/A = 6.14\\times10^{-6}/7.85\\times10^{-7} = 7.8$ m/s and $Re = \\rho v d/\\mu = 870 \\times 7.8 \\times 10^{-3}/0.040 \\approx 170$ — comfortably laminar.',
        'At 0 °C the flow is smaller by the viscosity ratio, $0.497/0.040 = 12.4$: about 0.03 L/min. The pilot stage it damps reacts twelve times more slowly until the oil warms up.'
      ],
      a: '0.37 L/min warm, 0.03 L/min cold — a laminar restrictor follows the viscosity.'
    }
  ],
  quiz: [
    { q: 'A plain throttle feeds a cylinder. The load rises, and the pressure drop across the throttle falls from 80 bar to 20 bar. The speed…', choices: ['stays the same', 'falls to half', 'falls to a quarter', 'falls to a sixteenth'], a: 1,
      why: 'Flow through a fixed opening goes with √Δp: √(20/80) = 1/2. A quarter would be the answer if flow were proportional to Δp — true only of laminar restrictors.' },
    { q: 'A one-way flow control is fitted in the line to the rod end of a cylinder, its check valve letting oil flow freely *into* the rod end. Which movement does it slow?', choices: ['extension, by metering the oil that leaves the rod end', 'retraction', 'both movements equally', 'neither — a check valve bypasses it'], a: 0,
      why: 'Oil leaves the rod end while the cylinder extends; in that direction the check is closed and the oil must pass the throttle. Retracting, oil flows into the rod end through the open check.' },
    { q: 'A long, narrow needle-valve passage is a good speed control for a machine whose oil runs anywhere between 10 °C and 70 °C.', a: false,
      why: 'A long passage is laminar, so its flow follows the viscosity, which changes more than tenfold over that range. A sharp-edged orifice is nearly independent of temperature.' },
    { q: 'A throttle drops 100 bar at 30 L/min. How much heat does it make?', answer: 5, unit: 'kW', tol: 0.02,
      why: 'P = Δp·Q = 10⁷ Pa × 5×10⁻⁴ m³/s = 5 kW — or 100 × 30/600.' },
    { q: 'A fixed pump feeds a cylinder through a throttle. Closing the throttle halfway…', choices: ['halves the power the electric motor draws', 'leaves the pump flow unchanged and sends more of it over the relief valve', 'raises the pump flow', 'lowers the relief-valve setting'], a: 1,
      why: 'A positive-displacement pump delivers its displacement × speed. The part the throttle refuses must go somewhere — over the relief valve at full pressure, as heat.' }
  ],
  problems: [
    { q: 'A throttle passes 18 L/min with a 60 bar drop across it. What does it pass, unchanged, when the drop is 15 bar?', answer: 9, unit: 'L/min', tol: 0.02,
      steps: ['$Q_2 = Q_1\\sqrt{\\Delta p_2/\\Delta p_1} = 18\\sqrt{15/60} = 18 \\times 0.5 = 9$ L/min.'] },
    { q: 'A laminar damping passage passes 0.5 L/min when the oil has a viscosity of 30 mPa·s. What does it pass at the same pressure drop when the oil thickens to 240 mPa·s?', answer: 0.0625, unit: 'L/min', tol: 0.02,
      steps: ['In laminar flow $Q \\propto 1/\\mu$.', '$Q_2 = 0.5 \\times 30/240 = 0.0625$ L/min.'] }
  ],
  applications: [
    'Feed of machine-tool slides and drilling units, set with a one-way flow control on the outlet.',
    'Lowering speed of fork-lift masts and lifting tables, limited by a fixed restrictor in the lift-cylinder line.',
    'Damping restrictors in pilot lines, gauge snubbers and the laminar passages of door closers.',
    'Speed setting of hydraulic motors on conveyors, winches and agricultural machines.'
  ],
  sim: 'fc-compensated'
},

{
  id: 'orifice-equation', parent: 'flow-valves', title: 'The orifice equation', level: 2,
  short: 'Flow through a sharp restriction is Q = C_d A √(2Δp/ρ): proportional to the opening, to the square root of the pressure drop, and nearly independent of viscosity. It is the law behind every throttle, valve land, nozzle and leak.',
  keywords: ['orifice equation', 'orifice flow', 'discharge coefficient', 'Cd', 'vena contracta', 'contraction coefficient', 'jet velocity', 'square-root law', 'flow coefficient', 'orifices in series', 'metering edge', 'throttling', 'Torricelli'],
  prereq: ['energy-equation', 'continuity-equation', 'physics:bernoullis-equation'],
  related: ['flow-control', 'orifice-plate', 'torricelli', 'minor-losses', 'reynolds-number-pipes', 'cavitation', 'valve-sizing-dynamics', 'pneumatics:sonic-conductance'],
  body: `
Almost every valve in a hydraulic system controls flow the same way: it makes the oil squeeze through a gap that is small compared with the pipe. Throttles, spool edges, poppet seats, nozzles, relief valves — and leaks — all follow one law, and it is worth knowing it well.

### From Bernoulli to the orifice equation
Upstream of a sharp-edged hole the oil moves slowly. Converging on the hole it accelerates, and — because the streamlines cannot turn a sharp corner — the jet keeps narrowing for a short distance after the hole before it is at its thinnest, the **vena contracta**. Between the slow upstream oil and the jet at the vena contracta hardly any energy is lost, so the [[energy-equation|energy equation]] (Bernoulli) gives the jet speed:

$$v_j = \\sqrt{\\frac{2\\,\\Delta p}{\\rho}}$$

The jet's area is a fraction $C_c$ of the hole's (about 0.61–0.64 for a sharp edge), and friction trims its speed by a couple of per cent ($C_v \\approx 0.97$–0.98). The two are rolled into one **discharge coefficient** $C_d = C_c C_v$, and [[continuity-equation|continuity]] gives the flow:

$$Q = C_d A \\sqrt{\\frac{2\\,\\Delta p}{\\rho}}$$

For sharp-edged holes and spool metering edges $C_d \\approx 0.6$–0.7 (0.61 for a thin plate); a short tube with a square entry reaches about 0.8 and a well-rounded nozzle 0.95 or more.

### What the law says
- **Flow is proportional to the opening.** Double the area, double the flow — which is how a spool or needle meters.
- **Flow grows only with the square root of the pressure drop.** Twice the flow needs four times the drop; turned around, $\\Delta p = \\frac{\\rho}{2}\\left(\\frac{Q}{C_d A}\\right)^2$, so every valve is a **square-law resistance**, which is why catalogue curves of pressure drop against flow are parabolas.
- **Density matters, viscosity hardly.** The jet is driven by inertia, so a sharp-edged orifice passes nearly the same flow hot or cold. This holds while the Reynolds number of the jet is above a few hundred; in very small gaps, cold oil or tiny pressure drops the coefficient falls, and in creeping flow the flow becomes proportional to $\\Delta p$ — the laminar behaviour of [[flow-control|long restrictors]].

The jet is fast. At the vena contracta, ideally:

| $\\Delta p$ | 10 bar | 50 bar | 100 bar | 200 bar | 350 bar |
|---|---|---|---|---|---|
| Jet speed | 48 m/s | 107 m/s | 152 m/s | 214 m/s | 284 m/s |

A jet like that erodes the edges it passes (**wire-drawing**), and the pressure in its core can fall below the vapour pressure so that bubbles form and collapse — [[cavitation]], with its hiss and pitting.

### Where the energy goes
Downstream the jet mixes with slower oil and its kinetic energy turns into heat; almost none of the pressure is recovered. The oil therefore warms by $\\Delta T = \\Delta p/(\\rho c)$ — about 6 °C for every 100 bar it drops, with $\\rho c \\approx 1.65$ MJ/(m³·K) for mineral oil.

### Orifices together
Openings **in parallel** add their areas. **In series**, each takes part of the drop; for equal coefficients the pair behaves as one opening of $A_{eq} = A_1A_2/\\sqrt{A_1^2 + A_2^2}$, so two equal holes in series pass $1/\\sqrt2 = 71\\ \\%$ of the flow of one at the same total drop. A spool edge that uncovers a full ring of a bore of diameter $d$ by a distance $x$ is an orifice of area $\\pi d x$ — see [[proportional-valves]].

Try your own numbers in the [orifice calculator](#/tools/fpower/orifice).

> [!warn] The jet from a pinhole leak at 200 bar leaves at more than 200 m/s and can pierce the skin. Never search for a leak with your hand — use a piece of card, and depressurise the system before tightening anything. An injection injury looks small but is a surgical emergency: seek emergency medical care at once.
`,
  ideas: [
    'Bernoulli gives the jet speed √(2Δp/ρ); the discharge coefficient (≈ 0.6–0.7) accounts for the vena contracta and friction.',
    'Flow is proportional to area and to the square root of the pressure drop.',
    'A sharp-edged orifice is nearly independent of viscosity as long as its Reynolds number is not small.',
    'All the pressure dropped becomes heat: about 6 °C per 100 bar in mineral oil.',
    'Parallel openings add areas; two equal openings in series pass 71 % of one.'
  ],
  pitfalls: [
    'Double the pressure drop, double the flow — Only in laminar flow. Through an orifice the flow grows with the square root: twice the drop gives 41 % more flow.',
    'Thick oil flows slowly through a valve — Through a sharp edge at normal Reynolds numbers, viscosity hardly matters; it is density and pressure drop that count. Viscosity matters in long gaps, clearances and at low Reynolds numbers.',
    'The pressure lost across a valve comes back downstream — Only a well-shaped diffuser recovers part of it. Behind an orifice the jet mixes out and its energy becomes heat.'
  ],
  derivation: {
    title: 'The orifice equation from Bernoulli and continuity',
    steps: [
      { text: 'Between a point upstream (1), where the oil is nearly at rest, and the vena contracta (2), with no losses and no change of height:', tex: 'p_1 + \\tfrac12\\rho v_1^2 = p_2 + \\tfrac12\\rho v_2^2' },
      { text: 'With $v_1 \\ll v_2$ and $\\Delta p = p_1 - p_2$, the ideal jet speed is', tex: 'v_2 = \\sqrt{\\frac{2\\,\\Delta p}{\\rho}}' },
      { text: 'The jet area is $C_c A$ and friction reduces the speed to $C_v v_2$; the flow is area times speed:', tex: 'Q = C_c A \\cdot C_v\\sqrt{\\frac{2\\,\\Delta p}{\\rho}} = C_d A\\sqrt{\\frac{2\\,\\Delta p}{\\rho}}' },
      { text: 'If the upstream speed is not negligible (an orifice plate in a pipe of area $A_p$), the velocity of approach adds a factor $1/\\sqrt{1 - (C_c A/A_p)^2}$; in valves, where $A \\ll A_p$, it is 1 to within a fraction of a per cent.' }
    ]
  },
  formulas: [
    {
      name: 'The orifice equation',
      expr: 'Q = Cd*A*sqrt(2*dp/rho)', tex: 'Q = C_d A\\sqrt{\\dfrac{2\\,\\Delta p}{\\rho}}',
      vars: {
        Q: { name: 'flow', q: 'flowrate', unit: 'L/min', tex: 'Q' },
        Cd: { name: 'discharge coefficient (0.6–0.7 for sharp edges)', value: 0.62, min: 0.05, max: 1, tex: 'C_d' },
        A: { name: 'opening area', q: 'area', unit: 'mm²', value: 5, tex: 'A' },
        dp: { name: 'pressure drop across the opening', q: 'pressure', unit: 'bar', value: 50, tex: '\\Delta p' },
        rho: { name: 'oil density', q: 'density', unit: 'kg/m³', value: 870, tex: '\\rho' }
      },
      note: 'Turbulent (inertia-dominated) flow through a short, sharp restriction. Mineral oil ρ ≈ 850–890 kg/m³; water 1000 kg/m³.',
      practice: { unknowns: ['Q', 'A', 'dp'] },
      stories: {
        Q: 'Oil of density {rho} passes an opening of {A} with a discharge coefficient of {Cd} under a pressure drop of {dp}. What is the flow?',
        A: 'An opening with a discharge coefficient of {Cd} must pass {Q} of oil (density {rho}) at a pressure drop of {dp}. What area does it need?',
        dp: 'A valve opening of {A} ({Cd}) passes {Q} of oil of density {rho}. What is its pressure drop?'
      }
    },
    {
      name: 'Ideal jet speed at the vena contracta',
      expr: 'v = sqrt(2*dp/rho)', tex: 'v = \\sqrt{\\dfrac{2\\,\\Delta p}{\\rho}}',
      vars: {
        v: { name: 'jet speed', q: 'speed', unit: 'm/s', tex: 'v' },
        dp: { name: 'pressure drop', q: 'pressure', unit: 'bar', value: 200, tex: '\\Delta p' },
        rho: { name: 'oil density', q: 'density', unit: 'kg/m³', value: 870, tex: '\\rho' }
      },
      note: 'Torricelli\'s law in pressure form; the real jet is 2–3 % slower.',
      stories: { v: 'Oil of density {rho} escapes through a pinhole with {dp} behind it. How fast is the jet?', dp: 'A jet of oil (density {rho}) leaves a restriction at {v}. What pressure drop drives it?' }
    },
    {
      name: 'Two openings in series',
      expr: 'Aeq = A1*A2/sqrt(A1^2 + A2^2)', tex: 'A_{eq} = \\dfrac{A_1 A_2}{\\sqrt{A_1^2 + A_2^2}}',
      vars: {
        Aeq: { name: 'equivalent single opening', q: 'area', unit: 'mm²', tex: 'A_{eq}' },
        A1: { name: 'first opening', q: 'area', unit: 'mm²', value: 5, tex: 'A_1' },
        A2: { name: 'second opening', q: 'area', unit: 'mm²', value: 5, tex: 'A_2' }
      },
      note: 'Assumes the same discharge coefficient and that the jet of the first mixes out before the second. Parallel openings simply add.',
      practice: { unknowns: ['Aeq', 'A2'] },
      stories: { Aeq: 'Oil passes an opening of {A1} and then one of {A2}. What single opening would pass the same flow at the same total pressure drop?', A2: 'An opening of {A1} is followed by a second one. How large must the second be for the pair to behave like {Aeq}?' }
    },
    {
      name: 'Temperature rise across a restriction',
      expr: 'dT = dp/(rho*c)', tex: '\\Delta T = \\dfrac{\\Delta p}{\\rho\\,c}',
      vars: {
        dT: { name: 'temperature rise of the oil', q: 'dtemp', unit: 'K', tex: '\\Delta T' },
        dp: { name: 'pressure drop', q: 'pressure', unit: 'bar', value: 100, tex: '\\Delta p' },
        rho: { name: 'oil density', q: 'density', unit: 'kg/m³', value: 870, tex: '\\rho' },
        c: { name: 'specific heat of the oil', q: 'specificheat', unit: 'kJ/(kg·K)', value: 1.9, tex: 'c' }
      },
      note: 'All the pressure energy becomes heat in the oil that passed (none lost to the surroundings on the way). Mineral oil c ≈ 1.8–2.0 kJ/(kg·K).',
      stories: { dT: 'Oil (density {rho}, specific heat {c}) drops {dp} across a relief valve. How much warmer is it downstream?' }
    }
  ],
  examples: [
    {
      title: 'Flow through a 2.5 mm orifice',
      q: 'A sharp-edged orifice 2.5 mm across ($C_d = 0.62$) carries mineral oil ($\\rho = 870$ kg/m³) with 100 bar across it. Find the jet speed and the flow.',
      steps: [
        'Area: $A = \\pi \\times 2.5^2/4 = 4.91$ mm² $= 4.91\\times10^{-6}$ m².',
        'Ideal jet speed: $\\sqrt{2 \\times 10^7/870} = 151.6$ m/s.',
        'Flow: $Q = 0.62 \\times 4.91\\times10^{-6} \\times 151.6 = 4.61\\times10^{-4}$ m³/s $= 27.7$ L/min.',
        'The oil leaves about $10^7/(870 \\times 1900) = 6$ °C warmer than it came.'
      ],
      a: 'About 152 m/s and 27.7 L/min.'
    },
    {
      title: 'A lowering orifice',
      q: 'A lifting table must not lower faster than 12 L/min of oil leaving its cylinder, where the load holds 80 bar. What diameter of fixed orifice ($C_d = 0.65$, $\\rho = 870$ kg/m³) does that, and what happens with a load twice as heavy?',
      steps: [
        'Jet speed: $\\sqrt{2 \\times 8\\times10^6/870} = 135.6$ m/s.',
        'Area: $A = Q/(C_d v) = 2\\times10^{-4}/(0.65 \\times 135.6) = 2.27\\times10^{-6}$ m² = 2.27 mm².',
        'Diameter: $d = \\sqrt{4A/\\pi} = 1.70$ mm.',
        'With twice the load the pressure is 160 bar, and the flow rises by $\\sqrt{2}$: 17 L/min. A fixed orifice limits the speed, it does not fix it.'
      ],
      a: 'A 1.7 mm orifice; a doubled load lowers about 41 % faster.'
    }
  ],
  quiz: [
    { q: 'To double the flow through a fixed orifice, the pressure drop must be multiplied by…', choices: ['2', '4', '√2', '8'], a: 1,
      why: 'Q ∝ √Δp, so Δp ∝ Q². Doubling Q takes four times the drop.' },
    { q: 'An orifice passes 10 L/min at 25 bar. What does it pass at 100 bar?', answer: 20, unit: 'L/min', tol: 0.02,
      why: '√(100/25) = 2, so the flow doubles.' },
    { q: 'The flow through a sharp-edged orifice in a main line is inversely proportional to the oil\'s viscosity.', a: false,
      why: 'That is laminar flow in a long passage. A sharp-edged orifice is dominated by inertia; its flow depends on density and pressure drop and hardly at all on viscosity, at normal Reynolds numbers.' },
    { q: 'Two identical orifices are placed in series. At the same total pressure drop, the pair passes…', choices: ['half the flow of one', 'about 71 % of the flow of one', 'the same flow as one', 'twice the flow of one'], a: 1,
      why: 'Each takes half the drop, and the flow goes with √(1/2) = 0.71. Equivalently A_eq = A/√2.' },
    { q: 'Oil drops 100 bar across a relief valve. Leaving it, the oil is…', choices: ['a little cooler, because it expanded', 'about 6 °C warmer', 'at the same temperature', 'about 60 °C warmer'], a: 1,
      why: 'ΔT = Δp/(ρc) = 10⁷/(870 × 1900) ≈ 6 K. The pressure energy all becomes heat.' }
  ],
  problems: [
    { q: 'What diameter of sharp-edged orifice ($C_d = 0.62$) passes 20 L/min of oil ($\\rho = 870$ kg/m³) at a 30 bar drop?', answer: 2.87, unit: 'mm', tol: 0.02,
      steps: ['Jet speed: $\\sqrt{2 \\times 3\\times10^6/870} = 83.0$ m/s.', '$A = 3.33\\times10^{-4}/(0.62 \\times 83.0) = 6.47\\times10^{-6}$ m².', '$d = \\sqrt{4A/\\pi} = 2.87$ mm.'] },
    { q: 'A valve behaves like an opening of 20 mm² with $C_d = 0.65$. What is its pressure drop at 40 L/min of oil ($\\rho = 870$ kg/m³)?', answer: 11.4, unit: 'bar', tol: 0.02,
      steps: ['$Q/(C_d A) = 6.67\\times10^{-4}/(0.65 \\times 2\\times10^{-5}) = 51.3$ m/s.', '$\\Delta p = \\tfrac12 \\rho (Q/C_dA)^2 = 435 \\times 51.3^2 = 1.14\\times10^6$ Pa = 11.4 bar.'] }
  ],
  applications: [
    'Every throttle, flow control and metering edge of a directional or proportional valve.',
    'Fixed restrictors that limit lowering speed or damp pilot stages, and the jets of hydraulic dampers.',
    'Orifice plates that measure flow in pipes (see [[orifice-plate]]).',
    'Estimating leaks and the flow through a burst hose.'
  ],
  history: 'Torricelli showed in 1643 that liquid leaves a hole in a tank at the speed it would reach falling freely from the surface. Newton noticed, in the second edition of his Principia (1713), that the jet goes on narrowing after it leaves the hole — the contracted vein, or vena contracta — which is why real holes pass only about three-fifths of the ideal flow.',
  sim: 'fc-orifice'
},

{
  id: 'pressure-compensation', parent: 'flow-valves', title: 'Pressure-compensated flow control', level: 2,
  short: 'A compensator spool in series with the metering orifice throttles away whatever pressure the orifice does not need, holding the drop across it at a few bar. The flow then depends only on the opening — the actuator keeps its speed whatever the load.',
  keywords: ['pressure-compensated flow control', 'compensator', 'pressure balance', 'hydrostat', '2-way flow control', '3-way flow control', 'bypass flow control', 'constant flow', 'load-independent speed', 'start-up jump', 'temperature compensated'],
  prereq: ['flow-control', 'orifice-equation', 'relief-valve'],
  related: ['meter-in-out', 'load-sensing', 'pressure-compensated-pump', 'proportional-valves', 'reducing-valve', 'energy-losses-heat', 'electronics:negative-feedback'],
  body: `
A plain throttle passes $Q = C_d A\\sqrt{2\\Delta p/\\rho}$, and the load changes $\\Delta p$. The cure is to make $\\Delta p$ constant: put a second, self-adjusting restriction in series with the metering orifice and let it absorb whatever pressure the orifice does not need. That second restriction is the **compensator** — also called the pressure balance, the hydrostat or the compensator spool — and the pair is a **pressure-compensated flow control valve**.

### How the compensator works
The compensator is a spool held open by a light spring. The pressure *before* the metering orifice, $p_2$, pushes on one end to close it; the pressure *after* the orifice, $p_3$, plus the spring pushes on the other end to open it. It settles where the forces balance:

$$p_2 A_s = p_3 A_s + F_s \\quad\\Rightarrow\\quad \\Delta p_c = p_2 - p_3 = \\frac{F_s}{A_s}$$

With a 10 mm spool and a 55 N spring, $\\Delta p_c = 55/7.85\\times10^{-5} = 7$ bar; real valves hold 4–10 bar. If the load pressure $p_3$ rises, the balance tips, the spool opens further and $p_2$ rises with it; if the supply rises, the spool closes a little. Either way the metering orifice always sees the same drop, so the flow depends only on its opening:

$$Q = C_d A\\sqrt{\\frac{2\\,\\Delta p_c}{\\rho}}$$

It is [[electronics:negative-feedback|negative feedback]] done with a spool and a spring. A good valve holds its set flow within 2–5 % from its minimum pressure drop up to the full system pressure, and because its metering orifice is sharp-edged it is nearly independent of oil temperature as well.

### Its limits
- **A minimum pressure drop.** The compensator can only throttle away a surplus. When the whole valve has less than $\\Delta p_c$ plus a few bar across it (typically 8–15 bar in total), the compensator is wide open and the valve behaves like a plain throttle.
- **A start-up jump.** With no flow the spring pushes the compensator fully open. When flow starts, the orifice briefly sees the full pressure and a slug of oil jumps through before the spool catches up; stroke limiters and pre-positioned spools reduce it.
- **It holds a speed, not a load.** An overrunning load still needs back-pressure on the outlet side ([[meter-in-out]], [[load-holding]]).

### Two-way and three-way
| | 2-way (series) | 3-way (bypass) |
|---|---|---|
| Where the compensator sits | in series with the orifice | across the pump line, spilling to tank |
| Surplus pump flow goes | over the relief valve at its setting | to tank at load pressure + $\\Delta p_c$ |
| Pump pressure | the relief setting | follows the load |
| Heat | high | much lower |
| Circuits | meter-in, meter-out, bleed-off | meter-in only, one actuator per pump |

For a pump giving 20 L/min, a relief setting of 160 bar, a load needing 90 bar and 10 L/min: the 2-way valve's circuit takes in $160 \\times 20/600 = 5.3$ kW and wastes 3.8 kW; the 3-way valve lets the pump run at $90 + 7 = 97$ bar, takes in 3.2 kW and wastes 1.7 kW. Move the compensator's idea into the pump itself, so that the pump makes only the flow that the orifice passes, and you have [[load-sensing]] — the waste falls to a few hundred watts.

### In directional valves
Mobile valve banks and [[proportional-valves|proportional valves]] give each section its own compensator, so that each function keeps its speed while the others change load — the basis of load-sensing and flow-sharing systems in excavators and cranes.

> [!key] The compensator keeps the pressure drop across the metering orifice constant; a constant drop across a fixed opening means a constant flow.
`,
  ideas: [
    'A compensator spool balances the pressures before and after the metering orifice against a spring, holding the drop at F_s/A_s (4–10 bar).',
    'With a constant drop across it, the orifice passes a flow set only by its opening: speed no longer depends on the load.',
    'Below its minimum pressure drop the compensator is wide open and the valve acts as a plain throttle.',
    'A 3-way (bypass) valve lets the pump pressure follow the load and wastes far less than a 2-way valve with a relief valve.',
    'Load sensing is the same idea moved into the pump.'
  ],
  pitfalls: [
    'A compensated flow control saves energy — A 2-way valve wastes just as much as a plain throttle: the compensator burns off the surplus pressure. Only the bypass (3-way) type, or load sensing, lowers the pump pressure.',
    'The set flow is held whatever the pressures — Only while the valve has at least its minimum pressure drop across it. Near the relief setting the compensator runs out of margin and the flow falls.',
    'A compensated flow control will hold an overrunning load steady — It meters flow; if the load pulls, it cannot create the back-pressure to stop it. That is the job of meter-out placement or a counterbalance valve.'
  ],
  formulas: [
    {
      name: 'Pressure drop held by the compensator',
      expr: 'dpc = Fs/As', tex: '\\Delta p_c = \\dfrac{F_s}{A_s}',
      vars: {
        dpc: { name: 'pressure drop across the metering orifice', q: 'pressure', unit: 'bar', tex: '\\Delta p_c' },
        Fs: { name: 'compensator spring force', q: 'force', unit: 'N', value: 55, tex: 'F_s' },
        As: { name: 'compensator spool area', q: 'area', unit: 'mm²', value: 78.5, tex: 'A_s' }
      },
      note: 'Flow forces on the spool and the spring rate shift it slightly, which is why real valves hold their flow within a few per cent rather than exactly.',
      stories: { dpc: 'A compensator spool of area {As} is held open by a spring force of {Fs}. What pressure drop does it hold across the metering orifice?', Fs: 'A compensator spool of {As} must hold {dpc} across the metering orifice. What spring force does it need?' }
    },
    {
      name: 'The controlled flow',
      expr: 'Q = Cd*A*sqrt(2*dpc/rho)', tex: 'Q = C_d A\\sqrt{\\dfrac{2\\,\\Delta p_c}{\\rho}}',
      vars: {
        Q: { name: 'controlled flow', q: 'flowrate', unit: 'L/min', tex: 'Q' },
        Cd: { name: 'discharge coefficient of the metering orifice', value: 0.65, min: 0.05, max: 1, tex: 'C_d' },
        A: { name: 'metering opening (set by the knob)', q: 'area', unit: 'mm²', value: 6, tex: 'A' },
        dpc: { name: 'compensator pressure drop', q: 'pressure', unit: 'bar', value: 7, tex: '\\Delta p_c' },
        rho: { name: 'oil density', q: 'density', unit: 'kg/m³', value: 870, tex: '\\rho' }
      },
      note: 'The load does not appear: that is the point. It holds while the whole valve has more than about Δp_c + 5 bar across it.',
      practice: { unknowns: ['Q', 'A'] },
      stories: { Q: 'A compensated flow control holds {dpc} across a metering opening of {A} ({Cd}). What flow does it deliver of oil of density {rho}?', A: 'A compensated flow control holding {dpc} must deliver {Q} of oil (density {rho}) through an orifice with {Cd}. What opening is needed?' }
    },
    {
      name: 'Heat with a 2-way valve and a relief valve (meter-in, fixed pump)',
      expr: 'P = ps*Qp - pL*Q', tex: 'P = p_s Q_p - p_L Q',
      vars: {
        P: { name: 'power turned into heat', q: 'power', unit: 'kW', tex: 'P' },
        ps: { name: 'relief setting (gauge)', q: 'pressure', unit: 'bar', value: 160, tex: 'p_s' },
        Qp: { name: 'pump flow', q: 'flowrate', unit: 'L/min', value: 20, tex: 'Q_p' },
        pL: { name: 'load pressure at the actuator (gauge)', q: 'pressure', unit: 'bar', value: 90, tex: 'p_L' },
        Q: { name: 'flow to the actuator', q: 'flowrate', unit: 'L/min', value: 10, tex: 'Q' }
      },
      note: 'Pump power in minus useful power out. The surplus Q_p − Q crosses the relief valve; the rest of the loss is in the valve.',
      practice: { unknowns: ['P'] },
      stories: { P: 'A pump gives {Qp} with the relief valve at {ps}. A 2-way compensated valve sends {Q} to a cylinder that needs {pL}. How much power becomes heat?' }
    },
    {
      name: 'Heat with a 3-way (bypass) valve',
      expr: 'P = (pL + dpc)*Qp - pL*Q', tex: 'P = (p_L + \\Delta p_c)\\,Q_p - p_L Q',
      vars: {
        P: { name: 'power turned into heat', q: 'power', unit: 'kW', tex: 'P' },
        pL: { name: 'load pressure (gauge)', q: 'pressure', unit: 'bar', value: 90, tex: 'p_L' },
        dpc: { name: 'compensator pressure drop', q: 'pressure', unit: 'bar', value: 7, tex: '\\Delta p_c' },
        Qp: { name: 'pump flow', q: 'flowrate', unit: 'L/min', value: 20, tex: 'Q_p' },
        Q: { name: 'flow to the actuator', q: 'flowrate', unit: 'L/min', value: 10, tex: 'Q' }
      },
      note: 'The bypass holds the pump at the load pressure plus the compensator drop (line losses ignored), so the surplus is spilled at low pressure.',
      practice: { unknowns: ['P'] },
      stories: { P: 'A 3-way compensated valve holding {dpc} sends {Q} of a {Qp} pump flow to a cylinder that needs {pL}. How much power becomes heat?' }
    }
  ],
  examples: [
    {
      title: 'Same speed, light or heavy',
      q: 'A 63 mm cylinder ($A_1 = 31.2$ cm²) is fed through a meter-in flow control from a pump with its relief valve at 160 bar. The load pressure varies between 20 and 120 bar during the stroke. Compare a plain throttle set to 9.4 L/min at the light load with a compensated valve set to 9.4 L/min. (Ignore line losses.)',
      steps: [
        'Speed at 9.4 L/min: $v = 1.565\\times10^{-4}/3.12\\times10^{-3} = 0.050$ m/s = 50 mm/s.',
        'Plain throttle: at 20 bar load its drop is 140 bar; at 120 bar load it is 40 bar. Flow then: $9.4\\sqrt{40/140} = 5.0$ L/min — the cylinder slows to 27 mm/s, by 47 %.',
        'Compensated valve: its orifice always sees about 7 bar, so it passes 9.4 L/min at both loads (within a few per cent). The compensator absorbs 133 bar at the light load and 33 bar at the heavy one.',
        'Both valves still send the pump\'s surplus over the relief valve at 160 bar.'
      ],
      a: 'The throttle lets the speed fall from 50 to 27 mm/s; the compensated valve holds about 50 mm/s.'
    },
    {
      title: 'Where the heat goes',
      q: 'A pump gives 20 L/min; a cylinder needs 10 L/min at 90 bar. Compare the heat made with (a) a 2-way compensated valve and a relief valve at 160 bar, and (b) a 3-way valve with $\\Delta p_c = 7$ bar.',
      steps: [
        'Useful power: $90 \\times 10/600 = 1.5$ kW.',
        '(a) Pump power $160 \\times 20/600 = 5.33$ kW; heat $5.33 - 1.5 = 3.83$ kW.',
        '(b) Pump pressure $90 + 7 = 97$ bar; pump power $97 \\times 20/600 = 3.23$ kW; heat $1.73$ kW.',
        'The same speed control costs less than half the heat — and a load-sensing pump that delivers only 10 L/min at 97 bar would take 1.6 kW and waste about 0.1 kW.'
      ],
      a: '(a) 3.8 kW of heat; (b) 1.7 kW.'
    }
  ],
  quiz: [
    { q: 'What does the compensator in a pressure-compensated flow control keep constant?', choices: ['the pump pressure', 'the pressure drop across the metering orifice', 'the load pressure', 'the pump flow'], a: 1,
      why: 'It balances the pressures before and after the metering orifice against its spring. A constant drop across a fixed opening gives a constant flow.' },
    { q: 'A 2-way compensated flow control set to 10 L/min is fed at 160 bar, and the load now needs 155 bar. The flow to the actuator…', choices: ['stays at 10 L/min', 'falls — the valve no longer has its minimum pressure drop and acts like a plain throttle', 'rises', 'drops to zero at once'], a: 1,
      why: 'Only 5 bar is left across the whole valve, less than the compensator needs. The compensator opens fully and the orifice passes what 5 bar allows.' },
    { q: 'A compensator spring of 40 N acts on a spool area of 50 mm². What pressure drop does it hold?', answer: 8, unit: 'bar', tol: 0.02,
      why: 'Δp = F/A = 40/5×10⁻⁵ = 8×10⁵ Pa = 8 bar.' },
    { q: 'A 3-way (bypass) pressure-compensated flow control can equally well be fitted in the outlet line of a cylinder.', a: false,
      why: 'The bypass must spill the pump\'s surplus, so it sits in the pump line and meters the inlet — one actuator per pump. A 2-way valve can meter in, meter out or bleed off.' },
    { q: 'Why is the metering orifice of a compensated flow control made sharp-edged?', choices: ['to reduce the start-up jump', 'so that the flow is also nearly independent of oil temperature', 'to make it quieter', 'so that it can pass flow both ways'], a: 1,
      why: 'Flow through a sharp edge depends on density, not viscosity; a long passage would drift with temperature even at constant pressure drop.' }
  ],
  problems: [
    { q: 'A compensated flow control holds 8 bar across its metering orifice ($C_d = 0.65$, oil 870 kg/m³). What opening delivers 15 L/min?', answer: 8.97, unit: 'mm²', tol: 0.02,
      steps: ['Jet speed: $\\sqrt{2 \\times 8\\times10^5/870} = 42.9$ m/s.', '$A = Q/(C_d v) = 2.5\\times10^{-4}/(0.65 \\times 42.9) = 8.97\\times10^{-6}$ m² = 8.97 mm².'] }
  ],
  applications: [
    'Feed of drilling and milling units, where the cutting force changes but the feed must not.',
    'Constant-speed hydraulic motors on conveyors, fans and mixers.',
    'Each section of load-sensing and flow-sharing valve banks on excavators, cranes and loaders.',
    'Priority valves that give steering its flow first on tractors and fork-lift trucks.'
  ],
  sim: 'fc-compensated'
},

{
  id: 'proportional-valves', parent: 'flow-valves', title: 'Proportional valves', level: 2,
  short: 'A proportional solenoid pushes with a force proportional to its current, so a spool held by a spring moves in proportion to an electrical signal. The valve opens gradually, with ramps, deadband and hysteresis, and its flow follows the command times the square root of the pressure drop.',
  keywords: ['proportional valve', 'proportional solenoid', 'spool position', 'LVDT', 'amplifier', 'PWM', 'dither', 'deadband', 'overlap', 'hysteresis', 'ramp', 'nominal flow', 'metering edge', 'electro-hydraulic', 'on-board electronics'],
  prereq: ['directional-valves', 'valve-actuation', 'orifice-equation'],
  related: ['servo-valves', 'electrohydraulic-control', 'pressure-compensation', 'load-sensing', 'servo-loop', 'valve-sizing-dynamics', 'electronics:pwm', 'pneumatics:proportional-pressure'],
  body: `
An ordinary solenoid valve is either shut or open. A **proportional valve** opens *partly*, as far as an electrical signal tells it, so one valve can steer a load, set its speed and accelerate it smoothly. It sits between the on–off valve and the aerospace-born [[servo-valves|servo valve]]: less precise and slower than a servo valve, much cheaper and far more tolerant of dirt.

### The proportional solenoid
A switching solenoid's force climbs steeply as its armature closes the air gap, so it snaps to the end. A **proportional solenoid** has a shaped pole that makes its force almost independent of armature position over a working stroke of 1.5–4 mm, and proportional to the coil current (typically up to 1–3 A). Pushing a spool against a centring spring, it gives a spool position proportional to current:

$$F_{sol} = k_i\\,i = k_s x \\quad\\Rightarrow\\quad x = \\frac{k_i}{k_s}\\,i$$

The coil is driven by an **amplifier** that controls the current (not the voltage, which would drift as the coil warms) by fast switching — [[electronics:pwm|pulse-width modulation]] — with a small **dither** at 100–300 Hz that keeps the spool trembling so that it does not stick. Many valves carry their electronics on board and take a ±10 V or 4–20 mA command.

### How much flow
Each spool land uncovers a metering edge; an edge of width $w$ opened by $x$ is an orifice of area $wx$ (a full ring on a 10 mm spool has $w = \\pi d = 31.4$ mm):

$$Q = C_d\\,w\\,x\\sqrt{\\frac{2\\,\\Delta p}{\\rho}}$$

Catalogues give a **nominal flow** $Q_N$ at a nominal drop $\\Delta p_N$, usually 10 bar across the valve (5 bar per metering edge, P→A plus B→T). At any other command $u$ (0–100 %) and drop $\\Delta p$:

$$Q = Q_N\\,u\\,\\sqrt{\\frac{\\Delta p}{\\Delta p_N}}$$

So a proportional valve is still a throttle: its flow depends on the load. For load-independent speed it is combined with a compensator ([[pressure-compensation]]) or put inside a position or speed loop ([[servo-loop]]).

### The imperfections
- **Deadband.** Cheaper valves have spools with **overlap** — the lands cover the ports by 10–20 % of the stroke at centre, to keep leakage low — so nothing flows until the command passes the overlap. Amplifiers hide it with a step ("deadband compensation").
- **Hysteresis.** Friction and magnetic effects make the flow at 50 % different on the way up and on the way down: 3–6 % of full scale for a simple valve. With a spool-position sensor (an LVDT) and closed-loop electronics it falls below 1 %, often to 0.1–0.3 %.
- **Response.** Direct-acting valves reach a few tens of hertz of bandwidth; high-response valves with zero-lap spools approach servo-valve territory (60–150 Hz). Large flows use two stages, a small proportional pilot moving a big main spool.
- **Spool shape.** Linear, progressive (fine control at small openings), or with notches that open gently.

The amplifier's **ramps** limit how fast the command may change, so a 20-tonne boom accelerates in half a second instead of jerking — no extra hydraulic parts needed.

| | On–off valve | Proportional | Proportional with LVDT | Servo valve |
|---|---|---|---|---|
| Spool position | end to end | ∝ current | ∝ command, closed loop | ∝ current, feedback wire |
| Hysteresis | — | 3–6 % | 0.1–1 % | below 0.5–1 % |
| Bandwidth | switches in 20–60 ms | 5–20 Hz | 20–150 Hz | 100–300 Hz |
| Typical ISO 4406:2021 code | 20/18/15 | 18/16/13 | 18/16/13 | 16/14/11 or cleaner |

The same solenoid drives **proportional pressure-relief and pressure-reducing valves**, which set a pressure instead of an opening — the basis of electronically adjustable clamping force and of the pilot stages of big valves (see also [[pneumatics:proportional-pressure]]).

> [!warn] An electrically commanded valve can move a load without anyone touching a lever — on power-up, on a cable fault, or when a controller is edited. Before working on a machine: lower or support the loads, stop the pump, release the pressure, discharge accumulators, and lock out both the hydraulic and the electrical energy.
`,
  ideas: [
    'A proportional solenoid pushes with a force proportional to current, nearly independent of position; against a spring, the spool position follows the current.',
    'Flow = nominal flow × command × √(Δp/Δp_N): the valve is still a throttle whose flow depends on the load.',
    'Spool overlap gives a deadband; friction and magnetism give hysteresis; an LVDT and closed-loop electronics shrink both.',
    'Ramps in the amplifier make gentle acceleration a matter of software.',
    'Proportional valves trade some precision and speed for far lower cost and dirt sensitivity than servo valves.'
  ],
  pitfalls: [
    'A proportional valve sets the speed — It sets an opening. The flow through that opening still depends on the pressure drop, so a heavier load slows the actuator unless the valve is compensated or in a closed loop.',
    'The nominal flow is the most the valve will pass — It is the flow at the nominal drop (usually 10 bar). At 40 bar the same opening passes twice as much, up to the valve\'s power limit.',
    'Drive the solenoid with a voltage — The coil\'s resistance rises by about 40 % as it warms, so a fixed voltage gives a drifting force. Amplifiers control the current.'
  ],
  formulas: [
    {
      name: 'Flow from the catalogue rating',
      expr: 'Q = QN*u*sqrt(dp/dpN)', tex: 'Q = Q_N\\,u\\sqrt{\\dfrac{\\Delta p}{\\Delta p_N}}',
      vars: {
        Q: { name: 'flow through the valve', q: 'flowrate', unit: 'L/min', tex: 'Q' },
        QN: { name: 'nominal flow (at full command and the nominal drop)', q: 'flowrate', unit: 'L/min', value: 40, tex: 'Q_N' },
        u: { name: 'command (beyond the deadband)', q: 'ratio', unit: '%', value: 75, min: 0, max: 100, tex: 'u' },
        dp: { name: 'actual pressure drop across the valve', q: 'pressure', unit: 'bar', value: 20, tex: '\\Delta p' },
        dpN: { name: 'nominal pressure drop (usually 10 bar, 5 bar per edge)', q: 'pressure', unit: 'bar', value: 10, tex: '\\Delta p_N' }
      },
      note: 'For a linear spool beyond its deadband; progressive spools follow their own curve. Δp is the total drop across both metering edges.',
      practice: { unknowns: ['Q', 'u', 'QN'] },
      stories: {
        Q: 'A proportional valve rated {QN} at {dpN} is commanded to {u} with {dp} across it. What flow passes?',
        u: 'A valve rated {QN} at {dpN} has {dp} across it. What command gives {Q}?',
        QN: 'A cylinder needs {Q} at a command of {u} with {dp} across the valve. What nominal flow (at {dpN}) should the valve have?'
      }
    },
    {
      name: 'Flow past a metering edge',
      expr: 'Q = Cd*w*x*sqrt(2*dp/rho)', tex: 'Q = C_d\\,w\\,x\\sqrt{\\dfrac{2\\,\\Delta p}{\\rho}}',
      vars: {
        Q: { name: 'flow past the edge', q: 'flowrate', unit: 'L/min', tex: 'Q' },
        Cd: { name: 'discharge coefficient', value: 0.65, min: 0.05, max: 1, tex: 'C_d' },
        w: { name: 'area gradient (πd for a full ring)', q: 'length', unit: 'mm', value: 31.4, tex: 'w' },
        x: { name: 'spool opening beyond the overlap', q: 'length', unit: 'mm', value: 0.5, tex: 'x' },
        dp: { name: 'pressure drop across this edge', q: 'pressure', unit: 'bar', value: 5, tex: '\\Delta p' },
        rho: { name: 'oil density', q: 'density', unit: 'kg/m³', value: 870, tex: '\\rho' }
      },
      note: 'The orifice equation with area w·x. Notched spools have a much smaller w near centre, for fine control.',
      practice: { unknowns: ['Q', 'x'] },
      stories: { x: 'A spool edge with an area gradient of {w} ({Cd}) must pass {Q} of oil (density {rho}) at {dp}. How far must it open?', Q: 'A spool edge with an area gradient of {w} is opened {x}. What flow passes at {dp} ({Cd}, oil {rho})?' }
    }
  ],
  examples: [
    {
      title: 'From catalogue to cylinder',
      q: 'A proportional directional valve is rated 40 L/min at 10 bar. It extends a 63 mm cylinder ($A_1 = 31.2$ cm²) at 75 % command, with 20 bar left across the valve. How fast does the rod move — and what if a heavier load leaves only 10 bar across the valve?',
      steps: [
        { text: 'Flow at 20 bar:', tex: 'Q = 40 \\times 0.75 \\sqrt{\\frac{20}{10}} = 42.4\\ \\mathrm{L/min}' },
        'Speed: $v = 7.07\\times10^{-4}/3.12\\times10^{-3} = 0.227$ m/s.',
        'At 10 bar: $Q = 40 \\times 0.75 = 30$ L/min, $v = 0.160$ m/s — 29 % slower at the same command.'
      ],
      a: 'About 0.23 m/s, falling to 0.16 m/s with the heavier load.'
    },
    {
      title: 'How far a spool moves',
      q: 'A 10 mm spool uncovers a full ring. How far must it open to pass 20 L/min at 5 bar across the edge ($C_d = 0.65$, oil 870 kg/m³)?',
      steps: [
        'Area gradient: $w = \\pi d = 31.4$ mm.',
        'Jet speed: $\\sqrt{2 \\times 5\\times10^5/870} = 33.9$ m/s.',
        '$x = Q/(C_d w v) = 3.33\\times10^{-4}/(0.65 \\times 0.0314 \\times 33.9) = 4.8\\times10^{-4}$ m.'
      ],
      a: 'About 0.48 mm — which is why a few micrometres of silt in the clearance matter.'
    }
  ],
  quiz: [
    { q: 'What makes a proportional solenoid different from a switching solenoid?', choices: ['it is always energised', 'its force is proportional to current and nearly independent of armature position over its stroke', 'it moves the spool faster', 'it runs on alternating current'], a: 1,
      why: 'A switching solenoid\'s force rises steeply as the gap closes, so it snaps to the end. A flat force–stroke curve lets a spring set the position in proportion to the current.' },
    { q: 'A valve is rated 60 L/min at 10 bar. Fully open, with 40 bar across it, it passes (within its limits)…', answer: 120, unit: 'L/min', tol: 0.02,
      why: 'Q = 60 × √(40/10) = 120 L/min.' },
    { q: 'The deadband of an inexpensive proportional directional valve comes mainly from the overlap of its spool lands.', a: true,
      why: 'At centre the lands cover the ports by 10–20 % of the stroke to limit leakage; nothing flows until the spool has moved past the overlap.' },
    { q: 'Why do amplifiers put ramps on the command?', choices: ['to reduce the hysteresis', 'to accelerate and decelerate the load smoothly, limiting pressure peaks', 'to save electrical power', 'to compensate for oil temperature'], a: 1,
      why: 'A ramp limits how fast the opening changes, so a heavy load accelerates gently — a smooth movement set in software.' },
    { q: 'A command is raised to 50 % and then lowered back to 50 %. On a valve without spool-position feedback the flow…', choices: ['is exactly the same both times', 'differs by a few per cent — hysteresis', 'is zero on the way down', 'doubles on the way down'], a: 1,
      why: 'Friction and magnetic hysteresis make the spool sit slightly differently depending on the direction of approach: 3–6 % of full scale without feedback.' }
  ],
  problems: [
    { q: 'A cylinder needs 25 L/min with 15 bar across the valve at 80 % command. What nominal flow (at 10 bar) should the proportional valve have?', answer: 25.5, unit: 'L/min', tol: 0.02,
      steps: ['$Q_N = Q/(u\\sqrt{\\Delta p/\\Delta p_N}) = 25/(0.8\\sqrt{1.5}) = 25.5$ L/min.', 'The next size up in a catalogue would be chosen.'] }
  ],
  applications: [
    'Electro-hydraulic joysticks on excavators, cranes and telehandlers.',
    'Speed and pressure profiles of injection-moulding and die-casting machines.',
    'Smooth acceleration of press rams, lift tables and theatre stage machinery.',
    'Electronically set pressure for clamping, tensioning and braking.'
  ],
  history: 'Proportional solenoids and valves spread in the 1970s and 1980s, when inexpensive power electronics made it practical to control a coil\'s current precisely. They filled the gap between the on–off valve and the servo valve of aerospace, bringing smooth electrical control to industrial and mobile machines.',
  sim: 'fc-prop'
},

{
  id: 'servo-valves', parent: 'flow-valves', title: 'Servo valves', level: 3,
  short: 'A servo valve turns a few milliamperes into a precisely metered flow in a few milliseconds: a torque motor tilts a flapper between two nozzles, the nozzle pressures drive the main spool, and a feedback wire makes the spool position proportional to the current. Fast, precise — and intolerant of dirt.',
  keywords: ['servo valve', 'servovalve', 'electro-hydraulic servo valve', 'torque motor', 'flapper nozzle', 'jet pipe', 'feedback wire', 'mechanical feedback', 'two-stage', 'zero lap', 'critical centre', 'rated flow', 'bandwidth', 'null leakage', 'direct-drive valve', 'contamination'],
  prereq: ['proportional-valves', 'orifice-equation', 'electronics:negative-feedback'],
  related: ['servo-loop', 'hydraulic-stiffness', 'valve-sizing-dynamics', 'electrohydraulic-control', 'contamination', 'iso-4406', 'filtration', 'aircraft-hydraulics', 'electronics:bode-plots', 'pneumatics:servo-pneumatics'],
  body: `
A **servo valve** is the precision instrument of hydraulics. A signal of a few milliamperes — the output of a controller closing a position or force loop — becomes a metered flow of up to a few hundred litres a minute, within a few milliseconds and with almost no hysteresis. Flight controls, flight simulators, fatigue-test rigs, steel-mill gauge control and turbine governors all depend on it.

### Two stages and a wire
The classic valve has two hydraulic stages:

1. **The torque motor.** An armature, pivoted on a thin flexure tube, sits between the poles of permanent magnets. Current in its coils (rated typically 10–50 mA) tilts it by a fraction of a degree.
2. **The flapper and nozzles.** A flapper fixed to the armature hangs between two small nozzles (about 0.3–0.5 mm across). Each nozzle is fed from supply through a fixed inlet orifice, so the pair forms a hydraulic bridge: moving the flapper towards one nozzle raises the pressure behind it and lowers the other.
3. **The main spool.** Those two pressures act on the ends of the main spool and push it.
4. **The feedback wire.** A thin spring wire runs from the flapper to a notch in the spool. As the spool moves, the wire bends and pulls the flapper back towards centre. The spool stops where the wire's torque balances the motor's: **spool position proportional to current**.

This mechanical force feedback is a small closed loop inside the valve ([[electronics:negative-feedback|negative feedback]]), which is why a servo valve is linear and repeatable without electronics of its own. In a **jet-pipe** valve a swivelling nozzle aims a jet at two receiver holes instead, with larger passages that tolerate dirt better. **Direct-drive valves** move the spool with a linear force motor and an electronic position loop, with no pilot flow at all.

### The spool
The main spool is **zero-lapped** (critically centred): its lands match the ports to within a micrometre or two, with radial clearances of a few micrometres. There is no deadband, and a tiny spool offset gives a large pressure difference between the actuator ports — high **pressure gain**, which makes a position loop stiff ([[hydraulic-stiffness]]). The price is a continuous **null leakage**: the pilot stage and the spool clearances pass a litre or so per minute all the time, even at rest.

### Flow under load
Servo valves are rated at a drop of 70 bar across the valve (1000 psi, 35 bar per land). With supply $p_s$ and a load pressure difference $p_L$ across the actuator, the flow at current $i$ is

$$Q_L = Q_R\\,\\frac{i}{i_R}\\sqrt{\\frac{p_s - p_L}{\\Delta p_R}}$$

The power delivered, $p_L Q_L$, is largest when $p_L = \\tfrac23 p_s$; actuators are therefore sized so that the largest load needs about two-thirds of the supply pressure, keeping a third for the valve to meter with.

Small valves reach 100–300 Hz of bandwidth (the frequency at which the flow amplitude has fallen by 3 dB), larger ones less; with a hysteresis below 0.5–1 % and a threshold below 0.5 %, they respond to changes a proportional valve would miss. What limits a servo system is usually not the valve but the oil column: see [[servo-loop]] and [[electronics:bode-plots|Bode plots]].

### Clean oil, or nothing works
Nozzles of 0.3 mm, inlet orifices smaller still and spool clearances of a few micrometres jam on silt that other valves never notice. Servo systems are flushed through a flushing plate before the valve is fitted, run with a fine non-bypass pressure filter (3–5 µm) just upstream of the valve, and are held to a cleanliness of ISO 4406:2021 16/14/11 or better ([[iso-4406]], [[filtration]]). Most servo-valve failures are contamination failures.

> [!warn] A servo actuator can move at full speed and force in milliseconds if a feedback signal is lost or a command is wrong. Before working on a servo system: stop the pump, discharge the accumulators that servo systems usually carry, release the pressure, support the load and lock out hydraulic and electrical energy. Never feel for leaks by hand — an oil-injection injury needs emergency medical care at once.
`,
  ideas: [
    'A torque motor moves a flapper between two nozzles; the nozzle pressures move the main spool; a feedback wire makes spool position proportional to current.',
    'Zero-lapped spools give no deadband and high pressure gain, at the cost of continuous null leakage.',
    'Q_L = Q_R (i/i_R) √((p_s − p_L)/Δp_R), rated at 70 bar; power to the load peaks at p_L = ⅔ p_s.',
    'Bandwidths of 100–300 Hz and hysteresis below 1 % make servo valves the heart of fast closed loops.',
    'Contamination is the enemy: ISO 4406 16/14/11 or cleaner and a fine non-bypass filter.'
  ],
  pitfalls: [
    'A servo valve is a better proportional valve and can replace one anywhere — It needs far cleaner oil, wastes pilot flow continuously and, being zero-lapped, does not hold a load tight at centre. Its advantages count only inside a fast closed loop.',
    'The rated flow is what the valve delivers to a cylinder — The rating is at 70 bar across the valve. With a load taking part of the supply pressure, the flow is Q_R √((p_s − p_L)/70 bar), and at no load it can be well above the rating.',
    'More supply pressure always means a faster actuator — Only while the valve has pressure to meter with. Near p_L = p_s the flow falls to nothing; the best power transfer is at p_L = ⅔ p_s.'
  ],
  derivation: {
    title: 'Why an actuator is sized for two-thirds of the supply pressure',
    steps: [
      { text: 'At full current the flow to a load with pressure difference $p_L$ is', tex: 'Q_L = Q_R\\sqrt{\\frac{p_s - p_L}{\\Delta p_R}}' },
      { text: 'The hydraulic power delivered to the actuator is', tex: 'P = p_L Q_L = \\frac{Q_R}{\\sqrt{\\Delta p_R}}\\;p_L\\sqrt{p_s - p_L}' },
      { text: 'Set its [[math:derivative|derivative]] with respect to $p_L$ to zero:', tex: '\\sqrt{p_s - p_L} - \\frac{p_L}{2\\sqrt{p_s - p_L}} = 0 \\;\\Rightarrow\\; p_L = \\tfrac23\\,p_s' },
      { text: 'At that point the valve drops $p_s/3$ and the actuator gets two-thirds: the most power the valve can pass. Designers choose the actuator area so that the largest load needs no more than this.' }
    ]
  },
  formulas: [
    {
      name: 'Servo-valve flow to a load',
      expr: 'QL = QR*(i/iR)*sqrt((ps - pL)/dpR)', tex: 'Q_L = Q_R\\,\\dfrac{i}{i_R}\\sqrt{\\dfrac{p_s - p_L}{\\Delta p_R}}',
      vars: {
        QL: { name: 'flow to the actuator', q: 'flowrate', unit: 'L/min', signed: true, tex: 'Q_L' },
        QR: { name: 'rated flow (at full current and the rated drop)', q: 'flowrate', unit: 'L/min', value: 38, tex: 'Q_R' },
        i: { name: 'coil current (sign gives the direction)', q: 'current', unit: 'mA', value: 8, signed: true, tex: 'i' },
        iR: { name: 'rated current', q: 'current', unit: 'mA', value: 10, tex: 'i_R' },
        ps: { name: 'supply pressure (gauge)', q: 'pressure', unit: 'bar', value: 210, tex: 'p_s' },
        pL: { name: 'load pressure difference across the actuator', q: 'pressure', unit: 'bar', value: 70, signed: true, tex: 'p_L' },
        dpR: { name: 'rated valve pressure drop (70 bar for most servo valves)', q: 'pressure', unit: 'bar', value: 70, tex: '\\Delta p_R' }
      },
      note: 'For a symmetric (zero-lapped) valve and a load resisting the motion; the return pressure is taken as zero. A negative p_L (an aiding load) increases the flow.',
      practice: { unknowns: ['QL', 'QR', 'pL'] },
      stories: {
        QL: 'A servo valve rated {QR} at {dpR} and {iR} gets {i} with a supply of {ps}. The load needs {pL}. What flow reaches the actuator?',
        QR: 'An actuator needs {QL} at a load pressure of {pL}, with a supply of {ps} and {i} of {iR}. What rated flow (at {dpR}) must the valve have?',
        pL: 'A valve rated {QR} at {dpR} gets {i} of {iR} with a supply of {ps} and delivers {QL}. What load pressure is the actuator working against?'
      }
    },
    {
      name: 'The most power a servo valve can pass',
      expr: 'Pmax = 2/3*ps*QR*sqrt(ps/(3*dpR))', tex: 'P_{max} = \\tfrac23\\,p_s\\,Q_R\\sqrt{\\dfrac{p_s}{3\\,\\Delta p_R}}',
      vars: {
        Pmax: { name: 'largest hydraulic power delivered to the load', q: 'power', unit: 'kW', tex: 'P_{max}' },
        ps: { name: 'supply pressure (gauge)', q: 'pressure', unit: 'bar', value: 210, tex: 'p_s' },
        QR: { name: 'rated flow', q: 'flowrate', unit: 'L/min', value: 38, tex: 'Q_R' },
        dpR: { name: 'rated valve pressure drop', q: 'pressure', unit: 'bar', value: 70, tex: '\\Delta p_R' }
      },
      note: 'At full current with p_L = ⅔ p_s. With p_s = 210 bar and the usual 70 bar rating, the valve then passes exactly its rated flow.',
      practice: { unknowns: ['Pmax', 'QR'] },
      stories: { Pmax: 'A servo valve rated {QR} at {dpR} runs on a supply of {ps}. What is the most hydraulic power it can deliver to an actuator?', QR: 'A servo actuator must receive up to {Pmax} from a {ps} supply. What rated flow (at {dpR}) does the valve need?' }
    },
    {
      name: 'Response time from bandwidth (first-order estimate)',
      expr: 'tau = 1/(2*pi*fb)', tex: '\\tau = \\dfrac{1}{2\\pi f_b}',
      vars: {
        tau: { name: 'time constant', q: 'time', unit: 'ms', tex: '\\tau' },
        fb: { name: '−3 dB bandwidth', q: 'frequency', unit: 'Hz', value: 100, tex: 'f_b' }
      },
      note: 'Treats the valve as a first-order lag: it reaches 63 % of a small step in τ. Real valves are closer to second order, but the estimate is good for comparing a valve with the rest of a loop.',
      stories: { tau: 'A servo valve has a bandwidth of {fb}. Roughly what is its time constant?', fb: 'A loop needs a valve with a time constant of {tau}. What bandwidth is that?' }
    }
  ],
  examples: [
    {
      title: 'A servo cylinder under load',
      q: 'A double-rod servo cylinder has 20 cm² on each side and pushes a 14 kN load. Its servo valve is rated 38 L/min at 70 bar and 10 mA; the supply is 210 bar. How fast does the rod move at 8 mA?',
      steps: [
        'Load pressure: $p_L = F/A = 14\\,000/2\\times10^{-3} = 7\\times10^6$ Pa = 70 bar.',
        { text: 'Flow:', tex: 'Q_L = 38 \\times \\frac{8}{10}\\sqrt{\\frac{210 - 70}{70}} = 43.0\\ \\mathrm{L/min}' },
        'Speed: $v = 7.17\\times10^{-4}/2\\times10^{-3} = 0.358$ m/s.',
        'The load uses a third of the supply, below the two-thirds limit, so the valve still has plenty of pressure to meter with.'
      ],
      a: 'About 0.36 m/s.'
    }
  ],
  quiz: [
    { q: 'In a two-stage flapper–nozzle servo valve, what does the feedback wire do?', choices: ['carries the coil current', 'pulls the flapper back towards centre as the spool moves, so that spool position ends up proportional to current', 'centres the spool when the power fails', 'damps pressure pulsations in the nozzles'], a: 1,
      why: 'Spool displacement bends the wire, whose torque opposes the torque motor. Equilibrium needs the flapper near centre, which happens at a spool position proportional to the current.' },
    { q: 'A servo valve is rated 20 L/min at 70 bar. At full current, with 210 bar supply and no load, it passes about…', answer: 34.6, unit: 'L/min', tol: 0.02,
      why: 'Q = 20 × √(210/70) = 20 × 1.73 = 34.6 L/min.' },
    { q: 'Servo valves use spools with a generous overlap to keep leakage low.', a: false,
      why: 'They are zero-lapped: no deadband and high pressure gain. The price is a steady null leakage.' },
    { q: 'At what load pressure does a servo valve deliver the most power to its actuator?', choices: ['p_s/3', 'p_s/2', '2p_s/3', 'p_s'], a: 2,
      why: 'P ∝ p_L √(p_s − p_L), which peaks at p_L = ⅔ p_s: a third of the supply is left across the valve.' },
    { q: 'Why does a servo valve need much cleaner oil than a switching valve?', choices: ['its seals are softer', 'its nozzles are a few tenths of a millimetre across and its spool clearances a few micrometres', 'it runs hotter', 'it has no filter of its own'], a: 1,
      why: 'Particles that pass harmlessly through a switching valve block nozzles and orifices or jam the spool of a servo valve; hence ISO 4406 16/14/11 or cleaner and a fine filter just upstream.' }
  ],
  problems: [
    { q: 'An actuator needs 30 L/min at a load pressure of 100 bar from a 210 bar supply, at full current. What rated flow (at 70 bar) must the servo valve have?', answer: 23.9, unit: 'L/min', tol: 0.02,
      steps: ['$Q_R = Q_L/\\sqrt{(p_s - p_L)/\\Delta p_R} = 30/\\sqrt{110/70} = 30/1.254 = 23.9$ L/min.'] }
  ],
  applications: [
    'Primary flight-control actuators and flight simulators.',
    'Fatigue and vibration test rigs, shaking tables and tyre testers.',
    'Automatic gauge control in rolling mills and precise positioning in presses.',
    'Steam and gas turbine governors, injection-moulding machines.'
  ],
  history: 'Electro-hydraulic servo valves were developed in the late 1940s and 1950s for guided missiles and aircraft controls. The two-stage valve with mechanical feedback, associated with W. C. Moog and the laboratories of that period, made them accurate and robust enough for industry, where they arrived in the 1960s.',
  sim: { id: 'fc-prop', params: { type: 'servo', mode: 'fast' } }
},

{
  id: 'cartridge-valves', parent: 'flow-valves', title: 'Cartridge and logic valves', level: 2,
  short: 'A cartridge valve is a valve built as an insert for a cavity in a manifold block. Screw-in cartridges pack whole circuits into compact blocks; slip-in 2/2 logic elements — pilot-controlled poppets — switch thousands of litres a minute leak-free.',
  keywords: ['cartridge valve', 'screw-in cartridge', 'slip-in cartridge', 'logic element', 'logic valve', '2/2 cartridge', 'poppet', 'area ratio', 'manifold', 'cavity', 'pilot control', 'ISO 7368', 'hydraulic integrated circuit'],
  prereq: ['check-valves', 'pilot-check', 'directional-valves'],
  related: ['pilot-relief', 'relief-valve', 'industrial-presses', 'mobile-hydraulics', 'iso-1219', 'hydraulic-system', 'port-designations'],
  body: `
Pipe a circuit together from separate valves and you get a tangle of tubes and dozens of joints, each a possible leak. **Cartridge valves** take the valve out of its housing: each one is an insert that fits a standard cavity machined into a steel or aluminium **manifold block**, and the drillings in the block are the pipes. Two families dominate.

### Screw-in cartridges
Small valves that screw into threaded cavities: checks, pilot checks, relief, reducing, sequence and counterbalance valves, flow controls, and solenoid 2/2, 3/2 and 4/2 valves. They carry from a few to a couple of hundred litres a minute at up to about 350 bar. A block the size of a brick can hold a complete circuit — lift, lower, load holding, pressure limiting — with no piping at all, which is why mobile machines, aerial platforms and compact power packs are built this way.

### Slip-in logic elements
For large flows the valve is reduced to its essence: a **poppet** in a sleeve, slipped into a cavity and held by a **cover**. It has two main ports — **A** at the end, facing the seat, and **B** at the side — and a pilot port **X** into the spring chamber behind the poppet. Three areas decide what it does:

- $A_A$, the seat area, on which the pressure at A pushes to open;
- $A_B$, the ring around the seat, on which the pressure at B pushes to open;
- $A_X = A_A + A_B$, the back of the poppet, on which the pilot pressure and the spring push to close.

The poppet opens when

$$p_A A_A + p_B A_B > p_X\\,(A_A + A_B) + F_s$$

Connect X to tank and the poppet opens as soon as A or B has a couple of bar (the spring alone); connect X to the higher of A and B — through a small shuttle valve in the cover — and it stays shut, sealed by its seat with no leakage at all. A tiny solenoid pilot valve on the cover switches between the two: a 2/2 valve for hundreds of litres a minute, operated by a valve that passes one.

### Area ratio
The **area ratio** $A_A : A_X$ sets how much the pressure at B helps to open the poppet:

| Area ratio | Pressure at B | Typical use |
|---|---|---|
| 1 : 1 | does not act (no ring) | pressure functions: relief, sequence, where B pressure must not shift the setting |
| about 1 : 1.1 | acts weakly | directional, flow mainly A → B |
| 1 : 1.5 or 1 : 2 | acts strongly | directional with flow both ways |

### Why they are used
With a pilot relief valve in the cover, the element becomes a large pilot-operated **relief valve**; with a stroke limiter, a **throttle**; with X fed from A only, a **check valve**. Four elements — P→A, A→T, P→B, B→T — make a 4/3 valve whose centre condition, switching order and timing are chosen by the pilot logic, so one block can give soft switching, regeneration and decompression before reversal. Poppets are leak-free, switch in 10–30 ms and pass enormous flows at low pressure drop: presses, injection-moulding and die-casting machines run on them. Their cavities are standardised (slip-in elements in ISO 7368:2016, screw-in cavities in ISO 7789:2007), and the circuits are drawn in ISO 1219-1:2012 symbols with the cover's pilot drillings shown.

> [!warn] A manifold block holds pressure behind closed poppets and checks after the pump has stopped. Before loosening a cover, a cartridge or a plug: lower or support every load, stop the pump, discharge accumulators, vent each section, confirm on gauges that it reads zero, and lock the machine out. A cartridge released under pressure can be thrown out of its cavity, and the escaping jet can inject oil through skin.
`,
  ideas: [
    'Cartridge valves are inserts for standard cavities; the manifold\'s drillings replace pipes and joints.',
    'A logic element is a pilot-controlled poppet with seat area A_A, ring area A_B and back area A_X = A_A + A_B.',
    'It opens when p_A A_A + p_B A_B exceeds p_X A_X + F_s: vent X to open, pressurise X to shut leak-free.',
    'The area ratio decides how much the pressure at B helps to open the poppet.',
    'Pilot logic in the cover turns the same element into a directional, check, relief or throttle function.'
  ],
  pitfalls: [
    'A logic element knows which way to let the oil flow — It is a 2/2 switch: open or shut. Direction, pressure and flow functions come entirely from how X is piloted; a wrong pilot connection gives a valve that opens when it should not.',
    'A closed poppet can be opened by pressure at B only with a ratio of 1 : 1 — The opposite: with 1 : 1 there is no ring for B to act on. With 1 : 1.5 or 1 : 2, B pressure pushes the poppet open unless X is pressurised.',
    'Cartridges only make sense for big machines — Screw-in cartridges in compact blocks are the standard way of building small mobile and power-pack circuits.'
  ],
  formulas: [
    {
      name: 'Net opening force on a logic poppet',
      expr: 'F = pA*AA + pB*AB - pX*(AA + AB) - Fs', tex: 'F = p_A A_A + p_B A_B - p_X\\,(A_A + A_B) - F_s',
      vars: {
        F: { name: 'net opening force (positive = opens)', q: 'force', unit: 'N', signed: true, tex: 'F' },
        pA: { name: 'pressure at port A (gauge)', q: 'pressure', unit: 'bar', value: 200, tex: 'p_A' },
        AA: { name: 'seat area A_A', q: 'area', unit: 'cm²', value: 3.14, tex: 'A_A' },
        pB: { name: 'pressure at port B (gauge)', q: 'pressure', unit: 'bar', value: 10, tex: 'p_B' },
        AB: { name: 'ring area A_B', q: 'area', unit: 'cm²', value: 1.57, tex: 'A_B' },
        pX: { name: 'pilot pressure in the spring chamber X (gauge)', q: 'pressure', unit: 'bar', value: 200, tex: 'p_X' },
        Fs: { name: 'spring force', q: 'force', unit: 'N', value: 50, tex: 'F_s' }
      },
      note: 'Static balance, flow forces ignored. The back area is A_X = A_A + A_B. Negative: the poppet stays shut.',
      practice: { unknowns: ['F', 'pX'] },
      stories: {
        F: 'A logic element has a seat area of {AA} and a ring of {AB}, with a {Fs} spring. Port A is at {pA}, port B at {pB} and the pilot chamber at {pX}. What is the net opening force?',
        pX: 'A logic element ({AA} seat, {AB} ring, {Fs} spring) has {pA} at A and {pB} at B. What pilot pressure gives a net opening force of {F}?'
      }
    },
    {
      name: 'Opening pressure with the spring chamber vented',
      expr: 'pc = Fs/AA', tex: 'p_c = \\dfrac{F_s}{A_A}',
      vars: {
        pc: { name: 'cracking pressure at A (gauge)', q: 'pressure', unit: 'bar', tex: 'p_c' },
        Fs: { name: 'spring force', q: 'force', unit: 'N', value: 50, tex: 'F_s' },
        AA: { name: 'seat area', q: 'area', unit: 'cm²', value: 3.14, tex: 'A_A' }
      },
      note: 'With X at tank pressure and B at zero. Logic-element springs typically give 0.5–4 bar; a stronger spring makes a check with a higher cracking pressure.',
      stories: { pc: 'A logic poppet has a seat area of {AA} and a spring force of {Fs}. With its spring chamber vented, at what pressure does it open?' }
    }
  ],
  examples: [
    {
      title: 'Will it open?',
      q: 'A logic element has a 20 mm seat ($A_A = 3.14$ cm²) and an area ratio of 1 : 1.5 ($A_B = 1.57$ cm²), with a 50 N spring. Port A is at 200 bar, port B at 10 bar. Is it open (a) with X connected to A, (b) with X vented to tank? (c) With A at zero and B at 180 bar, what pilot pressure keeps it shut?',
      steps: [
        '(a) $F = 200\\times10^5 \\times 3.14\\times10^{-4} + 10\\times10^5 \\times 1.57\\times10^{-4} - 200\\times10^5 \\times 4.71\\times10^{-4} - 50 = 6280 + 157 - 9420 - 50 = -3033$ N: shut, held by 3 kN.',
        '(b) With $p_X = 0$: $F = 6280 + 157 - 50 = 6387$ N: open.',
        '(c) Shut needs $p_X (A_A + A_B) + F_s \\ge p_B A_B$: $p_X \\ge (180\\times10^5 \\times 1.57\\times10^{-4} - 50)/4.71\\times10^{-4} = 58.9\\times10^5$ Pa.'
      ],
      a: '(a) shut; (b) open; (c) at least 59 bar in X — in practice X is fed from the higher of A and B.'
    }
  ],
  quiz: [
    { q: 'A logic element\'s spring chamber X is vented to tank and port A is at 150 bar. The poppet…', choices: ['stays shut', 'opens', 'opens only if B is also pressurised', 'chatters'], a: 1,
      why: 'Nothing but the light spring holds it closed; 150 bar on the seat area easily overcomes it.' },
    { q: 'A 2/2 logic element holds pressure leak-free in its closed position, unlike a spool valve.', a: true,
      why: 'A poppet seals on a seat; a spool needs a running clearance, which always leaks a little.' },
    { q: 'With an area ratio of 1 : 1, the pressure at port B…', choices: ['helps to open the poppet strongly', 'has no effect on opening, because there is no ring area', 'closes the poppet', 'doubles the cracking pressure'], a: 1,
      why: 'A_A = A_X means A_B = 0: the side port has no area to push on. That is why 1 : 1 elements are used for pressure functions.' },
    { q: 'A logic poppet has a seat area of 2 cm² and an 80 N spring. With X vented, what pressure at A opens it?', answer: 4, unit: 'bar', tol: 0.02,
      why: 'p = F/A = 80/2×10⁻⁴ = 4×10⁵ Pa = 4 bar.' },
    { q: 'Why are screw-in cartridge blocks popular on mobile machines?', choices: ['they allow higher pressures than any other valve', 'a whole circuit fits in a compact block with no piping and few leak points', 'they need no filtration', 'they are always cheaper per valve'], a: 1,
      why: 'Space, weight and leak points matter on a machine; the manifold\'s drillings replace tubes and fittings.' }
  ],
  problems: [
    { q: 'A logic element with a 3.14 cm² seat and a 1.57 cm² ring has 250 bar at A and nothing at B. With a 60 N spring, what is the lowest pressure in X that keeps it shut?', answer: 165.4, unit: 'bar', tol: 0.02,
      steps: ['Shut needs $p_X (A_A + A_B) \\ge p_A A_A - F_s$.', '$p_X \\ge (250\\times10^5 \\times 3.14\\times10^{-4} - 60)/4.71\\times10^{-4} = (7850 - 60)/4.71\\times10^{-4} = 1.654\\times10^7$ Pa = 165.4 bar.', 'In practice X is simply connected to A (or to the higher of A and B), which always keeps the poppet shut.'] }
  ],
  applications: [
    'Hydraulic presses and injection-moulding machines switching thousands of litres a minute.',
    'Compact valve blocks on aerial work platforms, cranes, tail lifts and agricultural machines.',
    'Counterbalance and pilot-check cartridges fitted directly into cylinder ports.',
    'Power packs with a whole circuit in one manifold.'
  ],
  history: 'Slip-in two-way cartridge valves spread from the early 1970s, first in presses and plastics machinery, where their high flows, leak-free seats and fast switching replaced banks of large spool valves. Screw-in cartridges grew with mobile hydraulics in the same decades.'
},

/* ================================================================ BASIC CIRCUITS */
{
  id: 'basic-circuit', parent: 'basic-circuits', title: 'A basic cylinder circuit', level: 1,
  short: 'The smallest circuit that does useful work: a tank, a motor-driven pump, a relief valve, a directional valve and a cylinder, with a filter and a gauge. Knowing what each part does, and sizing it for a job, is the start of all hydraulic design.',
  keywords: ['basic circuit', 'hydraulic circuit', 'cylinder circuit', 'power pack', 'pump', 'relief valve', 'directional valve', '4/3 valve', 'reservoir', 'filter', 'gauge', 'circuit design', 'sizing', 'electric motor power', 'cycle time'],
  prereq: ['hydraulic-cylinder', 'directional-valves', 'relief-valve', 'reading-circuit-diagrams'],
  related: ['hydraulic-system', 'centre-conditions', 'meter-in-out', 'energy-losses-heat', 'reservoirs', 'filtration', 'displacement-flow', 'iso-1219'],
  body: `
Every hydraulic machine, however complicated, contains the same basic circuit: something to hold the oil, something to push it, something to limit the pressure, something to steer it and something to do the work. Learn this circuit and the others are variations on it.

### The parts and their jobs
| Part | Its job | Typical for a 22 L/min circuit |
|---|---|---|
| Reservoir (tank) | stores oil, lets air and dirt settle, sheds heat | 70–110 L (3–5 times the pump flow per minute) |
| Suction strainer | keeps coarse debris out of the pump | 100–150 µm mesh, low pressure drop |
| Electric motor and pump | turn shaft power into flow | 7.5 kW, 1450 rpm; 16 cm³/rev |
| Relief valve | caps the pressure, protects everything | 160 bar |
| Pressure gauge | shows what the load demands | 0–250 bar, glycerine-filled |
| 4/3 directional valve | steers oil to either end or holds it | solenoid-operated, spring-centred |
| Cylinder | turns pressure and flow into force and motion | 63/36 mm bore/rod, 400 mm stroke |
| Return filter | keeps the oil clean | 10 µm, with a bypass at about 2–3 bar |

In the ISO 1219-1:2012 diagram the pump sits at the bottom, energy flows upwards, and every valve is drawn in its **rest position**, with the lines attached to the box that is active when nothing is energised. Working lines are solid, pilot lines long-dashed, drains short-dashed; a dot marks a connection.

### A cycle
1. **Start.** The motor runs; the valve is centred. With a *closed* centre the pump flow has nowhere to go but over the relief valve at full pressure; with a *tandem* centre (P connected to T) it flows back to tank at a few bar ([[centre-conditions]]).
2. **Extend.** Solenoid Y1 shifts the valve: P→A, B→T. The pressure rises only as far as the load needs — perhaps 40 bar while the rod approaches the work — and the rod moves at $v = Q/A_1$.
3. **Work.** The rod meets the load; the pressure climbs to $F/A_1$. If that exceeds the relief setting, the cylinder stalls and the relief valve takes the flow.
4. **End of stroke.** The piston reaches the end; the pressure jumps to the relief setting and all the pump's power becomes heat until the valve is switched.
5. **Retract.** Y2: P→B, A→T. The rod returns faster, $v = Q/A_2$, and the cap end sends $A_1/A_2$ times the pump flow back to tank.

### Sizing it
A designer works backwards from the job. To push 40 kN over 400 mm in about 3.5 s:

- **Bore** at a working pressure of 160 bar: $A_1 = F/p = 25$ cm², $D = 56$ mm; the next standard bore is 63 mm, which needs only 128 bar.
- **Flow**: $v = 0.4/3.5 = 0.114$ m/s, so $Q = vA_1 = 21.4$ L/min; a 16 cm³/rev pump at 1450 rpm with 95 % volumetric efficiency gives 22 L/min.
- **Relief**: above the working pressure plus the line and valve losses, 160 bar.
- **Motor**: at the relief setting, $P = pQ/\\eta_t = 160 \\times 22/600/0.85 = 6.9$ kW; a 7.5 kW motor.

Run the working version of this circuit in the simulation, and see [[meter-in-out]] for adding speed control, [[regenerative-circuit]] for a faster approach and [[load-holding]] for keeping a raised load up.

> [!warn] Even a simple circuit stores energy: in raised loads, in oil trapped by a closed-centre valve, in accumulators. Before any maintenance, lower or support the load, stop the pump, release the pressure, and lock out and tag the machine. Hoses can whip if a fitting fails; hot oil burns; and a pinhole jet can inject oil through skin — a surgical emergency needing medical care at once.
`,
  ideas: [
    'Tank, pump, relief valve, directional valve and actuator — plus filter and gauge — make the basic circuit.',
    'The load sets the pressure, the relief valve caps it, the pump flow sets the speed.',
    'Diagrams show valves in their rest position, with energy flowing from the pump at the bottom to the actuators at the top.',
    'Size from the job: bore from force and pressure, pump from speed and area, motor from pressure × flow ÷ efficiency.',
    'A pump running against a closed centre or an end stop turns all its power into heat.'
  ],
  pitfalls: [
    'The gauge shows the pump\'s pressure — The gauge shows what the load (plus the losses) demands at that moment. The pump makes flow; the pressure is whatever is needed to push that flow, up to the relief setting.',
    'The relief valve only matters in a fault — In a fixed-pump circuit it opens at every end of stroke and whenever a closed-centre valve is centred; it is a working part, and a major source of heat.',
    'Size the motor for the working pressure — The motor must survive the pump running at the relief setting, which happens at every stall and end of stroke.'
  ],
  formulas: [
    {
      name: 'Pump flow',
      expr: 'Q = Vg*n*etav', tex: 'Q = V_g\\,n\\,\\eta_v',
      vars: {
        Q: { name: 'pump flow', q: 'flowrate', unit: 'L/min', tex: 'Q' },
        Vg: { name: 'pump displacement', q: 'displacement', unit: 'cm³/rev', value: 16, tex: 'V_g' },
        n: { name: 'shaft speed', q: 'frequency', unit: 'rpm', value: 1450, tex: 'n' },
        etav: { name: 'volumetric efficiency', q: 'ratio', unit: '%', value: 95, min: 1, max: 100, tex: '\\eta_v' }
      },
      note: 'Volumetric efficiency falls as pressure rises, because more oil leaks back inside the pump (see [[pump-efficiencies]]).',
      practice: { unknowns: ['Q', 'Vg'] },
      stories: { Q: 'A pump of {Vg} turns at {n} with a volumetric efficiency of {etav}. What does it deliver?', Vg: 'A circuit needs {Q} from a pump turning at {n} with a volumetric efficiency of {etav}. What displacement is needed?' }
    },
    {
      name: 'Drive power',
      expr: 'P = p*Q/eta', tex: 'P = \\dfrac{p\\,Q}{\\eta_t}',
      vars: {
        P: { name: 'shaft power the motor must give', q: 'power', unit: 'kW', tex: 'P' },
        p: { name: 'pump pressure (gauge; use the relief setting)', q: 'pressure', unit: 'bar', value: 160, tex: 'p' },
        Q: { name: 'pump flow', q: 'flowrate', unit: 'L/min', value: 22, tex: 'Q' },
        eta: { name: 'overall pump efficiency', q: 'ratio', unit: '%', value: 85, min: 1, max: 100, tex: '\\eta_t' }
      },
      note: 'P (kW) = p (bar) × Q (L/min) / (600 η). Choose the next standard motor size above the result.',
      practice: { unknowns: ['P', 'Q'] },
      stories: { P: 'A pump delivers {Q} at {p} with an overall efficiency of {eta}. What power must its motor supply?', Q: 'A {P} motor drives a pump ({eta} overall) at {p}. What flow can it deliver?' }
    },
    {
      name: 'Cycle time, out and back',
      expr: 't = s*(A1 + A2)/Q', tex: 't = \\dfrac{s\\,(A_1 + A_2)}{Q}',
      vars: {
        t: { name: 'time to extend and retract', q: 'time', unit: 's', tex: 't' },
        s: { name: 'stroke', q: 'length', unit: 'mm', value: 400, tex: 's' },
        A1: { name: 'piston area', q: 'area', unit: 'cm²', value: 31.2, tex: 'A_1' },
        A2: { name: 'annulus area', q: 'area', unit: 'cm²', value: 21.0, tex: 'A_2' },
        Q: { name: 'pump flow', q: 'flowrate', unit: 'L/min', value: 22, tex: 'Q' }
      },
      note: 'Moving time only: add the valve switching times, dwells and the time for pressure to build.',
      practice: { unknowns: ['t', 'Q'] },
      stories: { t: 'A cylinder with {A1} of piston area and {A2} of annulus has a stroke of {s} and is fed with {Q}. How long does a full out-and-back stroke take?', Q: 'A cylinder ({A1} and {A2}, stroke {s}) must extend and retract in {t}. What pump flow does that need?' }
    },
    {
      name: 'Bore for a force',
      expr: 'D = sqrt(4*F/(pi*p))', tex: 'D = \\sqrt{\\dfrac{4F}{\\pi p}}',
      vars: {
        D: { name: 'bore', q: 'length', unit: 'mm', tex: 'D' },
        F: { name: 'force needed', q: 'force', unit: 'kN', value: 40, tex: 'F' },
        p: { name: 'working pressure (gauge)', q: 'pressure', unit: 'bar', value: 160, tex: 'p' }
      },
      note: 'Then round up to a standard bore — the ISO 3320 series runs 25, 32, 40, 50, 63, 80, 100, 125, 160, 200 mm and on.',
      stories: { D: 'A cylinder must push {F} at a working pressure of {p}. What bore does it need, before rounding up?' }
    }
  ],
  examples: [
    {
      title: 'Designing a small press circuit',
      q: 'A press must push 40 kN over a 400 mm stroke in about 3.5 s, from a power pack whose relief valve will be set at 160 bar. Choose the bore, the pump and the motor.',
      steps: [
        'Area at 160 bar: $A_1 = 40\\,000/1.6\\times10^7 = 2.5\\times10^{-3}$ m²; bore $D = \\sqrt{4A_1/\\pi} = 56.4$ mm. Choose 63 mm ($A_1 = 31.2$ cm²); the push then needs $40\\,000/3.12\\times10^{-3} = 128$ bar, leaving margin for losses.',
        'Speed $0.4/3.5 = 0.114$ m/s; flow $Q = 0.114 \\times 3.12\\times10^{-3} = 3.56\\times10^{-4}$ m³/s = 21.4 L/min.',
        'Pump: $16$ cm³/rev × 1450 rpm × 0.95 = 22.0 L/min.',
        'Motor, at the relief setting and 85 % overall efficiency: $160 \\times 22.0/600/0.85 = 6.9$ kW — a 7.5 kW motor.'
      ],
      a: '63 mm bore, a 16 cm³/rev pump at 1450 rpm (22 L/min), a 7.5 kW motor.'
    },
    {
      title: 'Heat while it waits',
      q: 'In a 30 s cycle the press above waits 20 s with its valve centred. How much heat does the pump make while waiting, averaged over the cycle, with a closed-centre valve — and with a tandem centre that unloads the pump at 3 bar?',
      steps: [
        'Closed centre: all 22 L/min over the relief valve at 160 bar: $160 \\times 22/600 = 5.9$ kW for 20 s of every 30: 3.9 kW on average.',
        'Tandem centre: $3 \\times 22/600 = 0.11$ kW for the same 20 s: 0.07 kW on average.',
        'The oil cooler for the closed-centre version would have to remove about 4 kW more — a good reason to unload the pump.'
      ],
      a: 'About 3.9 kW of waiting heat with a closed centre, under 0.1 kW with a tandem centre.'
    }
  ],
  quiz: [
    { q: 'A fixed pump runs and a closed-centre valve is centred. Where does the pump\'s flow go?', choices: ['nowhere — the pump stops', 'over the relief valve, at the relief setting', 'into the cylinder, slowly', 'back through the pump'], a: 1,
      why: 'A positive-displacement pump must deliver its flow; with every port blocked the pressure rises to the relief setting and the relief valve passes it all — as heat.' },
    { q: 'The gauge on the pump line always reads the relief setting while the pump runs.', a: false,
      why: 'It reads what the load and losses demand: low while the rod moves freely, higher under load, and the relief setting only at a stall, an end stop or a closed centre.' },
    { q: 'Which part of the basic circuit limits the largest force the cylinder can give?', choices: ['the pump displacement', 'the relief-valve setting, times the piston area', 'the motor power', 'the tank size'], a: 1,
      why: 'Force = pressure × area, and the relief valve caps the pressure. A bigger pump makes it faster, not stronger.' },
    { q: 'A pump of 25 cm³/rev turns at 1500 rpm with 94 % volumetric efficiency. What does it deliver?', answer: 35.25, unit: 'L/min', tol: 0.02,
      why: 'Q = 25 × 1500 × 0.94 = 35 250 cm³/min = 35.25 L/min.' },
    { q: 'In an ISO 1219 diagram, a directional valve is drawn…', choices: ['in its energised position', 'in its rest (normal) position, with the lines connected to the box that is active at rest', 'in whatever position the designer likes', 'without its spring'], a: 1,
      why: 'Diagrams show the circuit at rest; the reader imagines the other boxes sliding into place when an actuator operates.' }
  ],
  problems: [
    { q: 'A cylinder of 80 mm bore and 45 mm rod has a 500 mm stroke and is fed with 30 L/min. How long does a full out-and-back stroke take?', answer: 8.46, unit: 's', tol: 0.02,
      steps: ['$A_1 = \\pi \\times 0.08^2/4 = 50.27$ cm²; $A_2 = 50.27 - \\pi \\times 0.045^2/4 = 34.36$ cm².', 'Volume swept out and back: $s(A_1 + A_2) = 0.5 \\times 8.463\\times10^{-3} = 4.23\\times10^{-3}$ m³; flow $Q = 30/60\\,000 = 5\\times10^{-4}$ m³/s.', '$t = 4.23\\times10^{-3}/5\\times10^{-4} = 8.46$ s: 5.0 s out and 3.4 s back.'] }
  ],
  applications: [
    'Workshop presses, log splitters and tipping trailers — the basic circuit almost unchanged.',
    'The power pack of any industrial machine, with more valves added to the same core.',
    'Training rigs, where students build exactly this circuit first.'
  ],
  sim: 'ref-hyd-circuit'
},

{
  id: 'meter-in-out', parent: 'basic-circuits', title: 'Meter-in, meter-out and bleed-off', level: 2,
  short: 'A flow control can sit in the line into an actuator (meter-in), in the line out of it (meter-out) or in a branch that bleeds pump flow to tank (bleed-off). Each controls speed differently: only meter-out holds an overrunning load, only bleed-off lets the pump pressure follow the load, and meter-out can multiply the pressure in the rod end.',
  keywords: ['meter-in', 'meter-out', 'bleed-off', 'speed control circuit', 'overrunning load', 'negative load', 'running away', 'cavitation', 'pressure intensification', 'back-pressure', 'efficiency', 'heat', 'drill breakthrough', 'one-way flow control'],
  prereq: ['flow-control', 'hydraulic-cylinder', 'basic-circuit', 'area-ratio'],
  related: ['pressure-compensation', 'orifice-equation', 'counterbalance-valve', 'load-holding', 'intensifiers', 'energy-losses-heat', 'heat-coolers', 'pneumatics:speed-control-circuits'],
  body: `
With a fixed pump, a cylinder is slowed by making its oil pass a restriction. There are exactly three places to put it, and the choice decides how the circuit behaves with different loads, how much heat it makes, and whether it is safe with a load that pulls.

### Meter-in
The flow control sits in the line **into** the cylinder — a one-way valve, so that the return is free. The pump cannot push all its flow through the throttle, so the pressure rises to the relief setting and the surplus crosses the relief valve. The throttle drops the difference between the relief setting and the load pressure; the rod end is almost at tank pressure.

Meter-in is simple and works well with **resisting** loads — pressing, lifting, pushing a feed against a cutter. It fails with an **overrunning** load, one that pulls the rod along: nothing on the outlet side resists, so the piston runs ahead of the metered oil, the cap end falls to a vacuum and **cavitates**, and the load runs away. The same happens in a drilling feed at **breakthrough**: when the drill bursts through, the load vanishes and the rod lunges forward, pushed by the oil that was compressed under load (a litre at 40 bar gives back about 3 cm³ as it expands — about a millimetre of travel in a 63 mm cylinder, several times more with hoses).

### Meter-out
The flow control sits in the line **out of** the cylinder, restricting the oil the piston pushes out. The trapped outlet oil is a hydraulic cushion: whatever the load does, the piston can only move as fast as the oil leaves. Meter-out therefore controls **both resisting and overrunning loads**, feeds smoothly through breakthrough, and is the usual choice for machine-tool feeds and for lowering.

Its price is **back-pressure**, and with it **pressure intensification**. The pump still runs at the relief setting $p_1$ on the cap end. Balancing forces on the piston while it extends, with $F$ the load *pulling* the rod out:

$$p_1 A_1 + F = p_2 A_2 \\quad\\Rightarrow\\quad p_2 = p_1\\varphi + \\frac{F}{A_2}, \\qquad \\varphi = \\frac{A_1}{A_2}$$

With no load, a cylinder of area ratio 2 metering out against a 160 bar relief has **320 bar** in its rod end; add an overrunning load and it is higher still. Rod seals, the cylinder head, hoses and the throttle must all be rated for it — and a meter-out throttle that is closed completely while the pump pushes can burst a cylinder rated only for the pump pressure.

### Bleed-off
The flow control sits in a **branch** from the pump line to tank, in parallel with the actuator. The pump pressure is only what the load needs; the throttle bleeds part of the flow to tank at that pressure, and the rest goes to the cylinder. The relief valve stays closed. Bleed-off is the most **efficient** of the three, but the least **precise**: the bled flow grows with the load pressure ($\\sqrt{p_L}$), so a heavier load slows the cylinder more than in the other two; any change in pump flow (motor speed, pump wear) passes straight to the actuator; and it cannot hold an overrunning load at all.

### Side by side
| | Meter-in | Meter-out | Bleed-off |
|---|---|---|---|
| Throttle in | the inlet line | the outlet line | a branch to tank |
| Pump pressure | relief setting | relief setting | load pressure |
| Overrunning load | runs away (cavitation) | held | runs away |
| Speed held under changing load (plain throttle) | fair | fair | poor |
| Extra pressure | none | rod end up to $\\varphi p_1$ and more | none |
| Heat | high | high | low |
| Typical use | presses, lifting | feeds, lowering, overrunning loads | fans, conveyors, non-critical speeds |

For a 63/36 cylinder pushing 30 kN at 50 mm/s from a 22 L/min pump with 160 bar relief, meter-in and meter-out both take 5.9 kW from the pump and deliver 1.5 kW (26 %); bleed-off runs the pump at 96 bar, takes 3.5 kW and delivers the same 1.5 kW (43 %). With a [[pressure-compensation|pressure-compensated]] flow control in place of the plain throttle, all three hold their speed much better; the energy argument does not change.

> [!warn] In meter-out circuits, check the rod-end pressure rating before commissioning: $p_2 = p_1\\varphi + F/A_2$ can far exceed the pump pressure. A flow control that holds an overrunning load is a safety part — never remove or open it with the load raised: lower or support the load, stop the pump, release the pressure and lock out the machine first.
`,
  ideas: [
    'Meter-in restricts the oil going in; meter-out the oil coming out; bleed-off diverts part of the pump flow to tank.',
    'Only meter-out holds an overrunning load, because the trapped outlet oil resists the pull.',
    'Meter-out intensifies: p₂ = p₁φ + F/A₂ — the rod end can see twice the relief pressure or more.',
    'Bleed-off lets the pump run at load pressure and wastes least, but its speed follows the load and the pump flow.',
    'With a fixed pump, meter-in and meter-out run at the relief setting; the surplus becomes heat.'
  ],
  pitfalls: [
    'Meter-in and meter-out do the same job from different ends — They do the same with a resisting load. With an overrunning load meter-in lets the load run away, and meter-out multiplies the rod-end pressure.',
    'The rod end of a meter-out cylinder is at most at pump pressure — Force balance gives p₂ = p₁ A₁/A₂ + F/A₂: an area ratio of 2 doubles it before any overrunning load is added.',
    'Bleed-off saves energy, so it is the best choice — It is the most efficient, but its speed changes with the load and the pump flow, and it cannot control an overrunning load.'
  ],
  derivation: {
    title: 'Pressure intensification in meter-out',
    steps: [
      { text: 'While the cylinder extends at constant speed, the forces on the piston balance: the cap-end pressure pushes out, the load $F$ (positive when it pulls the rod out) helps, and the rod-end pressure pushes back.', tex: 'p_1 A_1 + F = p_2 A_2' },
      { text: 'Solve for the rod-end pressure:', tex: 'p_2 = p_1\\frac{A_1}{A_2} + \\frac{F}{A_2} = p_1\\varphi + \\frac{F}{A_2}' },
      { text: 'In meter-out the cap end sits at the relief setting (the pump pushes more than the throttle lets through), so $p_1$ is as high as it can be. With $\\varphi = 2$, $p_1 = 160$ bar and no load, $p_2 = 320$ bar.' },
      { text: 'A resisting load makes $F$ negative and lowers $p_2$; if $p_2$ would fall below zero, the load is too large to move at this pressure and the cylinder stalls.' }
    ]
  },
  formulas: [
    {
      name: 'Rod-end pressure in meter-out',
      expr: 'p2 = p1*phi + F/A2', tex: 'p_2 = p_1\\,\\varphi + \\dfrac{F}{A_2}',
      vars: {
        p2: { name: 'rod-end pressure (gauge)', q: 'pressure', unit: 'bar', signed: true, tex: 'p_2' },
        p1: { name: 'cap-end pressure — the relief setting (gauge)', q: 'pressure', unit: 'bar', value: 160, tex: 'p_1' },
        phi: { name: 'area ratio A₁/A₂', value: 1.49, min: 1, max: 10, tex: '\\varphi' },
        F: { name: 'load pulling the rod out (negative if it resists)', q: 'force', unit: 'kN', value: 10, signed: true, tex: 'F' },
        A2: { name: 'annulus area', q: 'area', unit: 'cm²', value: 21.0, tex: 'A_2' }
      },
      note: 'Steady extension with the flow control metering the rod-end oil. Friction ignored. A negative result means the cylinder cannot move against that resisting load.',
      practice: { unknowns: ['p2', 'F'] },
      stories: {
        p2: 'A cylinder with an area ratio of {phi} and an annulus of {A2} extends under meter-out control with {p1} on the cap end, while a load pulls on the rod with {F}. What is the pressure in the rod end?',
        F: 'A meter-out cylinder (area ratio {phi}, annulus {A2}) has {p1} on the cap end and {p2} in the rod end. What load is pulling on the rod?'
      }
    },
    {
      name: 'Meter-in speed against a resisting load',
      expr: 'v = Cd*A0*sqrt(2*(ps - F/A1)/rho)/A1', tex: 'v = \\dfrac{C_d A_0}{A_1}\\sqrt{\\dfrac{2\\,(p_s - F/A_1)}{\\rho}}',
      vars: {
        v: { name: 'rod speed', q: 'speed', unit: 'mm/s', tex: 'v' },
        Cd: { name: 'discharge coefficient of the throttle', value: 0.65, min: 0.05, max: 1, tex: 'C_d' },
        A0: { name: 'throttle opening', q: 'area', unit: 'mm²', value: 4, tex: 'A_0' },
        ps: { name: 'relief setting (gauge)', q: 'pressure', unit: 'bar', value: 160, tex: 'p_s' },
        F: { name: 'resisting load', q: 'force', unit: 'kN', value: 30, tex: 'F' },
        A1: { name: 'piston area', q: 'area', unit: 'cm²', value: 31.2, tex: 'A_1' },
        rho: { name: 'oil density', q: 'density', unit: 'kg/m³', value: 870, tex: '\\rho' }
      },
      note: 'Plain throttle; line, valve and rod-end losses ignored; valid while the throttle passes less than the pump flow. The load appears under the root: that is the load sensitivity.',
      practice: { unknowns: ['v', 'A0', 'F'] },
      stories: {
        v: 'A meter-in throttle of {A0} ({Cd}) feeds a cylinder of {A1} piston area against a load of {F}, with the relief valve at {ps}. Oil density {rho}. How fast does the rod move?',
        A0: 'A cylinder of {A1} must extend at {v} against {F} with the relief valve at {ps}. What meter-in throttle opening ({Cd}, oil {rho}) is needed?',
        F: 'A meter-in throttle of {A0} ({Cd}) feeds a cylinder of {A1} at {ps}; the rod moves at {v}. What load is it pushing? (Oil {rho}.)'
      }
    },
    {
      name: 'Bleed-off: flow reaching the cylinder',
      expr: 'Q = Qp - Cd*A0*sqrt(2*pL/rho)', tex: 'Q = Q_p - C_d A_0\\sqrt{\\dfrac{2\\,p_L}{\\rho}}',
      vars: {
        Q: { name: 'flow to the cylinder', q: 'flowrate', unit: 'L/min', tex: 'Q' },
        Qp: { name: 'pump flow', q: 'flowrate', unit: 'L/min', value: 22, tex: 'Q_p' },
        Cd: { name: 'discharge coefficient of the bleed throttle', value: 0.65, min: 0.05, max: 1, tex: 'C_d' },
        A0: { name: 'bleed throttle opening', q: 'area', unit: 'mm²', value: 1.5, tex: 'A_0' },
        pL: { name: 'load pressure = pump pressure (gauge)', q: 'pressure', unit: 'bar', value: 96, tex: 'p_L' },
        rho: { name: 'oil density', q: 'density', unit: 'kg/m³', value: 870, tex: '\\rho' }
      },
      note: 'The bled flow rises with the load pressure, so a heavier load leaves less for the cylinder.',
      practice: { unknowns: ['Q', 'A0'] },
      stories: {
        Q: 'A pump gives {Qp}; a bleed-off throttle of {A0} ({Cd}) returns part of it to tank at the load pressure of {pL}. What flow reaches the cylinder? (Oil {rho}.)',
        A0: 'A pump gives {Qp} and the cylinder should get {Q} at a load pressure of {pL}. What bleed throttle opening ({Cd}, oil {rho}) does that?'
      }
    },
    {
      name: 'Circuit efficiency',
      expr: 'eta = F*v/(p*Qp)', tex: '\\eta = \\dfrac{F\\,v}{p\\,Q_p}',
      vars: {
        eta: { name: 'circuit efficiency (useful power ÷ hydraulic power from the pump)', q: 'ratio', unit: '%', tex: '\\eta' },
        F: { name: 'load force', q: 'force', unit: 'kN', value: 30, tex: 'F' },
        v: { name: 'rod speed', q: 'speed', unit: 'mm/s', value: 50, tex: 'v' },
        p: { name: 'pump pressure (gauge)', q: 'pressure', unit: 'bar', value: 160, tex: 'p' },
        Qp: { name: 'pump flow', q: 'flowrate', unit: 'L/min', value: 22, tex: 'Q_p' }
      },
      note: 'Pump losses not included. Meter-in and meter-out: p = relief setting; bleed-off: p ≈ load pressure.',
      practice: { unknowns: ['eta', 'p'] },
      stories: { eta: 'A pump delivers {Qp} at {p}; the cylinder pushes {F} at {v}. What fraction of the hydraulic power does useful work?' }
    }
  ],
  examples: [
    {
      title: 'Three circuits, one job',
      q: 'A 63/36 cylinder ($A_1 = 31.2$ cm², $A_2 = 21.0$ cm²) must push 30 kN at 50 mm/s. The pump gives 22 L/min and the relief valve is set at 160 bar. Compare the pump power, the efficiency and the rod-end pressure for meter-in, meter-out and bleed-off. Ignore line losses.',
      steps: [
        'Useful power: $F v = 30\\,000 \\times 0.05 = 1.5$ kW. Load pressure: $30\\,000/3.12\\times10^{-3} = 96$ bar.',
        'Meter-in: pump at 160 bar, $P = 160 \\times 22/600 = 5.87$ kW; efficiency $1.5/5.87 = 26\\ \\%$. Rod end near tank pressure.',
        'Meter-out: pump also at 160 bar, 5.87 kW, 26 %. Rod end: $p_2 = (1.6\\times10^7 \\times 3.12\\times10^{-3} - 30\\,000)/2.10\\times10^{-3} = 95$ bar — the throttle drops that.',
        'Bleed-off: pump at the load pressure, 96 bar: $P = 96 \\times 22/600 = 3.53$ kW; efficiency 43 %.',
        'Heat to remove: 4.4 kW, 4.4 kW and 2.0 kW.'
      ],
      a: 'Meter-in and meter-out: 5.9 kW in, 26 %; bleed-off: 3.5 kW in, 43 %.'
    },
    {
      title: 'Intensification with an overrunning load',
      q: 'The same cylinder ($\\varphi = 1.49$, $A_2 = 21.0$ cm²) extends under meter-out control against no resistance while a 10 kN load pulls on its rod. The relief valve holds 160 bar on the cap end. What pressure is in the rod end?',
      steps: [
        { text: 'Force balance:', tex: 'p_2 = p_1\\varphi + \\frac{F}{A_2} = 160 \\times 1.49 + \\frac{10\\,000}{2.10\\times10^{-3}}\\ \\mathrm{Pa}' },
        '$160 \\times 1.49 = 238$ bar, and $10\\,000/2.10\\times10^{-3} = 4.76\\times10^6$ Pa = 48 bar.',
        '$p_2 = 286$ bar — nearly twice the relief setting, in a part of the circuit the relief valve does not protect.'
      ],
      a: 'About 286 bar in the rod end.'
    }
  ],
  quiz: [
    { q: 'Which arrangement can control the speed of a load that pulls the rod out?', choices: ['meter-in', 'meter-out', 'bleed-off', 'none of them'], a: 1,
      why: 'Only meter-out puts a restriction on the oil the piston pushes out, and that trapped oil resists the pull. Meter-in and bleed-off let the piston run ahead of the oil.' },
    { q: 'In a meter-in circuit with a fixed pump, the pump pressure during a controlled stroke is…', choices: ['the load pressure', 'the relief setting', 'zero', 'half the relief setting'], a: 1,
      why: 'The throttle refuses part of the pump flow; the pressure rises until the relief valve takes the surplus.' },
    { q: 'A 2:1 cylinder is metered out with the relief valve at 150 bar and no load. What is the rod-end pressure?', answer: 300, unit: 'bar', tol: 0.02,
      why: 'p₂ = p₁ A₁/A₂ = 150 × 2 = 300 bar, twice the pump pressure.' },
    { q: 'Of the three, bleed-off wastes least energy because the pump works only at the load pressure.', a: true,
      why: 'The relief valve stays shut; the surplus is bled at load pressure. The price is poorer speed control.' },
    { q: 'A bleed-off circuit slows noticeably when the load increases. Why?', choices: ['the pump slows down', 'the higher pressure pushes more oil through the bleed throttle, leaving less for the cylinder', 'the relief valve opens', 'the oil gets thicker'], a: 1,
      why: 'The bleed throttle passes C_d A √(2p/ρ): higher load pressure, more bled flow, less to the cylinder.' }
  ],
  problems: [
    { q: 'A meter-in throttle of 4 mm² ($C_d = 0.65$, oil 870 kg/m³) feeds a 63 mm cylinder ($A_1 = 31.2$ cm²) with the relief valve at 160 bar. How fast does the rod extend against 40 kN? (The pump gives more than the throttle passes.)', answer: 71.2, unit: 'mm/s', tol: 0.02,
      steps: ['Load pressure: $40\\,000/3.12\\times10^{-3} = 128.2$ bar; throttle drop $160 - 128.2 = 31.8$ bar.', 'Flow: $0.65 \\times 4\\times10^{-6} \\times \\sqrt{2 \\times 3.18\\times10^6/870} = 2.22\\times10^{-4}$ m³/s = 13.3 L/min.', 'Speed: $2.22\\times10^{-4}/3.12\\times10^{-3} = 0.0712$ m/s = 71 mm/s — against 30 kN it would be 101 mm/s.'] },
    { q: 'A pump gives 22 L/min. A bleed-off throttle of 1.5 mm² ($C_d = 0.65$, oil 870 kg/m³) is open while the load pressure is 96 bar. What flow reaches the cylinder?', answer: 13.3, unit: 'L/min', tol: 0.02,
      steps: ['Bled flow: $0.65 \\times 1.5\\times10^{-6} \\times \\sqrt{2 \\times 9.6\\times10^6/870} = 1.45\\times10^{-4}$ m³/s = 8.7 L/min.', 'To the cylinder: $22 - 8.7 = 13.3$ L/min.'] }
  ],
  applications: [
    'Meter-out one-way flow controls on drilling and milling feeds, and on the lowering side of lifting tables.',
    'Meter-in on presses and on cylinders that always push against a load.',
    'Bleed-off on fan and conveyor motors where efficiency matters more than exact speed.',
    'Pneumatic cylinders are almost always metered out, for the same reason of stiffness (see [[pneumatics:speed-control-circuits]]).'
  ],
  sim: 'fc-metering'
},
{
  id: 'regenerative-circuit', parent: 'basic-circuits', title: 'Regenerative circuits', level: 2,
  short: 'In a regenerative circuit the oil pushed out of the rod end during extension is sent back into the cap end instead of to tank. Both sides see the same pressure, only the rod\'s area pushes, and the rod moves out fast with little force: v = Q/(A₁ − A₂), F = p(A₁ − A₂).',
  keywords: ['regenerative circuit', 'regeneration', 'differential circuit', 'rapid advance', 'fast approach', 'rod area', 'area ratio', '2:1 cylinder', 'equal speeds', 'regen valve', 'high-low', 'press circuit'],
  prereq: ['hydraulic-cylinder', 'area-ratio', 'basic-circuit'],
  related: ['cylinder-speed', 'hi-lo-circuit', 'accumulator-circuits', 'industrial-presses', 'line-sizing', 'sequence-valve', 'centre-conditions', 'mobile-hydraulics'],
  body: `
When a cylinder extends in the ordinary way, the oil in its rod end is pushed back to tank — oil the pump once pressurised, simply thrown away. A **regenerative circuit** sends it the other way: into the cap end, to join the pump flow. The rod end and the cap end are connected, both at the same pressure; the pressure on the annulus pushes back almost as hard as the pressure on the piston pushes forward, and the only area left doing work is the **rod's cross-section**, $A_r = A_1 - A_2$.

### Fast, and weak
A piston area $A_1$ moving at $v$ sweeps $A_1v$; the rod end gives back $A_2v$; the pump must supply only the difference:

$$v = \\frac{Q_p}{A_1 - A_2}, \\qquad F = p\\,(A_1 - A_2)$$

The rod extends as if the pump were pushing on a plunger the size of the rod — much faster than normal extension, with much less force. The power is unchanged: $Fv = pQ_p$ either way.

For a 63 mm bore fed with 22 L/min at a 160 bar relief setting:

| Rod | Area ratio $\\varphi$ | Normal extend | Regen extend | Retract | Regen force (normal 49.9 kN) |
|---|---|---|---|---|---|
| 28 mm | 1.25 | 0.118 m/s | 0.60 m/s | 0.15 m/s | 9.9 kN |
| 36 mm | 1.49 | 0.118 m/s | 0.36 m/s | 0.17 m/s | 16.3 kN |
| 45 mm | 2.04 | 0.118 m/s | 0.23 m/s | 0.24 m/s | 25.4 kN |

### The 2:1 cylinder
When the rod area is half the piston area ($d = D/\\sqrt2$, $\\varphi = 2$), the rod area equals the annulus area. Regenerative extension and normal retraction then have **equal speeds and equal forces** — a trick used wherever a machine should move the same way in both directions without an expensive double-rod cylinder.

### Watch the flows
The flow in the cap-end line is larger than the pump's:

$$Q_1 = Q_p\\,\\frac{A_1}{A_1 - A_2} = Q_p\\,\\frac{\\varphi}{\\varphi - 1}$$

With $\\varphi = 1.49$ it is three times the pump flow, 67 L/min from a 22 L/min pump; with a thin rod ($\\varphi = 1.25$) five times. The cap-end port, hose and the regeneration path must be sized for it, or their pressure drop eats the force and heats the oil ([[line-sizing]]).

### How it is built
- **A regenerative spool position.** A directional valve whose extend box connects P, A and B together and blocks T: every extension is regenerative.
- **A separate regeneration valve.** A normal 4/3 valve plus a small valve in the rod-end line that sends the rod-end oil either to the directional valve (normal) or into the cap-end line (regenerative). It can switch automatically: a pressure switch or a pilot-operated valve changes over when the load pressure reaches a set value. The result is a **fast approach at low force, then full force for the work** — the classic press cycle, and the reason small power packs can run surprisingly fast presses.
- **In mobile valves**, a regeneration check lets a boom or arm that is lowered by gravity refill its other end from its own return oil, so that the pump flow can go elsewhere.

Retraction is always normal: the pump feeds the annulus and the cap end returns to tank at $\\varphi$ times the pump flow.

> [!warn] Regeneration can make a cylinder several times faster than its designer planned for: check cushioning, guards and the stopping distance at the regenerative speed. Before working on the machine, lower or support the load, stop the pump, release the pressure — both ends of a regenerative cylinder can hold it — and lock out.
`,
  ideas: [
    'Regeneration routes the rod-end oil back into the cap end, so only the rod area does work.',
    'Speed Q/(A₁ − A₂) goes up and force p(A₁ − A₂) goes down; the power p·Q is the same.',
    'A 2:1 cylinder extends regeneratively at the same speed and force as it retracts normally.',
    'The cap-end line carries φ/(φ − 1) times the pump flow and must be sized for it.',
    'Automatic changeover from regeneration to normal gives a fast approach and full working force.'
  ],
  pitfalls: [
    'Regeneration creates extra flow, so it makes the pump more powerful — No power is gained: the speed rises exactly as the force falls, and p·Q is unchanged.',
    'A regenerative cylinder pushes with the full piston area — Both sides are at nearly the same pressure; the annulus pushes back, and only the rod area is left.',
    'Regeneration speeds up both strokes — Only extension. Retraction is normal, with the pump feeding the annulus.'
  ],
  formulas: [
    {
      name: 'Regenerative extension speed',
      expr: 'v = Qp/(A1 - A2)', tex: 'v = \\dfrac{Q_p}{A_1 - A_2}',
      vars: {
        v: { name: 'rod speed', q: 'speed', unit: 'm/s', tex: 'v' },
        Qp: { name: 'pump flow', q: 'flowrate', unit: 'L/min', value: 22, tex: 'Q_p' },
        A1: { name: 'piston area', q: 'area', unit: 'cm²', value: 31.2, tex: 'A_1' },
        A2: { name: 'annulus area', q: 'area', unit: 'cm²', value: 21.0, tex: 'A_2' }
      },
      note: 'A₁ − A₂ is the rod\'s cross-section. Losses in the regeneration path ignored.',
      practice: { unknowns: ['v', 'Qp'] },
      stories: { v: 'A cylinder with {A1} of piston area and {A2} of annulus extends regeneratively on {Qp}. How fast does the rod move?', Qp: 'A cylinder ({A1} piston, {A2} annulus) must extend regeneratively at {v}. What pump flow is needed?' }
    },
    {
      name: 'Regenerative force',
      expr: 'F = p*(A1 - A2)', tex: 'F = p\\,(A_1 - A_2)',
      vars: {
        F: { name: 'force available', q: 'force', unit: 'kN', tex: 'F' },
        p: { name: 'system pressure (gauge)', q: 'pressure', unit: 'bar', value: 160, tex: 'p' },
        A1: { name: 'piston area', q: 'area', unit: 'cm²', value: 31.2, tex: 'A_1' },
        A2: { name: 'annulus area', q: 'area', unit: 'cm²', value: 21.0, tex: 'A_2' }
      },
      note: 'Compare p·A₁ for normal extension. The pressure drop in the regeneration path lowers it further.',
      stories: { F: 'A cylinder with {A1} of piston area and {A2} of annulus extends regeneratively at {p}. What force can it push with?', p: 'A regenerative cylinder ({A1}, {A2}) must push {F}. What pressure does that need?' }
    },
    {
      name: 'Flow in the cap-end line during regeneration',
      expr: 'Q1 = Qp*A1/(A1 - A2)', tex: 'Q_1 = Q_p\\,\\dfrac{A_1}{A_1 - A_2}',
      vars: {
        Q1: { name: 'flow into the cap end', q: 'flowrate', unit: 'L/min', tex: 'Q_1' },
        Qp: { name: 'pump flow', q: 'flowrate', unit: 'L/min', value: 22, tex: 'Q_p' },
        A1: { name: 'piston area', q: 'area', unit: 'cm²', value: 31.2, tex: 'A_1' },
        A2: { name: 'annulus area', q: 'area', unit: 'cm²', value: 21.0, tex: 'A_2' }
      },
      note: 'Pump flow plus the rod-end oil. Size the cap-end port, hose and the regeneration path for this flow.',
      stories: { Q1: 'A cylinder with {A1} of piston area and {A2} of annulus extends regeneratively on a pump flow of {Qp}. What flow passes the cap-end port?' }
    },
    {
      name: 'Rod for equal speeds (a 2:1 cylinder)',
      expr: 'd = D/sqrt(2)', tex: 'd = \\dfrac{D}{\\sqrt{2}}',
      vars: {
        d: { name: 'rod diameter', q: 'length', unit: 'mm', tex: 'd' },
        D: { name: 'bore', q: 'length', unit: 'mm', value: 63, tex: 'D' }
      },
      note: 'Rod area = half the piston area = annulus area. Standard combinations close to it: 63/45, 80/56, 100/70, 125/90.',
      stories: { d: 'A cylinder of {D} bore is to extend regeneratively and retract normally at the same speed. What rod diameter does it need?' }
    }
  ],
  examples: [
    {
      title: 'Fast approach, full force',
      q: 'A press cylinder of 100 mm bore and 70 mm rod is fed with 40 L/min, relief at 200 bar. It approaches the work regeneratively and switches to normal extension for pressing. Compare the approach and pressing speeds and forces, and the return speed.',
      steps: [
        'Areas: $A_1 = 78.5$ cm², rod $A_r = 38.5$ cm², $A_2 = 40.1$ cm² ($\\varphi = 1.96$).',
        'Regenerative approach: $v = 6.67\\times10^{-4}/3.85\\times10^{-3} = 0.173$ m/s; force at most $2\\times10^7 \\times 3.85\\times10^{-3} = 77$ kN.',
        'Normal pressing: $v = 6.67\\times10^{-4}/7.85\\times10^{-3} = 0.085$ m/s; force up to $2\\times10^7 \\times 7.85\\times10^{-3} = 157$ kN.',
        'Return: $v = 6.67\\times10^{-4}/4.01\\times10^{-3} = 0.166$ m/s — nearly the approach speed, because the cylinder is close to 2:1.'
      ],
      a: 'Approach 0.17 m/s at up to 77 kN; pressing 0.085 m/s at up to 157 kN; return 0.17 m/s.'
    },
    {
      title: 'The hose that is too small',
      q: 'A 63/45 cylinder ($A_1 = 31.2$ cm², $A_2 = 15.3$ cm²) extends regeneratively on 22 L/min. What flow passes its cap-end port?',
      steps: [
        { text: 'Cap-end flow:', tex: 'Q_1 = 22 \\times \\frac{31.2}{31.2 - 15.3} = 43\\ \\mathrm{L/min}' },
        'Twice the pump flow: a port and hose sized for 22 L/min would run at twice their design velocity and four times their pressure drop.'
      ],
      a: 'About 43 L/min, twice the pump flow.'
    }
  ],
  quiz: [
    { q: 'In regenerative extension the rod moves as if the pump flow were acting on…', choices: ['the piston area', 'the annulus area', 'the rod\'s cross-section', 'the piston plus the annulus'], a: 2,
      why: 'Both sides are at the same pressure; the net area is A₁ − A₂, the rod\'s area. Speed Q/A_rod, force p·A_rod.' },
    { q: 'A cylinder of 80 mm bore and 56 mm rod extends regeneratively on 30 L/min. How fast does the rod move?', answer: 0.203, unit: 'm/s', tol: 0.02,
      why: 'Rod area π × 0.056²/4 = 24.6 cm²; v = 5×10⁻⁴/2.46×10⁻³ = 0.203 m/s.' },
    { q: 'For a 2:1 cylinder, regenerative extension and normal retraction have the same speed.', a: true,
      why: 'With A₁ = 2A₂ the rod area equals the annulus area, so Q/(A₁ − A₂) = Q/A₂.' },
    { q: 'Why is a press not simply run regeneratively for its whole stroke?', choices: ['the oil would overheat', 'regeneration gives only p × rod area, far less than the force the work needs', 'the rod would buckle', 'the pump would cavitate'], a: 1,
      why: 'Regeneration trades force for speed. It suits the approach; the pressing needs the full piston area.' },
    { q: 'During regenerative extension the flow through the cap-end port is…', choices: ['equal to the pump flow', 'less than the pump flow', 'larger than the pump flow, by A₁/(A₁ − A₂)', 'zero'], a: 2,
      why: 'The rod-end oil joins the pump flow on its way into the cap end.' }
  ],
  problems: [
    { q: 'A 100/70 cylinder extends regeneratively at 180 bar. What is the most force it can push with?', answer: 69.3, unit: 'kN', tol: 0.02,
      steps: ['Rod area: $\\pi \\times 0.07^2/4 = 3.85\\times10^{-3}$ m².', '$F = 1.8\\times10^7 \\times 3.85\\times10^{-3} = 69.3$ kN.'] }
  ],
  applications: [
    'Fast approach of hydraulic presses and injection-moulding clamps, changing to full force at the work.',
    'Log splitters with an automatic two-speed valve.',
    'Boom and arm regeneration on excavators, saving pump flow while lowering.',
    'Equal-speed motion with 2:1 cylinders in machine tools.'
  ],
  sim: ['fc-regen', 'ref-cylinder']
},

{
  id: 'sequencing-circuit', parent: 'basic-circuits', title: 'Sequencing circuits', level: 2,
  short: 'Machines do things in order: clamp, then drill; drill back, then unclamp. A sequence valve lets oil through to the second actuator only once the pressure shows that the first has done its work; limit switches or sensors do the same from positions — and are safer, because a pressure rise does not prove that a clamp has arrived.',
  keywords: ['sequencing', 'sequence circuit', 'sequence valve', 'clamp and drill', 'clamping', 'pressure-dependent', 'position-dependent', 'limit switch', 'pressure switch', 'check valve', 'order of operations', 'PLC'],
  prereq: ['sequence-valve', 'basic-circuit', 'check-valves'],
  related: ['reducing-valve', 'relief-valve', 'hydraulic-safety', 'electrohydraulic-control', 'industrial-presses', 'synchronizing', 'pneumatics:pressure-sequence', 'pneumatics:displacement-step-diagram'],
  body: `
A drilling fixture must clamp the part before the drill touches it, and must withdraw the drill before it lets go. Two cylinders, one pump, one directional valve — and an order that must never be broken. There are two ways to enforce it: by **pressure** or by **position**.

### Clamp, then drill: sequence valves
Both cylinders are connected to the same directional valve. On the extend side, the clamp cylinder is fed directly; the drill cylinder is fed through a **sequence valve** SV1 — a spring-loaded valve like a relief valve, but whose outlet goes to a working line and whose spring chamber is drained separately, so that the outlet pressure does not add to its setting.

1. The valve shifts. The clamp needs little pressure to move, say 15–20 bar, well below SV1's setting of 50 bar: all the flow goes to the clamp, and the drill waits.
2. The clamp meets the part and stops. The pressure rises; at 50 bar SV1 opens and the drill advances.
3. While the drill works, SV1 holds its inlet — and therefore the clamp — at 50 bar or more, so the clamping force never falls below $p_{seq}A_1$.
4. The drill reaches its depth; the pressure rises to the relief setting.

On the retract side the order is reversed by a second sequence valve, SV2, in the clamp's rod-end line: the drill retracts first (it needs little pressure), and only when it is fully back does the pressure rise to SV2's setting and the clamp let go. Each sequence valve has a **check valve** in parallel, so that the oil returning from its cylinder passes freely.

### Setting the valves
- A sequence setting must be clearly **above** the highest pressure the first actuator needs while moving (friction, back-pressure, cold oil) — a margin of 15–20 bar or more — and clearly **below** the relief setting.
- The clamping force at the moment the drill starts is $F_c = p_{seq}A_1$; choose $p_{seq}$ for the force the part needs.
- Oil to the second actuator is throttled from $p_{seq}$ down to what that actuator needs, $P = (p_{seq} - p_D)\\,Q$ of heat. A drill that needs 30 bar, fed through a 50 bar sequence valve at 10 L/min, wastes 0.33 kW.
- For delicate parts, a pressure-reducing valve in the clamp line limits the clamping force independently.

### The weakness of sequencing by pressure
A pressure rise shows that *something* is resisting the clamp — not that the clamp has reached the part. A clamp that jams on a burr halfway, a sticky seal in cold oil or a blocked return line raises the pressure just the same, and the drill starts on an unclamped part. Pressure sequencing is also sensitive to anything that changes the pressures: a heavier part, a change of oil, a leaking seal.

### Sequencing by position
The alternative is to let each movement **prove** it has finished: a limit switch, a proximity sensor or a cylinder with a position transducer signals the end of the clamp stroke, and a controller — relays or a PLC ([[electronics:relays]], [[pneumatics:displacement-step-diagram|displacement–step diagrams]]) — energises the drill's own valve. Where a mistake could hurt someone or wreck the machine, designers combine both: the clamp's end position *and* a pressure switch confirming the clamping force before the drill may start, as the risk assessment behind ISO 4413:2010 would require.

> [!warn] A clamping circuit holds stored energy even when stopped: pressure trapped in the clamp and the drill cylinders, and a sequence valve that keeps its inlet pressurised. Before changing parts, tools or settings: stop the pump, release the pressure in every branch (not only at the pump), support loads, and lock out the machine. Never reach into a fixture that is held only by hydraulic pressure.
`,
  ideas: [
    'A sequence valve passes oil to a second actuator only when its inlet pressure reaches its setting.',
    'Clamp then drill: the clamp moves at low pressure; when it stops on the part, the pressure rises and opens the drill\'s sequence valve.',
    'A second sequence valve reverses the order on the return; checks in parallel let the return oil pass freely.',
    'The clamping force while drilling is at least p_seq × A₁; the throttling in the sequence valve costs (p_seq − p_D)·Q.',
    'Pressure cannot tell a clamp from a jam; safety-critical sequences use positions, often with a pressure check as well.'
  ],
  pitfalls: [
    'A sequence valve is just a relief valve piped differently — Its outlet is a working line, so its spring chamber needs its own drain; otherwise the outlet pressure adds to the setting. And it passes oil onwards to do work instead of dumping it.',
    'Once the drill starts, the part is certainly clamped — Only that the pressure reached the setting. A jammed clamp or a blocked return raises the pressure too.',
    'Set the sequence valve just above the clamp\'s moving pressure — Cold oil, a heavier part or wear raise that pressure, and the drill starts early. Leave a real margin, and keep well below the relief setting.'
  ],
  formulas: [
    {
      name: 'Clamping force when the second actuator starts',
      expr: 'Fc = pseq*A1', tex: 'F_c = p_{seq}\\,A_1',
      vars: {
        Fc: { name: 'clamping force', q: 'force', unit: 'kN', tex: 'F_c' },
        pseq: { name: 'sequence-valve setting (gauge)', q: 'pressure', unit: 'bar', value: 50, tex: 'p_{seq}' },
        A1: { name: 'clamp piston area', q: 'area', unit: 'cm²', value: 12.57, tex: 'A_1' }
      },
      note: 'Back-pressure on the clamp\'s rod side and friction lower it slightly.',
      stories: { Fc: 'A clamp cylinder with a piston area of {A1} holds a part while the drill\'s sequence valve is set at {pseq}. What clamping force is guaranteed when drilling starts?', pseq: 'A part must be clamped with {Fc} by a cylinder of {A1} before drilling may start. What should the sequence valve be set to?' }
    },
    {
      name: 'Heat made in the sequence valve',
      expr: 'P = (pseq - pD)*Q', tex: 'P = (p_{seq} - p_D)\\,Q',
      vars: {
        P: { name: 'power turned into heat', q: 'power', unit: 'kW', tex: 'P' },
        pseq: { name: 'sequence-valve setting (gauge)', q: 'pressure', unit: 'bar', value: 50, tex: 'p_{seq}' },
        pD: { name: 'pressure the second actuator needs (gauge)', q: 'pressure', unit: 'bar', value: 30, tex: 'p_D' },
        Q: { name: 'flow to the second actuator', q: 'flowrate', unit: 'L/min', value: 10, tex: 'Q' }
      },
      note: 'Only while the second actuator needs less than the setting; above it, the valve is wide open.',
      stories: { P: 'A drill needs {pD} and is fed with {Q} through a sequence valve set at {pseq}. How much heat does the valve make?' }
    }
  ],
  examples: [
    {
      title: 'Setting a clamp-and-drill circuit',
      q: 'A clamp cylinder of 40 mm bore ($A_1 = 12.57$ cm²) needs 2 kN to move (friction and a return spring) and must clamp with at least 6 kN. The drill-feed cylinder, 63/36 mm, pushes against 12 kN of thrust. Choose the setting of the drill\'s sequence valve and check the pressures.',
      steps: [
        'Clamp moving: $2000/1.257\\times10^{-3} = 15.9$ bar (a few bar more with back-pressure).',
        'Required clamping force: $p_{seq} \\ge 6000/1.257\\times10^{-3} = 47.7$ bar. Set 50 bar: well above 16 bar, and it gives $F_c = 5\\times10^6 \\times 1.257\\times10^{-3} = 6.3$ kN.',
        'Drill feed: $12\\,000/3.12\\times10^{-3} = 38.5$ bar, below the setting, so the system stays at 50 bar while drilling and the clamp keeps 6.3 kN.',
        'Relief: well above 50 bar — for example 100 bar — so the sequence valve can always open.'
      ],
      a: 'Sequence valve at 50 bar (clamping force 6.3 kN); relief at about 100 bar.'
    }
  ],
  quiz: [
    { q: 'What opens a sequence valve?', choices: ['an electrical signal', 'its inlet pressure reaching its setting', 'the flow through it', 'the outlet pressure falling'], a: 1,
      why: 'Like a relief valve, it is held shut by a spring against its inlet pressure; unlike a relief valve, its outlet feeds a working line.' },
    { q: 'A sequence valve\'s spring chamber must be drained to tank separately.', a: true,
      why: 'Its outlet is pressurised by the second actuator. Without a separate drain that pressure would add to the spring and raise the setting.' },
    { q: 'Why is a check valve fitted in parallel with each sequence valve?', choices: ['to limit the pressure', 'to let the oil returning from that cylinder pass freely, bypassing the sequence valve', 'to prevent cavitation', 'to damp the sequence valve'], a: 1,
      why: 'The sequence valve passes flow in one direction only; the return flow needs its own free path.' },
    { q: 'A clamp of 50 mm bore; the drill\'s sequence valve opens at 40 bar. What clamping force is there when the drill starts?', answer: 7.85, unit: 'kN', tol: 0.02,
      why: 'A = π × 0.05²/4 = 1.963×10⁻³ m²; F = 4×10⁶ × 1.963×10⁻³ = 7.85 kN.' },
    { q: 'The clamp jams halfway on a burr. In a circuit sequenced purely by pressure, what happens?', choices: ['nothing moves until the burr is cleared', 'the pressure rises, the sequence valve opens and the drill starts on an unclamped part', 'the relief valve opens and the drill waits', 'the clamp pushes the burr aside'], a: 1,
      why: 'The sequence valve sees only pressure; it cannot tell a jam from a clamped part. That is why safety-critical sequences check positions.' }
  ],
  problems: [
    { q: 'A drill needs 25 bar and is fed at 12 L/min through a sequence valve set at 60 bar. How much heat does the valve make while drilling?', answer: 0.7, unit: 'kW', tol: 0.02,
      steps: ['$P = (p_{seq} - p_D)Q = 35 \\times 12/600 = 0.70$ kW.'] }
  ],
  applications: [
    'Clamping fixtures on drilling, tapping and milling machines.',
    'Injection-moulding machines: close the mould, then build clamping force, then inject.',
    'Press brakes and bending machines: hold the sheet, then bend.',
    'Mobile machines where one movement must finish before another starts (outriggers before the boom).'
  ],
  sim: 'fc-sequence'
},

{
  id: 'synchronizing', parent: 'basic-circuits', title: 'Synchronising cylinders', level: 2,
  short: 'Two cylinders fed from one valve do not move together: the oil goes where it meets least resistance. Keeping them in step takes a mechanical tie, flow dividers, cylinders in series, or position sensors and a closed loop — each with its own accuracy and its own traps.',
  keywords: ['synchronising', 'synchronizing', 'synchronisation', 'two cylinders', 'flow divider', 'gear flow divider', 'spool flow divider', 'series cylinders', 'master–slave', 'mechanical coupling', 'torsion shaft', 'drift', 'resynchronisation', 'press brake', 'platform'],
  prereq: ['basic-circuit', 'flow-control', 'area-ratio'],
  related: ['cylinder-types', 'servo-loop', 'proportional-valves', 'seals', 'hydraulic-motors', 'lifts-cranes', 'industrial-presses', 'pressure-compensation'],
  body: `
A platform lifted by a cylinder at each end, a bending beam pushed at both ends, a gate moved by two rams: the cylinders must move **together**. Tee them into one valve and they will not. Oil takes the path of least resistance, so the cylinder with the lighter load moves first and the other waits until the first has reached its end; even with equal loads, small differences in seal friction and hose length make one lead. Every method of synchronising fights that tendency differently.

### Tie them together mechanically
The most reliable method is not hydraulic: a rigid beam, guide columns, or a **rack-and-pinion with a torsion shaft** that forces both ends to move the same distance. The hydraulics then only supply force; the structure keeps them level — but it must be strong enough to carry the whole load difference.

### Divide the flow
- **Flow controls** in each line (preferably pressure-compensated) give roughly equal flows; errors of several per cent remain, and each stroke adds its own.
- A **spool-type flow divider** splits one flow into two equal parts with a pair of compensated orifices, typically within 2–5 % — better at its rated flow than at low flow.
- A **gear-type (rotary) flow divider** is two or more gear motors on one shaft: each section passes the same volume per revolution, typically within 1–3 %, and it works in both directions, recombining the return flows.

A rotary divider has a trap: if one section's outlet is blocked (its cylinder at the end of stroke), the other sections keep turning the shaft and act as an **intensifier** — the pressure in the blocked section can exceed the pump pressure by the ratio of the sections. Each outlet needs its own relief valve.

### Cylinders in series
Feed the first cylinder's cap end; send the oil from its rod end into the second cylinder's cap end. If the first cylinder's annulus equals the second's piston area, $\\pi(D_1^2 - d_1^2)/4 = \\pi D_2^2/4$, both move together without any divider. The first cylinder then carries the pressure for **both** loads: $p_1 = (F_1 + F_2)/A_1$. Internal leakage across the pistons makes the pair drift apart over many strokes, so series circuits **resynchronise** at the end of each stroke — small valves that open when the leading cylinder bottoms and let oil in or out of the trapped chamber.

Standard cylinders rarely match exactly: the annulus of a 100/56 cylinder is 53.9 cm², the piston of an 80 mm cylinder 50.3 cm², so the second moves 7 % further than the first on every stroke — hence special bores, or resynchronisation.

### Measure and correct
For accuracy the answer is **closed-loop control**: a position sensor on each cylinder and a proportional or servo valve for each, with a controller that makes one follow the other ([[servo-loop]]). Press brakes keep their two rams parallel to a few hundredths of a millimetre this way, whatever the position of the sheet along the beam.

| Method | Typical accuracy | Notes |
|---|---|---|
| Rigid mechanical coupling | set by the structure | simplest and surest; structure takes the unbalance |
| Flow controls in each line | several per cent | errors add up stroke by stroke |
| Spool flow divider | 2–5 % | one direction; best near rated flow |
| Gear (rotary) flow divider | 1–3 % | both directions; can intensify pressure |
| Series cylinders | leakage-limited | needs matched areas and resynchronisation |
| Closed-loop position control | 0.01–1 mm | sensors, proportional or servo valves, a controller |

> [!warn] A platform whose cylinders fall out of step tilts, and its load can slide or topple; a rotary divider can intensify pressure far above the relief setting. Protect each divider outlet with its own relief valve. Before any work beneath a raised platform, lower it or prop it mechanically, stop the pump, release the pressure and lock out — never rely on the hydraulics alone.
`,
  ideas: [
    'Oil takes the path of least resistance: teed cylinders move one after the other, lightest load first.',
    'A mechanical tie is the most reliable synchroniser; the structure must carry the load difference.',
    'Flow dividers split flow to a few per cent; rotary dividers can intensify pressure if one outlet is blocked.',
    'Series cylinders with matched areas move together, but the first carries the pressure for both loads and leakage makes them drift.',
    'Closed-loop position control with proportional or servo valves gives the best accuracy.'
  ],
  pitfalls: [
    'Two identical cylinders fed from one tee move together — Only if their loads and friction are identical, which they never are. The one needing less pressure moves first.',
    'A flow divider keeps two cylinders in step for ever — Its error adds up stroke after stroke, and leakage adds more; cylinders must be resynchronised at the ends of stroke.',
    'In a series circuit each cylinder needs only its own load\'s pressure — The first cylinder\'s oil must push both: p₁ = (F₁ + F₂)/A₁ when the areas are matched.'
  ],
  formulas: [
    {
      name: 'Matching bore for series cylinders',
      expr: 'D2 = sqrt(D1^2 - d1^2)', tex: 'D_2 = \\sqrt{D_1^2 - d_1^2}',
      vars: {
        D2: { name: 'bore of the second cylinder', q: 'length', unit: 'mm', tex: 'D_2' },
        D1: { name: 'bore of the first cylinder', q: 'length', unit: 'mm', value: 100, tex: 'D_1' },
        d1: { name: 'rod of the first cylinder', q: 'length', unit: 'mm', value: 50, tex: 'd_1' }
      },
      note: 'The first cylinder\'s annulus equals the second\'s piston area, so equal volumes give equal strokes.',
      stories: { D2: 'Two cylinders are to be run in series. The first has a bore of {D1} and a rod of {d1}. What bore must the second have?', d1: 'The first of two series cylinders has a bore of {D1}; the second has a bore of {D2}. What rod must the first have for them to move together?' }
    },
    {
      name: 'Supply pressure for series cylinders',
      expr: 'p1 = (F1 + F2)/A1', tex: 'p_1 = \\dfrac{F_1 + F_2}{A_1}',
      vars: {
        p1: { name: 'pressure at the first cylinder\'s cap end (gauge)', q: 'pressure', unit: 'bar', tex: 'p_1' },
        F1: { name: 'load on the first cylinder', q: 'force', unit: 'kN', value: 20, tex: 'F_1' },
        F2: { name: 'load on the second cylinder', q: 'force', unit: 'kN', value: 20, tex: 'F_2' },
        A1: { name: 'piston area of the first cylinder', q: 'area', unit: 'cm²', value: 78.5, tex: 'A_1' }
      },
      note: 'With matched areas (first annulus = second piston) and the second\'s rod end at tank pressure. Friction ignored.',
      practice: { unknowns: ['p1', 'F2'] },
      stories: { p1: 'Two series cylinders lift {F1} and {F2}; the first has a piston area of {A1}. What pressure does the pump have to supply?' }
    },
    {
      name: 'Position error from a flow divider',
      expr: 'dx = eps*s', tex: '\\Delta x = \\varepsilon\\,s',
      vars: {
        dx: { name: 'difference in position at the end of the stroke', q: 'length', unit: 'mm', tex: '\\Delta x' },
        eps: { name: 'divider accuracy', q: 'ratio', unit: '%', value: 3, tex: '\\varepsilon' },
        s: { name: 'stroke', q: 'length', unit: 'mm', value: 500, tex: 's' }
      },
      note: 'Per stroke; without resynchronisation it adds up over successive strokes.',
      stories: { dx: 'Two cylinders with a stroke of {s} are fed by a flow divider accurate to {eps}. How far apart can they be at the end of a stroke?' }
    }
  ],
  examples: [
    {
      title: 'Two cylinders on a tee',
      q: 'A platform rests on two 63 mm cylinders ($A_1 = 31.2$ cm²). The load puts 30 kN on one and 20 kN on the other. Both are fed through a tee from 22 L/min. What happens?',
      steps: [
        'Pressures needed: $30\\,000/3.12\\times10^{-3} = 96$ bar and $20\\,000/3.12\\times10^{-3} = 64$ bar.',
        'At 64 bar the lightly loaded cylinder moves; the other needs 96 bar, which cannot build while oil escapes into the first. All 22 L/min go into the lighter cylinder, which rises at 0.12 m/s while the other stays put.',
        'Only when the first reaches its end does the pressure rise to 96 bar and the second follow. The platform tilts through the whole stroke.'
      ],
      a: 'The lighter cylinder goes first, all the way; then the heavier one follows.'
    },
    {
      title: 'Series cylinders from the catalogue',
      q: 'A designer wants to run a 100/56 cylinder in series with an 80 mm cylinder. How well do they match?',
      steps: [
        'First annulus: $\\pi(0.1^2 - 0.056^2)/4 = 53.9$ cm². Second piston: $\\pi \\times 0.08^2/4 = 50.3$ cm².',
        'The oil that moves the first cylinder a distance $s$ leaves its annulus as a volume $53.9\\,s$ (cm² × length) and moves the second by $53.9\\,s/50.3 = 1.072\\,s$.',
        'Over a 500 mm stroke the second cylinder would lead by 36 mm and reach its end first. A matched pair needs $D_2 = \\sqrt{100^2 - 56^2} = 82.8$ mm — a special bore — or end-of-stroke resynchronisation.'
      ],
      a: 'The second cylinder runs 7 % fast; the areas must be matched or the pair resynchronised.'
    }
  ],
  quiz: [
    { q: 'Two identical cylinders are teed into one valve, one lightly and one heavily loaded. On extension…', choices: ['both move at half speed', 'the lightly loaded one moves first; the other waits until it stops', 'the heavily loaded one moves first', 'neither moves'], a: 1,
      why: 'Pressure rises only as far as the easiest path needs; the lighter cylinder takes all the flow at its lower pressure.' },
    { q: 'In two matched cylinders in series, the pressure at the first cylinder\'s cap end corresponds to…', choices: ['its own load only', 'the sum of both loads', 'the difference of the loads', 'half the sum'], a: 1,
      why: 'Its rod-end oil drives the second cylinder, so its piston must push both loads: p₁ = (F₁ + F₂)/A₁.' },
    { q: 'A gear-type flow divider can raise the pressure in one outlet above the pump pressure if the other outlet is blocked.', a: true,
      why: 'The sections share one shaft: a blocked section is driven by the others as a pump, intensifying pressure. Each outlet needs a relief valve.' },
    { q: 'A flow divider accurate to 2 % feeds two cylinders with an 800 mm stroke. How far apart can they be at the end of one stroke?', answer: 16, unit: 'mm', tol: 0.02,
      why: 'Δx = 0.02 × 800 = 16 mm — and more after several strokes unless they are resynchronised.' },
    { q: 'Which method keeps the two rams of a CNC press brake parallel to a few hundredths of a millimetre?', choices: ['a tee and two flow controls', 'a spool flow divider', 'closed-loop position control with a sensor and a proportional or servo valve on each ram', 'series cylinders'], a: 2,
      why: 'Only measuring each position and correcting continuously reaches that accuracy, whatever the load distribution.' }
  ],
  problems: [
    { q: 'Two series cylinders are matched; the first has a bore of 100 mm. They lift 25 kN and 15 kN. What supply pressure is needed (ignore friction)?', answer: 50.9, unit: 'bar', tol: 0.02,
      steps: ['$A_1 = \\pi \\times 0.1^2/4 = 7.854\\times10^{-3}$ m².', '$p_1 = (25\\,000 + 15\\,000)/7.854\\times10^{-3} = 5.09\\times10^6$ Pa = 50.9 bar.'] }
  ],
  applications: [
    'Lifting platforms, vehicle lifts and stage lifts with a cylinder at each corner.',
    'CNC press brakes with two synchronised rams.',
    'Dam and lock gates moved by a ram at each side.',
    'Mobile machines with twin boom or lift cylinders, usually tied by the structure.'
  ],
  sim: 'fc-sync'
},

{
  id: 'load-holding', parent: 'basic-circuits', title: 'Load holding and counterbalance circuits', level: 2,
  short: 'A raised load must stay up when the valve is centred, the engine stops or a hose bursts. Spool valves leak, so the load creeps; a pilot-operated check valve holds it leak-free; a counterbalance valve both holds it and lets it down under control.',
  keywords: ['load holding', 'counterbalance', 'overcentre valve', 'over-center valve', 'pilot-operated check', 'POCV', 'drift', 'creep', 'leakage', 'pilot ratio', 'overrunning load', 'lowering', 'hose burst', 'pipe rupture valve', 'thermal expansion', 'chatter'],
  prereq: ['pilot-check', 'counterbalance-valve', 'basic-circuit', 'meter-in-out'],
  related: ['centre-conditions', 'seals', 'bulk-modulus', 'mobile-hydraulics', 'lifts-cranes', 'hydraulic-safety', 'hoses-fittings', 'braking-circuits'],
  body: `
Lift a load with a cylinder and centre the valve: the load should stay exactly where it is, for a minute or for a night. The oil trapped under the piston is almost incompressible, so in principle it will. In practice three things let it down: leakage, overrunning while lowering, and failures.

### Why a spool valve is not enough
A spool slides in its bore with a clearance of a few micrometres, and oil leaks through that clearance whenever there is a pressure difference — from a few to a few hundred cm³/min depending on size and pressure. The load **creeps** down at $v = Q_{leak}/A$: 30 cm³/min out of a 63 mm cylinder is about 10 mm per minute, 60 cm in an hour. Piston seals leak too, but a sound seal leaks far less than a spool.

### The pilot-operated check valve
A poppet on a seat is leak-free. A **pilot-operated check valve** (POCV), screwed directly into the cylinder port, lets oil in freely and holds it in tightly — until pilot pressure from the other line lifts it off its seat through a pilot piston. With a **pilot ratio** $R$ (pilot-piston area to seat area, typically 3:1 to 10:1), it opens at

$$p_X \\approx \\frac{p_L}{R}$$

so a load holding 120 bar needs 30 bar of pilot pressure at 4:1. Two conditions make it work: the directional valve's centre must connect both actuator lines to tank (a float or "Y" centre), so that the pilot is vented and the check closes the instant the valve centres; and nothing must trap pressure in the pilot line.

A POCV holds perfectly but **lowers badly**. When the pilot opens it under an overrunning load, the load runs ahead of the pump; the supply side, which gives the pilot pressure, collapses; the check slams shut; the pressure builds again; it opens again. The load comes down in jerks — chatter — unless a meter-out restrictor is added.

### The counterbalance valve
A **counterbalance** (overcentre) valve is a pressure valve in the outlet line of the load-holding side, with a check for free flow into the cylinder. Its spring is set at about **1.3 times the highest load-induced pressure**, so the load alone can never open it; pilot pressure from the other line helps it open with a pilot ratio $R$ (again about 3:1 to 10:1):

$$p_L + R\\,p_X \\ge p_{set} \\quad\\Rightarrow\\quad p_X = \\frac{p_{set} - p_L}{R}$$

While lowering, it **modulates**: if the load speeds up, the supply pressure — and so the pilot — drops, and the valve throttles; if the load slows, it opens. It is a hydraulic brake that meters the load down smoothly, holds it (nearly leak-free, poppet types fully so) when the valve centres, and, because it is a pressure valve, relieves shocks and the pressure rise of trapped oil. A **low pilot ratio** (3:1) gives stable lowering of unsteady loads — cranes, booms — at the price of more pilot pressure and heat; a **high ratio** (8–10:1) wastes less power but is more prone to oscillation.

| | Spool valve alone | Pilot-operated check | Counterbalance valve |
|---|---|---|---|
| Holds without drift | no | yes (poppet) | yes, nearly or fully |
| Lowers an overrunning load smoothly | no | no — chatters without a restrictor | yes |
| Protects against trapped-oil pressure | no | no | yes (relief function) |
| Pilot needed to lower | — | $p_L/R$ | $(p_{set} - p_L)/R$ |
| Centre of the directional valve | any | A and B to tank | A and B to tank |

### Mount it on the cylinder
A load-holding valve only protects what is between it and the piston. Fitted **directly on the cylinder port** — screwed in, flanged or built into the cylinder — it holds the load even if a hose between it and the directional valve bursts. Lifting equipment is built this way, often with dedicated hose-burst (pipe-rupture) valves as well.

### Trapped oil and heat
Oil locked in a cylinder by leak-free valves warms in the sun or from a hot machine. It expands; the steel barely does; the pressure rises by $\\Delta p \\approx K\\alpha_V\\Delta T$ — up to about 10 bar per kelvin in a stiff steel volume. A counterbalance valve relieves it; a circuit held by pilot checks needs a small thermal relief valve.

> [!warn] Never work under a load held only by hydraulics: lower it, or support it with props or blocks designed for it. A counterbalance or pilot check keeps pressure in the cylinder after the pump stops — follow the machine's procedure to release it, and lock out before loosening any fitting between the valve and the cylinder. A burst hose on the wrong side of the valve drops the load; a jet from a loosened fitting can inject oil through the skin — seek emergency medical care at once.
`,
  ideas: [
    'Spool valves leak through their clearance, so a load held by one creeps down at Q_leak/A.',
    'A pilot-operated check holds leak-free and opens at about p_L/R, but lowers an overrunning load in jerks.',
    'A counterbalance valve, set about 1.3 × the load pressure, opens at (p_set − p_L)/R and meters the load down smoothly.',
    'Load-holding valves belong on the cylinder port, so a burst hose cannot drop the load.',
    'Trapped oil heated by the sun can gain up to about 10 bar per kelvin; counterbalance valves relieve it.'
  ],
  pitfalls: [
    'A closed-centre valve holds a load still — It holds it only as well as its spool clearance seals: the load creeps down at the leakage rate.',
    'A pilot-operated check valve is enough to lower a load safely — It opens and shuts as the supply pressure collapses and rebuilds, so an overrunning load comes down in jerks. Controlled lowering needs a counterbalance valve or a meter-out restrictor.',
    'A load-holding valve works wherever it is in the line — Only the part between it and the piston is protected. A hose burst between the cylinder and a valve mounted at the control block drops the load.'
  ],
  formulas: [
    {
      name: 'Drift from leakage',
      expr: 'v = QL/A', tex: 'v = \\dfrac{Q_L}{A}',
      vars: {
        v: { name: 'creep speed of the load', q: 'speed', unit: 'mm/s', tex: 'v' },
        QL: { name: 'leakage flow out of the loaded chamber', q: 'flowrate', unit: 'cm³/min', value: 30, tex: 'Q_L' },
        A: { name: 'area the load pressure acts on', q: 'area', unit: 'cm²', value: 31.2, tex: 'A' }
      },
      note: 'Leakage grows roughly in proportion to pressure and falls with viscosity, so a hot machine creeps faster.',
      stories: { v: 'A load is held on a piston area of {A} by a spool valve that leaks {QL}. How fast does it creep down?', QL: 'A load on {A} creeps down at {v}. How much oil is leaking away?' }
    },
    {
      name: 'Pilot pressure to open a pilot-operated check',
      expr: 'pX = pL/R', tex: 'p_X = \\dfrac{p_L}{R}',
      vars: {
        pX: { name: 'pilot pressure needed (gauge)', q: 'pressure', unit: 'bar', tex: 'p_X' },
        pL: { name: 'load-holding pressure behind the check (gauge)', q: 'pressure', unit: 'bar', value: 120, tex: 'p_L' },
        R: { name: 'pilot ratio (pilot-piston area ÷ seat area)', value: 4, min: 1, max: 20, tex: 'R' }
      },
      note: 'Spring force and back-pressure on the outlet side add a little; decompression versions open a small poppet first.',
      stories: { pX: 'A pilot-operated check with a pilot ratio of {R} holds a load at {pL}. What pilot pressure opens it?', R: 'A check holding {pL} must open with {pX} of pilot pressure. What pilot ratio does it need?' }
    },
    {
      name: 'Pilot pressure to open a counterbalance valve',
      expr: 'pX = (pset - pL)/R', tex: 'p_X = \\dfrac{p_{set} - p_L}{R}',
      vars: {
        pX: { name: 'pilot pressure needed (gauge)', q: 'pressure', unit: 'bar', tex: 'p_X' },
        pset: { name: 'counterbalance setting (gauge)', q: 'pressure', unit: 'bar', value: 160, tex: 'p_{set}' },
        pL: { name: 'load-induced pressure (gauge)', q: 'pressure', unit: 'bar', value: 120, tex: 'p_L' },
        R: { name: 'pilot ratio', value: 4, min: 1, max: 20, tex: 'R' }
      },
      note: 'Setting about 1.3 × the highest load pressure. The lighter the load, the more pilot pressure is needed to lower it.',
      practice: { unknowns: ['pX', 'pset'] },
      stories: {
        pX: 'A counterbalance valve set at {pset} with a pilot ratio of {R} holds a load that produces {pL}. What pilot pressure is needed to lower it?',
        pset: 'A load produces {pL}; it should lower with {pX} of pilot pressure through a counterbalance valve with a pilot ratio of {R}. What setting does that imply?'
      }
    },
    {
      name: 'Pressure rise of trapped, heated oil',
      expr: 'dp = K*alpha*dT', tex: '\\Delta p = K\\,\\alpha_V\\,\\Delta T',
      vars: {
        dp: { name: 'pressure rise', q: 'pressure', unit: 'bar', tex: '\\Delta p' },
        K: { name: 'bulk modulus of the oil', q: 'pressure', unit: 'GPa', value: 1.5, tex: 'K' },
        alpha: { name: 'volumetric expansion coefficient of the oil', q: 'expansion', unit: '1/K', value: 0.0007, tex: '\\alpha_V' },
        dT: { name: 'temperature rise', q: 'dtemp', unit: 'K', value: 10, tex: '\\Delta T' }
      },
      note: 'An upper limit for a rigid container: hoses, the cylinder\'s own expansion and trapped air lower it. Mineral oil: K ≈ 1.4–1.8 GPa, α_V ≈ 7×10⁻⁴ per kelvin.',
      stories: { dp: 'Oil (bulk modulus {K}, expansion coefficient {alpha}) is trapped in a stiff cylinder and warms by {dT}. How much can its pressure rise?' }
    }
  ],
  examples: [
    {
      title: 'Setting a counterbalance valve',
      q: 'A vertical 80 mm cylinder ($A_1 = 50.3$ cm²) holds up to 40 kN on its cap end. Choose the counterbalance setting and find the pilot pressure needed to lower the full load and the empty cylinder (whose rod and tool alone give 5 bar), with a pilot ratio of 4:1.',
      steps: [
        'Load pressure: $40\\,000/5.03\\times10^{-3} = 79.6$ bar.',
        'Setting: $1.3 \\times 79.6 = 103.5$ bar — set 105 bar.',
        'Lowering the full load: $p_X = (105 - 79.6)/4 = 6.4$ bar.',
        'Lowering the empty cylinder: $p_X = (105 - 5)/4 = 25$ bar — the lighter the load, the harder the pump must push it down.'
      ],
      a: 'Setting 105 bar; about 6 bar of pilot pressure with the full load, 25 bar empty.'
    },
    {
      title: 'How fast does it creep?',
      q: 'A 63 mm cylinder ($A = 31.2$ cm²) holds a load through a closed-centre spool valve that leaks 30 cm³/min at the holding pressure. How far does the load sink in an hour?',
      steps: [
        'Creep speed: $v = Q_L/A = 30/31.2 = 0.96$ cm/min (0.16 mm/s).',
        'In an hour: $0.96 \\times 60 = 58$ cm.',
        'A pilot-operated check or a counterbalance valve on the cylinder port stops it.'
      ],
      a: 'About 58 cm in an hour.'
    }
  ],
  quiz: [
    { q: 'Why does a load held by a closed-centre spool valve slowly sink?', choices: ['the oil compresses more and more', 'oil leaks through the spool\'s running clearance', 'the relief valve opens', 'the pump runs backwards'], a: 1,
      why: 'A spool needs a clearance of a few micrometres to slide; under pressure oil leaks through it and the load creeps down at Q_leak/A.' },
    { q: 'A pilot-operated check valve on a cylinder is used with a directional valve whose centre should…', choices: ['block all ports', 'connect A and B to tank', 'connect P to A', 'connect P to T only'], a: 1,
      why: 'In the centre the pilot line must be vented so the check closes at once; with A and B blocked, trapped pilot pressure can hold it open.' },
    { q: 'A counterbalance valve is set at 200 bar with a pilot ratio of 5:1. The load produces 150 bar. What pilot pressure lowers it?', answer: 10, unit: 'bar', tol: 0.02,
      why: 'p_X = (200 − 150)/5 = 10 bar.' },
    { q: 'A counterbalance valve belongs directly on the cylinder port rather than at the valve end of a hose.', a: true,
      why: 'It protects only what lies between it and the piston; on the cylinder, a burst hose cannot drop the load.' },
    { q: 'Why does lowering an overrunning load through a pilot-operated check alone tend to be jerky?', choices: ['the check is too small', 'the load runs ahead, the supply (pilot) pressure collapses, the check slams shut, pressure builds and it opens again', 'the relief valve chatters', 'the oil is too thick'], a: 1,
      why: 'Its opening depends on a pilot pressure that the running-away load destroys. A counterbalance valve modulates instead of snapping.' }
  ],
  problems: [
    { q: 'A pilot-operated check with a 6:1 pilot ratio holds a boom at 210 bar. What pilot pressure opens it?', answer: 35, unit: 'bar', tol: 0.02,
      steps: ['$p_X = p_L/R = 210/6 = 35$ bar.'] },
    { q: 'Oil trapped in a stiff cylinder (K = 1.6 GPa, α = 7×10⁻⁴ /K) warms by 5 K in the sun. By how much could its pressure rise?', answer: 56, unit: 'bar', tol: 0.02,
      steps: ['$\\Delta p = K\\alpha_V\\Delta T = 1.6\\times10^9 \\times 7\\times10^{-4} \\times 5 = 5.6\\times10^6$ Pa = 56 bar.', 'Hose and cylinder expansion lower this in practice, but a thermal relief is still needed.'] }
  ],
  applications: [
    'Crane and excavator booms, with counterbalance valves on every lifting cylinder.',
    'Aerial work platforms and tail lifts, with hose-burst protection.',
    'Hydraulic motors driving winches, braked by counterbalance valves (see [[braking-circuits]]).',
    'Press rams held up by pilot checks during tool changes (with mechanical safety blocks as well).'
  ],
  sim: { id: 'fc-metering', params: { load: 'over' } }
}

);
