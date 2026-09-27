/* HYPER-AERODYNAMICS · content/viscous.js
 * Branch "Viscosity and Boundary Layers": the topics boundary-layers (no slip, the boundary layer,
 * laminar and turbulent layers, transition, skin friction) and separation-wakes (separation,
 * the drag crisis, vortex shedding, flow control, turbulence). Simulations: sims/viscous.js (visc-*). */
Hyper.add(

/* ================================================================ BOUNDARY LAYERS */
{
  id: 'no-slip', parent: 'boundary-layers', title: 'The no-slip condition', level: 1,
  short: 'Air touching a solid surface moves with the surface — relative to the wall it is at rest. This single fact creates the boundary layer, skin friction, separation and, in the end, both drag and lift.',
  keywords: ['no slip', 'no-slip condition', 'wall shear stress', 'velocity gradient', 'shear rate', 'slip flow', 'Knudsen number', 'mean free path', 'rarefied gas', 'dust on a car'],
  prereq: ['air-viscosity', 'what-is-a-fluid', 'physics:viscosity'],
  related: ['boundary-layer', 'skin-friction', 'dalembert-paradox', 'kutta-condition', 'navier-stokes', 'physics:mean-free-path'],
  body: `
Look at a car that has just driven a hundred kilometres along a motorway: the dust on its bonnet is still there. Air rushed over the paint at 30 m/s, yet a film of grime a few hundredths of a millimetre thick was never blown off. The reason is one of the most important facts in fluid mechanics: **a fluid in contact with a solid surface moves with the surface.** Relative to the wall, the air right at it is at rest. This is the **no-slip condition**.

### Why the air sticks
On the scale of molecules every surface is rough. A nitrogen molecule that strikes it bounces off in a direction that has nothing to do with the way it arrived, so the molecules leaving the wall carry, on average, no memory of the stream: they leave with the wall's velocity. They then collide with their neighbours a little further out and slow them down, and those slow the next layer. That exchange of momentum between neighbouring layers is [[air-viscosity|viscosity]] (see [[physics:viscosity]]). For water on a clean surface the details differ — molecular attraction plays a part — but the result is the same.

### From the wall to the stream
The speed must climb from zero at the wall to the full stream speed $U$ further out, so next to every surface there is a region of strong shear: the [[boundary-layer|boundary layer]]. Shearing a fluid takes a force, and by Newton's law of viscosity the stress on the wall is

$$\\tau_w = \\mu \\left(\\frac{\\partial u}{\\partial y}\\right)_{\\!w}$$

Air is not very viscous ($\\mu \\approx 1.8\\times10^{-5}$ Pa·s), but the velocity gradients at a wall are enormous. On the roof of a car at 30 m/s, 2 m behind the windscreen, the gradient at the surface is about 87 000 per second: the air speed rises by nearly 0.9 m/s in the first hundredth of a millimetre. The wall stress that results, about 1.6 Pa, is tiny — but spread over the whole skin of a vehicle it is the [[skin-friction|skin-friction drag]].

> [!key] Everything viscous in aerodynamics — skin friction, boundary layers, separation, stall, the drag crisis, even the circulation that lets a wing lift — follows from air refusing to slip over surfaces.

### When air does slip
No-slip is a statement about the average of very many molecular collisions. It holds when the **mean free path** $\\lambda$ — the distance a molecule travels between collisions, about 68 nm in sea-level air ([[physics:mean-free-path]]) — is tiny compared with the size $L$ of the flow. Their ratio is the **Knudsen number**, $\\mathrm{Kn} = \\lambda/L$:

| Kn | Regime | Example |
|---|---|---|
| below 0.001 | continuum, no slip | aircraft, cars, wind tunnels ($\\mathrm{Kn} \\sim 10^{-8}$) |
| 0.001 to 0.1 | slip flow: a small velocity jump at the wall | micro-channels in MEMS devices; a re-entry capsule near 80–100 km |
| 0.1 to 10 | transitional | the same capsule higher up, around 120 km |
| above 10 | free-molecular: no boundary layer at all | satellites; the few-nanometre gap under a hard-disk read head |

In ordinary aerodynamics no-slip is as safe as any law in engineering.

### What it rules out
A frictionless fluid would slide freely along a wall. That is the world of [[potential-flow-basics|potential flow]], which gives beautiful pressure distributions but no drag at all — [[dalembert-paradox|d'Alembert's paradox]]. No-slip is the missing ingredient: it creates vorticity at every wall, and with it friction, wakes and — through the [[kutta-condition|Kutta condition]] at a sharp trailing edge — lift.
`,
  ideas: [
    'Air touching a surface moves with the surface: relative to the wall its velocity is zero.',
    'The speed must rise from zero to the stream speed across a thin layer, so the shear at every wall is intense.',
    'Wall shear stress τ_w = μ (du/dy) at the wall: a small viscosity times a huge velocity gradient.',
    'No-slip fails only when molecules travel far between collisions compared with the size of the flow — a Knudsen number above about 0.001.'
  ],
  pitfalls: [
    'Only sticky liquids such as oil cling to surfaces; air is too thin to — Air obeys the no-slip condition exactly as oil does. Its low viscosity makes the sheared layer thin, not absent.',
    'In a turbulent boundary layer the mixing is so strong that the air slides over the wall — Turbulent eddies cannot reach the wall itself; right at the surface there is still a thin viscous sublayer in which the speed falls to zero.',
    'The air next to a wall is slow and therefore unimportant — The shear there is the strongest anywhere in the flow; it is where friction drag is made and where the vorticity of wakes and lift is born.'
  ],
  formulas: [
    {
      name: 'Shear stress at a wall (Newton\'s law of viscosity)',
      expr: 'tauw = mu*dudy', tex: '\\tau_w = \\mu\\,\\dot{\\gamma}_w',
      vars: {
        tauw: { name: 'wall shear stress', q: 'stress', unit: 'Pa', tex: '\\tau_w' },
        mu: { name: 'dynamic viscosity of the air', q: 'viscosity', unit: 'mPa·s', value: 0.0179, tex: '\\mu' },
        dudy: { name: 'velocity gradient at the wall, du/dy', q: 'rate', unit: '1/s', value: 87000, tex: '\\dot{\\gamma}_w' }
      },
      note: 'The velocity gradient at the wall is the shear rate γ̇ = ∂u/∂y at y = 0. Air at 15 °C has μ = 1.79 × 10⁻⁵ Pa·s = 0.0179 mPa·s; water at 20 °C about 1.0 mPa·s.',
      stories: {
        tauw: 'Air of viscosity {mu} has a velocity gradient of {dudy} at the roof of a car. What shear stress does it put on the paint?',
        dudy: 'The wall shear stress on a plate is {tauw} in air of viscosity {mu}. How steep is the velocity gradient at the surface?'
      }
    },
    {
      name: 'Kinematic viscosity',
      expr: 'nu = mu/rho', tex: '\\nu = \\frac{\\mu}{\\rho}',
      vars: {
        nu: { name: 'kinematic viscosity', q: 'kinvisc', unit: 'm²/s', tex: '\\nu' },
        mu: { name: 'dynamic viscosity', q: 'viscosity', unit: 'mPa·s', value: 0.0179, tex: '\\mu' },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' }
      },
      note: 'ν is the diffusivity of momentum: it sets how fast the effect of the wall spreads into the flow. Sea-level air (ISA) 1.46 × 10⁻⁵ m²/s; water at 20 °C 1.0 × 10⁻⁶ m²/s — fifteen times smaller, although water is 55 times more viscous.',
      stories: { nu: 'What is the kinematic viscosity of a fluid of viscosity {mu} and density {rho}?' }
    },
    {
      name: 'Knudsen number',
      expr: 'Kn = lam/L', tex: '\\mathrm{Kn} = \\frac{\\lambda}{L}',
      vars: {
        Kn: { name: 'Knudsen number', tex: '\\mathrm{Kn}' },
        lam: { name: 'mean free path of the gas molecules', q: 'length', unit: 'nm', value: 68, tex: '\\lambda' },
        L: { name: 'size of the flow (channel width, body length)', q: 'length', unit: 'µm', value: 10 }
      },
      note: 'Kn < 0.001: continuum flow with no slip; 0.001–0.1: slip flow; 0.1–10: transitional; above 10: free-molecular. The mean free path is about 68 nm at sea level and grows as the density falls.',
      stories: {
        Kn: 'Air with a mean free path of {lam} flows through a channel {L} wide. What is the Knudsen number — does the no-slip condition hold?',
        L: 'Slip effects start to matter at a Knudsen number of {Kn}. For a gas with a mean free path of {lam}, below what channel size is that?'
      }
    }
  ],
  examples: [
    {
      title: 'The breeze a dust grain feels',
      q: 'On the roof of a car at 30 m/s the wall shear stress 2 m behind the windscreen is about 1.55 Pa. Air has $\\mu = 1.79\\times10^{-5}$ Pa·s. Very close to the wall the velocity rises linearly (the viscous sublayer, about 0.06 mm thick here). How fast is the air moving 10 µm above the paint?',
      steps: [
        'The velocity gradient at the wall: $\\partial u/\\partial y = \\tau_w/\\mu = 1.55/(1.79\\times10^{-5}) = 86\\,600\\ \\mathrm{s^{-1}}$.',
        'In the linear sublayer $u = (\\partial u/\\partial y)\\, y = 86\\,600 \\times 10\\times10^{-6} = 0.87$ m/s.',
        'The car moves at 30 m/s (108 km/h), but a grain of dust 10 µm across sits in a breeze of about 3 km/h — far too weak to lift it off.'
      ],
      a: 'About 0.9 m/s — one thirty-fifth of the car\'s speed. That is why dust survives the motorway.'
    },
    {
      title: 'Does air slip under a hard-disk head?',
      q: 'The read head of a hard disk flies on a film of air a few nanometres thick — say 5 nm. The mean free path of air at room conditions is about 68 nm. Can the air film be treated as a continuum with no slip?',
      steps: [
        '$\\mathrm{Kn} = \\lambda/L = 68/5 \\approx 14$.',
        'That is above 10: the free-molecular regime. Molecules cross the gap from disk to head without meeting one another.',
        'Designers therefore use gas-bearing equations corrected for rarefaction, not the ordinary no-slip lubrication theory. For a 1 mm gap, by contrast, $\\mathrm{Kn} = 7\\times10^{-5}$ and no-slip is perfect.'
      ],
      a: 'No — Kn ≈ 14, a rarefied (free-molecular) flow. No-slip holds only when Kn is below about 0.001.'
    }
  ],
  quiz: [
    { q: 'An aircraft flies at 250 m/s. Relative to its skin, how fast is the air that is in direct contact with the skin moving?', choices: ['250 m/s', 'about half of 250 m/s', 'zero', 'it depends on whether the boundary layer is laminar or turbulent'], a: 2,
      why: 'The no-slip condition: the air touching the surface moves with it, whatever the flight speed and whatever the state of the boundary layer. The full 250 m/s is reached only at the edge of the boundary layer.' },
    { q: 'Turbulent mixing is so strong that in a turbulent boundary layer the air slips over the wall.', a: false,
      why: 'Eddies cannot penetrate the wall. Right at the surface a thin viscous sublayer remains, with zero velocity at the wall and a steep linear rise — steeper than in a laminar layer, which is why turbulent skin friction is larger.' },
    { q: 'Air ($\\mu = 1.79\\times10^{-5}$ Pa·s) has a velocity gradient of 50 000 s⁻¹ at a wall. What is the wall shear stress?', answer: 0.895, unit: 'Pa',
      why: '$\\tau_w = \\mu\\, \\partial u/\\partial y = 1.79\\times10^{-5} \\times 50\\,000 = 0.895$ Pa.' },
    { q: 'For which of these flows would you question the no-slip condition?', choices: ['air over the 1 mm wing of a small insect', 'air in a channel 1 µm wide at sea-level pressure', 'water in a garden hose', 'air over a glider wing at 12 000 m'], a: 1,
      why: 'Kn = 68 nm / 1 µm ≈ 0.07: the slip-flow regime. The insect wing has Kn ≈ 7 × 10⁻⁵; even at 12 000 m, where the mean free path is about four times longer, a wing is deep in the continuum regime.' }
  ],
  problems: [
    { q: 'At the trailing edge of a laminar plate the wall shear stress is 0.12 Pa in sea-level air ($\\mu = 1.79\\times10^{-5}$ Pa·s). What is the velocity gradient at the wall, in s⁻¹?', answer: 6700, unit: '1/s', tol: 0.02,
      steps: ['$\\partial u/\\partial y = \\tau_w/\\mu = 0.12/(1.79\\times10^{-5})$.', '$= 6700\\ \\mathrm{s^{-1}}$: the speed rises by 0.067 m/s in the first 10 µm.'] }
  ],
  applications: [
    'Why dust, pollen and insect remains stay on moving cars, fan blades and wings.',
    'The skin-friction drag of every vehicle, and the search for low-friction surfaces.',
    'Micro-fluidic chips, MEMS devices and hard-disk air bearings, where slip must be taken into account.',
    'Re-entry and very-high-altitude aerodynamics, where the air becomes rarefied and the boundary layer thins out into free-molecular flow.'
  ],
  history: 'Whether a fluid slips at a wall was argued about for most of the nineteenth century. Navier (1823) allowed a slip proportional to the wall shear; Stokes (1845) weighed both possibilities. The agreement between the no-slip theory of flow in narrow tubes and the careful measurements of Hagen and Poiseuille (around 1840) settled it for liquids, and Maxwell (1879) showed from the kinetic theory of gases that a gas slips by only about one mean free path — negligible except in rarefied flow.',
  sim: 'visc-plate-bl'
},

{
  id: 'boundary-layer', parent: 'boundary-layers', title: 'The boundary layer', level: 2,
  short: 'The thin layer next to a surface where the air speed climbs from zero to the full stream and all the friction lives. Prandtl\'s 1904 idea of splitting a flow into this viscous layer and a frictionless outer stream made aerodynamics a practical science.',
  keywords: ['boundary layer', 'Prandtl', 'boundary layer thickness', 'displacement thickness', 'momentum thickness', 'shape factor', 'momentum integral', 'Reynolds number', 'delta 99', 'viscous layer'],
  prereq: ['no-slip', 'reynolds-number', 'air-viscosity'],
  related: ['laminar-boundary-layer', 'turbulent-boundary-layer', 'transition', 'skin-friction', 'flow-separation', 'panel-methods', 'potential-flow-basics', 'navier-stokes'],
  body: `
In 1904 Ludwig Prandtl, then 29, read a short paper at a mathematics congress in Heidelberg that changed fluid mechanics. Air and water have small viscosity, so for a century mathematicians had solved flows without it — and predicted no drag at all ([[dalembert-paradox|d'Alembert's paradox]]), while engineers measured drag with empirical tables. Prandtl's insight: **viscosity matters only in a thin layer next to the surface.** Outside it the flow behaves as if frictionless; inside it the speed climbs from zero (the [[no-slip]] condition) to the outer speed, and all the friction lives there.

### How thick?
Vorticity made at the wall spreads outward by viscous diffusion, the way heat soaks into a cold slab: in a time $t$ it reaches a depth of about $\\sqrt{\\nu t}$, where $\\nu = \\mu/\\rho$ is the kinematic viscosity ($1.46\\times10^{-5}$ m²/s for sea-level air). Air that has travelled a distance $x$ along a surface has been in contact with it for a time $x/U$, so the layer grows like

$$\\delta \\sim \\sqrt{\\frac{\\nu x}{U}} \\quad\\Longrightarrow\\quad \\frac{\\delta}{x} \\sim \\frac{1}{\\sqrt{\\mathrm{Re}_x}}, \\qquad \\mathrm{Re}_x = \\frac{U x}{\\nu}$$

The [[reynolds-number|Reynolds number]] based on distance runs into the millions on aircraft, so the layer is thin: millimetres to centimetres.

| Where | Speed | Distance $x$ | $\\mathrm{Re}_x$ | Thickness $\\delta$ |
|---|---|---|---|---|
| Model glider wing | 8 m/s | 0.1 m | $5.5\\times10^4$ | 2.1 mm (laminar) |
| Light-aircraft wing, near the nose | 50 m/s | 0.1 m | $3.4\\times10^5$ | 0.85 mm (laminar) |
| Same wing, trailing edge | 50 m/s | 1.5 m | $5.1\\times10^6$ | ≈ 25 mm (turbulent) |
| Car roof, rear edge | 30 m/s | 3 m | $6.2\\times10^6$ | ≈ 49 mm (turbulent) |
| Airliner fuselage at the tail, cruising at 11 km | 250 m/s | 40 m | $2.6\\times10^8$ | ≈ 0.3 m |
| Ship hull at the stern (sea water) | 10 m/s | 150 m | $1.3\\times10^9$ | ≈ 0.8 m |

### Three thicknesses
The edge of the layer is fuzzy, so its thickness $\\delta$ is taken where the speed reaches 99 % of $U$. Two integral thicknesses are more useful:

- The **displacement thickness** $\\delta^* = \\int_0^\\infty \\left(1 - \\frac{u}{U}\\right) dy$ is how far the slow air seems to push the wall out into the stream: the outer flow sees a body fatter by $\\delta^*$.
- The **momentum thickness** $\\theta = \\int_0^\\infty \\frac{u}{U}\\left(1 - \\frac{u}{U}\\right) dy$ measures the momentum the air has lost to friction. The friction drag of a flat plate, per metre of width and per side, is exactly $D' = \\rho U^2 \\theta$, with $\\theta$ taken at the trailing edge.

Their ratio, the **shape factor** $H = \\delta^*/\\theta$, describes the health of the profile: 2.59 for a laminar layer on a flat plate, about 1.3 for a turbulent one, and rising towards 2.5–3.5 as a layer approaches [[flow-separation|separation]].

### Why the split works
Across the thin layer the pressure hardly changes ($\\partial p/\\partial y \\approx 0$): the outer, frictionless flow imposes its pressure right down onto the wall. That is why an inviscid [[panel-methods|panel method]] predicts the pressures and lift of a wing well — until the layer separates. The layer itself obeys simplified equations that can be marched downstream, and one integral balance, von Kármán's momentum integral, ties its growth to the wall friction $c_f$ and to the outer speed $U(x)$:

$$\\frac{d\\theta}{dx} + (2 + H)\\,\\frac{\\theta}{U}\\frac{dU}{dx} = \\frac{c_f}{2}$$

A falling outer speed ($dU/dx < 0$, a rising pressure) thickens the layer quickly; an accelerating one keeps it thin.

### Laminar or turbulent
Near a leading edge the layer is smooth and [[laminar-boundary-layer|laminar]]. Further back, typically beyond $\\mathrm{Re}_x \\approx 5\\times10^5$, it goes through [[transition]] and becomes [[turbulent-boundary-layer|turbulent]] — thicker, with several times the [[skin-friction|skin friction]], but far harder to separate. Much of viscous aerodynamics is the story of which kind of layer covers how much of a surface.
`,
  ideas: [
    'Viscosity matters only in a thin layer at the surface; outside it the flow is effectively frictionless.',
    'The layer grows downstream as vorticity diffuses: δ/x ∝ 1/√Re_x when laminar, so it is millimetres to centimetres thick on aircraft.',
    'Displacement thickness δ* is how far the outer flow is pushed away; momentum thickness θ measures the momentum lost to friction — the drag.',
    'The shape factor H = δ*/θ tells the health of the layer: 2.6 laminar, 1.3 turbulent, above about 2.5 near separation.',
    'Pressure is nearly constant across the layer, so the outer inviscid flow sets the pressure on the wall.'
  ],
  pitfalls: [
    'The boundary layer is a layer of stagnant air carried along with the body — The speed rises continuously from zero at the wall to the stream speed at the edge; the layer is thin, sheared and constantly renewed by fresh air arriving from upstream.',
    'The boundary layer has a sharp edge at δ — The speed approaches the outer value smoothly; δ is a convention (99 % of U). The integral thicknesses δ* and θ are the well-defined measures.',
    'A thicker boundary layer means a higher pressure on the wall — The pressure is passed through the layer almost unchanged; thickness matters through displacement (a slightly fatter body) and through the risk of separation.'
  ],
  formulas: [
    {
      name: 'Reynolds number based on distance',
      expr: 'Rex = U*x/nu', tex: '\\mathrm{Re}_x = \\frac{U\\, x}{\\nu}',
      vars: {
        Rex: { name: 'Reynolds number based on distance', tex: '\\mathrm{Re}_x' },
        U: { name: 'free-stream speed', q: 'speed', unit: 'm/s', value: 50 },
        x: { name: 'distance from the leading edge', q: 'length', unit: 'm', value: 0.1 },
        nu: { name: 'kinematic viscosity', q: 'kinvisc', unit: 'm²/s', value: 1.46e-5, tex: '\\nu' }
      },
      note: 'Sea-level air (ISA): ν = 1.46 × 10⁻⁵ m²/s; air at 11 000 m about 3.9 × 10⁻⁵; water at 20 °C 1.0 × 10⁻⁶. On a smooth flat plate the layer usually turns turbulent near Re_x ≈ 5 × 10⁵.',
      stories: {
        Rex: 'Air of kinematic viscosity {nu} flows at {U} over a plate. What is the Reynolds number {x} from the leading edge?',
        x: 'A laminar layer is expected to turn turbulent where the Reynolds number reaches {Rex}. How far from the leading edge is that, at {U} in air of kinematic viscosity {nu}?'
      }
    },
    {
      name: 'Laminar boundary-layer thickness (Blasius)',
      expr: 'delta = 5*x/sqrt(U*x/nu)', tex: '\\delta = 5.0\\,\\sqrt{\\frac{\\nu\\, x}{U}}',
      vars: {
        delta: { name: 'boundary-layer thickness (99 %)', q: 'length', unit: 'mm', tex: '\\delta' },
        x: { name: 'distance from the leading edge', q: 'length', unit: 'm', value: 0.1 },
        U: { name: 'free-stream speed', q: 'speed', unit: 'm/s', value: 50 },
        nu: { name: 'kinematic viscosity', q: 'kinvisc', unit: 'm²/s', value: 1.46e-5, tex: '\\nu' }
      },
      note: 'Equivalent to δ = 5.0 x/√Re_x. For a laminar layer on a flat plate with no pressure gradient (the exact Blasius value is 4.91). The thickness grows as √x and shrinks as 1/√U.',
      practice: { unknowns: ['delta', 'x', 'U'] },
      stories: {
        delta: 'How thick is the laminar boundary layer {x} from the leading edge of a plate in a stream of {U}, with ν = {nu}?',
        x: 'At {U} (ν = {nu}), how far from the leading edge has a laminar boundary layer grown to {delta}?'
      }
    },
    {
      name: 'Turbulent boundary-layer thickness (1/7-power law)',
      expr: 'delta = 0.37*x/(U*x/nu)^0.2', tex: '\\delta = 0.37\\, x \\left(\\frac{\\nu}{U\\, x}\\right)^{1/5}',
      vars: {
        delta: { name: 'boundary-layer thickness (99 %)', q: 'length', unit: 'mm', tex: '\\delta' },
        x: { name: 'distance from the leading edge', q: 'length', unit: 'm', value: 3 },
        U: { name: 'free-stream speed', q: 'speed', unit: 'm/s', value: 30 },
        nu: { name: 'kinematic viscosity', q: 'kinvisc', unit: 'm²/s', value: 1.46e-5, tex: '\\nu' }
      },
      note: 'Equivalent to δ = 0.37 x/Re_x^{1/5}, for a layer turbulent from the leading edge, 5 × 10⁵ < Re_x < 10⁷. It grows as x^{4/5} — much faster than a laminar layer.',
      stories: {
        delta: 'How thick is the turbulent boundary layer at the rear of a car roof, {x} from the windscreen, at {U} (ν = {nu})?',
        U: 'A turbulent boundary layer {x} from the leading edge is {delta} thick in air with ν = {nu}. How fast is the stream?'
      }
    },
    {
      name: 'Friction drag from the momentum thickness',
      expr: 'Dp = rho*U^2*theta', tex: 'D\' = \\rho\\, U^2 \\theta',
      vars: {
        Dp: { name: 'friction drag per metre of width, one side', unit: 'N/m', tex: 'D\'' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        U: { name: 'free-stream speed', q: 'speed', unit: 'm/s', value: 10 },
        theta: { name: 'momentum thickness at the trailing edge', q: 'length', unit: 'mm', value: 0.567, tex: '\\theta' }
      },
      note: 'For a flat plate with no pressure gradient, laminar or turbulent: the momentum missing from the wake is exactly the drag. A wake survey behind a wing uses the same idea.',
      stories: {
        Dp: 'At the trailing edge of a plate in a {U} stream (density {rho}) the momentum thickness is {theta}. What is the friction drag per metre of width on that side?',
        theta: 'A plate in a {U} stream (density {rho}) has a friction drag of {Dp} per metre of width on one side. What is the momentum thickness at its trailing edge?'
      }
    }
  ],
  examples: [
    {
      title: 'The boundary layer on a light-aircraft wing',
      q: 'A light aircraft flies at 50 m/s at sea level ($\\nu = 1.46\\times10^{-5}$ m²/s). How thick is the boundary layer 10 cm behind the leading edge, where it is laminar, and at the trailing edge 1.5 m back, where it is turbulent? (Treat the wing as a flat plate.)',
      steps: [
        'At 10 cm: $\\mathrm{Re}_x = 50 \\times 0.1/1.46\\times10^{-5} = 3.42\\times10^5$, so $\\sqrt{\\mathrm{Re}_x} = 585$.',
        'Laminar: $\\delta = 5.0 \\times 0.1/585 = 8.5\\times10^{-4}$ m = 0.85 mm — thinner than a credit card.',
        'At 1.5 m: $\\mathrm{Re}_x = 5.14\\times10^6$ and $\\mathrm{Re}_x^{1/5} = 21.96$.',
        'Turbulent: $\\delta = 0.37 \\times 1.5/21.96 = 0.0253$ m = 25 mm.'
      ],
      a: 'About 0.85 mm near the nose and 25 mm at the trailing edge — thirty times thicker, partly from the extra distance and mostly because the layer has turned turbulent.'
    },
    {
      title: 'Drag from the momentum thickness',
      q: 'A smooth plate 0.5 m long sits in a 10 m/s stream of sea-level air. The layer is laminar all the way, with $\\theta = 0.664\\,x/\\sqrt{\\mathrm{Re}_x}$. What is the friction drag per metre of width on one side?',
      steps: [
        '$\\mathrm{Re}_L = 10 \\times 0.5/1.46\\times10^{-5} = 3.42\\times10^5$; $\\sqrt{\\mathrm{Re}_L} = 585$.',
        '$\\theta = 0.664 \\times 0.5/585 = 5.67\\times10^{-4}$ m = 0.567 mm.',
        '$D\' = \\rho U^2 \\theta = 1.225 \\times 100 \\times 5.67\\times10^{-4} = 0.0695$ N/m.',
        'Check with the friction coefficient: $C_f = 1.328/585 = 0.00227$, and $C_f\\,q\\,L = 0.00227 \\times 61.25 \\times 0.5 = 0.0695$ N/m.'
      ],
      a: 'About 0.07 N per metre of width on each side — the momentum missing from a layer just over half a millimetre thick.'
    }
  ],
  quiz: [
    { q: 'At a fixed distance from the leading edge, the speed of the stream over a plate is quadrupled. The laminar boundary layer there becomes…', choices: ['four times thicker', 'twice as thick', 'half as thick', 'a quarter as thick'], a: 2,
      why: 'δ ∝ √(νx/U): four times the speed gives 1/√4 = half the thickness. The air spends a quarter as long in contact with the wall, and diffusion depth goes as the square root of time.' },
    { q: 'Across a thin boundary layer the pressure is nearly the same as at its outer edge.', a: true,
      why: 'This is the key simplification of boundary-layer theory: ∂p/∂y ≈ 0. The outer, inviscid flow therefore sets the pressure on the wall, which is why inviscid methods predict wing pressures well until separation.' },
    { q: 'How thick is the laminar boundary layer 0.2 m from the leading edge of a plate in a 20 m/s stream of sea-level air ($\\nu = 1.46\\times10^{-5}$ m²/s)? Answer in millimetres.', answer: 1.91, unit: 'mm',
      why: '$\\mathrm{Re}_x = 20 \\times 0.2/1.46\\times10^{-5} = 2.74\\times10^5$, $\\sqrt{\\mathrm{Re}_x} = 523$, $\\delta = 5.0 \\times 0.2/523 = 1.91$ mm.' },
    { q: 'Which thickness of a boundary layer is directly proportional to the friction drag of a flat plate?', choices: ['the 99 % thickness δ', 'the displacement thickness δ*', 'the momentum thickness θ', 'the thickness of the viscous sublayer'], a: 2,
      why: 'D\' = ρU²θ: the momentum thickness measures the momentum removed from the flow, and that momentum is what the plate took as drag. δ* measures displaced mass flow, not momentum.' },
    { q: 'A shape factor H = δ*/θ of 1.3 at some point on a wing suggests…', choices: ['a healthy turbulent boundary layer', 'a laminar layer on a flat plate', 'a layer about to separate', 'no boundary layer at all'], a: 0,
      why: 'H ≈ 1.3 is typical of a turbulent layer with little pressure gradient. A laminar flat-plate layer has 2.59, and values above about 2.5 warn of separation.' }
  ],
  problems: [
    { q: 'Air at 11 000 m ($\\nu = 3.9\\times10^{-5}$ m²/s) flows at 250 m/s along an airliner fuselage. Estimate the turbulent boundary-layer thickness 40 m from the nose, in metres.', answer: 0.308, unit: 'm', tol: 0.03,
      steps: ['$\\mathrm{Re}_x = 250 \\times 40/3.9\\times10^{-5} = 2.56\\times10^8$.', '$\\mathrm{Re}_x^{1/5} = 48.0$.', '$\\delta = 0.37 \\times 40/48.0 = 0.31$ m.'] }
  ],
  applications: [
    'Estimating skin-friction drag and its share of an aircraft\'s total drag.',
    'Placing air intakes and pitot tubes outside the boundary layer, or bleeding the layer off before an engine inlet.',
    'Correcting inviscid wing calculations with the displacement thickness (viscous–inviscid interaction).',
    'Heat transfer from surfaces, which is controlled by the same thin layer.'
  ],
  history: 'Prandtl presented "On fluid motion with very small friction" at the International Congress of Mathematicians in Heidelberg in August 1904 — eight pages, with sketches from a hand-cranked water channel. His students carried it through: Blasius solved the flat-plate layer in 1908, von Kármán and Pohlhausen gave the momentum-integral method in 1921, and Göttingen became the centre of aerodynamics for three decades.',
  sim: 'visc-plate-bl'
},

{
  id: 'laminar-boundary-layer', parent: 'boundary-layers', title: 'The laminar boundary layer', level: 2,
  short: 'A smooth, orderly boundary layer whose profile Blasius solved exactly in 1908: thickness 5x/√Re_x, displacement thickness 1.72x/√Re_x, momentum thickness 0.664x/√Re_x and very low skin friction — but little resistance to separation.',
  keywords: ['laminar boundary layer', 'Blasius', 'similarity solution', 'velocity profile', 'displacement thickness', 'momentum thickness', 'shape factor 2.59', 'skin friction coefficient', 'Thwaites method', 'laminar flow'],
  prereq: ['boundary-layer', 'reynolds-number', 'math:differential-equations'],
  related: ['turbulent-boundary-layer', 'transition', 'skin-friction', 'flow-separation', 'special-airfoils', 'reynolds-effects-airfoil'],
  body: `
Near the leading edge of any smooth surface the air in the boundary layer moves in thin sheets that slide over one another without mixing — a **laminar** boundary layer. It is the only boundary layer that can be calculated exactly, and it is the one aircraft designers work hardest to keep, because its friction is several times smaller than that of a turbulent layer.

### Blasius's solution
In 1908 Paul Richard Heinrich Blasius, a student of Prandtl, noticed that the laminar layer on a flat plate is *self-similar*: the velocity profiles at every station have the same shape if the height $y$ is measured in units of $\\sqrt{\\nu x/U}$. With $\\eta = y\\sqrt{U/(\\nu x)}$ the partial differential equations of the layer collapse to one ordinary [[math:differential-equations|differential equation]] for a stream function $f(\\eta)$,

$$f''' + \\tfrac{1}{2} f f'' = 0, \\qquad f(0) = f'(0) = 0,\\; f'(\\infty) = 1,$$

and the speed is $u/U = f'(\\eta)$. Solved numerically, it gives one universal profile:

| $\\eta = y\\sqrt{U/\\nu x}$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| $u/U$ | 0 | 0.330 | 0.630 | 0.846 | 0.956 | 0.992 | 0.999 |

The profile is nearly straight near the wall and rounds off smoothly into the stream. Everything else follows from it:

| Quantity | Blasius flat plate |
|---|---|
| Thickness (99 %) | $\\delta = 4.91\\,x/\\sqrt{\\mathrm{Re}_x} \\approx 5.0\\,x/\\sqrt{\\mathrm{Re}_x}$ |
| Displacement thickness | $\\delta^* = 1.721\\,x/\\sqrt{\\mathrm{Re}_x}$ |
| Momentum thickness | $\\theta = 0.664\\,x/\\sqrt{\\mathrm{Re}_x}$ |
| Shape factor | $H = 2.59$ |
| Local skin friction | $c_f = \\tau_w/q = 0.664/\\sqrt{\\mathrm{Re}_x}$ |
| Average over a plate of length $L$ | $C_f = 1.328/\\sqrt{\\mathrm{Re}_L}$ |

### What the numbers say
The thickness grows as $\\sqrt{x}$ and the wall shear falls as $1/\\sqrt{x}$ — largest at the leading edge, where the fresh layer is thinnest. The drag of a laminar plate grows as $U^{3/2}$, not $U^2$, and as $\\sqrt{L}$: doubling the length adds only 41 % more drag, because the back half works in an already thickened, gentler layer. On a sailplane wing 30 cm behind the nose at 30 m/s, the layer is 1.9 mm thick with a wall shear of only 0.47 Pa.

### Pressure gradients
Real wings do not have constant outer speed. An accelerating stream (falling pressure) thins the layer and makes its profile fuller and more stable; a decelerating one fattens it, makes the profile S-shaped and pushes it towards [[flow-separation|separation]]. **Thwaites' method** (1949) handles any outer speed $U(x)$ in one line,

$$\\theta^2 = \\frac{0.45\\,\\nu}{U^6}\\int_0^x U^5\\, dx,$$

and predicts laminar separation where $\\lambda = (\\theta^2/\\nu)\\, dU/dx$ falls to about $-0.09$.

> [!key] A laminar layer is a low-friction layer but a fragile one. It separates under a pressure rise that a turbulent layer would shrug off — which is why a smooth ball has *more* drag than a dimpled one ([[drag-crisis]]), and why low-speed wings often suffer laminar separation bubbles.

### Where laminar flow matters
At low Reynolds numbers — insects, birds, model aircraft, small drones — the boundary layer is laminar over most of the surface (see [[reynolds-effects-airfoil]]). On sailplanes and business jets, **laminar-flow airfoils** ([[special-airfoils]]) are shaped to keep the pressure falling over the front 50–60 % of the chord, so that [[transition]] is delayed and friction drag is cut by a third or more. The price is sensitivity: insects, rain and roughness at the leading edge trip the layer early.
`,
  ideas: [
    'The laminar flat-plate layer is self-similar: one universal profile u/U = f′(η) with η = y√(U/νx) (Blasius, 1908).',
    'δ ≈ 5.0x/√Re_x, δ* = 1.721x/√Re_x, θ = 0.664x/√Re_x, H = 2.59.',
    'Local skin friction c_f = 0.664/√Re_x — largest at the leading edge; average C_f = 1.328/√Re_L.',
    'Laminar friction is low but the layer separates easily under a rising pressure (Thwaites: λ ≈ −0.09).',
    'Laminar-flow wings keep the pressure falling to delay transition and cut friction drag.'
  ],
  pitfalls: [
    'A laminar boundary layer has the same thickness everywhere on a plate — It grows as √x: four times further back it is twice as thick.',
    'A laminar layer is always better — Its friction is lower, but it separates much more easily in a rising pressure; a turbulent layer is often deliberately triggered to avoid separation.',
    'Laminar-plate drag grows as the square of speed, like the drag equation suggests — The coefficient itself falls as 1/√Re, so the drag grows only as U^{3/2}.'
  ],
  derivation: {
    title: 'The momentum integral with a simple profile',
    intro: 'Guess a profile shape and let von Kármán\'s momentum balance fix its thickness — Pohlhausen\'s idea, which comes within 10 % of the exact answer.',
    steps: [
      { text: 'Assume a parabolic profile inside the layer, with η = y/δ:', tex: '\\frac{u}{U} = 2\\eta - \\eta^2 \\quad (0 \\le \\eta \\le 1)' },
      { text: 'Integrate for the momentum thickness and differentiate at the wall for the shear:', tex: '\\theta = \\int_0^\\delta \\frac{u}{U}\\left(1 - \\frac{u}{U}\\right) dy = \\frac{2}{15}\\,\\delta, \\qquad \\tau_w = \\mu\\,\\frac{2U}{\\delta}' },
      { text: 'With no pressure gradient the momentum integral is dθ/dx = τ_w/(ρU²):', tex: '\\frac{2}{15}\\frac{d\\delta}{dx} = \\frac{2\\nu}{U\\,\\delta}' },
      { text: 'Separate and integrate from the leading edge, where δ = 0:', tex: '\\delta^2 = \\frac{30\\,\\nu x}{U} \\quad\\Longrightarrow\\quad \\delta = \\frac{5.48\\, x}{\\sqrt{\\mathrm{Re}_x}}' },
      { text: 'The skin friction follows:', tex: 'c_f = \\frac{2\\tau_w}{\\rho U^2} = \\frac{4\\nu}{U\\delta} = \\frac{0.730}{\\sqrt{\\mathrm{Re}_x}}' }
    ],
    outro: 'Blasius\'s exact values are 5.0 (4.91) and 0.664: a guessed profile gets the scaling exactly right and the constants within 10 %.'
  },
  formulas: [
    {
      name: 'Displacement thickness',
      expr: 'dstar = 1.721*x/sqrt(U*x/nu)', tex: '\\delta^* = \\frac{1.721\\, x}{\\sqrt{U x/\\nu}}',
      vars: {
        dstar: { name: 'displacement thickness', q: 'length', unit: 'mm', tex: '\\delta^*' },
        x: { name: 'distance from the leading edge', q: 'length', unit: 'm', value: 0.3 },
        U: { name: 'free-stream speed', q: 'speed', unit: 'm/s', value: 30 },
        nu: { name: 'kinematic viscosity', q: 'kinvisc', unit: 'm²/s', value: 1.46e-5, tex: '\\nu' }
      },
      note: 'Blasius flat plate, laminar, no pressure gradient. About a third of the 99 % thickness.',
      stories: { dstar: 'By how much does a laminar boundary layer displace the outer flow {x} behind the leading edge of a sailplane wing at {U} (ν = {nu})?' }
    },
    {
      name: 'Momentum thickness',
      expr: 'theta = 0.664*x/sqrt(U*x/nu)', tex: '\\theta = \\frac{0.664\\, x}{\\sqrt{U x/\\nu}}',
      vars: {
        theta: { name: 'momentum thickness', q: 'length', unit: 'mm', tex: '\\theta' },
        x: { name: 'distance from the leading edge', q: 'length', unit: 'm', value: 0.3 },
        U: { name: 'free-stream speed', q: 'speed', unit: 'm/s', value: 30 },
        nu: { name: 'kinematic viscosity', q: 'kinvisc', unit: 'm²/s', value: 1.46e-5, tex: '\\nu' }
      },
      note: 'Blasius flat plate. The shape factor is H = δ*/θ = 1.721/0.664 = 2.59.',
      stories: { theta: 'What is the momentum thickness of the laminar layer {x} from the leading edge in a {U} stream (ν = {nu})?' }
    },
    {
      name: 'Wall shear stress in a laminar layer',
      expr: 'tauw = 0.332*rho*U^2/sqrt(U*x/nu)', tex: '\\tau_w = \\frac{0.332\\,\\rho U^2}{\\sqrt{U x/\\nu}}',
      vars: {
        tauw: { name: 'wall shear stress', q: 'stress', unit: 'Pa', tex: '\\tau_w' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        U: { name: 'free-stream speed', q: 'speed', unit: 'm/s', value: 30 },
        x: { name: 'distance from the leading edge', q: 'length', unit: 'm', value: 0.3 },
        nu: { name: 'kinematic viscosity', q: 'kinvisc', unit: 'm²/s', value: 1.46e-5, tex: '\\nu' }
      },
      note: 'Equivalent to the local skin-friction coefficient c_f = τ_w/(½ρU²) = 0.664/√Re_x. It falls as 1/√x along the plate.',
      stories: { tauw: 'What shear stress does a laminar layer put on a surface {x} behind the leading edge, at {U} in air of density {rho} (ν = {nu})?' }
    },
    {
      name: 'Friction drag of a laminar plate (one side)',
      expr: 'D = 0.664*rho*U^2*b*L/sqrt(U*L/nu)', tex: 'D = \\frac{0.664\\,\\rho U^2\\, b\\, L}{\\sqrt{U L/\\nu}}',
      vars: {
        D: { name: 'friction drag, one side', q: 'force', unit: 'N' },
        rho: { name: 'fluid density', q: 'density', unit: 'kg/m³', value: 998, tex: '\\rho' },
        U: { name: 'stream speed', q: 'speed', unit: 'm/s', value: 1 },
        b: { name: 'plate width', q: 'length', unit: 'm', value: 0.2 },
        L: { name: 'plate length along the flow', q: 'length', unit: 'm', value: 0.3 },
        nu: { name: 'kinematic viscosity', q: 'kinvisc', unit: 'm²/s', value: 1.0e-6, tex: '\\nu' }
      },
      note: 'D = C_f · ½ρU² · bL with C_f = 1.328/√Re_L; valid while the whole plate stays laminar (Re_L below about 5 × 10⁵). The starting values are water at 20 °C.',
      practice: { unknowns: ['D', 'U'] },
      stories: {
        D: 'A plate {b} wide and {L} long is towed at {U} through water (density {rho}, ν = {nu}). What laminar friction drag acts on one side?',
        U: 'A laminar plate {b} wide and {L} long in a fluid of density {rho} (ν = {nu}) feels {D} of friction on one side. How fast is it moving?'
      }
    }
  ],
  examples: [
    {
      title: 'The laminar layer on a sailplane wing',
      q: 'A sailplane flies at 30 m/s at sea level. Its laminar-flow wing keeps the boundary layer laminar well past 30 cm from the leading edge. Treating that front part as a flat plate, find $\\delta$, $\\delta^*$, $\\theta$ and the wall shear stress at $x = 0.3$ m.',
      steps: [
        '$\\mathrm{Re}_x = 30 \\times 0.3/1.46\\times10^{-5} = 6.16\\times10^5$; $\\sqrt{\\mathrm{Re}_x} = 785$.',
        '$\\delta = 5.0 \\times 0.3/785 = 1.91$ mm; $\\delta^* = 1.721 \\times 0.3/785 = 0.66$ mm; $\\theta = 0.664 \\times 0.3/785 = 0.254$ mm.',
        '$\\tau_w = 0.332 \\times 1.225 \\times 30^2/785 = 0.47$ Pa.',
        'A turbulent layer at the same place ($c_f = 0.0592/\\mathrm{Re}_x^{1/5} = 0.0041$) would have a shear stress of about 2.3 Pa — nearly five times as much.'
      ],
      a: 'δ ≈ 1.9 mm, δ* ≈ 0.66 mm, θ ≈ 0.25 mm and τ_w ≈ 0.47 Pa.'
    },
    {
      title: 'Towing a plate in a water tank',
      q: 'A thin plate 0.3 m long and 0.2 m wide is towed edgewise at 1 m/s through water ($\\rho = 998$ kg/m³, $\\nu = 1.0\\times10^{-6}$ m²/s). Is the layer laminar, and what is the total friction drag on both sides?',
      steps: [
        '$\\mathrm{Re}_L = 1 \\times 0.3/1.0\\times10^{-6} = 3.0\\times10^5$ — below about $5\\times10^5$, so laminar in a quiet tank.',
        '$C_f = 1.328/\\sqrt{3\\times10^5} = 1.328/548 = 0.00242$.',
        'One side: $D = C_f\\, \\tfrac12\\rho U^2\\, bL = 0.00242 \\times 499 \\times 0.06 = 0.0726$ N.',
        'Both sides: 0.145 N — about the weight of 15 grams.'
      ],
      a: 'Laminar (Re_L = 3 × 10⁵); about 0.15 N for both sides together.'
    }
  ],
  quiz: [
    { q: 'At four times the distance from the leading edge, the laminar boundary layer is…', choices: ['four times as thick', 'twice as thick', 'the same thickness', '√2 times as thick'], a: 1,
      why: 'δ ∝ √x, so 4x gives √4 = 2 times the thickness.' },
    { q: 'Where on a laminar flat plate is the wall shear stress largest?', choices: ['at the leading edge', 'in the middle', 'at the trailing edge', 'it is the same everywhere'], a: 0,
      why: 'τ_w ∝ 1/√x: the layer is thinnest at the leading edge, so the velocity gradient there is steepest. (The formula gives infinity at x = 0, but the integral — the drag — stays finite.)' },
    { q: 'What is the local skin-friction coefficient of a laminar layer at $\\mathrm{Re}_x = 10^5$?', answer: 0.0021,
      why: '$c_f = 0.664/\\sqrt{10^5} = 0.664/316 = 0.0021$.' },
    { q: 'Plotted against $y/\\sqrt{\\nu x/U}$, the laminar velocity profiles at every station along a flat plate fall on one curve.', a: true,
      why: 'That is Blasius\'s similarity: one profile shape, stretched according to the local thickness.' },
    { q: 'A laminar plate is towed twice as fast. Its friction drag becomes about…', choices: ['2 times as large', '2.83 times as large', '4 times as large', '1.41 times as large'], a: 1,
      why: 'D = 0.664ρU²bL/√(UL/ν) ∝ U^{3/2}; 2^{1.5} = 2.83. The coefficient falls as 1/√U while the dynamic pressure rises as U².' }
  ],
  problems: [
    { q: 'At what distance from the leading edge is the laminar layer on a plate 3 mm thick, in a 5 m/s stream of sea-level air ($\\nu = 1.46\\times10^{-5}$ m²/s)? Use $\\delta = 5.0\\sqrt{\\nu x/U}$.', answer: 0.123, unit: 'm', tol: 0.02,
      steps: ['$\\delta^2 = 25\\,\\nu x/U$, so $x = \\delta^2 U/(25\\nu)$.', '$x = (0.003)^2 \\times 5/(25 \\times 1.46\\times10^{-5}) = 4.5\\times10^{-5}/3.65\\times10^{-4} = 0.123$ m.'] }
  ],
  applications: [
    'Laminar-flow airfoils on sailplanes, business jets and wind-turbine blades.',
    'Model aircraft, drones, insects and birds, whose low Reynolds numbers keep much of the layer laminar.',
    'Heat and mass transfer from surfaces, which follow the same similarity laws (heat-sink fins, evaporation).',
    'Calibrating wind tunnels and checking computer codes against the exact Blasius profile.'
  ],
  history: 'Blasius published his solution in his 1908 doctoral thesis at Göttingen, at 24 — the first exact result of Prandtl\'s boundary-layer theory, found with hand-computed series. He soon left research to teach engineering in Hamburg, where he worked for the rest of his career. Thwaites\'s quick method for any pressure gradient came in 1949.',
  sim: { id: 'visc-plate-bl', params: { mode: 'laminar' } }
},

{
  id: 'turbulent-boundary-layer', parent: 'boundary-layers', title: 'The turbulent boundary layer', level: 3,
  short: 'A churning boundary layer full of eddies: thicker than a laminar one, with a full, blunt velocity profile, three to eight times the skin friction — and far more resistance to separation. Near the wall it follows the universal log law.',
  keywords: ['turbulent boundary layer', 'one-seventh power law', '1/7 power law', 'log law', 'law of the wall', 'viscous sublayer', 'friction velocity', 'wall units', 'y plus', 'streaks', 'bursts', 'roughness'],
  prereq: ['boundary-layer', 'transition', 'laminar-boundary-layer'],
  related: ['skin-friction', 'turbulence', 'flow-separation', 'flow-control', 'turbulence-models', 'cfd'],
  body: `
Past [[transition]], the boundary layer is filled with eddies of every size, from its whole thickness down to fractions of a millimetre. They carry fast air from the outer part down towards the wall and slow air up and out. That mixing reshapes everything: the layer grows faster, its profile becomes blunt and full, the wall shear rises, and — the saving grace — the fast air stirred down to the wall lets it climb pressure rises that would separate a laminar layer.

### A layer in layers
A turbulent boundary layer has an inner and an outer structure. Near the wall only viscosity and the wall stress $\\tau_w$ matter, and they define a velocity and a length:

$$u_\\tau = \\sqrt{\\tau_w/\\rho}, \\qquad \\ell_\\nu = \\frac{\\nu}{u_\\tau}$$

the **friction velocity** and the **viscous length**. Measured in these "wall units" ($u^+ = u/u_\\tau$, $y^+ = y u_\\tau/\\nu$) every smooth-wall turbulent layer looks the same:

| Region | Where | Velocity |
|---|---|---|
| Viscous sublayer | $y^+ < 5$ | $u^+ = y^+$ (linear, as in laminar flow) |
| Buffer layer | $5 < y^+ < 30$ | blends the two; turbulence is produced most strongly here |
| Log layer | $30 < y^+$, up to about $0.2\\,\\delta$ | $u^+ = \\frac{1}{\\kappa}\\ln y^+ + B$, with $\\kappa \\approx 0.41$, $B \\approx 5.0$ |
| Outer (wake) region | the rest, up to $\\delta$ | depends on the pressure gradient and history |

On a car roof 3 m behind the windscreen at 30 m/s, $\\tau_w \\approx 1.4$ Pa, $u_\\tau \\approx 1.08$ m/s and the viscous length is 13.5 µm: the viscous sublayer is only 0.07 mm thick, inside a layer 49 mm thick. The famous **log law** (von Kármán, 1930) is one of the most robust results in fluid mechanics, and every turbulence model used in [[cfd|CFD]] is built to reproduce it.

### The engineer's shortcut: the 1/7-power law
For the outer 90 % of the layer a simple power law fits remarkably well:

$$\\frac{u}{U} = \\left(\\frac{y}{\\delta}\\right)^{1/7}$$

Combined with the momentum integral it gives the growth and friction of a layer turbulent from the leading edge:

| Quantity | Turbulent flat plate (5 × 10⁵ < Re_x < 10⁷) |
|---|---|
| Thickness | $\\delta = 0.37\\,x/\\mathrm{Re}_x^{1/5}$ — grows as $x^{4/5}$ |
| Displacement thickness | $\\delta^* = \\delta/8$ |
| Momentum thickness | $\\theta = 7\\delta/72$ |
| Shape factor | $H = 9/7 \\approx 1.3$ |
| Local skin friction | $c_f = 0.0592/\\mathrm{Re}_x^{1/5}$ |

The power law has an infinite slope at the wall, so it cannot give the wall stress itself — that comes from the friction law. Compared with a laminar layer at the same $\\mathrm{Re}_x = 10^6$, the turbulent layer is about 4.7 times thicker and has 5.6 times the local skin friction.

> [!key] Turbulence trades friction for toughness. The full profile carries more momentum close to the wall, so a turbulent layer can climb a much steeper pressure rise before it [[flow-separation|separates]] — the reason golf balls have dimples and many wings carry turbulators.

### Inside the eddies
The wall region is not random. Low-speed **streaks**, about 100 wall units apart, lift up, oscillate and burst, sweeping fast fluid down in their place; hairpin-shaped vortices lean downstream through the log layer. These cycles produce most of the turbulence — and most of the drag — and are what [[flow-control|riblets]] interfere with.

### Rough walls
Roughness smaller than the viscous sublayer ($k^+ = k u_\\tau/\\nu < 5$) has no effect: the wall is "hydraulically smooth". Bigger roughness pokes through, sheds its own wakes, and raises the friction; above $k^+ \\approx 70$ the friction no longer depends on viscosity at all ("fully rough"). On an airliner at cruise the admissible roughness is only about 15 µm — a good paint finish, not a bad one.
`,
  ideas: [
    'Turbulent eddies mix fast air down to the wall: the profile is full and blunt, the wall shear high.',
    'Near the wall every turbulent layer is universal in wall units: viscous sublayer u⁺ = y⁺, then the log law u⁺ = (1/κ) ln y⁺ + B.',
    'Engineering estimates use the 1/7-power law: δ = 0.37x/Re_x^{1/5}, c_f = 0.0592/Re_x^{1/5}, H ≈ 1.3.',
    'Turbulent layers have several times the friction of laminar ones but resist separation far better.',
    'Roughness matters only when it pokes through the viscous sublayer (k⁺ > 5).'
  ],
  pitfalls: [
    'Turbulence right at the wall makes the velocity there non-zero — The no-slip condition still holds; a thin viscous sublayer, a few hundredths of a millimetre thick, carries the speed to zero.',
    'The 1/7-power law gives the wall shear stress from its slope at the wall — Its slope at the wall is infinite; the wall stress must come from a separate friction law or from the log law.',
    'A turbulent layer is just a laminar one with noise added — Its mean profile, growth rate (x^{4/5} instead of √x), friction and resistance to separation are all different.'
  ],
  formulas: [
    {
      name: 'Turbulent boundary-layer thickness',
      expr: 'delta = 0.37*x/(U*x/nu)^0.2', tex: '\\delta = \\frac{0.37\\, x}{(U x/\\nu)^{1/5}}',
      vars: {
        delta: { name: 'boundary-layer thickness (99 %)', q: 'length', unit: 'mm', tex: '\\delta' },
        x: { name: 'distance from the leading edge', q: 'length', unit: 'm', value: 3 },
        U: { name: 'free-stream speed', q: 'speed', unit: 'm/s', value: 30 },
        nu: { name: 'kinematic viscosity', q: 'kinvisc', unit: 'm²/s', value: 1.46e-5, tex: '\\nu' }
      },
      note: 'For a smooth flat plate, turbulent from the leading edge, 5 × 10⁵ < Re_x < 10⁷.',
      stories: {
        delta: 'How thick is the turbulent boundary layer {x} from the front of a car roof at {U}, in air with ν = {nu}?',
        x: 'How far along a smooth plate in a {U} stream (ν = {nu}) has a turbulent layer grown to {delta}?'
      }
    },
    {
      name: 'The 1/7-power velocity profile',
      expr: 'u = U*(y/delta)^(1/7)', tex: 'u = U\\left(\\frac{y}{\\delta}\\right)^{1/7}',
      vars: {
        u: { name: 'speed at height y', q: 'speed', unit: 'm/s' },
        U: { name: 'speed at the edge of the layer', q: 'speed', unit: 'm/s', value: 30 },
        y: { name: 'height above the wall', q: 'length', unit: 'mm', value: 5 },
        delta: { name: 'boundary-layer thickness', q: 'length', unit: 'mm', value: 48.7, tex: '\\delta' }
      },
      note: 'Good for the outer 90 % of the layer (not in the viscous sublayer). Valid only for 0 ≤ y ≤ δ.',
      practice: { unknowns: ['u', 'y'] },
      stories: {
        u: 'In a turbulent layer {delta} thick with an edge speed of {U}, how fast is the air {y} above the wall?',
        y: 'In a turbulent layer {delta} thick with an edge speed of {U}, at what height does the air reach {u}?'
      }
    },
    {
      name: 'Friction velocity',
      expr: 'utau = sqrt(tauw/rho)', tex: 'u_\\tau = \\sqrt{\\frac{\\tau_w}{\\rho}}',
      vars: {
        utau: { name: 'friction velocity', q: 'speed', unit: 'm/s', tex: 'u_\\tau' },
        tauw: { name: 'wall shear stress', q: 'stress', unit: 'Pa', value: 1.43, tex: '\\tau_w' },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' }
      },
      note: 'The velocity scale of the near-wall turbulence, typically 3–5 % of the stream speed. The viscous length is ν/u_τ, and y⁺ = y u_τ/ν.',
      stories: {
        utau: 'The wall shear stress under a turbulent layer is {tauw} in air of density {rho}. What is the friction velocity?',
        tauw: 'A friction velocity of {utau} is measured in air of density {rho}. What is the wall shear stress?'
      }
    },
    {
      name: 'The log law of the wall',
      expr: 'u = utau*(ln(y*utau/nu)/kappa + B)', tex: 'u = u_\\tau\\left(\\frac{1}{\\kappa}\\ln\\frac{y\\, u_\\tau}{\\nu} + B\\right)',
      vars: {
        u: { name: 'mean speed at height y', q: 'speed', unit: 'm/s' },
        utau: { name: 'friction velocity', q: 'speed', unit: 'm/s', value: 1.08, tex: 'u_\\tau' },
        y: { name: 'height above the wall', q: 'length', unit: 'mm', value: 1 },
        nu: { name: 'kinematic viscosity', q: 'kinvisc', unit: 'm²/s', value: 1.46e-5, tex: '\\nu' },
        kappa: { name: 'von Kármán constant', value: 0.41, fixed: true, tex: '\\kappa' },
        B: { name: 'log-law intercept (smooth wall)', value: 5.0, fixed: true }
      },
      note: 'Valid in the log layer, y⁺ = y u_τ/ν from about 30 up to roughly 0.2δ. Measuring u at two heights and fitting this law is a standard way to find the wall stress.',
      practice: { unknowns: ['u', 'y'] },
      stories: {
        u: 'In a turbulent layer with a friction velocity of {utau} (ν = {nu}), what is the mean speed {y} above the wall?',
        y: 'With a friction velocity of {utau} (ν = {nu}), at what height does the log law give a speed of {u}?'
      }
    }
  ],
  examples: [
    {
      title: 'The turbulent layer on a car roof',
      q: 'A car drives at 30 m/s. Treat its roof as a flat plate with a turbulent layer from the windscreen. At $x = 3$ m find $\\delta$, the wall shear stress, the friction velocity and the thickness of the viscous sublayer.',
      steps: [
        '$\\mathrm{Re}_x = 30 \\times 3/1.46\\times10^{-5} = 6.16\\times10^6$; $\\mathrm{Re}_x^{1/5} = 22.8$.',
        '$\\delta = 0.37 \\times 3/22.8 = 0.0487$ m = 49 mm.',
        '$c_f = 0.0592/22.8 = 0.00260$; $\\tau_w = c_f\\, \\tfrac12\\rho U^2 = 0.00260 \\times 551 = 1.43$ Pa.',
        '$u_\\tau = \\sqrt{1.43/1.225} = 1.08$ m/s; viscous length $\\nu/u_\\tau = 13.5$ µm.',
        'The sublayer ($y^+ < 5$) is $5 \\times 13.5 = 68$ µm thick — less than a thousandth of the layer.'
      ],
      a: 'δ ≈ 49 mm, τ_w ≈ 1.4 Pa, u_τ ≈ 1.08 m/s, and a viscous sublayer only about 0.07 mm thick.'
    },
    {
      title: 'Power law against log law',
      q: 'In the car-roof layer above ($U = 30$ m/s, $\\delta = 48.7$ mm, $u_\\tau = 1.08$ m/s), estimate the speed 1 mm above the roof with both the 1/7-power law and the log law.',
      steps: [
        'Power law: $u = 30 \\times (1/48.7)^{1/7} = 30 \\times 0.574 = 17.2$ m/s.',
        'Log law: $y^+ = 0.001 \\times 1.08/1.46\\times10^{-5} = 74$, inside the log layer.',
        '$u = 1.08 \\times (\\ln 74/0.41 + 5.0) = 1.08 \\times (10.50 + 5.0) = 16.8$ m/s.'
      ],
      a: 'About 17 m/s either way — already more than half the stream speed only 1 mm from the wall. That is what a "full" profile means.'
    }
  ],
  quiz: [
    { q: 'Compared with a laminar layer at the same Reynolds number, a turbulent boundary layer has…', choices: ['lower wall shear and a thinner profile', 'higher wall shear and a fuller profile', 'the same wall shear but a thicker profile', 'higher wall shear and is more likely to separate'], a: 1,
      why: 'Mixing brings fast air close to the wall: the profile is fuller, the gradient at the wall steeper (more friction), and the layer resists separation better, not worse.' },
    { q: 'In the turbulent layer on a car roof at motorway speed, the viscous sublayer is roughly…', choices: ['a few centimetres thick', 'a few millimetres thick', 'a few hundredths of a millimetre thick', 'absent: turbulence reaches the wall'], a: 2,
      why: 'y⁺ < 5 with a viscous length ν/u_τ of about 13 µm gives roughly 0.07 mm, inside a layer about 50 mm thick.' },
    { q: 'The wall shear stress under a turbulent layer in sea-level air ($\\rho = 1.225$ kg/m³) is 2 Pa. What is the friction velocity, in m/s?', answer: 1.28, unit: 'm/s',
      why: '$u_\\tau = \\sqrt{2/1.225} = 1.28$ m/s.' },
    { q: 'A turbulent flat-plate boundary layer grows as $x^{4/5}$, faster than the $x^{1/2}$ of a laminar one.', a: true,
      why: 'δ = 0.37x/Re_x^{1/5} ∝ x^{4/5}. Mixing spreads the effect of the wall outward much faster than molecular diffusion.' },
    { q: 'Which shape factor H = δ*/θ fits a turbulent flat-plate layer?', choices: ['about 1.3', 'about 2.6', 'about 3.5', 'exactly 1'], a: 0,
      why: 'The 1/7 law gives δ* = δ/8 and θ = 7δ/72, so H = 9/7 ≈ 1.29. Laminar layers have 2.59; H above about 2.5 signals separation.' }
  ],
  problems: [
    { q: 'In a turbulent layer 30 mm thick with an edge speed of 40 m/s, estimate the speed 3 mm from the wall with the 1/7-power law.', answer: 28.8, unit: 'm/s', tol: 0.02,
      steps: ['$u = U (y/\\delta)^{1/7} = 40 \\times (0.1)^{1/7}$.', '$(0.1)^{1/7} = 0.720$, so $u = 28.8$ m/s.'] }
  ],
  applications: [
    'Friction-drag estimates for aircraft, cars, ships and pipelines — almost all at turbulent Reynolds numbers.',
    'Wall functions and y⁺ targets for meshing in CFD.',
    'Sizing vortex generators, turbulators and riblets from δ and the wall units.',
    'Specifying surface finish: the admissible roughness of paint, rivets and hull coatings.'
  ],
  history: 'Prandtl derived the 1/7-power law in the early 1920s from Blasius\'s 1913 friction law for pipes; von Kármán and Prandtl found the logarithmic law of the wall around 1930. Coles added the "law of the wake" for the outer region in 1956, and in 1967 Kline and colleagues at Stanford filmed hydrogen-bubble lines revealing the near-wall streaks and bursts.',
  sim: { id: 'visc-plate-bl', params: { mode: 'tripped' } }
},

{
  id: 'transition', parent: 'boundary-layers', title: 'Transition to turbulence', level: 2,
  short: 'Where and how a smooth laminar boundary layer turns turbulent — on a flat plate typically near Re_x ≈ 5 × 10⁵, but anywhere from 10⁵ to 3 × 10⁶ depending on free-stream turbulence, pressure gradient, roughness and noise.',
  keywords: ['transition', 'laminar to turbulent', 'critical Reynolds number', 'Tollmien-Schlichting waves', 'turbulent spots', 'bypass transition', 'free-stream turbulence', 'roughness', 'trip strip', 'turbulator', 'intermittency', 'natural laminar flow'],
  prereq: ['laminar-boundary-layer', 'reynolds-number', 'boundary-layer'],
  related: ['turbulent-boundary-layer', 'skin-friction', 'drag-crisis', 'turbulence', 'special-airfoils', 'wind-tunnel', 'flow-control'],
  body: `
Osborne Reynolds showed in 1883, with a thread of dye in a glass pipe, that a smooth flow becomes turbulent when the dimensionless group now named after him grows too large. A boundary layer does the same: near the leading edge it is laminar; as it thickens its local Reynolds number grows, it loses its stability, and somewhere downstream it breaks into turbulence. **Where** that happens decides the skin friction of a wing, the drag of a ball and whether a flow separates.

### How a layer breaks down
In a quiet stream the route is slow and orderly ("natural transition"):

1. Above a critical value — about $\\mathrm{Re}_{\\delta^*} = 520$, or $\\mathrm{Re}_x \\approx 9\\times10^4$ on a flat plate — tiny disturbances in the layer grow as travelling waves, the **Tollmien–Schlichting waves**, a few boundary-layer thicknesses long.
2. The waves amplify over a long distance, then become three-dimensional and form Λ-shaped vortices.
3. These break into **turbulent spots** — arrowhead patches of turbulence that appear at random, grow as they are swept downstream and merge.
4. When the spots cover the surface the layer is fully turbulent. The transition zone is typically as long as the laminar run before it.

On a smooth flat plate in ordinary air the layer is usually turbulent by $\\mathrm{Re}_x \\approx 5\\times10^5$ — the figure quoted everywhere. In very quiet conditions it can stay laminar to $3\\times10^6$.

### What moves it
| Influence | Effect | Example |
|---|---|---|
| Free-stream turbulence $\\mathrm{Tu} = u'/U$ | strong: above 1 % the waves are skipped ("bypass transition") | turbomachinery (Tu 5–10 %) goes turbulent almost at once |
| Pressure gradient | a falling pressure (accelerating flow) stabilises; a rising one destabilises | laminar-flow airfoils keep the pressure falling over 50–60 % of the chord |
| Roughness | a bump trips the layer when $\\mathrm{Re}_k = u_k k/\\nu$ exceeds roughly 600 | insect remains on a wing's leading edge; the grit of a trip strip |
| Noise and vibration | sound and panel vibration feed the waves | engines, propeller wash |
| Sweep | crossflow vortices on swept wings | limits natural laminar flow on airliner wings |

A widely used fit to measurements on flat plates (Abu-Ghannam and Shaw, 1980) gives the momentum-thickness Reynolds number at the start of transition as $\\mathrm{Re}_\\theta = 163 + e^{\\,6.91 - \\mathrm{Tu}}$ (Tu in per cent). With $\\mathrm{Re}_\\theta = 0.664\\sqrt{\\mathrm{Re}_x}$ for a laminar layer:

| Tu | 0.1 % | 0.3 % | 0.5 % | 1 % | 2 % | 3 % |
|---|---|---|---|---|---|---|
| $\\mathrm{Re}_{x,\\mathrm{tr}}$ | $2.6\\times10^6$ | $1.9\\times10^6$ | $1.3\\times10^6$ | $6.4\\times10^5$ | $2.0\\times10^5$ | $1.0\\times10^5$ |

A good low-turbulence wind tunnel has Tu of a few hundredths of a per cent; the atmosphere in smooth air at altitude is quieter still, so flight tests often show *longer* laminar runs than tunnels.

### Tripping it on purpose
Sometimes a turbulent layer is wanted: to avoid a laminar separation bubble on a glider wing or a model, to make a wind-tunnel model behave like the full-size aircraft at a higher Reynolds number, or to delay separation on a ball ([[drag-crisis]]). Engineers then fix transition with a strip of grit, a zig-zag tape or a row of small holes — a **trip** or **turbulator**.

> [!warn] Contamination — insects, rain, and above all ice and frost — can trip or disrupt the boundary layer and change an aircraft's lift and drag, sometimes markedly on laminar-flow sections. This page explains the physics only; real operations follow the aircraft's approved flight manual, training and the rules of the air.
`,
  ideas: [
    'A laminar layer becomes unstable above Re_x ≈ 9 × 10⁴ (Tollmien–Schlichting waves); on a smooth plate it is usually turbulent by Re_x ≈ 5 × 10⁵.',
    'The route: growing waves, three-dimensional vortices, random turbulent spots, then merging into a turbulent layer.',
    'Free-stream turbulence, adverse pressure gradients, roughness, noise and sweep bring transition forward; a falling pressure delays it.',
    'Roughness trips the layer when Re_k = u_k k/ν exceeds roughly 600; trip strips and turbulators use this on purpose.',
    'The transition Reynolds number is not a constant — it ranges from about 10⁵ to 3 × 10⁶.'
  ],
  pitfalls: [
    'Transition happens at Re = 5 × 10⁵, a law of nature — That is a typical value for a smooth plate in ordinary conditions; the true value depends strongly on turbulence, pressure gradient, roughness and noise.',
    'Transition is a sudden switch at one point — It takes place over a zone, often as long as the laminar region before it, in which turbulent spots appear, grow and merge.',
    'A turbulent boundary layer is always to be avoided — Its friction is higher, but it resists separation; on balls, low-Reynolds wings and diffusers it is often triggered deliberately.'
  ],
  formulas: [
    {
      name: 'Transition position from the transition Reynolds number',
      expr: 'Retr = U*xtr/nu', tex: '\\mathrm{Re}_{\\mathrm{tr}} = \\frac{U\\, x_{\\mathrm{tr}}}{\\nu}',
      vars: {
        Retr: { name: 'transition Reynolds number', value: 5e5, tex: '\\mathrm{Re}_{\\mathrm{tr}}' },
        U: { name: 'free-stream speed', q: 'speed', unit: 'm/s', value: 30 },
        xtr: { name: 'distance from the leading edge to transition', q: 'length', unit: 'm', tex: 'x_{\\mathrm{tr}}' },
        nu: { name: 'kinematic viscosity', q: 'kinvisc', unit: 'm²/s', value: 1.46e-5, tex: '\\nu' }
      },
      solveFor: 'xtr',
      note: 'About 5 × 10⁵ for a smooth plate in ordinary conditions; roughly 10⁵ with strong free-stream turbulence, up to 3 × 10⁶ in very quiet flow or on laminar-flow airfoils.',
      stories: {
        xtr: 'A smooth flat plate sits in a {U} stream (ν = {nu}). If the layer turns turbulent at a Reynolds number of {Retr}, how far from the leading edge does that happen?',
        U: 'A laminar layer must reach {xtr} before transition at Re = {Retr}, in air with ν = {nu}. At what speed does that happen?'
      }
    },
    {
      name: 'Start of transition and free-stream turbulence (Abu-Ghannam–Shaw fit)',
      expr: 'Rextr = ((163 + exp(6.91 - Tu))/0.664)^2', tex: '\\mathrm{Re}_{x,\\mathrm{tr}} = \\left(\\frac{163 + e^{\\,6.91 - \\mathrm{Tu}}}{0.664}\\right)^{2}',
      vars: {
        Rextr: { name: 'Reynolds number at the start of transition', tex: '\\mathrm{Re}_{x,\\mathrm{tr}}' },
        Tu: { name: 'free-stream turbulence intensity (in %)', value: 1, min: 0.02, max: 6, tex: '\\mathrm{Tu}' }
      },
      note: 'An empirical fit for a flat plate with no pressure gradient; Tu is entered as a number of per cent (1 means 1 %). It uses Re_θ = 163 + exp(6.91 − Tu) and the laminar Re_θ = 0.664√Re_x. Reliable to perhaps ±30 %.',
      stories: {
        Rextr: 'A flat plate is tested in a wind tunnel with a free-stream turbulence of {Tu} per cent. At what Reynolds number does transition begin?',
        Tu: 'Transition on a flat-plate model starts at a Reynolds number of {Rextr}. Roughly how turbulent (in %) is the tunnel\'s stream?'
      }
    },
    {
      name: 'Roughness Reynolds number',
      expr: 'Rek = uk*k/nu', tex: '\\mathrm{Re}_k = \\frac{u_k\\, k}{\\nu}',
      vars: {
        Rek: { name: 'roughness Reynolds number', tex: '\\mathrm{Re}_k' },
        uk: { name: 'speed in the undisturbed layer at the height of the roughness', q: 'speed', unit: 'm/s', value: 40, tex: 'u_k' },
        k: { name: 'roughness height', q: 'length', unit: 'mm', value: 0.25 },
        nu: { name: 'kinematic viscosity', q: 'kinvisc', unit: 'm²/s', value: 1.46e-5, tex: '\\nu' }
      },
      note: 'Three-dimensional roughness (grit, insect remains) trips a laminar layer when Re_k exceeds roughly 600; much smaller values leave it laminar. Near a leading edge, where the layer is very thin, u_k is close to the full local speed.',
      stories: {
        Rek: 'An insect leaves a bump {k} high on a wing\'s leading edge, where the air in the layer at that height moves at {uk} (ν = {nu}). What is the roughness Reynolds number — will it trip the layer?',
        k: 'For a trip strip to work, the roughness Reynolds number must reach {Rek}. If the air at the grit height moves at {uk} (ν = {nu}), how tall must the grit be?'
      }
    }
  ],
  examples: [
    {
      title: 'How much of a car roof is laminar?',
      q: 'A car drives at 30 m/s (108 km/h) in still air ($\\nu = 1.46\\times10^{-5}$ m²/s). If transition happens at $\\mathrm{Re}_x = 5\\times10^5$, how far behind the top of the windscreen does the roof layer turn turbulent? And on a 1 m chord glider wing at the same speed?',
      steps: [
        '$x_{\\mathrm{tr}} = \\mathrm{Re}_{\\mathrm{tr}}\\,\\nu/U = 5\\times10^5 \\times 1.46\\times10^{-5}/30 = 0.24$ m.',
        'A car\'s roof is 2–3 m long, and the flow arriving there has already been disturbed by the bonnet and windscreen, so almost the whole car is covered by a turbulent layer.',
        'A glider wing\'s chord Reynolds number is $30 \\times 1/1.46\\times10^{-5} = 2.1\\times10^6$. A flat plate would be turbulent after 24 cm, but a laminar-flow airfoil keeps the pressure falling and stays laminar over roughly half its chord.'
      ],
      a: 'After about 24 cm — the rest of the car is turbulent. A laminar-flow wing does much better by shaping its pressure distribution.'
    },
    {
      title: 'The tunnel that trips the model',
      q: 'A flat-plate model is tested at 20 m/s in two wind tunnels: a quiet one with 0.2 % free-stream turbulence and an old one with 2 %. Where does transition start in each, using the Abu-Ghannam–Shaw fit?',
      steps: [
        'Quiet tunnel: $\\mathrm{Re}_\\theta = 163 + e^{6.71} = 163 + 820 = 983$, so $\\mathrm{Re}_x = (983/0.664)^2 = 2.19\\times10^6$.',
        '$x_{\\mathrm{tr}} = 2.19\\times10^6 \\times 1.46\\times10^{-5}/20 = 1.60$ m.',
        'Old tunnel: $\\mathrm{Re}_\\theta = 163 + e^{4.91} = 163 + 136 = 299$, so $\\mathrm{Re}_x = (299/0.664)^2 = 2.0\\times10^5$ and $x_{\\mathrm{tr}} = 0.15$ m.'
      ],
      a: 'About 1.6 m in the quiet tunnel and 0.15 m in the turbulent one — a tenfold difference, which is why tunnel turbulence is measured and quoted with every result.'
    }
  ],
  quiz: [
    { q: 'Which of these delays transition on a wing?', choices: ['a rising pressure along the surface', 'a pressure falling along the surface (accelerating flow)', 'more free-stream turbulence', 'insect remains on the leading edge'], a: 1,
      why: 'An accelerating outer flow stabilises the laminar layer; that is how laminar-flow airfoils work. The other three all bring transition forward.' },
    { q: 'Transition on any smooth flat plate happens at exactly Re_x = 5 × 10⁵.', a: false,
      why: 'It is a typical value. Very quiet flows stay laminar to about 3 × 10⁶; with a few per cent of free-stream turbulence transition can start near 10⁵.' },
    { q: 'At 50 m/s in sea-level air ($\\nu = 1.46\\times10^{-5}$ m²/s), where does a layer with a transition Reynolds number of 5 × 10⁵ turn turbulent? Answer in metres.', answer: 0.146, unit: 'm',
      why: '$x_{\\mathrm{tr}} = 5\\times10^5 \\times 1.46\\times10^{-5}/50 = 0.146$ m.' },
    { q: 'Wind-tunnel engineers glue a strip of grit near the leading edge of a small model. Why?', choices: ['to protect the paint', 'to fix transition where the full-size aircraft would have it, since the model\'s Reynolds number is too low', 'to reduce skin friction', 'to measure the pressure'], a: 1,
      why: 'At model scale the layer would stay laminar too long and might separate differently. A trip strip forces transition at a chosen place so the model\'s boundary layer resembles the full-size one.' },
    { q: 'Which sequence describes natural transition on a quiet flat plate?', choices: ['turbulent spots → Tollmien–Schlichting waves → laminar flow', 'Tollmien–Schlichting waves → three-dimensional vortices → turbulent spots → turbulent layer', 'separation → reattachment → turbulence', 'shock waves → turbulent spots'], a: 1,
      why: 'Small two-dimensional waves grow, become three-dimensional, break down into spots, and the spots merge.' }
  ],
  problems: [
    { q: 'Grit is used to trip the laminar layer on a model at a place where the air in the layer at the grit height moves at 25 m/s. What grit height gives $\\mathrm{Re}_k = 600$ in sea-level air ($\\nu = 1.46\\times10^{-5}$ m²/s)? Answer in millimetres.', answer: 0.350, unit: 'mm', tol: 0.02,
      steps: ['$k = \\mathrm{Re}_k\\,\\nu/u_k = 600 \\times 1.46\\times10^{-5}/25$.', '$k = 3.5\\times10^{-4}$ m = 0.35 mm.'] }
  ],
  applications: [
    'Laminar-flow airfoils and natural-laminar-flow nacelles, which delay transition to cut friction drag.',
    'Trip strips on wind-tunnel models, and turbulators on sailplanes and model aircraft.',
    'Gas-turbine blades, where free-stream turbulence makes bypass transition the rule.',
    'Heat transfer: transition raises the heat flux to a surface several times — critical on re-entry vehicles.'
  ],
  history: 'Reynolds\'s dye experiment in a pipe (1883) named the problem. Tollmien (1929) and Schlichting (1933) predicted the unstable waves, but they were only seen in 1940–41, when Schubauer and Skramstad at the US National Bureau of Standards built a wind tunnel quiet enough and excited the waves with a vibrating ribbon (their report, delayed by the war, appeared in 1947). Emmons discovered turbulent spots in 1951 while watching a water table.',
  sim: 'visc-transition'
},

{
  id: 'skin-friction', parent: 'boundary-layers', title: 'Skin friction', level: 2,
  short: 'The drag of air rubbing along a surface: the wall shear stress added up over the wetted area, D_f = C_f · ½ρU² · S_wet. Laminar layers have little, turbulent ones several times more, and on an airliner it is about half the drag in cruise.',
  keywords: ['skin friction', 'friction drag', 'skin friction coefficient', 'wetted area', 'flat plate drag', 'Prandtl-Schlichting', 'ITTC line', 'roughness', 'admissible roughness', 'laminar flow', 'turbulent friction'],
  prereq: ['laminar-boundary-layer', 'turbulent-boundary-layer', 'dynamic-pressure'],
  related: ['parasite-drag', 'drag-equation', 'form-drag', 'transition', 'flow-control', 'streamlining', 'special-airfoils', 'vehicle-aerodynamics'],
  body: `
Every square metre of an aircraft's skin drags a little of the air along with it, and the air drags back. The force per square metre is the wall shear stress $\\tau_w$ — a pascal or two at road speeds, tens of pascals on an airliner in cruise. Added up over the whole **wetted area** (every surface the air touches), it is the **skin-friction drag**:

$$D_f = C_f \\cdot \\tfrac{1}{2}\\rho U^2 \\cdot S_{\\mathrm{wet}}$$

The average skin-friction coefficient $C_f$ depends mostly on the [[reynolds-number|Reynolds number]] $\\mathrm{Re}_L = UL/\\nu$ of the surface and on whether its boundary layer is laminar or turbulent. Note the reference area: the wetted area, which for an airliner is about six times the wing area.

### Laminar and turbulent friction
For a smooth flat plate:

| | Formula | $\\mathrm{Re}_L = 10^6$ | $10^7$ | $10^8$ | $10^9$ |
|---|---|---|---|---|---|
| Laminar (Blasius) | $C_f = 1.328/\\sqrt{\\mathrm{Re}_L}$ | 0.00133 | 0.00042 | 0.00013 | — |
| Turbulent (Prandtl–Schlichting) | $C_f = 0.455/(\\log_{10}\\mathrm{Re}_L)^{2.58}$ | 0.00447 | 0.00300 | 0.00213 | 0.00157 |
| Ratio turbulent/laminar | | 3.4 | 7.1 | 16 | — |

Laminar friction falls fast with Reynolds number, turbulent friction only slowly — so the prize for keeping a layer laminar grows with size and speed. (Laminar values at $10^8$ are hypothetical: no real layer stays laminar that long.) For ships the ITTC-1957 line, $C_f = 0.075/(\\log_{10}\\mathrm{Re} - 2)^2$, is the standard.

A real surface starts laminar and turns turbulent at $\\mathrm{Re}_{\\mathrm{tr}}$. Prandtl's correction subtracts the friction saved on the laminar front part:

$$C_f = \\frac{0.455}{(\\log_{10}\\mathrm{Re}_L)^{2.58}} - \\frac{A}{\\mathrm{Re}_L}$$

with $A = 1050$, 1700, 3300 or 8700 for transition at $3\\times10^5$, $5\\times10^5$, $10^6$ or $3\\times10^6$.

### How friction grows with speed
Because $C_f$ falls slowly as speed rises, turbulent friction drag grows as about $U^{1.8}$ rather than $U^2$; laminar friction as $U^{1.5}$. At high subsonic speed the hot air near the wall is less dense and $C_f$ falls a further 5–10 %.

### Roughness
Roughness hidden inside the viscous sublayer is harmless. The largest harmless (**admissible**) roughness is about $k_{\\mathrm{adm}} \\approx 100\\,\\nu/U$: roughly 50 µm on a car at 30 m/s, but only 15 µm on an airliner cruising at 250 m/s at 11 000 m. Bigger roughness raises the friction until, when it is "fully rough" ($k^+ = k u_\\tau/\\nu$ above about 70), $C_f = (1.89 + 1.62\\log_{10} L/k)^{-2.5}$ no longer depends on Reynolds number: a 10 m surface with 1 mm roughness has $C_f \\approx 0.0049$ — nearly twice the smooth value of 0.0025 at 45 m/s. Barnacles and weed on a ship's hull can raise fuel use by tens of per cent.

### How big a share?
| Vehicle | Friction share of total drag (typical, rounded) |
|---|---|
| Airliner in cruise | about half |
| Car | about 10 % — pressure drag dominates |
| Large slow ship (tanker, bulk carrier) | 70–90 % |

This is why airliner designers chase laminar flow, riblets and smooth joints (see [[flow-control]]), while car designers chase the wake ([[form-drag]]).
`,
  ideas: [
    'Skin friction is the wall shear stress added over the wetted area: D_f = C_f · ½ρU² · S_wet.',
    'Laminar C_f = 1.328/√Re_L; turbulent C_f ≈ 0.455/(log Re_L)^{2.58}: several times larger, and the gap grows with Re.',
    'Mixed plates: Prandtl\'s correction subtracts A/Re_L for the laminar front part.',
    'Roughness smaller than about 100ν/U is harmless; fully rough surfaces have a C_f independent of Re.',
    'Friction is about half an airliner\'s cruise drag but only about a tenth of a car\'s.'
  ],
  pitfalls: [
    'C_f is referred to the wing area like C_D — Friction coefficients are referred to the wetted area; convert with S_wet/S_ref (often 4–6 for an aircraft) before adding them to a drag polar.',
    'Any roughness increases friction — Roughness buried in the viscous sublayer (below about 100ν/U) changes nothing; it matters only when it pokes out.',
    'Friction drag grows with the square of speed — The coefficient falls as Re rises, so turbulent friction grows as about U^{1.8} and laminar as U^{1.5}.'
  ],
  formulas: [
    {
      name: 'Skin-friction drag',
      expr: 'Df = Cf*0.5*rho*U^2*S', tex: 'D_f = C_f\\,\\tfrac{1}{2}\\rho U^2\\, S_{\\mathrm{wet}}',
      vars: {
        Df: { name: 'skin-friction drag', q: 'force', unit: 'N', tex: 'D_f' },
        Cf: { name: 'average skin-friction coefficient', value: 0.003, min: 0, max: 0.05, tex: 'C_f' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        U: { name: 'speed', q: 'speed', unit: 'm/s', value: 30 },
        S: { name: 'wetted area', q: 'area', unit: 'm²', value: 10, tex: 'S_{\\mathrm{wet}}' }
      },
      note: 'C_f is based on the wetted area, not the wing area. Typical values: 0.001–0.002 laminar, 0.002–0.005 turbulent.',
      stories: {
        Df: 'A surface of {S} is covered by a turbulent layer with an average friction coefficient of {Cf}. What friction drag does it feel at {U} in air of density {rho}?',
        Cf: 'A body with {S} of wetted area has {Df} of friction drag at {U} (density {rho}). What is its average skin-friction coefficient?'
      }
    },
    {
      name: 'Laminar friction coefficient (Blasius)',
      expr: 'Cf = 1.328/sqrt(ReL)', tex: 'C_f = \\frac{1.328}{\\sqrt{\\mathrm{Re}_L}}',
      vars: {
        Cf: { name: 'average skin-friction coefficient', tex: 'C_f' },
        ReL: { name: 'Reynolds number based on length', value: 3e5, tex: '\\mathrm{Re}_L' }
      },
      note: 'Smooth flat plate, laminar over its whole length (Re_L below the transition value, usually about 5 × 10⁵).',
      stories: { Cf: 'What is the average friction coefficient of a smooth plate that stays laminar at a length Reynolds number of {ReL}?' }
    },
    {
      name: 'Turbulent friction coefficient (Prandtl–Schlichting)',
      expr: 'Cf = 0.455/(log(ReL))^2.58', tex: 'C_f = \\frac{0.455}{(\\log_{10}\\mathrm{Re}_L)^{2.58}}',
      vars: {
        Cf: { name: 'average skin-friction coefficient', tex: 'C_f' },
        ReL: { name: 'Reynolds number based on length', value: 1e7, min: 1e5, max: 1e10, tex: '\\mathrm{Re}_L' }
      },
      note: 'Smooth plate, turbulent from the leading edge; good from about 10⁵ to 10⁹ and beyond. The simpler 0.074/Re_L^{1/5} agrees within a few per cent between 5 × 10⁵ and 10⁷.',
      stories: {
        Cf: 'What is the average friction coefficient of a smooth surface with a turbulent layer, at a length Reynolds number of {ReL}?',
        ReL: 'At what length Reynolds number does a smooth turbulent plate have an average friction coefficient of {Cf}?'
      }
    },
    {
      name: 'Laminar front, turbulent back (Prandtl\'s correction)',
      expr: 'Cf = 0.455/(log(ReL))^2.58 - A/ReL', tex: 'C_f = \\frac{0.455}{(\\log_{10}\\mathrm{Re}_L)^{2.58}} - \\frac{A}{\\mathrm{Re}_L}',
      vars: {
        Cf: { name: 'average skin-friction coefficient', tex: 'C_f' },
        ReL: { name: 'Reynolds number based on length', value: 1e6, min: 5e5, max: 1e10, log: true, tex: '\\mathrm{Re}_L' },
        A: { name: 'transition constant (1700 for Re_tr = 5 × 10⁵)', value: 1700, fixed: true }
      },
      practice: { unknowns: ['Cf'] },
      note: 'A = 1050, 1700, 3300, 8700 for transition at Re = 3 × 10⁵, 5 × 10⁵, 10⁶, 3 × 10⁶. At high Re_L the correction vanishes: the laminar part is too short to matter.',
      stories: { Cf: 'A smooth plate with transition at Re = 5 × 10⁵ runs at a length Reynolds number of {ReL}. What is its average friction coefficient?' }
    }
  ],
  examples: [
    {
      title: 'How much does the laminar front save?',
      q: 'A smooth panel 2 m long moves at 30 m/s through sea-level air ($\\nu = 1.46\\times10^{-5}$ m²/s). Compare its average friction coefficient if it is turbulent from the leading edge, and if it stays laminar to $\\mathrm{Re} = 5\\times10^5$. What is the friction per square metre in each case?',
      steps: [
        '$\\mathrm{Re}_L = 30 \\times 2/1.46\\times10^{-5} = 4.11\\times10^6$; $\\log_{10}\\mathrm{Re}_L = 6.614$.',
        'Fully turbulent: $C_f = 0.455/6.614^{2.58} = 0.455/130.9 = 0.00348$.',
        'With a laminar front: $C_f = 0.00348 - 1700/4.11\\times10^6 = 0.00348 - 0.00041 = 0.00306$.',
        'With $q = \\tfrac12 \\times 1.225 \\times 30^2 = 551$ Pa: 1.92 Pa against 1.69 Pa.',
        'The laminar front is only 0.24 m long (12 % of the panel) but cuts the average friction by 12 %.'
      ],
      a: 'C_f ≈ 0.0035 fully turbulent and 0.0031 with the laminar front: about 1.9 and 1.7 N per square metre.'
    },
    {
      title: 'Friction on an airliner fuselage',
      q: 'An airliner fuselage 38 m long, with about 400 m² of wetted area, cruises at 230 m/s at 11 000 m, where $\\rho = 0.364$ kg/m³ and $\\nu = 3.9\\times10^{-5}$ m²/s. Estimate its skin-friction drag, treating it as a turbulent flat plate.',
      steps: [
        '$\\mathrm{Re}_L = 230 \\times 38/3.9\\times10^{-5} = 2.24\\times10^8$; $\\log_{10}\\mathrm{Re}_L = 8.35$.',
        '$C_f = 0.455/8.35^{2.58} = 0.455/239 = 0.0019$.',
        '$q = \\tfrac12 \\times 0.364 \\times 230^2 = 9630$ Pa.',
        '$D_f = 0.0019 \\times 9630 \\times 400 = 7300$ N.',
        'A 65-tonne airliner with a lift-to-drag ratio near 17 has about 37 kN of total drag, so the fuselage skin alone is about a fifth of it.'
      ],
      a: 'About 7 kN — roughly a fifth of the aircraft\'s cruise drag, from the fuselage skin alone.'
    }
  ],
  quiz: [
    { q: 'A surface with a turbulent layer moves twice as fast. Its friction drag becomes about…', choices: ['2 times as large', '2.8 times', '3.5 times', '4 times'], a: 2,
      why: 'With C_f ∝ Re^{−1/5}, D_f ∝ U^{2 − 0.2} = U^{1.8}; 2^{1.8} = 3.5. Only a Reynolds-independent C_f would give 4.' },
    { q: 'Any roughness on a surface increases its skin friction.', a: false,
      why: 'Roughness smaller than the viscous sublayer (about 100ν/U, or k⁺ < 5) is hidden in slow viscous flow and has no effect: the surface is hydraulically smooth.' },
    { q: 'Using $C_f = 1.328/\\sqrt{\\mathrm{Re}_L}$, what is the average friction coefficient of a laminar plate at $\\mathrm{Re}_L = 4\\times10^5$?', answer: 0.0021,
      why: '$\\sqrt{4\\times10^5} = 632$; $C_f = 1.328/632 = 0.0021$.' },
    { q: 'To turn a friction coefficient C_f into a force you multiply by the dynamic pressure and…', choices: ['the wing area', 'the frontal area', 'the wetted area', 'the cross-sectional area of the wake'], a: 2,
      why: 'Friction acts on every surface the air touches, so C_f is based on the wetted area. It must be scaled by S_wet/S_ref to be added to coefficients based on the wing area.' },
    { q: 'Why is keeping a layer laminar worth more on a large, fast aircraft than on a small, slow one?', choices: ['because laminar friction is higher at high Re', 'because the ratio of turbulent to laminar friction grows with the Reynolds number', 'because large aircraft have no pressure drag', 'it is not: the saving is the same'], a: 1,
      why: 'Laminar C_f falls as Re^{−1/2}, turbulent only about as Re^{−1/5}: at Re = 10⁶ the ratio is about 3, at 10⁷ about 7.' }
  ],
  problems: [
    { q: 'What is the largest admissible roughness (k ≈ 100 ν/U) for a car at 30 m/s in sea-level air ($\\nu = 1.46\\times10^{-5}$ m²/s)? Answer in micrometres.', answer: 48.7, unit: 'µm', tol: 0.03,
      steps: ['$k_{\\mathrm{adm}} = 100 \\times 1.46\\times10^{-5}/30 = 4.87\\times10^{-5}$ m.', 'That is about 49 µm — smooth paint is far better than this; a coat of dried mud is not.'] }
  ],
  applications: [
    'Drag build-up of aircraft: component friction from wetted areas and length Reynolds numbers.',
    'Ship resistance: the ITTC friction line, hull fouling and anti-fouling coatings.',
    'Laminar-flow wings and nacelles, riblet films and polished blades.',
    'Pipeline and duct pressure losses, which follow the same wall friction.'
  ],
  history: 'William Froude towed wooden planks up to 50 feet long through a tank at Torquay in the early 1870s to find the friction of ship hulls, and discovered that it grows less than in proportion to length. Prandtl and Schlichting\'s turbulent formula came in 1932, and the International Towing Tank Conference adopted its friction line in 1957.',
  sim: 'visc-skin-friction'
},

/* ================================================================ SEPARATION AND WAKES */
{
  id: 'flow-separation', parent: 'separation-wakes', title: 'Flow separation', level: 2,
  short: 'When the pressure rises along a surface, the slow air near the wall can run out of energy, stop and turn back; the boundary layer then lifts off the surface into a turbulent wake. Separation causes pressure drag, stall, and diffusers that fail to recover pressure.',
  keywords: ['flow separation', 'boundary layer separation', 'adverse pressure gradient', 'favourable pressure gradient', 'separation point', 'reverse flow', 'diffuser', 'laminar separation bubble', 'stall', 'wake', 'Thwaites criterion'],
  prereq: ['boundary-layer', 'bernoulli', 'pressure-coefficient'],
  related: ['stall', 'drag-crisis', 'form-drag', 'bluff-bodies', 'vortex-shedding', 'flow-control', 'pressure-distribution', 'turbulent-boundary-layer', 'streamlining'],
  body: `
Around the front of a cylinder or a wing the air speeds up and the pressure falls; towards the back it must slow down again and the pressure rises. The air far from the wall has plenty of kinetic energy to climb this pressure hill — [[bernoulli|Bernoulli]] trades speed for pressure along its way. But the air deep in the [[boundary-layer|boundary layer]] has already lost much of its energy to friction. Pushed against a rising pressure, it slows, stops and turns back. The oncoming layer is lifted off the surface: the flow **separates**.

### Adverse and favourable gradients
A pressure falling in the direction of flow ($dp/dx < 0$) is **favourable**: it accelerates the layer and keeps it attached. A rising pressure ($dp/dx > 0$) is **adverse**. At the wall itself the momentum balance is exact and simple:

$$\\mu \\left(\\frac{\\partial^2 u}{\\partial y^2}\\right)_{\\!w} = \\frac{dp}{dx}$$

In an adverse gradient the velocity profile must curve the "wrong" way at the wall: it develops an inflection, grows S-shaped, its wall slope — the shear stress — falls, and at the **separation point** it reaches zero. Behind that point there is reverse flow along the wall and a recirculating region, and the shear layer that left the surface rolls up into eddies.

### Who separates first
- **Laminar layers** are fragile. Thwaites' criterion puts laminar separation where $\\lambda = (\\theta^2/\\nu)\\, dU/dx \\approx -0.09$; on a circular cylinder a laminar layer leaves the surface only about 80° from the front stagnation point, before the widest section.
- **Turbulent layers**, their near-wall air constantly replenished by mixing, stand a much larger pressure rise. On the cylinder they hold on to about 120°. The shape factor $H$ is the warning light: separation is near when it climbs past about 2.4 (turbulent) or 3.5 (laminar).
- **Sharp edges** separate the flow at any Reynolds number: the air cannot turn a corner of zero radius. The back of a truck, a spoiler lip, a flat plate across the stream — their drag coefficients hardly change with speed.

### What it does
| Where | Consequence |
|---|---|
| Wing at high angle of attack | separation creeps forward from the trailing edge and lift collapses: the [[stall]] |
| Bluff body (car, sphere, cylinder) | a wide low-pressure wake: most of the [[form-drag|pressure drag]] |
| Diffuser, wind-tunnel return duct, engine inlet | pressure is not recovered; the flow may jump from wall to wall |
| Low-Reynolds airfoil (model, drone) | a laminar separation bubble: the layer leaves, turns turbulent in the air and reattaches |
| Behind a cylinder | alternate shedding of vortices: [[vortex-shedding|the Kármán street]] |

A diffuser shows the trade clearly. Slowing air from area $A_1$ to $A_2$ could, ideally, recover a pressure coefficient $C_{p,i} = 1 - (A_1/A_2)^2$ — 0.75 for an area ratio of 2. If the walls diverge too quickly the layer separates, and the real recovery falls far short. Good conical diffusers keep the total angle to roughly 7–10°; beyond about 10–12° the flow breaks away from one wall.

> [!warn] The stall of a real aircraft depends on its wing, its loading and how it is flown. This page explains the physics only: stall speeds, warnings and recovery follow the aircraft's approved flight manual, training and the rules of the air.

### Fighting it
Keep the pressure rise gentle ([[streamlining]]); make the layer turbulent before the rise ([[drag-crisis|golf-ball dimples]], turbulators); re-energise it with [[flow-control|vortex generators]], blowing or suction; or give it a fresh start with a slot (see [[high-lift-devices]]).
`,
  ideas: [
    'In a rising pressure (adverse gradient) the slow air near the wall stops and reverses; the layer lifts off and a wake forms.',
    'At the separation point the wall shear stress falls to zero; the profile becomes S-shaped before it.',
    'Laminar layers separate easily (on a cylinder at about 80°); turbulent ones hold on much longer (about 120°).',
    'Sharp edges fix separation regardless of Reynolds number.',
    'Separation causes stall, most of the pressure drag of bluff bodies, and poor pressure recovery in diffusers.'
  ],
  pitfalls: [
    'Separation happens where a surface curves away too sharply — Curvature matters only through the pressure rise it causes; the cause is the adverse pressure gradient acting on slow near-wall air.',
    'Separation is caused by the air being too slow to follow the surface — The outer air is often fast; it is the rising pressure that stops the slowest, near-wall air, which then pushes the rest off.',
    'A turbulent boundary layer separates earlier because it is more disturbed — It separates later: mixing keeps the air near the wall energetic.'
  ],
  formulas: [
    {
      name: 'Pressure coefficient from the local speed',
      expr: 'Cp = 1 - (Ue/U0)^2', tex: 'C_p = 1 - \\left(\\frac{U_e}{U_\\infty}\\right)^2',
      vars: {
        Cp: { name: 'pressure coefficient', signed: true, tex: 'C_p' },
        Ue: { name: 'speed at the edge of the boundary layer', q: 'speed', unit: 'm/s', value: 26, tex: 'U_e' },
        U0: { name: 'free-stream speed', q: 'speed', unit: 'm/s', value: 30, tex: 'U_\\infty' }
      },
      note: 'Bernoulli in the outer flow (low Mach number). Where C_p rises along the surface in the flow direction the gradient is adverse.',
      stories: {
        Cp: 'Near the trailing edge of a wing in a {U0} stream the air at the edge of the boundary layer has slowed to {Ue}. What is the pressure coefficient there?',
        Ue: 'At a point on a body in a {U0} stream the pressure coefficient is {Cp}. How fast is the air just outside the boundary layer?'
      }
    },
    {
      name: 'Ideal pressure recovery of a diffuser',
      expr: 'Cpi = 1 - 1/AR^2', tex: 'C_{p,i} = 1 - \\frac{1}{\\mathrm{AR}^2}',
      vars: {
        Cpi: { name: 'ideal pressure-recovery coefficient (Δp / inlet dynamic pressure)', tex: 'C_{p,i}' },
        AR: { name: 'area ratio A₂/A₁', value: 2, min: 1, max: 20, tex: '\\mathrm{AR}' }
      },
      note: 'Inviscid, one-dimensional flow. Real diffusers recover perhaps 60–90 % of this if the flow stays attached, much less when it separates.',
      stories: {
        Cpi: 'A diffuser doubles its flow area (area ratio {AR}). What fraction of the inlet dynamic pressure could it recover at best?',
        AR: 'A diffuser should ideally recover a pressure coefficient of {Cpi}. What area ratio does it need?'
      }
    },
    {
      name: 'Thwaites\' pressure-gradient parameter',
      expr: 'lam = theta^2/nu*dUdx', tex: '\\lambda = \\frac{\\theta^2}{\\nu}\\, U\'',
      vars: {
        lam: { name: 'Thwaites parameter', signed: true, tex: '\\lambda' },
        theta: { name: 'momentum thickness', q: 'length', unit: 'mm', value: 0.3, tex: '\\theta' },
        nu: { name: 'kinematic viscosity', q: 'kinvisc', unit: 'm²/s', value: 1.46e-5, tex: '\\nu' },
        dUdx: { name: 'gradient of the outer speed, dU/dx', q: 'rate', unit: '1/s', value: -14.6, signed: true, tex: 'U\'' }
      },
      note: 'For laminar layers. λ > 0 favourable; λ < 0 adverse; laminar separation at about λ = −0.09 (the starting values sit right at it).',
      stories: {
        lam: 'A laminar layer with a momentum thickness of {theta} (ν = {nu}) meets an outer flow slowing at {dUdx}. What is Thwaites\' parameter — is it near separation?',
        dUdx: 'A laminar layer with a momentum thickness of {theta} (ν = {nu}) separates when the Thwaites parameter reaches {lam}. How fast must the outer flow be decelerating?'
      }
    }
  ],
  examples: [
    {
      title: 'How much pressure rise can a laminar layer take?',
      q: 'A laminar layer with momentum thickness $\\theta = 0.2$ mm runs under a 20 m/s outer stream ($\\nu = 1.46\\times10^{-5}$ m²/s, $\\rho = 1.225$ kg/m³). Using Thwaites\' criterion, what deceleration $dU/dx$ — and what pressure gradient — separates it?',
      steps: [
        'Separation at $\\lambda = -0.09$: $dU/dx = -0.09\\,\\nu/\\theta^2 = -0.09 \\times 1.46\\times10^{-5}/(2\\times10^{-4})^2 = -32.9\\ \\mathrm{s^{-1}}$.',
        'From Bernoulli, $dp/dx = -\\rho U\\, dU/dx = 1.225 \\times 20 \\times 32.9 = 805$ Pa/m.',
        'The dynamic pressure is 245 Pa, so the layer separates if the pressure climbs by more than about a third of $q$ within 10 cm.'
      ],
      a: 'A deceleration of about 33 s⁻¹, a pressure rise of about 800 Pa per metre — not much. A turbulent layer would stand several times more.'
    },
    {
      title: 'A wind-tunnel diffuser',
      q: 'A wind tunnel runs at 40 m/s in its test section; the diffuser behind it has an area ratio of 2.5. What pressure could it recover ideally, and what if it reaches 85 % of the ideal?',
      steps: [
        'Inlet dynamic pressure: $q = \\tfrac12 \\times 1.225 \\times 40^2 = 980$ Pa.',
        '$C_{p,i} = 1 - 1/2.5^2 = 0.84$, so ideally 823 Pa.',
        'At 85 %: $C_p = 0.71$, about 700 Pa recovered. Every pascal not recovered must be supplied by the fan, whose power scales with the loss times the flow.'
      ],
      a: 'Ideally about 820 Pa; about 700 Pa at 85 % effectiveness — if the diffuser angle is gentle enough to avoid separation.'
    }
  ],
  quiz: [
    { q: 'At a separation point, the wall shear stress is…', choices: ['at its maximum', 'zero', 'negative everywhere upstream', 'equal to the dynamic pressure'], a: 1,
      why: 'Separation is where the velocity gradient at the wall — and so τ_w — falls to zero. Downstream of it the gradient is reversed (backflow).' },
    { q: 'Which boundary layer can climb the larger pressure rise before separating?', choices: ['a laminar one, because it is smoother', 'a turbulent one, because mixing keeps the near-wall air energetic', 'both the same', 'neither: pressure rises always separate the flow'], a: 1,
      why: 'Turbulent mixing constantly brings fast air to the wall. On a cylinder a turbulent layer separates at about 120° instead of about 80°.' },
    { q: 'At a point on a wing the local speed is 1.5 times the free-stream speed. What is the pressure coefficient?', answer: -1.25,
      why: '$C_p = 1 - 1.5^2 = -1.25$: strong suction.' },
    { q: 'The drag coefficient of a flat plate held square to the stream changes a lot with Reynolds number.', a: false,
      why: 'Its sharp edges fix the separation points, so the wake — and C_D, about 2.0 for a long strip and 1.17 for a square plate — hardly changes with Re.' },
    { q: 'A diffuser with walls diverging too steeply will…', choices: ['recover more pressure, because the area grows faster', 'separate from a wall and recover much less pressure', 'accelerate the flow', 'have no boundary layer'], a: 1,
      why: 'The adverse pressure gradient becomes too strong for the wall layers; the flow breaks away from one wall and passes as a jet, so the area increase is wasted.' }
  ],
  problems: [
    { q: 'What is the ideal pressure-recovery coefficient of a diffuser with an area ratio of 3?', answer: 0.889, tol: 0.01,
      steps: ['$C_{p,i} = 1 - 1/3^2 = 1 - 0.111 = 0.889$.'] }
  ],
  applications: [
    'Stall of wings and blades, and the high-lift devices that delay it.',
    'Diffusers in wind tunnels, jet-engine inlets, pumps and ventilation ducts.',
    'The pressure drag of cars, trucks and buildings, and the shaping that reduces it.',
    'Laminar separation bubbles on model aircraft, drones and wind-turbine blades at low Reynolds number.'
  ],
  history: 'Prandtl\'s 1904 paper did not only explain skin friction: its most important sketches show the boundary layer separating from a cylinder, and how sucking it away through a slot keeps the flow attached. Separation was the missing link between frictionless theory and real drag, and between the lift curve and the stall.',
  sim: 'visc-separation'
},

{
  id: 'drag-crisis', parent: 'separation-wakes', title: 'The drag crisis', level: 2,
  short: 'Near a Reynolds number of 3 × 10⁵ the drag coefficient of a smooth sphere or cylinder suddenly drops by a factor of three to five: the boundary layer turns turbulent before it separates, clings on further round the back and leaves a much narrower wake. Golf-ball dimples bring the crisis down to ordinary speeds.',
  keywords: ['drag crisis', 'critical Reynolds number', 'sphere drag', 'cylinder drag', 'golf ball dimples', 'Eiffel', 'trip wire', 'supercritical', 'subcritical', 'separation angle', 'wake width', 'knuckleball'],
  prereq: ['flow-separation', 'transition', 'drag-equation'],
  related: ['sports-aerodynamics', 'bluff-bodies', 'vortex-shedding', 'form-drag', 'turbulent-boundary-layer', 'similarity-testing', 'cylinder-flow'],
  body: `
Double the speed of a ball and you would expect about four times the drag. But in a narrow range of speeds a smooth sphere does something astonishing: go faster and its drag **falls** — not just its coefficient, the force itself. This is the **drag crisis**.

### The curve
For a smooth sphere the drag coefficient $C_D$ (based on the frontal area $\\pi d^2/4$) is about 0.4–0.5 over a wide range, from $\\mathrm{Re} = Vd/\\nu \\approx 10^3$ to $2\\times10^5$. Then, between about $2\\times10^5$ and $4\\times10^5$, it plunges to below 0.1, before climbing slowly back to about 0.2 at $10^6$ and above. A long smooth cylinder does the same: $C_D \\approx 1.2$ falling to about 0.3 near $\\mathrm{Re} \\approx 5\\times10^5$, recovering to 0.5–0.7 by $10^7$.

| Body | Subcritical $C_D$ | Critical Re | Just above the crisis |
|---|---|---|---|
| Smooth sphere | ≈ 0.47 | ≈ 3–4 × 10⁵ | ≈ 0.07–0.1, rising to ≈ 0.2 |
| Golf ball (dimpled) | ≈ 0.5 | ≈ 5 × 10⁴ | ≈ 0.25 |
| Smooth cylinder (per unit length) | ≈ 1.2 | ≈ 3–5 × 10⁵ | ≈ 0.3, rising to 0.5–0.7 |

### Why
Below the crisis the boundary layer on the front of the sphere is [[laminar-boundary-layer|laminar]]. Past the widest section the pressure rises, and a laminar layer [[flow-separation|separates]] almost at once — about 80° from the front stagnation point, *before* the equator. The wake is wider than the ball, its pressure low, and the pressure difference front-to-back is the drag.

At higher Reynolds number the layer goes through [[transition]] before the separation point (or separates briefly, turns turbulent in the air and reattaches). A [[turbulent-boundary-layer|turbulent layer]] mixes fast air to the wall and holds on to about 120°. The wake shrinks to perhaps half the width, the base pressure recovers, and the pressure drag collapses. The turbulent layer's higher skin friction is a small price: friction is only a few per cent of a sphere's drag.

> [!key] The drag crisis is separation, not friction: a turbulent layer costs a little more friction but moves the separation line far enough back to cut the pressure drag by a factor of three or more.

### Moving the crisis
Anything that trips the layer earlier brings the crisis to a lower Reynolds number — at the price of a higher drag after it than a smooth sphere would have:

- **Golf-ball dimples** trip the layer at $\\mathrm{Re} \\approx 5\\times10^4$. A drive at 70 m/s ($\\mathrm{Re} \\approx 2\\times10^5$) is subcritical for a smooth ball ($C_D \\approx 0.5$) but supercritical for a dimpled one ($C_D \\approx 0.25$): half the drag, roughly twice the carry once the backspin lift of the [[magnus-effect]] is added.
- **Seams and fuzz**: a cricket ball's seam trips the layer on one side only — asymmetric separation and a sideways force (swing). A football's critical range corresponds to speeds of very roughly 13–20 m/s, where many free kicks are struck; near it, small asymmetries can make the ball dip and swerve unpredictably.
- **Trip wires**: Prandtl showed in 1914 that a thin wire ring just ahead of the equator makes a sphere's drag drop at once.

### For engineers
Chimneys, towers, bridge cables and offshore risers run at $\\mathrm{Re}$ of $10^6$–$10^7$, above the crisis; their wind-tunnel models run far below it. Model tests therefore add roughness, use pressurised or cryogenic tunnels, or apply corrections ([[similarity-testing]]). In the critical range itself the flow can switch between states, and loads on cylinders become unsteady and sometimes asymmetric.
`,
  ideas: [
    'A smooth sphere\'s C_D falls from about 0.47 to below 0.1 between Re ≈ 2 × 10⁵ and 4 × 10⁵; a cylinder\'s from 1.2 to about 0.3.',
    'The cause: the layer turns turbulent before separating, clings on to about 120° instead of 80°, and the wake narrows.',
    'In the crisis the drag force itself can fall as the speed rises.',
    'Roughness, dimples, seams and trip wires move the crisis to lower Re — golf balls exploit this.',
    'Models tested below the crisis can mislead: Reynolds number matters for bluff bodies.'
  ],
  pitfalls: [
    'Dimples reduce drag by reducing skin friction — They increase skin friction; they cut drag by making the layer turbulent so that it separates later and the wake is smaller.',
    'Rougher is always better for a ball — Above the crisis a rough ball has more drag than a smooth one in its own supercritical range; roughness helps only at speeds where the smooth ball would still be subcritical.',
    'The drag crisis means the drag coefficient falls smoothly with speed — The fall is abrupt, over a factor of about two in Reynolds number, and in that range the flow can be unsteady and asymmetric.'
  ],
  formulas: [
    {
      name: 'Reynolds number of a sphere or cylinder',
      expr: 'Re = V*d/nu', tex: '\\mathrm{Re} = \\frac{V d}{\\nu}',
      vars: {
        Re: { name: 'Reynolds number (based on diameter)', tex: '\\mathrm{Re}' },
        V: { name: 'speed', q: 'speed', unit: 'm/s', value: 70 },
        d: { name: 'diameter', q: 'length', unit: 'mm', value: 42.7 },
        nu: { name: 'kinematic viscosity', q: 'kinvisc', unit: 'm²/s', value: 1.46e-5, tex: '\\nu' }
      },
      note: 'The drag crisis of a smooth sphere is near Re ≈ 3 × 10⁵ (3–4 × 10⁵ for the minimum); for a golf ball about 5 × 10⁴.',
      stories: {
        Re: 'A golf ball {d} across flies at {V} through air with ν = {nu}. What is its Reynolds number?',
        V: 'A smooth ball {d} across reaches its drag crisis at a Reynolds number of {Re}, in air with ν = {nu}. At what speed?'
      }
    },
    {
      name: 'Drag of a sphere',
      expr: 'D = CD*0.5*rho*V^2*pi*d^2/4', tex: 'D = C_D\\,\\tfrac{1}{2}\\rho V^2\\, \\frac{\\pi d^2}{4}',
      vars: {
        D: { name: 'drag', q: 'force', unit: 'N' },
        CD: { name: 'drag coefficient (frontal area)', value: 0.25, min: 0.01, max: 3, tex: 'C_D' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'speed', q: 'speed', unit: 'm/s', value: 70 },
        d: { name: 'diameter', q: 'length', unit: 'mm', value: 42.7 }
      },
      note: 'Reference area: the frontal area πd²/4. C_D ≈ 0.47 for a smooth sphere below the crisis, ≈ 0.25 for a golf ball at driving speeds.',
      practice: { unknowns: ['D', 'CD', 'V'] },
      stories: {
        D: 'A golf ball {d} across flies at {V} with a drag coefficient of {CD}, in air of density {rho}. What drag acts on it?',
        CD: 'A ball {d} across is measured to feel {D} of drag at {V} (density {rho}). What is its drag coefficient?'
      }
    }
  ],
  examples: [
    {
      title: 'Why golf balls have dimples',
      q: 'A golf ball (42.7 mm, 45.9 g) leaves the tee at 70 m/s. Compare its drag and deceleration with $C_D = 0.25$ (dimpled) and $C_D = 0.5$ (a smooth ball at the same Reynolds number).',
      steps: [
        '$\\mathrm{Re} = 70 \\times 0.0427/1.46\\times10^{-5} = 2.0\\times10^5$ — below a smooth sphere\'s crisis but well above a golf ball\'s.',
        'Dynamic pressure $q = \\tfrac12 \\times 1.225 \\times 70^2 = 3000$ Pa; frontal area $\\pi \\times 0.0427^2/4 = 1.43\\times10^{-3}$ m².',
        'Dimpled: $D = 0.25 \\times 3000 \\times 1.43\\times10^{-3} = 1.07$ N, a deceleration of $1.07/0.0459 = 23$ m/s² (2.4 g).',
        'Smooth: $D = 2.15$ N and 4.8 g — more than four times the ball\'s weight (0.45 N).'
      ],
      a: 'About 1.1 N with dimples against 2.1 N without: the dimples halve the drag at driving speed.'
    },
    {
      title: 'A chimney and its model',
      q: 'A chimney 3 m in diameter stands in a 20 m/s wind. A 1:100 model is tested at 40 m/s in a wind tunnel. Compare the Reynolds numbers.',
      steps: [
        'Full size: $\\mathrm{Re} = 20 \\times 3/1.46\\times10^{-5} = 4.1\\times10^6$ — above the crisis, $C_D \\approx 0.5$–0.7.',
        'Model: $\\mathrm{Re} = 40 \\times 0.03/1.46\\times10^{-5} = 8.2\\times10^4$ — subcritical, $C_D \\approx 1.2$.',
        'The model would overpredict the drag by roughly a factor of two and get the wake and the shedding wrong.'
      ],
      a: 'Re = 4 × 10⁶ against 8 × 10⁴: the model is on the wrong side of the drag crisis, so it needs roughness, a pressurised tunnel or a correction.'
    }
  ],
  quiz: [
    { q: 'How can a smooth sphere feel less drag at a higher speed?', choices: ['the air becomes less dense', 'the boundary layer turns turbulent, separates later and the wake narrows', 'skin friction disappears', 'the sphere starts to spin'], a: 1,
      why: 'Near Re ≈ 3 × 10⁵ transition moves ahead of separation; the turbulent layer clings on round the back, the wake shrinks and the pressure drag collapses — more than offsetting the rise in speed.' },
    { q: 'A turbulent boundary layer has more skin friction, yet it lowers the total drag of a sphere in the drag crisis.', a: true,
      why: 'A sphere\'s drag is mostly pressure drag; the small rise in friction is dwarfed by the fall in pressure drag from the narrower wake.' },
    { q: 'At what speed does a smooth sphere 0.22 m in diameter (a football without seams) reach $\\mathrm{Re} = 3.5\\times10^5$ in sea-level air ($\\nu = 1.46\\times10^{-5}$ m²/s)? Answer in m/s.', answer: 23.2, unit: 'm/s',
      why: '$V = \\mathrm{Re}\\,\\nu/d = 3.5\\times10^5 \\times 1.46\\times10^{-5}/0.22 = 23$ m/s — the speed of a hard kick.' },
    { q: 'Roughly where does the laminar boundary layer separate on a sphere below the drag crisis?', choices: ['at the front stagnation point', 'about 80° from the front, just before the widest point', 'about 120° from the front', 'at the very back'], a: 1,
      why: 'Laminar separation is at about 80°; after the crisis a turbulent layer holds on to about 120°.' },
    { q: 'Dimples move the drag crisis of a golf ball to…', choices: ['a higher Reynolds number', 'a lower Reynolds number', 'the same Reynolds number', 'they remove it entirely'], a: 1,
      why: 'Dimples trip transition early, so the crisis happens near Re ≈ 5 × 10⁴ instead of 3 × 10⁵ — below driving speeds.' }
  ],
  problems: [
    { q: 'A smooth ball 67 mm across (a tennis-ball size, but without fuzz) flies at 30 m/s in sea-level air. Find its Reynolds number.', answer: 137700, tol: 0.02,
      steps: ['$\\mathrm{Re} = 30 \\times 0.067/1.46\\times10^{-5} = 1.38\\times10^5$ — subcritical for a smooth ball.'] }
  ],
  applications: [
    'Ball design in golf, cricket, football, baseball and tennis.',
    'Wind loads on chimneys, towers, cables and pipelines, and the Reynolds-number corrections their model tests need.',
    'Wind-tunnel testing of bluff bodies, where roughness strips simulate high Reynolds numbers.',
    'Rotating cylinders and spheres, where the crisis interacts with spin and can even reverse the Magnus force.'
  ],
  history: 'In 1912 Gustave Eiffel, measuring spheres in his aerodynamic laboratory in Paris, found that the drag force fell as the speed rose — contradicting results from Göttingen, which had used a more turbulent tunnel. Prandtl resolved the dispute in 1914 with a thin wire ring round a sphere: the tripped layer gave the low drag at once, proving that transition in the boundary layer was the cause.',
  sim: 'visc-drag-crisis'
},

{
  id: 'vortex-shedding', parent: 'separation-wakes', title: 'Vortex shedding and wakes', level: 2,
  short: 'Behind a cylinder or any bluff body the separated shear layers roll up and shed vortices alternately from each side — a Kármán vortex street — at a frequency f = St·V/d with a Strouhal number of about 0.2. It makes wires sing, chimneys sway and clouds form streets behind islands.',
  keywords: ['vortex shedding', 'Karman vortex street', 'Strouhal number', 'wake', 'Aeolian tones', 'singing wires', 'vortex-induced vibration', 'lock-in', 'helical strakes', 'bluff body', 'shedding frequency'],
  prereq: ['flow-separation', 'strouhal-froude', 'cylinder-flow'],
  related: ['drag-crisis', 'bluff-bodies', 'galloping-bridges', 'flutter', 'wind-loads', 'turbulence', 'vorticity-circulation', 'physics:driven-oscillations'],
  body: `
Hold a stick upright in a stream and watch the water behind it: small whirlpools peel off, first from one side, then the other, and drift away in two staggered rows. The same happens in air behind wires, masts, chimneys, bridge decks and car aerials — invisible, but audible as the whistle of wires in the wind and visible from space as rows of swirling clouds behind mountainous islands.

### A street of vortices
Behind a circular cylinder the pattern depends on the Reynolds number $\\mathrm{Re} = Vd/\\nu$:

| Re | Wake |
|---|---|
| below about 5 | no separation: the flow closes smoothly behind the cylinder |
| 5 to 47 | two steady, symmetric vortices sit in the lee, growing with Re |
| 47 to about 190 | the pair becomes unstable and sheds alternately: a regular, laminar **Kármán vortex street** |
| 190 to about 3 × 10⁵ | the wake turns three-dimensional and turbulent, but shedding stays strongly periodic |
| about 3 × 10⁵ to 3.5 × 10⁶ | after the [[drag-crisis]]: a narrow wake, weak and irregular shedding |
| above about 3.5 × 10⁶ | periodic shedding returns |

Each shed vortex carries circulation of alternating sign. Theodore von Kármán showed in 1911–12 that two staggered rows of opposite vortices are stable only if the row spacing $h$ and the vortex spacing $a$ satisfy $h/a \\approx 0.28$ — close to what is seen. The vortices drift downstream at about 85 % of the stream speed.

### The Strouhal number
The shedding frequency scales with speed over size:

$$f = \\mathrm{St}\\,\\frac{V}{d}$$

and the [[strouhal-froude|Strouhal number]] St is remarkably constant — about 0.2 for a circular cylinder over three decades of Reynolds number, 300 to $2\\times10^5$. In the laminar range it follows Roshko's fit, $\\mathrm{St} = 0.212\\,(1 - 21.2/\\mathrm{Re})$. Other shapes have other values: about 0.12–0.14 for a square section, about 0.15 for a flat plate across the flow.

| Situation | $d$ | $V$ | $f$ |
|---|---|---|---|
| Telephone wire | 3 mm | 12 m/s | ≈ 800 Hz — an audible Aeolian tone |
| Car aerial | 6 mm | 30 m/s | ≈ 1000 Hz |
| Flagpole | 0.1 m | 10 m/s | ≈ 20 Hz |
| Chimney | 2 m | 8 m/s | ≈ 0.8 Hz |
| Island (cloud street) | 30 km | 10 m/s | about one vortex pair every 4 hours |

### Forces and vibration
Each vortex leaving one side changes the circulation round the cylinder, so the cylinder feels an **alternating side force** at the shedding frequency $f$, and a fluctuating drag at $2f$. Its amplitude, $\\hat{C}_L\\,\\tfrac12\\rho V^2 d$ per unit length, with $\\hat{C}_L$ of order 0.5 below the drag crisis, is comparable with the drag itself. If $f$ comes close to a natural frequency of the structure, the structure starts to move; its motion then organises the shedding, which **locks in** to the structural frequency over a range of wind speeds ([[physics:driven-oscillations|resonance]]). This vortex-induced vibration has cracked chimneys, fatigued heat-exchanger tubes and set power lines and bridge cables swinging. The critical wind speed is $V_{cr} = f_n d/\\mathrm{St}$.

Cures: **helical strakes** (three spiral fins about a tenth of the diameter high, wound with a pitch of about five diameters) that break up the spanwise coherence of shedding; perforated shrouds; splitter plates; more damping (tuned mass dampers, as in tall buildings); or a stiffer structure that pushes $V_{cr}$ above the winds it will ever meet.

The Tacoma Narrows bridge collapse of 1940 is often blamed on vortex shedding, but its final twisting motion was aeroelastic flutter — see [[galloping-bridges]] and [[flutter]].
`,
  ideas: [
    'Behind a bluff body the separated shear layers roll up and shed vortices alternately: a Kármán vortex street.',
    'Shedding frequency f = St · V/d, with St ≈ 0.2 for a circular cylinder from Re ≈ 300 to 2 × 10⁵.',
    'Regular shedding begins at Re ≈ 47; it weakens after the drag crisis and returns above about 3.5 × 10⁶.',
    'The cylinder feels an alternating side force at f and a drag fluctuation at 2f.',
    'If f matches a structural natural frequency, lock-in and large vibrations follow; strakes, dampers and stiffness are the cures.'
  ],
  pitfalls: [
    'Vortex shedding is random turbulence — It is a strongly periodic, organised motion with a sharp frequency, even when the wake is turbulent.',
    'The side force from shedding is small because the vortices are behind the body — The alternating side force is comparable with the drag and acts at a single frequency, which is why it can drive resonance.',
    'The Tacoma Narrows bridge fell because of a simple Kármán street — Its destructive twisting was torsional flutter, a self-excited aeroelastic instability; vortex shedding caused its earlier, milder vertical motion.'
  ],
  formulas: [
    {
      name: 'Shedding frequency (Strouhal number)',
      expr: 'f = St*V/d', tex: 'f = \\mathrm{St}\\,\\frac{V}{d}',
      vars: {
        f: { name: 'shedding frequency (one side)', q: 'frequency', unit: 'Hz' },
        St: { name: 'Strouhal number', value: 0.2, min: 0.05, max: 0.6, tex: '\\mathrm{St}' },
        V: { name: 'flow speed', q: 'speed', unit: 'm/s', value: 12 },
        d: { name: 'diameter (cross-flow size)', q: 'length', unit: 'mm', value: 3 }
      },
      note: 'St ≈ 0.2 for a circular cylinder, 300 < Re < 2 × 10⁵ (design codes often use 0.18); about 0.12–0.14 for square sections. f is the frequency of vortex pairs, and of the side force.',
      practice: { unknowns: ['f', 'V', 'd'] },
      stories: {
        f: 'A wire {d} thick hums in a {V} wind. If the Strouhal number is {St}, what note (frequency) does it sing?',
        V: 'A chimney {d} across has a natural frequency of {f}. With a Strouhal number of {St}, at what wind speed would shedding match it?'
      }
    },
    {
      name: 'Strouhal number in the laminar street (Roshko)',
      expr: 'St = 0.212*(1 - 21.2/Re)', tex: '\\mathrm{St} = 0.212\\left(1 - \\frac{21.2}{\\mathrm{Re}}\\right)',
      vars: {
        St: { name: 'Strouhal number', tex: '\\mathrm{St}' },
        Re: { name: 'Reynolds number (based on diameter)', value: 100, min: 47, max: 190, tex: '\\mathrm{Re}' }
      },
      note: 'Roshko\'s 1954 fit for the laminar vortex street, 50 < Re < 150. At higher Re, St levels off near 0.2 (0.212(1 − 12.7/Re) from 300 to 2000).',
      stories: {
        St: 'A thin cylinder in a slow flow sheds a laminar vortex street at a Reynolds number of {Re}. What is its Strouhal number?',
        Re: 'A laminar vortex street is measured to have a Strouhal number of {St}. At what Reynolds number is the cylinder running?'
      }
    },
    {
      name: 'Alternating side force from shedding',
      expr: 'F = CLa*0.5*rho*V^2*d*L', tex: 'F = \\hat{C}_L\\,\\tfrac{1}{2}\\rho V^2\\, d\\, L',
      vars: {
        F: { name: 'amplitude of the side force', q: 'force', unit: 'N' },
        CLa: { name: 'amplitude of the fluctuating lift coefficient', value: 0.5, min: 0, max: 2, tex: '\\hat{C}_L' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'wind speed', q: 'speed', unit: 'm/s', value: 8 },
        d: { name: 'diameter', q: 'length', unit: 'm', value: 2 },
        L: { name: 'length over which the shedding is in step', q: 'length', unit: 'm', value: 10 }
      },
      note: 'Ĉ_L is of order 0.3–0.7 for a smooth cylinder below the drag crisis and much smaller above it; shedding is in step only over a few diameters unless the structure itself is vibrating (lock-in).',
      stories: { F: 'Vortices shed in step along {L} of a chimney {d} across, in a {V} wind (density {rho}), with a fluctuating lift coefficient of {CLa}. How large is the alternating side force?' }
    }
  ],
  examples: [
    {
      title: 'The singing wire',
      q: 'A telephone wire 3 mm thick is exposed to a 12 m/s wind in sea-level air. What tone does it sing?',
      steps: [
        '$\\mathrm{Re} = 12 \\times 0.003/1.46\\times10^{-5} = 2470$ — in the range where St ≈ 0.21 (Roshko: $0.212(1 - 12.7/2470) = 0.211$).',
        '$f = 0.21 \\times 12/0.003 = 840$ Hz — close to the A♭ an octave and a sixth above middle C.',
        'In gusty wind the speed — and so the pitch — wanders, which is why wires moan rather than whistle a steady note.'
      ],
      a: 'About 800–850 Hz: a clearly audible Aeolian tone.'
    },
    {
      title: 'A chimney at risk',
      q: 'A steel chimney 2 m in diameter has its first natural frequency at 0.8 Hz. At what wind speed does vortex shedding excite it (take St = 0.2)? What alternating force acts if shedding is in step over the top 10 m?',
      steps: [
        '$V_{cr} = f_n d/\\mathrm{St} = 0.8 \\times 2/0.2 = 8$ m/s — a common, moderate wind.',
        'At 8 m/s: $q = \\tfrac12 \\times 1.225 \\times 8^2 = 39.2$ Pa.',
        'With $\\hat{C}_L = 0.5$: $F = 0.5 \\times 39.2 \\times 2 \\times 10 = 392$ N, reversing 0.8 times a second — millions of cycles a year, and growing if the chimney locks in.',
        'Hence helical strakes on the top third of many steel chimneys.'
      ],
      a: 'About 8 m/s, with an alternating force of roughly 400 N that can build up by resonance — a fatigue problem strakes are designed to prevent.'
    }
  ],
  quiz: [
    { q: 'A cylinder in steady flow sheds vortices at frequency f. At what frequency does its drag fluctuate?', choices: ['f/2', 'f', '2f', 'the drag does not fluctuate'], a: 2,
      why: 'The side force reverses with each vortex (frequency f), but the drag rises with each vortex whichever side it leaves from — twice per cycle.' },
    { q: 'If the wind doubles, the note sung by a wire…', choices: ['stays the same', 'rises by an octave (doubles in frequency)', 'rises by two octaves', 'falls'], a: 1,
      why: 'f = St·V/d with St nearly constant: doubling V doubles f, one octave up.' },
    { q: 'What shedding frequency do you expect behind a 30 mm pole in a 5 m/s wind (St = 0.2)? Answer in hertz.', answer: 33.3, unit: 'Hz',
      why: '$f = 0.2 \\times 5/0.03 = 33$ Hz.' },
    { q: 'A cylinder at Re = 20 sheds a regular vortex street.', a: false,
      why: 'Below Re ≈ 47 the two vortices in the lee stay attached and steady; periodic shedding starts only above that.' },
    { q: 'Helical strakes on a chimney work by…', choices: ['making the chimney stiffer', 'reducing the drag', 'breaking the shedding out of step along the height', 'raising the Strouhal number to 1'], a: 2,
      why: 'Strakes make the separation line vary round and up the chimney, so vortices are not shed in step and the net alternating force is small.' }
  ],
  problems: [
    { q: 'A bridge hanger cable 0.15 m in diameter has a natural frequency of 2.5 Hz. With St = 0.2, at what wind speed will vortex shedding excite it?', answer: 1.875, unit: 'm/s', tol: 0.02,
      steps: ['$V_{cr} = f_n d/\\mathrm{St} = 2.5 \\times 0.15/0.2 = 1.9$ m/s — a light breeze. Higher modes are excited at proportionally higher speeds.'] }
  ],
  applications: [
    'Chimneys, towers, masts, bridge cables, power lines and offshore risers: vortex-induced vibration and its suppression.',
    'Vortex flowmeters, which count shed vortices behind a bluff bar to measure flow rate.',
    'Heat exchangers, where tube bundles can be shaken to failure by shedding.',
    'Aeolian tones: singing wires, whistling car roof bars and the design of quieter ones.'
  ],
  history: 'Vincenc Strouhal measured the tones of wires whirled through air in Würzburg in 1878 and found the frequency proportional to speed over diameter. Henri Bénard photographed alternating vortices in 1908, and von Kármán explained the stability of the staggered street in 1911–12 — the story goes that he began by wondering why a doctoral student\'s cylinder experiment in Göttingen would never settle down. Leonardo da Vinci had already sketched such wakes four centuries earlier.',
  sim: 'visc-vortex-street'
},

{
  id: 'flow-control', parent: 'separation-wakes', title: 'Flow control: vortex generators and more', level: 2,
  short: 'Ways to make the boundary layer do what you want: vortex generators and turbulators that re-energise it against separation, suction and blowing that remove or feed it, and riblets and laminar-flow control that cut its friction.',
  keywords: ['flow control', 'vortex generators', 'VG', 'turbulator', 'boundary layer suction', 'blowing', 'riblets', 'shark skin', 'laminar flow control', 'hybrid laminar flow', 'plasma actuator', 'synthetic jet'],
  prereq: ['flow-separation', 'turbulent-boundary-layer', 'skin-friction'],
  related: ['high-lift-devices', 'transition', 'drag-crisis', 'stall', 'special-airfoils', 'racing-downforce', 'vehicle-aerodynamics', 'wind-turbines'],
  body: `
The boundary layer is thin — millimetres to centimetres — yet it decides whether a wing stalls, how much fuel an airliner burns and how much pressure a diffuser recovers. So engineers have learned to manipulate it. There are two opposite aims: **keep it attached** (fight separation, even at the cost of friction) and **cut its friction** (keep it laminar, or tame its turbulence).

### Vortex generators
A **vortex generator** (VG) is a small vane standing up from the surface, set at 15–20° to the local flow and about as tall as the boundary layer (often 5–25 mm on an aircraft). Like a tiny wing it sheds a tip vortex — but this one runs *along* the surface, a corkscrew that sweeps fast outer air down to the wall and lifts slow air out. The near-wall layer is re-energised and its profile made fuller, so it can climb a steeper pressure rise before it [[flow-separation|separates]]. VGs are usually set in rows ahead of the region that would separate, spaced a few heights apart, in co-rotating or counter-rotating pairs.

They appear on wings ahead of ailerons and flaps, on tailplanes and fins, in short-take-off kits for light aircraft, near the roots of wind-turbine blades, on the roofs of rally cars and under racing-car floors. Their cost is a small parasite drag; smaller "micro" VGs, a fifth to a half of the layer's thickness, do much of the job for less.

> [!warn] Vortex generators change an aircraft's stall and handling. On certified aircraft they are fitted only as approved modifications, and the aircraft is flown according to its approved flight manual and supplements, training and the rules of the air.

### Turbulators and trips
On sailplanes, model aircraft and small drones a laminar layer may separate and form a **laminar separation bubble**. A zig-zag tape or a row of small bumps (a turbulator) makes the layer turbulent just before the pressure rise, so it stays attached; the golf ball's dimples are the same idea ([[drag-crisis]]).

### Suction and blowing
**Suction** through slots or a porous skin removes the slow air at the bottom of the layer; what is left is thin and healthy. With uniform suction velocity $v_s$ the layer stops growing altogether, reaching the *asymptotic suction profile* $u/U = 1 - e^{-v_s y/\\nu}$, with

$$\\delta^* = \\frac{\\nu}{v_s}, \\qquad c_f = \\frac{2 v_s}{U}.$$

A few centimetres per second of suction holds a laminar layer at a fraction of a millimetre thick; it also keeps it laminar, the aim of **laminar flow control**, flown on test aircraft since the 1960s. **Blowing** a thin, fast sheet of air tangentially along the surface adds momentum instead: blown flaps, leading-edge slots and slats (passive blowing, see [[high-lift-devices]]) and the Coandă devices of circulation-control wings.

### Riblets
Turbulent friction is made mostly by the near-wall streaks and their bursts. Fine streamwise grooves — **riblets** — with a spacing of about 15 wall units ($s^+ = s\\,u_\\tau/\\nu \\approx 15$) hinder the spanwise wandering of the streaks and cut turbulent friction by up to about 5–8 % in the laboratory. Shark skin, with its grooved scales, does something similar. On an airliner in cruise the right spacing is under a tenth of a millimetre; airline trials of riblet films report fuel savings of the order of 1 %.

### Active control
Research systems pulse the flow instead of steadily blowing: synthetic jets (a membrane breathing through a slot), plasma actuators that push air with an electric discharge, and closed-loop controllers that sense separation and act on it. Their promise is large effects for little energy; their challenge is robustness in service.
`,
  ideas: [
    'Vortex generators shed streamwise vortices that mix fast air down to the wall and delay separation; their cost is a little drag.',
    'Turbulators trip a laminar layer before a pressure rise so it stays attached (the golf-ball idea).',
    'Suction removes the slow near-wall air: with uniform suction δ* = ν/v_s and c_f = 2v_s/U.',
    'Blowing adds momentum to the layer: blown flaps, slots and circulation control.',
    'Riblets with spacing s⁺ ≈ 15 cut turbulent friction by a few per cent by taming near-wall streaks.'
  ],
  pitfalls: [
    'Vortex generators reduce drag — On their own they add a little drag; they pay only where they prevent separation, which would cost much more.',
    'Riblets work by making the surface smoother — They are deliberately grooved; they reduce friction by damping the sideways motions of near-wall turbulence, and only at the right spacing in wall units.',
    'Bigger vortex generators are always better — Vanes much taller than the boundary layer add drag without more benefit; micro-VGs a fraction of δ tall often do nearly as well.'
  ],
  formulas: [
    {
      name: 'Displacement thickness with uniform suction',
      expr: 'dstar = nu/vsuc', tex: '\\delta^* = \\frac{\\nu}{v_s}',
      vars: {
        dstar: { name: 'displacement thickness (asymptotic)', q: 'length', unit: 'mm', tex: '\\delta^*' },
        nu: { name: 'kinematic viscosity', q: 'kinvisc', unit: 'm²/s', value: 1.46e-5, tex: '\\nu' },
        vsuc: { name: 'suction velocity through the wall', q: 'speed', unit: 'cm/s', value: 2, tex: 'v_s' }
      },
      note: 'The asymptotic suction profile, reached far downstream of the start of uniform suction; it does not depend on the stream speed. The momentum thickness is half of δ*, so H = 2.',
      stories: {
        dstar: 'Air (ν = {nu}) is sucked through a porous wing skin at {vsuc}. How thick, in displacement thickness, does the laminar layer settle?',
        vsuc: 'A laminar-flow designer wants the displacement thickness held at {dstar} in air with ν = {nu}. What suction velocity is needed?'
      }
    },
    {
      name: 'Skin friction with uniform suction',
      expr: 'cf = 2*vsuc/U', tex: 'c_f = \\frac{2\\, v_s}{U}',
      vars: {
        cf: { name: 'skin-friction coefficient', tex: 'c_f' },
        vsuc: { name: 'suction velocity', q: 'speed', unit: 'cm/s', value: 2, tex: 'v_s' },
        U: { name: 'free-stream speed', q: 'speed', unit: 'm/s', value: 50 }
      },
      note: 'From the momentum integral with a steady layer: the wall friction is balanced exactly by the momentum sucked away. Low compared with a turbulent 0.003 — but the pumping power must be paid for.',
      stories: { cf: 'A wing panel at {U} has uniform suction of {vsuc}. What skin-friction coefficient does the asymptotic layer have?' }
    },
    {
      name: 'Riblet spacing in wall units',
      expr: 's = splus*nu/utau', tex: 's_r = \\frac{s^+\\,\\nu}{u_\\tau}',
      vars: {
        s: { name: 'riblet spacing', q: 'length', unit: 'µm', tex: 's_r' },
        splus: { name: 'spacing in wall units', value: 15, min: 5, max: 40, tex: 's^+' },
        nu: { name: 'kinematic viscosity', q: 'kinvisc', unit: 'm²/s', value: 3.9e-5, tex: '\\nu' },
        utau: { name: 'friction velocity', q: 'speed', unit: 'm/s', value: 7.27, tex: 'u_\\tau' }
      },
      note: 'Best friction reduction near s⁺ ≈ 15–17; above about 25–30 riblets start to add drag. Starting values: an airliner cruising at 11 km (ν = 3.9 × 10⁻⁵ m²/s, u_τ ≈ 7.3 m/s).',
      stories: {
        s: 'For riblets at {splus} wall units, with ν = {nu} and a friction velocity of {utau}, what groove spacing is needed?',
        utau: 'Riblets with a spacing of {s} sit at their optimum of {splus} wall units in air with ν = {nu}. What friction velocity is that designed for?'
      }
    }
  ],
  examples: [
    {
      title: 'Sizing vortex generators',
      q: 'A light aircraft at 40 m/s needs vortex generators ahead of its aileron at about 45 cm from the leading edge. Treating the wing as a flat plate turbulent from the leading edge, how tall should they be?',
      steps: [
        '$\\mathrm{Re}_x = 40 \\times 0.45/1.46\\times10^{-5} = 1.23\\times10^6$; $\\mathrm{Re}_x^{1/5} = 16.5$.',
        '$\\delta = 0.37 \\times 0.45/16.5 = 0.010$ m = 10 mm.',
        'Conventional VGs are about as tall as the layer: roughly 10 mm, spaced a few heights apart. Micro-VGs would be 2–5 mm.'
      ],
      a: 'About 10 mm tall — the local boundary-layer thickness.'
    },
    {
      title: 'Riblets for an airliner',
      q: 'On an airliner at cruise (11 000 m, $\\rho = 0.364$ kg/m³, $\\nu = 3.9\\times10^{-5}$ m²/s, 230 m/s) the local skin-friction coefficient on the fuselage is about 0.002. What riblet spacing gives $s^+ = 15$?',
      steps: [
        '$\\tau_w = c_f\\, \\tfrac12\\rho U^2 = 0.002 \\times \\tfrac12 \\times 0.364 \\times 230^2 = 19.3$ Pa.',
        '$u_\\tau = \\sqrt{19.3/0.364} = 7.27$ m/s.',
        '$s = s^+\\nu/u_\\tau = 15 \\times 3.9\\times10^{-5}/7.27 = 8.0\\times10^{-5}$ m.'
      ],
      a: 'About 80 µm — finer than a human hair is thick, which is why riblets come as precision films or laser-structured paint.'
    }
  ],
  quiz: [
    { q: 'How do vortex generators delay separation?', choices: ['by sucking the boundary layer away', 'by making the surface smoother', 'by shedding streamwise vortices that mix fast outer air down towards the wall', 'by heating the boundary layer'], a: 2,
      why: 'Each vane acts as a tiny wing whose tip vortex runs along the surface, stirring high-momentum air into the slow near-wall layer so it can climb a steeper pressure rise.' },
    { q: 'Riblets reduce turbulent skin friction by making the surface smoother.', a: false,
      why: 'They are grooves, deliberately. At a spacing of about 15 wall units they hinder the spanwise motion of near-wall streaks and so reduce the turbulence that creates friction.' },
    { q: 'What uniform suction velocity holds the displacement thickness of a laminar layer in sea-level air ($\\nu = 1.46\\times10^{-5}$ m²/s) at 0.5 mm? Answer in m/s.', answer: 0.0292, unit: 'm/s',
      why: '$v_s = \\nu/\\delta^* = 1.46\\times10^{-5}/5\\times10^{-4} = 0.029$ m/s — about 3 cm/s.' },
    { q: 'A glider wing shows a laminar separation bubble near mid-chord. A common fix is…', choices: ['vortex generators ten times taller than the layer', 'a zig-zag turbulator tape just ahead of the bubble', 'polishing the wing', 'reducing the wing area'], a: 1,
      why: 'Tripping the layer just before the pressure rise makes it turbulent, so it stays attached instead of separating and reattaching in a bubble.' }
  ],
  problems: [
    { q: 'With uniform suction of 3 cm/s under a 60 m/s stream, what is the skin-friction coefficient of the asymptotic suction layer?', answer: 0.001, tol: 0.02,
      steps: ['$c_f = 2v_s/U = 2 \\times 0.03/60 = 0.001$ — about a third of a typical turbulent value.'] }
  ],
  applications: [
    'Vortex generators on wings, tails, wind-turbine blades, rally cars and in diffusers.',
    'Turbulators on sailplanes, model aircraft and small drones.',
    'Laminar-flow control by suction on test aircraft and airliner tail surfaces; blown flaps and circulation control.',
    'Riblet films and structured paints on aircraft, and shark-skin swimsuits in sport.'
  ],
  history: 'Prandtl showed in 1904 that sucking the boundary layer away through a slot keeps flow attached to a cylinder. Vortex generators were invented by H. D. Taylor at United Aircraft in 1947 — to stop separation in diffusers. The Northrop X-21 flew slot-suction laminar flow control in 1963–65, and riblets were developed at NASA Langley and in Berlin in the late 1970s and 1980s, inspired partly by the skin of fast sharks.',
  sim: [{ id: 'visc-separation', params: { control: 'vg' } }, { id: 'visc-drag-crisis', params: { body: 'golf' }, title: 'Dimples and the drag crisis' }]
},

{
  id: 'turbulence', parent: 'separation-wakes', title: 'Turbulence', level: 3,
  short: 'The chaotic, swirling state of most real flows: eddies of every size, from the scale of the flow down to the Kolmogorov scale, pass energy down a cascade until viscosity turns it into heat. It mixes momentum, heat and pollutants far faster than molecules can.',
  keywords: ['turbulence', 'eddies', 'energy cascade', 'Kolmogorov scale', 'dissipation rate', 'five-thirds law', 'energy spectrum', 'Reynolds stress', 'eddy viscosity', 'mixing length', 'turbulence intensity', 'direct numerical simulation'],
  prereq: ['reynolds-number', 'transition', 'vorticity-circulation'],
  related: ['turbulent-boundary-layer', 'turbulence-models', 'cfd', 'atmospheric-turbulence', 'navier-stokes', 'vortex-shedding', 'physics:convection'],
  body: `
Smoke from a candle rises in a smooth thread, then suddenly breaks into swirls; a river runs glassy over a sill and churns below it. Almost every flow of engineering interest — around aircraft, in pipes, in the atmosphere, in engines — is **turbulent**. Richard Feynman called it the most important unsolved problem of classical physics: the equations ([[navier-stokes]]) are known, but their solutions at high Reynolds number are chaotic.

### What makes a flow turbulent
Turbulence is not just noise. It is **irregular** (unpredictable in detail, though its averages are reproducible), **rotational** and **three-dimensional** (full of vortices that stretch and tilt one another), **dissipative** (it needs a supply of energy or it dies away) and **diffusive**: it mixes momentum, heat and substances thousands of times faster than molecular motion. It appears when the [[reynolds-number|Reynolds number]] is high enough that inertia overwhelms viscous damping ([[transition]]).

Engineers split each velocity into a mean and a fluctuation, $u = \\bar{u} + u'$. The **turbulence intensity** $\\mathrm{Tu} = u'_{\\mathrm{rms}}/\\bar{u}$ is a few hundredths of a per cent in a quiet wind tunnel, about 5–10 % in a boundary layer or a jet, and much more in a wake.

### The cascade
Lewis Fry Richardson pictured it in 1922: big whirls feed little whirls, which feed smaller ones, down to where viscosity finally smears them out. The large eddies, of size $L$ (the width of a wake, the thickness of a boundary layer) and velocity $u'$, draw energy from the mean flow. They are unstable and break up in about one turnover time $L/u'$, handing their energy on. So the rate at which energy enters the cascade, per kilogram of fluid, is set by the big eddies alone:

$$\\varepsilon \\approx \\frac{u'^3}{L}$$

— independent of viscosity. In 1941 Andrei Kolmogorov argued that the smallest eddies can depend only on $\\varepsilon$ and $\\nu$, which fixes their size, time and speed:

$$\\eta = \\left(\\frac{\\nu^3}{\\varepsilon}\\right)^{1/4}, \\qquad \\tau_\\eta = \\sqrt{\\nu/\\varepsilon}, \\qquad u_\\eta = (\\nu\\varepsilon)^{1/4}$$

In between, eddies neither feel viscosity nor the forcing, and the energy per unit wavenumber follows the famous **five-thirds law**, $E(k) = C\\,\\varepsilon^{2/3} k^{-5/3}$ with $C \\approx 1.5$ — confirmed in tidal channels, wind tunnels and the atmosphere.

| Flow | $u'$ | $L$ | $\\varepsilon$ | Kolmogorov scale $\\eta$ | $L/\\eta$ |
|---|---|---|---|---|---|
| Stirred cup of coffee (water) | 5 cm/s | 3 cm | 0.004 W/kg | 0.12 mm | 240 |
| Wind-tunnel stream, Tu = 1 % at 50 m/s | 0.5 m/s | 0.1 m | 1.25 W/kg | 0.23 mm | 440 |
| Wind near the ground | 1 m/s | 100 m | 0.01 W/kg | 0.75 mm | 130 000 |

The range of scales grows as $L/\\eta \\approx \\mathrm{Re}_L^{3/4}$ with $\\mathrm{Re}_L = u'L/\\nu$. That is why turbulence is so hard to compute: resolving every eddy in three dimensions — direct numerical simulation — needs about $\\mathrm{Re}_L^{9/4}$ grid points, some $10^{15}$ for the wind example.

### Eddy viscosity
For engineering, the effect of the eddies on the mean flow matters more than the eddies themselves. Their fluctuations carry momentum across the flow — the **Reynolds stresses** $-\\rho\\,\\overline{u'v'}$ — much as molecules do, only far more effectively. Boussinesq (1877) proposed treating this as an extra, **eddy viscosity**: a property of the flow, not of the fluid, roughly the size of the big eddies times their velocity. In a boundary layer it is hundreds of times the molecular viscosity; in the atmosphere, millions. Prandtl's mixing length (1925) made it concrete near walls, and today's [[turbulence-models|turbulence models]] in [[cfd|CFD]] are, at heart, recipes for the eddy viscosity.
`,
  ideas: [
    'Turbulence is irregular, rotational, three-dimensional, dissipative and strongly mixing; it appears at high Reynolds number.',
    'Energy enters at the large eddies at a rate ε ≈ u′³/L and cascades to smaller eddies without loss.',
    'It is dissipated at the Kolmogorov scale η = (ν³/ε)^{1/4}; between the two, E(k) ∝ ε^{2/3} k^{−5/3}.',
    'The range of scales L/η ≈ Re^{3/4} grows with Re, which makes direct simulation very expensive (about Re^{9/4} grid points).',
    'Engineers model the momentum carried by eddies as an eddy viscosity, a property of the flow, not of the fluid.'
  ],
  pitfalls: [
    'Viscosity controls how much energy turbulence dissipates — The dissipation rate is set by the large eddies (ε ≈ u′³/L); viscosity only decides at what small scale it happens.',
    'Turbulence is random noise that averages out — Its averages are reproducible, but they include the Reynolds stresses, which change the mean flow profoundly (friction, mixing, spreading).',
    'Eddy viscosity is a property of air, like its molecular viscosity — It depends on the flow: the size and strength of its eddies. The same air has very different eddy viscosities in a jet, a wake and a calm room.'
  ],
  formulas: [
    {
      name: 'Dissipation rate from the large eddies',
      expr: 'eps = up^3/Lt', tex: '\\varepsilon = \\frac{u\'^3}{L}',
      vars: {
        eps: { name: 'dissipation rate per unit mass', unit: 'W/kg', tex: '\\varepsilon' },
        up: { name: 'velocity of the large eddies (rms fluctuation)', q: 'speed', unit: 'm/s', value: 1, tex: 'u\'' },
        Lt: { name: 'size of the large eddies', q: 'length', unit: 'm', value: 100, tex: 'L' }
      },
      note: 'An order-of-magnitude estimate (Taylor\'s): the true coefficient is of order 1 and depends on the flow. W/kg is the same as m²/s³.',
      stories: {
        eps: 'In the wind near the ground the big eddies are about {Lt} across with velocity fluctuations of {up}. Roughly how much power per kilogram of air does the turbulence dissipate?',
        up: 'Turbulence dissipates {eps} in eddies about {Lt} across. How strong are the velocity fluctuations?'
      }
    },
    {
      name: 'Kolmogorov length scale',
      expr: 'eta = (nu^3/eps)^(1/4)', tex: '\\eta = \\left(\\frac{\\nu^3}{\\varepsilon}\\right)^{1/4}',
      vars: {
        eta: { name: 'Kolmogorov scale (size of the smallest eddies)', q: 'length', unit: 'mm', tex: '\\eta' },
        nu: { name: 'kinematic viscosity', q: 'kinvisc', unit: 'm²/s', value: 1.46e-5, tex: '\\nu' },
        eps: { name: 'dissipation rate per unit mass', unit: 'W/kg', value: 0.01, tex: '\\varepsilon' }
      },
      note: 'The smallest eddies — below this size velocity gradients are smoothed by viscosity. Their time scale is √(ν/ε) and velocity (νε)^{1/4}.',
      stories: {
        eta: 'Turbulence in air (ν = {nu}) dissipates {eps}. How small are the smallest eddies?',
        eps: 'The smallest eddies in a turbulent flow of air (ν = {nu}) are {eta} across. What is the dissipation rate?'
      }
    },
    {
      name: 'Grid points for direct numerical simulation',
      expr: 'N = ReL^(9/4)', tex: 'N = \\mathrm{Re}_L^{9/4}',
      vars: {
        N: { name: 'number of grid points needed (order of magnitude)' },
        ReL: { name: 'Reynolds number of the large eddies, u′L/ν', value: 1e4, min: 1, tex: '\\mathrm{Re}_L' }
      },
      note: '(L/η)³ with L/η = Re^{3/4}: every eddy resolved in three dimensions. The number of time steps grows as Re^{3/4} too, so the cost grows roughly as Re³.',
      stories: {
        N: 'Roughly how many grid points does a direct simulation of turbulence need at a large-eddy Reynolds number of {ReL}?',
        ReL: 'A supercomputer can afford {N} grid points. Up to what large-eddy Reynolds number can it simulate turbulence directly?'
      }
    }
  ],
  examples: [
    {
      title: 'The smallest eddies in the wind',
      q: 'Near the ground on a breezy day the large eddies are about 100 m across with fluctuations of about 1 m/s. Estimate the dissipation rate, the Kolmogorov scale and the range of eddy sizes ($\\nu = 1.46\\times10^{-5}$ m²/s).',
      steps: [
        '$\\varepsilon \\approx u\'^3/L = 1/100 = 0.01$ W/kg.',
        '$\\eta = (\\nu^3/\\varepsilon)^{1/4} = (3.1\\times10^{-15}/0.01)^{1/4} = 7.5\\times10^{-4}$ m ≈ 0.75 mm.',
        '$L/\\eta = 100/7.5\\times10^{-4} \\approx 1.3\\times10^5$; check: $\\mathrm{Re}_L = 1 \\times 100/1.46\\times10^{-5} = 6.8\\times10^6$ and $\\mathrm{Re}_L^{3/4} = 1.3\\times10^5$.',
        'The smallest eddies turn over in $\\tau_\\eta = \\sqrt{\\nu/\\varepsilon} = 0.04$ s.'
      ],
      a: 'About 0.01 W/kg, eddies down to about 0.75 mm, and a range of sizes of about 130 000 to 1.'
    },
    {
      title: 'Why engineers model turbulence',
      q: 'The turbulence in the boundary layer of a car has large eddies of about 5 cm with fluctuations of about 1.5 m/s. How many grid points would a direct numerical simulation of it need per eddy-sized cube, and for a region the size of the car?',
      steps: [
        '$\\mathrm{Re}_L = 1.5 \\times 0.05/1.46\\times10^{-5} = 5100$.',
        'Per large-eddy cube: $N \\approx 5100^{9/4} = 2.2\\times10^8$ points.',
        'A region the size of the car, 4.5 m × 1.8 m × 1.5 m, holds about $10^5$ such cubes, so of order $10^{13}$ points — far beyond everyday design computing.'
      ],
      a: 'About 2 × 10⁸ points for each eddy-sized cube — hence the eddy-viscosity models used in industrial CFD.'
    }
  ],
  quiz: [
    { q: 'Doubling the viscosity of a turbulent flow while keeping its large eddies the same would…', choices: ['double the dissipation rate', 'halve the dissipation rate', 'leave the dissipation rate about the same, but make the smallest eddies larger', 'stop the turbulence immediately'], a: 2,
      why: 'ε ≈ u′³/L is set by the large eddies. Viscosity only sets where the cascade ends: η ∝ ν^{3/4} grows.' },
    { q: 'In the inertial range the energy spectrum of turbulence falls as $k^{-5/3}$.', a: true,
      why: 'Kolmogorov\'s 1941 result: E(k) = Cε^{2/3}k^{−5/3}, with C ≈ 1.5.' },
    { q: 'Estimate the Kolmogorov scale in water ($\\nu = 1.0\\times10^{-6}$ m²/s) stirred so that $\\varepsilon = 0.004$ W/kg. Answer in millimetres.', answer: 0.126, unit: 'mm',
      why: '$\\eta = (10^{-18}/0.004)^{1/4} = (2.5\\times10^{-16})^{1/4} = 1.26\\times10^{-4}$ m = 0.13 mm.' },
    { q: 'By what factor does the ratio of largest to smallest eddies, L/η, grow if the Reynolds number rises by 10 000?', choices: ['100', '1000', '10 000', '10'], a: 1,
      why: 'L/η ≈ Re^{3/4}: (10⁴)^{3/4} = 10³.' },
    { q: 'An eddy viscosity is…', choices: ['the molecular viscosity of air at high temperature', 'a model of the momentum carried by turbulent fluctuations, depending on the flow', 'the viscosity inside a vortex core', 'a constant of nature'], a: 1,
      why: 'Boussinesq\'s idea: the Reynolds stresses behave like an extra viscosity, but its size depends on the eddies of the particular flow.' }
  ],
  problems: [
    { q: 'A wind-tunnel stream at 50 m/s has 1 % turbulence (u′ = 0.5 m/s) in eddies about 0.1 m across. Estimate the dissipation rate in W/kg.', answer: 1.25, unit: 'W/kg', tol: 0.02,
      steps: ['$\\varepsilon \\approx u\'^3/L = 0.125/0.1 = 1.25$ W/kg.', 'With $\\nu = 1.5\\times10^{-5}$ m²/s, $\\eta = (3.4\\times10^{-15}/1.25)^{1/4} \\approx 0.23$ mm.'] }
  ],
  applications: [
    'Turbulence models for CFD of aircraft, cars, engines and buildings.',
    'Mixing and combustion in engines, where turbulence spreads fuel and flame.',
    'Clear-air and convective turbulence in flight, and the dispersion of pollution in the atmosphere.',
    'Wind-tunnel design, where screens and contractions reduce turbulence intensity.'
  ],
  history: 'Reynolds split flows into mean and fluctuating parts in 1895; Boussinesq had proposed the eddy viscosity in 1877. Richardson described the cascade in his 1922 book on numerical weather prediction, G. I. Taylor built a statistical theory in the 1930s, and Kolmogorov\'s two short papers of 1941 gave the smallest scales and the five-thirds law — measured decisively in a tidal channel off Vancouver Island in 1962.',
  sim: 'visc-cascade'
}

);
