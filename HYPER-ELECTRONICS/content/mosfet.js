/* HYPER-ELECTRONICS · content/mosfet.js — MOSFETs: how they work, how to use them as
 * switches, and what driving the gate costs. */
Hyper.add(

{
  id: 'mosfet-operation', parent: 'mosfet', title: 'How a MOSFET works', level: 2,
  short: 'A voltage on an insulated gate draws a thin conducting channel between source and drain: no steady gate current, a threshold below which nothing flows, and above it a resistance that falls as the gate voltage rises.',
  keywords: ['MOSFET', 'field-effect transistor', 'FET', 'enhancement mode', 'n-channel', 'p-channel', 'threshold voltage', 'Vgs(th)', 'Rds(on)', 'ohmic region', 'triode region', 'saturation region', 'square law', 'body diode', 'gate oxide', 'logic level', '2N7000', 'IRLZ44N'],
  prereq: ['semiconductor-basics', 'capacitors', 'physics:semiconductors', 'math:power-functions'],
  related: ['bjt-operation', 'mosfet-switch', 'gate-drive', 'cmos-logic'],
  body: `
A **MOSFET** (metal–oxide–semiconductor field-effect transistor) controls current with an electric field instead of a base current. In the common **n-channel enhancement** type, two n-type regions — the **source** and the **drain** — are set into a p-type **body**. Between them, on top, lies the **gate**: a conductor separated from the silicon by a layer of oxide a few nanometres to a few tens of nanometres thick. Gate and body form a [[capacitors|capacitor]].

With the gate at the source's potential, source and drain are separated by p-type silicon — two back-to-back junctions — and no current flows. Raise the gate voltage and its positive charge repels holes from the surface and attracts electrons. Past the **threshold voltage** $V_{th}$ (typically 1–4 V for power parts) so many electrons gather under the oxide that the surface turns n-type: an **inversion layer** forms a channel from source to drain. The further the gate voltage exceeds the threshold — the **overdrive** $V_{GS} - V_{th}$ — the more electrons, and the lower the resistance.

### Two regions of operation
- **Ohmic (or triode) region**, small $V_{DS}$: the channel acts as a resistor controlled by the gate,
$$R_{DS} \\approx \\frac{1}{k\\,(V_{GS} - V_{th})}$$
This is how a MOSFET works as a **switch**. Driven hard, the channel resistance $R_{DS(on)}$ of a power MOSFET is a few milliohms to a few tens of milliohms.
- **Saturation region**, $V_{DS} > V_{GS} - V_{th}$: the channel pinches off at the drain end and the current stops growing with $V_{DS}$. It then depends on the gate alone, by the **square law**
$$I_D = \\frac{k}{2}(V_{GS} - V_{th})^2$$
This is the region for amplifiers and current sources. Confusingly, it corresponds to the BJT's *active* region, not to BJT saturation.

$k$ is a device constant set by the channel's width, length and oxide. The **transconductance** is $g_m = k(V_{GS} - V_{th}) = \\sqrt{2kI_D}$. At the same current a MOSFET has a far lower $g_m$ than a BJT ($I_C/V_T$) — one reason BJTs still win in low-noise, high-gain analogue stages. The square law is itself only an approximation for power MOSFETs, whose short channels bend the curves, but it gets the trends right.

### Reading the datasheet
- **$V_{GS(th)}$** is quoted at a tiny current, often 250 µA. At the threshold the MOSFET is barely on; switching amperes takes several volts more. Look instead for $R_{DS(on)}$ specified *at the gate voltage you actually have*. A **logic-level** part such as the IRLZ44N is specified at 4–5 V (about 25 mΩ at 5 V); a standard part such as the IRF540N only at 10 V (44 mΩ).
- **Gate capacitance and charge** ($C_{iss}$ of 1–3 nF and $Q_g$ of 20–100 nC for power parts): no steady current flows into the gate, but every switching edge must charge it (see [[gate-drive]]).
- **The body diode**: the body is tied to the source inside the package, which leaves a diode from source to drain. A MOSFET therefore blocks voltage in one direction only, and the diode conducts whenever the drain is pulled below the source — a free flyback path in [[h-bridge|H-bridges]].
- **Maximum $V_{GS}$**, usually ±20 V (±16 V for many logic-level parts). The oxide is thin, and static from a finger can puncture it: handle MOSFETs with ESD care.

### P-channel, and why power MOSFETs are vertical
A p-channel MOSFET is the mirror image: source at the positive rail, gate pulled *below* the source by more than $|V_{th}|$ to turn on. Holes are only about half as mobile as electrons, so a p-channel part has roughly twice the $R_{DS(on)}$ of an n-channel part of the same size. Power MOSFETs are built vertically, as thousands of cells in parallel. Their $R_{DS(on)}$ **rises** with temperature — by 1.5–1.8 times at 125 °C — so paralleled devices share current instead of running away, as BJTs can.
`,
  ideas: [
    'The gate is insulated: a voltage, not a current, controls the channel.',
    'Below the threshold nothing flows; above it the channel conducts more as the overdrive V_GS − V_th grows.',
    'Ohmic region: a resistor, R_DS ≈ 1/(k(V_GS − V_th)) — the switch. Saturation: a current source, I_D = (k/2)(V_GS − V_th)² — the amplifier.',
    'V_GS(th) is where it begins to turn on, not where it is fully on: read R_DS(on) at your gate voltage.',
    'Every power MOSFET has a body diode from source to drain.'
  ],
  pitfalls: [
    'A MOSFET with V_GS(th) = 2 V is fully on at 3 V — At the threshold it passes a quarter of a milliamp. Full turn-on needs the gate voltage at which R_DS(on) is specified.',
    'MOSFET saturation means fully on, like a saturated BJT — It means the opposite: the current has stopped rising with V_DS and depends on the gate. Fully on is the ohmic region.',
    'No gate current means the gate can be left floating — A floating gate keeps whatever charge it picks up and can leave the MOSFET half on. Always give it a defined path, such as a pull-down resistor.'
  ],
  formulas: [
    {
      name: 'Drain current in saturation (square law)',
      expr: 'Id = k/2*(Vgs - Vt)^2', tex: 'I_D = \\frac{k}{2}\\left(V_{GS} - V_{th}\\right)^2',
      vars: {
        Id: { name: 'drain current', q: 'current', unit: 'mA', tex: 'I_D' },
        k: { name: 'transconductance parameter', unit: 'A/V²', value: 0.1 },
        Vgs: { name: 'gate–source voltage', q: 'voltage', unit: 'V', value: 4, min: 0, max: 20, tex: 'V_{GS}' },
        Vt: { name: 'threshold voltage', q: 'voltage', unit: 'V', value: 2, min: 0.2, max: 6, tex: 'V_{th}' }
      },
      note: 'Valid for V_DS > V_GS − V_th. Solving for V_GS also gives a root below the threshold, which has no physical meaning.',
      practice: { unknowns: ['Id'] },
      stories: { Id: 'A small MOSFET has k = {k} and a threshold of {Vt}. What drain current flows in saturation with {Vgs} on the gate?' }
    },
    {
      name: 'On-resistance in the ohmic region',
      expr: 'Rds = 1/(k*(Vgs - Vt))', tex: 'R_{DS} = \\frac{1}{k\\left(V_{GS} - V_{th}\\right)}',
      vars: {
        Rds: { name: 'channel resistance', q: 'resistance', unit: 'mΩ', tex: 'R_{DS}' },
        k: { name: 'transconductance parameter', unit: 'A/V²', value: 13 },
        Vgs: { name: 'gate–source voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_{GS}' },
        Vt: { name: 'threshold voltage', q: 'voltage', unit: 'V', value: 1.5, tex: 'V_{th}' }
      },
      note: 'For small V_DS. The defaults roughly mimic an IRLZ44N; a standard 10 V part has a higher threshold and a smaller k.',
      stories: { Rds: 'A logic-level MOSFET (k = {k}, V_th = {Vt}) is driven with {Vgs}. Estimate its on-resistance.' }
    },
    {
      name: 'Transconductance of a MOSFET',
      expr: 'gm = sqrt(2*k*Id)', tex: 'g_m = \\sqrt{2kI_D}',
      vars: {
        gm: { name: 'transconductance', q: 'conductance', unit: 'S', tex: 'g_m' },
        k: { name: 'transconductance parameter', unit: 'A/V²', value: 0.1 },
        Id: { name: 'drain current', q: 'current', unit: 'mA', value: 200, tex: 'I_D' }
      },
      note: 'It grows only with the square root of the current. A BJT at 200 mA has g_m = I_C/V_T ≈ 7.7 S.'
    }
  ],
  examples: [
    {
      title: 'Logic level or not?',
      q: 'Model an IRLZ44N as $V_{th} = 1.5$ V, $k = 13\\ \\mathrm{A/V^2}$ and an IRF540N as $V_{th} = 3.5$ V, $k = 3.5\\ \\mathrm{A/V^2}$. Compare them at gate voltages of 10 V, 5 V and 3.3 V, switching a 5 A load.',
      steps: [
        'IRLZ44N: $R_{DS} = 1/(13 \\times 3.5) = 22\\ \\mathrm{m\\Omega}$ at 5 V and $1/(13 \\times 1.8) = 43\\ \\mathrm{m\\Omega}$ at 3.3 V. Its saturation current at 3.3 V, $6.5 \\times 1.8^2 = 21$ A, is far above 5 A, so it is properly on.',
        'IRF540N at 10 V: $R_{DS} = 1/(3.5 \\times 6.5) = 44\\ \\mathrm{m\\Omega}$ — fine.',
        'IRF540N at 5 V: the most it can pass is $\\tfrac{3.5}{2}(5 - 3.5)^2 = 3.9$ A. With a 5 A load it sits in saturation with volts across it — about 10 W of heat, where the IRLZ44N dissipates half a watt.',
        'IRF540N at 3.3 V: below the threshold, it is off.'
      ],
      a: 'The logic-level part is fully on at 3.3–5 V; the standard part needs 10 V and is useless from a 3.3 V pin.'
    }
  ],
  quiz: [
    { q: 'A MOSFET datasheet gives $V_{GS(th)}$ = 2–4 V. With a 3.3 V logic signal on the gate you can expect…', choices: ['full turn-on at the rated R_DS(on)', 'anything from off to partly on — unreliable', 'damage to the gate', 'the same as at 10 V'], a: 1,
      why: 'The threshold is the voltage at which a quarter of a milliamp flows. A part with a 4 V threshold is off at 3.3 V; one with 2 V is only partly on.' },
    { q: 'In the saturation region of a MOSFET, the drain current depends mainly on…', choices: ['V_DS', 'V_GS', 'the gate current', 'the body diode'], a: 1,
      why: 'Once the channel pinches off, extra drain voltage hardly changes the current; the gate overdrive sets it by the square law.' },
    { q: 'A MOSFET\'s gate draws no current, so a microcontroller pin can switch it arbitrarily fast.', a: false,
      why: 'The gate is a capacitor of a nanofarad or more; each edge needs charge delivered, and a pin\'s limited current makes the edges slow.' },
    { q: 'Why do paralleled power MOSFETs share current reasonably well?', choices: ['Their thresholds are identical', 'R_DS(on) rises with temperature, so the hotter device takes less current', 'The gate current balances them', 'They do not; they must never be paralleled'], a: 1,
      why: 'A device carrying more current heats up, its resistance rises and it hands current to its neighbours — negative feedback that BJTs lack.' },
    { q: 'In the ohmic region, doubling the overdrive $V_{GS} - V_{th}$ changes $R_{DS}$ by a factor of…', choices: ['2', '½', '¼', '1'], a: 1,
      why: 'R_DS ≈ 1/(k(V_GS − V_th)): twice the overdrive, half the resistance.' }
  ],
  applications: ['Power switches in motor drivers, LED drivers and battery protection.', 'The synchronous switches of buck and boost converters.', 'CMOS logic: complementary n- and p-channel MOSFETs in every digital chip.', 'Analogue switches, current sources and the input stages of CMOS op-amps.'],
  history: 'Mohamed Atalla and Dawon Kahng made the first working MOSFET at Bell Labs in 1959. Its planar construction made it ideal for integrated circuits, and it is now the most manufactured device in history.',
  sim: 'tr-mosfet-switch'
},

{
  id: 'mosfet-switch', parent: 'mosfet', title: 'The MOSFET as a switch', level: 2,
  short: 'Drive the gate well past the threshold and a power MOSFET connects a load through a few milliohms; the loss is just I²·R_DS(on). Choosing a part that is fully on at your gate voltage is most of the design.',
  keywords: ['MOSFET switch', 'low-side switch', 'high-side switch', 'logic-level MOSFET', 'Rds(on)', 'conduction loss', 'gate resistor', 'gate pull-down', 'IRLZ44N', 'IRF540N', 'AO3400', 'P-channel', 'junction temperature', 'LED strip', 'bootstrap'],
  prereq: ['mosfet-operation', 'bjt-switch', 'power-energy'],
  related: ['gate-drive', 'heat-sinks', 'h-bridge', 'flyback-diode', 'pwm'],
  body: `
The low-side MOSFET switch has the same shape as the [[bjt-switch|BJT switch]]: the load from the positive supply to the drain, the source to ground, the control signal on the gate. The difference lies in what it asks for and what it costs. The gate needs a **voltage**, not a steady current, and once on, the MOSFET behaves as a small **resistance** $R_{DS(on)}$ rather than a fixed voltage drop. For large currents that is decisive: a saturated BJT drops 0.2–1 V; a 10 mΩ MOSFET carrying 5 A drops 50 mV.

### Choosing the part
1. **Voltage rating**: $V_{DS}$ maximum at least 1.5–2 times the supply, more with inductive loads or long cables.
2. **Fully on at my gate voltage?** From a 3.3 V or 5 V logic pin, use a **logic-level** MOSFET whose $R_{DS(on)}$ is specified at 4.5 V or lower — IRLZ44N or IRLB8721 in TO-220, AO3400 or Si2302 in SOT-23. A standard part like the IRF540N, specified at 10 V, may barely conduct at 5 V and not at all at 3.3 V.
3. **Conduction loss**: $P = I^2 R_{DS(on)}$, using the *hot* value (about 1.5 times the 25 °C figure) and the RMS current. With [[pwm|PWM]] at duty $D$, $P \\approx D\\,I^2R_{DS(on)}$, plus switching loss.
4. **Temperature**: $T_J = T_A + P\\,R_{\\theta JA}$. A TO-220 in free air has about 62 °C/W, so a single watt already means a 60 °C rise, and above 1–2 W it needs a [[heat-sinks|heat sink]]. A SOT-23 on a small copper pad manages only a few hundred milliwatts.

### The small parts around it
- **A gate resistor**, 10–100 Ω in series with the gate: it limits the current spike into the gate capacitance and damps ringing between that capacitance and the inductance of the wiring.
- **A gate pull-down**, 10–100 kΩ from gate to source: the gate is a capacitor that keeps whatever charge it last had. A floating gate can leave the MOSFET half on — hot and dying — while the microcontroller boots.
- **A flyback diode** across inductive loads, as for any switch. The MOSFET's avalanche rating is a safety margin, not a design tool.

### High-side switching
Switching the positive side of a load needs the gate to go *above* the source, and the source of a high-side n-channel device rises to the supply when it turns on. Two common solutions:
- a **P-channel MOSFET** with its source at the supply, turned on by pulling its gate below the supply — through a small NPN or n-channel MOSFET when the supply is higher than the logic voltage, with a Zener to protect the gate if the supply exceeds its rating;
- an **N-channel MOSFET** with a driver that makes a voltage above the supply — a bootstrap capacitor or a charge pump. At high currents this is the norm, because p-channel parts have more resistance.

### MOSFET or BJT?
For anything above a few hundred milliamps, or where efficiency matters, a logic-level MOSFET wins: no base current to supply, milliohms instead of tenths of a volt, and easy paralleling. A small BJT remains the cheap, robust choice for a relay or an LED, especially where the drive voltage is below the MOSFET's comfortable gate voltage.

> [!tip] A quick test of a candidate part: find the "typical output characteristics" graph, pick the curve at your gate voltage, and check that it carries your current with only a few tenths of a volt across it.
`,
  ideas: [
    'A fully-on MOSFET is a resistance: its loss is I²R_DS(on), growing with the square of the current.',
    'Choose a part whose R_DS(on) is specified at your gate voltage — logic-level for 3.3 V and 5 V drive.',
    'Use the hot R_DS(on), about 1.5 times the 25 °C value, and T_J = T_A + P·R_θJA.',
    'Fit a gate resistor, a gate pull-down and, for inductive loads, a flyback diode.',
    'High-side switching needs a P-channel part or a gate driver that goes above the supply.'
  ],
  pitfalls: [
    'Any MOSFET rated for enough current will do from a 5 V pin — A standard 10 V part may be only partly on, sitting in its saturation region with volts across it and overheating.',
    'The loss is the same at half the current — Conduction loss goes with I²: half the current, a quarter of the heat; twice the current, four times.',
    'The headline R_DS(on) applies in use — It is quoted at 25 °C and at a generous gate voltage; at 100 °C it is about 1.5 times higher.'
  ],
  formulas: [
    {
      name: 'Conduction loss',
      expr: 'P = I^2*Rds', tex: 'P = I^2 R_{DS(on)}',
      vars: {
        P: { name: 'power dissipated', q: 'power', unit: 'W' },
        I: { name: 'drain current (RMS)', q: 'current', unit: 'A', value: 5 },
        Rds: { name: 'on-resistance at the working temperature', q: 'resistance', unit: 'mΩ', value: 25, tex: 'R_{DS(on)}' }
      },
      note: 'With PWM, multiply by the duty cycle and add the switching loss.',
      stories: {
        P: 'A MOSFET with R_DS(on) = {Rds} carries {I}. How much power does it dissipate?',
        I: 'A SOT-23 MOSFET with R_DS(on) = {Rds} may dissipate at most {P}. What current can it carry?'
      }
    },
    {
      name: 'Junction temperature in free air',
      expr: 'Tj = Ta + P*Rja', tex: 'T_J = T_A + P\\,R_{\\theta JA}',
      vars: {
        Tj: { name: 'junction temperature', q: 'temperature', unit: '°C', tex: 'T_J' },
        Ta: { name: 'ambient temperature', q: 'temperature', unit: '°C', value: 25, tex: 'T_A' },
        P: { name: 'power dissipated', q: 'power', unit: 'W', value: 0.625 },
        Rja: { name: 'junction-to-ambient thermal resistance', q: 'thermalres', unit: '°C/W', value: 62, tex: 'R_{\\theta JA}' }
      },
      note: 'About 62 °C/W for TO-220 without a heat sink, 100–250 °C/W for SOT-23 depending on the copper.',
      stories: { Tj: 'A TO-220 MOSFET ({Rja}) dissipates {P} in air at {Ta}. How hot is its junction?' }
    }
  ],
  examples: [
    {
      title: 'Switching an LED strip from an Arduino',
      q: 'A 12 V LED strip draws 4 A. Is an IRLZ44N driven from a 5 V pin comfortable without a heat sink?',
      steps: [
        '$R_{DS(on)}$ at 5 V is about 25 mΩ at 25 °C; allow 1.5 times for heating: about 37 mΩ.',
        '$P = 4^2 \\times 0.037 = 0.59\\ \\mathrm{W}$.',
        '$T_J = 25 + 0.59 \\times 62 = 62$ °C in room air, 77 °C in a 40 °C enclosure. Comfortable — no heat sink needed.',
        'Add a 100 Ω gate resistor and a 100 kΩ pull-down. With PWM dimming, check the switching loss too (see [[gate-drive]]).'
      ],
      a: 'Yes: about 0.6 W, a junction around 60–80 °C.'
    },
    {
      title: 'The same MOSFET at 10 A',
      q: 'Now the strip draws 10 A. What happens, and what heat sink is needed to keep $T_J$ below 125 °C at 40 °C ambient ($R_{\\theta JC}$ = 1.4 °C/W, 0.5 °C/W for the thermal pad)?',
      steps: [
        '$P = 10^2 \\times 0.037 = 3.7\\ \\mathrm{W}$ — six times more, for 2.5 times the current.',
        'In free air: a $3.7 \\times 62 = 229$ °C rise. It would fail.',
        'Allowed total resistance: $(125 - 40)/3.7 = 23$ °C/W, so the heat sink must be below $23 - 1.4 - 0.5 = 21$ °C/W.',
        'A small clip-on fin (about 20 °C/W) is marginal; a 10 °C/W extrusion gives $T_J = 40 + 3.7 \\times 11.9 = 84$ °C. Or use a lower-resistance MOSFET: halving $R_{DS(on)}$ halves the heat.'
      ],
      a: '3.7 W: a heat sink of 10 °C/W or better (or a better MOSFET).'
    }
  ],
  quiz: [
    { q: 'A MOSFET with $R_{DS(on)}$ = 20 mΩ carries 10 A. What does it dissipate?', answer: 2, unit: 'W',
      why: 'P = I²R = 100 × 0.020 = 2 W.' },
    { q: 'Doubling the current through a fully-on MOSFET multiplies its dissipation by…', choices: ['2', '4', '√2', '1'], a: 1,
      why: 'P = I²R_DS(on), so twice the current gives four times the power — more, in fact, since the MOSFET gets hotter and its resistance rises.' },
    { q: 'Why fit a 100 kΩ resistor from gate to source?', choices: ['To limit the gate current', 'To keep the MOSFET off while the driving pin is floating', 'To protect against overcurrent', 'To speed up switching'], a: 1,
      why: 'Without it a floating gate can charge to a few volts and leave the MOSFET partly on, dissipating heavily.' },
    { q: 'For a high-side switch, an N-channel MOSFET can be driven directly from a 5 V logic pin when the load supply is 12 V.', a: false,
      why: 'Its source rises to about 12 V when it conducts, so the gate needs roughly 17–22 V. Use a P-channel part with a level shifter, or a driver with a bootstrap or charge pump.' },
    { q: 'You need to switch 2 A from a 3.3 V ESP32 pin. Which part?', choices: ['IRF540N (R_DS(on) 44 mΩ at V_GS = 10 V)', 'AO3400 (R_DS(on) specified down to V_GS = 2.5 V)', 'BC547', '2N3055'], a: 1,
      why: 'Only the AO3400 is specified at a gate voltage the pin can supply. The IRF540N needs 10 V; a BC547 is rated 100 mA; a 2N3055 needs amps of base current.' }
  ],
  applications: ['LED strip dimmers and lamp switches.', 'Motor, fan and pump control from microcontrollers.', 'Reverse-polarity and load switches in battery-powered products.', 'The switches inside every H-bridge and switching regulator.'],
  sim: 'tr-mosfet-switch'
},

{
  id: 'gate-drive', parent: 'mosfet', title: 'Gate drive and switching losses', level: 3,
  short: 'Every switching edge must move the gate charge, and while it moves the MOSFET carries current and voltage at once. How fast you can drive the gate sets the loss per edge — and so how high a PWM frequency you can afford.',
  keywords: ['gate charge', 'Qg', 'Qgd', 'Miller plateau', 'Miller effect', 'switching loss', 'gate driver', 'bootstrap', 'dead time', 'TC4427', 'IR2110', 'UCC27517', 'gate resistor', 'PWM frequency', 'turn-on time', 'dV/dt'],
  prereq: ['mosfet-switch', 'rc-transient', 'pwm'],
  related: ['h-bridge', 'converter-losses', 'buck-converter', 'heat-sinks'],
  body: `
A MOSFET's gate is a capacitor, and not a simple one. Turning the MOSFET on happens in three stages, which the datasheet's **gate-charge curve** — $V_{GS}$ against the charge delivered — shows plainly:

1. **Up to the threshold**, the charge $Q_{gs}$ raises $V_{GS}$; little happens at the drain.
2. **The Miller plateau.** The channel conducts, the drain current rises to the full load current, and the drain voltage starts to fall. The falling drain pulls on the gate through the gate–drain capacitance, so all the charge delivered now — $Q_{gd}$, the "Miller charge" — goes into swinging the drain, while $V_{GS}$ stays flat at the **plateau voltage** $V_{pl}$: typically 4–6 V for a standard part, 2.5–3.5 V for a logic-level part at a few amperes.
3. **Above the plateau** the drain is down, and the rest of the charge, up to the total $Q_g$, enhances the channel to its full $R_{DS(on)}$.

### The switching loss
During the plateau the MOSFET carries the full current *and* most of the voltage at once. With a driver of voltage $V_\\text{drv}$ and a total resistance $R_G$ in the gate path (driver output, gate resistor and the MOSFET's internal gate resistance), the gate current on the plateau is fixed:

$$I_G = \\frac{V_\\text{drv} - V_{pl}}{R_G}, \\qquad t_{sw} \\approx \\frac{Q_{gd}}{I_G} = \\frac{Q_{gd}R_G}{V_\\text{drv} - V_{pl}}$$

Each transition dissipates roughly $\\tfrac12 V I\\,t_{sw}$. With two transitions per PWM cycle at frequency $f$:

$$P_{sw} \\approx V I\\,t_{sw}\\,f$$

Switching loss grows **in proportion to frequency**; conduction loss, $D\\,I^2R_{DS(on)}$, does not depend on it at all. Double the PWM frequency and the switching loss doubles. Turn-off is the same story in reverse, and the gate must be pulled from $V_\\text{drv}$ down through the plateau — with only $V_{pl}$ driving the current out, turn-off is often the slower edge.

Driving the gate also costs power, taken from the driver's supply: $P_G = Q_g V_\\text{drv} f$. Small for one MOSFET at 20 kHz, significant for a converter switching several MOSFETs at hundreds of kilohertz.

### Why a microcontroller pin is a poor gate driver
A GPIO pin supplies perhaps 10–20 mA through its own internal resistance of tens of ohms. With $Q_{gd}$ of 20 nC, the plateau lasts a microsecond or more. At 1 kHz that is harmless. At 20 kHz — the usual choice for motors, above the range of hearing — it can be the largest loss in the circuit. A **gate driver** IC (TC4427, MCP1407 or UCC27517 for low-side switches) delivers amperes for a few tens of nanoseconds and brings each edge down to 50–150 ns. Drivers for bridges (IR2104, IR2110) add a **bootstrap** supply for the high-side n-channel gate, and generate **dead time** so that the two switches of a leg are never on together (see [[h-bridge]]).

### The gate resistor as a trade-off
A small $R_G$ means fast edges and low switching loss — but also fast $\\mathrm{d}V/\\mathrm{d}t$, ringing with the wiring inductance, and more electromagnetic interference. Designers often turn on through 10–20 Ω and turn off faster through a diode that bypasses it, since the turn-off edge sets the dead time needed. Keep the gate loop — driver, gate, source and back — physically small: its inductance slows the edges and causes ringing no resistor value can fix.
`,
  ideas: [
    'Turning on moves the gate through the threshold, a flat Miller plateau, and on to full enhancement.',
    'During the plateau the MOSFET has full current and voltage at once: that is where switching loss comes from.',
    't_sw ≈ Q_gd·R_G/(V_drv − V_pl), and P_sw ≈ V·I·t_sw·f — proportional to frequency.',
    'A microcontroller pin gives microsecond edges; a gate-driver IC gives tens of nanoseconds.',
    'Gate-drive power is Q_g·V_drv·f, drawn from the driver\'s supply.'
  ],
  pitfalls: [
    'Since the gate draws no DC current, any pin can drive any MOSFET at any frequency — The gate charge must be delivered on every edge; a weak driver makes slow edges and large switching losses.',
    'Raising the PWM frequency is free — Switching loss rises in proportion to frequency, while conduction loss stays the same.',
    'The smallest possible gate resistor is always best — Very fast edges ring with the wiring inductance, radiate interference and can cause false turn-on in bridges.'
  ],
  formulas: [
    {
      name: 'Duration of one switching edge',
      expr: 'tsw = Qgd*Rg/(Vdrv - Vpl)', tex: 't_{sw} = \\frac{Q_{gd}\\,R_G}{V_{\\text{drv}} - V_{pl}}',
      vars: {
        tsw: { name: 'time spent on the Miller plateau', q: 'time', unit: 'µs', tex: 't_{sw}' },
        Qgd: { name: 'gate–drain (Miller) charge', q: 'charge', unit: 'nC', value: 25, tex: 'Q_{gd}' },
        Rg: { name: 'total gate-path resistance', q: 'resistance', unit: 'Ω', value: 220, tex: 'R_G' },
        Vdrv: { name: 'drive voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_{\\text{drv}}' },
        Vpl: { name: 'plateau voltage', q: 'voltage', unit: 'V', value: 3, tex: 'V_{pl}' }
      },
      note: 'For turn-off, replace V_drv − V_pl by V_pl (the gate is pulled to 0 V).',
      stories: { tsw: 'A MOSFET with Q_gd = {Qgd} and a plateau at {Vpl} is driven from {Vdrv} through {Rg}. How long does each edge take?' }
    },
    {
      name: 'Switching loss',
      expr: 'Psw = V*I*tsw*f', tex: 'P_{sw} = V I\\,t_{sw}\\,f',
      vars: {
        Psw: { name: 'switching loss', q: 'power', unit: 'W', tex: 'P_{sw}' },
        V: { name: 'voltage switched', q: 'voltage', unit: 'V', value: 12 },
        I: { name: 'current switched', q: 'current', unit: 'A', value: 5 },
        tsw: { name: 'duration of each edge', q: 'time', unit: 'µs', value: 2.75, tex: 't_{sw}' },
        f: { name: 'switching frequency', q: 'frequency', unit: 'kHz', value: 20 }
      },
      note: 'Two edges per cycle, each dissipating about ½VI·t_sw. An estimate: real waveforms and the diode\'s recovery add to it.',
      stories: {
        Psw: 'A MOSFET switches {I} at {V} with edges of {tsw}, at {f}. Estimate the switching loss.',
        f: 'A MOSFET switching {I} at {V} has edges of {tsw}. Up to what frequency does its switching loss stay below {Psw}?'
      }
    },
    {
      name: 'Gate-drive power',
      expr: 'Pg = Qg*Vdrv*f', tex: 'P_G = Q_g V_{\\text{drv}}\\,f',
      vars: {
        Pg: { name: 'power taken from the driver supply', q: 'power', unit: 'mW', tex: 'P_G' },
        Qg: { name: 'total gate charge', q: 'charge', unit: 'nC', value: 48, tex: 'Q_g' },
        Vdrv: { name: 'drive voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_{\\text{drv}}' },
        f: { name: 'switching frequency', q: 'frequency', unit: 'kHz', value: 20 }
      }
    }
  ],
  examples: [
    {
      title: 'A 20 kHz motor PWM from a pin, and from a driver',
      q: 'An IRLZ44N ($Q_{gd}$ ≈ 25 nC, plateau ≈ 3 V at 5 A, $R_{DS(on)}$ ≈ 25 mΩ) switches a 12 V, 5 A motor at 20 kHz and 50 % duty. Compare driving its gate from a 5 V pin through 220 Ω with a gate-driver IC (output resistance about 7 Ω) through 4.7 Ω.',
      steps: [
        'From the pin: $I_G = (5 - 3)/220 = 9.1$ mA, so $t_{sw} = 25\\ \\mathrm{nC}/9.1\\ \\mathrm{mA} = 2.75\\ \\mu\\mathrm{s}$ per edge (the pin\'s own resistance makes it worse still).',
        '$P_{sw} = 12 \\times 5 \\times 2.75\\ \\mu\\mathrm{s} \\times 20\\ \\mathrm{kHz} = 3.3\\ \\mathrm{W}$.',
        'Conduction loss: $0.5 \\times 5^2 \\times 0.025 = 0.31\\ \\mathrm{W}$. Switching loss is ten times larger.',
        'With the driver: $I_G = 2\\ \\mathrm{V}/11.7\\ \\Omega = 0.17$ A, $t_{sw} = 146$ ns, $P_{sw} = 12 \\times 5 \\times 146\\ \\mathrm{ns} \\times 20\\ \\mathrm{kHz} = 0.18\\ \\mathrm{W}$.',
        'Total loss falls from about 3.6 W (heat sink needed) to about 0.5 W (none needed).'
      ],
      a: 'About 3.3 W of switching loss from the pin, 0.18 W with a driver — the driver pays for itself.'
    }
  ],
  quiz: [
    { q: 'The PWM frequency of a motor driver is raised from 2 kHz to 20 kHz with the same gate drive. The switching loss…', choices: ['stays the same', 'rises ten times', 'falls ten times', 'rises √10 times'], a: 1,
      why: 'Each edge costs the same energy, and there are ten times as many edges per second.' },
    { q: 'During the Miller plateau…', choices: ['the gate voltage rises quickly', 'the gate voltage stays nearly constant while the drain voltage swings', 'no drain current flows', 'the body diode conducts'], a: 1,
      why: 'All the gate current goes into charging the gate–drain capacitance as the drain swings, so V_GS pauses at the plateau voltage.' },
    { q: 'A MOSFET has $Q_{gd}$ = 10 nC and is driven with 0.5 A during the plateau. How long does the transition take?', answer: 20, unit: 'ns',
      why: 't = Q/I = 10 nC / 0.5 A = 20 ns.' },
    { q: 'Using a much smaller gate resistor always improves a design.', a: false,
      why: 'Faster edges cut switching loss, but increase ringing, interference and the risk of false turn-on through the Miller capacitance.' },
    { q: 'Why does an H-bridge gate driver insert dead time?', choices: ['To reduce the gate charge', 'So both MOSFETs of a leg are never on together (shoot-through)', 'To lower the PWM frequency', 'To charge the bootstrap capacitor'], a: 1,
      why: 'A MOSFET turning off is still conducting for its switching time; if its partner turned on at the same instant, the supply would be shorted through the leg.' }
  ],
  applications: ['Choosing a PWM frequency for motor and LED drivers.', 'Sizing gate drivers and gate resistors in switching converters.', 'Bootstrap and isolated drivers for half-bridges and inverters.', 'Estimating the efficiency of a converter before building it.'],
  sim: 'tr-mosfet-switch'
}

);
