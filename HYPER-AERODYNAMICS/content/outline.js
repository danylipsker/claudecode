/* HYPER-AERODYNAMICS · content/outline.js
 *
 * The shape of the discipline: the root, its branches and their topics.
 * Concepts live in the topic files and hang under these topics with
 * `parent: '<topic id>'`. `plan` lists the concepts each topic is meant to hold
 * (a planned concept never takes the id of a branch or topic — the validator checks).
 *
 * Hyper Aerodynamics is how air moves and what it does to things that move through it:
 * the atmosphere, flow and boundary layers, airfoils and wings, drag, high-speed flight,
 * aircraft performance, stability and control, propulsion, rotors, wind energy and nature,
 * and how aerodynamicists test and compute. The physics underneath is linked as
 * physics:<id>, the mathematics as math:<id>; water flow, pumps and pipes are in
 * hydraulics:<id>, compressed air in pneumatics:<id>.
 */
Hyper.add(
  {
    id: 'aerodynamics', kind: 'root', title: 'Hyper Aerodynamics',
    short: 'How air flows and what it does to everything that moves through it — from a sheet of paper to an airliner, a racing car, a wind turbine and a swift — explained, calculated and simulated.',
    links: [['Airfoil lab', '#/tools/airfoil', 'airfoil'], ['Atmosphere & flight calculators', '#/tools/flight', 'calc']],
    body: 'Air is thin, invisible and weighs about a kilogram per cubic metre, yet it holds up six-hundred-tonne aircraft, shapes every car, sets the speed limit of a cyclist and the power of a wind farm. Aerodynamics explains how: pressure and speed trading places along a streamline, a thin sticky boundary layer that decides between smooth flow and a turbulent wake, the circulation that makes a wing lift and the tip vortices that make it pay for it in drag, and the shock waves that appear when a body outruns its own sound.\n\nStart with the lift equation, open the [airfoil lab](#/tools/airfoil) to watch the air bend around a wing, or use the [atmosphere and flight calculators](#/tools/flight) for the standard atmosphere, airspeeds and shock tables. Every formula on these pages is a calculator that solves for any of its variables.\n\n> [!note] Hyper Aerodynamics is for learning. Aircraft figures are typical, rounded values; flight planning and aircraft operation follow the aircraft\'s approved manuals and the rules of the air, not these pages.'
  },

  /* ================================================================ BASICS */
  {
    id: 'air-and-flow-basics', kind: 'branch', parent: 'aerodynamics', title: 'Air and Flow Basics', icon: 'wind', hue: 198,
    short: 'Air as a fluid — its density, pressure, viscosity and speed of sound — and the dimensionless numbers (Reynolds, Mach, force coefficients) that let a model in a tunnel speak for a full-size aircraft.',
    body: 'Before wings and shock waves come the properties of the stuff itself. Air is a mixture of gases that behaves almost exactly as an ideal gas; it has weight, it presses on everything, it is slightly sticky, and it carries disturbances at the speed of sound. Aerodynamicists compress all of that into a few dimensionless numbers: the Reynolds number says whether viscosity or inertia rules, the Mach number whether the air has time to get out of the way, and force coefficients turn newtons into numbers that do not depend on size or speed.'
  },
  { id: 'air-properties', kind: 'topic', parent: 'air-and-flow-basics', title: 'Air as a fluid', short: 'What a fluid is; density, pressure and viscosity of air; the ideal gas; the speed of sound.',
    plan: [['what-is-a-fluid', 'What a fluid is'], ['air-density', 'Air density'], ['air-pressure', 'Pressure in air'], ['air-viscosity', 'Viscosity of air'],
           ['ideal-gas-air', 'Air as an ideal gas'], ['speed-of-sound', 'The speed of sound']] },
  { id: 'similarity', kind: 'topic', parent: 'air-and-flow-basics', title: 'Dimensionless numbers', short: 'Dimensional analysis, dynamic pressure, force coefficients, and the Reynolds, Mach and Strouhal numbers.',
    plan: [['dimensional-analysis', 'Dimensional analysis'], ['dynamic-pressure', 'Dynamic pressure'], ['force-coefficients', 'Force and moment coefficients'], ['reynolds-number', 'The Reynolds number'],
           ['mach-number', 'The Mach number'], ['strouhal-froude', 'Strouhal, Froude and other numbers']] },

  /* ================================================================ ATMOSPHERE */
  {
    id: 'atmosphere', kind: 'branch', parent: 'aerodynamics', title: 'The Atmosphere', icon: 'globe', hue: 210,
    short: 'The International Standard Atmosphere, how pressure, temperature and density fall with height, what altimeters really measure — and the wind, turbulence, shear and ice that real air adds.',
    body: 'Every aircraft performance figure is quoted for a made-up day: the International Standard Atmosphere, with 15 °C and 1013.25 hPa at sea level and a temperature falling 6.5 °C per kilometre up to the tropopause. Real days differ, and the difference matters — a hot, high airfield can leave an aircraft with too little lift and thrust to get airborne in the runway it has. Above the standard numbers sits the weather: wind that grows with height, gusts, thermals, mountain waves, shear and ice.'
  },
  { id: 'standard-atmosphere', kind: 'topic', parent: 'atmosphere', title: 'The standard atmosphere', short: 'ISA, the layers of the atmosphere, the lapse rate, pressure altitude, density altitude and humidity.',
    plan: [['isa', 'The International Standard Atmosphere'], ['atmospheric-layers', 'Layers of the atmosphere'], ['lapse-rate', 'The temperature lapse rate'], ['pressure-altitude', 'Pressure altitude and the altimeter'],
           ['density-altitude', 'Density altitude'], ['humidity-air', 'Humidity and air density']] },
  { id: 'weather-flight', kind: 'topic', parent: 'atmosphere', title: 'Wind and weather', short: 'The wind gradient, turbulence and gusts, thermals and mountain waves, wind shear and icing.',
    plan: [['wind-gradient', 'Wind and the wind gradient'], ['atmospheric-turbulence', 'Atmospheric turbulence and gusts'], ['thermals-waves', 'Thermals and mountain waves'],
           ['wind-shear', 'Wind shear and microbursts'], ['icing', 'Icing']] },

  /* ================================================================ FLOW */
  {
    id: 'flow-physics', kind: 'branch', parent: 'aerodynamics', title: 'How Air Flows', icon: 'waves', hue: 185,
    short: 'Streamlines, conservation of mass and momentum, Bernoulli\'s equation, vorticity and circulation, how airspeed is measured, and the elegant world of potential flow.',
    body: 'Flow obeys three bookkeeping rules — mass, momentum and energy are conserved — and almost everything in aerodynamics is one of them applied cleverly. Along a streamline in steady flow, pressure falls where speed rises (Bernoulli), which is how a pitot tube measures airspeed. Where viscosity can be ignored, flows can be built by adding simple pieces — uniform stream, sources, vortices — and one of those constructions, a stream plus a vortex, lifts: the Kutta–Joukowski theorem.'
  },
  { id: 'flow-description', kind: 'topic', parent: 'flow-physics', title: 'Describing flow', short: 'Streamlines, continuity, Bernoulli, the momentum equation, Navier–Stokes, vorticity and circulation.',
    plan: [['streamlines', 'Streamlines, pathlines and streaklines'], ['continuity', 'Conservation of mass'], ['bernoulli', 'Bernoulli\'s equation'], ['momentum-equation', 'The momentum equation'],
           ['navier-stokes', 'The Navier–Stokes equations'], ['vorticity-circulation', 'Vorticity and circulation']] },
  { id: 'measuring-airspeed', kind: 'topic', parent: 'flow-physics', title: 'Measuring airspeed', short: 'Stagnation and total pressure, the pitot-static system and the four airspeeds.',
    plan: [['stagnation-point', 'Stagnation and total pressure'], ['pitot-tube', 'The pitot-static tube'], ['airspeeds', 'IAS, CAS, EAS and TAS']] },
  { id: 'potential-flow', kind: 'topic', parent: 'flow-physics', title: 'Potential flow', short: 'Superposition of simple flows, the cylinder, Kutta–Joukowski, the Magnus effect and d\'Alembert\'s paradox.',
    plan: [['potential-flow-basics', 'Potential flow and superposition'], ['sources-vortices', 'Sources, sinks, doublets and vortices'], ['cylinder-flow', 'Flow around a cylinder'],
           ['kutta-joukowski', 'The Kutta–Joukowski theorem'], ['magnus-effect', 'The Magnus effect'], ['dalembert-paradox', 'D\'Alembert\'s paradox']] },

  /* ================================================================ VISCOUS */
  {
    id: 'viscous-flow', kind: 'branch', parent: 'aerodynamics', title: 'Viscosity and Boundary Layers', icon: 'fluids', hue: 170,
    short: 'The no-slip condition and the thin boundary layer where all friction lives: laminar and turbulent layers, transition, skin friction, separation, the drag crisis, vortex shedding and turbulence.',
    body: 'Air sticks to every surface. Within a millimetre or two the speed climbs from zero to the full stream, and inside that boundary layer lives all the friction drag of an aircraft — and the reason wings stall. Prandtl\'s 1904 idea of splitting the flow into a thin viscous layer and an outer frictionless stream made aerodynamics a practical science. Whether the layer is smooth and laminar or churning and turbulent, and whether it holds on or separates, decides the drag of a golf ball, the stall of a wing and the rumble of a wake.'
  },
  { id: 'boundary-layers', kind: 'topic', parent: 'viscous-flow', title: 'Boundary layers', short: 'No slip, laminar and turbulent layers, transition and skin friction.',
    plan: [['no-slip', 'The no-slip condition'], ['boundary-layer', 'The boundary layer'], ['laminar-boundary-layer', 'The laminar boundary layer'], ['turbulent-boundary-layer', 'The turbulent boundary layer'],
           ['transition', 'Transition to turbulence'], ['skin-friction', 'Skin friction']] },
  { id: 'separation-wakes', kind: 'topic', parent: 'viscous-flow', title: 'Separation and wakes', short: 'Adverse pressure gradients and separation, the drag crisis, vortex shedding, flow control and turbulence.',
    plan: [['flow-separation', 'Flow separation'], ['drag-crisis', 'The drag crisis'], ['vortex-shedding', 'Vortex shedding and wakes'], ['flow-control', 'Flow control: vortex generators and more'], ['turbulence', 'Turbulence']] },

  /* ================================================================ AIRFOILS */
  {
    id: 'airfoils', kind: 'branch', parent: 'aerodynamics', title: 'Airfoils', icon: 'airfoil', hue: 198,
    short: 'The wing section: its shape, how it turns the flow to make lift, the lift equation and the lift curve, pressure distributions, pitching moment, stall, thin-airfoil theory and the flaps and slats of landing.',
    body: 'Cut a wing across and you get an airfoil: a rounded nose, a sharp trailing edge and a gentle curve between. Tilted a few degrees into the wind it turns the air downward and the air pushes back — lift, typically 50 to 100 times the drag. The whole story is written in the pressure around its surface: strong suction over the front of the upper side, a little push underneath. Lift grows in a straight line with angle of attack until the boundary layer gives up and the airfoil stalls. Open the [airfoil lab](#/tools/airfoil) to try any NACA section.'
  },
  { id: 'airfoil-basics', kind: 'topic', parent: 'airfoils', title: 'Airfoil shape and lift', short: 'Airfoil geometry, how lift works, the lift equation, the pressure coefficient and distribution, the Kutta condition, NACA sections.',
    plan: [['airfoil-geometry', 'Airfoil geometry'], ['how-lift-works', 'How lift works'], ['lift-equation', 'The lift equation'], ['pressure-coefficient', 'The pressure coefficient'],
           ['pressure-distribution', 'Pressure distribution on an airfoil'], ['kutta-condition', 'The Kutta condition'], ['naca-airfoils', 'NACA airfoils']] },
  { id: 'airfoil-behaviour', kind: 'topic', parent: 'airfoils', title: 'Airfoil behaviour', short: 'The lift curve, stall, pitching moment, centre of pressure, thin-airfoil theory, Reynolds effects, high-lift devices and special sections.',
    plan: [['lift-curve', 'The lift curve'], ['stall', 'Stall'], ['pitching-moment', 'Pitching moment and aerodynamic centre'], ['center-of-pressure', 'Centre of pressure'],
           ['thin-airfoil-theory', 'Thin-airfoil theory'], ['reynolds-effects-airfoil', 'Reynolds number effects'], ['high-lift-devices', 'Flaps and slats'], ['special-airfoils', 'Laminar, supercritical and low-Reynolds airfoils']] },

  /* ================================================================ WINGS */
  {
    id: 'wings', kind: 'branch', parent: 'aerodynamics', title: 'Wings', icon: 'plane', hue: 215,
    short: 'Real wings end: planform, aspect ratio, sweep, taper and twist; the tip vortices, downwash and induced drag they cause; lifting-line theory, the elliptic ideal, winglets, ground effect, stall patterns and delta wings.',
    body: 'An airfoil is an infinitely long wing. A real one ends, and at its tips the high pressure underneath spills round to the low pressure on top, rolling up into two vortices that trail behind for kilometres. They tilt the flow downward over the whole wing, and the lift, tilted back with it, gains a rearward part: induced drag, the price of lift, largest when slow and heavy. Long slender wings pay least — which is why gliders and albatrosses look the way they do.'
  },
  { id: 'wing-geometry', kind: 'topic', parent: 'wings', title: 'Wing geometry', short: 'Planform, aspect ratio, sweep, taper and twist.',
    plan: [['wing-planform', 'Wing planform'], ['aspect-ratio', 'Aspect ratio'], ['sweep', 'Wing sweep'], ['taper-twist', 'Taper and twist']] },
  { id: 'finite-wing', kind: 'topic', parent: 'wings', title: 'The finite wing', short: 'Tip vortices and wake turbulence, downwash, induced drag, lifting-line theory, the elliptic wing, Oswald efficiency, winglets, ground effect, stall patterns and delta wings.',
    plan: [['wingtip-vortices', 'Wingtip vortices and wake turbulence'], ['downwash', 'Downwash'], ['induced-drag', 'Induced drag'], ['lifting-line', 'Prandtl\'s lifting-line theory'],
           ['elliptic-lift', 'The elliptic lift distribution'], ['oswald-efficiency', 'The Oswald efficiency factor'], ['winglets', 'Winglets'], ['ground-effect', 'Ground effect'],
           ['stall-patterns', 'Stall patterns and washout'], ['delta-wings', 'Delta wings and vortex lift']] },

  /* ================================================================ DRAG */
  {
    id: 'drag', kind: 'branch', parent: 'aerodynamics', title: 'Drag', icon: 'wind', hue: 30,
    short: 'The drag equation and where drag comes from — skin friction, pressure drag, interference, induced and wave drag — the drag polar and L/D; and drag in daily life: cars, trucks, bikes, balls and falling bodies.',
    body: 'Drag is the tax the air levies on motion, and it grows with the square of speed: double your speed and you push four times as hard, with eight times the power. Engineers split it into pieces because each has its own cure — smooth surfaces for friction, gentle tapering for pressure drag, long wings for induced drag, thin swept wings for wave drag. A truck, a racing cyclist and a sailplane are three very different answers to the same equation.'
  },
  { id: 'drag-types', kind: 'topic', parent: 'drag', title: 'Kinds of drag', short: 'The drag equation, parasite drag, pressure drag, wave drag, the drag polar and lift-to-drag ratio.',
    plan: [['drag-equation', 'The drag equation'], ['parasite-drag', 'Parasite drag'], ['form-drag', 'Pressure (form) drag'], ['wave-drag', 'Wave drag'],
           ['drag-polar', 'The drag polar'], ['lift-to-drag', 'Lift-to-drag ratio']] },
  { id: 'drag-everyday', kind: 'topic', parent: 'drag', title: 'Drag in everyday life', short: 'Streamlining, bluff bodies, terminal velocity, cars and trucks, racing downforce, sports balls and cycling.',
    plan: [['streamlining', 'Streamlining'], ['bluff-bodies', 'Bluff bodies'], ['terminal-velocity', 'Terminal velocity'], ['vehicle-aerodynamics', 'Road vehicle aerodynamics'],
           ['racing-downforce', 'Downforce in motorsport'], ['sports-aerodynamics', 'Aerodynamics of sports balls'], ['cycling-aero', 'Cycling and drafting']] },

  /* ================================================================ HIGH SPEED */
  {
    id: 'compressible', kind: 'branch', parent: 'aerodynamics', title: 'High-Speed Flight', icon: 'shock', hue: 250,
    short: 'When air compresses: isentropic flow and stagnation conditions, nozzles and choking, normal and oblique shocks, expansion fans, the Mach cone and sonic boom, transonic flight, the area rule and hypersonic heating.',
    body: 'Below about a third of the speed of sound air behaves as if it could not be squeezed. Faster, density changes with speed and the rules change: a converging duct that speeds up a subsonic flow slows down a supersonic one, and the flow can only go supersonic through a throat. When a body outruns its own pressure signals, the air is warned only by shock waves — thin jumps in pressure and temperature that cost energy, cause wave drag and reach the ground as a sonic boom.'
  },
  { id: 'compressible-basics', kind: 'topic', parent: 'compressible', title: 'Compressible flow', short: 'Compressibility, isentropic flow, stagnation properties, speed regimes, nozzles, choking and the de Laval nozzle.',
    plan: [['compressibility', 'When air compresses'], ['isentropic-flow', 'Isentropic flow'], ['stagnation-properties', 'Stagnation temperature and pressure'], ['mach-regimes', 'Subsonic, transonic, supersonic, hypersonic'],
           ['nozzles', 'Nozzles and choked flow'], ['de-laval-nozzle', 'The de Laval nozzle']] },
  { id: 'shocks', kind: 'topic', parent: 'compressible', title: 'Shocks and expansions', short: 'Normal and oblique shocks, Prandtl–Meyer expansion, the Mach cone and the sonic boom.',
    plan: [['normal-shock', 'Normal shock waves'], ['oblique-shock', 'Oblique shock waves'], ['expansion-fans', 'Prandtl–Meyer expansion'], ['mach-cone', 'The Mach cone'], ['sonic-boom', 'The sonic boom']] },
  { id: 'transonic-supersonic', kind: 'topic', parent: 'compressible', title: 'Flying fast', short: 'Critical Mach number, transonic flow and buffet, the area rule, sweep, supersonic airfoils and hypersonic heating.',
    plan: [['critical-mach', 'Critical Mach number'], ['transonic-flow', 'Transonic flow and buffet'], ['area-rule', 'The area rule'], ['swept-wing-compressibility', 'Sweep and compressibility'],
           ['supersonic-airfoils', 'Supersonic airfoils'], ['hypersonic-flight', 'Hypersonic flight and heating']] },

  /* ================================================================ PERFORMANCE */
  {
    id: 'performance', kind: 'branch', parent: 'aerodynamics', title: 'Flight Performance', icon: 'trend', hue: 140,
    short: 'The four forces and steady flight, thrust and power required, best speeds, load factor, turns and the V–n diagram; climb, glide, range and endurance with Breguet, takeoff and landing, ceilings and energy.',
    body: 'Put the lift and drag of the wing together with the weight of the aircraft and the thrust of its engines, and you can predict how fast it flies, how steeply it climbs, how far it glides and how far it goes on a tank of fuel. The central curve is drag against speed: high at low speed (induced drag), high at high speed (parasite drag), with a minimum in between that sets the best glide and the longest endurance. Turns multiply the load; the V–n diagram draws the fence the pilot must stay inside.'
  },
  { id: 'forces-in-flight', kind: 'topic', parent: 'performance', title: 'Forces in flight', short: 'The four forces, level flight, thrust and power required, the best speeds, load factor, turns and the V–n diagram.',
    plan: [['four-forces', 'The four forces'], ['level-flight', 'Steady level flight'], ['power-required', 'Thrust and power required'], ['minimum-drag-speed', 'Minimum-drag and minimum-power speeds'],
           ['load-factor', 'Load factor'], ['turning-flight', 'Turning flight'], ['v-n-diagram', 'The V–n diagram']] },
  { id: 'mission-performance', kind: 'topic', parent: 'performance', title: 'Climb, glide and range', short: 'Climb, gliding, range and endurance, the Breguet equation, takeoff and landing, ceilings and energy management.',
    plan: [['climb-performance', 'Climb performance'], ['gliding', 'Gliding flight'], ['range-endurance', 'Range and endurance'], ['breguet-range', 'The Breguet range equation'],
           ['takeoff-landing', 'Takeoff and landing'], ['ceiling', 'Service and absolute ceiling'], ['energy-management', 'Energy height and energy management']] },

  /* ================================================================ STABILITY */
  {
    id: 'stability-control', kind: 'branch', parent: 'aerodynamics', title: 'Stability and Control', icon: 'target', hue: 330,
    short: 'Axes and angles, centre of gravity, longitudinal, directional and lateral stability, neutral point and static margin, trim; control surfaces and adverse yaw, the dynamic modes, fly-by-wire and spins.',
    body: 'A stable aircraft, disturbed, tends to return; a controllable one does what the pilot asks. The two pull against each other: too much stability and the aircraft is sluggish, too little and it needs constant attention — or a computer. Stability comes from geometry: where the centre of gravity sits relative to the neutral point, how big the tail is and how far back, how much dihedral and sweep the wing has. Once disturbed, aircraft oscillate in characteristic ways — the phugoid, the short period, the Dutch roll — whose damping designers must get right.'
  },
  { id: 'static-stability', kind: 'topic', parent: 'stability-control', title: 'Static stability', short: 'Axes and angles, centre of gravity, longitudinal stability, neutral point and static margin, trim, directional and lateral stability.',
    plan: [['aircraft-axes', 'Axes and angles of an aircraft'], ['center-of-gravity', 'Centre of gravity and balance'], ['longitudinal-stability', 'Longitudinal static stability'], ['neutral-point', 'Neutral point and static margin'],
           ['trim', 'Trim and the tailplane'], ['directional-stability', 'Directional stability'], ['lateral-stability', 'Lateral stability and dihedral effect']] },
  { id: 'control-dynamics', kind: 'topic', parent: 'stability-control', title: 'Control and dynamics', short: 'Control surfaces and adverse yaw, dynamic stability, the phugoid, short period, Dutch roll and spiral, fly-by-wire and spins.',
    plan: [['control-surfaces', 'Control surfaces and adverse yaw'], ['dynamic-stability', 'Dynamic stability'], ['phugoid', 'The phugoid'], ['short-period', 'The short-period mode'],
           ['dutch-roll', 'Dutch roll and the spiral mode'], ['fly-by-wire', 'Fly-by-wire and relaxed stability'], ['spins', 'Spins']] },

  /* ================================================================ PROPULSION */
  {
    id: 'propulsion', kind: 'branch', parent: 'aerodynamics', title: 'Propulsion', icon: 'rocket', hue: 20,
    short: 'How thrust is made by throwing air backwards: momentum theory, propulsive efficiency, propellers; turbojets, turbofans, turboprops, fuel consumption, ramjets and scramjets, rockets and electric propulsion.',
    body: 'Every propulsor does the same thing: it throws mass backwards and the reaction pushes the vehicle forwards. The difference between them is how much mass and how fast. Accelerating a lot of air a little (a big propeller or a high-bypass fan) is efficient but runs out of breath at high speed; accelerating a little air a lot (a turbojet, a rocket) is wasteful at low speed but reaches where fans cannot. The history of aircraft engines is the history of that trade-off.'
  },
  { id: 'thrust-basics', kind: 'topic', parent: 'propulsion', title: 'Thrust', short: 'How thrust is made, actuator-disc momentum theory, propulsive efficiency and propellers.',
    plan: [['thrust', 'How thrust is made'], ['momentum-theory', 'Actuator disc and momentum theory'], ['propulsive-efficiency', 'Propulsive efficiency'], ['propellers', 'Propellers'],
           ['propeller-efficiency', 'Advance ratio and propeller efficiency']] },
  { id: 'engines', kind: 'topic', parent: 'propulsion', title: 'Engines', short: 'Turbojets, turbofans, fuel consumption, turboprops, ramjets and scramjets, rockets and electric propulsion.',
    plan: [['turbojet', 'The turbojet'], ['turbofan', 'The turbofan and bypass ratio'], ['tsfc', 'Specific fuel consumption'], ['turboprop', 'Turboprops and turboshafts'],
           ['ramjet-scramjet', 'Ramjets and scramjets'], ['rocket-propulsion', 'Rocket propulsion'], ['electric-propulsion', 'Electric aircraft propulsion']] },

  /* ================================================================ ROTORS & NATURE */
  {
    id: 'rotors-nature', kind: 'branch', parent: 'aerodynamics', title: 'Rotors, Wind and Nature', icon: 'rotor', hue: 60,
    short: 'Helicopters and drones, the power to hover and autorotation; wind turbines and the Betz limit, sails; and how birds, insects and seeds fly.',
    body: 'A helicopter rotor is a wing that goes round; a wind turbine is a propeller run backwards; a sail is a wing stood on end. The same momentum theory that sizes a propeller predicts the power to hover and the Betz limit of 59 % on how much energy any turbine can take from the wind. Nature found all of it first: soaring birds with slotted wingtips, insects that make lift from vortices at their leading edges, maple seeds that autorotate like a helicopter with a failed engine.'
  },
  { id: 'rotorcraft', kind: 'topic', parent: 'rotors-nature', title: 'Rotorcraft and drones', short: 'The helicopter rotor, power to hover, autorotation, multicopters and forward flight.',
    plan: [['helicopter-rotor', 'The helicopter rotor'], ['hover-power', 'Power to hover'], ['autorotation', 'Autorotation'], ['multicopters', 'Multicopters and drones'], ['retreating-blade', 'Forward flight and retreating-blade stall']] },
  { id: 'wind-energy', kind: 'topic', parent: 'rotors-nature', title: 'Wind energy and sails', short: 'Wind turbines, the Betz limit, tip-speed ratio and sails.',
    plan: [['wind-turbines', 'Wind turbines'], ['betz-limit', 'The Betz limit'], ['tip-speed-ratio', 'Tip-speed ratio'], ['sails', 'Sails as wings']] },
  { id: 'natural-flight', kind: 'topic', parent: 'rotors-nature', title: 'Flight in nature', short: 'Birds, insects, and seeds that glide and spin.',
    plan: [['bird-flight', 'How birds fly'], ['insect-flight', 'Insect flight and unsteady lift'], ['seeds-gliders', 'Seeds that glide and spin']] },

  /* ================================================================ ENGINEERING */
  {
    id: 'aero-engineering', kind: 'branch', parent: 'aerodynamics', title: 'Testing, Computing and Structures', icon: 'tunnel', hue: 280,
    short: 'How aerodynamics is done: wind tunnels, scale models and similarity, flow visualisation, force and pressure measurement, flight testing; panel methods, CFD and turbulence models; wind loads on buildings, flutter and bridges.',
    body: 'Aerodynamics advances on three legs: experiment, computation and flight. Wind tunnels let a model stand still while the air moves, but only similar flows are equal flows — matching Reynolds and Mach numbers at once is the art of the tunnel. Computers now solve the flow equations over millions of cells, yet their answers are only as good as their turbulence models and their validation. And when air meets flexible structures — wings, bridges, towers — it can feed energy into their vibration until they fail.'
  },
  { id: 'wind-tunnels', kind: 'topic', parent: 'aero-engineering', title: 'Wind tunnels and experiments', short: 'Wind tunnels, scale models, flow visualisation, measuring forces and pressures, flight testing.',
    plan: [['wind-tunnel', 'Wind tunnels'], ['similarity-testing', 'Scale models and similarity'], ['flow-visualisation', 'Flow visualisation'], ['force-balance', 'Measuring forces and pressures'], ['flight-testing', 'Flight testing']] },
  { id: 'computation', kind: 'topic', parent: 'aero-engineering', title: 'Computational aerodynamics', short: 'Panel methods, CFD and turbulence models.',
    plan: [['panel-methods', 'Panel methods'], ['cfd', 'Computational fluid dynamics'], ['turbulence-models', 'Turbulence models']] },
  { id: 'wind-structures', kind: 'topic', parent: 'aero-engineering', title: 'Wind on structures', short: 'Wind loads on buildings, flutter and aeroelasticity, bridges and galloping.',
    plan: [['wind-loads', 'Wind loads on buildings'], ['flutter', 'Flutter and aeroelasticity'], ['galloping-bridges', 'Bridges, galloping and Tacoma Narrows']] }
);
