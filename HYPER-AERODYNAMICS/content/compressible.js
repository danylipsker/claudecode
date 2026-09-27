/* HYPER-AERODYNAMICS · content/compressible.js
 * Branch "High-Speed Flight": topics compressible-basics (compressibility, isentropic flow,
 * stagnation properties, speed regimes, nozzles and choking, the de Laval nozzle) and shocks
 * (normal and oblique shocks, Prandtl–Meyer expansion, the Mach cone, the sonic boom).
 * Simulations: sims/compressible.js (ids comp-*). Gas-dynamics numbers are checked against
 * kit.fluid / NACA Report 1135 (γ = 1.4 for air unless a formula says otherwise). */

/* ================================================================ COMPRESSIBLE FLOW */
Hyper.add({
  id: 'compressibility', parent: 'compressible-basics', title: 'When air compresses', level: 1,
  short: 'Every gas can be squeezed, but a flow only notices when its speed is a sizeable fraction of the speed of sound. Below about Mach 0.3 air behaves as if it were incompressible; faster than that its density changes with speed and the low-speed rules need correcting.',
  keywords: ['compressibility', 'compressible flow', 'incompressible flow', 'Mach 0.3', 'density change', 'bulk modulus', 'compressibility correction', 'stagnation pressure coefficient', 'Prandtl–Glauert'],
  prereq: ['speed-of-sound', 'mach-number', 'bernoulli'],
  related: ['stagnation-properties', 'mach-regimes', 'isentropic-flow', 'airspeeds', 'critical-mach', 'physics:speed-of-sound'],
  body: `
Air is about as squeezable as a substance gets. Put your thumb over the outlet of a bicycle pump and push: one extra atmosphere halves the volume of the air inside, while water would need two hundred extra atmospheres to lose a single per cent. Yet most low-speed aerodynamics — [[bernoulli|Bernoulli's equation]], the [[continuity|continuity equation]] with a fixed density, the [[lift-equation|lift equation]] — treats air as if its density never changed. Both pictures are right. What matters is not how squeezable the gas is but how hard the **flow** squeezes it.

### How hard a flow squeezes
Stopping a moving parcel of air raises its pressure by about the [[dynamic-pressure|dynamic pressure]] $\\tfrac12\\rho V^2$. Compared with the pressure the air already has, and using $a^2 = \\gamma p/\\rho$ for the [[speed-of-sound|speed of sound]], that is
$$\\frac{\\Delta p}{p} \\approx \\frac{\\rho V^2}{2p} = \\frac{\\gamma}{2}M^2$$
A quick squeeze changes density by $\\Delta\\rho/\\rho = \\Delta p/(\\gamma p)$, so the density change is roughly **half the square of the [[mach-number|Mach number]]**:
$$\\frac{\\Delta\\rho}{\\rho} \\approx \\tfrac{1}{2}M^2$$

| Flow (sea level unless stated) | Mach | Density rise when brought to rest |
|---|---|---|
| Car at 130 km/h | 0.11 | 0.6 % |
| Light aircraft at 120 kt | 0.18 | 1.7 % |
| 100 m/s (360 km/h) | 0.29 | 4.4 % |
| Turboprop at 280 kt, 7000 m | 0.46 | 11 % |
| Airliner at Mach 0.85 | 0.85 | 40 % |

The conventional dividing line is **Mach 0.3**, where the density change reaches about 5 % and the incompressible Bernoulli equation under-reads the stagnation pressure rise by about 2 %. Below it — cars, cyclists, buildings, wind turbines, light aircraft, birds — treating air as incompressible costs almost nothing.

### What changes above it
- **Bernoulli needs a correction.** The pressure rise at a [[stagnation-point|stagnation point]] exceeds $\\tfrac12\\rho V^2$ by the factor $C_{p,0}$ below: 2 % at Mach 0.3, 9 % at Mach 0.6, 28 % at Mach 1. Airspeed indicators allow for it; it is the difference between calibrated and equivalent airspeed ([[airspeeds]]).
- **Temperature joins in.** Squeezing air warms it, so energy moves between the motion and the heat of the gas: the flow becomes a problem in thermodynamics as well as mechanics ([[isentropic-flow]], [[stagnation-properties]]).
- **Pressures around a wing grow.** Suction peaks strengthen by roughly $1/\\sqrt{1 - M^2}$ (the Prandtl–Glauert rule) — 40 % at Mach 0.7 — until somewhere on the wing the flow reaches the speed of sound: the [[critical-mach|critical Mach number]].
- **Warnings stop travelling upstream.** Pressure signals move at the speed of sound relative to the air. At low speed they run far ahead of a wing, and the air starts moving aside long before the wing arrives. At Mach 1 they can only keep pace; faster than that, the air ahead gets no warning and the change arrives all at once, as a [[normal-shock|shock wave]].

> [!key] Compressibility belongs to the flow, not the gas: water hammer in a pipe is a compressible flow of a liquid, and a 30 m/s breeze is an incompressible flow of a gas. The Mach number is the measure.

### The stiffness of air
A gas squeezed too quickly to lose its heat resists with the isentropic bulk modulus $K = \\gamma p$: about 142 kPa for air at sea level, against 2.2 GPa for water. The speed of sound is $\\sqrt{K/\\rho}$ — 340 m/s in air, 1480 m/s in water — which is why the Mach numbers of ships' propellers are tiny and those of aircraft are not.
`,
  ideas: [
    'A flow is compressible when its speed is a sizeable fraction of the speed of sound; the Mach number is the measure.',
    'Bringing air to rest raises its density by about M²/2 — under 5 % below Mach 0.3, so slower flows are treated as incompressible.',
    'Above Mach 0.3 the incompressible Bernoulli equation under-reads the stagnation pressure rise: by 2 % at M 0.3, 9 % at M 0.6, 28 % at M 1.',
    'In compressible flow motion and heat are coupled: pressure, density and temperature change together.',
    'Pressure signals travel at the speed of sound; from Mach 1 on they can no longer warn the air ahead, and shocks form.'
  ],
  pitfalls: [
    'Air is compressible, so every airflow must be treated as compressible — What decides is the flow speed compared with the speed of sound. Below Mach 0.3 the density changes by less than 5 % and the incompressible equations are accurate to a couple of per cent.',
    'Compressibility effects begin at Mach 1 — They grow smoothly from zero. At Mach 0.7 the air at a stagnation point is already 26 % denser than the free stream, and the suction peaks on a wing are about 40 % stronger than the low-speed prediction.',
    'Liquids are always incompressible — Water hammer, cavitation collapse and underwater explosions are compressible phenomena. The speed of sound in water is simply so high (about 1480 m/s) that ordinary water flows have tiny Mach numbers.'
  ],
  formulas: [
    {
      name: 'Density change on bringing air to rest (low Mach numbers)',
      expr: 'erho = M^2/2', tex: '\\varepsilon_\\rho = \\frac{\\Delta\\rho}{\\rho} \\approx \\tfrac{1}{2}M^2',
      vars: {
        erho: { name: 'fractional density change Δρ/ρ', q: 'ratio', unit: '%', tex: '\\varepsilon_\\rho' },
        M: { name: 'Mach number', value: 0.3, min: 0, max: 0.7 }
      },
      note: 'The first term of the exact isentropic result ρ₀/ρ − 1 = (1 + 0.2M²)^2.5 − 1 for air: within 2 % of it up to Mach 0.3 and 7 % low at Mach 0.7.',
      stories: {
        erho: 'Air streams past at Mach {M}. By roughly what fraction does its density rise where it is brought to rest?',
        M: 'Up to what Mach number does the density rise at a stagnation point stay below {erho}?'
      }
    },
    {
      name: 'Stagnation pressure coefficient (the compressible pitot reading)',
      expr: 'Cp0 = 2/(gamma*M^2)*((1 + (gamma - 1)/2*M^2)^(gamma/(gamma - 1)) - 1)',
      tex: 'C_{p,0} = \\frac{p_0 - p}{\\tfrac12 \\rho V^2} = \\frac{2}{\\gamma M^2}\\left[\\left(1 + \\frac{\\gamma - 1}{2}M^2\\right)^{\\gamma/(\\gamma - 1)} - 1\\right]',
      vars: {
        Cp0: { name: 'stagnation pressure coefficient (p₀ − p)/q', tex: 'C_{p,0}' },
        gamma: { name: 'ratio of specific heats γ (1.4 for air)', value: 1.4, fixed: true, tex: '\\gamma' },
        M: { name: 'Mach number', value: 0.6, min: 0.01, max: 1 }
      },
      note: 'Exactly 1 in incompressible flow; for air it is 1 + M²/4 + M⁴/40 + … = 1.02 at Mach 0.3, 1.09 at Mach 0.6, 1.28 at Mach 1. Above Mach 1 a shock stands in front of the probe: use the Rayleigh pitot formula (normal shock).',
      stories: {
        Cp0: 'A pitot tube flies at Mach {M}. By what factor does the pressure it measures, p₀ − p, exceed the dynamic pressure ½ρV²?',
        M: 'A pitot-static probe measures a pressure difference {Cp0} times the dynamic pressure ½ρV². What is the Mach number?'
      }
    },
    {
      name: 'Stiffness of air (isentropic bulk modulus)',
      expr: 'K = gamma*p', tex: 'K = \\gamma\\, p',
      vars: {
        K: { name: 'isentropic bulk modulus', q: 'pressure', unit: 'kPa' },
        gamma: { name: 'ratio of specific heats γ (1.4 for air)', value: 1.4, fixed: true, tex: '\\gamma' },
        p: { name: 'air pressure (absolute)', q: 'pressure', unit: 'kPa', value: 101.325 }
      },
      note: 'For a squeeze too quick to lose heat (sound, flow). A slow, isothermal squeeze gives K = p. Water: about 2.2 GPa. The speed of sound is √(K/ρ).',
      stories: { K: 'How stiff is air at {p} against a sudden squeeze — what is its isentropic bulk modulus?', p: 'Air has an isentropic bulk modulus of {K}. What is its pressure?' }
    }
  ],
  examples: [
    {
      title: 'Does a racing car need compressible aerodynamics?',
      q: 'A racing car reaches 350 km/h on a day when the speed of sound is 343 m/s. Estimate the density rise at its nose and the error of using the incompressible Bernoulli equation there.',
      steps: [
        'Speed: $350/3.6 = 97.2$ m/s, so $M = 97.2/343 = 0.283$.',
        'Density rise at the stagnation point: $\\Delta\\rho/\\rho \\approx \\tfrac12 M^2 = 0.040$, about 4 % (the exact isentropic value is 4.1 %).',
        'Pressure: $C_{p,0} = 1 + M^2/4 + M^4/40 = 1 + 0.0200 + 0.0002 = 1.020$ — the true stagnation pressure rise is 2 % above $\\tfrac12\\rho V^2$.'
      ],
      a: 'About 4 % in density and 2 % in stagnation pressure — small enough for racing-car aerodynamics to be done as incompressible flow.'
    },
    {
      title: 'The pitot tube at Mach 0.6',
      q: 'An aircraft flies at Mach 0.6. Its pitot-static system measures $p_0 - p$. If that were turned into a speed with the incompressible formula $V = \\sqrt{2(p_0 - p)/\\rho}$, how far wrong would it be?',
      steps: [
        'The measured difference is $C_{p,0}$ times the true dynamic pressure: $C_{p,0} = \\frac{2}{1.4 \\times 0.36}\\left[(1 + 0.2 \\times 0.36)^{3.5} - 1\\right] = 3.968 \\times 0.2755 = 1.093$.',
        'The incompressible formula takes a square root, so the speed comes out $\\sqrt{1.093} = 1.046$ times too high.',
        'That is why airspeed indicators are calibrated with the compressible formula (see [[airspeeds]]).'
      ],
      a: 'About 4.6 % too fast: 9.3 % too much pressure, square-rooted.'
    }
  ],
  quiz: [
    { q: 'Roughly how much does the density of air rise when a stream at Mach 0.3 is brought to rest?', choices: ['4.5 %', '0.3 %', '30 %', '0.09 %'], a: 0,
      why: 'Δρ/ρ ≈ M²/2 = 0.09/2 = 0.045. That 5 % is why Mach 0.3 is taken as the limit of incompressible flow.' },
    { q: 'Applied to a pitot tube at Mach 0.8, the incompressible Bernoulli equation gives an airspeed that is…', choices: ['too high', 'too low', 'exactly right', 'too high only in cold air'], a: 0,
      why: 'The real stagnation pressure rise is larger than ½ρV² (by 17 % at Mach 0.8), so solving V = √(2Δp/ρ) overstates the speed, here by about 8 %.' },
    { q: 'Doubling the speed of a flow at Mach 0.1 roughly quadruples the density change at a stagnation point.', a: true,
      why: 'At low Mach numbers Δρ/ρ ≈ M²/2, so it scales with the square of the speed.' },
    { q: 'Using Δρ/ρ ≈ M²/2, at what Mach number does the density rise on bringing air to rest reach 10 %?', answer: 0.447, tol: 0.03,
      why: 'M²/2 = 0.10 gives M = √0.2 = 0.447. The exact isentropic value is a little lower, M ≈ 0.44.' },
    { q: 'Why is the water in a garden hose treated as incompressible, although water hammer is a compressible effect?', choices: ['Its speed is a tiny fraction of the speed of sound in water', 'Water has no bulk modulus', 'Liquids cannot carry sound', 'The hose walls stop it compressing'], a: 0,
      why: 'A few metres per second against 1480 m/s is a Mach number near 0.002. Water hammer is different: a valve slammed shut stops the flow in milliseconds and sends a pressure wave along the pipe at the speed of sound.' }
  ],
  problems: [
    { q: 'A wind tunnel runs at 70 m/s in air at 20 °C, where the speed of sound is 343 m/s. Estimate the density rise at the model\'s stagnation point, in per cent.', answer: 2.1, unit: '%', tol: 0.05,
      steps: ['$M = 70/343 = 0.204$.', '$\\Delta\\rho/\\rho \\approx \\tfrac12 \\times 0.204^2 = 0.021$, about 2.1 %.'] },
    { q: 'What is the isentropic bulk modulus of air at 11 000 m, where the pressure is 22.6 kPa?', answer: 31.7, unit: 'kPa', tol: 0.02,
      steps: ['$K = \\gamma p = 1.4 \\times 22.6 = 31.7$ kPa — about a fifth of its sea-level value.'] }
  ],
  applications: [
    'Deciding when a wind-tunnel test or a CFD run must include compressibility (above about Mach 0.3).',
    'Calibrating airspeed indicators, which must allow for compression in the pitot tube.',
    'Fans, compressors and propeller tips, whose blade speeds approach the speed of sound even when the vehicle is slow.',
    'Ventilation ducts and building aerodynamics, which stay safely incompressible at a few tens of metres per second.'
  ],
  history: 'Newton treated sound as an isothermal squeeze and predicted about 298 m/s, some 15 % too low. Laplace pointed out around 1816 that the squeeze is too quick for heat to flow, so the stiffness is γp rather than p, and the discrepancy vanished. The first practical trouble with compressibility came from propellers: in the 1920s, tips running close to Mach 1 lost thrust and roared, which started the high-speed airfoil tests of Briggs and Dryden in the United States.',
  sim: { id: 'comp-mach-cone', params: { M: 0.5 } }
});

