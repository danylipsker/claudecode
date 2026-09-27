/* HYPER-AERODYNAMICS · content/airfoils.js — the Airfoils branch:
 *   airfoil-basics     airfoil geometry, how lift works, the pressure coefficient, the pressure distribution,
 *                      the Kutta condition, NACA airfoils   (the lift equation is the reference page, reference.js)
 *   airfoil-behaviour  the lift curve, stall, pitching moment and aerodynamic centre, centre of pressure,
 *                      thin-airfoil theory, Reynolds-number effects, flaps and slats, special airfoils
 * Numbers marked "panel method" come from kit.fluid.panel (inviscid); measured section data are rounded
 * values at a Reynolds number of about 6 million. Simulations: sims/airfoils.js (foil-*). */
Hyper.add(

/* ================================================================ AIRFOIL BASICS */
{
  id: 'airfoil-geometry', parent: 'airfoil-basics', title: 'Airfoil geometry', level: 1,
  short: 'The anatomy of a wing section: a rounded leading edge, a sharp trailing edge, the chord line between them, a mean camber line that sets how curved it is, a thickness wrapped round that line — and the angle of attack between the chord and the oncoming air.',
  keywords: ['airfoil', 'aerofoil', 'wing section', 'profile', 'chord', 'chord line', 'mean camber line', 'camber', 'thickness', 'thickness-to-chord ratio', 't/c', 'leading edge', 'trailing edge', 'nose radius', 'angle of attack', 'incidence', 'pitch attitude'],
  prereq: ['what-is-a-fluid', 'streamlines'],
  related: ['naca-airfoils', 'how-lift-works', 'lift-equation', 'wing-planform', 'special-airfoils', 'thin-airfoil-theory', 'aircraft-axes'],
  body: `
Slice a wing from front to back and the cut face is an **airfoil** (British texts also write *aerofoil*): a blunt, rounded front, a sharp back, and a gentle curve between. Every part of that shape has a job, and a handful of numbers describe it completely.

### The parts
- The **leading edge** is the front, rounded so that the air can meet it from a range of directions without tearing away. Its roundness is measured by the **nose radius**, typically 1–2 % of the chord.
- The **trailing edge** is the back, as sharp as the builder can make it. It is sharp for a reason: the air must leave there, and a sharp edge fixes where — which, as [[kutta-condition|the Kutta condition]] shows, fixes the lift.
- The **chord line** is the straight line from the leading edge to the trailing edge; its length is the **chord** $c$.
- The **mean camber line** runs halfway between the upper and lower surfaces. The largest gap between it and the chord line is the **camber** $m$, and where along the chord it occurs is its **position** $p$. A symmetric section has no camber: its mean line *is* the chord line.
- The **thickness** $t$ is the largest distance between upper and lower surfaces, quoted as a fraction of the chord, the **thickness-to-chord ratio** $t/c$.

Designers build an airfoil exactly in that order: draw a mean line, then wrap a thickness distribution round it, perpendicular to the line at each point (see [[naca-airfoils]] and the builder below). Camber decides *how much* lift the section gives at a given angle and where on the angle scale it works best; thickness decides how gently it stalls, how stiff and roomy the wing can be, and how early it runs into [[critical-mach|shock waves]] at high speed.

| Section | Thickness $t/c$ | Camber | Where you find it |
|---|---|---|---|
| Fighter wing, high-speed tail | 4–6 % | little or none | supersonic and fast jets |
| Airliner wing (mean) | 10–12 % | aft-loaded | transonic cruise |
| Light aircraft wing | 12–15 % | 2–4 % | e.g. NACA 2412 |
| Glider wing | 13–17 % | 3–5 % | laminar sections |
| Wind-turbine blade root | 25–40 % | moderate | strength where the bending is largest |

### Angle of attack
The **angle of attack** $\\alpha$ is the angle between the chord line and the direction of the oncoming air (the *relative wind*). It is not the angle of the aircraft's nose above the horizon — that is the **pitch attitude** $\\theta$ — and the two differ by the angle at which the aircraft is climbing or descending, the **flight-path angle** $\\gamma$. Wings are also rigged at a small **incidence** $i_w$ to the fuselage, so

$$\\alpha = \\theta + i_w - \\gamma$$

A glider descending at 4° with its nose 1° below the horizon and a climbing trainer with its nose 8° up can have exactly the same angle of attack. Because the wing's lift depends on $\\alpha$ and not on the attitude, $\\alpha$ is the angle that matters — it moves the section along its [[lift-curve|lift curve]] and, past about 15°, into the [[stall]].

> [!key] Four numbers describe most airfoils: chord, thickness ratio, camber and its position. A fifth, the angle of attack, describes how the airfoil meets the air.

Open the [airfoil lab](#/tools/airfoil) to see the flow round any of these shapes.
`,
  ideas: [
    'An airfoil has a rounded leading edge, a sharp trailing edge and a chord line joining them.',
    'The mean camber line lies halfway between the surfaces; camber is its largest height above the chord, thickness is the largest distance between the surfaces.',
    'Thickness and camber are quoted as fractions of the chord: a 12 % thick section on a 1.5 m chord is 180 mm deep.',
    'Angle of attack is measured between the chord line and the oncoming air, not between the nose and the horizon: α = θ + i_w − γ.'
  ],
  pitfalls: [
    'Angle of attack is the angle of the nose above the horizon — That is the pitch attitude. In a climb the air comes from above the horizon, in a glide from below, so the same attitude can mean very different angles of attack.',
    'The chord line follows the curve of the airfoil — It is a straight line from the leading edge to the trailing edge; the curved line halfway between the surfaces is the mean camber line.',
    'A thicker airfoil always gives more lift — Thickness mostly changes how the section stalls and how much room it has inside; the lift at a given angle comes mainly from camber and angle of attack.'
  ],
  formulas: [
    {
      name: 'Thickness-to-chord ratio',
      expr: 'tc = t/c', tex: '\\tau = \\dfrac{t}{c}',
      vars: {
        tc: { name: 'thickness-to-chord ratio', q: 'ratio', unit: '%', tex: '\\tau' },
        t: { name: 'greatest thickness', q: 'length', unit: 'mm', value: 180 },
        c: { name: 'chord', q: 'length', unit: 'm', value: 1.5 }
      },
      note: 'Aerodynamicists quote thickness (and camber) as a fraction of the chord, so that sections of any size can be compared.',
      stories: {
        tc: 'A wing section is {t} deep at its thickest on a chord of {c}. What is its thickness ratio?',
        t: 'A {tc} thick section has a chord of {c}. How deep is it at its thickest?'
      }
    },
    {
      name: 'Angle of attack from attitude and flight path',
      expr: 'alpha = theta + iw - gamma', tex: '\\alpha = \\theta + i_w - \\gamma',
      vars: {
        alpha: { name: 'angle of attack', q: 'angle', unit: '°', min: -30, max: 30, signed: true, tex: '\\alpha' },
        theta: { name: 'pitch attitude (nose above the horizon)', q: 'angle', unit: '°', value: 8, min: -30, max: 30, signed: true, tex: '\\theta' },
        iw: { name: 'wing incidence (chord to fuselage axis)', q: 'angle', unit: '°', value: 1.5, min: -5, max: 10, signed: true, tex: 'i_w' },
        gamma: { name: 'flight-path angle (climb positive)', q: 'angle', unit: '°', value: 5, min: -30, max: 30, signed: true, tex: '\\gamma' }
      },
      note: 'In still air, with the wings level. The flight-path angle is negative in a descent.',
      stories: {
        alpha: 'An aircraft climbs at a flight-path angle of {gamma} with its nose {theta} above the horizon; its wing is rigged at {iw} to the fuselage. What is the wing\'s angle of attack?',
        theta: 'A wing rigged at {iw} must fly at {alpha} angle of attack while the aircraft climbs at {gamma}. What pitch attitude does that take?'
      }
    }
  ],
  examples: [
    {
      title: 'Reading a wing root',
      q: 'A wing root section has a chord of 2.1 m, a greatest thickness of 315 mm, and its mean line rises 42 mm above the chord at 0.84 m behind the leading edge. Describe it in fractions of the chord.',
      steps: [
        'Thickness ratio: $315/2100 = 0.15$, i.e. 15 %.',
        'Camber: $42/2100 = 0.02$, i.e. 2 % of the chord.',
        'Position of the camber: $0.84/2.1 = 0.40$, i.e. 40 % of the chord.',
        'In the NACA four-digit code that is camber 2, position 4, thickness 15: a **NACA 2415** (see [[naca-airfoils]]).'
      ],
      a: 'A 15 % thick section with 2 % camber at 40 % chord — a NACA 2415.'
    },
    {
      title: 'The same angle of attack, climbing and gliding',
      q: 'A wing is rigged at 1.5° to the fuselage. Find its angle of attack (a) in a climb at 5° with the nose 8° up, (b) in a glide descending at 4° with the nose 1° below the horizon.',
      steps: [
        '(a) $\\alpha = \\theta + i_w - \\gamma = 8 + 1.5 - 5 = 4.5°$.',
        '(b) Here $\\theta = -1°$ and $\\gamma = -4°$: $\\alpha = -1 + 1.5 - (-4) = 4.5°$.',
        'Nine degrees of difference in attitude, the same angle of attack — and so the same lift coefficient.'
      ],
      a: '4.5° in both cases.'
    }
  ],
  quiz: [
    { q: 'The angle of attack is the angle between…', choices: ['the chord line and the oncoming air', 'the mean camber line and the horizon', 'the fuselage and the horizon', 'the upper surface and the oncoming air'], a: 0,
      why: 'It is defined with the chord line and the relative wind. The fuselage-to-horizon angle is the pitch attitude, which differs from α by the climb angle and the wing incidence.' },
    { q: 'In a symmetric airfoil the mean camber line coincides with the chord line.', a: true,
      why: 'Symmetric means the upper and lower surfaces are mirror images, so the line halfway between them is straight — the chord line. Its camber is zero.' },
    { q: 'An aircraft climbs at 10° with its nose 14° above the horizon; the wing incidence is 0°. What is the angle of attack, in degrees?', answer: 4, unit: '°',
      why: 'α = θ + i_w − γ = 14 + 0 − 10 = 4°. Most of the attitude is used up by the climb.' },
    { q: 'Why is the trailing edge of an airfoil made sharp?', choices: ['to save weight', 'so that the air leaves at a definite point, which fixes the circulation and so the lift', 'to cut drag at zero lift', 'because a rounded edge is harder to build'], a: 1,
      why: 'A sharp edge makes the flow leave smoothly from one place (the Kutta condition), which sets how much circulation — and lift — the airfoil develops. A rounded rear would leave the lift undetermined and would shed a wide, draggy wake.' },
    { q: 'Which section is the thickest, as a fraction of its chord?', choices: ['NACA 0006', 'NACA 2412', 'NACA 4415', 'NACA 23012'], a: 2,
      why: 'The last two digits give the thickness in per cent of the chord: 6, 12, 15 and 12. The 4415 is 15 % thick.' }
  ],
  problems: [
    { q: 'A propeller blade section has a chord of 120 mm and is 9 % thick. How thick is it, in millimetres?', answer: 10.8, unit: 'mm', tol: 0.02,
      steps: ['$t = 0.09 \\times 120 = 10.8$ mm.'] },
    { q: 'A glider descends along a path 3° below the horizontal with its nose 2° above the horizon; its wing incidence is 0.5°. What is its angle of attack?', answer: 5.5, unit: '°', tol: 0.02,
      steps: ['$\\gamma = -3°$ in a descent.', '$\\alpha = \\theta + i_w - \\gamma = 2 + 0.5 + 3 = 5.5°$.'] }
  ],
  applications: ['Wings, tailplanes and fins of every aircraft.', 'Propeller, helicopter-rotor, fan and wind-turbine blades — airfoils that go round.', 'Racing-car wings (upside down), hydrofoils, sails and keels.', 'Compressor and turbine blades in jet engines, where rows of airfoils turn the flow.'],
  history: 'Horatio Phillips patented curved, double-surfaced wing sections in 1884 after testing them in a steam-driven wind tunnel, and Otto Lilienthal flew cambered wings in the 1890s. The Wright brothers measured about two hundred small model wings in their own wind tunnel in 1901, and the systematic families that followed — Göttingen\'s in Germany, the NACA\'s in the United States — made the airfoil an engineering object with a catalogue number.',
  sim: 'foil-naca-builder'
},

{
  id: 'how-lift-works', parent: 'airfoil-basics', title: 'How lift works', level: 1,
  short: 'A wing lifts by turning the passing air downwards. To curve the air\'s path it must set up a pressure field — low above, a little higher below — and that pressure field is the lift. Newton, Bernoulli and circulation are three honest views of one flow; "equal transit time" is not one of them.',
  keywords: ['lift', 'how a wing works', 'Bernoulli', 'Newton', 'downwash', 'upwash', 'flow turning', 'pressure difference', 'circulation', 'Kutta–Joukowski', 'equal transit time', 'longer path myth', 'Coanda', 'streamline curvature', 'control volume', 'momentum'],
  prereq: ['physics:newtons-third-law', 'physics:bernoullis-equation', 'streamlines', 'airfoil-geometry'],
  related: ['lift-equation', 'kutta-condition', 'kutta-joukowski', 'vorticity-circulation', 'pressure-distribution', 'pressure-coefficient', 'downwash', 'wingtip-vortices', 'magnus-effect', 'stall'],
  body: `
Every explanation of lift has to account for one observation: a wing moving through air, tilted a few degrees, feels an upward force many times larger than the drag — 50 to 100 times, for a good wing section. Here is what the air actually does, told in the order the physics happens, with numbers from a panel-method solution of a NACA 2412 section at 4° angle of attack (the section of many light aircraft).

### 1. The wing turns the air
Watch smoke round a wing. Ahead of it the air **rises** to meet it (*upwash*, about 4.6° half a chord ahead of our section); it follows the curve of the upper surface and leaves the trailing edge travelling **downwards** (*downwash*, about 3° half a chord behind). The net effect of the wing on the stream is to bend it down. Bending a stream of mass needs a force — [[physics:newtons-second-law|Newton's second law]] — and by [[physics:newtons-third-law|Newton's third law]] the air pushes back on the wing, upward and slightly backward. That reaction is the lift.

This is true, and it tells you roughly *how much* lift: a wing that throws more air down faster lifts more. What it does not say is *how* the force gets from the air to the wing. Air can only push on a surface through pressure (and, much more weakly, friction). So the turning must show up as a pattern of pressure on the wing.

### 2. Curved flow means a pressure field
A parcel of air follows a curved path only if something pushes it towards the centre of the curve — exactly like a car on a bend (see [[physics:centripetal-force|centripetal force]]). In a fluid that push is a pressure difference across the streamlines:

$$\\frac{\\partial p}{\\partial n} = \\frac{\\rho V^2}{R}$$

with $n$ pointing away from the centre of curvature and $R$ the radius of the bend. Over the top of the wing the streamlines curve round the surface, the centre of their curvature lies inside the wing, so the pressure **rises** as you move up away from the surface. Far above, it is atmospheric; at the surface, therefore, it must be **below** atmospheric. That suction is most of the lift. Underneath, the air slows as it meets the front of the wing and the pressure rises a little above atmospheric: a modest push.

For our NACA 2412 at 4°, the pressure coefficient on the upper surface is about −1.4 near the nose and −0.84 at 30 % of the chord; on the lower surface it is about +0.1. At 60 m/s ($q = 2.2$ kPa) that is 1.9 kPa of suction on top at 30 % chord against 0.2 kPa of push below. Adding up the whole surface, **about 80 % of the lift comes from the suction on the upper surface.**

The pressure field and the turning cause each other: the pressure differences bend the flow, and the bent flow sustains the pressure differences. Neither comes first — they are two faces of one solution of the equations of motion.

### 3. Low pressure means fast flow — Bernoulli
Where the pressure is low the air has been accelerated into that region; where it is high the air has been slowed. Along each streamline [[physics:bernoullis-equation|Bernoulli's equation]] $p + \\tfrac12\\rho V^2 = \\text{const}$ links the two, and because all the streamlines start from the same uniform stream, the constant is the same everywhere. So the air over the top runs fast — **1.37 times the free-stream speed** at 30 % chord on our section — and the air underneath slightly slow, 0.96 times.

Bernoulli does not *explain* why the air speeds up; it states that pressure and speed must change together. The cause is the whole flow pattern, which the shape and angle of the wing impose.

### 4. The race that nobody told the air about
The most widespread explanation of lift says that two parcels of air parting at the leading edge must meet again at the trailing edge; the top one has further to go, so it goes faster, and by Bernoulli its pressure is lower. The last step — faster air, lower pressure — is fine. The error is at the start.

- **No law makes the parcels meet.** Air has no memory of its neighbour.
- **They do not meet.** Released side by side, the top parcel reaches the trailing edge first, and by a long way: on our section it arrives $0.26\\,c/V_\\infty$ earlier, while its partner is still **a quarter of the chord behind**. At 8° the lead is nearly 40 % of the chord. The parcels never rejoin.
- **The numbers do not work.** The upper surface of a NACA 2412 is only 1.4 % longer than the lower one, yet the air over it moves on average about 40 % faster. Equal transit times would give a tiny fraction of the real lift.
- **It cannot explain the obvious.** A thin curved sail has equal path lengths on both sides and lifts well; aircraft fly upside down; a symmetric airfoil lifts as soon as it is tilted.

The air over the top is fast because the low pressure ahead of it draws it in — and it is so fast that it wins the race outright. The simulation below shows the race.

### 5. Circulation: the bookkeeping that gives the number
Subtract the uniform stream from the flow round a lifting airfoil and what is left circulates: faster over the top, slower underneath. The **circulation** $\\Gamma$ — the line integral of velocity round any loop enclosing the airfoil (see [[vorticity-circulation]]) — measures it. It does *not* mean that air goes round the wing; it is a measure of the top–bottom speed asymmetry. The [[kutta-joukowski|Kutta–Joukowski theorem]] turns it into a force per metre of span,

$$L' = \\rho V_\\infty \\Gamma$$

and the sharp trailing edge fixes how much circulation the airfoil develops ([[kutta-condition]]). For a section, $\\Gamma = \\tfrac12 c_l V_\\infty c$: our 2412 at 4° has $\\Gamma = 0.37\\,V_\\infty c$. Circulation is how aerodynamicists actually *calculate* lift — thin-airfoil theory, panel methods and lifting-line theory are all ways of finding $\\Gamma$.

### 6. Newton or Bernoulli? Both — and here is the proof
Draw an imaginary surface round the airfoil and count what crosses it. The lift must appear either as **downward momentum carried out** by the air flowing through the surface (the Newton view) or as **pressure pushing on the surface** (the Bernoulli view). The total always equals $\\rho V_\\infty \\Gamma$. The split depends only on the shape you draw:

| Control surface round the airfoil | Seen as momentum | Seen as pressure |
|---|---|---|
| a tall box, lids far above and below | ≈ 99 % | ≈ 1 % |
| a circle | 50 % | 50 % |
| a long flat box, ends far ahead and behind | ≈ 0 % | ≈ 100 % |

(Panel-method numbers for our section; try it in the simulation.) The two "rival" explanations are two ways of doing the accounts for the same flow. For a real, finite wing the downward momentum does not fade: the [[wingtip-vortices|tip vortices]] leave a sheet of air moving down behind the aircraft ([[downwash]]), and ultimately the weight of the aircraft is felt as a slight extra pressure spread over the ground below it.

### Other stories, briefly
- **"Air bounces off the bottom like a skipping stone."** Newton's own impact model gives a force proportional to $\\sin^2\\alpha$ — about 30 times too small at 5°. It ignores the upper surface, which does most of the work. (It becomes useful at [[hypersonic-flight|hypersonic]] speeds.)
- **"The Coandă effect makes the air follow the curve."** The air follows the surface because of the pressure field just described; the Coandă effect proper concerns jets.
- **"It is a half venturi."** A venturi has walls on both sides; a wing has open air above, and the curvature argument, not a squeezed channel, sets the pressure.

> [!key] Lift is one flow seen three ways: the wing turns the air down (Newton), which requires low pressure above and higher pressure below (curvature, Bernoulli), which is summed up by the circulation (Kutta–Joukowski). The air over the top is faster — faster than any equal-time story allows.

What limits all this is viscosity: the thin [[boundary-layer|boundary layer]] must climb from the low pressure near the nose back to the trailing-edge pressure, and if the angle is too large it gives up and separates — the [[stall]]. Open the [airfoil lab](#/tools/airfoil) to explore any section, and see [[lift-equation]] for how big the force is.
`,
  ideas: [
    'A wing lifts by turning the air downwards; the air pushes back on the wing (Newton\'s third law).',
    'Turning air along curved streamlines requires a pressure difference across them: low pressure over the top, slightly raised pressure underneath — most of the lift is suction on the upper surface.',
    'By Bernoulli, the low-pressure air over the top moves faster; it reaches the trailing edge well before the air that went underneath.',
    'The circulation Γ sums up the top–bottom speed difference; the lift per metre of span is ρV∞Γ, and the sharp trailing edge fixes Γ.',
    'Newton and Bernoulli are two ways of counting the same force: momentum carried through a control surface, or pressure acting on it.'
  ],
  pitfalls: [
    'Air parcels split at the leading edge must meet at the trailing edge, so the top air goes faster because its path is longer — No law requires them to meet, and they do not: the top parcel arrives far earlier. The path-length difference (about 1–2 %) is much too small to explain the speed difference (20–50 %).',
    'Either Newton or Bernoulli explains lift, and the other is wrong — Both are consequences of the same equations of motion applied to the same flow; which one "shows" the lift depends only on where you choose to count.',
    'Circulation means the air goes round and round the wing — Circulation is an integral that measures how much faster the air flows over the top than underneath; no parcel actually circles the wing.'
  ],
  formulas: [
    {
      name: 'Lift from circulation (Kutta–Joukowski)',
      expr: 'Lp = rho*V*Gamma', tex: 'L\' = \\rho\\, V_\\infty \\Gamma',
      vars: {
        Lp: { name: 'lift per metre of span', unit: 'N/m', signed: true, tex: 'L\'' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, min: 0.3, max: 1.35, tex: '\\rho' },
        V: { name: 'free-stream speed', q: 'speed', unit: 'm/s', value: 50, tex: 'V_\\infty' },
        Gamma: { name: 'circulation round the section', unit: 'm²/s', value: 22.5, signed: true, tex: '\\Gamma' }
      },
      note: 'Exact for two-dimensional inviscid flow round any shape; the circulation is set by the Kutta condition at the sharp trailing edge.',
      stories: {
        Lp: 'A wing section moving at {V} through air of density {rho} carries a circulation of {Gamma}. How much lift does each metre of span make?',
        Gamma: 'Each metre of a wing makes {Lp} of lift at {V} in air of density {rho}. What circulation does its section carry?'
      }
    },
    {
      name: 'Circulation of a lifting section',
      expr: 'Gamma = 0.5*cl*V*c', tex: '\\Gamma = \\tfrac12\\, c_l\\, V_\\infty\\, c',
      vars: {
        Gamma: { name: 'circulation', unit: 'm²/s', signed: true, tex: '\\Gamma' },
        cl: { name: 'section lift coefficient', value: 0.6, min: -1, max: 2, signed: true, tex: 'c_l' },
        V: { name: 'free-stream speed', q: 'speed', unit: 'm/s', value: 50, tex: 'V_\\infty' },
        c: { name: 'chord', q: 'length', unit: 'm', value: 1.5 }
      },
      note: 'Follows from L\' = ρV∞Γ and L\' = ½ρV∞²c·c_l.',
      stories: { Gamma: 'A section of {c} chord flies at {V} with a lift coefficient of {cl}. What circulation does it carry?', cl: 'A {c} chord section at {V} carries a circulation of {Gamma}. What is its lift coefficient?' }
    },
    {
      name: 'Lift as downward momentum given to the air (ideal wing)',
      expr: 'L = rho*V*(pi*b^2/4)*w', tex: 'L = \\rho V_\\infty \\left(\\dfrac{\\pi b^2}{4}\\right) w',
      vars: {
        L: { name: 'lift', q: 'force', unit: 'kN', value: 9.81 },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, min: 0.3, max: 1.35, tex: '\\rho' },
        V: { name: 'flight speed', q: 'speed', unit: 'm/s', value: 50, tex: 'V_\\infty' },
        b: { name: 'wing span', q: 'length', unit: 'm', value: 11 },
        w: { name: 'downward speed given to the air (far behind)', q: 'speed', unit: 'm/s', tex: 'w' }
      },
      solveFor: 'w',
      note: 'Momentum theory of an elliptically loaded wing: it acts on a stream tube as wide as its span and leaves it moving down at w; half of that, w/2, is the downwash at the wing itself (see induced drag).',
      stories: {
        w: 'An aircraft needs {L} of lift from a wing of {b} span at {V} in air of density {rho}. How fast is the air moving down far behind it?',
        L: 'A wing of {b} span flying at {V} through air of density {rho} leaves the air behind it moving down at {w}. How much does it lift?'
      }
    }
  ],
  examples: [
    {
      title: 'How big is the pressure difference?',
      q: 'A light aircraft of 1000 kg has 16.2 m² of wing. What average pressure difference between the lower and upper surfaces holds it up, and how does it compare with the atmosphere?',
      steps: [
        'Weight: $1000 \\times 9.81 = 9810$ N.',
        'Average pressure difference: $\\Delta p = W/S = 9810/16.2 = 606$ Pa.',
        'Atmospheric pressure is 101 325 Pa, so the wing is held up by 0.6 % of an atmosphere.',
        'Near the ground the air pressure falls by $\\rho g = 12$ Pa per metre of height: 606 Pa is the pressure difference across about 50 m of height.'
      ],
      a: 'About 600 Pa — 0.6 % of atmospheric pressure, the change you feel riding a lift up 50 m.'
    },
    {
      title: 'The race to the trailing edge',
      q: 'Two parcels of air arrive side by side at a 1.5 m chord NACA 2412 section flying at 50 m/s and 4° angle of attack, one just above the dividing streamline and one just below. The panel method says the top parcel reaches the trailing edge $0.26\\,c/V_\\infty$ earlier. How much earlier is that, and how far behind is the bottom parcel?',
      steps: [
        'The time unit: $c/V_\\infty = 1.5/50 = 0.030$ s.',
        '$\\Delta t = 0.26 \\times 0.030 = 7.8$ ms.',
        'The panel solution puts the bottom parcel 24 % of the chord short of the trailing edge at that moment: $0.24 \\times 1.5 = 0.36$ m.',
        'For comparison: the upper surface is only 1.4 % (21 mm) longer than the lower. Equal transit time would need the top air to be just 1.4 % faster; it is on average about 40 % faster.'
      ],
      a: 'The top parcel wins by about 8 ms, with its partner still some 0.36 m from the trailing edge.'
    },
    {
      title: 'How much air does a wing throw down?',
      q: 'The same 1000 kg aircraft (span 11 m) flies at 50 m/s at sea level. Using the momentum picture of an ideal wing, how much air does it deflect each second, and how fast does that air end up moving down?',
      steps: [
        'Mass flow through a stream tube as wide as the span: $\\dot m = \\rho V \\pi b^2/4 = 1.225 \\times 50 \\times \\pi \\times 11^2/4 = 5820$ kg/s.',
        'Lift equals the downward momentum given to it each second: $w = L/\\dot m = 9810/5820 = 1.69$ m/s.',
        'At the wing itself the air is moving down at half that, 0.84 m/s — a flow tilted by less than 1°.'
      ],
      a: 'About 5.8 tonnes of air a second, set moving down at 1.7 m/s.'
    }
  ],
  quiz: [
    { q: 'Two parcels of air that part at the leading edge of a lifting wing meet again at the trailing edge.', a: false,
      why: 'They do not: the parcel that went over the top arrives first, often while its partner is a quarter of the chord or more behind. Nothing in the physics requires them to meet.' },
    { q: 'Which statement about the "Newton" and "Bernoulli" explanations is right?', choices: ['Newton\'s is right and Bernoulli\'s is wrong', 'Bernoulli\'s is right and Newton\'s is wrong', 'Both describe the same flow: the pressure field turns the air down, and the air pushes back on the wing', 'They apply to different kinds of wing'], a: 2,
      why: 'The pressure difference (Bernoulli\'s side) is what pushes on the wing and what bends the flow downwards (Newton\'s side). Counting through a control surface, the same lift appears as momentum, as pressure, or as a mix, depending only on the surface chosen.' },
    { q: 'On a typical airfoil in cruise, most of the lift comes from…', choices: ['the air pushing up on the lower surface', 'the suction on the upper surface', 'friction on the surfaces', 'air striking the leading edge'], a: 1,
      why: 'For a NACA 2412 at 4° about 80 % of the lift is the upper-surface suction; the lower surface adds a modest push.' },
    { q: 'Why does the air over the top of a wing move faster than the free stream?', choices: ['because it has further to travel in the same time', 'because the pressure there is low, and air accelerates towards lower pressure', 'because friction drags it along', 'because the wing pushes it from behind'], a: 1,
      why: 'Air speeds up when it moves from higher to lower pressure. The curved flow over the top creates low pressure there; the air accelerates into it — and wins the race to the trailing edge.' },
    { q: 'A glider of 500 kg with an 18 m span flies at 25 m/s at sea level. By the momentum picture of an ideal wing, how fast (m/s) is the air moving down far behind it?', answer: 0.63, unit: 'm/s', tol: 0.03,
      why: 'ṁ = ρVπb²/4 = 1.225 × 25 × π × 18²/4 = 7790 kg/s; w = L/ṁ = 4905/7790 = 0.63 m/s. Long wings lift by moving a lot of air a little — which is why they are efficient.' }
  ],
  problems: [
    { q: 'A wing section carries a circulation of 30 m²/s at 60 m/s in sea-level air (ρ = 1.225 kg/m³). What lift does each metre of span make?', answer: 2205, unit: 'N/m', tol: 0.02,
      steps: ['$L\' = \\rho V_\\infty \\Gamma = 1.225 \\times 60 \\times 30 = 2205$ N per metre of span.'] },
    { q: 'A 1.2 m chord section at 40 m/s carries a circulation of 18 m²/s. What is its lift coefficient?', answer: 0.75, tol: 0.02,
      steps: ['$c_l = 2\\Gamma/(V_\\infty c) = 2 \\times 18/(40 \\times 1.2) = 0.75$.'] }
  ],
  applications: ['Every wing, rotor, propeller and sail works by turning the flow; the same reasoning sizes them.', 'Racing-car wings turn the air upwards to push the car down (downforce).', 'Wind turbines turn the wind and take energy from the reaction.', 'Checking popular explanations: a good test of any story of lift is whether it predicts the right size of force.'],
  history: 'Frederick Lanchester described lift in terms of circulation and trailing vortices in his 1907 book "Aerodynamics", though few read it. Martin Kutta (1902) and Nikolai Joukowski (1906) independently derived the link between circulation and lift, and Ludwig Prandtl\'s school in Göttingen turned it into practical wing theory between 1910 and 1920. The equal-transit-time story has circulated in popular books and some training material for decades; aerodynamicists have been pointing out its flaws for almost as long.',
  sim: ['foil-lift-mechanism', 'ref-airfoil']
},

