/* HYPER-HYDRAULICS · content/pipes.js — the Pipe Flow branch.
 *   pipe-friction: darcy-weisbach, laminar-pipe-flow, friction-factor, colebrook, hazen-williams, roughness-ageing
 *   pipe-systems:  minor-losses, equivalent-length, pipes-series-parallel, pipe-networks, pipe-sizing,
 *                  non-circular-ducts, siphons
 * Simulations in sims/pipes.js (ids pipe-*). Water at 20 °C: ρ = 998 kg/m³, ν = 1.004 mm²/s. */
Hyper.add(

/* ================================================================ FRICTION IN PIPES */
{
  id: 'darcy-weisbach', parent: 'pipe-friction', title: 'The Darcy–Weisbach equation', level: 2,
  short: 'The head a liquid loses to wall friction along a straight pipe: a friction factor, times the length counted in diameters, times the velocity head. It holds for any liquid, any pipe and any flow regime — all the physics hides in the friction factor.',
  keywords: ['Darcy–Weisbach', 'Darcy-Weisbach', 'head loss', 'major loss', 'friction loss', 'pressure drop', 'friction factor', 'velocity head', 'pipe friction', 'wall shear stress', 'friction slope', 'D^5'],
  prereq: ['energy-equation', 'reynolds-number-pipes', 'flow-rate', 'physics:viscosity'],
  related: ['friction-factor', 'colebrook', 'laminar-pipe-flow', 'minor-losses', 'hgl-egl', 'hazen-williams', 'system-curve', 'line-sizing', 'pipe-sizing', 'aerodynamics:skin-friction'],
  body: `
Pump water along a pipe and a gauge at the far end reads less than one at the start. The water has not slowed down — in a pipe of constant bore [[continuity-equation|continuity]] keeps its mean velocity the same all the way — and it has not climbed. The pressure has been spent against friction: the liquid touching the wall is held still, the layers inside slide past it, and the shear between them turns a little mechanical energy into heat in every metre. Hydraulic engineers keep this account in metres of liquid, as a **head loss** $h_f$.

### The equation
Henry Darcy's measurements on water pipes and Julius Weisbach's reasoning gave the form used everywhere today:

$$h_f = f\\,\\frac{L}{D}\\,\\frac{V^2}{2g} \\qquad\\text{or}\\qquad \\Delta p = \\rho g\\,h_f = f\\,\\frac{L}{D}\\,\\frac{\\rho V^2}{2}$$

Read it factor by factor:
- $V^2/2g$ is the **velocity head**, the kinetic energy carried by each newton of liquid. Friction losses scale with it, as drag does on anything moving through a fluid.
- $L/D$ is the length of the pipe counted in diameters: 100 m of 100 mm pipe is 1000 diameters.
- $f$ is the dimensionless **Darcy friction factor**, about 0.01–0.05 in turbulent flow. It depends only on the [[reynolds-number-pipes|Reynolds number]] and the relative roughness $\\varepsilon/D$ (see [[friction-factor]]).

A picture worth keeping: with $f = 0.02$, every fifty diameters of pipe cost one velocity head.

### Written with the flow rate
Designers usually know the flow $Q$, not the velocity. With $V = 4Q/\\pi D^2$,

$$h_f = \\frac{8 f L Q^2}{\\pi^2 g\\,D^5}$$

That fifth power is the most important fact in pipe design. At the same flow, a pipe one size smaller (80 mm instead of 100 mm) loses three times the head, and a pipe of half the bore loses 32 times as much. Doubling the flow nearly quadruples the loss — a little less, because $f$ falls slowly as the Reynolds number rises.

| 10 L/s of water at 20 °C, commercial steel | 80 mm | 100 mm | 125 mm | 150 mm |
|---|---|---|---|---|
| Mean velocity (m/s) | 1.99 | 1.27 | 0.81 | 0.57 |
| Friction factor $f$ | 0.0195 | 0.0195 | 0.0197 | 0.0200 |
| Head loss per 100 m (m) | 4.93 | 1.61 | 0.53 | 0.22 |

### Where it comes from
Balance the forces on a plug of liquid of length $L$: the pressure difference on its ends pushes it with $\\Delta p\\,\\pi D^2/4$; the wall holds it back with the shear stress $\\tau_w$ acting on $\\pi D L$. So $\\Delta p = 4\\tau_w L/D$. [[aerodynamics:dimensional-analysis|Dimensional analysis]] says the wall stress must scale with $\\rho V^2$; writing $\\tau_w = f\\rho V^2/8$ gives Darcy–Weisbach. The equation is therefore exact by construction — everything about the wall and the flow is packed into $f$. (Chemical engineers use the Fanning factor, a quarter of Darcy's; always check which one a chart or a program means.)

### In the energy equation
In the [[energy-equation]] $h_f$ is the term that makes the energy line slope downwards: the [[hgl-egl|grade lines]] fall by $h_f$ along each pipe, a slope $S_f = h_f/L$ called the friction slope. A pump must supply it on top of the static lift ([[pump-head-power]]); their sum, as a function of flow, is the [[system-curve]].

> [!key] Head loss grows with the length, with the square of the velocity and with $1/D$ — and, at a given flow, with $1/D^5$. The friction factor carries everything else.

### Where it applies
Darcy–Weisbach holds for any Newtonian liquid, in laminar or turbulent flow, and for gases as long as the pressure falls by less than about a tenth. It covers the distributed friction of straight pipe only; bends, valves and fittings add [[minor-losses]], and ducts that are not round use a [[non-circular-ducts|hydraulic diameter]]. The same line of algebra sizes a town's water main, the hoses of an excavator ([[line-sizing]]) and the cooling channels of an engine.
`,
  ideas: [
    'Head loss = f × (L/D) × V²/2g: friction costs a number of velocity heads proportional to the length in diameters.',
    'At a given flow the loss goes as 1/D⁵: one pipe size smaller roughly triples it.',
    'The friction factor depends only on the Reynolds number and the relative roughness ε/D.',
    'The equation is exact by definition; all the uncertainty sits in f.',
    'Pressure drop = ρ g h_f; in the energy equation h_f is what makes the grade lines slope down.'
  ],
  pitfalls: [
    'The pressure falls along a pipe because the water speeds up — In a pipe of constant bore the mean velocity is constant (continuity). The pressure energy is turned into heat by friction, not into kinetic energy.',
    'Doubling the diameter halves the head loss — At the same flow the velocity falls fourfold and the loss by about 2⁵ = 32.',
    'The friction factor is a constant of the pipe material — It depends on the Reynolds number as well as on ε/D; only in the fully rough zone does it stop changing with flow.'
  ],
  formulas: [
    {
      name: 'Darcy–Weisbach head loss',
      expr: 'hf = f*(L/D)*V^2/(2*g)', tex: 'h_f = f\\,\\dfrac{L}{D}\\,\\dfrac{V^2}{2g}',
      vars: {
        hf: { name: 'friction head loss', q: 'length', unit: 'm', tex: 'h_f' },
        f: { name: 'Darcy friction factor', value: 0.02 },
        L: { name: 'pipe length', q: 'length', unit: 'm', value: 100 },
        D: { name: 'inside diameter', q: 'length', unit: 'mm', value: 100 },
        V: { name: 'mean velocity', q: 'speed', unit: 'm/s', value: 1.5 },
        g: { const: 'g' }
      },
      note: 'Straight pipe of constant bore; add minor losses for fittings. Valid for laminar and turbulent flow with the right f.',
      practice: { unknowns: ['hf', 'V', 'f'] },
      stories: {
        hf: 'Water flows at {V} through {L} of pipe with an inside diameter of {D}; the friction factor is {f}. What head is lost to friction?',
        V: 'A pipe {L} long with a bore of {D} and a friction factor of {f} may lose at most {hf} of head. What is the highest mean velocity allowed?',
        f: 'A test on {L} of pipe of {D} bore, with water at {V}, measures a head loss of {hf}. What is the friction factor?'
      }
    },
    {
      name: 'Pressure drop',
      expr: 'dp = f*(L/D)*rho*V^2/2', tex: '\\Delta p = f\\,\\dfrac{L}{D}\\,\\dfrac{\\rho V^2}{2}',
      vars: {
        dp: { name: 'pressure drop', q: 'pressure', unit: 'kPa', tex: '\\Delta p' },
        f: { name: 'Darcy friction factor', value: 0.02 },
        L: { name: 'pipe length', q: 'length', unit: 'm', value: 100 },
        D: { name: 'inside diameter', q: 'length', unit: 'mm', value: 100 },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 998 },
        V: { name: 'mean velocity', q: 'speed', unit: 'm/s', value: 1.5 }
      },
      note: 'A pressure difference: the same whether both ends are read as gauge or as absolute pressure.',
      stories: { dp: 'Water ({rho}) flows at {V} through {L} of {D} pipe with f = {f}. What is the pressure drop?' }
    },
    {
      name: 'Head loss from the flow rate',
      expr: 'hf = 8*f*L*Q^2/(pi^2*g*D^5)', tex: 'h_f = \\dfrac{8 f L Q^2}{\\pi^2 g D^5}',
      vars: {
        hf: { name: 'friction head loss', q: 'length', unit: 'm', tex: 'h_f' },
        f: { name: 'Darcy friction factor', value: 0.02 },
        L: { name: 'pipe length', q: 'length', unit: 'm', value: 200 },
        Q: { name: 'flow rate', q: 'flowrate', unit: 'm³/h', value: 54 },
        D: { name: 'inside diameter', q: 'length', unit: 'mm', value: 150 },
        g: { const: 'g' }
      },
      note: 'The same equation with V = 4Q/πD². At a fixed flow, h_f ∝ 1/D⁵.',
      practice: { unknowns: ['hf', 'Q', 'D'] },
      stories: {
        hf: 'A pipe {L} long with a bore of {D} carries {Q}; f = {f}. What is the head loss?',
        D: 'A pipeline {L} long must carry {Q} with no more than {hf} of friction loss (f = {f}). What bore does it need?',
        Q: 'A pipe {L} long with a bore of {D} (f = {f}) has {hf} of head available for friction. What flow will it carry?'
      }
    },
    {
      name: 'Wall shear stress',
      expr: 'tau = f*rho*V^2/8', tex: '\\tau_w = \\dfrac{f \\rho V^2}{8}',
      vars: {
        tau: { name: 'wall shear stress', q: 'pressure', unit: 'Pa', tex: '\\tau_w' },
        f: { name: 'Darcy friction factor', value: 0.02 },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 998 },
        V: { name: 'mean velocity', q: 'speed', unit: 'm/s', value: 1.5 }
      },
      note: 'The definition that turns a force balance (Δp = 4τ_w L/D) into Darcy–Weisbach. A few pascals in water mains: enough to scour loose deposits, which is why low-velocity mains silt up.',
      stories: { tau: 'Water ({rho}) flows at {V} in a pipe with f = {f}. What shear stress does it exert on the wall?' }
    }
  ],
  examples: [
    {
      title: 'A water main',
      q: 'A 300 m commercial-steel main of 150 mm bore carries 25 L/s of water at 20 °C ($\\nu = 1.004\\times10^{-6}$ m²/s, $\\varepsilon = 0.045$ mm). What are the head loss and the pressure drop?',
      steps: [
        'Area $A = \\pi \\times 0.15^2/4 = 0.01767$ m², so $V = 0.025/0.01767 = 1.415$ m/s.',
        '$Re = VD/\\nu = 1.415 \\times 0.15/1.004\\times10^{-6} = 2.11\\times10^5$: turbulent.',
        '$\\varepsilon/D = 0.045/150 = 3.0\\times10^{-4}$; the Colebrook equation (or the Moody chart) gives $f = 0.0176$.',
        'Velocity head $V^2/2g = 1.415^2/19.61 = 0.102$ m.',
        { text: 'Head loss:', tex: 'h_f = 0.0176 \\times \\frac{300}{0.15} \\times 0.102 = 3.59\\ \\text{m}' },
        'Pressure drop $\\Delta p = \\rho g h_f = 998 \\times 9.81 \\times 3.59 = 35.2$ kPa, about 0.35 bar.'
      ],
      a: 'About 3.6 m of head, or 35 kPa.'
    },
    {
      title: 'One size smaller',
      q: 'The same 25 L/s is sent through 300 m of 125 mm steel pipe instead. How much more head is lost?',
      steps: [
        '$A = 0.01227$ m², $V = 2.04$ m/s, $Re = 2.54\\times10^5$, $\\varepsilon/D = 3.6\\times10^{-4}$, so $f = 0.0176$ — almost unchanged.',
        '$V^2/2g = 0.212$ m, and $h_f = 0.0176 \\times (300/0.125) \\times 0.212 = 8.96$ m.',
        'Ratio $8.96/3.59 = 2.49$. The fifth-power rule predicts $(150/125)^5 = 2.49$: because $f$ barely moved, it holds almost exactly.'
      ],
      a: 'About 9.0 m instead of 3.6 m — two and a half times as much for a pipe only 17 % narrower.'
    }
  ],
  quiz: [
    { q: 'At the same flow rate, a pipe is replaced by one of half the diameter. If the friction factor did not change, the head loss would become…', choices: ['2 times larger', '4 times larger', '16 times larger', '32 times larger'], a: 3,
      why: 'Half the diameter gives a quarter of the area, so four times the velocity and 16 times the velocity head; L/D doubles as well. In total 2⁵ = 32.' },
    { q: 'The pressure in a long horizontal pipe of constant bore falls steadily along it. So the water must be speeding up along the pipe.', a: false,
      why: 'Continuity fixes the mean velocity in a constant bore. The lost pressure is energy turned into heat by friction.' },
    { q: 'Water flows at 2 m/s through 50 m of 50 mm pipe with f = 0.025. What is the head loss?', answer: 5.10, unit: 'm', tol: 0.02,
      why: 'h_f = 0.025 × (50/0.05) × 2²/(2 × 9.81) = 0.025 × 1000 × 0.204 = 5.10 m.' },
    { q: 'Doubling the length of a pipeline, at the same flow, …', choices: ['doubles the friction head loss', 'quadruples it', 'leaves it unchanged, because the velocity is the same', 'halves the friction factor'], a: 0,
      why: 'h_f is proportional to L; velocity and friction factor are unchanged.' },
    { q: 'In the Darcy–Weisbach equation, where does the roughness of the wall enter?', choices: ['in L/D', 'in the velocity head', 'in the friction factor f', 'in g'], a: 2,
      why: 'f depends on the Reynolds number and on the relative roughness ε/D; the rest of the equation is geometry and kinematics.' }
  ],
  problems: [
    { q: 'A 2 km pipeline of 300 mm bore carries water at 1.2 m/s with f = 0.018. What is the friction head loss?', answer: 8.81, unit: 'm', tol: 0.02,
      steps: ['$L/D = 2000/0.3 = 6667$; $V^2/2g = 1.44/19.61 = 0.0734$ m.', '$h_f = 0.018 \\times 6667 \\times 0.0734 = 8.81$ m.'] },
    { q: 'For the same pipeline, what pressure drop does that head loss represent, with ρ = 998 kg/m³?', answer: 86.2, unit: 'kPa', tol: 0.02,
      steps: ['$\\Delta p = \\rho g h_f = 998 \\times 9.807 \\times 8.81 = 86.2$ kPa (0.86 bar).'] }
  ],
  applications: [
    'Sizing water mains, irrigation lines and district-heating pipes, and computing the head a pump must supply.',
    'Pressure drops in the hoses and tubes of hydraulic machines, where every bar lost becomes heat.',
    'Oil and product pipelines, cooling-water circuits and fire-fighting mains.',
    'The friction part of every system curve that a pump is chosen against.'
  ],
  history: 'Julius Weisbach, a Saxon professor of mechanics, wrote the loss in terms of the velocity head in 1845. Henry Darcy, the engineer who gave Dijon its water supply, published careful experiments on pipes of many materials in 1857 and showed that the loss depends on the wall. For almost a century the friction factor stayed a table of measured values, until Nikuradse, Colebrook and Moody made it predictable.',
  sim: 'pipe-designer'
},

