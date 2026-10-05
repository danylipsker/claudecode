/* HYPER-ESP32 · content/driving-motors.js
 *
 * The topic "Driving motors" (branch Motion and control): DC motors and H-bridges, PWM frequency and decay, servos,
 * stepper drivers, step pulses and acceleration, brushless motors and ESCs, field-oriented control, encoders, position
 * control, limit switches and homing, supplies and protection, several axes.
 *
 * Programs are written for the Arduino core 3.3.x (ledcAttach, 14 bits or fewer at 50 Hz), MicroPython 1.29 (PWM with
 * duty_u16 / duty_ns) and the block notation. The motors themselves are the subject of Hyper Motors (motors:…).
 */
Hyper.add(
/* ================================================================ 1 */
{
  id: 'dc-motors-and-h-bridges',
  parent: 'driving-motors',
  title: 'DC motors and H-bridges',
  level: 2,
  short: 'A small brushed DC motor runs faster with more voltage and draws more current with more load. An H-bridge of four switches reverses it, and decides what happens when you let go: brake or coast. Driver chips put the bridge, its protection and a logic interface in one package.',
  keywords: ['DC motor', 'brushed motor', 'H-bridge', 'motor driver', 'TB6612FNG', 'DRV8833', 'DRV8871', 'L298N', 'stall current', 'back-EMF', 'brake', 'coast', 'direction', 'standby', 'gearmotor', 'motor shield', 'reverse'],
  prereq: ['switching-dc-loads', 'mosfets-for-loads', 'pwm-with-ledc'],
  related: ['motor-pwm-frequency', 'motor-power-and-protection', 'mcpwm', 'servos', 'robots-on-esp', 'motors:dc-motors', 'motors:h-bridge', 'motors:dc-motor-drivers', 'motors:dc-braking', 'electronics:h-bridge', 'electronics:dc-motor-control'],
  body: `A brushed DC motor is the simplest motor there is: two terminals, a shaft and a rule you can feel with your hand. **More voltage, more speed. More load, more current.** Swap the two wires and it turns the other way. Everything else on this page, and on the pages after it, is about doing those three things from a 3.3 V pin that can give 20 mA to a machine that wants amperes. The motor itself is explained in [[motors:dc-motors]]; here the question is how an ESP32 drives it.

### What the motor asks of you

Three figures in the datasheet decide the driver. The **nominal voltage** (3, 6 or 12 V): the motor runs on less, more slowly, and for a while on a little more, hotter. The **no-load current**, a few tens to a few hundred milliamps for a small gearmotor. And the **stall current**, what flows when the shaft is held still. A stopped motor makes no back-EMF to oppose the supply, so the current is only the supply voltage divided by the winding resistance: 6 V across 2.4 Ω is 2.5 A. That is ten or twenty times the running current, and it also flows for a moment every time the motor starts. Choose the driver for the stall current, or make sure the program never lets it last ([[motor-power-and-protection]]).

### Four switches make a bridge

Put the motor across the middle of an H. Each of its terminals has a switch up to the supply (the *high side*) and a switch down to ground (the *low side*). Close the top left and the bottom right switch and current flows one way; close the other diagonal and it flows the other way. The other combinations are useful too, and one of them is fatal:

| High left | High right | Low left | Low right | The motor |
|---|---|---|---|---|
| on | off | off | on | turns forward |
| off | on | on | off | turns in reverse |
| off | off | on | on | **brakes**: both terminals tied to ground, the motor's own back-EMF drives a current that fights the motion |
| off | off | off | off | **coasts**: nothing connected, it spins down by friction |
| on | off | on | off (same side) | **shoot-through**: a short circuit from supply to ground through two switches; never |

### Which driver

| Driver | Switches | Motor supply | Per channel | In short |
|---|---|---|---|---|
| TB6612FNG | MOSFET, two bridges | 4.5–13.5 V | 1.2 A continuous, 3.2 A peak | IN1, IN2, PWM and a standby pin per channel; 3.3 V logic is fine; cool and efficient |
| DRV8833 | MOSFET, two bridges | 2.7–10.8 V | 1.5 A RMS, 2 A peak | two inputs per bridge; low supply voltages, good for battery robots |
| DRV8871 | MOSFET, one bridge | 6.5–45 V | 3.6 A peak | one bridge for a larger motor; its current limit is set by a resistor |
| L298N | bipolar transistors, two bridges | 5–46 V | 2 A | old and cheap; the transistors drop about 2 V or more, so a 6 V motor sees 3 or 4 V and the chip gets hot |

Some boards carry the driver: the catalogue lists the DFRobot Romeo ESP32-S3 (a two-channel driver, 2.5 A, motor supply 5–24 V), the Romeo ESP32-C3-MINI-1 (two channels, 1.7 A) and Waveshare's General Driver Board for Robots (a TB6612FNG with encoder inputs and a current monitor). The red L298N module has a 5 V regulator on board: never connect its 5 V pin to a 3.3 V pin of the ESP32, and above about 12 V remove its regulator jumper and feed the logic from elsewhere.

### Brake before you reverse

Going from full forward to full reverse in one step asks the supply to push against the back-EMF as well as the winding: the current spikes to more than the stall value and the gears take the torque. Brake or coast to a near stop first, then reverse; the program below does.

> [!warn] A motor starts when you least expect it: at upload, at reset, when a pin floats. Keep fingers, hair and cables clear, give the motor supply its own switch or a stop button that cuts it, and never run a motor from a lithium cell without a protected supply and a fuse.

> [!key] A DC motor is driven by an H-bridge: two diagonals give the two directions, both low sides together give a brake, nothing connected gives a coast, and two switches of one side together are a short circuit. Pick a MOSFET driver rated above the stall current, give the motor its own supply with a shared ground, and stop before you reverse.`,
  ideas: [
    'Voltage sets the speed and load sets the current; swapping the two wires reverses the motor.',
    'The stall current, supply voltage divided by winding resistance, is many times the running current and flows at every start.',
    'An H-bridge of four switches gives forward, reverse, brake (both low sides on) and coast (all off); two switches of one side on together is a short circuit.',
    'MOSFET drivers (TB6612FNG, DRV8833, DRV8871) lose far less than a bipolar L298N, which drops about 2 V.'
  ],
  pitfalls: [
    'The ESP32 pin can drive a small motor directly — A pin gives about 20 mA and has no protection against the voltage spikes of a coil. A motor needs a driver with its own supply.',
    'A bigger supply voltage only makes it faster — Above the rating the motor wears out brushes and overheats; and at the same time the stall current grows in proportion.',
    'Reverse the direction pins and the motor reverses at once, which is fine — The sudden reversal pulls a current spike beyond the stall value and shocks the gears. Brake or coast first, then reverse.'
  ],
  terms: [
    { term: 'H-bridge', also: ['full bridge', 'motor bridge'], def: 'Four switches arranged like the letter H with the motor across the middle. Closing one diagonal runs the motor forward, the other diagonal in reverse, and the two low (or two high) switches together brake it.' },
    { term: 'Stall current', also: ['locked-rotor current', 'blocked current'], def: 'The current of a motor whose shaft is held still. With no back-EMF it equals the supply voltage divided by the winding resistance, and it is many times the running current.' },
    { term: 'Back-EMF', also: ['counter-EMF', 'generator voltage'], def: 'The voltage a spinning motor generates, proportional to its speed and opposing the supply. It is what limits the current of a running motor; it is zero at stall.' },
    { term: 'Short brake', also: ['dynamic braking', 'brake mode'], def: 'Joining the two motor terminals (through the two low-side or the two high-side switches) so that the back-EMF drives a current in the winding that slows the rotor quickly.' },
    { term: 'Coast', also: ['free-wheel', 'high-impedance stop'], def: 'Disconnecting the motor from both supply and ground. It slows down only by friction, and the winding current dies away through the driver\'s body diodes.' }
  ],
  sim: 'dm-hbridge',
  formulas: [
    {
      name: 'Current of a running DC motor',
      expr: 'I = (V - ke*w)/R',
      tex: 'I = \\frac{V - k_e\\,\\omega}{R}',
      vars: {
        I: { name: 'motor current', q: 'current', unit: 'A', tex: 'I', signed: true },
        V: { name: 'voltage across the motor', q: 'voltage', unit: 'V', value: 6, tex: 'V' },
        ke: { name: 'back-EMF constant', q: 'kemf', unit: 'V·s/rad', value: 0.009, tex: 'k_e' },
        w: { name: 'shaft speed', q: 'angvel', unit: 'rpm', value: 5000, min: 0, tex: '\\omega' },
        R: { name: 'winding resistance', q: 'resistance', unit: 'Ω', value: 2.4, tex: 'R' }
      },
      solveFor: 'I',
      note: 'Steady state, with the voltage the motor really sees (the supply minus the driver\'s drop). At zero speed this is the stall current V/R. The back-EMF constant is in the motor datasheet, or measure no-load speed at a known voltage: ke is about V divided by the angular speed.',
      stories: { I: 'A motor with winding resistance {R} and back-EMF constant {ke} runs at {w} on {V}. What current does it draw?', w: 'A motor ({R}, {ke}) on {V} draws {I}. How fast does it turn?' }
    }
  ],
  examples: [
    {
      title: 'Which driver for a 6 V motor?',
      q: 'A gearmotor is rated 6 V with a winding resistance of 2.4 Ω, and runs at about 0.5 A in the robot. It is supplied from 4 AA cells (6 V). Compare the TB6612FNG and the L298N.',
      steps: [
        'Stall current: $6 / 2.4 = 2.5$ A, five times the running current.',
        'TB6612FNG: 1.2 A continuous, 3.2 A peak. The 2.5 A stall is below the peak, so a brief stall (starting, hitting a wall for a fraction of a second) is survivable; holding it would overheat the chip. The drop across its MOSFETs is tens of millivolts at 0.5 A, so the motor sees nearly the full 6 V.',
        'L298N: the two bipolar transistors in the current path drop roughly 2 to 3 V. The motor sees about 3.5 V, runs at about half its rated speed and the chip dissipates around 1 W at the running current.'
      ],
      a: 'The TB6612FNG, with a program or a sensor that limits stalls to short times. The L298N wastes a third to a half of the battery voltage in heat.'
    }
  ],
  quiz: [
    { q: 'A motor with a winding resistance of 3 Ω is supplied with 12 V and its shaft is held still. What current flows, roughly?', choices: ['0.25 A', '4 A', '36 A', '1 A'], a: 1, why: 'At stall there is no back-EMF, so the only limit is the winding: 12 V / 3 Ω = 4 A. The same motor running free draws a small fraction of that.' },
    { q: 'Both low-side switches of an H-bridge are on and both high-side switches are off. What does the motor do?', choices: ['Runs forward', 'Coasts to a stop slowly', 'Is braked: its terminals are joined, so it slows quickly', 'The bridge is short-circuited'], a: 2, why: 'Joining the two terminals lets the back-EMF drive a current through the winding that opposes the motion: a short brake. Nothing is connected to the supply, so there is no short circuit.' },
    { q: 'Which two switches of an H-bridge must never be on together?', choices: ['The two high-side switches', 'A high-side and a low-side switch on the same side', 'The two low-side switches', 'Opposite diagonal switches'], a: 1, why: 'A high and a low switch on the same side connect the supply straight to ground through nothing but the two transistors: shoot-through. The two high sides together or the two low sides together only join the motor terminals.' },
    { q: 'An L298N module drives a 6 V motor from a 6 V battery. What goes wrong?', choices: ['Nothing, it is rated for 46 V', 'The bipolar transistors drop about 2 V or more, so the motor gets much less than 6 V', 'The ESP32 cannot control it', 'It turns the motor in one direction only'], a: 1, why: 'The L298N\'s transistors lose volts, not millivolts. At low motor voltages the loss is a large fraction of the supply and turns into heat; MOSFET drivers such as the TB6612FNG or DRV8833 lose almost nothing.' }
  ],
  applications: [
    'Two-wheeled robot cars, with one bridge per wheel and a speed set by PWM.',
    'Motorised blinds, locks and valves, where the motor must run both ways and stop at a limit switch.',
    'Pumps and fans that run one way at a variable speed: one bridge or a single low-side MOSFET.',
    'Toy-grade mechanisms, robot arms with geared motors and small conveyors.'
  ],
  sources: [
    'Toshiba, *TB6612FNG* datasheet: the truth table of IN1, IN2, PWM and STBY and the current ratings.',
    'Texas Instruments, *DRV8833* and *DRV8871* datasheets: supply range, current ratings and the control tables.',
    'STMicroelectronics, *L298* datasheet: the saturation voltages of the output stages.'
  ],
  choose: {
    good: ['Small motors up to a few amperes, run both ways and at variable speed', 'A MOSFET driver board with a standby pin, for battery-powered robots', 'A geared DC motor where position does not matter, or is read by an encoder'],
    avoid: ['The L298N at supplies below about 12 V: it wastes volts as heat', 'A driver with no overcurrent protection on a motor that can stall for seconds', 'Driving the motor straight from a GPIO pin'],
    check: ['The stall current against the driver\'s peak rating, and its continuous rating against the running current', 'That motor ground and ESP32 ground are joined, and the motor supply is separate', 'What the driver does at power-up and in standby: the motor must stay still']
  },
  code: [
    {
      title: 'Drive a DC motor forward, brake, reverse and coast',
      about: 'A TB6612FNG channel: IN1 and IN2 choose the direction, PWM sets the speed at 20 kHz (above hearing), STBY wakes the driver. The program runs the motor forward for two seconds, brakes, runs it back, then lets it coast. Reading the truth table is the point: with both inputs low and PWM high the outputs are off (coast); with both high they are joined (brake).',
      needs: 'An ESP32 DevKit, a TB6612FNG module, a 6 V DC gearmotor and its own 6 V supply (4 AA cells). Motor supply and ESP32 share ground.',
      wiring: [['GPIO25', 'TB6612FNG PWMA', '20 kHz PWM'], ['GPIO26', 'AIN1'], ['GPIO27', 'AIN2'], ['GPIO33', 'STBY', 'high wakes the driver'], ['3V3', 'VCC (logic)'], ['6 V supply', 'VM and motor supply, with GND joined to the ESP32 GND', 'a 100 µF capacitor across VM and GND'], ['AO1, AO2', 'the motor']],
      blocks: `
        when started
          set pin (26) as [output v]
          set pin (27) as [output v]
          set pin (33) as [output v]
          set PWM on pin (25) frequency (20000) resolution (10)
          set pin (33) to [HIGH v]
        forever
          drive (60) :: my
          wait (2) seconds
          brake :: my
          wait (1) seconds
          drive (-60) :: my
          wait (2) seconds
          coast :: my
          wait (2) seconds
        end

        define drive (speed)
          if <(speed) = (0)> then
            coast :: my
          else if <(speed) > (0)> then
            set pin (26) to [HIGH v]
            set pin (27) to [LOW v]
            set PWM on pin (25) to (map (speed) from (0) (100) to (0) (1023))
          else
            set pin (26) to [LOW v]
            set pin (27) to [HIGH v]
            set PWM on pin (25) to (map ((0) - (speed)) from (0) (100) to (0) (1023))
          end

        define brake
          set pin (26) to [HIGH v]
          set pin (27) to [HIGH v]
          set PWM on pin (25) to (1023)

        define coast
          set pin (26) to [LOW v]
          set pin (27) to [LOW v]
          set PWM on pin (25) to (1023)
      `,
      cpp: String.raw`
        const int PIN_PWM  = 25;           // PWMA
        const int PIN_IN1  = 26;           // AIN1
        const int PIN_IN2  = 27;           // AIN2
        const int PIN_STBY = 33;           // STBY: high = driver awake
        const int PWM_FREQ = 20000;        // above hearing
        const int PWM_BITS = 10;           // duty 0 .. 1023
        const int DUTY_MAX = (1 << PWM_BITS) - 1;

        void brake() {                     // both inputs high: the motor terminals are joined
          digitalWrite(PIN_IN1, HIGH);
          digitalWrite(PIN_IN2, HIGH);
          ledcWrite(PIN_PWM, DUTY_MAX);
        }

        void coast() {                     // both inputs low with PWM high: the outputs are off
          digitalWrite(PIN_IN1, LOW);
          digitalWrite(PIN_IN2, LOW);
          ledcWrite(PIN_PWM, DUTY_MAX);
        }

        void drive(int speed) {            // -100 .. 100 percent
          if (speed == 0) { coast(); return; }
          digitalWrite(PIN_IN1, speed > 0);
          digitalWrite(PIN_IN2, speed < 0);
          ledcWrite(PIN_PWM, map(abs(speed), 0, 100, 0, DUTY_MAX));
        }

        void setup() {
          pinMode(PIN_IN1, OUTPUT);
          pinMode(PIN_IN2, OUTPUT);
          pinMode(PIN_STBY, OUTPUT);
          ledcAttach(PIN_PWM, PWM_FREQ, PWM_BITS);
          digitalWrite(PIN_STBY, HIGH);    // take the driver out of standby
        }

        void loop() {
          drive(60);   delay(2000);
          brake();     delay(1000);        // stop before reversing
          drive(-60);  delay(2000);
          coast();     delay(2000);
        }
      `,
      py: String.raw`
        from machine import Pin, PWM
        import time

        PIN_PWM, PIN_IN1, PIN_IN2, PIN_STBY = 25, 26, 27, 33
        FULL = 65535                           # duty_u16 full scale

        in1 = Pin(PIN_IN1, Pin.OUT)
        in2 = Pin(PIN_IN2, Pin.OUT)
        stby = Pin(PIN_STBY, Pin.OUT)
        pwm = PWM(Pin(PIN_PWM), freq=20000, duty_u16=0)   # 20 kHz, above hearing

        def brake():                           # both inputs high: the motor terminals are joined
            in1.value(1)
            in2.value(1)
            pwm.duty_u16(FULL)

        def coast():                           # both inputs low with PWM high: the outputs are off
            in1.value(0)
            in2.value(0)
            pwm.duty_u16(FULL)

        def drive(speed):                      # -100 .. 100 percent
            if speed == 0:
                coast()
                return
            in1.value(1 if speed > 0 else 0)
            in2.value(1 if speed < 0 else 0)
            pwm.duty_u16(abs(speed) * FULL // 100)

        stby.value(1)                          # take the driver out of standby
        while True:
            drive(60);   time.sleep(2)
            brake();     time.sleep(1)         # stop before reversing
            drive(-60);  time.sleep(2)
            coast();     time.sleep(2)
      `,
      notes: ['On a TB6612FNG the PWM input switches between drive and short brake, so the motor is braked in every gap of the PWM: that is slow decay (see the next page).', 'A DRV8833 has no separate PWM pin: put PWM on one of the two inputs and hold the other low or high, as its datasheet table shows.', 'The motor supply and the ESP32 supply are different rails with one shared ground. Never power a motor from the 3V3 pin.']
    }
  ]
},

/* ================================================================ 2 */
{
  id: 'motor-pwm-frequency',
  parent: 'driving-motors',
  title: 'PWM frequency, decay and current',
  level: 2,
  short: 'A motor winding is an inductor, so PWM makes its current ripple and the frame whine. About 20 kHz is above hearing and keeps the ripple small; fast and slow decay decide how the current falls between pulses.',
  keywords: ['PWM frequency', 'motor whine', '20 kHz', 'current ripple', 'inductance', 'slow decay', 'fast decay', 'brake', 'coast', 'sign-magnitude', 'lock anti-phase', 'dead zone', 'kick start', 'minimum duty', 'switching loss', 'time constant'],
  prereq: ['dc-motors-and-h-bridges', 'pwm-with-ledc'],
  related: ['mcpwm', 'fans-and-pwm-control', 'measuring-current-with-shunts', 'position-control', 'motors:pwm-speed-control', 'electronics:pwm', 'electronics:buck-converter'],
  body: `An LED does not care how fast it is switched. A motor does, because its winding is a coil: it has resistance *and* inductance. When the PWM turns the voltage on, the current does not jump to its final value; it climbs with the electrical time constant $\\tau = L/R$, perhaps 1 ms for a small motor (2 mH in 2.4 Ω is 0.83 ms). When the voltage turns off, the current falls the same way. If the PWM period is much shorter than τ the current barely wobbles around its average and the torque is smooth. If the period is about as long as τ the current swings from almost nothing to well above its average: the motor heats, shakes and sings.

### The ripple

For a winding driven at duty $D$ from a supply $V$ with PWM frequency $f$, the peak-to-peak ripple is about

$$\\Delta I = \\frac{V\\,D\\,(1-D)}{L\\,f}$$

It is largest at 50 % duty. For the 6 V, 2 mH motor above: 0.75 A peak to peak at 1 kHz, but only 0.04 A at 20 kHz. Ripple costs you heat in the winding (the RMS current is higher than the average) and, in a closed loop, noise in the current you measure.

### Why 20 kHz

The rotor, the brushes and the housing vibrate at the PWM frequency. From a few hundred hertz up to about 15 kHz that is a clear whine. **Around 20 kHz** it is above what most adults hear, and the ripple is small. Going far higher helps little: every switching edge dissipates energy in the driver, so the losses and the radio noise rise with frequency. A few small drivers prefer lower limits; read the datasheet's maximum PWM frequency. The ESP32 gives this easily: at 20 kHz the LEDC timer offers 11 bits when it is clocked at 80 MHz and 10 bits at 40 MHz, so **10 bits** works on any clock ([[pwm-with-ledc]]).

### Fast and slow decay

In the gap between pulses the current in the winding has to go somewhere:

- **Slow decay (brake).** The bridge joins the two motor terminals (both low sides on). The current circulates through the motor and the bridge, driven only by the back-EMF, and falls slowly. Ripple is small and speed follows the duty smoothly. The TB6612FNG does this by default: its PWM input alternates drive and short brake.
- **Fast decay (coast, or reverse).** The bridge opens, and the energy of the coil is forced back into the supply through body diodes, so the current falls fast. Ripple is larger, but the current responds faster, which current-chopping drivers want. A DRV8833 with PWM on IN1 and IN2 low behaves this way; with IN1 high and PWM on IN2 it brakes instead.

Which one you get depends on the driver's truth table, not on the ESP32: look it up. A further choice is how a bridge takes a *signed* command: **sign-magnitude** (one pin for direction, PWM for the size, as above) or **lock anti-phase** (one PWM, 50 % means stopped, with current flowing back and forth all the time: simple and smooth through zero, but wasteful).

### Dead zone and kick

A motor does not start below some duty, where the torque is less than the static friction: 10 to 30 % for a small gearmotor. Below it the shaft sits still and the winding only warms up. A good program maps the control range onto the usable range (the shaft runs at the lowest duty) and, when starting from rest, applies full power for 20 to 50 ms as a **kick**.

> [!key] A winding is an inductor: PWM at about 20 kHz keeps the ripple small and the frame silent, at the price of some switching loss. The driver's decay mode (brake between pulses is slow, coast is fast) shapes the current, and below the dead zone the motor only heats.`,
  ideas: [
    'A motor winding has resistance and inductance; its current follows the PWM with a time constant L/R of about a millisecond.',
    'Ripple falls in proportion to the PWM frequency and is largest at 50 % duty; around 20 kHz it is small and inaudible to most adults.',
    'Slow decay (brake between pulses) gives low ripple; fast decay (coast or reverse) gives faster current response with more ripple. The driver\'s truth table decides which.',
    'Small motors have a dead zone at low duty; a short full-power kick gets them started, and the control range is mapped onto the usable range.'
  ],
  pitfalls: [
    'A higher PWM frequency is always better — Each edge costs switching energy in the driver and adds radio noise. Above about 20 to 30 kHz there is nothing to gain for a small brushed motor.',
    'The whine is a fault in the motor — It is the winding and frame vibrating at the PWM frequency. Move the frequency above hearing and it goes.',
    'Low duty means slow rotation — Below the dead zone the shaft does not turn at all while current still heats the winding.'
  ],
  terms: [
    { term: 'Current ripple', also: ['ripple current'], def: 'The up-and-down swing of the motor current around its average caused by PWM. It shrinks as the PWM frequency and the winding inductance rise.' },
    { term: 'Electrical time constant', also: ['L/R time', 'winding time constant'], def: 'The inductance of the winding divided by its resistance: the time in which its current climbs to about 63 % of its final value after a voltage step.' },
    { term: 'Slow decay', also: ['brake decay', 'low-side recirculation'], def: 'A PWM gap in which both terminals of the motor are joined, so the current keeps circulating and falls slowly. Ripple is low.' },
    { term: 'Fast decay', also: ['coast decay', 'reverse recirculation'], def: 'A PWM gap in which the bridge opens and the coil\'s current is driven back into the supply, falling quickly. Ripple is higher but the current responds faster.' },
    { term: 'Dead zone', also: ['minimum duty', 'stiction zone'], def: 'The range of low duty values at which a motor does not turn because the torque is less than static friction. Programs skip over it.' },
    { term: 'Kick start', also: ['breakaway pulse'], def: 'A short burst of full power applied when a motor starts from rest, to overcome static friction before the duty falls to the wanted value.' }
  ],
  sim: 'dm-duty-speed',
  formulas: [
    {
      name: 'Peak-to-peak current ripple',
      expr: 'dI = V*D*(1 - D)/(L*f)',
      tex: '\\Delta I = \\frac{V\\,D\\,(1 - D)}{L\\,f}',
      vars: {
        dI: { name: 'peak-to-peak ripple', q: 'current', unit: 'mA', tex: '\\Delta I' },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 6, tex: 'V' },
        D: { name: 'duty cycle', q: 'ratio', unit: '', value: 0.5, min: 0, max: 1, tex: 'D' },
        L: { name: 'winding inductance', q: 'inductance', unit: 'mH', value: 2, tex: 'L' },
        f: { name: 'PWM frequency', q: 'frequency', unit: 'kHz', value: 20, tex: 'f' }
      },
      solveFor: 'dI',
      note: 'A first approximation that treats the back-EMF as constant over a period, so it applies to a motor that is already turning. In the dead zone or at stall the current is different. Choose L from the datasheet, or measure it with an LCR meter at the PWM frequency.',
      stories: { dI: 'A motor winding of {L} is driven from {V} at {D} duty and {f}. How much does its current ripple?', f: 'A {L} winding on {V} at {D} duty may ripple by {dI}. What PWM frequency does that need?' }
    },
    {
      name: 'Electrical time constant',
      expr: 'tau = L/R',
      tex: '\\tau = \\frac{L}{R}',
      vars: {
        tau: { name: 'time constant', q: 'time', unit: 'ms', tex: '\\tau' },
        L: { name: 'winding inductance', q: 'inductance', unit: 'mH', value: 2, tex: 'L' },
        R: { name: 'winding resistance', q: 'resistance', unit: 'Ω', value: 2.4, tex: 'R' }
      },
      solveFor: 'tau',
      note: 'The PWM period should be several times shorter than this for a smooth current.',
      stories: { tau: 'A winding has {L} and {R}. How long does its current take to rise to 63 % of its final value?' }
    }
  ],
  examples: [
    {
      title: 'Is 1 kHz good enough?',
      q: 'A 6 V motor with $L = 2$ mH and $R = 2.4$ Ω is driven at 50 % duty. Compare the current ripple at 1 kHz and at 20 kHz, and say what it means.',
      steps: [
        { text: 'Time constant:', tex: '\\tau = L/R = 2\\,\\mathrm{mH}/2.4\\,\\Omega = 0.83\\,\\mathrm{ms}' },
        { text: 'At 1 kHz:', tex: '\\Delta I = \\frac{6 \\cdot 0.5 \\cdot 0.5}{0.002 \\cdot 1000} = 0.75\\,\\mathrm{A}' },
        { text: 'At 20 kHz:', tex: '\\Delta I = \\frac{6 \\cdot 0.25}{0.002 \\cdot 20000} = 0.0375\\,\\mathrm{A}' },
        'The period at 1 kHz (1 ms) is about equal to τ, so the current swings by 0.75 A around an average of about half an ampere: it even reaches zero in the gaps. At 20 kHz the period is 50 µs, sixteen times shorter than τ, and the ripple is about 40 mA.'
      ],
      a: '0.75 A against 0.04 A. At 1 kHz the current is more ripple than average, with heat and whine; at 20 kHz the motor sees an almost steady current.'
    }
  ],
  quiz: [
    { q: 'A motor winding has $L = 4$ mH and $R = 2$ Ω. About how long does its current take to reach 63 % of its final value after a voltage step?', choices: ['0.5 ms', '2 ms', '8 ms', '8 µs'], a: 1, why: 'The time constant is L/R = 4 mH / 2 Ω = 2 ms.' },
    { q: 'You double the PWM frequency of a motor drive and change nothing else. What happens to the peak-to-peak current ripple?', choices: ['It doubles', 'It halves', 'It stays the same', 'It quadruples'], a: 1, why: 'The ripple is proportional to 1/f: V·D·(1 − D)/(L·f). Twice the frequency, half the ripple, at the price of more switching loss.' },
    { q: 'Between the pulses a driver short-circuits the motor terminals so that the current keeps circulating. Which decay mode is that?', choices: ['Fast decay', 'Slow decay', 'Lock anti-phase', 'Shoot-through'], a: 1, why: 'Joining the terminals lets the current fall only slowly, driven by the back-EMF: slow decay, also called brake or low-side recirculation. Fast decay opens the bridge and pushes the current back into the supply.' },
    { q: 'A small motor does not turn at 15 % duty but runs steadily at 30 %. What is a sensible program?', choices: ['Use 15 % as the lowest speed anyway', 'Raise the PWM frequency', 'Map the speed range to 30 to 100 % duty and give a short full-power kick from rest', 'Reverse the motor'], a: 2, why: 'Below the dead zone the motor only heats. Mapping the control range onto the useful duty range makes the lowest setting the slowest real speed; a 20 to 50 ms full-power kick overcomes static friction at the start.' }
  ],
  applications: [
    'Silent small robots: 20 kHz PWM so the drive is inaudible indoors.',
    'Current-sensing drives, where ripple must be small enough to read the current through a shunt resistor.',
    'Fans and pumps that need to run at low speed without stalling or humming.',
    'Battery tools and toys, where a lower duty means less heat in the winding.'
  ],
  sources: [
    'Texas Instruments, *DRV8833* datasheet: the control table and the fast and slow decay modes.',
    'Arduino core for ESP32 documentation, *LEDC* API (core 3.3): frequency and resolution limits.',
    'Toshiba, *TB6612FNG* datasheet: the truth table, with short brake in the PWM gaps.'
  ],
  choose: {
    good: ['About 20 kHz for small brushed motors: inaudible and low ripple', 'Slow decay (brake between pulses) for smooth speed control', 'A kick and a minimum duty for motors that stick at low speed'],
    avoid: ['A PWM period close to the winding\'s L/R time constant', 'A very high frequency with a driver that has high switching losses', 'Lock anti-phase on a big motor: it wastes current at standstill'],
    check: ['The driver\'s maximum PWM frequency', 'What its truth table does in the gaps: brake or coast', 'The duty at which the motor really starts, with your load']
  },
  code: [
    {
      title: 'Speed knob with a dead zone and a kick start',
      about: 'A potentiometer sets the speed of a motor on a TB6612FNG. The bottom 5 % of the knob means "stop"; above that the knob is mapped onto the duty range the motor can really use (a quarter to full), and when the motor starts from rest it gets 30 ms of full power first. PWM is 20 kHz at 10 bits.',
      needs: 'An ESP32 DevKit, a TB6612FNG module, a 6 V DC motor with its own supply, and a 10 kΩ potentiometer. The wiring of the driver is that of [[dc-motors-and-h-bridges]].',
      wiring: [['GPIO34', 'potentiometer wiper', 'ADC1, input only; ends to 3V3 and GND'], ['GPIO25', 'TB6612FNG PWMA'], ['GPIO26', 'AIN1', 'held high: forward'], ['GPIO27', 'AIN2', 'held low'], ['GPIO33', 'STBY', 'held high'], ['6 V supply', 'VM and motor, GND shared']],
      blocks: `
        when started
          set pin (26) as [output v]
          set pin (27) as [output v]
          set pin (33) as [output v]
          set pin (26) to [HIGH v]
          set pin (27) to [LOW v]
          set pin (33) to [HIGH v]
          set PWM on pin (25) frequency (20000) resolution (10)
          set [last v] to (0)
        forever
          set [percent v] to (map (analog read pin (34)) from (0) (4095) to (0) (100))
          set [duty v] to (0)
          if <(percent) > (5)> then
            set [duty v] to (map (percent) from (5) (100) to (255) (1023))
          end
          if <<(duty) > (0)> and <(last) = (0)>> then
            set PWM on pin (25) to (1023)
            wait (0.03) seconds
          end
          set PWM on pin (25) to (duty)
          set [last v] to (duty)
          wait (0.02) seconds
        end
      `,
      cpp: String.raw`
        const int PIN_POT  = 34;           // ADC1, input only
        const int PIN_PWM  = 25;           // PWMA
        const int PIN_IN1  = 26;           // AIN1, high: forward
        const int PIN_IN2  = 27;           // AIN2, low
        const int PIN_STBY = 33;           // STBY, high: awake
        const int PWM_BITS = 10;
        const int DUTY_MAX = (1 << PWM_BITS) - 1;
        const int MIN_DUTY = DUTY_MAX / 4; // the lowest duty at which this motor runs
        int lastDuty = 0;

        void setup() {
          pinMode(PIN_IN1, OUTPUT);
          pinMode(PIN_IN2, OUTPUT);
          pinMode(PIN_STBY, OUTPUT);
          digitalWrite(PIN_IN1, HIGH);
          digitalWrite(PIN_IN2, LOW);
          digitalWrite(PIN_STBY, HIGH);
          ledcAttach(PIN_PWM, 20000, PWM_BITS);
        }

        void loop() {
          int percent = map(analogRead(PIN_POT), 0, 4095, 0, 100);
          int duty = 0;
          if (percent > 5) duty = map(percent, 5, 100, MIN_DUTY, DUTY_MAX);   // the dead zone at the bottom of the knob
          if (duty > 0 && lastDuty == 0) {
            ledcWrite(PIN_PWM, DUTY_MAX);  // kick: full power for a moment to break away
            delay(30);
          }
          ledcWrite(PIN_PWM, duty);
          lastDuty = duty;
          delay(20);
        }
      `,
      py: String.raw`
        from machine import Pin, PWM, ADC
        import time

        PIN_POT, PIN_PWM, PIN_IN1, PIN_IN2, PIN_STBY = 34, 25, 26, 27, 33
        FULL = 65535
        MIN_DUTY = FULL // 4                   # the lowest duty at which this motor runs

        pot = ADC(Pin(PIN_POT), atten=ADC.ATTN_11DB)
        Pin(PIN_IN1, Pin.OUT).value(1)         # forward
        Pin(PIN_IN2, Pin.OUT).value(0)
        Pin(PIN_STBY, Pin.OUT).value(1)        # awake
        pwm = PWM(Pin(PIN_PWM), freq=20000, duty_u16=0)
        last_duty = 0

        while True:
            percent = pot.read_u16() * 100 // 65535
            duty = 0
            if percent > 5:                    # the dead zone at the bottom of the knob
                duty = MIN_DUTY + (percent - 5) * (FULL - MIN_DUTY) // 95
            if duty > 0 and last_duty == 0:
                pwm.duty_u16(FULL)             # kick: full power for a moment to break away
                time.sleep_ms(30)
            pwm.duty_u16(duty)
            last_duty = duty
            time.sleep_ms(20)
      `,
      notes: ['The ESP32 ADC is noisy: if the speed flickers, average a few readings or smooth the knob value.', 'Find MIN_DUTY by trial with your motor and its load; it also changes with the supply voltage and as the gearbox warms up.']
    }
  ]
},

