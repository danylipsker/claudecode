/* HYPER-PNEUMATICS · content/production.js
 * Branch "Producing Compressed Air": the topics `compressors` (types, piston, screw, scroll and vane,
 * centrifugal, the work of compression, multistage compression, free air delivery) and
 * `compressor-control` (regulation, receivers, receiver sizing, heat recovery).
 * Simulations in sims/production.js (ids comp-…). */
Hyper.add(

{
  id: 'compressor-types', parent: 'compressors', title: 'Types of compressor', level: 1,
  short: 'A compressor either traps air and shrinks it — piston, screw, scroll and vane machines, the positive-displacement family — or gives it speed and slows it down so the speed turns into pressure — centrifugal and axial machines. How much air is needed, at what pressure and how steadily decides which.',
  keywords: ['compressor', 'air compressor', 'positive displacement', 'dynamic compressor', 'piston compressor', 'screw compressor', 'centrifugal compressor', 'scroll', 'vane', 'blower', 'oil-free', 'oil-injected', 'pressure ratio', 'selection'],
  prereq: ['absolute-gauge-pressure', 'standard-air', 'isothermal-adiabatic'],
  related: ['reciprocating-compressors', 'screw-compressors', 'scroll-vane-compressors', 'centrifugal-compressors', 'fad-capacity', 'compression-work', 'compressor-regulation', 'iso-8573', 'hydraulics:positive-displacement', 'hydraulics:centrifugal-pump'],
  body: `
A compressor takes in air at atmospheric pressure and delivers it at a higher one — in a factory usually 6–8 bar gauge, so each cubic metre drawn in is squeezed into about an eighth of its volume. There are only two ways to do that, and every machine on these pages uses one of them.

### Positive displacement: trap it and shrink it
A **positive-displacement** compressor closes a pocket of air and makes the pocket smaller. In a **piston** compressor the pocket is a cylinder and the piston moves in it; in a **screw** compressor it is the groove between two meshing rotors; in a **scroll** it is a crescent between two spirals; in a **vane** compressor it is a cell between sliding vanes. Each revolution moves a fixed volume, so the delivery is set by the speed and hardly changes with the discharge pressure — just like a [[hydraulics:positive-displacement|positive-displacement pump]]. Close the outlet and the pressure keeps rising until something gives, which is why every one of them needs a safety valve.

### Dynamic: speed it up, then slow it down
A **dynamic** compressor gives the air speed with a fast impeller or rotating blades and then slows it in a diffuser, where the kinetic energy becomes pressure (see [[aerodynamics:stagnation-properties|stagnation properties]]). **Centrifugal** compressors throw the air outwards; **axial** ones push it along the shaft, as in a jet engine. Their pressure rise is set by the tip speed, and their flow depends strongly on the pressure they work against. Below a minimum flow they **surge** — the flow breaks down and reverses — so they suit large, steady demands.

| Type | Typical power | Pressure (gauge) | Where it is used |
|---|---|---|---|
| Piston, one stage | 0.5–7.5 kW | up to 8–10 bar | workshops, garages, intermittent use |
| Piston, two or more stages | 3–500 kW | 10–40 bar, up to 400 bar | bottle blowing, breathing air, gas |
| Scroll (oil-free) | 1.5–15 kW per module | 8–10 bar | laboratories, dental and medical air |
| Rotary vane | 2–75 kW | 7–10 bar | small industry, mobile units |
| Screw, oil-injected | 4–500 kW | 5–13 bar | most factories |
| Screw, oil-free | 15–900 kW | 4–10 bar | food, pharmaceuticals, electronics |
| Centrifugal | 150 kW to many MW | 3–13 bar | large plants, steady base load |
| Blowers (lobe, screw, turbo) | 5–400 kW | below about 1 bar | conveying, aeration |

The figures are typical ranges, rounded: they overlap, and makers push every boundary. The simulation below draws them as regions on a chart of flow against pressure.

### Pressure ratio
What a compressor has to achieve is a **pressure ratio**, counted in absolute pressures:

$$r = \\frac{p_g + p_\\text{atm}}{p_\\text{atm}}$$

So 7 bar gauge is a ratio of 7.9, not 7. The ratio decides the work per cubic metre (see [[compression-work]]) and the temperature the air reaches — about 255 °C for 7.9 : 1 without cooling — so one stage of a machine can only manage so much: about 8–10 : 1 for a lubricated piston, about 14 : 1 for an oil-injected screw whose oil soaks up the heat, 2–3 : 1 for a centrifugal impeller. Beyond that the air is compressed in [[multistage-intercooling|stages with coolers between them]].

### Oil-injected or oil-free
In an oil-injected machine oil is sprayed into the compression space to seal, lubricate and cool; a separator takes most of it out again, leaving a few milligrams per cubic metre. Oil-free machines keep lubricant out of the compression chamber altogether, for air that touches food, medicines, paint or electronics (class 0 of [[iso-8573|ISO 8573-1:2010]]). They cost more to buy — and "oil-free" describes the machine, not the air: oil vapour drawn in from a polluted intake still comes through.

> [!key] Positive-displacement machines deliver a volume per revolution and push to whatever pressure the system demands; dynamic machines make a pressure rise from their speed and let the flow follow. Small and varying demands favour the first, very large and steady ones the second.

> [!warn] Every positive-displacement compressor must be protected by a safety valve that can pass its full delivery: with the outlet closed its pressure rises without limit. Never block, adjust or remove it.
`,
  ideas: [
    'Positive-displacement compressors trap a pocket of air and shrink it: piston, screw, scroll, vane.',
    'Dynamic compressors give the air speed and turn it into pressure in a diffuser: centrifugal and axial.',
    'A positive-displacement machine delivers roughly a fixed volume per revolution whatever the pressure, so it needs a safety valve.',
    'The pressure ratio is counted in absolute pressures: 7 bar gauge is 7.9 : 1.',
    'Oil-injected screws dominate factory air; pistons serve small and high-pressure needs, centrifugals the largest steady demands.'
  ],
  pitfalls: [
    'The pressure ratio is the gauge pressure — Ratios use absolute pressures: 7 bar gauge is 8.0 bar absolute, a ratio of 7.9 from sea-level air, and nearer 10 at 2000 m.',
    'Oil-free compressors make oil-free air — The name describes the compression chamber. Hydrocarbons in the intake air pass straight through, so critical uses still filter and measure to the ISO 8573-1 class they need.',
    'A bigger compressor is always more efficient — Only while it runs loaded. A large fixed-speed machine idling half the time can use more energy than a smaller one matched to the demand.'
  ],
  formulas: [
    {
      name: 'Pressure ratio',
      expr: 'r = (p + patm)/patm', tex: 'r = \\dfrac{p_g + p_\\text{atm}}{p_\\text{atm}}',
      vars: {
        r: { name: 'pressure ratio (absolute)', tex: 'r' },
        p: { name: 'discharge pressure (gauge)', q: 'pressure', unit: 'bar', value: 7, tex: 'p_g' },
        patm: { name: 'atmospheric pressure at the intake (absolute)', q: 'pressure', unit: 'bar', value: 1.013, tex: 'p_\\text{atm}' }
      },
      note: 'At 2000 m the atmosphere is about 0.795 bar, so the same gauge pressure needs a larger ratio — more work and a hotter discharge for each cubic metre drawn in.',
      practice: { unknowns: ['r', 'p'] },
      stories: {
        r: 'A compressor where the atmosphere is {patm} delivers air at {p}. What pressure ratio does it work against?',
        p: 'A single stage can manage a pressure ratio of {r} with its intake at {patm}. What gauge pressure can it deliver?'
      }
    }
  ],
  examples: [
    {
      title: 'Choosing a type for a factory',
      q: 'A plant needs 25 m³/min of free air at 7 bar gauge for two shifts a day, with demand swinging between 12 and 25 m³/min. Which kind of compressor, and roughly how much electrical power?',
      steps: [
        'At 25 m³/min and 7 bar the plant sits squarely in oil-injected screw territory: too small for a centrifugal (which starts to make sense for steady demands above roughly 30–50 m³/min) and too large for piston machines.',
        'A good screw package needs about 6.5 kW per m³/min at 7 bar (see [[fad-capacity]]): $25 \\times 6.5 \\approx 160$ kW in all.',
        'Because demand swings, two machines of about 90 kW (roughly 15 m³/min each) — one fixed-speed for the base load and one with a variable-speed drive to follow the swings — avoid running a big machine unloaded, and either can carry the plant partly if the other is down (see [[compressor-regulation]]).'
      ],
      a: 'Oil-injected screws, about 160 kW in all — for instance two of about 90 kW, one of them variable-speed.'
    },
    {
      title: 'The same gauge pressure in the mountains',
      q: 'A compressor delivering 7 bar gauge is moved from sea level (1.013 bar) to a mine at 2000 m, where the atmosphere is 0.795 bar. What pressure ratio must it now reach, and what happens to the temperature of an uncooled compression from 20 °C?',
      steps: [
        'Sea level: $r = (7 + 1.013)/1.013 = 7.91$.',
        'At 2000 m: $r = (7 + 0.795)/0.795 = 9.81$.',
        'Adiabatic discharge temperature $T_2 = T_1 r^{0.286}$: $293.15 \\times 7.91^{0.286} = 529$ K (256 °C) at sea level, $293.15 \\times 9.81^{0.286} = 563$ K (290 °C) in the mine.',
        'Each cubic metre drawn in also holds about a fifth less air ($0.795/1.013 = 0.785$), so the machine delivers fewer kilograms for nearly the same power.'
      ],
      a: 'The ratio rises from 7.9 to 9.8 and the uncooled discharge temperature from about 256 °C to 290 °C.'
    }
  ],
  quiz: [
    { q: 'The outlet valve of a running screw compressor is closed by mistake and its pressure control fails. What happens?', choices: ['The flow simply stops and the pressure stays where it was', 'The pressure keeps rising until the safety valve opens — or something bursts', 'The compressor surges and the pressure falls', 'The motor speeds up'], a: 1,
      why: 'A positive-displacement machine moves a fixed volume every revolution; with nowhere to go, the pressure climbs until the safety valve relieves it. Surge belongs to dynamic compressors.' },
    { q: 'A plant needs 400 m³/min of air at 7 bar gauge around the clock, fairly steadily. Which type is most likely to carry the base load?', choices: ['Single-stage piston compressors', 'Scroll modules', 'A multistage centrifugal compressor', 'Rotary vane compressors'], a: 2,
      why: 'Very large, steady flows are where centrifugals shine: oil-free air, few wearing parts and good efficiency at the design point. Screws may trim the swings.' },
    { q: 'An oil-free compressor always delivers air of ISO 8573-1 class 0 for oil, whatever its intake.', a: false,
      why: '"Oil-free" means no oil in the compression chamber. Oil vapour and aerosols in the intake air (from engines or processes nearby) pass through; the class must still be reached and checked at the point of use.' },
    { q: 'What pressure ratio does a compressor at sea level (1.013 bar) work against when it delivers 10 bar gauge?', answer: 10.87, tol: 0.02,
      why: '$r = (10 + 1.013)/1.013 = 10.87$ — absolute pressures, not 10.' },
    { q: 'Why are centrifugal compressors not built for 0.5 m³/min?', choices: ['Air cannot be compressed by speed alone at small flows', 'A tiny impeller would need impractically high speeds, and its clearances and friction would ruin the efficiency', 'They are always oil-injected', 'Small flows would make them immune to surge'], a: 1,
      why: 'The pressure rise depends on tip speed, so a small impeller must spin enormously fast; its leakage and friction losses grow large compared with the flow. Positive-displacement machines win at small flows.' }
  ],
  applications: [
    'Workshop and garage compressors: small piston machines on a receiver.',
    'Factory air systems: oil-injected screws from a few kilowatts to several hundred.',
    'Oil-free air for food, pharmaceutical, textile and electronics plants: oil-free screws, scrolls and centrifugals.',
    'High pressure: multistage piston compressors fill breathing-air cylinders and blow PET bottles at about 40 bar.'
  ],
  history: 'The positive-displacement family is old — a blacksmith\'s bellows is one — and the first large air compressors of the 19th century were piston machines driven by steam or water. Dynamic compressors came with the steam turbine around 1900 and were refined for jet engines in the 1930s and 40s. The oil-injected screw, today\'s workhorse, spread only from the 1960s.',
  sim: 'comp-selection-map'
},

{
  id: 'reciprocating-compressors', parent: 'compressors', title: 'Piston compressors', level: 2,
  short: 'A piston moving in a cylinder with self-acting valves: simple, able to reach very high pressures in several stages, but pulsating, noisy and never able to deliver its full swept volume, because the air left in the clearance re-expands before new air can enter.',
  keywords: ['piston compressor', 'reciprocating compressor', 'clearance volume', 'volumetric efficiency', 're-expansion', 'indicator diagram', 'p-V diagram', 'single-acting', 'double-acting', 'two-stage', 'crosshead', 'plate valve', 'reed valve', 'duty cycle'],
  prereq: ['compressor-types', 'isothermal-adiabatic', 'boyles-law'],
  related: ['compression-work', 'multistage-intercooling', 'fad-capacity', 'receivers', 'air-brakes', 'hydraulics:piston-pumps', 'physics:heat-engines'],
  body: `
A piston compressor is the bicycle pump made mechanical. A crankshaft drives a piston up and down in a cylinder, and two self-acting valves in the head — thin steel plates or reeds held shut by light springs — open whenever the pressure difference across them points the right way. Nothing times them; the air does.

### The cycle on a p–V diagram
Follow one revolution on a pressure–volume, or **indicator**, diagram:

1. **Compression (1→2).** Both valves are shut; the rising piston squeezes the air along a polytrope, $pV^n$ = constant.
2. **Discharge (2→3).** When the cylinder pressure passes the line pressure the discharge valve opens and the air is pushed out at roughly constant pressure.
3. **Re-expansion (3→4).** The piston cannot touch the head — the valves need room, and parts grow when hot — so a **clearance volume** $V_c$ stays full of air at discharge pressure. As the piston descends this air expands again, and nothing can enter until it has fallen to the suction pressure.
4. **Suction (4→1).** The suction valve opens and fresh air follows the piston down to bottom dead centre.

The enclosed area is the indicated work of one cycle. The air actually drawn in is only $V_1 - V_4$, not the whole swept volume $V_s$.

### Volumetric efficiency
With the clearance ratio $c = V_c/V_s$, the re-expanding clearance air takes up part of every suction stroke:

$$\\eta_v = 1 - c\\left[\\left(\\frac{p_2}{p_1}\\right)^{1/n} - 1\\right]$$

| Clearance $c$ | at 4 : 1 | at 8 : 1 | at 12 : 1 |
|---|---|---|---|
| 3 % | 94 % | 88 % | 83 % |
| 5 % | 90 % | 80 % | 71 % |
| 10 % | 81 % | 60 % | 42 % |

(With $n = 1.3$.) The higher the pressure ratio, the more of the stroke is lost — at a ratio of $(1 + 1/c)^n$, about 52 : 1 for 5 % clearance, nothing is delivered at all. Real machines lose more: the intake air is warmed by hot cylinder walls, the valves throttle the flow, and some air slips past the rings. A small air-cooled workshop compressor typically delivers 60–75 % of its displacement as free air, a large water-cooled one 80–90 %.

### Single- and double-acting, one or more stages
Most small compressors are **single-acting** trunk-piston machines: the piston works on one side and the connecting rod bears directly on it. Large industrial machines were built **double-acting** with a crosshead, compressing on both sides of the piston — efficient and long-lived, but heavy and needing a foundation; screws have largely replaced them for plant air. Because the discharge temperature climbs quickly with the ratio (about 200–250 °C at 8 : 1, where lubricating oil begins to form carbon), single-stage machines stop at about 8–10 bar. Above that, a large low-pressure cylinder feeds a small high-pressure one through an **intercooler**: two stages for 10–40 bar, three or four for breathing-air and gas cylinders at 200–300 bar (see [[multistage-intercooling]]).

### Duty cycle and pulsation
Small air-cooled piston compressors are built to rest between runs: many are rated for about 50–70 % running time and wear fast if they run continuously. Their flow comes in pulses, so they always feed a [[receivers|receiver]], which also lets the motor stop between cycles.

> [!warn] Cylinder heads and discharge pipes of piston compressors run hot enough to burn. Carbon from overheated oil can build up in discharge lines and ignite, so keep valves and coolers clean, use the oil the maker specifies and watch the discharge temperature. Fit belt guards, and exhaust the receiver and lock out the motor before any maintenance.
`,
  ideas: [
    'Self-acting valves open when the pressure difference across them reverses: suction below line pressure, discharge above it.',
    'The clearance air re-expands before new air can enter, so a piston compressor draws in less than its swept volume.',
    'Volumetric efficiency falls as the pressure ratio rises; at (1 + 1/c)ⁿ the delivery stops altogether.',
    'Single stages stop at about 8–10 bar because of discharge temperature; higher pressures use two to four stages with intercoolers.',
    'Small piston compressors are for intermittent duty and always need a receiver.'
  ],
  pitfalls: [
    'A piston compressor delivers its displacement — Clearance re-expansion, intake heating, valve losses and leakage mean a small machine delivers only 60–75 % of it as free air.',
    'A smaller clearance is just a detail — At high pressure ratios the clearance decides how much air is delivered: 10 % clearance at 8 : 1 wastes 40 % of the stroke.',
    'Re-expansion wastes the energy of the clearance air — The expanding air pushes on the piston and gives most of its work back; clearance mainly costs capacity, not energy.'
  ],
  formulas: [
    {
      name: 'Free air delivery of a piston compressor',
      expr: 'Q = eta*z*pi*D^2/4*s*n', tex: 'Q = \\eta\\, z\\, \\dfrac{\\pi D^2}{4}\\, s\\, n',
      vars: {
        Q: { name: 'free air delivered', q: 'airflow', unit: 'L/min ANR', tex: 'Q' },
        eta: { name: 'overall volumetric efficiency (delivery ÷ displacement)', q: 'ratio', unit: '%', value: 75, min: 1, max: 100, tex: '\\eta' },
        z: { name: 'number of first-stage cylinders (single-acting)', q: 'count', value: 2, int: true, min: 1, max: 16, tex: 'z' },
        D: { name: 'bore', q: 'length', unit: 'mm', value: 65, tex: 'D' },
        s: { name: 'stroke', q: 'length', unit: 'mm', value: 50, tex: 's' },
        n: { name: 'crankshaft speed', q: 'frequency', unit: 'rpm', value: 1200, tex: 'n' }
      },
      note: 'Swept volume × speed is the displacement; the volumetric efficiency (clearance, heating, valve losses, leakage) turns it into free air delivery. Count a double-acting cylinder twice, less the rod area on one side.',
      practice: { unknowns: ['Q', 'n', 'eta'] },
      stories: {
        Q: 'A compressor with {z} cylinders of {D} bore and {s} stroke runs at {n}; its volumetric efficiency is {eta}. What free air does it deliver?',
        eta: 'A compressor with {z} cylinders of {D} bore and {s} stroke at {n} is measured to deliver {Q}. What is its overall volumetric efficiency?',
        n: 'A compressor with {z} cylinders of {D} bore and {s} stroke (volumetric efficiency {eta}) must deliver {Q}. How fast must it turn?'
      }
    },
    {
      name: 'Volumetric efficiency from the clearance',
      expr: 'etav = 1 - c*((p2/p1)^(1/n) - 1)', tex: '\\eta_v = 1 - c\\left[\\left(\\dfrac{p_2}{p_1}\\right)^{1/n} - 1\\right]',
      vars: {
        etav: { name: 'volumetric efficiency (clearance only)', q: 'ratio', unit: '%', tex: '\\eta_v' },
        c: { name: 'clearance ratio (clearance ÷ swept volume)', q: 'ratio', unit: '%', value: 5, min: 0.1, max: 50, tex: 'c' },
        p2: { name: 'discharge pressure (absolute)', q: 'pressure', unit: 'bar', value: 8, tex: 'p_2' },
        p1: { name: 'suction pressure (absolute)', q: 'pressure', unit: 'bar', value: 1, tex: 'p_1' },
        n: { name: 'polytropic exponent of the re-expansion', value: 1.3, min: 1, max: 1.45, tex: 'n' }
      },
      note: 'The ideal effect of clearance alone. Intake heating, valve losses and leakage lower the real figure further.',
      practice: { unknowns: ['etav', 'c', 'p2'] },
      stories: {
        etav: 'A piston compressor has a clearance of {c} and compresses from {p1} to {p2}; the clearance air re-expands with n = {n}. What fraction of the stroke draws in fresh air?',
        c: 'To keep a clearance volumetric efficiency of {etav} from {p1} to {p2} (n = {n}), how large may the clearance be?',
        p2: 'A compressor with {c} clearance draws air at {p1} (n = {n}). Up to what discharge pressure does its clearance volumetric efficiency stay at {etav}?'
      }
    },
    {
      name: 'Compressor size for a duty cycle',
      expr: 'Qc = Qd/dc', tex: 'Q_c = \\dfrac{Q_d}{\\delta}',
      vars: {
        Qc: { name: 'free air delivery the compressor needs', q: 'airflow', unit: 'L/min ANR', tex: 'Q_c' },
        Qd: { name: 'average air demand', q: 'airflow', unit: 'L/min ANR', value: 180, tex: 'Q_d' },
        dc: { name: 'allowed running time (duty cycle)', q: 'ratio', unit: '%', value: 60, min: 5, max: 100, tex: '\\delta' }
      },
      note: 'Small air-cooled piston compressors are often rated for 50–70 % running time; screw and scroll compressors for continuous duty (100 %).',
      stories: {
        Qc: 'A workshop uses {Qd} of free air on average, and its compressor may run at most {dc} of the time. What free air delivery must the compressor have?',
        Qd: 'A compressor delivering {Qc} may run {dc} of the time. What average demand can it supply?'
      }
    }
  ],
  examples: [
    {
      title: 'A workshop compressor',
      q: 'A twin-cylinder compressor has a bore of 65 mm and a stroke of 50 mm and runs at 1200 rpm. A pump-up test shows a volumetric efficiency of 72 %. What are its displacement and free air delivery, and can it supply a spray gun needing 200 L/min if it may run 60 % of the time?',
      steps: [
        'Swept volume per cylinder: $\\pi \\times 0.065^2/4 \\times 0.05 = 1.659\\times10^{-4}$ m³ = 0.166 L.',
        'Displacement: $2 \\times 0.166 \\times 1200 = 398$ L/min.',
        'Free air delivery: $0.72 \\times 398 = 287$ L/min.',
        'Running at most 60 % of the time it can supply on average $0.6 \\times 287 = 172$ L/min. The gun at 200 L/min would keep it running 70 % of the time — more than its rating.'
      ],
      a: 'Displacement 398 L/min, delivery 287 L/min: too small for continuous spraying at 200 L/min.'
    },
    {
      title: 'Clearance at a higher pressure',
      q: 'A single-stage compressor with 5 % clearance (n = 1.3) is re-set from 7 to 12 bar gauge — 8 and 13 bar absolute from 1 bar. How does its clearance volumetric efficiency change, and what if two stages share the work?',
      steps: [
        'At 8 : 1: $8^{1/1.3} = 4.951$, so $\\eta_v = 1 - 0.05\\,(4.951 - 1) = 0.80$.',
        'At 13 : 1: $13^{1/1.3} = 7.19$, so $\\eta_v = 1 - 0.05\\,(7.19 - 1) = 0.69$.',
        'In two stages each cylinder works at $\\sqrt{13} = 3.61 : 1$: $3.61^{1/1.3} = 2.68$, so $\\eta_v = 1 - 0.05\\,(2.68 - 1) = 0.92$.'
      ],
      a: 'It falls from 80 % to 69 % in one stage; with two stages each keeps about 92 %.'
    }
  ],
  quiz: [
    { q: 'Why does a piston compressor draw in less air per stroke than its swept volume?', choices: ['The spring-loaded suction valve opens late, and that is all', 'The air left in the clearance must re-expand to suction pressure before new air can enter — and the intake air is also warmed and throttled', 'The rings let air into the crankcase on the suction stroke', 'Air is compressible, so a cylinder can never be filled'], a: 1,
      why: 'Re-expansion of the clearance air takes up the first part of the suction stroke; heating by hot walls, valve pressure drops and leakage lower the delivery further.' },
    { q: 'A compressor has 4 % clearance and works at a pressure ratio of 9 with n = 1.35. What is its clearance volumetric efficiency, as a percentage?', answer: 83.6, tol: 0.02,
      why: '$9^{1/1.35} = 5.09$; $\\eta_v = 1 - 0.04 \\times (5.09 - 1) = 0.836$.' },
    { q: 'Large industrial piston compressors can cut their output in steps by opening extra "clearance pockets" on the cylinder. Why does that reduce the delivery?', choices: ['It lets air leak to the atmosphere', 'A larger clearance holds more compressed air, which re-expands over more of the stroke and leaves less room for fresh air', 'It lowers the discharge pressure', 'It slows the crankshaft'], a: 1,
      why: '$\\eta_v$ falls as $c$ grows: the pocket stores compressed air that is given back to the cylinder on the next stroke instead of being delivered. Little energy is lost, because the re-expanding air pushes on the piston.' },
    { q: 'Single-stage piston compressors stop at about 8–10 bar mainly because…', choices: ['the crankshaft cannot carry more force', 'the discharge temperature gets too high for oil and valves, and the volumetric efficiency falls away', 'the suction valve cannot open', 'air liquefies above 10 bar'], a: 1,
      why: 'At 8 : 1 an uncooled compression reaches 200–250 °C, where oil forms carbon and valves suffer, and clearance losses grow with the ratio. Staging with intercooling solves both.' },
    { q: 'The indicated work of one cycle is the area enclosed by the loop on the p–V diagram.', a: true,
      why: 'Round a closed cycle the net work done on the air is $\\oint p\\,dV$, the enclosed area — the classic way of reading work from an indicator diagram.' }
  ],
  problems: [
    { q: 'A three-cylinder compressor (bore 80 mm, stroke 60 mm, single-acting) runs at 950 rpm with an overall volumetric efficiency of 78 %. What free air does it deliver?', answer: 670, unit: 'L/min', tol: 0.02,
      steps: ['Swept volume per cylinder: $\\pi \\times 0.08^2/4 \\times 0.06 = 3.016\\times10^{-4}$ m³.', 'Displacement: $3 \\times 3.016\\times10^{-4} \\times 950 = 0.860$ m³/min.', 'Delivery: $0.78 \\times 0.860 = 0.670$ m³/min = 670 L/min.'] },
    { q: 'At what pressure ratio does a compressor with 6 % clearance (n = 1.3) stop delivering air altogether?', answer: 41.8, tol: 0.02,
      steps: ['Delivery stops when $\\eta_v = 0$: $(p_2/p_1)^{1/n} = 1 + 1/c = 17.67$.', '$p_2/p_1 = 17.67^{1.3} = 41.8$.'] }
  ],
  applications: [
    'Workshop, garage and tyre-inflation compressors.',
    'The engine-driven compressor that supplies the air brakes of every heavy truck and bus.',
    'High-pressure compressors for breathing-air cylinders, PET bottle blowing and natural-gas vehicles.',
    'Oil-free piston compressors for dental and laboratory air.'
  ],
  history: 'The first large air compressors, built for the rock drills of the Alpine rail tunnels in the 1860s and 70s, were piston machines, some with water sprayed into the cylinders against the heat. The indicator diagram — a pen moved by the cylinder pressure, drawing on a card moved by the piston — came from the steam engines of James Watt\'s workshop in the 1790s and remained the standard way to diagnose valves and clearance for more than a century.',
  sim: 'comp-piston-pv'
},

{
  id: 'screw-compressors', parent: 'compressors', title: 'Rotary screw compressors', level: 2,
  short: 'Two meshing helical rotors trap air in their grooves and carry it along while the grooves close up: a smooth, valveless machine that runs continuously. Oil-injected screws, cooled and sealed by oil, supply most factory air from about 5 to 500 kW; oil-free screws do the same without oil, in two stages.',
  keywords: ['screw compressor', 'rotary screw', 'oil-injected', 'oil-flooded', 'oil-free screw', 'male rotor', 'female rotor', 'built-in volume ratio', 'over-compression', 'under-compression', 'separator', 'oil cooler', 'timing gears', 'air end'],
  prereq: ['compressor-types', 'isothermal-adiabatic', 'compression-work'],
  related: ['compressor-regulation', 'heat-recovery', 'fad-capacity', 'multistage-intercooling', 'scroll-vane-compressors', 'iso-8573', 'hydraulics:gear-pumps'],
  body: `
Look into the "air end" of a screw compressor and you find two rotors like thick, twisted gears: a **male** rotor, usually with four or five convex lobes, and a **female** rotor with five to seven concave flutes. As they turn, a groove opens at the inlet end and fills with air; further round, the meshing lobe seals it off and presses into it from behind, so the trapped pocket shrinks as it travels along the rotors towards the outlet. When the pocket reaches the edge of the discharge port it opens and empties. Several pockets are at work at once, so the flow is almost free of pulsation; there are no valves and nothing rubs, so a screw can run day and night for tens of thousands of hours.

### Oil-injected screws
In the most common type, oil is sprayed into the compression space — several times the mass of the air. It seals the small clearances between rotors and housing, lets the male rotor drive the female directly, and above all soaks up the heat of compression, so a single stage reaches 7–13 bar with the mixture leaving at only 75–95 °C instead of the 250 °C an uncooled compression would reach. A **separator** vessel takes the oil back out, down to a few milligrams per cubic metre; a cooler and a thermostatic valve keep it at the right temperature — hot enough that water does not condense in it, cool enough that it does not age — and it goes round again. These machines dominate factory air from about 5 to 500 kW.

| Motor | Free air delivery at 7 bar | Package input | Specific power |
|---|---|---|---|
| 7.5 kW | 1.2 m³/min | 9 kW | 7.5 kW per m³/min |
| 37 kW | 6.5 m³/min | 43 kW | 6.6 kW per m³/min |
| 90 kW | 16.5 m³/min | 104 kW | 6.3 kW per m³/min |
| 250 kW | 46 m³/min | 285 kW | 6.2 kW per m³/min |

Typical values for good modern machines, rounded; small machines are relatively less efficient (see [[fad-capacity]]).

### Oil-free screws
Where no oil may touch the air, **timing gears** keep the rotors apart so they never touch; the rotors are often coated. Without oil to cool it, one stage can manage only about 3–4 : 1 before the air gets too hot, so for 7–10 bar two stages with an intercooler are used, the rotors turn faster to limit leakage through their clearances, and the machine costs noticeably more. A third route injects water instead of oil into a single stage.

### The built-in volume ratio
A screw has no valves: the pocket opens to the discharge when it reaches the port, whatever its pressure. The port fixes a **built-in volume ratio** $V_i$ — the pocket's volume when it closes at the inlet over its volume when it opens at the outlet — and so a built-in pressure

$$p_i = p_1 V_i^{\\,n}$$

If the network is exactly at $p_i$, the air leaves without a jump. If the network is higher (**under-compression**), line air rushes back into the pocket when it opens and the rotors must push the whole pocket out against the full line pressure; if it is lower (**over-compression**), the air has been squeezed further than needed and expands wastefully into the line. Either way a few per cent of the work is lost, which is one reason screws are sold in pressure variants — 7.5, 8.5, 10 and 13 bar — and should run near the pressure they were built for.

> [!warn] The separator vessel of an oil-injected screw is a pressure vessel full of hot oil. After stopping, wait for it to blow down and check that its gauge reads zero before opening the oil filler; lock out the supply before opening the enclosure, and let the oil cool — it runs at about 80 °C.
`,
  ideas: [
    'Two meshing rotors carry pockets of air towards the outlet while the pockets shrink: no valves, smooth flow, continuous duty.',
    'Injected oil seals, lubricates and cools, so one oil-injected stage reaches 7–13 bar at 75–95 °C.',
    'Oil-free screws keep their rotors apart with timing gears and need two stages with an intercooler.',
    'The discharge port fixes a built-in volume ratio and so a built-in pressure p₁Vᵢⁿ; running far from it wastes a few per cent.',
    'Good oil-injected screws need about 6–7 kW per m³/min of free air at 7 bar.'
  ],
  pitfalls: [
    'A screw adapts its internal pressure to the line, like a piston compressor with valves — The discharge port opens at a fixed rotor angle, so each pocket is squeezed to the same built-in pressure whatever the line needs.',
    'Oil-injected means oily air — After the separator the oil content is a few milligrams per cubic metre, and filters reduce it further; but for class 0 applications an oil-free machine or proven filtration is required.',
    'Hotter oil is harmless — Oil kept too cool lets water condense in it; oil run too hot ages and varnishes. The thermostatic valve keeps it in a narrow band for a reason.'
  ],
  formulas: [
    {
      name: 'Built-in pressure of a screw',
      expr: 'pvi = p1*Vi^n', tex: 'p_i = p_1 V_i^{\\,n}',
      vars: {
        pvi: { name: 'pressure at the end of internal compression (absolute)', q: 'pressure', unit: 'bar', tex: 'p_i' },
        p1: { name: 'inlet pressure (absolute)', q: 'pressure', unit: 'bar', value: 1, tex: 'p_1' },
        Vi: { name: 'built-in volume ratio', value: 4.4, min: 1, max: 10, tex: 'V_i' },
        n: { name: 'compression exponent', value: 1.4, min: 1, tex: 'n' }
      },
      note: 'An idealisation: with no heat exchange $n = 1.4$; the injected oil takes some heat during compression and internal leakage heats the air, so the real internal pressure differs somewhat. The machine is most efficient when the line pressure is near $p_i$.',
      practice: { unknowns: ['pvi', 'Vi'] },
      stories: {
        pvi: 'A screw compressor has a built-in volume ratio of {Vi} and draws air at {p1}. What pressure does the air reach inside before the discharge port opens (n = {n})?',
        Vi: 'A screw is to deliver into a network at {pvi} from an inlet at {p1}. What built-in volume ratio suits it (n = {n})?'
      }
    },
    {
      name: 'Oil flow to carry the heat',
      expr: 'm = Ph/(c*dT)', tex: '\\dot m_\\text{oil} = \\dfrac{\\Phi}{c_\\text{oil}\\,\\Delta T}',
      vars: {
        m: { name: 'oil mass flow', q: 'massflow', unit: 'kg/s', tex: '\\dot m_\\text{oil}' },
        Ph: { name: 'heat taken up by the oil', q: 'power', unit: 'kW', value: 70, tex: '\\Phi' },
        c: { name: 'specific heat of the oil', q: 'specificheat', unit: 'kJ/(kg·K)', value: 2.0, tex: 'c_\\text{oil}' },
        dT: { name: 'oil temperature rise through the air end', q: 'dtemp', unit: 'K', value: 25, tex: '\\Delta T' }
      },
      note: 'Compressor oils have $c \\approx$ 1.9–2.1 kJ/(kg·K) and a density near 0.85–0.87 kg/L. In an oil-injected screw about 70–75 % of the electrical input ends up in the oil.',
      stories: {
        m: 'The oil of a screw compressor must carry {Ph} away while warming by {dT}. With c = {c}, what oil flow is needed?',
        dT: 'An oil flow of {m} (c = {c}) carries {Ph} out of the air end. How much does the oil warm up?'
      }
    }
  ],
  examples: [
    {
      title: 'Matching the built-in volume ratio',
      q: 'A screw with $V_i = 4.4$ draws air at 1 bar absolute. What pressure does it build internally (n = 1.4)? What happens if it feeds a network at 5 bar gauge, or at 10 bar gauge?',
      steps: [
        '$p_i = 1 \\times 4.4^{1.4} = 7.96$ bar absolute — about 7 bar gauge, the pressure it was built for.',
        'At 5 bar gauge (6 bar absolute) each pocket is over-compressed to 7.96 bar and then expands into the line. Working out the areas on the $p$–$V$ diagram, about 2 % of the work is wasted.',
        'At 10 bar gauge (11 bar absolute) the pocket opens at 7.96 bar, line air rushes back in, and the rotors push the whole pocket out at 11 bar: about 2.3 % is wasted. A machine built for 10 bar would have $V_i = 11^{1/1.4} = 5.5$.'
      ],
      a: 'About 8 bar absolute inside; a few per cent of the work is lost when the line is 2–3 bar away from it, in either direction.'
    },
    {
      title: 'How much oil goes round',
      q: 'A 90 kW oil-injected screw takes 104 kW from the grid; about 70 % of that ends in the oil, which warms by 25 K through the air end. What oil flow circulates (c = 2.0 kJ/(kg·K), density 0.87 kg/L)?',
      steps: [
        'Heat to the oil: $0.70 \\times 104 = 72.8$ kW.',
        '$\\dot m = 72\\,800/(2000 \\times 25) = 1.46$ kg/s.',
        'In volume: $1.46/0.87 = 1.67$ L/s, about 100 L/min — four to five times the mass of air passing (16.5 m³/min is about 0.33 kg/s).'
      ],
      a: 'About 1.5 kg/s — some 100 litres of oil a minute.'
    }
  ],
  quiz: [
    { q: 'Which of these is NOT a job of the oil injected into a screw compressor?', choices: ['Sealing the clearances between rotors and housing', 'Carrying away the heat of compression', 'Lubricating the rotors so the male can drive the female', 'Raising the built-in volume ratio'], a: 3,
      why: 'The built-in volume ratio is fixed by the rotor geometry and the discharge port. The oil seals, cools and lubricates.' },
    { q: 'An oil-injected screw compressor at 8 bar has a discharge temperature of about 250 °C.', a: false,
      why: 'The oil absorbs most of the heat as it is produced; the air–oil mixture leaves at about 75–95 °C. An uncooled, adiabatic compression to 8 : 1 would reach roughly 250 °C.' },
    { q: 'A screw built for 10 bar runs in a plant that needs only 6 bar. What happens inside it?', choices: ['Under-compression: air flows back into the pocket at the port', 'Over-compression: the air is squeezed above the line pressure and expands as the port opens, wasting work', 'Nothing: a screw adapts its internal pressure to the line', 'The rotors stall'], a: 1,
      why: 'The built-in volume ratio squeezes each pocket to the same pressure whatever the line needs; the compression above line pressure is wasted. Running at the lower pressure still saves energy, but a machine built for it would save more.' },
    { q: 'What absolute pressure does a screw with a built-in volume ratio of 5 reach internally from 1 bar absolute, taking n = 1.4?', answer: 9.52, unit: 'bar', tol: 0.02,
      why: '$p_i = 1 \\times 5^{1.4} = 9.52$ bar absolute — about 8.5 bar gauge.' },
    { q: 'Why do oil-free screw compressors for 7–10 bar have two stages?', choices: ['Timing gears cannot carry more torque', 'Without oil to absorb the heat, one stage would make the air far too hot; an intercooler between two stages keeps each temperature and ratio moderate', 'Oil-free rotors cannot seal at all', 'To double the flow'], a: 1,
      why: 'Dry compression is close to adiabatic; the temperature rise and the leakage through the rotor clearances limit a stage to a ratio of roughly 3–4.' }
  ],
  applications: [
    'General factory air: assembly, machining, packaging, plastics.',
    'Oil-free air for breweries, dairies, pharmaceutical and electronics plants.',
    'Diesel-driven portable screw compressors on building sites and road works.',
    'The same rotors compress refrigerants in large chillers and natural gas in pipelines.'
  ],
  history: 'Heinrich Krigar patented a screw compressor in Germany in 1878, but its rotors could not be made accurately enough. Alf Lysholm in Sweden made the idea work in the 1930s, originally for gas turbines, with rotors ground to fine tolerances. Injecting oil, from the 1950s, allowed simple single-stage machines without timing gears, and by the 1980s the oil-injected screw had displaced the piston compressor from most factories.',
  sim: 'comp-screw-vi'
}

,

{
  id: 'scroll-vane-compressors', parent: 'compressors', title: 'Scroll, vane and other rotary compressors', level: 1,
  short: 'Smaller rotary machines, each with a niche: the scroll, two interleaved spirals, is quiet and oil-free; the vane compressor, a slotted rotor turning off-centre in a cylinder, is simple and slow-running; lobe blowers move large volumes at low pressure.',
  keywords: ['scroll compressor', 'orbiting scroll', 'Oldham coupling', 'rotary vane compressor', 'sliding vane', 'lobe blower', 'Roots blower', 'liquid-ring', 'oil-free', 'quiet compressor', 'dental air', 'laboratory air'],
  prereq: ['compressor-types', 'reciprocating-compressors', 'physics:centripetal-force'],
  related: ['screw-compressors', 'medical-dental-air', 'pneumatic-conveying', 'vacuum-pumps', 'air-motors', 'noise-silencers', 'hydraulics:vane-pumps', 'hydraulics:gear-pumps'],
  body: `
Between the little piston compressor of a workshop and the screw of a factory sits a family of rotary machines, each with its niche.

### The scroll
Two identical spirals — **scrolls** — are fitted into each other. One is fixed; the other is driven round a small circle by an eccentric crank but kept from turning by an anti-rotation coupling (often an Oldham coupling), so it **orbits** without rotating. The spirals touch along several lines, closing off crescent-shaped pockets. A pocket forms at the outer edge, is carried inwards round the spiral, shrinking as it goes, and leaves through a port at the centre. Several pockets are always at different stages, so the flow is smooth and the machine remarkably quiet and free of vibration; there are no valves, and tip seals along the spiral edges seal without oil.

Scroll air compressors are made oil-free, from about 1.5 to 15 kW per module; several modules share a cabinet and switch on and off with the demand. They suit laboratories, dental surgeries, hospitals and small food producers, where oil-free air and quiet running matter more than the last kilowatt. Like a screw, a scroll has a built-in volume ratio (see [[screw-compressors]]). Its limits are size — large spirals distort with heat and are hard to machine precisely — and the wear of the tip seals, which are renewed at regular service intervals.

### The rotary vane compressor
A slotted rotor turns off-centre in a cylindrical stator. Vanes slide in the slots and are thrown outwards against the stator, forming cells that grow on one side (the inlet) and shrink on the other (the outlet). The force pressing a vane outwards is the centripetal force of its circular motion (see [[physics:centripetal-force|centripetal force]]):

$$F = m\\,\\omega^2 r, \\qquad \\omega = 2\\pi n$$

It rises with the square of the speed, and with it the friction and wear at the vane tips. Vane machines therefore turn slowly — often directly coupled to a four-pole motor at about 1500 rpm — which makes them simple and long-lived; oil fed behind the vanes helps them out at start-up. Oil-injected vane compressors of 2–75 kW supply 7–10 bar; the same principle makes vacuum pumps and [[air-motors]].

### Lobe blowers and others
A **lobe** (Roots) blower has two figure-of-eight rotors that carry air round the casing at inlet pressure without shrinking it. The compression happens abruptly when a pocket opens to the outlet and higher-pressure air rushes back in, so it is efficient only at low ratios — up to about 1 bar gauge, for [[pneumatic-conveying]] and for aerating wastewater. **Liquid-ring** machines, with a ring of water spinning in an eccentric casing, handle wet and dirty gases and are mostly used as vacuum pumps (see [[vacuum-pumps]]).

| | Scroll | Vane | Lobe blower |
|---|---|---|---|
| Typical power | 1.5–15 kW per module | 2–75 kW | 5–300 kW |
| Pressure | 8–10 bar | 7–10 bar | up to about 1 bar |
| Lubrication | oil-free | oil-injected | oil-free chamber |
| Strengths | quiet, clean, continuous duty | simple, robust, slow | large volumes, simple |

> [!tip] A scroll or screw may run all day; a small piston compressor should rest between runs. For a steady small demand — a dental practice, a laboratory — a machine rated for continuous duty is worth its higher price.

> [!warn] Lobe blowers are very loud without inlet and outlet silencers, and like every positive-displacement machine they need a relief valve. Wear hearing protection near unsilenced blowers and compressors.
`,
  ideas: [
    'A scroll pairs a fixed spiral with an orbiting one: pockets move inwards and shrink, quietly and without oil.',
    'Scroll modules of up to about 15 kW are combined for larger flows; their size is limited by heat distortion and machining.',
    'Vanes are pressed out by F = mω²r, so vane compressors run slowly and last long.',
    'Lobe blowers have no internal compression and are efficient only below about 1 bar gauge.'
  ],
  pitfalls: [
    'The orbiting scroll rotates — It moves round a small circle without turning; an anti-rotation coupling prevents rotation, so the contact lines between the spirals travel inwards.',
    'A Roots blower is a small screw compressor — It has no built-in compression at all: each pocket is compressed by backflow as it opens to the outlet, which wastes work at any but low ratios.',
    'Scrolls are just small screws — Both are rotary with a built-in volume ratio, but the scroll\'s orbiting spirals, tip seals and modular construction make it a different machine with different limits.'
  ],
  formulas: [
    {
      name: 'Force pressing a vane outwards',
      expr: 'F = m*(2*pi*n)^2*r', tex: 'F = m\\,(2\\pi n)^2\\, r',
      vars: {
        F: { name: 'centrifugal force on one vane', q: 'force', unit: 'N', tex: 'F' },
        m: { name: 'vane mass', q: 'mass', unit: 'g', value: 20, tex: 'm' },
        n: { name: 'rotor speed', q: 'frequency', unit: 'rpm', value: 1500, tex: 'n' },
        r: { name: 'radius of the vane\'s centre of mass', q: 'length', unit: 'mm', value: 60, tex: 'r' }
      },
      note: 'The tip friction and wear grow with this force — with the square of the speed. Oil pressure behind the vanes adds to it at start-up.',
      stories: {
        F: 'A vane of {m} runs at a radius of {r} in a rotor turning at {n}. How hard is it pressed against the stator?',
        n: 'The force on a {m} vane at {r} must stay below {F}. How fast may the rotor turn?'
      }
    }
  ],
  examples: [
    {
      title: 'Vane force and speed',
      q: 'A 20 g vane rides at a radius of 60 mm. How hard is it pressed outwards at 1500 rpm, and at 3000 rpm?',
      steps: [
        '$\\omega = 2\\pi \\times 1500/60 = 157$ rad/s; $F = 0.020 \\times 157^2 \\times 0.060 = 29.6$ N.',
        'At 3000 rpm the force is four times as large: 118 N.',
        'The friction at the tip, with its heat and wear, grows in proportion — which is why vane compressors run slowly and directly coupled.'
      ],
      a: '29.6 N at 1500 rpm, 118 N at 3000 rpm.'
    },
    {
      title: 'Air for a dental practice',
      q: 'A practice has four treatment chairs using, typically, about 50 L/min each while in use, and rarely more than half are in use at once. What free air delivery is needed, and which type suits?',
      steps: [
        'Average demand: $4 \\times 50 \\times 0.5 = 100$ L/min; with a margin for peaks and leaks, about 150 L/min.',
        'The air reaches patients, so it must be oil-free and dry (see [[medical-dental-air]]); the machine is near people, so quiet running matters.',
        'A scroll unit of about 1.5–2.2 kW, or two smaller modules for redundancy, rated for continuous duty — rather than a small piston machine that would run most of the day.'
      ],
      a: 'About 150 L/min of oil-free air: a small scroll unit (or two), followed by a dryer.'
    }
  ],
  quiz: [
    { q: 'In a scroll compressor, the moving scroll…', choices: ['spins at high speed like a turbine', 'orbits on a small circle without rotating, so the pockets between the spirals move inwards and shrink', 'moves back and forth like a piston', 'rotates the opposite way to the fixed scroll'], a: 1,
      why: 'An eccentric drives it round a small circle and an anti-rotation coupling keeps it from turning; the contact lines between the spirals travel inwards, carrying the pockets with them.' },
    { q: 'What presses the vanes of a rotary vane compressor against the stator while it runs?', choices: ['Springs behind each vane', 'Centrifugal force, helped by oil pressure', 'Magnetic force', 'The air pressure in the inlet cell'], a: 1,
      why: 'The rotating vanes are flung outwards with $F = m\\omega^2 r$; oil fed behind them helps at start-up. (Some small machines add springs.)' },
    { q: 'A lobe (Roots) blower is an efficient way to make 7 bar air.', a: false,
      why: 'A lobe blower has no internal compression: each pocket is compressed by backflow and then pushed out against the full outlet pressure. The loss grows quickly with the ratio, so lobe blowers stay below about 1 bar gauge.' },
    { q: 'A 15 g vane at a radius of 50 mm turns at 1450 rpm. What is the outward force on it?', answer: 17.3, unit: 'N', tol: 0.03,
      why: '$\\omega = 2\\pi \\times 1450/60 = 151.8$ rad/s; $F = 0.015 \\times 151.8^2 \\times 0.05 = 17.3$ N.' },
    { q: 'Why are scroll air compressors built as modules of up to about 15 kW rather than as single 200 kW machines?', choices: ['Scrolls cannot be made oil-free at large sizes', 'Large spirals distort with heat and are hard to machine and seal precisely, so the principle suits small machines; larger flows use several modules or a screw', 'The orbiting motion cannot be driven by large motors', 'They would be too quiet'], a: 1,
      why: 'A scroll depends on tiny clearances along long spiral walls; thermal distortion and machining limits grow with size.' }
  ],
  applications: [
    'Dental and medical air: oil-free scroll and piston units.',
    'Laboratories, printing works and small food producers.',
    'Vane compressors on service vehicles and in small workshops; vane vacuum pumps.',
    'Lobe blowers for pneumatic conveying of powders and aeration in sewage works.'
  ],
  history: 'The scroll was patented by the French engineer Léon Creux in 1905, but its spirals could not be machined accurately until computer-controlled milling arrived: scrolls entered air conditioners in the 1980s and oil-free air compressors soon after. The lobe blower goes back to the Roots brothers of Indiana, who patented it in 1860.',
  sim: 'comp-selection-map'
},

{
  id: 'centrifugal-compressors', parent: 'compressors', title: 'Centrifugal compressors', level: 3,
  short: 'An impeller spinning at tens of thousands of revolutions a minute flings air outwards and a diffuser turns its speed into pressure. Oil-free, compact for its output and efficient at its design point, a centrifugal suits large steady demands — but below a minimum flow it surges.',
  keywords: ['centrifugal compressor', 'turbo compressor', 'impeller', 'diffuser', 'tip speed', 'Euler equation', 'work coefficient', 'surge', 'choke', 'stonewall', 'inlet guide vanes', 'blow-off valve', 'integrally geared', 'turndown', 'performance map'],
  prereq: ['compressor-types', 'compression-work', 'aerodynamics:stagnation-properties'],
  related: ['multistage-intercooling', 'compressor-regulation', 'heat-recovery', 'aerodynamics:turbojet', 'aerodynamics:stall', 'hydraulics:centrifugal-pump', 'hydraulics:pump-curves'],
  body: `
A centrifugal compressor is the gas cousin of the [[hydraulics:centrifugal-pump|centrifugal pump]]. Air enters at the eye of an impeller, is caught by its blades and flung outwards; it leaves the tip fast and at a raised pressure, and a **diffuser** — a widening ring of passages — slows it down so that its kinetic energy becomes more pressure (see [[aerodynamics:stagnation-properties|stagnation properties]]). Plant-air machines turn their impellers at roughly 15,000–60,000 rpm, so that the tips move at 300–450 m/s — close to or beyond the speed of sound in the incoming air.

### Work from tip speed
The energy each kilogram receives depends on how fast the blade tips move. With no swirl at the inlet, Euler's turbine equation gives a specific work $w = \\psi u^2$, where $u$ is the tip speed and the **work coefficient** $\\psi$ is about 0.9 for radial blades and 0.6–0.75 for the backswept impellers of modern air compressors. All of that work raises the air's temperature, by $\\psi u^2/c_p$; with an isentropic stage efficiency $\\eta$, the useful part raises its pressure by the ratio

$$r = \\left(1 + \\frac{\\eta\\,\\psi\\, u^2}{c_p T_1}\\right)^{\\gamma/(\\gamma - 1)}$$

At $u = 400$ m/s, $\\psi = 0.7$ and $\\eta = 82$ % one stage gives about 2.6 : 1. Plant air at 7–10 bar therefore takes three stages with intercoolers between them. In the usual **integrally geared** design a large bull gear drives two or more pinions, each carrying impellers at the speed that suits its stage. Bearings and gears sit outside the air path, so the air is oil-free by nature. Note the $T_1$: a warm intake gives a smaller ratio at the same speed.

### Surge, choke and the performance map
At constant speed a centrifugal's pressure rises only a little as its flow is reduced, up to a peak. Reduce the flow further and the flow in the impeller and diffuser breaks away, the machine can no longer hold the pressure in the pipe after it, and the air briefly flows **backwards** — then forwards again as the downstream pressure falls. This **surge** repeats every second or two with loud bangs, reversing the thrust on the bearings, and can wreck a machine in minutes. At the other extreme the flow **chokes** when the passages reach sonic speed.

A plant compressor is kept away from surge by its controls. As demand falls, **inlet guide vanes** or an inlet throttle reduce the flow at constant discharge pressure — typically down to about 70–80 % of the design flow, the **turndown** limit. Below that a **blow-off valve** vents the surplus to atmosphere, which keeps the machine safe but throws away compressed air, and the energy that made it.

| | Centrifugal | Oil-injected screw |
|---|---|---|
| Typical size | 150 kW to many MW | 4–500 kW |
| Air | oil-free | oil removed by separator and filters |
| Part load | guide vanes to about 70–80 %, then blow-off | load/unload, modulation or variable speed |
| Best use | large, steady base load | varying demand, trimming |

> [!key] Run centrifugals where they are good: fully loaded on a steady base load, with screws (often one variable-speed) taking the swings. A centrifugal blowing off half the day is an expensive way to heat the sky.

> [!warn] Blow-off valves discharge to atmosphere very loudly, and surge can damage a machine suddenly. Never disable anti-surge protection, keep clear of blow-off silencers, and wear hearing protection in compressor houses.
`,
  ideas: [
    'The impeller gives the air speed and pressure; the diffuser turns the speed into more pressure.',
    'The work per kilogram is ψu²: it grows with the square of the tip speed.',
    'One stage gives about 2–3 : 1, so plant air at 7–10 bar needs three intercooled stages.',
    'Below the surge flow the machine cannot hold its pressure and the flow reverses; guide vanes and blow-off keep it away.',
    'Centrifugals are oil-free and efficient fully loaded; blow-off at part load wastes energy.'
  ],
  pitfalls: [
    'A centrifugal can be throttled down like a screw — Its flow can only be reduced to the surge limit, typically 70–80 % of design with guide vanes; below that the surplus must be blown off.',
    'Surge is just noise — It is a reversal of the flow that hammers bearings, seals and impellers; machines are protected by anti-surge control and trip on repeated surge.',
    'Intake temperature does not matter to a compressor — For a centrifugal it matters a lot: the pressure ratio depends on u²/(c_pT₁), so hot intake air lowers the pressure it can reach and moves it towards surge.'
  ],
  formulas: [
    {
      name: 'Impeller tip speed',
      expr: 'u = pi*D*n', tex: 'u = \\pi D n',
      vars: {
        u: { name: 'tip speed', q: 'speed', unit: 'm/s', tex: 'u' },
        D: { name: 'impeller tip diameter', q: 'length', unit: 'mm', value: 250, tex: 'D' },
        n: { name: 'rotational speed', q: 'frequency', unit: 'rpm', value: 30000, tex: 'n' }
      },
      stories: {
        u: 'An impeller of {D} turns at {n}. How fast do its tips move?',
        n: 'An impeller of {D} must reach a tip speed of {u}. How fast must it turn?'
      }
    },
    {
      name: 'Pressure ratio of one stage',
      expr: 'r = (1 + eta*psi*u^2/(cp*T1))^(g/(g - 1))', tex: 'r = \\left(1 + \\dfrac{\\eta\\,\\psi\\,u^2}{c_p T_1}\\right)^{\\gamma/(\\gamma - 1)}',
      vars: {
        r: { name: 'stage pressure ratio (absolute)', tex: 'r' },
        eta: { name: 'isentropic stage efficiency', q: 'ratio', unit: '%', value: 82, min: 10, max: 100, tex: '\\eta' },
        psi: { name: 'work coefficient (about 0.6–0.9)', value: 0.7, min: 0.1, max: 1.2, tex: '\\psi' },
        u: { name: 'impeller tip speed', q: 'speed', unit: 'm/s', value: 400, tex: 'u' },
        cp: { name: 'specific heat of air at constant pressure', q: 'specificheat', unit: 'J/(kg·K)', value: 1005, tex: 'c_p' },
        T1: { name: 'stage inlet temperature', q: 'temperature', unit: '°C', value: 20, tex: 'T_1' },
        g: { name: 'ratio of specific heats γ', value: 1.4, min: 1.05, max: 1.7, fixed: true, tex: '\\gamma' }
      },
      note: 'No swirl at the inlet; the Euler work is $\\psi u^2$, of which the fraction $\\eta$ is useful compression.',
      practice: { unknowns: ['r', 'u'] },
      stories: {
        r: 'A stage with a tip speed of {u}, work coefficient {psi} and efficiency {eta} draws air at {T1}. What pressure ratio does it give?',
        u: 'A stage must give a pressure ratio of {r} with air entering at {T1} (work coefficient {psi}, efficiency {eta}). What tip speed does it need?'
      }
    },
    {
      name: 'Temperature rise across a stage',
      expr: 'T2 = T1 + psi*u^2/cp', tex: 'T_2 = T_1 + \\dfrac{\\psi\\,u^2}{c_p}',
      vars: {
        T2: { name: 'stage outlet temperature', q: 'temperature', unit: '°C', tex: 'T_2' },
        T1: { name: 'stage inlet temperature', q: 'temperature', unit: '°C', value: 20, tex: 'T_1' },
        psi: { name: 'work coefficient', value: 0.7, min: 0.1, max: 1.2, tex: '\\psi' },
        u: { name: 'impeller tip speed', q: 'speed', unit: 'm/s', value: 400, tex: 'u' },
        cp: { name: 'specific heat of air at constant pressure', q: 'specificheat', unit: 'J/(kg·K)', value: 1005, tex: 'c_p' }
      },
      note: 'All the shaft work ends as a temperature rise of the air (strictly, of its stagnation temperature), however efficient the stage; the intercooler after it removes the heat.',
      stories: {
        T2: 'Air enters a stage at {T1}; the impeller tips move at {u} with a work coefficient of {psi}. How hot does the air leave?',
        u: 'Air enters a stage at {T1} and must not leave hotter than {T2} (work coefficient {psi}). What is the highest tip speed?'
      }
    }
  ],
  examples: [
    {
      title: 'Sizing a stage',
      q: 'A three-stage compressor must deliver 7 bar gauge (8 bar absolute) from 1 bar, with equal ratios and intercooling back to 20 °C. What tip speed does each stage need (ψ = 0.7, η = 82 %), and how fast must a 250 mm impeller turn?',
      steps: [
        'Each stage: $r = 8^{1/3} = 2.0$.',
        'Invert the formula: $\\psi u^2 = c_p T_1\\,(r^{(\\gamma-1)/\\gamma} - 1)/\\eta = 1005 \\times 293.15 \\times 0.219/0.82 = 78\\,700$ J/kg.',
        '$u = \\sqrt{78\\,700/0.7} = 335$ m/s.',
        '$n = u/(\\pi D) = 335/(\\pi \\times 0.25) = 427$ rev/s — about 25,600 rpm.'
      ],
      a: 'About 335 m/s at the tips: some 25,600 rpm for a 250 mm impeller.'
    },
    {
      title: 'A hot afternoon',
      q: 'The same kind of stage (u = 400 m/s, ψ = 0.7, η = 82 %) draws air at 20 °C in the morning and at 35 °C in the afternoon. How does its pressure ratio change?',
      steps: [
        'At 20 °C: $1 + 0.82 \\times 0.7 \\times 400^2/(1005 \\times 293.15) = 1.312$, and $r = 1.312^{3.5} = 2.58$.',
        'At 35 °C: $1 + 0.82 \\times 112\\,000/(1005 \\times 308.15) = 1.297$, and $r = 1.297^{3.5} = 2.48$.',
        'Over three stages the achievable ratio falls to $(2.48/2.58)^3 = 0.89$ of the morning value, so the machine holds its pressure only at a lower flow — closer to surge. Cold intake air does the opposite.'
      ],
      a: 'From 2.58 to 2.48 per stage: about 11 % less pressure-ratio capability over three stages.'
    }
  ],
  quiz: [
    { q: 'What is surge in a centrifugal compressor?', choices: ['Overspeed of the impeller when the load is lost', 'A breakdown of the flow at low throughput: the machine cannot hold the discharge pressure, and the flow reverses and oscillates violently', 'Water collecting in the intercooler', 'The flow reaching the speed of sound in the diffuser'], a: 1,
      why: 'Below the surge flow the pressure the impeller can make falls below what the system downstream holds, so air flows backwards until that pressure drops, then forwards again. Reaching sonic speed is choke.' },
    { q: 'Doubling an impeller\'s tip speed multiplies the work it does on each kilogram of air by…', choices: ['2', '√2', '4', '8'], a: 2,
      why: 'The Euler work is $\\psi u^2$: twice the tip speed, four times the work.' },
    { q: 'The air from a centrifugal compressor is oil-free because the oil-lubricated bearings and gears are outside the air path.', a: true,
      why: 'The impellers run in the air stream with no rubbing parts and no lubricant; seals keep bearing oil out.' },
    { q: 'A plant\'s demand falls to 55 % of its centrifugal compressor\'s design flow. What typically happens?', choices: ['The guide vanes close further and the machine delivers 55 % efficiently', 'The guide vanes reach their limit near 70–80 % and the blow-off valve vents the rest, so the power stays near that of 70–80 % flow', 'The machine speeds up', 'Nothing: centrifugals have no minimum flow'], a: 1,
      why: 'Turndown is limited by surge. Below it the surplus is blown off to keep the flow through the machine above the surge line — wasting the energy used to compress it.' },
    { q: 'An impeller of 200 mm diameter turns at 36,000 rpm. What is its tip speed?', answer: 377, unit: 'm/s', tol: 0.02,
      why: '$u = \\pi \\times 0.2 \\times 600 = 377$ m/s.' }
  ],
  applications: [
    'Base-load air in car plants, steelworks, glass and textile factories.',
    'Air separation plants (oxygen and nitrogen) and process air for chemical works.',
    'Turbochargers and the compressors of small gas turbines.',
    'Turbo blowers for aeration in wastewater treatment.'
  ],
  history: 'Multistage centrifugal blowers and compressors were developed in the early 1900s alongside the steam turbines that drove them, for blast furnaces and mines. Frank Whittle\'s first jet engine, run in 1937, used a centrifugal compressor (see [[aerodynamics:turbojet|the turbojet]]); aircraft and turbocharger work pushed impeller aerodynamics forward, and the integrally geared machine became the standard for large plant air in the second half of the century.',
  sim: 'comp-centrifugal-map'
},

{
  id: 'compression-work', parent: 'compressors', title: 'The work of compression', level: 2,
  short: 'Squeezing air takes work, and how much depends on what happens to the heat: least if the air is kept cool while it is compressed (isothermal), most if the heat stays in it (adiabatic). Real compressors sit in between — and almost all the energy they use leaves as heat.',
  keywords: ['compression work', 'isothermal compression', 'adiabatic compression', 'isentropic', 'polytropic', 'flow work', 'technical work', 'discharge temperature', 'p-V diagram', 'isothermal efficiency', 'specific energy', 'exergy', 'first law', '7 % per bar'],
  prereq: ['isothermal-adiabatic', 'ideal-gas-law', 'physics:first-law-thermodynamics', 'physics:thermodynamic-processes'],
  related: ['multistage-intercooling', 'reciprocating-compressors', 'screw-compressors', 'fad-capacity', 'heat-recovery', 'energy-in-compressed-air', 'cost-of-compressed-air', 'pressure-optimisation', 'math:definite-integral'],
  body: `
Pump up a bicycle tyre and the barrel of the pump grows warm: compressing a gas does work on it, and the work appears as heat. How much work a compressor needs depends on what is done with that heat while the air is being squeezed.

### Work to draw in, compress and push out
A compressor does not merely compress a trapped quantity of air: it draws air in at $p_1$, compresses it and pushes it out at $p_2$. Counting all three, the work per cycle is the area between the compression curve and the pressure axis of a $p$–$V$ diagram, $W = \\int V\\,dp$ — engineers call it the flow or technical work (see [[math:definite-integral|the definite integral]]). For the two ideal limits:

- **Isothermal** — the heat is taken away as fast as it is made, so the temperature never rises and $pV$ stays constant:
$$W_\\text{iso} = p_1 V_1 \\ln\\frac{p_2}{p_1}$$
- **Adiabatic** (isentropic) — no heat leaves, and the air gets hot as it is compressed ($\\gamma = 1.4$ for air):
$$W_\\text{ad} = \\frac{\\gamma}{\\gamma - 1}\\,p_1 V_1\\left[\\left(\\frac{p_2}{p_1}\\right)^{(\\gamma-1)/\\gamma} - 1\\right]$$

Real compressions are **polytropic**, $pV^n$ = constant: water-cooled piston compressors reach $n \\approx$ 1.2–1.3, while uncooled dry compression runs at 1.4 or a little above, because friction and leakage add heat. The isotherm is the lowest curve; everything above it is extra work that ends as extra heat.

| 1 m³ of free air, 1 → 8 bar absolute, from 20 °C | Work | Ideal power per m³/min | Discharge temperature |
|---|---|---|---|
| Isothermal | 208 kJ | 3.47 kW | 20 °C |
| Two stages, intercooled ($n = 1.4$) | 242 kJ | 4.04 kW | 121 °C |
| Polytropic, $n = 1.3$ | 267 kJ | 4.45 kW | 201 °C |
| Adiabatic, $n = 1.4$ | 284 kJ | 4.73 kW | 258 °C |
| Good oil-injected screw package (typical) | about 390 kJ | 6.5 kW | — |

### The discharge temperature
The temperature at the end of a compression follows the same exponent, in kelvin:

$$T_2 = T_1 \\left(\\frac{p_2}{p_1}\\right)^{(n-1)/n}$$

From 20 °C an adiabatic 8 : 1 reaches 258 °C — hot enough to crack lubricating oil and to build carbon in discharge lines. That temperature, as much as the work, is why air is compressed in [[multistage-intercooling|stages with coolers between them]] or with oil injected to absorb the heat (see [[screw-compressors]]).

### Where the energy goes
Follow the energy with the [[physics:first-law-thermodynamics|first law]]. In an isothermal compression all the work leaves as heat while it happens; in an adiabatic one it first raises the air's temperature and the aftercooler then removes it. Either way, air leaving at room temperature has the same internal energy as the air drawn in — for an ideal gas it depends on temperature alone — so **practically all the electricity becomes heat**, which is what [[heat-recovery]] exploits. What the compressed air carries is not stored heat but the ability to do work as it expands again: at most the isothermal work (see [[energy-in-compressed-air]]).

Comparing real machines with that ideal gives the **isothermal efficiency**: a screw package at 6.5 kW per m³/min against the ideal 3.47 kW is about 53 % efficient. And because the work grows with the logarithm of the ratio, each extra bar of discharge pressure near 7 bar costs roughly 6–8 % more energy — the familiar "7 % per bar" (see [[pressure-optimisation]]).

> [!key] The least work is isothermal: keep the air cool while it is being compressed. Cooling it afterwards removes the heat but cannot give back the work already spent.
`,
  ideas: [
    'The work of a compressor that draws in, compresses and delivers is W = ∫V dp: the area left of the curve on a p–V diagram.',
    'Isothermal compression needs the least work, p₁V₁ ln(p₂/p₁); adiabatic the most of the ideal cases, 37 % more at 8 : 1.',
    'The discharge temperature follows T₂ = T₁(p₂/p₁)^((n−1)/n): 258 °C for an adiabatic 8 : 1 from 20 °C.',
    'Almost all the electrical input leaves as heat; the compressed air keeps only the ability to do work.',
    'Real packages reach about 50–55 % isothermal efficiency, and each extra bar costs about 7 %.'
  ],
  pitfalls: [
    'Compression stores the electrical energy in the air — Almost all of it leaves as heat. Air cooled back to room temperature holds no more internal energy than when it came in; it holds the capacity to do work as it expands, at most the isothermal work.',
    'A compressor\'s work is the area under the curve, ∫p dV — That is the work of compressing a trapped mass. A machine that also draws the air in and pushes it out does the flow work ∫V dp; for an adiabatic compression that is γ = 1.4 times as much.',
    'Cooling the air after compression saves energy — The aftercooler removes heat that has already been paid for. Only cooling during compression — water jackets, oil injection, intercoolers between stages — lowers the work.'
  ],
  formulas: [
    {
      name: 'Isothermal compression work',
      expr: 'W = p1*V1*ln(p2/p1)', tex: 'W_\\text{iso} = p_1 V_1 \\ln\\dfrac{p_2}{p_1}',
      vars: {
        W: { name: 'isothermal work (draw in, compress, push out)', q: 'energy', unit: 'kJ', tex: 'W_\\text{iso}' },
        p1: { name: 'intake pressure (absolute)', q: 'pressure', unit: 'bar', value: 1, tex: 'p_1' },
        V1: { name: 'volume drawn in, at intake conditions', q: 'volume', unit: 'm³', value: 1, tex: 'V_1' },
        p2: { name: 'delivery pressure (absolute)', q: 'pressure', unit: 'bar', value: 8, tex: 'p_2' }
      },
      note: 'The least work any compressor can need. kJ per m³ divided by 60 gives kW per m³/min.',
      practice: { unknowns: ['W', 'p2'] },
      stories: {
        W: 'What is the least work needed to compress {V1} of air drawn in at {p1} to {p2}?',
        p2: 'An isothermal compression of {V1} of air from {p1} takes {W}. To what pressure was it compressed?'
      }
    },
    {
      name: 'Polytropic (adiabatic) compression work',
      expr: 'W = n/(n - 1)*p1*V1*((p2/p1)^((n - 1)/n) - 1)', tex: 'W = \\dfrac{n}{n-1}\\,p_1 V_1\\left[\\left(\\dfrac{p_2}{p_1}\\right)^{(n-1)/n} - 1\\right]',
      vars: {
        W: { name: 'compression work (draw in, compress, push out)', q: 'energy', unit: 'kJ', tex: 'W' },
        n: { name: 'polytropic exponent (1.4 adiabatic)', value: 1.4, min: 1.01, max: 1.67, tex: 'n' },
        p1: { name: 'intake pressure (absolute)', q: 'pressure', unit: 'bar', value: 1, tex: 'p_1' },
        V1: { name: 'volume drawn in, at intake conditions', q: 'volume', unit: 'm³', value: 1, tex: 'V_1' },
        p2: { name: 'delivery pressure (absolute)', q: 'pressure', unit: 'bar', value: 8, tex: 'p_2' }
      },
      note: '$n = \\gamma = 1.4$ for an adiabatic compression of air; cooled compressions have a smaller $n$, and as $n \\to 1$ the result tends to the isothermal work.',
      practice: { unknowns: ['W', 'p2'] },
      stories: {
        W: 'A compressor draws in {V1} at {p1} and delivers it at {p2}, the compression following n = {n}. How much work does it do?',
        p2: 'A compression with n = {n} of {V1} drawn in at {p1} takes {W}. To what pressure was the air compressed?'
      }
    },
    {
      name: 'Discharge temperature',
      expr: 'T2 = T1*(p2/p1)^((n - 1)/n)', tex: 'T_2 = T_1\\left(\\dfrac{p_2}{p_1}\\right)^{(n-1)/n}',
      vars: {
        T2: { name: 'discharge temperature', q: 'temperature', unit: '°C', tex: 'T_2' },
        T1: { name: 'intake temperature', q: 'temperature', unit: '°C', value: 20, tex: 'T_1' },
        p2: { name: 'delivery pressure (absolute)', q: 'pressure', unit: 'bar', value: 8, tex: 'p_2' },
        p1: { name: 'intake pressure (absolute)', q: 'pressure', unit: 'bar', value: 1, tex: 'p_1' },
        n: { name: 'polytropic exponent (1.4 adiabatic)', value: 1.4, min: 1.01, max: 1.67, tex: 'n' }
      },
      note: 'Temperatures in kelvin inside the formula (the calculator converts). Real single-stage piston machines, with some cooling, stay somewhat below the adiabatic value.',
      practice: { unknowns: ['T2', 'p2'] },
      stories: {
        T2: 'Air at {T1} is compressed from {p1} to {p2} with n = {n}. How hot does it leave?',
        p2: 'To keep the discharge below {T2} from an intake at {T1} and {p1} (n = {n}), what is the highest delivery pressure?'
      }
    },
    {
      name: 'Isothermal efficiency of a compressor',
      expr: 'eta = p1*Q*ln(p2/p1)/P', tex: '\\eta_\\text{iso} = \\dfrac{p_1 Q \\ln (p_2/p_1)}{P}',
      vars: {
        eta: { name: 'isothermal efficiency', q: 'ratio', unit: '%', tex: '\\eta_\\text{iso}' },
        p1: { name: 'intake pressure (absolute)', q: 'pressure', unit: 'bar', value: 1, tex: 'p_1' },
        Q: { name: 'free air delivery', q: 'airflow', unit: 'm³/min ANR', value: 10, tex: 'Q' },
        p2: { name: 'delivery pressure (absolute)', q: 'pressure', unit: 'bar', value: 8, tex: 'p_2' },
        P: { name: 'electrical input power', q: 'power', unit: 'kW', value: 65, tex: 'P' }
      },
      note: 'Ideal isothermal power over the power actually used. Good screw packages reach about 50–55 % at 7 bar; the rest is heat of compression above the isotherm, internal leakage, and motor, fan and drive losses.',
      practice: { unknowns: ['eta', 'P'] },
      stories: {
        eta: 'A compressor delivers {Q} of free air, drawn in at {p1}, at {p2} and takes {P}. What is its isothermal efficiency?',
        P: 'A compressor with an isothermal efficiency of {eta} delivers {Q} of free air from {p1} to {p2}. What power does it draw?'
      }
    }
  ],
  examples: [
    {
      title: 'Isothermal against adiabatic',
      q: 'How much work does it take, at the least and with no cooling at all, to compress 1 m³ of air from 1 bar to 8 bar absolute? How hot does the uncooled air get from 20 °C?',
      steps: [
        'Isothermal: $W = 10^5 \\times 1 \\times \\ln 8 = 2.079\\times10^5$ J = 208 kJ.',
        'Adiabatic: $8^{0.2857} = 1.811$, so $W = 3.5 \\times 10^5 \\times 0.811 = 2.84\\times10^5$ J = 284 kJ — 37 % more.',
        '$T_2 = 293.15 \\times 1.811 = 531$ K = 258 °C.'
      ],
      a: '208 kJ isothermal, 284 kJ adiabatic, with the uncooled air at about 258 °C.'
    },
    {
      title: 'How good is a real compressor?',
      q: 'A screw compressor delivers 10 m³/min of free air, drawn in at 1 bar absolute, at 7 bar gauge (8 bar absolute), and its package takes 65 kW. What are its isothermal efficiency and its energy per cubic metre?',
      steps: [
        'Ideal isothermal power: $10^5 \\times (10/60) \\times \\ln 8 = 34.7$ kW.',
        '$\\eta_\\text{iso} = 34.7/65 = 53$ %.',
        'Energy per cubic metre: $65/(10 \\times 60) = 0.108$ kWh — about 390 kJ.'
      ],
      a: 'About 53 % isothermal efficiency; 0.108 kWh (390 kJ) per cubic metre of free air.'
    },
    {
      title: 'One bar more',
      q: 'The same 65 kW compressor runs 6000 hours a year, and the plant raises its pressure from 7 to 8 bar gauge. Using the adiabatic work ratio, roughly what does that cost at ¤0.15 per kWh?',
      steps: [
        'Adiabatic work is proportional to $r^{0.2857} - 1$: at 8 bar absolute $0.811$, at 9 bar absolute $9^{0.2857} - 1 = 0.873$.',
        '$0.873/0.811 = 1.076$: about 7.6 % more energy, or 5.0 kW.',
        'Per year: $5.0 \\times 6000 \\approx 30\\,000$ kWh, about ¤4,500.'
      ],
      a: 'Roughly 7–8 % more energy: about 30,000 kWh and ¤4,500 a year.'
    }
  ],
  quiz: [
    { q: 'What is the least work needed to compress 1 m³ of air from 1 to 10 bar absolute?', answer: 230, unit: 'kJ', tol: 0.02,
      why: 'Isothermal: $W = p_1 V_1 \\ln(p_2/p_1) = 10^5 \\times \\ln 10 = 230$ kJ.' },
    { q: 'Which way of compressing air from 1 to 8 bar needs the least work?', choices: ['Adiabatic, quickly, so no heat is lost', 'Isothermal, taking the heat away as it is made', 'Adiabatic, then cooling the air in an aftercooler', 'Polytropic with n = 1.5'], a: 1,
      why: 'The isotherm is the lowest curve on the p–V diagram, so it encloses the least area. Cooling after an adiabatic compression removes heat but not the extra work.' },
    { q: 'After the aftercooler, compressed air at 20 °C contains more internal energy than the air drawn in at 20 °C.', a: false,
      why: 'For an ideal gas the internal energy depends on temperature alone. The input has left as heat; the compressed air holds the ability to do work (exergy), not extra energy.' },
    { q: 'Air at 20 °C is compressed adiabatically at a pressure ratio of 4. What is its discharge temperature, in °C?', answer: 162, tol: 0.02,
      why: '$T_2 = 293.15 \\times 4^{0.2857} = 293.15 \\times 1.486 = 435.6$ K = 162 °C.' },
    { q: 'For a compressor that draws air in and pushes it out, the work of a cycle on the p–V diagram is the area…', choices: ['under the compression curve, down to the volume axis', 'between the compression curve and the pressure axis, bounded by the suction and delivery pressures', 'of the rectangle p₂V₁', 'of the triangle under the curve'], a: 1,
      why: 'Suction, compression and delivery together give $W = \\int V\\,dp$, the area to the left of the curve. The area under the curve, $\\int p\\,dV$, is only the work of compressing a trapped mass.' }
  ],
  applications: [
    'Choosing between single- and multistage compressors.',
    'Rating compressors by specific power and isothermal efficiency.',
    'Judging what a higher system pressure costs — about 7 % per bar.',
    'Estimating the heat to be removed from, or recovered from, a compressor.'
  ],
  history: 'Engineers building the Alpine rail tunnels of the 1860s–1880s already fought the heat of compression by spraying water into their compressor cylinders — an early attempt at isothermal compression. The thermodynamics of Carnot, Clausius and Rankine in the mid-19th century gave the limits their exact form.',
  sim: ['comp-work-compare', 'comp-piston-pv']
}

,

{
  id: 'multistage-intercooling', parent: 'compressors', title: 'Multistage compression and intercooling', level: 2,
  short: 'Compressing in two or more stages with a cooler between them keeps every temperature down and brings the work closer to the isothermal ideal. Equal pressure ratios in every stage — for two stages, an intermediate pressure at the geometric mean — give the least total work.',
  keywords: ['multistage compression', 'two-stage compressor', 'intercooler', 'intercooling', 'stage pressure ratio', 'optimum intermediate pressure', 'geometric mean', 'aftercooler', 'high-pressure compressor', 'breathing air'],
  prereq: ['compression-work', 'reciprocating-compressors'],
  related: ['centrifugal-compressors', 'screw-compressors', 'heat-recovery', 'aftercoolers', 'condensate', 'math:extrema'],
  body: `
One stage compressing air from 1 to 8 bar absolute heats it to about 258 °C and needs 37 % more work than the isothermal ideal. Split the job — compress to an intermediate pressure, cool the air back to near the intake temperature in an **intercooler**, then compress again — and the path on the $p$–$V$ diagram zig-zags close to the isotherm. The area cut away is work saved.

### Why it saves work
After the intercooler the air is back at the intake temperature but at a higher pressure, so it takes up less volume. The next stage therefore starts on the isotherm with less volume to squeeze, and the work of each stage is proportional to its inlet volume (see [[compression-work]]). With more stages and perfect intercooling the path hugs the isotherm ever more closely; with infinitely many it would be isothermal.

### The best intermediate pressure
With $N$ stages, equal exponents and intercooling back to the intake temperature, the total work is least when every stage has the **same pressure ratio**:

$$r_\\text{stage} = \\left(\\frac{p_2}{p_1}\\right)^{1/N}$$

For two stages the intermediate pressure is the geometric mean $\\sqrt{p_1 p_2}$: from 1 to 8 bar absolute it is 2.83 bar absolute (1.8 bar gauge), not the halfway 4.5 bar. Equal ratios also share the temperature rise equally between the stages.

| Final pressure (from 1 bar abs, 20 °C) | Stages | Ratio per stage | Work per m³ of free air | Discharge temperature |
|---|---|---|---|---|
| 8 bar abs | 1 | 8.0 | 284 kJ | 258 °C |
| 8 bar abs | 2 | 2.83 | 242 kJ | 121 °C |
| 8 bar abs | 3 | 2.0 | 230 kJ | 84 °C |
| 8 bar abs | isothermal | — | 208 kJ | 20 °C |
| 41 bar abs | 1 | 41 | 661 kJ | 574 °C |
| 41 bar abs | 2 | 6.4 | 490 kJ | 225 °C |
| 41 bar abs | 3 | 3.45 | 446 kJ | 144 °C |
| 41 bar abs | 4 | 2.53 | 425 kJ | 109 °C |
| 41 bar abs | isothermal | — | 371 kJ | 20 °C |

($n = 1.4$, perfect intercooling.) A second stage saves 15 % at 7 bar gauge; further stages save less and less, while each adds a cooler, a pressure drop and cost. So plant air uses two stages where no oil cools the compression (oil-free screws, two-stage pistons), centrifugals use three because each impeller manages only 2–3 : 1, and high-pressure machines use three or four — a single 41 : 1 stage would be hot enough to ignite its own lubricant.

### Real intercoolers
A real intercooler cools the air to within about 5–15 K of the cooling water or ambient air, with a small pressure drop. Each kelvin it leaves the air warmer adds about 0.3 % to the next stage's work. Because the air is compressed and then cooled, water condenses in the intercooler — often litres per hour in humid weather — and must be drained (see [[condensate]]); an intercooler that floods sends slugs of water into the next stage. The heat it removes, available at 80–120 °C in many machines, is an excellent source for [[heat-recovery]].

> [!tip] A two-stage compressor is only as good as its intercooler. Fouled fins, scale on the water side or a stuck condensate drain raise the second-stage inlet temperature — and the power — with no other obvious sign.
`,
  ideas: [
    'Cooling between stages returns the air to the isotherm, so each following stage has less volume to compress.',
    'Equal stage ratios, (p₂/p₁)^(1/N), give the least total work; for two stages the intermediate pressure is √(p₁p₂).',
    'A second stage saves about 15 % at 7 bar; each further stage saves less.',
    'Staging also keeps each discharge temperature moderate — essential at high pressure.',
    'Intercoolers condense water that must be drained, and their heat can be recovered.'
  ],
  pitfalls: [
    'The intermediate pressure should be halfway — The optimum is the geometric mean: from 1 to 8 bar absolute it is 2.83 bar, not 4.5 bar.',
    'More stages are always better — Each stage adds a cooler, a pressure drop, maintenance and cost, while the saving shrinks; two or three stages are the usual optimum for plant air.',
    'An intercooler is just an aftercooler in the middle — It matters far more: the air it cools is compressed again, so every kelvin it leaves costs work in the next stage.'
  ],
  derivation: {
    title: 'Why equal stage ratios minimise the work',
    steps: [
      { text: 'Two stages, intermediate pressure $p_i$, intercooling back to $T_1$. Each stage\'s work is proportional to its inlet $pV$, which is the same $p_1V_1$ because the intercooler restores $T_1$. With $m = (n-1)/n$:', tex: 'W = \\frac{n}{n-1}\\,p_1V_1\\left[\\left(\\frac{p_i}{p_1}\\right)^{m} + \\left(\\frac{p_2}{p_i}\\right)^{m} - 2\\right]' },
      { text: 'Set the derivative with respect to $p_i$ to zero:', tex: '\\frac{m\\,p_i^{m-1}}{p_1^{m}} - \\frac{m\\,p_2^{m}}{p_i^{m+1}} = 0' },
      { text: 'Multiply through by $p_i^{m+1}p_1^{m}/m$:', tex: 'p_i^{2m} = (p_1 p_2)^m \\quad\\Rightarrow\\quad p_i = \\sqrt{p_1 p_2}' },
      { text: 'So $p_i/p_1 = p_2/p_i$: both stages have the same ratio. The same argument for $N$ stages gives $r = (p_2/p_1)^{1/N}$ for each (see [[math:extrema|maxima and minima]]).' }
    ]
  },
  formulas: [
    {
      name: 'Pressure ratio per stage',
      expr: 'r = (p2/p1)^(1/N)', tex: 'r_\\text{stage} = \\left(\\dfrac{p_2}{p_1}\\right)^{1/N}',
      vars: {
        r: { name: 'pressure ratio of each stage', tex: 'r_\\text{stage}' },
        p2: { name: 'final delivery pressure (absolute)', q: 'pressure', unit: 'bar', value: 8, tex: 'p_2' },
        p1: { name: 'intake pressure (absolute)', q: 'pressure', unit: 'bar', value: 1, tex: 'p_1' },
        N: { name: 'number of stages', q: 'count', value: 2, int: true, min: 1, max: 8, tex: 'N' }
      },
      note: 'Equal ratios give the least total work when every intercooler brings the air back to the intake temperature. For two stages the intermediate pressure is $\\sqrt{p_1 p_2}$.',
      practice: { unknowns: ['r', 'p2'] },
      stories: {
        r: 'A compressor with {N} stages takes air from {p1} to {p2}. What pressure ratio should each stage have?',
        p2: 'A compressor has {N} stages, each at a ratio of {r}, and draws air at {p1}. What final pressure does it reach?'
      }
    },
    {
      name: 'Ideal power with N intercooled stages',
      expr: 'P = N*n/(n - 1)*p1*Q*((p2/p1)^((n - 1)/(N*n)) - 1)', tex: 'P = N\\,\\dfrac{n}{n-1}\\,p_1 Q\\left[\\left(\\dfrac{p_2}{p_1}\\right)^{(n-1)/(Nn)} - 1\\right]',
      vars: {
        P: { name: 'ideal compression power', q: 'power', unit: 'kW', tex: 'P' },
        N: { name: 'number of stages', q: 'count', value: 2, int: true, min: 1, max: 8, tex: 'N' },
        n: { name: 'polytropic exponent of each stage', value: 1.4, min: 1.01, max: 1.67, tex: 'n' },
        p1: { name: 'intake pressure (absolute)', q: 'pressure', unit: 'bar', value: 1, tex: 'p_1' },
        Q: { name: 'free air delivery (at intake conditions)', q: 'airflow', unit: 'm³/min ANR', value: 10, tex: 'Q' },
        p2: { name: 'final delivery pressure (absolute)', q: 'pressure', unit: 'bar', value: 8, tex: 'p_2' }
      },
      note: 'Equal stage ratios, intercooling back to the intake temperature, no pressure drops. $N = 1$ is a single stage; a large $N$ tends to the isothermal power $p_1 Q \\ln(p_2/p_1)$.',
      practice: { unknowns: ['P', 'Q'] },
      stories: {
        P: 'A compressor with {N} stages and perfect intercooling delivers {Q} of free air from {p1} to {p2} (n = {n}). What ideal power does it need?',
        Q: 'An ideal compressor with {N} intercooled stages uses {P} to compress air from {p1} to {p2} (n = {n}). What free air does it deliver?'
      }
    },
    {
      name: 'Heat removed by an intercooler',
      expr: 'Phi = rho*Q*cp*dT', tex: '\\Phi = \\rho\\, Q\\, c_p\\,\\Delta T',
      vars: {
        Phi: { name: 'heat removed', q: 'power', unit: 'kW', tex: '\\Phi' },
        rho: { name: 'density of free air (20 °C, 1 bar)', q: 'density', unit: 'kg/m³', value: 1.185, fixed: true, tex: '\\rho' },
        Q: { name: 'free air flow', q: 'airflow', unit: 'm³/min ANR', value: 10, tex: 'Q' },
        cp: { name: 'specific heat of air at constant pressure', q: 'specificheat', unit: 'J/(kg·K)', value: 1005, tex: 'c_p' },
        dT: { name: 'temperature drop through the cooler', q: 'dtemp', unit: 'K', value: 96, tex: '\\Delta T' }
      },
      note: 'Mass flow $\\rho Q$ times $c_p$ times the temperature drop. With perfect intercooling it equals the work of the stage before.',
      stories: {
        Phi: 'An intercooler cools {Q} of free air by {dT}. How much heat does it remove?',
        dT: 'An intercooler removes {Phi} from {Q} of free air. By how much does it cool the air?'
      }
    }
  ],
  examples: [
    {
      title: 'Two stages to 7 bar',
      q: 'Air at 1 bar absolute and 20 °C is compressed to 8 bar absolute, 10 m³/min of free air. Compare one adiabatic stage with two stages and perfect intercooling (n = 1.4): intermediate pressure, power and discharge temperatures.',
      steps: [
        'Intermediate: $\\sqrt{1 \\times 8} = 2.83$ bar absolute; each stage works at 2.83 : 1.',
        'One stage: $P = 3.5 \\times 10^5 \\times (10/60) \\times (8^{0.2857} - 1) = 3.5\\times10^5 \\times 0.1667 \\times 0.811 = 47.3$ kW; discharge 258 °C.',
        'Two stages: $P = 2 \\times 3.5\\times10^5 \\times 0.1667 \\times (8^{0.1429} - 1) = 2 \\times 3.5\\times10^5 \\times 0.1667 \\times 0.346 = 40.4$ kW; each stage discharges at $293.15 \\times 1.346 = 395$ K = 121 °C.',
        'Saving: $(47.3 - 40.4)/47.3 = 15$ %. The isothermal ideal would be 34.7 kW.'
      ],
      a: '2.83 bar absolute between the stages; 40.4 kW instead of 47.3 kW (15 % less), and 121 °C instead of 258 °C.'
    },
    {
      title: 'A bottle-blowing compressor',
      q: 'PET bottles are blown with air at 40 bar gauge (41 bar absolute). How many stages keep each discharge below 150 °C from a 20 °C intake, with n = 1.4 and every intercooler returning the air to 20 °C?',
      steps: [
        'Allowed temperature ratio per stage: $423.15/293.15 = 1.443$, so each stage ratio may be at most $1.443^{3.5} = 3.61$.',
        'Stages needed: $N \\ge \\ln 41/\\ln 3.61 = 3.714/1.285 = 2.89$ — three stages.',
        'With three stages each works at $41^{1/3} = 3.45 : 1$ and discharges at about 144 °C.'
      ],
      a: 'Three stages, each about 3.45 : 1, discharging at about 144 °C.'
    },
    {
      title: 'An intercooler that runs warm',
      q: 'In the two-stage example the intercooler fouls and delivers air at 35 °C instead of 20 °C. How much more power does the second stage need?',
      steps: [
        'Stage work is proportional to the inlet volume, and so to the absolute inlet temperature: $308.15/293.15 = 1.051$.',
        'The second stage needed $40.4/2 = 20.2$ kW; now it needs $20.2 \\times 1.051 = 21.2$ kW — 1.0 kW more, 2.5 % of the whole machine, for 15 K of fouling.'
      ],
      a: 'About 5 % more in the second stage, 2.5 % more for the machine.'
    }
  ],
  quiz: [
    { q: 'A two-stage compressor takes air from 1 to 16 bar absolute. What intermediate pressure minimises the work (perfect intercooling)?', answer: 4, unit: 'bar', tol: 0.02,
      why: '$p_i = \\sqrt{1 \\times 16} = 4$ bar absolute: both stages at 4 : 1.' },
    { q: 'With perfect intercooling and ever more stages, the total work approaches…', choices: ['zero', 'the adiabatic work', 'the isothermal work', 'half the adiabatic work'], a: 2,
      why: 'The zig-zag path hugs the isotherm more and more closely.' },
    { q: 'Oil-injected screw compressors rarely have intercoolers because…', choices: ['they cannot be built with two stages', 'the injected oil already absorbs the heat during compression, keeping a single stage cool', 'intercoolers only work on piston machines', 'their pressure is too low to matter'], a: 1,
      why: 'Oil injection cools the compression itself, so one stage reaches 7–13 bar at a moderate temperature. Two-stage oil-injected screws exist and save a few per cent, but they are the exception.' },
    { q: 'Three equal stages take air from 1 to 27 bar absolute. What is the pressure ratio of each stage?', answer: 3, tol: 0.02,
      why: '$27^{1/3} = 3$.' },
    { q: 'Water collects in an intercooler and must be drained.', a: true,
      why: 'Compression raises the dew point of the air; cooling it back in the intercooler condenses water, which would otherwise be carried into the next stage.' }
  ],
  applications: [
    'Two-stage piston compressors for workshops needing 10–15 bar.',
    'Oil-free two-stage screws and three-stage centrifugals for plant air.',
    'Breathing-air and diving compressors (200–300 bar) in three or four stages.',
    'Gas compression in refineries, pipelines and air separation plants.'
  ],
  sim: { id: 'comp-work-compare', params: { stages: 2 } }
},

{
  id: 'fad-capacity', parent: 'compressors', title: 'Free air delivery and capacity', level: 2,
  short: 'Free air delivery is the flow a compressor actually delivers, referred back to its intake conditions — less than its swept displacement and not the same as "normal" cubic metres. Divided into the input power it gives the specific power, the figure that compares compressors fairly.',
  keywords: ['free air delivery', 'FAD', 'ISO 1217', 'displacement', 'capacity', 'specific power', 'specific energy', 'kW per m³/min', 'Nm³', 'normal cubic metre', 'SCFM', 'pump-up test', 'package input power', 'kW per 100 cfm'],
  prereq: ['standard-air', 'compressor-types', 'reciprocating-compressors'],
  related: ['compression-work', 'screw-compressors', 'compressor-regulation', 'cost-of-compressed-air', 'air-audits', 'air-leaks'],
  body: `
What a compressor is worth is the air it delivers — and there are several ways to count that, some of them flattering.

### Displacement, free air delivery and "normal" air
**Displacement** is the swept volume per revolution times the speed: the flow the machine would move with no losses at all. Small piston compressors are often advertised by it ("intake 400 L/min").

**Free air delivery** (FAD) is the flow actually delivered at the outlet, converted back to the pressure, temperature and humidity at the inlet. It is measured under ISO 1217:2009, whose Annex C covers electrically driven packaged compressors and states results at a reference inlet of 1 bar absolute and 20 °C. FAD is always less than displacement — by roughly 10–20 % for screws and 25–40 % for small piston machines (see [[reciprocating-compressors]]).

**Normal cubic metres** (Nm³) count air at 0 °C and 1.01325 bar, so one Nm³ holds more air than one cubic metre at an inlet of 20 °C and 1 bar: 10 m³/min of FAD is only 9.2 Nm³/min. The ISO 8778 reference atmosphere used for pneumatic components (ANR, see [[standard-air]]) is 20 °C and 1 bar, the same as the ISO 1217 inlet; American SCFM are counted at 60 °F and 14.7 psi. Always ask which.

### Specific power
Dividing the **package input power** — everything drawn from the grid: main motor, fan, drive and controls — by the FAD gives the **specific power**, in kW per m³/min at a stated pressure. It is the one number that compares compressors fairly. The motor's nameplate rating does not, because packages differ in how hard they load their motors and in what fans and drives add. At 7 bar, good oil-injected screws of 30–250 kW typically reach about 6–7 kW per m³/min; small and older machines do worse, and every extra bar adds 6–8 %. North American standard data sheets quote the same figure in kW per 100 cfm: 6.5 kW per m³/min is 18.4 kW per 100 cfm.

| Specific power at 7 bar (typical) | kW per m³/min | kWh per m³ |
|---|---|---|
| Good screw, 90–250 kW | 6.0–6.5 | 0.10–0.11 |
| Screw, 15–37 kW | 6.5–7.5 | 0.11–0.13 |
| Small piston or scroll | 8–11 | 0.13–0.18 |

### Checking a compressor's delivery
A simple field check is the **pump-up test**. Isolate a receiver of known volume (with its pipework) from the network, empty it to a starting pressure, and time how long the compressor takes to raise it by a known amount. The free air delivered is the volume times the pressure rise over the atmospheric pressure, divided by the time — corrected by the ratio of absolute temperatures if the air in the receiver is warmer than the intake, because warm air packs fewer kilograms into the same pressure rise.

> [!tip] When comparing offers, ask for the FAD at your pressure measured to ISO 1217, and the package input power at that point — and, for variable-speed machines, at several flows (ISO 1217 Annex E).

> [!warn] A pump-up test fills a pressure vessel: never exceed its maximum allowable pressure, keep the safety valve in service, and do not isolate a receiver in a way that leaves the compressor running against a closed valve.
`,
  ideas: [
    'Displacement is the swept volume × speed; free air delivery is what actually comes out, referred to the inlet conditions.',
    'ISO 1217:2009 Annex C is the test standard for packaged compressors: 1 bar absolute and 20 °C at the inlet.',
    'Nm³ (0 °C, 1.01325 bar) are about 9 % more air than cubic metres at 20 °C and 1 bar.',
    'Specific power — package input over FAD at a stated pressure — is the fair comparison: about 6–7 kW per m³/min at 7 bar for good screws.',
    'A pump-up test checks the delivery: V Δp/(p_atm t), corrected for the receiver temperature.'
  ],
  pitfalls: [
    'The motor rating tells you the power — The package input includes motor losses, fans and drives, and the motor may run above or below its nameplate; only the measured package input is comparable.',
    'A cubic metre is a cubic metre — FAD, Nm³, ANR and SCFM are counted at different temperatures and pressures; mixing them makes a compressor look up to 10 % better or worse.',
    'Displacement is what a compressor delivers — It is the delivery with no losses; small piston machines deliver only 60–75 % of it.'
  ],
  formulas: [
    {
      name: 'Specific power',
      expr: 'SP = P/Q', tex: 'P_\\text{sp} = \\dfrac{P}{Q}',
      vars: {
        SP: { name: 'specific power', q: false, unit: 'kW/(m³/min)', tex: 'P_\\text{sp}' },
        P: { name: 'package input power', q: false, unit: 'kW', value: 80, tex: 'P' },
        Q: { name: 'free air delivery', q: false, unit: 'm³/min', value: 12.5, tex: 'Q' }
      },
      note: 'At a stated discharge pressure. Divide by 60 for kWh per m³ of free air; multiply by 2.83 for kW per 100 cfm.',
      stories: {
        SP: 'A compressor package draws {P} and delivers {Q} of free air at 7 bar. What is its specific power?',
        P: 'A compressor with a specific power of {SP} delivers {Q}. What power does it draw?'
      }
    },
    {
      name: 'Free air delivery from a pump-up test',
      expr: 'Q = V*(p2 - p1)/(patm*t)*T0/Tr', tex: 'Q = \\dfrac{V\\,(p_2 - p_1)}{p_\\text{atm}\\, t}\\,\\dfrac{T_0}{T_r}',
      vars: {
        Q: { name: 'free air delivery', q: 'airflow', unit: 'L/min ANR', tex: 'Q' },
        V: { name: 'receiver and pipework volume', q: 'volume', unit: 'L', value: 500, tex: 'V' },
        p2: { name: 'final receiver pressure (gauge)', q: 'pressure', unit: 'bar', value: 7, tex: 'p_2' },
        p1: { name: 'starting receiver pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_1' },
        patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' },
        t: { name: 'time to pump up', q: 'time', unit: 's', value: 30, tex: 't' },
        T0: { name: 'intake air temperature', q: 'temperature', unit: '°C', value: 20, tex: 'T_0' },
        Tr: { name: 'air temperature in the receiver', q: 'temperature', unit: '°C', value: 30, tex: 'T_r' }
      },
      note: 'Isothermal filling of a fixed volume, referred to the intake. Include the pipework between compressor and receiver in V; the pressure difference may be taken in gauge.',
      practice: { unknowns: ['Q', 't'] },
      stories: {
        Q: 'A compressor raises a receiver of {V} from {p1} to {p2} in {t}; the intake air is at {T0} and the receiver air at {Tr}. What is its free air delivery?',
        t: 'A compressor with a free air delivery of {Q} fills a receiver of {V} from {p1} to {p2} (intake {T0}, receiver air {Tr}). How long does it take?'
      }
    },
    {
      name: 'Free air delivery in normal cubic metres',
      expr: 'QN = Q*p1/pN*TN/T1', tex: 'Q_N = Q\\,\\dfrac{p_1}{p_N}\\,\\dfrac{T_N}{T_1}',
      vars: {
        QN: { name: 'flow in normal cubic metres (0 °C, 1.01325 bar)', q: false, unit: 'Nm³/min', tex: 'Q_N' },
        Q: { name: 'free air delivery at the inlet conditions', q: false, unit: 'm³/min', value: 10, tex: 'Q' },
        p1: { name: 'inlet pressure (absolute)', q: 'pressure', unit: 'bar', value: 1, tex: 'p_1' },
        pN: { name: 'normal pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.01325, fixed: true, tex: 'p_N' },
        TN: { name: 'normal temperature', q: 'temperature', unit: '°C', value: 0, fixed: true, tex: 'T_N' },
        T1: { name: 'inlet temperature', q: 'temperature', unit: '°C', value: 20, tex: 'T_1' }
      },
      note: 'Dry air assumed; strictly, water vapour in humid intake air is also subtracted when normal cubic metres of dry air are meant.',
      stories: {
        QN: 'A compressor delivers {Q} of free air at an inlet of {p1} and {T1}. How many normal cubic metres per minute is that?',
        Q: 'A process needs {QN}. What free air delivery is that at an inlet of {p1} and {T1}?'
      }
    }
  ],
  examples: [
    {
      title: 'What does it really deliver?',
      q: 'A small piston compressor is advertised with a displacement of 840 L/min. A pump-up test raises its 270 L receiver (pipework included) from 6 to 8 bar gauge in 55 s; the intake air is at 20 °C and the receiver air at 35 °C. What is its FAD?',
      steps: [
        '$Q = V\\,\\Delta p/(p_\\text{atm} t) = 0.27 \\times 2/(1.013 \\times 55) = 9.69\\times10^{-3}$ m³/s = 582 L/min, uncorrected.',
        'Temperature correction: $293.15/308.15 = 0.951$, so $Q = 553$ L/min.',
        'Against the displacement: $553/840 = 66$ % — typical of a small piston machine.'
      ],
      a: 'About 550 L/min of free air — two-thirds of the advertised displacement.'
    },
    {
      title: 'Comparing two offers',
      q: 'Offer A: 16.0 m³/min at 7 bar for a package input of 101 kW. Offer B: 15.2 m³/min at 7 bar for 99 kW. Both would run 6000 hours a year at full load; electricity costs ¤0.15 per kWh. Which is better, and by how much?',
      steps: [
        'Specific power: A $101/16.0 = 6.31$, B $99/15.2 = 6.51$ kW per m³/min.',
        'Delivering B\'s 15.2 m³/min, A would need $6.31 \\times 15.2 = 95.9$ kW against B\'s 99 kW: 3.05 kW less.',
        'Per year: $3.05 \\times 6000 = 18\\,300$ kWh, about ¤2,700.'
      ],
      a: 'A is about 3 % more efficient — worth roughly ¤2,700 a year, more than the difference in motor size suggests.'
    },
    {
      title: 'FAD and normal cubic metres',
      q: 'A compressor delivers 10 m³/min of free air at an inlet of 1 bar absolute and 20 °C. How much is that in Nm³/min?',
      steps: [
        '$Q_N = 10 \\times (1/1.01325) \\times (273.15/293.15) = 10 \\times 0.987 \\times 0.932 = 9.20$ Nm³/min.'
      ],
      a: '9.2 Nm³/min — about 8 % less than the number of free-air cubic metres.'
    }
  ],
  quiz: [
    { q: 'A compressor\'s displacement equals its free air delivery.', a: false,
      why: 'Displacement is the swept volume × speed. Clearance re-expansion, intake heating, valve losses and leakage make the delivery smaller: by 10–20 % for screws and 25–40 % for small piston machines.' },
    { q: 'A compressor package draws 45 kW and delivers 7.2 m³/min at 7 bar. What is its specific power, in kW per m³/min?', answer: 6.25, tol: 0.02,
      why: '$45/7.2 = 6.25$ kW per m³/min — a good figure at 7 bar.' },
    { q: 'Which is more air: 10 Nm³/min, or 10 m³/min of free air at 20 °C and 1 bar?', choices: ['10 m³/min of free air', '10 Nm³/min', 'They are the same', 'It depends on the discharge pressure'], a: 1,
      why: 'Normal cubic metres are counted at 0 °C and 1.01325 bar — colder and slightly higher pressure — so each holds about 9 % more air: 10 Nm³/min is 10.9 m³/min of free air.' },
    { q: 'In a pump-up test, why must the air in the receiver be at intake temperature — or the result be corrected?', choices: ['Hot air damages the gauge', 'Warm air fills the receiver to the same pressure with fewer kilograms, so the uncorrected test overstates the delivery', 'Warm air makes the compressor slower', 'It does not matter'], a: 1,
      why: 'By $pV = mRT$, the mass needed to raise the pressure by $\\Delta p$ falls as $T$ rises. Multiply by $T_0/T_r$ in kelvin.' },
    { q: 'What is 6 kW per m³/min in kW per 100 cfm?', answer: 17.0, tol: 0.02,
      why: '1 m³/min = 35.3 cfm, so $6/35.3 \\times 100 = 17.0$ kW per 100 cfm.' }
  ],
  applications: [
    'Comparing compressor offers on specific power at the same pressure.',
    'Checking a worn compressor\'s delivery with a pump-up test.',
    'Converting between the FAD of compressors and the normal cubic metres of process specifications.',
    'Estimating the energy cost of compressed air (see [[cost-of-compressed-air]]).'
  ],
  sim: 'comp-piston-pv'
},

{
  id: 'compressor-regulation', parent: 'compressor-control', title: 'Load/unload, modulation and variable speed', level: 2,
  short: 'A compressor must match its output to a demand that changes all day. Start/stop, load/unload, inlet modulation and variable-speed drives do it with very different part-load efficiency — and a group of compressors needs a sequencer that keeps each doing what it does best.',
  keywords: ['compressor control', 'load unload', 'start stop', 'modulation', 'inlet throttling', 'variable speed drive', 'VSD', 'frequency converter', 'part load', 'unloaded power', 'blow-down', 'sequencer', 'master controller', 'pressure band', 'control gap'],
  prereq: ['compressor-types', 'fad-capacity', 'screw-compressors'],
  related: ['receivers', 'receiver-sizing', 'centrifugal-compressors', 'pressure-optimisation', 'artificial-demand', 'cost-of-compressed-air', 'electronics:three-phase', 'electronics:pwm'],
  body: `
Demand for compressed air rises and falls all day, while a compressor delivers a fixed volume per revolution. Something must match the two; how it is done decides how much energy is wasted at part load.

### Start/stop
The simplest: a pressure switch starts the motor at a lower pressure and stops it at an upper one. Fine for small piston compressors, but motors of more than a few kilowatts tolerate only a limited number of starts an hour, so larger machines need something else.

### Load/unload
Most fixed-speed screws **load** and **unload**. Loaded, the inlet valve is open and the machine delivers its full FAD. When the pressure reaches the upper setting, the inlet valve closes and the separator vessel **blows down** to a low pressure; the motor keeps turning, drawing typically **25–40 % of full-load power** for no air at all. When the pressure falls to the lower setting it loads again. After a set time unloaded, the motor stops. Blow-down takes tens of seconds, so with a small receiver the machine cycles before it reaches its low unloaded power and wastes even more.

### Modulation
Throttling the inlet reduces the delivery smoothly but saves little power: at zero delivery a modulating screw still draws about 70 % of full load. It is the least efficient way to meet a low demand.

### Variable-speed drive
A **variable-speed drive** — a frequency converter feeding the motor (see [[electronics:pwm|pulse-width modulation]]) — slows the compressor down. A positive-displacement machine's FAD is roughly proportional to its speed, and so, roughly, is its power, so the specific power stays nearly constant over a range of about 20–100 % of speed; the pressure is held within about ±0.1 bar instead of a band of 0.5–1 bar. At full load a variable-speed machine is typically 2–4 % *less* efficient than a fixed-speed one, because of the drive's own losses. The savings come when the demand varies between roughly 30 and 80 %.

| Delivery | Load/unload (large receiver) | Modulation | Variable speed |
|---|---|---|---|
| 100 % | 100 % | 100 % | about 103 % |
| 75 % | 83 % | 93 % | 78 % |
| 50 % | 65 % | 85 % | 54 % |
| 25 % | 48 % | 78 % | 29 % |

Power as a share of full-load power; typical values, for load/unload with 30 % unloaded power and modulation with 70 % at zero flow.

### Several compressors
A plant with several compressors needs a **sequencer** (master controller) that starts, loads and stops them from one pressure signal, instead of each running on its own staggered pressure band — which forces the whole system to run at a higher average pressure. The usual pattern is fixed-speed machines fully loaded on the base load and one variable-speed machine trimming. Its range must cover the steps between the fixed machines: if a fixed machine delivers more than the variable one can take up, some demands fall into a **control gap** where machines cycle on and off.

> [!key] Unloaded running and wide pressure bands are the hidden costs of fixed-speed control. Match the machine to the demand profile — fixed-speed for steady base load, variable-speed for the swings — and hold the pressure as low and tight as the users allow.

> [!warn] Compressors under automatic control can start at any moment. Before working on one, isolate and lock out the electrical supply, close and lock the discharge isolation valve, and release the pressure from the separator and receiver.
`,
  ideas: [
    'Load/unload runs the motor unloaded at 25–40 % of full power while it delivers nothing.',
    'Modulation is smooth but inefficient: about 70 % power at zero delivery.',
    'A variable-speed drive keeps the specific power nearly constant from about 20 to 100 % speed and holds the pressure tight.',
    'At full load a variable-speed machine is 2–4 % less efficient; it pays where demand varies.',
    'A sequencer runs fixed machines on the base load and one variable-speed machine as trim, avoiding control gaps.'
  ],
  pitfalls: [
    'An unloaded compressor uses no energy — It keeps its motor, rotors, oil and fan turning: 25–40 % of full-load power for no air, until it stops.',
    'Variable speed always saves energy — At steady full load a fixed-speed machine is slightly better; the saving comes from varying demand.',
    'More compressors running means more security — Machines running unloaded "just in case" waste energy; a sequencer can start a standby machine within seconds when it is needed.'
  ],
  formulas: [
    {
      name: 'Part-load power of a fixed-speed compressor',
      expr: 'P = Pf*(f + (1 - f)*x)', tex: 'P = P_f\\,\\left[f + (1 - f)\\,x\\right]',
      vars: {
        P: { name: 'average input power', q: 'power', unit: 'kW', tex: 'P' },
        Pf: { name: 'full-load input power', q: 'power', unit: 'kW', value: 90, tex: 'P_f' },
        f: { name: 'power at zero delivery, as a share of full load', q: 'ratio', unit: '%', value: 30, min: 0, max: 100, tex: 'f' },
        x: { name: 'average delivery as a share of FAD', q: 'ratio', unit: '%', value: 60, min: 0, max: 100, tex: 'x' }
      },
      note: 'A straight line between f at zero delivery and 100 % at full delivery: $f$ ≈ 25–40 % for load/unload with a large receiver (after blow-down), ≈ 70 % for inlet modulation. A variable-speed drive has $f$ near zero over its speed range.',
      practice: { unknowns: ['P', 'x'] },
      stories: {
        P: 'A fixed-speed compressor takes {Pf} at full load and {f} of that at zero delivery. On average it delivers {x} of its FAD. What is its average power?',
        x: 'A compressor with a full-load power of {Pf} and {f} unloaded power averages {P}. What share of its FAD does it deliver on average?'
      }
    },
    {
      name: 'Energy spent beyond proportional power',
      expr: 'E = Pf*f*(1 - x)*t', tex: 'E = P_f\\, f\\,(1 - x)\\, t',
      vars: {
        E: { name: 'energy above a machine whose power follows the delivery', q: 'energy', unit: 'kWh', tex: 'E' },
        Pf: { name: 'full-load input power', q: 'power', unit: 'kW', value: 90, tex: 'P_f' },
        f: { name: 'power at zero delivery, as a share of full load', q: 'ratio', unit: '%', value: 30, min: 0, max: 100, tex: 'f' },
        x: { name: 'average delivery as a share of FAD', q: 'ratio', unit: '%', value: 60, min: 0, max: 100, tex: 'x' },
        t: { name: 'running hours', q: 'time', unit: 'h', value: 6000, tex: 't' }
      },
      note: 'The difference between the straight line $P_f[f + (1-f)x]$ and $P_f\\,x$. An upper bound on what better control can save; a real variable-speed machine recovers most, but not all, of it.',
      stories: {
        E: 'A {Pf} compressor with {f} unloaded power delivers on average {x} of its FAD for {t} a year. How much energy goes on part-load losses?'
      }
    }
  ],
  examples: [
    {
      title: 'Load/unload or variable speed?',
      q: 'A 90 kW-input fixed-speed screw (30 % unloaded power) delivers on average 60 % of its FAD for 6000 h a year. A variable-speed machine of the same size would need about $0.04 + 0.99x$ of full-load power. What would it save at ¤0.15 per kWh?',
      steps: [
        'Fixed speed: $P = 90 \\times (0.30 + 0.70 \\times 0.60) = 64.8$ kW.',
        'Variable speed: $P = 90 \\times (0.04 + 0.99 \\times 0.60) = 57.1$ kW.',
        'Saving: 7.7 kW, $\\times 6000 = 46\\,200$ kWh a year — about ¤6,900.',
        'On top of that, holding 7.1 bar instead of cycling between 7.0 and 7.8 bar lowers the average pressure by about 0.3 bar: another 2 % or so.'
      ],
      a: 'About 46,000 kWh (¤6,900) a year from the control alone, plus a little from the tighter pressure.'
    },
    {
      title: 'Modulation at half load',
      q: 'The same 90 kW machine runs at 50 % average delivery. What does it draw with inlet modulation (70 % at zero flow) compared with load/unload (30 %)?',
      steps: [
        'Modulation: $90 \\times (0.70 + 0.30 \\times 0.5) = 76.5$ kW.',
        'Load/unload: $90 \\times (0.30 + 0.70 \\times 0.5) = 58.5$ kW.',
        'Modulation wastes 18 kW more — around 100,000 kWh over 6000 hours.'
      ],
      a: '76.5 kW against 58.5 kW: modulation is the worst choice at low load.'
    },
    {
      title: 'A control gap',
      q: 'A plant has two fixed-speed screws of 10 m³/min and a variable-speed screw of 3–12 m³/min. Demand is 22 m³/min. How should they run?',
      steps: [
        'Two fixed machines (20 m³/min) plus the variable one at 2 m³/min would be below its minimum of 3: it would stop and start.',
        'One fixed machine (10) plus the variable one at 12 gives exactly 22 m³/min, with the second fixed machine stopped.',
        'A sequencer makes this choice automatically; because the variable machine\'s range (9 m³/min) is almost as large as a fixed machine\'s step (10), only a narrow band of demands causes cycling.'
      ],
      a: 'Run one fixed machine loaded and the variable-speed machine at full speed; stop the other fixed machine.'
    }
  ],
  quiz: [
    { q: 'Why does an unloaded screw compressor still draw 25–40 % of its full-load power?', choices: ['It is still compressing air to full pressure', 'The motor keeps turning the rotors, churning the oil, driving the fan, and compressing a little air against the blown-down separator', 'The inlet valve leaks', 'The frequency converter draws it'], a: 1,
      why: 'With the inlet closed the rotors still turn in oil against a reduced pressure; motor, fan and mechanical losses remain.' },
    { q: 'Which control is least efficient when a compressor averages 40 % of its FAD?', choices: ['Variable-speed drive', 'Load/unload with a large receiver', 'Inlet modulation', 'All are the same'], a: 2,
      why: 'Modulation still draws about 70 % power at zero flow: at 40 % delivery about 82 %, against about 58 % for load/unload and about 44 % for variable speed.' },
    { q: 'A variable-speed compressor always uses less energy than a fixed-speed one of the same size.', a: false,
      why: 'At steady full load the drive\'s losses make it 2–4 % worse. It saves when the demand varies.' },
    { q: 'A 55 kW-input fixed-speed compressor with 25 % unloaded power averages 40 % delivery. What is its average power, in kW?', answer: 30.25, unit: 'kW', tol: 0.02,
      why: '$55 \\times (0.25 + 0.75 \\times 0.40) = 30.25$ kW.' },
    { q: 'What is a "control gap" in a multi-compressor system?', choices: ['A leak in the control air', 'A range of demand the machines cannot follow smoothly, because a fixed machine\'s step is larger than the variable-speed machine\'s range', 'The time the sequencer takes to start a machine', 'The pressure band of a load/unload compressor'], a: 1,
      why: 'If the variable-speed machine cannot absorb a fixed machine\'s full output, demands in that range make machines cycle. Size the variable-speed machine\'s range to cover the largest fixed step.' }
  ],
  applications: [
    'Retrofitting a variable-speed trim compressor to a plant of fixed-speed machines.',
    'Sequencers for compressor rooms with several machines of different sizes.',
    'Night and weekend operation: small machines, or stopping everything and fixing the leaks.',
    'Energy audits that log load/unload hours to find wasted unloaded running (see [[air-audits]]).'
  ],
  sim: 'comp-load-unload'
}

,

{
  id: 'receivers', parent: 'compressor-control', title: 'Air receivers', level: 1,
  short: 'A receiver is a pressure vessel between the compressor and the network: it stores air for peaks, smooths pulsations, gives the compressor\'s controls time, and collects condensate. It holds less usable air than people think — and more stored energy.',
  keywords: ['air receiver', 'air tank', 'pressure vessel', 'wet receiver', 'dry receiver', 'safety valve', 'condensate drain', 'usable air', 'stored energy', 'Brode', 'PED', 'Simple Pressure Vessels Directive', 'ASME', 'inspection', 'corrosion'],
  prereq: ['boyles-law', 'compressor-types', 'energy-in-compressed-air'],
  related: ['receiver-sizing', 'compressor-regulation', 'pressure-equipment', 'condensate-drains', 'condensate', 'pneumatic-safety', 'hydraulics:accumulators'],
  body: `
Next to almost every compressor stands a steel tank: the **air receiver**. It does four jobs. It **stores** air, so short peaks of demand can be met without a bigger compressor; it **smooths** the pulsating flow of piston machines; it gives a load/unload or start/stop compressor's controls **time**, so the machine does not switch every few seconds (see [[receiver-sizing]]); and, as the air slows and cools in it, it **collects condensate** and some oil and dirt.

### Wet and dry receivers
A **wet** receiver sits after the compressor and aftercooler, before the dryer. It catches water that condenses as the air cools, so it needs a reliable automatic drain. A **dry** receiver sits after the dryer and filters: it stores dried air, and because peaks are drawn from it, the dryer never sees more than the compressor's flow. Extra receivers are often placed near large intermittent users — a test rig, a blow-off station — so their peaks do not pull down the whole network.

### Less air than you think
Only the air between the highest and the lowest acceptable pressure can be used:

$$V_\\text{free} = V\\,\\frac{p_\\text{max} - p_\\text{min}}{p_\\text{atm}}$$

A 1000 L receiver working between 8 and 6.5 bar gauge offers 1.48 m³ of free air — about nine seconds of a 10 m³/min compressor's output. Receivers smooth and buffer; they do not replace compressor capacity. The pipework counts too: a long ring main of large pipe can hold as much as a receiver.

### What a receiver carries
Its fittings are part of its safety: a **safety valve** sized to pass the full compressor delivery and set no higher than the vessel's maximum allowable pressure (PS); a pressure gauge; an automatic **condensate drain** — preferably a level-sensing, zero-loss type, since timer drains blow air away; an inspection opening; isolating valves; and a data plate stating PS, the design temperatures, the volume and the year of manufacture.

### Stored energy and the rules
Compressed air in a vessel stores a great deal of energy. A common upper-bound estimate for a sudden rupture treats the gas as expanding against the atmosphere:

$$E = \\frac{p_g V}{\\gamma - 1}$$

For 1000 L at 10 bar gauge that is 2.5 MJ — about the kinetic energy of a 1.5-tonne car at 200 km/h. So receivers are built and inspected as pressure equipment: in the EU under the Simple Pressure Vessels Directive 2014/29/EU or the Pressure Equipment Directive 2014/68/EU, in the US under Section VIII of the ASME Boiler and Pressure Vessel Code, and in service under national rules for periodic examination — in the UK, for example, the Pressure Systems Safety Regulations 2000 require a written scheme of examination (see [[pressure-equipment]]). The main enemy is internal **corrosion** from standing condensate, which thins the wall from inside where no one sees it.

> [!warn] A receiver is a pressure vessel. Keep its safety valve in service and never set it above the vessel's rated pressure; drain condensate daily or automatically; never weld on, drill or modify a receiver; have it examined as the rules require. Before any work, isolate it, release the pressure to zero, and lock out the compressor.
`,
  ideas: [
    'A receiver stores air for peaks, smooths pulsation, gives the compressor control time, and collects condensate.',
    'Wet receivers go before the dryer and need an automatic drain; dry receivers store dried air after it.',
    'Only the air between the upper and lower pressures is usable: V(p_max − p_min)/p_atm.',
    'Receivers store a lot of energy — about 2.5 MJ in 1000 L at 10 bar gauge — and are regulated and inspected as pressure equipment.',
    'Internal corrosion from standing condensate is the main threat to an old receiver.'
  ],
  pitfalls: [
    'A big receiver replaces compressor capacity — It supplies only the air between two pressures: seconds to minutes of peak. Sustained demand must come from the compressors.',
    'The safety valve can be set higher if the plant needs more pressure — Never above the vessel\'s maximum allowable pressure: the valve is what keeps the vessel within its design.',
    'An old receiver that holds pressure is safe — Corrosion thins the wall from inside, invisibly; only examination (thickness measurement, inspection) shows its real condition.'
  ],
  formulas: [
    {
      name: 'Usable free air in a receiver',
      expr: 'Vf = V*(pmax - pmin)/patm', tex: 'V_\\text{free} = V\\,\\dfrac{p_\\text{max} - p_\\text{min}}{p_\\text{atm}}',
      vars: {
        Vf: { name: 'usable free air', q: 'volume', unit: 'L', tex: 'V_\\text{free}' },
        V: { name: 'receiver volume', q: 'volume', unit: 'L', value: 1000, tex: 'V' },
        pmax: { name: 'upper pressure (gauge)', q: 'pressure', unit: 'bar', value: 8, tex: 'p_\\text{max}' },
        pmin: { name: 'lowest acceptable pressure (gauge)', q: 'pressure', unit: 'bar', value: 6.5, tex: 'p_\\text{min}' },
        patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' }
      },
      note: 'Boyle\'s law at constant temperature; the difference of two gauge pressures equals the difference of the absolute ones.',
      practice: { unknowns: ['Vf', 'V'] },
      stories: {
        Vf: 'A receiver of {V} works between {pmax} and {pmin}. How much free air can be drawn from it?',
        V: 'A peak needs {Vf} of free air while the pressure may fall from {pmax} to {pmin}. How large a receiver is needed?'
      }
    },
    {
      name: 'Stored energy of a receiver (upper bound)',
      expr: 'E = p*V/(g - 1)', tex: 'E = \\dfrac{p_g V}{\\gamma - 1}',
      vars: {
        E: { name: 'energy released in a sudden rupture (upper bound)', q: 'energy', unit: 'MJ', tex: 'E' },
        p: { name: 'pressure (gauge)', q: 'pressure', unit: 'bar', value: 10, tex: 'p_g' },
        V: { name: 'vessel volume', q: 'volume', unit: 'L', value: 1000, tex: 'V' },
        g: { name: 'ratio of specific heats γ', value: 1.4, min: 1.05, max: 1.7, fixed: true, tex: '\\gamma' }
      },
      note: 'Brode\'s estimate, used in safety studies: the internal energy the gas holds above what it would have at atmospheric pressure. The mechanical energy of an actual burst is lower — for air, roughly 35–70 % of it depending on the model — but still enormous.',
      stories: {
        E: 'A receiver of {V} is at {p}. What energy could a sudden rupture release, at most?',
        p: 'A vessel of {V} must not store more than {E}. What is the highest gauge pressure?'
      }
    }
  ],
  examples: [
    {
      title: 'Nine seconds of air',
      q: 'A 1000 L receiver works between 8.0 and 6.5 bar gauge. How much free air can it supply, and for how long could it alone feed a demand of 10 m³/min?',
      steps: [
        '$V_\\text{free} = 1000 \\times (8.0 - 6.5)/1.013 = 1481$ L.',
        'At 10 m³/min = 10,000 L/min: $1481/10\\,000 = 0.148$ min, about 9 s.'
      ],
      a: 'About 1.5 m³ of free air — nine seconds at 10 m³/min.'
    },
    {
      title: 'The energy in a workshop receiver',
      q: 'A 500 L receiver is rated for 11 bar and runs at 11 bar gauge. What is the upper-bound energy of a sudden rupture?',
      steps: [
        '$E = p_g V/(\\gamma - 1) = 11\\times10^5 \\times 0.5/0.4 = 1.375\\times10^6$ J.',
        'About 1.4 MJ — comparable to a 1.5-tonne car at 150 km/h ($\\tfrac12 \\times 1500 \\times 41.7^2 = 1.3$ MJ).'
      ],
      a: 'About 1.4 MJ: why receivers are inspected and never modified.'
    }
  ],
  quiz: [
    { q: 'Where does a wet receiver sit in a compressed-air system?', choices: ['After the dryer and filters', 'After the compressor and aftercooler, before the dryer', 'At the end of the ring main', 'Before the compressor inlet'], a: 1,
      why: 'The wet receiver catches condensate from the freshly cooled air and needs an automatic drain; a dry receiver comes after the dryer.' },
    { q: 'How much free air does a 500 L receiver supply between 7.5 and 6.0 bar gauge?', answer: 740, unit: 'L', tol: 0.02,
      why: '$500 \\times 1.5/1.013 = 740$ L.' },
    { q: 'The safety valve of a receiver may be set above the vessel\'s maximum allowable pressure if the process needs it.', a: false,
      why: 'The safety valve must be set no higher than the vessel\'s maximum allowable pressure (PS) and be able to pass the full compressor delivery; it is what keeps the vessel within its design.' },
    { q: 'What is the most common cause of air-receiver deterioration?', choices: ['Fatigue from pressure cycles', 'Internal corrosion from standing condensate', 'Ultraviolet light', 'Vibration of the safety valve'], a: 1,
      why: 'Water collects at the bottom; if it is not drained it corrodes the wall from inside. Daily or automatic draining and periodic examination are the defence.' },
    { q: 'Why are level-sensing condensate drains preferred to timer-operated ones?', choices: ['They are cheaper', 'A timer drain opens whether or not there is water, blowing compressed air away — or opens too rarely and lets water build up', 'Timer drains cannot be automated', 'They are required by law everywhere'], a: 1,
      why: 'A zero-loss drain opens only when condensate is present, so it neither wastes air nor floods.' }
  ],
  applications: [
    'Workshop compressors mounted on their own receiver.',
    'Central wet and dry receivers in a compressor house.',
    'Local receivers next to large intermittent users on a long network.',
    'The air tanks of truck and train brakes, which store air for several brake applications.'
  ],
  sim: { id: 'comp-load-unload', params: { receiver: 1000 } }
},

{
  id: 'receiver-sizing', parent: 'compressor-control', title: 'Sizing a receiver', level: 2,
  short: 'A receiver gets its size from two jobs: supplying a peak that exceeds the compressor\'s output within an allowed pressure fall, and keeping a load/unload or start/stop compressor from switching too often. The worst case for switching is a demand of half the compressor\'s delivery.',
  keywords: ['receiver sizing', 'receiver volume', 'peak demand', 'load cycles', 'switching frequency', 'pressure band', 'cycle time', 'storage', 'gallons per cfm', 'receiver calculator'],
  prereq: ['receivers', 'compressor-regulation', 'standard-air'],
  related: ['fad-capacity', 'piping-layout', 'pressure-optimisation', 'artificial-demand', 'hydraulics:accumulator-sizing'],
  body: `
A receiver has two sizing jobs, and the larger answer wins. Try your own numbers with the [receiver calculator](#/tools/pneu/receiver).

### For a peak
When a user draws $Q_p$ for a time $t$ and the compressor can supply only $Q_c$, the difference must come from storage, while the pressure falls from $p_\\text{max}$ to no lower than $p_\\text{min}$:

$$V = \\frac{(Q_p - Q_c)\\,t\\,p_\\text{atm}}{p_\\text{max} - p_\\text{min}}$$

A test rig taking 8 m³/min for 30 s from a 5 m³/min compressor, with the pressure allowed to fall from 8 to 6.5 bar gauge, needs about 1000 L. Set $Q_c = 0$ and the same formula tells how long a receiver keeps a critical process going if the compressor trips.

### For the compressor's controls
A load/unload compressor fills the receiver from the lower to the upper pressure while loaded, then lets the demand draw it back down while unloaded. With a demand $q$ the loaded time is $V\\Delta p/(p_\\text{atm}(Q_c - q))$ and the unloaded time $V\\Delta p/(p_\\text{atm}\\,q)$. Their sum is shortest — the switching most frequent — when $q = Q_c/2$, giving a cycle of $4V\\Delta p/(p_\\text{atm}Q_c)$. To keep to at most $z$ cycles an hour:

$$V = \\frac{Q_c\\, p_\\text{atm}}{4\\, z\\, \\Delta p}$$

A 5 m³/min compressor with a 1 bar band, limited to 30 cycles an hour, needs about 2.5 m³; halve the band and the receiver must double. The compressor's maker states how many load cycles it tolerates; a start/stop motor may allow only a handful of starts an hour.

### Rules of thumb and their limits
American practice has long quoted about 1 US gallon of receiver per cfm of compressor capacity, and 3–5 gallons per cfm for load/unload screws — roughly 8–40 litres per L/s of FAD. The formulas above are better, because they use the pressure band and the actual peaks. A variable-speed compressor needs less storage but not none: it takes some seconds to speed up, and at very low demand it too must stop and start.

### Where the volume is
Pipework counts: 100 m of DN 80 pipe holds about 500 L. Storage near a large intermittent user, behind a check valve, serves that user without dragging down the rest of the network. And storing air at a higher pressure behind a pressure–flow controller that feeds the plant at a steady lower pressure turns a small receiver into a large one — at the cost of compressing to that higher pressure.

> [!tip] Before buying a bigger receiver for a peak, look at the peak: a slow-opening valve, a local receiver or a smaller nozzle may remove it at a fraction of the cost.
`,
  ideas: [
    'For a peak: V = (Q_p − Q_c) t p_atm/(p_max − p_min).',
    'For load/unload control the worst switching happens at half load; V = Q_c p_atm/(4zΔp).',
    'Halving the pressure band doubles the receiver needed for the same number of cycles.',
    'Pipework volume and local receivers near big users count as storage.',
    'Variable-speed compressors need less storage, but not none.'
  ],
  pitfalls: [
    'The receiver should be sized for the average demand — Average demand says nothing about storage; the peaks above the compressor output and the pressure band decide it.',
    'The worst case for cycling is a very low demand — At low demand the compressor stays unloaded for a long time; the most frequent switching is at half its delivery.',
    'A narrow pressure band is free — For a load/unload compressor it needs a proportionally larger receiver, or the machine cycles faster; a variable-speed machine holds a narrow band without that cost.'
  ],
  derivation: {
    title: 'Why half load is the worst case for cycling',
    steps: [
      { text: 'While loaded, the compressor fills the receiver at the net rate $Q_c - q$; while unloaded, the demand $q$ empties it. Each phase moves the free air $V\\Delta p/p_\\text{atm}$:', tex: 't_\\text{cycle} = \\frac{V\\,\\Delta p}{p_\\text{atm}}\\left(\\frac{1}{Q_c - q} + \\frac{1}{q}\\right) = \\frac{V\\,\\Delta p}{p_\\text{atm}}\\,\\frac{Q_c}{q\\,(Q_c - q)}' },
      { text: 'The product $q(Q_c - q)$ is largest, and the cycle shortest, at $q = Q_c/2$:', tex: 't_\\text{min} = \\frac{4\\,V\\,\\Delta p}{p_\\text{atm}\\,Q_c}' },
      { text: 'Requiring at most $z$ cycles per unit time, $t_\\text{min} \\ge 1/z$, gives the receiver volume:', tex: 'V = \\frac{Q_c\\,p_\\text{atm}}{4\\,z\\,\\Delta p}' }
    ]
  },
  formulas: [
    {
      name: 'Receiver for a peak demand',
      expr: 'V = (Qp - Qc)*t*patm/(pmax - pmin)', tex: 'V = \\dfrac{(Q_p - Q_c)\\,t\\,p_\\text{atm}}{p_\\text{max} - p_\\text{min}}',
      vars: {
        V: { name: 'receiver volume', q: 'volume', unit: 'L', tex: 'V' },
        Qp: { name: 'peak demand', q: 'airflow', unit: 'm³/min ANR', value: 8, tex: 'Q_p' },
        Qc: { name: 'compressor free air delivery', q: 'airflow', unit: 'm³/min ANR', value: 5, tex: 'Q_c' },
        t: { name: 'length of the peak', q: 'time', unit: 's', value: 30, tex: 't' },
        patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' },
        pmax: { name: 'pressure at the start of the peak (gauge)', q: 'pressure', unit: 'bar', value: 8, tex: 'p_\\text{max}' },
        pmin: { name: 'lowest acceptable pressure (gauge)', q: 'pressure', unit: 'bar', value: 6.5, tex: 'p_\\text{min}' }
      },
      note: 'Isothermal; include the pipework in the volume. With $Q_c = 0$ it gives the storage that bridges a compressor failure for a time $t$.',
      practice: { unknowns: ['V', 't'] },
      stories: {
        V: 'A peak of {Qp} lasts {t}; the compressor supplies {Qc}. The pressure may fall from {pmax} to {pmin}. How large must the receiver be?',
        t: 'A receiver of {V} starts at {pmax} and may fall to {pmin}. A demand of {Qp} exceeds the compressor\'s {Qc}. How long can the peak last?'
      }
    },
    {
      name: 'Receiver for the switching frequency',
      expr: 'V = Qc*patm/(4*z*dp)', tex: 'V = \\dfrac{Q_c\\, p_\\text{atm}}{4\\, z\\, \\Delta p}',
      vars: {
        V: { name: 'receiver volume (with the pipework)', q: 'volume', unit: 'L', tex: 'V' },
        Qc: { name: 'compressor free air delivery', q: 'airflow', unit: 'm³/min ANR', value: 5, tex: 'Q_c' },
        patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' },
        z: { name: 'most load cycles allowed', q: 'rate', unit: '1/h', value: 30, tex: 'z' },
        dp: { name: 'pressure band between load and unload', q: 'pressure', unit: 'bar', value: 1, tex: '\\Delta p' }
      },
      note: 'The worst case, at a demand of half the compressor\'s delivery. For start/stop control use the permitted motor starts per hour.',
      practice: { unknowns: ['V', 'z', 'dp'] },
      stories: {
        V: 'A load/unload compressor delivers {Qc}, switches over a band of {dp} and should load at most {z}. What receiver volume does it need?',
        z: 'A compressor of {Qc} with a band of {dp} works into {V}. How many load cycles can it make at worst?',
        dp: 'A compressor of {Qc} works into {V} and may load at most {z}. What pressure band does that require?'
      }
    }
  ],
  examples: [
    {
      title: 'A test rig\'s peak',
      q: 'A test rig takes 8 m³/min for 30 s; the compressor delivers 5 m³/min. The pressure may fall from 8 to 6.5 bar gauge. What receiver volume is needed?',
      steps: [
        'Shortfall: $8 - 5 = 3$ m³/min = 0.05 m³/s, for 30 s: 1.5 m³ of free air.',
        '$V = 1.5 \\times 1.013/1.5 = 1.013$ m³ — about 1000 L.',
        'Choose the next standard size, 1500 L — or 1000 L if the pipework adds a few hundred litres.'
      ],
      a: 'About 1000 L of storage (pipework included).'
    },
    {
      title: 'Cycling of a load/unload screw',
      q: 'A 5 m³/min load/unload screw switches between 7 and 8 bar gauge and should load at most 30 times an hour. What storage does it need, and how often does it cycle at worst with only 1000 L?',
      steps: [
        '$V = Q_c p_\\text{atm}/(4z\\Delta p) = (5/60) \\times 1.013/(4 \\times (30/3600) \\times 1) = 2.53$ m³.',
        'With 1000 L: $z = Q_c p_\\text{atm}/(4V\\Delta p) = (5/60) \\times 1.013/(4 \\times 1 \\times 1) = 0.0211$ per second — 76 cycles an hour, one every 47 s.'
      ],
      a: 'About 2.5 m³; with 1000 L it would cycle up to 76 times an hour.'
    },
    {
      title: 'Riding through a compressor trip',
      q: 'A 2000 L receiver at 7.5 bar gauge feeds a process using 3 m³/min that must stop safely before the pressure falls below 6 bar gauge. How long does it have if the compressor trips?',
      steps: [
        'Usable free air: $2000 \\times 1.5/1.013 = 2961$ L.',
        'At 3000 L/min: $2961/3000 = 0.99$ min — about a minute.'
      ],
      a: 'About one minute to shut down safely.'
    }
  ],
  quiz: [
    { q: 'For a load/unload compressor, at what demand does it switch most often?', choices: ['At very low demand', 'At half its free air delivery', 'At 90 % of its delivery', 'Switching frequency does not depend on demand'], a: 1,
      why: 'The cycle time is proportional to $Q_c/(q(Q_c - q))$, shortest at $q = Q_c/2$.' },
    { q: 'A peak of 6 m³/min lasts 60 s; the compressor gives 4 m³/min and the pressure may fall by 1 bar. What receiver volume is needed, in litres?', answer: 2026, unit: 'L', tol: 0.02,
      why: '$V = (6 - 4)/60 \\times 60 \\times 1.013/1 = 2.026$ m³ = 2026 L.' },
    { q: 'Halving the pressure band of a load/unload compressor doubles the receiver volume needed for the same maximum switching frequency.', a: true,
      why: '$V = Q_c p_\\text{atm}/(4z\\Delta p)$ is inversely proportional to $\\Delta p$.' },
    { q: 'Why should the pipework volume be included when sizing a receiver?', choices: ['It is not needed', 'The air in the pipes is stored and used in the same way as the air in the receiver; a large ring main can hold as much', 'Pipes add pressure drop', 'Regulations demand it'], a: 1,
      why: 'All the volume between compressor and users rises and falls in pressure together, so all of it stores air.' },
    { q: 'A variable-speed compressor needs no receiver at all.', a: false,
      why: 'It needs less, but some storage bridges the seconds it takes to speed up and keeps it from stopping and starting at very low demand.' }
  ],
  problems: [
    { q: 'A 10 m³/min load/unload compressor may load 20 times an hour and switches over a band of 0.8 bar. What storage does it need?', answer: 9.5, unit: 'm³', tol: 0.02,
      steps: ['$V = Q_c p_\\text{atm}/(4z\\Delta p)$.', '$= (10/60) \\times 1.013/(4 \\times (20/3600) \\times 0.8) = 0.1688/0.01778 = 9.50$ m³.'] }
  ],
  applications: [
    'Sizing the central receiver of a new compressor room.',
    'Adding local storage for a test rig, a press or a sandblasting booth.',
    'Emergency storage for a safe shutdown when a compressor trips.',
    'Checking whether an existing compressor cycles too often.'
  ],
  sim: 'comp-load-unload'
},

{
  id: 'heat-recovery', parent: 'compressor-control', title: 'Heat recovery', level: 2,
  short: 'Almost all the electricity a compressor uses turns into heat, and typically up to about 90 % of it can be recovered — as hot water from the oil circuit or coolers, or as warm air for heating buildings. It does not make the air cheaper; it makes the heat nearly free.',
  keywords: ['heat recovery', 'compressor heat', 'waste heat', 'oil cooler', 'plate heat exchanger', 'hot water', 'space heating', 'ducted cooling air', 'energy balance', 'Sankey diagram', 'payback'],
  prereq: ['compression-work', 'screw-compressors', 'physics:specific-heat'],
  related: ['multistage-intercooling', 'cost-of-compressed-air', 'desiccant-dryers', 'aftercoolers', 'physics:first-law-thermodynamics', 'physics:heat-transfer'],
  body: `
Put 100 kW of electricity into an air compressor and nearly 100 kW of heat comes out: the air leaves at about room temperature, carrying no more energy than it came in with (see [[compression-work]]). A compressor house is therefore a heating plant that nobody planned — and one that most sites throw away through fans on the roof.

### Where the heat is
In an oil-injected screw compressor the heat appears in a few places. Typical shares of the electrical input:

| Where | Share (typical) | Temperature available |
|---|---|---|
| Oil cooler | 70–75 % | oil at 80–95 °C, water to about 70 °C |
| Aftercooler | 12–15 % | air at 80–90 °C before cooling |
| Motor and drive losses, to the cooling air | 8–10 % | cooling air 15–30 K above the room |
| Radiated from the package | about 2 % | — |
| Leaving in the warm compressed air | 3–5 % | a few kelvin above the room |

Up to about 90 % of the input can be recovered in principle — typically 70–75 % as hot water from the oil circuit, somewhat more when the aftercooler is water-cooled too, and 90 % or more as warm air when all the package's cooling air is ducted into a building. Oil-free machines give hotter heat: their air leaves each stage at 150–200 °C, so water can be heated to about 90 °C.

### Ways to use it
- **Hot water** from a plate heat exchanger in the oil circuit: boiler feed water, washing and cleaning, process baths, showers, underfloor heating.
- **Warm air** ducted from the compressor enclosure into a workshop or store in winter, with a damper that sends it outdoors in summer.
- **Drying**: the heat of compression can regenerate desiccant dryers (see [[desiccant-dryers]]).

The water flow a recovery system can heat follows from $\\Phi = \\rho c \\dot V \\Delta T$. A 90 kW compressor with 70 kW recoverable heats about 20 L/min of water by 50 K.

### Does it pay?
Recovered heat replaces fuel a boiler would have burnt: $E = \\Phi t/\\eta_\\text{boiler}$. Recovering 70 kW for 4000 hours saves about 310,000 kWh of fuel — at ¤0.06 per kWh, some ¤19,000 a year, for a heat exchanger and pipework that often pay for themselves within one or two years (typical). The condition is a use for heat at the times the compressor runs; heat with nowhere to go is worth nothing.

> [!key] Heat recovery does not make compressed air cheaper to produce — it makes heat cheaper to get. Count it only where the heat is actually needed.

> [!warn] The compressor's cooling must never depend on the heat user. Keep the compressor's own cooler (or a bypass) able to take the full heat when the hot-water side is not drawing, or the compressor will overheat and trip. Hot water and oil lines can scald; lock out before working on them.
`,
  ideas: [
    'Practically all the electrical input of a compressor leaves as heat.',
    'In an oil-injected screw about 70–75 % is in the oil cooler, 12–15 % in the aftercooler, the rest in motor losses, radiation and the warm air.',
    'Typically up to about 90 % can be recovered, as hot water up to about 70 °C or as warm air for heating.',
    'Savings follow from the fuel a boiler no longer burns: Φt/η.',
    'The compressor must stay cooled even when no heat is being used.'
  ],
  pitfalls: [
    'The compressed air carries most of the energy away — Air leaving the aftercooler near room temperature carries only a few per cent as heat; nearly everything else is available as heat at the compressor.',
    'Recovered heat makes compressed air cheap — The air costs the same electricity; what becomes cheap is the heat, and only if something needs it at the time.',
    'Any compressor can heat water to 90 °C — Oil-injected machines are limited by their oil temperature to about 70 °C water; only oil-free machines with hot stage discharges reach about 90 °C.'
  ],
  formulas: [
    {
      name: 'Recoverable heat',
      expr: 'Phi = k*P', tex: '\\Phi = k\\,P',
      vars: {
        Phi: { name: 'recoverable heat', q: 'power', unit: 'kW', tex: '\\Phi' },
        k: { name: 'share of the input recovered', q: 'ratio', unit: '%', value: 70, min: 0, max: 100, tex: 'k' },
        P: { name: 'electrical input power', q: 'power', unit: 'kW', value: 100, tex: 'P' }
      },
      note: 'Typically 70–75 % from the oil circuit of an oil-injected screw, and up to about 90 % or more with ducted cooling air.',
      stories: {
        Phi: 'A compressor draws {P}; a heat exchanger recovers {k} of it. How much heat is recovered?',
        k: 'A compressor draws {P} and a recovery system delivers {Phi} of heat. What share is recovered?'
      }
    },
    {
      name: 'Water flow a recovery system can heat',
      expr: 'Vw = Phi/(rhoW*cW*dT)', tex: '\\dot V_w = \\dfrac{\\Phi}{\\rho_w\\, c_w\\,\\Delta T}',
      vars: {
        Vw: { name: 'water flow', q: 'flowrate', unit: 'L/min', tex: '\\dot V_w' },
        Phi: { name: 'recovered heat', q: 'power', unit: 'kW', value: 70, tex: '\\Phi' },
        rhoW: { const: 'rhoW' },
        cW: { const: 'cW' },
        dT: { name: 'temperature rise of the water', q: 'dtemp', unit: 'K', value: 50, tex: '\\Delta T' }
      },
      note: 'From an oil-injected screw the water can reach about 70 °C; from an oil-free machine about 90 °C.',
      practice: { unknowns: ['Vw', 'dT'] },
      stories: {
        Vw: 'A compressor\'s oil circuit gives {Phi} to water that warms by {dT}. What water flow can it heat?',
        dT: 'A recovery system delivers {Phi} to a water flow of {Vw}. By how much does the water warm up?'
      }
    },
    {
      name: 'Fuel saved per year',
      expr: 'E = Phi*t/eta', tex: 'E = \\dfrac{\\Phi\\, t}{\\eta_b}',
      vars: {
        E: { name: 'fuel energy no longer burnt', q: 'energy', unit: 'kWh', tex: 'E' },
        Phi: { name: 'recovered heat actually used', q: 'power', unit: 'kW', value: 70, tex: '\\Phi' },
        t: { name: 'hours a year the heat is used', q: 'time', unit: 'h', value: 4000, tex: 't' },
        eta: { name: 'efficiency of the boiler it replaces', q: 'ratio', unit: '%', value: 90, min: 10, max: 110, tex: '\\eta_b' }
      },
      note: 'Only the hours when the compressor runs and the heat is needed count.',
      stories: {
        E: 'A compressor supplies {Phi} of useful heat for {t} a year, replacing a boiler of efficiency {eta}. How much fuel energy does it save?',
        t: 'Heat recovery of {Phi} should save {E} of fuel (boiler efficiency {eta}). For how many hours must the heat be used?'
      }
    }
  ],
  examples: [
    {
      title: 'Hot water from a 90 kW compressor',
      q: 'A 90 kW oil-injected screw draws 100 kW; a plate heat exchanger in its oil circuit recovers 70 % of that for washing water heated from 15 to 65 °C, 4000 hours a year, replacing a gas boiler of 90 % efficiency with gas at ¤0.06 per kWh. What water flow, fuel saving and money?',
      steps: [
        'Recovered: $\\Phi = 0.70 \\times 100 = 70$ kW.',
        'Water: $\\dot V = 70\\,000/(1000 \\times 4186 \\times 50) = 3.34\\times10^{-4}$ m³/s = 20 L/min, about 1.2 m³ an hour.',
        'Fuel saved: $70 \\times 4000/0.9 = 311\\,000$ kWh a year.',
        'Money: $311\\,000 \\times 0.06 \\approx$ ¤18,700 a year.'
      ],
      a: 'About 20 L/min of hot water, 311,000 kWh of gas and some ¤18,700 a year.'
    },
    {
      title: 'Warm air for a workshop',
      q: 'The whole package cooling air of a 55 kW-input compressor, about 94 % of its input, is ducted into a workshop during the five winter months (about 1800 running hours). How much heating does it provide?',
      steps: [
        'Heat: $0.94 \\times 55 = 51.7$ kW — as much as a sizeable heater.',
        'Over the winter: $51.7 \\times 1800 = 93\\,000$ kWh of heat, delivered with no extra fuel.',
        'In summer a damper sends the warm air outdoors so the workshop is not overheated.'
      ],
      a: 'About 52 kW of heating, some 93,000 kWh over the winter.'
    }
  ],
  quiz: [
    { q: 'Of the electrical energy an air compressor uses, roughly how much ends up as heat?', choices: ['About 10 %', 'About 50 %', 'Practically all of it', 'None — it is stored in the air'], a: 2,
      why: 'Air leaving at room temperature has the same internal energy as the air drawn in, so the input leaves as heat; up to about 90 % of it can typically be recovered.' },
    { q: 'A recovery system delivers 40 kW to water heated by 40 K. What water flow does it heat, in L/min?', answer: 14.3, unit: 'L/min', tol: 0.02,
      why: '$\\dot V = 40\\,000/(1000 \\times 4186 \\times 40) = 2.39\\times10^{-4}$ m³/s = 14.3 L/min.' },
    { q: 'Heat recovery lowers the cost of producing compressed air.', a: false,
      why: 'The compressor uses the same electricity; heat recovery replaces fuel that would otherwise have been burnt for heating. Its value depends on needing the heat.' },
    { q: 'In an oil-injected screw compressor, where is most of the recoverable heat?', choices: ['In the compressed air at the outlet', 'In the oil cooler', 'In the motor', 'In the condensate'], a: 1,
      why: 'The injected oil absorbs the heat of compression: about 70–75 % of the input leaves through the oil cooler.' },
    { q: 'Why must a compressor keep its own cooling when heat recovery is fitted?', choices: ['Regulations require two coolers', 'When the heat user does not draw heat — a warm day, a stopped process — the compressor must still get rid of its heat or it overheats and trips', 'To heat the water faster', 'Because recovered heat is too cold'], a: 1,
      why: 'Heat demand and air demand are independent. A thermostatic bypass to the compressor\'s own cooler keeps it safe.' }
  ],
  applications: [
    'Boiler feed water and process water preheated by compressor oil heat.',
    'Warm air from compressor enclosures heating workshops and warehouses in winter.',
    'Showers, washing and cleaning water in food plants.',
    'Heat-of-compression regeneration of desiccant dryers.'
  ],
  history: 'Compressor heat was mostly vented until the oil crises of the 1970s made it worth capturing; plate heat exchangers built into compressor packages became common options from the 1980s, and energy-management standards now treat compressed-air heat recovery as one of the quickest energy savings in industry.',
  sim: 'comp-heat-sankey'
}

);