{
  id: 'pressure-coefficient', parent: 'airfoil-basics', title: 'The pressure coefficient', level: 2,
  short: 'The pressure coefficient C_p compares the pressure at a point with the free-stream pressure, in units of the dynamic pressure: 1 at a stagnation point, 0 where the air moves at free-stream speed, negative where it runs faster. It does not change with speed, so one measurement serves all speeds.',
  keywords: ['pressure coefficient', 'Cp', 'suction', 'stagnation pressure', 'dynamic pressure', 'pressure tap', 'manometer', 'Prandtl–Glauert', 'compressibility correction', 'local speed', 'wind load'],
  prereq: ['dynamic-pressure', 'physics:bernoullis-equation', 'air-pressure'],
  related: ['pressure-distribution', 'stagnation-point', 'force-coefficients', 'critical-mach', 'pitot-tube', 'force-balance', 'wind-loads'],
  body: `
Pressures on a wing are tiny differences on top of a huge background: the atmosphere presses with about 101 000 Pa, while the suction that holds an aircraft up is a few thousand pascals at most. Aerodynamicists therefore subtract the background and measure what is left in the natural unit of the flow, the [[dynamic-pressure|dynamic pressure]] $q_\\infty = \\tfrac12 \\rho V_\\infty^2$:

$$C_p = \\frac{p - p_\\infty}{\\tfrac12 \\rho V_\\infty^2}$$

where $p$ is the static pressure at a point on the surface and $p_\\infty$ the static pressure of the undisturbed stream.

### What the values mean
In low-speed flow Bernoulli's equation turns this into a statement about local speed $V$:

$$C_p = 1 - \\left(\\frac{V}{V_\\infty}\\right)^2$$

| Local speed $V/V_\\infty$ | $C_p$ | Where |
|---|---|---|
| 0 | +1 | a stagnation point, where the air is brought to rest |
| 0.5 | +0.75 | the front of the lower surface |
| 1 | 0 | air at free-stream speed |
| 1.22 | −0.5 | mid-chord, upper surface |
| 1.41 | −1 | behind the nose of a lifting wing |
| 2 | −3 | suction peak at a high angle of attack |
| 2.65 | −6 | the nose of a thin airfoil near the stall |

So $C_p$ can never exceed +1 in incompressible flow (you cannot slow the air below zero), but there is no neat lower limit: at the nose of a thin section near the stall it reaches −6 or less. Negative values are **suction**, positive values **pressure**; aerodynamicists usually plot $-C_p$ upwards so that the suction on the upper surface appears on top.

### Why a coefficient?
At a given angle of attack, the flow pattern round a wing does not depend on speed (as long as the [[reynolds-number|Reynolds]] and [[mach-number|Mach numbers]] stay in the same range). Double the speed and every pressure difference quadruples — but so does $q_\\infty$, and $C_p$ is unchanged. One set of $C_p$ values, measured on a model in a [[wind-tunnel|wind tunnel]] at 30 m/s, gives the pressures on the full-size wing at 70 m/s.

A concrete number: at 60 m/s at sea level $q_\\infty = 2205$ Pa. A point with $C_p = -1.2$ sits $1.2 \\times 2205 = 2.6$ kPa below the ambient pressure — 2.6 % of an atmosphere.

### Measuring it
Small holes (*pressure taps*) drilled square into the surface feel the local static pressure; tubes carry it to a manometer or electronic scanner that reads $p - p_\\infty$ against a reference from the tunnel's static probe, while a [[pitot-tube|pitot-static tube]] gives $q_\\infty$. Modern tunnels also paint models with pressure-sensitive paint, whose glow changes with the local oxygen pressure (see [[force-balance]]).

### At higher speed
When the flow becomes compressible, pressure changes grow faster than $q$. For thin sections below the speed of sound, the Prandtl–Glauert rule scales the low-speed values:

$$C_p = \\frac{C_{p,0}}{\\sqrt{1 - M_\\infty^2}}$$

At $M_\\infty = 0.6$ every $C_p$ is 25 % larger than at low speed. The suction peak is where the local flow first reaches the speed of sound — the [[critical-mach|critical Mach number]].

> [!tip] The same coefficient describes wind on buildings: roof edges and corners see $C_p$ of −1 to −3 in a storm, which is why roofs are lifted off rather than pushed in (see [[wind-loads]]).
`,
  ideas: [
    'C_p = (p − p∞)/(½ρV∞²): the local pressure above the free-stream pressure, measured in dynamic pressures.',
    'In low-speed flow C_p = 1 − (V/V∞)²: +1 at a stagnation point, 0 at free-stream speed, negative where the air runs faster (suction).',
    'C_p does not change with speed at a given angle of attack, so model measurements scale directly to full size.',
    'Compressibility magnifies pressure coefficients by about 1/√(1 − M²) below the speed of sound.'
  ],
  pitfalls: [
    'A negative pressure coefficient means a vacuum — It only means the pressure is below the free-stream pressure; C_p = −1 at 60 m/s is 2 kPa below an atmosphere of 101 kPa.',
    'C_p cannot be less than −1 — Its upper limit is +1 (a stagnation point); negative values have no such limit, and −3 to −6 occur near the nose of a wing at high angle.',
    'Flying twice as fast doubles the pressure coefficients — The coefficients stay the same; the pressure differences they represent grow four times.'
  ],
  formulas: [
    {
      name: 'Pressure coefficient',
      expr: 'Cp = (p - pinf)/(0.5*rho*V^2)', tex: 'C_p = \\dfrac{p - p_\\infty}{\\tfrac12 \\rho V_\\infty^2}',
      vars: {
        Cp: { name: 'pressure coefficient', min: -6, max: 1, signed: true, tex: 'C_p' },
        p: { name: 'local static pressure (absolute)', q: 'pressure', unit: 'kPa', value: 98.68, min: 60, max: 110 },
        pinf: { name: 'free-stream static pressure (absolute)', q: 'pressure', unit: 'kPa', value: 101.325, min: 60, max: 105, tex: 'p_\\infty' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, min: 0.3, max: 1.35, tex: '\\rho' },
        V: { name: 'free-stream speed', q: 'speed', unit: 'm/s', value: 60, tex: 'V_\\infty' }
      },
      note: 'Only the difference p − p∞ matters, so gauge readings against the free-stream static pressure work as well as absolute ones.',
      practice: { unknowns: ['Cp', 'p', 'V'] },
      stories: {
        Cp: 'A pressure tap on a wing flying at {V} reads {p} while the free-stream static pressure is {pinf} (air density {rho}). What is the pressure coefficient there?',
        p: 'A point on a wing flying at {V} through air of density {rho} and static pressure {pinf} has a pressure coefficient of {Cp}. What is the pressure there?'
      }
    },
    {
      name: 'Pressure coefficient from the local speed (low speed)',
      expr: 'Cp = 1 - (Vl/V)^2', tex: 'C_p = 1 - \\left(\\dfrac{V}{V_\\infty}\\right)^2',
      vars: {
        Cp: { name: 'pressure coefficient', min: -6, max: 1, signed: true, tex: 'C_p' },
        Vl: { name: 'local speed just outside the surface', q: 'speed', unit: 'm/s', value: 80, tex: 'V' },
        V: { name: 'free-stream speed', q: 'speed', unit: 'm/s', value: 60, tex: 'V_\\infty' }
      },
      note: 'Bernoulli\'s equation for incompressible flow, outside the boundary layer (the pressure passes through the thin boundary layer unchanged).',
      stories: { Cp: 'Just outside the surface of a wing flying at {V} the air moves at {Vl}. What is the pressure coefficient?', Vl: 'A point on a wing flying at {V} has a pressure coefficient of {Cp}. How fast is the air moving just outside the surface there?' }
    },
    {
      name: 'Prandtl–Glauert compressibility correction',
      expr: 'Cp = Cp0/sqrt(1 - M^2)', tex: 'C_p = \\dfrac{C_{p,0}}{\\sqrt{1 - M_\\infty^2}}',
      vars: {
        Cp: { name: 'pressure coefficient at Mach M∞', min: -10, max: 2, signed: true, tex: 'C_p' },
        Cp0: { name: 'low-speed pressure coefficient', value: -0.8, min: -3, max: 0.6, signed: true, tex: 'C_{p,0}' },
        M: { name: 'free-stream Mach number', value: 0.6, min: 0, max: 0.95, tex: 'M_\\infty' }
      },
      note: 'For thin sections at small angles, while the flow stays below the speed of sound everywhere; it fails as the local flow nears Mach 1.',
      stories: { Cp: 'A point on a thin wing has C_p = {Cp0} at low speed. What is its pressure coefficient at Mach {M}?' }
    }
  ],
  examples: [
    {
      title: 'From the wind tunnel to the full-size wing',
      q: 'A model in a tunnel running at 30 m/s (sea-level air) has a tap reading 820 Pa below the tunnel static pressure. What is $C_p$, and what would the pressure be on the full-size wing at 70 m/s?',
      steps: [
        'Tunnel dynamic pressure: $q = \\tfrac12 \\times 1.225 \\times 30^2 = 551$ Pa.',
        '$C_p = -820/551 = -1.49$.',
        'Full size: $q = \\tfrac12 \\times 1.225 \\times 70^2 = 3001$ Pa, so $p - p_\\infty = -1.49 \\times 3001 = -4470$ Pa.'
      ],
      a: 'C_p ≈ −1.49; about 4.5 kPa below ambient on the full-size wing.'
    },
    {
      title: 'The speed at a suction peak',
      q: 'The suction peak on a NACA 2412 at 4° has $C_p = -1.44$ (panel method). How fast is the air there when the wing flies at 60 m/s?',
      steps: [
        'From $C_p = 1 - (V/V_\\infty)^2$: $V = V_\\infty\\sqrt{1 - C_p} = 60\\sqrt{2.44}$.',
        '$V = 60 \\times 1.562 = 93.7$ m/s — more than half as fast again as the aircraft.'
      ],
      a: 'About 94 m/s.'
    }
  ],
  quiz: [
    { q: 'A point where $C_p = 1$ is…', choices: ['a stagnation point, where the air is brought to rest', 'a point of maximum suction', 'a point where the air moves at free-stream speed', 'impossible in low-speed flow'], a: 0,
      why: 'C_p = 1 − (V/V∞)² = 1 only when V = 0: the stagnation point near the leading edge, where the full dynamic pressure is recovered.' },
    { q: 'Where $C_p = 0$ on a wing in low-speed flow, the air moves at the free-stream speed.', a: true,
      why: 'C_p = 0 means p = p∞, and by Bernoulli the local speed then equals V∞.' },
    { q: 'Just outside the surface the air moves at 1.5 times the free-stream speed. What is $C_p$ there?', answer: -1.25, tol: 0.02,
      why: 'C_p = 1 − 1.5² = 1 − 2.25 = −1.25.' },
    { q: 'An aircraft doubles its speed at the same angle of attack. The pressure coefficients on its wing…', choices: ['double', 'quadruple', 'stay the same, while the pressure differences quadruple', 'halve'], a: 2,
      why: 'The flow pattern is the same, so C_p is the same; p − p∞ = C_p·½ρV² grows with V², four times.' },
    { q: 'Can a pressure coefficient be lower than −1?', choices: ['No, −1 is the lowest possible value', 'Yes — whenever the local speed exceeds √2 times the free stream', 'Only in supersonic flow', 'Only inside a vacuum chamber'], a: 1,
      why: 'C_p = 1 − (V/V∞)² < −1 when V/V∞ > √2 ≈ 1.41, which happens routinely near the nose of a lifting wing.' }
  ],
  problems: [
    { q: 'A wing flies at 50 m/s at sea level (ρ = 1.225 kg/m³). By how many pascals is the pressure below ambient at a point where $C_p = -2$?', answer: 3062, unit: 'Pa', tol: 0.02,
      steps: ['$q = \\tfrac12 \\times 1.225 \\times 50^2 = 1531$ Pa.', '$p - p_\\infty = C_p q = -2 \\times 1531 = -3062$ Pa: 3.06 kPa below ambient.'] },
    { q: 'At low speed a point on a thin wing has $C_p = -0.6$. Estimate its pressure coefficient at Mach 0.7.', answer: -0.84, tol: 0.02,
      steps: ['$\\sqrt{1 - 0.7^2} = \\sqrt{0.51} = 0.714$.', '$C_p = -0.6/0.714 = -0.84$.'] }
  ],
  applications: ['Pressure-tap and pressure-sensitive-paint measurements in wind tunnels.', 'Comparing CFD with experiment, point by point along a surface.', 'Wind loads on buildings, roofs, bridges and cars.', 'Locating static ports on aircraft where the local pressure equals the free-stream pressure (C_p ≈ 0).'],
  sim: { id: 'foil-lift-mechanism', params: { show: 'field' } }
},

