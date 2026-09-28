/* HYPER-MOTORS · content/real-world.js — Motors in the Real World: heat, friction, noise, vibration, bearing and
 * winding failures, maintenance and diagnostics (topic `phenomena`), and the special motors: linear, voice-coil,
 * piezo and ultrasonic, torque, coreless and vibration motors, and solenoids (topic `special-topic`).
 * Simulations: sims/real-world.js (ids rw-…). */
Hyper.add(

{
  id: 'motor-heating', parent: 'phenomena', title: 'Heating, thermal time constants and derating', level: 2,
  short: 'Every loss in a motor ends up as heat. The winding warms towards a steady temperature with a thermal time constant of minutes to hours; the insulation class says how hot it may get, every 10 °C more roughly halves the insulation\'s life, and hot rooms and high altitudes call for derating.',
  keywords: ['motor heating', 'temperature rise', 'thermal time constant', 'insulation life', '10 degree rule', 'Arrhenius', 'Montsinger', 'derating', 'ambient temperature', 'altitude derating', 'service factor', 'hot spot', 'resistance method', 'class F', 'class B rise', 'thermal model', 'overload', 'standstill cooling'],
  prereq: ['efficiency-losses', 'insulation-classes', 'duty-cycles'],
  related: ['ip-cooling', 'motor-protection', 'motor-failures', 'rms-torque-sizing', 'vfd-parameters', 'physics:newtons-law-of-cooling', 'math:exponential-growth-decay', 'electronics:heat-sinks'],
  body: `
A motor is a heater that happens to turn a shaft. A typical 7.5 kW IE3 four-pole motor is 90.4 % efficient: it takes 8.3 kW from the mains and about **0.8 kW stays inside as heat**. A 0.75 kW IE3 motor at 82.5 % loses 160 W from a much smaller body. Where it comes from: copper losses $I^2R$ in the stator and rotor, which grow with the square of the load; iron losses in the laminations, nearly constant at fixed voltage and frequency; friction and the cooling fan; and stray losses. At rated load roughly a third of the losses are fixed and two-thirds depend on the load.

### A tank that fills: the thermal time constant
At switch-on all the heat goes into warming copper and iron; as the motor gets hotter it sheds more to the air, until heat out equals heat in. The temperature climbs along an [[?exponential|exponential]] towards its steady value:

$$T(t) = T_a + P\\,R_{th}\\left(1 - e^{-t/\\tau}\\right)$$

$P$ is the loss, $R_{th}$ the thermal resistance to the air (kelvin per watt), and $\\tau = R_{th}C_{th}$ the **thermal time constant** — 63 % of the way after one $\\tau$, 95 % after three. It is set by the mass and the cooling, not by the load.

| Motor | Thermal time constant (running) | What it means |
|---|---|---|
| Coreless DC motor, 10–30 mm | 5–20 min; the winding alone tens of seconds | a stall can burn the winding in seconds |
| Servo motor, 0.2–5 kW | about 15–60 min | peaks of three times rated torque are fine; the RMS torque decides |
| TEFC induction motor, 0.75 kW | about 15–25 min | reaches its S1 temperature in about an hour |
| TEFC induction motor, 7.5 kW | about 30–50 min | a 10-minute overload goes only a fifth of the way to its new temperature |
| TEFC induction motor, 75 kW | about 1–1.5 h | starts per hour are limited by the rotor, not the frame |

Two warnings hide in the table. A totally enclosed fan-cooled (TEFC) motor stopped at standstill loses its fan, so it cools **two to four times more slowly** than it heats — frequent start–stop duty (S3, S4) runs hotter than the average load suggests. And the winding has its own short time constant of minutes: locked, a motor draws 6–8 times rated current, 36–64 times the copper loss, and the winding climbs several kelvin per second. That is why overload relays of *class 10* must trip within 10 s at 7.2 times the set current ([[motor-protection]]).

### How hot may it get?
IEC 60085 names the insulation classes by their hottest permitted temperature; IEC 60034-1 limits the average winding rise, measured by resistance, for the reference conditions of **40 °C (104 °F) ambient and up to 1000 m altitude** (values for most machines up to a few hundred kW):

| Thermal class | Hottest spot | Permitted rise (resistance method) | Typical use |
|---|---|---|---|
| 130 (B) | 130 °C (266 °F) | 80 K | small and older motors; the *rise* most modern motors are designed for |
| 155 (F) | 155 °C (311 °F) | 105 K | the usual insulation of industrial motors |
| 180 (H) | 180 °C (356 °F) | 125 K | hot places, roller tables, traction, smoke-extract fans |

The hot spot sits some 10–15 K above the average the resistance method measures. The common design — **class F insulation with a class B rise** — keeps 25 K in reserve.

### The 10-kelvin rule
Insulation ages by slow chemical reactions whose rate follows Arrhenius' law. The practical form: **every 10 K hotter halves the life, every 10 K cooler doubles it**:

$$L = L_0 \\cdot 2^{(T_c - T)/10}$$

Running continuously at the class temperature, a winding lasts in the order of 20 000 h. A class F motor with a class B rise has its hot spot near 130 °C and lasts about $2^{2.5} \\approx 5.7$ times longer — more than 100 000 h, the twenty-odd years industrial motors are expected to last. Run it 10 K hotter — a 50 °C plant room, a clogged fan cowl, a 5 % voltage unbalance — and that life halves. A NEMA *service factor* of 1.15 allows 15 % overload, at a higher temperature and a shorter life.

### Derating for heat and altitude
Hotter air leaves less room for the rise; thinner air carries away less heat (about 1 % more rise per 100 m above 1000 m). With copper losses rising as load² the permissible load falls roughly as follows (the maker's tables govern):

| Ambient | 40 °C | 45 °C | 50 °C | 55 °C | 60 °C |
|---|---|---|---|---|---|
| Permissible load | 100 % | 96 % | 92 % | 88 % | 84 % |

| Altitude | 1000 m | 2000 m | 3000 m | 4000 m |
|---|---|---|---|---|
| Permissible load | 100 % | 93 % | 86 % | 80 % |

Other things cost cooling too: a self-ventilated motor on a VFD at low speed (its fan slows with it), voltage unbalance ([[motor-failures]]), many starts per hour, dirt on the fins, and a motor boxed into a cabinet.

### Measuring it
Measure the cold resistance, run to steady state, stop and measure again quickly: for copper $T_2 = \\frac{R_2}{R_1}(235 + T_1) - 235$. In service, PTC thermistors in the end windings trip a relay; servo motors carry a PT1000 or KTY sensor read by the drive. A healthy class F motor at full load often has a frame at 60–80 °C — too hot to hold — with the winding tens of kelvin hotter still.

In the simulation, load a motor, change the ambient, the altitude or the duty, and watch the winding and the frame climb their curves; the life gauge counts insulation life at the 10-kelvin rule, and *Lock the rotor* shows how fast a stall cooks a winding.

> [!warn] Motor frames can burn skin, and a motor that tripped on its thermistor restarts by itself if the control allows it. Never bridge thermal protection; work on terminal boxes only when isolated, locked off and proven dead, by a qualified person.

> [!key] Temperature, not load, wears a motor out. Losses set the steady rise, the time constant sets how fast it gets there, and every 10 K above the design temperature halves the insulation's life — so derate for heat, altitude and poor cooling.
`,
  ideas: [
    'Losses become heat; the winding rises exponentially towards loss × thermal resistance, with a time constant of minutes (small) to hours (large motors).',
    'IEC 60034-1 rates motors at 40 °C ambient and 1000 m; the insulation class sets the hottest allowed temperature.',
    'Every 10 K hotter roughly halves the insulation\'s life (Arrhenius), so a class F motor with a class B rise lasts many times longer.',
    'Hot rooms, altitude, slow self-cooled motors on VFDs and frequent stops all need derating or extra cooling.',
    'A locked rotor heats the winding by several kelvin per second: protection must act within seconds.'
  ],
  pitfalls: [
    'The frame is as hot as the winding — The frame is usually tens of kelvin cooler; the winding hot spot is what ages the insulation.',
    'A short overload does no harm because the motor is still cool — It is true only for overloads short compared with the time constant; the winding\'s own time constant is minutes, and a stall or a jammed load heats it in seconds.',
    'A motor that runs cool enough at 50 Hz will run cool at 10 Hz on a VFD — A self-ventilated motor loses most of its cooling at low speed while a constant-torque load keeps the current (and the copper loss) the same.'
  ],
  derivation: {
    title: 'Where the exponential comes from',
    steps: [
      { text: 'Heat in equals heat stored plus heat lost to the air:', tex: 'P = C_{th}\\,\\frac{dT}{dt} + \\frac{T - T_a}{R_{th}}' },
      { text: 'Write the rise as $\\theta = T - T_a$ and the time constant as $\\tau = R_{th}C_{th}$:', tex: '\\tau\\,\\frac{d\\theta}{dt} + \\theta = P\\,R_{th}' },
      { text: 'Starting cold ($\\theta = 0$ at $t = 0$) the solution of this first-order [[?differential-equation|differential equation]] is', tex: '\\theta(t) = P\\,R_{th}\\left(1 - e^{-t/\\tau}\\right)' },
      { text: 'After switch-off ($P = 0$) the motor cools as $\\theta_0\\,e^{-t/\\tau_{\\text{off}}}$, where a stopped TEFC motor\'s $\\tau_{\\text{off}}$ is longer because its fan has stopped.' }
    ]
  },
  formulas: [
    {
      name: 'Winding temperature after running a while',
      expr: 'T = Ta + P*Rth*(1 - exp(-t/tau))', tex: 'T = T_a + P\\,R_{th}\\left(1 - e^{-t/\\tau}\\right)',
      vars: {
        T: { name: 'winding temperature', q: 'temperature', unit: '°C' },
        Ta: { name: 'ambient temperature', q: 'temperature', unit: '°C', value: 40, tex: 'T_a' },
        P: { name: 'losses heating the motor', q: 'power', unit: 'W', value: 800 },
        Rth: { name: 'thermal resistance to the air', q: 'thermalres', unit: 'K/W', value: 0.1, tex: 'R_{th}' },
        t: { name: 'running time', q: 'time', unit: 'min', value: 30 },
        tau: { name: 'thermal time constant', q: 'time', unit: 'min', value: 40, tex: '\\tau' }
      },
      note: 'A single-body model: good for the frame and for loads that change slowly. The winding itself has a shorter time constant of its own.',
      stories: { T: 'A motor losing {P} with a thermal resistance of {Rth} and a time constant of {tau} starts cold in {Ta} air. How hot is it after {t}?', t: 'How long can a cold motor losing {P} ({Rth}, time constant {tau}) run in {Ta} air before it reaches {T}?' }
    },
    {
      name: 'Insulation life: the 10-kelvin rule',
      expr: 'L = L0*2^((Tc - T)/10)', tex: 'L = L_0 \\cdot 2^{(T_c - T)/10}',
      vars: {
        L: { name: 'expected insulation life', q: 'time', unit: 'h' },
        L0: { name: 'life at the class temperature', q: 'time', unit: 'h', value: 20000, tex: 'L_0' },
        Tc: { name: 'class temperature (hottest spot allowed)', q: 'temperature', unit: '°C', value: 155, tex: 'T_c' },
        T: { name: 'hottest-spot temperature in service', q: 'temperature', unit: '°C', value: 130 }
      },
      note: 'A rule of thumb from Arrhenius\' law (the 10 is in kelvin). Real insulation systems have their own slopes, often 8–12 K per halving.',
      stories: { L: 'A class F winding ({Tc}) runs with its hot spot at {T}. If it would last {L0} at its class temperature, how long will it last?', T: 'What hot-spot temperature gives a class F winding ({Tc}, {L0} at class temperature) a life of {L}?' }
    },
    {
      name: 'Load allowed in a hot room',
      expr: 'k = sqrt(((dT + Tr - Ta)/dT - f)/(1 - f))', tex: 'k = \\sqrt{\\dfrac{(\\Delta T + T_r - T_a)/\\Delta T - f}{1 - f}}',
      vars: {
        k: { name: 'permissible load, fraction of rated', q: 'ratio', unit: '%' },
        dT: { name: 'temperature rise at rated load', q: 'dtemp', unit: 'K', value: 105, tex: '\\Delta T' },
        Tr: { name: 'reference ambient of the rating', q: 'temperature', unit: '°C', value: 40, fixed: true, tex: 'T_r' },
        Ta: { name: 'actual ambient', q: 'temperature', unit: '°C', value: 50, tex: 'T_a' },
        f: { name: 'fixed-loss share at rated load', q: 'ratio', unit: '%', value: 35 }
      },
      note: 'Keeps the winding at the temperature it reaches at rated load in 40 °C air: the rise shrinks by the extra ambient, the fixed losses stay and the copper losses scale with load². With a 105 K rise and 35 % fixed losses it reproduces typical makers\' tables.',
      stories: { k: 'A motor with a {dT} rise and {f} fixed losses is installed where the air is {Ta}. What fraction of its rating may it carry?', Ta: 'Up to what ambient can a motor ({dT} rise, {f} fixed losses) carry {k} of its rating?' }
    },
    {
      name: 'Winding temperature by the resistance method',
      expr: 'T2 = R2/R1*(235 + T1) - 235', tex: 'T_2 = \\dfrac{R_2}{R_1}\\,(235 + T_1) - 235',
      vars: {
        T2: { name: 'hot winding temperature (°C)', q: false, unit: '°C', signed: true, tex: 'T_2' },
        R2: { name: 'hot resistance', q: 'resistance', unit: 'Ω', value: 1.58, tex: 'R_2' },
        R1: { name: 'cold resistance', q: 'resistance', unit: 'Ω', value: 1.2, tex: 'R_1' },
        T1: { name: 'cold winding temperature (°C)', q: false, unit: '°C', value: 20, signed: true, tex: 'T_1' }
      },
      note: 'For copper (235 is the temperature in °C below zero where copper\'s resistance would extrapolate to nothing; 225 for aluminium). Measure between the same two terminals, with the same instrument, as fast as possible after stopping.',
      stories: { T2: 'A winding measures {R1} at {T1} and {R2} straight after a heat run. How hot was it?', R2: 'A winding measures {R1} at {T1}. What will it read at {T2}?' }
    }
  ],
  examples: [
    {
      title: 'How hot does a 7.5 kW motor get, and how fast?',
      q: 'A 7.5 kW IE3 motor (90.4 % efficient at rated load) has a thermal resistance of 0.1 K/W to the air and a time constant of 40 min. Starting cold in 40 °C air at rated load, find its losses, its final temperature and its temperature after 30 min.',
      steps: [
        'Losses: $P = 7500\\,(1/0.904 - 1) = 797$ W.',
        'Steady rise: $P R_{th} = 797 \\times 0.1 = 80$ K, so the frame model settles at $40 + 80 = 120$ °C.',
        'After 30 min: $80\\,(1 - e^{-30/40}) = 80 \\times 0.528 = 42$ K, so about 82 °C.'
      ],
      a: 'About 800 W of losses; 82 °C after half an hour, 120 °C after two or three hours.'
    },
    {
      title: 'A motor moved into a hot plant room',
      q: 'The motor runs in a room at 50 °C instead of 40 °C. Its rated rise is 105 K and about 35 % of its losses are fixed. What load keeps the winding at its rated temperature? And if it runs at full load anyway, what happens to its insulation life?',
      steps: [
        'Rise available: $105 - 10 = 95$ K, i.e. $95/105 = 0.905$ of the rated losses.',
        'Fixed losses keep 0.35 of that, the copper losses may be $0.905 - 0.35 = 0.555$ instead of 0.65: $k = \\sqrt{0.555/0.65} = 0.924$.',
        'At full load the winding runs 10 K hotter than designed: by the 10-kelvin rule its insulation life halves.'
      ],
      a: 'Load it to about 92 % (6.9 kW), or accept roughly half the insulation life.'
    },
    {
      title: 'Measuring the rise by resistance',
      q: 'Before a heat run a winding reads 1.20 Ω at 20 °C. Right after the run it reads 1.58 Ω; the room is at 25 °C. What were the winding temperature and its rise?',
      steps: [
        '$T_2 = (1.58/1.20)(235 + 20) - 235 = 1.317 \\times 255 - 235 = 101$ °C.',
        'Rise over the room: $101 - 25 = 76$ K — inside a class B rise (80 K), with a class F winding well in reserve.'
      ],
      a: 'About 101 °C, a rise of 76 K.'
    }
  ],
  quiz: [
    { q: 'A motor starts cold and runs at constant load. After one thermal time constant its temperature rise is…', choices: ['about 63 % of the final rise', 'about 37 % of the final rise', 'the final rise', 'half the final rise'], a: 0, why: '1 − e⁻¹ = 0.632. After 3τ it is 95 %, after 5τ over 99 %.' },
    { q: 'A class F winding normally runs with its hot spot at 135 °C. It is re-rated so that it runs at 115 °C. By the 10-kelvin rule its insulation life…', choices: ['roughly quadruples', 'roughly doubles', 'rises by 20 %', 'does not change'], a: 0, why: '20 K cooler is two halvings undone: 2² = 4 times the life.' },
    { q: 'The frame of a healthy class F motor at full load is at 75 °C. This means the winding is also at about 75 °C.', a: false, why: 'Heat flows from the winding through the iron to the frame, so the winding is hotter — typically by tens of kelvin, and the hot spot hotter still.' },
    { q: 'Why does a self-ventilated induction motor overheat at rated torque on a VFD at 10 Hz?', choices: ['Its shaft-mounted fan turns slowly and cools poorly, while the current and copper loss stay the same', 'The iron losses rise sharply at low frequency', 'The voltage is too high at low frequency', 'The slip becomes very large'], a: 0, why: 'Constant torque needs constant current, so the I²R loss stays; the fan\'s airflow falls with speed. Use a separately powered fan or derate at low speed.' },
    { q: 'A motor rated for 40 °C and 1000 m will be installed at 3000 m. Roughly what should you plan for?', choices: ['About 10–15 % less continuous load, or a larger or better-cooled motor', 'No change: altitude does not affect motors', 'About 50 % less load', 'A higher supply voltage'], a: 0, why: 'Thin air removes less heat: about 1 % more rise per 100 m above 1000 m. Typical tables give around 86 % at 3000 m (cooler air at altitude can offset some of it).' }
  ],
  problems: [
    { q: 'A class F winding (155 °C) would last 20 000 h at its class temperature. How long will it last with its hot spot at 145 °C?', answer: 40000, unit: 'h', tol: 0.02, steps: ['10 K below the class temperature: one doubling.', '$L = 20\\,000 \\times 2^{(155-145)/10} = 40\\,000$ h.'] },
    { q: 'An 11 kW motor is 91.4 % efficient at full load. How many watts of heat does it produce?', answer: 1035, unit: 'W', tol: 0.02, steps: ['Input $= 11\\,000/0.914 = 12\\,035$ W.', 'Losses $= 12\\,035 - 11\\,000 = 1035$ W.'] },
    { q: 'A motor with a 40-minute time constant and a final rise of 80 K starts cold in 30 °C air. What is its temperature after 20 minutes?', answer: 61.5, unit: '°C', tol: 0.02, steps: ['Rise: $80(1 - e^{-20/40}) = 80 \\times 0.393 = 31.5$ K.', '$T = 30 + 31.5 = 61.5$ °C.'] }
  ],
  choose: {
    good: [
      'A standard motor as rated: S1 duty at up to rated load, 40 °C air or cooler, up to 1000 m, clean fins and a free fan inlet.',
      'Class F insulation with a class B rise: a 25 K reserve for hot days, voltage dips and dirt.',
      'Short overloads — minutes on a big motor, seconds on a small one — when the RMS load over the cycle stays within the rating.'
    ],
    avoid: [
      'Running a self-ventilated motor at low speed and full torque on a VFD without derating or a separately powered fan.',
      'Frequent starting and stopping of large or high-inertia loads without checking the permitted starts per hour.',
      'Enclosing a motor in a box or placing it in the hot exhaust of other equipment.'
    ],
    check: [
      'The real ambient at the motor (not the room average) and the altitude of the site.',
      'The duty cycle: the RMS load, the number of starts per hour and the standstill time.',
      'The insulation class and the rated rise on the nameplate, and whether thermistors or sensors are fitted and wired to a relay or the drive.',
      'The frame temperature in service with an infrared thermometer, and its trend over months.'
    ]
  },
  applications: [
    'Sizing a motor for a hot foundry or a mine at altitude: derate from the maker\'s tables or choose the next frame up.',
    'Servo sizing: the RMS torque of the motion cycle is compared with the continuous torque because the motor\'s thermal time constant averages the peaks ([[rms-torque-sizing]]).',
    'Overload relays and drives model the motor\'s heating with the same exponential to decide when to trip.'
  ],
  history: 'In 1930 V. M. Montsinger, studying transformer insulation, proposed that its life halves for every fixed rise in temperature (he found about 8 °C for oil-impregnated paper). In 1948 T. W. Dakin explained such rules as chemical reaction rates following Arrhenius\' law — the basis of today\'s thermal-endurance tests and insulation classes.',
  sources: [
    'IEC 60034-1, *Rotating electrical machines — Rating and performance*: reference conditions (40 °C, 1000 m), limits of temperature rise by thermal class, the resistance method.',
    'IEC 60085, *Electrical insulation — Thermal evaluation and designation*: the thermal classes.',
    'IEC 60216 (series), *Electrical insulating materials — Thermal endurance properties*: how insulation life is measured against temperature.',
    'NEMA MG 1, *Motors and Generators*: temperature rise and the service factor of NEMA motors.',
    'Hughes and Drury, *Electric Motors and Drives*: motor ratings, cooling and thermal considerations.'
  ],
  sim: 'rw-heating'
},

{
  id: 'friction-in-motors', parent: 'phenomena', title: 'Friction and its costs', level: 2,
  short: 'Bearings, seals, brushes, grease, the cooling fan and — in magnet motors — cogging all resist the shaft. Friction costs energy, heats bearings, wears brushes and seals, and makes slow, precise motion jerky; knowing how each part behaves with speed and temperature tells you what to choose and what to watch.',
  keywords: ['friction', 'bearing friction', 'seal friction', 'lip seal', 'brush friction', 'windage', 'fan losses', 'cogging torque', 'detent torque', 'stiction', 'stick-slip', 'Stribeck', 'coast-down test', 'breakaway torque', 'grease', 'no-load current', 'friction and windage losses'],
  prereq: ['torque-and-power', 'efficiency-losses', 'physics:friction'],
  related: ['bearings-motors', 'brushes-commutator', 'bearing-failures', 'dc-torque-speed', 'servo-tuning', 'gearboxes', 'coreless-motors', 'motor-noise'],
  body: `
Turn off a motor and it coasts to a stop: something takes its kinetic energy away. That something is friction in all its forms, and it is in every motor, every hour it runs.

### Where the friction is

| Source | How it behaves | Typical size |
|---|---|---|
| Rolling bearings | a nearly constant torque from rolling and sliding, plus a viscous part from the grease | 0.01–0.05 N·m per bearing in a 5–15 kW motor: a few watts each |
| Contact lip seals (IP65 motors, gearmotors) | nearly constant torque; high when dry or new | often as much as both bearings together — tens of watts on a 40–60 mm shaft at 1500–3000 rpm |
| Brushes on a commutator or slip rings | dry sliding friction, coefficient about 0.1–0.3 | a few per cent of rated torque in small motors |
| Cooling fan and windage | torque grows with speed², power with speed³ | 1–2 % of rated power in a 4-pole TEFC motor, more in 2-pole |
| Iron losses in magnet motors | a drag: hysteresis constant, eddy currents rising with speed | shows up in the no-load current $I_0$ |
| Cogging (slotted magnet motors) | not friction but a detent that ripples with position and averages zero | 0.5–5 % of rated torque; almost zero in skewed, slotless and coreless designs |

Together these are what a DC motor's no-load current $I_0$ pays for ([[dc-torque-speed]]) and what IEC 60034-2-1 calls the *friction and windage losses* of an AC motor.

### A model with three terms
For most purposes

$$T_f = T_c + b\\,\\omega + k_f\\,\\omega^2$$

— a constant (Coulomb) torque $T_c$ from bearings, seals and brushes, a viscous term $b\\omega$ from grease and eddy currents, and the fan's $k_f\\omega^2$. At standstill a fourth effect appears: the torque needed to *start* (breakaway, or stiction) is higher than the torque to keep turning, and just above zero speed friction actually falls with speed as a lubricant film builds up (the Stribeck effect). That dip is what makes slow motion stick and slip.

### Bearing friction, estimated
Rolling-bearing makers give a simple estimate:

$$M = \\tfrac12\\,\\mu\\,F\\,d$$

with $F$ the bearing load, $d$ the bore and $\\mu \\approx 0.0015$ for a deep-groove ball bearing (about 0.001–0.002 for other types). A 40 mm bearing carrying 1.5 kN: $M = 0.5 \\times 0.0015 \\times 1500 \\times 0.04 = 0.045$ N·m, which at 1450 rpm is 7 W. Grease churning adds a similar amount — much more when a bearing is over-greased.

### What friction costs
- **Energy.** $P = T_f\\,\\omega$. 0.2 N·m of seal and bearing drag at 1450 rpm is 30 W; over 8000 hours a year that is 240 kWh — small for one motor, large for a plant with a thousand.
- **Heat in the wrong place.** Seal and grease friction heats the bearings; grease life halves for every 15 K or so above about 70 °C ([[bearing-failures]]).
- **Wear.** Brushes wear to dust and groove the commutator ([[brushes-commutator]]); lip seals wear grooves in shafts and then leak.
- **Precision.** A servo holding position against stiction hunts back and forth; a slow axis moves in jerks; cogging makes a low-speed ripple in speed. Remedies: an integral term and friction feed-forward in the drive ([[servo-tuning]]), rolling instead of sliding guides, skewed or slotless motors ([[coreless-motors]]).
- **Starting.** Grease stiffens in the cold: a gearmotor that starts easily at 20 °C may need two or three times the torque at −20 °C.

### What changes it in service

| Cause | Effect | Remedy |
|---|---|---|
| Over-greasing | churning, bearings 10–20 K hotter, grease pushed into the winding | the maker's quantity, purge plug open while greasing |
| Too little or aged grease | metal contact: noise, heat, rising friction | re-lubricate on schedule |
| Misalignment, belts too tight | higher bearing loads and friction | align; tension belts to the maker's value |
| Cold start | viscous grease, high breakaway torque | low-temperature grease, anti-condensation heater |
| New or dry lip seal | high torque and heat until run in | lubricate the lip on assembly |
| Worn brushes, rough commutator | sparking, friction, dust | replace brushes, resurface the commutator |

The simulation spins a shaft in its bearings and seal (or a small DC motor with brushes) and splits the friction torque into its parts; *Coast down* cuts the power and lets friction alone stop the rotor — a classic way to measure it. Try a cold start and an over-greased bearing.

> [!tip] Trend the no-load current of a DC motor or the no-load input power of an AC motor. A slow rise means bearings, seals or brushes are getting worse — long before anything breaks.

> [!warn] Only turn a shaft by hand when the machine is isolated and locked off; loose clothing and hair catch on rotating shafts and couplings.

> [!key] Friction is a constant part, a part proportional to speed and a fan part growing with speed squared, plus stiction at standstill. It costs energy, heats bearings, wears contacts and spoils slow precise motion — choose seals, bearings and lubrication for the job.
`,
  ideas: [
    'Motor friction has a constant (Coulomb) part, a viscous part and a fan part rising with speed squared.',
    'A deep-groove ball bearing\'s friction torque is roughly ½ μ F d with μ ≈ 0.0015; a lip seal can cost as much as both bearings.',
    'Breakaway (static) friction exceeds running friction; the dip just above zero speed causes stick-slip.',
    'Cogging is a position-dependent detent in slotted magnet motors, not friction, but it spoils slow motion in the same way.',
    'Friction losses are energy, heat in the bearings, wear of brushes and seals, and lost precision.'
  ],
  pitfalls: [
    'Friction losses are too small to matter — In one motor, perhaps; but 30 W over 8000 h is 240 kWh a year, and seal and grease friction heat the bearings and shorten their grease life.',
    'More grease means less friction — Over-greasing makes the balls churn the grease: the bearing runs hotter and the grease degrades faster.',
    'Cogging is a kind of friction that only costs energy — Cogging averages zero over a turn; its harm is the ripple in torque and speed at low speed.'
  ],
  formulas: [
    {
      name: 'Bearing friction torque (simple estimate)',
      expr: 'M = mu*F*d/2', tex: 'M = \\tfrac12\\,\\mu\\,F\\,d',
      vars: {
        M: { name: 'friction torque', q: 'torque', unit: 'N·m' },
        mu: { name: 'friction coefficient of the bearing', value: 0.0015, tex: '\\mu' },
        F: { name: 'bearing load', q: 'force', unit: 'N', value: 1500 },
        d: { name: 'bearing bore', q: 'length', unit: 'mm', value: 40 }
      },
      note: 'μ ≈ 0.0015 for deep-groove ball bearings, about 0.001–0.002 for other rolling bearings, at normal loads and good lubrication. Grease and seals add to it.',
      stories: { M: 'A {d} bore bearing carries {F}. Estimate its friction torque.', F: 'A {d} bore bearing shows a friction torque of {M}. What load is it carrying?' }
    },
    {
      name: 'Power lost to friction',
      expr: 'P = T*w', tex: 'P = T_f\\,\\omega',
      vars: {
        P: { name: 'friction power', q: 'power', unit: 'W' },
        T: { name: 'friction torque', q: 'torque', unit: 'N·m', value: 0.2, tex: 'T_f' },
        w: { name: 'shaft speed', q: 'angvel', unit: 'rpm', value: 1450, tex: '\\omega' }
      },
      stories: { P: 'Seals and bearings drag with {T} on a shaft turning at {w}. How much power do they waste?' }
    },
    {
      name: 'Energy over a year',
      expr: 'E = P*t', tex: 'E = P\\,t',
      vars: {
        E: { name: 'energy lost', q: 'energy', unit: 'kWh' },
        P: { name: 'friction power', q: 'power', unit: 'W', value: 30 },
        t: { name: 'running time', q: 'time', unit: 'h', value: 8000 }
      },
      stories: { E: 'A seal wastes {P} on a motor that runs {t} a year. How much energy is that?' }
    },
    {
      name: 'Brush friction torque',
      expr: 'T = mu*F*N*r', tex: 'T_b = \\mu\\,F\\,N\\,r',
      vars: {
        T: { name: 'brush friction torque', q: 'torque', unit: 'N·m', tex: 'T_b' },
        mu: { name: 'brush friction coefficient', value: 0.2, tex: '\\mu' },
        F: { name: 'spring force on each brush', q: 'force', unit: 'N', value: 0.75 },
        N: { name: 'number of brushes', int: true, value: 2 },
        r: { name: 'commutator radius', q: 'length', unit: 'mm', value: 8 }
      },
      note: 'The spring force is the brush face area times the spring pressure, typically 15–25 kPa in small and industrial machines.',
      stories: { T: '{N} brushes press on a commutator of radius {r} with {F} each; the friction coefficient is {mu}. What is the brush friction torque?' }
    }
  ],
  examples: [
    {
      title: 'The friction of a 7.5 kW motor',
      q: 'A 7.5 kW, 1450 rpm motor has a 40 mm drive-end bearing carrying 1.5 kN and a 35 mm non-drive-end bearing carrying 0.6 kN (μ = 0.0015), a lip seal of 0.12 N·m and a fan taking 60 W at full speed. Estimate the friction torques and the total friction and windage loss (ignore grease churning).',
      steps: [
        'Bearings: $0.5 \\times 0.0015 \\times 1500 \\times 0.040 = 0.045$ N·m and $0.5 \\times 0.0015 \\times 600 \\times 0.035 = 0.016$ N·m.',
        'Speed: 1450 rpm = 151.8 rad/s. Bearings $0.061 \\times 151.8 = 9$ W; seal $0.12 \\times 151.8 = 18$ W; fan 60 W.',
        'Total about 90 W — 1.2 % of the rating, typical of a 4-pole TEFC motor.'
      ],
      a: 'About 90 W, of which the fan takes two-thirds and the seal twice as much as both bearings.'
    },
    {
      title: 'Brushes in a small DC motor',
      q: 'A 24 V, 100 W DC motor (torque constant 0.055 N·m/A, rated torque 0.25 N·m) has two brushes pressed with 0.75 N each on an 8 mm radius commutator, μ = 0.2. What torque do the brushes take, and what share of the no-load current is that?',
      steps: [
        '$T_b = 0.2 \\times 0.75 \\times 2 \\times 0.008 = 0.0024$ N·m — about 1 % of rated torque.',
        'Current to overcome it: $0.0024/0.055 = 0.044$ A. If the no-load current is 0.25 A, the brushes account for about a fifth; bearings, iron losses and the fan take the rest.'
      ],
      a: 'About 2.4 mN·m, roughly a fifth of the no-load current.'
    }
  ],
  quiz: [
    { q: 'A motor\'s fan loss is 60 W at 1450 rpm. At 2900 rpm (on a VFD) it will be about…', choices: ['480 W', '120 W', '240 W', '60 W'], a: 0, why: 'Fan power grows with speed cubed: 2³ = 8 times.' },
    { q: 'Why does a servo axis with sliding guides tend to "hunt" around a stopped position?', choices: ['Static friction is higher than running friction, so it sticks, then jumps past the target', 'The encoder is too fine', 'The motor has too much torque', 'Friction makes the motor run faster'], a: 0, why: 'Stick-slip: the integral action builds torque until the axis breaks free, then friction drops and it overshoots.' },
    { q: 'Adding extra grease to a bearing always reduces its friction.', a: false, why: 'A bearing needs only a partial fill. Excess grease is churned by the balls: more friction, higher temperature, faster ageing.' },
    { q: 'A lip seal drags with 0.15 N·m on a shaft at 3000 rpm. Roughly how much heat does it make?', choices: ['About 47 W', 'About 4.7 W', 'About 450 W', 'About 0.5 W'], a: 0, why: '3000 rpm = 314 rad/s; 0.15 × 314 = 47 W, all of it at the lip, next to the bearing.' },
    { q: 'Which motor has essentially no cogging torque?', choices: ['A coreless (ironless) DC motor', 'A slotted PMDC motor', 'A hybrid stepper', 'A slotted brushless motor with unskewed magnets'], a: 0, why: 'Cogging comes from magnets pulling on stator teeth; with no iron teeth in the air gap there is nothing to pull on.' }
  ],
  problems: [
    { q: 'A 25 mm bore ball bearing carries 800 N (μ = 0.0015). What is its friction torque in mN·m?', answer: 15, unit: 'mN·m', tol: 0.02, steps: ['$M = 0.5 \\times 0.0015 \\times 800 \\times 0.025 = 0.015$ N·m = 15 mN·m.'] },
    { q: 'Bearing, seal and fan losses of a pump motor total 90 W and it runs 6000 h a year. How many kWh are lost to friction each year?', answer: 540, unit: 'kWh', tol: 0.01, steps: ['$E = 90 \\times 6000 = 540\\,000$ Wh = 540 kWh.'] }
  ],
  choose: {
    good: [
      'Shielded or sealed-for-life ball bearings (2Z, 2RS) in small and medium motors: low friction, no maintenance.',
      'Non-contact seals (labyrinths, flingers, shields) in clean or merely damp places: almost no friction or wear.',
      'Coreless, slotless or skewed magnet motors where smooth low-speed motion matters.'
    ],
    avoid: [
      'Contact lip seals on fast shafts where the environment does not need them: tens of watts of heat next to the bearing.',
      'Brushed motors for long, continuous duty: brush friction, dust and wear.',
      'Standard grease for outdoor or cold-store machines that must start at −20 °C.'
    ],
    check: [
      'The breakaway torque at the lowest temperature against the motor\'s starting torque.',
      'The bearing loads from belts and overhung pulleys, and the alignment of couplings.',
      'The lubrication instructions on the nameplate: interval, grease type and quantity.',
      'For positioning: the friction and cogging the servo must overcome at the slowest speed.'
    ]
  },
  applications: [
    'Coast-down (retardation) tests measure a machine\'s friction and windage from the slope of speed against time and the rotor\'s inertia.',
    'Energy audits of large plants add up friction, fan and seal losses of hundreds of motors.',
    'Precision stages use air or magnetic bearings and ironless motors to remove friction and cogging altogether.'
  ],
  sources: [
    'IEC 60034-2-1, *Rotating electrical machines — Standard methods for determining losses and efficiency from tests*: friction and windage losses as a separate loss component.',
    'Rolling-bearing manufacturers\' general catalogues: the simple friction estimate M = ½ μ F d with typical μ for each bearing type, grease quantities and relubrication.',
    'Hendershot and Miller, *Design of Brushless Permanent-Magnet Machines*: cogging torque and how skew and slot–pole combinations reduce it.',
    'Hughes and Drury, *Electric Motors and Drives*: losses and the no-load behaviour of motors.'
  ],
  sim: 'rw-friction'
},

{
  id: 'motor-noise', parent: 'phenomena', title: 'Motor noise', level: 2,
  short: 'A motor makes noise in four ways: magnetic forces hum at twice the line frequency and whine at the drive\'s switching frequency, bearings and brushes rumble and hiss, and the fan roars with speed. Knowing which is which — and how decibels add, weight and fall with distance — tells you how to make a machine quieter and what a new sound means.',
  keywords: ['motor noise', 'magnetic noise', 'hum', '100 Hz hum', 'PWM whine', 'switching frequency', 'carrier frequency', 'fan noise', 'aerodynamic noise', 'bearing noise', 'dB(A)', 'A-weighting', 'sound power', 'sound pressure', 'decibel addition', 'IEC 60034-9', 'noise diagnosis', 'magnetostriction'],
  prereq: ['vfd-principle', 'physics:sound-intensity', 'ergonomics:noise-basics'],
  related: ['motor-vibration', 'bearing-failures', 'vfd-parameters', 'stepper-resonance', 'friction-in-motors', 'ergonomics:noise-exposure', 'ergonomics:noise-control', 'electronics:decibels', 'hydraulic-heat-noise'],
  body: `
Stand next to a running motor and you hear several machines at once. Each noise has its own cause, its own pitch and its own remedy, and learning to tell them apart is one of the cheapest diagnostic skills there is.

### Four families of noise

| Source | Frequency | Sounds like | Grows with | Tell-tale |
|---|---|---|---|---|
| Magnetic (the stator pulled by its own field) | twice the line frequency (100 or 120 Hz) and slot harmonics of hundreds of hertz to a few kHz | a hum or tonal whine | flux (voltage/frequency) and load | stops the instant the power is cut |
| Inverter (PWM) | the switching frequency and its sidebands, 2–16 kHz | a whistle or squeal | low switching frequency | changes when the carrier is changed |
| Mechanical: bearings, brushes, gears, unbalance | broadband kHz; 1× speed for unbalance | hiss, rumble, grinding, a beat | speed and wear | continues while the motor coasts |
| Aerodynamic: the cooling fan and windage | broadband, plus a tone at blades × revolutions per second | a rushing roar | speed, steeply | continues while coasting; dominant in 2-pole motors |

Magnetic forces pull on the stator teeth twice per electrical cycle, so a 50 Hz motor hums at 100 Hz; the laminations also change length slightly with flux (magnetostriction). On a variable-frequency drive the current carries ripple at the transistors' **switching (carrier) frequency** — at 4 kHz a clearly audible whine, often 5–15 dB(A) more than on a clean sine supply; above 8–16 kHz it fades from hearing, at the price of more switching loss in the drive ([[vfd-parameters]]).

### Decibels in five rules
Sound is measured in decibels ([[ergonomics:noise-basics|dB]]) — a [[?logarithm|logarithmic]] scale:
- **Sound power** $L_W$ belongs to the machine; **sound pressure** $L_p$ is what a meter reads at a place. Catalogues give both; compare like with like.
- **A-weighting**, dB(A), copies the ear's low sensitivity to bass: −19 dB at 100 Hz, 0 at 1 kHz, +1 at 2–4 kHz, −7 at 16 kHz. A 100 Hz hum counts for little in dB(A) yet can still annoy.
- Levels **add as powers**: two equal sources give +3 dB, ten give +10 dB; a source 10 dB below another adds only 0.4 dB — silence the loudest one first.
- Away from walls, the level falls **6 dB each time the distance doubles**.
- +10 dB sounds about twice as loud; a pure tone annoys more than broadband noise of the same level.

### Typical levels
Sound pressure at 1 m, A-weighted, typical ranges (the maker's data govern):

| Machine | Typical level |
|---|---|
| Small BLDC fan or pump in electronics | 20–35 dB(A) |
| NEMA 23 stepper on a microstepping driver | 30–50 dB(A), louder at resonant speeds |
| 4-pole TEFC induction motor, 0.75 kW, 50 Hz | 45–55 dB(A) |
| 4-pole TEFC, 7.5 kW | 55–65 dB(A) |
| 4-pole TEFC, 75 kW | 70–75 dB(A) |
| The same frames as 2-pole motors | 5–10 dB(A) more — mostly the fan |
| Universal motor in a vacuum cleaner or drill | 70–90 dB(A) at the user |

IEC 60034-9 sets the permitted sound power of industrial motors; ISO 1680 says how to measure it. In a workplace, the daily exposure matters: the EU action values are 80 and 85 dB(A) ([[ergonomics:noise-exposure]]).

### Fan noise and speed
A fan's sound power rises roughly as the fifth power of its speed — about $50\\log_{10}(n_2/n_1)$ dB. Running a 50 Hz motor at 60 Hz adds 4 dB(A); at 100 Hz, 15 dB(A). Quiet choices: a 4-pole instead of a 2-pole motor, a separately driven fan that runs only when needed, or a unidirectional fan on 2-pole motors.

### Make it quieter

| Noise | Remedies |
|---|---|
| PWM whine | raise the switching frequency (derate the drive), random or spread-spectrum PWM, a sine or output filter |
| Magnetic hum | lower the flux at light load (energy-optimising V/f), skewed rotors and suitable slot numbers, stiff mounting |
| Fan roar | lower speed, better fan, separate fan, ducted air |
| Bearings | lubrication, alignment, replace worn bearings — see [[bearing-failures]] |
| Structure-borne noise | anti-vibration mounts, flexible couplings and hose connections, avoid resonances ([[motor-vibration]]) |
| Everything else | enclosures and barriers ([[ergonomics:noise-control]]) |

In the simulation, change speed, switching frequency, poles, bearing condition and distance, and watch the octave-band spectrum and the dB(A) total — and which source dominates.

> [!tip] Cut the power and listen. A sound that stops instantly is magnetic or inverter noise; one that fades with the speed is the fan, the bearings or the load. A mechanic's stethoscope (or a long screwdriver held to the ear, well clear of moving parts) locates a bearing.

> [!warn] Wear hearing protection near loud machines, and keep hands, hair and tools away from shafts and fans when listening to a running motor.

> [!key] Magnetic and PWM noise stop with the power; mechanical and fan noise fade with speed. Levels add as powers, so find and fix the loudest source first.
`,
  ideas: [
    'Magnetic noise is tonal (twice line frequency and slot harmonics); a VFD adds a whine at its switching frequency.',
    'Mechanical and fan noise continue while the motor coasts; magnetic and PWM noise stop when the power is cut.',
    'Decibels add as powers: two equal sources +3 dB, and quieting a minor source changes almost nothing.',
    'Fan noise grows about 50·log₁₀ of the speed ratio: 2-pole motors and over-speeding are loud.',
    'A-weighting discounts low frequencies: a 100 Hz hum reads low in dB(A) but still carries through structures.'
  ],
  pitfalls: [
    'Two 70 dB(A) motors together make 140 dB(A) — Decibels are logarithmic: equal sources add 3 dB, so the pair makes 73 dB(A).',
    'A higher switching frequency is always better — It moves the whine out of hearing but raises the drive\'s switching losses (it must be derated) and the stress from fast edges on long cables.',
    'A noisy motor is a faulty motor — A 2-pole motor\'s fan or a VFD at a 2–4 kHz carrier can be loud and healthy. A *change* in sound is the warning.'
  ],
  formulas: [
    {
      name: 'Adding two noise sources',
      expr: 'L = 10*log(10^(L1/10) + 10^(L2/10))', tex: 'L = 10\\log_{10}\\left(10^{L_1/10} + 10^{L_2/10}\\right)',
      vars: {
        L: { name: 'combined level', q: 'soundlevel', unit: 'dB' },
        L1: { name: 'level of source 1', q: 'soundlevel', unit: 'dB', value: 65, tex: 'L_1' },
        L2: { name: 'level of source 2', q: 'soundlevel', unit: 'dB', value: 62, tex: 'L_2' }
      },
      note: 'Works the same for dB(A) values measured at the same point, and for sound power levels.',
      stories: { L: 'A motor gives {L1} and the pump it drives {L2} at the same point. What is the total?', L2: 'With the pump running the level is {L}; the motor alone gives {L1}. How loud is the pump alone?' }
    },
    {
      name: 'Distance in a free field',
      expr: 'L2 = L1 - 20*log(r2/r1)', tex: 'L_2 = L_1 - 20\\log_{10}\\dfrac{r_2}{r_1}',
      vars: {
        L2: { name: 'level at the far point', q: 'soundlevel', unit: 'dB', tex: 'L_2' },
        L1: { name: 'level at the near point', q: 'soundlevel', unit: 'dB', value: 70, tex: 'L_1' },
        r1: { name: 'near distance', q: 'length', unit: 'm', value: 1, tex: 'r_1' },
        r2: { name: 'far distance', q: 'length', unit: 'm', value: 4, tex: 'r_2' }
      },
      note: 'Outdoors or in a large absorbing room. Indoors the reverberant sound stops the fall a few metres away.',
      stories: { L2: 'A motor measures {L1} at {r1}. What will it be at {r2}?', r2: 'A motor measures {L1} at {r1}. How far away must you be for {L2}?' }
    },
    {
      name: 'Fan noise and speed',
      expr: 'L2 = L1 + 50*log(n2/n1)', tex: 'L_2 = L_1 + 50\\log_{10}\\dfrac{n_2}{n_1}',
      vars: {
        L2: { name: 'fan noise at the new speed', q: 'soundlevel', unit: 'dB', tex: 'L_2' },
        L1: { name: 'fan noise at the original speed', q: 'soundlevel', unit: 'dB', value: 62, tex: 'L_1' },
        n1: { name: 'original speed', q: 'angvel', unit: 'rpm', value: 1500, tex: 'n_1' },
        n2: { name: 'new speed', q: 'angvel', unit: 'rpm', value: 3000, tex: 'n_2' }
      },
      note: 'A rule of thumb for the same fan (exponents of 50–60 are quoted); it applies to the fan part of the noise only.',
      stories: { L2: 'A motor\'s fan gives {L1} at {n1}. What will it give at {n2} on a VFD?', n2: 'A fan gives {L1} at {n1}. At what speed will it reach {L2}?' }
    },
    {
      name: 'Sound pressure from sound power (machine on a floor)',
      expr: 'Lp = Lw - 10*log(2*pi*r^2/r0^2)', tex: 'L_p = L_W - 10\\log_{10}\\dfrac{2\\pi r^2}{r_0^2}',
      vars: {
        Lp: { name: 'sound pressure level at distance r', q: 'soundlevel', unit: 'dB', tex: 'L_p' },
        Lw: { name: 'sound power level of the machine', q: 'soundlevel', unit: 'dB', value: 75, tex: 'L_W' },
        r: { name: 'distance', q: 'length', unit: 'm', value: 1 },
        r0: { name: 'reference distance', q: 'length', unit: 'm', value: 1, fixed: true, tex: 'r_0' }
      },
      note: 'Sound spreading over a hemisphere above a hard floor, far from walls, and a distance larger than the machine.',
      stories: { Lp: 'A motor has a sound power level of {Lw}. What sound pressure level do you expect at {r}?', Lw: 'A meter reads {Lp} at {r} from a motor on the floor. What is its sound power level?' }
    }
  ],
  examples: [
    {
      title: 'A motor and its pump',
      q: 'At 1 m a motor alone reads 65 dB(A); with the pump running the reading is 66.8 dB(A). How loud is the pump alone, and what would quietening the motor by 10 dB achieve?',
      steps: [
        'Pump alone: $10\\log_{10}(10^{6.68} - 10^{6.5}) = 10\\log_{10}(4.786 - 3.162)\\times10^{6} = 62.1$ dB(A).',
        'Motor quietened to 55 dB(A): $10\\log_{10}(10^{5.5} + 10^{6.21}) = 62.9$ dB(A).',
        'A 10 dB improvement on the motor lowers the total by only 3.9 dB, because the pump now dominates.'
      ],
      a: 'The pump makes about 62 dB(A); silencing the motor alone takes the total down only to about 63 dB(A).'
    },
    {
      title: 'Running a motor faster on a VFD',
      q: 'A 4-pole motor\'s fan contributes 62 dB(A) at 1500 rpm. What does it contribute at 60 Hz (1800 rpm) and at 100 Hz (3000 rpm)?',
      steps: [
        '60 Hz: $62 + 50\\log_{10}(1800/1500) = 62 + 4.0 = 66$ dB(A).',
        '100 Hz: $62 + 50\\log_{10}2 = 62 + 15.1 = 77$ dB(A).'
      ],
      a: 'About 66 dB(A) at 60 Hz and 77 dB(A) at 100 Hz: over-speeding is loud.'
    },
    {
      title: 'From a catalogue\'s sound power to the operator\'s ear',
      q: 'A motor on a factory floor has a sound power level of 80 dB(A). Estimate the sound pressure level 5 m away, ignoring reflections from walls.',
      steps: [
        '$L_p = L_W - 10\\log_{10}(2\\pi r^2) = 80 - 10\\log_{10}(157) = 80 - 22.0 = 58$ dB(A).'
      ],
      a: 'About 58 dB(A) — more in a reverberant hall.'
    }
  ],
  quiz: [
    { q: 'Two identical motors each read 70 dB(A) at a point. Both together read…', choices: ['73 dB(A)', '140 dB(A)', '76 dB(A)', '70 dB(A)'], a: 0, why: 'Double the sound power: 10 log₁₀ 2 = 3 dB more.' },
    { q: 'A motor hums at 100 Hz; the hum stops the instant the power is switched off, while the rotor is still turning. The hum is…', choices: ['magnetic', 'from the bearings', 'from the fan', 'from unbalance'], a: 0, why: 'Magnetic forces exist only while current flows; mechanical and fan noise fade with the speed during coast-down.' },
    { q: 'An operator complains of a whistle from a motor on a VFD with a 4 kHz carrier. What is the usual fix, and its price?', choices: ['Raise the carrier to 8–16 kHz and derate the drive for its higher switching losses', 'Lower the motor voltage', 'Change to a 2-pole motor', 'Add a braking resistor'], a: 0, why: 'The whine is at the carrier frequency; above about 16 kHz few people hear it, but the transistors switch more often and run hotter.' },
    { q: 'Moving from 2 m to 8 m away from a motor outdoors lowers the level by about…', choices: ['12 dB', '6 dB', '4 dB', '24 dB'], a: 0, why: 'Two doublings of distance, 6 dB each.' },
    { q: 'A-weighting makes a 100 Hz hum count as much as a 1 kHz tone of the same sound pressure.', a: false, why: 'It subtracts about 19 dB at 100 Hz, because the ear is much less sensitive to low tones.' }
  ],
  problems: [
    { q: 'A fan gives 64 dB(A) at 1500 rpm. Estimate its level at 1000 rpm.', answer: 55.2, unit: 'dB', tol: 0.02, steps: ['$64 + 50\\log_{10}(1000/1500) = 64 - 8.8 = 55.2$ dB(A).'] },
    { q: 'Three identical machines each give 60 dB(A) at a workstation. What is the total?', answer: 64.8, unit: 'dB', tol: 0.01, steps: ['$10\\log_{10}(3 \\times 10^{6}) = 60 + 10\\log_{10}3 = 64.8$ dB(A).'] }
  ],
  choose: {
    good: [
      'A 4-pole (or 6-pole) motor instead of a 2-pole one where quiet matters: half the fan speed, far less noise.',
      'A PMSM or BLDC motor on sinusoidal (FOC) drive at a high carrier frequency in offices, labs and homes.',
      'Separately driven fans that run only when the motor is hot, for variable-speed duty.'
    ],
    avoid: [
      'Universal motors and 2-pole TEFC motors where people work next to the machine all day.',
      'A 2–4 kHz carrier in quiet places, and running fans far above their base speed.',
      'Bolting a motor rigidly to a thin panel that acts as a loudspeaker.'
    ],
    check: [
      'The sound power level on the datasheet (IEC 60034-9, measured to ISO 1680), at your speed and supply — a VFD adds noise.',
      'The operators\' daily noise exposure against your country\'s limits.',
      'Structural resonances in the speed range, and anti-vibration mounts with flexible connections.',
      'Tonal content: a whine or hum annoys more than its dB(A) figure suggests.'
    ]
  },
  applications: [
    'HVAC fans and pumps in buildings: carrier frequency, speed and mounts chosen to meet noise criteria in occupied rooms.',
    'Route-based condition monitoring: a trained ear or an ultrasonic detector finds dry and damaged bearings early.',
    'Electric vehicles: with no engine to mask it, the whine of the traction motor and inverter becomes the design problem.'
  ],
  sources: [
    'IEC 60034-9, *Rotating electrical machines — Noise limits*.',
    'ISO 1680, *Acoustics — Test code for the measurement of airborne noise emitted by rotating electrical machines*.',
    'IEC 61672-1, *Electroacoustics — Sound level meters — Specifications*: the A-weighting curve.',
    'ISO 3744, *Acoustics — Determination of sound power levels of noise sources using sound pressure — Engineering methods in an essentially free field over a reflecting plane*.',
    'Directive 2003/10/EC on the minimum health and safety requirements regarding the exposure of workers to noise: action values of 80 and 85 dB(A), limit 87 dB(A).'
  ],
  sim: 'rw-noise'
},

{
  id: 'motor-vibration', parent: 'phenomena', title: 'Vibration and its causes', level: 2,
  short: 'Every motor vibrates a little; how much, and at what frequency, tells you what is wrong. Unbalance shakes at once per revolution, misalignment at twice, looseness at many harmonics, electrical faults at twice line frequency — and a resonance can turn a small force into a large vibration. Balance grades and vibration-severity zones say what is acceptable.',
  keywords: ['vibration', 'unbalance', 'imbalance', 'misalignment', 'looseness', 'soft foot', 'resonance', 'natural frequency', 'critical speed', 'balance grade', 'G 2.5', 'G 6.3', 'ISO 21940-11', 'ISO 20816-3', 'ISO 10816-3', 'vibration severity', 'mm/s RMS', 'spectrum', '1x', '2x', 'skip frequency', 'anti-vibration mounts'],
  prereq: ['physics:driven-oscillations', 'physics:centripetal-force', 'couplings-alignment'],
  related: ['bearing-failures', 'maintenance-diagnostics', 'motor-noise', 'vfd-parameters', 'stepper-resonance', 'vibration-motors', 'math:fourier-series', 'ergonomics:whole-body-vibration'],
  body: `
Put a hand on a running motor (carefully, on the frame) and you feel it: a fine trembling. A healthy motor vibrates a millimetre or two per second; a sick one five or ten times that. Vibration is both a cause of damage — it fatigues shafts, loosens bolts and hammers bearings — and the best early warning of it.

### Forces that shake a motor
The commonest is **unbalance**: the centre of mass of the rotor, fan, pulley or coupling is not exactly on the axis. A mass $m$ at radius $r$ spinning at $\\omega$ pulls outwards with

$$F = m\\,r\\,\\omega^2$$

— 10 g at 100 mm is 25 N at 1500 rpm and 99 N at 3000 rpm: the force grows with the **square** of speed. It rotates with the shaft, so it shakes the motor at exactly once per revolution (1×).

The frequency tells the fault (the [[?fourier|spectrum]] of the vibration is the diagnostic):

| Fault | Main frequency | Direction | Notes |
|---|---|---|---|
| Unbalance | 1× speed | radial | steady amplitude and phase; grows with speed² |
| Misalignment of a coupling | 2× and 1× (sometimes 3×) | high axial for angular misalignment | readings on both sides of the coupling out of phase |
| Mechanical looseness, soft foot | many harmonics of 1×, sometimes ½× | often directional | a cracked foot or loose bolt |
| Bent shaft | 1× | axial | like unbalance, but axial |
| Electrical: uneven air gap | 2× line frequency (100 or 120 Hz) | radial | disappears the instant the power is cut |
| Broken rotor bars | 1× with sidebands at slip frequency × poles | radial | a beat in sound and in the current |
| Bearing defects | non-synchronous: BPFO, BPFI, … | radial | see [[bearing-failures]] |
| Belts, gears | belt frequency below 1×; gear mesh = teeth × speed | — | the driven machine, not the motor |

A 2-pole motor at 2990 rpm has 2× at 99.7 Hz — right beside twice line frequency at 100 Hz. Telling them apart needs a fine spectrum, or simply switching off and watching whether the 100 Hz peak vanishes at once.

### Resonance
A motor on its base is a mass on a spring with a natural frequency $f_n = \\frac{1}{2\\pi}\\sqrt{k/m}$. Drive it near that frequency and a small force gives a large vibration, limited only by damping ([[physics:driven-oscillations]]). Well above it the motor moves less than the force would suggest and passes little force to the floor — which is how anti-vibration mounts work. Keep running speeds at least 15–20 % away from structural natural frequencies; on a VFD, program **skip frequencies** to jump over them ([[vfd-parameters]]). A weak baseplate, a long overhung motor or a tall vertical pump motor are the usual culprits.

### What is acceptable
**Balance.** ISO 21940-11 (formerly ISO 1940-1) grades rigid rotors by $G = e\\,\\omega$ in mm/s, where $e$ is the permitted offset of the centre of mass. General machinery and motor rotors are usually balanced to **G 6.3** or **G 2.5**, precision spindles tighter (grinding spindles G 1 or better). At 3000 rpm, G 2.5 allows $e$ = 8 µm — a 20 kg rotor may carry 160 g·mm of unbalance, less than a gram at 100 mm radius on each end.

**Severity.** Vibration is judged by its RMS (root-mean-square) velocity in mm/s over 10–1000 Hz, measured on the bearing housings. ISO 10816-3, revised as ISO 20816-3, gives zones for machines on site; for machines of 15–300 kW its boundaries are:

| Zone | Meaning | Rigid foundation | Flexible foundation |
|---|---|---|---|
| A | typical of new machines | up to 1.4 mm/s | up to 2.3 mm/s |
| B | acceptable for long-term running | 1.4–2.8 mm/s | 2.3–4.5 mm/s |
| C | not for long-term running: plan a repair | 2.8–4.5 mm/s | 4.5–7.1 mm/s |
| D | severe enough to cause damage | above 4.5 mm/s | above 7.1 mm/s |

(Larger machines have somewhat higher boundaries; check the current edition.) New motors are tested on the factory bench to IEC 60034-14, typically to limits of the order of 1.6–2.8 mm/s. **The trend matters more than one reading**: a value that doubles is news even in zone B.

Displacement, velocity and acceleration are linked through the frequency: $v = 2\\pi f x$ and $a = 2\\pi f v$ for each [[?sine-cosine|sine]] component. Low-speed machines are read in µm of displacement, bearings in m/s² (or g) of acceleration, and severity in mm/s of velocity.

In the simulation a motor sits on its mounts with an unbalanced rotor. Raise the speed through the resonance, add misalignment or looseness, and watch the spectrum, the velocity and the ISO zone.

> [!tip] Before blaming the motor: check soft foot (loosen one foot bolt at a time with a dial indicator on the foot; more than about 0.05 mm of movement needs shims), alignment when warm, and the balance of everything fitted to the shaft — pulleys, fans and couplings are often worse than the rotor. Balance motor rotors with the same key convention (half key or full key) as the part fitted to them.

> [!warn] Vibration measurements are taken on running machines: stay clear of shafts and couplings, keep guards in place, and lock out before touching anything that can move.

> [!key] The frequency says what, the amplitude says how bad, the trend says how fast it is getting worse. Unbalance is 1×, misalignment 2×, looseness many harmonics, electrical faults 2× line frequency — and resonance multiplies them all.
`,
  ideas: [
    'Unbalance force F = m r ω² grows with the square of speed and shakes at once per revolution.',
    'Each fault has a signature frequency: 1× unbalance, 2× misalignment, harmonics for looseness, 2× line frequency for electrical faults.',
    'Near a natural frequency a small force causes large vibration; skip frequencies and stiffer or softer mounts move the resonance away.',
    'Balance grades G = e·ω (ISO 21940-11) set the permitted unbalance; severity zones A–D (ISO 20816-3) judge the RMS vibration velocity.',
    'Trends reveal developing faults long before failure.'
  ],
  pitfalls: [
    'Soft rubber mounts always reduce a motor\'s vibration — They reduce the force passed to the floor above their natural frequency; the motor itself may move more, and a speed near the mounts\' natural frequency makes things much worse.',
    'A rotor balanced at the factory stays balanced with anything fitted to it — Pulleys, fans and couplings add their own unbalance, and the key convention used for balancing must match.',
    'High vibration at 100 Hz on a 2-pole motor must be misalignment (2×) — It may be electrical at twice line frequency; switch off and see whether it vanishes instantly.'
  ],
  formulas: [
    {
      name: 'Unbalance force',
      expr: 'F = m*r*w^2', tex: 'F = m\\,r\\,\\omega^2',
      vars: {
        F: { name: 'rotating force', q: 'force', unit: 'N' },
        m: { name: 'unbalance mass', q: 'mass', unit: 'g', value: 10 },
        r: { name: 'radius of the mass', q: 'length', unit: 'mm', value: 100 },
        w: { name: 'speed', q: 'angvel', unit: 'rpm', value: 3000, tex: '\\omega' }
      },
      stories: { F: 'A {m} weight falls off a fan at {r} radius; the fan turns at {w}. What force does the remaining unbalance make?', w: 'At what speed does {m} of unbalance at {r} make a force of {F}?' }
    },
    {
      name: 'Permitted eccentricity from the balance grade',
      expr: 'ecc = G/w', tex: 'e = \\dfrac{G}{\\omega}',
      vars: {
        ecc: { name: 'permitted offset of the centre of mass', q: 'length', unit: 'µm', tex: 'e' },
        G: { name: 'balance grade (e·ω)', q: 'speed', unit: 'mm/s', value: 2.5 },
        w: { name: 'maximum service speed', q: 'angvel', unit: 'rpm', value: 3000, tex: '\\omega' }
      },
      note: 'ISO 21940-11. The permitted residual unbalance is U = m·e for a rotor of mass m (in g·mm with m in kg and e in µm), shared between the correction planes.',
      stories: { ecc: 'A rotor for {w} is to be balanced to G {G}. How far may its centre of mass sit from the axis?' }
    },
    {
      name: 'Velocity from displacement (one sine component)',
      expr: 'v = 2*pi*f*x', tex: 'v = 2\\pi f\\,x',
      vars: {
        v: { name: 'peak vibration velocity', q: 'speed', unit: 'mm/s' },
        f: { name: 'frequency', q: 'frequency', unit: 'Hz', value: 25 },
        x: { name: 'peak displacement', q: 'length', unit: 'µm', value: 25 }
      },
      note: 'Peak values of a sine; the RMS is the peak divided by √2, and peak-to-peak displacement is twice the peak.',
      stories: { v: 'A bearing housing moves {x} (peak) at {f}. What is its peak velocity?', x: 'A velocity of {v} (peak) at {f}: how large is the displacement?' }
    },
    {
      name: 'Natural frequency of a motor on its mounts',
      expr: 'fn = sqrt(k/m)/(2*pi)', tex: 'f_n = \\dfrac{1}{2\\pi}\\sqrt{\\dfrac{k}{m}}',
      vars: {
        fn: { name: 'natural frequency', q: 'frequency', unit: 'Hz', tex: 'f_n' },
        k: { name: 'total stiffness of the mounts', q: 'stiffness', unit: 'N/mm', value: 600 },
        m: { name: 'mass on the mounts', q: 'mass', unit: 'kg', value: 60 }
      },
      note: 'One direction only; a real machine has several modes. Isolation begins above √2 · f_n.',
      stories: { fn: 'A {m} motor sits on mounts with a total stiffness of {k}. What is its natural frequency?', k: 'What total mount stiffness puts a {m} motor\'s natural frequency at {fn}?' }
    }
  ],
  examples: [
    {
      title: 'A lost balance weight',
      q: 'A 10 g balance clip falls off a fan at 250 mm radius. What force does the fan now make at 1500 rpm and at 3000 rpm?',
      steps: [
        '1500 rpm = 157.1 rad/s: $F = 0.010 \\times 0.25 \\times 157.1^2 = 62$ N.',
        '3000 rpm: four times as much, 247 N — about the weight of 25 kg, reversing 50 times a second.'
      ],
      a: 'About 62 N at 1500 rpm and 250 N at 3000 rpm.'
    },
    {
      title: 'How well must a rotor be balanced?',
      q: 'A 20 kg motor rotor runs at up to 3000 rpm and is to be balanced to G 2.5. Find the permitted eccentricity and residual unbalance.',
      steps: [
        '$\\omega = 314.2$ rad/s; $e = G/\\omega = 2.5/314.2$ mm = 0.0080 mm = 8.0 µm.',
        '$U = m\\,e = 20 \\times 8.0 = 160$ g·mm in total, about 80 g·mm per correction plane — 0.8 g at 100 mm radius.'
      ],
      a: 'An offset of 8 µm; about 160 g·mm of residual unbalance, split over two planes.'
    },
    {
      title: 'Which zone is it in?',
      q: 'A 55 kW motor on a rigid base shows 50 µm peak-to-peak at 25 Hz (1500 rpm) and little else. Estimate its RMS velocity and ISO zone.',
      steps: [
        'Peak displacement 25 µm; peak velocity $2\\pi \\times 25 \\times 0.025 = 3.93$ mm/s.',
        'RMS: $3.93/\\sqrt2 = 2.78$ mm/s — at the top of zone B (1.4–2.8 mm/s) for a rigid foundation.'
      ],
      a: 'About 2.8 mm/s RMS: the edge of zone C. Trend it and look for the cause, most likely unbalance.'
    }
  ],
  quiz: [
    { q: 'A fan runs at twice its former speed with the same unbalance. The unbalance force is…', choices: ['four times larger', 'twice as large', 'the same', 'half'], a: 0, why: 'F = m r ω²: doubling ω quadruples the force.' },
    { q: 'A reading shows a large peak at 2× running speed, strongest in the axial direction. The likeliest cause is…', choices: ['angular misalignment of the coupling', 'unbalance', 'a broken rotor bar', 'an outer-race bearing defect'], a: 0, why: 'Misalignment bends the shaft twice per revolution and pushes axially; unbalance is 1× radial.' },
    { q: 'A 100 Hz vibration on a 50 Hz, 4-pole motor vanishes the instant the supply is switched off. It is…', choices: ['electrical, at twice line frequency', 'mechanical looseness', 'unbalance', 'misalignment'], a: 0, why: 'A 4-pole motor turns at about 25 Hz; 100 Hz = 2 × 50 Hz is the magnetic pull, which ends with the current.' },
    { q: 'A VFD-driven fan shakes badly at 38 Hz but is smooth at 30 and 45 Hz. What is the simplest fix?', choices: ['Set a skip frequency band around 38 Hz in the drive', 'Balance the fan to G 1', 'Increase the acceleration ramp', 'Replace the motor with a larger one'], a: 0, why: 'A narrow band of bad speeds points to a resonance; the drive can be told never to dwell there (and the structure can be stiffened).' },
    { q: 'Mounting a motor on soft springs always reduces the vibration measured on the motor itself.', a: false, why: 'Springs isolate the floor above their natural frequency, but the motor then moves more for the same force — and near the natural frequency far more.' }
  ],
  problems: [
    { q: '5 g of unbalance sits at 150 mm radius on a rotor turning at 3000 rpm. What is the rotating force?', answer: 74, unit: 'N', tol: 0.02, steps: ['$\\omega = 314.2$ rad/s.', '$F = 0.005 \\times 0.15 \\times 314.2^2 = 74$ N.'] },
    { q: 'A rotor for 1500 rpm is balanced to G 6.3. What is the permitted eccentricity in µm?', answer: 40.1, unit: 'µm', tol: 0.02, steps: ['$\\omega = 157.1$ rad/s.', '$e = 6.3/157.1 = 0.0401$ mm = 40.1 µm.'] },
    { q: 'A 60 kg motor sits on four mounts of 150 N/mm each. What is its natural frequency on them?', answer: 15.9, unit: 'Hz', tol: 0.02, steps: ['$k = 600$ N/mm $= 6\\times10^5$ N/m.', '$f_n = \\sqrt{6\\times10^5/60}/(2\\pi) = 100/6.283 = 15.9$ Hz.'] }
  ],
  choose: {
    good: [
      'A rigid, flat, heavy base with shims under all feet for motors above about 15 kW — keeps natural frequencies well above running speed.',
      'Anti-vibration mounts under small motors, fans and pumps in buildings, with flexible couplings and hose or duct connections.',
      'Balancing fans, pulleys and couplings together with the rotor, and laser alignment when warm.'
    ],
    avoid: [
      'Running a VFD continuously at a speed where the structure resonates — use skip frequencies or stiffen the frame.',
      'Thin fabricated bases and long overhung motors that put a natural frequency near 1× or 2× speed.',
      'Fitting unbalanced parts to the shaft or mixing half-key and full-key balancing.'
    ],
    check: [
      'The RMS velocity on each bearing, in three directions, against the ISO 20816-3 zones — and its trend.',
      'Soft foot, bolt torque, alignment and belt tension before blaming the motor.',
      'The balance grade specified for rotors and added parts (G 6.3, G 2.5 or better).',
      'Natural frequencies of the base and machine (a bump test) against the whole speed range.'
    ]
  },
  applications: [
    'Route-based vibration monitoring of pumps, fans and compressors in process plants.',
    'Field balancing of fans in one or two planes with a trial weight and a phase reading.',
    'Skip frequencies in VFD-driven cooling towers and fans that pass through structural resonances.'
  ],
  sources: [
    'ISO 21940-11, *Mechanical vibration — Rotor balancing — Procedures and tolerances for rotors with rigid behaviour* (formerly ISO 1940-1): balance quality grades G.',
    'ISO 20816-1 and ISO 20816-3, *Mechanical vibration — Measurement and evaluation of machine vibration* (replacing ISO 10816-1 and -3): zones A–D for industrial machines.',
    'IEC 60034-14, *Rotating electrical machines — Mechanical vibration of certain machines with shaft heights 56 mm and higher — Measurement, evaluation and limits of vibration severity*.',
    'ISO 13373-1, *Condition monitoring and diagnostics of machines — Vibration condition monitoring — General procedures*.'
  ],
  sim: 'rw-vibration'
},

{
  id: 'bearing-failures', parent: 'phenomena', title: 'Bearing failures', level: 2,
  short: 'Bearings are the part of a motor that fails most often — rarely from old age, mostly from poor lubrication, dirt, overload from belts, misalignment, careless fitting and, on inverter drives, electric sparks through the grease. Each cause leaves its own marks, and each defect rings at its own frequency long before the bearing seizes.',
  keywords: ['bearing failure', 'rolling bearing', 'L10 life', 'ISO 281', 'lubrication', 'grease life', 'relubrication', 'contamination', 'brinelling', 'false brinelling', 'fluting', 'electrical erosion', 'bearing currents', 'shaft voltage', 'EDM', 'shaft grounding ring', 'insulated bearing', 'hybrid bearing', 'BPFO', 'BPFI', 'BSF', 'FTF', 'envelope analysis', 'spalling'],
  prereq: ['bearings-motors', 'motor-vibration', 'vfd-wiring-emc'],
  related: ['friction-in-motors', 'maintenance-diagnostics', 'motor-failures', 'couplings-alignment', 'belts-pulleys', 'motor-noise'],
  body: `
Surveys of industrial motors find the bearings behind roughly two failures in five — more than any other part. Yet a well-chosen bearing, correctly fitted and lubricated, would outlast the motor. Most bearings die young, of something that could have been prevented.

### What a motor's bearings do
Most motors run on two deep-groove ball bearings: one *located* (it takes the axial load and fixes the rotor) and one *floating* (it lets the shaft grow as it warms), often with a wave spring for preload. Belt-driven motors may have a cylindrical roller bearing at the drive end for the heavy radial pull — but a roller bearing needs a minimum load, and on a direct coupling it skids and wears. Vertical motors carry the thrust on angular-contact bearings; big motors use oil-lubricated sleeve bearings.

### Rating life — and why it is rarely reached
ISO 281 defines the rating life $L_{10}$: the number of revolutions that 90 % of a large group of identical bearings reach before the first sign of fatigue:

$$L_{10} = \\left(\\frac{C}{P}\\right)^p \\times 10^6 \\text{ revolutions}$$

with $C$ the dynamic load rating, $P$ the equivalent load and $p$ = 3 for ball and 10/3 for roller bearings. A 40 mm bearing with $C$ = 30 kN carrying 2 kN at 1500 rpm lasts $15^3 \\times 10^6/(60 \\times 1500) \\approx 37\\,500$ h. Double the load — an over-tight belt — and the life falls to an eighth. Fatigue is the honourable way to die; most bearings die of other things:

| Failure | Cause | What you find | Prevention |
|---|---|---|---|
| Lubrication failure | grease aged, dried, wrong or too much | discoloured, polished or blued races, hot running, squeal | the right grease, quantity and interval |
| Contamination | dust, water, mixed greases | dents, rust, grey matt tracks, noise | seals and IP rating, clean greasing tools |
| Overload | belt tension, overhung pulleys | spalling in the load zone | correct tension; roller bearing at the drive end |
| Misalignment | coupling or housing out of line | a skewed wear track, cage damage | alignment when warm |
| False brinelling | vibration while standing still (transport, standby motors) | shallow marks at ball spacing | transport locks; turn idle shafts regularly |
| Brinelling | hammer blows when fitting | dents at ball spacing | press or heat-fit on the right ring |
| Electrical erosion | sparks through the grease on inverter drives | frosted grey tracks, then fluting; black grease | see below |

### Grease is the bearing's life
Grease slowly oxidises and bleeds out its oil. A useful rule: **grease life halves for every 15 K or so above about 70 °C** bearing temperature. Small motors use shielded or sealed bearings greased for life (2Z, 2RS); larger ones have grease nipples and a nameplate stating the interval and quantity. Over-greasing churns the grease and heats the bearing; mixing incompatible greases (different soaps or thickeners) can soften them into oil. Grease with the old grease's outlet open.

### Sparks from the drive: bearing currents
An inverter's three output voltages do not add to zero: their sum, the *common-mode voltage*, jumps in steps at every switching edge. Through the motor's internal capacitances it charges the rotor to a few to a few tens of volts. The grease film in a bearing is an insulator a micron or so thick; when it breaks down, a spark jumps — thousands of times a second. Each leaves a microscopic crater; the race turns frosted grey, and after months the rolling elements beat the damage into **fluting**, a washboard of ridges across the race. The motor becomes noisy and fails. Large motors (roughly 100 kW and up) also suffer circulating currents through both bearings.

Remedies, often combined: a symmetrical shielded motor cable with 360° glands and good bonding between motor, drive and machine ([[vfd-wiring-emc]]); a **shaft grounding ring** or brush that gives the charge an easier path; an **insulated** (ceramic-coated) or **hybrid** (ceramic-ball) bearing, usually at the non-drive end; common-mode cores or filters; a lower switching frequency. Insulating one bearing alone can push the current into the other — or into the gearbox or pump bearings of the driven machine.

### Hearing a defect coming
A damaged spot makes a small impact every time a ball passes it, at a rate fixed by the geometry — for $N$ balls of diameter $d$ on a pitch diameter $D$ at shaft frequency $f_r$:

$$f_{\\text{BPFO}} = \\frac{N}{2}f_r\\left(1 - \\frac{d}{D}\\right), \\qquad f_{\\text{BPFI}} = \\frac{N}{2}f_r\\left(1 + \\frac{d}{D}\\right)$$

for outer- and inner-race defects (roughly $0.4\\,N f_r$ and $0.6\\,N f_r$), plus the ball-spin (BSF) and cage (FTF, just under half of $f_r$) frequencies. They are **not whole multiples of the speed** — the fingerprint that separates bearing faults from unbalance and misalignment. The impacts ring the housing at kilohertz; *envelope* analysis demodulates that ringing and shows the repetition rate. A defect goes through stages: ultrasonic emission only; ringing at the bearing's natural frequencies; clear defect frequencies with harmonics and sidebands; finally broadband noise, rising 1× vibration, heat — and seizure. Temperature rises late.

The simulation turns a bearing with a chosen defect: watch the balls hit it, the impacts in the time signal and the lines in the envelope spectrum.

> [!warn] Lock out before bearing work. Bearing heaters and freshly heated bearings burn; pullers store energy and can fly off; grease nipples on running machines only where guarded and designed for it.

> [!key] Bearings rarely wear out — they are killed by poor lubrication, dirt, overload, misalignment, fitting damage and inverter sparks. Each leaves its marks, and each defect announces itself at a non-synchronous frequency long before failure.
`,
  ideas: [
    'L10 = (C/P)^p million revolutions: doubling a ball bearing\'s load cuts its rating life to an eighth.',
    'Most bearings fail early from lubrication, contamination, overload, misalignment, fitting damage or electrical erosion, not fatigue.',
    'Grease life roughly halves for every 15 K above about 70 °C.',
    'Inverter common-mode voltage sparks through the grease film, frosting and then fluting the races; grounding rings, insulated or hybrid bearings and good cabling prevent it.',
    'Bearing defects vibrate at non-synchronous frequencies (BPFO, BPFI, BSF, FTF) found early by envelope analysis.'
  ],
  pitfalls: [
    'A bearing that runs cool is healthy — Temperature rises only in the last stage; vibration (especially envelope) and ultrasound find defects months earlier.',
    'An insulated bearing at one end solves inverter bearing currents — It blocks one path; the current may then flow through the other bearing, or through the coupling into the load\'s bearings. Grounding and cabling matter as much.',
    'A roller bearing is always the stronger, safer choice — Under too little load its rollers skid and smear; on a direct coupling a ball bearing is usually better.'
  ],
  formulas: [
    {
      name: 'Rating life of a rolling bearing',
      expr: 'L = 10^6/n*(C/P)^p', tex: 'L_{10h} = \\dfrac{10^6}{n}\\left(\\dfrac{C}{P}\\right)^{p}',
      vars: {
        L: { name: 'rating life (90 % survive)', q: 'time', unit: 'h', tex: 'L_{10h}' },
        n: { name: 'shaft speed', q: 'frequency', unit: 'rpm', value: 1500 },
        C: { name: 'dynamic load rating', q: 'force', unit: 'kN', value: 30 },
        P: { name: 'equivalent bearing load', q: 'force', unit: 'kN', value: 2 },
        p: { name: 'life exponent (3 ball, 10/3 roller)', value: 3 }
      },
      note: 'ISO 281 basic rating life (the calculator converts rpm to revolutions per second). The modified life adds factors for lubrication and contamination that can multiply or divide it several times.',
      practice: { unknowns: ['L', 'P'] },
      stories: { L: 'A bearing rated {C} carries {P} at {n}. What is its rating life (p = {p})?', P: 'What load may a bearing rated {C} carry at {n} to reach {L} (p = {p})?' }
    },
    {
      name: 'Outer-race defect frequency (BPFO)',
      expr: 'fo = N/2*fr*(1 - d/D)', tex: 'f_{\\text{BPFO}} = \\dfrac{N}{2}\\,f_r\\left(1 - \\dfrac{d}{D}\\right)',
      vars: {
        fo: { name: 'ball pass frequency, outer race', q: 'frequency', unit: 'Hz', tex: 'f_{\\text{BPFO}}' },
        N: { name: 'number of rolling elements', int: true, value: 9 },
        fr: { name: 'shaft rotation frequency', q: 'frequency', unit: 'Hz', value: 25, tex: 'f_r' },
        d: { name: 'ball diameter', q: 'length', unit: 'mm', value: 12.7 },
        D: { name: 'pitch diameter', q: 'length', unit: 'mm', value: 60 }
      },
      note: 'For a deep-groove bearing (contact angle 0). For angular-contact bearings multiply d/D by the cosine of the contact angle.',
      stories: { fo: 'A bearing has {N} balls of {d} on a {D} pitch circle and turns at {fr}. At what frequency does an outer-race defect show?' }
    },
    {
      name: 'Inner-race defect frequency (BPFI)',
      expr: 'fi = N/2*fr*(1 + d/D)', tex: 'f_{\\text{BPFI}} = \\dfrac{N}{2}\\,f_r\\left(1 + \\dfrac{d}{D}\\right)',
      vars: {
        fi: { name: 'ball pass frequency, inner race', q: 'frequency', unit: 'Hz', tex: 'f_{\\text{BPFI}}' },
        N: { name: 'number of rolling elements', int: true, value: 9 },
        fr: { name: 'shaft rotation frequency', q: 'frequency', unit: 'Hz', value: 25, tex: 'f_r' },
        d: { name: 'ball diameter', q: 'length', unit: 'mm', value: 12.7 },
        D: { name: 'pitch diameter', q: 'length', unit: 'mm', value: 60 }
      },
      note: 'An inner-race defect turns with the shaft through the load zone, so its lines carry sidebands at ± the shaft frequency.',
      stories: { fi: 'A bearing has {N} balls of {d} on a {D} pitch circle and turns at {fr}. At what frequency does an inner-race defect show?' }
    },
    {
      name: 'Grease life and temperature',
      expr: 't = t0*2^((T0 - T)/15)', tex: 't = t_0 \\cdot 2^{(T_0 - T)/15}',
      vars: {
        t: { name: 'grease life (relubrication interval)', q: 'time', unit: 'h' },
        t0: { name: 'grease life at the reference temperature', q: 'time', unit: 'h', value: 10000, tex: 't_0' },
        T0: { name: 'reference temperature', q: 'temperature', unit: '°C', value: 70, fixed: true, tex: 'T_0' },
        T: { name: 'bearing (outer ring) temperature', q: 'temperature', unit: '°C', value: 85 }
      },
      note: 'A rule of thumb (halving every 15 K above about 70 °C). Use the grease and bearing maker\'s interval for the real value; below 70 °C the gain levels off.',
      stories: { t: 'A grease lasts {t0} at {T0}. How long will it last at {T}?' }
    }
  ],
  examples: [
    {
      title: 'An over-tight belt',
      q: 'A motor\'s drive-end bearing (C = 32 kN, ball) carries 3 kN from a correctly tensioned belt at 1480 rpm. A fitter over-tightens the belt so the load becomes 4.5 kN. Compare the rating lives.',
      steps: [
        'Correct: $(32/3)^3 = 1214$; $L_{10h} = 1214 \\times 10^6/(60 \\times 1480) = 13\\,700$ h.',
        'Over-tight: $(32/4.5)^3 = 360$; $L_{10h} = 4050$ h.',
        '50 % more load, a third of the life — about half a year of continuous running.'
      ],
      a: 'About 13 700 h against 4050 h: the life falls with the cube of the load.'
    },
    {
      title: 'The defect frequencies of a bearing',
      q: 'A bearing has 9 balls of 12.7 mm on a 60 mm pitch circle and turns at 1500 rpm. Find BPFO, BPFI, the cage frequency FTF = ½ f_r (1 − d/D) and the ball-spin frequency BSF = (D/2d) f_r (1 − (d/D)²).',
      steps: [
        '$f_r = 25$ Hz, $d/D = 0.2117$.',
        'BPFO $= 4.5 \\times 25 \\times 0.788 = 88.7$ Hz; BPFI $= 4.5 \\times 25 \\times 1.212 = 136.3$ Hz.',
        'FTF $= 12.5 \\times 0.788 = 9.9$ Hz; BSF $= 2.362 \\times 25 \\times 0.955 = 56.4$ Hz.',
        'Check with the rule of thumb: $0.4 \\times 9 \\times 25 = 90$ and $0.6 \\times 9 \\times 25 = 135$ Hz.'
      ],
      a: 'BPFO 88.7 Hz (3.55×), BPFI 136.3 Hz (5.45×), FTF 9.9 Hz, BSF 56.4 Hz — none a whole multiple of the speed.'
    },
    {
      title: 'A hotter bearing needs grease sooner',
      q: 'A grease lasts about 10 000 h at 70 °C. After a fan cowl was blocked the bearing runs at 85 °C. How often must it be regreased now?',
      steps: [
        '$t = 10\\,000 \\times 2^{(70-85)/15} = 10\\,000 \\times 2^{-1} = 5000$ h.'
      ],
      a: 'Twice as often — or clear the cowl.'
    }
  ],
  quiz: [
    { q: 'The load on a ball bearing doubles. Its L10 rating life becomes…', choices: ['one eighth', 'half', 'one quarter', 'unchanged'], a: 0, why: 'L10 ∝ (C/P)³ for ball bearings: (1/2)³ = 1/8.' },
    { q: 'A spectrum from a motor turning at 25 Hz shows lines at 88.7, 177.4 and 266 Hz. The likeliest source is…', choices: ['an outer-race bearing defect', 'unbalance', 'misalignment', 'electrical: twice line frequency'], a: 0, why: '88.7 Hz is 3.55 × speed — not a whole multiple — with harmonics: a bearing defect frequency (BPFO).' },
    { q: 'A VFD-driven motor\'s bearing fails after eight months; its race shows a washboard pattern of fine ridges and the grease is black. What caused it?', choices: ['Electrical discharges through the bearing (fluting)', 'Too little grease', 'False brinelling in transport', 'Normal fatigue'], a: 0, why: 'Fluting is the signature of repeated sparks from inverter common-mode voltage. Remedies: grounding ring, insulated or hybrid bearing, proper cabling and bonding.' },
    { q: 'Bearing temperature is the earliest warning of a developing bearing defect.', a: false, why: 'Temperature rises only near the end. Ultrasound and envelope vibration analysis see defects months earlier.' },
    { q: 'Why can a cylindrical roller bearing fail early at the drive end of a directly coupled motor?', choices: ['With too little radial load its rollers skid and smear', 'Roller bearings cannot take radial load', 'Roller bearings need oil, never grease', 'Direct couplings overload them'], a: 0, why: 'Roller bearings need a minimum load to roll properly; belt drives provide it, direct couplings may not.' }
  ],
  problems: [
    { q: 'A ball bearing (C = 20 kN) carries 1 kN at 3000 rpm. What is its L10 rating life in hours?', answer: 44444, unit: 'h', tol: 0.02, steps: ['$(C/P)^3 = 20^3 = 8000$ million revolutions.', '$8000 \\times 10^6/(60 \\times 3000) = 44\\,400$ h.'] },
    { q: 'A bearing has 8 balls with d/D = 0.25 and turns at 1800 rpm. What is its outer-race defect frequency?', answer: 90, unit: 'Hz', tol: 0.01, steps: ['$f_r = 30$ Hz.', 'BPFO $= 4 \\times 30 \\times (1 - 0.25) = 90$ Hz.'] }
  ],
  choose: {
    good: [
      'Sealed-for-life deep-groove ball bearings for small and medium motors on couplings: no greasing, little that can go wrong.',
      'A cylindrical roller bearing at the drive end for heavy belt or pinion loads (with enough load to keep the rollers rolling).',
      'On VFDs: a shaft grounding ring and an insulated or hybrid bearing, with symmetrical shielded cable and good bonding — standard practice on larger motors.'
    ],
    avoid: [
      'Over-tensioned belts and large overhung pulleys on small shafts.',
      'Hammering bearings on or off, or pressing through the rolling elements.',
      'Mixing greases of unknown compatibility, and greasing "by feel" without the nameplate quantity.',
      'Standby motors that never turn: false brinelling from floor vibration.'
    ],
    check: [
      'L10h at the real radial and axial loads, including belt pull.',
      'The relubrication interval, grease type and quantity at the real bearing temperature.',
      'Protection against bearing currents when the motor is on a VFD — especially large motors, long cables and gearboxes on the shaft.',
      'Vibration and ultrasound trends on a route, with the bearing geometry entered to find BPFO and BPFI.'
    ]
  },
  applications: [
    'Condition-monitoring systems that compute each bearing\'s defect frequencies and alarm on their envelope amplitude.',
    'Wind turbines, fans and pumps on VFDs retrofitted with grounding rings after fluting failures.',
    'Storage and transport procedures for spare motors: shaft locks and periodic rotation.'
  ],
  sources: [
    'ISO 281, *Rolling bearings — Dynamic load ratings and rating life*.',
    'ISO 15243, *Rolling bearings — Damage and failures — Terms, characteristics and causes*.',
    'IEC TS 60034-17, *Rotating electrical machines — Cage induction motors when fed from converters — Application guide*: shaft voltages and bearing currents.',
    'Rolling-bearing manufacturers\' general catalogues: rating life, relubrication intervals and defect frequencies.'
  ],
  sim: 'rw-bearing'
},

{
  id: 'motor-failures', parent: 'phenomena', title: 'Why motors fail', level: 2,
  short: 'Bearings and stator windings account for most motor failures. Windings die of heat — overload, blocked cooling, too many starts, a lost phase, an unbalanced or wrong supply — and of moisture, dirt and voltage spikes. The burnt winding tells which, and the right protection stops most of them.',
  keywords: ['motor failure', 'winding failure', 'burnt motor', 'single-phasing', 'phase loss', 'voltage unbalance', 'current unbalance', 'undervoltage', 'overload', 'locked rotor', 'turn-to-turn short', 'insulation breakdown', 'broken rotor bars', 'reflected wave', 'voltage spikes', 'overload relay', 'trip class', 'PTC thermistor', 'root cause'],
  prereq: ['motor-heating', 'motor-protection', 'three-phase-induction'],
  related: ['bearing-failures', 'maintenance-diagnostics', 'insulation-classes', 'vfd-wiring-emc', 'capacitor-sizing', 'brushes-commutator', 'star-delta-connection', 'dol-starting'],
  body: `
Motors are among the most reliable machines made, yet every plant has a pile of burnt ones. Surveys of industrial motors (by the IEEE and by EPRI in the 1980s, and many since) agree on the broad picture:

| Part | Share of failures (surveys of industrial motors) |
|---|---|
| Bearings | about 40–45 % ([[bearing-failures]]) |
| Stator winding | about 25–35 % |
| Rotor | about 8–10 % |
| Other: shaft, coupling, terminal box, external causes | about 10–20 % |

### How a winding dies
Insulation is thin — the enamel on the wire, slot liners, varnish. Something weakens it: heat, moisture, dirt, vibration, voltage spikes. Two neighbouring turns short; the shorted turn carries a huge circulating current and burns a hot spot; the fault spreads to phase-to-phase or phase-to-earth and the protection trips. The winding keeps a record of the cause:

| What the winding looks like | Likely cause |
|---|---|
| All phases evenly darkened | overload, blocked cooling, too many starts, low voltage |
| Two phases burnt (star) or one (delta), the rest fine | single-phasing — one line lost while running |
| One phase more darkened than the others | voltage unbalance |
| Severe, uniform burning, rotor discoloured | locked rotor — the motor never started |
| Short between turns near the line leads | voltage spikes: switching surges or a VFD on a long cable |
| Earth fault at a slot exit | moisture, contamination, coil movement, a surge |

### Single-phasing
A fuse blows or a contactor pole burns. At standstill the motor only hums, draws its locked-rotor current and does not start. Running, it keeps turning — but its two remaining lines carry about $\\sqrt3$ times their former current for the same load, and more as efficiency drops, while the rotor heats from counter-rotating field currents. At full load an overload relay trips; at part load it may not, while the winding and rotor overheat — worst in delta-connected motors. Relays and motor-protective breakers with **phase-loss sensitivity**, and electronic protection relays, trip at once.

### Voltage unbalance
Unequal line voltages drive a counter-rotating (negative-sequence) field, which the rotor meets at almost twice line frequency and low impedance. Current unbalance is typically **6–10 times** the voltage unbalance, and the extra temperature rise is roughly **twice the square** of the percentage voltage unbalance: 3.5 % unbalance, about 25 % more rise. NEMA MG 1 derates motors above 1 % unbalance (to about 75 % at 5 %) and advises against running above 5 %. Causes: unevenly loaded single-phase loads, a high-resistance connection, a failed capacitor step, a long feeder.

### Wrong voltage, wrong frequency
IEC 60034-1 lets a motor deliver its rating within **±5 % of rated voltage** (zone A) and run, warmer, within ±10 % (zone B). Low voltage on a constant-torque load raises the current and the slip, and cuts the starting and breakdown torque by the voltage squared; high voltage raises the magnetising current and iron loss.

### Overloads, stalls and starts
A jammed pump or conveyor stalls the motor: 6–8 times the current, the winding climbing several kelvin per second. Overload relays follow the motor's heating with a thermal model; their **trip class** says how quickly they act at 7.2 times the setting: class 10 within 10 s, class 20 within 20 s (for heavy starting), class 30 within 30 s. Too many starts per hour cook rotors and windings even though each start is short. PTC thermistors in the winding measure the temperature itself — the only protection that also sees blocked cooling and a hot room ([[motor-protection]]).

### Other ways to die
- **Rotor bars** crack after many heavy starts: speed and current pulse with a beat; current signature analysis finds them ([[maintenance-diagnostics]]).
- **Shafts** break in fatigue from belt overtension and overhung loads, usually at a keyway or shoulder.
- **VFD voltage spikes**: on long cables the pulses reflect and can reach about twice the DC bus voltage — over 1 kV from a 400 V drive — stressing the first turns. Use inverter-rated insulation, keep cables short or add dv/dt or sine filters ([[vfd-wiring-emc]]).
- **Single-phase motors** lose their start capacitor or centrifugal switch ([[capacitor-sizing]]); **brushed motors** wear out their brushes ([[brushes-commutator]]); **magnet motors** can be demagnetised by overcurrent when hot.
- **Terminal boxes**: loose connections overheat, gaskets let water in.

In the simulation, run a 7.5 kW motor, then lose a phase, unbalance the supply, lower the voltage, overload or lock the rotor: watch the three line currents, the winding temperature and whether the overload relay trips in time.

> [!warn] Faults are found on live equipment, but repaired only on dead equipment: isolate, lock off and prove dead before opening a terminal box; only qualified electricians work on mains circuits. Never reset a trip repeatedly to "get it going" — find why it tripped.

> [!key] Heat kills windings, and heat has causes: overload, lost phases, unbalanced or wrong voltage, blocked cooling, too many starts. Read the failed winding, fix the cause, and protect with phase-loss-sensitive relays and thermistors.
`,
  ideas: [
    'Bearings (about 40 %) and stator windings (about 30 %) cause most motor failures.',
    'A burnt winding\'s pattern tells the cause: uniform (overload), one or two phases (single-phasing), graded (unbalance), first turns (voltage spikes).',
    'Losing a phase while running raises the remaining line currents about √3 times; at part load an ordinary overload may not trip.',
    'Voltage unbalance of u % raises the temperature rise by about 2u² %, with current unbalance 6–10 times larger.',
    'Overload relays model heating (trip classes 10, 20, 30); thermistors measure it and catch blocked cooling too.'
  ],
  pitfalls: [
    'Low voltage is harmless because the motor draws less power — On a constant-torque load a low voltage raises the current and the slip; the motor runs hotter, and its starting torque falls with the voltage squared.',
    'The overload relay protects against single-phasing — Only if the motor is loaded enough for the raised current to exceed the setting, or if the relay is phase-loss sensitive.',
    'A motor that burnt out just needs rewinding — Without the root cause (a lost phase, unbalance, blocked cooling, a jammed load, spikes) the new winding fails the same way.'
  ],
  formulas: [
    {
      name: 'Voltage unbalance',
      expr: 'u = dV/Va', tex: 'u = \\dfrac{\\Delta V_{\\max}}{V_{\\text{avg}}}',
      vars: {
        u: { name: 'voltage unbalance', q: 'ratio', unit: '%' },
        dV: { name: 'largest deviation of a line voltage from the average', q: 'voltage', unit: 'V', value: 14, tex: '\\Delta V_{\\max}' },
        Va: { name: 'average of the three line voltages', q: 'voltage', unit: 'V', value: 400, tex: 'V_{\\text{avg}}' }
      },
      note: 'The NEMA definition, from three measured line-to-line voltages.',
      stories: { u: 'The line voltages average {Va} and one differs from the average by {dV}. What is the voltage unbalance?' }
    },
    {
      name: 'Extra heating from voltage unbalance',
      expr: 'x = 2*u^2', tex: 'x = 2\\,u^2',
      vars: {
        x: { name: 'increase in temperature rise (%)', q: false, unit: '%' },
        u: { name: 'voltage unbalance (%)', q: false, unit: '%', value: 3.5 }
      },
      note: 'A rule of thumb quoted with NEMA MG 1, with both quantities in per cent: 3.5 % unbalance gives about 25 % more temperature rise.',
      stories: { x: 'A motor runs on a supply with {u} voltage unbalance. By how much does its temperature rise increase?', u: 'What voltage unbalance raises a motor\'s temperature rise by {x}?' }
    },
    {
      name: 'Trip time of a thermal overload (cold start)',
      expr: 't = tau*ln(x^2/(x^2 - k^2))', tex: 't = \\tau\\,\\ln\\dfrac{x^2}{x^2 - k^2}',
      vars: {
        t: { name: 'time to trip', q: 'time', unit: 's' },
        tau: { name: 'thermal time constant of the relay model', q: 'time', unit: 's', value: 310, tex: '\\tau' },
        x: { name: 'current as a multiple of the setting', value: 7.2 },
        k: { name: 'trip threshold (multiple of the setting)', value: 1.15 }
      },
      note: 'A thermal-image model: with τ ≈ 310 s and k = 1.15 it behaves like a class 10 relay (about 8 s at 7.2 × from cold). Real curves are in the relay\'s data (IEC 60947-4-1 trip classes).',
      stories: { t: 'A motor stalls and draws {x} times the relay setting. With a relay model of time constant {tau}, how long before it trips?', x: 'What overcurrent trips a relay (time constant {tau}, threshold {k}) in {t}?' }
    }
  ],
  examples: [
    {
      title: 'Measuring unbalance at a motor',
      q: 'The line voltages at a motor are 404 V, 396 V and 386 V. Find the unbalance and the extra temperature rise. The motor normally rises 80 K.',
      steps: [
        'Average $= (404 + 396 + 386)/3 = 395.3$ V; the largest deviation is $395.3 - 386 = 9.3$ V.',
        '$u = 9.3/395.3 = 2.4$ %.',
        'Extra rise $\\approx 2 \\times 2.4^2 = 11$ %: 80 K becomes about 89 K — nearly 10 K hotter, close to halving the insulation life.'
      ],
      a: '2.4 % unbalance, about 9 K more rise; find the cause (loads, connections) or derate to about 93 %.'
    },
    {
      title: 'A stalled conveyor and a class 10 relay',
      q: 'A conveyor jams and the motor draws 7 times the relay setting from cold. With the thermal-image model (τ = 310 s, k = 1.15), when does the relay trip? And at 1.5 times, running hot (formula $t = \\tau\\ln\\frac{x^2 - 1}{x^2 - k^2}$)?',
      steps: [
        'Stalled, cold: $t = 310\\ln\\frac{49}{49 - 1.32} = 310 \\times 0.0274 = 8.5$ s.',
        '1.5 times, hot: $t = 310\\ln\\frac{2.25 - 1}{2.25 - 1.32} = 310 \\times 0.30 = 93$ s.'
      ],
      a: 'About 8.5 s for the stall; about a minute and a half for a 50 % overload after running warm.'
    },
    {
      title: 'Single-phasing at half load',
      q: 'A 7.5 kW, 400 V star-connected motor (rated 15 A, relay set to 15 A) runs at half load drawing 7.5 A. A fuse blows. What happens?',
      steps: [
        'The remaining two lines carry about $\\sqrt3 \\times 7.5 \\approx 13$ A, and a little more as the efficiency falls: about 14 A.',
        'That is below the 15 A setting: an ordinary thermal relay does not trip.',
        'Meanwhile the counter-rotating field heats the rotor and the two live phases run near full current. A phase-loss-sensitive relay trips within seconds.'
      ],
      a: 'An ordinary relay may never trip; a phase-loss-sensitive one does — fit one.'
    }
  ],
  quiz: [
    { q: 'A motor hums loudly and will not start; one fuse in its supply has blown. This is…', choices: ['single-phasing: one line lost', 'an overload', 'a bearing failure', 'wrong rotation'], a: 0, why: 'With one line gone a three-phase motor gets a pulsating, not rotating, field: no starting torque, locked-rotor current.' },
    { q: 'A supply has 3 % voltage unbalance. Roughly how much more temperature rise does a motor see?', choices: ['About 18 %', 'About 3 %', 'About 6 %', 'About 9 %'], a: 0, why: '2 × 3² = 18 %: the effect grows with the square of the unbalance.' },
    { q: 'A failed star-connected winding shows two phases burnt and one clean. The likeliest cause is…', choices: ['single-phasing while running', 'a general overload', 'moisture', 'a locked rotor'], a: 0, why: 'Losing one line leaves two star phases carrying all the current; the third carries none.' },
    { q: 'A motor on a VFD with 120 m of cable fails with a short between turns near its line leads. What should you suspect?', choices: ['Reflected-wave voltage spikes at the motor terminals', 'Too low a switching frequency', 'Unbalance of the mains', 'A worn bearing'], a: 0, why: 'Fast PWM edges reflect on long cables and can nearly double the voltage; the first turns take the stress. Use inverter-rated insulation or a dv/dt filter.' },
    { q: 'Undervoltage is harmless: it makes a motor draw less current.', a: false, why: 'On a constant-torque load the current rises as the voltage falls (the motor slips more to make the same torque), so the winding runs hotter.' }
  ],
  problems: [
    { q: 'Line voltages of 410, 400 and 390 V. Using the 2u² rule, by what percentage does the temperature rise increase?', answer: 12.5, unit: '%', tol: 0.02, steps: ['Average 400 V; largest deviation 10 V; $u = 2.5$ %.', 'Extra rise $2 \\times 2.5^2 = 12.5$ %.'] },
    { q: 'With the thermal-image model (τ = 310 s, k = 1.15), how long does a relay take to trip at 3 times its setting from cold?', answer: 49.3, unit: 's', tol: 0.02, steps: ['$t = 310\\ln\\frac{9}{9 - 1.3225} = 310\\ln 1.172 = 49$ s.'] }
  ],
  choose: {
    good: [
      'Phase-loss-sensitive overload relays or motor-protective circuit breakers on every three-phase motor.',
      'Electronic motor-protection relays (thermal model, unbalance, phase loss, earth fault, stall) for large or critical motors.',
      'PTC thermistors wired to a trip relay or the drive for VFD-fed, frequently started or hot-ambient motors.',
      'Inverter-rated insulation and dv/dt or sine filters where drive cables are long.'
    ],
    avoid: [
      'Setting the overload above the nameplate current "to stop nuisance trips".',
      'Resetting and restarting after trips without finding the cause.',
      'Running on more than about 1 % voltage unbalance without derating — and on more than 5 % at all.',
      'Rewinding a failed motor without reading the failure pattern.'
    ],
    check: [
      'The nameplate current and service factor against the relay setting and trip class (class 20 or 30 for long, heavy starts).',
      'The three line voltages and currents under load: unbalance and single-phase loads.',
      'The permitted starts per hour for your load inertia.',
      'Cable length and the motor insulation\'s rating for inverter peaks.'
    ]
  },
  applications: [
    'Root-cause analysis in repair shops: the failure pattern, bearing marks and electrical tests decide what to change in the plant.',
    'Electronic protection relays on critical pumps and compressors log the currents before a trip.',
    'Supply-quality checks (unbalance, harmonics, dips) where several motors fail on the same feeder.'
  ],
  sources: [
    'IEEE Motor Reliability Working Group, *Report of large motor reliability survey of industrial and commercial installations*, IEEE Transactions on Industry Applications (1985): failure shares by component.',
    'NEMA MG 1, *Motors and Generators*: operation on unbalanced voltages and the derating factor.',
    'IEC 60034-1, *Rotating electrical machines — Rating and performance*: voltage and frequency variations (zones A and B).',
    'IEC 60947-4-1, *Low-voltage switchgear and controlgear — Contactors and motor-starters*: overload relay trip classes.',
    'IEC TS 60034-17, *Cage induction motors when fed from converters — Application guide*: voltage stress on windings.'
  ],
  sim: 'rw-faults'
},

{
  id: 'maintenance-diagnostics', parent: 'phenomena', title: 'Maintenance and diagnostics', level: 2,
  short: 'Keeping motors running means looking after bearings, cooling and connections, and testing what cannot be seen: insulation resistance and polarisation index, winding resistance balance, the current signature of the rotor, infrared images and vibration. Trends against a baseline find faults months before they stop a machine.',
  keywords: ['maintenance', 'predictive maintenance', 'condition monitoring', 'insulation resistance', 'megger', 'IR test', 'polarisation index', 'PI', 'IEEE 43', 'winding resistance', 'resistance unbalance', 'surge test', 'motor current signature analysis', 'MCSA', 'broken rotor bars', 'thermography', 'infrared', 'vibration analysis', 'ultrasound', 'root cause'],
  prereq: ['motor-failures', 'motor-vibration', 'bearing-failures'],
  related: ['motor-heating', 'motor-noise', 'motor-protection', 'insulation-classes', 'motor-life-cost', 'electronics:multimeter', 'electronics:wheatstone-bridge'],
  body: `
A motor seldom fails without warning. Bearings get louder, windings absorb moisture, connections warm up, rotor bars crack — and each leaves a measurable trace. Maintenance is the art of looking for those traces at the right intervals and acting before the machine stops.

### Four strategies

| Strategy | What it means | Suits |
|---|---|---|
| Run to failure | replace when broken | small, cheap, non-critical motors with a spare on the shelf |
| Preventive (time-based) | grease, clean and check on a calendar | bearings, filters, brushes, belts |
| Predictive (condition-based) | measure, trend and act on a threshold | critical and expensive motors, pumps, fans, compressors |
| Proactive | remove the causes: alignment, balance, clean cooling, good supply | everything that fails repeatedly |

### Routine checks

| Check | How | Typical interval |
|---|---|---|
| Look, listen, smell | walk-round at a safe distance | each shift or weekly |
| Frame and bearing temperature | infrared thermometer, same spot each time | monthly |
| Vibration: overall velocity and bearing envelope | portable collector on a route, or fixed sensors | monthly, or continuous |
| Current in each phase | clamp meter under normal load | quarterly |
| Cooling fins and fan cowl | clean | as the site needs |
| Lubrication | nameplate grease, quantity and interval | per nameplate |
| Connections | infrared image under load; torque check when isolated | yearly |
| Insulation resistance | insulation tester | yearly, after storage or wet periods |

The first readings on a new or rewound motor are the **baseline**; every later reading is judged against it.

### Insulation resistance and polarisation index
An insulation tester applies a DC voltage between the winding and the frame and reads the resistance of the insulation — hundreds or thousands of megohms when healthy. IEEE 43 suggests 500 V DC for windings rated below 1000 V, 500–1000 V up to 2.5 kV and higher values for high-voltage machines. The current falls over the first minutes as the insulation's molecules slowly align (absorption), so the reading *climbs*:

- **IR₁** is the reading after 1 minute. Insulation resistance roughly **halves for every 10 K** of temperature, so readings are corrected to 40 °C before comparing. IEEE 43's recommended minimum at 40 °C is 5 MΩ for random-wound windings and windings rated below 1 kV, 100 MΩ for most form-wound windings built since about 1970.
- The **polarisation index** $\\mathrm{PI} = \\mathrm{IR}_{10}/\\mathrm{IR}_1$ shows whether the absorption is visible or drowned by leakage: about 2 or more is good for class B, F and H insulation; near 1 means moisture or dirt on the surfaces. (When IR₁ is above about 5000 MΩ, the PI means little.)

A low, flat reading usually means a damp or dirty winding: dry it (heaters, warm air, a low-voltage current) and test again. A reading near zero is a direct fault to earth.

### Winding resistance
A low-resistance ohmmeter with four wires (a Kelvin connection) measures U–V, V–W and W–U. They should agree within about 1–2 %; more points to a loose or high-resistance connection, shorted turns or a wrong connection. Correct to 20 °C with the copper formula before comparing with the test sheet. A **surge (impulse) test**, comparing the phases' responses to fast pulses, finds weak turn insulation that neither test sees; high-voltage (hi-pot) tests belong to acceptance testing after a rewind, by specialists.

### Current signature analysis
A current clamp on one phase and a high-resolution spectrum of the current reveal the rotor. Broken rotor bars modulate the current at twice the slip frequency, putting **sidebands at $f(1 \\pm 2s)$** around the supply frequency. Their depth below the supply line grades the rotor: in healthy rotors they are usually more than about 50 dB down; a difference below about 40 dB suggests broken bars (rules of thumb vary with load and design, and the test works best at a steady load above about half of rated). The same measurement shows load-side faults and eccentricity, and it can be taken in the switch room, far from the motor.

### Thermography and vibration
An infrared camera, with the motor under load, finds hot connections (compare phases: a few kelvin warmer deserves a look, more than about 15 K a prompt repair), hot bearings, blocked cooling and uneven frame temperatures. Shiny metal reflects and reads low — measure on a paint or tape spot. Vibration analysis (overall velocity against the ISO zones, spectra for the cause, envelope for bearings — see [[motor-vibration]] and [[bearing-failures]]) and ultrasound for lubrication complete the toolkit.

In the simulation an insulation tester runs a 10-minute test on windings in different conditions: watch how clean, damp, dirty and faulty insulation give different curves and PI values, and how the temperature correction changes the verdict.

> [!warn] An insulation tester puts hundreds or thousands of volts on the winding, and the winding stores the charge: test only isolated, locked-off motors, keep clear during the test, and earth the winding afterwards for several times the test duration. **Disconnect the motor cable from any VFD, soft starter or electronics first** — the test voltage destroys them — and disconnect surge capacitors and thermistor leads.

> [!key] Measure, record, compare with the baseline and act on the trend. Insulation resistance and PI read the insulation, winding resistance the connections and turns, current signature the rotor, infrared the connections and cooling, vibration the mechanics.
`,
  ideas: [
    'Condition-based maintenance trends measurements against a baseline and acts before failure.',
    'Insulation resistance halves for every 10 K; readings are corrected to 40 °C and compared with minimums (5 MΩ for low-voltage random-wound windings).',
    'The polarisation index IR₁₀/IR₁ of about 2 or more shows dry, clean insulation; near 1, moisture or dirt.',
    'Phase-to-phase winding resistances should agree within 1–2 %; a larger spread means bad connections or shorted turns.',
    'Broken rotor bars show as current sidebands at f(1 ± 2s).'
  ],
  pitfalls: [
    'An insulation reading taken at 20 °C can be compared directly with one at 40 °C — Insulation resistance roughly halves every 10 K; correct both to 40 °C first.',
    'A high insulation resistance proves a winding is sound — IR tests the insulation to earth; weak turn-to-turn insulation or a loose connection needs a surge test or a winding-resistance test.',
    'It is fine to megger a motor with the drive still connected — The test voltage can destroy the drive\'s output stage; disconnect the cable at the drive (or the motor) first.'
  ],
  formulas: [
    {
      name: 'Polarisation index',
      expr: 'PI = R10/R1', tex: '\\mathrm{PI} = \\dfrac{\\mathrm{IR}_{10}}{\\mathrm{IR}_{1}}',
      vars: {
        PI: { name: 'polarisation index', tex: '\\mathrm{PI}' },
        R10: { name: 'insulation resistance after 10 min', q: 'resistance', unit: 'MΩ', value: 2400, tex: '\\mathrm{IR}_{10}' },
        R1: { name: 'insulation resistance after 1 min', q: 'resistance', unit: 'MΩ', value: 1000, tex: '\\mathrm{IR}_{1}' }
      },
      note: 'IEEE 43: at least 2 for class B, F and H insulation (1.5 for class A). Not meaningful when IR₁ is above about 5000 MΩ.',
      stories: { PI: 'An insulation test reads {R1} after one minute and {R10} after ten. What is the polarisation index?' }
    },
    {
      name: 'Insulation resistance corrected to 40 °C',
      expr: 'R40 = R*2^((T - T0)/10)', tex: 'R_{40} = R_T \\cdot 2^{(T - T_0)/10}',
      vars: {
        R40: { name: 'insulation resistance at 40 °C', q: 'resistance', unit: 'MΩ', tex: 'R_{40}' },
        R: { name: 'insulation resistance measured', q: 'resistance', unit: 'MΩ', value: 500, tex: 'R_T' },
        T: { name: 'winding temperature at the test', q: 'temperature', unit: '°C', value: 20 },
        T0: { name: 'reference temperature', q: 'temperature', unit: '°C', value: 40, fixed: true, tex: 'T_0' }
      },
      note: 'The rule of thumb that insulation resistance halves every 10 K; IEEE 43 gives the same idea for correcting readings.',
      stories: { R40: 'A winding at {T} reads {R}. What is that at 40 °C?' }
    },
    {
      name: 'Winding resistance unbalance',
      expr: 'u = (Rmax - Rmin)/Ravg', tex: 'u = \\dfrac{R_{\\max} - R_{\\min}}{R_{\\text{avg}}}',
      vars: {
        u: { name: 'resistance unbalance', q: 'ratio', unit: '%' },
        Rmax: { name: 'highest phase-to-phase resistance', q: 'resistance', unit: 'Ω', value: 1.235, tex: 'R_{\\max}' },
        Rmin: { name: 'lowest phase-to-phase resistance', q: 'resistance', unit: 'Ω', value: 1.2, tex: 'R_{\\min}' },
        Ravg: { name: 'average of the three', q: 'resistance', unit: 'Ω', value: 1.215, tex: 'R_{\\text{avg}}' }
      },
      note: 'More than about 1–2 % deserves a look at the connections and the winding.',
      stories: { u: 'Three phase-to-phase readings have a highest of {Rmax}, a lowest of {Rmin} and an average of {Ravg}. What is the unbalance?' }
    },
    {
      name: 'Broken-bar sideband (lower)',
      expr: 'fsb = f*(1 - 2*s)', tex: 'f_{sb} = f\\,(1 - 2s)',
      vars: {
        fsb: { name: 'lower sideband frequency', q: 'frequency', unit: 'Hz', tex: 'f_{sb}' },
        f: { name: 'supply frequency', q: 'frequency', unit: 'Hz', value: 50 },
        s: { name: 'slip', q: 'ratio', unit: '%', value: 3 }
      },
      note: 'The upper sideband is at f(1 + 2s). The pair is 2sf either side of the supply line.',
      stories: { fsb: 'A 50 Hz motor runs at {s} slip. Where does the lower broken-bar sideband appear?', s: 'A current spectrum shows a sideband at {fsb} below a {f} supply. What is the slip?' }
    }
  ],
  examples: [
    {
      title: 'A routine insulation test',
      q: 'A 400 V motor is tested at 500 V DC with the winding at 25 °C: IR₁ = 800 MΩ, IR₁₀ = 1900 MΩ. Judge it.',
      steps: [
        '$\\mathrm{PI} = 1900/800 = 2.4$ — above 2: dry, clean insulation.',
        'At 40 °C: $800 \\times 2^{(25-40)/10} = 800 \\times 0.354 = 283$ MΩ — far above the 5 MΩ minimum.',
        'Record both values as this year\'s point on the trend.'
      ],
      a: 'Healthy: PI 2.4, about 280 MΩ at 40 °C.'
    },
    {
      title: 'A motor after a flood',
      q: 'A pump motor that stood in damp air reads IR₁ = 12 MΩ and IR₁₀ = 13 MΩ at 15 °C. What do you do?',
      steps: [
        '$\\mathrm{PI} = 13/12 = 1.08$: leakage swamps the absorption — moisture or dirt.',
        'At 40 °C: $12 \\times 2^{-2.5} = 2.1$ MΩ — below the 5 MΩ minimum.',
        'Do not energise. Dry it (anti-condensation heater, warm air, or a low-voltage current), clean if dirty, and test again until the values and PI recover.'
      ],
      a: 'Not fit to run: dry and retest.'
    },
    {
      title: 'Where to look for broken bars',
      q: 'A 4-pole, 50 Hz motor runs at 1455 rpm. Where are the broken-bar sidebands, and what if they are 44 dB below the supply line?',
      steps: [
        'Slip $s = (1500 - 1455)/1500 = 3$ %.',
        'Sidebands at $50(1 \\pm 0.06)$ = 47 Hz and 53 Hz.',
        '44 dB down is between the healthy (more than about 50 dB) and the broken-bar (below about 40 dB) rules of thumb: repeat at a steady load and trend it.'
      ],
      a: '47 and 53 Hz; at 44 dB, suspicious — watch the trend.'
    }
  ],
  quiz: [
    { q: 'What DC test voltage does IEEE 43 suggest for the insulation test of a 400 V motor?', choices: ['500 V', '5000 V', '50 V', '400 V AC'], a: 0, why: 'For windings rated below 1000 V the guideline is 500 V DC.' },
    { q: 'An insulation test gives a polarisation index of 1.1. This suggests…', choices: ['moisture or contamination: surface leakage swamps the absorption current', 'excellent, very dry insulation', 'a shorted turn', 'a loose connection'], a: 0, why: 'With a leakage path the reading hardly rises with time; clean, dry insulation shows a climbing reading and a PI of 2 or more.' },
    { q: 'Before an insulation test on a motor fed by a VFD you must…', choices: ['disconnect the motor cable from the drive (and isolate and lock off)', 'set the drive to 0 Hz', 'short the drive\'s DC bus', 'nothing — drives are protected'], a: 0, why: 'The test voltage appears on the drive\'s output transistors and filters and can destroy them.' },
    { q: 'A 4-pole, 50 Hz motor runs at 1470 rpm (2 % slip). Broken-bar sidebands lie at…', choices: ['48 and 52 Hz', '49 and 51 Hz', '25 and 75 Hz', '100 Hz'], a: 0, why: 'f(1 ± 2s) = 50 × (1 ± 0.04) = 48 and 52 Hz.' },
    { q: 'A reading of 400 MΩ at 20 °C and one of 200 MΩ at 30 °C a year later show the insulation has deteriorated.', a: false, why: 'Corrected to 40 °C they are 100 MΩ both times: insulation resistance halves every 10 K.' }
  ],
  problems: [
    { q: 'IR₁ = 650 MΩ and IR₁₀ = 1500 MΩ. What is the polarisation index?', answer: 2.31, tol: 0.01, steps: ['$\\mathrm{PI} = 1500/650 = 2.31$.'] },
    { q: 'A winding at 30 °C reads 300 MΩ. What is the reading corrected to 40 °C?', answer: 150, unit: 'MΩ', tol: 0.01, steps: ['$300 \\times 2^{(30-40)/10} = 150$ MΩ.'] }
  ],
  choose: {
    good: [
      'Condition-based maintenance (vibration, infrared, insulation and current trends) for critical and expensive motors.',
      'Run-to-failure for small, cheap, non-critical motors — with a spare on the shelf.',
      'Permanently installed sensors where access is dangerous or the motor is critical.',
      'Current signature analysis for motors that are hard to reach: it is taken in the switch room.'
    ],
    avoid: [
      'Insulation or hi-pot tests with drives, soft starters or electronics still connected.',
      'Greasing sealed-for-life bearings or greasing on a fixed calendar regardless of temperature and speed.',
      'Judging single readings without a baseline and without temperature correction.'
    ],
    check: [
      'The motor\'s criticality: the cost of an unplanned stop against the cost of monitoring.',
      'Baseline readings when new or rewound: IR, PI, winding resistances, vibration, currents.',
      'Test conditions recorded with every reading: winding temperature, humidity, load.',
      'Who is qualified to test: insulation and high-voltage tests need trained people and safe procedures.'
    ]
  },
  applications: [
    'Water and wastewater pumps: yearly insulation tests catch windings damaged by moisture before they flash over.',
    'Large fans and compressors with online vibration and current monitoring feeding a plant\'s maintenance system.',
    'Acceptance testing after a rewind: winding resistance, insulation resistance, PI and surge comparison.'
  ],
  sources: [
    'IEEE Std 43, *IEEE Recommended Practice for Testing Insulation Resistance of Electric Machinery*: test voltages, temperature correction, minimum values and the polarisation index.',
    'IEEE Std 1415, *IEEE Guide for Induction Machinery Maintenance Testing and Failure Analysis*.',
    'ISO 17359, *Condition monitoring and diagnostics of machines — General guidelines*.',
    'ISO 18434-1, *Condition monitoring and diagnostics of machines — Thermography — General procedures*.',
    'ISO 20816-3, vibration evaluation of industrial machines (see Vibration and its causes).'
  ],
  sim: 'rw-insulation'
},

{
  id: 'linear-motors', parent: 'special-topic', title: 'Linear motors', level: 2,
  short: 'A linear motor is a rotary motor cut open and rolled flat: a coil forcer rides over a magnet track and pushes the load directly, with no screw, belt or gear. It gives high speed, high acceleration, no backlash and no wear — at the price of cost, heat, open magnets and a servo that must supply all the stiffness.',
  keywords: ['linear motor', 'forcer', 'magnet track', 'iron-core linear motor', 'ironless linear motor', 'U-channel', 'tubular linear motor', 'linear induction motor', 'LIM', 'force constant', 'motor constant', 'Km', 'attraction force', 'cogging', 'linear encoder', 'direct drive', 'pick and place', 'maglev'],
  prereq: ['force-on-conductor', 'pmsm-motor', 'rack-pinion-linear'],
  related: ['lead-ball-screws', 'motion-profiles', 'rms-torque-sizing', 'incremental-encoders', 'servo-tuning', 'voice-coil-actuators', 'torque-motors', 'motor-brakes'],
  body: `
Cut the stator of a permanent-magnet synchronous motor along its axis and unroll it; do the same with the magnet ring of its rotor. You get a flat block of three-phase coils — the **forcer** or primary — and a flat row of alternating magnets — the **magnet track** or secondary. Energise the coils in step with their position over the magnets (commutation from Hall sensors or the linear encoder) and the forcer is pushed along with a force proportional to the current:

$$F = K_f\\,I$$

The load is bolted straight to the forcer. There is nothing between them to stretch, wear or rattle.

### Kinds of linear motor

| Type | Construction | Continuous force | Strengths | Weaknesses |
|---|---|---|---|---|
| Iron-core (flat) | coils on laminated iron over one magnet track | about 100 N to several kN (peak 2–3 ×) | highest force per size; heat flows well into the mounting | magnetic attraction of several times the rated force loads the guides; some cogging |
| Ironless (U-channel) | a coil plate running between two rows of magnets | tens to a few hundred N | no cogging, no attraction, a very light forcer: the smoothest motion and fastest acceleration | lower force; heat stays in the resin coil; costly track |
| Tubular | magnets stacked inside a rod, coils around it | tens to hundreds of N | enclosed, easy to seal; can replace a pneumatic cylinder | stroke limited by the rod |
| Linear induction (LIM) | a three-phase primary over an aluminium or steel reaction plate | large, over very long tracks | no magnets; cheap long tracks | low efficiency and power factor, a large air gap |

Typical figures for machine-building: speeds up to 5 m/s and beyond, accelerations of 5–10 g for light loads, positioning to 0.1–1 µm with a good linear encoder, strokes of any length by adding magnet-track segments, and several independent forcers on one track.

### Force, heat and the motor constant
The back-EMF is $K_e v$, and in SI units $K_e$ in V/(m/s) equals $K_f$ in N/A. The heat in the coil is $I^2R$, so for a force $F$

$$P = \\left(\\frac{F}{K_m}\\right)^2$$

where the **motor constant** $K_m = K_f/\\sqrt{R}$ (N/√W) measures how efficiently the motor makes force. Twice the force costs four times the heat. Continuous force is limited by the coil temperature (often 110–130 °C); water cooling raises it considerably. As with rotary servos, the **RMS force** over the cycle must stay below the continuous rating and the peak below the peak rating ([[rms-torque-sizing]]).

### Sizing an axis
The motor must accelerate everything that moves — forcer, carriage, payload, cable chain — and overcome friction, gravity on inclined axes and the process force:

$$F = m\\,a + F_f$$

A symmetrical triangular move of distance $d$ at acceleration $a$ takes $t = 2\\sqrt{d/a}$. A 12 kg carriage accelerated at 20 m/s² (2 g) against 30 N of friction needs 270 N.

### Linear motor or ball screw?

| | Linear motor | Ball screw and servo |
|---|---|---|
| Speed | 5 m/s and more, any stroke | about 1–2 m/s, less on long screws (critical speed) |
| Acceleration | several g | limited by screw inertia |
| Backlash and wear | none | preloaded nut: none at first, wear over time |
| Stiffness | only what the servo loop provides | mechanical, high |
| Vertical axes | falls without power: brake or counterbalance | ball screws back-drive too, but a brake on the motor holds easily |
| Heat | in the forcer, next to the work | in the motor, away from the axis |
| Cost | high (magnet track, linear encoder, cooling) | moderate |

### Practical cautions
Iron-core tracks attract steel chips and tools and pull hard enough to trap fingers; cover them with bellows or strip covers. A vertical axis draws current all the time just to hold its weight — heat, and a fall if power fails, so fit a brake or a pneumatic counterbalance ([[motor-brakes]]). The forcer drags its power and encoder cables along in a cable chain, whose life and mass count. The linear scale must be mounted stiffly and kept at a steady temperature; and with no gear to reduce the load's inertia, the servo sees the full moving mass, so structural resonances set the achievable bandwidth ([[servo-tuning]]).

In the simulation a forcer glides over its magnet track, its coils lit by the commutated phase currents, running repeated moves. Change the mass, acceleration and motor type: watch the force profile, the RMS force against the continuous rating and the heat.

> [!warn] Magnet tracks are always live: they pull steel tools and fingers with great force, and people with pacemakers or implants must keep clear. Lock out before working on an axis, and support vertical axes mechanically — they drop when power or the brake fails.

> [!key] A linear motor turns current directly into straight-line force (F = K_f I), with heat growing as force squared. It wins on speed, acceleration, smoothness and stroke; it asks for a good encoder, cooling, guarding and a stiff servo loop.
`,
  ideas: [
    'A linear motor is a PM synchronous motor unrolled: the forcer\'s coils push directly on a magnet track, F = K_f I.',
    'Iron-core motors give the most force but attract strongly and cog; ironless motors are smooth and light but weaker.',
    'Heat grows with force squared: P = (F/K_m)², so the RMS force sets the continuous rating.',
    'No backlash or wear, very high speed and acceleration — but all stiffness comes from the servo loop and the encoder.',
    'Vertical axes, open magnets, chips, cabling and cost are the practical catches.'
  ],
  pitfalls: [
    'A linear motor is stiffer than a ball screw because there is nothing to deflect — Its stiffness is the servo loop\'s: a sudden process force is resisted only as fast and as hard as the controller and encoder allow.',
    'Doubling the force of a linear motor doubles its heating — Heat is I²R and force is proportional to current, so heat grows four times.',
    'An ironless motor is simply a weaker iron-core one — It trades force for zero cogging, zero attraction and a light forcer: the right choice for smooth scanning and extreme acceleration.'
  ],
  formulas: [
    {
      name: 'Force of a linear motor',
      expr: 'F = Kf*I', tex: 'F = K_f\\,I',
      vars: {
        F: { name: 'force', q: 'force', unit: 'N' },
        Kf: { name: 'force constant', unit: 'N/A', value: 60, tex: 'K_f' },
        I: { name: 'current (RMS phase current, as the datasheet defines it)', q: 'current', unit: 'A', value: 5 }
      },
      stories: { F: 'A forcer with Kf = {Kf} carries {I}. What force does it give?', I: 'What current does a forcer with Kf = {Kf} need for {F}?' }
    },
    {
      name: 'Heat from force: the motor constant',
      expr: 'P = (F/Km)^2', tex: 'P = \\left(\\dfrac{F}{K_m}\\right)^2',
      vars: {
        P: { name: 'coil losses', q: 'power', unit: 'W' },
        F: { name: 'force', q: 'force', unit: 'N', value: 300 },
        Km: { name: 'motor constant', unit: 'N/√W', value: 25, tex: 'K_m' }
      },
      note: 'Km = Kf/√R with the coil resistance at its working temperature (Km falls as the coil warms).',
      stories: { P: 'A linear motor with Km = {Km} pushes {F}. How much heat does its coil make?', F: 'A forcer with Km = {Km} may dissipate {P} continuously. What continuous force can it give?' }
    },
    {
      name: 'Force needed by an axis',
      expr: 'F = m*a + Ff', tex: 'F = m\\,a + F_f',
      vars: {
        F: { name: 'peak force', q: 'force', unit: 'N' },
        m: { name: 'moving mass', q: 'mass', unit: 'kg', value: 12 },
        a: { name: 'acceleration', q: 'accel', unit: 'm/s²', value: 20 },
        Ff: { name: 'friction and process force', q: 'force', unit: 'N', value: 30, tex: 'F_f' }
      },
      note: 'Add m g sin θ for an inclined or vertical axis.',
      stories: { F: 'A {m} carriage accelerates at {a} against {Ff} of friction. What force is needed?', a: 'A motor gives {F} peak to a {m} carriage with {Ff} of friction. What acceleration can it reach?' }
    },
    {
      name: 'Time of a triangular move',
      expr: 't = 2*sqrt(d/a)', tex: 't = 2\\sqrt{\\dfrac{d}{a}}',
      vars: {
        t: { name: 'move time', q: 'time', unit: 's' },
        d: { name: 'move distance', q: 'length', unit: 'mm', value: 500 },
        a: { name: 'acceleration (= deceleration)', q: 'accel', unit: 'm/s²', value: 20 }
      },
      note: 'Accelerate for half the distance, decelerate for the other half; the peak speed is √(a d).',
      stories: { t: 'How long does a {d} move take at {a}, accelerating and decelerating without cruising?', a: 'What acceleration moves {d} in {t}?' }
    }
  ],
  examples: [
    {
      title: 'A pick-and-place axis',
      q: 'A 5 kg head must accelerate at 30 m/s² against 20 N of friction. The motor has Kf = 40 N/A and Km = 15 N/√W. Find the peak force, current and heat while accelerating.',
      steps: [
        '$F = 5 \\times 30 + 20 = 170$ N.',
        '$I = 170/40 = 4.25$ A.',
        '$P = (170/15)^2 = 128$ W — only while accelerating; the RMS over the cycle is what heats the coil.'
      ],
      a: '170 N, 4.25 A and about 130 W during acceleration.'
    },
    {
      title: 'RMS force of a repeated move',
      q: 'A 10 kg carriage moves 300 mm in a triangular profile at 20 m/s² against 30 N of friction, then dwells 0.2 s, and repeats. What RMS force must the motor supply continuously?',
      steps: [
        'Move time $2\\sqrt{0.3/20} = 0.245$ s: 0.1225 s accelerating, 0.1225 s decelerating.',
        'Accelerating: $200 + 30 = 230$ N; decelerating: $200 - 30 = 170$ N (friction helps); dwell: 0.',
        '$F_{rms} = \\sqrt{(230^2 \\times 0.1225 + 170^2 \\times 0.1225)/0.445} = 150$ N.'
      ],
      a: 'About 150 N RMS: choose a motor with a continuous force comfortably above that and a peak above 230 N.'
    }
  ],
  quiz: [
    { q: 'A scanning stage must move at perfectly constant slow speed for optical inspection. Which linear motor suits it best?', choices: ['Ironless (U-channel): no cogging', 'Iron-core: highest force', 'Linear induction motor', 'Any — they are all smooth'], a: 0, why: 'Cogging from iron teeth over magnets ripples the force; an ironless motor has none.' },
    { q: 'The force of a linear motor is doubled. Its coil heating becomes…', choices: ['four times', 'twice', 'the same', 'half'], a: 0, why: 'F ∝ I and P = I²R, so P ∝ F².' },
    { q: 'What happens to a vertical linear-motor axis without a brake when the power fails?', choices: ['It falls', 'It stays put, held by the magnets', 'It moves slowly up', 'It locks mechanically'], a: 0, why: 'A linear motor has no self-locking and no holding force without current; vertical axes need a brake or a counterbalance.' },
    { q: 'Where does a linear motor axis get its stiffness against a sudden side force along the axis?', choices: ['From the servo loop: encoder, gains and current', 'From the magnets\' cogging', 'From the guide rails', 'From the cable chain'], a: 0, why: 'There is no mechanical link to the frame along the axis; only the controller\'s response resists a disturbance.' },
    { q: 'A linear induction motor needs a track of permanent magnets.', a: false, why: 'Its secondary is a conductive (often aluminium on steel) reaction plate in which the travelling field induces currents — cheap over long distances.' }
  ],
  problems: [
    { q: 'A linear motor with Km = 20 N/√W gives 250 N continuously. How much heat does its coil produce?', answer: 156, unit: 'W', tol: 0.02, steps: ['$P = (250/20)^2 = 12.5^2 = 156$ W.'] },
    { q: 'How long does a 400 mm triangular move take at 15 m/s²?', answer: 0.327, unit: 's', tol: 0.02, steps: ['$t = 2\\sqrt{0.4/15} = 2 \\times 0.163 = 0.327$ s.'] }
  ],
  choose: {
    good: [
      'Long strokes at high speed and acceleration: electronics assembly, laser and water-jet cutting, semiconductor handling, packaging.',
      'Ultra-smooth or very precise motion (ironless motors, air bearings): inspection, metrology, lithography.',
      'Several independent carriers on one track: modern transport and conveyor systems.',
      'Clean rooms and places where screws and belts would shed particles or wear.'
    ],
    avoid: [
      'Vertical axes without a brake or counterbalance.',
      'Dirty places with steel chips unless the track is well covered.',
      'Slow, heavily loaded axes that need large force continuously: a screw or rack converts torque to force far more cheaply.',
      'Tight budgets and simple point-to-point moves that a belt or screw would do.'
    ],
    check: [
      'Peak and RMS force over the real cycle, including friction, gravity and process forces.',
      'The attraction force (iron-core) against the guides\' load capacity.',
      'Coil temperature and cooling; heat flowing into the machine and its accuracy.',
      'Encoder resolution and mounting, cable-chain life, covers and the servo bandwidth the structure allows.'
    ]
  },
  applications: [
    'Pick-and-place heads and wafer stages that move at several g with micrometre accuracy.',
    'Laser cutting machines whose gantries accelerate far faster than screw-driven ones.',
    'Linear induction motors in some metro trains, baggage and parcel conveyors and roller-coaster launches; long-stator linear synchronous motors in high-speed maglev trains.'
  ],
  history: 'Linear induction motors were championed from the late 1940s by the British engineer Eric Laithwaite, whose work led to experimental tracked hovercraft in the 1960s–70s. Permanent-magnet linear servo motors spread through machine tools and electronics assembly from the 1990s as rare-earth magnets, fast drives and cheap linear encoders came together.',
  sources: [
    'Boldea and Nasar, *Linear Electric Actuators and Generators* (Cambridge University Press): linear induction, synchronous and PM machines.',
    'Gieras and Piech, *Linear Synchronous Motors: Transportation and Automation Systems* (CRC Press).',
    'Makers\' linear-motor datasheets define the same quantities: continuous and peak force, force constant, back-EMF constant, motor constant, resistance, attraction force and pole pitch.'
  ],
  sim: 'rw-linear'
},

{
  id: 'voice-coil-actuators', parent: 'special-topic', title: 'Voice-coil actuators', level: 2,
  short: 'A voice-coil actuator is a loudspeaker built to position things: a coil in the gap of a permanent magnet feels a force proportional to its current, in either direction, almost the same over the whole stroke. With no commutation, cogging or hysteresis it is the simplest, fastest and most linear electromagnetic actuator — for short strokes.',
  keywords: ['voice coil', 'voice-coil actuator', 'VCA', 'VCM', 'moving coil', 'moving magnet', 'Lorentz force', 'force constant', 'BLI', 'limited-angle actuator', 'hard disk actuator', 'autofocus', 'soft landing', 'force control', 'haptics', 'loudspeaker', 'short stroke'],
  prereq: ['force-on-conductor', 'back-emf', 'physics:lorentz-force'],
  related: ['linear-motors', 'solenoid-actuators', 'vibration-motors', 'piezo-motors', 'servo-tuning', 'pid-control', 'incremental-encoders'],
  body: `
Look inside a loudspeaker: a light coil sits in a narrow ring-shaped gap between the poles of a permanent magnet, where the field points straight across the wire. Current in the coil feels the [[physics:lorentz-force|Lorentz force]], along the axis:

$$F = B\\,L\\,I = K_f\\,I$$

with $B$ the flux density in the gap and $L$ the total length of wire in it. Reverse the current and the force reverses; double it and the force doubles. That is a voice-coil actuator (VCA): a motor with one "phase", no commutation, no teeth to cog on and no iron in the moving part to cause hysteresis — the most linear electromagnetic actuator there is.

### Forms and sizes
- **Moving coil**: the light coil moves, the heavy magnet stays. Lowest moving mass, fastest; but the coil's leads flex every stroke and its heat must leave through air.
- **Moving magnet**: the coil is fixed (no flexing leads, better cooling), the magnet moves (more moving mass).
- **Rotary (limited-angle)**: a flat coil swings between magnets through a few tens of degrees — the actuator that swings the heads of a hard-disk drive and settles on a track in milliseconds.

| Application | Stroke | Force | Notes |
|---|---|---|---|
| Phone camera autofocus module | a fraction of a millimetre | millinewtons | tens of milliamps; springs centre the lens |
| Loudspeaker | a few mm | a few N | driven by audio current |
| Industrial linear VCA | 5–50 mm | 1–200 N continuous, several times that peak | encoder feedback, sub-µm resolution |
| Hard-disk head positioner | a limited angle | — | the fastest precise positioner in mass production |

### Electrical side
The coil has resistance $R$ and inductance $L$, and moving it at speed $v$ generates a back-EMF $K_e v$ (in SI units $K_e$ in V/(m/s) equals $K_f$ in N/A):

$$V = R\\,I + L\\frac{dI}{dt} + K_e\\,v$$

The electrical time constant $L/R$ is typically 0.1–1 ms, so the force follows a command within a millisecond; the supply voltage must cover $RI$ plus the back-EMF at top speed. Heat is $I^2R$ — holding against a spring or gravity costs power continuously, and the motor constant $K_m = K_f/\\sqrt R$ says how much.

### The force–stroke curve
In the middle of the stroke the whole coil sits in the gap and the force per ampere is flat; towards the ends part of the coil leaves the field and it falls, often by 10–20 %. Designers make the coil longer than the gap (overhung, more stroke) or shorter (underhung, more linear, less efficient). Compare the **solenoid**, whose force grows steeply as its gap closes and which can only pull ([[solenoid-actuators]]).

### Moves and control
With the peak force $F$ on a moving mass $m$, the fastest (triangular) move of distance $d$ takes $t = 2\\sqrt{d\\,m/F}$: 5 mm with 0.1 kg and 16 N takes 11 ms. In position mode a linear encoder and a PID loop close the servo; with no backlash or friction in the actuator, the bandwidth can reach hundreds of hertz. In **force mode** the current *is* the force: a pick-and-place head can approach fast, then touch down on a delicate part at a set 0.5 N ("soft landing"); test machines press buttons with a known force. A spring gives a fail-safe position when power is off.

In the simulation a moving-coil actuator steps between positions under PID control. Change the gains, mass, spring and supply voltage; watch the position, the current and the force–stroke curve.

> [!warn] Strong magnets pull steel parts and pinch fingers, and they can affect pacemakers. A VCA driving a load that must not fall needs a spring, brake or counterbalance: without current it has no holding force.

> [!key] F = K_f I in both directions, flat over the stroke: a voice coil is a short-stroke motor with no cogging, no backlash and millisecond response — heated by I²R whenever it pushes.
`,
  ideas: [
    'A coil in a permanent-magnet gap feels F = B L I; reversing the current reverses the force.',
    'No commutation, cogging or hysteresis: the most linear and fastest short-stroke actuator.',
    'The supply must cover R I plus the back-EMF K_e v; the electrical time constant is well under a millisecond to a millisecond.',
    'The force per ampere is flat in mid-stroke and falls near the ends — unlike a solenoid, whose force rises steeply as it closes.',
    'In force mode the current sets the force directly: soft landing, pressing and testing.'
  ],
  pitfalls: [
    'A voice coil holds its position for free when stopped — It has no detent or friction lock: holding against a spring or gravity takes a steady current and makes steady heat.',
    'A voice coil and a solenoid are the same thing — A solenoid pulls an iron plunger, one way, with force rising steeply as the gap closes; a voice coil pushes or pulls a coil with nearly constant force per ampere.',
    'The coil current alone sets the speed — Current sets force; speed comes from force, mass and time, and the back-EMF at speed eats into the supply voltage.'
  ],
  formulas: [
    {
      name: 'Force on the coil',
      expr: 'F = B*L*I', tex: 'F = B\\,L\\,I',
      vars: {
        F: { name: 'force', q: 'force', unit: 'N' },
        B: { name: 'flux density in the gap', q: 'bfield', unit: 'T', value: 0.8 },
        L: { name: 'length of wire in the field', q: 'length', unit: 'm', value: 10 },
        I: { name: 'coil current', q: 'current', unit: 'A', value: 2 }
      },
      note: 'B·L is the force constant K_f in N/A. L is turns × mean turn length of the part of the coil inside the gap.',
      stories: { F: 'A coil with {L} of wire in a {B} gap carries {I}. What force does it make?', I: 'What current gives {F} from a coil with {L} of wire in a {B} gap?' }
    },
    {
      name: 'Voltage needed at speed',
      expr: 'V = R*I + Ke*v', tex: 'V = R\\,I + K_e\\,v',
      vars: {
        V: { name: 'supply voltage needed', q: 'voltage', unit: 'V' },
        R: { name: 'coil resistance (hot)', q: 'resistance', unit: 'Ω', value: 4 },
        I: { name: 'current', q: 'current', unit: 'A', value: 2 },
        Ke: { name: 'back-EMF constant', unit: 'V·s/m', value: 8, tex: 'K_e' },
        v: { name: 'speed', q: 'speed', unit: 'm/s', value: 0.5 }
      },
      note: 'Steady state (the L dI/dt term left out); add margin for the inductive voltage during fast current changes.',
      stories: { V: 'A coil of {R} carrying {I} moves at {v} with Ke = {Ke}. What voltage does the driver need?', v: 'A {V} driver, a coil of {R} at {I} and Ke = {Ke}: what is the top speed?' }
    },
    {
      name: 'Fastest move with a given force',
      expr: 't = 2*sqrt(d*m/F)', tex: 't = 2\\sqrt{\\dfrac{d\\,m}{F}}',
      vars: {
        t: { name: 'move time', q: 'time', unit: 'ms' },
        d: { name: 'move distance', q: 'length', unit: 'mm', value: 5 },
        m: { name: 'moving mass', q: 'mass', unit: 'kg', value: 0.1 },
        F: { name: 'peak force (accelerating and braking)', q: 'force', unit: 'N', value: 16 }
      },
      note: 'Full force to the midpoint, full reverse force to the end, no spring or friction.',
      stories: { t: 'A {m} moving part is driven {d} with {F} of peak force. How quickly can it get there?', F: 'What peak force moves {m} through {d} in {t}?' }
    },
    {
      name: 'Electrical time constant',
      expr: 'tau = Lc/R', tex: '\\tau_e = \\dfrac{L}{R}',
      vars: {
        tau: { name: 'electrical time constant', q: 'time', unit: 'ms', tex: '\\tau_e' },
        Lc: { name: 'coil inductance', q: 'inductance', unit: 'mH', value: 2, tex: 'L' },
        R: { name: 'coil resistance', q: 'resistance', unit: 'Ω', value: 4 }
      },
      note: 'The current (and force) reaches 63 % of its final value in one τ after a voltage step; current-controlled drivers force it faster with extra voltage.',
      stories: { tau: 'A coil of {Lc} and {R}: how quickly does its current respond?' }
    }
  ],
  examples: [
    {
      title: 'Sizing a coil',
      q: 'A coil of 200 turns with a mean diameter of 25 mm sits in a 0.8 T gap. What is its force constant, and what current and heat for 20 N if the coil resistance is 3 Ω?',
      steps: [
        'Wire in the field: $200 \\times \\pi \\times 0.025 = 15.7$ m; $K_f = 0.8 \\times 15.7 = 12.6$ N/A.',
        '$I = 20/12.6 = 1.59$ A; heat $I^2R = 1.59^2 \\times 3 = 7.6$ W.'
      ],
      a: 'K_f ≈ 12.6 N/A; 1.6 A and about 7.6 W for 20 N.'
    },
    {
      title: 'A fast 5 mm move',
      q: 'A moving coil and load of 0.1 kg (K_f = K_e = 8, R = 4 Ω) moves 5 mm with 16 N peak force. Find the time, the peak speed and the voltage needed at peak speed.',
      steps: [
        '$t = 2\\sqrt{0.005 \\times 0.1/16} = 11.2$ ms; acceleration $16/0.1 = 160$ m/s².',
        'Peak speed at mid-stroke: $\\sqrt{a d} = \\sqrt{160 \\times 0.005} = 0.89$ m/s.',
        'Current $16/8 = 2$ A; voltage $4 \\times 2 + 8 \\times 0.89 = 15.2$ V (plus margin for inductance): a 24 V driver does it.'
      ],
      a: '11 ms, 0.89 m/s at mid-stroke, about 15 V.'
    }
  ],
  quiz: [
    { q: 'The current in a voice coil is reversed. The force…', choices: ['reverses, with the same size', 'stays in the same direction', 'falls to zero', 'doubles'], a: 0, why: 'F = B L I: the sign of I sets the direction.' },
    { q: 'Why does a voice-coil actuator have no cogging?', choices: ['There are no iron teeth moving past magnets', 'The coil is superconducting', 'The magnets are very weak', 'It is always driven with a sine wave'], a: 0, why: 'Cogging is the magnets pulling on moving iron teeth; a voice coil moves only copper in a uniform gap.' },
    { q: 'A voice coil holds a 5 N load up against gravity with K_f = 10 N/A and R = 4 Ω. It dissipates…', choices: ['1 W, continuously', 'nothing once it has stopped', '20 W', '0.5 W'], a: 0, why: 'I = 0.5 A; I²R = 0.25 × 4 = 1 W for as long as it holds.' },
    { q: 'A voice coil at high speed cannot reach its commanded force. The likeliest reason is…', choices: ['the back-EMF K_e v leaves too little of the supply voltage to drive the current', 'the coil has left the magnetic field entirely', 'cogging', 'the magnet has saturated'], a: 0, why: 'V = R I + K_e v: at speed the back-EMF grows and limits the current the driver can push.' },
    { q: 'Like a solenoid, a voice coil\'s force rises steeply towards the end of its stroke.', a: false, why: 'Its force per ampere is flat in mid-stroke and falls slightly at the ends; the steep rise is a solenoid\'s property.' }
  ],
  problems: [
    { q: 'A coil has 12 m of wire in a 1.0 T gap and carries 1.5 A. What force does it give?', answer: 18, unit: 'N', tol: 0.01, steps: ['$F = 1.0 \\times 12 \\times 1.5 = 18$ N.'] },
    { q: 'How long does the fastest move of 2 mm take for 50 g with 5 N peak force?', answer: 8.94, unit: 'ms', tol: 0.02, steps: ['$t = 2\\sqrt{0.002 \\times 0.05/5} = 2 \\times 0.00447 = 8.94$ ms.'] }
  ],
  choose: {
    good: [
      'Short, fast, precise strokes (up to a few tens of mm): focusing, fast steering mirrors, pick-and-place Z axes, valve and shaker drives.',
      'Force control: soft landing on delicate parts, pressing and testing with a set force.',
      'Smooth motion with no cogging or backlash and bandwidths of hundreds of hertz.'
    ],
    avoid: [
      'Long strokes: use a linear motor (or a screw) beyond a few tens of millimetres.',
      'Holding large forces for long periods: I²R heat never stops — add a spring, brake or counterbalance.',
      'High forces at low cost where a solenoid\'s on/off motion would do.'
    ],
    check: [
      'Peak and continuous force against the moving mass, stroke, move time and duty (RMS current).',
      'The supply voltage for R I plus the back-EMF at top speed.',
      'The force–stroke curve near the ends of travel, and the side loads the guide must carry.',
      'Lead flexing life (moving coil) and the heat path from the coil.'
    ]
  },
  applications: [
    'Hard-disk drives: a rotary voice coil positions the heads over tracks a fraction of a micrometre wide.',
    'Phone cameras: tiny voice-coil modules move the lens for autofocus and image stabilisation.',
    'Electronics assembly and testing: heads that land on components with a programmed force.'
  ],
  history: 'Oliver Lodge patented a moving-coil loudspeaker in 1898; Chester Rice and Edward Kellogg made it practical in 1925 with a light cone and an electromagnet gap. The same principle, precisely controlled, became the actuator of choice for disk-drive heads and camera lenses.',
  sources: [
    'Fitzgerald, Kingsley and Umans, *Electric Machinery*: electromechanical energy conversion and the force on a current in a field.',
    'Boldea and Nasar, *Linear Electric Actuators and Generators*: voice-coil and other short-stroke linear actuators.',
    'Makers\' voice-coil actuator datasheets: force constant, back-EMF constant, resistance, inductance, stroke and the force–stroke curve.'
  ],
  sim: 'rw-voice-coil'
},

{
  id: 'piezo-motors', parent: 'special-topic', title: 'Piezo and ultrasonic motors', level: 3,
  short: 'Piezoelectric ceramics change length by about a tenth of a per cent in a strong electric field — micrometres, with nanometre resolution and enormous force. Stacked, they position directly; driven as stick-slip, walking or ultrasonic motors they move millimetres to metres by friction, silently, without magnets, and hold their position unpowered.',
  keywords: ['piezo', 'piezoelectric', 'PZT', 'piezo stack', 'multilayer actuator', 'd33', 'blocking force', 'stick-slip', 'inertia drive', 'walking drive', 'ultrasonic motor', 'USM', 'travelling wave', 'standing wave', 'nanopositioning', 'hysteresis', 'creep', 'self-locking', 'MRI compatible'],
  prereq: ['voice-coil-actuators', 'physics:friction', 'physics:driven-oscillations'],
  related: ['linear-motors', 'torque-motors', 'vibration-motors', 'closed-loop-steppers', 'motors-robots-drones', 'electronics:capacitors'],
  body: `
In 1880 Pierre and Jacques Curie found that squeezing certain crystals makes a voltage appear across them; the reverse is equally true — a voltage makes them change shape. Modern actuators use lead zirconate titanate (PZT) ceramics, which stretch by about **0.1–0.15 %** in a field of 1–2 kV/mm. Tiny — but with nanometre resolution, microsecond response and forces of kilonewtons, and no magnetic field at all.

### The stack
A single thick plate would need kilovolts, so actuators stack many thin layers, tens of micrometres each, wired in parallel: 100–150 V then gives the full field. The stroke adds up:

$$\\Delta L = n\\,d_{33}\\,V$$

where $d_{33}$ (large-signal, several hundred pm/V) is the strain per volt of one layer. A 10 mm stack of 160 layers at 100 V moves about 10 µm. Its stiffness is tens to hundreds of N/µm, so it can push against almost anything: blocked, it gives $F_b = k\\,\\Delta L$ — about 1 kN for 100 N/µm and 10 µm. Against a spring load of stiffness $k_L$ the stroke shrinks to $\\Delta L\\,k/(k + k_L)$.

Electrically a stack is a **capacitor** of nanofarads to microfarads. Holding still costs almost nothing; moving fast needs current $I = C\\,dV/dt$ — for a sine of amplitude $V_0$ at frequency $f$, a peak of $2\\pi f C V_0$: 0.3 A for 1 µF, 50 V and 1 kHz, 3 A at 10 kHz. The amplifier, not the ceramic, usually limits the speed. Open-loop a stack shows 10–15 % hysteresis and slow creep, so precise stages close the loop with strain-gauge or capacitive sensors and reach sub-nanometre stability.

### From micrometres to millimetres: piezo motors
To travel further, piezo motors add friction and repetition:

| Type | How it moves | Typical performance | Uses |
|---|---|---|---|
| Inertia (stick-slip) drive | slow extension carries a slider by friction; a fast retraction lets it slip | steps of 10 nm–1 µm, a few mm/s, forces around a newton | microscope positioners, micromanipulators |
| Walking (stepping) drive | legs clamp, push and release in turn | sub-nm resolution, high holding force, slow | precision stages, vacuum |
| Ultrasonic, travelling wave | a ring stator vibrates at 20–100 kHz in a travelling wave; surface points move in ellipses and drive a pressed rotor | high torque at tens to hundreds of rpm without a gearbox | camera autofocus lenses, small robots |
| Ultrasonic, standing wave | a resonant plate drives a tip in an ellipse against a strip | up to hundreds of mm/s | linear stages |

What they share: **self-locking** — the friction contact holds the load with the power off; **no magnets** — usable in MRI scanners and near electron beams; silence above the audible range for ultrasonic types; compactness; and direct drive at low speed. What they cost: a friction contact that wears (lives of thousands of hours are typical), lower efficiency than a good electromagnetic motor, heat in the ceramic at high frequency, special drivers that track the stator's resonance as it drifts with temperature and load, and modest power — watts to tens of watts.

### How an ultrasonic motor pushes
A travelling bending wave of amplitude $A$ (a micrometre or two) runs round the stator ring. Each point on the surface, a height $h$ above the ring's neutral plane, moves up and down *and* back and forth, tracing a small ellipse; at the crests the horizontal motion is opposite to the wave's travel, and that is where the rotor touches. The rotor is dragged backwards against the wave at a surface speed of $h\\,k\\,A\\,\\omega$ ($k = 2\\pi/\\lambda$) — for a 40 kHz wave of 2 µm, about 0.3 m/s, a hundred-odd rpm on a 55 mm rotor.

In the simulation, switch between a stick-slip drive (watch the slider step on each sawtooth, and slip back on the flyback) and a travelling-wave motor (watch the surface points trace ellipses and push the rotor).

> [!warn] Piezo drivers run at 100–1000 V, and a charged stack holds its charge: discharge before handling. Ultrasonic motors run above hearing but not above harm to small animals' hearing or to delicate parts pressed against them; treat the stator as a vibrating tool.

> [!key] Piezo ceramics give micrometres with nanometre resolution and kilonewtons of force; with friction and repetition — stick-slip, walking or ultrasonic waves — they become compact, silent, magnet-free motors that hold position unpowered.
`,
  ideas: [
    'PZT stretches about 0.1 % at full field: a 10 mm multilayer stack gives about 10 µm at 100–150 V.',
    'Stacks are stiff (tens to hundreds of N/µm) and capacitive: holding is free, fast motion needs current C dV/dt.',
    'Hysteresis and creep need closed-loop sensors for accuracy.',
    'Stick-slip, walking and ultrasonic motors turn tiny vibrations into long travel by friction, and hold position unpowered.',
    'No magnets, silence, compactness and direct low-speed torque — at the price of wear, efficiency and special drivers.'
  ],
  pitfalls: [
    'A piezo actuator can move millimetres on its own — A stack gives micrometres; long travel needs a lever, a flexure amplifier or a friction motor built from piezo elements.',
    'A piezo stack consumes power to hold position, like a coil — It is a capacitor: once charged it holds its stroke with almost no current (apart from leakage and control).',
    'Ultrasonic motors never wear out because they have no brushes — Their friction layer between stator and rotor is a wearing part; life is typically thousands of hours.'
  ],
  formulas: [
    {
      name: 'Stroke of a multilayer stack',
      expr: 'dL = n*d*V/1e6', tex: '\\Delta L = n\\,d_{33}\\,V',
      vars: {
        dL: { name: 'free stroke (µm)', q: false, unit: 'µm', tex: '\\Delta L' },
        n: { name: 'number of layers', q: false, int: true, value: 160 },
        d: { name: 'large-signal strain coefficient (pm/V)', q: false, unit: 'pm/V', value: 600, tex: 'd_{33}' },
        V: { name: 'drive voltage (V)', q: false, unit: 'V', value: 100 }
      },
      note: 'In the units shown (pm × V → µm by dividing by 10⁶). Large-signal d₃₃ of soft PZT is several hundred pm/V; small-signal data sheets give less.',
      stories: { dL: 'A stack of {n} layers with d₃₃ = {d} is driven to {V}. What is its free stroke?', V: 'What voltage gives {dL} from {n} layers with d₃₃ = {d}?' }
    },
    {
      name: 'Blocking force',
      expr: 'Fb = k*dL', tex: 'F_b = k\\,\\Delta L',
      vars: {
        Fb: { name: 'blocking force (N)', q: false, unit: 'N', tex: 'F_b' },
        k: { name: 'stack stiffness (N/µm)', q: false, unit: 'N/µm', value: 100 },
        dL: { name: 'free stroke (µm)', q: false, unit: 'µm', value: 9.6, tex: '\\Delta L' }
      },
      note: 'The force when the stack pushes against an infinitely stiff wall; working force and stroke trade along a straight line between F_b and ΔL.',
      stories: { Fb: 'A stack of stiffness {k} has a free stroke of {dL}. What is its blocking force?' }
    },
    {
      name: 'Peak current to drive a stack',
      expr: 'I = 2*pi*f*C*V', tex: 'I = 2\\pi f\\,C\\,V_0',
      vars: {
        I: { name: 'peak current', q: 'current', unit: 'A' },
        f: { name: 'drive frequency', q: 'frequency', unit: 'Hz', value: 1000 },
        C: { name: 'stack capacitance', q: 'capacitance', unit: 'µF', value: 1 },
        V: { name: 'voltage amplitude (half the peak-to-peak swing)', q: 'voltage', unit: 'V', value: 50, tex: 'V_0' }
      },
      note: 'For a sine. The amplifier\'s current rating often sets the usable bandwidth.',
      stories: { I: 'A {C} stack is driven with a {V}-amplitude sine at {f}. What peak current must the amplifier supply?', f: 'An amplifier gives {I} peak into a {C} stack at {V} amplitude. Up to what frequency can it drive a full sine?' }
    },
    {
      name: 'Speed of a stick-slip drive',
      expr: 'v = s*f', tex: 'v = s\\,f',
      vars: {
        v: { name: 'speed', q: 'speed', unit: 'mm/s' },
        s: { name: 'net step per cycle', q: 'length', unit: 'nm', value: 500 },
        f: { name: 'sawtooth frequency', q: 'frequency', unit: 'kHz', value: 2 }
      },
      note: 'The net step is the stack stroke minus the slip back during the fast flyback, and it shrinks under load.',
      stories: { v: 'A stick-slip drive makes {s} steps at {f}. How fast does it travel?', f: 'At what frequency must a drive with {s} steps run to travel at {v}?' }
    }
  ],
  examples: [
    {
      title: 'Stroke, force and a spring',
      q: 'A 10 mm stack has 160 layers with d₃₃ = 600 pm/V and a stiffness of 100 N/µm. At 100 V, find its free stroke and blocking force, and its stroke against a spring of 25 N/µm.',
      steps: [
        '$\\Delta L = 160 \\times 600\\times10^{-12} \\times 100 = 9.6$ µm (a strain of 0.1 %).',
        '$F_b = 100 \\times 9.6 = 960$ N.',
        'Against the spring: $9.6 \\times 100/(100 + 25) = 7.7$ µm.'
      ],
      a: '9.6 µm free, about 960 N blocked, 7.7 µm against the spring.'
    },
    {
      title: 'Why the amplifier limits the speed',
      q: 'A 1 µF stack is driven with a 0–100 V sine (amplitude 50 V). What peak current is needed at 1 kHz and at 10 kHz?',
      steps: [
        '1 kHz: $2\\pi \\times 1000 \\times 10^{-6} \\times 50 = 0.31$ A.',
        '10 kHz: 3.1 A — a large, expensive high-voltage amplifier, and the ceramic heats.'
      ],
      a: '0.31 A at 1 kHz, 3.1 A at 10 kHz.'
    },
    {
      title: 'A stick-slip positioner',
      q: 'A stick-slip drive makes 0.3 µm net steps at 3 kHz. How fast does it move, and how long does a 10 mm move take?',
      steps: [
        '$v = 0.3\\times10^{-6} \\times 3000 = 0.9$ mm/s.',
        '10 mm takes 11 s; for the last nanometres the drive switches to scanning the stack continuously.'
      ],
      a: '0.9 mm/s; about 11 s for 10 mm.'
    }
  ],
  quiz: [
    { q: 'A 20 mm PZT stack at full field (about 0.1 % strain) extends by roughly…', choices: ['20 µm', '2 mm', '0.2 µm', '20 mm'], a: 0, why: '0.1 % of 20 mm = 0.02 mm = 20 µm.' },
    { q: 'Why is a travelling-wave ultrasonic motor almost silent?', choices: ['Its stator vibrates above the range of human hearing', 'It has no moving parts', 'It runs in a vacuum', 'Its magnets are shielded'], a: 0, why: 'The drive frequency is 20–100 kHz; the rotor turns smoothly at a low speed.' },
    { q: 'A piezo motor is switched off with a load pressing on it. It…', choices: ['holds its position, locked by friction', 'drifts back to zero', 'falls freely', 'vibrates'], a: 0, why: 'The preloaded friction contact holds the rotor or slider: piezo motors are self-locking.' },
    { q: 'Why do nanopositioning stages need position sensors?', choices: ['Piezo ceramics have 10–15 % hysteresis and creep open-loop', 'Piezo stacks cannot hold a position', 'The stroke is random', 'The voltage cannot be controlled finely'], a: 0, why: 'The same voltage gives a different position depending on history; a sensor and a loop remove it.' },
    { q: 'Piezo and ultrasonic motors need permanent magnets to work.', a: false, why: 'They work by the piezoelectric effect and friction; having no magnets makes them usable inside MRI scanners.' }
  ],
  problems: [
    { q: 'A stack has 200 layers with d₃₃ = 500 pm/V driven to 120 V. What is its free stroke in µm?', answer: 12, unit: 'µm', tol: 0.01, steps: ['$200 \\times 500\\times10^{-12} \\times 120 = 12\\times10^{-6}$ m = 12 µm.'] },
    { q: 'A stick-slip drive makes 0.2 µm steps at 5 kHz. What is its speed in mm/s?', answer: 1, unit: 'mm/s', tol: 0.01, steps: ['$0.2\\times10^{-6} \\times 5000 = 1\\times10^{-3}$ m/s = 1 mm/s.'] }
  ],
  choose: {
    good: [
      'Nanometre positioning: microscopy, optics alignment, wafer and fibre positioning (stacks with sensors, walking drives).',
      'Compact, silent, direct low-speed drives that hold position unpowered: lens focusing, small robot joints, valves.',
      'Places where magnets are not allowed or cannot work: MRI scanners, electron-beam instruments, vacuum and cryogenic stages.'
    ],
    avoid: [
      'Continuous high-power duty: efficiency is modest and the friction layer wears.',
      'Long, fast strokes with heavy loads — a linear motor or screw is stronger and cheaper.',
      'Oily or dusty friction contacts, which change the grip and the step size.'
    ],
    check: [
      'Travel, working force (not just blocking force) and resolution, open or closed loop.',
      'The driver: voltage, current (C dV/dt) and frequency; resonance tracking for ultrasonic motors.',
      'Life of the friction contact at your duty, and holding force unpowered.',
      'Temperature: heating at high drive frequency, and the ceramic\'s maximum temperature.'
    ]
  },
  applications: [
    'Camera lenses: ring-shaped ultrasonic motors focus quickly and silently.',
    'Scanning-probe and electron microscopes: stick-slip and walking drives for coarse approach, stacks for the final nanometres.',
    'Medical robots working inside MRI scanners, where magnetic motors cannot be used.'
  ],
  history: 'Pierre and Jacques Curie discovered piezoelectricity in 1880; the converse effect was predicted by Gabriel Lippmann in 1881 and confirmed by the Curies. PZT ceramics followed in the 1950s. Toshiiku Sashida built the travelling-wave ultrasonic motor in the early 1980s, and it reached camera autofocus lenses by the end of that decade.',
  sources: [
    'IEEE Std 176, *IEEE Standard on Piezoelectricity*: definitions of the piezoelectric coefficients.',
    'Uchino, *Piezoelectric Actuators and Ultrasonic Motors* (Kluwer): materials, stacks, drive and motor types.',
    'Sashida and Kenjo, *An Introduction to Ultrasonic Motors* (Oxford University Press): the travelling-wave motor.'
  ],
  sim: 'rw-piezo'
},

{
  id: 'torque-motors', parent: 'special-topic', title: 'Torque motors and direct drive', level: 2,
  short: 'A torque motor is a large-diameter, many-pole permanent-magnet motor that drives its load directly, with no gearbox: no backlash, no gear wear, high stiffness and accuracy set by an encoder on the load. The price is a big, costly motor that turns slowly, heats up whenever it holds torque, and needs a very fine encoder.',
  keywords: ['torque motor', 'direct drive', 'DDR', 'frameless motor', 'hollow shaft', 'rotary table', 'indexer', 'backlash', 'torsional stiffness', 'air-gap shear stress', 'torque per rotor volume', 'D squared L', 'motor constant', 'many poles', 'encoder resolution', 'cogging', 'liquid cooling'],
  prereq: ['pmsm-motor', 'gearboxes', 'inertia-matching'],
  related: ['pancake-motors', 'linear-motors', 'ac-servo-motors', 'absolute-encoders', 'servo-tuning', 'motor-brakes', 'motors-machine-tools', 'motors-robots-drones'],
  body: `
Most motors make power by turning fast and are geared down to the load. A **torque motor** does the opposite: it is built to make large torque at low speed and is fixed straight to the load — a **direct drive**. It is a permanent-magnet synchronous motor with a large diameter, a short length, many poles (often 20–60 or more) and a big hole in the middle. It comes *frameless* — a stator ring and a rotor ring that the machine builder mounts in his own bearings and housing — or *housed*, with its own bearing and encoder, ready to bolt on.

### Why diameter wins
The torque of any motor is the shear stress $\\sigma$ its magnetic field can exert across the air gap, times the gap's area $\\pi D L$, times the radius $D/2$:

$$T = \\frac{\\pi}{2}\\,\\sigma\\,D^2 L$$

For naturally cooled servo-class motors $\\sigma$ is roughly 10–25 kPa; liquid cooling allows more. A ring 200 mm across and 50 mm long at 20 kPa gives about 63 N·m. Double the diameter and the torque quadruples for the same length; that is why torque motors are wide and flat. Many poles keep the magnetic path per pole short, so the iron rings can be thin and the centre left open for cables, shafts, optics or beams. The electrical frequency is poles × speed / 120: 44 poles at 300 rpm is already 110 Hz, so maximum speeds are low — tens to a few hundred rpm.

### Direct drive against motor and gearbox

| | Direct-drive torque motor | Servo motor and gearbox |
|---|---|---|
| Backlash | none | a few arcminutes in precision gearboxes, more in standard ones; near zero in strain-wave gears |
| Stiffness | only the servo loop and the structure | the gearbox is a torsional spring: a resonance limits the bandwidth |
| Accuracy | an encoder on the load itself | motor encoder divided by the ratio, plus gear errors |
| Speed range | low | wide (motor speed reduced) |
| Inertia | load inertia seen directly — acceptable because the connection is rigid | reflected inertia divided by ratio² ([[inertia-matching]]) |
| Wear, oil, noise | none | gear wear, lubrication, mesh noise |
| Motor size and cost | large, costly per N·m | small motor, cheap per N·m |
| Holding a static torque | full current, I²R heat | a small current; the gear multiplies it |

Backlash matters at the load's radius: 3 arcminutes at 500 mm is $0.5 \\times 3/60 \\times \\pi/180$ = 0.44 mm of play at the table's edge.

### What a direct drive demands
- **A fine encoder.** No gear multiplies the resolution: a 20-bit absolute encoder (about a million counts) resolves 1.2 arcseconds — 1.5 µm at 250 mm radius. Accuracy then depends on the encoder's mounting and eccentricity.
- **Heat whenever it holds.** Coil losses are $P = (T/K_m)^2$ with the motor constant $K_m$ in N·m/√W. Holding 60 N·m with $K_m$ = 4 costs 225 W, continuously; a geared servo holding the same load might spend a few watts. Heavy static loads get a brake or a counterbalance, and liquid cooling raises the continuous torque substantially.
- **Low torque ripple.** Nothing smooths it: good torque motors use fractional-slot windings and skew to keep cogging to around a per cent of rated torque or less.
- **Stiff bearings and careful assembly** (frameless motors): the machine's bearings must hold the rotor centred in a fraction of a millimetre of air gap against a strong magnetic pull; the magnets snap the rotor into the stator unless fixtures guide it.

In the simulation a heavy rotary table indexes and meets a cutting disturbance, driven once by a direct-drive torque motor and once by a servo and gearbox with backlash and a compliant gear. Compare the position error at the table's edge, the settling and the heat.

> [!warn] Frameless rotors carry strong magnets: they pull steel and pinch fingers, and they must be assembled with the maker's fixtures. A direct-drive axis has no gear friction to hold it: gravity-loaded axes need a brake, and hollow shafts carrying cables must not be turned beyond their cable loops.

> [!key] Torque grows with D²L, so a wide, flat, many-pole motor can drive the load directly: no backlash, high stiffness and accuracy — paid for with motor size and cost, low speed, heat when holding and the need for a fine encoder.
`,
  ideas: [
    'Torque = (π/2) σ D² L: a torque motor is wide and flat to make torque without gears.',
    'Direct drive removes backlash, gear wear and the gearbox\'s elastic resonance; accuracy comes from an encoder on the load.',
    'Many poles keep the rings thin and the centre hollow but limit the speed to tens or hundreds of rpm.',
    'Holding torque costs I²R heat continuously: P = (T/K_m)².',
    'Fine encoders, low ripple, stiff bearings and careful magnet handling are part of the package.'
  ],
  pitfalls: [
    'A torque motor is just a big servo motor — It is designed for torque at low speed, with many poles and a large bore; its maximum speed is far below a servo\'s.',
    'Direct drive needs no attention to inertia — The inertia is seen directly and the servo must accelerate it with motor torque alone; it tolerates high ratios only because nothing elastic sits in between.',
    'Without a gearbox there is nothing to heat — The motor makes all the torque itself, so holding a static load costs full I²R losses.'
  ],
  formulas: [
    {
      name: 'Torque from the air-gap shear stress',
      expr: 'T = (pi/2)*sigma*D^2*L', tex: 'T = \\dfrac{\\pi}{2}\\,\\sigma\\,D^2 L',
      vars: {
        T: { name: 'torque', q: 'torque', unit: 'N·m' },
        sigma: { name: 'air-gap shear stress', q: 'stress', unit: 'kPa', value: 20, tex: '\\sigma' },
        D: { name: 'air-gap (rotor) diameter', q: 'length', unit: 'mm', value: 200 },
        L: { name: 'active (stack) length', q: 'length', unit: 'mm', value: 50 }
      },
      note: 'σ ≈ 10–25 kPa for naturally cooled servo-class motors, more with liquid cooling. The same relation (as torque per rotor volume 2σ) sizes every motor.',
      stories: { T: 'A torque motor has a {D} air gap and a {L} stack at σ = {sigma}. What continuous torque can it give?', L: 'How long a stack gives {T} at {D} diameter and σ = {sigma}?' }
    },
    {
      name: 'Heat from torque: the motor constant',
      expr: 'P = (T/Km)^2', tex: 'P = \\left(\\dfrac{T}{K_m}\\right)^2',
      vars: {
        P: { name: 'winding losses', q: 'power', unit: 'W' },
        T: { name: 'torque', q: 'torque', unit: 'N·m', value: 60 },
        Km: { name: 'motor constant', unit: 'N·m/√W', value: 4, tex: 'K_m' }
      },
      stories: { P: 'A torque motor with Km = {Km} holds {T}. How much heat does it make?', T: 'A torque motor with Km = {Km} may dissipate {P}. What continuous torque is that?' }
    },
    {
      name: 'Play at a radius from backlash',
      expr: 'x = r*theta', tex: 'x = r\\,\\theta',
      vars: {
        x: { name: 'lost motion at the radius', q: 'length', unit: 'mm' },
        r: { name: 'radius', q: 'length', unit: 'mm', value: 500 },
        theta: { name: 'backlash', q: 'angle', unit: '′', value: 3, tex: '\\theta' }
      },
      note: 'θ in radians inside the formula (the calculator converts arcminutes).',
      stories: { x: 'A gearbox has {theta} of backlash. How much play does that give at {r} radius?' }
    },
    {
      name: 'Resolution at a radius',
      expr: 'dx = 2*pi*r/N', tex: '\\Delta x = \\dfrac{2\\pi r}{N}',
      vars: {
        dx: { name: 'smallest step at the radius', q: 'length', unit: 'µm', tex: '\\Delta x' },
        r: { name: 'radius', q: 'length', unit: 'mm', value: 250 },
        N: { name: 'encoder counts per revolution', int: true, value: 1048576 }
      },
      stories: { dx: 'A direct-drive table of {r} radius has an encoder of {N} counts per turn. What is the smallest step at its edge?', N: 'What encoder resolution gives {dx} at {r} radius?' }
    }
  ],
  examples: [
    {
      title: 'Sizing a frameless torque motor',
      q: 'A rotary table needs 100 N·m continuous. With σ = 20 kPa and a 250 mm air gap, how long must the stack be?',
      steps: [
        '$L = T/((\\pi/2)\\sigma D^2) = 100/(1.571 \\times 20\\,000 \\times 0.0625) = 0.051$ m.',
        'A 250 mm ring about 51 mm long — a flat pancake that leaves a large bore free.'
      ],
      a: 'About 51 mm of active length.'
    },
    {
      title: 'Backlash against direct drive',
      q: 'A 1000 mm rotary table is driven either through a gearbox with 3 arcmin of backlash or directly, with a 20-bit encoder. Compare the play and the resolution at its edge.',
      steps: [
        'Gearbox: $x = 0.5 \\times 3/60 \\times \\pi/180 = 0.44$ mm of play at 500 mm radius.',
        'Direct drive: no play; resolution $2\\pi \\times 0.5/1\\,048\\,576 = 3.0$ µm.'
      ],
      a: '0.44 mm of play against 3 µm steps and none.'
    },
    {
      title: 'The cost of holding',
      q: 'An arm needs 60 N·m held for minutes. Direct drive: K_m = 4 N·m/√W. Geared: 50:1, 90 % efficient, onto a servo with K_m = 0.5 N·m/√W. Compare the heat.',
      steps: [
        'Direct: $(60/4)^2 = 225$ W.',
        'Geared: motor torque $60/(50 \\times 0.9) = 1.33$ N·m; heat $(1.33/0.5)^2 = 7.1$ W (a self-locking or braked gear would need none).'
      ],
      a: '225 W against about 7 W: static loads on direct drives need a brake or counterbalance.'
    }
  ],
  quiz: [
    { q: 'A torque motor\'s diameter is doubled at the same stack length and shear stress. Its torque becomes…', choices: ['four times', 'twice', 'eight times', 'the same'], a: 0, why: 'T ∝ D² L.' },
    { q: 'Why do direct-drive rotary tables need finer encoders than geared ones?', choices: ['No gear multiplies the encoder\'s resolution at the load', 'Torque motors run faster', 'The magnets disturb coarse encoders', 'They have backlash'], a: 0, why: 'A geared axis divides the motor encoder\'s step by the ratio; a direct drive sees the encoder step directly at the table.' },
    { q: 'What limits the bandwidth of a servo driving a heavy table through a gearbox, that a direct drive avoids?', choices: ['The torsional compliance of the gearbox and its resonance with the load', 'The encoder resolution', 'The motor\'s back-EMF', 'The drive\'s switching frequency'], a: 0, why: 'The gear is a spring between motor and load: the loop must stay well below the resulting resonance.' },
    { q: 'A direct drive must hold a gravity load for a long time. The best solution is usually…', choices: ['a brake or counterbalance, so the motor need not carry the load continuously', 'a larger current limit', 'a finer encoder', 'a higher switching frequency'], a: 0, why: 'Holding costs (T/K_m)² continuously; a brake holds for free.' },
    { q: 'Torque motors are chosen for high speed.', a: false, why: 'Many poles and large diameters limit them to low speeds; they are chosen for torque, stiffness and accuracy.' }
  ],
  problems: [
    { q: 'A torque motor has a 300 mm air gap, a 40 mm stack and σ = 15 kPa. What torque can it give?', answer: 84.8, unit: 'N·m', tol: 0.02, steps: ['$T = 1.571 \\times 15\\,000 \\times 0.09 \\times 0.04 = 84.8$ N·m.'] },
    { q: 'A torque motor with K_m = 2.5 N·m/√W gives 40 N·m. How much heat does its winding make?', answer: 256, unit: 'W', tol: 0.01, steps: ['$P = (40/2.5)^2 = 16^2 = 256$ W.'] }
  ],
  choose: {
    good: [
      'Rotary tables, indexers and machine-tool rotary axes that need accuracy, stiffness and no backlash.',
      'Smooth, precise low-speed motion: telescopes, antennas, gimbals, printing and converting rolls, wafer handling.',
      'A hollow centre for cables, shafts, beams or optics; clean, quiet, maintenance-free drives.'
    ],
    avoid: [
      'High speeds: a servo and gearbox or belt is smaller and cheaper.',
      'Large static loads held for long periods without a brake or counterbalance.',
      'Tight budgets where a precision gearbox\'s backlash and stiffness are good enough.'
    ],
    check: [
      'Continuous and peak torque at your speed, and the heat (T/K_m)² over the duty cycle; cooling.',
      'Encoder resolution and accuracy on the load, and how it is mounted.',
      'Bearing and structure stiffness (frameless), the air gap tolerance and the assembly method.',
      'Cogging and ripple, and a brake for power-off and emergency stops.'
    ]
  },
  applications: [
    'Machine-tool rotary tables and swivel heads (the 4th and 5th axes of five-axis machines).',
    'Direct-drive washing machines, turntables and wind-turbine generators — the same idea at other scales.',
    'Robot joints and camera gimbals that need smooth, backlash-free motion.'
  ],
  sources: [
    'Hendershot and Miller, *Design of Brushless Permanent-Magnet Machines*: torque per rotor volume, air-gap shear stress and slot–pole choices for low cogging.',
    'Hughes and Drury, *Electric Motors and Drives*: permanent-magnet synchronous motors and servo drives.',
    'Makers\' torque-motor datasheets list the same quantities: continuous and peak torque, motor constant, pole count, maximum speed, cogging and cooling options.'
  ],
  sim: 'rw-direct-drive'
},

{
  id: 'coreless-motors', parent: 'special-topic', title: 'Coreless (ironless) motors', level: 2,
  short: 'In a coreless motor the rotor is a self-supporting cup of copper wire spinning in the air gap, with no iron. That removes cogging and rotor iron losses and makes the rotor extremely light: fast, smooth and efficient small motors. It also removes inductance and thermal mass, so they need fast PWM and burn quickly when overloaded.',
  keywords: ['coreless motor', 'ironless motor', 'bell armature', 'skew-wound winding', 'self-supporting coil', 'slotless', 'low inertia', 'mechanical time constant', 'low inductance', 'PWM ripple', 'precious-metal brushes', 'graphite brushes', 'medical motors', 'no cogging', 'thermal time constant', 'overload'],
  prereq: ['pmdc-motor', 'dc-torque-speed', 'pwm-speed-control'],
  related: ['brushes-commutator', 'bldc-motor', 'dc-gearmotors', 'friction-in-motors', 'motor-heating', 'dc-motor-drivers', 'voice-coil-actuators'],
  body: `
Open an ordinary small DC motor and the rotor is a stack of iron laminations with slots holding the winding. Open a **coreless** motor and the rotor is a thin cup — a *bell* — of copper wire wound at a slant and bonded with resin, fixed to the shaft at one end. It spins in the air gap between a stationary magnet inside it and a steel tube outside it. Brushed coreless motors commutate with precious-metal or graphite brushes; brushless (*slotless*) versions keep an ironless winding still and spin the magnet.

### What removing the iron does

| Property | Iron-core small motor | Coreless motor | Why |
|---|---|---|---|
| Cogging | present, a few per cent | none | no teeth for the magnets to pull on |
| Rotor inertia | tens of g·cm² | a few g·cm² in a 20 mm motor | only copper and resin rotate |
| Mechanical time constant | 10–50 ms | typically 3–10 ms | $\\tau_m = J R/K^2$ with a tiny $J$ |
| Inductance | millihenries | tens to hundreds of µH | no iron in the coil |
| Rotor iron losses | yes | none | efficiency up to about 85–90 % |
| Thermal capacity | large | small: the winding heats in tens of seconds | little mass |
| Robustness | rugged | delicate bell, limited overload | |

The result is a motor that starts and stops almost instantly, turns smoothly at a crawl, runs efficiently from a battery and is very quiet electrically and acoustically. Typical sizes are 6–40 mm in diameter, from a fraction of a watt to a couple of hundred watts.

### Low inductance and PWM
The same missing iron leaves the winding with little inductance, and PWM current ripple is inversely proportional to it:

$$\\Delta I = \\frac{V\\,D\\,(1 - D)}{L\\,f}$$

At 24 V, 50 % duty, 0.1 mH and 20 kHz the ripple is 3 A peak-to-peak — larger than the rated current of many small coreless motors. The ripple adds heat ($R\\,\\Delta I^2/12$ for a triangular ripple) and eats precious-metal brushes. Drive coreless motors at 50–100 kHz or more, add a series choke, or use a driver made for low-inductance motors; check a driver's *minimum load inductance* before connecting one ([[pwm-speed-control]]).

### Heat comes fast
With so little mass, the winding's own thermal time constant is only tens of seconds (the whole motor's minutes). A short overload is fine; a stall is not. Starting cold, a winding with thermal time constant $\\tau_w$ run at $x$ times its rated current reaches its temperature limit after

$$t = \\tau_w \\ln\\frac{x^2}{x^2 - 1}$$

— about 6 s at twice rated current with $\\tau_w$ = 20 s, and about 2 s at three times. Maximum winding temperatures are often 100–125 °C. Current limits in the driver are essential ([[motor-heating]]).

### Brushes
Precious-metal brushes make little friction, noise and interference and last long at low currents in continuous running — but arcing at high current and frequent start–stop destroys them. Graphite (copper–graphite) brushes carry higher currents and survive start–stop and reversing duty, with more friction and wear. The duty decides ([[brushes-commutator]]).

In the simulation an iron-core and a coreless motor of similar size run side by side: compare their start-up, the cogging ripple at low speed, the PWM current ripple at your switching frequency, and how fast each winding heats under an overload.

> [!warn] Small motors run from low voltages but their drivers may not: keep mains-powered supplies to qualified people. A coreless motor stalled at full voltage can burn within seconds — always set a current limit.

> [!key] No iron in the rotor: no cogging, tiny inertia, high efficiency and fast response — but low inductance (use fast PWM or a choke) and little thermal mass (limit the current, avoid stalls).
`,
  ideas: [
    'The rotor is a self-supporting copper cup: no iron teeth, so no cogging and no rotor iron losses.',
    'Rotor inertia is tiny, so mechanical time constants are only a few milliseconds.',
    'Low inductance makes PWM ripple large: use 50–100 kHz, a choke or a suitable driver.',
    'The winding\'s thermal time constant is tens of seconds: short overloads are fine, stalls burn.',
    'Precious-metal brushes suit continuous low-current duty; graphite brushes suit high current and start–stop.'
  ],
  pitfalls: [
    'Any PWM driver will do for a small motor — A coreless winding\'s low inductance turns ordinary 20 kHz PWM into amperes of ripple, extra heat and brush wear.',
    'A small motor can take a stall for a while because the motor body stays cool — The winding has its own short time constant and overheats within seconds while the case is still cool.',
    'Coreless means brushless — Most coreless motors are brushed; "slotless" brushless motors use the same ironless-winding idea with electronic commutation.'
  ],
  formulas: [
    {
      name: 'PWM current ripple',
      expr: 'dI = V*D*(1 - D)/(L*f)', tex: '\\Delta I = \\dfrac{V\\,D\\,(1 - D)}{L\\,f}',
      vars: {
        dI: { name: 'peak-to-peak current ripple', q: 'current', unit: 'A', tex: '\\Delta I' },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 24 },
        D: { name: 'duty cycle', q: 'ratio', unit: '%', value: 50, min: 0, max: 100 },
        L: { name: 'winding (plus choke) inductance', q: 'inductance', unit: 'µH', value: 100 },
        f: { name: 'switching frequency', q: 'frequency', unit: 'kHz', value: 20 }
      },
      note: 'Largest at 50 % duty; the back-EMF is taken as the average voltage D·V.',
      stories: { dI: 'A coreless motor of {L} is driven from {V} at {D} duty and {f}. How large is the current ripple?', f: 'What switching frequency keeps the ripple of a {L} motor at {V}, {D} duty down to {dI}?' }
    },
    {
      name: 'Extra heat from the ripple',
      expr: 'P = R*dI^2/12', tex: 'P = \\dfrac{R\\,\\Delta I^2}{12}',
      vars: {
        P: { name: 'extra copper loss', q: 'power', unit: 'W' },
        R: { name: 'winding resistance', q: 'resistance', unit: 'Ω', value: 2.5 },
        dI: { name: 'peak-to-peak ripple (triangular)', q: 'current', unit: 'A', value: 3, tex: '\\Delta I' }
      },
      note: 'The RMS of a triangular ripple is ΔI/√12; its heat adds to that of the average current.',
      stories: { P: 'A winding of {R} carries a triangular ripple of {dI}. How much extra heat does the ripple make?' }
    },
    {
      name: 'Mechanical time constant',
      expr: 'tau = J*R/K^2', tex: '\\tau_m = \\dfrac{J\\,R}{K^2}',
      vars: {
        tau: { name: 'mechanical time constant', q: 'time', unit: 'ms', tex: '\\tau_m' },
        J: { name: 'rotor inertia', q: 'inertia', unit: 'g·cm²', value: 10 },
        R: { name: 'winding resistance', q: 'resistance', unit: 'Ω', value: 2.5 },
        K: { name: 'motor constant', q: 'kemf', unit: 'V·s/rad', value: 0.025 }
      },
      stories: { tau: 'A rotor of {J} on a motor with R = {R} and K = {K}: what is its mechanical time constant?' }
    },
    {
      name: 'How long an overload may last (from cold)',
      expr: 't = tau*ln(x^2/(x^2 - 1))', tex: 't = \\tau_w \\ln\\dfrac{x^2}{x^2 - 1}',
      vars: {
        t: { name: 'time to reach the winding limit', q: 'time', unit: 's' },
        tau: { name: 'winding thermal time constant', q: 'time', unit: 's', value: 20, tex: '\\tau_w' },
        x: { name: 'current as a multiple of the rated current', value: 2 }
      },
      note: 'A single-body model of the winding, starting at ambient; the rated current is the one that just reaches the limit in steady state.',
      stories: { t: 'A winding with a {tau} thermal time constant carries {x} times its rated current from cold. How long before it reaches its limit?', x: 'What overload can a winding with a {tau} time constant carry for {t} from cold?' }
    }
  ],
  examples: [
    {
      title: 'Choosing the switching frequency',
      q: 'A 24 V coreless motor (R = 2.5 Ω, L = 0.1 mH, rated 1 A) runs at 50 % duty. Compare the ripple and its heat at 20 kHz and at 100 kHz.',
      steps: [
        '20 kHz: $\\Delta I = 24 \\times 0.25/(10^{-4} \\times 2\\times10^4) = 3$ A; extra heat $2.5 \\times 9/12 = 1.9$ W.',
        '100 kHz: $\\Delta I = 0.6$ A; extra heat $2.5 \\times 0.36/12 = 0.075$ W.',
        'The rated copper loss is $1^2 \\times 2.5 = 2.5$ W: at 20 kHz the ripple adds three-quarters as much again.'
      ],
      a: '3 A and 1.9 W at 20 kHz; 0.6 A and 0.08 W at 100 kHz.'
    },
    {
      title: 'How long can it be overloaded?',
      q: 'A coreless winding has a thermal time constant of 20 s. Starting cold, how long can it carry twice and three times its rated current?',
      steps: [
        '$x = 2$: $t = 20\\ln(4/3) = 5.8$ s.',
        '$x = 3$: $t = 20\\ln(9/8) = 2.4$ s.'
      ],
      a: 'About 6 s and 2.4 s: set the driver\'s peak-current time accordingly.'
    },
    {
      title: 'Fast response',
      q: 'Compare the mechanical time constants of a coreless rotor (10 g·cm²) and an iron-core rotor (60 g·cm²) with the same R = 2.5 Ω and K = 0.025 V·s/rad.',
      steps: [
        'Coreless: $10^{-6} \\times 2.5/0.025^2 = 4$ ms.',
        'Iron-core: six times the inertia, 24 ms.'
      ],
      a: '4 ms against 24 ms: the coreless motor reaches speed six times faster.'
    }
  ],
  quiz: [
    { q: 'Why has a coreless motor no cogging torque?', choices: ['There are no iron teeth in the air gap for the magnets to pull on', 'Its magnets are weak', 'Its brushes damp it', 'It runs at high speed'], a: 0, why: 'Cogging is magnetic attraction between magnets and slotted iron; a coreless rotor has neither teeth nor slots.' },
    { q: 'What problem does a coreless motor\'s low inductance cause with an ordinary PWM driver?', choices: ['Large current ripple: extra heat and brush wear', 'Too little starting torque', 'Reverse rotation', 'Cogging'], a: 0, why: 'Ripple ΔI = V D(1−D)/(L f) grows as L falls; raise f or add a choke.' },
    { q: 'A coreless motor jams at full voltage. Roughly how long before the winding is in danger?', choices: ['Seconds', 'Hours', 'Days', 'It is safe indefinitely'], a: 0, why: 'Stall current is many times rated; with a winding time constant of tens of seconds the limit is reached in seconds.' },
    { q: 'For frequent start–stop and reversing at high current, which brushes suit a coreless motor better?', choices: ['Graphite (copper–graphite)', 'Precious metal', 'Either — brushes do not matter', 'No brushes can do it'], a: 0, why: 'Graphite brushes withstand arcing and high currents; precious-metal brushes excel at low-current continuous duty.' },
    { q: 'A coreless rotor has more inertia than an iron-core rotor of the same size.', a: false, why: 'Without the iron core it is far lighter: its inertia and mechanical time constant are several times smaller.' }
  ],
  problems: [
    { q: 'A 12 V driver runs a 50 µH coreless motor at 50 % duty and 40 kHz. What is the peak-to-peak current ripple?', answer: 1.5, unit: 'A', tol: 0.01, steps: ['$\\Delta I = 12 \\times 0.25/(50\\times10^{-6} \\times 40\\,000) = 3/2 = 1.5$ A.'] },
    { q: 'A winding with a 30 s thermal time constant carries 1.5 times rated current from cold. How long before it reaches its limit?', answer: 17.6, unit: 's', tol: 0.02, steps: ['$t = 30\\ln(2.25/1.25) = 30 \\times 0.588 = 17.6$ s.'] }
  ],
  choose: {
    good: [
      'Battery-powered and portable devices where efficiency and small size count: medical pumps, handheld instruments, prosthetics.',
      'Fast start–stop and small precise servo axes: low inertia and no cogging.',
      'Smooth, quiet, low-speed running with a gearhead and encoder: optics, lab automation, cameras.'
    ],
    avoid: [
      'Loads that jam or stall often, and long high overloads: the winding has little thermal mass.',
      'Ordinary low-frequency PWM drivers without a choke.',
      'Hot, dusty or high-shock environments, and cheap high-volume products where an iron-core motor will do.'
    ],
    check: [
      'The driver\'s switching frequency and minimum load inductance; add a choke if needed.',
      'The winding and motor thermal time constants, the maximum winding temperature and the peak-current time.',
      'Brush type (precious metal or graphite) against your duty, or a brushless slotless version for long life.',
      'Speed limit of the bell and the load on the small bearings (radial and axial).'
    ]
  },
  applications: [
    'Insulin and infusion pumps, surgical handpieces and prosthetic hands.',
    'Robot grippers and small precise axes with planetary gearheads and encoders.',
    'Camera, telescope and laboratory instruments that must move smoothly and quietly.'
  ],
  sources: [
    'Kenjo and Nagamori, *Permanent-Magnet and Brushless DC Motors* (Oxford University Press): coreless and slotless DC motors.',
    'Hughes and Drury, *Electric Motors and Drives*: DC motors, their constants and time constants.',
    'Makers\' datasheets for coreless motors list the same quantities: terminal inductance, mechanical time constant, rotor inertia, thermal time constants of winding and housing, maximum winding temperature.'
  ],
  sim: 'rw-coreless'
},