/* ================================================================ 3 */
{
  id: 'servos',
  parent: 'driving-motors',
  title: 'Hobby servos',
  level: 2,
  short: 'A hobby servo is a small motor, gearbox and position sensor with its own control loop. One pulse of 1 to 2 ms every 20 ms tells it where to go; it needs its own 5 V supply and a hardware-timed signal, which the ESP32 makes with LEDC.',
  keywords: ['servo', 'RC servo', 'hobby servo', 'SG90', 'MG996R', '50 Hz', 'pulse width', '1500 µs', 'ESP32Servo', 'continuous rotation', 'analogue servo', 'digital servo', 'LEDC', 'duty_ns', 'jitter', 'end stop', 'servo power', 'brownout'],
  prereq: ['dc-motors-and-h-bridges', 'pwm-with-ledc', 'the-3v3-rail'],
  related: ['motor-power-and-protection', 'level-shifters', 'position-control', 'brushless-motors-and-escs', 'current-peaks-and-capacitors', 'motors:rc-servos', 'motors:servo-basics', 'electronics:pwm'],
  body: `A hobby servo (the kind in model aircraft and robot arms) is a complete position-control system in a plastic box: a small DC motor, a gearbox, a potentiometer on the output shaft that measures the angle, and a control board that drives the motor until the measured angle equals the commanded one. You do not control the motor; you tell the servo **where to go**, and it holds the place against a load, within its torque.

### The signal

Three wires: ground (brown or black), supply (red, 4.8 to 6 V for most; high-voltage types take up to 7.4 or 8.4 V) and signal (orange, yellow or white). The signal is a pulse repeated every 20 ms (50 Hz). The **width of the pulse is the command**: about 1500 µs is the middle, 1000 µs one end, 2000 µs the other. Many servos accept 500 to 2500 µs and sweep a full 180° over it, but their mechanical stops may lie inside that range. Commanding a position the servo cannot reach makes it buzz against the stop, draw its stall current and strip its gears: find the safe minimum and maximum for your servo and keep to them.

### Making the pulse on an ESP32

The pulse must be exact, and it must not jitter when Wi-Fi is busy. Software pulses made with \`delayMicroseconds\` do jitter; the LEDC peripheral makes the signal in hardware, so the servo stays steady while the processor does other things ([[pwm-with-ledc]]). Set it to 50 Hz and 14 bits: one step is 20 ms / 16384 = 1.22 µs, about 0.11° of rotation, finer than the servo's own dead band of 5 to 10 µs. **Never use 16 bits at 50 Hz in a program meant for any chip:** the LEDC timer is only 14 bits wide on the ESP32-S2, S3, C3 and C2. The ESP32Servo library does the same job with \`attach(pin, minUs, maxUs)\` and \`write(angle)\`; the simulation shows how coarse the steps get at 8 bits.

### Power is the real problem

A micro servo of 9 g draws a few hundred milliamps while it moves and up to about an ampere when stalled; a standard-size servo several times that. The 3.3 V pin cannot do it, and neither can a computer's USB port with other things on the rail. Give the servo **its own 5 V supply with the ground joined to the ESP32's**, and put 470 to 1000 µF across the servo supply: when the servo starts, its current step sags the rail, and a sagging ESP32 rail resets the chip ([[current-peaks-and-capacitors]]). The signal is 3.3 V logic: most servos accept it, a few do not; a level shifter ([[level-shifters]]) fixes those.

### What a servo does not do

- **Move slowly.** A new command makes it run to the target at full speed, roughly 0.1 to 0.2 s per 60°. For a smooth motion, step the command gradually, as the second program does.
- **Report its position.** A plain servo has no feedback wire; the ESP32 only believes it got there. Serial-bus servos do report position and load.
- **Rotate continuously**, except the *continuous-rotation* type, in which the pulse sets the speed and direction (1500 µs is stop, and has to be trimmed) and there is no position at all.

> [!warn] A servo that stalls against a stop, or pushes a load it cannot move, draws high current and gets hot. Move arms and flaps with fingers clear: a hobby servo of a standard size can pinch.

> [!key] A servo takes a 50 Hz pulse whose width, 500 to 2500 µs, sets the angle; the ESP32 makes it with LEDC at 50 Hz and 14 bits or fewer, steady even under Wi-Fi load. Give it its own 5 V supply with a shared ground and a bulk capacitor, keep the command inside the mechanical limits, and move gradually if you want smooth motion.`,
  ideas: [
    'A servo contains a motor, gears, a position sensor and its own control loop: you command an angle, not a speed.',
    'The angle is the width of a pulse repeated every 20 ms: about 1000 to 2000 µs, up to 500 to 2500 µs on many servos; the safe range depends on the servo.',
    'LEDC at 50 Hz and 14 bits gives 1.2 µs steps, jitter-free even during Wi-Fi traffic; 16 bits does not exist on the S2, S3, C3 and C2.',
    'A servo needs its own 5 V supply with a shared ground and a bulk capacitor; its current steps reset an ESP32 powered from the same rail.'
  ],
  pitfalls: [
    'Power the servo from the 3V3 pin — It gives a small fraction of the current the servo wants at start, and the board resets. Use a separate 5 V supply with the ground joined.',
    'Send 500 to 2500 µs to every servo — The mechanical stops of many servos lie inside that range. Past them the servo buzzes against the stop, overheats and strips gears.',
    'A servo moves smoothly if I send the target — It runs at full speed to the new position. Smooth motion comes from sending many small steps over time.'
  ],
  terms: [
    { term: 'Hobby servo', also: ['RC servo', 'servo motor (model)'], def: 'A small motor, gearbox and position sensor with a control board in one case, that turns to the angle given by the width of a pulse repeated every 20 ms.' },
    { term: 'Pulse width', also: ['pulse width command', 'servo pulse'], def: 'The duration of the high pulse in each 20 ms period. About 1000 µs, 1500 µs and 2000 µs mean one end, the centre and the other end of the travel.' },
    { term: 'Continuous-rotation servo', also: ['modified servo'], def: 'A servo without its end stop and position sensor feedback: the pulse width sets speed and direction, with about 1500 µs meaning stop, and there is no position.' },
    { term: 'Dead band', also: ['deadband'], def: 'The small difference between commanded and measured angle that a servo ignores to avoid hunting. Pulse changes smaller than it make no movement.' },
    { term: 'Stall current', also: ['holding current'], def: 'The large current a servo draws when the load or an end stop prevents it from reaching its commanded angle. It heats the motor and sags the supply.' }
  ],
  sim: 'dm-servo',
  formulas: [
    {
      name: 'Pulse width for an angle',
      expr: 'us = umin + (umax - umin)*a/pi',
      tex: 't = t_{\\min} + (t_{\\max} - t_{\\min})\\,\\frac{a}{180^{\\circ}}',
      vars: {
        us: { name: 'pulse width', q: 'time', unit: 'µs', tex: 't' },
        umin: { name: 'pulse for 0°', q: 'time', unit: 'µs', value: 600, tex: 't_{\\min}' },
        umax: { name: 'pulse for 180°', q: 'time', unit: 'µs', value: 2400, tex: 't_{\\max}' },
        a: { name: 'angle', q: 'angle', unit: '°', value: 90, min: 0, max: 180, tex: 'a' }
      },
      solveFor: 'us',
      note: 'Linear between the two end pulses, for a servo that turns 180° over them. Find tmin and tmax for your servo by moving in small steps until it just stops responding, then back off a little.',
      stories: { us: 'A servo moves 180° between {umin} and {umax}. What pulse puts it at {a}?', a: 'A servo moves 180° between {umin} and {umax}. A pulse of {us} puts it at what angle?' }
    },
    {
      name: 'LEDC duty value for a pulse',
      expr: 'D = t*f*2^bits',
      tex: 'D = t\\,f\\,2^{n}',
      vars: {
        D: { name: 'duty value', q: 'count', tex: 'D' },
        t: { name: 'pulse width', q: 'time', unit: 'µs', value: 1500, tex: 't' },
        f: { name: 'PWM frequency', q: 'frequency', unit: 'Hz', value: 50, tex: 'f' },
        bits: { name: 'resolution', q: 'count', value: 14, min: 8, max: 14, int: true, tex: 'n' }
      },
      solveFor: 'D',
      note: 'The number to write to the duty register for a pulse. One step is 1/(f 2^n) seconds: 1.22 µs at 50 Hz and 14 bits, 78 µs at 8 bits.',
      stories: { D: 'A servo signal of {f} at {bits} bits needs a pulse of {t}. What duty value is written?' }
    }
  ],
  examples: [
    {
      title: 'How fine can the angle be?',
      q: 'A servo turns 180° over pulses from 600 to 2400 µs. The signal is made by LEDC at 50 Hz. What is the smallest angle step at 14 bits and at 8 bits?',
      steps: [
        'The span is 1800 µs for 180°: 10 µs per degree.',
        { text: 'One duty step at 14 bits:', tex: '\\frac{20000\\,\\mu\\mathrm{s}}{16384} = 1.22\\,\\mu\\mathrm{s} \\Rightarrow 0.12^{\\circ}' },
        { text: 'At 8 bits:', tex: '\\frac{20000\\,\\mu\\mathrm{s}}{256} = 78\\,\\mu\\mathrm{s} \\Rightarrow 7.8^{\\circ}' },
        'The servo\'s own dead band is about 5 to 10 µs (0.5 to 1°), so 14 bits is finer than the servo can follow and 8 bits visibly steps.'
      ],
      a: '0.12° at 14 bits, 7.8° at 8 bits. Use 14 bits (or the maximum the chip allows below that).'
    }
  ],
  quiz: [
    { q: 'What does the width of the pulse tell a standard hobby servo?', choices: ['The speed to turn at', 'The angle to go to', 'The torque to apply', 'How long to run'], a: 1, why: 'The pulse width is mapped to a target angle; the servo\'s own loop drives its motor until the potentiometer on the shaft agrees. (A continuous-rotation servo is different: there the width sets speed and direction.)' },
    { q: 'A program sets up the servo signal with \`ledcAttach(pin, 50, 16)\`. On which chip does it fail?', choices: ['ESP32', 'ESP32-C6', 'ESP32-S3', 'None: 16 bits is always allowed'], a: 2, why: 'The LEDC timer is 14 bits wide on the S2, S3, C3 and C2 and 20 bits on the ESP32, C6, H2, C5, C61 and P4. A program meant for any chip uses 14 bits or fewer.' },
    { q: 'The ESP32 resets whenever the servo starts moving. It is powered from the same 5 V USB supply. What is the most likely cause, and the fix?', choices: ['Noise on the signal wire: use a shorter wire', 'The servo\'s starting current sags the shared supply: give it its own 5 V supply and a bulk capacitor', 'The servo pulse is too short', 'The 3.3 V logic is too low'], a: 1, why: 'The current step of the moving servo pulls the rail down far enough to trip the ESP32 brownout detector. A separate servo supply with a shared ground, and 470 to 1000 µF across it, fixes it.' },
    { q: 'You send a servo a pulse for 90° and then one for 120°. How does it move?', choices: ['Slowly and smoothly over a second', 'At its full speed straight to 120°', 'In steps of 1°', 'It ignores the second pulse until the first is finished'], a: 1, why: 'A servo moves at its own maximum speed to each new command. To slow it down, the program must send many small angle steps over time.' }
  ],
  applications: [
    'Robot arms, grippers and camera pan-tilt heads.',
    'Flaps, latches and valves in models and small machines: any job with a limited travel.',
    'Steering and throttle in model vehicles, and moving eyes or limbs in animatronics.',
    'Dial-reading pointers and mechanical indicators.'
  ],
  sources: [
    'Arduino core for ESP32 documentation, *LEDC* API (core 3.3).',
    'MicroPython documentation, *Quick reference for the ESP32*, section *PWM* (duty_ns).',
    'Espressif, *ESP-IDF Programming Guide*, LED Control (LEDC): the timer widths of each chip.'
  ],
  choose: {
    good: ['Limited-angle positions: arms, flaps, latches, pan-tilt heads', 'Position control with no electronics beyond a pulse', 'Small loads at 5 V where the model-servo ecosystem of horns and mounts helps'],
    avoid: ['Continuous rotation at a controlled speed: use a motor with an encoder', 'Holding a heavy load for long: a stalled servo heats up', 'Anything that must know where it really is: a plain servo does not report'],
    check: ['The supply voltage range and the stall current of the servo you bought', 'The pulse range that stays inside the mechanical stops', 'Metal or plastic gears, and a servo horn that suits the load']
  },
  code: [
    {
      title: 'Sweep a servo from 0° to 180° and back',
      about: 'The servo signal is made by LEDC at 50 Hz and 14 bits: a pulse of 600 µs for 0° and 2400 µs for 180° (adjust to your servo). The program sweeps in steps of 2° every 20 ms, one new pulse per period.',
      needs: 'An ESP32 DevKit, a hobby servo (SG90 or similar) and its own 5 V supply (a 4×AA pack at 6 V also works for most), ground joined to the ESP32.',
      wiring: [['GPIO18', 'servo signal (orange or yellow)', '3.3 V logic'], ['5 V supply', 'servo red wire', 'a 470 µF capacitor across the servo supply'], ['GND', 'servo brown wire, joined to the ESP32 GND']],
      blocks: `
        when started
          set PWM on pin (18) frequency (50) resolution (14)
        forever
          for each [angle v] in (list 0 to 180 step 2)
            set servo on pin (18) to (angle) degrees :: my
            wait (0.02) seconds
          end
          for each [angle v] in (list 180 to 0 step 2)
            set servo on pin (18) to (angle) degrees :: my
            wait (0.02) seconds
          end
        end
      `,
      cpp: String.raw`
        const int SERVO_PIN = 18;
        const int FREQ = 50;                 // 20 ms period
        const int BITS = 14;                 // 16384 steps of 1.2 µs. Not 16: the timer is 14 bits wide on the S2, S3, C3 and C2
        const int MIN_US = 600;              // pulse for 0 degrees: find your servo's real limits
        const int MAX_US = 2400;             // pulse for 180 degrees

        uint32_t usToDuty(uint32_t us) {
          return (uint64_t)us * ((1u << BITS) - 1) / 20000u;
        }

        void setAngle(int deg) {
          ledcWrite(SERVO_PIN, usToDuty(map(deg, 0, 180, MIN_US, MAX_US)));
        }

        void setup() {
          ledcAttach(SERVO_PIN, FREQ, BITS);
          setAngle(90);
          delay(500);
        }

        void loop() {
          for (int a = 0; a <= 180; a += 2) { setAngle(a); delay(20); }
          for (int a = 180; a >= 0; a -= 2) { setAngle(a); delay(20); }
        }
      `,
      py: String.raw`
        from machine import Pin, PWM
        import time

        SERVO_PIN = 18
        MIN_US = 600                         # pulse for 0 degrees: find your servo's real limits
        MAX_US = 2400                        # pulse for 180 degrees

        servo = PWM(Pin(SERVO_PIN), freq=50)   # 50 Hz = 20 ms period

        def set_angle(deg):
            us = MIN_US + (MAX_US - MIN_US) * deg // 180
            servo.duty_ns(us * 1000)         # pulse width in nanoseconds

        set_angle(90)
        time.sleep_ms(500)
        while True:
            for a in range(0, 181, 2):
                set_angle(a)
                time.sleep_ms(20)
            for a in range(180, -1, -2):
                set_angle(a)
                time.sleep_ms(20)
      `,
      notes: ['With the ESP32Servo library: \`servo.setPeriodHertz(50); servo.attach(18, 600, 2400);\` then \`servo.write(angle)\`. It also uses LEDC (or MCPWM on the ESP32-S3).', 'Several servos at 50 Hz share one LEDC timer, which is fine; a PWM output at 1 kHz uses another.']
    },
    {
      title: 'Move smoothly between positions',
      about: 'The servo goes to each new target over a chosen time, with a gentle start and end, and the loop never waits: it asks the clock which angle belongs to now and sends that. Every three seconds a new target is chosen.',
      needs: 'The same servo and wiring.',
      blocks: `
        when started
          set PWM on pin (18) frequency (50) resolution (14)
          set [angle v] to (90)
          set [from v] to (90)
          set [to v] to (90)
          set [t0 v] to (milliseconds since start)
          set [dur v] to (1)
        forever
          set [f v] to (((milliseconds since start) - (t0)) / (dur))
          if <(f) > (1)> then
            set [f v] to (1)
          end
          set [angle v] to ((from) + (((to) - (from)) * ((f) * ((3) - ((2) * (f))) * (f))))
          set servo on pin (18) to (angle) degrees :: my
          wait (0.02) seconds
        end

        every (3) seconds
          set [from v] to (angle)
          set [to v] to (random (20) to (160))
          set [t0 v] to (milliseconds since start)
          set [dur v] to (1200)
      `,
      cpp: String.raw`
        const int SERVO_PIN = 18;
        const int BITS = 14;
        const int MIN_US = 600, MAX_US = 2400;

        float angle = 90, fromA = 90, toA = 90;
        uint32_t t0 = 0, dur = 1;            // start time and duration of the move, in ms

        uint32_t usToDuty(uint32_t us) { return (uint64_t)us * ((1u << BITS) - 1) / 20000u; }

        void setAngle(float deg) {
          ledcWrite(SERVO_PIN, usToDuty(MIN_US + (MAX_US - MIN_US) * deg / 180.0f));
        }

        void moveTo(float target, uint32_t ms) {
          fromA = angle; toA = target; t0 = millis(); dur = ms;
        }

        void setup() {
          ledcAttach(SERVO_PIN, 50, BITS);
          setAngle(angle);
        }

        void loop() {
          static uint32_t lastStep = 0, lastTarget = 0;
          uint32_t now = millis();
          if (now - lastTarget >= 3000) {    // a new target every three seconds
            lastTarget += 3000;
            moveTo(random(20, 161), 1200);
          }
          if (now - lastStep >= 20) {        // one new pulse per period
            lastStep += 20;
            float f = (float)(now - t0) / dur;
            if (f > 1) f = 1;
            f = f * f * (3 - 2 * f);         // smooth start and end
            angle = fromA + (toA - fromA) * f;
            setAngle(angle);
          }
        }
      `,
      py: String.raw`
        from machine import Pin, PWM
        import time
        import random

        SERVO_PIN = 18
        MIN_US, MAX_US = 600, 2400
        servo = PWM(Pin(SERVO_PIN), freq=50)

        angle = from_a = to_a = 90.0
        t0 = time.ticks_ms()
        dur = 1                              # start time and duration of the move, in ms

        def set_angle(deg):
            servo.duty_ns(int((MIN_US + (MAX_US - MIN_US) * deg / 180) * 1000))

        def move_to(target, ms):
            global from_a, to_a, t0, dur
            from_a, to_a, t0, dur = angle, target, time.ticks_ms(), ms

        last_step = last_target = time.ticks_ms()
        while True:
            now = time.ticks_ms()
            if time.ticks_diff(now, last_target) >= 3000:    # a new target every three seconds
                last_target = time.ticks_add(last_target, 3000)
                move_to(random.randint(20, 160), 1200)
            if time.ticks_diff(now, last_step) >= 20:        # one new pulse per period
                last_step = time.ticks_add(last_step, 20)
                f = min(1.0, time.ticks_diff(now, t0) / dur)
                f = f * f * (3 - 2 * f)                      # smooth start and end
                angle = from_a + (to_a - from_a) * f
                set_angle(angle)
      `,
      notes: ['The \`f * f * (3 - 2 * f)\` curve is an ease-in, ease-out: the angle changes slowly at both ends of the move, so the arm does not jerk.', 'Detaching the signal (or sending no pulses) lets many servos go limp and cuts their holding current; others keep holding. Test yours before relying on it.']
    }
  ]
},