{
  id: 'pressure-distribution', parent: 'airfoil-basics', title: 'Pressure distribution on an airfoil', level: 2,
  short: 'The plot of pressure coefficient along the upper and lower surfaces is an airfoil\'s signature: a stagnation point at the nose, a suction peak just behind it, a long climb back towards the trailing edge. The area between the two curves is the lift; the steepness of the climb decides the stall.',
  keywords: ['pressure distribution', 'Cp plot', 'suction peak', 'pressure recovery', 'adverse pressure gradient', 'favourable pressure gradient', 'stagnation point', 'loading', 'roof-top', 'upper surface', 'lower surface'],
  prereq: ['pressure-coefficient', 'how-lift-works', 'boundary-layer'],
  related: ['flow-separation', 'stall', 'center-of-pressure', 'special-airfoils', 'critical-mach', 'panel-methods', 'force-balance', 'thin-airfoil-theory'],
  body: `
Plot the [[pressure-coefficient|pressure coefficient]] along the chord, upper and lower surfaces separately, and you get the most informative picture in airfoil aerodynamics. By convention $-C_p$ is plotted upwards, so the upper-surface suction sits on top.

### Anatomy of a C_p plot
For a NACA 2412 at 4° (panel method):

| $x/c$ | 0.01 | 0.05 | 0.1 | 0.2 | 0.3 | 0.5 | 0.7 | 0.9 |
|---|---|---|---|---|---|---|---|---|
| upper $C_p$ | −1.44 | −1.32 | −1.16 | −1.00 | −0.84 | −0.58 | −0.34 | −0.07 |
| lower $C_p$ | +0.89 | +0.33 | +0.16 | +0.09 | +0.08 | +0.08 | +0.10 | +0.15 |

- **The stagnation point** ($C_p = +1$) sits just under the nose on the lower surface. All the air above it goes over the top.
- **The suction peak** is just behind the nose on the upper surface, where the air accelerates hardest round the leading edge — here $C_p = -1.44$, air at 1.56 times the free-stream speed.
- **The pressure recovery**: from the peak the pressure rises steadily all the way to the trailing edge. Rising pressure in the direction of flow is an **adverse pressure gradient**, and it is uphill work for the slow air in the [[boundary-layer|boundary layer]].
- **The lower surface** stays close to free-stream pressure, a little above it: a gentle push.
- **The trailing edge**: upper and lower pressures meet (the [[kutta-condition|Kutta condition]]); a real, viscous flow closes them near $C_p \\approx +0.1$ to +0.2.

### Reading the lift off the plot
The vertical gap between the lower-surface and upper-surface curves is the local **load**, $C_{p,\\ell} - C_{p,u}$; its average along the chord is (at small angles) the lift coefficient:

$$c_l \\approx \\frac{1}{c}\\int_0^c \\left(C_{p,\\ell} - C_{p,u}\\right) dx = \\overline{C_{p,\\ell}} - \\overline{C_{p,u}}$$

For the 2412 at 4° the upper surface contributes about 0.59 and the lower 0.14 of the total 0.73: four-fifths of the lift is suction. Where along the chord the load sits sets the [[center-of-pressure|centre of pressure]] and the [[pitching-moment|pitching moment]].

### How the plot changes
- **With angle of attack** the suction peak grows fast and moves towards the nose: on the 2412 it is −0.57 at 19 % chord at 0°, −1.44 at 1 % at 4°, and −4.0 right at the nose at 8°. The recovery behind it becomes steeper and steeper.
- **With camber** the load spreads along the chord and the nose peak is smaller for the same lift: at $c_l = 0.8$ a NACA 0012 needs 6.6° and a peak of $C_p = -3.1$, a NACA 4412 only 2.3° and a peak of −1.0.
- **With thickness** the peak is lower and broader: at 4°, a 6 % section peaks at −3.1 right at the nose, an 18 % section at −1.4 at 4 % chord.

### Why the shape matters
The boundary layer must climb from the suction peak back to trailing-edge pressure. The higher and sharper the peak, the harder the climb, until the layer separates and the airfoil [[stall|stalls]]. So designers shape the distribution on purpose:
- sections for **high lift** keep the peak low and spread the load (camber, flaps, slats — see [[high-lift-devices]]);
- **laminar** sections keep the pressure falling over the front half (a *favourable* gradient) so the boundary layer stays laminar and drag stays low;
- **supercritical** sections flatten the upper-surface suction into a long "roof-top", so the air that goes supersonic does so gently and ends in a weak shock (see [[special-airfoils]]).

> [!key] Lift is the area between the curves; the stall is written in the slope of the upper curve behind its peak.
`,
  ideas: [
    'A C_p plot shows suction (−C_p up) along the upper and lower surfaces: stagnation point at the nose, suction peak just behind it, pressure recovery to the trailing edge.',
    'The area between the lower- and upper-surface curves is the lift coefficient; on a typical section about 80 % of it is upper-surface suction.',
    'Raising the angle of attack makes the suction peak taller and moves it towards the nose, steepening the pressure recovery.',
    'The adverse pressure gradient behind the peak is what the boundary layer must survive; when it cannot, the flow separates and the airfoil stalls.',
    'Airfoil design is the art of shaping this distribution: low peaks for high lift, long favourable gradients for laminar flow, flat roof-tops for high Mach numbers.'
  ],
  pitfalls: [
    'The lower surface does most of the lifting — On a typical airfoil the lower surface is close to free-stream pressure; most of the lift is suction on the upper surface.',
    'The lowest pressure is at the thickest point of the airfoil — At any useful angle of attack the suction peak is near the leading edge, where the air turns round the nose; only at small angles on thick sections does it sit near the thickest point.',
    'A bigger suction peak is always better because it means more lift — The lift is the area under the whole curve. A sharp, tall peak buys little area and makes the recovery steeper, bringing the stall closer.'
  ],
  formulas: [
    {
      name: 'Lift from the chord-averaged pressures',
      expr: 'cl = Cpl - Cpu', tex: 'c_l \\approx C_{p,\\ell} - C_{p,u}\\quad\\text{(chord averages)}',
      vars: {
        cl: { name: 'section lift coefficient (normal force)', signed: true, tex: 'c_l' },
        Cpl: { name: 'lower-surface C_p averaged along the chord', value: 0.12, signed: true, tex: 'C_{p,\\ell}' },
        Cpu: { name: 'upper-surface C_p averaged along the chord', value: -0.62, signed: true, tex: 'C_{p,u}' }
      },
      note: 'Strictly this is the normal-force coefficient; at the small angles of normal flight it equals the lift coefficient within a per cent or so.',
      stories: { cl: 'Pressure taps on a model give a chord-averaged C_p of {Cpu} on the upper surface and {Cpl} on the lower. What is the lift coefficient?' }
    },
    {
      name: 'Load on a flat plate (thin-airfoil theory)',
      expr: 'dCp = 4*alpha*sqrt((1 - xi)/xi)', tex: '\\Delta C_p = 4\\alpha\\sqrt{\\dfrac{1 - \\xi}{\\xi}}',
      vars: {
        dCp: { name: 'load C_p,lower − C_p,upper', signed: true, tex: '\\Delta C_p' },
        alpha: { name: 'angle of attack', q: 'angle', unit: '°', value: 4, min: -10, max: 15, signed: true, tex: '\\alpha' },
        xi: { name: 'position along the chord, ξ = x/c', value: 0.25, min: 0.001, max: 1, tex: '\\xi' }
      },
      note: 'The angle-of-attack part of every thin airfoil\'s load: infinite at the leading edge, zero at the trailing edge, centred on the quarter chord. Camber adds a load of its own (see thin-airfoil theory).',
      stories: { dCp: 'A thin flat plate meets the air at {alpha}. What is the pressure difference coefficient across it at {xi} of the chord?' }
    },
    {
      name: 'Speed at the suction peak',
      expr: 'Vmax = V*sqrt(1 - Cpmin)', tex: 'V_{\\max} = V_\\infty\\sqrt{1 - C_{p,\\min}}',
      vars: {
        Vmax: { name: 'fastest local speed on the surface', q: 'speed', unit: 'm/s', tex: 'V_{\\max}' },
        V: { name: 'free-stream speed', q: 'speed', unit: 'm/s', value: 60, tex: 'V_\\infty' },
        Cpmin: { name: 'lowest pressure coefficient (the suction peak)', value: -1.44, min: -20, max: 1, signed: true, tex: 'C_{p,\\min}' }
      },
      note: 'Low-speed Bernoulli. At high speed this is where the flow first reaches Mach 1 — see the critical Mach number.',
      stories: { Vmax: 'A wing flying at {V} has a suction peak of C_p = {Cpmin}. How fast is the air at the peak?' }
    }
  ],
  examples: [
    {
      title: 'Lift from pressure taps',
      q: 'A 0.3 m chord model in a tunnel at $q_\\infty = 1.5$ kPa has chord-averaged pressure coefficients of −0.62 on the upper surface and +0.12 on the lower. Find $c_l$ and the lift per metre of span.',
      steps: [
        '$c_l \\approx \\overline{C_{p,\\ell}} - \\overline{C_{p,u}} = 0.12 - (-0.62) = 0.74$.',
        '$L\' = q_\\infty c\\, c_l = 1500 \\times 0.3 \\times 0.74 = 333$ N per metre of span.',
        'The upper surface supplies $0.62/0.74 = 84$ % of it.'
      ],
      a: 'c_l ≈ 0.74 and about 330 N per metre, mostly from the upper-surface suction.'
    },
    {
      title: 'The flat-plate load at the quarter chord',
      q: 'A thin flat plate meets the air at 4°. What is the load $\\Delta C_p$ at 25 % and at 75 % of the chord?',
      steps: [
        '$\\alpha = 4° = 0.0698$ rad, so $4\\alpha = 0.279$.',
        'At $\\xi = 0.25$: $\\sqrt{0.75/0.25} = 1.732$, so $\\Delta C_p = 0.484$.',
        'At $\\xi = 0.75$: $\\sqrt{0.25/0.75} = 0.577$, so $\\Delta C_p = 0.161$ — three times smaller. The load crowds towards the nose.'
      ],
      a: '0.48 at the quarter chord, 0.16 at three quarters.'
    }
  ],
  quiz: [
    { q: 'At a positive angle of attack, where is the stagnation point?', choices: ['exactly at the leading edge', 'slightly below the leading edge, on the lower surface', 'on the upper surface near the nose', 'at the trailing edge'], a: 1,
      why: 'The oncoming air meets the tilted airfoil a little below the nose; the air above the stagnation point turns round the leading edge and races over the top, creating the suction peak.' },
    { q: 'On a $-C_p$ plot, the area between the upper-surface and lower-surface curves is…', choices: ['the drag coefficient', 'the lift (normal-force) coefficient', 'the pitching moment', 'the Reynolds number'], a: 1,
      why: 'The load C_p,ℓ − C_p,u integrated along the chord (in chord lengths) is the normal-force coefficient, which at small angles is the lift coefficient.' },
    { q: 'As the angle of attack rises, the suction peak…', choices: ['shrinks and moves back', 'grows and moves towards the leading edge', 'stays the same size but moves back', 'disappears'], a: 1,
      why: 'More angle means the air must turn more sharply round the nose. On a NACA 2412 the peak goes from −0.6 at 0° to −4 at 8°, moving from about 20 % chord to the nose.' },
    { q: 'On a cambered airfoil in cruise, the lower surface carries a strong positive pressure over most of the chord.', a: false,
      why: 'Apart from the region near the stagnation point, the lower-surface pressure is close to free stream (C_p about +0.1 on a 2412 at 4°). The upper surface does most of the work.' },
    { q: 'Which part of the pressure distribution is hardest on the boundary layer?', choices: ['the stagnation region', 'the recovery behind the suction peak, where pressure rises towards the trailing edge', 'the lower surface', 'the free stream'], a: 1,
      why: 'Rising pressure in the flow direction (an adverse gradient) slows the air near the wall further; if the rise is too steep the layer separates — the start of the stall.' }
  ],
  problems: [
    { q: 'A wing flies at 70 m/s. Its suction peak has $C_p = -2.2$. How fast is the air at the peak?', answer: 125.2, unit: 'm/s', tol: 0.02,
      steps: ['$V_{\\max} = V_\\infty\\sqrt{1 - C_{p,\\min}} = 70\\sqrt{3.2} = 70 \\times 1.789 = 125$ m/s.'] }
  ],
  applications: ['Airfoil design: modern sections are designed by specifying the pressure distribution and computing the shape that gives it (inverse design).', 'Wind-tunnel testing with pressure taps and pressure-sensitive paint.', 'Judging how close a wing is to stalling, or to shock formation at high speed.', 'Loads for structural design: the pressure distribution is the wing\'s load case.'],
  sim: 'foil-cp-compare'
},

{
  id: 'kutta-condition', parent: 'airfoil-basics', title: 'The Kutta condition', level: 2,
  short: 'Frictionless flow round an airfoil has a solution for every value of circulation, and so for every value of lift. The Kutta condition picks the one real flow: the air must leave the sharp trailing edge smoothly. Nature enforces it by shedding a starting vortex when the wing starts to move.',
  keywords: ['Kutta condition', 'trailing edge', 'circulation', 'starting vortex', 'Kelvin\'s theorem', 'bound vortex', 'stagnation point', 'Joukowski airfoil', 'Wagner function', 'Kutta–Joukowski', 'Chaplygin'],
  prereq: ['how-lift-works', 'potential-flow-basics', 'vorticity-circulation', 'kutta-joukowski'],
  related: ['thin-airfoil-theory', 'panel-methods', 'cylinder-flow', 'magnus-effect', 'dalembert-paradox', 'wingtip-vortices', 'insect-flight'],
  body: `
Take the frictionless ([[potential-flow-basics|potential]]) flow round an airfoil. The equations are linear, and you may add to any solution a pure circulation — a flow going round the airfoil — without breaking them. So there is not one potential flow round an airfoil but a whole family, one for every value of the circulation $\\Gamma$, and by the [[kutta-joukowski|Kutta–Joukowski theorem]] ($L' = \\rho V_\\infty\\Gamma$) one for every value of lift. Potential flow alone cannot say how much an airfoil lifts.

### What goes wrong with the wrong circulation
With **no** circulation, the rear stagnation point sits on the upper surface, a little ahead of the trailing edge, and the air from the lower surface must whip round the sharp edge to reach it. Round a sharp corner, potential flow predicts **infinite speed** — and an infinitely low pressure. With **too much** circulation the same thing happens the other way round, with the stagnation point on the lower surface. Only one value avoids it.

### The condition
> [!key] **Kutta condition:** the circulation takes the value for which the flow leaves the sharp trailing edge smoothly, with finite speed.

Equivalent forms: the rear stagnation point sits on the trailing edge (for an edge of finite angle, which is then a stagnation point); the upper and lower flows leave with equal speeds and equal pressures (for a cusped edge). For a thin airfoil the result is

$$\\Gamma = \\pi c V_\\infty (\\alpha - \\alpha_0)$$

which, through $L' = \\rho V_\\infty \\Gamma$, is the famous $c_l = 2\\pi(\\alpha - \\alpha_0)$ of [[thin-airfoil-theory]]. For the exact Joukowski airfoils (a circle mapped into an airfoil shape; see the simulation) it is $\\Gamma = 4\\pi R V_\\infty \\sin(\\alpha + \\beta)$.

### How the air finds it: the starting vortex
The real reason is viscosity. Start a wing from rest: for an instant the flow is the circulation-free one, with air whipping round the trailing edge. The boundary layer cannot follow such a sharp turn; it separates and rolls up into a **starting vortex** that the wing leaves behind. By Kelvin's circulation theorem the total circulation of the fluid, zero at the start, stays zero — so the wing must now carry an equal and opposite *bound* circulation. The starting vortex keeps growing and being shed until the rear stagnation point has moved onto the trailing edge; then the flow leaves smoothly and nothing more is shed.

It takes a little time. After a sudden start the lift jumps at once to **half** its final value and creeps up the rest of the way as the starting vortex recedes (Wagner's result): about 90 % after the wing has travelled some **six chord lengths**. For a 1.5 m chord at 50 m/s, that is a fifth of a second.

### Where it holds, and where it does not
- It holds remarkably well for attached flow at normal angles; it is why inviscid methods predict lift at all. Every [[panel-methods|panel method]] applies it, usually by making the flow speeds on the two panels at the trailing edge equal — the calculation behind the [airfoil lab](#/tools/airfoil).
- Real, viscous flow meets it only approximately: the boundary layers thicken towards the trailing edge, so the real circulation — and lift — is some 5–15 % below the inviscid value.
- It fails when the flow separates (the [[stall]]), at a thick blunt trailing edge, and in fast unsteady motion — insect wings and pitching rotor blades make extra lift from vortices shed at the *leading* edge (see [[insect-flight]]).
- A body with **no** sharp edge — a cylinder or a ball — has no Kutta condition; its circulation, and so its lift, comes from spinning it (the [[magnus-effect|Magnus effect]]).
`,
  ideas: [
    'Potential flow round an airfoil has a solution for every value of circulation, and therefore for every value of lift.',
    'The Kutta condition picks the one in which the flow leaves the sharp trailing edge smoothly, with finite speed.',
    'For a thin airfoil it gives Γ = πcV∞(α − α₀), which is the lift slope of 2π per radian.',
    'Physically, viscosity enforces it: a starting vortex is shed when the wing starts, leaving an equal and opposite circulation bound to the wing (Kelvin\'s theorem).',
    'After a sudden start the lift is half its final value at once and about 90 % after some six chord lengths of travel.'
  ],
  pitfalls: [
    'The equations of frictionless flow determine the lift of an airfoil by themselves — They admit any circulation. The extra condition at the trailing edge, a stand-in for viscosity, is what fixes the lift.',
    'The starting vortex is a small effect that can be ignored — It is the reason the wing has circulation at all: its circulation is equal and opposite to the wing\'s, and it keeps the total zero as Kelvin\'s theorem requires.',
    'The Kutta condition applies to any body — It needs a sharp trailing edge. Round bodies such as a cylinder have no preferred departure point; they only lift when spun (Magnus effect).'
  ],
  formulas: [
    {
      name: 'Circulation set by the Kutta condition (thin airfoil)',
      expr: 'Gamma = pi*c*V*(alpha - alpha0)', tex: '\\Gamma = \\pi c\\, V_\\infty (\\alpha - \\alpha_0)',
      vars: {
        Gamma: { name: 'circulation', unit: 'm²/s', signed: true, tex: '\\Gamma' },
        c: { name: 'chord', q: 'length', unit: 'm', value: 1.5 },
        V: { name: 'free-stream speed', q: 'speed', unit: 'm/s', value: 50, tex: 'V_\\infty' },
        alpha: { name: 'angle of attack', q: 'angle', unit: '°', value: 4, min: -10, max: 15, signed: true, tex: '\\alpha' },
        alpha0: { name: 'zero-lift angle', q: 'angle', unit: '°', value: -2, min: -8, max: 2, signed: true, tex: '\\alpha_0' }
      },
      note: 'Thin-airfoil theory with the Kutta condition. With L\' = ρV∞Γ it gives c_l = 2π(α − α₀).',
      stories: { Gamma: 'A thin section of {c} chord and zero-lift angle {alpha0} flies at {V} and {alpha} angle of attack. What circulation does the Kutta condition give it?' }
    },
    {
      name: 'Kutta circulation of a Joukowski airfoil',
      expr: 'Gamma = 4*pi*R*V*sin(alpha + beta)', tex: '\\Gamma = 4\\pi R\\, V_\\infty \\sin(\\alpha + \\beta)',
      vars: {
        Gamma: { name: 'circulation', unit: 'm²/s', signed: true, tex: '\\Gamma' },
        R: { name: 'radius of the generating circle', q: 'length', unit: 'm', value: 0.4 },
        V: { name: 'free-stream speed', q: 'speed', unit: 'm/s', value: 50, tex: 'V_\\infty' },
        alpha: { name: 'angle of attack (to the chord)', q: 'angle', unit: '°', value: 4, min: -10, max: 15, signed: true, tex: '\\alpha' },
        beta: { name: 'camber angle of the circle (= −α₀)', q: 'angle', unit: '°', value: 4, min: 0, max: 15, tex: '\\beta' }
      },
      note: 'Exact potential flow: a circle of radius R through the point ζ = b is mapped to an airfoil of chord about 4b ≈ 4R by z = ζ + b²/ζ. The Kutta condition puts the circle\'s rear stagnation point on the point that becomes the trailing edge.',
      stories: { Gamma: 'A Joukowski airfoil is made from a circle of radius {R} with a camber angle of {beta}. At {V} and {alpha}, what circulation does the Kutta condition require?' }
    },
    {
      name: 'Lift build-up after a sudden start (Wagner function)',
      expr: 'phi = 1 - 0.165*exp(-0.0455*s) - 0.335*exp(-0.3*s)', tex: '\\phi = 1 - 0.165\\exp(-0.0455\\,s) - 0.335\\exp(-0.3\\,s)',
      vars: {
        phi: { name: 'lift as a fraction of its steady value', q: 'ratio', unit: '%', tex: '\\phi' },
        s: { name: 'distance travelled in half-chords, s = 2V∞t/c', value: 10, min: 0, max: 40 }
      },
      note: 'R. T. Jones\'s fit to Wagner\'s function for a thin airfoil started impulsively. φ = 50 % at s = 0, 90 % near s = 13 (six and a half chords).',
      stories: { phi: 'A thin airfoil started suddenly from rest has travelled {s} half-chords. What fraction of its steady lift has it reached?', s: 'How far, in half-chords, must a suddenly started airfoil travel before its lift reaches {phi} of the steady value?' }
    }
  ],
  examples: [
    {
      title: 'Circulation and lift of a wing section',
      q: 'A thin section of 1.5 m chord with a zero-lift angle of −2° flies at 50 m/s and 4° in sea-level air. Find the circulation the Kutta condition gives it, the lift per metre of span, and $c_l$.',
      steps: [
        '$\\alpha - \\alpha_0 = 6° = 0.1047$ rad.',
        '$\\Gamma = \\pi c V_\\infty(\\alpha - \\alpha_0) = \\pi \\times 1.5 \\times 50 \\times 0.1047 = 24.7$ m²/s.',
        '$L\' = \\rho V_\\infty \\Gamma = 1.225 \\times 50 \\times 24.7 = 1510$ N/m.',
        '$c_l = 2\\Gamma/(V_\\infty c) = 2 \\times 24.7/75 = 0.66$, which is $2\\pi \\times 0.1047$ as it should be.'
      ],
      a: 'Γ ≈ 24.7 m²/s, about 1.5 kN per metre of span, c_l ≈ 0.66.'
    },
    {
      title: 'How quickly lift builds',
      q: 'A 1.5 m chord wing at 50 m/s is suddenly given its angle of attack (a sharp gust, say). How far does it travel, and how long does it take, before its lift reaches 90 % of the steady value?',
      steps: [
        'Wagner (Jones fit): $\\phi = 0.9$ at $s \\approx 12.7$ half-chords.',
        'Half a chord is 0.75 m, so the wing travels $12.7 \\times 0.75 = 9.5$ m — six and a third chord lengths.',
        'At 50 m/s that takes $9.5/50 = 0.19$ s.'
      ],
      a: 'About 9.5 m, or a fifth of a second.'
    }
  ],
  quiz: [
    { q: 'What does the Kutta condition fix?', choices: ['the drag of the airfoil', 'the circulation, and with it the lift', 'the Reynolds number', 'the position of the leading-edge stagnation point only'], a: 1,
      why: 'Among the infinite family of potential flows it selects the one with smooth flow off the trailing edge; that sets Γ, and L\' = ρV∞Γ.' },
    { q: 'In frictionless potential flow, the equations alone determine the lift of an airfoil.', a: false,
      why: 'Any circulation can be added to a potential flow without violating the equations. The Kutta condition — the trace of viscosity — is needed to pick one.' },
    { q: 'When a wing starts moving from rest, what does it leave behind?', choices: ['nothing: lift appears instantly', 'a starting vortex with circulation opposite to the wing\'s', 'a shock wave', 'a region of still air'], a: 1,
      why: 'The starting vortex carries −Γ so that the total circulation stays zero (Kelvin\'s theorem); the wing is left with +Γ bound to it.' },
    { q: 'Right after a sudden start, what fraction of its final lift does a thin airfoil have?', choices: ['0 %', '50 %', '90 %', '100 %'], a: 1,
      why: 'Wagner\'s function starts at one half: the circulation of the wing jumps partly at once, and the rest builds as the starting vortex moves away.' },
    { q: 'Why can a spinning ball swerve, although it has no trailing edge?', choices: ['the Kutta condition acts at its rear point', 'its spin drags the air round and creates circulation directly (Magnus effect)', 'balls cannot swerve in real air', 'the seam acts as a trailing edge'], a: 1,
      why: 'With no sharp edge there is no Kutta condition; a round body gets circulation only by spinning, which drags the boundary layer round and shifts the wake.' }
  ],
  problems: [
    { q: 'A Joukowski airfoil comes from a circle of radius 0.3 m with a camber angle β = 3°. What circulation does the Kutta condition give at 40 m/s and 5°?', answer: 21.0, unit: 'm²/s', tol: 0.02,
      steps: ['$\\Gamma = 4\\pi R V_\\infty \\sin(\\alpha + \\beta) = 4\\pi \\times 0.3 \\times 40 \\times \\sin 8°$.', '$= 150.8 \\times 0.1392 = 21.0$ m²/s.'] }
  ],
  applications: ['Every inviscid method for lift — thin-airfoil theory, panel methods, vortex-lattice codes — applies it at the trailing edge.', 'Unsteady aerodynamics of gusts, flutter and helicopter rotors, where the lift lags the angle by the Wagner and Theodorsen functions.', 'Explaining why sharp trailing edges matter to propeller, fan and turbine blades.'],
  history: 'Martin Kutta assumed smooth flow off the sharp edge of a circular-arc wing in 1902; Nikolai Joukowski used the same idea with his mapped circles in 1906–1910, and Sergei Chaplygin stated it independently — Russian texts call it the Chaplygin–Zhukovsky condition. Ludwig Prandtl and his colleagues filmed and photographed the starting vortex in water channels in the 1920s and 1930s, and Herbert Wagner calculated the build-up of lift after a sudden start in 1925.',
  sim: 'foil-kutta'
},