{
  id: 'laminar-pipe-flow', parent: 'pipe-friction', title: 'Laminar flow: Hagen–Poiseuille', level: 2,
  short: 'At low Reynolds numbers liquid slides through a pipe in smooth concentric layers with a parabolic velocity profile. The pressure drop is then exactly 128 μLQ/(πD⁴): proportional to viscosity and flow, independent of roughness, and f = 64/Re.',
  keywords: ['laminar flow', 'Hagen–Poiseuille', 'Poiseuille', 'parabolic profile', 'f = 64/Re', 'viscous flow', 'oil line', 'capillary', 'entrance length', 'fourth power'],
  prereq: ['viscosity', 'laminar-turbulent', 'darcy-weisbach'],
  related: ['reynolds-number-pipes', 'friction-factor', 'hydraulic-oils', 'viscosity-temperature', 'line-sizing', 'non-circular-ducts', 'physics:viscosity', 'aerodynamics:no-slip', 'aerodynamics:navier-stokes'],
  body: `
At low Reynolds numbers a liquid moves through a pipe in orderly layers — picture a telescope of very thin concentric tubes, each sliding a little faster than the one outside it. The layer on the wall is at rest (the [[aerodynamics:no-slip|no-slip condition]]), the centre moves fastest, and no eddies mix the layers. This **laminar** flow is the one case of pipe friction that can be solved exactly from first principles.

### The parabolic profile
A force balance on a cylinder of liquid of radius $r$ shows that the shear stress grows linearly from zero on the axis to its maximum at the wall. With Newton's law of [[viscosity]], $\\tau = \\mu\\,du/dr$, integrating gives a parabola:

$$u(r) = u_{max}\\left(1 - \\frac{r^2}{R^2}\\right), \\qquad u_{max} = 2V$$

The centre line moves at exactly twice the mean velocity.

### Hagen–Poiseuille
Adding up the flow through each thin ring gives the flow rate, and so the pressure drop:

$$\\Delta p = \\frac{128\\,\\mu L Q}{\\pi D^4} = \\frac{32\\,\\mu L V}{D^2}$$

Three things stand out. The drop is **proportional to the flow**, not to its square: a laminar line behaves like an electrical resistor. It is proportional to the **viscosity**, so it follows the temperature of the liquid. And it depends on the **fourth power** of the diameter. Roughness does not appear at all: the slow layers near the wall simply creep over small bumps.

Written in the Darcy–Weisbach form, the same result reads

$$f = \\frac{64}{Re}$$

— the straight line at the left of the Moody chart ([[friction-factor]]).

### Where flow is laminar
Below $Re = VD/\\nu \\approx 2300$ disturbances die out and the flow stays laminar. Water is seldom laminar in engineering pipes, but viscous liquids often are:

| Case | $\\nu$ (mm²/s) | Bore | Velocity | $Re$ |
|---|---|---|---|---|
| Water, 20 °C | 1.0 | 16 mm | 3 m/s | 47 800 — turbulent |
| Hydraulic oil ISO VG 46, 40 °C | 46 | 16 mm | 3 m/s | 1040 — laminar |
| The same oil at 0 °C | ≈ 570 | 16 mm | 3 m/s | 84 — deeply laminar |
| Blood in a capillary | ≈ 3.3 | 8 µm | 1 mm/s | 0.002 |

So in [[hydraulic-oils|oil hydraulics]] many lines run laminar, and their pressure drop follows the oil temperature: a hose that loses half a bar with warm oil can lose ten on a frosty morning ([[viscosity-temperature]]). That is why machines are warmed up before hard work, and why return filters and coolers are checked for their cold-start pressure drop.

### Entrance length and limits
The parabola takes a while to form. Downstream of an entrance the profile develops over roughly $L_e \\approx 0.06\\,Re\\,D$ — up to about 140 diameters at $Re = 2300$ — and the pressure drop there is higher than Hagen–Poiseuille predicts. Above $Re \\approx 2300$ small disturbances grow, and somewhere below about 4000 the flow turns turbulent ([[laminar-turbulent]]); with an exceptionally calm inlet, laboratory pipes have stayed laminar far beyond that. The law also assumes a Newtonian liquid, a straight round pipe and steady flow ([[non-newtonian]] liquids such as paints and slurries follow other laws).

> [!key] Laminar: pressure drop ∝ μ·L·Q/D⁴, f = 64/Re, roughness irrelevant, centre velocity twice the mean.
`,
  ideas: [
    'Laminar pipe flow has a parabolic velocity profile, with the centre moving at twice the mean velocity.',
    'Hagen–Poiseuille: Δp = 128 μ L Q/(π D⁴) — proportional to flow and viscosity, inversely to D⁴.',
    'In Darcy–Weisbach form f = 64/Re, whatever the roughness of the wall.',
    'Hydraulic oil lines are often laminar, so their losses rise steeply when the oil is cold.'
  ],
  pitfalls: [
    'A rougher pipe always has more friction — In fully developed laminar flow the roughness has no effect; f = 64/Re for any wall with small bumps.',
    'Pressure drop always grows with the square of the flow — That is turbulent behaviour. In laminar flow it is simply proportional to the flow.',
    'f = 64/Re can be used for any Reynolds number — Only below about 2300. Above it the flow becomes turbulent and f is several times larger than the laminar formula would suggest.'
  ],
  formulas: [
    {
      name: 'Hagen–Poiseuille pressure drop',
      expr: 'dp = 128*mu*L*Q/(pi*D^4)', tex: '\\Delta p = \\dfrac{128\\,\\mu L Q}{\\pi D^4}',
      vars: {
        dp: { name: 'pressure drop', q: 'pressure', unit: 'bar', tex: '\\Delta p' },
        mu: { name: 'dynamic viscosity', q: 'viscosity', unit: 'mPa·s', value: 40 },
        L: { name: 'line length', q: 'length', unit: 'm', value: 5 },
        Q: { name: 'flow rate', q: 'flowrate', unit: 'L/min', value: 20 },
        D: { name: 'inside diameter', q: 'length', unit: 'mm', value: 12 }
      },
      note: 'Fully developed laminar flow, Re below about 2300. μ = ρν: ISO VG 46 oil (ν = 46 mm²/s at 40 °C, ρ ≈ 870 kg/m³) has μ ≈ 40 mPa·s.',
      practice: { unknowns: ['dp', 'Q', 'D', 'mu'] },
      stories: {
        dp: 'Oil with a viscosity of {mu} flows at {Q} through {L} of tube with a bore of {D}. What is the pressure drop?',
        Q: 'A {L} capillary of {D} bore has {dp} across it; the oil has a viscosity of {mu}. What flow passes?',
        D: 'An oil line {L} long must carry {Q} of oil ({mu}) with no more than {dp} of loss. What bore does it need?',
        mu: 'A viscometer tube {L} long and {D} in bore passes {Q} under a pressure difference of {dp}. What is the viscosity?'
      }
    },
    {
      name: 'Laminar friction factor',
      expr: 'f = 64/Re', tex: 'f = \\dfrac{64}{\\mathrm{Re}}',
      vars: {
        f: { name: 'Darcy friction factor' },
        Re: { name: 'Reynolds number', value: 800, tex: '\\mathrm{Re}' }
      },
      note: 'Re below about 2300 only.',
      stories: { f: 'Oil flows in a pipe at a Reynolds number of {Re}. What is the Darcy friction factor?' }
    },
    {
      name: 'Laminar velocity profile',
      expr: 'u = 2*V*(1 - (r/R)^2)', tex: 'u = 2V\\left(1 - \\dfrac{r^2}{R^2}\\right)',
      vars: {
        u: { name: 'local velocity', q: 'speed', unit: 'm/s' },
        V: { name: 'mean velocity', q: 'speed', unit: 'm/s', value: 1 },
        r: { name: 'distance from the axis', q: 'length', unit: 'mm', value: 5 },
        R: { name: 'pipe radius', q: 'length', unit: 'mm', value: 10 }
      },
      note: 'u = 2V on the axis (r = 0) and zero at the wall (r = R).',
      stories: { u: 'Laminar flow with a mean velocity of {V} fills a pipe of radius {R}. How fast does the liquid move {r} from the axis?' }
    }
  ],
  examples: [
    {
      title: 'A pressure hose on a cold morning',
      q: 'A pump sends 40 L/min of ISO VG 46 oil ($\\rho = 870$ kg/m³) through a 5 m hose of 16 mm bore. The oil is at 50 °C ($\\nu = 30$ mm²/s). What is the pressure drop — and what is it at 0 °C, when $\\nu \\approx 570$ mm²/s?',
      steps: [
        '$Q = 40/60\\,000 = 6.67\\times10^{-4}$ m³/s; $A = \\pi \\times 0.016^2/4 = 2.01\\times10^{-4}$ m², so $V = 3.32$ m/s.',
        '$Re = VD/\\nu = 3.32 \\times 0.016/30\\times10^{-6} = 1770$: laminar.',
        '$\\mu = \\rho\\nu = 870 \\times 30\\times10^{-6} = 0.0261$ Pa·s.',
        { text: 'Hagen–Poiseuille:', tex: '\\Delta p = \\frac{128 \\times 0.0261 \\times 5 \\times 6.67\\times10^{-4}}{\\pi \\times 0.016^4} = 5.41\\times10^4\\ \\text{Pa} = 0.54\\ \\text{bar}' },
        'At 0 °C the viscosity is 19 times higher and the flow is still laminar ($Re = 93$), so the drop is 19 times higher: about 10.3 bar.'
      ],
      a: '0.54 bar with warm oil; about 10 bar with cold oil.'
    },
    {
      title: 'A lubrication capillary',
      q: 'Oil with $\\mu = 0.1$ Pa·s ($\\rho = 870$ kg/m³) is fed to a bearing through 1 m of 2 mm bore tube with a pressure difference of 5 bar. What is the flow, and is it laminar?',
      steps: [
        { text: 'Rearrange Hagen–Poiseuille for the flow:', tex: 'Q = \\frac{\\pi D^4 \\Delta p}{128\\,\\mu L} = \\frac{\\pi \\times (0.002)^4 \\times 5\\times10^5}{128 \\times 0.1 \\times 1} = 1.96\\times10^{-6}\\ \\text{m}^3/\\text{s}' },
        'That is 118 cm³/min. $V = Q/A = 1.96\\times10^{-6}/3.14\\times10^{-6} = 0.625$ m/s.',
        '$Re = \\rho V D/\\mu = 870 \\times 0.625 \\times 0.002/0.1 = 10.9$ — thoroughly laminar, so the formula applies.'
      ],
      a: 'About 118 cm³/min, at Re ≈ 11.'
    }
  ],
  quiz: [
    { q: 'In fully developed laminar pipe flow, the velocity on the axis is … the mean velocity.', choices: ['equal to', 'about 1.2 times', 'twice', 'four times'], a: 2,
      why: 'The profile is a parabola; averaging it over the circular area gives exactly half its peak value. (In turbulent flow the peak is only about 1.2 times the mean.)' },
    { q: 'Laminar oil flow in a line is doubled, with the same oil and temperature. The pressure drop…', choices: ['doubles', 'quadruples', 'stays the same', 'halves'], a: 0,
      why: 'Hagen–Poiseuille: Δp ∝ Q. The square law belongs to turbulent flow.' },
    { q: 'Making the inside wall of a pipe rougher raises the pressure drop in fully developed laminar flow.', a: false,
      why: 'f = 64/Re regardless of roughness, as long as the bumps are small compared with the bore: the slow layers near the wall creep over them.' },
    { q: 'What is the Darcy friction factor at Re = 1600?', answer: 0.04, tol: 0.01,
      why: 'Laminar: f = 64/1600 = 0.04.' },
    { q: 'The same laminar flow is pushed through a line of half the bore. By what factor does the pressure drop rise?', answer: 16, tol: 0.01,
      why: 'Δp ∝ 1/D⁴, and 2⁴ = 16 (the flow stays laminar, since Re doubles only).' }
  ],
  problems: [
    { q: 'Oil with μ = 30 mPa·s (ρ = 870 kg/m³) flows at 12 L/min through 2 m of 10 mm bore tube. What is the pressure drop in bar? (Check that the flow is laminar.)', answer: 0.489, unit: 'bar', tol: 0.02,
      steps: ['$Q = 2\\times10^{-4}$ m³/s; $V = 2.55$ m/s; $Re = 870 \\times 2.55 \\times 0.01/0.03 = 740$: laminar.', '$\\Delta p = 128 \\times 0.03 \\times 2 \\times 2\\times10^{-4}/(\\pi \\times 10^{-8}) = 4.89\\times10^4$ Pa = 0.49 bar.'] }
  ],
  applications: [
    'Oil-hydraulic lines, especially suction and pilot lines and anything running cold.',
    'Lubrication systems, capillary restrictors in hydrostatic bearings and fixed-orifice dampers.',
    'Capillary viscometers, which measure viscosity from Hagen–Poiseuille.',
    'Blood flow in the smallest vessels, drip irrigation emitters and microfluidic chips.'
  ],
  history: 'Gotthilf Hagen, a Prussian hydraulic engineer, measured water flowing through narrow brass tubes and published the fourth-power law in 1839. Jean Léonard Marie Poiseuille, a French physician interested in blood in capillaries, found the same law with glass tubes in the early 1840s. The poise, the old unit of viscosity (0.1 Pa·s), is named after him.',
  sim: 'pipe-profile'
},

{
  id: 'friction-factor', parent: 'pipe-friction', title: 'The friction factor and the Moody chart', level: 2,
  short: 'The Darcy friction factor depends on just two numbers, the Reynolds number and the relative roughness ε/D. The Moody chart shows it: 64/Re in laminar flow, a critical zone, then turbulent curves that start near the smooth-pipe line and flatten out when the pipe becomes fully rough.',
  keywords: ['friction factor', 'Moody chart', 'Moody diagram', 'relative roughness', 'roughness', 'smooth pipe', 'fully rough', 'transition', 'Blasius', 'Nikuradse', 'Fanning', 'viscous sublayer', 'epsilon'],
  prereq: ['darcy-weisbach', 'reynolds-number-pipes', 'laminar-pipe-flow'],
  related: ['colebrook', 'roughness-ageing', 'laminar-turbulent', 'hazen-williams', 'aerodynamics:turbulent-boundary-layer', 'aerodynamics:dimensional-analysis', 'aerodynamics:skin-friction'],
  body: `
The friction factor is where the physics of pipe friction lives. [[darcy-weisbach|Darcy–Weisbach]] turns it into a pressure drop; the hard part is knowing its value. Dimensional analysis says it can depend on only two numbers: the [[reynolds-number-pipes|Reynolds number]] $Re = VD/\\nu$, which compares inertia with viscosity, and the **relative roughness** $\\varepsilon/D$, the height of the wall's bumps compared with the bore. The **Moody chart** plots $f$ against both on logarithmic scales, and every pipe engineer learns to read it.

### Four zones of the chart
1. **Laminar**, $Re < 2300$: $f = 64/Re$, a straight line of slope −1, the same for every pipe ([[laminar-pipe-flow]]).
2. **Critical zone**, $2300 < Re < 4000$: the flow switches between laminar and turbulent; $f$ is uncertain and designers avoid it.
3. **Turbulent, transitional**: $f$ depends on both $Re$ and $\\varepsilon/D$. Every curve starts near the **smooth-pipe** line and bends away from it as $Re$ grows.
4. **Fully rough**: each curve goes flat. $f$ depends on $\\varepsilon/D$ alone, and the head loss is exactly proportional to $V^2$.

### Why roughness matters only sometimes
In turbulent flow a thin **viscous sublayer** survives against the wall, about $5\\nu/u_*$ thick, where $u_* = V\\sqrt{f/8}$ is the friction velocity. While the roughness is buried in it, the eddies never feel the bumps and the pipe is *hydraulically smooth*. As $Re$ rises the sublayer thins, the bumps poke through and shed eddies of their own, and eventually their drag dominates. The **roughness Reynolds number** $\\mathrm{Re}_\\varepsilon = \\varepsilon u_*/\\nu$ says where a pipe stands. Nikuradse's pipes, coated with uniform sand, were smooth below about 5 and fully rough above about 70. Commercial pipes, whose bumps come in all sizes, leave the smooth line earlier and reach the rough limit more gradually — which is exactly the shape of the Moody curves. The dashed boundary of the fully rough zone on the chart is $\\mathrm{Re}_\\varepsilon \\approx 70$.

### Roughness of real pipes
| Pipe | $\\varepsilon$ (mm) | $\\varepsilon/D$ at 100 mm bore |
|---|---|---|
| Drawn tubing: copper, stainless steel, glass | 0.0015 | 0.000015 |
| PVC and PE, new | ≈ 0.0015–0.007 | ≈ 0.00002–0.00007 |
| Commercial steel, new | 0.045 | 0.00045 |
| Galvanised steel | 0.15 | 0.0015 |
| Cast iron, new | 0.26 | 0.0026 |
| Concrete | 0.3–3 | 0.003–0.03 |
| Riveted steel | 0.9–9 | 0.009–0.09 |

These are *equivalent sand-grain* roughnesses — the sand size that would give the same friction — not measured bump heights, and in service they grow ([[roughness-ageing]]). An uncertainty of a factor of two in $\\varepsilon$ is normal, so a friction factor known to within 5–10 % is as good as the input allows.

### Useful formulas
- **Blasius** (1913), smooth pipes, $4000 < Re < 10^5$: $f = 0.316\\,Re^{-1/4}$ — the reason head loss in smooth pipes grows as $V^{1.75}$.
- **Fully rough** (von Kármán, from Nikuradse's data): $1/\\sqrt{f} = 2\\log_{10}(3.7D/\\varepsilon)$.
- **Colebrook–White**, covering the whole turbulent range, and its explicit approximations: see [[colebrook]].
- The **Fanning** friction factor used in chemical engineering and heat transfer is a quarter of Darcy's: $f_F = f/4$.

> [!tip] A sanity check for any turbulent result: water in ordinary steel and iron pipes almost always gives $f$ between 0.015 and 0.035. A value near 0.1 means a laminar flow — or a slip of units.
`,
  ideas: [
    'f depends only on Re and ε/D — the Moody chart shows the whole function.',
    'Laminar: f = 64/Re for any wall; critical zone 2300–4000: unpredictable.',
    'In turbulent flow f starts near the smooth-pipe line and levels off at a value set by ε/D alone (fully rough).',
    'Roughness matters only when the bumps poke through the viscous sublayer.',
    'Darcy f = 4 × Fanning f: check which one a chart or program uses.'
  ],
  pitfalls: [
    'Friction factor keeps falling as the flow increases — Only in laminar flow and smooth turbulent pipes. Rough pipes level off at a constant f.',
    'A rougher material always means a higher friction factor — At low Re the roughness is hidden in the viscous sublayer, and a steel pipe behaves like a smooth one.',
    'The roughness in the tables is the height of the bumps — It is an equivalent sand-grain roughness chosen to reproduce measured friction, and it changes with age.'
  ],
  formulas: [
    {
      name: 'Darcy and Fanning friction factors',
      expr: 'f = 4*fF', tex: 'f = 4 f_F',
      vars: {
        f: { name: 'Darcy friction factor' },
        fF: { name: 'Fanning friction factor', value: 0.005, tex: 'f_F' }
      },
      note: 'Same physics, two conventions: Darcy (civil and mechanical engineering, Moody chart) and Fanning (chemical engineering, heat transfer).',
      stories: { f: 'A chemical-engineering handbook gives a Fanning friction factor of {fF}. What is the Darcy friction factor?' }
    },
    {
      name: 'Blasius, smooth pipes',
      expr: 'f = 0.316/Re^0.25', tex: 'f = \\dfrac{0.316}{\\mathrm{Re}^{1/4}}',
      vars: {
        f: { name: 'Darcy friction factor' },
        Re: { name: 'Reynolds number', value: 50000, tex: '\\mathrm{Re}', min: 4000, max: 100000 }
      },
      note: 'Hydraulically smooth pipes (drawn tubing, plastics), 4000 < Re < 10⁵.',
      stories: { f: 'Water flows in a smooth copper tube at a Reynolds number of {Re}. Estimate the friction factor.' }
    },
    {
      name: 'Fully rough pipes (von Kármán)',
      expr: 'f = 1/(2*log(3.7*D/eps))^2', tex: 'f = \\dfrac{1}{\\left[2\\log_{10}\\left(3.7D/\\varepsilon\\right)\\right]^2}',
      vars: {
        f: { name: 'Darcy friction factor' },
        D: { name: 'inside diameter', q: 'length', unit: 'mm', value: 100 },
        eps: { name: 'equivalent roughness', q: 'length', unit: 'mm', value: 0.26, tex: '\\varepsilon' }
      },
      note: 'The flat right-hand end of each Moody curve: high Re, where f no longer depends on it.',
      practice: { unknowns: ['f', 'eps'] },
      stories: {
        f: 'A pipe of {D} bore has an equivalent roughness of {eps}. What is its friction factor at very high Reynolds numbers?',
        eps: 'At very high Reynolds numbers a pipe of {D} bore shows a friction factor of {f}. What is its equivalent roughness?'
      }
    },
    {
      name: 'Roughness Reynolds number',
      expr: 'Rk = eps*V*sqrt(f/8)/nu', tex: '\\mathrm{Re}_\\varepsilon = \\dfrac{\\varepsilon\\,V\\sqrt{f/8}}{\\nu}',
      vars: {
        Rk: { name: 'roughness Reynolds number', tex: '\\mathrm{Re}_\\varepsilon' },
        eps: { name: 'equivalent roughness', q: 'length', unit: 'mm', value: 0.045, tex: '\\varepsilon' },
        V: { name: 'mean velocity', q: 'speed', unit: 'm/s', value: 2 },
        f: { name: 'Darcy friction factor', value: 0.0186 },
        nu: { name: 'kinematic viscosity', q: 'kinvisc', unit: 'mm²/s', value: 1.004 }
      },
      note: 'Roughness height over the viscous length ν/u*, with the friction velocity u* = V√(f/8). Uniform sand: smooth below about 5, fully rough above about 70.',
      stories: { Rk: 'Water ({nu}) flows at {V} over a wall with an equivalent roughness of {eps}; f = {f}. What is the roughness Reynolds number?' }
    }
  ],
  examples: [
    {
      title: 'Reading the chart for a steel pipe',
      q: 'Water at 20 °C flows at 2 m/s in a 100 mm commercial-steel pipe ($\\varepsilon = 0.045$ mm). Find $f$, and compare with a smooth pipe, with the fully rough limit, and with cast iron ($\\varepsilon = 0.26$ mm).',
      steps: [
        '$Re = 2 \\times 0.1/1.004\\times10^{-6} = 1.99\\times10^5$; $\\varepsilon/D = 0.045/100 = 4.5\\times10^{-4}$.',
        'The Moody chart (Colebrook) gives $f = 0.0186$.',
        'A smooth pipe at this $Re$ would have $f = 0.0156$; the fully rough limit for this $\\varepsilon/D$ is $f = 0.0163$. The steel pipe lies in the transitional zone — and above both limits: Colebrook\'s curves bulge above their two asymptotes there.',
        'With $f = 0.0186$, $u_* = 2\\sqrt{0.0186/8} = 0.096$ m/s and $\\mathrm{Re}_\\varepsilon = 0.045\\times10^{-3} \\times 0.096/1.004\\times10^{-6} = 4.3$: the largest bumps are just reaching through the sublayer.',
        'Cast iron, $\\varepsilon/D = 0.0026$: $f = 0.0259$, 39 % more friction at the same flow.'
      ],
      a: 'f ≈ 0.0186 for steel (transitional zone), 0.0259 for cast iron.'
    },
    {
      title: 'Water and oil at the same speed',
      q: 'Water (20 °C) and ISO VG 46 hydraulic oil (40 °C, $\\nu = 46$ mm²/s) each flow at 1 m/s in a 20 mm drawn tube. Compare the friction factors.',
      steps: [
        'Water: $Re = 1 \\times 0.02/1.004\\times10^{-6} = 19\\,900$, turbulent and nearly smooth: $f = 0.026$.',
        'Oil: $Re = 1 \\times 0.02/46\\times10^{-6} = 435$, laminar: $f = 64/435 = 0.147$.',
        'The oil has 5.6 times the friction factor, and so 5.6 times the head loss at the same velocity (its pressure drop is 4.9 times larger, since it is 13 % less dense).'
      ],
      a: 'f ≈ 0.026 for water and 0.147 for the oil.'
    }
  ],
  quiz: [
    { q: 'In the fully rough zone, doubling the velocity multiplies the friction head loss by…', choices: ['2', 'about 3.4', '4', '8'], a: 2,
      why: 'In the fully rough zone f is constant, so h_f ∝ V².' },
    { q: 'A smooth PVC pipe and a commercial-steel pipe of the same bore carry water at Re = 5000. Their friction factors are…', choices: ['very different, because steel is 30 times rougher', 'nearly the same, because the roughness is buried in the viscous sublayer', 'both equal to 64/Re', 'undefined, because this is the critical zone'], a: 1,
      why: 'At Re = 5000 the sublayer is thick compared with 0.045 mm, so both pipes lie close to the smooth-pipe curve (f ≈ 0.037–0.038).' },
    { q: 'Up to about what Reynolds number can f = 64/Re be trusted?', answer: 2300, tol: 0.15,
      why: 'Above about 2300 disturbances grow and the flow becomes turbulent (fully so by about 4000).' },
    { q: 'At very high Reynolds numbers the friction factor keeps falling for every pipe.', a: false,
      why: 'For rough pipes it levels off at the fully rough value set by ε/D; only an ideally smooth pipe keeps falling, and ever more slowly.' },
    { q: 'What is the relative roughness ε/D of new cast iron (ε = 0.26 mm) with a 130 mm bore?', answer: 0.002, tol: 0.02,
      why: 'ε/D = 0.26/130 = 0.002.' }
  ],
  problems: [
    { q: 'A 200 mm concrete pipe has ε = 1 mm. What is its friction factor in the fully rough zone?', answer: 0.0304, tol: 0.02,
      hint: 'Use 1/√f = 2 log₁₀(3.7D/ε).',
      steps: ['$3.7D/\\varepsilon = 3.7 \\times 200/1 = 740$; $\\log_{10} 740 = 2.869$.', '$1/\\sqrt{f} = 5.738$, so $f = 1/32.93 = 0.0304$.'] }
  ],
  applications: [
    'Every pipe and hose pressure-drop calculation, by hand, in a spreadsheet or in network software.',
    'Checking whether a line runs laminar (oil) or turbulent (water) before choosing a formula.',
    'Diagnosing old mains: a measured friction factor far above the chart value means corrosion, deposits or a partly closed valve.'
  ],
  history: 'Johann Nikuradse, in Prandtl\'s laboratory at Göttingen, glued sand of carefully sieved sizes inside pipes and measured their friction over a huge range of Reynolds numbers (1932–33). Colebrook and White then showed how commercial pipes differ (1937–39), and in 1944 Lewis Moody, an American professor of hydraulics, published the chart that bears his name, drawn from Colebrook\'s equation.',
  sim: 'pipe-moody'
},

