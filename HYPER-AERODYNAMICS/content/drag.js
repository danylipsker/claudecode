/* HYPER-AERODYNAMICS · content/drag.js — the Drag branch.
 *   drag-types     the drag equation, parasite drag, pressure (form) drag, wave drag, the drag polar, L/D
 *   drag-everyday  streamlining, bluff bodies, terminal velocity, road vehicles, racing downforce,
 *                  sports balls, cycling and drafting
 * Simulations: sims/drag.js (drag-vehicles, drag-polar, drag-terminal, drag-paceline, drag-downforce,
 * drag-porpoising, drag-ball-flight). */
Hyper.add(

/* ================================================================ KINDS OF DRAG */
{
  id: 'drag-equation', parent: 'drag-types', title: 'The drag equation', level: 1,
  short: 'Drag equals the dynamic pressure of the oncoming air, times a reference area, times a drag coefficient that carries the shape: D = ½ρV²C_DA. Double the speed and the drag quadruples; the power to push through the air grows eightfold.',
  keywords: ['drag', 'drag coefficient', 'CD', 'drag area', 'CdA', 'air resistance', 'frontal area', 'reference area', 'speed squared', 'power cubed', 'dynamic pressure', 'top speed'],
  prereq: ['dynamic-pressure', 'force-coefficients', 'reynolds-number', 'physics:drag-force'],
  related: ['parasite-drag', 'form-drag', 'induced-drag', 'skin-friction', 'drag-polar', 'terminal-velocity', 'vehicle-aerodynamics', 'cycling-aero', 'bluff-bodies', 'lift-equation'],
  body: `
Hold a flat hand out of the window of a moving car and you feel it: the air pushes back, harder and harder as the car speeds up. That push along the direction of the flow is **drag**. It comes from two places at once — the air presses harder on the front of a body than on its back ([[form-drag|pressure drag]]), and the thin [[boundary-layer|boundary layer]] rubs along every square centimetre of the surface ([[skin-friction|skin friction]]). However the two share the work, the total follows one pattern:

$$D = \\tfrac{1}{2}\\,\\rho V^2\\, C_D\\, A$$

- $\\tfrac12\\rho V^2$ is the [[dynamic-pressure|dynamic pressure]] $q$ of the oncoming air: 551 Pa at 30 m/s at sea level, 2.2 kPa at 60 m/s.
- $A$ is a **reference area**, and it must always be named. Cars, cyclists, balls and parachutes use the frontal area; aircraft use the wing's planform area, so that $C_D$ and $C_L$ share one area; skin-friction work uses the wetted area.
- $C_D$, the **drag coefficient**, is a pure number that carries the shape, the surface finish and the attitude of the body.

Like the [[lift-equation]], the formula is really a definition of $C_D$: the measured drag divided by $qA$. Its value is that $C_D$ hardly changes with size or speed for a given shape, so one number — measured in a [[wind-tunnel|wind tunnel]] or by letting a car coast down a road — predicts the drag at any other speed.

### Speed squared, power cubed
Drag grows with the **square** of speed. The power needed to push through the air is force times speed, so it grows with the **cube**:

$$P = D\\,V = \\tfrac12\\,\\rho\\, C_DA\\, V^3$$

A car at 130 km/h instead of 100 km/h meets 69 % more drag and needs 2.2 times the aerodynamic power. A cyclist going from 30 to 40 km/h needs $(4/3)^3 = 2.4$ times the power against the air. The cube is why top speeds are so hard to raise: doubling the power of a vehicle whose speed is limited by drag adds only 26 % to it ($2^{1/3} = 1.26$).

### Drag area: what really matters
Only the product enters, so engineers and cyclists quote the **drag area** $C_DA$, in m². A big body with a small coefficient can drag less than a small blunt one:

| Body | Reference area | $C_D$ | Drag area $C_DA$ |
|---|---|---|---|
| Square flat plate or disc, face-on | frontal | 1.17 | 1.17 per m² of plate |
| Long flat plate across the flow (2-D) | frontal | ≈ 2.0 | — |
| Long circular cylinder across the flow | frontal | ≈ 1.2 (0.3–0.6 past the drag crisis) | — |
| Smooth sphere, below the drag crisis | frontal | 0.47 | football: 0.018 m² |
| Streamlined body, fineness ratio 3 | frontal | 0.04–0.05 | — |
| Modern car | frontal, 2.0–2.8 m² | 0.20–0.40 | 0.45–1.0 m² |
| Articulated truck | frontal, ≈ 10 m² | 0.55–0.8 | 5.5–8 m² |
| Racing cyclist in a time-trial tuck | frontal, ≈ 0.3 m² | ≈ 0.75 | 0.20–0.25 m² |
| Skydiver, belly to earth | — | — | 0.4–0.5 m² |
| Light aircraft at zero lift | wing, 16 m² | ≈ 0.03 | ≈ 0.5 m² |
| Narrow-body airliner at zero lift | wing, 123 m² | ≈ 0.019 | ≈ 2.3 m² |

> [!fact] A 70-tonne airliner has a smaller parasite drag area than a 40-tonne truck: about 2.3 m² against 6 m². More than a third of its drag in cruise is the price of making lift — [[induced-drag]].

### When C_D is not constant
$C_D$ stays put only as long as the pattern of the flow does. It changes with the [[reynolds-number|Reynolds number]]: a sphere's falls from 0.47 to about 0.1 when its boundary layer turns turbulent (the [[drag-crisis]]), and tiny, slow bodies such as mist droplets have a drag proportional to speed rather than its square (Stokes' law, see [[terminal-velocity]]). It changes with the [[mach-number|Mach number]] when shock waves appear ([[wave-drag]]). And for a wing it grows with the lift being made ([[drag-polar]]).

> [!key] Two numbers describe how hard it is to move something through air: its drag area $C_DA$ and the dynamic pressure $\\tfrac12\\rho V^2$. Fuel use, top speed, glide and terminal velocity all follow from them.
`,
  ideas: [
    'Drag = dynamic pressure × reference area × drag coefficient: D = ½ρV²C_DA.',
    'Drag grows with V²; the power to overcome it grows with V³.',
    'The drag area C_DA is what counts; a C_D means nothing without the area it refers to.',
    'C_D depends mainly on shape, but also on the Reynolds number (drag crisis), the Mach number (wave drag) and, for wings, on the lift.'
  ],
  pitfalls: [
    'Drag is proportional to speed — At the speeds of cars, bikes and aircraft it grows with the square of speed, and the power with the cube. Only for tiny, slow things such as dust and mist droplets, where viscosity rules, is drag proportional to speed.',
    'A low drag coefficient means low drag — Drag is set by C_D times area. A truck with C_D 0.6 is not "twice as draggy" as a car with 0.3: with four to five times the frontal area it has about nine times the drag area.',
    'C_D is a fixed number for a shape — It changes with Reynolds number (a sphere\'s falls by a factor of 3–5 at the drag crisis), with Mach number near the speed of sound, and for a wing with the lift coefficient.'
  ],
  formulas: [
    {
      name: 'The drag equation',
      expr: 'D = 0.5*rho*V^2*CD*A', tex: 'D = \\tfrac{1}{2}\\,\\rho V^2\\, C_D\\, A',
      vars: {
        D: { name: 'drag', q: 'force', unit: 'N' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'airspeed', q: 'speed', unit: 'km/h', value: 120 },
        CD: { name: 'drag coefficient', value: 0.30, min: 0, max: 3, tex: 'C_D' },
        A: { name: 'reference (frontal) area', q: 'area', unit: 'm²', value: 2.2 }
      },
      note: 'Valid whatever the drag is made of, as long as C_D and A belong together (frontal area for cars, bikes and balls; wing area for aircraft). ρ = 1.225 kg/m³ at sea level in the standard atmosphere.',
      practice: { unknowns: ['D', 'V', 'CD'] },
      stories: {
        D: 'A car with a drag coefficient of {CD} and a frontal area of {A} drives at {V} through air of density {rho}. What is its aerodynamic drag?',
        V: 'A body with C_D = {CD} and a reference area of {A} feels {D} of drag in air of density {rho}. How fast is the air moving past it?',
        CD: 'A wind-tunnel model with {A} of frontal area feels {D} of drag at {V} in air of density {rho}. What is its drag coefficient?',
        A: 'A shape with C_D = {CD} must not drag more than {D} at {V} in air of density {rho}. What is the largest frontal area it may have?'
      }
    },
    {
      name: 'Power to overcome drag',
      expr: 'P = 0.5*rho*CdA*V^3', tex: 'P = \\tfrac{1}{2}\\,\\rho\\,\\mathit{C_DA}\\,V^3',
      vars: {
        P: { name: 'power against the air', q: 'power', unit: 'kW' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        CdA: { name: 'drag area C_D·A', q: 'area', unit: 'm²', value: 0.66, tex: '\\mathit{C_DA}' },
        V: { name: 'speed through the air', q: 'speed', unit: 'km/h', value: 120 }
      },
      note: 'Power = drag × speed, in still air. With a wind, use the air speed in the drag and the ground speed as the multiplier. Solving for V gives the top speed that a given power can hold against drag alone.',
      practice: { unknowns: ['P', 'V', 'CdA'] },
      stories: {
        P: 'A vehicle with a drag area of {CdA} travels at {V} in air of density {rho}. How much power goes into pushing the air aside?',
        V: 'An engine can spend {P} against the air on a vehicle of drag area {CdA} (air density {rho}). What speed can it hold, ignoring every other loss?',
        CdA: 'A rider holds {V} with {P} going into the air (density {rho}). What is the drag area?'
      }
    }
  ],
  examples: [
    {
      title: 'A car on the motorway',
      q: 'A family car has $C_D = 0.30$ and a frontal area of 2.2 m². Find the aerodynamic drag and the power to overcome it at 120 km/h and at 140 km/h, at sea level.',
      steps: [
        '120 km/h = 33.3 m/s, so $q = \\tfrac12 \\times 1.225 \\times 33.3^2 = 681$ Pa.',
        'Drag area $C_DA = 0.30 \\times 2.2 = 0.66$ m², so $D = 681 \\times 0.66 = 449$ N and $P = DV = 449 \\times 33.3 = 15.0$ kW.',
        'At 140 km/h the drag scales with $(140/120)^2 = 1.36$, to 611 N; the power with $(140/120)^3 = 1.59$, to 23.8 kW.'
      ],
      a: 'About 450 N and 15 kW at 120 km/h; 610 N and 24 kW at 140 km/h — 17 % more speed costs 59 % more power against the air.'
    },
    {
      title: 'Which area?',
      q: 'A light aircraft has a zero-lift drag coefficient of 0.030 based on its 16.2 m² wing. Its frontal area is about 2.5 m². What is its drag area, and what drag coefficient would it have if, like a car, it were quoted on frontal area?',
      steps: [
        'Drag area: $C_D S = 0.030 \\times 16.2 = 0.49$ m².',
        'On frontal area: $C_D = 0.49/2.5 = 0.19$.',
        'Same drag, two coefficients: a $C_D$ without its reference area means little. A family car has a drag area of about 0.66 m².'
      ],
      a: 'Drag area ≈ 0.49 m²; C_D ≈ 0.19 on frontal area — sleeker than almost any car.'
    }
  ],
  quiz: [
    { q: 'A cyclist speeds up from 30 to 36 km/h (20 % faster). Ignoring rolling resistance, the power needed against the air rises by about…', choices: ['20 %', '44 %', '73 %', '100 %'], a: 2,
      why: 'Aerodynamic power grows with V³: 1.2³ = 1.73, so 73 % more. The force grows with V² (44 % more); the extra factor of V comes from covering ground faster.' },
    { q: 'Which drags more at the same speed: a 1 m² square sign held face-on (C_D ≈ 1.17), or a car with C_D = 0.30 and 2.2 m² of frontal area?', choices: ['the sign: 1.17 m² of drag area against 0.66 m²', 'the car, because it is bigger', 'they are equal', 'it cannot be decided without the speed'], a: 0,
      why: 'Compare drag areas: 1.17 × 1 = 1.17 m² against 0.30 × 2.2 = 0.66 m². The flat sign drags almost twice as much as the whole car.' },
    { q: 'What is the drag on a car with C_D = 0.30 and 2.2 m² of frontal area at 25 m/s in sea-level air?', answer: 253, unit: 'N', tol: 0.02,
      why: 'q = ½ × 1.225 × 25² = 383 Pa; D = 383 × 0.30 × 2.2 = 253 N.' },
    { q: 'The drag coefficient of a body is the same whatever reference area is used.', a: false,
      why: 'C_D = D/(qA): change the area and C_D changes in inverse proportion. Aircraft quote C_D on wing area, cars on frontal area — always check which.' },
    { q: 'A racing cyclist has C_D ≈ 0.8, higher than a family car\'s 0.3. Yet at 50 km/h the cyclist\'s drag is far smaller. Why?', choices: ['the cyclist\'s frontal area is about a seventh of the car\'s', 'cyclists make lift, which cancels drag', 'air is thinner around small bodies', 'drag coefficients do not apply below 100 km/h'], a: 0,
      why: 'Drag area decides: about 0.8 × 0.3 m² = 0.24 m² for the cyclist against 0.66 m² for the car.' }
  ],
  problems: [
    { q: 'A time-trial cyclist with a drag area of 0.22 m² rides at 50 km/h in sea-level air. How much power goes into aerodynamic drag alone?', answer: 361, unit: 'W', tol: 0.02,
      steps: ['50 km/h = 13.89 m/s, and $V^3 = 2679$ m³/s³.', '$P = \\tfrac12 \\times 1.225 \\times 0.22 \\times 2679 = 361$ W.'] },
    { q: 'A quarter-scale car model with 0.12 m² of frontal area feels 32 N of drag at 40 m/s in a wind tunnel with sea-level air. What is its drag coefficient?', answer: 0.272, tol: 0.02,
      steps: ['$q = \\tfrac12 \\times 1.225 \\times 40^2 = 980$ Pa.', '$C_D = D/(qA) = 32/(980 \\times 0.12) = 0.272$.'] }
  ],
  applications: ['Fuel and energy use of cars, trucks, trains and aircraft at cruising speed.', 'Top speed of anything whose power is limited: V grows only as the cube root of power.', 'Wind loads on signs, buildings and people.', 'Ballistics and sports: how far a ball, arrow or ski jumper travels.'],
  history: 'Isaac Newton argued in the Principia (1687) that the resistance of a body grows with the density of the medium, its cross-section and the square of its speed. The coefficients came much later: Gustave Eiffel dropped bodies down a wire from his tower from 1903 and then built wind tunnels in Paris, publishing the first broad tables of reliable drag coefficients. In 1912 he found that the drag coefficient of a sphere suddenly falls at high speed — the drag crisis, explained by Prandtl\'s laboratory in Göttingen in 1914 with a thin trip wire.',
  sim: 'drag-vehicles'
},

{
  id: 'parasite-drag', parent: 'drag-types', title: 'Parasite drag', level: 2,
  short: 'All the drag an aircraft would have even if its wings made no lift: skin friction, pressure drag and interference drag, plus cooling, leakage and small protrusions. It grows with the square of speed and is summed up in one number, the zero-lift drag coefficient C_D,0.',
  keywords: ['parasite drag', 'parasitic drag', 'zero-lift drag', 'CD0', 'profile drag', 'interference drag', 'equivalent flat-plate area', 'wetted area', 'form factor', 'component build-up', 'excrescence drag', 'cooling drag', 'laminar flow'],
  prereq: ['drag-equation', 'skin-friction', 'form-drag'],
  related: ['induced-drag', 'drag-polar', 'minimum-drag-speed', 'power-required', 'streamlining', 'area-rule', 'laminar-boundary-layer', 'special-airfoils'],
  body: `
Split the drag of an aircraft into two families. **Induced drag** is the price of lift: it exists because the wing is pushing air down, and it vanishes at zero lift ([[induced-drag]]). Everything else — the drag the aircraft would have even if its wings made no lift at all — is **parasite drag**, so called because it buys nothing. In the [[drag-polar]] it is the constant term, the zero-lift drag coefficient $C_{D,0}$:

$$D_p = \\tfrac12\\rho V^2\\, C_{D,0}\\, S = q\\,f, \\qquad f = C_{D,0}\\,S$$

$f$ is the **equivalent flat-plate area**: the area of an imaginary plate with a drag coefficient of 1 that would drag as much as the whole aircraft.

### What it is made of
- **Skin friction** — the shear of the boundary layer over the whole wetted surface. It is the largest single part, about half the cruise drag of an airliner, and a turbulent layer rubs several times harder than a laminar one ([[skin-friction]]).
- **Pressure (form) drag** — from the boundary layer thickening and separating towards the tails of bodies ([[form-drag]]). Small on wings and a clean fuselage; dominant on anything blunt: wheels, struts, antennas, a step at the windscreen.
- **Interference drag** — where two parts meet, their boundary layers and pressure fields interact, and the whole drags more than the sum of the parts. A wing meeting a fuselage at a sharp corner, a strut meeting a wing, a nacelle hung close under a wing: each can add from a few per cent to half of the drag of the parts it joins. Designers write it as an interference factor $Q$ — about 1.0–1.1 for a well-filleted wing root or an engine pod a diameter away, 1.3–1.5 for a pod or store mounted directly on the wing or fuselage, 1.04–1.05 for a conventional tail. Fillets (fairings filling the corners), careful positioning and, near Mach 1, the [[area-rule]] cure it.
- **Everything else** — cooling air through the engine bay, leaks through gaps and seals, and excrescences such as rivet heads, lights, steps between panels and antennas: together often 5–15 % of the parasite drag.

### Adding it up
Designers estimate $C_{D,0}$ by a **component build-up**: each part's flat-plate skin-friction coefficient $C_f$ on its wetted area, raised by a form factor $\\mathit{FF}$ for its thickness and by the interference factor $Q$, summed and referred to the wing area:

$$C_{D,0} \\approx \\sum_i \\frac{C_{f,i}\\;\\mathit{FF}_i\\;Q_i\\;S_{\\text{wet},i}}{S_\\text{ref}} + C_{D,\\text{misc}}$$

| Aircraft (typical, rounded) | $C_{D,0}$ | Wing area | $f = C_{D,0}S$ |
|---|---|---|---|
| 15 m racing sailplane | ≈ 0.010 | 10.5 m² | ≈ 0.1 m² |
| Light aircraft, fixed gear | 0.028–0.035 | 16 m² | ≈ 0.5 m² |
| Light aircraft, retractable gear | 0.022–0.026 | 16 m² | ≈ 0.4 m² |
| First World War biplane | 0.035–0.045 | 20–25 m² | ≈ 0.9 m² |
| Jet fighter, subsonic | 0.015–0.022 | 28–40 m² | ≈ 0.6 m² |
| Narrow-body airliner | 0.018–0.020 | 123 m² | ≈ 2.3 m² |

### Why it matters most at speed
Parasite drag grows as $V^2$; induced drag falls as $1/V^2$. At low speed the induced part dominates; in cruise and above, parasite drag does, and the two are equal at the speed of best [[lift-to-drag]] ratio ([[minimum-drag-speed]]). That is why fast aircraft are obsessively clean: retractable landing gear, flush rivets, sealed control-surface gaps, faired wheels.

> [!tip] Laminar flow is the big prize. At a Reynolds number of 10⁷ a laminar boundary layer has about a seventh of the friction of a turbulent one. Sailplanes keep laminar flow over half or more of their wings, which is a large part of why their $C_{D,0}$ is a third of a light aircraft's — and why a line of squashed insects on the leading edge, tripping the layer early, costs them several per cent of their glide.
`,
  ideas: [
    'Parasite drag is all the drag not caused by lift: skin friction, pressure drag, interference drag and miscellaneous items.',
    'It is summed up by C_D,0, or by the equivalent flat-plate area f = C_D,0 S; the drag is then q·f.',
    'Parts interfere: the drag of an assembly exceeds the sum of its parts unless the junctions are faired.',
    'Parasite drag grows with V² and dominates at high speed; induced drag dominates at low speed.'
  ],
  pitfalls: [
    'Parasite drag is just skin friction — It also includes pressure drag from thickness and separation, interference at junctions, and cooling, leakage and excrescence drag; on a draggy aircraft these can outweigh the friction.',
    'The drag of an aircraft is the sum of the drag of its parts measured separately — Junctions interfere: a sharp wing–body corner or a pod close to a wing can add tens of per cent to the drag of the parts it joins, and fillets can remove most of it.',
    'Parasite drag matters most at low speed — It grows with the square of speed; at low speed induced drag is the larger part.'
  ],
  formulas: [
    {
      name: 'Parasite drag',
      expr: 'Dp = 0.5*rho*V^2*CD0*S', tex: 'D_p = \\tfrac{1}{2}\\,\\rho V^2\\, C_{D,0}\\, S',
      vars: {
        Dp: { name: 'parasite drag', q: 'force', unit: 'N', tex: 'D_p' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'true airspeed', q: 'speed', unit: 'm/s', value: 60 },
        CD0: { name: 'zero-lift drag coefficient', value: 0.030, min: 0.003, max: 0.2, tex: 'C_{D,0}' },
        S: { name: 'wing (reference) area', q: 'area', unit: 'm²', value: 16.2 }
      },
      note: 'C_D,0 × S is the equivalent flat-plate area f. Valid below the drag-divergence Mach number; configuration changes (flaps, gear) change C_D,0.',
      practice: { unknowns: ['Dp', 'V', 'CD0'] },
      stories: {
        Dp: 'An aircraft with C_D,0 = {CD0} and a wing of {S} flies at {V} in air of density {rho}. What is its parasite drag?',
        V: 'An aircraft with C_D,0 = {CD0} and {S} of wing has {Dp} of parasite drag in air of density {rho}. How fast is it flying?',
        CD0: 'A flight test at {V} in air of density {rho} finds {Dp} of parasite drag on an aircraft with {S} of wing. What is its zero-lift drag coefficient?'
      }
    },
    {
      name: 'One component of a drag build-up',
      expr: 'dCD0 = Cf*FF*Q*Swet/Sref', tex: '\\Delta C_{D,0} = \\dfrac{C_f\\,\\mathit{FF}\\,Q\\,S_\\text{wet}}{S_\\text{ref}}',
      vars: {
        dCD0: { name: 'contribution to C_D,0', tex: '\\Delta C_{D,0}' },
        Cf: { name: 'flat-plate skin-friction coefficient', value: 0.0030, min: 0.0005, max: 0.01, tex: 'C_f' },
        FF: { name: 'form factor (thickness)', value: 1.25, min: 1, max: 3, tex: '\\mathit{FF}' },
        Q: { name: 'interference factor', value: 1.05, min: 1, max: 2 },
        Swet: { name: 'wetted area of the component', q: 'area', unit: 'm²', value: 30, tex: 'S_\\text{wet}' },
        Sref: { name: 'reference (wing) area', q: 'area', unit: 'm²', value: 16.2, tex: 'S_\\text{ref}' }
      },
      note: 'C_f from the flat plate of the same length and Reynolds number; FF ≈ 1.2–1.4 for wings 10–15 % thick and fuselages of fineness 5–8; Q ≈ 1.0 (well faired) to 1.5 (pod on the wing). Add the components and a miscellaneous allowance.',
      stories: { dCD0: 'A fuselage has {Swet} of wetted area, a skin-friction coefficient of {Cf}, a form factor of {FF} and an interference factor of {Q}. What does it add to the C_D,0 of an aircraft whose wing area is {Sref}?' }
    },
    {
      name: 'Turbulent skin friction of a flat plate',
      expr: 'Cf = 0.455/(log(Re))^2.58', tex: 'C_f = \\dfrac{0.455}{(\\log_{10}\\mathrm{Re})^{2.58}}',
      vars: {
        Cf: { name: 'average skin-friction coefficient', tex: 'C_f' },
        Re: { name: 'Reynolds number on the length, VL/ν', value: 1e7, min: 1e5, max: 1e10, tex: '\\mathrm{Re}' }
      },
      note: 'Prandtl–Schlichting fit for a boundary layer turbulent from the leading edge; per unit wetted area. A fully laminar layer has C_f = 1.328/√Re, several times less.',
      stories: { Cf: 'A wing panel has a Reynolds number of {Re} on its chord. What is its average turbulent skin-friction coefficient?', Re: 'At what Reynolds number is the turbulent skin-friction coefficient {Cf}?' }
    }
  ],
  examples: [
    {
      title: 'What speed costs',
      q: 'A light aircraft has $C_{D,0} = 0.030$ and a wing of 16.2 m². Find its equivalent flat-plate area and its parasite drag and power at 60 m/s and at 70 m/s at sea level.',
      steps: [
        '$f = 0.030 \\times 16.2 = 0.486$ m².',
        'At 60 m/s: $q = \\tfrac12 \\times 1.225 \\times 60^2 = 2205$ Pa, $D_p = 2205 \\times 0.486 = 1072$ N, power $1072 \\times 60 = 64$ kW.',
        'At 70 m/s: $q = 3001$ Pa, $D_p = 1459$ N, power 102 kW — 17 % more speed, 59 % more power for the parasite drag alone.'
      ],
      a: 'f ≈ 0.49 m²; about 1.07 kN and 64 kW at 60 m/s, 1.46 kN and 102 kW at 70 m/s.'
    },
    {
      title: 'Building up C_D,0',
      q: 'Estimate $C_{D,0}$ for a light aircraft with a 16.2 m² wing: wing 31 m² wetted ($C_f = 0.0032$, $\\mathit{FF} = 1.3$, $Q = 1.0$); fuselage 30 m² ($C_f = 0.0030$, $\\mathit{FF} = 1.25$, $Q = 1.0$); tail 12 m² ($C_f = 0.0035$, $\\mathit{FF} = 1.25$, $Q = 1.04$); plus 0.010 for the fixed landing gear, cooling and small items.',
      steps: [
        'Wing: $0.0032 \\times 1.3 \\times 31/16.2 = 0.0080$.',
        'Fuselage: $0.0030 \\times 1.25 \\times 30/16.2 = 0.0069$.',
        'Tail: $0.0035 \\times 1.25 \\times 1.04 \\times 12/16.2 = 0.0034$.',
        'Sum $0.0183$, plus $0.010$ miscellaneous: $C_{D,0} \\approx 0.028$ — a third of it from the landing gear, cooling and bits.'
      ],
      a: 'C_D,0 ≈ 0.028, typical of a fixed-gear light aircraft.'
    }
  ],
  quiz: [
    { q: 'Interference drag means…', choices: ['the drag of two parts joined together is more than the sum of their separate drags', 'drag caused by radio interference with the instruments', 'the drag saved when one body shelters another', 'the induced drag of the tailplane'], a: 0,
      why: 'Where parts meet, their boundary layers and pressure fields interact; the junction flow can thicken and separate. Fillets and spacing reduce it.' },
    { q: 'An aircraft flies 1.5 times faster at the same altitude. Its parasite drag becomes…', choices: ['1.5 times as large', '2.25 times as large', '3.4 times as large', 'unchanged, because C_D,0 is constant'], a: 1,
      why: 'D_p = qC_D,0 S with q ∝ V²: 1.5² = 2.25. The power for it grows as 1.5³ = 3.4.' },
    { q: 'An aircraft has C_D,0 = 0.020 and a wing of 30 m². What is its equivalent flat-plate area?', answer: 0.6, unit: 'm²', tol: 0.02,
      why: 'f = C_D,0 × S = 0.020 × 30 = 0.6 m²: the whole aircraft drags like a 0.6 m² plate held face-on (taking C_D = 1).' },
    { q: 'Much of a sailplane\'s low C_D,0 comes from keeping the boundary layer laminar over large parts of its wing and fuselage.', a: true,
      why: 'A laminar layer has several times less skin friction than a turbulent one at the same Reynolds number; laminar-flow airfoils and smooth composite surfaces keep it that way.' },
    { q: 'Which change mainly reduces interference drag?', choices: ['a fillet where the wing meets the fuselage', 'a longer wingspan', 'flying higher', 'a larger tailplane'], a: 0,
      why: 'A fillet fills the sharp corner at the wing root, easing the pressure rise that makes the junction boundary layer separate.' }
  ],
  problems: [
    { q: 'An aircraft with an equivalent flat-plate area of 0.45 m² flies at 70 m/s at 2000 m, where ρ = 1.007 kg/m³. How much power goes into parasite drag?', answer: 77.7, unit: 'kW', tol: 0.02,
      steps: ['$q = \\tfrac12 \\times 1.007 \\times 70^2 = 2467$ Pa.', '$D_p = qf = 2467 \\times 0.45 = 1110$ N; $P = D_pV = 1110 \\times 70 = 77.7$ kW.'] }
  ],
  applications: ['Cleaning up aircraft: wheel fairings, retractable gear, flush rivets, sealed gaps and cowled engines.', 'First estimates of C_D,0 in aircraft design by component build-up.', 'Racing and record aircraft, where a few per cent of parasite drag is worth many km/h.', 'Road vehicles: the same bookkeeping of friction, pressure and interference drag for mirrors, wheels and underbodies.'],
  history: 'In 1929 Bennett Melvill Jones of Cambridge compared, in his lecture "The Streamline Aeroplane", the power real aircraft needed with that of an ideal aircraft having only skin friction and induced drag: most needed far more, the excess going into avoidable parasite drag. His paper, together with the NACA cowling for radial engines (1928), which raised the top speed of a test aircraft from about 190 to 220 km/h, opened the era of smooth monocoque skins, enclosed engines and retractable landing gear.',
  sim: { id: 'drag-polar', params: { craft: 'light' } }
},

{
  id: 'form-drag', parent: 'drag-types', title: 'Pressure (form) drag', level: 2,
  short: 'The drag that comes from the air pressing harder on the front of a body than on its back. It is small when the boundary layer follows the surface to a fine tail, and large when the flow separates and leaves a wide, low-pressure wake.',
  keywords: ['form drag', 'pressure drag', 'profile drag', 'separation', 'wake', 'base pressure', 'base drag', 'boat tail', 'Kamm tail', 'wake rake', 'momentum thickness', 'pressure recovery', 'adverse pressure gradient'],
  prereq: ['drag-equation', 'flow-separation', 'pressure-coefficient', 'boundary-layer'],
  related: ['dalembert-paradox', 'bluff-bodies', 'streamlining', 'drag-crisis', 'skin-friction', 'parasite-drag', 'vortex-shedding', 'vehicle-aerodynamics', 'flow-control'],
  body: `
Add up the pressure pushing on every part of a body's surface and take the component along the flow: that is **pressure drag**, also called form drag because it depends mostly on the body's shape. (The other contribution, the shear of the air rubbing along the surface, is [[skin-friction]].)

In a perfect, frictionless fluid there would be none. The air would slow down in front of the body, raising the pressure; speed up round its sides; and slow down again behind it, so that the pressure on the back rose to match the front exactly. Every push backward would be cancelled by a push forward — the famous [[dalembert-paradox|paradox of d'Alembert]].

Real air has a [[boundary-layer|boundary layer]] that has lost energy to friction. Behind the widest point the pressure must rise again — an *adverse* pressure gradient — and the tired layer cannot climb it all the way. It **separates** ([[flow-separation]]) and leaves a turbulent, recirculating wake whose pressure stays low, near or even below that of the free stream. The front is pushed hard, the back hardly at all, and the difference is the drag.

### Who is pressure, who is friction
| Body | Pressure drag | Skin friction |
|---|---|---|
| Flat plate along the flow | none | all |
| Airfoil at a small angle | 10–20 % | 80–90 % |
| Streamlined body of revolution | 15–25 % | 75–85 % |
| Sphere below the drag crisis | about 90–95 % | 5–10 % |
| Circular cylinder across the flow | about 97 % | about 3 % |
| Flat plate across the flow | all | none |

The two trade. Roughening a sphere adds a little friction, but by turning its boundary layer turbulent it keeps the flow attached further round the back, narrows the wake and can cut the pressure drag by more than half — the [[drag-crisis]] behind the dimples of a golf ball.

### The back of the body decides
How quickly the surface turns away from the flow decides where it separates. A rounded nose followed by a long, gently tapering tail keeps the flow attached almost to the end, with little pressure drag. The same shape flown tail-first separates at once and drags several times more. A hemispherical cup has $C_D \\approx 0.4$ dome-first and about 1.4 hollow-first — which is why a cup anemometer turns.

A body with a flat, cut-off rear feels **base drag**. Its base sits in the wake at a base pressure coefficient $C_{p,b}$ of about −0.1 to −0.2 for a blunt-ended body of revolution, and −0.5 or lower behind a two-dimensional blunt trailing edge, where the shed vortices suck hardest. On vans, buses and trucks base drag is a large part of the total.

### The wake tells the drag
The drag reappears downstream as missing momentum: the air in the wake is slower than the air around it. Far behind a wing section the drag per metre of span is $\\rho V^2\\theta$, where $\\theta$ is the **momentum thickness** of the wake — the thickness of free-stream flow that would carry the missing momentum. A comb of pitot tubes behind the section, a *wake rake*, measures it; this is how glider designers measure section drag in flight. (It gives the whole profile drag, pressure and friction together.)

### Cures
- Taper the tail gently: surfaces that turn away from the flow by more than about 12–15° let the boundary layer separate. Boat tails on trucks, cars and bullets do this.
- Cut the tail off where it is already small: a **Kamm tail** loses little and saves length.
- Round the front edges of blunt bodies, so the flow does not separate at the corners: a van with generously rounded front edges drags far less than a sharp-edged box.
- Delay separation: trip the boundary layer turbulent, add vortex generators, suck or blow ([[flow-control]]).
`,
  ideas: [
    'Pressure drag is the net push of the pressure field along the flow; with no friction it would vanish (d\'Alembert).',
    'It arises because the boundary layer separates on the rear of the body and leaves a low-pressure wake.',
    'Blunt bodies have almost pure pressure drag, streamlined bodies mostly friction drag.',
    'The shape of the rear decides: gentle taper keeps the flow attached; a cut-off base sits in a low-pressure wake.',
    'The drag can be read from the wake: its momentum deficit equals the drag.'
  ],
  pitfalls: [
    'Pressure drag is caused by the air hitting the front — The high pressure on the front is largely matched by pressure recovering on the rear when the flow stays attached. The drag comes from the missing recovery: the low pressure in a separated wake.',
    'A pointed nose is the key to low drag — At subsonic speeds a rounded nose works as well or better; the tail must be long and gently tapered. (At supersonic speeds a sharp nose does matter: that is wave drag.)',
    'Pressure drag and friction drag are independent — They trade: a rougher surface adds friction but, by delaying separation, can remove far more pressure drag.'
  ],
  formulas: [
    {
      name: 'Base drag of a blunt rear',
      expr: 'Db = -Cpb*0.5*rho*V^2*Ab', tex: 'D_b = -C_{p,b}\\;\\tfrac{1}{2}\\,\\rho V^2\\, A_b',
      vars: {
        Db: { name: 'base drag', q: 'force', unit: 'N', tex: 'D_b' },
        Cpb: { name: 'base pressure coefficient', value: -0.2, min: -1.5, max: 0, signed: true, tex: 'C_{p,b}' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'speed', q: 'speed', unit: 'km/h', value: 90 },
        Ab: { name: 'base area', q: 'area', unit: 'm²', value: 3.5, tex: 'A_b' }
      },
      note: 'C_p,b = (p_base − p∞)/q is negative: the base is sucked backwards. About −0.1 to −0.2 behind blunt bodies of revolution and vehicles, −0.5 or lower behind two-dimensional blunt trailing edges.',
      stories: {
        Db: 'A van has a flat rear of {Ab} with a base pressure coefficient of {Cpb}. What is its base drag at {V} in air of density {rho}?',
        Cpb: 'The flat {Ab} base of a trailer contributes {Db} of drag at {V} (air density {rho}). What is the base pressure coefficient?'
      }
    },
    {
      name: 'Drag from the momentum lost in the wake',
      expr: 'D = rho*V^2*theta*b', tex: 'D = \\rho V^2\\, \\theta\\, b',
      vars: {
        D: { name: 'profile drag of the span b', q: 'force', unit: 'N' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'free-stream speed', q: 'speed', unit: 'm/s', value: 40 },
        theta: { name: 'momentum thickness of the wake, far downstream', q: 'length', unit: 'mm', value: 1.2, tex: '\\theta' },
        b: { name: 'span measured', q: 'length', unit: 'm', value: 1 }
      },
      note: 'Far enough behind the body that the wake pressure has returned to free-stream. Gives the whole profile drag of a two-dimensional section (pressure plus friction); induced drag does not show up in it.',
      stories: {
        D: 'A wake rake behind a wing section at {V} (air density {rho}) finds a momentum thickness of {theta}. What is the drag of {b} of span?',
        theta: 'A section of span {b} has {D} of profile drag at {V} in air of density {rho}. What momentum thickness should the wake rake find?'
      }
    }
  ],
  examples: [
    {
      title: 'The base drag of a van',
      q: 'A box van has a flat rear of 3.5 m² with a base pressure coefficient of −0.2, and a total drag area of 1.3 m². At 90 km/h at sea level, how much of its drag is base drag?',
      steps: [
        '90 km/h = 25 m/s: $q = \\tfrac12 \\times 1.225 \\times 25^2 = 383$ Pa.',
        'Base drag: $D_b = 0.2 \\times 383 \\times 3.5 = 268$ N.',
        'Total drag: $383 \\times 1.3 = 498$ N, so the base contributes $268/498 = 54$ %.'
      ],
      a: 'About 270 N of the 500 N total — over half the van\'s drag comes from the suction on its flat back.'
    },
    {
      title: 'Measuring drag with a wake rake',
      q: 'A wing section of 0.25 m chord is tested at 40 m/s in sea-level air. Far behind it, the wake rake finds a momentum thickness of 1.2 mm. What is the section\'s drag coefficient?',
      steps: [
        'Drag per metre of span: $\\rho V^2\\theta = 1.225 \\times 40^2 \\times 0.0012 = 2.35$ N/m.',
        'Dynamic pressure $q = \\tfrac12 \\times 1.225 \\times 40^2 = 980$ Pa.',
        '$c_d = D\'/(qc) = 2.35/(980 \\times 0.25) = 0.0096$.'
      ],
      a: 'c_d ≈ 0.0096, a typical value for a smooth airfoil at a small angle.'
    }
  ],
  quiz: [
    { q: 'Why does a streamlined body have little pressure drag?', choices: ['its gently tapering tail lets the boundary layer stay attached, so the pressure recovers at the back', 'its pointed nose cuts through the air', 'it has less surface area', 'air cannot push on smooth surfaces'], a: 0,
      why: 'Pressure drag comes from the missing pressure recovery behind a separated flow. Keep the flow attached to the tail and most of the pressure on the front is cancelled by pressure on the back.' },
    { q: 'A hemispherical cup facing the wind hollow-first has C_D ≈ 1.4. Turned round, dome-first, its C_D is about…', choices: ['1.4 — it is the same shape', '0.4', '2.8', 'zero'], a: 1,
      why: 'The dome lets the flow round it before separating; the hollow side traps a high-pressure pocket in front and leaves a wide wake. The difference drives a cup anemometer.' },
    { q: 'In a perfectly frictionless fluid, a body moving steadily at subsonic speed would feel no pressure drag.', a: true,
      why: 'That is d\'Alembert\'s paradox: without a boundary layer the flow closes behind the body and the pressure recovers completely. Viscosity, through separation, makes the drag.' },
    { q: 'Which part of a van mainly sets its pressure drag?', choices: ['the flat rear, where the flow separates into a low-pressure wake', 'the tyre tread', 'the roof panel', 'the paint'], a: 0,
      why: 'The base sits in the wake at negative pressure; on bluff vehicles base drag can be half the total. Rounded front edges matter too, by stopping separation at the front corners.' },
    { q: 'A truck\'s flat rear of 9 m² has a base pressure coefficient of −0.15. What is its base drag at 25 m/s in sea-level air?', answer: 517, unit: 'N', tol: 0.02,
      why: 'q = ½ × 1.225 × 25² = 383 Pa; D_b = 0.15 × 383 × 9 = 517 N.' }
  ],
  problems: [
    { q: 'A wake rake behind a 1 m span of glider wing at 30 m/s in air of density 1.2 kg/m³ measures a momentum thickness of 0.8 mm. What is the profile drag of that metre of wing?', answer: 0.864, unit: 'N', tol: 0.02,
      steps: ['$D = \\rho V^2 \\theta b = 1.2 \\times 30^2 \\times 0.0008 \\times 1$.', '$= 0.864$ N.'] }
  ],
  applications: ['Boat-tailed and Kamm-tailed rear ends of cars and trucks; boat tails on bullets and artillery shells.', 'Rounded front edges and cab fairings on vans and trucks.', 'Wake-rake drag measurement on gliders, in wind tunnels and on wind-turbine blades.', 'Fairings round landing gear, struts, antennas and sensors.'],
  history: 'In the 1930s Wunibald Kamm, at the vehicle research institute in Stuttgart, showed that the long tail of a streamlined car could be cut off square once its cross-section had shrunk to about half, with little drag penalty. The "Kamm tail" is still the shape of many efficient cars. The wake-momentum method of measuring section drag goes back to Albert Betz in Göttingen (1925) and to Bennett Melvill Jones in Cambridge, whose pitot-traverse method of 1936 measured it in flight; glider designers still use it.',
  sim: 'drag-ball-flight'
},

{
  id: 'wave-drag', parent: 'drag-types', title: 'Wave drag', level: 3,
  short: 'The extra drag of flying near and above the speed of sound, when the air cannot move aside smoothly and shock waves form. It rises steeply past the drag-divergence Mach number, peaks just above Mach 1, and is fought with thin, swept wings and a smooth distribution of cross-section along the aircraft.',
  keywords: ['wave drag', 'shock wave', 'transonic', 'supersonic', 'drag divergence', 'drag rise', 'critical Mach number', 'sound barrier', 'area rule', 'Sears-Haack body', 'Ackeret', 'supersonic airfoil', 'Korn equation', 'supercritical airfoil'],
  prereq: ['drag-equation', 'mach-number', 'normal-shock', 'oblique-shock'],
  related: ['critical-mach', 'transonic-flow', 'area-rule', 'swept-wing-compressibility', 'supersonic-airfoils', 'special-airfoils', 'sonic-boom', 'mach-cone', 'physics:shock-waves'],
  body: `
At low speed the air ahead of a moving body is warned of its approach: pressure disturbances run ahead at the [[speed-of-sound|speed of sound]], and the air starts to move aside well before the body arrives. Near and above the speed of sound the warning comes too late. The flow must adjust abruptly, through **shock waves** — thin layers across which pressure, density and temperature jump ([[normal-shock]], [[oblique-shock]]). A shock is irreversible: the air leaves it with less total pressure than it entered with. That loss, the momentum carried away by the shock pattern, is **wave drag**. Unlike subsonic pressure drag, it would exist even in a perfectly frictionless fluid.

### Transonic: the drag rise
Air speeds up over the top of a wing, so local supersonic pockets appear long before the aircraft itself reaches Mach 1 — from the [[critical-mach|critical Mach number]], typically 0.7–0.8 for a transport wing. At first the shocks closing these pockets are weak. A little faster they strengthen, thicken the boundary layer behind them and may make it separate, causing buffet; the drag coefficient then climbs steeply. The **drag-divergence Mach number** $M_{dd}$ marks the start of the climb (commonly defined as where $dC_D/dM$ reaches 0.1). Past Mach 1 the whole aircraft sits behind a bow shock, and its zero-lift drag coefficient is typically two to three times its subsonic value, peaking just above Mach 1 and falling slowly after.

A rough rule for an unswept section, the **Korn equation**, shows how thickness and lift pull $M_{dd}$ down: $M_{dd} \\approx \\kappa - t/c - c_l/10$, with $\\kappa \\approx 0.87$ for classic sections and about 0.95 for [[special-airfoils|supercritical]] ones. Sweeping the wing raises it further ([[swept-wing-compressibility]]). Airliners cruise at Mach 0.78–0.85, just below their drag divergence.

### Supersonic: thin and slender
In fully supersonic flow, linear (Ackeret) theory gives the pressure on a thin surface directly from its local slope $\\vartheta$ to the stream: $C_p = 2\\vartheta/\\sqrt{M^2-1}$. For a thin section at angle of attack $\\alpha$ this gives a wave-drag coefficient

$$c_{d,w} = \\frac{4}{\\sqrt{M^2-1}}\\left(\\alpha^2 + k\\,\\tau^2\\right)$$

with $\\tau = t/c$ the thickness ratio and $k = 1$ for a double wedge, 4/3 for a biconvex section. Thickness is punished **quadratically**: a supersonic wing 4 % thick has a quarter of the thickness wave drag of one 8 % thick. That is why supersonic aircraft have razor-thin wings, 3–5 % thick, and why Concorde reached a lift-to-drag ratio of only about 7.5 at Mach 2, against 15–20 for subsonic airliners.

For a body, what matters is how its cross-section area grows and shrinks along its length. The body of least wave drag for a given length $l$ and largest cross-section $A_{\\max}$, the **Sears–Haack body**, has

$$\\frac{D}{q} = \\frac{9\\pi}{2}\\,\\frac{A_{\\max}^2}{l^2}$$

— double the length and the wave drag falls fourfold. Near Mach 1 a whole aircraft behaves like one body whose cross-section includes the wings, and that total should vary as smoothly as a Sears–Haack body's: the [[area-rule]], which gave the fighters of the 1950s their waisted "Coke-bottle" fuselages.

| Regime | Wave drag | What designers do |
|---|---|---|
| Below the critical Mach number | none | — |
| Critical Mach to drag divergence | small (weak shocks) | supercritical airfoils |
| Drag divergence to about Mach 1.2 | steep rise; shock-induced separation, buffet | sweep, thin wings, area rule |
| Supersonic | falls slowly (as $1/\\sqrt{M^2-1}$ for thin shapes) but stays large | slender bodies; thin, sharp wings swept behind the [[mach-cone|Mach cone]] |
`,
  ideas: [
    'Wave drag is the drag of shock waves: an irreversible loss that exists even without viscosity.',
    'It starts at the critical Mach number, below Mach 1, and rises steeply past the drag-divergence Mach number.',
    'Supersonic wave drag grows with the square of thickness and of angle of attack (Ackeret), so supersonic wings are thin.',
    'For bodies, wave drag depends on the distribution of cross-section area: long, slender and smooth (Sears–Haack, area rule).'
  ],
  pitfalls: [
    'Wave drag begins at Mach 1 — Local supersonic pockets and shocks appear on a wing from its critical Mach number, often 0.7–0.8; the drag rise starts below Mach 1.',
    'Drag keeps climbing ever faster beyond the "sound barrier" — The wave-drag coefficient peaks just above Mach 1 and then falls slowly. The barrier of the 1940s was a peak of drag and a loss of control, not a wall; the drag force itself still grows with q.',
    'A sharp nose is all a supersonic body needs — The whole distribution of cross-section matters: for a given maximum area the wave drag falls as 1/l², and wings and fuselage must be shaped together (area rule).'
  ],
  formulas: [
    {
      name: 'Supersonic wave drag of a thin double-wedge section (Ackeret)',
      expr: 'cd = 4*(alpha^2 + tau^2)/sqrt(M^2 - 1)', tex: 'c_{d,w} = \\dfrac{4\\,(\\alpha^2 + \\tau^2)}{\\sqrt{M^2 - 1}}',
      vars: {
        cd: { name: 'section wave-drag coefficient', tex: 'c_{d,w}' },
        alpha: { name: 'angle of attack', q: 'angle', unit: '°', value: 2, min: 0, max: 10, tex: '\\alpha' },
        tau: { name: 'thickness ratio t/c', value: 0.05, min: 0, max: 0.2, tex: '\\tau' },
        M: { name: 'free-stream Mach number', value: 2, min: 1.1, max: 5 }
      },
      note: 'Linear theory for thin sections, roughly Mach 1.2–5. For a flat plate τ = 0; for a biconvex (circular-arc) section replace τ² by (4/3)τ². Add skin friction (c_d ≈ 0.005–0.007) for the total. The same theory gives the lift, c_l = 4α/√(M² − 1).',
      practice: { unknowns: ['cd', 'tau', 'M'] },
      stories: {
        cd: 'A double-wedge wing section {tau} thick meets a Mach {M} stream at {alpha}. What is its wave-drag coefficient?',
        tau: 'A supersonic section must have a wave-drag coefficient of no more than {cd} at Mach {M} and {alpha}. How thick may it be (t/c)?',
        M: 'At what Mach number does a double wedge {tau} thick at {alpha} have a wave-drag coefficient of {cd}?'
      }
    },
    {
      name: 'Wave drag of the Sears–Haack body',
      expr: 'D = 0.5*rho*V^2*9*pi*A^2/(2*l^2)', tex: 'D = \\tfrac12\\rho V^2\\;\\dfrac{9\\pi\\, A_{\\max}^2}{2\\,l^2}',
      vars: {
        D: { name: 'wave drag', q: 'force', unit: 'N' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 0.414, tex: '\\rho' },
        V: { name: 'speed', q: 'speed', unit: 'm/s', value: 600 },
        A: { name: 'largest cross-section area', q: 'area', unit: 'm²', value: 0.07, tex: 'A_{\\max}' },
        l: { name: 'body length', q: 'length', unit: 'm', value: 5 }
      },
      note: 'The least wave drag a closed, slender body of this length and largest cross-section can have (slender-body theory, supersonic). Real bodies have more; friction comes on top. ρ = 0.414 kg/m³ at 10 km in the standard atmosphere, where 600 m/s is Mach 2.',
      practice: { unknowns: ['D', 'l'] },
      stories: {
        D: 'A slender missile {l} long with a largest cross-section of {A} flies at {V} through air of density {rho}. What is the least wave drag it can have?',
        l: 'A Sears–Haack body with a largest cross-section of {A} must have no more than {D} of wave drag at {V} in air of density {rho}. How long must it be?'
      }
    },
    {
      name: 'Drag-divergence Mach number (Korn equation, unswept)',
      expr: 'Mdd = kappa - tau - cl/10', tex: 'M_{dd} = \\kappa - \\tau - \\dfrac{c_l}{10}',
      vars: {
        Mdd: { name: 'drag-divergence Mach number', tex: 'M_{dd}' },
        kappa: { name: 'technology factor (0.87 classic, 0.95 supercritical)', value: 0.95, min: 0.8, max: 1, tex: '\\kappa' },
        tau: { name: 'thickness ratio t/c', value: 0.12, min: 0, max: 0.25, tex: '\\tau' },
        cl: { name: 'section lift coefficient', value: 0.5, min: -0.5, max: 1.5, signed: true, tex: 'c_l' }
      },
      note: 'An empirical rule of thumb for unswept two-dimensional sections; accurate to a few hundredths. With sweep Λ it becomes M_dd cos Λ + τ/cos²Λ + c_l/(10 cos³Λ) = κ.',
      stories: {
        Mdd: 'A supercritical section (κ = {kappa}) is {tau} thick and works at c_l = {cl}. Where does its drag diverge?',
        tau: 'A section with κ = {kappa} must reach M_dd = {Mdd} at c_l = {cl}. How thick can it be?'
      }
    }
  ],
  examples: [
    {
      title: 'A thin wing at Mach 2',
      q: 'A double-wedge section 4 % thick flies at Mach 2 at 3° angle of attack. Find its wave-drag and lift coefficients by linear theory, and its lift-to-drag ratio if skin friction adds $c_d = 0.006$.',
      steps: [
        '$\\alpha = 3° = 0.0524$ rad, $\\sqrt{M^2 - 1} = \\sqrt{3} = 1.732$.',
        '$c_{d,w} = 4(0.0524^2 + 0.04^2)/1.732 = 4 \\times 0.00434/1.732 = 0.0100$.',
        '$c_l = 4\\alpha/\\sqrt{M^2-1} = 0.2094/1.732 = 0.121$.',
        'Total $c_d = 0.0100 + 0.006 = 0.0160$, so $c_l/c_d = 7.5$ — about Concorde\'s whole-aircraft value, though this is a single section.'
      ],
      a: 'c_d,w ≈ 0.010, c_l ≈ 0.12, L/D ≈ 7.5: supersonic flight is aerodynamically expensive.'
    },
    {
      title: 'Why airliners use supercritical wings',
      q: 'Use the Korn equation for an unswept section working at $c_l = 0.5$. What is $M_{dd}$ for a 12 % thick classic section ($\\kappa = 0.87$) and a supercritical one ($\\kappa = 0.95$)? How thick could the supercritical section be at the classic one\'s $M_{dd}$?',
      steps: [
        'Classic: $M_{dd} = 0.87 - 0.12 - 0.05 = 0.70$.',
        'Supercritical: $M_{dd} = 0.95 - 0.12 - 0.05 = 0.78$.',
        'At $M_{dd} = 0.70$: $\\tau = 0.95 - 0.05 - 0.70 = 0.20$ — a 20 % thick section, with room for fuel, a lighter spar and less sweep.'
      ],
      a: 'M_dd 0.70 against 0.78; or, at the same M_dd, a supercritical section can be two-thirds thicker.'
    },
    {
      title: 'Stretching a missile',
      q: 'A slender missile 5 m long with a 0.30 m diameter body flies at Mach 2 at 10 km ($V = 600$ m/s, $\\rho = 0.414$ kg/m³). What is the least wave drag its body can have, and what if it were stretched to 7.5 m?',
      steps: [
        '$A_{\\max} = \\pi \\times 0.15^2 = 0.0707$ m²; $q = \\tfrac12 \\times 0.414 \\times 600^2 = 74\\,500$ Pa.',
        '$D/q = \\tfrac{9\\pi}{2} \\times 0.0707^2/5^2 = 0.00283$ m², so $D = 211$ N — a coefficient of $0.00283/0.0707 = 0.040$ on frontal area.',
        'At 7.5 m: $D \\propto 1/l^2$, so $211 \\times (5/7.5)^2 = 94$ N.'
      ],
      a: 'About 210 N; stretching by half cuts it to about 94 N.'
    }
  ],
  quiz: [
    { q: 'Wave drag appears only once an aircraft flies faster than sound.', a: false,
      why: 'Air accelerates over the wing, so local supersonic regions closed by shocks appear from the critical Mach number, typically 0.7–0.8. The drag rise starts below Mach 1.' },
    { q: 'By linear theory, doubling the thickness ratio of a supersonic wing at zero lift multiplies its wave drag by…', choices: ['2', '4', '√2', '8'], a: 1,
      why: 'c_d,w ∝ τ² at zero lift, so twice as thick means four times the wave drag.' },
    { q: 'Why do supersonic aircraft have long, slender fuselages and thin wings?', choices: ['wave drag grows with the square of thickness, and for bodies with (A_max/l)²', 'to reduce skin friction', 'to carry more fuel', 'thin wings make more lift at supersonic speed'], a: 0,
      why: 'Both Ackeret\'s result for sections and the Sears–Haack result for bodies punish thickness quadratically; slenderness is the cure.' },
    { q: 'What does the area rule say?', choices: ['near Mach 1, the wave drag depends on how the total cross-section area, wings included, varies along the length — so it should vary smoothly', 'the wing area must equal the fuselage cross-section', 'the fuselage must be a cylinder', 'the wing area should be as large as possible'], a: 0,
      why: 'Whitcomb found that a transonic aircraft behaves like a body of revolution with the same area distribution; waisting the fuselage where the wings are smooths it.' },
    { q: 'An unswept supercritical section (κ = 0.95) is 10 % thick and works at c_l = 0.6. What is its drag-divergence Mach number by the Korn equation?', answer: 0.79, tol: 0.02,
      why: 'M_dd = 0.95 − 0.10 − 0.06 = 0.79.' }
  ],
  problems: [
    { q: 'A double-wedge section 5 % thick is at zero angle of attack at Mach 1.5. What is its wave-drag coefficient by linear theory?', answer: 0.00894, tol: 0.02,
      steps: ['$\\sqrt{M^2 - 1} = \\sqrt{1.25} = 1.118$.', '$c_{d,w} = 4 \\times 0.05^2/1.118 = 0.01/1.118 = 0.00894$.'] }
  ],
  applications: ['Supercritical, swept wings of airliners cruising at Mach 0.78–0.85.', 'Area-ruled fuselages and thin wings of supersonic fighters.', 'Pointed, boat-tailed bullets and shells.', 'The shaping of supersonic transports for low wave drag and quieter sonic booms.'],
  history: 'Jakob Ackeret worked out linear supersonic airfoil theory in Zurich in 1925. At the Volta conference in Rome in 1935 Adolf Busemann showed that sweeping a wing reduces its wave drag. Wave drag and shock-induced loss of control made up the "sound barrier" that the Bell X-1 broke on 14 October 1947. Richard Whitcomb found the area rule at NACA Langley in 1952; the Convair F-102, unable to pass Mach 1 as first built, went supersonic after its fuselage was waisted in line with it.'
},

{
  id: 'drag-polar', parent: 'drag-types', title: 'The drag polar', level: 2,
  short: 'The curve of an aircraft\'s drag coefficient against its lift coefficient. For most aircraft it is close to a parabola, C_D = C_D,0 + C_L²/(πARe): a fixed parasite part plus an induced part that grows with the square of the lift.',
  keywords: ['drag polar', 'parabolic drag polar', 'CD0', 'induced drag factor', 'K', 'Oswald efficiency', 'aspect ratio', 'L/D max', 'tangent from the origin', 'Lilienthal', 'lift-dependent drag', 'minimum power', 'best range'],
  prereq: ['induced-drag', 'parasite-drag', 'lift-equation', 'oswald-efficiency'],
  related: ['lift-to-drag', 'minimum-drag-speed', 'power-required', 'gliding', 'aspect-ratio', 'range-endurance', 'lift-curve', 'wave-drag', 'high-lift-devices'],
  body: `
Measure an aircraft's lift and drag coefficients at every angle of attack and plot one against the other — lift coefficient up, drag coefficient across — and you get its **drag polar**: one curve that sums up its aerodynamics in a given configuration. (Otto Lilienthal drew his wing measurements this way in the 1880s; the name stuck.) For most aircraft, below the stall and well below the speed of sound, the curve is very nearly a parabola:

$$C_D = C_{D,0} + K\\,C_L^2, \\qquad K = \\frac{1}{\\pi\\,\\mathit{AR}\\,e}$$

- $C_{D,0}$, the zero-lift drag coefficient, is the [[parasite-drag]]: friction, pressure and interference drag that exist whatever the lift.
- $KC_L^2$ is the lift-dependent drag. Mostly it is [[induced-drag]] — for an ideal elliptic wing exactly $C_L^2/(\\pi\\,\\mathit{AR})$ — plus the extra profile drag the sections make at higher angles. Both are lumped into the [[oswald-efficiency|Oswald efficiency factor]] $e$, 0.7–0.85 for a whole aircraft.

### Reading the polar
A line from the origin to any point of the polar has slope $C_L/C_D = L/D$. Tilt such a line up until it just **touches** the polar: the point of contact is the best [[lift-to-drag|lift-to-drag ratio]]. Setting the derivative of $C_L/(C_{D,0} + KC_L^2)$ to zero gives

$$C_L^* = \\sqrt{\\frac{C_{D,0}}{K}}, \\qquad \\left(\\frac{L}{D}\\right)_{\\max} = \\frac{1}{2\\sqrt{K\\,C_{D,0}}} = \\frac12\\sqrt{\\frac{\\pi\\,\\mathit{AR}\\,e}{C_{D,0}}}$$

At that point $KC_L^2 = C_{D,0}$: **induced and parasite drag are equal**. Two other points matter. Where $C_L^{3/2}/C_D$ is greatest — at $C_L = \\sqrt{3C_{D,0}/K}$, with induced drag three times the parasite drag — the power needed is least: a glider's minimum sink, a propeller aircraft's longest endurance. Where $C_L^{1/2}/C_D$ is greatest — induced drag a third of the parasite — a jet flies furthest ([[range-endurance]]).

| Aircraft (rounded) | AR | e | $C_{D,0}$ | $C_L^*$ | $(L/D)_{\\max}$ |
|---|---|---|---|---|---|
| Light aircraft | 7.4 | 0.75 | 0.030 | 0.72 | ≈ 12 |
| Jet fighter, subsonic | 3.2 | 0.80 | 0.018 | 0.38 | ≈ 10.5 |
| Narrow-body airliner | 9.5 | 0.80 | 0.019 | 0.67 | ≈ 18 |
| 15 m sailplane | 21.4 | 0.90 | 0.0095 | 0.76 | ≈ 40 |

The formula shows the designer's two levers, and they weigh the same: $(L/D)_{\\max}$ grows as $\\sqrt{\\mathit{AR}/C_{D,0}}$. Doubling the aspect ratio or halving the parasite drag each buys a factor $\\sqrt2 = 1.41$ — which is why sailplanes have long, slender, polished wings.

### Where the parabola fails
- Cambered wings have their least drag at a small positive lift, not at zero: $C_D = C_{D,\\min} + K(C_L - C_{L,\\min D})^2$.
- Near the stall, separation makes the drag climb much faster than $C_L^2$.
- Above the drag-divergence Mach number, [[wave-drag]] adds a term that grows with Mach number.
- Flaps, landing gear and spoilers give a different polar: with everything down for landing, $C_{D,0}$ may be two to four times its clean value.
- The polar shifts a little with [[reynolds-number|Reynolds number]], so a wind-tunnel polar must be corrected to full scale.

> [!key] The drag polar is an aircraft's aerodynamic fingerprint. Combined with its weight, wing area and the air density through the lift equation, it gives the drag at every speed — and from that the whole of [[power-required|flight performance]].
`,
  ideas: [
    'The drag polar plots C_L against C_D; for most aircraft it is a parabola, C_D = C_D,0 + C_L²/(πARe).',
    'Any ray from the origin has slope L/D; the tangent from the origin marks (L/D)max.',
    'At (L/D)max induced drag equals parasite drag; (L/D)max = ½√(πARe/C_D,0).',
    'Aspect ratio and parasite drag are equal levers: (L/D)max grows as √(AR/C_D,0).',
    'Each configuration, Reynolds number and Mach number has its own polar.'
  ],
  pitfalls: [
    'The lowest point of the polar (least C_D) is the most efficient way to fly — Least drag coefficient occurs near zero lift, where L/D is near zero. Efficiency is the ratio, found at the tangent from the origin.',
    'Induced drag is part of C_D,0 — C_D,0 is by definition the drag at zero lift; induced drag vanishes there and grows as C_L².',
    'An aircraft has one polar — Flaps, gear, spoilers, a stopped propeller, Mach number and Reynolds number each give a different polar; performance charts use a family of them.'
  ],
  formulas: [
    {
      name: 'The parabolic drag polar',
      expr: 'CD = CD0 + CL^2/(pi*AR*osw)', tex: 'C_D = C_{D,0} + \\dfrac{C_L^2}{\\pi\\,\\mathit{AR}\\,e}',
      vars: {
        CD: { name: 'drag coefficient', tex: 'C_D' },
        CD0: { name: 'zero-lift drag coefficient', value: 0.030, min: 0.003, max: 0.2, tex: 'C_{D,0}' },
        CL: { name: 'lift coefficient', value: 0.5, min: -1.5, max: 3, signed: true, tex: 'C_L' },
        AR: { name: 'aspect ratio b²/S', value: 7.4, min: 1, max: 50, tex: '\\mathit{AR}' },
        osw: { name: 'Oswald efficiency factor', value: 0.75, min: 0.3, max: 1, tex: 'e' }
      },
      note: 'Good below the stall and below the drag-divergence Mach number, for one configuration. All coefficients on the wing area.',
      practice: { unknowns: ['CD', 'CL', 'osw'] },
      stories: {
        CD: 'An aircraft with C_D,0 = {CD0}, aspect ratio {AR} and e = {osw} flies at C_L = {CL}. What is its drag coefficient?',
        CL: 'An aircraft (C_D,0 = {CD0}, AR = {AR}, e = {osw}) is measured at C_D = {CD}. At what lift coefficient is it flying?',
        osw: 'Flight tests of an aircraft with C_D,0 = {CD0} and aspect ratio {AR} give C_D = {CD} at C_L = {CL}. What is its Oswald efficiency?'
      }
    },
    {
      name: 'Best lift-to-drag ratio',
      expr: 'LDmax = 0.5*sqrt(pi*AR*osw/CD0)', tex: '\\mathit{(L/D)}_{\\max} = \\tfrac12\\sqrt{\\dfrac{\\pi\\,\\mathit{AR}\\,e}{C_{D,0}}}',
      vars: {
        LDmax: { name: 'maximum lift-to-drag ratio', tex: '\\mathit{(L/D)}_{\\max}' },
        AR: { name: 'aspect ratio', value: 7.4, min: 1, max: 50, tex: '\\mathit{AR}' },
        osw: { name: 'Oswald efficiency factor', value: 0.75, min: 0.3, max: 1, tex: 'e' },
        CD0: { name: 'zero-lift drag coefficient', value: 0.030, min: 0.003, max: 0.2, tex: 'C_{D,0}' }
      },
      note: 'From the parabolic polar, at the tangent from the origin, where induced and parasite drag are equal. Real aircraft come within a few per cent below the stall and drag divergence.',
      practice: { unknowns: ['LDmax', 'AR', 'CD0'] },
      stories: {
        LDmax: 'An aircraft has aspect ratio {AR}, Oswald factor {osw} and C_D,0 = {CD0}. What is its best lift-to-drag ratio?',
        AR: 'A designer wants (L/D)max = {LDmax} with C_D,0 = {CD0} and e = {osw}. What aspect ratio does the wing need?',
        CD0: 'A sailplane with aspect ratio {AR} and e = {osw} glides at best {LDmax} to 1. What is its zero-lift drag coefficient?'
      }
    },
    {
      name: 'Lift coefficient of best L/D',
      expr: 'CLs = sqrt(pi*AR*osw*CD0)', tex: 'C_L^* = \\sqrt{\\pi\\,\\mathit{AR}\\,e\\,C_{D,0}}',
      vars: {
        CLs: { name: 'lift coefficient at (L/D)max', tex: 'C_L^*' },
        AR: { name: 'aspect ratio', value: 7.4, min: 1, max: 50, tex: '\\mathit{AR}' },
        osw: { name: 'Oswald efficiency factor', value: 0.75, min: 0.3, max: 1, tex: 'e' },
        CD0: { name: 'zero-lift drag coefficient', value: 0.030, min: 0.003, max: 0.2, tex: 'C_{D,0}' }
      },
      note: 'Where K C_L² = C_D,0. Minimum power (minimum sink) is at √3 times this C_L; best jet range at 1/√3 of it. If C_L* exceeds C_L,max, the best L/D is reached only at the stall.',
      stories: { CLs: 'At what lift coefficient does an aircraft with aspect ratio {AR}, e = {osw} and C_D,0 = {CD0} reach its best L/D?' }
    }
  ],
  examples: [
    {
      title: 'Reading an airliner\'s polar',
      q: 'A narrow-body airliner has $\\mathit{AR} = 9.5$, $e = 0.80$ and $C_{D,0} = 0.019$. Find $K$, the best L/D and the $C_L$ where it occurs, and its L/D at a cruise $C_L$ of 0.5.',
      steps: [
        '$K = 1/(\\pi \\times 9.5 \\times 0.80) = 0.0419$.',
        '$C_L^* = \\sqrt{0.019/0.0419} = 0.67$; $(L/D)_{\\max} = 1/(2\\sqrt{0.0419 \\times 0.019}) = 17.7$.',
        'At $C_L = 0.5$: $C_D = 0.019 + 0.0419 \\times 0.25 = 0.0295$, so $L/D = 0.5/0.0295 = 17.0$ — 96 % of the best.'
      ],
      a: '(L/D)max ≈ 17.7 at C_L ≈ 0.67; at C_L = 0.5 the L/D is still about 17. The polar is flat near its best point.'
    },
    {
      title: 'Which lever is stronger?',
      q: 'A light aircraft has $\\mathit{AR} = 7.4$, $e = 0.75$ and $C_{D,0} = 0.030$. Compare its $(L/D)_{\\max}$ with a new wing of aspect ratio 10, and with a clean-up that halves $C_{D,0}$.',
      steps: [
        'As built: $\\tfrac12\\sqrt{\\pi \\times 7.4 \\times 0.75/0.030} = \\tfrac12\\sqrt{581} = 12.1$.',
        'Aspect ratio 10: $\\tfrac12\\sqrt{\\pi \\times 10 \\times 0.75/0.030} = 14.0$ (+16 %).',
        '$C_{D,0} = 0.015$: $\\tfrac12\\sqrt{1162} = 17.0$ (+41 %).'
      ],
      a: '12.1 as built; 14.0 with the longer wing; 17.0 with half the parasite drag. Halving C_D,0 is worth doubling AR.'
    }
  ],
  quiz: [
    { q: 'On a drag polar (C_L against C_D), the point of maximum L/D is where…', choices: ['a line from the origin just touches the polar', 'the polar crosses the C_L axis', 'C_L is largest', 'C_D is smallest'], a: 0,
      why: 'L/D is the slope of the ray from the origin; the steepest ray that still reaches the curve is the tangent.' },
    { q: 'At the best L/D of a parabolic polar, induced drag is…', choices: ['equal to parasite drag', 'zero', 'three times parasite drag', 'half of parasite drag'], a: 0,
      why: 'Maximising C_L/(C_D,0 + KC_L²) gives KC_L² = C_D,0. Three times is the minimum-power point.' },
    { q: 'Doubling the aspect ratio (same e and C_D,0) multiplies (L/D)max by…', choices: ['2', '√2', '4', '1 — L/D depends only on C_D,0'], a: 1,
      why: '(L/D)max = ½√(πARe/C_D,0) ∝ √AR.' },
    { q: 'What is (L/D)max for C_D,0 = 0.025, AR = 8 and e = 0.8?', answer: 14.2, tol: 0.02,
      why: '½√(π × 8 × 0.8/0.025) = ½√804 = 14.2.' },
    { q: 'The parabolic polar is exact for any aircraft at any lift coefficient.', a: false,
      why: 'It is a good fit below the stall and below drag divergence. Camber shifts its minimum, separation near the stall and shocks at high Mach add more drag, and every configuration has its own polar.' }
  ],
  problems: [
    { q: 'A sailplane has C_D,0 = 0.011, aspect ratio 18 and e = 0.9. What is its best glide ratio?', answer: 34.0, tol: 0.02,
      steps: ['$(L/D)_{\\max} = \\tfrac12\\sqrt{\\pi \\times 18 \\times 0.9/0.011}$.', '$= \\tfrac12\\sqrt{4627} = 34.0$.'] }
  ],
  applications: ['Aircraft performance: power required, climb, glide, range and endurance all follow from the polar.', 'Design trade-offs between span (induced drag), weight and parasite drag.', 'Flight-test drag measurement: glides or level runs at many speeds, fitted with a parabola.', 'Glider speed-to-fly calculations, which use the polar drawn as sink rate against airspeed.'],
  history: 'Otto Lilienthal published "polar diagrams" of the air force on his curved wing models in 1889, in his book on bird flight as the basis of aviation. Gustave Eiffel and Ludwig Prandtl\'s Göttingen laboratory made the plot of C_L against C_D standard, and Prandtl\'s lifting-line theory of 1918 explained its parabolic shape through induced drag.',
  sim: 'drag-polar'
},

{
  id: 'lift-to-drag', parent: 'drag-types', title: 'Lift-to-drag ratio', level: 1,
  short: 'How much lift a wing or an aircraft makes for each newton of drag. In a glide it is the distance travelled forward per metre of height lost; in powered flight it sets the thrust needed — weight divided by L/D — and, through the Breguet equation, the range.',
  keywords: ['lift-to-drag ratio', 'L/D', 'glide ratio', 'finesse', 'aerodynamic efficiency', 'best glide', 'max L/D', 'glide angle', 'thrust required', 'best-glide speed', 'water ballast'],
  prereq: ['lift-equation', 'drag-equation', 'drag-polar'],
  related: ['gliding', 'breguet-range', 'minimum-drag-speed', 'power-required', 'aspect-ratio', 'induced-drag', 'bird-flight', 'winglets', 'level-flight'],
  body: `
The **lift-to-drag ratio** $L/D$ says how many newtons of lift a wing, or a whole aircraft, gets for each newton of drag it pays. It is the most telling single number of aerodynamic efficiency, and it turns up all over flight.

### In level flight: thrust and range
In steady, level flight lift balances weight and thrust balances drag. So the thrust the engines must deliver is

$$T = D = \\frac{W}{L/D}$$

A 70-tonne airliner cruising at $L/D = 18$ needs 38 kN of thrust — about a sixth of what its two engines give at takeoff. Through the [[breguet-range|Breguet range equation]], range is directly proportional to $L/D$: 10 % better L/D gives 10 % more range on the same fuel.

### In a glide: distance per height
In a steady glide with no thrust, a small forward component of the weight balances the drag, and the flight path descends at an angle $\\gamma$ with

$$\\tan\\gamma = \\frac{D}{L} \\qquad\\Rightarrow\\qquad \\text{distance} = h \\times \\frac{L}{D}$$

so the glide ratio in still air *is* the lift-to-drag ratio. A sailplane at $L/D = 45$ glides 45 km from 1 km of height; a light aircraft with its engine stopped, about 10 km. Weight does not appear: a heavier glider glides at the same angle, only faster. That is why competition sailplanes carry water ballast on strong days — to fly faster between thermals at the same glide ratio — and dump it when the lift is weak ([[gliding]]).

| Aircraft or animal (typical, rounded) | $(L/D)_{\\max}$ |
|---|---|
| Wingsuit | 2.5–3 |
| Space Shuttle orbiter, subsonic | ≈ 4.5 |
| Concorde at Mach 2 | ≈ 7.5 |
| Paraglider | 8–11 |
| Light aircraft | 9–12 |
| Hang glider | 12–16 |
| Narrow-body airliner, cruise | 16–18 |
| Long-haul airliner, cruise | 18–21 |
| Albatross | ≈ 20 |
| 15 m racing sailplane | 40–48 |
| Open-class sailplane, 25–30 m span | 55–70 |

### What sets it
From the [[drag-polar|parabolic polar]], $(L/D)_{\\max} = \\tfrac12\\sqrt{\\pi\\,\\mathit{AR}\\,e/C_{D,0}}$: long, slender wings (large [[aspect-ratio]]) and clean, smooth surfaces (small $C_{D,0}$). A wing section alone reaches $c_l/c_d$ of 100–200; a whole aircraft reaches far less, because the wing's [[induced-drag]] and the drag of fuselage, tail and engines are added.

$L/D$ is not fixed: it depends on the angle of attack, and so on the speed. It is greatest at one speed, where induced and parasite drag are equal:

$$V_{md} = \\sqrt{\\frac{2W}{\\rho S}}\\;\\left(\\frac{K}{C_{D,0}}\\right)^{1/4}, \\qquad K = \\frac{1}{\\pi\\,\\mathit{AR}\\,e}$$

Slower than that, induced drag grows faster than the lift gained; faster, parasite drag does. Flying slower than the best-glide speed does not stretch a glide — it shortens it. In a headwind the best speed over the ground is a little faster, in a tailwind a little slower.

> [!warn] The glide figures here are illustrative physics. A real aircraft's best-glide speed and glide distance come from its approved flight manual; wind, a windmilling propeller and the configuration change them, and real operations follow training and the rules of the air.
`,
  ideas: [
    'L/D is lift per unit drag; in level flight the thrust needed is W/(L/D).',
    'In a still-air glide the glide ratio equals L/D: distance = height × L/D.',
    'Weight changes the speed of best glide, not the glide angle.',
    '(L/D)max = ½√(πARe/C_D,0): slender wings and clean surfaces make efficient aircraft.',
    'L/D depends on speed; it is greatest where induced and parasite drag are equal.'
  ],
  pitfalls: [
    'A heavier aircraft glides less far — In still air the glide angle depends only on L/D. Weight raises the best-glide speed (as √W) but not the distance.',
    'The slowest speed gives the flattest glide — Below the best-L/D speed induced drag rises faster than lift is gained, and the glide steepens.',
    'L/D is a fixed number for an aircraft — It varies with angle of attack (speed), configuration (flaps, gear), Mach number and Reynolds number; (L/D)max is its highest value.'
  ],
  formulas: [
    {
      name: 'Glide distance in still air',
      expr: 's = h*LD', tex: 's = h \\cdot \\mathit{L/D}',
      vars: {
        s: { name: 'distance over the ground', q: 'length', unit: 'km' },
        h: { name: 'height lost', q: 'length', unit: 'm', value: 1000 },
        LD: { name: 'lift-to-drag (glide) ratio', value: 40, min: 1, max: 80, tex: '\\mathit{L/D}' }
      },
      note: 'Steady glide in still air at constant L/D. A headwind shortens the distance over the ground, a tailwind lengthens it.',
      stories: {
        s: 'A glider with L/D = {LD} is {h} above the ground in still air. How far can it glide?',
        LD: 'A glider loses {h} while covering {s} in still air. What is its lift-to-drag ratio?',
        h: 'A glider with L/D = {LD} must cover {s} in still air. How much height does it need?'
      }
    },
    {
      name: 'Thrust in steady level flight',
      expr: 'T = m*g/LD', tex: 'T = \\dfrac{mg}{\\mathit{L/D}}',
      vars: {
        T: { name: 'thrust (= drag)', q: 'force', unit: 'kN' },
        m: { name: 'aircraft mass', q: 'mass', unit: 'kg', value: 70000 },
        g: { const: 'g' },
        LD: { name: 'lift-to-drag ratio', value: 18, min: 1, max: 80, tex: '\\mathit{L/D}' }
      },
      note: 'Steady, level, unaccelerated flight: L = W and T = D. Multiply by the speed for the power.',
      stories: {
        T: 'An airliner of {m} cruises at L/D = {LD}. How much thrust must its engines give?',
        LD: 'An aircraft of {m} needs {T} of thrust in level cruise. What is its lift-to-drag ratio?'
      }
    },
    {
      name: 'Glide angle',
      expr: 'gam = atan(1/LD)', tex: '\\gamma = \\arctan\\dfrac{1}{\\mathit{L/D}}',
      vars: {
        gam: { name: 'glide-path angle below the horizontal', q: 'angle', unit: '°', min: 0, max: 60, tex: '\\gamma' },
        LD: { name: 'lift-to-drag ratio', value: 12, min: 1, max: 80, tex: '\\mathit{L/D}' }
      },
      note: 'Steady glide in still air: tan γ = D/L.',
      stories: { gam: 'At what angle does an aircraft with L/D = {LD} glide?', LD: 'An aircraft glides down a {gam} path in still air. What is its L/D?' }
    },
    {
      name: 'Speed of best L/D',
      expr: 'Vmd = sqrt(2*m*g/(rho*S))*(1/(pi*AR*osw*CD0))^0.25', tex: 'V_{md} = \\sqrt{\\dfrac{2mg}{\\rho S}}\\left(\\dfrac{1}{\\pi\\,\\mathit{AR}\\,e\\,C_{D,0}}\\right)^{1/4}',
      vars: {
        Vmd: { name: 'true airspeed of best L/D', q: 'speed', unit: 'kt', tex: 'V_{md}' },
        m: { name: 'aircraft mass', q: 'mass', unit: 'kg', value: 1100 },
        g: { const: 'g' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        S: { name: 'wing area', q: 'area', unit: 'm²', value: 16.2 },
        AR: { name: 'aspect ratio', value: 7.4, min: 1, max: 50, tex: '\\mathit{AR}' },
        osw: { name: 'Oswald efficiency factor', value: 0.75, min: 0.3, max: 1, tex: 'e' },
        CD0: { name: 'zero-lift drag coefficient', value: 0.030, min: 0.003, max: 0.2, tex: 'C_{D,0}' }
      },
      note: 'Parabolic polar, where induced drag equals parasite drag (also the minimum-drag speed in level flight). Grows as √(weight/density). Real best-glide speeds come from the flight manual.',
      practice: { unknowns: ['Vmd', 'm'] },
      stories: {
        Vmd: 'An aircraft of {m} with a {S} wing (aspect ratio {AR}, e = {osw}, C_D,0 = {CD0}) flies in air of density {rho}. At what true airspeed is its L/D best?',
        m: 'The best-L/D speed of an aircraft (wing {S}, AR {AR}, e = {osw}, C_D,0 = {CD0}) is {Vmd} in air of density {rho}. What does it weigh?'
      }
    }
  ],
  examples: [
    {
      title: 'How far can a sailplane glide?',
      q: 'A sailplane with $L/D = 45$ at its best-glide airspeed of 30 m/s is 1500 m above the ground. How far can it glide in still air, and into a 10 m/s headwind?',
      steps: [
        'Still air: $1.5 \\times 45 = 67.5$ km.',
        'Its sink rate is $30/45 = 0.67$ m/s, so it stays up $1500/0.67 = 2250$ s.',
        'Into the headwind its ground speed is $30 - 10 = 20$ m/s: $20 \\times 2250 = 45$ km. (Flying a little faster than best glide would stretch that slightly.)'
      ],
      a: '67.5 km in still air; about 45 km into a 10 m/s headwind.'
    },
    {
      title: 'Thrust for an airliner',
      q: 'A 70-tonne airliner cruises at $L/D = 18$. What thrust does it need? How much more would an older design with $L/D = 16$ need?',
      steps: [
        '$W = 70\\,000 \\times 9.81 = 687$ kN.',
        '$T = 687/18 = 38.2$ kN.',
        'At $L/D = 16$: $687/16 = 42.9$ kN, 12.5 % more — and, by Breguet, 11 % less range on the same fuel.'
      ],
      a: 'About 38 kN at L/D 18; 43 kN at L/D 16.'
    },
    {
      title: 'Best glide, light and heavy',
      q: 'A light aircraft has a 16.2 m² wing, $\\mathit{AR} = 7.4$, $e = 0.75$, $C_{D,0} = 0.030$. Find its best-L/D speed at sea level at 1100 kg and at 800 kg.',
      steps: [
        '$K = 1/(\\pi \\times 7.4 \\times 0.75) = 0.0574$; $(K/C_{D,0})^{1/4} = 1.914^{1/4} = 1.176$.',
        'At 1100 kg: $\\sqrt{2 \\times 10\\,791/(1.225 \\times 16.2)} = 33.0$ m/s, so $V_{md} = 38.8$ m/s = 75 kt.',
        'At 800 kg: $38.8\\sqrt{800/1100} = 33.1$ m/s = 64 kt. The L/D, about 12, is the same.'
      ],
      a: 'About 75 kt at 1100 kg and 64 kt at 800 kg — the same glide angle at a lower speed.'
    }
  ],
  quiz: [
    { q: 'A glider with L/D = 40 is 800 m above the ground in still air. How far can it glide?', answer: 32, unit: 'km', tol: 0.02,
      why: 'Distance = height × L/D = 0.8 km × 40 = 32 km.' },
    { q: 'Two identical gliders, one 30 % heavier with water ballast, each fly at their own best-glide speed in still air. Then…', choices: ['both glide the same distance; the heavy one flies faster', 'the heavy one glides less far', 'the heavy one glides further', 'both fly at the same speed'], a: 0,
      why: 'The glide ratio is L/D, independent of weight; the best-glide speed rises as √W (about 14 % here), so the heavier glider covers the same distance sooner.' },
    { q: 'An airliner\'s wing sections may reach c_l/c_d ≈ 100, yet the whole aircraft only about 18. Why?', choices: ['induced drag and the drag of the fuselage, tail and nacelles add to the section drag', 'the sections are tested in water', 'thrust reduces L/D', 'the airspeed indicator is wrong'], a: 0,
      why: 'A section has no tips (no induced drag) and no fuselage; the finite wing\'s induced drag and all the parasite drag of the other parts lower the ratio.' },
    { q: 'Flying slower than the best-L/D speed always stretches a glide.', a: false,
      why: 'Below V_md the induced drag grows faster than the lift is gained, so L/D falls and the glide steepens.' },
    { q: 'In steady level flight, the engines\' thrust equals…', choices: ['the weight divided by L/D', 'the weight multiplied by L/D', 'the lift', 'the weight'], a: 0,
      why: 'T = D and L = W, so T = W·D/L = W/(L/D).' }
  ],
  problems: [
    { q: 'An airliner of 60 t has L/D = 17 in cruise. What total thrust do its engines deliver?', answer: 34.6, unit: 'kN', tol: 0.02,
      steps: ['$W = 60\\,000 \\times 9.81 = 588.6$ kN.', '$T = 588.6/17 = 34.6$ kN.'] },
    { q: 'A paraglider glides at 5.2° below the horizontal in still air. What is its lift-to-drag ratio?', answer: 11.0, tol: 0.02,
      steps: ['$L/D = 1/\\tan\\gamma = 1/\\tan 5.2°$.', '$= 1/0.0910 = 11.0$.'] }
  ],
  applications: ['Sailplane design and competition flying: ballast, speed to fly, final glides.', 'Airliner efficiency: fuel per seat and range scale with L/D.', 'Planning for an engine failure: the best-glide speed in the flight manual.', 'Unpowered re-entry vehicles, whose L/D decides how far they can steer to a runway.'],
  history: 'On 23 July 1983 an Air Canada Boeing 767 ran out of fuel at about 12 km over Manitoba after a unit mix-up in the fuel calculation. With both engines stopped, its crew glided it to a safe landing on a disused runway at Gimli — the "Gimli Glider", a lesson in lift-to-drag ratio that every pilot knows.',
  sim: { id: 'drag-polar', params: { craft: 'glider' } }
},

/* ================================================================ DRAG IN EVERYDAY LIFE */
{
  id: 'streamlining', parent: 'drag-everyday', title: 'Streamlining', level: 1,
  short: 'Shaping a body so that the air closes smoothly behind it: a rounded nose, a long gently tapering tail and no sharp steps. A good streamlined shape has a tenth or less of the drag of a blunt body of the same frontal area.',
  keywords: ['streamlining', 'streamlined body', 'teardrop', 'fineness ratio', 'fairing', 'boat tail', 'Kamm tail', 'strut', 'bracing wire', 'form factor', 'aerodynamic shape', 'airship hull'],
  prereq: ['form-drag', 'flow-separation', 'drag-equation'],
  related: ['bluff-bodies', 'skin-friction', 'parasite-drag', 'vehicle-aerodynamics', 'special-airfoils', 'bird-flight', 'cycling-aero', 'wave-drag'],
  body: `
A **streamlined** body is shaped so that the air, having parted to let it through, closes smoothly behind it. The [[boundary-layer|boundary layer]] then stays attached almost to the tail, the wake is thin, and nearly all the drag that remains is skin friction. A good streamlined shape has a tenth or less of the drag of a blunt body of the same frontal area — the difference between a disc ($C_D \\approx 1.17$), a sphere (0.47) and a teardrop (0.04–0.05).

### The recipe
- **A rounded nose.** At subsonic speed the front is the easy part: a blunt, well-rounded nose lets the flow divide gently. A sharp point gains nothing and can even make the flow separate at the shoulder.
- **The greatest thickness about a third of the way back**, or further back on laminar-flow bodies, which keep the pressure falling — and the boundary layer laminar — for longer.
- **A long, gently tapering tail.** Behind the widest point the pressure must rise again, and the boundary layer can climb only a gentle slope: surfaces that turn away from the stream by more than about 12–15° let it separate. This is where streamlining is won or lost ([[form-drag]]).
- **No steps, gaps or sharp junctions**, and fairings or fillets where parts meet ([[parasite-drag|interference drag]]).

### How long?
Streamlining trades pressure drag against friction. A short, fat body separates; a long, thin one has little pressure drag but a lot of wetted surface to rub. For a body of revolution the least drag *for its frontal area* comes at a **fineness ratio** (length ÷ diameter) of about 2.5–3; the least drag *for the volume it encloses* — what matters for an airship or a fuel tank — at about 4–5. Tuna, dolphins and penguins sit close to that range.

| Shape (equal frontal area) | $C_D$ | Drag relative to the disc |
|---|---|---|
| Flat disc, face-on | 1.17 | 100 % |
| Sphere, below the drag crisis | 0.47 | 40 % |
| Hemisphere, dome forward | ≈ 0.4 | 34 % |
| Streamlined body, fineness 2.5–3 | 0.04–0.05 | about 4 % |
| Round wire or tube across the flow (2-D) | ≈ 1.2 | — |
| Streamlined strut of the same thickness (2-D) | 0.06–0.1 | about a fifteenth of the tube |

The last two rows are the classic lesson of early aviation: a round bracing wire drags about as much as a well-faired strut ten or more times thicker. Biplanes were rigged with "streamline wires" of lens-shaped section for exactly that reason.

### Where streamlining meets its limits
- **Cars and trucks** cannot have long tails; they must be short and end square. The **Kamm tail** — cut off where the cross-section has shrunk to about half — keeps most of the benefit, and modern electric saloons reach $C_D \\approx 0.20$ with it ([[vehicle-aerodynamics]]).
- **Tiny, slow bodies** — insects, seeds, dust — live at low [[reynolds-number|Reynolds numbers]], where friction dominates and a streamlined shape gains little.
- **Supersonic bodies** need slender, pointed shapes for a different reason: [[wave-drag]].

> [!tip] A fully faired recumbent bicycle — a streamlined shell round a lying rider — has a drag area of a few hundredths of a square metre, about a tenth of a racing cyclist's. Such machines have passed 140 km/h on level ground on human power alone.
`,
  ideas: [
    'Streamlining keeps the boundary layer attached to the tail, so the wake and the pressure drag stay small.',
    'The tail matters most: it must taper gently (surfaces turning less than about 12–15° from the stream).',
    'A rounded nose is fine at subsonic speed; a point is needed only for supersonic flight.',
    'The best fineness ratio balances pressure drag against friction: about 2.5–3 per frontal area, 4–5 per volume.'
  ],
  pitfalls: [
    'Streamlined means pointed at the front — At subsonic speed a round nose is ideal; what matters is a long, gently tapering tail.',
    'Longer and thinner is always better — Beyond a fineness ratio of about 3–5 the extra skin friction outweighs the smaller pressure drag.',
    'Streamlining helps whatever the size and speed — It removes pressure drag. At very low Reynolds numbers (insects, dust) friction dominates and shape matters little; at supersonic speed wave drag brings new rules.'
  ],
  formulas: [
    {
      name: 'Form factor of a streamlined body of revolution (Hoerner)',
      expr: 'FF = 1 + 1.5/fr^1.5 + 7/fr^3', tex: '\\mathit{FF} = 1 + \\dfrac{1.5}{\\lambda^{1.5}} + \\dfrac{7}{\\lambda^{3}}',
      vars: {
        FF: { name: 'form factor (drag ÷ flat-plate friction of the same wetted area)', tex: '\\mathit{FF}' },
        fr: { name: 'fineness ratio, length ÷ diameter', value: 4, min: 1.5, max: 20, tex: '\\lambda' }
      },
      note: 'An empirical fit for smooth bodies of revolution with attached flow at subsonic speed. The body\'s drag is C_f × FF × S_wet; the excess over 1 is the pressure drag and the faster flow over the thicker body.',
      stories: { FF: 'By how much does a body of fineness ratio {fr} drag more than a flat plate of the same wetted area?', fr: 'What fineness ratio gives a form factor of {FF}?' }
    },
    {
      name: 'Drag of a strut or tube across the flow',
      expr: 'D = 0.5*rho*V^2*CD*t*L', tex: 'D = \\tfrac{1}{2}\\,\\rho V^2\\, C_D\\, t\\, L',
      vars: {
        D: { name: 'drag', q: 'force', unit: 'N' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'airspeed', q: 'speed', unit: 'm/s', value: 50 },
        CD: { name: 'drag coefficient on the thickness (≈ 1.2 round, 0.06–0.1 faired)', value: 1.2, min: 0.01, max: 2.5, tex: 'C_D' },
        t: { name: 'thickness (frontal width)', q: 'length', unit: 'mm', value: 30 },
        L: { name: 'length across the flow', q: 'length', unit: 'm', value: 1.2 }
      },
      note: 'Two-dimensional drag coefficients, per frontal area t × L. A round tube is about 1.2 below its drag crisis; a well-faired strut of the same thickness 0.06–0.1.',
      stories: {
        D: 'A strut {t} thick and {L} long, with C_D = {CD}, stands across a {V} airflow of density {rho}. What is its drag?',
        t: 'A round wire (C_D = {CD}) {L} long may add at most {D} of drag at {V} (air density {rho}). How thick can it be?'
      }
    }
  ],
  examples: [
    {
      title: 'Fairing a tube',
      q: 'A round tube 30 mm in diameter and 1.2 m long crosses a 50 m/s airflow at sea level. What is its drag, and what if it is enclosed in a fairing of the same thickness with $C_D = 0.08$? How thick a round wire would drag as much as the faired strut?',
      steps: [
        '$q = \\tfrac12 \\times 1.225 \\times 50^2 = 1531$ Pa; frontal area $0.03 \\times 1.2 = 0.036$ m².',
        'Round tube: $D = 1531 \\times 1.2 \\times 0.036 = 66$ N.',
        'Faired: $D = 1531 \\times 0.08 \\times 0.036 = 4.4$ N — fifteen times less.',
        'A round wire with the same drag: thickness $30 \\times 0.08/1.2 = 2$ mm.'
      ],
      a: '66 N bare, 4.4 N faired — the faired 30 mm strut drags like a 2 mm wire.'
    },
    {
      title: 'Choosing a fineness ratio',
      q: 'A pod of a given frontal area $A$ has turbulent skin friction $C_f = 0.003$ and a wetted area of about $3\\lambda A$. Estimate its drag coefficient on frontal area for fineness ratios 1.5, 3 and 6 using Hoerner\'s form factor.',
      steps: [
        '$C_D = C_f \\cdot \\mathit{FF} \\cdot S_\\text{wet}/A = 0.003 \\times \\mathit{FF} \\times 3\\lambda$.',
        '$\\lambda = 1.5$: $\\mathit{FF} = 1 + 1.5/1.84 + 7/3.38 = 3.89$, $C_D = 0.003 \\times 3.89 \\times 4.5 = 0.053$.',
        '$\\lambda = 3$: $\\mathit{FF} = 1.55$, $C_D = 0.003 \\times 1.55 \\times 9 = 0.042$.',
        '$\\lambda = 6$: $\\mathit{FF} = 1.13$, $C_D = 0.003 \\times 1.13 \\times 18 = 0.061$.'
      ],
      a: 'About 0.053, 0.042 and 0.061: the least drag for the frontal area is near a fineness ratio of 3.'
    }
  ],
  quiz: [
    { q: 'Which half of a streamlined body matters most for its pressure drag?', choices: ['the rear half, where the pressure must recover without the flow separating', 'the front half', 'both equally', 'neither — only the surface finish matters'], a: 0,
      why: 'Separation happens in the rising pressure behind the widest point. A well-rounded front is easy; a gentle tail is what keeps the flow attached.' },
    { q: 'Making a streamlined body very long and thin (fineness 10) instead of fineness 3…', choices: ['cuts its pressure drag but adds so much skin friction that its total drag rises', 'always reduces its drag', 'increases its pressure drag', 'makes no difference'], a: 0,
      why: 'Past the optimum, the wetted area — and friction — grows faster than the pressure drag falls.' },
    { q: 'A teardrop flown tail-first has about the same drag as flown nose-first.', a: false,
      why: 'Tail-first the flow meets a blunt rear end at once and separates, leaving a wide wake: the drag is several times larger.' },
    { q: 'What form factor does Hoerner\'s formula give for a body of fineness ratio 3?', answer: 1.55, tol: 0.02,
      why: '1 + 1.5/3^1.5 + 7/3³ = 1 + 0.289 + 0.259 = 1.55.' },
    { q: 'A faired strut with C_D = 0.08 on its thickness replaces a round tube (C_D = 1.2) of the same thickness. The drag falls by a factor of about…', choices: ['15', '1.5', '4', '100'], a: 0,
      why: '1.2/0.08 = 15. That is the whole case for fairings on struts, wires, masts and landing gear legs.' }
  ],
  problems: [
    { q: 'What form factor does Hoerner\'s formula give for a body of fineness ratio 5?', answer: 1.19, tol: 0.02,
      steps: ['$\\mathit{FF} = 1 + 1.5/5^{1.5} + 7/5^3$.', '$= 1 + 1.5/11.18 + 7/125 = 1 + 0.134 + 0.056 = 1.19$.'] }
  ],
  applications: ['Fairings over struts, wires, landing gear and sensor pods.', 'Car, truck and train shapes, including Kamm tails and boat tails.', 'Cycling helmets, disc wheels and fully faired human-powered vehicles.', 'Airship hulls, underwater vehicles and the bodies of fish and diving birds.'],
  history: 'Streamlining became a design fashion in the 1920s and 1930s. Paul Jaray, who had worked on Zeppelin airship hulls, patented streamlined car bodies in the early 1920s, and Wunibald Kamm showed in the 1930s that a streamlined tail could be cut off square with little loss. Aircraft went the same way, from wire-braced biplanes to smooth monoplanes with faired undercarriages.'
},

{
  id: 'bluff-bodies', parent: 'drag-everyday', title: 'Bluff bodies', level: 2,
  short: 'Bodies the air cannot follow round — plates, cylinders, cubes, trucks, people, buildings. The flow separates, leaves a broad wake and sheds vortices; the drag is almost all pressure drag, C_D is of order one, and for sharp-edged shapes it hardly changes with speed.',
  keywords: ['bluff body', 'flat plate', 'cylinder', 'sphere', 'cube', 'parachute', 'wake', 'separation', 'vortex shedding', 'Strouhal number', 'Karman vortex street', 'drag crisis', 'wind load', 'road sign', 'anemometer', 'singing wires'],
  prereq: ['form-drag', 'flow-separation', 'drag-equation'],
  related: ['drag-crisis', 'vortex-shedding', 'wind-loads', 'terminal-velocity', 'streamlining', 'sports-aerodynamics', 'galloping-bridges', 'strouhal-froude'],
  body: `
A **bluff body** is one the air cannot follow round: a flat plate across the wind, a brick, a cylinder, a truck, a person, a building. The flow separates at its edges or shoulders and leaves a wide, turbulent wake at low pressure. Almost all the drag is then [[form-drag|pressure drag]], and the drag coefficient is of order one.

### Sharp edges fix the separation
Where a body has sharp edges facing the flow, the flow separates exactly there, at every speed. The flow pattern — and so $C_D$ — then barely changes with the [[reynolds-number|Reynolds number]] once it is above a few thousand. A flat plate has $C_D \\approx 1.17$ whether it is a road sign in a breeze or a car door opened at motorway speed. A long plate across the flow drags more, $C_D \\approx 2.0$, because the air cannot escape round its ends: its wake is wider and at lower pressure.

Rounded bluff bodies — cylinders, spheres — behave differently. Their separation point can move: when the boundary layer turns turbulent it clings on further round the back, the wake narrows and $C_D$ drops sharply, from 1.2 to about 0.3 for a cylinder and from 0.47 to about 0.1 for a smooth sphere. This is the [[drag-crisis]]; roughness and turbulence in the oncoming air bring it on at lower speeds.

| Body | $C_D$ (on frontal area, rounded) |
|---|---|
| Square flat plate or disc, face-on | 1.17 |
| Long flat plate across the flow (2-D) | 2.0 |
| Long square bar, face-on (2-D) | 2.0–2.1 |
| Cube, face-on | 1.05 |
| Cube, edge-on | 0.8 |
| Long cylinder across the flow, below the drag crisis | 1.2 |
| Smooth sphere, below the drag crisis | 0.47 |
| Hemispherical cup, hollow side into the wind | 1.4 |
| Hemispherical cup, dome into the wind | 0.4 |
| Round parachute canopy (on its cloth area) | 0.75–0.9 |
| Person standing | 1.0–1.3 |

### Vortex shedding
The wake of a bluff body is not steady. Vortices peel off alternately from its two sides and form a staggered row downstream — a [[vortex-shedding|Kármán vortex street]] — at a frequency

$$f = \\mathrm{St}\\,\\frac{V}{d}$$

where the Strouhal number $\\mathrm{St}$ is about 0.2 for a circular cylinder over a wide range of Reynolds numbers. Each departing vortex tugs the body sideways, so the force oscillates across the wind as well as along it. Telephone wires sing — an 8 m/s wind on a 4 mm wire sheds 400 vortices a second on each side — and chimneys, masts and lamp posts can shake when the shedding frequency meets their own natural frequency. Tall steel chimneys wear spiral strakes to scramble the shedding. The same unsteadiness lies behind [[galloping-bridges|galloping cables and oscillating bridges]].

### Wind loads
The drag equation with $C_D \\approx 1$ gives the wind load on everyday things. At 100 km/h the dynamic pressure is 473 Pa: a 2 m² road sign feels more than 1 kN, a standing person about 400 N — enough to make walking hard. Design loads for real buildings and signs come from national codes, which add gusts, the growth of wind with height and safety factors to this physics ([[wind-loads]]).

> [!key] For a bluff body, what happens behind it matters more than what happens in front: the size and pressure of the wake set the drag. Rounding the edges, tapering the rear or tripping the boundary layer all work by shrinking the wake.
`,
  ideas: [
    'Bluff bodies separate early and leave wide, low-pressure wakes: their drag is almost all pressure drag, with C_D ≈ 1.',
    'Sharp edges fix the separation point, so C_D hardly changes with speed; rounded bodies show a drag crisis.',
    'The wake sheds vortices alternately at f = St·V/d with St ≈ 0.2, making the force oscillate sideways.',
    'The drag equation with C_D ≈ 1 gives a first estimate of wind loads.'
  ],
  pitfalls: [
    'A big drag means the air is hitting a big front — The low pressure in the wake does most of the work; what happens behind the body sets C_D.',
    'Bluff bodies feel only a steady force along the wind — Vortex shedding makes the force fluctuate, mostly sideways, at f = St·V/d; resonance with a structure can be destructive.',
    'A cylinder always has C_D ≈ 1.2 — Only below the drag crisis. Above a Reynolds number of about 3×10⁵ it can drop to 0.3 before climbing back to 0.5–0.7.'
  ],
  formulas: [
    {
      name: 'Wind force on a bluff body',
      expr: 'F = 0.5*rho*V^2*CD*A', tex: 'F = \\tfrac{1}{2}\\,\\rho V^2\\, C_D\\, A',
      vars: {
        F: { name: 'wind force (drag)', q: 'force', unit: 'N' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'wind speed', q: 'speed', unit: 'km/h', value: 100 },
        CD: { name: 'drag coefficient (≈ 1.2 for a flat sign)', value: 1.2, min: 0.1, max: 2.5, tex: 'C_D' },
        A: { name: 'area facing the wind', q: 'area', unit: 'm²', value: 2 }
      },
      note: 'The steady drag in a uniform wind. Design codes add gust factors, height profiles and safety factors; this is the physics, not a design load.',
      practice: { unknowns: ['F', 'V'] },
      stories: {
        F: 'A sign of {A} with C_D = {CD} faces a {V} wind (air density {rho}). What force does the wind put on it?',
        V: 'A sign of {A} (C_D = {CD}) is fixed to take at most {F}. At what wind speed is that reached (air density {rho})?'
      }
    },
    {
      name: 'Vortex-shedding frequency',
      expr: 'f = St*V/d', tex: 'f = \\mathrm{St}\\,\\dfrac{V}{d}',
      vars: {
        f: { name: 'shedding frequency (vortices from one side)', q: 'frequency', unit: 'Hz' },
        St: { name: 'Strouhal number (≈ 0.2 for a cylinder)', value: 0.2, min: 0.05, max: 0.5, tex: '\\mathrm{St}' },
        V: { name: 'wind speed', q: 'speed', unit: 'm/s', value: 10 },
        d: { name: 'diameter or width across the wind', q: 'length', unit: 'cm', value: 5 }
      },
      note: 'St ≈ 0.2 for a circular cylinder at Reynolds numbers from a few hundred to about 2×10⁵; about 0.12–0.15 for a square section. The side force oscillates at f, the drag at 2f.',
      stories: {
        f: 'A flagpole {d} thick stands in a {V} wind. At what frequency does it shed vortices (St = {St})?',
        V: 'A mast {d} thick has a natural frequency of {f}. At what wind speed does vortex shedding (St = {St}) match it?'
      }
    }
  ],
  examples: [
    {
      title: 'A road sign in a gale',
      q: 'A road sign 2.5 m × 1.2 m ($C_D = 1.2$) faces a 108 km/h wind at sea level. What force acts on it? And in a 150 km/h storm?',
      steps: [
        'Area 3.0 m²; 108 km/h = 30 m/s, so $q = \\tfrac12 \\times 1.225 \\times 30^2 = 551$ Pa.',
        '$F = 551 \\times 1.2 \\times 3.0 = 1980$ N — about the weight of 200 kg.',
        'At 150 km/h = 41.7 m/s: $q = 1063$ Pa, $F = 3830$ N — nearly double, for 39 % more wind.'
      ],
      a: 'About 2.0 kN at 108 km/h and 3.8 kN at 150 km/h.'
    },
    {
      title: 'Why wires sing',
      q: 'A 4 mm telephone wire stands in an 8 m/s wind. At what frequency does it shed vortices? Would a 30 cm lamp post in a 12 m/s wind be at risk of resonance if its natural frequency were 8 Hz?',
      steps: [
        'Wire: $f = 0.2 \\times 8/0.004 = 400$ Hz — an audible hum, the "Aeolian tone".',
        'Lamp post: $f = 0.2 \\times 12/0.30 = 8$ Hz — exactly its natural frequency.',
        'At that wind speed the sideways pushes arrive in step with the post\'s own swing and build it up; engineers add dampers or strakes, or stiffen the post to move its frequency.'
      ],
      a: 'The wire hums at about 400 Hz; the lamp post would be driven at resonance, 8 Hz.'
    }
  ],
  quiz: [
    { q: 'Why is the drag coefficient of a sharp-edged flat plate almost independent of speed, while a cylinder\'s falls suddenly at high Reynolds number?', choices: ['the plate\'s flow always separates at its edges; the cylinder\'s separation point moves back when its boundary layer turns turbulent', 'the plate is thinner', 'cylinders make lift', 'flat plates have no boundary layer'], a: 0,
      why: 'A sharp edge fixes the separation line. On a smooth curve the separation point depends on the boundary layer, which changes at the drag crisis.' },
    { q: 'A long flat plate across the flow has C_D ≈ 2.0, a square plate only 1.17. Why?', choices: ['air cannot escape round the ends of the long plate, so its wake is wider and at lower pressure', 'the long plate has more skin friction', 'the square plate is thicker', 'it is a measurement error'], a: 0,
      why: 'Around a square plate the flow can spill past all four edges; a long plate forces it over two edges only, making a bigger, lower-pressure wake.' },
    { q: 'A lamp post 0.3 m in diameter stands in a 12 m/s wind. At what frequency does it shed vortices (St = 0.2)?', answer: 8, unit: 'Hz', tol: 0.02,
      why: 'f = St·V/d = 0.2 × 12/0.3 = 8 Hz.' },
    { q: 'The drag of a bluff body comes mostly from skin friction.', a: false,
      why: 'It comes mostly from pressure: high pressure on the front, low pressure in the separated wake behind. Friction is a few per cent.' },
    { q: 'A cup anemometer turns because…', choices: ['a cup facing the wind hollow-first drags about three times as much as one facing it dome-first', 'the wind pushes all the cups equally', 'the cups make lift', 'of vortex shedding'], a: 0,
      why: 'C_D ≈ 1.4 hollow-first against ≈ 0.4 dome-first: the net torque turns the rotor at a speed proportional to the wind.' }
  ],
  problems: [
    { q: 'A person of 70 kg standing in the wind has a drag area of 0.8 m². At what wind speed does the drag reach half their weight (sea-level air)?', answer: 26.5, unit: 'm/s', tol: 0.02,
      steps: ['Half the weight: $0.5 \\times 70 \\times 9.81 = 343$ N.', '$q = 343/0.8 = 429$ Pa, so $V = \\sqrt{2 \\times 429/1.225} = 26.5$ m/s ≈ 95 km/h.'] }
  ],
  applications: ['Wind loads on buildings, signs, bridges and people.', 'Parachutes and drogues — bluff by design.', 'Cup anemometers, and strakes and dampers that tame vortex shedding on chimneys and cables.', 'Heat exchangers and tube banks, where cylinders in crossflow shed vortices.'],
  history: 'Theodore von Kármán analysed the staggered double row of vortices behind a cylinder in 1911–12, after a colleague at Göttingen, Karl Hiemenz, found that the wake of his cylinder would not settle down however carefully he built the water channel. Kármán showed that only the staggered arrangement is stable — the vortex street that bears his name.',
  sim: 'drag-ball-flight'
},

{
  id: 'terminal-velocity', parent: 'drag-everyday', title: 'Terminal velocity', level: 1,
  short: 'The steady speed a falling body settles at when air drag has grown to equal its weight: v_t = √(2mg/(ρC_DA)). A skydiver falls at about 200 km/h, a raindrop at 2 to 9 m/s, a cloud droplet at about a centimetre a second.',
  keywords: ['terminal velocity', 'terminal speed', 'falling with air resistance', 'skydiver', 'raindrop', 'parachute', 'hailstone', 'Stokes law', 'settling velocity', 'tanh', 'drag equals weight', 'stratospheric jump', 'cloud droplets'],
  prereq: ['drag-equation', 'physics:free-fall', 'physics:newtons-second-law', 'math:first-order-odes'],
  related: ['bluff-bodies', 'reynolds-number', 'air-density', 'isa', 'drag-crisis', 'air-viscosity', 'seeds-gliders', 'physics:drag-force', 'math:euler-method'],
  body: `
Drop a stone and it speeds up at $g$, about 9.8 m/s every second. But as it gathers speed the air pushes back harder, as the square of the speed. Eventually the drag has grown to equal the weight, the net force is zero, and the speed stops increasing: the **terminal velocity**. [[physics:newtons-second-law|Newton's second law]] for a body falling through still air reads

$$m\\frac{dv}{dt} = mg - \\tfrac12\\,\\rho\\, C_DA\\, v^2 \\qquad\\Rightarrow\\qquad v_t = \\sqrt{\\frac{2mg}{\\rho\\, C_DA}}$$

(buoyancy, the weight of the air displaced, is negligible for anything much denser than air).

### How quickly it gets there
If the air density and the drag coefficient stay constant, the [[math:first-order-odes|differential equation]] has a neat solution:

$$v(t) = v_t \\tanh\\left(\\frac{gt}{v_t}\\right), \\qquad y(t) = \\frac{v_t^2}{g}\\,\\ln\\cosh\\left(\\frac{gt}{v_t}\\right)$$

The natural time scale is $v_t/g$. After one time scale the body has 76 % of its terminal speed, after two 96 %, after three 99.5 % — it approaches $v_t$ smoothly and never quite arrives. A skydiver ($v_t \\approx 57$ m/s) needs about 10 seconds and 380 m to reach 95 % of it. A canopy then raises the drag area a hundredfold and brings the speed down to about 5 m/s; it is made to open over two to four seconds, keeping the deceleration to a few $g$.

### Small things fall slowly
For bodies of the same shape and material, mass grows as the cube of size and area as the square, so $v_t$ grows as the square root of size. Small things fall slowly: a mouse survives a fall that would kill a person, and cloud droplets hardly fall at all.

| Falling body (sea level, rounded) | Mass | Terminal speed |
|---|---|---|
| Cloud droplet, 20 µm | 4 × 10⁻¹² kg | 1.2 cm/s |
| Drizzle drop, 0.2 mm | 4 µg | 0.7 m/s |
| Raindrop, 2 mm | 4 mg | 6.5 m/s |
| Large raindrop, 5 mm | 65 mg | 9 m/s |
| Badminton shuttlecock | 5 g | 7 m/s |
| Ping-pong ball | 2.7 g | 8.5 m/s |
| Hailstone, 2 cm | 3.8 g | 20 m/s |
| Skydiver, belly to earth ($C_DA \\approx 0.45$ m²) | 90 kg | 57 m/s (200 km/h) |
| Skydiver, head down ($C_DA \\approx 0.18$ m²) | 90 kg | 90 m/s (320 km/h) |
| Parachutist under an open canopy ($C_DA \\approx 55$ m²) | 90 kg | 5 m/s |

Raindrops larger than about 1 mm are not tear-shaped: the air flattens them into buns, which raises their drag, and drops much bigger than 5 mm break up. So rain never falls faster than about 9 m/s.

### When the air thins out
$v_t$ grows as $1/\\sqrt{\\rho}$. At 4000 m, where skydivers usually jump, the air is a third thinner and the terminal speed 22 % higher — so a skydiver actually *slows down* on the way down as the air thickens ([[isa|standard atmosphere]]). On 14 October 2012 Felix Baumgartner jumped from a balloon at about 39 km, where the air is less than a two-hundredth as dense as at sea level, and reached about 1360 km/h — faster than sound — before the thickening air braked him.

### When drag is proportional to speed
Very small, slow bodies live at low [[reynolds-number|Reynolds numbers]], where viscosity rules. For a sphere below Re ≈ 1 the drag is $3\\pi\\mu d v$ (Stokes' law) and

$$v_t = \\frac{(\\rho_p - \\rho_a)\\, g\\, d^2}{18\\,\\mu}$$

— proportional to the *square* of the diameter. A 20 µm cloud droplet settles at 1.2 cm/s, and the gentlest updraught holds it up: that is why clouds float. The same law governs dust, pollen, volcanic ash and fog.

> [!warn] Skydiving figures here are rounded physics, not jump planning. Parachuting follows the sport's training, equipment and operating rules.
`,
  ideas: [
    'A falling body reaches terminal velocity when drag equals weight: v_t = √(2mg/(ρC_DA)).',
    'With constant air density it approaches v_t as a tanh: 76 % after v_t/g, 96 % after twice that.',
    'v_t grows as √(size) for similar bodies and as 1/√ρ with altitude.',
    'Tiny bodies obey Stokes\' law: drag ∝ v and v_t ∝ d², which is why clouds and dust stay aloft.'
  ],
  pitfalls: [
    'Heavier objects fall faster because gravity pulls harder — In a vacuum all bodies fall alike. In air the heavier of two same-sized bodies falls faster because its weight balances the same drag only at a higher speed.',
    'A falling body stops accelerating suddenly when it reaches terminal velocity — It approaches v_t smoothly: 76 % after one time constant v_t/g, 96 % after two, never quite arriving.',
    'Opening a parachute makes the jumper shoot upwards — Films shoot it from a camera flyer who keeps falling; the jumper only slows down sharply.'
  ],
  formulas: [
    {
      name: 'Terminal velocity',
      expr: 'vt = sqrt(2*m*g/(rho*CD*A))', tex: 'v_t = \\sqrt{\\dfrac{2mg}{\\rho\\, C_D\\, A}}',
      vars: {
        vt: { name: 'terminal velocity', q: 'speed', unit: 'm/s', tex: 'v_t' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 90 },
        g: { const: 'g' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        CD: { name: 'drag coefficient', value: 0.65, min: 0.01, max: 3, tex: 'C_D' },
        A: { name: 'frontal area', q: 'area', unit: 'm²', value: 0.7 }
      },
      note: 'Drag ∝ v² (Reynolds numbers above about 1000); buoyancy neglected. A belly-to-earth skydiver has C_D·A ≈ 0.45 m², a head-down one ≈ 0.18 m², an open canopy ≈ 55 m².',
      practice: { unknowns: ['vt', 'A', 'm'] },
      stories: {
        vt: 'A skydiver of {m} with C_D = {CD} and a frontal area of {A} falls through air of density {rho}. What is the terminal velocity?',
        A: 'A parachutist of {m} must land at {vt} in air of density {rho} with a canopy of C_D = {CD}. What area must the canopy have?',
        m: 'A body with C_D = {CD} and frontal area {A} falls at a terminal {vt} in air of density {rho}. What is its mass?'
      }
    },
    {
      name: 'Speed while falling (constant air density and C_D)',
      expr: 'v = vt*tanh(g*t/vt)', tex: 'v = v_t \\tanh\\dfrac{g\\,t}{v_t}',
      vars: {
        v: { name: 'speed at time t', q: 'speed', unit: 'm/s' },
        vt: { name: 'terminal velocity', q: 'speed', unit: 'm/s', value: 56, tex: 'v_t' },
        g: { const: 'g' },
        t: { name: 'time since release from rest', q: 'time', unit: 's', value: 5 }
      },
      note: 'Solution of m dv/dt = mg − ½ρC_DA v² from rest; ignores the change of air density with height, which matters for long falls.',
      practice: { unknowns: ['v', 't'] },
      stories: {
        v: 'A skydiver with a terminal velocity of {vt} has fallen for {t}. How fast is she falling?',
        t: 'A body with a terminal velocity of {vt} falls from rest. How long until it reaches {v}?'
      }
    },
    {
      name: 'Distance fallen (constant air density and C_D)',
      expr: 'y = vt^2/g*ln(cosh(g*t/vt))', tex: 'y = \\dfrac{v_t^2}{g}\\,\\ln\\cosh\\dfrac{g\\,t}{v_t}',
      vars: {
        y: { name: 'distance fallen', q: 'length', unit: 'm' },
        vt: { name: 'terminal velocity', q: 'speed', unit: 'm/s', value: 56, tex: 'v_t' },
        g: { const: 'g' },
        t: { name: 'time since release from rest', q: 'time', unit: 's', value: 10 }
      },
      note: 'Integral of the tanh speed. For t ≫ v_t/g it becomes y ≈ v_t t − (v_t²/g) ln 2: the body falls at v_t, having "lost" v_t² ln2/g of distance getting up to speed.',
      practice: { unknowns: ['y', 't'] },
      stories: {
        y: 'How far does a skydiver with a terminal velocity of {vt} fall in the first {t}?',
        t: 'A skydiver with a terminal velocity of {vt} leaves the aircraft. How long does it take to fall {y}?'
      }
    },
    {
      name: 'Stokes settling speed (Re below 1)',
      expr: 'v = (rhop - rhoa)*g*d^2/(18*mu)', tex: 'v = \\dfrac{(\\rho_p - \\rho_a)\\, g\\, d^2}{18\\,\\mu}',
      vars: {
        v: { name: 'settling (terminal) speed', q: 'speed', unit: 'cm/s' },
        rhop: { name: 'density of the particle', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho_p' },
        rhoa: { name: 'density of the air', q: 'density', unit: 'kg/m³', value: 1.2, tex: '\\rho_a' },
        g: { const: 'g' },
        d: { name: 'particle diameter', q: 'length', unit: 'µm', value: 20 },
        mu: { name: 'viscosity of the air', q: 'viscosity', unit: 'Pa·s', value: 1.81e-5, tex: '\\mu' }
      },
      note: 'Only for spheres at Reynolds numbers below about 1 — cloud droplets, dust and fog up to a few tens of micrometres. For a 2 mm raindrop it would give 120 m/s instead of 6.5 m/s.',
      practice: { unknowns: ['v', 'd'] },
      stories: {
        v: 'A water droplet {d} across falls through air (density {rhoa}, viscosity {mu}). How fast does it settle?',
        d: 'Dust of density {rhop} settles at {v} in air (density {rhoa}, viscosity {mu}). How big are the grains?'
      }
    }
  ],
  examples: [
    {
      title: 'A skydiver\'s terminal speed, and how long it takes',
      q: 'A 90 kg skydiver falls belly to earth with $C_DA = 0.45$ m² in sea-level air. Find the terminal speed, and the time and distance to reach 95 % of it (constant density).',
      steps: [
        '$v_t = \\sqrt{2 \\times 90 \\times 9.81/(1.225 \\times 0.45)} = \\sqrt{3202} = 56.6$ m/s = 204 km/h.',
        '95 %: $\\tanh(gt/v_t) = 0.95$, so $gt/v_t = 1.832$ and $t = 1.832 \\times 56.6/9.81 = 10.6$ s.',
        'Distance: $y = (3202/9.81)\\,\\ln\\cosh 1.832 = 326 \\times 1.164 = 380$ m.'
      ],
      a: 'About 57 m/s (204 km/h), reached to 95 % after about 10.6 s and 380 m.'
    },
    {
      title: 'Rain against cloud',
      q: 'Compare the fall of a 20 µm cloud droplet (Stokes\' law, $\\mu = 1.81 \\times 10^{-5}$ Pa·s) with a 2 mm raindrop falling at 6.5 m/s. How long does each take to fall 1 km? Check the droplet\'s Reynolds number.',
      steps: [
        'Droplet: $v = 998.8 \\times 9.81 \\times (20 \\times 10^{-6})^2/(18 \\times 1.81 \\times 10^{-5}) = 0.012$ m/s.',
        '1 km takes $1000/0.012 = 83\\,000$ s — 23 hours. A 2 mm raindrop needs $1000/6.5 = 154$ s.',
        'Droplet $\\mathrm{Re} = 0.012 \\times 20 \\times 10^{-6}/1.5 \\times 10^{-5} = 0.016$, well below 1: Stokes applies. For the raindrop Re ≈ 870, and Stokes would wrongly predict 120 m/s.'
      ],
      a: 'The droplet takes about a day to fall a kilometre, the raindrop under three minutes.'
    },
    {
      title: 'How big a parachute?',
      q: 'A cargo parachute must land 100 kg at 5 m/s at sea level. What drag area is needed, and how large a round canopy ($C_D \\approx 0.8$ on its cloth area)?',
      steps: [
        '$C_DA = 2mg/(\\rho v^2) = 2 \\times 100 \\times 9.81/(1.225 \\times 25) = 64$ m².',
        'Cloth area $64/0.8 = 80$ m², a flat circle about 10 m across.'
      ],
      a: 'A drag area of 64 m²: a round canopy of about 80 m² of cloth.'
    }
  ],
  quiz: [
    { q: 'At terminal velocity, the net force on a falling skydiver is…', choices: ['zero', 'equal to her weight', 'twice her weight', 'upward'], a: 0,
      why: 'Drag equals weight, so the forces cancel and the speed stays constant (Newton\'s first law).' },
    { q: 'A skydiver doubles her drag area by spreading out. Her terminal speed…', choices: ['falls to 71 % (1/√2)', 'halves', 'falls to a quarter', 'stays the same'], a: 0,
      why: 'v_t ∝ 1/√(C_DA): doubling the drag area divides v_t by √2.' },
    { q: 'Why does a skydiver who jumps at 4000 m slow down during free fall without changing position?', choices: ['the air gets denser lower down, so the same drag is reached at a lower speed', 'gravity weakens', 'the skydiver gets lighter', 'the drag coefficient grows with time'], a: 0,
      why: 'v_t ∝ 1/√ρ; from 4000 m to sea level the density rises by half, so v_t falls by about 18 %.' },
    { q: 'What is the terminal speed of a 1 kg ball with a drag area of 0.01 m² in sea-level air?', answer: 40.0, unit: 'm/s', tol: 0.02,
      why: 'v_t = √(2 × 1 × 9.81/(1.225 × 0.01)) = √1602 = 40.0 m/s.' },
    { q: 'Two balls of the same size, one of steel and one of wood, dropped together from a tall tower, land at the same time.', a: false,
      why: 'Their drag is the same at the same speed, but the steel ball\'s weight is far larger, so the drag slows it less: over a long fall it lands first.' }
  ],
  problems: [
    { q: 'A hailstone 3 cm across (ice, 900 kg/m³) has C_D = 0.5. What is its terminal speed in sea-level air?', answer: 24.0, unit: 'm/s', tol: 0.02,
      steps: ['$m = 900 \\times \\tfrac{\\pi}{6} \\times 0.03^3 = 0.0127$ kg; $A = \\pi \\times 0.015^2 = 7.07 \\times 10^{-4}$ m².', '$v_t = \\sqrt{2 \\times 0.0127 \\times 9.81/(1.225 \\times 0.5 \\times 7.07 \\times 10^{-4})} = \\sqrt{577} = 24.0$ m/s.'] }
  ],
  applications: ['Parachutes for people, cargo and spacecraft.', 'Cloud physics: why droplets hang and raindrops fall; hail size and damage.', 'Settling of dust, ash, pollen and spray; cyclones and settling chambers in industry.', 'Sports: the shuttlecock, the ski jumper and the skydiving wind tunnel, which blows upwards at the flyer\'s terminal speed.'],
  history: 'In 1851 George Stokes solved the flow round a slowly moving sphere and found its drag, 3πμdv. The law still sizes dust and cloud droplets — and in Robert Millikan\'s oil-drop experiment (1909–13) it gave the size, and so the weight, of single charged droplets from their terminal speed, and with it the charge of the electron.',
  sim: 'drag-terminal'
},

{
  id: 'vehicle-aerodynamics', parent: 'drag-everyday', title: 'Road vehicle aerodynamics', level: 2,
  short: 'Cars, vans, buses and trucks push against air drag, which grows with the square of speed, and rolling resistance, which does not. Above about 65 km/h for a car and 90 km/h for a loaded truck the air takes the larger share — so drag area and speed decide motorway fuel use and electric range.',
  keywords: ['car aerodynamics', 'truck aerodynamics', 'drag coefficient of cars', 'CdA', 'rolling resistance', 'road load', 'fuel consumption', 'electric vehicle range', 'side skirts', 'boat tail', 'roof deflector', 'platooning', 'crosswind', 'Kamm tail', 'underbody', 'lift on cars'],
  prereq: ['drag-equation', 'form-drag', 'physics:power', 'physics:friction'],
  related: ['streamlining', 'bluff-bodies', 'racing-downforce', 'cycling-aero', 'ground-effect', 'wind-tunnel', 'flow-separation', 'physics:work-energy'],
  body: `
A vehicle driving steadily on a level road pushes against two forces. **Rolling resistance** — the energy lost flexing the tyres — hardly depends on speed: $F_r = C_{rr}\\,mg$, with $C_{rr}$ about 0.007–0.012 for car tyres and 0.004–0.007 for truck tyres. **Aerodynamic drag** grows with the square of speed. The road load is their sum (plus a part of the weight on a slope, and $ma$ when accelerating):

$$F = C_{rr}\\,mg + \\tfrac12\\,\\rho\\, C_DA\\, V^2$$

The two are equal at $V_x = \\sqrt{2C_{rr}mg/(\\rho C_DA)}$ — about 65 km/h for a family car and about 90 km/h for a loaded 40-tonne truck. Above that the air takes the larger share: on the motorway it is 60–70 % of a car's resistance and about half of a truck's.

| Vehicle (rounded) | $C_D$ | Frontal area | $C_DA$ |
|---|---|---|---|
| Streamlined electric saloon | 0.20–0.23 | 2.2–2.4 m² | 0.45–0.55 m² |
| Family hatchback or saloon | 0.27–0.33 | 2.1–2.3 m² | 0.6–0.7 m² |
| SUV | 0.32–0.40 | 2.6–3.0 m² | 0.9–1.1 m² |
| Pickup truck | 0.40–0.50 | 3.0–3.3 m² | 1.3–1.6 m² |
| Motorcycle and rider | 0.5–0.7 | 0.6–0.8 m² | 0.3–0.6 m² |
| City bus | 0.6–0.8 | 7–8 m² | ≈ 5 m² |
| Articulated truck | 0.55–0.8 | ≈ 10 m² | 5.5–8 m² |

### Where a car's drag comes from
Most of it is [[form-drag|pressure drag]] from the wake behind the body. The wheels and wheel arches contribute roughly a quarter, the cooling air through the radiator 5–10 %, the underbody, mirrors and small parts the rest. The rear end is critical. A squareback leaves a large flat base in the wake; a fastback keeps the flow attached down a shallow slope; a slope near 30° is the worst of both, trailing strong vortices from its sides — a classic result of wind-tunnel tests on simplified car bodies. Kamm tails, smooth underbodies, wheel covers, air curtains around the front wheels and cameras in place of mirrors are the tools of a low-drag car.

Cars also make some **lift**: a saloon's body is a rough airfoil, and its axles grow lighter at speed. Spoilers and small diffusers trim it. Racing cars go much further — see [[racing-downforce]].

### Trucks: the big prize
A truck presents a flat, 10 m² face to the wind. A roof deflector that steers the air over a taller trailer, side skirts that stop air rushing under the trailer, a boat tail at the back and a closed gap between cab and trailer can together cut the drag by 15–25 %. At motorway speed, where drag is half the resistance, each 10 % of drag saved is about 4–5 % of fuel. Trucks driving as a **platoon**, a few tens of metres apart, share the air as cyclists do: the followers save roughly 10 %, the leader a few per cent. Crosswinds raise a truck's drag, because the air meets its long side at an angle.

### Fuel and range
Fuel per kilometre follows the force, not the power: 1 N of road load costs 1 J per metre, so 440 N is 44 MJ at the wheels per 100 km. An engine turns fuel into wheel work with about 20–25 % efficiency when cruising (petrol) or 35–40 % (a truck diesel); an electric drive with about 85–90 %. Because drag grows as $V^2$, driving at 130 km/h instead of 110 raises a car's aerodynamic drag by 40 %, and an electric car's motorway range falls accordingly.

> [!note] Figures are typical and rounded. Real consumption also depends on traffic, hills, weather, tyres, heating and air conditioning.
`,
  ideas: [
    'Road load = rolling resistance C_rr·mg (nearly constant) + aerodynamic drag ½ρC_DA·V² (grows as V²).',
    'Aerodynamic drag overtakes rolling resistance at about 65 km/h for a car and 90 km/h for a loaded truck.',
    'Fuel or energy per kilometre is proportional to the road load force; power grows faster, as the force times V.',
    'Most of a road vehicle\'s drag is pressure drag from its wake: the rear end, the wheels and the underbody matter most.'
  ],
  pitfalls: [
    'Air drag only matters for sports cars and aircraft — Above about 65 km/h it is the largest force on any car, and at 90 km/h about half the resistance of a 40-tonne truck.',
    'Fuel per kilometre grows with the cube of speed — The power grows as V³, but fuel per kilometre follows the force: its aerodynamic part grows as V², and rolling resistance not at all.',
    'A low C_D means a low drag — An SUV with C_D 0.33 can drag more than a saloon with 0.28 because its frontal area is larger; compare drag areas.'
  ],
  formulas: [
    {
      name: 'Road load on a level road',
      expr: 'F = Crr*m*g + 0.5*rho*CdA*V^2', tex: 'F = C_{rr}\\,mg + \\tfrac{1}{2}\\,\\rho\\,\\mathit{C_DA}\\,V^2',
      vars: {
        F: { name: 'total resistance', q: 'force', unit: 'N' },
        Crr: { name: 'rolling-resistance coefficient', value: 0.010, min: 0.001, max: 0.05, tex: 'C_{rr}' },
        m: { name: 'vehicle mass', q: 'mass', unit: 'kg', value: 1300 },
        g: { const: 'g' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        CdA: { name: 'drag area C_D·A', q: 'area', unit: 'm²', value: 0.66, tex: '\\mathit{C_DA}' },
        V: { name: 'speed (still air)', q: 'speed', unit: 'km/h', value: 100 }
      },
      note: 'Steady speed, level road, no wind. Add mg sin θ on a slope and ma when accelerating. Drivetrain losses come on top.',
      practice: { unknowns: ['F', 'V', 'CdA'] },
      stories: {
        F: 'A car of {m} with a drag area of {CdA} and C_rr = {Crr} drives at {V} (air density {rho}). What force must its wheels push with?',
        V: 'A car of {m} (drag area {CdA}, C_rr = {Crr}) can push with {F} at its wheels. How fast can it drive on the level (air density {rho})?',
        CdA: 'A coast-down test finds a road load of {F} at {V} for a car of {m} with C_rr = {Crr} (air density {rho}). What is its drag area?'
      }
    },
    {
      name: 'Power at the wheels',
      expr: 'P = (Crr*m*g + 0.5*rho*CdA*V^2)*V', tex: 'P = \\left(C_{rr}\\,mg + \\tfrac{1}{2}\\,\\rho\\,\\mathit{C_DA}\\,V^2\\right)V',
      vars: {
        P: { name: 'power at the wheels', q: 'power', unit: 'kW' },
        Crr: { name: 'rolling-resistance coefficient', value: 0.010, min: 0.001, max: 0.05, tex: 'C_{rr}' },
        m: { name: 'vehicle mass', q: 'mass', unit: 'kg', value: 1300 },
        g: { const: 'g' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        CdA: { name: 'drag area C_D·A', q: 'area', unit: 'm²', value: 0.66, tex: '\\mathit{C_DA}' },
        V: { name: 'speed', q: 'speed', unit: 'km/h', value: 100 }
      },
      note: 'Steady, level, still air. Solving for V gives the top speed for a given power at the wheels.',
      practice: { unknowns: ['P', 'V'] },
      stories: {
        P: 'What power must reach the wheels of a {m} car (drag area {CdA}, C_rr = {Crr}) to hold {V} on the level (air density {rho})?',
        V: 'A car of {m} (drag area {CdA}, C_rr = {Crr}) has {P} at its wheels. What top speed can it reach on the level (air density {rho})?'
      }
    },
    {
      name: 'Speed at which drag equals rolling resistance',
      expr: 'Vx = sqrt(2*Crr*m*g/(rho*CdA))', tex: 'V_x = \\sqrt{\\dfrac{2\\,C_{rr}\\,mg}{\\rho\\,\\mathit{C_DA}}}',
      vars: {
        Vx: { name: 'crossover speed', q: 'speed', unit: 'km/h', tex: 'V_x' },
        Crr: { name: 'rolling-resistance coefficient', value: 0.006, min: 0.001, max: 0.05, tex: 'C_{rr}' },
        m: { name: 'vehicle mass', q: 'mass', unit: 'kg', value: 40000 },
        g: { const: 'g' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        CdA: { name: 'drag area C_D·A', q: 'area', unit: 'm²', value: 6.0, tex: '\\mathit{C_DA}' }
      },
      note: 'Above V_x air drag is the larger part of the road load. The starting values are a loaded 40-tonne articulated truck.',
      stories: { Vx: 'A truck of {m} has a drag area of {CdA} and C_rr = {Crr}. Above what speed is air drag its larger resistance (air density {rho})?' }
    },
    {
      name: 'Fuel used over a distance',
      expr: 'Vf = F*d/(eta*Ev)', tex: 'V_f = \\dfrac{F\\,d}{\\eta\\,E_v}',
      vars: {
        Vf: { name: 'fuel used', q: 'volume', unit: 'L', tex: 'V_f' },
        F: { name: 'road load (average force at the wheels)', q: 'force', unit: 'N', value: 440 },
        d: { name: 'distance', q: 'length', unit: 'km', value: 100 },
        eta: { name: 'tank-to-wheel efficiency', value: 0.22, min: 0.05, max: 0.6, tex: '\\eta' },
        Ev: { name: 'energy content of the fuel per volume', q: 'energydensity', unit: 'MJ/m³', value: 32000, tex: 'E_v' }
      },
      note: 'Petrol ≈ 32 000 MJ/m³ (32 MJ per litre), diesel ≈ 36 000 MJ/m³. η ≈ 0.2–0.25 for a petrol car cruising, 0.35–0.4 for a truck diesel. For an electric car, divide F·d by the battery-to-wheel efficiency (0.85–0.9) instead.',
      practice: { unknowns: ['Vf', 'F'] },
      stories: {
        Vf: 'A car with a road load of {F} drives {d}. Its engine and drivetrain turn fuel into wheel work with an efficiency of {eta}, and the fuel holds {Ev}. How much fuel does it use?',
        F: 'A truck uses {Vf} of fuel ({Ev}) over {d} at an efficiency of {eta}. What average road load does that correspond to?'
      }
    }
  ],
  examples: [
    {
      title: 'A car at 100 and 130 km/h',
      q: 'A car of 1300 kg with $C_DA = 0.66$ m² and $C_{rr} = 0.010$ cruises on the level at sea level. Find the road load, the share of the air, the power at the wheels and the fuel per 100 km (petrol, 32 MJ/L, efficiency 22 %) at 100 and at 130 km/h.',
      steps: [
        'Rolling: $0.010 \\times 1300 \\times 9.81 = 128$ N at any speed.',
        '100 km/h (27.8 m/s): drag $\\tfrac12 \\times 1.225 \\times 0.66 \\times 27.8^2 = 312$ N; total 440 N, 71 % air; power $440 \\times 27.8 = 12.2$ kW; fuel $440 \\times 10^5/(0.22 \\times 32 \\times 10^6) = 6.2$ L.',
        '130 km/h (36.1 m/s): drag 527 N; total 655 N, 80 % air; power 23.6 kW; fuel 9.3 L — 49 % more per kilometre for 30 % more speed.'
      ],
      a: 'About 6.2 L/100 km at 100 km/h and 9.3 L/100 km at 130 km/h; the power nearly doubles.'
    },
    {
      title: 'What side skirts save a truck',
      q: 'A 40 t truck ($C_{rr} = 0.006$, $C_DA = 6.0$ m²) drives at 85 km/h. Its diesel drivetrain turns fuel (36 MJ/L) into wheel work at 38 %. What is its fuel use, and what does a 10 % cut in drag area save?',
      steps: [
        '85 km/h = 23.6 m/s. Rolling: $0.006 \\times 40\\,000 \\times 9.81 = 2354$ N; drag: $\\tfrac12 \\times 1.225 \\times 6.0 \\times 23.6^2 = 2049$ N; total 4403 N.',
        'Fuel: $4403 \\times 10^5/(0.38 \\times 36 \\times 10^6) = 32.2$ L per 100 km.',
        'Drag area 5.4 m²: drag 1844 N, total 4198 N, fuel 30.7 L — a saving of 1.5 L per 100 km, 4.7 %, or roughly 1800 L over 120 000 km a year.'
      ],
      a: 'About 32 L/100 km; a 10 % aerodynamic improvement saves about 1.5 L/100 km.'
    }
  ],
  quiz: [
    { q: 'At 50 km/h in town, which force is larger for a typical family car (1300 kg, C_DA = 0.66 m², C_rr = 0.010)?', choices: ['rolling resistance (about 128 N against 78 N of drag)', 'air drag', 'they are always equal', 'neither — engine friction'], a: 0,
      why: 'At 13.9 m/s the drag is ½ × 1.225 × 0.66 × 13.9² = 78 N, less than 128 N of rolling resistance. The crossover is near 65 km/h.' },
    { q: 'A truck\'s drag area is cut by 10 %. At 85 km/h, where air drag is about half its resistance, its fuel use falls by about…', choices: ['5 %', '10 %', '1 %', '20 %'], a: 0,
      why: 'Half the force is aerodynamic; 10 % of that half is 5 % of the total force, and fuel per kilometre follows the force.' },
    { q: 'What power reaches the wheels of a 1500 kg car with C_DA = 0.6 m² and C_rr = 0.010 at a steady 30 m/s on the level (sea-level air)?', answer: 14.3, unit: 'kW', tol: 0.02,
      why: 'Rolling 0.010 × 1500 × 9.81 = 147 N; drag ½ × 1.225 × 0.6 × 900 = 331 N; total 478 N × 30 m/s = 14.3 kW.' },
    { q: 'Driving at 130 km/h instead of 110 km/h raises the aerodynamic drag by about 40 %.', a: true,
      why: '(130/110)² = 1.40. The aerodynamic power rises by (130/110)³ = 1.65.' },
    { q: 'Why does a roof deflector on a truck\'s cab save fuel?', choices: ['it steers the air smoothly over the taller trailer instead of letting it strike the trailer\'s flat front', 'it creates downforce', 'it cools the engine', 'it lowers the rolling resistance'], a: 0,
      why: 'Without it, the air coming off the cab roof hits the trailer\'s front face and separates round its edges; the deflector turns the cab and trailer into one smoother body.' }
  ],
  problems: [
    { q: 'An electric car (1900 kg, C_DA = 0.50 m², C_rr = 0.008) turns battery energy into wheel work at 85 %. How far can it drive on 75 kWh at a steady 110 km/h on the level in sea-level air?', answer: 527, unit: 'km', tol: 0.03,
      steps: ['110 km/h = 30.6 m/s. Drag $\\tfrac12 \\times 1.225 \\times 0.50 \\times 30.6^2 = 286$ N; rolling $0.008 \\times 1900 \\times 9.81 = 149$ N; total 435 N.', 'Per km at the wheels: 435 kJ = 0.121 kWh; from the battery $0.121/0.85 = 0.142$ kWh/km.', 'Range $75/0.142 = 527$ km (no heating, air conditioning or hills).'] }
  ],
  applications: ['Electric-car range, which at motorway speed is dominated by drag area and speed.', 'Truck aerodynamic kits and platooning in freight transport.', 'Car design in wind tunnels with moving ground and in CFD.', 'Crosswind stability of vans, buses and high-sided trucks.'],
  history: 'Edmund Rumpler\'s teardrop-shaped "Tropfenwagen" of 1921 was measured decades later at a drag coefficient near 0.28 — lower than most cars built in the following sixty years. The fuel crises of the 1970s made drag a selling point: the 1982 Audi 100 advertised a C_D of 0.30, and today\'s electric saloons reach about 0.20.',
  sim: { id: 'drag-vehicles', params: { vehicle: 'car' } }
},

{
  id: 'racing-downforce', parent: 'drag-everyday', title: 'Downforce in motorsport', level: 2,
  short: 'Racing cars use upside-down wings and a shaped floor to make the air press them onto the road. The extra load lets the tyres grip harder, so fast corners can be taken much faster — at the price of drag, and sometimes of porpoising.',
  keywords: ['downforce', 'racing car', 'inverted wing', 'rear wing', 'front wing', 'diffuser', 'ground effect', 'venturi', 'porpoising', 'Formula 1', 'cornering speed', 'grip', 'Gurney flap', 'DRS', 'fan car', 'lateral acceleration'],
  prereq: ['lift-equation', 'ground-effect', 'physics:friction', 'physics:centripetal-force'],
  related: ['vehicle-aerodynamics', 'high-lift-devices', 'drag-equation', 'lift-to-drag', 'flow-separation', 'induced-drag', 'dynamic-stability', 'physics:uniform-circular-motion'],
  body: `
The grip of a tyre is roughly proportional to the load pressing it onto the road: the sideways force it can give is at most $\\mu N$, with $\\mu$ about 1 for road tyres and 1.5–1.8 for racing slicks. Without aerodynamic help the load is the car's weight, so the greatest cornering acceleration is $\\mu g$, and the fastest a car can take a corner of radius $R$ is $\\sqrt{\\mu gR}$ — whatever it weighs. **Downforce** — lift pointing down, $\\tfrac12\\rho V^2 C_LA$ — adds load that grows with the square of speed. The faster the car goes, the more grip it has:

$$\\frac{mV^2}{R} = \\mu\\left(mg + \\tfrac12\\rho V^2 C_LA\\right) \\quad\\Rightarrow\\quad V^2 = \\frac{\\mu g R}{1 - \\mu\\rho\\, C_LA\\, R/(2m)}$$

The denominator shrinks as the radius grows. At $R^* = 2m/(\\mu\\rho C_LA)$ it reaches zero: in any corner wider than that, the grip grows faster than the need and only power and drag limit the speed — the corner is "flat out". For a single-seater of 800 kg with $\\mu = 1.6$ and $C_LA = 4.5$ m², $R^*$ is about 180 m. Its downforce equals its weight at $\\sqrt{2mg/(\\rho C_LA)}$, about 190 km/h: above that it could, in principle, drive on a tunnel ceiling.

| Car (rounded, illustrative) | $C_LA$ | $C_DA$ | Downforce at 250 km/h |
|---|---|---|---|
| Road saloon | slight lift | 0.6–0.7 m² | a little lift |
| Sports car with a rear wing | 0.3–0.5 m² | 0.7–0.8 m² | ≈ 1 kN |
| GT racing car | ≈ 2 m² | ≈ 1.0 m² | ≈ 6 kN |
| Endurance prototype | ≈ 3.5 m² | ≈ 1.0 m² | ≈ 10 kN |
| Single-seater, high-downforce set-up | ≈ 4.5 m² | ≈ 1.25 m² | ≈ 13 kN, 1.7 × its weight |

### Where the downforce comes from
- **Inverted wings.** Front and rear wings are airfoils mounted upside down. Multi-element wings with slots, like the [[high-lift-devices|flaps and slats]] of a landing aircraft, reach lift coefficients of 2.5–3.5 on their own area. A *Gurney flap* — a lip a few millimetres high along the trailing edge — adds downforce for little drag. The front wing works [[ground-effect|close to the road]], which strengthens it.
- **The floor.** The underbody is the most efficient downforce maker. Shaped as a **venturi** — a throat under the car, then an upswept **diffuser** at the back — it speeds up the air beneath the car and lowers its pressure. The diffuser slows that air back to the pressure behind the car, which is what lets the flow underneath run fast; its upsweep is limited to angles of about 10–15° before the flow separates. Sealing the sides, once with sliding skirts, makes the effect far stronger.
- **Fans** that suck air from under the car were raced in 1970 and 1978, and banned.

Downforce costs **drag**: a high-downforce single-seater has a drag area of about 1.2 m², twice a road car's, and a whole-car L/D of only 3–4. That is why set-ups change from track to track — maximum wing for slow, twisty circuits, minimum for long straights — and why some series let drivers flatten the rear-wing flap on straights, a drag-reduction system worth typically 10–15 km/h.

### Ground effect and porpoising
Floor downforce is very sensitive to **ride height**. As the car runs lower the floor sucks harder — until the flow underneath chokes and separates, and the downforce collapses. At high speed the downforce can press the car down into that region: the downforce drops, the suspension lifts the car, the flow reattaches, the downforce returns, and the car bounces several times a second — **porpoising**, which returned to Formula 1 with the venturi floors of 2022. Teams cured it with stiffer suspensions and higher ride heights, and the rules raised the edges of the floor. A car whose floor meets air from below — over a crest, or when it pitches up in another car's wake — can lose its downforce at once and even take off, as prototypes did at Le Mans in 1999.

> [!warn] Racing figures are rounded and illustrative. Motorsport safety rests on the rules, the circuits and the marshals; none of this is guidance for modifying a road car.
`,
  ideas: [
    'Tyre grip ≈ μ × load. Without downforce the cornering speed is √(μgR), independent of mass.',
    'Downforce ½ρV²C_LA adds load that grows as V², so grip rises with speed.',
    'Beyond R* = 2m/(μρC_LA) a corner is limited by power, not grip.',
    'Inverted wings and a venturi floor with a diffuser make the downforce; its price is drag.',
    'Floor downforce is ride-height sensitive and can stall, causing porpoising or sudden loss of grip.'
  ],
  pitfalls: [
    'Downforce is free grip — It costs drag, and so top speed and fuel; and grip grows less than in proportion to load, because tyres are load-sensitive.',
    'More downforce always makes a car faster — Only in corners fast enough for it to matter. On slow, twisty tracks mechanical grip dominates; on long straights the drag loses time.',
    'Ground effect is simply a wing near the ground — The floor works as a venturi whose sides must be sealed; it is very sensitive to ride height and pitch and can stall suddenly.'
  ],
  formulas: [
    {
      name: 'Downforce',
      expr: 'Fz = 0.5*rho*V^2*ClA', tex: 'F_z = \\tfrac{1}{2}\\,\\rho V^2\\,\\mathit{C_LA}',
      vars: {
        Fz: { name: 'downforce', q: 'force', unit: 'kN', tex: 'F_z' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'speed', q: 'speed', unit: 'km/h', value: 250 },
        ClA: { name: 'downforce area C_L·A', q: 'area', unit: 'm²', value: 4.5, tex: '\\mathit{C_LA}' }
      },
      note: 'The lift equation with the lift pointing down. C_LA is quoted like a drag area; a high-downforce single-seater has about 4–5 m², a GT car about 2 m².',
      practice: { unknowns: ['Fz', 'V', 'ClA'] },
      stories: {
        Fz: 'A racing car with a downforce area of {ClA} runs at {V} in air of density {rho}. How much downforce does it make?',
        V: 'A car with a downforce area of {ClA} must make {Fz} of downforce (air density {rho}). How fast must it go?',
        ClA: 'A car makes {Fz} of downforce at {V} in air of density {rho}. What is its downforce area?'
      }
    },
    {
      name: 'Grip-limited cornering speed with downforce',
      expr: 'm*V^2/R = mu*(m*g + 0.5*rho*V^2*ClA)', tex: '\\dfrac{mV^2}{R} = \\mu\\left(mg + \\tfrac{1}{2}\\rho V^2\\,\\mathit{C_LA}\\right)',
      vars: {
        m: { name: 'car mass', q: 'mass', unit: 'kg', value: 800 },
        V: { name: 'cornering speed', q: 'speed', unit: 'km/h' },
        R: { name: 'corner radius', q: 'length', unit: 'm', value: 120 },
        mu: { name: 'tyre friction coefficient', value: 1.6, min: 0.3, max: 2.5, tex: '\\mu' },
        g: { const: 'g' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        ClA: { name: 'downforce area C_L·A', q: 'area', unit: 'm²', value: 4.5, tex: '\\mathit{C_LA}' }
      },
      solveFor: 'V',
      note: 'Flat corner, constant μ (real tyres lose some μ as the load rises), no banking. With C_LA = 0 it gives V = √(μgR). No solution for V once R exceeds 2m/(μρC_LA): grip no longer limits the speed.',
      practice: { unknowns: ['V', 'R', 'mu'] },
      stories: {
        V: 'A car of {m} with tyres of μ = {mu} and a downforce area of {ClA} takes a {R} corner (air density {rho}). What is the fastest it can go?',
        R: 'A car of {m} (μ = {mu}, downforce area {ClA}) takes a corner at {V} right at the limit of grip (air density {rho}). What is the corner radius?',
        mu: 'A car of {m} with a downforce area of {ClA} takes a {R} corner at {V} at the limit (air density {rho}). What friction coefficient do its tyres have?'
      }
    },
    {
      name: 'Radius beyond which grip is no longer the limit',
      expr: 'Rs = 2*m/(mu*rho*ClA)', tex: 'R^* = \\dfrac{2m}{\\mu\\,\\rho\\,\\mathit{C_LA}}',
      vars: {
        Rs: { name: 'critical corner radius', q: 'length', unit: 'm', tex: 'R^*' },
        m: { name: 'car mass', q: 'mass', unit: 'kg', value: 800 },
        mu: { name: 'tyre friction coefficient', value: 1.6, min: 0.3, max: 2.5, tex: '\\mu' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        ClA: { name: 'downforce area C_L·A', q: 'area', unit: 'm²', value: 4.5, tex: '\\mathit{C_LA}' }
      },
      note: 'In a wider corner the downforce grows faster than the grip needed, so the car is limited by power and drag, not grip (in this simple model).',
      stories: { Rs: 'A car of {m} has tyres of μ = {mu} and a downforce area of {ClA}. Beyond what corner radius can it, in principle, stay flat out (air density {rho})?' }
    },
    {
      name: 'Speed at which downforce equals weight',
      expr: 'V = sqrt(2*m*g/(rho*ClA))', tex: 'V = \\sqrt{\\dfrac{2mg}{\\rho\\,\\mathit{C_LA}}}',
      vars: {
        V: { name: 'speed', q: 'speed', unit: 'km/h' },
        m: { name: 'car mass', q: 'mass', unit: 'kg', value: 800 },
        g: { const: 'g' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        ClA: { name: 'downforce area C_L·A', q: 'area', unit: 'm²', value: 4.5, tex: '\\mathit{C_LA}' }
      },
      note: 'Above this speed the car is pressed down by more than its own weight: the "could drive upside down" speed (ignoring everything else that would go wrong).',
      stories: { V: 'At what speed does a car of {m} with a downforce area of {ClA} make downforce equal to its weight (air density {rho})?' }
    }
  ],
  examples: [
    {
      title: 'The same corner, with and without wings',
      q: 'A single-seater of 800 kg on slicks ($\\mu = 1.6$) takes a 120 m corner at sea level. What is its limit speed without downforce, and with $C_LA = 4.5$ m²?',
      steps: [
        'Without: $V = \\sqrt{1.6 \\times 9.81 \\times 120} = 43.4$ m/s = 156 km/h, a lateral acceleration of 1.6 g.',
        'With: $\\mu\\rho C_LA R/(2m) = 1.6 \\times 1.225 \\times 4.5 \\times 120/1600 = 0.66$.',
        '$V^2 = 1.6 \\times 9.81 \\times 120/(1 - 0.66) = 5560$, so $V = 74.6$ m/s = 268 km/h, a lateral acceleration of $74.6^2/120 = 46$ m/s² = 4.7 g.'
      ],
      a: '156 km/h without downforce, about 270 km/h with it — and nearly 5 g instead of 1.6 g.'
    },
    {
      title: 'What the wings cost on the straight',
      q: 'The same car has $C_DA = 1.25$ m². How much drag and power does the air take at 300 km/h? And how much downforce is it making?',
      steps: [
        '300 km/h = 83.3 m/s: $q = \\tfrac12 \\times 1.225 \\times 83.3^2 = 4250$ Pa.',
        'Drag $4250 \\times 1.25 = 5.3$ kN; power $5.3 \\times 83.3 = 443$ kW — most of what the engine gives.',
        'Downforce $4250 \\times 4.5 = 19$ kN, about 2.4 times the car\'s weight.'
      ],
      a: 'About 5.3 kN of drag costing 440 kW, with 19 kN of downforce.'
    }
  ],
  quiz: [
    { q: 'Without aerodynamic downforce, the fastest a car can take a flat corner of radius R depends on…', choices: ['μ, g and R only — not on the mass', 'the mass', 'the engine power', 'the drag coefficient'], a: 0,
      why: 'mV²/R = μmg gives V = √(μgR): the mass cancels.' },
    { q: 'Why do racing cars use inverted wings rather than simply carrying ballast to load the tyres?', choices: ['ballast adds mass as well as load, so the grip per kilogram does not rise; downforce adds load without mass', 'ballast is not allowed', 'wings are lighter than ballast', 'wings reduce drag'], a: 0,
      why: 'Cornering needs sideways force m V²/R. Extra mass raises both the load and the force needed; downforce raises only the load.' },
    { q: 'What does a racing car\'s diffuser do?', choices: ['it slows the air leaving the underbody back to the pressure behind the car, which lets the flow under the car run faster and at lower pressure', 'it cools the brakes', 'it reduces lift at the front only', 'it blows exhaust gas onto the rear wing'], a: 0,
      why: 'The floor and diffuser form a venturi: the pressure recovery in the diffuser allows a low-pressure, high-speed flow at the throat under the car.' },
    { q: 'Downforce helps more in fast corners than in slow ones.', a: true,
      why: 'Downforce grows as V²; in a slow hairpin it adds little to the weight, in a fast sweeper it can exceed it.' },
    { q: 'What downforce does a car with C_LA = 3.0 m² make at 216 km/h (60 m/s) in sea-level air?', answer: 6615, unit: 'N', tol: 0.02,
      why: 'F = ½ × 1.225 × 60² × 3.0 = 6615 N, about 6.6 kN.' }
  ],
  problems: [
    { q: 'A GT car of 1300 kg has tyres with μ = 1.4 and a downforce area of 2.0 m². Beyond what corner radius is grip no longer its limit, in the simple model (sea-level air)?', answer: 758, unit: 'm', tol: 0.02,
      steps: ['$R^* = 2m/(\\mu\\rho C_LA) = 2600/(1.4 \\times 1.225 \\times 2.0)$.', '$= 2600/3.43 = 758$ m.'] }
  ],
  applications: ['Race-car set-up: trading downforce against drag circuit by circuit.', 'Road sports cars with active rear wings and diffusers that cut lift at speed.', 'Wind tunnels with rolling roads and CFD maps of downforce against ride height and pitch.', 'Rules that shape floors and wings to make close racing possible and cars safe.'],
  history: 'Wings arrived in racing in the late 1960s: Jim Hall\'s Chaparral sports cars carried high, adjustable wings from 1966, and in 1968 Formula 1 cars sprouted them within months; after several broke, high mounts were banned in 1969. Colin Chapman and Peter Wright\'s Lotus 78 and 79 of 1977–78 turned the whole car into a wing with a venturi underbody and sliding skirts, and Gordon Murray\'s Brabham BT46B "fan car" won its only race in 1978 before being withdrawn.',
  sim: ['drag-downforce', 'drag-porpoising']
},

{
  id: 'sports-aerodynamics', parent: 'drag-everyday', title: 'Aerodynamics of sports balls', level: 2,
  short: 'Balls fly at Reynolds numbers where the boundary layer is on the edge of turning turbulent. Dimples, seams, fuzz and spin decide where the flow separates — giving the long carry of a golf drive, the curve of a free kick, cricket swing and reverse swing, and the flutter of a knuckleball.',
  keywords: ['golf ball dimples', 'drag crisis', 'Magnus effect', 'spin', 'backspin', 'topspin', 'curveball', 'knuckleball', 'cricket swing', 'reverse swing', 'free kick', 'tennis ball', 'shuttlecock', 'spin parameter', 'Reynolds number of balls', 'football'],
  prereq: ['drag-crisis', 'magnus-effect', 'reynolds-number', 'transition'],
  related: ['bluff-bodies', 'terminal-velocity', 'boundary-layer', 'flow-separation', 'turbulent-boundary-layer', 'drag-equation', 'cycling-aero', 'physics:projectile-motion'],
  body: `
Almost every ball game is played in the same narrow band of aerodynamics. Balls fly at [[reynolds-number|Reynolds numbers]] of about 10⁴ to 5×10⁵ — exactly where the [[boundary-layer|boundary layer]] on a sphere is on the verge of turning turbulent. Whether it has turned decides where the flow leaves the back of the ball, how big the wake is and how much drag there is; and any asymmetry pushes the ball sideways. Seams, dimples, fuzz and spin are the controls.

| Ball | Diameter | Mass | Typical speed | Reynolds number |
|---|---|---|---|---|
| Table tennis | 40 mm | 2.7 g | 5–25 m/s | 1.3–7 × 10⁴ |
| Golf | 42.7 mm | 45.9 g | 30–75 m/s | 0.9–2.1 × 10⁵ |
| Tennis | 67 mm | 57 g | 20–60 m/s | 0.9–2.7 × 10⁵ |
| Cricket | 72 mm | 160 g | 25–42 m/s | 1.2–2 × 10⁵ |
| Baseball | 74 mm | 145 g | 30–48 m/s | 1.5–2.4 × 10⁵ |
| Football (soccer) | 220 mm | 430 g | 10–35 m/s | 1.5–5 × 10⁵ |

A smooth sphere reaches its [[drag-crisis]] — the sudden fall of $C_D$ from about 0.5 to 0.1–0.2 as its boundary layer turns turbulent and separates later — at a Reynolds number of about 3×10⁵. Most balls live just below that, so small details of the surface decide which side of the crisis they fly on.

### Golf: dimples and backspin
The 300–500 shallow dimples of a golf ball trip its boundary layer at a Reynolds number of about 5×10⁴, far below the smooth-sphere crisis. The turbulent layer clings further round the back, the wake narrows, and $C_D$ is about 0.25 instead of 0.5. A drive also leaves the club with 2000–3500 rpm of backspin, and the spinning surface deflects the wake downwards: the [[magnus-effect|Magnus effect]] gives a lift coefficient of 0.15–0.25, more than the ball's weight at launch. The ball climbs on a flat, rising path and hangs; a smooth ball hit the same way carries about half as far.

### Spin and curve
Spin about a vertical axis bends the path sideways: the swerving free kick, the curveball, the sliced drive. The force is $\\tfrac12\\rho V^2 AC_L$, with $C_L$ growing with the **spin parameter** $r\\omega/V$ — about 0.1–0.3 for spin parameters of 0.05–0.3. Topspin turns the force downwards, so a topspin tennis shot dips into the court and can be hit harder. A spinning football that slows through its drag crisis suddenly meets more drag, and its path tightens late — the free kick that seems to bend at the last moment.

### Knuckleballs: no spin at all
A ball thrown or kicked with almost no spin behaves strangely. The seams of a baseball, or the panel joints of a football, sit in different places on its two sides, and each can trip the boundary layer on its side or not. As the ball turns slowly — a baseball knuckleball may make a quarter to one turn on its way to the plate — the side forces change size and direction, and the ball flutters unpredictably. Volleyball float serves and dipping football shots work the same way. A very smooth football moves its drag crisis up to shooting speeds, where small differences matter most — one reason some tournament balls have been criticised for erratic flight.

### Cricket: swing and reverse swing
A new cricket ball is smooth and shiny, with a raised seam. The bowler releases it with the seam angled about 20° to the line of flight. On the seam side the seam trips the boundary layer turbulent, and it separates late; on the other side it stays laminar and separates early. The wake is deflected away from the seam side, and the ball is pushed towards it: **conventional swing**, strongest at around 30–35 m/s. At higher speeds, or once one side of an older ball has been roughened in play, the boundary layer is turbulent on *both* sides before it reaches the seam; now the seam thickens the layer on its own side and makes it separate *earlier*, and the ball swings the other way — **reverse swing**. That is why bowlers polish one side of the ball and let the other wear.

### Fuzz and feathers
Tennis balls are covered in fuzz that keeps their drag high (C_D 0.55–0.6) and nearly constant with speed; worn balls, with less fuzz, fly faster. A badminton shuttlecock is a deliberate air brake: smashed at over 80 m/s, it falls to its terminal speed of about 7 m/s within a few metres, and its skirt behind the cork turns it cork-first whatever its start.
`,
  ideas: [
    'Balls fly at Reynolds numbers of 10⁴–5×10⁵, near the drag crisis of a sphere, so surface details decide their drag.',
    'Dimples trip the boundary layer early, delaying separation: a golf ball has about half the drag of a smooth one.',
    'Spin deflects the wake and gives a Magnus force across the flight path; C_L grows with the spin parameter rω/V.',
    'Asymmetric boundary layers — from seams, panels or a rough side — give side forces: swing, reverse swing and knuckleballs.'
  ],
  pitfalls: [
    'Dimples reduce drag by lowering friction — They add a little friction; the gain comes from delaying separation and shrinking the wake, which cuts the pressure drag.',
    'A spinning ball curves because it grips the air like a wheel on a road — The spinning surface helps the boundary layer stay attached on the side moving with the flow and makes it leave earlier on the other; the wake is thrown one way and the ball pushed the other.',
    'Reverse swing needs a wet or tampered ball — It is aerodynamic: with both boundary layers turbulent, the seam makes its own side separate earlier and reverses the side force. Legitimate wear and polish produce it.'
  ],
  formulas: [
    {
      name: 'Reynolds number of a ball',
      expr: 'Re = V*d/nu', tex: '\\mathrm{Re} = \\dfrac{V\\,d}{\\nu}',
      vars: {
        Re: { name: 'Reynolds number', tex: '\\mathrm{Re}' },
        V: { name: 'ball speed', q: 'speed', unit: 'm/s', value: 70 },
        d: { name: 'ball diameter', q: 'length', unit: 'mm', value: 42.7 },
        nu: { name: 'kinematic viscosity of air (≈ 15 mm²/s at 15–20 °C)', q: 'kinvisc', unit: 'mm²/s', value: 15, tex: '\\nu' }
      },
      note: 'A smooth sphere\'s drag crisis is near Re ≈ 3×10⁵; dimples, seams and roughness bring it down (to about 5×10⁴ for a golf ball).',
      stories: { Re: 'A ball {d} across flies at {V} through air of kinematic viscosity {nu}. What is its Reynolds number?', V: 'At what speed does a ball {d} across reach a Reynolds number of {Re} (air of kinematic viscosity {nu})?' }
    },
    {
      name: 'Spin parameter',
      expr: 'S = r*omega/V', tex: 'S = \\dfrac{r\\,\\omega}{V}',
      vars: {
        S: { name: 'spin parameter (surface speed ÷ flight speed)' },
        r: { name: 'ball radius', q: 'length', unit: 'mm', value: 21.35 },
        omega: { name: 'spin rate', q: 'angvel', unit: 'rpm', value: 2700, tex: '\\omega' },
        V: { name: 'flight speed', q: 'speed', unit: 'm/s', value: 70 }
      },
      note: 'Lift (Magnus) coefficients of balls rise with S: roughly 0.1–0.3 for S = 0.05–0.3.',
      stories: { S: 'A golf ball of radius {r} leaves the club at {V} with {omega} of backspin. What is its spin parameter?', omega: 'What spin rate gives a ball of radius {r} at {V} a spin parameter of {S}?' }
    },
    {
      name: 'Magnus (spin) force',
      expr: 'FL = 0.5*rho*V^2*A*CL', tex: 'F_L = \\tfrac{1}{2}\\,\\rho V^2 A\\, C_L',
      vars: {
        FL: { name: 'force across the flight path', q: 'force', unit: 'N', tex: 'F_L' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'flight speed', q: 'speed', unit: 'm/s', value: 70 },
        A: { name: 'cross-section of the ball', q: 'area', unit: 'cm²', value: 14.32 },
        CL: { name: 'lift coefficient from spin', value: 0.2, min: 0, max: 0.6, tex: 'C_L' }
      },
      note: 'Perpendicular to the flight path, towards the side where the ball\'s surface moves against the air (up for backspin, down for topspin).',
      stories: { FL: 'A ball of cross-section {A} flies at {V} with a spin lift coefficient of {CL} (air density {rho}). What is the Magnus force?' }
    },
    {
      name: 'Deceleration by drag',
      expr: 'a = rho*V^2*CD*A/(2*m)', tex: 'a = \\dfrac{\\rho V^2\\, C_D\\, A}{2m}',
      vars: {
        a: { name: 'deceleration', q: 'accel', unit: 'm/s²' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'speed', q: 'speed', unit: 'm/s', value: 70 },
        CD: { name: 'drag coefficient', value: 0.25, min: 0.05, max: 1.5, tex: 'C_D' },
        A: { name: 'cross-section of the ball', q: 'area', unit: 'cm²', value: 14.32 },
        m: { name: 'ball mass', q: 'mass', unit: 'g', value: 45.9 }
      },
      note: 'Drag ÷ mass. Compare with g = 9.81 m/s²: a golf ball just off the tee decelerates at more than 2 g.',
      practice: { unknowns: ['a', 'V', 'CD'] },
      stories: {
        a: 'A ball of {m} with a cross-section of {A} and C_D = {CD} flies at {V} (air density {rho}). How quickly is drag slowing it?',
        CD: 'A ball of {m} ({A} cross-section) slows at {a} while flying at {V} (air density {rho}). What is its drag coefficient?'
      }
    }
  ],
  examples: [
    {
      title: 'The forces on a golf drive',
      q: 'A golf ball (45.9 g, 42.7 mm) leaves the tee at 70 m/s with 2700 rpm of backspin. With $C_D = 0.25$ and $C_L = 0.2$, compare the drag and lift with its weight.',
      steps: [
        '$A = \\pi \\times 0.02135^2 = 1.43 \\times 10^{-3}$ m²; $q = \\tfrac12 \\times 1.225 \\times 70^2 = 3000$ Pa. Weight $0.0459 \\times 9.81 = 0.45$ N.',
        'Drag $3000 \\times 0.25 \\times 1.43 \\times 10^{-3} = 1.07$ N — 2.4 times the weight.',
        'Spin: $\\omega = 283$ rad/s, spin parameter $0.02135 \\times 283/70 = 0.086$. Lift $3000 \\times 0.2 \\times 1.43 \\times 10^{-3} = 0.86$ N — 1.9 times the weight.',
        'Reynolds number $70 \\times 0.0427/1.5 \\times 10^{-5} = 2.0 \\times 10^5$: well past the dimpled ball\'s crisis, but below a smooth ball\'s.'
      ],
      a: 'Drag ≈ 1.1 N and lift ≈ 0.9 N against a weight of 0.45 N: at launch the air dominates the ball\'s flight.'
    },
    {
      title: 'How far a free kick bends',
      q: 'A football (430 g, 22 cm) is struck at 28 m/s with sidespin of 8 turns a second. Taking $C_L = 0.25$, estimate the sideways force and how far the ball swerves over 25 m.',
      steps: [
        'Spin parameter $0.11 \\times 2\\pi \\times 8/28 = 0.20$, consistent with $C_L \\approx 0.25$.',
        '$A = 0.038$ m²; force $\\tfrac12 \\times 1.225 \\times 28^2 \\times 0.038 \\times 0.25 = 4.6$ N; sideways acceleration $4.6/0.43 = 10.6$ m/s².',
        'The ball takes about 1 s to travel 25 m, slowing as it goes, so the average sideways acceleration is nearer 8.5 m/s²: swerve $\\tfrac12 \\times 8.5 \\times 1^2 \\approx 4$ m.'
      ],
      a: 'A sideways force of about 4.6 N, bending the ball roughly 4 m over 25 m.'
    }
  ],
  quiz: [
    { q: 'Why are golf balls dimpled?', choices: ['dimples make the boundary layer turbulent, so it separates later and the wake — and the drag — shrink', 'dimples add lift by trapping air in them', 'to make the ball lighter', 'dimples reduce skin friction'], a: 0,
      why: 'A turbulent boundary layer carries more momentum near the surface and resists the rising pressure round the back; separation moves back and the pressure drag roughly halves.' },
    { q: 'A tennis ball hit with topspin…', choices: ['dips faster than a spinless ball, because the Magnus force points down', 'floats longer', 'curves sideways', 'has less drag'], a: 0,
      why: 'With topspin the top surface moves against the air; the wake is thrown up and the ball pushed down, so it can be hit hard and still land in.' },
    { q: 'A knuckleball moves erratically because…', choices: ['with almost no spin, the seams change the boundary layers on the two sides differently as the ball slowly turns, giving varying side forces', 'it is thrown very fast', 'its Magnus force is large', 'gravity varies along the path'], a: 0,
      why: 'Without spin to average things out, the random-looking position of the seams decides where each side separates, and the side force wanders.' },
    { q: 'What is the Reynolds number of a football (d = 0.22 m) at 20 m/s in air with ν = 1.5 × 10⁻⁵ m²/s?', answer: 293000, tol: 0.02,
      why: 'Re = Vd/ν = 20 × 0.22/1.5 × 10⁻⁵ = 2.93 × 10⁵ — right at the edge of a smooth sphere\'s drag crisis.' },
    { q: 'A smooth golf ball, hit exactly like a dimpled one, would fly further because smooth surfaces have less friction.', a: false,
      why: 'At driving speeds the smooth ball is below its drag crisis: C_D ≈ 0.5 instead of 0.25, and it also gets less lift from spin. It carries about half as far.' }
  ],
  problems: [
    { q: 'A table-tennis ball (2.7 g, 40 mm, C_D = 0.5) flies at 20 m/s in sea-level air. What is its deceleration from drag?', answer: 57.0, unit: 'm/s²', tol: 0.02,
      steps: ['$A = \\pi \\times 0.02^2 = 1.257 \\times 10^{-3}$ m².', '$a = 1.225 \\times 20^2 \\times 0.5 \\times 1.257 \\times 10^{-3}/(2 \\times 0.0027) = 57.0$ m/s² — nearly 6 g.'] }
  ],
  applications: ['Ball design and rules: dimple patterns, panel shapes and seams, fuzz and ball pressure.', 'Pitch and shot design using measured spin rates and spin axes.', 'Wind-tunnel and launch-monitor testing of balls, clubs and bats.', 'The flight of shuttlecocks, frisbees and javelins, each a small lesson in drag and lift.'],
  history: 'Isaac Newton remarked in 1672 that a tennis ball struck with a slice curves in the air. Gustav Magnus measured the sideways force on spinning cylinders in 1852, and Peter Guthrie Tait explained the long carry of a golf ball by its backspin in the 1890s. Golfers had noticed that old, nicked gutta-percha balls flew further than new smooth ones; patterned covers followed, and William Taylor patented the dimpled ball in 1905.',
  sim: 'drag-ball-flight'
},

{
  id: 'cycling-aero', parent: 'drag-everyday', title: 'Cycling and drafting', level: 1,
  short: 'On a flat road above about 15 km/h most of a cyclist\'s effort goes into pushing air. The power grows with the cube of speed, so position, clothing and above all riding in another rider\'s slipstream — drafting — decide races.',
  keywords: ['cycling aerodynamics', 'drafting', 'slipstream', 'peloton', 'CdA', 'time-trial position', 'aero bars', 'watts', 'power meter', 'rolling resistance', 'pace line', 'team pursuit', 'echelon', 'hour record', 'headwind'],
  prereq: ['drag-equation', 'physics:power', 'bluff-bodies'],
  related: ['vehicle-aerodynamics', 'streamlining', 'form-drag', 'terminal-velocity', 'wind-tunnel', 'air-density', 'physics:work-energy'],
  body: `
Ride along a flat road on a still day and three things resist you: the tyres (rolling resistance), the drivetrain (a few per cent) and the air. The first two hardly change with speed; the air grows with its square. Above about 15 km/h the air is the largest of them, and at racing speeds it takes 80–90 % of the effort. The power at the pedals is

$$P = \\frac{V}{\\eta}\\left[C_{rr}\\,mg + mg\\sin\\theta + \\tfrac12\\rho\\,C_DA\\,(V + V_w)^2\\right]$$

with $\\theta$ the slope, $V_w$ the headwind and $\\eta \\approx 0.97$ the drivetrain efficiency.

For a rider on a road bike with hands on the hoods ($C_DA \\approx 0.42$ m², 90 kg with the bike, $C_{rr} = 0.006$), 30 km/h on the flat needs about **200 W**: 150 W against the air and 45 W for the tyres, plus the drivetrain's share. At 40 km/h it takes 425 W, because the aerodynamic part has grown $(4/3)^3 = 2.4$ times. A fit amateur can hold 200–250 W for an hour; a professional 350–450 W.

| Riding position (rounded) | $C_DA$ | Power against the air at 40 km/h |
|---|---|---|
| Upright, city bike | 0.5–0.6 m² | 420–500 W |
| Road bike, hands on the hoods | 0.35–0.42 m² | 290–350 W |
| Road bike, hands on the drops | 0.30–0.35 m² | 250–290 W |
| Time-trial position with aero bars | 0.20–0.25 m² | 170–210 W |
| Elite track pursuit or hour-record position | 0.17–0.20 m² | 140–170 W |
| Fully faired recumbent | ≈ 0.03 m² | ≈ 25 W |

The rider makes roughly three-quarters of the drag, the bike the rest. So the biggest gains come from position — a flat back, narrow arms, head down — and then from clothing and equipment: a skinsuit, an aero helmet, deep or disc wheels. Every 0.01 m² saved is worth about 12 W at 45 km/h.

### Drafting
A rider close behind another sits in the slow, low-pressure wake and needs far less power. At half a wheel's length the second rider's drag falls by 35–45 %; the shelter fades with the gap but is still felt several metres back. Riders further down a line gain a little more, and the leader gains a little too — a few per cent — because the follower fills the low-pressure wake behind the leader's back. Deep inside a big bunch the drag can fall to a small fraction of a lone rider's.

This decides races. A breakaway of four riders sharing the lead can hold speeds no lone rider can; the team pursuit is a four-rider pace line that swaps the lead every lap or half-lap. In a crosswind the sheltered zone moves sideways, and riders fan out diagonally across the road in an **echelon** — those who find no place in it are dropped.

### Wind, slope and altitude
A headwind adds to the air speed but not to the ground speed: into a 5 m/s wind at 30 km/h the drag is two and a half times as large. On a climb the speed is low and the slope term dominates, so a kilogram matters more than aerodynamics. Thin air helps: at 2000 m the drag is about 18 % lower, which is why several hour records were ridden at altitude — the thin air offsetting the smaller supply of oxygen ([[air-density]]).

> [!tip] On the flat, drag area beats weight: saving 1 kg is worth under 1 W at 40 km/h, while 0.01 m² of drag area is worth about 8–9 W. On an 8 % climb at 15 km/h the ranking flips — the kilogram is worth 3.5 W, the drag area half a watt.
`,
  ideas: [
    'On the flat above about 15 km/h, air drag is the largest resistance a cyclist meets; at racing speeds it is 80–90 %.',
    'Aerodynamic power grows as V³: 30 km/h needs about 200 W, 40 km/h over 400 W.',
    'Position is the biggest lever: C_DA ranges from about 0.55 m² upright to under 0.2 m² in a pursuit tuck.',
    'Drafting cuts the follower\'s drag by 35–45 % at half a wheel, and helps the leader a little.',
    'Headwinds magnify drag; climbs make weight matter; thin air at altitude helps.'
  ],
  pitfalls: [
    'Most of the effort goes into the bike\'s weight and tyres — On the flat above 15–20 km/h air drag is the largest force; weight and rolling resistance dominate only on climbs and at low speed.',
    'Drafting only helps if you are right on the wheel — The shelter fades with the gap but is measurable several metres back; and the leader, too, gains a few per cent from a close follower.',
    'A 10 % faster rider needs 10 % more power — The aerodynamic power grows with the cube of speed: 10 % faster costs about 33 % more power against the air.'
  ],
  formulas: [
    {
      name: 'Power to ride on the flat',
      expr: 'P = (Crr*m*g + 0.5*rho*CdA*V^2)*V/eta', tex: 'P = \\dfrac{V}{\\eta}\\left(C_{rr}\\,mg + \\tfrac{1}{2}\\,\\rho\\,\\mathit{C_DA}\\,V^2\\right)',
      vars: {
        P: { name: 'power at the pedals', q: 'power', unit: 'W' },
        Crr: { name: 'rolling-resistance coefficient', value: 0.006, min: 0.001, max: 0.03, tex: 'C_{rr}' },
        m: { name: 'rider and bike mass', q: 'mass', unit: 'kg', value: 90 },
        g: { const: 'g' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        CdA: { name: 'drag area C_D·A', q: 'area', unit: 'm²', value: 0.42, tex: '\\mathit{C_DA}' },
        V: { name: 'speed (still air)', q: 'speed', unit: 'km/h', value: 30 },
        eta: { name: 'drivetrain efficiency', value: 0.97, min: 0.8, max: 1, tex: '\\eta' }
      },
      note: 'Level road, still air, steady speed. Racing tyres have C_rr ≈ 0.003–0.005, city tyres 0.006–0.01.',
      practice: { unknowns: ['P', 'V', 'CdA'] },
      stories: {
        P: 'A rider and bike of {m} (drag area {CdA}, C_rr = {Crr}, drivetrain {eta}) ride at {V} on the flat in air of density {rho}. What power must the rider give?',
        V: 'A rider and bike of {m} (drag area {CdA}, C_rr = {Crr}, drivetrain {eta}) put out {P} on the flat (air density {rho}). How fast do they go?',
        CdA: 'A power meter reads {P} at a steady {V} on the flat for a rider and bike of {m} (C_rr = {Crr}, drivetrain {eta}, air density {rho}). What is the drag area?'
      }
    },
    {
      name: 'Power against the air, with a headwind',
      expr: 'Pa = 0.5*rho*CdA*(V + Vw)^2*V', tex: 'P_a = \\tfrac{1}{2}\\,\\rho\\,\\mathit{C_DA}\\,(V + V_w)^2\\,V',
      vars: {
        Pa: { name: 'power spent on air drag', q: 'power', unit: 'W', tex: 'P_a' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        CdA: { name: 'drag area C_D·A', q: 'area', unit: 'm²', value: 0.42, tex: '\\mathit{C_DA}' },
        V: { name: 'ground speed', q: 'speed', unit: 'km/h', value: 30 },
        Vw: { name: 'headwind (negative: tailwind)', q: 'speed', unit: 'm/s', value: 3, min: -15, max: 25, signed: true, tex: 'V_w' }
      },
      note: 'Drag depends on the air speed V + V_w, the power on drag × ground speed. A tailwind faster than the rider pushes the rider along (negative drag).',
      practice: { unknowns: ['Pa', 'Vw'] },
      stories: {
        Pa: 'A rider with a drag area of {CdA} rides at {V} into a headwind of {Vw} (air density {rho}). How much power goes into the air?',
        Vw: 'A rider (drag area {CdA}) at {V} spends {Pa} on air drag (air density {rho}). What is the headwind?'
      }
    },
    {
      name: 'Power saved by drafting',
      expr: 'dP = 0.5*rho*CdA*(1 - r)*V^3/eta', tex: '\\Delta P = \\dfrac{\\tfrac{1}{2}\\,\\rho\\,\\mathit{C_DA}\\,(1 - r)\\,V^3}{\\eta}',
      vars: {
        dP: { name: 'power saved', q: 'power', unit: 'W', tex: '\\Delta P' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        CdA: { name: 'drag area riding alone', q: 'area', unit: 'm²', value: 0.28, tex: '\\mathit{C_DA}' },
        r: { name: 'drag in the draft ÷ drag riding alone', value: 0.62, min: 0.05, max: 1 },
        V: { name: 'speed (still air)', q: 'speed', unit: 'km/h', value: 45 },
        eta: { name: 'drivetrain efficiency', value: 0.975, min: 0.8, max: 1, tex: '\\eta' }
      },
      note: 'r ≈ 0.55–0.65 for the second wheel at a gap of half a wheel, rising towards 1 as the gap opens to several metres; ≈ 0.95–0.98 for a leader with a close follower.',
      stories: {
        dP: 'A rider (drag area {CdA} alone) sits on a wheel at {V}, where the drag is {r} of riding alone. How much power does drafting save (drivetrain {eta}, air density {rho})?',
        r: 'Drafting at {V} saves a rider (drag area {CdA}) {dP} (drivetrain {eta}, air density {rho}). What fraction of the solo drag does the follower still feel?'
      }
    }
  ],
  examples: [
    {
      title: '200 W at 30 km/h',
      q: 'A rider on a road bike ($C_DA = 0.42$ m², 90 kg with the bike, $C_{rr} = 0.006$, drivetrain 97 %) rides on the flat in still sea-level air. What power is needed at 30 km/h and at 40 km/h?',
      steps: [
        '30 km/h = 8.33 m/s. Air: $\\tfrac12 \\times 1.225 \\times 0.42 \\times 8.33^2 = 17.9$ N; tyres: $0.006 \\times 90 \\times 9.81 = 5.3$ N.',
        '$P = (17.9 + 5.3) \\times 8.33/0.97 = 199$ W — 77 % of it against the air.',
        '40 km/h = 11.1 m/s: air 31.8 N, tyres 5.3 N; $P = 37.1 \\times 11.1/0.97 = 425$ W.'
      ],
      a: 'About 200 W at 30 km/h and 425 W at 40 km/h.'
    },
    {
      title: 'Aero or weight?',
      q: 'Compare the power saved by losing 1 kg with that saved by cutting the drag area by 0.01 m², on the flat at 40 km/h and on an 8 % climb at 15 km/h ($C_{rr} = 0.006$).',
      steps: [
        'Flat, 11.1 m/s: 1 kg saves $0.006 \\times 9.81 \\times 11.1 = 0.65$ W; 0.01 m² saves $\\tfrac12 \\times 1.225 \\times 0.01 \\times 11.1^3 = 8.4$ W.',
        'Climb, 4.17 m/s, slope angle 4.6°: 1 kg saves $9.81 \\times (\\sin 4.6° + 0.006) \\times 4.17 = 3.5$ W; 0.01 m² saves $\\tfrac12 \\times 1.225 \\times 0.01 \\times 4.17^3 = 0.44$ W.'
      ],
      a: 'On the flat the drag area wins by a factor of 13; on the climb the kilogram wins by a factor of 8.'
    },
    {
      title: 'On the wheel at 45 km/h',
      q: 'In a pace line at 45 km/h, a rider with a solo drag area of 0.28 m² follows half a wheel behind, where the drag is 62 % of riding alone. How much power does drafting save (drivetrain 97.5 %, sea-level air)?',
      steps: [
        '45 km/h = 12.5 m/s, $V^3 = 1953$ m³/s³.',
        '$\\Delta P = \\tfrac12 \\times 1.225 \\times 0.28 \\times 0.38 \\times 1953/0.975 = 131$ W.'
      ],
      a: 'About 130 W — a third of the roughly 380 W the rider would need alone.'
    }
  ],
  quiz: [
    { q: 'A rider holds 30 km/h on 200 W. To ride at 40 km/h on the flat she needs about…', choices: ['2.1 times as much (≈ 425 W)', '4/3 as much (≈ 267 W)', '16/9 as much (≈ 355 W)', '4 times as much (≈ 800 W)'], a: 0,
      why: 'The air part grows as V³ (2.4×) and the tyre part as V (1.33×); weighted by their shares at 30 km/h that is about 2.1×.' },
    { q: 'The rider at the front of a pace line also gains a little from the rider behind. Why?', choices: ['the follower fills the low-pressure wake behind the leader, raising the pressure on the leader\'s back', 'the follower pushes air forward onto the leader', 'the leader is pulled along by the follower\'s bow wave', 'it does not — the leader gains nothing'], a: 0,
      why: 'Part of the leader\'s drag is base drag from the low-pressure wake. A body close behind raises that pressure, cutting the leader\'s drag by a few per cent.' },
    { q: 'What power goes into air drag alone for a rider with C_DA = 0.25 m² at 45 km/h in still sea-level air?', answer: 299, unit: 'W', tol: 0.02,
      why: 'P = ½ × 1.225 × 0.25 × 12.5³ = 0.153 × 1953 = 299 W.' },
    { q: 'On a steep climb at 12 km/h, reducing your drag area matters more than reducing your weight.', a: false,
      why: 'At 12 km/h the aerodynamic power is small (V³ is tiny), while lifting the weight up the slope takes most of the power.' },
    { q: 'In a crosswind, riders form an echelon — a diagonal line across the road. Why?', choices: ['the sheltered wake lies downwind and behind each rider, so it runs diagonally', 'to see the road ahead', 'the rules require it', 'to reduce rolling resistance'], a: 0,
      why: 'The wake trails along the direction of the air relative to the riders, which a crosswind swings to the side.' }
  ],
  problems: [
    { q: 'A rider with C_DA = 0.30 m² (85 kg with the bike, C_rr = 0.005, drivetrain 97 %) holds 300 W on the flat in still sea-level air. How fast does she ride?', answer: 39.6, unit: 'km/h', tol: 0.02,
      hint: 'Solve 300 × 0.97 = V(C_rr mg + ½ρC_DA V²) for V by trial.',
      steps: ['Wheel power $300 \\times 0.97 = 291$ W; rolling $0.005 \\times 85 \\times 9.81 = 4.17$ N; $\\tfrac12\\rho C_DA = 0.184$ kg/m.', 'Try $V = 11$ m/s: $(4.17 + 0.184 \\times 121) \\times 11 = 290$ W — just right.', '$V \\approx 11.0$ m/s = 39.6 km/h.'] }
  ],
  applications: ['Time-trial positions and equipment tested in wind tunnels and on velodromes with power meters.', 'Team tactics: pace lines, lead-outs, echelons and breakaways.', 'Commuting and e-bike range, where a headwind or an upright position costs a lot.', 'Human-powered speed records in faired recumbents.'],
  history: 'On 30 June 1899 Charles Murphy rode a mile in under a minute on a board track laid between the rails of the Long Island Rail Road, in the slipstream of a train with a hood built over its last carriage — "Mile-a-Minute Murphy". In the 1970s Chester Kyle measured the drag of cyclists by coasting tests and in wind tunnels, quantified drafting, and helped bring aerodynamic bikes, helmets and clothing into racing.',
  sim: ['drag-paceline', { id: 'drag-vehicles', params: { vehicle: 'road' } }]
}

);