{
  id: 'naca-airfoils', parent: 'airfoil-basics', title: 'NACA airfoils', level: 2,
  short: 'The NACA airfoil families of the 1930s–40s turned wing sections into a catalogue: a NACA 2412 has 2 % camber at 40 % of the chord and is 12 % thick. Their simple formulas, published test data and clear naming made them the common language of airfoils, still used on aircraft, rotors and turbines.',
  keywords: ['NACA', 'NACA 4-digit', 'NACA 2412', 'NACA 0012', 'NACA 23012', '5-digit', '6-series', 'laminar', 'thickness distribution', 'mean line', 'airfoil catalogue', 'Theory of Wing Sections', 'Eastman Jacobs'],
  prereq: ['airfoil-geometry', 'lift-equation'],
  related: ['special-airfoils', 'thin-airfoil-theory', 'pitching-moment', 'lift-curve', 'wind-tunnel', 'reynolds-effects-airfoil', 'propellers', 'helicopter-rotor'],
  body: `
In 1933 Eastman Jacobs and his colleagues at the NACA (the US National Advisory Committee for Aeronautics, forerunner of NASA) published tests of 78 airfoils built from one recipe, measured in the Variable Density Tunnel at Reynolds numbers close to flight. For the first time a designer could pick a section from a family, knowing how camber and thickness would change its lift, drag and moment. The **four-digit** family from that report is still everywhere.

### Reading four digits
**NACA $MPXX$** — for example **2412**:
- $M = 2$: the maximum camber is 2 % of the chord;
- $P = 4$: it is at 40 % of the chord from the leading edge;
- $XX = 12$: the section is 12 % thick.

A leading **00** means no camber: **0012** is a symmetric 12 % section, the classic tail and rotor-blade section. Every four-digit section has its greatest thickness at 30 % of the chord.

### The recipe
The mean line is two parabolas meeting at the point of greatest camber. Ahead of it,

$$y_c = \\frac{m}{p^2}\\left(2px - x^2\\right) \\quad (x \\le p)$$

and behind it a mirror-image parabola reaching zero at the trailing edge. The thickness is a single polynomial, the same shape for all members, scaled by $t$:

$$y_t = 5t\\left(0.2969\\sqrt{x} - 0.1260x - 0.3516x^2 + 0.2843x^3 - 0.1015x^4\\right)$$

(all lengths in chords). The surfaces lie $y_t$ either side of the mean line, measured perpendicular to it. The $\\sqrt{x}$ term gives the round nose, of radius $1.1019\\,t^2$ — for a 12 % section, 1.6 % of the chord. (Replacing −0.1015 by −0.1036 closes the trailing edge to a point, as computer codes and the simulations here do.)

### The later families
- **Five-digit** (1935), e.g. **23012**: the first digit ×0.15 is the design lift coefficient (0.3), the next two ÷2 the camber position (15 %), the last two the thickness. Moving the camber forward gave a very high $c_{l,\\max}$ and almost no pitching moment — at the price of an abrupt stall.
- **Six-series** (1940s), e.g. **$64_2$-415**: *laminar* sections with the thickest point far back, which keep the boundary layer laminar over the front half and give a "bucket" of low drag: 6 = series, 4 = minimum pressure at 40 % chord, subscript 2 = low drag within ±0.2 of the design $c_l$, 4 = design $c_l$ 0.4, 15 = thickness. See [[special-airfoils]].

| Section | Camber | Thickness | Typical use |
|---|---|---|---|
| 0009, 0012 | none | 9–12 % | tailplanes and fins; classic helicopter rotor blades |
| 2412 | 2 % at 40 % | 12 % | light-aircraft wings (the Cessna 172, for example) |
| 4412, 4415 | 4 % at 40 % | 12–15 % | older light aircraft; standard test cases |
| 23012, 23015 | forward | 12–15 % | many wings of the 1930s–1960s |
| $64_2$-415 and relatives | design $c_l$ 0.4 | 15 % | laminar-flow wings, propellers |

The data for all of them were collected in Abbott and von Doenhoff's *Theory of Wing Sections* (1949), which remains in print. Modern design uses computer-designed sections (Eppler, Wortmann, Selig, NASA's LS and SC families), but the NACA sections are still the benchmark every code is checked against — including the panel method of the [airfoil lab](#/tools/airfoil).

> [!tip] Build any four-digit section in the simulation below, and drag the camber and thickness points to see what each digit does.
`,
  ideas: [
    'NACA MPXX: M = maximum camber in % of chord, P = its position in tenths of the chord, XX = thickness in % of chord; 00XX is symmetric.',
    'The four-digit sections share one thickness shape, thickest at 30 % of the chord, with a nose radius of 1.1019 t².',
    'The mean line is two parabolas meeting at the point of maximum camber.',
    'The five-digit family moved camber forward for high lift and low moment; the six-series pushed the thickest point back for laminar flow.'
  ],
  pitfalls: [
    'The digits of a NACA 2412 are all percentages — The first is camber in per cent of the chord, the second its position in tenths of the chord (4 = 40 %), and only the last two are the thickness in per cent.',
    'The same number means the same thing in every NACA family — The five-digit and six-series codes follow different rules: in a 23012 the "2" sets a design lift coefficient, and in a 64-415 the "6" names the series.',
    'NACA sections are obsolete — Their shapes and data remain the reference cases for tests and codes, and many are still flying on aircraft, rotors and propellers.'
  ],
  formulas: [
    {
      name: 'Thickness distribution of the four-digit sections',
      expr: 'yt = 5*t*(0.2969*sqrt(x) - 0.1260*x - 0.3516*x^2 + 0.2843*x^3 - 0.1015*x^4)', tex: 'y_t = 5t\\left(0.2969\\sqrt{x} - 0.1260x - 0.3516x^2 + 0.2843x^3 - 0.1015x^4\\right)',
      vars: {
        yt: { name: 'half-thickness y_t/c', q: 'ratio', unit: '%', tex: 'y_t' },
        t: { name: 'thickness ratio t/c', q: 'ratio', unit: '%', value: 12, min: 0.5, max: 40 },
        x: { name: 'position along the chord x/c', q: 'ratio', unit: '%', value: 20, min: 0, max: 100 }
      },
      note: 'Lengths in fractions of the chord. The half-thickness is laid off perpendicular to the mean line, on both sides. Largest (t/2) at x = 30 %.',
      practice: { unknowns: ['yt', 't'] },
      stories: { yt: 'How far is the surface of a {t} thick four-digit section from its mean line at {x} of the chord?', t: 'A four-digit section has a half-thickness of {yt} of the chord at {x} of the chord. How thick is it?' }
    },
    {
      name: 'Mean line ahead of the maximum camber',
      expr: 'yc = m/p^2*(2*p*x - x^2)', tex: 'y_c = \\dfrac{m}{p^2}\\left(2px - x^2\\right)',
      vars: {
        yc: { name: 'height of the mean line y_c/c', q: 'ratio', unit: '%', tex: 'y_c' },
        m: { name: 'maximum camber m/c', q: 'ratio', unit: '%', value: 2, min: 0.1, max: 9.5 },
        p: { name: 'position of the maximum camber p/c', q: 'ratio', unit: '%', value: 40, min: 30, max: 60 },
        x: { name: 'position along the chord x/c (ahead of p)', q: 'ratio', unit: '%', value: 20, min: 0, max: 30 }
      },
      note: 'Valid for x ≤ p; behind p the mean line is m/(1−p)²·(1 − 2p + 2px − x²).',
      practice: { unknowns: ['yc', 'm'] },
      stories: { yc: 'A four-digit section has {m} camber at {p} of the chord. How high is its mean line at {x}?' }
    },
    {
      name: 'Nose radius of a four-digit section',
      expr: 'r = 1.1019*t^2*c', tex: 'r = 1.1019\\, t^2 c',
      vars: {
        r: { name: 'leading-edge radius', q: 'length', unit: 'mm' },
        t: { name: 'thickness ratio t/c', q: 'ratio', unit: '%', value: 12, min: 0.5, max: 40 },
        c: { name: 'chord', q: 'length', unit: 'm', value: 1.5 }
      },
      note: 'The nose radius grows with the square of the thickness: thin sections have sharp noses and stall abruptly, thick ones blunt noses and gentler stalls.',
      stories: { r: 'What is the nose radius of a {t} thick four-digit section with a chord of {c}?' }
    },
    {
      name: 'Cross-section area of a four-digit section',
      expr: 'A = 0.685*t*c^2', tex: 'A = 0.685\\, t\\, c^2',
      vars: {
        A: { name: 'area of the cross-section', q: 'area', unit: 'm²' },
        t: { name: 'thickness ratio t/c', q: 'ratio', unit: '%', value: 12, min: 0.5, max: 40 },
        c: { name: 'chord', q: 'length', unit: 'm', value: 1.5 }
      },
      note: 'Integral of the thickness distribution (0.681 with the closed-trailing-edge coefficient). Useful for fuel volume and weight estimates.',
      stories: { A: 'What is the cross-section area of a {t} thick four-digit section of chord {c}?', c: 'A four-digit section {t} thick has a cross-section area of {A}. What is its chord?' }
    }
  ],
  examples: [
    {
      title: 'Where is the surface of a NACA 4415?',
      q: 'Find the height of the mean line and the half-thickness of a NACA 4415 at 20 % of the chord, and hence roughly where its upper and lower surfaces are.',
      steps: [
        'Decode: $m = 0.04$, $p = 0.4$, $t = 0.15$.',
        'Mean line ($x \\le p$): $y_c = \\frac{0.04}{0.16}(2 \\times 0.4 \\times 0.2 - 0.04) = 0.25 \\times 0.12 = 0.030$.',
        'Half-thickness: the bracket at $x = 0.2$ is $0.1328 - 0.0252 - 0.0141 + 0.0023 - 0.0002 = 0.0956$, so $y_t = 5 \\times 0.15 \\times 0.0956 = 0.0717$.',
        'Surfaces (ignoring the small tilt of the mean line): upper $0.030 + 0.072 = 0.102$, lower $0.030 - 0.072 = -0.042$ chords.'
      ],
      a: 'Mean line 3.0 % of the chord up, half-thickness 7.2 %: upper surface at about +10.2 %, lower at −4.2 %.'
    },
    {
      title: 'Room for fuel',
      q: 'A wing has a NACA 2412 section with a 2 m chord. What is the area of the section, and how many litres would a metre of span hold if 55 % of that area were a fuel tank between the spars?',
      steps: [
        '$A = 0.685 \\times 0.12 \\times 2^2 = 0.329$ m².',
        'Tank: $0.55 \\times 0.329 = 0.181$ m³ per metre of span = 181 litres.'
      ],
      a: 'About 0.33 m² of section and roughly 180 litres of fuel per metre of span.'
    }
  ],
  quiz: [
    { q: 'A NACA 0015 section is…', choices: ['symmetric and 15 % thick', 'cambered 1.5 % and very thin', '15 % cambered', 'a five-digit section'], a: 0,
      why: '00 means no camber; the last two digits give the thickness, 15 % of the chord.' },
    { q: 'In a NACA 6412, where is the maximum camber?', choices: ['6 % of the chord from the leading edge', '40 % of the chord from the leading edge', '12 % of the chord', 'at the thickest point'], a: 1,
      why: 'The second digit is the position in tenths of the chord: 4 → 40 %. The 6 is the size of the camber (6 % of the chord).' },
    { q: 'How thick, in millimetres, is a NACA 2418 section with a 2 m chord?', answer: 360, unit: 'mm', tol: 0.02,
      why: '18 % of 2000 mm = 360 mm.' },
    { q: 'Every NACA four-digit section is thickest at 30 % of the chord.', a: true,
      why: 'They all share one thickness distribution, scaled only by t; its maximum is at x = 0.30.' },
    { q: 'In the five-digit NACA 23012, what does "230" tell you?', choices: ['23 % camber at 0 % chord', 'a design lift coefficient of 0.3 with the camber at 15 % of the chord', 'a thickness of 23 %', 'a Reynolds number of 230 000'], a: 1,
      why: '2 × 0.15 = 0.3 is the design c_l; 30/2 = 15 % is the camber position. The last two digits, 12, are the thickness.' }
  ],
  problems: [
    { q: 'What is the nose radius of a NACA 0009 tail section with a 0.8 m chord?', answer: 7.14, unit: 'mm', tol: 0.02,
      steps: ['$r = 1.1019 \\times 0.09^2 \\times 0.8 = 1.1019 \\times 0.0081 \\times 0.8$.', '$= 0.00714$ m = 7.1 mm.'] },
    { q: 'At what height above the chord (as % of the chord) is the mean line of a NACA 2412 at 10 % of the chord?', answer: 0.875, unit: '%', tol: 0.02,
      steps: ['$y_c = \\frac{0.02}{0.16}(2 \\times 0.4 \\times 0.1 - 0.01) = 0.125 \\times 0.07 = 0.00875$.', 'That is 0.875 % of the chord.'] }
  ],
  applications: ['Wings and tails of light aircraft, many still with NACA four- and five-digit sections.', 'Rotor blades (0012 and its descendants), propellers and fans.', 'Test cases for wind tunnels, panel methods and CFD codes.', 'Student projects and small wind turbines, where published data make design straightforward.'],
  history: 'The NACA\'s Variable Density Tunnel at Langley, in service from 1923, could be pressurised to 20 atmospheres so that small models reached flight Reynolds numbers. Eastman Jacobs, Kenneth Ward and Robert Pinkerton\'s 1933 report on 78 related sections produced the four-digit family; the five-digit sections followed in 1935 and the laminar six-series in the early 1940s. Ira Abbott and Albert von Doenhoff gathered the results into "Theory of Wing Sections" in 1949.',
  sim: { id: 'foil-naca-builder', params: { code: '4415' } }
},

/* ================================================================ AIRFOIL BEHAVIOUR */
{
  id: 'lift-curve', parent: 'airfoil-behaviour', title: 'The lift curve', level: 1,
  short: 'Plot lift coefficient against angle of attack and you get an airfoil\'s lift curve: a straight line of slope about 0.1 per degree, crossing zero at the zero-lift angle (negative for cambered sections), bending over near 12–16° to a maximum, then falling at the stall.',
  keywords: ['lift curve', 'lift slope', 'lift-curve slope', 'CL alpha', 'zero-lift angle', 'maximum lift coefficient', 'CLmax', 'stall angle', 'linear range', 'finite wing', 'aspect ratio'],
  prereq: ['lift-equation', 'airfoil-geometry', 'force-coefficients'],
  related: ['stall', 'thin-airfoil-theory', 'lifting-line', 'aspect-ratio', 'high-lift-devices', 'reynolds-effects-airfoil', 'drag-polar', 'pitching-moment'],
  body: `
Measure the lift of a wing section in a [[wind-tunnel|wind tunnel]] at a range of angles and plot $c_l$ against $\\alpha$. Almost every airfoil gives the same shape of curve, and four numbers describe it.

### A straight line…
Over the whole range of normal flight the curve is straight:

$$c_l = a\\,(\\alpha - \\alpha_0)$$

- The **lift-curve slope** $a$: [[thin-airfoil-theory|Thin-airfoil theory]] predicts $2\\pi$ per radian, 0.110 per degree, for any thin section. Thickness raises the inviscid value (by about 10 % for a 12 % section); the boundary layer takes rather more away, and measured sections give **0.100–0.108 per degree**.
- The **zero-lift angle** $\\alpha_0$ is where the line crosses zero. It is 0° for symmetric sections and negative for cambered ones — about −1° per per cent of camber: −2.1° for a 2412, −4.2° for a 4415. A cambered wing lifts at zero angle of attack.

### …bending over to a maximum
Near the top the curve bends as the boundary layer on the upper surface starts to separate from the trailing edge, and at the **stall angle** it reaches **$c_{l,\\max}$**. Beyond that the lift falls — gently or suddenly, depending on how the section stalls (see [[stall]]).

| Section (Re ≈ 6 million) | $\\alpha_0$ | slope per degree | $c_{l,\\max}$ | stall angle | kind of stall |
|---|---|---|---|---|---|
| NACA 0006 | 0° | 0.10 | ≈ 0.9 | ≈ 9° | thin-airfoil |
| NACA 0012 | 0° | 0.105 | ≈ 1.6 | ≈ 16° | leading-edge |
| NACA 2412 | −2.1° | 0.105 | ≈ 1.7 | ≈ 16° | combined |
| NACA 4415 | −4.2° | 0.105 | ≈ 1.6 | ≈ 14° | trailing-edge |

(Rounded values for smooth models; roughness and lower Reynolds numbers reduce $c_{l,\\max}$ — see [[reynolds-effects-airfoil]].) The same happens on the negative side: a symmetric section stalls at about −16°, a cambered one earlier.

### What moves the curve
- **Camber** and **flaps** shift the line up and to the left (more negative $\\alpha_0$) and raise $c_{l,\\max}$, while the stall comes at a slightly *lower* angle ([[high-lift-devices]]).
- **Slats** and vortex generators leave the line where it is but extend it to higher angles.
- **Thickness** changes $c_{l,\\max}$ and the shape of the top (thin sections stall early, thick ones gently).
- **A finite wing** has a smaller slope than its section, because the [[downwash]] from its tips reduces the angle its sections actually see. [[lifting-line|Lifting-line theory]] gives
$$a_w = \\frac{a}{1 + \\dfrac{57.3\\,a}{\\pi e A}}$$
with $a$ per degree, $A$ the [[aspect-ratio|aspect ratio]] and $e$ the span efficiency: a typical light-aircraft wing ($A = 7.5$) has about 0.082 per degree, a sailplane ($A = 25$) about 0.097.

> [!key] The pilot flies the lift curve. At a given weight every speed needs its own $C_L$ ([[lift-equation]]); the elevator sets $\\alpha$ to deliver it, and the top of the curve is the slowest the aircraft can fly.
`,
  ideas: [
    'Below the stall, c_l = a(α − α₀): a straight line with a slope of about 0.1 per degree.',
    'Thin-airfoil theory gives 2π per radian (0.110 per degree); real sections measure 0.100–0.108.',
    'Symmetric sections have α₀ = 0; camber makes α₀ negative, about −1° per per cent of camber.',
    'The curve bends over near 12–16° to c_l,max, where the flow separates; flaps shift the curve up and left, slats extend it.',
    'A finite wing has a shallower lift curve than its airfoil because of the downwash from its tips.'
  ],
  pitfalls: [
    'At zero angle of attack a wing makes no lift — A cambered section lifts at zero angle; only symmetric sections have their zero-lift angle at 0°.',
    'Lift keeps rising as long as the angle does — Only up to the stall angle, typically 12–16°. Beyond it the upper-surface flow separates and the lift falls.',
    'A wing has the same lift slope as its airfoil — The tip vortices tilt the flow downwards along the whole span, so a wing of aspect ratio 7–8 has only about three quarters of its section\'s slope.'
  ],
  formulas: [
    {
      name: 'The linear lift curve',
      expr: 'cl = a*(alpha - alpha0)*180/pi', tex: 'c_l = a\\,(\\alpha - \\alpha_0)',
      vars: {
        cl: { name: 'section lift coefficient', signed: true, tex: 'c_l' },
        a: { name: 'lift-curve slope, per degree', value: 0.105, min: 0.08, max: 0.115 },
        alpha: { name: 'angle of attack', q: 'angle', unit: '°', value: 5, min: -12, max: 20, signed: true, tex: '\\alpha' },
        alpha0: { name: 'zero-lift angle', q: 'angle', unit: '°', value: -2.1, min: -12, max: 5, signed: true, tex: '\\alpha_0' }
      },
      note: 'a is per degree (the calculator converts the angles). Valid below the stall. Thin-airfoil theory: a = 0.110 per degree; measured sections 0.100–0.108.',
      practice: { unknowns: ['cl', 'alpha'] },
      stories: {
        cl: 'A section with a zero-lift angle of {alpha0} and a lift slope of {a} per degree meets the air at {alpha}. What is its lift coefficient?',
        alpha: 'A section with a lift slope of {a} per degree and a zero-lift angle of {alpha0} must give c_l = {cl}. At what angle of attack?'
      }
    },
    {
      name: 'From section to wing: lift slope of a finite wing',
      expr: 'aw = a/(1 + 180*a/(pi^2*ew*AR))', tex: 'a_w = \\dfrac{a}{1 + \\dfrac{57.3\\,a}{\\pi e A}}',
      vars: {
        aw: { name: 'lift-curve slope of the wing, per degree', tex: 'a_w' },
        a: { name: 'lift-curve slope of the section, per degree', value: 0.105, min: 0.08, max: 0.115 },
        ew: { name: 'span efficiency factor', value: 0.9, min: 0.6, max: 1, tex: 'e' },
        AR: { name: 'aspect ratio b²/S', value: 7.5, min: 3, max: 40, tex: 'A' }
      },
      note: 'Lifting-line theory for unswept wings of moderate to high aspect ratio (57.3 = 180/π converts the slope to per degree). Low aspect ratios and swept wings need corrections.',
      stories: { aw: 'A wing of aspect ratio {AR} and span efficiency {ew} is built from a section with a lift slope of {a} per degree. What is the lift slope of the wing?' }
    }
  ],
  examples: [
    {
      title: 'Angle of attack for cruise',
      q: 'A light aircraft cruises at $C_L = 0.32$ (see [[lift-equation]]). Its NACA 2412 section has $a = 0.105$ per degree and $\\alpha_0 = -2.1°$; the wing (aspect ratio 7.5, $e = 0.9$) has 0.082 per degree. What angle of attack does (a) the section, (b) the wing need?',
      steps: [
        '(a) Section: $\\alpha = \\alpha_0 + c_l/a = -2.1 + 0.32/0.105 = -2.1 + 3.05 = 0.95°$.',
        '(b) Wing: the zero-lift angle is the same, the slope smaller: $\\alpha = -2.1 + 0.32/0.082 = -2.1 + 3.9 = 1.8°$.',
        'The difference is the downwash angle the tips add, about 0.8° here.'
      ],
      a: 'About 1° for the section, about 1.8° for the wing.'
    },
    {
      title: 'The wing\'s lift slope',
      q: 'Check the 0.082 per degree of the previous example from lifting-line theory.',
      steps: [
        '$57.3\\,a = 57.3 \\times 0.105 = 6.02$ per radian.',
        '$\\pi e A = \\pi \\times 0.9 \\times 7.5 = 21.2$.',
        '$a_w = 0.105/(1 + 6.02/21.2) = 0.105/1.284 = 0.0818$ per degree.'
      ],
      a: 'About 0.082 per degree — 78 % of the section\'s slope.'
    }
  ],
  quiz: [
    { q: 'Thin-airfoil theory predicts a lift-curve slope of…', choices: ['2π per degree', '2π per radian, about 0.11 per degree', '1 per radian', 'π per radian'], a: 1,
      why: 'dc_l/dα = 2π per radian = 2π/57.3 = 0.110 per degree. Real sections measure a little less, 0.10–0.108.' },
    { q: 'A cambered airfoil at zero angle of attack produces lift.', a: true,
      why: 'Its zero-lift angle is negative (−2.1° for a 2412), so at α = 0 it already sits partway up the lift curve: c_l ≈ 0.105 × 2.1 ≈ 0.22.' },
    { q: 'Compared with its airfoil section, the lift curve of a finite wing…', choices: ['is steeper', 'has the same slope but a different zero-lift angle', 'is shallower, with the same zero-lift angle', 'is identical'], a: 2,
      why: 'The downwash from the tip vortices reduces the effective angle along the span, lowering the slope; at zero lift there is no downwash, so the zero-lift angle is unchanged.' },
    { q: 'A section has $a = 0.1$ per degree and $\\alpha_0 = -4°$. What is $c_l$ at 6°?', answer: 1.0, tol: 0.02,
      why: 'c_l = a(α − α₀) = 0.1 × (6 − (−4)) = 0.1 × 10 = 1.0.' },
    { q: 'What bends the lift curve over and sets $c_{l,\\max}$?', choices: ['compressibility', 'separation of the boundary layer from the upper surface', 'the tip vortices', 'the weight of the wing'], a: 1,
      why: 'As the angle grows the adverse pressure gradient behind the suction peak becomes too steep for the boundary layer; it separates, and the lift stops growing — the stall.' }
  ],
  problems: [
    { q: 'A sailplane wing has aspect ratio 30 and span efficiency 0.95, with a section slope of 0.105 per degree. What is the lift slope of the wing, per degree?', answer: 0.0984, tol: 0.02,
      steps: ['$57.3 \\times 0.105 = 6.02$; $\\pi \\times 0.95 \\times 30 = 89.5$.', '$a_w = 0.105/(1 + 6.02/89.5) = 0.105/1.067 = 0.0984$ per degree — 94 % of the section\'s. Long wings lose little.'] },
    { q: 'A NACA 4415 section ($\\alpha_0 = -4.2°$, $a = 0.105$ per degree) must give $c_l = 1.2$. At what angle of attack?', answer: 7.23, unit: '°', tol: 0.02,
      steps: ['$\\alpha = \\alpha_0 + c_l/a = -4.2 + 1.2/0.105 = -4.2 + 11.43 = 7.2°$.'] }
  ],
  applications: ['Choosing the rigging angle of a wing so the fuselage is level in cruise.', 'Stall-warning and angle-of-attack systems, which watch where the wing is on its lift curve.', 'Flight-control design, where the lift slope sets how strongly the aircraft responds to the elevator and to gusts.', 'Wind-turbine and propeller design, where each blade section is held near its best point on the curve.'],
  sim: { id: 'foil-lift-curve', params: { foil: 'mid' } }
},