{
  id: 'colebrook', parent: 'pipe-friction', title: 'The Colebrook equation', level: 3,
  short: 'Colebrook and White joined the smooth-pipe and rough-pipe laws into one implicit equation for the turbulent friction factor. It has to be solved by iteration — or replaced by explicit fits such as Swamee–Jain and Haaland, accurate to a per cent or two.',
  keywords: ['Colebrook', 'Colebrook–White', 'Colebrook-White', 'implicit equation', 'iteration', 'Swamee–Jain', 'Haaland', 'friction factor', 'turbulent', 'explicit approximation', 'Newton method'],
  prereq: ['friction-factor', 'math:logarithms', 'math:newtons-method'],
  related: ['darcy-weisbach', 'roughness-ageing', 'pipe-networks', 'pipe-sizing', 'hazen-williams'],
  body: `
In the turbulent part of the Moody chart two limiting laws were known by the 1930s. For smooth pipes, Prandtl and von Kármán's law, $1/\\sqrt{f} = -2\\log_{10}\\left(2.51/(Re\\sqrt{f})\\right)$; for fully rough pipes, $1/\\sqrt{f} = -2\\log_{10}\\left(\\varepsilon/3.7D\\right)$. Cyril Colebrook, working with Cedric White on pipes of mixed roughness, noticed that commercial pipes pass gradually from one to the other, and that simply **adding the two arguments of the logarithm** reproduces the transition:

$$\\frac{1}{\\sqrt{f}} = -2\\log_{10}\\left(\\frac{\\varepsilon}{3.7D} + \\frac{2.51}{Re\\sqrt{f}}\\right)$$

When $\\varepsilon/D$ is tiny the second term dominates and the smooth law returns; when $Re$ is huge the first term dominates and $f$ stops depending on $Re$. The Moody chart is this equation drawn out.

### Solving it
$f$ appears on both sides, so the equation is solved by iteration. The simplest scheme: guess $f_0 = 0.02$, put it into the right-hand side, and repeat.

| Step | $f$ for $Re = 10^5$, $\\varepsilon/D = 0.001$ |
|---|---|
| guess | 0.02000 |
| 1 | 0.02229 |
| 2 | 0.02217 |
| 3 | 0.02217 |

Convergence is quick because the right-hand side depends on $f$ only through a logarithm. [[math:newtons-method|Newton's method]] on $x = 1/\\sqrt{f}$ converges in two or three steps from any sensible start; that is what spreadsheets and programs do.

### Explicit approximations
Where the equation must be evaluated thousands of times — inside a network solver, or by hand — explicit formulas save the iteration:

| Formula | Typical error against Colebrook |
|---|---|
| Swamee–Jain (1976): $f = 0.25\\big/\\left[\\log_{10}\\left(\\frac{\\varepsilon}{3.7D} + \\frac{5.74}{Re^{0.9}}\\right)\\right]^2$ | about 1 % |
| Haaland (1983): $\\frac{1}{\\sqrt f} = -1.8\\log_{10}\\left[\\left(\\frac{\\varepsilon}{3.7D}\\right)^{1.11} + \\frac{6.9}{Re}\\right]$ | about 1.5 % |

Both hold for roughly $10^{-6} < \\varepsilon/D < 10^{-2}$ and $5000 < Re < 10^8$. Since $\\varepsilon$ itself is rarely known to better than ±30 %, either is as good as the exact equation for design, and Colebrook itself is a fit to data scattered by a few per cent.

### Turning the problem round
Three classic pipe problems use the same physics:
1. **Head loss** — given $Q$, $D$, $L$: compute $Re$, then $f$, then $h_f$. Direct.
2. **Flow** — given $h_f$, $D$, $L$: $f$ depends on the unknown velocity. Substituting Darcy–Weisbach into Colebrook gives an explicit answer, the Swamee–Jain flow formula in the calculator below.
3. **Diameter** — given $Q$ and the allowed $h_f$: iterate on $D$ (or use the [pipe calculator](#/tools/hydro/pipe)).

And a fourth, used in the field: from a measured head loss and flow, Colebrook can be solved **explicitly for the roughness**, which tells an operator how far an old main has aged ([[roughness-ageing]]).

> [!note] Colebrook applies to turbulent flow only. Below $Re \\approx 2300$ use $f = 64/Re$; between 2300 and 4000 no formula is reliable.
`,
  ideas: [
    'Colebrook adds the arguments of the smooth-pipe and rough-pipe logarithms to cover the whole turbulent range.',
    'It is implicit in f and is solved by a few fixed-point or Newton iterations.',
    'Swamee–Jain and Haaland are explicit and within 1–2 %, far better than the uncertainty in ε.',
    'Solved the other way, a measured friction factor gives the roughness of an existing pipe.'
  ],
  pitfalls: [
    'Colebrook is the exact law of pipe friction — It is an empirical blend of two asymptotic laws, fitted to commercial pipes; its inputs are uncertain by far more than its 1 % differences from the explicit formulas.',
    'Colebrook also covers laminar flow — It is a turbulent-flow formula. At low Re it gives values that have nothing to do with 64/Re.'
  ],
  formulas: [
    {
      name: 'Colebrook–White',
      expr: '1/sqrt(f) = -2*log(eps/(3.7*D) + 2.51/(Re*sqrt(f)))',
      tex: '\\dfrac{1}{\\sqrt{f}} = -2\\log_{10}\\left(\\dfrac{\\varepsilon}{3.7D} + \\dfrac{2.51}{\\mathrm{Re}\\sqrt{f}}\\right)',
      solveFor: 'f',
      vars: {
        f: { name: 'Darcy friction factor', min: 0.005, max: 0.2 },
        eps: { name: 'equivalent roughness', q: 'length', unit: 'mm', value: 0.045, tex: '\\varepsilon' },
        D: { name: 'inside diameter', q: 'length', unit: 'mm', value: 100 },
        Re: { name: 'Reynolds number', value: 200000, tex: '\\mathrm{Re}' }
      },
      note: 'Turbulent flow, Re above about 4000. The calculator solves it numerically for f.',
      practice: { unknowns: ['f', 'eps'] },
      stories: {
        f: 'Water flows at a Reynolds number of {Re} in a pipe of {D} bore with an equivalent roughness of {eps}. What is the friction factor?',
        eps: 'A test on a pipe of {D} bore at a Reynolds number of {Re} gives a friction factor of {f}. What is the equivalent roughness of its wall?'
      }
    },
    {
      name: 'Swamee–Jain (explicit)',
      expr: '1/sqrt(f) = -2*log(eps/(3.7*D) + 5.74/Re^0.9)',
      tex: '\\dfrac{1}{\\sqrt{f}} = -2\\log_{10}\\left(\\dfrac{\\varepsilon}{3.7D} + \\dfrac{5.74}{\\mathrm{Re}^{0.9}}\\right)',
      solveFor: 'f',
      vars: {
        f: { name: 'Darcy friction factor' },
        eps: { name: 'equivalent roughness', q: 'length', unit: 'mm', value: 0.045, tex: '\\varepsilon' },
        D: { name: 'inside diameter', q: 'length', unit: 'mm', value: 100 },
        Re: { name: 'Reynolds number', value: 200000, tex: '\\mathrm{Re}' }
      },
      note: 'The same as f = 0.25/[log₁₀(ε/3.7D + 5.74/Re^0.9)]², written like Colebrook to show the difference: 5.74/Re^0.9 replaces 2.51/(Re√f), so f appears only once. Within about 1 % of Colebrook for 10⁻⁶ < ε/D < 10⁻², 5000 < Re < 10⁸.',
      stories: { f: 'Estimate the friction factor at a Reynolds number of {Re} in a pipe of {D} bore with ε = {eps}, without iterating.' }
    },
    {
      name: 'Haaland (explicit)',
      expr: '1/sqrt(f) = -1.8*log((eps/(3.7*D))^1.11 + 6.9/Re)',
      tex: '\\dfrac{1}{\\sqrt{f}} = -1.8\\log_{10}\\left[\\left(\\dfrac{\\varepsilon}{3.7D}\\right)^{1.11} + \\dfrac{6.9}{\\mathrm{Re}}\\right]',
      solveFor: 'f',
      vars: {
        f: { name: 'Darcy friction factor' },
        eps: { name: 'equivalent roughness', q: 'length', unit: 'mm', value: 0.045, tex: '\\varepsilon' },
        D: { name: 'inside diameter', q: 'length', unit: 'mm', value: 100 },
        Re: { name: 'Reynolds number', value: 200000, tex: '\\mathrm{Re}' }
      },
      note: 'Within about 1.5 % of Colebrook over the same range.',
      stories: { f: 'Use Haaland\'s formula: what is f at a Reynolds number of {Re} in a pipe of {D} bore with ε = {eps}?' }
    },
    {
      name: 'Flow for a given head loss (Swamee–Jain)',
      expr: 'Q = -0.965*D^2*sqrt(g*D*hf/L)*ln(eps/(3.7*D) + sqrt(3.17*nu^2*L/(g*D^3*hf)))',
      tex: 'Q = -0.965\\,D^2\\sqrt{\\dfrac{g D h_f}{L}}\\,\\ln\\left(\\dfrac{\\varepsilon}{3.7D} + \\sqrt{\\dfrac{3.17\\,\\nu^2 L}{g D^3 h_f}}\\right)',
      vars: {
        Q: { name: 'flow rate', q: 'flowrate', unit: 'L/s' },
        D: { name: 'inside diameter', q: 'length', unit: 'mm', value: 150, min: 5, max: 3000 },
        hf: { name: 'friction head loss', q: 'length', unit: 'm', value: 3.59, tex: 'h_f' },
        L: { name: 'pipe length', q: 'length', unit: 'm', value: 300 },
        eps: { name: 'equivalent roughness', q: 'length', unit: 'mm', value: 0.045, tex: '\\varepsilon' },
        nu: { name: 'kinematic viscosity', q: 'kinvisc', unit: 'mm²/s', value: 1.004 },
        g: { const: 'g' }
      },
      note: 'Colebrook and Darcy–Weisbach combined and solved for the flow; turbulent flow only. Solving it for D sizes a pipe for a given flow and head.',
      practice: { unknowns: ['Q', 'D'] },
      stories: {
        Q: 'A pipe {L} long with a bore of {D} and ε = {eps} may lose {hf} of head. How much water ({nu}) will it carry?',
        D: 'A pipe {L} long (ε = {eps}) must carry {Q} of water ({nu}) with a head loss of {hf}. What bore does it need?'
      }
    }
  ],
  examples: [
    {
      title: 'Iterating by hand',
      q: 'Find $f$ for $Re = 10^5$ and $\\varepsilon/D = 0.001$ by iterating Colebrook from $f_0 = 0.02$, and compare with Swamee–Jain and Haaland.',
      steps: [
        '$\\varepsilon/3.7D = 2.70\\times10^{-4}$.',
        'Step 1: $2.51/(10^5\\sqrt{0.02}) = 1.775\\times10^{-4}$; $1/\\sqrt f = -2\\log_{10}(4.478\\times10^{-4}) = 6.698$, so $f_1 = 0.02229$.',
        'Step 2 with $f_1$: $2.51/(10^5\\sqrt{0.02229}) = 1.681\\times10^{-4}$; $1/\\sqrt f = 6.716$, so $f_2 = 0.02217$. Step 3 repeats 0.02217.',
        'Swamee–Jain: $f = 0.25/[\\log_{10}(2.70\\times10^{-4} + 5.74/10^{4.5})]^2 = 0.02234$ (+0.8 %).',
        'Haaland: $f = 0.02197$ (−0.9 %).'
      ],
      a: 'f = 0.0222; the explicit formulas are within 1 %.'
    },
    {
      title: 'How rough is the old main?',
      q: 'A test on a 200 mm water main gives $f = 0.028$ at $Re = 3\\times10^5$. What equivalent roughness does that imply?',
      steps: [
        { text: 'Solve Colebrook for the roughness — it is explicit that way round:', tex: '\\frac{\\varepsilon}{D} = 3.7\\left(10^{-1/(2\\sqrt f)} - \\frac{2.51}{Re\\sqrt f}\\right)' },
        '$\\sqrt f = 0.1673$; $10^{-1/(2 \\times 0.1673)} = 10^{-2.988} = 1.028\\times10^{-3}$; $2.51/(3\\times10^5 \\times 0.1673) = 5.0\\times10^{-5}$.',
        '$\\varepsilon/D = 3.7 \\times (1.028 - 0.050)\\times10^{-3} = 3.62\\times10^{-3}$, so $\\varepsilon = 0.72$ mm.',
        'New steel would be 0.045 mm: the main has roughened sixteenfold ([[roughness-ageing]]).'
      ],
      a: 'ε ≈ 0.72 mm.'
    }
  ],
  quiz: [
    { q: 'Why must the Colebrook equation be solved by iteration?', choices: ['because it contains a logarithm', 'because f appears on both sides, once inside the logarithm', 'because Re depends on f', 'because it is only valid in the critical zone'], a: 1,
      why: 'f appears on the left and inside the logarithm on the right, and cannot be isolated with elementary functions.' },
    { q: 'With ε = 0, the Colebrook equation becomes…', choices: ['f = 64/Re', 'the Blasius formula', 'the Prandtl–von Kármán smooth-pipe law', 'the fully rough law'], a: 2,
      why: 'Dropping ε/3.7D leaves 1/√f = −2 log(2.51/(Re√f)), the smooth-pipe law.' },
    { q: 'Starting from f = 0.02, the fixed-point iteration for Re = 10⁵ and ε/D = 0.001 settles on f ≈ …', answer: 0.0222, tol: 0.02,
      why: '0.02 → 0.02229 → 0.02217 → 0.02217.' },
    { q: 'The Colebrook equation gives reliable friction factors at Re = 1500.', a: false,
      why: 'At Re = 1500 the flow is laminar: f = 64/Re = 0.043. Colebrook is a turbulent-flow law.' },
    { q: 'Swamee–Jain differs from Colebrook by about 1 %. For designing a water main, this is…', choices: ['a serious error that needs the exact equation', 'negligible next to the uncertainty in the roughness', 'only acceptable for plastic pipes', 'only acceptable in laminar flow'], a: 1,
      why: 'The equivalent roughness of a real pipe is uncertain by tens of per cent and changes with age; 1 % in f is lost in that.' }
  ],
  problems: [
    { q: 'Use Swamee–Jain to find f at Re = 5×10⁵ in a pipe with ε/D = 2×10⁻⁴.', answer: 0.0155, tol: 0.02,
      steps: ['$\\varepsilon/3.7D = 5.41\\times10^{-5}$; $5.74/Re^{0.9} = 5.74/1.35\\times10^5 = 4.26\\times10^{-5}$.', '$\\log_{10}(9.67\\times10^{-5}) = -4.015$; $f = 0.25/16.12 = 0.0155$.'] }
  ],
  applications: [
    'The friction-factor routine inside pipe-sizing spreadsheets, network solvers and process simulators.',
    'Field tests of old mains: solving for ε from a measured head loss and flow.',
    'Drawing Moody charts and checking explicit approximations.'
  ],
  history: 'Cyril Colebrook and Cedric White experimented at Imperial College in London with pipes roughened by mixtures of sand grains (1937), and in 1939 Colebrook published the equation that joins the smooth and rough laws. Lewis Moody turned it into his chart in 1944. The explicit fits came when engineers began to program pipe networks: Swamee and Jain in 1976, Haaland in 1983.',
  sim: { id: 'pipe-moody', params: { Re: 1e5, rr: 0.001 } }
},