Hyper.add({
  id: 'isentropic-flow', parent: 'compressible-basics', title: 'Isentropic flow', level: 2,
  short: 'Flow with no friction and no heat transfer: the entropy of every parcel stays constant, and pressure, density and temperature are tied together by simple power laws. It describes nozzles, intakes and the flow outside boundary layers and shocks almost exactly.',
  keywords: ['isentropic', 'adiabatic', 'reversible', 'entropy', 'p/ρ^γ', 'ratio of specific heats', 'gamma', 'area–velocity relation', 'isentropic relations', 'compressible flow tables', 'NACA 1135'],
  prereq: ['compressibility', 'ideal-gas-air', 'physics:first-law-thermodynamics', 'continuity'],
  related: ['stagnation-properties', 'nozzles', 'de-laval-nozzle', 'expansion-fans', 'normal-shock', 'physics:entropy', 'physics:thermodynamic-processes'],
  body: `
Most of a high-speed flow is well behaved. Outside the thin [[boundary-layer|boundary layers]] and away from shock waves, no parcel of air rubs hard against its neighbours, and none has time to exchange heat with them: the air around a wing is squeezed and released within a few thousandths of a second. A process that is both **adiabatic** (no heat in or out) and **reversible** (no friction, no shocks) keeps the entropy of the gas constant — it is **isentropic** — and for an ideal gas that single condition ties the state variables together:
$$\\frac{p}{\\rho^{\\gamma}} = \\text{const}, \\qquad \\frac{p_2}{p_1} = \\left(\\frac{\\rho_2}{\\rho_1}\\right)^{\\gamma} = \\left(\\frac{T_2}{T_1}\\right)^{\\gamma/(\\gamma - 1)}$$
Here $\\gamma = c_p/c_v$, the ratio of specific heats: 1.40 for air, nitrogen and oxygen, 1.67 for helium and argon, about 1.3 for carbon dioxide and steam, near 1.2 for hot rocket exhaust. For air the exponent $\\gamma/(\\gamma - 1)$ is exactly 3.5 — a number that turns up all over gas dynamics.

### Speed traded for temperature
With no heat and no work crossing the boundary, the energy equation along a streamline says enthalpy plus kinetic energy stays constant:
$$c_p T + \\tfrac12 V^2 = c_p T_0$$
Speeding up cools the air; slowing down warms it. With $V^2 = M^2\\gamma R T$ and $c_p = \\gamma R/(\\gamma - 1)$ this becomes the master relation of the subject,
$$\\frac{T_0}{T} = 1 + \\frac{\\gamma - 1}{2}M^2$$
and the power laws above turn it into pressure and density ratios. $T_0$, $p_0$ and $\\rho_0$ are the [[stagnation-properties|stagnation conditions]] — what the gas would reach if brought to rest isentropically — and in isentropic flow they are the same all along the stream. Every line of a compressible-flow table is these ratios:

| $M$ | $T_0/T$ | $p_0/p$ | $\\rho_0/\\rho$ | $A/A^*$ |
|---|---|---|---|---|
| 0.3 | 1.018 | 1.064 | 1.046 | 2.035 |
| 0.5 | 1.050 | 1.186 | 1.130 | 1.340 |
| 0.8 | 1.128 | 1.524 | 1.351 | 1.038 |
| 1.0 | 1.200 | 1.893 | 1.577 | 1.000 |
| 1.5 | 1.450 | 3.671 | 2.532 | 1.176 |
| 2.0 | 1.800 | 7.824 | 4.347 | 1.688 |
| 3.0 | 2.800 | 36.73 | 13.12 | 4.235 |

($\\gamma = 1.4$; the [isentropic calculator](#/tools/flight/isentropic) gives any Mach number.)

### The surprising area rule
Put together continuity ($\\rho V A$ constant), the momentum equation for frictionless flow ($dp = -\\rho V\\,dV$) and the isentropic link $dp = a^2\\,d\\rho$, and you find how a duct must change its area to change the speed:
$$\\frac{dA}{A} = (M^2 - 1)\\,\\frac{dV}{V}$$
- **Subsonic** ($M < 1$): the bracket is negative, so a **narrowing** duct speeds the flow — the garden-hose nozzle.
- **Supersonic** ($M > 1$): the bracket is positive, so the flow speeds up in a **widening** duct. The density now falls faster than the speed rises, and the gas needs more room.
- **Sonic** ($M = 1$): $dA = 0$ — Mach 1 can only be reached at a **throat**, the narrowest section.

That is the secret of the [[de-laval-nozzle|converging–diverging nozzle]], of rocket engines and supersonic wind tunnels, and the reason a supersonic intake slows the air in a converging passage ([[nozzles]]).

> [!key] Isentropic flow is the ideal: no friction, no heat transfer, no shocks. Where it holds, stagnation pressure and temperature are constant along the flow and the Mach number alone fixes every ratio.

### Where it fails
Friction in boundary layers and the sudden compression inside a [[normal-shock|shock wave]] create entropy, so the stagnation pressure falls — though the stagnation temperature stays put as long as no heat is exchanged. Engineers use the isentropic result as the yardstick and rate real machines by their efficiency against it: about 90 % for a good compressor stage, 97–99 % for a well-made nozzle.
`,
  ideas: [
    'Isentropic means adiabatic and reversible: no heat transfer, no friction, no shocks — the entropy of each parcel stays constant.',
    'For an ideal gas p/ρ^γ is constant, and p ∝ T^(γ/(γ−1)) = T^3.5 for air.',
    'T₀/T = 1 + (γ − 1)M²/2: the Mach number alone fixes the ratios of temperature, pressure and density to their stagnation values.',
    'dA/A = (M² − 1) dV/V: subsonic flow speeds up in a narrowing duct, supersonic flow in a widening one, and Mach 1 is reached only at a throat.',
    'Shocks and friction break the isentropic ideal and lower the stagnation pressure; real machines are rated by efficiency against it.'
  ],
  pitfalls: [
    'Adiabatic means the temperature stays constant — It means no heat crosses the boundary. A gas expanding adiabatically does work and cools (air from a 7 bar line would reach −105 °C); one compressed adiabatically heats up.',
    'A narrowing duct always speeds a flow up — Only a subsonic one. In supersonic flow a converging duct slows the air down and a diverging one accelerates it.',
    'Isentropic and incompressible mean the same — An isentropic flow can change its density enormously (the exit of a rocket nozzle); it only requires that no entropy is created.'
  ],
  formulas: [
    {
      name: 'Isentropic change: pressure and temperature',
      expr: 'p2 = p1*(T2/T1)^(gamma/(gamma - 1))',
      tex: '\\frac{p_2}{p_1} = \\left(\\frac{T_2}{T_1}\\right)^{\\gamma/(\\gamma - 1)}',
      vars: {
        p2: { name: 'final pressure (absolute)', q: 'pressure', unit: 'bar', value: 7, tex: 'p_2' },
        p1: { name: 'initial pressure (absolute)', q: 'pressure', unit: 'bar', value: 1, tex: 'p_1' },
        T2: { name: 'final temperature', q: 'temperature', unit: '°C', tex: 'T_2' },
        T1: { name: 'initial temperature', q: 'temperature', unit: '°C', value: 20, min: -60, max: 300, tex: 'T_1' },
        gamma: { name: 'ratio of specific heats γ (1.4 for air)', value: 1.4, fixed: true, tex: '\\gamma' }
      },
      solveFor: 'T2',
      note: 'Absolute pressures and temperatures (°C is converted to kelvin for you). For a quick, frictionless squeeze or expansion; a real compressor delivers hotter air, a real expansion ends a little less cold.',
      practice: { unknowns: ['T2', 'p2'] },
      stories: {
        T2: 'Air at {T1} and {p1} is compressed with no heat loss or friction to {p2}. How hot does it get?',
        p2: 'Air at {p1} and {T1} expands isentropically until its temperature is {T2}. What is its pressure now?'
      }
    },
    {
      name: 'Isentropic change: pressure and density',
      expr: 'p2 = p1*(rho2/rho1)^gamma',
      tex: '\\frac{p_2}{p_1} = \\left(\\frac{\\rho_2}{\\rho_1}\\right)^{\\gamma}',
      vars: {
        p2: { name: 'final pressure (absolute)', q: 'pressure', unit: 'bar', value: 7, tex: 'p_2' },
        p1: { name: 'initial pressure (absolute)', q: 'pressure', unit: 'bar', value: 1, tex: 'p_1' },
        rho2: { name: 'final density', q: 'density', unit: 'kg/m³', tex: '\\rho_2' },
        rho1: { name: 'initial density', q: 'density', unit: 'kg/m³', value: 1.19, tex: '\\rho_1' },
        gamma: { name: 'ratio of specific heats γ (1.4 for air)', value: 1.4, fixed: true, tex: '\\gamma' }
      },
      solveFor: 'rho2',
      note: 'p/ρ^γ stays constant. Compare the isothermal law p/ρ = const: a quick squeeze raises the pressure more for the same density change, because the gas warms as well.',
      stories: {
        rho2: 'Air of density {rho1} at {p1} is compressed isentropically to {p2}. What is its density now?',
        p2: 'Air at {p1} with density {rho1} is squeezed isentropically until its density is {rho2}. What is its pressure?'
      }
    },
    {
      name: 'Area–velocity relation',
      expr: 'eA = (M^2 - 1)*eV',
      tex: '\\varepsilon_A = (M^2 - 1)\\,\\varepsilon_V \\qquad \\left(\\varepsilon_A = \\frac{dA}{A},\\ \\ \\varepsilon_V = \\frac{dV}{V}\\right)',
      vars: {
        eA: { name: 'fractional change of duct area dA/A', q: 'ratio', unit: '%', signed: true, tex: '\\varepsilon_A' },
        M: { name: 'Mach number', value: 0.5, min: 0, max: 5 },
        eV: { name: 'fractional change of speed dV/V', q: 'ratio', unit: '%', value: 1, signed: true, tex: '\\varepsilon_V' }
      },
      note: 'For small changes in steady, frictionless, adiabatic flow. A negative ε_A means the duct narrows. At M = 1 the area must be stationary: a throat.',
      practice: { unknowns: ['eA', 'eV'] },
      stories: {
        eA: 'Air flows along a duct at Mach {M}. By what fraction must the area change to speed it up by {eV}?',
        eV: 'A duct carrying air at Mach {M} changes its area by {eA}. By what fraction does the speed change?'
      }
    }
  ],
  examples: [
    {
      title: 'How hot does a compressor make the air?',
      q: 'Air at 1 bar and 20 °C is compressed to 7 bar (absolute). What temperature would an ideal, isentropic compressor deliver?',
      steps: [
        'Absolute values: $T_1 = 293.15$ K and a pressure ratio of 7.',
        '$T_2 = T_1\\,(p_2/p_1)^{(\\gamma - 1)/\\gamma} = 293.15 \\times 7^{0.2857} = 293.15 \\times 1.744 = 511$ K.',
        'That is 238 °C. A real compressor is not reversible and delivers hotter air still, which is why multi-stage machines cool the air between stages.'
      ],
      a: 'About 511 K, or 238 °C.'
    },
    {
      title: 'Nozzle or diffuser?',
      q: 'Air flows at Mach 0.5 in one duct and at Mach 2 in another. In each, what change of area speeds the flow up by 1 %?',
      steps: [
        'Mach 0.5: $\\varepsilon_A = (0.25 - 1) \\times 1\\,\\% = -0.75\\,\\%$ — the duct must narrow.',
        'Mach 2: $\\varepsilon_A = (4 - 1) \\times 1\\,\\% = +3\\,\\%$ — the duct must widen, by four times as much as the subsonic one narrows.',
        'Near Mach 1 the bracket is close to zero: a tiny area change makes a large speed change, which is why the flow near a throat is so sensitive.'
      ],
      a: '−0.75 % (narrowing) at Mach 0.5; +3 % (widening) at Mach 2.'
    }
  ],
  quiz: [
    { q: 'Air from a line at 7 bar absolute and 20 °C expands isentropically to 1 bar. Its temperature would fall to about…', choices: ['−105 °C', '−20 °C', '0 °C', '20 °C, since the expansion is adiabatic'], a: 0,
      why: 'T₂ = 293 K / 7^0.286 = 168 K = −105 °C. Adiabatic means no heat transfer, not constant temperature: the expanding gas does work on its surroundings and pays for it from its internal energy. In a real leak the jet mixes and warms quickly, but valves and silencers can still ice up.' },
    { q: 'In a supersonic flow, a duct that narrows makes the flow…', choices: ['slow down', 'speed up', 'keep its speed', 'go subsonic at once'], a: 0,
      why: 'dA/A = (M² − 1) dV/V with M > 1: a negative dA gives a negative dV. Supersonic intakes use exactly this to slow the air.' },
    { q: 'In isentropic flow the stagnation pressure is the same at every point along the flow.', a: true,
      why: 'With no friction, heat transfer or shocks there is no loss: p₀ and T₀ stay constant. Shocks and friction lower p₀.' },
    { q: 'For air (γ = 1.4), what is the exponent γ/(γ − 1) in p ∝ T^(γ/(γ−1))?', answer: 3.5, tol: 0.01,
      why: '1.4/0.4 = 3.5. So a 10 % rise in absolute temperature in an isentropic compression goes with 1.1^3.5 = 1.40, a 40 % rise in pressure.' },
    { q: 'Where in a duct can a steady isentropic flow reach exactly Mach 1?', choices: ['at the narrowest section, a throat', 'at the exit', 'where the area is largest', 'anywhere, depending on the pressure'], a: 0,
      why: 'At M = 1 the area–velocity relation requires dA = 0 while the speed is still changing: a minimum of area, the throat.' }
  ],
  problems: [
    { q: 'Air at 1.0 bar and 15 °C is compressed isentropically to 3.0 bar (absolute). What is its temperature, in kelvin?', answer: 394, unit: 'K', tol: 0.01,
      steps: ['$T_2 = 288.15 \\times 3^{0.2857} = 288.15 \\times 1.369 = 394$ K (121 °C).'] },
    { q: 'Air expands isentropically until its pressure is halved. By what percentage does its density fall?', answer: 39, unit: '%', tol: 0.03,
      steps: ['$\\rho_2/\\rho_1 = (p_2/p_1)^{1/\\gamma} = 0.5^{0.714} = 0.610$.', 'The density falls by 39 % — less than the 50 % of an isothermal expansion, because the gas cools.'] }
  ],
  applications: [
    'Nozzles of rocket engines, jet engines and steam turbines, designed as isentropic expansions.',
    'Rating compressors and turbines by their isentropic efficiency.',
    'Supersonic wind tunnels, whose test-section conditions come straight from the isentropic tables.',
    'The flow between shocks and outside boundary layers around any high-speed vehicle.'
  ],
  history: 'The adiabatic law p/ρ^γ = const came from Laplace and Poisson early in the nineteenth century. The tables high-speed engineers used for decades — isentropic ratios, normal and oblique shocks, Prandtl–Meyer angles — were gathered in NACA Report 1135, "Equations, Tables, and Charts for Compressible Flow" (1953), still a standard reference; the gas-dynamics calculators here are checked against it.',
  sim: { id: 'comp-nozzle', params: { pb: 0.094, ar: 2 } }
});

Hyper.add({
  id: 'stagnation-properties', parent: 'compressible-basics', title: 'Stagnation temperature and pressure', level: 2,
  short: 'Bring a moving gas to rest without losses and it reaches its stagnation (total) temperature and pressure. They are what a thermometer on the nose or a pitot tube actually senses, and they explain why fast aircraft get hot.',
  keywords: ['stagnation temperature', 'total temperature', 'stagnation pressure', 'total pressure', 'ram rise', 'TAT', 'SAT', 'static air temperature', 'kinetic heating', 'recovery factor', 'Machmeter', 'Concorde'],
  prereq: ['isentropic-flow', 'stagnation-point', 'mach-number'],
  related: ['pitot-tube', 'airspeeds', 'normal-shock', 'hypersonic-flight', 'nozzles', 'physics:first-law-thermodynamics'],
  body: `
A thermometer held out of a fast aircraft does not read the temperature of the air. The air around its bulb has been slowed nearly to rest, and the kinetic energy it carried has become heat. The temperature a gas reaches when brought to rest adiabatically is its **stagnation** or **total temperature** $T_0$; the temperature of the moving gas itself is its **static temperature** $T$. They differ by the kinetic energy divided by the specific heat:
$$T_0 = T + \\frac{V^2}{2c_p}, \\qquad \\frac{T_0}{T} = 1 + \\frac{\\gamma - 1}{2}M^2$$
With $c_p = 1005$ J/(kg·K) for air the rise is 5 K at 100 m/s, 31 K at 250 m/s — an airliner's cruise — and 179 K at 600 m/s.

### What the instruments see
Airliners carry a **total air temperature** (TAT) probe and compute the **static air temperature** (SAT) from its reading and the Mach number. At Mach 0.85 at 11 000 m, where the standard atmosphere is at −56.5 °C, the probe reads about −25 °C: a "ram rise" of more than 30 K. Performance and engine calculations use the static value; the skin, and the fuel in the wings, sit in slowed air and feel something close to the total value.

### Heating at high speed
The same arithmetic makes fast aircraft hot. On the nose of Concorde, cruising at Mach 2.02 in air at −56.5 °C,
$$T_0 = 216.65 \\times (1 + 0.2 \\times 2.02^2) = 393\\ \\mathrm{K} \\approx 120\\ ^{\\circ}\\mathrm{C}$$
Its aluminium alloy was chosen for long exposure at about that temperature, which is one reason it cruised at Mach 2 and no faster; the fuselage also grew measurably longer in cruise. The SR-71, at Mach 3.2, saw stagnation temperatures near 400 °C and was built of titanium.

| Flight | Mach | Static temperature | Stagnation temperature |
|---|---|---|---|
| Airliner cruise, 11 km | 0.85 | −56.5 °C | −25 °C |
| Concorde cruise, 17 km | 2.02 | −56.5 °C | 120 °C |
| SR-71 cruise, 24 km | 3.2 | −52.5 °C | 400 °C |

A surface under a boundary layer does not quite reach $T_0$: friction heats the air near it while conduction carries heat away, and the wall settles at the **adiabatic wall temperature** $T + r\\,(T_0 - T)$ with a **recovery factor** $r \\approx 0.85$ for a laminar and 0.89 for a turbulent layer. Past Mach 5 the ratio explodes — $T_0/T = 6$ at Mach 5 and 126 at Mach 25 — and air stops behaving as a simple ideal gas: it dissociates and soaks up energy, so a re-entry shock layer reaches "only" several thousand kelvin ([[hypersonic-flight]]).

### Stagnation pressure
Bringing the flow to rest isentropically also raises its pressure, to the **stagnation** or **total pressure**
$$\\frac{p_0}{p} = \\left(1 + \\frac{\\gamma - 1}{2}M^2\\right)^{\\gamma/(\\gamma - 1)}$$
This is what the open mouth of a [[pitot-tube|pitot tube]] measures in subsonic flight; with the static pressure from a side port it gives the Mach number directly — that is how a Machmeter works. At low speed it reduces to Bernoulli's $p_0 = p + \\tfrac12\\rho V^2$ ([[compressibility]] has the correction). A supersonic pitot tube reads the stagnation pressure *behind* the shock that forms in front of it ([[normal-shock]]).

> [!key] Total temperature is conserved whenever no heat or work crosses the boundary — even through shocks and friction. Total pressure is conserved only in isentropic flow; every irreversibility lowers it, and its loss measures the energy wasted.
`,
  ideas: [
    'The stagnation (total) temperature is what a gas reaches when brought to rest adiabatically: T₀ = T + V²/(2c_p).',
    'For air T₀/T = 1 + 0.2M²: a 31 K ram rise for an airliner, about 120 °C on Concorde\'s nose at Mach 2.',
    'Stagnation pressure p₀/p = (1 + 0.2M²)^3.5 is what a subsonic pitot tube measures; with the static pressure it gives the Mach number.',
    'Total temperature survives shocks and friction if no heat is exchanged; total pressure falls with every loss.',
    'A surface reaches the adiabatic wall temperature, a recovery factor of about 0.85–0.89 of the way from T to T₀.'
  ],
  pitfalls: [
    'The TAT probe reads the outside air temperature — It reads the temperature of air slowed to rest on the probe, 30 K or more above the static air temperature at airliner cruise speeds.',
    'Supersonic aircraft get hot from air friction — Mostly they get hot because the air is brought nearly to rest against them and its kinetic energy becomes heat; friction in the boundary layer only decides how close to the stagnation temperature the skin gets.',
    'The stagnation pressure is the same everywhere in a flow — Only where the flow is isentropic. Shocks, friction and mixing all lower it, which is how engineers measure losses.'
  ],
  formulas: [
    {
      name: 'Stagnation (total) temperature',
      expr: 'T0 = T*(1 + (gamma - 1)/2*M^2)',
      tex: 'T_0 = T\\left(1 + \\frac{\\gamma - 1}{2}M^2\\right)',
      vars: {
        T0: { name: 'stagnation (total) temperature', q: 'temperature', unit: '°C', tex: 'T_0' },
        T: { name: 'static temperature of the moving air', q: 'temperature', unit: '°C', value: -56.5, min: -90, max: 50 },
        gamma: { name: 'ratio of specific heats γ (1.4 for air)', value: 1.4, fixed: true, tex: '\\gamma' },
        M: { name: 'Mach number', value: 0.85, min: 0, max: 10 }
      },
      note: 'Holds through shocks and friction as long as no heat is exchanged. Surfaces reach a little less (recovery factor 0.85–0.89 of the rise). Beyond about Mach 5 real-gas effects make the ideal-gas value too high.',
      stories: {
        T0: 'An airliner cruises at Mach {M} in air at {T}. What does its total-air-temperature probe read?',
        T: 'At Mach {M} a TAT probe reads {T0}. What is the static air temperature outside?',
        M: 'Air at {T} is brought to rest and warms to {T0}. What was its Mach number?'
      }
    },
    {
      name: 'Stagnation (total) pressure',
      expr: 'p0 = p*(1 + (gamma - 1)/2*M^2)^(gamma/(gamma - 1))',
      tex: 'p_0 = p\\left(1 + \\frac{\\gamma - 1}{2}M^2\\right)^{\\gamma/(\\gamma - 1)}',
      vars: {
        p0: { name: 'stagnation (total) pressure', q: 'pressure', unit: 'kPa', tex: 'p_0' },
        p: { name: 'static pressure', q: 'pressure', unit: 'kPa', value: 22.63 },
        gamma: { name: 'ratio of specific heats γ (1.4 for air)', value: 1.4, fixed: true, tex: '\\gamma' },
        M: { name: 'Mach number', value: 0.85, min: 0, max: 5 }
      },
      note: 'Isentropic compression to rest. For a pitot tube it holds below Mach 1; above, use the Rayleigh pitot formula. Solved for M it is the Machmeter: M = √(5[(p₀/p)^(2/7) − 1]) for air.',
      stories: {
        p0: 'At Mach {M}, where the static pressure is {p}, what total pressure does a pitot tube measure?',
        M: 'A pitot tube reads {p0} where the static pressure is {p}. What is the Mach number?'
      }
    },
    {
      name: 'Stagnation temperature rise from the speed',
      expr: 'dT = V^2/(2*cp)', tex: '\\Delta T = T_0 - T = \\frac{V^2}{2c_p}',
      vars: {
        dT: { name: 'temperature rise when brought to rest', q: 'dtemp', unit: 'K', tex: '\\Delta T' },
        V: { name: 'speed of the air relative to the body', q: 'speed', unit: 'm/s', value: 250 },
        cp: { name: 'specific heat at constant pressure (1005 for air)', q: 'specificheat', unit: 'J/(kg·K)', value: 1005, fixed: true, tex: 'c_p' }
      },
      practice: { unknowns: ['dT', 'V'] },
      note: 'The same relation written with the speed instead of the Mach number; it does not depend on the air temperature. Kinetic energy per kilogram, V²/2, becomes enthalpy c_p ΔT.',
      stories: {
        dT: 'By how much does air moving at {V} warm up when it is brought to rest?',
        V: 'A thermometer on a fast aircraft reads {dT} above the outside air. Roughly how fast is the aircraft flying?'
      }
    }
  ],
  examples: [
    {
      title: 'Total and static air temperature',
      q: 'An airliner cruises at Mach 0.85 at 11 000 m, where the static air temperature is −56.5 °C. What does its TAT probe read?',
      steps: [
        '$T = 216.65$ K.',
        '$T_0 = 216.65 \\times (1 + 0.2 \\times 0.85^2) = 216.65 \\times 1.1445 = 247.96$ K.',
        'That is −25.2 °C, a ram rise of 31 K.'
      ],
      a: 'About −25 °C, 31 K above the static temperature.'
    },
    {
      title: 'The pitot tube on an airliner',
      q: 'At Mach 0.85 at 11 000 m (p = 22.63 kPa, ρ = 0.364 kg/m³, a = 295.1 m/s), find the stagnation pressure and $p_0 - p$. What speed would the incompressible Bernoulli equation give from that difference?',
      steps: [
        '$p_0/p = (1 + 0.2 \\times 0.7225)^{3.5} = 1.1445^{3.5} = 1.604$, so $p_0 = 36.30$ kPa and $p_0 - p = 13.67$ kPa.',
        'Incompressible: $V = \\sqrt{2 \\times 13\\,670/0.364} = 274$ m/s.',
        'The true speed is $0.85 \\times 295.1 = 251$ m/s.'
      ],
      a: 'p₀ = 36.3 kPa; the incompressible formula would overstate the speed by 9 %.'
    },
    {
      title: 'Concorde\'s nose',
      q: 'Concorde cruised at Mach 2.02 where the air was at −56.5 °C (speed of sound 295 m/s). What was the stagnation temperature on its nose?',
      steps: [
        'Speed: $V = 2.02 \\times 295 = 596$ m/s.',
        'Rise: $\\Delta T = V^2/(2c_p) = 596^2/2010 = 177$ K.',
        '$T_0 = 216.65 + 177 = 393$ K — the same as $216.65 \\times (1 + 0.2 \\times 2.02^2)$.'
      ],
      a: 'About 393 K, roughly 120 °C.'
    }
  ],
  quiz: [
    { q: 'A TAT probe on an airliner flying at Mach 0.8 reads −28 °C. The static air temperature is about…', choices: ['−56 °C', '−28 °C', '−2 °C', '−40 °C'], a: 0,
      why: 'T = T₀/(1 + 0.2 × 0.64) = 245.2 K/1.128 = 217.3 K, about −56 °C.' },
    { q: 'Through a normal shock the stagnation temperature stays the same but the stagnation pressure falls.', a: true,
      why: 'No heat is added, so the total enthalpy (and T₀) is conserved; the shock is irreversible, so entropy rises and p₀ falls.' },
    { q: 'At Mach 5, how many times the static temperature is the stagnation temperature (γ = 1.4)?', answer: 6, tol: 0.01,
      why: '1 + 0.2 × 25 = 6. From −50 °C that would be over 1000 °C, one reason hypersonic flight is a heating problem.' },
    { q: 'Why can\'t an ordinary thermometer on a fast aircraft measure the static air temperature directly?', choices: ['The air it touches has been slowed and warmed by its own kinetic energy', 'Thermometers respond too slowly', 'Static temperature is a theoretical quantity', 'Thin air cannot conduct heat'], a: 0,
      why: 'Any probe brings the air near it to rest, so it senses something close to the total temperature; the static value is computed from it and the Mach number.' },
    { q: 'The temperature rise of air moving at 300 m/s when it is brought to rest is about…', choices: ['45 K', '4.5 K', '90 K', '150 K'], a: 0,
      why: 'ΔT = V²/(2c_p) = 90 000/2010 = 44.8 K.' }
  ],
  problems: [
    { q: 'A fast aircraft\'s nose thermometer reads 70 K above the outside air. Estimate its airspeed.', answer: 375, unit: 'm/s', tol: 0.02,
      steps: ['$V = \\sqrt{2 c_p \\Delta T} = \\sqrt{2 \\times 1005 \\times 70}$.', '$= \\sqrt{140\\,700} = 375$ m/s.'] },
    { q: 'What stagnation pressure does a pitot tube measure at Mach 0.6 where the static pressure is 50 kPa?', answer: 63.8, unit: 'kPa', tol: 0.02,
      steps: ['$p_0/p = (1 + 0.2 \\times 0.36)^{3.5} = 1.072^{3.5} = 1.2755$.', '$p_0 = 50 \\times 1.2755 = 63.8$ kPa.'] }
  ],
  applications: [
    'Total- and static-air-temperature probes and the Machmeter on airliners.',
    'Thermal design of supersonic aircraft, missiles and re-entry vehicles.',
    'Rating jet engines and compressors, whose inlet conditions are given as total pressure and temperature.',
    'Measuring the losses of an intake, duct or blade row as a drop in total pressure.'
  ],
  history: 'Concorde\'s airframe was made of an aluminium alloy chosen for long exposure near 127 °C, which pinned its cruise at about Mach 2; going faster would have meant titanium, as on the SR-71. That aircraft was so loosely assembled on the ground, to leave room for its panels to grow when hot, that it dripped fuel on the runway until kinetic heating in flight closed the gaps.',
  sim: 'comp-normal-shock'
});