{
  id: 'stall', parent: 'airfoil-behaviour', title: 'Stall', level: 1,
  short: 'A wing stalls when the angle of attack is so large that the air can no longer follow the upper surface: the boundary layer separates, lift stops growing and then falls, drag soars. It happens at an angle, not at a speed — which is why a wing can stall at any speed in a steep turn or a hard pull.',
  keywords: ['stall', 'stall angle', 'critical angle of attack', 'separation', 'CLmax', 'stall speed', 'accelerated stall', 'leading-edge stall', 'trailing-edge stall', 'thin-airfoil stall', 'separation bubble', 'hysteresis', 'buffet', 'stall warning', 'stick shaker'],
  prereq: ['lift-curve', 'flow-separation', 'boundary-layer'],
  related: ['stall-patterns', 'spins', 'load-factor', 'turning-flight', 'high-lift-devices', 'reynolds-effects-airfoil', 'icing', 'lift-equation', 'retreating-blade', 'flow-control'],
  body: `
As the angle of attack rises, the suction peak near the nose grows and the pressure the air must climb back to at the trailing edge stays the same: the pressure recovery over the upper surface gets steeper. The slow air at the bottom of the [[boundary-layer|boundary layer]] has only its momentum to push against that rising pressure. At some angle it runs out: the layer **separates**, and a region of slow, churning air forms over the upper surface. That is the **stall**.

### What the pilot and the wing notice
- **Lift stops growing and falls.** $c_l$ reaches $c_{l,\\max}$ (1.3–1.7 for most sections, more with flaps) and then drops, by a little or by a third, depending on the section.
- **Drag soars.** The separated wake is wide; section drag can rise from 0.01 to 0.2 or more — twenty-fold.
- **The pitching moment changes**, usually nose-down, as the load moves back.
- **Buffet**: the unsteady wake shakes the wing and the tail.
- **A wing may drop.** If one side stalls first, the lift difference rolls the aircraft; combined with yaw this can start a [[spins|spin]]. Wings are designed so that the root stalls before the tips, which keeps the ailerons working ([[stall-patterns]]).

### An angle, not a speed
The wing stalls at its **critical angle of attack**, about 15–16° for a typical light aircraft wing. The familiar "stall speed" is only the speed at which level, 1-g flight needs that angle:

$$V_s = \\sqrt{\\frac{2W}{\\rho S C_{L,\\max}}}$$

In a turn or a pull-up the wing must carry $n$ times the weight (the [[load-factor|load factor]]), so it reaches the critical angle at a higher speed, $V_s\\sqrt{n}$. A 60° banked level turn needs $n = 2$: the stall speed is 41 % higher. This **accelerated stall** can happen at any airspeed, with the nose pointing anywhere.

### Three ways to stall
Wind-tunnel studies in the 1950s sorted airfoils into three types, depending mainly on thickness and nose radius:
- **Trailing-edge stall** (thick sections, over about 14 %, such as NACA 4415): separation starts at the trailing edge and creeps forward as the angle grows. The top of the lift curve is rounded and the lift falls gently — the friendliest stall.
- **Leading-edge stall** (moderate thickness, 9–14 %, such as NACA 0012 at high Reynolds number): a tiny *laminar separation bubble* sits just behind the nose; at the stall angle it suddenly bursts and the flow separates from the leading edge all at once. $c_{l,\\max}$ is high, but the lift collapses abruptly.
- **Thin-airfoil stall** (thin sections, under about 9 %, such as NACA 0006): a long bubble forms at the sharp nose at modest angles and spreads back as the angle grows; the lift curve bends early and the maximum is low but gentle.

### Hysteresis
Once stalled, a wing does not recover at the angle where it stalled: the separated flow must be brought back, and that needs a lower angle — typically 1–4° lower, more at low Reynolds numbers. Lift on the way down follows a lower branch, tracing a loop. The simulation shows it.

### Warning and prevention
Aircraft warn of the approaching stall with a reed or vane switch at the leading edge, an angle-of-attack indicator, or a stick shaker; some have a stick pusher. Designers shape the stall with washout, stall strips and [[flow-control|vortex generators]]. Frost, ice and even insect debris on the leading edge can cut $c_{L,\\max}$ sharply, so that the wing stalls at a smaller angle and a higher speed than the book says ([[icing]]).

> [!warn] Stall characteristics and recovery technique depend on the aircraft. Stalls are practised only with an instructor, at safe height, following the aircraft's approved flight manual and training; the figures here are typical values for explanation, not operating limits.
`,
  ideas: [
    'A stall is flow separation over the upper surface when the angle of attack exceeds the critical angle; lift falls and drag rises sharply.',
    'A wing stalls at an angle, not a speed; the stall speed rises as √n with the load factor, so a wing can stall at any speed.',
    'Thick sections stall gently from the trailing edge, moderately thin ones abruptly from the leading edge, thin ones early from a spreading nose bubble.',
    'Stall shows hysteresis: the flow reattaches only at an angle below the stall angle.',
    'Contamination such as frost, ice or insects on the leading edge lowers c_l,max and the stall angle.'
  ],
  pitfalls: [
    'A wing stalls when the aircraft flies too slowly — It stalls when the angle of attack is too large. At 1 g that happens at the stall speed, but in a steep turn or a hard pull-up it happens far above it.',
    'In a stall the engine stops or the wing stops lifting altogether — An aerodynamic stall has nothing to do with the engine, and a stalled wing still produces a good deal of lift — just less than it needs, with much more drag.',
    'Lowering the angle of attack by a hair below the stall angle immediately restores the flow — Because of hysteresis the flow reattaches only at a noticeably smaller angle.'
  ],
  formulas: [
    {
      name: 'Stall speed at a load factor',
      expr: 'Vsn = Vs*sqrt(n)', tex: 'V_{s,n} = V_s\\sqrt{n}',
      vars: {
        Vsn: { name: 'stall speed at load factor n', q: 'speed', unit: 'kt', tex: 'V_{s,n}' },
        Vs: { name: 'stall speed in level 1-g flight', q: 'speed', unit: 'kt', value: 50, tex: 'V_s' },
        n: { name: 'load factor L/W', value: 2, min: 0.1, max: 9 }
      },
      note: 'The wing reaches C_L,max at a higher speed when it must carry n times the weight.',
      stories: { Vsn: 'An aircraft stalls at {Vs} in level flight. At what speed does it stall when pulling {n} g?', n: 'An aircraft that stalls at {Vs} in level flight stalls at {Vsn} in a manoeuvre. What load factor is it pulling?' }
    },
    {
      name: 'Stall speed in a level turn',
      expr: 'Vt = Vs/sqrt(cos(phi))', tex: 'V_{s,\\phi} = \\dfrac{V_s}{\\sqrt{\\cos\\phi}}',
      vars: {
        Vt: { name: 'stall speed in the turn', q: 'speed', unit: 'kt', tex: 'V_{s,\\phi}' },
        Vs: { name: 'stall speed in level 1-g flight', q: 'speed', unit: 'kt', value: 50, tex: 'V_s' },
        phi: { name: 'bank angle', q: 'angle', unit: '°', value: 60, min: 0, max: 85, tex: '\\phi' }
      },
      note: 'A level, co-ordinated turn needs n = 1/cos φ: 1.15 at 30°, 1.41 at 45°, 2 at 60°.',
      stories: { Vt: 'An aircraft stalls at {Vs} wings level. What is its stall speed in a level turn at {phi} of bank?', phi: 'An aircraft that stalls at {Vs} wings level is found to stall at {Vt} in a level turn. How steeply is it banked?' }
    }
  ],
  examples: [
    {
      title: 'Stalling in a steep turn',
      q: 'A trainer stalls at 50 kt wings-level. What is its stall speed in a level turn at 60° of bank?',
      steps: [
        'Load factor: $n = 1/\\cos 60° = 2$.',
        '$V_{s,\\phi} = 50\\sqrt{2} = 70.7$ kt.',
        'The stall speed has risen by 41 % — although nothing about the wing has changed, only the load it carries.'
      ],
      a: 'About 71 kt.'
    },
    {
      title: 'A pull-up close to the edge',
      q: 'An aircraft with a 1-g stall speed of 55 kt pulls up at 2.5 g while flying at 90 kt. How much margin is left?',
      steps: [
        '$V_{s,n} = 55\\sqrt{2.5} = 55 \\times 1.58 = 87$ kt.',
        'At 90 kt the wing is just 3 kt above its accelerated stall speed: pulling slightly harder would stall it at nearly twice the level-flight stall speed.'
      ],
      a: 'The accelerated stall speed is 87 kt — only about 3 kt of margin.'
    }
  ],
  quiz: [
    { q: 'A given wing always stalls at the same airspeed.', a: false,
      why: 'It always stalls at (about) the same angle of attack. The airspeed at which that angle is reached grows with the load factor: V_s√n.' },
    { q: 'What happens to the flow at the stall?', choices: ['it goes supersonic over the top', 'the boundary layer separates from most of the upper surface; lift falls and drag rises', 'the lower surface flow reverses', 'the air stops moving round the wing'], a: 1,
      why: 'The rising pressure behind the suction peak becomes too much for the boundary layer, which separates, leaving a wide, slow wake over the upper surface.' },
    { q: 'Which kind of stall is the most abrupt?', choices: ['trailing-edge stall of thick sections', 'leading-edge stall of moderately thin sections, when a short separation bubble bursts', 'thin-airfoil stall', 'all stalls are equally abrupt'], a: 1,
      why: 'In a leading-edge stall the whole upper surface separates at once when the nose bubble bursts, and the lift collapses — the 0012 at high Reynolds number is the classic example.' },
    { q: 'An aircraft stalls at 60 kt wings-level. What is its stall speed, in knots, in a level turn at 45° of bank?', answer: 71.4, unit: 'kt', tol: 0.02,
      why: 'n = 1/cos 45° = 1.414; V = 60 × √1.414 = 60 × 1.189 = 71.4 kt.' },
    { q: 'After a stall, to get the flow to reattach you must…', choices: ['reduce the angle of attack just below the stall angle', 'reduce the angle of attack well below the stall angle', 'increase the speed without changing the angle', 'wait: it reattaches by itself'], a: 1,
      why: 'Stall hysteresis: the separated flow reattaches only a few degrees below the angle at which it separated.' }
  ],
  problems: [
    { q: 'A glider stalls at 36 kt at 1 g. What is its stall speed while pulling out of a dive at 3.5 g?', answer: 67.3, unit: 'kt', tol: 0.02,
      steps: ['$V_{s,n} = 36\\sqrt{3.5} = 36 \\times 1.871 = 67.3$ kt.'] }
  ],
  applications: ['Setting approach and take-off speeds with a margin over the stall speed.', 'Stall-warning systems, angle-of-attack indicators and stick shakers.', 'Wing design with washout, stall strips and vortex generators so that the root stalls first.', 'Wind-turbine blades that use deliberate stall to limit power in high winds; helicopter blades that must avoid it on the retreating side.'],
  sim: { id: 'foil-lift-curve', params: { foil: 'le', sweep: true } }
},

{
  id: 'pitching-moment', parent: 'airfoil-behaviour', title: 'Pitching moment and aerodynamic centre', level: 2,
  short: 'The pressures on an airfoil twist it as well as lift it. About one special point near the quarter chord — the aerodynamic centre — that twisting moment does not change with angle of attack; it depends only on camber, and for most cambered sections it pitches the nose down.',
  keywords: ['pitching moment', 'moment coefficient', 'Cm', 'aerodynamic centre', 'aerodynamic center', 'quarter chord', 'nose-down moment', 'reflex', 'flying wing', 'trim', 'moment reference point', 'Cm0'],
  prereq: ['pressure-distribution', 'physics:torque', 'force-coefficients'],
  related: ['center-of-pressure', 'thin-airfoil-theory', 'trim', 'longitudinal-stability', 'neutral-point', 'center-of-gravity', 'transonic-flow', 'helicopter-rotor', 'flutter'],
  body: `
The pressure spread over an airfoil adds up to a force — lift and drag — and a **moment** that tends to rotate the section nose-up or nose-down. Like any moment, its size depends on the point you take it about. It is written in coefficient form, with nose-up positive:

$$M = \\tfrac12 \\rho V^2 S\\, \\bar c\\, C_m$$

for a wing of area $S$ and mean chord $\\bar c$ (per unit span for a section: $M' = \\tfrac12\\rho V^2 c^2 c_m$).

### Moving the reference point
Take the moment about the leading edge and it grows strongly nose-down as the lift grows: the lift acts behind the nose. Take it about a point near the back and it grows nose-up. Somewhere in between is a point about which the moment does **not change** with angle of attack. That point is the **aerodynamic centre** (a.c.). With the lift acting there, moving the reference point to any position $x$ gives

$$c_{m,x} = c_{m,ac} + c_l\\,(x - x_{ac})$$

with positions measured in chords from the leading edge.

### Where it is
[[thin-airfoil-theory|Thin-airfoil theory]] puts the aerodynamic centre **exactly at the quarter chord**, for any camber line. Real sections agree to within a few per cent of the chord: the panel method places it at 25.3 % for a 6 % thick section and 26–27 % for 12–18 % thick ones, and measured values lie between about 23 % and 27 %. In supersonic flow it jumps back to about **half the chord** — one reason aircraft trim changes as they accelerate through the transonic range ([[transonic-flow]]).

### What sets the constant moment
The moment about the a.c., $c_{m,ac}$, depends only on the **camber** line. A symmetric section has none. Camber loads the rear of the section and gives a nose-down moment, stronger the further back the camber is:

| Section | $c_{m,ac}$ (measured, rounded) |
|---|---|
| NACA 0012 | 0 |
| NACA 23012 (camber well forward) | −0.01 |
| NACA 2412 | −0.05 |
| NACA 4412 | −0.10 |
| NACA 6409 | −0.16 (thin-airfoil theory) |
| reflexed flying-wing section | about 0 or slightly positive |
| supercritical section (aft loading) | −0.10 to −0.15 |

For a parabolic camber line of height $m$, thin-airfoil theory gives $c_{m,c/4} = -\\pi m$: −0.063 for 2 % camber.

### Why it matters
- **Trim.** A conventional wing's nose-down moment must be balanced by the tailplane, usually with a small download, which costs lift and drag ([[trim]], [[longitudinal-stability]]).
- **Flying wings** have no tail to do it, so they use reflexed sections (the trailing edge turned up) or sweep and twist to bring $c_{m,ac}$ to zero or slightly positive.
- **Structures.** The moment twists the wing; the torsion box must resist it, and it enters the analysis of divergence and [[flutter]].
- **Rotor blades** use symmetric or low-moment sections, because a pitching moment on a long flexible blade twists it and loads the pitch links ([[helicopter-rotor]]).

> [!key] Place the lift at the aerodynamic centre and add a constant couple $c_{m,ac}$: the whole aerodynamic effect of the airfoil on the aircraft's balance is then two numbers that do not change with angle of attack.
`,
  ideas: [
    'An airfoil\'s pressures produce a pitching moment as well as lift; its size depends on the reference point. Nose-up is positive.',
    'About the aerodynamic centre the moment does not change with angle of attack; it lies near the quarter chord in subsonic flow and near mid-chord in supersonic flow.',
    'The moment about the a.c. depends only on camber: zero for symmetric sections, nose-down for ordinary cambered ones (−0.05 for a 2412).',
    'Moving the reference point: c_m,x = c_m,ac + c_l(x − x_ac).',
    'The nose-down moment must be trimmed by the tail; flying wings use reflexed sections to cancel it.'
  ],
  pitfalls: [
    'An airfoil has one pitching moment — The moment depends on the point it is taken about; only about the aerodynamic centre is it independent of the angle of attack.',
    'The aerodynamic centre and the centre of pressure are the same point — The centre of pressure is where the resultant acts with no moment, and it moves with angle; the aerodynamic centre is fixed and carries a constant moment.',
    'More camber gives more lift at no cost — It also gives a larger nose-down moment, which the tail must balance with a download that costs lift and drag.'
  ],
  formulas: [
    {
      name: 'Pitching moment of a wing',
      expr: 'M = 0.5*rho*V^2*S*c*Cm', tex: 'M = \\tfrac12 \\rho V^2 S\\, \\bar c\\, C_m',
      vars: {
        M: { name: 'pitching moment (nose-up positive)', q: 'torque', unit: 'N·m', signed: true },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, min: 0.3, max: 1.35, tex: '\\rho' },
        V: { name: 'airspeed', q: 'speed', unit: 'm/s', value: 60 },
        S: { name: 'wing area', q: 'area', unit: 'm²', value: 16.2 },
        c: { name: 'mean aerodynamic chord', q: 'length', unit: 'm', value: 1.5, tex: '\\bar c' },
        Cm: { name: 'moment coefficient', value: -0.05, min: -0.3, max: 0.1, signed: true, tex: 'C_m' }
      },
      note: 'Taken about the reference point used for C_m, usually the quarter chord of the mean aerodynamic chord.',
      stories: { M: 'A wing of {S} and mean chord {c} has a moment coefficient of {Cm} about its quarter chord. What pitching moment does it make at {V} in air of density {rho}?' }
    },
    {
      name: 'Moving the moment reference point',
      expr: 'cmx = cmac + cl*(x - xac)', tex: 'c_{m,x} = c_{m,ac} + c_l\\,(x - x_{ac})',
      vars: {
        cmx: { name: 'moment coefficient about the point x', signed: true, tex: 'c_{m,x}' },
        cmac: { name: 'moment coefficient about the aerodynamic centre', value: -0.05, min: -0.2, max: 0.05, signed: true, tex: 'c_{m,ac}' },
        cl: { name: 'lift coefficient', value: 0.8, min: -2, max: 4, signed: true, tex: 'c_l' },
        x: { name: 'reference point x/c', q: 'ratio', unit: '%', value: 10, min: 0, max: 100 },
        xac: { name: 'aerodynamic centre x_ac/c', q: 'ratio', unit: '%', value: 25, min: 20, max: 50, tex: 'x_{ac}' }
      },
      note: 'Positions from the leading edge in fractions of the chord; nose-up positive. A reference point behind the a.c. gives a moment that grows nose-up with lift.',
      stories: { cmx: 'A section with c_m,ac = {cmac} and its aerodynamic centre at {xac} flies at c_l = {cl}. What is its moment coefficient about a point at {x} of the chord?' }
    },
    {
      name: 'Finding the aerodynamic centre from two measurements',
      expr: 'xac = x - (cm2 - cm1)/(cl2 - cl1)', tex: 'x_{ac} = x - \\dfrac{c_{m,2} - c_{m,1}}{c_{l,2} - c_{l,1}}',
      vars: {
        xac: { name: 'aerodynamic centre x_ac/c', q: 'ratio', unit: '%', tex: 'x_{ac}' },
        x: { name: 'point the moments were measured about, x/c', q: 'ratio', unit: '%', value: 30, min: 0, max: 100 },
        cm1: { name: 'moment coefficient, first measurement', value: 0.005, min: -0.2, max: 0.2, signed: true, tex: 'c_{m,1}' },
        cm2: { name: 'moment coefficient, second measurement', value: 0.04, min: -0.2, max: 0.2, signed: true, tex: 'c_{m,2}' },
        cl1: { name: 'lift coefficient, first measurement', value: 0.2, min: 0, max: 0.6, tex: 'c_{l,1}' },
        cl2: { name: 'lift coefficient, second measurement', value: 0.9, min: 0.7, max: 1.5, tex: 'c_{l,2}' }
      },
      note: 'The slope dc_m/dc_l about any point equals (x − x_ac): measured moments that grow nose-up with lift mean the balance point is behind the aerodynamic centre.',
      practice: { unknowns: ['xac'] },
      stories: { xac: 'A tunnel balance measures moments about {x} of the chord: c_m = {cm1} at c_l = {cl1} and c_m = {cm2} at c_l = {cl2}. Where is the aerodynamic centre?' }
    }
  ],
  examples: [
    {
      title: 'The moment a tail must balance',
      q: 'A light aircraft wing (16.2 m², mean chord 1.5 m) has $C_{m,ac} = -0.05$. What moment does it make at 60 m/s at sea level, and what download would a tailplane 4.5 m behind need to balance it alone?',
      steps: [
        '$q = \\tfrac12 \\times 1.225 \\times 60^2 = 2205$ Pa.',
        '$M = q S \\bar c C_m = 2205 \\times 16.2 \\times 1.5 \\times (-0.05) = -2680$ N·m (nose-down).',
        'Tail force: $2680/4.5 = 595$ N downward — about 6 % of the weight of a 1000 kg aircraft, which the wing must carry in addition.',
        'In practice the centre of gravity is placed so that the wing lift itself helps; the example isolates the camber moment.'
      ],
      a: 'About 2.7 kN·m nose-down, needing roughly 600 N of tail download.'
    },
    {
      title: 'Locating the aerodynamic centre in a tunnel',
      q: 'A balance measures moments about 30 % of the chord: $c_m = 0.005$ at $c_l = 0.2$ and $c_m = 0.040$ at $c_l = 0.9$. Where is the aerodynamic centre, and what is $c_{m,ac}$?',
      steps: [
        'Slope: $\\Delta c_m/\\Delta c_l = 0.035/0.7 = 0.05$.',
        '$x_{ac} = 0.30 - 0.05 = 0.25$: the quarter chord.',
        '$c_{m,ac} = c_{m,x} - c_l(x - x_{ac}) = 0.005 - 0.2 \\times 0.05 = -0.005$.'
      ],
      a: 'At 25 % of the chord, with c_m,ac ≈ −0.005 (a nearly symmetric section).'
    }
  ],
  quiz: [
    { q: 'About the aerodynamic centre, what stays constant as the angle of attack changes?', choices: ['the lift', 'the moment coefficient', 'the drag', 'the centre of pressure'], a: 1,
      why: 'That is its definition: the point about which c_m does not vary with α (or c_l).' },
    { q: 'A symmetric airfoil has zero pitching moment about its aerodynamic centre.', a: true,
      why: 'c_m,ac comes from camber only. With no camber, the lift acts at the a.c. at every angle and there is no couple.' },
    { q: 'In subsonic flow, the aerodynamic centre of an airfoil is near…', choices: ['the leading edge', 'the quarter chord', 'mid-chord', 'the trailing edge'], a: 1,
      why: 'Thin-airfoil theory puts it at exactly c/4; real subsonic sections have it at 23–27 %. In supersonic flow it moves back to about c/2.' },
    { q: 'A section has $c_{m,ac} = -0.05$ with its a.c. at 25 %. What is $c_m$ about the leading edge at $c_l = 1.0$?', answer: -0.3, tol: 0.02,
      why: 'c_m,LE = c_m,ac + c_l(0 − 0.25) = −0.05 − 0.25 = −0.30: strongly nose-down, because the lift acts a quarter chord behind the leading edge.' },
    { q: 'Why do tailless flying wings often use reflexed airfoils?', choices: ['to increase c_l,max', 'to bring the pitching moment about the a.c. to zero or nose-up, so they can trim without a tail', 'to delay the stall', 'to reduce skin friction'], a: 1,
      why: 'An ordinary cambered section pitches nose-down and needs a tail to balance it. Turning up the trailing edge (reflex) cancels that moment.' }
  ],
  problems: [
    { q: 'A NACA 4412 wing section ($c_{m,ac} = -0.10$, a.c. at 25 %) of 2 m chord flies at 70 m/s at sea level. What is the pitching moment per metre of span about the a.c.?', answer: -1201, unit: 'N·m', tol: 0.02,
      steps: ['$q = \\tfrac12 \\times 1.225 \\times 70^2 = 3001$ Pa.', '$M\' = q c^2 c_{m,ac} = 3001 \\times 4 \\times (-0.10) = -1200$ N·m per metre: nose-down.'] }
  ],
  applications: ['Placing the centre of gravity and sizing the tailplane of every conventional aircraft.', 'Designing flying wings, hang gliders and paragliders with reflexed or twisted sections.', 'Choosing low-moment sections for helicopter blades and control surfaces.', 'Structural design of the wing torsion box against twisting loads.'],
  sim: 'foil-cp-travel'
},