{
  id: 'hazen-williams', parent: 'pipe-friction', title: 'Hazen–Williams and empirical formulas', level: 2,
  short: 'An empirical water-pipe formula from 1905 that gives head loss directly from a roughness coefficient C, with no Reynolds number and no iteration. Still used by water utilities and fire-protection codes, but valid only for water at ordinary temperatures in turbulent flow.',
  keywords: ['Hazen–Williams', 'Hazen-Williams', 'C factor', 'roughness coefficient', 'empirical formula', 'water mains', 'fire sprinkler', 'head loss', 'Manning', 'exponent 1.852'],
  prereq: ['darcy-weisbach', 'friction-factor'],
  related: ['roughness-ageing', 'manning-equation', 'water-supply', 'pipe-networks', 'colebrook'],
  body: `
Long before calculators, waterworks engineers wanted a pipe-friction formula they could use with a slide rule and a book of tables. In 1905 Allen Hazen and Gardner Williams published one, fitted to a large collection of measurements on water mains:

$$V = k\\,C\\,R^{0.63}\\,S^{0.54}$$

where $R = D/4$ is the hydraulic radius of a full pipe, $S = h_f/L$ the friction slope, $C$ a roughness coefficient (higher is smoother) and $k = 0.849$ in SI units (1.318 in US customary units). Rearranged for a full circular pipe, in SI units,

$$h_f = \\frac{10.67\\,L\\,Q^{1.852}}{C^{1.852}\\,D^{4.87}}$$

with $Q$ in m³/s and $L$, $D$ and $h_f$ in metres. There is no Reynolds number, no viscosity and no iteration: that simplicity is why it lives on in water-utility software and in fire-protection codes such as the sprinkler standards.

### Values of C
| Pipe | $C$ |
|---|---|
| PVC, PE, copper | 140–150 |
| New steel | 140 |
| New cement-lined ductile iron | 130–140 |
| Concrete | 100–140 |
| Cast iron, 10–20 years old | 100–110 |
| Old unlined cast iron | 80–100 |
| Badly tuberculated old mains | 40–60 |

A falling $C$ is how utilities usually describe [[roughness-ageing|ageing]]: at the same flow the loss scales as $C^{-1.852}$, so a main whose $C$ drops from 130 to 100 loses 63 % more head.

### What it gets right and wrong
Hazen–Williams is a curve fit, trustworthy only where its data came from: **water**, at ordinary temperatures (roughly 5–25 °C), in pipes larger than about 50 mm, at velocities below about 3 m/s, in turbulent flow. Its exponent 1.852 is a compromise: in real pipes the loss grows as $V^{1.75}$ when they are smooth and as $V^{2}$ when fully rough, so $C$ is not truly constant but drifts with velocity and diameter. Inside its range it agrees with Darcy–Weisbach to about 10 %; outside it — hot water, small pipes, viscous liquids, laminar flow — it can be wrong by 20–40 %, and it knows nothing about oil. For hydraulic oil always use Darcy–Weisbach with the real viscosity.

> [!tip] The two methods meet through the friction factor: from a Hazen–Williams head loss, $f = 2 g D h_f/(L V^2)$. Network programs such as EPANET offer both (and Chézy–Manning); new designs increasingly use Darcy–Weisbach with Colebrook.

### Relatives
Open channels have an empirical law of the same kind, [[manning-equation|Manning's equation]] $V = R^{2/3}S^{1/2}/n$, which is also used for sewers and culverts flowing full. Both formulas are **dimensionally inconsistent**: their numerical constants belong to one set of units. Use the SI constant with SI units and the US constant with US units — never mix them.
`,
  ideas: [
    'Hazen–Williams gives head loss from a single roughness coefficient C: no Re, no iteration.',
    'At a fixed C, head loss grows as Q^1.852 and as D^−4.87.',
    'C falls as pipes age: 130–150 new, 80–100 for old cast iron, 40–60 when badly tuberculated.',
    'It is only valid for water at ordinary temperatures in turbulent flow; use Darcy–Weisbach for anything else.'
  ],
  pitfalls: [
    'Hazen–Williams works for any liquid — It contains no viscosity. It is a fit to cold-water data and fails for oils, hot water and laminar flow.',
    'A higher C means a rougher pipe — The opposite: C is a smoothness coefficient; 150 is plastic, 60 an old tuberculated main.',
    'The SI and US forms share the same constant — The constant carries the units: 0.849 (SI) against 1.318 (US), 10.67 against 4.52 in the head-loss forms.'
  ],
  formulas: [
    {
      name: 'Hazen–Williams head loss (SI)',
      expr: 'hf = 10.67*L*Q^1.852/(C^1.852*D^4.87)', tex: 'h_f = \\dfrac{10.67\\,L\\,Q^{1.852}}{C^{1.852}\\,D^{4.87}}',
      vars: {
        hf: { name: 'friction head loss', q: false, unit: 'm', tex: 'h_f' },
        L: { name: 'pipe length', q: false, unit: 'm', value: 1000 },
        Q: { name: 'flow rate', q: false, unit: 'm³/s', value: 0.05 },
        C: { name: 'Hazen–Williams coefficient', value: 120 },
        D: { name: 'inside diameter', q: false, unit: 'm', value: 0.25 }
      },
      note: 'Empirical, SI units only: Q in m³/s, L, D and h_f in metres. Water at about 5–25 °C, turbulent flow, V below about 3 m/s.',
      practice: { unknowns: ['hf', 'Q', 'C'] },
      stories: {
        hf: 'A water main {L} long with a bore of {D} and C = {C} carries {Q}. What is the head loss?',
        Q: 'A main {L} long, {D} in bore, with C = {C}, has {hf} of head available. What flow will it carry?',
        C: 'A field test on {L} of {D} main carrying {Q} measures a head loss of {hf}. What is its Hazen–Williams C?'
      }
    },
    {
      name: 'Hazen–Williams velocity (SI)',
      expr: 'V = 0.849*C*R^0.63*S^0.54', tex: 'V = 0.849\\,C\\,R^{0.63}\\,S^{0.54}',
      vars: {
        V: { name: 'mean velocity', q: false, unit: 'm/s' },
        C: { name: 'Hazen–Williams coefficient', value: 120 },
        R: { name: 'hydraulic radius (D/4 for a full pipe)', q: false, unit: 'm', value: 0.0625 },
        S: { name: 'friction slope h_f/L', value: 0.004 }
      },
      note: 'The original form. R = A/P, which is D/4 for a circular pipe flowing full; S is metres of head lost per metre of pipe.',
      stories: { V: 'A full pipe with a hydraulic radius of {R} and C = {C} runs at a friction slope of {S}. What is the mean velocity?' }
    }
  ],
  examples: [
    {
      title: 'A distribution main, new and old',
      q: 'A 400 m ductile-iron main of 200 mm bore ($C = 130$) carries 40 L/s. Find the head loss by Hazen–Williams, compare with Darcy–Weisbach ($\\varepsilon = 0.1$ mm, 20 °C), and repeat for an aged main with $C = 90$.',
      steps: [
        '$Q^{1.852} = 0.04^{1.852} = 2.576\\times10^{-3}$; $C^{1.852} = 130^{1.852} = 8223$; $D^{4.87} = 0.2^{4.87} = 3.945\\times10^{-4}$.',
        { text: 'Hazen–Williams:', tex: 'h_f = \\frac{10.67 \\times 400 \\times 2.576\\times10^{-3}}{8223 \\times 3.945\\times10^{-4}} = 3.39\\ \\text{m}' },
        'Darcy–Weisbach: $V = 1.27$ m/s, $Re = 2.54\\times10^5$, $\\varepsilon/D = 5\\times10^{-4}$, $f = 0.0184$, $h_f = 3.05$ m — about 10 % lower, the usual size of the disagreement.',
        'Aged, $C = 90$: the loss is multiplied by $(130/90)^{1.852} = 1.98$, giving 6.70 m.'
      ],
      a: '3.4 m new (3.05 m by Darcy–Weisbach); 6.7 m once C has fallen to 90.'
    },
    {
      title: 'Where it drifts: hot water',
      q: 'The same main carries 40 L/s of water at 80 °C ($\\nu = 0.36$ mm²/s). What do the two methods give now?',
      steps: [
        'Hazen–Williams has no viscosity, so it still says 3.39 m.',
        'Darcy–Weisbach: $Re = 1.27 \\times 0.2/0.36\\times10^{-6} = 7.1\\times10^5$, $f = 0.0174$, $h_f = 2.88$ m.',
        'Hazen–Williams now overestimates by 18 %. In district-heating pipes, use Darcy–Weisbach.'
      ],
      a: 'Hazen–Williams 3.39 m, Darcy–Weisbach 2.88 m.'
    }
  ],
  quiz: [
    { q: 'An old tuberculated cast-iron main has C = 60; a new PVC main has C = 150. At the same flow and bore, which loses more head?', choices: ['the PVC main, because C is larger', 'the old cast-iron main', 'both lose the same', 'it depends on the Reynolds number only'], a: 1,
      why: 'C is a smoothness coefficient: h_f ∝ C^−1.852, so the low-C main loses (150/60)^1.852 ≈ 5.5 times as much.' },
    { q: 'Hazen–Williams is a good choice for the pressure lines of a hydraulic excavator.', a: false,
      why: 'It was fitted to cold water in turbulent flow and contains no viscosity. Oil lines are often laminar and strongly viscosity-dependent: use Darcy–Weisbach.' },
    { q: 'With C constant, by what factor does the Hazen–Williams head loss grow when the flow doubles?', answer: 3.61, tol: 0.02,
      why: '2^1.852 = 3.61 — between the smooth-pipe 2^1.75 = 3.36 and the fully rough 2² = 4.' },
    { q: 'A main\'s C falls from 130 to 100 over 25 years. At the same flow, its head loss rises by about…', choices: ['23 %', '30 %', '63 %', '100 %'], a: 2,
      why: '(130/100)^1.852 = 1.63.' }
  ],
  problems: [
    { q: 'A 2 km main of 300 mm bore with C = 100 carries 80 L/s. What is the head loss by Hazen–Williams?', answer: 13.8, unit: 'm', tol: 0.02,
      steps: ['$Q^{1.852} = 0.08^{1.852} = 9.30\\times10^{-3}$; $C^{1.852} = 5058$; $D^{4.87} = 0.3^{4.87} = 2.83\\times10^{-3}$.', '$h_f = 10.67 \\times 2000 \\times 9.28\\times10^{-3}/(5070 \\times 2.83\\times10^{-3}) = 13.8$ m.'] }
  ],
  applications: [
    'Water-distribution design and network models in many utilities, especially in North America.',
    'Hydraulic calculations for fire sprinkler systems, where codes prescribe it with fixed C values.',
    'Describing the condition of old mains by their C factor, measured in hydrant flow tests.'
  ],
  history: 'Allen Hazen, a sanitary engineer, and Gardner S. Williams, a professor of hydraulics, published their formula with extensive tables in 1905. It was designed for the slide rule — the awkward exponents were chosen so that C would stay nearly constant for a given pipe over the usual range of sizes and speeds.'
},

{
  id: 'roughness-ageing', parent: 'pipe-friction', title: 'Roughness and ageing of pipes', level: 2,
  short: 'Pipes get rougher and narrower as they age — corrosion nodules, scale, biofilm and sediment — so their friction factor can double or treble over decades. Designers allow for it; utilities measure it and clean or reline their mains.',
  keywords: ['ageing', 'aging', 'pipe roughness', 'tuberculation', 'corrosion', 'scale', 'biofilm', 'carrying capacity', 'relining', 'pigging', 'Colebrook–White ageing', 'C factor'],
  prereq: ['friction-factor', 'colebrook'],
  related: ['hazen-williams', 'water-supply', 'pipe-sizing', 'system-curve', 'operating-point', 'pipe-networks'],
  body: `
A new steel or iron pipe is as smooth as it will ever be. Water chemistry, time and biology then go to work on the wall, and the friction factor of an old main can be two or three times its value on the day it was laid. Because pumps and networks are built to serve for decades, engineers design with the roughness a pipe will have in middle age, not at birth.

### What happens inside a pipe
- **Corrosion and tuberculation.** In unlined iron and steel, corrosion products build up as hard nodules — tubercles — a few millimetres to a few centimetres high. They raise the roughness and shrink the bore.
- **Scale.** Hard water deposits calcium carbonate, faster where it is heated (boilers, heat exchangers, district heating).
- **Biofilm and slime.** A soft living layer grows on almost any wall carrying raw or poorly disinfected water; it adds far more friction than its thickness suggests, because it flutters in the flow.
- **Sediment** settles in slow mains and along the bottom of sewers.

Cement-mortar-lined ductile iron, PE and PVC resist most of this; their roughness changes little over decades.

### Colebrook and White's rule
Studying old mains in the 1930s, Colebrook and White found that the equivalent roughness often grows roughly **linearly with age**:

$$\\varepsilon = \\varepsilon_0 + \\alpha\\,t$$

The growth rate $\\alpha$ depends on how aggressive the water is to the pipe material. Field data span about two orders of magnitude — from around 0.02 mm a year in water that hardly attacks iron to 0.5–1 mm a year in very aggressive water — so local experience matters more than any table.

### The bore shrinks too
Deposits reduce the diameter, and at a given flow the head loss goes as $D^{-5}$. A 10 % loss of bore alone raises the head loss by 69 %, before any change of roughness. Together the two effects are why a fifty-year-old unlined main may carry only about half its original flow at the original pressure.

| Unlined cast-iron main, a typical history | Hazen–Williams $C$ |
|---|---|
| New | 130 |
| 20 years | 100–110 |
| 40 years | 80–90 |
| Heavily tuberculated | 40–60 |

### Consequences and cures
As a main ages its [[system-curve]] steepens, the pump's [[operating-point]] slides to lower flow, and the energy per cubic metre delivered rises. Utilities track it with field tests — measure $h_f$ and $Q$ between two hydrants, then solve [[colebrook|Colebrook]] for $\\varepsilon$ or [[hazen-williams|Hazen–Williams]] for $C$ — and then clean the main (pigging, swabbing, air scouring), reline it with cement mortar or epoxy, or pull a new PE pipe through it. New designs include an ageing allowance, for example $C = 100$ rather than 130, or several times the new roughness for unlined metal pipes.

> [!note] In oil hydraulics the lines carry clean, filtered oil and flow is often laminar, so wall roughness hardly matters there. What ages is the oil itself — oxidation and varnish that sticks spools — which is why oil condition is monitored instead.

> [!warn] Cleaning and relining work means entering excavations and sometimes pipes and chambers: these are confined spaces that need isolation of the water supply, gas testing, rescue arrangements and a permit system. Mains under pressure must be isolated and drained before they are opened.
`,
  ideas: [
    'Unlined metal pipes roughen with age through corrosion nodules, scale, biofilm and sediment; plastics and lined pipes change little.',
    'Colebrook and White: roughness grows roughly linearly with time, ε = ε₀ + αt, at a rate set by the water chemistry.',
    'Deposits also shrink the bore; at a given flow head loss ∝ D⁻⁵, so a 10 % smaller bore means 69 % more loss.',
    'Ageing steepens the system curve and cuts the flow a pump delivers; designs include an ageing allowance.'
  ],
  pitfalls: [
    'A pipe keeps the roughness in the tables for its whole life — Tabulated values are for new pipe; an unlined iron main can roughen tenfold or more.',
    'Only roughness matters as a pipe ages — The loss of bore can matter as much, because of the fifth power of D.',
    'An old main just needs a bigger pump — The extra head costs energy every hour; cleaning or relining often restores most of the capacity for less.'
  ],
  formulas: [
    {
      name: 'Linear growth of roughness (Colebrook–White)',
      expr: 'eps = eps0 + a*t', tex: '\\varepsilon = \\varepsilon_0 + \\alpha t',
      vars: {
        eps: { name: 'equivalent roughness after t years', q: false, unit: 'mm', tex: '\\varepsilon' },
        eps0: { name: 'roughness when new', q: false, unit: 'mm', value: 0.25, tex: '\\varepsilon_0' },
        a: { name: 'growth rate', q: false, unit: 'mm/yr', value: 0.08, tex: '\\alpha' },
        t: { name: 'age', q: false, unit: 'yr', value: 40 }
      },
      note: 'An empirical rule for unlined metal pipes; α ranges from about 0.02 to 1 mm a year depending on the water.',
      practice: { unknowns: ['eps', 'a', 't'] },
      stories: {
        eps: 'A main laid with a roughness of {eps0} roughens at {a}. What is its roughness after {t}?',
        a: 'A main laid with a roughness of {eps0} has a roughness of {eps} after {t}. At what rate has it roughened?',
        t: 'A main laid at {eps0} roughens at {a}. When will its roughness reach {eps}?'
      }
    },
    {
      name: 'Effect of a smaller bore',
      expr: 'h1 = h0*(D0/D1)^5', tex: 'h_1 = h_0\\left(\\dfrac{D_0}{D_1}\\right)^5',
      vars: {
        h1: { name: 'head loss with the reduced bore', q: 'length', unit: 'm', tex: 'h_1' },
        h0: { name: 'head loss with the original bore', q: 'length', unit: 'm', value: 10, tex: 'h_0' },
        D0: { name: 'original bore', q: 'length', unit: 'mm', value: 300, tex: 'D_0' },
        D1: { name: 'reduced bore', q: 'length', unit: 'mm', value: 270, tex: 'D_1' }
      },
      note: 'Same flow and same friction factor. In reality f rises too, so the true increase is larger.',
      stories: {
        h1: 'A 300 mm main that lost {h0} of head when new has its bore reduced from {D0} to {D1} by deposits. At the same flow and f, what head does it lose now?',
        D1: 'At the same flow, a main that lost {h0} with a bore of {D0} now loses {h1}. If f is unchanged, what is its effective bore?'
      }
    }
  ],
  examples: [
    {
      title: 'Forty years of an unlined main',
      q: 'A 300 mm unlined cast-iron main carries 70 L/s of water at 20 °C. New, $\\varepsilon_0 = 0.25$ mm; the water roughens it at $\\alpha = 0.08$ mm a year. Compare the friction factor and the head loss per kilometre when new and after 40 years, when tubercles have also reduced the bore to 280 mm.',
      steps: [
        'New: $V = 0.99$ m/s, $Re = 2.96\\times10^5$, $\\varepsilon/D = 8.3\\times10^{-4}$, $f = 0.0199$; $h_f = 3.32$ m per km.',
        'After 40 years: $\\varepsilon = 0.25 + 0.08 \\times 40 = 3.45$ mm.',
        'With the old bore: $\\varepsilon/D = 0.0115$, $f = 0.0399$ — double.',
        'With the reduced bore of 280 mm: $V = 1.14$ m/s, $\\varepsilon/D = 0.0123$, $f = 0.0409$, and $h_f = 9.62$ m per km.'
      ],
      a: 'The friction factor doubles, and with the smaller bore the head loss per km rises from 3.3 m to 9.6 m — almost three times.'
    }
  ],
  quiz: [
    { q: 'Which of these pipes keeps its original roughness best over decades of carrying drinking water?', choices: ['unlined cast iron', 'unlined steel', 'polyethylene (PE)', 'galvanised steel'], a: 2,
      why: 'Plastics do not corrode or grow tubercles; unlined iron and steel do, and galvanising only delays it.' },
    { q: 'Deposits reduce a main\'s bore by 10 %. At the same flow and friction factor, the head loss rises by about…', choices: ['10 %', '21 %', '46 %', '69 %'], a: 3,
      why: 'h ∝ D⁻⁵: (1/0.9)⁵ = 1.69.' },
    { q: 'As a main ages, the centrifugal pump that feeds it delivers more flow.', a: false,
      why: 'Ageing steepens the system curve; the operating point moves to higher head and lower flow.' },
    { q: 'A main laid with ε = 0.3 mm roughens at 0.1 mm a year. What is its roughness after 30 years?', answer: 3.3, unit: 'mm', tol: 0.02,
      why: 'ε = 0.3 + 0.1 × 30 = 3.3 mm.' }
  ],
  applications: [
    'Choosing design roughness or C values for new mains and pumping stations.',
    'Planning rehabilitation of water networks: which mains to clean, reline or replace.',
    'Explaining falling pump output and rising energy bills in old systems.'
  ],
  history: 'In 1937 Colebrook and White published a study of how the carrying capacity of water mains falls with age, proposing the linear growth of roughness still used today; later surveys grouped waters by how quickly they roughen iron.',
  sim: { id: 'pipe-designer', params: { mat: 'ci', age: 40 } }
},

