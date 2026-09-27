/* HYPER-AERODYNAMICS · content/potential.js
 * Potential flow (under How Air Flows): superposition, sources/sinks/doublets/vortices, the cylinder,
 * Kutta–Joukowski, the Magnus effect and d'Alembert's paradox; and computational aerodynamics
 * (under Testing, Computing and Structures): panel methods, CFD and turbulence models.
 * Simulations in sims/potential.js (prefix pot-). */
Hyper.add(

/* ================================================================ POTENTIAL FLOW */
{
  id: 'potential-flow-basics', parent: 'potential-flow', title: 'Potential flow and superposition', level: 2,
  short: 'Treat air as frictionless, incompressible and free of spin, and its whole velocity field follows from a single function that obeys Laplace\'s equation. Because that equation is linear, simple flows can be added together to build the flow round a body.',
  keywords: ['potential flow', 'velocity potential', 'stream function', 'irrotational flow', 'ideal fluid', 'inviscid', 'Laplace equation', 'superposition', 'flow net', 'equipotential', 'complex potential', 'conformal mapping'],
  prereq: ['streamlines', 'continuity', 'vorticity-circulation', 'math:laplace-equation'],
  related: ['sources-vortices', 'cylinder-flow', 'bernoulli', 'kutta-joukowski', 'dalembert-paradox', 'panel-methods', 'boundary-layer', 'math:gradient', 'math:complex-numbers'],
  body: `
Watch smoke pass a wing in a wind tunnel at a modest speed. Outside a skin a millimetre or two thick (the [[boundary-layer|boundary layer]]) and the thin wake behind, the smoke lines bend smoothly round the shape. In that outer region three simplifications hold remarkably well:

- **Viscosity does nothing.** Friction only matters where the speed changes sharply over a short distance, which happens next to the surface.
- **The air does not compress.** Below about Mach 0.3 the density changes by less than 5 %.
- **The air does not spin.** Air arriving from a calm, uniform stream carries no [[vorticity-circulation|vorticity]], and without friction it cannot acquire any: each small parcel may travel round a curved path, but it does not rotate about its own centre.

A flow with these three properties is called **potential flow**, and it turns a hard problem into an elegant one.

### The velocity potential
Zero spin means the velocity is the [[math:gradient|gradient]] of a scalar function $\\phi$, the **velocity potential** — the air runs "downhill" in $\\phi$ the way heat runs down a temperature gradient:

$$u = \\frac{\\partial\\phi}{\\partial x}, \\qquad v = \\frac{\\partial\\phi}{\\partial y}$$

Putting this into the incompressible [[continuity|continuity equation]] $\\partial u/\\partial x + \\partial v/\\partial y = 0$ gives [[math:laplace-equation|Laplace's equation]], $\\nabla^2\\phi = 0$ — the same equation that governs steady heat conduction, electrostatics and the seepage of groundwater. One unknown instead of three, and a linear equation: **if two flows satisfy it, so does their sum.**

### The stream function
In two dimensions a second function is even more useful. The **stream function** $\\psi$ is defined by $u = \\partial\\psi/\\partial y$, $v = -\\partial\\psi/\\partial x$, which satisfies continuity automatically. Its contour lines are the [[streamlines]], and the difference in $\\psi$ between two streamlines is the volume of air flowing between them per second, per metre of span. Where neighbouring streamlines crowd together the same flow squeezes through a narrower gap, so the speed is $v \\approx \\Delta\\psi/\\Delta n$. In an irrotational flow $\\psi$ also obeys Laplace's equation, and the lines of constant $\\phi$ cross the streamlines at right angles, forming a **flow net** of little curvilinear squares.

### Building flows by adding them
| Elementary flow | Potential $\\phi$ | Stream function $\\psi$ |
|---|---|---|
| Uniform stream $V_\\infty$ along $x$ | $V_\\infty x$ | $V_\\infty y$ |
| Source of strength $\\Lambda$ (sink if negative) | $\\frac{\\Lambda}{2\\pi}\\ln r$ | $\\frac{\\Lambda}{2\\pi}\\theta$ |
| Vortex of circulation $\\Gamma$ (anticlockwise) | $\\frac{\\Gamma}{2\\pi}\\theta$ | $-\\frac{\\Gamma}{2\\pi}\\ln r$ |
| Doublet of strength $\\kappa$ | $\\frac{\\kappa\\cos\\theta}{2\\pi r}$ | $-\\frac{\\kappa\\sin\\theta}{2\\pi r}$ |

Any streamline can be replaced by a solid wall, because no air crosses a streamline. So a stream plus a source gives the flow round a blunt-nosed body; a stream plus a doublet, the flow round a circle ([[cylinder-flow]]); add a vortex and the circle lifts ([[kutta-joukowski]]). Put hundreds of sources and vortices on the surface of any shape and you have a [[panel-methods|panel method]]. The [[sources-vortices]] page describes the pieces.

### Pressure from speed
Because the flow is irrotational, [[bernoulli|Bernoulli's equation]] holds between *any* two points, not just along one streamline. The pressure then follows from the speed alone:

$$C_p = \\frac{p - p_\\infty}{\\tfrac12\\rho V_\\infty^2} = 1 - \\left(\\frac{v}{V_\\infty}\\right)^2$$

Where the air runs 1.5 times faster than the stream, $C_p = -1.25$; at a stagnation point, $C_p = +1$.

> [!note] For the curious: in two dimensions $\\phi$ and $\\psi$ are the real and imaginary parts of one **complex potential** $W(z) = \\phi + i\\psi$, an analytic function of $z = x + iy$ whose derivative is $u - iv$. A stream is $V_\\infty z$, a source $\\frac{\\Lambda}{2\\pi}\\ln z$. Conformal maps such as Joukowski's $\\zeta = z + c^2/z$ bend the flow round a circle into the flow round an airfoil — the way wing sections were first calculated, around 1910.

### What it leaves out
Potential flow knows nothing of friction, so it predicts no drag ([[dalembert-paradox]]), no stall and no separation, and it cannot decide by itself how much an airfoil lifts: that needs the Kutta condition, a rule borrowed from the viscous world. Within those limits it predicts the pressures on streamlined bodies in attached flow to within a few per cent — which is why it is still the first tool of aerodynamic design.

> [!key] Potential flow gives the pressure field from geometry alone. Viscosity enters only through the boundary layer, and through the Kutta condition that sets the circulation.
`,
  ideas: [
    'Potential flow assumes no friction, no compression and no spin of fluid parcels — a good model outside boundary layers and wakes.',
    'Zero spin makes velocity the gradient of a potential φ; continuity then gives Laplace\'s equation ∇²φ = 0.',
    'Laplace\'s equation is linear, so elementary flows — stream, source, vortex, doublet — can be added to build flows round bodies.',
    'Streamlines are contours of the stream function ψ; the gap between two carries a fixed flow, so crowded streamlines mean fast air.',
    'Bernoulli holds everywhere in potential flow, so C_p = 1 − (v/V∞)² turns a speed map into a pressure map.'
  ],
  pitfalls: [
    '"Potential flow" means the air has potential energy — The name refers to the velocity potential φ, a mathematical function whose slope is the velocity, just as a gravitational potential\'s slope is the field.',
    'Irrotational means the air cannot move in circles — Parcels may travel round curved or even circular paths; irrotational only means each parcel does not spin about its own centre. Outside its core, a whirlpool is irrotational.',
    'Because it ignores viscosity, potential flow is useless for real aircraft — Outside the thin boundary layer it predicts attached-flow pressures and lift well; it fails for drag, separation and stall.'
  ],
  formulas: [
    {
      name: 'Pressure coefficient from the local speed',
      expr: 'Cp = 1 - (v/V)^2', tex: 'C_p = 1 - \\left(\\dfrac{v}{V_\\infty}\\right)^2',
      vars: {
        Cp: { name: 'pressure coefficient', signed: true, min: -50, max: 1, tex: 'C_p' },
        v: { name: 'local speed', q: 'speed', unit: 'm/s', value: 45 },
        V: { name: 'free-stream speed', q: 'speed', unit: 'm/s', value: 30, tex: 'V_\\infty' }
      },
      note: 'Bernoulli\'s equation for incompressible, irrotational flow: valid anywhere outside boundary layers and wakes, at low Mach number.',
      stories: {
        Cp: 'Air approaching at {V} speeds up to {v} over the top of a body. What is the pressure coefficient there?',
        v: 'A pressure tapping in a stream of {V} reads a pressure coefficient of {Cp}. How fast is the air moving past it?'
      }
    },
    {
      name: 'Speed from the spacing of streamlines',
      expr: 'v = dpsi/dn', tex: 'v = \\dfrac{\\Delta\\psi}{\\Delta n}',
      vars: {
        v: { name: 'local speed', q: 'speed', unit: 'm/s' },
        dpsi: { name: 'flow between the two streamlines, per metre of span', q: false, unit: 'm²/s', value: 1.2, tex: '\\Delta\\psi' },
        dn: { name: 'gap between the streamlines', q: 'length', unit: 'mm', value: 30, tex: '\\Delta n' }
      },
      note: 'Two-dimensional flow. The same Δψ that passes between two streamlines far upstream passes between them everywhere, so the speed rises where they close up.',
      stories: {
        v: 'Two streamlines carry {dpsi} between them and are {dn} apart above a wing. How fast is the air there?',
        dn: 'Streamlines carrying {dpsi} between them pass a point where the air moves at {v}. How far apart are they?'
      }
    }
  ],
  examples: [
    {
      title: 'Reading a flow net',
      q: 'Far upstream of a body in a 20 m/s stream at sea level ($\\rho = 1.225\\ \\mathrm{kg/m^3}$), two streamlines are 10 mm apart. Over the top of the body they close to 6 mm. Find the speed there, the pressure coefficient and the pressure below ambient.',
      steps: [
        'Flow between the streamlines per metre of span: $\\Delta\\psi = V_\\infty\\,\\Delta n = 20 \\times 0.010 = 0.20\\ \\mathrm{m^2/s}$.',
        'Over the body: $v = \\Delta\\psi/\\Delta n = 0.20/0.006 = 33.3$ m/s.',
        '$C_p = 1 - (33.3/20)^2 = 1 - 2.78 = -1.78$.',
        'Dynamic pressure $q = \\tfrac12 \\times 1.225 \\times 20^2 = 245$ Pa, so $p - p_\\infty = -1.78 \\times 245 = -436$ Pa.'
      ],
      a: 'About 33 m/s, C_p ≈ −1.78, some 440 Pa below the free-stream pressure.'
    },
    {
      title: 'Flow into a corner',
      q: 'Show that $\\phi = \\tfrac12 a\\,(x^2 - y^2)$ with $a = 4\\ \\mathrm{s^{-1}}$ is a possible potential flow, find its stream function, and give the velocity at $(0.5, 0.25)$ m.',
      steps: [
        'Velocity: $u = \\partial\\phi/\\partial x = a x$, $v = \\partial\\phi/\\partial y = -a y$.',
        'Laplace: $\\partial^2\\phi/\\partial x^2 + \\partial^2\\phi/\\partial y^2 = a - a = 0$. It is a valid potential flow.',
        'Stream function: $u = \\partial\\psi/\\partial y = a x$ gives $\\psi = a x y$; check $v = -\\partial\\psi/\\partial x = -a y$. The streamlines $xy = $ constant are hyperbolas: air comes down the $y$ axis, stops at the origin and leaves along $x$ — the flow near any stagnation point.',
        'At $(0.5, 0.25)$: $u = 4 \\times 0.5 = 2$ m/s, $v = -4 \\times 0.25 = -1$ m/s; speed $\\sqrt{5} = 2.24$ m/s; $\\psi = 4 \\times 0.5 \\times 0.25 = 0.5\\ \\mathrm{m^2/s}$.'
      ],
      a: 'It satisfies Laplace\'s equation; ψ = axy; at (0.5, 0.25) m the air moves at (2, −1) m/s, 2.24 m/s.'
    }
  ],
  quiz: [
    { q: 'Which of these is NOT an assumption of potential flow?', choices: ['no friction', 'fluid parcels do not spin', 'constant density', 'the air sticks to the surface (no slip)'], a: 3,
      why: 'Potential flow lets the air slide freely along a surface; only the normal velocity must vanish. The no-slip condition belongs to viscous flow and creates the boundary layer that potential flow leaves out.' },
    { q: 'Adding the stream functions of two flows that each satisfy Laplace\'s equation gives another valid potential flow.', a: true,
      why: 'Laplace\'s equation is linear, so any sum of solutions is a solution. That is the whole basis of superposition and of panel methods. (Pressures do not add, because they depend on the speed squared.)' },
    { q: 'Streamlines close to 2/3 of their upstream spacing. What is the pressure coefficient there?', answer: -1.25, tol: 0.02,
      why: 'The speed rises in the inverse ratio, to 1.5 V∞, so C_p = 1 − 1.5² = −1.25.' },
    { q: 'In potential flow, Bernoulli\'s constant p + ½ρv² is the same…', choices: ['only along each streamline', 'everywhere in the flow', 'only in the boundary layer', 'only at stagnation points'], a: 1,
      why: 'In an irrotational flow the constant is the same on every streamline, so the pressure anywhere follows from the local speed alone.' },
    { q: 'The difference in the stream function ψ between two streamlines equals…', choices: ['the pressure difference between them', 'the volume flow between them per metre of span', 'the speed along them', 'the circulation around them'], a: 1,
      why: 'With u = ∂ψ/∂y, integrating across the gap gives the flow rate per unit depth, in m²/s. It stays constant along the pair, which is why their spacing tells the speed.' }
  ],
  applications: ['First estimates of the pressures on wings, fuselages, car bodies and ship hulls.', 'Panel codes, which solve potential flow round complete aircraft in seconds.', 'Groundwater seepage and heat conduction, which obey the same Laplace equation.', 'Placing static-pressure ports and pitot probes where the local pressure equals the free-stream value.'],
  history: 'The velocity potential and the stream function go back to d\'Alembert, Euler and Lagrange in the second half of the 18th century. In 1871 William Rankine showed how adding sources and sinks to a stream draws body shapes, and in the 1900s Kutta and Joukowski turned complex potentials and conformal maps into the first theory of the lifting wing section.',
  sim: 'pot-builder'
},

{
  id: 'sources-vortices', parent: 'potential-flow', title: 'Sources, sinks, doublets and vortices', level: 2,
  short: 'The building blocks of potential flow: a source spreading air outward, a sink swallowing it, a vortex swirling it round, and a doublet — a source and sink pressed together — which, added to a stream, draws a circular cylinder.',
  keywords: ['source', 'sink', 'line vortex', 'free vortex', 'point vortex', 'doublet', 'dipole', 'Rankine half-body', 'Rankine oval', 'circulation', 'dust devil', 'singularity'],
  prereq: ['potential-flow-basics', 'vorticity-circulation', 'continuity'],
  related: ['cylinder-flow', 'kutta-joukowski', 'wingtip-vortices', 'panel-methods', 'pitot-tube', 'physics:angular-momentum'],
  body: `
Each of the elementary flows is a solution of Laplace's equation with a single troublesome point — a **singularity** where the speed becomes infinite. That sounds useless until you notice that the troublesome point can always be tucked inside a body, where there is no air. Outside it, the pieces behave perfectly, and adding them to a stream builds almost any shape.

### Sources and sinks
A two-dimensional **source** of strength $\\Lambda$ (m²/s — cubic metres per second per metre of span) pours air out evenly in all directions. The same volume must cross every circle round it, and the circumference grows with $r$, so

$$v_r = \\frac{\\Lambda}{2\\pi r}$$

A **sink** is a source with negative strength. In three dimensions a point source spreads over spheres and its speed falls as $1/r^2$, which is why you can blow out a candle half a metre away but cannot suck it out: a sink draws gently from every direction, while blowing makes a directed jet.

### Vortices
A **vortex** of circulation $\\Gamma$ swirls air round in circles with

$$v_\\theta = \\frac{\\Gamma}{2\\pi r}$$

The [[vorticity-circulation|circulation]] round any loop enclosing it is $\\Gamma$; round a loop that does not enclose it, zero. So all the spin is concentrated in the centre, and the air outside moves round without rotating — the way a gondola on a Ferris wheel stays level. Real vortices have a core, a few centimetres to a few metres across, that turns like a solid wheel (the Rankine vortex model), with the $1/r$ law outside it: a dust devil turning at 15 m/s five metres out has $\\Gamma = 2\\pi \\times 5 \\times 15 \\approx 470\\ \\mathrm{m^2/s}$. Bound to a wing, a vortex is what makes lift ([[kutta-joukowski]]); trailing from its tips, it is the [[wingtip-vortices|wake]].

### Doublets
Put a source and an equal sink a small distance $a$ apart and let them close in while $\\Lambda a$ is held fixed. The result, a **doublet** of strength $\\kappa$, sends air out of one side and back into the other along circles that all touch at the centre. Added to a stream it gives the flow round a circular cylinder of radius $R = \\sqrt{\\kappa/2\\pi V_\\infty}$.

### Building bodies
| Combination | The body it draws | Its size |
|---|---|---|
| Stream + source | Rankine half-body: blunt nose, parallel sides | nose $\\Lambda/2\\pi V_\\infty$ ahead of the source; width $\\Lambda/V_\\infty$ far downstream |
| Stream + source + equal sink | Rankine oval, closed | set by the spacing and $\\Lambda/V_\\infty$ |
| Stream + doublet | circular cylinder | $R = \\sqrt{\\kappa/2\\pi V_\\infty}$ |
| Stream + doublet + vortex | cylinder with lift | lift $\\rho V_\\infty\\Gamma$ per metre |
| Stream + sources and vortices spread over a surface | any shape | [[panel-methods]] |

A **closed body needs zero net source strength**: whatever the sources inside pour out, sinks must take back, or the extra air leaves as an ever-widening body. On a half-body the surface speed peaks at 1.26 $V_\\infty$ (where $C_p = -0.59$), then the pressure creeps back towards ambient downstream — the reason static ports on a [[pitot-tube|pitot-static tube]] sit several diameters behind its nose.

> [!tip] Build them yourself in the simulation: a source and sink make an oval, a doublet makes a cylinder, and a vortex on the cylinder moves the stagnation points and makes lift.
`,
  ideas: [
    'A source spreads Λ m²/s outward with v_r = Λ/2πr; a sink is a negative source.',
    'A vortex swirls air with v_θ = Γ/2πr; all its spin is in the centre, and the air outside does not rotate.',
    'A doublet is a source and sink merged; with a stream it makes a circular cylinder of radius √(κ/2πV∞).',
    'Singularities are placed inside bodies, where their infinite speeds do no harm.',
    'A closed body needs as much sink as source inside it.'
  ],
  pitfalls: [
    'The infinite speed at a source or vortex centre is real — It is a mathematical singularity, hidden inside a body or, in real vortices, replaced by a finite core that turns like a solid.',
    'In a vortex every bit of air spins — In an ideal vortex only the centre carries vorticity; the air outside goes round in circles without rotating about itself.',
    'Sources and sinks are real inlets and outlets — They are mathematical devices whose value is in combination: tucked inside a body they shape the flow round it.'
  ],
  formulas: [
    {
      name: 'Speed from a source',
      expr: 'vr = Lam/(2*pi*r)', tex: 'v_r = \\dfrac{\\Lambda}{2\\pi r}',
      vars: {
        vr: { name: 'outward speed', q: 'speed', unit: 'm/s', tex: 'v_r' },
        Lam: { name: 'source strength (flow per metre of span)', q: false, unit: 'm²/s', value: 10, tex: '\\Lambda' },
        r: { name: 'distance from the source', q: 'length', unit: 'm', value: 0.5 }
      },
      note: 'A two-dimensional (line) source. For a sink Λ is negative and the air flows inward. In three dimensions a point source gives v = Q/4πr².',
      stories: { vr: 'A line source puts out {Lam}. How fast is the air moving {r} from it?', Lam: 'Air leaves a line source at {vr} at a distance of {r}. What is the source strength?' }
    },
    {
      name: 'Swirl speed round a vortex',
      expr: 'vt = Gam/(2*pi*r)', tex: 'v_\\theta = \\dfrac{\\Gamma}{2\\pi r}',
      vars: {
        vt: { name: 'swirl speed', q: 'speed', unit: 'm/s', tex: 'v_\\theta' },
        Gam: { name: 'circulation', q: false, unit: 'm²/s', value: 471, tex: '\\Gamma' },
        r: { name: 'distance from the centre', q: 'length', unit: 'm', value: 5 }
      },
      note: 'Outside the core of a line vortex. Inside a real core the speed falls to zero at the centre, roughly like a solid body turning.',
      practice: { unknowns: ['vt', 'Gam', 'r'] },
      stories: { vt: 'A dust devil has a circulation of {Gam}. How fast is the air swirling {r} from its centre?', Gam: 'Air swirls at {vt} at {r} from the centre of a whirlwind. What is its circulation?' }
    },
    {
      name: 'Nose of a Rankine half-body',
      expr: 'b = Lam/(2*pi*V)', tex: 'b = \\dfrac{\\Lambda}{2\\pi V_\\infty}',
      vars: {
        b: { name: 'distance of the nose ahead of the source', q: 'length', unit: 'cm' },
        Lam: { name: 'source strength', q: false, unit: 'm²/s', value: 2.5, tex: '\\Lambda' },
        V: { name: 'stream speed', q: 'speed', unit: 'm/s', value: 20, tex: 'V_\\infty' }
      },
      note: 'Where the source\'s outflow just cancels the stream: the stagnation point. The body is 2πb = Λ/V∞ wide far downstream.',
      stories: { b: 'A source of {Lam} sits in a {V} stream. How far ahead of it is the stagnation point?' }
    },
    {
      name: 'Cylinder from a doublet and a stream',
      expr: 'R = sqrt(kap/(2*pi*V))', tex: 'R = \\sqrt{\\dfrac{\\kappa}{2\\pi V_\\infty}}',
      vars: {
        R: { name: 'cylinder radius', q: 'length', unit: 'm' },
        kap: { name: 'doublet strength', q: false, unit: 'm³/s', value: 15.7, tex: '\\kappa' },
        V: { name: 'stream speed', q: 'speed', unit: 'm/s', value: 10, tex: 'V_\\infty' }
      },
      note: 'The streamline ψ = 0 of the stream plus doublet is a circle of this radius.',
      stories: { R: 'A doublet of strength {kap} sits in a {V} stream. What is the radius of the cylinder it makes?', kap: 'What doublet strength makes a cylinder of radius {R} in a {V} stream?' }
    }
  ],
  examples: [
    {
      title: 'A blunt-nosed body from a source',
      q: 'A line source of $\\Lambda = 2.5\\ \\mathrm{m^2/s}$ sits in a 20 m/s stream. Where is the nose of the half-body, how wide does it get, and how fast is the fastest air on its surface?',
      steps: [
        'Nose (stagnation point): $b = \\Lambda/2\\pi V_\\infty = 2.5/(2\\pi \\times 20) = 0.0199$ m, about 2 cm ahead of the source.',
        'Far downstream all the source\'s air flows between the body\'s sides at the stream speed: width $= \\Lambda/V_\\infty = 2.5/20 = 0.125$ m.',
        'The surface speed peaks at 1.26 $V_\\infty$ = 25 m/s on the shoulder, level with a point about one nose-distance downstream of the source, where $C_p = 1 - 1.26^2 = -0.59$.'
      ],
      a: 'Nose 2 cm ahead of the source, 12.5 cm wide downstream, peak surface speed about 25 m/s.'
    },
    {
      title: 'A dust devil',
      q: 'Air swirls at 15 m/s five metres from the centre of a dust devil. Assuming a free vortex outside the core, find its circulation and the swirl 20 m out. What would the formula predict 1 m from the centre?',
      steps: [
        '$\\Gamma = 2\\pi r v_\\theta = 2\\pi \\times 5 \\times 15 = 471\\ \\mathrm{m^2/s}$.',
        'At 20 m: $v_\\theta = 471/(2\\pi \\times 20) = 3.75$ m/s — four times farther, four times slower.',
        'At 1 m the free-vortex formula gives 75 m/s. Real dust devils have a core a few metres across that turns like a solid; inside it the speed falls to zero at the centre, so the fastest wind is at the edge of the core.'
      ],
      a: 'Γ ≈ 470 m²/s; 3.75 m/s at 20 m. Inside the core the 1/r law no longer applies.'
    }
  ],
  quiz: [
    { q: 'How does the outflow speed of a two-dimensional source change when you move twice as far from it?', choices: ['it halves', 'it falls to a quarter', 'it stays the same', 'it doubles'], a: 0,
      why: 'The same flow crosses a circle twice as long, so v_r = Λ/2πr halves. (For a three-dimensional point source it would fall to a quarter.)' },
    { q: 'Why can you blow out a candle half a metre away but not suck it out?', choices: ['suction is weaker than pressure', 'a sink draws air from every direction, so its speed falls quickly with distance, while blowing makes a directed jet', 'the flame is hotter than the air', 'air cannot be sucked faster than sound'], a: 1,
      why: 'A three-dimensional sink spreads its pull over a whole sphere and the inflow speed falls as 1/r². A jet from the lips keeps its momentum in one direction.' },
    { q: 'A vortex has a circulation of 50 m²/s. How fast does the air swirl 2 m from its centre (outside the core)?', answer: 3.98, unit: 'm/s', tol: 0.02,
      why: 'v_θ = Γ/2πr = 50/(2π × 2) = 3.98 m/s.' },
    { q: 'What is the circulation round a closed loop that does NOT enclose the centre of a free vortex?', choices: ['Γ', '−Γ', 'zero', 'it depends on the loop\'s size'], a: 2,
      why: 'Outside the centre the flow is irrotational, so the circulation round any loop that leaves the centre out is zero. Only loops round the centre pick up Γ.' },
    { q: 'A doublet sits in a stream. If the stream speed doubles with the same doublet strength, the cylinder\'s radius…', choices: ['doubles', 'halves', 'shrinks by a factor of √2', 'stays the same'], a: 2,
      why: 'R = √(κ/2πV∞): doubling V∞ divides R by √2 ≈ 1.41.' }
  ],
  applications: ['Shaping probe noses and fairings from source distributions (the Rankine half-body).', 'Modelling tornadoes, dust devils and bathtub drains as vortices with cores.', 'Representing wings by bound and trailing vortices (lifting-line and vortex-lattice methods).', 'Sinks model the inflow to engine intakes and ventilation extracts.'],
  history: 'Rankine drew his half-bodies and ovals in 1871 by superposing sources and sinks on a stream. Helmholtz had set out the laws of vortices in 1858 — a vortex line cannot end inside the fluid and moves with it — the basis of every later vortex model of wings and wakes.',
  sim: { id: 'pot-builder', params: { preset: 'oval' } }
},

{
  id: 'cylinder-flow', parent: 'potential-flow', title: 'Flow around a cylinder', level: 2,
  short: 'The classic potential flow: a uniform stream plus a doublet wraps the air round a circular cylinder. The air doubles its speed at the top and bottom, the pressure pattern is perfectly symmetric — and adding a vortex moves the stagnation points and produces lift.',
  keywords: ['cylinder', 'circular cylinder', 'stagnation point', 'surface pressure', 'pressure coefficient', 'circulation', 'lifting cylinder', 'twice the stream speed', 'Cp = 1 − 4 sin²θ', 'complex potential'],
  prereq: ['sources-vortices', 'stagnation-point', 'pressure-coefficient'],
  related: ['kutta-joukowski', 'magnus-effect', 'dalembert-paradox', 'bluff-bodies', 'vortex-shedding', 'drag-crisis', 'math:complex-numbers'],
  body: `
Add a doublet of strength $\\kappa$ to a uniform stream and one streamline closes into a circle of radius $R = \\sqrt{\\kappa/2\\pi V_\\infty}$. Replace everything inside it by a solid cylinder and the outside flow is the ideal flow past a chimney, a cable or an aircraft's pitot mast:

$$\\psi = V_\\infty \\sin\\theta \\left(r - \\frac{R^2}{r}\\right)$$

### Speed and pressure on the surface
Measure the angle $\\theta$ round the surface from the front stagnation point. The air on the surface moves at

$$v_s = 2V_\\infty \\sin\\theta \\qquad\\Rightarrow\\qquad C_p = 1 - 4\\sin^2\\theta$$

| Position | $\\theta$ | Surface speed | $C_p$ |
|---|---|---|---|
| Front stagnation point | 0° | 0 | +1 |
| | 30° | $V_\\infty$ | 0 |
| | 45° | 1.41 $V_\\infty$ | −1 |
| Shoulder (top and bottom) | 90° | 2 $V_\\infty$ | −3 |
| | 150° | $V_\\infty$ | 0 |
| Rear stagnation point | 180° | 0 | +1 |

In a 15 m/s wind the air at the sides of a factory chimney would run at 30 m/s, with a suction of $3q \\approx 410$ Pa. Ideal flow puts the free-stream pressure 30° either side of the front; on a real cylinder it lies nearer 35°, and cylindrical probes place holes around there to sense static pressure and flow direction.

### Symmetry means no force
The pattern is identical front and back, top and bottom. The pressures push equally forward and backward, up and down: **no lift and no drag**. The zero drag contradicts every experience of wind on a pole — [[dalembert-paradox|d'Alembert's paradox]]. A real cylinder follows this pattern only over its front 60° or so; the [[boundary-layer]] then separates (near 80° when laminar, 120° when turbulent) and leaves a wide wake of low pressure, and at most Reynolds numbers it sheds [[vortex-shedding|vortices]] alternately from each side.

### Adding circulation
Now add a clockwise vortex of circulation $\\Gamma$ at the centre:

$$\\psi = V_\\infty \\sin\\theta \\left(r - \\frac{R^2}{r}\\right) + \\frac{\\Gamma}{2\\pi}\\ln\\frac{r}{R}$$

The circle is still a streamline, but now the air over the top moves faster and the air underneath slower: $v_s = 2V_\\infty\\sin\\theta + \\Gamma/2\\pi R$ on the upper side. Both stagnation points slide down the back and front, to the angle below the horizontal where

$$\\sin\\theta_s = \\frac{\\Gamma}{4\\pi V_\\infty R}$$

When $\\Gamma = 4\\pi V_\\infty R$ they meet at the bottom; with more circulation a single stagnation point leaves the surface and a ring of air is carried round with the cylinder. The pressure is still symmetric front to back — no drag — but no longer top to bottom, and the net upward force per metre of span is exactly $L' = \\rho V_\\infty \\Gamma$, the [[kutta-joukowski|Kutta–Joukowski theorem]]. The lift coefficient is $c_l = \\Gamma/(R V_\\infty)$: already 12.6 when the stagnation points meet. A spinning cylinder in real air produces such circulation through its boundary layer — the [[magnus-effect|Magnus effect]].

> [!note] In complex form the whole flow is $W(z) = V_\\infty\\left(z + R^2/z\\right) + \\frac{i\\Gamma}{2\\pi}\\ln z$. Joukowski's transformation maps this circle onto an airfoil; choosing $\\Gamma$ to put the rear stagnation point exactly on the airfoil's sharp trailing edge is the [[kutta-condition|Kutta condition]].
`,
  ideas: [
    'A stream plus a doublet gives the flow round a cylinder; the circle r = R is a streamline.',
    'On the surface v = 2V∞ sin θ and C_p = 1 − 4 sin²θ: twice the stream speed and C_p = −3 at the shoulders.',
    'The ideal pressure pattern is symmetric, so there is neither lift nor drag.',
    'A vortex at the centre moves both stagnation points down (sin θ_s = Γ/4πV∞R) and creates lift ρV∞Γ, still with no drag.',
    'Real cylinders follow the ideal pattern only on the front; separation leaves a low-pressure wake.'
  ],
  pitfalls: [
    'The fastest air is at the front, where the wind hits — The front is a stagnation point with zero speed and the highest pressure; the fastest air is at the shoulders, 90° round, at twice the stream speed.',
    'Circulation means the cylinder must be spinning — In potential flow the circulation is simply a vortex added to the solution. Spinning a cylinder in real air is one way to create it; a sharp trailing edge is another.',
    'A real cylinder feels the potential-flow pressures all round — Only on the front 60° or so. The real flow separates and the pressure at the back stays low, which is where almost all of the drag comes from.'
  ],
  formulas: [
    {
      name: 'Surface pressure on a cylinder (no circulation)',
      expr: 'Cp = 1 - 4*sin(theta)^2', tex: 'C_p = 1 - 4\\sin^2\\theta',
      vars: {
        Cp: { name: 'pressure coefficient', signed: true, min: -3, max: 1, tex: 'C_p' },
        theta: { name: 'angle from the front stagnation point', q: 'angle', unit: '°', value: 45, min: 0, max: 180, tex: '\\theta' }
      },
      note: 'Ideal (potential) flow. Real cylinders agree only up to about 60°; beyond, separation keeps the pressure low.',
      stories: {
        Cp: 'What pressure coefficient does ideal flow predict {theta} round a cylinder from its front stagnation point?',
        theta: 'Where on a cylinder\'s surface does ideal flow give a pressure coefficient of {Cp}?'
      }
    },
    {
      name: 'Stagnation points with circulation',
      expr: 'sin(thetas) = Gam/(4*pi*V*R)', tex: '\\sin\\theta_s = \\dfrac{\\Gamma}{4\\pi V_\\infty R}',
      vars: {
        thetas: { name: 'angle of the stagnation points below the horizontal', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\theta_s' },
        Gam: { name: 'circulation (clockwise, stream from the left)', q: false, unit: 'm²/s', value: 31.4, tex: '\\Gamma' },
        V: { name: 'stream speed', q: 'speed', unit: 'm/s', value: 10, tex: 'V_\\infty' },
        R: { name: 'cylinder radius', q: 'length', unit: 'm', value: 0.5 }
      },
      solveFor: 'thetas',
      note: 'Both stagnation points, front and back, sit at this angle. They meet at the bottom when Γ = 4πV∞R; beyond that a single stagnation point leaves the surface.',
      stories: {
        thetas: 'A cylinder of radius {R} in a {V} stream carries a circulation of {Gam}. How far below the horizontal are its stagnation points?',
        Gam: 'What circulation moves the stagnation points of a {R} cylinder in a {V} stream to {thetas} below the horizontal?'
      }
    },
    {
      name: 'Lift coefficient of a cylinder with circulation',
      expr: 'cl = Gam/(R*V)', tex: 'c_l = \\dfrac{\\Gamma}{R\\,V_\\infty}',
      vars: {
        cl: { name: 'lift coefficient (based on the diameter)', tex: 'c_l' },
        Gam: { name: 'circulation', q: false, unit: 'm²/s', value: 31.4, tex: '\\Gamma' },
        R: { name: 'cylinder radius', q: 'length', unit: 'm', value: 0.5 },
        V: { name: 'stream speed', q: 'speed', unit: 'm/s', value: 10, tex: 'V_\\infty' }
      },
      note: 'From L′ = ρV∞Γ divided by ½ρV∞² × 2R. Potential flow; real rotating cylinders reach c_l of about 8 to 10 with end plates.',
      stories: { cl: 'A cylinder of radius {R} in a {V} stream carries a circulation of {Gam}. What is its lift coefficient?' }
    }
  ],
  examples: [
    {
      title: 'Wind on a chimney',
      q: 'A 2 m diameter chimney stands in a 15 m/s wind at sea level. What does potential flow predict for the fastest air and the strongest suction? Is the flow likely to follow it?',
      steps: [
        'Fastest air, at the sides: $2V_\\infty = 30$ m/s.',
        '$q = \\tfrac12 \\times 1.225 \\times 15^2 = 138$ Pa, so the suction there is $C_p q = -3 \\times 138 = -413$ Pa.',
        'Reynolds number $Vd/\\nu = 15 \\times 2/1.5\\times10^{-5} = 2\\times10^6$: the boundary layer is turbulent, separates late, and measured suctions at the sides reach $C_p \\approx -2$ — less than the ideal −3 — with a base pressure near $-0.5\\,q$ behind.'
      ],
      a: 'Ideal flow: 30 m/s and −413 Pa at the sides. The real peak suction is smaller, and the low pressure behind causes drag.'
    },
    {
      title: 'Moving the stagnation points',
      q: 'A cylinder of radius 0.5 m sits in a 10 m/s stream with a clockwise circulation of 20 m²/s. Where are the stagnation points, how fast is the air at the top and bottom, and what is the lift per metre?',
      steps: [
        '$\\sin\\theta_s = \\Gamma/(4\\pi V_\\infty R) = 20/(4\\pi \\times 10 \\times 0.5) = 0.318$, so $\\theta_s = 18.6°$ below the horizontal, front and back.',
        'The vortex adds $\\Gamma/2\\pi R = 20/(2\\pi \\times 0.5) = 6.4$ m/s round the surface: top $20 + 6.4 = 26.4$ m/s, bottom $20 - 6.4 = 13.6$ m/s.',
        'Lift: $L\' = \\rho V_\\infty \\Gamma = 1.225 \\times 10 \\times 20 = 245$ N per metre; $c_l = \\Gamma/(RV_\\infty) = 4.0$.'
      ],
      a: 'Stagnation points 18.6° below the horizontal; 26.4 m/s on top, 13.6 m/s below; 245 N per metre of lift and no drag.'
    }
  ],
  quiz: [
    { q: 'In potential flow round a cylinder, how fast does the air move at the top of the cylinder?', choices: ['V∞', '1.5 V∞', '2 V∞', 'zero'], a: 2,
      why: 'v_s = 2V∞ sin θ reaches 2V∞ at θ = 90°. The pressure coefficient there is 1 − 4 = −3.' },
    { q: 'At what angles from the front stagnation point is the surface pressure equal to the free-stream pressure?', choices: ['45° and 135°', '30° and 150°', '60° and 120°', '90° only'], a: 1,
      why: 'C_p = 0 needs sin²θ = ¼, so sin θ = ½: θ = 30° and 150° (and the same below).' },
    { q: 'With the stream from the left, adding clockwise circulation to the cylinder moves the stagnation points…', choices: ['both upward', 'both downward', 'the front one up and the rear one down', 'nowhere — only the speeds change'], a: 1,
      why: 'Clockwise circulation speeds the air over the top and slows it underneath, so the points where the surface speed is zero shift downward, front and back: sin θ_s = Γ/4πV∞R.' },
    { q: 'What circulation makes the two stagnation points meet at the bottom of a cylinder of radius 0.1 m in a 5 m/s stream?', answer: 6.28, unit: 'm²/s', tol: 0.02,
      why: 'They meet when sin θ_s = 1: Γ = 4πV∞R = 4π × 5 × 0.1 = 6.28 m²/s.' },
    { q: 'With circulation, the potential-flow cylinder feels lift but still no drag.', a: true,
      why: 'The flow is still symmetric front to back, so the forward and backward pressure forces cancel. Only top and bottom differ, giving the lift ρV∞Γ.' }
  ],
  problems: [
    { q: 'A 25 mm diameter cable is in a 12 m/s wind at sea level. What pressure (relative to ambient) does potential flow predict 45° round from the front stagnation point?', answer: -88.2, unit: 'Pa', tol: 0.02,
      steps: ['$C_p = 1 - 4\\sin^2 45° = 1 - 2 = -1$.', '$q = \\tfrac12 \\times 1.225 \\times 12^2 = 88.2$ Pa, so $p - p_\\infty = -88.2$ Pa.'] }
  ],
  applications: ['Wind loads on chimneys, masts, cables and bridge hangers (with measured corrections for separation).', 'Cylindrical yaw and flow-angle probes, which use the pressure pattern on a cylinder.', 'Rotor sails and spinning-cylinder lift devices.', 'The starting point for conformal mapping of airfoils.'],
  sim: 'pot-cylinder'
},

{
  id: 'kutta-joukowski', parent: 'potential-flow', title: 'The Kutta–Joukowski theorem', level: 2,
  short: 'The lift per metre of span of any two-dimensional body in a steady, frictionless stream is the air density times the stream speed times the circulation round it: L′ = ρV∞Γ. The shape matters only through the circulation it produces.',
  keywords: ['Kutta-Joukowski', 'Kutta–Joukowski theorem', 'circulation', 'lift per unit span', 'bound vortex', 'starting vortex', 'Kutta condition', 'Joukowski airfoil', 'horseshoe vortex', 'Kelvin\'s theorem'],
  prereq: ['cylinder-flow', 'vorticity-circulation', 'kutta-condition', 'lift-equation'],
  related: ['how-lift-works', 'lifting-line', 'thin-airfoil-theory', 'wingtip-vortices', 'downwash', 'induced-drag', 'magnus-effect', 'math:line-integrals'],
  body: `
Whatever the shape of a wing section — thin or thick, cambered or not, even a spinning cylinder — steady frictionless flow gives it a lift per metre of span of

$$L' = \\rho\\, V_\\infty\\, \\Gamma$$

at right angles to the stream, and **no drag at all**. Here $\\Gamma = \\oint \\vec V \\cdot d\\vec s$ is the [[vorticity-circulation|circulation]], the [[math:line-integrals|line integral]] of the velocity round any loop that encloses the body. The theorem compresses all the geometry into one number: two sections with the same circulation lift the same.

### Why circulation means lift
Circulation does not mean the air goes round the wing. It means the air passing over the top moves faster than the air passing underneath, compared with a flow without lift. For a thin section, with $u_u$ and $u_l$ the speeds just above and below, the loop integral is $\\Gamma = \\int_0^c (u_u - u_l)\\,dx$. By Bernoulli the pressure below exceeds the pressure above by $\\tfrac12\\rho(u_u^2 - u_l^2) \\approx \\rho V_\\infty (u_u - u_l)$; summing that along the chord gives exactly $\\rho V_\\infty\\Gamma$ (see the derivation below). The same lift can be counted as the downward momentum given to the air — three bookkeepings of one physics ([[how-lift-works]]).

### Circulation and the lift coefficient
Comparing with $L' = \\tfrac12\\rho V_\\infty^2\\,c\\,c_l$ gives

$$\\Gamma = \\tfrac12\\, V_\\infty\\, c\\, c_l$$

A light-aircraft wing of 1.5 m chord at 60 m/s and $c_l = 0.5$ carries $\\Gamma = 22.5\\ \\mathrm{m^2/s}$ and lifts 1650 N per metre of span. At a fixed angle of attack $\\Gamma$ grows in proportion to the speed, so the lift grows with $V^2$, as the [[lift-equation]] says.

### Who sets the circulation?
Potential flow round an airfoil allows *any* circulation. Nature chooses the one that makes the flow leave the sharp trailing edge smoothly — the [[kutta-condition|Kutta condition]]. When a wing starts moving, the lower-surface air first whips round the trailing edge; within a fraction of a second viscosity rolls that flow into a **starting vortex** that is left behind, carrying circulation $-\\Gamma$, while $+\\Gamma$ stays with the wing as a **bound vortex**. Kelvin's theorem requires the total to stay zero, and it does.

### From sections to wings
A bound vortex cannot simply end at a wing tip (Helmholtz's law), so it turns and trails downstream as the two [[wingtip-vortices|tip vortices]]: the horseshoe vortex. The trailing vortices induce the [[downwash]] that tilts the lift backward — [[induced-drag|induced drag]], the one drag that remains in three-dimensional ideal flow. [[lifting-line|Lifting-line theory]] applies Kutta–Joukowski strip by strip along the span, and the whole weight of an aircraft in level flight is $W = \\rho V_\\infty \\int \\Gamma\\,dy$.

| Aircraft (level flight, sea level) | Mass | Span | Speed | Mean circulation $W/\\rho V b$ |
|---|---|---|---|---|
| Light aircraft | 1100 kg | 11 m | 50 m/s | 16 m²/s |
| Single-aisle airliner, approach | 64 t | 34 m | 70 m/s | 215 m²/s |

With an elliptic lift distribution the centre circulation is $4/\\pi$ times the mean — about 274 m²/s for the airliner — and it is shed into two trailing vortices about $\\pi b/4 = 27$ m apart that sink at roughly $\\Gamma/2\\pi b_0 \\approx 1.6$ m/s.

> [!warn] Wake vortices from large aircraft can upset a following aircraft. The figures here are rounded illustrations; real wake-turbulence separation follows air traffic control rules, the aircraft's approved manuals and training.
`,
  derivation: {
    title: 'Lift from circulation on a thin section',
    intro: 'Take a thin wing section of chord c in a stream V∞, with air running at u_u just above it and u_l just below.',
    steps: [
      { text: 'Go clockwise round a loop hugging the section: along the top in the direction of the flow, back along the bottom against it.', tex: '\\Gamma = \\int_0^c u_u\\,dx - \\int_0^c u_l\\,dx = \\int_0^c (u_u - u_l)\\,dx' },
      { text: 'Bernoulli above and below (same total pressure, potential flow):', tex: 'p_l - p_u = \\tfrac12\\rho\\,(u_u^2 - u_l^2) = \\tfrac12\\rho\\,(u_u + u_l)(u_u - u_l)' },
      { text: 'For a thin section the speeds differ only slightly from the stream, so the average of the two is close to V∞:', tex: 'p_l - p_u \\approx \\rho V_\\infty\\,(u_u - u_l)' },
      { text: 'Add up the pressure difference along the chord:', tex: "L' = \\int_0^c (p_l - p_u)\\,dx = \\rho V_\\infty \\int_0^c (u_u - u_l)\\,dx = \\rho V_\\infty \\Gamma" }
    ],
    outro: 'The exact theorem, for any shape and without the thin-section approximation, follows from a momentum balance on a large circle round the body: the cross term between the uniform stream and the vortex part of the flow leaves precisely ρV∞Γ.'
  },
  ideas: [
    'Lift per metre of span is L′ = ρV∞Γ for any two-dimensional shape in steady inviscid flow, with zero drag.',
    'Circulation measures how much faster the air passes over the top than underneath; it is not air circling the wing.',
    'Γ = ½V∞c c_l links circulation to the section lift coefficient.',
    'The Kutta condition at a sharp trailing edge fixes Γ; the wing leaves an equal and opposite starting vortex behind.',
    'On a real wing the bound vortex turns into the tip vortices, causing downwash and induced drag.'
  ],
  pitfalls: [
    'Circulation means the air travels round the wing in loops — No air circles the wing. Circulation is a line integral: air passes over and under, the top faster than the bottom. Upper-surface air even reaches the trailing edge first, so the "equal transit time" story is wrong too.',
    'Kutta–Joukowski is a rival explanation of lift to Newton or Bernoulli — It is the same physics counted a third way: circulation, the pressure difference and the downward momentum given to the air all describe one flow.',
    'The circulation is a property of the shape alone — It depends on the speed and angle of attack as well: Γ = ½V∞c c_l grows with both.'
  ],
  formulas: [
    {
      name: 'Kutta–Joukowski theorem',
      expr: 'Lp = rho*V*Gam', tex: "L' = \\rho\\, V_\\infty\\, \\Gamma",
      vars: {
        Lp: { name: 'lift per metre of span', q: false, unit: 'N/m', tex: "L'" },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'free-stream speed', q: 'speed', unit: 'm/s', value: 60, tex: 'V_\\infty' },
        Gam: { name: 'circulation', q: false, unit: 'm²/s', value: 22.5, tex: '\\Gamma' }
      },
      note: 'Steady, two-dimensional, inviscid flow; valid for any body shape, and also in subsonic compressible flow with the free-stream density.',
      practice: { unknowns: ['Lp', 'Gam', 'V'] },
      stories: {
        Lp: 'A wing section in a {V} stream of density {rho} carries a circulation of {Gam}. How much lift does each metre of span make?',
        Gam: 'A section must lift {Lp} at {V} in air of density {rho}. What circulation does it need?'
      }
    },
    {
      name: 'Circulation from the section lift coefficient',
      expr: 'Gam = 0.5*V*c*cl', tex: '\\Gamma = \\tfrac12\\, V_\\infty\\, c\\, c_l',
      vars: {
        Gam: { name: 'circulation', q: false, unit: 'm²/s', tex: '\\Gamma' },
        V: { name: 'free-stream speed', q: 'speed', unit: 'm/s', value: 60, tex: 'V_\\infty' },
        c: { name: 'chord', q: 'length', unit: 'm', value: 1.5 },
        cl: { name: 'section lift coefficient', value: 0.5, min: -2, max: 3, signed: true, tex: 'c_l' }
      },
      note: 'From ρV∞Γ = ½ρV∞²c c_l.',
      stories: { Gam: 'A section of chord {c} flies at {V} with a lift coefficient of {cl}. What is its circulation?', cl: 'A section of chord {c} at {V} carries a circulation of {Gam}. What is its lift coefficient?' }
    },
    {
      name: 'Mean circulation of a wing in level flight',
      expr: 'Gam = m*g/(rho*V*b)', tex: '\\bar\\Gamma = \\dfrac{m g}{\\rho V_\\infty b}',
      vars: {
        Gam: { name: 'mean circulation along the span', q: false, unit: 'm²/s', tex: '\\bar\\Gamma' },
        m: { name: 'aircraft mass', q: 'mass', unit: 't', value: 64 },
        g: { const: 'g' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'true airspeed', q: 'speed', unit: 'm/s', value: 70, tex: 'V_\\infty' },
        b: { name: 'wing span', q: 'length', unit: 'm', value: 34 }
      },
      note: 'Lift = weight = ρV∞∫Γ dy. For an elliptic distribution the centre value is 4/π times this mean.',
      practice: { unknowns: ['Gam', 'V'] },
      stories: { Gam: 'An aircraft of {m} with a span of {b} flies level at {V} in air of density {rho}. What is the mean circulation of its wing?' }
    }
  ],
  examples: [
    {
      title: 'A light aircraft\'s wing',
      q: 'A light aircraft of 1100 kg with an 11 m span and a 1.5 m chord flies level at 50 m/s at sea level. Find the mean circulation of its wing and the section lift coefficient it implies.',
      steps: [
        'Weight $W = 1100 \\times 9.81 = 10\\,790$ N.',
        'Mean circulation: $\\bar\\Gamma = W/(\\rho V_\\infty b) = 10\\,790/(1.225 \\times 50 \\times 11) = 16.0\\ \\mathrm{m^2/s}$.',
        'Section lift coefficient: $c_l = 2\\Gamma/(V_\\infty c) = 2 \\times 16.0/(50 \\times 1.5) = 0.43$.',
        'Check with the lift equation: $C_L = W/(qS) = 10\\,790/(1531 \\times 16.5) = 0.43$.'
      ],
      a: 'About 16 m²/s of circulation, c_l ≈ 0.43 — the same answer as the lift equation, counted another way.'
    },
    {
      title: 'The wake of an airliner',
      q: 'A 64 t airliner with a 34 m span approaches at 70 m/s at sea level. Estimate its centre-span circulation (elliptic loading), and how fast its two trailing vortices sink.',
      steps: [
        'Mean circulation: $64\\,000 \\times 9.81/(1.225 \\times 70 \\times 34) = 215\\ \\mathrm{m^2/s}$; centre value $\\Gamma_0 = (4/\\pi) \\times 215 = 274\\ \\mathrm{m^2/s}$.',
        'The trailing vortices roll up about $b_0 = \\pi b/4 = 26.7$ m apart, each carrying about $\\Gamma_0$.',
        'Each is carried down by the other\'s swirl: $w = \\Gamma_0/(2\\pi b_0) = 274/(2\\pi \\times 26.7) = 1.6$ m/s, about 100 m a minute.'
      ],
      a: 'Centre circulation about 270 m²/s; the vortex pair sinks at roughly 1.6 m/s.'
    }
  ],
  quiz: [
    { q: 'At a fixed angle of attack, the circulation round an airfoil is proportional to…', choices: ['the flight speed V', 'V²', '1/V', 'nothing — it is fixed by the shape'], a: 0,
      why: 'Γ = ½V∞c c_l, and c_l is fixed by the angle of attack, so Γ ∝ V. The lift ρV∞Γ then grows as V², as the lift equation says.' },
    { q: 'According to the Kutta–Joukowski theorem, the drag on a two-dimensional airfoil in steady inviscid flow is…', choices: ['ρV∞Γ', 'a few per cent of the lift', 'zero', 'equal to the induced drag'], a: 2,
      why: 'The theorem gives a force exactly perpendicular to the stream. Drag in two-dimensional flow needs viscosity; induced drag appears only on finite wings.' },
    { q: 'A section of chord 2 m flies at 40 m/s with c_l = 1.2. What is its circulation?', answer: 48, unit: 'm²/s', tol: 0.02,
      why: 'Γ = ½V∞c c_l = 0.5 × 40 × 2 × 1.2 = 48 m²/s.' },
    { q: 'When a wing starts moving from rest, the starting vortex it leaves behind has…', choices: ['the same circulation as the bound vortex', 'circulation equal and opposite to the bound vortex', 'no circulation', 'twice the bound circulation'], a: 1,
      why: 'Kelvin\'s theorem: the total circulation of a loop enclosing both, which started at zero, stays zero. The wing keeps +Γ and the starting vortex carries −Γ away.' },
    { q: 'The Kutta–Joukowski theorem applies only to airfoils with sharp trailing edges.', a: false,
      why: 'It holds for any two-dimensional body with circulation — a cylinder, a flat plate, a spinning ball\'s section. The sharp trailing edge is what fixes the value of Γ (the Kutta condition).' }
  ],
  applications: ['Relating the lift of wings, propeller blades and rotor blades to their bound circulation.', 'Lifting-line and vortex-lattice methods for wing design.', 'Estimating wake-vortex strength behind large aircraft.', 'Rotor sails and spinning-cylinder devices (Magnus effect).'],
  history: 'Frederick Lanchester argued from about 1894 that lift is tied to a circulation round the wing and trailing vortices from its tips, published in his Aerodynamics of 1907. Independently, Wilhelm Kutta (1902, for circular-arc sections) and Nikolai Joukowski (1906, in general) proved the theorem mathematically; Joukowski\'s conformal maps then gave the first family of calculable airfoils.',
  sim: [{ id: 'pot-cylinder', params: { circ: 0.5 } }, 'ref-airfoil']
},

{
  id: 'magnus-effect', parent: 'potential-flow', title: 'The Magnus effect', level: 1,
  short: 'A spinning ball or cylinder moving through air is pushed sideways, towards the side where its surface moves along with the air streaming past — the bend of a free kick, the dip of a topspin forehand, the long carry of a golf drive and the thrust of rotor-sail ships.',
  keywords: ['Magnus effect', 'spin', 'curveball', 'topspin', 'backspin', 'sidespin', 'free kick', 'banana kick', 'Flettner rotor', 'rotor sail', 'spin ratio', 'inverse Magnus effect', 'golf ball lift'],
  prereq: ['kutta-joukowski', 'boundary-layer', 'physics:projectile-motion'],
  related: ['sports-aerodynamics', 'drag-crisis', 'flow-separation', 'cylinder-flow', 'sails', 'physics:drag-force'],
  body: `
A football struck off-centre at 25 m/s with eight revolutions a second of sidespin bends about five metres over a 25 m free kick. The force that does it is the **Magnus force**, and it is lift — the same lift a wing makes, produced by spin instead of shape.

### How spin makes lift
In a frictionless fluid a spinning ball would feel nothing: the surface cannot grip the air. Real air sticks to the surface ([[no-slip]]), so the spinning ball drags its [[boundary-layer]] round with it. On the side where the surface moves the *same way* as the air streaming past, the layer is helped along and separates late; on the side where it moves *against* the stream, the layer is slowed and separates early. The wake is thrown towards the side moving against the stream, and the ball is pushed the other way. Equivalently, the spin creates [[kutta-joukowski|circulation]]: faster air, lower pressure on one side.

The rule: **the ball is pushed towards the side whose surface moves with the airflow past it** — in vector form along $\\vec\\omega \\times \\vec V$.

| Spin (ball moving to the right) | Surface moving with the airflow | Force |
|---|---|---|
| Backspin (bottom moving forward) | the top | up: a golf drive or a flat serve floats |
| Topspin (top moving forward) | the bottom | down: a tennis ball dips into the court |
| Sidespin | one side | sideways: a curled free kick, a curveball |

### How big is it?
The force is written like any lift, $F = \\tfrac12\\rho V^2 A\\,C_L$, with $A$ the ball's cross-section. $C_L$ depends mainly on the **spin ratio** — the surface speed over the flight speed:

$$S = \\frac{\\omega r}{V}$$

For sports balls $C_L$ rises from below 0.1 at $S = 0.05$ to 0.25–0.3 at $S = 0.25$ and levels off near 0.4–0.5 above $S \\approx 0.5$ (measurements scatter by tens of per cent with the seams, dimples, fuzz and Reynolds number).

| Shot (typical) | Speed | Spin | $S$ | $C_L$ | Magnus force ÷ weight |
|---|---|---|---|---|---|
| Football, curled free kick | 25 m/s | 480 rpm | 0.22 | 0.25 | 0.9 |
| Golf, driver | 70 m/s | 2700 rpm | 0.09 | 0.12 | 1.2 |
| Tennis, topspin drive | 30 m/s | 2500 rpm | 0.29 | 0.30 | 1.0 |
| Table tennis, topspin loop | 12 m/s | 4000 rpm | 0.70 | 0.45 | 1.9 |

A golf ball leaves the driver with more lift than weight, which is why it climbs on a long, flat arc and carries nearly twice as far as it would without spin. Spin decays only slowly, but the ball slows down, so $S$ and $C_L$ grow during the flight: the path of a curled kick bends most sharply near the goal.

### Surprises
Smooth balls near the [[drag-crisis|drag crisis]] can show the **inverse Magnus effect**: the side moving against the flow turns turbulent first, separates *later*, and the force reverses. A ball with almost no spin (a knuckleball, a "floater" serve) wobbles unpredictably as its seams shift the separation points.

### Rotor ships
Anton Flettner replaced a ship's sails with tall spinning cylinders; his rotor ship *Baden-Baden* crossed the Atlantic in 1926. A rotor sail 30 m high and 5 m across, spun so its surface moves at three times a 10 m/s cross wind, reaches $C_L$ around 8 with end plates — a force of order 70 kN. Rotor sails have returned on cargo ships since the 2010s as fuel-saving assistance, with reported savings from a few to over ten per cent depending on route and wind.
`,
  ideas: [
    'A spinning body in real air feels a lift at right angles to its motion, along ω × V: the Magnus force.',
    'Viscosity is essential: the spinning surface drags the boundary layer, delaying separation on one side and hastening it on the other.',
    'The force is F = ½ρV²A C_L, with C_L set mainly by the spin ratio S = ωr/V.',
    'Backspin lifts, topspin pushes down, sidespin curls; most shots mix them.',
    'Spinning cylinders can reach lift coefficients near 10 — the principle of rotor sails.'
  ],
  pitfalls: [
    'The ball is pushed towards the side where the surface moves into the air — It is the opposite: the force is towards the side whose surface moves along with the airflow past the ball, where the air runs faster and the pressure is lower.',
    'Doubling the spin doubles the curve — The lift coefficient levels off at high spin ratio (around 0.4–0.5 for balls), and near the drag crisis a smooth ball can even curve the wrong way.',
    'A spinning ball would curve just the same in an ideal, frictionless fluid — Without viscosity the surface cannot drag the air, no circulation forms and there is no Magnus force.'
  ],
  formulas: [
    {
      name: 'Spin ratio',
      expr: 'S = omega*r/V', tex: 'S = \\dfrac{\\omega\\, r}{V}',
      vars: {
        S: { name: 'spin ratio (surface speed ÷ flight speed)' },
        omega: { name: 'spin rate', q: 'angvel', unit: 'rpm', value: 480, tex: '\\omega' },
        r: { name: 'ball radius', q: 'length', unit: 'm', value: 0.11 },
        V: { name: 'flight speed', q: 'speed', unit: 'm/s', value: 25 }
      },
      note: 'The main parameter for the Magnus lift coefficient of balls and cylinders.',
      stories: { S: 'A ball of radius {r} flies at {V} spinning at {omega}. What is its spin ratio?', omega: 'How fast must a ball of radius {r} spin at {V} to reach a spin ratio of {S}?' }
    },
    {
      name: 'Magnus force on a ball',
      expr: 'F = 0.5*rho*V^2*(pi*d^2/4)*CL', tex: 'F_M = \\tfrac12\\rho V^2\\,\\dfrac{\\pi d^2}{4}\\,C_L',
      vars: {
        F: { name: 'Magnus force', q: 'force', unit: 'N', tex: 'F_M' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'flight speed', q: 'speed', unit: 'm/s', value: 25 },
        d: { name: 'ball diameter', q: 'length', unit: 'm', value: 0.22 },
        CL: { name: 'Magnus lift coefficient', value: 0.25, min: 0, max: 1, tex: 'C_L' }
      },
      note: 'C_L ≈ 0.1–0.5 for sports balls, depending on the spin ratio, the surface and the Reynolds number.',
      practice: { unknowns: ['F', 'CL', 'V'] },
      stories: { F: 'A {d} ball flies at {V} through air of density {rho} with a Magnus lift coefficient of {CL}. How large is the Magnus force?', CL: 'A {d} ball at {V} in air of density {rho} feels a Magnus force of {F}. What is its lift coefficient?' }
    },
    {
      name: 'Force on a rotor sail',
      expr: 'F = 0.5*rho*V^2*D*h*CL', tex: 'F = \\tfrac12\\rho V^2\\, D\\, h\\, C_L',
      vars: {
        F: { name: 'lift force on the rotor', q: 'force', unit: 'kN' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'apparent wind speed', q: 'speed', unit: 'm/s', value: 10 },
        D: { name: 'rotor diameter', q: 'length', unit: 'm', value: 5 },
        h: { name: 'rotor height', q: 'length', unit: 'm', value: 30 },
        CL: { name: 'lift coefficient', value: 8, min: 0, max: 14, tex: 'C_L' }
      },
      note: 'C_L of 8 to 10 needs a spin ratio of about 3 and an end plate; theory for an infinite cylinder allows up to 4π ≈ 12.6. The force is at right angles to the apparent wind.',
      stories: { F: 'A rotor sail {D} across and {h} tall works at a lift coefficient of {CL} in a {V} apparent wind. How large is its force?' }
    }
  ],
  examples: [
    {
      title: 'How far does a free kick bend?',
      q: 'A football (diameter 0.22 m, mass 0.43 kg) is struck at 25 m/s with 8 revolutions a second of sidespin. Estimate its spin ratio, the Magnus force and the sideways bend over a 1.3 s flight.',
      steps: [
        '$\\omega = 8 \\times 2\\pi = 50.3$ rad/s; $S = \\omega r/V = 50.3 \\times 0.11/25 = 0.22$, so $C_L \\approx 0.25$.',
        '$F = \\tfrac12 \\times 1.225 \\times 25^2 \\times (\\pi \\times 0.22^2/4) \\times 0.25 = 383 \\times 0.0380 \\times 0.25 = 3.6$ N — nearly the ball\'s weight of 4.2 N.',
        'Sideways acceleration $3.6/0.43 = 8.5\\ \\mathrm{m/s^2}$. If it stayed constant, $\\tfrac12 a t^2 = \\tfrac12 \\times 8.5 \\times 1.3^2 = 7$ m.',
        'But the ball slows to about 18 m/s, halving the dynamic pressure, and the force turns with the path. Integrating the flight (as the simulation does) gives about 5 m.'
      ],
      a: 'S ≈ 0.22, a Magnus force of about 3.6 N, and a bend of roughly 5 m.'
    },
    {
      title: 'A rotor sail',
      q: 'A rotor sail 30 m tall and 5 m in diameter spins so its surface moves at 30 m/s in a 10 m/s cross wind. With $C_L \\approx 8$, what force does it make, and how fast does it turn?',
      steps: [
        'Spin ratio $S = 30/10 = 3$; surface speed $\\omega R = 30$ m/s gives $\\omega = 30/2.5 = 12$ rad/s, about 115 rpm.',
        '$F = \\tfrac12 \\times 1.225 \\times 10^2 \\times (5 \\times 30) \\times 8 = 61.3 \\times 150 \\times 8 = 73\\,500$ N.',
        'That is about 7.5 tonnes-force, acting at right angles to the apparent wind.'
      ],
      a: 'About 74 kN at 115 rpm.'
    }
  ],
  quiz: [
    { q: 'A ball flies to the right with backspin (its bottom surface moving forward). The Magnus force on it points…', choices: ['up', 'down', 'forward', 'backward'], a: 0,
      why: 'Relative to the ball the air streams backward; with backspin the top surface moves backward too, with the airflow. The air over the top is faster and the pressure lower: the force is upward. That is how a golf ball climbs.' },
    { q: 'Compared with a flat shot at the same speed and angle, a tennis ball hit with heavy topspin…', choices: ['travels farther', 'dips sooner and lands shorter, so it can be hit harder and still land in', 'curves to the side', 'is unaffected until it bounces'], a: 1,
      why: 'Topspin pushes the ball down, adding to gravity. Players use it to hit hard, clear the net comfortably and still land inside the baseline.' },
    { q: 'What is the spin ratio of a golf ball (diameter 42.7 mm) spinning at 3000 rpm and flying at 60 m/s?', answer: 0.112, tol: 0.03,
      why: 'ω = 3000 × 2π/60 = 314 rad/s; S = ωr/V = 314 × 0.02135/60 = 0.112.' },
    { q: 'In a perfectly frictionless (inviscid) fluid, a spinning ball would feel no Magnus force.', a: true,
      why: 'Without viscosity the spinning surface cannot drag the fluid, so no circulation develops and the flow is the same as round a ball that is not spinning.' },
    { q: 'A rotor ship sails best with the wind…', choices: ['directly behind it', 'directly ahead', 'from the side (abeam)', 'it does not matter'], a: 2,
      why: 'The Magnus force acts at right angles to the apparent wind. With the wind across the ship that force points forward along its course.' }
  ],
  problems: [
    { q: 'A tennis ball (diameter 67 mm, mass 58 g) flies at 30 m/s with a Magnus lift coefficient of 0.30. How large is the Magnus force, and how does it compare with the ball\'s weight?', answer: 0.583, unit: 'N', tol: 0.03,
      steps: ['$A = \\pi \\times 0.067^2/4 = 3.53\\times10^{-3}\\ \\mathrm{m^2}$; $q = \\tfrac12 \\times 1.225 \\times 30^2 = 551$ Pa.', '$F = qAC_L = 551 \\times 3.53\\times10^{-3} \\times 0.30 = 0.583$ N — about the ball\'s weight, 0.569 N.'] }
  ],
  applications: ['Curled free kicks, curveballs, topspin and slice in tennis, backspin in golf and table tennis.', 'Rotor sails on modern cargo ships, and Flettner\'s 1920s rotor ships.', 'Spinning-cylinder lift devices and experimental rotor aircraft and wind turbines.', 'The drift of spinning shells and bullets, noticed by the first ballistics experimenters.'],
  history: 'Isaac Newton described the curving flight of a sliced tennis ball in 1672, and Benjamin Robins showed in the 1740s that spinning musket balls veer. Gustav Magnus measured the sideways force on a spinning cylinder in a stream in 1852. Lord Rayleigh explained the tennis ball in 1877, and Anton Flettner built rotor ships in the 1920s.',
  sim: 'pot-magnus'
},

{
  id: 'dalembert-paradox', parent: 'potential-flow', title: 'D\'Alembert\'s paradox', level: 2,
  short: 'In a perfectly frictionless fluid a body moving at steady speed feels no drag at all, whatever its shape — a result d\'Alembert reached in 1752 that flatly contradicts experience. The way out is the thin boundary layer, where the smallest viscosity changes everything.',
  keywords: ['d\'Alembert', 'paradox', 'zero drag', 'inviscid flow', 'ideal fluid', 'boundary layer', 'separation', 'pressure recovery', 'wake', 'Prandtl', 'pressure drag', 'added mass', 'base pressure'],
  prereq: ['cylinder-flow', 'boundary-layer', 'no-slip'],
  related: ['flow-separation', 'form-drag', 'drag-crisis', 'bluff-bodies', 'streamlining', 'induced-drag', 'wave-drag', 'navier-stokes'],
  body: `
Work out the potential flow round a cylinder and add up the pressures: the front is pushed back exactly as hard as the rear is pushed forward. Try a sphere, an ellipse, a lorry, a brick: in steady potential flow the answer is always **zero drag**. Jean le Rond d'Alembert reached this conclusion in 1752 and called it a paradox, because anyone who has walked into the wind knows it is false.

### Why ideal flow cannot give drag
Two ways to see it:

- **Symmetry of pressure.** In potential flow the air decelerates into a rear stagnation point just as it accelerated away from the front one. The pressure climbs back to $C_p = +1$ at the back and pushes the body forward exactly as much as the front pushes it back.
- **Energy.** Drag times speed is power fed into the air. Ideal flow has no friction to turn that power into heat and, in steady flow, leaves no disturbed wake behind to carry it away. With nowhere for the energy to go, the force must vanish.

The result holds for any shape moving steadily through an unbounded, incompressible, inviscid fluid. Ideal flow does give a force while a body *accelerates*: it must also accelerate some of the surrounding fluid, its **added mass** — $\\rho\\pi R^2$ per metre for a cylinder, half the displaced mass for a sphere.

### The way out: a thin sticky layer
The resolution came in 1904 from Ludwig Prandtl. However small the viscosity, air sticks to the surface ([[no-slip]]), so there is always a thin [[boundary-layer]] in which friction matters. Over the rear of a bluff body the pressure must rise again; the slow air near the wall has too little momentum to climb that pressure hill, stops, and turns back. The flow **separates**, and behind the body lies a wide wake at low pressure. The rear never gets its push back:

| Circular cylinder | Pressure at the rear point | Drag coefficient $C_D$ |
|---|---|---|
| Potential flow | $C_p = +1$ | 0 |
| Real, $Re \\approx 10^4$–$2\\times10^5$ (laminar separation near 80°) | $C_p \\approx -1.1$ | ≈ 1.2 |
| Real, $Re \\approx 5\\times10^5$–$10^6$ (after the [[drag-crisis\\|drag crisis]]) | $C_p \\approx -0.3$ | ≈ 0.3 |
| Streamlined strut of the same thickness | recovers most of the way | ≈ 0.05–0.1 |

Almost all of a bluff body's drag is this **pressure (form) drag**; skin friction adds only a few per cent. Making the air less viscous — raising the Reynolds number — does not make the paradox come true: the boundary layer gets thinner but still separates. A cylinder's $C_D$ stays near 1 from $Re \\approx 10^3$ to $2\\times10^5$, and even after the drag crisis never falls much below 0.2.

### Other ways ideal flow does give drag
The paradox needs steady, two-dimensional (or non-lifting), subsonic, unbounded flow. Relax a condition and inviscid theory finds drag after all: a finite lifting wing trails vortices that carry energy away ([[induced-drag]]), a supersonic body makes shock waves ([[wave-drag]]), and a ship makes surface waves.

> [!key] Streamlining works by letting the pressure rise gently enough that the boundary layer stays attached. The ideal potential-flow pressure distribution is the target; separation is what stops a body reaching it.
`,
  ideas: [
    'Steady potential flow gives exactly zero drag on any body: the rear pressure recovers and pushes forward as hard as the front pushes back.',
    'The energy argument: without friction or a wake there is nowhere for drag work to go.',
    'Viscosity, however small, creates a boundary layer that separates on the rear of bluff bodies, leaving a low-pressure wake: pressure drag.',
    'Inviscid theory does predict added mass in acceleration, induced drag of finite wings, wave drag in supersonic flow and wave-making drag of ships.',
    'Streamlining aims to keep the flow attached so the real pressure approaches the ideal one.'
  ],
  pitfalls: [
    'Potential flow misses only the skin friction — The larger miss on a bluff body is pressure drag: in real flow the rear pressure never recovers, because the flow separates.',
    'The paradox shows potential-flow theory is wrong — It is a correct consequence of its assumptions. It showed that viscosity cannot simply be dropped near a surface, and led to boundary-layer theory; outside the boundary layer potential flow is still used.',
    'At very high Reynolds numbers the drag of a bluff body tends to zero — The boundary layer thins but does not vanish, and it still separates; a cylinder\'s C_D stays between about 0.2 and 1.2 however large the Reynolds number.'
  ],
  formulas: [
    {
      name: 'Drag per metre of a real cylinder',
      expr: 'Dp = 0.5*rho*V^2*d*CD', tex: "D' = \\tfrac12\\rho V^2\\, d\\, C_D",
      vars: {
        Dp: { name: 'drag per metre of length', q: false, unit: 'N/m', tex: "D'" },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'wind speed', q: 'speed', unit: 'm/s', value: 20 },
        d: { name: 'diameter', q: 'length', unit: 'm', value: 0.3 },
        CD: { name: 'drag coefficient', value: 1.2, min: 0, max: 3, tex: 'C_D' }
      },
      note: 'C_D ≈ 1.2 for a smooth cylinder at Re ≈ 10⁴–2×10⁵, about 0.3 just past the drag crisis. Potential flow would give C_D = 0.',
      stories: { Dp: 'Wind at {V} blows across a pole {d} in diameter (C_D = {CD}) in air of density {rho}. What is the drag on each metre?', CD: 'A pole {d} across feels {Dp} of drag per metre in a {V} wind (air density {rho}). What is its drag coefficient?' }
    },
    {
      name: 'Added mass of a cylinder, per metre',
      expr: 'ma = rho*pi*R^2', tex: 'm_a = \\rho\\,\\pi R^2',
      vars: {
        ma: { name: 'added mass per metre of length', q: 'lindensity', unit: 'kg/m', tex: 'm_a' },
        rho: { name: 'fluid density', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        R: { name: 'cylinder radius', q: 'length', unit: 'm', value: 0.15 }
      },
      note: 'The extra mass a cylinder seems to have when it accelerates sideways through an ideal fluid — the one force potential flow does give. For a sphere it is half the mass of fluid displaced. Negligible in air, important in water.',
      stories: { ma: 'A cylinder of radius {R} accelerates through a fluid of density {rho}. What added mass does each metre of it carry?' }
    }
  ],
  examples: [
    {
      title: 'Wind on a flagpole',
      q: 'A flagpole 0.15 m in diameter and 10 m tall stands in a 15 m/s wind at sea level. What drag does potential flow predict, and what does it really feel?',
      steps: [
        'Potential flow: zero, whatever the wind.',
        'Reynolds number $Vd/\\nu = 15 \\times 0.15/1.5\\times10^{-5} = 1.5\\times10^5$: below the drag crisis, so $C_D \\approx 1.2$.',
        '$q = \\tfrac12 \\times 1.225 \\times 15^2 = 138$ Pa; drag $= qdLC_D = 138 \\times 0.15 \\times 10 \\times 1.2 = 248$ N (the flag adds more).'
      ],
      a: 'About 250 N, against zero in ideal flow.'
    },
    {
      title: 'Where the missing push went',
      q: 'A 0.3 m cylinder stands in a 20 m/s stream. Compare the pressure at its rearmost point in potential flow ($C_p = +1$) with a typical measured base pressure ($C_p \\approx -1.1$).',
      steps: [
        '$q = \\tfrac12 \\times 1.225 \\times 20^2 = 245$ Pa.',
        'Ideal: $p - p_\\infty = +245$ Pa, pushing the cylinder forward. Real: $-1.1 \\times 245 = -270$ Pa, pulling it back.',
        'The difference, $2.1\\,q = 515$ Pa acting over much of the rear half, is the drag: about $1.2 \\times 245 \\times 0.3 = 88$ N per metre.'
      ],
      a: 'About 515 Pa less pressure at the back than ideal flow promises, giving roughly 88 N of drag per metre.'
    }
  ],
  quiz: [
    { q: 'According to potential-flow theory, a sphere moving at constant speed through still air feels…', choices: ['drag proportional to V²', 'drag proportional to V', 'no drag at all', 'drag only from skin friction'], a: 2,
      why: 'd\'Alembert\'s result: in steady inviscid flow the rear pressures recover and cancel the front ones exactly, for any shape.' },
    { q: 'Prandtl\'s resolution of the paradox rests on…', choices: ['compressibility of air', 'a thin boundary layer where viscosity always matters, however small it is', 'turbulence in the free stream', 'the roughness of real surfaces'], a: 1,
      why: 'No slip holds for any viscosity, so a boundary layer always forms; its separation on the rear of a body leaves the low-pressure wake that causes pressure drag.' },
    { q: 'Which force does ideal-flow theory predict correctly for a body in air or water?', choices: ['the drag of a bluff body', 'the extra force needed to accelerate it (added mass)', 'the stall of a wing', 'the drag of a golf ball'], a: 1,
      why: 'Accelerating a body also accelerates fluid round it; ideal flow gives this added-mass force exactly. Steady drag, stall and separation need viscosity.' },
    { q: 'A 5 cm cylinder, 2 m long, stands in a 10 m/s wind at sea level with C_D = 1.2. What is its drag?', answer: 7.35, unit: 'N', tol: 0.02,
      why: 'D = ½ρV²dLC_D = 0.5 × 1.225 × 100 × 0.05 × 2 × 1.2 = 7.35 N.' },
    { q: 'Making the air less viscous (a higher Reynolds number) steadily brings the drag coefficient of a cylinder down towards the ideal zero.', a: false,
      why: 'C_D stays near 1.2 from about 10³ to 2×10⁵, drops to about 0.3 at the drag crisis, then rises again to 0.5–0.7. It never approaches zero: separation persists.' }
  ],
  applications: ['Understanding why streamlining (gentle pressure recovery, attached flow) is the key to low drag.', 'Estimating wind loads on poles, cables and towers with measured drag coefficients.', 'Added mass in the design of underwater vehicles, offshore structures and ship manoeuvring.', 'Recognising when a potential-flow or panel-method answer can be trusted (attached flow) and when not.'],
  history: 'D\'Alembert published the paradox in 1752, after Euler had reached similar results. For a century and a half "hydrodynamics" (elegant, frictionless) and "hydraulics" (practical, empirical) went separate ways, until Prandtl\'s eight-page paper at the Heidelberg congress of 1904 introduced the boundary layer and reconciled them.',
  sim: { id: 'pot-cylinder', params: { real: true } }
},

/* ================================================================ COMPUTATIONAL AERODYNAMICS */
{
  id: 'panel-methods', parent: 'computation', title: 'Panel methods', level: 3,
  short: 'Cover a body\'s surface with small flat panels, give each a source or vortex strength, and choose the strengths so that no air flows through any panel: a few hundred linear equations give the potential flow — and the pressures and lift — round any shape.',
  keywords: ['panel method', 'Hess-Smith', 'boundary element method', 'source panel', 'vortex panel', 'influence coefficients', 'Kutta condition', 'cosine spacing', 'XFOIL', 'vortex lattice', 'linear system', 'discretisation'],
  prereq: ['potential-flow-basics', 'sources-vortices', 'kutta-condition', 'math:systems-of-equations'],
  related: ['pressure-distribution', 'naca-airfoils', 'thin-airfoil-theory', 'cfd', 'lifting-line', 'kutta-joukowski', 'pressure-coefficient', 'math:gaussian-elimination'],
  body: `
Potential flow is linear, and the body surface is a streamline. A panel method uses both facts: instead of filling the space round a body with millions of cells, as [[cfd|CFD]] does, it puts all the unknowns on the surface. The approach is a boundary-element method, and it computed the first flows round complete aircraft in the 1960s.

### How it works
1. **Cut the surface into panels.** An airfoil becomes a polygon of $N$ straight panels; a three-dimensional aircraft, a few thousand flat quadrilaterals.
2. **Put a singularity on each panel.** In the Hess–Smith method, used by the [airfoil lab](#/tools/airfoil) and the simulation below, each panel carries a uniform sheet of [[sources-vortices|sources]] of unknown strength $\\sigma_j$, and every panel carries the same vortex strength $\\gamma$: $N + 1$ unknowns.
3. **Write the boundary condition.** At each panel's midpoint — its **control point** — the velocity normal to the panel must be zero: the free stream plus the effect of every panel. That gives $N$ linear equations: $\\sum_j A_{ij}\\sigma_j + B_i\\,\\gamma = -\\vec V_\\infty \\cdot \\hat n_i$. The **influence coefficients** $A_{ij}$ depend on the geometry alone.
4. **Add the Kutta condition.** The flow must leave the trailing edge smoothly: equal tangential speeds on the two panels meeting there. That is equation $N + 1$.
5. **Solve and post-process.** The tangential speed at each control point gives $C_p = 1 - (V_t/V_\\infty)^2$; summing pressures gives $c_l$ and $c_m$. The lift also follows from the total circulation, $\\Gamma = \\gamma \\times$ perimeter, via [[kutta-joukowski|Kutta–Joukowski]].

### Cost
The influence matrix has $N^2$ entries, and Gaussian elimination needs about $\\tfrac23 N^3$ operations. For 200 panels that is 5 million operations — a millisecond on a laptop. A 5000-panel aircraft has 25 million coefficients (200 MB) and needs $8\\times10^{10}$ operations: an hour of a 1970s supercomputer, a few seconds today (and much less with iterative and fast-multipole solvers).

### How many panels?
Panels must be small where the flow changes fast: round the leading edge, where the suction peak sits, and at the trailing edge. **Cosine spacing** — $x = \\tfrac12(1 - \\cos\\beta)$ with equal steps in $\\beta$ — clusters them there. For a NACA 2412 at 5° (Hess–Smith, inviscid):

| Panels | $c_l$, cosine spacing | $c_l$, uniform spacing |
|---|---|---|
| 8 | 0.827 | 0.786 |
| 16 | 0.860 | 0.824 |
| 32 | 0.866 | 0.844 |
| 64 | 0.866 | 0.854 |
| 128 | 0.864 | 0.858 |
| 256 | 0.863 | 0.860 |

The converged value is about 0.862 (thin-airfoil theory gives 0.776; thickness adds lift). With cosine spacing a few dozen panels are within half a per cent; uniform spacing needs several times as many. This method converges roughly in proportion to $1/N$, so the last digits come slowly.

### What it cannot do
The answer is inviscid: no skin friction, no separation, no stall. Measured lift is typically around 10 % below the panel value at moderate angles, because the thickening boundary layer on the rear upper surface in effect reduces the camber — for the NACA 2412 at 5°, wind-tunnel data give about 0.75 against the panel method's 0.86 — and above the stall the panel method keeps promising more lift. Coupling it to a boundary-layer calculation — the viscous–inviscid interaction of Mark Drela's XFOIL (1986) — adds friction drag, transition and moderate separation. Compressibility is added through the Prandtl–Glauert correction, as long as no shock waves form. **Vortex-lattice** methods simplify further, putting horseshoe vortices on a thin lifting surface — the workhorse for wing loading and stability derivatives.
`,
  ideas: [
    'A panel method puts sources and vortices on the body surface and chooses their strengths so no air crosses any panel.',
    'The result is N + 1 linear equations (N panels plus the Kutta condition), with influence coefficients from geometry alone.',
    'Surface speeds give C_p = 1 − (V_t/V∞)²; the pressures or the circulation give the lift.',
    'Panels must cluster where the flow changes fast (nose, trailing edge): cosine spacing converges several times faster than uniform.',
    'The answer is inviscid: coupling with a boundary-layer method adds friction, transition and drag.'
  ],
  pitfalls: [
    'More panels always give a more accurate answer — Once converged, more panels change nothing; the remaining gap to experiment is missing physics (viscosity), and very uneven or badly shaped panels can even spoil the answer.',
    'A converged panel c_l should match the wind tunnel — The inviscid answer is typically around 10 % high at moderate angles and ignores the stall entirely.',
    'The panels are the airfoil — They approximate it with straight segments; the boundary condition is only enforced at the control points, and a coarse polygon cuts off the rounded nose where the suction peak lives.'
  ],
  formulas: [
    {
      name: 'Surface pressure from the computed speed',
      expr: 'Cp = 1 - (Vt/V)^2', tex: 'C_p = 1 - \\left(\\dfrac{V_t}{V_\\infty}\\right)^2',
      vars: {
        Cp: { name: 'pressure coefficient at the control point', signed: true, min: -50, max: 1, tex: 'C_p' },
        Vt: { name: 'tangential speed at the control point', q: 'speed', unit: 'm/s', value: 70, tex: 'V_t' },
        V: { name: 'free-stream speed', q: 'speed', unit: 'm/s', value: 50, tex: 'V_\\infty' }
      },
      note: 'The normal speed is zero by construction, so the tangential speed is the whole speed there.',
      stories: { Cp: 'A panel method finds {Vt} at a control point in a {V} free stream. What is the pressure coefficient?', Vt: 'The pressure coefficient at a control point is {Cp} in a {V} stream. What tangential speed did the panel method find?' }
    },
    {
      name: 'Work to solve the panel equations',
      expr: 'ops = 2/3*N^3', tex: 'W \\approx \\tfrac23\\, N^3',
      vars: {
        ops: { name: 'arithmetic operations (Gaussian elimination)', tex: 'W' },
        N: { name: 'number of unknowns (panels + 1)', value: 200, int: true, min: 1 }
      },
      note: 'Direct solution of a dense system. Iterative solvers with fast multipole methods bring large 3-D cases closer to N log N.',
      stories: { ops: 'How many operations does Gaussian elimination take for a panel method with {N} unknowns?', N: 'A computer can afford {ops} operations. How many panel unknowns can it solve directly?' }
    }
  ],
  examples: [
    {
      title: 'Sizing the problem',
      q: 'How big is the linear system for a 160-panel airfoil, and for a 5000-panel aircraft, and how much work does direct elimination take?',
      steps: [
        'Airfoil: 161 unknowns; $161^2 = 25\\,921$ influence coefficients; $\\tfrac23 \\times 161^3 = 2.8$ million operations — well under a millisecond.',
        'Aircraft: $5000^2 = 2.5\\times10^7$ coefficients, 200 MB in double precision; $\\tfrac23 \\times 5000^3 = 8.3\\times10^{10}$ operations.',
        'At $10^{10}$ operations a second that is about 8 s; iterative solvers do better still.'
      ],
      a: '2.8 million operations for the airfoil; about 8×10¹⁰ for the aircraft — seconds today.'
    },
    {
      title: 'From a panel speed to a pressure',
      q: 'A panel method finds the tangential speed at a control point near the nose to be 1.62 $V_\\infty$. What are $C_p$ and the pressure there in a 50 m/s stream at sea level?',
      steps: [
        '$C_p = 1 - 1.62^2 = 1 - 2.62 = -1.62$.',
        '$q = \\tfrac12 \\times 1.225 \\times 50^2 = 1531$ Pa, so $p - p_\\infty = -1.62 \\times 1531 = -2490$ Pa.'
      ],
      a: 'C_p ≈ −1.62, about 2.5 kPa below the free-stream pressure.'
    }
  ],
  quiz: [
    { q: 'What condition does a panel method enforce at each control point?', choices: ['zero pressure', 'no flow through the surface', 'zero tangential speed (no slip)', 'the free-stream speed'], a: 1,
      why: 'The body surface must be a streamline, so the normal velocity is set to zero. No slip is a viscous condition that inviscid panel methods do not impose.' },
    { q: 'Why is a panel method so much cheaper than a CFD solution on a volume mesh?', choices: ['it uses a coarser computer', 'the unknowns sit only on the surface, not throughout the surrounding space', 'it ignores the Kutta condition', 'it only works in two dimensions'], a: 1,
      why: 'Laplace\'s equation can be solved with singularities on the boundary, so only surface panels are needed. A volume mesh needs cells everywhere round the body.' },
    { q: 'Cosine spacing puts more panels…', choices: ['near the leading and trailing edges', 'at mid-chord', 'on the upper surface only', 'evenly along the chord'], a: 0,
      why: 'x = ½(1 − cos β) with equal steps in β bunches points at both ends of the chord, where the curvature and the pressure change fastest.' },
    { q: 'A converged panel method predicts the stall angle of an airfoil.', a: false,
      why: 'Stall is boundary-layer separation, which inviscid potential flow cannot represent. The panel c_l keeps rising in a straight line.' },
    { q: 'How many operations does Gaussian elimination take for 400 unknowns?', answer: 4.27e7, tol: 0.02,
      why: '⅔ × 400³ = ⅔ × 6.4×10⁷ = 4.27×10⁷ — still only a few hundredths of a second.' }
  ],
  applications: ['Airfoil design and analysis for sailplanes, drones and wind-turbine blades (XFOIL and its relatives).', 'Loads and pressures on complete aircraft, pods and stores (PANAIR, VSAERO and successors).', 'Racing-car wings, yacht sails and keels, marine propellers.', 'Fast first estimates before, and alongside, full CFD.'],
  history: 'John Hess and A. M. O. Smith at Douglas Aircraft published the first practical method for arbitrary bodies in 1962–1967. Three-dimensional codes such as PANAIR and VSAERO followed in the 1970s and 1980s, and Mark Drela\'s XFOIL (1986) coupled a panel method to a boundary-layer solver to predict drag and transition.',
  sim: 'pot-panels'
},

{
  id: 'cfd', parent: 'computation', title: 'Computational fluid dynamics', level: 3,
  short: 'CFD solves the equations of fluid flow numerically: the space round a body is divided into millions of small cells, mass, momentum and energy are balanced cell by cell, and the computer iterates until the flow settles. Its answers are only as good as the mesh, the numerics and — for turbulence — the model.',
  keywords: ['CFD', 'computational fluid dynamics', 'mesh', 'grid', 'finite volume', 'finite difference', 'RANS', 'LES', 'DNS', 'y+', 'CFL number', 'residual', 'grid convergence', 'Richardson extrapolation', 'verification', 'validation', 'Kolmogorov scale'],
  prereq: ['navier-stokes', 'panel-methods', 'turbulence', 'math:pdes'],
  related: ['turbulence-models', 'wind-tunnel', 'similarity-testing', 'boundary-layer', 'turbulent-boundary-layer', 'reynolds-number', 'math:numerical-integration', 'math:euler-method'],
  body: `
The [[navier-stokes|Navier–Stokes equations]] describe almost every flow in aerodynamics, but they can be solved exactly only for a handful of simple cases. Computational fluid dynamics replaces the continuous flow by numbers at millions of points and solves the equations approximately — well enough that aircraft, cars and buildings are now designed largely in the computer, then checked in the [[wind-tunnel]].

### The chain
1. **Geometry**, cleaned of the small gaps and features the flow will not notice.
2. **Mesh**: the space round the body is divided into cells. *Structured* meshes are blocks of hexahedra — O-grids wrapped round a cylinder, C-grids round an airfoil — accurate and efficient; *unstructured* meshes of tetrahedra or polyhedra fit any shape. Near walls, thin **prism layers** resolve the [[boundary-layer]].
3. **Solver**: in the **finite-volume** method used by most aerodynamic codes, each cell is a small control volume; the flows of mass, momentum and energy through its faces must balance. The imbalances — the **residuals** — drive an iteration until they fall by four to six orders of magnitude and the forces stop changing.
4. **Post-processing**: forces, pressures, streamlines — and the question of whether to believe them.

### How fine a mesh?
Cells must be small where the flow changes fast. Next to a wall this is measured in wall units, $y^+ = y\\,u_\\tau/\\nu$, with the friction velocity $u_\\tau = V_\\infty\\sqrt{c_f/2}$. Resolving the viscous sublayer needs the first cell at $y^+ \\approx 1$; for a wing at 70 m/s that is about 5 µm from the skin, with 30–40 layers growing outward. **Wall functions**, which assume the log law, let the first cell sit at $y^+$ = 30–100 instead. Typical counts: a two-dimensional airfoil, 50 000–200 000 cells; a racing car, 50–300 million; a full aircraft in landing configuration, hundreds of millions.

Time-accurate schemes are also limited by the **CFL number** $C = u\\,\\Delta t/\\Delta x$: an explicit scheme becomes unstable if information jumps more than about one cell per time step.

### How much of the turbulence?
| Approach | Eddies resolved | Modelled | Mesh points (3-D) | Typical use |
|---|---|---|---|---|
| DNS — direct numerical simulation | all, down to the Kolmogorov scale | nothing | $\\sim Re^{9/4}$ | research at modest Re |
| LES — large-eddy simulation | the large, energetic eddies | the small ones (subgrid model) | $\\sim Re^{13/7}$ wall-resolved, $\\sim Re$ wall-modelled | wakes, jets, noise, buffet |
| RANS — Reynolds-averaged | none: only the mean flow | all of it ([[turbulence-models]]) | $\\sim$ 10⁶–10⁸, nearly independent of Re | everyday engineering |

The smallest eddies are about $\\eta \\approx L\\,Re^{-3/4}$ across, so a DNS needs $(L/\\eta)^3 \\approx Re^{9/4}$ points, and time steps in proportion to $Re^{3/4}$: the cost grows roughly as $Re^3$. At $Re = 10^4$ that is a billion points — feasible. An aircraft wing at $Re = 3\\times10^7$ would need about $10^{17}$; the largest simulations so far use a few trillion ($10^{12}$). RANS, which models all turbulence, is the workhorse; LES and hybrids are used where the unsteadiness is the point.

### Can you believe it?
- **Verification** asks whether the equations were solved right: are the residuals converged, and does refining the mesh change the answer? A *grid-convergence study* solves on three meshes, each with half the cell size, and uses **Richardson extrapolation** to estimate the mesh-independent value.
- **Validation** asks whether the right equations were solved: comparison with wind-tunnel and flight data for similar flows.

International drag-prediction workshops have shown that different codes on the same airliner geometry scatter by several to tens of drag counts (1 count = 0.0001 in $C_D$) even at cruise, and by much more near stall. CFD is superb at attached flow and at comparing design variants; separation, transition and maximum lift remain hard.

> [!key] A colourful CFD picture is not a result until the mesh has been shown not to matter and the answer has been compared with a measurement.
`,
  ideas: [
    'CFD divides the flow into cells and balances mass, momentum and energy in each; the solver iterates until the residuals fall by orders of magnitude.',
    'Cells must be small where the flow changes fast; at walls the first cell height is set in wall units, y⁺ ≈ 1 or 30–100 with wall functions.',
    'DNS resolves every eddy at a cost growing as Re³ (Re^9/4 mesh points); LES resolves the large eddies; RANS models all turbulence and is the everyday tool.',
    'Verification (mesh and iteration convergence) and validation (comparison with experiment) are both needed before a result is trusted.',
    'CFD handles attached flow well; separation, transition and maximum lift remain difficult.'
  ],
  pitfalls: [
    'A CFD picture is as good as a measurement — It is the solution of a model on a mesh; mesh errors and turbulence-model errors can be large, especially in separated flow. It needs validation.',
    'A residual that dropped five orders of magnitude proves the answer is accurate — It only shows the iteration converged on this mesh. The mesh error and the model error remain.',
    'CFD has made wind tunnels obsolete — Both are used side by side; tunnels validate CFD and cover what it still does poorly, such as stall, buffet and high-lift configurations.'
  ],
  formulas: [
    {
      name: 'Mesh points for direct numerical simulation',
      expr: 'N = Re^(9/4)', tex: 'N \\sim \\mathrm{Re}^{9/4}',
      vars: {
        N: { name: 'mesh points needed (order of magnitude)' },
        Re: { name: 'Reynolds number of the flow', value: 1e5, min: 1, tex: '\\mathrm{Re}' }
      },
      note: 'From the Kolmogorov scale η ≈ L Re^(−3/4) in three dimensions. The time steps grow as Re^(3/4) as well, so the cost grows roughly as Re³.',
      stories: { N: 'Roughly how many mesh points would a direct numerical simulation of a flow at Re = {Re} need?', Re: 'A computer can hold {N} mesh points. Up to what Reynolds number could it run a direct simulation?' }
    },
    {
      name: 'Height of the first cell at a wall',
      expr: 'y1 = yp*nu/(V*sqrt(cf/2))', tex: 'y_1 = \\dfrac{y^+\\,\\nu}{V_\\infty\\sqrt{c_f/2}}',
      vars: {
        y1: { name: 'first cell height', q: 'length', unit: 'µm', tex: 'y_1' },
        yp: { name: 'target y⁺ of the first cell', value: 1, min: 0.1, max: 300, tex: 'y^+' },
        nu: { name: 'kinematic viscosity', q: 'kinvisc', unit: 'm²/s', value: 1.5e-5, tex: '\\nu' },
        V: { name: 'free-stream speed', q: 'speed', unit: 'm/s', value: 70, tex: 'V_\\infty' },
        cf: { name: 'estimated skin-friction coefficient', value: 0.003, min: 1e-4, max: 0.05, tex: 'c_f' }
      },
      note: 'u_τ = V∞√(c_f/2) is the friction velocity. y⁺ ≈ 1 resolves the viscous sublayer; wall functions allow 30–100. Air at sea level: ν ≈ 1.5×10⁻⁵ m²/s.',
      stories: { y1: 'For a wing at {V} (ν = {nu}, c_f ≈ {cf}), how high should the first mesh cell be for y⁺ = {yp}?', yp: 'A mesh has its first cell {y1} from the wall of a wing at {V} (ν = {nu}, c_f ≈ {cf}). What y⁺ is that?' }
    },
    {
      name: 'CFL (Courant) number',
      expr: 'C = u*dt/dx', tex: 'C = \\dfrac{u\\,\\Delta t}{\\Delta x}',
      vars: {
        C: { name: 'Courant number' },
        u: { name: 'flow speed through the cell', q: 'speed', unit: 'm/s', value: 10 },
        dt: { name: 'time step', q: 'time', unit: 'ms', value: 0.05, tex: '\\Delta t' },
        dx: { name: 'cell size', q: 'length', unit: 'mm', value: 1, tex: '\\Delta x' }
      },
      note: 'Explicit schemes need C below about 1: information must not cross more than one cell per time step. Implicit schemes can go higher, at a cost in time accuracy.',
      stories: { C: 'Air at {u} crosses cells {dx} wide with a time step of {dt}. What is the Courant number?', dt: 'What time step gives a Courant number of {C} for air at {u} in cells {dx} wide?' }
    },
    {
      name: 'Richardson extrapolation',
      expr: 'f0 = f2 + (f2 - f1)/(r^p - 1)', tex: 'f_0 = f_2 + \\dfrac{f_2 - f_1}{r^p - 1}',
      vars: {
        f0: { name: 'estimated mesh-independent value', tex: 'f_0' },
        f2: { name: 'result on the fine mesh', value: 0.0289, tex: 'f_2' },
        f1: { name: 'result on the coarse mesh', value: 0.0296, tex: 'f_1' },
        r: { name: 'refinement ratio of the cell size', value: 2, min: 1.1, max: 4 },
        p: { name: 'order of accuracy of the scheme', value: 2, min: 0.5, max: 4 }
      },
      note: 'Valid when both meshes are fine enough that the error falls as (cell size)^p. Most aerodynamic codes are second order (p = 2).',
      stories: { f0: 'A drag coefficient comes out {f1} on a coarse mesh and {f2} on one with cells {r} times smaller. For a scheme of order {p}, what is the mesh-independent estimate?' }
    }
  ],
  examples: [
    {
      title: 'The first cell on a wing',
      q: 'A wing flies at 70 m/s at sea level ($\\nu = 1.5\\times10^{-5}\\ \\mathrm{m^2/s}$) with $c_f \\approx 0.003$. How high should the first cell be for $y^+ = 1$, and for a wall-function mesh at $y^+ = 50$?',
      steps: [
        'Friction velocity: $u_\\tau = V_\\infty\\sqrt{c_f/2} = 70\\sqrt{0.0015} = 2.71$ m/s.',
        '$y^+ = 1$: $y_1 = \\nu/u_\\tau = 1.5\\times10^{-5}/2.71 = 5.5\\times10^{-6}$ m, about 5.5 µm — a tenth of a hair\'s width.',
        '$y^+ = 50$: $y_1 = 50 \\times 5.5 = 280$ µm, about 0.3 mm.'
      ],
      a: 'About 5.5 µm to resolve the sublayer; about 0.3 mm with wall functions.'
    },
    {
      title: 'Why nobody runs a DNS of an airliner',
      q: 'An airliner wing has a 5 m chord and cruises at 250 m/s at 11 000 m, where $\\nu \\approx 3.9\\times10^{-5}\\ \\mathrm{m^2/s}$. Estimate the Reynolds number and the mesh points a DNS would need.',
      steps: [
        '$Re = Vc/\\nu = 250 \\times 5/3.9\\times10^{-5} = 3.2\\times10^7$.',
        '$N \\sim Re^{9/4} = (3.2\\times10^7)^{2.25} \\approx 8\\times10^{16}$ points.',
        'With five variables stored in double precision that is about $3\\times10^{18}$ bytes — three exabytes, for one instant of the flow. The largest DNS so far use a few times $10^{12}$ points.'
      ],
      a: 'Re ≈ 3×10⁷ and ~10¹⁷ points: out of reach, which is why engineering CFD models turbulence.'
    },
    {
      title: 'A grid-convergence study',
      q: 'A drag coefficient is 0.0296 on a coarse mesh and 0.0289 on a mesh with cells half the size. The scheme is second order. Estimate the mesh-independent value and the error on the fine mesh.',
      steps: [
        '$f_0 = f_2 + (f_2 - f_1)/(r^p - 1) = 0.0289 + (0.0289 - 0.0296)/(2^2 - 1) = 0.0289 - 0.00023 = 0.02867$.',
        'Fine-mesh error: $(0.0289 - 0.02867)/0.02867 = 0.8$ %, about 2.3 drag counts.',
        'A third, finer mesh should confirm the order: its change should be about a quarter of the last one.'
      ],
      a: 'About 0.0287; the fine mesh is still 0.8 % (2.3 counts) high.'
    }
  ],
  quiz: [
    { q: 'Which approach resolves every scale of turbulent motion, with no turbulence model?', choices: ['RANS', 'LES', 'DNS', 'a panel method'], a: 2,
      why: 'Direct numerical simulation resolves eddies down to the Kolmogorov scale. LES models the small eddies; RANS models all of them; panel methods ignore viscosity altogether.' },
    { q: 'You halve the cell size in every direction and the lift coefficient changes by 0.1 %. What does this suggest?', choices: ['the turbulence model is right', 'the mesh is fine enough for this quantity (close to mesh-independent)', 'the residuals have not converged', 'the answer matches the wind tunnel'], a: 1,
      why: 'A small change on refinement is evidence of mesh convergence (verification). It says nothing about whether the model is right — that needs validation against experiment.' },
    { q: 'Roughly how many mesh points would a DNS need at Re = 10⁶?', answer: 3.16e13, tol: 0.03,
      why: 'N ~ Re^(9/4) = 10^(13.5) ≈ 3.2×10¹³ — beyond today\'s largest simulations.' },
    { q: 'A CFD run whose residuals dropped by five orders of magnitude is guaranteed to be accurate.', a: false,
      why: 'Converged residuals mean the discrete equations are solved on this mesh. Mesh error, turbulence-model error and geometry simplifications remain.' },
    { q: 'What is y⁺ used for when making a mesh?', choices: ['to set the time step', 'to place the first cell height relative to the viscous sublayer', 'to measure the far-field distance', 'to count the cells'], a: 1,
      why: 'y⁺ = y u_τ/ν measures wall distance in viscous units; y⁺ ≈ 1 resolves the sublayer, 30–100 suits wall functions.' }
  ],
  applications: ['Designing aircraft wings, high-lift systems and engine installations.', 'Racing-car aerodynamics, where regulations now limit both CFD and tunnel time.', 'Wind loads and pedestrian comfort round buildings; ventilation and smoke movement.', 'Wind-farm layout, turbomachinery, and the flows in engines and ducts.'],
  history: 'Lewis Fry Richardson tried to forecast the weather by hand-computing the flow equations in 1922. The Los Alamos group under Francis Harlow built the first computer fluid codes in the 1950s and 1960s, Antony Jameson\'s Euler codes of the early 1980s transformed transonic wing design, and the first direct simulation of turbulent channel flow (Kim, Moin and Moser, 1987, at Re_τ = 180) opened the era of numerical experiments on turbulence.',
  sim: 'pot-grid'
},

{
  id: 'turbulence-models', parent: 'computation', title: 'Turbulence models', level: 3,
  short: 'Practical CFD cannot follow every turbulent eddy, so it solves for the average flow and models what the eddies do — usually as an extra "eddy viscosity". Mixing length, Spalart–Allmaras, k–ε and k–ω SST are the common choices; each is calibrated on simple flows and is most trustworthy close to them.',
  keywords: ['turbulence model', 'RANS', 'Reynolds stress', 'Reynolds averaging', 'closure problem', 'eddy viscosity', 'Boussinesq hypothesis', 'mixing length', 'Spalart-Allmaras', 'k-epsilon', 'k-omega', 'SST', 'wall function', 'law of the wall', 'log law', 'DES', 'Smagorinsky'],
  prereq: ['cfd', 'turbulence', 'turbulent-boundary-layer'],
  related: ['transition', 'flow-separation', 'skin-friction', 'stall', 'navier-stokes', 'reynolds-number', 'physics:viscosity'],
  body: `
Turbulent flow over a wing contains eddies from the size of the boundary layer down to a fraction of a millimetre, changing thousands of times a second. An engineer wants the average: the mean pressure, the mean skin friction, the mean lift. Reynolds showed in 1895 how to get equations for the average — and why they cannot be closed without a model.

### The closure problem
Split each velocity into a mean and a fluctuation, $u = \\bar u + u'$, and average the [[navier-stokes|Navier–Stokes equations]]. The averaged equations look like the originals with one extra term: the **Reynolds stresses** $-\\rho\\,\\overline{u'v'}$, the momentum carried across the flow by the eddies. Away from the wall in a turbulent boundary layer they are tens to hundreds of times the viscous stress. They are new unknowns, and every attempt to write equations for them produces more unknowns. A **turbulence model** is a rule that closes this chain.

### Eddy viscosity
Boussinesq's idea (1877): eddies mix momentum the way molecules do, only far more vigorously, so treat them as an extra viscosity:

$$-\\overline{u'v'} = \\nu_t \\frac{\\partial \\bar u}{\\partial y}$$

The **eddy viscosity** $\\nu_t$ is a property of the flow, not the fluid: zero at a wall, tens to thousands of times the molecular $\\nu$ away from it. Most models are recipes for $\\nu_t$:

| Model | Extra equations | Idea | Good at | Weak at |
|---|---|---|---|---|
| Mixing length (Prandtl, 1925) | 0 | $\\nu_t = \\ell^2 \\left\\vert \\partial\\bar u/\\partial y \\right\\vert$, $\\ell = \\kappa y$ near a wall | attached boundary layers, pipes | needs $\\ell$ prescribed everywhere; no memory |
| Spalart–Allmaras (1992) | 1 | transports a working viscosity $\\tilde\\nu$ | aerospace external flow, attached or mildly separated; robust | jets, free shear, decaying turbulence |
| k–ε (Launder and Spalding, 1974) | 2 | $\\nu_t = C_\\mu k^2/\\varepsilon$ from turbulent energy $k$ and its dissipation $\\varepsilon$ | free shear flows, industrial flows | adverse pressure gradients (separates too late); needs wall treatment |
| k–ω (Wilcox, 1988) | 2 | $\\nu_t = k/\\omega$, with $\\omega = \\varepsilon/(C_\\mu k)$ | near-wall flow, adverse gradients | sensitive to free-stream $\\omega$ |
| k–ω SST (Menter, 1994) | 2 | k–ω near walls, k–ε outside, with a shear-stress limiter | the aerospace default; separation onset | massive separation, transition |
| Reynolds-stress models | 7 | transport every stress | swirl, curvature, anisotropy | cost and robustness |

### What they assume — and where they fail
Eddy-viscosity models assume the eddies respond instantly and equally in all directions to the local mean shear. That fails in flows with strong **curvature or rotation** (swirling combustors, wing-tip vortices), in **secondary flows** of square ducts and wing–body junctions, and in **massive separation**, where the real flow is dominated by large unsteady eddies that no average captures. Most models are **fully turbulent**: laminar regions and [[transition]] need an added transition model. Near the [[stall]], predicted maximum lift can differ from experiment by 10 % or a couple of degrees.

### At the wall
Close to a wall every model must reproduce the **law of the wall**: $u^+ = y^+$ in the viscous sublayer ($y^+ < 5$) and the log law $u^+ = \\frac{1}{\\kappa}\\ln y^+ + B$ for $30 < y^+ < $ a few hundred, with $\\kappa \\approx 0.41$ and $B \\approx 5.0$. Low-Reynolds models integrate right down to the wall; **wall functions** jump over the sublayer by assuming the log law.

### Beyond RANS
Large-eddy simulation resolves the big eddies and models only the small, nearly universal ones — Smagorinsky's model $\\nu_t = (C_s\\Delta)^2|\\bar S|$ is the classic. Hybrids such as detached-eddy simulation (Spalart, 1997) run RANS in the attached boundary layer and LES in separated regions: the approach of choice for landing gear, buffet and bluff-body wakes.

> [!tip] Choose the model by the physics of your flow, then check it against data from a similar flow. Constants tuned on flat plates and channels are most trustworthy on flows that resemble them.
`,
  ideas: [
    'Averaging the Navier–Stokes equations leaves Reynolds stresses — new unknowns; a turbulence model closes the equations.',
    'Most models use an eddy viscosity ν_t, a property of the flow that is zero at walls and far larger than ν away from them.',
    'Mixing length, Spalart–Allmaras, k–ε, k–ω and SST differ in how they compute ν_t — from zero to two extra transport equations.',
    'Models fail where their assumptions fail: strong curvature and rotation, secondary flows, massive separation, transition.',
    'Near walls models must reproduce the law of the wall; LES and hybrid methods resolve the large eddies instead.'
  ],
  pitfalls: [
    'The turbulence model is a detail; the mesh is what matters — For separated flows, switching model can change the predicted maximum lift or separation point more than any mesh refinement.',
    'Eddy viscosity is a property of the fluid, like ordinary viscosity — It is a property of the flow: it varies from point to point, vanishes at walls and depends on the Reynolds number and geometry.',
    'A model validated on one flow will work on any flow — Models are calibrated on simple flows (channels, flat plates, jets); they are most reliable on flows that resemble those.'
  ],
  formulas: [
    {
      name: 'Eddy viscosity in the k–ε model',
      expr: 'nut = Cmu*k^2/eps', tex: '\\nu_t = C_\\mu\\,\\dfrac{k^2}{\\varepsilon}',
      vars: {
        nut: { name: 'eddy viscosity', q: 'kinvisc', unit: 'm²/s', tex: '\\nu_t' },
        Cmu: { name: 'model constant', value: 0.09, fixed: true, tex: 'C_\\mu' },
        k: { name: 'turbulent kinetic energy per unit mass', q: 'specificenergy', unit: 'J/kg', value: 1.5 },
        eps: { name: 'dissipation rate of k', q: false, unit: 'm²/s³', value: 10, tex: '\\varepsilon' }
      },
      note: 'Standard k–ε (Launder and Spalding). J/kg = m²/s². In the k–ω family, ν_t = k/ω with ω = ε/(C_μ k).',
      stories: { nut: 'In a k–ε calculation a cell has k = {k} and ε = {eps}. What is its eddy viscosity?', eps: 'What dissipation rate gives an eddy viscosity of {nut} where k = {k}?' }
    },
    {
      name: 'Turbulent kinetic energy from turbulence intensity',
      expr: 'k = 1.5*(I*U)^2', tex: 'k = \\tfrac32\\,(I\\,U)^2',
      vars: {
        k: { name: 'turbulent kinetic energy per unit mass', q: 'specificenergy', unit: 'J/kg' },
        I: { name: 'turbulence intensity', q: 'ratio', unit: '%', value: 5, min: 0.01, max: 50 },
        U: { name: 'mean speed', q: 'speed', unit: 'm/s', value: 20 }
      },
      note: 'Assuming isotropic fluctuations u′ = v′ = w′ = IU. Used to set inflow conditions in CFD: about 0.1 % in a quiet wind tunnel, 1–5 % in industrial ducts, 10–20 % in the wind near the ground.',
      stories: { k: 'The inflow of a CFD run is {U} with a turbulence intensity of {I}. What turbulent kinetic energy should be specified?', I: 'An inflow at {U} has k = {k}. What is its turbulence intensity?' }
    },
    {
      name: 'The log law of the wall',
      expr: 'up = ln(yp)/kappa + B', tex: 'u^+ = \\dfrac{1}{\\kappa}\\ln y^+ + B',
      vars: {
        up: { name: 'mean speed in wall units u/u_τ', tex: 'u^+' },
        yp: { name: 'distance from the wall in wall units y u_τ/ν', value: 100, min: 1, tex: 'y^+' },
        kappa: { name: 'von Kármán constant', value: 0.41, fixed: true, tex: '\\kappa' },
        B: { name: 'log-law constant (smooth wall)', value: 5.0, min: -5, max: 10, signed: true }
      },
      note: 'Holds for about 30 < y⁺ < a few hundred in attached boundary layers; wall functions impose it. Roughness lowers B.',
      stories: { up: 'What mean speed, in wall units, does the log law give at y⁺ = {yp}?', yp: 'At what y⁺ does the log law give u⁺ = {up}?' }
    }
  ],
  examples: [
    {
      title: 'Inflow turbulence for a CFD run',
      q: 'A tunnel run at 20 m/s has 1 % turbulence intensity and a turbulent length scale of 1 cm. Find $k$, $\\varepsilon$ (using $\\varepsilon = C_\\mu^{3/4}k^{3/2}/\\ell$), $\\nu_t$ and $\\omega$ for the inflow.',
      steps: [
        '$k = 1.5\\,(0.01 \\times 20)^2 = 0.060\\ \\mathrm{m^2/s^2}$.',
        '$\\varepsilon = 0.09^{0.75} \\times 0.060^{1.5}/0.01 = 0.164 \\times 0.0147/0.01 = 0.24\\ \\mathrm{m^2/s^3}$.',
        '$\\nu_t = 0.09 \\times 0.060^2/0.24 = 1.3\\times10^{-3}\\ \\mathrm{m^2/s}$ — about 90 times the molecular $\\nu = 1.5\\times10^{-5}$.',
        '$\\omega = \\varepsilon/(C_\\mu k) = 0.24/(0.09 \\times 0.060) = 45\\ \\mathrm{s^{-1}}$; check $k/\\omega = 1.3\\times10^{-3}\\ \\mathrm{m^2/s}$.'
      ],
      a: 'k = 0.06 m²/s², ε ≈ 0.24 m²/s³, ν_t ≈ 1.3×10⁻³ m²/s (≈ 90 ν), ω ≈ 45 s⁻¹.'
    },
    {
      title: 'Checking the log law',
      q: 'In a boundary layer with friction velocity $u_\\tau = 1$ m/s in air ($\\nu = 1.5\\times10^{-5}\\ \\mathrm{m^2/s}$), how far from the wall is $y^+ = 100$, and what mean speed does the log law predict there?',
      steps: [
        '$y = y^+\\nu/u_\\tau = 100 \\times 1.5\\times10^{-5}/1 = 1.5$ mm.',
        '$u^+ = \\ln(100)/0.41 + 5.0 = 4.605/0.41 + 5.0 = 16.2$, so $u = 16.2\\,u_\\tau = 16.2$ m/s.'
      ],
      a: '1.5 mm from the wall, 16.2 m/s.'
    }
  ],
  quiz: [
    { q: 'Where does the "closure problem" of turbulence come from?', choices: ['numerical round-off', 'averaging the Navier–Stokes equations creates Reynolds stresses — new unknowns with no equations of their own', 'the no-slip condition', 'compressibility'], a: 1,
      why: 'The averaged equations contain correlations of fluctuations. Equations for those contain higher correlations, and so on; a model must break the chain.' },
    { q: 'Eddy viscosity is a property of…', choices: ['the fluid, like its density', 'the flow — it changes from place to place and vanishes at walls', 'the mesh', 'the solver'], a: 1,
      why: 'ν_t describes how vigorously the local eddies mix momentum. It is zero at a wall and can be thousands of times ν in a free shear layer.' },
    { q: 'Which RANS model is the usual default for external aerodynamics with adverse pressure gradients and separation onset?', choices: ['standard k–ε', 'k–ω SST', 'a laminar calculation', 'the mixing length'], a: 1,
      why: 'Menter\'s SST blends k–ω near walls with k–ε outside and limits the shear stress, which delays the over-prediction of attached flow in adverse gradients that plagues standard k–ε.' },
    { q: 'A RANS model predicts the instant each vortex is shed from a cylinder.', a: false,
      why: 'RANS solves for the time-averaged flow (unsteady RANS resolves only the slowest, largest oscillations). Individual eddies need LES or DNS.' },
    { q: 'In a k–ε calculation a cell has k = 2 m²/s² and ε = 15 m²/s³. What is its eddy viscosity (C_μ = 0.09)?', answer: 0.024, unit: 'm²/s', tol: 0.02,
      why: 'ν_t = C_μ k²/ε = 0.09 × 4/15 = 0.024 m²/s — some 1600 times the molecular viscosity of air.' }
  ],
  applications: ['Choosing a RANS model for a wing (SA or SST), a duct or combustor (k–ε or Reynolds-stress), a separated wake (hybrid RANS–LES).', 'Setting inflow turbulence (k, ε or ω) from measured intensity and length scale.', 'Designing near-wall meshes to match the model\'s wall treatment.', 'Judging how far to trust predicted separation, stall and maximum lift.'],
  history: 'Joseph Boussinesq proposed the eddy viscosity in 1877 and Osborne Reynolds the averaged equations in 1895. Prandtl\'s mixing length (1925) made the first practical model; Kolmogorov proposed a two-equation model with a frequency ω in 1942. The k–ε model of Launder and Spalding (1974), Wilcox\'s k–ω (1988), the Spalart–Allmaras model (1992) and Menter\'s SST (1994) remain the everyday tools of CFD.',
  sim: 'pot-wall'
}

);
