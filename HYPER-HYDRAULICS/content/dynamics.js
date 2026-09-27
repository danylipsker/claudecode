/* HYPER-HYDRAULICS · content/dynamics.js — transients and control.
 *   water-hammer-topic (branch transients): water-hammer, wave-speed, joukowsky-surge, valve-closure,
 *                                           surge-protection, column-separation
 *   electrohydraulics (branch control-applications): electrohydraulic-control, servo-loop,
 *                                           hydraulic-stiffness, valve-sizing-dynamics
 * Simulations in sims/dynamics.js (ids dyn-*). Water at 20 °C: ρ = 998 kg/m³, K = 2.2 GPa,
 * vapour pressure 2.34 kPa absolute; mineral oil: ρ = 870 kg/m³, K ≈ 1.6 GPa. */
Hyper.add(

/* ================================================================ WATER HAMMER */
{
  id: 'water-hammer', parent: 'water-hammer-topic', title: 'Water hammer', level: 2,
  short: 'The pressure surge when the flow in a pipe is stopped or started suddenly — a valve slamming, a pump tripping. A pressure wave runs along the pipe at around a kilometre per second, and in a steel main every metre per second of flow stopped adds about 12 bar.',
  keywords: ['water hammer', 'hydraulic transient', 'surge', 'pressure surge', 'fluid hammer', 'banging pipes', 'pressure wave', 'pipe period', '2L/a', 'reflection', 'valve slam', 'pump trip', 'Joukowsky', 'transient flow', 'hydraulic shock'],
  prereq: ['bulk-modulus', 'flow-rate', 'physics:momentum'],
  related: ['wave-speed', 'joukowsky-surge', 'valve-closure', 'surge-protection', 'column-separation', 'physics:wave-reflection', 'math:wave-equation', 'water-supply', 'hydropower', 'check-valves', 'line-sizing'],
  body: `
Open a tap fully, then snap it shut: the pipes knock. In a house that is a nuisance; in a water main, a pumping station or the penstock of a hydroelectric plant it can split a pipe, blow out a joint or lift a pipeline off its supports. The cause is simple. A pipe full of moving water carries a lot of [[physics:momentum|momentum]] — a kilometre of 300 mm main holds about 70 tonnes of water — and a valve cannot stop all of it at once. It stops only the layer touching it. That layer is squeezed by the water still arriving behind it, the pressure rises, the pipe wall stretches a little, and the next layer is stopped in turn. The stopping travels up the pipe as a **pressure wave** at the speed of sound in the pipe, $a$: about 1000–1400 m/s in steel and iron, 250–500 m/s in plastics (see [[wave-speed]]).

### How big the surge is
Behind the wave front the water stands still and the pressure is higher by the **Joukowsky surge** (see [[joukowsky-surge]]):

$$\\Delta p = \\rho\\,a\\,\\Delta v \\qquad\\text{or, as head,}\\qquad \\Delta H = \\frac{a\\,\\Delta v}{g}$$

In a steel main, stopping 1 m/s adds about 12.5 bar — 127 m of head — whatever the pipe's length and whatever the pressure was before. A main working at 5 bar with 1.5 m/s of flow briefly sees about 24 bar if a valve slams.

### One cycle of the wave
Take a pipe of length $L$ from a reservoir to a valve, close the valve instantly, and ignore friction:

| Time after closure | What happens |
|---|---|
| 0 to $L/a$ | A high-pressure wave runs from the valve to the reservoir; behind it the water is stopped, compressed, and the pipe swollen. |
| $L/a$ to $2L/a$ | The reservoir cannot hold the extra pressure: water starts to flow back into it at $v_0$, and a wave of normal pressure runs back to the valve. |
| $2L/a$ to $3L/a$ | The water moving away from the closed valve is stopped again, now with the pressure $\\rho a v_0$ **below** normal; a low-pressure wave runs to the reservoir. |
| $3L/a$ to $4L/a$ | The reservoir restores normal pressure and forward flow. When this wave reaches the valve the state is as at the start, and the cycle repeats. |

So the valve sees a square wave: $+\\rho a v_0$ for $2L/a$, then $-\\rho a v_0$ for $2L/a$. The time $2L/a$, the **pipe period**, is the clock of the whole subject: a valve that shuts faster than that produces the full surge; one that shuts much more slowly produces much less ([[valve-closure]]). Friction rounds and shrinks the wave, and in a real pipe it dies out after some tens of cycles. The equations behind the picture are a pair of [[math:wave-equation|wave equations]] for pressure and velocity, solved in practice by the method of characteristics, as the simulation below does.

### Where transients come from
- **Valves** closing or opening quickly: hydrants, quick-acting valves, solenoid valves in buildings.
- **Pump trips**: when the power fails the pump runs down in seconds, and the first wave on its delivery side is a pressure **drop** — which can reach vapour pressure and part the water column ([[column-separation]]).
- **Check valves** slamming on reverse flow; pumps starting into an empty or closed line; trapped air being expelled.
- **Oil hydraulics**: directional valves switch in 10–50 ms, and oil in a pressure line at 5 m/s stopped that fast gives spikes of tens of bar — one reason pressure lines are sized for 3–6 m/s ([[line-sizing]]) and gauges carry dampers.

Surges are reduced by slowing the change, lowering the velocity, choosing a pipe with a lower wave speed, or giving the water somewhere to go — surge tanks, air vessels, accumulators and relief valves ([[surge-protection]]). The [water-hammer calculator](#/tools/hydro/hammer) gives the wave speed, pipe period and surge for your own pipe.

> [!warn] Water hammer can burst pipes, blow out joints and fittings and throw pipes off their supports. Operate large valves slowly, never slam hydrants shut, and treat surge-protection equipment as safety equipment. Before any work on a pressurised main or hydraulic system, isolate it, release the pressure and lock out the pumps and valves.
`,
  ideas: [
    'A moving column of liquid cannot stop at once: the stopping travels along the pipe as a pressure wave at the wave speed a.',
    'Behind the front the pressure rises by ρ·a·Δv — about 12 bar per m/s in steel pipe — independent of the pipe length.',
    'The pipe period 2L/a is the time for the wave to reach the reservoir and return with relief; it is the clock of every transient.',
    'After an instantaneous closure the valve sees a square wave, +ρav₀ then −ρav₀, each for 2L/a, slowly damped by friction.',
    'A pump trip starts with a pressure drop, not a rise; the low-pressure half of the cycle can reach vapour pressure.'
  ],
  pitfalls: [
    'A longer pipe gives a bigger surge — For a closure faster than 2L/a the rise ρaΔv does not depend on the length. Length sets how long the high pressure lasts and how slowly a valve must close to count as slow.',
    'Water is incompressible, so it just stops — If it were, stopping it would take an infinite force. Its small compressibility and the stretch of the pipe are exactly what let the stopping travel as a wave.',
    'The danger is only the pressure rise — The low-pressure half of the cycle can pull the pressure down to vapour pressure, separate the column and suck in dirty water through leaks; the rejoining can hit harder than the original surge.'
  ],
  formulas: [
    {
      name: 'Joukowsky pressure rise',
      expr: 'dp = rho*a*dv', tex: '\\Delta p = \\rho\\,a\\,\\Delta v',
      vars: {
        dp: { name: 'pressure rise', q: 'pressure', unit: 'bar', tex: '\\Delta p' },
        rho: { name: 'density of the liquid', q: 'density', unit: 'kg/m³', value: 998, tex: '\\rho' },
        a: { name: 'pressure-wave speed in the pipe', q: 'speed', unit: 'm/s', value: 1250 },
        dv: { name: 'velocity stopped', q: 'speed', unit: 'm/s', value: 1.5, tex: '\\Delta v' }
      },
      note: 'For a change completed within the pipe period 2L/a. The rise adds to the pressure that was there before the change.',
      practice: { unknowns: ['dp', 'dv', 'a'] },
      stories: {
        dp: 'Water (density {rho}) flowing at {dv} is stopped suddenly in a pipe with a wave speed of {a}. How big is the pressure surge?',
        dv: 'A pipe with a wave speed of {a} must never see a surge above {dp}. What is the largest velocity that may be stopped suddenly (density {rho})?'
      }
    },
    {
      name: 'Pipe period',
      expr: 'Tr = 2*L/a', tex: 'T_r = \\dfrac{2L}{a}',
      vars: {
        Tr: { name: 'pipe period (round trip of the wave)', q: 'time', unit: 's', tex: 'T_r' },
        L: { name: 'pipe length from the valve to the reservoir', q: 'length', unit: 'm', value: 1200 },
        a: { name: 'pressure-wave speed', q: 'speed', unit: 'm/s', value: 1250 }
      },
      note: 'A closure faster than T_r gives the full Joukowsky surge. The whole cycle at the valve lasts 4L/a.',
      stories: { Tr: 'A valve sits at the end of a {L} pipe in which pressure waves travel at {a}. How long does the wave take to reach the reservoir and come back?' }
    },
    {
      name: 'Joukowsky head rise',
      expr: 'dH = a*dv/g', tex: '\\Delta H = \\dfrac{a\\,\\Delta v}{g}',
      vars: {
        dH: { name: 'head rise', q: 'length', unit: 'm', tex: '\\Delta H' },
        a: { name: 'pressure-wave speed', q: 'speed', unit: 'm/s', value: 1250 },
        dv: { name: 'velocity stopped', q: 'speed', unit: 'm/s', value: 1.5, tex: '\\Delta v' },
        g: { const: 'g' }
      },
      note: 'With a ≈ 1000 m/s, about 100 m of head for every metre per second stopped: the engineer\'s rule of thumb.',
      stories: { dH: 'Flow at {dv} is stopped instantly in a main with a wave speed of {a}. By how many metres of head does the pressure jump?' }
    }
  ],
  examples: [
    {
      title: 'A valve slammed on a main',
      q: 'A 1.2 km steel main (wave speed 1250 m/s) carries water at 1.5 m/s; the pressure at the valve at its end is 5 bar (gauge). The valve is shut in 0.8 s. What happens?',
      steps: [
        'Pipe period: $2L/a = 2400/1250 = 1.92$ s. The valve shuts in 0.8 s, well inside it, so the closure counts as instantaneous.',
        'Surge: $\\Delta p = \\rho a \\Delta v = 998 \\times 1250 \\times 1.5 = 1.87\\times10^{6}$ Pa $= 18.7$ bar.',
        'Peak at the valve: $5 + 18.7 = 23.7$ bar gauge, lasting 1.92 s — far above the 16 bar nominal rating of a PN 16 pipe.',
        'One pipe period later the pressure swings to $5 - 18.7$ bar, which is impossible: it stops at vapour pressure (about −1 bar gauge) and the column separates at the valve.'
      ],
      a: 'A surge of about 19 bar, to 24 bar gauge for 1.9 s, followed by column separation — a closure this fast is dangerous.'
    },
    {
      title: 'The same main in polyethylene',
      q: 'The main of the previous example is built in PE instead, with a wave speed of about 300 m/s. Is the same closure still dangerous?',
      steps: [
        'Surge: $\\Delta p = 998 \\times 300 \\times 1.5 = 4.49\\times10^{5}$ Pa $= 4.5$ bar.',
        'Pipe period: $2 \\times 1200/300 = 8$ s, so a 0.8 s closure is still "instantaneous" and the full 4.5 bar appears.',
        'Peak: $5 + 4.5 = 9.5$ bar gauge, within a PN 10 rating; the low swing, $5 - 4.5 = 0.5$ bar gauge, stays above vapour pressure.'
      ],
      a: 'No: the softer pipe lowers the surge to about 4.5 bar, although a slow closure now has to take much longer than 8 s.'
    }
  ],
  quiz: [
    { q: 'A valve at the end of a pipe from a reservoir is closed instantly. Ignoring friction, how long does the pressure at the valve stay at the high Joukowsky level?', choices: ['$L/a$', '$2L/a$', '$4L/a$', 'until friction damps it'], a: 1,
      why: 'The high-pressure wave takes L/a to reach the reservoir and L/a for the relieving wave to come back: 2L/a in all. Then the pressure swings low for another 2L/a.' },
    { q: 'Doubling the length of a pipe doubles the pressure rise when a valve at its end is shut instantly.', a: false,
      why: 'Δp = ρaΔv contains no length. A longer pipe keeps the high pressure for longer (2L/a) and needs a slower closure to reduce it.' },
    { q: 'Water flowing at 2 m/s is stopped instantly in a pipe with a wave speed of 1000 m/s. What is the pressure rise?', answer: 19.96, unit: 'bar', tol: 0.03,
      why: 'Δp = 998 × 1000 × 2 = 2.0 × 10⁶ Pa ≈ 20 bar, about 200 m of head.' },
    { q: 'A pump feeding a long rising main loses power. What does the pressure just downstream of the pump do first?', choices: ['rises by about ρaΔv', 'falls by about ρaΔv', 'stays constant until the check valve closes', 'rises to the shut-off head of the pump'], a: 1,
      why: 'The pump stops pushing, the flow leaving it slows, and a low-pressure wave starts down the main. The high pressure comes later, when the flow reverses against the closed check valve.' },
    { q: 'Why does a polyethylene pipe suffer a smaller surge than a steel pipe for the same change of velocity?', choices: ['its wall stretches, so the wave is slower and ρaΔv smaller', 'it is smoother inside', 'water is lighter in plastic pipes', 'plastic pipes are always shorter'], a: 0,
      why: 'The soft wall makes the pipe-liquid system far more compliant: the wave speed falls from about 1250 to about 300 m/s, and the surge with it.' }
  ],
  problems: [
    { q: 'A 450 m ductile-iron main has a wave speed of 1150 m/s. What is its pipe period 2L/a?', answer: 0.783, unit: 's', tol: 0.02,
      steps: ['$T_r = 2L/a = 900/1150 = 0.783$ s.', 'Any valve closing faster than about 0.8 s gives this pipe the full Joukowsky surge.'] },
    { q: 'In a PVC pipe with a wave speed of 380 m/s, flow at 1.2 m/s is stopped instantly. What is the head rise, in metres of water?', answer: 46.5, unit: 'm', tol: 0.02,
      steps: ['$\\Delta H = a\\Delta v/g = 380 \\times 1.2/9.81 = 46.5$ m — about 4.5 bar.'] }
  ],
  applications: [
    'Choosing the pressure class of water mains and pumping mains, and designing their surge protection.',
    'Hydropower penstocks, whose turbine gates and needle valves are closed on carefully chosen closing laws.',
    'Building services: water-hammer arrestors next to quick-closing solenoid valves in washing machines and dishwashers.',
    'Oil hydraulics: pressure spikes from fast-switching valves, and the dampers, accumulators and ramps that tame them.'
  ],
  history: 'Long iron water mains made water hammer a serious problem in the nineteenth century. In 1897 Nikolai Joukowsky ran tests on the Moscow water supply, measured the wave speed and the pressure rise, and in 1898 published both the surge ρaΔv and the role of the pipe period. Lorenzo Allievi built the general theory of slow closures from 1902, and in the 1960s Victor Streeter and Benjamin Wylie put the method of characteristics on digital computers — still the way transients are analysed.',
  sim: 'dyn-moc'
},

{
  id: 'wave-speed', parent: 'water-hammer-topic', title: 'Pressure-wave speed in pipes', level: 2,
  short: 'How fast a pressure wave travels through liquid in a pipe: the speed of sound in the liquid, slowed by the stretching of the pipe wall (the Korteweg formula) and, dramatically, by a trace of free air.',
  keywords: ['wave speed', 'celerity', 'speed of sound in water', 'Korteweg', 'pipe elasticity', 'wall thickness', 'Young modulus', 'bulk modulus', 'free air', 'entrained air', 'PE pipe', 'PVC pipe', 'steel pipe', 'acoustic speed'],
  prereq: ['water-hammer', 'bulk-modulus', 'physics:speed-of-sound'],
  related: ['joukowsky-surge', 'valve-closure', 'air-in-oil', 'physics:stress-strain', 'hoses-fittings', 'pipe-sizing', 'aerodynamics:speed-of-sound'],
  body: `
The wave speed decides both how violent a surge is ($\\Delta p = \\rho a \\Delta v$) and how long it lasts ($2L/a$). It is a speed of sound — but the speed of sound in a *pipe full of liquid*, which is slower than in the open liquid because the pipe gives way.

### In the liquid alone
A pressure wave in a liquid travels at

$$a_0 = \\sqrt{\\frac{K}{\\rho}}$$

where $K$ is the [[bulk-modulus]], the same result as [[physics:speed-of-sound|sound in any medium]]. For water at 20 °C, $K \\approx 2.2$ GPa and $a_0 \\approx 1485$ m/s; for mineral hydraulic oil ($K \\approx$ 1.5–1.8 GPa, $\\rho \\approx 870$ kg/m³) it is about 1300–1450 m/s.

### In an elastic pipe: the Korteweg formula
When the pressure rises, the liquid is squeezed *and* the pipe swells, so the wave has to push more liquid into each metre of pipe before the pressure rises: it travels more slowly. Diederik Korteweg's result of 1878 combines the two springs:

$$a = \\sqrt{\\frac{K/\\rho}{1 + c_1\\,\\dfrac{K\\,D}{E\\,e}}}$$

with $D$ the internal diameter, $e$ the wall thickness, $E$ the Young's modulus of the wall ([[physics:stress-strain]]) and $c_1$ a factor for how the pipe is held along its length: 1 with expansion joints, about $1-\\nu^2 \\approx 0.91$ for a steel pipe anchored against axial movement. The group $KD/(Ee)$ compares the liquid's stiffness with the pipe's — small for thick steel, large for thin plastic.

| Water in a 300 mm pipe | $E$ (GPa) | wall $e$ (mm) | $KD/(Ee)$ | $a$ (m/s) |
|---|---|---|---|---|
| Rigid pipe (limit) | — | — | 0 | 1485 |
| Steel | 200 | 8 | 0.41 | 1250 |
| Ductile iron | 170 | 7 | 0.55 | 1190 |
| PVC ($D/e \\approx 21$) | 3 | 14.3 | 15.4 | 367 |
| PE100 ($D/e \\approx 11$) | 1.0 | 27.3 | 24.2 | 296 |

Metal pipes sit close to the rigid limit; plastic pipes cut the wave speed — and the surge — by a factor of four or five. Oil in a 16 × 2 mm steel tube carries waves at about 1310 m/s. Wire-braided hoses stretch much more than tube, which is one reason a short hose near a valve softens pressure spikes (and one reason hoses make a servo axis softer, see [[hydraulic-stiffness]]).

### A little air changes everything
Bubbles of free (undissolved) gas are far softer than liquid. With a volume fraction $\\alpha$ of gas at absolute pressure $p$, compressed slowly, the mixture's bulk modulus is

$$\\frac{1}{K_\\text{eff}} = \\frac{1}{K} + \\frac{\\alpha}{p}$$

At atmospheric pressure, 0.1 % of air by volume brings $K_\\text{eff}$ from 2.2 GPa down to about 0.1 GPa and the wave speed from 1485 to about 310 m/s; 1 % gives about 100 m/s. At higher pressure the bubbles shrink and matter less: the same 0.1 % at 10 bar absolute still allows 830 m/s. Entrained air softens surges, but its amount is uncertain and changes with pressure, so designers use the air-free wave speed for the peak pressures. In oil hydraulics air is a nuisance anyway ([[air-in-oil]]).

> [!tip] A lower wave speed lowers the Joukowsky surge but lengthens the pipe period $2L/a$, so a valve must close more slowly still to count as a slow closure. Check both.
`,
  ideas: [
    'In the open liquid a pressure wave travels at √(K/ρ): about 1485 m/s in water, 1300–1450 m/s in oil.',
    'The pipe wall stretches under pressure and slows the wave: a = √[(K/ρ)/(1 + c₁KD/(Ee))], Korteweg\'s formula.',
    'Steel and iron pipes give 1100–1300 m/s; PVC and PE only 250–500 m/s, and their surges are four or five times smaller.',
    'A fraction of a per cent of free air at low pressure can cut the wave speed to a few hundred metres per second.',
    'Designers take the air-free wave speed for peak pressures, since the air content cannot be relied on.'
  ],
  pitfalls: [
    'The wave travels at the speed of the flow — The flow moves at a metre or two per second; the pressure wave at hundreds or thousands. The two are unrelated.',
    'Water in any pipe carries sound at 1480 m/s — That is the rigid-pipe limit. The wall\'s stretch lowers it, a little in steel and by a factor of four or five in plastic.',
    'A bit of air makes no difference because it is only 0.1 % — At atmospheric pressure air is some twenty thousand times more compressible than water, so 0.1 % of it dominates the mixture\'s stiffness.'
  ],
  formulas: [
    {
      name: 'Speed of sound in the liquid',
      expr: 'a0 = sqrt(K/rho)', tex: 'a_0 = \\sqrt{\\dfrac{K}{\\rho}}',
      vars: {
        a0: { name: 'speed of sound in the open liquid', q: 'speed', unit: 'm/s', tex: 'a_0' },
        K: { name: 'bulk modulus of the liquid', q: 'stress', unit: 'GPa', value: 2.2 },
        rho: { name: 'density of the liquid', q: 'density', unit: 'kg/m³', value: 998, tex: '\\rho' }
      },
      note: 'The rigid-pipe limit. Water 2.2 GPa, 998 kg/m³; mineral oil about 1.6 GPa, 870 kg/m³; sea water 2.3 GPa, 1025 kg/m³.',
      stories: { a0: 'A liquid has a bulk modulus of {K} and a density of {rho}. How fast does sound travel in it?' }
    },
    {
      name: 'Wave speed in an elastic pipe (Korteweg)',
      expr: 'a = sqrt(K/rho/(1 + c1*K*D/(E*ew)))', tex: 'a = \\sqrt{\\dfrac{K/\\rho}{1 + c_1\\,\\dfrac{K\\,D}{E\\,e}}}',
      vars: {
        a: { name: 'pressure-wave speed in the pipe', q: 'speed', unit: 'm/s' },
        K: { name: 'bulk modulus of the liquid', q: 'stress', unit: 'GPa', value: 2.2 },
        rho: { name: 'density of the liquid', q: 'density', unit: 'kg/m³', value: 998, tex: '\\rho' },
        D: { name: 'internal diameter', q: 'length', unit: 'mm', value: 300 },
        ew: { name: 'wall thickness', q: 'length', unit: 'mm', value: 8, tex: 'e' },
        E: { name: 'Young\'s modulus of the pipe wall', q: 'stress', unit: 'GPa', value: 200 },
        c1: { name: 'restraint factor (1 with expansion joints, ≈ 0.91 anchored steel)', value: 1, min: 0.5, max: 1.2, tex: 'c_1' }
      },
      note: 'Thin-walled pipes (D/e above about 25). E: steel 200 GPa, ductile iron 170, cast iron 100, concrete 30, PVC 3, PE 0.8–1.2 GPa (short-term).',
      practice: { unknowns: ['a', 'ew'] },
      stories: {
        a: 'Water (bulk modulus {K}, density {rho}) fills a pipe of {D} bore with a {ew} wall of modulus {E}, restraint factor {c1}. What is the wave speed?',
        ew: 'A pipe of {D} bore, wall modulus {E}, is to carry water (bulk modulus {K}, density {rho}) with a wave speed of {a}, restraint factor {c1}. What wall thickness gives that?'
      }
    },
    {
      name: 'Bulk modulus with free air',
      expr: 'Keff = 1/(1/K + alpha/p)', tex: 'K_\\text{eff} = \\dfrac{1}{1/K + \\alpha/p}',
      vars: {
        Keff: { name: 'effective bulk modulus of the mixture', q: 'stress', unit: 'MPa', tex: 'K_\\text{eff}' },
        K: { name: 'bulk modulus of the liquid', q: 'stress', unit: 'GPa', value: 2.2 },
        alpha: { name: 'free air, volume fraction', q: 'ratio', unit: '%', value: 0.1, min: 0, max: 20, tex: '\\alpha' },
        p: { name: 'pressure (absolute)', q: 'pressure', unit: 'bar', value: 1 }
      },
      note: 'Isothermal bubbles (slow compression). Put K_eff in place of K in the wave-speed formulas, with the mixture density ρ(1 − α).',
      stories: { Keff: 'Water (bulk modulus {K}) carries {alpha} of free air at {p} absolute. What is the effective bulk modulus of the mixture?' }
    }
  ],
  examples: [
    {
      title: 'Steel or polyethylene?',
      q: 'A 2 km water main of 300 mm bore can be built in steel (8 mm wall) or in PE100 with $D/e \\approx 11$ ($E \\approx$ 1.0 GPa). Compare the wave speeds, the surge for stopping 1.5 m/s and the pipe periods.',
      steps: [
        'Steel: $KD/(Ee) = 2.2\\times10^9 \\times 0.3/(200\\times10^9 \\times 0.008) = 0.41$, so $a = 1485/\\sqrt{1.41} = 1250$ m/s.',
        'PE: $KD/(Ee) = 2.2 \\times 11/1.0 = 24.2$, so $a = 1485/\\sqrt{25.2} = 296$ m/s.',
        'Surges: $998 \\times 1250 \\times 1.5 = 18.7$ bar in steel; $998 \\times 296 \\times 1.5 = 4.4$ bar in PE.',
        'Pipe periods: $4000/1250 = 3.2$ s in steel; $4000/296 = 13.5$ s in PE.'
      ],
      a: 'Steel: 1250 m/s, 18.7 bar, 3.2 s. PE: about 300 m/s, 4.4 bar, 13.5 s — a quarter of the surge, but valves must close four times more slowly to count as slow.'
    },
    {
      title: 'Air in a pumping main',
      q: 'Water in the steel main above carries 0.05 % of free air at 2 bar absolute. What is the wave speed now?',
      steps: [
        '$1/K_\\text{eff} = 1/2.2\\times10^9 + 0.0005/2\\times10^5 = 4.5\\times10^{-10} + 2.5\\times10^{-9}$, so $K_\\text{eff} = 338$ MPa.',
        'In a rigid pipe: $\\sqrt{338\\times10^6/998} = 582$ m/s.',
        'The steel wall adds little: $K_\\text{eff}D/(Ee) = 338\\times10^6 \\times 0.3/(1.6\\times10^9) = 0.063$, so $a = 582/\\sqrt{1.063} = 565$ m/s.'
      ],
      a: 'About 565 m/s — less than half the air-free value, from half a litre of air in every cubic metre.'
    }
  ],
  quiz: [
    { q: 'Which 300 mm pipe carries the slowest pressure wave?', choices: ['thick-walled steel', 'ductile iron', 'PVC', 'polyethylene'], a: 3,
      why: 'PE has the lowest Young\'s modulus, so its wall stretches most: about 300 m/s against 1250 m/s in steel.' },
    { q: 'At atmospheric pressure, 0.1 % of free air by volume can cut the wave speed in water to about a fifth of its air-free value.', a: true,
      why: 'K_eff = 1/(1/2.2 GPa + 0.001/10⁵ Pa) ≈ 96 MPa, and √(96×10⁶/998) ≈ 310 m/s against 1485 m/s.' },
    { q: 'What is the speed of sound in an oil with a bulk modulus of 1.5 GPa and a density of 870 kg/m³?', answer: 1313, unit: 'm/s', tol: 0.02,
      why: 'a₀ = √(1.5×10⁹/870) = 1313 m/s, before any pipe or hose elasticity is added.' },
    { q: 'The wall thickness of a PVC pipe is doubled. Its wave speed…', choices: ['stays the same', 'rises by roughly √2, about 40 %', 'doubles', 'falls'], a: 1,
      why: 'For PVC, KD/(Ee) ≈ 15 is much larger than 1, so a ∝ √(e): doubling the wall raises a from about 367 to 504 m/s.' },
    { q: 'Why is the wave speed in a pipe lower than the speed of sound in the open liquid?', choices: ['the pipe wall stretches, adding a second spring', 'friction slows the wave', 'the liquid is already moving', 'gravity pulls on the wave'], a: 0,
      why: 'A rising pressure both compresses the liquid and swells the pipe; the extra compliance slows the wave, as a softer spring slows the oscillation of a mass.' }
  ],
  problems: [
    { q: 'A steel pipe of 500 mm bore has a 10 mm wall (E = 200 GPa) and carries water (K = 2.2 GPa, ρ = 998 kg/m³), with expansion joints. What is the wave speed?', answer: 1193, unit: 'm/s', tol: 0.02,
      steps: ['$KD/(Ee) = 2.2\\times10^9 \\times 0.5/(200\\times10^9 \\times 0.01) = 0.55$.', '$a = \\sqrt{(2.2\\times10^9/998)/1.55} = 1193$ m/s.'] },
    { q: 'Hydraulic oil (K = 1.6 GPa) contains 0.5 % of free air at 5 bar absolute. What is its effective bulk modulus, in MPa?', answer: 94.1, unit: 'MPa', tol: 0.02,
      steps: ['$1/K_\\text{eff} = 1/1.6\\times10^9 + 0.005/5\\times10^5 = 6.25\\times10^{-10} + 1.0\\times10^{-8}$.', '$K_\\text{eff} = 1/1.0625\\times10^{-8} = 94.1$ MPa — seventeen times softer than the oil alone.'] }
  ],
  applications: [
    'Choosing pipe material and pressure class for surge-prone pumping mains.',
    'Estimating the pipe period that sets valve closing times and pump run-down times.',
    'Leak location and pipe-condition surveys, which time acoustic signals along buried pipes.',
    'Oil hydraulics: tube, hose and air content set how fast pressure changes travel and how stiff an axis is.'
  ],
  history: 'The speed of sound in water was first measured in Lake Geneva in 1826 by Daniel Colladon and Charles Sturm, who struck a bell under water and timed the sound across the lake: about 1435 m/s in the cold lake. Diederik Korteweg worked out in 1878 how the elasticity of a tube slows a wave in the liquid inside it — a result used equally for water mains and for the pulse in arteries.',
  sim: 'dyn-wave-speed'
},

{
  id: 'joukowsky-surge', parent: 'water-hammer-topic', title: 'The Joukowsky surge', level: 2,
  short: 'Δp = ρ·a·Δv: the pressure change when the velocity in a pipe changes faster than a wave can make the round trip to the reservoir. About 100 m of head for every metre per second in a metal pipe.',
  keywords: ['Joukowsky', 'Joukowski', 'Zhukovsky', 'Frizell', 'surge pressure', 'rho a v', 'pressure rise', 'head rise', 'instantaneous closure', 'dead end', 'momentum', 'impulse'],
  prereq: ['water-hammer', 'wave-speed', 'physics:impulse'],
  related: ['valve-closure', 'column-separation', 'surge-protection', 'momentum-principle', 'check-valves', 'line-sizing', 'physics:wave-reflection'],
  body: `
Joukowsky's formula is the number every pipeline engineer carries in their head: the pressure change when the flow in a pipe changes faster than a pressure wave can run to the end of the pipe and back.

### Where it comes from
Follow the wave front for a moment. In a short time $\\delta t$ it advances a distance $a\\,\\delta t$, and the slice of liquid it passes — mass $\\rho A a\\,\\delta t$ — is slowed by $\\Delta v$. The extra pressure on the slice, acting on the area $A$ for the time $\\delta t$, is the [[physics:impulse|impulse]] that removes that momentum:

$$\\Delta p\\,A\\,\\delta t = (\\rho A a\\,\\delta t)\\,\\Delta v \\quad\\Rightarrow\\quad \\Delta p = \\rho\\,a\\,\\Delta v$$

The pipe's length and diameter and the pressure before the event all drop out; only the density, the wave speed and the change of velocity remain. As head, $\\Delta H = a\\,\\Delta v/g$: with $a$ near 1000 m/s, about **100 m of head for every metre per second** — the engineer's rule of thumb.

| Pipe and liquid | $a$ (m/s) | Surge per 1 m/s changed |
|---|---|---|
| Water, steel or ductile iron | 1100–1300 | 11–13 bar (110–130 m) |
| Water, reinforced concrete | 1000–1200 | 10–12 bar |
| Water, GRP | 400–700 | 4–7 bar |
| Water, PVC | 350–500 | 3.5–5 bar |
| Water, PE | 250–400 | 2.5–4 bar |
| Oil ($\\rho$ = 870 kg/m³), steel tube | ≈ 1300 | ≈ 11 bar |

### Using it correctly
- **Only the change counts.** A valve that cuts the velocity from 2 to 0.5 m/s gives $\\rho a \\times 1.5$ m/s. Opening a valve suddenly gives a *drop* of the same form.
- **It adds to what was there.** The peak at a valve is the pressure just before closure plus $\\rho a \\Delta v$; the trough $2L/a$ later is the same amount *below* it — often low enough to reach vapour pressure ([[column-separation]]).
- **It needs a fast change**, completed within the pipe period $2L/a$. Slower changes let relieving waves return from the reservoir in time to cancel part of it ([[valve-closure]]).
- **Dead ends double it.** A wave reaching a closed branch reflects with the same sign ([[physics:wave-reflection]]), so the end of the branch sees twice the incoming surge.
- **It is not a ceiling.** When a vapour cavity collapses, the rejoining columns send out a new wave that adds to those already travelling, and short spikes can exceed the Joukowsky value.

### In oil hydraulics
Oil is lighter and the lines are short, but the velocities are high. A pressure line carrying oil at 5 m/s, with $a$ = 1300 m/s, would see $870 \\times 1300 \\times 5 = 57$ bar if stopped instantly. Because the lines are only metres long, $2L/a$ is a few milliseconds and most valves switch more slowly than that, so the real spikes are a fraction of this. Fast poppet valves, check valves that slam and long lines to remote actuators can still produce them — and a pressure transducer with a fast response will show them. The [water-hammer calculator](#/tools/hydro/hammer) works for oil too: give it the oil's density and bulk modulus.

> [!warn] Surge pressures add to working pressures. Components are rated for their working pressure with a limited margin for transients; a surge that repeatedly exceeds the rating fatigues pipes, hoses and fittings until one fails. Pressure spikes in oil lines are one cause of hose bursts — never stand in line with a pressurised hose or feel for leaks by hand.
`,
  ideas: [
    'Δp = ρaΔv follows from the impulse needed to stop each slice of liquid that the wave front passes over.',
    'Only the change of velocity counts; length, diameter and initial pressure drop out.',
    'Rule of thumb: about 100 m of head, 10–13 bar, per metre per second in metal pipes; a quarter of that in plastic.',
    'The surge adds to the pressure before the event; the low swing that follows subtracts the same amount.',
    'Waves double at dead ends, and collapsing vapour cavities can exceed the Joukowsky value.'
  ],
  pitfalls: [
    'The surge is added to zero — It adds to the pressure at the moment of closure. The peak is p₀ + ρaΔv, and the trough p₀ − ρaΔv.',
    'Joukowsky\'s value applies to any closure — Only to changes completed within 2L/a. Slower closures give less, roughly in the ratio (2L/a)/t_c.',
    'Oil lines are short, so water hammer does not concern hydraulics — ρaΔv for oil at 5 m/s is almost 60 bar; short lines only make most valve switching "slow" relative to 2L/a. Fast valves and slamming checks still cause spikes.'
  ],
  formulas: [
    {
      name: 'Joukowsky pressure rise',
      expr: 'dp = rho*a*dv', tex: '\\Delta p = \\rho\\,a\\,\\Delta v',
      vars: {
        dp: { name: 'pressure rise', q: 'pressure', unit: 'bar', tex: '\\Delta p' },
        rho: { name: 'density of the liquid', q: 'density', unit: 'kg/m³', value: 998, tex: '\\rho' },
        a: { name: 'pressure-wave speed', q: 'speed', unit: 'm/s', value: 1150 },
        dv: { name: 'velocity stopped', q: 'speed', unit: 'm/s', value: 1.8, tex: '\\Delta v' }
      },
      practice: { unknowns: ['dp', 'dv'] },
      stories: {
        dp: 'A check valve slams shut on water ({rho}) flowing at {dv} in a pipe with a wave speed of {a}. What is the surge?',
        dv: 'A pipe with a wave speed of {a} may see a surge of at most {dp}. What velocity may be stopped instantly (density {rho})?'
      }
    },
    {
      name: 'Joukowsky head rise',
      expr: 'dH = a*dv/g', tex: '\\Delta H = \\dfrac{a\\,\\Delta v}{g}',
      vars: {
        dH: { name: 'head rise', q: 'length', unit: 'm', tex: '\\Delta H' },
        a: { name: 'pressure-wave speed', q: 'speed', unit: 'm/s', value: 1150 },
        dv: { name: 'velocity stopped', q: 'speed', unit: 'm/s', value: 1.8, tex: '\\Delta v' },
        g: { const: 'g' }
      },
      stories: { dH: 'Flow at {dv} is stopped instantly in a pipe with a wave speed of {a}. What is the rise in metres of head?' }
    },
    {
      name: 'Peak pressure after a fast closure',
      expr: 'pmax = p0 + rho*a*v0', tex: 'p_\\text{max} = p_0 + \\rho\\,a\\,v_0',
      vars: {
        pmax: { name: 'peak pressure at the valve (gauge)', q: 'pressure', unit: 'bar', tex: 'p_\\text{max}' },
        p0: { name: 'pressure at the valve before closure (gauge)', q: 'pressure', unit: 'bar', value: 5, tex: 'p_0' },
        rho: { name: 'density of the liquid', q: 'density', unit: 'kg/m³', value: 998, tex: '\\rho' },
        a: { name: 'pressure-wave speed', q: 'speed', unit: 'm/s', value: 1250 },
        v0: { name: 'velocity before closure', q: 'speed', unit: 'm/s', value: 1.5, tex: 'v_0' }
      },
      note: 'For a complete closure within 2L/a. The trough that follows is p₀ − ρav₀, but never below vapour pressure (about −1 bar gauge).',
      practice: { unknowns: ['pmax', 'v0'] },
      stories: {
        pmax: 'A main runs at {p0} gauge with water ({rho}) at {v0}; its wave speed is {a}. A valve slams shut. What is the peak pressure?',
        v0: 'A pipe rated for {pmax} works at {p0} gauge, with a wave speed of {a} (density {rho}). What velocity could a sudden closure stop without exceeding the rating?'
      }
    },
    {
      name: 'Partial change of velocity',
      expr: 'dp = rho*a*(v0 - v1)', tex: '\\Delta p = \\rho\\,a\\,(v_0 - v_1)',
      vars: {
        dp: { name: 'pressure change (rise positive)', q: 'pressure', unit: 'bar', signed: true, tex: '\\Delta p' },
        rho: { name: 'density of the liquid', q: 'density', unit: 'kg/m³', value: 998, tex: '\\rho' },
        a: { name: 'pressure-wave speed', q: 'speed', unit: 'm/s', value: 380 },
        v0: { name: 'velocity before the change', q: 'speed', unit: 'm/s', value: 2.0, tex: 'v_0' },
        v1: { name: 'velocity after the change', q: 'speed', unit: 'm/s', value: 0.8, signed: true, tex: 'v_1' }
      },
      note: 'A valve that opens suddenly (v₁ > v₀) gives a negative Δp: a drop of the same form.',
      stories: { dp: 'A valve on a PVC main (wave speed {a}) cuts the flow quickly from {v0} to {v1}. What is the pressure change (water, {rho})?' }
    }
  ],
  examples: [
    {
      title: 'A check valve slams',
      q: 'On a ductile-iron pumping main (wave speed 1150 m/s) the flow reverses after a pump trip and a swing check valve slams shut when the water is already running back at 0.6 m/s. What surge does the slam add?',
      steps: [
        'The valve stops a reverse velocity of 0.6 m/s: $\\Delta v = 0.6$ m/s.',
        '$\\Delta p = 998 \\times 1150 \\times 0.6 = 6.9\\times10^{5}$ Pa $= 6.9$ bar, or $\\Delta H = 1150 \\times 0.6/9.81 = 70$ m.',
        'A non-slam (nozzle) check valve that closes before the flow reverses avoids almost all of this.'
      ],
      a: 'About 6.9 bar (70 m) — the reason pumping stations use fast-closing, non-slam check valves.'
    },
    {
      title: 'A valve throttles quickly',
      q: 'A control valve on a 400 m PVC main (a = 380 m/s) cuts the velocity from 2.0 to 0.8 m/s in 0.3 s. What is the surge?',
      steps: [
        'Pipe period: $2 \\times 400/380 = 2.1$ s; the change takes 0.3 s, so it is fast.',
        '$\\Delta p = 998 \\times 380 \\times (2.0 - 0.8) = 4.55\\times10^{5}$ Pa $= 4.6$ bar.'
      ],
      a: 'About 4.6 bar, even though the valve does not shut completely.'
    },
    {
      title: 'Oil in a pressure line',
      q: 'Oil ($\\rho$ = 870 kg/m³) flows at 5 m/s in a steel pressure line with $a$ = 1300 m/s. What is the largest spike a sudden stop could cause?',
      steps: [
        '$\\Delta p = 870 \\times 1300 \\times 5 = 5.66\\times10^{6}$ Pa $= 57$ bar.',
        'For a 2 m line, $2L/a = 4/1300 = 3.1$ ms. A spool that shuts in 15 ms is "slow" by comparison, and the spike is far smaller (see [[valve-closure]]).'
      ],
      a: 'At most about 57 bar; in practice much less unless the line is long or the valve very fast.'
    }
  ],
  quiz: [
    { q: 'Water at 0.8 m/s is stopped instantly in a steel pipe with a = 1200 m/s. What is the pressure rise?', answer: 9.58, unit: 'bar', tol: 0.02,
      why: 'Δp = 998 × 1200 × 0.8 = 9.58 × 10⁵ Pa = 9.6 bar.' },
    { q: 'Which change does NOT alter the Joukowsky rise for an instantaneous closure?', choices: ['the velocity stopped', 'the wave speed', 'the length of the pipe', 'the density of the liquid'], a: 2,
      why: 'Length is not in ρaΔv. It sets the duration 2L/a and the closing time needed to reduce the surge.' },
    { q: 'Opening a valve suddenly produces a pressure drop given by the same formula, ρaΔv.', a: true,
      why: 'The fluid next to the valve is suddenly accelerated; the wave that starts the rest of the column moving carries a pressure drop ρaΔv.' },
    { q: 'A valve quickly reduces the velocity from 1.6 to 1.0 m/s in a pipe with a = 1000 m/s. The surge is about…', choices: ['16 bar', '10 bar', '6 bar', '26 bar'], a: 2,
      why: 'Only the change counts: Δp = 998 × 1000 × 0.6 ≈ 6.0 bar.' },
    { q: 'A surge wave arrives at the closed end of a dead-end branch. The pressure there rises by…', choices: ['half the surge', 'the surge', 'twice the surge', 'nothing, because the branch has no flow'], a: 2,
      why: 'A pressure wave reflects from a closed end with the same sign; incident and reflected waves add, so the dead end sees twice the incoming surge.' }
  ],
  problems: [
    { q: 'Oil (ρ = 870 kg/m³) in a steel tube with a wave speed of 1300 m/s flows at 4 m/s. What is the Joukowsky surge for a sudden stop, in bar?', answer: 45.2, unit: 'bar', tol: 0.02,
      steps: ['$\\Delta p = 870 \\times 1300 \\times 4 = 4.52\\times10^{6}$ Pa $= 45.2$ bar.'] },
    { q: 'A main rated for 16 bar works at 6 bar gauge; its wave speed is 1100 m/s. What is the largest water velocity a sudden closure could stop without exceeding the rating?', answer: 0.911, unit: 'm/s', tol: 0.02,
      steps: ['Allowed surge: $16 - 6 = 10$ bar $= 10^6$ Pa.', '$\\Delta v = \\Delta p/(\\rho a) = 10^6/(998 \\times 1100) = 0.91$ m/s.'] }
  ],
  applications: [
    'Quick checks of surge pressure against pipe pressure classes (PN ratings).',
    'Specifying check valves: the reverse velocity at the moment of closure sets the slam surge.',
    'Estimating pressure spikes in fuel lines, hydraulic lines and cooling-water systems when valves switch.',
    'Blood flow: the same impulse argument, with the elastic artery wall, sets the pressure of the pulse wave.'
  ],
  history: 'Nikolai Joukowsky (Zhukovsky), better known for his work on aerofoil lift, derived ρaΔv and confirmed it in 1897 with tests on the Moscow water supply, publishing in 1898. The American engineer John Frizell reached the same result independently in 1898, which is why it is sometimes called the Frizell–Joukowsky formula.',
  sim: { id: 'dyn-moc', params: { tc: 0.1 } }
},

{
  id: 'valve-closure', parent: 'water-hammer-topic', title: 'Slow and fast valve closure', level: 2,
  short: 'A closure is fast if it is complete within the pipe period 2L/a — then it gives the full Joukowsky surge. Slower closures give roughly 2ρLv₀/t_c (Michaud), but only if the flow really falls evenly, which most valves do not do.',
  keywords: ['valve closure', 'closing time', 'slow closure', 'rapid closure', 'Michaud', 'pipe period', '2L/a', 'effective closure time', 'two-stage closure', 'closing law', 'gate valve', 'butterfly valve', 'rigid column'],
  prereq: ['joukowsky-surge', 'water-hammer', 'minor-losses'],
  related: ['surge-protection', 'wave-speed', 'column-separation', 'check-valves', 'proportional-valves', 'hydropower', 'physics:newtons-second-law'],
  body: `
Whether a valve closure is fast or slow has nothing to do with seconds on a clock. It depends on the pipe: the yardstick is the **pipe period** $T_r = 2L/a$, the time a pressure wave takes to run from the valve to the reservoir and back.

### Fast closure: $t_c \\le 2L/a$
Every bit of velocity the valve takes away sends a positive wave up the pipe. The reservoir reflects each one as a negative, relieving wave, which reaches the valve $2L/a$ later. If the valve is shut before the first relief returns, nothing cancels anything and the valve sees the full [[joukowsky-surge|Joukowsky rise]] $\\rho a v_0$ — exactly as for an instantaneous closure. For a 1 km steel main, $2L/a \\approx 1.6$ s: shutting a valve in one second is, for this pipe, instantaneous.

### Slow closure: $t_c > 2L/a$
Now the reliefs return while the valve is still closing, and they cut the rise. If the velocity falls evenly over $t_c$, the pressure at the valve builds up for the first $2L/a$ and then stops growing, at **Michaud's** value

$$\\Delta p \\approx \\frac{2\\rho L v_0}{t_c} = \\rho a v_0\\cdot\\frac{2L/a}{t_c}$$

— the Joukowsky surge reduced in the ratio of the pipe period to the closing time. Closing over ten pipe periods cuts the surge to a tenth. For very slow closures the wave picture makes the valve pressure saw up and down between the initial pressure and Michaud's peak; its average, $\\rho L\\,\\Delta v/\\Delta t$, is what [[physics:newtons-second-law|Newton's second law]] gives for a **rigid column** of mass $\\rho A L$ decelerated evenly.

| 1 km steel main, $v_0$ = 1 m/s, $2L/a$ = 1.6 s | Surge at the valve |
|---|---|
| Shut in 0.5 s or 1.5 s | 12.5 bar (Joukowsky) |
| Shut in 5 s | about 4.0 bar |
| Shut in 20 s | about 1.0 bar |
| Shut in 60 s | about 0.33 bar |

### The catch: valves throttle at the end
Michaud assumes the *velocity* falls evenly. A real valve barely throttles while it is mostly open — a gate or butterfly valve at half travel may still pass most of the flow, because the rest of the system limits it ([[minor-losses]]) — and then cuts it off in the last 10–30 % of its travel. The **effective closure time** is that last part, so a valve with a 30 s stroke may act like one of 5 s. Remedies:
- **Two-stage closure**: shut quickly to about 20–30 % open, then slowly for the rest — common on large pipeline valves and turbine inlet valves.
- Valve trims whose flow falls more evenly with travel, and actuators whose speed can be set.
- Dampers on check valves, or non-slam check valves that close before the flow reverses.

### Opening, pumps and oil
Opening quickly gives a *down*-surge of the same size — dangerous where the pressure is already low. Starting and stopping pumps are openings and closures too; soft starters and variable-speed drives stretch them over many pipe periods. In oil hydraulics the lines are short, $2L/a$ is a few milliseconds, and most valve switching is "slow", so Michaud's estimate is the useful one; ramping the command to a proportional valve over 50–200 ms softens the spikes further ([[proportional-valves]]).

Try your own pipe in the [water-hammer calculator](#/tools/hydro/hammer), and compare the closing laws in the simulation below.
`,
  ideas: [
    'The yardstick for fast or slow is the pipe period 2L/a, not an absolute time.',
    'A closure within 2L/a gives the full Joukowsky surge ρav₀, however it is done.',
    'A slower closure with evenly falling velocity gives about 2ρLv₀/t_c (Michaud): the surge falls in proportion to the closing time.',
    'Real valves throttle mostly at the end of their travel, so their effective closure time is much shorter than their stroke.',
    'Two-stage closures, slow actuators and ramped commands are the cheapest surge protection there is.'
  ],
  pitfalls: [
    'Ten seconds is always a slow closure — On a 10 km pipeline with a = 1000 m/s, 2L/a = 20 s: a ten-second closure is instantaneous and gives the full surge.',
    'Doubling the stroke time of a valve halves the surge — Only if the flow falls evenly. If the valve throttles in the last few per cent of its travel, the effective time is short whatever the stroke.',
    'Slow closure means no transient — The pressure still rises, by about 2ρLv₀/t_c, and the column still oscillates afterwards; slow closure reduces surges, it does not remove them.'
  ],
  formulas: [
    {
      name: 'Pipe period',
      expr: 'Tr = 2*L/a', tex: 'T_r = \\dfrac{2L}{a}',
      vars: {
        Tr: { name: 'pipe period', q: 'time', unit: 's', tex: 'T_r' },
        L: { name: 'pipe length', q: 'length', unit: 'm', value: 2500 },
        a: { name: 'pressure-wave speed', q: 'speed', unit: 'm/s', value: 1190 }
      },
      stories: { Tr: 'How long is the pipe period of a {L} main whose wave speed is {a}?', L: 'Waves travel at {a} in a pipe whose pipe period is {Tr}. How long is it?' }
    },
    {
      name: 'Michaud: surge for a slow closure',
      expr: 'dp = 2*rho*L*v0/tc', tex: '\\Delta p = \\dfrac{2\\rho L v_0}{t_c}',
      vars: {
        dp: { name: 'pressure rise at the valve', q: 'pressure', unit: 'bar', tex: '\\Delta p' },
        rho: { name: 'density of the liquid', q: 'density', unit: 'kg/m³', value: 998, tex: '\\rho' },
        L: { name: 'pipe length', q: 'length', unit: 'm', value: 2500 },
        v0: { name: 'velocity before closure', q: 'speed', unit: 'm/s', value: 1.2, tex: 'v_0' },
        tc: { name: 'closure time (velocity falling evenly)', q: 'time', unit: 's', value: 20, tex: 't_c' }
      },
      note: 'Valid for t_c > 2L/a; for faster closures use ρav₀. Assumes the velocity falls linearly — use the effective closure time of the valve.',
      practice: { unknowns: ['dp', 'tc'] },
      stories: {
        dp: 'A valve at the end of a {L} main shuts evenly in {tc}; the water (density {rho}) was flowing at {v0}. Estimate the surge.',
        tc: 'Water (density {rho}) flows at {v0} in a {L} main. How slowly must the valve at its end close for the surge to stay at {dp}?'
      }
    },
    {
      name: 'Rigid column decelerated',
      expr: 'dp = rho*L*dv/dt', tex: '\\Delta p = \\rho L\\,\\dfrac{\\Delta v}{\\Delta t}',
      vars: {
        dp: { name: 'pressure difference along the pipe', q: 'pressure', unit: 'bar', tex: '\\Delta p' },
        rho: { name: 'density of the liquid', q: 'density', unit: 'kg/m³', value: 998, tex: '\\rho' },
        L: { name: 'pipe length', q: 'length', unit: 'm', value: 1000 },
        dv: { name: 'change of velocity', q: 'speed', unit: 'm/s', value: 1, tex: '\\Delta v' },
        dt: { name: 'time taken', q: 'time', unit: 's', value: 60, tex: '\\Delta t' }
      },
      note: 'Newton\'s second law for the whole column, ignoring compressibility: right for changes lasting many pipe periods, and the mean about which the wave solution oscillates.',
      stories: { dp: 'A {L} column of water (density {rho}) is slowed by {dv} over {dt}. What pressure difference does that take?' }
    }
  ],
  examples: [
    {
      title: 'How slowly to close',
      q: 'A 2.5 km ductile-iron main (a = 1190 m/s) carries water at 1.2 m/s. The surge at its end valve must stay below 3 bar. How slowly must the flow be stopped?',
      steps: [
        'Joukowsky for a fast closure: $998 \\times 1190 \\times 1.2 = 14.3$ bar — far too much.',
        'Michaud: $t_c = 2\\rho L v_0/\\Delta p = 2 \\times 998 \\times 2500 \\times 1.2/3\\times10^5 = 20$ s.',
        'Check: $2L/a = 5000/1190 = 4.2$ s, and 20 s is well beyond it, so the slow-closure estimate applies.',
        'Because a valve does most of its throttling at the end of its stroke, the flow must *fall* over 20 s; the actuator stroke may need to be several times longer, or a two-stage closure used.'
      ],
      a: 'The velocity must be brought to zero over at least 20 s; in practice a stroke of a minute or more, or a two-stage closure.'
    },
    {
      title: 'A directional valve on an oil line',
      q: 'A solenoid valve stops oil ($\\rho$ = 870 kg/m³) flowing at 5 m/s in a 2 m steel line with a = 1300 m/s. The spool shuts in 15 ms. Estimate the spike.',
      steps: [
        'Pipe period: $2L/a = 4/1300 = 3.1$ ms. The 15 ms closure is five pipe periods long — slow.',
        'Michaud: $\\Delta p = 2 \\times 870 \\times 2 \\times 5/0.015 = 1.16\\times10^6$ Pa $= 11.6$ bar.',
        'Compare the Joukowsky ceiling $870 \\times 1300 \\times 5 = 57$ bar, reached only if the spool shut within 3 ms or the line were ten times longer.'
      ],
      a: 'About 12 bar on top of the working pressure; a ramped or slower switching would reduce it further.'
    }
  ],
  quiz: [
    { q: 'A valve at the end of a 600 m steel pipe (a = 1200 m/s) shuts in 0.8 s. The closure is…', choices: ['slow, because 0.8 s is a long time for a valve', 'fast: 2L/a = 1 s, so the full Joukowsky surge appears', 'slow, since 2L/a = 0.5 s', 'impossible to classify without the velocity'], a: 1,
      why: '2L/a = 1200/1200 = 1.0 s. The valve is shut before the first relief wave returns, so the valve sees ρav₀ in full.' },
    { q: 'Water flows at 1 m/s in a 1500 m main. The valve at its end closes over 30 s with the velocity falling evenly. Estimate the surge (Michaud).', answer: 0.998, unit: 'bar', tol: 0.03,
      why: 'Δp = 2 × 998 × 1500 × 1/30 = 99 800 Pa ≈ 1.0 bar.' },
    { q: 'For a slow closure with evenly falling velocity, doubling the closure time roughly halves the surge.', a: true,
      why: 'Michaud: Δp ≈ 2ρLv₀/t_c, inversely proportional to t_c (as long as t_c stays longer than 2L/a).' },
    { q: 'Why can a valve with a 30 s stroke still cause a large surge?', choices: ['it throttles the flow mainly in the last part of its stroke', 'the wave speed rises as the valve closes', 'Michaud\'s formula ignores the density', 'long strokes excite resonance in the pipe'], a: 0,
      why: 'While the valve is mostly open, the rest of the system limits the flow; the velocity falls mainly at the end, so the effective closure time is short.' },
    { q: 'In a very slow closure the valve pressure oscillates. How does its average compare with Michaud\'s peak 2ρLv₀/t_c?', choices: ['equal', 'about half', 'about double', 'zero'], a: 1,
      why: 'The mean is the rigid-column value ρLv₀/t_c; the wave solution saws between the initial pressure and twice that.' }
  ],
  problems: [
    { q: 'A 900 m cast-iron main (a = 1100 m/s) carries water at 1.5 m/s. Over what time must the flow be stopped, evenly, for the surge at the valve to stay at 2 bar?', answer: 13.5, unit: 's', tol: 0.02,
      steps: ['$t_c = 2\\rho L v_0/\\Delta p = 2 \\times 998 \\times 900 \\times 1.5/2\\times10^5 = 13.5$ s.', 'Check: $2L/a = 1.64$ s, much shorter, so the slow-closure estimate applies.'] },
    { q: 'What is the pipe period of a 6 km steel pipeline with a wave speed of 1200 m/s?', answer: 10, unit: 's', tol: 0.02,
      steps: ['$2L/a = 12\\,000/1200 = 10$ s: any closure faster than 10 s gives this pipeline the full Joukowsky surge.'] }
  ],
  applications: [
    'Setting the closing times of motorised valves on water mains, fire mains and pipelines.',
    'Closing laws for turbine guide vanes and Pelton needles, often in two stages.',
    'Ramps in the commands to proportional valves on mobile and industrial machines.',
    'Choosing non-slam check valves for pumping stations.'
  ],
  history: 'The Swiss engineer Jules Michaud analysed the pressure rise from slowly closing valves and the use of air chambers in 1878, twenty years before Joukowsky\'s experiments. Lorenzo Allievi turned the problem into a complete theory with charts for any closure (1902 and 1913), and graphical methods based on it were used to design penstocks until computers took over.',
  sim: { id: 'dyn-moc', params: { tc: 4 } }
},

{
  id: 'surge-protection', parent: 'water-hammer-topic', title: 'Surge tanks, air vessels and protection', level: 3,
  short: 'Ways of keeping transient pressures between vapour pressure and the pipe\'s rating: slowing the change, giving the water somewhere to go (surge tanks, air vessels, accumulators), or letting it out (relief, surge-anticipating and air valves).',
  keywords: ['surge tank', 'surge shaft', 'air vessel', 'surge vessel', 'hydropneumatic tank', 'air chamber', 'mass oscillation', 'Thoma', 'relief valve', 'surge anticipating valve', 'air valve', 'vacuum breaker', 'flywheel', 'water hammer arrestor', 'accumulator', 'non-slam check valve'],
  prereq: ['water-hammer', 'valve-closure', 'hydropower'],
  related: ['column-separation', 'joukowsky-surge', 'accumulators', 'relief-valve', 'check-valves', 'pumped-storage', 'pneumatics:boyles-law', 'physics:simple-harmonic-motion'],
  body: `
Protecting a pipeline from surges means keeping two limits: the highest pressure below what the pipe, its joints and valves can take, and the lowest pressure above vapour pressure — in drinking-water mains preferably above atmospheric, so that dirty water cannot be drawn in through leaks. Every device works in one of three ways: it **slows the change**, it **gives the water somewhere to go**, or it **lets water out or air in**.

### Slow the change
Close valves slowly or in two stages ([[valve-closure]]); ramp pumps up and down with soft starters or variable-speed drives; fit a **flywheel** to a pump so that after a power failure it runs down over several seconds instead of one — the flow then fades gently and the first down-surge is smaller.

### Give the water somewhere to go: surge tanks
On the long headrace tunnel of a hydropower plant a **surge tank** (surge shaft) is a vertical shaft open to the air, where the tunnel meets the steep penstock. When the turbine gates close, the water in the tunnel does not have to stop within a pipe period: it runs on into the shaft and rises, slowing under the growing head. Fast water hammer is confined to the short penstock; the tunnel sees only a slow **mass oscillation**, the level swinging like water in a U-tube ([[physics:simple-harmonic-motion]]), with a period of minutes:

$$T = 2\\pi\\sqrt{\\frac{L\\,A_t}{g\\,A_p}}, \\qquad z_\\text{max} \\approx v_0\\sqrt{\\frac{L\\,A_p}{g\\,A_t}}$$

$L$ and $A_p$ are the tunnel's length and area, $A_t$ the shaft's area and $v_0$ the tunnel velocity; friction lowers the swing and damps it. A larger shaft gives a smaller but slower swing. A throttle at the shaft's entrance damps it faster. The shaft must also exceed a minimum area to stay stable under the turbine governor, which draws *more* flow as the head falls — **Thoma's criterion** (1910). On pumping mains, **one-way surge tanks** at high points only feed water in, through check valves, when the pressure drops.

### Air vessels
Near pumps an open shaft would have to be taller than the pump's head, so the tool is an **air vessel** (hydropneumatic surge vessel): a closed tank, partly water and partly compressed air, connected to the main just after the pump's check valve. When the pump trips, the air expands and keeps pushing water into the main, so the flow slows gradually instead of stopping; when the flow reverses, the cushion absorbs it. The gas follows $pV^n$ = constant with $n$ between 1 (slow, isothermal) and 1.4 (fast, adiabatic), like any trapped gas ([[pneumatics:boyles-law]]). A throttle on the connection, often an orifice with a bypass check valve, lets water out freely but back in slowly. In oil hydraulics the same idea is the [[accumulators|accumulator]], mounted near fast valves to swallow pressure spikes; in buildings, small **water-hammer arrestors** do the job at quick-closing taps.

### Let water out, or air in
- **Pressure-relief valves** open above a set pressure — but only help if they open fast enough.
- **Surge-anticipating valves** open on the *low*-pressure first wave after a pump trip, so that they are already open when the high-pressure return arrives.
- **Air-inlet (vacuum-breaking) valves** at high points admit air when the pressure falls below atmospheric, preventing [[column-separation]]; the air must then be let out slowly, or the air valve slamming shut makes its own surge.
- **Non-slam check valves** close before the flow reverses, avoiding the slam of a swing check.

| Device | Protects against | Typical place |
|---|---|---|
| Slow or two-stage valve | high pressure | any large valve |
| Flywheel, soft start, drive | low and high | pumping stations |
| Surge tank | both; turns hammer into mass oscillation | hydropower tunnels |
| Air vessel | low pressure after a pump trip, then high | just downstream of pumps |
| Relief or anticipating valve | high pressure | pumping stations, valve chambers |
| Air-inlet valve | column separation | high points of the profile |
| Accumulator | spikes in oil circuits | near valves and pumps |

> [!warn] Air vessels and accumulators are pressure vessels that store energy even when the pumps are stopped: isolate, vent or discharge them and lock out before any maintenance, and follow the pressure-equipment rules for their inspection. Surge shafts and valve chambers are confined spaces with fall and drowning risks — entry needs a permit, gas testing and a standby person.
`,
  ideas: [
    'Protection keeps transient pressures between vapour pressure and the pipe\'s rating: slow the change, give the water somewhere to go, or let water out or air in.',
    'A surge tank confines water hammer to the penstock and turns the tunnel\'s transient into a slow mass oscillation with a period of minutes.',
    'Period 2π√(LA_t/gA_p) and swing ≈ v₀√(LA_p/gA_t): a bigger tank means a smaller, slower swing.',
    'An air vessel feeds the main from its compressed air cushion after a pump trip, then absorbs the return flow.',
    'Air-inlet valves stop column separation at high points; surge-anticipating valves open before the high-pressure wave arrives.'
  ],
  pitfalls: [
    'A relief valve protects against any surge — A relief valve that opens in half a second is too slow for a wave that rises in milliseconds; surge-anticipating valves exist for that reason.',
    'A surge tank removes the transient — It moves it: the penstock still sees water hammer and the tunnel a slow oscillation, whose height must be contained by the shaft.',
    'Air valves only let air in — They must also let the air out after the event, slowly; an air valve that closes abruptly as the water column rushes back is itself a source of surge.'
  ],
  formulas: [
    {
      name: 'Period of a surge-tank oscillation',
      expr: 'T = 2*pi*sqrt(L*At/(g*Ap))', tex: 'T = 2\\pi\\sqrt{\\dfrac{L\\,A_t}{g\\,A_p}}',
      vars: {
        T: { name: 'period of the mass oscillation', q: 'time', unit: 's' },
        L: { name: 'length of the tunnel', q: 'length', unit: 'm', value: 2000 },
        At: { name: 'area of the surge tank', q: 'area', unit: 'm²', value: 113, tex: 'A_t' },
        Ap: { name: 'cross-section of the tunnel', q: 'area', unit: 'm²', value: 12.6, tex: 'A_p' },
        g: { const: 'g' }
      },
      note: 'Frictionless U-tube oscillation between the reservoir and the tank.',
      practice: { unknowns: ['T', 'At'] },
      stories: {
        T: 'A {L} headrace tunnel of cross-section {Ap} ends in a surge tank of area {At}. What is the period of the mass oscillation?',
        At: 'A {L} tunnel of cross-section {Ap} should oscillate with a period of {T}. How large must the surge tank be?'
      }
    },
    {
      name: 'Largest upsurge (no friction)',
      expr: 'zmax = v0*sqrt(L*Ap/(g*At))', tex: 'z_\\text{max} = v_0\\sqrt{\\dfrac{L\\,A_p}{g\\,A_t}}',
      vars: {
        zmax: { name: 'rise of the tank level above the reservoir', q: 'length', unit: 'm', tex: 'z_\\text{max}' },
        v0: { name: 'tunnel velocity before full load rejection', q: 'speed', unit: 'm/s', value: 2, tex: 'v_0' },
        L: { name: 'length of the tunnel', q: 'length', unit: 'm', value: 2000 },
        Ap: { name: 'cross-section of the tunnel', q: 'area', unit: 'm²', value: 12.6, tex: 'A_p' },
        At: { name: 'area of the surge tank', q: 'area', unit: 'm²', value: 113, tex: 'A_t' },
        g: { const: 'g' }
      },
      note: 'For an instantaneous, complete rejection. Friction reduces the swing; the same amplitude estimates the down-swing after a sudden load acceptance.',
      practice: { unknowns: ['zmax', 'At'] },
      stories: {
        zmax: 'Water flows at {v0} in a {L} tunnel of cross-section {Ap} when the turbines shut down. How high does the level in the {At} surge tank rise above the reservoir?',
        At: 'The level in the surge tank of a {L} tunnel (cross-section {Ap}, velocity {v0}) must not rise more than {zmax}. What tank area is needed?'
      }
    },
    {
      name: 'Air cushion in a surge vessel',
      expr: 'p1*V1^n = p2*V2^n', tex: 'p_1 V_1^n = p_2 V_2^n',
      vars: {
        p1: { name: 'air pressure before (absolute)', q: 'pressure', unit: 'bar', value: 11, tex: 'p_1' },
        V1: { name: 'air volume before', q: 'volume', unit: 'm³', value: 2, tex: 'V_1' },
        p2: { name: 'air pressure after (absolute)', q: 'pressure', unit: 'bar', value: 4, tex: 'p_2' },
        V2: { name: 'air volume after', q: 'volume', unit: 'm³', tex: 'V_2' },
        n: { name: 'polytropic exponent (1 isothermal, 1.4 adiabatic)', value: 1.2, min: 1, max: 1.4 }
      },
      solveFor: 'V2',
      note: 'Absolute pressures. The water pushed into the main is V₂ − V₁.',
      practice: { unknowns: ['V2', 'p2'] },
      stories: {
        V2: 'An air vessel holds {V1} of air at {p1} absolute. After a pump trip the pressure falls to {p2} absolute (exponent {n}). What volume does the air fill now?',
        p2: 'The {V1} air cushion of a surge vessel at {p1} absolute expands to {V2} (exponent {n}). What is its pressure now?'
      }
    }
  ],
  examples: [
    {
      title: 'Sizing a surge shaft',
      q: 'A 2 km headrace tunnel of 4 m diameter carries water at 2 m/s to a power station. The surge shaft is 12 m in diameter. Estimate the period and the upsurge after a sudden full shut-down, ignoring friction.',
      steps: [
        'Areas: $A_p = \\pi \\times 4^2/4 = 12.6$ m², $A_t = \\pi \\times 12^2/4 = 113$ m².',
        'Period: $T = 2\\pi\\sqrt{2000 \\times 113/(9.81 \\times 12.6)} = 2\\pi \\times 42.8 = 269$ s — four and a half minutes.',
        'Upsurge: $z_\\text{max} = 2\\sqrt{2000 \\times 12.6/(9.81 \\times 113)} = 2 \\times 4.77 = 9.5$ m above the reservoir level.',
        'Friction in the tunnel lowers this by a few metres; the shaft\'s top must still be above the highest level with a margin.'
      ],
      a: 'A period of about 4.5 minutes and an upsurge of about 9.5 m (less with friction).'
    },
    {
      title: 'An air vessel after a pump trip',
      q: 'An air vessel on a pumping main holds 2 m³ of air at 10 bar gauge (11 bar absolute). After a pump trip the pressure falls to 3 bar gauge. How much water does the vessel push into the main? Take $n$ = 1.2.',
      steps: [
        'Absolute pressures: 11 bar and 4 bar.',
        '$V_2 = V_1 (p_1/p_2)^{1/n} = 2 \\times (11/4)^{1/1.2} = 2 \\times 2.32 = 4.65$ m³.',
        'Water delivered: $4.65 - 2 = 2.65$ m³ — enough to keep 0.2 m³/s flowing for about 13 s while the column slows.'
      ],
      a: 'About 2.6 m³ of water, which lets the flow slow over seconds instead of stopping at once.'
    }
  ],
  quiz: [
    { q: 'Where is the surge tank of a hydropower scheme placed?', choices: ['at the reservoir intake', 'where the low-pressure tunnel meets the steep penstock', 'at the turbine outlet', 'halfway down the penstock'], a: 1,
      why: 'Placed at the top of the penstock it shortens the pipe in which water hammer occurs to the penstock alone, and gives the tunnel\'s water somewhere to go.' },
    { q: 'Making the surge tank\'s area four times larger…', choices: ['halves the swing and doubles the period', 'quarters the swing', 'doubles the swing', 'has no effect on the swing'], a: 0,
      why: 'z_max ∝ 1/√A_t and T ∝ √A_t: four times the area halves the swing and doubles the period.' },
    { q: 'A surge-anticipating valve opens on the first low-pressure wave after a pump trip.', a: true,
      why: 'That way it is already open when the high-pressure wave returns — a relief valve that waited for the high pressure would open too late.' },
    { q: 'Why is an air vessel used near a pump instead of an open surge tank?', choices: ['an open standpipe would have to be taller than the pump\'s head', 'air vessels are cheaper per litre', 'surge tanks only work with oil', 'the air keeps the water clean'], a: 0,
      why: 'An open shaft must reach the hydraulic grade line — tens or hundreds of metres above a pump. A closed vessel holds the same pressure with compressed air.' },
    { q: 'What is the period of oscillation for a 1000 m tunnel of 7 m² cross-section and a 50 m² surge tank?', answer: 169.6, unit: 's', tol: 0.02,
      why: 'T = 2π√(1000 × 50/(9.81 × 7)) = 2π × 27.0 ≈ 170 s.' }
  ],
  problems: [
    { q: 'Water flows at 1.5 m/s in a 3 km tunnel of 20 m² cross-section, ending in a 150 m² surge tank. Estimate the upsurge after an instantaneous full shut-down, without friction.', answer: 9.58, unit: 'm', tol: 0.02,
      steps: ['$z_\\text{max} = 1.5\\sqrt{3000 \\times 20/(9.81 \\times 150)} = 1.5 \\times 6.39 = 9.6$ m.'] },
    { q: 'A surge vessel\'s 3 m³ air cushion at 8 bar absolute is compressed by returning water to 12 bar absolute (n = 1.3). What is its new volume?', answer: 2.199, unit: 'm³', tol: 0.02,
      steps: ['$V_2 = V_1 (p_1/p_2)^{1/n} = 3 \\times (8/12)^{1/1.3} = 3 \\times 0.733 = 2.20$ m³.', 'The vessel has taken in 0.8 m³ of the returning water.'] }
  ],
  applications: [
    'Surge shafts and throttled surge chambers on hydropower headraces, and on pumped-storage schemes, which see flows in both directions.',
    'Air vessels on sewage rising mains and water pumping mains.',
    'Water-hammer arrestors in buildings and air chambers on irrigation laterals.',
    'Accumulators on oil-hydraulic presses, injection-moulding machines and mobile machines to absorb pressure peaks.'
  ],
  history: 'Surge tanks appeared on hydropower schemes in the Alps and North America around 1900, as tunnels grew longer. Dieter Thoma showed in 1910 that a governed turbine can make the oscillation grow unless the tank exceeds a minimum area — Thoma\'s criterion, still used. Air chambers are older: Michaud discussed them in 1878, and small ones on pump deliveries go back to the fire engines of the eighteenth century, which used them to smooth the flow of their piston pumps.',
  sim: 'dyn-surge-tank'
},

{
  id: 'column-separation', parent: 'water-hammer-topic', title: 'Column separation', level: 3,
  short: 'When a transient pulls the pressure down to vapour pressure, the liquid column breaks and a vapour cavity opens. The cavity is harmless; its collapse, when the columns rejoin, can produce spikes greater than the Joukowsky surge.',
  keywords: ['column separation', 'vapour cavity', 'cavitation', 'negative pressure', 'down-surge', 'pump trip', 'high point', 'rejoining', 'cavity collapse', 'vapour pressure', 'vacuum', 'air valve', 'transient cavitation'],
  prereq: ['joukowsky-surge', 'vapour-pressure', 'gauge-absolute'],
  related: ['surge-protection', 'cavitation', 'water-hammer', 'npsh', 'counterbalance-valve', 'air-in-oil', 'hgl-egl'],
  body: `
A liquid can be pushed as hard as you like, but it cannot be pulled. When a transient drives the pressure somewhere in a pipe down to the liquid's [[vapour-pressure]] — 2.3 kPa absolute for water at 20 °C, about −1 bar gauge — the water boils cold, the column breaks and a vapour cavity opens between its two parts. That is **column separation**. While it lasts it is harmless; the damage comes when the columns meet again.

### When it happens
A down-surge is $\\rho a\\,\\Delta v$ below the pressure before it. It reaches vapour pressure wherever

$$H_0 - \\frac{a\\,\\Delta v}{g} < H_v$$

with $H_0$ the gauge pressure head before the event and $H_v \\approx -10$ m the vapour head (see [[gauge-absolute]]). With $a$ near 1000 m/s every metre per second is a 100 m drop, so separation is common:
- **After a pump trip**, at the pump's delivery: the first wave is a drop of $a v_0/g$. A main at 1.5 m/s with less than about 140 m of head at the pump will separate there.
- **At high points and knees** of a pipeline, where the pipe runs close to the [[hgl-egl|hydraulic grade line]]: the low-pressure wave dips below the pipe there first.
- **At a valve** one pipe period after a fast closure, when the pressure there swings low; and on the downstream side of a valve closing in the middle of a line.

### Why the rejoining hurts
While the cavity grows the columns on each side are slowed; then they reverse and run back into it. When the cavity closes, the two columns — or a column and a closed valve — meet with a relative velocity, and a Joukowsky-type wave starts from the point of collapse. Because it adds to waves already travelling in the pipe, short sharp spikes can exceed the Joukowsky pressure of the original closure; the simulation below shows them. Repeated separation and collapse has burst mains and cracked cast-iron fittings, and thin plastic pipes can buckle under the outside atmosphere while the inside sits at vapour pressure. In water supply, the low pressure also draws polluted groundwater in through leaks.

### Preventing it
- Keep the lowest transient pressure above vapour pressure; design criteria often require it to stay at or above atmospheric.
- **Air vessels** and **flywheels** at pumps make the flow decay slowly ([[surge-protection]]).
- **Air-inlet valves** at high points let air, not vapour, fill the void: an air pocket cushions the rejoining, but it must be vented slowly afterwards.
- **One-way surge tanks** feed water in at critical points.
- Choose the route so that the pipe stays well below the lowest transient grade line.

The same physics appears as [[cavitation]] in pumps and valves, where a local pressure drop rather than a wave reaches vapour pressure. In oil hydraulics, a load running away from a cylinder can pull the pressure in the inlet chamber down to vapour pressure and release dissolved air — the job of [[counterbalance-valve|counterbalance valves]] and anti-cavitation checks ([[air-in-oil]]).

> [!warn] Column separation can burst pipes even when steady pressures look modest, and the sudden collapse spikes are hard to predict. Inspect and repair pipelines only with the line isolated, depressurised and drained; valve chambers are confined spaces that need entry precautions.
`,
  ideas: [
    'Liquids cannot carry tension: at vapour pressure (about −1 bar gauge for cold water) the column breaks and a vapour cavity forms.',
    'Separation occurs where H₀ − aΔv/g falls below the vapour head: at pumps after a trip, at high points, and at valves after the pressure swings low.',
    'The collapse of the cavity starts a new wave; added to those already in the pipe it can exceed the Joukowsky surge.',
    'Air vessels, flywheels, air-inlet valves and one-way surge tanks prevent it; keeping the pipe below the lowest grade line avoids it.',
    'Low pressure in drinking-water mains also draws polluted water in through leaks.'
  ],
  pitfalls: [
    'The pressure can fall to −ρaΔv however large that is — Absolute pressure cannot go below vapour pressure; at about −1 bar gauge the column separates instead.',
    'A vapour cavity cushions the pipe like an air pocket — Vapour condenses instantly when the pressure returns, so the columns meet with no cushion; air, which does not condense, is what cushions.',
    'The Joukowsky value is the worst case — With column separation the collapse spikes can exceed it.'
  ],
  formulas: [
    {
      name: 'Lowest head after a down-surge',
      expr: 'Hmin = H0 - a*dv/g', tex: 'H_\\text{min} = H_0 - \\dfrac{a\\,\\Delta v}{g}',
      vars: {
        Hmin: { name: 'lowest pressure head (gauge)', q: 'length', unit: 'm', signed: true, tex: 'H_\\text{min}' },
        H0: { name: 'pressure head before the event (gauge)', q: 'length', unit: 'm', value: 60, signed: true, tex: 'H_0' },
        a: { name: 'pressure-wave speed', q: 'speed', unit: 'm/s', value: 1000 },
        dv: { name: 'velocity change', q: 'speed', unit: 'm/s', value: 0.5, tex: '\\Delta v' },
        g: { const: 'g' }
      },
      note: 'If H_min comes out below the vapour head H_v (about −10 m for cold water), the column separates and the pressure stays at H_v instead.',
      practice: { unknowns: ['Hmin', 'dv'] },
      stories: {
        Hmin: 'A pump trips on a main where the head at the pump was {H0} and the wave speed is {a}; the flow of {dv} stops. What does the pressure head fall to, ignoring separation?',
        dv: 'At a point where the head is {H0} and the wave speed {a}, the head must not fall below {Hmin}. What is the largest sudden velocity change allowed?'
      }
    },
    {
      name: 'Vapour head as a gauge head',
      expr: 'Hv = (pv - patm)/(rho*g)', tex: 'H_v = \\dfrac{p_v - p_\\text{atm}}{\\rho\\,g}',
      vars: {
        Hv: { name: 'vapour pressure as a gauge head', q: 'length', unit: 'm', signed: true, tex: 'H_v' },
        pv: { name: 'vapour pressure (absolute)', q: 'pressure', unit: 'kPa', value: 2.34, tex: 'p_v' },
        patm: { name: 'atmospheric pressure (absolute)', q: 'pressure', unit: 'kPa', value: 101.3, tex: 'p_\\text{atm}' },
        rho: { name: 'density of the liquid', q: 'density', unit: 'kg/m³', value: 998, tex: '\\rho' },
        g: { const: 'g' }
      },
      note: 'Water: p_v = 2.34 kPa at 20 °C, 12.3 kPa at 50 °C, 47.4 kPa at 80 °C. At altitude, p_atm is lower and so is the margin.',
      practice: { unknowns: ['Hv'] },
      stories: { Hv: 'Water at a vapour pressure of {pv} (density {rho}) is in a pipe where the atmosphere is {patm}. At what gauge head does it boil?' }
    }
  ],
  examples: [
    {
      title: 'A pump trips',
      q: 'A pumping main has a wave speed of 1100 m/s and carries water at 1.2 m/s; the head at the pump is 80 m. The pump trips and its check valve closes. Does the column separate at the pump, and what velocity change could be stopped instantly without separation?',
      steps: [
        'Down-surge: $a\\Delta v/g = 1100 \\times 1.2/9.81 = 134.6$ m.',
        '$H_\\text{min} = 80 - 134.6 = -54.6$ m, far below the vapour head of −10.1 m: the column separates.',
        'Largest safe instantaneous change: $\\Delta v = g(H_0 - H_v)/a = 9.81 \\times (80 + 10.1)/1100 = 0.80$ m/s.',
        'So the flow must be made to decay gradually — an air vessel or a flywheel — rather than stop at once.'
      ],
      a: 'Yes; only 0.8 m/s could be stopped instantly. The main needs an air vessel or a flywheel.'
    },
    {
      title: 'Hot water separates sooner',
      q: 'A district-heating main carries water at 80 °C ($p_v$ = 47.4 kPa, $\\rho$ = 972 kg/m³) under an atmosphere of 101.3 kPa. What is its vapour head?',
      steps: [
        '$H_v = (47.4 - 101.3)\\times10^3/(972 \\times 9.81) = -5.65$ m.',
        'Compare −10.1 m for cold water: the hot main has 4.5 m less margin, which is why heating networks are kept well pressurised.'
      ],
      a: 'About −5.7 m gauge, against −10.1 m for cold water.'
    }
  ],
  quiz: [
    { q: 'Column separation starts when the pressure falls to…', choices: ['0 bar gauge', 'the vapour pressure of the liquid', 'half the static pressure', '−10 bar gauge'], a: 1,
      why: 'The liquid boils at its vapour pressure — about 2.3 kPa absolute, or −1 bar gauge, for cold water — and the column breaks.' },
    { q: 'The pressure spike when a vapour cavity collapses can exceed the Joukowsky surge of the original closure.', a: true,
      why: 'The collapse sends out a new wave, which adds to the waves already travelling in the pipe.' },
    { q: 'After a pump trip, where does column separation usually appear first?', choices: ['at the lowest point of the main', 'at the pump\'s delivery and at high points of the profile', 'at the downstream reservoir', 'only inside the pump casing'], a: 1,
      why: 'The first wave after a trip is a pressure drop starting at the pump; high points, close to the grade line, have the least margin.' },
    { q: 'Water at 20 °C: atmosphere 101.3 kPa, vapour pressure 2.3 kPa. What is the vapour head as a gauge head?', answer: -10.11, unit: 'm', tol: 0.03,
      why: 'H_v = (2.3 − 101.3) × 1000/(998 × 9.81) = −10.1 m.' },
    { q: 'Why is an air-inlet valve at a high point better than letting a vapour cavity form?', choices: ['air cushions the rejoining columns, because it does not condense', 'air raises the wave speed', 'air is heavier than vapour', 'it removes the need for check valves'], a: 0,
      why: 'A vapour cavity vanishes instantly as the pressure recovers; an air pocket has to be compressed, so the columns meet gently.' }
  ],
  problems: [
    { q: 'A valve at the end of a line (a = 1200 m/s) is shut instantly. The pressure head there was 50 m. What is the largest velocity that can be stopped without the pressure at the valve reaching vapour pressure (H_v = −10 m) one pipe period later?', answer: 0.49, unit: 'm/s', tol: 0.02,
      steps: ['One pipe period after closure the valve head is $H_0 - a\\Delta v/g$.', 'Set it equal to $H_v$: $\\Delta v = g(H_0 - H_v)/a = 9.81 \\times 60/1200 = 0.49$ m/s.'] },
    { q: 'A pump trip stops a flow of 0.6 m/s in a PE main with a = 320 m/s. The head at the pump was 25 m. What is the lowest head, ignoring separation?', answer: 5.43, unit: 'm', tol: 0.03,
      steps: ['$H_\\text{min} = 25 - 320 \\times 0.6/9.81 = 25 - 19.6 = 5.4$ m: above the vapour head, so this PE main does not separate at the pump.'] }
  ],
  applications: [
    'Surge analysis of pumping mains with high points, where air valves and air vessels are placed.',
    'Hydropower draft tubes, where column separation after load rejection can lift the rotor.',
    'Fuel and cooling-water systems in power plants, where rejoining spikes have damaged piping.',
    'Oil hydraulics: anti-cavitation (make-up) check valves on motors and cylinders that can overrun.'
  ],
  history: 'Column separation was recognised in the first water-hammer tests around 1900 and blamed for many pipe bursts, but it resisted calculation until the 1960s and 1970s, when vapour-cavity models were added to the method of characteristics. Laboratory tests in the 1990s and 2000s measured the short collapse spikes that exceed the Joukowsky pressure and gave today\'s models their checks.',
  sim: { id: 'dyn-moc', params: { v0: 1.5, H0: 40 } }
},

/* ================================================================ ELECTRO-HYDRAULICS */
{
  id: 'electrohydraulic-control', parent: 'electrohydraulics', title: 'Electro-hydraulic control', level: 2,
  short: 'An electronic controller decides, an electrically driven valve meters the oil, the actuator moves and sensors report back. Proportional valves, servo-proportional valves and servo valves trade cost against speed and precision.',
  keywords: ['electro-hydraulic', 'electrohydraulic', 'proportional valve', 'servo valve', 'servo-proportional', 'valve amplifier', 'on-board electronics', 'solenoid', 'torque motor', 'command signal', '4-20 mA', 'closed loop', 'open loop', 'position sensor', 'hydraulic axis', 'motion control'],
  prereq: ['proportional-valves', 'servo-valves', 'hydraulic-cylinder', 'electronics:sensors'],
  related: ['servo-loop', 'hydraulic-stiffness', 'valve-sizing-dynamics', 'pressure-compensation', 'load-sensing', 'iso-4406', 'electronics:pwm', 'pneumatics:servo-pneumatics', 'aircraft-hydraulics', 'industrial-presses'],
  body: `
In a modern machine the operator's lever or the programme no longer moves a spool directly. An electronic controller decides what the actuator should do, an electrical signal drives a valve, and the valve meters oil to a cylinder or motor whose motion is measured and reported back. The hydraulics supplies the muscle — force densities no electric drive can match — and the electronics the brains.

### The chain
1. **Command**: a set point from a PLC, a motion controller or a joystick — ±10 V, 4–20 mA or a fieldbus message.
2. **Valve amplifier**: turns the command into a coil current, with ramps, a small dither to break friction, and compensation for the spool's overlap. It is often built into the valve (on-board electronics).
3. **Valve**: a proportional solenoid or a torque motor moves a spool; its opening sets the flow for a given pressure drop, $Q = Q_N\\,u\\,\\sqrt{\\Delta p/\\Delta p_N}$ ([[orifice-equation]]).
4. **Actuator and load**: a cylinder or motor, $v = Q/A$.
5. **Sensors**: position (magnetostrictive sensors inside the cylinder, encoders), pressure transducers, sometimes force — for **closed-loop** control ([[servo-loop]], [[electronics:sensors]]).

### Families of valves
| | Proportional valve | Servo-proportional | Servo valve |
|---|---|---|---|
| Drive | solenoid(s), about 1–3 A | solenoid with spool-position feedback | torque motor, 10–100 mA |
| Spool | overlapped: dead band 5–20 % | zero lap | zero lap, pilot stage |
| Bandwidth | 5–40 Hz | 50–150 Hz | 100–300 Hz |
| Hysteresis | 1–5 % | under 0.2 % | under 0.1 % |
| Rated drop $\\Delta p_N$ | 10 bar (5 per land) | 70 bar (35 per land) | 70 bar |
| Typical oil cleanliness (ISO 4406:2021) | 18/16/13 | 16/14/11 | 15/13/10 or better |

**Proportional valves** ([[proportional-valves]]) replaced on/off valves wherever smooth starts and stops, adjustable speeds or pressures are wanted — mobile machines, presses, injection moulding. **Servo valves** ([[servo-valves]]), developed for aircraft and missile control around 1950, give the fastest and finest response for test rigs, flight simulators, rolling mills and flight controls, at the price of very clean oil and a constant pilot leakage. **Servo-proportional** valves sit between them and run most industrial closed-loop axes today. Solenoid currents are usually switched (PWM, [[electronics:pwm]]), which also provides the dither.

### Open and closed loop
In **open loop** the controller sends a signal and trusts the valve: the speed follows the command only as well as the load, oil temperature and supply pressure stay constant — a [[pressure-compensation|pressure-compensated]] valve helps. In **closed loop** a sensor compares what happened with what was asked and the controller corrects the error continuously; precision then comes from the sensor, and speed from the loop's dynamics — limited by the oil spring ([[hydraulic-stiffness]]). Hydraulic axes are controlled in position, velocity, force or pressure, and presses switch from position to force control as the tool meets the work.

### Throttling costs heat
A valve controls by throttling: whatever pressure drops across its lands becomes heat, $P = \\Delta p\\,Q$. An axis with 210 bar supply that needs 140 bar at the cylinder burns a third of the hydraulic power in the valve. Load-sensing pumps ([[load-sensing]]) and variable-speed pump drives reduce that waste.

> [!warn] An electro-hydraulic axis can move without warning if a signal, cable or sensor fails. Safety functions follow ISO 13849-1:2023 and ISO 4413:2010: valves must fall to a safe position, and before any work the hydraulic power is isolated, accumulators discharged, loads supported and the controls locked out. Oil escaping at servo pressures can be injected through the skin — a surgical emergency: seek emergency medical care at once.
`,
  ideas: [
    'Electronics decide and hydraulics act: command, amplifier, valve, actuator, sensor.',
    'A valve\'s flow depends on both the command and the pressure drop: Q = Q_N·u·√(Δp/Δp_N).',
    'Proportional valves are cheap and dirt-tolerant but slow and overlapped; servo valves are fast and precise but need very clean oil.',
    'Closed-loop control makes precision depend on the sensor; its speed is limited by the oil spring.',
    'Every bar dropped across a control valve turns into heat: P = Δp·Q.'
  ],
  pitfalls: [
    'A 60 % command gives 60 % of the rated flow — Only at the rated pressure drop. The flow grows with the square root of the drop, so the same command gives more flow at light load and less at heavy load.',
    'A servo valve is just a better proportional valve — It is a different kind of device: zero-lap spool, pilot stage, high bandwidth, constant leakage and far stricter filtration.',
    'Closed-loop control makes the axis as fast as the controller — The oil column and the mass form a lightly damped spring–mass system, and its natural frequency limits the usable gain.'
  ],
  formulas: [
    {
      name: 'Flow of a proportional or servo valve',
      expr: 'Q = QN*u*sqrt(dp/dpN)', tex: 'Q = Q_N\\,u\\,\\sqrt{\\dfrac{\\Delta p}{\\Delta p_N}}',
      vars: {
        Q: { name: 'flow through the valve', q: 'flowrate', unit: 'L/min' },
        QN: { name: 'rated flow at full command', q: 'flowrate', unit: 'L/min', value: 40, tex: 'Q_N' },
        u: { name: 'command (fraction of full signal)', q: 'ratio', unit: '%', value: 60, min: 0, max: 100 },
        dp: { name: 'pressure drop across the valve (both lands)', q: 'pressure', unit: 'bar', value: 20, tex: '\\Delta p' },
        dpN: { name: 'rated pressure drop (both lands)', q: 'pressure', unit: 'bar', value: 10, tex: '\\Delta p_N' }
      },
      note: 'Δp_N is 10 bar (5 per land) for most proportional valves and 70 bar (35 per land) for servo and servo-proportional valves. Assumes a linear flow characteristic outside the dead band.',
      practice: { unknowns: ['Q', 'u', 'dp'] },
      stories: {
        Q: 'A valve rated {QN} at {dpN} receives a {u} command with {dp} across it. What flow does it pass?',
        u: 'A valve rated {QN} at {dpN} must pass {Q} with {dp} across it. What command is needed?'
      }
    },
    {
      name: 'Power lost across the valve',
      expr: 'P = dp*Q', tex: 'P = \\Delta p\\,Q',
      vars: {
        P: { name: 'power turned into heat', q: 'power', unit: 'kW' },
        dp: { name: 'pressure drop across the valve', q: 'pressure', unit: 'bar', value: 70, tex: '\\Delta p' },
        Q: { name: 'flow', q: 'flowrate', unit: 'L/min', value: 60 }
      },
      note: 'P (kW) = Δp (bar) × Q (L/min) / 600.',
      stories: { P: 'A servo valve drops {dp} while passing {Q}. How much heat does it make?' }
    }
  ],
  examples: [
    {
      title: 'Reading a proportional valve',
      q: 'A proportional valve is rated 40 L/min at 10 bar (5 bar per land). With a 60 % command and 20 bar across the valve, what flow does it pass, and how fast does it extend a 63 mm cylinder (ignoring the difference between the two lands)?',
      steps: [
        '$Q = 40 \\times 0.6 \\times \\sqrt{20/10} = 33.9$ L/min.',
        'Area: $\\pi \\times 0.063^2/4 = 3.12\\times10^{-3}$ m².',
        '$v = 33.9/60\\,000/3.12\\times10^{-3} = 0.18$ m/s.'
      ],
      a: 'About 34 L/min, and 0.18 m/s.'
    },
    {
      title: 'Heat in a servo axis',
      q: 'A servo axis runs from a 210 bar supply; moving at speed, the cylinder needs 140 bar and 60 L/min. How much power does the valve turn into heat, and what share of the input is that?',
      steps: [
        'Drop across the valve: $210 - 140 = 70$ bar.',
        'Heat: $70 \\times 60/600 = 7$ kW.',
        'Input: $210 \\times 60/600 = 21$ kW, so a third of it heats the oil.'
      ],
      a: '7 kW, a third of the hydraulic input — the price of control by throttling.'
    }
  ],
  quiz: [
    { q: 'Which valve typically has the highest bandwidth?', choices: ['an on/off solenoid valve', 'a proportional valve with an overlapped spool', 'a servo valve', 'a manual lever valve'], a: 2,
      why: 'Servo valves, with a light torque motor and a hydraulic pilot stage, reach 100–300 Hz; proportional valves 5–40 Hz.' },
    { q: 'A proportional valve with a 60 % command always passes 60 % of its rated flow.', a: false,
      why: 'Only at the rated pressure drop. Q = Q_N·u·√(Δp/Δp_N): with four times the drop the same command gives twice the flow.' },
    { q: 'Why do servo valves need much cleaner oil than on/off valves?', choices: ['their tiny clearances and pilot nozzles are blocked or worn by fine particles', 'they run hotter', 'they use water-based fluids', 'their torque motor sits in the oil'], a: 0,
      why: 'Pilot nozzles of a few tenths of a millimetre and spool clearances of a few micrometres make silt-sized particles harmful.' },
    { q: 'A servo valve is rated 25 L/min at 70 bar. At full command with 35 bar across it, what flow does it pass?', answer: 17.68, unit: 'L/min', tol: 0.02,
      why: 'Q = 25 × √(35/70) = 25 × 0.707 = 17.7 L/min.' },
    { q: 'In open loop, a heavier load slows the cylinder at the same command. What keeps the speed constant without a sensor?', choices: ['a pressure-compensated valve, which holds the drop across the metering edge constant', 'a stronger solenoid', 'a higher relief-valve setting', 'thinner oil'], a: 0,
      why: 'With the drop held constant by a compensator, the flow depends only on the opening — the command.' }
  ],
  problems: [
    { q: 'A valve drops 50 bar while passing 80 L/min. How much heat does it produce?', answer: 6.67, unit: 'kW', tol: 0.02,
      steps: ['$P = \\Delta p\\,Q = 5\\times10^6 \\times 80/60\\,000 = 6667$ W $= 6.7$ kW.'] },
    { q: 'A proportional valve rated 63 L/min at 10 bar must pass 50 L/min with 16 bar across it. What command (in %) is needed?', answer: 62.7, unit: '%', tol: 0.02,
      steps: ['$u = Q/(Q_N\\sqrt{\\Delta p/\\Delta p_N}) = 50/(63\\sqrt{1.6}) = 50/79.7 = 0.627$, about 63 %.'] }
  ],
  applications: [
    'Excavators and cranes with electro-hydraulic joysticks and electronically controlled pumps.',
    'Presses switching between position, speed and force control through the stroke.',
    'Test rigs, earthquake shaking tables and flight simulators driven by servo valves.',
    'Aircraft flight controls, where fly-by-wire commands drive electro-hydraulic actuators.'
  ],
  history: 'Electro-hydraulic servo valves grew out of wartime and post-war work on gun, missile and aircraft control: the two-stage valve with a torque motor and flapper-nozzle pilot appeared around 1950. Proportional solenoid valves, cheaper and tolerant of dirt, spread through industry from the 1970s, and on-board electronics and fieldbus interfaces followed from the 1990s.',
  sim: { id: 'dyn-servo', params: { valve: 'prop', Kv: 8 } }
},

{
  id: 'servo-loop', parent: 'electrohydraulics', title: 'Closed-loop position control', level: 3,
  short: 'A hydraulic position axis: the controller opens the valve in proportion to the position error, the cylinder integrates the flow into position. The loop gain K_v sets speed and following error; the oil spring limits it to about 2ζ_hω_h.',
  keywords: ['servo loop', 'position control', 'closed loop', 'feedback', 'loop gain', 'velocity gain', 'Kv', 'following error', 'P controller', 'stability', 'hydraulic resonance', 'Routh', 'feed-forward', 'servo axis', 'bandwidth', 'damping'],
  prereq: ['electrohydraulic-control', 'hydraulic-stiffness', 'electronics:negative-feedback', 'math:damped-oscillator-ode'],
  related: ['valve-sizing-dynamics', 'servo-valves', 'proportional-valves', 'electronics:bode-plots', 'electronics:transfer-function', 'pneumatics:servo-pneumatics', 'aircraft-hydraulics'],
  body: `
A hydraulic position axis is one of the simplest feedback loops in engineering — and one of the most instructive, because it runs into a hard limit set by the oil itself.

### The loop
The controller compares the demanded position $x_\\text{ref}$ with the measured position $x$ and opens the valve in proportion to the error, $u = K_p\\,(x_\\text{ref} - x)$. The valve turns opening into flow and the cylinder turns flow into speed, $v = Q/A$. Together, speed is proportional to the error:

$$v = K_v\\,e, \\qquad K_v = \\frac{v_\\text{max}}{e_\\text{full}}$$

$K_v$, the **velocity gain** or loop gain (unit 1/s), is the speed per unit of error: $e_\\text{full}$ is the error that opens the valve fully and $v_\\text{max}$ the speed that gives. Because the cylinder *integrates* speed into position, proportional control alone reaches any fixed set point with no error at all: as long as an error remains, the valve stays open and the cylinder keeps moving ([[electronics:negative-feedback]]). If the hydraulics were rigid, the axis would approach a step exponentially with a time constant $1/K_v$ — at $K_v$ = 20 1/s, 95 % of the way in 0.15 s.

### Following error
At constant speed the axis must keep its valve open, so it lags a moving set point by the **following error**

$$e = \\frac{v}{K_v}$$

— 5 mm at 0.1 m/s with $K_v$ = 20 1/s. **Velocity feed-forward**, opening the valve for the planned speed in advance, removes most of it; modern axis controllers all have it.

### The limit: the oil spring
The oil in the cylinder is a spring and the load a mass ([[hydraulic-stiffness]]), with a natural frequency $\\omega_h$ and very little damping — $\\zeta_h$ of 0.05–0.3, since oil has little internal friction and a good servo cylinder little leakage. The loop now holds an integrator *and* a lightly damped resonance ([[math:damped-oscillator-ode]]). Raise $K_v$ and the response gets faster, then rings at $\\omega_h$, then goes unstable. For a valve much faster than the load, Routh's criterion gives the limit

$$K_{v,\\text{max}} = 2\\,\\zeta_h\\,\\omega_h = 4\\pi\\,\\zeta_h\\,f_h$$

With $f_h$ = 15 Hz and $\\zeta_h$ = 0.2 the limit is 38 1/s. A common rule of thumb is $K_v \\lesssim \\omega_h/3$, which assumes a damping of about 0.2 or more and a valve at least three times faster than $f_h$. With lighter damping, stay nearer half the limit; with a slower valve, its own lag enters the loop and the limit has to be read from the full frequency response, as the simulation below does. **Stiffer hydraulics — shorter lines, larger areas, smaller trapped volumes — allows a higher gain**, and that is the designer's main lever.

| Axis | $f_h$ | Typical $K_v$ |
|---|---|---|
| Mobile machine, proportional valve | 3–8 Hz | 5–15 1/s |
| Industrial axis, servo-proportional valve | 10–30 Hz | 15–50 1/s |
| Test rig or flight actuator, servo valve | 30–100 Hz | 50–200 1/s |

### Beyond P control
Integral action removes a steady error caused by leakage or valve offset, but adds phase lag and must be used gently. **Pressure or acceleration feedback** damps the oil spring and allows a higher $K_v$; state controllers do this systematically. Sample the loop at least ten to twenty times faster than $f_h$, and choose a position sensor finer than the accuracy you need. The frequency-domain view — the phase of an integrator plus a resonance crossing −180° — is the one drawn in [[electronics:bode-plots|Bode plots]].
`,
  ideas: [
    'The cylinder integrates flow into position, so P control alone reaches a fixed set point with no error.',
    'The loop gain K_v (1/s) is speed per unit of error: K_v = v_max/e_full; the time constant is 1/K_v.',
    'Following a moving set point costs an error v/K_v; velocity feed-forward removes most of it.',
    'The oil spring and the mass make a lightly damped resonance; the loop is stable only for K_v < 2ζ_hω_h.',
    'Stiffer hydraulics and added damping (pressure feedback) are what allow a faster axis.'
  ],
  pitfalls: [
    'A P controller always leaves a steady error — Not on a hydraulic axis at rest: the cylinder is an integrator, so the valve closes only when the error is zero (leakage and valve offset aside).',
    'Doubling the gain makes the axis twice as fast — Only well below the limit. Near 2ζ_hω_h the response rings, and beyond it the axis oscillates until something saturates.',
    'A faster valve cures an unstable axis — It helps only if the valve was the slow part. With a fast valve the limit is 2ζ_hω_h, set by the oil spring and the load; only stiffer hydraulics or more damping raise it.'
  ],
  formulas: [
    {
      name: 'Loop gain (velocity gain)',
      expr: 'Kv = vmax/efull', tex: 'K_v = \\dfrac{v_\\text{max}}{e_\\text{full}}',
      vars: {
        Kv: { name: 'loop gain', q: 'rate', unit: '1/s', tex: 'K_v' },
        vmax: { name: 'speed at full valve opening', q: 'speed', unit: 'mm/s', value: 200, tex: 'v_\\text{max}' },
        efull: { name: 'position error that opens the valve fully', q: 'length', unit: 'mm', value: 10, tex: 'e_\\text{full}' }
      },
      stories: {
        Kv: 'An axis reaches {vmax} with the valve fully open, and the controller opens it fully at an error of {efull}. What is the loop gain?',
        efull: 'An axis moves at {vmax} with the valve fully open. At what error must the valve be fully open to give a loop gain of {Kv}?'
      }
    },
    {
      name: 'Following error',
      expr: 'ef = v/Kv', tex: 'e = \\dfrac{v}{K_v}',
      vars: {
        ef: { name: 'following error', q: 'length', unit: 'mm', tex: 'e' },
        v: { name: 'speed of the set point', q: 'speed', unit: 'mm/s', value: 100 },
        Kv: { name: 'loop gain', q: 'rate', unit: '1/s', value: 20, tex: 'K_v' }
      },
      note: 'Without feed-forward. The time constant of the loop is 1/K_v.',
      stories: { ef: 'An axis with a loop gain of {Kv} follows a set point moving at {v}. How far does it lag behind?', Kv: 'An axis moving at {v} may lag by at most {ef}. What loop gain does it need?' }
    },
    {
      name: 'Stability limit of the loop gain',
      expr: 'Kvmax = 4*pi*zeta*fh', tex: 'K_{v,\\text{max}} = 4\\pi\\,\\zeta_h\\,f_h',
      vars: {
        Kvmax: { name: 'largest stable loop gain', q: 'rate', unit: '1/s', tex: 'K_{v,\\text{max}}' },
        zeta: { name: 'damping ratio of the hydraulic resonance', value: 0.2, min: 0, max: 1, tex: '\\zeta_h' },
        fh: { name: 'hydraulic natural frequency', q: 'frequency', unit: 'Hz', value: 15, tex: 'f_h' }
      },
      note: 'K_v,max = 2ζ_hω_h for an ideal (fast) valve. Keep a margin: K_v ≲ ω_h/3 for ζ_h ≈ 0.2, about half the limit in general.',
      stories: { Kvmax: 'A servo axis has a hydraulic natural frequency of {fh} with a damping ratio of {zeta}. What is the largest stable loop gain?', fh: 'A loop gain of {Kvmax} is wanted with a damping ratio of {zeta}. What natural frequency must the hydraulics reach, at the limit?' }
    }
  ],
  examples: [
    {
      title: 'Choosing the gain',
      q: 'An axis has a hydraulic natural frequency of 12 Hz and a damping ratio of 0.2. What loop gain is stable, what would you choose, and what is the following error at 150 mm/s?',
      steps: [
        'Limit: $K_{v,\\text{max}} = 4\\pi \\times 0.2 \\times 12 = 30$ 1/s.',
        'Rule of thumb: $\\omega_h/3 = 2\\pi \\times 12/3 = 25$ 1/s — only a little below the limit, so the response would ring. Choose about 20 1/s, a gain margin of 1.5.',
        'Following error: $e = 150/20 = 7.5$ mm, reduced by velocity feed-forward.',
        'Step response: time constant $1/20 = 50$ ms; 95 % in about 0.15 s.'
      ],
      a: 'Stable below 30 1/s; about 20 1/s is sensible, with 7.5 mm of following error at 150 mm/s before feed-forward.'
    },
    {
      title: 'Setting K_v from the valve',
      q: 'With the valve fully open an axis moves at 250 mm/s. A loop gain of 15 1/s is wanted. At what error should the controller command full opening?',
      steps: [
        '$e_\\text{full} = v_\\text{max}/K_v = 250/15 = 16.7$ mm.',
        'Larger errors saturate the valve: the axis then moves at its top speed until it is within 16.7 mm of the target.'
      ],
      a: 'At an error of about 17 mm.'
    }
  ],
  quiz: [
    { q: 'A P-controlled hydraulic position axis comes to rest at a fixed set point with…', choices: ['a steady error proportional to 1/K_v', 'zero error, because the cylinder integrates the flow', 'an error equal to the valve overlap, always', 'a steady oscillation'], a: 1,
      why: 'Any remaining error keeps the valve open and the cylinder moving; it can only stop where the error is zero (apart from leakage and offsets).' },
    { q: 'An axis with K_v = 25 1/s follows a set point moving at 0.2 m/s. What is its following error?', answer: 8, unit: 'mm', tol: 0.02,
      why: 'e = v/K_v = 200 mm/s / 25 1/s = 8 mm.' },
    { q: 'Raising the loop gain on an axis with a soft oil column…', choices: ['makes it faster without limit', 'first makes it ring, then unstable', 'makes it better damped', 'has no effect on stability'], a: 1,
      why: 'The integrator and the lightly damped hydraulic resonance give a stability limit K_v < 2ζ_hω_h.' },
    { q: 'Halving the oil volume trapped between valve and cylinder allows a higher loop gain.', a: true,
      why: 'Stiffness k = βA²/V doubles, ω_h rises by √2, and so does the stability limit 2ζ_hω_h.' },
    { q: 'An axis has f_h = 20 Hz and ζ_h = 0.1. Its loop gain limit is about…', choices: ['12.6 1/s', '25.1 1/s', '41.9 1/s', '126 1/s'], a: 1,
      why: 'K_v,max = 4π × 0.1 × 20 = 25.1 1/s.' }
  ],
  problems: [
    { q: 'An axis has a hydraulic natural frequency of 8 Hz and a damping ratio of 0.25. What is the largest stable loop gain?', answer: 25.1, unit: '1/s', tol: 0.02,
      steps: ['$K_{v,\\text{max}} = 4\\pi \\times 0.25 \\times 8 = 25.1$ 1/s; a practical choice would be 12–17 1/s.'] },
    { q: 'A press axis must follow a set point moving at 60 mm/s with a lag of at most 2 mm, without feed-forward. What loop gain does it need?', answer: 30, unit: '1/s', tol: 0.02,
      steps: ['$K_v = v/e = 60/2 = 30$ 1/s. If the hydraulics cannot support that, add velocity feed-forward instead.'] }
  ],
  applications: [
    'Machine-tool and press axes positioning to hundredths of a millimetre.',
    'Flight-control actuators, whose loops run on the aircraft\'s flight-control computers.',
    'Rolling-mill gap control, holding strip thickness to micrometres at high speed.',
    'Motion simulators and fatigue test rigs following recorded road or flight signals.'
  ],
  history: 'Closed-loop hydraulic servomechanisms go back to ship steering engines of the 1860s and to turbine speed governors. The frequency-response theory of feedback came from Nyquist (1932) and Bode (1940) at Bell Labs, and was applied to hydraulic servos in the 1950s, when the stability limit set by the oil-column resonance became a standard design rule.',
  sim: 'dyn-servo'
},

{
  id: 'hydraulic-stiffness', parent: 'electrohydraulics', title: 'Hydraulic stiffness and natural frequency', level: 2,
  short: 'Trapped oil is a spring of stiffness βA²/V. A cylinder with both ports blocked and a load on its rod is a mass on that spring, with a natural frequency of typically 5–50 Hz — the number that limits how fast a hydraulic axis can be controlled.',
  keywords: ['hydraulic stiffness', 'oil spring', 'natural frequency', 'hydraulic resonance', 'bulk modulus', 'effective bulk modulus', 'trapped volume', 'mass-spring', 'blocked cylinder', 'pressure spike', 'hose volume', 'omega h'],
  prereq: ['bulk-modulus', 'hydraulic-cylinder', 'physics:simple-harmonic-motion'],
  related: ['servo-loop', 'valve-sizing-dynamics', 'air-in-oil', 'hoses-fittings', 'cushioning', 'wave-speed', 'physics:hookes-law', 'physics:damped-oscillations', 'pneumatics:pneumatic-spring'],
  body: `
Oil is stiff, but not rigid. Squeeze a trapped volume $V$ and its pressure rises by $\\Delta p = \\beta\\,\\Delta V/V$, where $\\beta$ is the effective [[bulk-modulus]] of the oil *and* whatever holds it. Trap oil under a piston of area $A$ and push the piston by $\\Delta x$: the volume shrinks by $A\\,\\Delta x$, and the pressure pushes back with $\\Delta F = A\\,\\Delta p$. The trapped oil is a spring ([[physics:hookes-law]]):

$$k = \\frac{\\beta A^2}{V}$$

Large areas and small volumes make stiff springs; long columns of oil and long hoses make soft ones.

### A cylinder with both ports blocked
With the valve centred, oil is trapped on both sides of the piston. A movement squeezes one side and relaxes the other, so the two columns act as springs in parallel:

$$k = \\beta\\left(\\frac{A_1^2}{V_1} + \\frac{A_2^2}{V_2}\\right)$$

where $V_1$ and $V_2$ include the oil in the lines up to the valve spool. The stiffness depends on where the piston is: very high near either end, where one volume is tiny, and lowest a little past mid-stroke — for a differential cylinder towards the rod end, since the annulus is the weaker side.

### Mass on an oil spring
A load of mass $m$ on that spring has a **hydraulic natural frequency**

$$\\omega_h = \\sqrt{\\frac{k}{m}}, \\qquad f_h = \\frac{1}{2\\pi}\\sqrt{\\frac{k}{m}}$$

as any mass on a spring ([[physics:simple-harmonic-motion]]). Typical values are 5–50 Hz: a few hertz for a crane boom or a long cylinder fed through hoses, 20–50 Hz for a machine-tool axis with the valve on the cylinder, over 100 Hz for small test actuators. It limits almost everything a controlled axis can do: the loop gain ([[servo-loop]]), how quickly a load can be accelerated without ringing — ramps lasting several periods, $3$–$5/f_h$, excite little oscillation — and how precisely a force can be held.

| 63/36 mm cylinder, 500 mm stroke, 0.3 L of line each side, $\\beta$ = 1.4 GPa, 1000 kg | 10 % stroke | 50 % | 62 % (softest) | 90 % |
|---|---|---|---|---|
| $V_1$ / $V_2$ (L) | 0.46 / 1.24 | 1.08 / 0.82 | 1.27 / 0.70 | 1.70 / 0.40 |
| Stiffness $k$ (kN/mm) | 34.8 | 20.1 | 19.6 | 23.2 |
| Natural frequency $f_h$ (Hz) | 29.7 | 22.6 | 22.3 | 24.3 |

### What sets β
Pure mineral oil has a bulk modulus of 1.5–1.8 GPa, lower when hot and higher under pressure. The *effective* value is lower: hoses swell (a hose can halve it), cylinder tubes stretch, and a fraction of a per cent of entrained air, especially at low pressure, softens the oil dramatically ([[air-in-oil]]). Designers commonly take 1.0–1.4 GPa for rigid piping and less with hoses. Mounting the valve on the cylinder, avoiding long hoses and bleeding the air out are the cheapest ways to a stiffer, faster axis.

### Stopping a moving load
The same spring sets the spike when a valve suddenly blocks a moving cylinder. The load's kinetic energy goes into the compressed oil, $\\tfrac12 m v^2 = \\tfrac12 k x^2$, and the peak force is $F = v\\sqrt{k m}$. The other chamber, decompressed by the same movement, usually falls to vapour pressure at once and stops helping, so the worst case is the compressed side's oil alone, with its own stiffness $k$ and area $A$:

$$\\Delta p = \\frac{v\\sqrt{k\\,m}}{A}$$

A 1000 kg load moving at 0.3 m/s, stopped on a 21 cm² annulus whose oil column is 7.5 kN/mm stiff, can add some 120 bar to the working pressure — which is why fast valves switching heavy loads need ramped commands, [[cushioning]] or cross-port relief valves with make-up checks that refill the cavitating side.

> [!warn] Pressure trapped in a blocked cylinder remains after the pump stops, and it can hold — or suddenly release — a load. Support loads mechanically and release trapped pressure before loosening any fitting; never feel for leaks by hand.
`,
  ideas: [
    'Trapped oil is a spring: k = βA²/V, stiffer with larger areas and smaller volumes.',
    'A blocked cylinder has two oil springs in parallel; it is softest a little past mid-stroke and stiff near the ends.',
    'Load mass on the oil spring gives the hydraulic natural frequency f_h = √(k/m)/2π, typically 5–50 Hz.',
    'Hoses, stretching tubes and entrained air lower the effective bulk modulus well below the oil\'s own 1.5–1.8 GPa.',
    'Stopping a moving load on the oil spring gives a spike Δp = v√(km)/A.'
  ],
  pitfalls: [
    'Oil is incompressible, so a blocked cylinder is rigid — Oil compresses about 0.7 % per 100 bar; with hoses and air the effective stiffness is lower still, and a heavy load on it oscillates at a few to a few tens of hertz.',
    'The cylinder is softest at mid-stroke — For equal areas, yes; for a differential cylinder the weaker annulus side moves the softest point towards the rod end, and line volumes shift it again.',
    'A bigger valve makes an axis faster — Speed of response is limited by the oil spring and the mass; a bigger valve adds flow, not stiffness, and can make control harder.'
  ],
  formulas: [
    {
      name: 'Stiffness of a trapped oil column',
      expr: 'k = beta*A^2/V', tex: 'k = \\dfrac{\\beta A^2}{V}',
      vars: {
        k: { name: 'hydraulic stiffness', q: 'stiffness', unit: 'N/mm' },
        beta: { name: 'effective bulk modulus', q: 'stress', unit: 'GPa', value: 1.4, tex: '\\beta' },
        A: { name: 'piston area', q: 'area', unit: 'cm²', value: 31.2 },
        V: { name: 'volume of trapped oil (cylinder and line)', q: 'volume', unit: 'L', value: 1.0 }
      },
      stories: { k: 'A piston of {A} traps {V} of oil with an effective bulk modulus of {beta}. How stiff is the oil spring?', V: 'An oil spring of {k} is wanted under a piston of {A} with β = {beta}. How much oil may be trapped?' }
    },
    {
      name: 'Stiffness of a blocked cylinder',
      expr: 'k = beta*(A1^2/V1 + A2^2/V2)', tex: 'k = \\beta\\left(\\dfrac{A_1^2}{V_1} + \\dfrac{A_2^2}{V_2}\\right)',
      vars: {
        k: { name: 'hydraulic stiffness', q: 'stiffness', unit: 'N/mm' },
        beta: { name: 'effective bulk modulus', q: 'stress', unit: 'GPa', value: 1.4, tex: '\\beta' },
        A1: { name: 'piston area', q: 'area', unit: 'cm²', value: 31.2, tex: 'A_1' },
        V1: { name: 'oil volume, cap side (with its line)', q: 'volume', unit: 'L', value: 1.08, tex: 'V_1' },
        A2: { name: 'annulus area', q: 'area', unit: 'cm²', value: 21.0, tex: 'A_2' },
        V2: { name: 'oil volume, rod side (with its line)', q: 'volume', unit: 'L', value: 0.82, tex: 'V_2' }
      },
      practice: { unknowns: ['k', 'V2'] },
      stories: { k: 'A cylinder with areas {A1} and {A2} holds {V1} and {V2} of oil on its two sides, β = {beta}. How stiff is it with both ports blocked?' }
    },
    {
      name: 'Hydraulic natural frequency',
      expr: 'fh = sqrt(k/m)/(2*pi)', tex: 'f_h = \\dfrac{1}{2\\pi}\\sqrt{\\dfrac{k}{m}}',
      vars: {
        fh: { name: 'hydraulic natural frequency', q: 'frequency', unit: 'Hz', tex: 'f_h' },
        k: { name: 'hydraulic stiffness', q: 'stiffness', unit: 'N/mm', value: 20000 },
        m: { name: 'moving mass', q: 'mass', unit: 'kg', value: 1000 }
      },
      practice: { unknowns: ['fh', 'm', 'k'] },
      stories: { fh: 'A {m} load sits on an oil spring of {k}. What is its natural frequency?', m: 'An oil spring of {k} must give a natural frequency of at least {fh}. What is the largest mass it can carry?' }
    },
    {
      name: 'Spike when a moving load is blocked',
      expr: 'dp = v*sqrt(k*m)/A', tex: '\\Delta p = \\dfrac{v\\sqrt{k\\,m}}{A}',
      vars: {
        dp: { name: 'pressure spike', q: 'pressure', unit: 'bar', tex: '\\Delta p' },
        v: { name: 'speed when the valve shuts', q: 'speed', unit: 'm/s', value: 0.3 },
        k: { name: 'stiffness of the oil in the compressed chamber', q: 'stiffness', unit: 'N/mm', value: 7500 },
        m: { name: 'moving mass', q: 'mass', unit: 'kg', value: 1000 },
        A: { name: 'area of the chamber being compressed', q: 'area', unit: 'cm²', value: 21.0 }
      },
      note: 'An instantaneous stop, with the other chamber cavitating and no friction or relief: the upper bound. Ramped valve commands, friction and relief valves lower it.',
      practice: { unknowns: ['dp', 'v'] },
      stories: { dp: 'A {m} load moving at {v} is stopped when a valve blocks the cylinder; the trapped oil on its {A} side has a stiffness of {k}. How high does the pressure spike?', v: 'A {m} load on an oil spring of {k} acting on {A} may see at most {dp} of spike. How fast may it move when the valve shuts?' }
    }
  ],
  examples: [
    {
      title: 'The natural frequency of an axis',
      q: 'A 63/36 mm cylinder with 500 mm stroke carries 1000 kg; each side has 0.3 L of oil in its line, and β = 1.4 GPa. What is the natural frequency at mid-stroke?',
      steps: [
        'Areas: $A_1 = 31.2$ cm², $A_2 = 21.0$ cm².',
        'Volumes at mid-stroke: $V_1 = 31.2\\times10^{-4} \\times 0.25 + 0.3\\times10^{-3} = 1.08$ L; $V_2 = 21.0\\times10^{-4} \\times 0.25 + 0.3\\times10^{-3} = 0.82$ L.',
        '$k = 1.4\\times10^9 \\left(\\dfrac{(31.2\\times10^{-4})^2}{1.08\\times10^{-3}} + \\dfrac{(21.0\\times10^{-4})^2}{0.82\\times10^{-3}}\\right) = 2.0\\times10^7$ N/m $= 20$ kN/mm.',
        '$f_h = \\sqrt{2.0\\times10^7/1000}/2\\pi = 22.6$ Hz.'
      ],
      a: 'About 22.6 Hz — and a little lower, 22.3 Hz, at 62 % of the stroke, the softest point.'
    },
    {
      title: 'A valve slams on a moving load',
      q: 'The same load moves out at 0.3 m/s when the valve centres instantly. How high can the rod-side pressure spike?',
      steps: [
        'The cap side is decompressed by the movement and soon cavitates, so take the rod side alone: $k_2 = \\beta A_2^2/V_2 = 1.4\\times10^9 \\times (21.0\\times10^{-4})^2/0.82\\times10^{-3} = 7.5\\times10^6$ N/m.',
        '$F = v\\sqrt{k_2 m} = 0.3\\sqrt{7.5\\times10^6 \\times 1000} = 2.6\\times10^4$ N.',
        '$\\Delta p = F/A_2 = 2.6\\times10^4/21\\times10^{-4} = 1.24\\times10^7$ Pa $\\approx 124$ bar, on top of the trapped pressure.',
        'Friction and the brief help of the cap side make the real spike somewhat lower; a command ramped over 50–100 ms, or relief valves with make-up checks, keep both sides in check.'
      ],
      a: 'Up to about 120 bar above the trapped pressure, with the cap side cavitating.'
    }
  ],
  quiz: [
    { q: 'Where along its stroke is a blocked differential cylinder softest?', choices: ['fully retracted', 'near mid-stroke, a little towards the rod end', 'fully extended', 'the same everywhere'], a: 1,
      why: 'Near either end one volume is tiny and very stiff. The minimum lies near the middle, shifted towards the rod end because the annulus side is the weaker spring.' },
    { q: 'Replacing 2 m of steel tube between valve and cylinder by hose of the same bore lowers the natural frequency.', a: true,
      why: 'A hose swells under pressure, lowering the effective bulk modulus of that volume, and the stiffness and ω_h fall with it.' },
    { q: 'An oil spring of 5000 N/mm carries 2000 kg. What is its natural frequency?', answer: 7.96, unit: 'Hz', tol: 0.02,
      why: 'f = √(5×10⁶/2000)/2π = 50/2π = 7.96 Hz.' },
    { q: 'Doubling the moving mass changes the natural frequency by a factor of…', choices: ['2', '√2', '1/√2', '1/2'], a: 2,
      why: 'f_h ∝ 1/√m: twice the mass, 0.71 times the frequency.' },
    { q: 'Why is the effective bulk modulus of a real system lower than that of pure oil?', choices: ['hoses and tubes stretch, and entrained air compresses', 'oil gets stiffer when hot', 'the pump adds flow', 'the relief valve is open'], a: 0,
      why: 'Every compliance in series with the oil — hose walls, tube walls, seals, air bubbles — adds to the oil\'s own compressibility.' }
  ],
  problems: [
    { q: 'Oil with β = 1.2 GPa is trapped under a 50 cm² piston; the trapped volume is 2 L. What is the stiffness, in N/mm?', answer: 15000, unit: 'N/mm', tol: 0.02,
      steps: ['$k = \\beta A^2/V = 1.2\\times10^9 \\times (50\\times10^{-4})^2/2\\times10^{-3} = 1.5\\times10^7$ N/m $= 15\\,000$ N/mm.'] },
    { q: 'An axis must have a natural frequency of at least 15 Hz; its oil spring is 12 000 N/mm. What is the largest moving mass?', answer: 1351, unit: 'kg', tol: 0.02,
      steps: ['$m = k/(2\\pi f)^2 = 1.2\\times10^7/(2\\pi \\times 15)^2 = 1.2\\times10^7/8883 = 1351$ kg.'] }
  ],
  applications: [
    'Designing servo axes: valve on the cylinder, short rigid lines, and the natural frequency checked along the stroke.',
    'Machine tools and presses, where hydraulic stiffness sets how much a tool deflects under a cutting or forming load.',
    'Mobile machines, whose long hoses and heavy booms give low natural frequencies and bouncing loads.',
    'Active suspensions and vibration tables, where the oil spring is part of the design.'
  ],
  history: 'The oil-column resonance became a design issue with the first hydraulic servomechanisms for gun turrets and aircraft in the 1940s. Herbert Merritt\'s 1967 book on hydraulic control systems set out the stiffness and natural-frequency analysis still used, with the load-pressure equations and the bulk-modulus corrections for hoses and air.',
  sim: 'dyn-oil-spring'
},

{
  id: 'valve-sizing-dynamics', parent: 'electrohydraulics', title: 'Valve sizing for motion', level: 3,
  short: 'Choosing a control valve from the move the machine must make: peak speed and acceleration from the motion profile, load pressure from mass and forces, what is left of the supply for the valve, and the rated flow that gives — with a third of the pressure kept in reserve.',
  keywords: ['valve sizing', 'motion profile', 'trapezoidal move', 'peak speed', 'acceleration', 'load pressure', 'rated flow', 'nominal flow', 'pressure drop', 'two-thirds rule', '2/3 ps', 'force margin', 'overrunning load', 'servo axis design'],
  prereq: ['electrohydraulic-control', 'hydraulic-cylinder', 'orifice-equation', 'cylinder-speed'],
  related: ['hydraulic-stiffness', 'servo-loop', 'area-ratio', 'line-sizing', 'proportional-valves', 'servo-valves', 'counterbalance-valve', 'physics:newtons-second-law'],
  body: `
A control valve is chosen not from the catalogue but from the move the machine must make. It must pass the flow for the highest speed while leaving enough pressure to push the load, accelerate the mass — and still have something left to control with.

### 1. The motion profile
Most moves are trapezoids: accelerate for $t_a$, run at constant speed, decelerate for $t_a$. To cover a stroke $s$ in a time $T$:

$$v_\\text{max} = \\frac{s}{T - t_a}, \\qquad a = \\frac{v_\\text{max}}{t_a}$$

Shorter ramps lower the peak speed but raise the acceleration. Each ramp should last several periods of the hydraulic natural frequency ([[hydraulic-stiffness]]), or the load rings.

### 2. Forces and load pressure
The cylinder must supply the external force, friction and the inertia force ([[physics:newtons-second-law]]):

$$p_L = \\frac{m\\,a + F}{A}$$

$p_L$ is the **load pressure**, the pressure difference across the piston. The worst moment is usually the end of the acceleration, when full speed and full inertia force coincide.

### 3. What is left for the valve
The supply is shared between the load and the valve. For a four-way valve feeding a symmetric (double-rod) cylinder, the drop across both lands together is $\\Delta p_v = p_s - p_L$, less any tank-line pressure. A valve's rated flow $Q_N$ is quoted at a rated drop $\\Delta p_N$ — 10 bar for most proportional valves (5 per land), 70 bar for servo and servo-proportional valves (35 per land) — and the flow grows with the square root of the drop ([[orifice-equation]]), so the **rated flow needed** is

$$Q_N = Q\\,\\sqrt{\\frac{\\Delta p_N}{\\Delta p_v}}, \\qquad Q = v_\\text{max}\\,A$$

Take the next size up with 10–20 % in reserve, and check the valve's power limit: at large drops, flow forces can push a direct-operated spool back.

### 4. The ⅔ rule
The power a valve can deliver to the load, $p_L Q$, is greatest when $p_L = \\tfrac23 p_s$: two thirds of the supply at the load and one third across the valve. That is also a sensible **design limit**: keeping the peak load pressure below about $\\tfrac23 p_s$ leaves a third of the supply for the valve to control acceleration and disturbances. An axis sized so that $p_L$ reaches $p_s$ has nothing left: it can move, but it cannot be controlled.

### 5. Decelerating and overrunning loads
When the load decelerates, or pulls — a lowering weight, a press returning — $p_L$ turns negative: the valve must hold the load back on its outlet land, and the drop across the valve *grows*. Check that the outlet pressure stays within its rating and that the inlet side does not fall to vapour pressure, which happens when $p_L$ falls below $-p_s$. With differential cylinders the pressures change by the area ratio ([[area-ratio]]), and a valve with a matching asymmetric spool (2:1) is often used; a [[counterbalance-valve]] holds an overrunning load safely.

| Check | Rule of thumb |
|---|---|
| Peak load pressure | $p_L \\le \\tfrac23\\,p_s$ |
| Valve size | $Q_N$ from the peak flow and drop, plus 10–20 % |
| Ramp time | several periods of $f_h$ |
| Valve bandwidth | at least 2–3 times $f_h$ for a servo axis |
| Line velocity | pressure lines 3–6 m/s ([[line-sizing]]) |

> [!warn] Sizing is done on paper; commissioning is done on a live machine. Keep people out of the reach of an axis being tuned, start with low gains and pressures, and make sure emergency stops and load-holding valves work before the first move.
`,
  ideas: [
    'Start from the motion: stroke, time and ramps give the peak speed and acceleration.',
    'Load pressure p_L = (ma + F)/A peaks at the end of the acceleration, together with the flow.',
    'What the load does not use is the valve\'s drop; the rated flow needed is Q√(Δp_N/Δp_v).',
    'Keep p_L below about ⅔p_s: that is where the valve delivers most power and still has pressure to control with.',
    'Decelerating or overrunning loads make p_L negative; check for over-pressure at the outlet and cavitation at the inlet.'
  ],
  pitfalls: [
    'Choose the valve for the flow at its rated drop — The actual drop is p_s − p_L; with 90 bar available, a valve rated at 70 bar passes more than its rated flow, and one rated at 10 bar far more (if its power limit allows).',
    'Using the whole supply pressure for force gives the strongest axis — With p_L = p_s nothing is left across the valve: the axis cannot accelerate or reject disturbances.',
    'The worst case is at constant speed — It is usually at the end of the acceleration, when the flow is at its peak and the inertia force still acts.'
  ],
  formulas: [
    {
      name: 'Peak speed of a trapezoidal move',
      expr: 'vmax = s/(T - ta)', tex: 'v_\\text{max} = \\dfrac{s}{T - t_a}',
      vars: {
        vmax: { name: 'peak speed', q: 'speed', unit: 'm/s', tex: 'v_\\text{max}' },
        s: { name: 'distance moved', q: 'length', unit: 'mm', value: 300 },
        T: { name: 'time for the move', q: 'time', unit: 's', value: 0.8 },
        ta: { name: 'ramp time at each end', q: 'time', unit: 's', value: 0.15, tex: 't_a' }
      },
      note: 'Equal acceleration and deceleration times; t_a = T/2 gives a triangular profile.',
      stories: { vmax: 'An axis must move {s} in {T}, with ramps of {ta} at each end. What is its peak speed?', T: 'An axis with a top speed of {vmax} and ramps of {ta} must move {s}. How long does it take?' }
    },
    {
      name: 'Load pressure',
      expr: 'pL = (m*acc + F)/A', tex: 'p_L = \\dfrac{m\\,a + F}{A}',
      vars: {
        pL: { name: 'load pressure (difference across the piston)', q: 'pressure', unit: 'bar', signed: true, tex: 'p_L' },
        m: { name: 'moving mass', q: 'mass', unit: 'kg', value: 800 },
        acc: { name: 'acceleration', q: 'accel', unit: 'm/s²', value: 3.08, signed: true, tex: 'a' },
        F: { name: 'external force against the motion', q: 'force', unit: 'kN', value: 15, signed: true },
        A: { name: 'piston area', q: 'area', unit: 'cm²', value: 34.4 }
      },
      note: 'Add seal friction to F. Negative values mean the load drives the cylinder and the valve must hold it back.',
      practice: { unknowns: ['pL', 'A'] },
      stories: { pL: 'A {m} load is accelerated at {acc} against a force of {F} by a cylinder of {A}. What load pressure is needed?', A: 'A {m} mass must be accelerated at {acc} against {F} with a load pressure of {pL}. What piston area is needed?' }
    },
    {
      name: 'Rated valve flow needed',
      expr: 'QN = Q*sqrt(dpN/dpv)', tex: 'Q_N = Q\\sqrt{\\dfrac{\\Delta p_N}{\\Delta p_v}}',
      vars: {
        QN: { name: 'rated flow of the valve', q: 'flowrate', unit: 'L/min', tex: 'Q_N' },
        Q: { name: 'peak flow to the cylinder', q: 'flowrate', unit: 'L/min', value: 95.1 },
        dpN: { name: 'rated pressure drop of the valve (both lands)', q: 'pressure', unit: 'bar', value: 70, tex: '\\Delta p_N' },
        dpv: { name: 'drop available across the valve (p_s − p_L)', q: 'pressure', unit: 'bar', value: 89.2, tex: '\\Delta p_v' }
      },
      practice: { unknowns: ['QN', 'dpv'] },
      stories: { QN: 'A cylinder needs {Q} at its peak, with {dpv} left across the valve. What rated flow must a valve rated at {dpN} have?', dpv: 'A valve rated {QN} at {dpN} must pass {Q}. How much pressure drop does that take?' }
    }
  ],
  examples: [
    {
      title: 'Sizing a servo valve for a move',
      q: 'An 800 kg slide must move 300 mm in 0.8 s, with 0.15 s ramps, against a steady 15 kN. The cylinder is a double-rod 80/45 mm ($A$ = 34.4 cm²), the supply 140 bar. Size a servo valve (rated at 70 bar).',
      steps: [
        'Profile: $v_\\text{max} = 0.3/(0.8 - 0.15) = 0.46$ m/s; $a = 0.46/0.15 = 3.08$ m/s².',
        'Load pressure at the end of the acceleration: $p_L = (800 \\times 3.08 + 15\\,000)/34.4\\times10^{-4} = 5.08\\times10^6$ Pa $= 50.8$ bar — 36 % of the supply, within the ⅔ rule.',
        'Flow: $Q = 0.46 \\times 34.4\\times10^{-4} = 1.59\\times10^{-3}$ m³/s $= 95$ L/min.',
        'Drop across the valve: $140 - 50.8 = 89.2$ bar.',
        'Rated flow needed: $Q_N = 95.1\\sqrt{70/89.2} = 84$ L/min; with a 10–20 % reserve, a 100 L/min valve.'
      ],
      a: 'About 84 L/min at 70 bar is needed; choose a 100 L/min servo or servo-proportional valve.'
    },
    {
      title: 'Braking the same slide',
      q: 'On the return stroke the 15 kN force helps the motion. What is the load pressure during the deceleration, and is the valve still in control?',
      steps: [
        'The force now drives the slide, and the deceleration adds to it: $p_L = (800 \\times (-3.08) - 15\\,000)/34.4\\times10^{-4} = -50.8$ bar.',
        'The valve must hold the slide back: its drop is $140 - (-50.8) = 190.8$ bar, larger than on the way out.',
        'Since $p_L = -50.8$ bar is well above $-p_s = -140$ bar, the inlet chamber stays above vapour pressure: the valve keeps control.'
      ],
      a: 'p_L ≈ −51 bar; the valve brakes the load with a 191 bar drop and no cavitation.'
    }
  ],
  quiz: [
    { q: 'At which moment of a trapezoidal move is the needed valve size usually largest?', choices: ['at the start of the acceleration', 'at the end of the acceleration', 'in the middle of the deceleration', 'at standstill'], a: 1,
      why: 'Full speed (flow) and full inertia force (load pressure, leaving the least drop for the valve) coincide there.' },
    { q: 'A cylinder needs 60 L/min with 40 bar across the valve. What rated flow must a valve rated at 10 bar have?', answer: 30, unit: 'L/min', tol: 0.02,
      why: 'Q_N = 60 × √(10/40) = 30 L/min: with four times its rated drop the valve passes twice its rated flow.' },
    { q: 'Sizing an axis so that the peak load pressure equals the supply pressure makes the best use of the pump.', a: false,
      why: 'Nothing is then left across the valve, so it cannot accelerate the load or correct errors. Aim for p_L ≤ ⅔p_s.' },
    { q: 'A move of 500 mm in 1.25 s with 0.25 s ramps has a peak speed of…', choices: ['0.4 m/s', '0.5 m/s', '0.625 m/s', '0.33 m/s'], a: 1,
      why: 'v_max = s/(T − t_a) = 0.5/(1.25 − 0.25) = 0.5 m/s.' },
    { q: 'While a horizontal mass decelerates with no external force, the pressure drop across the valve…', choices: ['falls, because the load pushes the oil', 'grows: the load pressure is negative, so p_s − p_L exceeds p_s', 'is zero', 'equals the tank pressure'], a: 1,
      why: 'Decelerating, the mass drives the piston; p_L < 0 and the valve throttles more than the whole supply pressure across its lands.' }
  ],
  problems: [
    { q: 'An axis must move 400 mm in 1.2 s with 0.2 s ramps. What is its peak speed?', answer: 0.4, unit: 'm/s', tol: 0.02,
      steps: ['$v_\\text{max} = 0.4/(1.2 - 0.2) = 0.4$ m/s; the acceleration is $0.4/0.2 = 2$ m/s².'] },
    { q: 'A 2 t mass is accelerated at 1.5 m/s² against 40 kN by a cylinder of 50 cm². What is the load pressure?', answer: 86, unit: 'bar', tol: 0.02,
      steps: ['$p_L = (2000 \\times 1.5 + 40\\,000)/50\\times10^{-4} = 8.6\\times10^6$ Pa $= 86$ bar.', 'With a 140 bar supply that is 61 % — just inside the ⅔ rule.'] }
  ],
  applications: [
    'Specifying the valve, cylinder and supply pressure of injection-moulding, press and machine-tool axes.',
    'Test-rig design, where the demanded motion or force spectrum sets the valve flow and bandwidth.',
    'Converting a machine from on/off to proportional control, with the valve chosen from the cycle times.',
    'Checking that mobile machine functions can brake overrunning loads without cavitation.'
  ],
  history: 'The ⅔ rule comes from the load–flow characteristic of the four-way servo valve, worked out in the 1950s as servo valves spread from aircraft into industry. Valve catalogues standardised rated flows at 70 bar (servo) and 10 bar (proportional) drops, so that one square-root law converts every rating to the drop a machine actually has.',
  sim: 'dyn-profile'
}

);
