/* HYPER-HYDRAULICS · content/channels.js — Open Channels and Water.
 * Topics: channel-flow (open channels, Manning, Froude, specific energy, the hydraulic jump, gradually
 * varied flow, weirs and flumes, sluice gates and culverts) and water-resources (dams and spillways,
 * groundwater, water supply, stormwater and floods, irrigation). Simulations in sims/channels.js (chan-*). */
Hyper.add(

/* ====================================================================== OPEN-CHANNEL FLOW */
{
  id: 'open-channel-basics', parent: 'channel-flow', title: 'Open-channel flow', level: 1,
  short: 'Flow with a free surface open to the air — rivers, canals, sewers, gutters — driven by gravity alone. The depth is free to adjust, and the geometry of the wetted section (area, wetted perimeter, hydraulic radius, top width) decides how the water flows.',
  keywords: ['open channel', 'free surface', 'canal', 'river', 'sewer', 'hydraulic radius', 'wetted perimeter', 'top width', 'hydraulic depth', 'uniform flow', 'varied flow', 'trapezoidal channel', 'float gauging', 'channel Reynolds number'],
  prereq: ['flow-rate', 'continuity-equation', 'energy-equation'],
  related: ['manning-equation', 'froude-number', 'specific-energy', 'non-circular-ducts', 'hgl-egl', 'stormwater-floods', 'reynolds-number-pipes'],
  body: `
Water in a full pipe is pushed along by pressure. Water in a channel is pulled along by gravity: its surface is open to the air, so the pressure there is zero gauge everywhere, and the flow chooses its own depth. For the same discharge a rough, gently sloping canal runs deep and slow, a smooth, steep chute shallow and fast. That freedom makes channels richer than pipes — the depth is itself an unknown, and a weir, a bridge pier or a change of slope can reshape the water surface for kilometres upstream. Sewers and culverts flowing part-full are open channels too, even though they have a roof.

### Describing the section
Everything depends on the shape of the wetted cross-section: the **flow area** $A$; the **wetted perimeter** $P$, the length of bed and wall in contact with the water (the free surface is left out — air barely drags on it); the **top width** $T$ at the surface. From them come two lengths that appear in every formula:

$$R = \\frac{A}{P} \\qquad D = \\frac{A}{T}$$

The **hydraulic radius** $R$ is the area carried per unit of rubbing boundary — the efficiency of the section; the **hydraulic depth** $D$ is its average depth, used in the [[froude-number]]. For a trapezoid of bottom width $b$, depth $y$ and side slopes of $z$ horizontal to 1 vertical,

$$A = (b + z y)\\,y, \\qquad P = b + 2y\\sqrt{1 + z^2}, \\qquad T = b + 2 z y$$

| Section | $A$ | $P$ | $R$ |
|---|---|---|---|
| Rectangle, width $b$ | $b y$ | $b + 2y$ | $\\dfrac{b y}{b + 2y}$ |
| Trapezoid, side slope $z$ | $(b + z y)y$ | $b + 2y\\sqrt{1+z^2}$ | $A/P$ |
| V-ditch, side slope $z$ | $z y^2$ | $2y\\sqrt{1+z^2}$ | $\\dfrac{z y}{2\\sqrt{1+z^2}}$ |
| Very wide channel | $b y$ | $\\approx b$ | $\\approx y$ |
| Pipe, full or half full | — | — | $D/4$ |

A pipe's hydraulic diameter $4R$ links channels to [[non-circular-ducts]].

### Kinds of flow
- **Steady or unsteady** — does the depth at one place change with time? A flood wave is unsteady; a canal behind a fixed gate is steady.
- **Uniform or varied** — does it change along the channel? Uniform flow, with gravity's pull exactly balanced by friction, sets in along long straight channels at the *normal depth* ([[manning-equation]]). Near structures the flow is *gradually varied* (a backwater curve over kilometres, [[gradually-varied-flow]]) or *rapidly varied* (a [[hydraulic-jump]], the plunge over a weir).
- **Subcritical or supercritical** — slower or faster than a surface wave; the [[froude-number]] decides, and with it whether the flow is controlled from downstream or upstream.
- **Laminar or turbulent** — with $\\mathrm{Re} = VR/\\nu$, laminar below about 500 (the pipe's limit divided by four, since $D_h = 4R$) and fully turbulent above about 2000. Real channels run at $10^5$–$10^7$; only a thin film of rain on a pavement is laminar.

### Pressure, energy and velocity
Where the streamlines are straight and parallel the pressure is hydrostatic, $p = \\rho g h$ below the surface, so the water surface *is* the hydraulic grade line and the total head is $z + y + V^2/2g$ ([[hgl-egl]]). The velocity is not uniform: zero on the bed and banks, fastest just below the surface in mid-stream. The mean is close to the speed at 0.6 of the depth below the surface and about 0.8–0.85 of the surface speed.

> [!tip] A field estimate: time a stick floating 20 m down the middle of a stream, take about 0.85 of its speed as the mean, and multiply by the area measured with a pole. Expect ±20 %; a current meter or an acoustic Doppler profiler does far better.

> [!warn] Moving water is much stronger than it looks: knee-deep water at 2 m/s can sweep an adult off their feet, and concrete channels and culverts have smooth, steep sides with nothing to grip. Never enter a channel, sewer or culvert that may carry flow, and treat any closed conduit as a confined space — toxic gases, sudden rises and no easy way out.
`,
  ideas: [
    'Gravity drives a channel; the free surface is at atmospheric pressure and the depth adjusts itself to the flow.',
    'The hydraulic radius R = A/P is the area carried per unit of rubbing boundary; for a wide channel R ≈ y.',
    'Flow is classified as steady or unsteady, uniform or varied, subcritical or supercritical — and in practice it is always turbulent.',
    'With straight streamlines the pressure is hydrostatic, so the water surface is the hydraulic grade line.',
    'The mean velocity is about 0.8–0.85 of the surface velocity, and close to the velocity at 0.6 of the depth.'
  ],
  pitfalls: [
    'The wetted perimeter includes the water surface — Only the bed and walls in contact with the water rub on it; the air above offers almost no resistance, so the surface width is left out of P.',
    'A deeper section always carries water faster — Speed depends on the hydraulic radius, slope and roughness; a deep narrow slot has a large wetted perimeter and can be slower than a wider, shallower section of the same area.',
    'A float shows the mean speed of a river — Friction slows the water near the bed and banks; the mean is only about 80–85 % of the surface speed in mid-stream.'
  ],
  formulas: [
    {
      name: 'Hydraulic radius',
      expr: 'R = A/P', tex: 'R = \\dfrac{A}{P}',
      vars: {
        R: { name: 'hydraulic radius', q: 'length', unit: 'm' },
        A: { name: 'flow area', q: 'area', unit: 'm²', value: 4.56 },
        P: { name: 'wetted perimeter', q: 'length', unit: 'm', value: 6.33 }
      },
      stories: { R: 'A canal section has a flow area of {A} and a wetted perimeter of {P}. What is its hydraulic radius?' }
    },
    {
      name: 'Area of a trapezoidal channel',
      expr: 'A = (b + z*y)*y', tex: 'A = (b + z\\,y)\\,y',
      vars: {
        A: { name: 'flow area', q: 'area', unit: 'm²' },
        b: { name: 'bottom width', q: 'length', unit: 'm', value: 2 },
        z: { name: 'side slope z (horizontal per 1 vertical)', value: 1.5, min: 0, max: 4 },
        y: { name: 'flow depth', q: 'length', unit: 'm', value: 1.2 }
      },
      stories: { A: 'A canal {b} wide at the bottom, with side slopes of {z} horizontal to 1 vertical, runs {y} deep. What is the flow area?', y: 'A canal {b} wide at the bottom with side slopes of {z} to 1 has a flow area of {A}. How deep is the water?' }
    },
    {
      name: 'Wetted perimeter of a trapezoidal channel',
      expr: 'P = b + 2*y*sqrt(1 + z^2)', tex: 'P = b + 2y\\sqrt{1 + z^2}',
      vars: {
        P: { name: 'wetted perimeter', q: 'length', unit: 'm' },
        b: { name: 'bottom width', q: 'length', unit: 'm', value: 2 },
        y: { name: 'flow depth', q: 'length', unit: 'm', value: 1.2 },
        z: { name: 'side slope z (horizontal per 1 vertical)', value: 1.5, min: 0, max: 4 }
      }
    },
    {
      name: 'Reynolds number of a channel',
      expr: 'Re = V*R/nu', tex: '\\mathrm{Re} = \\dfrac{V R}{\\nu}',
      vars: {
        Re: { name: 'Reynolds number (on R)', tex: '\\mathrm{Re}' },
        V: { name: 'mean velocity', q: 'speed', unit: 'm/s', value: 1.1 },
        R: { name: 'hydraulic radius', q: 'length', unit: 'm', value: 0.72 },
        nu: { name: 'kinematic viscosity', q: 'kinvisc', unit: 'mm²/s', value: 1.0 }
      },
      note: 'Based on R, laminar flow ends near Re = 500 (a quarter of the pipe value, since pipes use D = 4R) and the flow is fully turbulent above about 2000. Water at 20 °C has ν ≈ 1.0 mm²/s.',
      stories: { Re: 'Water ({nu}) flows at {V} in a channel with a hydraulic radius of {R}. What is the Reynolds number?' }
    }
  ],
  examples: [
    {
      title: 'A trapezoidal canal',
      q: 'An earth canal has a bottom width of 2 m and side slopes of 1.5 horizontal to 1 vertical. It runs 1.2 m deep carrying 5 m³/s. Find the area, wetted perimeter, hydraulic radius, hydraulic depth, mean velocity and Reynolds number ($\\nu = 1.0$ mm²/s).',
      steps: [
        '$A = (2 + 1.5 \\times 1.2) \\times 1.2 = 4.56$ m².',
        '$P = 2 + 2 \\times 1.2\\sqrt{1 + 1.5^2} = 2 + 4.33 = 6.33$ m, so $R = 4.56/6.33 = 0.721$ m.',
        '$T = 2 + 2 \\times 1.5 \\times 1.2 = 5.6$ m, so $D = 4.56/5.6 = 0.814$ m.',
        '$V = Q/A = 5/4.56 = 1.10$ m/s.',
        '$\\mathrm{Re} = VR/\\nu = 1.10 \\times 0.721/10^{-6} = 7.9\\times10^5$ — fully turbulent. (For later: $\\mathrm{Fr} = 1.10/\\sqrt{9.81 \\times 0.814} = 0.39$, subcritical.)'
      ],
      a: 'A = 4.56 m², P = 6.33 m, R = 0.72 m, D = 0.81 m, V = 1.10 m/s, Re ≈ 7.9 × 10⁵ (turbulent).'
    },
    {
      title: 'Gauging a stream with a stick',
      q: 'A stick floats 20 m down the middle of a stream in 25 s. The stream is roughly rectangular, 4 m wide and 0.6 m deep. Estimate the discharge.',
      steps: [
        'Surface speed: $20/25 = 0.80$ m/s.',
        'Mean speed: about $0.85 \\times 0.80 = 0.68$ m/s.',
        'Area: $4 \\times 0.6 = 2.4$ m², so $Q \\approx 0.68 \\times 2.4 = 1.6$ m³/s.'
      ],
      a: 'About 1.6 m³/s, to perhaps ±20 %.'
    }
  ],
  quiz: [
    { q: 'A rectangular channel 4 m wide flows 1 m deep. What is its hydraulic radius?', answer: 0.667, unit: 'm',
      why: '$A = 4$ m², $P = 4 + 2 \\times 1 = 6$ m, so $R = 4/6 = 0.667$ m.' },
    { q: 'Which part of the boundary is left out of the wetted perimeter?', choices: ['the bed', 'the side walls below the surface', 'the free surface', 'nothing: all of it counts'], a: 2,
      why: 'Only surfaces that rub on the water count. The air above the free surface exerts almost no shear.' },
    { q: 'Rivers and canals are usually in laminar flow because they move slowly.', a: false,
      why: 'Even 0.1 m/s with R = 0.5 m gives Re = 5 × 10⁴, far above the laminar limit of about 500. Only thin sheets of water on paving are laminar.' },
    { q: 'In a straight channel, the gauge pressure on the bed under 1.5 m of water is about…', choices: ['zero, since the channel is open to the air', '15 kPa', '1.5 bar', 'impossible to say without the velocity'], a: 1,
      why: 'With straight streamlines the pressure is hydrostatic: ρgy = 1000 × 9.81 × 1.5 ≈ 14.7 kPa.' },
    { q: 'For the same flow area, which open section has the largest hydraulic radius?', choices: ['a half-full circular pipe', 'a slot 0.5 m wide and 2 m deep', 'a square', 'a very wide, shallow sheet'], a: 0,
      why: 'The semicircle has the least wetted perimeter for its area (R = r/2). Among trapezoids the best is half a hexagon, among rectangles one twice as wide as it is deep.' }
  ],
  problems: [
    { q: 'A 1.0 m diameter pipe flows exactly half full. What is its hydraulic radius?', answer: 0.25, unit: 'm', tol: 0.02,
      steps: ['$A = \\pi D^2/8 = 0.393$ m², $P = \\pi D/2 = 1.571$ m.', '$R = 0.393/1.571 = 0.25$ m $= D/4$ — the same as when it runs full.'] },
    { q: 'A V-shaped roadside ditch with side slopes of 3 horizontal to 1 vertical runs 0.3 m deep. What is its flow area?', answer: 0.27, unit: 'm²', tol: 0.02,
      steps: ['$A = z y^2 = 3 \\times 0.3^2 = 0.27$ m².'] }
  ],
  applications: ['Irrigation and navigation canals, and the headraces and tailraces of hydropower plants.', 'Sewers and storm drains, designed as open channels flowing part-full.', 'River engineering: flood levels, bridges, bank protection.', 'Roof gutters, road drainage and spillway chutes.'],
  history: 'Canals carried water across Mesopotamia more than six thousand years ago, and Roman aqueducts ran as open channels for tens of kilometres at gradients of a few decimetres per kilometre, set out with water levels. A science of channel flow began only in the eighteenth century, with Chézy\'s resistance formula of 1769.',
  sim: 'chan-manning'
},

{
  id: 'manning-equation', parent: 'channel-flow', title: 'The Manning equation', level: 2,
  short: 'The empirical law of uniform flow in channels: the velocity grows with the hydraulic radius to the power 2/3 and with the square root of the slope, and falls with the roughness n. With it engineers find the normal depth of a canal or the capacity of a sewer.',
  keywords: ['Manning', 'Manning n', 'roughness coefficient', 'Chezy', 'Chézy', 'Strickler', 'Gauckler', 'normal depth', 'uniform flow', 'conveyance', 'bed shear stress', 'channel capacity', 'best hydraulic section', 'part-full pipe'],
  prereq: ['open-channel-basics', 'darcy-weisbach', 'non-circular-ducts'],
  related: ['gradually-varied-flow', 'froude-number', 'hazen-williams', 'roughness-ageing', 'stormwater-floods', 'friction-factor', 'culverts-sluice'],
  body: `
Down a long straight channel of constant section the water eventually settles at a depth where nothing changes any more from one section to the next: **uniform flow**. The weight of the water pulls it downhill and friction on the bed and banks holds it back, exactly in balance. Over a length $L$ the component of weight along a slope $S$ is $\\rho g A L S$, and the friction force is $\\tau_0 P L$, so the mean shear stress on the boundary is

$$\\tau_0 = \\rho g R S$$

That balance is exact, and useful on its own: it says whether a sandy bed will scour (fine sand moves at a few pascals; gravel and grass linings stand tens of pascals). What it does not say is how fast the water goes.

### From Chézy to Manning
Turbulent friction grows with the square of the velocity, $\\tau_0 \\propto \\rho V^2$, so $V \\propto \\sqrt{RS}$ — Chézy's formula of 1769:

$$V = C\\sqrt{R S}$$

The coefficient $C$ is not constant, though: it grows with the size of the channel and falls with roughness. Fitting a great many river and canal measurements, nineteenth-century engineers found $C \\approx R^{1/6}/n$, which gives the **Manning** (or Gauckler–Manning–Strickler) equation:

$$V = \\frac{1}{n} R^{2/3} S^{1/2}, \\qquad Q = \\frac{1}{n} A R^{2/3} S^{1/2}$$

in SI units (V in m/s, R in m). Strictly $n$ has units of $\\mathrm{s/m^{1/3}}$, but it is always quoted as a bare number; in US customary units the formula carries 1.49/n instead of 1/n, and European practice often writes $k_{St} = 1/n$.

| Channel surface | Manning $n$ |
|---|---|
| PVC, glass, smooth plastic pipe | 0.009–0.011 |
| Trowelled concrete | 0.011–0.013 |
| Formed or precast concrete (a usual design value 0.013) | 0.013–0.015 |
| Shotcrete, brickwork | 0.015–0.020 |
| Corrugated metal pipe | 0.022–0.027 |
| Earth canal, clean and straight | 0.018–0.025 |
| Earth canal with grass and some weeds | 0.025–0.035 |
| Jagged rock cut | 0.035–0.045 |
| Natural stream, clean and straight | 0.025–0.035 |
| Natural stream, winding, with pools and weeds | 0.035–0.050 |
| Mountain stream with boulders | 0.040–0.070 |
| Floodplain with brush or trees | 0.05–0.15 |

### Normal depth
For a given flow, slope and lining, the depth of uniform flow is the **normal depth** $y_n$. For a rectangle $Q = \\frac{1}{n}(by)\\left(\\frac{by}{b+2y}\\right)^{2/3}S^{1/2}$ cannot be solved for $y$ in closed form, so engineers iterate — or let the calculator below do it. A very wide channel ($R \\approx y$) gives $y_n = (nq/\\sqrt{S})^{3/5}$ directly, with $q$ the flow per metre of width. The normal depth is where the flow tends far from any structure; compared with the critical depth it classifies the slope as mild or steep ([[gradually-varied-flow]]). [The channel calculator](#/tools/hydro/channel) solves any section.

### What it tells a designer
- $Q \\propto 1/n$: a canal overgrown with weeds (n from 0.025 to 0.035) carries 30 % less at the same depth — maintenance is capacity.
- $Q \\propto \\sqrt{S}$: four times the slope only doubles the flow.
- $Q \\propto A R^{2/3}$: the best section has the least perimeter for its area — a semicircle, half a hexagon among trapezoids, a rectangle twice as wide as deep.
- A circular pipe carries its greatest flow at about 94 % of its diameter and its fastest velocity near 81 %, not when full: the last few centimetres add more wetted perimeter than area.

> [!note] Manning assumes fully rough turbulent flow. For smooth or very small conduits and thin sheet flow use [[darcy-weisbach]] with $D_h = 4R$; the two agree when $f = 8 g n^2 / R^{1/3}$ — about 0.015 for smooth concrete with R = 0.64 m.
`,
  ideas: [
    'In uniform flow, gravity along the slope balances boundary friction: τ₀ = ρgRS.',
    'Manning: $V = R^{2/3} S^{1/2}/n$ — velocity grows with the hydraulic radius and the square root of the slope, and falls with roughness.',
    'The normal depth is the depth of uniform flow for a given discharge; it is found by iteration.',
    'Chézy\'s C and Manning\'s n are linked by $C = R^{1/6}/n$.',
    'The most efficient section has the smallest wetted perimeter for its area; a pipe carries most just below full.'
  ],
  pitfalls: [
    'Manning\'s n is a property of the material alone — It also absorbs vegetation, bends, irregularity and sediment; the same earth canal can go from 0.022 to 0.035 in one season.',
    'Doubling the slope doubles the velocity — V grows only with √S; doubling the slope gives 41 % more velocity at the same depth.',
    'A sewer is at its greatest capacity when it flows full — In a circular pipe Manning gives the maximum flow at about 94 % of the diameter; the full pipe carries a few per cent less.'
  ],
  formulas: [
    {
      name: 'Manning velocity',
      expr: 'V = R^(2/3)*sqrt(S)/n', tex: 'V = \\dfrac{1}{n}\\,R^{2/3} S^{1/2}',
      vars: {
        V: { name: 'mean velocity', q: 'speed', unit: 'm/s' },
        R: { name: 'hydraulic radius', q: 'length', unit: 'm', value: 0.64 },
        S: { name: 'bed slope S (m per m)', value: 0.001 },
        n: { name: 'Manning n (SI units)', value: 0.013, min: 0.009, max: 0.08 }
      },
      note: 'SI form: R in metres. In US customary units (ft, ft/s) the constant is 1.49 instead of 1.',
      stories: { V: 'A concrete channel (n = {n}) with a hydraulic radius of {R} is laid at a slope of {S}. What is the mean velocity in uniform flow?', S: 'Water must flow at {V} in a channel with R = {R} and n = {n}. What slope is needed?' }
    },
    {
      name: 'Discharge in a rectangular channel (normal depth)',
      expr: 'Q = (b*y)*(b*y/(b + 2*y))^(2/3)*sqrt(S)/n',
      tex: 'Q = \\dfrac{1}{n}\\,(b\\,y)\\left(\\dfrac{b\\,y}{b + 2y}\\right)^{2/3} S^{1/2}',
      vars: {
        Q: { name: 'discharge', q: 'flowrate', unit: 'm³/s' },
        b: { name: 'channel width', q: 'length', unit: 'm', value: 3 },
        y: { name: 'normal depth', q: 'length', unit: 'm', value: 1.2 },
        S: { name: 'bed slope S (m per m)', value: 0.001 },
        n: { name: 'Manning n (SI units)', value: 0.015, min: 0.009, max: 0.08 }
      },
      note: 'Solving for y gives the normal depth (found numerically: there is no closed form).',
      practice: { unknowns: ['Q', 'y', 'b'] },
      stories: {
        Q: 'A rectangular channel {b} wide with n = {n} and a slope of {S} runs at a uniform depth of {y}. What does it carry?',
        y: 'A rectangular concrete channel {b} wide (n = {n}) on a slope of {S} carries {Q}. What is the normal depth?',
        b: 'A channel on a slope of {S} (n = {n}) must carry {Q} at a depth of {y}. How wide must it be?'
      }
    },
    {
      name: 'Chézy formula',
      expr: 'V = C*sqrt(R*S)', tex: 'V = C\\sqrt{R\\,S}',
      vars: {
        V: { name: 'mean velocity', q: 'speed', unit: 'm/s' },
        C: { name: 'Chézy coefficient C (SI units, m½/s)', value: 45, min: 20, max: 90 },
        R: { name: 'hydraulic radius', q: 'length', unit: 'm', value: 0.8 },
        S: { name: 'bed slope S (m per m)', value: 0.0005 }
      },
      note: '$C \\approx R^{1/6}/n$ connects it to Manning: C = 45 corresponds to n ≈ 0.021 at R = 0.8 m.'
    },
    {
      name: 'Bed shear stress in uniform flow',
      expr: 'tau = rhoW*g*R*S', tex: '\\tau_0 = \\rho_w\\,g\\,R\\,S',
      vars: {
        tau: { name: 'mean bed shear stress', q: 'stress', unit: 'Pa', tex: '\\tau_0' },
        rhoW: { const: 'rhoW' },
        g: { const: 'g' },
        R: { name: 'hydraulic radius', q: 'length', unit: 'm', value: 0.64 },
        S: { name: 'bed slope S (m per m)', value: 0.001 }
      },
      note: 'For a wide channel R ≈ y. Compare with the shear a bed or lining can take before it erodes.',
      stories: { tau: 'A wide canal runs {R} deep on a slope of {S}. What mean shear stress does the water exert on its bed?' }
    }
  ],
  examples: [
    {
      title: 'Normal depth in a concrete channel',
      q: 'A rectangular concrete channel ($n = 0.013$) is 3 m wide and laid at a slope of 1 m per km. Find the normal depth, the velocity and the Froude number when it carries 6 m³/s.',
      steps: [
        'Try $y = 1.0$ m: $A = 3$ m², $P = 5$ m, $R = 0.6$ m, $R^{2/3} = 0.711$; $Q = \\frac{1}{0.013} \\times 3 \\times 0.711 \\times \\sqrt{0.001} = 5.19$ m³/s — too little.',
        'Try $y = 1.1$ m: $A = 3.3$ m², $R = 3.3/5.2 = 0.635$ m, $R^{2/3} = 0.738$; $Q = 5.93$ m³/s — close.',
        'Interpolating (or solving): $y_n = 1.11$ m, $A = 3.33$ m², $V = 6/3.33 = 1.80$ m/s.',
        '$\\mathrm{Fr} = 1.80/\\sqrt{9.81 \\times 1.11} = 0.55$; the critical depth $(q^2/g)^{1/3}$ with $q = 2$ m²/s is 0.74 m, below $y_n$, so the slope is mild and the flow subcritical.',
        'Bed shear: $\\tau_0 = 1000 \\times 9.81 \\times 0.638 \\times 0.001 = 6.3$ Pa.'
      ],
      a: 'yₙ ≈ 1.11 m, V ≈ 1.80 m/s, Fr ≈ 0.55 (subcritical), τ₀ ≈ 6 Pa.'
    },
    {
      title: 'A canal full of weeds',
      q: 'An earth canal ($b = 2$ m, side slopes 1.5 : 1, $S = 0.0004$) carries water 1.2 m deep with $n = 0.025$ when clean. In summer weeds raise $n$ to 0.035. What does it carry at 1.2 m now, and how deep must it run to carry its old flow?',
      steps: [
        'Section: $A = 4.56$ m², $R = 0.721$ m, $R^{2/3} = 0.804$, $\\sqrt{S} = 0.02$.',
        'Clean: $V = 0.804 \\times 0.02/0.025 = 0.643$ m/s, $Q = 2.93$ m³/s.',
        'Weedy, same depth: $Q = 2.93 \\times 0.025/0.035 = 2.09$ m³/s — 29 % less.',
        'To carry 2.93 m³/s with $n = 0.035$ the normal depth rises to about 1.42 m (by iteration): 22 cm more freeboard used up.'
      ],
      a: 'About 2.1 m³/s at the old depth; the old flow needs about 1.42 m of depth.'
    }
  ],
  quiz: [
    { q: 'The slope of a channel is quadrupled; the roughness and depth stay the same. The velocity…', choices: ['doubles', 'quadruples', 'rises by a factor $2^{2/3}$', 'does not change'], a: 0,
      why: 'V ∝ √S: four times the slope gives twice the velocity.' },
    { q: 'Which lining has the smallest Manning n?', choices: ['formed concrete', 'a clean earth canal', 'a weedy natural stream', 'corrugated metal pipe'], a: 0,
      why: 'Concrete is about 0.013, earth 0.02–0.025, corrugated metal about 0.024, a weedy stream 0.035–0.05.' },
    { q: 'A very wide channel (R ≈ y) runs 2 m deep on a slope of 0.0005 with n = 0.03. What is the mean velocity?', answer: 1.18, unit: 'm/s',
      why: '$V = 2^{2/3} \\times \\sqrt{0.0005}/0.03 = 1.587 \\times 0.02236/0.03 = 1.18$ m/s.' },
    { q: 'A circular sewer carries its largest discharge when it flows completely full.', a: false,
      why: 'Near the crown the wetted perimeter grows faster than the area, so the hydraulic radius falls; the maximum is at about 94 % of the diameter.' },
    { q: 'In uniform flow, which change doubles the mean bed shear stress?', choices: ['doubling the velocity', 'doubling the hydraulic radius at the same slope', 'halving n', 'doubling the width of a wide channel'], a: 1,
      why: 'τ₀ = ρgRS. Doubling the velocity at the same R would need four times the slope (and give four times the stress); n and the width of a wide channel do not appear.' }
  ],
  problems: [
    { q: 'A rectangular concrete channel (n = 0.013) 2 m wide on a slope of 0.002 flows 0.8 m deep. What is the discharge?', answer: 3.21, unit: 'm³/s', tol: 0.02,
      steps: ['$A = 1.6$ m², $P = 3.6$ m, $R = 0.444$ m, $R^{2/3} = 0.582$.', '$Q = \\frac{1}{0.013} \\times 1.6 \\times 0.582 \\times \\sqrt{0.002} = 3.21$ m³/s.'] },
    { q: 'What Manning n corresponds to a Chézy coefficient of 50 m½/s in a channel with R = 1 m?', answer: 0.02, tol: 0.02,
      steps: ['$n = R^{1/6}/C = 1/50 = 0.020$.'] }
  ],
  applications: ['Sizing irrigation canals, drainage ditches and storm sewers.', 'Flood mapping: river models use one n for the channel and larger values for the floodplain.', 'Checking whether a canal bed or lining will scour, from τ₀ = ρgRS.', 'Road gutters and culverts flowing part-full.'],
  history: 'Antoine de Chézy devised his formula in 1769 while estimating the canal needed to bring the water of the Yvette to Paris. Philippe Gauckler proposed the 2/3-power law in 1867; the Irish engineer Robert Manning reached it independently in 1889 (he himself preferred a dimensionally tidier formula), and Albert Strickler tied the coefficient to grain size in 1923, $n \\approx d^{1/6}/21$ with $d$ in metres.',
  sim: 'chan-manning'
},

{
  id: 'froude-number', parent: 'channel-flow', title: 'The Froude number', level: 2,
  short: 'The ratio of the flow velocity to the speed of a small surface wave, Fr = V/√(gD). Below one the flow is subcritical — tranquil, controlled from downstream; above one it is supercritical — rapid, controlled from upstream. It is also the similarity law for hydraulic models.',
  keywords: ['Froude number', 'wave celerity', 'shallow-water wave', 'subcritical', 'supercritical', 'critical flow', 'tranquil', 'rapid', 'standing wave', 'Froude scaling', 'hydraulic model', 'Mach number analogy', 'tsunami speed', 'hull speed'],
  prereq: ['open-channel-basics', 'physics:wave-properties', 'aerodynamics:dimensional-analysis'],
  related: ['specific-energy', 'hydraulic-jump', 'gradually-varied-flow', 'aerodynamics:mach-number', 'aerodynamics:normal-shock', 'aerodynamics:similarity-testing'],
  body: `
Drop a pebble into a still pond and a ring of ripples spreads out. Where the water is shallow compared with the length of the waves, they all travel at the same speed,

$$c = \\sqrt{g y}$$

— 3.1 m/s in a metre of water, 1 m/s in 10 cm, and 200 m/s (over 700 km/h) for a tsunami crossing an ocean 4000 m deep. Now drop the pebble into a moving stream. The ring is carried along with the water: its upstream edge moves at $c - V$ relative to the bank, its downstream edge at $c + V$. Everything turns on which is larger.

### The number
$$\\mathrm{Fr} = \\frac{V}{\\sqrt{g D}}$$

with $D = A/T$ the hydraulic depth ($D = y$ in a rectangle).
- **Fr < 1, subcritical** ("tranquil"): waves can work their way upstream, so the flow *feels* what lies ahead — a weir, a gate, a narrowing bridge. It is controlled from downstream. Lowland rivers and canals.
- **Fr = 1, critical**: an upstream-moving wave stands still. The surface is wavy and unstable, so long channels are designed away from the range of about 0.7–1.3 — but weir crests and flume throats force Fr = 1 on purpose, because there depth and flow are tied together.
- **Fr > 1, supercritical** ("rapid"): no signal can travel upstream. The flow runs blind into obstacles and meets them with standing waves, oblique wave fronts and hydraulic jumps. It is controlled from upstream. Spillway chutes, steep mountain streams, a flood running down a steep street, the sheet under a sluice gate.

| Flow | Velocity | Depth | Fr |
|---|---|---|---|
| Lowland river | 1 m/s | 3 m | 0.18 |
| Irrigation canal | 0.8 m/s | 1.2 m | 0.23 |
| Concrete storm drain in a downpour | 3 m/s | 0.4 m | 1.5 |
| Spillway chute | 15 m/s | 0.8 m | 5.4 |
| Film spreading from a tap on a flat sink | 1 m/s | 2 mm | 7 |

The last line is why a ring-shaped [[hydraulic-jump]] appears in every kitchen sink.

### The Mach number of water
The Froude number plays exactly the part the Mach number plays in gas flow ([[aerodynamics:mach-number]]): supersonic air cannot warn what lies ahead and meets obstacles with shock waves; supercritical water meets them with standing waves, and its hydraulic jump is the counterpart of a [[aerodynamics:normal-shock]]. A stone in fast shallow flow trails a V-shaped wake whose half-angle $\\beta$ obeys $\\sin\\beta = 1/\\mathrm{Fr}$, just like a Mach cone. The analogy is close enough (it corresponds to a gas with $\\gamma = 2$) that shallow water tables were once used to study supersonic flow patterns cheaply.

### Froude scaling of models
When gravity and inertia dominate — spillways, harbours, river works, ship waves — a model behaves like the real thing if both have the same Froude number. With a length scale $L_r = L_p/L_m$, velocities and times scale as $\\sqrt{L_r}$, discharges as $L_r^{5/2}$ and forces as $L_r^3$. A 1:25 spillway model runs at a fifth of the prototype's speeds and passes 1/3125 of its flow: a 250 m³/s flood becomes 80 L/s in the laboratory. Viscosity and surface tension do not scale this way, so models are kept large enough that the flow stays turbulent and air entrainment is not ruled by surface tension ([[aerodynamics:similarity-testing]]).

Ships have their own version, the length Froude number $V/\\sqrt{gL}$: a displacement hull's wave-making resistance soars near 0.4, the familiar "hull speed".
`,
  ideas: [
    'Shallow-water waves travel at c = √(gy), whatever their wavelength.',
    'Fr = V/√(gD) compares the flow speed with the wave speed: below 1 waves can move upstream, above 1 they cannot.',
    'Subcritical flow is controlled from downstream, supercritical flow from upstream.',
    'The Froude number is the open-channel counterpart of the Mach number; the hydraulic jump is the counterpart of a shock.',
    'Hydraulic models are scaled by keeping Fr equal: discharge scales as $L^{5/2}$.'
  ],
  pitfalls: [
    'Fast water is supercritical — It is the ratio that counts: a flood 5 m deep at 4 m/s is subcritical (Fr = 0.57), while a film 2 mm deep at 1 m/s in a sink is supercritical.',
    'Waves always travel both ways along a channel — In supercritical flow both edges of a disturbance are swept downstream; nothing can travel against the current.',
    'A 1:25 model needs 1/25 of the flow — Froude scaling gives $25^{5/2} = 3125$: velocities fall by √25 and areas by 25².'
  ],
  formulas: [
    {
      name: 'Froude number',
      expr: 'Fr = V/sqrt(g*D)', tex: '\\mathrm{Fr} = \\dfrac{V}{\\sqrt{g\\,D}}',
      vars: {
        Fr: { name: 'Froude number', tex: '\\mathrm{Fr}' },
        V: { name: 'mean velocity', q: 'speed', unit: 'm/s', value: 1.5 },
        g: { const: 'g' },
        D: { name: 'hydraulic depth A/T (= y in a rectangle)', q: 'length', unit: 'm', value: 0.5 }
      },
      stories: { Fr: 'Water flows at {V} with a hydraulic depth of {D}. What is the Froude number?', V: 'At what velocity does flow {D} deep become critical (Fr = {Fr})?' }
    },
    {
      name: 'Speed of a shallow-water wave',
      expr: 'c = sqrt(g*y)', tex: 'c = \\sqrt{g\\,y}',
      vars: {
        c: { name: 'wave speed (celerity)', q: 'speed', unit: 'm/s' },
        g: { const: 'g' },
        y: { name: 'water depth', q: 'length', unit: 'm', value: 1 }
      },
      note: 'Valid when the wavelength is much longer than the depth (over about 20 times) — true of ripples in shallow streams, flood waves and tsunamis.',
      stories: { c: 'How fast does a small surface wave travel on still water {y} deep?', y: 'A long, low wave travels at {c} across still water. How deep is the water?' }
    },
    {
      name: 'Froude scaling of discharge',
      expr: 'Qp = Qm*Lr^(5/2)', tex: 'Q_p = Q_m\\,L_r^{5/2}',
      vars: {
        Qp: { name: 'prototype discharge', q: 'flowrate', unit: 'm³/s', tex: 'Q_p' },
        Qm: { name: 'model discharge', q: 'flowrate', unit: 'L/s', value: 80, tex: 'Q_m' },
        Lr: { name: 'length scale (prototype length / model length)', value: 25, min: 2, max: 200, tex: 'L_r' }
      },
      note: 'Velocities and times scale as $\\sqrt{L_r}$, forces as $L_r^3$.',
      stories: { Qm: 'A spillway must pass {Qp}. What flow does a 1:{Lr} Froude model need?', Qp: 'A 1:{Lr} model passes {Qm}. What prototype discharge does that represent?' }
    }
  ],
  examples: [
    {
      title: 'Which way does the ripple go?',
      q: 'A stream 0.5 m deep flows at 1.5 m/s. A pebble drops in. How fast do the upstream and downstream edges of the ring move? What changes if the stream speeds up to 3 m/s at the same depth?',
      steps: [
        '$c = \\sqrt{9.81 \\times 0.5} = 2.21$ m/s; $\\mathrm{Fr} = 1.5/2.21 = 0.68$ — subcritical.',
        'The upstream edge advances at $2.21 - 1.5 = 0.71$ m/s against the current; the downstream edge moves at $2.21 + 1.5 = 3.71$ m/s.',
        'At 3 m/s, $\\mathrm{Fr} = 1.36$: the "upstream" edge is carried downstream at $3 - 2.21 = 0.79$ m/s. The disturbance cannot reach upstream at all.',
        'A steady obstacle now leaves a V-shaped wake with $\\sin\\beta = 1/1.36$, a half-angle of about 48°.'
      ],
      a: 'At 1.5 m/s the ring spreads upstream at 0.71 m/s; at 3 m/s (Fr = 1.36) the whole ring is swept downstream.'
    },
    {
      title: 'A spillway model',
      q: 'A spillway is to be tested on a 1:25 model. The design flood is 250 m³/s and the water reaches the toe at 20 m/s. What flow and toe velocity are needed in the model, and how long does an hour of flood last there?',
      steps: [
        'Discharge: $Q_m = 250/25^{5/2} = 250/3125 = 0.080$ m³/s = 80 L/s.',
        'Velocity: $V_m = 20/\\sqrt{25} = 4$ m/s.',
        'Time: $60/\\sqrt{25} = 12$ minutes of model time for each hour of prototype time.'
      ],
      a: '80 L/s, 4 m/s, and 12 minutes per prototype hour.'
    }
  ],
  quiz: [
    { q: 'A stream 0.4 m deep flows at 2.5 m/s. The flow is…', choices: ['subcritical', 'critical', 'supercritical', 'impossible to classify without the slope'], a: 2,
      why: 'Fr = 2.5/√(9.81 × 0.4) = 2.5/1.98 = 1.26 > 1.' },
    { q: 'How fast does a small surface wave travel on still water 2.5 m deep?', answer: 4.95, unit: 'm/s',
      why: 'c = √(9.81 × 2.5) = 4.95 m/s.' },
    { q: 'In supercritical flow, closing a gate downstream immediately raises the water level upstream of it.', a: false,
      why: 'No wave can travel upstream through supercritical flow. The flow upstream changes only when a hydraulic jump forms and works its way up the channel.' },
    { q: 'A spillway is modelled at 1:36. By what factor is the model discharge smaller than the prototype\'s?', answer: 7776,
      why: 'Discharge scales as $L_r^{5/2} = 36^{2.5} = 6^5 = 7776$.' },
    { q: 'A hydraulic jump is to open-channel flow what ___ is to gas flow.', choices: ['a boundary layer', 'a normal shock wave', 'a vortex', 'laminar flow'], a: 1,
      why: 'Both are abrupt transitions from "faster than the waves" to "slower than the waves", with a loss of energy.' }
  ],
  problems: [
    { q: 'A tsunami crosses an ocean about 4000 m deep. How many hours does it take to travel 3000 km?', answer: 4.2, unit: 'h', tol: 0.03,
      steps: ['$c = \\sqrt{9.81 \\times 4000} = 198$ m/s (713 km/h).', '$t = 3\\times10^6/198 = 15\\,100$ s ≈ 4.2 h.'] },
    { q: 'A rectangular channel carries 3 m³/s per metre of width at a depth of 0.6 m. What is the Froude number?', answer: 2.06, tol: 0.02,
      steps: ['$V = 3/0.6 = 5$ m/s.', '$\\mathrm{Fr} = 5/\\sqrt{9.81 \\times 0.6} = 5/2.43 = 2.06$ — supercritical.'] }
  ],
  applications: ['Deciding where a canal is controlled from: gates downstream for subcritical reaches, upstream for supercritical ones.', 'Hydraulic model studies of spillways, harbours and river works, scaled by Froude similarity.', 'Ship design, where wave resistance and hull speed depend on the length Froude number.', 'Tsunami warning, from √(gh) over the depths of the ocean.'],
  history: 'William Froude (1810–1879), a railway engineer turned naval architect, built a towing tank at Torquay in 1872 and showed that a ship model and the full-size hull make the same pattern of waves when V/√(gL) is the same — the "law of comparison" behind the number that now bears his name.',
  sim: 'chan-ripples'
},

{
  id: 'specific-energy', parent: 'channel-flow', title: 'Specific energy and critical depth', level: 2,
  short: 'The energy of a channel flow measured from its own bed, E = y + V²/2g. For a given discharge it has a minimum at the critical depth; any larger energy can be carried at two depths, one deep and slow, one shallow and fast — which explains steps, humps, narrowings and choking.',
  keywords: ['specific energy', 'critical depth', 'alternate depths', 'minimum specific energy', 'critical velocity', 'choking', 'step in a channel', 'hump', 'channel contraction', 'E-y diagram', 'unit discharge', 'Bakhmeteff'],
  prereq: ['open-channel-basics', 'energy-equation', 'froude-number'],
  related: ['hydraulic-jump', 'weirs-flumes', 'culverts-sluice', 'gradually-varied-flow', 'venturi-meter'],
  body: `
Measure the head of a channel flow not from a fixed datum but from the bed beneath it and you get its **specific energy**:

$$E = y + \\frac{V^2}{2g} = y + \\frac{q^2}{2 g y^2}$$

where $q = Q/b$ is the discharge per metre of width of a rectangular channel. $E$ is the energy per unit weight the water carries relative to its own bed — depth plus velocity head — and it changes only when the bed rises or falls or friction takes its share.

### The curve and its minimum
Plot $E$ against $y$ for a fixed $q$. Deep water moves slowly and nearly all its energy is depth, so the curve hugs the line $E = y$; very shallow water must move very fast, so $E$ shoots up as $y \\to 0$. In between lies a minimum. Setting $dE/dy = 1 - q^2/(g y^3) = 0$ gives the **critical depth**

$$y_c = \\sqrt[3]{\\frac{q^2}{g}}, \\qquad V_c = \\sqrt{g\\,y_c}, \\qquad E_{min} = \\tfrac{3}{2}\\,y_c$$

At the minimum $V = \\sqrt{gy}$, so $\\mathrm{Fr} = 1$: critical flow is the flow that carries a given discharge with the least energy, and its velocity head is exactly half its depth. Above $E_{min}$ every energy can be carried at two **alternate depths**: one on the upper, subcritical limb and one on the lower, supercritical limb. For $q = 2$ m²/s, $y_c = 0.74$ m and $E_{min} = 1.11$ m; water 1.8 m deep has $E = 1.86$ m, and its supercritical alternate is only 0.37 m deep, racing at 5.4 m/s. For any other section the critical condition is $Q^2 T/(g A^3) = 1$.

### Steps and humps
Raise the bed by $\\Delta z$ over a smooth hump. With no losses $E_2 = E_1 - \\Delta z$: the point moves left along the same curve, toward the nose.
- A **subcritical** flow gets *shallower* over the hump — and its surface dips, because the water speeds up. It is the opposite of what intuition says.
- A **supercritical** flow gets *deeper* and its surface rises.

The largest step the flow can climb without anything changing upstream is $\\Delta z_{max} = E_1 - E_{min}$. A higher step **chokes** the channel: the flow over the crest goes critical and the water upstream backs up until it has the extra energy, $E_1' = E_{min} + \\Delta z$. A supercritical approach chokes with a hydraulic jump that travels upstream.

### Narrowings
Contracting the width at the same bed level raises $q = Q/b$ and so moves the flow to a curve with a larger $E_{min}$. Subcritical flow falls as it passes a bridge opening or a flume throat; narrow it enough and the throat goes critical — the principle of the venturi and Parshall flumes ([[weirs-flumes]]), which measure the flow from one depth upstream. Too narrow a bridge opening does the same to a river in flood, raising the water level upstream.

> [!key] For a given discharge the critical depth is the depth of least energy. Taking energy away — a step, a narrowing, friction — pushes the flow toward critical. Flow can pass smoothly from subcritical to supercritical at a control such as a weir crest, but it returns from supercritical to subcritical only through a [[hydraulic-jump]].
`,
  ideas: [
    'Specific energy is depth plus velocity head, measured from the channel bed: E = y + q²/(2gy²).',
    'For a given discharge E has a minimum, $E_{min} = 1.5\\,y_c$, at the critical depth $y_c = (q^2/g)^{1/3}$, where Fr = 1.',
    'Any energy above the minimum can be carried at two alternate depths: one subcritical, one supercritical.',
    'Over a hump or through a narrowing, subcritical flow gets shallower and supercritical flow deeper; both move toward critical.',
    'A step higher than $E_1 - E_{min}$ chokes the flow: it goes critical over the step and the water upstream rises.'
  ],
  pitfalls: [
    'Water rises as it flows over a bump in the bed — Only supercritical flow does. Subcritical flow speeds up and its surface dips over the bump.',
    'Critical depth depends on the slope and roughness — For a given section it depends only on the discharge: $y_c = (q^2/g)^{1/3}$ in a rectangle. Slope and roughness fix the normal depth.',
    'Specific energy is conserved along a channel like total head — It is measured from the local bed, so it rises when the bed falls away and drops over a step even with no friction at all.'
  ],
  formulas: [
    {
      name: 'Specific energy',
      expr: 'E = y + q^2/(2*g*y^2)', tex: 'E = y + \\dfrac{q^2}{2 g\\,y^2}',
      vars: {
        E: { name: 'specific energy (above the bed)', q: 'length', unit: 'm' },
        y: { name: 'flow depth', q: 'length', unit: 'm', value: 1.8 },
        q: { name: 'discharge per metre of width', q: false, unit: 'm²/s', value: 2 },
        g: { const: 'g' }
      },
      note: 'Solving for y gives both alternate depths: the subcritical one (larger) and the supercritical one (smaller).',
      stories: { E: 'Water flows {y} deep with {q} per metre of width. What is its specific energy?', y: 'A flow of {q} per metre of width has a specific energy of {E}. At what depths can it flow?' }
    },
    {
      name: 'Critical depth (rectangular channel)',
      expr: 'yc = (q^2/g)^(1/3)', tex: 'y_c = \\sqrt[3]{\\dfrac{q^2}{g}}',
      vars: {
        yc: { name: 'critical depth', q: 'length', unit: 'm', tex: 'y_c' },
        q: { name: 'discharge per metre of width', q: false, unit: 'm²/s', value: 2 },
        g: { const: 'g' }
      },
      note: 'At the critical depth $V = \\sqrt{g\\,y_c}$, Fr = 1 and $E_{min} = 1.5\\,y_c$.',
      stories: { yc: 'What is the critical depth of a flow of {q} per metre of width?', q: 'Over a weir crest the depth is critical at {yc}. What is the flow per metre of width?' }
    },
    {
      name: 'Highest step without choking',
      expr: 'dz = y1 + q^2/(2*g*y1^2) - 1.5*(q^2/g)^(1/3)',
      tex: '\\Delta z_{max} = y_1 + \\dfrac{q^2}{2 g\\,y_1^2} - \\dfrac{3}{2}\\sqrt[3]{\\dfrac{q^2}{g}}',
      vars: {
        dz: { name: 'largest step in the bed', q: 'length', unit: 'm', tex: '\\Delta z_{max}' },
        y1: { name: 'approach depth', q: 'length', unit: 'm', value: 1.8, tex: 'y_1' },
        q: { name: 'discharge per metre of width', q: false, unit: 'm²/s', value: 2 },
        g: { const: 'g' }
      },
      note: '$E_1 - E_{min}$. A higher step makes the flow critical on the step and raises the water upstream.',
      stories: { dz: 'Water approaches a smooth step {y1} deep with {q} per metre of width. How high can the step be before it chokes the flow?' }
    }
  ],
  examples: [
    {
      title: 'Over a step',
      q: 'Water flows 1.8 m deep in a wide channel with $q = 2$ m²/s. It passes over a smooth step 0.3 m high. Find the depth on the step, the change in the water surface, and the highest step that would not choke the flow.',
      steps: [
        '$E_1 = 1.8 + \\dfrac{2^2}{2 \\times 9.81 \\times 1.8^2} = 1.8 + 0.063 = 1.863$ m. ($\\mathrm{Fr}_1 = 0.26$, subcritical.)',
        '$y_c = (4/9.81)^{1/3} = 0.742$ m, $E_{min} = 1.112$ m.',
        '$E_2 = 1.863 - 0.3 = 1.563$ m $> E_{min}$: no choking. Solve $1.563 = y + 0.204/y^2$ on the subcritical limb: $y_2 = 1.468$ m.',
        'The surface on the step stands at $0.3 + 1.468 = 1.768$ m above the upstream bed — 3 cm *lower* than upstream.',
        '$\\Delta z_{max} = 1.863 - 1.112 = 0.75$ m.'
      ],
      a: 'y₂ ≈ 1.47 m; the surface dips about 3 cm; a step over 0.75 m would choke the flow.'
    },
    {
      title: 'Choked',
      q: 'The same flow meets a step 0.9 m high. What happens?',
      steps: [
        '$0.9 > 0.75$: the flow cannot pass with its present energy. It goes critical on the step, $y = y_c = 0.742$ m.',
        'The upstream water must now carry $E_1\' = E_{min} + \\Delta z = 1.112 + 0.9 = 2.012$ m.',
        'Solving $2.012 = y + 0.204/y^2$ on the subcritical limb: $y_1\' = 1.96$ m. The water upstream backs up by 16 cm, and the backwater spreads upstream as an M1 curve.'
      ],
      a: 'The flow chokes: critical depth 0.74 m on the step and 1.96 m (16 cm higher) upstream.'
    }
  ],
  quiz: [
    { q: 'For a given discharge per metre, the specific energy is smallest when the flow is…', choices: ['very deep', 'critical', 'very shallow', 'uniform'], a: 1,
      why: '$dE/dy = 0$ at $y = y_c$, where Fr = 1.' },
    { q: 'Subcritical flow passes over a smooth hump in the bed without choking. The water surface over the hump…', choices: ['rises', 'falls', 'stays level', 'rises and forms a jump'], a: 1,
      why: 'Surface level = Δz + y₂ = E₁ − V₂²/2g, and V₂ > V₁, so it is below y₁. The flow speeds up and the surface dips.' },
    { q: 'What is the critical depth for a flow of 5 m²/s per metre of width?', answer: 1.37, unit: 'm',
      why: '$y_c = (25/9.81)^{1/3} = 2.548^{1/3} = 1.37$ m.' },
    { q: 'At critical flow in a rectangular channel, the velocity head equals…', choices: ['the depth', 'half the depth', 'twice the depth', 'a third of the depth'], a: 1,
      why: '$V_c^2 = g\\,y_c$, so $V_c^2/2g = y_c/2$, and $E_{min} = 1.5\\,y_c$.' },
    { q: 'A step higher than $E_1 - E_{min}$ raises the water level upstream of it.', a: true,
      why: 'The flow chokes: it goes critical over the step and the upstream depth rises until the flow has $E_{min} + \\Delta z$.' }
  ],
  problems: [
    { q: 'Water flows 0.4 m deep at 6 m/s in a wide channel. What is the subcritical alternate depth with the same specific energy?', answer: 2.17, unit: 'm', tol: 0.02,
      steps: ['$q = 2.4$ m²/s, $E = 0.4 + 36/19.62 = 2.235$ m.', 'Solve $y + 2.4^2/(19.62\\,y^2) = 2.235$ on the upper limb: $y \\approx 2.17$ m.'] },
    { q: 'What is the least specific energy with which 3 m³/s can flow in a rectangular channel 1.5 m wide?', answer: 1.11, unit: 'm', tol: 0.02,
      steps: ['$q = 2$ m²/s, $y_c = (4/9.81)^{1/3} = 0.742$ m.', '$E_{min} = 1.5 \\times 0.742 = 1.11$ m.'] }
  ],
  applications: ['Smooth transitions — humps, drops and contractions — in canals, designed not to choke.', 'Venturi, Parshall and long-throated flumes, which force critical flow to measure discharge.', 'Bridge openings and culvert inlets: checking whether a constriction raises the flood level upstream.', 'Weir crests and free overfalls, where the flow passes through critical depth.'],
  history: 'Boris Bakhmeteff introduced the idea of specific energy and its diagram in a book on varied flow published in Saint Petersburg in 1912, and spread it through his 1932 textbook Hydraulics of Open Channels after he settled in the United States.',
  sim: 'chan-energy'
},

{
  id: 'hydraulic-jump', parent: 'channel-flow', title: 'The hydraulic jump', level: 2,
  short: 'The abrupt rise where fast, shallow supercritical flow meets slow, deep water: a churning roller that conserves momentum but destroys energy. The depths either side follow from the upstream Froude number; engineers use jumps to tame the water below spillways and gates.',
  keywords: ['hydraulic jump', 'sequent depth', 'conjugate depth', 'Bélanger equation', 'energy dissipation', 'stilling basin', 'roller', 'undular jump', 'tailwater', 'specific force', 'drowning machine', 'low-head dam', 'jump length', 'tidal bore'],
  prereq: ['specific-energy', 'momentum-principle', 'froude-number'],
  related: ['dams-spillways', 'culverts-sluice', 'gradually-varied-flow', 'weirs-flumes', 'aerodynamics:normal-shock'],
  body: `
Turn on a tap over a flat sink: a thin fast film spreads from where the jet lands, and a few centimetres out it suddenly thickens and slows in a ring. That ring is a **hydraulic jump**. Below a spillway the same thing is metres high, white and roaring — and it is doing a job, turning the destructive kinetic energy of the falling water into turbulence and, finally, heat before it reaches the riverbed.

### Momentum, not energy
Across a jump the energy equation cannot help: the loss is the unknown. Momentum, though, is conserved. Between a section just upstream and one just downstream the only horizontal forces are the hydrostatic pressures (bed friction over the short length is small), so per metre of width of a rectangular channel

$$\\frac{q^2}{g\\,y_1} + \\frac{y_1^2}{2} = \\frac{q^2}{g\\,y_2} + \\frac{y_2^2}{2}$$

Each side is the **specific force** — momentum flux plus pressure force, divided by $\\rho g$. Solving the quadratic for $y_2$ gives Bélanger's equation for the **sequent** (conjugate) depth, and the energy destroyed follows:

$$\\frac{y_2}{y_1} = \\frac{1}{2}\\left(\\sqrt{1 + 8\\,\\mathrm{Fr}_1^2} - 1\\right), \\qquad \\Delta E = \\frac{(y_2 - y_1)^3}{4\\,y_1 y_2}$$

A jump can only go from supercritical to subcritical ($\\mathrm{Fr}_1 > 1$, $\\mathrm{Fr}_2 < 1$); the reverse would create energy.

### Kinds of jump
| $\\mathrm{Fr}_1$ | Type | What it looks like | Energy lost |
|---|---|---|---|
| 1–1.7 | undular | a train of standing waves, no roller | under 5 % |
| 1.7–2.5 | weak | small rollers, smooth water downstream | 5–15 % |
| 2.5–4.5 | oscillating | an unstable jet that wobbles and sends waves far downstream | 15–45 % |
| 4.5–9 | steady | a well-formed, stable roller — best for stilling basins | 45–70 % |
| over 9 | strong | violent and rough, with spray | 70–85 % |

The roller is roughly six times $y_2$ long for $\\mathrm{Fr}_1$ between about 4.5 and 13, which sets the length of a stilling basin.

### Where it sits
A jump settles where the sequent depth of the incoming supercritical flow matches the depth downstream — the **tailwater**. If the tailwater is too low, the jump is swept downstream, perhaps off the concrete apron onto erodible riverbed. If it is too high, the jump is pushed upstream and drowns against the gate or the spillway toe: safe for the structure, but it dissipates less. Stilling basins use a sunken floor, chute blocks, baffles and an end sill to hold the jump in place over the whole range of flows ([[dams-spillways]]).

### Uses
Energy dissipation below spillways, gates and drop structures; fast mixing of coagulants in water-treatment works; aeration; raising the water level downstream so that irrigation off-takes can draw from it. A moving jump is a **bore**: tidal bores run up the Severn, the Qiantang and the Amazon.

> [!warn] The roller of a jump below a weir or low-head dam recirculates: on the surface the water flows *back* toward the weir. A swimmer, canoe or dog caught there is carried back under the falling water again and again, and aerated water gives less buoyancy, even to a life jacket. From upstream these "drowning machines" look harmless — a smooth horizon line across the river. Keep well clear of weirs from both sides, and never enter the water to rescue: call your local emergency number and throw something that floats.
`,
  ideas: [
    'A hydraulic jump is the abrupt change from supercritical to subcritical flow.',
    'Momentum (specific force) is conserved across the jump; energy is not.',
    'The sequent depth ratio depends only on the upstream Froude number: y₂/y₁ = (√(1 + 8Fr₁²) − 1)/2.',
    'Jumps with Fr₁ of 4.5–9 are steady and dissipate about half or more of the energy — ideal for stilling basins.',
    'The tailwater depth fixes where the jump sits; the recirculating roller below weirs is a drowning hazard.'
  ],
  pitfalls: [
    'Energy is conserved across a jump, like flow over a smooth step — The turbulent roller destroys energy; only momentum is conserved. Using energy gives the wrong depth.',
    'A higher jump is always better — A strong jump dissipates most but batters the basin; an oscillating jump (Fr₁ 2.5–4.5) sends damaging waves downstream. Designers aim for the steady range.',
    'The calm-looking water below a low weir is safe — The roller recirculates toward the weir and holds objects in it; it is one of the commonest causes of drowning on rivers.'
  ],
  formulas: [
    {
      name: 'Sequent depth (Bélanger)',
      expr: 'y2 = y1/2*(sqrt(1 + 8*Fr1^2) - 1)', tex: 'y_2 = \\dfrac{y_1}{2}\\left(\\sqrt{1 + 8\\,\\mathrm{Fr}_1^2} - 1\\right)',
      vars: {
        y2: { name: 'depth after the jump (sequent depth)', q: 'length', unit: 'm', tex: 'y_2' },
        y1: { name: 'depth before the jump', q: 'length', unit: 'm', value: 0.5, tex: 'y_1' },
        Fr1: { name: 'Froude number before the jump', value: 5, min: 1, max: 20, tex: '\\mathrm{Fr}_1' }
      },
      note: 'Rectangular channel, horizontal bed, bed friction neglected. Fr₁ = V₁/√(g y₁).',
      stories: { y2: 'Flow {y1} deep enters a jump at a Froude number of {Fr1}. How deep is the water after the jump?', Fr1: 'A jump takes the depth from {y1} to {y2}. What was the upstream Froude number?' }
    },
    {
      name: 'Head lost in a jump',
      expr: 'dE = (y2 - y1)^3/(4*y1*y2)', tex: '\\Delta E = \\dfrac{(y_2 - y_1)^3}{4\\,y_1 y_2}',
      vars: {
        dE: { name: 'head (energy per unit weight) lost', q: 'length', unit: 'm', tex: '\\Delta E' },
        y1: { name: 'depth before the jump', q: 'length', unit: 'm', value: 0.5, tex: 'y_1' },
        y2: { name: 'depth after the jump', q: 'length', unit: 'm', value: 3.59, tex: 'y_2' }
      },
      stories: { dE: 'A jump raises the depth from {y1} to {y2}. How much head is lost?' }
    },
    {
      name: 'Power dissipated in a jump',
      expr: 'P = rhoW*g*Q*dE', tex: 'P = \\rho_w\\,g\\,Q\\,\\Delta E',
      vars: {
        P: { name: 'power dissipated', q: 'power', unit: 'kW' },
        rhoW: { const: 'rhoW' },
        g: { const: 'g' },
        Q: { name: 'discharge', q: 'flowrate', unit: 'm³/s', value: 6 },
        dE: { name: 'head lost', q: 'length', unit: 'm', value: 4.11, tex: '\\Delta E' }
      },
      stories: { P: 'A jump passing {Q} destroys {dE} of head. At what rate does it dissipate energy?' }
    }
  ],
  examples: [
    {
      title: 'At the toe of a spillway',
      q: 'Water reaches the toe of a spillway in a sheet 0.5 m deep moving at 12 m/s. Find the sequent depth, the head lost and the power dissipated per metre of width, and estimate the length of the jump.',
      steps: [
        '$\\mathrm{Fr}_1 = 12/\\sqrt{9.81 \\times 0.5} = 5.42$ — a steady jump.',
        '$y_2 = \\frac{0.5}{2}\\left(\\sqrt{1 + 8 \\times 5.42^2} - 1\\right) = 0.25 \\times (15.36 - 1) = 3.59$ m.',
        '$\\Delta E = (3.59 - 0.5)^3/(4 \\times 0.5 \\times 3.59) = 4.11$ m. Since $E_1 = 0.5 + 12^2/19.62 = 7.84$ m, 52 % of the energy goes.',
        'With $q = 12 \\times 0.5 = 6$ m²/s: $P = 1000 \\times 9.81 \\times 6 \\times 4.11 = 242$ kW for every metre of width.',
        'Length ≈ $6 y_2 \\approx 22$ m.'
      ],
      a: 'y₂ ≈ 3.6 m, ΔE ≈ 4.1 m (52 %), about 240 kW per metre of width, a jump about 22 m long.'
    },
    {
      title: 'Not enough tailwater',
      q: 'For the spillway above, the river downstream runs only 3.0 m deep at the design flood. What happens, and what can the designer do?',
      steps: [
        'The jump needs 3.59 m of tailwater; 3.0 m is too little, so the jump is swept downstream until friction on the apron has slowed and deepened the supercritical flow enough — possibly beyond the end of the concrete.',
        'Remedies: sink the basin floor about 0.6 m so that the tailwater over it matches $y_2$; add chute blocks, baffle piers and an end sill, whose forces add to the pressure on the downstream side and hold a shorter jump in place.'
      ],
      a: 'The jump would move downstream off the apron; lower the basin floor or add blocks and a sill.'
    }
  ],
  quiz: [
    { q: 'The flow approaching a "jump" has Fr₁ = 1.0. What happens?', choices: ['a strong jump', 'no jump: the flow is already critical and y₂ = y₁', 'an undular jump losing half its energy', 'the flow reverses'], a: 1,
      why: 'With Fr₁ = 1, √(1 + 8) = 3 and y₂ = y₁: there is nothing to jump.' },
    { q: 'What is the sequent depth of a flow 0.3 m deep at Fr₁ = 4?', answer: 1.55, unit: 'm',
      why: 'y₂ = 0.15 × (√129 − 1) = 0.15 × 10.36 = 1.55 m.' },
    { q: 'Across a hydraulic jump, which is conserved?', choices: ['specific energy', 'momentum (specific force)', 'velocity', 'the Froude number'], a: 1,
      why: 'Only pressure forces act over the short length, so the momentum flux plus pressure force is the same on both sides; energy is dissipated.' },
    { q: 'If the tailwater is deeper than the sequent depth, the jump moves upstream.', a: true,
      why: 'The extra hydrostatic force downstream pushes the jump back until it drowns against the gate or spillway toe.' },
    { q: 'Which range of Fr₁ gives the steadiest jump for a stilling basin?', choices: ['1–1.7', '2.5–4.5', '4.5–9', 'above 13'], a: 2,
      why: 'Steady jumps (Fr₁ 4.5–9) are stable and dissipate 45–70 %; 2.5–4.5 oscillates and makes waves.' }
  ],
  problems: [
    { q: 'A jump takes the depth from 0.25 m to 1.5 m. What head is lost?', answer: 1.30, unit: 'm', tol: 0.02,
      steps: ['$\\Delta E = (1.5 - 0.25)^3/(4 \\times 0.25 \\times 1.5) = 1.953/1.5 = 1.30$ m.'] },
    { q: 'A flow of 4 m³/s per metre of width enters a jump 0.4 m deep. What is the depth after the jump?', answer: 2.66, unit: 'm', tol: 0.02,
      steps: ['$V_1 = 10$ m/s, $\\mathrm{Fr}_1 = 10/\\sqrt{9.81 \\times 0.4} = 5.05$.', '$y_2 = 0.2 \\times (\\sqrt{1 + 8 \\times 25.5} - 1) = 2.66$ m.'] }
  ],
  applications: ['Stilling basins below spillways, sluice gates and drop structures.', 'Flash mixing of coagulants in water-treatment works.', 'Gates and flumes, where the jump downstream decides between free and submerged flow.', 'The circular jump in a kitchen sink, and tidal bores — moving jumps — on rivers such as the Severn and the Qiantang.'],
  history: 'Leonardo da Vinci sketched hydraulic jumps around 1500. Giorgio Bidone measured them in a laboratory channel in Turin in 1818, and Jean-Baptiste Bélanger, who had first (wrongly) analysed them with the energy equation, derived the depth ratio from momentum in the late 1830s.',
  sim: 'chan-jump'
},

{
  id: 'gradually-varied-flow', parent: 'channel-flow', title: 'Gradually varied flow', level: 3,
  short: 'Flow whose depth changes slowly along a channel, above or below the normal depth, because a control — a dam, a gate, a change of slope — holds it there. One differential equation, $dy/dx = (S_0 - S_f)/(1 - \\mathrm{Fr}^2)$, gives the family of water-surface profiles, computed step by step.',
  keywords: ['gradually varied flow', 'backwater curve', 'drawdown', 'water surface profile', 'M1 profile', 'M2', 'M3', 'S1', 'S2', 'S3', 'mild slope', 'steep slope', 'direct step method', 'standard step method', 'friction slope', 'control section', 'backwater length'],
  prereq: ['manning-equation', 'specific-energy', 'froude-number'],
  related: ['hydraulic-jump', 'dams-spillways', 'weirs-flumes', 'stormwater-floods', 'math:differential-equations', 'math:euler-method'],
  body: `
A dam across a river raises the water behind it, and the rise does not end where the reservoir seems to: it tapers away over kilometres, a **backwater curve** that only slowly returns to the river's normal depth. Toward a waterfall the reverse happens: the flow speeds up and draws down to the critical depth at the brink. Between such controls the depth changes slowly enough that the pressure stays hydrostatic and the friction at each section can be taken from Manning as if the flow there were uniform at the local depth. That is **gradually varied flow**.

### The equation
Differentiate the total head $H = z + y + V^2/2g$ along the channel. The bed falls at the slope $S_0$; the energy line falls at the **friction slope** $S_f$; and $d(V^2/2g)/dx = -\\mathrm{Fr}^2\\,dy/dx$. Together:

$$\\frac{dy}{dx} = \\frac{S_0 - S_f}{1 - \\mathrm{Fr}^2}, \\qquad S_f = \\frac{n^2 V^2}{R^{4/3}}$$

Read it term by term. The numerator is positive when the water is deeper than normal ($y > y_n$: less friction than the bed's pull). The denominator is positive when the flow is subcritical ($y > y_c$). So the depth grows downstream when both have the same sign; it approaches $y_n$ gently (numerator → 0), and it changes ever faster near $y_c$ (denominator → 0), where the equation breaks down — that is where free overfalls and hydraulic jumps sit.

### The profiles
A slope is **mild** if $y_n > y_c$, **steep** if $y_n < y_c$ (also critical, horizontal and adverse). Zone 1 lies above both depths, zone 2 between them, zone 3 below both.

| Profile | Depth range | Shape (downstream) | Typical cause |
|---|---|---|---|
| M1 | $y > y_n > y_c$ | rises, tending to level | backwater behind a dam or weir |
| M2 | $y_n > y > y_c$ | falls to $y_c$ | drawdown to a free overfall or a steeper reach |
| M3 | $y < y_c < y_n$ | rises to a jump | below a sluice gate on a mild slope |
| S1 | $y > y_c > y_n$ | rises from a jump | behind a weir on a steep chute |
| S2 | $y_c > y > y_n$ | falls to $y_n$ | just below a change from mild to steep |
| S3 | $y < y_n < y_c$ | rises to $y_n$ | below a gate on a steep slope |
| H2, H3, A2, A3 | horizontal or adverse bed | like M2 and M3 | aprons, gates on flat beds |

### Computing a profile
Integration starts at a **control**, a section where the depth is known: a weir, a gate, critical depth at a brink or at a change to a steep slope. It runs in the direction information travels: subcritical profiles **upstream** from a downstream control, supercritical ones **downstream** from an upstream control.

The **direct step method** (for prismatic channels) picks depths and finds the distance between them from the energy balance,

$$\\Delta x = \\frac{E_2 - E_1}{S_0 - \\bar S_f}$$

with $\\bar S_f$ the mean friction slope of the two sections. The **standard step method** works the other way for natural rivers: the sections are fixed at surveyed stations and the water level at each is iterated until the energy balance closes — the core of every one-dimensional flood model. Both are stepwise integrations of an ordinary differential equation ([[math:euler-method]]).

For scale: a weir that holds a river at 4 m where its normal depth is 2.3 m (slope 0.5 m per km) still raises the water by 1 % some 8 km upstream — more than twice the 3.4 km at which a level line from the weir would meet the normal-depth line.
`,
  ideas: [
    'Gradually varied flow changes depth slowly, with hydrostatic pressure and Manning friction at the local depth.',
    '$dy/dx = (S_0 - S_f)/(1 - \\mathrm{Fr}^2)$: the depth tends to normal depth far away and changes rapidly near critical depth.',
    'Slopes are mild ($y_n > y_c$) or steep ($y_n < y_c$); with three zones this gives the M and S profiles, plus H and A.',
    'Subcritical profiles are computed upstream from a downstream control; supercritical profiles downstream from an upstream one.',
    'The direct step method finds distances between chosen depths; the standard step method finds depths at fixed stations.'
  ],
  pitfalls: [
    'A dam affects the river only as far as its reservoir appears to reach — The M1 backwater approaches normal depth only asymptotically; it can raise flood levels many kilometres upstream.',
    'A profile can be computed from either end — The calculation must start from the control and follow the direction information travels; integrating a subcritical profile downstream is unstable and wrong.',
    'The GVF equation gives the water surface through a hydraulic jump — Near critical depth dy/dx becomes infinite and the gradual assumptions fail; jumps are placed with the momentum equation instead.'
  ],
  formulas: [
    {
      name: 'Equation of gradually varied flow',
      expr: 'dydx = (S0 - Sf)/(1 - Fr^2)', tex: "y' = \\dfrac{S_0 - S_f}{1 - \\mathrm{Fr}^2}",
      vars: {
        dydx: { name: 'rate of change of depth along the channel, dy/dx (m per m)', signed: true, tex: "y'" },
        S0: { name: 'bed slope', value: 0.001, signed: true, tex: 'S_0' },
        Sf: { name: 'friction slope', value: 0.0004, tex: 'S_f' },
        Fr: { name: 'Froude number', value: 0.4, tex: '\\mathrm{Fr}' }
      },
      note: 'x increases downstream. Positive dy/dx: the water deepens downstream. Negative S₀ is an adverse slope.',
      stories: { dydx: 'At a section the bed slope is {S0}, the friction slope {Sf} and the Froude number {Fr}. How fast does the depth change along the channel?' }
    },
    {
      name: 'Friction slope (Manning)',
      expr: 'Sf = n^2*V^2/R^(4/3)', tex: 'S_f = \\dfrac{n^2 V^2}{R^{4/3}}',
      vars: {
        Sf: { name: 'friction slope (m per m)', tex: 'S_f' },
        n: { name: 'Manning n (SI units)', value: 0.03, min: 0.009, max: 0.08 },
        V: { name: 'mean velocity', q: 'speed', unit: 'm/s', value: 0.8 },
        R: { name: 'hydraulic radius', q: 'length', unit: 'm', value: 3.5 }
      },
      note: 'The slope of the energy line if the flow at this depth were uniform.'
    },
    {
      name: 'Direct step',
      expr: 'dx = (E2 - E1)/(S0 - Sf)', tex: '\\Delta x = \\dfrac{E_2 - E_1}{S_0 - \\bar{S}_f}',
      vars: {
        dx: { name: 'distance from section 1 to section 2 (downstream positive)', q: 'length', unit: 'm', signed: true, tex: '\\Delta x' },
        E1: { name: 'specific energy at section 1', q: 'length', unit: 'm', value: 4.029, tex: 'E_1' },
        E2: { name: 'specific energy at section 2', q: 'length', unit: 'm', value: 3.537, tex: 'E_2' },
        S0: { name: 'bed slope', value: 0.0005, signed: true, tex: 'S_0' },
        Sf: { name: 'mean friction slope of the two sections', value: 0.000102, tex: '\\bar{S}_f' }
      },
      note: 'A negative Δx means section 2 lies upstream of section 1, as when a backwater curve is computed from a weir.',
      stories: { dx: 'Between two depths the specific energy falls from {E1} to {E2}; the bed slope is {S0} and the mean friction slope {Sf}. How far apart are the sections?' }
    }
  ],
  examples: [
    {
      title: 'A backwater curve, two steps',
      q: 'A wide river ($q = 3$ m²/s, $n = 0.03$, $S_0 = 0.0005$) is held 4.0 m deep by a weir. Classify the profile and find how far upstream the depth has fallen to 3.5 m and to 3.0 m.',
      steps: [
        'Normal depth (wide channel): $y_n = (nq/\\sqrt{S_0})^{3/5} = (0.09/0.02236)^{0.6} = 2.31$ m. Critical: $y_c = (9/9.81)^{1/3} = 0.97$ m. Mild slope, $y > y_n$: an **M1** curve, computed upstream from the weir.',
        'At 4.0 m: $E = 4.0 + 9/(19.62 \\times 16) = 4.029$ m, $S_f = n^2 q^2/y^{10/3} = 7.97\\times10^{-5}$.',
        'At 3.5 m: $E = 3.537$ m, $S_f = 1.244\\times10^{-4}$. Mean $\\bar S_f = 1.02\\times10^{-4}$.',
        '$\\Delta x = (3.537 - 4.029)/(0.0005 - 0.000102) = -1234$ m: 3.5 m depth lies 1.23 km upstream.',
        'Next step, 3.5 → 3.0 m: $E = 3.051$ m, $S_f = 2.08\\times10^{-4}$, $\\Delta x = -1457$ m. Depth 3.0 m is about 2.7 km upstream of the weir.'
      ],
      a: 'An M1 backwater: 3.5 m about 1.2 km and 3.0 m about 2.7 km upstream of the weir.'
    }
  ],
  quiz: [
    { q: 'A dam on a river with a mild slope produces which profile upstream?', choices: ['M1', 'M2', 'S1', 'M3'], a: 0,
      why: 'The water behind the dam is deeper than normal on a mild slope: zone 1, an M1 backwater.' },
    { q: 'A subcritical water-surface profile is computed…', choices: ['downstream from an upstream control', 'upstream from a downstream control', 'in either direction', 'only from the normal depth'], a: 1,
      why: 'Disturbances travel upstream in subcritical flow, so the control is downstream and the calculation proceeds upstream.' },
    { q: 'Where does the gradually-varied-flow equation break down?', choices: ['near normal depth', 'near critical depth', 'at very large depths', 'on horizontal beds'], a: 1,
      why: 'At critical depth 1 − Fr² = 0 and dy/dx becomes infinite; the flow is rapidly varied there.' },
    { q: 'Water runs at normal depth down a steep chute. A weir is built at the bottom. What happens?', choices: ['an M1 curve reaches far upstream', 'a hydraulic jump forms, followed by an S1 curve up to the weir', 'nothing: supercritical flow ignores the weir', 'an S3 curve'], a: 1,
      why: 'The weir forces subcritical depth; supercritical flow can only reach it through a jump, after which the S1 profile rises to the weir.' },
    { q: 'At a section $S_0 = 0.001$, $S_f = 0.0004$ and Fr = 0.5. What is $dy/dx$?', answer: 0.0008,
      why: 'dy/dx = 0.0006/(1 − 0.25) = 0.0008: the water deepens by 0.8 m per km downstream (an M1 curve).' }
  ],
  problems: [
    { q: 'For the river in the example (q = 3 m²/s, n = 0.03, S₀ = 0.0005), what is the direct-step distance from the section 3.5 m deep to the one 3.0 m deep? Give its size in metres.', answer: 1457, unit: 'm', tol: 0.02,
      steps: ['$E(3.5) = 3.537$ m, $E(3.0) = 3.051$ m.', '$S_f(3.5) = 1.244\\times10^{-4}$, $S_f(3.0) = 2.08\\times10^{-4}$, mean $1.662\\times10^{-4}$.', '$\\Delta x = (3.051 - 3.537)/(0.0005 - 0.000166) = -1457$ m (upstream).'] }
  ],
  applications: ['Flood levels upstream of dams, weirs and bridges.', 'Where a jump will form below a gate, and how long a lined channel must be.', 'Drawdown into free outfalls in sewers and culverts.', 'One-dimensional river models used for flood mapping, built on the standard step method.'],
  history: 'Jean-Baptiste Bélanger proposed a step method for backwater curves in 1828. Jacques Bresse integrated the equation for wide channels in 1860, and in the twentieth century Bakhmeteff and Ven Te Chow produced the varied-flow tables and the classification of profiles that engineers used until computers took over.',
  sim: 'chan-gvf'
},

{
  id: 'weirs-flumes', parent: 'channel-flow', title: 'Weirs and flumes', level: 2,
  short: 'Structures that measure flow by forcing it through a known shape: water spilling over a sharp or broad crest, through a V-notch or a Parshall flume passes a discharge fixed by one upstream depth — the head — raised to the power 3/2 or 5/2.',
  keywords: ['weir', 'sharp-crested weir', 'broad-crested weir', 'V-notch', 'triangular weir', 'Thomson weir', 'rectangular weir', 'Parshall flume', 'venturi flume', 'long-throated flume', 'head', 'nappe', 'discharge coefficient', 'modular limit', 'submergence', 'open-channel flow measurement', 'low-head dam'],
  prereq: ['specific-energy', 'torricelli', 'froude-number'],
  related: ['dams-spillways', 'culverts-sluice', 'hydraulic-jump', 'flowmeters', 'venturi-meter', 'irrigation'],
  body: `
Build a wall across a channel and let the water spill over it: the depth upstream now depends only on how much is flowing. Measure the height of the water above the crest — the **head** $H$ — and you know the discharge. That is a weir, the simplest and one of the oldest flowmeters. A flume does the same with a narrowing instead of a wall. Both work by forcing the flow through critical depth ([[specific-energy]]), which ties depth and discharge together.

### The sharp-crested rectangular weir
A thin plate with a square upstream edge about 1–2 mm thick and a bevel behind. Adding up Torricelli velocities $\\sqrt{2gh}$ over the opening from the surface down to the crest gives $\\tfrac{2}{3}\\sqrt{2g}\\,bH^{3/2}$; in reality the surface draws down and the sheet of water — the **nappe** — contracts, so a discharge coefficient near 0.6 is needed:

$$Q = C_d\\,\\tfrac{2}{3}\\sqrt{2g}\\;b\\,H^{3/2}$$

For a weir spanning the full channel $C_d \\approx 0.611 + 0.08\\,H/P$ (Rehbock, with $P$ the height of the crest above the bed). A weir narrower than its channel has end contractions, allowed for by reducing the width by 0.1H for each side (Francis). The nappe must be **ventilated** — air must reach its underside — or it clings to the plate and the calibration fails. The head is read upstream, at four to five times the largest head, where the surface is not yet drawn down, usually in a stilling well.

### The V-notch
A rectangular weir is poor at small flows: the head becomes a few millimetres. In a triangular notch the width of the stream grows with the head as well, so

$$Q = C_d\\,\\tfrac{8}{15}\\sqrt{2g}\\,\\tan\\frac{\\theta}{2}\\,H^{5/2}$$

For a 90° notch $C_d \\approx 0.58$–0.59, giving $Q \\approx 1.38\\,H^{5/2}$ (m³/s with H in metres):

| Head $H$ | 90° V-notch flow |
|---|---|
| 50 mm | 0.77 L/s |
| 100 mm | 4.4 L/s |
| 200 mm | 25 L/s |
| 300 mm | 68 L/s |

Because $Q \\propto H^{5/2}$, a 1 % error in head is a 2.5 % error in flow: the head must be measured to a millimetre.

### Broad crests and flumes
Over a long, flat crest the water passes through critical depth, $y_c = \\tfrac{2}{3}H$:

$$Q = C_d\\, b\\sqrt{g}\\left(\\tfrac{2}{3}H\\right)^{3/2} \\approx 1.705\\,C_d\\,b\\,H^{3/2}$$

with $C_d$ of about 0.85–1.0 depending on crest length and rounding. Broad crests are robust and tolerate sediment. **Flumes** force critical flow by narrowing: the **Parshall flume** has a converging section, a short throat whose floor drops, and a diverging exit; it is rated empirically as $Q = K H_a^m$ with $m$ about 1.5–1.6 (a 1-foot, 305 mm throat gives roughly $Q = 0.69\\,H_a^{1.52}$). Flumes lose only about a quarter of the head a weir needs, pass silt without a pond to trap it, and are standard on irrigation canals and at wastewater works. Long-throated flumes can be rated from theory rather than by calibration.

### Free and submerged flow
A weir or flume measures only while the downstream water leaves the critical section alone. Once the tailwater drowns it, the upstream head depends on the tailwater too and the single-head rating fails. A sharp-crested weir needs the tailwater below its crest; Parshall flumes stay free up to a downstream-to-upstream head ratio of roughly 0.5–0.8 depending on size, and broad-crested weirs and long-throated flumes to about 0.7–0.9 — the **modular limit**.

> [!warn] Even a low weir can be deadly. Below it a hydraulic jump forms a recirculating roller that holds a swimmer or a boat against the falling water, and from upstream the drop is hidden behind a smooth line across the river. Stay out of the water near weirs, carry boats around them, and never go in to rescue — call your local emergency number and throw something that floats.
`,
  ideas: [
    'A weir or flume forces critical flow, so a single upstream head gives the discharge.',
    'Rectangular weirs follow $Q \\propto bH^{3/2}$; V-notches $Q \\propto \\tan(\\theta/2)\\,H^{5/2}$, which keeps small flows measurable.',
    'Sharp-crested weirs need a ventilated nappe and a head read well upstream, in a stilling well.',
    'Broad-crested weirs and flumes have critical depth 2H/3 on the crest or in the throat, lose little head and pass sediment.',
    'If the tailwater drowns the control, the single-head rating no longer holds.'
  ],
  pitfalls: [
    'The head is the depth of water at the weir plate — The surface draws down as it approaches the crest; the head is read four or five heads upstream, where the surface is still level.',
    'A V-notch is accurate at every flow because its law is exact — Its coefficient changes at very small heads (surface tension and viscosity) and a 1 mm error in a 50 mm head is a 5 % error in flow.',
    'A flume or weir keeps measuring when flooded from downstream — Once submerged beyond its modular limit, the discharge depends on both heads and a single-head reading overestimates or underestimates it.'
  ],
  formulas: [
    {
      name: 'Sharp-crested rectangular weir',
      expr: 'Q = Cd*(2/3)*sqrt(2*g)*b*H^(3/2)', tex: 'Q = C_d\\,\\tfrac{2}{3}\\sqrt{2g}\\;b\\,H^{3/2}',
      vars: {
        Q: { name: 'discharge', q: 'flowrate', unit: 'm³/s' },
        Cd: { name: 'discharge coefficient', value: 0.62, min: 0.58, max: 0.75, tex: 'C_d' },
        g: { const: 'g' },
        b: { name: 'crest width', q: 'length', unit: 'm', value: 1.5 },
        H: { name: 'head above the crest', q: 'length', unit: 'm', value: 0.3 }
      },
      note: 'Full-width weir: Cd ≈ 0.611 + 0.08 H/P. Contracted weir: use b − 0.1 n H for n end contractions.',
      stories: { Q: 'Water stands {H} above the crest of a sharp-crested weir {b} wide (Cd = {Cd}). What is the discharge?', H: 'A weir {b} wide (Cd = {Cd}) passes {Q}. What is the head over the crest?' }
    },
    {
      name: 'V-notch (triangular) weir',
      expr: 'Q = Cd*(8/15)*sqrt(2*g)*tan(theta/2)*H^(5/2)', tex: 'Q = C_d\\,\\tfrac{8}{15}\\sqrt{2g}\\,\\tan\\dfrac{\\theta}{2}\\,H^{5/2}',
      vars: {
        Q: { name: 'discharge', q: 'flowrate', unit: 'L/s' },
        Cd: { name: 'discharge coefficient', value: 0.585, min: 0.56, max: 0.62, tex: 'C_d' },
        g: { const: 'g' },
        theta: { name: 'notch angle', q: 'angle', unit: '°', value: 90, min: 10, max: 120 },
        H: { name: 'head above the vertex', q: 'length', unit: 'mm', value: 139 }
      },
      note: 'For a 90° notch $Q \\approx 1.38\\,H^{5/2}$ (m³/s, m). Keep the head above about 50 mm and below the notch depth.',
      stories: { Q: 'A {theta} V-notch (Cd = {Cd}) runs with {H} of head. What is the flow?', H: 'What head does {Q} produce on a {theta} V-notch with Cd = {Cd}?' }
    },
    {
      name: 'Broad-crested weir',
      expr: 'Q = Cd*b*sqrt(g)*(2*H/3)^(3/2)', tex: 'Q = C_d\\, b\\,\\sqrt{g}\\left(\\tfrac{2}{3}H\\right)^{3/2}',
      vars: {
        Q: { name: 'discharge', q: 'flowrate', unit: 'm³/s' },
        Cd: { name: 'discharge coefficient', value: 0.95, min: 0.85, max: 1.0, tex: 'C_d' },
        b: { name: 'crest width', q: 'length', unit: 'm', value: 3 },
        g: { const: 'g' },
        H: { name: 'upstream energy head above the crest', q: 'length', unit: 'm', value: 0.5 }
      },
      note: 'Critical depth 2H/3 on the crest. With $C_d = 1$, $Q = 1.705\\,b\\,H^{3/2}$ in SI.',
      stories: { Q: 'A broad-crested weir {b} wide (Cd = {Cd}) has an upstream head of {H}. What does it pass?' }
    }
  ],
  examples: [
    {
      title: 'Reading a V-notch',
      q: 'A 90° V-notch ($C_d = 0.585$) on a factory outfall shows a head of 139 mm. What is the flow, and how much does a 2 mm reading error matter?',
      steps: [
        '$\\tfrac{8}{15}\\sqrt{2 \\times 9.81}\\tan 45° \\times 0.585 = 1.382$ (SI).',
        '$Q = 1.382 \\times 0.139^{2.5} = 1.382 \\times 7.20\\times10^{-3} = 9.95\\times10^{-3}$ m³/s ≈ 10.0 L/s.',
        'At 141 mm: $Q = 1.382 \\times 0.141^{2.5} = 10.3$ L/s — 3.6 % more for a 1.4 % change in head.'
      ],
      a: 'About 10.0 L/s; a 2 mm error shifts it by about 3.6 %.'
    },
    {
      title: 'A rectangular weir',
      q: 'A full-width sharp-crested weir 1.5 m wide has a head of 0.30 m. Take $C_d = 0.62$. What is the discharge?',
      steps: [
        '$Q = 0.62 \\times \\tfrac{2}{3} \\times \\sqrt{19.62} \\times 1.5 \\times 0.3^{1.5}$.',
        '$= 0.62 \\times 0.667 \\times 4.43 \\times 1.5 \\times 0.164 = 0.451$ m³/s.'
      ],
      a: 'About 0.45 m³/s.'
    }
  ],
  quiz: [
    { q: 'Doubling the head on a V-notch multiplies the flow by about…', choices: ['2', '2.8', '4', '5.7'], a: 3,
      why: '$Q \\propto H^{5/2}$ and $2^{2.5} = 5.66$.' },
    { q: 'Why must the nappe of a sharp-crested weir be ventilated?', choices: ['to keep the water cool', 'so the pressure beneath the nappe stays atmospheric and the calibration holds', 'to let fish pass', 'to raise the head'], a: 1,
      why: 'Without air beneath it, the nappe clings to the plate, the pressure under it falls and more water is sucked over than the formula predicts.' },
    { q: 'On a broad-crested weir the depth on the crest is about ___ of the upstream energy head.', choices: ['1/3', '1/2', '2/3', 'all'], a: 2,
      why: 'The flow on the crest is critical, and at critical depth $E = 1.5\\,y_c$, so $y_c = 2H/3$.' },
    { q: 'A flume running submerged still gives the flow from its upstream head alone.', a: false,
      why: 'Beyond the modular limit the downstream level affects the upstream head, and a second head reading and a submerged-flow correction are needed.' },
    { q: 'What is the flow over a 90° V-notch (Cd = 0.585) with a head of 0.2 m, in L/s?', answer: 24.7, unit: 'L/s',
      why: '$Q = 1.382 \\times 0.2^{2.5} = 1.382 \\times 0.01789 = 0.0247$ m³/s.' }
  ],
  problems: [
    { q: 'A broad-crested weir 3 m wide (Cd = 0.95) has an upstream head of 0.5 m. What does it pass?', answer: 1.72, unit: 'm³/s', tol: 0.02,
      steps: ['$Q = 0.95 \\times 3 \\times \\sqrt{9.81} \\times (0.333)^{1.5}$.', '$= 0.95 \\times 3 \\times 3.13 \\times 0.1925 = 1.72$ m³/s.'] },
    { q: 'What head gives 10 L/s over a 90° V-notch whose rating is $Q = 1.38\\,H^{5/2}$? Answer in mm.', answer: 139, unit: 'mm', tol: 0.02,
      steps: ['$H = (0.010/1.38)^{0.4} = 0.139$ m.'] }
  ],
  applications: ['Gauging stations on small streams and irrigation canals.', 'Effluent measurement at treatment works with V-notches and Parshall flumes.', 'Laboratory calibration of pumps and flowmeters.', 'Spillway crests, whose ogee shape copies the nappe of a sharp-crested weir.'],
  history: 'James Thomson, brother of Lord Kelvin, proposed the triangular notch around 1860. James B. Francis\'s Lowell Hydraulic Experiments (1855) gave American mills their rectangular-weir formula for a century, and Ralph Parshall developed his flume at Fort Collins, Colorado, in the early 1920s to share irrigation water fairly between farmers.',
  sim: 'chan-vnotch'
},

{
  id: 'culverts-sluice', parent: 'channel-flow', title: 'Sluice gates and culverts', level: 2,
  short: 'A sluice gate releases water under its edge as a fast, thin jet; a culvert carries a stream under a road. Both run either free — set by the upstream level alone — or drowned by the tailwater, and a culvert\'s capacity is limited either at its inlet or by friction and the level at its outlet.',
  keywords: ['sluice gate', 'vena contracta', 'contraction coefficient', 'free flow', 'submerged flow', 'drowned gate', 'radial gate', 'Tainter gate', 'culvert', 'inlet control', 'outlet control', 'headwater', 'tailwater', 'entrance loss', 'box culvert'],
  prereq: ['specific-energy', 'hydraulic-jump', 'minor-losses'],
  related: ['weirs-flumes', 'orifice-plate', 'gradually-varied-flow', 'stormwater-floods', 'dams-spillways', 'manning-equation'],
  body: `
### The sluice gate
A vertical plate is raised a height $a$ above the bed. Water in the pool upstream, deep and slow, accelerates under the edge, and the jet goes on contracting for a short way beyond the gate, to the **vena contracta**, whose depth is $y_2 = C_c a$ with $C_c \\approx 0.61$ for a sharp-edged vertical gate. From the pool to the vena contracta hardly any energy is lost, so $y_1 + q^2/2gy_1^2 = y_2 + q^2/2gy_2^2$, which gives

$$Q = C_d\\,b\\,a\\sqrt{2 g y_1}, \\qquad C_d = \\frac{C_c}{\\sqrt{1 + C_c\\,a/y_1}}$$

$C_d$ is 0.55–0.60 in free flow. The jet at the vena contracta is supercritical; downstream it must return to the river's subcritical flow through a hydraulic jump, whose position the tailwater decides.

### Free or drowned
- **Free flow**: the tailwater is lower than the sequent depth of the jet. The jump forms downstream, after a short M3 or H3 curve, and the discharge depends only on the upstream level and the opening — the gate is a flowmeter.
- **Submerged flow**: the tailwater is higher. The jump is pushed back against the gate and drowns the jet under a turbulent roller. The water standing over the jet pushes back, so the discharge now depends on both levels and falls as the tailwater rises. It is found by combining energy from the pool to the vena contracta with momentum from the vena contracta to the tailwater.

**Radial (Tainter) gates** — a curved skin plate on arms pivoting on trunnions — send the water load through the pivot, so they lift easily; they control most large spillways, with $C_c$ of 0.6–0.8 depending on the lip angle.

### Culverts
A culvert — a pipe or box under an embankment — looks trivial and is one of the commonest causes of road flooding. Two things can limit it.
- **Inlet control**: the barrel could carry more than the entrance admits. Water enters, passes through critical depth near the entrance and runs part-full and supercritical down the barrel. The headwater depends only on the inlet — its area, shape and edge. With the inlet unsubmerged it behaves like a weir ($Q \\propto HW^{3/2}$); once the headwater is above about 1.2 times its height it acts as an orifice, $Q = C_d A\\sqrt{2gh}$, with $h$ measured to the centre of the opening.
- **Outlet control**: the barrel runs full (or a high tailwater backs up into it) and the head needed is the sum of the entrance, friction and exit losses,

$$H = \\left(1 + k_e + \\frac{2g\\,n^2 L}{R^{4/3}}\\right)\\frac{V^2}{2g}$$

where $H$ is the difference between headwater and tailwater levels for a full barrel, the 1 is the exit loss and $k_e$ the entrance loss:

| Inlet | $k_e$ |
|---|---|
| Thin pipe projecting from the fill | 0.9 |
| Pipe mitred to the slope of the fill | 0.7 |
| Square-edged headwall | 0.5 |
| Groove or socket end, or rounded edge | 0.2 |

Designers compute the headwater both ways and take the larger. They also allow for blockage by debris, protect the outlet against scour, check that fish can pass, and make sure a flood larger than the design one can flow over the road without washing out the embankment.

> [!warn] Culvert inlets and gated outlets are deadly in flood: they draw water — and anything in it — in with great force, and a barrel is a confined space with no way out. Keep away from inlets in moving water. Inspection inside a culvert or behind a gate needs the flow isolated and confined-space procedures.
`,
  ideas: [
    'Under a sluice gate the jet contracts to $C_c a$ ($C_c \\approx 0.61$); free flow is $Q = C_d\\,b\\,a\\sqrt{2 g y_1}$ with $C_d \\approx 0.55$–0.60.',
    'A gate flows free while the tailwater is below the sequent depth of its jet; above it the gate is drowned and passes less.',
    'Radial gates carry the water load through their pivot and control most large spillways.',
    'A culvert is in inlet control when its entrance limits the flow, in outlet control when barrel friction and tailwater do.',
    'Rounding or bevelling a culvert inlet cuts the entrance loss from 0.5–0.9 to about 0.2.'
  ],
  pitfalls: [
    'A sluice gate\'s flow depends on the downstream level — Not in free flow: until the tailwater drowns the jet, only the upstream depth and the opening matter.',
    'A smoother culvert barrel always carries more — In inlet control the entrance limits the flow; improving the barrel changes nothing, while improving the inlet does.',
    'The jet leaving a gate is as deep as the opening — It contracts to about 61 % of the opening at the vena contracta, a short distance downstream.'
  ],
  formulas: [
    {
      name: 'Sluice gate in free flow',
      expr: 'Q = Cd*b*a*sqrt(2*g*y1)', tex: 'Q = C_d\\,b\\,a\\sqrt{2 g\\,y_1}',
      vars: {
        Q: { name: 'discharge', q: 'flowrate', unit: 'm³/s' },
        Cd: { name: 'discharge coefficient', value: 0.582, min: 0.5, max: 0.62, tex: 'C_d' },
        b: { name: 'gate width', q: 'length', unit: 'm', value: 2 },
        a: { name: 'gate opening', q: 'length', unit: 'm', value: 0.4 },
        g: { const: 'g' },
        y1: { name: 'upstream depth', q: 'length', unit: 'm', value: 2.5, tex: 'y_1' }
      },
      stories: { Q: 'A sluice gate {b} wide is opened {a} with {y1} of water upstream (Cd = {Cd}). What is the discharge?', a: 'A gate {b} wide must release {Q} with {y1} of water behind it (Cd = {Cd}). How far must it open?' }
    },
    {
      name: 'Discharge coefficient of a sluice gate',
      expr: 'Cd = Cc/sqrt(1 + Cc*a/y1)', tex: 'C_d = \\dfrac{C_c}{\\sqrt{1 + C_c\\,a/y_1}}',
      vars: {
        Cd: { name: 'discharge coefficient', tex: 'C_d' },
        Cc: { name: 'contraction coefficient', value: 0.61, min: 0.58, max: 0.75, tex: 'C_c' },
        a: { name: 'gate opening', q: 'length', unit: 'm', value: 0.4 },
        y1: { name: 'upstream depth', q: 'length', unit: 'm', value: 2.5, tex: 'y_1' }
      },
      note: 'From the energy equation between the pool and the vena contracta, whose depth is $C_c a$.',
      practice: { unknowns: ['Cd'] }
    },
    {
      name: 'Culvert in inlet control (submerged inlet)',
      expr: 'Q = Cd*A*sqrt(2*g*h)', tex: 'Q = C_d\\,A\\sqrt{2 g\\,h}',
      vars: {
        Q: { name: 'discharge', q: 'flowrate', unit: 'm³/s' },
        Cd: { name: 'inlet discharge coefficient', value: 0.6, min: 0.5, max: 0.9, tex: 'C_d' },
        A: { name: 'barrel area', q: 'area', unit: 'm²', value: 1.13 },
        g: { const: 'g' },
        h: { name: 'headwater above the centre of the inlet', q: 'length', unit: 'm', value: 1.5 }
      },
      note: 'Orifice behaviour, once the headwater is above about 1.2 times the inlet height. Rounded and bevelled edges raise $C_d$.',
      stories: { Q: 'A culvert inlet of {A} (Cd = {Cd}) is drowned, with the headwater {h} above its centre. What can it pass?', h: 'How high above the centre of a {A} inlet (Cd = {Cd}) must the water rise to pass {Q}?' }
    },
    {
      name: 'Culvert in outlet control (full barrel)',
      expr: 'H = (1 + ke + 2*g*n^2*L/R^(4/3))*V^2/(2*g)',
      tex: 'H = \\left(1 + k_e + \\dfrac{2 g\\, n^2 L}{R^{4/3}}\\right)\\dfrac{V^2}{2g}',
      vars: {
        H: { name: 'headwater minus tailwater level', q: 'length', unit: 'm' },
        ke: { name: 'entrance loss coefficient', value: 0.5, min: 0.1, max: 1, tex: 'k_e' },
        g: { const: 'g' },
        n: { name: 'Manning n of the barrel (SI units)', value: 0.013, min: 0.009, max: 0.04 },
        L: { name: 'barrel length', q: 'length', unit: 'm', value: 30 },
        R: { name: 'hydraulic radius of the barrel (D/4 for a pipe)', q: 'length', unit: 'm', value: 0.3 },
        V: { name: 'velocity in the barrel', q: 'speed', unit: 'm/s', value: 2.65 }
      },
      stories: { H: 'A culvert barrel {L} long (n = {n}, R = {R}, entrance loss coefficient {ke}) runs full at {V}. How far above the tailwater must the headwater stand?' }
    }
  ],
  examples: [
    {
      title: 'Free flow under a gate',
      q: 'A sluice gate 2 m wide is opened 0.4 m with 2.5 m of water upstream ($C_c = 0.61$). Find the discharge, the jet at the vena contracta, and the tailwater depth at which the gate would be drowned.',
      steps: [
        '$C_d = 0.61/\\sqrt{1 + 0.61 \\times 0.4/2.5} = 0.61/1.048 = 0.582$.',
        '$Q = 0.582 \\times 2 \\times 0.4 \\times \\sqrt{2 \\times 9.81 \\times 2.5} = 0.466 \\times 7.00 = 3.26$ m³/s.',
        'Vena contracta: $y_2 = 0.61 \\times 0.4 = 0.244$ m, $V_2 = 3.26/(2 \\times 0.244) = 6.68$ m/s, $\\mathrm{Fr}_2 = 6.68/\\sqrt{9.81 \\times 0.244} = 4.32$.',
        'Sequent depth: $y_3 = \\frac{0.244}{2}\\left(\\sqrt{1 + 8 \\times 4.32^2} - 1\\right) = 1.37$ m.',
        'Tailwater below 1.37 m: free flow with a jump downstream; above it the jump drowns the jet and the flow falls.'
      ],
      a: 'Q ≈ 3.26 m³/s; a 0.24 m jet at 6.7 m/s (Fr 4.3); the gate drowns once the tailwater exceeds about 1.37 m.'
    },
    {
      title: 'A culvert in outlet control',
      q: 'A 1.2 m concrete pipe culvert 30 m long ($n = 0.013$, square-edged headwall, $k_e = 0.5$) runs full carrying 3 m³/s. How far must the headwater stand above the tailwater?',
      steps: [
        '$A = \\pi \\times 1.2^2/4 = 1.131$ m², $V = 3/1.131 = 2.65$ m/s, $V^2/2g = 0.359$ m.',
        '$R = D/4 = 0.3$ m, $R^{4/3} = 0.201$; friction term $2 \\times 9.81 \\times 0.013^2 \\times 30/0.201 = 0.495$.',
        '$H = (1 + 0.5 + 0.495) \\times 0.359 = 0.72$ m.',
        'A rounded inlet ($k_e = 0.2$) would save $0.3 \\times 0.359 = 0.11$ m of headwater.'
      ],
      a: 'About 0.72 m of headwater above the tailwater.'
    }
  ],
  quiz: [
    { q: 'A gate is in free flow. The tailwater rises a little but stays below the sequent depth of the jet. The discharge…', choices: ['falls a lot', 'does not change', 'reverses', 'doubles'], a: 1,
      why: 'In free flow the jump moves but the flow under the gate is set by the upstream depth and the opening alone.' },
    { q: 'What is the depth of the jet at the vena contracta under a gate opened 0.5 m ($C_c = 0.61$)?', answer: 0.305, unit: 'm',
      why: '$y_2 = C_c a = 0.61 \\times 0.5 = 0.305$ m.' },
    { q: 'In inlet control, lining the culvert barrel to make it smoother increases its capacity.', a: false,
      why: 'In inlet control the entrance is the bottleneck; the barrel already has spare capacity.' },
    { q: 'Which inlet has the smallest entrance loss?', choices: ['a thin pipe projecting from the fill', 'a square-edged headwall', 'a rounded or bevelled edge', 'a pipe mitred to the slope'], a: 2,
      why: 'Rounding lets the flow follow the edge without separating: $k_e \\approx 0.2$, against 0.5 for a square edge and 0.9 for a projecting thin pipe.' },
    { q: 'A sluice gate becomes drowned when…', choices: ['the upstream depth is less than the opening', 'the tailwater exceeds the sequent depth of the jet', 'the jet is supercritical', 'the gate is radial'], a: 1,
      why: 'Then the jump is pushed back against the gate and covers the jet.' }
  ],
  problems: [
    { q: 'A sluice gate 3 m wide is opened 0.3 m with 2 m of water upstream; $C_d = 0.58$. What is the discharge?', answer: 3.27, unit: 'm³/s', tol: 0.02,
      steps: ['$Q = 0.58 \\times 3 \\times 0.3 \\times \\sqrt{2 \\times 9.81 \\times 2}$', '$= 0.522 \\times 6.26 = 3.27$ m³/s.'] },
    { q: 'A culvert inlet of 1.13 m² ($C_d = 0.6$) is submerged with the headwater 2 m above its centre. What is its capacity in inlet control?', answer: 4.25, unit: 'm³/s', tol: 0.02,
      steps: ['$Q = 0.6 \\times 1.13 \\times \\sqrt{2 \\times 9.81 \\times 2} = 0.678 \\times 6.26 = 4.25$ m³/s.'] }
  ],
  applications: ['Head regulators and cross-regulators on irrigation canals.', 'Radial gates on spillways and river barrages.', 'Road and railway culverts, checked for inlet and outlet control at the design flood.', 'Laboratory flumes, where a gate makes supercritical flow for jump experiments.'],
  history: 'Jeremiah Burnham Tainter patented the radial gate in 1886 for dams on Wisconsin rivers, and it still carries his name. Culvert design charts for inlet and outlet control were produced by the US Bureau of Public Roads in the 1960s and live on in the Federal Highway Administration\'s culvert manual.',
  sim: 'chan-sluice'
},

/* ====================================================================== WATER RESOURCES */
{
  id: 'dams-spillways', parent: 'water-resources', title: 'Dams and spillways', level: 2,
  short: 'Dams store water and raise its level; spillways pass floods safely past them, and stilling basins destroy the energy of the falling water. The designer balances the water\'s thrust and uplift against the dam\'s weight and strength, and sizes the spillway for a rare flood.',
  keywords: ['dam', 'gravity dam', 'arch dam', 'embankment dam', 'earthfill', 'rockfill', 'spillway', 'ogee crest', 'stilling basin', 'flip bucket', 'ski-jump spillway', 'uplift', 'sliding', 'overturning', 'probable maximum flood', 'labyrinth weir', 'morning-glory spillway', 'dam safety'],
  prereq: ['tanks-dams-pressure', 'weirs-flumes', 'hydraulic-jump'],
  related: ['hydropower', 'pumped-storage', 'force-on-plane-surface', 'centre-of-pressure', 'stormwater-floods', 'groundwater-darcy', 'culverts-sluice'],
  body: `
A dam does two things: it stores water, evening out wet and dry seasons, and it raises the water, giving head for turbines and gravity supply. Everything else in its design follows from the forces of the water on it and from the floods that must be passed safely around or over it.

### Kinds of dam
| Type | How it resists the water | Suits |
|---|---|---|
| Concrete gravity | its own weight, and friction on the rock | wide valleys on sound rock |
| Arch | curves the thrust into the valley sides | narrow gorges with strong rock walls |
| Buttress | a thin slab carried on ribs | saving concrete (now rare) |
| Embankment (earthfill or rockfill) | mass, with a clay core or a concrete facing to seal it | almost any site — most of the world's dams |

Hoover Dam (1936) is an arch-gravity dam 221 m high; the Three Gorges dam (completed 2006, full in 2010) is a concrete gravity dam 181 m high.

### Forces on a gravity dam
The water pushes horizontally with the hydrostatic thrust, per metre of dam length $\\rho g H^2/2$, acting a third of the way up ([[tanks-dams-pressure]], [[centre-of-pressure]]): 4.4 MN per metre behind a 30 m head. Water seeping through the foundation pushes up on the base — **uplift**, up to $\\rho g H$ at the heel — and cancels part of the weight. A grout curtain and drainage holes behind it cut uplift to about a third. Silt, ice, waves and earthquakes add further loads. The designer checks **sliding**, **overturning** (the resultant must fall within the middle third of the base, so the heel is not in tension) and the stresses in concrete and rock:

$$\\mathrm{FS} = \\frac{\\mu\\,(W - U)}{F}$$

with friction coefficients $\\mu$ of about 0.65–0.8 for concrete on sound rock; codes add the cohesion of the rock and set minimum factors for each load case.

### Spillways
For an embankment dam, overtopping usually means failure, so the spillway must pass the design flood with margin — anything from the 1 % annual-chance flood for a farm pond to the probable maximum flood, or the 1-in-10 000-year flood, for large dams whose failure would endanger lives, according to national hazard rules. The classic crest is the **ogee**, shaped to the underside of the nappe of a sharp-crested weir so that the water flows over it at close to atmospheric pressure:

$$Q = C\\,L\\,H^{3/2}$$

with $C \\approx 2.1$–2.2 (SI units) at the design head (above it, pressures on the crest drop below atmospheric). Other forms: chutes and side-channel spillways, shaft ("morning-glory") spillways, **labyrinth** weirs whose folded crest packs a long length into a narrow width, gated crests with radial gates, and fuse plugs — embankments built to wash out on purpose in an extreme flood. On high chutes the water exceeds 30 m/s and can cavitate the concrete, so aerators inject air along the floor.

### Stilling the water
Water falling 50 m arrives at close to $\\sqrt{2g \\times 50} = 31$ m/s. Its energy must be destroyed before it reaches the riverbed:
- **stilling basins**, concrete aprons where a [[hydraulic-jump]] forms, with chute blocks, baffle piers and an end sill to hold it — the tailwater must match the sequent depth over the whole range of flows;
- **flip buckets** (ski jumps), which throw the jet into the air to land in a plunge pool far from the dam, on good rock;
- **roller buckets**, where the tailwater is deep.

> [!warn] Rivers below dams can rise within minutes when gates open or turbines start, often with no rain in sight. Heed warning signs and sirens, keep off spillways, aprons and the banks immediately downstream, and never swim near intakes or outlets. Overtopping and internal erosion ("piping") each cause roughly a third of embankment-dam failures; dams are inspected and monitored for both.
`,
  ideas: [
    'The hydrostatic thrust on a dam is ρgH²/2 per metre of length, acting at H/3 above the base.',
    'Uplift under the base reduces the effective weight; grout curtains and drains cut it to about a third.',
    'A gravity dam is checked for sliding, overturning and stresses; FS = μ(W − U)/F for sliding on friction alone.',
    'Ogee spillways follow $Q = C L H^{3/2}$, with $C \\approx 2.1$–2.2 at the design head.',
    'Stilling basins, flip buckets and roller buckets destroy the energy of the falling water before it reaches the river.'
  ],
  pitfalls: [
    'A long reservoir pushes harder on the dam than a short one — The thrust depends only on the depth of water at the dam face (and the dam\'s length), not on how far the reservoir extends.',
    'The weight of a gravity dam acts in full against sliding — Uplift from water under the base subtracts from it; without drains a dam can lose a third or more of its effective weight.',
    'A spillway only needs to pass the largest flood on record — Records are short; dams are designed for floods with chances of 1 % down to 0.01 % a year, or the probable maximum flood, depending on the harm a failure would do.'
  ],
  formulas: [
    {
      name: 'Ogee spillway discharge',
      expr: 'Q = C*L*H^(3/2)', tex: 'Q = C\\,L\\,H^{3/2}',
      vars: {
        Q: { name: 'discharge', q: 'flowrate', unit: 'm³/s' },
        C: { name: 'discharge coefficient C (SI units, m½/s)', value: 2.15, min: 1.7, max: 2.3 },
        L: { name: 'effective crest length', q: 'length', unit: 'm', value: 40 },
        H: { name: 'head above the crest', q: 'length', unit: 'm', value: 2.5 }
      },
      note: 'C ≈ 2.1–2.2 at the design head; piers and abutments reduce the effective length.',
      stories: { Q: 'An ogee spillway {L} long (C = {C}) runs with {H} of head. What does it pass?', H: 'An ogee spillway {L} long (C = {C}) must pass {Q}. What head over the crest does that need?' }
    },
    {
      name: 'Hydrostatic thrust on a vertical dam face',
      expr: 'F = rhoW*g*b*H^2/2', tex: 'F = \\tfrac{1}{2}\\,\\rho_w\\,g\\,b\\,H^2',
      vars: {
        F: { name: 'horizontal thrust', q: 'force', unit: 'MN' },
        rhoW: { const: 'rhoW' },
        g: { const: 'g' },
        b: { name: 'length of dam considered (1 m: per metre)', q: 'length', unit: 'm', value: 1, fixed: true },
        H: { name: 'water depth at the dam', q: 'length', unit: 'm', value: 30 }
      },
      note: 'It acts at H/3 above the base. Gauge pressure: the atmosphere acts on both faces.',
      stories: { F: 'Water stands {H} deep against a vertical dam face. What thrust does it exert on a {b} length of dam?' }
    },
    {
      name: 'Factor of safety against sliding (friction only)',
      expr: 'FS = mu*(W - U)/F', tex: '\\mathrm{FS} = \\dfrac{\\mu\\,(W - U)}{F}',
      vars: {
        FS: { name: 'factor of safety against sliding', tex: '\\mathrm{FS}' },
        mu: { name: 'friction coefficient, concrete on rock', value: 0.75, min: 0.5, max: 0.9 },
        W: { name: 'weight of the dam', q: 'force', unit: 'MN', value: 10.59 },
        U: { name: 'uplift', q: 'force', unit: 'MN', value: 1.47 },
        F: { name: 'horizontal water thrust', q: 'force', unit: 'MN', value: 4.41 }
      },
      stories: { FS: 'A gravity dam weighs {W} per metre, with {U} of uplift and {F} of water thrust; μ = {mu}. What is its factor of safety against sliding?', U: 'A dam weighing {W} per metre resists a thrust of {F} with μ = {mu}. How much uplift would bring its factor of safety down to {FS}?' }
    }
  ],
  examples: [
    {
      title: 'Why dams need drains',
      q: 'A concrete gravity dam (2400 kg/m³) has a triangular section 30 m high and 30 m wide at the base, with a vertical upstream face, and holds 30 m of water. Per metre of length, find the thrust and the factor of safety against sliding ($\\mu = 0.75$) with full uplift and with drains that cut the uplift to a third.',
      steps: [
        'Thrust: $F = \\tfrac{1}{2} \\times 1000 \\times 9.81 \\times 30^2 = 4.41$ MN, acting 10 m above the base.',
        'Weight: $W = 2400 \\times 9.81 \\times \\tfrac{1}{2} \\times 30 \\times 30 = 10.6$ MN.',
        'Full uplift (triangular, $\\rho g H$ at the heel to zero at the toe): $U = \\tfrac{1}{2} \\times 9810 \\times 30 \\times 30 = 4.41$ MN, so $\\mathrm{FS} = 0.75 \\times (10.6 - 4.41)/4.41 = 1.05$ — barely stable.',
        'With drains: $U = 1.47$ MN, $\\mathrm{FS} = 0.75 \\times 9.12/4.41 = 1.55$.'
      ],
      a: 'F ≈ 4.4 MN per metre; FS ≈ 1.05 with full uplift, ≈ 1.55 with drains.'
    },
    {
      title: 'Spillway capacity',
      q: 'An ogee spillway has a 40 m crest and a design head of 2.5 m ($C = 2.15$). What does it pass?',
      steps: ['$Q = 2.15 \\times 40 \\times 2.5^{1.5} = 2.15 \\times 40 \\times 3.95 = 340$ m³/s.'],
      a: 'About 340 m³/s.'
    }
  ],
  quiz: [
    { q: 'The hydrostatic thrust on a dam grows with the water depth…', choices: ['linearly', 'with its square', 'with its cube', 'not at all: only the length of the reservoir matters'], a: 1,
      why: 'F = ρgH²/2 per metre: the pressure grows with depth and so does the area it acts on.' },
    { q: 'Drains and a grout curtain under a gravity dam increase its safety against sliding.', a: true,
      why: 'They reduce the uplift U, leaving more of the weight W to press the dam onto its foundation.' },
    { q: 'Why is an ogee crest shaped like the underside of a free nappe?', choices: ['for appearance', 'so the water flows over it at near-atmospheric pressure, without separating or sucking on the concrete', 'to make a jump on the crest', 'to slow the water'], a: 1,
      why: 'At the design head the water follows the concrete just as it would fall freely; at higher heads the pressure on the crest falls below atmospheric.' },
    { q: 'What thrust does 50 m of water exert on one metre of dam, in MN?', answer: 12.3, unit: 'MN',
      why: 'F = ½ × 1000 × 9.81 × 50² = 12.3 MN.' },
    { q: 'Which is one of the two leading causes of embankment-dam failure (the other being internal erosion)?', choices: ['overtopping in floods', 'corrosion of the core', 'lightning', 'evaporation'], a: 0,
      why: 'Water flowing over an embankment erodes it quickly; that is why spillway capacity is so important.' }
  ],
  problems: [
    { q: 'An ogee spillway 60 m long with C = 2.2 must pass 500 m³/s. What head over the crest is needed?', answer: 2.43, unit: 'm', tol: 0.02,
      steps: ['$H = \\left(\\dfrac{500}{2.2 \\times 60}\\right)^{2/3} = 3.79^{2/3} = 2.43$ m.'] },
    { q: 'How high above the base does the resultant water thrust act on a vertical face holding 36 m of water?', answer: 12, unit: 'm', tol: 0.02,
      steps: ['The pressure is triangular, so the resultant acts at the centroid of the triangle, H/3 = 12 m above the base.'] }
  ],
  applications: ['Water-supply reservoirs, irrigation storage and flood control.', 'Hydropower and pumped storage.', 'Stilling basins below spillways, barrages and outlet works.', 'Tailings dams in mining, which need the same hydraulic care.'],
  history: 'The oldest known large dam, Sadd el-Kafara in Egypt (about 2600 BC), was washed away by a flood soon after it was built. The ogee crest grew out of Henri Bazin\'s measurements of weir nappes in the 1880s and 1890s, and the modern stilling basins were developed by model tests at the US Bureau of Reclamation in the 1950s.',
  sim: 'chan-jump'
},

{
  id: 'groundwater-darcy', parent: 'water-resources', title: 'Groundwater and Darcy\'s law', level: 2,
  short: 'Water moving slowly through the pores of soil and rock follows Darcy\'s law: the flow is proportional to the hydraulic gradient and to the hydraulic conductivity, which ranges over more than ten orders of magnitude from gravel to clay. Pumping a well draws the water down in a cone.',
  keywords: ['groundwater', "Darcy's law", 'hydraulic conductivity', 'permeability', 'aquifer', 'confined aquifer', 'unconfined aquifer', 'water table', 'porosity', 'seepage velocity', 'well', 'drawdown', 'cone of depression', 'Thiem equation', 'Dupuit', 'transmissivity', 'pumping test', 'subsidence'],
  prereq: ['energy-equation', 'laminar-pipe-flow', 'physics:viscosity'],
  related: ['water-supply', 'dams-spillways', 'irrigation', 'stormwater-floods', 'math:differential-equations'],
  body: `
Beneath most land lies water filling the pores and cracks of sand, gravel and rock. It provides about half of the water people use at home and around a quarter of the water withdrawn for irrigation (UN World Water Development Report, 2022), and it moves slowly — metres a day at most, often metres a year.

### Darcy's law
In 1856 Henry Darcy, designing sand filters for the fountains of Dijon, found that the flow through a column of sand is proportional to the drop in head across it and to its area, and inversely proportional to its length:

$$Q = K A \\frac{\\Delta h}{L}, \\qquad q = \\frac{Q}{A} = K\\,i$$

Here $h$ is the **hydraulic head** — elevation plus pressure head; the velocity head is negligible — $i = \\Delta h/L$ is the hydraulic gradient, and $K$ the **hydraulic conductivity** (m/s). The **Darcy flux** $q$ is the flow per unit of *total* area; the water itself moves only through the connected pores, faster, at the **seepage velocity** $v = q/n_e$, with $n_e$ the effective porosity (0.1–0.3 for sands and gravels). Darcy's law is laminar flow through a maze of tiny channels — the porous-media cousin of [[laminar-pipe-flow]] — and holds while the pore Reynolds number stays below about 1–10, which is true everywhere except in coarse gravel near wells and in karst caves. $K$ depends on the fluid as well as the ground: $K = k\\rho g/\\mu$, where the intrinsic permeability $k$ belongs to the rock (one darcy, about $10^{-12}$ m², gives $K \\approx 10^{-5}$ m/s for water at 20 °C).

| Material | $K$ (m/s) |
|---|---|
| Clean gravel | $10^{-3}$ – $10^{-1}$ |
| Coarse sand | $10^{-4}$ – $10^{-3}$ |
| Fine sand | $10^{-5}$ – $10^{-4}$ |
| Silty sand, loess | $10^{-7}$ – $10^{-5}$ |
| Silt | $10^{-8}$ – $10^{-6}$ |
| Clay | $10^{-12}$ – $10^{-9}$ |
| Sandstone | $10^{-10}$ – $10^{-6}$ |
| Fractured rock, karst limestone | $10^{-8}$ – $10^{-2}$ |
| Unfractured granite | $10^{-13}$ – $10^{-10}$ |

### Aquifers
An **unconfined** aquifer has a water table open to the air through the soil above it; pumping drains its pores. A **confined** aquifer is sealed between clay layers and is under pressure: water in a well rises above the aquifer's top to the *potentiometric surface*, and flows out by itself if that surface is above ground (an artesian well). Water there comes from the slight expansion of the water and compression of the grains, so the drop in pressure from pumping spreads fast and far. An aquifer's **transmissivity** is $T = K b$, with $b$ its thickness.

### Wells and the cone of depression
Water converging on a pumped well flows through cylinders of area $2\\pi r b$ that shrink toward the well, so the gradient must steepen: the head falls in a **cone of depression**. For steady flow in a confined aquifer between two radii (Thiem, 1906):

$$Q = \\frac{2\\pi K b\\,(h_2 - h_1)}{\\ln(r_2/r_1)}$$

and in an unconfined aquifer (Dupuit) $Q = \\pi K (h_2^2 - h_1^2)/\\ln(r_2/r_1)$. The drawdown falls with the logarithm of distance, so much of it happens close to the well. A **pumping test** — pumping at a steady rate and watching observation wells — gives $K$ in the field; Theis (1935) described the cone growing with time.

### When too much is pumped
Water tables fall, wells must be deepened and springs and rivers dry up. Near coasts, seawater invades the aquifer. Where clay layers drain and compact, the ground sinks: parts of Mexico City have subsided by about 10 m since 1900, and California's San Joaquin Valley by up to about 9 m between the 1920s and 1970s.

> [!note] Public supply wells are protected by zones drawn from groundwater travel time — often 50 days for the inner zone, long enough for most bacteria and viruses to die off.
`,
  ideas: [
    'Darcy: Q = K A Δh/L — groundwater flow is proportional to the head gradient.',
    'The Darcy flux is flow per unit total area; the water moves faster, at the seepage velocity $q/n_e$.',
    'Hydraulic conductivity ranges from about 10⁻¹ m/s in gravel to below 10⁻¹² m/s in clay and intact granite.',
    'Pumping a well draws the head down in a cone; in steady flow the drawdown falls with the logarithm of distance (Thiem).',
    'Over-pumping lowers water tables, draws in seawater and can make the ground subside.'
  ],
  pitfalls: [
    'The Darcy flux q = Ki is the speed of the water — The water flows only through the pores, so it moves faster by a factor $1/n_e$ — three to ten times.',
    'Groundwater flows from high pressure to low pressure — It flows from high to low hydraulic head (elevation plus pressure head); water can flow downward toward higher pressure.',
    'Doubling the pumping rate lowers the water in a well by a bit more — In a confined aquifer in steady flow the drawdown is proportional to Q: it doubles everywhere in the cone.'
  ],
  formulas: [
    {
      name: 'Darcy\'s law',
      expr: 'Q = K*A*dh/L', tex: 'Q = K A\\,\\dfrac{\\Delta h}{L}',
      vars: {
        Q: { name: 'flow', q: 'flowrate', unit: 'L/s' },
        K: { name: 'hydraulic conductivity', q: 'speed', unit: 'm/s', value: 2e-4 },
        A: { name: 'cross-sectional area (total, not pores)', q: 'area', unit: 'm²', value: 50 },
        dh: { name: 'drop in hydraulic head', q: 'length', unit: 'm', value: 3, tex: '\\Delta h' },
        L: { name: 'flow path length', q: 'length', unit: 'm', value: 30 }
      },
      stories: { Q: 'Water seeps through a {A} section of sand (K = {K}) with a head drop of {dh} over {L}. What is the flow?', K: 'A sand column of {A} passes {Q} with a head drop of {dh} over {L}. What is its hydraulic conductivity?' }
    },
    {
      name: 'Seepage velocity',
      expr: 'v = K*i/ne', tex: 'v = \\dfrac{K\\,i}{n_e}',
      vars: {
        v: { name: 'seepage (pore) velocity', q: 'speed', unit: 'µm/s' },
        K: { name: 'hydraulic conductivity', q: 'speed', unit: 'm/s', value: 5e-5 },
        i: { name: 'hydraulic gradient (m per m)', value: 0.005 },
        ne: { name: 'effective porosity', value: 0.25, min: 0.05, max: 0.45, tex: 'n_e' }
      },
      note: '1 µm/s is 0.086 m per day, or 31.5 m per year.',
      stories: { v: 'Groundwater in fine sand (K = {K}, effective porosity {ne}) moves down a gradient of {i}. How fast does it travel?' }
    },
    {
      name: 'Thiem equation (confined aquifer)',
      expr: 'Q = 2*pi*K*b*(h2 - h1)/ln(r2/r1)', tex: 'Q = \\dfrac{2\\pi K b\\,(h_2 - h_1)}{\\ln(r_2/r_1)}',
      vars: {
        Q: { name: 'pumping rate', q: 'flowrate', unit: 'm³/h' },
        K: { name: 'hydraulic conductivity', q: 'speed', unit: 'm/s', value: 5e-4 },
        b: { name: 'aquifer thickness', q: 'length', unit: 'm', value: 20 },
        h2: { name: 'head at the outer radius', q: 'length', unit: 'm', value: 41.5, tex: 'h_2' },
        h1: { name: 'head at the inner radius', q: 'length', unit: 'm', value: 40, tex: 'h_1' },
        r2: { name: 'outer radius', q: 'length', unit: 'm', value: 100, tex: 'r_2' },
        r1: { name: 'inner radius', q: 'length', unit: 'm', value: 10, tex: 'r_1' }
      },
      note: 'Steady flow. Heads may be measured from any datum; only their difference counts.',
      practice: { unknowns: ['Q', 'K', 'h1'] },
      stories: { Q: 'In a confined aquifer {b} thick (K = {K}), observation wells at {r1} and {r2} from a pumped well show heads of {h1} and {h2}. What is the pumping rate?', K: 'A well pumps {Q} from a confined aquifer {b} thick. Observation wells at {r1} and {r2} show heads of {h1} and {h2}. What is K?' }
    },
    {
      name: 'Dupuit–Thiem equation (unconfined aquifer)',
      expr: 'Q = pi*K*(h2^2 - h1^2)/ln(r2/r1)', tex: 'Q = \\dfrac{\\pi K\\,(h_2^2 - h_1^2)}{\\ln(r_2/r_1)}',
      vars: {
        Q: { name: 'pumping rate', q: 'flowrate', unit: 'm³/h' },
        K: { name: 'hydraulic conductivity', q: 'speed', unit: 'm/s', value: 2e-4 },
        h2: { name: 'saturated thickness at the outer radius', q: 'length', unit: 'm', value: 25, tex: 'h_2' },
        h1: { name: 'saturated thickness at the inner radius', q: 'length', unit: 'm', value: 20, tex: 'h_1' },
        r2: { name: 'outer radius', q: 'length', unit: 'm', value: 300, tex: 'r_2' },
        r1: { name: 'inner radius', q: 'length', unit: 'm', value: 30, tex: 'r_1' }
      },
      note: 'Heads measured from the bottom of the aquifer. Dupuit assumed horizontal flow; it breaks down right at the well, where a seepage face forms.'
    }
  ],
  examples: [
    {
      title: 'A pumping test',
      q: 'A well pumps 147 m³/h from a confined aquifer 20 m thick. In steady state, observation wells 10 m and 100 m away differ in head by 1.5 m. What is the hydraulic conductivity, and what is the aquifer made of?',
      steps: [
        '$Q = 147/3600 = 0.0408$ m³/s.',
        '$K = \\dfrac{Q\\ln(r_2/r_1)}{2\\pi b\\,\\Delta h} = \\dfrac{0.0408 \\times \\ln 10}{2\\pi \\times 20 \\times 1.5} = \\dfrac{0.0940}{188.5} = 5.0\\times10^{-4}$ m/s.',
        'That is in the range of coarse sand.'
      ],
      a: 'K ≈ 5 × 10⁻⁴ m/s — coarse sand.'
    },
    {
      title: 'How fast does a pollutant travel?',
      q: 'A spill reaches the water table 100 m from a river. The aquifer is fine sand ($K = 5\\times10^{-5}$ m/s, $n_e = 0.25$) and the water table slopes toward the river at 0.005. Roughly when does the pollution arrive?',
      steps: [
        'Darcy flux: $q = Ki = 5\\times10^{-5} \\times 0.005 = 2.5\\times10^{-7}$ m/s.',
        'Seepage velocity: $v = q/n_e = 1.0\\times10^{-6}$ m/s = 0.086 m/day ≈ 32 m/year.',
        'Time: $100/32 \\approx 3$ years (dispersion brings the first traces sooner; sorption can delay some chemicals).'
      ],
      a: 'About three years.'
    }
  ],
  quiz: [
    { q: 'The Darcy flux q = Ki is the actual speed of the water in the pores.', a: false,
      why: 'q is flow per unit total area; the water moves only through the pores, at $q/n_e$ — several times faster.' },
    { q: 'Which has the lowest hydraulic conductivity?', choices: ['gravel', 'coarse sand', 'silt', 'clay'], a: 3,
      why: 'Clay\'s tiny pores give K of 10⁻⁹ m/s or less — a million times less than sand.' },
    { q: 'A sand column has K = 2 × 10⁻⁴ m/s, an area of 0.05 m² and a head loss of 0.6 m over 1 m. What is the flow in mL/s?', answer: 6, unit: 'mL/s',
      why: 'Q = 2 × 10⁻⁴ × 0.05 × 0.6/1 = 6 × 10⁻⁶ m³/s = 6 mL/s.' },
    { q: 'In steady radial flow to a well, the drawdown…', choices: ['falls linearly with distance', 'falls with the logarithm of distance', 'is the same everywhere', 'rises away from the well'], a: 1,
      why: 'Thiem: h₂ − h₁ ∝ ln(r₂/r₁), so each tenfold step in distance gives the same drop in drawdown.' },
    { q: 'Doubling the pumping rate from a confined aquifer in steady state doubles the drawdown throughout the cone.', a: true,
      why: 'The Thiem equation is linear in Q (the aquifer does not change thickness).' }
  ],
  problems: [
    { q: 'An unconfined aquifer (K = 2 × 10⁻⁴ m/s) has a saturated thickness of 25 m at 300 m from a well and 20 m at 30 m. What is the pumping rate in m³/h?', answer: 221, unit: 'm³/h', tol: 0.02,
      steps: ['$Q = \\pi \\times 2\\times10^{-4} \\times (625 - 400)/\\ln 10 = 0.0614$ m³/s.', 'That is 221 m³/h.'] },
    { q: 'A well pumps 0.02 m³/s from a confined aquifer 15 m thick with K = 3 × 10⁻⁴ m/s. What is the head difference between observation wells 5 m and 50 m away?', answer: 1.63, unit: 'm', tol: 0.02,
      steps: ['$\\Delta h = Q\\ln(r_2/r_1)/(2\\pi K b) = 0.02 \\times 2.303/(2\\pi \\times 3\\times10^{-4} \\times 15)$.', '$= 0.04605/0.02827 = 1.63$ m.'] }
  ],
  applications: ['Water-supply wells and well fields, sized from pumping tests.', 'Seepage under and through dams and levees, and dewatering of excavations.', 'Contaminant transport and wellhead protection zones.', 'Managed aquifer recharge: storing treated water or floodwater underground.'],
  history: 'Henry Darcy published his law in 1856, in an appendix to his report on the public fountains of Dijon. Jules Dupuit analysed flow to wells in 1863, Günther Thiem published his equation in 1906, and Charles Theis (1935) borrowed the mathematics of heat conduction to describe the cone of drawdown growing with time.',
  sim: 'chan-well'
},

{
  id: 'water-supply', parent: 'water-resources', title: 'Water supply networks', level: 1,
  short: 'How a town gets its water: sources, treatment, service reservoirs and water towers that set the pressure, and a looped network of mains divided into pressure zones that keep the service pressure at every tap between roughly 2 and 5 bar.',
  keywords: ['water supply', 'distribution network', 'service reservoir', 'water tower', 'pressure zone', 'service pressure', 'pressure-reducing valve', 'booster pump', 'peak factor', 'water demand', 'fire flow', 'leakage', 'non-revenue water', 'looped network', 'water main', 'backflow'],
  prereq: ['pressure-with-depth', 'darcy-weisbach', 'pipe-networks'],
  related: ['water-hammer', 'hazen-williams', 'system-curve', 'operating-point', 'pumps-series-parallel', 'hgl-egl', 'groundwater-darcy'],
  body: `
A drinking-water system is a chain: a **source** (river intake, reservoir, wells, desalination plant), **treatment** (coagulation, filtration, disinfection), **transmission mains** to **service reservoirs**, a **distribution network** of mains under the streets, and the service pipe to each building. Hydraulically, its job is to deliver the right flow at the right pressure, all day and in every part of town, while keeping the water clean on the way.

### Pressure comes from height
A service reservoir on a hill or a water tower sets the level of the hydraulic grade line; each tap receives the difference in elevation minus the friction lost on the way ([[hgl-egl]]):

$$p = \\rho g\\,(H_s - z - h_L)$$

Every 10.2 m of height is one bar. Typical targets for service pressure at the connection are 2–5 bar (20–50 m of head): enough to reach upper floors and run appliances, but not so much that leakage, bursts and noise grow. Tall buildings have their own booster pumps. Night pressure is higher than daytime pressure, because at night little water flows and the friction losses vanish.

### Pressure zones
A town spread over 150 m of hillside cannot be served from one reservoir — the lowest streets would see 15 bar. It is divided into **pressure zones**, each spanning perhaps 30–50 m of ground level, each with its own reservoir, or fed through pressure-reducing valves from the zone above, or by booster pumps from the zone below.

| Zone | Ground levels | Grade line set by | Static pressure |
|---|---|---|---|
| High | 90–130 m | hilltop tank, water level 160 m | 2.9–6.9 bar |
| Middle | 50–90 m | PRV from the high zone, set to 120 m | 2.9–6.9 bar |
| Low | 10–50 m | PRV set to 80 m | 2.9–6.9 bar |

### Demand and storage
Use varies through the day — a night minimum, morning and evening peaks — and through the year. Household use is roughly 100–150 L per person per day in much of Europe and often 250–350 L in North America. The **maximum day** is typically 1.3–2 times the average day, the **peak hour** 2–4 times the average (more in small places). Pipes are sized for the peak hour, or the maximum day plus a **fire flow**; treatment works for the maximum day; and service reservoirs balance the hourly peaks against a steady inflow while holding a fire and emergency reserve — commonly the equivalent of 12–48 hours of average demand.

### Networks, leaks and quality
Mains are laid in loops, so that a burst can be isolated without cutting off everyone downstream; they are analysed with [[pipe-networks]] methods. Some water is always lost: **non-revenue water** is commonly 10–30 % of supply and higher in poorly maintained systems. Leakage rises with pressure — as $p^{N_1}$, with $N_1$ from 0.5 for rigid holes to 1.5 for splits in plastic pipes that open under pressure — so lowering excess pressure, especially at night, is one of the cheapest ways to save water. Fast valve closures and pump trips cause [[water-hammer]]. A main must never run at negative pressure: through the same leaks it would draw in dirty groundwater. Backflow preventers, a chlorine residual and short residence times keep the water safe to drink.

> [!warn] Water mains store a great deal of energy: a burst 300 mm main at 5 bar can undermine a road in minutes. Work on a main begins with the section isolated — valves closed slowly to avoid water hammer — drained and depressurised, and trenches supported against collapse and flooding.
`,
  ideas: [
    'Service reservoirs and water towers set the hydraulic grade line; pressure at a tap is $\\rho g\\,(H_s - z - h_L)$.',
    'Service pressure is usually kept between about 2 and 5 bar; 10 m of height is about 1 bar.',
    'Hilly towns are divided into pressure zones fed by separate reservoirs, pressure-reducing valves or boosters.',
    'Pipes are sized for peak demand (2–4 times the average hour) plus fire flow; reservoirs balance the peaks.',
    'Leakage grows with pressure, so pressure management saves water; mains must never go to negative pressure.'
  ],
  pitfalls: [
    'A water tower is a pressure booster that pumps water — It is a raised store: its height sets the pressure, and pumps fill it when demand is low.',
    'Higher pressure is always better service — Above about 5–6 bar leakage, bursts, noise and wear on fittings rise sharply; zones and PRVs keep pressure only as high as needed.',
    'Leakage is fixed by the size of the holes — Leak flow rises with pressure, at least with its square root, and faster from splits in plastic pipe.'
  ],
  formulas: [
    {
      name: 'Pressure at a point in the network',
      expr: 'p = rhoW*g*(Hs - z - hL)', tex: 'p = \\rho_w\\,g\\,(H_s - z - h_L)',
      vars: {
        p: { name: 'pressure at the connection (gauge)', q: 'pressure', unit: 'bar' },
        rhoW: { const: 'rhoW' },
        g: { const: 'g' },
        Hs: { name: 'water level in the service reservoir (above datum)', q: 'length', unit: 'm', value: 120, tex: 'H_s' },
        z: { name: 'elevation of the connection', q: 'length', unit: 'm', value: 70 },
        hL: { name: 'friction loss from reservoir to connection', q: 'length', unit: 'm', value: 8, tex: 'h_L' }
      },
      stories: { p: 'A reservoir\'s water level is at {Hs}. A house stands at {z}, and at peak hour {hL} of head is lost in the mains. What is the pressure at the house?', Hs: 'A connection at {z} needs {p} at peak hour, when {hL} of head is lost. What reservoir level is needed?' }
    },
    {
      name: 'Peak-hour demand',
      expr: 'Qp = PF*N*qd/86400', tex: 'Q_p = \\dfrac{\\mathrm{PF}\\; N\\, q_d}{86\\,400}',
      vars: {
        Qp: { name: 'peak-hour flow', q: false, unit: 'L/s', tex: 'Q_p' },
        PF: { name: 'peak factor (peak hour / average)', value: 2.5, min: 1, max: 6, tex: '\\mathrm{PF}' },
        N: { name: 'population served', value: 20000 },
        qd: { name: 'average demand per person', q: false, unit: 'L/(person·day)', value: 150, tex: 'q_d' }
      },
      note: '86 400 seconds in a day. Add non-domestic demand and leakage for a real design.',
      stories: { Qp: 'A district of {N} people uses {qd} on average, with a peak factor of {PF}. What is the peak-hour flow?' }
    },
    {
      name: 'Leakage and pressure',
      expr: 'L2 = L1*(p2/p1)^N1', tex: 'L_2 = L_1\\left(\\dfrac{p_2}{p_1}\\right)^{N_1}',
      vars: {
        L2: { name: 'leakage at the new pressure', q: 'flowrate', unit: 'm³/h', tex: 'L_2' },
        L1: { name: 'leakage at the old pressure', q: 'flowrate', unit: 'm³/h', value: 100, tex: 'L_1' },
        p2: { name: 'new pressure (gauge)', q: 'pressure', unit: 'bar', value: 3.5, tex: 'p_2' },
        p1: { name: 'old pressure (gauge)', q: 'pressure', unit: 'bar', value: 5, tex: 'p_1' },
        N1: { name: 'leakage exponent (0.5 rigid holes … 1.5 plastic splits)', value: 1, min: 0.3, max: 2.5, tex: 'N_1' }
      },
      stories: { L2: 'A zone leaks {L1} at {p1}. A pressure-reducing valve lowers the pressure to {p2}; the leakage exponent is {N1}. What does it leak now?' }
    }
  ],
  examples: [
    {
      title: 'Pressure at a house',
      q: 'A service reservoir\'s water level is 120 m above datum. A house stands at 70 m; at peak hour 8 m of head is lost in the mains. What pressure reaches the house, and a flat 12 m higher? What is the night-time pressure at ground level?',
      steps: [
        '$p = 1000 \\times 9.81 \\times (120 - 70 - 8) = 412$ kPa = 4.1 bar.',
        'A flat 12 m higher: $412 - 9.81 \\times 12 = 294$ kPa ≈ 2.9 bar.',
        'At night the friction loss is nearly zero: $p = 9.81 \\times 50 = 490$ kPa ≈ 4.9 bar.'
      ],
      a: 'About 4.1 bar at peak hour (2.9 bar on the fourth floor) and 4.9 bar at night.'
    },
    {
      title: 'Peak flow and pressure management',
      q: 'A town of 20 000 people uses 150 L per person per day with a peak factor of 2.5. What is the peak-hour flow? Separately, a zone leaking 100 m³/h at 5 bar gets a PRV lowering it to 3.5 bar; with $N_1 = 1$, what is the new leakage?',
      steps: [
        '$Q_p = 2.5 \\times 20\\,000 \\times 150/86\\,400 = 86.8$ L/s.',
        '$L_2 = 100 \\times (3.5/5)^1 = 70$ m³/h — a 30 % cut, with the same service where the pressure was more than needed.'
      ],
      a: 'About 87 L/s at peak hour; the leakage falls to about 70 m³/h.'
    }
  ],
  quiz: [
    { q: 'What static pressure does a tap 45 m below the water level of its reservoir receive?', answer: 4.41, unit: 'bar',
      why: 'p = ρgh = 1000 × 9.81 × 45 = 441 kPa = 4.41 bar.' },
    { q: 'Why are hilly towns divided into pressure zones?', choices: ['to use more pumps', 'so no part of town gets too much or too little pressure', 'to separate drinking water from fire water', 'because pipes cannot go uphill'], a: 1,
      why: 'One grade line over 150 m of elevation would give 15 bar at the bottom or nothing at the top; zones keep each band within the target range.' },
    { q: 'Leakage from a network does not depend on pressure: a hole is a hole.', a: false,
      why: 'Flow through an orifice grows at least with √p, and splits in plastic pipes open wider under pressure, so leakage grows even faster.' },
    { q: 'Distribution mains are usually sized for…', choices: ['the average daily flow', 'the peak hour, or maximum day plus fire flow', 'the night minimum', 'the treatment works capacity'], a: 1,
      why: 'The pipes must hold pressure when demand is greatest; reservoirs smooth the peaks for the treatment works.' },
    { q: 'A main that falls to negative pressure during a transient can draw contaminated water in through its leaks.', a: true,
      why: 'Leaks work both ways: below atmospheric pressure, soil water flows into the pipe. This is why mains are kept under positive pressure at all times.' }
  ],
  problems: [
    { q: 'The water in a tower stands 38 m above a street. Ignoring friction, what pressure does a ground-floor tap see, in bar?', answer: 3.73, unit: 'bar', tol: 0.02,
      steps: ['$p = 1000 \\times 9.81 \\times 38 = 373$ kPa = 3.73 bar.'] },
    { q: 'A town of 8000 people uses 120 L per person per day with a peak factor of 3. What is the peak-hour flow?', answer: 33.3, unit: 'L/s', tol: 0.02,
      steps: ['$Q_p = 3 \\times 8000 \\times 120/86\\,400 = 33.3$ L/s.'] }
  ],
  applications: ['Siting service reservoirs and water towers, and drawing the bands of pressure zones.', 'Pressure management and leak reduction with PRVs and lower night pressure.', 'Fire-flow design of mains and hydrants.', 'Booster stations for tall buildings and high districts.'],
  history: 'Rome\'s aqueducts, described by the water commissioner Frontinus around AD 97, delivered by gravity a supply that modern estimates put between half a million and a million cubic metres a day. John Snow\'s 1854 study of cholera around a Broad Street pump in London first tied a disease to a water source, and continuous chlorination of public supplies, begun in the early 1900s, is among the greatest advances in public health.'
},

{
  id: 'stormwater-floods', parent: 'water-resources', title: 'Stormwater and floods', level: 2,
  short: 'Rain that does not soak in runs off to gutters, drains and rivers. The rational method Q = CiA estimates the peak from a small catchment; larger rivers need hydrographs and routing. Floods are described by their chance per year — a "100-year flood" has a 1 % chance each year, and a 26 % chance in 30 years.',
  keywords: ['stormwater', 'runoff', 'rational method', 'runoff coefficient', 'rainfall intensity', 'IDF curve', 'time of concentration', 'Kirpich', 'return period', 'annual exceedance probability', '100-year flood', '1 % AEP', 'hydrograph', 'detention basin', 'sustainable drainage', 'SuDS', 'flash flood', 'flood risk'],
  prereq: ['open-channel-basics', 'manning-equation', 'math:probability'],
  related: ['culverts-sluice', 'dams-spillways', 'gradually-varied-flow', 'groundwater-darcy', 'weirs-flumes'],
  body: `
Rain falling on a catchment is caught by leaves, soaks into the soil, fills hollows and evaporates; what is left runs off. Paving the land changes everything: roofs and roads shed almost all the rain, and they shed it fast, so the same storm gives a much larger and earlier peak. Drainage engineering is the business of estimating that peak and carrying it away safely — or holding it back.

### The rational method
For small catchments — a housing estate, a car park, a stretch of road, up to perhaps a square kilometre or two — the peak flow is estimated as

$$Q = \\frac{C\\, i\\, A}{360}$$

with $Q$ in m³/s, the rainfall intensity $i$ in mm/h and the area $A$ in hectares. $C$ is the **runoff coefficient**, the fraction of rain that runs off. The intensity is that of a storm lasting the **time of concentration** $t_c$ — the time water takes to travel from the hydraulically farthest point to the outlet — read from the region's intensity–duration–frequency (IDF) curves for the chosen return period. A shorter storm is more intense but ends before the whole catchment contributes; a longer one is weaker, so the design storm lasts $t_c$.

| Surface | Runoff coefficient $C$ |
|---|---|
| Roofs | 0.75–0.95 |
| Asphalt and concrete | 0.70–0.95 |
| Block paving with open joints | 0.50–0.70 |
| Dense town centre | 0.70–0.90 |
| Suburban housing with gardens | 0.25–0.40 |
| Lawns on sandy soil | 0.05–0.15 |
| Lawns on clay soil | 0.15–0.35 |
| Woodland | 0.05–0.25 |

For small rural catchments $t_c$ is often estimated with Kirpich's formula (1940), $t_c = 0.0195\\,L^{0.77}S^{-0.385}$ (minutes, with $L$ in metres and $S$ in m/m); in towns a few minutes of roof-to-gutter time are added. Larger catchments need **hydrographs** — the flow through the whole storm — from unit-hydrograph or rainfall-runoff models, routed through reservoirs and river reaches.

### Return periods
A "$T$-year flood" is one exceeded on average once in $T$ years: its **annual exceedance probability** (AEP) is $1/T$. The 100-year flood has a 1 % chance every year — nothing stops two in successive years. The chance of at least one in $n$ years is

$$P = 1 - \\left(1 - \\frac{1}{T}\\right)^n$$

For the 100-year flood that is 26 % over a 30-year mortgage and 63 % over a century. Typical design standards: 2–10 years for minor drains; 50–100 years for major overland flow paths and culverts under main roads; the 1 % flood for floodplain planning; far rarer floods for large dams. Records behind these estimates are often only 30–60 years long, and a changing climate is shifting the IDF curves, so they carry wide uncertainty.

### Managing it
**Detention basins** store the peak and let it out slowly; **sustainable drainage** — permeable paving, swales, rain gardens, green roofs, infiltration trenches — slows the water, cleans it and returns some to the ground. Towns are drained by a *minor system* of pipes for frequent storms and a *major system* of roads and open spaces laid out as safe flood paths for rare ones.

> [!warn] Floodwater is deceptive and deadly. About 15 cm of fast-moving water can knock an adult down, about 30 cm can float a car and 60 cm can sweep most vehicles away. Do not walk, swim or drive through floodwater — turn around. It can hide open manholes, collapsed roads and debris, carry sewage and chemicals, and be electrified by submerged cables. Follow official warnings and evacuation orders, and in an emergency call your local emergency number.
`,
  ideas: [
    'Paving a catchment raises both the fraction of rain that runs off and the speed at which it arrives.',
    'The rational method gives the peak of a small catchment: Q = CiA/360 (m³/s, mm/h, ha).',
    'The design storm lasts the time of concentration, with its intensity taken from the IDF curve for the return period.',
    'A T-year flood has a 1/T chance each year; the chance of at least one in n years is $1 - (1 - 1/T)^n$.',
    'Detention and sustainable drainage hold back and slow the runoff; streets and open spaces carry rare floods safely.'
  ],
  pitfalls: [
    'A 100-year flood happens once a century, so after one we are safe for a while — The chance is 1 % every year regardless of last year; over 100 years there is a 37 % chance of none and a 26 % chance of two or more.',
    'The rational method works for any catchment — It assumes uniform rain over the whole area for the time of concentration; for large or complex catchments hydrograph methods are needed.',
    'Shallow floodwater is safe to drive through — Around 30 cm of moving water can float a car; many flood deaths happen in vehicles.'
  ],
  formulas: [
    {
      name: 'Rational method',
      expr: 'Q = C*i*A/360', tex: 'Q = \\dfrac{C\\, i\\, A}{360}',
      vars: {
        Q: { name: 'peak runoff', q: false, unit: 'm³/s' },
        C: { name: 'runoff coefficient', value: 0.5, min: 0.05, max: 0.95 },
        i: { name: 'rainfall intensity for a storm lasting the time of concentration', q: false, unit: 'mm/h', value: 60 },
        A: { name: 'catchment area', q: false, unit: 'ha', value: 12 }
      },
      note: 'The 360 converts mm/h × ha into m³/s. For small catchments only (up to roughly 1–2 km²).',
      stories: { Q: 'A {A} catchment with a runoff coefficient of {C} receives a design storm of {i}. What is the peak runoff?', A: 'A drain can carry {Q}. What area with C = {C} can it serve in a {i} storm?' }
    },
    {
      name: 'Time of concentration (Kirpich)',
      expr: 'tc = 0.0195*L^0.77*S^(-0.385)', tex: 't_c = 0.0195\\,L^{0.77} S^{-0.385}',
      vars: {
        tc: { name: 'time of concentration', q: false, unit: 'min', tex: 't_c' },
        L: { name: 'longest flow path', q: false, unit: 'm', value: 800 },
        S: { name: 'average slope of the path (m per m)', value: 0.01 }
      },
      note: 'Empirical, from small rural catchments in Tennessee (1940). Use its units exactly.',
      stories: { tc: 'The longest flow path of a small catchment is {L} long with an average slope of {S}. Estimate its time of concentration.' }
    },
    {
      name: 'Chance of at least one flood in n years',
      expr: 'P = 1 - (1 - 1/T)^n', tex: 'P = 1 - \\left(1 - \\dfrac{1}{T}\\right)^{n}',
      vars: {
        P: { name: 'chance of at least one exceedance', q: 'ratio', unit: '%' },
        T: { name: 'return period (years)', value: 100 },
        n: { name: 'period considered (years)', value: 30 }
      },
      note: 'Assumes the years are independent and the climate unchanging.',
      stories: { P: 'What is the chance of at least one {T}-year flood in {n} years?', T: 'What return period has a {P} chance of being exceeded at least once in {n} years?' }
    }
  ],
  examples: [
    {
      title: 'Peak runoff from a housing estate',
      q: 'A 12 ha estate has $C = 0.5$ and a time of concentration of 15 minutes. The 10-year IDF curve gives 60 mm/h for a 15-minute storm. What is the peak flow? What if more paving raises $C$ to 0.75?',
      steps: [
        '$Q = 0.5 \\times 60 \\times 12/360 = 1.0$ m³/s.',
        'With $C = 0.75$: $Q = 1.5$ m³/s — half as much again. In practice more paving also shortens $t_c$, raising $i$ and the peak further.'
      ],
      a: 'About 1.0 m³/s, rising to 1.5 m³/s or more with extra paving.'
    },
    {
      title: 'Flood risk over a mortgage',
      q: 'A house sits at the edge of the 1 % annual-chance floodplain. What is the chance it floods at least once during a 30-year mortgage? And if it is in the 2 % zone?',
      steps: [
        '$P = 1 - 0.99^{30} = 1 - 0.740 = 0.26$: 26 %.',
        '$P = 1 - 0.98^{30} = 0.45$: 45 %.'
      ],
      a: 'About 26 % (1 % AEP) and 45 % (2 % AEP).'
    },
    {
      title: 'Time of concentration',
      q: 'A small rural catchment has a longest flow path of 800 m with an average slope of 1 %. Estimate $t_c$ with Kirpich\'s formula.',
      steps: ['$t_c = 0.0195 \\times 800^{0.77} \\times 0.01^{-0.385} = 0.0195 \\times 171.9 \\times 5.89 = 19.7$ min.'],
      a: 'About 20 minutes.'
    }
  ],
  quiz: [
    { q: 'A "100-year flood" happened last year. The chance of another this year is…', choices: ['almost zero', '1 %', '50 %', '99 %'], a: 1,
      why: 'Floods do not keep a calendar: the annual chance is 1 % every year.' },
    { q: 'What is the chance of at least one 50-year flood in 50 years, in per cent?', answer: 63.6, unit: '%',
      why: '$1 - 0.98^{50} = 1 - 0.364 = 0.636$.' },
    { q: 'In the rational method, the design storm lasts…', choices: ['one hour', 'the time of concentration', 'the return period', 'one day'], a: 1,
      why: 'Only after $t_c$ does the whole catchment contribute; longer storms are less intense.' },
    { q: 'Paving a field raises both the runoff coefficient and the intensity used in the rational method.', a: true,
      why: 'Smooth surfaces shorten the time of concentration, and shorter storms are more intense.' },
    { q: 'What is the peak runoff from a 5 ha car park (C = 0.9) in an 80 mm/h storm, in m³/s?', answer: 1.0, unit: 'm³/s',
      why: 'Q = 0.9 × 80 × 5/360 = 1.0 m³/s.' }
  ],
  problems: [
    { q: 'A retail park of 8 ha (C = 0.85) receives a design storm of 70 mm/h. What is the peak runoff?', answer: 1.32, unit: 'm³/s', tol: 0.02,
      steps: ['$Q = 0.85 \\times 70 \\times 8/360 = 1.32$ m³/s.'] },
    { q: 'What return period has a 10 % chance of being exceeded at least once in 50 years?', answer: 475, unit: 'yr', tol: 0.02,
      steps: ['$(1 - 1/T)^{50} = 0.9$, so $1 - 1/T = 0.9^{0.02} = 0.997895$.', '$T = 1/0.002105 = 475$ years — the same figure used for design earthquakes.'] }
  ],
  applications: ['Sizing gutters, drains, storm sewers and road culverts.', 'Detention and retention ponds that hold back the peak.', 'Flood maps and planning rules based on the 1 % annual-chance flood.', 'Sustainable drainage in new developments.'],
  history: 'The Irish engineer Thomas Mulvaney set out the ideas of the time of concentration and the rational formula in 1851, and Emil Kuichling applied them to the sewers of Rochester, New York, in 1889. Leroy Sherman\'s unit hydrograph (1932) extended runoff prediction to large catchments.'
},

{
  id: 'irrigation', parent: 'water-resources', title: 'Irrigation hydraulics', level: 2,
  short: 'Delivering water to crops at the rate they use it, by surface, sprinkler or drip methods of very different efficiency. Drip emitters follow q = k pˣ — the exponent x decides how much the flow varies along a line — and a system is sized from crop water use, emitter spacing and application rate.',
  keywords: ['irrigation', 'drip irrigation', 'trickle', 'micro-irrigation', 'emitter', 'emitter exponent', 'pressure-compensating', 'sprinkler', 'centre pivot', 'furrow', 'application rate', 'application efficiency', 'evapotranspiration', 'crop coefficient', 'FAO-56', 'emission uniformity', 'lateral', 'fertigation', 'infiltration rate'],
  prereq: ['torricelli', 'darcy-weisbach', 'pressure-with-depth'],
  related: ['groundwater-darcy', 'weirs-flumes', 'culverts-sluice', 'pipe-sizing', 'pump-curves', 'open-channel-basics'],
  body: `
Agriculture takes about 70 % of all the fresh water people withdraw, and irrigated land — around a fifth of the world's cropland — grows about 40 % of its food (FAO estimates). Irrigation hydraulics is the art of getting that water to the roots evenly, at the rate the crop uses it and the soil can take it, with as little lost as possible.

### How much water
A crop's water use is estimated from the **reference evapotranspiration** $\\mathrm{ET}_0$ — the water a well-watered grass surface would use, computed from weather data by the Penman–Monteith method of FAO Paper 56 (1998) — times a **crop coefficient** $K_c$:

$$\\mathrm{ET}_c = K_c\\,\\mathrm{ET}_0$$

$\\mathrm{ET}_0$ runs at 5–8 mm/day in a hot, dry summer; $K_c$ rises from about 0.3–0.5 for young plants to 1.0–1.2 at full cover. One millimetre over a hectare is 10 m³. The net need is $\\mathrm{ET}_c$ less the rain that is used; the gross amount divides that by the **application efficiency**.

| Method | Typical application efficiency | Pressure at the outlet | Notes |
|---|---|---|---|
| Surface: furrow, basin, border | 50–80 % | gravity | cheap; needs level land; losses to deep drainage and runoff |
| Sprinkler: set systems, centre pivots, guns | 65–85 % | about 1–5 bar | wind drift and evaporation; the rate must suit the soil |
| Drip and micro-sprinklers | 85–95 % | about 0.5–2.5 bar | water at the roots; fertiliser in the water; needs filtering |

### Emitter hydraulics
A drip emitter is a tiny calibrated restriction: an orifice, a long labyrinth path, a vortex chamber, or a flexible diaphragm that squeezes its passage as the pressure rises. All are described by

$$q = k\\,p^{x}$$

where the **emitter exponent** $x$ tells how sensitive the flow is to pressure: 0.5 for a turbulent orifice (Torricelli, $q \\propto \\sqrt{p}$), up to about 1 for a laminar long path, and 0–0.1 for **pressure-compensating** emitters within their working range. Friction in a lateral line lowers the pressure along it, and slopes add or subtract head, so the last emitters get less. With $x = 0.5$ a 20 % difference in pressure gives about a 10 % difference in flow — the classic design rule for a drip block. Compensating emitters allow long laterals and hillsides. A lateral with many evenly spaced outlets loses only about a third as much head as the same pipe carrying the full flow all the way, since the flow falls along it. Emitters clog easily: water is filtered (typically to 80–130 µm), laterals are flushed, and chlorine or acid dissolves slimes and scale.

### Application rate and the soil
Water must not arrive faster than the soil can take it in, or it ponds and runs off:

$$I = \\frac{q}{S_l\\,S_m}$$

(mm/h, with $q$ in L/h per emitter or sprinkler and the two spacings in metres; 1 L per m² is 1 mm). Sandy soils take 30 mm/h or more, loams 10–20, clays 1–5. On a centre pivot — a pipe up to several hundred metres long turning about its centre — the outer spans water the most area and so apply the highest rates, a runoff risk on heavy soils.

> [!note] Irrigation water carries salts. Applying 10–20 % more than the crop uses (the leaching fraction) washes them below the roots, and drainage must carry them away; neglected drainage salted the fields of ancient Mesopotamia and still ruins land today.

> [!warn] A system that injects fertiliser or acid into the water must have approved backflow protection: when a pump stops, chemicals can siphon back into a well or the drinking-water supply. Wear eye protection when handling acids and chlorine for line cleaning.
`,
  ideas: [
    'Crop water use is $\\mathrm{ET}_c = K_c\\,\\mathrm{ET}_0$; 1 mm over 1 ha is 10 m³.',
    'Drip irrigation reaches 85–95 % efficiency, sprinklers 65–85 %, surface methods 50–80 %.',
    'Emitters follow q = k pˣ: x = 0.5 for an orifice, near 0 for pressure-compensating emitters.',
    'With x = 0.5, a 20 % pressure variation gives about 10 % flow variation — the drip-design rule.',
    'The application rate $q/(S_l S_m)$ must stay below the soil\'s infiltration rate.'
  ],
  pitfalls: [
    'Every emitter on a line gives its rated flow — Friction and slope change the pressure along the lateral; only pressure-compensating emitters keep a nearly constant flow.',
    'More water always means more yield — Beyond the crop\'s need, extra water leaches nutrients, waterlogs roots and raises the water table and salinity.',
    'A sprinkler system can apply water as fast as the pump allows — If the rate exceeds the soil\'s infiltration rate, water ponds and runs off, and the field is watered unevenly.'
  ],
  formulas: [
    {
      name: 'Crop water use',
      expr: 'ETc = Kc*ET0', tex: '\\mathrm{ET}_c = K_c\\,\\mathrm{ET}_0',
      vars: {
        ETc: { name: 'crop evapotranspiration', q: false, unit: 'mm/day', tex: '\\mathrm{ET}_c' },
        Kc: { name: 'crop coefficient', value: 1.1, min: 0.1, max: 1.4, tex: 'K_c' },
        ET0: { name: 'reference evapotranspiration', q: false, unit: 'mm/day', value: 6, tex: '\\mathrm{ET}_0' }
      },
      stories: { ETc: 'On a day with a reference evapotranspiration of {ET0}, how much water does a crop with a crop coefficient of {Kc} use?' }
    },
    {
      name: 'Emitter flow',
      expr: 'q = k*p^x', tex: 'q = k\\,p^{x}',
      vars: {
        q: { name: 'emitter flow', q: false, unit: 'L/h' },
        k: { name: 'emitter coefficient (flow at 1 bar, L/h)', value: 1.6 },
        p: { name: 'pressure at the emitter (gauge)', q: false, unit: 'bar', value: 1.5, min: 0.2, max: 4 },
        x: { name: 'emitter exponent', value: 0.5, min: 0, max: 1 }
      },
      note: 'x = 0.5 turbulent orifice or labyrinth; ≈ 1 laminar long path; 0–0.1 pressure-compensating.',
      stories: { q: 'An emitter with k = {k} and exponent {x} runs at {p}. What does it deliver?', x: 'An emitter with k = {k} gives {q} at {p}. What is its exponent?' }
    },
    {
      name: 'Application rate',
      expr: 'I = q/(Sl*Sm)', tex: 'I = \\dfrac{q}{S_l\\,S_m}',
      vars: {
        I: { name: 'application rate', q: false, unit: 'mm/h' },
        q: { name: 'flow per emitter or sprinkler', q: false, unit: 'L/h', value: 2 },
        Sl: { name: 'spacing along the lateral', q: false, unit: 'm', value: 0.3, tex: 'S_l' },
        Sm: { name: 'spacing between laterals', q: false, unit: 'm', value: 1.0, tex: 'S_m' }
      },
      note: '1 L spread over 1 m² is a depth of 1 mm.',
      stories: { I: 'Emitters of {q} are spaced {Sl} apart on laterals {Sm} apart. What is the application rate?' }
    }
  ],
  examples: [
    {
      title: 'Emitters along a lateral',
      q: 'Emitters with $k = 1.6$ and $x = 0.5$ get 1.5 bar at the head of a lateral and 1.2 bar at its end. How much less does the last emitter give? Compare a compensating emitter with $x = 0.05$ rated 2.0 L/h at 1.5 bar.',
      steps: [
        'First emitter: $q = 1.6 \\times 1.5^{0.5} = 1.96$ L/h; last: $1.6 \\times 1.2^{0.5} = 1.75$ L/h — 10.6 % less for 20 % less pressure.',
        'Compensating: $k = 2.0/1.5^{0.05} = 1.960$; at 1.2 bar $q = 1.960 \\times 1.2^{0.05} = 1.978$ L/h — only 1.1 % less.'
      ],
      a: 'About 11 % less with x = 0.5; about 1 % less with a pressure-compensating emitter.'
    },
    {
      title: 'How long to run a drip system',
      q: 'Tomatoes at full cover ($K_c = 1.1$) on a day with $\\mathrm{ET}_0 = 6$ mm. Emitters of 2 L/h are spaced 0.3 m apart on laterals 1.0 m apart, with 90 % application efficiency. How long must the system run?',
      steps: [
        'Crop use: $\\mathrm{ET}_c = 1.1 \\times 6 = 6.6$ mm/day; gross: $6.6/0.9 = 7.33$ mm.',
        'Application rate: $I = 2/(0.3 \\times 1.0) = 6.67$ mm/h.',
        'Run time: $7.33/6.67 = 1.1$ h a day.'
      ],
      a: 'About 1.1 hours a day.'
    }
  ],
  quiz: [
    { q: 'For an emitter with x = 0.5, the pressure falls by 20 %. The flow falls by about…', choices: ['20 %', '10 %', '4 %', 'nothing'], a: 1,
      why: '$0.8^{0.5} = 0.894$: about 10 % less.' },
    { q: 'A pressure-compensating emitter has an exponent close to…', choices: ['0', '0.5', '1', '2'], a: 0,
      why: 'Its flow barely changes with pressure over its working range: x ≈ 0–0.1.' },
    { q: 'Sprinklers delivering 1000 L/h each are set on a 12 m × 12 m grid. What is the application rate in mm/h?', answer: 6.94, unit: 'mm/h',
      why: 'I = 1000/144 = 6.94 mm/h.' },
    { q: 'Drip systems need no filtration because emitters flush themselves.', a: false,
      why: 'Emitter passages are fractions of a millimetre; sand, algae and precipitates block them, so filters, flushing and chemical cleaning are essential.' },
    { q: 'Which method usually achieves the highest application efficiency?', choices: ['basin flooding', 'furrows', 'sprinklers', 'drip'], a: 3,
      why: 'Drip puts water directly at the roots, with little evaporation, drift or runoff: 85–95 %.' }
  ],
  problems: [
    { q: '$\\mathrm{ET}_0 = 7$ mm/day and $K_c = 0.9$. With 90 % efficiency, what gross volume must be applied to 1 ha each day, in m³?', answer: 70, unit: 'm³', tol: 0.02,
      steps: ['Net: $0.9 \\times 7 = 6.3$ mm = 63 m³/ha.', 'Gross: $63/0.9 = 70$ m³.'] },
    { q: 'An emitter gives 4 L/h at 1 bar and 4.9 L/h at 1.5 bar. What is its exponent?', answer: 0.5, tol: 0.02,
      steps: ['$x = \\ln(4.9/4)/\\ln 1.5 = 0.203/0.405 = 0.50$.'] }
  ],
  applications: ['Orchards, vineyards and greenhouse crops on drip lines, often with fertiliser in the water.', 'Centre pivots on large field crops.', 'Canal-fed surface irrigation in river valleys, measured with weirs and flumes.', 'Sprinkler systems for parks and sports turf.'],
  history: 'Drip irrigation was developed commercially in Israel in the 1960s by the engineer Simcha Blass, who had noticed a tree thriving beside a leaking pipe; cheap plastics made it practical. The self-propelled centre pivot was invented by the Nebraska farmer Frank Zybach, who patented it in 1952.'
}

);