Hyper.add({
  id: 'mach-regimes', parent: 'compressible-basics', title: 'Subsonic, transonic, supersonic, hypersonic', level: 1,
  short: 'Aerodynamicists sort flight by Mach number because the physics changes character: effectively incompressible below 0.3, compressible but smooth up to about 0.8, mixed and troublesome near 1, shaped by shock waves above it, and by heat beyond 5.',
  keywords: ['subsonic', 'transonic', 'supersonic', 'hypersonic', 'speed regimes', 'flight regimes', 'Mach number', 'sound barrier', 'high-speed flight'],
  prereq: ['mach-number', 'compressibility', 'speed-of-sound'],
  related: ['critical-mach', 'transonic-flow', 'wave-drag', 'hypersonic-flight', 'mach-cone', 'stagnation-properties'],
  body: `
The [[mach-number|Mach number]] $M = V/a$ compares a body's speed with the speed at which the air passes on pressure signals — the [[speed-of-sound|speed of sound]], 340 m/s at sea level and 295 m/s in the cold air above 11 km. As $M$ grows the flow changes character, so speeds are grouped into regimes. The boundaries are conventions rather than sharp lines, but each regime has its own problems, tools and shapes.

| Regime | Mach | What the flow does | Examples |
|---|---|---|---|
| Low subsonic | below 0.3 | density practically constant | cars, light aircraft, birds, wind turbines |
| High subsonic | 0.3–0.8 | compressible but smooth, no shocks | turboprops, early jets, fans |
| Transonic | 0.8–1.2 | supersonic pockets ending in shocks | airliners at M 0.78–0.86, propeller and rotor tips |
| Supersonic | 1.2–5 | shocks and expansion waves everywhere | Concorde (2.0), fighters (1.5–2.5), SR-71 (3.2), rifle bullets (2–3) |
| Hypersonic | above 5 | thin, hot shock layers; heating dominates | X-15 (6.7), X-43A (9.6), re-entry (up to 25) |

### Subsonic
Pressure signals race ahead of the body, so the air starts moving aside well before it arrives; streamlines curve gently and the flow is smooth. Below Mach 0.3 the density hardly changes ([[compressibility]]). Up to about 0.7 the changes act only as a correction: pressure coefficients grow by roughly $1/\\sqrt{1 - M^2}$, the lift slope with them, and drag barely changes.

### Transonic
Air speeds up over a wing, so the local Mach number there exceeds the flight Mach number. For a typical wing the local flow first touches Mach 1 somewhere between Mach 0.7 and 0.8 — the [[critical-mach|critical Mach number]] — and beyond it a supersonic pocket forms that ends in a shock. Drag climbs steeply, the shock can separate the boundary layer and cause buffet, and the aerodynamic centre shifts. Airliners cruise just inside this regime with swept, [[special-airfoils|supercritical]] wings ([[transonic-flow]], [[swept-wing-compressibility]]). Near Mach 1 the flow is mixed and hard to compute; this is where early aircraft met the "sound barrier".

### Supersonic
From about Mach 1.2 the flow is supersonic nearly everywhere, except in small pockets behind blunt noses. The air ahead of the body gets no warning: it is turned abruptly by [[oblique-shock|shock waves]] and smoothly by [[expansion-fans|expansion fans]], and the disturbances trail behind in a [[mach-cone|Mach cone]]. [[wave-drag|Wave drag]] appears, wings become thin and sharp-edged, and the lift slope now *falls* with Mach number, roughly as $4/\\sqrt{M^2 - 1}$ per radian.

### Hypersonic
No single line marks it, but by Mach 5 new effects take over. The flow's kinetic energy is several times its heat content — the ratio in the second formula below is 5 at Mach 5 and 125 at Mach 25 — so bringing air to rest makes it extremely hot. Shocks hug the surface in thin **shock layers**, molecules vibrate, dissociate and ionise, and heating rather than drag drives the design ([[hypersonic-flight]]).

> [!warn] The speeds and Mach numbers here are typical, rounded figures. Every aircraft has a maximum operating Mach number in its approved flight manual; aircraft are flown to their manuals and the rules of the air, not to these pages.
`,
  ideas: [
    'The Mach number M = V/a sets the flow regime: low subsonic below 0.3, high subsonic to about 0.8, transonic 0.8–1.2, supersonic to 5, hypersonic above.',
    'The speed of sound falls with temperature, so the same true airspeed is a higher Mach number in the cold air high up.',
    'Transonic flow is mixed: supersonic pockets on the wing end in shocks, causing drag rise and buffet — airliners cruise at its edge.',
    'Supersonic flow is shaped by shocks, expansion fans and the Mach cone; wave drag appears.',
    'In hypersonic flow kinetic energy dwarfs heat content, so heating and high-temperature chemistry dominate.'
  ],
  pitfalls: [
    'Below Mach 1 there is no supersonic flow around an aircraft — Air accelerates over the wing; above the critical Mach number, around 0.7–0.8, parts of the flow are supersonic even though the aircraft is not.',
    'The regime boundaries are exact — They are conventions. Where transonic effects start depends on the wing\'s thickness and sweep; "hypersonic" describes a set of effects that grow gradually past about Mach 5.',
    'An aircraft\'s speed limit high up is an airspeed — At altitude the limit is usually a Mach number, because the speed of sound falls with temperature while compressibility effects depend on M.'
  ],
  formulas: [
    {
      name: 'Mach number from speed and air temperature',
      expr: 'M = V/sqrt(gamma*R*T)',
      tex: 'M = \\frac{V}{a} = \\frac{V}{\\sqrt{\\gamma\\, R_\\text{air}\\, T}}',
      vars: {
        M: { name: 'Mach number' },
        V: { name: 'true airspeed', q: 'speed', unit: 'km/h', value: 900 },
        gamma: { name: 'ratio of specific heats γ (1.4 for air)', value: 1.4, fixed: true, tex: '\\gamma' },
        R: { const: 'Rair' },
        T: { name: 'static air temperature', q: 'temperature', unit: '°C', value: -56.5, min: -80, max: 50 }
      },
      note: 'The speed of sound in air depends only on its temperature: 340 m/s at 15 °C, 295 m/s at −56.5 °C. Use the true airspeed.',
      practice: { unknowns: ['M', 'V'] },
      stories: {
        M: 'An aircraft flies at a true airspeed of {V} in air at {T}. What is its Mach number?',
        V: 'What true airspeed is Mach {M} in air at {T}?',
        T: 'At {V} an aircraft flies at Mach {M}. How cold is the air?'
      }
    },
    {
      name: 'Kinetic energy compared with heat content',
      expr: 'Er = (gamma - 1)/2*M^2',
      tex: 'E_r = \\frac{V^2/2}{c_p T} = \\frac{\\gamma - 1}{2}M^2',
      vars: {
        Er: { name: 'kinetic energy per kilogram ÷ enthalpy per kilogram', tex: 'E_r' },
        gamma: { name: 'ratio of specific heats γ (1.4 for air)', value: 1.4, fixed: true, tex: '\\gamma' },
        M: { name: 'Mach number', value: 5, min: 0, max: 30 }
      },
      note: 'Equal to T₀/T − 1, the fraction by which the air heats when brought to rest: 0.02 at Mach 0.3, 0.8 at Mach 2, 5 at Mach 5, 125 at Mach 25 (where real-gas effects take over).',
      stories: {
        Er: 'At Mach {M}, how does the kinetic energy of each kilogram of air compare with its heat content?',
        M: 'At what Mach number is the kinetic energy of the air {Er} times its heat content?'
      }
    }
  ],
  examples: [
    {
      title: 'One speed, two Mach numbers',
      q: 'An aircraft flies at a true airspeed of 900 km/h. What is its Mach number at sea level (15 °C) and at 11 000 m (−56.5 °C)?',
      steps: [
        '900 km/h = 250 m/s.',
        'Sea level: $a = \\sqrt{1.4 \\times 287 \\times 288.15} = 340.3$ m/s, so $M = 0.735$.',
        '11 000 m: $a = \\sqrt{1.4 \\times 287 \\times 216.65} = 295.1$ m/s, so $M = 0.847$.'
      ],
      a: 'Mach 0.73 at sea level but Mach 0.85 high up — the same speed is much closer to the transonic regime in cold air.'
    },
    {
      title: 'Where the energy goes at re-entry',
      q: 'A capsule re-enters at Mach 25 through air at about 250 K. Compare the kinetic energy of the oncoming air with its heat content, and estimate the ideal-gas stagnation temperature.',
      steps: [
        '$E_r = 0.2 \\times 25^2 = 125$: each kilogram carries 125 times as much kinetic energy as heat.',
        'Ideal gas: $T_0 = 250 \\times 126 = 31\\,500$ K.',
        'Real air dissociates and ionises long before that, absorbing energy, so the shock layer stays at several thousand kelvin — still far beyond what any metal survives, hence heat shields.'
      ],
      a: 'Kinetic energy 125 times the heat content; an absurd 31 500 K by the ideal-gas formula, several thousand kelvin in reality.'
    }
  ],
  quiz: [
    { q: 'An airliner flies at the same true airspeed at 11 km as at 3 km. At 11 km its Mach number is…', choices: ['higher, because the air is colder and the speed of sound lower', 'lower, because the air is thinner', 'the same', 'higher, because the air is thinner'], a: 0,
      why: 'a = √(γRT) depends on temperature only; at 11 km it is 295 m/s against 329 m/s at 3 km. Density does not enter.' },
    { q: 'In which regime do supersonic pockets ending in shocks first appear on a wing?', choices: ['transonic', 'low subsonic', 'hypersonic', 'only above Mach 1.2'], a: 0,
      why: 'Above the critical Mach number (typically 0.7–0.8) the air accelerating over the wing exceeds Mach 1 locally and returns to subsonic speed through a shock.' },
    { q: 'An aircraft flying at Mach 0.85 has no supersonic flow anywhere around it.', a: false,
      why: 'The air over the upper surface of its wing is faster than the aircraft; at Mach 0.85 a supercritical wing carries a supersonic region ending in a weak shock.' },
    { q: 'What is the Mach number of 600 m/s in air at −56.5 °C, where the speed of sound is 295 m/s?', answer: 2.03, tol: 0.02,
      why: '600/295 = 2.03 — Concorde\'s cruise.' },
    { q: 'What mainly sets hypersonic flight apart from supersonic flight?', choices: ['Heating and high-temperature gas effects dominate', 'Shock waves first appear', 'The air becomes incompressible again', 'Wings can no longer make lift'], a: 0,
      why: 'Beyond about Mach 5 the kinetic energy of the flow is several times its heat content, so stagnation temperatures reach thousands of kelvin and chemistry and heat transfer drive the design.' }
  ],
  problems: [
    { q: 'A rifle bullet leaves the muzzle at 850 m/s on a day when the speed of sound is 343 m/s. What is its Mach number?', answer: 2.48, tol: 0.02,
      steps: ['$M = 850/343 = 2.48$ — supersonic, which is why a bullet passing nearby cracks.'] },
    { q: 'What true airspeed is Mach 0.78 in air at −40 °C?', answer: 239, unit: 'm/s', tol: 0.02,
      steps: ['$a = \\sqrt{1.4 \\times 287.06 \\times 233.15} = 306.1$ m/s.', '$V = 0.78 \\times 306.1 = 239$ m/s (464 kt).'] }
  ],
  applications: [
    'Choosing the tools: incompressible panel methods, compressibility corrections, transonic CFD, supersonic linear theory or hypersonic methods.',
    'Setting airliners\' cruise Mach numbers just below the steep drag rise.',
    'Designing propeller, fan and rotor tips, which meet transonic flow long before the aircraft does.',
    'Thermal protection for re-entry vehicles and hypersonic missiles.'
  ],
  history: 'Ernst Mach photographed the shock waves around supersonic bullets in 1887, and the Swiss aerodynamicist Jakob Ackeret proposed naming the speed ratio after him in 1929. The "sound barrier" of the 1940s — violent buffeting and loss of control near Mach 1 — fell on 14 October 1947, when Chuck Yeager flew the rocket-powered Bell X-1 to Mach 1.06.',
  sim: { id: 'comp-mach-cone', params: { M: 0.9 } }
});

