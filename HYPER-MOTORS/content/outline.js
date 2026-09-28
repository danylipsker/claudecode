/* HYPER-MOTORS · content/outline.js
 *
 * The shape of the app: the root, its branches and their topics. Concepts live in the topic files and hang
 * under these topics with `parent: '<topic id>'`. `plan` lists the concepts each topic is meant to hold.
 *
 * Hyper Motors covers every family of motor — brushed and brushless DC, pancake and axial-flux, AC induction
 * (three-phase and single-phase with their capacitors), synchronous and PM, steppers, AC and DC servos, linear
 * and special motors, hydraulic and air motors — with their wiring, ratings, drivers and controls, feedback and
 * limit switches, the mechanics they drive, what really happens in service (heat, friction, noise, vibration,
 * wear), and how to choose. Electronics is linked as electronics:<id>, hydraulics as hydraulics:<id>,
 * pneumatics as pneumatics:<id>, physics as physics:<id>, mathematics as math:<id>.
 */
Hyper.add(
  {
    id: 'motors', kind: 'root', title: 'Hyper Motors',
    short: 'Every kind of motor explained and compared: how it works, how it is wired and driven, what its ratings mean, what goes wrong in real machines — and which one to choose for your application.',
    links: [['Motor lab', '#/tools/motorlab', 'motor'], ['Sizing & selection', '#/tools/sizing', 'calc'], ['Wiring diagrams', '#/tools/wiring', 'circuit'], ['Drives & signals', '#/tools/drives', 'sine']],
    body: `A motor turns energy into motion: electric current into torque through magnetic fields, or the pressure of oil or air into rotation. Hundreds of designs exist because every application asks for a different balance of torque, speed, precision, cost, size, efficiency and ruggedness — a fan wants a cheap, efficient, constant-speed motor; a 3-D printer wants exact steps; a robot arm wants torque at standstill and instant response; an excavator wants enormous torque from a compact hydraulic motor; a paint shop wants an air motor that cannot spark.

Hyper Motors explains each family from the inside — the physics, the [[?function|torque–speed curve]], the wiring, the ratings on the nameplate — then the electronics that drive it (drivers, inverters, soft starters, DIP switches, PWM, encoders), the mechanics it drives (gears, belts, screws, inertia), and what happens in real service: heat, friction, noise, vibration and wear. Every page ends with what the motor is good for, and the **Sizing & selection** tool helps you choose.

> [!warn] Mains-powered motors, drives and capacitors can kill. Wiring and servicing must be done by qualified people, with the supply isolated, locked off and proven dead; capacitors and the DC bus of a drive stay charged after switch-off. Rotating machinery and stored hydraulic or pneumatic energy injure too. The diagrams here are for understanding; follow the manufacturer's instructions and local regulations.`
  },

  /* ================================================================ BASICS */
  {
    id: 'motor-basics', kind: 'branch', parent: 'motors', title: 'How Motors Work', icon: 'zap', hue: 248,
    short: 'The physics every electric motor shares — force on a current in a magnetic field, torque, back-EMF — and the ratings that describe a motor: power, efficiency, power factor, duty, insulation, protection and efficiency classes.',
    body: `Every electric motor rests on one fact: a conductor carrying current in a magnetic field feels a force. Arrange many conductors around a shaft and the forces make a torque. The same conductors moving through the field generate a voltage — the back-EMF — which is why a spinning motor draws less current than a stalled one, and why every motor is also a generator. This branch builds that picture, then decodes the numbers on a nameplate: output power in kW or hp, efficiency and losses, power factor, duty type, insulation class, IP protection and cooling, and the international efficiency classes.`
  },
  { id: 'electromagnetic-principles', kind: 'topic', parent: 'motor-basics', title: 'Electromagnetic principles', short: 'Force on a conductor, torque and power, back-EMF, magnetic circuits, and why every motor is a generator.',
    plan: [['force-on-conductor', 'Force on a current in a magnetic field'], ['torque-and-power', 'Torque, speed and power'], ['back-emf', 'Back-EMF: the motor as a generator'], ['magnetic-circuits', 'Magnetic circuits, iron and saturation'], ['motor-generator-duality', 'Motors and generators: one machine, two directions']] },
  { id: 'motor-ratings', kind: 'topic', parent: 'motor-basics', title: 'Ratings and the nameplate', short: 'kW and hp, efficiency and losses, power factor (cos φ), duty cycles, the nameplate, insulation classes, IP and cooling, efficiency classes, standards and frames.',
    plan: [['power-units', 'Power: kW, hp and what they measure'], ['efficiency-losses', 'Efficiency and where the losses go'], ['power-factor', 'Power factor (cos φ)'], ['duty-cycles', 'Duty cycles S1 to S10'], ['nameplate-reading', 'Reading a motor nameplate'],
           ['insulation-classes', 'Insulation classes and temperature rise'], ['ip-cooling', 'IP protection and cooling methods'], ['efficiency-classes', 'Efficiency classes IE1 to IE5'], ['motor-standards', 'Standards, frame sizes and mounting']] },

  /* ================================================================ BRUSHED DC */
  {
    id: 'dc-motors', kind: 'branch', parent: 'motors', title: 'Brushed DC Motors', icon: 'battery', hue: 24,
    short: 'Permanent-magnet, series, shunt and compound DC motors and the universal motor; brushes and commutators; the straight torque–speed line; PWM speed control, H-bridges, drivers, braking and gearmotors.',
    body: `The brushed DC motor is the simplest to understand and to control: its speed follows the voltage, its torque follows the current, and between them lies a straight line. A mechanical switch — the commutator and its brushes — keeps the current in each coil flowing the right way as the rotor turns. Permanent-magnet DC motors run toys, car windows, pumps and small machines; series-wound motors give huge starting torque for starters and cranes; the universal motor, a series motor that also runs on AC, drives drills, vacuum cleaners and blenders. The control is equally simple: a PWM chopper for speed, an H-bridge for direction and braking.`
  },
  { id: 'dc-types', kind: 'topic', parent: 'dc-motors', title: 'Kinds of DC motor', short: 'PMDC, series, shunt and compound motors, the universal motor, brushes and the commutator.',
    plan: [['pmdc-motor', 'The permanent-magnet DC motor'], ['series-dc-motor', 'The series-wound DC motor'], ['shunt-dc-motor', 'The shunt-wound DC motor'], ['compound-dc-motor', 'The compound-wound DC motor'], ['universal-motor', 'The universal motor'], ['brushes-commutator', 'Brushes and the commutator']] },
  { id: 'dc-control', kind: 'topic', parent: 'dc-motors', title: 'Controlling DC motors', short: 'The torque–speed line, PWM, the H-bridge, DC motor drivers, braking and gearmotors.',
    plan: [['dc-torque-speed', 'The DC motor torque–speed line'], ['pwm-speed-control', 'PWM speed control'], ['h-bridge', 'The H-bridge: direction and braking'], ['dc-motor-drivers', 'DC motor drivers'], ['dc-braking', 'Braking a DC motor'], ['dc-gearmotors', 'DC gearmotors']] },

  /* ================================================================ BRUSHLESS */
  {
    id: 'brushless', kind: 'branch', parent: 'motors', title: 'Brushless and Pancake Motors', icon: 'target', hue: 190,
    short: 'The brushless DC motor: electronic commutation with Hall sensors or back-EMF, field-oriented control, inrunners and outrunners, ESCs and Kv ratings, and flat pancake and axial-flux motors.',
    body: `Take a DC motor, put the magnets on the rotor and the coils on the stator, and replace the brushes by transistors: that is the brushless DC motor. With no brushes to wear or spark it runs faster, longer, quieter and cooler, but it needs electronics to switch its three phases in step with the rotor — using Hall sensors, the back-EMF of the idle phase, or full field-oriented control. Brushless motors spin hard drives, fans, drones, e-bikes and electric cars. Pancake and axial-flux designs stack the magnets and coils face to face in thin discs, giving high torque in a flat package.`
  },
  { id: 'bldc-topic', kind: 'topic', parent: 'brushless', title: 'Brushless motors', short: 'BLDC construction, Hall commutation, sensorless control, field-oriented control, inrunners and outrunners, ESCs, pancake and axial-flux motors, choosing by Kv and poles.',
    plan: [['bldc-motor', 'The brushless DC motor'], ['hall-commutation', 'Six-step commutation with Hall sensors'], ['sensorless-control', 'Sensorless control from the back-EMF'], ['foc-control', 'Field-oriented control'],
           ['inrunner-outrunner', 'Inrunners and outrunners'], ['esc-drivers', 'Electronic speed controllers (ESCs)'], ['pancake-motors', 'Pancake and axial-flux motors'], ['bldc-selection', 'Choosing a brushless motor: Kv, poles and size']] },

  /* ================================================================ INDUCTION */
  {
    id: 'induction-motors', kind: 'branch', parent: 'motors', title: 'AC Induction Motors', icon: 'sine', hue: 150,
    short: 'The workhorse of industry: the rotating field, the squirrel cage, slip, the torque–speed curve, the equivalent circuit, star and delta, wound rotors — and single-phase motors with their start and run capacitors.',
    body: `Electric motors use roughly 45 % of the world's electricity (an International Energy Agency estimate), and most of those motors are induction motors. Three-phase currents in the stator make a magnetic field that rotates; it induces currents in a simple cage of aluminium or copper bars in the rotor, and those currents are dragged round after the field — a little slower, the slip. There is nothing to wear except the bearings. Single-phase supplies cannot make a rotating field by themselves, so single-phase motors borrow a second phase from a capacitor or a shading ring — which is where start and run capacitors, centrifugal switches and their failures come from.`
  },
  { id: 'three-phase-induction', kind: 'topic', parent: 'induction-motors', title: 'Three-phase induction motors', short: 'The rotating field, the squirrel cage, slip, the torque–speed curve and NEMA designs, the equivalent circuit, wound rotors, star and delta, dual voltage, reversing.',
    plan: [['rotating-field', 'The rotating magnetic field'], ['squirrel-cage', 'The squirrel-cage rotor'], ['slip-and-speed', 'Slip and speed'], ['torque-slip-curve', 'The torque–speed curve'], ['equivalent-circuit', 'The equivalent circuit'],
           ['wound-rotor-motor', 'The wound-rotor (slip-ring) motor'], ['star-delta-connection', 'Star and delta connections'], ['dual-voltage-motors', 'Dual-voltage motors and terminal boxes'], ['reversing-three-phase', 'Reversing a three-phase motor']] },
  { id: 'single-phase-motors', kind: 'topic', parent: 'induction-motors', title: 'Single-phase motors', short: 'Why a single phase cannot start a motor, split-phase, capacitor-start, capacitor-start capacitor-run, PSC and shaded-pole motors, choosing capacitors, the Steinmetz connection.',
    plan: [['single-phase-problem', 'Why a single-phase motor cannot start itself'], ['split-phase-motor', 'The split-phase motor'], ['capacitor-start-motor', 'The capacitor-start motor'], ['capacitor-start-run', 'Capacitor-start, capacitor-run motors'],
           ['psc-motor', 'The permanent split-capacitor (PSC) motor'], ['shaded-pole-motor', 'The shaded-pole motor'], ['capacitor-sizing', 'Start and run capacitors: values, ratings, failures'], ['steinmetz-connection', 'Running a three-phase motor on one phase']] },

  /* ================================================================ STARTING AND VFD */
  {
    id: 'starting-drives', kind: 'branch', parent: 'motors', title: 'Starting and Speed Control of AC Motors', icon: 'gauge', hue: 205,
    short: 'Direct-on-line, star-delta, autotransformer and soft starting; motor protection; and the variable-frequency drive — how it works, V/f and vector control, parameters, braking, wiring, EMC and energy saving.',
    body: `Switched straight onto the mains, an induction motor draws six to eight times its running current and slams its load with full torque. Starters tame that — star-delta, autotransformers, electronic soft starters — while overload relays and motor-protection breakers keep the windings from burning. The variable-frequency drive (VFD or inverter) goes further: it rectifies the mains, stores it on a DC bus and rebuilds a three-phase supply of any frequency with fast transistors, so the motor can start gently, run at any speed and save energy on fans and pumps. This branch shows how, including the parameters you set and the wiring that keeps the drive and its neighbours happy.`
  },
  { id: 'starting-methods', kind: 'topic', parent: 'starting-drives', title: 'Starting and protection', short: 'Direct-on-line starting, star-delta, autotransformer, soft starters, overloads, breakers and thermistors.',
    plan: [['dol-starting', 'Direct-on-line starting'], ['star-delta-starting', 'Star-delta starting'], ['autotransformer-starting', 'Autotransformer and reactor starting'], ['soft-starters', 'Soft starters'], ['motor-protection', 'Motor protection: overloads, breakers, thermistors']] },
  { id: 'vfd-topic', kind: 'topic', parent: 'starting-drives', title: 'Variable-frequency drives', short: 'The VFD, V/f control, vector control, parameters, braking choppers and regeneration, wiring and EMC, energy saving on fans and pumps.',
    plan: [['vfd-principle', 'How a variable-frequency drive works'], ['v-over-f-control', 'V/f control'], ['vector-control-vfd', 'Sensorless vector control and DTC'], ['vfd-parameters', 'Setting up a VFD: the essential parameters'],
           ['vfd-braking', 'Braking resistors and regeneration'], ['vfd-wiring-emc', 'VFD wiring, EMC and bearing currents'], ['vfd-energy-saving', 'Energy saving with fans and pumps']] },

  /* ================================================================ SYNCHRONOUS */
  {
    id: 'synchronous-motors', kind: 'branch', parent: 'motors', title: 'Synchronous and Reluctance Motors', icon: 'turbine', hue: 280,
    short: 'Motors that turn exactly with the supply: wound-field synchronous motors, permanent-magnet synchronous motors (PMSM), synchronous and switched reluctance motors, hysteresis motors and line-start PM motors.',
    body: `A synchronous motor turns exactly at the speed of the rotating field — no slip — because its rotor has its own magnetic poles, from a DC field winding, permanent magnets, or a shape that prefers to line up with the field (reluctance). Big wound-field machines run compressors and correct a factory's power factor; permanent-magnet synchronous motors are the most efficient motors made and drive electric vehicles, servos and premium pumps; switched-reluctance motors are rugged and magnet-free; hysteresis motors ran tape decks and turntables with perfect smoothness.`
  },
  { id: 'sync-topic', kind: 'topic', parent: 'synchronous-motors', title: 'Synchronous motors', short: 'Wound-field synchronous motors, PMSM, synchronous and switched reluctance, hysteresis motors, line-start PM motors.',
    plan: [['synchronous-motor', 'The wound-field synchronous motor'], ['pmsm-motor', 'The permanent-magnet synchronous motor'], ['reluctance-motors', 'Synchronous and switched reluctance motors'], ['hysteresis-motor', 'The hysteresis motor'], ['line-start-pm', 'Line-start permanent-magnet motors']] },

  /* ================================================================ STEPPERS */
  {
    id: 'stepper-motors', kind: 'branch', parent: 'motors', title: 'Stepper Motors', icon: 'stepper', hue: 300,
    short: 'Motors that move in exact steps: PM, variable-reluctance and hybrid steppers, bipolar and unipolar wiring, full, half and micro-stepping, the torque–speed curve and resonance, drivers, DIP switches, step/dir signals and closed-loop steppers.',
    body: `A stepper motor moves a fixed angle — typically 1.8°, 200 steps a revolution — for every pulse it is given, and holds its position firmly when the pulses stop. No feedback is needed, which makes positioning cheap and simple: printers, 3-D printers, CNC routers, camera sliders, valves and pumps use them by the million. The price is torque that falls as speed rises, resonances that can stall the motor, and the risk of losing steps without knowing. This branch covers the motor, its wiring (4, 6 and 8 leads), the drivers and their DIP switches, the step and direction signals, and closed-loop steppers that add an encoder.`
  },
  { id: 'stepper-basics', kind: 'topic', parent: 'stepper-motors', title: 'The stepper motor', short: 'How a stepper steps, the three types, bipolar and unipolar wiring, step modes and microstepping, the torque–speed curve, resonance.',
    plan: [['stepper-principle', 'How a stepper motor steps'], ['stepper-types', 'Permanent-magnet, variable-reluctance and hybrid steppers'], ['bipolar-unipolar', 'Bipolar and unipolar wiring: 4, 6 and 8 leads'], ['step-modes', 'Full, half and microstepping'],
           ['stepper-torque-speed', 'Holding, pull-in and pull-out torque'], ['stepper-resonance', 'Resonance and how to beat it']] },
  { id: 'stepper-drivers-topic', kind: 'topic', parent: 'stepper-motors', title: 'Stepper drivers and control', short: 'Chopper drivers and current setting, DIP-switch settings, step/dir/enable signals, closed-loop steppers, sizing a stepper.',
    plan: [['stepper-drivers', 'Stepper drivers: choppers and current control'], ['dip-switch-settings', 'DIP switches: microsteps, current and idle reduction'], ['step-dir-signals', 'Step, direction and enable signals'], ['closed-loop-steppers', 'Closed-loop steppers'], ['stepper-sizing', 'Sizing a stepper motor']] },

  /* ================================================================ SERVOS */
  {
    id: 'servo-motors', kind: 'branch', parent: 'motors', title: 'Servo Motors and Drives', icon: 'motor', hue: 330,
    short: 'Closed-loop motion: AC and DC servo motors, RC servos, servo drives and their control modes, command interfaces and fieldbuses, PID control, tuning, inertia matching, following error and holding brakes.',
    body: `A servo is a motor that is told where to be and checks, thousands of times a second, that it is there. An encoder measures the position; the drive compares it with the command and corrects the current. The result is precise, fast, stiff motion with full torque at standstill — robots, CNC machines, packaging lines, pick-and-place. AC servo motors are permanent-magnet synchronous motors built for low inertia and high peak torque; their drives offer position, velocity and torque modes, pulse/direction or fieldbus commands, and tuning that trades speed of response against stability. A hobby RC servo does the same in miniature, commanded by a 1–2 ms pulse.`
  },
  { id: 'servo-basics', kind: 'topic', parent: 'servo-motors', title: 'Servo systems', short: 'The closed loop, AC and DC servo motors, RC servos, servo drives and their modes, command interfaces.',
    plan: [['servo-principle', 'What makes a servo'], ['ac-servo-motors', 'AC servo motors'], ['dc-servo-motors', 'DC servo motors'], ['rc-servos', 'RC servos and their pulses'], ['servo-drives', 'Servo drives and control modes'], ['command-interfaces', 'Command interfaces: pulse/dir, analogue and fieldbus']] },
  { id: 'servo-tuning-topic', kind: 'topic', parent: 'servo-motors', title: 'Control and tuning', short: 'PID control, tuning a servo, inertia matching, following error and faults, holding brakes.',
    plan: [['pid-control', 'PID control'], ['servo-tuning', 'Tuning a servo'], ['inertia-matching', 'Inertia matching'], ['following-error', 'Following error, overloads and faults'], ['servo-brakes', 'Holding brakes']] },

  /* ================================================================ FEEDBACK AND SAFETY */
  {
    id: 'feedback-sensors', kind: 'branch', parent: 'motors', title: 'Encoders, Sensors and Limit Switches', icon: 'meter', hue: 45,
    short: 'How a controller knows where the motor is: incremental and absolute encoders, resolvers, Hall sensors and tachogenerators — and limit switches, proximity and optical sensors, homing, emergency stops, safe torque off and brakes.',
    body: `Motion control needs to know position and speed, and to know where the edges of the world are. Encoders count lines on a disc (incremental) or read a unique code for every angle (absolute); resolvers do the same with transformer windings and survive heat and shock; Hall sensors give a coarse position for commutation. At the ends of travel, limit switches — mechanical, inductive, capacitive, optical — stop the machine and give it a reference point for homing. Above them sit the safety functions: emergency stops, safe torque off, safety relays and spring-applied brakes, designed to fail safe.`
  },
  { id: 'feedback-devices', kind: 'topic', parent: 'feedback-sensors', title: 'Feedback devices', short: 'Incremental encoders, absolute encoders, resolvers, Hall sensors, tachogenerators.',
    plan: [['incremental-encoders', 'Incremental encoders'], ['absolute-encoders', 'Absolute encoders'], ['resolvers', 'Resolvers'], ['hall-sensors', 'Hall-effect sensors'], ['tachogenerators', 'Tachogenerators']] },
  { id: 'limits-safety', kind: 'topic', parent: 'feedback-sensors', title: 'Limit switches and safety', short: 'Limit switches, inductive and capacitive proximity sensors, optical sensors, homing, emergency stop and safe torque off, spring-applied brakes.',
    plan: [['limit-switches', 'Mechanical limit switches'], ['proximity-sensors', 'Inductive and capacitive proximity sensors'], ['optical-sensors', 'Optical sensors and light barriers'], ['homing-routines', 'Homing: finding the reference point'], ['emergency-stop', 'Emergency stop and safe torque off'], ['motor-brakes', 'Spring-applied motor brakes']] },

  /* ================================================================ MECHANICS */
  {
    id: 'mechanics-transmission', kind: 'branch', parent: 'motors', title: 'Mechanics: Loads, Gears and Motion', icon: 'gear', hue: 95,
    short: 'What the motor drives: gearboxes, belts, lead and ball screws, rack and pinion, couplings and bearings; kinds of load; reflected inertia; motion profiles; RMS torque; and a guide to sizing a motor.',
    body: `A motor is chosen for its load, not in isolation. Between them sit gearboxes, belts, screws and couplings that trade speed for torque, change rotation into straight-line motion, and add their own friction, backlash and inertia. The load itself may need constant torque (a conveyor), torque rising with the square of speed (a fan) or constant power (a winder). Moving it from here to there in a given time sets the acceleration — and the torque needed to accelerate the reflected inertia is often larger than the load itself. This branch builds the sizing method used for every motor type: peak torque, RMS torque, speed and inertia ratio.`
  },
  { id: 'transmission', kind: 'topic', parent: 'mechanics-transmission', title: 'Transmissions', short: 'Gearboxes, belts and pulleys, lead and ball screws, rack and pinion and linear axes, couplings, bearings.',
    plan: [['gearboxes', 'Gearboxes'], ['belts-pulleys', 'Belts and pulleys'], ['lead-ball-screws', 'Lead screws and ball screws'], ['rack-pinion-linear', 'Rack and pinion and linear axes'], ['couplings-alignment', 'Couplings and alignment'], ['bearings-motors', 'Bearings and bearing life']] },
  { id: 'motion-sizing', kind: 'topic', parent: 'mechanics-transmission', title: 'Motion and sizing', short: 'Kinds of load torque, reflected inertia, motion profiles, RMS torque, a motor selection method.',
    plan: [['load-torque-types', 'Constant-torque, variable-torque and constant-power loads'], ['inertia-reflected', 'Reflected inertia'], ['motion-profiles', 'Motion profiles: trapezoidal and S-curve'], ['rms-torque-sizing', 'RMS torque and duty'], ['motor-selection-method', 'Sizing a motor step by step']] },

  /* ================================================================ REAL WORLD AND SPECIAL */
  {
    id: 'real-world', kind: 'branch', parent: 'motors', title: 'Motors in the Real World', icon: 'shield', hue: 12,
    short: 'What happens in service: heating and derating, friction, noise, vibration, bearing and winding failures, and maintenance and diagnostics — and special motors: linear, voice-coil, piezo, torque, coreless and vibration motors, solenoids.',
    body: `Datasheets describe a motor on a test bench at 40 °C and sea level. In a machine it meets heat from its neighbours, dust and water, misaligned couplings, unbalanced fans, long cables from a drive, voltage dips and a duty cycle nobody wrote down. Heat is the great enemy: every 10 °C over the insulation's rating roughly halves its life. Friction wastes power and wears bearings; noise and vibration tell you what is going wrong before it breaks. This branch shows these phenomena and how to diagnose them, then looks at the special motors built for straight-line motion, tiny steps, direct drive or buzz.`
  },
  { id: 'phenomena', kind: 'topic', parent: 'real-world', title: 'Heat, friction, noise and failure', short: 'Heating and derating, friction, noise, vibration, bearing failures, motor failures, maintenance and diagnostics.',
    plan: [['motor-heating', 'Heating, thermal time constants and derating'], ['friction-in-motors', 'Friction and its costs'], ['motor-noise', 'Motor noise'], ['motor-vibration', 'Vibration and its causes'], ['bearing-failures', 'Bearing failures'], ['motor-failures', 'Why motors fail'], ['maintenance-diagnostics', 'Maintenance and diagnostics']] },
  { id: 'special-topic', kind: 'topic', parent: 'real-world', title: 'Special motors', short: 'Linear motors, voice-coil actuators, piezo and ultrasonic motors, torque motors, coreless motors, vibration motors, solenoids.',
    plan: [['linear-motors', 'Linear motors'], ['voice-coil-actuators', 'Voice-coil actuators'], ['piezo-motors', 'Piezo and ultrasonic motors'], ['torque-motors', 'Torque motors and direct drive'], ['coreless-motors', 'Coreless (ironless) motors'], ['vibration-motors', 'Vibration motors'], ['solenoid-actuators', 'Solenoids']] },

  /* ================================================================ HYDRAULIC */
  {
    id: 'hydraulic-motors', kind: 'branch', parent: 'motors', title: 'Hydraulic Motors and Systems', icon: 'pump', hue: 268,
    short: 'Motors driven by oil under pressure — gear, vane, axial and radial piston and orbital motors — and the whole system around them: power unit, valves, counterbalance and brakes, hydrostatic transmissions, fluids, filtration, heat and noise.',
    body: `A hydraulic motor turns pressure and flow into torque and speed: torque from the displacement times the pressure, speed from the flow divided by the displacement. A fist-sized motor at 250 bar gives the torque of an electric motor many times its size, which is why excavators, winches, cranes, drilling rigs and farm machinery use them. But a hydraulic motor is only one part of a system: an electric motor or engine drives a pump, a reservoir holds and cools the oil, a relief valve limits the pressure, directional and flow-control valves command the motor, counterbalance valves and brakes hold loads, and filters keep the oil clean. This branch explains the whole chain.`
  },
  { id: 'hydraulic-motor-types', kind: 'topic', parent: 'hydraulic-motors', title: 'Hydraulic motors', short: 'How a hydraulic motor works, gear, vane, axial-piston, radial-piston and orbital motors, sizing.',
    plan: [['hydraulic-motor-principle', 'How a hydraulic motor works'], ['gear-motors-hyd', 'Gear motors'], ['vane-motors-hyd', 'Vane motors'], ['axial-piston-motors', 'Axial-piston motors'], ['radial-piston-motors', 'Radial-piston motors'], ['orbital-motors', 'Orbital (gerotor) motors'], ['hydraulic-motor-sizing', 'Sizing a hydraulic motor']] },
  { id: 'hydraulic-motor-circuits', kind: 'topic', parent: 'hydraulic-motors', title: 'The hydraulic system', short: 'The power unit, directional and flow-control valves, counterbalance valves and brakes, hydrostatic transmissions, fluids and filtration, heat and noise.',
    plan: [['hydraulic-power-unit', 'The hydraulic power unit'], ['motor-control-valves', 'Valves that control a hydraulic motor'], ['counterbalance-brake-valves', 'Counterbalance valves and brakes'], ['hydrostatic-transmissions', 'Hydrostatic transmissions'], ['hydraulic-fluids-filtration', 'Hydraulic fluids and filtration'], ['hydraulic-heat-noise', 'Heat and noise in hydraulic systems']] },

  /* ================================================================ AIR */
  {
    id: 'air-motors', kind: 'branch', parent: 'motors', title: 'Air Motors', icon: 'wind', hue: 88,
    short: 'Motors driven by compressed air — vane, piston and turbine motors — their curves, control and air supply, and where they win: tools, explosive atmospheres, wet and dirty places.',
    body: `An air motor runs on compressed air. It cannot overheat or burn out when stalled, it can be stopped and reversed freely, it does not spark, and it keeps working in water, dust and explosive atmospheres — which is why it powers hand tools, mixers in paint and chemical plants, hoists and starters for engines. It is also noisy and expensive to run, because compressing air wastes most of the energy. Its power is a parabola in speed, largest at half the free speed; its torque falls in a straight line.`
  },
  { id: 'air-motor-topic', kind: 'topic', parent: 'air-motors', title: 'Air motors', short: 'How an air motor works, vane, piston and turbine motors, control and air supply, applications.',
    plan: [['air-motor-principle', 'How an air motor works'], ['vane-air-motors', 'Vane air motors'], ['piston-air-motors', 'Piston air motors'], ['turbine-air-motors', 'Turbine air motors'], ['air-motor-control', 'Controlling an air motor'], ['air-motor-applications', 'Where air motors win']] },

  /* ================================================================ SELECTION */
  {
    id: 'selection-applications', kind: 'branch', parent: 'motors', title: 'Choosing the Right Motor', icon: 'calc', hue: 60,
    short: 'The families compared side by side, stepper against servo against VFD, and the right motors for pumps and fans, conveyors and hoists, machine tools, vehicles, robots and drones, hazardous areas — and the cost of a motor over its life.',
    body: `Choosing a motor is choosing a set of compromises. How precise must the motion be? How much torque at what speed, how often, for how long? What supply is there — mains, battery, oil, air? How hot, wet, dusty or explosive is the place? How long must it last, and what will it cost to run? This branch draws the families together in comparison tables and applies them to the machines people actually build, so that you can reason from the application to the motor, the drive and the mechanics.`
  },
  { id: 'comparisons', kind: 'topic', parent: 'selection-applications', title: 'Comparing and applying', short: 'Motor families compared, positioning versus speed control, pumps and fans, conveyors and hoists, machine tools, vehicles, robots and drones, hazardous areas, life-cycle cost.',
    plan: [['motor-comparison', 'The motor families compared'], ['positioning-vs-speed', 'Stepper, servo or VFD?'], ['motors-pumps-fans', 'Motors for pumps and fans'], ['motors-conveyors-hoists', 'Motors for conveyors, cranes and hoists'], ['motors-machine-tools', 'Spindle and axis motors in machine tools'],
           ['motors-vehicles', 'Traction motors: cars, bikes and trains'], ['motors-robots-drones', 'Motors for robots and drones'], ['hazardous-areas', 'Motors in explosive atmospheres'], ['motor-life-cost', 'The life-cycle cost of a motor']] }
);
