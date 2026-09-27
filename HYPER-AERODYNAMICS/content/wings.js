/* HYPER-AERODYNAMICS · content/wings.js — the Wings branch: wing geometry (planform, aspect ratio, sweep,
 * taper and twist) and the finite wing (tip vortices, downwash, induced drag, lifting-line theory, the
 * elliptic loading, Oswald efficiency, winglets, ground effect, stall patterns and delta wings).
 * Simulations in sims/wings.js. */
Hyper.add(

/* ================================================================ WING GEOMETRY */
{
  id: 'wing-planform', parent: 'wing-geometry', title: 'Wing planform', level: 1,
  short: 'The shape of a wing seen from above: its span, chords, area, taper and sweep. The planform decides how a wing spreads its lift along the span — and so its induced drag, where it stalls first and how fast it can fly.',
  keywords: ['planform', 'span', 'chord', 'root chord', 'tip chord', 'wing area', 'reference area', 'mean aerodynamic chord', 'MAC', 'mean geometric chord', 'rectangular wing', 'tapered wing', 'elliptical wing', 'swept wing', 'delta wing'],
  prereq: ['airfoil-geometry', 'lift-equation'],
  related: ['aspect-ratio', 'sweep', 'taper-twist', 'elliptic-lift', 'stall-patterns', 'delta-wings', 'center-of-gravity'],
  body: `
Cut a wing across and you see an airfoil; look down on it from above and you see its **planform**. The airfoil decides how each slice of wing turns the air. The planform decides how the slices share the work: how much lift each part of the span carries, how much the wing pays in [[induced-drag|induced drag]], which part [[stall|stalls]] first, and how fast the aircraft can fly before the air begins to [[compressibility|compress]].

### The measurements
- **Span** $b$: tip to tip in a straight line, including the part of the wing hidden by the fuselage.
- **Chord** $c(y)$: leading edge to trailing edge at a station $y$ out from the centreline — the **root chord** $c_r$ at the centreline, the **tip chord** $c_t$ at the tip.
- **Wing area** $S$: the area seen from above. By convention the leading and trailing edges are continued straight through the fuselage to the centreline, so the reference area in the [[lift-equation|lift equation]] is a little larger than the wing you could touch. Coefficients are only comparable when the reference area is stated.
- **Taper ratio** $\\lambda = c_t/c_r$ and **sweep** $\\Lambda$, the angle of the leading edge or of the quarter-chord line (see [[taper-twist]] and [[sweep]]).
- **Mean chords**: the mean geometric chord $S/b$, and the **mean aerodynamic chord** (MAC), the chord of the rectangular wing that would have the same lift and pitching moment. Balance is quoted against it: "the centre of gravity is at 25 % MAC".

For a straight-tapered wing, $S = \\tfrac12 b\\,c_r(1+\\lambda)$; the MAC is $\\tfrac23 c_r(1+\\lambda+\\lambda^2)/(1+\\lambda)$ and lies $\\tfrac{b}{6}(1+2\\lambda)/(1+\\lambda)$ out from the centreline — inboard of mid-semi-span, because the long inner chords weigh most.

### A family of shapes
| Planform | Example | Span | Area | Aspect ratio | Why this shape |
|---|---|---|---|---|---|
| Rectangular | Piper Cub | 10.7 m | 16.6 m² | 6.9 | cheap ribs all alike; gentle root stall |
| Tapered | Cessna 172 (outer panels) | 11.0 m | 16.2 m² | 7.5 | lighter structure, nearly elliptic loading |
| Elliptical | Supermarine Spitfire | 11.2 m | 22.5 m² | 5.6 | least induced drag; a thin yet roomy root |
| Swept and tapered | Airbus A320 | 34.1 m | 122.6 m² | 9.5 | cruise near Mach 0.8 |
| Multi-taper | 15 m sailplane | 15 m | 10.5 m² | 21 | very low induced drag |
| Delta | Concorde | 25.6 m | 358 m² | 1.8 | supersonic cruise; vortex lift for landing |

### What the shape does
Lift cannot be spread evenly along a real wing: it must fall to zero at the tips, where the pressure difference leaks round into the [[wingtip-vortices|tip vortices]]. The planform shapes that fall-off. A rectangular wing has plenty of chord at its tips and carries more lift there than the ideal; a strongly tapered wing carries less, but asks its small tip sections to work at high lift coefficients; an untwisted elliptical planform gets the ideal [[elliptic-lift|elliptic loading]] exactly. Sweeping back moves the load outboard, sweeping forward moves it inboard. Try all of these in the planform designer below.

> [!key] Three numbers summarise most planforms: the aspect ratio (slenderness, and with it induced drag), the taper ratio (how load and structure are spread) and the sweep (high-speed behaviour).

A planform is always a compromise with the structure — the root carries the bending moment of the whole half-wing, so designers like deep roots and light tips — with fuel, landing gear and control surfaces that must fit, and with the stall, which should begin at the root where it warns the pilot and leaves the ailerons working (see [[stall-patterns]]).
`,
  ideas: [
    'The planform is the wing seen from above: span, chords, area, taper ratio and sweep.',
    'Wing area is a reference area, continued through the fuselage to the centreline.',
    'The mean aerodynamic chord is the yardstick for balance: centre-of-gravity limits are quoted in per cent of MAC.',
    'The planform sets how lift is spread along the span — and so the induced drag and where the wing stalls first.'
  ],
  pitfalls: [
    'Wing area is only the part of the wing outside the fuselage — By convention the reference area runs through the fuselage to the centreline; coefficients are always quoted against a stated area, and mixing conventions gives wrong lift coefficients.',
    'The mean aerodynamic chord is the average chord — The average (mean geometric) chord is S/b; the MAC weights each chord by itself, so on a tapered wing it is longer and lies nearer the root.',
    'Only an elliptical planform can give elliptic lift — Taper and twist can give almost the same loading; a straight wing with a taper ratio near 0.4 comes within about 1 % of the ideal induced drag.'
  ],
  formulas: [
    {
      name: 'Area of a straight-tapered wing',
      expr: 'S = b*cr*(1 + lam)/2', tex: 'S = \\tfrac12\\, b\\, c_r\\,(1+\\lambda)',
      vars: {
        S: { name: 'wing (reference) area', q: 'area', unit: 'm²' },
        b: { name: 'span', q: 'length', unit: 'm', value: 10 },
        cr: { name: 'root chord', q: 'length', unit: 'm', value: 1.8, tex: 'c_r' },
        lam: { name: 'taper ratio c_t/c_r', value: 0.6, min: 0, max: 1, tex: '\\lambda' }
      },
      note: 'The two halves are trapezoids; the root chord is taken at the centreline, with the edges continued through the fuselage.',
      stories: {
        S: 'A wing spans {b} with a root chord of {cr} and a taper ratio of {lam}. What is its area?',
        cr: 'A wing of {S} and span {b} has a taper ratio of {lam}. What is its root chord?'
      }
    },
    {
      name: 'Mean aerodynamic chord',
      expr: 'cmac = 2/3*cr*(1 + lam + lam^2)/(1 + lam)', tex: '\\bar{c} = \\tfrac23\\, c_r\\, \\dfrac{1+\\lambda+\\lambda^2}{1+\\lambda}',
      vars: {
        cmac: { name: 'mean aerodynamic chord', q: 'length', unit: 'm', tex: '\\bar{c}' },
        cr: { name: 'root chord', q: 'length', unit: 'm', value: 1.8, tex: 'c_r' },
        lam: { name: 'taper ratio c_t/c_r', value: 0.6, min: 0, max: 1, tex: '\\lambda' }
      },
      note: 'For a straight-tapered wing. λ = 1 (rectangular) gives the chord itself; λ = 0 (a pointed tip) gives two-thirds of the root chord.',
      stories: { cmac: 'A tapered wing has a root chord of {cr} and a taper ratio of {lam}. What is its mean aerodynamic chord?' }
    },
    {
      name: 'Spanwise position of the MAC',
      expr: 'yMAC = b/6*(1 + 2*lam)/(1 + lam)', tex: 'y_{\\bar{c}} = \\dfrac{b}{6}\\,\\dfrac{1+2\\lambda}{1+\\lambda}',
      vars: {
        yMAC: { name: 'distance of the MAC from the centreline', q: 'length', unit: 'm', tex: 'y_{\\bar{c}}' },
        b: { name: 'span', q: 'length', unit: 'm', value: 10 },
        lam: { name: 'taper ratio c_t/c_r', value: 0.6, min: 0, max: 1, tex: '\\lambda' }
      },
      note: 'Between b/6 (a pointed tip) and b/4 (a rectangular wing): always inboard of the middle of each half-wing.',
      stories: { yMAC: 'Where along each half of a {b} wing with a taper ratio of {lam} does the mean aerodynamic chord lie?' }
    }
  ],
  examples: [
    {
      title: 'The numbers of a tapered wing',
      q: 'A light-aircraft wing spans 10 m, with a root chord of 1.8 m and a tip chord of 1.08 m. Find its taper ratio, area, aspect ratio and mean aerodynamic chord, and where the MAC lies.',
      steps: [
        'Taper ratio: $\\lambda = 1.08/1.8 = 0.60$.',
        'Area: $S = \\tfrac12 \\times 10 \\times 1.8 \\times 1.6 = 14.4$ m²; the mean geometric chord is $S/b = 1.44$ m and $\\mathrm{AR} = b^2/S = 100/14.4 = 6.9$.',
        'MAC: $\\tfrac23 \\times 1.8 \\times (1 + 0.6 + 0.36)/1.6 = 1.2 \\times 1.225 = 1.47$ m — a little longer than the mean geometric chord.',
        'Position: $\\tfrac{10}{6} \\times (1 + 1.2)/1.6 = 2.29$ m from the centreline, 46 % of the way out along each half-wing.'
      ],
      a: 'λ = 0.6, S = 14.4 m², AR = 6.9, MAC = 1.47 m at 2.29 m from the centreline.'
    },
    {
      title: 'Same span, same area, different shape',
      q: 'Two wings both span 12 m and have 18 m² of area. One is rectangular; the other has a taper ratio of 0.5. Compare their chords and MACs.',
      steps: [
        'Rectangular: chord $= S/b = 1.5$ m everywhere; the MAC is 1.5 m.',
        'Tapered: $c_r = 2S/[b(1+\\lambda)] = 36/18 = 2.0$ m, and $c_t = 1.0$ m.',
        'MAC: $\\tfrac23 \\times 2.0 \\times 1.75/1.5 = 1.56$ m, at $\\tfrac{12}{6} \\times 2/1.5 = 2.67$ m from the centreline.',
        'Both have AR = 144/18 = 8. The tapered wing puts more area inboard: less bending moment at the root, a loading closer to elliptic.'
      ],
      a: 'Same aspect ratio (8); the tapered wing has a 2.0 m root and a 1.0 m tip, and a MAC of 1.56 m.'
    }
  ],
  quiz: [
    { q: 'Two wings have the same span and the same area; one is rectangular, the other tapered with λ = 0.4. Their aspect ratios are…', choices: ['the same', 'larger for the tapered wing', 'larger for the rectangular wing', 'impossible to compare without the airfoil'], a: 0,
      why: 'AR = b²/S depends only on span and area. Taper changes how the area is spread along the span, not the aspect ratio.' },
    { q: 'What is the area of a straight-tapered wing of 9 m span with a root chord of 1.6 m and a tip chord of 0.8 m?', answer: 10.8, unit: 'm²',
      why: 'S = ½ b (c_r + c_t) = ½ × 9 × 2.4 = 10.8 m².' },
    { q: 'The mean aerodynamic chord of a rectangular wing equals its chord.', a: true,
      why: 'With λ = 1 the formula gives (2/3)c × 3/2 = c: every chord is the same, so is their weighted mean.' },
    { q: 'Why is the root of a wing usually given the longest chord?', choices: ['The root carries the bending moment of the whole half-wing, and a long chord allows a deep, light spar', 'The air is faster near the fuselage', 'To move the centre of gravity forward', 'A long root chord reduces skin friction'], a: 0,
      why: 'For a given thickness ratio, a longer chord means a deeper wing and a deeper spar, which carries bending far more efficiently. Taper also moves lift inboard, reducing the moment itself.' },
    { q: 'On a tapered wing the mean aerodynamic chord lies…', choices: ['inboard of the middle of each half-wing', 'exactly at the middle of each half-wing', 'outboard of the middle', 'at the tip'], a: 0,
      why: 'y = (b/6)(1 + 2λ)/(1 + λ): for λ = 0.5 that is 0.22 b, 44 % of the half-span. Only a rectangular wing has its MAC at the middle (b/4).' }
  ],
  problems: [
    { q: 'A sailplane wing spans 15 m with a root chord of 1.0 m and a tip chord of 0.4 m (straight taper). What is its mean aerodynamic chord?', answer: 0.743, unit: 'm', tol: 0.02,
      steps: ['$\\lambda = 0.4$.', '$\\bar c = \\tfrac23 \\times 1.0 \\times (1 + 0.4 + 0.16)/1.4 = 0.667 \\times 1.114 = 0.743$ m.'] }
  ],
  applications: [
    'Choosing a wing for a new design: span from induced drag and the airport gate, area from the landing speed, taper and sweep from the structure and the cruise Mach number.',
    'Weight and balance: centre-of-gravity limits in a flight manual are often given in per cent of the mean aerodynamic chord.',
    'Model aircraft and drones, where a rectangular wing is simplest to build and a tapered one flies more efficiently.'
  ],
  history: 'The first aeroplanes had rectangular wings, easy to build from ribs of one size. Tapered and elliptical planforms followed the lifting-line theory of Prandtl\'s group in Göttingen (1918–1919), which showed how the planform sets the induced drag. The Spitfire\'s elliptical wing of 1936 is the famous example — although its designers valued as much a wing that was thin and still had room for guns and undercarriage.',
  sim: 'wing-planform'
},

{
  id: 'aspect-ratio', parent: 'wing-geometry', title: 'Aspect ratio', level: 1,
  short: 'Aspect ratio, AR = b²/S, measures how long and slender a wing is. It is the most important single number for induced drag: sailplanes use 20–50, airliners 8–11, light aircraft about 7, fighters 2–4.',
  keywords: ['aspect ratio', 'AR', 'span', 'slender wing', 'induced drag', 'lift slope', 'finite wing', 'sailplane', 'albatross', 'span loading', 'folding wingtips'],
  prereq: ['wing-planform', 'lift-equation'],
  related: ['induced-drag', 'lifting-line', 'oswald-efficiency', 'lift-curve', 'gliding', 'bird-flight', 'lift-to-drag', 'flutter'],
  body: `
The **aspect ratio** compares a wing's span with its chord:

$$\\mathrm{AR} = \\frac{b^2}{S} = \\frac{b}{\\bar c}$$

where $\\bar c = S/b$ is the mean chord. A wing 10 m long with a 1.25 m chord has AR = 8; stretch it to 15 m at the same area and the chord shrinks to 0.83 m and AR rises to 18.

### Why slender wings are efficient
A wing lifts by deflecting air downward, and a finite wing does it by leaving two [[wingtip-vortices|tip vortices]] behind. The air it acts on is, roughly, a stream as wide as its span. A long wing works on a wide stream and needs to push it down only gently; a short wing, to make the same lift, must push a narrow stream down hard, and the energy left in that [[downwash]] is the [[induced-drag|induced drag]]:

$$C_{D,i} = \\frac{C_L^2}{\\pi\\,\\mathrm{AR}\\,e}$$

where $e$, the span efficiency, is close to 1 for a good planform. Doubling the aspect ratio halves the induced-drag coefficient.

The aspect ratio also sets the **lift slope**. An airfoil (an infinitely long wing) gains about 0.11 in lift coefficient per degree; a finite wing gains less, because its downwash takes part of every extra degree away:

$$a = \\frac{a_0}{1 + a_0/(\\pi\\,\\mathrm{AR}\\,e)}$$

With $a_0 = 2\\pi$ per radian and $e = 0.95$: 0.087 per degree at AR = 8, 0.072 at AR = 4, 0.103 at AR = 30. Low-aspect-ratio wings must fly at large angles to lift — one reason Concorde landed nose-high (see [[delta-wings]]).

### Real wings
| | Span | Aspect ratio |
|---|---|---|
| Open-class sailplane | 25–31 m | 35–50 |
| Wandering albatross | 3.4 m | about 15 |
| Long-range airliner | 60–65 m | 9–10 |
| Narrow-body airliner (A320) | 34.1 m | 9.5 |
| Light aircraft (Cessna 172) | 11.0 m | 7.5 |
| Fighter (F-16) | 9.5 m | 3.2 |
| Concorde | 25.6 m | 1.8 |

### Why not longer?
If slender wings are so good, why stop at 10? Because each half-wing is a cantilever: spread the same lift over a longer span and the bending moment at the root grows faster than the span, so a long, thin wing needs a heavy spar. Long wings are also more flexible (see [[flutter]]), roll more slowly, hold less fuel, and have small chords that work at a lower [[reynolds-number|Reynolds number]]. For airliners there is also the airport: the largest gates are 80 m wide, which is why the Boeing 777X folds its wingtips up on the ground (71.8 m in flight, 64.8 m at the gate). Carbon-fibre structures have pushed airliner aspect ratios from about 8 to about 10.

> [!key] At a given weight and speed, induced drag depends on the **span**, not on the aspect ratio: $D_i = W^2/(q\\,\\pi b^2 e)$. Aspect ratio matters when the wing area is fixed — which it usually is, by the landing speed.
`,
  ideas: [
    'AR = b²/S = b/c̄: span over mean chord.',
    'The induced-drag coefficient falls as 1/AR: C_Di = C_L²/(πAR e).',
    'A finite wing\'s lift slope, a₀/(1 + a₀/(πAR e)), approaches the airfoil\'s only for very slender wings.',
    'Span is limited by structural weight, stiffness, roll rate and airport gates, so aspect ratio is always a compromise.'
  ],
  pitfalls: [
    'A high-aspect-ratio wing always has less drag — It has less induced drag; at high speed, where parasite drag dominates, the extra weight and wetted area of a long wing can cost more than it saves.',
    'Aspect ratio alone sets the induced drag — At a given weight and speed the induced drag force depends on span squared: a wing with the same span but half the area has twice the AR and exactly the same induced drag.',
    'Low-aspect-ratio wings cannot lift much — They gain less lift per degree, but they can fly to very high angles; slender delta wings reach lift coefficients above 1 at 30° or more.'
  ],
  formulas: [
    {
      name: 'Aspect ratio',
      expr: 'AR = b^2/S', tex: '\\mathrm{AR} = \\dfrac{b^2}{S}',
      vars: {
        AR: { name: 'aspect ratio', tex: '\\mathrm{AR}' },
        b: { name: 'span', q: 'length', unit: 'm', value: 34.1 },
        S: { name: 'wing area', q: 'area', unit: 'm²', value: 122.6 }
      },
      note: 'For a rectangular wing this is simply span ÷ chord.',
      stories: {
        AR: 'An airliner has a span of {b} and a wing area of {S}. What is its aspect ratio?',
        b: 'A sailplane needs an aspect ratio of {AR} with {S} of wing. What span must it have?'
      }
    },
    {
      name: 'Lift slope of a finite wing',
      expr: 'a = a0/(1 + a0/(pi*AR*eo))', tex: 'a = \\dfrac{a_0}{1 + a_0/(\\pi\\,\\mathrm{AR}\\,e)}',
      vars: {
        a: { name: 'lift slope of the wing (per radian)' },
        a0: { name: 'lift slope of the airfoil (per radian)', value: 6.0, min: 1, max: 7, tex: 'a_0' },
        AR: { name: 'aspect ratio', value: 8, min: 0.5, max: 60, tex: '\\mathrm{AR}' },
        eo: { name: 'span efficiency', value: 0.95, min: 0.3, max: 1, tex: 'e' }
      },
      note: 'Per radian; divide by 57.3 for per degree. Thin-airfoil theory gives a₀ = 2π; real sections about 6.0. From lifting-line theory, for straight wings of moderate to high aspect ratio (strictly the e here is a slightly different factor from the induced-drag one, but close to it).',
      stories: {
        a: 'A wing of aspect ratio {AR} and span efficiency {eo} uses an airfoil with a lift slope of {a0} per radian. What is the wing\'s lift slope, per radian?',
        AR: 'A wing with span efficiency {eo} built from an airfoil of lift slope {a0} per radian must reach a lift slope of {a} per radian. What aspect ratio does it need?'
      }
    }
  ],
  examples: [
    {
      title: 'Stretching a sailplane',
      q: 'A 15 m sailplane has 10.5 m² of wing. Tip extensions take it to 18 m and 11.4 m². Find both aspect ratios, and the change in induced drag at the same weight, speed and span efficiency.',
      steps: [
        'Before: $\\mathrm{AR} = 15^2/10.5 = 21.4$. After: $18^2/11.4 = 28.4$.',
        'Induced drag force at the same weight and speed goes as $1/b^2$: $(15/18)^2 = 0.69$.',
        'So the induced drag falls by 31 % — more than the 25 % rise in aspect ratio alone would suggest, because the span grew and the area grew only a little.'
      ],
      a: 'AR 21.4 → 28.4, and 31 % less induced drag at the same weight and speed.'
    },
    {
      title: 'Lift slope of a fighter and an airliner',
      q: 'Compare the lift slopes of a fighter wing (AR = 3.2) and an airliner wing (AR = 9.5), both with $a_0 = 6.0$ per radian and $e = 0.9$. What angle from zero lift does each need for $C_L = 0.6$?',
      steps: [
        'Fighter: $a = 6.0/(1 + 6.0/(\\pi \\times 3.2 \\times 0.9)) = 6.0/1.663 = 3.61$ per radian, 0.063 per degree.',
        'Airliner: $a = 6.0/(1 + 6.0/26.9) = 6.0/1.223 = 4.90$ per radian, 0.086 per degree.',
        'For $C_L = 0.6$: the fighter needs 0.6/0.063 = 9.5°, the airliner 0.6/0.086 = 7.0°.'
      ],
      a: 'About 0.063 and 0.086 per degree: 9.5° against 7.0° for the same lift coefficient.'
    }
  ],
  quiz: [
    { q: 'A wing has a span of 12 m and an area of 16 m². What is its aspect ratio?', answer: 9,
      why: 'AR = b²/S = 144/16 = 9.' },
    { q: 'At the same weight, speed and span efficiency, which change halves the induced drag?', choices: ['increasing the span by about 41 %', 'doubling the wing area at the same span', 'doubling the aspect ratio by halving the area at the same span', 'halving the chord'], a: 0,
      why: 'D_i = W²/(qπb²e): halving it needs b² to double, so b × √2 = 1.41 b. Changing the area at the same span changes C_L and AR together and leaves the induced drag force unchanged.' },
    { q: 'A finite wing reaches the same lift coefficient as its airfoil at the same angle of attack.', a: false,
      why: 'The downwash of its trailing vortices lowers the effective angle of every section, so the wing\'s lift slope is smaller: 0.087 per degree at AR 8 against about 0.11 for the airfoil.' },
    { q: 'Why do airliners not use the aspect ratios of 30 found on sailplanes?', choices: ['the root bending moment, and so the structural weight, grows rapidly with span, and airports limit the span', 'high aspect ratio increases induced drag at cruise', 'long wings cannot be swept', 'they would stall at higher speed'], a: 0,
      why: 'The structure, flexibility, fuel volume and gate width all argue against very long wings on a heavy aircraft; the best aspect ratio balances induced drag against weight.' },
    { q: 'An airfoil has a lift slope of 2π per radian. What is the lift slope, per degree, of an elliptic wing (e = 1) of aspect ratio 6 made from it?', answer: 0.0822,
      why: 'a = 2π/(1 + 2π/(6π)) = 6.283/1.333 = 4.71 per radian = 0.0822 per degree.' }
  ],
  problems: [
    { q: 'A long-range airliner has a span of 71.8 m and 517 m² of wing. What is its aspect ratio?', answer: 9.97, tol: 0.02,
      steps: ['$\\mathrm{AR} = 71.8^2/517 = 5155/517 = 9.97$.'] }
  ],
  applications: [
    'Sailplanes: aspect ratios of 20–50 give glide ratios of 40–70.',
    'Airliner design: raising the aspect ratio from about 8 to about 10 with carbon-fibre wings or folding tips saves several per cent of fuel.',
    'Birds: long, narrow albatross wings for soaring over the sea; short, broad wings for dodging through woodland.',
    'Human-powered and solar aircraft, with aspect ratios of 30 or more to keep the power needed small.'
  ],
  history: 'Otto Lilienthal and the Wright brothers learnt by experiment that long, narrow wings lift more efficiently; the Wrights measured it in their 1901 wind tunnel and gave their 1902 glider a longer, narrower wing. Prandtl\'s lifting-line theory (1918–1919) explained why, and put the aspect ratio into the induced-drag formula still used today.',
  sim: ['wing-drag-speed', { id: 'wing-planform', params: { AR: 20 } }]
},

{
  id: 'sweep', parent: 'wing-geometry', title: 'Wing sweep', level: 2,
  short: 'Sweeping a wing back (or forward) lets it fly closer to the speed of sound, because its sections feel mainly the part of the airspeed square to the leading edge. The price: less lift per degree, a lower maximum lift, tip stall and pitch-up.',
  keywords: ['sweep', 'swept wing', 'sweepback', 'forward sweep', 'sweep angle', 'critical Mach number', 'normal Mach number', 'simple sweep theory', 'Busemann', 'pitch-up', 'variable sweep', 'quarter-chord sweep', 'spanwise flow', 'Helmbold'],
  prereq: ['wing-planform', 'mach-number', 'critical-mach'],
  related: ['swept-wing-compressibility', 'transonic-flow', 'stall-patterns', 'delta-wings', 'lateral-stability', 'dutch-roll', 'taper-twist', 'wave-drag'],
  body: `
A swept wing is angled back from the fuselage by the **sweep angle** $\\Lambda$, usually quoted for the quarter-chord line (on a tapered wing the leading edge is swept a few degrees more). Almost every jet airliner is swept 25–35°; a light aircraft not at all.

### Only the normal component counts
Picture an infinitely long wing yawed at $\\Lambda$ to the stream. Split the airspeed into a part along the span, $V\\sin\\Lambda$, and a part square to the leading edge, $V\\cos\\Lambda$. Sliding along a uniform wing changes nothing about the pressure: only the normal part speeds up over the airfoil and makes suction. So the sections behave as if they flew at

$$M_n = M\\cos\\Lambda$$

This is **simple sweep theory** (Busemann, 1935). An airfoil that meets its [[critical-mach|critical Mach number]] — the first shock waves, then the steep rise of [[wave-drag|wave drag]] — at Mach 0.72 could, swept 30°, ideally fly at $0.72/\\cos 30° = 0.83$. Real wings get less than the full gain, because the root and the tip do not behave like parts of an infinite yawed wing; a common rule of thumb scales the critical Mach number by $1/\\sqrt{\\cos\\Lambda}$ instead. Sweep and supercritical airfoils together make Mach 0.78–0.85 cruise possible (see [[swept-wing-compressibility]]); supersonic aircraft sweep further, to keep the leading edge inside the [[mach-cone|Mach cone]].

### The price at low speed
The same cosine works against lift: the sections feel only $V\\cos\\Lambda$, and the lift slope falls. A good estimate for low speeds is Helmbold's formula, extended for sweep and compressibility (the form used in the USAF DATCOM):

$$a = \\frac{2\\pi\\,\\mathrm{AR}}{2 + \\sqrt{\\mathrm{AR}^2\\,(1 - M^2 + \\tan^2\\Lambda_{c/2}) + 4}}$$

A wing of aspect ratio 9.5 loses about 8 % of its lift slope at 25° of half-chord sweep and 20 % at 40°. Maximum lift falls too, roughly with $\\cos\\Lambda$ — which is why swept-wing airliners carry elaborate [[high-lift-devices|slats and flaps]].

The spanwise component matters as well. On a swept-back wing the loading moves outboard, and the boundary layer drifts outward along the span and thickens at the tips; both push the stall towards the tips (see [[stall-patterns]]). The tips lie behind the centre of gravity, so losing their lift pitches the nose **up**, deeper into the stall — the notorious **pitch-up** of the early swept-wing fighters. Wing fences, saw-tooth leading edges, vortex generators, washout and carefully scheduled slats are the cures.

| Aircraft | Sweep (quarter chord) | Typical cruise |
|---|---|---|
| Boeing 737, Airbus A320 | 25° | Mach 0.78 |
| Boeing 787 | 32° | Mach 0.85 |
| Boeing 747 | 37.5° | Mach 0.85 |
| F-86 Sabre (1947) | 35° | high subsonic fighter |

### Other effects
- **Dihedral effect.** A swept-back wing in a sideslip presents its leading wing more squarely to the air; that wing lifts more and rolls the aircraft away from the slip. As a rule of thumb, 10° of sweep acts like about 1° of dihedral (more at high lift), which is one reason swept-wing airliners need yaw dampers against [[dutch-roll|Dutch roll]].
- **Aeroelasticity.** A swept-back wing that bends upward also twists its tips nose-down, which relieves loads but weakens the ailerons. A swept-**forward** wing twists its tips nose-up and can diverge; only tailored carbon-fibre skins made the Grumman X-29 (1984) practical.
- **Variable sweep** gives both worlds — spread for takeoff, landing and loiter, swept for the dash: the F-111, the F-14 (20–68°), the Tornado and the B-1B.

> [!note] Sweep is chosen for high speed and paid for at low speed. A propeller aircraft cruising at Mach 0.5 gains nothing from it.
`,
  ideas: [
    'A swept wing\'s sections feel mainly the flow square to the leading edge: M_n = M cos Λ.',
    'Sweep raises the critical Mach number and delays wave drag; that is why jet airliners are swept 25–35°.',
    'Sweep lowers the lift slope and the maximum lift, and moves the loading outboard.',
    'Swept-back wings tend to stall at the tips and pitch up; swept-forward wings stall at the root but risk aeroelastic divergence.'
  ],
  pitfalls: [
    'Sweep helps at all speeds — It pays only near the speed of sound; at low speed it lowers the lift slope and C_L,max and makes the stall worse.',
    'A wing swept 30° behaves in every respect like a wing flying at M cos 30° — The cosine rule holds for an infinite yawed wing; the root and tips give back part of the gain, so real wings get less than the full 1/cos Λ.',
    'Forward-swept wings are unstable in pitch — Their problem is structural divergence, from bending that twists the tips nose-up; aerodynamically they stall root first, which keeps the ailerons working.'
  ],
  formulas: [
    {
      name: 'Normal Mach number (simple sweep theory)',
      expr: 'Mn = M*cos(Lam)', tex: 'M_n = M\\cos\\Lambda',
      vars: {
        Mn: { name: 'Mach number square to the leading edge', tex: 'M_n' },
        M: { name: 'flight Mach number', value: 0.78, min: 0, max: 3 },
        Lam: { name: 'sweep angle', q: 'angle', unit: '°', value: 25, min: 0, max: 75, tex: '\\Lambda' }
      },
      note: 'Exact for an infinite yawed wing; real swept wings get part of the benefit (a rule of thumb uses √cos Λ).',
      stories: {
        Mn: 'An airliner with a wing swept {Lam} cruises at Mach {M}. What Mach number do its wing sections feel, according to simple sweep theory?',
        Lam: 'An airfoil must not see more than Mach {Mn} across its leading edge, and the aircraft is to cruise at Mach {M}. How much sweep does simple sweep theory call for?'
      }
    },
    {
      name: 'Lift slope of a swept wing (Helmbold–DATCOM)',
      expr: 'a = 2*pi*AR/(2 + sqrt(AR^2*(1 - M^2 + tan(Lam)^2) + 4))', tex: 'a = \\dfrac{2\\pi\\,\\mathrm{AR}}{2 + \\sqrt{\\mathrm{AR}^2\\,(1 - M^2 + \\tan^2\\Lambda_{c/2}) + 4}}',
      vars: {
        a: { name: 'lift slope of the wing (per radian)' },
        AR: { name: 'aspect ratio', value: 9.5, min: 0.5, max: 40, tex: '\\mathrm{AR}' },
        M: { name: 'Mach number', value: 0.3, min: 0, max: 0.95 },
        Lam: { name: 'sweep of the half-chord line', q: 'angle', unit: '°', value: 25, min: 0, max: 70, tex: '\\Lambda_{c/2}' }
      },
      note: 'For a section lift slope of 2π, below the critical Mach number. Good to a few per cent for straight and swept wings of any aspect ratio; divide by 57.3 for per degree.',
      stories: {
        a: 'A wing of aspect ratio {AR} has its half-chord line swept {Lam}. What is its lift slope per radian at Mach {M}?',
        Lam: 'A wing of aspect ratio {AR} at Mach {M} has a lift slope of {a} per radian. How far is its half-chord line swept?'
      }
    },
    {
      name: 'Sweep of any chord line of a tapered wing',
      expr: 'Lamn = atan(tan(Lam0) - 4*n/AR*(1 - lam)/(1 + lam))', tex: '\\tan\\Lambda_n = \\tan\\Lambda_{\\mathrm{LE}} - \\dfrac{4n}{\\mathrm{AR}}\\,\\dfrac{1-\\lambda}{1+\\lambda}',
      vars: {
        Lamn: { name: 'sweep of the line at fraction n of the chord', q: 'angle', unit: '°', signed: true, min: -60, max: 85, tex: '\\Lambda_n' },
        Lam0: { name: 'leading-edge sweep', q: 'angle', unit: '°', value: 27, min: 0, max: 85, tex: '\\Lambda_{\\mathrm{LE}}' },
        n: { name: 'chord fraction of the line (0.25 = quarter chord)', value: 0.25, min: 0, max: 1 },
        AR: { name: 'aspect ratio', value: 9.5, min: 0.5, max: 40, tex: '\\mathrm{AR}' },
        lam: { name: 'taper ratio', value: 0.24, min: 0, max: 1, tex: '\\lambda' }
      },
      note: 'For a straight-tapered wing. n = 0.25 gives the quarter-chord sweep, n = 0.5 the half-chord sweep, n = 1 the trailing edge.',
      stories: { Lamn: 'A wing of aspect ratio {AR} and taper ratio {lam} has a leading edge swept {Lam0}. What is the sweep of the line at {n} of the chord?' }
    }
  ],
  examples: [
    {
      title: 'How much sweep for Mach 0.82?',
      q: 'An airfoil reaches its critical Mach number at 0.72. How much sweep would let it cruise at Mach 0.82 by simple sweep theory, and by the $1/\\sqrt{\\cos\\Lambda}$ rule of thumb?',
      steps: [
        'Simple theory: $\\cos\\Lambda = 0.72/0.82 = 0.878$, so $\\Lambda = 28.6°$.',
        'Rule of thumb: $\\sqrt{\\cos\\Lambda} = 0.878$, so $\\cos\\Lambda = 0.771$ and $\\Lambda = 39.6°$.',
        'Real designs sit in between: about 25–30° of sweep combined with supercritical airfoils that themselves have a higher critical Mach number.'
      ],
      a: 'About 29° in the ideal theory, about 40° by the rule of thumb — in practice 25–30° plus a better airfoil.'
    },
    {
      title: 'What sweep costs in lift',
      q: 'A wing of aspect ratio 9.5 flies at Mach 0.2. Find its lift slope with no sweep and with 30° of half-chord sweep, and the angle each needs for $C_L = 0.5$.',
      steps: [
        'Unswept: $\\sqrt{9.5^2 \\times 0.96 + 4} = 9.52$, so $a = 2\\pi \\times 9.5/11.52 = 5.18$ per radian (0.090 per degree).',
        'Swept 30°: $\\tan^2 30° = 0.333$; $\\sqrt{90.25 \\times 1.293 + 4} = 10.99$, so $a = 59.7/12.99 = 4.60$ per radian (0.080 per degree).',
        'For $C_L = 0.5$ (from zero lift): 5.5° unswept, 6.2° swept — 11 % less lift per degree.'
      ],
      a: '0.090 against 0.080 per degree: the swept wing needs about 0.7° more for the same lift.'
    }
  ],
  quiz: [
    { q: 'A wing swept 35° flies at Mach 0.85. What Mach number do its sections feel according to simple sweep theory?', answer: 0.696,
      why: 'M_n = 0.85 × cos 35° = 0.85 × 0.819 = 0.696.' },
    { q: 'Which is NOT a consequence of sweeping a wing back?', choices: ['a lower lift slope', 'a tendency to stall at the tips', 'a higher maximum lift coefficient', 'a higher critical Mach number'], a: 2,
      why: 'Sweep lowers C_L,max (roughly by cos Λ); that is why swept wings need powerful slats and flaps.' },
    { q: 'When the tips of a swept-back wing stall first, the aircraft tends to pitch nose-up.', a: true,
      why: 'The tips lie behind the centre of gravity. Losing their lift removes a nose-down moment, so the nose rises — further into the stall.' },
    { q: 'Why did forward-swept wings have to wait for the 1980s?', choices: ['bending twists their tips nose-up, which leads to divergence unless the wing is very stiff — carbon fibre made that light enough', 'they are directionally unstable', 'they cannot fly faster than Mach 0.5', 'they stall at the tips'], a: 0,
      why: 'Aeroelastic divergence: more lift bends the wing, which raises the tip angle, which makes more lift. Tailored composite skins resist that twist without a heavy structure.' },
    { q: 'For a propeller aircraft cruising at Mach 0.4, sweeping the wing…', choices: ['brings no useful compressibility benefit and costs lift', 'raises its cruise speed by 20 %', 'reduces its induced drag', 'is needed for stability'], a: 0,
      why: 'Far below the critical Mach number there is no wave drag to delay; sweep would only lower the lift slope and C_L,max. (Some light aircraft have a little sweep for balance, not for speed.)' }
  ],
  problems: [
    { q: 'A wing has an aspect ratio of 9.5, a taper ratio of 0.25 and a leading edge swept 30°. What is the sweep of its quarter-chord line?', answer: 27.2, unit: '°', tol: 0.02,
      steps: ['$\\tan\\Lambda_{c/4} = \\tan 30° - (4 \\times 0.25/9.5)(0.75/1.25) = 0.5774 - 0.0632 = 0.5142$.', '$\\Lambda_{c/4} = 27.2°$.'] }
  ],
  applications: [
    'Jet airliners and business jets, swept 25–37° to cruise at Mach 0.78–0.9.',
    'Supersonic aircraft, swept further (or given delta wings) to keep the leading edge inside the Mach cone.',
    'Variable-sweep combat aircraft, spreading their wings for landing and sweeping them for the dash.',
    'Propeller blade tips and helicopter rotor tips, swept to delay compressibility at the tip.'
  ],
  history: 'Adolf Busemann proposed swept wings for supersonic flight at the 1935 Volta Conference in Rome, and German researchers pursued sweep for high subsonic speeds from the late 1930s; Robert T. Jones reached the idea independently in the United States in 1945. German wind-tunnel data taken after the war shaped the Boeing B-47 (1947) and the F-86 Sabre, both swept 35°, as did the MiG-15.',
  sim: [{ id: 'wing-planform', params: { method: 'vlm', sweep: 35, taper: 0.3 } }, { id: 'wing-stall-pattern', params: { planform: 'swept' } }]
},

{
  id: 'taper-twist', parent: 'wing-geometry', title: 'Taper and twist', level: 2,
  short: 'Taper narrows a wing towards its tips; twist changes the angle of its sections along the span, usually nose-down at the tips (washout). Together they shape the lift distribution, lighten the structure and make the wing stall at the root first.',
  keywords: ['taper', 'taper ratio', 'twist', 'washout', 'wash-in', 'geometric twist', 'aerodynamic twist', 'incidence', 'lift distribution', 'basic loading', 'additional loading', 'tip stall'],
  prereq: ['wing-planform', 'lift-curve', 'stall'],
  related: ['elliptic-lift', 'stall-patterns', 'lifting-line', 'oswald-efficiency', 'sweep', 'naca-airfoils'],
  body: `
### Taper
The **taper ratio** $\\lambda = c_t/c_r$ compares tip and root chords: 1 for a rectangular wing, 0 for a pointed delta, about 0.4–0.7 for light aircraft and 0.2–0.3 for jet airliners. On a straight-tapered wing the chord falls linearly along the span:

$$c(\\eta) = c_r\\,[1 - (1-\\lambda)\\,\\eta], \\qquad \\eta = \\frac{2y}{b}$$

Taper does two useful things. It moves area, and with it lift, inboard, which cuts the **bending moment** at the root and lets the root be deep and the spar light. And it brings the spanwise loading closer to the ideal ellipse: for an untwisted, unswept wing of aspect ratio 8, lifting-line theory gives a span efficiency of 0.94 when rectangular and 0.99 at $\\lambda \\approx 0.4$ (try it in the planform designer).

The catch is at the tips. Their chords are small, but they sit in the least downwash, so each tip section works at a **higher** lift coefficient than the root. On an untwisted wing with $\\lambda = 0.2$ the section $c_l$ peaks near 80 % of the half-span, about 12 % above the wing's $C_L$. Small chords also mean a lower [[reynolds-number|Reynolds number]] and so a lower $c_{l,\\max}$. Strong taper therefore makes a wing prone to **tip stall** (see [[stall-patterns]]).

### Twist
**Twist** changes the section angle along the span. **Washout** — tips set at a smaller angle than the root — is the usual kind; **wash-in** is the reverse. Twist is **geometric** when the sections are physically rotated, and **aerodynamic** when different airfoils, with different zero-lift angles, are used along the span. What counts is the change in the angle measured from zero lift:

$$\\varepsilon_a = \\varepsilon_g + \\alpha_{0,r} - \\alpha_{0,t}$$

A cambered root section (zero lift at −2°) with a symmetric tip section (0°) and 1° of geometric washout has 3° of aerodynamic washout.

Washout does three jobs. It **unloads the tips**, so the root reaches its $c_{l,\\max}$ first and the ailerons stay in attached flow as the wing stalls. It lowers tip loads and the root bending moment. And on swept wings it counters the outboard shift of the loading. The Cessna 172 has its wing root set at about +1.5° and its tips at about −1.5°: 3° of washout. Airliner wings are built with several degrees of twist so that they bend and twist into the intended shape under cruise loads.

### The price of twist
Twist adds a **basic loading** — a pattern of lift that exists even when the total lift is zero, the root lifting and the tips pushing down — to the **additional loading** that grows with angle of attack. The two add up to a good, nearly elliptic distribution at one lift coefficient only. At other lift coefficients the span efficiency falls: in lifting-line theory, 2° of washout on an aspect-ratio-8 wing with $\\lambda = 0.3$ costs about 4 % of $e$ at $C_L \\approx 0.36$, and 4° costs about 17 % at $C_L \\approx 0.29$. At low lift coefficients, in fast cruise, too much washout makes the tips lift downward.

> [!tip] Designers choose the taper for the structure and the induced drag, then add just enough washout for a safe stall — and accept a small drag penalty away from the design lift coefficient.
`,
  ideas: [
    'Taper ratio λ = c_t/c_r; the chord falls linearly from root to tip.',
    'Taper lightens the structure and brings the loading close to elliptic (λ ≈ 0.4 for straight wings).',
    'Strong taper loads the tip sections hardest and invites tip stall.',
    'Washout lowers the tips\' angle so that the root stalls first; aerodynamic twist counts a change of airfoil as well.',
    'Twist gives the intended loading at one lift coefficient only.'
  ],
  pitfalls: [
    'A tapered wing\'s tips carry less load, so they stall last — They carry less lift per metre, but their section lift coefficient is higher, and it is the section c_l that decides the stall.',
    'Washout means physically twisting the wing — Changing the airfoil along the span (a cambered root, a less cambered tip) twists the wing aerodynamically just as well.',
    'More washout is always safer — Too much makes the tips lift downward in fast flight, adds induced drag and trim drag; it is sized for the stall and no more.'
  ],
  formulas: [
    {
      name: 'Chord along a straight-tapered wing',
      expr: 'c = cr*(1 - (1 - lam)*eta)', tex: 'c = c_r\\,[1 - (1-\\lambda)\\,\\eta]',
      vars: {
        c: { name: 'local chord', q: 'length', unit: 'm' },
        cr: { name: 'root chord', q: 'length', unit: 'm', value: 2.0, tex: 'c_r' },
        lam: { name: 'taper ratio', value: 0.45, min: 0, max: 1, tex: '\\lambda' },
        eta: { name: 'spanwise station 2y/b (0 root, 1 tip)', value: 0.7, min: 0, max: 1, tex: '\\eta' }
      },
      stories: {
        c: 'A wing has a root chord of {cr} and a taper ratio of {lam}. What is the chord at the station {eta} of the way to the tip?',
        lam: 'A wing\'s chord falls from {cr} at the root to {c} at the station {eta} of the way to the tip. What is its taper ratio?'
      }
    },
    {
      name: 'Local angle with linear washout',
      expr: 'alphay = alphar + epst*eta', tex: '\\alpha_y = \\alpha_r + \\varepsilon_t\\,\\eta',
      vars: {
        alphay: { name: 'angle of attack of the section at η', q: 'angle', unit: '°', signed: true, tex: '\\alpha_y' },
        alphar: { name: 'angle of attack at the root', q: 'angle', unit: '°', value: 8, min: -10, max: 25, signed: true, tex: '\\alpha_r' },
        epst: { name: 'twist at the tip (negative = washout)', q: 'angle', unit: '°', value: -3, min: -10, max: 5, signed: true, tex: '\\varepsilon_t' },
        eta: { name: 'spanwise station 2y/b', value: 0.9, min: 0, max: 1, tex: '\\eta' }
      },
      note: 'Geometric angles, before the downwash is taken off. Linear twist is the simplest and most common.',
      stories: { alphay: 'A wing with {epst} of twist at the tip meets the air at {alphar} at its root. At what angle is the section at {eta} of the half-span set?' }
    },
    {
      name: 'Aerodynamic twist',
      expr: 'epsa = epsg + alpha0r - alpha0t', tex: '\\varepsilon_a = \\varepsilon_g + \\alpha_{0,r} - \\alpha_{0,t}',
      vars: {
        epsa: { name: 'aerodynamic twist (tip relative to root, from zero lift)', q: 'angle', unit: '°', signed: true, tex: '\\varepsilon_a' },
        epsg: { name: 'geometric twist (tip relative to root)', q: 'angle', unit: '°', value: -1, min: -10, max: 5, signed: true, tex: '\\varepsilon_g' },
        alpha0r: { name: 'zero-lift angle of the root section', q: 'angle', unit: '°', value: -2, min: -8, max: 2, signed: true, tex: '\\alpha_{0,r}' },
        alpha0t: { name: 'zero-lift angle of the tip section', q: 'angle', unit: '°', value: 0, min: -8, max: 2, signed: true, tex: '\\alpha_{0,t}' }
      },
      note: 'Negative = washout. Cambered sections have negative zero-lift angles (about −2° for 2 % camber, −4° for 4 %).',
      stories: { epsa: 'A wing has {epsg} of geometric twist, a root section with zero lift at {alpha0r} and a tip section with zero lift at {alpha0t}. What is its aerodynamic twist?' }
    }
  ],
  examples: [
    {
      title: 'When camber cancels washout',
      q: 'A wing has 3° of geometric washout. Its root is a NACA 23015 section (zero lift at about −1.2°) and its tip a more cambered NACA 4412 (zero lift at about −4.2°). What is its aerodynamic twist?',
      steps: [
        '$\\varepsilon_a = \\varepsilon_g + \\alpha_{0,r} - \\alpha_{0,t} = -3 + (-1.2) - (-4.2)$.',
        '$\\varepsilon_a = 0°$: the extra camber at the tip gives exactly as much wash-in as the geometric washout removes.',
        'The tip section still helps the stall — a 4412 has a higher $c_{l,\\max}$ than a 23015 — but the loading is that of an untwisted wing.'
      ],
      a: 'Zero aerodynamic twist: the tip\'s camber cancels the 3° of geometric washout.'
    },
    {
      title: 'Chords at the aileron',
      q: 'A wing has a root chord of 1.8 m and a taper ratio of 0.5. Its aileron runs from 60 % to 95 % of the half-span. What are the wing chords at its ends?',
      steps: [
        'At $\\eta = 0.6$: $c = 1.8 \\times (1 - 0.5 \\times 0.6) = 1.26$ m.',
        'At $\\eta = 0.95$: $c = 1.8 \\times (1 - 0.5 \\times 0.95) = 0.945$ m.'
      ],
      a: '1.26 m at the inboard end, 0.95 m at the outboard end.'
    }
  ],
  quiz: [
    { q: 'On an untwisted wing with strong taper (λ = 0.2), the section lift coefficient is highest…', choices: ['near the root', 'at mid-span', 'at about three-quarters of the half-span or further out', 'the same everywhere'], a: 2,
      why: 'The small tip chords carry lift in little downwash, so their c_l is higher than the wing\'s C_L — about 12 % higher near 80 % of the half-span for λ = 0.2.' },
    { q: 'Washout means…', choices: ['the tip sections meet the air at a smaller angle than the root sections', 'the tip sections meet the air at a larger angle', 'the wing is tapered', 'the wing has dihedral'], a: 0,
      why: 'Washout lowers the tips\' angle (geometrically or by a change of airfoil) so that they carry less lift and stall last.' },
    { q: 'A wing has 2° of geometric washout (ε_g = −2°), a root section with zero lift at −2.5° and a tip section with zero lift at −1°. What is its aerodynamic twist, in degrees?', answer: -3.5, unit: '°',
      why: 'ε_a = −2 + (−2.5) − (−1) = −3.5°: 3.5° of aerodynamic washout.' },
    { q: 'A wing twisted to give an elliptic loading at C_L = 0.5 also has an elliptic loading at C_L = 1.2.', a: false,
      why: 'Twist adds a fixed basic loading; the additional loading grows with C_L. Their sum has the intended shape at one C_L only.' },
    { q: 'Why do airliners use taper ratios of 0.2–0.3 rather than the 0.4 that suits a straight wing?', choices: ['sweep moves the loading outboard, so a smaller tip chord brings it back towards the ellipse, and the lighter tip saves structure', 'to make the wing stall at the tips', 'to increase the aspect ratio', 'to fit more fuel in the tips'], a: 0,
      why: 'Sweeping back loads the tips; stronger taper unloads them again, and moving lift inboard reduces the bending moment of a long wing.' }
  ],
  problems: [
    { q: 'A wing has a root chord of 2.2 m and a taper ratio of 0.4. What is the chord at 80 % of the half-span?', answer: 1.144, unit: 'm', tol: 0.02,
      steps: ['$c = 2.2 \\times [1 - 0.6 \\times 0.8] = 2.2 \\times 0.52 = 1.144$ m.'] }
  ],
  applications: [
    'Light aircraft: a few degrees of washout (about 3° on the Cessna 172) for a root-first stall.',
    'Airliners: strong taper and a built-in twist so that the wing takes up its cruise shape under load.',
    'Sailplanes: several tapered panels approximating an ellipse, with a little washout.',
    'Propellers and rotor blades, which are twisted far more because the speed of each section grows with radius.'
  ],
  history: 'Washout was used almost from the start — the Wright brothers twisted (warped) their wings for control, and designers of the 1910s set the tips at a lower angle for gentler stalls. NACA engineers in the 1930s tabulated the basic and additional loadings of tapered and twisted wings (Anderson, NACA Report 572, 1936), which designers used for decades to choose taper and washout.',
  sim: [{ id: 'wing-planform', params: { taper: 0.3, twist: -3 } }, { id: 'wing-stall-pattern', params: { planform: 'taper5', washout: 3 } }]
},

/* ================================================================ THE FINITE WING */
{
  id: 'wingtip-vortices', parent: 'finite-wing', title: 'Wingtip vortices and wake turbulence', level: 1,
  short: 'Where a wing ends, air spills round the tip from the high pressure below to the low pressure above, and the wake rolls up into two counter-rotating vortices. They carry the wing\'s downwash, cause its induced drag, and can upset a following aircraft for minutes.',
  keywords: ['wingtip vortex', 'tip vortex', 'trailing vortex', 'wake turbulence', 'wake vortex', 'vortex sheet', 'roll-up', 'circulation', 'horseshoe vortex', 'Helmholtz', 'contrails', 'wake separation', 'formation flight'],
  prereq: ['how-lift-works', 'vorticity-circulation', 'wing-planform'],
  related: ['downwash', 'induced-drag', 'winglets', 'ground-effect', 'lifting-line', 'kutta-joukowski', 'vortex-shedding', 'bird-flight'],
  body: `
A lifting wing has higher pressure under it than over it. In mid-span the air can do little about that, but at the tips it can: it flows round the tip from below to above. Behind the wing, air from the lower surface arrives moving slightly outward and air from the upper surface slightly inward; the thin sheet where they meet — the **vortex sheet** — rolls up within a span or two into two tight, counter-rotating **tip vortices**. Seen from behind, the right-wing vortex turns anticlockwise and the left one clockwise: between them the air moves down, outside them it moves up.

### Why vortices must trail
Each section's lift comes with a circulation $\\Gamma$ bound to the wing ([[kutta-joukowski|Kutta–Joukowski]]: $L' = \\rho V\\Gamma$ per metre of span). A vortex cannot simply end in the air (Helmholtz's theorem), so wherever the bound circulation changes along the span, the change leaves the wing as trailing vorticity. Lift falls to zero at the tips, so all of the bound circulation eventually trails away. The whole system is a horseshoe: the bound vortex, two trailing legs, and the starting vortex left behind on the runway at takeoff.

### How strong
For elliptic loading the rolled-up vortices each carry the centre-line circulation, and they lie a little inboard of the tips:

$$\\Gamma_0 = \\frac{W}{\\rho V b_0}, \\qquad b_0 = \\frac{\\pi}{4}\\,b$$

A 65-tonne narrow-body airliner (span 34 m) approaching at 70 m/s sheds vortices of about 280 m²/s, 27 m apart; within a metre or so of each core the air swirls at 20–30 m/s. Circulation grows with weight and falls with speed and span, so the strongest wakes come from aircraft that are **heavy, slow and clean** — just after takeoff and on approach.

### What the wake does
Each vortex is carried down by the other, so the pair sinks together at

$$w_0 = \\frac{\\Gamma_0}{2\\pi b_0}$$

about 1.5–2 m/s (300–400 ft/min) for airliners, and in calm air they may sink several hundred feet below the flight path before they decay. Near the ground they stop sinking at about half their spacing and move apart sideways; a light crosswind can hold one of them over the runway. In calm air they last two or three minutes; turbulence breaks them up sooner. Contrails often show the pair: two lines that later sag and join in loops as the vortices link up and die.

For a following aircraft the danger is **roll**. A small aircraft centred in a vortex has upwash under one wing and downwash under the other: behind that airliner, a 10 m wing centred on a core sees its angle of attack change by roughly ±8° from tip to tip at 60 m/s — a rolling moment that can exceed what full aileron can hold.

> [!warn] Wake turbulence is managed by the wake categories, separation minima and procedures of air-traffic control and the rules of the air, which pilots follow together with their aircraft's approved manuals. The figures here explain the physics; they are not a way to judge a separation.

### Useful vortices
The upwash outside a tip vortex is free lift. Geese flying in a V sit in the upwash of the bird ahead, and formation-flight trials with airliners have measured fuel savings of 5 % or more for the follower. [[winglets|Winglets]] and other tip devices reshape the tip flow to reduce induced drag.
`,
  ideas: [
    'Pressure leaks round the tips from below to above, and the wake rolls up into two counter-rotating tip vortices.',
    'Every change of bound circulation along the span must trail away as vorticity: lift and trailing vortices are inseparable.',
    'For elliptic loading Γ₀ = W/(ρVb₀) with b₀ = πb/4: heavy, slow aircraft make the strongest wakes.',
    'The pair sinks at w₀ = Γ₀/(2πb₀), spreads sideways near the ground and lasts minutes in calm air.',
    'The hazard to a follower is the rolling moment from upwash under one wing and downwash under the other.'
  ],
  pitfalls: [
    'Tip vortices are a flaw of poor wings that good design removes — Every wing that lifts must shed its circulation; design changes how the wake is spread, not its total strength, which is set by weight, speed and span.',
    'The wake is strongest behind fast aircraft — Γ₀ = W/(ρVb₀): for a given weight it is strongest at low speed, just after takeoff and on approach.',
    'Vortices stay at the height where they were made — They sink at a few metres per second and, near the ground, spread sideways at about the same speed; a crosswind can carry one onto a parallel runway or hold it over the runway in use.'
  ],
  formulas: [
    {
      name: 'Circulation of each trailing vortex (elliptic loading)',
      expr: 'Gamma0 = 4*m*g/(pi*rho*V*b)', tex: '\\Gamma_0 = \\dfrac{4\\, m g}{\\pi\\, \\rho V b}',
      vars: {
        Gamma0: { name: 'circulation of each vortex', unit: 'm²/s', tex: '\\Gamma_0' },
        m: { name: 'aircraft mass', q: 'mass', unit: 'kg', value: 65000 },
        g: { const: 'g' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'true airspeed', q: 'speed', unit: 'kt', value: 136 },
        b: { name: 'wing span', q: 'length', unit: 'm', value: 34 }
      },
      note: '= W/(ρVb₀) with the vortex spacing b₀ = πb/4. Lift equals weight (level flight).',
      practice: { unknowns: ['Gamma0', 'V', 'm'] },
      stories: {
        Gamma0: 'An aircraft of {m} with a span of {b} flies at {V} through air of density {rho}. How strong is each of its trailing vortices?',
        V: 'An aircraft of {m} and span {b} sheds vortices of {Gamma0} in air of density {rho}. How fast is it flying?'
      }
    },
    {
      name: 'Sink rate of the vortex pair',
      expr: 'w0 = 2*Gamma0/(pi^2*b)', tex: 'w_0 = \\dfrac{2\\,\\Gamma_0}{\\pi^2 b}',
      vars: {
        w0: { name: 'sink rate of the pair', q: 'speed', unit: 'm/s', tex: 'w_0' },
        Gamma0: { name: 'circulation of each vortex', unit: 'm²/s', value: 280, tex: '\\Gamma_0' },
        b: { name: 'wing span', q: 'length', unit: 'm', value: 34 }
      },
      note: '= Γ₀/(2πb₀) with b₀ = πb/4: each vortex is carried down by the other. Out of ground effect, in still air, before the vortices decay.',
      stories: { w0: 'An aircraft of span {b} leaves vortices of {Gamma0}. How fast does the pair sink?' }
    },
    {
      name: 'Spacing of the rolled-up vortices',
      expr: 'b0 = pi*b/4', tex: 'b_0 = \\dfrac{\\pi}{4}\\, b',
      vars: {
        b0: { name: 'distance between the vortex cores', q: 'length', unit: 'm', tex: 'b_0' },
        b: { name: 'wing span', q: 'length', unit: 'm', value: 34 }
      },
      note: 'For elliptic loading: the centroid of the trailing vorticity of each half-wing lies at π/8 of the span from the centreline.',
      stories: { b0: 'How far apart are the rolled-up tip vortices of a wing of span {b} (elliptic loading)?' }
    }
  ],
  examples: [
    {
      title: 'The wake of a narrow-body airliner',
      q: 'A 65 t airliner with a 34 m span approaches at 70 m/s (136 kt) in sea-level air. Estimate the strength, spacing and sink rate of its wake vortices, and the upwash 5 m from a core.',
      steps: [
        'Spacing: $b_0 = \\tfrac{\\pi}{4} \\times 34 = 26.7$ m.',
        'Circulation: $\\Gamma_0 = W/(\\rho V b_0) = 637\\,700/(1.225 \\times 70 \\times 26.7) = 279\\ \\mathrm{m^2/s}$.',
        'Sink rate: $w_0 = \\Gamma_0/(2\\pi b_0) = 279/168 = 1.66$ m/s, about 330 ft/min.',
        'Upwash at 5 m from a core: $\\Gamma_0/(2\\pi r) = 279/31.4 = 8.9$ m/s — on a follower flying at 60 m/s that is $\\arctan(8.9/60) \\approx 8.4°$ of angle of attack, up on one side and down on the other.'
      ],
      a: 'About 280 m²/s per vortex, 27 m apart, sinking at 1.7 m/s; ±8° across a small follower\'s wing.'
    },
    {
      title: 'Light aircraft against very large airliner',
      q: 'Compare the vortex circulation of a 1100 kg light aircraft (span 11 m, 35 m/s) with that of a 390 t airliner (span 80 m, 76 m/s), both at sea level.',
      steps: [
        'Light aircraft: $\\Gamma_0 = 4 \\times 10\\,787/(\\pi \\times 1.225 \\times 35 \\times 11) = 29\\ \\mathrm{m^2/s}$.',
        'Large airliner: $\\Gamma_0 = 4 \\times 3\\,825\\,000/(\\pi \\times 1.225 \\times 76 \\times 80) = 654\\ \\mathrm{m^2/s}$.',
        'Ratio: about 22. The weight ratio is 355, but the heavy aircraft also has seven times the span and twice the speed.'
      ],
      a: 'About 29 against 650 m²/s — some 22 times stronger.'
    }
  ],
  quiz: [
    { q: 'Seen from behind, which way does the right-wing tip vortex of an aircraft turn?', choices: ['anticlockwise: up outside the tip, inward over the top, down inboard', 'clockwise: down outside the tip, up inboard', 'it does not rotate; it only sinks', 'it depends on the airspeed'], a: 0,
      why: 'Air spills round the tip from the high-pressure lower surface to the upper surface: up at the tip, inward above, and down again inboard — the downwash between the two vortices.' },
    { q: 'Which aircraft leaves the strongest wake vortices?', choices: ['a heavy aircraft flying slowly', 'a light aircraft at high speed', 'a heavy aircraft at high speed', 'a light aircraft flying slowly'], a: 0,
      why: 'Γ₀ = W/(ρVb₀): large weight and low speed. Hence the extra care behind heavy aircraft on takeoff and approach.' },
    { q: 'A 10-tonne business jet with a 16 m span flies at 60 m/s at sea level. What is the circulation Γ₀ of each trailing vortex, in m²/s (elliptic loading)?', answer: 106,
      why: 'Γ₀ = 4mg/(πρVb) = 4 × 98 070/(π × 1.225 × 60 × 16) = 392 300/3695 = 106 m²/s.' },
    { q: 'Winglets make the wake-vortex hazard behind an airliner negligible.', a: false,
      why: 'The total circulation shed is set by the lift, speed and span. Winglets reshape the tip flow and cut induced drag a little; the far wake still rolls up into a strong pair.' },
    { q: 'Near the ground, a descending vortex pair…', choices: ['stops sinking at about half its spacing, and the two vortices move apart sideways', 'bounces back up to the flight path', 'sinks faster and hits the ground', 'merges into a single vortex'], a: 0,
      why: 'The ground acts like mirror-image vortices below it, which push each vortex outward. (Real vortices often rebound a little too, as the ground boundary layer separates.)' }
  ],
  problems: [
    { q: 'A wide-body airliner of 250 t with a 60 m span approaches at 75 m/s at sea level. How fast does its vortex pair sink (elliptic loading)?', answer: 1.91, unit: 'm/s', tol: 0.03,
      steps: ['$b_0 = \\tfrac{\\pi}{4} \\times 60 = 47.1$ m.', '$\\Gamma_0 = 2\\,452\\,000/(1.225 \\times 75 \\times 47.1) = 567\\ \\mathrm{m^2/s}$.', '$w_0 = 567/(2\\pi \\times 47.1) = 1.91$ m/s.'] }
  ],
  applications: [
    'Wake-turbulence categories and separations between arriving and departing aircraft.',
    'Formation flight of birds and aircraft to save energy in the upwash of the leader.',
    'Crop spraying, where the wake carries the droplets down and the tip vortices spread them sideways.',
    'Lidar systems that track wake vortices at busy airports.'
  ],
  history: 'Frederick Lanchester described the trailing vortices of a wing in the 1890s and published the idea in *Aerodynamics* (1907); Ludwig Prandtl made it quantitative in his lifting-line theory at Göttingen in 1918–1919. Wake turbulence became an operational concern with the wide-body jets of around 1970, which led to wake categories and separations, since revised with measured data (for example the re-categorisation schemes of the 2010s).',
  sim: 'wing-wake-vortex'
},

{
  id: 'downwash', parent: 'finite-wing', title: 'Downwash', level: 2,
  short: 'The air behind a lifting wing moves downward — the downwash. It tilts the flow the wing meets by the induced angle, so every section works at a smaller effective angle of attack; it carries the momentum that holds the aircraft up, and it changes the flow at the tailplane.',
  keywords: ['downwash', 'upwash', 'induced angle', 'induced angle of attack', 'effective angle of attack', 'downwash angle', 'downwash gradient', 'tailplane', 'momentum', 'stream tube'],
  prereq: ['wingtip-vortices', 'momentum-equation', 'physics:newtons-third-law'],
  related: ['induced-drag', 'lifting-line', 'elliptic-lift', 'ground-effect', 'longitudinal-stability', 'trim', 'how-lift-works', 'physics:momentum'],
  body: `
Lift is a force on the air as much as on the wing: the wing pushes air down and the air pushes the wing up ([[physics:newtons-third-law|Newton's third law]]). The downward velocity the wing leaves behind is the **downwash**. Ahead of the wing the air is lifted slightly (**upwash**); at the wing it moves down at $w$; far behind, at $2w$ — the trailing vortices of an elliptic wing extend only downstream from the wing, so there they induce half of their far-wake velocity.

### The induced angle
The sections of a finite wing therefore meet air that arrives from slightly above. The local wind is tilted down by the **induced angle**

$$\\alpha_i = \\frac{w}{V} = \\frac{C_L}{\\pi\\,\\mathrm{AR}}\\qquad\\text{(elliptic loading)}$$

and each section works at the **effective angle** $\\alpha_{\\text{eff}} = \\alpha - \\alpha_i$. That is why a finite wing lifts less than its airfoil at the same geometric angle. An airliner wing of aspect ratio 9.5 cruising at $C_L = 0.54$ has $\\alpha_i \\approx 1.0°$ — about a sixth of its angle from zero lift; a short wing of aspect ratio 3 at $C_L = 1$ loses 6°.

The second effect is drag. Each section's lift is square to the *local* wind, so it leans back by $\\alpha_i$, and its backward component $L\\sin\\alpha_i \\approx L\\,\\alpha_i$ is the [[induced-drag|induced drag]].

For other loadings the downwash varies along the span — a rectangular wing has more near its tips, a strongly tapered one less — and the average that sets the induced drag is $C_{D,i}/C_L = C_L/(\\pi\\,\\mathrm{AR}\\,e)$ (see the simulation below).

### Momentum: the air a wing throws down
A wing influences a stream of air about as wide as its span. For elliptic loading the equivalent is exact: a circular stream tube of diameter $b$, carrying $\\dot m = \\rho V\\pi b^2/4$ each second, is given a downward velocity $2w$, and the [[physics:momentum|momentum]] it gains per second, $\\dot m\\,2w$, equals the lift. An airliner of 65 t and 34 m span cruising at 230 m/s in air of 0.36 kg/m³ acts on about 76 tonnes of air per second and throws it down at about 8 m/s. The kinetic energy that leaves in that downward motion, per second, is the induced drag times the speed.

### Downwash at the tail
The tailplane sits in the wing's downwash. Well behind an elliptic wing the downwash angle approaches $\\varepsilon = 2C_L/(\\pi\\,\\mathrm{AR})$, and it changes with angle of attack at a rate $d\\varepsilon/d\\alpha \\approx 2a/(\\pi\\,\\mathrm{AR})$ — somewhat less at a real tail, typically 0.3–0.5. When the wing's angle rises by 1°, the tail's rises by only 0.5–0.7°, a large factor in [[longitudinal-stability|longitudinal stability]] and [[trim]]. Lowering flaps increases the downwash (the tail feels it and the nose pitches); close to the ground the downwash falls (see [[ground-effect]]), which changes the trim in the flare.

> [!note] Downwash is not a side effect: it is the other half of lift. The downward momentum given to the air per second equals the lift, and the energy given to it is the induced drag.
`,
  ideas: [
    'A lifting wing leaves the air moving down: w at the wing, 2w far behind (elliptic loading).',
    'The sections meet a local wind tilted by α_i = w/V and work at the effective angle α − α_i.',
    'For elliptic loading α_i = C_L/(πAR), the same all along the span.',
    'The lift equals the downward momentum given each second to a stream tube about as wide as the span.',
    'The tailplane feels the downwash: dε/dα ≈ 0.3–0.5, which matters for stability and trim.'
  ],
  pitfalls: [
    'Downwash comes only from the tips — The whole trailing vortex sheet causes it, all along the span; only for elliptic loading is it the same everywhere.',
    'The downwash angle at the wing equals the deflection far behind it — Far behind it is twice as large: at the wing the trailing vortices extend only downstream, so they induce half their far-wake velocity.',
    'A wing lifts only by pressure, so downwash is a by-product — Pressure difference and downward momentum are two descriptions of the same event: the lift equals the rate at which downward momentum is given to the air.'
  ],
  formulas: [
    {
      name: 'Induced angle',
      expr: 'alphai = CL/(pi*AR*eo)', tex: '\\alpha_i = \\dfrac{C_L}{\\pi\\,\\mathrm{AR}\\,e}',
      vars: {
        alphai: { name: 'induced angle (downwash angle at the wing)', q: 'angle', unit: '°', signed: true, tex: '\\alpha_i' },
        CL: { name: 'wing lift coefficient', value: 0.54, min: -1.5, max: 3, signed: true, tex: 'C_L' },
        AR: { name: 'aspect ratio', value: 9.5, min: 0.5, max: 60, tex: '\\mathrm{AR}' },
        eo: { name: 'span efficiency (1 for elliptic loading)', value: 0.95, min: 0.3, max: 1, tex: 'e' }
      },
      note: 'Exact and uniform along the span for elliptic loading (e = 1); for other loadings this is the effective mean, C_Di/C_L.',
      stories: {
        alphai: 'A wing of aspect ratio {AR} and span efficiency {eo} flies at a lift coefficient of {CL}. What is its induced angle?',
        CL: 'A wing of aspect ratio {AR} and span efficiency {eo} has an induced angle of {alphai}. What lift coefficient is it flying at?'
      }
    },
    {
      name: 'Downwash angle far behind the wing',
      expr: 'eps = 2*CL/(pi*AR)', tex: '\\varepsilon = \\dfrac{2\\,C_L}{\\pi\\,\\mathrm{AR}}',
      vars: {
        eps: { name: 'downwash angle far behind', q: 'angle', unit: '°', signed: true, tex: '\\varepsilon' },
        CL: { name: 'wing lift coefficient', value: 0.54, min: -1.5, max: 3, signed: true, tex: 'C_L' },
        AR: { name: 'aspect ratio', value: 9.5, min: 0.5, max: 60, tex: '\\mathrm{AR}' }
      },
      note: 'Elliptic loading, far downstream; at a real tailplane the angle is somewhat smaller and depends on its position.',
      stories: { eps: 'What is the downwash angle far behind an elliptic wing of aspect ratio {AR} flying at C_L = {CL}?' }
    },
    {
      name: 'Downwash gradient',
      expr: 'depsda = 2*a/(pi*AR)', tex: '\\varepsilon_\\alpha = \\dfrac{d\\varepsilon}{d\\alpha} \\approx \\dfrac{2a}{\\pi\\,\\mathrm{AR}}',
      vars: {
        depsda: { name: 'downwash gradient dε/dα', tex: '\\varepsilon_\\alpha' },
        a: { name: 'lift slope of the wing (per radian)', value: 4.8, min: 0.5, max: 6.5 },
        AR: { name: 'aspect ratio', value: 9.5, min: 0.5, max: 60, tex: '\\mathrm{AR}' }
      },
      note: 'The far-field value; at a tail about half a span behind the wing it is typically 10–30 % lower. The tail sees (1 − dε/dα) of each change in the wing\'s angle.',
      stories: { depsda: 'A wing of aspect ratio {AR} has a lift slope of {a} per radian. Estimate the downwash gradient behind it.' }
    }
  ],
  examples: [
    {
      title: 'The air an airliner throws down',
      q: 'A 65 t airliner (span 34.1 m, wing 122.6 m²) cruises at 230 m/s at 11 000 m, where $\\rho = 0.364\\ \\mathrm{kg/m^3}$. Assuming elliptic loading, find its induced angle, the downwash at the wing and far behind, and check it against the momentum of a stream tube as wide as the span.',
      steps: [
        '$C_L = 2W/(\\rho V^2 S) = 2 \\times 637\\,650/(0.364 \\times 230^2 \\times 122.6) = 0.540$; $\\mathrm{AR} = 34.1^2/122.6 = 9.48$.',
        '$\\alpha_i = C_L/(\\pi\\,\\mathrm{AR}) = 0.540/29.8 = 0.0181$ rad = 1.04°.',
        'Downwash at the wing: $w = V\\alpha_i = 4.2$ m/s; far behind, 8.3 m/s.',
        'Stream tube: $\\dot m = \\rho V \\pi b^2/4 = 0.364 \\times 230 \\times 913 = 76\\,400$ kg/s. Lift from momentum: $76\\,400 \\times 8.34 = 637\\,000$ N — the weight.'
      ],
      a: 'α_i ≈ 1.0°, 4.2 m/s at the wing and 8.3 m/s far behind; 76 t of air a second thrown down carries the whole weight.'
    },
    {
      title: 'What angle does a finite wing need?',
      q: 'An elliptic wing of aspect ratio 6 uses an airfoil with $a_0 = 2\\pi$ per radian and zero lift at −2°. At what geometric angle of attack does it fly at $C_L = 0.8$?',
      steps: [
        'Elliptic loading: every section has $c_l = C_L = 0.8$, so its effective angle from zero lift is $0.8/2\\pi = 0.127$ rad = 7.30°, i.e. $\\alpha_{\\text{eff}} = 7.30 - 2 = 5.30°$.',
        'Induced angle: $\\alpha_i = 0.8/(6\\pi) = 0.0424$ rad = 2.43°.',
        'Geometric angle: $\\alpha = \\alpha_{\\text{eff}} + \\alpha_i = 5.30 + 2.43 = 7.73°$.'
      ],
      a: 'About 7.7° — 2.4° more than the airfoil alone would need.'
    }
  ],
  quiz: [
    { q: 'An elliptic wing of aspect ratio 8 flies at C_L = 0.5. What is its induced angle, in degrees?', answer: 1.14, unit: '°',
      why: 'α_i = C_L/(πAR) = 0.5/25.1 = 0.0199 rad = 1.14°.' },
    { q: 'Far behind an elliptically loaded wing, the downwash velocity is…', choices: ['twice its value at the wing', 'equal to its value at the wing', 'half its value at the wing', 'zero, because the vortices have rolled up'], a: 0,
      why: 'At the wing the trailing vortices reach only downstream (semi-infinite) and induce half the velocity they induce far behind, where they reach both ways.' },
    { q: 'The wing\'s angle of attack rises by 2°, and the downwash gradient at the tail is 0.4. By how much does the tailplane\'s angle of attack rise?', choices: ['1.2°', '2°', '0.8°', '2.8°'], a: 0,
      why: 'The downwash rises by 0.4 × 2 = 0.8°, so the tail gains 2 − 0.8 = 1.2°.' },
    { q: 'In steady level flight, the lift equals the downward momentum the wing gives to the air each second.', a: true,
      why: 'Newton\'s second and third laws applied to the air: the force on the air is its rate of change of momentum. (The pressure field eventually passes the weight on to the ground.)' },
    { q: 'Why does a finite wing need a larger angle of attack than its airfoil for the same lift coefficient?', choices: ['its sections meet a local wind tilted down by the induced angle', 'its skin friction is larger', 'its tips are thinner', 'the air is denser at the root'], a: 0,
      why: 'The downwash lowers every section\'s effective angle by α_i; the geometric angle must be larger by the same amount.' }
  ],
  problems: [
    { q: 'A light aircraft of 1100 kg with an 11 m span flies at 50 m/s at sea level. Treating its wake as a stream tube as wide as its span, how fast is that air moving down far behind it?', answer: 1.85, unit: 'm/s', tol: 0.03,
      steps: ['$\\dot m = \\rho V\\pi b^2/4 = 1.225 \\times 50 \\times 95.0 = 5820$ kg/s.', '$2w = W/\\dot m = 10\\,790/5820 = 1.85$ m/s.'] }
  ],
  applications: [
    'Sizing a tailplane: its effectiveness is reduced by the factor (1 − dε/dα).',
    'Trim changes when flaps are lowered or the aircraft enters ground effect.',
    'Helicopter and drone downwash, the same physics with a rotor instead of a wing.',
    'Wind-tunnel corrections: the tunnel walls change a model\'s downwash, and results are corrected for it.'
  ],
  sim: ['wing-induced-angle', 'wing-wake-vortex']
},

{
  id: 'induced-drag', parent: 'finite-wing', title: 'Induced drag', level: 2,
  short: 'Induced drag is the price of lift on a finite wing: the lift, tilted back by the downwash, has a component against the motion. It grows with the square of the lift and falls with the square of the span and of the speed, so it dominates slow, heavy flight.',
  keywords: ['induced drag', 'drag due to lift', 'lift-induced drag', 'vortex drag', 'C_Di', 'span loading', 'span efficiency', 'induced power', 'minimum-drag speed', 'drag polar', 'turn'],
  prereq: ['downwash', 'aspect-ratio', 'lift-equation'],
  related: ['lifting-line', 'elliptic-lift', 'oswald-efficiency', 'winglets', 'ground-effect', 'drag-polar', 'minimum-drag-speed', 'power-required', 'parasite-drag', 'lift-to-drag', 'turning-flight'],
  body: `
An airfoil in two-dimensional flow of a frictionless fluid has no drag at all ([[dalembert-paradox|d'Alembert's paradox]]). A finite wing has one kind of drag even without friction: **induced drag**, which exists because the wing makes lift and because it ends.

### Where it comes from
Two views, one answer.
- **The tilted lift.** The trailing vortices push the air at the wing down by $w$ ([[downwash]]), so each section meets a local wind tilted by $\\alpha_i = w/V$. Its lift is square to that wind and leans back by $\\alpha_i$; the backward part is $D_i = L\\sin\\alpha_i \\approx L\\,\\alpha_i$.
- **The energy in the wake.** Behind the aircraft, air that was still is now moving down and spinning in the [[wingtip-vortices|tip vortices]]. Every metre flown leaves another metre of wake with that kinetic energy, and the force that supplies it is the induced drag.

For elliptic loading $\\alpha_i = C_L/(\\pi\\,\\mathrm{AR})$; in general

$$C_{D,i} = \\frac{C_L^2}{\\pi\\,\\mathrm{AR}\\,e}$$

with the span efficiency $e \\le 1$ measuring how far the loading is from elliptic (0.95–1 for good wings; the whole-aircraft [[oswald-efficiency|Oswald factor]] is lower).

### What it depends on
Put $C_L = W/(qS)$ into $D_i = qS\\,C_{D,i}$:

$$D_i = \\frac{W^2}{q\\,\\pi b^2 e} = \\frac{2W^2}{\\rho V^2\\,\\pi b^2 e}$$

- **Weight squared**: 10 % heavier, 21 % more induced drag. In a level turn the wing must lift $nW$, so a 60° bank ($n = 2$) quadruples it.
- **Speed squared, inversely**: half the speed, four times the induced drag. It is the drag of slow flight — the climb, the approach, the turn.
- **Span squared, inversely**: what matters is the **span loading** $W/b$, not the wing area. Sailplanes, albatrosses and human-powered aircraft have long spans for this reason.
- **Density**: $\\rho V^2$ is fixed by the equivalent airspeed, so at the same [[airspeeds|EAS]] the induced drag is the same at any height.

### Induced against parasite drag
[[parasite-drag|Parasite drag]] grows as $V^2$ and induced drag falls as $1/V^2$. Their sum has a minimum where the two are **equal** — the [[minimum-drag-speed|minimum-drag speed]], the speed of the best lift-to-drag ratio and the flattest glide. Below it, induced drag takes over.

| Light aircraft, 1100 kg, span 11 m, sea level | 60 kt | 120 kt |
|---|---|---|
| Induced drag ($e$ = 0.75) | 700 N | 175 N |
| Parasite drag ($C_{D,0}$ = 0.032) | 300 N | 1210 N |
| Share of induced drag | 70 % | 13 % |

For an airliner in cruise, induced drag is typically a third to two-fifths of the total, and during the initial climb, more than half.

> [!key] Induced drag is not friction and not a design flaw. It is the unavoidable cost of making lift with a wing of finite span; design can only bring it down towards the elliptic minimum for the span available.

The planform and twist set $e$ ([[lifting-line]], [[elliptic-lift]]); winglets and the ground change the flow at the tips ([[winglets]], [[ground-effect]]).
`,
  ideas: [
    'Induced drag is the backward tilt of the lift caused by the downwash: D_i ≈ L α_i.',
    'C_Di = C_L²/(πAR e): it grows with the square of the lift coefficient.',
    'In force terms D_i = 2W²/(ρV²πb²e): heavier, slower and shorter-span flight costs more.',
    'Induced drag equals parasite drag at the minimum-drag speed.',
    'The kinetic energy left in the wake per metre flown is the induced drag.'
  ],
  pitfalls: [
    'Induced drag is friction in the tip vortices — It exists in a frictionless fluid: it is the energy put into the wake\'s motion, not heat.',
    'A bigger wing always has less induced drag — At a given weight and speed only the span counts; adding chord at the same span leaves the induced drag force unchanged.',
    'Induced drag matters only for slow aircraft — It is a third or more of an airliner\'s cruise drag, which is why airliners have long spans and winglets.'
  ],
  formulas: [
    {
      name: 'Induced drag coefficient',
      expr: 'CDi = CL^2/(pi*AR*eo)', tex: 'C_{D,i} = \\dfrac{C_L^2}{\\pi\\,\\mathrm{AR}\\,e}',
      vars: {
        CDi: { name: 'induced drag coefficient', tex: 'C_{D,i}' },
        CL: { name: 'wing lift coefficient', value: 0.5, min: -2, max: 3, signed: true, tex: 'C_L' },
        AR: { name: 'aspect ratio', value: 9.5, min: 0.5, max: 60, tex: '\\mathrm{AR}' },
        eo: { name: 'span efficiency', value: 0.95, min: 0.3, max: 1, tex: 'e' }
      },
      note: 'e = 1 for elliptic loading (the minimum). With the whole-aircraft Oswald factor instead of e, the same form gives the lift-dependent drag of the aircraft.',
      stories: {
        CDi: 'A wing of aspect ratio {AR} and span efficiency {eo} flies at C_L = {CL}. What is its induced drag coefficient?',
        AR: 'A wing with span efficiency {eo} must have an induced drag coefficient of no more than {CDi} at C_L = {CL}. What aspect ratio does it need?'
      }
    },
    {
      name: 'Induced drag force',
      expr: 'Di = 2*(m*g)^2/(rho*V^2*pi*b^2*eo)', tex: 'D_i = \\dfrac{2\\,(m g)^2}{\\rho V^2\\,\\pi b^2 e}',
      vars: {
        Di: { name: 'induced drag', q: 'force', unit: 'kN', tex: 'D_i' },
        m: { name: 'aircraft mass', q: 'mass', unit: 'kg', value: 65000 },
        g: { const: 'g' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'true airspeed', q: 'speed', unit: 'kt', value: 250 },
        b: { name: 'wing span', q: 'length', unit: 'm', value: 34.1 },
        eo: { name: 'span efficiency', value: 0.95, min: 0.3, max: 1, tex: 'e' }
      },
      note: 'Level flight, lift = weight. In a turn at load factor n multiply the weight by n. ρV² depends only on the equivalent airspeed, so the result holds at any height for the same EAS.',
      practice: { unknowns: ['Di', 'V', 'b'] },
      stories: {
        Di: 'An aircraft of {m} with a span of {b} and span efficiency {eo} flies at {V} in air of density {rho}. What is its induced drag?',
        b: 'An aircraft of {m} flying at {V} in air of density {rho} with span efficiency {eo} must keep its induced drag to {Di}. What span does it need?'
      }
    },
    {
      name: 'Induced power',
      expr: 'Pind = 2*(m*g)^2/(rho*V*pi*b^2*eo)', tex: 'P_i = D_i V = \\dfrac{2\\,(m g)^2}{\\rho V\\,\\pi b^2 e}',
      vars: {
        Pind: { name: 'power to overcome induced drag', q: 'power', unit: 'W', tex: 'P_i' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 100 },
        g: { const: 'g' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'airspeed', q: 'speed', unit: 'm/s', value: 7 },
        b: { name: 'wing span', q: 'length', unit: 'm', value: 30 },
        eo: { name: 'span efficiency', value: 0.9, min: 0.3, max: 1, tex: 'e' }
      },
      note: 'Falls as 1/V: slow flight is expensive in induced power, which is why human-powered aircraft, gliders and soaring birds have very long spans.',
      stories: { Pind: 'A human-powered aircraft of {m} (pilot included) with a {b} span and span efficiency {eo} flies at {V} in air of density {rho}. How much power goes into induced drag?' }
    }
  ],
  examples: [
    {
      title: 'A light aircraft at 60 and 120 knots',
      q: 'A 1100 kg light aircraft (span 11 m, $e$ = 0.75, $S$ = 16.2 m², $C_{D,0}$ = 0.032) flies level at sea level at 60 kt and at 120 kt. Find the induced and parasite drag at each speed.',
      steps: [
        '60 kt = 30.9 m/s: $D_i = 2 \\times 10\\,790^2/(1.225 \\times 30.9^2 \\times \\pi \\times 121 \\times 0.75) = 700$ N.',
        'Parasite: $q = \\tfrac12 \\times 1.225 \\times 30.9^2 = 584$ Pa, $D_0 = 584 \\times 16.2 \\times 0.032 = 303$ N.',
        '120 kt: induced drag falls to a quarter, 175 N; parasite drag rises four times, to 1210 N.',
        'Induced drag is 70 % of the total at 60 kt, 13 % at 120 kt. The two are equal near 74 kt, the minimum-drag speed.'
      ],
      a: '700 N + 303 N at 60 kt; 175 N + 1210 N at 120 kt.'
    },
    {
      title: 'An airliner in cruise',
      q: 'A 65 t airliner (span 34.1 m, $e$ = 0.95) cruises at 230 m/s at 11 000 m ($\\rho$ = 0.364 kg/m³) with a lift-to-drag ratio of 17. What share of its drag is induced?',
      steps: [
        '$D_i = 2 \\times 637\\,650^2/(0.364 \\times 230^2 \\times \\pi \\times 34.1^2 \\times 0.95) = 8.13\\times10^{11}/6.68\\times10^{7} = 12.2$ kN.',
        'Total drag: $W/(L/D) = 637\\,650/17 = 37.5$ kN.',
        'Share: 12.2/37.5 = 33 %.'
      ],
      a: 'About 12 kN of 37.5 kN — a third of the cruise drag.'
    }
  ],
  quiz: [
    { q: 'An aircraft slows from 120 kt to 80 kt in level flight at constant weight. Its induced drag becomes…', choices: ['2.25 times larger', '1.5 times larger', '0.44 times as large', 'unchanged'], a: 0,
      why: 'D_i ∝ 1/V²: (120/80)² = 2.25.' },
    { q: 'What is the induced drag coefficient of a wing with C_L = 1.0, AR = 8 and e = 0.8?', answer: 0.0497,
      why: 'C_Di = 1/(π × 8 × 0.8) = 1/20.1 = 0.0497.' },
    { q: 'Which change reduces induced drag at the same weight and speed?', choices: ['a longer span', 'more wing area at the same span', 'a thicker airfoil', 'a smoother finish'], a: 0,
      why: 'D_i = 2W²/(ρV²πb²e) contains the span but not the area. Thickness and finish change the parasite drag.' },
    { q: 'At the minimum-drag speed, induced drag equals parasite drag.', a: true,
      why: 'D = AV² + B/V² has its minimum where AV² = B/V²: the two parts are equal.' },
    { q: 'In a level 60° banked turn at the same speed, the induced drag compared with straight flight is…', choices: ['four times as large', 'twice as large', 'the same', 'half'], a: 0,
      why: 'The load factor is 1/cos 60° = 2, so the lift doubles and D_i ∝ L² quadruples.' }
  ],
  problems: [
    { q: 'A 450 kg sailplane with a 15 m span flies at 25 m/s at sea level with e = 0.9. What is its induced drag?', answer: 80, unit: 'N', tol: 0.03,
      steps: ['$W = 450 \\times 9.81 = 4413$ N.', '$D_i = 2 \\times 4413^2/(1.225 \\times 625 \\times \\pi \\times 225 \\times 0.9) = 3.895\\times10^7/4.871\\times10^5 = 80$ N.'] }
  ],
  applications: [
    'Choosing the span of a new aircraft: induced drag against structural weight and gate width.',
    'Climb and approach performance, where induced drag is most of the drag.',
    'Best-glide and best-endurance speeds, set by the balance of induced and parasite drag.',
    'Soaring birds and human-powered aircraft, whose long spans keep the induced power small.'
  ],
  history: 'Lanchester guessed the link between the tip vortices and a drag due to lift in 1907. Prandtl and his colleagues in Göttingen gave the formula C_Di = C_L²/(πAR) in 1918–1919 and confirmed it with wind-tunnel tests of wings of different aspect ratios, which collapsed onto a single curve once the induced drag was taken away — one of the great successes of early aerodynamic theory.',
  sim: ['wing-induced-angle', 'wing-drag-speed']
},

{
  id: 'lifting-line', parent: 'finite-wing', title: 'Prandtl\'s lifting-line theory', level: 3,
  short: 'Prandtl\'s lifting-line theory models a straight wing as one bound vortex of varying strength along the span, shedding a sheet of trailing vortices. From the planform and twist alone it predicts the spanwise lift distribution, the lift slope and the induced drag.',
  keywords: ['lifting line', 'lifting-line theory', 'Prandtl', 'monoplane equation', 'Glauert', 'Fourier series', 'bound vortex', 'trailing vortex sheet', 'span efficiency', 'delta factor', 'tau factor', 'vortex lattice', 'Weissinger'],
  prereq: ['induced-drag', 'kutta-joukowski', 'thin-airfoil-theory', 'math:fourier-series'],
  related: ['elliptic-lift', 'oswald-efficiency', 'downwash', 'wingtip-vortices', 'panel-methods', 'cfd', 'taper-twist', 'stall-patterns', 'math:systems-of-equations'],
  body: `
Prandtl's great simplification (Göttingen, 1918–1919): for a long, straight wing, replace the whole wing by a single line — a **bound vortex** along the quarter-chord line whose strength $\\Gamma(y)$ varies along the span. Wherever $\\Gamma$ changes, a trailing vortex of strength $-d\\Gamma/dy$ per unit span leaves the line and runs straight downstream, forming a flat vortex sheet (its rolling-up is ignored).

### The equation
Three facts close the problem.
1. **The downwash** at a station $y_0$, from the whole sheet (Biot–Savart, the sheet reaching only downstream):
$$w(y_0) = \\frac{1}{4\\pi}\\int_{-b/2}^{b/2}\\frac{d\\Gamma/dy}{y_0 - y}\\,dy$$
2. **The effective angle**: the section at $y_0$ works at $\\alpha - w/V$.
3. **The section law** from two-dimensional airfoil theory ([[kutta-joukowski|Kutta–Joukowski]] and a lift slope $a_0 \\approx 2\\pi$): $\\rho V\\Gamma = \\tfrac12\\rho V^2 c\\,a_0(\\alpha - w/V - \\alpha_0)$.

Together they give Prandtl's integro-differential equation for $\\Gamma(y)$:
$$\\alpha(y_0) - \\alpha_0(y_0) = \\frac{2\\Gamma(y_0)}{a_0 V c(y_0)} + \\frac{1}{4\\pi V}\\int_{-b/2}^{b/2}\\frac{d\\Gamma/dy}{y_0 - y}\\,dy$$

### Glauert's Fourier solution
Put $y = -\\tfrac{b}{2}\\cos\\theta$ and expand the circulation as a sine series, which is automatically zero at both tips:
$$\\Gamma(\\theta) = 2bV\\sum_{n=1}^{N} A_n \\sin n\\theta$$
The integral can then be done term by term, and at every station the equation becomes
$$\\alpha - \\alpha_0 = \\frac{4b}{a_0 c}\\sum A_n\\sin n\\theta + \\sum n A_n\\frac{\\sin n\\theta}{\\sin\\theta}$$
Written at $N$ stations it is a set of $N$ linear equations for the $A_n$ ([[math:systems-of-equations|a linear system]]). Everything follows from the coefficients:
$$C_L = \\pi\\,\\mathrm{AR}\\,A_1, \\qquad C_{D,i} = \\pi\\,\\mathrm{AR}\\sum n A_n^2 = \\frac{C_L^2}{\\pi\\,\\mathrm{AR}}\\,(1+\\delta), \\qquad \\delta = \\sum_{n\\ge2} n\\left(\\frac{A_n}{A_1}\\right)^2$$
Only $A_1$ makes lift; every other term only adds drag. The span efficiency is $e = 1/(1+\\delta)$, equal to 1 only when all higher terms vanish — the [[elliptic-lift|elliptic loading]]. For a symmetric wing only odd $n$ appear. The lift slope comes out as $a = a_0/[1 + (a_0/\\pi\\mathrm{AR})(1+\\tau)]$ with a second small factor $\\tau$.

| Untwisted wing, $a_0 = 2\\pi$ | $e$ | Lift slope per degree |
|---|---|---|
| AR 8, rectangular | 0.937 | 0.0844 |
| AR 8, λ = 0.4 | 0.987 | 0.0869 |
| AR 8, λ = 0.1 | 0.946 | 0.0859 |
| AR 20, rectangular | 0.861 | 0.0968 |

The last row surprises: a long rectangular wing is *further* from elliptic, because its loading stays full almost to the tips. It still has far less induced drag than the short one — $\\mathrm{AR}\\,e$ is 17.2 against 7.5 — because aspect ratio matters much more than $\\delta$.

### Limits
The theory assumes a long, straight wing, attached flow and small angles. It over-predicts the lift of wings with aspect ratios below about 4, where the chord is not small compared with the span. It cannot handle sweep: for that the bound vortex must lie on the swept quarter-chord line and the flow condition be applied at the three-quarter-chord line — Weissinger's extension, a simple **vortex lattice**, which the planform designer below uses when the wing is swept. And it knows nothing of the stall except through the sections' $c_{l,\\max}$ (see [[stall-patterns]]). Within its range it is remarkably accurate, and it is still the first tool of wing design and a check on [[panel-methods|panel methods]] and [[cfd|CFD]].
`,
  ideas: [
    'A straight wing is modelled as one bound vortex Γ(y) on the quarter-chord line, shedding trailing vorticity −dΓ/dy.',
    'The downwash lowers each section\'s effective angle; the section law closes the equation for Γ(y).',
    'Glauert\'s sine series turns it into a linear system; C_L = πAR A₁, and every other coefficient only adds drag.',
    'C_Di = C_L²(1 + δ)/(πAR), e = 1/(1 + δ); e = 1 only for elliptic loading.',
    'It fails for low aspect ratio and for swept wings, where lifting-surface (vortex-lattice) methods take over.'
  ],
  pitfalls: [
    'Lifting-line theory predicts the stall — It is a linear, attached-flow theory; it tells where the local c_l is highest, and the stall must be judged by comparing that with each section\'s c_l,max.',
    'A higher span efficiency always means less induced drag — At the same lift, C_Di depends on AR e: a long rectangular wing with e = 0.86 still beats a short elliptic one.',
    'The theory works for any wing — For short or swept wings the single line is a poor model; the three-quarter-chord (Weissinger) or full vortex-lattice methods are needed.'
  ],
  derivation: {
    title: 'From the vortex sheet to C_L and C_Di',
    steps: [
      { text: 'Substitute $y = -\\tfrac{b}{2}\\cos\\theta$ and the sine series for the circulation:', tex: '\\Gamma(\\theta) = 2bV\\sum_n A_n \\sin n\\theta' },
      { text: 'Glauert\'s integral evaluates the downwash term by term:', tex: '\\frac{w}{V} = \\sum_n n A_n \\frac{\\sin n\\theta}{\\sin\\theta}' },
      { text: 'The lift is $\\rho V\\int\\Gamma\\,dy$ with $dy = \\tfrac{b}{2}\\sin\\theta\\,d\\theta$; only the first term survives the integral over the span:', tex: 'L = \\tfrac{\\pi}{2}\\,\\rho V^2 b^2 A_1 \\;\\Rightarrow\\; C_L = \\frac{\\pi b^2}{S} A_1 = \\pi\\,\\mathrm{AR}\\,A_1' },
      { text: 'The induced drag is $\\rho\\int\\Gamma w\\,dy$; the orthogonality of the sines leaves a sum of squares:', tex: 'C_{D,i} = \\pi\\,\\mathrm{AR}\\sum_n n A_n^2' },
      { text: 'Take out $A_1^2$ and use $C_L = \\pi\\,\\mathrm{AR}\\,A_1$:', tex: 'C_{D,i} = \\frac{C_L^2}{\\pi\\,\\mathrm{AR}}\\left(1 + \\sum_{n\\ge 2} n\\,\\frac{A_n^2}{A_1^2}\\right) = \\frac{C_L^2}{\\pi\\,\\mathrm{AR}}\\,(1+\\delta)' }
    ]
  },
  formulas: [
    {
      name: 'Induced drag from lifting-line theory',
      expr: 'CDi = CL^2*(1 + delta)/(pi*AR)', tex: 'C_{D,i} = \\dfrac{C_L^2}{\\pi\\,\\mathrm{AR}}\\,(1+\\delta)',
      vars: {
        CDi: { name: 'induced drag coefficient', tex: 'C_{D,i}' },
        CL: { name: 'wing lift coefficient', value: 0.5, min: -2, max: 3, signed: true, tex: 'C_L' },
        delta: { name: 'induced-drag factor δ = Σ n(A_n/A₁)²', value: 0.05, min: 0, max: 2, tex: '\\delta' },
        AR: { name: 'aspect ratio', value: 8, min: 0.5, max: 60, tex: '\\mathrm{AR}' }
      },
      note: 'δ = 0 for elliptic loading, about 0.01–0.07 for untwisted tapered and rectangular wings of moderate aspect ratio.',
      stories: { CDi: 'A wing of aspect ratio {AR} with δ = {delta} flies at C_L = {CL}. What is its induced drag coefficient?' }
    },
    {
      name: 'Span efficiency',
      expr: 'eo = 1/(1 + delta)', tex: 'e = \\dfrac{1}{1+\\delta}',
      vars: {
        eo: { name: 'span efficiency', tex: 'e' },
        delta: { name: 'induced-drag factor', value: 0.067, min: 0, max: 2, tex: '\\delta' }
      },
      stories: { eo: 'Lifting-line theory gives δ = {delta} for a wing. What is its span efficiency?', delta: 'A wing has a span efficiency of {eo}. What is its induced-drag factor δ?' }
    },
    {
      name: 'Lift slope of a straight wing',
      expr: 'a = a0/(1 + a0*(1 + tau)/(pi*AR))', tex: 'a = \\dfrac{a_0}{1 + \\dfrac{a_0}{\\pi\\,\\mathrm{AR}}\\,(1+\\tau)}',
      vars: {
        a: { name: 'lift slope of the wing (per radian)' },
        a0: { name: 'lift slope of the airfoil (per radian)', value: 6.283, min: 1, max: 7, tex: 'a_0' },
        tau: { name: 'lift-slope factor τ', value: 0.2, min: 0, max: 1, tex: '\\tau' },
        AR: { name: 'aspect ratio', value: 8, min: 0.5, max: 60, tex: '\\mathrm{AR}' }
      },
      note: 'τ = 0 for elliptic loading; about 0.05–0.25 for rectangular wings, growing with aspect ratio.',
      stories: { a: 'A wing of aspect ratio {AR} has τ = {tau} and an airfoil lift slope of {a0} per radian. What is its lift slope per radian?' }
    }
  ],
  examples: [
    {
      title: 'Reading a solution',
      q: 'Lifting-line theory (with 20 terms) gives an untwisted rectangular wing of aspect ratio 8, at 5° from zero lift, $C_L = 0.422$ and $e = 0.937$. Find $A_1$, $\\delta$, $C_{D,i}$ and the factor $\\tau$.',
      steps: [
        '$A_1 = C_L/(\\pi\\,\\mathrm{AR}) = 0.422/25.13 = 0.0168$.',
        '$\\delta = 1/e - 1 = 0.067$, and $C_{D,i} = 0.422^2 \\times 1.067/25.13 = 0.00757$.',
        'Lift slope $0.422/5° = 0.0844$ per degree $= 4.84$ per radian.',
        '$\\tau$: $1 + \\tau = (a_0/a - 1)\\,\\pi\\mathrm{AR}/a_0 = (6.283/4.84 - 1) \\times 4 = 1.19$, so $\\tau \\approx 0.2$.'
      ],
      a: 'A₁ = 0.0168, δ = 0.067, C_Di = 0.0076, τ ≈ 0.2.'
    },
    {
      title: 'What the higher terms cost',
      q: 'Two wings of aspect ratio 8 fly at $C_L = 0.5$: one elliptic ($\\delta$ = 0), one rectangular ($\\delta$ = 0.067). By how much does the rectangular wing\'s induced drag exceed the elliptic one\'s?',
      steps: [
        'Elliptic: $C_{D,i} = 0.25/25.13 = 0.00995$.',
        'Rectangular: $0.00995 \\times 1.067 = 0.01062$ — 6.7 % more.',
        'If induced drag is a third of the total, the whole aircraft pays about 2 %.'
      ],
      a: '6.7 % more induced drag — about 2 % of the total drag.'
    }
  ],
  quiz: [
    { q: 'In Glauert\'s series, which coefficient alone sets the lift coefficient?', choices: ['A₁', 'A₃', 'the sum of all the Aₙ', 'the largest of the Aₙ'], a: 0,
      why: 'C_L = πAR A₁: the integral of sin nθ sin θ over the span vanishes for every n except 1.' },
    { q: 'A wing has δ = 0.05. What is its span efficiency?', answer: 0.952,
      why: 'e = 1/(1 + δ) = 1/1.05 = 0.952.' },
    { q: 'Lifting-line theory predicts the angle at which a wing stalls.', a: false,
      why: 'It is a linear theory of attached flow. It gives the local c_l along the span; the stall has to be judged by comparing that with the sections\' c_l,max.' },
    { q: 'Why is lifting-line theory poor for a wing of aspect ratio 2?', choices: ['the chord is not small compared with the span, so a single line cannot represent the wing', 'the Reynolds number is too low', 'short wings have no downwash', 'the Fourier series does not converge'], a: 0,
      why: 'The theory treats every section as a two-dimensional airfoil in a slowly varying downwash; on a short wing the downwash changes along the chord too, and lifting-surface methods are needed.' },
    { q: 'For a wing that is symmetric about its centreline, which Fourier coefficients vanish?', choices: ['the even ones (A₂, A₄, …)', 'the odd ones', 'all but A₁', 'none'], a: 0,
      why: 'sin nθ is symmetric about θ = π/2 (the centreline) only for odd n; a symmetric loading needs only those terms.' }
  ],
  problems: [
    { q: 'A wing of aspect ratio 7 flies at C_L = 0.6 with δ = 0.04. What is its induced drag coefficient?', answer: 0.0170, tol: 0.02,
      steps: ['$C_{D,i} = 0.36 \\times 1.04/(\\pi \\times 7) = 0.374/22.0 = 0.0170$.'] }
  ],
  applications: [
    'Preliminary wing design: choosing taper and twist for a good loading and a safe stall.',
    'Propeller, rotor and wind-turbine blades, analysed with the same vortex ideas (blade-element and vortex theories).',
    'Checking computer codes: lifting-line and vortex-lattice results are standard test cases.',
    'Estimating the loads on a wing structure along its span.'
  ],
  history: 'Frederick Lanchester sketched the vortex system of a finite wing in 1907; Ludwig Prandtl, with Albert Betz and Max Munk, turned it into lifting-line theory in Göttingen in 1918–1919, and Prandtl presented it in English in NACA Report 116 (1921). Hermann Glauert gave the Fourier-series method its standard form in *The Elements of Aerofoil and Airscrew Theory* (1926), and Johannes Weissinger extended it to swept wings with the three-quarter-chord rule in 1947.',
  sim: 'wing-planform'
},

{
  id: 'elliptic-lift', parent: 'finite-wing', title: 'The elliptic lift distribution', level: 3,
  short: 'Lift that falls from the centre to the tips like half an ellipse gives the same downwash all along the span — and the least induced drag possible for a given lift and span. An untwisted elliptical wing produces it; a taper ratio near 0.4 comes close.',
  keywords: ['elliptic lift distribution', 'elliptic loading', 'elliptical wing', 'minimum induced drag', 'uniform downwash', 'Munk', 'Spitfire', 'span efficiency', 'bell-shaped loading', 'Prandtl 1933', 'Schrenk'],
  prereq: ['lifting-line', 'induced-drag', 'math:ellipse'],
  related: ['oswald-efficiency', 'taper-twist', 'wing-planform', 'winglets', 'bird-flight', 'math:optimization', 'math:lagrange-multipliers'],
  body: `
Of all the ways a wing of span $b$ can spread a given lift along its span, one has the least induced drag:

$$\\Gamma(y) = \\Gamma_0\\sqrt{1 - \\left(\\frac{2y}{b}\\right)^2}$$

the **elliptic distribution** — plotted along the span, half an [[math:ellipse|ellipse]]. In Glauert's series it is the first term alone, so $\\delta = 0$ and $e = 1$ (see [[lifting-line]]).

### Uniform downwash
Its remarkable property is that its downwash is the **same all along the span**:

$$w = \\frac{\\Gamma_0}{2b}, \\qquad \\alpha_i = \\frac{C_L}{\\pi\\,\\mathrm{AR}}$$

Max Munk showed (1921) that uniform downwash is exactly the condition for the least induced drag at a given lift and span. The argument is simple: if one part of the span had more downwash than another, moving a little lift from the high-downwash part to the low one would keep the total lift and cut the drag. Only when the downwash is the same everywhere is there nothing left to gain — a problem of [[math:optimization|optimisation]] under a constraint, and a textbook use of [[math:lagrange-multipliers|Lagrange multipliers]]. The drag is then

$$C_{D,i} = \\frac{C_L^2}{\\pi\\,\\mathrm{AR}}$$

For a feel of the numbers: an 1100 kg aircraft with an 11 m span and 16.2 m² of wing, at 60 m/s at sea level, flies at $C_L = 0.30$. With elliptic loading the centre-line circulation is $\\Gamma_0 = 2VSC_L/(\\pi b) = 17\\ \\mathrm{m^2/s}$, and the whole wing sits in a downwash of $w = \\Gamma_0/2b = 0.77$ m/s, an induced angle of 0.74°.

### How to get it
- **An elliptical planform, untwisted.** The chord follows the ellipse, every section works at the same $c_l$ (equal to $C_L$) and the same effective angle. The Spitfire's wing is the famous example — though it too had some washout for a gentler stall.
- **A tapered wing** with $\\lambda \\approx 0.35$–0.45 comes within 1–2 % of the ideal and is far easier to build — the usual choice.
- **Twist**: any planform can be twisted to carry an elliptic loading at one design lift coefficient.

Schrenk's approximation, used for decades to estimate wing loads, simply averages the actual chord and the elliptic chord of the same area.

### Is elliptic really best?
It is best for a **fixed span**. But span costs structure: the root bending moment grows with how far out the lift sits. In 1933 Prandtl asked a different question — the least induced drag for a given lift and a given *bending moment*, a stand-in for wing weight — and found a **bell-shaped** loading, lighter towards the tips, on a span about 22 % longer, with about 11 % less induced drag. The bell loading has upwash near its tips, which some researchers use to turn adverse yaw into proverse yaw on tailless aircraft (NASA's Prandtl-D experiments). Real airliner wings are loaded a little inboard of elliptic for the same structural reason.

> [!key] Elliptic loading is the optimum for a given span, not for a given weight of wing. e = 1 is a ceiling: real wings reach 0.95–0.99 in theory and less in flight (see [[oswald-efficiency]]).
`,
  ideas: [
    'Elliptic loading: Γ = Γ₀√(1 − (2y/b)²).',
    'It gives the same downwash all along the span: w = Γ₀/(2b), α_i = C_L/(πAR).',
    'It has the least induced drag for a given lift and span, C_Di = C_L²/(πAR), e = 1 (Munk).',
    'An untwisted elliptical planform produces it; a taper ratio near 0.4, or twist, comes close.',
    'With a limit on bending moment rather than span, a longer, bell-shaped loading does better (Prandtl 1933).'
  ],
  pitfalls: [
    'Only an elliptical planform gives elliptic lift — Taper and twist can give the same loading; the planform is only one of the ways.',
    'The elliptical wing is what made the Spitfire fast — Its designers valued a thin wing (about 13 % thick at the root) with room for guns and undercarriage as much as its loading; induced drag matters most in climbs and tight turns, not at top speed.',
    'Elliptic loading is best in every sense — It is best for a given span; for a given wing weight a longer span with a bell-shaped loading gives less induced drag.'
  ],
  formulas: [
    {
      name: 'Centre-line circulation of an elliptic wing',
      expr: 'Gamma0 = 2*V*S*CL/(pi*b)', tex: '\\Gamma_0 = \\dfrac{2\\,V S\\, C_L}{\\pi b}',
      vars: {
        Gamma0: { name: 'circulation at the centre line', unit: 'm²/s', tex: '\\Gamma_0' },
        V: { name: 'airspeed', q: 'speed', unit: 'm/s', value: 60 },
        S: { name: 'wing area', q: 'area', unit: 'm²', value: 16.2 },
        CL: { name: 'wing lift coefficient', value: 0.3, min: -2, max: 3, signed: true, tex: 'C_L' },
        b: { name: 'span', q: 'length', unit: 'm', value: 11 }
      },
      note: 'From L = ρV∫Γ dy = ρVΓ₀πb/4. Also Γ₀ = W/(ρVb₀) with b₀ = πb/4 in level flight.',
      stories: { Gamma0: 'An elliptic wing of {S} and span {b} flies at {V} with C_L = {CL}. What is the circulation at its centre line?' }
    },
    {
      name: 'Downwash of an elliptic wing',
      expr: 'w = Gamma0/(2*b)', tex: 'w = \\dfrac{\\Gamma_0}{2b}',
      vars: {
        w: { name: 'downwash at the wing (uniform)', q: 'speed', unit: 'm/s' },
        Gamma0: { name: 'centre-line circulation', unit: 'm²/s', value: 17, tex: '\\Gamma_0' },
        b: { name: 'span', q: 'length', unit: 'm', value: 11 }
      },
      note: 'The same at every station; twice this far behind the wing.',
      stories: { w: 'An elliptic wing of span {b} has a centre-line circulation of {Gamma0}. What is the downwash at the wing?' }
    },
    {
      name: 'Circulation along the span',
      expr: 'Gamma = Gamma0*sqrt(1 - eta^2)', tex: '\\Gamma = \\Gamma_0\\sqrt{1 - \\eta^2}',
      vars: {
        Gamma: { name: 'local circulation', unit: 'm²/s', tex: '\\Gamma' },
        Gamma0: { name: 'centre-line circulation', unit: 'm²/s', value: 17, tex: '\\Gamma_0' },
        eta: { name: 'spanwise station 2y/b', value: 0.8, min: 0, max: 1, tex: '\\eta' }
      },
      note: 'The local lift per metre of span is ρVΓ.',
      stories: { Gamma: 'An elliptic wing has {Gamma0} at its centre line. What is the circulation at the station {eta} of the way to the tip?', eta: 'Where along an elliptic wing has the circulation fallen from {Gamma0} to {Gamma}?' }
    }
  ],
  examples: [
    {
      title: 'The elliptic loading of a light aircraft',
      q: 'An 1100 kg aircraft (span 11 m, wing 16.2 m²) flies at 60 m/s at sea level. With elliptic loading, find its lift coefficient, centre-line circulation, downwash and induced angle.',
      steps: [
        '$C_L = 2W/(\\rho V^2 S) = 21\\,580/(1.225 \\times 3600 \\times 16.2) = 0.302$.',
        '$\\Gamma_0 = 2VSC_L/(\\pi b) = 2 \\times 60 \\times 16.2 \\times 0.302/34.6 = 17.0\\ \\mathrm{m^2/s}$.',
        '$w = \\Gamma_0/(2b) = 17.0/22 = 0.77$ m/s, and $\\alpha_i = w/V = 0.0129$ rad = 0.74°.',
        'Check: $C_L/(\\pi\\,\\mathrm{AR}) = 0.302/(\\pi \\times 7.47) = 0.0129$ rad.'
      ],
      a: 'C_L ≈ 0.30, Γ₀ ≈ 17 m²/s, w ≈ 0.77 m/s, α_i ≈ 0.74°.'
    }
  ],
  quiz: [
    { q: 'Which statement about an elliptically loaded wing is true?', choices: ['the downwash is the same all along the span', 'the downwash is largest at the tips', 'the lift per metre is the same all along the span', 'it has no induced drag'], a: 0,
      why: 'Uniform downwash is the defining property, and the condition for minimum induced drag. The lift per metre falls elliptically to zero at the tips, and the induced drag is C_L²/(πAR), not zero.' },
    { q: 'An elliptic wing of 15 m span has a centre-line circulation of 12 m²/s. What is its downwash at the wing, in m/s?', answer: 0.4, unit: 'm/s',
      why: 'w = Γ₀/(2b) = 12/30 = 0.4 m/s.' },
    { q: 'A rectangular wing can be given an elliptic loading at one lift coefficient by twisting it.', a: true,
      why: 'Washout unloads the tips of a rectangular wing; the right amount makes the loading elliptic at one C_L (and only there).' },
    { q: 'On an untwisted elliptical wing, the section lift coefficient…', choices: ['is the same at every station and equal to C_L', 'is highest at the tips', 'is highest at the root', 'is zero at the tips'], a: 0,
      why: 'Lift per metre and chord both follow the ellipse, so their ratio — the section c_l — is constant. (That also means every section reaches c_l,max together: an abrupt stall unless washout is added.)' },
    { q: 'Prandtl\'s 1933 bell-shaped loading has less induced drag than the elliptic one because…', choices: ['it is compared at the same bending moment, which allows a longer span', 'it is compared at the same span', 'it has no tip vortices', 'it has a higher lift coefficient'], a: 0,
      why: 'At the same span the ellipse is unbeatable (Munk). Fixing the bending moment instead allows about 22 % more span, and that longer span wins by about 11 %.' }
  ],
  problems: [
    { q: 'A 400 kg glider with a 15 m span flies at 30 m/s at sea level with elliptic loading. What is the downwash at its wing?', answer: 0.302, unit: 'm/s', tol: 0.03,
      steps: ['From $L = \\rho V\\Gamma_0\\pi b/4$: $\\Gamma_0 = 4 \\times 3923/(1.225 \\times 30 \\times \\pi \\times 15) = 9.06\\ \\mathrm{m^2/s}$.', '$w = \\Gamma_0/(2b) = 9.06/30 = 0.302$ m/s.'] }
  ],
  applications: [
    'The benchmark for every wing design: the span efficiency is measured against the elliptic loading.',
    'Sailplane wings with several tapered panels, shaped to approximate the ellipse.',
    'Propeller and rotor design, where the analogous optimum is a uniform induced velocity over the disc.',
    'Research on bell-shaped loadings for lighter wings and tailless aircraft.'
  ],
  history: 'Max Munk, working with Prandtl, proved in 1918–1921 that uniform downwash gives the least induced drag (NACA Report 121, 1921). The Supermarine Spitfire (first flight 1936) made the elliptical wing famous; its aerodynamicist Beverley Shenstone valued it for combining low induced drag with a thin wing that still had room for guns and undercarriage. Prandtl\'s 1933 bell-shaped optimum was largely overlooked until R. T. Jones (1950) and NASA\'s Prandtl-D flight experiments of the 2010s revived it.',
  sim: { id: 'wing-planform', params: { taper: 0.4 } }
},

{
  id: 'oswald-efficiency', parent: 'finite-wing', title: 'The Oswald efficiency factor', level: 2,
  short: 'The Oswald efficiency factor e folds everything that makes a real aircraft\'s drag-due-to-lift worse than the elliptic ideal into one number: C_D = C_D,0 + C_L²/(πAR e). Whole aircraft typically have e = 0.7–0.85.',
  keywords: ['Oswald efficiency', 'Oswald factor', 'span efficiency', 'drag polar', 'parabolic drag polar', 'lift-dependent drag', 'induced drag factor', 'K factor', 'maximum lift-to-drag ratio', 'flight test'],
  prereq: ['induced-drag', 'drag-polar', 'elliptic-lift'],
  related: ['lift-to-drag', 'minimum-drag-speed', 'lifting-line', 'winglets', 'parasite-drag', 'gliding', 'power-required', 'flight-testing'],
  body: `
The drag of a whole aircraft is usually written as a **parabolic polar**:

$$C_D = C_{D,0} + \\frac{C_L^2}{\\pi\\,\\mathrm{AR}\\,e}$$

a constant part, the zero-lift drag $C_{D,0}$ ([[parasite-drag|parasite drag]]), plus a part that grows with the square of the lift. The factor $e$ — named after W. Bailey Oswald, who introduced it in a 1932 NACA report — is the **Oswald efficiency factor**.

### Span efficiency and Oswald efficiency
For a wing alone in inviscid theory, $e$ is the **span efficiency**, set by how close the loading is to elliptic ([[lifting-line]]): 0.94–1.0 for sensible planforms. The Oswald factor of a real aircraft is lower, because more than the ideal induced drag grows with lift:
- the **fuselage** carries little lift and leaves a dip in the middle of the wing's loading;
- the **profile drag** of the airfoils rises with angle of attack, roughly with $c_l^2$ — the boundary layer thickens and the pressure drag grows — and the parabola counts it with the induced drag;
- **trim**: the tail usually pushes down, so the wing must lift more than the weight;
- nacelles, pylons, flap-track fairings, and twist chosen for the stall rather than for the ideal loading.

| Aircraft | Typical $e$ |
|---|---|
| Sailplane | 0.85–0.95 |
| Clean jet airliner | 0.75–0.85 |
| Light aircraft | 0.70–0.80 |
| Fighter at moderate lift | 0.6–0.8 |

A widely used estimate for straight-winged aircraft (from Raymer's design textbook) is $e \\approx 1.78\\,(1 - 0.045\\,\\mathrm{AR}^{0.68}) - 0.64$: 0.87 at AR 6, 0.81 at AR 8, 0.76 at AR 10. It falls with aspect ratio because the lift-dependent profile drag, roughly the same for any span, is a larger share of the small induced drag of a long wing.

### Why e matters
With the parabolic polar the best lift-to-drag ratio is

$$\\left(\\frac{L}{D}\\right)_{\\max} = \\frac12\\sqrt{\\frac{\\pi\\,\\mathrm{AR}\\,e}{C_{D,0}}}$$

reached where induced and parasite drag are equal (the [[minimum-drag-speed|minimum-drag speed]]). Aspect ratio and $e$ enter together: raising either by 10 % raises $(L/D)_{\\max}$ by 5 %. A light aircraft with AR 7.5, $e$ = 0.75 and $C_{D,0}$ = 0.032 reaches about 12; a sailplane with AR 21, $e$ = 0.9 and $C_{D,0}$ = 0.0095, about 40.

### Measuring it
In flight test or in a wind tunnel, plot the measured $C_D$ against $C_L^2$. The parabolic polar becomes a straight line: its intercept is $C_{D,0}$ and its slope is $1/(\\pi\\,\\mathrm{AR}\\,e)$. The line bends away at high lift (separation) and near zero lift (a cambered wing has its least drag at a small positive $C_L$), so $e$ is fitted over the cruise-to-climb range only. Glide tests of sailplanes, measuring sink rate at many speeds, are the classic way to do it.

> [!note] The parabolic polar is a model, not a law. It fits most aircraft well between about 0.2 and 0.9 of $C_{L,\\max}$; outside that range use the measured [[drag-polar|drag polar]].
`,
  ideas: [
    'C_D = C_D,0 + C_L²/(πAR e): the Oswald factor puts all lift-dependent drag into the induced-drag form.',
    'Span efficiency (wing alone, inviscid) is 0.94–1; whole-aircraft Oswald factors are 0.7–0.85.',
    'The fuselage, lift-dependent profile drag, trim and twist all lower e.',
    '(L/D)max = ½√(πAR e/C_D,0): aspect ratio and e count equally.',
    'e is measured as the slope of C_D plotted against C_L².'
  ],
  pitfalls: [
    'e is a property of the wing planform alone — The Oswald factor of an aircraft also includes the fuselage, the profile drag that rises with lift and the trim; it is always below the planform\'s span efficiency.',
    'An e close to 1 means the induced drag is negligible — It means the lift-dependent drag is as low as the span allows; at low speed the induced drag can still be most of the drag.',
    'The parabolic polar holds right up to the stall — Near C_L,max separation adds drag far faster than the parabola predicts.'
  ],
  formulas: [
    {
      name: 'Parabolic drag polar',
      expr: 'CD = CD0 + CL^2/(pi*AR*eo)', tex: 'C_D = C_{D,0} + \\dfrac{C_L^2}{\\pi\\,\\mathrm{AR}\\,e}',
      vars: {
        CD: { name: 'drag coefficient', tex: 'C_D' },
        CD0: { name: 'zero-lift drag coefficient', value: 0.025, min: 0.003, max: 0.2, tex: 'C_{D,0}' },
        CL: { name: 'lift coefficient', value: 0.5, min: -2, max: 3, signed: true, tex: 'C_L' },
        AR: { name: 'aspect ratio', value: 8, min: 0.5, max: 60, tex: '\\mathrm{AR}' },
        eo: { name: 'Oswald efficiency factor', value: 0.8, min: 0.3, max: 1, tex: 'e' }
      },
      note: 'Good between about 0.2 and 0.9 of C_L,max for most aircraft in their clean configuration.',
      stories: {
        CD: 'An aircraft with C_D,0 = {CD0}, aspect ratio {AR} and Oswald factor {eo} flies at C_L = {CL}. What is its drag coefficient?',
        eo: 'An aircraft of aspect ratio {AR} with C_D,0 = {CD0} has C_D = {CD} at C_L = {CL}. What is its Oswald factor?'
      }
    },
    {
      name: 'Oswald factor estimate (straight wings)',
      expr: 'eo = 1.78*(1 - 0.045*AR^0.68) - 0.64', tex: 'e = 1.78\\,(1 - 0.045\\,\\mathrm{AR}^{0.68}) - 0.64',
      vars: {
        eo: { name: 'Oswald efficiency factor', tex: 'e' },
        AR: { name: 'aspect ratio', value: 8, min: 3, max: 20, tex: '\\mathrm{AR}' }
      },
      note: 'An empirical fit to straight-winged aircraft (Raymer); an estimate for early design, not a measured value.',
      stories: { eo: 'Estimate the Oswald factor of a straight-winged aircraft of aspect ratio {AR}.' }
    },
    {
      name: 'Best lift-to-drag ratio',
      expr: 'LDmax = 0.5*sqrt(pi*AR*eo/CD0)', tex: 'E_{\\max} = \\left(\\dfrac{L}{D}\\right)_{\\max} = \\tfrac12\\sqrt{\\dfrac{\\pi\\,\\mathrm{AR}\\,e}{C_{D,0}}}',
      vars: {
        LDmax: { name: 'best lift-to-drag ratio', tex: 'E_{\\max}' },
        AR: { name: 'aspect ratio', value: 7.5, min: 0.5, max: 60, tex: '\\mathrm{AR}' },
        eo: { name: 'Oswald efficiency factor', value: 0.75, min: 0.3, max: 1, tex: 'e' },
        CD0: { name: 'zero-lift drag coefficient', value: 0.032, min: 0.003, max: 0.2, tex: 'C_{D,0}' }
      },
      note: 'For the parabolic polar; reached at C_L = √(πAR e C_D,0), where induced and parasite drag are equal. Also the best glide ratio.',
      stories: {
        LDmax: 'An aircraft has aspect ratio {AR}, Oswald factor {eo} and C_D,0 = {CD0}. What is its best lift-to-drag ratio?',
        CD0: 'A sailplane of aspect ratio {AR} and Oswald factor {eo} glides at best {LDmax} to 1. What is its zero-lift drag coefficient?'
      }
    }
  ],
  examples: [
    {
      title: 'Finding e from a measured polar',
      q: 'Glide tests of an aircraft of aspect ratio 7.5 give $C_D = 0.031$ at $C_L = 0.3$ and $C_D = 0.083$ at $C_L = 1.0$. Assuming a parabolic polar, find $e$ and $C_{D,0}$.',
      steps: [
        'Slope of $C_D$ against $C_L^2$: $(0.083 - 0.031)/(1.0 - 0.09) = 0.052/0.91 = 0.0571$.',
        '$1/(\\pi\\,\\mathrm{AR}\\,e) = 0.0571$, so $e = 1/(0.0571 \\times \\pi \\times 7.5) = 0.743$.',
        '$C_{D,0} = 0.031 - 0.0571 \\times 0.09 = 0.0259$.'
      ],
      a: 'e ≈ 0.74 and C_D,0 ≈ 0.026.'
    },
    {
      title: 'What a few per cent of e is worth',
      q: 'An airliner has AR = 9.5, $e$ = 0.80 and $C_{D,0}$ = 0.020. A wingtip modification raises $e$ by 4 %. How does $(L/D)_{\\max}$ change?',
      steps: [
        'Before: $\\tfrac12\\sqrt{\\pi \\times 9.5 \\times 0.80/0.020} = \\tfrac12\\sqrt{1194} = 17.3$.',
        'After: multiply by $\\sqrt{1.04} = 1.020$: 17.6.',
        'A 2 % better lift-to-drag ratio means about 2 % less fuel in cruise — if the modification adds no weight or friction.'
      ],
      a: 'From 17.3 to 17.6: +2 %.'
    }
  ],
  quiz: [
    { q: 'What is the best lift-to-drag ratio of an aircraft with AR = 10, e = 0.8 and C_D,0 = 0.02?', answer: 17.7,
      why: '(L/D)max = ½√(π × 10 × 0.8/0.02) = ½√1257 = 17.7.' },
    { q: 'Plotting measured C_D against C_L² gives a straight line. Its slope is…', choices: ['1/(πAR e)', 'C_D,0', 'πAR e', 'the lift slope'], a: 0,
      why: 'C_D = C_D,0 + (1/πAR e)·C_L²: a straight line in C_L² with intercept C_D,0 and slope 1/(πAR e).' },
    { q: 'A whole aircraft\'s Oswald factor is usually higher than its wing\'s span efficiency.', a: false,
      why: 'The fuselage, lift-dependent profile drag and trim all add lift-dependent drag, so the aircraft\'s e is lower.' },
    { q: 'Which of these does NOT lower an aircraft\'s Oswald factor?', choices: ['a smoother paint finish', 'the fuselage interrupting the wing\'s loading', 'profile drag growing with angle of attack', 'washout chosen for a gentle stall'], a: 0,
      why: 'A smoother finish lowers the skin friction, which is mostly C_D,0; the other three add drag that grows with lift.' },
    { q: 'Raising e by 10 % raises (L/D)max by about…', choices: ['5 %', '10 %', '21 %', '0 %'], a: 0,
      why: '(L/D)max ∝ √e: √1.1 = 1.049.' }
  ],
  problems: [
    { q: 'A light aircraft has C_D,0 = 0.030, AR = 7.4 and e = 0.76. What is its drag coefficient at C_L = 0.8?', answer: 0.0662, tol: 0.02,
      steps: ['$C_{D,i} = 0.64/(\\pi \\times 7.4 \\times 0.76) = 0.64/17.67 = 0.0362$.', '$C_D = 0.030 + 0.0362 = 0.0662$.'] }
  ],
  applications: [
    'Performance estimates in early design: range, climb and glide from C_D,0, AR and e.',
    'Flight-test analysis: extracting C_D,0 and e from measured climbs, glides or level runs.',
    'Comparing wingtip devices, fairings and flap-track fairings by their effect on e.',
    'Sailplane competition: polars measured to choose the best speed between thermals.'
  ],
  history: 'W. Bailey Oswald of Douglas Aircraft introduced the factor in NACA Report 408, "General Formulas and Charts for the Calculation of Airplane Performance" (1932), in the years of the Douglas DC-1 and DC-2, as a way to fit whole-aircraft drag with the induced-drag formula of Prandtl\'s lifting-line theory.',
  sim: { id: 'wing-drag-speed', params: { plane: 'glider' } }
},

{
  id: 'winglets', parent: 'finite-wing', title: 'Winglets', level: 2,
  short: 'Winglets and other wingtip devices reshape the flow at the tips so that a wing of limited span leaves a less costly wake, cutting induced drag and saving a few per cent of fuel on long flights. They do not abolish the tip vortices, the wake hazard, or the rule that span is the best cure.',
  keywords: ['winglet', 'wingtip device', 'sharklet', 'blended winglet', 'raked wingtip', 'wingtip fence', 'split scimitar', 'end plate', 'Whitcomb', 'nonplanar wing', 'span extension', 'fuel saving', 'slotted wingtips'],
  prereq: ['induced-drag', 'wingtip-vortices', 'oswald-efficiency'],
  related: ['elliptic-lift', 'aspect-ratio', 'bird-flight', 'lifting-line', 'flutter', 'sails'],
  body: `
Induced drag falls with the square of the span, so the best cure is a longer wing. But span is expensive: it adds bending moment at the root, weight and flexibility, and airports limit it — the gate boxes are 36, 52, 65 and 80 m wide. A **winglet** is a way of getting part of the benefit of span without all of its cost.

### What a winglet does
Near the tip the flow is strongly sideways: outward under the wing, inward over it, upward round the tip. A near-vertical fin placed in that flow and set at the right angle makes a sideways lift, and because the local flow comes at it from an angle, that force leans slightly **forward** — like a sail beating to windward — offsetting part of the drag. The same thing seen from the wake: the winglet moves the shed vorticity outward and spreads it over a taller sheet, so the energy left in the wake per metre flown is smaller.

In [[lifting-line]] terms the wing becomes **nonplanar**, and a nonplanar wing of a given span can have a span efficiency above 1 measured against a flat wing of that span. Munk's theorems still apply: what matters is the shape of the wake seen from behind.

### What it is worth
An old empirical rule for end plates of height $h$ gives an effective aspect ratio $\\mathrm{AR}_{\\text{eff}} \\approx \\mathrm{AR}\\,(1 + 1.9\\,h/b)$. For a 34 m wing with 2.4 m winglets that is 13 % more effective aspect ratio and about 12 % less induced drag. Induced drag is roughly a third of cruise drag, and the winglet brings its own skin friction and weight, so the net saving on a long flight is a few per cent of fuel — the range usually quoted for modern airliner winglets.

A **span extension** of the same length usually saves more drag than a winglet, but raises the root bending moment more. Designers compare the two at equal bending moment (or equal wing weight); winglets win mainly when the span is capped by the airport, the hangar or an existing structure.

| Device | Examples | Idea |
|---|---|---|
| Wingtip fence | Airbus A380 | small fins above and below the tip |
| Blended winglet | many business jets, Boeing 737 retrofits | tall, curved, low interference |
| Sharklet | Airbus A320 family | blended, about 2.4 m tall |
| Raked tip | Boeing 787, 777-300ER | extra span with strong sweep, no vertical part |
| Split scimitar | Boeing 737 retrofits | upper and lower elements |
| Slotted primaries | eagles, vultures, storks | spread feathers act as a fan of small wings |

### What winglets do not do
- They do **not** remove the trailing vortices. The circulation shed is set by lift, speed and span ($\\Gamma_0 \\approx W/(\\rho V b_0)$), and the far wake still rolls up into a strong pair: the wake-turbulence hazard to following aircraft is essentially unchanged.
- They pay off mainly in long cruise. On short sectors, their weight takes back much of the gain.
- They load the outer wing and change its bending and [[flutter]] behaviour, so a retrofit needs structural work and certification.

> [!note] Winglets are a structural and operational bargain, not free lunch: the least induced drag is still set by the span and by the shape of the wake.
`,
  ideas: [
    'A winglet turns the sideways flow at the tip into a force with a forward component, and spreads the shed vorticity vertically.',
    'An end-plate rule of thumb: AR_eff ≈ AR(1 + 1.9h/b).',
    'A span extension of the same length saves more drag but costs more bending moment; winglets win when span is limited.',
    'Airliner winglets save a few per cent of fuel on long flights.',
    'They do not remove the wake vortices or the wake-turbulence hazard.'
  ],
  pitfalls: [
    'Winglets stop the tip vortex from forming — The wake still rolls up into two vortices of about the same strength; winglets change how the vorticity is spread, not how much there is.',
    'Winglets are always better than extra span — At equal added length a span extension saves more drag; winglets win at equal bending moment or when the span is limited.',
    'Any fin at the tip reduces drag — A badly angled or badly blended winglet adds friction and interference drag and can cost more than it saves.'
  ],
  formulas: [
    {
      name: 'Effective aspect ratio with end plates (empirical)',
      expr: 'ARe = AR*(1 + 1.9*h/b)', tex: '\\mathrm{AR}_{\\text{eff}} = \\mathrm{AR}\\left(1 + 1.9\\,\\dfrac{h}{b}\\right)',
      vars: {
        ARe: { name: 'effective aspect ratio', tex: '\\mathrm{AR}_{\\text{eff}}' },
        AR: { name: 'geometric aspect ratio', value: 9.5, min: 0.5, max: 60, tex: '\\mathrm{AR}' },
        h: { name: 'height of the end plate or winglet', q: 'length', unit: 'm', value: 2.4 },
        b: { name: 'span', q: 'length', unit: 'm', value: 34.1 }
      },
      note: 'An old empirical rule for flat end plates; use it for the size of the effect only. Real winglets are designed with lifting-surface methods and tested.',
      stories: { ARe: 'A wing of aspect ratio {AR} and span {b} gets winglets {h} tall. Estimate its effective aspect ratio.' }
    },
    {
      name: 'Induced drag after a span change',
      expr: 'Di2 = Di1*(b1/b2)^2', tex: 'D_{i,2} = D_{i,1}\\left(\\dfrac{b_1}{b_2}\\right)^2',
      vars: {
        Di2: { name: 'induced drag with the new span', q: 'force', unit: 'kN', tex: 'D_{i,2}' },
        Di1: { name: 'induced drag with the old span', q: 'force', unit: 'kN', value: 12, tex: 'D_{i,1}' },
        b1: { name: 'old span', q: 'length', unit: 'm', value: 34.1, tex: 'b_1' },
        b2: { name: 'new span', q: 'length', unit: 'm', value: 35.8, tex: 'b_2' }
      },
      note: 'At the same weight, speed, air density and span efficiency.',
      stories: { Di2: 'An airliner has {Di1} of induced drag with a span of {b1}. Its span grows to {b2}. What is its induced drag now?' }
    }
  ],
  examples: [
    {
      title: 'Winglet or span extension?',
      q: 'A 34.1 m wing of aspect ratio 9.5 can have either 2.4 m winglets or a 2.4 m span extension at each tip. Compare the induced drag reductions.',
      steps: [
        'Winglets (end-plate rule): $\\mathrm{AR}_{\\text{eff}} = 9.5 \\times (1 + 1.9 \\times 2.4/34.1) = 10.8$, so the induced drag falls to $9.5/10.8 = 0.88$ — 12 % less.',
        'Span extension: $b = 38.9$ m; induced drag $\\times (34.1/38.9)^2 = 0.77$ — 23 % less.',
        'The extension saves about twice as much, but adds far more root bending moment — and 38.9 m no longer fits a 36 m gate.'
      ],
      a: 'About 12 % with winglets against 23 % with the same length of extra span.'
    },
    {
      title: 'From induced drag to fuel',
      q: 'In cruise an airliner\'s induced drag is 35 % of its total drag. Winglets cut the induced drag by 10 % and add 0.5 % to the total drag in friction and weight. What is the net saving?',
      steps: [
        'Induced drag saving: $0.10 \\times 35\\,\\% = 3.5\\,\\%$ of the total.',
        'Net: $3.5 - 0.5 = 3.0\\,\\%$ of the drag, and so roughly 3 % of the cruise fuel.'
      ],
      a: 'About 3 % — in line with the few per cent usually quoted.'
    }
  ],
  quiz: [
    { q: 'A winglet reduces induced drag mainly by…', choices: ['making a sideways force that leans forward in the inflow at the tip, and spreading the wake vertically', 'blocking the air from flowing round the tip', 'reducing skin friction', 'adding wing area'], a: 0,
      why: 'The flow at the tip is sideways and slightly inclined; a winglet set in it makes a force with a forward (thrust) component, the same thing as leaving a less energetic wake.' },
    { q: 'Winglets substantially reduce the wake-turbulence separation needed behind an airliner.', a: false,
      why: 'The circulation of the far wake depends on weight, speed and span; winglets change it very little, and the wake still rolls up into a hazardous pair.' },
    { q: 'A wing of 36 m span is extended to 40 m. By what factor does its induced drag change at the same weight and speed?', answer: 0.81,
      why: 'D_i ∝ 1/b²: (36/40)² = 0.81, a 19 % reduction.' },
    { q: 'When do winglets make more sense than a longer span?', choices: ['when the span is limited by the airport or when bending moment is the constraint', 'always', 'on slow, short-range aircraft', 'never'], a: 0,
      why: 'At equal length, span is better; winglets win when span is capped or when both options must add the same bending moment.' },
    { q: 'Which bird feature acts like a wingtip device?', choices: ['slotted primary feathers spread at the wingtip', 'the tail', 'the alula on the leading edge', 'the colour of the feathers'], a: 0,
      why: 'Spread primaries form a fan of small, staggered wings at the tip, spreading the wake vertically as winglets do. The alula works more like a leading-edge slat.' }
  ],
  problems: [
    { q: 'An aircraft has 12 kN of induced drag. Winglets raise its effective aspect ratio by 12 % at the same lift coefficient and wing area. What is its new induced drag?', answer: 10.7, unit: 'kN', tol: 0.02,
      steps: ['$C_{D,i} \\propto 1/\\mathrm{AR}_{\\text{eff}}$: $12/1.12 = 10.7$ kN.'] }
  ],
  applications: [
    'Airliners and business jets, new and retrofitted, to save fuel in long cruise.',
    'Sailplanes, where small winglets improve climb in thermals.',
    'Racing yachts: the winged keel of Australia II (1983) used the same idea under water.',
    'Some wind-turbine blades and propellers with tip devices.'
  ],
  history: 'Frederick Lanchester proposed end plates to reduce tip losses in the 1890s. Modern winglets were designed by Richard Whitcomb at NASA Langley in the mid-1970s (NASA TN D-8260, 1976) and flight-tested on a KC-135 tanker in 1979–1980. The Learjet 28 (1977) was the first production aircraft with winglets, and the Boeing 747-400 (1988) brought them to large airliners.',
  sim: { id: 'wing-drag-speed', params: { plane: 'airliner' } }
},

{
  id: 'ground-effect', parent: 'finite-wing', title: 'Ground effect', level: 2,
  short: 'Close to the ground — within about one span — a wing\'s downwash is blocked and partly cancelled, as if a mirror-image wing lifted downward below the surface. Induced drag falls (by half at a tenth of the span), the lift curve steepens and the trim changes: aircraft float in the flare and can lift off before they can climb.',
  keywords: ['ground effect', 'image vortex', 'mirror image', 'float', 'flare', 'Wieselsberger', 'wing in ground effect', 'WIG', 'ekranoplan', 'induced drag reduction', 'takeoff', 'pelican'],
  prereq: ['induced-drag', 'downwash', 'wingtip-vortices'],
  related: ['takeoff-landing', 'density-altitude', 'trim', 'bird-flight', 'lift-curve', 'airspeeds', 'racing-downforce'],
  body: `
A wing flying low over flat ground or water cannot push air down through the surface. The downwash beneath it is blocked and turned sideways, the tip vortices are pushed outward, and the wing behaves as if it had a longer span.

### The mirror image
The neat way to see it is an **image**. The flow above flat ground is exactly the flow of the real wing together with a mirror-image wing the same distance below the surface, lifting downward: by symmetry nothing crosses the mirror plane, just as nothing crosses the ground. The image's trailing vortices spin the other way, and at the real wing they induce **upwash**, cancelling part of the downwash. Less downwash means a smaller induced angle, so:
- the **induced drag falls**;
- the **lift rises** at the same angle of attack (the lift curve steepens);
- the **downwash at the tail** falls, so the tailplane pushes down less and the nose tends to drop — the pilot needs more up elevator in the flare;
- the static pressure at the static ports can change, so indicated airspeed and altitude may show small errors near the ground.

### How much
The fraction $\\sigma$ of the induced drag that the ground removes depends on the height $h$ of the wing above the surface divided by its span $b$. Carl Wieselsberger's classic formula (1922) is

$$\\sigma = \\frac{1 - 1.32\\,h/b}{1.05 + 7.4\\,h/b}, \\qquad C_{D,i,\\text{ground}} = (1-\\sigma)\\,C_{D,i}$$

It matches the exact image calculation for an elliptically loaded wing closely up to $h/b \\approx 0.3$; above that it falls off too fast (it reaches zero at 0.76). The image calculation gives:

| $h/b$ | 0.05 | 0.1 | 0.2 | 0.3 | 0.5 | 1.0 |
|---|---|---|---|---|---|---|
| Induced drag removed | 66 % | 48 % | 29 % | 19 % | 9 % | 3 % |

A low-wing light aircraft on its wheels has its wing about 1.1 m up with an 11 m span: $h/b \\approx 0.1$, and half its induced drag is gone. At touchdown — slow, at a high $C_L$ — induced drag is the biggest part of the drag, so the total drag drops by a quarter or more and an aircraft that arrives too fast **floats** along the runway.

### The takeoff trap
Ground effect helps the takeoff too: the wing lifts off with less drag than it will have a span higher. An overloaded aircraft, or one at a high [[density-altitude|density altitude]], can get airborne in ground effect and then find that it cannot climb out of it, because the induced drag comes back as it rises.

> [!warn] Lifting off in ground effect below a safe climb speed, and floating in the flare, are dealt with by the techniques in the aircraft's approved manuals and by flight training. This page explains the physics behind them.

### Riding the cushion on purpose
Pelicans and gulls skim the waves to save energy. **Ground-effect vehicles** (ekranoplans) fly a few metres above the water for the same reason: the Soviet KM of 1966, 544 tonnes at maximum weight, was nicknamed the Caspian Sea Monster. Racing cars exploit a related effect, an inverted wing or shaped floor near the road, to make [[racing-downforce|downforce]].
`,
  ideas: [
    'Over flat ground the flow is that of the real wing plus a mirror-image wing below the surface.',
    'The image induces upwash at the wing, reducing the downwash, the induced angle and the induced drag.',
    'The effect is strong below about a third of the span: half the induced drag is gone at h/b = 0.1, 3 % at one span.',
    'Lift rises at the same angle, the tail downwash falls (a nose-down trim change), and aircraft float in the flare.',
    'An aircraft can lift off in ground effect and be unable to climb out of it.'
  ],
  pitfalls: [
    'Ground effect is a cushion of compressed air under the wing — It is mainly a change in the downwash and the trailing vortices; the pressure under the wing rises appreciably only very close to the ground.',
    'Ground effect reaches up several spans — It fades fast: about 9 % of the induced drag at half a span, 3 % at one span.',
    'Ground effect adds drag during takeoff — It removes induced drag; the danger is the opposite, when the drag returns as the aircraft climbs out.'
  ],
  formulas: [
    {
      name: 'Wieselsberger\'s ground-effect factor',
      expr: 'sigma = (1 - 1.32*h/b)/(1.05 + 7.4*h/b)', tex: '\\sigma = \\dfrac{1 - 1.32\\,h/b}{1.05 + 7.4\\,h/b}',
      vars: {
        sigma: { name: 'fraction of the induced drag removed', tex: '\\sigma' },
        h: { name: 'height of the wing above the ground', q: 'length', unit: 'm', value: 1.1, min: 0.05, max: 8 },
        b: { name: 'span', q: 'length', unit: 'm', value: 11 }
      },
      note: 'Wieselsberger (1922). Close to the exact image result for an elliptic wing up to h/b ≈ 0.3; it falls to zero at h/b ≈ 0.76, where the true effect is still about 4 %.',
      stories: {
        sigma: 'A wing of span {b} flies {h} above flat ground. What fraction of its induced drag does the ground remove?',
        h: 'At what height does a wing of span {b} lose the fraction {sigma} of its induced drag to ground effect?'
      }
    },
    {
      name: 'Induced drag in ground effect',
      expr: 'CDiG = (1 - sigma)*CL^2/(pi*AR*eo)', tex: 'C_{D,i,g} = (1-\\sigma)\\,\\dfrac{C_L^2}{\\pi\\,\\mathrm{AR}\\,e}',
      vars: {
        CDiG: { name: 'induced drag coefficient near the ground', tex: 'C_{D,i,g}' },
        sigma: { name: 'fraction removed by the ground', value: 0.48, min: 0, max: 1, tex: '\\sigma' },
        CL: { name: 'lift coefficient', value: 1.2, min: -2, max: 3, signed: true, tex: 'C_L' },
        AR: { name: 'aspect ratio', value: 7.5, min: 0.5, max: 60, tex: '\\mathrm{AR}' },
        eo: { name: 'span efficiency', value: 0.75, min: 0.3, max: 1, tex: 'e' }
      },
      stories: { CDiG: 'A wing of aspect ratio {AR} and efficiency {eo} flies at C_L = {CL} low enough that the ground removes the fraction {sigma} of its induced drag. What is its induced drag coefficient?' }
    }
  ],
  examples: [
    {
      title: 'The float',
      q: 'A light aircraft (span 11 m, AR 7.5, $e$ = 0.75) flares with its wing 1.1 m above the runway at $C_L = 1.2$. Its zero-lift drag coefficient with flaps and wheels is 0.045. How much does ground effect cut its drag?',
      steps: [
        '$h/b = 0.1$: $\\sigma = (1 - 0.132)/(1.05 + 0.74) = 0.485$.',
        'Free air: $C_{D,i} = 1.44/(\\pi \\times 7.5 \\times 0.75) = 0.0815$; total $C_D = 0.045 + 0.0815 = 0.127$.',
        'In ground effect: $C_{D,i} = 0.515 \\times 0.0815 = 0.0420$; total $0.087$.',
        'The drag falls by 31 %: with the throttle closed the aircraft decelerates much more slowly, and floats.'
      ],
      a: 'About 31 % less drag — hence the float.'
    },
    {
      title: 'An airliner in the flare',
      q: 'An airliner with a 34 m span has its wing about 4 m above the runway at touchdown. What fraction of its induced drag is removed then, and at 17 m (half a span)?',
      steps: [
        'At 4 m: $h/b = 0.118$; $\\sigma = (1 - 0.155)/(1.05 + 0.871) = 0.44$.',
        'At 17 m: $h/b = 0.5$; Wieselsberger gives $(1 - 0.66)/(1.05 + 3.7) = 0.07$, while the image calculation gives 0.09 — the formula is already past its best range.'
      ],
      a: 'About 44 % at touchdown, and less than a tenth at half a span.'
    }
  ],
  quiz: [
    { q: 'What fraction of the induced drag does Wieselsberger\'s formula say the ground removes at h/b = 0.2?', answer: 0.291,
      why: 'σ = (1 − 0.264)/(1.05 + 1.48) = 0.736/2.53 = 0.291.' },
    { q: 'Near the ground, at the same angle of attack, a wing has…', choices: ['more lift and less induced drag', 'less lift and more drag', 'the same lift and more drag', 'less lift and less drag'], a: 0,
      why: 'Less downwash raises the effective angle (more lift at the same geometric angle) and reduces the backward tilt of the lift (less induced drag).' },
    { q: 'Why does an aircraft tend to pitch nose-down as it enters ground effect?', choices: ['the downwash at the tailplane falls, so the tail pushes down less', 'the centre of gravity moves forward', 'the engines lose thrust', 'the wing loses lift'], a: 0,
      why: 'With less downwash the tail meets the air at a higher angle; its downward force shrinks and the nose drops, so more up elevator is needed.' },
    { q: 'Ground effect is noticeable up to about one span above the surface, and strong below about a third of a span.', a: true,
      why: 'The image calculation gives 3 % at one span, 19 % at 0.3 span and 48 % at 0.1 span.' },
    { q: 'A heavily loaded aircraft lifts off in ground effect on a hot day. What can happen as it climbs away?', choices: ['the induced drag returns and it may be unable to climb or accelerate', 'its lift increases further', 'nothing changes', 'it becomes lighter'], a: 0,
      why: 'The ground effect that let it lift off disappears within a span of height; if the thrust is only just enough, the returning induced drag can stop the climb.' }
  ],
  problems: [
    { q: 'A sailplane of 15 m span lands with its wing 0.75 m above the ground. What fraction of its free-air induced drag remains (Wieselsberger)?', answer: 0.342, tol: 0.03,
      steps: ['$h/b = 0.05$: $\\sigma = (1 - 0.066)/(1.05 + 0.37) = 0.658$.', 'Remaining: $1 - 0.658 = 0.342$.'] }
  ],
  applications: [
    'Landing technique: the flare and float, and the trim change near the runway.',
    'Takeoff performance on short, hot or high airfields.',
    'Ground-effect vehicles and racing boats that ride just above the water.',
    'Birds skimming water, and racing cars that use the road as a mirror.'
  ],
  history: 'Pilots noticed the float from the earliest days. Carl Wieselsberger measured and calculated it in Göttingen in 1921–1922 using Prandtl\'s image method, and his formula has been used ever since. The Soviet designer Rostislav Alekseyev built large ground-effect craft from the 1960s, the largest being the 544-tonne KM.',
  sim: 'wing-ground-effect'
},

{
  id: 'stall-patterns', parent: 'finite-wing', title: 'Stall patterns and washout', level: 2,
  short: 'A wing does not stall all at once: separation begins where the local lift coefficient first reaches the section maximum, and spreads from there. Rectangular wings stall at the root; tapered and swept-back wings towards the tips, which can drop a wing and weaken the ailerons — so designers add washout, stall strips, cuffs, slats and fences.',
  keywords: ['stall pattern', 'tip stall', 'root stall', 'washout', 'stall strip', 'leading-edge cuff', 'wing fence', 'vortilon', 'dog-tooth', 'saw-tooth leading edge', 'pitch-up', 'wing drop', 'spanwise flow', 'critical section', 'tufts'],
  prereq: ['stall', 'taper-twist', 'lifting-line'],
  related: ['sweep', 'high-lift-devices', 'flow-control', 'spins', 'control-surfaces', 'elliptic-lift', 'delta-wings', 'flow-visualisation'],
  body: `
An airfoil stalls when its angle of attack passes the angle of its maximum lift coefficient $c_{l,\\max}$. On a wing, each section has its own local $c_l$, set by the spanwise loading (see [[lifting-line]]), and its own $c_{l,\\max}$, set by its airfoil and [[reynolds-number|Reynolds number]]. **Separation begins at the station where $c_l$ first reaches $c_{l,\\max}$**, and spreads from there. Where that station is decides how the aircraft behaves at the stall.

### Two loadings
The local lift coefficient is the sum of two parts:

$$c_l(y) = c_{l,b}(y) + C_L\\,c_{l,a}(y)$$

- the **additional loading** $c_{l,a}$, the pattern per unit of wing $C_L$, which grows with angle of attack and is fixed by the planform;
- the **basic loading** $c_{l,b}$, the pattern at zero total lift, set by twist (washout makes it negative at the tips and positive at the root).

Raising $C_L$ until the curve first touches $c_{l,\\max}(y)$ gives an estimate of the wing's maximum lift — the **critical-section method**. The wing's $C_{L,\\max}$ is typically 85–95 % of its airfoil's $c_{l,\\max}$.

### Planform by planform
| Planform (untwisted, AR 7–8) | Stall begins | Behaviour |
|---|---|---|
| Rectangular | at the root | gentle; ailerons keep working; buffet warns the pilot |
| Tapered, λ = 0.5 | near mid-span | acceptable with a little washout |
| Tapered, λ = 0.2 | about ¾ of the half-span | tip stall: wing drop, weak ailerons |
| Elliptical | everywhere at once | abrupt, with little warning |
| Swept back 30° | near the tips | tip stall with **pitch-up** |
| Swept forward | at the root | ailerons stay effective |

(From the vortex-lattice calculation in the simulation below, with the same section $c_{l,\\max}$ all along the span.)

A **tip stall** is dangerous for two reasons. The ailerons sit in the separated flow and lose their power; and one tip usually goes first, so the aircraft rolls sharply towards it — a **wing drop**, which can lead into a [[spins|spin]] if it is not recovered. On a swept-back wing the tips also lie behind the centre of gravity, so losing their lift pitches the nose up, deeper into the stall. Sweep adds a further effect: the boundary layer drifts outward along the span, thickening at the tips and lowering their $c_{l,\\max}$.

### The cures
- **Washout** unloads the tips (see [[taper-twist]]); a few degrees is common on light aircraft.
- **Stall strips**: small sharp wedges on the inboard leading edge that make the root separate first, a degree or two early.
- **Leading-edge cuffs, droops and fixed slots** on the outer wing raise the tip $c_{l,\\max}$; automatic **slats** do the same (see [[high-lift-devices]]).
- **Different airfoils** along the span, with a higher $c_{l,\\max}$ at the tip.
- **Fences, saw-tooth (dog-tooth) leading edges and vortilons** on swept wings block the spanwise drift and shed vortices that re-energise the outer boundary layer; **vortex generators** do the same (see [[flow-control]]).

> [!warn] How a particular aircraft behaves at the stall, and how a stall or spin is recovered, is set out in its approved flight manual and taught in flight training. This page explains the aerodynamics only.

Wool tufts taped to a wing — as in the simulation — are still how test pilots and wind-tunnel engineers see where the flow separates first (see [[flow-visualisation]]).
`,
  ideas: [
    'Stall begins where the local c_l first reaches the local c_l,max, and spreads from there.',
    'c_l(y) = basic loading (from twist) + C_L × additional loading (from the planform).',
    'Rectangular wings stall at the root; tapered and swept-back wings towards the tips.',
    'A tip stall weakens the ailerons and drops a wing; on a swept-back wing it also pitches the nose up.',
    'Washout, stall strips, cuffs, slats, fences and vortex generators move the first stall inboard.'
  ],
  pitfalls: [
    'A wing stalls all at once at one angle of attack — Separation starts at one station and spreads; the pattern decides whether the aircraft buffets gently or drops a wing.',
    'The elliptical wing, being ideal for drag, is ideal at the stall — Its constant c_l means every section reaches c_l,max together: a sudden stall with little warning, unless washout is added.',
    'Stall strips make the wing stall later — They make the root stall earlier, on purpose, so that the stall begins where it is harmless and warns the pilot.'
  ],
  formulas: [
    {
      name: 'Local lift coefficient: basic plus additional loading',
      expr: 'cl = clb + CL*cla', tex: 'c_l = c_{l,b} + C_L\\,c_{l,a}',
      vars: {
        cl: { name: 'section lift coefficient at the station', signed: true, tex: 'c_l' },
        clb: { name: 'basic lift coefficient (from twist, at zero wing lift)', value: -0.08, min: -1, max: 1, signed: true, tex: 'c_{l,b}' },
        CL: { name: 'wing lift coefficient', value: 1.2, min: -2, max: 3, signed: true, tex: 'C_L' },
        cla: { name: 'additional loading (section c_l per unit C_L)', value: 1.15, min: 0.2, max: 3, tex: 'c_{l,a}' }
      },
      note: 'c_l,a and c_l,b come from lifting-line or vortex-lattice theory for the planform and twist; both vary along the span.',
      stories: { cl: 'At one station a wing has an additional loading of {cla} and a basic lift coefficient of {clb}. What is the section lift coefficient there when the wing flies at C_L = {CL}?' }
    },
    {
      name: 'Wing lift coefficient at the first stall (critical section)',
      expr: 'CLmax = (clmax - clb)/cla', tex: 'C_{L,\\max} = \\dfrac{c_{l,\\max} - c_{l,b}}{c_{l,a}}',
      vars: {
        CLmax: { name: 'wing C_L when the critical section stalls', tex: 'C_{L,\\max}' },
        clmax: { name: 'section maximum lift coefficient', value: 1.5, min: 0.5, max: 4, tex: 'c_{l,\\max}' },
        clb: { name: 'basic lift coefficient at the critical station', value: -0.05, min: -1, max: 1, signed: true, tex: 'c_{l,b}' },
        cla: { name: 'additional loading at the critical station', value: 1.12, min: 0.2, max: 3, tex: 'c_{l,a}' }
      },
      note: 'The critical station is where (c_l,max − c_l,b)/c_l,a is smallest. A conservative estimate: the wing can usually lift a little more before the stall has spread.',
      stories: { CLmax: 'The critical section of a wing has c_l,max = {clmax}, a basic lift coefficient of {clb} and an additional loading of {cla}. At what wing C_L does the stall begin?' }
    }
  ],
  examples: [
    {
      title: 'The critical section of a tapered wing',
      q: 'An untwisted wing with λ = 0.2 has its highest additional loading, $c_{l,a} = 1.13$, at about 75 % of the half-span. Its sections all have $c_{l,\\max} = 1.5$. Where and at what $C_L$ does it start to stall? What does 3° of washout do if it makes $c_{l,b} = -0.06$ at that station?',
      steps: [
        'Untwisted: $c_{l,b} = 0$, so $C_{L,\\max} = 1.5/1.13 = 1.33$, with the stall starting at 75 % of the half-span — over the ailerons.',
        'With washout: $C_{L,\\max} = (1.5 + 0.06)/1.13 = 1.38$ at that station. The stall is delayed and the critical station moves a little inboard; the vortex lattice puts it at about 68 %.',
        'For a strongly tapered wing, washout alone moves the stall inboard only slowly; a tip section with a higher $c_{l,\\max}$ or stall strips at the root are added.'
      ],
      a: 'Stall begins at C_L ≈ 1.33 near the tips; washout raises that to about 1.38 and moves it slightly inboard.'
    },
    {
      title: 'Stall strips',
      q: 'A rectangular wing\'s root carries $c_{l,a} = 1.18$ and stalls first, at $C_L = 1.5/1.18 = 1.27$. Stall strips lower the root $c_{l,\\max}$ to 1.25. At what $C_L$ does separation now begin, and at how much higher a speed?',
      steps: [
        '$C_L = 1.25/1.18 = 1.06$.',
        'At the same weight, speed goes as $1/\\sqrt{C_L}$: $\\sqrt{1.27/1.06} = 1.095$.',
        'The root separates about 9 % above the speed of the full stall, giving buffet as a warning while the outer wing and ailerons are still working.'
      ],
      a: 'At C_L ≈ 1.06 — about 9 % faster than the full stall.'
    }
  ],
  quiz: [
    { q: 'Where does an untwisted rectangular wing begin to stall?', choices: ['at the root', 'at the tips', 'everywhere at once', 'at mid-span'], a: 0,
      why: 'Its additional loading is highest at the root, where the downwash is least; the tips, in strong downwash, work at lower c_l.' },
    { q: 'Why is a tip stall more dangerous than a root stall?', choices: ['the ailerons lose effect and a wing drops, which can lead to a spin', 'the root is heavier', 'a tip stall is louder', 'tip stalls always happen at lower speed'], a: 0,
      why: 'The ailerons sit in the separated flow, and an asymmetric tip stall rolls the aircraft; a root stall buffets the tail as a warning and leaves roll control.' },
    { q: 'The tips of a swept-back wing stall first. The nose…', choices: ['pitches up, because the tips lie behind the centre of gravity', 'pitches down', 'does not move', 'yaws but does not pitch'], a: 0,
      why: 'Losing lift behind the centre of gravity removes a nose-down moment: pitch-up, deeper into the stall.' },
    { q: 'A wing\'s critical section has c_l,max = 1.4, c_l,b = 0.05 and c_l,a = 1.1. At what wing C_L does it begin to stall?', answer: 1.23,
      why: 'C_L = (1.4 − 0.05)/1.1 = 1.23.' },
    { q: 'Stall strips on the inboard leading edge make the root stall before the tips.', a: true,
      why: 'The sharp edge forces separation there a degree or two early, so the stall starts where it is harmless.' }
  ],
  problems: [
    { q: 'At one station of a wing c_l,a = 1.15 and c_l,b = −0.08. What is the section lift coefficient there when the wing flies at C_L = 1.2?', answer: 1.30, tol: 0.02,
      steps: ['$c_l = -0.08 + 1.2 \\times 1.15 = -0.08 + 1.38 = 1.30$.'] }
  ],
  applications: [
    'Light-aircraft design: washout and stall strips for a docile, well-warned stall.',
    'Swept-wing airliners: slats, fences and vortilons against tip stall and pitch-up.',
    'Flight testing with wool tufts to find where the flow separates first.',
    'Model aircraft and drones, where washout keeps a slow wing from snapping into a spin.'
  ],
  history: 'NACA engineers in the 1930s tabulated the basic and additional loadings of tapered wings (R. F. Anderson, NACA Report 572, 1936), and designers used the critical-section method with them for decades. The tip-stall and pitch-up troubles of the first swept-wing jets in the late 1940s and 1950s brought the fences, dog-tooth leading edges and, later, vortilons still seen today.',
  sim: 'wing-stall-pattern'
},

{
  id: 'delta-wings', parent: 'finite-wing', title: 'Delta wings and vortex lift', level: 2,
  short: 'A delta wing is a triangle in planform: very low aspect ratio, a long root chord and a highly swept leading edge. At high angles its sharp leading edges shed two strong vortices over the top, whose suction adds vortex lift and lets it fly to 30–40° without stalling — the secret of Concorde\'s landings.',
  keywords: ['delta wing', 'vortex lift', 'leading-edge vortex', 'Polhamus', 'suction analogy', 'vortex breakdown', 'vortex burst', 'Concorde', 'slender wing', 'ogee', 'double delta', 'strake', 'leading-edge extension', 'canard delta'],
  prereq: ['sweep', 'wingtip-vortices', 'flow-separation'],
  related: ['aspect-ratio', 'supersonic-airfoils', 'mach-cone', 'wave-drag', 'stall-patterns', 'high-lift-devices', 'insect-flight', 'lift-curve'],
  body: `
Sweep a wing far enough, fill in the space behind it, and you get a triangle: the **delta**. With a leading edge swept $\\Lambda$ and a straight trailing edge, its aspect ratio is simply

$$\\mathrm{AR} = \\frac{4}{\\tan\\Lambda}$$

— 1.9 at 65°, 1.1 at 75°. Such wings are made for **supersonic** flight: the long root chord makes the wing thin relative to its chord while the structure stays deep and stiff, there is room for fuel, and with enough sweep the leading edge lies inside the [[mach-cone|Mach cone]] (at Mach 2 that needs more than 60°), which keeps the [[wave-drag|wave drag]] down.

### Attached flow: little lift per degree
At small angles a delta behaves like any low-aspect-ratio wing: its lift slope is small. A vortex-lattice calculation of a 65° delta gives about 2.1 per radian — 0.036 per degree, less than half that of an airliner wing. To make a landing lift coefficient it must fly at a large angle.

### Vortex lift
Here the delta has its trick. Its sharp, highly swept leading edges cannot keep the flow attached at high angles; the flow separates all along them — but instead of stalling, the separated sheet **rolls up into two stable, cone-shaped vortices** lying over the upper surface. Their cores are regions of very low pressure, which suck the wing upward: extra, nonlinear **vortex lift** that grows with the square of the angle.

Edward Polhamus of NASA showed in 1966 that this vortex lift is simply the **leading-edge suction** a round-nosed wing would have had in attached flow, turned through 90° to act upward:

$$C_L = K_p\\sin\\alpha\\cos^2\\alpha + K_v\\cos\\alpha\\sin^2\\alpha$$

Here $K_p$ is the attached-flow lift slope and $K_v = (K_p - K_p^2/\\pi\\mathrm{AR})/\\cos\\Lambda$, about 3.1–3.3 for most deltas. For a 65° delta at 20° the potential part gives about 0.62 and the vortex part 0.35 — vortex lift supplies over a third of the total, and more at higher angles.

The vortices keep working well past the angle at which an ordinary wing stalls — up to 30–40° on slender deltas — until they **burst**: the tight core suddenly swells into turbulence. As the angle rises, the burst point moves forward from the wake over the wing; lift then falls and the pitching moment becomes erratic.

### Concorde and others
Concorde (first flight 1969) had a slender **ogee** delta: curved leading edges, 358 m², aspect ratio 1.8. Landing at about 110 tonnes and 160 kt it needed a $C_L$ of about 0.7. The attached-flow lift alone would have asked for some 26° of angle of attack; with vortex lift the simple Polhamus estimate is about 15°. Even that is a nose-high attitude — hence the famous nose that drooped so the pilots could see the runway.

Other deltas: the Mirage III, the canard deltas of the Eurofighter Typhoon and Rafale, the double-delta Space Shuttle orbiter, the Avro Vulcan. The strakes and leading-edge extensions of the F-16 and F/A-18 are small, very swept deltas ahead of a conventional wing: their vortices keep the whole wing working at high angle. Insects and swifts use leading-edge vortices too (see [[insect-flight]]).

### The costs
A low lift slope and high landing angles (long landing gear or a drooping nose); high induced drag at low speed, because the span is short; no conventional flaps on a tailless delta, whose elevons must push down to trim; buffet after the vortices burst.

> [!note] Vortex lift is lift from controlled separation — the reverse of the usual rule that separation destroys lift. It works because the separation line is fixed at a sharp, swept edge and the vortex it feeds is stable.
`,
  ideas: [
    'A delta wing has AR = 4/tan Λ: very low aspect ratio, a long root chord, a highly swept leading edge.',
    'At small angles it lifts little per degree; at high angles its leading-edge vortices add vortex lift.',
    'Polhamus: C_L = K_p sin α cos²α + K_v cos α sin²α; the vortex term is the lost leading-edge suction, turned upward.',
    'The vortices burst at high angle — 30–40° on slender deltas — ending the gain.',
    'Concorde, strakes and leading-edge extensions all use vortex lift for low-speed flight.'
  ],
  pitfalls: [
    'Delta wings stall at the same angle as other wings — Their leading-edge vortices keep the lift rising to 30–40° on slender deltas.',
    'Vortex lift is free — It comes with high induced drag (a short span) and needs large angles of attack; deltas approach nose-high and lose speed quickly in hard turns.',
    'Separation always reduces lift — Separation along a sharp, swept leading edge forms a stable vortex that adds lift, until the vortex bursts.'
  ],
  formulas: [
    {
      name: 'Aspect ratio of a delta wing',
      expr: 'AR = 4/tan(Lam)', tex: '\\mathrm{AR} = \\dfrac{4}{\\tan\\Lambda}',
      vars: {
        AR: { name: 'aspect ratio', tex: '\\mathrm{AR}' },
        Lam: { name: 'leading-edge sweep', q: 'angle', unit: '°', value: 65, min: 40, max: 85, tex: '\\Lambda' }
      },
      note: 'For a pure triangle with a straight, unswept trailing edge.',
      stories: { AR: 'What is the aspect ratio of a delta wing whose leading edges are swept {Lam}?', Lam: 'A delta wing has an aspect ratio of {AR}. How far are its leading edges swept?' }
    },
    {
      name: 'Polhamus\'s leading-edge-suction analogy',
      expr: 'CL = Kp*sin(alpha)*cos(alpha)^2 + Kv*cos(alpha)*sin(alpha)^2', tex: 'C_L = K_p \\sin\\alpha\\cos^2\\alpha + K_v \\cos\\alpha\\sin^2\\alpha',
      vars: {
        CL: { name: 'lift coefficient (potential + vortex lift)', tex: 'C_L' },
        Kp: { name: 'attached-flow lift slope (per radian)', value: 2.06, min: 0.3, max: 4, tex: 'K_p' },
        Kv: { name: 'vortex-lift factor', value: 3.16, min: 1, max: 5, tex: 'K_v' },
        alpha: { name: 'angle of attack', q: 'angle', unit: '°', value: 15, min: 0, max: 40, tex: '\\alpha' }
      },
      note: 'For slender wings with sharp leading edges, up to the angle at which the vortices burst over the wing. K_p ≈ 2.06 and K_v ≈ 3.16 for a 65° delta.',
      stories: {
        CL: 'A delta wing with K_p = {Kp} and K_v = {Kv} flies at {alpha}. What lift coefficient does the suction analogy give?',
        alpha: 'A delta wing with K_p = {Kp} and K_v = {Kv} must fly at C_L = {CL}. What angle of attack does it need?'
      }
    },
    {
      name: 'Vortex-lift factor from the lost leading-edge suction',
      expr: 'Kv = (Kp - Kp^2/(pi*AR))/cos(Lam)', tex: 'K_v = \\dfrac{K_p - K_p^2/(\\pi\\,\\mathrm{AR})}{\\cos\\Lambda}',
      vars: {
        Kv: { name: 'vortex-lift factor', tex: 'K_v' },
        Kp: { name: 'attached-flow lift slope (per radian)', value: 2.06, min: 0.3, max: 3.5, tex: 'K_p' },
        AR: { name: 'aspect ratio', value: 1.865, min: 0.3, max: 6, tex: '\\mathrm{AR}' },
        Lam: { name: 'leading-edge sweep', q: 'angle', unit: '°', value: 65, min: 40, max: 85, tex: '\\Lambda' }
      },
      note: 'The attached-flow leading-edge suction, K_p − K_p²/(πAR), turned upward and divided by cos Λ; assumes the induced drag of attached flow is C_L²/(πAR).',
      stories: { Kv: 'A delta of aspect ratio {AR} with leading edges swept {Lam} has an attached-flow lift slope of {Kp} per radian. What is its vortex-lift factor?' }
    }
  ],
  examples: [
    {
      title: 'A 65° delta at 20°',
      q: 'A 65° delta has $K_p = 2.06$ and $K_v = 3.16$. Find its potential and vortex lift at 20°.',
      steps: [
        '$\\sin 20° = 0.342$, $\\cos 20° = 0.940$.',
        'Potential: $2.06 \\times 0.342 \\times 0.940^2 = 0.622$.',
        'Vortex: $3.16 \\times 0.940 \\times 0.342^2 = 0.347$.',
        'Total 0.97, of which 36 % is vortex lift. A conventional wing would already have stalled at this angle.'
      ],
      a: 'C_L ≈ 0.97: 0.62 potential plus 0.35 vortex lift.'
    },
    {
      title: 'Concorde on approach',
      q: 'Concorde landed at about 110 t and 160 kt (82 m/s) with 358 m² of wing. What lift coefficient did it need at sea level, and what angle does the Polhamus model of a 65° delta give?',
      steps: [
        '$C_L = 2W/(\\rho V^2 S) = 2 \\times 1\\,079\\,000/(1.225 \\times 82.3^2 \\times 358) = 0.73$.',
        'Attached flow only ($2.06\\sin\\alpha\\cos^2\\alpha = 0.73$): about 26°.',
        'With vortex lift: at 15.5°, $0.511 + 0.217 = 0.73$.',
        'Vortex lift saves about 10° of angle — but 15° is still nose-high, which is why the nose drooped for landing.'
      ],
      a: 'C_L ≈ 0.73, reached at about 15° with vortex lift instead of about 26° without.'
    }
  ],
  quiz: [
    { q: 'What is the aspect ratio of a delta wing with a 70° leading-edge sweep?', answer: 1.46,
      why: 'AR = 4/tan 70° = 4/2.747 = 1.46.' },
    { q: 'Where does the vortex lift of a delta wing come from?', choices: ['the low pressure in the cores of the leading-edge vortices over the upper surface', 'the tip vortices behind the wing', 'extra pressure under the wing only', 'the engine exhaust'], a: 0,
      why: 'The separated flow from the sharp leading edges rolls up into vortices lying over the wing; their low-pressure cores suck the upper surface upward.' },
    { q: 'At 20° angle of attack a slender delta wing is usually still gaining lift, while a conventional straight wing has stalled.', a: true,
      why: 'A straight wing of aspect ratio 8 stalls at about 15°; a slender delta\'s vortex lift keeps growing until the vortices burst, at 30–40°.' },
    { q: 'What ends the vortex lift at very high angles of attack?', choices: ['vortex breakdown (burst) moving forward over the wing', 'the vortices leaving the tips', 'shock waves', 'skin friction'], a: 0,
      why: 'The vortex cores suddenly swell and become turbulent; once the burst point reaches the wing, the suction and the lift fall.' },
    { q: 'Why did Concorde droop its nose for landing?', choices: ['its low-aspect-ratio delta needed a high angle of attack, which would have hidden the runway from the pilots', 'to reduce drag', 'to cool the engines', 'to move the centre of gravity forward'], a: 0,
      why: 'Even with vortex lift, the landing lift coefficient needed an angle of about 15°; the drooped nose gave the pilots a view past it.' }
  ],
  problems: [
    { q: 'A delta wing with K_p = 1.7 and K_v = 3.1 flies at 25°. What lift coefficient does the suction analogy give?', answer: 1.09, tol: 0.02,
      steps: ['Potential: $1.7 \\times 0.4226 \\times 0.9063^2 = 0.590$.', 'Vortex: $3.1 \\times 0.9063 \\times 0.4226^2 = 0.502$.', '$C_L = 1.09$.'] }
  ],
  applications: [
    'Supersonic aircraft: Concorde, the Tu-144, delta and canard-delta fighters.',
    'Strakes and leading-edge extensions that let fighters manoeuvre at high angles of attack.',
    'The Space Shuttle orbiter\'s double-delta wing, from hypersonic re-entry to landing.',
    'Hang gliders, delta kites and paper darts.'
  ],
  history: 'Alexander Lippisch developed tailless delta gliders in Germany in the 1930s, and the first delta-winged jet, the Convair XF-92A, flew in 1948. Edward Polhamus published the leading-edge-suction analogy at NASA Langley in 1966, as the slender-wing research behind Concorde was maturing. Concorde flew in 1969 and carried passengers from 1976 to 2003.',
  sim: 'wing-delta'
}

);