/* ================================================================ PIPE SYSTEMS */
{
  id: 'minor-losses', parent: 'pipe-systems', title: 'Minor losses in fittings and valves', level: 2,
  short: 'Bends, valves, tees, entrances, exits and changes of bore each lose a number K of velocity heads, because the flow separates and its eddies dissipate energy. In short, fitting-rich pipework these “minor” losses can exceed the pipe friction.',
  keywords: ['minor loss', 'local loss', 'loss coefficient', 'K factor', 'fittings', 'valves', 'elbow', 'entrance loss', 'exit loss', 'sudden expansion', 'Borda–Carnot', 'contraction'],
  prereq: ['energy-equation', 'darcy-weisbach', 'flow-rate'],
  related: ['equivalent-length', 'hgl-egl', 'orifice-equation', 'check-valves', 'pipe-bend-forces', 'system-curve', 'aerodynamics:flow-separation'],
  body: `
A straight pipe loses head steadily along its length. A bend, a valve, a tee, a change of bore or the entry from a tank loses it all at once, within a few diameters, because the flow **separates**: it cannot follow an abrupt change of direction or area, so a jet forms, a zone of recirculating eddies grows beside it, and the jet's excess kinetic energy is chewed into turbulence and finally heat downstream ([[aerodynamics:flow-separation|flow separation]]). Such **minor losses** are written as a number of velocity heads:

$$h_m = K\\,\\frac{V^2}{2g}, \\qquad \\Delta p = K\\,\\frac{\\rho V^2}{2}$$

The loss coefficient $K$ is measured and quoted for fully turbulent flow; $V$ is the velocity in the pipe the fitting sits in (for a change of bore, usually the smaller pipe — check which one a table means).

### Typical loss coefficients
| Fitting | $K$ |
|---|---|
| Entrance from a tank, sharp-edged | 0.5 |
| Entrance, pipe projecting into the tank | 0.8–1.0 |
| Entrance, well-rounded (bellmouth) | 0.03–0.05 |
| Exit into a tank or reservoir | 1.0 |
| 90° elbow: long-radius flanged / standard / threaded | 0.3 / 0.5–0.75 / 0.9 |
| 45° elbow | 0.2–0.4 |
| Tee, flow through the run / through the branch | 0.2–0.4 / 1.0–1.8 |
| Gate valve, fully open / half open | 0.2 / about 2–5 |
| Ball valve, fully open | 0.05 |
| Butterfly valve, fully open | 0.3–0.5 |
| Globe valve, fully open | 6–10 |
| Swing check valve | 2 |
| Sudden expansion | $(1 - A_1/A_2)^2$ |
| Sudden contraction (area ratio small) | up to about 0.5 |

These are typical values; fittings of the same kind differ by ±30 % or more between makers and sizes.

### The sudden expansion
One loss can be derived exactly. When a pipe opens suddenly, the jet from the small pipe mixes out in the large one. Momentum and energy balances (the Borda–Carnot result) give

$$h_m = \\frac{(V_1 - V_2)^2}{2g} = \\left(1 - \\frac{A_1}{A_2}\\right)^2 \\frac{V_1^2}{2g}$$

Its limit $A_2 \\to \\infty$ is the **exit loss**: a pipe discharging into a tank throws away its whole velocity head, $K = 1$. A gradual conical diffuser with a small angle (about 6–8° included) recovers most of it instead.

### Minor is not always minor
In a long main, fittings add a few per cent to the friction. In compact plant piping, pump rooms and hydraulic power units, with a bend or a valve every few metres, they often cost **more than the pipe**. A throttled valve can swallow most of a pump's head — deliberately, when it is used to control the flow. In oil hydraulics, directional valves, filters and coolers are "minor" losses of several bar each, given by the maker as pressure-drop curves rather than as $K$ ([[orifice-equation]]).

> [!tip] Add all the coefficients along a line of one bore, $\\sum K$, then $h_m = \\sum K\\,V^2/2g$ — or turn them into pipe length ([[equivalent-length]]).

At low Reynolds numbers — viscous oil, small flows — $K$ rises well above the turbulent values, roughly as $1/Re$, and the tables no longer apply.
`,
  ideas: [
    'Fittings lose K velocity heads each: h_m = K V²/2g, because separated flow dissipates its excess kinetic energy.',
    'Exit into a tank: K = 1; sharp entrance: 0.5; bellmouth: about 0.04.',
    'A globe valve (K ≈ 10) loses fifty times as much as an open gate valve (0.2).',
    'Sudden expansion: K = (1 − A₁/A₂)², derived from momentum (Borda–Carnot).',
    'In short, fitting-rich lines, minor losses can exceed pipe friction.'
  ],
  pitfalls: [
    'Minor losses are always small — In pump rooms, plant piping and hydraulic units they often dominate; the name comes from long pipelines.',
    'The pressure always falls through a fitting — In a sudden expansion the pressure rises (velocity is recovered as pressure), just by less than Bernoulli would promise.',
    'K values are exact constants — They vary by ±30 % between makers and rise sharply at low Reynolds numbers.'
  ],
  formulas: [
    {
      name: 'Minor loss',
      expr: 'hm = K*V^2/(2*g)', tex: 'h_m = K\\,\\dfrac{V^2}{2g}',
      vars: {
        hm: { name: 'minor head loss', q: 'length', unit: 'm', tex: 'h_m' },
        K: { name: 'loss coefficient', value: 0.9 },
        V: { name: 'velocity in the pipe', q: 'speed', unit: 'm/s', value: 2 },
        g: { const: 'g' }
      },
      note: 'K for fully turbulent flow; V in the pipe the coefficient refers to.',
      practice: { unknowns: ['hm', 'K'] },
      stories: {
        hm: 'Water flows at {V} through a fitting with K = {K}. What head does it lose?',
        K: 'A valve passing water at {V} is measured to lose {hm} of head. What is its loss coefficient?'
      }
    },
    {
      name: 'Pressure drop across a fitting',
      expr: 'dp = K*rho*V^2/2', tex: '\\Delta p = K\\,\\dfrac{\\rho V^2}{2}',
      vars: {
        dp: { name: 'pressure drop', q: 'pressure', unit: 'kPa', tex: '\\Delta p' },
        K: { name: 'loss coefficient', value: 0.9 },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 998 },
        V: { name: 'velocity in the pipe', q: 'speed', unit: 'm/s', value: 2 }
      },
      stories: { dp: 'Water ({rho}) passes a fitting with K = {K} at {V}. What is the pressure drop?' }
    },
    {
      name: 'Sudden expansion (Borda–Carnot)',
      expr: 'K = (1 - (d1/d2)^2)^2', tex: 'K = \\left[1 - \\left(\\dfrac{d_1}{d_2}\\right)^2\\right]^2',
      vars: {
        K: { name: 'loss coefficient (on the upstream velocity)' },
        d1: { name: 'smaller (upstream) bore', q: 'length', unit: 'mm', value: 50, tex: 'd_1' },
        d2: { name: 'larger (downstream) bore', q: 'length', unit: 'mm', value: 80, tex: 'd_2' }
      },
      note: 'Use with the velocity in the smaller pipe. d₂ → ∞ gives the exit loss K = 1.',
      stories: { K: 'A pipe of {d1} bore opens suddenly into one of {d2}. What is the loss coefficient, based on the upstream velocity?' }
    }
  ],
  examples: [
    {
      title: 'Fittings on a pump discharge line',
      q: 'A 30 m steel line of 50 mm bore carries water at 2 m/s from a tank (sharp entrance) through four standard elbows ($K = 0.75$), a gate valve (0.2), a globe valve (10) and a swing check valve (2) into a second tank. Compare the minor and friction losses.',
      steps: [
        '$\\sum K = 0.5 + 4 \\times 0.75 + 0.2 + 10 + 2 + 1.0 = 16.7$ (the 1.0 is the exit).',
        '$V^2/2g = 4/19.61 = 0.204$ m, so $h_m = 16.7 \\times 0.204 = 3.41$ m.',
        'Friction: $Re = 2 \\times 0.05/1.004\\times10^{-6} = 9.96\\times10^4$, $f = 0.0218$; $h_f = 0.0218 \\times (30/0.05) \\times 0.204 = 2.67$ m.',
        'The fittings lose more than the pipe. Replacing the globe valve by a second gate valve cuts $\\sum K$ to 6.9 and $h_m$ to 1.41 m.'
      ],
      a: 'Minor losses 3.4 m against 2.7 m of pipe friction; the globe valve alone accounts for 2 m.'
    },
    {
      title: 'Pressure that rises in a loss',
      q: 'Water at 2 m/s in a 50 mm pipe enters a 100 mm pipe through a sudden expansion. What is the loss, and how does the pressure change?',
      steps: [
        '$K = (1 - 0.25)^2 = 0.5625$ on the upstream velocity; $h_m = 0.5625 \\times 0.204 = 0.115$ m, i.e. 1.12 kPa.',
        'Downstream velocity $V_2 = 2 \\times (50/100)^2 = 0.5$ m/s. Without losses Bernoulli would raise the pressure by $\\rho(V_1^2 - V_2^2)/2 = 998 \\times 3.75/2 = 1.87$ kPa.',
        'Net change: $1.87 - 1.12 = +0.75$ kPa. The pressure still rises, but only 40 % of the velocity head is recovered.'
      ],
      a: 'A loss of 0.115 m (1.1 kPa); the pressure rises by 0.75 kPa.'
    }
  ],
  quiz: [
    { q: 'What is the loss coefficient of a pipe discharging into a large tank?', answer: 1, tol: 0.05,
      why: 'All the kinetic energy of the jet is dissipated in the tank: K = 1 (the limit of the sudden expansion with A₂ → ∞).' },
    { q: 'Which fully open valve has by far the highest loss coefficient?', choices: ['gate valve', 'ball valve', 'globe valve', 'butterfly valve'], a: 2,
      why: 'In a globe valve the flow turns twice through a seat: K ≈ 6–10, against 0.05–0.5 for the others.' },
    { q: 'Minor losses are always small compared with pipe friction.', a: false,
      why: 'In short lines with many fittings — pump rooms, process plant, hydraulic power units — they often exceed the friction.' },
    { q: 'What is the loss coefficient of a sudden expansion from 40 mm to 80 mm bore (on the upstream velocity)?', answer: 0.5625, tol: 0.02,
      why: 'A₁/A₂ = (40/80)² = 0.25, so K = (1 − 0.25)² = 0.5625.' },
    { q: 'Rounding the sharp entrance from a tank into a bellmouth cuts its K from about 0.5 to about…', choices: ['0.4', '0.25', '0.04', '0'], a: 2,
      why: 'A well-rounded entrance avoids separation at the lip; K falls to 0.03–0.05.' }
  ],
  problems: [
    { q: 'A globe valve (K = 10) sits in a 25 mm line carrying water (ρ = 998 kg/m³) at 3 m/s. What pressure drop does it cause?', answer: 44.9, unit: 'kPa', tol: 0.02,
      steps: ['$\\Delta p = K\\rho V^2/2 = 10 \\times 998 \\times 9/2 = 44\\,900$ Pa = 44.9 kPa (0.45 bar).'] }
  ],
  applications: [
    'Pump suction and discharge piping, where fittings often dominate the system curve.',
    'Choosing valves: a globe valve for throttling, a gate, ball or butterfly valve where a low loss matters.',
    'Bellmouth intakes and diffusers in pumping stations, cooling towers and hydropower intakes.'
  ],
  history: 'The sudden-expansion loss is named after two eighteenth-century French engineers, Jean-Charles de Borda and Lazare Carnot, who analysed the losses of sudden changes of speed. Systematic tables of loss coefficients came with the growth of industrial piping in the twentieth century.',
  sim: { id: 'pipe-designer', params: { L: 40, elbows: 12, valve: 'globe', lift: 5 } }
},

{
  id: 'equivalent-length', parent: 'pipe-systems', title: 'Equivalent length', level: 2,
  short: 'A fitting with loss coefficient K loses as much as a length L_e = KD/f of straight pipe. Adding these lengths turns a whole line of pipe and fittings into one long pipe for a single Darcy–Weisbach calculation.',
  keywords: ['equivalent length', 'L/D', 'fittings', 'K method', 'Crane', 'minor losses', 'pipe length', 'fully turbulent friction factor'],
  prereq: ['minor-losses', 'darcy-weisbach'],
  related: ['pipe-sizing', 'line-sizing', 'friction-factor', 'pipes-series-parallel', 'system-curve'],
  body: `
Minor losses and pipe friction are both multiples of the velocity head, so one can be written as the other. A fitting with loss coefficient $K$ loses exactly as much as a length $L_e$ of straight pipe of the same bore:

$$f\\,\\frac{L_e}{D}\\,\\frac{V^2}{2g} = K\\,\\frac{V^2}{2g} \\quad\\Rightarrow\\quad L_e = \\frac{K\\,D}{f}$$

The whole line can then be treated as one long straight pipe:

$$h_f = f\\,\\frac{L + \\sum L_e}{D}\\,\\frac{V^2}{2g}$$

It is a bookkeeping trick, but a practical one: it lets a designer use one friction chart, see at a glance whether the fittings or the pipe dominate, and describe a pump-room layout as "12 m of pipe plus 25 m of fittings".

### Equivalent length in diameters
Because $K$ and $f$ are both nearly constant in fully turbulent flow, fittings are often listed by their **length in diameters**, $(L/D)_{eq}$, and the loss coefficient follows from the fully turbulent friction factor $f_T$ of clean steel pipe of that size, $K = f_T\\,(L/D)_{eq}$ — the scheme made popular by the Crane Company's long-lived technical paper on the flow of fluids through valves and fittings. Typical values:

| Fitting | $(L/D)_{eq}$ |
|---|---|
| Gate valve, fully open | 8 |
| Ball valve, fully open | 3 |
| 90° standard elbow | 30 |
| 90° long-radius elbow | 16–20 |
| 45° elbow | 16 |
| Tee, through the run / through the branch | 20 / 60 |
| Swing check valve | 50–100 |
| Globe valve, fully open | 340 |

So a globe valve in a 50 mm line costs as much as 17 m of pipe, and a standard elbow in a 200 mm line as much as 6 m.

### Handle with care
- $L_e = KD/f$ depends on the friction factor you assume. The same elbow is "worth" more metres of smooth pipe than of rough pipe, and more at high Reynolds numbers than at low. Converting with one $f$ and then calculating with another brings errors of 10–20 %.
- In laminar and transitional flow — viscous oils — neither a fixed $K$ nor a fixed $(L/D)_{eq}$ holds; refined correlations (two- and three-constant $K$ methods) or the maker's pressure-drop curves are needed.
- Equivalent lengths belong to one bore. A line with several diameters must be split into sections, or its lengths converted to one reference diameter with the $D^5$ rule ([[pipes-series-parallel]]).

> [!key] Fittings and pipe friction are paid in the same currency — velocity heads. $L_e = KD/f$ converts between them.
`,
  ideas: [
    'A fitting with loss coefficient K is equivalent to L_e = KD/f of straight pipe of the same bore.',
    'Adding equivalent lengths turns a line into one pipe: h_f = f (L + ΣL_e)/D · V²/2g.',
    'Tables often give (L/D)_eq; then K = f_T (L/D)_eq with the fully turbulent f of clean pipe.',
    'Equivalent lengths depend on the assumed f and on the bore; they fail in laminar flow.'
  ],
  pitfalls: [
    'An elbow always equals a fixed number of metres of pipe — It equals a fixed number of diameters (roughly), so it is worth ten times more metres in a pipe ten times wider.',
    'Equivalent lengths work for oil lines too — In laminar flow K is not constant; use the component makers’ pressure-drop data.'
  ],
  formulas: [
    {
      name: 'Equivalent length of a fitting',
      expr: 'Le = K*D/f', tex: 'L_e = \\dfrac{K D}{f}',
      vars: {
        Le: { name: 'equivalent length', q: 'length', unit: 'm', tex: 'L_e' },
        K: { name: 'loss coefficient', value: 0.9 },
        D: { name: 'inside diameter', q: 'length', unit: 'mm', value: 100 },
        f: { name: 'Darcy friction factor', value: 0.018 }
      },
      practice: { unknowns: ['Le', 'K'] },
      stories: {
        Le: 'An elbow with K = {K} sits in a pipe of {D} bore where f = {f}. How long a straight pipe would lose the same?',
        K: 'A fitting in a {D} line (f = {f}) is equivalent to {Le} of pipe. What is its loss coefficient?'
      }
    },
    {
      name: 'Head loss with equivalent lengths',
      expr: 'hf = f*(L + Le)/D*V^2/(2*g)', tex: 'h_f = f\\,\\dfrac{L + L_e}{D}\\,\\dfrac{V^2}{2g}',
      vars: {
        hf: { name: 'total head loss', q: 'length', unit: 'm', tex: 'h_f' },
        f: { name: 'Darcy friction factor', value: 0.018 },
        L: { name: 'length of straight pipe', q: 'length', unit: 'm', value: 50 },
        Le: { name: 'total equivalent length of the fittings', q: 'length', unit: 'm', value: 5, tex: 'L_e' },
        D: { name: 'inside diameter', q: 'length', unit: 'mm', value: 100 },
        V: { name: 'mean velocity', q: 'speed', unit: 'm/s', value: 1.5 },
        g: { const: 'g' }
      },
      stories: { hf: 'A line of {D} bore has {L} of pipe and fittings equivalent to {Le}; f = {f} and the water moves at {V}. What is the total head loss?' }
    }
  ],
  examples: [
    {
      title: 'The pump line in pipe metres',
      q: 'The 30 m line of 50 mm bore in the minor-loss example has fittings with $\\sum K = 16.7$ and $f = 0.0218$. Express the fittings as an equivalent length.',
      steps: [
        '$L_e = \\sum K\\,D/f = 16.7 \\times 0.05/0.0218 = 38$ m.',
        'The line behaves like $30 + 38 = 68$ m of straight pipe: more than half of its loss is in the fittings.',
        'Check: $h = 0.0218 \\times (68/0.05) \\times 0.204 = 6.1$ m, the sum of 2.7 m of friction and 3.4 m of fittings.'
      ],
      a: 'About 38 m of equivalent pipe, so 68 m in all.'
    },
    {
      title: 'From L/D to K',
      q: 'A standard elbow has $(L/D)_{eq} = 30$. What is its equivalent length in a 200 mm line, and its $K$ if the fully turbulent friction factor is $f_T = 0.015$?',
      steps: ['$L_e = 30 \\times 0.2 = 6$ m.', '$K = f_T (L/D)_{eq} = 0.015 \\times 30 = 0.45$.'],
      a: '6 m of pipe; K ≈ 0.45.'
    }
  ],
  quiz: [
    { q: 'The equivalent length of a fitting depends on the friction factor assumed for the pipe.', a: true,
      why: 'L_e = KD/f: the same K is worth more metres of a low-friction pipe than of a rough one.' },
    { q: 'A globe valve with (L/D)_eq = 340 in a 50 mm line is equivalent to about how many metres of pipe?', answer: 17, unit: 'm', tol: 0.02,
      why: '340 × 0.05 m = 17 m.' },
    { q: 'The same elbow (K = 0.9, f = 0.02) is fitted in a 20 mm line and in a 200 mm line. Its equivalent length…', choices: ['is the same in both', 'is ten times longer in the 200 mm line', 'is ten times longer in the 20 mm line', 'depends only on K'], a: 1,
      why: 'L_e = KD/f is proportional to the bore: 0.9 m against 9 m.' }
  ],
  problems: [
    { q: 'The fittings of an 80 mm line add up to ΣK = 12, and f = 0.02. What is their equivalent length?', answer: 48, unit: 'm', tol: 0.02,
      steps: ['$L_e = 12 \\times 0.08/0.02 = 48$ m.'] }
  ],
  applications: [
    'Quick hand calculations of pump suction and discharge lines.',
    'Pipe-sizing tables and software that add "equivalent metres" for fittings.',
    'Comparing layouts: how much a rerouted line with fewer bends saves.'
  ],
  sim: { id: 'pipe-designer', params: { L: 60, elbows: 8 } }
},