Hyper.add({
  id: 'nozzles', parent: 'compressible-basics', title: 'Nozzles and choked flow', level: 2,
  short: 'A converging nozzle speeds a gas up until its throat reaches the speed of sound. From then on the flow is choked: lowering the downstream pressure no longer increases the mass flow, which depends only on the upstream stagnation pressure and temperature and the throat area.',
  keywords: ['nozzle', 'choked flow', 'choking', 'critical pressure ratio', '0.528', 'sonic throat', 'mass flow', 'critical-flow venturi', 'sonic nozzle', 'orifice', 'leak', 'underexpanded jet'],
  prereq: ['isentropic-flow', 'stagnation-properties', 'continuity'],
  related: ['de-laval-nozzle', 'normal-shock', 'rocket-propulsion', 'thrust', 'turbojet', 'physics:ideal-gas-law'],
  body: `
Crack open the valve on a compressed-air line and the hiss grows as more air pushes through. Keep increasing the pressure difference — more pressure upstream or less downstream — and something odd happens: past a certain point the flow stops responding to the downstream pressure at all. The nozzle is **choked**.

### Why a nozzle chokes
In a converging duct a subsonic flow speeds up ([[isentropic-flow]]) and is fastest at the narrowest section, the throat. Lowering the back pressure raises the throat speed — until it reaches the speed of sound. The throat then carries the most mass per unit area the gas can carry: the mass flux $\\rho V$ peaks exactly at Mach 1, because beyond it the density falls faster than the speed rises. A further drop in back pressure is a signal that must travel upstream at the speed of sound, and at a sonic throat it cannot make headway against a flow moving just as fast. The upstream flow never hears about it.

The throat reaches Mach 1 when its pressure falls to the **critical pressure**
$$\\frac{p^*}{p_0} = \\left(\\frac{2}{\\gamma + 1}\\right)^{\\gamma/(\\gamma - 1)} = 0.528\\ \\text{for air}$$
so an ideal nozzle is choked whenever the downstream pressure is below 0.528 of the upstream stagnation pressure (both absolute) — whenever the upstream side has about twice the pressure. A car tyre at 2.2 bar gauge (3.2 bar absolute) leaks through its valve with a choked flow. The throat is also cold, $T^* = 0.833\\,T_0$: air from a line at 20 °C crosses a sonic throat at −29 °C.

### The choked mass flow
With the throat at Mach 1 the mass flow is fixed by the upstream stagnation state and the throat area $A^*$ alone:
$$\\dot m = p_0 A^* \\sqrt{\\frac{\\gamma}{R\\,T_0}}\\left(\\frac{2}{\\gamma+1}\\right)^{\\frac{\\gamma+1}{2(\\gamma-1)}} \\approx 0.0404\\,\\frac{p_0 A^*}{\\sqrt{T_0}}\\quad (\\text{air, SI units})$$
It is proportional to the absolute upstream pressure, independent of the downstream pressure, and falls as the square root of the upstream temperature. A real orifice passes somewhat less — a discharge coefficient of roughly 0.8 for a sharp-edged hole, 0.97 or more for a smooth nozzle.

| Back pressure $p_b/p_0$ | What happens in a converging nozzle |
|---|---|
| 1 | no flow |
| 1 to 0.528 | subsonic everywhere; the flow grows as $p_b$ falls; the jet leaves at $p_b$ |
| 0.528 | the throat just reaches Mach 1: choked |
| below 0.528 | mass flow fixed; the jet leaves at Mach 1 above ambient pressure and expands outside in a chain of shock cells |

### Where choking matters
- **Leaks and valves.** Compressed air escaping through a hole or a valve is almost always choked, so the flow is set by the supply pressure — the basis of leak-cost estimates and of the sonic conductance used to rate pneumatic valves (real valves choke below a critical ratio *b* of about 0.2–0.5 rather than 0.528, because of their internal losses).
- **Measuring flow.** A **critical-flow venturi**, or sonic nozzle, passes a mass flow fixed by $p_0$, $T_0$ and its throat whatever happens downstream; it is a reference standard for calibrating gas meters.
- **Safety valves and bursting discs** on pressure vessels are sized for choked flow.
- **Engines.** A jet engine's turbine guide vanes and propelling nozzle usually run choked; a rocket's throat always does.

To go faster than sound, the gas must pass a sonic throat and then find a *widening* passage — the [[de-laval-nozzle|converging–diverging nozzle]].

> [!warn] Choked gas jets are loud and fast, and a sudden release can throw debris; a vessel or line under pressure stores energy. Release the pressure and isolate the supply before working on a system, and never point a compressed-air jet at a person.
`,
  ideas: [
    'A converging nozzle chokes when its throat reaches Mach 1, at a back pressure below p* = 0.528 p₀ for air (absolute pressures).',
    'Once choked, the mass flow ṁ = 0.0404 p₀A*/√T₀ (air, SI) no longer depends on the downstream pressure.',
    'The choked flow doubles when the absolute upstream pressure doubles and falls as the upstream temperature rises.',
    'Choking happens because a sonic throat stops pressure signals travelling upstream, and because the mass flux ρV is largest at Mach 1.',
    'A choked converging nozzle leaves an underexpanded jet at Mach 1; to go supersonic the passage must widen after the throat.'
  ],
  pitfalls: [
    'Lowering the downstream pressure always increases the flow — Only until the throat is sonic. After that the flow depends only on the upstream stagnation conditions and the throat area.',
    'A converging nozzle can make a supersonic jet if the pressure ratio is high enough — The exit of a converging nozzle can reach Mach 1 at most. The excess pressure is released outside the nozzle in shock cells; supersonic flow needs a diverging section.',
    'Choked flow is proportional to the pressure difference — It is proportional to the absolute upstream pressure. Going from 7 to 14 bar absolute doubles it, whatever the pressure downstream.'
  ],
  formulas: [
    {
      name: 'Critical (sonic) pressure',
      expr: 'pstar = p0*(2/(gamma + 1))^(gamma/(gamma - 1))',
      tex: 'p^* = p_0\\left(\\frac{2}{\\gamma + 1}\\right)^{\\gamma/(\\gamma - 1)}',
      vars: {
        pstar: { name: 'pressure at a sonic throat (absolute)', q: 'pressure', unit: 'bar', tex: 'p^*' },
        p0: { name: 'upstream stagnation pressure (absolute)', q: 'pressure', unit: 'bar', value: 7, tex: 'p_0' },
        gamma: { name: 'ratio of specific heats γ (1.4 for air)', value: 1.4, fixed: true, tex: '\\gamma' }
      },
      note: 'p*/p₀ = 0.528 for air (0.487 for helium). An ideal converging nozzle is choked whenever the back pressure is below p*.',
      stories: {
        pstar: 'Air at {p0} (absolute) feeds a nozzle. Below what back pressure is the nozzle choked?',
        p0: 'For a nozzle discharging into {pstar} to be just choked, what upstream stagnation pressure is needed?'
      }
    },
    {
      name: 'Critical (sonic) temperature',
      expr: 'Tstar = T0*2/(gamma + 1)',
      tex: 'T^* = \\frac{2\\,T_0}{\\gamma + 1}',
      vars: {
        Tstar: { name: 'temperature at a sonic throat', q: 'temperature', unit: '°C', tex: 'T^*' },
        T0: { name: 'upstream stagnation temperature', q: 'temperature', unit: '°C', value: 20, min: -40, max: 600, tex: 'T_0' },
        gamma: { name: 'ratio of specific heats γ (1.4 for air)', value: 1.4, fixed: true, tex: '\\gamma' }
      },
      note: 'T*/T₀ = 0.833 for air. The speed of sound at the throat is a* = √(γRT*).',
      practice: { unknowns: ['Tstar'] },
      stories: { Tstar: 'Air from a line at {T0} flows through a choked nozzle. How cold is it at the throat?' }
    },
    {
      name: 'Choked mass flow',
      expr: 'mdot = p0*At*sqrt(gamma/(R*T0))*(2/(gamma + 1))^((gamma + 1)/(2*(gamma - 1)))',
      tex: '\\dot m = p_0 A^* \\sqrt{\\frac{\\gamma}{R_\\text{air} T_0}}\\left(\\frac{2}{\\gamma + 1}\\right)^{\\frac{\\gamma + 1}{2(\\gamma - 1)}}',
      vars: {
        mdot: { name: 'mass flow', q: 'massflow', unit: 'g/s', tex: '\\dot m' },
        p0: { name: 'upstream stagnation pressure (absolute)', q: 'pressure', unit: 'bar', value: 7, tex: 'p_0' },
        At: { name: 'throat area', q: 'area', unit: 'mm²', value: 1, tex: 'A^*' },
        gamma: { name: 'ratio of specific heats γ (1.4 for air)', value: 1.4, fixed: true, tex: '\\gamma' },
        R: { const: 'Rair' },
        T0: { name: 'upstream stagnation temperature', q: 'temperature', unit: '°C', value: 20, tex: 'T_0' }
      },
      note: 'Ideal nozzle; multiply by a discharge coefficient (about 0.8 for a sharp-edged hole). Valid only while the back pressure is below p* = 0.528 p₀. For air in SI units: ṁ ≈ 0.0404 p₀A*/√T₀.',
      practice: { unknowns: ['mdot', 'At', 'p0'] },
      stories: {
        mdot: 'Compressed air at {p0} (absolute) and {T0} escapes through a hole of {At}. What mass flow is lost (ideal flow)?',
        At: 'A sonic nozzle must pass {mdot} of air from a supply at {p0} and {T0}. What throat area does it need?',
        p0: 'A choked orifice of {At} passes {mdot} of air at {T0}. What is the upstream absolute pressure?'
      }
    }
  ],
  examples: [
    {
      title: 'The cost of a small leak',
      q: 'A compressed-air line at 6 bar gauge (7 bar absolute) and 20 °C has a leak with an area of 1 mm² (a hole 1.1 mm across). How much air escapes?',
      steps: [
        'Is it choked? $p_b/p_0 = 1.013/7 = 0.14$, well below 0.528: yes.',
        '$\\dot m = 0.0404 \\times 7\\times10^5 \\times 1\\times10^{-6}/\\sqrt{293.15} = 1.65\\times10^{-3}$ kg/s.',
        'As free air (1.185 kg/m³ at the ISO 8778 reference): 1.39 L/s, about 84 L/min.',
        'Over 8000 hours a year that is some 40 000 m³ of compressed air from one tiny hole; a sharp-edged hole passes about 80 % of the ideal figure.'
      ],
      a: 'About 1.65 g/s, or 84 litres of free air a minute.'
    },
    {
      title: 'What changes the choked flow',
      q: 'The same hole is fed at 14 bar absolute instead of 7. What happens to the leak? And what if the air leaked into a vacuum instead of the atmosphere?',
      steps: [
        'Choked flow is proportional to $p_0$: doubling it doubles the flow, to 3.3 g/s.',
        'The downstream pressure does not appear in the formula: once the throat is sonic, a vacuum downstream passes the same 1.65 g/s as the atmosphere does.'
      ],
      a: 'Twice the flow at twice the absolute pressure; no change from a lower back pressure.'
    },
    {
      title: 'Cold at the throat',
      q: 'Air at 7 bar absolute and 20 °C flows through a choked nozzle. What are the pressure and temperature at the throat?',
      steps: [
        '$p^* = 0.528 \\times 7 = 3.70$ bar.',
        '$T^* = 0.833 \\times 293.15 = 244.3$ K, which is −29 °C.',
        'The air warms up again as it mixes and slows down outside; the cold throat is one reason moist air can ice up a valve.'
      ],
      a: 'About 3.7 bar and −29 °C at the throat.'
    }
  ],
  quiz: [
    { q: 'A tank at 5 bar absolute discharges through a small converging nozzle into the atmosphere (1 bar). Is the flow choked?', choices: ['Yes: 1/5 = 0.2 is below 0.528', 'No: the tank pressure is too low', 'Only if the nozzle diverges after the throat', 'Only if the air is cold'], a: 0,
      why: 'Choking needs p_b/p₀ < 0.528, here 0.2. The flow stays choked until the tank falls below about 1.9 bar absolute.' },
    { q: 'Once a converging nozzle is choked, lowering the downstream pressure further increases its mass flow.', a: false,
      why: 'The throat is already sonic; pressure signals cannot travel upstream through it, and the mass flux there is already the maximum. Only p₀, T₀ and the throat area set the flow.' },
    { q: 'At a sonic throat fed with air at 7 bar absolute, what is the throat pressure (in bar)?', answer: 3.70, unit: 'bar', tol: 0.02,
      why: 'p* = 0.528 × 7 = 3.70 bar absolute.' },
    { q: 'The choked flow through a hole doubles when you double…', choices: ['the absolute upstream pressure', 'the pressure difference across the hole', 'the downstream pressure', 'the upstream absolute temperature'], a: 0,
      why: 'ṁ ∝ p₀/√T₀. Doubling the upstream temperature would reduce the flow by √2; the downstream pressure does not matter.' },
    { q: 'Why can a lower back pressure not increase the flow through a choked throat?', choices: ['Pressure signals travel at the speed of sound and cannot pass upstream through a sonic throat', 'The nozzle walls stop them', 'The air freezes at the throat', 'Friction grows to cancel the extra push'], a: 0,
      why: 'Information about the downstream pressure travels at the local speed of sound relative to the gas; at the throat the gas moves downstream just as fast.' }
  ],
  problems: [
    { q: 'A sonic nozzle with a throat of 20 mm² is fed with air at 3 bar absolute and 20 °C. What mass flow does it pass, in g/s?', answer: 14.2, unit: 'g/s', tol: 0.02,
      steps: ['$\\dot m = 0.0404 \\times 3\\times10^5 \\times 20\\times10^{-6}/\\sqrt{293.15}$.', '$= 0.2424/17.12 = 0.0142$ kg/s = 14.2 g/s.'] },
    { q: 'What is the lowest absolute upstream pressure at which a nozzle discharging into 1.013 bar is choked?', answer: 1.92, unit: 'bar', tol: 0.02,
      steps: ['Choked when $p_b/p_0 \\le 0.528$.', '$p_0 \\ge 1.013/0.528 = 1.92$ bar absolute, about 0.9 bar gauge.'] }
  ],
  applications: [
    'Critical-flow venturis used as reference standards for gas flow.',
    'Sizing safety relief valves and estimating the discharge from a ruptured line.',
    'Compressed-air leak surveys and the flow rating of pneumatic valves.',
    'Jet-engine turbines and nozzles, and rocket throats, all of which run choked.'
  ],
  history: 'In 1839 Barré de Saint-Venant and Laurent Wantzel found that the flow of air out of a vessel stopped growing once the outside pressure fell below a fraction of the inside pressure. The explanation — a sonic throat — was worked out later in the century, notably by Osborne Reynolds, and the critical pressure ratio of about 0.53 became a working rule of steam-turbine designers.',
  sim: { id: 'comp-nozzle', params: { pb: 0.97, ar: 2 } }
});

Hyper.add({
  id: 'de-laval-nozzle', parent: 'compressible-basics', title: 'The de Laval nozzle', level: 2,
  short: 'A nozzle that narrows to a sonic throat and then widens lets a gas accelerate beyond the speed of sound. Rocket engines, supersonic wind tunnels and steam turbines use it. What happens inside — smooth supersonic flow, a shock, or a jet that over- or under-expands outside — depends on the pressure at its exit.',
  keywords: ['de Laval nozzle', 'converging–diverging nozzle', 'CD nozzle', 'area ratio', 'expansion ratio', 'A/A*', 'area–Mach relation', 'overexpanded', 'underexpanded', 'shock diamonds', 'Mach disk', 'rocket nozzle', 'exhaust velocity', 'thrust'],
  prereq: ['nozzles', 'isentropic-flow', 'stagnation-properties'],
  related: ['normal-shock', 'oblique-shock', 'expansion-fans', 'rocket-propulsion', 'wind-tunnel', 'ramjet-scramjet', 'physics:rocket-propulsion'],
  body: `
A converging nozzle can take a gas no faster than the speed of sound ([[nozzles]]). To go further the passage must **widen** after the throat, because a supersonic flow speeds up in a diverging duct ($dA/A = (M^2 - 1)\\,dV/V$, see [[isentropic-flow]]). The Swedish engineer Gustaf de Laval used such a nozzle in the 1880s to drive a steam turbine with jets faster than sound, and every rocket engine since has the same shape: a chamber, a converging section, a throat, and a bell that widens to the exit.

### The area–Mach relation
In isentropic flow, the area the stream needs at Mach $M$, compared with the sonic throat area $A^*$, is
$$\\frac{A}{A^*} = \\frac{1}{M}\\left[\\frac{2}{\\gamma + 1}\\left(1 + \\frac{\\gamma - 1}{2}M^2\\right)\\right]^{\\frac{\\gamma + 1}{2(\\gamma - 1)}}$$
Every area ratio above 1 has two solutions, one subsonic and one supersonic: $A/A^* = 1.688$ at Mach 0.372 and at Mach 2. The pressure downstream decides which the flow takes. A Mach 2 nozzle widens to 1.69 times its throat area and a Mach 3 nozzle to 4.23, and their exit pressures fall to 1/7.8 and 1/37 of the chamber pressure.

### What the back pressure does
Hold the chamber pressure $p_0$ and lower the back pressure $p_b$ step by step (the simulation does exactly this):
1. **Venturi.** The flow is subsonic throughout: it speeds up to the throat and slows again in the diverging part, recovering most of its pressure.
2. **Choked.** The throat just reaches Mach 1; the mass flow reaches its maximum and keeps it for every lower back pressure. The diverging part still slows the flow down.
3. **Shock in the nozzle.** Lower still, the flow goes supersonic after the throat, then drops back to subsonic through a [[normal-shock|normal shock]] that moves downstream as $p_b$ falls, costing stagnation pressure.
4. **Shock at the exit.** At one particular back pressure the shock sits exactly in the exit plane.
5. **Overexpanded.** Below that the nozzle runs supersonic all the way, but its exit pressure $p_e$ is below ambient. [[oblique-shock|Oblique shocks]] from the lips squeeze the jet back up to ambient pressure and reflect across it in a chain of bright **shock diamonds** — or, when strongly overexpanded, a flat **Mach disk** in the middle.
6. **Design.** When $p_b = p_e$ the jet leaves cleanly, parallel and at ambient pressure.
7. **Underexpanded.** Below the design pressure the jet leaves above ambient and expands outside through [[expansion-fans|expansion fans]], bulging as it goes.

For a nozzle with $A_e/A^* = 2$ the three critical back pressures are $p_b/p_0 = 0.937$ (choking), 0.513 (shock at the exit) and 0.094 (design).

### Rocket nozzles
Thrust is the momentum flow of the jet plus a pressure term,
$$F = \\dot m V_e + (p_e - p_a)A_e$$
and the exhaust velocity rises with chamber temperature, falls with the molar mass of the gas, and keeps rising, ever more slowly, as the expansion ratio $p_0/p_e$ grows. A first-stage engine must work at sea level, so its nozzle is modest — an area ratio around 16 — or its exit pressure would fall far below ambient and the flow would tear away from the wall. An engine for space can expand much further: 69 for the Space Shuttle main engine (which also had to start at sea level), 100–300 for upper-stage engines, which is why they carry enormous bells. In a vacuum there is no "overexpanded" — only diminishing returns.

> [!note] A real overexpanded nozzle does not keep a tidy shock inside. When the wall pressure falls to roughly a third of ambient, the boundary layer separates and the jet detaches from the wall (the Summerfield criterion), sometimes unsteadily enough to shake the nozzle. Firing a vacuum engine at sea level needs a special diffuser for this reason.

### Wind tunnels and turbines
A supersonic [[wind-tunnel|wind tunnel]] is a de Laval nozzle with the model in its exit: a Mach 2 tunnel needs an area ratio of 1.69 and a pressure ratio of 7.8 to start, less once a second throat downstream recovers the pressure. Steam and gas turbines use converging–diverging passages between their blades for the same reason de Laval did.
`,
  ideas: [
    'A supersonic flow needs a converging–diverging passage: subsonic acceleration to a sonic throat, then supersonic acceleration in the widening part.',
    'A/A* fixes the Mach number, with two roots for every ratio above 1 — subsonic and supersonic; the back pressure picks one.',
    'As the back pressure falls the nozzle goes from venturi to choked, to a shock inside, to overexpanded, design and underexpanded.',
    'Overexpanded jets are squeezed by oblique shocks (shock diamonds); underexpanded jets bulge through expansion fans.',
    'Thrust F = ṁV_e + (p_e − p_a)A_e; vacuum engines use large area ratios because there is no ambient pressure to overexpand against.'
  ],
  pitfalls: [
    'A bigger bell always gives more thrust — Only if the ambient pressure is low enough. At sea level an oversized bell overexpands the jet: the negative pressure term and flow separation cost thrust.',
    'Once the throat is sonic, the diverging part is supersonic — Not necessarily. Choking only needs Mach 1 at the throat; with a high back pressure the diverging part slows the flow again, or holds a normal shock.',
    'Shock diamonds mean the engine is badly designed — They show the jet is not at ambient pressure, which is normal for a fixed nozzle flying through a changing atmosphere; they come from the flow outside the nozzle, not from a fault inside.'
  ],
  formulas: [
    {
      name: 'Area–Mach relation',
      expr: 'A = Astar/M*(2/(gamma + 1)*(1 + (gamma - 1)/2*M^2))^((gamma + 1)/(2*(gamma - 1)))',
      tex: '\\frac{A}{A^*} = \\frac{1}{M}\\left[\\frac{2}{\\gamma + 1}\\left(1 + \\frac{\\gamma - 1}{2}M^2\\right)\\right]^{\\frac{\\gamma + 1}{2(\\gamma - 1)}}',
      vars: {
        A: { name: 'flow area at Mach M', q: 'area', unit: 'cm²' },
        Astar: { name: 'sonic throat area', q: 'area', unit: 'cm²', value: 10, tex: 'A^*' },
        M: { name: 'Mach number', value: 2, min: 0.05, max: 10 },
        gamma: { name: 'ratio of specific heats γ (1.4 for air)', value: 1.4, fixed: true, tex: '\\gamma' }
      },
      solveFor: 'A',
      note: 'Isentropic flow. Every A > A* has a subsonic and a supersonic Mach number, and solving for M gives both; the pressure downstream decides which occurs. At M = 1, A = A*.',
      stories: {
        A: 'A nozzle with a throat of {Astar} must deliver air at Mach {M}. What exit area does it need?',
        M: 'A nozzle has a throat of {Astar} and an exit of {A}. At what Mach numbers can the air leave it isentropically?',
        Astar: 'A supersonic wind tunnel has a test section of {A} running at Mach {M}. How large is its throat?'
      }
    },
    {
      name: 'Exhaust velocity of an ideal nozzle',
      expr: 'Ve = sqrt(2*gamma/(gamma - 1)*R*T0*(1 - (pe/p0)^((gamma - 1)/gamma)))',
      tex: 'V_e = \\sqrt{\\frac{2\\gamma}{\\gamma - 1}\\,R\\,T_0\\left[1 - \\left(\\frac{p_e}{p_0}\\right)^{(\\gamma - 1)/\\gamma}\\right]}',
      vars: {
        Ve: { name: 'exhaust velocity', q: 'speed', unit: 'm/s', tex: 'V_e' },
        gamma: { name: 'ratio of specific heats γ (about 1.2 for hot rocket exhaust)', value: 1.2, fixed: true, tex: '\\gamma' },
        R: { name: 'specific gas constant of the exhaust (8314 / molar mass in g/mol)', q: 'specificheat', unit: 'J/(kg·K)', value: 400 },
        T0: { name: 'chamber (stagnation) temperature', q: 'temperature', unit: 'K', value: 3500, tex: 'T_0' },
        pe: { name: 'exit pressure', q: 'pressure', unit: 'bar', value: 0.7, tex: 'p_e' },
        p0: { name: 'chamber (stagnation) pressure', q: 'pressure', unit: 'bar', value: 70, tex: 'p_0' }
      },
      note: 'Isentropic expansion of an ideal gas from rest. Light, hot exhaust (small molar mass, high T₀) gives the fastest jet; infinite expansion would give √(2γRT₀/(γ − 1)). For air at room temperature use γ = 1.4, R = 287.',
      practice: { unknowns: ['Ve', 'T0', 'pe'] },
      stories: {
        Ve: 'A rocket chamber at {p0} and {T0} expands exhaust gas (R = {R}) to {pe}. What is the exhaust velocity?',
        T0: 'What chamber temperature gives an exhaust velocity of {Ve} when gas with R = {R} expands from {p0} to {pe}?'
      }
    },
    {
      name: 'Thrust of a nozzle',
      expr: 'F = mdot*Ve + (pe - pa)*Ae',
      tex: 'F = \\dot m V_e + (p_e - p_a)\\,A_e',
      vars: {
        F: { name: 'thrust', q: 'force', unit: 'kN' },
        mdot: { name: 'mass flow of propellant', q: 'massflow', unit: 'kg/s', value: 300, tex: '\\dot m' },
        Ve: { name: 'exhaust velocity', q: 'speed', unit: 'm/s', value: 2900, tex: 'V_e' },
        pe: { name: 'exit pressure (absolute)', q: 'pressure', unit: 'bar', value: 0.7, tex: 'p_e' },
        pa: { name: 'ambient pressure (absolute)', q: 'pressure', unit: 'bar', value: 1.01325, tex: 'p_a' },
        Ae: { name: 'nozzle exit area', q: 'area', unit: 'm²', value: 0.9, tex: 'A_e' }
      },
      note: 'Momentum thrust plus pressure thrust. The pressure term is negative when the nozzle is overexpanded (p_e < p_a) and largest in a vacuum (p_a = 0).',
      practice: { unknowns: ['F', 'mdot', 'pa'] },
      stories: {
        F: 'An engine burns {mdot} of propellant, with an exhaust velocity of {Ve}, an exit pressure of {pe} and an exit area of {Ae}. What thrust does it give where the ambient pressure is {pa}?',
        mdot: 'An engine must give {F} with an exhaust velocity of {Ve}, exit pressure {pe}, exit area {Ae} and ambient pressure {pa}. What propellant flow does it need?'
      }
    }
  ],
  examples: [
    {
      title: 'Sizing a Mach 2 wind tunnel',
      q: 'A supersonic wind tunnel must run at Mach 2 in a test section of 0.20 m². How big is its throat, and what reservoir pressure does it need for a test-section pressure of 20 kPa?',
      steps: [
        'At Mach 2, $A/A^* = 1.6875$, so $A^* = 0.20/1.6875 = 0.119$ m².',
        'Isentropic: $p_0/p = 7.824$, so $p_0 = 7.824 \\times 20 = 156$ kPa.',
        'Downstream, a diffuser with a second throat slows the flow and recovers part of the pressure, so the tunnel can exhaust to a vacuum tank or the atmosphere with less than the full ratio.'
      ],
      a: 'A throat of about 0.12 m² and a reservoir of about 156 kPa (absolute).'
    },
    {
      title: 'A rocket\'s exhaust velocity',
      q: 'Exhaust gas with γ = 1.2 and R = 400 J/(kg·K) leaves a chamber at 70 bar and 3500 K and expands to 0.7 bar. Find the exhaust velocity, and the limit for infinite expansion.',
      steps: [
        'Pressure ratio: $p_e/p_0 = 0.01$, and $0.01^{0.2/1.2} = 0.464$.',
        '$\\frac{2\\gamma}{\\gamma - 1} R T_0 = 12 \\times 400 \\times 3500 = 1.68\\times10^7$ m²/s².',
        '$V_e = \\sqrt{1.68\\times10^7 \\times (1 - 0.464)} = \\sqrt{9.00\\times10^6} = 3000$ m/s.',
        'Infinite expansion: $\\sqrt{1.68\\times10^7} = 4100$ m/s. Expanding ten times further, to 0.07 bar, gives only 3390 m/s.'
      ],
      a: 'About 3000 m/s; the ceiling is about 4100 m/s.'
    },
    {
      title: 'Thrust at sea level and in space',
      q: 'An engine burns 300 kg/s with an exhaust velocity of 2900 m/s; its nozzle exit has 0.9 m² and an exit pressure of 0.7 bar. Find the thrust at sea level (1.013 bar) and in a vacuum.',
      steps: [
        'Momentum thrust: $300 \\times 2900 = 870$ kN.',
        'Sea level: $(0.70 - 1.013)\\times10^5 \\times 0.9 = -28$ kN, so $F = 842$ kN — the nozzle is overexpanded.',
        'Vacuum: $+0.70\\times10^5 \\times 0.9 = +63$ kN, so $F = 933$ kN.'
      ],
      a: 'About 842 kN at sea level and 933 kN in a vacuum — 11 % more.'
    }
  ],
  quiz: [
    { q: 'In the diverging part of a de Laval nozzle running at its design condition, the flow…', choices: ['speeds up and its pressure falls', 'slows down and its pressure rises', 'stays at Mach 1', 'speeds up and its pressure rises'], a: 0,
      why: 'Past a sonic throat the flow is supersonic, and a supersonic flow accelerates in a widening duct; its pressure falls isentropically with the rising Mach number.' },
    { q: 'A nozzle\'s exit pressure is below the ambient pressure. It is…', choices: ['overexpanded', 'underexpanded', 'at its design condition', 'unchoked'], a: 0,
      why: 'It has expanded the gas beyond ambient; oblique shocks outside compress the jet back up.' },
    { q: 'For a given area ratio above 1, the isentropic area–Mach relation gives exactly one Mach number.', a: false,
      why: 'It gives two: a subsonic and a supersonic one (A/A* = 1.688 at Mach 0.372 and Mach 2).' },
    { q: 'What exit-to-throat area ratio does an isentropic nozzle need to deliver air at Mach 3?', answer: 4.235, tol: 0.02,
      why: 'A/A* = (1/3)[(2/2.4)(1 + 0.2 × 9)]³ = (1/3)(2.333)³ = 4.235.' },
    { q: 'Why do rocket engines built for space have much larger bells than those that fire at sea level?', choices: ['In a vacuum there is no ambient pressure to overexpand against, so expanding further always adds thrust', 'Space engines burn hotter', 'The throat must be larger in space', 'Bigger bells are lighter'], a: 0,
      why: 'Thrust keeps rising as the gas expands further, and with p_a = 0 the pressure term never turns negative. At sea level such a bell would overexpand the jet and let it separate.' }
  ],
  problems: [
    { q: 'A converging–diverging nozzle has a throat of 5 cm² and an exit of 12 cm². What supersonic Mach number does it deliver (air, isentropic)?', answer: 2.40, tol: 0.02,
      hint: 'A/A* = 2.4; find the supersonic root of the area–Mach relation (the calculator above gives both roots).',
      steps: ['$A/A^* = 12/5 = 2.4$.', 'The supersonic root of the area–Mach relation is $M = 2.40$ (the subsonic one is 0.250).'] },
    { q: 'In a vacuum, what thrust does an engine give with ṁ = 50 kg/s, V_e = 3400 m/s, p_e = 0.1 bar and A_e = 2 m²?', answer: 190, unit: 'kN', tol: 0.02,
      steps: ['Momentum thrust $50 \\times 3400 = 170$ kN.', 'Pressure thrust $0.1\\times10^5 \\times 2 = 20$ kN.', 'Total 190 kN.'] }
  ],
  applications: [
    'Rocket engines, from model-rocket motors to launch vehicles.',
    'Supersonic and hypersonic wind tunnels.',
    'Steam and gas turbines, with converging–diverging blade passages.',
    'Afterburning jet engines with variable nozzles, and supersonic spray and cold-spray coating guns.'
  ],
  history: 'Gustaf de Laval patented his high-speed steam turbine with a converging–diverging nozzle in the late 1880s. Around 1903 Aurel Stodola in Zürich measured the pressure along such nozzles and found the shocks that stand in them when the back pressure is too high. Robert Goddard fitted de Laval nozzles to his rocket motors in 1915 and saw their efficiency jump — a step towards practical rocketry.',
  sim: { id: 'comp-nozzle', params: { pb: 0.6, ar: 2 } }
});

