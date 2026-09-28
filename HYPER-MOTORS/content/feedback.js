/* HYPER-MOTORS · content/feedback.js — Encoders, sensors and limit switches:
 *   feedback-devices  incremental and absolute encoders, resolvers, Hall-effect sensors, tachogenerators
 *   limits-safety     mechanical limit switches, proximity and optical sensors, homing, emergency stop and STO, brakes
 * Simulations in sims/feedback.js (prefix fb-). */
Hyper.add(

{
  id: 'incremental-encoders', parent: 'feedback-devices', title: 'Incremental encoders', level: 2,
  short: 'A disc with evenly spaced lines turns past a sensor and gives two square waves 90° apart (A and B) and a once-a-turn index pulse (Z). Counting every edge gives four counts per line and the direction. The count is relative — it is lost at power-off — and line-driver, HTL push-pull or open-collector outputs carry it to the drive.',
  keywords: ['encoder', 'incremental encoder', 'quadrature', 'A B Z', 'index pulse', 'PPR', 'CPR', 'lines per revolution', 'counts per revolution', 'x4 decoding', 'line driver', 'RS-422', 'TTL', 'HTL', 'push-pull', 'open collector', 'differential signal', 'cable length', 'maximum frequency', 'sin/cos encoder', 'magnetic encoder', 'high-speed counter'],
  prereq: ['servo-principle', 'electronics:logic-families', 'electronics:counters'],
  related: ['absolute-encoders', 'resolvers', 'hall-sensors', 'tachogenerators', 'closed-loop-steppers', 'homing-routines', 'command-interfaces', 'servo-drives', 'electronics:differential-pair', 'electronics:schmitt-trigger', 'electronics:reflections-matching'],
  body: `
An incremental encoder turns rotation into pulses. Inside it a disc carries $N$ evenly spaced lines — a chrome grating on glass or slots in metal for an optical encoder, a finely magnetised ring read by Hall or magnetoresistive sensors for a magnetic one. As the disc turns, a sensor gives one square wave per line, so $N$ is the **pulses per revolution (PPR)**, or lines per revolution. Typical values run from 100 PPR on a speed wheel for a conveyor, through 1000–2500 PPR on servo and closed-loop stepper motors, to 10 000 PPR and more on precision shaft encoders.

### A, B and Z: quadrature
One channel tells how far, not which way. So there are two, **A** and **B**, a quarter of a line pitch apart: their square waves are 90° out of [[?phase|phase]] — in *quadrature*. Turning forwards A leads B; backwards B leads A. Every edge of either channel is a count, and whether it adds or subtracts depends on the level of the other channel. A third track gives one **index pulse Z** per revolution: a reference mark for [[homing-routines|homing]] and for checking the count.

| Decoding | Edges counted | Counts a turn at 1000 PPR | Angle per count |
|---|---|---|---|
| ×1 | rising edges of A | 1000 | 0.36° |
| ×2 | both edges of A | 2000 | 0.18° |
| ×4 | both edges of A and B | 4000 | 0.09° |

Drives decode ×4, so read datasheets with care: PPR counts lines, while "CPR" means counts after ×4 for some makers and lines for others. A 2500-PPR encoder gives 10 000 counts a turn — on a ball screw of 10 mm lead, 1 µm per count.

### How fast can it count?
The frequency on each channel is $f = N n$, with $n$ in revolutions per second: 2500 PPR at 3000 rpm gives 125 kHz, and 500 000 counts a second after ×4. Every link must keep up: the encoder (typically rated 100 kHz to 1 MHz, plus a maximum shaft speed), the cable, and the receiver — a PLC's high-speed counter may stop at 100 kHz or less, while servo-drive inputs typically take several hundred kHz to a few MHz. If A and B are not exactly 90° apart (low-cost encoders allow a few tens of degrees) the closest edges come closer still, and that spacing is what the receiver must resolve.

### The output stage
| Output | Signal | Typical limits | Where |
|---|---|---|---|
| **TTL line driver (RS-422)** | 5 V differential: A with $\\overline{A}$, B with $\\overline{B}$, Z with $\\overline{Z}$ on twisted pairs | up to about 1 MHz; 100 m and more at lower frequency | servo drives, CNC, motion cards |
| **HTL push-pull** | 10–30 V, usually single-ended | about 100–300 kHz, less on long cables | PLCs, 24 V counters, VFD speed feedback |
| **Open collector (NPN)** | pulls to 0 V; a pull-up resistor makes the high | tens of kHz; slow rising edges | cheap counters, microcontrollers |
| **Sin/cos, 1 V peak-to-peak** | analogue sine and cosine, differential | interpolated to thousands of counts per line | high-resolution servos |

A **line driver** sends each channel with its complement on a twisted pair; the receiver looks only at the difference, so noise picked up equally by both wires cancels, and a 120 Ω resistor terminates the pair. **HTL** has a large swing — at 24 V a spike must be several volts to cross the threshold — but no common-mode rejection. **Open collector** only pulls down: the high level comes from the pull-up resistor charging the cable's capacitance, about 100 pF per metre, so the rising edge is an [[?exponential|exponential]] with a 10–90 % rise time $t_r \\approx 2.2\\,RC$.

### Cables, supply and noise
Encoder wiring shares the machine with motor cables whose PWM edges swing hundreds of volts in a fraction of a microsecond. Use shielded cable with a twisted pair per channel, bond the shield as the drive maker directs (usually a 360° clamp at the drive), and run encoder cables in a separate duct from motor cables. Watch the supply of 5 V encoders: 100 m of 0.25 mm² cores has about 14 Ω in the loop, and at 150 mA that drops 2.1 V — the encoder sees 2.9 V and fails, so long runs use 10–30 V encoders or remote-sense supplies.

A wrong edge is a permanent error: the count is off for good, and every further one adds to the drift. The index pulse is the check — between two Z pulses there must be exactly $4N$ counts, and drives raise an encoder fault when there are not.

**In the simulations:** watch the counter follow A and B edge by edge, reverse the disc and see B lead, then add noise spikes and push the speed until the count drifts from the true angle. In the second, lengthen the cable of an open-collector encoder until its rising edges arrive too late, then switch to a line driver.

> [!warn] An incremental encoder forgets its position at power-off, and a count error is silent. Never trust a position after a power cut, a cable fault or an encoder alarm: re-home the axis, with the machine in a safe state.

> [!key] Two square waves in quadrature give distance and direction; ×4 decoding gives four counts per line. The line frequency $N n$ must stay within every link's limit, and the output type sets how far and how fast the pulses travel cleanly.
`,
  ideas: [
    'Two channels 90° apart give direction as well as distance; the index pulse Z marks one point per revolution.',
    '×4 decoding counts every edge of A and B: four counts per line.',
    'The line frequency is PPR × revolutions per second, and the encoder, the cable and the receiver must all handle it.',
    'Line drivers (RS-422) reject common-mode noise, HTL relies on its large swing, and open collector is slowed by the cable capacitance.',
    'The count is relative: a lost or extra edge stays until the axis is homed again.'
  ],
  pitfalls: [
    'PPR and counts per revolution are the same thing — A drive decoding ×4 gets four counts per line; mixing them up scales every move by a factor of four.',
    'A higher PPR is always better — It raises the line frequency at top speed; past the limit of the receiver or the cable, counts are lost and the position drifts.',
    'A shielded cable can share a duct with the motor cables — Shields reduce coupling but do not remove it; separate the cables and use differential signals.'
  ],
  formulas: [
    {
      name: 'Angle per count with ×4 decoding',
      expr: 'dtheta = 2*pi/(4*N)', tex: '\\Delta\\theta = \\dfrac{2\\pi}{4N}',
      vars: {
        dtheta: { name: 'angle per count', q: 'angle', unit: '°', tex: '\\Delta\\theta' },
        N: { name: 'pulses (lines) per revolution', q: 'count', int: true, value: 1000, tex: 'N' }
      },
      note: 'Four counts per line: every rising and falling edge of A and of B.',
      stories: { dtheta: 'An encoder has {N} lines. What angle does one count represent after ×4 decoding?', N: 'You need {dtheta} per count. How many lines must the encoder have?' }
    },
    {
      name: 'Line frequency',
      expr: 'f = N*n', tex: 'f = N\\,n',
      vars: {
        f: { name: 'frequency on channel A (or B)', q: 'frequency', unit: 'kHz' },
        N: { name: 'pulses (lines) per revolution', q: 'count', int: true, value: 2500, tex: 'N' },
        n: { name: 'shaft speed', q: 'frequency', unit: 'rpm', value: 3000 }
      },
      note: 'The count rate after ×4 decoding is four times this; both must be within the receiver\'s limit.',
      stories: { f: 'A {N}-line encoder turns at {n}. What frequency must the receiver handle on each channel?', n: 'A counter input accepts {f} per channel. How fast may a {N}-line encoder turn?' }
    },
    {
      name: 'Linear resolution on a screw',
      expr: 'dx = p/(4*N)', tex: '\\Delta x = \\dfrac{p}{4N}',
      vars: {
        dx: { name: 'travel per count', q: 'length', unit: 'µm', tex: '\\Delta x' },
        p: { name: 'screw lead', q: 'length', unit: 'mm', value: 10 },
        N: { name: 'pulses (lines) per revolution', q: 'count', int: true, value: 2500, tex: 'N' }
      },
      note: 'Resolution is not accuracy: screw lead errors, backlash and thermal growth come on top.',
      stories: { dx: 'A {N}-line encoder drives a ball screw of lead {p}. How far does the nut move per count?', N: 'A screw of lead {p} must be measured in steps of {dx}. How many lines does the motor encoder need?' }
    },
    {
      name: 'Rise time of an open-collector signal',
      expr: 'tr = 2.2*R*C', tex: 't_r = 2.2\\,R\\,C',
      vars: {
        tr: { name: '10–90 % rise time', q: 'time', unit: 'µs', tex: 't_r' },
        R: { name: 'pull-up resistance', q: 'resistance', unit: 'kΩ', value: 1 },
        C: { name: 'cable and input capacitance', q: 'capacitance', unit: 'nF', value: 5 }
      },
      note: 'About 100 pF per metre of cable. The rise must be short compared with a quarter of the line period.',
      stories: { tr: 'An open-collector encoder with a {R} pull-up drives {C} of cable. How long does each rising edge take?', C: 'The rise time must stay below {tr} with a {R} pull-up. What cable capacitance is allowed?' }
    }
  ],
  examples: [
    {
      title: 'Choosing an encoder for a ball-screw axis',
      q: 'A servo axis has a ball screw of 10 mm lead, must be measured in 1 µm steps and runs at up to 3000 rpm. What PPR is needed, and what must the drive\'s encoder input handle?',
      steps: [
        'Counts per revolution: $10\\,\\text{mm} / 1\\,\\mu\\text{m} = 10\\,000$. With ×4 decoding, $N = 10\\,000/4 = 2500$ PPR.',
        'Line frequency: $f = N n = 2500 \\times 3000/60 = 125\\,000$ Hz = 125 kHz per channel.',
        'Count rate after ×4: 500 000 counts a second. A PLC counter rated 100 kHz would fail; a servo-drive input rated for several hundred kHz of line frequency is comfortable.'
      ],
      a: '2500 PPR; the input must take 125 kHz per channel (500 000 counts/s).'
    },
    {
      title: 'An open-collector encoder on a long cable',
      q: 'A 1000-PPR open-collector encoder has a 2.2 kΩ pull-up to 24 V at the counter, whose input switches on at 13 V, and 50 m of cable at 100 pF/m. Is it good at 1500 rpm? At 3000 rpm?',
      steps: [
        '$C \\approx 5$ nF, so $RC = 2200 \\times 5\\times10^{-9} = 11\\,\\mu$s and the 10–90 % rise time is $2.2\\,RC \\approx 24\\,\\mu$s.',
        'The input switches when the rising edge reaches 13 V of 24 V, after $RC\\ln(24/11) = 0.78\\,RC \\approx 8.6\\,\\mu$s. The transistor pulls the line down in a few microseconds, so each rising edge of A arrives about 6 µs late compared with the edges of B.',
        'At 1500 rpm: $f = 1000 \\times 25 = 25$ kHz and the A-to-B edges are 10 µs apart — it works, with little margin.',
        'At 3000 rpm the edges are 5 µs apart, less than the 6 µs shift: A\'s rising edge now comes after the edge of B it should precede, the decoder counts backwards, and the position is lost.'
      ],
      a: 'Works at 1500 rpm with little margin, fails at 3000 rpm: use a 1 kΩ pull-up (if the output can sink the current), a shorter cable, or better a line-driver (RS-422) encoder.'
    }
  ],
  quiz: [
    { q: 'A 1024-PPR encoder is decoded ×4. How many counts does the drive see per revolution?', answer: 4096, why: 'Four edges per line — rising and falling on A and on B: 4 × 1024 = 4096.' },
    { q: 'An axis moves forwards and channel A leads channel B. The axis reverses. Now…', choices: ['B leads A', 'A still leads B, but the frequency is negative', 'the Z pulse appears on every line', 'A and B become in phase'], a: 0, why: 'The disc passes the two detectors in the opposite order, so the edges of B come first. That is how the decoder knows the direction.' },
    { q: 'After a power cut, an incremental encoder still knows the axis position.', a: false, why: 'It only counts changes. With the power off nothing counts, and the axis may have moved; it must be homed again.' },
    { q: 'Why does an RS-422 line driver survive noise that corrupts a single-ended TTL signal?', choices: ['The receiver reads the difference of two wires, so noise induced equally in both cancels', 'It uses a higher voltage', 'Its signal is filtered to a sine wave', 'It sends each pulse twice'], a: 0, why: 'Twisted pairs pick up nearly the same interference on both wires; subtracting them removes it. RS-422 is still a 5 V system.' },
    { q: 'Between two index pulses a drive counts 3998 counts on a 1000-PPR encoder, forwards. What does this tell you?', choices: ['Two counts were lost: noise or overspeed — an encoder fault', 'The motor slipped two steps', 'Everything is normal', 'The encoder is 999.5 PPR'], a: 0, why: 'One revolution must be exactly 4 × 1000 = 4000 counts. Drives use this check to raise an encoder alarm.' }
  ],
  problems: [
    { q: 'A 5000-PPR encoder turns at 6000 rpm. What frequency appears on channel A?', answer: 500, unit: 'kHz', tol: 0.01, steps: ['$f = N n = 5000 \\times 6000/60 = 500\\,000$ Hz = 500 kHz.'] },
    { q: 'A 2000-PPR encoder on a 5 mm-lead screw is decoded ×4. What is the travel per count?', answer: 0.625, unit: 'µm', tol: 0.01, steps: ['Counts per revolution: $4 \\times 2000 = 8000$.', '$\\Delta x = 5\\,\\text{mm}/8000 = 0.625\\,\\mu$m.'] }
  ],
  choose: {
    good: [
      'Servo and closed-loop stepper feedback where a homing run at start-up is acceptable: simple, fast and cheap.',
      'Speed feedback on conveyors, winders and vector-controlled VFDs: 100–1024 PPR HTL encoders.',
      'Measuring wheels, draw-wire sensors and electronic handwheels.'
    ],
    avoid: [
      'Machines that must know the position at power-up without moving — robots, vertical and long axes: use an [[absolute-encoders|absolute encoder]].',
      'Heat, heavy shock or oil mist on an optical glass disc: consider a magnetic encoder or a [[resolvers|resolver]].',
      'Open-collector outputs on long cables or at high frequency.'
    ],
    check: [
      'The PPR against the resolution you need, with ×4 decoding.',
      'The line frequency at top speed against the encoder, cable and receiver limits.',
      'The output type against the input: 5 V RS-422, 24 V HTL, NPN or PNP; the supply voltage at the end of the cable.',
      'Mechanics: solid or hollow shaft, coupling or stator arm, maximum speed, IP rating and temperature.'
    ]
  },
  applications: [
    'Servo motors: the encoder on the motor shaft closes the position and speed loops; the drive counts ×4 and checks the count at each index pulse.',
    'Closed-loop steppers: an encoder on the rear shaft catches lost steps (see [[closed-loop-steppers]]).',
    'Cut-to-length and flying shears: a measuring wheel on the material gives length in pulses to a PLC high-speed counter.',
    'Wiring line-driver, HTL and open-collector encoders: [the sensor wiring tool](#/tools/wiring/sensors).'
  ],
  sources: [
    'ANSI/TIA/EIA-422, *Electrical characteristics of balanced voltage digital interface circuits* — the differential line used by TTL line-driver encoders.',
    'IEC 61800-3, *Adjustable speed electrical power drive systems — EMC requirements and specific test methods*: the interference environment around drives.',
    'Encoder and servo-drive makers\' manuals describe output circuits, frequency limits and cabling; the figures here are typical ranges, not one product\'s ratings.'
  ],
  sim: ['fb-quadrature', 'fb-encoder-line']
},

{
  id: 'absolute-encoders', parent: 'feedback-devices', title: 'Absolute encoders', level: 2,
  short: 'An absolute encoder reads a unique code for every angle, so it knows its position the moment it is switched on. Single-turn versions repeat every revolution; multi-turn versions also count revolutions with gears, a battery-backed counter or harvested energy. Gray code keeps readings honest, and serial interfaces such as SSI carry the number to the controller.',
  keywords: ['absolute encoder', 'single-turn', 'multi-turn', 'Gray code', 'reflected binary', 'code disc', 'bits', 'resolution', 'SSI', 'synchronous serial interface', 'BiSS', 'monoflop time', 'battery-backed encoder', 'Wiegand', 'fieldbus encoder', 'position at power-up'],
  prereq: ['incremental-encoders', 'servo-principle', 'electronics:serial-buses'],
  related: ['resolvers', 'homing-routines', 'servo-drives', 'ac-servo-motors', 'command-interfaces', 'electronics:logic-gates', 'motors-robots-drones'],
  body: `
An absolute encoder reads a unique code for every position of its shaft. Switch it on and it knows where it is — no homing run, no movement. That is why robots, vertical axes, cranes and long linear axes use them, and why most modern servo motors carry one.

### The code disc
The classic disc has concentric tracks, one per bit, each read by its own detector along a radius; the innermost track is the most significant bit. With $b$ bits there are $2^b$ positions per turn: 10 bits give 1024 (0.35°), 13 bits 8192, 17 bits 131 072 (about 10 arc-seconds) — typical of servo motors, which now reach 20–24 bits. Such resolutions are not made with 24 tracks: fine encoders read a few coarse absolute tracks plus a fine track interpolated electronically, or one pseudo-random track read by a row of sensors. The principle stays: one number for each angle.

### Why Gray code
In natural binary, going from 7 to 8 changes every bit: 0111 → 1000. Detectors are never perfectly aligned, so for an instant some bits have changed and others have not, and the reading can be anything from 0 to 15 — a jump the drive would chase. **Gray code** (reflected binary) changes exactly one bit between neighbours, so a reading taken on a boundary is always one of the two neighbours.

| Position | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|---|
| Binary | 0000 | 0001 | 0010 | 0011 | 0100 | 0101 | 0110 | 0111 | 1000 |
| Gray | 0000 | 0001 | 0011 | 0010 | 0110 | 0111 | 0101 | 0100 | 1100 |

To convert, the top bit is the same; each lower binary bit is the binary bit above it combined with the Gray bit by exclusive-or (different gives 1, equal gives 0).

### Single-turn and multi-turn
A **single-turn** encoder repeats every revolution — enough for a rotary table, a valve or a steering angle. A **multi-turn** encoder also counts revolutions, typically 12 to 16 bits (4096 to 65 536 turns), in one of three ways:
- a **gear train** of small code discs reads the turns mechanically — no battery, but more parts and a speed limit;
- a **battery-backed counter** counts the turns electronically and a battery keeps it alive with the power off — common on servo motors; a flat battery loses the turn count and raises an alarm;
- **energy harvesting**: a Wiegand wire gives a pulse of energy as a magnet passes, enough to count a turn with no battery at all.

On a ball screw of 5 mm lead, 4096 turns cover 20.48 m — the whole travel of almost any machine, known at power-up.

### Interfaces
| Interface | How | Typical use |
|---|---|---|
| Parallel | one wire per bit, usually Gray | old designs, cam switches |
| **SSI** (synchronous serial) | the receiver clocks the bits out over RS-422 pairs | PLCs, motion controllers; simple and open |
| **BiSS** and makers' own protocols | both ways on one or two pairs; CRC, alarms, temperature, an electronic nameplate | servo motors |
| Fieldbus and Ethernet (CANopen, PROFINET, EtherCAT, IO-Link) | the encoder is a network node | cranes, machines run by a PLC |
| 4–20 mA or 0–10 V | a signal proportional to position | valves, dampers, simple positions |

In **SSI** the receiver is the master. At rest the clock line is high; the first falling clock edge freezes the position; on each following rising edge the encoder puts out one bit, most significant first; after the last bit the data line is held for a *monoflop time* (typically some tens of microseconds) before a new frame may start. A 25-bit frame at 500 kHz takes about 52 µs plus that pause. The clock must slow down on long cables because each bit comes back after the round trip, about 10 ns per metre of cable: typically about 1 MHz up to a few tens of metres, a few hundred kHz at 100 m, around 100 kHz at several hundred metres (delay-compensating receivers go further).

**In the simulation:** read the disc with slightly misaligned detectors in binary and watch false positions flash up at the boundaries; switch to Gray and they vanish. Switch off, turn the shaft and switch on again with each multi-turn method. The SSI frame shows the clock and the bits of the present position.

> [!warn] After an encoder, motor or battery is replaced, or a battery alarm is ignored, the absolute position no longer matches the machine. Re-reference it following the drive's manual before running automatically — a wrong absolute position sends the axis confidently into a crash.

> [!key] An absolute encoder reads a number, not a count: it knows the position at power-up. Gray code keeps boundary readings honest; multi-turn versions count revolutions with gears, a battery or harvested energy; SSI and bidirectional protocols carry the number to the drive.
`,
  ideas: [
    'Every angle has its own code, so the position is known at switch-on without moving.',
    'With b bits a single-turn encoder resolves 2^b positions per revolution.',
    'Gray code changes one bit between neighbours, so a reading on a boundary can only be one of the two neighbours.',
    'Multi-turn encoders count revolutions by gears, a battery-backed counter or harvested energy.',
    'In SSI the receiver supplies the clock; longer cables need a slower clock.'
  ],
  pitfalls: [
    'An absolute encoder never needs referencing — It must be set up once, and again whenever the encoder, the motor or a flat battery breaks the link between its number and the machine.',
    'A single-turn encoder is enough for a linear axis — On a screw it repeats every revolution; beyond one turn of travel the position is ambiguous without a multi-turn count.',
    'Binary and Gray codes are equally good on a disc — Binary can read wildly wrong values at boundaries, because several bits change at once and the detectors never switch together.'
  ],
  formulas: [
    {
      name: 'Angle per position of a b-bit encoder',
      expr: 'dtheta = 2*pi/2^b', tex: '\\Delta\\theta = \\dfrac{2\\pi}{2^{b}}',
      vars: {
        dtheta: { name: 'angle per position', q: 'angle', unit: '″', tex: '\\Delta\\theta' },
        b: { name: 'single-turn bits', q: 'count', int: true, value: 17, min: 1, max: 32 }
      },
      stories: { dtheta: 'A servo motor carries a {b}-bit absolute encoder. What angle does one position represent?', b: 'An indexing table must be resolved to {dtheta}. How many single-turn bits are needed?' }
    },
    {
      name: 'Travel covered by a multi-turn encoder',
      expr: 'L = p*2^m', tex: 'L = p\\,2^{m}',
      vars: {
        L: { name: 'travel before the turn count repeats', q: 'length', unit: 'm' },
        p: { name: 'screw lead (travel per turn)', q: 'length', unit: 'mm', value: 5 },
        m: { name: 'multi-turn bits', q: 'count', int: true, value: 12, min: 1, max: 32 }
      },
      note: 'Include any gearbox: the encoder counts motor turns, not screw turns.',
      stories: { L: 'A {m}-bit multi-turn encoder drives a screw of lead {p}. How much travel can it cover absolutely?', m: 'An axis of {L} travel has a screw of lead {p}. How many multi-turn bits are needed?' }
    },
    {
      name: 'SSI frame time',
      expr: 't = (b + 1)/fc + tm', tex: 't = \\dfrac{b + 1}{f_c} + t_m',
      vars: {
        t: { name: 'time per position reading', q: 'time', unit: 'µs' },
        b: { name: 'bits in the frame', q: 'count', int: true, value: 25 },
        fc: { name: 'clock frequency', q: 'frequency', unit: 'kHz', value: 500, tex: 'f_c' },
        tm: { name: 'monoflop time', q: 'time', unit: 'µs', value: 20, tex: 't_m' }
      },
      note: 'One extra clock cycle to latch the position, then one per bit; the monoflop time must pass before the next frame.',
      stories: { t: 'A {b}-bit SSI encoder is read at {fc} with a monoflop time of {tm}. How long does one reading take?', fc: 'A controller must read a {b}-bit SSI encoder within {t}, with a monoflop time of {tm}. What clock is needed?' }
    }
  ],
  examples: [
    {
      title: 'Resolution and range on a linear axis',
      q: 'A 13-bit single-turn, 12-bit multi-turn encoder drives a ball screw of 10 mm lead directly. What is the travel per position, and how much travel does it cover?',
      steps: [
        'Positions per turn: $2^{13} = 8192$, so $10\\,\\text{mm}/8192 = 1.22\\,\\mu$m per position.',
        'Turns counted: $2^{12} = 4096$, so the range is $4096 \\times 10$ mm = 40.96 m.'
      ],
      a: 'About 1.2 µm per position over 41 m — far more than any ball screw.'
    },
    {
      title: 'An SSI link on a 100 m cable',
      q: 'A crane reads a 25-bit SSI encoder over 100 m of cable. Estimate the highest safe clock and the time per reading (monoflop 20 µs).',
      steps: [
        'Round trip: about 10 ns per metre of cable, so $100 \\times 10$ ns = 1 µs.',
        'The bit must be back before the receiver samples, about half a clock period later: $T/2 > 1\\,\\mu$s plus a margin for the electronics, so $f_c$ below roughly 450 kHz; choose 300 kHz.',
        'Frame: $t = 26/300\\,\\text{kHz} + 20\\,\\mu\\text{s} = 86.7 + 20 = 107\\,\\mu$s — about 9000 readings a second, plenty for a crane.'
      ],
      a: 'About 300 kHz; roughly 107 µs per reading.'
    },
    {
      title: 'What a misaligned binary disc reads',
      q: 'A 4-bit binary disc passes from 7 (0111) to 8 (1000), and the detector of the top bit switches slightly before the others. What can it read? And a Gray disc?',
      steps: [
        'For an instant the top bit is already 1 while the lower three are still 111: the reading is 1111 = 15.',
        'In Gray code 7 is 0100 and 8 is 1100: only the top bit changes, so the reading is 7 or 8 whatever the timing.'
      ],
      a: 'Binary can flash 15 (or other wrong values); Gray reads only 7 or 8.'
    }
  ],
  quiz: [
    { q: 'Why are absolute code discs made in Gray code?', choices: ['Only one bit changes between neighbouring positions, so boundary readings are never wild', 'Gray code needs fewer tracks', 'Gray code is faster to transmit', 'It doubles the resolution'], a: 0, why: 'Detectors never switch at exactly the same angle. With one bit changing, a boundary reading is either the old or the new position.' },
    { q: 'The battery of a battery-backed multi-turn servo encoder runs flat while the machine is switched off. What is lost?', choices: ['The count of revolutions; the angle within a turn is still read', 'Nothing', 'The angle within a turn; the turn count survives', 'The encoder\'s resolution'], a: 0, why: 'The single-turn code is read from the disc whenever power returns; only the turn counter needed the battery. The drive raises an alarm and the axis must be referenced.' },
    { q: 'In SSI, the encoder generates the clock.', a: false, why: 'The receiver (master) sends the clock; the encoder answers one bit per clock edge.' },
    { q: 'How many positions per turn does a 12-bit single-turn encoder resolve?', answer: 4096, why: '$2^{12} = 4096$, about 0.088° each.' },
    { q: 'An SSI encoder works at 1 MHz on a 10 m cable but gives garbage on a 200 m cable. The fix is to…', choices: ['lower the clock frequency', 'raise the clock frequency', 'remove the termination', 'use binary instead of Gray'], a: 0, why: 'Each bit returns after the cable\'s round-trip delay, about 2 µs for 200 m; the clock half-period must be longer than that.' }
  ],
  problems: [
    { q: 'What is the angle per position of a 20-bit single-turn encoder, in arc-seconds?', answer: 1.236, unit: '″', tol: 0.01, steps: ['One turn is $360 \\times 3600 = 1\\,296\\,000$ arc-seconds.', '$1\\,296\\,000 / 2^{20} = 1\\,296\\,000/1\\,048\\,576 = 1.236$″.'] },
    { q: 'A 32-bit SSI frame is clocked at 1 MHz with a 25 µs monoflop time. How long does each reading take?', answer: 58, unit: 'µs', tol: 0.01, steps: ['$t = (32 + 1)/1\\,\\text{MHz} + 25\\,\\mu\\text{s} = 33 + 25 = 58\\,\\mu$s.'] }
  ],
  choose: {
    good: [
      'Robots, vertical axes and long linear axes: no homing run, and the machine can resume after a power cut in mid-cycle.',
      'Rotary tables, cranes, gates, valves and steering angles, where the position must be known at switch-on.',
      'Safety functions that need a safe position (safely limited position, safe cams) — with a safety-rated encoder and drive.'
    ],
    avoid: [
      'Plain speed feedback or a PLC counter input: an [[incremental-encoders|incremental encoder]] is cheaper and needs no protocol.',
      'Controllers that do not speak the encoder\'s protocol: many servo encoders use their maker\'s own serial format.'
    ],
    check: [
      'Single-turn bits and the multi-turn range against the whole travel, gear ratios included.',
      'The interface the drive or PLC supports, the clock rate over your cable length and the update time.',
      'How the turns are kept: gears, a battery (life, alarm, replacement procedure) or energy harvesting.',
      'Mechanical fit, maximum speed, temperature, IP rating, and the procedure for setting the zero.'
    ]
  },
  applications: [
    'Industrial robots: battery-backed multi-turn encoders on every joint, so the arm knows its pose at power-up.',
    'Cranes, stage machinery and lock gates: multi-turn encoders with SSI or a fieldbus report hoist height and gate position to the PLC.',
    'Servo motors with a single-cable connection: the encoder\'s serial link also carries temperature, alarms and an electronic nameplate.'
  ],
  history: 'Frank Gray of Bell Telephone Laboratories patented the reflected binary code (US patent 2,632,058, *Pulse code communication*, granted 1953) for converting signals to digital form; a code of the same kind is usually traced back to Émile Baudot\'s printing telegraph of the 1870s. Its one-bit-at-a-time property made it the natural code for shaft encoders.',
  sources: [
    'ANSI/TIA/EIA-422, *Electrical characteristics of balanced voltage digital interface circuits* — the line levels under SSI.',
    'F. Gray, US patent 2,632,058, *Pulse code communication* (1953) — the reflected binary code.',
    'Encoder makers\' interface descriptions of SSI and the openly published BiSS protocol; cable-length figures here are typical guidance, not one product\'s ratings.'
  ],
  sim: 'fb-absolute'
},

{
  id: 'resolvers', parent: 'feedback-devices', title: 'Resolvers', level: 3,
  short: 'A resolver is a rotary transformer: an excited rotor winding induces AC in two stator windings at 90°, whose amplitudes follow the sine and the cosine of the shaft angle. With no electronics or optics inside it survives heat, shock and vibration; a resolver-to-digital converter turns the two signals into an angle and a speed.',
  keywords: ['resolver', 'rotary transformer', 'sine and cosine', 'excitation', 'carrier', 'transformation ratio', 'resolver-to-digital converter', 'RDC', 'tracking loop', 'multi-speed resolver', 'pole pairs', 'variable-reluctance resolver', 'brushless resolver', 'arc-minutes', 'EV traction motor', 'synchro'],
  prereq: ['physics:transformers', 'incremental-encoders', 'math:inverse-trig'],
  related: ['absolute-encoders', 'hall-sensors', 'foc-control', 'ac-servo-motors', 'pmsm-motor', 'motors-vehicles', 'pid-control', 'physics:faradays-law'],
  body: `
A resolver is a small rotary transformer whose coupling changes with angle. It has no electronics inside, no glass and no optics — only copper windings and laminated iron — so it shrugs off heat, vibration, shock, oil and radiation that would kill an optical encoder. Servo motors in harsh places, electric-vehicle traction motors, aircraft actuators and steel-mill drives use them.

### How it works
The rotor carries a winding fed with a sine-wave **excitation**, typically a few volts rms at 2–20 kHz. In a *brushless* resolver it reaches the rotor through a small rotary transformer, so nothing rubs. The stator carries two windings at 90° to each other. The rotor's alternating field induces a voltage in each, as in a transformer secondary, scaled by how well it lines up with that winding:

$$V_s = k\\,V_r\\sin\\theta \\qquad V_c = k\\,V_r\\cos\\theta$$

Both outputs are the carrier at the excitation frequency; only their [[?amplitude|amplitudes]] change with the shaft angle $\\theta$ — the envelope of one traces $\\sin\\theta$, of the other $\\cos\\theta$, and past 180° the carrier flips its [[?phase|phase]]. $k$, the transformation ratio, is typically 0.3–0.5. The angle comes back as the [[?inverse-trig|inverse tangent]] of $V_s/V_c$, with the signs giving the quadrant. A ratio does not care about anything that scales both signals alike — the excitation amplitude, temperature, the cable's resistance — which is much of the resolver's robustness.

A **variable-reluctance resolver** has no rotor winding at all: a lobed iron rotor changes the coupling between excitation and output windings, all on the stator. It is the cheapest and toughest form, used on many electric-car motors.

### Resolver-to-digital conversion
A resolver-to-digital converter (RDC) demodulates the two signals and runs a **tracking loop**: it keeps its own estimate $\\phi$ of the angle, forms $\\sin\\theta\\cos\\phi - \\cos\\theta\\sin\\phi = \\sin(\\theta - \\phi)$ and drives it to zero through two integrators — a small servo loop in a chip or in the drive's firmware. It delivers 10 to 16 bits of angle and a velocity signal for free, and drives often emulate A/B/Z pulses from it for the controller. Being a loop it has a bandwidth, typically hundreds of hertz to a few kilohertz, and it lags while the shaft accelerates.

### Speed and poles
A one-speed (1X) resolver gives one sine cycle per turn. A **multi-speed** resolver with $p$ pole pairs gives $p$ electrical cycles per turn: 2X, 3X and 4X resolvers match the servo motor's poles, so the angle read is exactly the electrical angle that [[foc-control|field-oriented control]] needs. The excitation must stay far faster than the electrical rotation: a 4X resolver at 12 000 rpm makes 800 electrical cycles a second, well below a 10 kHz carrier.

### Accuracy in practice
| Source | What it does | Typical size |
|---|---|---|
| Winding and magnetic tolerances | error repeating a few times a turn | ±5 to ±15 arc-minutes for industrial resolvers; a few arc-minutes for precision types |
| Sine and cosine amplitudes unequal by $\\varepsilon$ | error at twice the angle, peak $\\varepsilon/2$ rad | 1 % gives about 17 arc-minutes |
| Windings not exactly 90° apart | error at twice the angle | about half the quadrature error |
| Tracking lag | error while accelerating | grows with acceleration, falls with loop bandwidth squared |
| Eccentric mounting | error once a turn | depends on the air gap |

Ten arc-minutes on a radius of 100 mm is 0.29 mm — ample for commutation and speed control, coarse for a machine-tool axis, which is why precision axes add a linear scale or use a high-resolution encoder. Wire the excitation and each output as a twisted, shielded pair; the RDC compensates the small phase shift the windings add.

**In the simulation:** watch the two carriers swell and shrink with the angle, then the RDC's estimate chase the shaft. Accelerate the shaft and see the tracking error jump; unbalance the windings and see the error ripple twice per electrical turn.

> [!warn] On a synchronous servo motor the resolver's angle is the commutation angle. A replacement resolver mounted at a different angle, or a lost offset, makes the motor weak, noisy or liable to run away. Set the offset exactly as the drive manual describes, with the load secured and the axis free to turn safely.

> [!key] A resolver encodes angle in the amplitudes of two AC signals, $\\sin\\theta$ and $\\cos\\theta$; their ratio gives the angle, immune to anything that scales both. Rugged and absolute within one electrical turn, it is read by a tracking loop with a finite bandwidth.
`,
  ideas: [
    'The excited rotor induces carrier voltages in two stator windings, with amplitudes k·Vr·sin θ and k·Vr·cos θ.',
    'The angle is the inverse tangent of their ratio, so common scaling errors cancel.',
    'A tracking resolver-to-digital converter is a small servo loop: it gives angle and speed, and lags under acceleration.',
    'A p-speed resolver gives p electrical cycles per turn, matched to the motor\'s pole pairs.',
    'Resolvers are rugged and absolute within one electrical turn, but coarser than good optical encoders.'
  ],
  pitfalls: [
    'A resolver gives a DC voltage proportional to angle — Its outputs are AC at the excitation frequency; the angle is in their envelopes and must be demodulated.',
    'The excitation voltage must be held exactly constant — The angle comes from the ratio of the two outputs, so moderate changes in excitation cancel out.',
    'A resolver knows the absolute position of a multi-turn axis — It is absolute only within one electrical cycle; turns must be counted.'
  ],
  formulas: [
    {
      name: 'Sine output of a resolver',
      expr: 'Vs = k*Vr*sin(theta)', tex: 'V_s = k\\,V_r\\sin\\theta',
      vars: {
        Vs: { name: 'amplitude of the sine winding\'s output', q: 'voltage', unit: 'V', tex: 'V_s' },
        k: { name: 'transformation ratio', value: 0.5 },
        Vr: { name: 'excitation amplitude', q: 'voltage', unit: 'V', value: 7, tex: 'V_r' },
        theta: { name: 'shaft (electrical) angle', q: 'angle', unit: '°', value: 30, min: 0, max: 90 }
      },
      note: 'The cosine winding gives k·Vr·cos θ; together they fix the angle in all four quadrants.',
      stories: { Vs: 'A resolver with ratio {k} is excited at {Vr}. What amplitude appears on the sine winding at {theta}?', theta: 'The sine winding shows {Vs} with ratio {k} and excitation {Vr}. What is the angle (first quadrant)?' }
    },
    {
      name: 'Electrical frequency of a multi-speed resolver',
      expr: 'fe = p*n', tex: 'f_e = p\\,n',
      vars: {
        fe: { name: 'electrical frequency of the envelopes', q: 'frequency', unit: 'Hz', tex: 'f_e' },
        p: { name: 'speed (pole pairs)', q: 'count', int: true, value: 4 },
        n: { name: 'shaft speed', q: 'frequency', unit: 'rpm', value: 12000 }
      },
      note: 'Keep the excitation frequency many times higher (ten or more).',
      stories: { fe: 'A {p}X resolver turns at {n}. How fast do its envelopes cycle?', n: 'The envelopes of a {p}X resolver may cycle at most at {fe}. What is the top shaft speed?' }
    },
    {
      name: 'Linear error from an angle error',
      expr: 's = r*dtheta', tex: 's = r\\,\\Delta\\theta',
      vars: {
        s: { name: 'error at the radius', q: 'length', unit: 'mm' },
        r: { name: 'radius (tool, arm or pulley)', q: 'length', unit: 'mm', value: 100 },
        dtheta: { name: 'angle error', q: 'angle', unit: '′', value: 10, tex: '\\Delta\\theta' }
      },
      note: 'The angle is taken in radians inside the formula; arc-minutes are converted for you.',
      stories: { s: 'A resolver is accurate to {dtheta}. What does that mean at a radius of {r}?', dtheta: 'A rotary axis of radius {r} must be accurate to {s}. What angular accuracy is needed?' }
    },
    {
      name: 'Error from unequal sine and cosine amplitudes',
      expr: 'dtheta = eps/2', tex: '\\Delta\\theta = \\dfrac{\\varepsilon}{2}',
      vars: {
        dtheta: { name: 'peak angle error', q: 'angle', unit: '′', tex: '\\Delta\\theta' },
        eps: { name: 'amplitude imbalance', q: 'ratio', unit: '%', value: 1, tex: '\\varepsilon' }
      },
      note: 'A small-imbalance result in radians; the error peaks at 45°, 135°, … electrical and repeats twice per electrical cycle.',
      stories: { dtheta: 'The sine output of a resolver is {eps} larger than the cosine. What is the peak angle error?', eps: 'The error budget allows {dtheta} from amplitude imbalance. How closely must the amplitudes match?' }
    }
  ],
  examples: [
    {
      title: 'Reading an angle from the two amplitudes',
      q: 'After demodulation a resolver gives $V_s$ = +1.20 V and $V_c$ = −2.10 V. What is the angle, and what is $kV_r$?',
      steps: [
        'The sine is positive and the cosine negative: the second quadrant.',
        '$\\arctan(1.20/2.10) = 29.7°$, so $\\theta = 180° - 29.7° = 150.3°$.',
        '$k V_r = \\sqrt{1.20^2 + 2.10^2} = 2.42$ V — the same whatever the angle, which is a useful check of the wiring.'
      ],
      a: 'θ ≈ 150.3°, with kV_r ≈ 2.42 V.'
    },
    {
      title: 'A resolver on a traction motor',
      q: 'A 4-pole-pair traction motor with a 4X resolver runs at 14 000 rpm; the resolver is accurate to ±10 arc-minutes (mechanical) and excited at 10 kHz. Is the carrier fast enough, and how much torque does the angle error cost?',
      steps: [
        'Electrical frequency: $f_e = 4 \\times 14\\,000/60 = 933$ Hz — the carrier makes about 11 cycles per electrical cycle, enough for demodulation.',
        'Electrical angle error: $4 \\times 10\' = 40\' = 0.67°$.',
        'The torque falls with the cosine of the current-angle error: $\\cos 0.67° = 0.99993$ — a loss of less than 0.01 %.'
      ],
      a: 'Yes; the torque loss from the angle error is negligible.'
    }
  ],
  quiz: [
    { q: 'Why does a small drop in excitation voltage not change the angle a resolver reports?', choices: ['The angle comes from the ratio of the sine and cosine outputs, and both drop together', 'The converter measures the excitation and corrects', 'The rotor winding regulates itself', 'It does change the angle, by the same percentage'], a: 0, why: 'θ = arctan(V_s/V_c): a common factor cancels. Only unequal changes in the two outputs create an error.' },
    { q: 'What does the output of a resolver\'s sine winding look like as the shaft turns slowly?', choices: ['A carrier at the excitation frequency whose amplitude follows sin θ', 'A DC voltage proportional to θ', 'A square wave with one pulse per degree', 'A sine wave at the shaft frequency with no carrier'], a: 0, why: 'It is a transformer secondary: it carries the excitation frequency, and the coupling — hence the amplitude — changes with the angle.' },
    { q: 'A resolver contains semiconductor electronics that limit its working temperature.', a: false, why: 'A resolver is only windings and iron; the electronics sit in the drive. That is why resolvers work where encoders cannot.' },
    { q: 'When does the tracking error of a resolver-to-digital converter grow?', choices: ['While the shaft accelerates', 'At constant high speed', 'When the shaft stands still', 'Only when the excitation stops'], a: 0, why: 'A type-II tracking loop follows a constant speed with no steady error; acceleration makes it lag, by an amount set by its bandwidth.' },
    { q: 'A 3X resolver gives how many electrical cycles per mechanical revolution?', answer: 3, why: 'An n-speed resolver repeats its sine and cosine n times per turn.' }
  ],
  problems: [
    { q: 'A 2X resolver turns at 6000 rpm. At what frequency do its envelopes cycle?', answer: 200, unit: 'Hz', tol: 0.01, steps: ['$f_e = p n = 2 \\times 6000/60 = 200$ Hz.'] },
    { q: 'A resolver on a rotary table is accurate to 8 arc-minutes. What is the error at a radius of 250 mm?', answer: 0.582, unit: 'mm', tol: 0.01, steps: ['$\\Delta\\theta = 8/60 \\times \\pi/180 = 2.327\\times10^{-3}$ rad.', '$s = 250 \\times 2.327\\times10^{-3} = 0.582$ mm.'] }
  ],
  choose: {
    good: [
      'Heat, shock, vibration, oil and radiation: foundries, steel mills, mobile machines, aerospace.',
      'Commutation and speed feedback of synchronous and traction motors, with a resolver speed matched to the poles.',
      'Long service lives with no optical parts to soil and no electronics in the motor.'
    ],
    avoid: [
      'Micrometre positioning on large radii: add a linear scale or use a high-resolution encoder.',
      'Multi-turn absolute position without a turn counter or a homing run.',
      'Small low-cost motors where [[hall-sensors|Hall sensors]] or a small encoder are enough.'
    ],
    check: [
      'The speed (1X or pole-matched), transformation ratio, excitation voltage and frequency against what the drive provides.',
      'The accuracy in arc-minutes against your needs, and the converter\'s resolution and bandwidth.',
      'Temperature range, housed or frameless mounting, and the concentricity the frameless parts need.',
      'Twisted, shielded pairs for excitation and outputs, and the drive\'s commutation-offset procedure.'
    ]
  },
  applications: [
    'Electric and hybrid cars: variable-reluctance resolvers read the rotor angle of the traction motor for field-oriented control.',
    'Servo motors for presses, foundries and outdoor machines, where an optical encoder would not last.',
    'Aircraft actuators and radar or antenna pedestals, where the sensor must survive temperature extremes and vibration.'
  ],
  history: 'Synchros and resolvers — rotary transformers that carry a shaft angle as AC signals — transmitted angles in naval and anti-aircraft fire-control systems before and during the Second World War. Tracking converters later let the same rugged sensors feed digital servo drives.',
  sources: [
    'Semiconductor makers\' data sheets and application notes on resolver-to-digital converters: excitation, the tracking loop and the error terms.',
    'Servo-drive manuals: resolver inputs, transformation ratios and commutation-offset procedures; the figures here are typical ranges.'
  ],
  sim: 'fb-resolver'
},

{
  id: 'hall-sensors', parent: 'feedback-devices', title: 'Hall-effect sensors', level: 2,
  short: 'A Hall sensor turns a magnetic field into a voltage. Switches and latches with open-drain outputs tell a brushless motor\'s drive which phases to energise — three of them give six states per electrical cycle — and count gear teeth for speed; linear and angle versions measure current and angle without contact.',
  keywords: ['Hall effect', 'Hall sensor', 'Hall switch', 'Hall latch', 'unipolar', 'bipolar', 'linear Hall sensor', 'operate point', 'release point', 'hysteresis', 'open drain', 'pull-up', 'BLDC commutation', '120 degrees', '60 degrees', 'Hall states', 'gear-tooth sensor', 'magnetic angle sensor'],
  prereq: ['physics:hall-effect', 'bldc-motor', 'electronics:pull-resistors'],
  related: ['hall-commutation', 'sensorless-control', 'resolvers', 'incremental-encoders', 'proximity-sensors', 'electronics:hall-sensors', 'pneumatics:sensors-pneu'],
  body: `
Push a current through a thin semiconductor plate in a magnetic field and the moving charges are pushed sideways by the magnetic force; a small voltage appears across the plate — the **Hall voltage**, [[?proportional|proportional]] to the current and to the field:

$$V_H = \\frac{I\\,B}{n\\,e\\,t}$$

where $n$ is the density of charge carriers and $t$ the plate's thickness. Metals have so many carriers that the voltage is useless; a lightly doped semiconductor a few micrometres thick gives millivolts in tens of millitesla. A **Hall IC** puts the plate, an amplifier, a comparator with hysteresis and an output transistor on one chip in a three-pin package, running from about 3 to 24 V.

### Kinds of Hall sensor
| Type | Output | Behaviour | Typical uses |
|---|---|---|---|
| Unipolar switch | on/off | on when one pole comes close ($B > B_{op}$), off when it leaves ($B < B_{rp}$) | door and lid sensors, cylinder position switches |
| Latch | on/off | on at a south pole, stays on until a north pole turns it off | brushless-motor commutation, multipole ring speed sensors |
| Linear | analogue | output voltage proportional to $B$, centred at half the supply | current sensors, position, joysticks, pedals |
| Angle sensor | digital or analogue | an array under a magnet on the shaft end reads its direction, 12–14 bits | magnetic encoders, steering and throttle angles |
| Gear-tooth sensor | on/off | a magnet behind the chip; steel teeth passing change the field | wheel speed, crankshafts, gear speed |

The operate and release points $B_{op}$ and $B_{rp}$ are typically a few to a few tens of millitesla apart — the hysteresis stops chatter. Most switches and latches have an **open-drain output**: the transistor pulls the line to 0 V when active and lets go otherwise, so a **pull-up resistor** (typically 1–10 kΩ) to the logic supply makes the high level. Without it the line floats and reads whatever noise it picks up.

### Commutation of brushless motors
Three latches placed 120° electrical apart read the rotor magnets or a separate magnet ring. Each gives a square wave with 50 % duty per electrical cycle; together they make six codes per electrical cycle, each telling the drive which two phases to energise ([[hall-commutation|six-step commutation]]). With $p$ pole pairs there are $6p$ states per turn: a motor with 4 pole pairs has 24 states, 15° each. Mechanically the sensors sit $120°/p$ apart (30° on that motor), or that plus whole pole-pair pitches.

| Step | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| H1 H2 H3 | 101 | 100 | 110 | 010 | 011 | 001 |
| Phases driven | A+ B− | A+ C− | B+ C− | B+ A− | C+ A− | C+ B− |

(The order and the phase pairs depend on the motor; follow its data.) With 120° spacing, **000 and 111 never occur**: a drive that reads them reports a Hall fault — usually a broken wire, a missing supply or a missing pull-up. Some motors use 60° spacing, which gives a different code set; drives have a setting for it.

### Resolution and real life
Six states per electrical cycle are enough to start a motor with full torque from standstill — where [[sensorless-control|sensorless control]] cannot see any back-EMF — but not for positioning: 15° steps. Servo motors use an encoder and use Halls, if at all, only to find the first commutation angle. A misplaced sensor shifts its edges: a few electrical degrees raises torque ripple, current and noise, and the edges become unevenly spaced — the simulation shows it. Heat moves the thresholds and weakens the magnets (roughly −0.1 to −0.2 % per kelvin), which latches tolerate well. Hall wires running in a motor cable pick up PWM spikes that fake state changes: use a separate shielded cable, and small RC filters at the drive's inputs.

**In the simulation:** watch each latch switch as the rotor field crosses its thresholds, read the six codes and the phases they select, change the pole pairs, misplace a sensor, and remove the pull-ups.

> [!warn] Connecting the Halls or phases of a brushless motor in the wrong order can make it lurch, run backwards or draw heavy current. Check the sequence against the motor's data, test with the load uncoupled and the current limit low, and keep hands clear of the shaft.

> [!key] A Hall sensor reads a magnetic field without contact. Three latches 120° electrical apart give six codes per electrical cycle — enough to commutate a brushless motor from standstill, never 000 or 111 — but far too coarse for positioning.
`,
  ideas: [
    'The Hall voltage is proportional to the current and to the magnetic field, and large only in thin semiconductors.',
    'Switches and latches have hysteresis between their operate and release points, and usually open-drain outputs that need a pull-up.',
    'Three latches 120° electrical apart give six states per electrical cycle, 6p per revolution.',
    'With 120° spacing the codes 000 and 111 cannot occur; reading them means a fault.',
    'Hall commutation starts a motor from standstill, but its resolution is far too coarse for positioning.'
  ],
  pitfalls: [
    'A Hall switch outputs a voltage by itself — Most have open-drain outputs: without a pull-up resistor the line floats.',
    'Hall sensors are enough to position a brushless servo — Six states per electrical cycle means steps of 15° on a 4-pole-pair motor; positioning needs an encoder or resolver.',
    'Any three sensors in any order will do — The spacing and the order must match the drive\'s commutation table, or the motor runs roughly, backwards or not at all.'
  ],
  formulas: [
    {
      name: 'Hall voltage',
      expr: 'VH = I*B/(nd*qe*t)', tex: 'V_H = \\dfrac{I\\,B}{n\\,e\\,t}',
      vars: {
        VH: { name: 'Hall voltage', q: 'voltage', unit: 'mV', tex: 'V_H' },
        I: { name: 'current through the plate', q: 'current', unit: 'mA', value: 1 },
        B: { name: 'magnetic field', q: 'bfield', unit: 'mT', value: 50 },
        nd: { name: 'charge-carrier density', q: 'numberdensity', unit: '1/cm³', value: 1e16, tex: 'n' },
        qe: { const: 'qe' },
        t: { name: 'plate thickness', q: 'length', unit: 'µm', value: 10 }
      },
      note: 'Few carriers and a thin plate give a large voltage; that is why sensors are semiconductors.',
      stories: { VH: 'A Hall plate {t} thick with {nd} carriers carries {I} in {B}. What Hall voltage appears?', B: 'A Hall plate {t} thick with {nd} carriers and {I} shows {VH}. What is the field?' }
    },
    {
      name: 'Frequency of one Hall signal',
      expr: 'f = p*n', tex: 'f = p\\,n',
      vars: {
        f: { name: 'Hall signal frequency', q: 'frequency', unit: 'Hz' },
        p: { name: 'pole pairs', q: 'count', int: true, value: 4 },
        n: { name: 'shaft speed', q: 'frequency', unit: 'rpm', value: 3000 }
      },
      note: 'The code changes six times as often: every 60° electrical.',
      stories: { f: 'A brushless motor with {p} pole pairs turns at {n}. What frequency does each Hall sensor give?', n: 'Each Hall sensor of a {p}-pole-pair motor shows {f}. How fast does it turn?' }
    },
    {
      name: 'Angle per Hall state',
      expr: 'dtheta = 2*pi/(6*p)', tex: '\\Delta\\theta = \\dfrac{2\\pi}{6p}',
      vars: {
        dtheta: { name: 'mechanical angle per state', q: 'angle', unit: '°', tex: '\\Delta\\theta' },
        p: { name: 'pole pairs', q: 'count', int: true, value: 4 }
      },
      stories: { dtheta: 'A brushless motor has {p} pole pairs and three Hall sensors. How far does it turn per Hall state?' }
    }
  ],
  examples: [
    {
      title: 'Hall signals of an 8-pole motor',
      q: 'A brushless motor with 8 poles (4 pole pairs) runs at 3000 rpm. Find the frequency of each Hall signal, the rate of state changes, the angle per state and the mechanical spacing of the sensors.',
      steps: [
        '$f = p n = 4 \\times 50 = 200$ Hz per sensor.',
        'Six states per electrical cycle: $6 \\times 200 = 1200$ state changes a second.',
        'States per turn: $6p = 24$, so 15° each.',
        '120° electrical is $120°/4 = 30°$ mechanical (or 30° plus multiples of 90°).'
      ],
      a: '200 Hz per sensor, 1200 changes/s, 15° per state, sensors 30° apart.'
    },
    {
      title: 'A Hall fault',
      q: 'A drive reports the Hall code 111 on a motor wired for 120° sensors, and the motor jerks. What is likely?',
      steps: [
        'With 120° spacing the three signals are never all high at once, so 111 is impossible in normal running.',
        'Open-drain outputs read high when nothing pulls them low: a missing sensor supply, a broken ground or disconnected sensors all read 1.',
        'Check the Hall supply and ground first, then each signal with the shaft turned slowly by hand, power off the motor phases.'
      ],
      a: 'Probably a lost Hall supply or ground (or broken wiring): all outputs float high.'
    }
  ],
  quiz: [
    { q: 'Which two codes never appear from three Hall latches spaced 120° electrical apart?', choices: ['000 and 111', '101 and 010', '100 and 011', '001 and 110'], a: 0, why: 'Each signal is high for half an electrical cycle, offset by a third of a cycle; at any moment one or two are high, never none or all three.' },
    { q: 'A Hall switch with an open-drain output is wired to a controller input with no pull-up. What happens?', choices: ['The line floats when the switch is off and reads noise', 'It works normally', 'The sensor burns out', 'The output is inverted'], a: 0, why: 'An open drain can only pull low; something must pull the line high. Many drives have internal pull-ups — check.' },
    { q: 'Hall sensors give enough resolution to position a servo axis to a hundredth of a degree.', a: false, why: 'Six states per electrical cycle: 15° steps on a 4-pole-pair motor. They are for commutation and coarse speed.' },
    { q: 'For a ring of alternating north and south poles, which Hall type gives a clean square wave?', choices: ['A latch', 'A unipolar switch', 'A linear sensor', 'Any of them unchanged'], a: 0, why: 'A latch turns on at one pole and off at the opposite pole, so each pole pair gives one full cycle with 50 % duty.' },
    { q: 'How many Hall states per mechanical revolution does a motor with 2 pole pairs have?', answer: 12, why: '6 per electrical cycle × 2 electrical cycles per turn.' }
  ],
  problems: [
    { q: 'A 10-pole brushless motor (5 pole pairs) turns at 1200 rpm. What frequency does each Hall sensor give?', answer: 100, unit: 'Hz', tol: 0.01, steps: ['$f = p n = 5 \\times 1200/60 = 100$ Hz.'] },
    { q: 'A drone outrunner has 14 poles. What mechanical angle does one Hall state represent?', answer: 8.57, unit: '°', tol: 0.01, steps: ['Pole pairs $p = 7$; states per turn $6p = 42$.', '$360°/42 = 8.57°$.'] }
  ],
  choose: {
    good: [
      'Commutation of brushless motors that must start under load from standstill.',
      'Contactless switching and speed sensing: gear teeth, magnet rings, cylinder positions, lids and doors.',
      'Compact absolute angle sensing with an on-axis magnet (magnetic encoders), and current sensing with linear sensors.'
    ],
    avoid: [
      'Precise positioning: the resolution is coarse unless an interpolating angle sensor is used.',
      'Strong stray fields — near busbars, magnetic chucks and welding — that shift the switching points.',
      'Temperatures beyond the IC\'s rating, often 125–150 °C: a [[resolvers|resolver]] survives more.'
    ],
    check: [
      'Switch, latch or linear; the operate and release points against the magnet\'s field at your air gap and temperature.',
      'Output type and supply: open drain with a pull-up, 5 V or 24 V.',
      '120° or 60° spacing and the sequence the drive expects.',
      'Cabling away from motor leads, and filtering at the inputs.'
    ]
  },
  applications: [
    'Brushless fans, pumps, e-bike hub motors and small BLDC gearmotors: three Hall latches commutate the motor.',
    'Wheel-speed and crankshaft sensors in cars: gear-tooth Hall sensors count the teeth of a steel ring.',
    'Pneumatic cylinders: magnetic position switches clamped on the barrel (see [[pneumatics:sensors-pneu]]).',
    'Current sensors in drives and chargers: a linear Hall sensor in the gap of a magnetic core around the conductor.'
  ],
  history: 'Edwin Hall discovered the effect in 1879 as a graduate student at Johns Hopkins University, using a thin gold leaf. Practical sensors had to wait for semiconductors, whose far lower carrier density gives a much larger voltage; integrated Hall switches became everyday parts of motors, cars and keyboards.',
  sources: [
    'E. H. Hall, "On a New Action of the Magnet on Electric Currents", *American Journal of Mathematics* (1879) — the discovery.',
    'Hall-sensor makers\' data sheets and brushless-motor data: operate and release points, open-drain outputs, commutation tables; the values here are typical.'
  ],
  sim: 'fb-hall'
},

{
  id: 'tachogenerators', parent: 'feedback-devices', title: 'Tachogenerators', level: 2,
  short: 'A tachogenerator is a small generator on the shaft whose voltage is proportional to speed — a DC tacho reverses its polarity with the direction. It was the speed sensor of analogue DC drives and servos; today most drives compute speed from an encoder instead, trading the tacho\'s ripple and brushes for the encoder\'s counting steps.',
  keywords: ['tachogenerator', 'tacho', 'tachometer generator', 'DC tacho', 'AC tacho', 'volts per 1000 rpm', 'V/krpm', 'speed feedback', 'ripple', 'linearity', 'tacho loss', 'speed from encoder', 'period measurement', 'speed resolution', 'drag-cup'],
  prereq: ['back-emf', 'motor-generator-duality', 'incremental-encoders'],
  related: ['dc-motor-drivers', 'dc-servo-motors', 'pid-control', 'servo-tuning', 'brushes-commutator', 'pmdc-motor', 'physics:generators'],
  body: `
A tachogenerator is a small generator mounted on the motor shaft, giving a voltage [[?proportional|proportional]] to speed. Before encoders and fast processors it was the speed sensor of every analogue DC drive and servo, and it still turns up on older machines, large DC drives, and wherever an analogue speed signal without electronics is wanted.

### The DC tachogenerator
A permanent-magnet DC tacho is a small DC motor run as a generator. Turning, its armature produces the [[back-emf]]:

$$V = K_g\\,\\omega$$

positive one way and negative the other, so the direction comes free. Constants typically lie between a few volts and about 60 V per 1000 rpm; the drive's input scaling must match the voltage at top speed. Good tachos are linear to a fraction of a per cent over their range. What spoils the signal:
- **Ripple.** The commutator switches from coil to coil, so the voltage carries a ripple at the segment frequency, typically 1–5 % peak-to-peak in ordinary units and well under 1 % in precision ones. Filtering it adds lag to the speed loop.
- **Loading.** The armature resistance, tens to hundreds of ohms, forms a divider with the input: $V_L = K_g\\omega\\,R_L/(R_L + R_a)$. Inputs of 10 kΩ or more keep the error small.
- **Temperature.** Magnets weaken as they warm, shifting the constant unless compensated.
- **Brushes.** They wear, add a small contact drop that matters at very low speed, and need replacing; precision tachos use silver brushes and commutators.

### AC tachogenerators
A **permanent-magnet AC tacho** is a small alternator: both its amplitude and its frequency rise with speed. The frequency is an excellent speed measure; a rectified amplitude gives a DC signal but loses the direction. A **drag-cup (induction) tacho** has an excitation winding and an output winding at 90°; a thin conducting cup spinning between them induces an output at the excitation frequency whose amplitude follows the speed and whose phase gives the direction — the classic sensor of analogue instrument servos.

### Speed from an encoder instead
Modern drives compute speed from the [[incremental-encoders|encoder]] already on the motor. Counting edges in a fixed window $T_w$ with $N_c$ counts per turn gives steps of $\\Delta n = 1/(N_c T_w)$: with 4000 counts a turn and a 1 ms window, one count more or less is 15 rpm — fine at 3000 rpm, useless at 20 rpm. At low speed drives time the interval between edges instead, filter, or use sin/cos encoders interpolated to millions of counts.

| | DC tacho | Speed from an encoder |
|---|---|---|
| Signal | continuous analogue, with ripple | numbers in steps, no drift |
| Low speed | smooth but noisy near zero | coarse unless period-measured or interpolated |
| Direction | polarity | A/B order |
| Wear | brushes | none |
| Position | none | yes, from the same device |
| Failure | a broken wire reads zero speed | a count error or an encoder alarm |

### Real life
Couple the tacho stiffly: a soft coupling puts a torsional resonance inside the speed loop and the drive oscillates. Run its wires as a shielded twisted pair away from the armature cable. And respect the worst failure: if the tacho wire breaks, the drive sees zero speed and raises the voltage to catch up — the motor runs away to full speed. Drives with tacho feedback have a tacho-loss monitor for this reason.

**In the simulation:** watch the tacho voltage follow the speed and change sign with the direction, see the commutator ripple and what a filter does to it, load the output, and compare with the speed an encoder gives when counting in a short window.

> [!warn] A lost or reversed tacho signal makes a speed-controlled drive run away. Never bypass the tacho-loss protection, check the polarity before the first run with the load uncoupled, and keep the motor's overspeed protection in place.

> [!key] A tachogenerator gives a voltage proportional to speed, with sign for direction — continuous, but with ripple, loading errors and brushes. An encoder gives speed in counting steps that are coarse at low speed, plus position; that is why it has replaced the tacho in new drives.
`,
  ideas: [
    'A DC tacho is a small generator: V = K_g ω, with the polarity giving the direction.',
    'Commutator ripple, loading by the input, temperature and brush wear limit its accuracy.',
    'AC tachos give amplitude and frequency proportional to speed; the drag-cup type gives direction by phase.',
    'Speed from an encoder is quantised: one count per window is 1/(N_c T_w) — coarse at low speed.',
    'A broken tacho wire looks like zero speed, and a speed loop then drives the motor to full speed.'
  ],
  pitfalls: [
    'A heavier filter on the tacho always helps — It removes ripple but adds lag inside the speed loop, forcing a lower gain or causing oscillation.',
    'Speed from an encoder is exact — It comes in steps of one count per measuring window; at low speed that step can be larger than the speed itself.',
    'If the tacho fails the motor just stops — The drive sees zero speed and increases the voltage: the motor runs away unless tacho-loss protection trips.'
  ],
  formulas: [
    {
      name: 'Tacho voltage',
      expr: 'V = K*w', tex: 'V = K_g\\,\\omega',
      vars: {
        V: { name: 'tacho voltage (no load)', q: 'voltage', unit: 'V', signed: true },
        K: { name: 'tacho constant', q: 'kemf', unit: 'V/krpm', value: 20, tex: 'K_g' },
        w: { name: 'shaft speed', q: 'angvel', unit: 'rpm', value: 3000, signed: true, tex: '\\omega' }
      },
      note: 'Negative speed (reverse) gives negative voltage.',
      stories: { V: 'A {K} tacho turns at {w}. What voltage does it give?', K: 'A drive\'s tacho input reads {V} at full scale and the motor tops out at {w}. What tacho constant fits?' }
    },
    {
      name: 'Loaded tacho voltage',
      expr: 'VL = K*w*RL/(RL + Ra)', tex: 'V_L = K_g\\,\\omega\\,\\dfrac{R_L}{R_L + R_a}',
      vars: {
        VL: { name: 'voltage at the drive input', q: 'voltage', unit: 'V', tex: 'V_L' },
        K: { name: 'tacho constant', q: 'kemf', unit: 'V/krpm', value: 20, tex: 'K_g' },
        w: { name: 'shaft speed', q: 'angvel', unit: 'rpm', value: 3000, tex: '\\omega' },
        RL: { name: 'input (load) resistance', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_L' },
        Ra: { name: 'tacho armature resistance', q: 'resistance', unit: 'Ω', value: 200, tex: 'R_a' }
      },
      stories: { VL: 'A {K} tacho with armature resistance {Ra} feeds a {RL} input at {w}. What voltage does the drive see?', RL: 'A {K} tacho ({Ra}) must deliver at least {VL} at {w}. What input resistance is needed?' }
    },
    {
      name: 'Speed step of an encoder counted in a window',
      expr: 'dn = 1/(Nc*Tw)', tex: '\\Delta n = \\dfrac{1}{N_c\\,T_w}',
      vars: {
        dn: { name: 'speed per count', q: 'frequency', unit: 'rpm', tex: '\\Delta n' },
        Nc: { name: 'counts per revolution (after ×4)', q: 'count', int: true, value: 4000, tex: 'N_c' },
        Tw: { name: 'measuring window', q: 'time', unit: 'ms', value: 1, tex: 'T_w' }
      },
      note: 'One count more or less in the window changes the reading by this much.',
      stories: { dn: 'A drive counts a {Nc}-count encoder over {Tw}. How coarse is its speed reading?', Tw: 'A {Nc}-count encoder must resolve {dn}. How long must the counting window be?' }
    }
  ],
  examples: [
    {
      title: 'Matching a tacho to a drive input',
      q: 'A DC drive\'s speed input is scaled for 60 V at full speed; the motor tops out at 3000 rpm. Which tacho constant fits, and what does the drive see at 1000 rpm through a 10 kΩ input if the tacho has 200 Ω?',
      steps: [
        '$K_g = 60\\,\\text{V}/3\\,\\text{krpm} = 20$ V/krpm.',
        'At 1000 rpm the open-circuit voltage is 20 V.',
        'Loaded: $20 \\times 10\\,000/10\\,200 = 19.6$ V — 2 % low, a fixed error the scaling can absorb, but one that changes as the armature warms.'
      ],
      a: '20 V/krpm; about 19.6 V at 1000 rpm.'
    },
    {
      title: 'An encoder at low speed',
      q: 'A servo has a 2500-PPR encoder (10 000 counts a turn) and computes speed every 1 ms by counting. What is the speed step, and how good is the reading at 30 rpm?',
      steps: [
        '$\\Delta n = 1/(10\\,000 \\times 0.001) = 0.1$ rev/s = 6 rpm.',
        'At 30 rpm the window holds $10\\,000 \\times 0.5 \\times 0.001 = 5$ counts, so the reading jumps between 24, 30 and 36 rpm — ±20 %.',
        'Remedies: time the edges (period measurement), average over more windows (adding lag), or a sin/cos encoder interpolated to far more counts.'
      ],
      a: '6 rpm per count; at 30 rpm the raw reading wanders by ±20 %.'
    }
  ],
  quiz: [
    { q: 'A DC tacho\'s motor reverses. Its output voltage…', choices: ['changes sign', 'stays the same', 'drops to zero', 'doubles'], a: 0, why: 'The generated EMF is K_g ω, and ω changed sign. That is how a tacho gives direction.' },
    { q: 'The tacho wire of a speed-controlled DC drive breaks. What happens without protection?', choices: ['The motor runs away towards full speed', 'The motor stops safely', 'The motor holds its speed', 'The drive reverses'], a: 0, why: 'The drive reads zero speed, sees a large error and raises the armature voltage to its limit.' },
    { q: 'The ripple on a DC tacho\'s voltage comes mainly from…', choices: ['commutation between armature coils', 'the mains supply', 'the magnet\'s temperature', 'the input resistance'], a: 0, why: 'Each commutator segment switches a coil in and out; the voltage dips and recovers at the segment frequency.' },
    { q: 'A drive counts 4000 counts per turn in a 1 ms window. How many rpm does one count represent?', answer: 15, unit: 'rpm', why: 'Δn = 1/(4000 × 0.001 s) = 0.25 rev/s = 15 rpm.' },
    { q: 'Speed measured from an encoder is continuous, with no steps.', a: false, why: 'It is counts per time: one count more or less in the window is a step of 1/(N_c T_w).' }
  ],
  problems: [
    { q: 'A 7 V/krpm tacho turns at 1800 rpm. What voltage does it give (no load)?', answer: 12.6, unit: 'V', tol: 0.01, steps: ['$V = 7 \\times 1.8 = 12.6$ V.'] },
    { q: 'A 1024-PPR encoder is decoded ×4 and counted in a 2 ms window. What is the speed step?', answer: 7.32, unit: 'rpm', tol: 0.01, steps: ['$N_c = 4096$.', '$\\Delta n = 1/(4096 \\times 0.002) = 0.1221$ rev/s = 7.32 rpm.'] }
  ],
  choose: {
    good: [
      'Maintaining and retrofitting analogue DC drives and servos built around a tacho input.',
      'A simple analogue speed signal or display with no electronics in the sensor.',
      'Smooth speed feedback at very low speed where a coarse encoder would step.'
    ],
    avoid: [
      'New servo axes: an encoder gives position and speed from one device, with no brushes.',
      'Long unattended service at high speed, or dusty places: brush wear.',
      'Accuracy better than a fraction of a per cent without calibration and temperature control.'
    ],
    check: [
      'The constant (V/krpm) against the drive input\'s full scale at top speed, and the maximum speed.',
      'Ripple, linearity and temperature coefficient against the speed accuracy you need.',
      'Input resistance, filtering and cable shielding.',
      'A stiff coupling and a working tacho-loss protection.'
    ]
  },
  applications: [
    'Paper, steel and wire machines with thyristor DC drives: a tacho on each motor holds the line speeds in step.',
    'Older machine-tool feed drives with DC servo motors and analogue amplifiers.',
    'Panel speed indicators and simple analogue speed loops on test rigs.'
  ],
  sources: [
    'Hughes and Drury, *Electric Motors and Drives* — the chapters on DC motor drives and their speed feedback.',
    'Tachogenerator and DC-drive makers\' data: constants, ripple, linearity and tacho-loss monitoring; the figures here are typical ranges.'
  ],
  sim: 'fb-tacho'
},

{
  id: 'limit-switches', parent: 'limits-safety', title: 'Mechanical limit switches', level: 1,
  short: 'A limit switch is pushed by a moving part and opens or closes contacts. Wired normally closed, a broken wire looks like a tripped switch, so the machine fails safe; with positive opening, the contact is forced apart even if welded. It must trip early enough for the axis to stop before the end stop.',
  keywords: ['limit switch', 'end of travel', 'roller lever', 'plunger', 'NO', 'NC', 'normally closed', 'fail-safe', 'closed-circuit principle', 'positive opening', 'direct opening action', 'snap action', 'pretravel', 'overtravel', 'differential travel', 'contact bounce', 'gold contacts', 'AC-15', 'DC-13', 'stopping distance'],
  prereq: ['electronics:switches', 'electronics:relays', 'motion-profiles'],
  related: ['proximity-sensors', 'optical-sensors', 'homing-routines', 'emergency-stop', 'step-dir-signals', 'servo-drives', 'pneumatics:ladder-diagrams', 'pneumatics:safety-circuits'],
  body: `
A limit switch is the simplest sensor on a machine: a moving part pushes an actuator and contacts open or close. It marks the ends of travel, confirms a position, counts parts or guards a door — and when it protects, how it is wired matters as much as the switch.

### Anatomy
- **Actuators:** a *roller lever* for cams and dogs passing across it (adjustable in angle and length); a *plunger* for a direct push, short and precise; a *roller plunger*; a *fork lever* that stays where it was flipped; a *wobble stick* that responds from any direction.
- **Contacts:** usually one normally open (NO) and one normally closed (NC). *Snap-action* contacts jump over at one point whatever the actuator's speed; *slow-action* contacts follow the actuator, with break-before-make or make-before-break versions.
- **Travels:** the *pretravel* before the contacts switch, the *operating point*, the *overtravel* the actuator may still move safely, and the *differential travel* between operating and release points (the switch's hysteresis). Precision plunger switches repeat to a few hundredths of a millimetre; roller levers to about a tenth.

### NO, NC and failing safe
| Contact | At rest | Actuated | A broken wire looks like | Use |
|---|---|---|---|---|
| NO | open | closed | "not actuated" — all clear | counting, confirming presence |
| NC | closed | open | "actuated" — stop | end limits, anything protective |

Wire the NC contact to a 24 V input and the input is ON while all is well. Any fault — a broken wire, a loose terminal, a blown fuse, a lost supply — turns it OFF exactly as a tripped switch would, and the machine stops: the **closed-circuit principle**. Wired NO, the same fault is silent until the day the axis needs the switch and does not stop.

### Positive opening
A welded NC contact would not open. For safety duties the switch must have **positive (direct) opening action**: the actuator drives the NC contact apart through a rigid link, not a spring, so it opens even if welded. Such switches carry the mark of an arrow in a circle (IEC 60947-5-1). Mount them in the *positive mode* too — the cam pushes the actuator in, rather than releasing it to a spring — so a broken spring cannot hide a tripped switch. Guard interlocks follow ISO 14119.

### Contacts, currents and bounce
Contacts are rated by utilisation category: AC-15 for AC electromagnetic loads such as contactor coils, DC-13 for DC ones. DC is much harder to break than AC: a switch good for a few amperes at 230 V AC-15 may manage well under one ampere at 110 V DC-13. The opposite trap is a PLC input drawing a few milliamperes: silver contacts grow a film that such small currents cannot break through, so low-energy circuits want gold-plated contacts. Contacts bounce for a few milliseconds; PLC input filters absorb it, but a fast counter needs [[electronics:switches|debouncing]].

### Placing the limits
Protection comes in layers: software limits in the controller, inside hardware limit switches, inside mechanical end stops with buffers or shock absorbers. The switch must trip early enough for the axis to stop before the end stop. After the switch operates, the axis keeps going for the response time $t_r$ (input filter, PLC scan, drive reaction), then brakes:

$$s = v\\,t_r + \\frac{v^2}{2a}$$

At 0.5 m/s, 20 ms and 5 m/s² that is 10 + 25 = 35 mm. The cam or dog must be long enough to keep the switch actuated over all of it — if the cam runs off the roller, the switch releases and the controller believes the axis is back in range. Mechanical lives of ten million operations and more are common; electrical lives at full load are far shorter, often under a million.

**In the simulation:** drive the carriage into the limit at different speeds and watch the stopping distance eat the overtravel; cut the wire with the switch wired NC and then NO; weld the contact with and without positive opening.

> [!warn] A limit switch protects the machine; people need guards, interlocks and a safety function designed to ISO 13849-1 and IEC 60204-1. Never bridge a limit switch to "get the machine going" — find out why it tripped.

> [!key] Wire protective limits normally closed, so every fault stops the machine; use positive-opening switches for safety; and place the switch so that the full stopping distance, $v t_r + v^2/2a$, ends before the hard stop, with the cam still holding the switch.
`,
  ideas: [
    'A limit switch converts a mechanical position into an open or closed contact.',
    'Wired normally closed, a broken wire, lost supply or loose terminal stops the machine just as the switch would.',
    'Positive (direct) opening forces a welded NC contact apart through a rigid link.',
    'The axis travels v·t_r + v²/2a after the switch operates; the overtravel and the cam must cover it.',
    'Small PLC currents need gold contacts; inductive DC loads need derated contacts.'
  ],
  pitfalls: [
    'NO and NC are just a matter of taste — An NO limit hides a broken wire until the day it is needed; protective limits are wired NC.',
    'The axis stops at the switch — It stops a response time plus a braking distance later; at high speed that can be several centimetres.',
    'Any switch rated 10 A will do for a PLC input — At a few milliamperes silver contacts can fail to conduct; low-energy circuits need gold contacts.'
  ],
  formulas: [
    {
      name: 'Distance travelled after the switch operates',
      expr: 's = v*tr + v^2/(2*a)', tex: 's = v\\,t_r + \\dfrac{v^2}{2a}',
      vars: {
        s: { name: 'stopping distance', q: 'length', unit: 'mm' },
        v: { name: 'speed when the switch operates', q: 'speed', unit: 'mm/s', value: 500 },
        tr: { name: 'response time (filter, scan, drive)', q: 'time', unit: 'ms', value: 20, tex: 't_r' },
        a: { name: 'braking deceleration', q: 'accel', unit: 'm/s²', value: 5 }
      },
      note: 'The switch\'s overtravel, the cam length and the space to the end stop must all exceed s.',
      stories: { s: 'An axis at {v} hits its limit switch; the control reacts after {tr} and brakes at {a}. How far does it travel?', v: 'There are {s} between a limit switch and the end stop, the response time is {tr} and the braking {a}. What is the highest safe speed?' }
    },
    {
      name: 'Service life of a switch in years',
      expr: 'Y = N/(c*h*d)', tex: 'Y = \\dfrac{N}{c\\,h\\,d}',
      vars: {
        Y: { name: 'life', q: false, unit: 'years' },
        N: { name: 'rated operations', q: false, unit: 'operations', value: 10000000 },
        c: { name: 'operations per hour', q: false, unit: '1/h', value: 60 },
        h: { name: 'hours per day', q: false, unit: 'h/day', value: 16 },
        d: { name: 'working days per year', q: false, unit: 'days/yr', value: 250 }
      },
      note: 'Use the electrical life at your load when the switch breaks real current; the mechanical life when it only signals a PLC.',
      stories: { Y: 'A switch rated for {N} works {c}, {h}, {d}. How many years will it last?', N: 'A switch must last {Y} at {c}, {h}, {d}. What rated life is needed?' }
    }
  ],
  examples: [
    {
      title: 'Where to put the end stop',
      q: 'A conveyor carriage runs at 1 m/s. The limit switch feeds a PLC with a 30 ms total response, and the drive brakes at 3 m/s². How far beyond the switch\'s operating point must the end stop be?',
      steps: [
        'Reaction: $v t_r = 1 \\times 0.03 = 0.03$ m = 30 mm.',
        'Braking: $v^2/2a = 1/6 = 0.167$ m = 167 mm.',
        'Total $s \\approx 197$ mm: put the buffer at least 200 mm beyond the operating point plus a margin, and make the cam long enough to hold the switch over the whole distance.'
      ],
      a: 'About 200 mm plus a margin — far more than the switch\'s own overtravel, so a long cam and a lever switch.'
    },
    {
      title: 'How long does the switch last?',
      q: 'A limit switch rated 10 million operations mechanically and 1 million at full load works 180 times an hour, 24 hours a day, 365 days a year. How long does it last switching a contactor coil directly, and signalling a PLC?',
      steps: [
        'Operations per year: $180 \\times 24 \\times 365 = 1.58$ million.',
        'Switching the coil (electrical life): $1/1.58 = 0.63$ year.',
        'Signalling a PLC at a few milliamperes (mechanical life): $10/1.58 = 6.3$ years.'
      ],
      a: 'About 7 months on the coil, about 6 years on a PLC input.'
    }
  ],
  quiz: [
    { q: 'Why is an end-of-travel limit switch wired through its normally closed contact?', choices: ['A broken wire or lost supply then reads as "limit reached" and stops the machine', 'NC contacts carry more current', 'NC contacts bounce less', 'It saves a wire'], a: 0, why: 'The closed-circuit principle: every fault in the loop has the same effect as the switch tripping, so faults are never silent.' },
    { q: 'What does positive (direct) opening action guarantee?', choices: ['The NC contact is driven open by a rigid link even if it has welded', 'The switch closes faster', 'The contacts cannot bounce', 'The NO contact opens first'], a: 0, why: 'A spring cannot tear a weld apart; the actuator\'s rigid push can. That is why safety switches must have it.' },
    { q: 'Silver contacts are the best choice for a 24 V, 5 mA PLC input.', a: false, why: 'At such low energy a surface film on silver may not be broken; gold-plated contacts stay reliable.' },
    { q: 'An axis coasts past its limit switch so far that the cam leaves the roller. What does the controller see?', choices: ['The switch released: the axis seems back in its working range', 'The switch still actuated', 'A wire break', 'Nothing changes'], a: 0, why: 'The switch only knows whether it is pushed. The cam must be long enough to hold it over the whole stopping distance.' },
    { q: 'An axis at 0.2 m/s trips a limit; the response time is 10 ms and it brakes at 2 m/s². How far does it travel, in mm?', answer: 12, unit: 'mm', why: '$0.2 \\times 0.01 = 2$ mm, plus $0.04/4 = 0.01$ m = 10 mm: 12 mm.' }
  ],
  problems: [
    { q: 'An axis at 0.8 m/s trips its limit switch; the response time is 25 ms and the drive brakes at 4 m/s². What is the stopping distance?', answer: 100, unit: 'mm', tol: 0.01, steps: ['$v t_r = 0.8 \\times 0.025 = 0.02$ m.', '$v^2/2a = 0.64/8 = 0.08$ m.', '$s = 0.10$ m = 100 mm.'] },
    { q: 'A switch rated 5 million operations works 120 times an hour, 8 hours a day, 250 days a year. How many years does it last?', answer: 20.8, unit: 'yr', tol: 0.01, steps: ['Operations per year: $120 \\times 8 \\times 250 = 240\\,000$.', '$5\\,000\\,000/240\\,000 = 20.8$ years.'] }
  ],
  choose: {
    good: [
      'End-of-travel limits and position confirmation: rugged, visible, simple, easy to test by hand.',
      'Safety interlocks and end limits with positive opening, wired NC into a safety circuit.',
      'Switching small loads directly, with no electronics and no supply for the sensor.'
    ],
    avoid: [
      'High cycle rates, high approach speeds or tiny targets: wear, bounce and broken levers — use [[proximity-sensors|proximity sensors]].',
      'Homing repeatable to a few micrometres: add the encoder\'s index pulse (see [[homing-routines]]).',
      'Sticky, dusty or icy places where the actuator may jam.'
    ],
    check: [
      'Actuator type against the approach direction and speed; pretravel and overtravel against the stopping distance.',
      'Contacts: NO/NC arrangement, positive opening mark for safety duties, utilisation category and current.',
      'Contact material for low-energy PLC inputs; mechanical and electrical life.',
      'IP rating, temperature, coolant and cable entry.'
    ]
  },
  applications: [
    'End limits and reference switches on gantries, hoists, lifts and gates.',
    'Guard interlocks with positive opening, wired into a safety relay.',
    'Cam-operated switches on presses and packaging machines to time actions in the cycle.',
    'Wiring limit switches to PLC inputs: [the sensor wiring tool](#/tools/wiring/sensors).'
  ],
  sources: [
    'IEC 60947-5-1, *Low-voltage switchgear and controlgear — Control circuit devices and switching elements — Electromechanical control circuit devices*: utilisation categories and positive opening.',
    'ISO 14119, *Safety of machinery — Interlocking devices associated with guards — Principles for design and selection*.',
    'IEC 60204-1, *Safety of machinery — Electrical equipment of machines*: control circuits and their functions in case of failure.'
  ],
  sim: 'fb-limit'
},

{
  id: 'proximity-sensors', parent: 'limits-safety', title: 'Inductive and capacitive proximity sensors', level: 2,
  short: 'Proximity sensors detect a target without touching it. Inductive sensors see metal through the eddy currents it takes from an oscillator\'s field; capacitive sensors see almost any material. Design to the assured distance, 0.81 of the nominal one, correct for the metal, and match the output — PNP or NPN, 2, 3 or 4 wires — to the input.',
  keywords: ['proximity sensor', 'proximity switch', 'inductive sensor', 'capacitive sensor', 'sensing distance', 'Sn', 'assured operating distance', 'correction factor', 'flush', 'non-flush', 'shielded', 'unshielded', 'PNP', 'NPN', 'sourcing', 'sinking', '2-wire', '3-wire', '4-wire', 'leakage current', 'switching frequency', 'NAMUR', 'M12', 'M18'],
  prereq: ['limit-switches', 'physics:induction', 'electronics:bjt-switch'],
  related: ['optical-sensors', 'homing-routines', 'hall-sensors', 'emergency-stop', 'electronics:sensors', 'pneumatics:sensors-pneu', 'pneumatics:fieldbus-io-link'],
  body: `
Proximity sensors detect a target without touching it: no lever to break, no contacts to wear, millions of operations a day. **Inductive** sensors see metal; **capacitive** sensors see almost anything — metal, water, plastic, grain, liquid through a tank wall.

### Inductive sensors
A coil on a ferrite core behind the sensing face is part of an oscillator, typically tens to hundreds of kilohertz, whose field bulges out of the face. A metal target in that field carries eddy currents that draw energy from it; the oscillation's [[?amplitude|amplitude]] falls, and when it drops past a threshold the output switches. Hysteresis — a few per cent up to about 15 % of the switching distance — stops chatter at the edge.

The **nominal sensing distance** $S_n$ is defined for a standard target: a square of mild steel 1 mm thick, as wide as the sensing face (or three times $S_n$ if that is larger). Real units differ by about ±10 % and drift with temperature and supply, so IEC 60947-5-2 defines the **assured operating distance** $s_a = 0.81\\,S_n$, within which the target is certain to be detected. Design to $s_a$.

| Size | Flush $S_n$ | Non-flush $S_n$ |
|---|---|---|
| M8 | 1.5 mm | 2.5 mm |
| M12 | 2 mm | 4 mm |
| M18 | 5 mm | 8 mm |
| M30 | 10 mm | 15 mm |

(Typical values; extended-range versions reach further.) Other metals switch closer, by a **correction factor** $k$: mild steel 1, stainless steel about 0.6–0.9, brass and aluminium about 0.3–0.5, copper about 0.25–0.4. "Factor 1" sensors detect all metals at the same distance. Targets smaller than the face also shorten the distance.

**Flush** (shielded) sensors have a metal sleeve up to the face and can be set flush into a steel bracket; their field is short and narrow. **Non-flush** sensors let the coil stand proud, reaching farther and wider, but need a metal-free zone around the head and more space from neighbours, or two sensors' fields interfere. DC inductive sensors switch typically hundreds of hertz to a few kilohertz — enough to count gear teeth or chain links for speed monitoring, $f = z n$.

### Capacitive sensors
An electrode forms a capacitor with its surroundings; anything with a relative permittivity above that of air raises the capacitance. The higher the permittivity and the bigger the target, the farther it is seen: water (about 80) and metals at nearly the full distance, wood, glass and plastics at shorter ones. A sensitivity adjustment sets the threshold, so a capacitive sensor can see grain, powder or liquid through a plastic or glass wall. The price: condensation, foam, dust build-up and humidity trigger it too, and it switches more slowly.

### Outputs: PNP, NPN, 2, 3 and 4 wires
DC sensors run on 10–30 V. Three-wire sensors use brown for +V, blue for 0 V and black for the output; four-wire sensors add white for a second (NC or complementary) output.

| Output | The sensor switches… | The load goes between… | Matching PLC input |
|---|---|---|---|
| **PNP** (sourcing) | +V onto the output wire | output and 0 V | sinking input |
| **NPN** (sinking) | the output wire to 0 V | +V and output | sourcing input |
| **2-wire** | itself, in series with the load | +V and the sensor | inputs designed for its leakage |

PNP dominates in Europe and North America, NPN in much of Asia; a mismatched sensor never switches the input. Outputs typically carry 100–200 mA and are protected against short circuits and reversed supply. A **2-wire** sensor must power itself through the load: it leaks a little current when off (around a milliampere) and drops a few volts when on. The leakage through the input's resistance can hold an input above its OFF level; the Type 2 and Type 3 inputs of IEC 61131-2 are designed to accept 2-wire sensors. **NAMUR** sensors (IEC 60947-5-6) signal with a small current to an isolating amplifier, for hazardous areas.

**In the simulation:** bring different metals up to an inductive sensor and watch the oscillator die down and the output switch with hysteresis; change size and flush mounting; then wire it PNP, NPN and 2-wire and follow the current.

> [!warn] An ordinary proximity sensor can fail with its output stuck on. Where people are protected, use safety-rated sensors (for example those with defined behaviour under fault conditions, IEC 60947-5-3) in a safety circuit designed to ISO 13849-1.

> [!key] Inductive sensors see metal, capacitive sensors almost anything. Design to $s_a = 0.81\\,k\\,S_n$, keep flush and non-flush mounting rules, and match PNP to sinking inputs, NPN to sourcing inputs.
`,
  ideas: [
    'An inductive sensor\'s oscillator is damped by eddy currents in metal; the output switches when its amplitude falls past a threshold.',
    'Design to the assured distance s_a = 0.81 S_n, reduced further by the metal\'s correction factor.',
    'Flush sensors can be embedded in metal but reach less; non-flush reach farther and need free space.',
    'PNP sensors switch +V to the load (sinking inputs); NPN sensors switch the load to 0 V (sourcing inputs).',
    'Two-wire sensors leak current when off, which some inputs read as a signal.'
  ],
  pitfalls: [
    'An 8 mm sensor sees any metal at 8 mm — Only mild steel of the standard size, and only nominally: design to 0.81 × 8 mm, and less again for aluminium or brass.',
    'PNP and NPN are interchangeable — A PNP output cannot pull a sourcing input low; the input never switches.',
    'A two-wire sensor is off when its LED is off — It still passes a leakage current, which may keep a sensitive input on.'
  ],
  formulas: [
    {
      name: 'Assured operating distance',
      expr: 'sa = 0.81*k*Sn', tex: 's_a = 0.81\\,k\\,S_n',
      vars: {
        sa: { name: 'assured operating distance', q: 'length', unit: 'mm', tex: 's_a' },
        k: { name: 'material correction factor', value: 0.4 },
        Sn: { name: 'nominal sensing distance', q: 'length', unit: 'mm', value: 8, tex: 'S_n' }
      },
      note: 'k = 1 for mild steel; about 0.3–0.5 for aluminium and brass. Small targets reduce it further.',
      stories: { sa: 'A sensor with S_n = {Sn} must detect a target with correction factor {k}. Within what distance is detection assured?', Sn: 'A target with correction factor {k} passes at {sa}. What nominal sensing distance is needed?' }
    },
    {
      name: 'Off-state voltage of a two-wire sensor',
      expr: 'Voff = Il*Rin', tex: 'V_{\\mathrm{off}} = I_L\\,R_{\\mathrm{in}}',
      vars: {
        Voff: { name: 'voltage across the input when the sensor is off', q: 'voltage', unit: 'V', tex: 'V_{\\mathrm{off}}' },
        Il: { name: 'leakage current', q: 'current', unit: 'mA', value: 1.5, tex: 'I_L' },
        Rin: { name: 'input resistance', q: 'resistance', unit: 'kΩ', value: 4.7, tex: 'R_{\\mathrm{in}}' }
      },
      note: 'It must stay below the input\'s OFF level; a bleeder resistor across the input lowers it.',
      stories: { Voff: 'A two-wire sensor leaks {Il} into a PLC input of {Rin}. What voltage does the input see when the sensor is off?', Rin: 'The input must see at most {Voff} with {Il} of leakage. What resistance, input and bleeder together, is needed?' }
    },
    {
      name: 'Pulse frequency from teeth or targets',
      expr: 'f = z*n', tex: 'f = z\\,n',
      vars: {
        f: { name: 'switching frequency', q: 'frequency', unit: 'Hz' },
        z: { name: 'targets per revolution (teeth)', q: 'count', int: true, value: 20 },
        n: { name: 'shaft speed', q: 'frequency', unit: 'rpm', value: 1500 }
      },
      note: 'Compare with the sensor\'s maximum switching frequency, typically hundreds of hertz to a few kilohertz for DC inductive sensors.',
      stories: { f: 'An inductive sensor watches a {z}-tooth sprocket at {n}. How often must it switch?', n: 'A sensor switching at most {f} watches {z} teeth. What is the highest speed it can follow?' }
    }
  ],
  examples: [
    {
      title: 'Seeing an aluminium flag',
      q: 'An aluminium flag (k ≈ 0.4) passes 3 mm from the sensor face. Will an M18 non-flush sensor ($S_n$ = 8 mm) do? And an M30 flush one ($S_n$ = 10 mm)?',
      steps: [
        'M18 non-flush: $s_a = 0.81 \\times 0.4 \\times 8 = 2.6$ mm — less than 3 mm: not assured.',
        'M30 flush: $s_a = 0.81 \\times 0.4 \\times 10 = 3.24$ mm — just enough; a factor-1 sensor or a steel flag gives far more margin.'
      ],
      a: 'The M18 is not assured; the M30 just is — better to use a steel flag or a factor-1 sensor.'
    },
    {
      title: 'A two-wire sensor that never turns off',
      q: 'A two-wire sensor leaks 1.5 mA; the PLC input is 4.7 kΩ and needs less than 5 V to read OFF. What happens, and how can a 2.2 kΩ bleeder help?',
      steps: [
        'Off-state voltage: $1.5\\,\\text{mA} \\times 4.7\\,\\text{kΩ} = 7.1$ V — above 5 V, so the input may stay on or flicker.',
        'With 2.2 kΩ in parallel: $4.7 \\parallel 2.2 = 1.5$ kΩ, so $1.5 \\times 1.5 = 2.25$ V — safely OFF.',
        'The bleeder costs $24^2/2200 = 0.26$ W when the sensor is on: use a 0.5 W resistor or better, a three-wire sensor.'
      ],
      a: 'The input sees about 7 V and may read ON; a 2.2 kΩ bleeder brings it to about 2.3 V.'
    }
  ],
  quiz: [
    { q: 'A PNP sensor\'s output, when active…', choices: ['connects the output wire to +V, so the load goes to 0 V', 'connects the output wire to 0 V, so the load goes to +V', 'floats', 'reverses the supply'], a: 0, why: 'PNP sources current into the load; the load\'s other end is at 0 V. It suits a sinking PLC input.' },
    { q: 'An inductive sensor rated S_n = 8 mm on steel meets an aluminium target. It will switch at roughly…', choices: ['3–4 mm', '8 mm', '12 mm', 'never'], a: 0, why: 'Aluminium\'s correction factor is about 0.3–0.5: 8 × 0.4 ≈ 3 mm, before the 0.81 allowance.' },
    { q: 'Design an inductive sensing position to the nominal distance S_n.', a: false, why: 'Units vary and drift; only s_a = 0.81 S_n is assured, and only for the standard steel target.' },
    { q: 'Why can a two-wire sensor keep a PLC input on even when the target is gone?', choices: ['Its leakage current through the input resistance gives a voltage above the OFF level', 'It latches on', 'Its LED draws current', 'The input has a pull-up'], a: 0, why: 'It must take a little current to power itself while off; V = I_L R_in can exceed the OFF threshold of some inputs.' },
    { q: 'Which sensor can detect water in a plastic tank through the wall?', choices: ['A capacitive sensor', 'An inductive sensor', 'A mechanical limit switch', 'A Hall switch'], a: 0, why: 'Water\'s high permittivity changes the capacitance through a non-metallic wall; inductive sensors see only metal.' }
  ],
  problems: [
    { q: 'An M12 flush sensor (S_n = 2 mm) must see a stainless-steel target with k = 0.7. What is the assured operating distance?', answer: 1.134, unit: 'mm', tol: 0.01, steps: ['$s_a = 0.81 \\times 0.7 \\times 2 = 1.134$ mm.'] },
    { q: 'An inductive sensor counts the 36 teeth of a gear at 2400 rpm. At what frequency does it switch?', answer: 1440, unit: 'Hz', tol: 0.01, steps: ['$f = z n = 36 \\times 2400/60 = 1440$ Hz — close to the limit of many DC inductive sensors.'] }
  ],
  choose: {
    good: [
      'End limits, reference points, part presence and counting at high rates, with no wear.',
      'Speed and standstill monitoring on gear teeth, cams and chains.',
      'Capacitive: levels and non-metallic materials, through non-metallic walls.'
    ],
    avoid: [
      'Distances beyond a few tens of millimetres: use [[optical-sensors|optical sensors]].',
      'Chips and swarf piling on an inductive face, or build-up and condensation on a capacitive one.',
      'Protecting people with ordinary sensors: use safety-rated devices in a safety circuit.'
    ],
    check: [
      'The assured distance for your material and target size, and flush or non-flush mounting space.',
      'Output type (PNP/NPN, NO/NC, 2/3/4 wires) against the input, and the supply range.',
      'Switching frequency, temperature range, IP rating, cable or connector (M8/M12).',
      'Weld fields, strong magnets and neighbouring sensors.'
    ]
  },
  applications: [
    'End-of-travel and home sensors on linear axes, reading a steel flag on the carriage.',
    'Speed and underspeed monitoring of conveyors from a sprocket or a bolt head.',
    'Capacitive level switches on hoppers and tanks.',
    'Wiring PNP, NPN and two-wire sensors: [the sensor wiring tool](#/tools/wiring/sensors).'
  ],
  sources: [
    'IEC 60947-5-2, *Low-voltage switchgear and controlgear — Control circuit devices and switching elements — Proximity switches*: sensing distances, standard target, assured operating distance, wire colours.',
    'IEC 60947-5-6, *DC interface for proximity sensors and switching amplifiers (NAMUR)*; IEC 60947-5-3, proximity devices with defined behaviour under fault conditions.',
    'IEC 61131-2, *Programmable controllers — Equipment requirements and tests*: the types of digital input.'
  ],
  sim: 'fb-prox'
},

{
  id: 'optical-sensors', parent: 'limits-safety', title: 'Optical sensors and light barriers', level: 1,
  short: 'Photoelectric sensors detect objects with modulated light: through-beam pairs reach tens of metres, retro-reflective sensors bounce the beam off a reflector, diffuse sensors see light scattered from the object itself, and slot sensors read flags in a fork. Excess gain is the margin against dirt; safety light curtains are a separate class of safety device.',
  keywords: ['photoelectric sensor', 'light barrier', 'through-beam', 'retro-reflective', 'polarised retro-reflective', 'diffuse', 'background suppression', 'slot sensor', 'fork sensor', 'light-on', 'dark-on', 'excess gain', 'response time', 'transparent objects', 'light curtain', 'ESPE', 'IEC 61496', 'ISO 13855', 'safety distance'],
  prereq: ['limit-switches', 'proximity-sensors', 'electronics:photodiodes'],
  related: ['homing-routines', 'emergency-stop', 'incremental-encoders', 'electronics:optocouplers', 'electronics:leds', 'pneumatics:safety-functions'],
  body: `
Photoelectric sensors detect objects with light — red, infrared or laser, pulsed at kilohertz so the receiver can ignore daylight and lamps. They reach from millimetres to tens of metres, and detect almost any material.

| Type | How | Typical range | Strengths | Weak spots |
|---|---|---|---|---|
| **Through-beam** | emitter and receiver face each other; the object breaks the beam | up to tens of metres | most reliable, sees dark and shiny objects, tolerates dirt | two units to mount, wire and align; clear objects may pass |
| **Retro-reflective** | sensor and a corner-cube reflector; the object breaks the beam | up to about 10 m | one unit to wire | shiny objects can act as reflectors; clear objects need a special sensor |
| **Diffuse** | light scattered back from the object | tens of mm to about 1–2 m on white | no reflector | range depends on colour; a bright background can trigger it |
| **Slot (fork)** | emitter and receiver in one U-shaped housing | gaps of a few mm to about 100 mm | precise, compact, aligned for life | only what fits in the slot |

**Polarised** retro-reflective sensors send polarised light; the corner-cube reflector rotates its polarisation and a filter at the receiver accepts only that, so a shiny object, which returns the light unrotated, still counts as an interruption. **Background suppression** in diffuse sensors measures the angle of the returning light (triangulation) and ignores anything beyond a set distance, so a white wall behind a black part no longer confuses it. **Slot sensors** are the classic home and index sensors: a thin steel flag on the moving part breaks the beam at a repeatable point.

### Light-on, dark-on and excess gain
A *light-operate* output is on while the receiver sees light; a *dark-operate* output is on while the beam is broken. Choose the mode, and the NO/NC output, so that a failed emitter or a cut wire leads to the safe reaction in your machine.

**Excess gain** is the light received divided by the light needed to switch. At 1 the sensor barely works; dust, oil mist, steam, misalignment and ageing LEDs eat the margin. A common rule of thumb asks for at least 2 in clean places, around 5 in dusty ones and 10 or more where lenses get dirty or wet. With a diverging beam the received light, and so the excess gain, falls roughly with the square of the distance; many sensors show a stability light.

### Tricky objects
- **Shiny**: diffuse sensors may miss them (the reflection goes elsewhere) or see them only when square on; plain retro sensors may take them for the reflector — use a polarised one.
- **Transparent**: bottles and film weaken the beam only a little; use a through-beam with reduced sensitivity or a clear-object retro sensor with a tight threshold.
- **Dark**: black rubber returns only a few per cent of the light, so a diffuse sensor's range shrinks sharply.
- **Small and fast**: the object must block the beam for at least the sensor's response time — typically 0.1 to a few milliseconds — so its length must exceed $v\\,t_r$ plus the beam width.

### Safety light curtains
A **safety light curtain** is a safety device, not a sensor that happens to be reliable: electro-sensitive protective equipment built and tested to IEC 61496 (Type 2 or Type 4), with self-monitoring and two safety outputs, used in a safety function designed to ISO 13849-1. It must stand far enough from the hazard that the machine has stopped before a hand arrives. ISO 13855 gives that minimum distance as

$$S = K\\,T + C$$

with $K$ the approach speed (2000 mm/s for distances up to 500 mm; above that 1600 mm/s, but never less than 500 mm), $T$ the curtain's response time plus the machine's stopping time, and $C$ an allowance for reaching through, $8(d - 14)$ mm for a detection capability $d$ up to 40 mm. A 14 mm (finger) curtain with $T$ = 0.25 s must be at least 500 mm away. The stopping time must be measured, and checked again periodically — brakes wear.

**In the simulation:** try each sensor type on a matte box, a shiny can, a clear bottle and a black part; dirty the lenses and watch the excess gain fall; move a white background behind a diffuse sensor, then turn on background suppression.

> [!warn] Ordinary photoelectric sensors are not safety devices. Protecting people takes a safety-rated light curtain or scanner, mounted at the ISO 13855 distance, in a validated safety function — and a measured stopping time.

> [!key] Through-beam is the most reliable, retro-reflective the easiest to install, diffuse needs no reflector but depends on the object's colour, and slot sensors give precise flags. Keep excess gain for dirt, check shiny, clear, dark and fast objects, and leave people's safety to safety-rated equipment.
`,
  ideas: [
    'Through-beam, retro-reflective, diffuse and slot sensors trade reliability and range against ease of installation.',
    'Excess gain is the margin against dirt and misalignment: aim for 2 or more in clean places and 10 or more in dirty ones.',
    'Polarised retro sensors ignore shiny objects; background suppression makes diffuse sensors ignore what is behind the target.',
    'An object must block the beam for at least the response time: length > v·t_r plus the beam width.',
    'Safety light curtains are safety devices to IEC 61496, mounted at the ISO 13855 distance S = K·T + C.'
  ],
  pitfalls: [
    'A retro-reflective sensor sees any object in its beam — A shiny object can return the light like the reflector; use a polarised sensor.',
    'The more light the better — Very high excess gain lets clear objects pass unnoticed; they need a tight threshold.',
    'A good photoelectric sensor can guard a hazard — Only safety-rated devices in a validated safety function protect people.'
  ],
  formulas: [
    {
      name: 'Minimum distance of a light curtain (ISO 13855)',
      expr: 'S = K*T + C', tex: 'S = K\\,T + C',
      vars: {
        S: { name: 'minimum distance from the hazard', q: 'length', unit: 'mm' },
        K: { name: 'approach speed', q: 'speed', unit: 'mm/s', value: 2000, fixed: true },
        T: { name: 'curtain response + machine stopping time', q: 'time', unit: 'ms', value: 200 },
        C: { name: 'intrusion allowance', q: 'length', unit: 'mm', value: 48 }
      },
      note: 'K = 2000 mm/s when S comes out at 500 mm or less; otherwise recalculate with 1600 mm/s and use at least 500 mm.',
      stories: { S: 'A light curtain with an intrusion allowance of {C} guards a machine whose total stopping time is {T}. How far from the hazard must it be?', T: 'A curtain can only be {S} from the hazard, with {C} allowance. What total stopping time is allowed?' }
    },
    {
      name: 'Intrusion allowance from detection capability',
      expr: 'C = 8*(d - 14)', tex: 'C = 8\\,(d - 14)',
      vars: {
        C: { name: 'intrusion allowance', q: false, unit: 'mm' },
        d: { name: 'detection capability (resolution)', q: false, unit: 'mm', value: 20, min: 14, max: 40 }
      },
      note: 'For curtains with d up to 40 mm (fingers and hands); both in millimetres.',
      stories: { C: 'A light curtain resolves {d}. What intrusion allowance does ISO 13855 add?' }
    },
    {
      name: 'Shortest object that is detected',
      expr: 'L = v*t + b', tex: 'L_{\\min} = v\\,t_r + b',
      vars: {
        L: { name: 'shortest object length', q: 'length', unit: 'mm', tex: 'L_{\\min}' },
        v: { name: 'object speed', q: 'speed', unit: 'm/s', value: 2 },
        t: { name: 'sensor response time', q: 'time', unit: 'ms', value: 0.5, tex: 't_r' },
        b: { name: 'beam width', q: 'length', unit: 'mm', value: 3 }
      },
      note: 'The gaps between objects must also exceed v·t_r, or neighbours merge into one.',
      stories: { L: 'Parts move at {v} past a sensor with a response time of {t} and a {b} beam. What is the shortest part it reliably sees?', v: 'Parts of {L} must be detected with a {t} sensor and a {b} beam. How fast may they move?' }
    },
    {
      name: 'Excess gain at a distance',
      expr: 'EG = EG0*(d0/d)^2', tex: '\\mathrm{EG} = \\mathrm{EG}_0\\left(\\dfrac{d_0}{d}\\right)^{2}',
      vars: {
        EG: { name: 'excess gain at the working distance', tex: '\\mathrm{EG}' },
        EG0: { name: 'excess gain at the reference distance', value: 40, tex: '\\mathrm{EG}_0' },
        d0: { name: 'reference distance', q: 'length', unit: 'm', value: 1, tex: 'd_0' },
        d: { name: 'working distance', q: 'length', unit: 'm', value: 4 }
      },
      note: 'An inverse-square estimate for a diverging beam; read the real curve in the sensor\'s data.',
      stories: { EG: 'A through-beam pair has an excess gain of {EG0} at {d0}. What is left at {d}?', d: 'A sensor with {EG0} at {d0} must keep an excess gain of {EG} for dirty conditions. How far apart may the units be?' }
    }
  ],
  examples: [
    {
      title: 'Placing a light curtain on a press',
      q: 'A 20 mm resolution curtain responds in 15 ms; the press stops in 185 ms (measured). How far from the danger zone must it be?',
      steps: [
        '$C = 8(20 - 14) = 48$ mm; $T = 15 + 185 = 200$ ms.',
        '$S = 2000 \\times 0.2 + 48 = 448$ mm — below 500 mm, so $K$ = 2000 mm/s was the right choice.',
        'If the brake wears and the press takes 250 ms to stop: $T$ = 265 ms and $S = 2000 \\times 0.265 + 48 = 578$ mm > 500 mm, so recalculate with 1600: $1600 \\times 0.265 + 48 = 472$ mm, raised to the 500 mm minimum.'
      ],
      a: 'At least 448 mm — and the stopping time must be re-measured regularly.'
    },
    {
      title: 'Counting caps on a fast conveyor',
      q: 'Bottle caps 12 mm long travel at 2 m/s past a diffuse sensor with a 0.5 ms response and a 3 mm spot; the gap between caps is 4 mm. Will it count them all?',
      steps: [
        'Shortest object: $L = v t_r + b = 2 \\times 0.5 + 3 = 4$ mm — the 12 mm caps are fine.',
        'Gaps must exceed $v t_r$ plus the spot width too: 1 + 3 = 4 mm, just equal to the gap — marginal; neighbours may merge.',
        'A faster sensor (0.1 ms) or a smaller spot gives margin.'
      ],
      a: 'The caps are detected, but the 4 mm gaps are marginal.'
    }
  ],
  quiz: [
    { q: 'Which arrangement is the most reliable in a dusty place?', choices: ['Through-beam', 'Diffuse', 'Retro-reflective', 'All the same'], a: 0, why: 'The light crosses the gap only once and goes straight into the receiver, so it has the most excess gain to spend on dirt.' },
    { q: 'A plain retro-reflective sensor fails to detect a shiny tin. Why, and what helps?', choices: ['The tin reflects the beam back like the reflector; a polarised sensor ignores it', 'The tin is too dark; raise the gain', 'The tin is transparent; use a diffuse sensor', 'The tin is too fast; slow the conveyor'], a: 0, why: 'A mirror-like surface returns light to the sensor. A polarised sensor accepts only light whose polarisation the corner-cube reflector has rotated.' },
    { q: 'A diffuse sensor detects a white box at 800 mm. It detects a black box at the same distance just as well.', a: false, why: 'The black box returns only a few per cent of the light; the range shrinks sharply with darker surfaces.' },
    { q: 'A light curtain\'s machine stops in 300 ms and the curtain responds in 20 ms (d = 14 mm). What is the ISO 13855 minimum distance?', choices: ['512 mm, recalculated with K = 1600 mm/s', '640 mm, with K = 2000 mm/s', '320 mm', '500 mm whatever the stopping time'], a: 0, why: 'With K = 2000: 2000 × 0.32 = 640 mm > 500, so recalculate with 1600: 1600 × 0.32 + 0 = 512 mm, which is above the 500 mm minimum.' },
    { q: 'Why do photoelectric sensors pulse their light at kilohertz?', choices: ['So the receiver can pick out its own light from daylight and lamps', 'To save the LED', 'To measure distance', 'To be invisible'], a: 0, why: 'The receiver looks only for light modulated at its emitter\'s frequency, rejecting steady ambient light.' }
  ],
  problems: [
    { q: 'A 30 mm light curtain (C = 128 mm) responds in 10 ms and the machine stops in 140 ms. What is the minimum distance? (Use K = 2000 mm/s and check it.)', answer: 428, unit: 'mm', tol: 0.01, steps: ['$T = 150$ ms.', '$S = 2000 \\times 0.15 + 128 = 428$ mm — below 500 mm, so K = 2000 applies.'] },
    { q: 'A through-beam pair has an excess gain of 60 at 1 m. Estimate it at 5 m.', answer: 2.4, tol: 0.01, steps: ['$\\mathrm{EG} = 60 \\times (1/5)^2 = 2.4$ — enough for clean air only.'] }
  ],
  choose: {
    good: [
      'Detection at distances beyond proximity sensors: conveyors, doors, stackers, car washes.',
      'Slot sensors for home and reference flags; through-beams for long, dirty or critical paths.',
      'Non-metallic, light or fragile objects that must not be touched.'
    ],
    avoid: [
      'Heavy steam, oil mist or flying dust without a large excess gain or regular cleaning.',
      'Protecting people with ordinary sensors: use safety light curtains or scanners.',
      'Clear, shiny or very dark objects without the matching sensor type.'
    ],
    check: [
      'Type and range with enough excess gain for your conditions.',
      'Object properties: colour, gloss, transparency, size, speed and gaps against the response time.',
      'Light-on or dark-on, PNP or NPN, NO or NC — and what a failure does in your machine.',
      'Mounting, alignment, vibration, background and ambient light.'
    ]
  },
  applications: [
    'Box and pallet detection on conveyors: retro-reflective and through-beam sensors.',
    'Home and index flags on linear axes and rotary tables: slot sensors.',
    'Guarding presses, robot cells and palletisers: safety light curtains at the ISO 13855 distance.'
  ],
  sources: [
    'IEC 60947-5-2, *Proximity switches* — which includes photoelectric sensors.',
    'IEC 61496-1 and -2, *Safety of machinery — Electro-sensitive protective equipment*: general requirements and active opto-electronic protective devices (light curtains).',
    'ISO 13855, *Safety of machinery — Positioning of safeguards with respect to the approach speeds of parts of the human body*.'
  ],
  sim: 'fb-optical'
},

{
  id: 'homing-routines', parent: 'limits-safety', title: 'Homing: finding the reference point', level: 2,
  short: 'An axis with an incremental encoder or a stepper does not know where it is at power-up. Homing drives it to a reference — a switch, a switch plus the encoder\'s index pulse, the index alone, or a hard stop — and sets the position there. A fast search, a back-off and a slow final approach from one side make it repeatable.',
  keywords: ['homing', 'referencing', 'home switch', 'reference point', 'index pulse', 'Z pulse', 'hard stop homing', 'torque limit homing', 'search speed', 'creep speed', 'back-off', 'home offset', 'latch', 'repeatability', 'CiA 402', 'homing method', 'gantry squaring'],
  prereq: ['incremental-encoders', 'limit-switches', 'motion-profiles'],
  related: ['absolute-encoders', 'proximity-sensors', 'optical-sensors', 'servo-drives', 'stepper-drivers', 'following-error', 'closed-loop-steppers', 'lead-ball-screws'],
  body: `
An axis with an [[incremental-encoders|incremental encoder]] or an open-loop stepper wakes up not knowing where it is. **Homing** (referencing) finds a known physical point and sets the position counter there; every later move is measured from it. How repeatable that point is decides how repeatable the whole machine is after every power-up.

### The usual methods
| Method | How | Repeatability | Notes |
|---|---|---|---|
| Home switch | find the edge of a switch | set by the switch and by speed × latency | simple; approach slowly, always from the same side |
| Switch + index | find the switch, then latch the encoder's next Z pulse | about one encoder count | the standard for servo axes |
| Index only | find the Z pulse | one count | rotary axes, spindle orientation |
| Hard stop | push gently into a mechanical stop until torque or following error rises, then back off | depends on stiffness and friction | no sensor; low speed and limited torque |
| Absolute encoder | none — set once | — | [[absolute-encoders]] |

A good mechanical or inductive switch repeats to a few hundredths of a millimetre when approached slowly. Drives and controllers offer these as numbered *homing methods* (the CANopen drive profile CiA 402 lists a set of them, differing in switch, direction and index use); the drive manual says exactly what each does.

### A switch-plus-index sequence
1. **Search** towards the home switch at a moderate speed.
2. The switch operates: decelerate — the axis overshoots by $v^2/2a$ — and reverse.
3. **Back off** until the switch releases.
4. **Approach again at creep speed**, always in the same direction, so the switch's hysteresis and the backlash are the same every time.
5. At the switch edge, continue to the next **index pulse** and latch the position there in hardware.
6. Apply the **home offset**, enable the software limits, and move to the start position.

Why slowly? A switch read by a PLC is seen late by its input filter and scan time, and that delay varies. The position error is $\\Delta x = v\\,\\Delta t$: with 4 ms of uncertainty, 50 mm/s gives 0.2 mm, while 2 mm/s gives 8 µm. The index pulse is latched by the drive's hardware within microseconds, so switch-plus-index homing repeats to about one encoder count however sloppy the switch is — as long as the switch picks the same index pulse every time.

**The index trap.** If the switch edge lies close to an index pulse, small variations make the routine pick that pulse one time and the next one another time: the home jumps by a whole revolution — a full screw lead, 5 or 10 mm. Set the switch (or its cam) so its edge falls about half a revolution from the index pulse; many drives report that distance after homing so it can be checked.

### Homing on a hard stop
With no sensor at all, the axis moves slowly with a reduced torque limit into a mechanical stop; when the current or following error rises past a threshold the drive takes that as home and backs off by a set distance. It suits grippers, small linear modules and pick-and-place axes. The stop must take the force, repeatability depends on stiffness, friction and grease, and too high a speed hammers the screw, coupling and stop.

### Real life
- **Gantries** with a motor on each side home both sides separately to square the beam.
- **Vertical axes** home carefully: know where the load is, and keep the brake and limits active.
- Put a **maximum search distance** on every stage: a missing switch must give an error, not a crash into the end stop.
- Home in a clear area: fixtures, clamps and tools must not be in the path.

**In the simulation:** home the axis on a switch at fast and slow creep speeds and watch the spread of the home positions; switch to switch-plus-index and see it collapse to one count; move the switch close to an index pulse and watch the home jump by a lead; try the hard stop.

> [!warn] During homing the axis moves automatically before its limits are fully meaningful. Check the path is clear, keep guards closed, keep hands away, and never test homing on a vertical or heavily loaded axis without the brake and limits in place.

> [!key] Search fast, back off, approach slowly from one side, and latch on the index pulse: the switch chooses the revolution, the index gives the precision. Keep the switch edge about half a revolution away from the index.
`,
  ideas: [
    'Homing sets the position counter at a known physical point after power-up.',
    'The latch error of a switch is speed × latency, so the final approach is slow and always from the same side.',
    'Switch-plus-index homing repeats to about one encoder count, because the index is latched in hardware.',
    'A switch edge close to an index pulse can make the home jump by one revolution; set them half a revolution apart.',
    'Hard-stop homing needs no sensor but low speed, a reduced torque limit and a stop that takes the force.'
  ],
  pitfalls: [
    'Homing faster saves time at no cost — The latch error grows with speed; only the search may be fast, the final approach must be slow.',
    'With an index pulse the switch position does not matter — If its edge sits near an index pulse, the home can land one revolution off.',
    'A hard stop can be found at normal speed and torque — The impact damages screws, couplings and stops; use a crawl speed and a low torque limit.'
  ],
  formulas: [
    {
      name: 'Latch error from latency',
      expr: 'dx = v*dt', tex: '\\Delta x = v\\,\\Delta t',
      vars: {
        dx: { name: 'position uncertainty', q: 'length', unit: 'µm', tex: '\\Delta x' },
        v: { name: 'approach speed', q: 'speed', unit: 'mm/s', value: 5 },
        dt: { name: 'variation of the input delay', q: 'time', unit: 'ms', value: 4, tex: '\\Delta t' }
      },
      note: 'Filter time plus scan-time jitter for a PLC input; microseconds for a latched index pulse.',
      stories: { dx: 'A home switch is read with {dt} of uncertain delay while the axis creeps at {v}. How much does the home position vary?', v: 'The home must repeat to {dx} with {dt} of input jitter. What is the fastest creep speed?' }
    },
    {
      name: 'Overshoot after the switch',
      expr: 's = v^2/(2*a)', tex: 's = \\dfrac{v^2}{2a}',
      vars: {
        s: { name: 'distance past the switch before stopping', q: 'length', unit: 'mm' },
        v: { name: 'search speed', q: 'speed', unit: 'mm/s', value: 50 },
        a: { name: 'deceleration', q: 'accel', unit: 'm/s²', value: 0.5 }
      },
      note: 'Add the reaction distance; the switch and cam must allow this overtravel.',
      stories: { s: 'An axis searching for home at {v} decelerates at {a}. How far past the switch does it run?', v: 'The home switch allows {s} of overtravel and the axis decelerates at {a}. What is the fastest search speed?' }
    }
  ],
  examples: [
    {
      title: 'How fast can the final approach be?',
      q: 'A home switch is read by a PLC with a 3 ms input filter and a 2 ms scan, so the delay varies by about 4 ms. The machine must repeat to 0.02 mm. What creep speed is allowed? Would switch-plus-index help?',
      steps: [
        '$v = \\Delta x/\\Delta t = 0.02\\,\\text{mm}/0.004\\,\\text{s} = 5$ mm/s.',
        'With switch-plus-index, the index pulse is latched by the drive within microseconds: the repeatability becomes about one encoder count (1 µm on a 10 mm screw with 10 000 counts a turn), whatever the creep speed — provided the switch edge stays well away from the index.'
      ],
      a: 'At most 5 mm/s on the switch alone; switch-plus-index repeats to about a micrometre.'
    },
    {
      title: 'The home that jumps by a lead',
      q: 'On a 10 mm-lead ball screw the home switch edge sits 0.3 mm before an index pulse, and the edge varies by ±0.2 mm with temperature and speed. What goes wrong, and how is it fixed?',
      steps: [
        'Most of the time the edge comes before the index, and the routine latches that index.',
        'When the edge comes 0.2 mm late it can fall past the index, so the routine waits for the next index — 10 mm further. The home is one full lead off.',
        'Move the switch or its cam by about 5 mm (half a revolution): now the edge can vary by several millimetres and still pick the same index.'
      ],
      a: 'Occasional 10 mm errors; shift the switch half a revolution from the index.'
    }
  ],
  quiz: [
    { q: 'Why is the last approach to the home switch slow and always in the same direction?', choices: ['The latch error is speed × latency, and one direction keeps hysteresis and backlash the same', 'To save energy', 'Because switches cannot be passed quickly', 'To protect the encoder'], a: 0, why: 'The input delay varies by milliseconds; at low speed that becomes micrometres. Approaching from one side makes the switch\'s differential travel and the backlash identical every time.' },
    { q: 'In switch-plus-index homing, what gives the precision?', choices: ['The encoder\'s index pulse, latched in hardware', 'The home switch', 'The PLC scan', 'The motor\'s brake'], a: 0, why: 'The switch only chooses which revolution; the index pulse, latched within microseconds, fixes the position to about one count.' },
    { q: 'The switch edge lies very close to an index pulse. What can happen?', choices: ['The home sometimes lands one revolution (one screw lead) off', 'The homing becomes more precise', 'The encoder counts double', 'Nothing'], a: 0, why: 'Tiny variations decide whether that index or the next is taken. Keep them about half a revolution apart.' },
    { q: 'Hard-stop homing can be done at full speed and full torque to save time.', a: false, why: 'The impact damages screws, couplings and the stop, and the force at full torque makes the point less repeatable. Use a crawl speed and a low torque limit.' },
    { q: 'A home switch is approached at 100 mm/s with 2 ms of input-delay variation. How large is the latch error, in mm?', answer: 0.2, unit: 'mm', why: 'Δx = v Δt = 100 mm/s × 0.002 s = 0.2 mm.' }
  ],
  problems: [
    { q: 'A home switch read with 5 ms of delay variation is approached at 20 mm/s. How much can the home position vary?', answer: 100, unit: 'µm', tol: 0.01, steps: ['$\\Delta x = 20\\,\\text{mm/s} \\times 0.005\\,\\text{s} = 0.1$ mm = 100 µm.'] },
    { q: 'An axis searches at 30 mm/s and decelerates at 0.3 m/s². How far past the switch does it run?', answer: 1.5, unit: 'mm', tol: 0.01, steps: ['$s = v^2/2a = 0.03^2/0.6 = 0.0015$ m = 1.5 mm.'] }
  ],
  choose: {
    good: [
      'Switch plus index for servo axes with incremental encoders: repeatable to about one count.',
      'Index only for rotary axes and spindle orientation.',
      'Hard-stop homing for grippers and small linear modules with no room for a sensor.'
    ],
    avoid: [
      'Axes that cannot move safely before they know where they are — robots among fixtures, loaded vertical axes: use [[absolute-encoders]].',
      'Switch-only homing at high speed on precise machines.',
      'Hard stops on axes whose friction varies or whose mechanics cannot take the force.'
    ],
    check: [
      'The methods your drive or controller offers, and which inputs and directions they use.',
      'Search and creep speeds, deceleration and the switch\'s overtravel.',
      'The distance from the switch edge to the index pulse (about half a revolution).',
      'A maximum search distance, the home offset and the software limits after homing.'
    ]
  },
  applications: [
    'CNC machines: each axis homes on a switch and the encoder\'s index at start-up.',
    '3-D printers and small routers: stepper axes home on microswitches or slot sensors.',
    'Electric grippers and linear modules: hard-stop homing with a reduced current.',
    'Try the sequences in [the homing tool](#/tools/drives/homing).'
  ],
  sources: [
    'CiA 402, the CANopen device profile for drives and motion control (also adopted in the IEC 61800-7 series): its homing mode and homing methods.',
    'Servo-drive and motion-controller manuals: homing methods, speeds, offsets and the switch-to-index check.'
  ],
  sim: 'fb-homing'
},

{
  id: 'emergency-stop', parent: 'limits-safety', title: 'Emergency stop and safe torque off', level: 2,
  short: 'An emergency stop is a latching red-on-yellow device with positive-opening contacts that stops the machine in stop category 0 (power removed at once) or 1 (a controlled stop, then power removed) — never 2. A safety relay checks both channels and the contactors before it allows a reset; in a drive, safe torque off (STO) removes the motor\'s torque without contactors, but not its voltage.',
  keywords: ['emergency stop', 'e-stop', 'ISO 13850', 'IEC 60204-1', 'stop category 0', 'stop category 1', 'stop category 2', 'safety relay', 'dual channel', 'cross monitoring', 'force-guided contacts', 'mirror contacts', 'feedback loop', 'monitored reset', 'safe torque off', 'STO', 'SS1', 'SBC', 'IEC 61800-5-2', 'performance level', 'ISO 13849-1'],
  prereq: ['limit-switches', 'servo-drives', 'vfd-principle'],
  related: ['motor-brakes', 'optical-sensors', 'vfd-braking', 'dc-braking', 'motor-protection', 'servo-brakes', 'pneumatics:emergency-stop-pneu', 'pneumatics:safety-functions', 'electronics:relays'],
  body: `
An emergency stop is the red mushroom on yellow that anyone can hit when something goes wrong. It is a **complementary protective measure**: it backs up guards and safety devices, it does not replace them. ISO 13850 sets the principles; IEC 60204-1 sets how the electrical equipment performs it.

### The device
- A **red actuator on a yellow background**, easy to reach from every operating position.
- **Latching**: once pressed it stays pressed until deliberately released (twist or key). Releasing it must *not* restart anything: a separate, deliberate reset, then a start, are needed.
- **Positive-opening NC contacts** (emergency-stop devices are covered by IEC 60947-5-5), usually two, one per channel; some add a monitoring contact that notices a contact block falling off its button.
- Wired **normally closed**, so pressing it and breaking a wire have the same effect.

### Stop categories
| Category (IEC 60204-1) | What happens | The machine stops by | For emergency stop? |
|---|---|---|---|
| **0** | power to the actuators removed at once | coasting, or mechanical brakes | yes |
| **1** | a controlled stop with power available, then power removed at standstill | the drive's ramp, then STO or contactors | yes |
| **2** | a controlled stop, power left on | the drive, holding position | no |

Category 0 is the simplest and most certain, but a heavy flywheel or spindle can coast for minutes, and a vertical axis falls unless a brake catches it. Category 1 lets the drive brake hard first — the energy goes to its [[vfd-braking|braking resistor]] — and removes power afterwards, with the delay set in a safety relay's timed outputs or the drive's SS1 function. Category 2 never removes power, so it cannot be an emergency stop. The risk assessment decides between 0 and 1. (IEC 60204-1 also has *emergency switching off*, which cuts the electrical supply where electric shock is the hazard.)

### The safety relay and the circuit
A **safety relay** or safety controller supervises the circuit:
- **two channels**, each through its own NC contact, with **cross monitoring** that detects a short between them or one channel that fails to open;
- **force-guided contacts** inside the relay, and **mirror contacts** on the contactors — auxiliary NC contacts that cannot close while a main contact is welded;
- a **feedback loop**: the mirror contacts in series with the reset input, so a welded contactor blocks the next reset;
- a **monitored manual reset** that acts when the button is released, so a jammed or bridged reset button cannot restart the machine;
- **two contactors in series** in the motor supply, or the drive's STO inputs.

The whole chain — button, wiring, relay, contactors or drive — is one safety function, designed and validated to the performance level (PL a–e, ISO 13849-1) or SIL (IEC 62061) the risk assessment requires.

### Safe torque off
Modern drives offer **STO** (IEC 61800-5-2): two safe inputs block the gate signals of the output transistors, so the motor cannot make torque. STO alone is stop category 0; a monitored or timed ramp followed by STO (**SS1**) is category 1. It saves the motor contactors and their wear, restarts quickly and keeps the DC bus charged. But:
- **STO is not isolation.** The DC bus and the motor terminals can still carry lethal voltage. For work on the equipment, switch off, lock out, wait for the bus to discharge and measure.
- **STO removes torque, not motion.** A hanging load falls; add a spring-applied brake controlled safely (SBC) — see [[motor-brakes]].

### How long does it take to stop?
With a total decelerating torque $T$ the stopping time is $t = J\\omega/T$. A spindle of 0.5 kg·m² at 3000 rpm holds $\\tfrac12 J\\omega^2$ = 24.7 kJ; coasting against 1 N·m of friction it takes 157 s to stop, braked by the drive at 50 N·m about 3.1 s. That difference is why large inertias use category 1.

**In the simulation:** press the emergency stop in category 0, 1 and 2 and compare the speed curves; weld a contactor and try to reset; short the two channels together; hang a vertical load with and without a brake.

> [!warn] An emergency stop, an STO input or an open contactor does not make a machine safe to work on. Isolate every energy source, lock and tag it out, discharge capacitors and the drive's DC bus, secure hanging loads, and prove it dead. Emergency-stop circuits are designed, installed and validated by competent people to ISO 13849-1, IEC 60204-1 and local law; this page explains principles only.

> [!key] Emergency stop is category 0 or 1, never 2; it latches, and its release must not restart the machine. Two channels, positive-opening contacts, force-guided relays and a feedback loop make faults visible. STO removes torque without contactors — but not voltage, and not gravity.
`,
  ideas: [
    'Emergency stop is a latching, red-on-yellow, positive-opening device backing up the machine\'s safeguards.',
    'It must stop in category 0 (power removed at once) or 1 (controlled stop, then power removed) — never category 2.',
    'Two channels with cross monitoring, force-guided contacts and a feedback loop make single faults detectable.',
    'Releasing the button must not restart the machine: reset and start are separate, deliberate actions.',
    'STO blocks the drive\'s output so no torque is made, but the motor terminals may stay live and loads may fall.'
  ],
  pitfalls: [
    'Pressing the emergency stop makes the machine safe for maintenance — It stops the hazard; it does not isolate energy. Work needs lock-out, discharge and proof of dead.',
    'STO means the motor is disconnected — The drive stops switching, but the DC bus and motor terminals can still be at dangerous voltage.',
    'A controlled stop with the drive still energised is fine for an emergency stop — That is category 2, which is not permitted for emergency stop.'
  ],
  formulas: [
    {
      name: 'Stopping time under a constant torque',
      expr: 't = J*w/T', tex: 't = \\dfrac{J\\,\\omega}{T}',
      vars: {
        t: { name: 'stopping time', q: 'time', unit: 's' },
        J: { name: 'inertia of motor and load', q: 'inertia', unit: 'kg·m²', value: 0.5 },
        w: { name: 'speed at the stop command', q: 'angvel', unit: 'rpm', value: 3000, tex: '\\omega' },
        T: { name: 'total decelerating torque', q: 'torque', unit: 'N·m', value: 50 }
      },
      note: 'Coasting: T is the friction and load torque. Category 1: add the drive\'s braking torque. A brake adds its own.',
      stories: { t: 'A {J} spindle at {w} is stopped by {T}. How long does it take?', T: 'A {J} spindle at {w} must stop within {t}. What decelerating torque is needed?' }
    },
    {
      name: 'Kinetic energy to remove',
      expr: 'E = J*w^2/2', tex: 'E = \\tfrac{1}{2}J\\,\\omega^{2}',
      vars: {
        E: { name: 'kinetic energy', q: 'energy', unit: 'kJ' },
        J: { name: 'inertia of motor and load', q: 'inertia', unit: 'kg·m²', value: 0.5 },
        w: { name: 'speed', q: 'angvel', unit: 'rpm', value: 3000, tex: '\\omega' }
      },
      note: 'In category 1 the drive sends it to a braking resistor (or the mains); a mechanical brake turns it into heat in its lining.',
      stories: { E: 'How much energy must be removed to stop {J} turning at {w}?' }
    }
  ],
  examples: [
    {
      title: 'Coasting or braking a spindle',
      q: 'A spindle and chuck of 0.5 kg·m² run at 3000 rpm with 1 N·m of friction. Compare a category 0 coast with a category 1 stop in which the drive brakes at 50 N·m.',
      steps: [
        '$\\omega = 3000 \\times 2\\pi/60 = 314$ rad/s; energy $\\tfrac12 \\times 0.5 \\times 314^2 = 24.7$ kJ.',
        'Coasting: $t = 0.5 \\times 314/1 = 157$ s — two and a half minutes of a spinning chuck.',
        'Braked: $t = 0.5 \\times 314/51 = 3.1$ s, with 24.7 kJ into the braking resistor; then STO removes the torque.'
      ],
      a: 'About 157 s coasting against 3.1 s braked: category 1 is the sensible choice here.'
    },
    {
      title: 'A reset that is refused',
      q: 'After an emergency stop the operator releases the button and presses reset, but the safety relay will not reset. Its feedback loop is open. What is the likely cause, and what must not be done?',
      steps: [
        'The feedback loop runs through the NC mirror contacts of the two motor contactors. It is open, so one contactor has not dropped out — most likely a welded main contact.',
        'The relay is doing its job: with one contactor welded, only the other one stands between the motor and the supply. A second fault would leave no protection.',
        'Never bridge the feedback loop to "get going". Isolate and lock out, replace the contactor, find why it welded (overload, short circuit, contact wear), and test the function.'
      ],
      a: 'A welded contactor; replace it after lock-out — never bridge the feedback loop.'
    }
  ],
  quiz: [
    { q: 'Which stop category is not permitted for an emergency stop?', choices: ['Category 2', 'Category 0', 'Category 1', 'None — all are allowed'], a: 0, why: 'Category 2 leaves the power on after stopping; an emergency stop must end in removal of power (category 0 or 1).' },
    { q: 'Releasing a latched emergency-stop button should restart the machine where it stopped.', a: false, why: 'Release only makes a reset possible. Reset and start must be separate, deliberate actions, so nobody is surprised by a machine that starts on its own.' },
    { q: 'What does the feedback loop of a safety relay detect?', choices: ['A contactor that has not dropped out, typically welded', 'A broken emergency-stop button', 'An overload of the motor', 'A missing earth'], a: 0, why: 'The contactors\' mirror contacts close only when their main contacts are open; if one is welded the loop stays open and the relay refuses to reset.' },
    { q: 'A drive\'s STO is active. The motor terminals…', choices: ['may still carry dangerous voltage', 'are disconnected from the drive', 'are earthed', 'carry only 24 V'], a: 0, why: 'STO blocks the gate signals so no torque is produced; it does not isolate. The DC bus stays charged.' },
    { q: 'A vertical axis without a brake gets an STO. What happens?', choices: ['The load falls, back-driving the motor', 'The axis holds its position', 'The drive brakes it automatically', 'It moves up'], a: 0, why: 'With no torque, nothing holds against gravity. Vertical axes need a spring-applied brake applied safely (SBC).' }
  ],
  problems: [
    { q: 'A flywheel of 2 kg·m² at 1500 rpm is braked with a total torque of 40 N·m. How long does it take to stop?', answer: 7.85, unit: 's', tol: 0.01, steps: ['$\\omega = 1500 \\times 2\\pi/60 = 157.1$ rad/s.', '$t = J\\omega/T = 2 \\times 157.1/40 = 7.85$ s.'] },
    { q: 'How much kinetic energy does a rotor of 0.2 kg·m² hold at 6000 rpm?', answer: 39.5, unit: 'kJ', tol: 0.01, steps: ['$\\omega = 628.3$ rad/s.', '$E = \\tfrac12 \\times 0.2 \\times 628.3^2 = 39\\,480$ J ≈ 39.5 kJ.'] }
  ],
  choose: {
    good: [
      'Category 0 through contactors or STO: small inertias that stop quickly by friction, or loads held by a spring-applied brake.',
      'Category 1 (SS1, then STO): large inertias — spindles, saw blades, fans, centrifuges — that would coast for a long time.',
      'STO in the drive: fewer contactors, no contact wear, fast restart.'
    ],
    avoid: [
      'Category 2 for emergency stops: not permitted.',
      'STO alone on vertical or overhauling loads: add a safely controlled brake.',
      'Treating the emergency stop as isolation for work, or as a substitute for guards.'
    ],
    check: [
      'The performance level or SIL the risk assessment requires, and the rating of every part of the chain.',
      'The measured stopping time and distance, including worn brakes.',
      'Latching, positive opening, two channels, feedback loop, and a reset that cannot restart the machine.',
      'Where the buttons are: reachable from every operating position, and clearly marked.'
    ]
  },
  applications: [
    'Machine tools: emergency stop in category 1 — the spindle and axes brake under drive control, then STO.',
    'Conveyors: pull-wire emergency-stop switches along the belt, latching and positive-opening.',
    'Robot cells: emergency stops, door interlocks and light curtains into one safety controller, with STO and safe brake control on every axis.'
  ],
  sources: [
    'ISO 13850, *Safety of machinery — Emergency stop function — Principles for design*.',
    'IEC 60204-1, *Safety of machinery — Electrical equipment of machines — General requirements*: stop categories 0, 1 and 2, emergency stop and emergency switching off.',
    'IEC 61800-5-2, *Adjustable speed electrical power drive systems — Safety requirements — Functional*: STO, SS1 and SBC.',
    'ISO 13849-1, *Safety of machinery — Safety-related parts of control systems*; IEC 60947-5-5, electrical emergency stop devices with mechanical latching.'
  ],
  sim: 'fb-estop'
},

{
  id: 'motor-brakes', parent: 'limits-safety', title: 'Spring-applied motor brakes', level: 2,
  short: 'A spring-applied brake clamps a friction disc whenever its coil is unpowered and is released by an electromagnet pulling an armature across a small air gap — so power loss applies it: fail-safe. Holding brakes keep a stopped axis still; working brakes stop loads every cycle. The pull falls steeply as the lining wears and the gap grows, and the switching method sets how fast it bites.',
  keywords: ['motor brake', 'spring-applied brake', 'fail-safe brake', 'electromagnetic brake', 'holding brake', 'working brake', 'armature', 'friction disc', 'air gap', 'wear', 'release voltage', 'over-excitation', 'rectifier', 'DC-side switching', 'engagement time', 'braking energy', 'brake motor', 'safe brake control', 'SBC', 'manual release'],
  prereq: ['emergency-stop', 'torque-and-power', 'physics:solenoid'],
  related: ['servo-brakes', 'dc-braking', 'vfd-braking', 'motors-conveyors-hoists', 'counterbalance-brake-valves', 'motor-heating', 'friction-in-motors', 'hydraulics:load-holding'],
  body: `
Motors that hold loads carry a brake, usually on the non-drive end: servo motors on vertical axes, hoist and crane motors, gearmotors on inclined conveyors, lift machines. Almost all are **spring-applied and electromagnetically released**: springs clamp a friction disc when there is no power, and a coil pulls the springs off when there is. Lose the power — a supply failure, an emergency stop, a broken wire — and the brake closes. That is what fail-safe means here.

### How it works
A magnet body holds the coil and a ring of compression springs. The springs push an **armature plate** against a **friction disc**, splined to a hub on the motor shaft, and the disc against a flange or the motor's end shield: two friction faces, braking torque. Energise the coil and its pull draws the armature back across the **air gap**, typically 0.2–0.5 mm, freeing the disc.

The pull of an electromagnet falls steeply with the gap — roughly with its [[?exponent|square]] at a given current:

$$F = F_1\\left(\\frac{V\\,\\delta_1}{V_1\\,\\delta}\\right)^{2}$$

So releasing is hardest at the start, across the full gap, and holding is easy once the gap has closed. That explains three things:
- **Over-excitation**: special rectifiers give a higher voltage for the first few hundred milliseconds to pull in quickly, then drop to a holding level; servo drives may hold at reduced voltage to cut heat.
- **Slow drop-out**: with the gap closed, a small remaining current still holds the armature, so the brake bites only when the current has almost gone.
- **Wear**: as the linings wear the gap grows; one day the coil can no longer pull the armature in. The brake then drags, overheats and wears faster still. The maker states a maximum gap — check it, re-adjust or replace; release and wear monitoring switches catch it in service. Remember that a supply 10 % low shrinks the gap the coil can pull across by 10 %.

### Holding brakes and working brakes
| | Holding brake | Working brake |
|---|---|---|
| Job | holds a stopped axis; stops from speed only in emergencies | stops the load every cycle |
| Typical on | servo motors (see [[servo-brakes]]) | hoists, cranes, conveyors, door drives |
| Energy | small; a limited number of emergency stops, stated by the maker | sized for the energy per stop and the stops per hour |
| Sequence | the drive holds, then the brake closes, then torque is removed | brake closes at speed, or after the drive has slowed |

On a servo axis the order matters: at enable, the drive builds holding torque *before* the brake opens; at disable, the brake closes and its engagement time passes *before* the torque is removed — otherwise a vertical axis sags. Drives have parameters for both delays.

### Supply and switching
Servo brakes run on 24 V DC, typically within ±10 %: a long, thin cable can drop enough that the brake never fully releases. Brakes on AC motors have DC coils fed through a rectifier in the terminal box — half-wave from 400 V gives about 180 V DC, a bridge from 230 V about 205 V DC. How the coil is switched off decides how fast the brake bites. Switched on the AC side, the coil's current freewheels through the rectifier and decays slowly: engagement takes hundreds of milliseconds. Switched on the **DC side**, with a varistor to absorb the voltage spike, the current collapses at once and the brake bites several times faster — the choice for hoists. On 24 V brakes, a plain diode across the coil slows engagement in the same way; a Zener or varistor suppressor keeps it fast.

### Sizing
The braking torque must exceed the load's torque with a margin — for hoists often 1.5–2 times, or what the applicable rules require. Each stop turns the kinetic energy into heat in the linings:

$$W = \\tfrac12 J\\omega^2\\,\\frac{T_B}{T_B + T_L}$$

with $T_L$ positive when the load helps to stop (friction) and negative when it drives (a hoist lowering). New linings need bedding in before they reach full torque; oil or grease on them collapses it; a brake left closed for months can corrode and stick.

**In the simulation:** raise the coil voltage until the armature pulls in, wear the linings and watch the pull-in voltage climb past the supply; then stop a turning load with AC-side and DC-side switching and compare the stopping times and energies.

> [!warn] Never work under a load held only by a motor brake: support it mechanically first. Lock out and tag out the motor, and use a brake's manual release only when the load is secured. Test holding brakes periodically — linings wear, get contaminated and glaze.

> [!key] Springs apply, electricity releases: power loss closes the brake. The magnet's pull falls with the square of the gap, so wear and low voltage stop it releasing. Holding brakes hold; working brakes are sized for energy per stop and stops per hour; DC-side switching makes them bite fast.
`,
  ideas: [
    'Springs apply the brake and a coil releases it, so any loss of power applies it.',
    'The magnetic pull falls roughly with the square of the air gap; wear and low voltage eventually stop it releasing.',
    'Holding brakes hold stopped axes and stop only in emergencies; working brakes are sized for the energy of every stop.',
    'Switching the coil on the DC side makes the brake bite several times faster than switching on the AC side.',
    'The energy per stop is ½Jω² × T_B/(T_B + T_L): larger when the load drives, smaller when it helps.'
  ],
  pitfalls: [
    'A servo holding brake can stop the axis every cycle — It is built to hold and to survive a limited number of emergency stops; routine stopping wears it out quickly.',
    'If the brake has 24 V, it releases — A worn gap or a voltage drop on a long cable can leave it dragging, hot and wearing.',
    'The brake bites the instant the power is cut — The coil current must first decay; with AC-side switching or a freewheel diode that takes hundreds of milliseconds.'
  ],
  formulas: [
    {
      name: 'Energy dissipated in the brake per stop',
      expr: 'W = J*w^2/2*TB/(TB + TL)', tex: 'W = \\tfrac{1}{2}J\\,\\omega^{2}\\,\\dfrac{T_B}{T_B + T_L}',
      vars: {
        W: { name: 'energy into the linings', q: 'energy', unit: 'J' },
        J: { name: 'inertia at the brake shaft', q: 'inertia', unit: 'kg·m²', value: 0.01 },
        w: { name: 'speed when the brake bites', q: 'angvel', unit: 'rpm', value: 1500, tex: '\\omega' },
        TB: { name: 'braking torque', q: 'torque', unit: 'N·m', value: 10, tex: 'T_B' },
        TL: { name: 'load torque (+ helps stop, − drives)', q: 'torque', unit: 'N·m', value: 2, signed: true, tex: 'T_L' }
      },
      note: 'Multiply by the stops per hour for the heat the brake must shed.',
      stories: { W: 'A {TB} brake stops {J} from {w} against a load torque of {TL}. How much energy goes into the linings?', TB: 'A brake must stop {J} from {w} with a load torque of {TL}, absorbing no more than {W}. What braking torque?' }
    },
    {
      name: 'Stopping time of a brake',
      expr: 't = t1 + J*w/(TB + TL)', tex: 't = t_1 + \\dfrac{J\\,\\omega}{T_B + T_L}',
      vars: {
        t: { name: 'time from switch-off to standstill', q: 'time', unit: 'ms' },
        t1: { name: 'engagement delay', q: 'time', unit: 'ms', value: 30, tex: 't_1' },
        J: { name: 'inertia at the brake shaft', q: 'inertia', unit: 'kg·m²', value: 0.01 },
        w: { name: 'speed', q: 'angvel', unit: 'rpm', value: 1500, tex: '\\omega' },
        TB: { name: 'braking torque', q: 'torque', unit: 'N·m', value: 10, tex: 'T_B' },
        TL: { name: 'load torque (+ helps stop, − drives)', q: 'torque', unit: 'N·m', value: 2, signed: true, tex: 'T_L' }
      },
      note: 'During the engagement delay the load keeps turning (and a hanging load keeps falling).',
      stories: { t: 'A brake with {t1} engagement delay and {TB} stops {J} from {w}, load torque {TL}. How long does it take?', TB: 'A load of {J} at {w} (load torque {TL}) must stop within {t}, with {t1} of engagement delay. What braking torque?' }
    },
    {
      name: 'Pull of the brake magnet',
      expr: 'F = F1*(V*d1/(V1*d))^2', tex: 'F = F_1\\left(\\dfrac{V\\,\\delta_1}{V_1\\,\\delta}\\right)^{2}',
      vars: {
        F: { name: 'magnetic pull on the armature', q: 'force', unit: 'N' },
        F1: { name: 'pull at rated voltage and nominal gap', q: 'force', unit: 'N', value: 800, tex: 'F_1' },
        V: { name: 'coil voltage', q: 'voltage', unit: 'V', value: 24 },
        V1: { name: 'rated coil voltage', q: 'voltage', unit: 'V', value: 24, tex: 'V_1' },
        d1: { name: 'nominal air gap', q: 'length', unit: 'mm', value: 0.3, tex: '\\delta_1' },
        d: { name: 'actual air gap', q: 'length', unit: 'mm', value: 0.45, tex: '\\delta' }
      },
      note: 'A simple model: pull ∝ (current/gap)². The brake releases only while the pull exceeds the spring force.',
      stories: { F: 'A brake magnet pulls {F1} at {V1} across {d1}. What does it pull at {V} across a worn gap of {d}?', d: 'A brake pulls {F1} at {V1} across {d1}; the springs need {F}. Up to what gap will it still release at {V}?' }
    }
  ],
  examples: [
    {
      title: 'Stopping on a conveyor and on a hoist',
      q: 'A brake of 10 N·m stops 0.01 kg·m² from 1500 rpm. Find the energy per stop when the load helps with 2 N·m (a conveyor) and when it drives with 2 N·m (a hoist lowering).',
      steps: [
        '$\\omega = 157.1$ rad/s; $\\tfrac12 J\\omega^2 = 0.5 \\times 0.01 \\times 157.1^2 = 123.4$ J.',
        'Conveyor: $123.4 \\times 10/12 = 102.8$ J; stopping time $0.01 \\times 157.1/12 = 0.13$ s plus the engagement delay.',
        'Hoist lowering: $123.4 \\times 10/8 = 154.2$ J; $0.01 \\times 157.1/8 = 0.20$ s — the brake does more work for longer.'
      ],
      a: 'About 103 J on the conveyor, 154 J on the lowering hoist.'
    },
    {
      title: 'A worn brake that will not release',
      q: 'A 24 V brake pulls 800 N across its nominal 0.3 mm gap; its springs push with 500 N. Up to what gap does it release at 24 V, and at 21.6 V (10 % low)?',
      steps: [
        'Release needs $F \\ge 500$ N: $800\\,(0.3/\\delta)^2 \\ge 500$, so $\\delta \\le 0.3\\sqrt{800/500} = 0.38$ mm.',
        'At 21.6 V the pull scales by $0.9^2$: $\\delta \\le 0.3 \\times 0.9 \\times 1.265 = 0.34$ mm.',
        'So 0.04 mm of extra wear, or a sagging supply, is enough to make it drag. Check the gap at every service and measure the voltage at the brake, not at the power supply.'
      ],
      a: 'About 0.38 mm at 24 V, only 0.34 mm at 21.6 V.'
    }
  ],
  quiz: [
    { q: 'A spring-applied brake loses its supply. It…', choices: ['closes: the springs clamp the disc', 'opens: nothing holds the springs', 'stays as it was', 'closes only if the motor turns'], a: 0, why: 'The coil holds the springs off; without current the springs apply the brake. That is the fail-safe principle.' },
    { q: 'As the linings wear, why does the brake eventually fail to release?', choices: ['The air gap grows and the magnetic pull falls roughly with its square', 'The springs get stronger', 'The coil resistance falls', 'The disc gets heavier'], a: 0, why: 'The armature must be pulled across the full gap; a larger gap means much less pull at the same current.' },
    { q: 'Switching a brake coil off on the DC side makes the brake bite faster than switching it on the AC side.', a: true, why: 'On the AC side the coil current freewheels through the rectifier and decays slowly; a DC-side contact (with a varistor) cuts it at once.' },
    { q: 'A servo motor\'s holding brake is used to stop the axis at the end of every move. What happens?', choices: ['It wears out quickly: it is meant to hold and to survive only a limited number of emergency stops', 'Nothing: it is designed for it', 'The motor overheats', 'The encoder is damaged'], a: 0, why: 'The drive should stop the axis; the holding brake closes at standstill. Dynamic stops are for emergencies only.' },
    { q: 'For the same speed and braking torque, when does a brake absorb more energy?', choices: ['When the load drives (a hoist lowering)', 'When the load helps (friction)', 'It is always the same', 'When the brake is new'], a: 0, why: 'W = ½Jω² T_B/(T_B + T_L): a driving load makes T_L negative, so the brake must also absorb the load\'s work during the stop.' }
  ],
  problems: [
    { q: 'A 20 N·m brake stops 0.05 kg·m² from 1000 rpm, helped by a 5 N·m load torque. How much energy goes into the linings?', answer: 219, unit: 'J', tol: 0.01, steps: ['$\\omega = 104.7$ rad/s; $\\tfrac12 J\\omega^2 = 274.2$ J.', '$W = 274.2 \\times 20/25 = 219$ J.'] },
    { q: 'A brake magnet pulls 800 N at 24 V across 0.3 mm; the springs need 450 N. Up to what gap (mm) does it still release at 24 V?', answer: 0.4, unit: 'mm', tol: 0.01, steps: ['$800\\,(0.3/\\delta)^2 = 450$.', '$\\delta = 0.3\\sqrt{800/450} = 0.3 \\times 1.333 = 0.40$ mm.'] }
  ],
  choose: {
    good: [
      'Vertical axes, hoists, lifts and inclined conveyors: the load is held when the power is off.',
      'Machines that must not coast after a power failure or an emergency stop.',
      'Servo axes that must hold position with the drive disabled.'
    ],
    avoid: [
      'Using a holding brake as a working brake: it is sized for holding and a limited number of emergency stops.',
      'Relying on the brake alone to protect people under a load: add mechanical supports and test it.',
      'Oil mist or grease near an unprotected brake: contaminated linings lose most of their torque.'
    ],
    check: [
      'Braking torque against the load torque with the required margin; energy per stop and stops per hour.',
      'Coil voltage at the brake (cable drop), power, release and engagement times, and the switching method (DC side for hoists).',
      'Air gap, maximum gap, wear and release monitoring, manual release.',
      'The drive\'s brake sequence: torque before release, brake closed before torque off.'
    ]
  },
  applications: [
    'Brake motors on hoists and cranes: working brakes switched on the DC side, sized for the stops per hour.',
    'Servo motors on vertical axes and robot joints: 24 V holding brakes, closed by the drive at standstill and by safe brake control after STO.',
    'Gearmotors on inclined belts, gates and doors, which must not run back when stopped.'
  ],
  sources: [
    'IEC 61800-5-2, *Adjustable speed electrical power drive systems — Safety requirements — Functional*: safe brake control (SBC).',
    'ISO 13849-1, *Safety of machinery — Safety-related parts of control systems* — brakes as part of a safety function.',
    'Brake and brake-motor makers\' data: air gaps, coil voltages, rectifiers, switching methods and permitted energy per stop; the figures here are typical.'
  ],
  sim: 'fb-brake'
}

);