/* ================================================================ 4 */
{
  id: 'stepper-drivers',
  parent: 'driving-motors',
  title: 'Steppers and their drivers',
  level: 2,
  short: 'A stepper moves one fixed step per pulse, so counting pulses gives position without a sensor. A driver chip (A4988, DRV8825, TMC2209) takes two logic signals, STEP and DIR, and regulates the coil currents, with microsteps between the full steps.',
  keywords: ['stepper', 'stepper motor', 'NEMA 17', 'A4988', 'DRV8825', 'TMC2209', 'STEP', 'DIR', 'ENABLE', 'microstepping', 'Vref', 'current limit', 'chopper', 'StealthChop', 'StallGuard', 'holding torque', 'bipolar', 'coil pairs'],
  prereq: ['dc-motors-and-h-bridges', 'motor-pwm-frequency', 'digital-output'],
  related: ['step-pulses-and-acceleration', 'motor-power-and-protection', 'limit-switches-and-homing', 'multi-axis-motion', 'uart', 'motors:stepper-drivers', 'motors:step-modes', 'motors:stepper-basics', 'motors:step-dir-signals', 'motors:stepper-torque-speed', 'motors:closed-loop-steppers'],
  body: `A stepper motor turns in fixed steps. The common NEMA 17 type makes 200 steps a revolution, 1.8° each. Send it one pulse per step and it goes exactly where you count, with no sensor, **as long as it never loses a step**. Inside are two coils; to turn, the currents in them must change in a set pattern and in controlled amounts. The ESP32 does not do that. A **driver** does, and the ESP32 gives it only two logic signals: **STEP** (one rising edge, one step) and **DIR** (the direction), and often a third, **ENABLE**.

### What the driver does

- **Steps on each pulse** in the direction DIR says, from a table of coil currents.
- **Regulates the current by chopping.** The driver measures the coil current through a sense resistor and switches the supply on and off at tens of kilohertz to hold the set value. That is why a motor rated at 3 V and 1.5 A per phase is run from 12 to 24 V: the high voltage only serves to push current into the inductive coil quickly, and the chopper keeps the current at the setting. A higher voltage means a higher top speed.
- **Microsteps** between full steps by driving the two coils with sine and cosine currents. Smoother, quieter, finer.

### The common drivers

| Driver | Motor supply | Current per coil | Microsteps | Note |
|---|---|---|---|---|
| A4988 | 8–35 V | about 1 A without a heat sink, 2 A with cooling | to 1/16 | cheap; audible whine |
| DRV8825 | 8.2–45 V | about 1.5 A without a heat sink, 2.5 A with cooling | to 1/32 | different microstep table from the A4988 |
| TMC2209 | 4.75–29 V | 2 A RMS, 2.8 A peak | 1/256 (interpolated) | silent StealthChop mode; settings and stall detection over UART |

These are typical limits of the usual small modules; the board's cooling decides them. Microsteps are chosen by the MS pins: on an A4988 MS1, MS2 and MS3 low is a full step, high-low-low is a half, low-high-low a quarter, high-high-low an eighth and all three high a sixteenth. On a DRV8825 the three pins give 1, 1/2, 1/4, 1/8, 1/16 and 1/32 in a different order (low-low-high is 1/16): check the datasheet.

### Set the current before you connect the motor

A trimmer sets the reference voltage Vref, and with it the coil current limit: on an A4988 it is $I = V_{ref}/(8 R_s)$, on a DRV8825 $V_{ref}/(5 R_s)$, where $R_s$ is the sense resistor marked on the module (R100 is 0.1 Ω, R050 is 0.05 Ω). Aim for 70 to 100 % of the motor's rated current per phase: less is cooler and quieter, more heats the motor and the driver. The TMC2209 takes its current over UART or from its own Vref.

### How drivers die

- **Disconnecting the motor with the driver powered.** The collapsing coil current spikes and kills the chip. Power off first.
- **No capacitor on the motor supply.** Put 100 µF or more close to the driver; the leads of a supply can ring above the driver's rating.
- **Floating control pins.** ENABLE is active low: a floating or reset ESP32 can leave the motor energised and warm. On an A4988 the RESET and SLEEP pins must be joined or driven high or the driver stays off.
- **Hot unplugging of pins** and wrong coil pairs: a motor that buzzes without turning usually has its four wires paired wrongly (test the pairs with a meter: a coil is a few ohms).

Microstepping gives smoothness and resolution, but not accuracy or strength: the extra positions are less exact, and the torque available to hold a microstep falls with the size of the increment. And the pulse rate multiplies: 600 rpm at 1/16 is 32 kHz ([[step-pulses-and-acceleration]]).

> [!key] A stepper driver turns STEP and DIR pulses into coil currents, regulated by chopping from a supply well above the motor's rated voltage. Set the current with Vref before connecting the motor, never unplug the motor while powered, and remember that microsteps smooth the motion but do not make it more accurate or stronger.`,
  ideas: [
    'A stepper moves one step per pulse, 200 per revolution for a 1.8° motor, so counting pulses gives position without a sensor, until a step is lost.',
    'The driver needs only STEP, DIR and ENABLE from the ESP32; it chops the coil current to a set limit from a supply that is much higher than the motor\'s rated voltage.',
    'The current limit is set by Vref and the sense resistor: A4988 I = Vref / (8 Rs), DRV8825 I = Vref / (5 Rs).',
    'Microstepping smooths the motion and refines the resolution, but the pulse rate rises with it and the torque and accuracy per microstep fall.'
  ],
  pitfalls: [
    'A 3 V motor must be run from 3 V — The driver chops the current to its limit, so a high supply voltage only raises the top speed. Setting the current, not the voltage, protects the motor.',
    'More microsteps mean a more accurate position — Resolution is not accuracy. The positions between full steps are weaker and less precise, and the pulse rate required rises in proportion.',
    'Unplugging a motor to check it is harmless — With the driver powered, the collapsing coil current can destroy it. Switch the supply off first.'
  ],
  terms: [
    { term: 'STEP/DIR interface', also: ['step and direction', 'pulse and direction'], def: 'The two-wire command of a stepper driver: each rising edge on STEP makes one step, and the level on DIR says which way.' },
    { term: 'Microstepping', also: ['microstep'], def: 'Driving the two coils with sine and cosine currents so that the rotor settles between the full-step positions. A 1/16 microstep divides one full step into 16 smaller moves.' },
    { term: 'Current chopping', also: ['chopper drive', 'current regulation'], def: 'Holding the coil current at a set limit by switching the supply on and off at a high frequency, so a stepper can run from a supply voltage far above its rated voltage.' },
    { term: 'Vref', also: ['reference voltage', 'current trimmer'], def: 'The voltage on the driver\'s trimmer or reference pin, which sets the coil current limit together with the sense resistor.' },
    { term: 'Holding torque', also: ['holding current'], def: 'The torque a stepper resists with its coils energised and the rotor still. Lowering the holding current after a move saves heat but weakens the hold.' }
  ],
  formulas: [
    {
      name: 'A4988 current limit from Vref',
      expr: 'I = Vref/(8*Rs)',
      tex: 'I = \\frac{V_{ref}}{8\\,R_s}',
      vars: {
        I: { name: 'coil current limit', q: 'current', unit: 'A', value: 1.2, tex: 'I' },
        Vref: { name: 'reference voltage at the trimmer', q: 'voltage', unit: 'mV', tex: 'V_{ref}' },
        Rs: { name: 'sense resistor on the module', q: 'resistance', unit: 'Ω', value: 0.068, tex: 'R_s' }
      },
      solveFor: 'Vref',
      note: 'The peak current of a coil. Read the sense resistor on your module (R050 is 0.05 Ω, R068 0.068 Ω, R100 0.1 Ω). A DRV8825 uses the same idea with a factor of 5 instead of 8: I = Vref / (5 Rs). Measure Vref with the logic supply on and the motor disconnected.',
      stories: { Vref: 'A motor is rated for 1.2 A per phase. The A4988 module has a {Rs} sense resistor. What Vref should the trimmer be set to to get {I}?', I: 'An A4988 module has {Rs} and Vref is set to {Vref}. What is its coil current limit?' }
    },
    {
      name: 'Steps per revolution with microstepping',
      expr: 'N = steps*micro',
      tex: 'N = N_{full}\\cdot m',
      vars: {
        N: { name: 'steps per revolution', q: 'count', tex: 'N' },
        steps: { name: 'full steps per revolution', q: 'count', value: 200, int: true, min: 1, tex: 'N_{full}' },
        micro: { name: 'microsteps per full step', q: 'count', value: 16, int: true, min: 1, tex: 'm' }
      },
      solveFor: 'N',
      note: 'A 1.8° motor has 200 full steps. At 1/16 microstepping, 3200 pulses make one revolution.',
      stories: { N: 'A motor with {steps} full steps per revolution runs at 1/{micro} microstepping. How many pulses make one turn?' }
    }
  ],
  examples: [
    {
      title: 'Set the Vref of two drivers',
      q: 'A NEMA 17 motor is rated for 1.5 A per phase. You want to run it at 80 % of that. What Vref do you set on an A4988 module with a 0.068 Ω sense resistor, and on a DRV8825 module with 0.1 Ω?',
      steps: [
        'Target current: $0.8 \\times 1.5 = 1.2$ A.',
        { text: 'A4988:', tex: 'V_{ref} = 8 \\cdot R_s \\cdot I = 8 \\cdot 0.068 \\cdot 1.2 = 0.65\\,\\mathrm{V}' },
        { text: 'DRV8825:', tex: 'V_{ref} = 5 \\cdot R_s \\cdot I = 5 \\cdot 0.1 \\cdot 1.2 = 0.60\\,\\mathrm{V}' },
        'Neither module will be comfortable at 1.2 A without a heat sink and some airflow: both are near their no-heat-sink limit.'
      ],
      a: 'About 0.65 V on the A4988 and 0.60 V on the DRV8825, with a heat sink.'
    }
  ],
  quiz: [
    { q: 'A stepper motor is rated 3 V, 1.5 A per phase. Why is it run from a 24 V supply through a chopper driver?', choices: ['The motor would run too slowly at 3 V', 'The high voltage pushes current into the inductive coils quickly, and the chopper holds the current to the limit', 'It is a mistake: 24 V will burn out the motor', 'The driver needs 24 V for its logic'], a: 1, why: 'The winding\'s inductance slows the rise of current; a high supply voltage overcomes it, so the torque holds up at speed. The chopper cuts the supply on and off to keep the current at the rated value.' },
    { q: 'How many pulses make one revolution of a 200-step motor at 1/16 microstepping?', choices: ['200', '1600', '3200', '6400'], a: 2, why: '200 full steps times 16 microsteps each is 3200 pulses.' },
    { q: 'What can destroy a stepper driver in a second?', choices: ['Setting Vref too low', 'Unplugging or plugging the motor while the driver is powered', 'Sending STEP pulses too slowly', 'Using 1/16 microstepping'], a: 1, why: 'The inductive current of the motor coil has nowhere to go when the connection breaks and produces a voltage spike beyond the driver\'s rating. Switch the supply off before touching the motor leads.' },
    { q: 'A motor connected to a new driver buzzes and vibrates but does not turn. What is the most likely fault?', choices: ['The firmware is too slow', 'The coil wires are paired wrongly between the two driver outputs', 'Vref is too high', 'The microstep pins are floating'], a: 1, why: 'A bipolar stepper has two coils, each a pair of wires with a few ohms between them. Wiring one coil across both outputs gives a buzz instead of rotation; check the pairs with a meter and reconnect.' }
  ],
  applications: [
    'The axes of 3D printers and small CNC machines: STEP and DIR from a controller, one driver per axis.',
    'Camera sliders, turntables, telescope mounts and antenna rotators, where position is counted not measured.',
    'Valve actuators and dosing pumps that need an exact number of steps.',
    'Pointers, dials and clock hands driven by small steppers.'
  ],
  sources: [
    'Allegro, *A4988* and Texas Instruments, *DRV8825* datasheets: the current formulas and microstep tables.',
    'Analog Devices (Trinamic), *TMC2209* datasheet: StealthChop, StallGuard and the UART interface.',
    'NEMA, *ICS 16* motion/position control motors, and the data sheet of your motor: step angle and phase current.'
  ],
  choose: {
    good: ['Position by counting steps, with a light and predictable load', 'A TMC2209 where noise matters: it is almost silent', 'Slow, high-torque positioning with no gearbox'],
    avoid: ['High speed with high acceleration: the torque falls with speed', 'Applications where a lost step is dangerous and nothing checks the position', 'Holding a load at full current for hours: motor and driver heat up'],
    check: ['The rated current per phase and the coil resistance of the motor', 'The driver\'s current and supply limits against the motor, with the cooling you will really have', 'That the pulse rate you need at your microstep setting can be generated']
  },
  code: [
    {
      title: 'Turn a stepper one revolution each way',
      about: 'STEP and DIR drive a stepper through an A4988 with its microstep pins tied high (1/16): one revolution is 3200 pulses. Each pulse is 300 µs high and 300 µs low, which is 1667 steps a second, about 31 rpm. The motor does not need a ramp at this speed, and the program waits half a second between turns.',
      needs: 'An ESP32 DevKit, an A4988 module, a NEMA 17 stepper and a 12 V supply with a 100 µF capacitor across VMOT and GND. Vref is set before the motor is connected.',
      wiring: [['GPIO18', 'A4988 STEP'], ['GPIO19', 'A4988 DIR'], ['GPIO21', 'A4988 ENABLE', 'active low'], ['3V3', 'A4988 VDD, and MS1, MS2, MS3 for 1/16, and RESET joined to SLEEP'], ['12 V supply', 'VMOT and GND, with GND joined to the ESP32 GND'], ['1A, 1B, 2A, 2B', 'the two motor coils']],
      blocks: `
        when started
          set pin (18) as [output v]
          set pin (19) as [output v]
          set pin (21) as [output v]
          set pin (21) to [LOW v]
        forever
          step (3200) times forward :: my
          wait (0.5) seconds
          step (3200) times back :: my
          wait (0.5) seconds
        end

        define step (count) times (direction)
          set pin (19) to (direction)
          repeat (count)
            set pin (18) to [HIGH v]
            wait (0.0003) seconds
            set pin (18) to [LOW v]
            wait (0.0003) seconds
          end
      `,
      cpp: String.raw`
        const int PIN_STEP = 18;
        const int PIN_DIR  = 19;
        const int PIN_EN   = 21;               // ENABLE, active low
        const int STEPS_PER_REV = 200 * 16;    // 1.8 degree motor at 1/16 (MS1, MS2, MS3 high)
        const int HALF_PERIOD_US = 300;        // 300 µs high + 300 µs low: 1667 steps a second

        void stepMotor(int steps, bool forward) {
          digitalWrite(PIN_DIR, forward);
          delayMicroseconds(5);                // DIR settles before the first step
          for (int i = 0; i < steps; i++) {
            digitalWrite(PIN_STEP, HIGH);
            delayMicroseconds(HALF_PERIOD_US);
            digitalWrite(PIN_STEP, LOW);
            delayMicroseconds(HALF_PERIOD_US);
          }
        }

        void setup() {
          pinMode(PIN_STEP, OUTPUT);
          pinMode(PIN_DIR, OUTPUT);
          pinMode(PIN_EN, OUTPUT);
          digitalWrite(PIN_EN, LOW);           // enable the driver
        }

        void loop() {
          stepMotor(STEPS_PER_REV, true);
          delay(500);
          stepMotor(STEPS_PER_REV, false);
          delay(500);
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        PIN_STEP, PIN_DIR, PIN_EN = 18, 19, 21     # EN is active low
        STEPS_PER_REV = 200 * 16                   # 1.8 degree motor at 1/16 (MS1, MS2, MS3 high)
        HALF_PERIOD_US = 300                       # 300 µs high + 300 µs low

        step = Pin(PIN_STEP, Pin.OUT)
        direction = Pin(PIN_DIR, Pin.OUT)
        enable = Pin(PIN_EN, Pin.OUT)
        enable.value(0)                            # enable the driver

        def step_motor(steps, forward):
            direction.value(1 if forward else 0)
            time.sleep_us(5)                       # DIR settles before the first step
            for _ in range(steps):
                step.value(1)
                time.sleep_us(HALF_PERIOD_US)
                step.value(0)
                time.sleep_us(HALF_PERIOD_US)

        while True:
            step_motor(STEPS_PER_REV, True)
            time.sleep_ms(500)
            step_motor(STEPS_PER_REV, False)
            time.sleep_ms(500)
      `,
      notes: ['MicroPython adds some tens of microseconds of its own to every call, so the real speed is a little lower than in C++.', 'These loops block: nothing else runs while the motor turns, and the rate is only as steady as the CPU is free. The next page shows pulses with an acceleration ramp.', 'Swap the wires of one coil to reverse the direction of rotation.']
    }
  ]
},