/* ================================================================ SHOCKS AND EXPANSIONS */
Hyper.add({
  id: 'normal-shock', parent: 'shocks', title: 'Normal shock waves', level: 2,
  short: 'A shock wave standing square to the flow. Within a fraction of a micrometre a supersonic stream drops to subsonic speed while its pressure, density and temperature jump. Mass, momentum and energy are conserved across it, but entropy rises, so stagnation pressure is lost.',
  keywords: ['normal shock', 'shock wave', 'Rankine–Hugoniot', 'shock relations', 'pressure jump', 'entropy rise', 'stagnation pressure loss', 'Rayleigh pitot formula', 'supersonic pitot tube', 'blast wave', 'shock tube'],
  prereq: ['stagnation-properties', 'momentum-equation', 'isentropic-flow'],
  related: ['oblique-shock', 'de-laval-nozzle', 'pitot-tube', 'wave-drag', 'sonic-boom', 'physics:shock-waves', 'physics:entropy'],
  body: `
When a supersonic flow has to slow down or stop — in front of a blunt nose, in an engine intake, in a nozzle whose back pressure is too high — it cannot do so gradually, because the pressure signals that would warn the oncoming air travel only at the speed of sound. The air piles up instead into a **shock wave**: a sheet a few molecular mean free paths thick (about 0.2 µm at sea level) across which the flow changes almost discontinuously. A shock at right angles to the flow is a **normal shock**.

### Three conservation laws
Draw a thin box around the shock. What goes in must come out:
$$\\rho_1 V_1 = \\rho_2 V_2, \\qquad p_1 + \\rho_1 V_1^2 = p_2 + \\rho_2 V_2^2, \\qquad c_p T_1 + \\tfrac12 V_1^2 = c_p T_2 + \\tfrac12 V_2^2$$
— mass, [[momentum-equation|momentum]] and energy. Solved for an ideal gas, they fix everything behind the shock from the upstream Mach number $M_1$ alone; these are the **Rankine–Hugoniot** or normal-shock relations:
$$M_2^2 = \\frac{1 + \\frac{\\gamma - 1}{2}M_1^2}{\\gamma M_1^2 - \\frac{\\gamma - 1}{2}}, \\qquad \\frac{p_2}{p_1} = 1 + \\frac{2\\gamma}{\\gamma + 1}\\left(M_1^2 - 1\\right)$$

| $M_1$ | $M_2$ | $p_2/p_1$ | $\\rho_2/\\rho_1$ | $T_2/T_1$ | $p_{02}/p_{01}$ |
|---|---|---|---|---|---|
| 1.2 | 0.842 | 1.51 | 1.34 | 1.13 | 0.993 |
| 1.5 | 0.701 | 2.46 | 1.86 | 1.32 | 0.930 |
| 2 | 0.577 | 4.50 | 2.67 | 1.69 | 0.721 |
| 3 | 0.475 | 10.3 | 3.86 | 2.68 | 0.328 |
| 5 | 0.415 | 29.0 | 5.00 | 5.80 | 0.062 |

What stands out:
- The flow behind a normal shock is always **subsonic**, and never slower than $M_2 = 0.378$ however strong the shock.
- The pressure jump grows without limit, as $M_1^2$, but the **density can rise at most sixfold** in air — the limit $(\\gamma + 1)/(\\gamma - 1)$. The rest of the squeeze goes into heat.
- The stagnation **temperature is unchanged** (no heat is added), but the stagnation **pressure falls**: by 7 % at Mach 1.5, 28 % at Mach 2, 67 % at Mach 3. Lost stagnation pressure is lost energy, and it is where [[wave-drag|wave drag]] goes.

### Only compressions
The same three equations also allow an "expansion shock" from subsonic to supersonic, but crossing it would lower the entropy, which the [[physics:second-law-thermodynamics|second law]] forbids. Shocks only compress; supersonic flows expand smoothly, through [[expansion-fans|expansion fans]]. The entropy rise is $\\Delta s = -R\\ln(p_{02}/p_{01})$: 94 J/(kg·K) for a Mach 2 shock.

### The supersonic pitot tube
In supersonic flow a detached shock stands in front of a pitot tube's mouth, normal to the flow near the axis. The tube therefore measures the stagnation pressure *behind* a normal shock, and Lord Rayleigh's formula connects its reading to the free-stream Mach number:
$$\\frac{p_{02}}{p_1} = \\left[\\frac{(\\gamma + 1)^2 M_1^2}{4\\gamma M_1^2 - 2(\\gamma - 1)}\\right]^{\\frac{\\gamma}{\\gamma - 1}}\\frac{1 - \\gamma + 2\\gamma M_1^2}{\\gamma + 1}$$
At Mach 2 the ratio is 5.64, not the isentropic 7.82; mistakenly using the subsonic formula would report Mach 1.79 instead of 2.

### Moving shocks
Seen from still air, a shock is a pressure front running into it faster than sound: a blast wave, the crack of a whip, the front of a [[sonic-boom|sonic boom]], the wave in a shock tube. In the shock's own frame the relations are the same. A blast front running at Mach 1.5 into air at 15 °C carries an overpressure of 148 kPa and sweeps the air behind it along at 236 m/s — the wind that does much of the damage.
`,
  ideas: [
    'A normal shock is a jump, a fraction of a micrometre thick, from supersonic to subsonic flow; mass, momentum and energy are conserved across it.',
    'The upstream Mach number alone fixes the jumps: p₂/p₁ = 1 + 2γ(M₁² − 1)/(γ + 1), and M₂ is always below 1.',
    'Density can rise at most sixfold across a shock in air; the rest of the compression becomes heat.',
    'Stagnation temperature is unchanged, but stagnation pressure is lost — 28 % at Mach 2 — because entropy rises.',
    'A supersonic pitot tube reads the stagnation pressure behind its own shock; Rayleigh\'s formula turns that into the Mach number.'
  ],
  pitfalls: [
    'A shock is a very loud sound wave — Weak shocks become sound far away, but a shock is a finite, irreversible jump that moves faster than sound, raises the entropy and changes the flow permanently.',
    'Supersonic flow can speed up through a shock — The mathematics allows an expansion shock but the second law forbids it: shocks only compress and slow the flow; supersonic flows speed up through expansion fans.',
    'The stronger the shock, the denser the gas behind it, without limit — Pressure and temperature keep rising with Mach number, but the density ratio levels off at (γ + 1)/(γ − 1) = 6 for air.'
  ],
  formulas: [
    {
      name: 'Mach number behind a normal shock',
      expr: 'M2 = sqrt((1 + (gamma - 1)/2*M1^2)/(gamma*M1^2 - (gamma - 1)/2))',
      tex: 'M_2 = \\sqrt{\\dfrac{1 + \\frac{\\gamma - 1}{2}M_1^2}{\\gamma M_1^2 - \\frac{\\gamma - 1}{2}}}',
      vars: {
        M2: { name: 'Mach number behind the shock', tex: 'M_2' },
        M1: { name: 'Mach number ahead of the shock', value: 2, min: 1, max: 10, tex: 'M_1' },
        gamma: { name: 'ratio of specific heats γ (1.4 for air)', value: 1.4, fixed: true, tex: '\\gamma' }
      },
      note: 'Always below 1 for M₁ > 1, falling towards √((γ − 1)/(2γ)) = 0.378 for very strong shocks in air.',
      stories: {
        M2: 'A normal shock stands in a stream at Mach {M1}. What is the Mach number behind it?',
        M1: 'Behind a normal shock the flow is at Mach {M2}. What was the Mach number ahead of it?'
      }
    },
    {
      name: 'Pressure jump across a normal shock',
      expr: 'p2 = p1*(1 + 2*gamma/(gamma + 1)*(M1^2 - 1))',
      tex: '\\frac{p_2}{p_1} = 1 + \\frac{2\\gamma}{\\gamma + 1}\\left(M_1^2 - 1\\right)',
      vars: {
        p2: { name: 'static pressure behind the shock', q: 'pressure', unit: 'kPa', tex: 'p_2' },
        p1: { name: 'static pressure ahead of the shock', q: 'pressure', unit: 'kPa', value: 101.325, tex: 'p_1' },
        M1: { name: 'Mach number ahead of the shock', value: 2, min: 1, max: 10, tex: 'M_1' },
        gamma: { name: 'ratio of specific heats γ (1.4 for air)', value: 1.4, fixed: true, tex: '\\gamma' }
      },
      note: 'For a moving shock (blast wave) M₁ is the shock speed divided by the speed of sound in the still air ahead of it.',
      stories: {
        p2: 'Air at {p1} meets a normal shock at Mach {M1}. What is the pressure behind the shock?',
        M1: 'A blast front raises the pressure of still air from {p1} to {p2}. At what Mach number is the front running?'
      }
    },
    {
      name: 'Temperature jump across a normal shock',
      expr: 'T2 = T1*(2*gamma*M1^2 - (gamma - 1))*((gamma - 1)*M1^2 + 2)/((gamma + 1)^2*M1^2)',
      tex: '\\frac{T_2}{T_1} = \\frac{\\left[2\\gamma M_1^2 - (\\gamma - 1)\\right]\\left[(\\gamma - 1)M_1^2 + 2\\right]}{(\\gamma + 1)^2 M_1^2}',
      vars: {
        T2: { name: 'static temperature behind the shock', q: 'temperature', unit: '°C', tex: 'T_2' },
        T1: { name: 'static temperature ahead of the shock', q: 'temperature', unit: '°C', value: 15, min: -80, max: 50, tex: 'T_1' },
        M1: { name: 'Mach number ahead of the shock', value: 2, min: 1, max: 10, tex: 'M_1' },
        gamma: { name: 'ratio of specific heats γ (1.4 for air)', value: 1.4, fixed: true, tex: '\\gamma' }
      },
      note: 'The static temperature jumps while the stagnation temperature stays the same. Ideal gas: at very high Mach numbers real air dissociates and ends cooler than this.',
      stories: {
        T2: 'A normal shock at Mach {M1} passes through air at {T1}. How hot is the air behind it?',
        M1: 'Air at {T1} is heated to {T2} by a normal shock. What was the shock Mach number?'
      }
    },
    {
      name: 'Rayleigh pitot formula (supersonic pitot tube)',
      expr: 'p02 = p1*((gamma + 1)^2*M1^2/(4*gamma*M1^2 - 2*(gamma - 1)))^(gamma/(gamma - 1))*(1 - gamma + 2*gamma*M1^2)/(gamma + 1)',
      tex: '\\frac{p_{02}}{p_1} = \\left[\\frac{(\\gamma + 1)^2 M_1^2}{4\\gamma M_1^2 - 2(\\gamma - 1)}\\right]^{\\frac{\\gamma}{\\gamma - 1}}\\frac{1 - \\gamma + 2\\gamma M_1^2}{\\gamma + 1}',
      vars: {
        p02: { name: 'pitot pressure (stagnation pressure behind the shock)', q: 'pressure', unit: 'kPa', value: 127.66, tex: 'p_{02}' },
        p1: { name: 'free-stream static pressure', q: 'pressure', unit: 'kPa', value: 22.63, tex: 'p_1' },
        M1: { name: 'free-stream Mach number', min: 1, max: 10, tex: 'M_1' },
        gamma: { name: 'ratio of specific heats γ (1.4 for air)', value: 1.4, fixed: true, tex: '\\gamma' }
      },
      solveFor: 'M1',
      note: 'For M₁ ≥ 1. At Mach 1 it agrees with the subsonic (isentropic) formula, p₀/p = 1.893; above, the shock in front of the probe makes the reading lower than p₀.',
      practice: { unknowns: ['M1', 'p02'] },
      stories: {
        M1: 'In supersonic flight a pitot tube reads {p02} where the static pressure is {p1}. What is the Mach number?',
        p02: 'What will a pitot tube read at Mach {M1} where the static pressure is {p1}?'
      }
    }
  ],
  examples: [
    {
      title: 'A Mach 2 shock at sea level',
      q: 'Air at 101.3 kPa and 15 °C meets a normal shock at Mach 2. Find the pressure, temperature and speed behind it, and the loss of stagnation pressure.',
      steps: [
        '$p_2/p_1 = 1 + \\frac{2.8}{2.4}(4 - 1) = 4.50$, so $p_2 = 456$ kPa.',
        '$T_2/T_1 = \\frac{(11.2 - 0.4)(1.6 + 2)}{5.76 \\times 4} = \\frac{10.8 \\times 3.6}{23.04} = 1.6875$, so $T_2 = 486$ K = 213 °C.',
        '$M_2 = \\sqrt{1.8/5.4} = 0.577$. Upstream $V_1 = 2 \\times 340.3 = 681$ m/s; the sound speed behind is $340.3\\sqrt{1.6875} = 442$ m/s, so $V_2 = 0.577 \\times 442 = 255$ m/s.',
        'Check with continuity: $\\rho_2/\\rho_1 = V_1/V_2 = 2.67$. The table gives $p_{02}/p_{01} = 0.721$.'
      ],
      a: '456 kPa, 213 °C and 255 m/s behind the shock; 28 % of the stagnation pressure is lost.'
    },
    {
      title: 'Reading a supersonic pitot tube',
      q: 'At 11 000 m (static pressure 22.63 kPa) a pitot tube reads 127.7 kPa. What is the Mach number? What would the subsonic formula have given?',
      steps: [
        'Ratio: $p_{02}/p_1 = 127.7/22.63 = 5.64$.',
        'The Rayleigh formula gives 5.64 at $M_1 = 2.00$ (solve it with the calculator).',
        'The subsonic formula would give $M = \\sqrt{5\\left[5.64^{2/7} - 1\\right]} = \\sqrt{5 \\times 0.639} = 1.79$ — 11 % low, because it ignores the shock in front of the tube.'
      ],
      a: 'Mach 2.00; the subsonic formula would say Mach 1.79.'
    },
    {
      title: 'The wind behind a blast',
      q: 'A blast front runs at Mach 1.5 into still air at 101.3 kPa and 15 °C. Find the overpressure and the speed of the air behind the front.',
      steps: [
        'Front speed: $1.5 \\times 340.3 = 510$ m/s.',
        '$p_2/p_1 = 1 + 1.1667 \\times 1.25 = 2.458$, so $p_2 = 249$ kPa: an overpressure of 148 kPa.',
        'In the front\'s own frame the air arrives at 510 m/s and leaves at $510/1.862 = 274$ m/s (density ratio 1.862).',
        'Back in the ground frame, the air behind the front moves at $510 - 274 = 236$ m/s, in the direction the front travels.'
      ],
      a: 'An overpressure of about 148 kPa, followed by a wind of about 236 m/s.'
    }
  ],
  quiz: [
    { q: 'Behind a normal shock the flow is always…', choices: ['subsonic', 'supersonic', 'exactly sonic', 'at rest'], a: 0,
      why: 'M₂² = (1 + 0.2M₁²)/(1.4M₁² − 0.2) is below 1 for every M₁ > 1, and never below 0.378² for air.' },
    { q: 'Which quantity is the same on both sides of a steady normal shock?', choices: ['stagnation temperature', 'stagnation pressure', 'static pressure', 'entropy'], a: 0,
      why: 'No heat or work crosses the shock, so the total enthalpy c_pT₀ is conserved. Entropy rises, so the stagnation pressure falls.' },
    { q: 'A strong enough normal shock in air can raise the density tenfold.', a: false,
      why: 'The density ratio approaches (γ + 1)/(γ − 1) = 6 as the Mach number grows; beyond that, extra compression only heats the gas.' },
    { q: 'A normal shock stands in a Mach 3 stream. What is the static pressure ratio p₂/p₁?', answer: 10.33, tol: 0.02,
      why: '1 + (2.8/2.4)(9 − 1) = 1 + 9.333 = 10.33.' },
    { q: 'Why can a supersonic pitot tube not use the isentropic formula p₀/p = (1 + 0.2M²)^3.5?', choices: ['A shock stands in front of it, so it measures the stagnation pressure behind the shock', 'The tube is too hot', 'Static pressure cannot be measured in supersonic flow', 'The formula applies only to liquids'], a: 0,
      why: 'The air reaching the probe has passed through a nearly normal shock and lost stagnation pressure; the Rayleigh formula accounts for it.' }
  ],
  problems: [
    { q: 'Air at 50 kPa passes through a normal shock at Mach 2.5. What is the pressure behind the shock?', answer: 356, unit: 'kPa', tol: 0.02,
      steps: ['$p_2/p_1 = 1 + 1.1667 \\times (6.25 - 1) = 7.125$.', '$p_2 = 50 \\times 7.125 = 356$ kPa.'] },
    { q: 'What percentage of the stagnation pressure survives a normal shock at Mach 1.3?', answer: 97.9, unit: '%', tol: 0.01,
      hint: 'Use the normal-shock table or calculator: p₀₂/p₀₁ at Mach 1.3.',
      steps: ['$p_{02}/p_{01} = 0.979$ at $M_1 = 1.3$.', 'A weak shock is nearly lossless — the loss grows roughly as the cube of $(M_1^2 - 1)$.'] }
  ],
  applications: [
    'Supersonic intakes, which end their compression with a weak normal shock ahead of the engine.',
    'Pitot measurements in supersonic flight and wind tunnels, with the Rayleigh formula.',
    'Shock tubes, which heat and compress a gas in microseconds to study chemistry and re-entry conditions.',
    'Blast waves from explosions, and lithotripters that break kidney stones with focused shock waves.'
  ],
  history: 'William Rankine (1870) and Pierre-Henri Hugoniot (1887) derived the jump conditions independently. Bernhard Riemann had already allowed discontinuities in gas flow in 1860; in 1910 Lord Rayleigh and G. I. Taylor showed that the second law of thermodynamics permits only compression shocks. Rayleigh\'s pitot formula dates from the same period.',
  sim: 'comp-normal-shock'
});