{
  id: 'center-of-pressure', parent: 'airfoil-behaviour', title: 'Centre of pressure', level: 2,
  short: 'The centre of pressure is the point where the whole aerodynamic force can be said to act, with no moment. On a cambered airfoil it wanders: forward towards the quarter chord as the angle grows, backward — even off the airfoil — as the lift falls to zero. That restlessness is why engineers use the fixed aerodynamic centre instead.',
  keywords: ['centre of pressure', 'center of pressure', 'CP', 'CP travel', 'resultant', 'aerodynamic centre', 'moment', 'centre of effort', 'sail', 'rocket stability', 'weathervane'],
  prereq: ['pitching-moment', 'pressure-distribution', 'lift-curve'],
  related: ['center-of-gravity', 'longitudinal-stability', 'neutral-point', 'sails', 'wind-loads', 'rocket-propulsion', 'directional-stability'],
  body: `
Any spread-out force can be replaced by a single force at one point, chosen so that it produces the same moment. For an airfoil that point, on the chord line, is the **centre of pressure**: the moment about it is zero. It is the natural answer to "where does the lift act?" — and it turns out to be an awkward one.

### It moves
The lift of a cambered section has two parts (see [[thin-airfoil-theory]]): a *camber* load that is fixed by the shape and centred near mid-chord, and an *angle-of-attack* load that grows with $\\alpha$ and is centred at the quarter chord. The centre of pressure is their weighted average, so it moves as the balance between them changes:

$$x_{cp} = x_{ac} - \\frac{c_{m,ac}}{c_l}$$

With $c_{m,ac}$ negative (nose-down), $x_{cp}$ lies **behind** the aerodynamic centre, and the smaller the lift, the further behind:

| $\\alpha$ | NACA 2412: $c_l$ | $x_{cp}/c$ | NACA 4412: $c_l$ | $x_{cp}/c$ |
|---|---|---|---|---|
| 0° | 0.26 | 0.46 | 0.52 | 0.46 |
| 2° | 0.50 | 0.36 | 0.76 | 0.40 |
| 4° | 0.74 | 0.33 | 1.00 | 0.36 |
| 8° | 1.22 | 0.30 | 1.48 | 0.33 |

(panel method). As the angle rises, $x_{cp}$ creeps forward towards the aerodynamic centre, never reaching it. As $c_l$ falls towards zero it runs back past the trailing edge and off to infinity: at zero lift there is still a nose-down couple, and a pure couple has no line of action. For a **symmetric** section $c_{m,ac} = 0$, and the centre of pressure stays at the aerodynamic centre, near the quarter chord, at every angle below the stall.

### Why engineers prefer the aerodynamic centre
A moving point of action is awkward in every calculation of balance and stability: the moment arm changes with angle, and at small lift the arm is enormous. Placing the lift at the fixed aerodynamic centre with a constant couple $c_{m,ac}$ describes exactly the same forces with two constants (see [[pitching-moment]]). Stability analysis works with the aerodynamic centre and its whole-aircraft equivalent, the [[neutral-point|neutral point]].

### Where the idea is still useful
- **Sails and kites**: sailors balance a boat by the *centre of effort* of the sails against the centre of lateral resistance of the hull ([[sails]]).
- **Rockets, arrows and weathervanes**: for a whole body, "centre of pressure" means where the side force from the air acts when the body is at an angle. It must lie **behind** the centre of gravity, or the body will turn broadside — hence fins at the back.
- **Buildings and signs**: the resultant of the wind load sets the overturning moment ([[wind-loads]]).

> [!note] A flat plate behaves more simply than a cambered section: its centre of pressure sits near the quarter chord at small angles and moves back towards mid-chord only as the angle grows large. Early experimenters, who knew flat plates, were surprised by cambered wings — see the history below.
`,
  ideas: [
    'The centre of pressure is the point on the chord about which the aerodynamic moment is zero — where the resultant acts.',
    'For a cambered airfoil it lies behind the aerodynamic centre and moves: forward as the angle grows, backward (to infinity) as the lift falls to zero.',
    'x_cp = x_ac − c_m,ac/c_l.',
    'For a symmetric airfoil it stays at the aerodynamic centre, near the quarter chord.',
    'For whole bodies such as rockets and arrows, the centre of pressure must be behind the centre of gravity for stability.'
  ],
  pitfalls: [
    'The lift of a wing acts at a fixed point — Only the aerodynamic centre is fixed, and it carries a moment as well; the point where the lift acts alone (the centre of pressure) moves with angle of attack.',
    'At zero lift a cambered airfoil has no aerodynamic effect — It still has a nose-down couple; its centre of pressure is at infinity because a couple has no single point of action.',
    'The centre of pressure moves forward as the aircraft slows down, so slow flight is always nose-heavy — The centre of pressure does move forward as c_l rises, but what matters for balance is the moment about the centre of gravity, which the aerodynamic-centre description gives directly.'
  ],
  formulas: [
    {
      name: 'Centre of pressure from the aerodynamic centre',
      expr: 'xcp = xac - cmac/cl', tex: 'x_{cp} = x_{ac} - \\dfrac{c_{m,ac}}{c_l}',
      vars: {
        xcp: { name: 'centre of pressure x_cp/c', q: 'ratio', unit: '%', signed: true, tex: 'x_{cp}' },
        xac: { name: 'aerodynamic centre x_ac/c', q: 'ratio', unit: '%', value: 25, min: 20, max: 30, tex: 'x_{ac}' },
        cmac: { name: 'moment coefficient about the a.c.', value: -0.053, min: -0.2, max: 0.05, signed: true, tex: 'c_{m,ac}' },
        cl: { name: 'lift coefficient', value: 0.67, min: 0.1, max: 2, tex: 'c_l' }
      },
      note: 'Positions from the leading edge in fractions of the chord. As c_l → 0 the centre of pressure runs off to infinity.',
      stories: { xcp: 'A section with its aerodynamic centre at {xac} and c_m,ac = {cmac} flies at c_l = {cl}. Where is its centre of pressure?', cl: 'At what lift coefficient is the centre of pressure of a section (a.c. at {xac}, c_m,ac = {cmac}) at {xcp} of the chord?' }
    },
    {
      name: 'Moment of the resultant about any point',
      expr: 'cmx = cl*(x - xcp)', tex: 'c_{m,x} = c_l\\,(x - x_{cp})',
      vars: {
        cmx: { name: 'moment coefficient about the point x (nose-up positive)', signed: true, tex: 'c_{m,x}' },
        cl: { name: 'lift coefficient', value: 0.67, min: -2, max: 4, signed: true, tex: 'c_l' },
        x: { name: 'reference point x/c', q: 'ratio', unit: '%', value: 25, min: 0, max: 100 },
        xcp: { name: 'centre of pressure x_cp/c', q: 'ratio', unit: '%', value: 32.9, min: 10, max: 80, tex: 'x_{cp}' }
      },
      note: 'The lift acting at the centre of pressure, seen from another point. With x at the aerodynamic centre this gives back c_m,ac.',
      stories: { cmx: 'The lift of a section (c_l = {cl}) acts at {xcp} of the chord. What is the moment coefficient about {x} of the chord?' }
    }
  ],
  examples: [
    {
      title: 'The travel of the centre of pressure',
      q: 'A NACA 2412 has its aerodynamic centre at 25 % and $c_{m,ac} = -0.053$. Where is its centre of pressure at $c_l = 0.3$ and at $c_l = 1.2$? On a 1.5 m chord, how far behind the leading edge is that?',
      steps: [
        '$c_l = 0.3$: $x_{cp} = 0.25 + 0.053/0.3 = 0.25 + 0.177 = 0.427$ → $0.427 \\times 1.5 = 0.64$ m.',
        '$c_l = 1.2$: $x_{cp} = 0.25 + 0.053/1.2 = 0.25 + 0.044 = 0.294$ → 0.44 m.',
        'Between cruise and slow flight the point where the lift acts moves 0.2 m — 13 % of the chord.'
      ],
      a: '43 % (0.64 m) at c_l = 0.3; 29 % (0.44 m) at c_l = 1.2.'
    }
  ],
  quiz: [
    { q: 'On a cambered airfoil, as the angle of attack increases the centre of pressure…', choices: ['moves forward, towards the quarter chord', 'moves back towards the trailing edge', 'stays at the quarter chord', 'moves to the leading edge'], a: 0,
      why: 'x_cp = x_ac − c_m,ac/c_l: with c_m,ac negative, x_cp is behind the a.c. by |c_m,ac|/c_l, a gap that shrinks as c_l grows.' },
    { q: 'The centre of pressure of a thin symmetric airfoil stays at the quarter chord at all angles below the stall.', a: true,
      why: 'With no camber c_m,ac = 0 and x_cp = x_ac = c/4 at every angle.' },
    { q: 'Where is the centre of pressure of a cambered airfoil at its zero-lift angle?', choices: ['at the leading edge', 'at the quarter chord', 'at the trailing edge', 'nowhere — infinitely far away, because only a couple remains'], a: 3,
      why: 'At zero lift the force vanishes but the nose-down moment c_m,ac does not; a pure couple cannot be placed at any finite point.' },
    { q: 'A section has $c_{m,ac} = -0.1$ with its a.c. at 25 %. Where is its centre of pressure, in % of the chord, at $c_l = 0.5$?', answer: 45, unit: '%', tol: 0.02,
      why: 'x_cp = 0.25 − (−0.1)/0.5 = 0.25 + 0.2 = 0.45, i.e. 45 % of the chord.' },
    { q: 'Why do stability calculations use the aerodynamic centre rather than the centre of pressure?', choices: ['the aerodynamic centre is fixed and its moment constant, so two constants describe the airfoil', 'the centre of pressure does not exist on real wings', 'they give different forces', 'the aerodynamic centre is always at the leading edge'], a: 0,
      why: 'Both descriptions are exact; the fixed point with a constant couple is far easier to work with than a point that wanders — and runs to infinity at zero lift.' }
  ],
  problems: [
    { q: 'At what lift coefficient is the centre of pressure of a NACA 4412 ($c_{m,ac} = -0.10$, a.c. at 25 %) at 35 % of the chord?', answer: 1.0, tol: 0.02,
      steps: ['$x_{cp} - x_{ac} = -c_{m,ac}/c_l$, so $c_l = -c_{m,ac}/(x_{cp} - x_{ac}) = 0.10/0.10 = 1.0$.'] }
  ],
  applications: ['Balancing sails against the hull of a yacht (centre of effort).', 'Fin sizing for rockets, missiles, arrows and darts: centre of pressure behind the centre of gravity.', 'Wind loads on signs and buildings: where the resultant acts sets the overturning moment.', 'Historical wing design, before the aerodynamic-centre description became standard.'],
  history: 'Nineteenth-century experimenters measured flat plates and found the centre of pressure moving from about a quarter of the chord at small angles towards the middle at large ones. The Wright brothers\' 1901 wind-tunnel and glider tests showed that cambered surfaces reverse this at small angles, a behaviour Wilbur Wright described in his lecture to the Western Society of Engineers that year.',
  sim: { id: 'foil-cp-travel', params: { foil: '4412' } }
},

{
  id: 'thin-airfoil-theory', parent: 'airfoil-behaviour', title: 'Thin-airfoil theory', level: 3,
  short: 'Replace a thin airfoil by a sheet of vortices along its mean camber line, make the flow follow that line and leave the trailing edge smoothly, and the lift and moment of any thin section follow in closed form: a lift slope of 2π, an aerodynamic centre at the quarter chord, and a zero-lift angle and moment set by the camber alone.',
  keywords: ['thin-airfoil theory', 'vortex sheet', 'Glauert', 'Fourier series', 'Munk', 'lift slope 2π', 'zero-lift angle', 'quarter chord', 'ideal angle of attack', 'camber line', 'flat plate', 'Birnbaum'],
  prereq: ['kutta-condition', 'sources-vortices', 'math:fourier-series', 'airfoil-geometry'],
  related: ['lift-curve', 'pitching-moment', 'center-of-pressure', 'high-lift-devices', 'panel-methods', 'lifting-line', 'supersonic-airfoils', 'pressure-distribution'],
  body: `
Most airfoils are thin — their thickness is 6–18 % of the chord and their camber a few per cent — and at the angles of normal flight the flow barely departs from the free stream. Thin-airfoil theory, worked out by Max Munk and Hermann Glauert in the early 1920s, exploits this to give the lift and moment of any thin section with nothing more than a few integrals.

### The model
1. Ignore the thickness, and replace the airfoil by its **mean camber line** $z(x)$.
2. Along that line place a continuous sheet of [[sources-vortices|vortices]] of strength $\\gamma(x)$ per unit length; the velocity jumps by $\\gamma$ across it — faster above, slower below — so $\\gamma$ is the local load, $\\Delta C_p = 2\\gamma/V_\\infty$.
3. Choose $\\gamma(x)$ so that the flow is tangent to the camber line everywhere (it is a solid surface) and $\\gamma = 0$ at the trailing edge ([[kutta-condition]]).

### The results
With the substitution $x = \\tfrac{c}{2}(1 - \\cos\\theta)$ the sheet strength becomes a [[math:fourier-series|Fourier series]] whose coefficients come straight from the slope of the camber line:

$$A_0 = \\alpha - \\frac{1}{\\pi}\\int_0^\\pi \\frac{dz}{dx}\\,d\\theta, \\qquad A_n = \\frac{2}{\\pi}\\int_0^\\pi \\frac{dz}{dx}\\cos n\\theta\\,d\\theta$$

and everything follows:

$$c_l = \\pi(2A_0 + A_1) = 2\\pi(\\alpha - \\alpha_0), \\qquad c_{m,c/4} = \\frac{\\pi}{4}(A_2 - A_1)$$

- **The lift slope is 2π per radian** — for every thin section, whatever its camber.
- **The zero-lift angle** depends only on the camber line. For a parabolic arc of height $m$ it is $\\alpha_0 = -2m$ (radians): −2.3° for 2 % camber.
- **The aerodynamic centre is exactly at the quarter chord**, and the moment about it depends only on camber: $-\\pi m$ for a parabolic arc (see [[pitching-moment]]).
- **The load splits in two**: a flat-plate part $4\\alpha\\sqrt{(1 - x)/x}$ that grows with angle, infinite at the nose and centred at the quarter chord, and a fixed camber part. At one angle, the **ideal angle**, the nose spike vanishes and the flow meets the leading edge smoothly — the condition laminar and sailplane sections are designed around.

### How good is it?
Surprisingly good, because its two big omissions push in opposite directions: thickness raises the inviscid lift slope (by about $1 + 0.77\\,t/c$), while the boundary layer lowers it.

| NACA 2412 | thin-airfoil theory | panel method (inviscid, with thickness) | measured |
|---|---|---|---|
| zero-lift angle | −2.08° | −2.14° | ≈ −2.1° |
| lift slope per degree | 0.110 | 0.121 | ≈ 0.105 |
| $c_{m,c/4}$ | −0.053 | −0.054 to −0.065 | ≈ −0.05 |
| aerodynamic centre | 25 % | 26 % | ≈ 24–25 % |

It says nothing about drag (inviscid flow has none — [[dalembert-paradox]]), stall, or the suction peak at the nose (where it predicts infinity). Its descendants handle those: [[panel-methods]] keep the thickness, [[lifting-line]] and vortex-lattice theories extend it to finite wings, and its supersonic cousin gives [[supersonic-airfoils|supersonic sections]]. The same integrals also predict how much a **flap** shifts the lift curve ([[high-lift-devices]]).

> [!key] Lift slope 2π, aerodynamic centre at c/4, and a camber line that alone decides the zero-lift angle and the moment: thin-airfoil theory is the backbone of airfoil intuition.
`,
  ideas: [
    'The airfoil is replaced by a vortex sheet on its mean camber line; flow tangency and the Kutta condition fix the sheet strength.',
    'The lift slope is 2π per radian for every thin section; camber only shifts the zero-lift angle.',
    'The aerodynamic centre is exactly at the quarter chord; the moment about it depends only on the camber line.',
    'For a parabolic camber line of height m: α₀ = −2m and c_m,c/4 = −πm.',
    'The load is a flat-plate part, 4α√((1 − x)/x), plus a fixed camber part; at the ideal angle the leading-edge spike vanishes.'
  ],
  pitfalls: [
    'Camber makes the lift curve steeper — In thin-airfoil theory the slope is 2π whatever the camber; camber moves the zero-lift angle, shifting the whole line up.',
    'Thin-airfoil theory is only good for very thin sections — For 6–15 % sections its lift and moment are within about 10 % of measurements, because the effects of thickness and viscosity largely cancel.',
    'The infinite suction the theory predicts at the leading edge is real — It is an artefact of a zero-thickness plate. A real rounded nose has a finite, if tall, suction peak.'
  ],
  derivation: {
    title: 'From a vortex sheet to c_l = 2π(α − α₀)',
    steps: [
      { text: 'Place vortices of strength γ(ξ) per unit length along the chord (the camber is small, so the line is nearly straight). The downward velocity they induce at x must cancel the free stream\'s component normal to the camber line:', tex: '\\frac{1}{2\\pi}\\int_0^c \\frac{\\gamma(\\xi)\\,d\\xi}{x - \\xi} = V_\\infty\\left(\\alpha - \\frac{dz}{dx}\\right)' },
      { text: 'Change variable with Glauert\'s substitution, which crowds points towards the leading and trailing edges:', tex: 'x = \\tfrac{c}{2}(1 - \\cos\\theta), \\qquad \\xi = \\tfrac{c}{2}(1 - \\cos\\theta_0)' },
      { text: 'Try a series whose first term is the flat-plate solution and which vanishes at the trailing edge (θ = π), as the Kutta condition requires:', tex: '\\gamma(\\theta) = 2V_\\infty\\left[A_0\\,\\frac{1 + \\cos\\theta}{\\sin\\theta} + \\sum_{n=1}^{\\infty} A_n \\sin n\\theta\\right]' },
      { text: 'Substituting and using the standard integrals of cos nθ₀/(cos θ₀ − cos θ) turns the equation into a Fourier cosine series for the camber slope, which gives the coefficients:', tex: 'A_0 = \\alpha - \\frac{1}{\\pi}\\int_0^\\pi \\frac{dz}{dx}\\,d\\theta, \\qquad A_n = \\frac{2}{\\pi}\\int_0^\\pi \\frac{dz}{dx}\\cos n\\theta\\,d\\theta' },
      { text: 'The circulation is the integral of γ along the chord; by Kutta–Joukowski the lift coefficient is 2Γ/(V∞c):', tex: 'c_l = \\pi\\,(2A_0 + A_1) = 2\\pi\\left[\\alpha - \\frac{1}{\\pi}\\int_0^\\pi \\frac{dz}{dx}(1 - \\cos\\theta)\\,d\\theta\\right] = 2\\pi(\\alpha - \\alpha_0)' },
      { text: 'Weighting the load by distance from the quarter chord gives a moment that contains no α at all — so c/4 is the aerodynamic centre:', tex: 'c_{m,c/4} = \\frac{\\pi}{4}\\,(A_2 - A_1)' }
    ]
  },
  formulas: [
    {
      name: 'Lift of a thin airfoil',
      expr: 'cl = 2*pi*(alpha - alpha0)', tex: 'c_l = 2\\pi\\,(\\alpha - \\alpha_0)',
      vars: {
        cl: { name: 'section lift coefficient', signed: true, tex: 'c_l' },
        alpha: { name: 'angle of attack', q: 'angle', unit: '°', value: 5, min: -12, max: 15, signed: true, tex: '\\alpha' },
        alpha0: { name: 'zero-lift angle', q: 'angle', unit: '°', value: -2.3, min: -12, max: 5, signed: true, tex: '\\alpha_0' }
      },
      note: 'Inviscid, attached flow. The slope 2π per radian holds for any thin camber line.',
      stories: { cl: 'A thin section with a zero-lift angle of {alpha0} meets the air at {alpha}. What lift coefficient does thin-airfoil theory give?', alpha: 'At what angle does a thin section with a zero-lift angle of {alpha0} give c_l = {cl}?' }
    },
    {
      name: 'Zero-lift angle of a parabolic camber line',
      expr: 'alpha0 = -2*m', tex: '\\alpha_0 = -2m',
      vars: {
        alpha0: { name: 'zero-lift angle', q: 'angle', unit: '°', min: -30, max: 0, signed: true, tex: '\\alpha_0' },
        m: { name: 'camber m/c (height of the arc at mid-chord)', q: 'ratio', unit: '%', value: 2, min: 0, max: 10 }
      },
      note: 'For a circular or parabolic arc with its highest point at mid-chord. Camber further back makes α₀ more negative (a NACA 2412 has −2.08°, a 2612 −2.6°).',
      stories: { alpha0: 'A thin sail-like section has a parabolic camber of {m}. What is its zero-lift angle?', m: 'A parabolic-arc section has a zero-lift angle of {alpha0}. How much camber has it?' }
    },
    {
      name: 'Quarter-chord moment of a parabolic camber line',
      expr: 'cm = -pi*m', tex: 'c_{m,c/4} = -\\pi m',
      vars: {
        cm: { name: 'moment coefficient about the quarter chord', signed: true, tex: 'c_{m,c/4}' },
        m: { name: 'camber m/c', q: 'ratio', unit: '%', value: 2, min: 0, max: 10 }
      },
      note: 'Nose-down (negative) for positive camber, and independent of the angle of attack: the quarter chord is the aerodynamic centre.',
      stories: { cm: 'What pitching moment coefficient about the quarter chord does a parabolic camber of {m} give?' }
    },
    {
      name: 'Inviscid lift slope with thickness (estimate)',
      expr: 'a0 = 2*pi*(1 + 0.77*tc)', tex: 'a_0 = 2\\pi\\,(1 + 0.77\\,\\tau)',
      vars: {
        a0: { name: 'inviscid lift slope, per radian', tex: 'a_0' },
        tc: { name: 'thickness ratio t/c', q: 'ratio', unit: '%', value: 12, min: 0, max: 40, tex: '\\tau' }
      },
      note: 'From the exact Joukowski solution; agrees with the panel method within about 2 % for NACA sections. Real (viscous) sections lose more than this gains: they measure 5.7–6.2 per radian.',
      stories: { a0: 'Estimate the inviscid lift slope of a {tc} thick section.' }
    }
  ],
  examples: [
    {
      title: 'A 3 % parabolic arc',
      q: 'A thin section has a parabolic camber of 3 %. Find its zero-lift angle, its quarter-chord moment, and its lift coefficient at 5°.',
      steps: [
        '$\\alpha_0 = -2m = -0.06$ rad $= -3.44°$.',
        '$c_{m,c/4} = -\\pi m = -0.094$.',
        '$c_l = 2\\pi(\\alpha - \\alpha_0) = 2\\pi(0.0873 + 0.060) = 0.925$.'
      ],
      a: 'α₀ = −3.4°, c_m,c/4 = −0.094, c_l = 0.93 at 5°.'
    },
    {
      title: 'Why the panel method lifts more',
      q: 'The panel method gives a lift slope of 6.95 per radian for a NACA 0012, against thin-airfoil theory\'s 2π. How much of the difference does the thickness estimate explain?',
      steps: [
        '$a_0 = 2\\pi(1 + 0.77 \\times 0.12) = 6.283 \\times 1.092 = 6.86$ per radian.',
        'That accounts for 0.58 of the 0.67 difference; the rest is the finer detail of the 0012 shape.',
        'Measured slopes (≈ 6.0 per radian) are lower than both: the boundary layer thickens towards the trailing edge and reduces the circulation.'
      ],
      a: 'The thickness estimate gives 6.86 per radian — most of the panel method\'s extra lift.'
    }
  ],
  quiz: [
    { q: 'Thin-airfoil theory predicts a lift slope of…', choices: ['2π per radian, whatever the camber', '2π per degree', 'a slope that grows with camber', '4π per radian'], a: 0,
      why: 'dc_l/dα = 2π for any thin camber line; camber changes only α₀.' },
    { q: 'According to thin-airfoil theory, the aerodynamic centre of every thin airfoil is at…', choices: ['the leading edge', 'the quarter chord', 'mid-chord', 'the point of maximum camber'], a: 1,
      why: 'The moment about c/4 is (π/4)(A₂ − A₁), which contains no angle of attack: c/4 is the aerodynamic centre.' },
    { q: 'In thin-airfoil theory, adding camber makes the lift curve steeper.', a: false,
      why: 'Camber shifts the lift curve to the left (α₀ more negative); the slope remains 2π per radian.' },
    { q: 'What does the flat-plate part of the load do at the leading edge?', choices: ['it is zero', 'it becomes infinite', 'it equals the camber load', 'it changes sign'], a: 1,
      why: '4α√((1 − x)/x) → ∞ as x → 0: a zero-thickness edge would need infinite speed to turn the flow. A real rounded nose has a finite suction peak instead.' },
    { q: 'What zero-lift angle (in degrees) does thin-airfoil theory give for a parabolic camber of 4 %?', answer: -4.58, unit: '°', tol: 0.02,
      why: 'α₀ = −2m = −0.08 rad = −4.58°.' }
  ],
  problems: [
    { q: 'A thin sail section has a parabolic camber of 8 %. What is its lift coefficient at 3° according to thin-airfoil theory?', answer: 1.334, tol: 0.02,
      steps: ['$\\alpha_0 = -2 \\times 0.08 = -0.16$ rad.', '$c_l = 2\\pi(0.0524 + 0.16) = 2\\pi \\times 0.2124 = 1.33$.'] }
  ],
  applications: ['First estimates of zero-lift angle, lift slope and moment for any new section.', 'Designing camber lines for a chosen load (the NACA six-series mean lines were designed this way).', 'Flap effectiveness and control-surface hinge moments.', 'Sails, thin propeller and fan blades, and insect wings at small angles.'],
  history: 'Max Munk, working with Prandtl, published the approach in 1922; Hermann Glauert gave it its classic form with the Fourier series in his 1926 book "The Elements of Aerofoil and Airscrew Theory". Walter Birnbaum had solved the vortex-sheet problem for a camber line in 1923.',
  sim: 'foil-thin-theory'
},

