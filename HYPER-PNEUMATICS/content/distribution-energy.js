/* HYPER-PNEUMATICS · content/distribution-energy.js
 *
 * Branch "Distributing Air", topic air-networks: layouts and ring mains, drops and drains, pressure drop,
 * pipe sizing, tubing and couplings, boosters, leaks.
 * Branch "Energy and Efficiency", topic air-cost: the cost of compressed air, leak management, lowering the
 * pressure, artificial demand, air-saving circuits, audits, pneumatic or electric.
 * Simulations in sims/distribution-energy.js (ids dist-…).
 */
Hyper.add(

/* ====================================================================== AIR NETWORKS */
{
  id: 'piping-layout', parent: 'air-networks', title: 'Piping layouts and ring mains', level: 1,
  short: 'How a compressed-air network is laid out — compressor room, header, mains, drops and machines — and why a ring main, which feeds every drop from two sides, loses only about a quarter of the pressure a single line of the same bore would.',
  keywords: ['ring main', 'loop main', 'dead-end line', 'branch line', 'tree network', 'header', 'grid network', 'distribution network', 'compressed air piping', 'isolation valve', 'aluminium pipe', 'secondary receiver', 'pipe material'],
  prereq: ['standard-air', 'receivers', 'pressure-drop-air'],
  related: ['drops-drains', 'pipe-sizing-air', 'air-leaks', 'pressure-optimisation', 'receiver-sizing', 'hydraulics:pipe-networks', 'hydraulics:pipes-series-parallel'],
  body: `
Follow the air out of the compressor room: through the receiver, dryer and filters into a **header**, along **mains** that run round the hall under the roof, down **drops** at the columns, through a service unit and a hose into a machine. A mid-sized plant with 150 kW of compressors may have a kilometre of pipe. How that pipe is arranged decides how much pressure reaches the far corner, how steady it is when a big user starts, and whether a section can be shut for repair without stopping the factory.

### Dead-end lines
The simplest layout is a trunk with branches, like a tree: air reaches each drop by one path only. It is cheap and quick, and fine for a workshop or a short run. Its weakness is the far end. The first metres of the trunk carry the flow of every machine downstream, so the pressure falls step by step along the line, and when a large user near the end starts, everyone beyond the last branch feels it. Extending the plant usually means lengthening the trunk — and the drop grows with it.

### The ring main
Close the trunk into a loop round the hall and every drop is fed from **two sides**. The flow divides so that both paths lose the same pressure: more air takes the shorter, less resistant side. For a consumer half-way round, each side carries half the flow over half the ring. Since the drop grows roughly as flow$^{1.85}$ times length,

$$\\frac{\\Delta p_\\text{ring}}{\\Delta p_\\text{single line}} = \\left(\\tfrac12\\right)^{1.85} \\approx 0.28$$

— about a quarter of the drop of a single pipe of the same bore running the same distance. Even a consumer a quarter of the way round sees less than half the single-line drop. A ring also evens out the pressure when big users switch on, and with **isolation valves** between sections, one section can be exhausted for work while the others stay live. The price is one extra length of pipe to close the loop. Large sites join several rings into a **grid**, with cross-connections between halls.

| Layout | How air reaches a drop | Pressure drop | Typical use |
|---|---|---|---|
| Dead-end (tree) | one path | largest; the far end suffers | small shops, short runs |
| Ring main | two paths | about ¼ of a single line for the far point | most factory halls |
| Grid (linked rings) | many paths | smallest, very steady | large plants, several buildings |

### A pressure budget
Designers split the pressure between compressor and tool into a budget. Typical figures: aftercooler, dryer and filters 0.2–0.5 bar; the pipework from the compressor room to the furthest drop **no more than about 0.1 bar**; drop and service unit 0.2–0.4 bar; hose and couplings 0.2–0.6 bar. The mains are often the smallest item — but they are the one that cannot be changed cheaply later. Every bar the compressor must add to cover losses costs about 7 % more energy (see [[pressure-optimisation]]).

### Good practice
- Run mains overhead, sloping towards drain points, and take drops from the top (see [[drops-drains]]).
- Size the ring as though the whole flow travelled half-way round — a margin, since in reality it splits (see [[pipe-sizing-air]]).
- Fit an isolation valve at each section and each drop, and a secondary receiver near large intermittent users (see [[receivers]]).
- Keep separate lines for different pressures or air qualities rather than raising the whole plant for one machine (see [[pressure-boosters]]).
- Choose materials made for compressed air: galvanised or stainless steel, copper, modular aluminium systems (smooth bore, quick to fit, few leaks) or plastics certified for compressed air. **Never PVC water pipe**: it can shatter into sharp fragments.

> [!warn] A network stores a great deal of energy. Before cutting into or extending a main, close and lock the isolation valves, exhaust the section and check with a gauge that it reads zero. Pressure-test new pipework before it goes into service.
`,
  ideas: [
    'A dead-end line feeds each drop by one path; the far end carries the whole drop of the line.',
    'A ring main feeds every drop from two sides; for the far point the drop is about (½)^1.85 ≈ 28 % of a single line.',
    'The flow in a ring splits so that both paths lose the same pressure — more air takes the shorter side.',
    'A typical budget allows about 0.1 bar for the pipework from compressor room to the furthest drop.',
    'Isolation valves let a section of a ring be worked on while the rest stays live.'
  ],
  pitfalls: [
    'A ring main needs no care in sizing because air comes from both sides — Each side still has to carry its share; designers size a ring as if the full flow went half-way round, and growth in demand still needs bigger pipe.',
    'Any pipe rated for the pressure will do — PVC water pipe can shatter under pressure or impact into sharp fragments; use only materials made and certified for compressed air.',
    'The pressure lost in the mains is negligible, so it does not matter — Every 0.1 bar the compressor must add is roughly 0.7 % more energy all year, and undersized mains cannot be fixed cheaply later.'
  ],
  formulas: [
    {
      name: 'Share of the flow on the shorter side of a ring',
      expr: 'q1 = 1/(1 + (x/(1 - x))^(1/n))', tex: 'q_1 = \\dfrac{1}{1 + \\left(\\dfrac{x}{1 - x}\\right)^{1/n}}',
      vars: {
        q1: { name: 'share of the flow taking the shorter side', q: 'ratio', unit: '%', tex: 'q_1' },
        x: { name: 'position of the consumer round the ring from the inlet (share of the ring)', q: 'ratio', unit: '%', value: 30, min: 1, max: 50, tex: 'x' },
        n: { name: 'exponent of the flow in the pressure-drop law', value: 1.85, fixed: true, tex: 'n' }
      },
      note: 'Both paths lose the same pressure, and the drop grows as flow^n × length (n ≈ 1.85 for compressed-air pipes, 2 in fully rough flow). Same bore all round, one consumer.',
      stories: { q1: 'A consumer sits {x} of the way round a ring main from its inlet. What share of its air comes along the shorter side?', x: 'The shorter side of a ring carries {q1} of a consumer\'s air. How far round the ring is the consumer?' }
    },
    {
      name: 'Ring drop compared with a single line',
      expr: 'R = (1/(1 + (x/(1 - x))^(1/n)))^n', tex: 'R = \\left[\\dfrac{1}{1 + \\left(\\dfrac{x}{1 - x}\\right)^{1/n}}\\right]^{n}',
      vars: {
        R: { name: 'ring drop as a share of a single line\'s drop', q: 'ratio', unit: '%', tex: 'R' },
        x: { name: 'position of the consumer round the ring from the inlet (share of the ring)', q: 'ratio', unit: '%', value: 30, min: 1, max: 50, tex: 'x' },
        n: { name: 'exponent of the flow in the pressure-drop law', value: 1.85, fixed: true, tex: 'n' }
      },
      note: 'Compared with one pipe of the same bore running along the shorter side and carrying the whole flow. At x = 50 % (the far point) R = 0.5^1.85 = 27.7 %.',
      stories: { R: 'A consumer is {x} of the way round a ring main. Its pressure drop is what share of a single line of the same bore and route?' }
    }
  ],
  examples: [
    {
      title: 'A consumer half-way round',
      q: 'A ring main of 300 m, 53 mm bore (DN 50 steel), is fed at 7 bar gauge. A consumer half-way round draws 8 m³/min of free air. Compare the pressure drop with a single 150 m line of the same bore, using the empirical pipe formula $\\Delta p = 1.6\\times10^3\\,Q^{1.85}L/(d^5 p)$ (SI).',
      steps: [
        'Single line: $Q = 8/60 = 0.133$ m³/s, $Q^{1.85} = 0.0241$, $d^5 = 0.053^5 = 4.18\\times10^{-7}$ m⁵, $p = 8.0\\times10^5$ Pa absolute.',
        '$\\Delta p = 1600 \\times 0.0241 \\times 150/(4.18\\times10^{-7} \\times 8.0\\times10^5) = 1.7\\times10^4$ Pa = 0.17 bar.',
        'Ring: each side carries 4 m³/min over 150 m, so the drop is $0.5^{1.85} = 0.28$ of that: 0.047 bar.',
        'A Darcy–Weisbach calculation with the friction factor for each flow gives 0.158 and 0.041 bar — the same picture.'
      ],
      a: 'About 0.17 bar as a single line, 0.05 bar as a ring — a quarter as much.'
    },
    {
      title: 'A consumer a fifth of the way round',
      q: 'A large user sits 20 % of the way round a ring from its inlet. What share of its air comes the short way, and how does its drop compare with a single line along the short side?',
      steps: [
        '$x/(1-x) = 0.2/0.8 = 0.25$; $0.25^{1/1.85} = 0.473$.',
        '$q_1 = 1/(1 + 0.473) = 0.679$: 68 % comes the short way, 32 % the long way round.',
        '$R = 0.679^{1.85} = 0.49$: the drop is about half that of a single line.'
      ],
      a: '68 % of the air takes the short side; the drop is about half a single line\'s.'
    }
  ],
  quiz: [
    { q: 'In a ring main, a consumer half-way round sees a pressure drop compared with a single line of the same bore and distance of about…', choices: ['the same', 'a half', 'a quarter', 'a tenth'], a: 2,
      why: 'Each side carries half the flow over the same distance; with Δp ∝ Q^1.85 the drop is (½)^1.85 ≈ 0.28 of the single line.' },
    { q: 'In a ring, the air reaching a consumer divides between the two sides so that…', choices: ['each side carries half', 'both sides lose the same pressure', 'the longer side carries more', 'all of it takes the shorter side'], a: 1,
      why: 'Both paths start and end at the same pressures, so their drops must be equal; the shorter (less resistant) side carries more flow.' },
    { q: 'PVC water pipe rated above the working pressure is acceptable for a compressed-air main.', a: false,
      why: 'PVC can fail brittlely and shatter into sharp fragments, especially with compressor oil, heat or impact. Use metals or plastics made and certified for compressed air.' },
    { q: 'What do isolation valves between sections of a ring allow?', choices: ['higher pressure in each section', 'working on one section while the rest stays supplied', 'less condensate', 'faster flow'], a: 1,
      why: 'Closing the valves on each side of a section lets it be exhausted and worked on, while air still reaches every other drop round the other way.' },
    { q: 'About how much of the pressure budget is normally allowed for the pipework from the compressor room to the furthest drop?', choices: ['0.01 bar', '0.1 bar', '1 bar', '2 bar'], a: 1,
      why: 'About 0.1 bar is the usual target for the mains; the treatment, service units and hoses take several times more.' }
  ],
  problems: [
    { q: 'A consumer sits 30 % of the way round a ring from its inlet. What share of its air arrives along the shorter side (flow exponent 1.85)?', answer: 61.3, unit: '%', tol: 0.02,
      steps: ['$x/(1-x) = 0.3/0.7 = 0.4286$; $0.4286^{1/1.85} = 0.633$.', '$q_1 = 1/(1 + 0.633) = 0.613$ = 61 %.'] }
  ],
  applications: ['Factory halls with dozens of machines on a ring main round the walls.', 'Multi-building sites with a grid of linked rings and several compressor rooms.', 'Workshops and garages with a short dead-end line and a few drops.', 'Hospitals, whose medical-air networks have duplicated supplies and sectional valves.'],
  history: 'In the 1880s Paris had a public compressed-air network, begun to drive pneumatic clocks and extended to power workshops, lifts and small engines, with mains running for tens of kilometres under the streets. Factory ring mains became standard practice as pneumatic tools and automation spread in the twentieth century.',
  sim: 'dist-ring-main'
},

{
  id: 'drops-drains', parent: 'air-networks', title: 'Drops, drains and slopes', level: 1,
  short: 'Keeping water out of the machines: mains that fall 1–2 % towards drain points, drops taken from the top of the main, drain legs at low points and at the foot of every drop, and drains that remove condensate without wasting air.',
  keywords: ['drop', 'take-off', 'swan neck', 'goose neck', 'drain leg', 'drip leg', 'slope', 'fall', 'condensate', 'timer drain', 'zero-loss drain', 'float drain', 'level-sensing drain', 'saw-tooth main'],
  prereq: ['piping-layout', 'condensate', 'pressure-dew-point'],
  related: ['condensate-drains', 'refrigerated-dryers', 'desiccant-dryers', 'pipe-sizing-air', 'air-leaks', 'frl-units'],
  body: `
Air leaves a compressor saturated with water vapour. On a warm, humid day a 10 m³/min compressor condenses around 40 litres of water in an eight-hour shift once its air is cooled — most of it in the aftercooler and dryer (see [[condensate]]). Whatever gets past them, or condenses later because a pipe is colder than the air's pressure dew point, runs along the bottom of the mains. Water in the air washes out lubricants, corrodes valves and cylinders, spoils paint and freezes in outdoor lines. The network is built so that this water collects where it can be removed, not where machines draw their air.

### Slopes
Mains are laid with a **fall of 1–2 %** — 1 to 2 cm per metre — in the direction of flow, towards drain points. On a long run the fall adds up (a 1 % fall over 60 m is 0.6 m), so long mains are laid in a **saw-tooth**: the pipe falls for a stretch, rises vertically back to the ceiling, and a drain leg sits at the bottom of each rise. In a ring the pipe falls both ways from high points to low points, each with a drain.

### Drops from the top
Water runs along the bottom of a pipe, so a drop is taken from the **top** of the main with a tee and a 180° bend — the swan neck. A drop taken from the bottom would collect every drop of water passing by. The vertical drop continues below the take-off for the service unit into a short **drain leg** with a drain valve at its foot; water falling down the drop goes past the machine's tee into the leg. The same leg belongs at every low point and at the end of every dead-end line.

### Keep the air slow
Below about 10 m/s condensate stays at the bottom of the pipe and runs to the drains. Faster air tears it off as droplets and carries it past the drain legs into machines — one more reason to keep mains at 6–10 m/s (see [[pipe-sizing-air]]).

### Drains that do not waste air
| Drain | How it works | Weak point |
|---|---|---|
| Manual valve | someone opens it | forgotten; water overflows into the line |
| Float drain | a float opens a valve when water rises | sticks with oily sludge |
| Timer solenoid drain | opens for a few seconds every few minutes | wastes air whenever it opens with no water |
| Level-sensing (zero-loss) drain | opens only while water is present | costs more to buy |

A timer drain with a 3 mm valve at 7 bar blows about 440 L/min while open; set to 5 s every 5 minutes it wastes 7 L/min on average, around 3900 m³ of free air and 420 kWh a year — a few tens of ¤ per drain, and plants often have dozens. Condensate from lubricated compressors is oily and must pass an oil–water separator before it reaches a drain (see [[condensate-drains]]).

### With a good dryer
A refrigerated dryer holds the pressure dew point near +3 °C, so indoor pipes stay dry. Drains in the network are still needed: dryers fail or are bypassed, lines through cold stores or outdoors in winter fall below +3 °C (those need a desiccant dryer, see [[desiccant-dryers]]), and oil and pipe scale still collect.

> [!warn] Opening a drain under pressure can spit condensate, oil and rust at high speed: wear eye protection and point the outlet away from people. Never loosen a plug or fitting to drain a pressurised line — exhaust the section first.
`,
  ideas: [
    'Mains fall 1–2 % in the direction of flow towards drain points; long runs are laid in a saw-tooth.',
    'Drops are taken from the top of the main (swan neck), so water running along the bottom passes by.',
    'Every drop, low point and dead end ends in a drain leg with a drain.',
    'Keep main velocities below about 10 m/s so condensate is not dragged past the drains.',
    'Timer drains waste air every time they open without water; level-sensing drains do not.'
  ],
  pitfalls: [
    'With a refrigerated dryer the network needs no drains — Dryers fail, pipes in cold places fall below the dew point, and oil and scale still collect; drains stay.',
    'A drop from the bottom of the main gives the best supply — It collects all the water running along the main; take drops from the top.',
    'A timer drain costs nothing to run — Each opening blows compressed air to atmosphere whether or not water is there; badly set timers waste hundreds of cubic metres a year each.'
  ],
  formulas: [
    {
      name: 'Fall of a sloping main',
      expr: 'h = s*L', tex: 'h = s\\,L',
      vars: {
        h: { name: 'fall over the run', q: 'length', unit: 'mm' },
        s: { name: 'slope', q: 'ratio', unit: '%', value: 1.5, min: 0.1, max: 5 },
        L: { name: 'length of the run', q: 'length', unit: 'm', value: 20 }
      },
      note: 'Usual slopes are 1–2 % in the direction of flow; a longer main is laid in a saw-tooth with a drain leg at each low point.',
      stories: { h: 'A main {L} long is laid with a slope of {s}. How much lower is its end?', L: 'A main may fall no more than {h} before it must rise again. At a slope of {s}, how long can the run be?' }
    },
    {
      name: 'Air wasted by a timer drain',
      expr: 'Q = Qo*to/tc', tex: 'Q_\\text{avg} = Q_\\text{open}\\,\\dfrac{t_\\text{open}}{t_\\text{cycle}}',
      vars: {
        Q: { name: 'average free-air flow lost', q: 'airflow', unit: 'L/min ANR', tex: 'Q_\\text{avg}' },
        Qo: { name: 'flow while the drain is open', q: 'airflow', unit: 'L/min ANR', value: 440, tex: 'Q_\\text{open}' },
        to: { name: 'time open each cycle', q: 'time', unit: 's', value: 5, tex: 't_\\text{open}' },
        tc: { name: 'interval between openings', q: 'time', unit: 'min', value: 5, tex: 't_\\text{cycle}' }
      },
      note: 'The flow while open is choked orifice flow (see the leak formula on [[air-leaks]]): about 440 L/min for a 3 mm valve at 7 bar gauge. Water leaves first, then air — the loss is the air part.',
      stories: { Q: 'A timer drain passes {Qo} when open and opens for {to} every {tc}. What average flow of air does it waste?' }
    }
  ],
  examples: [
    {
      title: 'What a timer drain costs',
      q: 'A timer drain with a 3 mm valve on a 7 bar gauge line opens for 5 s every 5 minutes, day and night. How much air and money does it waste in a year, if the compressors need 6.5 kW per m³/min and electricity costs ¤0.15 per kWh?',
      steps: [
        'While open it passes about 440 L/min of free air (choked flow through 3 mm at 8.0 bar absolute).',
        'Average: $440 \\times 5/300 = 7.3$ L/min.',
        'A year: $7.3 \\times 60 \\times 8760 = 3.86\\times10^6$ L = 3860 m³.',
        'Energy: $3860 \\times 6.5/60 = 418$ kWh; cost $418 \\times 0.15 = 63$.'
      ],
      a: 'About 3900 m³ of free air, 420 kWh and ¤63 a year — for one drain.'
    },
    {
      title: 'A saw-tooth main',
      q: 'A main runs 80 m along a hall at 4.0 m height, with a slope of 1.5 %. The pipe must stay above 3.4 m to clear cranes. How often must it rise back and drain?',
      steps: [
        'The allowed fall is $4.0 - 3.4 = 0.6$ m.',
        'Run per fall: $L = h/s = 0.6/0.015 = 40$ m.',
        'Two 40 m stretches: a drain leg and a vertical rise back to 4.0 m in the middle, and another drain at the end.'
      ],
      a: 'Every 40 m — one intermediate rise with a drain leg, plus the drain at the end.'
    }
  ],
  quiz: [
    { q: 'Where should a drop to a machine be taken from the main?', choices: ['from the bottom', 'from the side', 'from the top, with a bend down', 'it does not matter'], a: 2,
      why: 'Water runs along the bottom of the pipe; a take-off from the top lets it pass by to the drain points.' },
    { q: 'Which way should a main fall?', choices: ['towards the compressor', 'in the direction of flow, towards drain points', 'it should be level', 'upwards towards the machines'], a: 1,
      why: 'Water is then carried by both gravity and the air towards the drain legs.' },
    { q: 'A plant has a refrigerated dryer, so drain legs in the network can be left out.', a: false,
      why: 'Drains are still needed for dryer failures, cold sections below the pressure dew point, oil and scale.' },
    { q: 'Why are velocities in mains kept below about 10 m/s, apart from pressure drop?', choices: ['to reduce noise only', 'so condensate is not dragged past the drains', 'to keep the air warm', 'to protect the dryer'], a: 1,
      why: 'Fast air tears water off the pipe bottom as droplets and carries it into the machines.' },
    { q: 'A timer drain passes 400 L/min when open and opens 4 s every 2 min. What average flow does it waste (L/min)?', answer: 13.3, unit: 'L/min', tol: 0.03,
      why: '400 × 4/120 = 13.3 L/min of free air, around the clock.' }
  ],
  problems: [
    { q: 'A main 35 m long falls 1.2 % in the direction of flow. How much lower is its end (mm)?', answer: 420, unit: 'mm', tol: 0.02,
      steps: ['$h = sL = 0.012 \\times 35 = 0.42$ m = 420 mm.'] }
  ],
  applications: ['Factory mains with swan-neck drops and drain legs at every column.', 'Paint shops, where a drop of water or oil spoils a finish.', 'Outdoor and cold-store lines, which need desiccant-dried air.', 'Replacing timer drains with level-sensing drains as an energy measure.'],
  sim: 'dist-ring-main'
},

{
  id: 'pressure-drop-air', parent: 'air-networks', title: 'Pressure drop in air lines', level: 2,
  short: 'Air loses pressure as it flows along a pipe, through wall friction: the Darcy–Weisbach law with the air\'s density at line pressure, so the drop grows with nearly the square of the flow and the fifth power of one over the bore — and falls as the line pressure rises.',
  keywords: ['pressure drop', 'pressure loss', 'Darcy–Weisbach', 'friction factor', 'compressible flow', 'line pressure', 'velocity', 'Reynolds number', 'empirical formula', 'equivalent length', 'fittings', 'isothermal flow', 'pressure budget'],
  prereq: ['absolute-gauge-pressure', 'standard-air', 'ideal-gas-law', 'hydraulics:darcy-weisbach'],
  related: ['pipe-sizing-air', 'piping-layout', 'tubing-fittings', 'air-flow-basics', 'choked-flow', 'hydraulics:friction-factor', 'hydraulics:colebrook', 'hydraulics:equivalent-length', 'hydraulics:minor-losses', 'aerodynamics:reynolds-number', 'pressure-optimisation'],
  body: `
The gauge in the compressor room reads 7.5 bar; the one at the far end of the factory reads 6.4. The missing bar went into friction — in dryers, filters, pipes, fittings, service units, hoses and couplings. In a straight pipe the loss follows the same law as for water ([[hydraulics:darcy-weisbach|Darcy–Weisbach]]), with one twist: the density of air depends on its pressure.

### Darcy–Weisbach with compressed air
$$\\Delta p = f\\,\\frac{L}{D}\\,\\frac{\\rho V^2}{2}$$

$f$ is the Darcy friction factor, $L$ and $D$ the length and bore. For air, $\\rho = p/(R_\\text{air}T)$ at the **line pressure** (absolute): at 7 bar gauge and 20 °C it is 9.5 kg/m³, eight times the density of free air. Flows are counted as free air $Q_n$ (see [[standard-air]]); in the pipe the same air fills only $Q_n\\,p_n/p$, so it moves at

$$V = \\frac{4\\,Q_n\\,p_n}{\\pi D^2\\,p}$$

Putting these together gives the drop in terms of free air:

$$\\Delta p = \\frac{8 f L\\,\\rho_n^2 R_\\text{air} T\\,Q_n^2}{\\pi^2 D^5\\,p}$$

Read it term by term. The drop grows with the **square of the flow** (a little less, since $f$ falls as the flow rises: doubling the flow multiplies the drop by about 3.6). It grows with the **fifth power of 1/D**: a bore 20 % smaller loses 3 times as much, half the bore 32 times as much. And it falls with the **line pressure**: the same free air at 10 bar instead of 5 is packed into half the volume, moves half as fast and loses about half the pressure.

### Reynolds number and friction factor
The Reynolds number $\\mathrm{Re} = \\rho V D/\\mu = 4\\rho_n Q_n/(\\pi D\\mu)$ depends on the mass flow and the bore, **not on the pressure**. 5 m³/min in a 40 mm pipe gives Re ≈ 174 000: fully turbulent, like nearly all compressed-air flow. The friction factor then comes from the Colebrook equation ([[hydraulics:colebrook]]) with the pipe's roughness: typically 0.018–0.025, lower for smooth aluminium and plastic pipe than for old galvanised steel.

### Long lines and large drops
The formula above uses one pressure $p$, so it is accurate while the drop is a small part of it — under about 10 %, which is always true of a well-designed main. For long pipelines (a quarry, a tunnel) the density changes along the way; integrating at constant temperature gives $p_1^2 - p_2^2 = f L\\,\\dot m^2 R_\\text{air} T/(D A^2)$.

### The empirical formula
Handbooks also give a one-line formula fitted to tests on steel pipe:

$$\\Delta p = 1.6\\times10^{3}\\,\\frac{Q^{1.85}\\,L}{d^{5}\\,p}$$

in SI units — $\\Delta p$ and $p$ (absolute) in Pa, $Q$ in m³/s of free air, $L$ and $d$ in m. The exponent 1.85 instead of 2 absorbs the fall of the friction factor with flow. In workshop units (bar, L/s, mm) the coefficient becomes about 450. It agrees with Darcy–Weisbach within 10–20 % in the usual range, which is as good as the flow estimates it is used with.

### Fittings
Bends, tees, valves and reducers add losses, counted as an **equivalent length** of straight pipe ([[hydraulics:equivalent-length]]): roughly 30–40 diameters for a standard elbow, 60 for a tee into its branch, 20 for a tee straight through, 3–10 for a full-bore ball valve. In a factory main the fittings typically add a third to a half to the straight length.

### Where the bar goes
| Item | Typical drop |
|---|---|
| Aftercooler and separator | 0.1–0.2 bar |
| Refrigerated dryer | 0.2–0.3 bar |
| Each filter, clean → due for change | 0.1 → 0.35 bar and more |
| Mains, compressor room to far drop | ≤ 0.1 bar (design target) |
| Drop and service unit | 0.2–0.4 bar |
| Hose, quick couplings, push-in fittings | 0.2–1 bar |

> [!key] The drop grows with the square of the flow and the fifth power of 1/D. A pipe one size too small costs every hour of every year; one size too big costs once.

> [!tip] Measure drops at full load, with two calibrated gauges or one moved from point to point. At light load every network looks fine.
`,
  ideas: [
    'Darcy–Weisbach applies to air with the density at line pressure, ρ = p/(R T).',
    'Δp ∝ Q² L/(D⁵ p): the square of the flow, the fifth power of one over the bore, one over the absolute pressure.',
    'The Reynolds number depends on mass flow and bore, not on the pressure; compressed-air flow is nearly always turbulent.',
    'The empirical formula Δp = 1.6×10³ Q^1.85 L/(d⁵ p) (SI) is a quick check within 10–20 %.',
    'Fittings add equivalent length; filters, dryers, hoses and couplings often lose more than the mains.'
  ],
  pitfalls: [
    'Raising the pressure increases the drop, since more air is pushed through — For the same free-air flow a higher pressure means denser, slower air and a smaller drop.',
    'A slightly smaller pipe loses slightly more — The drop goes as 1/D⁵: 20 % less bore is three times the loss.',
    'Air is compressible, so pipe-friction laws for water do not apply — Darcy–Weisbach holds for air; only the density must be taken at the line pressure (and for large drops integrated along the pipe).'
  ],
  formulas: [
    {
      name: 'Pressure drop along an air pipe (Darcy–Weisbach)',
      expr: 'dp = 8*f*L*rhoN^2*Rair*T*Q^2/(pi^2*D^5*p)', tex: '\\Delta p = \\dfrac{8 f L\\,\\rho_n^2 R_\\text{air} T\\,Q_n^2}{\\pi^2 D^5\\,p}',
      vars: {
        dp: { name: 'pressure drop', q: 'pressure', unit: 'bar', tex: '\\Delta p' },
        f: { name: 'Darcy friction factor', value: 0.02, tex: 'f' },
        L: { name: 'pipe length (with fittings as equivalent length)', q: 'length', unit: 'm', value: 100 },
        rhoN: { name: 'density of free air (ANR: 20 °C, 100 kPa)', q: 'density', unit: 'kg/m³', value: 1.185, fixed: true, tex: '\\rho_n' },
        Rair: { const: 'Rair' },
        T: { name: 'air temperature', q: 'temperature', unit: '°C', value: 20 },
        Q: { name: 'free-air flow', q: 'airflow', unit: 'm³/min ANR', value: 5, tex: 'Q_n' },
        D: { name: 'inner diameter', q: 'length', unit: 'mm', value: 40 },
        p: { name: 'line pressure (absolute)', q: 'pressure', unit: 'bar', value: 8 }
      },
      note: 'Isothermal flow with the density at line pressure; accurate while Δp is under about a tenth of p (use the mean pressure). The friction factor comes from the Colebrook equation: 0.018–0.025 for most pipes.',
      practice: { unknowns: ['dp', 'D', 'Q'] },
      stories: { dp: 'A main of {D} bore and {L} carries {Q} at {p} and {T}, friction factor {f}. What is the pressure drop?', D: 'A main {L} long must carry {Q} at {p} losing no more than {dp} (friction factor {f}, {T}). What bore does it need?', Q: 'A {D} main {L} long at {p} may lose {dp} ({f}, {T}). How much free air can it carry?' }
    },
    {
      name: 'Velocity of the air in a pipe',
      expr: 'V = 4*Q*pn/(pi*D^2*p)', tex: 'V = \\dfrac{4\\,Q_n\\,p_n}{\\pi D^2\\,p}',
      vars: {
        V: { name: 'mean velocity in the pipe', q: 'speed', unit: 'm/s' },
        Q: { name: 'free-air flow', q: 'airflow', unit: 'm³/min ANR', value: 10, tex: 'Q_n' },
        pn: { name: 'reference pressure of free air (ANR)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_n' },
        D: { name: 'inner diameter', q: 'length', unit: 'mm', value: 65 },
        p: { name: 'line pressure (absolute)', q: 'pressure', unit: 'bar', value: 8.013 }
      },
      note: 'At 20 °C; warmer air is a little less dense and moves a little faster. Mains are sized for 6–10 m/s.',
      practice: { unknowns: ['V', 'D'] },
      stories: { V: 'A pipe of {D} bore carries {Q} of free air at {p}. How fast does the air move?', D: 'Air at {p} is to move at {V} while carrying {Q}. What bore is needed?' }
    },
    {
      name: 'Reynolds number of air in a pipe',
      expr: 'Re = 4*rhoN*Q/(pi*D*mu)', tex: '\\mathrm{Re} = \\dfrac{4\\,\\rho_n Q_n}{\\pi D\\,\\mu}',
      vars: {
        Re: { name: 'Reynolds number', tex: '\\mathrm{Re}' },
        rhoN: { name: 'density of free air (ANR)', q: 'density', unit: 'kg/m³', value: 1.185, fixed: true, tex: '\\rho_n' },
        Q: { name: 'free-air flow', q: 'airflow', unit: 'm³/min ANR', value: 5, tex: 'Q_n' },
        D: { name: 'inner diameter', q: 'length', unit: 'mm', value: 40 },
        mu: { name: 'dynamic viscosity of air', q: 'viscosity', unit: 'Pa·s', value: 1.81e-5, tex: '\\mu' }
      },
      note: 'ρn·Qn is the mass flow, so the line pressure drops out. Above about 4000 the flow is turbulent.',
      stories: { Re: 'What is the Reynolds number of {Q} of free air in a pipe of {D} bore?' }
    },
    {
      name: 'Empirical pressure-drop formula (SI)',
      expr: 'dp = 1600*Q^1.85*L/(d^5*p)', tex: '\\Delta p = 1.6\\times10^{3}\\,\\dfrac{Q^{1.85}\\,L}{d^{5}\\,p}',
      vars: {
        dp: { name: 'pressure drop', q: false, unit: 'Pa', tex: '\\Delta p' },
        Q: { name: 'free-air flow', q: false, unit: 'm³/s', value: 0.1 },
        L: { name: 'pipe length (with fittings)', q: false, unit: 'm', value: 200 },
        d: { name: 'inner diameter', q: false, unit: 'm', value: 0.065 },
        p: { name: 'initial line pressure (absolute)', q: false, unit: 'Pa', value: 800000 }
      },
      note: 'Fitted to tests on steel pipe; the units are fixed: Δp and p in Pa (p absolute), Q in m³/s of free air, L and d in m. In bar, L/s and mm the coefficient is about 450.',
      practice: { unknowns: ['dp', 'd'] },
      stories: { dp: 'A pipe of {d} bore and {L} carries {Q} of free air, starting at {p} absolute. What is the drop?', d: 'A main {L} long must carry {Q} of free air from {p} absolute with a drop of no more than {dp}. What bore?' }
    }
  ],
  examples: [
    {
      title: 'The drop in a factory main',
      q: 'A DN 50 steel main (53.1 mm bore, roughness 0.05 mm) runs 150 m with fittings adding 30 %. It carries 6 m³/min of free air at 7 bar gauge and 20 °C. Find the velocity, Reynolds number, friction factor and pressure drop.',
      steps: [
        'Length with fittings: $1.3 \\times 150 = 195$ m. Absolute pressure 8.013 bar; $Q_n = 0.1$ m³/s.',
        'Velocity: $V = 4 \\times 0.1 \\times 10^5/(\\pi \\times 0.0531^2 \\times 8.013\\times10^5) = 5.6$ m/s — comfortably in the 6–10 m/s band or below.',
        '$\\mathrm{Re} = 4 \\times 1.185 \\times 0.1/(\\pi \\times 0.0531 \\times 1.81\\times10^{-5}) = 1.57\\times10^5$; with $\\varepsilon/D = 0.00094$, Colebrook gives $f = 0.021$.',
        '$\\Delta p = 8 \\times 0.021 \\times 195 \\times 1.185^2 \\times 287 \\times 293 \\times 0.1^2/(\\pi^2 \\times 0.0531^5 \\times 7.95\\times10^5) = 1.18\\times10^4$ Pa.',
        'The empirical formula gives $1600 \\times 0.1^{1.85} \\times 195/(0.0531^5 \\times 8.0\\times10^5) = 1.3\\times10^4$ Pa.'
      ],
      a: 'V ≈ 5.6 m/s, Re ≈ 157 000, f ≈ 0.021, Δp ≈ 0.12 bar (0.13 bar by the empirical formula) — just over the 0.1 bar target.'
    },
    {
      title: 'One size smaller',
      q: 'The same main is built in DN 40 (41.9 mm bore) to save money. What happens to the drop and the velocity?',
      steps: [
        'Bore ratio $53.1/41.9 = 1.267$; $1.267^5 = 3.27$, and the friction factor rises slightly (0.022).',
        'Drop: about 0.40 bar instead of 0.12 — over three times.',
        'Velocity: $5.6 \\times 1.267^2 = 9.0$ m/s.',
        'The compressor must run about 0.3 bar higher to deliver the same pressure at the far end: roughly 2 % more energy for the whole plant, every year.'
      ],
      a: 'About 0.40 bar and 9 m/s — a saving on pipe paid for many times over in electricity.'
    }
  ],
  quiz: [
    { q: 'The free-air flow through a main doubles. The pressure drop becomes about…', choices: ['twice', 'three and a half to four times', 'eight times', 'the same'], a: 1,
      why: 'Δp ∝ f Q²; f falls a little as the flow rises, so the drop grows by about 3.6–4.' },
    { q: 'A main is replaced by one with half the bore (same flow, same length). The drop grows by about…', choices: ['2×', '4×', '16×', '32×'], a: 3,
      why: 'Δp ∝ 1/D⁵ for a given flow: 2⁵ = 32.' },
    { q: 'For the same free-air flow in the same pipe, a higher line pressure gives a smaller pressure drop.', a: true,
      why: 'Denser air occupies less volume and moves more slowly; Δp ∝ 1/p.' },
    { q: 'Raising the line pressure raises the Reynolds number of the flow.', a: false,
      why: 'Re = 4ρₙQₙ/(πDμ) depends on the mass flow and the bore only; the pressure cancels out.' },
    { q: 'Which usually loses the most pressure between the compressor and a hand tool?', choices: ['the ring main', 'the hose, couplings and service unit together', 'the drop pipe', 'the pipe bends'], a: 1,
      why: 'A well-designed main loses about 0.1 bar; service units, hoses and quick couplings together often lose 0.5–1 bar.' }
  ],
  problems: [
    { q: 'How fast does 10 m³/min of free air move in a 65 mm bore main at 7 bar gauge (20 °C)?', answer: 6.27, unit: 'm/s', tol: 0.02,
      steps: ['$Q_n = 0.1667$ m³/s; absolute pressure 8.013 bar.', '$V = 4 \\times 0.1667 \\times 10^5/(\\pi \\times 0.065^2 \\times 8.013\\times10^5) = 6.27$ m/s.'] },
    { q: 'Use the empirical formula to find the drop in 100 m of 40 mm bore pipe carrying 3 m³/min of free air from 7.0 bar absolute. Give it in bar.', answer: 0.0875, unit: 'bar', tol: 0.03,
      steps: ['$Q = 0.05$ m³/s, $Q^{1.85} = 3.92\\times10^{-3}$; $d^5 = 1.024\\times10^{-7}$ m⁵.', '$\\Delta p = 1600 \\times 3.92\\times10^{-3} \\times 100/(1.024\\times10^{-7} \\times 7\\times10^5) = 8750$ Pa = 0.0875 bar.'] }
  ],
  applications: ['Designing and checking factory mains and ring layouts.', 'Tracing why tools at the far end of a line are weak.', 'Long temporary lines on building sites, quarries and tunnels.', 'Estimating the energy cost of an undersized pipe.'],
  history: 'The pipe-friction law came from water: Julius Weisbach wrote it in its modern form in 1845 and Henry Darcy measured the effect of roughness in the 1850s. Engineers building compressed-air mains for mines, the Alpine tunnels and city networks in the late nineteenth century fitted their own formulas to tests — the ancestors of the one-line formula still printed in compressed-air handbooks.',
  sim: ['dist-pipe-sizing', 'dist-ring-main']
},

{
  id: 'pipe-sizing-air', parent: 'air-networks', title: 'Sizing air pipes', level: 2,
  short: 'Choosing the bore of a compressed-air pipe: large enough that the drop from the compressor room to the furthest point stays within about 0.1 bar and the air moves at 6–10 m/s in the mains — then a size up for growth, because pipe is paid for once and pressure every hour.',
  keywords: ['pipe sizing', 'bore selection', 'allowed pressure drop', 'velocity limit', 'main size', 'diversity factor', 'simultaneity', 'equivalent length', 'economic pipe size', 'future growth', 'DN'],
  prereq: ['pressure-drop-air', 'piping-layout', 'standard-air'],
  related: ['drops-drains', 'tubing-fittings', 'consumption-budget', 'air-consumption', 'pressure-optimisation', 'cost-of-compressed-air', 'hydraulics:pipe-sizing', 'hydraulics:line-sizing'],
  body: `
A compressed-air pipe is sized by two tests, and the larger bore wins. The **pressure-drop test**: the pipework from the compressor room to the furthest drop should lose no more than about 0.1 bar at full flow (a typical target; some designers allow a few per cent of the working pressure). The **velocity test**: air in the mains should move at about **6–10 m/s**; drops and short branches can take up to about 15 m/s. Slow air loses little pressure, is quiet, and leaves condensate lying where the drains can collect it.

### A procedure
1. **Flow.** Add up the free-air demand of the users on the pipe ([[consumption-budget]]), times a *diversity factor* for the share running at once, plus leaks, plus a reserve for growth — plants grow, and pipes stay.
2. **Length.** The route length plus the equivalent length of bends, tees and valves; in a ring, size as though the whole flow went half-way round.
3. **Allowed drop and pressure.** Typically 0.1 bar, at the lowest absolute pressure the pipe will run at.
4. **Bore.** From the empirical formula or Darcy–Weisbach ([[pressure-drop-air]]), rounded up to the next real bore; then check the velocity.
5. **Economics.** Compare the cost of the next size up with the energy the extra drop would cost every year.

### What a bore carries
For 100 m of steel pipe at 7 bar gauge:

| Inner diameter | Flow for 0.1 bar per 100 m | Velocity then | Flow at 6–10 m/s |
|---|---|---|---|
| 20 mm | 0.58 m³/min | 3.9 m/s | 0.9–1.5 m³/min |
| 25 mm | 1.06 m³/min | 4.5 m/s | 1.4–2.4 m³/min |
| 32 mm | 2.0 m³/min | 5.3 m/s | 2.3–3.9 m³/min |
| 40 mm | 3.7 m³/min | 6.1 m/s | 3.6–6.0 m³/min |
| 50 mm | 6.7 m³/min | 7.0 m/s | 5.7–9.4 m³/min |
| 65 mm | 13 m³/min | 8.3 m/s | 9.6–16 m³/min |
| 80 mm | 23 m³/min | 9.5 m/s | 14–24 m³/min |
| 100 mm | 41 m³/min | 11 m/s | 23–38 m³/min |

For small bores the pressure drop decides; for big ones the velocity does. For a longer or shorter pipe, scale the allowed flow as $L^{-1/1.85}$: twice the length carries about 69 % of the flow for the same drop.

### Small changes, big consequences
Because $\\Delta p \\propto Q^{1.85}/d^5$, the bore needed grows only as $Q^{0.37}$: 10 % more air needs just 4 % more bore — and a bore that is 10 % too small loses 60 % more pressure. Between standard sizes the drop changes by a factor of 2–3.

### The cost of a drop
The compressor must make up every bar lost on the way, at about 7 % more energy per bar (see [[pressure-optimisation]]). A 90 kW plant running 6000 hours a year at ¤0.15 per kWh pays about ¤1,700 a year for each 0.3 bar of unnecessary drop — every year, for as long as the pipe is there. The difference in price between one pipe size and the next is usually recovered within a year or two. When in doubt, go one size up.

> [!tip] Pipe is cheap and pressure is not. Size mains for the plant as it will be in ten years, and keep the velocity low enough for condensate to reach the drains.

> [!warn] Every part of the network — pipe, fittings, valves, hoses — must be rated for the highest pressure the compressors (or a booster) can reach, not only the working pressure.
`,
  ideas: [
    'Two tests: the drop from compressor to furthest point about 0.1 bar or less, and 6–10 m/s in the mains.',
    'Flow = demand × diversity + leaks + a reserve for growth; length = route + equivalent length of fittings.',
    'The bore needed grows only as Q^0.37, but a bore 10 % too small loses 60 % more pressure.',
    'Small pipes are limited by pressure drop, large ones by velocity.',
    'Every extra bar of drop costs about 7 % more compressor energy, all year: size generously.'
  ],
  pitfalls: [
    'Size the main for today\'s demand — Plants add machines; replacing a main is far dearer than a size up at the start.',
    'If the drop is within budget the velocity does not matter — Fast air drags condensate past the drains and is noisy; keep mains at 6–10 m/s.',
    'The mean flow is enough to size a pipe — Pipes must carry the peaks that last longer than a receiver can cover; use the demand with its diversity factor, not the daily average.'
  ],
  formulas: [
    {
      name: 'Bore for a velocity',
      expr: 'D = sqrt(4*Q*pn/(pi*V*p))', tex: 'D = \\sqrt{\\dfrac{4\\,Q_n\\,p_n}{\\pi V\\,p}}',
      vars: {
        D: { name: 'inner diameter', q: 'length', unit: 'mm' },
        Q: { name: 'free-air flow', q: 'airflow', unit: 'm³/min ANR', value: 10, tex: 'Q_n' },
        pn: { name: 'reference pressure of free air (ANR)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_n' },
        V: { name: 'velocity in the pipe', q: 'speed', unit: 'm/s', value: 8 },
        p: { name: 'line pressure (absolute)', q: 'pressure', unit: 'bar', value: 8 }
      },
      note: 'At 20 °C. Round up to the next real bore and check the pressure drop too.',
      practice: { unknowns: ['D', 'Q'] },
      stories: { D: 'A main must carry {Q} of free air at {p} with the air moving at {V}. What bore does it need?', Q: 'A main of {D} bore at {p} should keep the air below {V}. How much free air can it carry?' }
    },
    {
      name: 'Bore for an allowed drop (empirical, SI)',
      expr: 'd = (1600*Q^1.85*L/(dp*p))^(1/5)', tex: 'd = \\left(\\dfrac{1.6\\times10^{3}\\,Q^{1.85}\\,L}{\\Delta p\\;p}\\right)^{1/5}',
      vars: {
        d: { name: 'inner diameter', q: false, unit: 'm' },
        Q: { name: 'free-air flow', q: false, unit: 'm³/s', value: 0.1667 },
        L: { name: 'pipe length (with fittings)', q: false, unit: 'm', value: 300 },
        dp: { name: 'allowed pressure drop', q: false, unit: 'Pa', value: 10000, tex: '\\Delta p' },
        p: { name: 'line pressure (absolute)', q: false, unit: 'Pa', value: 800000 }
      },
      note: 'The empirical pipe formula solved for the bore; SI units as given (0.1 bar = 10 000 Pa, 7 bar gauge ≈ 800 000 Pa absolute).',
      practice: { unknowns: ['d', 'Q'] },
      stories: { d: 'A pipe {L} long must carry {Q} of free air at {p} absolute, losing no more than {dp}. What bore does it need?' }
    },
    {
      name: 'Yearly cost of a pressure drop',
      expr: 'C = k*dp*P*t*c', tex: 'C = k\\,\\Delta p\\,P\\,t\\,c_e',
      vars: {
        C: { name: 'cost per year', q: 'money', unit: '$' },
        k: { name: 'extra compressor energy per bar (≈ 0.07)', q: false, unit: '1/bar', value: 0.07 },
        dp: { name: 'pressure drop the compressor must make up', q: false, unit: 'bar', value: 0.3, tex: '\\Delta p' },
        P: { name: 'compressor electrical power', q: false, unit: 'kW', value: 90 },
        t: { name: 'running hours per year', q: false, unit: 'h', value: 6000 },
        c: { name: 'electricity price per kWh', q: 'money', unit: '$', value: 0.15, tex: 'c_e' }
      },
      note: 'A rule of thumb: about 7 % more energy per bar near 7 bar (6–8 % depending on the compressor; see [[pressure-optimisation]]).',
      stories: { C: 'A plant\'s compressors draw {P} for {t} a year at {c} per kWh. What does an extra drop of {dp} in the pipework cost each year?' }
    }
  ],
  examples: [
    {
      title: 'Sizing a ring main',
      q: 'A hall needs 10 m³/min of free air at peak. Its ring main is 300 m round and the fittings add 40 %; the line runs at 7 bar gauge and may lose 0.1 bar. Which bore?',
      steps: [
        'Size as if the whole flow went half-way round: $L = 150 \\times 1.4 = 210$ m. $Q = 0.1667$ m³/s; $p = 8.0\\times10^5$ Pa absolute.',
        '$d = (1600 \\times 0.1667^{1.85} \\times 210/(10^4 \\times 8.0\\times10^5))^{1/5} = 0.0686$ m = 68.6 mm.',
        'DN 65 steel (68.9 mm bore) just meets it: Darcy–Weisbach gives 0.090 bar at 5.6 m/s.',
        'With growth in mind, DN 80 (80.9 mm) halves the drop to 0.04 bar at 4.0 m/s.'
      ],
      a: 'DN 65 is the minimum; DN 80 leaves room for the plant to grow.'
    },
    {
      title: 'What a size too small costs',
      q: 'An undersized main loses 0.4 bar instead of 0.1. The 90 kW compressors run 6000 h a year and electricity costs ¤0.15 per kWh. What does the extra 0.3 bar cost?',
      steps: [
        'Extra power: $0.07 \\times 0.3 \\times 90 = 1.9$ kW.',
        'A year: $1.9 \\times 6000 = 11\\,300$ kWh.',
        'Cost: $11\\,300 \\times 0.15 = 1700$.'
      ],
      a: 'About ¤1,700 a year, for the life of the pipe.'
    }
  ],
  quiz: [
    { q: 'The usual design velocity in compressed-air mains is…', choices: ['1–2 m/s', '6–10 m/s', '30–40 m/s', 'near the speed of sound'], a: 1,
      why: 'Around 6–10 m/s keeps the drop low and lets condensate settle; drops and short branches may take up to about 15 m/s.' },
    { q: 'The flow a pipe must carry grows by 10 %. The bore needed for the same drop grows by about…', choices: ['1 %', '4 %', '10 %', '21 %'], a: 1,
      why: 'd ∝ Q^(1.85/5) = Q^0.37; 1.1^0.37 = 1.036.' },
    { q: 'For a 100 mm main at 7 bar, which usually decides the size: the pressure drop or the velocity?', choices: ['the pressure drop', 'the velocity', 'neither', 'the wall thickness'], a: 1,
      why: 'Large pipes lose little pressure per metre at the velocity limit, so the velocity is reached first; small pipes hit the drop limit first.' },
    { q: 'Choosing the next bigger pipe size usually pays back within a year or two in energy.', a: true,
      why: 'A drop the compressor must make up costs about 7 % per bar all year; the price step between pipe sizes is usually small in comparison.' },
    { q: 'What bore (mm) keeps 6 m³/min of free air at 8 m/s in a line at 7 bar gauge (8.013 bar absolute)?', answer: 44.6, unit: 'mm', tol: 0.03,
      why: 'D = √(4Qₙpₙ/(πVp)) = √(4 × 0.1 × 10⁵/(π × 8 × 8.013×10⁵)) = 0.0446 m.' }
  ],
  problems: [
    { q: 'Using the empirical formula, what bore keeps the drop to 0.1 bar (10 000 Pa) for 5 m³/min of free air over 120 m of pipe at 8.0 bar absolute?', answer: 47.5, unit: 'mm', tol: 0.03,
      steps: ['$Q = 0.0833$ m³/s, $Q^{1.85} = 0.01008$.', '$d^5 = 1600 \\times 0.01008 \\times 120/(10^4 \\times 8\\times10^5) = 2.42\\times10^{-7}$ m⁵.', '$d = 0.0475$ m: choose DN 50 steel (53.1 mm bore) or larger.'] }
  ],
  applications: ['Laying out mains for a new factory hall.', 'Checking whether a plant extension can hang on the existing ring.', 'Choosing drop and branch sizes for large users such as blasting cabinets.', 'Energy audits that price undersized pipework.'],
  sim: 'dist-pipe-sizing'
},

{
  id: 'tubing-fittings', parent: 'air-networks', title: 'Tubing, fittings and couplings', level: 1,
  short: 'The last metres to the machine: polyurethane and polyamide tubing sized by outside diameter, push-in fittings, threaded ports, hoses and quick couplings — convenient, but often the largest pressure drop in the whole system.',
  keywords: ['tubing', 'polyurethane tube', 'PU', 'polyamide tube', 'PA', 'nylon tube', 'outside diameter', 'bore', 'push-in fitting', 'one-touch fitting', 'quick coupling', 'quick-connect', 'safety coupling', 'hose', 'G thread', 'NPT', 'conductance in series', 'whip check'],
  prereq: ['pressure-drop-air', 'sonic-conductance', 'standard-air'],
  related: ['conductance-series', 'tubing-length-effect', 'valve-sizing', 'frl-units', 'air-tools', 'air-leaks', 'air-saving-circuits', 'hydraulics:hoses-fittings'],
  body: `
Between the service unit and the cylinder or tool lie a few metres of tube or hose, a handful of fittings and perhaps two quick couplings. They are cheap and quick to fit — and in many machines they lose more pressure than a hundred metres of main.

### Tubing
Pneumatic tube is sold by its **outside diameter** (OD), because that is what the fitting grips: metric 4, 6, 8, 10, 12 and 16 mm; in American practice 5/32, 1/4, 5/16, 3/8 and 1/2 inch. The bore depends on the wall:

| OD | Typical bore, PU | Typical bore, PA | Volume per metre (PU) |
|---|---|---|---|
| 4 mm | 2.5 mm | 2.5–2.7 mm | 4.9 cm³ |
| 6 mm | 4 mm | 4 mm | 12.6 cm³ |
| 8 mm | 5–5.5 mm | 6 mm | 24 cm³ |
| 10 mm | 6.5–7 mm | 7.5–8 mm | 38 cm³ |
| 12 mm | 8 mm | 9–10 mm | 50 cm³ |

(Typical figures — check the maker's data.) **Polyurethane** (PU) is soft and kink-resistant, the tube for moving parts and tight bends; **polyamide** (PA, nylon) is stiffer, takes higher pressures and temperatures with a thinner wall, and makes neat fixed runs. Pressure ratings fall as the temperature rises — a PU tube good for 10 bar at 20 °C may be good for half that at 60 °C.

### Fittings and threads
**Push-in fittings** grip the tube with a toothed collet and seal on its outside with an O-ring: cut the tube square with a proper cutter, push it fully home, pull back to seat the collet; press the collet to release. Ports are threaded **G** (parallel, sealed by a washer or O-ring), **R** (taper), **NPT** (the American taper) or M5 for miniature valves. Damaged tube ends, tubes pulling sideways on a fitting and worn collets are among the commonest leaks in any plant (see [[air-leaks]]).

### Quick couplings
A self-sealing coupling closes a valve in the socket when the plug is pulled out, so hoses can be moved between drops. That valve, and the narrow bore of the plug, make it a strong restriction: the common 1/4-inch sizes have a sonic conductance of roughly 2–4 dm³/(s·bar), and a single coupling can lose 0.2–0.4 bar at the flow of a grinder. Several incompatible plug profiles are in use around the world; a plug that seems to fit a foreign socket may blow out under pressure.

### The chain adds up
Restrictions in series combine roughly as

$$\\frac{1}{C^2} = \\frac{1}{C_1^2} + \\frac{1}{C_2^2} + \\cdots$$

(exact for elements with $b = 0$, a good approximation otherwise; see [[conductance-series]]). Two equal couplings pass only $1/\\sqrt2 \\approx 71$ % of the flow of one at the same total drop, and the weakest element dominates. A tool on a hose with two standard couplings and a service unit can receive a bar less than the drop pressure — and an air tool's output falls faster than its pressure. **High-flow couplings**, a hose one size larger and fewer joints often do more for a weak tool than raising the plant pressure.

### Tubes are filled every stroke
The tube between a valve and a cylinder is filled to the supply pressure and exhausted on every stroke: its free air per fill is $V_\\text{tube}\\,p_g/p_n$ (it starts at atmospheric pressure). For small cylinders this can be more air than the cylinder itself (see [[tubing-length-effect]]) — another reason to mount valves close to their cylinders.

> [!warn] A hose disconnected under pressure can whip violently. Close the supply and vent the hose before uncoupling — safety couplings do this in two stages — and restrain large hoses at their connections. Never point a hose or blow gun at a person or use it to clean skin or clothes; blow guns for cleaning should be of a type that limits the pressure if the nozzle is blocked (in the US, below 30 psi, about 2 bar, under the OSHA rules).
`,
  ideas: [
    'Tube is sized by outside diameter; the bore depends on the material and wall (PU thicker, PA thinner).',
    'PU for flexible, moving connections; PA for stiffer, higher-pressure runs.',
    'Quick couplings are strong restrictions: C ≈ 2–4 dm³/(s·bar) for common 1/4-inch sizes.',
    'Restrictions in series combine roughly as 1/C² = Σ 1/Cᵢ²; the weakest element dominates.',
    'The tube to a cylinder is filled and emptied every stroke: free air V·p_g/p_n per fill.'
  ],
  pitfalls: [
    'An 8 mm tube has an 8 mm bore — Tube is named by its outside diameter; an 8 mm PU tube has a bore of 5–5.5 mm, less than half the cross-section.',
    'Any quick coupling plug that fits will do — Profiles differ worldwide; a mismatched plug may seal poorly or blow out under pressure.',
    'Low pressure at a tool means the plant pressure is too low — More often the hose, couplings and fittings are too restrictive; fix the chain before raising the plant pressure.'
  ],
  formulas: [
    {
      name: 'Flow through a restriction below choking (ISO 6358)',
      expr: 'Q = C*p1*sqrt(1 - ((p2/p1 - b)/(1 - b))^2)', tex: 'Q_n = C\\,p_1\\sqrt{1 - \\left(\\dfrac{p_2/p_1 - b}{1 - b}\\right)^2}',
      vars: {
        Q: { name: 'free-air flow', q: 'airflow', unit: 'L/min ANR', tex: 'Q_n' },
        C: { name: 'sonic conductance', q: 'flowcond', unit: 'dm³/(s·bar)', value: 3.5 },
        p1: { name: 'upstream pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.3, tex: 'p_1' },
        p2: { name: 'downstream pressure (absolute)', q: 'pressure', unit: 'bar', value: 7.0, tex: 'p_2' },
        b: { name: 'critical pressure ratio', value: 0.3, min: 0.05, max: 0.6, tex: 'b' }
      },
      note: 'ISO 6358-1:2013 characteristic for p₂/p₁ above b (subsonic), air at 20 °C. Below b the flow is choked at Q = C·p₁. Quick couplings: C ≈ 2–4 dm³/(s·bar); high-flow types 5–7.',
      practice: { unknowns: ['Q', 'p2', 'C'] },
      stories: { Q: 'A coupling with {C} and b = {b} sits between {p1} and {p2}. What flow passes?', p2: 'A tool draws {Q} through a coupling ({C}, b = {b}) fed at {p1}. What pressure reaches the tool side?', C: 'A fitting must pass {Q} from {p1} with no more than a fall to {p2} (b = {b}). What sonic conductance does it need?' }
    },
    {
      name: 'Restrictions in series',
      expr: 'C = 1/sqrt(1/C1^2 + 1/C2^2 + 1/C3^2)', tex: 'C = \\dfrac{1}{\\sqrt{\\dfrac{1}{C_1^2} + \\dfrac{1}{C_2^2} + \\dfrac{1}{C_3^2}}}',
      vars: {
        C: { name: 'sonic conductance of the chain', q: 'flowcond', unit: 'dm³/(s·bar)' },
        C1: { name: 'first element (e.g. service unit)', q: 'flowcond', unit: 'dm³/(s·bar)', value: 5, tex: 'C_1' },
        C2: { name: 'second element (e.g. coupling)', q: 'flowcond', unit: 'dm³/(s·bar)', value: 3.5, tex: 'C_2' },
        C3: { name: 'third element (e.g. coupling)', q: 'flowcond', unit: 'dm³/(s·bar)', value: 3.5, tex: 'C_3' }
      },
      note: 'Exact for elements with b = 0 (then Q = C√(p₁² − p₂²) for each), a useful approximation for real components.',
      stories: { C: 'A service unit ({C1}) feeds a hose with two couplings ({C2} and {C3}). What is the sonic conductance of the chain?', C3: 'A chain of {C1} and {C2} must keep an overall conductance of {C}. What must the third element have?' }
    },
    {
      name: 'Free air to fill a tube',
      expr: 'V = pi*d^2/4*L*p/pn', tex: 'V = \\dfrac{\\pi d^2}{4}\\,L\\,\\dfrac{p_g}{p_n}',
      vars: {
        V: { name: 'free air per fill', q: 'volume', unit: 'L' },
        d: { name: 'tube bore', q: 'length', unit: 'mm', value: 4 },
        L: { name: 'tube length', q: 'length', unit: 'm', value: 2 },
        p: { name: 'supply pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        pn: { name: 'reference pressure of free air (ANR)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_n' }
      },
      note: 'The tube starts at atmospheric pressure after exhausting, so it takes its volume times the gauge pressure. Count both tubes of a double-acting cylinder, once per cycle each.',
      practice: { unknowns: ['V', 'L'] },
      stories: { V: 'A {L} tube of {d} bore is filled to {p} and exhausted every stroke. How much free air does each fill take?' }
    }
  ],
  examples: [
    {
      title: 'The tool at the end of the hose',
      q: 'A grinder draws 500 L/min of free air. It is fed from a drop at 6.3 bar gauge (7.31 bar absolute) through a service unit ($C = 5$) and a hose with two standard couplings ($C = 3.5$ each), all with $b \\approx 0.3$. Ignoring the hose itself, what pressure reaches the grinder? What if high-flow couplings ($C = 6$) are fitted?',
      steps: [
        'Chain: $C = 1/\\sqrt{1/5^2 + 2/3.5^2} = 2.22$ dm³/(s·bar).',
        '$Q/(C p_1) = (500/60)/(2.22 \\times 7.31) = 0.514$; $\\sqrt{1 - 0.514^2} = 0.858$.',
        '$p_2/p_1 = 0.3 + 0.7 \\times 0.858 = 0.901$: $p_2 = 6.59$ bar absolute = 5.6 bar gauge — 0.7 bar lost.',
        'High-flow couplings: $C = 1/\\sqrt{1/25 + 2/36} = 3.23$; the same steps give $p_2 = 6.98$ bar absolute = 6.0 bar gauge.'
      ],
      a: 'About 5.6 bar gauge at the grinder with standard couplings, 6.0 bar with high-flow ones — the couplings cost more than half a bar.'
    },
    {
      title: 'Tubes that use more air than the cylinder',
      q: 'A 16 mm cylinder (6 mm rod, 50 mm stroke) works at 6 bar gauge with 3 m of 6/4 PU tube to each port. Compare the free air for the cylinder and for the tubes per cycle.',
      steps: [
        'Cylinder: $(2.01 + 1.73)\\,\\mathrm{cm^2} \\times 5\\,\\mathrm{cm} \\times 7.01 = 131$ cm³ = 0.13 L.',
        'Each tube: $\\pi \\times 0.4^2/4 \\times 300\\,\\mathrm{cm} \\times 6 = 226$ cm³; both: 0.45 L.',
        'The tubes take 3.5 times the cylinder\'s air. With the valve mounted 0.5 m away they would take 0.075 L.'
      ],
      a: '0.13 L for the cylinder, 0.45 L for the tubes — shorten the tubes.'
    }
  ],
  quiz: [
    { q: 'A "6 mm" pneumatic tube is 6 mm…', choices: ['bore', 'outside diameter', 'wall thickness', 'bend radius'], a: 1,
      why: 'Tube is named by its outside diameter, which the push-in fitting grips; a 6 mm tube has a 4 mm bore.' },
    { q: 'Which tube suits a connection to a moving robot tool with tight bends?', choices: ['polyamide', 'polyurethane', 'copper', 'steel'], a: 1,
      why: 'PU is soft, flexible and kink-resistant; PA is stiffer and suits fixed runs at higher pressures.' },
    { q: 'Two identical couplings are fitted in series. Compared with one, the chain\'s sonic conductance is about…', choices: ['the same', '71 %', '50 %', '25 %'], a: 1,
      why: '1/C² = 2/C₁², so C = C₁/√2 ≈ 0.71 C₁.' },
    { q: 'It is safe to pull a hose off a quick coupling under pressure, because the socket closes.', a: false,
      why: 'The socket closes, but the hose side is still pressurised and can whip; vent it first or use a safety coupling that does so.' },
    { q: 'How much free air (L) fills 2 m of tube of 4 mm bore, from atmospheric to 6 bar gauge?', answer: 0.151, unit: 'L', tol: 0.03,
      why: 'π × 0.004²/4 × 2 = 2.51×10⁻⁵ m³, times 6 bar/1 bar = 1.51×10⁻⁴ m³ = 0.151 L.' }
  ],
  problems: [
    { q: 'A coupling with C = 3.0 dm³/(s·bar) and b = 0.3 is fed at 7.0 bar absolute and passes 400 L/min of free air. What is the pressure after it (bar absolute)?', answer: 6.75, unit: 'bar', tol: 0.02,
      steps: ['$Q = 6.67$ dm³/s; $Q/(Cp_1) = 6.67/21 = 0.317$; $\\sqrt{1 - 0.317^2} = 0.948$.', '$p_2 = 7.0 \\times (0.3 + 0.7 \\times 0.948) = 6.75$ bar absolute (about 0.25–0.3 bar lost).'] }
  ],
  applications: ['Connecting valves, cylinders and sensors on machines.', 'Hoses and couplings for hand tools at workshop drops.', 'Robot dress packs with flexible PU tube.', 'Upgrading couplings and hoses to cure weak tools.'],
  sim: 'dist-fittings-chain'
},

{
  id: 'pressure-boosters', parent: 'air-networks', title: 'Pressure boosters', level: 2,
  short: 'A booster raises the pressure for one machine — typically to twice the line pressure — so the whole network need not run higher. Air-driven boosters need no electricity and stop when they reach pressure, but they consume at least as much air again as they deliver.',
  keywords: ['pressure booster', 'pressure intensifier', 'air amplifier', '2:1 booster', 'booster regulator', 'booster compressor', 'high pressure', 'stall pressure', 'receiver', 'area ratio'],
  prereq: ['absolute-gauge-pressure', 'cylinder-force', 'receivers'],
  related: ['pressure-optimisation', 'artificial-demand', 'piping-layout', 'receiver-sizing', 'pressure-equipment', 'hydraulics:intensifiers', 'pneumatic-cylinder'],
  body: `
One press needs 9 bar; the rest of the plant runs happily at 6.5. Raising the whole network by 2.5 bar would cost nearly a fifth more compressor energy, and every leak and open blow-off would pass about a third more air (see [[artificial-demand]]). A **booster** at that one machine raises the pressure where it is needed, and only there.

### First, other answers
Before boosting, ask why the machine needs the pressure. Most often it is a cylinder force: since $F = p_g A$, a bore one size up gives 50–60 % more force at the same pressure (see [[cylinder-force]]). A tool starved by a restrictive hose may only need better couplings (see [[tubing-fittings]]). If a large flow is needed at high pressure, a small dedicated compressor may be best. A booster suits a small share of the air, needed at up to about twice the line pressure.

### How an air-driven booster works
Two pistons sit on a common rod. Each end of the booster has a **drive chamber** and a **boost chamber**. Inlet air fills both boost chambers through non-return valves. On each stroke, the drive air behind one piston, helped by the inlet air in the boost chamber on the same side, squeezes the air in the opposite boost chamber until it opens the outlet non-return valve. A changeover valve reverses the drive at each end, so the booster cycles by itself as long as air is drawn, and slows as the outlet pressure approaches its limit. The force balance on the pistons (drive area $A_d$, boost area $A_b$, pressures in absolute) gives, in gauge terms,

$$p_{2} = p_{1}\\left(1 + \\frac{A_d}{A_b}\\right)$$

With equal areas this is the common **2:1** booster: 6 bar in, up to 12 bar out. Models with larger drive pistons reach 3:1 or 4:1. At that **stall pressure** the pistons stop and the booster uses no air until the outlet pressure falls.

### What it costs in air
Per stroke the booster fills a boost chamber with inlet air — which it delivers — and a drive chamber with inlet air — which it exhausts. Ideally

$$Q_\\text{in} = Q_\\text{out}\\left(1 + \\frac{A_d}{A_b}\\right)$$

so a 2:1 booster takes twice the free air it delivers; with dead volumes and friction real ones take about 2.5–3 times. Its output flow is highest at low outlet pressure and falls to zero at stall, so a **receiver** on the outlet stores boosted air for peaks and lets the booster refill between them.

### Electric booster compressors
For higher pressures — such as the roughly 40 bar used to blow PET bottles — piston compressors take air already compressed to 7 bar and raise it further. They use electricity instead of drive air and are the choice for large flows.

### Booster or higher network?
| Option | Suits | Drawback |
|---|---|---|
| Bigger cylinder at the machine | a force problem | more free air per stroke |
| Air-driven booster | small flow, up to 2–4× line pressure | drive air: 1.5–2× the delivered air extra |
| Booster compressor or separate high-pressure compressor | larger flows, much higher pressures | cost, maintenance, electricity |
| Raise the whole network | many users needing more | ~7 % energy per bar on everything, more leakage |

> [!warn] Everything downstream of a booster — receiver, hoses, fittings, the machine — must be rated for the booster's stall pressure, which follows the inlet pressure: a 2:1 booster on a line that rises to 8 bar can reach 16 bar. Fit a relief valve on the outlet receiver, exhaust both sides before maintenance, and silence the drive exhaust.
`,
  ideas: [
    'A booster raises the pressure for one machine instead of raising the whole plant.',
    'Stall (maximum) outlet pressure, gauge: p₂ = p₁(1 + A_d/A_b) — 2:1 with equal areas.',
    'Ideally a 2:1 booster takes twice the free air it delivers; real ones 2.5–3 times.',
    'At stall it stops and uses no air; a receiver on the outlet covers demand peaks.',
    'Often a larger cylinder or better couplings solve the problem without any booster.'
  ],
  pitfalls: [
    'A booster makes compressed air — It only raises the pressure of air it takes from the network, and spends drive air doing so; the plant compressors still make all of it.',
    'The outlet of a 2:1 booster on a 6 bar line never exceeds 12 bar — The stall pressure follows the inlet: if the line rises, so does the outlet. Rate the downstream parts for the highest possible value.',
    'Raising the plant pressure is simpler and costs the same — It raises compression energy and every unregulated flow in the whole plant; a booster spends energy only on the air it boosts.'
  ],
  formulas: [
    {
      name: 'Stall pressure of an air-driven booster',
      expr: 'p2 = p1*(1 + Ad/Ab)', tex: 'p_2 = p_1\\left(1 + \\dfrac{A_d}{A_b}\\right)',
      vars: {
        p2: { name: 'maximum (stall) outlet pressure (gauge)', q: 'pressure', unit: 'bar', tex: 'p_2' },
        p1: { name: 'inlet pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_1' },
        Ad: { name: 'drive piston area', q: 'area', unit: 'cm²', value: 20, tex: 'A_d' },
        Ab: { name: 'boost piston area', q: 'area', unit: 'cm²', value: 20, tex: 'A_b' }
      },
      note: 'From the force balance on the pistons with the atmosphere acting on the exhausting drive chamber; friction lowers it slightly. 1 + A_d/A_b is the booster\'s ratio.',
      stories: { p2: 'A booster with drive pistons of {Ad} and boost pistons of {Ab} is fed at {p1}. What is its stall pressure?', Ad: 'A booster with boost pistons of {Ab} must reach {p2} from {p1}. What drive-piston area is needed?' }
    },
    {
      name: 'Air a booster takes (ideal)',
      expr: 'Qin = Qout*(1 + Ad/Ab)', tex: 'Q_\\text{in} = Q_\\text{out}\\left(1 + \\dfrac{A_d}{A_b}\\right)',
      vars: {
        Qin: { name: 'free air taken from the network', q: 'airflow', unit: 'L/min ANR', tex: 'Q_\\text{in}' },
        Qout: { name: 'free air delivered at the boosted pressure', q: 'airflow', unit: 'L/min ANR', value: 150, tex: 'Q_\\text{out}' },
        Ad: { name: 'drive piston area', q: 'area', unit: 'cm²', value: 20, tex: 'A_d' },
        Ab: { name: 'boost piston area', q: 'area', unit: 'cm²', value: 20, tex: 'A_b' }
      },
      note: 'No dead volume or leakage; real boosters take about 2.5–3 times their output at 2:1.',
      stories: { Qin: 'A booster ({Ad} drive, {Ab} boost pistons) delivers {Qout}. How much free air does it take from the line, at best?' }
    },
    {
      name: 'Time to pump up a receiver',
      expr: 't = V*(p2 - p1)/(pn*Q)', tex: 't = \\dfrac{V\\,(p_2 - p_1)}{p_n\\,Q_n}',
      vars: {
        t: { name: 'time', q: 'time', unit: 's' },
        V: { name: 'receiver volume', q: 'volume', unit: 'L', value: 20 },
        p2: { name: 'final pressure (gauge)', q: 'pressure', unit: 'bar', value: 10, tex: 'p_2' },
        p1: { name: 'starting pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_1' },
        pn: { name: 'reference pressure of free air (ANR)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_n' },
        Q: { name: 'average free-air delivery', q: 'airflow', unit: 'L/min ANR', value: 150, tex: 'Q_n' }
      },
      note: 'At room temperature and a constant average delivery; a booster\'s delivery falls as the outlet approaches stall, so use its average over the range.',
      stories: { t: 'A booster delivering {Q} on average pumps a {V} receiver from {p1} to {p2}. How long does it take?', V: 'A booster delivering {Q} must refill a receiver from {p1} to {p2} within {t}. How large can the receiver be?' }
    }
  ],
  examples: [
    {
      title: 'Booster or higher network?',
      q: 'A plant with 110 kW of compressors runs at 6.5 bar gauge. One press needs 9 bar and uses 400 L/min of free air. Compare raising the whole plant to 9.3 bar with a 2:1 booster that takes 2.5 times its output.',
      steps: [
        'Raising the plant: compression energy rises by about 19 % from 6.5 to 9.3 bar — some 21 kW — and every leak and unregulated user passes $10.3/7.5 = 1.37$ times as much air.',
        'Booster: it takes $2.5 \\times 400 = 1000$ L/min from the line, 600 L/min more than the press itself uses.',
        'At 6.5 kW per m³/min that extra is $0.6 \\times 6.5 = 3.9$ kW.',
        'Stall pressure $6.5 \\times 2 = 13$ bar: the press line needs a regulator after the booster and parts rated for 13 bar or more.'
      ],
      a: 'The booster costs about 4 kW; raising the plant costs over 21 kW plus the extra leakage.'
    },
    {
      title: 'Refilling a receiver',
      q: 'A booster delivers 150 L/min of free air on average into a 20 L receiver, between 6 and 10 bar gauge. How long does a refill take?',
      steps: [
        'Free air needed: $V\\Delta p/p_n = 20 \\times (10 - 6)/1 = 80$ L.',
        'Time: $80/150 = 0.53$ min = 32 s.'
      ],
      a: 'About 32 seconds.'
    }
  ],
  quiz: [
    { q: 'A 2:1 air-driven booster is fed at 6 bar gauge. Its outlet stalls at about…', choices: ['7 bar gauge', '12 bar gauge', '13 bar gauge', '14 bar gauge'], a: 1,
      why: 'The force balance gives p₂ = p₁(1 + A_d/A_b) in gauge pressure: 2 × 6 = 12 bar.' },
    { q: 'An ideal 2:1 booster delivering 100 L/min of free air takes from the network…', choices: ['50 L/min', '100 L/min', '200 L/min', '400 L/min'], a: 2,
      why: 'It delivers its boost charge and exhausts an equal volume of drive air: Q_in = Q_out(1 + A_d/A_b) = 200 L/min.' },
    { q: 'At stall pressure an air-driven booster keeps cycling and using air.', a: false,
      why: 'When the forces balance the pistons stop; it uses no air until the outlet pressure falls.' },
    { q: 'A clamp needs 20 % more force than it gets at 6 bar. The cheapest fix is usually…', choices: ['a booster', 'raising the plant pressure', 'the next larger cylinder bore', 'a bigger compressor'], a: 2,
      why: 'Force is pressure times area; one bore size up gives 50–60 % more force at the same pressure with no running cost beyond its own air.' },
    { q: 'Why is a receiver usually fitted after a booster?', choices: ['to cool the air', 'to store boosted air for peaks, since the booster\'s flow falls near stall', 'to remove water', 'to lower the pressure'], a: 1,
      why: 'The booster delivers slowly near its stall pressure; the receiver covers the peaks and the booster refills it between them.' }
  ],
  problems: [
    { q: 'A booster has drive pistons of 30 cm² and boost pistons of 10 cm². What is its stall pressure with 5 bar gauge at the inlet?', answer: 20, unit: 'bar', tol: 0.02,
      steps: ['Ratio: $1 + 30/10 = 4$.', '$p_2 = 5 \\times 4 = 20$ bar gauge.'] }
  ],
  applications: ['Single machines needing 8–12 bar in a 6 bar plant: presses, clamps, test rigs.', 'Mobile equipment with no electricity, fed from a site compressor.', 'Charging accumulators and small high-pressure receivers.', 'PET bottle blowing at about 40 bar, with booster compressors.']
},

{
  id: 'air-leaks', parent: 'air-networks', title: 'Leaks and what they cost', level: 1,
  short: 'A leak is a small hole running day and night: the air leaves at the speed of sound, so the flow grows with the hole\'s area and the absolute pressure. A 3 mm hole at 6 bar wastes about 385 L/min, and plants without a leak programme typically lose 20–30 % of their air this way.',
  keywords: ['air leak', 'leakage', 'leak rate', 'choked flow', 'sonic flow', 'orifice', 'hole', 'leak cost', 'ultrasonic', 'hissing', 'push-in fitting leak', 'coupling leak'],
  prereq: ['choked-flow', 'standard-air', 'absolute-gauge-pressure'],
  related: ['leak-management', 'cost-of-compressed-air', 'pressure-optimisation', 'artificial-demand', 'air-audits', 'tubing-fittings', 'aerodynamics:isentropic-flow', 'aerodynamics:nozzles'],
  body: `
Walk through a factory on a Sunday and listen: the compressors are still running, and the hiss from dozens of fittings, couplings and hoses tells you why. Leaks are the largest single waste in most compressed-air systems. They cost money every hour of the year, they pull the pressure down so that compressors are set higher, and they eat compressor capacity that was paid for.

### Where they are
Mostly at the point of use rather than in the mains: quick couplings and hoses, push-in fittings and tube ends, thread seals, service-unit drains and bowls, pressure regulators, cylinder rod seals, worn valve seals that blow through their exhausts, open blow-off pipes left running, and the flanges and valves of old pipework. Production noise hides them; many only become audible when the plant stops.

### Why a leak is sonic
Air escaping through a hole from above about 0.9 bar gauge reaches the **speed of sound** in the hole and is choked (see [[choked-flow]]): the mass flow no longer depends on the pressure outside, only on the hole and the absolute pressure inside,

$$\\dot m = C_d\\,A\\,p_0\\sqrt{\\frac{\\gamma}{R_\\text{air}T_0}}\\left(\\frac{2}{\\gamma+1}\\right)^{\\frac{\\gamma+1}{2(\\gamma-1)}} \\approx 0.0404\\,\\frac{C_d A\\,p_0}{\\sqrt{T_0}}$$

(SI, $p_0$ absolute, $T_0$ in kelvin). Divided by the density of free air it gives the leak in free air. A sharp-edged hole has a discharge coefficient $C_d$ of about 0.6–0.65; a rounded or tube-shaped one more.

| Hole | Free air at 6 bar | at 7 bar | kWh a year at 6 bar | Cost a year at 6 bar |
|---|---|---|---|---|
| 0.5 mm | 11 L/min | 12 L/min | 610 | ¤90 |
| 1 mm | 43 L/min | 49 L/min | 2 400 | ¤365 |
| 2 mm | 171 L/min | 196 L/min | 9 800 | ¤1,460 |
| 3 mm | 385 L/min | 440 L/min | 21 900 | ¤3,290 |
| 5 mm | 1 070 L/min | 1 220 L/min | 61 000 | ¤9,100 |

(Sharp holes, $C_d$ = 0.65, running 8760 h a year, 6.5 kW per m³/min, ¤0.15 per kWh.) Two rules follow: the flow goes as the **square of the diameter** — a 2 mm hole wastes four times a 1 mm hole — and in proportion to the **absolute pressure**: lowering a 7 bar line to 6 bar cuts every leak by 12.5 % (see [[pressure-optimisation]]).

### How much a plant loses
Plants without a leak programme typically lose **20–30 %** of the air they make, and poorly kept ones 40 % or more; a well-managed plant stays under about 10 %. The cost is more than the electricity: leaks lower the pressure at the machines, so compressors are set higher, run longer, need servicing sooner, and extra compressors get bought to feed them.

### Measuring and fixing
The total leakage is measured with production stopped: the compressor's load time, the fall of pressure in the receivers, or a flow meter on the main. Individual leaks are found with an ultrasonic detector, tagged, ranked and repaired — the few large ones first (see [[leak-management]]). Try your own numbers in the [leak calculator](#/tools/pneu/leak).

> [!warn] Find leaks by listening, with an ultrasonic detector, or with leak-detection spray — never by feeling with a hand close to a fitting. A jet at workshop pressure can drive dirt into the eyes and, at very close range, air through the skin. Exhaust and lock out the section before repairing a leak.
`,
  ideas: [
    'A leak is choked: its flow depends only on the hole area and the absolute pressure upstream.',
    'Flow ∝ d²: a 2 mm hole wastes four times as much as a 1 mm hole.',
    'Flow ∝ absolute pressure: 7 → 6 bar gauge cuts every leak by about 12.5 %.',
    'A 3 mm leak at 6 bar wastes about 385 L/min: roughly 22 000 kWh a year.',
    'Unmanaged plants typically lose 20–30 % of their air through leaks; well-managed ones under 10 %.'
  ],
  pitfalls: [
    'Leak flow is proportional to the gauge pressure — The jet is choked, so the flow follows the absolute pressure: 6 bar gauge is 7 bar absolute.',
    'Most leaks are in the main pipework — Most are at the point of use: couplings, hoses, fittings, service units, cylinders and valves.',
    'A few small leaks do not matter — Dozens of 1 mm leaks add up to cubic metres per minute, around the clock, and they grow.'
  ],
  formulas: [
    {
      name: 'Air lost through a leak (choked flow)',
      expr: 'Q = Cd*pi*d^2/4*(p + patm)*sqrt(gamma/(Rair*T))*(2/(gamma + 1))^((gamma + 1)/(2*(gamma - 1)))/rhoN',
      tex: 'Q_n = \\dfrac{C_d\\,\\pi d^2\\,(p_g + p_\\text{atm})}{4\\,\\rho_n}\\sqrt{\\dfrac{\\gamma}{R_\\text{air} T}}\\left(\\dfrac{2}{\\gamma + 1}\\right)^{\\frac{\\gamma + 1}{2(\\gamma - 1)}}',
      vars: {
        Q: { name: 'free-air flow lost', q: 'airflow', unit: 'L/min ANR', tex: 'Q_n' },
        Cd: { name: 'discharge coefficient (sharp hole ≈ 0.65)', value: 0.65, min: 0.3, max: 1, tex: 'C_d' },
        d: { name: 'hole diameter', q: 'length', unit: 'mm', value: 3 },
        p: { name: 'line pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' },
        gamma: { name: 'ratio of specific heats of air', value: 1.4, fixed: true, tex: '\\gamma' },
        Rair: { const: 'Rair' },
        T: { name: 'air temperature upstream', q: 'temperature', unit: '°C', value: 20 },
        rhoN: { name: 'density of free air (ANR)', q: 'density', unit: 'kg/m³', value: 1.185, fixed: true, tex: '\\rho_n' }
      },
      note: 'Valid while the flow is choked: absolute pressure above about 1.9 times atmospheric (0.9 bar gauge). For air the constant part is 0.0404 √K·s/m.',
      practice: { unknowns: ['Q', 'd'] },
      stories: { Q: 'A hole of {d} (discharge coefficient {Cd}) leaks from a line at {p}, {T}. How much free air escapes?', d: 'A leak on a line at {p} wastes {Q} ({Cd}, {T}). How large is the equivalent hole?' }
    },
    {
      name: 'Yearly cost of an air flow',
      expr: 'C = Q*sp*t*c', tex: 'C = Q_n\\,s_p\\,t\\,c_e',
      vars: {
        C: { name: 'cost per year', q: 'money', unit: '$' },
        Q: { name: 'free-air flow (m³/min ANR)', q: false, unit: 'm³/min', value: 0.385, tex: 'Q_n' },
        sp: { name: 'compressor specific power', q: false, unit: 'kW/(m³/min)', value: 6.5, tex: 's_p' },
        t: { name: 'hours per year the line is pressurised', q: false, unit: 'h', value: 8760 },
        c: { name: 'electricity price per kWh', q: 'money', unit: '$', value: 0.15, tex: 'c_e' }
      },
      note: 'Energy only; with maintenance and capital the true cost is a third higher. Typical specific power: 6–7 kW per m³/min at 7 bar for a good screw compressor.',
      stories: { C: 'A leak of {Q} of free air runs for {t} a year. The compressors need {sp} and electricity costs {c} per kWh. What does it cost?', Q: 'A plant may spend {C} a year on leaks ({sp}, {t}, {c} per kWh). What leak flow is that?' }
    }
  ],
  examples: [
    {
      title: 'One 3 mm leak',
      q: 'A 3 mm hole (C_d = 0.65) leaks from a 6 bar gauge line at 20 °C, all year. How much air and money does it waste (6.5 kW per m³/min, ¤0.15 per kWh)?',
      steps: [
        '$A = \\pi \\times 0.003^2/4 = 7.07\\times10^{-6}$ m²; $p_0 = 7.013\\times10^5$ Pa.',
        '$\\dot m = 0.0404 \\times 0.65 \\times 7.07\\times10^{-6} \\times 7.013\\times10^5/\\sqrt{293} = 7.6\\times10^{-3}$ kg/s.',
        'Free air: $7.6\\times10^{-3}/1.185 = 6.4\\times10^{-3}$ m³/s = 385 L/min.',
        'Power: $0.385 \\times 6.5 = 2.5$ kW; a year: 21 900 kWh; cost: ¤3,290.'
      ],
      a: 'About 385 L/min, 21 900 kWh and ¤3,300 a year.'
    },
    {
      title: 'A plant\'s leaks',
      q: 'A survey at 7 bar gauge tags ten 1 mm leaks, seven of 2 mm and three of 3 mm. The plant uses 14 m³/min on average. What share of its air leaks, and which leaks matter most?',
      steps: [
        'Flows at 7 bar: $10 \\times 49 + 7 \\times 196 + 3 \\times 440 = 490 + 1370 + 1320 = 3180$ L/min.',
        'Share: $3.18/14 = 23$ %.',
        'The three 3 mm leaks are 15 % of the leaks by number but 42 % of the flow.'
      ],
      a: 'About 3.2 m³/min, 23 % of the air; the three largest leaks are over 40 % of it.'
    }
  ],
  quiz: [
    { q: 'A 2 mm hole compared with a 1 mm hole at the same pressure leaks…', choices: ['twice as much', 'four times as much', 'eight times as much', 'the same'], a: 1,
      why: 'Choked flow is proportional to the hole area, which goes as d².' },
    { q: 'The line pressure falls from 7 to 6 bar gauge. A leak\'s flow falls by about…', choices: ['14 %', '12.5 %', '1 %', 'nothing, it is choked'], a: 1,
      why: 'Choked flow is proportional to absolute pressure: 7.013/8.013 = 0.875, so 12.5 % less.' },
    { q: 'Plants without a leak programme typically lose what share of their compressed air through leaks?', choices: ['1–2 %', '5 %', '20–30 %', '70 %'], a: 2,
      why: '20–30 % is typical; badly kept plants lose more, well-managed ones under 10 %.' },
    { q: 'Most leaks are found in the main pipework rather than at the machines.', a: false,
      why: 'Most are at the point of use: couplings, hoses, push-in fittings, service units, cylinders and valves.' },
    { q: 'About how much free air (L/min) does a 1.5 mm sharp hole leak at 7 bar gauge?', answer: 110, unit: 'L/min', tol: 0.05,
      why: 'Scaling the 3 mm figure: 440 × (1.5/3)² = 110 L/min.' }
  ],
  problems: [
    { q: 'A 4 mm hole (C_d 0.65) leaks at 6 bar gauge, 20 °C. How much free air does it lose?', answer: 685, unit: 'L/min', tol: 0.03,
      steps: ['$A = 1.257\\times10^{-5}$ m²; $\\dot m = 0.0404 \\times 0.65 \\times 1.257\\times10^{-5} \\times 7.013\\times10^5/17.12 = 0.01352$ kg/s.', 'Free air: $0.01352/1.185 = 0.0114$ m³/s = 685 L/min.'] },
    { q: 'What does a leak of 0.2 m³/min of free air cost a year, running 8760 h, with 6.5 kW per m³/min and electricity at 0.15 per kWh?', answer: 1708, tol: 0.02,
      steps: ['$C = 0.2 \\times 6.5 \\times 8760 \\times 0.15 = 1708$ (in your currency).'] }
  ],
  applications: ['Leak surveys and repair programmes in factories.', 'Estimating the value of lowering the plant pressure.', 'Sizing compressors: leaks are a real, permanent demand until fixed.', 'Deciding whether to shut off air to idle machines and areas.'],
  history: 'The choked-flow result goes back to Barré de Saint-Venant and Laurent Wantzel, who found in 1839 that the flow from a vessel stops increasing once the outside pressure falls below about half the inside. Industrial leak programmes spread from the 1970s oil crises onwards, and portable ultrasonic detectors made them practical.',
  sim: ['dist-leak-audit', 'ref-air-consumption']
},

/* ====================================================================== THE COST OF AIR */
{
  id: 'cost-of-compressed-air', parent: 'air-cost', title: 'The cost of compressed air', level: 1,
  short: 'Compressed air is one of the dearest forms of energy in a factory: a compressor turns about 90 % of its electricity into heat, a cubic metre of free air at 7 bar takes 0.1–0.13 kWh, and over a compressor\'s life the electricity is about three quarters of everything spent on it.',
  keywords: ['cost of compressed air', 'specific power', 'kWh per cubic metre', 'specific energy', 'life-cycle cost', 'energy cost', 'fourth utility', 'isothermal efficiency', 'inappropriate uses', 'open blowing', 'compressor efficiency'],
  prereq: ['standard-air', 'compression-work', 'fad-capacity'],
  related: ['air-leaks', 'leak-management', 'pressure-optimisation', 'artificial-demand', 'air-audits', 'heat-recovery', 'pneumatic-vs-electric', 'compressor-regulation', 'air-consumption', 'physics:efficiency', 'physics:power'],
  body: `
Air is free; compressed air is not. Factories call it the fourth utility, after electricity, gas and water — and per unit of useful work it is by far the most expensive of them. A compressor drawing 100 kW turns about 90 kW into heat in its oil, cooler and motor; what reaches the machines as usable expansion work is a small fraction of the electricity paid for.

### The thermodynamic floor
Compressing air at constant temperature takes the least work (see [[compression-work]]). For free air $Q_n$ counted at $p_n$ and drawn in at atmospheric pressure,

$$P_\\text{iso} = p_n\\,Q_n \\ln\\frac{p_g + p_\\text{atm}}{p_\\text{atm}}$$

— 3.45 kW for each m³/min raised to 7 bar gauge. Compression without cooling (adiabatic, single stage) would take 4.7 kW. A real compressor package, with its motor, drive, cooling fans and controls, needs about **6–7 kW per m³/min**: its **specific power**. Against the isothermal floor that is an efficiency of about 50–55 %.

| Compressor | Typical specific power at 7 bar | Energy per m³ of free air |
|---|---|---|
| Small piston, 2–10 kW | 8–10 kW per m³/min | 0.13–0.17 kWh |
| Oil-injected screw, 30–250 kW, full load | 6–7 kW per m³/min | 0.10–0.12 kWh |
| Large two-stage screw or centrifugal | 5.5–6.5 kW per m³/min | 0.09–0.11 kWh |
| Any compressor at badly controlled part load | 8–12 kW per m³/min | 0.13–0.20 kWh |

### A cubic metre, a year, a lifetime
With 0.11 kWh per m³ and electricity at ¤0.15 per kWh, a cubic metre of free air costs about ¤0.016 in electricity — ¤16 per thousand. Add maintenance, capital and treatment and the full cost is roughly ¤20–25 per thousand cubic metres. That sounds small until the volumes appear: a plant using 12 m³/min for 6000 hours a year makes 4.3 million m³.

Over a compressor's life — ten years or more — the **electricity is typically 70–85 % of the total cost**, the purchase 10–15 %, maintenance the rest. A 75 kW compressor costing ¤45,000 uses that much electricity within about a year and a half of two-shift running.

### How the air is used
In a typical plant without an energy programme only half to two thirds of the air does useful work. The rest goes to **leaks** (20–30 %, see [[air-leaks]]), **artificial demand** — unregulated uses passing extra air because the pressure is higher than needed (see [[artificial-demand]]) — and **inappropriate uses**: open blow pipes, cooling cabinets and people, stirring liquids, vacuum by ejectors where a pump would do. A plain 6 mm pipe blowing at 6 bar passes about 1.5 m³/min — some 10 kW of compressor power — for a job an engineered nozzle does with half the air or a low-pressure electric blower with a fraction of the energy.

### The heat is not lost
Since 90 % of the input becomes heat at 70–90 °C, most of it can be recovered for washing water, process heat or space heating (see [[heat-recovery]]) — the one way to turn the compressor's inefficiency into a saving.

> [!key] Rough figures to remember: 6–7 kW of electricity per m³/min of free air at 7 bar; 0.1 kWh per m³; ¤20 per thousand m³ all in; energy three quarters of lifetime cost; every bar about 7 %.
`,
  ideas: [
    'About 90 % of a compressor\'s electrical input becomes heat; much of it can be recovered.',
    'Isothermal compression to 7 bar takes 3.45 kW per m³/min; real packages need 6–7 kW (specific power).',
    'A cubic metre of free air at 7 bar takes about 0.1–0.12 kWh; roughly ¤20 per thousand m³ all in.',
    'Electricity is typically 70–85 % of a compressor\'s life-cycle cost.',
    'Leaks, artificial demand and inappropriate uses often take a third to a half of the air made.'
  ],
  pitfalls: [
    'Compressed air is cheap because air is free — The electricity to compress it makes it one of the dearest utilities per unit of useful work.',
    'The purchase price decides which compressor is cheapest — Energy is three quarters of the life-cycle cost; a more efficient machine pays back quickly.',
    'Blowing with an open pipe is harmless — It wastes kilowatts of compressor power, is loud, and is dangerous if pointed at people; use engineered nozzles, blowers or brushes.'
  ],
  formulas: [
    {
      name: 'Specific energy of compressed air',
      expr: 'ev = P/(60*Q)', tex: 'e_V = \\dfrac{P}{60\\,Q_n}',
      vars: {
        ev: { name: 'energy per m³ of free air', q: false, unit: 'kWh/m³', tex: 'e_V' },
        P: { name: 'compressor electrical power', q: false, unit: 'kW', value: 55 },
        Q: { name: 'free air delivered (m³/min ANR)', q: false, unit: 'm³/min', value: 8.5, tex: 'Q_n' }
      },
      note: 'P/Q is the specific power in kW per m³/min; dividing by 60 min per hour gives kWh per m³. Measure both over a long period, including unloaded running.',
      stories: { ev: 'A compressor draws {P} while delivering {Q} of free air. How much energy does each cubic metre take?' }
    },
    {
      name: 'Full cost of a thousand cubic metres',
      expr: 'c1 = 1000*ev*c/w', tex: 'c_{1000} = \\dfrac{1000\\,e_V\\,c_e}{w}',
      vars: {
        c1: { name: 'cost per 1000 m³ of free air', q: 'money', unit: '$', tex: 'c_{1000}' },
        ev: { name: 'energy per m³ of free air', q: false, unit: 'kWh/m³', value: 0.108, tex: 'e_V' },
        c: { name: 'electricity price per kWh', q: 'money', unit: '$', value: 0.15, tex: 'c_e' },
        w: { name: 'electricity\'s share of the total cost', q: 'ratio', unit: '%', value: 75, min: 30, max: 100, tex: 'w' }
      },
      note: 'Dividing the energy cost by its share of the life-cycle cost adds capital and maintenance.',
      stories: { c1: 'Compressed air takes {ev} per cubic metre, electricity costs {c} per kWh and energy is {w} of the total cost. What does a thousand cubic metres cost?' }
    },
    {
      name: 'Minimum (isothermal) compression power',
      expr: 'P = pn*Q*ln((p + patm)/patm)', tex: 'P_\\text{iso} = p_n\\,Q_n \\ln\\dfrac{p_g + p_\\text{atm}}{p_\\text{atm}}',
      vars: {
        P: { name: 'isothermal compression power', q: 'power', unit: 'kW', tex: 'P_\\text{iso}' },
        pn: { name: 'reference pressure of free air (ANR)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_n' },
        Q: { name: 'free-air flow', q: 'airflow', unit: 'm³/min ANR', value: 1, tex: 'Q_n' },
        p: { name: 'delivery pressure (gauge)', q: 'pressure', unit: 'bar', value: 7, tex: 'p_g' },
        patm: { name: 'atmospheric (intake) pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' }
      },
      note: 'The least work any compressor could do; real packages need about twice as much. The ratio P_iso/P_real is the isothermal efficiency.',
      practice: { unknowns: ['P', 'Q'] },
      stories: { P: 'What is the least power that could compress {Q} of free air to {p}?' }
    },
    {
      name: 'Life-cycle cost of a compressor',
      expr: 'LCC = Cp + Y*(P*t*c + M)', tex: '\\mathrm{LCC} = C_p + Y\\,(P\\,t\\,c_e + M)',
      vars: {
        LCC: { name: 'life-cycle cost', q: 'money', unit: '$', tex: '\\mathrm{LCC}' },
        Cp: { name: 'purchase and installation', q: 'money', unit: '$', value: 45000, tex: 'C_p' },
        Y: { name: 'years of service', q: 'years', unit: 'yr', value: 10 },
        P: { name: 'average electrical power', q: false, unit: 'kW', value: 55 },
        t: { name: 'running hours per year', q: false, unit: 'h', value: 4000 },
        c: { name: 'electricity price per kWh', q: 'money', unit: '$', value: 0.15, tex: 'c_e' },
        M: { name: 'maintenance per year', q: 'money', unit: '$', value: 3500 }
      },
      note: 'Undiscounted; a financial comparison would discount future costs. Energy share = Y·P·t·c/LCC.',
      stories: { LCC: 'A compressor costs {Cp} installed, draws {P} on average for {t} a year at {c} per kWh and {M} a year to maintain. What does it cost over {Y}?' }
    }
  ],
  examples: [
    {
      title: 'What a year of air costs',
      q: 'A plant uses 12 m³/min of free air on average for 6000 hours a year. Its compressors need 6.5 kW per m³/min; electricity costs ¤0.14 per kWh. What is the yearly energy bill for compressed air?',
      steps: [
        'Power: $12 \\times 6.5 = 78$ kW.',
        'Energy: $78 \\times 6000 = 468\\,000$ kWh.',
        'Cost: $468\\,000 \\times 0.14 = 65\\,520$.'
      ],
      a: 'About 468 000 kWh and ¤65,500 a year.'
    },
    {
      title: 'The floor and the real machine',
      q: 'Compare the isothermal power for 1 m³/min of free air at 7 bar gauge with a compressor package needing 6.5 kW per m³/min.',
      steps: [
        '$P_\\text{iso} = 10^5 \\times (1/60) \\times \\ln(8.013/1.013) = 1667 \\times 2.068 = 3450$ W.',
        'Single-stage adiabatic compression would need 4.7 kW.',
        'Isothermal efficiency of the package: $3.45/6.5 = 53$ %.'
      ],
      a: '3.45 kW at the thermodynamic floor against 6.5 kW real — about 53 %.'
    },
    {
      title: 'Where the money goes over ten years',
      q: 'A 75 kW compressor costs ¤45,000 installed and ¤3,500 a year to maintain. It averages 55 kW for 4000 h a year at ¤0.15 per kWh. What is its ten-year cost, and what share is electricity?',
      steps: [
        'Electricity per year: $55 \\times 4000 \\times 0.15 = 33\\,000$.',
        'Ten years: $45\\,000 + 10 \\times (33\\,000 + 3\\,500) = 410\\,000$.',
        'Electricity share: $330\\,000/410\\,000 = 80$ %.'
      ],
      a: '¤410,000 over ten years, 80 % of it electricity.'
    }
  ],
  quiz: [
    { q: 'Of the electricity a compressor draws, about how much ends up as heat?', choices: ['10 %', '50 %', '90 %', 'none'], a: 2,
      why: 'About 90 % becomes heat in the oil, coolers and motor; that is why heat recovery pays so well.' },
    { q: 'A good screw compressor at 7 bar needs about how much energy per cubic metre of free air?', choices: ['0.01 kWh', '0.1 kWh', '1 kWh', '10 kWh'], a: 1,
      why: '6–7 kW per m³/min is 0.10–0.12 kWh per m³.' },
    { q: 'Over a compressor\'s life, the largest cost is usually…', choices: ['the purchase', 'maintenance', 'electricity', 'installation'], a: 2,
      why: 'Electricity is typically 70–85 % of the life-cycle cost.' },
    { q: 'The isothermal power to compress 1 m³/min of free air to 7 bar gauge is about 3.5 kW, so a real compressor needs about the same.', a: false,
      why: 'Real packages need 6–7 kW per m³/min — roughly twice the isothermal floor — because compression heats the air and motors, drives and fans have losses.' },
    { q: 'Energy is 0.12 kWh/m³, electricity ¤0.10 per kWh, and energy is 75 % of the full cost. What does a thousand cubic metres cost in full?', answer: 16, tol: 0.02,
      why: '1000 × 0.12 × 0.10/0.75 = 16 (in your currency).' }
  ],
  problems: [
    { q: 'A compressor delivers 5 m³/min of free air for 4000 h a year with a specific power of 7 kW per m³/min. Electricity costs 0.12 per kWh. What does the air cost in electricity per year?', answer: 16800, tol: 0.02,
      steps: ['Power: $5 \\times 7 = 35$ kW.', 'Energy: $35 \\times 4000 = 140\\,000$ kWh; cost $140\\,000 \\times 0.12 = 16\\,800$.'] }
  ],
  applications: ['Budgeting a plant\'s utilities and pricing air for internal cost centres.', 'Choosing between compressors on life-cycle cost, not price.', 'Justifying leak programmes, pressure reductions and heat recovery.', 'Comparing pneumatic and electric drives for a new machine.'],
  sim: 'ref-air-consumption'
},

{
  id: 'leak-management', parent: 'air-cost', title: 'Finding and fixing leaks', level: 1,
  short: 'A leak programme: measure the total leakage with production stopped, find leaks with an ultrasonic detector, tag and log each one, repair the biggest first, measure again — and repeat, because new leaks appear every month.',
  keywords: ['leak detection', 'leak survey', 'ultrasonic leak detector', 'leak tag', 'leak programme', 'load-time method', 'pressure decay', 'baseline', 'repair', 'Pareto', 'leak spray'],
  prereq: ['air-leaks', 'cost-of-compressed-air', 'compressor-regulation'],
  related: ['air-audits', 'pressure-optimisation', 'air-saving-circuits', 'receivers', 'tubing-fittings', 'maintenance-pneu', 'soft-start'],
  body: `
Leaks are cheap to fix and expensive to ignore. A plant that loses 25 % of its air to leaks can usually bring that under 10 % with a few days of work and parts costing a small fraction of the first year's saving. The catch is that leaks come back: couplings wear, tubes are damaged, fittings loosen. A **programme** — measure, find, tag, fix, verify, repeat — keeps the savings.

### 1. Measure the total
With production stopped (a weekend, a holiday, a long break) the compressors feed nothing but leaks and anything left switched on. Three ways to measure it:
- **Load time.** A load/unload compressor runs loaded only to replace what leaks away. Time several loaded and unloaded periods: leakage = delivery × loaded time / total time.
- **Pressure decay.** Switch the compressors off and time how long the network takes to fall by about a bar from working pressure: leakage = network volume × pressure fall / (reference pressure × time). The volume is the receivers plus the pipework — 100 m of DN 50 holds 0.22 m³.
- **Flow meter.** A meter on the main header reads it directly, and logs it for later comparison (see [[air-audits]]).

### 2. Find
An escaping jet is turbulent and loud in the **ultrasonic** range, around 40 kHz, well above production noise. A handheld ultrasonic detector converts it to an audible tone and points like a torch, so leaks can be found with machines running and from a few metres away; a parabolic dish reaches overhead mains. Leak-detection spray or soapy water finds small ones at close range. Walk a route: compressor room, mains, drops, then each machine — service units, couplings, hoses, fittings, cylinders, valves.

### 3. Tag and log
Hang a numbered tag at every leak and log its place, the component, an estimate of its size (the detector's reading, or a class such as small, medium, large), the estimated cost per year and the repair needed. The log becomes the work list and the proof of savings.

### 4. Repair the big ones first
Leak sizes are very uneven: a few large leaks usually carry most of the flow (see the example on [[air-leaks]]). Many fixes — retightening a fitting, re-cutting a tube end, replacing a coupling — take minutes and can be done during the survey; others wait for a planned stop.

### 5. Verify and repeat
Measure the total again and price the saving. Then survey again every three to six months; without follow-up, leakage typically creeps back within a year or two. Two structural measures help: lower the plant pressure (every leak shrinks with it, see [[pressure-optimisation]]) and **shut the air off at idle machines** with a valve that closes when the machine stops (see [[air-saving-circuits]]).

| Stage | Leakage | Share of air | Energy cost a year |
|---|---|---|---|
| Before (first survey) | 3.2 m³/min | 25 % | ¤23,300 |
| After repairs | 1.1 m³/min | 9 % | ¤8,000 |
| One year later, no follow-up | 2.0 m³/min | 15 % | ¤14,600 |

(An illustrative plant: 7000 h pressurised a year, 6.5 kW per m³/min, ¤0.16 per kWh.)

> [!warn] Before repairing a leak, close and lock the isolating valve, exhaust the section or machine and check the gauge reads zero; cylinders may move as air is released or restored. Never feel for a leak with a hand, and never point a jet at anyone.
`,
  ideas: [
    'Measure the total leakage with production stopped: by compressor load time, pressure decay or a flow meter.',
    'Ultrasonic detectors hear the jets above production noise; spray finds small ones.',
    'Tag and log every leak; repair the large ones first — a few carry most of the flow.',
    'Verify, then repeat every few months: leaks come back.',
    'Lower pressure and shut-off valves at idle machines shrink leakage permanently.'
  ],
  pitfalls: [
    'Once repaired, leaks stay fixed — Couplings wear and tubes are damaged continually; without regular surveys leakage returns within a year or two.',
    'Leaks can only be found when the plant is quiet — Ultrasonic detectors work in full production; only the total must be measured with production stopped.',
    'Fix leaks in the order they were found — Rank them: the largest few carry most of the waste and pay back fastest.'
  ],
  formulas: [
    {
      name: 'Leakage by the load-time method',
      expr: 'QL = Qc*tl/(tl + tu)', tex: 'Q_L = Q_c\\,\\dfrac{t_l}{t_l + t_u}',
      vars: {
        QL: { name: 'leakage (free air)', q: 'airflow', unit: 'm³/min ANR', tex: 'Q_L' },
        Qc: { name: 'compressor free air delivery', q: 'airflow', unit: 'm³/min ANR', value: 10, tex: 'Q_c' },
        tl: { name: 'loaded time (average of several cycles)', q: 'time', unit: 's', value: 22, tex: 't_l' },
        tu: { name: 'unloaded time', q: 'time', unit: 's', value: 58, tex: 't_u' }
      },
      note: 'With production stopped and a load/unload compressor; average over several cycles.',
      stories: { QL: 'On a Sunday a compressor delivering {Qc} runs loaded for {tl} and unloaded for {tu}, over and over. How much air is leaking?' }
    },
    {
      name: 'Leakage by the pressure-decay method',
      expr: 'QL = V*(p1 - p2)/(pn*t)', tex: 'Q_L = \\dfrac{V\\,(p_1 - p_2)}{p_n\\,t}',
      vars: {
        QL: { name: 'leakage (free air)', q: 'airflow', unit: 'm³/min ANR', tex: 'Q_L' },
        V: { name: 'volume of receivers and pipework', q: 'volume', unit: 'm³', value: 3 },
        p1: { name: 'starting pressure (gauge)', q: 'pressure', unit: 'bar', value: 7, tex: 'p_1' },
        p2: { name: 'end pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_2' },
        pn: { name: 'reference pressure of free air (ANR)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_n' },
        t: { name: 'time for the fall', q: 'time', unit: 's', value: 90 }
      },
      note: 'Compressors off, production stopped; keep the fall to about a bar starting near working pressure (leaks slow as the pressure drops), and let the temperature settle.',
      stories: { QL: 'With the compressors off, a network of {V} falls from {p1} to {p2} in {t}. What is the leakage?', t: 'A network of {V} leaks {QL}. How long does it take to fall from {p1} to {p2}?' }
    },
    {
      name: 'Payback time of a repair',
      expr: 'tp = Cr/(Q*sp*h*c)', tex: 't_p = \\dfrac{C_r}{Q_n\\,s_p\\,t\\,c_e}',
      vars: {
        tp: { name: 'payback time', q: 'years', unit: 'day', tex: 't_p' },
        Cr: { name: 'cost of the repair', q: 'money', unit: '$', value: 50, tex: 'C_r' },
        Q: { name: 'leak flow stopped (m³/min ANR)', q: false, unit: 'm³/min', value: 0.2, tex: 'Q_n' },
        sp: { name: 'compressor specific power', q: false, unit: 'kW/(m³/min)', value: 6.5, tex: 's_p' },
        h: { name: 'hours per year the line is pressurised', q: false, unit: 'h', value: 8760, tex: 't' },
        c: { name: 'electricity price per kWh', q: 'money', unit: '$', value: 0.15, tex: 'c_e' }
      },
      note: 'Simple payback on energy alone.',
      stories: { tp: 'A repair costing {Cr} stops a leak of {Q} on a line pressurised {h} a year ({sp}, {c} per kWh). How soon does it pay back?' }
    }
  ],
  examples: [
    {
      title: 'Measuring the leaks on a Sunday',
      q: 'With the plant stopped, a 10 m³/min load/unload compressor runs loaded 22 s and unloaded 58 s, cycle after cycle. The plant averages 11 m³/min in production and is pressurised 7000 h a year. How big is the leakage and what does it cost (6.5 kW per m³/min, ¤0.15 per kWh)?',
      steps: [
        '$Q_L = 10 \\times 22/(22 + 58) = 2.75$ m³/min.',
        'Share of production demand: $2.75/11 = 25$ %.',
        'Cost: $2.75 \\times 6.5 \\times 7000 \\times 0.15 = 18\\,770$ a year.'
      ],
      a: '2.75 m³/min — a quarter of the air — costing about ¤18,800 a year.'
    },
    {
      title: 'Pressure decay',
      q: 'The receivers hold 2 m³ and the pipework about 1 m³. With the compressors off, the pressure falls from 7 to 6 bar gauge in 90 s. What is the leakage?',
      steps: [
        'Free air lost: $V\\Delta p/p_n = 3 \\times 1/1 = 3$ m³.',
        'Over 90 s: $3/1.5 = 2.0$ m³/min.'
      ],
      a: 'About 2.0 m³/min of free air.'
    },
    {
      title: 'Is it worth fixing?',
      q: 'A coupling leaking 0.2 m³/min costs ¤50 to replace. The line is pressurised all year; 6.5 kW per m³/min, ¤0.15 per kWh. How soon does the repair pay back?',
      steps: [
        'Yearly cost of the leak: $0.2 \\times 6.5 \\times 8760 \\times 0.15 = 1708$.',
        'Payback: $50/1708 = 0.029$ years = 11 days.'
      ],
      a: 'In about eleven days.'
    }
  ],
  quiz: [
    { q: 'When should the total leakage of a plant be measured?', choices: ['at peak production', 'with production stopped', 'during start-up', 'it cannot be measured'], a: 1,
      why: 'Then the compressors feed only leaks (and anything left on), so their output is the leakage.' },
    { q: 'Why can ultrasonic detectors find leaks in a noisy running plant?', choices: ['they measure pressure', 'escaping jets are loud around 40 kHz, above most machine noise', 'they see the air', 'they detect temperature'], a: 1,
      why: 'The turbulent jet radiates strongly in the ultrasonic band, where production noise is weak; the detector is directional.' },
    { q: 'Which leaks should be repaired first?', choices: ['the ones nearest the compressor', 'the largest', 'the smallest', 'the ones found first'], a: 1,
      why: 'Leak sizes are uneven; the largest few carry most of the flow and pay back fastest.' },
    { q: 'After a thorough repair campaign, leakage stays low for many years without further work.', a: false,
      why: 'New leaks appear continually; surveys every few months keep the savings.' },
    { q: 'On a weekend a 12 m³/min compressor is loaded 20 s and unloaded 100 s per cycle. What is the leakage (m³/min)?', answer: 2, unit: 'm³/min', tol: 0.02,
      why: '12 × 20/120 = 2 m³/min.' }
  ],
  problems: [
    { q: 'With the compressors off, a 4 m³ network falls from 7.5 to 6.5 bar gauge in 2 minutes. What is the leakage in m³/min of free air?', answer: 2, unit: 'm³/min', tol: 0.02,
      steps: ['Free air lost: $4 \\times 1.0/1.0 = 4$ m³.', 'In 2 min: 2 m³/min.'] }
  ],
  applications: ['Quarterly leak surveys in factories and workshops.', 'Energy-saving projects and their verification.', 'Maintenance routes that tag and fix leaks as they go.', 'Commissioning new machines with a leak test.'],
  sim: 'dist-leak-audit'
},

{
  id: 'pressure-optimisation', parent: 'air-cost', title: 'Lowering the pressure', level: 2,
  short: 'Every bar of unnecessary pressure costs about 7 % more compressor energy and makes every leak and unregulated user waste more air. Find the pressure the machines really need, remove the drops in between, regulate at the point of use, and set the compressors as low as that allows.',
  keywords: ['pressure reduction', 'system pressure', 'set point', 'pressure band', '7 % per bar', 'compressor setting', 'point-of-use regulation', 'pressure drop', 'central controller', 'pressure scheduling'],
  prereq: ['cost-of-compressed-air', 'compression-work', 'pressure-regulators'],
  related: ['artificial-demand', 'air-leaks', 'pressure-drop-air', 'pressure-boosters', 'compressor-regulation', 'cylinder-force', 'air-filters', 'air-audits'],
  body: `
Pressures creep up. A machine at the far end falters, someone raises the compressor by half a bar, the complaint stops, and the setting stays — for years. Many plants run their compressors at 7.5–8 bar while no machine needs more than 5.5 at its regulator. Lowering the pressure is one of the cheapest energy measures there is, and it saves twice.

### Saving one: less compression work
The work to compress air rises with the pressure ratio (see [[compression-work]]). With a polytropic exponent $n$ (1 isothermal, 1.4 adiabatic),

$$\\frac{P_2}{P_1} = \\frac{\\left(\\frac{p_2 + p_\\text{atm}}{p_\\text{atm}}\\right)^{(n-1)/n} - 1}{\\left(\\frac{p_1 + p_\\text{atm}}{p_\\text{atm}}\\right)^{(n-1)/n} - 1}$$

| Discharge pressure (gauge) | 4 | 5 | 6 | 7 | 8 | 9 | 10 bar |
|---|---|---|---|---|---|---|---|
| Isothermal | 0.77 | 0.86 | 0.94 | 1 | 1.06 | 1.11 | 1.15 |
| n = 1.2 | 0.74 | 0.84 | 0.93 | 1 | 1.07 | 1.13 | 1.19 |
| Adiabatic, one stage | 0.72 | 0.82 | 0.92 | 1 | 1.08 | 1.15 | 1.21 |

(Power relative to 7 bar, same free-air delivery.) Near 7 bar each bar is worth **6–8 %** — the familiar "7 % per bar" — and more at lower pressures (about 9 % from 6 to 5 bar).

### Saving two: less unregulated air
Leaks, open blow-offs and anything without a regulator pass air in proportion to the absolute pressure: 7 → 6 bar gauge is 12.5 % less. If a third of the air is unregulated, that is another 4 % (see [[artificial-demand]]).

### How low can it go?
Build the pressure staircase from the machine back to the compressor:

| Step | Example |
|---|---|
| Most demanding machine, at its regulator | 5.0 bar |
| + its service unit, hose and couplings | 0.4 bar |
| + pipework | 0.1 bar |
| + dryer and filters | 0.4 bar |
| + compressor control band | 0.5 bar |
| = compressor setting | **6.4 bar** |

Then attack each step. Find out *why* the critical machine needs its pressure — often one machine sets the pressure of the whole plant and a bigger cylinder, better couplings or a booster at that machine (see [[pressure-boosters]]) is far cheaper. Replace filter elements before their drop grows; enlarge restrictive hoses and couplings (see [[tubing-fittings]]); narrow the control band with a central controller or a variable-speed compressor. Set a regulator at every machine to what it needs, so the network pressure above it is only a margin.

### Nights and weekends
When only leaks and a few services need air, the pressure can drop further — or the air be shut off. Timed set points on the compressor controller do this automatically.

### Check the machines
A lower pressure means less force at every cylinder: $F = p_g A$. Check the critical load ratios (see [[cylinder-force]]); most cylinders are oversized and do not notice. Each stroke also uses less free air — a bonus saving.

> [!tip] Lower the pressure in steps of 0.2–0.3 bar a week, watching the machines that complained before. The ones that falter show where the real bottleneck is.
`,
  ideas: [
    'Each bar of compressor pressure costs about 6–8 % energy near 7 bar — more at lower pressures.',
    'Unregulated air (leaks, blow-offs) falls with the absolute pressure: 7 → 6 bar gauge is 12.5 % less.',
    'Build the pressure staircase from the most demanding machine back to the compressor.',
    'One machine often sets the whole plant pressure: fix it locally.',
    'Regulate at the point of use and narrow the compressor control band.'
  ],
  pitfalls: [
    'Higher pressure makes the whole plant work better — Beyond what the machines need it only costs energy, harder end-stop impacts and more leakage.',
    'Lowering the pressure saves only compression energy — Leaks and unregulated uses shrink too, and every cylinder stroke uses less free air.',
    'If one machine needs 7 bar the plant must run at 7.5 — A booster, a bigger cylinder or a dedicated line for that machine is usually far cheaper than raising everything.'
  ],
  formulas: [
    {
      name: 'Compressor power at a new pressure',
      expr: 'P2 = P1*(((p2 + patm)/patm)^((n - 1)/n) - 1)/(((p1 + patm)/patm)^((n - 1)/n) - 1)',
      tex: 'P_2 = P_1\\,\\dfrac{\\left(\\dfrac{p_2 + p_\\text{atm}}{p_\\text{atm}}\\right)^{(n-1)/n} - 1}{\\left(\\dfrac{p_1 + p_\\text{atm}}{p_\\text{atm}}\\right)^{(n-1)/n} - 1}',
      vars: {
        P2: { name: 'power at the new pressure', q: 'power', unit: 'kW', tex: 'P_2' },
        P1: { name: 'power at the present pressure', q: 'power', unit: 'kW', value: 90, tex: 'P_1' },
        p2: { name: 'new discharge pressure (gauge)', q: 'pressure', unit: 'bar', value: 6.5, tex: 'p_2' },
        p1: { name: 'present discharge pressure (gauge)', q: 'pressure', unit: 'bar', value: 7.5, tex: 'p_1' },
        patm: { name: 'atmospheric (intake) pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' },
        n: { name: 'polytropic exponent (1 isothermal … 1.4 adiabatic)', value: 1.2, fixed: true, tex: 'n' }
      },
      note: 'Same free-air delivery. n ≈ 1.2 reproduces the familiar 7 % per bar near 7 bar; oil-injected screws are cooled during compression and lie between the isothermal and adiabatic lines.',
      practice: { unknowns: ['P2', 'p2'] },
      stories: { P2: 'Compressors draw {P1} at {p1}. What will they draw at {p2}, delivering the same air?', p2: 'Compressors draw {P1} at {p1}. To what pressure must they be lowered to draw {P2}?' }
    },
    {
      name: 'The pressure staircase',
      expr: 'pc = pm + dpu + dpn + dpt + db', tex: 'p_c = p_m + \\Delta p_u + \\Delta p_n + \\Delta p_t + \\Delta p_b',
      vars: {
        pc: { name: 'compressor setting (gauge, lower limit)', q: 'pressure', unit: 'bar', tex: 'p_c' },
        pm: { name: 'pressure the most demanding machine needs at its regulator (gauge)', q: 'pressure', unit: 'bar', value: 5, tex: 'p_m' },
        dpu: { name: 'drop in its service unit, hose and couplings', q: 'pressure', unit: 'bar', value: 0.4, tex: '\\Delta p_u' },
        dpn: { name: 'drop in the pipework', q: 'pressure', unit: 'bar', value: 0.1, tex: '\\Delta p_n' },
        dpt: { name: 'drop in dryers and filters', q: 'pressure', unit: 'bar', value: 0.4, tex: '\\Delta p_t' },
        db: { name: 'margin for the compressor control band', q: 'pressure', unit: 'bar', value: 0.5, tex: '\\Delta p_b' }
      },
      note: 'All drops at full flow. Each term is a target for improvement.',
      stories: { pc: 'The most demanding machine needs {pm} at its regulator; its service unit and hose lose {dpu}, the pipes {dpn}, the treatment {dpt}, and the control band needs {db}. What must the compressors deliver?' }
    }
  ],
  examples: [
    {
      title: 'One bar less',
      q: 'Compressors draw 90 kW at 7.5 bar gauge. The plant pressure is lowered to 6.5 bar with the same free-air demand. Estimate the saving (n = 1.2) over 6000 h a year at ¤0.15 per kWh.',
      steps: [
        'Ratios: $(8.513/1.013)^{0.1667} = 1.426$, $(7.513/1.013)^{0.1667} = 1.397$.',
        '$P_2 = 90 \\times 0.397/0.426 = 83.8$ kW — 6.2 kW (6.9 %) less.',
        'A year: $6.2 \\times 6000 = 37\\,300$ kWh, ¤5,600 — before counting the smaller leaks.'
      ],
      a: 'About 6.2 kW, 37 000 kWh and ¤5,600 a year, plus about 12 % less leakage.'
    },
    {
      title: 'Can the clamp still hold?',
      q: 'A 50 mm clamp must hold 700 N. After the change it receives 5.0 bar gauge. Is that enough with a load ratio of at most 75 %?',
      steps: [
        'Force: $5\\times10^5 \\times \\pi \\times 0.05^2/4 = 982$ N.',
        'Load ratio: $700/982 = 71$ % — within 75 %.'
      ],
      a: 'Yes: 982 N available, 71 % used.'
    }
  ],
  quiz: [
    { q: 'Near 7 bar, each bar of compressor discharge pressure costs about…', choices: ['1 % energy', '7 % energy', '25 % energy', '50 % energy'], a: 1,
      why: 'The compression work rises with the pressure ratio: about 6–8 % per bar around 7 bar.' },
    { q: 'Lowering the plant from 7 to 6 bar gauge also reduces leakage.', a: true,
      why: 'Leaks are choked orifices whose flow follows absolute pressure: 7.013/8.013 = 0.875, about 12.5 % less.' },
    { q: 'One old press needs 7.5 bar; everything else is fine with 5.5. The cheapest approach is usually…', choices: ['run the whole plant at 8 bar', 'a booster or larger cylinder at the press', 'a bigger compressor', 'a larger receiver'], a: 1,
      why: 'Raising the whole plant costs 7 % per bar on everything plus extra leakage; solve the one machine locally.' },
    { q: 'Which change lowers the pressure the compressors must make without affecting the machines?', choices: ['replacing clogged filter elements', 'removing regulators', 'widening the control band', 'longer hoses'], a: 0,
      why: 'A clogged filter may lose 0.5 bar or more; a fresh element returns that to the machines, so the compressors can be set lower.' },
    { q: 'The compressors draw 100 kW at 8 bar gauge. Using 7 % per bar, roughly what would they draw at 7 bar (kW)?', answer: 93, unit: 'kW', tol: 0.03,
      why: '100 × (1 − 0.07) = 93 kW (the exact figure depends on the compressor).' }
  ],
  problems: [
    { q: 'A machine needs 5.5 bar at its regulator; its hose and service unit lose 0.3 bar, the pipes 0.1, the dryer and filters 0.35, and the control band needs 0.4 bar. What should the compressor\'s lower set point be?', answer: 6.65, unit: 'bar', tol: 0.01,
      steps: ['$p_c = 5.5 + 0.3 + 0.1 + 0.35 + 0.4 = 6.65$ bar gauge.'] }
  ],
  applications: ['Energy programmes: the first measure after leak repair.', 'Master controllers holding several compressors in one narrow band.', 'Pressure scheduling for nights and weekends.', 'Point-of-use regulators set per machine.'],
  sim: 'dist-pressure-savings'
},

{
  id: 'artificial-demand', parent: 'air-cost', title: 'Artificial demand and pressure bands', level: 2,
  short: 'Every unregulated use of air — leaks, open blow-offs, tools and cylinders without regulators — consumes more free air when the system pressure is higher. That extra is artificial demand: air paid for only because the pressure is higher than needed. Wide compressor pressure bands make it worse.',
  keywords: ['artificial demand', 'unregulated demand', 'pressure band', 'cascade control', 'control band', 'pressure/flow controller', 'master controller', 'point-of-use regulator', 'excess pressure'],
  prereq: ['pressure-optimisation', 'air-leaks', 'compressor-regulation'],
  related: ['pressure-regulators', 'receivers', 'cost-of-compressed-air', 'air-audits', 'frl-units', 'air-consumption'],
  body: `
A regulated machine takes what it needs whatever the line pressure, as long as the line stays above its regulator's setting. An **unregulated** use does not: a leak, an open blow pipe, an air tool plugged straight into a drop, a cylinder with no regulator in front of it. Its flow follows the absolute pressure in the line. When the system runs higher than necessary, all of these pass extra air. That extra is **artificial demand** — real air, made and paid for, that serves no purpose.

### How much
A choked opening passes free air in proportion to absolute pressure, so an unregulated flow $Q_1$ at $p_1$ becomes

$$Q_2 = Q_1\\,\\frac{p_2 + p_\\text{atm}}{p_1 + p_\\text{atm}}$$

at $p_2$ (gauge pressures). If a share $u$ of a plant's demand $Q$ is unregulated, the air wasted by running at $p_1$ instead of the $p_2$ the machines need is

$$Q_a = u\\,Q\\,\\frac{p_1 - p_2}{p_1 + p_\\text{atm}}$$

A plant using 20 m³/min, 30 % of it unregulated, running at 7.5 bar instead of 6.0: 1.06 m³/min of artificial demand — about 7 kW of compressor power, all year — on top of the compression saving of the lower pressure. Cylinders without regulators count too: their free air per stroke rises with the absolute pressure.

### Pressure bands
A load/unload compressor swings between a cut-in and a cut-out pressure, often a bar apart. With several compressors each gets its own band, stacked one below another so that they start in turn — a **cascade**. A plant with three machines may swing between 6.6 and 7.5 bar, and spend much of its time near the top. Everything unregulated follows the swing, and the compressors compress to the top of it.

| Control | Typical band | Average pressure above the minimum |
|---|---|---|
| Three compressors in a cascade | 0.9–1.2 bar | 0.5–0.8 bar |
| Central (master) controller | 0.2–0.3 bar | about 0.1–0.2 bar |
| Variable-speed compressor as trim | ±0.1 bar | about 0.1 bar |

### Cutting it
- **Regulate at the point of use**: a regulator at every machine, tool and blow-off, set to what the job needs (see [[pressure-regulators]]).
- **Narrow the bands**: a master controller that runs the compressors as a team, or a variable-speed trim machine (see [[compressor-regulation]]).
- **Separate storage from supply**: a precision pressure/flow controller downstream of the receivers holds the plant header steady at a lower pressure while the compressor-room pressure swings above it, so the receivers can still store air for peaks.
- And, as always, **fix the leaks** — they are the largest unregulated use (see [[leak-management]]).

> [!note] Artificial demand is why a plant sometimes seems to need *more* air after the pressure was raised to cure a complaint: every unregulated user took its share of the increase.
`,
  ideas: [
    'Unregulated uses — leaks, open blowing, tools and cylinders without regulators — pass free air in proportion to absolute pressure.',
    'Artificial demand: Qa = u·Q·(p₁ − p₂)/(p₁ + p_atm).',
    'It comes on top of the 7 % per bar compression cost.',
    'Cascaded compressor bands keep the plant well above its minimum; a master controller or VSD trim narrows them.',
    'Point-of-use regulators and pressure/flow controllers remove the excess pressure where the air is used.'
  ],
  pitfalls: [
    'Raising the pressure cannot increase the demand — Every unregulated user takes more free air at higher pressure; the demand rises with it.',
    'A regulator wastes energy by throttling — It passes only what the machine needs; without it the machine takes more air at the higher line pressure.',
    'A wide pressure band is harmless because the average is what counts — The compressors compress to the top of the band and unregulated uses follow every swing; the average itself is higher than needed.'
  ],
  formulas: [
    {
      name: 'An unregulated flow at another pressure',
      expr: 'Q2 = Q1*(p2 + patm)/(p1 + patm)', tex: 'Q_2 = Q_1\\,\\dfrac{p_2 + p_\\text{atm}}{p_1 + p_\\text{atm}}',
      vars: {
        Q2: { name: 'free-air flow at the new pressure', q: 'airflow', unit: 'm³/min ANR', tex: 'Q_2' },
        Q1: { name: 'free-air flow at the present pressure', q: 'airflow', unit: 'm³/min ANR', value: 3, tex: 'Q_1' },
        p2: { name: 'new line pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_2' },
        p1: { name: 'present line pressure (gauge)', q: 'pressure', unit: 'bar', value: 7.5, tex: 'p_1' },
        patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' }
      },
      note: 'For choked openings: leaks, blow-off nozzles, tools on full throttle. Regulated machines keep their flow as long as the line stays above their setting.',
      stories: { Q2: 'Leaks and open blowing take {Q1} at {p1}. How much will they take at {p2}?' }
    },
    {
      name: 'Artificial demand',
      expr: 'Qa = u*Q*(p1 - p2)/(p1 + patm)', tex: 'Q_a = u\\,Q\\,\\dfrac{p_1 - p_2}{p_1 + p_\\text{atm}}',
      vars: {
        Qa: { name: 'artificial demand (excess free air)', q: 'airflow', unit: 'm³/min ANR', tex: 'Q_a' },
        u: { name: 'unregulated share of the demand', q: 'ratio', unit: '%', value: 30, min: 0, max: 100, tex: 'u' },
        Q: { name: 'total demand at the present pressure', q: 'airflow', unit: 'm³/min ANR', value: 20 },
        p1: { name: 'present line pressure (gauge)', q: 'pressure', unit: 'bar', value: 7.5, tex: 'p_1' },
        p2: { name: 'pressure actually needed (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_2' },
        patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' }
      },
      note: 'The air the unregulated uses would not take at the needed pressure. The compression saving of the lower pressure comes on top.',
      stories: { Qa: 'A plant uses {Q}, of which {u} is unregulated, at {p1}; the machines need only {p2}. How much artificial demand is there?' }
    }
  ],
  examples: [
    {
      title: 'Pricing artificial demand',
      q: 'A plant uses 20 m³/min at 7.5 bar gauge, 30 % of it unregulated. The machines need 6.0 bar. What does the artificial demand cost a year at 6000 h, 6.5 kW per m³/min and ¤0.15 per kWh?',
      steps: [
        '$Q_a = 0.3 \\times 20 \\times 1.5/8.513 = 1.06$ m³/min.',
        'Power: $1.06 \\times 6.5 = 6.9$ kW; a year: 41 200 kWh.',
        'Cost: ¤6,200 — before the compression saving from the lower pressure itself.'
      ],
      a: 'About 1.06 m³/min of artificial demand, ¤6,200 a year.'
    },
    {
      title: 'Narrowing the band',
      q: 'Three cascaded compressors keep a plant between 6.6 and 7.5 bar, averaging about 7.1. A master controller would hold 6.5 ± 0.1 bar. A third of the demand is unregulated. Estimate the saving.',
      steps: [
        'Average pressure falls by about 0.6 bar.',
        'Compression: about $0.6 \\times 7 = 4$ %.',
        'Unregulated share: $u (p_1 - p_2)/(p_1 + p_\\text{atm}) = 0.33 \\times 0.6/8.1 = 2.4$ % of the demand.',
        'Together roughly 6 % of the compressed-air energy.'
      ],
      a: 'Roughly 6 % of the compressor energy.'
    }
  ],
  quiz: [
    { q: 'Which of these is NOT artificial demand when the line pressure is too high?', choices: ['a leak', 'an open blow pipe', 'a machine behind a regulator set below the line pressure', 'a tool plugged straight into a drop'], a: 2,
      why: 'The regulated machine takes the same air whatever the line pressure above its setting; the others pass more at higher pressure.' },
    { q: 'Leaks take 3 m³/min at 7.5 bar gauge. At 6.0 bar they take about…', choices: ['2.4 m³/min', '2.5 m³/min', '3.0 m³/min', '3.6 m³/min'], a: 1,
      why: 'Q₂ = 3 × 7.013/8.513 = 2.47 m³/min.' },
    { q: 'Raising the plant pressure to cure a complaint can increase the total air demand.', a: true,
      why: 'Every unregulated user passes more free air at the higher pressure.' },
    { q: 'What narrows the pressure band of a plant with several load/unload compressors?', choices: ['a larger receiver alone', 'a master controller or a variable-speed trim compressor', 'longer pipes', 'more filters'], a: 1,
      why: 'A controller runs the machines as a team within one narrow band; a VSD compressor follows demand closely.' },
    { q: 'A plant uses 10 m³/min, half unregulated, at 8 bar gauge; 6 bar would do. What is the artificial demand (m³/min)?', answer: 1.11, unit: 'm³/min', tol: 0.03,
      why: '0.5 × 10 × 2/9.013 = 1.11 m³/min.' }
  ],
  problems: [
    { q: 'Open blow-offs use 1.5 m³/min at 7 bar gauge. Regulators set them to 2 bar gauge. What do they use then?', answer: 0.564, unit: 'm³/min', tol: 0.03,
      steps: ['Choked flow follows absolute pressure: $1.5 \\times 3.013/8.013 = 0.564$ m³/min.'] }
  ],
  applications: ['Justifying point-of-use regulators on blow-offs and tools.', 'Replacing compressor cascades by a master controller.', 'Pressure/flow controllers between the compressor room and the plant.', 'Estimating the true saving of a pressure reduction.'],
  sim: 'dist-pressure-savings'
},

{
  id: 'air-saving-circuits', parent: 'air-cost', title: 'Air-saving circuits', level: 2,
  short: 'Circuits that do the same work with less air: a lower pressure for the unloaded return stroke, holding without consumption, shutting the air off when a machine stands idle, short tubes, right-sized cylinders and pulsed or amplified blowing.',
  keywords: ['air saving', 'dual pressure', 'reduced return pressure', 'return stroke', 'zero consumption holding', 'shut-off valve', 'idle shut-off', 'dead volume', 'short tubes', 'pulse blowing', 'air amplifier', 'vacuum air saving'],
  prereq: ['air-consumption', 'double-acting-cylinders', 'pressure-regulators'],
  related: ['tubing-length-effect', 'tubing-fittings', 'cost-of-compressed-air', 'leak-management', 'vacuum-energy', 'soft-start', 'check-valves-pneu', 'way-valves', 'single-acting-cylinders', 'pneumatic-cylinder'],
  body: `
A double-acting cylinder fills a chamber with compressed air on every stroke and throws it away on the next (see [[air-consumption]]). Most of the time the pressure is set by the hardest part of the job — the clamping force, the press stroke — and the rest of the cycle simply copies it. Air-saving circuits match the air to the work.

### A lower pressure for the return stroke
The return stroke usually moves only the rod and its tooling. A regulator in the line to the rod-side port, with a non-return valve bypassing it for the exhaust flow, feeds that stroke at 2–3 bar instead of 6. The air for a stroke follows the absolute pressure, so the return stroke uses $(p_2 + p_\\text{atm})/(p_1 + p_\\text{atm})$ of its former air — at 2 bar instead of 6, 43 %. For a 50 mm cylinder with a 20 mm rod that saves about a quarter of the air per cycle. The return is a little slower and softer, which often suits the end cushions. The same idea works the other way for jobs that need force only at the end of the stroke: approach at low pressure, clamp at full pressure.

### Holding without consuming
A cylinder stalled against a load uses no air as long as nothing leaks — pneumatics holds force for free, which electric drives cannot. To hold a position in mid-stroke, a closed-centre 5/3 valve or piloted non-return valves lock the air in the chambers. Vacuum grippers can do the same: an ejector with an air-saving circuit switches off once the vacuum is reached, a non-return valve holds it, and a vacuum switch restarts the ejector only if it decays (see [[vacuum-energy]]).

### Shut off when idle
A machine standing still at night, at the weekend or during a break still leaks through its couplings, fittings and worn valves — often 50–200 L/min. A 2/2 or 3/2 shut-off valve at the machine's inlet, closed by the machine control when it stops, removes that leakage entirely. With an exhausting (3/2) type it also makes the machine safe for work; on restart it should refill slowly, through a soft-start valve (see [[soft-start]]).

### Less dead volume
Tubes between valve and cylinder, and the dead space in the cylinder heads, are filled and exhausted every stroke without doing any work. Valves mounted on or close to the cylinder, or valve terminals next to the actuators, cut this — for small cylinders the tubes can use more air than the cylinder itself (see [[tubing-fittings]] and [[tubing-length-effect]]).

### Right-sized actuators and blowing
A bore chosen "one size up to be safe" uses 50–60 % more air on every stroke for ever. Short strokes, single-acting cylinders where a spring return is enough, and grippers instead of cylinder pairs all help. For blowing, pulses instead of a continuous jet, engineered nozzles and air amplifiers that entrain surrounding air, and a regulator set to the lowest pressure that does the job — often under 2 bar — cut the air by half or more.

| Measure | Typical saving |
|---|---|
| Return stroke at 2–3 bar | 20–30 % of the cylinder's air |
| Shut-off valve at idle machines | all the machine's idle leakage |
| Valve on the cylinder instead of 3 m of tube | small cylinders: more than half |
| Right-sized bore (one size down) | about 35 % |
| Pulsed blowing, engineered nozzles | 50 % or more of the blowing air |

> [!warn] Circuits that hold air in a cylinder keep it pressurised after the supply is shut off: a cylinder held by non-return valves can move when a fitting is loosened. Exhaust trapped air before maintenance, and make sure shut-off valves exhaust the machine and restart it with a soft start (ISO 4414:2010).
`,
  ideas: [
    'A stroke\'s air follows the absolute pressure: feed unloaded strokes at 2–3 bar.',
    'A stalled cylinder holds force without using air; mid-stroke holding needs closed-centre valves or piloted non-return valves.',
    'Shut-off valves at idle machines stop their leakage at nights, weekends and breaks.',
    'Tubes and dead volumes are filled every stroke: mount valves near the cylinders.',
    'Right-size bores and use pulsed, amplified or regulated blowing.'
  ],
  pitfalls: [
    'A lower return pressure makes the return stroke unreliable — The rod and tooling rarely need more than 2–3 bar; check friction and any load, and the stroke is simply softer.',
    'Holding a cylinder under pressure wastes air — A stalled cylinder uses no air unless it leaks; only movement and leakage consume air.',
    'Shutting off idle machines saves nothing because they are not working — Their couplings, hoses and valves leak whether the machine works or not; shutting off removes that leakage completely.'
  ],
  formulas: [
    {
      name: 'Air saved by a lower return pressure',
      expr: 'S = A2*s*(p1 - p2)/pn', tex: 'S = A_2\\,s\\,\\dfrac{p_1 - p_2}{p_n}',
      vars: {
        S: { name: 'free air saved per cycle', q: 'volume', unit: 'L' },
        A2: { name: 'annulus (rod-side) area', q: 'area', unit: 'cm²', value: 16.49, tex: 'A_2' },
        s: { name: 'stroke', q: 'length', unit: 'mm', value: 200 },
        p1: { name: 'full supply pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_1' },
        p2: { name: 'reduced return pressure (gauge)', q: 'pressure', unit: 'bar', value: 2, tex: 'p_2' },
        pn: { name: 'reference pressure of free air (ANR)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_n' }
      },
      note: 'Swept volume only; the rod-side tube and dead volume save in the same proportion.',
      practice: { unknowns: ['S', 'p2'] },
      stories: { S: 'A cylinder with an annulus of {A2} and a stroke of {s} returns at {p2} instead of {p1}. How much free air does it save per cycle?' }
    },
    {
      name: 'Share of the cycle\'s air saved',
      expr: 'f = A2*(p1 - p2)/((A1 + A2)*(p1 + patm))', tex: 'f = \\dfrac{A_2\\,(p_1 - p_2)}{(A_1 + A_2)\\,(p_1 + p_\\text{atm})}',
      vars: {
        f: { name: 'share of the air per cycle saved', q: 'ratio', unit: '%', tex: 'f' },
        A2: { name: 'annulus (rod-side) area', q: 'area', unit: 'cm²', value: 16.49, tex: 'A_2' },
        A1: { name: 'piston area', q: 'area', unit: 'cm²', value: 19.63, tex: 'A_1' },
        p1: { name: 'full supply pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_1' },
        p2: { name: 'reduced return pressure (gauge)', q: 'pressure', unit: 'bar', value: 2, tex: 'p_2' },
        patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' }
      },
      note: 'A double-acting cylinder, both strokes at p₁ before the change; dead volumes ignored.',
      stories: { f: 'A cylinder ({A1} piston, {A2} annulus) at {p1} gets a return-stroke regulator set to {p2}. What share of its air does that save?' }
    }
  ],
  examples: [
    {
      title: 'A regulator on the return line',
      q: 'A 50 mm cylinder (20 mm rod, 200 mm stroke) cycles 20 times a minute at 6 bar gauge, 4000 h a year. The return stroke is moved to 2 bar. How much air and money does that save (6.5 kW per m³/min, ¤0.15 per kWh)?',
      steps: [
        'Areas: $A_1 = 19.63$ cm², $A_2 = 19.63 - 3.14 = 16.49$ cm².',
        'Air per cycle before: $(19.63 + 16.49)\\times10^{-4} \\times 0.2 \\times 7.013 = 5.07$ L.',
        'Saved: $16.49\\times10^{-4} \\times 0.2 \\times 4 = 1.32$ L per cycle — 26 %.',
        'A year: $1.32 \\times 20 \\times 60 \\times 4000 = 6340$ m³; energy $6340 \\times 6.5/60 = 690$ kWh; ¤103.'
      ],
      a: 'About 1.3 L per cycle (26 %), 6300 m³ and ¤100 a year for this one cylinder.'
    },
    {
      title: 'Shutting off an idle machine',
      q: 'A packaging machine leaks 150 L/min through its couplings and valves. It stands idle but pressurised 3000 h a year. What does a shut-off valve at its inlet save (6.5 kW per m³/min, ¤0.15 per kWh)?',
      steps: [
        'Air: $0.15 \\times 60 \\times 3000 = 27\\,000$ m³ a year.',
        'Energy: $0.15 \\times 6.5 \\times 3000 = 2930$ kWh; cost ¤440.',
        'A shut-off valve costing a few hundred pays back within a year — and the machine leaks are still worth fixing for the production hours.'
      ],
      a: 'About 27 000 m³, 2900 kWh and ¤440 a year.'
    }
  ],
  quiz: [
    { q: 'Feeding a return stroke at 2 bar instead of 6 bar gauge cuts that stroke\'s air to about…', choices: ['33 %', '43 %', '67 %', '100 %'], a: 1,
      why: 'Air per stroke follows absolute pressure: 3.013/7.013 = 0.43.' },
    { q: 'A pneumatic clamp holds a part against a stop for an hour. With no leaks, how much air does it use while holding?', choices: ['as much as while moving', 'about half', 'none', 'it depends on the force'], a: 2,
      why: 'A stalled cylinder has full chambers and no flow; only movement and leakage consume air.' },
    { q: 'Shutting the air off at an idle machine only saves energy if the machine has leaks.', a: true,
      why: 'An idle machine uses air only through leakage — which nearly every machine has, so the saving is real.' },
    { q: 'Why mount valves close to small cylinders?', choices: ['to reduce noise', 'the tubes are filled and emptied every stroke, often with more air than the cylinder', 'to avoid water', 'to raise the force'], a: 1,
      why: 'Tube volume times pressure is lost every stroke; for small bores it can exceed the cylinder\'s own air.' },
    { q: 'A cylinder has A₁ = 8.04 cm², A₂ = 6.91 cm², supply 6 bar gauge. Returning at 3 bar instead saves what share of its air (%)?', answer: 19.8, unit: '%', tol: 0.03,
      why: 'f = 6.91 × 3/((8.04 + 6.91) × 7.013) = 20.73/104.8 = 0.198.' }
  ],
  problems: [
    { q: 'A 63 mm cylinder (20 mm rod, annulus 28.0 cm²) with a 300 mm stroke returns at 2.5 bar instead of 6 bar gauge. How much free air does it save per cycle?', answer: 2.94, unit: 'L', tol: 0.02,
      steps: ['$S = A_2 s (p_1 - p_2)/p_n = 28.0\\times10^{-4} \\times 0.3 \\times 3.5 = 2.94\\times10^{-3}$ m³ = 2.94 L.'] }
  ],
  applications: ['Retrofitting return-line regulators on high-duty cylinders.', 'Machine shut-off valves switched by the machine control.', 'Valve terminals mounted beside the actuators.', 'Vacuum grippers with air-saving ejectors.'],
  sim: 'dist-air-saving'
},

{
  id: 'air-audits', parent: 'air-cost', title: 'Measuring and auditing', level: 2,
  short: 'You cannot manage what you do not measure: a compressed-air audit logs flow, pressure and compressor power for a week or more, finds the baseline (mostly leaks), the specific power, the pressure profile and the wasteful uses — and puts a price on each improvement.',
  keywords: ['compressed air audit', 'energy audit', 'data logging', 'flow meter', 'thermal mass flow meter', 'power logger', 'specific power', 'baseline', 'KPI', 'ISO 11011', 'ISO 50001', 'load/unload', 'demand profile'],
  prereq: ['cost-of-compressed-air', 'air-leaks', 'compressor-regulation'],
  related: ['leak-management', 'pressure-optimisation', 'artificial-demand', 'pressure-drop-air', 'receiver-sizing', 'digital-pneumatics', 'pressure-switches', 'heat-recovery'],
  body: `
Most plants know what their electricity costs; few know what their compressed air costs, how much of it leaks or how efficiently it is made. An **audit** replaces guesses with measurements. ISO 11011:2013 describes how to assess a compressed-air system's energy efficiency, and an energy management system such as ISO 50001:2018 keeps the results working.

### What to measure
- **Flow**: a meter on the main header after the treatment, ideally a **thermal mass flow meter**, which measures mass flow and so reads free air directly, whatever the pressure. Several meters split the plant by hall or line.
- **Pressure**: at the compressor outlet, after the treatment, at the far end of the network and at the critical machines — the differences at peak flow are the drops.
- **Electrical power** of each compressor, with a true-power logger (volts, amps and power factor), not just the current.
- **Compressor states**: loaded, unloaded, stopped — from the controller or from the power readings.
- **Dew point** after the dryers, and the temperatures in the compressor room.

### How long
At least a full week including a weekend, sampled every few seconds, so that shifts, breaks, starts and the idle **baseline** all appear. Load/unload compressors switch every few tens of seconds; a logger sampling every minute misses how they really run.

### What the data tells
| Finding | What it shows |
|---|---|
| Flow at weekends and at night | the baseline: leaks plus anything left on |
| kW divided by m³/min | the specific power: 6–7 is good at 7 bar, above 8 poor |
| A compressor drawing a third of its power with no delivery | unloaded running — a control problem |
| Pressure differences at peak flow | the drops in treatment, pipework and hoses |
| Short, tall demand peaks | a job for a receiver rather than another compressor |
| Pressure far above what the machines need | the potential of lowering it |

A load/unload compressor at part load is a common discovery. Unloaded, it still draws about 25–35 % of its full power, so at 40 % of its delivery it uses 58 % of its full power — its specific power rises by nearly half. A variable-speed or smaller compressor to trim the demand, a master controller and enough storage are the cures.

### Baseline, verify, keep measuring
The audit gives the **baseline**; every measure is priced against it and verified afterwards with the same meters. Normalise to production — cubic metres per part, per tonne, per car — so that a busy month does not hide an improvement. Permanent meters with a few key numbers (weekend flow, kWh per m³, m³ per unit produced) catch new leaks and drifting controls within weeks instead of years (see [[digital-pneumatics]]).

> [!warn] Compressor rooms have hot surfaces, loud noise and machines that start automatically. Power loggers are connected inside live electrical panels: only qualified electricians should fit them, following the site's lock-out and permit rules.
`,
  ideas: [
    'Log flow, pressure at several points and compressor power for at least a week, including a weekend.',
    'Thermal mass flow meters read free air directly, independent of pressure.',
    'The weekend baseline is mostly leakage; kW per m³/min is the specific power.',
    'An unloaded compressor still draws 25–35 % of its full power: part load by load/unload is costly.',
    'Normalise to production and keep permanent meters to hold the gains.'
  ],
  pitfalls: [
    'The compressors\' running hours tell how much air the plant uses — Loaded and unloaded hours differ, and delivery depends on the machine; only a flow meter measures the air.',
    'A one-day measurement is enough — Shifts, weekends and batch processes change the demand; a week including a weekend shows the baseline and the peaks.',
    'The current drawn by a compressor gives its power — Power also depends on the voltage and power factor, which change with load; use a true-power logger.'
  ],
  formulas: [
    {
      name: 'Specific power from logged data',
      expr: 'sp = P/Q', tex: 's_p = \\dfrac{P}{Q_n}',
      vars: {
        sp: { name: 'specific power', q: false, unit: 'kW/(m³/min)', tex: 's_p' },
        P: { name: 'average electrical power of the compressors', q: false, unit: 'kW', value: 72 },
        Q: { name: 'average free-air flow (m³/min ANR)', q: false, unit: 'm³/min', value: 10.5, tex: 'Q_n' }
      },
      note: 'Over the same period, including unloaded running. Divide by 60 for kWh per m³.',
      stories: { sp: 'Over a week the compressors averaged {P} while the plant drew {Q} of free air. What is the specific power?' }
    },
    {
      name: 'Power of a load/unload compressor at part load',
      expr: 'P = Pf*(x + u*(1 - x))', tex: 'P = P_f\\,\\bigl(x + u\\,(1 - x)\\bigr)',
      vars: {
        P: { name: 'average electrical power', q: 'power', unit: 'kW' },
        Pf: { name: 'full-load power', q: 'power', unit: 'kW', value: 75, tex: 'P_f' },
        x: { name: 'load: demand as a share of the delivery', q: 'ratio', unit: '%', value: 40, min: 0, max: 100, tex: 'x' },
        u: { name: 'unloaded power as a share of full-load power', q: 'ratio', unit: '%', value: 30, min: 0, max: 100, tex: 'u' }
      },
      note: 'An idealised load/unload compressor with a large receiver; with small receivers, blow-down and frequent switching it does worse.',
      stories: { P: 'A compressor with {Pf} at full load runs at {x} of its delivery; unloaded it draws {u} of full power. What does it draw on average?' }
    }
  ],
  examples: [
    {
      title: 'Reading a week of logs',
      q: 'A week\'s logs show 9.2 m³/min for 80 production hours and a steady 2.6 m³/min for the other 88 hours; the compressors used 6800 kWh. Find the specific energy, the leak share of the week\'s air, and the yearly cost of the baseline at ¤0.15 per kWh, if the baseline is leakage.',
      steps: [
        'Air: $9.2 \\times 60 \\times 80 + 2.6 \\times 60 \\times 88 = 44\\,160 + 13\\,730 = 57\\,890$ m³.',
        'Specific energy: $6800/57\\,890 = 0.117$ kWh/m³ (7.0 kW per m³/min).',
        'Leaks run all 168 hours: $2.6 \\times 60 \\times 168 = 26\\,200$ m³ — 45 % of the week\'s air.',
        'A year: $2.6 \\times 60 \\times 8760 = 1.37$ million m³, $\\times 0.117 = 160\\,000$ kWh, ¤24,000.'
      ],
      a: '0.117 kWh per m³; leakage is 45 % of the air and costs about ¤24,000 a year.'
    },
    {
      title: 'The cost of running unloaded',
      q: 'A 75 kW load/unload compressor delivering 12 m³/min feeds a demand of 4.8 m³/min; unloaded it draws 30 % of full power. Compare its specific power with full load, and with a variable-speed compressor at 6.5 kW per m³/min.',
      steps: [
        'Load: $x = 4.8/12 = 40$ %.',
        '$P = 75 \\times (0.4 + 0.3 \\times 0.6) = 43.5$ kW; specific power $43.5/4.8 = 9.1$ kW per m³/min, against $75/12 = 6.25$ at full load.',
        'Variable speed: $4.8 \\times 6.5 = 31.2$ kW — 12.3 kW less.'
      ],
      a: '9.1 kW per m³/min at part load against 6.25 at full load; a VSD would save about 12 kW.'
    }
  ],
  quiz: [
    { q: 'Why should an audit log include a weekend?', choices: ['compressors are serviced then', 'the idle baseline — mostly leaks — shows up', 'the air is drier', 'electricity is cheaper'], a: 1,
      why: 'With production stopped, the flow that remains is leakage and anything left on: the baseline.' },
    { q: 'A thermal mass flow meter in the main is useful because…', choices: ['it measures temperature only', 'it reads mass flow, i.e. free air, whatever the line pressure', 'it needs no power', 'it measures the dew point'], a: 1,
      why: 'Mass flow divided by the density of free air is the ANR flow, independent of pressure and temperature corrections.' },
    { q: 'A compressor plant averages 90 kW while delivering 10 m³/min. Its specific power is…', choices: ['good (about 6)', 'poor (9 kW per m³/min)', 'excellent (0.9)', 'cannot be told'], a: 1,
      why: '90/10 = 9 kW per m³/min, well above the 6–7 of an efficient plant: look at part-load control.' },
    { q: 'An unloaded screw compressor draws almost no power.', a: false,
      why: 'Unloaded it still turns its motor and airend and typically draws 25–35 % of full-load power.' },
    { q: 'A 55 kW load/unload compressor runs at 50 % load and draws 30 % of full power when unloaded. What is its average power (kW)?', answer: 35.75, unit: 'kW', tol: 0.02,
      why: '55 × (0.5 + 0.3 × 0.5) = 55 × 0.65 = 35.75 kW.' }
  ],
  problems: [
    { q: 'Over a month the compressors used 36 000 kWh and the flow meter totalled 320 000 m³ of free air. What is the specific power in kW per m³/min?', answer: 6.75, unit: 'kW/(m³/min)', tol: 0.02,
      steps: ['Specific energy: $36\\,000/320\\,000 = 0.1125$ kWh/m³.', 'Specific power: $0.1125 \\times 60 = 6.75$ kW per m³/min.'] }
  ],
  applications: ['Energy audits before buying a new compressor.', 'Verifying savings from leak repair and pressure reduction.', 'Permanent monitoring with flow meters and dashboards.', 'Sizing receivers and trim compressors from demand profiles.'],
  sim: 'dist-audit-log'
},

{
  id: 'pneumatic-vs-electric', parent: 'air-cost', title: 'Pneumatic or electric?', level: 2,
  short: 'Electric actuators use far less energy per movement and can stop anywhere; pneumatic cylinders are cheaper, simpler, tougher and happy to stall against a load. Which wins depends on the duty — how often it moves, how precisely, with what force, for how many years.',
  keywords: ['electric actuator', 'electric cylinder', 'linear axis', 'ball screw', 'servo motor', 'energy per cycle', 'life-cycle cost', 'break-even', 'pneumatic vs electric', 'efficiency chain', 'holding force'],
  prereq: ['cost-of-compressed-air', 'air-consumption', 'pneumatic-cylinder'],
  related: ['air-saving-circuits', 'servo-pneumatics', 'cylinder-force', 'factory-automation', 'hydraulics:hydraulics-vs-alternatives', 'electronics:dc-motor-control', 'physics:efficiency', 'physics:kinetic-energy'],
  body: `
Follow a kilowatt-hour through a pneumatic drive: the compressor turns about 90 % of it into heat, treatment and pipes lose some of the rest, leaks take a fifth or more, and the cylinder throws its chamber of compressed air away at the end of every stroke with most of its expansion work unused. Of the electricity bought, often only 5–10 % ends up as mechanical work on the load. An electric drive — motor, gearbox or screw, controller — typically delivers 50–80 % of its input to the load. On energy alone electric wins by a factor of ten or more per movement.

### Energy per cycle
A 32 mm cylinder with a 100 mm stroke at 6 bar uses about 1.05 L of free air per cycle; at 0.108 kWh per m³ (390 kJ) that is about 410 J at the compressor. An electric axis moving 2 kg over the same stroke against 20 N of guide friction needs about 6 J for the motion — but its drive also draws a standby power of 5–20 W all the time, which at one cycle every 2 s adds 24 J. The total, about 30 J, is still a thirteenth of the pneumatic figure.

### But the purchase price
A cylinder, valve, fittings and sensors cost a few hundred ¤; an electric axis with motor and drive typically several times as much. The yearly energy saving must repay the difference. For a small cylinder at moderate duty this can take ten years or more; for a large, fast, round-the-clock actuator it can take one. The simulation on this page and the formulas show where the line lies.

### Force, holding and overload
A cylinder stalled against a load keeps its force for hours at no energy cost; an electric actuator holding force draws current (unless a self-locking screw or brake holds it) and heats. A cylinder that meets an obstruction simply stops — the air is a built-in overload protection; an electric drive must be protected by its controller. Pneumatic force per size and money is high, and speed at modest loads is easy.

### Precision and flexibility
Electric axes stop anywhere, follow programmed speed profiles, repeat to hundredths of a millimetre and change products by software. Cylinders move end to end against stops; intermediate positions need extra hardware, and servo-pneumatic positioning, though possible, is complex (see [[servo-pneumatics]]).

| | Pneumatic cylinder | Electric axis |
|---|---|---|
| Energy per movement | high (compressor, leaks, exhaust) | low (but standby power) |
| Purchase cost | low | several times higher |
| Positions | end stops, few fixed points | anywhere, programmable |
| Holding force | free while stalled | current or brake |
| Overload | stalls harmlessly | protected by the controller |
| Harsh places: washdown, heat, shocks, explosive atmospheres | robust, no sparks | needs special versions |
| Maintenance skill | simple | drives and software |

### When each wins
Pneumatics: simple end-to-end moves, clamping and holding, moderate cycle rates, many small actuators on a plant that already has air, harsh or explosive environments, tight budgets. Electric: many positions or precise profiles, high duty cycles around the clock, machines far from an air supply, and plants whose compressed air is expensive because of leaks and poor control. Many machines use both: electric axes for the motions that matter, grippers and clamps on air.

> [!note] Compare fairly: the pneumatic side should carry the true cost of its air — including leaks, pressure drops and part-load running (see [[air-audits]]) — and the electric side its standby power and higher purchase and commissioning cost.
`,
  ideas: [
    'A pneumatic drive delivers perhaps 5–10 % of the electricity bought as work; an electric one 50–80 %.',
    'Energy per cycle: a small cylinder about 400 J at the compressor; an electric axis tens of joules including standby.',
    'Pneumatic actuators are cheaper to buy, hold force for free, stall harmlessly and suit harsh places.',
    'Electric axes position anywhere, precisely and programmably.',
    'Break-even depends on the duty: seconds of cycle time and years of service decide it.'
  ],
  pitfalls: [
    'Electric actuators always pay back through energy savings — For small cylinders at low duty the energy saved per year is small and the payback can exceed the machine\'s life.',
    'Pneumatics is free to run because the plant already has compressed air — Every stroke uses electricity at the compressor; the air is among the dearest energy in the plant.',
    'An electric actuator uses energy only while moving — Its drive draws standby power continuously, and holding a force draws current.'
  ],
  formulas: [
    {
      name: 'Energy per cycle of a pneumatic cylinder (at the compressor)',
      expr: 'E = (A1 + A2)*s*(p + patm)/pn*ev', tex: 'E_p = (A_1 + A_2)\\,s\\,\\dfrac{p_g + p_\\text{atm}}{p_n}\\,e_V',
      vars: {
        E: { name: 'electrical energy per cycle', q: 'energy', unit: 'J', tex: 'E_p' },
        A1: { name: 'piston area', q: 'area', unit: 'cm²', value: 8.04, tex: 'A_1' },
        A2: { name: 'annulus area', q: 'area', unit: 'cm²', value: 6.91, tex: 'A_2' },
        s: { name: 'stroke', q: 'length', unit: 'mm', value: 100 },
        p: { name: 'supply pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' },
        pn: { name: 'reference pressure of free air (ANR)', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p_n' },
        ev: { name: 'compressor energy per m³ of free air', q: 'energydensity', unit: 'kJ/m³', value: 390, tex: 'e_V' }
      },
      note: '390 kJ/m³ is 0.108 kWh/m³ (6.5 kW per m³/min). Add the tubes, and a margin for leaks and drops, for a fair comparison.',
      practice: { unknowns: ['E', 's'] },
      stories: { E: 'A cylinder with areas {A1} and {A2} and a {s} stroke works at {p}; the compressors need {ev}. How much electricity does one cycle take?' }
    },
    {
      name: 'Energy per cycle of an electric axis',
      expr: 'E = 2*(Ff*s + m*v^2/2)/eta + Ps*T', tex: 'E_e = \\dfrac{2\\,(F_f\\,s + \\tfrac12 m v^2)}{\\eta} + P_s\\,T',
      vars: {
        E: { name: 'electrical energy per cycle', q: 'energy', unit: 'J', tex: 'E_e' },
        Ff: { name: 'friction and process force during the move', q: 'force', unit: 'N', value: 20, tex: 'F_f' },
        s: { name: 'stroke', q: 'length', unit: 'mm', value: 100 },
        m: { name: 'moving mass', q: 'mass', unit: 'kg', value: 2 },
        v: { name: 'peak speed', q: 'speed', unit: 'm/s', value: 0.5 },
        eta: { name: 'efficiency of drive, motor and screw', q: 'ratio', unit: '%', value: 70, min: 10, max: 100, tex: '\\eta' },
        Ps: { name: 'standby power of the drive', q: 'power', unit: 'W', value: 12, tex: 'P_s' },
        T: { name: 'cycle time', q: 'time', unit: 's', value: 2 }
      },
      note: 'Out and back, no braking energy recovered, no holding current. Standby power often dominates at low duty.',
      practice: { unknowns: ['E', 'T'] },
      stories: { E: 'An electric axis moves {m} over {s} and back against {Ff}, peaking at {v}, with {eta} efficiency and {Ps} standby, every {T}. How much energy per cycle?' }
    },
    {
      name: 'Break-even time of an electric actuator',
      expr: 'tb = (Ce - Cp)*3.6e6/((Ep - Ee)*N*c)', tex: 't_b = \\dfrac{(C_e - C_p)\\cdot 3.6\\times10^{6}}{(E_p - E_e)\\,N\\,c_e}',
      vars: {
        tb: { name: 'break-even time', q: 'years', unit: 'yr', tex: 't_b' },
        Ce: { name: 'price of the electric solution', q: 'money', unit: '$', value: 1600, tex: 'C_e' },
        Cp: { name: 'price of the pneumatic solution', q: 'money', unit: '$', value: 300, tex: 'C_p' },
        Ep: { name: 'pneumatic energy per cycle', q: 'energy', unit: 'J', value: 409, tex: 'E_p' },
        Ee: { name: 'electric energy per cycle', q: 'energy', unit: 'J', value: 30, tex: 'E_e' },
        N: { name: 'cycles per year', value: 7200000 },
        c: { name: 'electricity price per kWh', q: 'money', unit: '$', value: 0.15, tex: 'c_e' }
      },
      note: 'Energies in J (3.6 × 10⁶ J per kWh); energy savings only, undiscounted.',
      stories: { tb: 'An electric axis costs {Ce} against {Cp} for a cylinder; per cycle it uses {Ee} against {Ep}, for {N} cycles a year at {c} per kWh. When does it pay back?' }
    }
  ],
  examples: [
    {
      title: 'A small cylinder at moderate duty',
      q: 'A 32 mm cylinder (12 mm rod, 100 mm stroke, 6 bar) cycles 30 times a minute for 4000 h a year. An electric axis doing the job uses 30 J per cycle. The cylinder solution costs ¤300, the electric one ¤1,600; electricity ¤0.15 per kWh. When does the electric axis pay back?',
      steps: [
        'Pneumatic: $(8.04 + 6.91)\\times10^{-4} \\times 0.1 \\times 7.013 \\times 390\\,000 = 409$ J per cycle.',
        'Cycles: $30 \\times 60 \\times 4000 = 7.2\\times10^{6}$ a year.',
        'Energy: pneumatic 818 kWh (¤123), electric 61 kWh (¤9).',
        'Break-even: $1300/(123 - 9) = 11.4$ years.'
      ],
      a: 'About 11 years — the cylinder is the economic choice here.'
    },
    {
      title: 'A big cylinder round the clock',
      q: 'A 63 mm cylinder (20 mm rod, 300 mm stroke, 6 bar) cycles 20 times a minute for 7000 h a year; leaks and drops add 30 % to its air. An electric axis would use 108 J per cycle. The pneumatic solution costs ¤500, the electric ¤3,000. Break-even?',
      steps: [
        'Air per cycle: $(31.17 + 28.03)\\times10^{-4} \\times 0.3 \\times 7.013 \\times 1.3 = 0.0162$ m³; energy $0.0162 \\times 390\\,000 = 6.3$ kJ.',
        'Cycles: $20 \\times 60 \\times 7000 = 8.4\\times10^{6}$; pneumatic energy 14 700 kWh (¤2,210), electric 252 kWh (¤38).',
        'Break-even: $2500/(2210 - 38) = 1.15$ years.'
      ],
      a: 'A little over a year — electric wins clearly.'
    }
  ],
  quiz: [
    { q: 'Of the electricity bought for a pneumatic drive, roughly how much ends up as work on the load?', choices: ['5–10 %', '40–50 %', '70–80 %', '95 %'], a: 0,
      why: 'Most is heat at the compressor; leaks, drops and the exhausted air take much of the rest.' },
    { q: 'Which suits holding a clamping force for hours at the lowest energy cost?', choices: ['an electric screw actuator without a brake', 'a pneumatic cylinder', 'both the same', 'neither can hold'], a: 1,
      why: 'A stalled cylinder uses no air (without leaks); a motor holding force draws current continuously unless locked by a brake or self-locking screw.' },
    { q: 'A machine must stop a slide at 25 different positions with ±0.05 mm repeatability. The natural choice is…', choices: ['a pneumatic cylinder', 'an electric axis', 'a single-acting cylinder', 'a rodless cylinder with stops'], a: 1,
      why: 'Electric axes position anywhere and repeat precisely; cylinders work end to end.' },
    { q: 'An electric actuator always pays back its higher price through energy savings within a few years.', a: false,
      why: 'For small, lightly used cylinders the saving per year is small; payback can exceed ten years.' },
    { q: 'Using 390 kJ per m³ of free air, how much electrical energy (J) does a cylinder cycle use that throws away 2.0 L of free air?', answer: 780, unit: 'J', tol: 0.02,
      why: '0.002 m³ × 390 000 J/m³ = 780 J.' }
  ],
  problems: [
    { q: 'An electric axis uses 25 J per cycle and a cylinder 400 J; 5 million cycles a year; electricity 0.15 per kWh; the axis costs 1000 more. What is the break-even time in years?', answer: 12.8, unit: 'yr', tol: 0.02,
      steps: ['Saving per year: $(400 - 25) \\times 5\\times10^6 = 1.875\\times10^9$ J = 521 kWh, 78.1 in money.', 'Break-even: $1000/78.1 = 12.8$ years.'] }
  ],
  applications: ['Choosing actuators for a new machine on life-cycle cost.', 'Replacing high-duty cylinders by electric axes in energy programmes.', 'Mixed machines: electric motion axes with pneumatic grippers and clamps.', 'Explosive-atmosphere and washdown areas where pneumatics remains the simple choice.'],
  sim: 'dist-pneu-vs-electric'
}

);