{
  id: 'vibration-motors', parent: 'special-topic', title: 'Vibration motors', level: 1,
  short: 'Some motors are built to shake. An eccentric rotating mass (ERM) motor spins an off-centre weight; a linear resonant actuator (LRA) bounces a magnet on a spring at its resonance; industrial vibrator motors swing adjustable weights to drive feeders and screens. Their force follows m r ω² or the sharpness of a resonance.',
  keywords: ['vibration motor', 'ERM', 'eccentric rotating mass', 'coin vibration motor', 'pancake vibration motor', 'LRA', 'linear resonant actuator', 'haptics', 'haptic feedback', 'resonance', 'auto-resonance', 'overdrive', 'active braking', 'vibrator motor', 'unbalanced motor', 'vibrating feeder', 'self-synchronisation'],
  prereq: ['motor-vibration', 'pmdc-motor', 'physics:centripetal-force'],
  related: ['voice-coil-actuators', 'piezo-motors', 'coreless-motors', 'physics:driven-oscillations', 'ergonomics:hand-arm-vibration', 'bearing-failures'],
  body: `
Everywhere else in this app vibration is a fault. Here it is the product: the buzz of a phone, the rumble of a game controller, the shaking tray that feeds screws to an assembly machine.

### The ERM: an unbalanced motor on purpose
An **eccentric rotating mass** motor is a tiny DC motor with an off-centre weight on its shaft. The weight's centrifugal force rotates with it:

$$F = m\\,r\\,\\omega^2$$

A coin-shaped ERM with 0.3 g at 2 mm radius spinning at 12 000 rpm makes about 1 N — enough to shake a 100 g phone at about 1 g. ERMs come as small cylinders (4–7 mm across, the weight outside) and flat "coin" or pancake motors (8–12 mm, the weight inside), brushed or brushless.

Two things follow from the physics. Frequency and strength are **tied together**: lower the voltage, and the motor turns slower *and* shakes weaker, as ω². And the motor must spin up: tens of milliseconds, sometimes 100 ms, before full vibration, and as long to coast down — fine for a ring alert, mushy for a crisp "click". Drivers compensate by **overdriving** at the start and **braking** (reversing) at the end.

### The LRA: a mass on a spring
A **linear resonant actuator** is a small voice coil ([[voice-coil-actuators]]) that pushes a magnet mass back and forth on a spring. Driven by an AC signal at the spring–mass resonance $f_0 = \\frac{1}{2\\pi}\\sqrt{k/m}$ — typically about 150–240 Hz — a small current gives a large motion; a few hertz away the output collapses, because the resonance is sharp. Temperature, ageing and how it is mounted shift $f_0$, so haptic driver chips track it from the coil's back-EMF (*auto-resonance*). LRAs start and stop faster than ERMs (overdrive and braking help again), draw less current, and vibrate along one axis. Wideband voice-coil and piezo actuators go further, playing short, sharp textures.

Why 150–250 Hz? The skin's vibration receptors (the Pacinian corpuscles) are most sensitive in roughly that band, around 200–300 Hz; ergonomics has more on vibration and the hand ([[ergonomics:hand-arm-vibration]]).

### Industrial vibrator motors
Scale the ERM up and you get the **unbalanced vibrator motor**: a rugged three-phase induction motor with adjustable eccentric weights on both shaft ends, bolted to a feeder, screen, hopper, chute or compaction table. Centrifugal forces range from about a hundred newtons to tens of kilonewtons. Turning the outer weight relative to the inner one sets the force from zero to full. Two identical motors mounted side by side and turning in opposite directions **synchronise themselves** through the shaking structure: their sideways forces cancel and their forces along one line add, giving the straight-line throw a linear screen needs. Their bearings carry the full centrifugal force and are special, heavily loaded and regreased often.

| Type | Frequency | Force | Response | Typical use |
|---|---|---|---|---|
| Cylindrical ERM | 100–250 Hz, set by voltage | tenths of a newton to about 1 N | tens of ms | pagers, controllers, toys |
| Coin ERM | 150–220 Hz | about 0.5–1.5 N | tens of ms | phones, wearables |
| LRA | fixed at resonance, about 150–240 Hz | similar, one axis | about 10–30 ms with overdrive | phones, touch screens, trackpads |
| Industrial vibrator | 1000 or 1500 rpm on 50 Hz (and 3000) | 0.1 to tens of kN | seconds | feeders, screens, bin discharge |

In the simulation, compare an ERM and an LRA in a handheld device: watch the acceleration build up and die away after a 60 ms pulse, see how the ERM's frequency and strength rise together with voltage, and how the LRA's output collapses off resonance.

> [!warn] Industrial vibrator motors carry heavy rotating weights: keep their covers on, lock out before adjusting the weights, and check the bolts and welds of the structure regularly — vibration loosens and cracks them. Long exposure to hand-held vibrating tools harms the hands.

> [!key] An ERM shakes with F = m r ω², so frequency and strength rise together and it responds slowly; an LRA shakes at its spring–mass resonance, fast and efficient but only near that frequency; industrial vibrators scale the ERM up to drive feeders and screens.
`,
  ideas: [
    'An ERM\'s force is F = m r ω²: frequency and strength are coupled through the voltage.',
    'ERMs take tens of milliseconds to spin up and down; overdrive and braking sharpen them.',
    'An LRA is a mass on a spring driven at resonance: strong and fast, but only near f₀, so drivers track the resonance.',
    'Haptics works around 150–250 Hz where the skin is most sensitive.',
    'Industrial vibrator motors with adjustable weights drive feeders and screens; counter-rotating pairs self-synchronise into linear vibration.'
  ],
  pitfalls: [
    'An ERM can be set to any frequency at any strength — Both come from the same speed: lower speed means lower frequency and a much weaker force (ω²).',
    'An LRA works at whatever frequency you feed it — Its output falls steeply away from its resonance; a driver must track f₀ as it drifts.',
    'Stronger vibration always feels stronger — Perception depends on frequency; a strong vibration far below or above the skin\'s sensitive band feels weak.'
  ],
  formulas: [
    {
      name: 'Force of an eccentric mass',
      expr: 'F = m*r*w^2', tex: 'F = m\\,r\\,\\omega^2',
      vars: {
        F: { name: 'rotating force', q: 'force', unit: 'N' },
        m: { name: 'eccentric mass', q: 'mass', unit: 'mg', value: 300 },
        r: { name: 'radius of its centre of mass', q: 'length', unit: 'mm', value: 2 },
        w: { name: 'speed', q: 'angvel', unit: 'rpm', value: 12000, tex: '\\omega' }
      },
      stories: { F: 'A vibration motor spins {m} at {r} radius at {w}. What force does it make?', w: 'How fast must {m} at {r} spin to make {F}?' }
    },
    {
      name: 'Acceleration of the device',
      expr: 'a = F/M', tex: 'a = \\dfrac{F}{M}',
      vars: {
        a: { name: 'vibration acceleration (amplitude)', q: 'accel', unit: 'm/s²' },
        F: { name: 'force amplitude', q: 'force', unit: 'N', value: 0.95 },
        M: { name: 'mass of the device', q: 'mass', unit: 'g', value: 100 }
      },
      note: 'A free-hanging device; a hand holding it adds mass and damping. Haptic motors are specified on a standard test mass (often 100 g).',
      stories: { a: 'A motor making {F} shakes a {M} device. How strongly does it vibrate?' }
    },
    {
      name: 'Resonant frequency of an LRA',
      expr: 'f0 = sqrt(k/m)/(2*pi)', tex: 'f_0 = \\dfrac{1}{2\\pi}\\sqrt{\\dfrac{k}{m}}',
      vars: {
        f0: { name: 'resonant frequency', q: 'frequency', unit: 'Hz', tex: 'f_0' },
        k: { name: 'spring stiffness', q: 'stiffness', unit: 'N/m', value: 1813 },
        m: { name: 'moving mass', q: 'mass', unit: 'g', value: 1.5 }
      },
      stories: { f0: 'An LRA\'s {m} mass sits on a {k} spring. What is its resonant frequency?', k: 'What spring puts a {m} mass at {f0}?' }
    }
  ],
  examples: [
    {
      title: 'A coin ERM in a phone',
      q: 'A coin motor has 0.3 g at 2 mm and runs at 12 000 rpm on 3 V. Find its force, the acceleration of a 100 g phone, and the effect of running it at about 8000 rpm.',
      steps: [
        '$\\omega = 1257$ rad/s; $F = 0.0003 \\times 0.002 \\times 1257^2 = 0.95$ N.',
        '$a = 0.95/0.1 = 9.5$ m/s², about 1 g, at $12\\,000/60 = 200$ Hz.',
        'At 8000 rpm: $(8000/12\\,000)^2 = 0.44$ of the force (0.42 N) at 133 Hz — weaker *and* lower.'
      ],
      a: 'About 0.95 N and 1 g at 200 Hz; at 8000 rpm, 0.42 N at 133 Hz.'
    },
    {
      title: 'How sharp is an LRA\'s resonance?',
      q: 'An LRA has f₀ = 175 Hz and a quality factor Q = 15 (damping ratio ζ = 1/(2Q) = 0.033). How much output is left if it is driven at 165 Hz?',
      steps: [
        'At resonance the magnification is $Q = 15$.',
        'At $r = 165/175 = 0.943$: $1/\\sqrt{(1 - r^2)^2 + (2\\zeta r)^2} = 1/\\sqrt{0.111^2 + 0.063^2} = 7.8$.',
        '7.8/15 = 0.52: 10 Hz off resonance halves the output.'
      ],
      a: 'About half — which is why LRA drivers track the resonance.'
    },
    {
      title: 'A pair of vibrators on a feeder',
      q: 'Two counter-rotating vibrator motors, each making 5 kN at 1500 rpm, drive a 400 kg feeder trough. Estimate its acceleration and stroke along the line of action.',
      steps: [
        'Along the line the forces add: 10 kN amplitude; $a = 10\\,000/400 = 25$ m/s², about 2.5 g.',
        'At 25 Hz ($\\omega = 157$ rad/s), the displacement amplitude is $a/\\omega^2 = 25/157^2 = 1.0$ mm — a 2 mm stroke.'
      ],
      a: 'About 2.5 g and a 2 mm stroke.'
    }
  ],
  quiz: [
    { q: 'An ERM\'s supply voltage is lowered so it runs at half speed. Its force becomes about…', choices: ['a quarter, at half the frequency', 'half, at the same frequency', 'the same, at half the frequency', 'a quarter, at the same frequency'], a: 0, why: 'F = m r ω² and the frequency is the speed: half the speed, a quarter of the force, half the frequency.' },
    { q: 'An LRA with f₀ = 170 Hz is driven at 120 Hz. What happens?', choices: ['The vibration is much weaker', 'It vibrates more strongly', 'It vibrates at 170 Hz anyway', 'It stops working permanently'], a: 0, why: 'Far from resonance the spring–mass system barely responds; LRAs are driven at (and track) their resonance.' },
    { q: 'Why do phone haptic motors vibrate at roughly 150–250 Hz?', choices: ['The skin is most sensitive to vibration around 200–300 Hz', 'Batteries cannot supply lower frequencies', 'Higher frequencies are illegal', 'Motors cannot spin slower'], a: 0, why: 'The Pacinian corpuscles in the skin respond best in that band, so the least energy feels strongest there.' },
    { q: 'Two identical unbalanced motors on a screen, turning in opposite directions, produce…', choices: ['a straight-line vibration: sideways forces cancel, forces along one line add', 'a circular vibration twice as strong', 'no vibration, because they cancel', 'random vibration'], a: 0, why: 'They synchronise through the structure; their rotating forces add along one axis and cancel across it.' },
    { q: 'An ERM starts and stops vibrating instantly when its voltage is switched.', a: false, why: 'The rotor and weight must spin up and down: tens of milliseconds each way, which drivers shorten with overdrive and braking.' }
  ],
  problems: [
    { q: 'A 0.5 g eccentric mass at 1.5 mm radius spins at 9000 rpm. What force does it make?', answer: 0.666, unit: 'N', tol: 0.02, steps: ['$\\omega = 942.5$ rad/s.', '$F = 0.0005 \\times 0.0015 \\times 942.5^2 = 0.666$ N.'] },
    { q: 'An LRA has a 2 g moving mass on a 2000 N/m spring. What is its resonant frequency?', answer: 159.2, unit: 'Hz', tol: 0.02, steps: ['$f_0 = \\sqrt{2000/0.002}/(2\\pi) = 1000/6.283 = 159.2$ Hz.'] }
  ],
  choose: {
    good: [
      'ERMs for cheap, strong alerts and rumble: pagers, game controllers, toys, simple wearables.',
      'LRAs for crisp, fast, efficient haptic feedback on touch screens, trackpads and phones — with a resonance-tracking driver.',
      'Industrial vibrator motors for feeders, screens, bin and hopper discharge, compaction tables.'
    ],
    avoid: [
      'ERMs for short, sharp clicks or where frequency and strength must be set independently.',
      'LRAs driven by a plain fixed-frequency signal without tracking their resonance.',
      'Mounting industrial vibrators on structures with a natural frequency near their running speed.'
    ],
    check: [
      'Vibration strength on the real device mass, and the frequency against the skin\'s sensitive band.',
      'Start and stop times (with overdrive and braking), current draw from the battery and life (brushed ERMs wear).',
      'Mounting and axis: an LRA shakes along one axis; an ERM in a plane.',
      'For industrial vibrators: the force setting, bearing lubrication, bolt torque and fatigue of the structure.'
    ]
  },
  applications: [
    'Phones and wearables: silent alerts and touch feedback.',
    'Game controllers: two ERMs of different sizes give "rumble" of different characters.',
    'Vibratory bowl and linear feeders, vibrating screens and concrete compaction tables.'
  ],
  sources: [
    'ISO 9241-910, *Ergonomics of human–system interaction — Framework for tactile and haptic interactions*.',
    'Haptic driver application notes from semiconductor makers describe ERM and LRA drive: overdrive, braking and auto-resonance.',
    'I. I. Blekhman, *Synchronization in Science and Technology* (ASME Press): the self-synchronisation of unbalanced rotors on a common structure.'
  ],
  sim: 'rw-vibration-motors'
},