/* ================================================================ 5 */
{
  id: 'step-pulses-and-acceleration',
  parent: 'driving-motors',
  title: 'Step pulses and acceleration',
  level: 3,
  short: 'A stepper\'s speed is the rate of its step pulses, and it can only start at a modest rate and lose torque as it speeds up. Acceleration ramps, made from a timer, a library or the RMT hardware, keep it from stalling.',
  keywords: ['step rate', 'acceleration ramp', 'trapezoidal', 'S-curve', 'pull-in', 'pull-out', 'stall', 'lost steps', 'resonance', 'AccelStepper', 'FastAccelStepper', 'RMT', 'timer interrupt', 'steps per second', 'jerk', 'torque curve'],
  prereq: ['stepper-drivers', 'hardware-timers', 'non-blocking-timing'],
  related: ['the-rmt-peripheral', 'mcpwm', 'pwm-with-ledc', 'multi-axis-motion', 'position-control', 'motors:motion-profiles', 'motors:stepper-torque-speed', 'motors:stepper-resonance', 'motors:stepper-sizing'],
  body: `The speed of a stepper is simply the **rate of its step pulses**: pulses per second divided by steps per revolution. A 200-step motor at 1/16 microstepping needs 3200 pulses a revolution, so 600 rpm is 32 000 pulses a second, one every 31 µs. The first problem is making pulses that fast and that regular; the second is that the motor cannot follow them from a standing start.

### Why a ramp

A stationary rotor with a load has inertia. It can start at once only from a modest rate, the *pull-in* rate, a few hundred full steps a second for a small motor and less for a heavy load. Past that it must be accelerated, and the torque available for acceleration shrinks as the speed rises, because the winding's inductance and the motor's own back-EMF limit the coil current. Ask for too much acceleration or too high a speed and the rotor falls behind the field and **stalls**, and because the system is open loop, **nothing tells you**: the program believes it moved the full distance.

An acceleration ramp raises the step rate gradually. Constant acceleration $a$ (in steps per second squared) from rest gives a rate $v = \\sqrt{2 a x}$ after $x$ steps, and the distance to reach a top rate $v_{max}$ is $v_{max}^2 / (2a)$. A **trapezoidal** profile accelerates, cruises and decelerates; if the move is too short to reach top rate it becomes a triangle. An *S-curve* also limits the rate at which the acceleration changes (the jerk), and is smoother still. Between roughly 100 and 200 full steps a second many motors have a **resonance** and rattle or lose steps; microstepping, a damped mount or a quick pass through the zone cures it.

### Making the pulses

| Method | Good for | Limit |
|---|---|---|
| a loop with \`delayMicroseconds\` | constant slow speed, as on the previous page | blocks the program; jitters |
| a library called from \`loop()\` (AccelStepper) | one to a few axes, moderate rates | rate limited by how often \`loop()\` runs; any long operation causes stutter |
| a timer interrupt that makes each step | steady pulses at tens of kilohertz | the interrupt must be short; several axes need care |
| the RMT or MCPWM hardware, as in FastAccelStepper | high rates, several axes, a busy CPU | more complicated, chip-dependent |

The hardware peripherals ([[the-rmt-peripheral]], [[mcpwm]]) play out a list of pulse lengths with no CPU time, so Wi-Fi traffic cannot disturb the rhythm. In MicroPython there is no ready stepper class in the firmware: the program below paces its pulses with the tick counter, which is fine up to about two thousand steps a second; faster needs the RMT or C++.

### Choosing numbers

Start low and increase: maximum speed first, then acceleration, until the motor starts to miss steps under the real load, then back off by a third. A higher supply voltage extends the speed at which torque holds. Reflecting the load's inertia through gears and screws is explained in [[motors:stepper-sizing]].

> [!key] A stepper's speed is its step rate, and it cannot start fast: ramp the rate up and down, trapezoid or S-curve, under the torque the motor has left at that speed. A stall is silent, so keep margin; and make the pulses with a library, a timer or the RMT hardware depending on how fast and how steady they must be.`,
  ideas: [
    'Speed is the step rate: pulses per second divided by pulses per revolution; 600 rpm at 1/16 microstepping is 32 kHz.',
    'A stopped rotor can only start at a modest rate; the torque for acceleration falls with speed, so a ramp is needed.',
    'Too steep a ramp or too high a speed stalls the motor silently: an open-loop stepper cannot tell the program that it lost steps.',
    'Pulses come from a delay loop (slow), a library (moderate), a timer interrupt, or the RMT hardware (fast and steady).'
  ],
  pitfalls: [
    'The motor can start at its top speed if the driver is fast enough — The rotor\'s inertia limits the start rate whatever the electronics can deliver. Start at the pull-in rate and ramp.',
    'If a move finished, the motor is where the program thinks it is — An open-loop stepper that stalled stopped counting only in the rotor. Without a sensor or homing, the position is a belief.',
    'A software loop is good enough for pulses at any speed — Software timing jitters when anything else runs. Above a few thousand pulses a second use hardware timing.'
  ],
  terms: [
    { term: 'Step rate', also: ['pulse rate', 'steps per second'], def: 'The number of STEP pulses per second. It equals the speed in revolutions per second times the pulses per revolution.' },
    { term: 'Pull-in rate', also: ['start-stop rate', 'pull-in speed'], def: 'The highest step rate at which a stopped stepper with its load can start and stop without a ramp and without losing steps.' },
    { term: 'Pull-out torque', also: ['dynamic torque', 'torque curve'], def: 'The torque a stepper can deliver at a given speed without losing synchronism. It falls as the speed rises.' },
    { term: 'Trapezoidal profile', also: ['trapezoid ramp'], def: 'A move that accelerates at a constant rate, cruises at a top speed and decelerates at a constant rate; its speed against time is a trapezoid.' },
    { term: 'Lost steps', also: ['missed steps', 'stall'], def: 'Steps that the rotor failed to follow because the load, speed or acceleration exceeded the available torque. An open-loop stepper does not detect them.' },
    { term: 'Resonance', also: ['mid-band resonance'], def: 'A speed range, often near 100 to 200 full steps per second, where the rotor oscillates and may lose steps; microstepping and damping reduce it.' }
  ],
  sim: 'dm-stepper-ramp',
  formulas: [
    {
      name: 'Step rate for a speed',
      expr: 'f = n/60*steps*micro',
      tex: 'f = \\frac{n}{60}\\,N_{full}\\,m',
      vars: {
        f: { name: 'step rate', q: 'frequency', unit: 'kHz', tex: 'f' },
        n: { name: 'speed', unit: 'rpm', value: 600, tex: 'n' },
        steps: { name: 'full steps per revolution', q: 'count', value: 200, int: true, min: 1, tex: 'N_{full}' },
        micro: { name: 'microsteps per full step', q: 'count', value: 16, int: true, min: 1, tex: 'm' }
      },
      solveFor: 'f',
      note: 'For a lead screw or belt, first turn the linear speed into rpm with the lead or pulley circumference.',
      stories: { f: 'A {steps}-step motor at 1/{micro} microstepping turns at {n}. At what rate must the controller send step pulses?', n: 'A {steps}-step motor at 1/{micro} microstepping gets {f}. How fast does it turn?' }
    },
    {
      name: 'Steps needed to reach a speed',
      expr: 'x = v^2/(2*a)',
      tex: 'x = \\frac{v^2}{2a}',
      vars: {
        x: { name: 'steps to reach the speed', q: 'count', tex: 'x' },
        v: { name: 'step rate reached', unit: 'steps/s', value: 2000, tex: 'v' },
        a: { name: 'acceleration', unit: 'steps/s²', value: 4000, tex: 'a' }
      },
      solveFor: 'x',
      note: 'With constant acceleration from rest. A move shorter than twice this never reaches the top rate and is a triangle.',
      stories: { x: 'A stepper accelerates at {a} to {v}. How many steps does the ramp take?' }
    }
  ],
  examples: [
    {
      title: 'Does the move reach top speed?',
      q: 'A stepper at 1/16 microstepping has a maximum rate of 2000 steps/s and an acceleration of 4000 steps/s². It must move 3200 steps (one turn). Does it reach top speed, and how long does the move take?',
      steps: [
        { text: 'Ramp length:', tex: 'x = \\frac{2000^2}{2 \\cdot 4000} = 500\\ \\text{steps}' },
        'Up and down together take 1000 steps, so the remaining 2200 steps are at cruising speed.',
        { text: 'Time:', tex: 't = 2\\cdot\\frac{2000}{4000} + \\frac{2200}{2000} = 1.0 + 1.1 = 2.1\\ \\text{s}' },
        'At a constant 2000 steps/s with no ramp it would take 1.6 s, but the motor could not start at that rate.'
      ],
      a: 'Yes: 500 steps to accelerate, 2200 at 2000 steps/s, 500 to stop; the move takes 2.1 s.'
    }
  ],
  quiz: [
    { q: 'A 200-step motor at 1/8 microstepping must turn at 300 rpm. What step rate is needed?', choices: ['1 kHz', '8 kHz', '10 kHz', '80 kHz'], a: 1, why: '300 rpm is 5 revolutions a second; 200 × 8 = 1600 pulses a revolution; 5 × 1600 = 8000 pulses a second.' },
    { q: 'A stepper stalls halfway through a fast move, and the program reports the move as finished. Why does it not know?', choices: ['The driver sends an error that the program ignores', 'The system is open loop: steps are counted, not measured', 'Stalls only happen in MicroPython', 'The pulses were not sent'], a: 1, why: 'The controller counts the pulses it sent; the rotor can fall behind the field without any signal reaching the controller. A sensor, an encoder or periodic homing is the only check.' },
    { q: 'What does an acceleration ramp do?', choices: ['Makes the motor stronger', 'Raises the step rate gradually so the torque available can accelerate the rotor and its load', 'Reduces the motor current', 'Reduces the number of steps'], a: 1, why: 'The rotor can only follow a gradually rising field rate; the torque spare at each speed limits how fast the rate may rise.' },
    { q: 'Which pulse source stays steady when Wi-Fi and other tasks load the CPU?', choices: ['A delayMicroseconds loop', 'A function called from loop()', 'The RMT or MCPWM hardware', 'A print statement'], a: 2, why: 'The peripherals play out a prepared list of pulse lengths on their own clock. Software loops are delayed whenever the CPU is busy elsewhere.' }
  ],
  applications: [
    'CNC routers and 3D printers, whose controllers plan trapezoidal moves for every axis.',
    'Camera sliders that start and stop smoothly, with an S-curve to avoid shaking the camera.',
    'Pick-and-place heads, where acceleration is raised as high as the torque allows to save time.',
    'Telescope mounts, which ramp slowly to slew without losing the target.'
  ],
  sources: [
    'The *AccelStepper* library documentation (Mike McCauley): setMaxSpeed, setAcceleration, moveTo and run.',
    'The *FastAccelStepper* library readme: how the RMT and MCPWM peripherals produce the pulses.',
    'Espressif, *ESP-IDF Programming Guide*, Remote Control Transceiver (RMT) and MCPWM chapters.'
  ],
  choose: {
    good: ['A library with a ramp (AccelStepper) for one or two slow axes', 'Hardware pulses (FastAccelStepper, RMT) for faster or several axes', 'A trapezoid with margin: the speed and acceleration you tested minus a third'],
    avoid: ['Starting at the top speed whatever the driver can do', 'Software timing for kilohertz pulses on a busy ESP32', 'Resonance speed as a cruising speed'],
    check: ['The motor\'s torque at the speed you ask for, at your supply voltage', 'What the load inertia asks of the acceleration', 'Whether any other task can delay your pulse source']
  },
  code: [
    {
      title: 'Move a stepper out and back with acceleration',
      about: 'One revolution out and back at 1/16 microstepping, with a top rate of 2000 steps a second and an acceleration of 4000 steps a second squared. The C++ version uses the AccelStepper library, which works out the ramp and calls for each step as it falls due. The MicroPython version computes the same ramp by hand: the rate at each step is the smaller of the cruise rate and the rates the start and the end of the move allow.',
      needs: 'The wiring of the previous page: an A4988, a NEMA 17 and a 12 V supply.',
      libs: ['AccelStepper'],
      wiring: [['GPIO18', 'A4988 STEP'], ['GPIO19', 'A4988 DIR'], ['GPIO21', 'A4988 ENABLE', 'active low']],
      blocks: `
        when started
          set stepper STEP pin (18) DIR pin (19) enable pin (21) :: motion
          set stepper maximum speed (2000) steps per second :: motion
          set stepper acceleration (4000) steps per second per second :: motion
        forever
          move stepper to position (3200) :: motion
          repeat until <stepper arrived? :: motion>
            run stepper :: motion
          end
          wait (0.5) seconds
          move stepper to position (0) :: motion
          repeat until <stepper arrived? :: motion>
            run stepper :: motion
          end
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        #include <AccelStepper.h>

        const int PIN_STEP = 18;
        const int PIN_DIR  = 19;
        const int PIN_EN   = 21;                       // ENABLE, active low
        const long STEPS_PER_REV = 200L * 16;          // 1/16 microstepping

        AccelStepper stepper(AccelStepper::DRIVER, PIN_STEP, PIN_DIR);

        void setup() {
          stepper.setEnablePin(PIN_EN);
          stepper.setPinsInverted(false, false, true); // direction, step, enable (active low)
          stepper.enableOutputs();
          stepper.setMaxSpeed(2000);                   // steps per second
          stepper.setAcceleration(4000);               // steps per second per second
          stepper.moveTo(STEPS_PER_REV);
        }

        void loop() {
          if (stepper.distanceToGo() == 0) {           // arrived: pause, then go the other way
            delay(500);
            stepper.moveTo(stepper.currentPosition() == 0 ? STEPS_PER_REV : 0);
          }
          stepper.run();                               // call as often as possible: makes a step when one is due
        }
      `,
      py: String.raw`
        from machine import Pin
        from math import sqrt
        import time

        PIN_STEP, PIN_DIR, PIN_EN = 18, 19, 21       # EN is active low
        STEPS_PER_REV = 200 * 16                     # 1/16 microstepping
        V_MAX = 2000                                 # steps per second
        ACCEL = 4000                                 # steps per second per second
        V_START = 100                                # steps per second: the lowest rate used

        step = Pin(PIN_STEP, Pin.OUT)
        direction = Pin(PIN_DIR, Pin.OUT)
        Pin(PIN_EN, Pin.OUT).value(0)                # enable the driver

        def move(steps, forward):
            direction.value(1 if forward else 0)
            time.sleep_us(5)
            due = time.ticks_us()
            for i in range(steps):
                # v = sqrt(2 a x): the rate allowed by the distance from the start and from the end
                rate = min(V_MAX, sqrt(2 * ACCEL * (i + 1)), sqrt(2 * ACCEL * (steps - i)))
                rate = max(rate, V_START)
                step.value(1)
                time.sleep_us(3)                     # pulse width
                step.value(0)
                due = time.ticks_add(due, int(1000000 / rate))
                while time.ticks_diff(due, time.ticks_us()) > 0:
                    pass                             # wait for the next step to fall due

        while True:
            move(STEPS_PER_REV, True)
            time.sleep_ms(500)
            move(STEPS_PER_REV, False)
            time.sleep_ms(500)
      `,
      notes: ['AccelStepper makes its steps from loop(), so any delay in loop() delays the motor. Here the only pause is at the end of a move, where the motor is at rest.', 'To go faster than a few thousand steps a second, or to run several axes at once, use FastAccelStepper (it makes pulses with the RMT or MCPWM peripherals) or an RMT program.']
    }
  ]
},

/* ================================================================ 6 */
{
  id: 'brushless-motors-and-escs',
  parent: 'driving-motors',
  title: 'Brushless motors and ESCs',
  level: 2,
  short: 'A brushless motor has no brushes: its three windings must be switched in step with the rotor by electronics. For model and drone motors that is an ESC taking a 1000 to 2000 µs throttle pulse, which an ESP32 makes like a servo signal, after arming it.',
  keywords: ['brushless', 'BLDC', 'ESC', 'electronic speed controller', 'KV', 'outrunner', 'inrunner', 'arming', 'throttle', 'DShot', 'Oneshot125', 'BEC', 'six-step', 'trapezoidal commutation', 'Hall sensor', 'sensorless', 'LiPo', 'propeller'],
  prereq: ['dc-motors-and-h-bridges', 'servos', 'motor-pwm-frequency'],
  related: ['field-oriented-control', 'mcpwm', 'the-rmt-peripheral', 'fans-and-pwm-control', 'motor-power-and-protection', 'lithium-cells', 'motors:bldc-motor', 'motors:esc-drivers', 'motors:hall-commutation', 'motors:sensorless-control', 'motors:bldc-selection', 'motors:inrunner-outrunner'],
  body: `A brushless motor swaps the mechanical commutator of a brushed motor for electronics. The rotor carries permanent magnets; the stator has **three windings**; and something must switch the current between the windings in step with the rotor, or it will not turn. That something is a three-phase inverter of six transistors with logic that knows where the rotor is. No brushes means long life, high efficiency and high speed, and the price is that the motor cannot be driven by two wires and a battery.

### How the controller knows the rotor position

- **Hall sensors.** Three small sensors in the stator read the magnets. Six combinations of their outputs tell the controller which two windings to energise. It works from standstill, which is why e-bikes and many fans use them.
- **Sensorless.** The unpowered third winding shows the rotor's back-EMF; the controller watches it cross zero. Model-aircraft and drone ESCs work this way. It needs the rotor already moving, so the start is a little jerky, and very slow speeds are rough.

The usual way to switch is **six-step** commutation: at each moment two windings conduct, the third floats, and the pair changes every 60 electrical degrees. It is simple and efficient, but the torque ripples. Smooth sinusoidal drive is the subject of [[field-oriented-control]].

### The ESC: someone else does it

For model-size motors you do not build the inverter; you buy an **electronic speed controller** (ESC), a small board with six MOSFETs and a microcontroller, and tell it only how fast to go. The command is the same signal as a servo's: a pulse of **1000 µs for stopped to 2000 µs for full throttle**, repeated at 50 Hz (many ESCs accept faster rates up to a few hundred hertz). Faster protocols exist: Oneshot125 uses pulses of 125 to 250 µs, and **DShot** sends the throttle as a 16-bit digital frame (11 bits of throttle, one telemetry request, a 4-bit checksum) at 150, 300 or 600 kbit/s, which the ESP32's RMT peripheral can generate ([[the-rmt-peripheral]]).

**Arming.** A safe ESC refuses to run until it has seen the minimum throttle pulse for a second or two at power-up (it beeps to confirm), so that it cannot jump into life when a signal is missing. The program therefore starts the signal at 1000 µs *before* anything else and holds it. Some ESCs must also learn their throttle range once: follow the maker's calibration steps. The red wire of the ESC's servo lead may carry 5 V from a battery eliminator circuit (BEC); leave it unconnected unless it is meant to power the ESP32, and never join it to USB power.

**Numbers.** A motor's **KV** is its no-load speed per volt: a 1000 KV motor on a 3-cell LiPo pack (about 11.1 V) idles near 11 000 rpm and turns lower under load. Low-KV motors turn big propellers slowly; high-KV motors turn small ones fast. Swapping any two of the three motor wires reverses the direction.

> [!warn] A brushless motor on a propeller can hurt you badly, and an ESC can deliver tens of amperes. Test with **no propeller**, clamp the motor, keep your hands clear, connect the battery last with the throttle at minimum and give the system a physical disconnect. Lithium polymer packs burn if shorted, punctured or overcharged: charge them only with a proper balance charger and never leave them unattended.

> [!key] A brushless motor needs electronic commutation from rotor position (Hall sensors or back-EMF). For model motors an ESC does it, taking a 1000 to 2000 µs pulse like a servo's: the ESP32 must arm it with the minimum pulse first, then raise the pulse. Respect the energy in the battery and the propeller.`,
  ideas: [
    'A brushless motor has three windings and permanent magnets; electronics must commutate it from the rotor position, found by Hall sensors or by the back-EMF.',
    'An ESC contains the inverter and the logic; it takes a servo-style throttle pulse of 1000 to 2000 µs at 50 Hz, or a faster pulse or digital DShot frame.',
    'The ESC must be armed: it wants to see the minimum throttle pulse for a second or two before it will run.',
    'KV is no-load rpm per volt, and swapping any two motor wires reverses the direction; always test without the propeller.'
  ],
  pitfalls: [
    'Brushless motors can be connected to a battery like brushed ones — Without electronic commutation a brushless motor only twitches. It needs an ESC or a driver.',
    'The ESC is broken: it only beeps — Beeps while armed mean it is waiting for a valid minimum throttle signal. Start the pulse at 1000 µs first and keep sending it.',
    'It is safe to test with the propeller on — A propeller of even a small motor can cut deeply and the motor can start without warning. Remove it for every test.'
  ],
  terms: [
    { term: 'ESC', also: ['electronic speed controller'], def: 'A board with a three-phase inverter and a microcontroller that commutates a brushless motor and sets its speed from a throttle signal, usually a pulse of 1000 to 2000 µs.' },
    { term: 'KV rating', also: ['motor KV', 'rpm per volt'], def: 'The no-load speed of a brushless motor per volt applied: a 1000 KV motor turns about 1000 rpm for every volt. It is not a quality figure.' },
    { term: 'Arming', also: ['ESC arming'], def: 'The safety step in which an ESC must see the minimum throttle signal for a second or two before it accepts commands.' },
    { term: 'Six-step commutation', also: ['trapezoidal commutation', 'block commutation'], def: 'Driving a brushless motor by energising two of its three windings at a time and changing the pair every 60 electrical degrees. Simple and efficient, with some torque ripple.' },
    { term: 'DShot', def: 'A digital ESC protocol that sends the throttle as a 16-bit frame (11 bits of throttle, a telemetry request and a 4-bit checksum) at 150, 300 or 600 kbit/s instead of a timed pulse.' },
    { term: 'BEC', also: ['battery eliminator circuit'], def: 'A small regulator in many ESCs that gives 5 V from the main battery to power a receiver or controller.' }
  ],
  sim: 'dm-commutation',
  formulas: [
    {
      name: 'No-load speed from KV',
      expr: 'n = kv*V',
      tex: 'n_0 = K_V\\,V',
      vars: {
        n: { name: 'no-load speed', unit: 'rpm', tex: 'n_0' },
        kv: { name: 'motor KV', unit: 'rpm/V', value: 1000, tex: 'K_V' },
        V: { name: 'battery voltage', q: 'voltage', unit: 'V', value: 11.1, tex: 'V' }
      },
      solveFor: 'n',
      note: 'A motor under load turns more slowly, often 70 to 90 % of this. A LiPo cell is 3.7 V nominal and 4.2 V full, so a 3-cell pack is 11.1 V nominal and 12.6 V charged.',
      stories: { n: 'A {kv} brushless motor is run from a {V} battery. What is its no-load speed?', kv: 'A brushless motor turns {n} with no load on {V}. What is its KV rating?' }
    }
  ],
  examples: [
    {
      title: 'Will the motor suit the ESC and the battery?',
      q: 'A 920 KV outrunner is to be run from a 3-cell LiPo pack (11.1 V nominal, 12.6 V full) with a 30 A ESC. What are the no-load speed range and what must you check for current?',
      steps: [
        { text: 'Nominal:', tex: '920 \\cdot 11.1 \\approx 10\\,200\\ \\text{rpm}' },
        { text: 'Full pack:', tex: '920 \\cdot 12.6 \\approx 11\\,600\\ \\text{rpm}' },
        'Under load the speed is lower, perhaps 8000 to 9000 rpm at the nominal voltage.',
        'Check the motor\'s maximum continuous current and the current the propeller makes it draw: the propeller load rises steeply with speed, and the ESC must be rated above that current.'
      ],
      a: 'About 10 200 rpm unloaded at 11.1 V, 11 600 rpm with a full pack. The current, not the speed, picks the ESC.'
    }
  ],
  quiz: [
    { q: 'An ESC beeps steadily and the motor does not turn when the program starts. What is likely missing?', choices: ['A bigger battery', 'A valid minimum-throttle signal so it can arm', 'A resistor on the signal wire', 'A brush'], a: 1, why: 'Most ESCs refuse to run until they see the minimum pulse (about 1000 µs) for a second or two. The program should send it from the start and hold it until the arming tones finish.' },
    { q: 'A 1400 KV motor runs from a 4-cell pack at 14.8 V. What is its approximate no-load speed?', choices: ['9500 rpm', '20 700 rpm', '5600 rpm', '1400 rpm'], a: 1, why: 'KV is rpm per volt: 1400 × 14.8 is about 20 700 rpm with no load.' },
    { q: 'How do you reverse a brushless motor driven by an ESC?', choices: ['Swap the battery wires', 'Swap any two of the three motor wires', 'Send a 3000 µs pulse', 'Swap the signal and ground'], a: 1, why: 'Exchanging two phases reverses the rotating field. (Many ESCs can also reverse in software.) Swapping the battery wires destroys the ESC.' },
    { q: 'What is the first rule when testing a new brushless motor on the bench?', choices: ['Use the biggest propeller to load it', 'Remove the propeller and clamp the motor', 'Connect the battery with the throttle at maximum', 'Test it in a closed box'], a: 1, why: 'A spinning propeller can injure deeply, and an ESC powered at a high throttle will start the motor at once. Remove the propeller, clamp the motor and connect the battery with the throttle at minimum.' }
  ],
  applications: [
    'Quadcopters, aircraft and boats, where an ESP32 flight or radio controller sends throttle to several ESCs.',
    'Electric skateboards, scooters and small vehicles with Hall-sensored drives.',
    'High-speed fans, pumps and spindles with a built-in or external brushless driver.',
    'Camera gimbals, which use brushless motors driven by field-oriented control.'
  ],
  sources: [
    'The ESC maker\'s manual: the arming and calibration procedure and the accepted pulse range.',
    'Texas Instruments application notes on sensored and sensorless brushless motor control.',
    'The Betaflight project documentation on DShot and Oneshot ESC protocols.'
  ],
  choose: {
    good: ['A ready ESC for propellers, wheels and fans where only speed is wanted', 'Hall-sensored drives where the motor must start under load', 'A brushless motor where life, efficiency and power density matter'],
    avoid: ['Building your own inverter for a first project', 'Removing the safety of arming', 'Propellers on the bench'],
    check: ['The ESC\'s current rating above what the propeller makes the motor draw', 'The cell count and voltage the ESC accepts', 'The throttle signal it understands: pulse width, Oneshot or DShot']
  },
  code: [
    {
      title: 'Arm an ESC and run the motor slowly',
      about: 'The signal is a servo-style pulse made by LEDC at 50 Hz and 14 bits. The program holds 1000 µs for three seconds so the ESC can arm, raises the pulse slowly to 1150 µs (a low throttle), holds it for three seconds, then ramps back down and stays at 1000 µs. The limit is deliberately low: raise it only when the test setup is safe.',
      needs: 'An ESC, a brushless motor clamped down with NO propeller, a suitable battery for the ESC, and an ESP32 powered from USB. The ESC signal ground is joined to the ESP32 GND.',
      wiring: [['GPIO18', 'ESC signal wire (white or yellow)', '3.3 V pulses'], ['GND', 'ESC signal ground (brown or black)'], ['ESC red wire (BEC 5 V)', 'leave unconnected', 'never join it to USB power']],
      blocks: `
        when started
          set PWM on pin (18) frequency (50) resolution (14)
          set [us v] to (0)
          set ESC pulse (1000) microseconds :: motion
          wait (3) seconds
          repeat (150)
            change [us v] by (1)
            set ESC pulse ((1000) + (us)) microseconds :: motion
            wait (0.03) seconds
          end
          wait (3) seconds
          repeat (150)
            change [us v] by (-1)
            set ESC pulse ((1000) + (us)) microseconds :: motion
            wait (0.03) seconds
          end
          set ESC pulse (1000) microseconds :: motion
      `,
      cpp: String.raw`
        const int ESC_PIN = 18;
        const int BITS = 14;                 // 16384 steps in 20 ms; 16 bits does not exist on the S2, S3, C3 and C2
        const int MIN_US = 1000;             // stopped (and the arming signal)
        const int MAX_US = 1150;             // a low throttle limit for the first test

        void setEsc(int us) {                // pulse width in microseconds
          ledcWrite(ESC_PIN, (uint64_t)us * ((1u << BITS) - 1) / 20000u);
        }

        void setup() {
          ledcAttach(ESC_PIN, 50, BITS);
          setEsc(MIN_US);                    // arming: the minimum pulse, held
          delay(3000);
          for (int us = MIN_US; us <= MAX_US; us++) { setEsc(us); delay(30); }   // slow rise
          delay(3000);
          for (int us = MAX_US; us >= MIN_US; us--) { setEsc(us); delay(30); }   // slow fall
          setEsc(MIN_US);
        }

        void loop() {
          setEsc(MIN_US);                    // keep sending the stop pulse
          delay(20);
        }
      `,
      py: String.raw`
        from machine import Pin, PWM
        import time

        ESC_PIN = 18
        MIN_US = 1000                        # stopped (and the arming signal)
        MAX_US = 1150                        # a low throttle limit for the first test

        esc = PWM(Pin(ESC_PIN), freq=50)     # 50 Hz = 20 ms period

        def set_esc(us):                     # pulse width in microseconds
            esc.duty_ns(us * 1000)

        set_esc(MIN_US)                      # arming: the minimum pulse, held
        time.sleep(3)
        for us in range(MIN_US, MAX_US + 1):
            set_esc(us)                      # slow rise
            time.sleep_ms(30)
        time.sleep(3)
        for us in range(MAX_US, MIN_US - 1, -1):
            set_esc(us)                      # slow fall
            time.sleep_ms(30)
        set_esc(MIN_US)

        while True:
            set_esc(MIN_US)                  # keep sending the stop pulse
            time.sleep_ms(20)
      `,
      notes: ['Some ESCs need their throttle range learned once (full throttle at power-up, then minimum): follow the maker\'s procedure rather than guessing.', 'The ESP32 should stop sending pulses only after the ESC is disconnected; a motor that loses its signal may keep the last throttle or cut out, depending on the ESC.']
    }
  ]
},