Hyper.add({
  id: 'oblique-shock', parent: 'shocks', title: 'Oblique shock waves', level: 3,
  short: 'A shock inclined to the flow, formed where a supersonic stream is turned into itself by a wedge, a ramp or a cone. Only the velocity component across the shock is slowed, so the flow is deflected and usually stays supersonic. The θ–β–M relation ties the turning angle, the shock angle and the Mach number together.',
  keywords: ['oblique shock', 'θ–β–M relation', 'theta-beta-Mach', 'shock angle', 'deflection angle', 'wedge', 'weak shock', 'strong shock', 'detached shock', 'bow shock', 'maximum deflection', 'supersonic intake', 'ramp'],
  prereq: ['normal-shock', 'mach-cone', 'math:vector-components'],
  related: ['expansion-fans', 'supersonic-airfoils', 'wave-drag', 'ramjet-scramjet', 'de-laval-nozzle', 'flow-visualisation'],
  body: `
A supersonic flow meeting a wedge gets no advance warning, so it is turned abruptly — at a straight shock leaning back from the tip at an angle $\\beta$ to the oncoming stream, steeper than the [[mach-cone|Mach angle]]. Behind the shock the air runs parallel to the wedge face, deflected by the wedge angle $\\theta$.

### A normal shock seen sideways
Split the oncoming velocity into a part across the shock and a part along it. The shock cannot change the part along it — there is no pressure difference in that direction — so it acts only on the part across it, exactly as a [[normal-shock|normal shock]] would, with the Mach number
$$M_{n1} = M_1 \\sin\\beta$$
Every normal-shock ratio applies with $M_{n1}$ in place of $M_1$; the pressure ratio, for example, is $1 + \\frac{2\\gamma}{\\gamma + 1}(M_1^2\\sin^2\\beta - 1)$. The normal component shrinks while the tangential one is kept, so the flow bends towards the shock — by exactly the angle $\\theta$. Geometry plus the normal-shock relations give the **θ–β–M relation**:
$$\\tan\\theta = 2\\cot\\beta\\,\\frac{M_1^2\\sin^2\\beta - 1}{M_1^2(\\gamma + \\cos 2\\beta) + 2}$$
Two limits are worth knowing. As $\\theta \\to 0$ the shock weakens to a Mach wave and $\\beta \\to \\mu = \\arcsin(1/M_1)$. At $\\beta = 90°$ it is a normal shock, and the flow is not turned at all.

### Weak, strong and detached
For each Mach number there is a largest angle $\\theta_{\\max}$ through which an attached shock can turn the flow, and for every smaller angle there are **two** possible shock angles:
- the **weak** solution, with the smaller $\\beta$, a modest pressure rise and, nearly always, supersonic flow behind — the one that forms on wedges, ramps and sharp noses in free flight;
- the **strong** solution, nearly normal, with subsonic flow behind — it appears only when something downstream forces a high pressure, as in some intakes.

If the wedge angle exceeds $\\theta_{\\max}$, no attached shock can turn the flow. The shock **detaches** and stands ahead of the body as a curved **bow shock**: normal and strong on the axis, weakening to a Mach wave far out.

| $M_1$ | Mach angle $\\mu$ | $\\theta_{\\max}$ | weak $\\beta$ at $\\theta = 10°$ | $M_2$ | $p_2/p_1$ |
|---|---|---|---|---|---|
| 1.5 | 41.8° | 12.1° | 56.7° | 1.11 | 1.67 |
| 2 | 30.0° | 23.0° | 39.3° | 1.64 | 1.71 |
| 3 | 19.5° | 34.1° | 27.4° | 2.51 | 2.05 |
| 5 | 11.5° | 41.1° | 19.4° | 4.00 | 3.04 |

### Several weak shocks beat one strong one
The loss of stagnation pressure across a weak shock grows roughly as the cube of $(M_{n1}^2 - 1)$, so turning a flow in one strong shock wastes more than turning it through the same total angle in several weaker steps. Mach 2 air turned 20° by one shock keeps 89 % of its stagnation pressure; turned by two 10° ramps it keeps 97 %. That is why supersonic intakes — the ramps of Concorde, the cones of the SR-71 and the MiG-21 — slow the air through a series of oblique shocks before a last, weak normal shock, and why a scramjet's forebody is a series of ramps ([[ramjet-scramjet]]).

### Where you see them
Oblique shocks are the sharp lines in [[flow-visualisation|schlieren photographs]] of supersonic models and the shock diamonds in an overexpanded rocket jet. A pointed cone turns the flow less abruptly than a wedge of the same angle — the air can also escape sideways — so its shock is weaker and stays attached to larger angles. Over a supersonic wing, oblique shocks and [[expansion-fans|expansion fans]] together make the lift and the [[wave-drag|wave drag]] ([[supersonic-airfoils]]). The [oblique-shock calculator](#/tools/flight/oblique) solves the relation for any case.
`,
  ideas: [
    'An oblique shock is a normal shock acting on the velocity component across it, M₁ sin β; the component along the shock is unchanged.',
    'The θ–β–M relation links the deflection θ, the shock angle β and the Mach number; β lies between the Mach angle and 90°.',
    'For each deflection below θ_max there are a weak and a strong solution; free-flight wedges and ramps take the weak one, with supersonic flow behind.',
    'Beyond θ_max the shock detaches and becomes a curved bow shock standing ahead of the body.',
    'Several weak oblique shocks lose far less stagnation pressure than one strong shock, which is why supersonic intakes use ramps and cones.'
  ],
  pitfalls: [
    'The shock lies at the wedge angle — It lies at a larger angle β, between the Mach angle and 90°; the flow behind it, not the shock, is parallel to the wedge face.',
    'Flow behind an oblique shock is always subsonic, as behind a normal shock — Only the normal component becomes subsonic. Behind a weak oblique shock the total Mach number is usually still supersonic (1.64 behind a 10° wedge at Mach 2).',
    'A blunter wedge just makes a steeper attached shock — Only up to θ_max (23° at Mach 2). Beyond it no attached shock exists and the shock detaches ahead of the body.'
  ],
  formulas: [
    {
      name: 'The θ–β–M relation',
      expr: 'tan(theta) = 2/tan(beta)*(M1^2*sin(beta)^2 - 1)/(M1^2*(gamma + cos(2*beta)) + 2)',
      tex: '\\tan\\theta = 2\\cot\\beta\\,\\frac{M_1^2\\sin^2\\beta - 1}{M_1^2(\\gamma + \\cos 2\\beta) + 2}',
      vars: {
        theta: { name: 'flow deflection (wedge half-angle)', q: 'angle', unit: '°', value: 10, min: 0, max: 45, tex: '\\theta' },
        beta: { name: 'shock angle to the oncoming flow', q: 'angle', unit: '°', min: 1, max: 90, tex: '\\beta' },
        M1: { name: 'Mach number ahead of the shock', value: 2, min: 1, max: 10, tex: 'M_1' },
        gamma: { name: 'ratio of specific heats γ (1.4 for air)', value: 1.4, fixed: true, tex: '\\gamma' }
      },
      solveFor: 'beta',
      note: 'Solving for β gives two angles when θ < θ_max: the weak shock (smaller β, found on wedges in free flight) and the strong one. No solution means the shock is detached.',
      practice: { unknowns: ['beta', 'theta'] },
      stories: {
        beta: 'A wedge of half-angle {theta} sits in a stream at Mach {M1}. At what angle does the shock stand?',
        theta: 'A shock at {beta} stands in a Mach {M1} stream. Through what angle does it turn the flow?',
        M1: 'A {theta} wedge carries an attached shock at {beta}. What is the Mach number of the stream?'
      }
    },
    {
      name: 'Normal component of the Mach number',
      expr: 'Mn1 = M1*sin(beta)', tex: 'M_{n1} = M_1 \\sin\\beta',
      vars: {
        Mn1: { name: 'Mach number of the component across the shock', min: 1, max: 10, tex: 'M_{n1}' },
        M1: { name: 'Mach number ahead of the shock', value: 2, min: 1, max: 10, tex: 'M_1' },
        beta: { name: 'shock angle', q: 'angle', unit: '°', value: 39.31, min: 0, max: 90, tex: '\\beta' }
      },
      note: 'Use M_n1 in the normal-shock relations to get the pressure, density and temperature jumps. It must exceed 1 for a shock; M_n1 = 1 is a Mach wave.',
      practice: { unknowns: ['Mn1', 'beta'] },
      stories: {
        Mn1: 'A shock stands at {beta} to a Mach {M1} stream. What is the Mach number of the flow component across it?',
        beta: 'In a Mach {M1} stream, at what angle must a shock stand for its normal Mach number to be {Mn1}?'
      }
    },
    {
      name: 'Pressure jump across an oblique shock',
      expr: 'p2 = p1*(1 + 2*gamma/(gamma + 1)*(M1^2*sin(beta)^2 - 1))',
      tex: '\\frac{p_2}{p_1} = 1 + \\frac{2\\gamma}{\\gamma + 1}\\left(M_1^2\\sin^2\\beta - 1\\right)',
      vars: {
        p2: { name: 'pressure behind the shock', q: 'pressure', unit: 'kPa', tex: 'p_2' },
        p1: { name: 'pressure ahead of the shock', q: 'pressure', unit: 'kPa', value: 30, tex: 'p_1' },
        M1: { name: 'Mach number ahead of the shock', value: 2.5, min: 1, max: 10, tex: 'M_1' },
        beta: { name: 'shock angle', q: 'angle', unit: '°', value: 36.94, min: 0, max: 90, tex: '\\beta' },
        gamma: { name: 'ratio of specific heats γ (1.4 for air)', value: 1.4, fixed: true, tex: '\\gamma' }
      },
      note: 'The normal-shock pressure ratio with M₁ sin β in place of M₁. This is the pressure on the face of a wedge in supersonic flow.',
      practice: { unknowns: ['p2', 'beta'] },
      stories: {
        p2: 'The weak shock on a wedge in a Mach {M1} stream at {p1} stands at {beta}. What is the pressure on the wedge face?',
        beta: 'A Mach {M1} stream at {p1} rises to {p2} through an oblique shock. At what angle does the shock stand?'
      }
    }
  ],
  examples: [
    {
      title: 'A wedge in a Mach 2 stream',
      q: 'A wedge of 10° half-angle sits in a Mach 2 stream. Find the weak shock angle, the normal Mach number, the pressure ratio and the Mach number behind. What is the strong solution?',
      steps: [
        'Solving the θ–β–M relation for $\\theta = 10°$, $M_1 = 2$: $\\beta = 39.3°$ (weak) or $83.7°$ (strong).',
        'Weak: $M_{n1} = 2\\sin 39.3° = 1.267$, so $p_2/p_1 = 1 + 1.1667(1.605 - 1) = 1.71$.',
        'The normal-shock relations give $M_{n2} = 0.803$, and $M_2 = M_{n2}/\\sin(\\beta - \\theta) = 0.803/\\sin 29.3° = 1.64$: still supersonic.',
        'Strong: $\\beta = 83.7°$, $p_2/p_1 = 4.44$, $M_2 = 0.60$ — subsonic, and only seen with a high back pressure.'
      ],
      a: 'Weak shock at 39.3°: p₂/p₁ = 1.71, M₂ = 1.64. Strong shock at 83.7°: p₂/p₁ = 4.44, M₂ = 0.60.'
    },
    {
      title: 'One ramp or two?',
      q: 'An intake must turn Mach 2 air through 20°. Compare one 20° ramp with two 10° ramps in terms of stagnation pressure.',
      steps: [
        'One shock, θ = 20°: β = 53.4°, $M_2 = 1.21$, $p_{02}/p_{01} = 0.893$.',
        'Two shocks: the first 10° ramp gives $M = 1.64$ and $p_{02}/p_{01} = 0.985$; the second 10° turn at Mach 1.64 gives β = 49.4°, $M = 1.28$ and 0.988.',
        'Together: $0.985 \\times 0.988 = 0.973$.'
      ],
      a: 'One ramp keeps 89 % of the stagnation pressure, two ramps 97 % — and end at a lower Mach number, ready for a weaker final shock.'
    },
    {
      title: 'Too blunt a wedge',
      q: 'The same Mach 2 stream meets a wedge of 25° half-angle. What happens?',
      steps: [
        'At Mach 2 the largest deflection an attached shock can give is $\\theta_{\\max} = 23.0°$.',
        '25° exceeds it, so the θ–β–M relation has no solution: the shock detaches and stands a short distance ahead of the tip as a curved bow shock.',
        'Near the axis the bow shock is normal and the flow behind it subsonic; it can then flow round the tip.'
      ],
      a: 'No attached shock: a detached bow shock with a subsonic region at the nose.'
    }
  ],
  quiz: [
    { q: 'Across an oblique shock, which velocity component is unchanged?', choices: ['the component along the shock', 'the component across the shock', 'the component along the free stream', 'none of them'], a: 0,
      why: 'There is no pressure difference along the shock, so nothing changes the tangential momentum; only the normal component is slowed, which is what turns the flow.' },
    { q: 'A Mach 2 stream meets a wedge of 30° half-angle. What happens?', choices: ['The shock detaches and stands ahead as a bow shock', 'A weak oblique shock at 30°', 'An expansion fan forms', 'Nothing: sharp wedges do not disturb supersonic flow'], a: 0,
      why: 'θ_max at Mach 2 is 23°, so no attached shock can turn the flow through 30°.' },
    { q: 'Behind a weak oblique shock the flow is usually still supersonic.', a: true,
      why: 'Only the normal component becomes subsonic; the unchanged tangential component keeps the total Mach number above 1 except near θ_max.' },
    { q: 'The weak shock on a 10° wedge in a Mach 3 stream lies at β = 27.4°. What is its normal Mach number M₁ sin β?', answer: 1.38, tol: 0.02,
      why: '3 × sin 27.4° = 3 × 0.460 = 1.38: a fairly weak shock, although the stream is at Mach 3.' },
    { q: 'Why do supersonic intakes use several ramps or a cone rather than one steep ramp?', choices: ['Several weak shocks lose less stagnation pressure than one strong shock turning the same angle', 'One ramp would be too heavy', 'Shocks cannot form on steep ramps', 'To heat the air more'], a: 0,
      why: 'The loss grows roughly as the cube of the shock strength, so dividing the compression among weak shocks saves stagnation pressure — thrust for the engine.' }
  ],
  problems: [
    { q: 'A Mach 2.5 stream at 30 kPa meets a 15° wedge; the weak shock stands at 36.9°. What is the pressure on the wedge face?', answer: 74.0, unit: 'kPa', tol: 0.02,
      steps: ['$M_{n1} = 2.5\\sin 36.9° = 1.502$, so $M_{n1}^2 = 2.257$.', '$p_2/p_1 = 1 + 1.1667 \\times 1.257 = 2.467$.', '$p_2 = 30 \\times 2.467 = 74.0$ kPa.'] },
    { q: 'A shock stands at 45° to a Mach 2 stream. What is the pressure ratio across it?', answer: 2.17, tol: 0.02,
      steps: ['$M_{n1} = 2\\sin 45° = 1.414$, so $M_{n1}^2 = 2.0$.', '$p_2/p_1 = 1 + 1.1667 \\times (2.0 - 1) = 2.17$.'] }
  ],
  applications: [
    'Supersonic intakes with ramps and cones.',
    'Wedge and cone noses of missiles and supersonic aircraft.',
    'Scramjet forebodies that compress the air with a train of oblique shocks.',
    'Shock diamonds in overexpanded rocket and jet exhausts.'
  ],
  history: 'Ludwig Prandtl and his student Theodor Meyer worked out the theory of oblique shocks and expansions in Göttingen in 1907–08. G. I. Taylor and J. W. Maccoll solved the flow round a cone in 1933. Intake designers later learned to place the oblique shocks so that they just touch the cowl lip at the design Mach number — the "shock-on-lip" condition that wastes the least air.',
  sim: 'comp-oblique-wedge'
});