{
  id: 'pipes-series-parallel', parent: 'pipe-systems', title: 'Pipes in series and parallel', level: 2,
  short: 'Pipes in series carry the same flow and their head losses add; pipes in parallel share the same head loss and their flows add. Because loss grows with the square of the flow, the flow splits so that every branch loses the same head.',
  keywords: ['series pipes', 'parallel pipes', 'flow split', 'looping', 'equivalent pipe', 'pipe resistance', 'branch', 'bypass', 'compound pipe'],
  prereq: ['darcy-weisbach', 'continuity-equation', 'minor-losses'],
  related: ['pipe-networks', 'pumps-series-parallel', 'system-curve', 'operating-point', 'electronics:series-parallel'],
  body: `
Real pipelines are seldom one pipe. A main may change bore along its route; a second pipe may be laid beside an old one to carry more water; a bypass may run round a meter or a heat exchanger. Two rules borrowed from electric circuits handle all of it — with the twist that the "resistance" of a pipe grows with the flow.

### A pipe as a resistance
Darcy–Weisbach written with the flow is $h = r\\,Q^2$, with the pipe's **resistance**

$$r = \\frac{8 f L}{\\pi^2 g D^5} \\qquad (\\text{s}^2/\\text{m}^5)$$

plus $8\\sum K/(\\pi^2 g D^4)$ for its fittings. Head plays the part of voltage and flow of current, but the law is quadratic, not linear ([[electronics:series-parallel|compare resistors]]).

### In series: same flow, losses add
Pipes joined end to end carry the same flow ([[continuity-equation|continuity]]), and their head losses add:

$$h = h_1 + h_2 + \\dots = (r_1 + r_2 + \\dots)\\,Q^2$$

The narrowest pipe usually dominates. With equal friction factors, a length $L_2$ of bore $D_2$ can be replaced by an equivalent length of bore $D_1$, namely $L_2(D_1/D_2)^5$ — so 100 m of 100 mm pipe "counts as" 760 m of 150 mm pipe.

### In parallel: same head, flows add
Pipes that leave one junction and meet again at another share the **same head loss**, because each junction has one head. The flow divides until that is true:

$$h_1 = h_2 = h, \\qquad Q = Q_1 + Q_2 = \\sqrt{h/r_1} + \\sqrt{h/r_2}$$

so $1/\\sqrt{r_p} = 1/\\sqrt{r_1} + 1/\\sqrt{r_2}$. With equal friction factors the split depends only on the geometry:

$$\\frac{Q_1}{Q_2} = \\sqrt{\\frac{r_2}{r_1}} = \\sqrt{\\left(\\frac{D_1}{D_2}\\right)^5 \\frac{L_2}{L_1}}$$

A wider branch takes far more than its share of the area: a pipe with twice the bore carries $2^{2.5} = 5.7$ times the flow at the same head loss. Two identical pipes in parallel carry the flow of one at a quarter of the head loss; laying a second pipe along a main in this way (**looping** or duplicating) is a standard way to raise the capacity of a water system.

When the friction factors differ, or a branch contains a valve, the split is found by iteration: guess it, compute each branch's head loss, move flow towards the branch with the smaller loss, and repeat — or, as a computer does, solve $h_1(Q_1) = h_2(Q - Q_1)$ by bisection.

### As curves
Each pipe has a curve of head loss against flow. In **series** the curves add vertically (the same $Q$, heads summed); in **parallel** they add horizontally (the same $h$, flows summed). Pump curves combine the same way ([[pumps-series-parallel]]), and where the combined pump and system curves cross is the [[operating-point]].

> [!key] Series: the flow is common and the heads add. Parallel: the head is common and the flows add. Closed loops of pipes lead to [[pipe-networks|networks]].
`,
  ideas: [
    'A pipe behaves like a nonlinear resistance: h = rQ² with r = 8fL/(π²gD⁵).',
    'Series: same flow, head losses add; the narrowest pipe dominates.',
    'Parallel: same head loss, flows add; the split follows Q ∝ √(D⁵/L).',
    'Two equal pipes in parallel carry the same flow at a quarter of the head loss.'
  ],
  pitfalls: [
    'In parallel pipes the flow divides in proportion to their areas — It divides so that the head losses are equal; with equal f it goes as D^2.5 for equal lengths, so the wide pipe takes much more than its area share.',
    'Pipe resistances combine exactly like electrical resistors — Series resistances do add, but in parallel it is 1/√r that adds, because h ∝ Q².'
  ],
  formulas: [
    {
      name: 'Series pipes: equivalent length in one bore',
      expr: 'Leq = L1 + L2*(D1/D2)^5', tex: 'L_{eq} = L_1 + L_2\\left(\\dfrac{D_1}{D_2}\\right)^5',
      vars: {
        Leq: { name: 'equivalent length in bore D₁', q: 'length', unit: 'm', tex: 'L_{eq}' },
        L1: { name: 'length of pipe 1', q: 'length', unit: 'm', value: 200, tex: 'L_1' },
        L2: { name: 'length of pipe 2', q: 'length', unit: 'm', value: 100, tex: 'L_2' },
        D1: { name: 'bore of pipe 1 (reference)', q: 'length', unit: 'mm', value: 150, tex: 'D_1' },
        D2: { name: 'bore of pipe 2', q: 'length', unit: 'mm', value: 100, tex: 'D_2' }
      },
      note: 'Assumes the same friction factor in both pipes.',
      stories: { Leq: 'A line consists of {L1} of {D1} pipe followed by {L2} of {D2} pipe. What length of {D1} pipe would lose the same head at the same flow?' }
    },
    {
      name: 'Parallel pipes: flow split',
      expr: 'Q1 = Q/(1 + sqrt((D2/D1)^5*L1/L2))', tex: 'Q_1 = \\dfrac{Q}{1 + \\sqrt{(D_2/D_1)^5\\,L_1/L_2}}',
      vars: {
        Q1: { name: 'flow in pipe 1', q: 'flowrate', unit: 'L/s', tex: 'Q_1' },
        Q: { name: 'total flow', q: 'flowrate', unit: 'L/s', value: 50 },
        D1: { name: 'bore of pipe 1', q: 'length', unit: 'mm', value: 200, tex: 'D_1' },
        D2: { name: 'bore of pipe 2', q: 'length', unit: 'mm', value: 150, tex: 'D_2' },
        L1: { name: 'length of pipe 1', q: 'length', unit: 'm', value: 500, tex: 'L_1' },
        L2: { name: 'length of pipe 2', q: 'length', unit: 'm', value: 400, tex: 'L_2' }
      },
      note: 'Equal friction factors, minor losses neglected. Pipe 2 carries the rest, Q − Q₁.',
      practice: { unknowns: ['Q1', 'D2'] },
      stories: {
        Q1: 'A flow of {Q} divides between pipe 1 ({L1}, {D1} bore) and pipe 2 ({L2}, {D2} bore). How much goes through pipe 1?',
        D2: 'Of a total {Q}, pipe 1 ({L1} long, {D1} bore) should carry {Q1}. What bore must the parallel pipe 2, {L2} long, have?'
      }
    },
    {
      name: 'Parallel pipes: combined resistance',
      expr: '1/sqrt(rp) = 1/sqrt(r1) + 1/sqrt(r2)', tex: '\\dfrac{1}{\\sqrt{r_p}} = \\dfrac{1}{\\sqrt{r_1}} + \\dfrac{1}{\\sqrt{r_2}}',
      vars: {
        rp: { name: 'resistance of the pair', unit: 's²/m⁵', tex: 'r_p' },
        r1: { name: 'resistance of pipe 1', unit: 's²/m⁵', value: 2583, tex: 'r_1' },
        r2: { name: 'resistance of pipe 2', unit: 's²/m⁵', value: 8708, tex: 'r_2' }
      },
      note: 'Each pipe obeys h = rQ²; the pair behaves as one pipe with resistance r_p.',
      stories: { rp: 'Two pipes with resistances {r1} and {r2} run in parallel. What single resistance are they equivalent to?' }
    }
  ],
  examples: [
    {
      title: 'Two pipes in series',
      q: 'A flow of 20 L/s passes 200 m of 150 mm pipe and then 100 m of 100 mm pipe, with $f = 0.02$ in both. Find the head loss in each and the equivalent length in 150 mm pipe.',
      steps: [
        'Velocities: 1.13 m/s and 2.55 m/s.',
        '$h_1 = 0.02 \\times (200/0.15) \\times 1.13^2/19.61 = 1.74$ m; $h_2 = 0.02 \\times (100/0.1) \\times 2.55^2/19.61 = 6.61$ m.',
        'Total 8.35 m — the short narrow pipe loses almost four times as much as the long wide one.',
        'Equivalent length: $L_{eq} = 200 + 100 \\times 1.5^5 = 959$ m of 150 mm pipe, which gives the same 8.35 m.'
      ],
      a: '1.74 m + 6.61 m = 8.35 m; equivalent to 959 m of 150 mm pipe.'
    },
    {
      title: 'A loop pipe beside a main',
      q: 'Between two junctions, 80 L/s is shared by pipe 1 (500 m, 200 mm) and pipe 2 (400 m, 150 mm), both with $f = 0.02$. How does the flow split, and what is the head loss? What would pipe 1 lose alone?',
      steps: [
        '$Q_1/Q_2 = \\sqrt{(200/150)^5 \\times 400/500} = \\sqrt{4.21 \\times 0.8} = 1.836$.',
        '$Q_1 = 80 \\times 1.836/2.836 = 51.8$ L/s; $Q_2 = 28.2$ L/s.',
        '$r_1 = 8 \\times 0.02 \\times 500/(\\pi^2 \\times 9.81 \\times 0.2^5) = 2583$ s²/m⁵, so $h = 2583 \\times 0.0518^2 = 6.93$ m (pipe 2 gives the same, as it must).',
        'Pipe 1 alone with all 80 L/s: $h = 2583 \\times 0.08^2 = 16.5$ m.'
      ],
      a: '51.8 L/s and 28.2 L/s; 6.9 m of head loss instead of 16.5 m.'
    }
  ],
  quiz: [
    { q: 'A single pipe is replaced by two identical pipes in parallel, carrying the same total flow. The head loss becomes…', choices: ['half as large', 'a quarter as large', 'the same', 'twice as large'], a: 1,
      why: 'Each pipe carries half the flow, and h ∝ Q²: (1/2)² = 1/4.' },
    { q: 'Two parallel pipes of equal length, one of twice the bore of the other, share a flow (equal f). The wider pipe carries…', choices: ['twice the flow of the narrow one', 'four times', 'about 5.7 times', '32 times'], a: 2,
      why: 'Q ∝ √(D⁵/L): √(2⁵) = 5.66.' },
    { q: 'In series, the same flow passes through each pipe and their head losses add.', a: true,
      why: 'Continuity gives the same Q; energy losses along the path add.' },
    { q: 'Two pipes each with r = 400 s²/m⁵ run in parallel. What is their combined resistance in s²/m⁵?', answer: 100, tol: 0.02,
      why: '1/√r_p = 2/20 = 0.1, so r_p = 100 — a quarter of each.' }
  ],
  applications: [
    'Looping (duplicating) water mains to raise their capacity.',
    'Bypasses round meters, pressure-reducing valves and heat exchangers.',
    'Manifolds feeding tubes of a heat exchanger or a cooling circuit in parallel.',
    'Compound pipelines whose bore steps down as flow is taken off along the route.'
  ],
  sim: 'pipe-parallel'
},

{
  id: 'pipe-networks', parent: 'pipe-systems', title: 'Pipe networks and Hardy Cross', level: 3,
  short: 'Looped networks such as town water systems are solved with continuity at every junction and zero net head loss round every loop. Hardy Cross’s method corrects the flow round each loop in turn until the loops balance; modern programs solve all pipes at once.',
  keywords: ['pipe network', 'Hardy Cross', 'loop', 'water distribution', 'EPANET', 'gradient method', 'node', 'continuity', 'loop correction', 'Kirchhoff', 'Newton–Raphson'],
  prereq: ['pipes-series-parallel', 'continuity-equation', 'math:newtons-method'],
  related: ['water-supply', 'hazen-williams', 'roughness-ageing', 'electronics:kirchhoffs-laws', 'electronics:nodal-analysis', 'math:systems-of-equations'],
  body: `
A town's water flows through a mesh of pipes, not a tree. Loops cost more pipe, but they give every street two routes of supply, so a burst or a closed valve does not cut anyone off, and they share the load between parallel paths. The price is that the flow in each pipe is no longer obvious: it has to be computed.

### The equations
A network obeys two sets of laws, the hydraulic twins of [[electronics:kirchhoffs-laws|Kirchhoff's laws]]:
1. **Continuity at every node**: the flow in equals the flow out plus the demand drawn off at the node.
2. **Energy round every loop**: going round a closed loop you must come back to the same head, so the signed head losses add up to zero, $\\sum \\pm h_i = 0$.

With $h = r\\,Q|Q|$ (Darcy–Weisbach; $h = r\\,Q|Q|^{0.852}$ with Hazen–Williams) the loop equations are nonlinear, so they are solved by iteration. A network with $N$ nodes and $P$ pipes has $P - N + 1$ independent loops.

### The Hardy Cross method
In 1936 Hardy Cross, a professor of structural engineering at the University of Illinois, published a hand method that engineers used for half a century:
1. Guess a flow in every pipe that **satisfies continuity at every node**. Any such guess will do, however poor.
2. For each loop, add up the head losses, counting clockwise flow as positive. If the loop is balanced the sum is zero. If not, the correction that would balance it — one step of [[math:newtons-method|Newton's method]] for that loop alone — is

$$\\Delta Q = -\\frac{\\sum r\\,Q|Q|^{n-1}}{n\\sum r\\,|Q|^{n-1}} = -\\frac{\\sum h}{n\\sum |h/Q|}$$

   with $n = 2$ for Darcy–Weisbach and 1.852 for Hazen–Williams.
3. Add $\\Delta Q$ to every pipe of the loop (clockwise positive). A pipe shared by two loops receives both corrections, each with its own sign. Adding the same amount all round a loop leaves continuity at every node untouched.
4. Repeat until the corrections are negligible — usually after a handful of rounds.

The worked example below balances a two-loop network, and the simulation steps through it.

### Beyond Hardy Cross
Hardy Cross corrects one loop at a time and converges slowly in large networks. Modern programs — EPANET, released by the US Environmental Protection Agency in 1993, is the best known — use the **global gradient method** of Todini and Pilati (1988), a Newton–Raphson solution of all node heads and pipe flows together. They add pumps with their curves, tanks, pressure-reducing and check valves, step through a day of changing demand (extended-period simulation) and even track water quality. Inside every pipe the physics is still Darcy–Weisbach or Hazen–Williams.

> [!note] A network model is only as good as its data: the demands, the roughness of pipes that have aged ([[roughness-ageing]]), and valves recorded as open that have been shut for years. Utilities calibrate their models against pressures and flows measured in the field.
`,
  ideas: [
    'A network satisfies continuity at every node and zero net head loss round every loop.',
    'Head loss is nonlinear in flow (h = rQ|Q|), so the loop equations are solved by iteration.',
    'Hardy Cross: start from flows that satisfy continuity, then correct each loop by ΔQ = −Σh/(nΣ|h/Q|) until the loops balance.',
    'Shared pipes receive the corrections of both loops; continuity is never disturbed.',
    'Modern software (such as EPANET) solves all heads and flows at once by the gradient method.'
  ],
  pitfalls: [
    'The initial guess of flows can be anything — It must satisfy continuity at every node; the loop corrections only fix the energy balance.',
    'A pipe shared by two loops gets only one correction — It gets both, each with the sign the pipe has in that loop.',
    'Once the loops balance, the pressures are known too — The flows are; pressures then follow by walking from a node of known head and subtracting the losses (and adding elevation changes).'
  ],
  formulas: [
    {
      name: 'Pipe resistance (Darcy–Weisbach)',
      expr: 'r = 8*f*L/(pi^2*g*D^5)', tex: 'r = \\dfrac{8 f L}{\\pi^2 g D^5}',
      vars: {
        r: { name: 'pipe resistance', unit: 's²/m⁵' },
        f: { name: 'Darcy friction factor', value: 0.02 },
        L: { name: 'pipe length', q: 'length', unit: 'm', value: 500 },
        D: { name: 'inside diameter', q: 'length', unit: 'mm', value: 200 },
        g: { const: 'g' }
      },
      note: 'With it, h = rQ² for Q in m³/s and h in metres.',
      stories: { r: 'What is the resistance of a pipe {L} long with a bore of {D} and f = {f}?' }
    },
    {
      name: 'Head loss from the resistance',
      expr: 'h = r*Q^2', tex: 'h = r\\,Q^2',
      vars: {
        h: { name: 'head loss', q: 'length', unit: 'm' },
        r: { name: 'pipe resistance', unit: 's²/m⁵', value: 2583 },
        Q: { name: 'flow rate', q: 'flowrate', unit: 'L/s', value: 30 }
      },
      stories: { h: 'A pipe with a resistance of {r} carries {Q}. What head does it lose?', Q: 'A pipe with a resistance of {r} has {h} across it. What flow passes?' }
    },
    {
      name: 'Hardy Cross loop correction',
      expr: 'dQ = -sh/(n*sq)', tex: '\\Delta Q = -\\dfrac{\\Sigma_h}{n\\,\\Sigma_{h/Q}}',
      vars: {
        dQ: { name: 'loop flow correction (clockwise positive)', q: 'flowrate', unit: 'L/s', signed: true, tex: '\\Delta Q' },
        sh: { name: 'sum of signed head losses round the loop', q: 'length', unit: 'm', value: -1.185, signed: true, tex: '\\Sigma_h' },
        n: { name: 'exponent of the head-loss law (2 or 1.852)', value: 2 },
        sq: { name: 'sum of |h/Q| round the loop', unit: 's/m²', value: 94.5, tex: '\\Sigma_{h/Q}' }
      },
      note: 'Σ_h = Σ ±h (clockwise flows positive); Σ_{h/Q} = Σ |h/Q| = Σ r|Q| for n = 2. Apply ΔQ to every pipe of the loop.',
      practice: { unknowns: ['dQ'] },
      stories: { dQ: 'Round a loop the signed head losses add up to {sh}, and the sum of |h/Q| is {sq}; the loss law has n = {n}. What correction should be added to the clockwise flows?' }
    }
  ],
  examples: [
    {
      title: 'Balancing a two-loop network',
      q: 'Six junctions form two square loops side by side: A–B–C along the top, F–E–D along the bottom, joined by the verticals A–F, B–E and C–D. Water enters at A (120 L/s) and is drawn off at B (20), C (30), D (40) and F (30 L/s). The pipes, with $f = 0.02$: 1 = AB (300 m, 300 mm), 2 = BC (400 m, 200 mm), 3 = AF (400 m, 250 mm), 4 = BE (300 m, 200 mm), 5 = CD (300 m, 150 mm), 6 = FE (300 m, 200 mm), 7 = ED (400 m, 200 mm). Find the flows.',
      steps: [
        'Resistances $r = 8fL/(\\pi^2 g D^5)$, rounded: $r_1 = 200$, $r_2 = 2070$, $r_3 = 680$, $r_4 = 1550$, $r_5 = 6530$, $r_6 = 1550$, $r_7 = 2070$ s²/m⁵.',
        'A first guess that satisfies continuity at every node (each flow in the direction of the pipe\'s name, A→B, B→C, …): $Q_1 = 70$, $Q_2 = 40$, $Q_3 = 50$, $Q_4 = 10$, $Q_5 = 10$, $Q_6 = 20$, $Q_7 = 30$ L/s.',
        'Loop I, A→B→E→F→A clockwise: pipes 1 and 4 run clockwise, 6 and 3 against. $\\sum h = 0.980 + 0.155 - 0.620 - 1.700 = -1.185$ m; $\\sum 2r|Q| = 28.0 + 31.0 + 62.0 + 68.0 = 189.0$ s/m²; $\\Delta Q_I = +1.185/189.0 = +6.27$ L/s.',
        'Loop II, B→C→D→E→B: pipes 2 and 5 clockwise, 7 and 4 against. $\\sum h = 3.312 + 0.653 - 1.863 - 0.155 = +1.947$ m; $\\sum 2r|Q| = 451.4$ s/m²; $\\Delta Q_{II} = -4.31$ L/s.',
        'Apply both. Pipe 4 is clockwise in loop I and anticlockwise in loop II, so $Q_4 = 10 + 6.27 + 4.31 = 20.58$ L/s. New flows: 76.27, 35.69, 43.73, 20.58, 5.69, 13.73, 34.31 L/s.',
        'Repeat: the corrections become −1.16 and +0.58 L/s, then +0.18 and −0.17, then below 0.05 L/s.',
        'Final flows: $Q_1 = 75.2$, $Q_2 = 36.1$, $Q_3 = 44.8$, $Q_4 = 19.1$, $Q_5 = 6.1$, $Q_6 = 14.8$, $Q_7 = 33.9$ L/s.',
        'Check: the head falls by the same 4.08 m from A to D along every route — A-B-C-D: 1.13 + 2.70 + 0.24; A-F-E-D: 1.36 + 0.34 + 2.38.'
      ],
      a: 'After four rounds: 75.2, 36.1, 44.8, 19.1, 6.1, 14.8 and 33.9 L/s in pipes 1–7; 4.08 m of head lost between A and D.'
    }
  ],
  quiz: [
    { q: 'Why must the first guess of flows satisfy continuity at every node?', choices: ['because Hardy Cross corrections never change the balance at a node', 'because the method would otherwise diverge', 'because head losses depend on continuity', 'it need not — any numbers will do'], a: 0,
      why: 'Each loop correction adds the same flow into and out of every node of the loop, so it can fix the energy balance but never repair continuity.' },
    { q: 'The Hardy Cross correction for one loop is one step of…', choices: ['the bisection method', 'Newton’s method', 'Euler’s method', 'Gaussian elimination'], a: 1,
      why: 'ΔQ = −F(Q)/F′(Q) with F the loop’s head-loss sum: Newton’s method for that loop alone.' },
    { q: 'A pipe shared by two loops receives the corrections of both loops.', a: true,
      why: 'Each loop correction applies to every pipe of that loop, with the sign the pipe has in that loop.' },
    { q: 'In the analogy with electric circuits, the loop equation Σ±h = 0 corresponds to…', choices: ['Ohm’s law', 'Kirchhoff’s current law', 'Kirchhoff’s voltage law', 'the power law'], a: 2,
      why: 'Head plays the part of voltage; going round a loop the "voltage drops" add to zero.' },
    { q: 'Round a loop, Σh = +0.8 m and Σ|h/Q| = 40 s/m², with n = 2. What is the correction ΔQ in L/s?', answer: -10, unit: 'L/s', tol: 0.02,
      why: 'ΔQ = −0.8/(2 × 40) = −0.01 m³/s = −10 L/s: the clockwise flows are too large.' }
  ],
  applications: [
    'Water-distribution design and operation: pressures at every house, fire flows, the effect of closing a valve.',
    'District heating and cooling networks, gas distribution and sprinkler grids.',
    'Planning which mains to reinforce when a town grows.'
  ],
  history: 'Hardy Cross (1885–1959) invented the moment-distribution method for building frames in 1930 and applied the same idea of successive corrections to pipe networks in 1936. For fifty years the method was done by hand, with tables and slide rules, until computers and then the gradient method took over.',
  sim: 'pipe-hardy-cross'
},