/* ================================================================ 7 */
{
  id: 'field-oriented-control',
  parent: 'driving-motors',
  title: 'Field-oriented control',
  level: 3,
  short: 'Field-oriented control (FOC) drives a brushless motor with smooth sinusoidal currents steered by the measured rotor angle, so torque is smooth even at very low speed. It needs an angle sensor, three PWM outputs and a loop that runs thousands of times a second; SimpleFOC does it on an ESP32.',
  keywords: ['FOC', 'field-oriented control', 'vector control', 'SimpleFOC', 'Clarke', 'Park', 'd axis', 'q axis', 'sinusoidal commutation', 'space vector', 'gimbal motor', 'AS5600', 'magnetic encoder', 'torque ripple', 'electrical angle', 'pole pairs', 'smart knob'],
  prereq: ['brushless-motors-and-escs', 'mcpwm', 'hardware-timers'],
  related: ['encoders-and-speed', 'position-control', 'the-loop-task-and-two-cores', 'i2c', 'spi', 'pid-control', 'motors:foc-control', 'motors:vector-control-vfd', 'motors:bldc-motor', 'motors:hall-sensors', 'motors:absolute-encoders'],
  body: `Six-step commutation ([[brushless-motors-and-escs]]) drives two windings at a time and jumps every 60 electrical degrees. The torque comes in lumps, the motor hums, and at low speed it cogs. **Field-oriented control** drives all three windings with smooth sinusoidal currents whose phase is steered by the *measured* rotor angle, so that the magnetic field of the stator is always at the best angle, 90 electrical degrees ahead of the rotor's own field. The result is smooth torque from standstill, very quiet running, and torque you can command directly.

### The idea in four steps, repeated thousands of times a second

1. **Measure the rotor angle** with an absolute sensor, most often a magnetic encoder chip (a 12-bit AS5600 over I2C, a 14-bit AS5048 over SPI or similar) looking at a magnet on the shaft.
2. **Choose a current vector** in the rotor's own frame: a **q** component across the rotor's field that makes torque, and a **d** component along it that is held at zero for most motors. Torque is then $T = K_t I_q$: you command torque by commanding $I_q$.
3. **Rotate** that vector by the electrical angle into the stator frame (the inverse Park transform) and convert to three phase values (inverse Clarke, or space-vector modulation).
4. **Write three PWM duty values** to the half-bridges of the driver. In a full implementation the phase currents are measured, transformed the other way, and two PI controllers keep $I_d$ and $I_q$ on target.

The electrical angle is the mechanical angle times the **pole pairs** $p$ (a motor with 14 magnets has 7 pole pairs), so the electrical frequency is $f_e = np/60$. A 7-pole-pair motor at 3000 rpm has $f_e = 350$ Hz, and the loop must update many times per electrical cycle: twenty updates is a minimum, so at least 7 kHz.

### What the ESP32 brings, and what it does not

Three PWM outputs with hardware dead time are what MCPWM is for ([[mcpwm]]; the ESP32, S3, P4 have two units, the C5, C6 and H2 one, the C3 none). Two cores allow the control loop to run alone on one of them. Against that, the ADC is noisy and slow for current sensing, so the popular open-source **SimpleFOC** library on the ESP32 usually runs in *voltage mode*: it sets the voltage vector without a current loop, which is simple and works well for gimbal-type motors that can take their current limit. Current sensing is possible with an external amplifier.

You need a **three-phase driver**: a board with three half-bridges (for example a DRV8313-based board) and a supply that suits the motor, 12 V being usual for gimbal motors. The loop function must be called as fast as possible: no \`delay()\`, no blocking Wi-Fi calls in the same task ([[the-loop-task-and-two-cores]]). MicroPython is too slow for it.

### When it is worth it

Gimbals, robot joints, haptic knobs (the detents are made in software), quiet fans and pumps, and anything that must hold torque at standstill or turn very slowly. For a propeller or a fan at speed an ESC is simpler and good enough.

> [!warn] The first run is the dangerous one: a wrong pole-pair count, a sensor that reads backwards or a magnet that is off-centre makes the motor run away or buzz at high current. Use a bench supply with a current limit, a low \`voltage_limit\`, no load on the shaft, and keep fingers clear.

> [!key] FOC drives the three windings with sinusoidal currents steered by the measured rotor angle, so torque is smooth and commandable down to standstill. It needs an angle sensor, three PWM outputs (MCPWM) and a loop of several kilohertz; SimpleFOC provides it in C++, MicroPython cannot.`,
  ideas: [
    'FOC steers sinusoidal currents by the measured rotor angle so the stator field is always 90 electrical degrees ahead of the rotor: smooth torque from standstill.',
    'Torque is proportional to the q-axis current; the d-axis current is held at zero for most motors.',
    'The electrical angle is the mechanical angle times the pole pairs; the loop must update many times per electrical cycle, at least 20.',
    'The ESP32 has MCPWM for three-phase PWM and two cores for the loop; SimpleFOC usually runs in voltage mode without a current loop.'
  ],
  pitfalls: [
    'FOC is simply a better ESC — It needs a rotor angle sensor and a very fast, uninterrupted loop. For a propeller at speed an ESC is simpler and good enough.',
    'A delay() in the loop just slows things a bit — The FOC function must run thousands of times a second. A delay makes the field fall behind the rotor, and the motor buzzes, stalls or runs away.',
    'Pole pairs do not matter — With the wrong count the electrical angle is wrong and the motor either jitters or does not turn. Count the magnets and divide by two.'
  ],
  terms: [
    { term: 'Field-oriented control', also: ['FOC', 'vector control'], def: 'A way of driving a motor in which the current is split into a torque part and a flux part in the rotor\'s own rotating frame, and steered by the measured rotor angle to give smooth torque.' },
    { term: 'd and q axes', also: ['direct and quadrature axis', 'd-q frame'], def: 'The two axes of the rotor\'s rotating frame: d along the rotor\'s magnetic field and q at 90° to it. Current on q makes torque; current on d only strengthens or weakens the field.' },
    { term: 'Park and Clarke transforms', also: ['Clarke transform', 'Park transform', 'dq transform'], def: 'Two coordinate changes: Clarke turns three phase quantities into two perpendicular ones, and Park rotates those by the rotor angle into the d and q axes.' },
    { term: 'Pole pairs', also: ['pole-pair count', 'magnet pairs'], def: 'The number of north-south magnet pairs on the rotor. The electrical angle is the mechanical angle times the pole pairs.' },
    { term: 'Magnetic encoder', also: ['absolute magnetic angle sensor', 'AS5600'], def: 'A chip that reads the direction of a small magnet on the shaft end and reports the absolute angle over I2C, SPI or as an analogue voltage.' }
  ],
  sim: { id: 'dm-commutation', params: { mode: 'foc' } },
  formulas: [
    {
      name: 'Electrical frequency',
      expr: 'f = n*p/60',
      tex: 'f_e = \\frac{n\\,p}{60}',
      vars: {
        f: { name: 'electrical frequency', q: 'frequency', unit: 'Hz', tex: 'f_e' },
        n: { name: 'speed', unit: 'rpm', value: 3000, tex: 'n' },
        p: { name: 'pole pairs', q: 'count', value: 7, int: true, min: 1, tex: 'p' }
      },
      solveFor: 'f',
      note: 'The control loop must run at least about twenty times faster than this. Pole pairs are half the number of magnets on the rotor: 14 magnets, 7 pole pairs.',
      stories: { f: 'A motor with {p} pole pairs turns at {n}. What is the electrical frequency the control loop must follow?' }
    },
    {
      name: 'Torque from the q-axis current',
      expr: 'T = kt*iq',
      tex: 'T = K_t\\,I_q',
      vars: {
        T: { name: 'torque', q: 'torque', unit: 'mN·m', tex: 'T' },
        kt: { name: 'torque constant', q: 'ktorque', unit: 'mN·m/A', value: 40, tex: 'K_t' },
        iq: { name: 'q-axis current', q: 'current', unit: 'A', value: 1, tex: 'I_q' }
      },
      solveFor: 'T',
      note: 'Under FOC the torque is simply proportional to the q-axis current, at any speed up to where the supply voltage runs out. The torque constant is in the motor datasheet, or equals the back-EMF constant in SI units.',
      stories: { T: 'A gimbal motor has a torque constant of {kt}. It is given {iq} of q-axis current. What torque does it make?' }
    }
  ],
  examples: [
    {
      title: 'How fast must the loop run?',
      q: 'A gimbal motor with 14 magnets is to run up to 2400 rpm. At least how often must the FOC function be called?',
      steps: [
        'Pole pairs: $14 / 2 = 7$.',
        { text: 'Electrical frequency:', tex: 'f_e = \\frac{2400 \\cdot 7}{60} = 280\\ \\text{Hz}' },
        { text: 'Twenty updates per electrical cycle:', tex: '20 \\cdot 280 = 5600\\ \\text{updates per second}' },
        'That is one call every 180 µs. A loop that also reads an I2C sensor at 400 kHz (about 100 µs per read) and prints to the serial port will not manage it: read the sensor on a fast bus and keep everything else out of the loop.'
      ],
      a: 'At least about 5.6 kHz, so every pass of the loop must take under 180 µs.'
    }
  ],
  quiz: [
    { q: 'In field-oriented control, which current produces torque?', choices: ['The d-axis current', 'The q-axis current', 'The zero-sequence current', 'The supply current'], a: 1, why: 'The q axis is perpendicular to the rotor\'s magnetic field, so a current on it pushes the rotor round. The d axis lies along the field and makes no torque in a surface-magnet motor, so it is held at zero.' },
    { q: 'A rotor has 14 magnets. How many pole pairs must be given to the control software?', choices: ['14', '28', '7', '2'], a: 2, why: 'Pole pairs are the number of north-south pairs: 14 magnets are 7 pairs. A wrong count makes the electrical angle wrong and the motor jitter or fail to turn.' },
    { q: 'Why is MicroPython unsuited to FOC?', choices: ['It cannot make PWM', 'The loop needs thousands of fast, uninterrupted updates a second, which MicroPython cannot guarantee', 'It has no floating point', 'It cannot read an I2C sensor'], a: 1, why: 'The control loop must run at 20 or more times the electrical frequency without delays. The interpreter, garbage collection and scheduled handlers make that timing unreliable.' },
    { q: 'You add a delay(10) to the loop of a working FOC program to slow the serial output. What happens?', choices: ['Nothing; delay only affects printing', 'The field falls behind the rotor and the motor jitters, buzzes or runs away', 'The motor runs more quietly', 'The motor reverses'], a: 1, why: 'The field is recomputed from the measured angle only when the FOC function is called. A 10 ms gap is a large part of an electrical cycle, so the driven field is no longer where the rotor needs it.' }
  ],
  applications: [
    'Camera gimbals, which hold a platform steady with smooth, low-speed torque.',
    'Robot arm joints and legged robots, where torque is commanded directly.',
    'Haptic knobs and dials with detents, walls and springs made in software.',
    'Quiet fans, pumps and slow, high-torque direct-drive wheels.'
  ],
  sources: [
    'The SimpleFOC project documentation (Arduino-FOC): the BLDCMotor, BLDCDriver3PWM and sensor classes.',
    'Texas Instruments and STMicroelectronics application notes on field-oriented control of permanent-magnet motors.',
    'Espressif, *ESP-IDF Programming Guide*, MCPWM chapter: three-phase PWM with dead time.'
  ],
  choose: {
    good: ['Smooth torque at low speed or from standstill: gimbals, joints, knobs', 'Quiet drives where the hum of six-step is unwanted', 'Direct torque commands for force or compliance control'],
    avoid: ['A propeller at speed, where an ESC is simpler', 'MicroPython, or a loop that must also run slow tasks', 'A first test with a heavy load and an unlimited supply'],
    check: ['That the chip has MCPWM or fast enough LEDC for three outputs, and two cores if Wi-Fi is on', 'The pole-pair count and the sensor\'s direction and resolution', 'The supply voltage and the driver\'s current rating against the motor']
  },
  code: [
    {
      title: 'Spin a gimbal motor at a set speed with SimpleFOC',
      about: 'A magnetic encoder reads the rotor angle over I2C, a three-phase driver is given three PWM pins and an enable pin, and the library does the field-oriented control in voltage mode. The loop only calls the FOC function and the outer velocity loop: nothing else may run in it.',
      needs: 'An ESP32 DevKit, a three-phase driver board on a 12 V current-limited supply, a gimbal motor with 7 pole pairs and an AS5600 board with a magnet on the shaft end.',
      libs: ['Simple FOC'],
      wiring: [['GPIO32, GPIO33, GPIO25', 'driver PWM inputs A, B, C'], ['GPIO26', 'driver enable'], ['GPIO21, GPIO22', 'AS5600 SDA and SCL (the default I2C pins)'], ['12 V supply', 'driver supply, GND joined to the ESP32 GND']],
      blocks: `
        when started
          start serial at (115200) baud
          start sensor [AS5600 v] on I2C :: motion
          start three-phase driver on pins (32) (33) (25) enable (26) supply (12) volts :: motion
          set motor pole pairs (7) and voltage limit (6) volts :: motion
          set control mode [velocity v] with P (0.2) and I (20) :: motion
          align the sensor and the motor :: motion
        forever
          run the FOC algorithm :: motion
          move motor at (10) radians per second :: motion
        end
      `,
      cpp: String.raw`
        #include <SimpleFOC.h>

        BLDCMotor motor = BLDCMotor(7);                           // 7 pole pairs (14 magnets)
        BLDCDriver3PWM driver = BLDCDriver3PWM(32, 33, 25, 26);   // PWM A, B, C and enable
        MagneticSensorI2C sensor = MagneticSensorI2C(AS5600_I2C); // SDA 21, SCL 22

        float targetVelocity = 10;                                // radians per second

        void setup() {
          Serial.begin(115200);
          sensor.init();
          motor.linkSensor(&sensor);

          driver.voltage_power_supply = 12;
          driver.init();
          motor.linkDriver(&driver);

          motor.controller = MotionControlType::velocity;
          motor.PID_velocity.P = 0.2f;
          motor.PID_velocity.I = 20;
          motor.voltage_limit = 6;                                // a low limit for the first test
          motor.LPF_velocity.Tf = 0.01f;

          motor.init();
          motor.initFOC();                                        // aligns the sensor with the motor
        }

        void loop() {
          motor.loopFOC();                                        // as often as possible: the FOC algorithm
          motor.move(targetVelocity);                             // the outer velocity loop
        }
      `,
      na: { py: 'MicroPython has no field-oriented-control library for the ESP32, and the loop must run thousands of times a second without interruption, which the interpreter cannot guarantee.' },
      notes: ['The library calls loopFOC() and move() every pass and has no delay of its own: do not add one. Run it on one core and the network on the other if the program also uses Wi-Fi.', 'If the motor jerks or runs backwards after initFOC(), check the pole-pair count and the sensor direction before raising any limit.']
    }
  ]
},

