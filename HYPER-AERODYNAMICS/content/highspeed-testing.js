/* HYPER-AERODYNAMICS · content/highspeed-testing.js
 * High-Speed Flight › Flying fast (transonic-supersonic): critical Mach number, transonic flow and buffet,
 * the area rule, sweep and compressibility, supersonic airfoils, hypersonic flight and heating.
 * Testing, Computing and Structures › Wind tunnels and experiments (wind-tunnels): wind tunnels, scale models
 * and similarity, flow visualisation, measuring forces and pressures, flight testing.
 * Simulations in sims/highspeed-testing.js (hst-*). */
Hyper.add(

/* ================================================================ critical Mach number */
{
  id: 'critical-mach', parent: 'transonic-supersonic', title: 'Critical Mach number', level: 2,
  short: 'The flight Mach number at which the air, speeding over the most curved part of a wing, first reaches the speed of sound somewhere on the surface. Below it the flow is subsonic everywhere; above it a pocket of supersonic flow and a shock appear, and the drag soon starts to climb.',
  keywords: ['critical Mach number', 'M crit', 'Prandtl–Glauert', 'Prandtl-Glauert rule', 'Kármán–Tsien', 'Karman-Tsien', 'compressibility correction', 'critical pressure coefficient', 'sonic pressure coefficient', 'Cp*', 'local Mach number', 'supersonic pocket', 'subcritical', 'supercritical'],
  prereq: ['mach-number', 'pressure-coefficient', 'pressure-distribution', 'isentropic-flow'],
  related: ['transonic-flow', 'swept-wing-compressibility', 'special-airfoils', 'compressibility', 'mach-regimes', 'thin-airfoil-theory', 'naca-airfoils', 'panel-methods'],
  body: `
A wing flying at Mach 0.7 does not see Mach 0.7 everywhere. Over the front of its upper surface the air is accelerated — that is where the suction that makes lift comes from — and it can run 30–50 % faster than the free stream. So long before the aircraft reaches the speed of sound, the air somewhere on its wing does. The flight Mach number at which the fastest point on the surface first touches Mach 1 is the **critical Mach number**, $M_{crit}$.

### From low speed to high speed: Prandtl–Glauert
At low speed the [[pressure-distribution|pressure distribution]] is fixed by shape and angle; its lowest value, $C_{p0,\\min}$, can be measured in a tunnel or computed by a [[panel-methods|panel method]]. As the Mach number rises the air compresses, the disturbance made by the airfoil grows, and every pressure coefficient is stretched by nearly the same factor:

$$C_p = \\frac{C_{p0}}{\\sqrt{1 - M_\\infty^2}}$$

This is the **Prandtl–Glauert rule**, the result of linearised theory for thin airfoils at small angles. At Mach 0.6 it multiplies every pressure coefficient — and the lift slope — by 1.25; at Mach 0.8, by 1.67. The **Kármán–Tsien rule** stretches large suction peaks a little more and is closer to experiment near $M_{crit}$:

$$C_p = \\frac{C_{p0}}{\\sqrt{1-M_\\infty^2} + \\dfrac{M_\\infty^2}{1+\\sqrt{1-M_\\infty^2}}\\,\\dfrac{C_{p0}}{2}}$$

### The sonic pressure coefficient
Outside the boundary layer the flow is [[isentropic-flow|isentropic]], so the local Mach number depends only on the local pressure. The air is exactly sonic where the pressure has fallen to the value that isentropic expansion from the free stream reaches at $M = 1$. As a pressure coefficient:

$$C_p^* = \\frac{2}{\\gamma M_\\infty^2}\\left[\\left(\\frac{2 + (\\gamma-1)M_\\infty^2}{\\gamma+1}\\right)^{\\gamma/(\\gamma-1)} - 1\\right]$$

It depends on the flight Mach number alone: −1.29 at Mach 0.6, −0.78 at 0.7, −0.43 at 0.8 and zero at Mach 1, where the free stream itself is sonic.

### Finding $M_{crit}$
Plot both against Mach number: the suction peak $C_{p,\\min}(M_\\infty)$ deepens, the sonic value $C_p^*$ rises towards zero, and where they cross is the critical Mach number.

| Section (panel method, low speed) | $C_{p0,\\min}$ | $M_{crit}$, Prandtl–Glauert | $M_{crit}$, Kármán–Tsien |
|---|---|---|---|
| 6 % thick, zero lift | −0.21 | 0.82 | 0.82 |
| NACA 0012, zero lift | −0.41 | 0.74 | 0.73 |
| 15 % thick, zero lift | −0.52 | 0.71 | 0.70 |
| NACA 0012 at 2° ($c_l$ ≈ 0.24) | −0.79 | 0.65 | 0.63 |

Thin sections, small angles and little lift keep the suction peak shallow and $M_{crit}$ high — which is why fast aircraft have thin wings, why [[special-airfoils|supercritical sections]] flatten their suction peak, and why sweep, which lets each section feel a lower Mach number, helps (see [[swept-wing-compressibility]]).

### Local Mach number from $C_p$
The same isentropic relation turns any pressure coefficient into a local Mach number. For air ($\\gamma = 1.4$), a point with $C_p = -0.60$ on a wing at Mach 0.70 runs at Mach 0.93.

> [!key] $M_{crit}$ is not a wall. Just above it a small supersonic pocket sits on the wing, closed by a weak shock, and the drag has hardly changed. The steep rise comes somewhat later, at the drag-divergence Mach number (see [[transonic-flow]]).

The corrections have limits. They assume small disturbances, so they predict infinite pressures as $M_\\infty \\to 1$ and lose their meaning once shocks form. Modern wing design uses transonic [[cfd|CFD]]; the construction above remains the quickest honest estimate.
`,
  ideas: [
    'The air over a wing runs faster than the aircraft, so it reaches Mach 1 first; the flight Mach number at which that happens is M_crit.',
    'Compressibility stretches every pressure coefficient by about 1/√(1 − M²) (Prandtl–Glauert); Kármán–Tsien stretches large suction peaks a little more.',
    'The sonic pressure coefficient C_p* depends only on the flight Mach number; M_crit is where C_p,min(M) meets C_p*(M).',
    'Thin sections, small angles and little lift keep the suction peak small and M_crit high — typically 0.65–0.8 for unswept wings.',
    'Above M_crit a supersonic pocket closed by a shock sits on the wing; the steep drag rise comes a little later.'
  ],
  pitfalls: [
    'M_crit is the speed at which the aircraft goes supersonic — It is the flight Mach number at which the fastest air on the wing reaches Mach 1; the aircraft itself is still at Mach 0.65–0.8.',
    'Above the critical Mach number the drag shoots up at once — A small supersonic pocket and a weak shock cost little; the steep rise, drag divergence, begins some 0.05–0.1 in Mach number later.',
    'The Prandtl–Glauert rule works right up to Mach 1 — It is a small-disturbance theory: it breaks down once shocks form, and it predicts infinite pressures at Mach 1.'
  ],
  formulas: [
    {
      name: 'Prandtl–Glauert compressibility rule',
      expr: 'Cp = Cp0/sqrt(1 - M^2)', tex: 'C_p = \\dfrac{C_{p0}}{\\sqrt{1 - M_\\infty^2}}',
      vars: {
        Cp: { name: 'pressure coefficient at Mach M∞', signed: true, tex: 'C_p' },
        Cp0: { name: 'pressure coefficient at low speed', value: -0.43, min: -5, max: 1, signed: true, tex: 'C_{p0}' },
        M: { name: 'free-stream Mach number', value: 0.6, min: 0, max: 0.99, tex: 'M_\\infty' }
      },
      note: 'Thin airfoils at small angles, subsonic and below M_crit. The lift coefficient and lift slope scale by the same factor.',
      stories: {
        Cp: 'At low speed the suction peak of an airfoil has a pressure coefficient of {Cp0}. By the Prandtl–Glauert rule, what is it at Mach {M}?',
        M: 'A point on a wing has a pressure coefficient of {Cp0} at low speed. At what Mach number has it deepened to {Cp}?'
      }
    },
    {
      name: 'Kármán–Tsien compressibility rule',
      expr: 'Cp = Cp0/(sqrt(1 - M^2) + M^2/(1 + sqrt(1 - M^2))*Cp0/2)',
      tex: 'C_p = \\dfrac{C_{p0}}{\\sqrt{1 - M_\\infty^2} + \\dfrac{M_\\infty^2}{1 + \\sqrt{1 - M_\\infty^2}}\\,\\dfrac{C_{p0}}{2}}',
      vars: {
        Cp: { name: 'pressure coefficient at Mach M∞', signed: true, tex: 'C_p' },
        Cp0: { name: 'pressure coefficient at low speed', value: -0.43, min: -5, max: 1, signed: true, tex: 'C_{p0}' },
        M: { name: 'free-stream Mach number', value: 0.6, min: 0, max: 0.99, tex: 'M_\\infty' }
      },
      note: 'Closer to experiment than Prandtl–Glauert for strong suction peaks; still subsonic flow only.',
      stories: { Cp: 'A suction peak of {Cp0} at low speed: what does the Kármán–Tsien rule give at Mach {M}?' }
    },
    {
      name: 'Critical (sonic) pressure coefficient',
      expr: 'Cps = 2/(gamma*M^2)*(((2 + (gamma - 1)*M^2)/(gamma + 1))^(gamma/(gamma - 1)) - 1)',
      tex: 'C_p^* = \\dfrac{2}{\\gamma M_\\infty^2}\\left[\\left(\\dfrac{2 + (\\gamma - 1) M_\\infty^2}{\\gamma + 1}\\right)^{\\gamma/(\\gamma - 1)} - 1\\right]',
      vars: {
        Cps: { name: 'pressure coefficient where the flow is sonic', signed: true, tex: 'C_p^*' },
        M: { name: 'free-stream Mach number', value: 0.74, min: 0.3, max: 1, tex: 'M_\\infty' },
        gamma: { name: 'ratio of specific heats (air 1.4)', value: 1.4, min: 1.05, max: 1.67, fixed: true, tex: '\\gamma' }
      },
      note: 'Wherever C_p on the surface is lower (more negative) than C_p*, the local flow is supersonic.',
      stories: {
        Cps: 'An aircraft flies at Mach {M}. Below what pressure coefficient is the air on its wing supersonic?',
        M: 'The suction peak of a wing has reached a pressure coefficient of {Cps}. At what flight Mach number is that peak exactly sonic?'
      }
    },
    {
      name: 'Local Mach number from a pressure coefficient (air)',
      expr: 'Ml = sqrt(5*((1 + 0.2*M^2)*(1 + 0.7*M^2*Cp)^(-1/3.5) - 1))',
      tex: 'M_l = \\sqrt{5\\left[\\dfrac{1 + 0.2\\,M_\\infty^2}{\\left(1 + 0.7\\,M_\\infty^2 C_p\\right)^{2/7}} - 1\\right]}',
      vars: {
        Ml: { name: 'local Mach number', tex: 'M_l' },
        M: { name: 'free-stream Mach number', value: 0.7, min: 0.05, max: 0.99, tex: 'M_\\infty' },
        Cp: { name: 'local pressure coefficient', value: -0.6, min: -3, max: 1, signed: true, tex: 'C_p' }
      },
      note: 'Isentropic flow of air (γ = 1.4) outside the boundary layer and ahead of any shock.',
      stories: {
        Ml: 'On a wing at Mach {M} a pressure tap reads a pressure coefficient of {Cp}. What is the local Mach number there?',
        Cp: 'At Mach {M}, what pressure coefficient on the wing corresponds to a local Mach number of {Ml}?'
      }
    }
  ],
  examples: [
    {
      title: 'The critical Mach number of a NACA 0012',
      q: 'A NACA 0012 at zero lift has a lowest low-speed pressure coefficient of −0.43. Estimate its critical Mach number with the Prandtl–Glauert rule.',
      steps: [
        'At $M_\\infty = 0.70$: $C_{p,\\min} = -0.43/\\sqrt{1 - 0.49} = -0.602$, while $C_p^* = -0.779$. The peak has not reached sonic yet.',
        'At $M_\\infty = 0.74$: $C_{p,\\min} = -0.43/\\sqrt{1 - 0.548} = -0.639$, while $C_p^* = -0.626$. The peak is now beyond sonic.',
        'Between them, at $M_\\infty = 0.737$, both equal −0.636: that is $M_{crit}$.',
        'The Kármán–Tsien rule, which deepens the peak faster, gives 0.723.'
      ],
      a: 'M_crit ≈ 0.74 by Prandtl–Glauert, 0.72 by Kármán–Tsien.'
    },
    {
      title: 'How fast is the air at the suction peak?',
      q: 'A wing flies at Mach 0.70. A tap near the nose reads $C_p = -0.60$. What is the local Mach number there?',
      steps: [
        'Pressure ratio from the definition of $C_p$ (with $q = \\tfrac{\\gamma}{2}p_\\infty M_\\infty^2$): $p/p_\\infty = 1 + 0.7 \\times 0.49 \\times (-0.60) = 0.794$.',
        'Stagnation pressure of the free stream: $p_0/p_\\infty = (1 + 0.2 \\times 0.49)^{3.5} = 1.387$, so $p_0/p = 1.387/0.794 = 1.747$.',
        'Isentropic relation: $M_l = \\sqrt{5\\left[(1.747)^{2/7} - 1\\right]} = \\sqrt{5 \\times 0.173} = 0.93$.'
      ],
      a: 'About Mach 0.93: still subsonic, but close.'
    }
  ],
  quiz: [
    { q: 'An airliner cruises at Mach 0.78. Where on its wing is the air most likely to be supersonic?', choices: ['Nowhere: the aircraft is subsonic', 'Over the front part of the upper surface, near the suction peak', 'Under the lower surface near the trailing edge', 'In the wake behind the wing'], a: 1,
      why: 'The air accelerates most over the forward upper surface, where the suction peak is; at Mach 0.78 it is usually locally supersonic there, even though the aircraft is subsonic.' },
    { q: 'By the Prandtl–Glauert rule, a pressure coefficient of −0.5 measured at low speed becomes, at Mach 0.8, …', answer: -0.833, tol: 0.02,
      why: '$C_p = -0.5/\\sqrt{1 - 0.64} = -0.5/0.6 = -0.833$. All pressure coefficients, and the lift, grow by the same factor 1.67.' },
    { q: 'Making an airfoil thinner raises its critical Mach number.', a: true,
      why: 'A thinner section accelerates the air less, so its suction peak is shallower and needs a higher flight Mach number to reach the sonic value.' },
    { q: 'What is the sonic pressure coefficient $C_p^*$ at a free-stream Mach number of exactly 1?', choices: ['−1', '0', '+1', '−∞'], a: 1,
      why: 'At Mach 1 the free stream is itself sonic, so the sonic pressure is the free-stream pressure and $C_p^* = 0$.' },
    { q: 'At the critical Mach number the drag of a wing…', choices: ['becomes infinite', 'starts to climb steeply at once', 'has barely changed; the steep rise comes a little later', 'drops to zero'], a: 2,
      why: 'At $M_{crit}$ the supersonic pocket is vanishingly small. Drag divergence comes later, when the pocket and its shock have grown.' }
  ],
  problems: [
    { q: 'An airfoil has a lowest low-speed pressure coefficient of −0.60. Use the Prandtl–Glauert rule to estimate its critical Mach number.', answer: 0.689, tol: 0.02,
      hint: 'Try Mach numbers near 0.7 and compare $C_{p0}/\\sqrt{1-M^2}$ with $C_p^*$.',
      steps: ['At $M = 0.69$: $C_{p,\\min} = -0.60/\\sqrt{1 - 0.476} = -0.829$ and $C_p^* = -0.821$ — just past sonic.', 'At $M = 0.68$ the peak is still short of sonic, so $M_{crit} \\approx 0.689$ (Kármán–Tsien gives 0.671).'] }
  ],
  applications: [
    'Choosing wing thickness and cruise Mach number for jet transports and business jets.',
    'Propeller and rotor tips, which reach their critical Mach number long before the aircraft does.',
    'Correcting low-speed wind-tunnel pressure data to flight Mach numbers.',
    'Designing supercritical sections, whose flat suction peaks keep the supersonic pocket weak.'
  ],
  history: 'Hermann Glauert published the rule in 1928, from ideas Ludwig Prandtl had given in his Göttingen lectures. Hsue-shen Tsien and Theodore von Kármán derived their better rule in 1939–41, when propeller tips and fighters in steep dives were already meeting the compressibility problems it predicts.',
  sim: 'hst-mcrit'
},

/* ================================================================ transonic flow */
{
  id: 'transonic-flow', parent: 'transonic-supersonic', title: 'Transonic flow and buffet', level: 2,
  short: 'From about Mach 0.8 to 1.2 subsonic and supersonic flow share the same aircraft: a supersonic region ends in a shock that grows and moves aft, drag climbs steeply, the boundary layer can separate behind the shock, and the aircraft may buffet and pitch nose-down.',
  keywords: ['transonic flow', 'drag divergence', 'drag-divergence Mach number', 'drag rise', 'shock-induced separation', 'buffet', 'Mach buffet', 'Mach tuck', 'Korn equation', "Lock's fourth-power law", 'supercritical airfoil', 'coffin corner', 'sound barrier', 'aileron buzz', 'drag count', 'Mach trim'],
  prereq: ['critical-mach', 'normal-shock', 'flow-separation'],
  related: ['wave-drag', 'area-rule', 'swept-wing-compressibility', 'special-airfoils', 'mach-regimes', 'ceiling', 'pitching-moment', 'flutter', 'sonic-boom'],
  body: `
Just above the [[critical-mach|critical Mach number]] a small bubble of supersonic air rides on the upper surface of the wing. Supersonic flow cannot slow down smoothly to the subsonic flow behind it, so the bubble ends in a nearly [[normal-shock|normal shock wave]]. The flow is now **transonic** — subsonic and supersonic at once — and it stays so from roughly Mach 0.8 to 1.2 for a whole aircraft.

### As the Mach number rises
1. **A pocket and a weak shock.** Just above $M_{crit}$ the losses are small and the drag hardly changes.
2. **Drag divergence.** The pocket grows, the shock strengthens and moves aft. A normal shock at a local Mach number of 1.3 raises the pressure by 80 % and costs some stagnation pressure: that loss is **wave drag**. The drag rises steeply; the **drag-divergence Mach number** $M_{dd}$ is defined as the point where $dC_D/dM = 0.1$ (the Boeing definition) or where the drag has grown by 20 counts, 0.0020 (the Douglas one).
3. **Shock-induced separation.** The pressure jump is a violent adverse gradient. When the local Mach number ahead of the shock exceeds about 1.3, the [[boundary-layer|boundary layer]] separates at the shock's foot. The separated flow is unsteady, the shock oscillates, and the wing and tail shake: **buffet**. A control surface behind an oscillating shock can start to oscillate too (aileron buzz).
4. **Through Mach 1.** The upper and lower shocks reach the trailing edge and a bow shock appears ahead of the nose. The drag coefficient peaks near Mach 1 and falls somewhat as the flow becomes fully supersonic.

### Why the nose drops: Mach tuck
As the upper shock moves aft, the lift is carried further back, the [[center-of-pressure|centre of pressure]] moves aft and a nose-down [[pitching-moment|pitching moment]] grows; on swept wings, early separation near the tips adds to it. Left alone the aircraft pitches down, speeds up and tucks further. In the early 1940s fighters in steep dives met this with elevators that had lost their power behind shocks. Jet transports carry a *Mach trim* system that adds nose-up trim as the Mach number rises.

### Estimating $M_{dd}$
An empirical fit, the **Korn equation**, captures the effects of section technology, thickness, lift and sweep:

$$M_{dd} = \\frac{\\kappa_A}{\\cos\\Lambda} - \\frac{\\tau}{\\cos^2\\Lambda} - \\frac{c_l}{10\\cos^3\\Lambda}$$

with $\\kappa_A \\approx 0.87$ for older NACA 6-series sections and about 0.95 for supercritical ones, $\\tau = t/c$ and $\\Lambda$ the sweep. Above $M_{crit} \\approx M_{dd} - 0.108$ the wave drag grows roughly as **Lock's fourth-power law**, $\\Delta C_{D,w} = 20\\,(M - M_{crit})^4$.

| 12 % thick, $c_l$ = 0.5 | $M_{dd}$ (Korn) | $M_{crit}$ |
|---|---|---|
| Straight, conventional section | 0.70 | 0.59 |
| Straight, supercritical section | 0.78 | 0.67 |
| Swept 25°, supercritical section | 0.84 | 0.73 |

### The cures
Thin sections; [[swept-wing-compressibility|sweep]]; **supercritical airfoils** — flat-topped sections, developed by Richard Whitcomb at NASA in the 1960s, whose long supersonic region decelerates gently and ends in a weak shock, with aft camber to recover the lift (see [[special-airfoils]]); and the [[area-rule|area rule]] for the aircraft as a whole. Airliners cruise at or a little below $M_{dd}$, typically Mach 0.78–0.85.

At high altitude the low-speed stall buffet and the high-speed Mach buffet close in on each other: the narrow band between them was the "coffin corner" of the U-2 and limits heavy airliners near their [[ceiling]].

> [!warn] Buffet boundaries, maximum operating Mach numbers ($M_{MO}$) and Mach-trim requirements belong to each aircraft type. Flying near them follows the aircraft's approved flight manual and the crew's training, not the rounded figures on this page.
`,
  ideas: [
    'Transonic flow mixes subsonic and supersonic regions; the supersonic pocket on a wing ends in a nearly normal shock.',
    'As the Mach number rises the shock strengthens and moves aft; drag diverges steeply at M_dd, roughly 0.1 above M_crit.',
    'A strong shock separates the boundary layer at its foot, causing buffet, buzz and loss of control effectiveness.',
    'The aft-moving shock carries lift aft and pitches the nose down: Mach tuck, countered by Mach trim.',
    'Thin and supercritical sections, sweep and the area rule raise M_dd; the Korn equation estimates it.'
  ],
  pitfalls: [
    'The sound barrier is a physical wall at exactly Mach 1 — The drag rise starts below Mach 1 and peaks near it; with enough thrust and a good shape an aircraft passes through smoothly, as every supersonic aircraft does.',
    'Transonic drag comes from friction heating — It is wave drag, the stagnation-pressure loss in shocks, plus the extra pressure drag of boundary layers separated by them.',
    'Buffet is simply a stall — Mach buffet can happen at small angles of attack and high speed; it is unsteady separation behind a shock, although near the ceiling it lies close to the low-speed stall buffet.'
  ],
  formulas: [
    {
      name: 'Korn equation for the drag-divergence Mach number',
      expr: 'Mdd = kA/cos(Lambda) - tau/cos(Lambda)^2 - cl/(10*cos(Lambda)^3)',
      tex: 'M_{dd} = \\dfrac{\\kappa_A}{\\cos\\Lambda} - \\dfrac{\\tau}{\\cos^2\\Lambda} - \\dfrac{c_l}{10\\cos^3\\Lambda}',
      vars: {
        Mdd: { name: 'drag-divergence Mach number', tex: 'M_{dd}' },
        kA: { name: 'airfoil technology factor (0.87 conventional, 0.95 supercritical)', value: 0.95, min: 0.8, max: 1, tex: '\\kappa_A' },
        Lambda: { name: 'wing sweep', q: 'angle', unit: '°', value: 25, min: 0, max: 60, tex: '\\Lambda' },
        tau: { name: 'thickness ratio t/c (streamwise)', q: 'ratio', unit: '%', value: 12, min: 2, max: 25, tex: '\\tau' },
        cl: { name: 'lift coefficient', value: 0.5, min: 0, max: 1.2, tex: 'c_l' }
      },
      note: 'An empirical fit, good to a few hundredths in the range of real transport wings (Mach 0.6–0.9).',
      practice: { unknowns: ['Mdd', 'tau', 'cl'] },
      stories: {
        Mdd: 'A wing with {Lambda} of sweep, a section of technology factor {kA} and thickness {tau} flies at a lift coefficient of {cl}. Estimate its drag-divergence Mach number.',
        tau: 'A designer wants a drag-divergence Mach number of {Mdd} from a wing with {Lambda} of sweep, technology factor {kA} and lift coefficient {cl}. How thick may the sections be?'
      }
    },
    {
      name: "Lock's fourth-power law for wave drag",
      expr: 'dCD = 20*(M - Mcr)^4', tex: '\\Delta C_{D,w} = 20\\,(M - M_{crit})^4',
      vars: {
        dCD: { name: 'wave-drag coefficient', tex: '\\Delta C_{D,w}' },
        M: { name: 'flight Mach number', value: 0.8, min: 0.3, max: 1.2, tex: 'M' },
        Mcr: { name: 'critical Mach number', value: 0.72, min: 0.3, max: 1, tex: 'M_{crit}' }
      },
      note: 'For M above M_crit only (take the root with M > M_crit); with M_crit = M_dd − 0.108 it gives dC_D/dM = 0.1 at M_dd. One drag count is 0.0001.',
      stories: { dCD: 'A wing has a critical Mach number of {Mcr}. Estimate its wave-drag coefficient at Mach {M}.' }
    }
  ],
  examples: [
    {
      title: 'Three wings and the Korn equation',
      q: 'Three wings have 12 % thick sections and fly at $c_l = 0.5$: (a) straight, conventional section; (b) straight, supercritical section; (c) swept 25°, supercritical section. Estimate $M_{dd}$ for each.',
      steps: [
        '(a) $0.87 - 0.12 - 0.05 = 0.70$.',
        '(b) $0.95 - 0.12 - 0.05 = 0.78$.',
        '(c) $\\cos 25° = 0.906$: $0.95/0.906 - 0.12/0.821 - 0.5/(10 \\times 0.744) = 1.048 - 0.146 - 0.067 = 0.835$.'
      ],
      a: '0.70, 0.78 and 0.84: section technology and sweep together gain about 0.13 in Mach number.'
    },
    {
      title: 'The price of flying a little too fast',
      q: 'Wing (c) above has $M_{dd} = 0.835$. With Lock\'s law and $M_{crit} = M_{dd} - 0.108$, compare its wave drag at Mach 0.835 and 0.85. The aircraft\'s other drag totals $C_D = 0.025$.',
      steps: [
        '$M_{crit} = 0.835 - 0.108 = 0.727$.',
        'At 0.835: $\\Delta C_{D,w} = 20 \\times 0.108^4 = 0.0027$, 27 counts: about 11 % of the other drag.',
        'At 0.85: $20 \\times 0.123^4 = 0.0045$, 45 counts: 18 %.',
        'For 1.8 % more speed the total drag coefficient rises from 0.0277 to 0.0295, by 6.5 % — and the wave drag keeps growing faster with every further step.'
      ],
      a: 'Wave drag rises from 27 to 45 counts — which is why airliners cruise at or a little below M_dd.'
    }
  ],
  quiz: [
    { q: 'On a wing flying a little above its critical Mach number, the supersonic region on the upper surface ends…', choices: ['in an expansion fan', 'in a nearly normal shock wave', 'gradually, without any shock', 'at the leading edge'], a: 1,
      why: 'Supersonic flow can only return to subsonic through a shock; on the wing it is a nearly normal shock standing on the surface.' },
    { q: 'As the flight Mach number rises through the transonic range, the upper-surface shock moves…', choices: ['forward, towards the leading edge', 'aft, towards the trailing edge', 'off the wing into the wake immediately', 'nowhere; it stays at mid-chord'], a: 1,
      why: 'The supersonic pocket grows and the shock moves aft, reaching the trailing edge near Mach 1. That aft shift of lift is what causes Mach tuck.' },
    { q: 'With the Korn equation, what is $M_{dd}$ of an unswept 10 % thick supercritical section ($\\kappa_A = 0.95$) at $c_l = 0.4$?', answer: 0.81, tol: 0.01,
      why: '$0.95 - 0.10 - 0.4/10 = 0.81$.' },
    { q: 'Mach tuck is a nose-up pitching tendency at high Mach number.', a: false,
      why: 'It is nose-down: the centre of pressure moves aft as the shock moves aft, and a swept wing may lose lift near its tips.' },
    { q: 'Which of these does NOT raise the drag-divergence Mach number?', choices: ['a thinner section', 'more sweep', 'a supercritical section', 'a higher lift coefficient'], a: 3,
      why: 'More lift means a deeper suction peak and an earlier, stronger shock: $M_{dd}$ falls by about 0.1 per unit of $c_l$.' }
  ],
  problems: [
    { q: 'By Lock\'s law, how much wave drag, in drag counts (units of 0.0001), does a wing with $M_{crit} = 0.70$ have at Mach 0.80?', answer: 20, tol: 0.02,
      steps: ['$\\Delta C_{D,w} = 20 \\times (0.80 - 0.70)^4 = 20 \\times 10^{-4} = 0.0020$.', 'That is 20 drag counts — the Douglas definition of drag divergence.'] }
  ],
  applications: [
    'Setting the cruise Mach number of jet transports, typically 0.78–0.85, just below drag divergence.',
    'Mach-trim systems and buffet-boundary charts in airliner flight manuals.',
    'Propeller, fan and helicopter rotor tips, which run transonic.',
    'Transonic wind tunnels with slotted walls and transonic CFD in wing design.'
  ],
  history: 'The Bell X-1, flown by Chuck Yeager, passed Mach 1 in level flight on 14 October 1947, reaching Mach 1.06 at about 13 km. Its whole horizontal tail could be trimmed — a lesson from earlier aircraft whose elevators had become useless behind shocks. Richard Whitcomb\'s supercritical airfoil, flight-tested on a modified F-8 in the early 1970s, is now on nearly every jet transport.',
  sim: ['hst-drag-rise', { id: 'hst-mcrit', params: { M: 0.8 } }]
},

/* ================================================================ area rule */
{
  id: 'area-rule', parent: 'transonic-supersonic', title: 'The area rule', level: 2,
  short: 'Near the speed of sound the wave drag of a whole aircraft depends mainly on how its total cross-sectional area grows and shrinks from nose to tail. Smooth that area curve — by waisting the fuselage where the wing joins it — and the wave drag falls: Whitcomb\'s area rule.',
  keywords: ['area rule', 'Whitcomb area rule', 'transonic area rule', 'supersonic area rule', 'coke bottle', 'coke-bottle fuselage', 'wasp waist', 'Sears–Haack body', 'Sears-Haack', 'wave drag', 'cross-sectional area distribution', 'equivalent body of revolution', 'F-102', 'slender-body theory'],
  prereq: ['transonic-flow', 'wave-drag', 'mach-cone'],
  related: ['critical-mach', 'swept-wing-compressibility', 'supersonic-airfoils', 'delta-wings', 'sonic-boom', 'streamlining'],
  body: `
In 1952 Richard Whitcomb, working in NACA Langley's new slotted-throat transonic tunnel, found that near Mach 1 the drag of a wing–body combination looks very much like the drag of a smooth body of revolution with the same **distribution of cross-sectional area** along its length. The air, pushed aside by the whole aircraft at once, cannot tell a wing from a fuselage bulge of the same area. What matters is the curve $A(x)$: the area of each slice cut across the aircraft, from nose to tail.

### Why the area curve matters
Near Mach 1 disturbances spread far sideways, and the flow reacts to how quickly the aircraft's displaced volume changes along its length. Slender-body theory gives the wave drag directly from that curve:

$$\\frac{D}{q} = -\\frac{1}{2\\pi}\\int_0^{\\ell}\\int_0^{\\ell} A''(x_1)\\,A''(x_2)\\,\\ln|x_1 - x_2|\\;dx_1\\,dx_2$$

Humps and kinks in $A(x)$ — places where the area changes quickly — are what cost drag. A wing added to a smooth fuselage makes a sudden hump, and the combination can have two or three times the wave drag of the fuselage alone.

### The cure: the waisted fuselage
Take the wing's area out of the fuselage where the wing sits, and the total $A(x)$ becomes smooth again. Convair's YF-102 delta fighter would not go supersonic in level flight in 1953; the reworked YF-102A — fuselage waisted, nose lengthened, bulges added behind the wing — passed Mach 1 in a climb within days of its first flight in December 1954. Grumman's F11F Tiger was designed around the rule from the start, and the Convair 990 airliner carried streamlined pods behind its wing to smooth the fall of its area curve.

### The ideal shape: Sears–Haack
For a given length $\\ell$ and volume $V$ the body with the least wave drag, found by Sears and Haack in the 1940s, is pointed at both ends with $A(x) \\propto [4\\xi(1-\\xi)]^{3/2}$, where $\\xi = x/\\ell$:

$$\\frac{D}{q} = \\frac{128\\,V^2}{\\pi\\,\\ell^4} = \\frac{9\\pi}{2}\\,\\frac{A_{\\max}^2}{\\ell^2}$$

Length is everything: at the same volume, twice the length gives one sixteenth of the wave drag. Designers aim to make the whole aircraft's area curve look as much like a Sears–Haack curve as they can.

| An F-102-like delta, 20 m long (slender-body theory) | $D/q$ | Wave drag near Mach 1 at 11 km |
|---|---|---|
| Fuselage alone | 1.0 m² | 16 kN |
| Wing and fin added, straight fuselage | 2.8 m² | 44 kN |
| Fuselage waisted by the wing and fin area | 1.0 m² | 16 kN |
| Sears–Haack body of the same length and volume | 0.56 m² | 9 kN |

### The supersonic area rule
Above Mach 1 the slices that matter are not square to the axis but inclined at the [[mach-cone|Mach angle]]; the wave drag comes from averaging the area curves cut by such oblique planes all round the aircraft. The principle is unchanged: smooth the areas, and spread the volume over as much length as possible. It shaped Concorde, supersonic fighters, and the long slender noses of today's low-boom designs (see [[sonic-boom]]).
`,
  ideas: [
    'Near Mach 1 the wave drag of an aircraft depends mainly on its total cross-sectional area distribution A(x).',
    'Humps and kinks in A(x) cost drag; a wing makes a hump unless the fuselage is waisted to compensate.',
    'The Sears–Haack body has the least wave drag for its length and volume: D/q = 128V²/(πℓ⁴).',
    'At fixed volume the wave drag falls as the fourth power of length: slenderness is everything.',
    'Above Mach 1 the slices are taken along Mach planes: the supersonic area rule.'
  ],
  pitfalls: [
    'The area rule works by reducing frontal area — What matters is how smoothly the area grows and shrinks along the length; the F-102A\'s fix added bulges behind the wing as well as a waist.',
    'The area rule helps at all speeds — It is a transonic and supersonic effect; at low subsonic speeds there is no wave drag to save.',
    'Only the fuselage shape matters — Every part adds to A(x): wings, tails, canopy, engine nacelles, pylons and external stores.'
  ],
  formulas: [
    {
      name: 'Sears–Haack body: wave drag from length and largest section',
      expr: 'D = 4.5*pi*q*Amax^2/l^2', tex: 'D = \\dfrac{9\\pi}{2}\\, q\\, \\dfrac{A_{\\max}^2}{l^2}',
      vars: {
        D: { name: 'wave drag', q: 'force', unit: 'kN' },
        q: { name: 'dynamic pressure', q: 'pressure', unit: 'kPa', value: 15.8 },
        Amax: { name: 'largest cross-sectional area', q: 'area', unit: 'm²', value: 3.14, tex: 'A_{\\max}' },
        l: { name: 'body length', q: 'length', unit: 'm', value: 20, tex: 'l' }
      },
      note: 'Slender-body theory near Mach 1; the least wave drag of any body with that length and largest section. Real aircraft have several times more. q = 15.8 kPa is Mach 1 at 11 000 m.',
      stories: {
        D: 'A slender body {l} long with a largest cross-section of {Amax} has the ideal Sears–Haack shape. What is its wave drag at a dynamic pressure of {q}?',
        l: 'How long must a Sears–Haack body with a largest section of {Amax} be to have only {D} of wave drag at a dynamic pressure of {q}?'
      }
    },
    {
      name: 'Sears–Haack body: wave drag from length and volume',
      expr: 'D = 128*q*Vol^2/(pi*l^4)', tex: 'D = \\dfrac{128\\, q\\, V^2}{\\pi\\, l^4}',
      vars: {
        D: { name: 'wave drag', q: 'force', unit: 'kN' },
        q: { name: 'dynamic pressure', q: 'pressure', unit: 'kPa', value: 15.8 },
        Vol: { name: 'volume enclosed', q: 'volume', unit: 'm³', value: 46.7, tex: 'V' },
        l: { name: 'body length', q: 'length', unit: 'm', value: 20, tex: 'l' }
      },
      note: 'At fixed volume the wave drag falls as the fourth power of length.',
      stories: { D: 'A fuselage must hold {Vol} and be {l} long. What is the least wave drag it can have at a dynamic pressure of {q}?' }
    }
  ],
  examples: [
    {
      title: 'An ideal 20 m fuselage',
      q: 'A Sears–Haack body is 20 m long with a largest section of 3.14 m² (2 m across). What is its wave drag near Mach 1 at 11 000 m, where $q = 15.8$ kPa?',
      steps: [
        '$D/q = \\tfrac{9\\pi}{2} \\times 3.14^2/20^2 = 14.14 \\times 9.86/400 = 0.348$ m².',
        '$D = 0.348 \\times 15\\,800 = 5.5$ kN.',
        'Check with the volume, $V = \\tfrac{3\\pi}{16} A_{\\max}\\,l = 37$ m³: $128 \\times 37^2/(\\pi \\times 20^4) = 0.349$ m².'
      ],
      a: 'About 5.5 kN — the least any body of that length and section can have.'
    },
    {
      title: 'Longer rather than thinner',
      q: 'Keep the 37 m³ of the body above but stretch it to 25 m. What happens to the wave drag?',
      steps: ['At fixed volume $D \\propto l^{-4}$: $(20/25)^4 = 0.41$.', '$D/q = 0.41 \\times 0.348 = 0.143$ m², so $D = 2.3$ kN.'],
      a: 'A quarter more length cuts the wave drag by 59 %, to about 2.3 kN.'
    }
  ],
  quiz: [
    { q: 'According to the area rule, the transonic wave drag of an aircraft depends mainly on…', choices: ['its wetted area', 'its frontal area alone', 'how its cross-sectional area varies along its length', 'its wing loading'], a: 2,
      why: 'Near Mach 1 the flow responds to the distribution of area along the length, $A(x)$; its humps and kinks cost drag.' },
    { q: 'At the same volume, doubling the length of a Sears–Haack body divides its wave drag by…', answer: 16, tol: 0.02,
      why: '$D/q = 128V^2/(\\pi l^4)$: doubling $l$ divides it by $2^4 = 16$.' },
    { q: 'Whitcomb\'s fix for the F-102 included waisting the fuselage where the wing joins it.', a: true,
      why: 'The YF-102A had a waisted ("coke-bottle") fuselage, a longer nose and bulges behind the wing, which smoothed its area curve.' },
    { q: 'Why did the streamlined pods behind the wing of the Convair 990 reduce its drag at high subsonic speed?', choices: ['they made lift', 'they smoothed the fall of the cross-sectional area behind the wing', 'they energised the boundary layer', 'they carried fuel to move the centre of gravity'], a: 1,
      why: 'They filled in the sudden drop in $A(x)$ where the wing ends, which is what the area rule asks for.' }
  ],
  problems: [
    { q: 'A Sears–Haack body is 30 m long and encloses 60 m³. What is its wave-drag area $D/q$ near Mach 1?', answer: 0.181, unit: 'm²', tol: 0.02,
      steps: ['$D/q = 128 V^2/(\\pi l^4) = 128 \\times 3600/(\\pi \\times 810\\,000)$.', '$= 460\\,800/2\\,544\\,700 = 0.181$ m².'] }
  ],
  applications: [
    'Transonic and supersonic fighters, whose fuselages, canopies and intakes are shaped around the wing\'s area.',
    'Placing engine nacelles, pylons, pods and fuel tanks on transports and business jets.',
    'Missiles, projectiles and fuel tanks with near Sears–Haack shapes.',
    'Supersonic transport studies, where the supersonic area rule also shapes the sonic boom.'
  ],
  history: 'Richard Whitcomb found the rule in 1952 and received the Collier Trophy for it; similar ideas had appeared in wartime Germany, in work at Junkers, and Wallace Hayes had derived the supersonic version in his 1947 thesis. The Sears–Haack body is named after William Sears in the United States and Wolfgang Haack in Germany, who found it independently in the 1940s.',
  sim: 'hst-area-rule'
},

/* ================================================================ sweep and compressibility */
{
  id: 'swept-wing-compressibility', parent: 'transonic-supersonic', title: 'Sweep and compressibility', level: 2,
  short: 'Sweeping a wing makes its sections feel only the part of the flow normal to the leading edge, M cos Λ, which delays the critical Mach number and the drag rise. At supersonic speed, enough sweep keeps the leading edge inside the Mach cone, where it behaves subsonically.',
  keywords: ['sweep', 'swept wing', 'sweepback', 'forward sweep', 'normal Mach number', 'M cos Lambda', 'simple sweep theory', 'infinite yawed wing', 'Busemann', 'R. T. Jones', 'subsonic leading edge', 'supersonic leading edge', 'sonic leading edge', 'Mach cone', 'Mach angle'],
  prereq: ['sweep', 'critical-mach', 'mach-cone'],
  related: ['transonic-flow', 'area-rule', 'delta-wings', 'supersonic-airfoils', 'stall-patterns', 'wing-planform', 'dutch-roll', 'flutter'],
  body: `
### The yawed wing
Picture a very long straight wing set at an angle $\\Lambda$ to the stream. Split the free-stream velocity into a part normal to the leading edge, $V\\cos\\Lambda$, and a part along it, $V\\sin\\Lambda$. On an endless wing nothing changes along the span, so the spanwise part slides past without making any pressure difference; only the normal part does. The airfoil sections behave as if they were flying at

$$M_n = M\\cos\\Lambda$$

This is **simple sweep theory**. An airliner at Mach 0.85 with 30° of sweep has sections that feel Mach 0.74.

### What sweep buys, and what it costs
On the ideal yawed wing the critical and drag-divergence Mach numbers rise as $1/\\cos\\Lambda$: a section good for Mach 0.70 unswept becomes good for 0.81 at 30°. Real wings get less. The section normal to the leading edge is shorter, so relatively thicker ($\\tau/\\cos\\Lambda$); it carries more lift per unit of its own dynamic pressure ($c_l/\\cos^2\\Lambda$); and near the root and the tips the isobars unsweep. The [[transonic-flow|Korn equation]] contains the first two effects.

The price is paid elsewhere. The lift slope falls roughly as $\\cos\\Lambda$ and $C_{L,\\max}$ falls too; the boundary layer drifts outboard, so the tips tend to stall first (hence fences, vortex generators and washout, see [[stall-patterns]]); the wing is heavier and twists under load; and the [[dutch-roll|Dutch roll]] is harder to damp.

| Aircraft (typical) | Sweep | Cruise Mach | $M\\cos\\Lambda$ |
|---|---|---|---|
| Turboprop airliner | ≈ 0° | 0.45 | 0.45 |
| Narrow-body jet (quarter-chord) | ≈ 25° | 0.78 | 0.71 |
| Long-range wide-body (quarter-chord) | ≈ 32° | 0.85 | 0.72 |
| Concorde, inboard leading edge | ≈ 75° | 2.02 | 0.52 |

### Supersonic: inside or outside the Mach cone
Above Mach 1 a disturbance spreads only downstream, inside the [[mach-cone|Mach cone]] of half-angle $\\mu = \\arcsin(1/M)$. If the leading edge lies behind the Mach cone from the wing's apex — that is, if $M\\cos\\Lambda < 1$ — the flow normal to the edge is subsonic: a **subsonic leading edge**. Air can flow round it as on a subsonic wing; it can be rounded and can carry leading-edge suction, which is why Concorde and many [[delta-wings|delta wings]] have such highly swept edges. If $M\\cos\\Lambda > 1$ the edge is **supersonic**: it carries its own attached shock and must be sharp, like the thin straight wing of the F-104 (see [[supersonic-airfoils]]). The boundary, the *sonic* leading edge, is at

$$\\Lambda = \\arccos\\frac{1}{M}$$

— 48° at Mach 1.5 and 60° at Mach 2.

> [!note] Sweeping forward works just as well for compressibility — only $\\cos\\Lambda$ matters — and the HFB 320 Hansa Jet and the X-29 flew that way. But a forward-swept wing twists nose-up as it bends, which feeds the load: it needs a very stiff structure to stay clear of divergence (see [[flutter]]).
`,
  ideas: [
    'On a swept wing the sections feel mainly the flow normal to the leading edge: M_n = M cos Λ.',
    'Ideally, sweep raises the critical and drag-divergence Mach numbers as 1/cos Λ; real wings get somewhat less.',
    'Sweep costs lift slope, maximum lift, structural weight and a tendency to stall at the tips.',
    'Supersonic: a leading edge swept inside the Mach cone (M cos Λ < 1) is subsonic and may be rounded; outside it is supersonic and must be sharp.'
  ],
  pitfalls: [
    'Sweep works because the wing is more streamlined, like an arrowhead — It works because the pressures depend on the velocity component normal to the leading edge; the spanwise component slides along without making pressure.',
    'Sweeping a wing 30° raises its drag-divergence Mach number by the full factor 1/cos 30° = 1.155 — That is the ideal for an endless wing; the relatively thicker, more heavily loaded normal section and the root and tip effects give less.',
    'Swept wings only matter for supersonic aircraft — Most swept wings are transonic: nearly every jet transport is swept 25–35° to cruise at Mach 0.78–0.86 without heavy wave drag.'
  ],
  formulas: [
    {
      name: 'Normal Mach number of a swept wing',
      expr: 'Mn = M*cos(Lambda)', tex: 'M_n = M\\cos\\Lambda',
      vars: {
        Mn: { name: 'Mach number normal to the leading edge', tex: 'M_n' },
        M: { name: 'flight Mach number', value: 0.85, min: 0, max: 5, tex: 'M' },
        Lambda: { name: 'sweep angle', q: 'angle', unit: '°', value: 30, min: 0, max: 85, tex: '\\Lambda' }
      },
      note: 'Simple sweep theory for a long wing of constant section; the sweep of the quarter-chord or shock line is what counts in practice.',
      stories: {
        Mn: 'A wing swept {Lambda} flies at Mach {M}. What Mach number do its sections feel?',
        Lambda: 'An airliner is to cruise at Mach {M} but its sections should feel only Mach {Mn}. How much sweep does it need?'
      }
    },
    {
      name: 'Critical Mach number of an ideal swept wing',
      expr: 'Mcs = Mc0/cos(Lambda)', tex: 'M_{crit,\\Lambda} = \\dfrac{M_{crit,0}}{\\cos\\Lambda}',
      vars: {
        Mcs: { name: 'critical Mach number of the swept wing', tex: 'M_{crit,\\Lambda}' },
        Mc0: { name: 'critical Mach number of the unswept section', value: 0.7, min: 0.3, max: 0.95, tex: 'M_{crit,0}' },
        Lambda: { name: 'sweep angle', q: 'angle', unit: '°', value: 30, min: 0, max: 80, tex: '\\Lambda' }
      },
      note: 'An upper limit: real finite wings gain less, especially near the root and the tips.',
      stories: { Mcs: 'A section has a critical Mach number of {Mc0} unswept. What is the ideal critical Mach number of a wing built from it with {Lambda} of sweep?' }
    },
    {
      name: 'Sweep for a sonic leading edge',
      expr: 'Lambda = acos(1/M)', tex: '\\Lambda = \\arccos\\dfrac{1}{M}',
      vars: {
        Lambda: { name: 'leading-edge sweep at which the edge is sonic', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\Lambda' },
        M: { name: 'flight Mach number', value: 2, min: 1, max: 10, tex: 'M' }
      },
      note: 'More sweep than this gives a subsonic leading edge (inside the Mach cone); less gives a supersonic one.',
      stories: {
        Lambda: 'An aircraft is to cruise at Mach {M}. What leading-edge sweep puts its leading edge exactly on the Mach cone?',
        M: 'A delta wing has a leading-edge sweep of {Lambda}. Up to what Mach number is its leading edge subsonic?'
      }
    }
  ],
  examples: [
    {
      title: 'What an airliner\'s sections feel',
      q: 'An airliner cruises at Mach 0.85 with 30° of sweep. Its sections have a critical Mach number of 0.70 when unswept. What Mach number do they feel, and what is the ideal critical Mach number of the wing?',
      steps: ['$M_n = 0.85 \\times \\cos 30° = 0.85 \\times 0.866 = 0.736$.', 'Ideal swept-wing value: $0.70/0.866 = 0.808$.', 'The sections are slightly supercritical: a weak shock sits on the wing, as on most jet transports in cruise.'],
      a: 'M_n ≈ 0.74; the ideal critical Mach number is 0.81, and the real wing gains somewhat less.'
    },
    {
      title: 'Concorde\'s leading edge',
      q: 'Concorde cruised at Mach 2.02, with an inboard leading-edge sweep of about 75°. Is that leading edge subsonic?',
      steps: ['Sonic leading edge: $\\Lambda = \\arccos(1/2.02) = \\arccos 0.495 = 60.3°$.', 'Mach angle: $\\mu = \\arcsin(1/2.02) = 29.7°$, and $90° - 29.7° = 60.3°$ — the same condition.', '75° is more than 60.3°, so the edge lies inside the Mach cone: $M\\cos\\Lambda = 2.02 \\times 0.259 = 0.52$.'],
      a: 'Yes: the normal Mach number is only about 0.52, so the inboard leading edge is subsonic and could be rounded.'
    }
  ],
  quiz: [
    { q: 'A wing swept 35° flies at Mach 0.85. What Mach number do its sections feel?', answer: 0.696, tol: 0.02,
      why: '$M_n = 0.85\\cos 35° = 0.85 \\times 0.819 = 0.696$.' },
    { q: 'Which part of the free stream does little to the pressure distribution of a long swept wing?', choices: ['the part normal to the leading edge', 'the part along the span', 'the vertical part', 'none; all parts matter equally'], a: 1,
      why: 'Along an endless wing nothing changes in the spanwise direction, so the spanwise component makes no pressure difference; it only affects the boundary layer.' },
    { q: 'At Mach 2, a wing with a leading-edge sweep of 70° has…', choices: ['a supersonic leading edge', 'a subsonic leading edge', 'no Mach cone', 'a detached shock at every station'], a: 1,
      why: 'The sonic sweep at Mach 2 is arccos(0.5) = 60°. With 70° the edge lies inside the Mach cone: $M\\cos\\Lambda = 0.68 < 1$.' },
    { q: 'Sweeping a wing forward by 30° gives the same normal Mach number as sweeping it back by 30°.', a: true,
      why: 'Only $\\cos\\Lambda$ enters. Forward sweep has other problems — structural divergence — but not in compressibility.' }
  ],
  problems: [
    { q: 'What is the least leading-edge sweep that gives a subsonic leading edge at Mach 1.4?', answer: 44.4, unit: '°', tol: 0.02,
      steps: ['$\\Lambda = \\arccos(1/1.4) = \\arccos 0.714$.', '$= 44.4°$: any more sweep puts the edge inside the Mach cone.'] }
  ],
  applications: [
    'Jet transports: 25–35° of sweep combined with supercritical sections.',
    'Supersonic aircraft with highly swept delta and ogee wings, such as Concorde.',
    'Variable-sweep wings (F-14, Tornado, B-1) trading low-speed lift against high-speed drag.',
    'Swept propeller, fan and compressor blades, for the same reason.'
  ],
  history: 'Adolf Busemann presented swept wings for supersonic flight at the Volta Conference in Rome in 1935; the idea drew little notice outside Germany, where it was developed during the war. Robert T. Jones reached it independently at NACA Langley early in 1945, for flight below the speed of sound too. Within a few years the swept-wing F-86 Sabre and MiG-15 were flying.',
  sim: ['hst-sweep', { id: 'hst-drag-rise', params: { M: 0.8, sweep: 30 } }]
},

/* ================================================================ supersonic airfoils */
{
  id: 'supersonic-airfoils', parent: 'transonic-supersonic', title: 'Supersonic airfoils', level: 3,
  short: 'In supersonic flow an airfoil makes lift and wave drag through shocks and expansion fans. Thin, sharp-edged sections such as the diamond and the biconvex arc work best; Ackeret\'s linear theory gives c_l = 4α/√(M² − 1) and a wave drag that grows with the square of both angle and thickness.',
  keywords: ['supersonic airfoil', 'diamond airfoil', 'double wedge', 'biconvex airfoil', 'circular arc', 'Ackeret theory', 'linear supersonic theory', 'shock-expansion theory', 'wave drag', 'thickness ratio', 'supersonic lift slope', 'centre of pressure', 'Busemann biplane', 'sharp leading edge', 'F-104'],
  prereq: ['oblique-shock', 'expansion-fans', 'wave-drag', 'pressure-coefficient'],
  related: ['swept-wing-compressibility', 'area-rule', 'mach-cone', 'sonic-boom', 'thin-airfoil-theory', 'lift-to-drag', 'hypersonic-flight', 'neutral-point'],
  body: `
A subsonic airfoil has a round nose and a gently curved back because the air ahead of it is warned by pressure waves and starts to turn early. In supersonic flow no warning travels upstream. Each surface turns the flow abruptly: through an [[oblique-shock|oblique shock]] where the surface turns into the stream, and through a [[expansion-fans|Prandtl–Meyer expansion fan]] where it turns away. A round nose would stand a detached bow shock off itself, with a patch of subsonic, high-pressure air behind it — nothing but drag. So supersonic sections are **thin and sharp**: the double wedge or diamond, the biconvex or circular-arc section, and thin sections with sharpened noses.

### Shock-expansion theory
For a section made of flat faces the inviscid flow can be built exactly, face by face. Take a diamond of half-angle $\\varepsilon$ at angle of attack $\\alpha$:

- **Front faces.** The upper face turns the stream by $\\varepsilon - \\alpha$ — through a shock if that is positive, a fan if negative; the lower face by $\\varepsilon + \\alpha$, through a shock.
- **Shoulders.** Each surface turns away by $2\\varepsilon$ through an expansion fan, and the pressure falls.
- **Trailing edge.** Shocks or fans bring the two streams to one pressure and direction, separated by a slip line.

Each face carries a uniform pressure, and the forces follow by adding pressure × area. At Mach 2 with $\\alpha$ = 2° and $\\varepsilon$ = 3°, the upper faces carry $p/p_\\infty$ = 1.06 and 0.75, the lower 1.32 and 0.95; $c_l$ = 0.081 and $c_d$ = 0.0092.

### Ackeret's linear theory
For small angles the pressure coefficient on a surface inclined at $\\theta$ to the stream is simply

$$C_p = \\frac{2\\theta}{\\sqrt{M_\\infty^2 - 1}}$$

positive where the surface faces into the stream, negative where it faces away. Adding it up around a thin section gives

$$c_l = \\frac{4\\alpha}{\\sqrt{M^2-1}}, \\qquad c_d = \\frac{4}{\\sqrt{M^2-1}}\\left(\\alpha^2 + \\overline{y'^2}\\right)$$

where $\\overline{y'^2}$ is the mean square of the surface slopes. For a diamond of thickness ratio $\\tau$ it is $\\tau^2$, for a biconvex section $\\tfrac43\\tau^2$: for its thickness the diamond has the least wave drag. For the example above Ackeret gives $c_l$ = 0.081 and $c_d$ = 0.0092, within 1 % of shock-expansion theory.

### What linear theory teaches
- **The lift slope falls with Mach number**: 0.062 per degree at Mach 1.5, 0.040 at Mach 2, 0.025 at Mach 3 — against about 0.11 for a subsonic section.
- **Thickness and camber cost wave drag even at zero lift**; in linear theory camber makes no lift at all.
- **The best lift-to-drag ratio** of a diamond comes at $\\alpha = \\tau$ and equals $1/(2\\tau)$: 9.5 for a 5 % section, before friction. Supersonic wings are 3–5 % thick.
- **The centre of pressure moves to mid-chord**, from the quarter chord in subsonic flow. Accelerating through the transonic range an aircraft's lift moves aft by roughly a quarter of the chord, and it needs more nose-up trim (see [[neutral-point]]).

> [!note] Real supersonic wings are swept or of low aspect ratio, and much of their span may lie inside the Mach cone where the flow is locally subsonic (see [[swept-wing-compressibility]]). The two-dimensional theory here applies to the parts with supersonic leading edges, and to fins, blades and missile wings.
`,
  ideas: [
    'Supersonic flow turns only through shocks (compression) and expansion fans; supersonic sections are thin with sharp leading edges.',
    'Shock-expansion theory solves a flat-faced section such as the diamond exactly, face by face.',
    'Ackeret: C_p = 2θ/√(M² − 1), so c_l = 4α/√(M² − 1) and c_d = 4(α² + mean-square slope)/√(M² − 1).',
    'Angle of attack and thickness both cost wave drag; the best L/D of a diamond is about 1/(2τ), at α ≈ τ.',
    'In supersonic flow the centre of pressure sits near mid-chord.'
  ],
  pitfalls: [
    'A supersonic airfoil should have a rounded nose like a subsonic one — A blunt nose holds a detached bow shock with subsonic, high-pressure air behind it; sharp edges keep the shocks attached and weak (unless the edge is swept inside the Mach cone).',
    'Camber adds lift in supersonic flow as it does in subsonic flow — In linear supersonic theory the lift depends only on the angle of attack; camber only adds wave drag.',
    'At a higher Mach number the same wing at the same angle lifts a larger coefficient — The lift coefficient falls as 1/√(M² − 1); the lift itself grows only because the dynamic pressure grows faster.'
  ],
  formulas: [
    {
      name: 'Ackeret lift coefficient',
      expr: 'cl = 4*alpha/sqrt(M^2 - 1)', tex: 'c_l = \\dfrac{4\\alpha}{\\sqrt{M^2 - 1}}',
      vars: {
        cl: { name: 'section lift coefficient', signed: true, tex: 'c_l' },
        alpha: { name: 'angle of attack', q: 'angle', unit: '°', value: 2, min: -10, max: 10, signed: true, tex: '\\alpha' },
        M: { name: 'free-stream Mach number', value: 2, min: 1.01, max: 8, tex: 'M' }
      },
      note: 'Thin sections at small angles, supersonic but not hypersonic (roughly Mach 1.3 to 4). Independent of thickness and camber.',
      stories: {
        cl: 'A thin wing section flies at Mach {M} and an angle of attack of {alpha}. What lift coefficient does linear theory give?',
        alpha: 'At Mach {M}, what angle of attack gives a thin section a lift coefficient of {cl}?'
      }
    },
    {
      name: 'Wave drag of a diamond airfoil (Ackeret)',
      expr: 'cd = 4*(alpha^2 + tau^2)/sqrt(M^2 - 1)', tex: 'c_d = \\dfrac{4\\left(\\alpha^2 + \\tau^2\\right)}{\\sqrt{M^2 - 1}}',
      vars: {
        cd: { name: 'wave-drag coefficient', tex: 'c_d' },
        alpha: { name: 'angle of attack', q: 'angle', unit: '°', value: 2, min: -10, max: 10, signed: true, tex: '\\alpha' },
        tau: { name: 'thickness ratio t/c', q: 'ratio', unit: '%', value: 5.24, min: 0, max: 20, tex: '\\tau' },
        M: { name: 'free-stream Mach number', value: 2, min: 1.01, max: 8, tex: 'M' }
      },
      note: 'Symmetric double wedge; a biconvex section has 4/3 τ² in place of τ². Friction drag comes on top.',
      stories: {
        cd: 'A diamond airfoil {tau} thick flies at Mach {M} and {alpha} angle of attack. What is its wave-drag coefficient?',
        tau: 'At Mach {M} and {alpha}, how thick may a diamond section be for a wave-drag coefficient of {cd}?'
      }
    },
    {
      name: 'Linear-theory pressure coefficient',
      expr: 'Cp = 2*theta/sqrt(M^2 - 1)', tex: 'C_p = \\dfrac{2\\theta}{\\sqrt{M^2 - 1}}',
      vars: {
        Cp: { name: 'pressure coefficient', signed: true, tex: 'C_p' },
        theta: { name: 'surface inclination to the stream (+ into it)', q: 'angle', unit: '°', value: 5, min: -20, max: 20, signed: true, tex: '\\theta' },
        M: { name: 'free-stream Mach number', value: 2, min: 1.01, max: 8, tex: 'M' }
      },
      note: 'Small turning angles. At Mach 2 and 5° it underestimates a shock\'s pressure rise by about 10 % and overestimates an expansion by about as much.',
      stories: { Cp: 'At Mach {M}, a surface is inclined at {theta} to the stream. What pressure coefficient does Ackeret\'s theory give it?' }
    }
  ],
  examples: [
    {
      title: 'A diamond at Mach 2, two ways',
      q: 'A diamond airfoil of half-angle 3° ($\\tau = \\tan 3° = 0.0524$) flies at Mach 2 and $\\alpha = 2°$. Find $c_l$ and $c_d$ by Ackeret\'s theory and by shock-expansion theory.',
      steps: [
        'Ackeret, with $\\sqrt{M^2 - 1} = 1.732$ and $\\alpha = 0.0349$ rad: $c_l = 4 \\times 0.0349/1.732 = 0.0806$; $c_d = 4(0.00122 + 0.00275)/1.732 = 0.00916$.',
        'Shock-expansion, upper surface: a 1° shock gives $p/p_\\infty = 1.058$ ($M$ 1.96); the 6° fan at the shoulder brings it to 0.747 ($M$ 2.19).',
        'Lower surface: a 5° shock (at 34.3° to the stream) gives 1.315 ($M$ 1.82); the fan brings it to 0.945 ($M$ 2.03).',
        'With $q_\\infty = \\tfrac{\\gamma}{2}p_\\infty M^2 = 2.8\\,p_\\infty$ the face pressure coefficients are 0.021, −0.090, 0.113 and −0.020; resolving the face forces gives $c_l = 0.0810$, $c_d = 0.0092$.'
      ],
      a: 'c_l ≈ 0.081 and c_d ≈ 0.0092 by both methods: L/D ≈ 8.8 before friction.'
    },
    {
      title: 'How good is linear theory?',
      q: 'At Mach 2 a surface turns the flow 5° into the stream, and another turns it 5° away. Compare Ackeret\'s pressure coefficients with the exact ones.',
      steps: ['Ackeret: $C_p = \\pm 2 \\times 0.0873/1.732 = \\pm 0.101$.', 'Exact, compression: an oblique shock of 5° gives $p/p_\\infty = 1.315$, so $C_p = 0.315/2.8 = 0.113$.', 'Exact, expansion: a Prandtl–Meyer turn of 5° gives $C_p = -0.090$.'],
      a: 'Linear theory is about 10 % low for the compression and 10 % high for the expansion; the errors largely cancel in c_l.'
    }
  ],
  quiz: [
    { q: 'By Ackeret\'s theory, what is the lift coefficient of a thin section at 3° angle of attack at Mach 2?', answer: 0.121, tol: 0.02,
      why: '$c_l = 4 \\times 0.0524/\\sqrt{3} = 0.121$.' },
    { q: 'In linear supersonic theory, which change adds wave drag but no lift?', choices: ['more angle of attack', 'more thickness or camber', 'a lower Mach number', 'a longer chord'], a: 1,
      why: 'Lift depends only on the angle of attack; thickness and camber raise the mean-square slope and so the wave drag.' },
    { q: 'For the same thickness ratio, which section has the least zero-lift wave drag?', choices: ['the diamond (double wedge)', 'the biconvex (circular arc)', 'both the same', 'the NACA 0012'], a: 0,
      why: 'The mean-square slope is $\\tau^2$ for the diamond and $\\tfrac43\\tau^2$ for the biconvex; a blunt-nosed subsonic section would have a detached shock.' },
    { q: 'On a supersonic airfoil the centre of pressure lies near…', choices: ['the quarter chord', 'mid-chord', 'the leading edge', 'the trailing edge'], a: 1,
      why: 'Ackeret\'s pressure difference from angle of attack is uniform along the chord, so its centre is at mid-chord.' },
    { q: 'At a given angle of attack, a supersonic section\'s lift coefficient rises as the Mach number increases.', a: false,
      why: 'It falls as $1/\\sqrt{M^2 - 1}$: 0.062 per degree at Mach 1.5, 0.040 at Mach 2.' }
  ],
  problems: [
    { q: 'What is the zero-lift wave-drag coefficient of a 4 % thick diamond airfoil at Mach 1.8?', answer: 0.00428, tol: 0.02,
      steps: ['$\\sqrt{1.8^2 - 1} = 1.497$.', '$c_d = 4\\tau^2/1.497 = 4 \\times 0.0016/1.497 = 0.00428$.'] }
  ],
  applications: [
    'Wings, fins and control surfaces of supersonic fighters and missiles.',
    'Supersonic compressor and turbine blade cascades.',
    'Quick shock-expansion estimates for intakes, ramps and wind-tunnel models.',
    'Busemann\'s biplane, revived in studies of quieter supersonic aircraft.'
  ],
  history: 'Jakob Ackeret, a Swiss engineer who had worked with Prandtl in Göttingen, published the linear theory in 1925. Adolf Busemann carried it to second order in 1935 and, the same year, proposed a biplane of two half-diamonds whose shocks cancel between them: no wave drag at its design Mach number, though no lift either. The Lockheed F-104, first flown in 1954, had a straight wing only 3.4 % thick with a leading edge so sharp that it was covered on the ground.',
  sim: 'hst-diamond'
},

/* ================================================================ hypersonic flight */
{
  id: 'hypersonic-flight', parent: 'transonic-supersonic', title: 'Hypersonic flight and heating', level: 2,
  short: 'Above about Mach 5 the air behind the shocks gets so hot that heating, not drag, shapes the vehicle. Stagnation temperatures of thousands of kelvin, thin shock layers and chemically reacting air lead to blunt noses, ablative heat shields and ceramic tiles.',
  keywords: ['hypersonic', 'aerodynamic heating', 'kinetic heating', 'stagnation temperature', 'recovery temperature', 'heat shield', 'ablation', 'thermal protection system', 'Space Shuttle tiles', 'reinforced carbon-carbon', 'blunt body', 'H. Julian Allen', 'Sutton–Graves', 'Sutton-Graves', 're-entry', 'reentry', 'radiative equilibrium', 'dissociation', 'blackout', 'X-15', 'SR-71'],
  prereq: ['stagnation-properties', 'normal-shock', 'mach-regimes', 'physics:thermal-radiation'],
  related: ['supersonic-airfoils', 'oblique-shock', 'ramjet-scramjet', 'rocket-propulsion', 'boundary-layer', 'transition', 'physics:heat-transfer', 'physics:convection'],
  body: `
When fast air is brought to rest against a body, its kinetic energy becomes heat. For a perfect gas the [[stagnation-properties|stagnation temperature]] is

$$T_0 = T\\left(1 + \\frac{\\gamma-1}{2}M^2\\right)$$

and it grows with the square of the Mach number. At Mach 2 in the stratosphere (216.65 K) it is 397 K: Concorde's nose reached about 125 °C and the airframe grew some 15–25 cm longer in cruise. At Mach 3.2 it is 660 K, which is why the SR-71 was built of titanium. At Mach 6.7, the X-15's record of 1967, it is 2200 K. At Mach 25, returning from orbit, the formula gives 28 000 K — and here it stops being true.

The skin under a boundary layer does not quite reach $T_0$: friction and conduction bring it to the *recovery temperature* $T\\,[1 + r\\,(\\gamma-1)M^2/2]$, with a recovery factor $r \\approx 0.85$–0.9. That is about 340 °C for the SR-71.

### What changes above Mach 5
"Hypersonic" is a regime rather than a sharp line; above about Mach 5 several things change together.
- **Thin shock layers.** Oblique shocks lie close to the surface, and the hot layer between shock and body is thin; it may merge with the [[boundary-layer|boundary layer]].
- **Real-gas effects.** Above about 2000 K oxygen molecules begin to dissociate, above about 4000 K nitrogen, and above about 9000 K the air ionises. These reactions soak up energy, so behind the shock of an orbital re-entry the air stays at several thousand kelvin rather than 28 000 K. The ionised layer also blocks radio: the re-entry blackout.
- **Heating dominates.** The heat flow into the surface grows roughly as the cube of the speed.

### Blunt is better
In the early 1950s H. Julian Allen and Alfred Eggers at NACA Ames showed that a blunt nose survives where a sharp one burns. A widely used correlation for the stagnation point, due to Sutton and Graves, is

$$\\dot q_s = k\\sqrt{\\frac{\\rho}{R_n}}\\,V^3, \\qquad k \\approx 1.74 \\times 10^{-4}\\ \\mathrm{kg^{1/2}/m} \\text{ for air}$$

A large nose radius $R_n$ stands a strong bow shock well off the body; most of the heat stays in the shock layer and is carried away with the air, and the gentle velocity gradient near a broad nose passes less of it to the wall. A blunt body also has more drag and slows down higher up, in thinner air. So every crewed capsule, from Mercury to Orion, meets the air with a broad, gently curved heat shield, and the Space Shuttle's nose and wing leading edges were well rounded.

### Getting rid of the heat
| Method | How it works | Examples |
|---|---|---|
| Heat sink | thick metal soaks up the heat of a short flight | early nose cones; the X-15's Inconel X skin |
| Ablation | a charring surface layer decomposes and vaporises, carrying heat away | Apollo, Orion, Stardust, Dragon |
| Radiation | a hot surface radiates heat away, $\\dot q = \\varepsilon\\sigma T_w^4$ | Space Shuttle tiles and carbon–carbon panels |
| Active cooling | fuel or coolant flows under the skin | scramjet combustors, rocket nozzles |

The Shuttle orbiter carried about 24 000 silica tiles, more than 90 % air by volume. Black tiles on the underside took about 1260 °C, the reinforced carbon–carbon of the nose cap and wing leading edges about 1600 °C; white tiles and felt blankets covered cooler areas. Columbia was lost in 2003 after foam shed at launch had broken a carbon–carbon panel on its left wing's leading edge.

> [!key] Hypersonic vehicles are shaped by heat: blunt noses and leading edges, shields facing the flow, and a hot, thin, chemically reacting shock layer in which aerodynamics and chemistry are one problem.
`,
  ideas: [
    'Stagnation temperature grows with M²: 397 K at Mach 2, 660 K at Mach 3.2, thousands of kelvin at Mach 7 and beyond.',
    'Above about Mach 5 shock layers are thin, the air dissociates and ionises, and heating rather than drag drives the design.',
    'Stagnation-point heat flux grows about as V³ and falls as 1/√R_n: blunt noses heat less (Allen and Eggers).',
    'Heat is handled by heat sinks, ablation, radiation (ε σ T⁴) or active cooling.'
  ],
  pitfalls: [
    'Re-entry heating is caused by friction with the air — Most of it comes from compressing the air in the strong bow shock ahead of the vehicle; friction in the boundary layer carries part of that heat to the wall.',
    'A sharp, streamlined nose is best for re-entry — A sharp nose concentrates the heating (it grows as 1/√R_n); blunt shapes stand the shock off and heat less, and slow down higher up.',
    'The perfect-gas formula gives the real shock-layer temperature at Mach 25 — Dissociation and ionisation absorb much of the energy; the real temperature is several thousand kelvin, not 28 000 K.'
  ],
  formulas: [
    {
      name: 'Stagnation temperature (perfect gas)',
      expr: 'T0 = T*(1 + (gamma - 1)/2*M^2)', tex: 'T_0 = T\\left(1 + \\dfrac{\\gamma - 1}{2}M^2\\right)',
      vars: {
        T0: { name: 'stagnation temperature', q: 'temperature', unit: 'K', tex: 'T_0' },
        T: { name: 'static temperature of the air', q: 'temperature', unit: 'K', value: 216.65 },
        M: { name: 'Mach number', value: 3.2, min: 0, max: 30, tex: 'M' },
        gamma: { name: 'ratio of specific heats (air 1.4)', value: 1.4, min: 1.05, max: 1.67, fixed: true, tex: '\\gamma' }
      },
      note: 'Calorically perfect air; above about 2000 K dissociation makes the real temperature lower. The skin reaches the recovery temperature, with (γ − 1)/2·M² multiplied by r ≈ 0.85–0.9.',
      stories: {
        T0: 'An aircraft flies at Mach {M} through air at {T}. What is the stagnation temperature on its nose?',
        M: 'A nose must stay below {T0} of stagnation temperature in air at {T}. What is the highest Mach number?'
      }
    },
    {
      name: 'Sutton–Graves stagnation-point heat flux',
      expr: 'qs = k*sqrt(rho/Rn)*V^3', tex: '\\dot q_s = k\\sqrt{\\dfrac{\\rho}{R_n}}\\,V^3',
      vars: {
        qs: { name: 'stagnation-point heat flux', q: 'intensity', unit: 'W/cm²', tex: '\\dot q_s' },
        k: { name: 'Sutton–Graves constant for air', unit: 'kg^½/m', value: 1.7415e-4, fixed: true, tex: 'k' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 8.3e-5, tex: '\\rho' },
        Rn: { name: 'nose radius', q: 'length', unit: 'm', value: 1, tex: 'R_n' },
        V: { name: 'flight speed', q: 'speed', unit: 'km/s', value: 7.5 }
      },
      note: 'Convective heating of a cold wall at the stagnation point in air; above about 10 km/s radiation from the hot shock layer adds substantially.',
      practice: { unknowns: ['qs', 'Rn', 'V'] },
      stories: {
        qs: 'A vehicle with a nose radius of {Rn} flies at {V} through air of density {rho}. What heat flux reaches its nose?',
        Rn: 'At {V} in air of density {rho}, what nose radius keeps the stagnation heat flux down to {qs}?'
      }
    },
    {
      name: 'Radiative equilibrium wall temperature',
      expr: 'qs = eps*sigma*Tw^4', tex: '\\dot q_s = \\varepsilon\\,\\sigma\\,T_w^4',
      vars: {
        qs: { name: 'heat flux into the surface', q: 'intensity', unit: 'W/cm²', value: 66.9, tex: '\\dot q_s' },
        eps: { name: 'surface emissivity', value: 0.85, min: 0.01, max: 1, tex: '\\varepsilon' },
        sigma: { const: 'sigma' },
        Tw: { name: 'wall temperature', q: 'temperature', unit: 'K', tex: 'T_w' }
      },
      solveFor: 'Tw',
      note: 'A surface that loses heat only by radiation settles where it radiates what it receives — how Space Shuttle tiles worked.',
      stories: { Tw: 'A heat flux of {qs} reaches a surface of emissivity {eps} that can only radiate it away. What temperature does it reach?' }
    }
  ],
  examples: [
    {
      title: 'How hot does an SR-71 get?',
      q: 'An aircraft cruises at Mach 3.2 at 24 km, where the air is at about 220 K. Find the stagnation temperature and the recovery temperature of its skin ($r = 0.89$).',
      steps: [
        '$T_0 = 220 \\times (1 + 0.2 \\times 3.2^2) = 220 \\times 3.048 = 671$ K, about 398 °C.',
        'Recovery: $T_r = 220 \\times (1 + 0.89 \\times 0.2 \\times 10.24) = 220 \\times 2.823 = 621$ K, about 348 °C.',
        'Aluminium alloys lose their strength above about 150 °C; titanium keeps it to beyond 400 °C.'
      ],
      a: 'Stagnation about 670 K (400 °C); skin about 620 K (350 °C) — hence a titanium airframe.'
    },
    {
      title: 'A re-entry nose',
      q: 'A vehicle at 70 km ($\\rho = 8.3 \\times 10^{-5}$ kg/m³) flies at 7.5 km/s. Find the stagnation heat flux for nose radii of 1 m and 0.1 m, and the radiative-equilibrium temperature of a surface of emissivity 0.85.',
      steps: [
        '$\\dot q_s = 1.74 \\times 10^{-4} \\times \\sqrt{8.3 \\times 10^{-5}/1} \\times 7500^3 = 1.74 \\times 10^{-4} \\times 0.00911 \\times 4.22 \\times 10^{11} = 6.7 \\times 10^5$ W/m² = 67 W/cm².',
        '$T_w = \\left(6.7 \\times 10^5/(0.85 \\times 5.67 \\times 10^{-8})\\right)^{1/4} = 1930$ K, about 1660 °C.',
        'With $R_n$ = 0.1 m the flux is $\\sqrt{10} = 3.16$ times larger, 212 W/cm², and $T_w = 1930 \\times 10^{1/8} = 2570$ K.'
      ],
      a: '67 W/cm² and about 1930 K for the blunt nose; 212 W/cm² and 2570 K for the sharper one.'
    }
  ],
  quiz: [
    { q: 'For a perfect gas, the stagnation temperature rises above the static temperature in proportion to…', choices: ['M', 'M²', 'M³', '√M'], a: 1,
      why: '$T_0 - T = T\\,(\\gamma - 1)M^2/2$: kinetic energy per unit mass, $V^2/2$, divided by $c_p$.' },
    { q: 'Why are re-entry capsules blunt rather than pointed?', choices: ['blunt bodies have less drag', 'a blunt nose lowers the heat flux and slows the capsule higher up, in thinner air', 'to hold more fuel', 'to make lift'], a: 1,
      why: 'Heat flux falls as $1/\\sqrt{R_n}$, and the high drag sheds speed high in the atmosphere where the density is low.' },
    { q: 'Doubling the nose radius multiplies the stagnation-point heat flux by…', answer: 0.707, tol: 0.02,
      why: '$\\dot q_s \\propto 1/\\sqrt{R_n}$, so the factor is $1/\\sqrt2 = 0.707$.' },
    { q: 'At Mach 25 the perfect-gas formula correctly gives the temperature of the air behind the bow shock.', a: false,
      why: 'Dissociation and ionisation absorb most of the energy; the real temperature is several thousand kelvin, far below the 28 000 K of the formula.' },
    { q: 'The Space Shuttle\'s black underside tiles got rid of most of their heat by…', choices: ['ablating (burning away)', 'radiating it from their hot surface', 'conducting it into the aluminium structure', 'water cooling'], a: 1,
      why: 'Silica tiles are excellent insulators with a high-emissivity coating: the surface gets very hot and radiates, while little heat reaches the structure beneath.' }
  ],
  problems: [
    { q: 'Concorde cruised at Mach 2.02 in air at 216.65 K. What was the stagnation temperature?', answer: 393, unit: 'K', tol: 0.01,
      steps: ['$T_0 = 216.65 \\times (1 + 0.2 \\times 2.02^2) = 216.65 \\times 1.816$.', '$= 393$ K, about 120 °C.'] }
  ],
  applications: [
    'Heat shields of crewed capsules, sample-return probes and planetary entry vehicles.',
    'Thermal protection of reusable spaceplanes and hypersonic research vehicles.',
    'Kinetic heating limits of fast aircraft such as Concorde and the SR-71.',
    'Meteors, whose bright trails are their own ablation.'
  ],
  history: 'In the early 1950s H. Julian Allen at NACA Ames realised that a blunt nose, not a sharp one, would survive re-entry; with Alfred Eggers he worked out the theory of ballistic entry, first for missile nose cones and then for crewed capsules. The X-15 rocket aircraft reached Mach 6.7 in 1967. The Space Shuttle flew from 1981 to 2011, gliding home from Mach 25 on its tiles.',
  sim: 'hst-reentry'
},

/* ================================================================ wind tunnels */
{
  id: 'wind-tunnel', parent: 'wind-tunnels', title: 'Wind tunnels', level: 1,
  short: 'A wind tunnel holds a model still and moves the air past it: a fan or a pressure difference drives the air through screens, a contraction and the test section, where forces, pressures and flow patterns are measured. Open-circuit and closed-return layouts, from school tunnels to transonic and hypersonic giants.',
  keywords: ['wind tunnel', 'test section', 'contraction ratio', 'settling chamber', 'honeycomb', 'screens', 'diffuser', 'Eiffel tunnel', 'open circuit', 'Göttingen tunnel', 'closed return', 'energy ratio', 'blockage', 'wall corrections', 'turbulence intensity', 'transonic tunnel', 'supersonic tunnel', 'blowdown', 'NFAC'],
  prereq: ['continuity', 'bernoulli', 'dynamic-pressure', 'reynolds-number'],
  related: ['similarity-testing', 'force-balance', 'flow-visualisation', 'flight-testing', 'cfd', 'de-laval-nozzle', 'turbulence', 'vehicle-aerodynamics', 'wind-loads'],
  body: `
Moving a model through still air is awkward to measure; holding it still and moving the air past it is easy — and the forces are the same, as long as the moving air is uniform and steady. That is the whole idea of the wind tunnel.

### Following the air through a tunnel
1. **Settling chamber.** A **honeycomb** of small cells straightens out swirl, and several fine **screens** break big eddies into small ones that die away quickly. The air moves slowly here, so the screens cost little pressure.
2. **Contraction.** The duct narrows smoothly by a **contraction ratio** of typically 6 to 12. By [[continuity]] the speed rises by the same ratio,
$$V_{ts} = C_R\\,V_{sc}$$
and the unsteadiness left after the screens becomes a much smaller fraction of the mean speed: good low-speed tunnels reach turbulence intensities below 0.1 %.
3. **Test section**, with windows, the model, its support and the instruments. The speed is found from the pressure drop across the contraction, by [[bernoulli|Bernoulli's equation]], or from a [[pitot-tube|pitot-static tube]].
4. **Diffuser**, widening gently (a few degrees each side) so the air slows down and recovers its pressure instead of throwing its energy away.
5. **Fan** — or a compressor, or a pressure reservoir — and, in a closed circuit, **corners** with turning vanes and a return duct.

### Open circuit or closed return
The **open-circuit** or Eiffel type draws air from the room and blows it back into it. It is simple and cheap and suits smoke visualisation (the smoke is not recirculated), but it is sensitive to draughts and loses all the kinetic energy left at its exit. The **closed-return** or Göttingen type recirculates the air around a loop: quieter, steadier, less power for the same speed — but the air warms up and needs cooling. The test section itself may be closed by walls, or open as a free jet in a large chamber, as in many automotive and aeroacoustic tunnels.

The drive power is the kinetic-energy flux through the test section divided by the tunnel's **energy ratio**, commonly 3–7 for a good closed-return tunnel:
$$P = \\frac{\\rho V^3 A_{ts}}{2\\,\\mathrm{ER}}$$

### The walls are part of the experiment
A model in a closed test section squeezes the air past it (solid and wake **blockage**), so the local speed is higher than in free air; the walls also straighten the streamlines and the downwash of a lifting model. Models are usually kept below about 5–7.5 % of the test-section area and the data are corrected. A common first estimate raises the speed by $\\varepsilon \\approx \\tfrac14 A_m/A_{ts}$.

### Kinds of tunnel
| Kind | Mach number | Notes |
|---|---|---|
| Low-speed | up to ≈ 0.3 | fans; aircraft, cars, buildings, sport |
| Transonic | ≈ 0.7–1.3 | slotted or perforated walls swallow the shock reflections |
| Supersonic | ≈ 1.5–5 | a [[de-laval-nozzle|de Laval nozzle]] sets the Mach number; often blowdown from pressure tanks |
| Hypersonic | ≈ 5–20+ | heated gas, shock tunnels; runs of milliseconds to seconds |

The largest, the National Full-Scale Aerodynamics Complex at NASA Ames, has a 24 m × 37 m (80 × 120 ft) test section that takes a real aircraft. ONERA's S1MA at Modane, 8 m across and reaching Mach 1, is driven by 88 MW of water turbines fed from an Alpine reservoir.

> [!warn] Tunnels are industrial machines: large fans, stored pressure and, in cryogenic tunnels, nitrogen that can displace the oxygen in a room. Work on them follows the facility's lock-out and safety procedures.
`,
  ideas: [
    'A tunnel moves the air past a fixed model; the forces are the same as for a model moving through still air.',
    'Honeycomb and screens in the slow settling chamber, then a contraction of 6–12, give a smooth, steady test-section flow.',
    'By continuity the test-section speed is the contraction ratio times the settling-chamber speed.',
    'Open-circuit tunnels are simple; closed-return tunnels are steadier and need less power.',
    'Walls change the flow (blockage, streamline curvature); models are kept small and data are corrected.'
  ],
  pitfalls: [
    'The fan pushes air at test-section speed all round the circuit — The air is fast only in the test section; elsewhere the ducts are wider and the air slower, which is what keeps the losses small.',
    'A bigger model always gives better data — Beyond about 5–7.5 % of the test-section area the blockage and wall corrections become large and uncertain.',
    'A tunnel reproduces flight exactly if the speed is right — Only if the Reynolds and Mach numbers match, the turbulence is low and the walls are corrected (see scale models and similarity).'
  ],
  formulas: [
    {
      name: 'Contraction: speed from continuity',
      expr: 'Vts = CR*Vsc', tex: 'V_{ts} = C_R\\, V_{sc}',
      vars: {
        Vts: { name: 'test-section speed', q: 'speed', unit: 'm/s', tex: 'V_{ts}' },
        CR: { name: 'contraction ratio (settling-chamber area ÷ test-section area)', value: 9, min: 1, max: 30, tex: 'C_R' },
        Vsc: { name: 'settling-chamber speed', q: 'speed', unit: 'm/s', value: 5, tex: 'V_{sc}' }
      },
      note: 'Incompressible flow (test-section Mach number below about 0.3).',
      stories: {
        Vts: 'Air creeps through the screens of a tunnel at {Vsc}; the contraction ratio is {CR}. How fast is the test-section flow?',
        Vsc: 'A tunnel with a contraction ratio of {CR} runs at {Vts} in its test section. How fast does the air pass the screens?'
      }
    },
    {
      name: 'Drive power of a wind tunnel',
      expr: 'P = rho*V^3*A/(2*ER)', tex: 'P = \\dfrac{\\rho\\, V^3 A_{ts}}{2\\,\\mathrm{ER}}',
      vars: {
        P: { name: 'fan power', q: 'power', unit: 'kW' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'test-section speed', q: 'speed', unit: 'm/s', value: 60 },
        A: { name: 'test-section area', q: 'area', unit: 'm²', value: 5, tex: 'A_{ts}' },
        ER: { name: 'energy ratio of the tunnel', value: 5, min: 0.5, max: 20, tex: '\\mathrm{ER}' }
      },
      note: 'Energy ratio = kinetic-energy flux in the test section ÷ power put in; about 3–7 for closed-return tunnels, lower for open circuits.',
      stories: {
        P: 'A tunnel with a {A} test section runs at {V} in air of density {rho}. Its energy ratio is {ER}. What power does its fan need?',
        V: 'A {P} fan drives a tunnel with a {A} test section and an energy ratio of {ER}, in air of density {rho}. How fast can it run?'
      }
    },
    {
      name: 'Solid-blockage correction (first estimate)',
      expr: 'Vc = V*(1 + Am/(4*Ats))', tex: 'V_c = V\\left(1 + \\dfrac{A_m}{4\\,A_{ts}}\\right)',
      vars: {
        Vc: { name: 'corrected speed at the model', q: 'speed', unit: 'm/s', tex: 'V_c' },
        V: { name: 'measured tunnel speed', q: 'speed', unit: 'm/s', value: 40 },
        Am: { name: 'model frontal area', q: 'area', unit: 'm²', value: 0.1375, tex: 'A_m' },
        Ats: { name: 'test-section area', q: 'area', unit: 'm²', value: 5, tex: 'A_{ts}' }
      },
      note: 'A rough overall estimate for small bodies; proper corrections separate solid blockage, wake blockage and lift interference.',
      stories: { Vc: 'A model of frontal area {Am} sits in a {Ats} test section running at {V}. Roughly what speed does the model really feel?' }
    }
  ],
  examples: [
    {
      title: 'Speeds and pressures through a tunnel',
      q: 'A low-speed tunnel has a contraction ratio of 9 and runs at 40 m/s in its test section (ρ = 1.225 kg/m³). How fast is the air at the screens, and what pressure drop across the contraction measures the speed?',
      steps: ['Settling chamber: $40/9 = 4.4$ m/s.', 'Dynamic pressures: $\\tfrac12 \\times 1.225 \\times 40^2 = 980$ Pa in the test section, 12 Pa at the screens — 81 times less.', 'Bernoulli: the static pressure falls by $980 - 12 = 968$ Pa through the contraction, about 99 mm of water on a manometer.'],
      a: '4.4 m/s at the screens; a 968 Pa drop across the contraction indicates 40 m/s.'
    },
    {
      title: 'Fan power',
      q: 'A closed-return tunnel with a 2.5 m × 2 m test section runs at 60 m/s at sea level. With an energy ratio of 5, what fan power does it need?',
      steps: ['$P = \\rho V^3 A_{ts}/(2\\,\\mathrm{ER}) = 1.225 \\times 216\\,000 \\times 5/(2 \\times 5)$.', '$= 132$ kW. An open-circuit tunnel with an energy ratio near 2.5 would need about twice as much.'],
      a: 'About 130 kW.'
    },
    {
      title: 'Blockage of a car model',
      q: 'A 1:4 model of a car with 2.2 m² of frontal area is tested in the same 5 m² test section at 40 m/s. Estimate the blockage correction.',
      steps: ['Model frontal area $2.2/16 = 0.1375$ m², which is 2.75 % of the test section.', '$\\varepsilon \\approx 0.0275/4 = 0.0069$: the model sees 40.3 m/s.', 'Dynamic pressure is 1.4 % higher than measured, so uncorrected drag coefficients would come out 1.4 % high.'],
      a: 'About 0.7 % on speed and 1.4 % on dynamic pressure.'
    }
  ],
  quiz: [
    { q: 'A tunnel has a contraction ratio of 8 and a test-section speed of 48 m/s. How fast is the air in the settling chamber?', answer: 6, unit: 'm/s', tol: 0.02,
      why: 'Continuity: $48/8 = 6$ m/s.' },
    { q: 'Why are the screens placed in the settling chamber rather than in the test section?', choices: ['the air is slowest there, so they cost little pressure, and the small eddies they leave die out before the test section', 'they hold the model', 'they cool the air', 'they measure the speed'], a: 0,
      why: 'Pressure loss scales with the dynamic pressure, which is tens of times lower in the settling chamber; and the contraction then shrinks the remaining turbulence relative to the mean speed.' },
    { q: 'A closed-return tunnel needs more fan power than an open-circuit tunnel of the same size and speed.', a: false,
      why: 'It needs less: the return circuit recovers much of the kinetic energy that an open-circuit tunnel throws away at its exit.' },
    { q: 'Transonic tunnels have slotted or perforated walls in order to…', choices: ['save weight', 'let shocks and displaced air pass through the walls instead of reflecting onto the model', 'let the model be seen', 'cool the air'], a: 1,
      why: 'Solid walls would reflect shocks back onto the model and choke the test section near Mach 1; ventilated walls absorb both.' },
    { q: 'A model\'s frontal area is 12 % of the test section. What is the main problem?', choices: ['none', 'blockage: the air speeds up round the model and the corrections become large and uncertain', 'the model will be too light', 'the Reynolds number is too high'], a: 1,
      why: 'Blockage grows with the area ratio; beyond about 5–7.5 % the corrections are large and their uncertainty dominates.' }
  ],
  problems: [
    { q: 'What is the drive power of a closed-return tunnel with a 3 m² test section running at 50 m/s in air of 1.2 kg/m³, if its energy ratio is 4?', answer: 56.3, unit: 'kW', tol: 0.02,
      steps: ['$P = 1.2 \\times 50^3 \\times 3/(2 \\times 4)$.', '$= 1.2 \\times 125\\,000 \\times 3/8 = 56\\,250$ W ≈ 56 kW.'] }
  ],
  applications: [
    'Aircraft development: lift, drag, stability and loads before first flight.',
    'Road vehicles and motorsport, with moving ground belts and rotating wheels.',
    'Buildings and bridges in boundary-layer tunnels that model the wind near the ground.',
    'Sport: cyclists, skiers, ski jumpers and balls.'
  ],
  history: 'Frank Wenham built the first wind tunnel in 1871 for the Aeronautical Society of Great Britain. The Wright brothers\' small tunnel of 1901 gave them the data for their 1902 glider and 1903 Flyer. Gustave Eiffel built open-circuit tunnels in Paris in 1909 and 1912, and Ludwig Prandtl\'s large closed-return tunnel at Göttingen (1917) set the pattern for most big tunnels since.',
  sim: 'hst-tunnel'
},

/* ================================================================ scale models and similarity */
{
  id: 'similarity-testing', parent: 'wind-tunnels', title: 'Scale models and similarity', level: 2,
  short: 'A model predicts the full-size vehicle only if the flows are similar: the same shape, the same Mach number and the same Reynolds number. Usually both cannot be matched at once, so tunnels are pressurised or cooled, boundary layers are tripped, and what cannot be matched is corrected.',
  keywords: ['dynamic similarity', 'scale model', 'Reynolds number matching', 'Mach number matching', 'cryogenic wind tunnel', 'pressurised wind tunnel', 'variable density tunnel', 'boundary-layer trip', 'transition strip', 'scale effect', 'Froude scaling', 'extrapolation to flight', 'European Transonic Windtunnel', 'National Transonic Facility', 'water tunnel'],
  prereq: ['dimensional-analysis', 'reynolds-number', 'mach-number', 'wind-tunnel'],
  related: ['force-coefficients', 'strouhal-froude', 'transition', 'reynolds-effects-airfoil', 'drag-crisis', 'cfd', 'flight-testing', 'stall'],
  body: `
### What similarity asks for
[[dimensional-analysis|Dimensional analysis]] says that the force and moment coefficients of a shape depend only on dimensionless groups: the angles, the [[reynolds-number|Reynolds number]] $Re = \\rho V L/\\mu$, the [[mach-number|Mach number]] $M = V/a$, and — for waves, unsteady flows or flexible models — the Froude, Strouhal and aeroelastic numbers (see [[strouhal-froude]]). If a model is geometrically similar and every relevant number matches, its coefficients equal those of the full-size vehicle, and its forces scale as

$$F_f = F_m\\,\\frac{\\rho_f}{\\rho_m}\\left(\\frac{V_f}{V_m}\\right)^2 k^2$$

with $k$ the scale (full size ÷ model).

### The conflict
Shrink the model by $k$ in the same air and its Reynolds number falls by $k$. To restore it the speed must rise by $k$:

$$V_m = V_f\\,k\\,\\frac{\\nu_m}{\\nu_f}$$

A 1:5 model of a light aircraft that flies at 60 m/s would need 300 m/s — Mach 0.88, which ruins the Mach number. An airliner wing at Mach 0.82 at 11 km has a Reynolds number of about 37 million on its 6 m mean chord; a 1:30 model at Mach 0.82 in an atmospheric tunnel reaches about 2.7 million.

### Ways out
- **Raise the density.** A pressurised tunnel multiplies $\\rho$, and so $Re$, at the same Mach number. NACA's Variable Density Tunnel of 1923 ran at up to 20 atmospheres; its data built the NACA airfoil families.
- **Cool the gas.** Nitrogen at about 110 K is nearly three times denser than air at room temperature and the same pressure, less than half as viscous, and its speed of sound is 40 % lower, so the same Mach number needs less speed and less power. At the same pressure and Mach number the Reynolds number rises about fourfold. Cryogenic tunnels combine cold with pressure — NASA's National Transonic Facility from the early 1980s, the European Transonic Windtunnel in Cologne from 1994 — and reach flight Reynolds numbers.
- **Use another fluid.** Water has a kinematic viscosity about 15 times lower than air: water tunnels and towing tanks reach high Reynolds numbers at low speed (and tanks match the Froude number of ships).
- **Fix the transition.** At model Reynolds numbers the boundary layer may stay laminar where the aircraft's would be turbulent. A narrow strip of grit or zig-zag tape near the leading edge trips it, so that at least the right kind of boundary layer grows.
- **Correct and compute.** The remaining scale effects are estimated with [[cfd|CFD]] and checked against [[flight-testing|flight tests]].

| 1:30 airliner model (0.2 m chord), Mach 0.82 | Reynolds number |
|---|---|
| Full size at 11 km (6 m chord) | 37 million |
| Atmospheric tunnel, air at 300 K | 2.7 million |
| Pressurised air, 4 bar | 11 million |
| Cryogenic nitrogen, 4.5 bar, 115 K | 48 million |

### When the Reynolds number really matters
Where the flow separates or changes character — [[stall]] and $C_{L,\\max}$, the [[drag-crisis|drag crisis]] of spheres and cylinders, shock–boundary-layer interaction, skin friction — data at the wrong Reynolds number can be badly wrong. For attached flow at modest angles, such as the lift slope, it matters much less. Cars and trucks run at low Mach number, so only the Reynolds number (and a moving floor) needs care.

> [!note] Similarity is also why coefficients exist at all: $C_L$, $C_D$ and $C_p$ are what stays the same between a model and the real thing (see [[force-coefficients]]).
`,
  ideas: [
    'A model predicts full size only if the shapes are similar and the relevant dimensionless numbers (Re, M, and sometimes Fr, St) match.',
    'In the same air a 1:k model needs k times the speed to match Re — which breaks the Mach number.',
    'Pressure raises Re by density; cold nitrogen raises it by density, lower viscosity and lower speed of sound — cryogenic tunnels reach flight Re.',
    'Boundary-layer trips give the model a turbulent layer where the full-size one would have it.',
    'Reynolds number matters most where the flow separates or transitions: stall, C_L,max, drag crisis, skin friction.'
  ],
  pitfalls: [
    'A model at the same speed as the real vehicle gives the same coefficients — Its Reynolds number is smaller by the scale factor; separation, transition and friction can all differ.',
    'Matching the Reynolds number is enough at high speed — Mach number must match as well; shocks and compressibility depend on it, not on Reynolds number.',
    'A transition trip makes the model\'s Reynolds number equal to the full-size one — It only forces the boundary layer turbulent at the right place; the layer is still relatively thicker than at full scale.'
  ],
  formulas: [
    {
      name: 'Reynolds number',
      expr: 'Re = rho*V*L/mu', tex: '\\mathrm{Re} = \\dfrac{\\rho V L}{\\mu}',
      vars: {
        Re: { name: 'Reynolds number', tex: '\\mathrm{Re}' },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'speed', q: 'speed', unit: 'm/s', value: 60 },
        L: { name: 'reference length (chord, length)', q: 'length', unit: 'm', value: 1.5 },
        mu: { name: 'dynamic viscosity', q: 'viscosity', unit: 'mPa·s', value: 0.0179, tex: '\\mu' }
      },
      note: 'Air at sea level: ρ = 1.225 kg/m³, μ = 0.0179 mPa·s. For a wing the mean chord is the usual reference length.',
      stories: {
        Re: 'A wing of chord {L} flies at {V} in air of density {rho} and viscosity {mu}. What is its Reynolds number?',
        V: 'How fast must a model of chord {L} go in air of density {rho} and viscosity {mu} to reach a Reynolds number of {Re}?'
      }
    },
    {
      name: 'Model speed for equal Reynolds number',
      expr: 'Vm = Vf*k*num/nuf', tex: 'V_m = V_f\\, k\\, \\dfrac{\\nu_m}{\\nu_f}',
      vars: {
        Vm: { name: 'model speed needed', q: 'speed', unit: 'm/s', tex: 'V_m' },
        Vf: { name: 'full-size speed', q: 'speed', unit: 'm/s', value: 60, tex: 'V_f' },
        k: { name: 'scale factor (full size ÷ model)', value: 5, min: 1, max: 1000, tex: 'k' },
        num: { name: 'kinematic viscosity of the test fluid', q: 'kinvisc', unit: 'mm²/s', value: 14.6, tex: '\\nu_m' },
        nuf: { name: 'kinematic viscosity at full size', q: 'kinvisc', unit: 'mm²/s', value: 14.6, tex: '\\nu_f' }
      },
      note: 'Air at sea level has ν ≈ 14.6 mm²/s; water at 20 °C about 1.0 mm²/s.',
      stories: {
        Vm: 'A vehicle travels at {Vf} in a fluid of kinematic viscosity {nuf}. How fast must a 1:{k} model go in a fluid of kinematic viscosity {num} to match its Reynolds number?',
        num: 'A 1:{k} model of a vehicle that travels at {Vf} (fluid viscosity {nuf}) can only be run at {Vm}. What kinematic viscosity must the test fluid have?'
      }
    },
    {
      name: 'Scaling a force from model to full size',
      expr: 'Ff = Fm*(rhof/rhom)*(Vf/Vm)^2*k^2', tex: 'F_f = F_m\\,\\dfrac{\\rho_f}{\\rho_m}\\left(\\dfrac{V_f}{V_m}\\right)^2 k^2',
      vars: {
        Ff: { name: 'full-size force', q: 'force', unit: 'kN', tex: 'F_f' },
        Fm: { name: 'model force', q: 'force', unit: 'N', value: 50, tex: 'F_m' },
        rhof: { name: 'full-size fluid density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho_f' },
        rhom: { name: 'test fluid density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho_m' },
        Vf: { name: 'full-size speed', q: 'speed', unit: 'm/s', value: 60, tex: 'V_f' },
        Vm: { name: 'model speed', q: 'speed', unit: 'm/s', value: 40, tex: 'V_m' },
        k: { name: 'scale factor (full size ÷ model)', value: 5, min: 1, max: 1000, tex: 'k' }
      },
      note: 'Assumes the force coefficient is the same — exactly true only if the Reynolds and Mach numbers match.',
      practice: { unknowns: ['Ff', 'Fm'] },
      stories: { Ff: 'A 1:{k} model at {Vm} in fluid of density {rhom} measures {Fm} of drag. With the same coefficient, what is the drag of the full-size vehicle at {Vf} in fluid of density {rhof}?' }
    }
  ],
  examples: [
    {
      title: 'The light-aircraft model',
      q: 'A light aircraft with a 1.5 m chord flies at 60 m/s at sea level. A 1:5 model is tested in air at 60 m/s. Compare the Reynolds numbers, and find the speed that would match them.',
      steps: ['Full size: $Re = 1.225 \\times 60 \\times 1.5/(1.79 \\times 10^{-5}) = 6.2$ million.', 'Model (0.3 m chord): 1.2 million — five times smaller.', 'Matching needs $V_m = 60 \\times 5 = 300$ m/s, Mach 0.88: the flow would be transonic, not like the aircraft\'s at all.'],
      a: '6.2 million against 1.2 million; matching in air would need an impossible 300 m/s.'
    },
    {
      title: 'Going cold',
      q: 'The 1:30 airliner model (0.2 m chord) runs at Mach 0.82 in nitrogen with stagnation conditions of 4.5 bar and 115 K. Estimate its Reynolds number.',
      steps: ['Isentropic relations at Mach 0.82: $T = 115/1.134 = 101$ K and $p = 4.5/1.557 = 2.89$ bar.', 'Density $\\rho = p/(RT) = 289\\,000/(296.8 \\times 101.4) = 9.6$ kg/m³; speed $V = 0.82\\sqrt{1.4 \\times 296.8 \\times 101.4} = 168$ m/s.', 'Viscosity of nitrogen at 101 K: about $6.8 \\times 10^{-6}$ Pa·s.', '$Re = 9.6 \\times 168 \\times 0.2/(6.8 \\times 10^{-6}) = 48$ million.'],
      a: 'About 48 million — above the 37 million of the real aircraft, at the right Mach number.'
    },
    {
      title: 'From model to full size',
      q: 'A 1:5 model at 40 m/s in air has 50 N of drag. Estimate the full-size drag at 60 m/s in the same air, and say what the estimate ignores.',
      steps: ['$F_f = 50 \\times (60/40)^2 \\times 5^2 = 50 \\times 2.25 \\times 25 = 2810$ N.', 'The full-size Reynolds number is $5 \\times 1.5 = 7.5$ times higher, so the friction coefficient is lower and separation may differ: the estimate is usually on the high side.'],
      a: 'About 2.8 kN, if the drag coefficient were the same — which a 7.5-fold Reynolds number difference does not guarantee.'
    }
  ],
  quiz: [
    { q: 'A 1:10 model is tested in the same air as the full-size aircraft. To match the Reynolds number the tunnel speed must be…', choices: ['the same', '10 times higher', '√10 times higher', '100 times higher'], a: 1,
      why: '$Re \\propto VL$: a tenth of the length needs ten times the speed — usually impossible without breaking the Mach number.' },
    { q: 'Cooling the gas in a tunnel, at fixed pressure and Mach number, raises the Reynolds number because…', choices: ['the density rises and the viscosity falls, more than making up for the lower speed of sound', 'cold gas is stickier', 'the model shrinks', 'the speed of sound rises'], a: 0,
      why: '$Re = \\rho M a L/\\mu$: from 300 K to 110 K, $\\rho$ ×2.7, $\\mu$ ×0.41 and $a$ ×0.61 — about four times the Reynolds number.' },
    { q: 'For a racing car at 60 m/s, what must a tunnel test reproduce most carefully?', choices: ['the Mach number', 'the Reynolds number and the ground moving under the car', 'the Froude number', 'the Strouhal number'], a: 1,
      why: 'At Mach 0.18 compressibility is negligible; the boundary layers, separation and the flow between the car and the moving road dominate.' },
    { q: 'Tripping a model\'s boundary layer with a grit strip makes its Reynolds number equal to the full-size one.', a: false,
      why: 'The trip only makes the layer turbulent from the right place; the Reynolds number, and the relative thickness of the layer, are still those of the model.' },
    { q: 'What Reynolds number does sea-level air ($\\rho$ = 1.225 kg/m³, $\\mu$ = 1.79 × 10⁻⁵ Pa·s) reach on a 0.25 m chord at 50 m/s?', answer: 855000, tol: 0.02,
      why: '$Re = 1.225 \\times 50 \\times 0.25/(1.79 \\times 10^{-5}) = 8.55 \\times 10^5$.' }
  ],
  problems: [
    { q: 'A 1:4 car model tested in air at 40 m/s has 95 N of drag. With the same drag coefficient, what is the drag of the real car at 30 m/s in the same air?', answer: 855, unit: 'N', tol: 0.02,
      steps: ['$F_f = 95 \\times (30/40)^2 \\times 4^2$.', '$= 95 \\times 0.5625 \\times 16 = 855$ N.'] }
  ],
  applications: [
    'Airliner wing development in cryogenic tunnels at flight Reynolds numbers.',
    'Ship hulls in towing tanks at matched Froude number.',
    'Buildings and bridges: scaled wind with matched turbulence and aeroelastic models.',
    'Small models in water tunnels for flow visualisation at high Reynolds number.'
  ],
  history: 'Osborne Reynolds introduced his number in 1883 with dye experiments in pipes. Max Munk\'s Variable Density Tunnel at NACA Langley (1923) pressurised a small tunnel to 20 atmospheres to reach flight Reynolds numbers. The cryogenic idea was proven at NASA Langley in the early 1970s and led to the National Transonic Facility.',
  sim: { id: 'hst-tunnel', params: { tunnel: 'cryo' } }
},

/* ================================================================ flow visualisation */
{
  id: 'flow-visualisation', parent: 'wind-tunnels', title: 'Flow visualisation', level: 1,
  short: 'Air is invisible, so aerodynamicists make it show itself: smoke and tufts reveal streamlines and separation, oil films and china clay the flow at the surface, schlieren and shadowgraph the density changes of shocks, and lasers measure whole velocity fields (PIV).',
  keywords: ['flow visualisation', 'flow visualization', 'smoke', 'smoke tunnel', 'tufts', 'oil flow', 'surface oil flow', 'china clay', 'sublimation', 'schlieren', 'shadowgraph', 'interferometry', 'PIV', 'particle image velocimetry', 'laser Doppler', 'pressure-sensitive paint', 'infrared thermography', 'dye', 'helium bubbles', 'Gladstone–Dale'],
  prereq: ['streamlines', 'wind-tunnel', 'physics:refraction'],
  related: ['flow-separation', 'transition', 'vortex-shedding', 'oblique-shock', 'normal-shock', 'wingtip-vortices', 'force-balance', 'cfd', 'physics:lasers'],
  body: `
### Tracers in the flow
- **Smoke** (vaporised oil) or **dye** in water, released from a rake of fine tubes, draws [[streamlines|streaklines]] — in steady flow the same as streamlines. Smoke tunnels run slowly, a few metres per second, so the lines stay crisp; their pictures of wakes and [[vortex-shedding|vortex streets]] are classics.
- **Helium-filled soap bubbles** about a millimetre across float neutrally, follow the air and can be lit and filmed in large tunnels.
- **Tufts** — short wool or nylon threads taped to a surface — lie flat and steady in attached flow and flicker or point forward where it has [[flow-separation|separated]]. Tufts on a wing in flight show a stall creeping in from the trailing edge.

### Writing on the surface
- **Oil flow.** A thin film of oil mixed with a pigment such as titanium dioxide, or a fluorescent dye, is painted on. The air drags it into streaks along the direction of the skin friction, and it collects along separation lines: shock positions, separation bubbles and vortex footprints appear.
- **Transition.** China clay, subliming chemicals or evaporating liquids disappear faster under a turbulent boundary layer, which transfers heat and mass more quickly, so [[transition]] shows as a sharp change. **Infrared thermography** sees the same thing without touching the model: turbulent and laminar layers settle at slightly different temperatures.
- **Pressure-sensitive paint** glows less where the air pressure (and so the oxygen) is higher: a camera maps the pressure over the whole model at once.

### Seeing density: schlieren and shadowgraph
The refractive index of a gas rises with its density — the Gladstone–Dale relation, $n - 1 = K\\rho$, with $K = 2.26 \\times 10^{-4}\\ \\mathrm{m^3/kg}$ for air — so light crossing a region of changing density is bent. In a **schlieren** system a parallel beam crosses the test section and is focused onto a knife edge that cuts off about half the light. Rays bent towards the edge are stopped and rays bent away pass, so the picture shows the density *gradient* across the edge: shocks as sharp dark or bright lines, expansion fans as soft bands. A **shadowgraph** needs only a light and a screen; it shows the second derivative, a dark-and-bright pair at each shock. **Interferometry** measures the density itself from fringe shifts.

### Measuring velocity: PIV
In **particle image velocimetry** the flow is seeded with droplets about 1 µm across, a laser sheet flashes twice a few microseconds apart, and a camera records both images. Cross-correlating small windows between the two frames gives the displacement of each patch of particles, and so a whole map of velocity vectors:

$$V = \\frac{\\Delta x}{M_o\\,\\Delta t}$$

where $\\Delta x$ is the shift on the sensor and $M_o$ the optical magnification. Laser Doppler anemometry measures the velocity at a point from the Doppler shift of light scattered by passing particles.

> [!tip] Visualisation shows what happens; measurements say how much. Oil flow to find the separation, then taps and balances to measure its effect (see [[force-balance]]) — the tunnel engineer's daily routine.
`,
  ideas: [
    'Smoke, dye, bubbles and tufts make streaklines and separation visible; smoke tunnels run slowly to keep the lines crisp.',
    'Surface oil flow follows the skin friction and collects at separation lines; china clay and infrared show transition.',
    'The refractive index of air rises with density (n − 1 = Kρ), so schlieren shows density gradients and shadowgraph their second derivative.',
    'PIV measures whole velocity fields from the displacement of seeded particles between two laser flashes.'
  ],
  pitfalls: [
    'Smoke lines are always streamlines — They are streaklines; they coincide with streamlines only in steady flow, and in an unsteady wake they can look very different.',
    'Schlieren pictures show the pressure — They show the gradient of density (of refractive index) in one direction; a shock shows up as a line because the density jumps there.',
    'Tufts that stay attached prove the flow is fine everywhere — Tufts disturb the boundary layer slightly and show only the surface flow where they are; they can miss separation between them or above the surface.'
  ],
  formulas: [
    {
      name: 'Change of refractive index with density (Gladstone–Dale)',
      expr: 'dn = K*drho', tex: '\\Delta n = K\\,\\Delta\\rho',
      vars: {
        dn: { name: 'change of refractive index', tex: '\\Delta n' },
        K: { name: 'Gladstone–Dale constant of air', unit: 'm³/kg', value: 2.26e-4, fixed: true, tex: 'K' },
        drho: { name: 'change of density', q: 'density', unit: 'kg/m³', value: 1.056, tex: '\\Delta\\rho' }
      },
      note: 'For air in visible light; from n − 1 = Kρ. The default Δρ is the jump through a normal shock at Mach 1.5 at sea-level density.',
      stories: { dn: 'Through a shock the air density rises by {drho}. By how much does its refractive index change?' }
    },
    {
      name: 'Schlieren deflection of a light ray',
      expr: 'eps = L*K*G', tex: '\\varepsilon = L\\,K\\,G',
      vars: {
        eps: { name: 'deflection angle of the ray', q: 'angle', unit: 'mrad', tex: '\\varepsilon' },
        L: { name: 'width of the flow crossed', q: 'length', unit: 'm', value: 0.2 },
        K: { name: 'Gladstone–Dale constant of air', unit: 'm³/kg', value: 2.26e-4, fixed: true, tex: 'K' },
        G: { name: 'density gradient across the beam ∂ρ/∂y', unit: 'kg/m⁴', value: 100, tex: 'G' }
      },
      note: 'Small deflections in a two-dimensional flow; the knife edge turns the deflection into brightness.',
      stories: {
        eps: 'A schlieren beam crosses {L} of flow in which the density changes at {G} across it. How much is it deflected?',
        G: 'A schlieren system can detect deflections of {eps} across a {L} wide test section. What is the smallest density gradient it sees?'
      }
    },
    {
      name: 'Velocity from particle image velocimetry',
      expr: 'V = dx/(Mo*dt)', tex: 'V = \\dfrac{\\Delta x}{M_o\\,\\Delta t}',
      vars: {
        V: { name: 'flow velocity', q: 'speed', unit: 'm/s' },
        dx: { name: 'particle shift on the camera sensor', q: 'length', unit: 'µm', value: 52, tex: '\\Delta x' },
        Mo: { name: 'optical magnification (image ÷ object)', value: 0.1, min: 0.001, max: 10, tex: 'M_o' },
        dt: { name: 'time between laser pulses', q: 'time', unit: 'µs', value: 20, tex: '\\Delta t' }
      },
      note: 'The displacement comes from cross-correlating interrogation windows of the two images; pulses are chosen so particles move about a quarter of a window.',
      stories: {
        V: 'Between two laser pulses {dt} apart, particles shift by {dx} on a sensor with magnification {Mo}. How fast is the flow?',
        dt: 'The flow runs at {V}; particles should shift {dx} on a sensor with magnification {Mo}. How far apart should the pulses be?'
      }
    }
  ],
  examples: [
    {
      title: 'What a schlieren system must see',
      q: 'Across a weak compression the air density rises by 0.1 kg/m³ over about 1 mm. A schlieren beam crosses a 0.2 m wide test section there. How much is it bent, and how far does its focus move at the knife edge of a 1 m focal-length mirror?',
      steps: ['Density gradient $G = 0.1/0.001 = 100$ kg/m⁴.', 'Deflection $\\varepsilon = L K G = 0.2 \\times 2.26 \\times 10^{-4} \\times 100 = 4.5 \\times 10^{-3}$ rad = 4.5 mrad.', 'At the knife edge the image of the light source moves $f\\varepsilon = 1 \\times 0.0045 = 4.5$ mm — far more than needed to change the brightness.'],
      a: 'About 4.5 mrad: easily seen, which is why even weak shocks show up in schlieren photographs.'
    },
    {
      title: 'A PIV measurement',
      q: 'Particles shift 8 pixels of 6.5 µm on the camera between two pulses 20 µs apart; the optical magnification is 0.1. How fast is the flow?',
      steps: ['Shift on the sensor $\\Delta x = 8 \\times 6.5 = 52$ µm; in the flow $52/0.1 = 520$ µm.', '$V = 520 \\times 10^{-6}/(20 \\times 10^{-6}) = 26$ m/s.'],
      a: '26 m/s.'
    }
  ],
  quiz: [
    { q: 'Tufts on a wing that flicker and point forward indicate…', choices: ['laminar flow', 'separated flow', 'a shock wave', 'high lift'], a: 1,
      why: 'In separated flow the air near the surface is unsteady and may even run backwards, so the tufts flicker and reverse.' },
    { q: 'A schlieren system with a knife edge shows mainly…', choices: ['the density itself', 'the gradient of density across the knife edge', 'the velocity', 'the temperature of the model'], a: 1,
      why: 'Density gradients bend light; the knife edge converts the bending in one direction into brightness.' },
    { q: 'Why does a china-clay or subliming coating reveal where the boundary layer becomes turbulent?', choices: ['a turbulent layer transfers heat and mass faster, so the coating goes first where the layer is turbulent', 'laminar layers are hotter', 'the coating reacts with shock waves', 'turbulent layers are thicker and protect the coating'], a: 0,
      why: 'Turbulent mixing carries vapour away and heat in far faster than a laminar layer, so the coating disappears first behind transition.' },
    { q: 'In a PIV measurement particles move 0.4 mm in the flow between two laser pulses 10 µs apart. How fast is the flow?', answer: 40, unit: 'm/s', tol: 0.02,
      why: '$V = 0.4 \\times 10^{-3}/(10 \\times 10^{-6}) = 40$ m/s.' },
    { q: 'In an unsteady wake, smoke lines released from fixed points show the streamlines.', a: false,
      why: 'They are streaklines — the positions of all the particles that passed a point — and differ from streamlines when the flow changes with time.' }
  ],
  problems: [
    { q: 'A schlieren beam crosses a 0.15 m wide test section through a density gradient of 50 kg/m⁴. By how much is it deflected? (Gladstone–Dale constant 2.26 × 10⁻⁴ m³/kg.)', answer: 1.70, unit: 'mrad', tol: 0.02,
      steps: ['$\\varepsilon = L K G = 0.15 \\times 2.26 \\times 10^{-4} \\times 50$.', '$= 1.70 \\times 10^{-3}$ rad = 1.70 mrad.'] }
  ],
  applications: [
    'Finding separation, vortices and transition on wind-tunnel and flight-test models.',
    'Schlieren and shadowgraph images of shocks around supersonic models, jets and explosions.',
    'PIV maps of wakes, vortices and jets to validate CFD.',
    'Smoke in automotive tunnels, and dye in water tunnels, for teaching and design.'
  ],
  history: 'August Toepler invented the schlieren method in 1864, and in 1887 Ernst Mach and Peter Salcher photographed the shock waves around a supersonic bullet. Étienne-Jules Marey built smoke tunnels with dozens of parallel smoke streams around 1900, and Ludwig Prandtl filmed flows in a water channel strewn with particles from 1904. PIV grew from the 1980s with pulsed lasers and digital cameras.',
  sim: { id: 'hst-diamond', params: { view: 'schlieren' } }
},

/* ================================================================ forces and pressures */
{
  id: 'force-balance', parent: 'wind-tunnels', title: 'Measuring forces and pressures', level: 2,
  short: 'Wind-tunnel models are weighed by balances — external ones outside the test section, or strain-gauge balances inside the model — that measure all six force and moment components. Pressure taps and scanners map the pressure over the surface, and wake rakes find drag from the momentum lost behind a body.',
  keywords: ['wind tunnel balance', 'six-component balance', 'strain gauge', 'gauge factor', 'Wheatstone bridge', 'sting balance', 'internal balance', 'external balance', 'pressure tap', 'pressure orifice', 'pressure scanner', 'multitube manometer', 'wake rake', 'wake survey', 'hot-wire anemometer', 'calibration', 'interactions'],
  prereq: ['wind-tunnel', 'force-coefficients', 'pressure-coefficient'],
  related: ['pitot-tube', 'pressure-distribution', 'drag-equation', 'lift-equation', 'pitching-moment', 'flow-visualisation', 'similarity-testing', 'physics:stress-strain'],
  body: `
### Six numbers
A rigid model feels three forces — lift (or normal force), drag (or axial force) and side force — and three moments — pitch, roll and yaw. A **balance** measures all six at once and resolves them into the tunnel's or the model's axes; dividing by the dynamic pressure, a reference area and a length gives the [[force-coefficients|coefficients]] $C_L$, $C_D$, $C_Y$, $C_m$, $C_l$ and $C_n$.

**External balances** sit outside the test section, under the floor or above the roof, and hold the model on struts or wires. They are large and accurate, but the air loads on their own supports must be measured and subtracted. **Internal balances** are compact blocks of steel, machined in one piece with thin flexures, that fit inside the model and mount on a **sting** entering from the rear. Under load the flexures bend minutely, and **strain gauges** bonded to them sense it.

### Strain gauges and bridges
A strain gauge is a foil grid whose resistance changes as it is stretched: $\\Delta R/R = K\\varepsilon$, with a gauge factor $K \\approx 2$ (see [[physics:stress-strain|stress and strain]]). The strains are tiny — a few hundred microstrain at full load — so four gauges are wired as a **Wheatstone bridge**, with stretched and compressed gauges on opposite arms: their signals add, while temperature changes, which affect all four alike, cancel. With $N$ active arms,

$$V_{out} = \\frac{N}{4}\\,V_{ex}\\,K\\,\\varepsilon$$

10 V of excitation and 500 µε on a full bridge give about 10 mV. Each component also leaks a little into the others (interactions), so balances are calibrated by hanging hundreds of known load combinations on them and fitting a matrix of coefficients. Good balances resolve about 0.1 % of their range.

### Pressures on the surface
A **pressure tap** is a small hole, 0.3–1 mm across, drilled square to the surface and piped to a transducer. Rows of taps along a chord give the [[pressure-distribution|pressure distribution]]; integrating it gives the normal force and pitching moment of that section — but not the skin friction. Each reading becomes a pressure coefficient,

$$C_p = \\frac{p - p_\\infty}{q}$$

Classic tunnels piped the taps to a **multitube manometer**, a board of liquid columns photographed at each test point; today electronic **pressure scanners** read hundreds of taps in milliseconds. Where the holes are matters as much as how many: the suction peak near the leading edge is narrow, and a row that misses it misses lift.

### Drag from the wake
Behind a two-dimensional wing the air has lost momentum. A **wake rake** — a comb of pitot tubes — traversed through the wake measures the loss of total pressure, and the momentum missing per second is the section's profile drag (the methods of Betz and of Melvill Jones). It captures friction and pressure drag together and is free of the support loads that trouble balances.

### Speed and turbulence
The tunnel speed comes from a [[pitot-tube|pitot-static tube]] or from the pressure drop across the contraction. **Hot-wire anemometers** — a heated wire a few micrometres thick, cooled by the flow — follow velocity fluctuations at tens to hundreds of kilohertz and measure turbulence.

> [!note] A balance measures everything on it: the model's weight, the tunnel's influence and the air load. Wind-off zeros, weight tares and wall corrections are part of every data point.
`,
  ideas: [
    'A balance measures three forces and three moments; divided by q, area and length they become the six coefficients.',
    'Internal sting balances use flexures and strain gauges in Wheatstone bridges: V_out = (N/4) V_ex K ε.',
    'Balances are calibrated with known loads to remove interactions between components.',
    'Pressure taps give C_p = (p − p∞)/q; integrating them gives normal force and moment, not friction.',
    'Wake rakes find profile drag from the momentum lost in the wake.'
  ],
  pitfalls: [
    'Integrating the tap pressures gives the total drag — Pressure taps miss the skin friction; drag comes from a balance or a wake survey.',
    'More taps always means better results — Their placement matters most: a row that misses the narrow suction peak near the nose misses lift, however many holes it has elsewhere.',
    'The balance reading is the aerodynamic force — It also contains the model\'s weight, support loads and tunnel interference, removed by tares, calibration and corrections.'
  ],
  formulas: [
    {
      name: 'Strain-gauge bridge output',
      expr: 'Vout = N/4*Vex*K*eps', tex: 'V_{out} = \\dfrac{N}{4}\\,V_{ex}\\,K\\,\\varepsilon',
      vars: {
        Vout: { name: 'bridge output voltage', q: 'voltage', unit: 'mV', tex: 'V_{out}' },
        N: { name: 'active gauges in the bridge (1, 2 or 4)', value: 4, min: 1, max: 4, int: true, tex: 'N' },
        Vex: { name: 'excitation voltage', q: 'voltage', unit: 'V', value: 10, tex: 'V_{ex}' },
        K: { name: 'gauge factor', value: 2.1, min: 0.5, max: 200, tex: 'K' },
        eps: { name: 'strain', q: 'strain', unit: 'µε', value: 500, tex: '\\varepsilon' }
      },
      note: 'Gauges of equal strain magnitude, stretched and compressed arms placed so that their signals add.',
      practice: { unknowns: ['Vout', 'eps'] },
      stories: {
        Vout: 'A bridge of {N} active gauges with gauge factor {K} is excited at {Vex}. What does it put out at a strain of {eps}?',
        eps: 'A bridge of {N} active gauges (gauge factor {K}, excitation {Vex}) reads {Vout}. What strain is that?'
      }
    },
    {
      name: 'Pressure coefficient from a tap',
      expr: 'Cp = dp/q', tex: 'C_p = \\dfrac{\\Delta p}{q}',
      vars: {
        Cp: { name: 'pressure coefficient', signed: true, tex: 'C_p' },
        dp: { name: 'tap pressure minus free-stream static pressure', q: 'pressure', unit: 'Pa', value: -650, signed: true, tex: '\\Delta p' },
        q: { name: 'free-stream dynamic pressure', q: 'pressure', unit: 'Pa', value: 1500 }
      },
      note: 'Scanners usually read each tap against the free-stream static pressure, so Δp = p − p∞ directly.',
      stories: { Cp: 'A tap reads {dp} relative to the free-stream static pressure, with a dynamic pressure of {q}. What is the pressure coefficient?' }
    },
    {
      name: 'Lift coefficient from a balance reading',
      expr: 'CL = L/(q*S)', tex: 'C_L = \\dfrac{L}{q\\,S}',
      vars: {
        CL: { name: 'lift coefficient', signed: true, tex: 'C_L' },
        L: { name: 'measured lift', q: 'force', unit: 'N', value: 180, signed: true },
        q: { name: 'dynamic pressure', q: 'pressure', unit: 'Pa', value: 1500 },
        S: { name: 'reference (wing) area', q: 'area', unit: 'm²', value: 0.24 }
      },
      note: 'The same with D, Y for drag and side force; moments are divided by a reference length as well.',
      stories: { CL: 'A model wing of {S} carries {L} of lift at a dynamic pressure of {q}. What is its lift coefficient?' }
    }
  ],
  examples: [
    {
      title: 'A strain-gauge bridge',
      q: 'A balance flexure strains 500 µε at full load. With gauges of factor 2.1 and 10 V excitation, what does a full bridge (4 active gauges) put out, and a quarter bridge (1 gauge)?',
      steps: ['Full bridge: $V_{out} = 10 \\times 2.1 \\times 500 \\times 10^{-6} = 10.5$ mV.', 'Quarter bridge: a quarter of that, 2.6 mV — and with no compensation for temperature.'],
      a: '10.5 mV for the full bridge, four times the quarter bridge — one reason balances use full bridges.'
    },
    {
      title: 'From readings to coefficients',
      q: 'A model wing of 0.24 m² is tested at $q$ = 1500 Pa (about 49.5 m/s at sea level). The balance reads 180 N of lift and 9 N of drag; a tap on the upper surface reads 650 Pa below the free-stream static pressure. Find $C_L$, $C_D$, $L/D$ and the tap\'s $C_p$.',
      steps: ['$C_L = 180/(1500 \\times 0.24) = 0.50$; $C_D = 9/360 = 0.025$; $L/D = 20$.', 'Tap: $C_p = -650/1500 = -0.433$.', 'By Bernoulli the local speed there is $\\sqrt{1 - C_p} = 1.20$ times the free stream.'],
      a: 'C_L = 0.50, C_D = 0.025, L/D = 20; C_p = −0.43 at the tap, where the air runs 20 % faster.'
    }
  ],
  quiz: [
    { q: 'How many force and moment components does a full wind-tunnel balance measure?', answer: 6, tol: 0.001,
      why: 'Three forces (lift, drag, side force) and three moments (pitch, roll, yaw).' },
    { q: 'Why are strain gauges wired as a Wheatstone bridge with stretched and compressed gauges in opposite arms?', choices: ['to add weight', 'so that their signals add while temperature effects cancel', 'to stiffen the model', 'to measure pressure'], a: 1,
      why: 'Bending strains have opposite signs on the two faces of a flexure and add in the bridge; a temperature change affects all gauges alike and cancels.' },
    { q: 'Integrating the pressures measured by taps gives the skin-friction drag.', a: false,
      why: 'Taps measure normal pressure only; friction acts along the surface and needs a balance, a wake survey or friction gauges.' },
    { q: 'A tap reads 900 Pa below the free-stream static pressure where $q$ = 1200 Pa. What is $C_p$?', answer: -0.75, tol: 0.02,
      why: '$C_p = -900/1200 = -0.75$.' },
    { q: 'A wake rake measures the profile drag of a wing section from…', choices: ['the lift', 'the momentum lost in the wake', 'the pressures on the model', 'the fan power'], a: 1,
      why: 'Drag equals the rate at which the body removes momentum from the air; the rake measures the velocity deficit behind it.' }
  ],
  problems: [
    { q: 'A full bridge (4 active gauges, gauge factor 2.0) excited at 5 V reads 4.0 mV. What is the strain?', answer: 400, unit: 'µε', tol: 0.02,
      steps: ['$\\varepsilon = V_{out}/(V_{ex}K) = 4.0 \\times 10^{-3}/(5 \\times 2.0)$.', '$= 4.0 \\times 10^{-4}$ = 400 µε.'] }
  ],
  applications: [
    'Six-component balance testing of aircraft, missiles and cars.',
    'Pressure-tapped wings for load distributions and CFD validation.',
    'Wake surveys for airfoil profile drag.',
    'Hot-wire and pressure measurements of tunnel flow quality.'
  ],
  history: 'The Wright brothers\' 1901 balances, built from bicycle spokes and hacksaw blades, measured lift and drag ratios for some 200 small wings. Edward Simmons and Arthur Ruge invented the bonded strain gauge independently in 1938, and internal strain-gauge balances on stings became standard in the 1950s.',
  sim: 'hst-taps'
},

/* ================================================================ flight testing */
{
  id: 'flight-testing', parent: 'wind-tunnels', title: 'Flight testing', level: 1,
  short: 'In the end an aircraft is proven in the air. Flight tests calibrate the air data, measure performance, stability and handling, expand the envelope step by step towards the limits of speed, load, stall and flutter, and provide the evidence for certification.',
  keywords: ['flight test', 'flight testing', 'test pilot', 'envelope expansion', 'air data calibration', 'position error', 'trailing cone', 'tower fly-by', 'pace aircraft', 'level acceleration', 'sawtooth climb', 'specific excess power', 'flutter testing', 'stall testing', 'spin chute', 'certification', 'telemetry', 'Cooper–Harper'],
  prereq: ['four-forces', 'airspeeds', 'wind-tunnel'],
  related: ['pitot-tube', 'climb-performance', 'gliding', 'energy-management', 'stall', 'spins', 'flutter', 'dynamic-stability', 'phugoid', 'dutch-roll', 'similarity-testing', 'cfd'],
  body: `
Wind tunnels and computers predict; flight testing checks. It is the only test in which the Reynolds number, the flexible structure, the engines, the systems and the pilot are all real at once.

### Instrumentation and air data
A test aircraft carries hundreds to tens of thousands of sensors — pressures, strains, accelerations, temperatures, control positions — recorded on board and sent by **telemetry** to engineers on the ground, who watch key values live. The first task is to calibrate the **air data**: static ports and pitot probes sit in air disturbed by the aircraft itself, so they read with a *position error* that changes with speed, angle and configuration (see [[airspeeds]]). References include a long **nose boom** reaching into undisturbed air, a **trailing cone** towed far behind the tail to sense the free-stream static pressure, **tower fly-bys** past a surveyed tower, a calibrated **pace aircraft** flying alongside, and satellite-navigation runs on several headings that cancel the wind.

### Performance
- **Drag and the polar.** In a glide with the engine at idle — or in a sailplane — the drag balances the component of weight along the path: $D \\approx mg\\,w/V$, with $w$ the sink rate. Glides at many speeds trace the [[drag-polar|drag polar]].
- **Climb and acceleration.** In a **level acceleration** at full thrust the rate of speed increase measures the **specific excess power** — the climb rate the aircraft could have at that speed and height:
$$P_s = \\frac{V}{g}\\frac{dV}{dt} + \\frac{dh}{dt}$$
**Sawtooth climbs** at several steady speeds measure it directly. From $P_s$ over speed and height come climb schedules, ceilings and [[energy-management|energy]] manoeuvrability.
- Takeoff and landing distances, fuel flow, range and endurance are measured and reduced to standard conditions.

### Stability, control and handling
The dynamic modes are excited deliberately — **doublets** and frequency sweeps on each control — and the responses fitted: the [[phugoid]], the short period, the [[dutch-roll|Dutch roll]] and the spiral. Test pilots grade handling qualities on the Cooper–Harper scale.

### Expanding the envelope
A new aircraft goes **step by step**: each test point a little faster, higher, heavier-loaded or slower than the last, with the data checked before the next. **Flutter** clearance excites the structure at each speed and tracks how its damping falls, stopping with a margin long before it would reach zero (see [[flutter]]). **Stall and spin** tests are flown with a recovery parachute on the tail. Speeds, Mach numbers and load factors are demonstrated with margins over the values that will be allowed in service.

### Certification
For a transport aircraft the flight tests show compliance with the airworthiness rules — CS-25 in Europe, 14 CFR Part 25 in the United States: stall speeds and behaviour, minimum control speeds with an engine failed, takeoff and landing performance, flutter margins and much more. A new airliner's campaign takes one to two years and a few thousand flying hours on several aircraft.

> [!warn] Flight testing is done by trained test pilots and engineers, with approved test plans, safety reviews and specially equipped aircraft. Nothing here describes how to fly or test a real aircraft: operations follow the aircraft's approved manuals and the rules of the air, and drones the local rules.
`,
  ideas: [
    'Flight testing is the only test with everything real: full-scale Reynolds number, flexible structure, engines and pilot.',
    'The air-data system is calibrated first, against booms, trailing cones, tower fly-bys and pace aircraft.',
    'Glides measure drag; level accelerations and sawtooth climbs measure the specific excess power P_s = (V/g) dV/dt + dh/dt.',
    'The envelope is expanded step by step, with flutter damping and stall behaviour checked before each new point.',
    'Flight tests provide the evidence for certification.'
  ],
  pitfalls: [
    'If the tunnel and CFD agree, flight testing is a formality — Scale effects, flexibility, engine installation and unexpected interactions still surprise designers; flight tests regularly lead to changes such as vortex generators, fairings and new control laws.',
    'An airspeed indicator reads correctly as soon as it is installed — Its static ports and probe sit in air disturbed by the aircraft; the position error must be measured in flight and corrected.',
    'Flutter testing flies faster and faster until the structure flutters — Engineers measure the damping at each speed and extrapolate; the aim is to stop with a margin long before the damping reaches zero.'
  ],
  formulas: [
    {
      name: 'Specific excess power',
      expr: 'Ps = V*a/g + hdot', tex: 'P_s = \\dfrac{V}{g}\\,a + \\dot h',
      vars: {
        Ps: { name: 'specific excess power', q: 'speed', unit: 'm/s', signed: true, tex: 'P_s' },
        V: { name: 'true airspeed', q: 'speed', unit: 'm/s', value: 130 },
        a: { name: 'acceleration along the path', q: 'accel', unit: 'm/s²', value: 1.2, signed: true, tex: 'a' },
        g: { const: 'g' },
        hdot: { name: 'rate of climb', q: 'speed', unit: 'ft/min', value: 0, signed: true, tex: '\\dot h' }
      },
      note: 'P_s = (T − D)V/W: the climb rate available at that speed, height and weight. Units of speed (m/s or ft/min).',
      practice: { unknowns: ['Ps', 'a'] },
      stories: {
        Ps: 'In level flight at {V} an aircraft accelerates at {a} while climbing at {hdot}. What is its specific excess power?',
        a: 'At {V} an aircraft has a specific excess power of {Ps}. How fast can it accelerate in level flight ({hdot} climb)?'
      }
    },
    {
      name: 'Drag measured in a glide',
      expr: 'D = m*g*w/V', tex: 'D = \\dfrac{m g\\, w}{V}',
      vars: {
        D: { name: 'drag', q: 'force', unit: 'N' },
        m: { name: 'aircraft mass', q: 'mass', unit: 'kg', value: 500 },
        g: { const: 'g' },
        w: { name: 'sink rate', q: 'speed', unit: 'm/s', value: 0.7 },
        V: { name: 'true airspeed along the path', q: 'speed', unit: 'm/s', value: 27 }
      },
      note: 'Steady glide in still air at a small angle, engine at idle or no engine; then also L/D ≈ V/w.',
      stories: {
        D: 'A {m} sailplane glides at {V} and sinks at {w}. What is its drag?',
        w: 'An aircraft of {m} has {D} of drag at {V}. How fast does it sink in a glide?'
      }
    }
  ],
  examples: [
    {
      title: 'Measuring a sailplane in a glide',
      q: 'A 500 kg sailplane glides at 27 m/s (52 kt) and sinks at 0.70 m/s in still air. Find its drag and glide ratio.',
      steps: ['$D = mg\\,w/V = 500 \\times 9.81 \\times 0.70/27 = 127$ N.', 'Glide ratio $L/D \\approx V/w = 27/0.70 = 38.6$.', 'Repeating at other speeds, in smooth air early in the morning, gives the whole polar.'],
      a: 'About 127 N of drag and a glide ratio of 39.'
    },
    {
      title: 'Specific excess power from a level acceleration',
      q: 'An aircraft in level flight at 130 m/s accelerates at 1.2 m/s² with full thrust. What is its specific excess power?',
      steps: ['$P_s = V a/g + \\dot h = 130 \\times 1.2/9.81 + 0 = 15.9$ m/s.', 'In feet per minute: $15.9/0.00508 = 3130$ ft/min.'],
      a: 'About 16 m/s: at that speed, height and weight it could instead climb at about 3100 ft/min.'
    }
  ],
  quiz: [
    { q: 'A trailing cone is towed behind a test aircraft in order to…', choices: ['sense the static pressure in undisturbed air, to calibrate the static ports', 'reduce drag', 'measure the lift', 'stabilise the aircraft in yaw'], a: 0,
      why: 'Far behind the aircraft the static pressure is the true free-stream value; comparing it with the aircraft\'s ports gives their position error.' },
    { q: 'In a level acceleration at constant height, the specific excess power equals…', choices: ['zero', '$(V/g)\\,dV/dt$', '$dh/dt$', 'the thrust'], a: 1,
      why: 'With $dh/dt = 0$ all the excess power goes into speed: $P_s = (V/g)\\,dV/dt$.' },
    { q: 'A glider at 30 m/s sinks at 1.0 m/s. What is its lift-to-drag ratio?', answer: 30, tol: 0.02,
      why: 'At small glide angles $L/D \\approx V/w = 30/1.0 = 30$.' },
    { q: 'Flutter tests continue to higher speeds until the structure visibly flutters.', a: false,
      why: 'The damping of each structural mode is measured at every step and extrapolated; testing stops with a margin well before flutter.' }
  ],
  problems: [
    { q: 'A 1200 kg aircraft accelerates in level flight from 80 to 85 m/s in 10 s. Using the mean speed, what is its specific excess power?', answer: 4.2, unit: 'm/s', tol: 0.02,
      steps: ['Acceleration $5/10 = 0.5$ m/s²; mean speed 82.5 m/s.', '$P_s = 82.5 \\times 0.5/9.81 = 4.2$ m/s (about 830 ft/min).'] }
  ],
  applications: [
    'Certification of new aircraft types and of modifications.',
    'Air-data calibration for every new type and many modifications.',
    'Research aircraft: laminar-flow, noise and control experiments.',
    'Drone and UAV development, within local rules.'
  ],
  history: 'Otto Lilienthal made some 2000 glides between 1891 and 1896, improving his gliders from each. The Wright brothers\' gliders and the 1903 Flyer were flight tests with careful records. NACA\'s Langley laboratory built flight testing into a discipline in the 1920s and 1930s, with instrumented aircraft and engineering test pilots; the Bell X-1 in 1947 and the X-15 in the 1960s explored speeds that tunnels could not yet reach.'
}

);