Hyper.add({
  id: 'expansion-fans', parent: 'shocks', title: 'Prandtl–Meyer expansion', level: 3,
  short: 'When a supersonic stream turns away from itself round a convex corner, it expands smoothly through a fan of Mach waves centred on the corner: it speeds up, and its pressure and temperature fall, with no loss. The Prandtl–Meyer function gives the Mach number after any turn.',
  keywords: ['expansion fan', 'Prandtl–Meyer', 'Prandtl–Meyer function', 'expansion wave', 'convex corner', 'isentropic expansion', 'Mach waves', 'shock-expansion theory', 'maximum turning angle', 'centred expansion'],
  prereq: ['oblique-shock', 'mach-cone', 'isentropic-flow'],
  related: ['supersonic-airfoils', 'de-laval-nozzle', 'wave-drag', 'normal-shock', 'hypersonic-flight'],
  body: `
Turn a supersonic flow *into* itself and it meets an [[oblique-shock|oblique shock]]. Turn it *away* — round the shoulder of a wedge, the trailing edge of a thin wing, the lip of an underexpanded nozzle — and the opposite happens: the air spreads through a **fan** of Mach waves centred on the corner, each turning it by a hair and speeding it up a little. It leaves the fan faster, thinner, colder and at lower pressure, running parallel to the new wall.

### Smooth and lossless
Each wave in the fan is an infinitely weak Mach wave, so the expansion is **isentropic**: stagnation pressure and temperature do not change, and the [[isentropic-flow|isentropic relations]] give pressure and temperature from the Mach number. The fan is bounded by two Mach lines: the first at the Mach angle $\\mu_1 = \\arcsin(1/M_1)$ to the incoming flow, the last at $\\mu_2$ to the outgoing flow. Streamlines crossing it bend smoothly, and those further from the wall start to bend later. (A compression can be made gradual too, on a concave curve, but its waves converge and merge into a shock; expansion waves spread apart and never do.)

### The Prandtl–Meyer function
Turning and Mach number are linked by one function of $M$, the Prandtl–Meyer angle
$$\\nu(M) = \\sqrt{\\frac{\\gamma + 1}{\\gamma - 1}}\\,\\arctan\\sqrt{\\frac{\\gamma - 1}{\\gamma + 1}(M^2 - 1)} - \\arctan\\sqrt{M^2 - 1}$$
— the angle through which a sonic stream must be turned to reach Mach $M$. A turn of $\\theta$ simply adds to it:
$$\\nu(M_2) = \\nu(M_1) + \\theta$$

| $M$ | 1 | 1.5 | 2 | 2.5 | 3 | 4 | 5 | 10 |
|---|---|---|---|---|---|---|---|---|
| $\\nu$ | 0° | 11.9° | 26.4° | 39.1° | 49.8° | 65.8° | 76.9° | 102.3° |

So Mach 2 air turned through 10° reaches $\\nu = 36.4°$, which is Mach 2.38, with 55 % of its former pressure and a temperature 16 % lower. As $M$ grows without limit, $\\nu$ approaches 130.5°: the largest turn a sonic stream can make before it has expanded into a vacuum. From Mach 2, only 104° more is available.

### Shock-expansion theory
Shocks and fans together describe a thin two-dimensional supersonic airfoil exactly: shocks where the surface turns into the stream, fans where it turns away. A flat plate at 5° in a Mach 2 stream has a fan over its leading edge on top, where the pressure falls to 0.75 $p_\\infty$, and a shock beneath, where it rises to 1.32 $p_\\infty$. The difference gives $c_l = 0.202$ and a drag coefficient of 0.018 — pure [[wave-drag|wave drag]], since the model has no viscosity. Linear theory's $4\\alpha/\\sqrt{M^2 - 1}$ gives almost the same ([[supersonic-airfoils]]).

### Where you see them
Expansion fans bend the jet of an underexpanded nozzle outward and start its chain of shock cells ([[de-laval-nozzle]]); they sit at the shoulders of supersonic bodies and the trailing edges of supersonic wings; and on a re-entry capsule, a fan round the shoulder is where the flow speeds up again after passing the bow shock ([[hypersonic-flight]]).
`,
  ideas: [
    'A supersonic flow turning away from itself expands through a fan of Mach waves centred on the corner.',
    'The expansion is isentropic: the Mach number rises, pressure and temperature fall, and no stagnation pressure is lost.',
    'The Prandtl–Meyer angle ν(M) turns turning into Mach number: ν(M₂) = ν(M₁) + θ.',
    'A flow can turn at most 130.5° from Mach 1 (less from higher Mach numbers) before expanding to a vacuum.',
    'Shocks where the surface turns into the stream and fans where it turns away give the lift and wave drag of supersonic airfoils.'
  ],
  pitfalls: [
    'An expansion fan is a shock that lowers the pressure — Expansion shocks cannot exist. An expansion is a spread-out fan of infinitely weak waves, and it is lossless.',
    'A supersonic flow slows down as it turns round a corner — Away from itself it speeds up; into itself it slows down through a shock. This is the reverse of intuition from subsonic flow.',
    'The fan starts at the corner for every streamline — Only for the one on the wall. A streamline further out meets the first Mach line further downstream and starts turning there.'
  ],
  formulas: [
    {
      name: 'The Prandtl–Meyer function',
      expr: 'nu = sqrt((gamma + 1)/(gamma - 1))*atan(sqrt((gamma - 1)/(gamma + 1)*(M^2 - 1))) - atan(sqrt(M^2 - 1))',
      tex: '\\nu = \\sqrt{\\frac{\\gamma + 1}{\\gamma - 1}}\\,\\arctan\\sqrt{\\frac{\\gamma - 1}{\\gamma + 1}\\left(M^2 - 1\\right)} - \\arctan\\sqrt{M^2 - 1}',
      vars: {
        nu: { name: 'Prandtl–Meyer angle', q: 'angle', unit: '°', tex: '\\nu' },
        gamma: { name: 'ratio of specific heats γ (1.4 for air)', value: 1.4, fixed: true, tex: '\\gamma' },
        M: { name: 'Mach number', value: 2, min: 1, max: 10 }
      },
      note: 'The angle through which a sonic flow must be turned to reach Mach M: 26.38° at Mach 2, 49.76° at Mach 3, approaching 130.45° as M grows without limit (air).',
      stories: {
        nu: 'Through what angle must a sonic stream turn to reach Mach {M}?',
        M: 'A sonic stream turns through {nu} round a convex corner. What Mach number does it reach?'
      }
    },
    {
      name: 'Turning a supersonic stream (air)',
      expr: 'sqrt(6)*atan(sqrt((M2^2 - 1)/6)) - atan(sqrt(M2^2 - 1)) = sqrt(6)*atan(sqrt((M1^2 - 1)/6)) - atan(sqrt(M1^2 - 1)) + theta',
      tex: '\\nu(M_2) = \\nu(M_1) + \\theta',
      vars: {
        M2: { name: 'Mach number after the turn', min: 1, max: 50, tex: 'M_2' },
        M1: { name: 'Mach number before the turn', value: 2, min: 1, max: 10, tex: 'M_1' },
        theta: { name: 'turning angle (away from the flow)', q: 'angle', unit: '°', value: 10, min: 0, max: 90, tex: '\\theta' }
      },
      solveFor: 'M2',
      note: 'ν as defined above with γ = 1.4, for which (γ + 1)/(γ − 1) = 6. The expansion is isentropic, so the isentropic tables give the pressure and temperature at M₂.',
      stories: {
        M2: 'Air at Mach {M1} expands round a {theta} convex corner. What is its Mach number afterwards?',
        theta: 'Through what angle must Mach {M1} air turn to reach Mach {M2}?'
      }
    },
    {
      name: 'Pressure after an expansion',
      expr: 'p2 = p1*((1 + (gamma - 1)/2*M1^2)/(1 + (gamma - 1)/2*M2^2))^(gamma/(gamma - 1))',
      tex: '\\frac{p_2}{p_1} = \\left(\\frac{1 + \\frac{\\gamma - 1}{2}M_1^2}{1 + \\frac{\\gamma - 1}{2}M_2^2}\\right)^{\\gamma/(\\gamma - 1)}',
      vars: {
        p2: { name: 'pressure after the expansion', q: 'pressure', unit: 'kPa', tex: 'p_2' },
        p1: { name: 'pressure before the expansion', q: 'pressure', unit: 'kPa', value: 50, tex: 'p_1' },
        M1: { name: 'Mach number before', value: 2, min: 1, max: 10, tex: 'M_1' },
        M2: { name: 'Mach number after', value: 2.385, min: 1, max: 30, tex: 'M_2' },
        gamma: { name: 'ratio of specific heats γ (1.4 for air)', value: 1.4, fixed: true, tex: '\\gamma' }
      },
      note: 'Stagnation pressure is constant through the fan, so the ratio of the two isentropic p₀/p values gives the pressure change. Temperature: the same bracket to the power 1.',
      practice: { unknowns: ['p2', 'M2'] },
      stories: {
        p2: 'Air at {p1} and Mach {M1} expands to Mach {M2}. What is its pressure now?',
        M2: 'Air at {p1} and Mach {M1} expands through a fan until its pressure is {p2}. What is its Mach number?'
      }
    }
  ],
  examples: [
    {
      title: 'Round a 10° corner at Mach 2',
      q: 'Mach 2 air turns 10° round a convex corner. Find the Mach number, pressure and temperature ratios, and the angles of the fan.',
      steps: [
        '$\\nu(2) = 26.38°$, so $\\nu_2 = 36.38°$, which gives $M_2 = 2.385$.',
        '$p_2/p_1 = (1.8/2.1376)^{3.5} = 0.548$ and $T_2/T_1 = 1.8/2.1376 = 0.842$.',
        'First Mach line: $\\mu_1 = \\arcsin(1/2) = 30°$ to the oncoming flow. Last: $\\mu_2 = \\arcsin(1/2.385) = 24.8°$ to the new flow direction, which is 10° lower — so 14.8° to the original direction.'
      ],
      a: 'Mach 2.38, 55 % of the pressure, 16 % colder; the fan spans from 30° to 14.8° above the original flow direction.'
    },
    {
      title: 'A flat plate at Mach 2 (shock-expansion theory)',
      q: 'A flat plate meets a Mach 2 stream at 5°. Estimate its lift and wave-drag coefficients.',
      steps: [
        'Upper surface — a 5° expansion: $\\nu = 31.38°$, $M = 2.186$, $p_u/p_\\infty = 0.747$.',
        'Lower surface — a 5° oblique shock: $\\beta = 34.3°$, $p_l/p_\\infty = 1.315$.',
        'Dynamic pressure $q = \\tfrac{\\gamma}{2}p_\\infty M^2 = 2.8\\,p_\\infty$, so the normal-force coefficient is $(1.315 - 0.747)/2.8 = 0.203$.',
        '$c_l = 0.203\\cos 5° = 0.202$ and $c_d = 0.203\\sin 5° = 0.018$. Linear theory: $4\\alpha/\\sqrt{3} = 0.2015$.'
      ],
      a: 'c_l ≈ 0.20 and a wave-drag coefficient of about 0.018.'
    }
  ],
  quiz: [
    { q: 'Through an expansion fan the stagnation pressure…', choices: ['stays the same', 'falls', 'rises', 'drops to the static pressure'], a: 0,
      why: 'The fan is made of infinitely weak Mach waves, so the expansion is isentropic and no stagnation pressure is lost.' },
    { q: 'Mach 1.5 air (ν = 11.9°) turns 20° round a convex corner. Its new Prandtl–Meyer angle is…', choices: ['31.9°', '8.1°', '20°', '11.9°'], a: 0,
      why: 'ν₂ = ν₁ + θ = 11.9° + 20° = 31.9°, which is Mach 2.21.' },
    { q: 'A supersonic flow can be turned away from itself through any angle, however large.', a: false,
      why: 'ν cannot exceed 130.45° for air: from Mach 1 the stream can turn at most that much before expanding into a vacuum, and less from higher Mach numbers.' },
    { q: 'What is the Prandtl–Meyer angle ν for Mach 3 air, in degrees?', answer: 49.76, unit: '°', tol: 0.01,
      why: '√6·arctan(√(8/6)) − arctan(√8) = 2.449 × 49.11° − 70.53° = 49.76°.' },
    { q: 'On a flat plate at a small positive angle of attack in supersonic flow, the upper surface sees…', choices: ['an expansion fan at the leading edge, and lower pressure', 'a shock at the leading edge, and higher pressure', 'no disturbance at all', 'a normal shock'], a: 0,
      why: 'The upper surface turns away from the oncoming flow, so the flow expands round the leading edge; the lower surface turns into it and carries a shock. The pressure difference is the lift.' }
  ],
  problems: [
    { q: 'Mach 2.5 air at 20 kPa expands round a 15° convex corner. What is its Mach number afterwards?', answer: 3.24, tol: 0.02,
      hint: 'ν(2.5) = 39.12°.',
      steps: ['$\\nu_2 = 39.12° + 15° = 54.12°$.', 'Inverting the Prandtl–Meyer function: $M_2 = 3.24$. The pressure falls to $20 \\times 17.09/52.2 = 6.5$ kPa.'] },
    { q: 'Through what angle must a sonic stream of air turn to reach Mach 2?', answer: 26.4, unit: '°', tol: 0.01,
      steps: ['$\\nu(2) = \\sqrt6\\arctan\\sqrt{3/6} - \\arctan\\sqrt3 = 2.449 \\times 35.26° - 60° = 26.38°$.'] }
  ],
  applications: [
    'Supersonic airfoils, and the shock-expansion method of estimating their lift and wave drag.',
    'The shape of underexpanded rocket and jet plumes.',
    'The diverging walls of supersonic nozzles, designed by the method of characteristics.',
    'The shoulders of re-entry capsules and the bases of supersonic projectiles.'
  ],
  history: 'Ludwig Prandtl sketched the corner expansion in 1907, and his student Theodor Meyer worked out its theory in a 1908 Göttingen dissertation — one of the first rigorous treatments of two-dimensional supersonic flow. The method of characteristics built on it by Prandtl and Adolf Busemann in 1929 gave the contours of supersonic wind-tunnel nozzles for decades.',
  sim: 'comp-expansion-corner'
});

Hyper.add({
  id: 'mach-cone', parent: 'shocks', title: 'The Mach cone', level: 1,
  short: 'A body moving faster than sound leaves its sound waves behind inside a cone whose half-angle, the Mach angle μ, has sin μ = 1/M. Outside the cone the air has not yet heard it; its surface is where all the waves pile up.',
  keywords: ['Mach cone', 'Mach angle', 'Mach wave', 'Mach line', 'wavefronts', 'zone of silence', 'zone of action', 'sound barrier', 'supersonic source', 'Cherenkov radiation', 'Kelvin wake'],
  prereq: ['mach-number', 'speed-of-sound', 'physics:doppler-effect'],
  related: ['sonic-boom', 'oblique-shock', 'mach-regimes', 'expansion-fans', 'physics:shock-waves', 'physics:huygens-principle'],
  body: `
Every small disturbance — a buzzing insect, an aircraft's nose, a bullet — sends out pressure waves that spread in all directions at the [[speed-of-sound|speed of sound]] $a$ relative to the air. The pattern they make depends on how fast the source moves through that air.

### From circles to a cone
- **At rest**, the wavefronts are concentric spheres.
- **Subsonic** ($M < 1$): the source chases its own waves but never catches them. The fronts crowd together ahead (a higher pitch — the [[physics:doppler-effect|Doppler effect]]) and spread out behind, but every one still runs ahead of the source. The air in front is always warned.
- **Sonic** ($M = 1$): the source keeps pace with its waves and the fronts pile up into a single sheet at the nose — the "sound barrier" of early high-speed flight.
- **Supersonic** ($M > 1$): the source overtakes its waves. A front sent out a time $t$ ago is a sphere of radius $at$, while the source has since moved $Vt$; all these spheres touch a cone trailing from the source with half-angle $\\mu$:
$$\\sin\\mu = \\frac{at}{Vt} = \\frac{1}{M}$$

This is the **Mach cone**, and $\\mu$ is the **Mach angle**: 90° at Mach 1, 30° at Mach 2, 19.5° at Mach 3, 11.5° at Mach 5. Inside the cone — the *zone of action* — the air has felt the body; outside, in the *zone of silence*, it has not. In two dimensions (a wedge, the edge of a wing) the cone becomes a pair of **Mach lines** at the same angle.

### Waves on water, light in water
The pattern is general. A boat faster than the surface waves it makes draws a V-shaped bow wave, and a charged particle faster than light travels in water emits Cherenkov light on a cone — the blue glow in reactor pools, used by detectors to measure particle speeds. (Deep-water ship wakes are a curious exception: because long water waves travel faster than short ones, the wake half-angle is fixed at 19.5° — arcsin(1/3), the Mach angle at Mach 3 — whatever the boat's speed.)

### Hearing a supersonic aircraft
A supersonic aircraft passing overhead is silent until its cone sweeps over you, and by then it is well past. In still, uniform air, flying at height $h$, it has travelled $h\\sqrt{M^2 - 1}$ beyond the overhead point when the cone arrives: at Mach 2 and 17 000 m that is 29 km, some 50 seconds after it passed overhead. The real atmosphere bends the cone, because the speed of sound falls with height; that shifts these numbers and can stop the cone reaching the ground at all ([[sonic-boom]]).

### Mach waves and shocks
A sharp, thin body makes weak waves that lie almost exactly at the Mach angle. A thicker nose makes a stronger disturbance, which runs a little faster than sound, so the real bow wave is an [[oblique-shock|oblique shock]] somewhat steeper than $\\mu$; far from the body it weakens and relaxes towards the Mach angle.

> [!key] The Mach angle measures how far a supersonic body is felt: not at all ahead of it, and only inside a cone that narrows the faster it flies.
`,
  ideas: [
    'Sound waves spread at the speed of sound relative to the air; a supersonic source overtakes them.',
    'All the wavefronts of a supersonic source touch a cone with half-angle μ, where sin μ = 1/M.',
    'The Mach angle is 90° at Mach 1, 30° at Mach 2 and 11.5° at Mach 5: the faster the body, the narrower the cone.',
    'Outside the cone the air has not yet felt the body; a supersonic aircraft is heard only after it has passed.',
    'The same geometry gives the V of a boat\'s bow wave and the cone of Cherenkov light.'
  ],
  pitfalls: [
    'The Mach cone forms only at the moment the aircraft passes Mach 1 — It exists continuously for as long as the source is supersonic, trailing with it.',
    'A supersonic aircraft can be heard approaching — Its sound cannot get ahead of it; the air ahead of the cone is silent until the cone arrives.',
    'The shock on a blunt nose lies exactly at the Mach angle — Strong disturbances travel faster than sound, so bow shocks are steeper than the Mach angle near the body and approach it only far away.'
  ],
  formulas: [
    {
      name: 'Mach angle',
      expr: 'mu = asin(1/M)', tex: '\\mu = \\arcsin\\frac{1}{M}',
      vars: {
        mu: { name: 'Mach angle (half-angle of the cone)', q: 'angle', unit: '°', tex: '\\mu' },
        M: { name: 'Mach number', value: 2, min: 1, max: 10 }
      },
      note: 'Defined for M ≥ 1. Small disturbances from a supersonic body lie on this cone; strong ones (shocks) lie at steeper angles.',
      stories: {
        mu: 'What is the half-angle of the Mach cone of a body flying at Mach {M}?',
        M: 'A schlieren photograph shows Mach waves at {mu} to a projectile\'s path. What is its Mach number?'
      }
    },
    {
      name: 'How far past you the aircraft is when you hear it',
      expr: 'x = h*sqrt(M^2 - 1)', tex: 'x = h\\sqrt{M^2 - 1}',
      vars: {
        x: { name: 'distance flown past the overhead point', q: 'length', unit: 'km' },
        h: { name: 'height of the aircraft', q: 'length', unit: 'km', value: 10 },
        M: { name: 'Mach number', value: 1.5, min: 1, max: 10 }
      },
      note: 'Still air with a uniform speed of sound (straight cone). The real atmosphere bends the cone and changes this.',
      stories: {
        x: 'An aircraft flies at Mach {M} at a height of {h}. How far past the overhead point is it when its cone reaches you?',
        M: 'An aircraft at a height of {h} is {x} past the overhead point when its cone reaches you. What is its Mach number (uniform air)?',
        h: 'An aircraft at Mach {M} is {x} past you when you hear it. How high is it (uniform air)?'
      }
    },
    {
      name: 'Delay between overhead and hearing',
      expr: 't = h*sqrt(M^2 - 1)/(M*a)', tex: 't = \\frac{h\\sqrt{M^2 - 1}}{M\\,a}',
      vars: {
        t: { name: 'time after the aircraft passed overhead', q: 'time', unit: 's' },
        h: { name: 'height of the aircraft', q: 'length', unit: 'km', value: 10 },
        M: { name: 'Mach number', value: 1.5, min: 1, max: 10 },
        a: { name: 'speed of sound (uniform air)', q: 'speed', unit: 'm/s', value: 300, min: 280, max: 350 }
      },
      note: 'The distance above divided by the speed V = Ma. At Mach 1 the delay is zero: the cone is a plane.',
      stories: {
        t: 'A jet flies at Mach {M} at {h} in air where sound travels at {a}. How long after it passes overhead do you hear it?',
        M: 'You hear a jet {t} after it passed overhead at a height of {h}; sound travels at {a}. What is its Mach number (uniform air)?'
      }
    }
  ],
  examples: [
    {
      title: 'Concorde overhead',
      q: 'Concorde cruises at Mach 2 at 17 000 m, where the speed of sound is 295 m/s. Treating the air as uniform, find the Mach angle and how long after it passes overhead the cone arrives.',
      steps: [
        '$\\mu = \\arcsin(1/2) = 30°$.',
        'Distance: $x = 17\\sqrt{3} = 29.4$ km beyond the overhead point.',
        'Time: $t = 29\\,400/(2 \\times 295) = 50$ s.'
      ],
      a: 'A 30° cone that arrives about 50 s after the aircraft passed overhead, 29 km away.'
    },
    {
      title: 'The crack of a bullet',
      q: 'A rifle bullet flies at 850 m/s in air where sound travels at 343 m/s. What is its Mach angle?',
      steps: [
        '$M = 850/343 = 2.48$.',
        '$\\mu = \\arcsin(1/2.48) = 23.8°$.',
        'Someone to the side of the line of fire hears the sharp crack of this cone before the muzzle report, which travels at only the speed of sound.'
      ],
      a: 'About 24°.'
    }
  ],
  quiz: [
    { q: 'At Mach 2 the Mach angle is…', choices: ['30°', '60°', '45°', '2°'], a: 0,
      why: 'sin μ = 1/2, so μ = 30°.' },
    { q: 'A source moves at Mach 0.8. Its sound waves…', choices: ['all stay ahead of it, crowded in front', 'form a Mach cone', 'pile up at its nose in a single front', 'cannot spread forward at all'], a: 0,
      why: 'Below Mach 1 the waves always outrun the source; they are only compressed ahead (the Doppler effect).' },
    { q: 'The faster a supersonic aircraft flies, the narrower its Mach cone.', a: true,
      why: 'sin μ = 1/M falls as M rises: 42° at Mach 1.5, 19.5° at Mach 3.' },
    { q: 'At what Mach number is the Mach angle 45°?', answer: 1.414, tol: 0.02,
      why: 'M = 1/sin 45° = √2 = 1.414.' },
    { q: 'An observer on the ground hears a supersonic aircraft…', choices: ['only after it has passed overhead, when its cone arrives', 'before it arrives, as a rising whine', 'exactly as it passes overhead', 'never, because it is supersonic'], a: 0,
      why: 'Its sound cannot get ahead of it; the cone trailing behind reaches the ground some distance behind the aircraft.' }
  ],
  problems: [
    { q: 'An aircraft flies at Mach 1.5 at 10 000 m. In uniform air with a sound speed of 300 m/s, how many seconds after it passes overhead does its cone reach you?', answer: 24.8, unit: 's', tol: 0.02,
      steps: ['$x = 10\\,000\\sqrt{1.5^2 - 1} = 11\\,180$ m.', '$t = 11\\,180/(1.5 \\times 300) = 24.8$ s.'] },
    { q: 'A photograph of a projectile shows Mach waves at 35° to its path. What is its Mach number?', answer: 1.74, tol: 0.02,
      steps: ['$M = 1/\\sin 35° = 1/0.574 = 1.74$.'] }
  ],
  applications: [
    'Estimating Mach numbers from schlieren and shadowgraph photographs.',
    'Predicting where and when a sonic boom reaches the ground.',
    'Acoustic gunshot location, which uses the arrival of a bullet\'s shock cone at several microphones.',
    'Cherenkov detectors in particle physics, which measure speeds from the angle of a light cone.'
  ],
  history: 'Ernst Mach and Peter Salcher photographed the cone of waves around a supersonic bullet in 1887, using the flash of an electric spark to cast its shadow. The cone and its angle were named after Mach, as was the speed ratio itself, at Jakob Ackeret\'s suggestion in 1929.',
  sim: { id: 'comp-mach-cone', params: { M: 2 } }
});