{
  id: 'reynolds-effects-airfoil', parent: 'airfoil-behaviour', title: 'Reynolds number effects', level: 2,
  short: 'The same airfoil behaves differently at different Reynolds numbers. The lift slope barely changes, but the maximum lift, the drag and the kind of stall depend on whether the boundary layer is laminar or turbulent — which is why a model in a small tunnel, a drone and an airliner can see the same section very differently.',
  keywords: ['Reynolds number', 'scale effect', 'low Reynolds number', 'laminar separation bubble', 'transition', 'turbulator', 'trip strip', 'CLmax', 'minimum drag', 'roughness', 'wind-tunnel correction', 'model aircraft', 'drone'],
  prereq: ['reynolds-number', 'boundary-layer', 'transition', 'lift-curve'],
  related: ['laminar-boundary-layer', 'turbulent-boundary-layer', 'skin-friction', 'special-airfoils', 'similarity-testing', 'wind-tunnel', 'insect-flight', 'bird-flight', 'multicopters', 'drag-crisis', 'stall'],
  body: `
The [[reynolds-number|Reynolds number]] based on the chord,

$$\\mathrm{Re} = \\frac{\\rho V c}{\\mu}$$

measures inertia against viscosity. It spans an enormous range across the things that fly:

| Flyer | chord | speed | Re |
|---|---|---|---|
| fruit fly | 1 mm | 1–2 m/s | about 100 |
| dragonfly | 10 mm | 5 m/s | a few thousand |
| sparrow, small drone blade | 50 mm | 10 m/s | 30 000 |
| model glider | 0.2 m | 12 m/s | 160 000 |
| sailplane | 0.8 m | 30 m/s | 1.6 million |
| light aircraft | 1.5 m | 60 m/s | 6 million |
| airliner in cruise | 5 m | 230 m/s at 11 km | 30 million |

### What changes, and what does not
- **The lift slope and the zero-lift angle hardly change** with Re, as long as the flow is attached. They are set by the pressure field, which the thin boundary layer barely affects.
- **Maximum lift rises with Re.** A turbulent boundary layer carries more momentum near the wall and can climb a steeper pressure rise before separating. A NACA 0012 reaches $c_{l,\\max}$ of about 1.6 at 6 million, around 1.3–1.4 at 1 million, and 1 or less near 100 000.
- **Minimum drag falls with Re**, because skin friction does: roughly as $\\mathrm{Re}^{-1/2}$ for laminar layers and $\\mathrm{Re}^{-1/5}$ for turbulent ones. A fully turbulent 12 % section has $c_{d,\\min}$ about 0.008 at 6 million; with a long laminar run it can be nearer 0.005.
- **The stall changes character.** The same section may stall from the leading edge at high Re and from the trailing edge, or through a bursting bubble, at low Re; hysteresis grows as Re falls.

### Below a few hundred thousand: the bubble regime
At low Re the laminar boundary layer is fragile. Meeting the pressure rise behind the suction peak, it separates before it has become turbulent. The separated shear layer then becomes turbulent in the air above the surface and, if all goes well, falls back onto it: a **laminar separation bubble**. Short bubbles cost little; long ones spread the suction, add drag and can burst, stalling the section. Around 50 000–100 000, airfoils designed for full-size aircraft perform poorly, and sections designed for the purpose (Eppler, Selig and others; see [[special-airfoils]]) or simple **turbulators** — a trip strip, a zigzag tape, a row of bumps — do much better by forcing transition before separation. Below about 10 000, thin cambered plates beat any thick streamlined section; insects and small seeds use them.

### Consequences
- **Wind tunnels** test small models at Reynolds numbers ten to thirty times below flight. Engineers fix transition with trip strips, extrapolate, or use pressurised and cryogenic tunnels to raise Re (see [[similarity-testing]], [[wind-tunnel]]).
- **Roughness** acts like a lower Reynolds number: insects, rain, ice or poor paint at the leading edge trigger early transition and early separation, reducing $c_{l,\\max}$ and raising drag. Laminar sections are the most sensitive.
- **Scaling a design down** — a drone copying an aircraft wing, a model of a wind turbine — rarely scales its performance down with it.

> [!tip] In the simulation, choose Re = 100 000: the stall comes earlier and lower, and the hysteresis loop widens.
`,
  ideas: [
    'Re = ρVc/μ ranges from about 100 for small insects to tens of millions for airliners.',
    'Lift slope and zero-lift angle hardly depend on Re; maximum lift rises and minimum drag falls as Re increases.',
    'Below a few hundred thousand the laminar boundary layer separates before transition, forming laminar separation bubbles that add drag and cause early, hysteretic stalls.',
    'Turbulators, trip strips and low-Reynolds-number sections restore performance at small scale.',
    'Wind-tunnel models run at lower Re than full size, so their maximum lift and drag must be corrected.'
  ],
  pitfalls: [
    'A scale model in a tunnel at the same speed reproduces the full-size flow — Its Reynolds number is smaller by the scale factor, so its boundary layer, maximum lift and drag differ; only matching Re (and Mach) makes the flows similar.',
    'A lower Reynolds number gives more lift because the air is "stickier" — Maximum lift falls at low Re, because the laminar boundary layer separates more easily.',
    'Turbulent boundary layers are always worse — They have more skin friction, but they resist separation much better; at low Re, triggering turbulence on purpose often cuts total drag and raises maximum lift.'
  ],
  formulas: [
    {
      name: 'Chord Reynolds number',
      expr: 'Re = rho*V*c/mu', tex: '\\mathrm{Re} = \\dfrac{\\rho V c}{\\mu}',
      vars: {
        Re: { name: 'Reynolds number based on chord', tex: '\\mathrm{Re}' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, min: 0.3, max: 1.35, tex: '\\rho' },
        V: { name: 'airspeed', q: 'speed', unit: 'm/s', value: 50 },
        c: { name: 'chord', q: 'length', unit: 'm', value: 1.5 },
        mu: { name: 'dynamic viscosity of the air', q: 'viscosity', unit: 'Pa·s', value: 1.79e-5, tex: '\\mu' }
      },
      note: 'μ ≈ 1.79 × 10⁻⁵ Pa·s at 15 °C (ISA sea level), 1.42 × 10⁻⁵ Pa·s at −56.5 °C (11 km).',
      stories: { Re: 'A wing of {c} chord flies at {V} through air of density {rho} and viscosity {mu}. What is its chord Reynolds number?', V: 'A model wing of {c} chord must reach a Reynolds number of {Re} in air of density {rho} and viscosity {mu}. How fast must the tunnel run?' }
    },
    {
      name: 'Minimum section drag with a turbulent boundary layer (estimate)',
      expr: 'cd = 2*0.455/log(Re)^2.58*(1 + 2*tc + 100*tc^4)', tex: 'c_{d,\\min} \\approx \\dfrac{2 \\times 0.455}{(\\log_{10}\\mathrm{Re})^{2.58}}\\left(1 + 2\\tau + 100\\tau^4\\right)',
      vars: {
        cd: { name: 'minimum drag coefficient of the section', tex: 'c_{d,\\min}' },
        Re: { name: 'Reynolds number based on chord', value: 6e6, min: 1e5, max: 1e8, tex: '\\mathrm{Re}' },
        tc: { name: 'thickness ratio t/c', q: 'ratio', unit: '%', value: 12, min: 0, max: 30, tex: '\\tau' }
      },
      note: 'Two sides of flat-plate turbulent friction (Prandtl–Schlichting) times a form factor for thickness with maximum thickness near 30 % chord. Laminar flow over the front of the section lowers the real value.',
      stories: { cd: 'Estimate the minimum drag coefficient of a {tc} thick section with fully turbulent boundary layers at a Reynolds number of {Re}.' }
    }
  ],
  examples: [
    {
      title: 'A model glider',
      q: 'A model glider has a 0.2 m chord and flies at 12 m/s at sea level ($\\rho = 1.225$ kg/m³, $\\mu = 1.79 \\times 10^{-5}$ Pa·s). What is its Reynolds number, and what does that mean for its airfoil?',
      steps: [
        '$\\mathrm{Re} = 1.225 \\times 12 \\times 0.2/1.79 \\times 10^{-5} = 2.94/1.79 \\times 10^{-5} = 164\\,000$.',
        'That is in the laminar-bubble regime: a full-size section (designed for millions) would suffer early separation and drag. A low-Reynolds section, or a turbulator strip near the nose, suits it better.'
      ],
      a: 'About 160 000 — the bubble regime, where low-Reynolds sections pay off.'
    },
    {
      title: 'Airliner against its wind-tunnel model',
      q: 'An airliner wing with a 5 m mean chord cruises at 230 m/s at 11 km ($\\rho = 0.364$ kg/m³, $\\mu = 1.42 \\times 10^{-5}$ Pa·s). A 1:20 model is tested at 70 m/s in sea-level air. Compare their Reynolds numbers.',
      steps: [
        'Full size: $\\mathrm{Re} = 0.364 \\times 230 \\times 5/1.42 \\times 10^{-5} = 29.5$ million.',
        'Model: chord 0.25 m; $\\mathrm{Re} = 1.225 \\times 70 \\times 0.25/1.79 \\times 10^{-5} = 1.2$ million.',
        'The model runs at a Reynolds number 25 times too small — which is why pressurised and cryogenic tunnels exist.'
      ],
      a: 'About 30 million in flight against 1.2 million in the tunnel.'
    },
    {
      title: 'Estimating section drag',
      q: 'Estimate the minimum drag coefficient of a 12 % section at Re = 6 million with fully turbulent boundary layers.',
      steps: [
        '$\\log_{10}(6 \\times 10^6) = 6.78$; $6.78^{2.58} = 139$; one-side friction $0.455/139 = 0.00326$.',
        'Form factor: $1 + 2 \\times 0.12 + 100 \\times 0.12^4 = 1.26$.',
        '$c_{d,\\min} \\approx 2 \\times 0.00326 \\times 1.26 = 0.0082$.',
        'A smooth NACA 0012 with natural laminar flow over its front part measures about 0.0055; with a roughened leading edge (fully turbulent) close to this estimate.'
      ],
      a: 'About 0.008.'
    }
  ],
  quiz: [
    { q: 'As the Reynolds number rises, which changes most?', choices: ['the lift-curve slope', 'the zero-lift angle', 'the maximum lift coefficient and the minimum drag', 'nothing changes'], a: 2,
      why: 'Attached-flow lift is set by the pressure field and barely depends on Re; c_l,max (separation) and c_d (friction) depend strongly on the state of the boundary layer.' },
    { q: 'A lower Reynolds number generally gives a higher maximum lift coefficient.', a: false,
      why: 'Lower Re means a more laminar, fragile boundary layer that separates earlier; c_l,max falls.' },
    { q: 'What is a laminar separation bubble?', choices: ['a bubble of air trapped under the paint', 'a region where the laminar boundary layer separates, turns turbulent above the surface and reattaches', 'the wake behind a stalled wing', 'a pocket of supersonic flow'], a: 1,
      why: 'At low Re the laminar layer cannot survive the pressure rise; it separates, transition happens in the free shear layer, and the turbulent flow reattaches, enclosing a bubble.' },
    { q: 'What is the chord Reynolds number of a 1 m chord at 30 m/s in sea-level air (kinematic viscosity $1.46 \\times 10^{-5}$ m²/s)?', answer: 2.05e6, tol: 0.03,
      why: 'Re = Vc/ν = 30 × 1/1.46 × 10⁻⁵ = 2.05 million.' },
    { q: 'Why do many model aircraft carry a strip of zigzag tape near the leading edge?', choices: ['for decoration', 'to trip the boundary layer to turbulence before it can form a large laminar bubble', 'to add weight at the nose', 'to reduce the Reynolds number'], a: 1,
      why: 'A turbulator forces transition early, so the boundary layer can climb the pressure rise without a long separation bubble, cutting drag and raising maximum lift.' }
  ],
  problems: [
    { q: 'A wind-tunnel model with a 0.3 m chord must match a Reynolds number of 3 million in sea-level air ($\\mu = 1.79 \\times 10^{-5}$ Pa·s). How fast must the tunnel run?', answer: 146, unit: 'm/s', tol: 0.02,
      steps: ['$V = \\mathrm{Re}\\,\\mu/(\\rho c) = 3 \\times 10^6 \\times 1.79 \\times 10^{-5}/(1.225 \\times 0.3)$.', '$= 53.7/0.3675 = 146$ m/s — fast enough that compressibility starts to matter.'] }
  ],
  applications: ['Choosing airfoils for drones, model aircraft and small wind turbines.', 'Correcting wind-tunnel data to flight Reynolds numbers.', 'Turbulators on gliders and models; vortex generators on wind-turbine blades.', 'Understanding why insects, birds and aircraft use such different wing sections.'],
  sim: { id: 'foil-lift-curve', params: { foil: 'mid', re: 100000 } }
},

