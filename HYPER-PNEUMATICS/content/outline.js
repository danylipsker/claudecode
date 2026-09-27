/* HYPER-PNEUMATICS · content/outline.js
 *
 * The shape of the discipline: the root, its branches and their topics.
 * Concepts live in the topic files and hang under these topics with
 * `parent: '<topic id>'`. `plan` lists the concepts each topic is meant to hold
 * (a planned concept never takes the id of a branch or topic — the validator checks).
 *
 * Hyper Pneumatics is compressed air at work: the physics of air and water vapour, making,
 * drying and distributing compressed air, cylinders and actuators, valves and their flow,
 * circuits and sequences drawn in ISO 1219 symbols, electro-pneumatics, vacuum, sizing and
 * dynamics, energy efficiency, safety and applications. The physics underneath is linked as
 * physics:<id>, oil hydraulics as hydraulics:<id>, airflow as aerodynamics:<id>, electrical
 * control as electronics:<id>.
 */
Hyper.add(
  {
    id: 'pneumatics', kind: 'root', title: 'Hyper Pneumatics',
    short: 'Compressed air at work: how it is made, dried and piped, how cylinders, valves and vacuum cups use it, how circuits and sequences control it — and what it costs, how to size it and how to keep it safe.',
    links: [['Pneumatics calculators', '#/tools/pneu', 'calc'], ['ISO 1219 symbols', '#/tools/iso', 'circuit']],
    body: 'Air is free, clean, safe near sparks and food, and it springs back. Squeeze it into a receiver and it becomes a handy store of energy that moves millions of cylinders in factories every second, closes the doors of trains, stops trucks, drives dentists\' drills and lifts parts with suction cups. Its weakness is the same springiness: air is soft, so pneumatic motion is fast and cheap but hard to stop precisely, and compressing it is surprisingly expensive — most of the electricity turns into heat.\n\nStart with the pneumatic cylinder, try the [pneumatics calculators](#/tools/pneu) for air consumption, valve flow, dew point, leaks, vacuum and receivers, or the [ISO 1219 symbol chart](#/tools/iso). Every formula on these pages is a calculator that solves for any of its variables.\n\n> [!warn] Compressed air stores energy and can injure. Never point it at a person or use it to blow dust off skin or clothes; release the pressure and lock out a machine before working on it; expect cylinders to move when a system is first pressurised.'
  },

  /* ================================================================ PHYSICS */
  {
    id: 'air-physics', kind: 'branch', parent: 'pneumatics', title: 'Air and Gas Physics', icon: 'gas', hue: 200,
    short: 'What air is and how it behaves when squeezed: absolute and gauge pressure, the gas laws, isothermal and adiabatic compression, the energy it stores, free air and standard conditions, humidity and dew point, and choked flow.',
    body: 'Pneumatics runs on the gas laws. Halve the volume of a trapped quantity of air and its pressure doubles — as long as the temperature is steady; squeeze it quickly and it heats up as well. Workshop gauges show pressure above the atmosphere, but the gas laws count from vacuum, so "6 bar" in a line is seven bar absolute, and a litre of it holds seven litres of free air. Air also carries water vapour, which condenses when the air is compressed and cooled: the root of most pneumatic trouble.'
  },
  { id: 'gas-laws-topic', kind: 'topic', parent: 'air-physics', title: 'Gas laws', short: 'What air is, absolute and gauge pressure, Boyle, Charles and Gay-Lussac, the ideal gas, partial pressures, isothermal and adiabatic processes, stored energy.',
    plan: [['air-composition', 'What air is'], ['absolute-gauge-pressure', 'Absolute and gauge pressure'], ['boyles-law', 'Boyle\'s law'], ['charles-gay-lussac', 'Charles\'s and Gay-Lussac\'s laws'],
           ['ideal-gas-law', 'The ideal gas law'], ['partial-pressures', 'Mixtures and partial pressures'], ['isothermal-adiabatic', 'Isothermal and adiabatic processes'], ['energy-in-compressed-air', 'Energy stored in compressed air']] },
  { id: 'air-quantities', kind: 'topic', parent: 'air-physics', title: 'Measuring air', short: 'Free air and standard conditions, humidity and dew point, pressure dew point, flow through restrictions and choked flow.',
    plan: [['standard-air', 'Free air, ANR and standard conditions'], ['humidity-dew-point', 'Humidity and dew point'], ['pressure-dew-point', 'Pressure dew point'], ['air-flow-basics', 'Flow of air through restrictions'], ['choked-flow', 'Sonic and choked flow']] },

  /* ================================================================ PRODUCTION */
  {
    id: 'compressed-air-production', kind: 'branch', parent: 'pneumatics', title: 'Producing Compressed Air', icon: 'tank', hue: 20,
    short: 'Compressors — piston, screw, scroll, vane and centrifugal — the work of compression, multistage compression with intercooling, free air delivery; control by load/unload and variable speed, receivers and their sizing, and heat recovery.',
    body: 'A compressor is an expensive way to store a little energy: of every 100 kW of electricity it draws, about 90 become heat and only the remainder is available in the air. Which compressor fits depends on how much air is needed and how steadily — piston machines for small and intermittent demand, oil-injected screws for most factories, centrifugals for the largest plants. How the compressor is controlled and how big its receiver is decide whether it runs efficiently or wastes energy idling. And the heat need not be wasted: most of it can warm water or buildings.'
  },
  { id: 'compressors', kind: 'topic', parent: 'compressed-air-production', title: 'Compressors', short: 'Types of compressor, piston, screw, scroll and vane, centrifugal, the work of compression, multistage compression, free air delivery.',
    plan: [['compressor-types', 'Types of compressor'], ['reciprocating-compressors', 'Piston compressors'], ['screw-compressors', 'Rotary screw compressors'], ['scroll-vane-compressors', 'Scroll, vane and other rotary compressors'],
           ['centrifugal-compressors', 'Centrifugal compressors'], ['compression-work', 'The work of compression'], ['multistage-intercooling', 'Multistage compression and intercooling'], ['fad-capacity', 'Free air delivery and capacity']] },
  { id: 'compressor-control', kind: 'topic', parent: 'compressed-air-production', title: 'Control and storage', short: 'Load/unload, modulation and variable speed; air receivers and their sizing; heat recovery.',
    plan: [['compressor-regulation', 'Load/unload, modulation and variable speed'], ['receivers', 'Air receivers'], ['receiver-sizing', 'Sizing a receiver'], ['heat-recovery', 'Heat recovery']] },

  /* ================================================================ TREATMENT */
  {
    id: 'air-treatment', kind: 'branch', parent: 'pneumatics', title: 'Air Treatment', icon: 'filter', hue: 190,
    short: 'Removing water, oil and dirt: where condensate comes from, aftercoolers and separators, refrigerated, desiccant and membrane dryers, drains; ISO 8573-1 purity classes, filters and coalescers, lubrication, service units and pressure regulators.',
    body: 'A 75 kW compressor on a humid summer day can pour more than 50 litres of water a day into the air system. Left in the air, it corrodes pipes, washes out lubricants, freezes in outdoor lines and spoils paint and food. Air treatment removes it step by step — the aftercooler condenses most of it, dryers lower the dew point further, filters catch oil aerosols and particles — to the quality class the application needs, no better, because every step costs energy.'
  },
  { id: 'moisture-drying', kind: 'topic', parent: 'air-treatment', title: 'Water and drying', short: 'Where the water comes from, aftercoolers, refrigerated, desiccant and membrane dryers, condensate drains.',
    plan: [['condensate', 'Where the water comes from'], ['aftercoolers', 'Aftercoolers and separators'], ['refrigerated-dryers', 'Refrigerated dryers'], ['desiccant-dryers', 'Desiccant and membrane dryers'], ['condensate-drains', 'Condensate drains and treatment']] },
  { id: 'air-quality', kind: 'topic', parent: 'air-treatment', title: 'Air quality', short: 'ISO 8573-1 classes, filters and coalescers, lubricated and oil-free air, service units, pressure regulators.',
    plan: [['iso-8573', 'Air purity classes: ISO 8573-1'], ['air-filters', 'Filters and coalescers'], ['lubricators', 'Lubricated and oil-free air'], ['frl-units', 'Service units: filter, regulator, lubricator'], ['pressure-regulators', 'Pressure regulators']] },

  /* ================================================================ DISTRIBUTION */
  {
    id: 'distribution', kind: 'branch', parent: 'pneumatics', title: 'Distributing Air', icon: 'pipe', hue: 40,
    short: 'Getting the air to where it is used: ring mains and piping layouts, drops and drains, pressure drop and pipe sizing, tubing, fittings and couplings, boosters — and leaks, the biggest waste in most plants.',
    body: 'Between the compressor room and the machines lies a network that can lose a tenth of the pressure and a third of the air. Undersized pipes and long hoses drop the pressure, so compressors are set higher to compensate — every extra bar costs about 7 % more energy. Leaks hiss away day and night: a hole of 3 mm at 6 bar wastes as much air as a small cylinder working flat out. A good network is a ring main with the right diameter, drops taken from the top, drains at the low points, and a leak-hunting habit.'
  },
  { id: 'air-networks', kind: 'topic', parent: 'distribution', title: 'Air networks', short: 'Layouts and ring mains, drops and drains, pressure drop, pipe sizing, tubing and couplings, boosters, leaks.',
    plan: [['piping-layout', 'Piping layouts and ring mains'], ['drops-drains', 'Drops, drains and slopes'], ['pressure-drop-air', 'Pressure drop in air lines'], ['pipe-sizing-air', 'Sizing air pipes'],
           ['tubing-fittings', 'Tubing, fittings and couplings'], ['pressure-boosters', 'Pressure boosters'], ['air-leaks', 'Leaks and what they cost']] },

  /* ================================================================ ACTUATORS */
  {
    id: 'pneumatic-actuators', kind: 'branch', parent: 'pneumatics', title: 'Cylinders and Actuators', icon: 'cylinder', hue: 88,
    short: 'The pneumatic cylinder — single- and double-acting, force and load ratio, air consumption, speed, cushioning, rodless and guided designs, ISO standard cylinders — and rotary actuators, grippers, air motors, bellows and fluidic muscles.',
    body: 'The pneumatic cylinder is the most common actuator in automation: cheap, fast, robust, happy to stall against a stop all day. Its force is pressure times area, but because air is springy, a cylinder is best used end to end — pushing a part against a stop, clamping, ejecting — rather than stopping in mid-air. Its air consumption, counted in litres of free air per stroke, is what the compressor must supply and pay for. Around it grew a family: rodless and guided cylinders, grippers, rotary actuators, air motors and muscles.'
  },
  { id: 'cylinders-topic', kind: 'topic', parent: 'pneumatic-actuators', title: 'Cylinders', short: 'The pneumatic cylinder, single- and double-acting, force and load ratio, air consumption, speed, cushioning, rodless and guided, ISO standards.',
    plan: [['pneumatic-cylinder', 'The pneumatic cylinder'], ['single-acting-cylinders', 'Single-acting cylinders'], ['double-acting-cylinders', 'Double-acting cylinders'], ['cylinder-force', 'Cylinder force and load ratio'],
           ['air-consumption', 'Air consumption'], ['cylinder-speed-pneu', 'Cylinder speed'], ['pneumatic-cushioning', 'Cushioning'], ['rodless-guided', 'Rodless, guided and compact cylinders'], ['iso-15552', 'Standard cylinders: ISO 15552 and ISO 6432']] },
  { id: 'other-actuators', kind: 'topic', parent: 'pneumatic-actuators', title: 'Other actuators', short: 'Rotary actuators, grippers, air motors, bellows, air springs and fluidic muscles.',
    plan: [['rotary-actuators-pneu', 'Rotary actuators'], ['grippers', 'Grippers'], ['air-motors', 'Air motors'], ['bellows-muscles', 'Bellows, air springs and fluidic muscles']] },

  /* ================================================================ VALVES */
  {
    id: 'pneumatic-valves', kind: 'branch', parent: 'pneumatics', title: 'Valves', icon: 'valve', hue: 240,
    short: 'Directional valves from 2/2 to 5/3 and how they are operated, poppet and spool, solenoid and pilot valves, valve terminals; flow capacity by Cv, Kv and sonic conductance; function valves — non-return, speed controllers, quick exhaust, OR and AND, time delay, pressure switches — and the ISO symbols and port numbers.',
    body: 'Pneumatic valves are named by their ports and positions — a 5/2 valve has five ports and two positions — and drawn as boxes, one per position. They are small and fast: a solenoid pilot valve switches in ten milliseconds. What matters most for performance is their flow capacity, quoted as Cv, Kv, nominal flow or — best — ISO 6358\'s sonic conductance and critical pressure ratio, which say exactly how much air passes at any pressures. Around them sit the function valves that turn air into logic.'
  },
  { id: 'directional-valves-pneu', kind: 'topic', parent: 'pneumatic-valves', title: 'Directional control valves', short: 'Ports and positions, operation, poppet and spool, solenoid and pilot valves, valve terminals.',
    plan: [['way-valves', 'Ports and positions: 2/2 to 5/3'], ['valve-operation', 'How valves are operated'], ['poppet-spool', 'Poppet and spool valves'], ['solenoid-valves', 'Solenoid and pilot-operated valves'], ['valve-terminals', 'Valve terminals and manifolds']] },
  { id: 'valve-flow', kind: 'topic', parent: 'pneumatic-valves', title: 'Valve flow capacity', short: 'Cv, Kv and nominal flow, sonic conductance and critical pressure ratio, sizing a valve for a cylinder.',
    plan: [['flow-coefficients', 'Cv, Kv and nominal flow'], ['sonic-conductance', 'Sonic conductance and critical pressure ratio'], ['valve-sizing', 'Sizing a valve for a cylinder']] },
  { id: 'function-valves', kind: 'topic', parent: 'pneumatic-valves', title: 'Function valves', short: 'Non-return valves, speed controllers, quick exhaust, shuttle (OR), two-pressure (AND), time delay, pressure switches.',
    plan: [['check-valves-pneu', 'Non-return valves'], ['flow-control-pneu', 'Speed controllers: meter-in and meter-out'], ['quick-exhaust', 'Quick-exhaust valves'], ['shuttle-valve', 'Shuttle valve: OR'],
           ['two-pressure-valve', 'Two-pressure valve: AND'], ['time-delay-valve', 'Time-delay valves'], ['pressure-switches', 'Pressure switches and sensors']] },
  { id: 'pneumatic-symbols', kind: 'topic', parent: 'pneumatic-valves', title: 'Symbols', short: 'ISO 1219 symbols for pneumatics and the port numbers.',
    plan: [['iso-1219-pneu', 'ISO 1219 symbols for pneumatics'], ['port-numbering', 'Port numbering: 1, 2, 3, 4, 5, 12, 14']] },

  /* ================================================================ CIRCUITS */
  {
    id: 'pneumatic-circuits', kind: 'branch', parent: 'pneumatics', title: 'Pneumatic Circuits', icon: 'circuit', hue: 150,
    short: 'Controlling cylinders: direct and indirect control, speed control, logic with air, memory valves, pressure-dependent control; sequences with displacement–step diagrams, signal overlap, the cascade method and step sequencers; two-hand control, emergency stops and soft start.',
    body: 'A pneumatic circuit is a small machine made of logic. A push-button valve can drive a cylinder directly, or pilot a bigger valve that does; limit valves at the ends of the stroke report where the cylinder is; AND and OR valves combine signals; a 5/2 impulse valve remembers. String cylinders into a sequence — clamp, drill, unclamp — and a classic problem appears: a signal still present when the next step needs its opposite. The cascade method and the step sequencer are the old, beautiful answers; a PLC is the modern one.'
  },
  { id: 'basic-control', kind: 'topic', parent: 'pneumatic-circuits', title: 'Basic control', short: 'Direct and indirect control, speed control circuits, logic functions, memory, pressure-dependent control.',
    plan: [['direct-control', 'Direct and indirect control'], ['speed-control-circuits', 'Speed control circuits'], ['logic-functions', 'Logic with air: AND, OR, NOT'], ['memory-circuits', 'Memory: the impulse valve'], ['pressure-sequence', 'Pressure-dependent control']] },
  { id: 'sequences', kind: 'topic', parent: 'pneumatic-circuits', title: 'Sequences', short: 'Displacement–step diagrams, sequence notation, signal overlap, the cascade method, step sequencers.',
    plan: [['displacement-step-diagram', 'Displacement–step diagrams'], ['sequence-notation', 'Sequence notation: A+ B+ A− B−'], ['signal-overlap', 'Signal overlap'], ['cascade-method', 'The cascade method'], ['shift-register', 'Step sequencers and shift registers']] },
  { id: 'safety-circuits', kind: 'topic', parent: 'pneumatic-circuits', title: 'Safety circuits', short: 'Two-hand control, emergency stop and safe exhaust, soft start.',
    plan: [['two-hand-control', 'Two-hand control'], ['emergency-stop-pneu', 'Emergency stop and safe exhaust'], ['soft-start', 'Soft start and dump valves']] },

  /* ================================================================ ELECTRO-PNEUMATICS */
  {
    id: 'electropneumatics', kind: 'branch', parent: 'pneumatics', title: 'Electro-pneumatics', icon: 'zap', hue: 280,
    short: 'Electrical control of air: solenoids and relays, ladder diagrams, reed switches and other sensors, PLCs, fieldbus and IO-Link, safety functions; proportional pressure regulators, servo-pneumatic positioning and digital pneumatics.',
    body: 'Most pneumatic machines today are electro-pneumatic: sensors report positions and pressures to a controller, and solenoid valves turn its decisions into air. Relay ladders gave way to PLCs, and PLCs now talk to whole valve terminals over a single fieldbus cable. With proportional valves and a position sensor, even springy air can be made to stop at any point — servo-pneumatics — and a stream of data from sensors lets a system report its own leaks and wear.'
  },
  { id: 'electrical-control', kind: 'topic', parent: 'electropneumatics', title: 'Electrical control', short: 'Solenoids and relays, ladder diagrams, sensors, PLCs, fieldbus and IO-Link, safety functions.',
    plan: [['solenoids-relays', 'Solenoids and relays'], ['ladder-diagrams', 'Relay ladder diagrams'], ['sensors-pneu', 'Sensors: reed switches, proximity and pressure'], ['plc-control', 'PLC control'],
           ['fieldbus-io-link', 'Fieldbus and IO-Link'], ['safety-functions', 'Safety functions and performance levels']] },
  { id: 'proportional-pneu', kind: 'topic', parent: 'electropneumatics', title: 'Proportional and servo pneumatics', short: 'Proportional pressure regulators, servo-pneumatic positioning, digital pneumatics.',
    plan: [['proportional-pressure', 'Proportional pressure regulators'], ['servo-pneumatics', 'Servo-pneumatic positioning'], ['digital-pneumatics', 'Digital pneumatics and condition monitoring']] },

  /* ================================================================ VACUUM */
  {
    id: 'vacuum', kind: 'branch', parent: 'pneumatics', title: 'Vacuum Technology', icon: 'cup', hue: 300,
    short: 'Pressure below the atmosphere: what vacuum is and how it is measured, ejectors and vacuum pumps; suction cups, holding force and safety factors, porous parts, evacuation time, vacuum circuits, safety and energy.',
    body: 'A suction cup does not pull; the atmosphere pushes. Remove some of the air behind the cup and the 1 bar of air around it presses the part against the lip — at most 10 newtons per square centimetre, however good the vacuum. That limit shapes everything in vacuum handling: cup sizes, safety factors against acceleration and friction, what happens with porous cardboard or leaky edges. Most vacuum in automation comes from ejectors, compressed air blown through a nozzle — simple and fast, but hungry for air.'
  },
  { id: 'vacuum-basics-topic', kind: 'topic', parent: 'vacuum', title: 'Vacuum', short: 'What vacuum is, levels and units, ejectors, vacuum pumps.',
    plan: [['vacuum-basics', 'What vacuum is'], ['vacuum-units', 'Vacuum levels and units'], ['ejectors', 'Vacuum ejectors'], ['vacuum-pumps', 'Vacuum pumps']] },
  { id: 'vacuum-handling', kind: 'topic', parent: 'vacuum', title: 'Vacuum handling', short: 'Suction cups, holding force, porous parts, evacuation time, vacuum circuits, safety and energy.',
    plan: [['suction-cups', 'Suction cups'], ['holding-force', 'Holding force and safety factors'], ['vacuum-leakage', 'Porous parts and leakage'], ['vacuum-circuits', 'Vacuum circuits and evacuation time'],
           ['vacuum-safety', 'Vacuum safety'], ['vacuum-energy', 'Energy in vacuum handling']] },

  /* ================================================================ SIZING */
  {
    id: 'sizing-dynamics', kind: 'branch', parent: 'pneumatics', title: 'Sizing and Dynamics', icon: 'graph', hue: 60,
    short: 'How a cylinder really moves — pressures building and falling, filling and emptying volumes, kinetic energy at the end stops, stick-slip — air as a spring, heating in the chambers; and sizing a drive: valves, tubes, conductances in series and an air budget.',
    body: 'A pneumatic cylinder does not start the moment its valve opens: the pressure must first build in one chamber and fall in the other until the force difference beats friction and load. Then the piston accelerates, the chambers change volume, the air heats and cools, and the whole thing behaves like a mass on a soft spring. Sizing a drive means getting enough air through the valve and tubes to reach the speed needed, without arriving at the end cap with more energy than the cushions can absorb.'
  },
  { id: 'cylinder-dynamics', kind: 'topic', parent: 'sizing-dynamics', title: 'Cylinder dynamics', short: 'How a cylinder moves, filling and emptying, air as a spring, temperature in the chambers, kinetic energy limits, stick-slip.',
    plan: [['cylinder-motion', 'How a cylinder moves'], ['filling-emptying', 'Filling and emptying a volume'], ['pneumatic-spring', 'Air as a spring: stiffness and natural frequency'], ['chamber-temperature', 'Heating and cooling in a cylinder'],
           ['kinetic-energy-limits', 'Kinetic energy and end-stop limits'], ['stick-slip', 'Low speed and stick-slip']] },
  { id: 'system-sizing', kind: 'topic', parent: 'sizing-dynamics', title: 'Sizing a system', short: 'A sizing procedure, conductances in series, tube length and dead volume, an air consumption budget.',
    plan: [['sizing-procedure', 'Sizing a pneumatic drive'], ['conductance-series', 'Conductances in series'], ['tubing-length-effect', 'Tube length and dead volume'], ['consumption-budget', 'An air consumption budget']] },

  /* ================================================================ ENERGY */
  {
    id: 'energy-efficiency', kind: 'branch', parent: 'pneumatics', title: 'Energy and Efficiency', icon: 'trend', hue: 130,
    short: 'What compressed air really costs, finding and fixing leaks, lowering the pressure, artificial demand, air-saving circuits, measuring and auditing — and when an electric drive is the better choice.',
    body: 'Compressed air is often called the fourth utility, and the most expensive: a cubic metre of free air at 7 bar costs about as much electricity as running a 100 W lamp for an hour and a half, and over a compressor\'s life the electricity costs several times its purchase price. In a typical plant a quarter to a third of the air leaks away, and pressures are set higher than needed. The savings from fixing that are real and quick — and sometimes the best air-saving measure is an electric actuator.'
  },
  { id: 'air-cost', kind: 'topic', parent: 'energy-efficiency', title: 'The cost of air', short: 'The cost of compressed air, leaks, pressure, artificial demand, air-saving circuits, audits, pneumatic or electric.',
    plan: [['cost-of-compressed-air', 'The cost of compressed air'], ['leak-management', 'Finding and fixing leaks'], ['pressure-optimisation', 'Lowering the pressure'], ['artificial-demand', 'Artificial demand and pressure bands'],
           ['air-saving-circuits', 'Air-saving circuits'], ['air-audits', 'Measuring and auditing'], ['pneumatic-vs-electric', 'Pneumatic or electric?']] },

  /* ================================================================ SAFETY */
  {
    id: 'safety-standards', kind: 'branch', parent: 'pneumatics', title: 'Safety and Maintenance', icon: 'shield', hue: 0,
    short: 'Working safely with compressed air, ISO 4414 and machine safety, pressure equipment and receivers, noise and silencers, maintenance and troubleshooting.',
    body: 'Air feels harmless, and that is its danger. A jet at 6 bar can drive dirt into eyes or air through skin; a cylinder can move without warning when pressure returns; a receiver holds enough energy to launch its end cap through a wall if it corrodes. Pneumatic safety rests on a few habits — exhaust and lock out before work, soft-start valves, guarded motion, inspected pressure vessels, silencers and hearing protection — backed by ISO 4414 and the machinery rules.'
  },
  { id: 'pneumatic-safety-topic', kind: 'topic', parent: 'safety-standards', title: 'Safety and maintenance', short: 'Pneumatic safety, ISO 4414, pressure equipment, noise and silencers, maintenance, troubleshooting.',
    plan: [['pneumatic-safety', 'Pneumatic safety'], ['iso-4414', 'ISO 4414 and machine safety'], ['pressure-equipment', 'Pressure equipment: receivers and inspection'], ['noise-silencers', 'Noise and silencers'],
           ['maintenance-pneu', 'Maintenance'], ['troubleshooting-pneu', 'Troubleshooting']] },

  /* ================================================================ APPLICATIONS */
  {
    id: 'pneumatic-applications', kind: 'branch', parent: 'pneumatics', title: 'Applications', icon: 'gear', hue: 110,
    short: 'Pneumatics at work: factory automation, pick-and-place and packaging, air tools, air brakes on trucks and trains, pneumatic conveying and tube systems, tyres and air suspension, medical and dental air, aircraft systems and soft robots.',
    body: 'Wherever something must move quickly between two positions many times a day, cleanly and cheaply, air is a candidate — and often the answer. Its uses go far beyond the factory: the brakes of every heavy truck and train, the suspension of buses, the drills of dentists, the tubes that carry samples across hospitals, the de-icing boots on aircraft wings, the soft grippers that pick strawberries without bruising them.'
  },
  { id: 'applications-pneu', kind: 'topic', parent: 'pneumatic-applications', title: 'Pneumatics at work', short: 'Automation, pick and place, air tools, brakes, conveying, tube systems, tyres and suspension, medical air, aircraft, soft robotics.',
    plan: [['factory-automation', 'Factory automation'], ['pick-and-place', 'Pick and place and packaging'], ['air-tools', 'Air tools'], ['air-brakes', 'Air brakes on trucks and trains'], ['pneumatic-conveying', 'Pneumatic conveying'],
           ['pneumatic-tube-systems', 'Pneumatic tube systems'], ['tyres-air-springs', 'Tyres and air suspension'], ['medical-dental-air', 'Medical and dental air'], ['aircraft-pneumatics', 'Pneumatics in aircraft'], ['soft-robotics', 'Soft robotics']] }
);
