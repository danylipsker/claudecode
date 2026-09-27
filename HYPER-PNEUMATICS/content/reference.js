/* HYPER-PNEUMATICS · content/reference.js — the reference concept for pneumatics authors:
 * its depth, tone, numbers, safety wording and layout are the model (see also sims/reference.js). */
Hyper.add(

{
  id: 'pneumatic-cylinder', parent: 'cylinders-topic', title: 'The pneumatic cylinder', level: 1,
  short: 'A piston in a tube driven by compressed air: its force is gauge pressure times area, its speed is set by how fast air can get in and out through the valve and tubes, and every stroke uses a measurable volume of free air that the compressor must make — and someone must pay for.',
  keywords: ['pneumatic cylinder', 'air cylinder', 'piston', 'bore', 'stroke', 'force', 'load ratio', 'air consumption', 'free air', 'double-acting', 'single-acting', 'speed', 'meter-out'],
  prereq: ['absolute-gauge-pressure', 'boyles-law', 'standard-air', 'physics:pressure'],
  related: ['cylinder-force', 'air-consumption', 'cylinder-speed-pneu', 'double-acting-cylinders', 'single-acting-cylinders', 'flow-control-pneu', 'pneumatic-cushioning', 'valve-sizing', 'cylinder-motion', 'hydraulics:hydraulic-cylinder'],
  body: `
Open a valve and a pneumatic cylinder snaps out in a fraction of a second; close it and the rod snaps back. Millions of them clamp, push, lift, eject and sort in factories, because they are cheap, fast, clean and robust, and they do not mind being stalled against a stop all day. Inside is the same arrangement as a [[hydraulics:hydraulic-cylinder|hydraulic cylinder]] — barrel, piston, rod, two ports — but the working fluid is air, and air changes everything: it is springy, light and free to exhaust into the room.

### Force: gauge pressure times area
The air pushes on the piston with the pressure above the atmosphere — the **gauge** pressure — because the atmosphere pushes back on the other side (see [[absolute-gauge-pressure]]):

$$F = p_g\\,\\frac{\\pi D^2}{4}$$

At the usual 6 bar a 32 mm bore pushes with $6\\times10^5 \\times 8.04\\times10^{-4} = 483$ N — about 49 kg-force — and a 100 mm bore with 4.7 kN. That is the **theoretical** force. Seal friction takes 5–15 % in small cylinders, the exhausting side is never quite at zero, and a cylinder that must move a load quickly needs spare force to accelerate it. So the load is kept to a fraction of the theoretical force, the **load ratio**: about 50–70 % for a load that must move briskly, up to 85 % for slow clamping.

| Bore (mm) | Area (cm²) | Push at 6 bar | Load at 70 % |
|---|---|---|---|
| 16 | 2.01 | 121 N | 84 N |
| 32 | 8.04 | 483 N | 338 N |
| 50 | 19.6 | 1.18 kN | 825 N |
| 100 | 78.5 | 4.71 kN | 3.3 kN |

Retracting, the air acts on the annulus around the rod, so the pull is smaller by the rod's area — about 15 % for a typical ISO cylinder.

### Speed: set by the air flow
Unlike a hydraulic cylinder, where speed is simply pump flow over area, a pneumatic cylinder's speed is set by a race between two chambers. When the valve switches, the driving chamber fills through the valve while the other empties through its exhaust; the piston moves once the pressure difference beats friction and load, then speeds up until the flow the exhaust can pass limits it. Standard practice throttles the **outgoing** air (meter-out, see [[flow-control-pneu]]), which holds the piston between two air cushions and gives a steadier speed. Typical speeds are 0.1–1.5 m/s; a small valve or long thin tubing makes the cylinder slow however high the pressure (see [[valve-sizing]] and [[cylinder-motion]]).

### Air consumption: counting in free air
Every stroke fills a chamber with air at the supply pressure and then throws it away into the room. The amount is counted as **free air** — the volume it would occupy at atmospheric pressure (see [[standard-air]]). By [[boyles-law|Boyle's law]], a chamber of volume $A\\,s$ filled to absolute pressure $p_g + p_\\text{atm}$ holds

$$V_\\text{free} = A\\,s\\,\\frac{p_g + p_\\text{atm}}{p_\\text{atm}}$$

— seven times its own volume at 6 bar. A 32 mm cylinder with a 100 mm stroke uses 0.56 L of free air extending and 0.48 L retracting: about 1.04 L a cycle. Add the tubes between valve and cylinder, which are filled and emptied too, and a few per cent more.

> [!key] A cylinder's force comes from pressure and area; its speed from how fast air can flow in and out; its running cost from the free air it throws away every stroke.

### What it costs
A compressor needs roughly 6–7 kW of electricity for every cubic metre per minute of free air it delivers at 7 bar — about 0.11 kWh per cubic metre. The 32 mm cylinder above cycling 30 times a minute uses 31 L/min; over 4000 hours a year that is 7450 m³ of free air and 820 kWh — about ¤123 at ¤0.15 per kWh. Small for one cylinder; large for a plant with thousands of them, and far larger for a single 3 mm leak, which wastes about 380 L/min at 6 bar (see [[air-leaks]] and [[cost-of-compressed-air]]).

| Bore × stroke | Free air per cycle at 6 bar | At 30 cycles/min |
|---|---|---|
| 16 × 50 mm | 0.13 L | 3.9 L/min |
| 32 × 100 mm | 1.04 L | 31 L/min |
| 63 × 200 mm | 8.2 L | 246 L/min |
| 100 × 300 mm | 31.6 L | 950 L/min |

> [!warn] A pneumatic cylinder can move without warning when a system is pressurised or a valve is operated by hand. Before working on a machine, shut off and exhaust the air, lock out the supply, and support any load that could fall. Never point compressed air at a person or use it to blow dust off skin or clothes.
`,
  ideas: [
    'Force = gauge pressure × piston area; the pull is smaller by the rod\'s area.',
    'Keep the load to a load ratio of about 50–70 % of the theoretical force when it must move quickly.',
    'Speed is set by how fast air flows in and out — valve size, tubing and the meter-out throttles — not by pressure alone.',
    'Every stroke throws away the chamber volume times the absolute pressure ratio: counted as free air.',
    'Free air costs electricity: roughly 0.11 kWh per cubic metre at 7 bar.'
  ],
  pitfalls: [
    'The force comes from the absolute pressure — The atmosphere pushes on the other side too; the net push is the gauge pressure times the area.',
    'Air consumption is just the cylinder volume — Each stroke fills the chamber to seven or eight times atmospheric pressure, so it uses seven or eight times its volume in free air.',
    'A higher pressure makes a cylinder faster — Beyond what the load needs, speed is limited by the flow through the valve, tubes and throttles; higher pressure mostly adds cost and harder end-stop impacts.'
  ],
  formulas: [
    {
      name: 'Cylinder force',
      expr: 'F = p*pi*D^2/4', tex: 'F = p_g\\,\\dfrac{\\pi D^2}{4}',
      vars: {
        F: { name: 'theoretical force', q: 'force', unit: 'N' },
        p: { name: 'supply pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        D: { name: 'bore', q: 'length', unit: 'mm', value: 32 }
      },
      note: 'Theoretical force, extending. Friction takes 5–15 % in small cylinders; retracting, use the annulus area π(D² − d²)/4.',
      practice: { unknowns: ['F', 'D'] },
      stories: { F: 'A cylinder with a bore of {D} is supplied at {p}. What force does it push with?', D: 'A cylinder must push {F} at {p}. What bore is needed (theoretical)?' }
    },
    {
      name: 'Bore for a load',
      expr: 'D = sqrt(4*F/(pi*p*LR))', tex: 'D = \\sqrt{\\dfrac{4F}{\\pi\\, p_g\\, \\lambda}}',
      vars: {
        D: { name: 'bore', q: 'length', unit: 'mm' },
        F: { name: 'load force', q: 'force', unit: 'N', value: 400 },
        p: { name: 'supply pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        LR: { name: 'load ratio', q: 'ratio', unit: '%', value: 70, min: 10, max: 100, tex: '\\lambda' }
      },
      note: 'Choose the next standard bore above the result (ISO: 8, 10, 12, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125 mm …).',
      stories: { D: 'A clamp must hold {F} at {p} with a load ratio of {LR}. What bore does it need?' }
    },
    {
      name: 'Free air per stroke',
      expr: 'V = A*s*(p + patm)/patm', tex: 'V_\\text{free} = A\\,s\\,\\dfrac{p_g + p_\\text{atm}}{p_\\text{atm}}',
      vars: {
        V: { name: 'free air per stroke', q: 'volume', unit: 'L', tex: 'V_\\text{free}' },
        A: { name: 'area filled (piston or annulus)', q: 'area', unit: 'cm²', value: 8.04 },
        s: { name: 'stroke', q: 'length', unit: 'mm', value: 100 },
        p: { name: 'supply pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' }
      },
      note: 'Boyle\'s law at constant temperature. Add the volume of the tube between valve and cylinder, which is filled and emptied every stroke as well.',
      practice: { unknowns: ['V', 's'] },
      stories: { V: 'A cylinder chamber of {A} is filled over a stroke of {s} to {p}. How much free air does one stroke use?' }
    },
    {
      name: 'Air flow of a cycling cylinder',
      expr: 'Q = (A1 + A2)*s*(p + patm)/patm*n', tex: 'Q = (A_1 + A_2)\\,s\\,\\dfrac{p_g + p_\\text{atm}}{p_\\text{atm}}\\,n',
      vars: {
        Q: { name: 'free-air flow', q: 'airflow', unit: 'L/min ANR' },
        A1: { name: 'piston area', q: 'area', unit: 'cm²', value: 8.04, tex: 'A_1' },
        A2: { name: 'annulus area', q: 'area', unit: 'cm²', value: 6.91, tex: 'A_2' },
        s: { name: 'stroke', q: 'length', unit: 'mm', value: 100 },
        p: { name: 'supply pressure (gauge)', q: 'pressure', unit: 'bar', value: 6, tex: 'p_g' },
        patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'bar', value: 1.013, fixed: true, tex: 'p_\\text{atm}' },
        n: { name: 'cycles per minute', q: 'frequency', unit: '1/min', value: 30 }
      },
      note: 'A double-acting cylinder: one extend and one retract stroke per cycle. The average flow; the compressor and pipes must also cope with the peak flow while a stroke fills.',
      practice: { unknowns: ['Q', 'n'] },
      stories: { Q: 'A double-acting cylinder ({A1} piston, {A2} annulus, stroke {s}) cycles {n} at {p}. What average free-air flow does it need?' }
    }
  ],
  examples: [
    {
      title: 'Sizing a clamp',
      q: 'A clamp must press a part with 400 N. The supply is 6 bar gauge, and the designer uses a load ratio of 70 %. Which standard bore is needed, and what force will it give?',
      steps: [
        '$D = \\sqrt{4F/(\\pi p \\lambda)} = \\sqrt{4 \\times 400/(\\pi \\times 6\\times10^5 \\times 0.7)} = \\sqrt{1.213\\times10^{-3}} = 0.0348$ m = 34.8 mm.',
        'The next standard bore is 40 mm.',
        'Theoretical force: $6\\times10^5 \\times \\pi \\times 0.04^2/4 = 754$ N; the 400 N load is 53 % of it, a comfortable margin.'
      ],
      a: 'A 40 mm bore, giving 754 N theoretical — the load is 53 % of it.'
    },
    {
      title: 'What one cylinder costs to run',
      q: 'A 32 mm cylinder (12 mm rod) with a 100 mm stroke cycles 30 times a minute at 6 bar, 4000 hours a year. The compressor needs 0.11 kWh per m³ of free air, and electricity costs 0.15 per kWh. What does the air cost per year?',
      steps: [
        'Areas: $A_1 = 8.04$ cm², $A_2 = 8.04 - 1.13 = 6.91$ cm².',
        'Free air per cycle: $(8.04 + 6.91)\\times10^{-4} \\times 0.1 \\times 7.013/1.013 = 1.035\\times10^{-3}$ m³ = 1.04 L.',
        'Per year: $1.035\\times10^{-3} \\times 30 \\times 60 \\times 4000 = 7450$ m³.',
        'Energy: $7450 \\times 0.11 = 820$ kWh; cost: $820 \\times 0.15 = 123$ per year.'
      ],
      a: 'About 7450 m³ of free air, 820 kWh and ¤123 a year.'
    },
    {
      title: 'Pressure is not speed',
      q: 'A 50 mm cylinder moves a 5 kg slide at 0.3 m/s at 6 bar. Someone raises the supply to 8 bar "to make it faster". What happens?',
      steps: [
        'The force needed to move 5 kg with friction is perhaps 100 N — a fraction of the 1.18 kN available at 6 bar; the speed is set by the exhaust throttle and the valve\'s flow.',
        'At 8 bar the cylinder accelerates a little harder and runs slightly faster, but mostly it arrives at the end stop harder, needing more cushioning.',
        'The air per stroke rises by $(9.013/7.013) - 1 = 29$ %, and the compressor\'s energy by about 14 % (roughly 7 % per bar).'
      ],
      a: 'A little faster at best, with harder end impacts and about 29 % more air per stroke. Open the meter-out throttle or use a bigger valve instead.'
    }
  ],
  quiz: [
    { q: 'A pneumatic cylinder at 6 bar gauge pushes with a force equal to…', choices: ['6 bar × area', '7 bar × area', '6 bar × area × 7', 'atmospheric pressure × area'], a: 0,
      why: 'The atmosphere presses on the other side of the piston (and the rod end), so the net push is the gauge pressure times the area.' },
    { q: 'How much free air does one 100 mm stroke of a 50 mm bore cylinder use at 6 bar gauge?', answer: 1.36, unit: 'L', tol: 0.03,
      why: 'A = 19.63 cm²; swept volume 0.196 L; × 7.013/1.013 = 1.36 L of free air.' },
    { q: 'The best way to make a slow cylinder faster is usually…', choices: ['raise the supply pressure', 'fit a larger valve, shorter or wider tubing, or open the meter-out throttle', 'use a bigger bore', 'lubricate the air more'], a: 1,
      why: 'Speed is limited by how fast air gets in and out. A bigger bore needs even more air per stroke, and more pressure mostly adds cost.' },
    { q: 'A cylinder with a load ratio of 90 % will move its load as briskly as one at 60 %.', a: false,
      why: 'With little spare force there is little to accelerate the load or overcome friction variations; the motion becomes slow and jerky. 50–70 % is the usual choice for moving loads.' },
    { q: 'Doubling the stroke of a cylinder (same bore, pressure and cycle rate) makes its air consumption…', choices: ['stay the same', 'double', 'quadruple', 'rise by √2'], a: 1,
      why: 'Free air per stroke is proportional to A·s: twice the stroke, twice the air.' }
  ],
  problems: [
    { q: 'What theoretical force does a 63 mm bore cylinder push with at 5 bar gauge?', answer: 1559, unit: 'N', tol: 0.02,
      steps: ['$A = \\pi \\times 0.063^2/4 = 3.117\\times10^{-3}$ m².', '$F = 5\\times10^5 \\times 3.117\\times10^{-3} = 1559$ N.'] },
    { q: 'A 16 mm cylinder (6 mm rod) with a 50 mm stroke cycles 60 times a minute at 6 bar gauge. What average free-air flow does it need?', answer: 7.77, unit: 'L/min', tol: 0.03,
      steps: ['$A_1 = 2.01$ cm², $A_2 = 2.01 - 0.28 = 1.73$ cm².', 'Per cycle: $(2.01 + 1.73)\\times10^{-4} \\times 0.05 \\times 7.013/1.013 = 1.295\\times10^{-4}$ m³ = 0.13 L.', 'Sixty cycles a minute: $0.1295 \\times 60 = 7.77$ L/min of free air.'] }
  ],
  applications: ['Clamping, pressing, ejecting and sorting on assembly and packaging lines.', 'Opening and closing doors on buses and trains.', 'Pick-and-place units, grippers and robot tooling.', 'Process valves: pneumatic actuators turning butterfly and ball valves in chemical and water plants.'],
  history: 'Compressed air drove rock drills in the Mont Cenis tunnel in the 1860s and powered whole city networks in Paris from the 1880s. The modern standardised cylinder came with factory automation after the Second World War; ISO 6431 (1981), now ISO 15552, fixed the mounting dimensions so cylinders from different makers are interchangeable.',
  sim: ['ref-pneu-cylinder', 'ref-air-consumption']
}

);