{
  id: 'pipe-sizing', parent: 'pipe-systems', title: 'Sizing a pipe', level: 2,
  short: 'Choosing a pipe diameter trades the cost of a bigger pipe against the energy lost in a smaller one. Designers start from a typical velocity — about 1–2 m/s for water, 0.5–1.5 m/s for oil suction, 2–4 m/s return, 3–6 m/s pressure — then check head loss, surge, noise and cost.',
  keywords: ['pipe sizing', 'economic diameter', 'velocity guideline', 'line sizing', 'suction line', 'pressure line', 'return line', 'Bresse', 'pumping energy', 'nominal size', 'DN'],
  prereq: ['darcy-weisbach', 'minor-losses', 'pump-head-power'],
  related: ['line-sizing', 'hoses-fittings', 'water-hammer', 'joukowsky-surge', 'system-curve', 'npsh', 'energy-losses-heat', 'equivalent-length', 'math:optimization'],
  body: `
Choosing a diameter is an economic decision dressed as a hydraulic one. A small pipe is cheap to buy and lay but expensive to run: friction loss grows as $D^{-5}$ at a given flow, so the pump works harder every hour of the system's life. A large pipe costs more at the start, and water that moves too slowly lets sediment settle and, in drinking-water mains, ages in the pipe. Somewhere between lies an **economic diameter**.

### Start from a velocity
Experience has condensed that optimum into velocity ranges. Pick a velocity, compute $D = \\sqrt{4Q/\\pi V}$, then round to a real pipe size:

| Service | Typical velocity |
|---|---|
| Water mains and building services | 1–2 m/s |
| Pump suction, water | 0.6–1.5 m/s |
| Pump discharge, short lines, water | 1.5–3 m/s |
| Gravity sewers (self-cleansing) | at least 0.6–0.75 m/s |
| Hydraulic oil, suction line | 0.5–1.5 m/s |
| Hydraulic oil, return line | 2–4 m/s |
| Hydraulic oil, pressure line | 3–6 m/s (upper end at high pressure) |

These are typical guideline values; companies and standards publish their own. In oil hydraulics the suction line is the strictest, because the pump inlet must not see a pressure low enough to release air or cavitate ([[npsh]]). Pressure lines tolerate more velocity because a few bar of loss is small beside 200 bar — although every bar lost is heat ([[energy-losses-heat]], [[line-sizing]]).

### Then check
- **Head loss** against the pump head available (or the fall available, for gravity mains) — per 100 m and in total, fittings included ([[equivalent-length]]).
- **Surge**: stopping a column of water suddenly raises its pressure by about 1.3–1.4 MPa (13–14 bar) for every m/s stopped in a steel main ([[joukowsky-surge]]). High velocities mean violent [[water-hammer]].
- **Noise, erosion and wear** at high velocity; **sediment and water age** at low velocity.
- **Real bores**: nominal sizes are not inside diameters. A DN 100 steel pipe of schedule 40 has a bore of 102 mm; a 110 mm PE pipe of SDR 11 only 90 mm. Always calculate with the actual bore.

### The economic diameter
For a pumped main, the yearly cost is the capital cost of the pipe, turned into a yearly charge, plus the energy to overcome friction:

$$E = \\frac{\\rho g\\,Q\\,h_f\\,t}{\\eta}$$

As $D$ grows the capital charge rises (roughly as $D$ to $D^{1.5}$) and the energy falls (as $D^{-5}$), so the total has a flat minimum ([[math:optimization|an optimisation]]). An old rule of thumb, Bresse's formula $D \\approx k\\sqrt{Q}$ (SI units, $k \\approx 1$–1.3), puts the optimum velocity near 1 m/s; dearer energy and longer running hours push it towards larger pipes. Because the minimum is flat, the next standard size up usually costs little extra and buys margin for growth and [[roughness-ageing|ageing]].

> [!warn] A line must also hold the pressure. Hydraulic hoses and tubes are chosen for the maximum working pressure including surges, with the maker's safety factor ([[hoses-fittings]]). A hose that bursts can whip violently and spray oil hot enough to burn, and a pinhole jet can inject oil through the skin — an injury that looks small but needs emergency surgery: seek emergency medical care at once. Before any work on a line, stop the pump, release the pressure, discharge accumulators, support raised loads and lock out the machine; never feel for a leak with your hand. The general safety requirements for hydraulic systems are set out in ISO 4413:2010.
`,
  ideas: [
    'Pipe size is a trade: bigger pipes cost more to buy, smaller pipes cost more to run (h_f ∝ D⁻⁵).',
    'Start from a typical velocity: water 1–2 m/s; oil suction 0.5–1.5, return 2–4, pressure 3–6 m/s.',
    'Then check head loss, NPSH on suction lines, surge pressure, noise and sediment.',
    'The economic diameter minimises capital plus energy cost; the minimum is flat, so rounding up is cheap.',
    'Nominal sizes are not bores: calculate with the real inside diameter.'
  ],
  pitfalls: [
    'A smaller pipe saves money — Only at the start: the extra friction is paid for in energy every hour for decades.',
    'Faster is always worse — Too slow lets sediment settle and water age in mains; sewers need a self-cleansing velocity.',
    'DN 100 means a 100 mm bore — The bore depends on the pipe standard and wall thickness; for plastic pipes it can be much smaller than the nominal size.'
  ],
  formulas: [
    {
      name: 'Diameter from flow and velocity',
      expr: 'D = sqrt(4*Q/(pi*V))', tex: 'D = \\sqrt{\\dfrac{4Q}{\\pi V}}',
      vars: {
        D: { name: 'inside diameter', q: 'length', unit: 'mm' },
        Q: { name: 'flow rate', q: 'flowrate', unit: 'm³/h', value: 36 },
        V: { name: 'design velocity', q: 'speed', unit: 'm/s', value: 1.5 }
      },
      note: 'Round up to the next real bore, then check the velocity again.',
      practice: { unknowns: ['D', 'V'] },
      stories: {
        D: 'A line must carry {Q} at about {V}. What inside diameter does it need?',
        V: 'A line with a bore of {D} carries {Q}. What is the mean velocity?'
      }
    },
    {
      name: 'Yearly pumping energy lost to friction',
      expr: 'E = rho*g*Q*hf*t/eta', tex: 'E = \\dfrac{\\rho g Q h_f t}{\\eta}',
      vars: {
        E: { name: 'electrical energy per year', q: 'energy', unit: 'kWh' },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 998 },
        g: { const: 'g' },
        Q: { name: 'flow rate', q: 'flowrate', unit: 'm³/h', value: 36 },
        hf: { name: 'friction head loss', q: 'length', unit: 'm', value: 10, tex: 'h_f' },
        t: { name: 'running time per year', q: 'time', unit: 'h', value: 4000 },
        eta: { name: 'pump and motor efficiency', value: 0.7 }
      },
      stories: {
        E: 'A pump delivers {Q} for {t} a year against {hf} of pipe friction, with an overall efficiency of {eta}. How much electricity does the friction cost?',
        hf: 'A budget allows {E} a year for friction in a line carrying {Q} for {t} (efficiency {eta}). What head loss is acceptable?'
      }
    },
    {
      name: 'Bresse’s rule for the economic diameter',
      expr: 'D = k*sqrt(Q)', tex: 'D = k\\sqrt{Q}',
      vars: {
        D: { name: 'economic diameter', q: false, unit: 'm' },
        k: { name: 'Bresse coefficient (SI, about 1–1.3)', value: 1.2 },
        Q: { name: 'flow rate', q: false, unit: 'm³/s', value: 0.01 }
      },
      note: 'An empirical rule for pumped water mains, in SI units only (Q in m³/s, D in m). It implies V = 4/(πk²), about 0.9 m/s for k = 1.2.',
      stories: { D: 'By Bresse’s rule with k = {k}, what diameter suits a pumped main carrying {Q}?' }
    }
  ],
  examples: [
    {
      title: 'Choosing a water line',
      q: 'A pump must deliver 36 m³/h (10 L/s) of water through 500 m of commercial-steel pipe for 4000 h a year, with an overall efficiency of 70 %. Compare bores of 80, 100, 125 and 150 mm.',
      steps: [
        '80 mm: $V = 1.99$ m/s, $f = 0.0195$, $h_f = 24.7$ m; electrical power $998 \\times 9.81 \\times 0.01 \\times 24.7/0.7 = 3.45$ kW, so $3.45 \\times 4000 = 13\\,800$ kWh a year.',
        '100 mm: $V = 1.27$ m/s, $h_f = 8.06$ m, 4510 kWh a year.',
        '125 mm: $V = 0.81$ m/s, $h_f = 2.67$ m, 1490 kWh a year.',
        '150 mm: $V = 0.57$ m/s, $h_f = 1.09$ m, 610 kWh a year.',
        'The step from 80 to 100 mm saves 9300 kWh every year — nearly always worth it. Going from 125 to 150 mm saves only 880 kWh, which may not pay for the bigger pipe. The velocity rule (1–2 m/s) points to 100 mm; the economics may favour 125 mm where energy is dear.'
      ],
      a: 'About 100–125 mm: 80 mm wastes energy, 150 mm saves too little to justify its cost.'
    },
    {
      title: 'Lines for a hydraulic power unit',
      q: 'A pump delivers 60 L/min of hydraulic oil. Size the suction line for at most 1 m/s, the pressure line for at most 5 m/s and the return line for at most 3 m/s.',
      steps: [
        '$Q = 1.0\\times10^{-3}$ m³/s.',
        'Suction: $D = \\sqrt{4 \\times 10^{-3}/(\\pi \\times 1)} = 35.7$ mm → a 38 mm (1½-inch) hose, 0.88 m/s.',
        'Pressure: $D \\ge 16.0$ mm → a 16 mm (⅝-inch) bore sits right at 5 m/s; a 19 mm (¾-inch) hose gives 3.5 m/s and less heat.',
        'Return: $D \\ge 20.6$ mm → a 25 mm (1-inch) hose, 2.0 m/s. (A differential cylinder can return more than the pump flow: size the return for the largest flow, not the pump’s.)'
      ],
      a: 'Suction 38 mm, pressure 16–19 mm, return 25 mm.'
    }
  ],
  quiz: [
    { q: 'What is a typical velocity range for the suction line of a hydraulic pump?', choices: ['0.5–1.5 m/s', '2–4 m/s', '3–6 m/s', '8–10 m/s'], a: 0,
      why: 'Low velocity keeps the inlet pressure high enough to avoid air release and cavitation.' },
    { q: 'At the same flow, going up from an 80 mm to a 100 mm bore cuts the friction head loss by a factor of about…', choices: ['1.25', '1.6', '3', '10'], a: 2,
      why: '(100/80)⁵ = 3.05, with f nearly unchanged.' },
    { q: 'The economic diameter of a pumped main gets larger when electricity becomes more expensive.', a: true,
      why: 'Dearer energy raises the cost of friction; the optimum moves towards bigger pipes and lower velocities.' },
    { q: 'Why is a very low velocity also a problem in drinking-water mains?', choices: ['the pump cavitates', 'sediment settles and the water ages in the pipe', 'the friction factor becomes negative', 'water hammer gets worse'], a: 1,
      why: 'Slow water drops its suspended particles and stays in the network longer, losing disinfectant and quality.' },
    { q: 'What bore gives a velocity of 1.5 m/s for a flow of 10 L/s?', answer: 92.1, unit: 'mm', tol: 0.02,
      why: 'D = √(4 × 0.01/(π × 1.5)) = 0.0921 m.' }
  ],
  problems: [
    { q: 'A 50 m³/h pump line has a friction head loss of 6 m. The pump runs 3000 h a year with an overall efficiency of 65 %. How much electrical energy does the friction cost per year (ρ = 998 kg/m³)?', answer: 3765, unit: 'kWh', tol: 0.02,
      steps: ['$Q = 0.01389$ m³/s; friction power $= 998 \\times 9.807 \\times 0.01389 \\times 6/0.65 = 1255$ W.', 'Energy $= 1.255 \\times 3000 = 3765$ kWh a year.'] }
  ],
  applications: [
    'Water mains, pump stations and building services.',
    'Suction, pressure and return lines of hydraulic power units and mobile machines.',
    'Cooling-water and process piping, where energy costs over the plant life dominate.'
  ],
  sim: 'pipe-economic'
},