/* ================================================================ 8 */
{
  id: 'encoders-and-speed',
  parent: 'driving-motors',
  title: 'Encoders and speed measurement',
  level: 2,
  short: 'An encoder on the motor shaft turns movement into pulses. Counting them gives position; counting them over a fixed time, or timing the gap between them, gives speed. The count is quantised, so low speeds need the period method or a coarser answer.',
  keywords: ['encoder', 'quadrature', 'PPR', 'CPR', 'counts per revolution', 'gear ratio', 'Hall encoder', 'optical encoder', 'magnetic encoder', 'AS5600', 'speed measurement', 'M/T method', 'quantisation', 'PCNT', 'ESP32Encoder', 'index pulse', 'absolute encoder', 'rpm'],
  prereq: ['dc-motors-and-h-bridges', 'rotary-encoders', 'pulse-counter-pcnt'],
  related: ['position-control', 'field-oriented-control', 'interrupts', 'pulse-counting', 'measuring-frequency-and-time', 'filtering-sensor-data', 'motors:incremental-encoders', 'motors:absolute-encoders', 'motors:hall-sensors', 'motors:feedback-devices'],
  body: `A motor that only gets a PWM value is blind: it does not know whether it turned, how far or how fast. An **encoder** fixes that by sending a pulse for every small piece of rotation. The small geared motors of robots carry one built in: a magnetic disc on the motor shaft and two Hall sensors, or a slotted optical disc, that give two square waves **A and B** a quarter-period apart ([[rotary-encoders]] shows how the order of the edges gives the direction).

### Counts, pulses and the gearbox

The datasheet gives **pulses per revolution (PPR)** of one channel. Decoding all four edges of A and B (4x quadrature) gives **four counts per pulse**. The encoder usually sits on the motor shaft, *before* the gearbox, so one turn of the output shaft is the gear ratio times as many counts: an 11 PPR encoder behind a 1:30 gearbox gives 11 × 4 × 30 = **1320 counts per output revolution**, 0.27° each. Remember to count 1320, not 11, when you turn counts into angle.

| Sensor | What it gives | Typical use |
|---|---|---|
| incremental, optical or Hall (A, B, sometimes Z) | relative position and direction; Z once per turn | geared DC motors, wheels |
| absolute magnetic (AS5600, 12 bits, I2C; 14-bit SPI types) | the angle within one turn, at power-up | gimbal motors, joints, knobs |
| potentiometer on the output | the angle by ADC, limited travel | cheap arms, joysticks |

### Reading the pulses

The pulse counter peripheral counts edges in hardware at any speed ([[pulse-counter-pcnt]]); the ESP32, S2, S3, C5, C6, H2 and P4 have it, the C3, C2 and C61 do not. An interrupt on both pins and a small state table works on every chip up to a few kilohertz, as in the program below. A fast motor with a fine encoder, say 6000 rpm at 44 counts per turn, makes 4400 counts a second: fine for hardware or C++, too much for MicroPython's scheduled handlers.

### Speed from counts

There are two ways, and each is bad where the other is good.

- **Count in a fixed window** (the frequency method): speed is the counts in the last Δt divided by Δt. One count of error in a window gives a speed error of $60/(\\mathrm{CPR}\\,\\Delta t)$ rpm. With 1320 counts and Δt = 50 ms that is 0.9 rpm per count: good at speed, but at low speed the answer jumps 0, 0.9, 0, 0.9 …
- **Time between edges** (the period method): speed is one count divided by the time since the previous edge. Precise at low speed, noisy at high speed, and undefined when the motor stops.

Real controllers combine them (measure the time of the last edge inside a window: the M/T method) and then **filter** the result with a moving average or exponential filter ([[filtering-sensor-data]]), trading delay for smoothness. In a speed loop the measurement delay costs phase margin: do not filter more than you must. The simulation shows both methods side by side.

### Practical points

An encoder with open-collector outputs needs pull-ups; one powered at 5 V gives 5 V signals, which an ESP32 pin does not tolerate: power the encoder from 3.3 V or use a level shifter. Cables carrying motor current radiate noise into the encoder lines: keep them apart, twist the pairs, or use a hardware glitch filter.

> [!key] An encoder gives counts: four per pulse in quadrature, times the gear ratio for the output shaft. Counting them gives position; speed comes from counts per fixed time (good fast) or time per count (good slow), usually combined and filtered. Count with the PCNT hardware or an interrupt, and give the encoder 3.3 V signals.`,
  ideas: [
    'Quadrature decoding gives four counts per encoder pulse; behind a gearbox one output turn is the gear ratio times as many counts.',
    'An encoder on a geared motor usually sits on the motor shaft, so counts per output revolution = PPR × 4 × gear ratio.',
    'Counting in a fixed window gives a speed in steps of 60/(CPR × window) rpm; timing the gap between counts is better at low speed.',
    'The pulse counter hardware counts any rate; an interrupt works up to a few kilohertz; encoder outputs must be 3.3 V for the ESP32.'
  ],
  pitfalls: [
    'The datasheet PPR is the counts per output turn — It is pulses per motor-shaft turn for one channel. Multiply by 4 for quadrature and by the gear ratio for the output shaft.',
    'Speed from counts can be read as precisely as I like by making the window shorter — A shorter window means fewer counts per window and a coarser result: one count is 60/(CPR × window) rpm.',
    'A 5 V encoder can be wired straight to the ESP32 — The ESP32 inputs are not 5 V tolerant. Power the encoder from 3.3 V, or shift the levels.'
  ],
  terms: [
    { term: 'PPR', also: ['pulses per revolution', 'CPR', 'counts per revolution'], def: 'The number of pulses one encoder channel gives per turn of the shaft it sits on. Counts per revolution (CPR) is four times that when all edges of both channels are decoded.' },
    { term: 'Gear ratio', also: ['reduction ratio'], def: 'The number of motor turns for one turn of the output shaft: 1:30 means the motor turns 30 times. Counts per output turn grow by the same factor.' },
    { term: 'M/T method', also: ['frequency and period method'], def: 'A speed measurement that counts the encoder pulses over a window and also times the last pulse inside it, combining the accuracy of both simpler methods.' },
    { term: 'Quantisation', also: ['count granularity'], def: 'The step-like error that arises because a speed estimate is a whole number of counts per window, so it can only take values 60/(CPR × window) rpm apart.' },
    { term: 'Index pulse', also: ['Z channel', 'zero pulse'], def: 'A third encoder output that pulses once per revolution, used to find a reference position.' }
  ],
  sim: 'dm-quadrature',
  formulas: [
    {
      name: 'Speed from a count in a window',
      expr: 'n = counts/(cpr*dt)*60',
      tex: 'n = \\frac{N}{\\mathrm{CPR}\\,\\Delta t}\\cdot 60',
      vars: {
        n: { name: 'speed', unit: 'rpm', tex: 'n' },
        counts: { name: 'counts in the window', q: 'count', value: 66, int: true, tex: 'N' },
        cpr: { name: 'counts per revolution of the shaft measured', q: 'count', value: 1320, int: true, min: 1, tex: '\\mathrm{CPR}' },
        dt: { name: 'window', q: 'time', unit: 'ms', value: 50, tex: '\\Delta t' }
      },
      solveFor: 'n',
      note: 'Use the counts per revolution of the shaft you want the speed of: for the output shaft include the gear ratio. One count of change moves n by 60 / (CPR Δt).',
      stories: { n: 'An encoder with {cpr} per revolution gives {counts} in {dt}. How fast does the shaft turn?', counts: 'A shaft with {cpr} per revolution turns at {n}. How many counts arrive in {dt}?' }
    },
    {
      name: 'Counts per output revolution',
      expr: 'cpr = ppr*4*ratio',
      tex: '\\mathrm{CPR} = \\mathrm{PPR}\\cdot 4\\cdot r',
      vars: {
        cpr: { name: 'counts per output revolution', q: 'count', tex: '\\mathrm{CPR}' },
        ppr: { name: 'pulses per motor revolution, one channel', q: 'count', value: 11, int: true, min: 1, tex: '\\mathrm{PPR}' },
        ratio: { name: 'gear ratio (motor turns per output turn)', q: 'count', value: 30, min: 1, tex: 'r' }
      },
      solveFor: 'cpr',
      note: 'For a quadrature encoder decoded on all four edges. If you count only the rising edges of A, drop the factor 4.',
      stories: { cpr: 'A motor encoder gives {ppr} per turn on one channel and the gearbox is 1:{ratio}. How many counts make one output revolution?' }
    }
  ],
  examples: [
    {
      title: 'How coarse is the speed reading?',
      q: 'The encoder motor above gives 1320 counts per output revolution. The program reads the speed every 50 ms. What speed does one count correspond to, and what do you see at 20 rpm?',
      steps: [
        { text: 'One count in a window:', tex: '\\frac{60}{1320 \\cdot 0.05} = 0.91\\ \\text{rpm}' },
        { text: 'At 20 rpm the counts per window:', tex: '\\frac{20}{60}\\cdot 1320 \\cdot 0.05 = 22' },
        'So the speed reads 20 rpm only to within 1 rpm, a 5 % step: it will flicker between 19.1, 20.0 and 20.9. At 2 rpm, only 2.2 counts arrive per window and the reading jumps between 0, 1.8 and 2.7 rpm.'
      ],
      a: '0.91 rpm per count. At 20 rpm the reading steps by about 5 %; at 2 rpm it is almost useless, so use a longer window or the period method.'
    }
  ],
  quiz: [
    { q: 'An encoder gives 12 pulses per turn on channel A and is decoded on all four edges. It sits on the motor shaft of a 1:50 gearbox. How many counts per output revolution?', choices: ['12', '48', '600', '2400'], a: 3, why: '12 × 4 = 48 counts per motor turn; the motor turns 50 times per output turn: 48 × 50 = 2400.' },
    { q: 'You shorten the speed window from 100 ms to 10 ms to get a faster reading. What happens to the resolution of the speed?', choices: ['It is ten times finer', 'It is ten times coarser: one count is ten times more rpm', 'It does not change', 'The speed cannot be measured'], a: 1, why: 'One count in a window corresponds to 60/(CPR × window) rpm; a ten times shorter window makes that figure ten times larger. A faster reading costs resolution.' },
    { q: 'At very low speed, which measurement works best?', choices: ['Counts in a short fixed window', 'The time between two edges', 'Counting only the index pulse', 'The motor voltage'], a: 1, why: 'At low speed only a few counts fall in a window, so the count method jumps. Timing the gap between edges gives a precise value at every edge.' },
    { q: 'A motor encoder is powered from 5 V and its signals go straight to ESP32 pins. What is the risk?', choices: ['None', 'The 5 V outputs can damage the 3.3 V pins', 'The count is doubled', 'The direction reverses'], a: 1, why: 'ESP32 GPIOs are not 5 V tolerant. Power the encoder from 3.3 V, if it works there, or use level shifting or a resistor divider on the signals.' }
  ],
  applications: [
    'Wheeled robots that must drive straight and measure distance by odometry.',
    'Speed-controlled conveyors, pumps and winders.',
    'Position-controlled axes of small machines.',
    'Knobs and dials with software detents, read by an absolute magnetic encoder.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, Pulse Counter (PCNT): quadrature decoding and the glitch filter.',
    'ams OSRAM, *AS5600* datasheet: the 12-bit absolute magnetic position sensor.',
    'The data sheet of your motor or encoder: pulses per revolution, supply voltage and output type.'
  ],
  choose: {
    good: ['Incremental quadrature on a geared DC motor for speed and relative position', 'An absolute magnetic encoder where the angle must be known at power-up', 'PCNT hardware for fast counts; an interrupt for slow ones'],
    avoid: ['Counting only one edge of one channel: no direction and a quarter of the resolution', 'A 5 V encoder on a 3.3 V pin', 'A very short speed window at low speed'],
    check: ['Pulses per revolution on which shaft, and the gear ratio', 'The output type (push-pull or open collector) and the supply voltage', 'The count rate at your top speed against what your reader can handle']
  },
  code: [
    {
      title: 'Measure the speed of an encoder motor',
      about: 'Both encoder channels interrupt on every edge, and a small table turns each change of the pair into +1 or -1. Every 50 ms the program takes the counts since last time and prints the speed of the output shaft in rpm, smoothed with a light filter. The encoder gives 1320 counts per output revolution (11 pulses, four edges, 1:30 gearbox).',
      needs: 'An ESP32 DevKit and a geared DC motor with a Hall encoder (11 pulses per revolution, 1:30), powered at 3.3 V so that its signals are 3.3 V, with the driver of the earlier pages to turn it.',
      wiring: [['GPIO32', 'encoder channel A', 'internal pull-up'], ['GPIO33', 'encoder channel B', 'internal pull-up'], ['3V3', 'encoder supply'], ['GND', 'encoder GND']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (32) as [input with pull-up v]
          set pin (33) as [input with pull-up v]
          set [last v] to (0)
          set [filtered v] to (0)

        when pin (32) changes :: events
          decode the encoder pair on pins (32) and (33) :: my

        when pin (33) changes :: events
          decode the encoder pair on pins (32) and (33) :: my

        every (0.05) seconds
          set [delta v] to ((count) - (last))
          set [last v] to (count)
          set [rpm v] to (((delta) / ((1320) * (0.05))) * (60))
          set [filtered v] to ((filtered) + ((0.3) * ((rpm) - (filtered))))
          print (join [speed ] (round (filtered)) [ rpm])
      `,
      cpp: String.raw`
        const int PIN_A = 32;
        const int PIN_B = 33;
        const float CPR = 11 * 4 * 30;           // counts per output revolution: 11 pulses, 4 edges, 1:30
        const uint32_t WINDOW_MS = 50;

        volatile int32_t count = 0;
        volatile uint8_t prev = 0;
        // index = (previous A B) * 4 + (new A B); A leads B counts up
        const int8_t STEP_TABLE[16] = { 0, -1, 1, 0,   1, 0, 0, -1,   -1, 0, 0, 1,   0, 1, -1, 0 };

        void IRAM_ATTR onEdge() {
          uint8_t now = (digitalRead(PIN_A) << 1) | digitalRead(PIN_B);
          count += STEP_TABLE[(prev << 2) | now];
          prev = now;
        }

        void setup() {
          Serial.begin(115200);
          pinMode(PIN_A, INPUT_PULLUP);
          pinMode(PIN_B, INPUT_PULLUP);
          prev = (digitalRead(PIN_A) << 1) | digitalRead(PIN_B);
          attachInterrupt(PIN_A, onEdge, CHANGE);
          attachInterrupt(PIN_B, onEdge, CHANGE);
        }

        void loop() {
          static uint32_t last = 0;
          static int32_t lastCount = 0;
          static float filtered = 0;
          uint32_t now = millis();
          if (now - last >= WINDOW_MS) {
            last += WINDOW_MS;
            int32_t c = count;
            float rpm = (c - lastCount) / (CPR * WINDOW_MS / 1000.0f) * 60.0f;
            lastCount = c;
            filtered += 0.3f * (rpm - filtered);   // a light exponential filter
            Serial.printf("speed %.1f rpm\n", filtered);
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        PIN_A, PIN_B = 32, 33
        CPR = 11 * 4 * 30                        # counts per output revolution: 11 pulses, 4 edges, 1:30
        WINDOW_MS = 50

        a = Pin(PIN_A, Pin.IN, Pin.PULL_UP)
        b = Pin(PIN_B, Pin.IN, Pin.PULL_UP)
        count = 0
        prev = (a.value() << 1) | b.value()
        # A leads B counts up
        STEP = {(0, 2): 1, (2, 3): 1, (3, 1): 1, (1, 0): 1,
                (2, 0): -1, (3, 2): -1, (1, 3): -1, (0, 1): -1}

        def on_edge(pin):                        # a scheduled (soft) handler: fine at low speed only
            global count, prev
            now = (a.value() << 1) | b.value()
            count += STEP.get((prev, now), 0)
            prev = now

        a.irq(handler=on_edge, trigger=Pin.IRQ_RISING | Pin.IRQ_FALLING)
        b.irq(handler=on_edge, trigger=Pin.IRQ_RISING | Pin.IRQ_FALLING)

        last_count = 0
        filtered = 0.0
        while True:
            time.sleep_ms(WINDOW_MS)
            c = count
            rpm = (c - last_count) / (CPR * WINDOW_MS / 1000) * 60
            last_count = c
            filtered += 0.3 * (rpm - filtered)   # a light exponential filter
            print("speed %.1f rpm" % filtered)
      `,
      output: `
        speed 0.0 rpm
        speed 18.9 rpm
        speed 39.2 rpm
        speed 58.7 rpm
      `,
      notes: ['This uses interrupts, so it works on every chip, including the C3, which has no pulse counter. For a fast encoder use the pulse counter ([[pulse-counter-pcnt]]).', 'MicroPython handlers on the ESP32 are scheduled, not immediate: above a few kilohertz of edges they fall behind and counts are lost. Keep the motor slow, or use C++.']
    }
  ]
},

/* ================================================================ 9 */
{
  id: 'position-control',
  parent: 'driving-motors',
  title: 'Position control',
  level: 3,
  short: 'To put a DC motor at an exact position, read the encoder, compare it with the target and drive the motor with the error. A proportional-derivative loop at a fixed rate does it; the dead zone, the output limits and the speed loop inside are what make it work in practice.',
  keywords: ['position control', 'closed loop', 'P controller', 'PD', 'PID', 'following error', 'overshoot', 'dead zone', 'cascade control', 'speed loop', 'current loop', 'integral windup', 'feedforward', 'setpoint', 'trajectory', 'closed-loop stepper', 'servo drive'],
  prereq: ['encoders-and-speed', 'motor-pwm-frequency', 'non-blocking-timing'],
  related: ['pid-control', 'pid-tuning', 'sample-time-and-jitter', 'step-pulses-and-acceleration', 'stepper-drivers', 'servos', 'balancing-robots', 'motors:servo-tuning', 'motors:following-error', 'motors:motion-profiles', 'motors:closed-loop-steppers', 'motors:servo-drives'],
  body: `A DC motor given a PWM value turns, but it stops wherever friction and inertia leave it. To put the shaft at a chosen **position** the program must close a loop: read the position, subtract it from the target to get the **error**, and drive the motor with a value that grows with the error and goes to zero when it vanishes. That is *feedback*, and the encoder of the previous page is the sensor.

### The simplest loop

A **proportional** controller sets the output to $u = K_p e$. Far from the target the motor is driven hard; near it, gently. With only that, two things go wrong: the motor overshoots and swings (it has inertia, and the driving torque is still pushing when it arrives), and it stops short (small errors give outputs below the dead zone, where nothing turns). Adding a **derivative** term, proportional to the speed, acts as a brake against the approach: $u = K_p e - K_d \\dot{x}$, which damps the swing. A **minimum output** added to any nonzero command skips the dead zone, and a **deadband** of a few counts around the target avoids endless hunting. An *integral* term removes the last bit of error but needs a clamp so that it does not wind up while the motor is blocked ([[pid-control]], [[pid-tuning]]).

### Rate and limits

The loop must run at a **fixed rate**, 5 to 20 ms for a geared motor: jitter in the sample time changes the effective gains ([[sample-time-and-jitter]]). Clamp the output to ±100 % and, better, limit the maximum speed so that large errors do not send the motor at full power into the target. The cleanest way to do that is **cascade control**: an outer position loop that outputs a *speed* target, an inner speed loop that outputs PWM, and, with a shunt, an innermost current loop that limits torque. Each inner loop is faster than the one around it; the position loop with a speed limit follows a **trapezoidal** path to the target like the stepper ramps of [[step-pulses-and-acceleration]].

### Real effects

- **Following error.** In a loop whose output commands speed, a motor moving at constant speed $v$ lags the target by $v/K_v$, where $K_v$ is the position-loop gain in 1/s. A higher gain lags less, until the loop becomes unstable.
- **Resolution.** The position can only be as good as the counts: 1320 counts per turn is 0.27°.
- **Backlash.** A gearbox has play. An encoder on the motor shaft cannot see it; one on the output shaft can, but the loop then fights the play and may oscillate.
- **Stiction** makes the motor stop a little before the target and then jump: dither or a kick helps.

### Or buy the loop

A hobby servo ([[servos]]) has this loop inside. Industrial servo drives hold position, speed and current loops themselves and take step and direction pulses. A **closed-loop stepper** adds an encoder to a stepper to catch the lost steps of [[step-pulses-and-acceleration]]. The ESP32 then only plans the motion.

> [!warn] A position loop can drive a motor at full power into a stop if the sensor fails or the sign is wrong: the error never closes. Limit the output, watch for a motor that draws current without moving, and keep a physical stop switch ([[safety-in-control]]).

> [!key] Position control closes a loop: encoder, error, output. Proportional drive with a derivative brake, a fixed loop rate, a dead-zone offset and output limits are the minimum; a speed loop inside gives smooth, limited motion. Test with the output clamped low, and cut the motor if it draws current without moving.`,
  ideas: [
    'A position loop reads the encoder, forms the error from the target and drives the motor with an output that grows with the error and is zero when it vanishes.',
    'Proportional control alone overshoots and stops short in the dead zone; a derivative term damps, a minimum output skips the dead zone, and a deadband prevents hunting.',
    'The loop runs at a fixed rate with the output clamped; a cascade of position, speed and current loops gives smooth, limited motion.',
    'Following error at constant speed is v/Kv; resolution is one count; backlash and stiction limit the precision.'
  ],
  pitfalls: [
    'A higher gain always gives a more precise position — Past a point the loop oscillates or goes unstable. Raise the gain until the motion begins to ring, then back off.',
    'Zero error means the motor stops cleanly — Below the dead zone the output cannot move the shaft, and the integral term, if any, winds up and then jumps. Use a minimum output and a deadband.',
    'The loop can run whenever loop() gets to it — A variable sample time changes the derivative and integral terms. Run it on a fixed timer.'
  ],
  terms: [
    { term: 'Closed loop', also: ['feedback control'], def: 'A control arrangement in which the controller measures the result (the position) and adjusts its output according to the difference from the target.' },
    { term: 'Following error', also: ['tracking error', 'lag'], def: 'The difference between the commanded position and the actual position while the axis moves. In a simple position loop it is the speed divided by the loop gain Kv.' },
    { term: 'Cascade control', also: ['nested loops'], def: 'Loops inside loops: the outer position loop sets a speed target for a faster inner speed loop, which sets a current target for a faster current loop.' },
    { term: 'Integral windup', also: ['windup'], def: 'The build-up of the integral term while the output is saturated or the motor is blocked, which then causes a large overshoot. Prevented by clamping the integral.' },
    { term: 'Deadband', also: ['dead band', 'tolerance window'], def: 'A small range around the target in which the controller outputs nothing, so it does not hunt for the last count.' }
  ],
  sim: { id: 'dm-motor-pid', params: { mode: 'position' } },
  formulas: [
    {
      name: 'Following error of a position loop',
      expr: 'err = v/kv',
      tex: 'e = \\frac{v}{K_v}',
      vars: {
        err: { name: 'following error', unit: 'counts', tex: 'e' },
        v: { name: 'speed', unit: 'counts/s', value: 2000, tex: 'v' },
        kv: { name: 'position loop gain', q: 'rate', unit: '1/s', value: 20, tex: 'K_v' }
      },
      solveFor: 'err',
      note: 'For a loop whose output commands speed (a cascade) with no feed-forward, moving at a constant speed. Adding a speed feed-forward removes most of this error.',
      stories: { err: 'An axis moves at {v} with a position loop gain of {kv}. How far does it lag the target?', kv: 'An axis moves at {v} and lags the target by {err}. What is the position loop gain?' }
    },
    {
      name: 'Angle of one count',
      expr: 'res = 360/cpr',
      tex: '\\delta = \\frac{360^{\\circ}}{\\mathrm{CPR}}',
      vars: {
        res: { name: 'angle of one count', unit: '°', tex: '\\delta' },
        cpr: { name: 'counts per revolution of the output shaft', q: 'count', value: 1320, int: true, min: 1, tex: '\\mathrm{CPR}' }
      },
      solveFor: 'res',
      note: 'The finest position the loop can resolve; with backlash and stiction the real accuracy is coarser.',
      stories: { res: 'An output shaft gives {cpr} counts per turn. What is the angle of one count?' }
    }
  ],
  examples: [
    {
      title: 'Why does the shaft stop short?',
      q: 'A position loop uses $u = K_p e$ with $K_p = 0.1$ % of PWM per count. The motor needs at least 25 % duty to turn. How far from the target does it stop?',
      steps: [
        { text: 'The output falls below the dead zone when:', tex: '0.1\\,e < 25 \\Rightarrow e < 250\\ \\text{counts}' },
        'So the shaft stops up to 250 counts short: 250 / 1320 of a turn, about 68°.',
        'Remedies: add a minimum output (the dead-zone offset) to any command above the deadband, raise Kp, or add a small integral term with a clamp.'
      ],
      a: 'Up to 250 counts, about 68°, short of the target. A minimum output of 25 % for any command above a few counts of error removes it.'
    }
  ],
  quiz: [
    { q: 'A proportional-only position loop makes the motor swing back and forth past the target. What is the usual cure?', choices: ['Add a derivative (speed) term or reduce the gain', 'Raise the PWM frequency', 'Remove the encoder', 'Add a larger motor'], a: 0, why: 'Inertia carries the shaft through the target while the output still pushes. A term proportional to speed brakes the approach and damps the swing; lowering the gain also helps.' },
    { q: 'An axis moves at 3000 counts/s and its position loop gain is Kv = 30 /s. By how much does it lag the target?', choices: ['10 counts', '100 counts', '3000 counts', '90 000 counts'], a: 1, why: 'The following error is v / Kv = 3000 / 30 = 100 counts.' },
    { q: 'Why is the loop run from a fixed timer rather than whenever loop() comes round?', choices: ['The encoder only works on timers', 'Variable sample time changes the effective derivative and integral gains', 'To save power', 'Timers are faster'], a: 1, why: 'The derivative is a difference divided by the sample time and the integral a sum times it. If the time varies, the controller behaves differently from the one you tuned.' },
    { q: 'The motor draws high current but the encoder count does not change. What should the program do?', choices: ['Raise the output until it moves', 'Cut the output: the motor is blocked or the sensor is wrong', 'Ignore it', 'Reverse the encoder pins in software while running'], a: 1, why: 'A blocked motor, a broken wire or a wrong sign leaves the error open, and an unlimited loop drives the motor at full power into the problem. Detect it (output high, no movement for a moment) and stop.' }
  ],
  applications: [
    'Robot arm joints and grippers built from geared DC motors with encoders.',
    'Motorised sliders, blinds and valves that must reach a set position and hold it.',
    'Camera pan-tilt heads and antenna rotators.',
    'The inner loops of balancing robots and self-driving model vehicles.'
  ],
  sources: [
    'Åström and Murray, *Feedback Systems*: the textbook treatment of PID and cascade control.',
    'The SimpleFOC and Arduino PID library documentation for worked position loops.',
    'The data sheet of your drive or motor: the encoder resolution and the maximum speed and current.'
  ],
  choose: {
    good: ['A PD loop at a fixed 10 ms for a geared DC motor with an encoder', 'A cascade with a speed limit for smooth, safe motion', 'A servo or closed-loop stepper where the loop is already built in'],
    avoid: ['An unclamped output or an integral term with no windup limit', 'A loop that runs when the program happens to get to it', 'Tuning on the real machine without an output limit and a stop switch'],
    check: ['The encoder resolution and where it sits (motor or output shaft)', 'The dead zone and the stall current of the motor', 'Whether backlash or stiction will limit the precision you ask for']
  },
  code: [
    {
      title: 'Move a DC motor to a target position',
      about: 'A PD loop runs every 10 ms: the error is the target minus the encoder count; the output is Kp times the error minus Kd times the speed, with a minimum output to skip the dead zone, a deadband of 4 counts to stop hunting, and a clamp. The target alternates between 0 and one output revolution (1320 counts) every four seconds. The decoding is that of the previous page.',
      needs: 'An ESP32 DevKit, a TB6612FNG, a 6 V geared motor with a 3.3 V Hall encoder (1320 counts per output turn) and its own supply. Test with the output limit low and the motor free to turn.',
      wiring: [['GPIO32, GPIO33', 'encoder A and B', 'internal pull-ups; encoder powered at 3.3 V'], ['GPIO25', 'TB6612FNG PWMA'], ['GPIO26', 'AIN1'], ['GPIO27', 'AIN2'], ['GPIO4', 'STBY', 'held low (standby) until the program sets it'], ['6 V supply', 'VM and motor, GND shared']],
      blocks: `
        when started
          set pin (26) as [output v]
          set pin (27) as [output v]
          set pin (4) as [output v]
          set PWM on pin (25) frequency (20000) resolution (10)
          set pin (32) as [input with pull-up v]
          set pin (33) as [input with pull-up v]
          set [target v] to (0)
          set [last v] to (0)
          set pin (4) to [HIGH v]

        when pin (32) changes :: events
          decode the encoder pair on pins (32) and (33) :: my

        when pin (33) changes :: events
          decode the encoder pair on pins (32) and (33) :: my

        every (0.01) seconds
          set [error v] to ((target) - (count))
          set [speed v] to (((count) - (last)) / (0.01))
          set [last v] to (count)
          set [out v] to ((((0.1) * (error)) - ((0.002) * (speed))))
          if <(error) is within (4) counts> then
            set [out v] to (0)
          else if <(out) > (0)> then
            set [out v] to (max (out) (25))
          else
            set [out v] to (min (out) (-25))
          end
          limit [out v] to (-70) (70)
          drive (out) :: my

        every (4) seconds
          set [target v] to ((1320) - (target))
      `,
      cpp: String.raw`
        const int PIN_A = 32, PIN_B = 33;          // encoder
        const int PIN_PWM = 25, PIN_IN1 = 26, PIN_IN2 = 27, PIN_STBY = 4;
        const int DUTY_MAX = 1023;                 // 10 bits
        const float KP = 0.1f;                     // percent of output per count of error
        const float KD = 0.002f;                   // percent per count/s of speed
        const float MIN_OUT = 25;                  // percent: the motor's dead zone
        const float MAX_OUT = 70;                  // percent: a safe limit while testing
        const int DEADBAND = 4;                    // counts: stop hunting
        const uint32_t PERIOD_MS = 10;

        volatile int32_t count = 0;
        volatile uint8_t prev = 0;
        const int8_t STEP_TABLE[16] = { 0, -1, 1, 0,   1, 0, 0, -1,   -1, 0, 0, 1,   0, 1, -1, 0 };

        void IRAM_ATTR onEdge() {
          uint8_t now = (digitalRead(PIN_A) << 1) | digitalRead(PIN_B);
          count += STEP_TABLE[(prev << 2) | now];
          prev = now;
        }

        void drive(float percent) {                // signed, -100 .. 100; speed 0 brakes
          if (percent == 0) {
            digitalWrite(PIN_IN1, HIGH); digitalWrite(PIN_IN2, HIGH);   // short brake
            ledcWrite(PIN_PWM, DUTY_MAX);
            return;
          }
          digitalWrite(PIN_IN1, percent > 0);
          digitalWrite(PIN_IN2, percent < 0);
          ledcWrite(PIN_PWM, (int)(fabsf(percent) * DUTY_MAX / 100.0f));
        }

        void setup() {
          pinMode(PIN_IN1, OUTPUT); pinMode(PIN_IN2, OUTPUT); pinMode(PIN_STBY, OUTPUT);
          pinMode(PIN_A, INPUT_PULLUP); pinMode(PIN_B, INPUT_PULLUP);
          prev = (digitalRead(PIN_A) << 1) | digitalRead(PIN_B);
          attachInterrupt(PIN_A, onEdge, CHANGE);
          attachInterrupt(PIN_B, onEdge, CHANGE);
          ledcAttach(PIN_PWM, 20000, 10);
          digitalWrite(PIN_STBY, HIGH);
        }

        void loop() {
          static uint32_t lastRun = 0, lastTarget = 0;
          static int32_t target = 0, lastCount = 0;
          uint32_t now = millis();
          if (now - lastTarget >= 4000) { lastTarget += 4000; target = 1320 - target; }   // 0 and one turn
          if (now - lastRun >= PERIOD_MS) {        // a fixed loop rate
            lastRun += PERIOD_MS;
            int32_t c = count;
            float error = target - c;
            float speed = (c - lastCount) * 1000.0f / PERIOD_MS;
            lastCount = c;
            float out = KP * error - KD * speed;   // proportional drive, derivative brake
            if (fabsf(error) <= DEADBAND) out = 0;
            else out = (out > 0) ? max(out, MIN_OUT) : min(out, -MIN_OUT);   // skip the dead zone
            out = constrain(out, -MAX_OUT, MAX_OUT);
            drive(out);
          }
        }
      `,
      py: String.raw`
        from machine import Pin, PWM
        import time

        PIN_A, PIN_B = 32, 33                      # encoder
        PIN_PWM, PIN_IN1, PIN_IN2, PIN_STBY = 25, 26, 27, 4
        FULL = 65535
        KP = 0.1                                   # percent of output per count of error
        KD = 0.002                                 # percent per count/s of speed
        MIN_OUT = 25                               # percent: the motor's dead zone
        MAX_OUT = 60                               # percent: lower than C++, MicroPython misses fast edges
        DEADBAND = 4                               # counts: stop hunting
        PERIOD_MS = 10

        a = Pin(PIN_A, Pin.IN, Pin.PULL_UP)
        b = Pin(PIN_B, Pin.IN, Pin.PULL_UP)
        in1, in2 = Pin(PIN_IN1, Pin.OUT), Pin(PIN_IN2, Pin.OUT)
        stby = Pin(PIN_STBY, Pin.OUT)
        pwm = PWM(Pin(PIN_PWM), freq=20000, duty_u16=0)
        count = 0
        prev = (a.value() << 1) | b.value()
        STEP = {(0, 2): 1, (2, 3): 1, (3, 1): 1, (1, 0): 1,
                (2, 0): -1, (3, 2): -1, (1, 3): -1, (0, 1): -1}

        def on_edge(pin):
            global count, prev
            now = (a.value() << 1) | b.value()
            count += STEP.get((prev, now), 0)
            prev = now

        a.irq(handler=on_edge, trigger=Pin.IRQ_RISING | Pin.IRQ_FALLING)
        b.irq(handler=on_edge, trigger=Pin.IRQ_RISING | Pin.IRQ_FALLING)

        def drive(percent):                        # signed, -100 .. 100; 0 brakes
            if percent == 0:
                in1.value(1)
                in2.value(1)                       # short brake
                pwm.duty_u16(FULL)
                return
            in1.value(1 if percent > 0 else 0)
            in2.value(1 if percent < 0 else 0)
            pwm.duty_u16(int(abs(percent) * FULL / 100))

        stby.value(1)
        target = 0
        last_count = 0
        last_run = last_target = time.ticks_ms()
        while True:
            now = time.ticks_ms()
            if time.ticks_diff(now, last_target) >= 4000:
                last_target = time.ticks_add(last_target, 4000)
                target = 1320 - target             # 0 and one turn
            if time.ticks_diff(now, last_run) >= PERIOD_MS:      # a fixed loop rate
                last_run = time.ticks_add(last_run, PERIOD_MS)
                c = count
                error = target - c
                speed = (c - last_count) * 1000 / PERIOD_MS
                last_count = c
                out = KP * error - KD * speed      # proportional drive, derivative brake
                if abs(error) <= DEADBAND:
                    out = 0
                elif out > 0:
                    out = max(out, MIN_OUT)        # skip the dead zone
                else:
                    out = min(out, -MIN_OUT)
                out = max(-MAX_OUT, min(MAX_OUT, out))
                drive(out)
      `,
      notes: ['The gains are a starting point for a small 6 V gearmotor, not a recipe: raise Kp until the motion begins to ring, then add Kd until it settles, and only then lower the output limit to what the job needs.', 'A short brake at the end holds the shaft against small outside forces; for a load that must be held, add an integral term with a clamp or a mechanical brake.']
    }
  ]
},

/* ================================================================ 10 */
{
  id: 'limit-switches-and-homing',
  parent: 'driving-motors',
  title: 'Limit switches and homing',
  level: 2,
  short: 'A stepper or an incremental encoder only knows how far it has moved since power-up. Homing drives the axis to a limit switch, backs off, approaches slowly and calls that place zero. Wire the switches normally closed so that a broken wire stops the machine, and give the sequence a timeout.',
  keywords: ['limit switch', 'homing', 'end stop', 'normally closed', 'NC', 'microswitch', 'optical endstop', 'inductive proximity sensor', 'hard limit', 'soft limit', 'zero position', 'reference', 'sensorless homing', 'StallGuard', 'repeatability', 'seek speed', 'timeout', 'fail-safe'],
  prereq: ['buttons-and-switches', 'debouncing', 'stepper-drivers'],
  related: ['state-machine-in-code', 'timeouts-and-timed-states', 'interrupts', 'pull-ups-and-pull-downs', 'position-control', 'multi-axis-motion', 'safety-in-control', 'motors:limit-switches', 'motors:homing-routines', 'motors:proximity-sensors', 'motors:optical-sensors', 'motors:emergency-stop'],
  body: `A stepper counts steps; an incremental encoder counts edges. Neither knows **where the axis is** when the power comes on: they only know how far it has moved since. Before any move to a position makes sense the machine must find a reference, a place it can recognise, and set its position counter there. That is **homing**, and the device that recognises the place is a **limit switch** (or end stop).

### Kinds of switch

| Switch | How it senses | Remarks |
|---|---|---|
| mechanical microswitch (lever or roller) | a contact closes or opens | cheap, robust; repeatable to about 0.02 to 0.05 mm; bounces |
| optical slot (a U-shaped sensor and a flag) | a flag blocks a beam | no contact, repeatable; needs power and a pull-up |
| Hall or reed sensor with a magnet | a magnet comes near | sealed, good for dirty places |
| inductive proximity sensor | metal comes near | industrial: often 12 or 24 V with NPN or PNP output, so the signal needs a divider or level shifter ([[level-shifters]]) |

### Wire it normally closed

Connect the switch between the pin and ground, with the pin's pull-up on, and use the contact that is **closed when the axis is not at the limit**. Then the pin reads low in normal operation and high when the switch is pressed. A **broken wire reads the same as a pressed switch**, so a fault stops the machine instead of letting it drive into the end of its travel. With the usual normally-open wiring a broken wire is invisible. The ESP32's internal pull-ups are weak (tens of kilohms): for a long cable use an external 1 to 4.7 kΩ pull-up and a small capacitor, and debounce in software ([[debouncing]]). Better still, wire a limit in series with the driver's enable or the motor supply as well, so that a **hard limit** stops the axis even if the program has crashed; the program's own **soft limits** (a permitted range) are for the normal case.

### The homing sequence

1. **If the switch is already pressed**, back off until it is released.
2. **Seek fast** towards the switch until it triggers.
3. **Back off** until it releases, then a small margin.
4. **Seek slowly** towards the switch again. The slow approach sets the repeatability: the position found can be wrong by at most one step of the slow speed, plus the switch's own hysteresis.
5. **Set the position to zero** (or to a known offset) and move to the work position.

Every one of these steps needs a **timeout or a step limit**: if the switch never triggers (a broken switch, a wrong pin, a jammed axis) the axis must stop after the longest possible travel and report a fault, not grind on. (A step limit only ends a search that would never finish: from near the switch the carriage can reach the mechanical stop before the count runs out, which is what the hard limit is for.) As a state machine ([[state-machine-in-code]]) the sequence is SEEK_FAST, BACKOFF, SEEK_SLOW, ZERO, READY, with a FAULT state reached from any of the first three.

### Sensorless homing

Some drivers (the TMC2209 and friends) can detect the stall that happens when an axis reaches its mechanical stop, and give a signal. It saves a switch and its wiring, but it works only in a window of speeds and currents, needs tuning, and presses the axis against the stop. Use it for convenience, never as a safety limit.

> [!warn] A limit switch that fails or is never reached lets a machine drive into its stop, or into a person. Safety stops must work without the ESP32: use normally closed contacts in the motor's enable or supply path, a physical stop button, and keep fingers out of the travel while a homing sequence runs.

> [!key] Homing finds a known place so counted steps become a position: seek fast, back off, seek slowly, set zero. Wire the switch normally closed so a broken wire stops the machine, limit every move with a timeout, and keep a hardware stop independent of the software.`,
  ideas: [
    'A stepper or incremental encoder knows only how far it moved since power-up; homing finds a reference place and sets the position counter there.',
    'Wire limit switches normally closed: a broken wire looks like a pressed switch and the machine stops instead of crashing.',
    'Seek fast, back off, seek slowly, then zero: the slow approach sets the repeatability. Every step needs a timeout.',
    'Soft limits are software; a hard limit in the motor\'s enable or supply path works even if the program has crashed.'
  ],
  pitfalls: [
    'A normally open switch is fine — A broken wire looks like an axis that is never at the limit, and the machine drives into its end stop. Normally closed shows the fault.',
    'One fast approach is enough — The first hit depends on the speed: the axis can overrun the switch and the repeatability is poor. Back off and approach slowly.',
    'Homing always finishes — If the switch is broken or the axis jammed it never does. Without a step limit the motor grinds against the stop.'
  ],
  terms: [
    { term: 'Homing', also: ['reference run', 'referencing'], def: 'Moving an axis to a recognisable reference place, usually a limit switch, and setting the position counter to a known value there.' },
    { term: 'Limit switch', also: ['end stop', 'endstop'], def: 'A switch that tells the controller an axis has reached the end of its travel, or a reference place on it.' },
    { term: 'Normally closed', also: ['NC contact'], def: 'A contact that conducts when the switch is not actuated and opens when it is pressed. A broken wire then looks the same as a pressed switch, which is a safe failure.' },
    { term: 'Hard limit', also: ['hardware limit'], def: 'A limit that stops the motor by cutting its enable or supply directly, without relying on the program.' },
    { term: 'Soft limit', also: ['software limit'], def: 'A range of positions that the program refuses to leave. It protects only while the position is known and the program is running.' }
  ],
  sim: 'dm-homing',
  examples: [
    {
      title: 'How exact is the home position?',
      q: 'A lead screw axis moves 8 mm per revolution with a 200-step motor at 1/16 microstepping. The slow approach runs at 250 steps/s. What is the position resolution of the home, and what is the longest the program should wait for the switch if the axis is 300 mm long?',
      steps: [
        { text: 'Steps per millimetre:', tex: '\\frac{200 \\cdot 16}{8} = 400\\ \\text{steps/mm}' },
        'One step is 1/400 mm = 0.0025 mm, far finer than the switch itself (about 0.02 to 0.05 mm).',
        { text: 'The longest travel to find a switch:', tex: '300 \\cdot 400 = 120\\,000\\ \\text{steps}' },
        'Add a margin of 10 %: give up after about 132 000 fast steps, and report a fault. The fast approach at 1250 steps/s would take 106 s in the worst case.'
      ],
      a: 'The switch, not the steps, limits the repeatability, to about 0.02 to 0.05 mm. Time out after the longest travel plus a margin, about 132 000 steps here.'
    }
  ],
  quiz: [
    { q: 'Why wire a limit switch normally closed?', choices: ['It is cheaper', 'A broken wire then looks like a pressed switch and stops the machine', 'It uses less current', 'It bounces less'], a: 1, why: 'With a normally closed contact the idle state is a closed circuit; a cut wire opens it, which reads exactly like a press. The fault is safe and visible; with a normally open switch a broken wire would hide the limit.' },
    { q: 'Why does a good homing routine approach the switch a second time, slowly?', choices: ['To wear the switch evenly', 'The slow approach sets the repeatability of the home position', 'Steppers need two approaches to start', 'To check the pull-up'], a: 1, why: 'A fast approach overruns the switch by an amount that depends on speed and delay. A slow approach overruns by at most one step, so the home is found to the resolution of the switch.' },
    { q: 'The switch of a homing axis has failed and never triggers. What should the program do?', choices: ['Keep moving until it finds it', 'Stop after the longest possible travel and report a fault', 'Reverse and try the other end', 'Ignore the limit'], a: 1, why: 'A step limit or timeout set to the maximum travel plus a margin ends the search. Otherwise the motor grinds against the mechanical stop, and the machine or the driver is damaged.' },
    { q: 'Which limit stops the axis even if the ESP32 has crashed?', choices: ['A soft limit', 'A hard limit in the motor\'s enable or supply path', 'A limit set in the G-code', 'A printed warning'], a: 1, why: 'A soft limit is software and needs the program running. A contact in the enable line or the motor supply works with no program at all.' }
  ],
  applications: [
    'The axes of 3D printers and CNC machines, homed at every power-up.',
    'Camera sliders and motorised telescope focusers, referenced to one end.',
    'Motorised blinds and gates that find their closed position.',
    'Dosing pumps and valve actuators that must start from a known position.'
  ],
  sources: [
    'The documentation of your motion firmware (Grbl, FluidNC, Marlin) on homing cycles and limit switch wiring.',
    'Analog Devices (Trinamic), *TMC2209* datasheet: StallGuard stall detection.',
    'IEC 60204-1 and ISO 13849 for the safety functions of machines, where limits protect people.'
  ],
  choose: {
    good: ['Normally closed microswitches or optical slots at the end of each axis', 'A two-speed homing sequence with a step limit', 'A hardware stop in the enable or motor supply for machines that can hurt'],
    avoid: ['Normally open switches on a machine that can crash', 'Sensorless homing as the only protection', 'Homing with no timeout'],
    check: ['The switch repeatability against the precision you need', 'That the signal is 3.3 V and filtered on a long cable', 'Which end each axis homes to, so it never has to cross the work']
  },
  code: [
    {
      title: 'Home a stepper axis against a limit switch',
      about: 'A normally closed limit switch between GPIO23 and ground (the pin pulls up, so it reads high when the switch opens or the wire breaks). The program backs off if already pressed, seeks fast, backs off, seeks slowly, sets the position to zero and moves 400 steps to the work start. A step limit ends every search with a fault.',
      needs: 'The stepper setup of the earlier pages (A4988, NEMA 17, 12 V) with an axis, and a normally closed microswitch at one end.',
      wiring: [['GPIO18', 'A4988 STEP'], ['GPIO19', 'A4988 DIR'], ['GPIO21', 'A4988 ENABLE', 'active low'], ['GPIO23', 'limit switch, normally closed, other side to GND', 'internal pull-up']],
      blocks: `
        when started
          set pin (18) as [output v]
          set pin (19) as [output v]
          set pin (21) as [output v]
          set pin (23) as [input with pull-up v]
          set pin (21) to [LOW v]
          home :: my
          if <(homed) = [true]> then
            move (400) steps away from the switch :: my
          else
            print [homing failed: switch not found]
          end

        define home
          if <(read pin (23)) = [HIGH v]> then
            back off until released (fast) :: my
          end
          seek the switch fast, give up after (20000) steps :: my
          back off until released, then (100) steps :: my
          seek the switch slowly, give up after (3000) steps :: my
          set [position v] to (0)
          set [homed v] to <true>
      `,
      cpp: String.raw`
        const int PIN_STEP = 18, PIN_DIR = 19, PIN_EN = 21;
        const int PIN_LIMIT = 23;                 // normally closed to GND, pull-up on
        const int TOWARD = LOW, AWAY = HIGH;      // DIR levels
        const int FAST_US = 400;                  // half period: 1250 steps/s
        const int SLOW_US = 2000;                 // half period: 250 steps/s
        const long MAX_STEPS = 20000;             // the longest travel plus a margin

        long position = 0;                        // steps from home

        bool triggered() { return digitalRead(PIN_LIMIT) == HIGH; }   // NC: open when pressed or when a wire breaks

        void pulse(int halfUs) {
          digitalWrite(PIN_STEP, HIGH); delayMicroseconds(halfUs);
          digitalWrite(PIN_STEP, LOW);  delayMicroseconds(halfUs);
        }

        bool seek(int dir, bool untilTriggered, int halfUs, long maxSteps) {
          digitalWrite(PIN_DIR, dir);
          delayMicroseconds(5);
          for (long n = 0; n < maxSteps; n++) {
            if (triggered() == untilTriggered) return true;
            pulse(halfUs);
          }
          return false;                           // never reached it: a fault
        }

        bool home() {
          if (triggered() && !seek(AWAY, false, FAST_US, 2000)) return false;   // already on the switch: back off first
          if (!seek(TOWARD, true, FAST_US, MAX_STEPS)) return false;            // 1. fast approach
          if (!seek(AWAY, false, SLOW_US, 2000)) return false;                  // 2. back off until it releases
          for (int i = 0; i < 100; i++) pulse(SLOW_US);                         //    and a small margin
          if (!seek(TOWARD, true, SLOW_US, 3000)) return false;                 // 3. slow approach: sets the repeatability
          position = 0;                                                         // 4. this is zero
          return true;
        }

        void setup() {
          Serial.begin(115200);
          pinMode(PIN_STEP, OUTPUT); pinMode(PIN_DIR, OUTPUT); pinMode(PIN_EN, OUTPUT);
          pinMode(PIN_LIMIT, INPUT_PULLUP);
          digitalWrite(PIN_EN, LOW);
          if (home()) {
            digitalWrite(PIN_DIR, AWAY);
            for (int i = 0; i < 400; i++) { pulse(FAST_US); position++; }       // to the work start
            Serial.printf("homed, position %ld\n", position);
          } else {
            digitalWrite(PIN_EN, HIGH);                                         // fault: release the motor
            Serial.println("homing failed: switch not found");
          }
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import Pin
        import time

        PIN_STEP, PIN_DIR, PIN_EN = 18, 19, 21
        TOWARD, AWAY = 0, 1                       # DIR levels
        FAST_US = 400                             # half period: 1250 steps/s
        SLOW_US = 2000                            # half period: 250 steps/s
        MAX_STEPS = 20000                         # the longest travel plus a margin

        step = Pin(PIN_STEP, Pin.OUT)
        direction = Pin(PIN_DIR, Pin.OUT)
        enable = Pin(PIN_EN, Pin.OUT)
        limit = Pin(23, Pin.IN, Pin.PULL_UP)      # normally closed to GND
        position = 0                              # steps from home

        def triggered():                          # NC: open when pressed or when a wire breaks
            return limit.value() == 1

        def pulse(half_us):
            step.value(1)
            time.sleep_us(half_us)
            step.value(0)
            time.sleep_us(half_us)

        def seek(dir_level, until_triggered, half_us, max_steps):
            direction.value(dir_level)
            time.sleep_us(5)
            for _ in range(max_steps):
                if triggered() == until_triggered:
                    return True
                pulse(half_us)
            return False                          # never reached it: a fault

        def home():
            global position
            if triggered() and not seek(AWAY, False, FAST_US, 2000):    # already on the switch: back off first
                return False
            if not seek(TOWARD, True, FAST_US, MAX_STEPS):              # 1. fast approach
                return False
            if not seek(AWAY, False, SLOW_US, 2000):                    # 2. back off until it releases
                return False
            for _ in range(100):                                        #    and a small margin
                pulse(SLOW_US)
            if not seek(TOWARD, True, SLOW_US, 3000):                   # 3. slow approach: sets the repeatability
                return False
            position = 0                                                # 4. this is zero
            return True

        enable.value(0)
        if home():
            direction.value(AWAY)
            for _ in range(400):                                        # to the work start
                pulse(FAST_US)
                position += 1
            print("homed, position", position)
        else:
            enable.value(1)                                             # fault: release the motor
            print("homing failed: switch not found")
      `,
      output: `
        homed, position 400
      `,
      notes: ['The seek helper stops on a condition and on a step count: that second limit is what turns a broken switch from a crash into a message.', 'For a noisy cable add an external pull-up and a 10 nF capacitor, and require the pin to read the same for a few steps before believing it.']
    }
  ]
},

/* ================================================================ 11 */
{
  id: 'motor-power-and-protection',
  parent: 'driving-motors',
  title: 'Motor supplies, noise and protection',
  level: 2,
  short: 'A motor draws current in lumps and fires noise into everything near it. Give it a supply of its own with one shared ground, capacitors, a flyback path, a fuse and a stop that works without the ESP32; and watch the current so a stalled motor is cut off.',
  keywords: ['motor supply', 'common ground', 'star ground', 'bulk capacitor', 'flyback diode', 'TVS', 'reverse polarity', 'fuse', 'brownout', 'voltage sag', 'EMI', 'motor noise', 'ferrite', 'snubber', 'INA219', 'stall detection', 'soft start', 'emergency stop', 'LiPo', 'internal resistance'],
  prereq: ['dc-motors-and-h-bridges', 'current-peaks-and-capacitors', 'brownout'],
  related: ['protection-parts', 'mosfets-for-loads', 'measuring-current-with-shunts', 'isolation-and-long-cables', 'pins-at-boot', 'safety-in-control', 'lithium-cells', 'regulators-ldo-and-buck', 'motors:motor-failures', 'motors:emergency-stop', 'motors:motor-heating', 'electronics:flyback-diode', 'electronics:decoupling'],
  body: `Most motor projects that "do not work" are power problems. A motor is a heavy, noisy neighbour: it draws ten times its running current when it starts, it injects spikes into the supply and the air, and it shares a battery with a microcontroller that only needs a couple of tenths of a volt of sag to reset. The checklist below is what separates a demo that resets every time the motor starts from a machine you can leave running.

### A supply for the motor, a ground for both

Give the motor **its own supply**, rated for the stall current, and join its ground to the ESP32's **at one point**, near the supply, so that the motor's return current does not run through the thin ground track of the logic. If the ESP32 is fed from the same battery, give it its own regulator and a capacitor so that a sagging battery does not drag it down ([[regulators-ldo-and-buck]]). A battery is not an ideal source: with an internal resistance $R_i$ the terminal voltage under load is $V_0 - I R_i$. Four AA cells at 0.8 Ω delivering 2 A drop 1.6 V; that is enough to starve a linear regulator and reset the chip ([[brownout]]).

### Capacitors and flyback

- **100 µF or more across the driver's motor supply**, as close as possible, to ride through the current steps of starting and PWM edges; add 100 nF ceramic next to it.
- **100 nF ceramic across the motor terminals** of a brushed motor, and from each terminal to the motor case if the motor has a metal body: this quietens the sparks of the commutator, which otherwise reset microcontrollers and corrupt I2C and encoder signals. A ferrite bead on the leads and twisted motor wires help further.
- **A flyback path.** The switches of a driver chip have body diodes. A bare MOSFET driving a motor needs a diode across the motor ([[switching-dc-loads]]).
- A **TVS diode** across the supply clips the spikes that inductive loads and long cables add; a **reverse-polarity** protection (a series diode, or better a P-channel MOSFET) saves the electronics from a battery put in backwards.

### Fuses and the current

A fuse or resettable fuse in the motor supply, rated above the running current and below what the wires and the driver can take, turns a short circuit into a blown fuse and not a fire. Beyond the fuse, **measure the current** with a shunt or an INA219-type sensor ([[measuring-current-with-shunts]]): a stalled motor draws a steady high current while the encoder does not move, and the program can cut it after a few hundred milliseconds. Ignore the first moments of a start, when the current legitimately peaks, and **start softly** by ramping the duty, which cuts the peak.

### A motor must not start by itself

At reset the ESP32's pins float or take unexpected levels ([[pins-at-boot]]). Put pull-down resistors on the driver's enable and direction inputs so the driver is off until the program says otherwise. And a **physical stop** (a large mushroom switch that cuts the motor supply, or the enable line of the driver) has to work without any software: a program can crash, a Wi-Fi command can arrive late.

> [!warn] Motors, batteries and drivers carry enough energy to burn wires and cells. Fuse the supply; charge lithium cells only with a proper charger and protection, never from a GPIO or a bare supply, and treat a swollen, punctured or shorted cell as a fire. Keep a stop that cuts the power without the ESP32.

> [!key] Give the motor its own supply with one shared ground, bulk and ceramic capacitors, a flyback path, a fuse and a hardware stop; soften the start and watch the current so a stalled motor is cut off. Most "software" problems of motor projects are a sagging supply or noise on the signals.`,
  ideas: [
    'A motor starts at several times its running current: the supply sags and the noise of the brushes resets microcontrollers and corrupts signals.',
    'Give the motor its own supply with one ground join, near the supply, and a separate regulator for the ESP32; a battery\'s internal resistance makes it sag under load.',
    'Capacitors (bulk at the driver, 100 nF across the motor), a flyback path, a TVS diode and reverse-polarity protection cover the usual faults.',
    'A fuse and a current sensor catch short circuits and stalls; a hardware stop must work without the program, and the driver must be off at reset.'
  ],
  pitfalls: [
    'The ESP32 resets because of the program — If it resets when the motor starts, the supply sags or the noise reaches the chip. Look at the supply with an oscilloscope before the code.',
    'Grounds should be joined everywhere — A motor\'s return current through the logic ground makes the logic ground bounce. Join them at one point, at the supply, and keep the motor loop short and thick.',
    'A software stop is enough — The program can crash and the radio can lag. Machines that can hurt need a hardware stop in the supply or enable path.'
  ],
  terms: [
    { term: 'Star ground', also: ['single-point ground'], def: 'Joining the grounds of the high-current and the logic parts at one point only, so the large motor currents do not flow along the logic ground.' },
    { term: 'Bulk capacitor', also: ['reservoir capacitor'], def: 'A large capacitor (100 µF or more) across a supply near a load, supplying the short current steps that the supply cannot follow quickly.' },
    { term: 'TVS diode', also: ['transient voltage suppressor'], def: 'A diode that conducts above its breakdown voltage and clips short voltage spikes on a supply, protecting the circuit behind it.' },
    { term: 'Soft start', also: ['ramp start'], def: 'Raising the duty or speed of a motor gradually at start, which cuts the starting current and the strain on the mechanism.' },
    { term: 'Internal resistance', also: ['source resistance'], def: 'The resistance inside a battery or supply, which makes its terminal voltage fall as the load current rises.' }
  ],
  formulas: [
    {
      name: 'Battery sag under load',
      expr: 'V = V0 - I*Ri',
      tex: 'V = V_0 - I\\,R_i',
      vars: {
        V: { name: 'terminal voltage under load', q: 'voltage', unit: 'V', tex: 'V' },
        V0: { name: 'open-circuit voltage', q: 'voltage', unit: 'V', value: 6, tex: 'V_0' },
        I: { name: 'load current', q: 'current', unit: 'A', value: 2, tex: 'I' },
        Ri: { name: 'internal resistance of the pack', q: 'resistance', unit: 'Ω', value: 0.8, tex: 'R_i' }
      },
      solveFor: 'V',
      note: 'Four alkaline AA cells have an internal resistance of the order of 0.6 to 1.2 Ω and it rises as they run down; lithium and NiMH packs are much lower. Include the resistance of the wires and connectors.',
      stories: { V: 'A pack of {V0} open circuit with {Ri} internal resistance feeds a load of {I}. What is the voltage at its terminals?', Ri: 'A {V0} pack falls to {V} under {I}. What is its internal resistance?' }
    },
    {
      name: 'Capacitor to ride through a current step',
      expr: 'C = I*dt/dV',
      tex: 'C = \\frac{I\\,\\Delta t}{\\Delta V}',
      vars: {
        C: { name: 'capacitance', q: 'capacitance', unit: 'µF', tex: 'C' },
        I: { name: 'current step', q: 'current', unit: 'A', value: 2, tex: 'I' },
        dt: { name: 'time the supply takes to respond', q: 'time', unit: 'µs', value: 100, tex: '\\Delta t' },
        dV: { name: 'allowed droop', q: 'voltage', unit: 'V', value: 0.3, tex: '\\Delta V' }
      },
      solveFor: 'C',
      note: 'The capacitor supplies the step until the supply and the wiring catch up. The response time of a supply with long thin leads can be 100 µs or more: short, thick wires help as much as the capacitor.',
      stories: { C: 'A motor adds a current step of {I}; the supply responds in {dt} and the rail may droop by {dV}. How much capacitance is needed?' }
    }
  ],
  examples: [
    {
      title: 'Why does the ESP32 reset when the motor starts?',
      q: 'A robot has four AA cells (6 V open circuit, 0.8 Ω) feeding both a motor driver and, through a linear 3.3 V regulator with 1.1 V dropout, the ESP32. The motor winding is 2.4 Ω. What happens at start?',
      steps: [
        { text: 'The start current, with the pack resistance in the loop:', tex: 'I = \\frac{6}{2.4 + 0.8} \\approx 1.9\\ \\text{A}' },
        { text: 'The pack voltage under that load:', tex: 'V = 6 - 1.9 \\cdot 0.8 \\approx 4.5\\ \\text{V}' },
        'A regulator with 1.1 V dropout needs at least 4.4 V to hold 3.3 V; with the wires and connector drop the ESP32 gets less than that for a moment, the output sags and the brownout detector resets the chip.'
      ],
      a: 'The pack sags to about 4.5 V at the start, below what the regulator needs. Cures: a bulk capacitor at the ESP32 supply, a low-dropout or buck regulator, a separate cell or supply for the logic, and a soft start.'
    }
  ],
  quiz: [
    { q: 'A battery has 6 V open circuit and 1 Ω internal resistance. A motor draws 3 A at start. What voltage do the motor and driver see?', choices: ['6 V', '3 V', '5 V', '0 V'], a: 1, why: 'The pack drops I × Ri = 3 × 1 = 3 V, leaving 3 V at the terminals. (The motor draws less as the pack sags, but the voltage still falls a long way.)' },
    { q: 'Where should the motor supply\'s ground and the ESP32\'s ground be joined?', choices: ['Everywhere possible', 'At one point, near the supply', 'Never', 'Only through the USB cable'], a: 1, why: 'A single join keeps the large motor return current out of the logic ground. Several joins create loops through which motor current and noise flow along the logic wiring.' },
    { q: 'A 100 nF ceramic capacitor across the terminals of a brushed motor does what?', choices: ['Raises the speed', 'Quietens the radio-frequency spikes of the commutator sparks', 'Provides the starting current', 'Replaces the fuse'], a: 1, why: 'The commutator makes and breaks the winding currents with sparks that radiate and conduct broadband noise. A small ceramic capacitor across the motor shunts it.' },
    { q: 'What must a stop button for a machine that can hurt do?', choices: ['Send a Wi-Fi message to the ESP32', 'Cut the motor supply or the driver enable without any software', 'Set a flag in the program', 'Reset the ESP32'], a: 1, why: 'The stop has to work when the program has crashed or the network is down. A contact in the supply or the enable line does not depend on either.' }
  ],
  applications: [
    'Battery-powered robots that must start their motors without resetting the controller.',
    'Motorised doors, blinds and valves with stall detection to stop at an obstacle.',
    'Machines with several motors on one supply, where noise and ground loops show up first.',
    'Any project that moves something heavy: fuses, stops and cut-offs belong in the first design, not the last.'
  ],
  sources: [
    'Texas Instruments, *INA219* datasheet: the shunt voltage register and its resolution.',
    'The datasheet of your motor driver: supply decoupling and layout recommendations.',
    'IEC 60204-1 for the stop functions and the electrical equipment of machines.'
  ],
  choose: {
    good: ['A separate motor supply with a star ground and a bulk capacitor at the driver', 'Current sensing with a time limit for stall detection', 'A hardware stop and a fuse in the motor supply'],
    avoid: ['Powering the ESP32 and the motor from one small battery with no regulator', 'Joining the grounds at several points', 'Relying only on software to stop a dangerous machine'],
    check: ['The stall current against the supply and the fuse rating', 'What the driver and the pins do at reset', 'The supply voltage at the ESP32 during a motor start, on an oscilloscope']
  },
  code: [
    {
      title: 'Soft start with stall cut-off',
      about: 'The motor speeds up over 1.5 s, runs, and every 10 ms the program reads the current from an INA219 shunt monitor on the motor supply. If the current stays above 1.5 A for 300 ms (a stall, not the start peak, which the soft start has removed) the program brakes, releases the driver and reports the fault. The INA219 shunt-voltage register has 10 µV per bit across a 0.1 Ω shunt, so one bit is 0.1 mA.',
      needs: 'An ESP32 DevKit, a TB6612FNG with a 6 V motor and supply, and an INA219 breakout with a 0.1 Ω shunt in the positive motor supply (VIN+ to the supply, VIN- to the driver\'s VM).',
      wiring: [['GPIO21, GPIO22', 'INA219 SDA and SCL', 'address 0x40; VCC to 3V3'], ['GPIO25', 'TB6612FNG PWMA'], ['GPIO26', 'AIN1', 'held high'], ['GPIO27', 'AIN2', 'held low'], ['GPIO4', 'STBY', 'low at reset: the driver stays off until the program wakes it'], ['6 V supply', 'INA219 VIN+; VIN- to the driver VM; GND shared']],
      blocks: `
        when started
          start serial at (115200) baud
          start I2C on SDA (21) SCL (22)
          set pin (26) as [output v]
          set pin (27) as [output v]
          set pin (4) as [output v]
          set pin (26) to [HIGH v]
          set pin (27) to [LOW v]
          set PWM on pin (25) frequency (20000) resolution (10)
          set [bad v] to (0)
          set pin (4) to [HIGH v]
          repeat (150)
            change [duty v] by (6.8)
            set PWM on pin (25) to (duty)
            wait (0.01) seconds
          end
        forever
          set [amps v] to (((I2C read (2) bytes from address (0x40) register (0x01)) as signed 16-bit) * (0.0001))
          if <(amps) > (1.5)> then
            change [bad v] by (1)
          else
            set [bad v] to (0)
          end
          if <(bad) ≥ (30)> then
            stop motor and report stall :: my
            stop [this script v]
          end
          wait (0.01) seconds
        end
      `,
      cpp: String.raw`
        #include <Wire.h>

        const int PIN_PWM = 25, PIN_IN1 = 26, PIN_IN2 = 27, PIN_STBY = 4;
        const uint8_t INA_ADDR = 0x40;          // INA219, default address
        const float LIMIT_A = 1.5;              // stall current
        const int TRIP_SAMPLES = 30;            // 30 samples of 10 ms = 300 ms
        const int DUTY_MAX = 1023;              // 10 bits

        float readCurrentA() {                  // shunt voltage register: 10 µV per bit, 0.1 ohm shunt
          Wire.beginTransmission(INA_ADDR);
          Wire.write(0x01);
          Wire.endTransmission(false);
          Wire.requestFrom(INA_ADDR, (size_t)2);
          int16_t raw = (Wire.read() << 8) | Wire.read();
          return raw * 0.0001f;                 // amperes
        }

        void stopMotor() {
          ledcWrite(PIN_PWM, 0);                // short brake while the driver is still awake
          delay(100);
          digitalWrite(PIN_STBY, LOW);          // then release it
        }

        void setup() {
          Serial.begin(115200);
          Wire.begin(21, 22, 400000);
          pinMode(PIN_IN1, OUTPUT); pinMode(PIN_IN2, OUTPUT); pinMode(PIN_STBY, OUTPUT);
          digitalWrite(PIN_IN1, HIGH);
          digitalWrite(PIN_IN2, LOW);
          ledcAttach(PIN_PWM, 20000, 10);
          digitalWrite(PIN_STBY, HIGH);
          for (int d = 0; d <= DUTY_MAX; d += 7) {   // soft start: about 1.5 s
            ledcWrite(PIN_PWM, d);
            delay(10);
          }
        }

        void loop() {
          static int bad = 0;
          float amps = readCurrentA();
          bad = (amps > LIMIT_A) ? bad + 1 : 0;      // count consecutive high samples
          if (bad >= TRIP_SAMPLES) {
            stopMotor();
            Serial.printf("STALL: %.2f A for 300 ms, motor stopped\n", amps);
            while (true) delay(1000);                // stay stopped until reset
          }
          delay(10);
        }
      `,
      py: String.raw`
        from machine import Pin, PWM, I2C
        import struct
        import time

        PIN_PWM, PIN_IN1, PIN_IN2, PIN_STBY = 25, 26, 27, 4
        INA_ADDR = 0x40                          # INA219, default address
        LIMIT_A = 1.5                            # stall current
        TRIP_SAMPLES = 30                        # 30 samples of 10 ms = 300 ms
        FULL = 65535

        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000)
        in1, in2 = Pin(PIN_IN1, Pin.OUT), Pin(PIN_IN2, Pin.OUT)
        stby = Pin(PIN_STBY, Pin.OUT)
        pwm = PWM(Pin(PIN_PWM), freq=20000, duty_u16=0)

        def read_current_a():                    # shunt voltage register: 10 uV per bit, 0.1 ohm shunt
            raw = struct.unpack(">h", i2c.readfrom_mem(INA_ADDR, 0x01, 2))[0]
            return raw * 0.0001                  # amperes

        def stop_motor():
            pwm.duty_u16(0)                      # short brake while the driver is still awake
            time.sleep_ms(100)
            stby.value(0)                        # then release it

        in1.value(1)
        in2.value(0)
        stby.value(1)
        for d in range(0, FULL + 1, FULL // 150):    # soft start: about 1.5 s
            pwm.duty_u16(d)
            time.sleep_ms(10)

        bad = 0
        while True:
            amps = read_current_a()
            bad = bad + 1 if amps > LIMIT_A else 0   # count consecutive high samples
            if bad >= TRIP_SAMPLES:
                stop_motor()
                print("STALL: %.2f A for 300 ms, motor stopped" % amps)
                break
            time.sleep_ms(10)
      `,
      output: `
        STALL: 1.62 A for 300 ms, motor stopped
      `,
      notes: ['Use the same INA219 reading for logging: bus voltage is register 0x02 (4 mV per bit after shifting out the three low bits).', 'The threshold must sit above the running current at full load and below what the driver and motor can bear; set it with a real load and a safety margin. This is a protection for the motor, not a safety function for people.']
    }
  ]
},

/* ================================================================ 12 */
{
  id: 'multi-axis-motion',
  parent: 'driving-motors',
  title: 'Several axes: CNC on an ESP32',
  level: 3,
  short: 'Drawing a straight line with two or more axes means stepping them in proportion so all arrive together. A line algorithm does it, a planner shapes the speed through corners, and a ready firmware (FluidNC) does all of it on an ESP32 from G-code.',
  keywords: ['CNC', 'multi-axis', 'coordinated motion', 'interpolation', 'Bresenham', 'DDA', 'G-code', 'FluidNC', 'Grbl', 'Marlin', 'planner', 'look-ahead', 'steps per mm', 'feed rate', 'CoreXY', 'gantry', 'pen plotter', 'jerk', 'junction speed'],
  prereq: ['step-pulses-and-acceleration', 'limit-switches-and-homing', 'stepper-drivers'],
  related: ['fluidnc-and-grbl', 'robots-on-esp', 'the-loop-task-and-two-cores', 'motor-power-and-protection', 'safety-in-control', 'project-robot-car', 'motors:motion-profiles', 'motors:lead-ball-screws', 'motors:belts-pulleys', 'motors:stepper-sizing'],
  body: `One axis moves from A to B. Two axes moving independently draw a bent path, because the one with the shorter distance arrives first. To draw a **straight line** from (0, 0) to (3200, 1200) steps, the axes must be stepped in proportion so that they arrive at the same instant: that is **coordinated** or **interpolated** motion.

### Stepping in proportion

The axis with the most steps, the **dominant** axis, steps on every tick. The other axis steps only on the ticks when its share has built up to a whole step. A simple way is an accumulator for each axis: add its step count each tick, and when the sum reaches the dominant count, step and subtract. This digital differential analyser is the same idea as **Bresenham's line algorithm**, and needs only integers. Every axis finishes together and the path stays within half a step of the true line. Circles and arcs are cut into short straight segments the same way.

### Speed along the path

A feed rate such as 600 mm/min is a speed *along the path*, not of an axis. For a line at an angle the dominant axis runs at the path speed times the dominant fraction of the path (at most the full rate), and the others slower. The acceleration limit applies along the path too, and the path must slow for corners: a G-code program is a long chain of short segments, and stopping at each vertex would make a jerky machine. A **planner** looks ahead several segments, works out the highest **junction speed** at each corner that the axes can take, and builds trapezoids for the whole chain. This is the hard part of firmware such as Grbl, Marlin and FluidNC. You rarely want to write it.

### Steps per millimetre

The mechanics turn steps into distance. For a belt, the travel per revolution is the belt pitch times the pulley teeth: a 2 mm GT2 belt on a 20-tooth pulley moves 40 mm, so 200 × 16 / 40 = **80 steps/mm** at 1/16 microstepping. For a lead screw it is the lead: an 8 mm lead gives 3200 / 8 = **400 steps/mm**. Higher resolution means a higher step rate for the same speed: at 400 steps/mm a feed of 3000 mm/min (50 mm/s) needs 20 kHz on that axis ([[step-pulses-and-acceleration]]).

### On the ESP32

- **FluidNC** is a Grbl-compatible CNC firmware for the ESP32: a YAML file names the axes, pins, drivers and limit switches; G-code arrives over USB, Wi-Fi, Bluetooth or a web interface or an SD card. Marlin, common in 3D printers, also has an ESP32 port. For a real machine start here ([[fluidnc-and-grbl]]).
- **Writing your own** is a good way to learn, and fine for a pen plotter or a camera slider. Keep step generation in a timer interrupt or in the RMT hardware, fed from a buffer of planned moves, and keep G-code parsing and Wi-Fi on the other core ([[the-loop-task-and-two-cores]]).
- **Pins:** every axis needs STEP and DIR and the drivers can share ENABLE; some boards add shift registers to get more step outputs.

### Homing, power and safety

Home Z first, away from the work, then X and Y ([[limit-switches-and-homing]]). A gantry with two motors on one axis must be squared against its end stops. Several drivers on one supply add up: four axes at 1.5 A each from 24 V need a supply to match and a bulk capacitor at each driver ([[motor-power-and-protection]]).

> [!warn] A moving machine is a hazard: keep hands out of the travel, put an emergency stop that cuts the motor supply within reach, fit hard limit switches, and never leave a cutting tool, laser or heater running unattended.

> [!key] Coordinated motion steps the axes in proportion so they arrive together, with a line algorithm; a planner shapes the speed along the path and through corners. Steps per millimetre come from the mechanics. On an ESP32 a ready firmware such as FluidNC does all of it; write your own only for simple jobs.`,
  ideas: [
    'Independent axes draw a bent path; coordinated motion steps the axes in proportion so all arrive together.',
    'The dominant axis steps every tick and the others step when an accumulator, the Bresenham idea, crosses a whole step.',
    'Feed rate is the speed along the path; a planner looks ahead and sets junction speeds so the machine does not stop at every G-code vertex.',
    'Steps per mm come from the belt pitch and pulley or the screw lead; FluidNC and Marlin do the whole job on an ESP32.'
  ],
  pitfalls: [
    'Setting each axis to the same speed draws a straight line — The axes then reach their ends at different times and the path bends. They need speeds proportional to their distances.',
    'Writing the planner is the easy part — Look-ahead, junction speeds and step generation under load are the hard part of CNC firmware; a ready firmware is usually the better start.',
    'Step rates scale with resolution only for slow machines — Higher steps per mm means a higher pulse rate for the same feed, and the ESP32 must then make the pulses in hardware.'
  ],
  terms: [
    { term: 'Coordinated motion', also: ['interpolated motion', 'linear interpolation'], def: 'Moving several axes together at speeds proportional to their distances, so they arrive at the same time and follow a straight line.' },
    { term: 'Bresenham algorithm', also: ['DDA', 'digital differential analyser'], def: 'An integer algorithm that steps the axes of a line in proportion using only additions and comparisons, keeping the path within half a step of the true line.' },
    { term: 'G-code', also: ['gcode'], def: 'The text language of CNC machines and 3D printers: lines such as G1 X10 Y5 F600 give a move, a position and a feed rate.' },
    { term: 'Planner', also: ['motion planner', 'look-ahead'], def: 'The part of motion firmware that turns a chain of moves into speed profiles with acceleration limits and the highest junction speeds at corners.' },
    { term: 'FluidNC', def: 'An open-source, Grbl-compatible CNC firmware for the ESP32, configured by a YAML file and driven by G-code over USB, Wi-Fi or a web interface.' }
  ],
  sim: 'dm-multi-axis',
  formulas: [
    {
      name: 'Steps per millimetre',
      expr: 'spm = steps*micro/L',
      tex: 'k = \\frac{N_{full}\\,m}{L}',
      vars: {
        spm: { name: 'steps per millimetre', unit: 'steps/mm', tex: 'k' },
        steps: { name: 'full steps per revolution', q: 'count', value: 200, int: true, min: 1, tex: 'N_{full}' },
        micro: { name: 'microsteps per full step', q: 'count', value: 16, int: true, min: 1, tex: 'm' },
        L: { name: 'travel per revolution', unit: 'mm', value: 40, tex: 'L' }
      },
      solveFor: 'spm',
      note: 'For a belt, L is the belt pitch times the number of teeth on the pulley (2 mm × 20 = 40 mm); for a lead screw, L is the lead.',
      stories: { spm: 'A {steps}-step motor at 1/{micro} microstepping moves {L} per revolution. How many steps make a millimetre?' }
    },
    {
      name: 'Step rate for a feed',
      expr: 'f = v*spm',
      tex: 'f = v\\,k',
      vars: {
        f: { name: 'step rate', unit: 'steps/s', tex: 'f' },
        v: { name: 'speed of the axis', unit: 'mm/s', value: 50, tex: 'v' },
        spm: { name: 'steps per millimetre', unit: 'steps/mm', value: 400, tex: 'k' }
      },
      solveFor: 'f',
      note: 'The rate the axis needs at its top speed. For a diagonal move the dominant axis carries the larger share of the path speed.',
      stories: { f: 'An axis with {spm} must move at {v}. What step rate does it need?' }
    }
  ],
  examples: [
    {
      title: 'A diagonal line',
      q: 'Two axes with 400 steps/mm move from (0, 0) to (40 mm, 10 mm) at a feed of 3000 mm/min. What are the step counts and the step rates of each axis?',
      steps: [
        'Steps: X = 40 × 400 = 16 000; Y = 10 × 400 = 4000. X is dominant.',
        { text: 'Path length:', tex: '\\sqrt{40^2 + 10^2} = 41.2\\ \\text{mm}' },
        { text: 'Path speed 50 mm/s, so the move takes:', tex: '41.2 / 50 = 0.82\\ \\text{s}' },
        { text: 'X step rate:', tex: '16\\,000 / 0.82 = 19\\,400\\ \\text{steps/s}' },
        { text: 'Y step rate:', tex: '4000 / 0.82 = 4850\\ \\text{steps/s}' }
      ],
      a: 'X: 16 000 steps at about 19.4 kHz; Y: 4000 steps at about 4.9 kHz. Both finish together after 0.82 s (ignoring ramps).'
    }
  ],
  quiz: [
    { q: 'Two axes must travel 3000 and 1000 steps and arrive together. What speeds must they have?', choices: ['The same', 'The first three times the speed of the second', 'The second three times the speed of the first', 'Any, a planner fixes it later'], a: 1, why: 'Arriving together means equal times, so speed is proportional to distance: 3000 steps need three times the rate of 1000.' },
    { q: 'In the accumulator form of Bresenham\'s algorithm, how often does the dominant axis step?', choices: ['Never', 'On every tick', 'On every second tick', 'Only at the corners'], a: 1, why: 'Its accumulator gains the dominant step count each tick and so reaches the threshold every tick; the other axis steps only now and then, in proportion.' },
    { q: 'A GT2 belt (2 mm pitch) runs on a 20-tooth pulley, driven by a 200-step motor at 1/16 microstepping. How many steps per millimetre?', choices: ['8', '40', '80', '160'], a: 2, why: 'One revolution moves 2 × 20 = 40 mm and takes 200 × 16 = 3200 steps: 80 steps/mm.' },
    { q: 'What does a motion planner with look-ahead add to a chain of G-code moves?', choices: ['Network access', 'Speeds at the corners and ramps for the whole chain, so the machine does not stop at every vertex', 'More steps per millimetre', 'Home switches'], a: 1, why: 'It reads several segments ahead and picks the highest speed at each junction that the axes can follow, then builds acceleration ramps for the whole path.' }
  ],
  applications: [
    'Pen plotters and drawing machines.',
    'Small CNC routers, laser engravers and 3D printers, usually on FluidNC or Marlin.',
    'Camera sliders and pan-tilt rigs with coordinated moves.',
    'Pick-and-place machines and test benches that must move to points in a plane.'
  ],
  sources: [
    'The FluidNC project documentation: the YAML configuration of axes, motors and limits.',
    'The Grbl documentation: the planner and G-code subset.',
    'J. E. Bresenham, *Algorithm for computer control of a digital plotter*, IBM Systems Journal, 1965.'
  ],
  choose: {
    good: ['FluidNC (or Marlin) on an ESP32 for a real CNC machine', 'A DDA line routine for a plotter or slider with short, simple moves', 'Hardware pulses (RMT) when the rates reach tens of kilohertz'],
    avoid: ['Starting by writing a planner for a full machine', 'Moving axes independently and expecting a straight line', 'Parsing G-code and generating pulses in the same busy loop'],
    check: ['The steps per millimetre and the highest pulse rate it implies', 'The supply current of all drivers together', 'Hard limit switches and an emergency stop that need no software']
  },
  code: [
    {
      title: 'Draw a triangle with two stepper axes',
      about: 'A line routine steps two axes in proportion with an accumulator for each: the larger step count steps every tick, the other when its accumulator crosses the larger count, so both axes arrive together. The program draws a triangle: right 1600 steps, up 1600, then back along the diagonal. Each tick is 600 µs (1667 steps/s on the dominant axis).',
      needs: 'Two stepper drivers of the earlier pages sharing one 12 V supply and the ENABLE line, two NEMA 17 motors on a small X-Y mechanism, and homing done (see [[limit-switches-and-homing]]).',
      wiring: [['GPIO18', 'X driver STEP'], ['GPIO19', 'X driver DIR'], ['GPIO32', 'Y driver STEP'], ['GPIO33', 'Y driver DIR'], ['GPIO21', 'ENABLE of both drivers', 'active low'], ['12 V supply', 'both drivers, 100 µF at each, GND shared']],
      blocks: `
        when started
          set pin (18) as [output v]
          set pin (19) as [output v]
          set pin (32) as [output v]
          set pin (33) as [output v]
          set pin (21) as [output v]
          set pin (21) to [LOW v]
        forever
          move line (1600) (0) :: my
          move line (0) (1600) :: my
          move line (-1600) (-1600) :: my
          wait (1) seconds
        end

        define move line (dx) (dy)
          set direction pins from the signs of (dx) and (dy) :: my
          set [n v] to (the larger of (abs (dx)) and (abs (dy)))
          set [errX v] to ((n) / (2))
          set [errY v] to ((n) / (2))
          repeat (n)
            change [errX v] by (abs (dx))
            change [errY v] by (abs (dy))
            step X if (errX) ≥ (n), then subtract (n) :: my
            step Y if (errY) ≥ (n), then subtract (n) :: my
            pulse the step pins that are due, wait (0.0006) seconds :: my
          end
      `,
      cpp: String.raw`
        const int STEP_X = 18, DIR_X = 19;
        const int STEP_Y = 32, DIR_Y = 33;
        const int PIN_EN = 21;                     // ENABLE of both drivers, active low
        const int HALF_US = 300;                   // 600 µs per tick: 1667 steps/s on the dominant axis

        void moveLine(long dx, long dy) {
          digitalWrite(DIR_X, dx >= 0);
          digitalWrite(DIR_Y, dy >= 0);
          delayMicroseconds(5);
          long ax = labs(dx), ay = labs(dy);
          long n = max(ax, ay);                    // the dominant axis steps on every tick
          long errX = n / 2, errY = n / 2;         // an accumulator for each axis, started half way so the path rounds to the nearest step
          for (long i = 0; i < n; i++) {
            errX += ax;
            errY += ay;
            bool sx = errX >= n, sy = errY >= n;
            if (sx) errX -= n;
            if (sy) errY -= n;
            digitalWrite(STEP_X, sx);
            digitalWrite(STEP_Y, sy);
            delayMicroseconds(HALF_US);
            digitalWrite(STEP_X, LOW);
            digitalWrite(STEP_Y, LOW);
            delayMicroseconds(HALF_US);
          }
        }

        void setup() {
          pinMode(STEP_X, OUTPUT); pinMode(DIR_X, OUTPUT);
          pinMode(STEP_Y, OUTPUT); pinMode(DIR_Y, OUTPUT);
          pinMode(PIN_EN, OUTPUT);
          digitalWrite(PIN_EN, LOW);               // enable both drivers
        }

        void loop() {
          moveLine(1600, 0);                       // right
          moveLine(0, 1600);                       // up
          moveLine(-1600, -1600);                  // back along the diagonal
          delay(1000);
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        STEP_X, DIR_X = Pin(18, Pin.OUT), Pin(19, Pin.OUT)
        STEP_Y, DIR_Y = Pin(32, Pin.OUT), Pin(33, Pin.OUT)
        enable = Pin(21, Pin.OUT)                  # ENABLE of both drivers, active low
        HALF_US = 300                              # 600 us per tick: about 1667 steps/s

        def move_line(dx, dy):
            DIR_X.value(1 if dx >= 0 else 0)
            DIR_Y.value(1 if dy >= 0 else 0)
            time.sleep_us(5)
            ax, ay = abs(dx), abs(dy)
            n = max(ax, ay)                        # the dominant axis steps on every tick
            err_x = err_y = n // 2                 # an accumulator for each axis, started half way so the path rounds to the nearest step
            for _ in range(n):
                err_x += ax
                err_y += ay
                sx = err_x >= n
                sy = err_y >= n
                if sx:
                    err_x -= n
                if sy:
                    err_y -= n
                STEP_X.value(1 if sx else 0)
                STEP_Y.value(1 if sy else 0)
                time.sleep_us(HALF_US)
                STEP_X.value(0)
                STEP_Y.value(0)
                time.sleep_us(HALF_US)

        enable.value(0)                            # enable both drivers
        while True:
            move_line(1600, 0)                     # right
            move_line(0, 1600)                     # up
            move_line(-1600, -1600)                # back along the diagonal
            time.sleep(1)
      `,
      notes: ['This runs at a constant speed with no ramp: fine at this slow rate, but for faster moves add the acceleration ramp of the previous page along the path.', 'Do not parse G-code or serve a web page in this loop: any delay stretches a tick and the pulses become uneven. FluidNC keeps pulse generation and communication apart.']
    }
  ]
}
);
