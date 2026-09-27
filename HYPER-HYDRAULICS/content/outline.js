/* HYPER-HYDRAULICS · content/outline.js
 *
 * The shape of the discipline: the root, its branches and their topics.
 * Concepts live in the topic files and hang under these topics with
 * `parent: '<topic id>'`. `plan` lists the concepts each topic is meant to hold
 * (a planned concept never takes the id of a branch or topic — the validator checks).
 *
 * Hyper Hydraulics is liquids doing work: their properties, pressure at rest, flow in pipes
 * and channels, pumps and turbines, water hammer — and oil hydraulics (fluid power): pumps,
 * motors, cylinders, valves and circuits drawn in ISO 1219 symbols, their design, care and
 * control. The physics underneath is linked as physics:<id>, the mathematics as math:<id>;
 * airflow is in aerodynamics:<id> and compressed air in pneumatics:<id>.
 */
Hyper.add(
  {
    id: 'hydraulics', kind: 'root', title: 'Hyper Hydraulics',
    short: 'Liquids that carry, lift and push: pressure, flow, pipes, pumps, channels and water hammer — and the oil-hydraulic power that moves excavators, presses and aircraft controls, from pump to cylinder, valve and circuit.',
    links: [['Pipes, pumps & channels', '#/tools/hydro', 'pipe'], ['Fluid-power calculators', '#/tools/fpower', 'calc'], ['ISO 1219 symbols', '#/tools/iso', 'circuit']],
    body: 'A liquid barely changes its volume however hard it is squeezed, and it passes pressure on equally in every direction. Those two facts let a child\'s push on a jack lift a car, let water climb from a valley reservoir to a hilltop town, and let a 20-tonne excavator dig with the delicacy of a hand. Hydraulics is the engineering of that: the friction of pipes and the head of pumps, the surge when a valve slams, the flow over a weir — and, in oil hydraulics, the pumps, valves, cylinders and motors that turn pressure and flow into controlled force and motion.\n\nStart with the hydraulic cylinder, use the [pipe, pump and channel calculators](#/tools/hydro), the [fluid-power calculators](#/tools/fpower), or the [ISO 1219 symbol chart](#/tools/iso). Every formula on these pages is a calculator that solves for any of its variables.\n\n> [!warn] Hydraulic systems store energy — in pressurised oil, accumulators and raised loads. The pages explain how systems work; work on a real machine follows its manual, lock-out procedures and the relevant safety standards (ISO 4413). Oil escaping from a pinhole at high pressure can pierce the skin: an injection injury is a surgical emergency.'
  },

  /* ================================================================ PROPERTIES */
  {
    id: 'fluid-properties', kind: 'branch', parent: 'hydraulics', title: 'Fluid Properties', icon: 'fluids', hue: 200,
    short: 'Density and specific weight, viscosity and how it changes with temperature, bulk modulus, vapour pressure, surface tension, non-Newtonian liquids — and the hydraulic oils built on them.',
    body: 'Everything a hydraulic system does depends on the liquid inside it. Its density sets pressures at depth and the momentum of moving columns; its viscosity sets friction losses, leakage and the heat they make — and viscosity can change a hundredfold between a frosty morning and a hot afternoon. Its bulk modulus, how hard it resists squeezing, decides how stiff an actuator is and how violent a water hammer. Its vapour pressure decides when it boils in a pump inlet. Hydraulic oils are engineered to keep all of these in range.'
  },
  { id: 'liquid-properties', kind: 'topic', parent: 'fluid-properties', title: 'Properties of liquids', short: 'Density, viscosity and its temperature dependence, bulk modulus, vapour pressure, surface tension and non-Newtonian behaviour.',
    plan: [['density-specific-weight', 'Density and specific weight'], ['viscosity', 'Viscosity'], ['viscosity-temperature', 'Viscosity, temperature and viscosity index'], ['bulk-modulus', 'Bulk modulus and compressibility'],
           ['vapour-pressure', 'Vapour pressure and boiling'], ['surface-tension', 'Surface tension and capillarity'], ['non-newtonian', 'Non-Newtonian liquids']] },
  { id: 'hydraulic-fluids', kind: 'topic', parent: 'fluid-properties', title: 'Hydraulic fluids', short: 'Mineral oils and ISO VG grades, fire-resistant and biodegradable fluids, choosing a fluid, air in oil.',
    plan: [['hydraulic-oils', 'Hydraulic oils and ISO VG grades'], ['fire-resistant-fluids', 'Fire-resistant and biodegradable fluids'], ['fluid-selection', 'Choosing a hydraulic fluid'], ['air-in-oil', 'Air in oil: aeration and foaming']] },

  /* ================================================================ HYDROSTATICS */
  {
    id: 'hydrostatics', kind: 'branch', parent: 'hydraulics', title: 'Hydrostatics', icon: 'gauge', hue: 215,
    short: 'Pressure in a liquid at rest: gauge and absolute pressure, pressure with depth, Pascal\'s law and the hydraulic press, manometers; forces on walls, gates and dams, buoyancy and the stability of floating bodies.',
    body: 'A liquid at rest pushes equally in all directions, and the push grows steadily with depth — ten metres of water add one atmosphere. That simple rule sizes dam walls and tank gates, explains why a submarine hull is thick and a hot-water tank thin, and lets a narrow column of mercury or water measure pressure. Pascal saw its most useful consequence: pressure applied anywhere in a confined liquid reaches everywhere, so a small piston can move a large one with a great force.'
  },
  { id: 'pressure-basics', kind: 'topic', parent: 'hydrostatics', title: 'Pressure at rest', short: 'Pressure, gauge and absolute pressure, pressure with depth, Pascal\'s law, the hydraulic press and manometers.',
    plan: [['pressure-definition', 'Pressure'], ['gauge-absolute', 'Gauge and absolute pressure'], ['pressure-with-depth', 'Pressure and depth'], ['pascals-law', 'Pascal\'s law'],
           ['hydraulic-press', 'The hydraulic press and jack'], ['manometers', 'Manometers and pressure gauges']] },
  { id: 'forces-on-surfaces', kind: 'topic', parent: 'hydrostatics', title: 'Forces on surfaces', short: 'Forces on plane and curved surfaces, the centre of pressure, buoyancy, floating stability, tanks, gates and dams.',
    plan: [['force-on-plane-surface', 'Force on a submerged plane surface'], ['centre-of-pressure', 'Centre of pressure'], ['curved-surfaces', 'Forces on curved surfaces'], ['buoyancy-archimedes', 'Buoyancy and Archimedes\' principle'],
           ['floating-stability', 'Stability of floating bodies'], ['tanks-dams-pressure', 'Pressure on tanks, gates and dams']] },

  /* ================================================================ FLOW */
  {
    id: 'flow-fundamentals', kind: 'branch', parent: 'hydraulics', title: 'Liquids in Motion', icon: 'waves', hue: 190,
    short: 'Flow rate and continuity, laminar and turbulent flow, the Reynolds number, Bernoulli and the energy equation with head, grade lines; the momentum principle and the forces of jets and bends; measuring flow.',
    body: 'Moving liquids obey the same three conservation laws as everything else. Mass: what flows in must flow out, so a liquid speeds up where a pipe narrows. Energy: written in metres of liquid — pressure head, velocity head and elevation — it trades between forms and is slowly lost to friction. Momentum: a jet that is turned pushes on whatever turns it, which is how a Pelton wheel works and why pipe bends need anchoring. Every flowmeter is one of these laws put to work.'
  },
  { id: 'flow-basics', kind: 'topic', parent: 'flow-fundamentals', title: 'Describing flow', short: 'Flow rate, continuity, laminar and turbulent flow, the Reynolds number, Bernoulli and the energy equation, grade lines.',
    plan: [['flow-rate', 'Flow rate and velocity'], ['continuity-equation', 'Continuity'], ['laminar-turbulent', 'Laminar and turbulent flow'], ['reynolds-number-pipes', 'The Reynolds number in pipes'],
           ['energy-equation', 'Bernoulli and the energy equation'], ['hgl-egl', 'Hydraulic and energy grade lines']] },
  { id: 'momentum-forces', kind: 'topic', parent: 'flow-fundamentals', title: 'Momentum and forces', short: 'The momentum principle, jets on plates and vanes, forces on bends, draining a tank.',
    plan: [['momentum-principle', 'The momentum principle'], ['jet-forces', 'Forces of jets on plates and vanes'], ['pipe-bend-forces', 'Forces on bends and reducers'], ['torricelli', 'Torricelli: draining a tank']] },
  { id: 'flow-measurement', kind: 'topic', parent: 'flow-fundamentals', title: 'Measuring flow', short: 'Venturi meters, orifice plates, pitot tubes and modern flowmeters.',
    plan: [['venturi-meter', 'The venturi meter'], ['orifice-plate', 'Orifice plates and nozzles'], ['pitot-static-water', 'Pitot tubes in water'], ['flowmeters', 'Magnetic, ultrasonic, turbine and Coriolis meters']] },

  /* ================================================================ PIPES */
  {
    id: 'pipe-flow', kind: 'branch', parent: 'hydraulics', title: 'Pipe Flow', icon: 'pipe', hue: 30,
    short: 'Friction in pipes by Darcy–Weisbach, laminar Hagen–Poiseuille flow, the friction factor, Moody chart and Colebrook, Hazen–Williams; minor losses, equivalent length, pipes in series and parallel, networks, sizing and siphons.',
    body: 'Push a liquid through a pipe and friction eats its pressure, metre by metre. Darcy and Weisbach wrote the loss as a friction factor times the length in diameters times the velocity head, and Moody drew the factor on one chart: 64/Re in laminar flow, then a family of curves that depend on the roughness of the wall. Every valve, bend and tee adds its own loss. With these few rules an engineer sizes a water main, a fuel line or the hoses of an excavator — trading the cost of a bigger pipe against the energy lost in a small one.'
  },
  { id: 'pipe-friction', kind: 'topic', parent: 'pipe-flow', title: 'Friction in pipes', short: 'Darcy–Weisbach, Hagen–Poiseuille, the friction factor and Moody chart, Colebrook, Hazen–Williams, roughness.',
    plan: [['darcy-weisbach', 'The Darcy–Weisbach equation'], ['laminar-pipe-flow', 'Laminar flow: Hagen–Poiseuille'], ['friction-factor', 'The friction factor and the Moody chart'], ['colebrook', 'The Colebrook equation'],
           ['hazen-williams', 'Hazen–Williams and empirical formulas'], ['roughness-ageing', 'Roughness and ageing of pipes']] },
  { id: 'pipe-systems', kind: 'topic', parent: 'pipe-flow', title: 'Pipe systems', short: 'Minor losses, equivalent length, pipes in series and parallel, networks, sizing, non-circular ducts and siphons.',
    plan: [['minor-losses', 'Minor losses in fittings and valves'], ['equivalent-length', 'Equivalent length'], ['pipes-series-parallel', 'Pipes in series and parallel'], ['pipe-networks', 'Pipe networks and Hardy Cross'],
           ['pipe-sizing', 'Sizing a pipe'], ['non-circular-ducts', 'Non-circular ducts and hydraulic diameter'], ['siphons', 'Siphons']] },

  /* ================================================================ PUMPS & TURBINES */
  {
    id: 'pumps-turbines', kind: 'branch', parent: 'hydraulics', title: 'Pumps and Turbines', icon: 'pump', hue: 260,
    short: 'The centrifugal pump: head, power and efficiency, performance and system curves, the operating point, affinity laws, specific speed, pumps in series and parallel; cavitation and NPSH; hydropower and its turbines.',
    body: 'A centrifugal pump flings liquid outward from a spinning impeller and turns its speed into pressure. What it delivers depends on what it is connected to: the pump\'s curve of head against flow meets the system\'s curve of needed head, and the pump runs where they cross. Change the speed and the affinity laws say how everything scales — flow with speed, head with its square, power with its cube, which is why a variable-speed drive saves so much energy. Run the inlet too low and the liquid boils: cavitation, the noisy destroyer of impellers. Reverse the machine and it becomes a turbine.'
  },
  { id: 'centrifugal-pumps', kind: 'topic', parent: 'pumps-turbines', title: 'Centrifugal pumps', short: 'How it works, head, power and efficiency, pump and system curves, the operating point, affinity laws, specific speed, series and parallel.',
    plan: [['centrifugal-pump', 'The centrifugal pump'], ['pump-head-power', 'Pump head, power and efficiency'], ['pump-curves', 'Pump performance curves'], ['system-curve', 'The system curve'],
           ['operating-point', 'The operating point'], ['affinity-laws', 'The affinity laws'], ['specific-speed', 'Specific speed and pump types'], ['pumps-series-parallel', 'Pumps in series and parallel']] },
  { id: 'cavitation-npsh', kind: 'topic', parent: 'pumps-turbines', title: 'Cavitation and NPSH', short: 'Cavitation, NPSH available and required, suction lift and priming.',
    plan: [['cavitation', 'Cavitation'], ['npsh', 'NPSH available and required'], ['priming-suction', 'Suction lift and priming']] },
  { id: 'hydro-turbines', kind: 'topic', parent: 'pumps-turbines', title: 'Turbines and hydropower', short: 'Hydropower, the Pelton wheel, Francis and Kaplan turbines, pumped storage.',
    plan: [['hydropower', 'Hydropower'], ['pelton-wheel', 'The Pelton wheel'], ['francis-kaplan', 'Francis and Kaplan turbines'], ['pumped-storage', 'Pumped storage']] },

  /* ================================================================ TRANSIENTS */
  {
    id: 'transients', kind: 'branch', parent: 'hydraulics', title: 'Water Hammer and Transients', icon: 'zap', hue: 350,
    short: 'What happens when flow changes suddenly: pressure waves at the speed of sound in the pipe, the Joukowsky surge, slow and fast valve closure, surge tanks and air vessels, and column separation.',
    body: 'Shut a tap quickly and the pipes bang. The moving column of water cannot stop all at once; the valve stops the layer next to it, and a pressure wave runs back up the pipe at over a kilometre per second, stopping the water as it goes. The pressure rise — ρ a Δv, the Joukowsky surge — is about 14 bar for every metre per second of velocity stopped in a steel water main, enough to burst pipes and wreck pumps. Closing slowly, surge tanks and air vessels tame it; understanding the wave is how engineers design them.'
  },
  { id: 'water-hammer-topic', kind: 'topic', parent: 'transients', title: 'Water hammer', short: 'Water hammer, wave speed, the Joukowsky surge, valve closure, surge protection and column separation.',
    plan: [['water-hammer', 'Water hammer'], ['wave-speed', 'Pressure-wave speed in pipes'], ['joukowsky-surge', 'The Joukowsky surge'], ['valve-closure', 'Slow and fast valve closure'],
           ['surge-protection', 'Surge tanks, air vessels and protection'], ['column-separation', 'Column separation']] },

  /* ================================================================ CHANNELS */
  {
    id: 'open-channels', kind: 'branch', parent: 'hydraulics', title: 'Open Channels and Water', icon: 'dam', hue: 170,
    short: 'Flow with a free surface: Manning\'s equation, the Froude number, specific energy and critical depth, the hydraulic jump, gradually varied flow, weirs, flumes, gates and culverts — and dams, groundwater, water supply, floods and irrigation.',
    body: 'Rivers, canals, sewers and spillways flow with a free surface, pulled by gravity alone. Their behaviour hinges on one number, the Froude number: below one the flow is calm and waves can travel upstream, above one it is rapid and they cannot. Between the two lies critical flow, which a weir or flume forces so that a single depth measurement gives the discharge. When rapid flow meets calm water it jumps up in a churning hydraulic jump — a violent but useful way to destroy energy below a dam.'
  },
  { id: 'channel-flow', kind: 'topic', parent: 'open-channels', title: 'Open-channel flow', short: 'Open channels, Manning, the Froude number, specific energy, the hydraulic jump, gradually varied flow, weirs, flumes, gates and culverts.',
    plan: [['open-channel-basics', 'Open-channel flow'], ['manning-equation', 'The Manning equation'], ['froude-number', 'The Froude number'], ['specific-energy', 'Specific energy and critical depth'],
           ['hydraulic-jump', 'The hydraulic jump'], ['gradually-varied-flow', 'Gradually varied flow'], ['weirs-flumes', 'Weirs and flumes'], ['culverts-sluice', 'Sluice gates and culverts']] },
  { id: 'water-resources', kind: 'topic', parent: 'open-channels', title: 'Water resources', short: 'Dams and spillways, groundwater, water supply, stormwater and floods, irrigation.',
    plan: [['dams-spillways', 'Dams and spillways'], ['groundwater-darcy', 'Groundwater and Darcy\'s law'], ['water-supply', 'Water supply networks'], ['stormwater-floods', 'Stormwater and floods'], ['irrigation', 'Irrigation hydraulics']] },

  /* ================================================================ FLUID POWER */
  {
    id: 'fluid-power-basics', kind: 'branch', parent: 'hydraulics', title: 'Hydraulic Power', icon: 'circuit', hue: 280,
    short: 'Oil hydraulics as a way of moving power: the parts of a system, pressure × flow = power, force multiplication, where the losses and heat come from, when hydraulics beats electric and pneumatic drives — and the ISO 1219 language of circuit diagrams.',
    body: 'A hydraulic power system is a pump that turns an engine\'s or motor\'s rotation into flow, valves that steer and meter that flow, and actuators — cylinders and motors — that turn it back into force and motion. Pressure carries the force, flow carries the speed, and their product is the power. At 250 bar a cylinder the size of a coffee tin pushes 20 tonnes, which is why hydraulics rules wherever great forces must be controlled in a small space: excavators, presses, aircraft, ships. Its engineers draw it in a precise symbolic language, ISO 1219.'
  },
  { id: 'fluid-power-intro', kind: 'topic', parent: 'fluid-power-basics', title: 'What hydraulic power is', short: 'Fluid power, the anatomy of a system, pressure-flow-power, force multiplication, losses and heat, hydraulic versus pneumatic and electric.',
    plan: [['fluid-power', 'Fluid power'], ['hydraulic-system', 'Anatomy of a hydraulic system'], ['pressure-flow-power', 'Pressure, flow and power'], ['force-multiplication', 'Force multiplication'],
           ['energy-losses-heat', 'Losses and heat'], ['hydraulics-vs-alternatives', 'Hydraulic, pneumatic or electric?']] },
  { id: 'symbols-diagrams', kind: 'topic', parent: 'fluid-power-basics', title: 'Symbols and diagrams', short: 'ISO 1219 symbols, reading a circuit diagram, ports and designations.',
    plan: [['iso-1219', 'ISO 1219 symbols'], ['reading-circuit-diagrams', 'Reading a circuit diagram'], ['port-designations', 'Ports and designations']] },

  /* ================================================================ PUMPS & MOTORS */
  {
    id: 'pumps-motors', kind: 'branch', parent: 'hydraulics', title: 'Hydraulic Pumps and Motors', icon: 'pump', hue: 300,
    short: 'Positive-displacement pumps — gear, vane and piston — their displacement, flow and efficiencies, variable and pressure-compensated pumps; hydraulic motors, their torque and speed, low-speed high-torque motors and hydrostatic transmissions.',
    body: 'A hydraulic pump does not make pressure; it makes flow — a fixed volume per revolution, pushed out whatever the resistance. The pressure is whatever the load demands, up to the setting of the relief valve. Gear pumps are cheap and tough, vane pumps quiet, piston pumps efficient at the highest pressures and able to vary their displacement on the move. Run the same machine backwards with oil and it becomes a motor: displacement times pressure gives torque, flow divided by displacement gives speed.'
  },
  { id: 'hydraulic-pumps', kind: 'topic', parent: 'pumps-motors', title: 'Pumps', short: 'Positive displacement, gear, vane and piston pumps, displacement and flow, efficiencies, variable-displacement and pressure-compensated pumps.',
    plan: [['positive-displacement', 'Positive-displacement pumps'], ['gear-pumps', 'Gear pumps'], ['vane-pumps', 'Vane pumps'], ['piston-pumps', 'Axial and radial piston pumps'],
           ['displacement-flow', 'Displacement, speed and flow'], ['pump-efficiencies', 'Volumetric and mechanical efficiency'], ['variable-displacement', 'Variable-displacement pumps'], ['pressure-compensated-pump', 'Pressure-compensated pumps']] },
  { id: 'motors-topic', kind: 'topic', parent: 'pumps-motors', title: 'Motors', short: 'Hydraulic motors, their torque, speed and power, low-speed high-torque motors, hydrostatic transmissions.',
    plan: [['hydraulic-motors', 'Hydraulic motors'], ['motor-torque-speed', 'Motor torque, speed and power'], ['lsht-motors', 'Low-speed high-torque motors'], ['hydrostatic-transmission', 'Hydrostatic transmissions']] },

  /* ================================================================ ACTUATORS */
  {
    id: 'actuators', kind: 'branch', parent: 'hydraulics', title: 'Cylinders and Actuators', icon: 'cylinder', hue: 20,
    short: 'The hydraulic cylinder — force, speed, area ratio, cushioning, buckling, seals and mountings — rotary actuators and pressure intensifiers.',
    body: 'The cylinder is where hydraulic power becomes straight-line force. Pressure on the full piston pushes out; pressure on the ring around the rod pulls in, with less force and more speed. Everything else in the design follows from that and from what can go wrong: a long thin rod can buckle, a heavy load can slam into the end cap, seals can leak or wear, a side load can score the bore. Rotary actuators give a limited turn with enormous torque; intensifiers trade flow for pressures beyond the pump\'s.'
  },
  { id: 'cylinders', kind: 'topic', parent: 'actuators', title: 'Cylinders', short: 'The hydraulic cylinder, its types, area ratio, speed, cushioning, rod buckling, seals and mountings.',
    plan: [['hydraulic-cylinder', 'The hydraulic cylinder'], ['cylinder-types', 'Single-acting, double-acting and telescopic cylinders'], ['area-ratio', 'Area ratio and differential cylinders'], ['cylinder-speed', 'Cylinder speed and flow'],
           ['cushioning', 'Cushioning'], ['rod-buckling', 'Rod buckling'], ['seals', 'Seals and leakage'], ['mounting-side-load', 'Mountings and side loads']] },
  { id: 'rotary-actuators-topic', kind: 'topic', parent: 'actuators', title: 'Rotary actuators and intensifiers', short: 'Rotary actuators and pressure intensifiers.',
    plan: [['rotary-actuators', 'Rotary actuators'], ['intensifiers', 'Pressure intensifiers']] },

  /* ================================================================ VALVES */
  {
    id: 'valves', kind: 'branch', parent: 'hydraulics', title: 'Hydraulic Valves', icon: 'valve', hue: 240,
    short: 'Directional valves — ways, positions, centre conditions, operation — check and pilot-operated check valves; pressure valves — relief, reducing, sequence, counterbalance; flow control, the orifice equation, pressure compensation, proportional, servo and cartridge valves.',
    body: 'Valves are the brains of a hydraulic system. Directional valves decide where the oil goes; pressure valves decide how high the pressure may rise, and where; flow valves decide how fast. Nearly all of them are variations on a spool sliding in a bore or a poppet lifting from a seat, balanced between a spring and a pressure. Their ISO symbols are small drawings of that logic — one box per position, arrows for the paths — and learning to read them is learning how the machine thinks.'
  },
  { id: 'directional-valves-topic', kind: 'topic', parent: 'valves', title: 'Directional control valves', short: 'Directional valves, ways and positions, centre conditions, actuation, check and pilot-operated check valves.',
    plan: [['directional-valves', 'Directional control valves'], ['spool-positions', 'Positions and ways'], ['centre-conditions', 'Centre conditions'], ['valve-actuation', 'How valves are operated'],
           ['check-valves', 'Check valves'], ['pilot-check', 'Pilot-operated check valves']] },
  { id: 'pressure-valves', kind: 'topic', parent: 'valves', title: 'Pressure control valves', short: 'Relief, pilot-operated relief and unloading, reducing, sequence and counterbalance valves.',
    plan: [['relief-valve', 'Pressure-relief valves'], ['pilot-relief', 'Pilot-operated relief and unloading valves'], ['reducing-valve', 'Pressure-reducing valves'], ['sequence-valve', 'Sequence valves'], ['counterbalance-valve', 'Counterbalance valves']] },
  { id: 'flow-valves', kind: 'topic', parent: 'valves', title: 'Flow control and proportional valves', short: 'Flow control valves, the orifice equation, pressure compensation, proportional, servo and cartridge valves.',
    plan: [['flow-control', 'Flow control valves'], ['orifice-equation', 'The orifice equation'], ['pressure-compensation', 'Pressure-compensated flow control'], ['proportional-valves', 'Proportional valves'],
           ['servo-valves', 'Servo valves'], ['cartridge-valves', 'Cartridge and logic valves']] },

  /* ================================================================ CIRCUITS */
  {
    id: 'hydraulic-circuits', kind: 'branch', parent: 'hydraulics', title: 'Hydraulic Circuits', icon: 'route', hue: 150,
    short: 'Circuits that do jobs: the basic cylinder circuit, meter-in, meter-out and bleed-off speed control, regeneration, sequencing, synchronising, load holding; accumulator, hi-lo and unloading circuits, load sensing, open and closed centre, motor braking.',
    body: 'A handful of components can be connected in a surprising number of ways, and each arrangement is an answer to a practical problem: how to control the speed of a load that pulls as well as pushes, how to make two cylinders move together, how to clamp before drilling, how to hold a raised load without drift, how to save energy when the machine waits. These classic circuits are the vocabulary of hydraulic design; this branch builds them one at a time and runs them.'
  },
  { id: 'basic-circuits', kind: 'topic', parent: 'hydraulic-circuits', title: 'Basic circuits', short: 'A basic cylinder circuit, meter-in/out and bleed-off, regeneration, sequencing, synchronising, load holding.',
    plan: [['basic-circuit', 'A basic cylinder circuit'], ['meter-in-out', 'Meter-in, meter-out and bleed-off'], ['regenerative-circuit', 'Regenerative circuits'], ['sequencing-circuit', 'Sequencing circuits'],
           ['synchronizing', 'Synchronising cylinders'], ['load-holding', 'Load holding and counterbalance circuits']] },
  { id: 'system-circuits', kind: 'topic', parent: 'hydraulic-circuits', title: 'System circuits', short: 'Accumulator circuits, hi-lo and unloading, load sensing, open and closed centre, motor braking.',
    plan: [['accumulator-circuits', 'Accumulator circuits'], ['hi-lo-circuit', 'Hi-lo and unloading circuits'], ['load-sensing', 'Load-sensing systems'], ['open-closed-centre', 'Open-centre and closed-centre systems'], ['braking-circuits', 'Motor braking circuits']] },

  /* ================================================================ DESIGN & CARE */
  {
    id: 'system-design', kind: 'branch', parent: 'hydraulics', title: 'Design, Conditioning and Maintenance', icon: 'gear', hue: 45,
    short: 'Reservoirs, accumulators and their sizing, hoses, tubes and fittings, line sizing, heat balance and coolers; contamination, ISO 4406 cleanliness, filters and beta ratios, troubleshooting and safety.',
    body: 'Most hydraulic failures are not dramatic breakages but slow poisoning: dirt in the oil, water, air, and heat. A particle a tenth the width of a hair can jam a servo valve; oil that runs 10 °C too hot ages twice as fast. Good design sizes lines for sensible velocities, gives the reservoir time to settle air and dirt, balances the heat that losses create against what the cooler can remove, and filters to a cleanliness the most sensitive component can live with. Good maintenance then keeps it that way — safely.'
  },
  { id: 'components-sizing', kind: 'topic', parent: 'system-design', title: 'Components and sizing', short: 'Reservoirs, accumulators and their sizing, hoses and fittings, line sizing, heat balance and coolers.',
    plan: [['reservoirs', 'Reservoirs'], ['accumulators', 'Accumulators'], ['accumulator-sizing', 'Sizing an accumulator'], ['hoses-fittings', 'Hoses, tubes and fittings'], ['line-sizing', 'Sizing lines'], ['heat-coolers', 'Heat balance and coolers']] },
  { id: 'contamination-topic', kind: 'topic', parent: 'system-design', title: 'Contamination and maintenance', short: 'Contamination, ISO 4406 codes, filters and beta ratios, troubleshooting, hydraulic safety.',
    plan: [['contamination', 'Contamination'], ['iso-4406', 'Cleanliness codes: ISO 4406'], ['filtration', 'Filters and beta ratios'], ['troubleshooting', 'Troubleshooting'], ['hydraulic-safety', 'Hydraulic safety']] },

  /* ================================================================ CONTROL & APPLICATIONS */
  {
    id: 'control-applications', kind: 'branch', parent: 'hydraulics', title: 'Control and Applications', icon: 'target', hue: 110,
    short: 'Electro-hydraulic control, closed-loop position control, hydraulic stiffness and natural frequency, valve sizing for motion — and hydraulics at work: mobile machines, presses, aircraft, brakes and steering, lifts and cranes.',
    body: 'Modern hydraulics is electronic at the top and hydraulic at the bottom: a controller reads sensors and drives proportional or servo valves, and the oil delivers the force. Closing the loop brings precision — flight-control actuators hold position to a fraction of a millimetre against tonnes of air load — but also dynamics: the oil\'s compressibility makes the load a mass on a spring, and its natural frequency limits how fast the loop can be. The applications show the whole range, from a car\'s brake pedal to a 1000-tonne press.'
  },
  { id: 'electrohydraulics', kind: 'topic', parent: 'control-applications', title: 'Electro-hydraulics and control', short: 'Electro-hydraulic control, closed-loop position control, stiffness and natural frequency, valve sizing for motion.',
    plan: [['electrohydraulic-control', 'Electro-hydraulic control'], ['servo-loop', 'Closed-loop position control'], ['hydraulic-stiffness', 'Hydraulic stiffness and natural frequency'], ['valve-sizing-dynamics', 'Valve sizing for motion']] },
  { id: 'applications', kind: 'topic', parent: 'control-applications', title: 'Applications', short: 'Mobile machines, presses, aircraft hydraulics, brakes and steering, lifts and cranes.',
    plan: [['mobile-hydraulics', 'Mobile hydraulics: excavators and tractors'], ['industrial-presses', 'Presses and machine tools'], ['aircraft-hydraulics', 'Aircraft hydraulics'], ['vehicle-brakes', 'Hydraulic brakes and power steering'], ['lifts-cranes', 'Lifts, jacks and cranes']] }
);