{
  id: 'non-circular-ducts', parent: 'pipe-systems', title: 'Non-circular ducts and hydraulic diameter', level: 2,
  short: 'For ducts that are not round, pipe-friction formulas work with the hydraulic diameter D_h = 4A/P (four times the area over the wetted perimeter). It is reliable in turbulent flow; laminar flow needs shape-specific factors, and thin gaps leak as the cube of their clearance.',
  keywords: ['hydraulic diameter', 'wetted perimeter', 'rectangular duct', 'annulus', 'non-circular', 'hydraulic radius', 'slot flow', 'leakage', 'clearance', 'spool leakage'],
  prereq: ['darcy-weisbach', 'laminar-pipe-flow', 'reynolds-number-pipes'],
  related: ['open-channel-basics', 'manning-equation', 'heat-coolers', 'friction-factor', 'seals', 'directional-valves'],
  body: `
Not every conduit is round. Air-conditioning ducts are rectangular, heat-exchanger shells leave gaps between tubes, cooling passages in moulds and engines take whatever shape fits, and a spool valve leaks through a thin ring between spool and bore. The pipe-friction machinery still works for most of them once the diameter is replaced by a **hydraulic diameter**:

$$D_h = \\frac{4A}{P}$$

where $A$ is the flow area and $P$ the **wetted perimeter**, the length of wall in contact with the liquid. For a full circular pipe $D_h = 4(\\pi D^2/4)/\\pi D = D$, as it should be. The idea: turbulent wall friction depends on how much wall there is for each unit of flow area.

| Shape | $D_h$ |
|---|---|
| Circle, diameter $D$ | $D$ |
| Square, side $a$ | $a$ |
| Rectangle $a \\times b$ | $2ab/(a+b)$ |
| Annulus between $D_o$ and $D_i$ | $D_o - D_i$ |
| Wide slot of height $h$ | $2h$ |
| Open channel, flow area $A$, wetted perimeter $P$ | $4A/P = 4R$ |

Beware the factor 4: open-channel engineers use the **hydraulic radius** $R = A/P$, which for a full pipe is $D/4$, not $D/2$ ([[open-channel-basics]]).

### How to use it
Use $D_h$ in the Reynolds number, in the relative roughness and in Darcy–Weisbach — but take the velocity from the real area, $V = Q/A$. In **turbulent flow** this reproduces measured friction to within about 10–15 % for rectangles up to an aspect ratio of about 4, for triangles without very sharp corners and for annuli. It does worse for very flat slots and sharp-cornered shapes, where slow fluid in the corners and secondary flows distort the picture.

### Laminar flow is different
In laminar flow the friction depends on the exact shape, and $f = 64/Re$ is wrong. Use the constant $f\\,Re$ for the shape, both based on $D_h$:

| Laminar, fully developed | $f\\,Re_{D_h}$ |
|---|---|
| Circle | 64 |
| Square | 56.9 |
| Rectangle 2 : 1 | 62.2 |
| Rectangle 4 : 1 | 72.9 |
| Equilateral triangle | 53.3 |
| Parallel plates, or a thin annulus | 96 |

### Leakage through a gap
The thin annular clearance round a spool or a piston is the extreme case — a laminar slot — and its leakage is

$$Q = \\frac{\\pi D\\,c^3\\,\\Delta p}{12\\,\\mu L}$$

for a concentric radial clearance $c$ over a sealing length $L$; an eccentric spool, pushed against one side, leaks up to 2.5 times as much. The **cube of the clearance** is why hydraulic spools are fitted to a few micrometres: double the clearance through wear or dirt and the leakage rises eightfold. And since $\\mu$ is in the denominator, hot thin oil leaks more than cold oil — one reason why a machine slows down as it warms up ([[seals]], [[directional-valves]]).
`,
  ideas: [
    'D_h = 4A/P: four times the flow area over the wetted perimeter; D_h = D for a round pipe.',
    'Use D_h in Re, ε/D and Darcy–Weisbach, but compute the velocity from the real area.',
    'Reliable in turbulent flow; laminar flow needs a shape-specific f·Re (96 for thin slots).',
    'Leakage through a thin gap goes as the cube of the clearance and inversely with viscosity.'
  ],
  pitfalls: [
    'Compute the velocity from the hydraulic diameter — Use the real flow area: V = Q/A. D_h only replaces D in the friction terms.',
    'The hydraulic radius is half the hydraulic diameter — It is a quarter: R = A/P = D_h/4 (D/4 for a full pipe).',
    'f = 64/Re works for any shape if D_h is used — Laminar friction depends on shape: 56.9 for a square, 96 for a thin slot.'
  ],
  formulas: [
    {
      name: 'Hydraulic diameter',
      expr: 'Dh = 4*A/P', tex: 'D_h = \\dfrac{4A}{P}',
      vars: {
        Dh: { name: 'hydraulic diameter', q: 'length', unit: 'mm', tex: 'D_h' },
        A: { name: 'flow area', q: 'area', unit: 'mm²', value: 5000 },
        P: { name: 'wetted perimeter', q: 'length', unit: 'mm', value: 300 }
      },
      stories: { Dh: 'A duct has a flow area of {A} and a wetted perimeter of {P}. What is its hydraulic diameter?' }
    },
    {
      name: 'Hydraulic diameter of a rectangle',
      expr: 'Dh = 2*a*b/(a + b)', tex: 'D_h = \\dfrac{2ab}{a + b}',
      vars: {
        Dh: { name: 'hydraulic diameter', q: 'length', unit: 'mm', tex: 'D_h' },
        a: { name: 'width', q: 'length', unit: 'mm', value: 200 },
        b: { name: 'height', q: 'length', unit: 'mm', value: 100 }
      },
      stories: { Dh: 'What is the hydraulic diameter of a rectangular duct {a} wide and {b} high, running full?' }
    },
    {
      name: 'Leakage through an annular clearance',
      expr: 'Q = pi*D*c^3*dp/(12*mu*L)', tex: 'Q = \\dfrac{\\pi D c^3 \\Delta p}{12\\,\\mu L}',
      vars: {
        Q: { name: 'leakage flow', q: 'flowrate', unit: 'cm³/min' },
        D: { name: 'spool or piston diameter', q: 'length', unit: 'mm', value: 10 },
        c: { name: 'radial clearance', q: 'length', unit: 'µm', value: 5 },
        dp: { name: 'pressure difference', q: 'pressure', unit: 'bar', value: 200, tex: '\\Delta p' },
        mu: { name: 'dynamic viscosity', q: 'viscosity', unit: 'mPa·s', value: 30 },
        L: { name: 'sealing length', q: 'length', unit: 'mm', value: 5 }
      },
      note: 'Concentric laminar gap (parallel-plate flow round the circumference). A fully eccentric spool leaks 2.5 times as much.',
      practice: { unknowns: ['Q', 'c'] },
      stories: {
        Q: 'A {D} spool with {c} radial clearance seals over {L} against {dp}; the oil viscosity is {mu}. How much leaks past?',
        c: 'A {D} spool sealing over {L} against {dp} (oil {mu}) may leak at most {Q}. What radial clearance is allowed?'
      }
    }
  ],
  examples: [
    {
      title: 'A rectangular water duct',
      q: 'Water at 20 °C flows at 1 m/s through a steel duct 200 mm × 100 mm ($\\varepsilon = 0.045$ mm). What is the head loss per 100 m?',
      steps: [
        '$D_h = 2 \\times 200 \\times 100/300 = 133$ mm.',
        '$Re = 1 \\times 0.133/1.004\\times10^{-6} = 1.33\\times10^5$; $\\varepsilon/D_h = 3.4\\times10^{-4}$; $f = 0.0189$.',
        '$h_f = 0.0189 \\times (100/0.133) \\times 1^2/19.61 = 0.72$ m per 100 m.'
      ],
      a: 'About 0.72 m per 100 m.'
    },
    {
      title: 'An annulus against a pipe of the same area',
      q: 'Compare an annulus between tubes of 50 mm and 30 mm with a round pipe of the same flow area.',
      steps: [
        'Area $= \\pi(50^2 - 30^2)/4 = 1257$ mm², the same as a 40 mm pipe.',
        '$D_h = 50 - 30 = 20$ mm, half the pipe\'s 40 mm.',
        'At the same flow (same velocity) the annulus has twice the $L/D$, so roughly twice the head loss — more wall for the same area.'
      ],
      a: 'D_h = 20 mm: about twice the friction of the 40 mm pipe.'
    }
  ],
  quiz: [
    { q: 'What is the hydraulic diameter of a square duct of side a?', choices: ['a/2', 'a', '√2·a', '4a'], a: 1,
      why: 'D_h = 4a²/(4a) = a.' },
    { q: 'What is the hydraulic diameter of a wide slot between parallel plates h apart?', choices: ['h/2', 'h', '2h', '4h'], a: 2,
      why: 'Per unit width: A = h, P = 2 (both plates), so D_h = 4h/2 = 2h.' },
    { q: 'In laminar flow, f = 64/Re based on the hydraulic diameter is accurate for any duct shape.', a: false,
      why: 'Laminar friction depends on shape: f·Re = 56.9 for a square, 96 for a slot.' },
    { q: 'The radial clearance of a worn spool doubles. By what factor does its leakage grow?', answer: 8, tol: 0.01,
      why: 'Laminar gap leakage ∝ c³: 2³ = 8.' }
  ],
  problems: [
    { q: 'A 16 mm spool with a radial clearance of 8 µm seals over 6 mm against 250 bar of oil with μ = 25 mPa·s. What is the concentric leakage in cm³/min?', answer: 21.4, unit: 'cm³/min', tol: 0.03,
      steps: ['$Q = \\pi \\times 0.016 \\times (8\\times10^{-6})^3 \\times 2.5\\times10^7/(12 \\times 0.025 \\times 0.006)$.', '$= 6.43\\times10^{-10}/1.8\\times10^{-3} = 3.57\\times10^{-7}$ m³/s = 21.4 cm³/min.'] }
  ],
  applications: [
    'Air-conditioning ducts, cooling passages and heat-exchanger shells.',
    'Leakage past spools, pistons and plungers in hydraulic valves, pumps and motors.',
    'Open channels and part-full pipes, through the hydraulic radius.'
  ]
},

{
  id: 'siphons', parent: 'pipe-systems', title: 'Siphons', level: 2,
  short: 'A siphon carries liquid up over a crest and down to a lower level with no pump, driven by the difference in level and held up by atmospheric pressure. The crest is below atmospheric pressure, so its height is limited — in practice to about 7–8 m of water at sea level.',
  keywords: ['siphon', 'syphon', 'crest', 'priming', 'vapour pressure', 'cavitation', 'column separation', 'siphon spillway', 'negative pressure', 'suction lift', 'atmospheric pressure'],
  prereq: ['energy-equation', 'gauge-absolute', 'vapour-pressure', 'darcy-weisbach'],
  related: ['cavitation', 'hgl-egl', 'column-separation', 'priming-suction', 'npsh', 'torricelli', 'dams-spillways', 'minor-losses'],
  body: `
A siphon carries liquid **up** over an obstacle and then down to a lower level, with no pump: a hose from a tank over its rim to a drain, a pipe over a dam crest, a fuel line from a tank with no bottom outlet. Once the tube is full ("primed"), the liquid keeps flowing as long as the outlet stays below the surface it is drawn from.

### Why it works
The driving head is the fall $H$ from the supply surface down to the outlet (or to the lower surface, if the outlet is submerged). The [[energy-equation]] from the supply surface to the outlet jet gives

$$V = \\sqrt{\\frac{2gH}{1 + \\sum K + fL/D}}$$

exactly as for any pipe running downhill ([[torricelli]] with losses). What lifts the liquid up the rising leg is the **atmosphere** pressing on the supply surface: the pressure inside the crest is below atmospheric, and the difference holds up the column. The long downward leg outweighs the short upward one and draws the liquid over the top. In everyday siphons the liquid is not in tension — take away the atmosphere and an ordinary water siphon stops — although carefully degassed liquids can sustain small tensions.

### The pressure at the crest
Energy from the supply surface to the crest, a height $z$ above that surface, gives the **absolute** pressure there:

$$p_c = p_a - \\rho g\\left(z + (1 + K_1)\\frac{V^2}{2g}\\right)$$

where $K_1$ collects the losses between the inlet and the crest (entrance, bends, $fL_1/D$). The crest is the lowest pressure in the system ([[hgl-egl|the pipe rises above its hydraulic grade line]]). If $p_c$ falls to the liquid's [[vapour-pressure]], the liquid boils there; the column breaks, vapour and released air collect at the top, and the flow falters or stops ([[column-separation]]).

### How high can the crest be?
Setting $p_c = p_v$:

$$z_{max} = \\frac{p_a - p_v}{\\rho g} - (1 + K_1)\\frac{V^2}{2g}$$

For water at 20 °C at sea level ($p_v = 2.3$ kPa) the static limit is 10.1 m — a column of water balances the atmosphere at about 10.3 m. Flow and losses take some of that away. In practice siphons are kept to about **7–8 m** above the supply surface at sea level, because dissolved air comes out of solution well above the vapour pressure, gathers at the crest and breaks the siphon. The limit falls with altitude (at 1500 m the atmosphere is only 85 kPa, about 1.7 m less) and with temperature:

| Water temperature | 10 °C | 20 °C | 40 °C | 60 °C | 80 °C |
|---|---|---|---|---|---|
| Vapour pressure (kPa) | 1.2 | 2.3 | 7.4 | 20 | 47 |

### Siphons at work
- **Siphon spillways** at dams prime themselves as the reservoir rises and pass large flows with a small rise in level; an air vent breaks the siphon when the level falls again.
- **Irrigation siphons** — curved tubes laid over a canal bank — feed furrows without cutting the bank.
- **Pump suction lifts** obey the same limit: a pump above its sump can lift water only about 7 m in practice ([[priming-suction]], [[npsh]]).
- The Roman **inverted siphon** was not a siphon at all but a pressure pipe dipping into a valley, below its hydraulic grade line.

> [!warn] Never start a siphon of fuel, solvent or chemicals by mouth: liquid breathed into the lungs can be fatal. Use a hand pump or a self-priming siphon. The intakes of siphons and spillways at dams draw water with great force and can trap and drown a person: keep out of fenced areas round intakes, channels and spillways, and treat chambers and culverts as confined spaces.
`,
  ideas: [
    'A siphon runs on the level difference between the supply surface and the outlet; the crest height hardly affects the flow.',
    'The atmosphere pushes the liquid up the rising leg; the crest is below atmospheric pressure.',
    'Crest pressure p_c = p_a − ρg(z + (1 + K₁)V²/2g); it must stay above the vapour pressure.',
    'The theoretical crest limit for cold water at sea level is about 10 m; in practice 7–8 m, because dissolved air comes out first.',
    'Altitude and warm liquid both lower the limit.'
  ],
  pitfalls: [
    'A siphon is pulled over by the weight of the long leg, like a chain — In ordinary siphons the liquid is not in tension; atmospheric pressure pushes it up, and without an atmosphere the siphon stops.',
    'A higher crest gives a slower siphon — The flow is set by the fall to the outlet and the losses; the crest height only matters when it approaches the vapour-pressure limit.',
    'A siphon can lift water any height if the downward leg is long enough — The crest pressure cannot fall below the vapour pressure; for water at sea level the absolute ceiling is about 10 m.'
  ],
  formulas: [
    {
      name: 'Siphon velocity',
      expr: 'V = sqrt(2*g*H/(1 + Kt + f*L/D))', tex: 'V = \\sqrt{\\dfrac{2gH}{1 + K_t + fL/D}}',
      vars: {
        V: { name: 'velocity in the tube', q: 'speed', unit: 'm/s' },
        g: { const: 'g' },
        H: { name: 'fall from the supply surface to the outlet', q: 'length', unit: 'm', value: 3 },
        Kt: { name: 'sum of minor-loss coefficients (entrance, bends)', value: 1.3, tex: 'K_t' },
        f: { name: 'Darcy friction factor', value: 0.02 },
        L: { name: 'tube length', q: 'length', unit: 'm', value: 10 },
        D: { name: 'tube bore', q: 'length', unit: 'mm', value: 40 }
      },
      note: 'Free discharge: the 1 is the velocity head leaving in the jet (for a submerged outlet it is the exit loss, and H is the difference of the two surfaces).',
      practice: { unknowns: ['V', 'H'] },
      stories: {
        V: 'A siphon of {L} of {D} tube (f = {f}, ΣK = {Kt}) discharges {H} below the supply surface. How fast does the water flow?',
        H: 'A siphon of {L} of {D} tube (f = {f}, ΣK = {Kt}) must run at {V}. How far below the supply surface must its outlet be?'
      }
    },
    {
      name: 'Pressure at the crest (absolute)',
      expr: 'pc = pa - rho*g*(z + (1 + K1)*V^2/(2*g))', tex: 'p_c = p_a - \\rho g\\left(z + (1 + K_1)\\dfrac{V^2}{2g}\\right)',
      vars: {
        pc: { name: 'crest pressure (absolute)', q: 'pressure', unit: 'kPa', tex: 'p_c' },
        pa: { name: 'atmospheric pressure (absolute)', q: 'pressure', unit: 'kPa', value: 101.325, tex: 'p_a' },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 998 },
        g: { const: 'g' },
        z: { name: 'crest height above the supply surface', q: 'length', unit: 'm', value: 5 },
        K1: { name: 'loss coefficient from inlet to crest', value: 1.5, tex: 'K_1' },
        V: { name: 'velocity in the tube', q: 'speed', unit: 'm/s', value: 2 }
      },
      note: 'Absolute pressures. Subtract p_a for the (negative) gauge pressure. Must stay above the vapour pressure.',
      practice: { unknowns: ['pc', 'z'] },
      stories: {
        pc: 'A siphon crest is {z} above the supply surface; water ({rho}) flows at {V} with K₁ = {K1} up to the crest, under an atmosphere of {pa}. What is the absolute pressure at the crest?',
        z: 'Under an atmosphere of {pa}, a siphon flowing at {V} (K₁ = {K1}) must keep at least {pc} absolute at its crest. How high may the crest be?'
      }
    },
    {
      name: 'Highest possible crest',
      expr: 'zmax = (pa - pv)/(rho*g) - (1 + K1)*V^2/(2*g)', tex: 'z_{max} = \\dfrac{p_a - p_v}{\\rho g} - (1 + K_1)\\dfrac{V^2}{2g}',
      vars: {
        zmax: { name: 'highest crest above the supply surface', q: 'length', unit: 'm', tex: 'z_{max}' },
        pa: { name: 'atmospheric pressure (absolute)', q: 'pressure', unit: 'kPa', value: 101.325, tex: 'p_a' },
        pv: { name: 'vapour pressure of the liquid (absolute)', q: 'pressure', unit: 'kPa', value: 2.34, tex: 'p_v' },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 998 },
        g: { const: 'g' },
        K1: { name: 'loss coefficient from inlet to crest', value: 1.5, tex: 'K_1' },
        V: { name: 'velocity in the tube', q: 'speed', unit: 'm/s', value: 2 }
      },
      note: 'The theoretical limit, where the crest reaches the vapour pressure. Real siphons stay 2–3 m below it because dissolved air comes out first.',
      stories: { zmax: 'Water ({rho}, vapour pressure {pv}) is siphoned at {V} with K₁ = {K1} under an atmosphere of {pa}. What is the highest the crest could theoretically be?' }
    }
  ],
  examples: [
    {
      title: 'Emptying a tank with a hose',
      q: 'A 10 m smooth hose of 40 mm bore siphons water (20 °C) from a tank. The crest is 2 m above the water surface and the outlet 3 m below it. Losses: entrance 0.5, two bends 0.4 each. Find the flow and the crest pressure (3 m of hose lies between the inlet and the end of the crest).',
      steps: [
        'Guess $f = 0.02$: $V = \\sqrt{2 \\times 9.81 \\times 3/(1 + 1.3 + 0.02 \\times 10/0.04)} = 2.84$ m/s. Then $Re = 1.1\\times10^5$ gives $f = 0.0176$, and repeating, $V = 2.96$ m/s.',
        'Flow: $Q = 2.96 \\times \\pi \\times 0.04^2/4 = 3.7\\times10^{-3}$ m³/s = 3.7 L/s.',
        'Up to the crest: $K_1 = 0.5 + 0.4 + 0.0176 \\times 3/0.04 = 2.22$; $V^2/2g = 0.448$ m.',
        { text: 'Crest pressure:', tex: 'p_c = 101.3 - 9.79 \\times (2 + 3.22 \\times 0.448) = 67.6\\ \\text{kPa (absolute)}' },
        'That is −33.7 kPa gauge, far above the 2.3 kPa vapour pressure: the siphon runs comfortably.'
      ],
      a: 'About 3.7 L/s; the crest is at 68 kPa absolute (−34 kPa gauge).'
    },
    {
      title: 'How high can it go?',
      q: 'Water at 20 °C is siphoned at 2 m/s with $K_1 = 1.5$ up to the crest. What is the highest crest at sea level, and at 1500 m altitude ($p_a = 84.6$ kPa)?',
      steps: [
        'Static limit at sea level: $(101.3 - 2.3)/9.79 = 10.1$ m.',
        'Minus the dynamic term $(1 + 1.5) \\times 2^2/19.61 = 0.51$ m: $z_{max} = 9.6$ m.',
        'At 1500 m: $(84.6 - 2.3)/9.79 - 0.51 = 7.9$ m.',
        'Allowing 2–3 m for air coming out of solution, a practical siphon keeps its crest below about 7 m at sea level and about 5 m at 1500 m.'
      ],
      a: 'Theoretically 9.6 m at sea level and 7.9 m at 1500 m; in practice a few metres less.'
    }
  ],
  quiz: [
    { q: 'What pushes the water up the rising leg of a siphon?', choices: ['the weight of the water in the falling leg, through tension', 'atmospheric pressure on the supply surface', 'capillary action', 'the velocity of the flow'], a: 1,
      why: 'The crest is below atmospheric pressure; the atmosphere on the open supply surface pushes the liquid up to it.' },
    { q: 'Raising the crest of a running siphon by 1 m (same tube length) noticeably reduces its flow.', a: false,
      why: 'The flow depends on the fall H to the outlet and the losses. The crest height only lowers the crest pressure — until it nears the vapour-pressure limit.' },
    { q: 'What is the theoretical static limit of a water siphon crest (20 °C, sea level), in metres?', answer: 10.1, unit: 'm', tol: 0.03,
      why: '(p_a − p_v)/ρg = (101.3 − 2.3) kPa/(998 × 9.81) = 10.1 m.' },
    { q: 'A siphon that works with cold water may fail with hot water at the same crest height.', a: true,
      why: 'Hot water has a much higher vapour pressure (20 kPa at 60 °C against 2.3 kPa at 20 °C), so the crest boils at a lower height.' },
    { q: 'Where is the pressure lowest in a running siphon?', choices: ['at the inlet', 'at the highest point, at the downstream end of the crest', 'at the outlet', 'halfway down the falling leg'], a: 1,
      why: 'Absolute pressure falls with height and with the losses accumulated since the inlet; both peak at the downstream end of the crest.' }
  ],
  problems: [
    { q: 'A siphon discharges 4 m below the supply surface; its total loss factor 1 + ΣK + fL/D is 5. What is the velocity in the tube?', answer: 3.96, unit: 'm/s', tol: 0.02,
      steps: ['$V = \\sqrt{2 \\times 9.81 \\times 4/5} = \\sqrt{15.7} = 3.96$ m/s.'] }
  ],
  applications: [
    'Draining tanks, ponds and flooded excavations without a pump.',
    'Siphon spillways at dams and siphon offtakes in irrigation canals.',
    'Understanding the suction limit of pumps set above their sump.'
  ],
  history: 'Siphons appear in Egyptian wall paintings from the second millennium BC, and Hero of Alexandria described many siphon devices in his Pneumatica in the first century AD. The explanation by atmospheric pressure came in the seventeenth century, with Torricelli\'s barometer and Pascal\'s experiments showing that a water column is held up only to about 10 m.',
  sim: 'pipe-siphon'
}

);