{
  id: 'solenoid-actuators', parent: 'special-topic', title: 'Solenoids', level: 1,
  short: 'A solenoid is a coil that pulls an iron plunger into itself. Its force grows steeply as the air gap closes — weak at the start of the stroke, strong at the end — so it suits on–off motion: locks, latches, valves and starters. Duty cycle, hold circuits and how the coil is switched off decide how hot it runs, how fast it moves and what it does to the electronics.',
  keywords: ['solenoid', 'linear solenoid', 'plunger', 'armature', 'air gap', 'pull force', 'force–stroke curve', 'duty cycle', 'ED', 'hold current', 'peak and hold', 'economy circuit', 'flyback diode', 'Zener', 'inductive kick', 'AC solenoid', 'shading ring', 'inrush', 'latching solenoid', 'proportional solenoid', 'rotary solenoid'],
  prereq: ['magnetic-circuits', 'physics:solenoid', 'electronics:flyback-diode'],
  related: ['voice-coil-actuators', 'motor-brakes', 'motor-heating', 'pneumatics:solenoid-valves', 'electronics:relays', 'motor-control-valves', 'h-bridge'],
  body: `
Wind a coil, put an iron plunger half inside it and switch on: the plunger is pulled in until it hits the stop. That is a **solenoid** actuator — the part that unlocks a door, opens a valve, flips a sorting gate, engages a car's starter or releases a brake.

### Force and the air gap
The field energy sits almost entirely in the air gap between plunger and pole. The magnet pulls to shrink that gap, and for an ideal gap $g$ of area $A$ with $N$ turns carrying $I$:

$$F = \\frac{(N I)^2 \\mu_0 A}{2\\,g^2}$$

Halving the gap quadruples the force. A solenoid is therefore **weakest at the start of its stroke and strongest at the end** — the opposite of what most loads want. (Real curves are flatter at small gaps, where the iron saturates, and near the open end, where fringing helps.) Data sheets give force against stroke; choose on the force at the *start* of your stroke, with a hot coil and the lowest supply voltage (often 90 % of nominal).

| Type | Stroke | Force | Notes |
|---|---|---|---|
| Open-frame (C or D frame) | 2–10 mm | about 1–20 N at mid-stroke | cheap; locks, vending, printers |
| Tubular | 5–25 mm | up to hundreds of N at short strokes | enclosed, more efficient, longer life |
| Latching | short | holds with no power | a permanent magnet holds; a pulse releases — for battery devices |
| Proportional | a few mm | flat force over the working stroke, set by current | shaped poles; hydraulic proportional valves |
| Rotary | 25–95° | torque | a helical ramp or shaped poles turn the pull into rotation |

### DC coils: current, heat and duty
A DC coil's steady current is $V/R$ and all its power $V^2/R$ is heat. **Continuous-duty** coils (100 %) are sized to survive that; **intermittent** coils are rated for a duty cycle (the ratio of on-time to cycle time, called ED in European data) with a maximum on-time. For cycles short compared with the coil's thermal time constant the average power counts, so a coil can take $V_c/\\sqrt{D}$: a 12 V continuous coil may be driven at 24 V at 25 % duty, pulling with four times the power. When the coil warms, its resistance rises about 0.4 % per kelvin; at 100 K rise the current falls by 28 % and the force (∝ I²) by nearly half.

Once the plunger is in, the gap is tiny and a fraction of the current holds it. **Peak-and-hold** drivers pull in at full current, then drop to 20–40 % by PWM: the holding power falls to a tenth or less and the coil stays cool.

### Switching off: the inductive kick
A coil stores energy $\\tfrac12 L I^2$; interrupt its current and it drives the voltage up until something conducts — hundreds of volts that arc switch contacts and kill transistors. A **flyback diode** across the coil ([[electronics:flyback-diode]]) lets the current circulate and decay safely — but slowly, holding the plunger in for longer. A diode in series with a Zener (or a TVS) clamps at a higher voltage and releases several times faster. Choose between protection and speed consciously.

### AC coils
On AC the current is limited by the coil's reactance, which is low with the gap open and high when closed: the **inrush** current is several times the holding current. If the plunger jams open, the high current continues and the coil burns. The force pulses at twice line frequency; a **shading ring** on the pole face keeps some flux during the zero crossings to stop chatter and hum.

### Speed, noise and life
Small solenoids pull in within tens of milliseconds: the current must build up (time constant $L/R$, rising as the plunger closes) and the plunger must travel. When the plunger moves, its rising inductance makes a characteristic **dip in the current** — proof that it moved. The impact at the end stop is noisy and wears the plunger and stop; cushions and soft stops help. Life ranges from hundreds of thousands to many millions of cycles. Residual magnetism can hold a plunger in after switch-off; a thin non-magnetic shim prevents it.

In the simulation, switch a DC solenoid on and off: watch the current rise and dip as the plunger moves, the force–stroke curve against the spring and load, the hold current, and how the flyback circuit sets the release time.

> [!warn] Solenoids on mains voltages are for qualified people. Plungers snap in with force and can trap fingers; coils run hot enough to burn; and an unprotected coil switched off produces a dangerous high-voltage spike. A solenoid-released brake or lock must fail safe — know what happens when the power fails.

> [!key] A solenoid pulls iron with F ∝ (NI)²/g²: weak at the open end, strong when closed. Size it for the start of the stroke with a hot coil and low voltage, respect its duty, hold with reduced current, and handle the switch-off energy.
`,
  ideas: [
    'Solenoid force F = (NI)² μ₀ A/(2g²) rises steeply as the air gap closes: weakest at the start of the stroke.',
    'All the coil\'s power V²/R is heat; intermittent duty allows V_c/√D, and a hot coil gives much less force.',
    'Peak-and-hold drive pulls in at full current and holds with a fraction of it.',
    'Switching off a coil makes an inductive spike: a flyback diode tames it but slows the release; a diode plus Zener releases faster.',
    'AC solenoids draw a large inrush while open, burn if jammed, and need a shading ring against chatter.'
  ],
  pitfalls: [
    'A solenoid\'s rated force is available over its whole stroke — The force is lowest at the open end; check the force at the start of your stroke, hot and at low voltage.',
    'A flyback diode is all a solenoid ever needs — It protects the switch but makes the release slow; fast valves use a Zener or TVS clamp.',
    'A DC solenoid, like an AC one, draws more current when its plunger is open — A DC coil\'s steady current is V/R whatever the plunger does; only the rise time changes. The large open-gap inrush is an AC effect.'
  ],
  formulas: [
    {
      name: 'Pull of an ideal solenoid',
      expr: 'F = (N*I)^2*mu0*A/(2*g^2)', tex: 'F = \\dfrac{(N I)^2\\,\\mu_0\\,A}{2\\,g^2}',
      vars: {
        F: { name: 'pull force', q: 'force', unit: 'N' },
        N: { name: 'turns', int: true, value: 1000 },
        I: { name: 'coil current', q: 'current', unit: 'A', value: 0.5 },
        mu0: { const: 'mu0' },
        A: { name: 'pole face area', q: 'area', unit: 'mm²', value: 150 },
        g: { name: 'air gap', q: 'length', unit: 'mm', value: 2 }
      },
      note: 'Iron reluctance, fringing and saturation are ignored: real solenoids give less at very small gaps (saturation, about B²A/2μ₀ at most) and a little more at large ones.',
      stories: { F: 'A solenoid of {N} turns carries {I}; its plunger face is {A} and the gap {g}. What is the pull?', g: 'At what gap does a solenoid ({N} turns, {I}, {A}) pull with {F}?' }
    },
    {
      name: 'Coil power',
      expr: 'P = V^2/R', tex: 'P = \\dfrac{V^2}{R}',
      vars: {
        P: { name: 'coil power (all heat)', q: 'power', unit: 'W' },
        V: { name: 'coil voltage', q: 'voltage', unit: 'V', value: 24 },
        R: { name: 'coil resistance', q: 'resistance', unit: 'Ω', value: 48 }
      },
      stories: { P: 'A {R} coil is connected to {V}. How much heat does it make?' }
    },
    {
      name: 'Voltage for intermittent duty',
      expr: 'V = Vc/sqrt(D)', tex: 'V = \\dfrac{V_c}{\\sqrt{D}}',
      vars: {
        V: { name: 'permissible voltage at this duty', q: 'voltage', unit: 'V' },
        Vc: { name: 'continuous-duty voltage', q: 'voltage', unit: 'V', value: 12, tex: 'V_c' },
        D: { name: 'duty cycle (on-time / cycle time)', q: 'ratio', unit: '%', value: 25, min: 0, max: 100 }
      },
      note: 'Equal average heating, for cycles short compared with the coil\'s thermal time constant, and within the maker\'s maximum on-time.',
      stories: { V: 'A coil rated {Vc} continuous is used at {D} duty. What voltage may it take?', D: 'A {Vc} coil is to be driven at {V}. What duty cycle is allowed?' }
    },
    {
      name: 'Current rise time constant',
      expr: 'tau = L/R', tex: '\\tau = \\dfrac{L}{R}',
      vars: {
        tau: { name: 'electrical time constant', q: 'time', unit: 'ms', tex: '\\tau' },
        L: { name: 'coil inductance (at this gap)', q: 'inductance', unit: 'mH', value: 60 },
        R: { name: 'coil resistance', q: 'resistance', unit: 'Ω', value: 48 }
      },
      note: 'The inductance grows many times as the gap closes, so the time constant does too.',
      stories: { tau: 'A coil of {L} and {R}: how fast does its current rise?' }
    }
  ],
  examples: [
    {
      title: 'Force along the stroke',
      q: 'A solenoid has 1000 turns carrying 0.5 A and a plunger face of 150 mm². Find the ideal pull at gaps of 4 mm, 2 mm and 0.5 mm, and the saturation limit (B = 1.5 T).',
      steps: [
        '$(NI)^2\\mu_0 A/2 = 500^2 \\times 1.257\\times10^{-6} \\times 1.5\\times10^{-4}/2 = 2.36\\times10^{-5}$ N·m².',
        '4 mm: $2.36\\times10^{-5}/(0.004)^2 = 1.5$ N; 2 mm: 5.9 N; 0.5 mm: 94 N.',
        'Saturation: $B^2A/(2\\mu_0) = 2.25 \\times 1.5\\times10^{-4}/(2.51\\times10^{-6}) = 134$ N — the 0.5 mm value is already near it (the gap flux density there is $\\mu_0 NI/g = 1.26$ T).'
      ],
      a: 'About 1.5 N at 4 mm, 5.9 N at 2 mm and 94 N at 0.5 mm — a factor of 60 across the stroke.'
    },
    {
      title: 'Overdriving an intermittent coil',
      q: 'A coil rated 12 V continuous (R = 18 Ω) is used at 25 % duty with a short on-time. What voltage may it take, and what does that do to the power and the pull?',
      steps: [
        '$V = 12/\\sqrt{0.25} = 24$ V.',
        'Power: $12^2/18 = 8$ W continuous; $24^2/18 = 32$ W while on — 8 W on average.',
        'Current doubles, so the pull (∝ I²) is four times larger at every gap.'
      ],
      a: '24 V: four times the power while on, four times the force, the same average heat.'
    },
    {
      title: 'Peak and hold',
      q: 'A 24 V, 48 Ω solenoid pulls in at full current. After pull-in the driver holds it at 30 % of the current. What are the pull-in and holding powers?',
      steps: [
        'Pull-in: $I = 0.5$ A, $P = 12$ W.',
        'Hold: $I = 0.15$ A, $P = 0.15^2 \\times 48 = 1.1$ W — less than a tenth.',
        'At the closed gap the force is still far above the spring and load.'
      ],
      a: '12 W to pull, about 1.1 W to hold.'
    }
  ],
  quiz: [
    { q: 'A solenoid\'s air gap is halved at the same current. Its pull becomes about…', choices: ['four times larger', 'twice as large', 'half', 'the same'], a: 0, why: 'F ∝ 1/g² for an ideal gap.' },
    { q: 'Where in its stroke is a solenoid weakest?', choices: ['At the start, with the gap wide open', 'At the end, gap closed', 'In the middle', 'It is the same everywhere'], a: 0, why: 'The force grows as the gap closes; size it for the open end.' },
    { q: 'The plunger of an AC solenoid jams half-way. What happens?', choices: ['The coil keeps drawing a high current and overheats', 'The current falls to zero', 'The force doubles and frees it', 'Nothing: AC solenoids are self-protecting'], a: 0, why: 'With the gap open the inductance is low, so the current stays at inrush level.' },
    { q: 'A flyback diode across a valve solenoid makes the valve close more slowly. Why?', choices: ['The current circulates through the diode and decays slowly, keeping the plunger held', 'The diode reduces the coil voltage while on', 'The diode adds capacitance', 'It does not; diodes speed release'], a: 0, why: 'The diode clamps the coil at about 0.7 V, so the stored energy dissipates slowly; a Zener clamp at a higher voltage decays it faster.' },
    { q: 'A DC solenoid draws more steady current with its plunger out than in.', a: false, why: 'Its steady current is V/R. The plunger position changes the inductance and so how fast the current rises — not its final value.' }
  ],
  problems: [
    { q: 'A 12 V coil has a resistance of 18 Ω. How much heat does it make when on?', answer: 8, unit: 'W', tol: 0.01, steps: ['$P = 12^2/18 = 8$ W.'] },
    { q: 'A coil rated 24 V continuous is used at 50 % duty. What voltage may it take?', answer: 33.9, unit: 'V', tol: 0.02, steps: ['$V = 24/\\sqrt{0.5} = 33.9$ V.'] }
  ],
  choose: {
    good: [
      'Short on–off strokes: door locks and latches, valves, diverters and sorting gates, brakes, starters.',
      'Latching solenoids for battery devices that hold a position for a long time.',
      'Proportional solenoids to set a hydraulic or pneumatic valve by current.'
    ],
    avoid: [
      'Positioning between the ends of travel — use a voice coil, stepper or servo.',
      'Loads that need a large force at the start of a long stroke.',
      'Continuous holding at full current without an economy circuit, and AC solenoids where the plunger might jam.'
    ],
    check: [
      'Force at the start of your stroke with a hot coil and minimum voltage, against spring, load and friction.',
      'Duty cycle and maximum on-time; the coil temperature class.',
      'Switch-off protection (diode, Zener, TVS) and the release time it gives.',
      'Life in cycles, noise and end-stop cushioning, side loads and mounting orientation.'
    ]
  },
  applications: [
    'Solenoid valves in pneumatics and hydraulics, from tiny pilots to large direct-acting valves ([[pneumatics:solenoid-valves]]).',
    'Car starters: the solenoid throws the pinion into the flywheel and closes the heavy starter contacts.',
    'Spring-applied motor brakes released by a coil ([[motor-brakes]]), door locks and vending machines.'
  ],
  sources: [
    'Roters, *Electromagnetic Devices* (Wiley): the classical treatment of solenoid and electromagnet design.',
    'Fitzgerald, Kingsley and Umans, *Electric Machinery*: force from magnetic field energy and coenergy.',
    'DIN VDE 0580, *Electromagnetic devices and components — General specifications*: duty types and relative duty (ED) of solenoids.'
  ],
  sim: 'rw-solenoid'
}

);
