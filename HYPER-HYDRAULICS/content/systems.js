/* HYPER-HYDRAULICS · content/systems.js
 * Hydraulic Circuits › System circuits: accumulator circuits, hi-lo and unloading, load sensing,
 *   open and closed centre, motor braking.
 * Design, Conditioning and Maintenance › Components and sizing: reservoirs, accumulators, sizing an
 *   accumulator, hoses, tubes and fittings, line sizing, heat balance and coolers.
 * Simulations in sims/systems.js (prefix sys-).
 */
Hyper.add(

/* ================================================================ SYSTEM CIRCUITS */

{
  id: 'accumulator-circuits', parent: 'system-circuits', title: 'Accumulator circuits', level: 2,
  short: 'Circuits that put an accumulator to work: a small pump charges it between strokes and the accumulator supplies the fast stroke; it also gives emergency power, holds pressure against leakage and absorbs shocks — always with a way to discharge it safely.',
  keywords: ['accumulator circuit', 'energy storage', 'charging valve', 'unloading valve', 'cut-in', 'cut-out', 'emergency power', 'leakage compensation', 'shock absorption', 'pulsation damping', 'safety block', 'dump valve', 'bleed valve', 'thermal expansion'],
  prereq: ['accumulators', 'basic-circuit', 'check-valves', 'relief-valve'],
  related: ['accumulator-sizing', 'hi-lo-circuit', 'pilot-relief', 'surge-protection', 'hydraulic-safety', 'open-closed-centre', 'pneumatics:receivers'],
  body: `
An accumulator on its own is only a pressure vessel; the circuit around it decides what it does. Five jobs cover nearly every application, and one safety rule covers them all.

### 1. Supplementing the pump
Many machines need a large flow for a short time and then wait: an injection-moulding machine injecting, a press closing, a clamp snapping shut, a gate opening. A pump sized for the peak would spend most of its life unloaded or blowing over its relief valve. With an accumulator the pump need only supply the **average** flow of the cycle, $Q_p = V_c/T$, and the accumulator makes up the difference during the stroke:
$$\\Delta V = (Q_d - Q_p)\\,t$$
The classic arrangement: the pump charges the accumulator through a **check valve**; an **accumulator charging (unloading) valve**, piloted from the accumulator side, sends the pump's flow to tank at a few bar when the pressure reaches its **cut-out** setting, and loads the pump again when the pressure has fallen to the **cut-in** pressure, typically 10–20 % lower. The check valve stops the accumulator emptying back through the unloaded pump. A pump of a third or a quarter of the peak flow is common, with an electric motor to match.

### 2. Emergency power
If the pump or the electricity fails, a charged accumulator can still close a safety gate, pull a tool out of a die, apply brakes or feather a turbine blade. Aircraft, mobile brakes and many shut-down valves rely on it. A check valve isolates the emergency accumulator so that a burst line elsewhere cannot drain it.

### 3. Holding pressure and making up leakage
A clamp or press that must hold its force for minutes would otherwise need the pump running against the relief valve, turning all its power into heat. A small accumulator after a check valve holds the pressure while the pump unloads; it makes up the leakage of seals and valves, and the pump cuts back in only when the pressure has sagged to the cut-in point.

### 4. Shocks and pulsation
Near a fast-closing valve or at the outlet of a piston pump, a small accumulator with a lower pre-charge takes up pressure peaks and ripple — the fluid-power cousin of the air vessels on water mains (see [[surge-protection]]).

### 5. Thermal expansion
Oil trapped between closed valves expands about 0.07 % per kelvin; in a rigid enclosure its pressure would rise by roughly 10 bar per kelvin. A small accumulator gives it room to grow.

### The safety block
At the accumulator every circuit needs a **shut-off valve** to isolate it, a **relief valve** of its own (the accumulator is a pressure vessel, whatever the rest of the circuit does), a **pressure gauge**, and a **dump (bleed) valve** that drains it to tank. ISO 4413:2010 expects an accumulator to discharge automatically, or to be safely isolated, when the machine is switched off — typically with a normally open solenoid valve that closes only while the machine runs, and a throttle so that the dump is gentle. Size it with the [accumulator calculator](#/tools/fpower/accumulator) and see [[accumulator-sizing]].

> [!warn] A machine with an accumulator is not safe just because its motor is off. Discharge the accumulator to tank, confirm zero on its own gauge, support any raised load and lock out the machine before opening a single fitting. A jet of oil can be injected through the skin: such an injury looks trivial but is a surgical emergency — seek emergency medical care at once.
`,
  ideas: [
    'With an accumulator the pump is sized for the average flow of the cycle, not the peak.',
    'A check valve and an unloading (charging) valve let the pump rest between cut-out and cut-in pressures.',
    'Accumulators also give emergency power, hold pressure against leakage, absorb shocks and take up thermal expansion.',
    'Every accumulator needs a safety block: isolating valve, its own relief valve, gauge and a dump valve.',
    'A stopped machine with an accumulator still stores energy until the accumulator has been discharged.'
  ],
  pitfalls: [
    'The accumulator lets a small pump deliver more power on average — It delivers more power only during the stroke; the energy comes from the pump over the whole cycle. The average demand must still be below what the pump supplies.',
    'Switching off the motor makes the circuit pressure-free — The check valve keeps the accumulator charged. Only the dump valve (and its gauge reading zero) makes it safe.',
    'Any pre-charge will do for shock absorption — A shock accumulator needs a pre-charge matched to the working pressure; with too high a pre-charge it holds no oil at the working pressure and does nothing.'
  ],
  formulas: [
    {
      name: 'Oil the accumulator must supply during a stroke',
      expr: 'dV = (Qd - Qp)*t', tex: '\\Delta V = (Q_d - Q_p)\\,t',
      vars: {
        dV: { name: 'oil volume taken from the accumulator', q: 'volume', unit: 'L', tex: '\\Delta V' },
        Qd: { name: 'flow the actuator needs', q: 'flowrate', unit: 'L/min', value: 60, tex: 'Q_d' },
        Qp: { name: 'pump flow', q: 'flowrate', unit: 'L/min', value: 15, tex: 'Q_p' },
        t: { name: 'duration of the fast stroke', q: 'time', unit: 's', value: 4 }
      },
      note: 'The pump keeps delivering during the stroke, so only the difference comes from the accumulator. Size the accumulator for this volume (see Sizing an accumulator).',
      stories: {
        dV: 'A cylinder needs {Qd} for {t} while the pump delivers {Qp}. How much oil must the accumulator supply?',
        Qp: 'An accumulator can give {dV} during a stroke of {t} that needs {Qd}. What pump flow is needed as well?'
      }
    },
    {
      name: 'Pump flow for an intermittent cycle',
      expr: 'Qp = Vc/T', tex: 'Q_p = \\dfrac{V_c}{T}',
      vars: {
        Qp: { name: 'average pump flow needed', q: 'flowrate', unit: 'L/min', tex: 'Q_p' },
        Vc: { name: 'oil used per cycle', q: 'volume', unit: 'L', value: 4, tex: 'V_c' },
        T: { name: 'cycle time', q: 'time', unit: 's', value: 20 }
      },
      note: 'The minimum: add a margin for leakage and for recharging the accumulator in time. Without an accumulator the pump must match the peak flow instead.',
      stories: { Qp: 'A machine uses {Vc} of oil every {T}. What is the smallest pump flow that can keep up if an accumulator covers the peaks?' }
    },
    {
      name: 'Energy released by the gas (isothermal)',
      expr: 'W = p0*V0*ln(p2/p1)', tex: 'W = p_0 V_0 \\ln\\dfrac{p_2}{p_1}',
      vars: {
        W: { name: 'work done by the gas', q: 'energy', unit: 'kJ' },
        p0: { name: 'pre-charge pressure (absolute)', q: 'pressure', unit: 'bar', value: 91, tex: 'p_0' },
        V0: { name: 'gas volume at pre-charge (accumulator size)', q: 'volume', unit: 'L', value: 10, tex: 'V_0' },
        p2: { name: 'maximum working pressure (absolute)', q: 'pressure', unit: 'bar', value: 201, tex: 'p_2' },
        p1: { name: 'minimum working pressure (absolute)', q: 'pressure', unit: 'bar', value: 101, tex: 'p_1' }
      },
      note: 'Slow discharge from p₂ to p₁, with p₀V₀ = pV along the way. Absolute pressures. The oil delivers slightly less (the atmosphere takes p_atm·ΔV), and a fast discharge somewhat less again.',
      stories: { W: 'A {V0} accumulator pre-charged to {p0} discharges slowly from {p2} to {p1}. How much energy does its gas release?' }
    }
  ],
  examples: [
    {
      title: 'A small pump and an accumulator instead of a big pump',
      q: 'A clamp needs 3 L of oil in 2 s once every 30 s, and must never see less than 120 bar (gauge); the pressure may rise to 180 bar. Compare a pump sized for the peak with a pump plus accumulator.',
      steps: [
        'Without an accumulator: $Q = 3\\text{ L}/2\\text{ s} = 90$ L/min. At 120 bar that is $120 \\times 90/600 = 18$ kW of hydraulic power.',
        'With an accumulator the average is $3/30 = 0.1$ L/s = 6 L/min; choose an 8 L/min pump for margin. During the stroke it supplies $8/60 \\times 2 = 0.27$ L, so the accumulator gives $\\Delta V = 3 - 0.27 = 2.73$ L.',
        'Absolute pressures: $p_1 = 121$ bar, $p_2 = 181$ bar, pre-charge $p_0 = 0.9 \\times 121 \\approx 109$ bar.',
        { text: 'The stroke takes 2 s, so size adiabatically ($n = 1.4$):', tex: 'V_0 = \\frac{2.73}{(109/121)^{1/1.4} - (109/181)^{1/1.4}} = \\frac{2.73}{0.928 - 0.696} = 11.8\\text{ L}' },
        'A 13 L accumulator is chosen. Recharging 2.73 L at 8 L/min takes 20.5 s — inside the 28 s between strokes.',
        'The pump now needs $180 \\times 8/600 = 2.4$ kW at most — about a seventh of the peak-flow design.'
      ],
      a: 'An 8 L/min pump (2.4 kW) with a 13 L accumulator does the work of a 90 L/min, 18 kW pump.'
    },
    {
      title: 'How much energy sits in an accumulator?',
      q: 'A 10 L accumulator pre-charged to 90 bar works between 100 and 200 bar (gauge). How much energy does it release in a slow discharge, and what is that equivalent to?',
      steps: [
        'Absolute pressures: $p_0 = 91$, $p_1 = 101$, $p_2 = 201$ bar.',
        { text: 'Isothermal work of the gas:', tex: 'W = p_0 V_0 \\ln\\frac{p_2}{p_1} = 9.1\\times10^6 \\times 0.010 \\times \\ln\\frac{201}{101} = 62.6\\text{ kJ}' },
        'That would lift a tonne by $62\\,600/9810 = 6.4$ m — released in a second or two if a fitting is opened.'
      ],
      a: 'About 63 kJ: enough to lift a tonne more than 6 m. That is why the dump valve and its gauge matter.'
    }
  ],
  quiz: [
    { q: 'In an accumulator charging circuit, what is the check valve between the pump and the accumulator for?', choices: ['to limit the pressure', 'to stop the accumulator discharging back through the pump when the pump unloads', 'to filter the oil', 'to slow the charging'], a: 1,
      why: 'When the unloading valve dumps the pump flow to tank at a few bar, the pump outlet is at low pressure; without the check valve the accumulator would empty back through it.' },
    { q: 'A machine uses 4 L of oil per 25 s cycle, all of it in one 2 s stroke. What is the least average pump flow that can keep up if an accumulator covers the peak?', answer: 9.6, unit: 'L/min', tol: 0.02,
      why: '4 L every 25 s is 0.16 L/s = 9.6 L/min. The peak (120 L/min) comes from the accumulator; a practical pump would be a little larger.' },
    { q: 'When the electric motor of a machine with an accumulator is switched off, its circuit is pressure-free.', a: false,
      why: 'The accumulator stays charged behind its check valve. Only a dump valve — automatic or manual — discharges it, and its gauge must read zero before work.' },
    { q: 'Oil is trapped between two closed valves in a rigid block and warms by 5 K. Roughly how much does its pressure rise?', choices: ['0.5 bar', '5 bar', '50 bar', '500 bar'], a: 2,
      why: 'Oil expands about 0.07 % per kelvin and its bulk modulus is about 1.5 GPa: 0.0007 × 1.5×10⁹ ≈ 10⁶ Pa, 10 bar per kelvin. A small accumulator or a thermal relief valve protects such sections.' },
    { q: 'Why is there a throttle in the dump line of an accumulator safety block?', choices: ['to keep the accumulator charged longer', 'to make the discharge gentle, limiting the flow, the shock and the heat', 'to measure the flow', 'to stop the pump starting'], a: 1,
      why: 'An accumulator can deliver hundreds of litres per minute. Without a throttle, dumping it would slam lines and hoses and flood the tank return.' }
  ],
  problems: [
    { q: 'A press needs 60 L/min for 3 s in a 20 s cycle. The pump delivers 12 L/min. How much oil must the accumulator supply per stroke?', answer: 2.4, unit: 'L', tol: 0.02,
      steps: ['$\\Delta V = (Q_d - Q_p)t = (60 - 12)/60 \\times 3 = 2.4$ L.', 'Check the average: the cycle uses 3 L in 20 s = 9 L/min, below the pump\'s 12 L/min, so the accumulator can be recharged in time.'] },
    { q: 'A 20 L accumulator pre-charged to 101 bar (absolute) discharges slowly from 211 to 141 bar (absolute). How much energy does its gas release, in kJ?', answer: 81.4, unit: 'kJ', tol: 0.02,
      steps: ['$W = p_0V_0\\ln(p_2/p_1) = 1.01\\times10^7 \\times 0.020 \\times \\ln(211/141)$.', '$\\ln 1.4965 = 0.4031$, so $W = 2.02\\times10^5 \\times 0.4031 = 81.4$ kJ.'] }
  ],
  applications: ['Injection-moulding machines, die-casting and presses: small pumps, accumulator-driven fast strokes.', 'Emergency closing of safety valves, turbine blade feathering and aircraft brakes after a loss of power.', 'Clamping fixtures on machine tools, holding force while the pump unloads.', 'Suspension of agricultural and construction machines, and pulsation dampers on piston pumps.'],
  history: 'William Armstrong built weight-loaded accumulators in the 1850s — a heavy ram loaded with tonnes of ballast pressing on water — to store the output of small steam pumps for cranes, dock gates and swing bridges. London\'s Tower Bridge was raised that way from 1894, and the London Hydraulic Power Company piped high-pressure water under the city streets from 1883 until 1977.',
  sim: 'sys-acc-circuit'
},

{
  id: 'hi-lo-circuit', parent: 'system-circuits', title: 'Hi-lo and unloading circuits', level: 2,
  short: 'Two pumps on one motor: both fill the cylinder for a fast, low-pressure approach, then an unloading valve dumps the large pump and the small one alone builds the high pressure. Speed where it is cheap, force where it is needed, from a fraction of the power.',
  keywords: ['hi-lo', 'high-low', 'double pump', 'two-pump circuit', 'unloading valve', 'unloading circuit', 'press circuit', 'fast approach', 'rapid traverse', 'horsepower control', 'power limiter', 'pump unloading'],
  prereq: ['pilot-relief', 'check-valves', 'pressure-flow-power', 'basic-circuit'],
  related: ['accumulator-circuits', 'regenerative-circuit', 'pressure-compensated-pump', 'variable-displacement', 'industrial-presses', 'heat-coolers', 'sequencing-circuit'],
  body: `
A press, a clamp or a riveting machine does two very different jobs in one stroke. First it must travel a long way quickly with almost no force — the **approach**, or rapid traverse. Then it must move a few millimetres slowly against a huge force — the **work stroke**. A single pump big enough for the approach speed and strong enough for the working pressure would need both at once, and hydraulic power is pressure times flow: the motor would be enormous and would idle through most of the cycle.

### Two pumps, one motor
The hi-lo circuit uses a **double pump** — a large low-pressure pump and a small high-pressure pump on one shaft.
- During the approach both deliver into the system, and the cylinder moves at $v = (Q_L + Q_H)/A$.
- When the platen meets the work the pressure rises. At the setting $p_u$ of an **unloading valve** — a relief valve whose pilot is taken from the system side of the circuit — the large pump's flow is sent to tank at a few bar. A **check valve** stops high-pressure oil flowing back into the large pump.
- The small pump carries on alone, up to the main relief setting: the cylinder moves slowly, at $Q_H/A$, with full force.
- On the return stroke the pressure is low again, and both pumps drive the cylinder back quickly.

The pilot must come from beyond the check valve. A valve piloted from the large pump's own outlet would only be a relief valve: it would hold that pump at $p_u$ and waste $p_u Q_L$ as heat. Piloted from the system, it opens fully and lets the large pump idle at a few bar.

### The power it saves
Take a 100 mm bore press with a 40 + 8 cm³/rev double pump at 1450 rpm (58 and 11.6 L/min), unloading at 40 bar and relieving at 250 bar:

| | Hi-lo | One pump of 69.6 L/min |
|---|---|---|
| Approach speed | 148 mm/s | 148 mm/s |
| Force before the large pump unloads | 31 kN | — |
| Pressing speed | 25 mm/s | 148 mm/s |
| Drive power at 250 bar (85 % efficiency) | about 6 kW | about 34 kW |

The single pump presses six times faster — but needs nearly six times the motor, for a speed a press rarely needs. Today a **power-limited** (horsepower-controlled) variable pump does the same job with one unit: it cuts its displacement as the pressure rises, following a curve of constant power (see [[variable-displacement]] and [[pressure-compensated-pump]]). Hi-lo pairs remain popular because they are simple, cheap and robust.

### Unloading circuits in general
The same idea appears wherever a pump need not work. An accumulator charging valve unloads the pump when the accumulator is full ([[accumulator-circuits]]); a vented [[pilot-relief|pilot-operated relief valve]] or a tandem-centre directional valve unloads it while the machine waits. An unloaded pump turns against a few bar and wastes a few hundred watts; the same pump over its relief valve turns its full power into heat (see [[heat-coolers]]).

> [!tip] Set the unloading pressure above the highest pressure the approach needs — friction, back-pressure, a counterbalance valve — but well below the working pressure, typically 30–70 bar. Too low and the press slows before it reaches the work; too high and the large pump works at pressure for nothing.

> [!warn] Presses crush. Guards, two-hand controls or light curtains and a safety-rated control system are required by the machinery standards. The platen must be held by a counterbalance or pilot-operated check valve, and supported mechanically before anyone works beneath it, with the power locked out and the pressure released.
`,
  ideas: [
    'A hi-lo circuit gives a fast, low-force approach from two pumps and a slow, high-force stroke from the small pump alone.',
    'An unloading valve piloted from the system side dumps the large pump to tank at a few bar once the pressure passes its setting.',
    'A check valve keeps high-pressure oil out of the unloaded large pump.',
    'The installed power falls to roughly the small pump\'s flow times the maximum pressure — a fraction of a single large pump\'s.',
    'Power-limited variable pumps and accumulator circuits are other answers to the same problem.'
  ],
  pitfalls: [
    'The unloading valve can be piloted from the large pump\'s outlet — Then it acts as a relief valve and holds the large pump at the unloading pressure, wasting that power as heat. The pilot must come from the system side, beyond the check valve.',
    'A hi-lo press is weaker than a single-pump press — The maximum force is set by the relief pressure and the bore, the same in both. Only the speed of the work stroke is lower.',
    'The higher the unloading pressure, the faster the press — Above the approach\'s needs, a higher setting only keeps the large pump working at pressure longer, adding power and heat without speed where it matters.'
  ],
  formulas: [
    {
      name: 'Approach speed with both pumps',
      expr: 'v = (QL + QH)/A', tex: 'v = \\dfrac{Q_L + Q_H}{A}',
      vars: {
        v: { name: 'approach speed', q: 'speed', unit: 'mm/s' },
        QL: { name: 'large (low-pressure) pump flow', q: 'flowrate', unit: 'L/min', value: 58, tex: 'Q_L' },
        QH: { name: 'small (high-pressure) pump flow', q: 'flowrate', unit: 'L/min', value: 11.6, tex: 'Q_H' },
        A: { name: 'piston area', q: 'area', unit: 'cm²', value: 78.5 }
      },
      note: 'While pressing, only the small pump feeds the cylinder: v = Q_H/A.',
      stories: { v: 'Pumps of {QL} and {QH} feed a press cylinder with a piston area of {A}. How fast does it approach the work?', QL: 'A press with {A} of piston area has a small pump of {QH}. How large must the second pump be for an approach at {v}?' }
    },
    {
      name: 'Force at which the large pump unloads',
      expr: 'F = pu*A', tex: 'F = p_u A',
      vars: {
        F: { name: 'force at the unloading point', q: 'force', unit: 'kN' },
        pu: { name: 'unloading-valve setting (gauge)', q: 'pressure', unit: 'bar', value: 40, tex: 'p_u' },
        A: { name: 'piston area', q: 'area', unit: 'cm²', value: 78.5 }
      },
      note: 'Below this force the press moves at full approach speed; above it, at the small pump\'s speed.',
      stories: { F: 'The unloading valve of a press with {A} of piston area is set to {pu}. Up to what force does the press keep its fast speed?', pu: 'A press with {A} of piston area must keep its fast speed up to {F}. What unloading pressure is needed?' }
    },
    {
      name: 'Drive power while pressing',
      expr: 'P = (pH*QH + pn*QL)/eta', tex: 'P = \\dfrac{p_H Q_H + p_n Q_L}{\\eta_t}',
      vars: {
        P: { name: 'motor power needed', q: 'power', unit: 'kW' },
        pH: { name: 'pressing pressure (gauge)', q: 'pressure', unit: 'bar', value: 250, tex: 'p_H' },
        QH: { name: 'small pump flow', q: 'flowrate', unit: 'L/min', value: 11.6, tex: 'Q_H' },
        pn: { name: 'no-load pressure of the unloaded large pump (gauge)', q: 'pressure', unit: 'bar', value: 4, tex: 'p_n' },
        QL: { name: 'large pump flow', q: 'flowrate', unit: 'L/min', value: 58, tex: 'Q_L' },
        eta: { name: 'overall pump efficiency', q: 'ratio', unit: '%', value: 85, tex: '\\eta_t' }
      },
      note: 'Compare a single pump of Q_L + Q_H at p_H: P = p_H (Q_L + Q_H)/η_t.',
      practice: { unknowns: ['P', 'QH'] },
      stories: { P: 'A hi-lo press works at {pH} with a small pump of {QH}; the large pump of {QL} idles at {pn}. With an efficiency of {eta}, what motor power does pressing need?' }
    }
  ],
  examples: [
    {
      title: 'Cycle time of a hi-lo press',
      q: 'The press above (100/70 mm cylinder, 58 + 11.6 L/min) approaches 350 mm, presses 30 mm and returns 380 mm. How long does a cycle take, and how long would it take with the small pump alone?',
      steps: [
        '$A_1 = 78.5$ cm², $A_2 = \\pi(0.1^2 - 0.07^2)/4 = 40.1$ cm².',
        'Approach: $v = 69.6/60\\,000/7.85\\times10^{-3} = 0.148$ m/s, so $0.35/0.148 = 2.4$ s.',
        'Pressing: $v = 11.6/60\\,000/7.85\\times10^{-3} = 24.6$ mm/s, so $30/24.6 = 1.2$ s.',
        'Return on both pumps: $v = 69.6/60\\,000/4.01\\times10^{-3} = 0.29$ m/s, so $0.38/0.29 = 1.3$ s. Total about 4.9 s.',
        'Small pump alone: approach 14.2 s, pressing 1.2 s, return 7.9 s — about 23 s.'
      ],
      a: 'About 5 s per cycle with hi-lo, against about 23 s with the small pump alone — for the same motor.'
    },
    {
      title: 'Choosing the unloading pressure',
      q: 'The approach of the press needs 18 bar (seal friction, a counterbalance valve and line losses). The work itself needs 120–240 bar. Where should the unloading valve be set, and what does that mean for the motor?',
      steps: [
        'The setting must clear the approach\'s 18 bar with margin for cold oil and wear: about 35–45 bar. Take 40 bar.',
        'During the approach the motor sees at most $40 \\times 69.6/600 = 4.6$ kW of hydraulic power; during pressing $250 \\times 11.6/600 + 4 \\times 58/600 = 5.2$ kW.',
        'The two peaks are balanced — a sign of a well-chosen setting. With 80 bar the approach peak would double to 9.3 kW.'
      ],
      a: 'About 40 bar, which keeps both phases near 5 kW of hydraulic power (6 kW at the motor).'
    }
  ],
  quiz: [
    { q: 'In a hi-lo circuit, when does the large pump unload?', choices: ['at the end of the return stroke', 'when the system pressure reaches the unloading valve\'s setting', 'when the small pump stalls', 'whenever the directional valve is shifted'], a: 1,
      why: 'The unloading valve watches the system pressure. When the work resists and the pressure passes its setting, it opens and sends the large pump\'s flow to tank.' },
    { q: 'What stops high-pressure oil from the small pump flowing back into the unloaded large pump?', choices: ['the relief valve', 'a check valve in the large pump\'s line', 'the directional valve', 'nothing is needed'], a: 1,
      why: 'Once the large pump is unloaded its outlet is at a few bar; a check valve between it and the system keeps the high-pressure side from draining into it.' },
    { q: 'Two pumps together deliver 50 L/min into an 80 mm bore cylinder (50.3 cm²). What is the approach speed in mm/s?', answer: 166, unit: 'mm/s', tol: 0.02,
      why: 'v = Q/A = (50/60 000)/5.03×10⁻³ = 0.166 m/s = 166 mm/s.' },
    { q: 'The unloading valve of a hi-lo circuit should be piloted from the large pump\'s own outlet.', a: false,
      why: 'Piloted from its own outlet it would only be a relief valve, holding that pump at the unloading pressure. Piloted from the system beyond the check valve, it opens fully and the pump idles at a few bar.' },
    { q: 'Which single pump can replace a hi-lo pair?', choices: ['a larger gear pump', 'a power-limited (horsepower-controlled) variable pump', 'a fixed vane pump with a bigger relief valve', 'a hand pump'], a: 1,
      why: 'A power limiter reduces the displacement as the pressure rises, keeping p·Q near a constant: large flow at low pressure, small flow at high pressure — exactly what the hi-lo pair provides in two steps.' }
  ],
  problems: [
    { q: 'A hi-lo unit presses at 300 bar with a 6 L/min pump while a 45 L/min pump idles at 5 bar. With an overall efficiency of 85 %, what motor power does pressing need?', answer: 3.97, unit: 'kW', tol: 0.02,
      steps: ['Hydraulic power: $300 \\times 6/600 + 5 \\times 45/600 = 3.0 + 0.375 = 3.375$ kW.', 'Motor: $3.375/0.85 = 3.97$ kW. A single 51 L/min pump at 300 bar would need $300 \\times 51/600/0.85 = 30$ kW.'] }
  ],
  applications: ['Hydraulic presses, from workshop presses to deep-drawing lines.', 'Clamping and rapid-traverse feeds on machine tools.', 'Log splitters: a two-stage pump gives a quick ram and full force when the log resists.', 'Riveting, crimping and baling machines.'],
  sim: 'sys-hilo'
},

{
  id: 'load-sensing', parent: 'system-circuits', title: 'Load-sensing systems', level: 3,
  short: 'A variable pump that always makes just a little more pressure than the heaviest load needs — typically 15–25 bar more — and just the flow the valves ask for. Most of the waste of fixed-pressure systems disappears, and the operator gets speeds that do not depend on the load.',
  keywords: ['load sensing', 'LS', 'LS margin', 'standby pressure', 'LS compensator', 'shuttle valve', 'pressure compensator', 'flow sharing', 'LUDV', 'post-compensated', 'pre-compensated', 'energy efficiency', 'mobile hydraulics', 'tractor hydraulics'],
  prereq: ['variable-displacement', 'pressure-compensation', 'open-closed-centre', 'orifice-equation'],
  related: ['pressure-compensated-pump', 'proportional-valves', 'mobile-hydraulics', 'heat-coolers', 'energy-losses-heat', 'hydraulic-stiffness', 'electronics:negative-feedback'],
  body: `
In a closed-centre system with a [[pressure-compensated-pump|pressure-compensated pump]] the pump holds its full setting — say 210 bar — whatever the load. A cylinder that needs only 60 bar is fed through a valve that throttles the other 150 bar into heat. **Load sensing** removes that waste by letting the load tell the pump what pressure to make.

### How it works
- Each directional valve section has a **load-sensing port** that picks up the pressure downstream of its metering notch — the actuator's pressure.
- A chain of **shuttle valves** selects the highest of these and sends it along the **LS line** to the pump.
- The pump's **LS compensator**, a small spool, balances the pump outlet pressure against the LS signal plus a spring, and adjusts the displacement until
$$p_P = p_L + \\Delta p_{LS}$$
where the **margin** $\\Delta p_{LS}$, set by the spring, is typically 15–25 bar. A separate pressure cut-off limits the maximum pressure as usual.

Because the pressure drop across the metering notch is held at the margin, the flow through it depends only on how far the spool is opened:
$$Q = C_d A\\sqrt{\\frac{2\\,\\Delta p}{\\rho}}$$
— not on the load (see [[orifice-equation]]). The operator moves a lever and gets the same speed whether the bucket is empty or full. With no valve operated the LS line vents to tank and the pump stands by at the margin pressure with almost no flow.

### Several functions at once
The pump can make only one pressure: the highest load's plus the margin. Every lighter function therefore has its own **pressure compensator** in its valve section that throttles the excess, so that its speed too stays independent of load. Those compensators burn $(p_P - p_{L,i})\\,Q_i$ — a boom lifting at 180 bar together with a slew at 60 bar makes the slew's 40 L/min waste over 9 kW. And when the operator asks for more flow than the pump can give, the heaviest function slows or stops first, unless the valve is a **flow-sharing** (post-compensated) design, which slows all functions in proportion.

### Where the energy goes
| One function at 100 bar, 60 L/min | Pump pressure | Pump flow | Input | Loss |
|---|---|---|---|---|
| Fixed pump 110 L/min, relief 210 bar | 210 bar | 110 L/min | 38.5 kW | 28.5 kW |
| Pressure-compensated pump at 210 bar | 210 bar | 60 L/min | 21 kW | 11 kW |
| Load sensing, 20 bar margin | 120 bar | 60 L/min | 12 kW | 2 kW |

Load sensing is standard on agricultural tractors, cranes, forestry machines and many construction machines, and in industrial systems with many functions. Electronic versions replace the hydraulic LS line with pressure sensors and an electrically controlled pump, which can also vary the margin or trim the pump to the operator's demand before the load pressure appears.

> [!note] The LS line closes a feedback loop — a hydraulic one, with oil compressibility and line volumes in it — and it can oscillate (see [[electronics:negative-feedback|negative feedback]] and [[hydraulic-stiffness]]). Damping orifices in the compensator and the LS line keep it stable; drilling them out "for faster response" is a classic way to make a system hunt.

> [!warn] An LS system in standby still holds its margin pressure, and the pump responds at once to any LS signal. Before working on valves, lines or actuators, stop the engine or motor, lower or support every load, release the pressure (operate the levers with the engine off where the manual says so) and lock out the machine.
`,
  ideas: [
    'The LS compensator keeps the pump pressure a fixed margin (15–25 bar) above the highest load pressure.',
    'Shuttle valves pick the highest load pressure and send it to the pump along the LS line.',
    'With a constant pressure drop across the metering notch, flow — and speed — depend only on the spool opening.',
    'Lighter functions are throttled by their own compensators; their loss is the pressure difference to the highest load times their flow.',
    'In standby the pump holds only the margin pressure with almost no flow.'
  ],
  pitfalls: [
    'Load sensing makes a system lossless — It still loses the margin times the flow, and every lighter function throttles the difference to the highest load. Its advantage is largest when the loads are similar and well below the maximum pressure.',
    'A larger LS margin makes the machine more powerful — It gives more flow for the same spool opening (flow grows with the square root of the margin), but the pressure limit and the pump size are unchanged, and the loss grows.',
    'The LS signal is the pump pressure — It is the load pressure, picked up downstream of the metering notch; the pump pressure is that plus the margin.'
  ],
  formulas: [
    {
      name: 'Pump pressure under load sensing',
      expr: 'pP = pL + dpLS', tex: 'p_P = p_L + \\Delta p_{LS}',
      vars: {
        pP: { name: 'pump outlet pressure (gauge)', q: 'pressure', unit: 'bar', tex: 'p_P' },
        pL: { name: 'highest load pressure (gauge)', q: 'pressure', unit: 'bar', value: 150, tex: 'p_L' },
        dpLS: { name: 'load-sensing margin', q: 'pressure', unit: 'bar', value: 20, tex: '\\Delta p_{LS}' }
      },
      note: 'Up to the pressure cut-off. In standby, with no function operated, p_L is vented to tank and the pump holds only the margin.',
      stories: { pP: 'A load-sensing pump with a margin of {dpLS} feeds a crane whose heaviest function needs {pL}. At what pressure does the pump run?' }
    },
    {
      name: 'Flow through the metering notch',
      expr: 'Q = Cd*A*sqrt(2*dp/rho)', tex: 'Q = C_d A\\sqrt{\\dfrac{2\\,\\Delta p}{\\rho}}',
      vars: {
        Q: { name: 'flow to the actuator', q: 'flowrate', unit: 'L/min' },
        Cd: { name: 'discharge coefficient', value: 0.65, tex: 'C_d' },
        A: { name: 'open area of the metering notch', q: 'area', unit: 'mm²', value: 12 },
        dp: { name: 'pressure drop across the notch (held at the margin)', q: 'pressure', unit: 'bar', value: 20, tex: '\\Delta p' },
        rho: { name: 'oil density', q: 'density', unit: 'kg/m³', value: 870, tex: '\\rho' }
      },
      note: 'With the drop held constant by the LS compensator (or the section\'s own compensator), the flow is set by the notch area alone — whatever the load.',
      stories: { Q: 'A valve notch open {A} sees a constant drop of {dp} (C_d = {Cd}, oil {rho}). What flow does the actuator get?', A: 'An actuator needs {Q} and the load-sensing margin holds {dp} across the notch (C_d = {Cd}, oil {rho}). What notch area is needed?' }
    },
    {
      name: 'Throttling loss of a lighter function',
      expr: 'Ploss = (pP - pL)*Q', tex: 'P_\\text{loss} = (p_P - p_L)\\,Q',
      vars: {
        Ploss: { name: 'power burnt in the section\'s compensator and notch', q: 'power', unit: 'kW', tex: 'P_\\text{loss}' },
        pP: { name: 'pump pressure (gauge)', q: 'pressure', unit: 'bar', value: 200, tex: 'p_P' },
        pL: { name: 'this function\'s load pressure (gauge)', q: 'pressure', unit: 'bar', value: 60, tex: 'p_L' },
        Q: { name: 'this function\'s flow', q: 'flowrate', unit: 'L/min', value: 40 }
      },
      note: 'For the function with the highest load the loss is just the margin times its flow.',
      stories: { Ploss: 'A load-sensing pump runs at {pP} because of a heavy function. A second function needs {pL} at {Q}. How much power does its compensator turn into heat?' }
    }
  ],
  examples: [
    {
      title: 'Two functions at once',
      q: 'A crane lifts its boom at 180 bar and 30 L/min while slewing at 60 bar and 40 L/min. The LS margin is 20 bar. Where does the power go? Compare a pressure-compensated pump set at 210 bar.',
      steps: [
        'Pump pressure: $180 + 20 = 200$ bar; flow $30 + 40 = 70$ L/min. Hydraulic input $200 \\times 70/600 = 23.3$ kW.',
        'Useful: $180 \\times 30/600 + 60 \\times 40/600 = 9.0 + 4.0 = 13.0$ kW.',
        'Losses: boom $20 \\times 30/600 = 1.0$ kW; slew compensator $(200 - 60) \\times 40/600 = 9.3$ kW. Total 10.3 kW; efficiency $13.0/23.3 = 56\\,\\%$.',
        'Pressure-compensated pump at 210 bar: input $210 \\times 70/600 = 24.5$ kW, efficiency 53 %. Hardly better — the heavy boom sets the pressure in both cases.'
      ],
      a: 'Load sensing gives 56 % here, barely more than the pressure-compensated pump; the light slew throttled to the boom\'s pressure is the big loss.'
    },
    {
      title: 'Speed that ignores the load',
      q: 'A spool notch is open 12 mm² ($C_d = 0.65$, oil 870 kg/m³) and the LS margin is 20 bar. What flow does the actuator get at 50 bar and at 180 bar? What if the margin is raised to 25 bar?',
      steps: [
        { text: 'The compensator holds 20 bar across the notch at both loads:', tex: 'Q = 0.65 \\times 12\\times10^{-6}\\sqrt{\\frac{2 \\times 2\\times10^6}{870}} = 5.29\\times10^{-4}\\text{ m}^3/\\text{s} = 31.7\\text{ L/min}' },
        'The load pressure does not appear: 31.7 L/min at 50 bar and at 180 bar (as long as the pump can reach 200 bar).',
        'With a 25 bar margin: $31.7\\sqrt{25/20} = 35.5$ L/min — 12 % faster at full stroke, and 25 % more margin loss.'
      ],
      a: '31.7 L/min at any load; 35.5 L/min with a 25 bar margin.'
    }
  ],
  quiz: [
    { q: 'What does the LS line carry to the pump?', choices: ['the pump\'s own outlet pressure', 'the highest load pressure among the working functions', 'the tank pressure', 'an electrical signal from the lever'], a: 1,
      why: 'Shuttle valves select the highest pressure downstream of the metering notches — the heaviest load — and send it to the compensator, which adds the margin.' },
    { q: 'An LS pump with a 20 bar margin feeds a single cylinder working at 120 bar. At what pressure does the pump run?', answer: 140, unit: 'bar', tol: 0.02,
      why: 'p_P = p_L + Δp_LS = 120 + 20 = 140 bar.' },
    { q: 'Two functions run together, one at 200 bar and one at 50 bar, each at 30 L/min. Which loses more power?', choices: ['the 200 bar function', 'the 50 bar function', 'they lose the same', 'neither: load sensing has no losses'], a: 1,
      why: 'The pump runs at about 220 bar. The heavy function loses only the margin (20 bar × 30 L/min = 1 kW); the light one throttles 170 bar × 30 L/min = 8.5 kW in its compensator.' },
    { q: 'With load sensing, the speed of a function at a given lever position depends on how heavy its load is.', a: false,
      why: 'The compensator holds the pressure drop across the metering notch constant, so the flow is set by the notch opening alone — until the pump reaches its flow or pressure limit.' },
    { q: 'The margin is raised from 20 to 30 bar. The flow at full lever…', choices: ['is unchanged', 'rises about 22 %', 'rises 50 %', 'falls'], a: 1,
      why: 'Flow through the notch grows with the square root of the pressure drop: √(30/20) = 1.22. The standby and margin losses rise by 50 %.' }
  ],
  problems: [
    { q: 'An LS system with a 25 bar margin drives one function at 80 bar and 50 L/min. What hydraulic power does the pump deliver, in kW?', answer: 8.75, unit: 'kW', tol: 0.02,
      steps: ['Pump pressure $80 + 25 = 105$ bar.', '$P = 105 \\times 50/600 = 8.75$ kW, of which $80 \\times 50/600 = 6.67$ kW is useful and 2.08 kW is the margin loss.'] }
  ],
  applications: ['Agricultural tractors: the hitch, remote valves and steering share one LS pump.', 'Mobile cranes, forestry forwarders and harvesters with many simultaneous functions.', 'Wheel loaders and telehandlers, often with load-sensing steering priority valves.', 'Industrial machines with many axes on one power unit.'],
  sim: 'sys-energy'
},

{
  id: 'open-closed-centre', parent: 'system-circuits', title: 'Open-centre and closed-centre systems', level: 2,
  short: 'Two ways to run a hydraulic system while the valves are idle: an open centre lets a fixed pump\'s flow return freely to tank; a closed centre blocks it and needs a pump that can stop delivering. The choice decides how the valves meter, how much standby power is wasted and how functions share the pump.',
  keywords: ['open centre', 'open center', 'closed centre', 'closed center', 'centre gallery', 'bleed-off metering', 'neutral circulation', 'standby loss', 'fixed pump', 'pressure-compensated system', 'constant pressure system', 'mobile valve', 'energy efficiency'],
  prereq: ['centre-conditions', 'pressure-compensated-pump', 'energy-losses-heat'],
  related: ['load-sensing', 'meter-in-out', 'accumulator-circuits', 'hi-lo-circuit', 'mobile-hydraulics', 'heat-coolers', 'directional-valves'],
  body: `
The centre of a directional valve — what its spool connects in the neutral position (see [[centre-conditions]]) — looks like a small detail on the symbol. It decides how the whole machine behaves.

### Open centre
In neutral, the valve connects the pump to tank through a **centre gallery** that runs through every section of the valve bank in turn. A **fixed pump** circulates its whole flow at low pressure — typically 5–15 bar through the bank — while the machine waits. Moving a spool gradually closes the gallery and opens the path to the actuator: the pump pressure rises until it can move the load, and the flow divides between the load and the part of the gallery still open. This is **bleed-off metering**:
$$Q_a = Q_p - C_d A_b\\sqrt{\\frac{2p}{\\rho}}$$
The flow to the actuator depends on the load pressure $p$: at the same lever position a heavy load moves more slowly than a light one, and a very heavy one does not move at all until the lever is nearly fully across. Skilled operators use this "feel" to sense the load; newcomers find it unpredictable.

- **For:** simple, cheap, tolerant of dirt; little standby loss.
- **Against:** speed depends on load; while metering, the surplus flow is pushed across the gallery at the working pressure; with several functions the lightest load takes most of the flow.

### Closed centre
In neutral the pump port is blocked, so the pump itself must stop delivering:
- a **fixed pump with a relief valve** — the crude version: the whole flow crosses the relief valve at full pressure while the machine waits. Acceptable only for tiny systems or very short waits;
- a fixed pump with an **accumulator and an unloading valve** (see [[accumulator-circuits]]);
- a **pressure-compensated variable pump**, which holds full pressure but delivers only the flow the valves draw — instant response and no surplus flow, but every function is fed at the full pressure and the valve throttles the difference;
- a **load-sensing pump** ([[load-sensing]]), which holds only a margin above the highest load.

### Comparing them
The energy efficiency of any arrangement is the useful hydraulic power over what the pump delivers:
$$\\eta = \\frac{p_L\\,Q_L}{p_P\\,Q_P}$$

| Waiting, 100 L/min system | Pump pressure | Standby loss |
|---|---|---|
| Open centre, fixed pump | 8 bar | 1.3 kW |
| Closed centre, fixed pump over the relief valve | 210 bar | 35 kW |
| Closed centre, pressure-compensated pump | 210 bar, 2 L/min leakage | 0.7 kW |
| Closed centre, load sensing | 20 bar, 2 L/min | 0.07 kW |

Open centre remains common on small tractors, loaders and simple mobile machines. Closed-centre pressure-compensated systems dominate machine tools and presses, where a constant supply pressure at every valve is worth its losses. Load sensing has taken over where many functions run at once and fuel matters. Many excavators use yet another scheme — open-centre valves with a variable pump whose displacement is controlled from the flow left in the centre gallery (negative or positive flow control) — which keeps the operator's feel and cuts the bypass loss.

> [!warn] In a closed-centre system the lines stay at full pressure whenever the pump turns, even with every lever in neutral. Stop the pump, release the pressure, discharge any accumulator and lock out before working on the valves or lines.
`,
  ideas: [
    'Open centre: in neutral a fixed pump circulates its flow to tank at low pressure through the centre gallery.',
    'Open-centre valves meter by bleed-off, so actuator speed depends on the load.',
    'Closed centre: the pump port is blocked in neutral, and the pump must be variable, unloaded or backed by an accumulator.',
    'A pressure-compensated closed-centre system gives every valve full pressure but throttles the difference to each load.',
    'Efficiency = load power ÷ pump power: matching pump pressure and flow to the load is what saves energy.'
  ],
  pitfalls: [
    'An open-centre system wastes the most energy — In standby it wastes little (a few bar times the pump flow). Its waste comes while metering; a closed centre with a fixed pump over the relief valve is far worse.',
    'A closed-centre valve can be used with any pump — With a fixed pump and no unloading, its whole flow crosses the relief valve whenever the valves are closed: full power into heat.',
    'In an open-centre system the lever sets the speed — The lever sets an opening; the speed also depends on the load pressure, because the flow divides between the actuator and the gallery.'
  ],
  formulas: [
    {
      name: 'Standby loss of an open-centre system',
      expr: 'P = dpn*Q', tex: 'P = \\Delta p_n\\,Q',
      vars: {
        P: { name: 'power lost in neutral', q: 'power', unit: 'kW' },
        dpn: { name: 'pressure drop through the open centre', q: 'pressure', unit: 'bar', value: 8, tex: '\\Delta p_n' },
        Q: { name: 'pump flow', q: 'flowrate', unit: 'L/min', value: 100 }
      },
      note: 'The same product gives the loss of a fixed pump over its relief valve in a closed-centre system — with the relief setting instead of a few bar.',
      stories: { P: 'An open-centre machine circulates {Q} through its valve bank with a drop of {dpn}. How much power does it waste while waiting?' }
    },
    {
      name: 'Bleed-off metering in an open-centre spool',
      expr: 'Qa = Qp - Cd*Ab*sqrt(2*p/rho)', tex: 'Q_a = Q_p - C_d A_b\\sqrt{\\dfrac{2p}{\\rho}}',
      vars: {
        Qa: { name: 'flow to the actuator', q: 'flowrate', unit: 'L/min', tex: 'Q_a' },
        Qp: { name: 'pump flow', q: 'flowrate', unit: 'L/min', value: 100, tex: 'Q_p' },
        Cd: { name: 'discharge coefficient', value: 0.65, tex: 'C_d' },
        Ab: { name: 'open area left in the centre gallery', q: 'area', unit: 'mm²', value: 10, tex: 'A_b' },
        p: { name: 'load pressure (gauge)', q: 'pressure', unit: 'bar', value: 100 },
        rho: { name: 'oil density', q: 'density', unit: 'kg/m³', value: 870, tex: '\\rho' }
      },
      note: 'The gallery returns oil to tank at the load pressure; what is left goes to the actuator. The heavier the load, the more the gallery takes.',
      practice: { unknowns: ['Qa', 'p'] },
      stories: { Qa: 'A {Qp} pump feeds an open-centre spool whose gallery is still open {Ab} (C_d = {Cd}, oil {rho}). The load needs {p}. How much flow reaches the actuator?', p: 'At a lever position that leaves {Ab} of gallery open, {Qa} of the pump\'s {Qp} reaches the actuator (C_d = {Cd}, oil {rho}). What is the load pressure?' }
    },
    {
      name: 'Energy efficiency of a hydraulic supply',
      expr: 'eta = pL*QL/(pP*QP)', tex: '\\eta = \\dfrac{p_L\\,Q_L}{p_P\\,Q_P}',
      vars: {
        eta: { name: 'hydraulic efficiency of the supply', q: 'ratio', unit: '%', tex: '\\eta' },
        pL: { name: 'load pressure (gauge)', q: 'pressure', unit: 'bar', value: 100, tex: 'p_L' },
        QL: { name: 'load flow', q: 'flowrate', unit: 'L/min', value: 40, tex: 'Q_L' },
        pP: { name: 'pump pressure (gauge)', q: 'pressure', unit: 'bar', value: 210, tex: 'p_P' },
        QP: { name: 'pump flow', q: 'flowrate', unit: 'L/min', value: 100, tex: 'Q_P' }
      },
      note: 'Pump and motor efficiencies come on top. A pressure match (load sensing) raises p_L/p_P; a flow match (variable pump) raises Q_L/Q_P.',
      stories: { eta: 'A pump delivers {QP} at {pP} while the load uses {QL} at {pL}. What fraction of the hydraulic power is useful?' }
    }
  ],
  examples: [
    {
      title: 'Standby: what waiting costs',
      q: 'A machine with a 100 L/min pump waits 60 % of an 8-hour shift. Compare the energy lost while waiting with an open centre (8 bar), a fixed pump over a 210 bar relief valve, and a pressure-compensated pump (210 bar, 2 L/min leakage).',
      steps: [
        'Waiting time: $0.6 \\times 8 = 4.8$ h.',
        'Open centre: $8 \\times 100/600 = 1.33$ kW, so 6.4 kWh.',
        'Fixed pump over the relief valve: $210 \\times 100/600 = 35$ kW, so 168 kWh — all of it heat that a cooler must remove.',
        'Pressure-compensated: $210 \\times 2/600 = 0.7$ kW, so 3.4 kWh.'
      ],
      a: 'About 6 kWh, 168 kWh and 3 kWh per shift: never let a fixed pump idle over its relief valve.'
    },
    {
      title: 'Why an open-centre machine "feels" the load',
      q: 'A 100 L/min pump feeds an open-centre spool held at a position that leaves 10 mm² of gallery open ($C_d = 0.65$, oil 870 kg/m³). How much flow reaches the cylinder when it needs 50 bar, and when it needs 100 bar?',
      steps: [
        { text: 'At 50 bar the gallery takes', tex: 'Q_b = 0.65 \\times 10^{-5}\\sqrt{\\frac{2 \\times 5\\times10^6}{870}} = 6.97\\times10^{-4}\\text{ m}^3/\\text{s} = 41.8\\text{ L/min}' },
        'So $Q_a = 100 - 41.8 = 58.2$ L/min.',
        'At 100 bar the gallery takes $41.8\\sqrt{2} = 59.1$ L/min, leaving $Q_a = 40.9$ L/min.'
      ],
      a: '58 L/min at 50 bar but only 41 L/min at 100 bar: the same lever gives a heavy load a third less speed.'
    }
  ],
  quiz: [
    { q: 'With every lever in neutral, an open-centre valve bank…', choices: ['blocks the pump, which runs over its relief valve', 'sends the pump flow to tank at low pressure through the centre gallery', 'connects both cylinder ports to the pump', 'stops the pump'], a: 1,
      why: 'The centre gallery runs through all sections and is open in neutral: the fixed pump circulates its flow to tank at a few bar.' },
    { q: 'Why does an open-centre machine slow down under a heavy load at the same lever position?', choices: ['the pump slows down', 'the gallery bleeds more flow to tank at the higher pressure', 'the relief valve opens', 'the oil gets thicker'], a: 1,
      why: 'Bleed-off metering: the flow through the partly open gallery grows with the square root of the load pressure, leaving less for the actuator.' },
    { q: 'A fixed pump on a closed-centre valve with only a relief valve turns its full power into heat while the machine waits.', a: true,
      why: 'With every port blocked, the pump\'s whole flow crosses the relief valve at its setting: P = p·Q, all of it heat.' },
    { q: 'An open-centre system circulates 80 L/min with a neutral pressure drop of 10 bar. What is the standby loss in kW?', answer: 1.33, unit: 'kW', tol: 0.02,
      why: 'P = Δp·Q = 10 × 80/600 = 1.33 kW.' },
    { q: 'A pressure-compensated pump at 200 bar feeds one cylinder working at 50 bar with 30 L/min. What is the hydraulic efficiency of the supply?', choices: ['25 %', '50 %', '75 %', '100 %'], a: 0,
      why: 'The flow matches, but the pressure does not: η = 50/200 = 25 %. The valve throttles 150 bar × 30 L/min = 7.5 kW into heat.' }
  ],
  problems: [
    { q: 'A pump delivers 90 L/min at 180 bar while a cylinder uses 60 L/min at 120 bar. What is the hydraulic efficiency of the supply, in per cent?', answer: 44.4, unit: '%', tol: 0.02,
      steps: ['Useful: $120 \\times 60/600 = 12$ kW. Pump: $180 \\times 90/600 = 27$ kW.', '$\\eta = 12/27 = 0.444 = 44.4$ %.'] }
  ],
  applications: ['Small tractors, skid-steer and backhoe loaders with open-centre valve banks and gear pumps.', 'Machine tools and presses on closed-centre, pressure-compensated power units.', 'Excavators with open-centre valves and negatively or positively flow-controlled pumps.', 'Aircraft hydraulics: closed centre with pressure-compensated pumps at a constant 207 or 345 bar (3000 or 5000 psi).'],
  history: 'Early tractor and loader hydraulics were open centre with gear pumps. Closed-centre systems with variable piston pumps reached farm tractors around 1960, and load sensing spread through mobile machinery from the 1970s onward as pump controls and valves were refined.',
  sim: { id: 'sys-energy', params: { show: 'open' } }
},

{
  id: 'braking-circuits', parent: 'system-circuits', title: 'Motor braking circuits', level: 3,
  short: 'A hydraulic motor turning a heavy wheel, drum or slewing deck does not stop when its valve closes: the load drives it as a pump. Crossover relief valves turn that energy into heat at a controlled pressure, make-up check valves keep the motor fed, and counterbalance valves and spring-applied brakes deal with loads that pull.',
  keywords: ['motor braking', 'crossover relief', 'cross-port relief', 'dual relief', 'anti-cavitation valve', 'make-up check valve', 'overrunning load', 'brake valve', 'counterbalance', 'slew drive', 'winch', 'inertia', 'deceleration', 'SAHR brake', 'spring-applied brake', 'motor spool'],
  prereq: ['hydraulic-motors', 'relief-valve', 'check-valves', 'counterbalance-valve'],
  related: ['motor-torque-speed', 'hydrostatic-transmission', 'load-holding', 'cavitation', 'lifts-cranes', 'mobile-hydraulics', 'physics:rotational-kinetic-energy'],
  body: `
Stop the flow to a hydraulic motor and the load it drives keeps going. A conveyor, a winch drum, the upper structure of an excavator or a ship's crane carries kinetic energy $\\tfrac12 J\\omega^2$, and the only way the hydraulics can stop it is to make the motor pump against a pressure. What that pressure is, and where the oil goes, is the whole subject of braking circuits.

### Closed centre and nothing else: a hammer blow
If the directional valve simply blocks both motor lines, the motor — now driven by the load — pushes oil into its outlet line, which has nowhere to go. The oil compresses and the hoses swell until the load's energy is stored in them, and the pressure can reach several hundred bar for a modest slewing drive. Then the motor springs back, the load rocks to and fro, and hoses, seals and gearboxes take a beating. Meanwhile the other line is being emptied: its pressure falls towards vapour pressure and the oil **cavitates**.

### Crossover relief valves
The standard answer is a pair of relief valves across the two motor lines, each opening from one line into the other. When the load drives the motor, the outlet pressure rises only to the crossover setting, and the relieved oil passes straight into the inlet line, feeding the motor. The braking torque is then constant,
$$T = \\frac{V_g\\,\\Delta p}{2\\pi}$$
the load decelerates uniformly and stops in $t = J\\omega/T$, and its whole kinetic energy becomes heat in the crossover valves. A lower setting stops more gently; the setting is chosen for the deceleration the structure, the gearbox and the operator can accept, and is often below the main relief setting.

### Make-up check valves
The crossover valves return the flow — but not the oil that escapes through the motor's case drain, and not the oil needed before a valve cracks open. **Anti-cavitation (make-up) check valves** from the return line into each motor line supply it. They open at a fraction of a bar, so the return line is often given a few bar of back-pressure to push the oil in briskly.

### Loads that pull
A crane winch lowering, a vehicle going downhill or a boom slewing down a slope is an **overrunning** load: it drives the motor all the time, not only while stopping. Crossover valves are not the tool here. A [[counterbalance-valve|counterbalance (brake) valve]] in the outlet line, opened by the inlet pressure, makes the motor meter its oil out: the load can never run faster than the pump fills the motor. In a [[hydrostatic-transmission]] the pump itself takes the power back and drives the engine as a brake.

### Parking and emergency brakes
Every hydraulic motor leaks, so it cannot hold a load still for long. Winches, slewing drives and wheel motors carry a **spring-applied, hydraulically released** multi-disc brake: springs clamp it, and a pilot pressure of about 15–30 bar releases it only while the drive is commanded. Losing pressure applies the brake.

> [!warn] Never rely on a hydraulic motor, a closed valve or a crossover valve to hold a suspended or rolling load while people are near it. Lower the load or secure it mechanically, apply the mechanical brake, release the pressure and lock out the machine before any maintenance.
`,
  ideas: [
    'A motor driven by its load becomes a pump; stopping it means making it pump against a pressure.',
    'Crossover relief valves limit that pressure and give a constant braking torque T = V_g Δp/2π, turning the kinetic energy into heat.',
    'Make-up check valves feed the inlet side from the return line so the motor does not cavitate.',
    'Overrunning loads need a counterbalance (brake) valve that meters the outlet flow.',
    'Spring-applied, pressure-released brakes hold loads still; the hydraulics never should.'
  ],
  pitfalls: [
    'Blocking both motor lines stops the load safely — The motor keeps turning, compresses the oil in its outlet line to a pressure spike and rocks back; the inlet line cavitates. Crossover reliefs and make-up checks are needed.',
    'The main relief valve protects the motor while braking — With the valve centred the motor lines are cut off from the pump and its relief valve; only valves across the motor lines can limit the braking pressure.',
    'A crossover relief valve can hold a hanging load — It only limits pressure; a motor leaks, so a hanging load creeps down. Holding needs a counterbalance valve and a mechanical brake.'
  ],
  formulas: [
    {
      name: 'Braking torque from the crossover setting',
      expr: 'T = Vg*dp/(2*pi)', tex: 'T = \\dfrac{V_g\\,\\Delta p}{2\\pi}',
      vars: {
        T: { name: 'braking torque at the motor shaft', q: 'torque', unit: 'N·m' },
        Vg: { name: 'motor displacement', q: 'displacement', unit: 'cm³/rev', value: 250, tex: 'V_g' },
        dp: { name: 'pressure difference across the motor (crossover setting)', q: 'pressure', unit: 'bar', value: 150, tex: '\\Delta p' }
      },
      note: 'Theoretical: mechanical losses in the motor add a little braking torque, leakage lets it slip.',
      stories: { T: 'A {Vg} motor is braked by crossover relief valves set at {dp}. What braking torque does it give?', dp: 'A {Vg} motor must brake its load with {T}. What crossover setting is needed?' }
    },
    {
      name: 'Stopping time at constant braking torque',
      expr: 't = J*omega/T', tex: 't = \\dfrac{J\\,\\omega}{T}',
      vars: {
        t: { name: 'stopping time', q: 'time', unit: 's' },
        J: { name: 'moment of inertia at the motor shaft', q: 'inertia', unit: 'kg·m²', value: 20 },
        omega: { name: 'speed when braking starts', q: 'angvel', unit: 'rpm', value: 150, tex: '\\omega' },
        T: { name: 'braking torque', q: 'torque', unit: 'N·m', value: 597 }
      },
      note: 'Inertia behind a gearbox counts at the motor shaft divided by the square of the ratio. Friction shortens the stop a little.',
      stories: { t: 'A slewing drive with {J} at the motor shaft turns at {omega} and is braked with {T}. How long does it take to stop?', T: 'A drive with {J} turning at {omega} must stop in {t}. What braking torque is needed?' }
    },
    {
      name: 'Energy the crossover valves turn into heat',
      expr: 'E = J*omega^2/2', tex: 'E = \\tfrac12 J\\,\\omega^2',
      vars: {
        E: { name: 'kinetic energy absorbed', q: 'energy', unit: 'kJ' },
        J: { name: 'moment of inertia at the motor shaft', q: 'inertia', unit: 'kg·m²', value: 20 },
        omega: { name: 'speed when braking starts', q: 'angvel', unit: 'rpm', value: 150, tex: '\\omega' }
      },
      note: 'Repeated stops add up: at one stop every 10 s this is a steady heat load of E/10 s.',
      stories: { E: 'A drive with {J} at the motor shaft is stopped from {omega}. How much energy do the crossover valves absorb?' }
    }
  ],
  examples: [
    {
      title: 'Stopping a slewing drive',
      q: 'A slewing drive has 20 kg·m² of inertia at the shaft of a 250 cm³/rev motor, turning at 150 rpm. The crossover reliefs are set at 150 bar. How quickly and how far does it stop, and how much heat is made?',
      steps: [
        'Torque: $T = 250\\times10^{-6} \\times 1.5\\times10^7/(2\\pi) = 597$ N·m.',
        'Speed: $\\omega = 150 \\times 2\\pi/60 = 15.7$ rad/s. Deceleration $\\alpha = T/J = 29.8$ rad/s².',
        'Time: $t = \\omega/\\alpha = 0.53$ s. Angle: $\\omega^2/(2\\alpha) = 4.1$ rad = 0.66 motor revolutions.',
        'Heat: $E = \\tfrac12 \\times 20 \\times 15.7^2 = 2.47$ kJ, all in the crossover valve and the oil passing it.'
      ],
      a: 'About 0.53 s and two-thirds of a motor revolution; 2.5 kJ of heat per stop.'
    },
    {
      title: 'Without crossover valves',
      q: 'The same drive is stopped by a closed-centre valve with no crossover reliefs. The outlet line and hose hold 1.5 L of oil with an effective bulk modulus (including hose swelling) of 0.8 GPa. Estimate the pressure peak.',
      steps: [
        'The kinetic energy is stored in the compressed oil: $\\tfrac12 J\\omega^2 = \\tfrac12 (V/\\beta)\\,\\Delta p^2$.',
        { text: 'So', tex: '\\Delta p = \\sqrt{\\frac{2E\\beta}{V}} = \\sqrt{\\frac{2 \\times 2467 \\times 0.8\\times10^9}{1.5\\times10^{-3}}} = 5.1\\times10^7\\text{ Pa}' },
        'About 510 bar — well above the rating of most hoses and motors — and the energy then springs back, rocking the load.'
      ],
      a: 'A peak of roughly 500 bar: the reason every inertial motor drive has crossover relief valves.'
    }
  ],
  quiz: [
    { q: 'When the valve centres, a motor still turning a heavy flywheel behaves as…', choices: ['a brake with no pressure', 'a pump driven by the flywheel', 'a motor driven by the pump', 'a free wheel with no effect on the oil'], a: 1,
      why: 'The flywheel drives the motor shaft, so the motor draws oil from one line and pushes it into the other: it is a pump, and the outlet pressure is what brakes it.' },
    { q: 'What are the make-up (anti-cavitation) check valves in a motor braking circuit for?', choices: ['to limit the braking pressure', 'to refill the low-pressure motor line from the return line so it does not cavitate', 'to drain the motor case', 'to hold the load when stopped'], a: 1,
      why: 'While braking, the motor draws oil from its inlet line. Leakage to the case drain is lost, so the check valves top the line up from the return side.' },
    { q: 'What braking torque does a 100 cm³/rev motor give with its crossover valves at 200 bar?', answer: 318, unit: 'N·m', tol: 0.02,
      why: 'T = V_g Δp/2π = 100×10⁻⁶ × 2×10⁷/6.283 = 318 N·m.' },
    { q: 'A crossover relief valve can hold a suspended load safely for hours.', a: false,
      why: 'A relief valve only limits pressure. A motor leaks, so a suspended load creeps down; holding needs a counterbalance valve and a spring-applied mechanical brake.' },
    { q: 'The crossover setting is doubled. The stopping time…', choices: ['doubles', 'halves', 'is unchanged', 'quarters'], a: 1,
      why: 'The braking torque doubles, so the deceleration doubles and the stopping time t = Jω/T halves — with twice the peak pressure and twice the torque on the gearbox.' }
  ],
  problems: [
    { q: 'An 80 cm³/rev motor drives a load of 5 kg·m² (at the motor shaft) at 300 rpm. Its crossover valves are set at 150 bar. How long does it take to stop?', answer: 0.822, unit: 's', tol: 0.02,
      steps: ['$T = 80\\times10^{-6} \\times 1.5\\times10^7/(2\\pi) = 191$ N·m.', '$\\omega = 300 \\times 2\\pi/60 = 31.4$ rad/s; $t = J\\omega/T = 5 \\times 31.4/191 = 0.82$ s.'] },
    { q: 'How much energy do the crossover valves of that drive absorb in one stop, in kJ?', answer: 2.47, unit: 'kJ', tol: 0.02,
      steps: ['$E = \\tfrac12 J\\omega^2 = 0.5 \\times 5 \\times 31.4^2 = 2467$ J = 2.47 kJ.'] }
  ],
  applications: ['Excavator and crane slewing drives: crossover reliefs, make-up checks and a spring-applied parking brake.', 'Winches and hoists: counterbalance (brake) valves for lowering, multi-disc brakes for holding.', 'Conveyor and mixer drives with large flywheel inertia.', 'Wheel drives of mobile machines, where the hydrostatic transmission brakes the vehicle.'],
  sim: 'sys-motor-brake'
},

/* ================================================================ COMPONENTS AND SIZING */

{
  id: 'reservoirs', parent: 'components-sizing', title: 'Reservoirs', level: 1,
  short: 'The tank is more than a box of oil: it lets the returning oil slow down so that air can rise and dirt settle, gives the pump a calm, flooded inlet, takes up the volume swings of the cylinders and sheds some heat.',
  keywords: ['reservoir', 'tank', 'oil tank', 'hydraulic tank', 'baffle', 'dwell time', 'retention time', 'breather', 'air release', 'deaeration', 'suction strainer', 'return diffuser', 'sight glass', 'tank size', 'pressurised reservoir'],
  prereq: ['hydraulic-system', 'air-in-oil', 'physics:viscosity'],
  related: ['heat-coolers', 'contamination', 'filtration', 'npsh', 'priming-suction', 'cavitation', 'hydraulic-oils', 'line-sizing'],
  body: `
Every open-circuit hydraulic system draws its oil from a reservoir and returns it there. The reservoir looks like the least interesting part of the machine, yet a badly designed one is behind a surprising share of pump failures, overheating and foaming.

### What the tank has to do
- **Hold enough oil** for the system, plus the difference in volume between all cylinders retracted and extended, plus room above the oil for thermal expansion and level swings — typically 10–15 % air space.
- **Release air.** Oil returning from the system carries entrained bubbles. They must reach the surface before the oil is drawn back into the pump, or they cause noise, spongy actuators and pump damage (see [[air-in-oil]]).
- **Let dirt and water settle** — at least the heavy particles and free water, which collect at the bottom where they can be drained.
- **Give the pump a good inlet**: a flooded suction, the tank preferably above the pump, and calm, bubble-free oil at the suction pipe (see [[npsh]]).
- **Shed some heat** through its walls (see [[heat-coolers]]).

### How big?
The traditional rule for industrial power units is **three to five times the pump flow per minute**: a 60 L/min pump gets a 180–300 L tank. It is really a rule about **dwell time** — the time the oil rests in the tank between passes, $t = V/Q$ — of three to five minutes. Mobile machines cannot carry that much oil and work with a minute or less, relying on careful internal design, pressurised tanks and oils with good air release. Smaller tanks are lighter, cheaper, warm up faster and hold less oil to buy and dispose of; they need more deliberate deaeration and cooling.

### Why bubbles need time
A small bubble rises through oil at the Stokes speed $v = \\rho g d^2/(18\\mu)$. In ISO VG 46 oil at 40 °C ($\\mu \\approx 40$ mPa·s):

| Bubble diameter | Rise speed | Rise in 4 minutes |
|---|---|---|
| 1 mm | 12 mm/s | reaches the surface |
| 0.3 mm | 1.1 mm/s | about 0.25 m |
| 0.1 mm | 0.12 mm/s | 28 mm |

Large bubbles escape easily; fine ones need time and a flow path that carries them near the surface. Cold oil is worse: at 20 °C a VG 46 oil is about three times as viscous, and bubbles rise three times more slowly.

### Inside a good reservoir
- A **baffle** between the return and suction sides, so that the returning oil takes a long path — usually up and over the baffle, near the surface where air escapes.
- **Return lines ending below the lowest oil level**, by two or three pipe diameters, cut at 45° or fitted with a diffuser and pointed away from the suction. A return above the surface splashes and whips air into the oil.
- **Suction** a few centimetres above the floor, so it does not pick up sediment, and well below the lowest level, so it does not draw a vortex of air.
- A **breather filter** (with desiccant in damp places) instead of an open vent; a **filler strainer**; a **sight glass** with thermometer; level and temperature switches; a sloping floor with a **drain** at the lowest point; **clean-out covers** big enough to reach every corner.

> [!warn] Before opening or cleaning a reservoir, stop and lock out the machine, discharge accumulators and let hot oil cool — oil at 60 °C and above scalds. Entering a large reservoir is a confined-space entry, with the permits, ventilation, gas testing and standby person that requires.
`,
  ideas: [
    'A reservoir stores oil, releases air, settles dirt and water, feeds the pump a calm inlet and sheds heat.',
    'Industrial rule of thumb: volume = 3–5 × pump flow per minute, i.e. a dwell time of 3–5 minutes.',
    'Bubbles rise at the Stokes speed, which grows with the square of their diameter and falls with viscosity.',
    'Baffles lengthen the flow path and lift the oil towards the surface; returns end below the oil level.',
    'Leave 10–15 % air space for thermal expansion and the volume swings of cylinders.'
  ],
  pitfalls: [
    'A bigger tank is always better — It costs space, weight and oil, warms up slowly and still releases little air if the return short-circuits to the suction. Internal design matters as much as volume.',
    'Returning oil above the surface helps release air — It splashes and entrains more air. Returns should end below the lowest oil level, through a diffuser.',
    'The tank settles out the dirt — Only coarse, heavy particles settle in a few minutes; fine particles, which do the most damage, stay suspended and must be removed by filters.'
  ],
  formulas: [
    {
      name: 'Reservoir volume from the dwell time',
      expr: 'V = Q*t', tex: 'V = Q\\,t',
      vars: {
        V: { name: 'oil volume in the reservoir', q: 'volume', unit: 'L' },
        Q: { name: 'pump flow', q: 'flowrate', unit: 'L/min', value: 60 },
        t: { name: 'dwell time', q: 'time', unit: 'min', value: 4 }
      },
      note: 'Industrial power units: 3–5 min. Mobile machines: 1 min or less. Add 10–15 % air space and the cylinders\' volume swing.',
      stories: { V: 'A power unit has a {Q} pump and the designer wants a dwell time of {t}. How much oil should the tank hold?', t: 'A {V} tank serves a {Q} pump. What is the dwell time?' }
    },
    {
      name: 'Rise speed of an air bubble (Stokes)',
      expr: 'v = rho*g*d^2/(18*mu)', tex: 'v = \\dfrac{\\rho g d^2}{18\\,\\mu}',
      vars: {
        v: { name: 'rise speed', q: 'speed', unit: 'mm/s' },
        rho: { name: 'oil density', q: 'density', unit: 'kg/m³', value: 870, tex: '\\rho' },
        g: { const: 'g' },
        d: { name: 'bubble diameter', q: 'length', unit: 'mm', value: 0.2 },
        mu: { name: 'dynamic viscosity of the oil', q: 'viscosity', unit: 'mPa·s', value: 40, tex: '\\mu' }
      },
      note: 'Valid for small bubbles (Reynolds number below about 1). The gas density is negligible. Heavy dirt particles sink at the same law with (ρ_p − ρ) in place of ρ.',
      stories: { v: 'How fast does an air bubble of {d} rise through oil of {rho} with a viscosity of {mu}?', d: 'Oil of {rho} and {mu} must release bubbles rising at least {v}. What is the smallest bubble that does?' }
    }
  ],
  examples: [
    {
      title: 'Sizing a power-unit tank',
      q: 'An industrial power unit has a 60 L/min pump. Its cylinders have a total rod volume (the difference between retracted and extended) of 8 L. Choose the tank.',
      steps: [
        'Dwell time of 4 minutes: $V = 60 \\times 4 = 240$ L of oil.',
        'The level swings by the 8 L of rod volume; allow for it above the working level.',
        'Air space 12 %: gross volume $\\approx (240 + 8)/0.88 = 282$ L. A standard 300 L tank is chosen.',
        'Check the dwell time at the lowest level: $232/60 = 3.9$ min — within the 3–5 minute rule.'
      ],
      a: 'About 240 L of oil in a 300 L tank.'
    },
    {
      title: 'Will the bubbles get out?',
      q: 'Oil at 40 °C (870 kg/m³, 40 mPa·s) spends 3 minutes in a tank whose returning stream passes 150 mm below the surface. Which bubbles escape? What changes at 20 °C (120 mPa·s)?',
      steps: [
        { text: 'The bubble that just rises 150 mm in 180 s needs $v = 0.83$ mm/s. Solve Stokes for $d$:', tex: 'd = \\sqrt{\\frac{18\\mu v}{\\rho g}} = \\sqrt{\\frac{18 \\times 0.040 \\times 8.3\\times10^{-4}}{870 \\times 9.81}} = 0.26\\text{ mm}' },
        'So bubbles larger than about 0.26 mm escape; smaller ones go round again.',
        'At 20 °C the viscosity is three times higher, so $d$ grows by $\\sqrt3$: only bubbles above about 0.46 mm escape.'
      ],
      a: 'Bubbles above about 0.26 mm escape at 40 °C, above about 0.46 mm at 20 °C — a baffle that lifts the stream nearer the surface helps far more than extra volume.'
    }
  ],
  quiz: [
    { q: 'Why should return lines end below the oil level?', choices: ['to cool the oil', 'so that the returning oil does not splash and entrain air', 'to raise the dwell time', 'to keep the pump primed'], a: 1,
      why: 'A jet falling onto the surface whips air into the oil. Below the surface, through a diffuser, the returning oil enters quietly.' },
    { q: 'A 400 L tank serves a 100 L/min pump. What is the dwell time in minutes?', answer: 4, unit: 'min', tol: 0.02,
      why: 't = V/Q = 400/100 = 4 min, the middle of the industrial 3–5 minute rule.' },
    { q: 'A bubble twice the diameter of another rises…', choices: ['at the same speed', 'twice as fast', 'four times as fast', 'eight times as fast'], a: 2,
      why: 'Stokes: v ∝ d². Doubling the diameter quadruples the rise speed — large bubbles escape easily, fine ones need time.' },
    { q: 'A bigger reservoir always makes a hydraulic system better.', a: false,
      why: 'Volume helps only with a flow path that brings air to the surface. Bigger tanks cost space, weight and oil and warm up slowly; mobile machines work well with small, well-designed tanks.' },
    { q: 'What is the main job of a baffle in a reservoir?', choices: ['to stiffen the tank walls', 'to make the returning oil take a long path, near the surface, before it reaches the suction', 'to filter the oil', 'to hold the level sensor'], a: 1,
      why: 'Without a baffle, returning oil can short-circuit to the suction in seconds. A baffle lengthens the path and lifts the stream towards the surface where the air escapes.' }
  ],
  problems: [
    { q: 'How fast does a 0.2 mm air bubble rise in cold oil (870 kg/m³, 120 mPa·s)? Give mm/s.', answer: 0.158, unit: 'mm/s', tol: 0.02,
      steps: ['$v = \\rho g d^2/(18\\mu) = 870 \\times 9.81 \\times (2\\times10^{-4})^2/(18 \\times 0.12)$.', '$= 3.41\\times10^{-4}/2.16 = 1.58\\times10^{-4}$ m/s = 0.158 mm/s — a third of its speed in warm oil.'] }
  ],
  applications: ['Industrial power units with the pump, motor and valves mounted on the tank lid.', 'Mobile machines with compact, pressurised tanks shaped to fit the chassis.', 'Aircraft reservoirs, pressurised by bleed air or a bootstrap piston so the pumps are fed in any attitude.', 'Separate tanks with kidney-loop filtration and cooling on large presses and test rigs.'],
  sim: 'sys-tank'
},

{
  id: 'accumulators', parent: 'components-sizing', title: 'Accumulators', level: 2,
  short: 'A pressure vessel that stores oil under a cushion of compressed nitrogen: it takes oil in when the pressure rises and gives it back when the pressure falls — a hydraulic battery, shock absorber and leakage compensator in one.',
  keywords: ['accumulator', 'hydraulic accumulator', 'bladder accumulator', 'piston accumulator', 'diaphragm accumulator', 'pre-charge', 'precharge', 'nitrogen', 'gas charge', 'isothermal', 'adiabatic', 'polytropic', 'Boyle', 'poppet valve', 'weight-loaded accumulator'],
  prereq: ['gauge-absolute', 'physics:ideal-gas-law', 'pneumatics:isothermal-adiabatic', 'bulk-modulus'],
  related: ['accumulator-sizing', 'accumulator-circuits', 'surge-protection', 'hydraulic-safety', 'physics:thermodynamic-processes', 'pneumatics:receivers', 'pneumatics:boyles-law'],
  body: `
A hydraulic accumulator is the one component that lets a system store energy. Oil itself barely compresses (see [[bulk-modulus]]), so something springy has to be added: in nearly every modern accumulator it is a charge of **dry nitrogen**, separated from the oil by a rubber bladder, a steel piston or a flexible diaphragm. Pump oil in and the gas is squeezed; let the system pressure fall and the gas pushes the oil back out.

### Three ways to keep gas and oil apart
| Type | Separator | Typical sizes | Strengths | Limits |
|---|---|---|---|---|
| Bladder | rubber bag in a forged shell, poppet valve at the oil port | 0.5–50 L | fast response, high flow, almost no friction | pressure ratio $p_2/p_0$ up to about 4 |
| Piston | free piston with seals in a honed tube | 1 L to several hundred L | large volumes, ratios up to about 10, piston position can be measured | seal friction, slower response |
| Diaphragm | elastomer membrane in a welded or screwed sphere | 0.1–4 L | compact, cheap, good for pulsation | small volumes, ratio up to about 8 |

Weight-loaded and spring-loaded accumulators exist too — the weight-loaded kind gives a constant pressure and powered the great water-hydraulic networks of the nineteenth century — but gas has won, because it stores far more energy per kilogram of accumulator.

### Pre-charge
Before any oil goes in, the gas side is filled to the **pre-charge pressure** $p_0$. No oil is stored below $p_0$: the separator is fully expanded and, in a bladder accumulator, rests against the poppet valve that stops it being pushed into the port. For energy storage the usual rule is $p_0 \\approx 0.9\\,p_1$, where $p_1$ is the lowest working pressure — high enough to use the gas well, low enough that the bladder does not slam onto the poppet at the end of every discharge. For pulsation damping $p_0$ is set near 60–70 % of the mean pressure; for shock absorption, near the working pressure.

### What happens to the gas
Nitrogen behaves close to an ideal gas, so with **absolute** pressures
$$p_0 V_0 = p_1 V_1 \\quad\\text{(slow: isothermal)} \\qquad p_0 V_0^{\\,n} = p_1 V_1^{\\,n} \\quad\\text{(fast: } n \\approx 1.4\\text{)}$$
When the oil moves in or out over a minute or more, the gas exchanges heat with the shell and stays near ambient temperature. When it moves within a few seconds there is no time for heat to flow: the gas heats as it is compressed and cools as it expands, with $n = 1.4$ for nitrogen — and real nitrogen above about 200 bar acts as if $n$ were larger still. A 10 L accumulator pre-charged at 90 bar and filled in a second to 150 bar heats its gas from 20 °C to about 66 °C; as the gas then cools, still holding its oil, the pressure sags to about 130 bar. Fast cycles deliver less oil for the same pressure band, which is why [[accumulator-sizing|sizing]] asks how fast the accumulator works. The time constant of that heat exchange is typically between a few seconds and a couple of minutes, longer for large accumulators. Try both laws on the [accumulator calculator](#/tools/fpower/accumulator).

> [!key] Accumulator arithmetic uses **absolute** pressures: 90 bar on the gauge is 91 bar absolute. At hydraulic pressures the difference is small, but the habit prevents large errors at low pressures (see [[gauge-absolute]]).

Accumulators store energy for large intermittent flows, give emergency power, make up leakage, absorb shocks and pump pulsation and take up the thermal expansion of trapped oil — see [[accumulator-circuits]].

> [!warn] An accumulator stays charged after the pump stops: it can move a cylinder or spray oil at full pressure. Before any work, discharge it to tank through its dump valve, check its own gauge reads zero, and lock out the machine. Fill the gas side only with dry nitrogen, using the maker's charging kit — never oxygen or air, which can ignite oil when compressed. Accumulators are pressure vessels (in Europe under the Pressure Equipment Directive 2014/68/EU): they must be marked and inspected, and never welded, drilled or heated.
`,
  ideas: [
    'An accumulator stores oil under a charge of compressed nitrogen behind a bladder, piston or diaphragm.',
    'No oil is stored below the pre-charge pressure; for energy storage p₀ ≈ 0.9 × the minimum working pressure.',
    'The gas follows pV = const when slow (isothermal) and pV^1.4 = const when fast (adiabatic) — with absolute pressures.',
    'A fast charge heats the gas; as it cools, the pressure sags while the oil volume stays the same.',
    'Accumulators are pressure vessels that stay charged after the pump stops: discharge before any work.'
  ],
  pitfalls: [
    'Any gas will do for the pre-charge — Only dry nitrogen: air brings oxygen, which can ignite oil vapour when compressed quickly, and moisture that corrodes the shell.',
    'An accumulator pre-charged above the working pressure still smooths the pressure — Below its pre-charge it holds no oil at all and does nothing.',
    'Gauge pressures work in the gas law — Boyle\'s law needs absolute pressures; ratios of gauge pressures are wrong, especially at low pressures.'
  ],
  formulas: [
    {
      name: 'Boyle\'s law for the gas charge (isothermal)',
      expr: 'p0*V0 = p1*V1', tex: 'p_0 V_0 = p_1 V_1',
      vars: {
        p0: { name: 'pre-charge pressure (absolute)', q: 'pressure', unit: 'bar', value: 91, tex: 'p_0' },
        V0: { name: 'gas volume at pre-charge (the accumulator size)', q: 'volume', unit: 'L', value: 10, tex: 'V_0' },
        p1: { name: 'working pressure (absolute)', q: 'pressure', unit: 'bar', value: 151, tex: 'p_1' },
        V1: { name: 'gas volume at the working pressure', q: 'volume', unit: 'L', tex: 'V_1' }
      },
      solveFor: 'V1',
      note: 'Slow changes, gas at the same temperature as at pre-charge. The oil stored is V₀ − V₁.',
      stories: { V1: 'A {V0} accumulator is pre-charged to {p0}. What is its gas volume at {p1} if it was filled slowly?', p0: 'A {V0} accumulator must still hold gas of {V1} at {p1}. What pre-charge does that mean (slow filling)?' }
    },
    {
      name: 'Polytropic compression of the gas',
      expr: 'p0*V0^n = p1*V1^n', tex: 'p_0 V_0^{\\,n} = p_1 V_1^{\\,n}',
      vars: {
        p0: { name: 'pre-charge pressure (absolute)', q: 'pressure', unit: 'bar', value: 91, tex: 'p_0' },
        V0: { name: 'gas volume at pre-charge', q: 'volume', unit: 'L', value: 10, tex: 'V_0' },
        n: { name: 'polytropic exponent (1 slow, 1.4 fast)', value: 1.4, min: 1, max: 1.8 },
        p1: { name: 'working pressure (absolute)', q: 'pressure', unit: 'bar', value: 151, tex: 'p_1' },
        V1: { name: 'gas volume at the working pressure', q: 'volume', unit: 'L', tex: 'V_1' }
      },
      solveFor: 'V1',
      note: 'n = 1.4 for nitrogen when the oil moves in a few seconds or less; between 1 and 1.4 in between. Real nitrogen above about 200 bar behaves as if n were higher.',
      stories: { V1: 'A {V0} accumulator pre-charged to {p0} is filled quickly to {p1}. With n = {n}, what is its gas volume?' }
    },
    {
      name: 'Gas temperature after a fast (adiabatic) compression',
      expr: 'T1 = T0*(p1/p0)^((n - 1)/n)', tex: 'T_1 = T_0\\left(\\dfrac{p_1}{p_0}\\right)^{(n-1)/n}',
      vars: {
        T1: { name: 'gas temperature after compression', q: 'temperature', unit: '°C', tex: 'T_1' },
        T0: { name: 'gas temperature before', q: 'temperature', unit: '°C', value: 20, tex: 'T_0' },
        p1: { name: 'pressure after (absolute)', q: 'pressure', unit: 'bar', value: 151, tex: 'p_1' },
        p0: { name: 'pressure before (absolute)', q: 'pressure', unit: 'bar', value: 91, tex: 'p_0' },
        n: { name: 'polytropic exponent', value: 1.4, min: 1.01, max: 1.8 }
      },
      note: 'Absolute pressures and temperatures (the calculator converts °C). As the hot gas cools at constant volume its pressure falls in proportion to its absolute temperature.',
      stories: { T1: 'Nitrogen at {T0} is compressed quickly from {p0} to {p1} (n = {n}). How hot does it get?' }
    }
  ],
  examples: [
    {
      title: 'Filled slowly or filled fast',
      q: 'A 10 L bladder accumulator is pre-charged to 90 bar (gauge) at 20 °C. How much oil does it hold at 150 bar (gauge) if it was filled slowly, and if it was filled in a second? What happens after the fast fill?',
      steps: [
        'Absolute pressures: $p_0 = 91$ bar, $p_1 = 151$ bar.',
        'Slowly (isothermal): $V_1 = 10 \\times 91/151 = 6.03$ L of gas, so 3.97 L of oil.',
        'Fast (adiabatic): $V_1 = 10 \\times (91/151)^{1/1.4} = 6.96$ L of gas, so only 3.04 L of oil.',
        'The gas is now at $293 \\times (151/91)^{0.286} = 339$ K = 66 °C.',
        'It cools back to 20 °C at constant volume (the oil cannot leave), so the pressure falls to $151 \\times 293/339 = 131$ bar absolute — about 130 bar on the gauge.'
      ],
      a: 'About 4.0 L when filled slowly, 3.0 L when filled fast; after a fast fill the pressure sags from 150 to about 130 bar as the gas cools.'
    }
  ],
  quiz: [
    { q: 'Why must an accumulator be pre-charged with nitrogen and not with compressed air?', choices: ['air is too compressible', 'oxygen can ignite oil vapour when the gas is compressed quickly, and air brings moisture', 'nitrogen is cheaper than air', 'air would dissolve the bladder'], a: 1,
      why: 'A fast compression heats the gas strongly; with oxygen present, oil that has diffused through the separator can ignite — a diesel effect. Nitrogen is inert and dry.' },
    { q: 'A bladder accumulator is pre-charged to 100 bar. The system works between 60 and 90 bar. How much oil does it deliver?', choices: ['about half its volume', 'about a tenth of its volume', 'none', 'all of it'], a: 2,
      why: 'Below its pre-charge pressure the bladder is fully expanded and no oil is stored. The pre-charge must be below the minimum working pressure.' },
    { q: 'An accumulator filled quickly and then left for a minute loses pressure even though no oil leaves it.', a: true,
      why: 'The fast compression heated the gas. As it cools at constant volume its pressure falls in proportion to its absolute temperature.' },
    { q: 'A 4 L accumulator is pre-charged to 50 bar absolute. What is its gas volume at 200 bar absolute if filled slowly?', answer: 1, unit: 'L', tol: 0.02,
      why: 'Boyle: V₁ = V₀ p₀/p₁ = 4 × 50/200 = 1 L. It then holds 3 L of oil.' },
    { q: 'Which type suits a 200 L energy store with a pressure ratio p₂/p₀ of 6?', choices: ['bladder', 'piston', 'diaphragm', 'spring-loaded'], a: 1,
      why: 'Piston accumulators come in large sizes and tolerate high ratios; bladders are limited to about 4:1 and 50 L, diaphragms to a few litres.' }
  ],
  problems: [
    { q: 'A 2.5 L diaphragm accumulator, pre-charged to 40 bar absolute, is slowly filled to 160 bar absolute. How much oil does it hold?', answer: 1.875, unit: 'L', tol: 0.02,
      steps: ['$V_1 = 2.5 \\times 40/160 = 0.625$ L of gas.', 'Oil: $2.5 - 0.625 = 1.875$ L.'] },
    { q: 'Nitrogen at 20 °C and 50 bar absolute is compressed adiabatically ($n = 1.4$) to 150 bar absolute. What temperature does it reach, in kelvin?', answer: 401, unit: 'K', tol: 0.02,
      steps: ['$T_1 = 293.15 \\times 3^{0.4/1.4} = 293.15 \\times 1.369 = 401$ K (128 °C).'] }
  ],
  applications: ['Bladder accumulators on injection-moulding machines, presses and mobile machine brakes.', 'Piston accumulators of hundreds of litres for emergency closing of turbine inlet valves and for test rigs.', 'Diaphragm accumulators as pulsation dampers on piston pumps and in vehicle suspensions.', 'Aircraft brake and emergency accumulators.'],
  history: 'The first hydraulic accumulators were weight-loaded: William Armstrong\'s towers of the 1850s held a vertical ram under tonnes of ballast. Gas-loaded designs took over in the twentieth century; the bladder accumulator, credited to the French engineer Jean Mercier around the middle of the century, made compact high-pressure energy storage routine.',
  sim: 'sys-acc-charge'
},

{
  id: 'accumulator-sizing', parent: 'components-sizing', title: 'Sizing an accumulator', level: 2,
  short: 'How big must an accumulator be to deliver a given volume of oil between two pressures? The gas law answers, with absolute pressures and an exponent that depends on how fast the oil moves.',
  keywords: ['accumulator sizing', 'accumulator size', 'useful volume', 'pre-charge pressure', 'minimum pressure', 'maximum pressure', 'isothermal', 'adiabatic', 'polytropic exponent', 'pressure ratio', 'temperature correction', 'real gas', 'nominal volume'],
  prereq: ['accumulators', 'gauge-absolute', 'pneumatics:isothermal-adiabatic'],
  related: ['accumulator-circuits', 'hi-lo-circuit', 'pneumatics:receiver-sizing', 'physics:ideal-gas-law', 'math:exponential-functions'],
  body: `
Sizing an accumulator means finding the gas volume $V_0$ that will deliver a **useful oil volume** $\\Delta V$ as the pressure falls from the maximum working pressure $p_2$ to the minimum $p_1$. Three states of the gas describe it:

| State | Pressure (absolute) | Gas volume |
|---|---|---|
| 0: pre-charged, no oil | $p_0$ | $V_0$ — the nominal size |
| 1: minimum working pressure | $p_1$ | $V_1$ |
| 2: maximum working pressure | $p_2$ | $V_2$ |

The oil delivered between states 2 and 1 is $\\Delta V = V_1 - V_2$. With a polytropic law $pV^n = \\text{const}$, each volume follows from the pre-charge, $V_i = V_0 (p_0/p_i)^{1/n}$, and so

$$\\Delta V = V_0\\left[\\left(\\frac{p_0}{p_1}\\right)^{1/n} - \\left(\\frac{p_0}{p_2}\\right)^{1/n}\\right]$$

Solve it for $V_0$ and the accumulator is sized. Use $n = 1$ (isothermal) when the oil moves slowly — over minutes, as in leakage make-up and holding — and $n = 1.4$ (adiabatic) when a stroke takes a few seconds or less, the usual case for energy storage. When charging is slow and the discharge fast, designers often compute the gas states along that real path; the adiabatic sizing is the safe simple answer.

### A worked comparison
Deliver 2 L between 100 and 200 bar gauge (101 and 201 bar absolute), with a pre-charge of 90 bar gauge (91 absolute):

| Process | Bracket | $V_0$ |
|---|---|---|
| isothermal, $n = 1$ | $0.901 - 0.453 = 0.448$ | 4.5 L |
| adiabatic, $n = 1.4$ | $0.928 - 0.568 = 0.360$ | 5.5 L |

A fast stroke needs about a quarter more accumulator, and the next nominal size the maker offers is chosen.

### The choices behind the numbers
- **Pressure band.** The wider the band $p_2/p_1$, the more oil per litre of accumulator — but the actuator must still do its job at $p_1$, and its speed changes through the stroke. A ratio of 1.5–2 is common.
- **Pre-charge.** $p_0 \\approx 0.9\\,p_1$ uses the gas well. A bladder should not be compressed beyond about $p_2 = 4p_0$, a diaphragm about $8p_0$.
- **Temperature.** The pre-charge is set at the filling temperature, but the gas works at the temperature of the oil. Pre-charged to 91 bar absolute at 20 °C, it is 100 bar at 50 °C — $p_0$ scales with absolute temperature — which can lift it above $p_1$ and leave the accumulator idle at the bottom of its band. Specify the filling pressure at the filling temperature, corrected for the working temperature.
- **Real gas.** Above about 200 bar nitrogen is stiffer than an ideal gas; manufacturers' programs apply corrections of a few per cent to 10 % or more at the highest pressures.

The [accumulator calculator](#/tools/fpower/accumulator) does the sum for any values and draws both curves.

> [!tip] Convert to **absolute** pressures before dividing them. With gauge pressures the ratios are wrong, and the error grows as the pressures fall: at 5–10 bar it is about 8 %.
`,
  ideas: [
    'Useful volume ΔV = V₀[(p₀/p₁)^(1/n) − (p₀/p₂)^(1/n)], with absolute pressures.',
    'n = 1 for slow cycles, n = 1.4 for strokes of a few seconds; the adiabatic case needs the larger accumulator.',
    'A wider pressure band gives more oil per litre, but the actuator must still work at the minimum pressure.',
    'The pre-charge changes with the gas temperature: set it for the working temperature.',
    'Choose the next nominal size up, and check the pressure ratio limits of the accumulator type.'
  ],
  pitfalls: [
    'The accumulator delivers its whole volume — Only the difference between the gas volumes at p₁ and p₂ is useful, often a third or less of the nominal size.',
    'Isothermal sizing is always good enough — A stroke of a few seconds is nearly adiabatic and needs a larger accumulator; isothermal sizing then leaves the pressure falling below p₁ before the stroke ends.',
    'The pre-charge set at the workshop stays the same in service — It rises and falls with the gas temperature, about 1/293 of its absolute value per kelvin near room temperature.'
  ],
  formulas: [
    {
      name: 'Accumulator size (polytropic)',
      expr: 'dV = V0*((p0/p1)^(1/n) - (p0/p2)^(1/n))', tex: '\\Delta V = V_0\\left[\\left(\\dfrac{p_0}{p_1}\\right)^{1/n} - \\left(\\dfrac{p_0}{p_2}\\right)^{1/n}\\right]',
      vars: {
        dV: { name: 'useful oil volume between p₁ and p₂', q: 'volume', unit: 'L', value: 2, tex: '\\Delta V' },
        V0: { name: 'accumulator size (gas volume at pre-charge)', q: 'volume', unit: 'L', tex: 'V_0' },
        p0: { name: 'pre-charge pressure (absolute)', q: 'pressure', unit: 'bar', value: 91, tex: 'p_0' },
        p1: { name: 'minimum working pressure (absolute)', q: 'pressure', unit: 'bar', value: 101, tex: 'p_1' },
        p2: { name: 'maximum working pressure (absolute)', q: 'pressure', unit: 'bar', value: 201, tex: 'p_2' },
        n: { name: 'polytropic exponent (1 slow, 1.4 fast)', value: 1.4, min: 1, max: 1.8 }
      },
      solveFor: 'V0',
      note: 'Absolute pressures. Round V₀ up to the next nominal size.',
      practice: { unknowns: ['V0', 'dV'] },
      stories: {
        V0: 'An accumulator must deliver {dV} between {p2} and {p1}, pre-charged to {p0}, in a fast stroke (n = {n}). What size is needed?',
        dV: 'A {V0} accumulator pre-charged to {p0} works between {p2} and {p1} with n = {n}. How much oil does it deliver?'
      }
    },
    {
      name: 'Accumulator size (isothermal)',
      expr: 'dV = V0*p0*(1/p1 - 1/p2)', tex: '\\Delta V = V_0\\,p_0\\left(\\dfrac{1}{p_1} - \\dfrac{1}{p_2}\\right)',
      vars: {
        dV: { name: 'useful oil volume', q: 'volume', unit: 'L', value: 2, tex: '\\Delta V' },
        V0: { name: 'accumulator size', q: 'volume', unit: 'L', tex: 'V_0' },
        p0: { name: 'pre-charge pressure (absolute)', q: 'pressure', unit: 'bar', value: 91, tex: 'p_0' },
        p1: { name: 'minimum working pressure (absolute)', q: 'pressure', unit: 'bar', value: 101, tex: 'p_1' },
        p2: { name: 'maximum working pressure (absolute)', q: 'pressure', unit: 'bar', value: 201, tex: 'p_2' }
      },
      solveFor: 'V0',
      note: 'The special case n = 1: slow charge and discharge, gas at constant temperature.',
      stories: { V0: 'Leakage make-up needs {dV} between {p2} and {p1}, slowly, with a pre-charge of {p0}. What accumulator size?' }
    },
    {
      name: 'Pre-charge at the working temperature',
      expr: 'p0T = p0*T/Tf', tex: 'p_{0,T} = p_0\\,\\dfrac{T}{T_f}',
      vars: {
        p0T: { name: 'pre-charge at the working gas temperature (absolute)', q: 'pressure', unit: 'bar', tex: 'p_{0,T}' },
        p0: { name: 'pre-charge set at the filling temperature (absolute)', q: 'pressure', unit: 'bar', value: 91, tex: 'p_0' },
        T: { name: 'working gas temperature', q: 'temperature', unit: '°C', value: 50 },
        Tf: { name: 'filling temperature', q: 'temperature', unit: '°C', value: 20, tex: 'T_f' }
      },
      note: 'Gay-Lussac at constant volume, absolute temperatures (the calculator converts °C).',
      stories: { p0T: 'An accumulator was pre-charged to {p0} at {Tf}. What is its pre-charge when the gas is at {T}?', p0: 'An accumulator must have a pre-charge of {p0T} at its working temperature of {T}. To what pressure should it be filled at {Tf}?' }
    }
  ],
  examples: [
    {
      title: 'Sizing for a fast stroke',
      q: 'An accumulator must supply 3 L in a 2 s stroke. The pressure may fall from 180 to 120 bar (gauge); the pre-charge is 0.9 × the minimum. Size it.',
      steps: [
        'Absolute: $p_1 = 121$, $p_2 = 181$, $p_0 = 0.9 \\times 121 = 109$ bar.',
        'Adiabatic brackets: $(109/121)^{0.714} = 0.928$, $(109/181)^{0.714} = 0.696$; difference 0.232.',
        '$V_0 = 3/0.232 = 12.9$ L. (Isothermal it would be $3/(0.901 - 0.602) = 10.1$ L.)',
        'Next nominal size: 13 L, with no margin — a 20 L unit, or a wider pressure band, would be safer.'
      ],
      a: 'About 13 L adiabatic (10 L isothermal); choose the next size up with some margin.'
    },
    {
      title: 'Pre-charging in a cold workshop',
      q: 'The design calls for a pre-charge of 100 bar absolute at the working gas temperature of 50 °C. The accumulator is charged in a workshop at 15 °C. What should the gauge read when filling?',
      steps: [
        '$p_0 = p_{0,T}\\,T_f/T = 100 \\times 288.15/323.15 = 89.2$ bar absolute.',
        'On the gauge: $89.2 - 1.0 = 88.2$ bar. Filling to 99 bar in the cold workshop would give 111 bar absolute when warm — above the intended minimum working pressure.'
      ],
      a: 'About 88 bar on the gauge at 15 °C.'
    }
  ],
  quiz: [
    { q: 'Why must the pressures in the sizing formula be absolute?', choices: ['the formula is empirical', 'the gas law relates absolute pressures; ratios of gauge pressures are wrong', 'gauges read absolute pressure anyway', 'it does not matter'], a: 1,
      why: 'Boyle\'s and the polytropic law hold for the absolute pressure of the gas. 10 bar gauge to 20 bar gauge is a ratio of 21/11 = 1.9 in absolute terms, not 2.' },
    { q: 'The same oil volume is needed in 1 s instead of in 60 s. The accumulator must be…', choices: ['smaller', 'the same', 'larger', 'it depends only on the pump'], a: 2,
      why: 'A 1 s stroke is adiabatic: the gas cools as it expands and its pressure falls faster, so more gas volume is needed to stay above p₁.' },
    { q: 'Isothermal: p₀ = 50, p₁ = 60 and p₂ = 120 bar absolute, and 1 L of oil is needed. What size, in litres?', answer: 2.4, unit: 'L', tol: 0.02,
      why: 'ΔV = V₀ p₀ (1/p₁ − 1/p₂) = V₀ × 50 × (1/60 − 1/120) = 0.4167 V₀, so V₀ = 1/0.4167 = 2.4 L.' },
    { q: 'Widening the pressure band (a lower p₁ or a higher p₂) lets a smaller accumulator deliver the same oil.', a: true,
      why: 'The bracket (p₀/p₁)^(1/n) − (p₀/p₂)^(1/n) grows as the band widens — but the actuator must still work at the lower p₁, and its speed varies more.' },
    { q: 'An accumulator pre-charged to 91 bar absolute at 20 °C warms to 60 °C. Its pre-charge becomes about…', choices: ['91 bar', '103 bar', '124 bar', '273 bar'], a: 1,
      why: 'At constant volume p ∝ T (absolute): 91 × 333/293 = 103 bar. Using °C (60/20 × 91 = 273) is the classic error.' }
  ],
  problems: [
    { q: 'An accumulator must deliver 5 L between 250 and 150 bar absolute, adiabatically ($n = 1.4$), with a pre-charge of 135 bar absolute. What size is needed, in litres?', answer: 17.6, unit: 'L', tol: 0.02,
      steps: ['$(135/150)^{1/1.4} = 0.9275$; $(135/250)^{1/1.4} = 0.6440$.', '$V_0 = 5/(0.9275 - 0.6440) = 5/0.2835 = 17.6$ L; a 20 L accumulator is chosen.'] }
  ],
  applications: ['Sizing energy-storage accumulators for presses and moulding machines.', 'Emergency accumulators that must complete a stroke after a power failure.', 'Leakage-compensation accumulators on clamping fixtures.', 'Brake accumulators on mobile machines, sized for a number of brake applications with the engine stopped.'],
  sim: 'sys-acc-size'
},

{
  id: 'hoses-fittings', parent: 'components-sizing', title: 'Hoses, tubes and fittings', level: 1,
  short: 'The plumbing of a hydraulic system: rubber hoses reinforced with steel wire where parts move, precision steel tubes where they do not, and fittings — 24° cone, 37° flare, O-ring face seal, flanges — that must stay tight at hundreds of bar and through millions of pressure cycles.',
  keywords: ['hydraulic hose', 'hose', 'SAE 100R2', 'EN 853', 'EN 856', 'EN 857', 'wire braid', 'spiral hose', 'burst pressure', 'design factor', 'bend radius', 'tube', 'steel tube', 'Barlow', 'fitting', '24 degree cone', 'JIC', 'ORFS', 'SAE flange', 'BSPP', 'hose whip'],
  prereq: ['hydraulic-system', 'pressure-definition', 'physics:stress-strain'],
  related: ['line-sizing', 'hydraulic-safety', 'troubleshooting', 'seals', 'water-hammer', 'mobile-hydraulics', 'pneumatics:tubing-fittings'],
  body: `
Oil at 250 bar has to be carried from the pump to the valves and on to every actuator — across hinges, around swinging booms, through vibrating frames — without leaking a drop. Two kinds of conductor do it: **hoses** wherever parts move relative to each other, and rigid **tubes** everywhere else.

### Hoses
A hydraulic hose has three layers: an inner **tube** of oil-resistant rubber (nitrile for mineral oils), a **reinforcement** that carries the pressure, and a **cover** that resists abrasion, ozone and weather. The reinforcement decides the rating:

| Construction | Typical standards | Use |
|---|---|---|
| textile braid | SAE 100R6, EN 854 | return and low-pressure lines |
| one or two steel-wire braids | SAE 100R1 and 100R2, EN 853 1SN/2SN; compact EN 857 1SC/2SC | general pressure lines, roughly 150–400 bar depending on bore |
| four or six steel-wire spirals | SAE 100R12, R13, R15; EN 856 4SP/4SH | high pressure with severe pressure pulses: excavators, presses |

Across these families the **minimum burst pressure is four times the maximum working pressure**. That design factor of 4 covers pressure peaks, ageing and fatigue; it is not an invitation to run a hose at twice its rating. Each hose also has a **minimum bend radius** and a temperature range, and its life falls steeply near the hot end.

Hoses fail mostly by fatigue at the fitting, abrasion, kinking and twisting. Good routing leaves a little slack, because a hose changes length under pressure (by up to about +2 % and −4 %); never twists a hose, because pressure pulses then try to untwist it and fatigue the wire; keeps bends no tighter than the minimum radius, clear of sharp edges and hot surfaces; and clamps long runs. Many guidelines also limit the service life — for example six years from manufacture, including storage — even for a hose that looks sound.

### Tubes
Rigid lines are cold-drawn **seamless precision steel tube** (EN 10305-4), designated by outside diameter × wall, e.g. 20 × 2.5. The wall follows from Barlow's thin-wall formula,
$$t = \\frac{p\\,D}{2S}$$
with an allowable stress $S$ that contains the safety margin for pulsating pressure; tube makers tabulate the working pressure of each size. Tubes are cheaper, neater, stiffer and longer-lived than hoses, but must be supported against vibration and are best bent rather than welded.

### Fittings
| Type | Standard | How it seals |
|---|---|---|
| 24° cone, cutting ring or O-ring cone | ISO 8434-1 (formerly DIN 2353) | ring bites into the tube; the O-ring version seals elastically |
| 37° flare (JIC) | ISO 8434-2, SAE J514 | metal-to-metal on the flared tube end |
| O-ring face seal (ORFS) | ISO 8434-3, SAE J1453 | O-ring in a flat face: very tight under high pressure and vibration |
| four-bolt flange | ISO 6162 (SAE J518, codes 61 and 62) | O-ring in the flange face; for large bores |
| port connections | ISO 1179 (BSPP), ISO 6149 (metric), ISO 11926 (UNF) | O-ring or bonded seal at the port, not in the thread |

Tapered pipe threads (NPT, BSPT) seal on the thread itself, can crack castings when over-tightened and are best kept out of hydraulic circuits.

> [!warn] Never tighten, loosen or touch a fitting on a pressurised line: stop the machine, release the pressure, discharge accumulators, support loads and lock out first. A hose that blows off its fitting whips with lethal force — fit restraints where people are near. Never feel for a leak with a hand: pass a piece of card along the line. An oil-injection injury looks like a pinprick but is a surgical emergency — seek emergency medical care at once.
`,
  ideas: [
    'Hoses go where parts move, rigid tubes everywhere else.',
    'Hose reinforcement — textile, wire braid or wire spiral — sets the rating; burst pressure is at least four times the working pressure.',
    'Routing matters: slack for length change, no twist, no tighter than the minimum bend radius, no rubbing.',
    'Tube walls follow Barlow\'s formula t = pD/(2S); makers tabulate working pressures.',
    'Fittings seal on cones, flares, O-ring faces or flanges; ports seal with O-rings, not threads.'
  ],
  pitfalls: [
    'A hose with a burst pressure of 1000 bar can run at 500 bar — The rating is the working pressure (250 bar here). The factor of 4 is consumed by pressure peaks, fatigue and ageing.',
    'A twist in a hose does not matter as long as it does not leak — Pressure pulses act to untwist it, fatiguing the reinforcement and loosening fittings; twisted hoses fail far sooner.',
    'A weeping fitting can be tightened a little while the machine runs — Never: working on a pressurised fitting risks injection injuries and a blown-off hose. Depressurise and lock out first.'
  ],
  formulas: [
    {
      name: 'Barlow\'s formula for a tube wall',
      expr: 't = p*D/(2*S)', tex: 't = \\dfrac{p\\,D}{2S}',
      vars: {
        t: { name: 'wall thickness', q: 'length', unit: 'mm' },
        p: { name: 'design pressure (gauge)', q: 'pressure', unit: 'bar', value: 315 },
        D: { name: 'outside diameter', q: 'length', unit: 'mm', value: 20 },
        S: { name: 'allowable stress of the tube material', q: 'stress', unit: 'MPa', value: 150 }
      },
      note: 'Thin-wall approximation with the outside diameter (conservative). S includes the safety margin; for pulsating pressure it is well below the yield strength. Catalogue ratings are the authority.',
      practice: { unknowns: ['t', 'p'] },
      stories: { t: 'A steel tube of {D} outside diameter must carry {p} with an allowable stress of {S}. What wall thickness does it need?', p: 'A tube of {D} with a {t} wall has an allowable stress of {S}. What pressure may it carry?' }
    },
    {
      name: 'Burst pressure and design factor',
      expr: 'pb = SF*pw', tex: 'p_b = S_F\\,p_w',
      vars: {
        pb: { name: 'minimum burst pressure', q: 'pressure', unit: 'bar', tex: 'p_b' },
        SF: { name: 'design factor (4 for hydraulic hose)', value: 4, tex: 'S_F' },
        pw: { name: 'maximum working pressure (gauge)', q: 'pressure', unit: 'bar', value: 250, tex: 'p_w' }
      },
      note: 'The working pressure must cover the system\'s peaks, not only the relief setting.',
      stories: { pb: 'A hose is rated for {pw} with a design factor of {SF}. What is its minimum burst pressure?', pw: 'A hose has a minimum burst pressure of {pb} and a design factor of {SF}. What is its maximum working pressure?' }
    }
  ],
  examples: [
    {
      title: 'Choosing a tube wall',
      q: 'A pressure line of 20 mm outside diameter must carry 315 bar. Taking an allowable stress of 150 MPa for pulsating service (an illustrative value), what wall is needed, and what is the flow area?',
      steps: [
        '$t = pD/(2S) = 3.15\\times10^7 \\times 0.020/(2 \\times 1.5\\times10^8) = 2.1\\times10^{-3}$ m = 2.1 mm.',
        'The next standard wall is 2.5 mm: tube 20 × 2.5, bore 15 mm.',
        'Flow area $\\pi \\times 15^2/4 = 177$ mm². At 5 m/s it carries $5 \\times 1.77\\times10^{-4} = 8.8\\times10^{-4}$ m³/s = 53 L/min (see [[line-sizing]]).'
      ],
      a: '2.1 mm by Barlow; a 20 × 2.5 tube (15 mm bore), good for about 53 L/min at 5 m/s.'
    },
    {
      title: 'Rating a hose for the real pressure',
      q: 'A system relief valve is set at 250 bar, but a pressure recording shows peaks of 320 bar when a directional valve closes. Which working pressure must the hose be rated for, and what burst pressure does that imply?',
      steps: [
        'The hose must be rated for the highest pressure it sees in service, including peaks: 320 bar, not 250 bar.',
        'Minimum burst pressure $4 \\times 320 = 1280$ bar.',
        'A two-braid hose of small bore may qualify; larger bores need a four-spiral hose — and the peaks themselves deserve attention (softer valve switching, see [[water-hammer]]).'
      ],
      a: 'Rate it for at least 320 bar (burst ≥ 1280 bar), and look at why the peaks occur.'
    }
  ],
  quiz: [
    { q: 'For hydraulic hoses, the minimum burst pressure is how many times the maximum working pressure?', answer: 4, tol: 0.01,
      why: 'SAE J517 and the EN 853–857 hoses use a design factor of 4:1 between minimum burst and maximum working pressure.' },
    { q: 'Which fitting seals with an O-ring held in a flat face?', choices: ['24° cone with cutting ring', '37° flare (JIC)', 'O-ring face seal (ORFS)', 'NPT tapered thread'], a: 2,
      why: 'ORFS fittings clamp an O-ring in a groove of a flat face: a soft seal that stays tight under high pressure and vibration.' },
    { q: 'How should you look for a suspected pinhole leak on a pressurised hose?', choices: ['run a hand along the hose', 'pass a piece of card or wood along it, keeping clear', 'squeeze the hose to hear it', 'tighten every fitting until it stops'], a: 1,
      why: 'Oil from a pinhole at high pressure can inject through skin. A card shows the jet safely; better still, depressurise and inspect.' },
    { q: 'A hose rated for 250 bar can safely run at 500 bar because its burst pressure is 1000 bar.', a: false,
      why: 'The working pressure is the limit. The factor of 4 is there for peaks, fatigue from millions of cycles and ageing — not for extra working pressure.' },
    { q: 'Why leave a little slack in a straight hose run between two fixed fittings?', choices: ['so it looks tidy', 'because a hose changes length under pressure (up to about −4 %) and must not be pulled taut', 'to increase the flow', 'to reduce the bend radius'], a: 1,
      why: 'A hose shortens (or lengthens slightly) under pressure. A taut hose is pulled at its fittings, which is where fatigue failures start.' }
  ],
  problems: [
    { q: 'A 25 × 3 steel tube has an allowable stress of 140 MPa. What pressure may it carry by Barlow\'s formula, in bar?', answer: 336, unit: 'bar', tol: 0.02,
      steps: ['$p = 2St/D = 2 \\times 1.4\\times10^8 \\times 0.003/0.025 = 3.36\\times10^7$ Pa = 336 bar.'] }
  ],
  applications: ['Excavator booms and arms: four- and six-spiral hoses to the cylinders, tubes along the steel.', 'Machine tools and presses: steel tube with 24° cone fittings on manifolds.', 'Aircraft: stainless and titanium tubes with flared or swaged fittings, PTFE hoses in hot areas.', 'Agricultural implements: quick couplings on hoses between tractor and implement.'],
  history: 'The 37° flare fitting descends from the AN (Army–Navy) fittings standardised for aircraft in the 1940s; the US Joint Industry Conference adopted it for industrial machinery, which is why it is still called JIC.'
},

{
  id: 'line-sizing', parent: 'components-sizing', title: 'Sizing lines', level: 2,
  short: 'Hydraulic lines are sized by the speed of the oil: slow in suction lines so the pump never starves, faster in return lines, fastest in pressure lines — then checked for pressure drop, heat and the pressure rating of the tube or hose.',
  keywords: ['line sizing', 'pipe sizing', 'hose size', 'flow velocity', 'suction line', 'return line', 'pressure line', 'drain line', 'recommended velocity', 'pressure drop', 'laminar flow', 'Hagen-Poiseuille', 'Reynolds number', 'inside diameter'],
  prereq: ['flow-rate', 'laminar-pipe-flow', 'reynolds-number-pipes', 'darcy-weisbach'],
  related: ['hoses-fittings', 'pipe-sizing', 'minor-losses', 'viscosity-temperature', 'area-ratio', 'cavitation', 'heat-coolers'],
  body: `
A line that is too small costs pressure and heat all its working life; a line that is too large costs money, space and weight, and holds more oil. Hydraulic designers settle the question the practical way: they choose a **flow velocity** for each kind of line and size the bore from continuity (see [[flow-rate]]):
$$d = \\sqrt{\\frac{4Q}{\\pi v}} \\qquad\\text{or, handily,}\\qquad d\\,[\\text{mm}] = 4.61\\sqrt{\\frac{Q\\,[\\text{L/min}]}{v\\,[\\text{m/s}]}}$$

### Recommended velocities
| Line | Velocity | Why |
|---|---|---|
| Suction | 0.5–1.2 m/s (1 m/s or less is safest) | the pump inlet has at most about 1 bar to work with; losses there cause [[cavitation]] |
| Return | 2–4 m/s | low pressure, but back-pressure costs force and heats the oil |
| Pressure, up to 100 bar | 3–4.5 m/s | the pressure drop is a small fraction of the pressure |
| Pressure, 100–350 bar | 4.5–6 m/s | a higher pressure tolerates a larger drop |
| Case drains, pilot lines | 1–2 m/s | drain pressure must stay near zero to protect shaft seals |

The flow in a line is not always the pump flow. The cap-end line of a cylinder with an area ratio of 2 carries **twice** the pump flow while the rod retracts (see [[area-ratio]]), and a regenerative circuit or an accumulator can multiply it too. Size each line for its own largest flow.

### Checking the pressure drop
Hydraulic oil is viscous, so many lines run in **laminar** flow: at 5 m/s in a 16 mm bore with oil of 46 mm²/s, $Re = vd/\\nu = 1740$. The loss then follows Hagen–Poiseuille (see [[laminar-pipe-flow]]):
$$\\Delta p = \\frac{128\\,\\mu L Q}{\\pi d^4}$$
It is proportional to the viscosity, which climbs steeply in the cold: the same line loses more than five times as much at 10 °C as at 40 °C. Above $Re \\approx 2300$ use [[darcy-weisbach|Darcy–Weisbach]] with the turbulent friction factor, and add the [[minor-losses]] of bends, fittings and valves — in compact hydraulic circuits they often exceed the straight-line losses. The fourth power of $d$ is the designer's lever: one size up in bore, say from 16 to 20 mm, cuts a laminar loss by a factor of 2.4. The [pipe calculator](#/tools/hydro/pipe) and the [oil viscosity tool](#/tools/fpower/oil) help with the numbers.

### From bore to part number
With the bore chosen, pick the nearest hose or tube whose inside diameter is at least as large and whose rated pressure covers the highest working pressure including peaks (see [[hoses-fittings]]). A 60 L/min, 210 bar system might end up with:
- a **pressure line** at 5 m/s: 16 mm bore — tube 20 × 2, or a DN 16 two-braid hose;
- a **return line** at 3 m/s: 21 mm bore for 60 L/min (tube 25 × 2), but 29 mm (tube 35 × 3) if a 2:1 cylinder sends 120 L/min back;
- a **suction line** at 0.8 m/s: 40 mm bore — a 1½ in suction hose (38 mm, 0.9 m/s), short and straight, with nothing finer than a coarse strainer in it.

> [!key] Be generous with suction lines and case drains, sensible with returns, and let the pressure lines be the fast ones. A starved pump inlet destroys a pump in hours; a slightly large pressure line costs only a little money.
`,
  ideas: [
    'Choose a velocity for each kind of line, then d = √(4Q/πv).',
    'Suction ≈ 1 m/s or less, return 2–4 m/s, pressure 3–6 m/s depending on the pressure.',
    'Size each line for its own largest flow — cylinder area ratios can make return flows larger than the pump flow.',
    'Oil lines are often laminar; the pressure drop then scales with viscosity and with 1/d⁴.',
    'Check the pressure rating of the chosen tube or hose, including peaks.'
  ],
  pitfalls: [
    'Every line carries the pump flow — A differential cylinder returns A₁/A₂ times the pump flow from its cap end while retracting; regeneration and accumulators raise flows too.',
    'The pressure line matters most because its pressure is highest — The suction line is the most critical: the pump has less than one bar of atmospheric pressure to fill its chambers.',
    'A line sized for warm oil is fine at start-up — At 0 °C a VG 46 oil is more than ten times as viscous as at 40 °C; laminar losses rise in proportion and a suction line can starve the pump.'
  ],
  formulas: [
    {
      name: 'Bore for a chosen velocity',
      expr: 'd = sqrt(4*Q/(pi*v))', tex: 'd = \\sqrt{\\dfrac{4Q}{\\pi v}}',
      vars: {
        d: { name: 'inside diameter', q: 'length', unit: 'mm' },
        Q: { name: 'flow in the line', q: 'flowrate', unit: 'L/min', value: 60 },
        v: { name: 'chosen flow velocity', q: 'speed', unit: 'm/s', value: 5 }
      },
      note: 'In working units: d (mm) = 4.61 √(Q (L/min) / v (m/s)).',
      stories: { d: 'A pressure line must carry {Q} at no more than {v}. What bore does it need?', v: 'A line of {d} bore carries {Q}. What is the flow velocity?', Q: 'A {d} suction line must keep the velocity below {v}. What is the largest flow it can carry?' }
    },
    {
      name: 'Reynolds number in a hydraulic line',
      expr: 'Re = v*d/nu', tex: '\\mathrm{Re} = \\dfrac{v\\,d}{\\nu}',
      vars: {
        Re: { name: 'Reynolds number', tex: '\\mathrm{Re}' },
        v: { name: 'flow velocity', q: 'speed', unit: 'm/s', value: 5 },
        d: { name: 'inside diameter', q: 'length', unit: 'mm', value: 16 },
        nu: { name: 'kinematic viscosity of the oil', q: 'kinvisc', unit: 'mm²/s', value: 46, tex: '\\nu' }
      },
      note: 'Below about 2300 the flow is laminar; above about 4000, turbulent.',
      stories: { Re: 'Oil of {nu} flows at {v} in a {d} bore. What is the Reynolds number?' }
    },
    {
      name: 'Laminar pressure drop (Hagen–Poiseuille)',
      expr: 'dp = 128*mu*L*Q/(pi*d^4)', tex: '\\Delta p = \\dfrac{128\\,\\mu L Q}{\\pi d^4}',
      vars: {
        dp: { name: 'pressure drop', q: 'pressure', unit: 'bar', tex: '\\Delta p' },
        mu: { name: 'dynamic viscosity of the oil', q: 'viscosity', unit: 'mPa·s', value: 40, tex: '\\mu' },
        L: { name: 'line length', q: 'length', unit: 'm', value: 5 },
        Q: { name: 'flow', q: 'flowrate', unit: 'L/min', value: 60 },
        d: { name: 'inside diameter', q: 'length', unit: 'mm', value: 16 }
      },
      note: 'Straight line, laminar flow (Re below about 2300). Dynamic viscosity = kinematic viscosity × density (46 mm²/s × 870 kg/m³ ≈ 40 mPa·s).',
      practice: { unknowns: ['dp', 'd'] },
      stories: { dp: 'Oil with a viscosity of {mu} flows at {Q} through {L} of line with a {d} bore. What is the pressure drop?', d: 'A {L} line may lose only {dp} with {Q} of oil at {mu}. What bore does it need?' }
    }
  ],
  examples: [
    {
      title: 'Lines for a 60 L/min power unit',
      q: 'Size the pressure, return and suction lines for a 60 L/min pump working at 210 bar, driving a cylinder with an area ratio of 2.',
      steps: [
        'Pressure line at 5 m/s: $d = 4.61\\sqrt{60/5} = 16.0$ mm → tube 20 × 2 (bore 16 mm).',
        'Return line: while retracting, the cap end returns $2 \\times 60 = 120$ L/min. At 3 m/s: $d = 4.61\\sqrt{120/3} = 29.2$ mm → tube 35 × 3 (bore 29 mm).',
        'Suction line at 0.8 m/s: $d = 4.61\\sqrt{60/0.8} = 39.9$ mm → a 1½ in (38 mm) suction hose, $v = 0.88$ m/s.',
        'Check the pressure line: $Re = 5 \\times 0.016/46\\times10^{-6} = 1740$ (laminar); over 5 m, $\\Delta p = 128 \\times 0.040 \\times 5 \\times 10^{-3}/(\\pi \\times 0.016^4) = 1.24$ bar.'
      ],
      a: '20 × 2 pressure tube, 35 × 3 return tube, 38 mm suction hose; about 1.2 bar lost in 5 m of pressure line with warm oil.'
    },
    {
      title: 'A cold start',
      q: 'The same 5 m pressure line (16 mm bore, 60 L/min) at 0 °C, where the VG 46 oil has about 570 mm²/s (500 mPa·s). What is the drop now?',
      steps: [
        '$Re = 5 \\times 0.016/570\\times10^{-6} = 140$ — strongly laminar.',
        '$\\Delta p = 1.24 \\times 500/40 = 15.5$ bar — twelve times the warm value.',
        'In the suction line the same factor can take the inlet below the pump\'s limit: that is why cold starts are made at low speed and pressure, and suction lines are sized generously.'
      ],
      a: 'About 15.5 bar instead of 1.2 bar.'
    }
  ],
  quiz: [
    { q: 'Which line gets the lowest flow velocity?', choices: ['pressure line', 'return line', 'suction line', 'they are all the same'], a: 2,
      why: 'The pump inlet has at most about one bar of atmospheric pressure to push oil in; suction losses must be tiny, so the velocity is kept at about 1 m/s or less.' },
    { q: 'What bore does a line carrying 100 L/min at 4 m/s need, in mm?', answer: 23, unit: 'mm', tol: 0.02,
      why: 'd = 4.61 √(100/4) = 4.61 × 5 = 23 mm.' },
    { q: 'In laminar flow, halving the bore at the same flow multiplies the pressure drop by…', choices: ['2', '4', '8', '16'], a: 3,
      why: 'Hagen–Poiseuille: Δp ∝ Q/d⁴. Half the diameter gives 2⁴ = 16 times the drop.' },
    { q: 'The return line from the cap end of a cylinder always carries the pump flow.', a: false,
      why: 'While the rod retracts the cap end returns A₁/A₂ times the pump flow — twice as much for a 2:1 cylinder.' },
    { q: 'Oil of 46 mm²/s flows at 5 m/s through a 16 mm bore. The flow is…', choices: ['laminar (Re ≈ 1700)', 'turbulent (Re ≈ 17 000)', 'critical (Re ≈ 2300)', 'supersonic'], a: 0,
      why: 'Re = vd/ν = 5 × 0.016/46×10⁻⁶ ≈ 1740, below 2300. Viscous oils often flow laminar where water would be turbulent.' }
  ],
  problems: [
    { q: 'Oil of 32 mm²/s flows at 80 L/min through a 20 mm bore. What is the Reynolds number?', answer: 2650, tol: 0.02,
      steps: ['$v = Q/A = (80/60\\,000)/(\\pi \\times 0.02^2/4) = 4.24$ m/s.', '$Re = vd/\\nu = 4.24 \\times 0.02/32\\times10^{-6} = 2650$ — in the critical zone between laminar and turbulent.'] }
  ],
  applications: ['Power-unit design: pressure, return, drain and suction lines from one velocity table.', 'Mobile machines, where hose bores are chosen for flow, pressure rating and bend radius together.', 'Retrofitting a larger pump: checking that existing lines, especially the suction, still suit the new flow.', 'Cold-climate machines, where lines are sized for the viscosity at start-up.']
},

{
  id: 'heat-coolers', parent: 'components-sizing', title: 'Heat balance and coolers', level: 2,
  short: 'Every watt a hydraulic system loses — across relief valves and throttles, in pumps, motors and lines — ends up as heat in the oil. The oil settles where the heat coming in equals the heat leaving through the tank walls and the cooler; designers size the cooler to keep that balance below about 60 °C.',
  keywords: ['heat balance', 'oil temperature', 'oil cooler', 'air-oil cooler', 'water-oil cooler', 'heat exchanger', 'heat load', 'heat dissipation', 'reservoir cooling', 'thermostatic bypass', 'oil ageing', 'temperature rise', 'throttling heat', 'specific cooling power'],
  prereq: ['energy-losses-heat', 'physics:specific-heat', 'physics:heat-transfer'],
  related: ['reservoirs', 'viscosity-temperature', 'open-closed-centre', 'load-sensing', 'hydraulic-oils', 'physics:newtons-law-of-cooling', 'math:exponential-models'],
  body: `
Hydraulic power that does no useful work does not vanish: it heats the oil. A pump at 85 % efficiency, a relief valve passing flow, a throttle metering a cylinder, the friction in the lines — every loss becomes heat, and the oil carries it back to the tank. The **heat load** is simply
$$P_h = P_\\text{in}\\,(1 - \\eta)$$
For industrial systems designers often start from a heat load of 20–30 % of the installed power; a system that spends much of its time over a relief valve or throttling flow can reach 50 % or more.

### Heat from throttling
Oil that drops through a pressure difference $\\Delta p$ without doing work — across a relief valve, a flow control or a worn seal — keeps the energy as heat:
$$\\Delta T = \\frac{\\Delta p}{\\rho\\,c}$$
With $\\rho = 870$ kg/m³ and $c \\approx 1.9$ kJ/(kg·K) that is about **6 K per 100 bar**. Oil crossing a relief valve set at 250 bar leaves it some 15 K hotter — and a leaking valve or a bypassing cylinder seal often shows up on an infrared thermometer as a hot spot.

### Where the heat goes
- **The reservoir walls.** Natural convection and radiation carry away $P = kA\\,\\Delta T$, with $k \\approx$ 10–15 W/(m²·K) in still air and more with a fan or a breeze. A 250 L tank has about 2.4 m² of surface: at 30 K above the room it sheds under 1 kW. Pipes and components add a little.
- **A cooler**, when that is not enough — which for industrial units above a few kilowatts is nearly always. An **air-oil** cooler, a finned radiator with a fan, is rated by its **specific cooling power** $P_{01}$ in kW per kelvin of difference between the oil entering and the air entering: $P_c = P_{01}(T_o - T_a)$. A **water-oil** cooler (shell-and-tube or plate) is more compact where cooling water is available.

### The temperature it settles at
With a heat load $P_h$ and dissipation that grows with the temperature difference, the oil approaches
$$T_\\infty = T_a + \\frac{P_h}{kA + P_{01}}$$
exponentially, with a time constant $\\tau = C/(kA + P_{01})$, where $C$ is the heat capacity of the oil and steel. For a 250 L tank without a cooler, $C \\approx 0.5$ MJ/K and $\\tau$ is several hours — which is why a system can seem fine in the morning and overheat in the afternoon (see [[math:exponential-models|exponential models]]).

### Why 60 °C matters
Mineral oils are usually run at 40–60 °C. Hotter, the viscosity falls (pump leakage rises and lubricating films thin — see [[viscosity-temperature]]), seals harden, and the oil oxidises faster: a common rule says **oil life halves for every 10 °C above about 60 °C**. A **thermostatic bypass** sends the oil round the cooler while it is cold, so the system warms up quickly and the cooler is not strained by thick oil. The best cure, though, is to make less heat: unload pumps while waiting, match pump pressure to the load ([[load-sensing]]) and avoid throttling.

> [!warn] Oil above about 60 °C can scald, and pumps, valves and coolers can be hot enough to burn: let the machine cool before work, and wear gloves and eye protection. Coolers usually sit in the return line and see its pressure peaks; protect them with a bypass check valve.
`,
  ideas: [
    'All lost hydraulic power becomes heat: P_h = P_in (1 − η).',
    'Throttling heats oil by about 6 K per 100 bar of pressure drop.',
    'A reservoir alone sheds only kA·ΔT — under 1 kW for a 250 L tank at 30 K above ambient.',
    'Coolers are rated by specific cooling power P₀₁ in kW per kelvin between oil and cooling-air inlets.',
    'The oil approaches T_a + P_h/(kA + P₀₁) with a time constant of the heat capacity over the dissipation — hours for a big tank.'
  ],
  pitfalls: [
    'A big reservoir can replace a cooler — A tank sheds only a few hundred watts per square metre at practical temperatures; a large tank mainly delays the rise (a long time constant), it does not lower the final temperature much.',
    'Heat comes from the cooler being too small — It comes from losses. Unloading pumps, load sensing and avoiding throttles remove heat at its source, which is cheaper than cooling it.',
    'Hot oil is only a comfort problem — Above about 60 °C mineral oil ages quickly, viscosity falls, leakage rises and seals harden: machine life suffers.'
  ],
  formulas: [
    {
      name: 'Heat load from the efficiency',
      expr: 'Ph = Pin*(1 - eta)', tex: 'P_h = P_\\text{in}\\,(1 - \\eta)',
      vars: {
        Ph: { name: 'heat into the oil', q: 'power', unit: 'kW', tex: 'P_h' },
        Pin: { name: 'input power', q: 'power', unit: 'kW', value: 30, tex: 'P_\\text{in}' },
        eta: { name: 'overall efficiency of the system', q: 'ratio', unit: '%', value: 70, tex: '\\eta' }
      },
      note: 'Averaged over the duty cycle. Without better data, 20–30 % of the installed power is a common starting estimate.',
      stories: { Ph: 'A {Pin} hydraulic system works with an overall efficiency of {eta}. How much heat goes into the oil?' }
    },
    {
      name: 'Temperature rise of throttled oil',
      expr: 'dT = dp/(rho*c)', tex: '\\Delta T = \\dfrac{\\Delta p}{\\rho\\,c}',
      vars: {
        dT: { name: 'temperature rise of the oil', q: 'dtemp', unit: 'K', tex: '\\Delta T' },
        dp: { name: 'pressure drop without useful work', q: 'pressure', unit: 'bar', value: 100, tex: '\\Delta p' },
        rho: { name: 'oil density', q: 'density', unit: 'kg/m³', value: 870, tex: '\\rho' },
        c: { name: 'specific heat of the oil', q: 'specificheat', unit: 'kJ/(kg·K)', value: 1.88 }
      },
      note: 'Across a relief valve, throttle or leak, if no heat escapes on the way. About 6 K per 100 bar for mineral oil.',
      stories: { dT: 'Oil ({rho}, {c}) drops through {dp} across a relief valve. How much hotter is it afterwards?' }
    },
    {
      name: 'Heat given off by the reservoir',
      expr: 'P = k*A*dT', tex: 'P = k A\\,\\Delta T',
      vars: {
        P: { name: 'heat shed by the tank walls', q: 'power', unit: 'W' },
        k: { name: 'heat-transfer coefficient (still air ≈ 10–15)', q: 'heattransfer', unit: 'W/(m²·K)', value: 12 },
        A: { name: 'effective surface area of the tank', q: 'area', unit: 'm²', value: 2.4 },
        dT: { name: 'oil temperature above ambient', q: 'dtemp', unit: 'K', value: 30, tex: '\\Delta T' }
      },
      note: 'A box-shaped tank of volume V has roughly A ≈ 6 V^(2/3) of surface (V in m³, A in m²), not all of it well cooled.',
      stories: { P: 'A tank with {A} of surface stands in still air ({k}). How much heat does it shed with the oil {dT} above ambient?', A: 'A tank must shed {P} at {dT} above ambient with {k}. How much surface does it need?' }
    },
    {
      name: 'Cooling power of an oil cooler',
      expr: 'Pc = P01*(To - Ta)', tex: 'P_c = P_{01}\\,(T_o - T_a)',
      vars: {
        Pc: { name: 'cooling power', q: false, unit: 'kW', tex: 'P_c' },
        P01: { name: 'specific cooling power of the cooler', q: false, unit: 'kW/K', value: 0.3, tex: 'P_{01}' },
        To: { name: 'oil inlet temperature', q: false, unit: '°C', value: 55, signed: true, tex: 'T_o' },
        Ta: { name: 'cooling-air (or water) inlet temperature', q: false, unit: '°C', value: 25, signed: true, tex: 'T_a' }
      },
      note: 'P₀₁ from the maker\'s data at the actual oil flow and fan speed. Size for the hottest ambient day.',
      stories: { Pc: 'A cooler rated at {P01} receives oil at {To} and air at {Ta}. How much heat does it remove?', P01: 'A cooler must remove {Pc} with oil entering at {To} and air at {Ta}. What specific cooling power does it need?' }
    }
  ],
  examples: [
    {
      title: 'Does this power unit need a cooler?',
      q: 'A 30 kW power unit runs with an overall efficiency of 70 %. Its 250 L tank has 2.4 m² of surface ($k = 12$ W/(m²·K)); the workshop reaches 25 °C and the oil should stay at 55 °C. Size the cooler.',
      steps: [
        'Heat load: $P_h = 30 \\times (1 - 0.70) = 9$ kW.',
        'Tank at 30 K above ambient: $12 \\times 2.4 \\times 30 = 864$ W.',
        'Without a cooler the oil would head for $25 + 9000/28.8 = 337$ °C — long before which it would be ruined.',
        'The cooler must remove $9 - 0.86 = 8.1$ kW at $55 - 25 = 30$ K: $P_{01} \\ge 8.1/30 = 0.27$ kW/K. A 0.35 kW/K cooler gives margin for fouling and hot days.'
      ],
      a: 'Yes: about 0.27 kW/K at least; choose around 0.35 kW/K.'
    },
    {
      title: 'How fast it warms up',
      q: 'The same unit holds 250 L of oil (870 kg/m³, 1.88 kJ/(kg·K)) in 200 kg of steel (0.46 kJ/(kg·K)). How fast does it warm at first, and what is its time constant with the 0.35 kW/K cooler working?',
      steps: [
        'Heat capacity: $C = 217.5 \\times 1.88 + 200 \\times 0.46 = 409 + 92 = 501$ kJ/K.',
        'Initial warming: $9/501 = 0.018$ K/s, about 1.1 K per minute.',
        'Time constant: $\\tau = 501/(0.029 + 0.35) = 1320$ s, about 22 minutes. Final temperature $25 + 9/0.379 = 49$ °C.',
        'Without the cooler, $\\tau = 501/0.029 = 17\\,400$ s — nearly 5 hours of steady climbing.'
      ],
      a: 'About 1 K per minute at first; with the cooler it settles near 49 °C within an hour or so (τ ≈ 22 min).'
    }
  ],
  quiz: [
    { q: 'A relief valve passes 40 L/min at 200 bar. How much heat does it make, in kW?', answer: 13.3, unit: 'kW', tol: 0.02,
      why: 'P = p·Q = 200 × 40/600 = 13.3 kW — none of it useful.' },
    { q: 'Oil throttled through 100 bar without doing work heats by about…', choices: ['0.6 K', '6 K', '60 K', '600 K'], a: 1,
      why: 'ΔT = Δp/(ρc) = 10⁷/(870 × 1880) ≈ 6 K.' },
    { q: 'A reservoir without a cooler can usually remove the heat of a 20 kW industrial power unit.', a: false,
      why: 'With 20–30 % losses the heat load is 4–6 kW; a tank of a few hundred litres sheds only about 1 kW at a sensible oil temperature.' },
    { q: 'Why is a thermostatic bypass fitted around an oil cooler?', choices: ['to cool the oil faster', 'so cold, thick oil bypasses the cooler: the system warms up quickly and the cooler is not overstressed', 'to filter the oil', 'to save fan power only'], a: 1,
      why: 'Below its opening temperature the bypass sends the oil round the cooler, avoiding high pressure drops with cold oil and letting the system reach its working temperature sooner.' },
    { q: 'By the common rule, running mineral oil at 80 °C instead of 60 °C shortens its life to about…', choices: ['a half', 'a quarter', 'a tenth', 'no change'], a: 1,
      why: 'Halving per 10 °C: two halvings, so about a quarter of the life.' }
  ],
  problems: [
    { q: 'An air-oil cooler with a specific cooling power of 0.5 kW/K receives oil at 50 °C and air at 30 °C. How much heat does it remove, in kW?', answer: 10, unit: 'kW', tol: 0.02,
      steps: ['$P_c = P_{01}(T_o - T_a) = 0.5 \\times (50 - 30) = 10$ kW.'] },
    { q: 'A 12 kW heat load is removed by a tank ($kA = 30$ W/K) and a cooler of 0.4 kW/K. At what temperature above ambient does the oil settle, in K?', answer: 27.9, unit: 'K', tol: 0.02,
      steps: ['$\\Delta T_\\infty = P_h/(kA + P_{01}) = 12\\,000/(30 + 400) = 27.9$ K.'] }
  ],
  applications: ['Industrial power units with air-oil coolers on the return line or in a separate cooling and filtration loop.', 'Mobile machines, whose oil cooler sits in the radiator stack beside the engine\'s.', 'Presses and test rigs with water-oil plate coolers and temperature control.', 'Hydrostatic transmissions, which flush hot oil from the loop through a cooler.'],
  sim: 'sys-heat'
}

);