{
  id: 'high-lift-devices', parent: 'airfoil-behaviour', title: 'Flaps and slats', level: 2,
  short: 'Flaps and slats let a wing built for fast cruise also fly slowly for take-off and landing. Trailing-edge flaps add camber (and, if they slide back, area), shifting the lift curve upwards; leading-edge slats let the wing reach a higher angle before stalling. Together they can double the maximum lift.',
  keywords: ['flaps', 'slats', 'high-lift devices', 'plain flap', 'split flap', 'slotted flap', 'Fowler flap', 'double-slotted', 'Krueger flap', 'leading-edge slat', 'slot', 'CLmax', 'stall speed', 'landing configuration', 'flap effectiveness'],
  prereq: ['lift-curve', 'stall', 'lift-equation'],
  related: ['takeoff-landing', 'thin-airfoil-theory', 'pitching-moment', 'flow-control', 'stall-patterns', 'trim', 'control-surfaces', 'bird-flight'],
  body: `
A wing sized for cruise at 800 km/h would need an impossibly long runway if it had to land at the speed its clean $C_{L,\\max}$ allows. Stall speed goes as $1/\\sqrt{C_{L,\\max}}$ ([[lift-equation]]), so the cure is to raise $C_{L,\\max}$ for the slow phases of flight — with devices that fold away for cruise.

### Trailing-edge flaps: more camber, sometimes more area
- **Plain flap**: the rear 20–30 % of the chord hinges down. It adds camber, moving the lift curve up and to the left. Simple, but beyond about 20° the flow separates from its upper surface.
- **Split flap**: only the lower surface hinges down. About as effective as a plain flap, with more drag — useful on the approach.
- **Slotted flap**: the flap moves down and slightly back, opening a slot between it and the wing. The flow through the slot lets the flap work at larger deflections, 30–40°.
- **Fowler flap**: the flap first slides back on tracks, adding wing area, then turns down. Double- and triple-slotted Fowler flaps give the biggest increments; they are the rows of panels that unfold from an airliner's wing.

### Leading-edge devices: a higher stall angle
- **Slats** move forward and down, opening a slot behind them; **Krueger flaps** hinge out from the lower surface; **droop noses** simply bend the front of the wing down. None changes the lift at a given angle much. What they do is protect the upper surface from the tall suction peak that triggers the stall, so the lift curve **continues** to a higher angle — 5 to 10° more — before it bends over.

### How slots really work
The popular story is that the slot "blows high-energy air over the next surface". The real effects, set out by A. M. O. Smith in 1975, are subtler. The upstream element (a slat) runs its own circulation against the nose of the main wing, *lowering* the main element's suction peak (the slat effect). The downstream element raises the speed at the upstream element's trailing edge, so the upstream element can carry more load (the circulation effect) and discharge its boundary layer at a high speed (the dumping effect). And each element starts a **fresh, thin boundary layer**, far better at climbing a pressure rise than one long, tired layer.

### What they buy
Typical increments in section $c_{l,\\max}$ (rounded design-handbook values, multiplied by the chord extension where there is one):

| Device | $\\Delta c_{l,\\max}$ |
|---|---|
| plain or split flap | ≈ 0.9 |
| slotted flap | ≈ 1.3 |
| Fowler flap | ≈ 1.3 × extended chord ratio |
| double-slotted Fowler | ≈ 1.6 × extended chord ratio |
| leading-edge slat | ≈ 0.4 × extended chord ratio |
| Krueger flap | ≈ 0.3 |

An airliner's whole-aircraft $C_{L,\\max}$ rises from about 1.5 clean to 2.5–3 with everything out, cutting the stall speed by a quarter and the landing distance by nearly half.

### The costs
- **Drag** rises steeply with deflection — welcome on the approach, unwelcome on take-off, so take-off settings are smaller.
- **Pitching moment**: trailing-edge flaps load the rear of the wing and pitch the nose down; the tail must counter it ([[pitching-moment]], [[trim]]).
- **Weight, complexity, noise**, and a maximum speed at which each setting may be used, because the loads grow with $V^2$.

> [!warn] The flap and slat settings, and the speeds at which they may be extended, are set for each aircraft in its approved flight manual; the numbers here are typical values for explanation only.

> [!fact] Birds have a slat too: the **alula**, a small tuft of feathers on the leading edge of the wing, is raised during slow flight and landing to delay the stall ([[bird-flight]]).
`,
  ideas: [
    'Stall speed goes as 1/√C_L,max: raising C_L,max for take-off and landing lets a cruise-optimised wing fly slowly.',
    'Trailing-edge flaps add camber (Fowler flaps add area too): the lift curve moves up and left, C_L,max rises, the stall angle falls slightly.',
    'Leading-edge slats and Krueger flaps change little at a given angle but let the wing reach a higher angle before stalling.',
    'Slots work by the interaction of the elements\' circulations and by starting fresh boundary layers, not simply by "blowing" air.',
    'The price is drag, a nose-down pitching moment, weight and complexity.'
  ],
  pitfalls: [
    'Flaps increase lift by increasing the angle of attack — They increase camber (and sometimes area); the lift at a given angle of attack rises, and the stall actually comes at a slightly lower angle.',
    'Slots work by blowing high-energy air onto the next surface — The main effects are the circulation interaction between elements and the fresh boundary layer each element starts; the air in the slot is not especially energetic.',
    'More flap is always better for take-off — Large deflections add much more drag than lift; take-off uses moderate settings so the aircraft can accelerate and climb.'
  ],
  formulas: [
    {
      name: 'Stall speed with a higher maximum lift',
      expr: 'Vs2 = Vs1*sqrt(CL1/CL2)', tex: 'V_{s,2} = V_{s,1}\\sqrt{\\dfrac{C_{L,\\max,1}}{C_{L,\\max,2}}}',
      vars: {
        Vs2: { name: 'stall speed with the devices extended', q: 'speed', unit: 'kt', tex: 'V_{s,2}' },
        Vs1: { name: 'stall speed clean', q: 'speed', unit: 'kt', value: 145, tex: 'V_{s,1}' },
        CL1: { name: 'maximum lift coefficient clean', value: 1.5, min: 0.3, max: 5, tex: 'C_{L,\\max,1}' },
        CL2: { name: 'maximum lift coefficient with flaps and slats', value: 2.7, min: 0.3, max: 5, tex: 'C_{L,\\max,2}' }
      },
      note: 'Same weight, same air density. The approach speed is usually flown about 1.23 times the stall speed of the landing configuration.',
      stories: { Vs2: 'An airliner stalls at {Vs1} clean with C_L,max = {CL1}. With landing flaps and slats C_L,max is {CL2}. What is its stall speed now?', CL2: 'An aircraft that stalls at {Vs1} clean (C_L,max = {CL1}) must stall no faster than {Vs2} for landing. What maximum lift coefficient do its flaps need to give?' }
    },
    {
      name: 'Flap effectiveness (thin-airfoil theory)',
      expr: 'tau = 1 - (acos(2*E - 1) - sin(acos(2*E - 1)))/pi', tex: '\\tau = 1 - \\dfrac{\\theta_f - \\sin\\theta_f}{\\pi}, \\quad \\theta_f = \\arccos(2E - 1)',
      vars: {
        tau: { name: 'flap effectiveness τ = −dα₀/dδ', tex: '\\tau' },
        E: { name: 'flap chord ratio c_f/c', q: 'ratio', unit: '%', value: 25, min: 1, max: 100 }
      },
      note: 'How many degrees the zero-lift angle moves per degree of flap, for a thin section with an ideal, sealed plain flap. A 25 % flap moves it by 0.61° per degree.',
      stories: { tau: 'What is the thin-airfoil effectiveness of a flap spanning {E} of the chord?', E: 'What flap chord ratio gives a thin-airfoil flap effectiveness of {tau}?' }
    },
    {
      name: 'Shift of the zero-lift angle by a flap',
      expr: 'dalpha0 = -eta*tau*delta', tex: '\\Delta\\alpha_0 = -\\eta\\,\\tau\\,\\delta_f',
      vars: {
        dalpha0: { name: 'change of the zero-lift angle', q: 'angle', unit: '°', min: -40, max: 0, signed: true, tex: '\\Delta\\alpha_0' },
        eta: { name: 'real-flap efficiency factor (≈ 1 at small deflections)', value: 0.7, min: 0.2, max: 1, tex: '\\eta' },
        tau: { name: 'thin-airfoil flap effectiveness', value: 0.609, min: 0.01, max: 1, tex: '\\tau' },
        delta: { name: 'flap deflection', q: 'angle', unit: '°', value: 20, min: 0, max: 60, tex: '\\delta_f' }
      },
      note: 'The lift at a fixed angle rises by a·|Δα₀| (a ≈ 0.105 per degree). η falls with deflection as the flow on the flap separates: about 0.5 for a plain flap at 40°, higher for slotted flaps.',
      stories: { dalpha0: 'A flap with thin-airfoil effectiveness {tau} and efficiency factor {eta} is lowered {delta}. How far does the zero-lift angle move?', delta: 'How far must a flap (effectiveness {tau}, efficiency {eta}) be lowered to move the zero-lift angle by {dalpha0}?' }
    }
  ],
  examples: [
    {
      title: 'Landing flaps on an airliner',
      q: 'The airliner of the [[lift-equation]] page stalls at 145 kt clean with $C_{L,\\max} = 1.5$. With landing flaps and slats $C_{L,\\max} = 2.7$. What is its landing stall speed, and roughly how much shorter is the landing roll?',
      steps: [
        '$V_{s,2} = 145\\sqrt{1.5/2.7} = 145 \\times 0.745 = 108$ kt.',
        'The ground roll grows with the square of the touchdown speed: $(108/145)^2 = 0.56$.',
        'So, other things equal, the landing roll is about 44 % shorter.'
      ],
      a: 'About 108 kt, and a landing roll roughly 45 % shorter.'
    },
    {
      title: 'What a 30 % flap does at 20°',
      q: 'A 30 % chord plain flap is lowered 20° on a section with a lift slope of 0.105 per degree. With an efficiency factor of 0.7, how much does the zero-lift angle move, and how much lift does it add at a fixed angle of attack?',
      steps: [
        '$\\theta_f = \\arccos(2 \\times 0.3 - 1) = \\arccos(-0.4) = 1.982$ rad; $\\sin\\theta_f = 0.917$.',
        '$\\tau = 1 - (1.982 - 0.917)/\\pi = 0.661$.',
        '$\\Delta\\alpha_0 = -0.7 \\times 0.661 \\times 20 = -9.3°$.',
        'Lift increment at fixed angle: $0.105 \\times 9.3 = 0.97$.'
      ],
      a: 'The zero-lift angle moves by about −9°, adding about 1.0 to c_l at a given angle of attack.'
    }
  ],
  quiz: [
    { q: 'Lowering a trailing-edge flap moves the lift curve…', choices: ['up and to the left, with the stall at a slightly lower angle', 'to the right, with the same maximum lift', 'to higher angles without moving it up', 'nowhere: it only adds drag'], a: 0,
      why: 'Extra camber makes the zero-lift angle more negative, so at every angle there is more lift; the stall comes at a slightly smaller angle, but C_L,max is higher.' },
    { q: 'What does extending a leading-edge slat mainly do?', choices: ['raises the lift at every angle', 'lets the wing reach a higher angle before stalling, extending the lift curve', 'reduces the drag in cruise', 'moves the aerodynamic centre forward'], a: 1,
      why: 'A slat changes the lift at a given angle very little; it relieves the nose suction peak, so the flow stays attached to a higher angle and C_L,max rises.' },
    { q: 'Slotted flaps work mainly by blowing high-energy air from the lower surface onto the flap.', a: false,
      why: 'The main effects are the interaction of the elements\' circulations (which unloads the nose of each downstream element and lets each upstream one carry more) and the fresh boundary layer each element starts.' },
    { q: 'Flaps and slats raise $C_{L,\\max}$ from 1.6 to 2.5. By what factor does the stall speed change?', answer: 0.8, tol: 0.02,
      why: 'V_s ∝ 1/√C_L,max: √(1.6/2.5) = √0.64 = 0.8 — a 20 % lower stall speed.' },
    { q: 'Why is full landing flap not normally used for take-off?', choices: ['it reduces lift', 'it adds so much drag that the aircraft accelerates and climbs poorly', 'it moves the centre of gravity', 'it cannot be retracted in flight'], a: 1,
      why: 'Large deflections buy relatively little extra C_L,max for a lot of drag. Take-off needs acceleration and climb, so moderate settings are used.' }
  ],
  problems: [
    { q: 'What is the thin-airfoil effectiveness τ of a 20 % chord flap?', answer: 0.55, tol: 0.02,
      steps: ['$\\theta_f = \\arccos(2 \\times 0.2 - 1) = \\arccos(-0.6) = 2.214$ rad; $\\sin\\theta_f = 0.8$.', '$\\tau = 1 - (2.214 - 0.8)/\\pi = 1 - 0.450 = 0.55$.'] },
    { q: 'A light aircraft stalls at 53 kt clean with $C_{L,\\max} = 1.5$. What stall speed does full flap giving $C_{L,\\max} = 2.1$ produce?', answer: 44.8, unit: 'kt', tol: 0.02,
      steps: ['$V_{s,2} = 53\\sqrt{1.5/2.1} = 53 \\times 0.845 = 44.8$ kt.'] }
  ],
  applications: ['Airliner and business-jet wings with slats and multi-slotted Fowler flaps.', 'Short take-off and landing aircraft with full-span slots and large flaps.', 'Racing-car rear wings built of two or three elements with slots between them.', 'Wind-tunnel testing of high-lift systems, one of the hardest problems in computational aerodynamics.'],
  history: 'Frederick Handley Page and Gustav Lachmann independently invented the slotted wing around 1918–1919; Handley Page\'s slats soon became standard on many aircraft. Orville Wright and J. M. H. Jacobs patented the split flap in 1921, and Harlan Fowler\'s extending flap appeared in the late 1920s. A. M. O. Smith\'s 1975 paper "High-lift aerodynamics" corrected the long-standing "blowing" explanation of slots.',
  sim: { id: 'foil-high-lift', params: { flap: 'slotted', d: 25 } }
},

{
  id: 'special-airfoils', parent: 'airfoil-behaviour', title: 'Laminar, supercritical and low-Reynolds airfoils', level: 2,
  short: 'Modern airfoils are designed around their pressure distribution for a job: laminar sections keep the boundary layer laminar for low drag, supercritical sections let the air go supersonic gently over the top for fast airliners, and low-Reynolds sections cope with the fragile flow of drones, models and birds.',
  keywords: ['laminar airfoil', 'natural laminar flow', 'NLF', 'drag bucket', 'NACA 6-series', 'supercritical airfoil', 'Whitcomb', 'drag divergence', 'Korn equation', 'aft loading', 'low Reynolds number airfoil', 'Eppler', 'Selig', 'Wortmann', 'reflex airfoil', 'sailplane'],
  prereq: ['pressure-distribution', 'reynolds-effects-airfoil', 'transition', 'critical-mach'],
  related: ['naca-airfoils', 'skin-friction', 'transonic-flow', 'swept-wing-compressibility', 'wave-drag', 'drag-polar', 'insect-flight', 'wind-turbines', 'racing-downforce', 'flow-control', 'pitching-moment'],
  body: `
Since the 1930s airfoil design has moved from families of shapes to **designing the pressure distribution** a job needs and computing the shape that produces it. Three families show the idea most clearly.

### Laminar-flow sections: keeping the drag low
Skin friction under a laminar boundary layer is several times smaller than under a turbulent one — at a Reynolds number of 6 million, $C_f = 1.328/\\sqrt{\\mathrm{Re}} = 0.00054$ against 0.0033 for a turbulent layer. A laminar layer stays laminar where the pressure **falls** in the direction of flow. So laminar sections move the thickest point back to 40–50 % of the chord, keeping the pressure falling over the front half, then recover in a short, steep region near the back.
- The NACA **six-series** (1940s) introduced the idea: a "bucket" in the drag polar where $c_d$ drops to 0.004 or less, but only over a range of lift coefficients (the subscript in $64_2$-415 gives its half-width, ±0.2).
- It works only if the surface is **smooth and true**: a wave of a fraction of a millimetre, insect remains, rain or ice trip the layer and the advantage vanishes. Wartime production wings rarely achieved it; modern composite **sailplanes** do, with laminar flow over 60–95 % of some surfaces and lift-to-drag ratios of 50–70, and some business jets use natural-laminar-flow wings.

### Supercritical sections: flying close to Mach 1
As a subsonic airliner speeds up, the air over the top of the wing reaches the speed of sound first at the suction peak ([[critical-mach]]). A conventional section then grows a strong shock, which thickens the boundary layer and makes the drag rise steeply — **drag divergence**. Richard Whitcomb's **supercritical** sections (NASA, mid-1960s, flight-tested on an F-8 in 1971) accept the supersonic region but tame it:
- a **flatter upper surface** and a large nose radius spread the suction into a long, level "roof-top", so the supersonic pocket is shallow and ends in a **weak shock**;
- the lost upper-surface lift is recovered by **aft loading** — strong camber near the trailing edge, often with a cusp on the lower surface.

The gain can be taken as a higher cruise Mach number, a thicker (lighter, roomier) wing at the same Mach number, or less sweep. Every modern airliner wing descends from this idea. The price is a large nose-down pitching moment and a thin, highly loaded trailing edge. A quick estimate of the drag-divergence Mach number is Korn's equation (below): the technology factor $\\kappa_A$ is about 0.87 for conventional sections and 0.95 for supercritical ones.

### Low-Reynolds sections: small and slow
Below a few hundred thousand, the challenge is the **laminar separation bubble** ([[reynolds-effects-airfoil]]). Low-Reynolds sections — Eppler's, Selig's and many others for model aircraft, drones, small wind turbines and propellers — are thin (6–10 %), well cambered, and shaped so that transition happens early and gently, often helped by a turbulator. Below about 10 000, the thin cambered or even corrugated plates of insects and seeds beat any streamlined profile ([[insect-flight]]).

### And others
- **Symmetric sections** for aerobatic aircraft (which fly inverted as well as upright), tailplanes, fins and many rotor blades.
- **Reflexed sections**, with the trailing edge turned up, for flying wings and paragliders that must trim with no tail ([[pitching-moment]]).
- **Very thick root sections** (25–40 %) on wind-turbine blades, where strength matters more than drag ([[wind-turbines]]).
- **Highly cambered, inverted multi-element wings** on racing cars ([[racing-downforce]]).

| Family | Pressure distribution | Where |
|---|---|---|
| laminar | falling pressure over the front 40–60 %, then a short recovery | sailplanes, some business jets, propellers |
| supercritical | flat upper-surface roof-top, weak shock, strong aft loading | airliners and transport aircraft |
| low-Reynolds | gentle recovery, controlled bubble | drones, models, small turbines |
| reflexed | load near the front, trailing edge unloaded | flying wings, paragliders |
`,
  ideas: [
    'Modern airfoils are designed by choosing the pressure distribution for the job and computing the shape.',
    'Laminar sections keep the pressure falling over the front half so the boundary layer stays laminar, giving a low-drag "bucket" — if the surface is smooth.',
    'Supercritical sections flatten the upper-surface suction and add aft camber, so the supersonic region ends in a weak shock and drag rise is delayed.',
    'Low-Reynolds sections are thin and cambered, designed around the laminar separation bubble.',
    'Symmetric, reflexed and very thick sections serve aerobatics, flying wings and wind-turbine roots.'
  ],
  pitfalls: [
    'A laminar airfoil keeps its low drag in any condition — Only within its drag bucket (a range of lift coefficients), and only with a very smooth, clean surface; roughness, rain or insects trip the boundary layer.',
    'Supercritical airfoils prevent supersonic flow over the wing — They allow it, but shape it so that it ends in a weak shock with little drag; that is what "supercritical" means.',
    'A good full-size airfoil is also good for a small drone — At low Reynolds numbers the boundary layer behaves differently; sections designed for millions often perform poorly at tens of thousands.'
  ],
  formulas: [
    {
      name: 'Drag-divergence Mach number (Korn equation)',
      expr: 'Mdd = kA/cos(Lam) - tc/cos(Lam)^2 - cl/(10*cos(Lam)^3)', tex: 'M_{dd} = \\dfrac{\\kappa_A}{\\cos\\Lambda} - \\dfrac{\\tau}{\\cos^2\\Lambda} - \\dfrac{c_l}{10\\cos^3\\Lambda}',
      vars: {
        Mdd: { name: 'drag-divergence Mach number', tex: 'M_{dd}' },
        kA: { name: 'airfoil technology factor (≈ 0.87 conventional, ≈ 0.95 supercritical)', value: 0.95, min: 0.8, max: 1, tex: '\\kappa_A' },
        Lam: { name: 'wing sweep angle', q: 'angle', unit: '°', value: 25, min: 0, max: 45, tex: '\\Lambda' },
        tc: { name: 'thickness ratio t/c', q: 'ratio', unit: '%', value: 11, min: 2, max: 25, tex: '\\tau' },
        cl: { name: 'section lift coefficient', value: 0.5, min: 0, max: 1.2, tex: 'c_l' }
      },
      note: 'A quick design estimate (Korn, extended to sweep by Mason). With Λ = 0 it reads M_dd = κ_A − t/c − c_l/10.',
      stories: { Mdd: 'A wing swept {Lam} has {tc} thick sections with a technology factor of {kA} and cruises at c_l = {cl}. Estimate its drag-divergence Mach number.', tc: 'How thick can the sections of a wing swept {Lam} be (technology factor {kA}, c_l = {cl}) if the drag must not diverge below Mach {Mdd}?' }
    },
    {
      name: 'Laminar skin friction (Blasius)',
      expr: 'cf = 1.328/sqrt(Re)', tex: 'C_f = \\dfrac{1.328}{\\sqrt{\\mathrm{Re}}}',
      vars: {
        cf: { name: 'average skin-friction coefficient, one side', tex: 'C_f' },
        Re: { name: 'Reynolds number based on length', value: 6e6, min: 1000, max: 1e8, tex: '\\mathrm{Re}' }
      },
      note: 'A laminar flat plate. At the same Re a turbulent layer gives 0.455/(log₁₀Re)^2.58 — about six times more at 6 million: the prize laminar sections chase.',
      stories: { cf: 'What is the average skin-friction coefficient of a laminar boundary layer at a Reynolds number of {Re}?' }
    }
  ],
  examples: [
    {
      title: 'What supercritical sections buy',
      q: 'An unswept wing must cruise at Mach 0.78 with $c_l = 0.5$. How thick can its sections be before the drag diverges (a) with conventional sections ($\\kappa_A = 0.87$), (b) with supercritical ones ($\\kappa_A = 0.95$)?',
      steps: [
        'Unswept: $M_{dd} = \\kappa_A - t/c - c_l/10$, so $t/c = \\kappa_A - c_l/10 - M_{dd}$.',
        '(a) $0.87 - 0.05 - 0.78 = 0.04$: only 4 % thick.',
        '(b) $0.95 - 0.05 - 0.78 = 0.12$: 12 % thick — three times thicker, which means a much lighter wing with more room for fuel.',
        'Sweep helps both: at 25° of sweep the supercritical wing could reach $M_{dd} \\approx 0.85$ with 11 % sections.'
      ],
      a: 'About 4 % thick with conventional sections, about 12 % with supercritical ones.'
    },
    {
      title: 'The prize of laminar flow',
      q: 'Compare the one-side skin-friction coefficients of laminar and turbulent boundary layers at Re = 6 million.',
      steps: [
        'Laminar: $C_f = 1.328/\\sqrt{6 \\times 10^6} = 1.328/2449 = 0.00054$.',
        'Turbulent: $0.455/(\\log_{10} 6 \\times 10^6)^{2.58} = 0.455/139 = 0.0033$.',
        'Laminar flow has about one-sixth the friction. Keeping even half the chord laminar cuts a wing\'s friction drag substantially.'
      ],
      a: '0.00054 laminar against 0.0033 turbulent — a factor of six.'
    }
  ],
  quiz: [
    { q: 'What is the main purpose of a supercritical airfoil?', choices: ['to increase maximum lift for landing', 'to delay the steep drag rise at high subsonic Mach numbers', 'to keep the boundary layer laminar', 'to fly at very low Reynolds numbers'], a: 1,
      why: 'It shapes the supersonic region over the upper surface so it ends in a weak shock, delaying drag divergence; that allows higher speed or thicker wings.' },
    { q: 'A laminar-flow airfoil has low drag…', choices: ['at every lift coefficient', 'only within its drag bucket, and only with a smooth, clean surface', 'only when stalled', 'only in supersonic flight'], a: 1,
      why: 'Its favourable pressure gradient exists only over a range of c_l, and any roughness or contamination can trip the boundary layer to turbulence.' },
    { q: 'At a Reynolds number of about 10 000, a thin curved plate can outperform a thick streamlined airfoil.', a: true,
      why: 'At such low Re the laminar flow separates easily from thick sections; a thin cambered plate with a sharp leading edge fixes the separation point and gives better lift-to-drag. Insects exploit this.' },
    { q: 'By Korn\'s equation, what is the drag-divergence Mach number of an unswept wing with $\\kappa_A = 0.95$, 10 % thick sections and $c_l = 0.4$?', answer: 0.81, tol: 0.02,
      why: 'M_dd = 0.95 − 0.10 − 0.04 = 0.81.' },
    { q: 'Why are laminar-flow wings sensitive to insects and rain?', choices: ['the extra weight', 'the roughness trips the laminar boundary layer to turbulence, raising drag', 'water changes the air density', 'they block the pitot tubes'], a: 1,
      why: 'Transition is triggered by small disturbances; a few insect remains near the leading edge can make most of the surface turbulent.' }
  ],
  problems: [
    { q: 'An airliner wing is swept 30° and uses supercritical sections ($\\kappa_A = 0.95$) cruising at $c_l = 0.5$. How thick can the sections be for a drag-divergence Mach number of 0.85?', answer: 12.75, unit: '%', tol: 0.02,
      steps: ['$\\cos 30° = 0.866$: $\\kappa_A/\\cos\\Lambda = 1.097$; $c_l/(10\\cos^3\\Lambda) = 0.5/6.495 = 0.077$.', '$t/c = \\cos^2\\Lambda\\,(1.097 - 0.077 - 0.85) = 0.75 \\times 0.170 = 0.1275$.', 'About 12.7 %.'] }
  ],
  applications: ['Airliner wings (supercritical sections, often combined with sweep).', 'Sailplanes and some business jets (natural laminar flow).', 'Drones, model aircraft, small wind turbines and propellers (low-Reynolds sections).', 'Flying wings and paragliders (reflexed sections); racing cars (inverted multi-element wings).'],
  history: 'Eastman Jacobs\'s laminar-flow research at the NACA in the late 1930s led to the six-series; the P-51 Mustang\'s wing (1940) was among the first to use a laminar-type section, though production surfaces seldom stayed laminar. Richard Whitcomb developed the supercritical airfoil at NASA Langley in the 1960s; the F-8 supercritical-wing flight tests began in 1971. Low-Reynolds airfoil design grew with model aviation and, later, drones, through the work of Richard Eppler, F. X. Wortmann, Michael Selig and others.',
  sim: { id: 'foil-lift-curve', params: { foil: 'thin', re: 100000 } }
}

);
