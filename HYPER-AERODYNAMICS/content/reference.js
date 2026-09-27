/* HYPER-AERODYNAMICS · content/reference.js — the reference concept for aerodynamics authors:
 * its depth, tone, numbers and layout are the model (see also sims/reference.js). */
Hyper.add(

{
  id: 'lift-equation', parent: 'airfoil-basics', title: 'The lift equation', level: 1,
  short: 'Lift equals the dynamic pressure of the oncoming air, times the wing area, times a lift coefficient that carries everything about the wing\'s shape and angle: L = ½ρV²SC_L. It explains why aircraft need runways, why they fly faster high up, and at what speed a wing stalls.',
  keywords: ['lift', 'lift coefficient', 'CL', 'dynamic pressure', 'wing area', 'wing loading', 'stall speed', 'angle of attack', 'air density', 'lift equals weight'],
  prereq: ['how-lift-works', 'dynamic-pressure', 'air-density', 'physics:bernoullis-equation'],
  related: ['lift-curve', 'stall', 'force-coefficients', 'density-altitude', 'airspeeds', 'level-flight', 'induced-drag', 'high-lift-devices'],
  body: `
However a wing makes its lift — by turning the air downward, which by [[physics:newtons-third-law|Newton's third law]] pushes the wing up, and equally by the pressure difference that turning creates (see [[how-lift-works]]) — the size of the force follows one simple pattern:

$$L = \\tfrac{1}{2}\\,\\rho V^2\\, S\\, C_L$$

- $\\tfrac{1}{2}\\rho V^2$ is the [[dynamic-pressure|dynamic pressure]] $q$ — the pressure the air would exert if it were brought to rest against the wing. It holds all the dependence on the air (its density $\\rho$) and on the speed $V$.
- $S$ is the wing area seen from above (the planform area), in square metres.
- $C_L$, the **lift coefficient**, is a pure number that holds everything else: the shape of the airfoil, the [[aspect-ratio|aspect ratio]], flaps, and above all the **angle of attack** — the angle between the wing and the oncoming air.

The equation is not a law of nature so much as a definition: it defines $C_L$ as lift divided by $qS$. Its power is that $C_L$ hardly changes with size or speed (as long as the [[reynolds-number|Reynolds]] and [[mach-number|Mach numbers]] stay similar), so a coefficient measured on a model in a [[wind-tunnel|wind tunnel]] predicts the lift of the full-size aircraft.

### Speed squared
Lift grows with the **square** of speed. Double the speed and, at the same angle of attack, the wing lifts four times as much. So an aircraft that flies slowly must fly at a high $C_L$ — nose up, flaps down — and one that flies fast must fly at a small $C_L$, nearly flat. In steady level flight lift balances weight, $L = W$, so for a given aircraft every speed has its own $C_L$:

$$C_L = \\frac{2W}{\\rho V^2 S}$$

A light aircraft of 1000 kg with 16.2 m² of wing, cruising at 63 m/s (122 knots) at 2400 m where $\\rho = 0.97\\ \\mathrm{kg/m^3}$, needs $C_L \\approx 0.32$. On the approach at 32 m/s it needs about 1.1 — nearly four times as much, from a steeper angle and a little flap.

### Density and height
Air at 11 000 m has less than a third of its sea-level density, so an airliner up there must fly $\\sqrt{3.4} \\approx 1.8$ times faster (true airspeed) to make the same lift at the same $C_L$. That is one reason jets cruise high: the same lift at the same angle, but at much higher speed. The pilot's airspeed indicator measures the dynamic pressure, not the true speed (see [[airspeeds]]), so the wing always stalls at about the same *indicated* speed whatever the altitude. On a hot day at a high airfield the thin air means a longer takeoff run — the [[density-altitude|density altitude]] problem.

### The limits: stall and wing loading
$C_L$ rises in a straight line with angle of attack — about 0.1 per degree for a typical wing — until, at 12 to 16 degrees, the airflow can no longer follow the upper surface, separates, and lift collapses: the [[stall]]. The largest value, $C_{L,\\max}$, sets the slowest speed at which the wing can hold the aircraft up:

$$V_s = \\sqrt{\\frac{2W}{\\rho\\, S\\, C_{L,\\max}}}$$

The ratio $W/S$ is the **wing loading**. A glider carries about 300 N/m² (30 kg per square metre), a light aircraft 700, an airliner 6000 at takeoff. High wing loading means a high stall speed — hence the flaps and slats that raise $C_{L,\\max}$ from about 1.5 to 2.5–3 for landing (see [[high-lift-devices]]).

| | Wing area | Mass | Wing loading | $C_{L,\\max}$ | Stall speed (sea level) |
|---|---|---|---|---|---|
| Paraglider | 25 m² | 100 kg | 39 N/m² | ≈ 1.0 | ≈ 8 m/s |
| Light aircraft, flaps up | 16.2 m² | 1100 kg | 670 N/m² | ≈ 1.5 | ≈ 27 m/s (53 kt) |
| Airliner, landing flaps | 123 m² | 64 t | 5100 N/m² | ≈ 2.6 | ≈ 57 m/s (110 kt) |

> [!key] The lift equation has one speed, one density, one area and one coefficient — and the coefficient is where the pilot's control lives. Moving the elevator changes the angle of attack, which changes $C_L$, which (at a given weight) sets the speed.

> [!warn] Figures here are rounded and typical. The speeds an aircraft is actually flown at — stall, approach, rotation — come from its approved flight manual, not from this equation.

The same formula, with a drag coefficient in place of $C_L$, gives the [[drag-equation|drag]]; their ratio, the [[lift-to-drag|lift-to-drag ratio]], measures how efficient a wing is. The lift of a finite wing is a little less than its airfoil's because of the [[downwash]] from the tips — see [[lifting-line]].
`,
  ideas: [
    'Lift = dynamic pressure × wing area × lift coefficient: L = ½ρV²SC_L.',
    'The lift coefficient holds the shape and the angle of attack; it barely depends on size or speed, so models predict full-size aircraft.',
    'Lift grows with the square of speed: slow flight needs a high C_L (high angle, flaps), fast flight a low one.',
    'Thin air at altitude needs more true airspeed for the same lift; the airspeed indicator reads dynamic pressure, so the stall happens at about the same indicated speed.',
    'C_L cannot exceed C_L,max; the stall speed follows from it and from the wing loading W/S.'
  ],
  pitfalls: [
    'Lift is proportional to speed — It is proportional to the square of speed: 20 % faster gives 44 % more lift at the same angle of attack.',
    'The lift coefficient is a fixed property of the wing — It changes with angle of attack (and flaps); the wing has a whole lift curve, and in level flight it takes whatever value balances the weight at that speed.',
    'A wing stalls at a particular speed — It stalls at a particular angle of attack. The stall speed is just the speed at which level flight needs that angle; in a steep turn or pull-up the wing can stall at a much higher speed.'
  ],
  formulas: [
    {
      name: 'The lift equation',
      expr: 'L = 0.5*rho*V^2*S*CL', tex: 'L = \\tfrac{1}{2}\\,\\rho V^2 S\\, C_L',
      vars: {
        L: { name: 'lift', q: 'force', unit: 'kN' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'true airspeed', q: 'speed', unit: 'm/s', value: 60 },
        S: { name: 'wing area', q: 'area', unit: 'm²', value: 16.2 },
        CL: { name: 'lift coefficient', value: 0.5, min: -1, max: 4, signed: true, tex: 'C_L' }
      },
      note: 'For a whole wing or aircraft (capital C_L); for a two-dimensional airfoil section the same form is written per unit span with c_l. ρ = 1.225 kg/m³ at sea level in the standard atmosphere.',
      practice: { unknowns: ['L', 'V', 'CL'] },
      stories: {
        L: 'A wing of {S} flies at {V} through air of density {rho} with a lift coefficient of {CL}. How much lift does it make?',
        V: 'A light aircraft needs {L} of lift from its {S} wing at a lift coefficient of {CL}, in air of density {rho}. How fast must it fly?',
        CL: 'A {S} wing must make {L} at {V} in air of density {rho}. What lift coefficient does it need?'
      }
    },
    {
      name: 'Dynamic pressure',
      expr: 'q = 0.5*rho*V^2', tex: 'q = \\tfrac{1}{2}\\,\\rho V^2',
      vars: {
        q: { name: 'dynamic pressure', q: 'pressure', unit: 'Pa' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        V: { name: 'airspeed', q: 'speed', unit: 'm/s', value: 60 }
      },
      note: 'The pressure the air would add if brought to rest (at low Mach number). An airspeed indicator measures it and shows it as a speed.',
      stories: { q: 'What is the dynamic pressure of air of density {rho} moving at {V}?', V: 'A pitot tube measures a dynamic pressure of {q} in air of density {rho}. How fast is the air moving?' }
    },
    {
      name: 'Stall speed',
      expr: 'Vs = sqrt(2*m*g/(rho*S*CLmax))', tex: 'V_s = \\sqrt{\\dfrac{2\\, m g}{\\rho\\, S\\, C_{L,\\max}}}',
      vars: {
        Vs: { name: 'stall speed', q: 'speed', unit: 'kt', tex: 'V_s' },
        m: { name: 'aircraft mass', q: 'mass', unit: 'kg', value: 1100 },
        g: { const: 'g' },
        rho: { name: 'air density', q: 'density', unit: 'kg/m³', value: 1.225, tex: '\\rho' },
        S: { name: 'wing area', q: 'area', unit: 'm²', value: 16.2 },
        CLmax: { name: 'maximum lift coefficient', value: 1.5, min: 0.1, max: 5, tex: 'C_{L,\\max}' }
      },
      note: 'For straight, level (1 g) flight. In a turn or pull-up the load factor n multiplies the weight and the stall speed grows as √n.',
      practice: { unknowns: ['Vs', 'CLmax', 'm'] },
      stories: {
        Vs: 'An aircraft of {m} with a {S} wing has a maximum lift coefficient of {CLmax}. At what speed does it stall in air of density {rho}?',
        CLmax: 'An aircraft of {m} with {S} of wing stalls at {Vs} in air of density {rho}. What is its maximum lift coefficient?'
      }
    },
    {
      name: 'Lift slope of a thin airfoil',
      expr: 'cl = 2*pi*(alpha - alpha0)', tex: 'c_l = 2\\pi\\,(\\alpha - \\alpha_0)',
      vars: {
        cl: { name: 'section lift coefficient', signed: true, tex: 'c_l' },
        alpha: { name: 'angle of attack', q: 'angle', unit: '°', value: 4, min: -10, max: 15, signed: true, tex: '\\alpha' },
        alpha0: { name: 'zero-lift angle', q: 'angle', unit: '°', value: -2, min: -6, max: 2, signed: true, tex: '\\alpha_0' }
      },
      note: 'Thin-airfoil theory: 2π per radian, about 0.11 per degree, for a two-dimensional section below the stall. A cambered airfoil has a negative zero-lift angle (about −2° for 2 % camber). A finite wing has a smaller slope — see lifting-line theory.',
      stories: { cl: 'A section with a zero-lift angle of {alpha0} meets the air at {alpha}. What lift coefficient does thin-airfoil theory predict?' }
    }
  ],
  examples: [
    {
      title: 'Lift from a light aircraft\'s wing',
      q: 'A light aircraft has a wing of 16.2 m². How much lift does it make at 50 m/s at sea level ($\\rho = 1.225\\ \\mathrm{kg/m^3}$) with $C_L = 0.6$? Is that enough for its 1100 kg?',
      steps: [
        'Dynamic pressure: $q = \\tfrac12 \\times 1.225 \\times 50^2 = 1531$ Pa.',
        'Lift: $L = q S C_L = 1531 \\times 16.2 \\times 0.6 = 14\\,880$ N.',
        'Weight: $1100 \\times 9.81 = 10\\,790$ N. The lift is larger, so at this speed the pilot would lower the nose until $C_L = 10\\,790/(1531 \\times 16.2) = 0.44$.'
      ],
      a: 'About 14.9 kN — more than the 10.8 kN weight, so level flight at 50 m/s needs only C_L ≈ 0.44.'
    },
    {
      title: 'The same wing, higher up',
      q: 'The aircraft now cruises at 3000 m, where the standard atmosphere gives $\\rho = 0.909\\ \\mathrm{kg/m^3}$. At the same $C_L = 0.44$, what true airspeed holds it up?',
      steps: [
        'Level flight: $V = \\sqrt{2W/(\\rho S C_L)}$.',
        '$V = \\sqrt{2 \\times 10\\,790/(0.909 \\times 16.2 \\times 0.44)} = \\sqrt{3331} = 57.7$ m/s.',
        'Check: the ratio to 50 m/s is $\\sqrt{1.225/0.909} = 1.16$. The dynamic pressure — and the airspeed indicator — reads the same as at sea level at 50 m/s.'
      ],
      a: 'About 58 m/s true airspeed — 16 % faster — for the same indicated airspeed.'
    },
    {
      title: 'Stall speed and landing flaps',
      q: 'An airliner of 64 t with 122.6 m² of wing lands at sea level. With the flaps up its $C_{L,\\max}$ is 1.5; with landing flaps and slats, 2.7. Find both stall speeds in knots.',
      steps: [
        'Weight: $64\\,000 \\times 9.81 = 627\\,800$ N; wing loading $627\\,800/122.6 = 5121$ N/m².',
        'Flaps up: $V_s = \\sqrt{2 \\times 5121/(1.225 \\times 1.5)} = \\sqrt{5574} = 74.7$ m/s = 145 kt.',
        'Landing configuration: $V_s = \\sqrt{2 \\times 5121/(1.225 \\times 2.7)} = \\sqrt{3097} = 55.6$ m/s = 108 kt.',
        'Approach speeds are flown about 23 % above the stall speed: about 133 kt with flaps, which is typical of this class of airliner.'
      ],
      a: 'About 145 kt clean and 108 kt with landing flaps — flaps cut the stall speed by a quarter.'
    }
  ],
  quiz: [
    { q: 'An aircraft doubles its speed while keeping the same angle of attack. Its lift becomes…', choices: ['twice as large', 'four times as large', '√2 times as large', 'unchanged, because C_L is the same'], a: 1,
      why: 'Lift is proportional to V² at constant C_L: 2² = 4. In practice the pilot lowers the nose to cut C_L to a quarter so that lift still equals weight.' },
    { q: 'At a given weight, the slowest an aircraft can fly level is set by…', choices: ['its engine power', 'its maximum lift coefficient and its wing loading', 'the density of the air only', 'its drag coefficient'], a: 1,
      why: 'V_s = √(2W/(ρSC_L,max)): wing loading W/S and C_L,max (and the air density). That is why flaps and slats, which raise C_L,max, are used for landing.' },
    { q: 'What lift coefficient does a 600 kg glider with 12 m² of wing need at 25 m/s at sea level?', answer: 1.28, tol: 0.03,
      why: 'C_L = 2W/(ρV²S) = 2 × 600 × 9.81/(1.225 × 25² × 12) = 11 772/9188 = 1.28 — a high value, close to the stall of a typical glider wing, so 25 m/s is near its slowest speed.' },
    { q: 'An aircraft stalls at the same indicated airspeed at 3000 m as at sea level, although its true airspeed is higher.', a: true,
      why: 'The airspeed indicator measures dynamic pressure ½ρV², and the stall depends on C_L,max and q. The true airspeed at the stall is higher in thin air, the indicated one about the same.' },
    { q: 'Which change does NOT raise the lift of a wing in flight?', choices: ['flying faster', 'increasing the angle of attack below the stall', 'lowering the flaps', 'climbing to thinner air at the same true airspeed'], a: 3,
      why: 'Thinner air lowers the dynamic pressure at the same true airspeed, and so lowers the lift. The other three raise V² or C_L.' }
  ],
  problems: [
    { q: 'A paraglider pilot and wing weigh 100 kg together; the wing has 25 m² and a maximum lift coefficient of 1.0. What is the stall speed at sea level?', answer: 8.0, unit: 'm/s', tol: 0.03,
      steps: ['$V_s = \\sqrt{2mg/(\\rho S C_{L,\\max})} = \\sqrt{2 \\times 981/(1.225 \\times 25 \\times 1.0)}$.', '$= \\sqrt{64.1} = 8.0$ m/s, about 29 km/h.'] },
    { q: 'A model wing of 0.1 m² in a wind tunnel at 30 m/s in sea-level air measures 28 N of lift. What is its lift coefficient?', answer: 0.508, tol: 0.02,
      steps: ['$q = \\tfrac12 \\times 1.225 \\times 30^2 = 551$ Pa.', '$C_L = L/(qS) = 28/(551 \\times 0.1) = 0.508$.'] }
  ],
  applications: ['Sizing a wing: choosing wing area from the weight, the landing speed and the C_L,max that flaps can give.', 'Takeoff and landing performance charts, which scale speeds and distances with density altitude.', 'Wind-tunnel testing: measured coefficients transferred to the full-size aircraft.', 'Racing cars, where the same equation with the wing upside down gives downforce.'],
  history: 'The form ½ρV²SC was settled in the 1910s and 1920s, as Ludwig Prandtl in Göttingen and the NACA in the United States replaced the older Smeaton coefficient (used by Lilienthal and the Wright brothers, who found in their 1901 wind tunnel that it was badly wrong) with properly measured air density.',
  sim: ['ref-airfoil', 'ref-lift-balance']
}

);