Hyper.add({
  id: 'sonic-boom', parent: 'shocks', title: 'The sonic boom', level: 2,
  short: 'The Mach cone of a supersonic aircraft reaching the ground as two sudden pressure jumps a few tenths of a second apart — an N-shaped wave heard as a double bang. It weakens with height and grows with the aircraft\'s size and weight, and in the real atmosphere an aircraft only slightly supersonic makes no boom on the ground at all.',
  keywords: ['sonic boom', 'N-wave', 'overpressure', 'boom carpet', 'Mach cut-off', 'focused boom', 'superboom', 'low boom', 'X-59', 'Concorde', 'supersonic over land', 'Carlson method', 'Whitham'],
  prereq: ['mach-cone', 'normal-shock', 'isa'],
  related: ['oblique-shock', 'wave-drag', 'lapse-rate', 'flight-testing', 'physics:shock-waves', 'physics:sound-intensity'],
  body: `
A sonic boom is not made at the moment an aircraft "breaks the sound barrier". It is the [[mach-cone|Mach cone]] of a supersonic aircraft sweeping across the ground for as long as the aircraft stays supersonic — a moving carpet of noise under the flight path that each listener hears once, as the cone passes.

### The N-wave
Close to the aircraft the pressure field is complicated: shocks from the nose, canopy, wings, intakes and tail, expansions in between. As the waves travel kilometres through the air, the stronger parts run faster — they are warmer and move with the air they compress — and overtake the weaker ones. By the time they reach the ground they have merged into two shocks: a **bow shock**, a sudden rise in pressure; then a steady fall to below ambient; then a **tail shock** back to ambient. Plotted against time the signature looks like the letter N, and the ear hears it as a sharp double bang.

Two numbers describe it: the **overpressure** $\\Delta p$ of the first jump and the **duration** $\\Delta t$ of the N.

| Aircraft and flight | Ground overpressure | Duration |
|---|---|---|
| Concorde, Mach 2 at 17 km | about 95 Pa (2 lb/ft²) | about 0.3–0.4 s |
| SR-71, Mach 3 at 24 km | about 45 Pa | — |
| Fighter, Mach 1.4 at 10 km | 50–100 Pa | about 0.15 s |
| Fighter, Mach 1.2 at 3 km | several hundred Pa | about 0.1 s |

A 100 Pa step is only a thousandth of an atmosphere — less than the pressure change of riding a lift up ten metres — but it arrives within a few milliseconds, a peak sound level of about 134 dB.

### How strong
Gerald Whitham's theory of weak shocks, turned by Harry Carlson at NASA in 1978 into a hand method, gives for steady, level flight
$$\\Delta p \\approx K_r\\sqrt{p_v\\,p_g}\\,(M^2 - 1)^{1/8}\\left(\\frac{l}{h}\\right)^{3/4} K_s$$
with $p_v$ and $p_g$ the air pressures at the aircraft and on the ground, $l$ the aircraft's length, $h$ its height, $K_r \\approx 2$ for the reflection from hard ground, and a **shape factor** $K_s$ of about 0.1 that carries the aircraft's volume and lift. The boom falls with height as $h^{-3/4}$ — and faster still, because $p_v$ falls too — so flying high is the main cure. It grows with length and weight and depends only weakly on the Mach number.

### The atmosphere steers it
Sound is faster in the warm air near the ground than in the cold air aloft, so the rays of the cone bend upward on their way down. An aircraft only a little faster than the local speed of sound makes a boom that never reaches the ground: to be heard below, it must outrun the speed of sound *at ground level*. From 11 km in still standard air that means at least Mach 1.15 — the **Mach cut-off**. The same bending limits the width of the **boom carpet**: beyond its edges the rays curve away and nobody hears a boom. Acceleration, turns and push-overs do the opposite, bunching rays together into a **focused boom** two to five times stronger along a line on the ground; wind and turbulence roughen the signature from one listener to the next.

### Living with it
Booms of 50–100 Pa startle people and rattle windows; strong ones from low-flying aircraft can crack glass and plaster. Public tests in the 1960s — Oklahoma City heard eight booms a day for six months in 1964 — led many countries to ban civil supersonic flight over land, and Concorde flew supersonic only over the sea. Research now aims at **low-boom** shapes, long and slender with carefully tailored volume and lift, whose ground signature has gentle ramps instead of sharp jumps: a distant thump rather than a bang. NASA's X-59 was built to find out whether people will accept that sound.

> [!warn] Supersonic flight is regulated. In most countries civil aircraft may not make sonic booms over land, and military flights use designated areas. The figures here are rounded and illustrative.
`,
  ideas: [
    'A sonic boom is the Mach cone sweeping the ground for as long as the aircraft is supersonic, not a single event at Mach 1.',
    'Far from the aircraft its shocks merge into an N-wave: a sudden rise, a steady fall below ambient, and a sudden return — heard as a double bang.',
    'Overpressure falls with height roughly as h^(−3/4) and grows with length and weight; Concorde\'s was about 95 Pa.',
    'Sound is faster near the warm ground, so the rays bend upward: below the cut-off Mach number (about 1.15 from 11 km) no boom reaches the ground.',
    'Manoeuvres can focus a boom; careful shaping can soften it into a thump.'
  ],
  pitfalls: [
    'The boom happens once, when the aircraft goes through Mach 1 — It is produced continuously and swept along the ground under the whole supersonic part of the flight.',
    'Any supersonic aircraft booms on the ground below — In the real atmosphere the rays of a slightly supersonic aircraft bend upward and never reach the ground; the aircraft must beat the speed of sound at ground level.',
    'A sonic boom is a huge pressure change — Under a cruising airliner-sized aircraft it is about a thousandth of an atmosphere; what makes it startling is that it arrives in a few milliseconds.'
  ],
  formulas: [
    {
      name: 'Boom overpressure (Carlson\'s simplified method)',
      expr: 'dp = Kr*sqrt(pv*pg)*(M^2 - 1)^(1/8)*(l/h)^(3/4)*Ks',
      tex: '\\Delta p = K_r \\sqrt{p_v\\, p_g}\\,(M^2 - 1)^{1/8}\\left(\\frac{l}{h}\\right)^{3/4} K_s',
      vars: {
        dp: { name: 'bow-shock overpressure on the ground', q: 'pressure', unit: 'Pa', tex: '\\Delta p' },
        Kr: { name: 'ground reflection factor (about 1.9–2 on hard ground)', value: 2, fixed: true, tex: 'K_r' },
        pv: { name: 'air pressure at the aircraft\'s height', q: 'pressure', unit: 'kPa', value: 8.79, min: 2, max: 80, tex: 'p_v' },
        pg: { name: 'air pressure at the ground', q: 'pressure', unit: 'kPa', value: 101.325, min: 85, max: 105, tex: 'p_g' },
        M: { name: 'Mach number', value: 2, min: 1, max: 5 },
        l: { name: 'aircraft length', q: 'length', unit: 'm', value: 62 },
        h: { name: 'height above the ground', q: 'length', unit: 'km', value: 17 },
        Ks: { name: 'shape factor (about 0.08–0.15)', value: 0.1, min: 0.01, max: 0.5, tex: 'K_s' }
      },
      note: 'Carlson (NASA TP-1122, 1978), steady level flight, with the atmospheric correction factor taken as 1. A first estimate for conventional aircraft; it does not apply to shaped low-boom designs or to manoeuvres, which can focus the boom.',
      practice: { unknowns: ['dp'] },
      stories: {
        dp: 'An aircraft {l} long flies at Mach {M} at a height of {h}, where the pressure is {pv}; the ground pressure is {pg}. With a shape factor of {Ks} and a reflection factor of {Kr}, estimate the boom overpressure.',
        l: 'An aircraft at Mach {M} and {h} (pressure {pv} aloft, {pg} on the ground, shape factor {Ks}, reflection factor {Kr}) makes a boom of {dp}. How long is it?'
      }
    },
    {
      name: 'Boom duration (Carlson\'s simplified method)',
      expr: 'dt = 3.42/av*M/(M^2 - 1)^(3/8)*h^(1/4)*l^(3/4)*Ks',
      tex: '\\Delta t = \\frac{3.42}{a_v}\\,\\frac{M}{(M^2 - 1)^{3/8}}\\,h^{1/4}\\,l^{3/4}\\,K_s',
      vars: {
        dt: { name: 'duration of the N-wave', q: 'time', unit: 'ms', tex: '\\Delta t' },
        av: { name: 'speed of sound at the aircraft\'s height', q: 'speed', unit: 'm/s', value: 299.5, min: 280, max: 345, tex: 'a_v' },
        M: { name: 'Mach number', value: 1.4, min: 1.01, max: 5 },
        h: { name: 'height above the ground', q: 'length', unit: 'km', value: 10, min: 1, max: 25 },
        l: { name: 'aircraft length', q: 'length', unit: 'm', value: 15, min: 5, max: 100 },
        Ks: { name: 'shape factor (about 0.08–0.15)', value: 0.12, min: 0.01, max: 0.5, tex: 'K_s' }
      },
      note: 'Same method and assumptions. The time between the two bangs grows slowly with height (h^¼) and with the aircraft\'s length; for a given height it is shortest near Mach 2.',
      practice: { unknowns: ['dt'] },
      stories: {
        dt: 'An aircraft {l} long flies at Mach {M} at {h}, where sound travels at {av}. With a shape factor of {Ks}, how long does its N-wave last?',
        l: 'An aircraft at Mach {M} and {h} (sound speed {av} aloft, shape factor {Ks}) makes an N-wave lasting {dt}. How long is the aircraft?'
      }
    },
    {
      name: 'Mach cut-off (no wind)',
      expr: 'Mc = sqrt(Tg/Tv)', tex: 'M_c = \\frac{a_g}{a_v} = \\sqrt{\\frac{T_g}{T_v}}',
      vars: {
        Mc: { name: 'lowest Mach number whose boom reaches the ground', tex: 'M_c' },
        Tg: { name: 'air temperature at the ground', q: 'temperature', unit: '°C', value: 15, min: -20, max: 45, tex: 'T_g' },
        Tv: { name: 'air temperature at the aircraft', q: 'temperature', unit: '°C', value: -56.5, min: -80, max: 20, tex: 'T_v' }
      },
      practice: { unknowns: ['Mc'] },
      note: 'The aircraft must fly faster than the speed of sound at the ground for the rays to reach it. Winds shift the value; a warmer layer aloft or an inversion changes it too.',
      stories: {
        Mc: 'An aircraft cruises where the air is at {Tv}; the ground is at {Tg}. Below what Mach number does its boom not reach the ground (in still air)?',
        Tv: 'Over ground at {Tg} the cut-off Mach number is {Mc}. How cold is the air at the aircraft\'s height?'
      }
    }
  ],
  examples: [
    {
      title: 'Concorde\'s boom',
      q: 'Estimate the boom of a 62 m airliner cruising at Mach 2 at 17 000 m (pressure 8.79 kPa, speed of sound 295 m/s) over sea-level ground, with $K_s = 0.1$ and $K_r = 2$.',
      steps: [
        '$\\sqrt{p_v p_g} = \\sqrt{8790 \\times 101\\,325} = 29\\,840$ Pa.',
        '$(M^2 - 1)^{1/8} = 3^{0.125} = 1.147$ and $(l/h)^{3/4} = (62/17\\,000)^{0.75} = 0.0148$.',
        '$\\Delta p = 2 \\times 29\\,840 \\times 1.147 \\times 0.0148 \\times 0.1 = 102$ Pa — close to the 90–100 Pa measured under Concorde.',
        'Duration: $\\Delta t = \\frac{3.42}{295}\\cdot\\frac{2}{3^{0.375}}\\cdot 17\\,000^{0.25}\\cdot 62^{0.75} \\times 0.1 = 0.0116 \\times 1.324 \\times 11.42 \\times 22.1 \\times 0.1 = 0.39$ s.'
      ],
      a: 'About 100 Pa (2 lb/ft²), with the two bangs roughly 0.4 s apart.'
    },
    {
      title: 'Why fly high',
      q: 'The same aircraft flies at Mach 2 at 12 000 m instead, where the pressure is 19.3 kPa. What happens to the boom?',
      steps: [
        '$\\sqrt{p_v p_g} = \\sqrt{19\\,330 \\times 101\\,325} = 44\\,260$ Pa — higher, because the air aloft is denser.',
        '$(l/h)^{3/4} = (62/12\\,000)^{0.75} = 0.0193$ — higher, because the aircraft is closer.',
        '$\\Delta p = 2 \\times 44\\,260 \\times 1.147 \\times 0.0193 \\times 0.1 = 196$ Pa.'
      ],
      a: 'About 196 Pa — almost twice as strong from 5 km lower.'
    },
    {
      title: 'The cut-off',
      q: 'An aircraft flies at Mach 1.10 at 11 000 m (−56.5 °C) over ground at 15 °C, in still air. Does its boom reach the ground?',
      steps: [
        '$M_c = \\sqrt{288.15/216.65} = 1.153$.',
        'Its speed, $1.10 \\times 295 = 325$ m/s, is below the 340 m/s speed of sound at the ground.',
        'Its cone exists, but the rays bend upward before reaching the ground: nobody below hears a boom.'
      ],
      a: 'No: in still standard air it would need about Mach 1.15.'
    }
  ],
  quiz: [
    { q: 'A sonic boom is produced…', choices: ['continuously, for as long as the aircraft flies supersonically', 'once, at the instant the aircraft passes Mach 1', 'only when the aircraft dives', 'only by the engines'], a: 0,
      why: 'The Mach cone travels with the aircraft and sweeps a strip of ground along the whole supersonic part of the flight.' },
    { q: 'Why is a sonic boom usually heard as a double bang?', choices: ['The N-wave has two shocks, one from the bow and one from the tail', 'The sound echoes off the ground', 'Each wing makes one bang', 'The engines and the airframe make one each'], a: 0,
      why: 'Far from the aircraft its many shocks merge into a bow shock and a tail shock, a few tenths of a second apart.' },
    { q: 'In a standard atmosphere and still air, an aircraft at 11 km flying at Mach 1.1 makes a boom that reaches the ground.', a: false,
      why: 'The cut-off Mach number from 11 km is about 1.15: its rays bend upward before reaching the warmer air near the ground.' },
    { q: 'Using Δp ∝ h^(−3/4) alone, by what factor does the boom change if an aircraft doubles its height?', answer: 0.59, tol: 0.03,
      why: '2^(−0.75) = 0.59. The real fall is larger, because the air pressure at the aircraft (p_v) is also lower up there.' },
    { q: 'What peak sound pressure level corresponds to a 100 Pa pressure step?', choices: ['about 134 dB', 'about 100 dB', 'about 74 dB', 'about 200 dB'], a: 0,
      why: '20 log₁₀(100 Pa / 20 µPa) = 20 × 6.7 = 134 dB — loud because it arrives in milliseconds, although it is only a thousandth of an atmosphere.' }
  ],
  problems: [
    { q: 'A fighter 15 m long flies at Mach 1.4 at 10 km, where the pressure is 26.4 kPa, over sea-level ground (101.3 kPa). With K_s = 0.12 and K_r = 2, estimate the ground overpressure.', answer: 94, unit: 'Pa', tol: 0.03,
      steps: ['$\\sqrt{26\\,400 \\times 101\\,325} = 51\\,720$ Pa.', '$(1.96 - 1)^{1/8} = 0.995$; $(15/10\\,000)^{0.75} = 0.00762$.', '$\\Delta p = 2 \\times 51\\,720 \\times 0.995 \\times 0.00762 \\times 0.12 = 94$ Pa.'] },
    { q: 'What is the cut-off Mach number for an aircraft at 5 km (−17.5 °C) over ground at 15 °C, in still air?', answer: 1.06, tol: 0.01,
      steps: ['$M_c = \\sqrt{288.15/255.65} = \\sqrt{1.127} = 1.062$.'] }
  ],
  applications: [
    'Planning supersonic test flights and military training areas.',
    'Designing low-boom aircraft shapes.',
    'Rules for civil supersonic flight over land.',
    'Tracking returning spacecraft and meteors, whose booms reach the ground.'
  ],
  history: 'The first boom from a piloted aircraft in level flight came from Chuck Yeager\'s Bell X-1 in 1947. Gerald Whitham showed in 1952 how a body\'s shape fixes its far-field signature, the theory behind every boom prediction since. After the 1964 Oklahoma City tests and a long public debate, the United States banned civil supersonic flight over land in 1973, and Concorde, which entered service in 1976, flew supersonic only over the sea.',
  sim: ['comp-sonic-boom', { id: 'comp-mach-cone', params: { M: 1.6 } }]
});
