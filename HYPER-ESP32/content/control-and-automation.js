/* HYPER-ESP32 · content/control-and-automation.js
 *
 * Topic "Control and automation" (branch Motion and Control): how a device holds a value or follows a command by
 * measuring the result and correcting it. Open and closed loops, on-off control with hysteresis, PID and its tuning, the
 * sample time and its jitter, filtering the sensor, a thermostat, time-proportioning for slow loads, industrial 4-20 mA
 * and 24 V signals, a line-following robot, a balancing robot, and what every output must do when something fails.
 * Every page that does something has the program in blocks, Arduino C++ and MicroPython; simulations are in
 * sims/control-and-automation.js (ids ca-*).
 */
Hyper.add(
/* ================================================================ open and closed loops */
{
  id: 'open-and-closed-loops',
  parent: 'control-and-automation',
  title: 'Open and closed loops',
  level: 1,
  short: 'Open loop means giving the order and hoping; closed loop means measuring the result and correcting it. Almost every useful machine, from a thermostat to a drone, is the second kind, and the ESP32 is good at it.',
  keywords: ['open loop', 'closed loop', 'feedback', 'control loop', 'setpoint', 'process variable', 'error', 'disturbance', 'negative feedback', 'feedforward', 'actuator', 'sensor', 'controller', 'plant', 'automation'],
  prereq: ['non-blocking-timing', 'analog-input', 'pwm-with-ledc'],
  related: ['on-off-control-and-hysteresis', 'pid-control', 'sample-time-and-jitter', 'safety-in-control', 'position-control', 'electronics:negative-feedback', 'motors:servo-principle'],
  body: `Set the shower tap to a mark and walk away: that is **open loop**. The tap does what you told it, and if the boiler cools or somebody flushes a toilet you find out when you start to shiver. Stand under it and keep adjusting by feel: that is **closed loop**. You *measure* the result, compare it with what you want and correct the difference. Every control system on an ESP32 is one of these two, and most good ones are the second.

### The parts of a loop

- The **setpoint** is what you want, say 50 °C.
- The **process variable** is what you measure: the temperature the sensor reports.
- The **error** is the setpoint minus the process variable. Positive means "too cold, do more".
- The **controller** is your program. It turns the error into a command; [[on-off-control-and-hysteresis|on-off control]] and [[pid-control|PID]] are two ways of doing that.
- The **actuator** is the heater, fan, motor or valve that obeys the command.
- The **process** (the *plant*) is the thing being controlled. It reacts slowly: a temperature does not jump when the power does.
- A **disturbance** is anything else that pushes the process: an open door, a colder room, a heavier load, a flattening battery.

Subtracting the measurement from the setpoint is **negative feedback**: a result that is too high reduces the effort, one that is too low raises it ([[electronics:negative-feedback]]). Get the sign wrong, say a cooling fan that slows down as the box gets hotter, and the loop pushes the error further out until something saturates.

### Open loop is not a sin

An open loop needs no sensor and cannot oscillate. A stepper motor that counts steps, a kiln timer, a fan at a fixed speed, a servo told an angle are all open loop, and all fine *if* the process is well known and nothing disturbs it. The simulation below runs two identical boxes side by side. With the room at 20 °C the fixed power is exactly right. Open the door, or let the heater weaken, and only the closed loop notices.

The price of closing the loop is a sensor, some code and **care**. The sensor has noise ([[filtering-sensor-data]]), the process has delay, and a loop that corrects too hard and too late oscillates. In practice two things go wrong more than any other: the sign, and the rhythm ([[sample-time-and-jitter]]).

### The loop on the ESP32

Every loop in this topic is the same cycle at a steady rhythm: **read** the sensor, **compute** the command, **write** the output, wait for the next tick. The rhythm should be about ten times faster than the process changes: once a second for an oven with a time constant of a minute, every 10 ms for the speed of a motor, every 5 ms for a robot balancing on two wheels.

> [!key] Open loop sets the output and hopes; closed loop measures the result and corrects the error, which makes it robust against disturbances and against ignorance of the process. It needs a sensor, the right sign and a steady rhythm.`,
  ideas: [
    'A closed loop measures the result, subtracts it from the setpoint to get the error, and lets the controller act on the error.',
    'Negative feedback lowers the effort when the result is too high; a wrong sign makes the error grow instead of shrink.',
    'Open loop needs no sensor and cannot oscillate, but it only works when the process is well known and nothing disturbs it.',
    'A loop runs as read, compute, write at a steady rhythm about ten times faster than the process changes.'
  ],
  pitfalls: [
    'Feedback always makes a system better — It corrects disturbances, but it also adds delay and noise to the story. With too much gain, or a late or noisy measurement, a closed loop oscillates or runs away; an open loop never does.',
    'A faster loop is a better loop — The rhythm only has to be fast compared with the process. Going faster reads more noise and wastes processor time; a steady rhythm matters more than a fast one.',
    'The sensor tells the truth — It reports what it measures, where it is. A thermistor that has fallen off the heater reports the room, and the loop heats for ever. The loop needs a second line of defence ([[safety-in-control]]).'
  ],
  terms: [
    { term: 'Setpoint', also: ['SP', 'target', 'reference'], def: 'The value the control loop is asked to hold or reach: 50 °C, 1200 rpm, 90 degrees. It is the input of the loop that the user or a higher level program sets.' },
    { term: 'Process variable', also: ['PV', 'measurement', 'feedback signal'], def: 'The quantity the sensor measures and the loop tries to bring to the setpoint, such as the temperature of a block or the speed of a wheel.' },
    { term: 'Error', also: ['deviation', 'e'], def: 'The setpoint minus the process variable. Its sign says which way to push and its size says how far there is to go.' },
    { term: 'Closed loop', also: ['feedback control', 'feedback loop'], def: 'Control that measures the result of its own output and corrects it, so that disturbances and a poorly known process are compensated.' },
    { term: 'Open loop', also: ['feedforward', 'open-loop control'], def: 'Control that sets the output from a plan or a model and never checks the result: a timer, a fixed fan speed, a stepper counting steps.' },
    { term: 'Disturbance', also: ['load disturbance'], def: 'Anything other than the controller\'s own output that changes the process variable: a door opened, a colder room, a heavier load.' }
  ],
  choose: {
    good: ['Closed loop when a disturbance or an uncertain process can move the result: temperature, speed, position, pressure, level', 'Open loop when the process is known and repeatable and a sensor would cost more than the error: stepper counting, timers, fixed-speed fans', 'Both together: an open-loop guess for the bulk of the effort and feedback for the small correction'],
    avoid: ['Closing a loop around a sensor that is slower, noisier or less trustworthy than the thing it measures', 'Feedback on a quantity nobody can actuate fast enough to matter', 'A closed loop with no limit on the output and no safe state when the sensor fails'],
    check: ['The sign: does more output move the measurement towards the setpoint?', 'How fast the process responds, to choose the rhythm of the loop', 'What the output does when the sensor reads nonsense']
  },
  code: [
    {
      title: 'The smallest closed loop: a proportional fan',
      about: 'A TMP36 temperature sensor measures the air in a box. Ten times a second the program compares the temperature with the 35 °C setpoint: the hotter the box, the faster the fan, 10 % more fan for every degree above the setpoint, from nothing to full speed. This is the proportional part of a controller on its own.',
      needs: 'An ESP32 DevKit, a TMP36 sensor and a four-wire PC fan (12 V; see [[fans-and-pwm-control]]) whose blue control wire takes the PWM signal.',
      wiring: [['GPIO34', 'TMP36 output', '3.3 V → TMP36 → GND, a 100 nF capacitor across the sensor'], ['GPIO26', 'fan control wire (blue)', 'the fan also needs its own 12 V supply and a common ground']],
      blocks: `
        when started
          set PWM on pin (26) frequency (25000) resolution (8)
          set [last v] to (milliseconds since start)

        forever
          if <((milliseconds since start) - (last)) ≥ (100)> then
            change [last v] by (100)
            set [millivolts v] to (analog read pin (34) in millivolts)
            set [temperature v] to (((millivolts) - (500)) / (10))
            set [error v] to ((temperature) - (35))
            set [percent v] to (constrain ((10) * (error)) between (0) and (100))
            set PWM on pin (26) to (map (percent) from (0) (100) to (0) (255))
          end
        end
      `,
      cpp: String.raw`
        const int SENSOR_PIN = 34;             // TMP36 on an ADC1 pin
        const int FAN_PIN = 26;                // control wire of a four-wire fan
        const float SETPOINT = 35.0;           // degrees C: the fan starts above this
        const float KP = 10.0;                 // percent of fan per degree above the setpoint
        const uint32_t SAMPLE_MS = 100;

        uint32_t last = 0;

        float readTemperature() {              // TMP36: 0.5 V at 0 C and 10 mV per degree
          float millivolts = analogReadMilliVolts(SENSOR_PIN);
          return (millivolts - 500.0) / 10.0;
        }

        void setup() {
          ledcAttach(FAN_PIN, 25000, 8);       // 25 kHz, duty 0..255
        }

        void loop() {
          uint32_t now = millis();
          if (now - last >= SAMPLE_MS) {       // a steady rhythm: read, compute, write
            last += SAMPLE_MS;
            float error = readTemperature() - SETPOINT;     // positive: too hot, cool more
            float percent = constrain(KP * error, 0.0, 100.0);
            ledcWrite(FAN_PIN, (int)(percent * 255.0 / 100.0));
          }
        }
      `,
      py: String.raw`
        from machine import Pin, ADC, PWM
        import time

        adc = ADC(Pin(34), atten=ADC.ATTN_11DB)     # TMP36 on an ADC1 pin
        fan = PWM(Pin(26), freq=25000, duty_u16=0)  # control wire of a four-wire fan
        SETPOINT = 35.0                             # degrees C: the fan starts above this
        KP = 10.0                                   # percent of fan per degree above the setpoint
        SAMPLE_MS = 100

        def read_temperature():                     # TMP36: 0.5 V at 0 C and 10 mV per degree
            millivolts = adc.read_uv() / 1000
            return (millivolts - 500.0) / 10.0

        last = time.ticks_ms()
        while True:
            now = time.ticks_ms()
            if time.ticks_diff(now, last) >= SAMPLE_MS:     # a steady rhythm: read, compute, write
                last = time.ticks_add(last, SAMPLE_MS)
                error = read_temperature() - SETPOINT       # positive: too hot, cool more
                percent = min(max(KP * error, 0.0), 100.0)
                fan.duty_u16(int(percent * 65535 / 100))
      `,
      notes: ['A single ADC reading of a TMP36 is noisy, perhaps a degree or two, so the fan speed flutters; [[filtering-sensor-data]] shows the cure.', 'Proportional control alone leaves an offset: the box settles a little above 35 °C, where the fan just removes the heat. The integral term of [[pid-control]] removes it.']
    }
  ],
  quiz: [
    { q: 'A toaster stops after a fixed time whatever the bread looks like. What kind of control is that?', choices: ['Open loop', 'Closed loop with a slow sensor', 'PID', 'On-off with hysteresis'], a: 0, why: 'The timer never looks at the result. It sets the output from a plan, and a disturbance such as colder bread or a cold toaster is not noticed.' },
    { q: 'A cooling fan is wired so that a hotter box makes the fan slower. What does the loop do?', choices: ['Holds the temperature more tightly', 'Makes the error grow until the fan sticks at one end', 'Oscillates gently around the setpoint', 'Nothing: the sign does not matter'], a: 1, why: 'The feedback has the wrong sign, so it is positive: a hotter box gives less cooling, which makes it hotter still. The sign of the loop decides everything else.' },
    { q: 'Which disturbance can only a closed loop correct?', choices: ['A heater whose power has dropped by 20 %', 'A setpoint chosen too high', 'A sensor reading with noise', 'A slow response'], a: 0, why: 'A fixed output has no way of knowing that the heater is weaker; the temperature just ends lower. A closed loop sees the error and raises the effort until it is gone.' },
    { q: 'A process changes over about a minute. Roughly how often should the loop read the sensor and update the output?', choices: ['Every 100 µs', 'About once a second', 'Once a minute', 'Once an hour'], a: 1, why: 'About a tenth of the process time is a good rhythm: fast enough to follow it, slow enough not to read pure noise. Once a minute is too slow to correct anything within a minute.' }
  ],
  applications: [
    'A thermostat, an oven or a 3D-printer hot end holding a temperature.',
    'Cruise control, a quadcopter\'s attitude loop and a robot arm holding its angle.',
    'A greenhouse fan or irrigation valve driven by a sensor instead of a timer.',
    'A sensor-less stepper (open loop) next to a servo with an encoder (closed loop): the same choice at the machine scale.'
  ],
  sources: [
    'Åström and Murray, *Feedback Systems: An Introduction for Scientists and Engineers*, the introduction and the chapter on examples.',
    'Arduino core for ESP32 documentation, the *ADC* and *LEDC* API pages (core 3.3).',
    'Analog Devices, *TMP35, TMP36 and TMP37* datasheet: 10 mV per degree Celsius with 500 mV at 0 °C.'
  ],
  sim: 'ca-loop'
},

/* ================================================================ on-off control and hysteresis */
{
  id: 'on-off-control-and-hysteresis',
  parent: 'control-and-automation',
  title: 'On-off control and hysteresis',
  level: 1,
  short: 'Switch the heater on below the setpoint and off above it. It always oscillates, and without a gap between the two thresholds it chatters; hysteresis is the gap that saves the relay.',
  keywords: ['on-off control', 'bang-bang', 'hysteresis', 'dead band', 'deadband', 'thermostat', 'chatter', 'short cycling', 'Schmitt trigger', 'minimum on time', 'two-position control', 'relay', 'band', 'overshoot'],
  prereq: ['open-and-closed-loops', 'analog-input'],
  related: ['thermostats', 'time-proportioning', 'pid-control', 'filtering-sensor-data', 'relays', 'electronics:schmitt-trigger', 'electronics:comparators'],
  body: `Most thermostats in the world are not clever. The heater is either **on** or **off**: on when the temperature is below the setpoint, off when it is above. That is **on-off control** (also called *bang-bang* or two-position control), and it is the right answer more often than engineers like to admit.

### Why it needs a gap

Try it literally, with one threshold. The temperature creeps past 40.0 °C and the heater switches off. A moment later sensor noise of 0.1 °C pulls the reading below 40.0 °C and the heater switches on again, and again, many times a second. A relay clicks itself to death. The cure is **hysteresis**: two thresholds with a gap between them.

- The heater switches **on** below *setpoint − h/2*.
- It switches **off** above *setpoint + h/2*.
- Between the two it keeps doing whatever it was doing.

So the program needs a memory: one variable, "heating". From the temperature alone it cannot know, in the middle of the band, whether the heater should be on. (It is a state machine with two states: [[what-a-state-machine-is]].) In electronics the same trick is the Schmitt trigger ([[electronics:schmitt-trigger]]), and it belongs on any threshold applied to a noisy signal: a light level that switches a lamp, a water level, a battery cut-off.

### What the gap buys, and costs

The temperature never settles. It swings up and down around the setpoint in a saw-tooth. A wide gap gives a **large swing and few switchings**; a narrow one a small swing and many. Real loops swing more than the gap, because heat takes time to arrive at the sensor: the element keeps warming the air after it is switched off, so the temperature overshoots the upper threshold, and the same delay makes it undershoot the lower one. Add delay in the simulation and watch the swing outgrow the band.

Typical bands: 2 to 4 °C for a refrigerator, 0.3 to 1 °C for a room, 0.5 to 1 °C for an aquarium.

### Protect the switch

A compressor must not restart for some minutes after it stopped, while the pressures equalise, and a relay wears with every operation. So add a **minimum off time** and a **minimum on time**: if the rule says to switch but the last change was too recent, wait. Use timestamps, not \`delay()\` ([[non-blocking-timing]]); the simulation has a slider for it.

### Where on-off stops being enough

It cannot hold a temperature to a tenth of a degree, because the output has nothing between full and nothing, and the swing sets the accuracy. Use it when the load is slow and heavy, the tolerance is wide and the actuator is a relay, a valve or a compressor. When the value must be held precisely, give the controller an output in between: [[pid-control]], and for slow loads [[time-proportioning]].

> [!key] On-off control switches fully on below the setpoint and fully off above it, with a gap (hysteresis) so that noise cannot make it chatter. The gap sets the swing and the switching rate; a minimum on and off time protects relays and compressors.`,
  ideas: [
    'On-off control switches the output fully on or fully off; the temperature always swings around the setpoint.',
    'Hysteresis uses two thresholds so that noise near one level cannot make the output chatter; the program keeps one variable to remember whether it is on.',
    'A wider gap gives a larger swing and fewer switchings; delay between heater and sensor makes the swing larger than the gap.',
    'Relays and compressors need a minimum on and off time, kept with timestamps rather than delay().'
  ],
  pitfalls: [
    'The heater stops exactly at the setpoint — The temperature coasts past the switching point because heat is still travelling from the element to the sensor. It overshoots by an amount that depends on that delay and on the power of the heater.',
    'A narrower gap is always more accurate — It only narrows the nominal band. With noise and delay the output chatters and wears the relay, and the swing hardly improves, because the delay sets a floor to it.',
    'A delay() after each switching prevents the chatter — It hides it and blinds the program for the length of the delay. Use hysteresis for the gap and a timestamp for the minimum on and off times.'
  ],
  terms: [
    { term: 'On-off control', also: ['bang-bang control', 'two-position control'], def: 'A controller whose output is either fully on or fully off: on when the measurement is on one side of the setpoint, off when it is on the other.' },
    { term: 'Hysteresis', also: ['dead band', 'switching differential', 'band'], def: 'A gap between the switch-on and the switch-off thresholds, so that the output does not flip back at once when the measurement wobbles around one level. The state depends on which way the measurement came from.' },
    { term: 'Chatter', also: ['relay chatter', 'bounce around the threshold'], def: 'Rapid switching on and off of an output because noise carries the measurement back and forth over a single threshold.' },
    { term: 'Short cycling', also: ['minimum off time', 'anti-short-cycle'], def: 'Switching a compressor or relay on again soon after it stopped. It wears the part and, for a compressor, can damage it, so a minimum off time is enforced.' }
  ],
  choose: {
    good: ['Slow, heavy loads where a few degrees of swing do not matter: ovens, water tanks, refrigerators, rooms', 'Actuators that only have two positions: relays, solenoid valves, compressors', 'The simplest thing that can possibly work, which is worth a lot when it does'],
    avoid: ['Holding a value to a small fraction of the swing: use PID', 'A single threshold on a noisy signal with no gap', 'A mechanical relay or compressor with no minimum off time'],
    check: ['The sensor noise and delay, to size the gap above them', 'How many operations a day the switch makes at that gap', 'What the load does when the sensor fails ([[safety-in-control]])']
  },
  code: [
    {
      title: 'A heater with hysteresis',
      about: 'A TMP36 measures a heated block. The heater switches on below 39 °C and off above 41 °C, and keeps its state in between. Sixteen readings are averaged to tame the noise before the decision.',
      needs: 'An ESP32 DevKit, a TMP36 sensor and a small low-voltage heater switched by a logic-level MOSFET ([[switching-dc-loads]]). Test with a low-voltage heater, never with mains.',
      wiring: [['GPIO34', 'TMP36 output', '3.3 V → TMP36 → GND, a 100 nF capacitor across the sensor'], ['GPIO26', 'MOSFET gate through 220 Ω', 'with 10 kΩ from the gate to GND']],
      blocks: `
        when started
          set pin (26) to [LOW v]
          set pin (26) as [output v]
          set [heating v] to <false>

        forever
          set [sum v] to (0)
          repeat (16)
            change [sum v] by (analog read pin (34) in millivolts)
          end
          set [temperature v] to ((((sum) / (16)) - (500)) / (10))
          if <(temperature) < (39)> then
            set [heating v] to <true>
          end
          if <(temperature) > (41)> then
            set [heating v] to <false>
          end
          set pin (26) to (heating)
          wait (0.2) seconds
        end
      `,
      cpp: String.raw`
        const int SENSOR_PIN = 34;             // TMP36 on an ADC1 pin
        const int HEATER_PIN = 26;             // gate of the MOSFET
        const float SETPOINT = 40.0;           // degrees C
        const float BAND = 2.0;                // total gap: on below 39, off above 41

        bool heating = false;                  // the memory of the controller

        float readTemperature() {              // the mean of 16 readings, TMP36
          float sum = 0;
          for (int i = 0; i < 16; i++) sum += analogReadMilliVolts(SENSOR_PIN);
          return (sum / 16.0 - 500.0) / 10.0;
        }

        void setup() {
          Serial.begin(115200);
          digitalWrite(HEATER_PIN, LOW);       // off before the pin becomes an output
          pinMode(HEATER_PIN, OUTPUT);
        }

        void loop() {
          float t = readTemperature();
          if (t < SETPOINT - BAND / 2) heating = true;
          if (t > SETPOINT + BAND / 2) heating = false;   // in between: keep the state
          digitalWrite(HEATER_PIN, heating);
          Serial.printf("%.1f C  heater %s\n", t, heating ? "on" : "off");
          delay(200);
        }
      `,
      py: String.raw`
        from machine import Pin, ADC
        import time

        adc = ADC(Pin(34), atten=ADC.ATTN_11DB)   # TMP36 on an ADC1 pin
        heater = Pin(26, Pin.OUT, value=0)        # gate of the MOSFET, off at start
        SETPOINT = 40.0                           # degrees C
        BAND = 2.0                                # total gap: on below 39, off above 41

        heating = False                           # the memory of the controller

        def read_temperature():                   # the mean of 16 readings, TMP36
            total = 0
            for i in range(16):
                total += adc.read_uv() / 1000
            return (total / 16 - 500.0) / 10.0

        while True:
            t = read_temperature()
            if t < SETPOINT - BAND / 2:
                heating = True
            if t > SETPOINT + BAND / 2:           # in between: keep the state
                heating = False
            heater.value(heating)
            print("%.1f C  heater %s" % (t, "on" if heating else "off"))
            time.sleep_ms(200)
      `,
      output: `
        38.7 C  heater on
        39.4 C  heater on
        40.8 C  heater on
        41.3 C  heater off
        40.6 C  heater off
        39.2 C  heater off
        38.9 C  heater on
      `,
      notes: ['Add a minimum on and off time with a timestamp for a relay: [[thermostats]] shows it.', 'Nothing here protects against a sensor that fails; a broken TMP36 can make the heater run for ever. [[safety-in-control]] adds the checks.']
    }
  ],
  quiz: [
    { q: 'A heater is switched on below 20 °C and off above 20 °C, with no gap. The sensor noise is ±0.2 °C. What does the relay do around 20 °C?', choices: ['Stays on', 'Clicks rapidly as the noise crosses the threshold', 'Switches slowly and evenly', 'Does nothing'], a: 1, why: 'Every time the noisy reading crosses 20.0 °C the decision flips. A single threshold on a noisy signal makes the output chatter; hysteresis is the cure.' },
    { q: 'A thermostat with 2 °C of hysteresis around 40 °C reads 40.3 °C. Is the heater on or off?', choices: ['On', 'Off', 'It depends on which way the temperature came', 'The program is wrong'], a: 2, why: '40.3 °C lies inside the band, where the controller keeps its previous state. If it was heating up from below it is on; if it was cooling from above 41 °C it is off. That memory is the whole point of hysteresis.' },
    { q: 'You double the hysteresis of a thermostat. What happens?', choices: ['A larger temperature swing and fewer switchings', 'A smaller swing and fewer switchings', 'A larger swing and more switchings', 'No change'], a: 0, why: 'The temperature has to travel through a wider band between switchings, which takes longer (fewer operations) and spans more degrees (a larger swing).' },
    { q: 'Hysteresis makes the temperature settle exactly at the setpoint.', a: false, why: 'On-off control never settles: it swings between the two thresholds, and the delay between heater and sensor makes it swing even further. Holding a value needs an output between on and off.' }
  ],
  applications: [
    'Refrigerators, freezers and air conditioners, with a minimum off time for the compressor.',
    'Ovens, kettles, aquariums, incubators and terrariums.',
    'A pump that fills a tank between a low and a high float level, which is hysteresis on a level.',
    'A battery cut-off that disconnects at 3.0 V and only reconnects at 3.4 V.'
  ],
  sources: [
    'Åström and Hägglund, *PID Controllers: Theory, Design, and Tuning* (2nd edition), the chapter on on-off control.',
    'Analog Devices, *TMP35, TMP36 and TMP37* datasheet: the output voltage against temperature.',
    'Arduino core for ESP32 documentation, the *GPIO* API page (core 3.3).'
  ],
  sim: 'ca-hysteresis'
},

/* ================================================================ PID control */
{
  id: 'pid-control',
  parent: 'control-and-automation',
  title: 'PID control',
  level: 2,
  short: 'A controller whose output is a number, built from the error now (P), its history (I) and its rate of change (D). It holds a value without chattering; the craft is in the clamp, the anti-windup and the sample time.',
  keywords: ['PID', 'proportional', 'integral', 'derivative', 'Kp', 'Ki', 'Kd', 'windup', 'anti-windup', 'derivative kick', 'offset', 'steady-state error', 'overshoot', 'clamp', 'controller', 'PI controller'],
  prereq: ['open-and-closed-loops', 'on-off-control-and-hysteresis', 'pwm-with-ledc'],
  related: ['pid-tuning', 'sample-time-and-jitter', 'filtering-sensor-data', 'time-proportioning', 'thermostats', 'position-control', 'motors:pid-control', 'math:first-order-odes'],
  body: `On-off control has two outputs. A **PID controller** has a whole range: its output is a number, say 0 to 100 % of heater power, and it computes that number from the error in three ways at once. With the error \`e\` as setpoint minus measurement:

$$u = K_p\\,e + K_i \\int e\\,dt + K_d\\,\\frac{de}{dt}$$

### The three terms

- **P, proportional**: push in proportion to the error now. Twice the error, twice the push. P alone is simple and calm but leaves an **offset**: holding a heater at 50 °C needs, say, 40 % power, and a pure P controller only gives 40 % while there is an error of $40 / K_p$ degrees. The offset shrinks as the gain grows, but a high gain oscillates.
- **I, integral**: add up the error over time. While any error remains the sum keeps growing and so does the output, so I removes the offset. It has a memory, though, so it overshoots, and when the output is stuck at a limit (the heater already at 100 %, still far away) it keeps summing: that is **windup**, and it makes the temperature overshoot long after the error has changed sign.
- **D, derivative**: react to how fast the measurement is changing. It brakes as the temperature races towards the setpoint and damps the overshoot. But the derivative of noise is large, so D amplifies noise, and it needs a filtered measurement.

### In a program

On every sample, with the time \`dt\` since the last one: work out the error; the P term; add \`ki × e × dt\` to the integral; the D term from the change of the measurement; add the three; **clamp** the result to what the actuator can do. Four habits keep it honest:

1. **A steady sample time** and the real \`dt\` in the formulas ([[sample-time-and-jitter]]).
2. **Clamp the output** to its limits, and **stop integrating** while it is clamped and the error would push it further (anti-windup).
3. **Take the derivative of the measurement**, not of the error. Otherwise every change of setpoint makes a spike, the *derivative kick*.
4. **Filter the measurement** before the D term ([[filtering-sensor-data]]).

Some books write the gains as $K_p$, $T_i$ and $T_d$ with $K_i = K_p / T_i$ and $K_d = K_p T_d$; libraries differ, so check which form yours expects.

### Which terms do you need?

A **PI** controller does most of the work: thermal loops, motor speed, pressure. **P** or **PD** suits a position loop, where the motor already integrates speed into position. Add **D** when the process lags and the sensor is clean. In the simulation, start with Ki and Kd at zero and watch the offset; add Ki until it vanishes, and Kd only if the overshoot bothers you. How to find the numbers is the next page, [[pid-tuning]].

> [!key] PID adds three effects to the error: P pushes by the error now, I by its history (removing the offset, risking windup), D by its rate of change (damping, amplifying noise). Clamp the output, stop the integral at the limits, differentiate a filtered measurement, and keep the sample time steady.`,
  ideas: [
    'P pushes in proportion to the error now but leaves an offset; I sums the error and removes the offset; D reacts to the rate of change and damps the overshoot.',
    'Windup is the integral growing while the output is stuck at a limit; stopping the integral at the limits (anti-windup) prevents the overshoot that follows.',
    'Differentiate the measurement, not the error, and filter it: otherwise setpoint changes and noise make the output spike.',
    'A PI controller is the workhorse; D is added when the process lags and the sensor is clean.'
  ],
  pitfalls: [
    'More gain is better — Each gain speeds up the response and also brings the loop closer to oscillation, and the integral and derivative terms bring their own side effects. Tuning is a compromise, not a race.',
    'The I term is a safe cure for any offset — It keeps summing while the output is saturated, so after a long stretch at the limit the loop overshoots wildly. The integral must stop when the output is clamped.',
    'D is for smoothing — D reacts to change, so on a noisy reading it makes the output jump about; derivative of noise is large. It needs a filter, and slow thermal loops usually run without it.'
  ],
  terms: [
    { term: 'PID controller', also: ['three-term controller', 'PID'], def: 'A controller whose output is the sum of a term proportional to the error, one proportional to the integral of the error and one proportional to its rate of change.' },
    { term: 'Integral windup', also: ['windup', 'reset windup'], def: 'The integral term growing without limit while the output is saturated, so that the controller overshoots badly when the error finally changes sign. Anti-windup stops the integral at the limits.' },
    { term: 'Steady-state error', also: ['offset', 'droop'], def: 'The error that remains once the loop has settled. A proportional controller leaves one; an integral term removes it.' },
    { term: 'Derivative kick', also: ['setpoint kick'], def: 'A spike in the output caused by differentiating the error when the setpoint changes in a step. Avoided by differentiating the measurement instead.' },
    { term: 'Proportional gain', also: ['Kp', 'gain'], def: 'The number the error is multiplied by in the P term: output change per unit of error, for instance per cent of power per degree.' }
  ],
  choose: {
    good: ['PI for temperature, speed, pressure, flow and level loops where an offset is not acceptable', 'P or PD for a position loop on a motor that integrates by itself', 'PID with a filtered measurement when the process lags and overshoot matters'],
    avoid: ['Derivative action on a noisy, unfiltered sensor', 'An integral term with no limit on the output and no anti-windup', 'PID on a loop whose actuator is only on or off: use hysteresis, or time-proportioning'],
    check: ['That the loop runs at a steady, known sample time', 'The output limits, and what the integral does when they are reached', 'Whether the gains are in parallel form or in time constants']
  },
  code: [
    {
      title: 'PID on a heated block, with a clamp and anti-windup',
      about: 'A TMP36 measures a heated block that a MOSFET drives with PWM. Every 250 ms a PID step turns the temperature error into a power between 0 and 100 %. The integral stops growing while the output is clamped, the derivative is taken on a lightly filtered measurement, and the sample time is steady.',
      needs: 'An ESP32 DevKit, a TMP36 sensor in good thermal contact with a heated block, and a 12 V heating element switched by a logic-level MOSFET ([[switching-dc-loads]]). The numbers are a starting point: tune them for your block ([[pid-tuning]]). Add the independent protection of [[safety-in-control]] before leaving it on.',
      wiring: [['GPIO34', 'TMP36 output', '3.3 V → TMP36 → GND, a 100 nF capacitor across the sensor'], ['GPIO26', 'MOSFET gate through 220 Ω', 'with 10 kΩ from the gate to GND']],
      blocks: `
        define pid step (setpoint) (measurement) (dt)
          set [error v] to ((setpoint) - (measurement))
          set [derivative v] to ((0) - (((measurement) - (previous)) / (dt)))
          set [previous v] to (measurement)
          set [output v] to ((((kp) * (error)) + (integral)) + ((kd) * (derivative)))
          if <(output) > (100)> then
            set [output v] to (100)
          else if <(output) < (0)> then
            set [output v] to (0)
          else
            change [integral v] by (((ki) * (error)) * (dt))
          end

        when started
          set PWM on pin (26) frequency (1000) resolution (10)
          set [integral v] to (0)
          set [previous v] to (0)
          set [filtered v] to (0)

        every (0.25) seconds
          set [filtered v] to ((filtered) + ((0.3) * (((((analog read pin (34) in millivolts) - (500)) / (10))) - (filtered))))
          pid step (50) (filtered) (0.25) :: my
          set PWM on pin (26) to (map (output) from (0) (100) to (0) (1023))
      `,
      cpp: String.raw`
        const int SENSOR_PIN = 34;                 // TMP36 on an ADC1 pin
        const int HEATER_PIN = 26;                 // gate of the MOSFET
        const float SETPOINT = 50.0;               // degrees C
        const float KP = 8.0, KI = 0.2, KD = 20.0; // percent per degree; per degree-second; seconds
        const uint32_t SAMPLE_MS = 250;

        float integral = 0, previous = 0, filtered = 0;
        uint32_t last = 0;

        float pidStep(float setpoint, float measurement, float dt) {
          float error = setpoint - measurement;
          float derivative = -(measurement - previous) / dt;    // of the measurement, not the error
          previous = measurement;
          float out = KP * error + integral + KD * derivative;
          if (out > 100)     out = 100;                         // clamp the output; no integrating while it is clamped
          else if (out < 0)  out = 0;
          else               integral += KI * error * dt;
          return out;
        }

        void setup() {
          ledcAttach(HEATER_PIN, 1000, 10);                     // 1 kHz, duty 0..1023
          filtered = previous = (analogReadMilliVolts(SENSOR_PIN) - 500.0) / 10.0;
        }

        void loop() {
          uint32_t now = millis();
          if (now - last >= SAMPLE_MS) {                        // a steady sample time
            last += SAMPLE_MS;
            float raw = (analogReadMilliVolts(SENSOR_PIN) - 500.0) / 10.0;
            filtered += 0.3 * (raw - filtered);                 // light filter before the D term
            float power = pidStep(SETPOINT, filtered, SAMPLE_MS / 1000.0);
            ledcWrite(HEATER_PIN, (int)(power * 1023 / 100));
          }
        }
      `,
      py: String.raw`
        from machine import Pin, ADC, PWM
        import time

        adc = ADC(Pin(34), atten=ADC.ATTN_11DB)     # TMP36 on an ADC1 pin
        heater = PWM(Pin(26), freq=1000, duty_u16=0)   # gate of the MOSFET
        SETPOINT = 50.0                             # degrees C
        KP, KI, KD = 8.0, 0.2, 20.0                 # percent per degree; per degree-second; seconds
        SAMPLE_MS = 250

        integral = 0.0
        def read_temperature():
            return (adc.read_uv() / 1000 - 500.0) / 10.0

        previous = filtered = read_temperature()
        def pid_step(setpoint, measurement, dt):
            global integral, previous
            error = setpoint - measurement
            derivative = -(measurement - previous) / dt     # of the measurement, not the error
            previous = measurement
            out = KP * error + integral + KD * derivative
            if out > 100:                                   # clamp the output; no integrating while it is clamped
                out = 100
            elif out < 0:
                out = 0
            else:
                integral += KI * error * dt
            return out

        last = time.ticks_ms()
        while True:
            now = time.ticks_ms()
            if time.ticks_diff(now, last) >= SAMPLE_MS:     # a steady sample time
                last = time.ticks_add(last, SAMPLE_MS)
                raw = read_temperature()
                filtered += 0.3 * (raw - filtered)          # light filter before the D term
                power = pid_step(SETPOINT, filtered, SAMPLE_MS / 1000)
                heater.duty_u16(int(power * 65535 / 100))
      `,
      notes: ['The gains here are in parallel form (the output is Kp·e + I + Kd·de/dt). A library that asks for Ti and Td wants Ki = Kp / Ti and Kd = Kp × Td.', 'The sensor, the heater and the block form a delay; if the loop oscillates, lower KP first. The next page shows how to measure the block instead of guessing.']
    }
  ],
  formulas: [
    {
      name: 'PID output (parallel form)',
      expr: 'u = Kp*err + Ki*s + Kd*d',
      tex: 'u = K_p\\,e + K_i\\,s + K_d\\,d',
      vars: {
        u: { name: 'controller output', signed: true },
        Kp: { name: 'proportional gain', tex: 'K_p', value: 8 },
        err: { name: 'error (setpoint minus measurement)', tex: 'e', signed: true, value: 3 },
        Ki: { name: 'integral gain', tex: 'K_i', value: 0.2 },
        s: { name: 'accumulated error, the sum of e × dt', signed: true, value: 40 },
        Kd: { name: 'derivative gain', tex: 'K_d', value: 20 },
        d: { name: 'rate of change of the error (minus the rate of the measurement)', signed: true, value: -0.5 }
      },
      solveFor: 'u',
      note: 'The three terms of one sample. In a program s is the running sum of e × dt and d the change of the measurement per second with its sign reversed. Solve for the error to see what error a given output needs when the other terms are known.',
      stories: { u: 'A heater loop has Kp = {Kp}, Ki = {Ki} and Kd = {Kd}. The error is {err}, the accumulated error {s} and its rate {d}. What output does the controller ask for, in per cent?' },
      practice: { unknowns: ['u', 'err'] }
    }
  ],
  examples: [
    {
      title: 'Why a P controller settles short',
      q: 'A heater block needs 40 % power to sit at 50 °C. A P-only controller has Kp = 10 % per °C and the output is 0 % when the error is zero. Where does the block settle?',
      steps: ['At equilibrium the controller must give 40 % power, so $K_p\\,e = 40$.', 'The error is $e = 40 / 10 = 4$ °C: the block settles 4 °C below the setpoint, at 46 °C.', 'Doubling Kp to 20 halves the offset to 2 °C but brings the loop nearer to oscillation. An integral term lets the output sit at 40 % with zero error.'],
      a: 'It settles 4 °C short, at 46 °C. Only the integral term removes the offset without raising the gain.'
    }
  ],
  quiz: [
    { q: 'A P-only heater loop settles 4 °C below the setpoint. Which change removes the error without raising Kp?', choices: ['Add integral action', 'Add derivative action', 'Lower the sample rate', 'Filter the sensor more'], a: 0, why: 'The integral keeps growing as long as an error remains, so the output rises to the 40 % that the block needs and the error goes to zero. D only reacts to change and filtering does not move the average.' },
    { q: 'During a long warm-up the heater sits at 100 % for minutes. When the temperature reaches the setpoint it overshoots badly and takes a long time to come back. What went wrong?', choices: ['Derivative kick', 'Integral windup', 'The sample time was too fast', 'The gain was too low'], a: 1, why: 'While the output was clamped the integral kept summing a large error. When the error changed sign the huge integral had to be unwound first. Stopping the integration while the output is clamped prevents it.' },
    { q: 'A derivative term computed on the error makes a spike in the output whenever the setpoint is changed in a step.', a: true, why: 'The error jumps by the size of the step in one sample, and its rate of change is that jump divided by dt, which is huge. Differentiating the measurement avoids it, because the measurement cannot jump.' },
    { q: 'The sensor is noisy, ±0.5 °C, and the loop runs at 100 Hz with a derivative gain. What do you see at the output?', choices: ['Nothing: noise averages out', 'The output jitters strongly, because the derivative of noise is large', 'A smoother output than without D', 'A permanent offset'], a: 1, why: 'A 0.5 °C step between two samples 10 ms apart is a rate of 50 °C/s. Multiplied by Kd it swings the output about. Filter the measurement or drop D.' }
  ],
  applications: [
    'Holding the temperature of a hot end, a reflow oven, a soldering iron or an incubator.',
    'The speed loop of a DC motor with an encoder ([[encoders-and-speed]]).',
    'A drone\'s attitude loops and the angle loop of a balancing robot ([[balancing-robots]]).',
    'Position control of a servo or a stepper with feedback ([[position-control]]).'
  ],
  sources: [
    'Åström and Hägglund, *PID Controllers: Theory, Design, and Tuning* (2nd edition): the algorithm, windup and the derivative term.',
    'Brett Beauregard, *Improving the Beginner\'s PID*, the article series behind the Arduino PID library.',
    'Arduino core for ESP32 documentation, the *LEDC* API page (core 3.3), and the MicroPython quick reference for the ESP32, PWM.'
  ],
  sim: 'ca-pid'
},

/* ================================================================ tuning a PID loop */
{
  id: 'pid-tuning',
  parent: 'control-and-automation',
  title: 'Tuning a PID loop',
  level: 3,
  short: 'Three numbers decide whether a loop is calm, brisk or violent, and they depend on the process. Find them on purpose: by hand, from a step test, by raising the gain to the edge, or by letting the firmware try.',
  keywords: ['PID tuning', 'Ziegler-Nichols', 'ultimate gain', 'step response', 'reaction curve', 'dead time', 'time constant', 'process gain', 'relay autotune', 'M303', 'PID_CALIBRATE', 'overshoot', 'quarter amplitude', 'Kp', 'Ki', 'Kd'],
  prereq: ['pid-control', 'sample-time-and-jitter'],
  related: ['filtering-sensor-data', 'thermostats', 'safety-in-control', 'motors:servo-tuning', 'physics:newtons-law-of-cooling', 'math:first-order-odes'],
  body: `A PID controller has three numbers to set, and the right ones depend on the process: a gain that is calm for an oven makes a motor scream. Tuning is the search for them, and it goes faster when it is done on purpose than when you twiddle.

### What you are looking for

Not "the best" but a compromise you can name: fast enough, overshoot under some per cent, no oscillation that lasts, and still stable when the room is colder or the load heavier. Each gain pulls its own way on a typical lagging process:

| Raise | Rise time | Overshoot | Settling | Offset |
|---|---|---|---|---|
| Kp | shorter | larger | little change | smaller |
| Ki | shorter | larger | longer | removed |
| Kd | little change | smaller | shorter | no effect |

### By hand

Set Ki and Kd to zero. Raise Kp from a small value until the loop answers a setpoint step briskly with a little overshoot. Add Ki, starting small, until the offset goes away in an acceptable time. Add Kd only if the overshoot is still too big and the measurement is clean. Apply a step after every change and watch the whole response.

### Raise the gain to the edge

With P only, raise Kp until the output oscillates steadily. That gain is the **ultimate gain** Ku and the period of the oscillation is Pu. The Ziegler–Nichols rule gives Kp = 0.6 Ku, Ti = Pu / 2, Td = Pu / 8. The response is fast and jumpy, so many people use half that Kp. This method brings the loop to the edge of instability: not for a heater without protection.

### A step test

Open loop, with the process at rest, apply a step to the output and record the response. Read three numbers: the **process gain** K (final change divided by the step), the **dead time** L (the delay before anything happens) and the **time constant** T (from the steepest slope). The Ziegler–Nichols step-response rule is Kp = 1.2 T / (K L), Ti = 2 L, Td = L / 2. Nothing oscillates, which makes it the safer test, and the simulation draws the construction. The program below logs the curve.

### Let the firmware do it

Relay autotuning switches the output between two levels around the setpoint and measures the small oscillation that follows, which gives Ku and Pu with a bounded amplitude. 3D-printer firmware does it: M303 in Marlin, PID_CALIBRATE in Klipper.

### Check the result

Test steps up and down, a disturbance, and both ends of the working range: a loop that is calm at 40 °C may oscillate at 180 °C, where the process responds differently.

> [!key] Tune by measuring the process, not by guessing: a step test gives gain, dead time and time constant, and a rule turns them into gains. Treat the rule's answer as a start, test it across the working range, and never push a loop to oscillation on a load that is not protected.`,
  ideas: [
    'Raising Kp speeds the loop and increases overshoot; Ki removes the offset at the price of overshoot; Kd damps overshoot but amplifies noise.',
    'A step test measures the process gain, the dead time and the time constant; the Ziegler-Nichols step-response rule turns them into Kp, Ti and Td.',
    'The ultimate-gain method raises P until the loop oscillates steadily; it is quick and brings the loop to the edge of instability.',
    'Rule-of-thumb gains are a start: check steps up and down, disturbances and the whole working range, and usually soften them with a lower Kp and a longer integral time.'
  ],
  pitfalls: [
    'The Ziegler-Nichols numbers are the final answer — They aim at fast recovery and often leave 20 to 70 % overshoot. Treat them as a start and soften them: lower Kp and lengthen Ti.',
    'Tune once and it holds everywhere — The process changes with the operating point: a heater at 200 °C loses heat faster than at 40 °C, a loaded motor is slower than a free one. Test both ends of the range.',
    'Pushing the loop into oscillation is a harmless test — On a heater, a motor or anything with limits it is not. Use a step test, or a relay autotune that bounds the amplitude, and keep an independent over-temperature cut-out.'
  ],
  terms: [
    { term: 'Process gain', also: ['plant gain', 'K'], def: 'The size of the steady change of the measurement for a given change of the output, for example 0.8 °C of temperature per per cent of heater power.' },
    { term: 'Dead time', also: ['delay', 'transport lag', 'L'], def: 'The time between a change of the output and the first sign of it at the sensor. It limits how hard a loop can be tuned.' },
    { term: 'Time constant', also: ['T', 'tau', 'lag'], def: 'The time a first-order process takes to cover about 63 % of its way to the new value after a step. A heated block can have 30 s or several minutes.' },
    { term: 'Ultimate gain', also: ['critical gain', 'Ku'], def: 'The proportional gain at which a loop with P only just oscillates steadily. The period of that oscillation is the ultimate period Pu.' },
    { term: 'Autotune', also: ['relay autotuning', 'M303', 'PID_CALIBRATE'], def: 'A routine in which the controller switches its output between two levels, measures the resulting small oscillation and computes PID gains from its size and period.' }
  ],
  choose: {
    good: ['A step test for a process that is slow and safe to leave alone: a heater, a tank', 'Hand tuning with a plot when you have a feel for the machine and a quick response', 'Relay autotune where the firmware offers it and the amplitude is bounded'],
    avoid: ['Raising the gain until it oscillates on a load that can overheat or crash', 'Gains copied from a project with a different heater, motor or sensor', 'Tuning with the measurement unfiltered when the final loop will use a filter: the filter changes the answer'],
    check: ['That the sample time and the filter in the test are the ones the loop will use', 'The overshoot on a step up, a step down and a disturbance', 'Behaviour at both ends of the working range']
  },
  code: [
    {
      title: 'Log a step response',
      about: 'Applies 50 % power to a block at rest and prints the temperature once a second for five minutes as comma-separated values, ready for a spreadsheet or the serial plotter. The test stops early and switches the heater off if the block reaches 80 °C. From the curve read the gain, the dead time and the time constant.',
      needs: 'The heated block of [[pid-control]]: an ESP32 DevKit, a TMP36 and a MOSFET-switched 12 V heater. Let the block cool to room temperature before the test.',
      wiring: [['GPIO34', 'TMP36 output', '3.3 V → TMP36 → GND, a 100 nF capacitor across the sensor'], ['GPIO26', 'MOSFET gate through 220 Ω', 'with 10 kΩ from the gate to GND']],
      blocks: `
        when started
          start serial at (115200) baud
          print [seconds,celsius,percent]
          set PWM on pin (26) frequency (1000) resolution (10)
          set [n v] to (0)
          set [running v] to <true>
          set PWM on pin (26) to (map (50) from (0) (100) to (0) (1023))

        every (1) seconds
          if <running> then
            set [sum v] to (0)
            repeat (16)
              change [sum v] by (analog read pin (34) in millivolts)
            end
            set [temperature v] to ((((sum) / (16)) - (500)) / (10))
            print (join (join (join (n) [,]) (temperature)) [,50])
            change [n v] by (1)
            if <<(temperature) > (80)> or <(n) ≥ (300)>> then
              set PWM on pin (26) to (0)
              set [running v] to <false>
            end
          end
      `,
      cpp: String.raw`
        const int SENSOR_PIN = 34;              // TMP36 on an ADC1 pin
        const int HEATER_PIN = 26;              // gate of the MOSFET
        const int STEP_PERCENT = 50;            // the step applied to the heater at the start
        const float STOP_AT = 80.0;             // degrees C: stop early if the block gets this hot
        const int SAMPLES = 300;                // one per second: five minutes

        int n = 0;
        uint32_t last = 0;
        bool running = true;

        float readTemperature() {               // the mean of 16 readings, TMP36
          float sum = 0;
          for (int i = 0; i < 16; i++) sum += analogReadMilliVolts(SENSOR_PIN);
          return (sum / 16.0 - 500.0) / 10.0;
        }

        void setup() {
          Serial.begin(115200);
          Serial.println("seconds,celsius,percent");
          ledcAttach(HEATER_PIN, 1000, 10);
          ledcWrite(HEATER_PIN, STEP_PERCENT * 1023 / 100);     // the step
        }

        void loop() {
          uint32_t now = millis();
          if (running && now - last >= 1000) {
            last += 1000;
            float t = readTemperature();
            Serial.printf("%d,%.2f,%d\n", n, t, STEP_PERCENT);
            n++;
            if (t > STOP_AT || n >= SAMPLES) {                  // never leave the heater on
              ledcWrite(HEATER_PIN, 0);
              running = false;
            }
          }
        }
      `,
      py: String.raw`
        from machine import Pin, ADC, PWM
        import time

        adc = ADC(Pin(34), atten=ADC.ATTN_11DB)     # TMP36 on an ADC1 pin
        heater = PWM(Pin(26), freq=1000, duty_u16=0)   # gate of the MOSFET
        STEP_PERCENT = 50                           # the step applied to the heater at the start
        STOP_AT = 80.0                              # degrees C: stop early if the block gets this hot
        SAMPLES = 300                               # one per second: five minutes

        def read_temperature():                     # the mean of 16 readings, TMP36
            total = 0
            for i in range(16):
                total += adc.read_uv() / 1000
            return (total / 16 - 500.0) / 10.0

        print("seconds,celsius,percent")
        heater.duty_u16(STEP_PERCENT * 65535 // 100)    # the step
        n = 0
        last = time.ticks_ms()
        running = True
        while running:
            now = time.ticks_ms()
            if time.ticks_diff(now, last) >= 1000:
                last = time.ticks_add(last, 1000)
                t = read_temperature()
                print("%d,%.2f,%d" % (n, t, STEP_PERCENT))
                n += 1
                if t > STOP_AT or n >= SAMPLES:         # never leave the heater on
                    heater.duty_u16(0)
                    running = False
      `,
      output: `
        seconds,celsius,percent
        0,21.40,50
        1,21.41,50
        2,21.48,50
        3,21.77,50
        4,22.30,50
        …
      `,
      notes: ['Paste the lines into a spreadsheet and draw the curve. The delay before it lifts is the dead time L, the final rise divided by the step is the gain K, and the time constant T comes from the steepest slope: draw the tangent as in the simulation.', 'The step is applied at the first line: start from a block that has cooled to room temperature, and repeat the test with a different step size to see whether the process is linear.']
    }
  ],
  formulas: [
    {
      name: 'Ziegler–Nichols PID gain from a step test',
      expr: 'Kp = 1.2*T/(K*L)',
      tex: 'K_p = \\frac{1.2\\,T}{K\\,L}',
      vars: {
        Kp: { name: 'proportional gain, per cent of output per degree', tex: 'K_p' },
        T: { name: 'time constant of the process', q: 'time', unit: 's', value: 40 },
        K: { name: 'process gain, degrees per per cent of output', value: 0.8, min: 0.001 },
        L: { name: 'dead time', q: 'time', unit: 's', value: 6 }
      },
      solveFor: 'Kp',
      note: 'The step-response rule of Ziegler and Nichols for a PID controller. The integral time is Ti = 2 L and the derivative time Td = L / 2, with Ki = Kp / Ti and Kd = Kp × Td. It suits processes whose dead time is a fraction of the time constant, and it usually overshoots: soften it before use.',
      stories: { Kp: 'A step test on a heated block shows a gain of {K} degrees per per cent, a dead time of {L} and a time constant of {T}. What proportional gain does the step-response rule suggest?' },
      practice: { unknowns: ['Kp'] }
    },
    {
      name: 'First-order response to a step',
      expr: 'y = yf + (y0 - yf)*exp(-t/tau)',
      tex: 'y = y_f + (y_0 - y_f)\\,e^{-t/\\tau}',
      vars: {
        y: { name: 'temperature at time t', q: 'temperature', unit: '°C' },
        yf: { name: 'final temperature', q: 'temperature', unit: '°C', value: 60, tex: 'y_f' },
        y0: { name: 'starting temperature', q: 'temperature', unit: '°C', value: 20, tex: 'y_0' },
        t: { name: 'time since the step', q: 'time', unit: 's', value: 40 },
        tau: { name: 'time constant', q: 'time', unit: 's', value: 40, min: 0.001 }
      },
      solveFor: 'y',
      note: 'What a heated block or a motor speed does after a step in the input, once the dead time has passed. After one time constant it has covered 63 % of the way, after three 95 %. Solve for t to see how long a given temperature takes.',
      stories: { y: 'A block at {y0} is heated towards {yf} with a time constant of {tau}. What is its temperature {t} after the heater is switched on?' },
      practice: { unknowns: ['y', 't'] }
    }
  ],
  examples: [
    {
      title: 'Gains from a logged step',
      q: 'A step of 50 % on a heated block lifts the temperature from 21 °C and settles at 61 °C. The curve starts to rise after 6 s, and the tangent at the steepest point reaches the final value 40 s after the dead time. What PID gains does the Ziegler–Nichols step-response rule give?',
      steps: ['The gain is the change divided by the step: $K = (61 - 21)/50 = 0.8$ °C per per cent.', 'The dead time is $L = 6$ s and the time constant $T = 40$ s.', '$K_p = 1.2\\,T/(K\\,L) = 1.2 \\times 40 / (0.8 \\times 6) = 10$ per cent per °C.', '$T_i = 2L = 12$ s gives $K_i = K_p/T_i = 0.83$, and $T_d = L/2 = 3$ s gives $K_d = K_p\\,T_d = 30$.'],
      a: 'Kp = 10, Ki ≈ 0.83, Kd = 30. These are aggressive: soften them, with half of Kp and twice the Ti, and compare with the simulation.'
    }
  ],
  quiz: [
    { q: 'You set Ki and Kd to zero and raise Kp until the loop oscillates steadily with a period of 20 s at Kp = 12. By the ultimate-gain rule, what are Kp and Ti?', choices: ['Kp = 7.2 and Ti = 10 s', 'Kp = 12 and Ti = 20 s', 'Kp = 2.4 and Ti = 40 s', 'Kp = 7.2 and Ti = 2.5 s'], a: 0, why: 'Kp = 0.6 Ku = 7.2 and Ti = Pu / 2 = 10 s (with Td = Pu / 8 = 2.5 s). The rule gives a lively response, so many people start from half of it.' },
    { q: 'Why is the step test safer than the ultimate-gain method on a heater?', choices: ['It is faster', 'Nothing has to oscillate: the output stays at a fixed, known level', 'It needs no sensor', 'It gives better gains'], a: 1, why: 'A fixed step on the output cannot run away, and you can stop it at any moment. The ultimate-gain method pushes the loop to the edge of instability, where a small error in gain makes it grow.' },
    { q: 'The Ziegler–Nichols settings are usually the final tuning of a loop.', a: false, why: 'They aim at quick recovery from disturbances and often leave 20 to 70 % overshoot. Most loops are softened afterwards, by lowering Kp and lengthening Ti, and checked at both ends of the working range.' },
    { q: 'A loop tuned at 40 °C oscillates when the setpoint is 180 °C. What is the most likely reason?', choices: ['The sensor is broken', 'The process responds differently at the higher temperature, so the same gains are too high', 'The integral term is too small', 'The sample time is too fast'], a: 1, why: 'Heat losses rise steeply with temperature, so the gain and the time constant of the process change. Gains found at one operating point need to be checked at the others.' }
  ],
  applications: [
    'Calibrating the hot end and the bed of a 3D printer with the firmware\'s autotune.',
    'A reflow oven or a sous-vide cooker that must follow a profile without overshooting.',
    'The speed loop of a DC motor on a robot, tuned from a logged step.',
    'Any loop in a product that is tuned once at the bench and then has to keep working in the field.'
  ],
  history: 'John Ziegler and Nathaniel Nichols published their two rules in 1942, while working at the Taylor Instrument Companies. Their numbers are still the starting point of most tuning guides.',
  sources: [
    'Åström and Hägglund, *PID Controllers: Theory, Design, and Tuning* (2nd edition): tuning methods and relay autotuning.',
    'Ziegler and Nichols, *Optimum Settings for Automatic Controllers*, Transactions of the ASME, 1942.',
    'The Marlin documentation of the M303 command and the Klipper documentation of PID_CALIBRATE.'
  ],
  sim: 'ca-tuning'
},

/* ================================================================ sample time and jitter */
{
  id: 'sample-time-and-jitter',
  parent: 'control-and-automation',
  title: 'Sample time and jitter',
  level: 3,
  short: 'A controller is written for one sample time. When passes arrive late or unevenly, the integral and the derivative are computed for the wrong interval and the loop gets worse. Make the rhythm steady, use the real elapsed time, and sample at about a tenth of the process time.',
  keywords: ['sample time', 'jitter', 'sampling period', 'timer', 'fixed rate', 'dt', 'xTaskDelayUntil', 'vTaskDelayUntil', 'hardware timer', 'esp_timer', 'garbage collection', 'blocking', 'latency', 'control loop rate', 'micros'],
  prereq: ['pid-control', 'hardware-timers', 'non-blocking-timing'],
  related: ['tasks', 'priorities-and-scheduling', 'delays-and-yielding', 'filtering-sensor-data', 'pid-tuning', 'balancing-robots', 'electronics:sampling-nyquist'],
  body: `Every discrete controller is written for a particular **sample time**. The integral adds \`Ki × error × dt\` each pass and the derivative divides by \`dt\`. If the \`dt\` in the formulas is not the time that really passed, the gains are wrong by that ratio, and wrong differently on every pass.

### What jitter does

Suppose the loop is meant to run every 10 ms, but some passes arrive 40 ms after the last because the program printed a line, scanned for Wi-Fi networks, waited for a sensor or wrote to flash. A controller that still assumes 10 ms sums a quarter of the integral it should and divides a four times bigger change of the measurement by 10 ms: the derivative spikes and the output jerks. The simulation runs one loop with an assumed and with a true \`dt\`.

There are two cures, and you want both: **use the real elapsed time** in the formulas, and **remove the cause** of the lateness.

### Make the rhythm steady

- **Do not set the rhythm with \`delay()\`** in a loop that also does work: the period becomes the delay plus the work. Compare timestamps and add the period to the last deadline, or let a timer start each pass: a hardware timer that sets a flag ([[hardware-timers]]), a FreeRTOS task using \`xTaskDelayUntil\` (the Arduino core ticks every millisecond), or a periodic \`esp_timer\`.
- **Give control its own task** at a high priority, and put Wi-Fi, logging and displays in others ([[tasks]], [[priorities-and-scheduling]]). Never print, wait for the network or write flash inside the control pass.
- **MicroPython** wanders by milliseconds, because the garbage collector and the interpreter are not predictable. That is fine for a heater at 1 Hz and marginal for a motor at 1 kHz, where C++ is the right tool.
- **Sensors take time too.** A DS18B20 needs up to 750 ms to convert at 12 bits: start the conversion, do other things, read it later. The sensor then sets how fast the loop can usefully run.

### How fast should it be?

Too slow, and the output is held for a whole period between corrections, which adds on average half a sample of delay: a gain that is stable at 10 ms can oscillate at 200 ms. Too fast, and the loop reads noise; the change per sample drops below one step of the converter and the derivative alternates between zero and a spike. A good rule is about **a tenth of the process time constant** (or of the dead time, if that is shorter): 1 to 5 s for an oven with a minute's time constant, 2 to 5 ms for a motor, 5 ms for a balancing robot ([[balancing-robots]]).

### Measure it

The program below runs a pass every 10 ms from a timer and reports the shortest and the longest interval it actually saw. Print only once a second: the printing itself is a source of jitter.

> [!key] A controller assumes a sample time. Use a timer to make it true, measure the real interval in the formulas, and sample at about a tenth of the process time constant: a steady slow loop beats a fast one that wobbles.`,
  ideas: [
    'The integral and the derivative assume a time step; a pass that is late makes them wrong by the ratio of the real to the assumed interval.',
    'Use the real elapsed time in the formulas, and remove the causes of lateness: blocking calls, printing, networking and flash writes.',
    'Start each pass from a timer or a fixed-period task, not from delay() inside a loop that also works; give control a high priority.',
    'Sample at about a tenth of the process time constant: slower adds delay and instability, faster reads noise and wastes time.'
  ],
  pitfalls: [
    'A faster loop is always better — Past the point where the process cannot change between samples a faster loop only reads noise, and the derivative of noise grows as the interval shrinks. A steady loop at a sensible rate beats a fast, uneven one.',
    'delay(10) gives a 10 ms loop — It gives 10 ms plus the time the rest of the pass takes, which changes with every branch and every print. Use a timestamp or a timer to fix the period.',
    'The interrupt is the control loop — A timer interrupt should only set a flag or wake a task. A long computation inside an interrupt handler blocks everything else and can trip the watchdog.'
  ],
  terms: [
    { term: 'Sample time', also: ['sampling period', 'loop period', 'Ts', 'dt'], def: 'The time between two passes of a control loop. The integral and derivative terms are computed for it, so it should be steady and known.' },
    { term: 'Jitter', also: ['timing jitter', 'period jitter'], def: 'The variation of the interval between passes: some come early or late compared with the nominal period.' },
    { term: 'Zero-order hold', also: ['ZOH', 'held output'], def: 'The way a sampled controller drives its actuator: the output stays at its last value until the next pass. It adds on average half a sample time of delay.' },
    { term: 'Aliasing', also: ['sampling too slowly'], def: 'The false slow signal that appears when something changes faster than half the sampling rate, so that a rapid vibration looks like a slow drift to the controller.' }
  ],
  choose: {
    good: ['A fixed-period FreeRTOS task for a loop that must run on time beside Wi-Fi and displays', 'A hardware timer that sets a flag, when the pass itself is short', 'Timestamps with a catch-up deadline for a slow loop at 1 Hz'],
    avoid: ['delay() as the rhythm of a loop that also reads and computes', 'A fixed dt in the formulas for a loop whose real interval wanders', 'Printing, scanning or writing flash inside a pass that must be on time'],
    check: ['The real minimum and maximum interval, measured on the finished program', 'That the sample time is about a tenth of the process time constant', 'What the loop does after a pass that took much too long']
  },
  code: [
    {
      title: 'A steady 100 Hz loop that reports its own jitter',
      about: 'A timer fires every 10 ms and each pass uses the real time since the last one. Once a second the program prints the shortest and the longest interval it saw and how many passes were late. Put your read, compute and write steps where the comment says.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          start a timer that fires every (10) milliseconds :: time
          set [last v] to (microseconds since start)
          set [shortest v] to (1000000)
          set [longest v] to (0)
          set [passes v] to (0)

        when timer fires
          set [now v] to (microseconds since start)
          set [dt v] to ((now) - (last))
          set [last v] to (now)
          if <(dt) < (shortest)> then
            set [shortest v] to (dt)
          end
          if <(dt) > (longest)> then
            set [longest v] to (dt)
          end
          read, compute and write using (dt) :: my
          change [passes v] by (1)
          if <((passes) mod (100)) = (0)> then
            print (join (join [shortest ] (shortest)) (join [ us, longest ] (longest)))
            set [shortest v] to (1000000)
            set [longest v] to (0)
          end
      `,
      cpp: String.raw`
        hw_timer_t *timer = nullptr;
        volatile uint32_t ticks = 0;               // counted by the timer
        uint32_t handled = 0, lastUs = 0, shortest = 1000000, longest = 0, late = 0;

        void IRAM_ATTR onTimer() {                 // the handler only counts: the work is done in loop()
          ticks++;
        }

        void setup() {
          Serial.begin(115200);
          timer = timerBegin(1000000);             // 1 MHz: one tick is 1 microsecond
          timerAttachInterrupt(timer, &onTimer);
          timerAlarm(timer, 10000, true, 0);       // every 10 ms, repeating
          lastUs = micros();
        }

        void loop() {
          if (ticks == handled) return;            // nothing is due yet
          if (ticks - handled > 1) late++;         // a pass took longer than the period
          handled = ticks;
          uint32_t now = micros();
          uint32_t dt = now - lastUs;              // the real time since the last pass
          lastUs = now;
          if (dt < shortest) shortest = dt;
          if (dt > longest) longest = dt;
          // read, compute and write here, using dt / 1e6 seconds in the formulas
          if (handled % 100 == 0) {                // once a second
            Serial.printf("shortest %lu us, longest %lu us, late %lu\n", (unsigned long)shortest, (unsigned long)longest, (unsigned long)late);
            shortest = 1000000; longest = 0;
          }
        }
      `,
      py: String.raw`
        from machine import Timer
        import time

        ticks = 0                                  # counted by the timer
        handled = 0
        late = 0
        shortest = 1000000
        longest = 0

        def on_timer(t):                           # the callback only counts: the work is done below
            global ticks
            ticks += 1

        timer = Timer(0)
        timer.init(period=10, mode=Timer.PERIODIC, callback=on_timer)   # every 10 ms, repeating
        last = time.ticks_us()

        while True:
            if ticks == handled:                   # nothing is due yet
                continue
            if ticks - handled > 1:                # a pass took longer than the period
                late += 1
            handled = ticks
            now = time.ticks_us()
            dt = time.ticks_diff(now, last)        # the real time since the last pass
            last = now
            shortest = min(shortest, dt)
            longest = max(longest, dt)
            # read, compute and write here, using dt / 1e6 seconds in the formulas
            if handled % 100 == 0:                 # once a second
                print("shortest", shortest, "us, longest", longest, "us, late", late)
                shortest = 1000000
                longest = 0
      `,
      output: `
        shortest 9988 us, longest 10013 us, late 0
        shortest 9990 us, longest 10010 us, late 0
        shortest 9987 us, longest 14032 us, late 0
      `,
      notes: ['The occasional long interval, here 14 ms, is usually the print of the previous second: the line is written after the interval has been measured, and it delays the next pass. Move the printing to another task, or print less often.', 'In MicroPython a timer callback is a scheduled function (hard interrupts are not available on the ESP32 port), so intervals wander by a millisecond or more, and a garbage collection can add several.']
    }
  ],
  quiz: [
    { q: 'A PID loop is written for dt = 10 ms but one pass arrives 40 ms after the previous one. If the code still uses 10 ms, what goes wrong?', choices: ['Nothing: dt is only a label', 'The integral grows too little and the derivative comes out four times too large', 'The proportional term is wrong', 'The output saturates for ever'], a: 1, why: 'The integral adds Ki × error × 10 ms instead of × 40 ms, a quarter of what it should, and the derivative divides a change that took 40 ms by 10 ms: four times too much. Using the measured interval fixes both.' },
    { q: 'Which is the best way to get a fixed 5 ms control pass beside Wi-Fi traffic on an ESP32?', choices: ['delay(5) at the end of loop()', 'A high-priority task that waits with xTaskDelayUntil, with the networking in other tasks', 'Run the control inside the Wi-Fi event callback', 'A for loop that counts to 5000'], a: 1, why: 'A fixed-period delay in a task of its own keeps the period steady whatever the other tasks do; delay(5) adds the work time to the period, and the callback and the busy loop block other work.' },
    { q: 'A loop that is stable at 10 ms is run at 200 ms with the same gains. What may happen?', choices: ['It becomes more stable', 'It can oscillate, because the held output adds delay', 'Nothing changes', 'The integral term disappears'], a: 1, why: 'Each output is held for a whole sample, which adds on average half a sample of delay (100 ms here). Delay in a loop reduces the gain it can stand.' },
    { q: 'Sampling much faster than the process can change is harmless.', a: false, why: 'The loop reads more noise, uses more processor time, and the derivative term, which divides by dt, amplifies the noise further; between two fast samples the signal may change by less than one step of the converter.' }
  ],
  applications: [
    'The angle loop of a balancing robot, which needs a steady 200 Hz or more.',
    'Motor speed and current loops that run every few milliseconds beside Wi-Fi.',
    'A slow thermal loop at 1 Hz that must still not be thrown off by a Wi-Fi scan.',
    'Logging the sample times of a control loop in the field to find the pass that was late.'
  ],
  sources: [
    'Åström and Wittenmark, *Computer-Controlled Systems*, the chapters on sampling and on the choice of sampling period.',
    'Espressif, *ESP-IDF Programming Guide*, FreeRTOS: vTaskDelayUntil and the system tick; General Purpose Timer and High Resolution Timer.',
    'Arduino core for ESP32 documentation, the *Timer* API page (core 3.3), and the MicroPython documentation of machine.Timer.'
  ],
  sim: 'ca-jitter'
},

/* ================================================================ filtering sensor data */
{
  id: 'filtering-sensor-data',
  parent: 'control-and-automation',
  title: 'Filtering sensor data',
  level: 2,
  short: 'Every sensor reading is the truth plus noise and the odd wild value. A moving average, an exponential average and a median clean it up, each at a price in lag, and a control loop should always differentiate a filtered signal.',
  keywords: ['filter', 'moving average', 'exponential moving average', 'EMA', 'median filter', 'low-pass', 'noise', 'spike', 'outlier', 'oversampling', 'lag', 'alpha', 'smoothing', 'derivative noise', 'despike'],
  prereq: ['analog-input', 'oversampling-and-noise'],
  related: ['reading-sensors-reliably', 'pid-control', 'sample-time-and-jitter', 'rc-filters-and-debounce', 'debouncing', 'sensor-calibration', 'electronics:rc-low-pass', 'electronics:noise-snr'],
  body: `A sensor gives you the truth plus an error: noise from the converter and from the wires, spikes when a motor or a relay switches nearby, and steps because the converter only has so many levels. A control loop takes every wobble as something to correct. Filtering removes the wobble, and charges for it in **lag**.

### Three filters that are enough

- **Moving average of N samples.** Add up the last N and divide by N. Random noise falls by √N, and the signal is delayed by (N − 1) / 2 samples. It needs a buffer of N values.
- **Exponential average (EMA).** \`y += α (x − y)\`: one line, one variable, one multiplication, with 0 < α ≤ 1. A smaller α smooths more and lags more. For a sample period \`dt\` and a wanted time constant τ, take α = dt / (τ + dt). For white noise the amplitude falls by √(α / (2 − α)): α = 0.1 gives 0.23, about a quarter.
- **Median of N** (N odd, 3 to 7). Sort the last N and take the middle one. A single wild reading never gets through, and a real step passes with at most N / 2 samples of delay and a sharp edge. Averaging smears a spike over N samples; the median removes it.

A common pairing is a median of 3 or 5 to remove spikes, followed by an EMA to smooth what is left. The simulation lets you compare them on a noisy ramp, a step and a signal with spikes.

### The price is lag

A filter delays the signal, so the loop sees the world as it was a moment ago. Inside a control loop that costs stability: a filter slower than the process makes the loop oscillate. Keep its time constant well under that of the process, a fifth or less, and filter only as much as you need.

### Before you differentiate

The derivative term divides a difference of two readings by \`dt\`. With a noise of 0.5 °C and \`dt\` of 10 ms that is a rate of 50 °C/s of pure nonsense, multiplied by Kd. So always differentiate a filtered measurement ([[pid-control]]), or put a filter on the D path only and leave P and I with a lighter one.

### Reduce the noise at the source

Averaging many ADC readings in a burst is a filter too ([[oversampling-and-noise]]). Put 100 nF across the sensor and the pin, keep analogue wires short, twisted and away from motor and relay wiring, and do not read while a heavy load switches. Digital inputs have their own filter, the debounce ([[debouncing]]).

> [!key] Remove spikes with a median, smooth the rest with an exponential or moving average, and accept the lag they cost: keep it well under the process time constant. Always differentiate a filtered measurement.`,
  ideas: [
    'A moving average of N samples cuts random noise by √N and delays the signal by (N − 1) / 2 samples.',
    'The exponential average y += α (x − y) needs one variable; α = dt / (τ + dt) sets its time constant.',
    'A median of three to seven samples removes spikes without rounding off real steps; averaging smears them.',
    'Every filter adds lag; in a control loop keep it well below the process time constant, and filter before taking a derivative.'
  ],
  pitfalls: [
    'More filtering is always better — Every filter adds delay, and delay inside a control loop makes it oscillate. Filter only enough to bring the noise under what the controller can tolerate.',
    'An average removes spikes — It spreads a spike over N samples at 1/N of its height. A median of three to five removes the spike altogether.',
    'Filtering fixes a wrong sensor — A filter cleans noise; it does not correct an offset, a wrong gain or a sensor in the wrong place. For those see [[sensor-calibration]].'
  ],
  terms: [
    { term: 'Moving average', also: ['boxcar filter', 'running average', 'SMA'], def: 'The mean of the last N samples, recomputed with each new one. It reduces random noise by √N and delays the signal by about half the window.' },
    { term: 'Exponential moving average', also: ['EMA', 'exponential smoothing', 'first-order low-pass', 'IIR filter'], def: 'A filter that moves its output a fraction α of the way towards each new sample: y += α (x − y). It needs one variable and behaves like an RC low-pass filter.' },
    { term: 'Median filter', also: ['despiking'], def: 'A filter that outputs the middle value of the last few samples. It removes isolated wild readings completely and keeps steps sharp.' },
    { term: 'Lag', also: ['filter delay', 'phase lag'], def: 'The delay a filter adds between the real signal and its filtered version. In a control loop it reduces stability.' },
    { term: 'Time constant of a filter', also: ['τ', 'smoothing time'], def: 'The time an exponential filter takes to cover about 63 % of a step, equal to dt (1 − α) / α for an EMA with factor α at sample period dt.' }
  ],
  choose: {
    good: ['An EMA for steady smoothing of an analogue reading at almost no cost', 'A median of 3 to 5 for spikes from motors, relays and radio bursts', 'Both in series: median first, then EMA'],
    avoid: ['A long moving average inside a fast control loop', 'An unfiltered measurement into a derivative term', 'Averaging as a cure for outliers: a median does it properly'],
    check: ['The lag of the filter against the time constant of the process', 'Whether the noise is random (averaging helps) or spiky (median helps)', 'That the filter starts from the first reading, not from zero']
  },
  code: [
    {
      title: 'A median and an exponential filter, for the serial plotter',
      about: 'Reads an analogue sensor every 10 ms, removes single wild readings with a median of five, smooths the rest with an exponential filter of α = 0.1 (a time constant of about 90 ms) and prints the raw and the filtered value as labelled pairs that the Arduino IDE serial plotter draws as two lines.',
      needs: 'An ESP32 DevKit and any analogue sensor on an ADC1 pin: a potentiometer on GPIO34 will do. Tap the wire to see the spikes.',
      wiring: [['GPIO34', 'sensor output or potentiometer wiper', '3.3 V → potentiometer → GND']],
      blocks: `
        when started
          start serial at (115200) baud
          set [smooth v] to (analog read pin (34) in millivolts)
          set [last v] to (milliseconds since start)

        forever
          if <((milliseconds since start) - (last)) ≥ (10)> then
            change [last v] by (10)
            set [raw v] to (analog read pin (34) in millivolts)
            set [despiked v] to (median of the last (5) readings of (raw) :: operators)
            set [smooth v] to ((smooth) + ((0.1) * ((despiked) - (smooth))))
            print (join (join (join [raw:] (raw)) [,filtered:]) (smooth))
          end
        end
      `,
      cpp: String.raw`
        const int SENSOR_PIN = 34;                // a sensor or potentiometer on an ADC1 pin
        const float ALPHA = 0.1;                  // smoothing: smaller is smoother and slower
        const uint32_t SAMPLE_MS = 10;

        float window[5];
        int slot = 0;
        float smooth = 0;
        uint32_t last = 0;

        float medianOf5(float value) {
          window[slot] = value;
          slot = (slot + 1) % 5;
          float s[5];
          for (int i = 0; i < 5; i++) s[i] = window[i];
          for (int a = 0; a < 4; a++)             // a tiny bubble sort
            for (int b = 0; b < 4 - a; b++)
              if (s[b] > s[b + 1]) { float t = s[b]; s[b] = s[b + 1]; s[b + 1] = t; }
          return s[2];                            // the middle value
        }

        void setup() {
          Serial.begin(115200);
          smooth = analogReadMilliVolts(SENSOR_PIN);              // start from the first reading
          for (int i = 0; i < 5; i++) window[i] = smooth;
        }

        void loop() {
          uint32_t now = millis();
          if (now - last >= SAMPLE_MS) {
            last += SAMPLE_MS;
            float raw = analogReadMilliVolts(SENSOR_PIN);
            float despiked = medianOf5(raw);                      // removes single wild readings
            smooth += ALPHA * (despiked - smooth);                // smooths what is left
            Serial.printf("raw:%.0f,filtered:%.1f\n", raw, smooth);
          }
        }
      `,
      py: String.raw`
        from machine import Pin, ADC
        import time

        adc = ADC(Pin(34), atten=ADC.ATTN_11DB)   # a sensor or potentiometer on an ADC1 pin
        ALPHA = 0.1                               # smoothing: smaller is smoother and slower
        SAMPLE_MS = 10

        smooth = adc.read_uv() / 1000             # start from the first reading
        window = [smooth] * 5
        slot = 0

        def median_of_5(value):
            global slot
            window[slot] = value
            slot = (slot + 1) % 5
            return sorted(window)[2]              # the middle value

        last = time.ticks_ms()
        while True:
            now = time.ticks_ms()
            if time.ticks_diff(now, last) >= SAMPLE_MS:
                last = time.ticks_add(last, SAMPLE_MS)
                raw = adc.read_uv() / 1000
                despiked = median_of_5(raw)       # removes single wild readings
                smooth += ALPHA * (despiked - smooth)   # smooths what is left
                print("raw:%.0f,filtered:%.1f" % (raw, smooth))
      `,
      output: `
        raw:1652,filtered:1651.8
        raw:1647,filtered:1651.3
        raw:2410,filtered:1651.0
        raw:1655,filtered:1651.4
      `,
      notes: ['The third line shows a spike of 2410 mV that the median removed: the filtered value did not move. An average alone would have shifted it by a fifth of the spike.', 'The sorted() call in MicroPython allocates memory on every pass; at 100 Hz it is harmless, but in a faster loop use a fixed insertion sort.']
    }
  ],
  formulas: [
    {
      name: 'Smoothing factor of an exponential filter',
      expr: 'a = dt/(tau + dt)',
      tex: '\\alpha = \\frac{\\Delta t}{\\tau + \\Delta t}',
      vars: {
        a: { name: 'smoothing factor α (0 to 1)', tex: '\\alpha', min: 0, max: 1 },
        dt: { name: 'sample period', tex: '\\Delta t', q: 'time', unit: 'ms', value: 10, min: 0.001 },
        tau: { name: 'filter time constant', tex: '\\tau', q: 'time', unit: 'ms', value: 90, min: 0 }
      },
      solveFor: 'a',
      note: 'The factor to use in y += α (x − y) so that the filter behaves like an RC low-pass with time constant τ at sample period Δt. Solve for τ to find the time constant of a factor you already use.',
      stories: { a: 'A sensor is read every {dt}. You want an exponential filter with a time constant of {tau}. What smoothing factor do you use?', tau: 'A filter with α = {a} runs at a sample period of {dt}. What is its time constant?' },
      practice: { unknowns: ['a', 'tau'] }
    },
    {
      name: 'Noise left after an exponential filter',
      expr: 'r = sqrt(a/(2 - a))',
      tex: 'r = \\sqrt{\\frac{\\alpha}{2 - \\alpha}}',
      vars: {
        r: { name: 'noise after the filter divided by noise before it, for white noise' },
        a: { name: 'smoothing factor α', tex: '\\alpha', value: 0.1, min: 0.001, max: 1 }
      },
      solveFor: 'r',
      note: 'For noise that is independent from sample to sample. A factor of 0.1 leaves about 23 % of the noise; 0.02 leaves 10 %, but at a ten times longer time constant.',
      stories: { r: 'An exponential filter with α = {a} is fed white noise. What fraction of the noise amplitude remains?' },
      practice: { unknowns: ['r'] }
    }
  ],
  examples: [
    {
      title: 'Choosing α for a thermistor loop',
      q: 'A thermal loop runs every 100 ms. The process has a time constant of 60 s. How would you choose the filter, and how much noise does it leave?',
      steps: ['Keep the filter time constant at a fifth of the process or less: $\\tau \\le 12$ s. A much shorter one is plenty: take $\\tau = 1$ s.', '$\\alpha = \\Delta t/(\\tau + \\Delta t) = 0.1/(1 + 0.1) = 0.09$.', 'The remaining noise is $\\sqrt{0.09/1.91} = 0.22$ of the original: about a fifth.'],
      a: 'Use α ≈ 0.09: a 1 s filter that leaves about 22 % of the noise and is invisible to a loop with a 60 s process.'
    }
  ],
  quiz: [
    { q: 'A sensor shows a wild reading about once a second, between normal values. Which filter removes it best?', choices: ['A moving average of 10', 'An EMA with α = 0.1', 'A median of 5', 'A longer delay()'], a: 2, why: 'A median never lets a single outlier through. Both averages spread it out: a moving average of 10 passes a tenth of the spike for 10 samples.' },
    { q: 'An exponential filter runs at 100 Hz with α = 0.1. About what is its time constant?', choices: ['10 ms', '90 ms', '1 s', '0.1 ms'], a: 1, why: 'τ = dt (1 − α) / α = 10 ms × 0.9 / 0.1 = 90 ms. Equivalently α = dt / (τ + dt) = 10 / 100.' },
    { q: 'Why filter the measurement before it reaches the derivative term of a PID?', choices: ['Differentiation amplifies noise: the difference of two noisy readings divided by a small dt is large', 'The derivative term cannot read raw values', 'It makes the integral term faster', 'It saves memory'], a: 0, why: 'A noise of 0.5 °C between two readings 10 ms apart is 50 °C/s. Multiplied by Kd it moves the output about. A filter first brings the noise down.' },
    { q: 'A heavier filter in a control loop is always safer.', a: false, why: 'The filter adds lag, and lag in a loop reduces its stability margin. Past a point a heavier filter makes the loop oscillate; keep it well under the process time constant.' }
  ],
  applications: [
    'Smoothing the ADC reading of a thermistor, a battery divider or a potentiometer knob.',
    'Despiking a distance sensor or a current reading that picks up motor noise.',
    'Cleaning the gyro and accelerometer signals before a balancing robot uses them.',
    'The derivative path of a PID loop, which almost always has its own filter.'
  ],
  sources: [
    'Lyons, *Understanding Digital Signal Processing*, the chapters on averaging and on exponential and median filters.',
    'Åström and Hägglund, *PID Controllers: Theory, Design, and Tuning* (2nd edition): filtering of the derivative term.',
    'Espressif, *ESP-IDF Programming Guide*, ADC oneshot and continuous drivers, for the noise of the converter.'
  ],
  sim: 'ca-filter'
},

/* ================================================================ a thermostat */
{
  id: 'thermostats',
  parent: 'control-and-automation',
  title: 'A thermostat',
  level: 2,
  short: 'A sensor, a setpoint, a rule with hysteresis, an output and the protections around it. The ESP32 adds what a bimetal strip never had: a schedule, remote control and a record, and the sensor and its placement decide the quality.',
  keywords: ['thermostat', 'DS18B20', 'setpoint', 'hysteresis', 'minimum off time', 'compressor', 'schedule', 'setback', 'frost protection', 'relay', 'heating', 'cooling', 'sensor placement', 'self-heating', 'boiler'],
  prereq: ['on-off-control-and-hysteresis', 'temperature-sensors', 'relays'],
  related: ['heaters-and-thermal-loads', 'time-proportioning', 'pid-control', 'safety-in-control', 'switching-mains-safely', 'ntp-and-time', 'project-thermostat', 'thermistors-and-ldrs'],
  body: `A thermostat is a small control system with five parts: a **sensor**, a **setpoint**, a **rule** with hysteresis ([[on-off-control-and-hysteresis]]), an **output** (a relay, a solid-state relay or a valve) and the **protections** that stop it doing harm. The ESP32 adds what a bimetal strip never had: a schedule, remote control, a display and a history.

### The sensor decides the quality

A **DS18B20** is the usual choice: a digital 1-Wire sensor, accurate to ±0.5 °C from −10 to +85 °C, with a resolution of 0.0625 °C at 12 bits, and sold in waterproof probes. It takes up to 750 ms to convert, so ask for a reading and collect it later instead of waiting ([[sample-time-and-jitter]]). An NTC thermistor is cheaper and faster but needs a divider and a calculation ([[thermistors-and-ldrs]]); digital humidity and temperature sensors suit a room that also needs humidity ([[temperature-sensors]]).

**Placement** matters as much as accuracy. The regulator and the radio warm the ESP32 board, so a sensor on it reads high; keep it away, out of sun and draughts, and not on the radiator. The chip's own temperature sensor measures the chip, not the room.

### The rule, and its protections

A heating thermostat switches on below *setpoint − h/2* and off above *setpoint + h/2*; a cooling one is its mirror image. Add a **minimum on** and **minimum off** time, with timestamps: a compressor should not restart for several minutes after it stopped, and a relay lives longer. A **sensor fault** must put the output in its safe state at once, whatever the timers say: a lost sensor reads nothing, and nothing looks cold ([[safety-in-control]]).

### A schedule

The setpoint can depend on the time of day: a lower night setback, a frost guard of 5 °C when nobody is home, a manual boost that returns to the schedule after an hour. The time comes from the network ([[ntp-and-time]]); keep the schedule in flash ([[nvs-and-preferences]]).

> [!warn] A thermostat switches energy that can start a fire. Mains heaters and boiler contacts are work for a qualified person, behind isolation and in an enclosure that follows the local wiring code; a bare relay board on a desk is not a product. Fit a thermal cut-out that works without the program, test with a low-voltage load, and never reflash a thermostat while it is plugged in.

### How often does it switch?

With a heater of power *P*, a heat loss *L* at the setpoint, a heat capacity *C* and a band *h*, a thermostat spends *C h / (P − L)* heating and *C h / L* cooling, which gives the cycle time in the formula below. A 2 kW heater in a room with 1 MJ/K and 1 kW of loss, with a 1 K band, runs 1000 s on and 1000 s off. A colder day shifts the balance, and delay adds overshoot on top.

> [!key] A thermostat is a sensor, a setpoint, an on-off rule with hysteresis and minimum times, and protections that do not trust the program. Choose and place the sensor with care, read it without blocking, and let a lost sensor switch the output off.`,
  ideas: [
    'A thermostat is a sensor, a setpoint, an on-off rule with hysteresis, an output and protections; the ESP32 adds schedules, remote control and a record.',
    'A DS18B20 is accurate to ±0.5 °C and takes up to 750 ms to convert: request the reading, do other work, collect it afterwards.',
    'Keep the sensor away from the warm ESP32, sun, draughts and the heater itself; a bad place costs more accuracy than a cheap sensor.',
    'Enforce a minimum on and off time with timestamps, and treat a lost sensor as a fault that switches the output off.'
  ],
  pitfalls: [
    'The temperature on the board is the temperature of the room — The regulator, the radio and the LEDs warm the board by several degrees. Keep the sensor away from the electronics, or on a short lead.',
    'A lost sensor reads a safe value — A disconnected DS18B20 gives an error code, an open thermistor reads very cold: both look like "heat more". Check for a fault value before using the reading.',
    'The software thermostat is the safety — Code can hang and a relay can weld shut. A thermal fuse or a cut-out in series with the heater works when neither does.'
  ],
  terms: [
    { term: 'DS18B20', also: ['1-Wire temperature sensor', 'Dallas sensor'], def: 'A digital temperature sensor on a single data wire with a unique address, ±0.5 °C accurate from −10 to +85 °C, resolution 0.0625 °C at 12 bits and a conversion of up to 750 ms.' },
    { term: 'Setback', also: ['night setback', 'schedule'], def: 'A lower setpoint during the hours when comfort matters less, to save energy; a schedule steps the setpoint at set times of day.' },
    { term: 'Minimum off time', also: ['anti-short-cycle timer', 'compressor delay'], def: 'The shortest time a compressor or relay is kept off after switching off, so that pressures equalise or contacts rest. The thermostat waits even when the temperature calls for heat.' },
    { term: 'Frost protection', also: ['frost guard', 'antifreeze mode'], def: 'A low fixed setpoint, often about 5 °C, that keeps a building or a pipe from freezing while the normal schedule is off.' },
    { term: 'Self-heating', also: ['board heating'], def: 'The warming of a sensor by the electronics near it, or by its own current, which makes it read higher than the air it should measure.' }
  ],
  choose: {
    good: ['A DS18B20 on a short probe lead for a room, a tank or a fridge', 'A schedule with a frost guard for a building that is sometimes empty', 'Hysteresis plus minimum times for any relay or compressor'],
    avoid: ['A sensor on the ESP32 board itself', 'A heater controlled by the program alone, with no thermal cut-out', 'Blocking for the sensor conversion: it freezes the rest of the program'],
    check: ['That an unplugged sensor switches the output off', 'The cycle time against the relay rating', 'What the relay does while the ESP32 starts or resets']
  },
  code: [
    {
      title: 'A thermostat with minimum times and a sensor check',
      about: 'A DS18B20 is read every two seconds without waiting for it. The heater relay switches on below 20.5 °C and off above 21.5 °C, stays on at least 30 s and off at least 2 minutes, and goes off at once if the sensor stops answering.',
      needs: 'An ESP32 DevKit, a DS18B20 with a 4.7 kΩ pull-up to 3.3 V and a relay module whose input is active high (many modules are active low: check yours). Test with a low-voltage load, not with mains. Libraries OneWire and DallasTemperature; MicroPython has the drivers built in.',
      libs: ['OneWire', 'DallasTemperature'],
      wiring: [['GPIO4', 'DS18B20 data', '4.7 kΩ to 3.3 V; the probe also takes 3.3 V and GND'], ['GPIO26', 'relay module input', 'the relay\'s heater contacts are not shown']],
      blocks: `
        when started
          set pin (26) to [LOW v]
          set pin (26) as [output v]
          set [heating v] to <false>
          set [changed v] to ((milliseconds since start) - (120000))
          set [asked v] to (milliseconds since start)
          set [waiting v] to <false>

        forever
          if <<not <waiting>> and <((milliseconds since start) - (asked)) ≥ (2000)>> then
            ask the DS18B20 for a temperature :: sensing
            set [asked v] to (milliseconds since start)
            set [waiting v] to <true>
          end
          if <<waiting> and <((milliseconds since start) - (asked)) ≥ (800)>> then
            set [waiting v] to <false>
            set [t v] to (temperature of the DS18B20 :: sensing)
            if <(t) = [no reading]> then
              set pin (26) to [LOW v]
              set [heating v] to <false>
              print [sensor fault: heater off]
            else
              set [held v] to ((milliseconds since start) - (changed))
              if <<not <heating>> and <<(t) < (20.5)> and <(held) ≥ (120000)>>> then
                set [heating v] to <true>
                set [changed v] to (milliseconds since start)
              end
              if <<heating> and <<(t) > (21.5)> and <(held) ≥ (30000)>>> then
                set [heating v] to <false>
                set [changed v] to (milliseconds since start)
              end
              set pin (26) to (heating)
              print (join (t) [ C])
            end
          end
        end
      `,
      cpp: String.raw`
        #include <OneWire.h>
        #include <DallasTemperature.h>

        const int SENSOR_PIN = 4;                  // DS18B20 data, 4.7 k to 3.3 V
        const int RELAY_PIN = 26;                  // relay module input (this one: HIGH = on)
        const float SETPOINT = 21.0;               // degrees C
        const float BAND = 1.0;                    // on below 20.5, off above 21.5
        const uint32_t MIN_ON_MS = 30000;          // stay on at least this long
        const uint32_t MIN_OFF_MS = 120000;        // and off at least this long

        OneWire oneWire(SENSOR_PIN);
        DallasTemperature ds(&oneWire);
        bool heating = false, waiting = false;
        uint32_t changedAt = 0, askedAt = 0;

        void setup() {
          Serial.begin(115200);
          digitalWrite(RELAY_PIN, LOW);            // off before the pin becomes an output
          pinMode(RELAY_PIN, OUTPUT);
          ds.begin();
          ds.setWaitForConversion(false);          // do not block for 750 ms
          changedAt = millis() - MIN_OFF_MS;       // allow a first start
        }

        void loop() {
          uint32_t now = millis();
          if (!waiting && now - askedAt >= 2000) { // ask for a reading every 2 s
            ds.requestTemperatures();
            askedAt = now;
            waiting = true;
          }
          if (waiting && now - askedAt >= 800) {   // the conversion is done
            waiting = false;
            float t = ds.getTempCByIndex(0);
            if (t == DEVICE_DISCONNECTED_C) {      // sensor lost: heater off, whatever the timers say
              digitalWrite(RELAY_PIN, LOW);
              heating = false;
              Serial.println("sensor fault: heater off");
              return;
            }
            uint32_t held = now - changedAt;
            if (!heating && t < SETPOINT - BAND / 2 && held >= MIN_OFF_MS) { heating = true; changedAt = now; }
            if (heating && t > SETPOINT + BAND / 2 && held >= MIN_ON_MS) { heating = false; changedAt = now; }
            digitalWrite(RELAY_PIN, heating);
            Serial.printf("%.2f C\n", t);
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import onewire, ds18x20, time

        ow = onewire.OneWire(Pin(4))               # DS18B20 data, 4.7 k to 3.3 V
        ds = ds18x20.DS18X20(ow)
        rom = ds.scan()[0]                         # the first sensor on the wire
        relay = Pin(26, Pin.OUT, value=0)          # relay module input (this one: 1 = on)
        SETPOINT = 21.0                            # degrees C
        BAND = 1.0                                 # on below 20.5, off above 21.5
        MIN_ON_MS = 30000                          # stay on at least this long
        MIN_OFF_MS = 120000                        # and off at least this long

        heating = False
        waiting = False
        asked_at = time.ticks_ms()
        changed_at = time.ticks_add(time.ticks_ms(), -MIN_OFF_MS)   # allow a first start

        while True:
            now = time.ticks_ms()
            if not waiting and time.ticks_diff(now, asked_at) >= 2000:   # ask for a reading every 2 s
                ds.convert_temp()                  # starts the conversion and returns at once
                asked_at = now
                waiting = True
            if waiting and time.ticks_diff(now, asked_at) >= 800:        # the conversion is done
                waiting = False
                try:
                    t = ds.read_temp(rom)
                except Exception:                  # sensor lost: heater off, whatever the timers say
                    relay.value(0)
                    heating = False
                    print("sensor fault: heater off")
                    continue
                held = time.ticks_diff(now, changed_at)
                if not heating and t < SETPOINT - BAND / 2 and held >= MIN_OFF_MS:
                    heating = True
                    changed_at = now
                if heating and t > SETPOINT + BAND / 2 and held >= MIN_ON_MS:
                    heating = False
                    changed_at = now
                relay.value(heating)
                print("%.2f C" % t)
      `,
      output: `
        19.94 C
        19.97 C
        20.12 C
        21.58 C
        21.55 C
      `,
      notes: ['Relay modules differ: many are active low (the relay is on when the pin is low), and some pull the input at power-up. Test what the relay does while the board resets before connecting a load ([[pins-at-boot]]).', 'The sensor check here is only the start of [[safety-in-control]]: a DS18B20 that is stuck at a plausible value, or a relay that has welded shut, needs the independent cut-out.']
    }
  ],
  formulas: [
    {
      name: 'Cycle time of an on-off thermostat',
      expr: 'T = C*h/(P - Ls) + C*h/Ls',
      tex: 'T = \\frac{C\\,h}{P - L_s} + \\frac{C\\,h}{L_s}',
      vars: {
        T: { name: 'length of one on-off cycle', q: 'time', unit: 'min' },
        C: { name: 'heat capacity of the room and its contents', q: 'heatcap', unit: 'kJ/K', value: 1000, min: 1 },
        h: { name: 'width of the hysteresis band', q: 'dtemp', unit: 'K', value: 1, min: 0.01 },
        P: { name: 'heater power', q: 'power', unit: 'W', value: 2000 },
        Ls: { name: 'heat loss at the setpoint', tex: 'L_s', q: 'power', unit: 'W', value: 1000, min: 1 }
      },
      solveFor: 'T',
      note: 'Heating time plus cooling time for a lumped heat capacity, ignoring the delay between heater and sensor, which makes the real swing larger. It needs P to be greater than the loss. Solve for h to see what band gives a wanted cycle time.',
      stories: { T: 'A room has a heat capacity of {C}. A {P} heater holds it against a loss of {Ls}, with a band of {h}. How long is one cycle?', h: 'A thermostat on a {P} heater, in a room of {C} with a loss of {Ls}, should cycle once every {T}. What band is that?' },
      practice: { unknowns: ['T', 'h'] }
    }
  ],
  examples: [
    {
      title: 'How many times does the relay switch?',
      q: 'A room has a heat capacity of 1 MJ/K. A 2 kW heater is switched by a thermostat with a 1 K band, and the room loses 1 kW at the setpoint. How long is a cycle and how many relay operations are there in a day?',
      steps: ['Heating: $C\\,h/(P - L_s) = 10^6 \\times 1 / 1000 = 1000$ s. Cooling: $C\\,h/L_s = 1000$ s.', 'One cycle is 2000 s, about 33 minutes: 43 cycles in a day.', 'Each cycle is one switch-on and one switch-off, so 43 operations of the contacts per day: about 16 000 a year, well within a relay\'s life.'],
      a: 'A cycle of about 33 minutes and 43 operations a day. A narrower band of 0.2 K would give 216 cycles a day.'
    }
  ],
  quiz: [
    { q: 'A DS18B20 conversion at 12 bits takes up to 750 ms. What is the best way to read it in a thermostat that does other things?', choices: ['Call delay(750) after the request', 'Request the reading, do other work, and read it after about 800 ms', 'Read at 9 bits to avoid any wait', 'Read the sensor in an interrupt handler'], a: 1, why: 'The conversion runs inside the sensor while the ESP32 does other work. Starting it and collecting it later keeps the loop responsive; delay() blocks everything else for the whole time.' },
    { q: 'The temperature sensor sits on the same board as the ESP32, and the room feels cooler than the display says. What is the likely cause?', choices: ['The ADC is broken', 'The board warms the sensor, which reads high', 'The setpoint is wrong', 'The relay is slow'], a: 1, why: 'A regulator and a radio dissipate a watt or so on a small board and warm the air and the copper around the sensor by several degrees. Keep the sensor away from the electronics.' },
    { q: 'Why must a thermostat enforce a minimum off time even when the room is cold?', choices: ['To save energy', 'A compressor or relay is damaged or worn by quick restarts', 'To let the sensor conversion finish', 'It is the law for all thermostats'], a: 1, why: 'A compressor restarted against high pressure can stall or trip, and a relay wears with every operation. The thermostat waits even when the temperature calls for heat.' },
    { q: 'The program checks the sensor and the heater is switched off if it fails. A separate thermal fuse is therefore unnecessary.', a: false, why: 'Software can hang and a relay can weld shut. Neither is caught by a check that lives in the same program. An independent cut-out is the last line of defence.' }
  ],
  applications: [
    'A fridge, freezer or wine-cooler controller replacing a failed mechanical thermostat.',
    'A greenhouse, incubator or terrarium that follows a schedule.',
    'A smart radiator or underfloor-heating controller that talks to a home automation hub.',
    'A water-tank or sous-vide heater switched by a relay or a solid-state relay.'
  ],
  sources: [
    'Maxim Integrated, *DS18B20* datasheet: accuracy, resolution and conversion time.',
    'The OneWire and DallasTemperature library documentation (Arduino), and the MicroPython documentation of the onewire and ds18x20 modules (version 1.29).',
    'IEC 60730, *Automatic electrical controls*, the family of standards for controls of household appliances.'
  ],
  sim: { id: 'ca-hysteresis', params: { room: true } }
},

/* ================================================================ time-proportioning */
{
  id: 'time-proportioning',
  parent: 'control-and-automation',
  title: 'Time-proportioning for slow loads',
  level: 2,
  short: 'A heater with a time constant of a minute cannot tell whether it is switched at a kilohertz or once every twenty seconds. Slow PWM in windows of seconds gives it any power, spares the relay and suits a solid-state relay.',
  keywords: ['time proportioning', 'slow PWM', 'window', 'duty', 'SSR', 'zero-cross', 'burst firing', 'relay life', 'cycle time', 'ripple', 'heater', 'whole cycles', 'minimum pulse', 'staggering'],
  prereq: ['pid-control', 'solid-state-relays-and-triacs', 'relays'],
  related: ['heaters-and-thermal-loads', 'thermostats', 'on-off-control-and-hysteresis', 'switching-mains-safely', 'pwm-with-ledc', 'motor-pwm-frequency'],
  body: `A heater with a time constant of a minute does not care whether it is switched at 1 kHz or once every ten seconds: its thermal mass averages the power. So the cheapest way to give it 30 % power is **time-proportioning**. Cut time into **windows**; in each window switch the load fully on for \`duty × window\` and off for the rest. It is PWM, a thousand times slower.

### Why not fast PWM?

A mechanical relay needs about 10 ms to operate and wears with every operation. A **zero-cross solid-state relay** only switches at the zero crossings of the mains, every 10 ms at 50 Hz (8.3 ms at 60 Hz), so it passes whole half-cycles, and chopping mains at kilohertz is neither possible nor wanted. A MOSFET could do it, but a heater gains nothing from the speed. A window of seconds is enough.

### Choosing the window

Two pressures pull in opposite directions.

- **A shorter window gives less ripple.** The temperature rises while the heater is on and falls while it is off: peak to peak, about *K d (1 − d) W / τ* for a window *W* much shorter than the time constant τ, with *K* the rise at full power and *d* the duty. The simulation shows the ripple for any window.
- **A longer window means fewer operations.** A window of 20 s is 4320 switch-ons a day. A relay rated for 100 000 operations at its full load would last 23 days at that rate, and 347 days with a 5-minute window. The rating at *your* load current is in the datasheet and is usually far better than the headline for a lightly loaded contact, but the arithmetic is the reason relays get long windows.

A habit that works: **1 to 2 s for a solid-state relay, tens of seconds to minutes for a relay**, and always at most a tenth of the time constant, or the ripple grows ([[heaters-and-thermal-loads]]).

### Resolution and minimum pulse

With a zero-cross SSR on 50 Hz mains, a 1 s window holds 50 cycles, so the duty comes in steps of 2 %. Do not bother with pulses shorter than the switch can honour: snap an on-time below a minimum to nothing, and a gap below the minimum to full on.

### Several loads

Offset their windows so that the heaters do not all switch on in the same instant: the current is spread out, and the supply and the lights flicker less.

### Where the duty comes from

From a PID controller whose output is 0 to 100 % ([[pid-control]]), computed once per window or faster, with the window deciding when the switch actually moves.

> [!warn] Switching a mains heater is work for a qualified person, with an SSR or relay of the right rating, an enclosure, isolation and a thermal cut-out that does not depend on the program. Do not wire mains on a bench, and never reflash a mains device while it is plugged in.

> [!key] Time-proportioning gives a slow load any power by switching it fully on for a fraction of a window of seconds. A short window gives a smooth temperature, a long one spares the relay: choose a window of about a tenth of the time constant, shorter for an SSR, longer for a relay.`,
  ideas: [
    'Time-proportioning switches a load fully on for duty × window in each window of seconds; a thermal mass averages it into a steady power.',
    'The ripple of the temperature is about K d (1 − d) W / τ, so it falls with a shorter window and a larger time constant.',
    'A mechanical relay has a limited number of operations, so it needs a long window; a zero-cross SSR works in whole mains cycles and can use a window of one to two seconds.',
    'Snap too-short pulses to zero and too-short gaps to full on, and offset the windows of several loads.'
  ],
  pitfalls: [
    'Fast PWM is always better — A heater cannot use it, a relay dies of it and an SSR cannot follow it. Match the switching to the load: seconds for a heater.',
    'A zero-cross SSR can dim a heater smoothly — It passes whole half-cycles of the mains, so it works in steps and in windows; it is not a phase-angle dimmer.',
    'The relay will last because its datasheet says ten million operations — That is the mechanical life with no load. The electrical life at full load is typically around a hundred thousand operations; check the datasheet curve for your current.'
  ],
  terms: [
    { term: 'Time-proportioning', also: ['slow PWM', 'time-proportional control', 'cycle time control'], def: 'Controlling the average power of a slow load by switching it fully on for a fraction of a fixed window of seconds, and fully off for the rest.' },
    { term: 'Window', also: ['cycle time', 'period'], def: 'The fixed length of time, from about a second to a minute, in which a time-proportioned load is switched on once and then off.' },
    { term: 'Zero-cross SSR', also: ['zero-crossing solid-state relay', 'burst firing'], def: 'A solid-state relay that only turns on when the mains voltage crosses zero, which avoids switching noise and means power is controlled in whole cycles.' },
    { term: 'Ripple', also: ['temperature ripple'], def: 'The small up-and-down variation of the controlled quantity around its average, caused here by the switching in each window.' },
    { term: 'Minimum pulse', also: ['minimum on-time'], def: 'The shortest on-time or off-time worth sending to a switch: shorter ones wear a relay without delivering any measurable power.' }
  ],
  choose: {
    good: ['A solid-state relay with a window of 1 to 2 s for a mains heater or a 24 V heater', 'A relay with a window of tens of seconds for slow loads when the contacts are rated well above the load', 'A MOSFET with a window of a second or two for a low-voltage heater'],
    avoid: ['Kilohertz PWM into a relay or a zero-cross SSR', 'A window longer than the time constant of the load: the ripple becomes large', 'A short window on a mechanical relay'],
    check: ['The relay\'s electrical life at your load current, against operations per day', 'The ripple in degrees for the window you chose', 'That a stuck-on SSR or relay is covered by the cut-out']
  },
  code: [
    {
      title: 'A knob sets the power of a heater, in windows of 20 s',
      about: 'A potentiometer sets the power from 0 to 100 %. The relay or SSR is on for that fraction of every 20 s window. Pulses shorter than half a second are dropped, and so are gaps that short. Replace the potentiometer by the output of a PID controller to make a temperature loop.',
      needs: 'An ESP32 DevKit, a potentiometer, and a relay module or an SSR with a DC input driven from GPIO26. Test with a lamp or a low-voltage load, not with mains.',
      wiring: [['GPIO34', 'potentiometer wiper', '3.3 V → potentiometer → GND'], ['GPIO26', 'relay module or SSR input', 'the load side is not shown']],
      blocks: `
        when started
          set pin (26) to [LOW v]
          set pin (26) as [output v]
          set [window start v] to (milliseconds since start)

        forever
          if <((milliseconds since start) - (window start)) ≥ (20000)> then
            change [window start v] by (20000)
          end
          set [duty v] to ((analog read pin (34)) / (4095))
          set [on time v] to ((duty) * (20000))
          if <(on time) < (500)> then
            set [on time v] to (0)
          end
          if <((20000) - (on time)) < (500)> then
            set [on time v] to (20000)
          end
          if <((milliseconds since start) - (window start)) < (on time)> then
            set pin (26) to [HIGH v]
          else
            set pin (26) to [LOW v]
          end
        end
      `,
      cpp: String.raw`
        const int POT_PIN = 34;                 // the power knob: 0 to 100 %
        const int RELAY_PIN = 26;               // relay or SSR input
        const uint32_t WINDOW_MS = 20000;       // one on and off cycle of the slow PWM
        const uint32_t MIN_PULSE_MS = 500;      // a pulse or a gap shorter than this is not worth a click

        uint32_t windowStart = 0;

        void setup() {
          digitalWrite(RELAY_PIN, LOW);         // off before the pin becomes an output
          pinMode(RELAY_PIN, OUTPUT);
        }

        void loop() {
          uint32_t now = millis();
          while (now - windowStart >= WINDOW_MS) windowStart += WINDOW_MS;   // a new window
          float duty = analogRead(POT_PIN) / 4095.0f;                        // 0..1: the power wanted
          uint32_t onTime = duty * WINDOW_MS;
          if (onTime < MIN_PULSE_MS) onTime = 0;                             // too short: stay off
          if (WINDOW_MS - onTime < MIN_PULSE_MS) onTime = WINDOW_MS;         // gap too short: stay on
          digitalWrite(RELAY_PIN, (now - windowStart) < onTime ? HIGH : LOW);
        }
      `,
      py: String.raw`
        from machine import Pin, ADC
        import time

        pot = ADC(Pin(34), atten=ADC.ATTN_11DB)     # the power knob: 0 to 100 %
        relay = Pin(26, Pin.OUT, value=0)           # relay or SSR input, off at start
        WINDOW_MS = 20000                           # one on and off cycle of the slow PWM
        MIN_PULSE_MS = 500                          # a pulse or a gap shorter than this is not worth a click

        window_start = time.ticks_ms()
        while True:
            now = time.ticks_ms()
            while time.ticks_diff(now, window_start) >= WINDOW_MS:         # a new window
                window_start = time.ticks_add(window_start, WINDOW_MS)
            duty = pot.read_u16() / 65535                                   # 0..1: the power wanted
            on_time = int(duty * WINDOW_MS)
            if on_time < MIN_PULSE_MS:                                      # too short: stay off
                on_time = 0
            if WINDOW_MS - on_time < MIN_PULSE_MS:                          # gap too short: stay on
                on_time = WINDOW_MS
            relay.value(time.ticks_diff(now, window_start) < on_time)
      `,
      notes: ['The window is long because a relay is slow and wears; with an SSR set WINDOW_MS to 1000 or 2000, and the temperature ripples less.', 'An analogue reading of the knob is noisy: the power wobbles a little. For a real loop the duty comes from a PID step ([[pid-control]]) and is filtered.']
    }
  ],
  formulas: [
    {
      name: 'Relay life with time-proportioning',
      expr: 'L = N*W/86400',
      tex: 'L = \\frac{N\\,W}{86400}',
      vars: {
        L: { name: 'life of the relay', q: 'time', unit: 'day' },
        N: { name: 'rated number of operations at your load', int: true, value: 100000, min: 1 },
        W: { name: 'window', q: 'time', unit: 's', value: 20, min: 0.1 }
      },
      solveFor: 'L',
      note: 'One switch-on per window, which is the case whenever the duty lies between the minimum pulse and full. 86400 is the number of seconds in a day. Solve for W to find the shortest window that gives a wanted life.',
      stories: { L: 'A relay is rated for {N} operations at the load current. It switches a heater in windows of {W}. How long does it last?', W: 'A relay rated for {N} operations should last {L}. What window does that allow?' },
      practice: { unknowns: ['L', 'W'] }
    },
    {
      name: 'Ripple of a time-proportioned heater',
      expr: 'r = K*d*(1 - d)*W/tau',
      tex: 'r = \\frac{K\\,d\\,(1 - d)\\,W}{\\tau}',
      vars: {
        r: { name: 'peak-to-peak ripple of the temperature', q: 'dtemp', unit: 'K' },
        K: { name: 'temperature rise at full power', q: 'dtemp', unit: 'K', value: 60 },
        d: { name: 'duty (0 to 1)', value: 0.5, min: 0, max: 1 },
        W: { name: 'window', q: 'time', unit: 's', value: 20 },
        tau: { name: 'thermal time constant of the load', tex: '\\tau', q: 'time', unit: 's', value: 120, min: 0.1 }
      },
      solveFor: 'r',
      note: 'A good approximation while the window is much shorter than the time constant. The ripple is greatest at 50 % duty and vanishes at 0 and 100 %. Solve for W to find the longest window that keeps the ripple under a limit.',
      stories: { r: 'A heater raises its block by {K} at full power, with a time constant of {tau}. It runs at a duty of {d} in windows of {W}. How large is the ripple?', W: 'A block with a rise of {K} and a time constant of {tau} runs at a duty of {d}. The ripple must stay under {r}. How long may the window be?' },
      practice: { unknowns: ['r', 'W'] }
    }
  ],
  examples: [
    {
      title: 'Window for a heating block',
      q: 'A heating block rises by 60 K at full power and has a time constant of 120 s. It is held at 30 K above ambient through a relay. How long may the window be to keep the ripple under 0.5 K, and how long does a relay of 100 000 operations last at that window?',
      steps: ['Duty $d = 30/60 = 0.5$, so $d(1 - d) = 0.25$.', '$r = K\\,d(1-d)\\,W/\\tau$ gives $W = r\\,\\tau/(K\\,d(1-d)) = 0.5 \\times 120 / (60 \\times 0.25) = 4$ s.', 'Operations per day: $86400/4 = 21\\,600$. The relay would last $100\\,000/21\\,600 = 4.6$ days.'],
      a: 'A window of 4 s keeps the ripple under 0.5 K, but would wear out a relay in under a week: use a solid-state relay, or accept a ripple of 2 K with a 16 s window.'
    }
  ],
  quiz: [
    { q: 'A heater with a time constant of 60 s is controlled at 40 % power. Which switching is best for a mechanical relay?', choices: ['1 kHz PWM at 40 %', 'On for 8 s and off for 12 s, repeated', 'On for 8 ms and off for 12 ms, repeated', 'On for 40 s, then off for 60 s'], a: 1, why: 'A window of 20 s is a third of the time constant, which gives some ripple but few operations. Milliseconds would destroy a relay, and a 100 s cycle swings the temperature far too much.' },
    { q: 'A relay rated for 100 000 operations at its load switches once per window of 10 s. About how long does it last?', choices: ['A week', 'Twelve days', 'Two years', 'Ten years'], a: 1, why: '86400 / 10 = 8640 operations a day, so 100 000 operations last about 11.6 days. Windows of a minute or more, or a solid-state relay, are the cure.' },
    { q: 'A zero-cross SSR on 50 Hz mains is used with a 1 s window. What is the finest step of the duty?', choices: ['0.1 %', '2 %', '10 %', '50 %'], a: 1, why: 'The SSR passes whole mains cycles, and a 1 s window holds 50 of them, so the duty comes in steps of 1/50 = 2 %.' },
    { q: 'A longer window always gives a smoother temperature.', a: false, why: 'The ripple grows with the window: the heater is on or off for longer stretches. A longer window spares the switch but costs smoothness.' }
  ],
  applications: [
    'Mains and low-voltage heaters of ovens, kettles, sous-vide cookers and 3D-printer beds.',
    'A kiln or reflow oven whose controller output goes to an SSR in windows of a second or two.',
    'Slow actuators such as valves and dampers driven by a pulsed signal.',
    'Several heaters on one supply with staggered windows.'
  ],
  sources: [
    'Åström and Hägglund, *PID Controllers: Theory, Design, and Tuning* (2nd edition), on the output of a controller driving a relay or a switched actuator.',
    'The datasheet of the relay or solid-state relay you use: electrical life against load current, and zero-cross operation.',
    'Arduino core for ESP32 documentation, the *GPIO* API page, and the MicroPython documentation of machine.Pin and time (version 1.29).'
  ],
  sim: 'ca-tpc'
},

/* ================================================================ industrial inputs and outputs */
{
  id: 'industrial-signals',
  parent: 'control-and-automation',
  title: 'Industrial inputs and outputs',
  level: 2,
  short: '4–20 mA loops, 0–10 V signals, 24 V inputs and relay outputs are built to survive long cables, noise and a 24 V supply. An ESP32 pin takes 3.3 V and a few milliamps, so between plant and chip sits an interface, and the interface is the job.',
  keywords: ['4-20 mA', 'current loop', '0-10 V', '24 V', 'optocoupler', 'isolation', 'shunt', 'live zero', 'NAMUR', 'PNP', 'NPN', 'PLC', 'relay output', 'ground loop', 'industrial', 'transmitter', 'sink', 'source'],
  prereq: ['voltage-dividers-for-inputs', 'optocouplers', 'relays'],
  related: ['four-to-twenty-milliamp', 'isolation-and-long-cables', 'modbus', 'rs-485', 'relay-and-industrial-boards', 'analog-input', 'safety-in-control', 'electronics:optocouplers', 'electronics:sensor-interfacing'],
  body: `Factory signals are made to survive 24 V supplies, long cables and electrical noise. An ESP32 pin is a 3.3 V signal that takes a few milliamps and does not forgive 5 V, so between the plant and the chip sits a small interface. Most of the job of connecting an ESP32 to a machine is that interface.

### The 4–20 mA current loop

A transmitter, for pressure, temperature or level, varies the **loop current** between 4 mA (the bottom of the range) and 20 mA (the top). A current is the same everywhere in a series loop, so the cable's resistance does not matter and voltage noise barely couples in. The offset is the clever part: with a **live zero** at 4 mA, a current of 0 mA can only mean a broken wire or a dead transmitter, which is different from a true zero. A two-wire transmitter takes its power from the loop.

To read it, put a precision **shunt** in the loop and measure its voltage. 100 Ω turns 4 to 20 mA into 0.4 to 2.0 V, which lies inside the ESP32's specified ADC range of 0.15 to 2.45 V. Scale with \`x = lo + (I − 4)(hi − lo) / 16\`. The NAMUR recommendation NE 43 treats a current below 3.6 mA or above 21 mA as a failure signal, and so does the program below. A fault on the loop can put 24 V on the shunt node, so add a series resistor and a clamp to the pin, or better, isolate the input ([[four-to-twenty-milliamp]]).

### 0–10 V

Simple, and fine inside one cabinet, but a voltage drops along a cable, picks up noise, and has no live zero: a broken wire reads 0 V, a valid value. To read it, divide it down: 33 kΩ over 10 kΩ turns 10 V into 2.33 V.

### 24 V digital inputs and outputs

A 24 V input reaches an **optocoupler** through a series resistor: about 4.7 kΩ gives 5 mA from 24 V. The opto's output side pulls the ESP32 pin low, with a pull-up, and the two sides share no wire ([[optocouplers]]). Sensors come as **PNP** (switch the output to +24 V, usual in Europe) or **NPN** (pull it to 0 V, usual in Asia); the input stage must match. A **relay output** gives isolated, dry contacts for any voltage within its rating; a transistor output is faster and wears out less.

### Isolation, shields and failing safe

Separate machines have separate earths, and a signal that shares a ground wire carries the difference as a current: a *ground loop*. Isolate, use shielded twisted pairs, and ground the shield at one end. Wire alarms so that a fault looks like an alarm: a relay that is *energised when healthy* trips when the power or a wire fails, and emergency stops are normally closed for the same reason ([[safety-in-control]]).

> [!key] Industrial signals need an interface: a shunt for 4–20 mA (a current below 4 mA is a fault), a divider for 0–10 V, an optocoupler for 24 V. Isolate where grounds differ, and wire alarms so that a broken wire or a power failure looks like an alarm.`,
  ideas: [
    'A 4–20 mA loop sends the measurement as a current: the cable does not matter and a current below 4 mA means a fault.',
    'A 100 Ω shunt turns 4 to 20 mA into 0.4 to 2.0 V, inside the ESP32 ADC range; the value is lo + (I − 4)(hi − lo) / 16.',
    'A 24 V input needs a series resistor and an optocoupler; PNP and NPN sensors differ in which level they switch.',
    'Wire alarms so that a lost wire or supply looks like a fault: energised when healthy, normally closed for stops.'
  ],
  pitfalls: [
    'A 4–20 mA signal can go straight to an ADC pin — The loop can fault to the full supply voltage, and the shunt shares the loop\'s ground. Use a series resistor and a clamp at least, an isolated front end where the grounds differ.',
    '0–10 V is the same as 4–20 mA but simpler — It has no live zero, so a broken wire reads as a perfectly good 0 V, and cable drop and noise change the reading.',
    'A 24 V sensor output can be connected to a 3.3 V input through a divider — A divider gives no isolation and no protection from the spikes of an industrial cabinet. Use an optocoupler or a ready-made isolated input module.'
  ],
  terms: [
    { term: '4–20 mA loop', also: ['current loop', 'process loop'], def: 'An analogue signalling standard in which the measurement is sent as a current between 4 and 20 mA, so cable resistance and noise hardly matter.' },
    { term: 'Live zero', also: ['elevated zero', 'offset zero'], def: 'A signal range whose bottom is not zero (4 mA), so that zero current can be recognised as a fault.' },
    { term: 'Shunt resistor', also: ['sense resistor', 'burden resistor'], def: 'A precision resistor put in a current path so that the current can be measured as a voltage: 100 Ω gives 2.0 V at 20 mA.' },
    { term: 'Optocoupler', also: ['opto-isolator', 'photocoupler'], def: 'A part with an LED and a phototransistor in one package that passes a signal across an insulation barrier with light.' },
    { term: 'PNP and NPN outputs', also: ['sourcing and sinking', 'high-side and low-side'], def: 'A PNP sensor output switches the positive supply to the load; an NPN output switches it to 0 V. An input must be built for the kind it is connected to.' }
  ],
  choose: {
    good: ['4–20 mA for sensors on long cables or in noisy places', '0–10 V for short runs inside one cabinet', 'Optocoupled inputs and relay outputs when the plant side has its own supply and earth'],
    avoid: ['Connecting a 24 V or 4–20 mA signal directly to an ESP32 pin', '0–10 V for a safety-relevant measurement: a broken wire looks valid', 'Sharing one ground wire between the ESP32 and a plant with its own earth'],
    check: ['That 20 mA at the shunt stays inside the ADC range of your chip', 'PNP or NPN, and the input current the opto needs', 'Whether the alarm trips when the power or the wire fails']
  },
  code: [
    {
      title: 'Read a 4–20 mA pressure transmitter and trip an alarm',
      about: 'Measures the loop current across a 100 Ω shunt, converts it to a pressure from 0 to 10 bar and prints it. A current below 3.6 mA or above 21 mA is a fault. The alarm relay is energised while everything is healthy, so a dead loop, a broken wire or a lost supply de-energises it.',
      needs: 'An ESP32 DevKit, a two-wire 0–10 bar 4–20 mA transmitter with its 24 V supply, a 100 Ω 0.1 % resistor, and a relay module. In this simple wiring the 0 V of the loop supply and the ESP32 ground are common: where grounds differ, isolate the input.',
      wiring: [['GPIO34', 'top of the 100 Ω shunt', '24 V → transmitter → shunt → GND, with 1 kΩ in series, a clamp to 3.3 V and 100 nF at the pin'], ['GPIO26', 'alarm relay input', 'active-high module; contacts to the alarm circuit']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (26) as [output v]
          set pin (26) to [LOW v]

        forever
          set [sum v] to (0)
          repeat (16)
            change [sum v] by (analog read pin (34) in millivolts)
          end
          set [milliamps v] to (((sum) / (16)) / (100))
          if <<(milliamps) ≥ (3.6)> and <(milliamps) ≤ (21)>> then
            set pin (26) to [HIGH v]
            set [bar v] to ((0) + (((milliamps) - (4)) * ((10) - (0)) / (16)))
            print (join (join (milliamps) [ mA = ]) (join (bar) [ bar]))
          else
            set pin (26) to [LOW v]
            print (join (milliamps) [ mA: fault])
          end
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        const int LOOP_PIN = 34;               // across a 100 ohm shunt: 4 mA = 0.4 V, 20 mA = 2.0 V
        const float SHUNT_OHMS = 100.0;
        const float RANGE_LOW = 0.0, RANGE_HIGH = 10.0;   // the transmitter: 0 to 10 bar
        const int ALARM_PIN = 26;              // relay: energised while everything is healthy

        float readMilliamps() {                // the mean of 16 readings: millivolts / ohms = milliamps
          float sum = 0;
          for (int i = 0; i < 16; i++) sum += analogReadMilliVolts(LOOP_PIN);
          return sum / 16.0 / SHUNT_OHMS;
        }

        void setup() {
          Serial.begin(115200);
          pinMode(ALARM_PIN, OUTPUT);
          digitalWrite(ALARM_PIN, LOW);        // de-energised means alarm, until a good reading
        }

        void loop() {
          float mA = readMilliamps();
          bool healthy = (mA >= 3.6 && mA <= 21.0);   // outside: broken wire or failed transmitter
          digitalWrite(ALARM_PIN, healthy);
          if (healthy) {
            float bar = RANGE_LOW + (mA - 4.0) * (RANGE_HIGH - RANGE_LOW) / 16.0;
            Serial.printf("%.2f mA = %.2f bar\n", mA, bar);
          } else {
            Serial.printf("%.2f mA: fault\n", mA);
          }
          delay(500);
        }
      `,
      py: String.raw`
        from machine import Pin, ADC
        import time

        adc = ADC(Pin(34), atten=ADC.ATTN_11DB)   # across a 100 ohm shunt: 4 mA = 0.4 V, 20 mA = 2.0 V
        SHUNT_OHMS = 100.0
        RANGE_LOW, RANGE_HIGH = 0.0, 10.0         # the transmitter: 0 to 10 bar
        alarm = Pin(26, Pin.OUT, value=0)         # relay: energised while everything is healthy

        def read_milliamps():                     # the mean of 16 readings: millivolts / ohms = milliamps
            total = 0
            for i in range(16):
                total += adc.read_uv() / 1000
            return total / 16 / SHUNT_OHMS

        while True:
            mA = read_milliamps()
            healthy = 3.6 <= mA <= 21.0           # outside: broken wire or failed transmitter
            alarm.value(healthy)
            if healthy:
                bar = RANGE_LOW + (mA - 4.0) * (RANGE_HIGH - RANGE_LOW) / 16.0
                print("%.2f mA = %.2f bar" % (mA, bar))
            else:
                print("%.2f mA: fault" % mA)
            time.sleep_ms(500)
      `,
      output: `
        12.01 mA = 5.01 bar
        12.03 mA = 5.02 bar
        0.04 mA: fault
      `,
      notes: ['The last line is a cable pulled out: the loop carries nothing, which a 0–10 V signal could not tell from zero pressure.', 'A relay module that is active low inverts the alarm: check what yours does at power-up and wire the contacts so that the unpowered state is the alarm.']
    }
  ],
  formulas: [
    {
      name: 'Scaling a 4–20 mA signal',
      expr: 'x = lo + (I - 4)*(hi - lo)/16',
      tex: 'x = x_{\\mathrm{lo}} + \\frac{(I - 4)\\,(x_{\\mathrm{hi}} - x_{\\mathrm{lo}})}{16}',
      vars: {
        x: { name: 'the measured value in engineering units, for example bar', signed: true },
        lo: { name: 'value at 4 mA', tex: 'x_{\\mathrm{lo}}', signed: true, value: 0 },
        hi: { name: 'value at 20 mA', tex: 'x_{\\mathrm{hi}}', signed: true, value: 10 },
        I: { name: 'loop current', q: 'current', unit: 'mA', value: 12, min: 3.6, max: 21 }
      },
      solveFor: 'x',
      note: 'The loop is linear from 4 mA (the bottom of the range) to 20 mA (the top). A current outside 3.6 to 21 mA is a fault, not a value. Solve for I to find the current that the transmitter sends at a given value.',
      stories: { x: 'A transmitter measures from {lo} to {hi}. The loop carries {I}. What is the value?', I: 'A transmitter measures from {lo} to {hi}. It reads {x}. What current is in the loop?' },
      practice: { unknowns: ['x', 'I'] }
    }
  ],
  examples: [
    {
      title: 'Reading a level transmitter',
      q: 'A level transmitter measures 0 to 5 m. The shunt is 100 Ω and the ADC reads 1.28 V. What is the level, and is the loop healthy?',
      steps: ['$I = V/R = 1.28 / 100 = 12.8$ mA, inside the 3.6 to 21 mA window, so the loop is healthy.', '$x = 0 + (12.8 - 4) \\times 5 / 16 = 2.75$ m.'],
      a: 'The tank is at 2.75 m and the loop is healthy.'
    }
  ],
  quiz: [
    { q: 'Why does the 4–20 mA standard start at 4 mA and not at 0 mA?', choices: ['To save current', 'So that 0 mA can mean a broken wire or a dead transmitter, and a two-wire transmitter always has power', 'Because ADCs cannot read 0', 'Historical accident with no use today'], a: 1, why: 'The live zero lets a receiver tell a true zero (4 mA) from a fault (0 mA), and a two-wire transmitter needs a little current to run on.' },
    { q: 'A 100 Ω shunt in a 4–20 mA loop reads 1.20 V. For a 0–10 bar transmitter, what is the pressure?', choices: ['3.0 bar', '5.0 bar', '6.0 bar', '12 bar'], a: 1, why: 'I = 1.20 / 100 = 12 mA, and (12 − 4) / 16 = 0.5 of the range: 5 bar.' },
    { q: 'A 24 V PNP sensor output has to reach an ESP32 input. Which is the sound design?', choices: ['Straight to the pin', 'A resistor divider to 3.3 V', 'A resistor into an optocoupler whose output pulls the pin', 'A diode from the sensor to the pin'], a: 2, why: 'The optocoupler isolates the two sides and tolerates the spikes of a 24 V installation. A divider or a diode passes every transient to the pin.' },
    { q: 'A 0–10 V input tells a broken wire from a real 0 V.', a: false, why: 'A broken wire leaves the input at about 0 V, a perfectly valid reading. That is why safety-relevant measurements use a current loop with a live zero.' }
  ],
  applications: [
    'Pressure, level, flow and temperature transmitters in a process plant.',
    'An ESP32 data logger or gateway added to a machine with a PLC ([[modbus]]).',
    'Valve actuators and variable-speed drives that take a 0–10 V or 4–20 mA command.',
    'Alarm and emergency-stop circuits on machines.'
  ],
  sources: [
    'NAMUR recommendation NE 43, *Standardization of the signal level for the failure information of digital transmitters*.',
    'IEC 61131-2, *Programmable controllers: equipment requirements and tests*, on the electrical characteristics of inputs and outputs.',
    'Espressif, *ESP32 Series Datasheet*, the ADC characteristics, and *ESP-IDF Programming Guide*, ADC calibration.'
  ]
},

/* ================================================================ robots: differential drive and line following */
{
  id: 'robots-on-esp',
  parent: 'control-and-automation',
  title: 'Robots: differential drive and line following',
  level: 2,
  short: 'Two driven wheels steer by the difference of their speeds. A row of light sensors under the front turns the line into one number, the error, and a P or PD loop on that number makes a robot follow it.',
  keywords: ['differential drive', 'robot car', 'line follower', 'line following', 'wheel base', 'turn radius', 'reflectance sensor', 'QTR', 'TCRT5000', 'H-bridge', 'odometry', 'dead reckoning', 'PD control', 'caster', 'motor driver', 'wheel speed'],
  prereq: ['pid-control', 'dc-motors-and-h-bridges', 'motor-pwm-frequency'],
  related: ['encoders-and-speed', 'motor-power-and-protection', 'brownout', 'current-peaks-and-capacitors', 'balancing-robots', 'distance-sensors', 'project-robot-car', 'electronics:dc-motor-control'],
  body: `A robot car is a loop with a body: motors move it, sensors read the world, and the ESP32 decides in between. Two ideas carry most of the subject: steering by the **difference of the wheel speeds**, and following a line by **feedback on a position error**.

### Differential drive

Two driven wheels on one axle and a free caster or ball. Equal speeds drive straight, unequal speeds curve, opposite speeds turn on the spot. With wheel speeds *v*L and *v*R in m/s and a **wheel base** *b* (the distance between the wheels), the robot moves forward at *v* = (*v*R + *v*L) / 2 and turns, counter-clockwise positive, at ω = (*v*R − *v*L) / *b*. The radius of the curve is *R* = (*b* / 2)(*v*R + *v*L) / (*v*R − *v*L): steering is one number, the difference.

A PWM command is not a speed. Motors differ, the battery sags and the floor changes the load, so equal commands drift to one side. An encoder on each wheel and a speed loop make equal commands give equal speeds ([[encoders-and-speed]]); without them the robot only goes roughly where you send it.

### The muscles

A motor driver (an H-bridge with PWM and direction inputs) sits between the pins and the motors ([[dc-motors-and-h-bridges]], [[motor-pwm-frequency]]). Motors draw a burst of current when they start, which drops the supply and can reset the ESP32 in the middle of a turn: give the logic its own regulator, add capacitors, keep the motor return wires short ([[brownout]], [[current-peaks-and-capacitors]]).

### Following a line

A row of **reflectance sensors** under the front sees a dark line on a light floor. Turn the row into one **position error**: give the sensors weights such as −2, −1, 0, 1, 2, and take the average weight of those that see the line. Zero means the line is under the centre. Then the steering is *K*p × error + *K*d × (change of the error per second), and the wheels run at base ± steering.

P alone makes the robot zig-zag, more as the speed goes up; D damps it. I is rarely needed, because a curve is not a constant disturbance. Tune with a low base speed, raise *K*p until it follows, add *K*d to calm the wobble, and then raise the speed until it leaves the line on a sharp corner. If the line is lost, remember which side it was last seen on and keep turning that way. The loop wants a steady rhythm of 100 to 200 Hz ([[sample-time-and-jitter]]); the simulation shows the path and the error.

> [!warn] A robot is moving machinery with a lithium battery. Test with the wheels off the ground, keep fingers out of the wheels, and give the battery a protection circuit and a fuse ([[lithium-cells]]).

> [!key] A differential-drive robot turns by the difference of its wheel speeds, and a line follower turns the sensor row into one error and steers on it with P or PD. Raise the gains and the speed one at a time, keep the rhythm steady, and give the motors their own supply path.`,
  ideas: [
    'A differential-drive robot moves at the mean of its wheel speeds and turns at their difference divided by the wheel base.',
    'A PWM duty is not a speed: encoders and a speed loop make equal commands give equal speeds.',
    'A line follower turns a row of sensors into one weighted position error and steers with P or PD on it.',
    'Motor current spikes can reset the ESP32: separate the supplies, decouple, and keep the loop on a steady rhythm.'
  ],
  pitfalls: [
    'The same PWM on both motors drives straight — Motors, gearboxes and floors differ, so the robot curves. Straight needs equal speeds, which needs encoders and a loop.',
    'More Kp makes a line follower better — Past a point it makes the robot zig-zag faster. The D term, not more P, damps it.',
    'The robot resets in the middle of a turn because of the code — Motor starting current drops the supply and the ESP32 browns out. Check the supply before the code ([[brownout]]).'
  ],
  terms: [
    { term: 'Differential drive', also: ['differential steering', 'skid steer'], def: 'A drive with two independently driven wheels on one axle. The robot steers by running them at different speeds and turns on the spot when they run in opposite directions.' },
    { term: 'Wheel base', also: ['track width', 'axle track'], def: 'The distance between the two driven wheels, which sets how fast a given speed difference turns the robot.' },
    { term: 'Reflectance sensor', also: ['line sensor', 'IR reflective sensor', 'QTR sensor'], def: 'An infrared LED with a phototransistor that measures how much light a surface reflects, used under a robot to tell a dark line from a light floor.' },
    { term: 'Position error', also: ['line position', 'weighted average'], def: 'One number made from the sensor row: the average of the weights of the sensors that see the line. Zero means the line is centred.' },
    { term: 'Odometry', also: ['dead reckoning'], def: 'Estimating where a robot is by adding up the movements of its wheels from encoder counts. The error grows with distance.' }
  ],
  code: [
    {
      title: 'A line follower with five sensors and a PD loop',
      about: 'Five reflectance sensors under the front read 1 when they see the line. Every 10 ms their weighted average becomes the error, and a PD law turns it into a speed difference between the wheels. If no sensor sees the line, the robot keeps turning the way it last saw it.',
      needs: 'An ESP32 DevKit, a five-sensor reflectance array with digital outputs (1 on the line), a dual motor driver with one PWM and one direction input per motor, two gearmotors, and a separate supply for the motors with a common ground. Test with the wheels off the ground.',
      wiring: [['GPIO18, 19, 21, 22, 23', 'sensor outputs, left to right', 'the array\'s own supply is 3.3 V'], ['GPIO25, GPIO26', 'left motor PWM and direction', 'driver inputs'], ['GPIO27, GPIO33', 'right motor PWM and direction', 'driver inputs']],
      blocks: `
        define drive (left) (right)
          set pin (26) to (<(left) ≥ (0)>)
          set PWM on pin (25) to (abs of (constrain (left) between (-255) and (255)))
          set pin (33) to (<(right) ≥ (0)>)
          set PWM on pin (27) to (abs of (constrain (right) between (-255) and (255)))

        when started
          set PWM on pin (25) frequency (20000) resolution (8)
          set PWM on pin (27) frequency (20000) resolution (8)
          set [last error v] to (0)

        every (0.01) seconds
          set [seen v] to (0)
          set [sum v] to (0)
          for each [i v] in (the five sensors, weights -2 -1 0 1 2 :: sensing)
            if <sensor i sees the line> then
              change [seen v] by (1)
              change [sum v] by (weight of sensor i)
            end
          end
          if <(seen) > (0)> then
            set [error v] to ((sum) / (seen))
          else if <(last error) > (0)> then
            set [error v] to (3)
          else
            set [error v] to (-3)
          end
          set [steer v] to ((((35) * (error)) + ((2) * (((error) - (last error)) / (0.01)))))
          set [last error v] to (error)
          drive (((120) + (steer))) (((120) - (steer))) :: my
      `,
      cpp: String.raw`
        const int SENSORS[5] = {18, 19, 21, 22, 23};   // 1 when the sensor sees the line, left to right
        const int WEIGHTS[5] = {-2, -1, 0, 1, 2};
        const int PWM_L = 25, DIR_L = 26;              // one PWM and one direction pin per motor
        const int PWM_R = 27, DIR_R = 33;
        const float BASE = 120;                        // forward command, 0..255
        const float KP = 35.0, KD = 2.0;               // steering per sensor unit; per unit per second
        const uint32_t SAMPLE_MS = 10;

        float lastError = 0;
        uint32_t last = 0;

        void drive(int left, int right) {              // -255..255 for each wheel
          left = constrain(left, -255, 255);
          right = constrain(right, -255, 255);
          digitalWrite(DIR_L, left >= 0);
          ledcWrite(PWM_L, abs(left));
          digitalWrite(DIR_R, right >= 0);
          ledcWrite(PWM_R, abs(right));
        }

        void setup() {
          for (int i = 0; i < 5; i++) pinMode(SENSORS[i], INPUT);
          pinMode(DIR_L, OUTPUT);
          pinMode(DIR_R, OUTPUT);
          ledcAttach(PWM_L, 20000, 8);
          ledcAttach(PWM_R, 20000, 8);
        }

        void loop() {
          uint32_t now = millis();
          if (now - last < SAMPLE_MS) return;
          float dt = (now - last) / 1000.0;
          last = now;
          int seen = 0, sum = 0;
          for (int i = 0; i < 5; i++) {
            if (digitalRead(SENSORS[i])) { seen++; sum += WEIGHTS[i]; }
          }
          float error = seen ? (float)sum / seen : (lastError > 0 ? 3 : -3);   // lost: keep the last way
          float steer = KP * error + KD * (error - lastError) / dt;
          lastError = error;
          drive(BASE + steer, BASE - steer);           // line on the right: the left wheel runs faster
        }
      `,
      py: String.raw`
        from machine import Pin, PWM
        import time

        SENSORS = [Pin(n, Pin.IN) for n in (18, 19, 21, 22, 23)]   # 1 when the sensor sees the line, left to right
        WEIGHTS = (-2, -1, 0, 1, 2)
        pwm_l = PWM(Pin(25), freq=20000, duty_u16=0)   # one PWM and one direction pin per motor
        dir_l = Pin(26, Pin.OUT)
        pwm_r = PWM(Pin(27), freq=20000, duty_u16=0)
        dir_r = Pin(33, Pin.OUT)
        BASE = 120                                     # forward command, 0..255
        KP, KD = 35.0, 2.0                             # steering per sensor unit; per unit per second
        SAMPLE_MS = 10

        def drive(left, right):                        # -255..255 for each wheel
            left = max(-255, min(255, int(left)))
            right = max(-255, min(255, int(right)))
            dir_l.value(left >= 0)
            pwm_l.duty_u16(abs(left) * 257)            # 255 * 257 = 65535
            dir_r.value(right >= 0)
            pwm_r.duty_u16(abs(right) * 257)

        last_error = 0.0
        last = time.ticks_ms()
        while True:
            now = time.ticks_ms()
            if time.ticks_diff(now, last) < SAMPLE_MS:
                continue
            dt = time.ticks_diff(now, last) / 1000
            last = now
            seen = 0
            total = 0
            for pin, weight in zip(SENSORS, WEIGHTS):
                if pin.value():
                    seen += 1
                    total += weight
            if seen:
                error = total / seen
            else:
                error = 3 if last_error > 0 else -3    # lost: keep the last way
            steer = KP * error + KD * (error - last_error) / dt
            last_error = error
            drive(BASE + steer, BASE - steer)          # line on the right: the left wheel runs faster
      `,
      notes: ['Start with a low BASE and KD = 0; raise KP until the robot follows, then add KD. If it turns away from the line, swap the sign of the steering or the two motor wires.', 'Analogue sensor arrays give a finer position than five on-off sensors: weight the readings instead of counting them.']
    }
  ],
  formulas: [
    {
      name: 'Turning rate of a differential drive',
      expr: 'w = (vr - vl)/b',
      tex: '\\omega = \\frac{v_R - v_L}{b}',
      vars: {
        w: { name: 'turning rate (counter-clockwise positive)', tex: '\\omega', q: 'angvel', unit: 'rad/s', signed: true },
        vr: { name: 'speed of the right wheel', tex: 'v_R', q: 'speed', unit: 'm/s', signed: true, value: 0.3 },
        vl: { name: 'speed of the left wheel', tex: 'v_L', q: 'speed', unit: 'm/s', signed: true, value: 0.2 },
        b: { name: 'wheel base', q: 'length', unit: 'cm', value: 10, min: 0.1 }
      },
      solveFor: 'w',
      note: 'For wheels on an axle seen from above, with positive speeds forward. The forward speed is the mean of the two wheel speeds. Opposite equal speeds turn the robot on the spot; solve for vr to find the speed a wanted turning rate needs.',
      stories: { w: 'The right wheel runs at {vr}, the left at {vl}, and the wheels are {b} apart. How fast does the robot turn?' },
      practice: { unknowns: ['w', 'vr'] }
    }
  ],
  examples: [
    {
      title: 'Which way and how fast?',
      q: 'A robot with a wheel base of 10 cm runs its left wheel at 0.30 m/s and its right wheel at 0.20 m/s. How does it move?',
      steps: ['Forward speed: $v = (0.30 + 0.20)/2 = 0.25$ m/s.', 'Turning rate: $\\omega = (v_R - v_L)/b = (0.20 - 0.30)/0.10 = -1$ rad/s. Negative is clockwise: the robot turns right, because its left wheel is the faster one.', 'Radius of the curve: $R = (b/2)(v_R + v_L)/(v_R - v_L) = 0.05 \\times 0.5 / (-0.1) = -0.25$ m, a circle of 25 cm radius to the right.'],
      a: 'It moves at 0.25 m/s and turns right at 1 rad/s (57 degrees per second), on a circle of 25 cm radius.'
    }
  ],
  quiz: [
    { q: 'A differential-drive robot with a wheel base of 10 cm runs its left wheel at 0.30 m/s and its right wheel at 0.20 m/s. Which way does it turn?', choices: ['Right, at 1 rad/s', 'Left, at 1 rad/s', 'Right, at 5 rad/s', 'It goes straight'], a: 0, why: 'ω = (vR − vL) / b = (0.20 − 0.30) / 0.10 = −1 rad/s, clockwise: the faster wheel is on the left, so the robot swings to the right.' },
    { q: 'A line follower with P only zig-zags more as you raise its speed. What helps most?', choices: ['More Kp', 'A derivative term', 'Fewer sensors', 'A longer delay in the loop'], a: 1, why: 'The wobble is an under-damped oscillation. D acts on the rate of change of the error and damps it, while more P raises the oscillation.' },
    { q: 'The line follower loses the line on a sharp corner. A sensible rule is to...', choices: ['Stop and wait', 'Turn towards the side where the line was last seen', 'Go straight at full speed', 'Reverse'], a: 1, why: 'The line left the sensor row on the side where the error was last large, so turning that way brings it back. The last error is remembered for exactly this.' },
    { q: 'Giving both motors the same PWM duty makes the robot drive straight.', a: false, why: 'Motors, gears and tyres differ, and the battery sags, so equal duties give unequal speeds and the robot curves. Straight needs wheel speeds that are measured and controlled.' }
  ],
  applications: [
    'Line-following and maze-solving robots in competitions and classrooms.',
    'Small warehouse and delivery carts that follow a tape or a magnetic strip.',
    'Robot cars controlled over Wi-Fi or Bluetooth LE from a phone ([[project-robot-car]]).',
    'The drive base of any wheeled robot with a camera or a distance sensor on top.'
  ],
  sources: [
    'Siegwart, Nourbakhsh and Scaramuzza, *Introduction to Autonomous Mobile Robots*, the chapter on kinematics of wheeled robots.',
    'Pololu, documentation of the QTR reflectance sensors and the line-following example for the Zumo and 3pi robots.',
    'Arduino core for ESP32 documentation, the *LEDC* API page (core 3.3), and the MicroPython quick reference for the ESP32, PWM.'
  ],
  sim: 'ca-robot'
},

/* ================================================================ balancing robots */
{
  id: 'balancing-robots',
  parent: 'control-and-automation',
  title: 'A balancing robot',
  level: 3,
  short: 'A robot on two wheels is an upside-down broom: unstable, so it needs a gyroscope and an accelerometer, a filter that merges them into a tilt, a control law on the tilt and its rate, and a loop that is fast and steady.',
  keywords: ['balancing robot', 'self-balancing', 'inverted pendulum', 'IMU', 'MPU-6050', 'gyroscope', 'accelerometer', 'complementary filter', 'Kalman filter', 'tilt', 'angle loop', 'PD control', 'unstable', 'Segway'],
  prereq: ['pid-control', 'sample-time-and-jitter', 'filtering-sensor-data', 'motion-sensors-imu'],
  related: ['robots-on-esp', 'i2c', 'encoders-and-speed', 'dc-motors-and-h-bridges', 'stepper-drivers', 'safety-in-control', 'physics:simple-pendulum', 'motors:pid-control'],
  body: `A robot that stands on two wheels is a broom balanced on a palm: unstable by nature. Left alone it falls, and the controller keeps it up by driving the wheels *under* the centre of mass as it starts to lean, towards the lean. The controller has no time to waste.

### How unstable?

Treat the robot as an inverted pendulum whose effective length *L* is the distance from the axle to the centre of mass. For small tilts the angle grows like e^(*r*t) with *r* = √(*g* / *L*). For *L* = 0.1 m that is about 10 per second: the tilt doubles about every 70 ms. A loop at 200 Hz gets 14 chances to correct per doubling; at 50 Hz only 3.5. A taller robot falls more slowly, which is why balancing a long broom is easier than a short one.

### What it needs

1. **An IMU**: a gyroscope and an accelerometer, such as the MPU-6050 on I2C ([[motion-sensors-imu]]).
2. **A tilt estimate.** The accelerometer finds the tilt from the direction of gravity, but it is noisy and is fooled whenever the robot itself accelerates. The gyroscope gives the rate of tilt, smooth and quick, but integrating it drifts. A **complementary filter** takes the quick part from the gyro and the slow part from the accelerometer: *angle = α (angle + rate × dt) + (1 − α) × accelerometer angle*, with α = τ / (τ + dt). At 200 Hz, α = 0.98 means τ ≈ 0.25 s. A Kalman filter does the same job optimally; for one angle the complementary filter is enough.
3. **A fast, steady loop**: 200 Hz or more with the real \`dt\` ([[sample-time-and-jitter]]). Read the IMU in the same pass, at 400 kHz on I2C.
4. **Motors** with enough torque and a driver: geared DC motors, or steppers ([[stepper-drivers]]).

### The control law

Command the wheels with *K*p × tilt + *K*d × tilt rate, where the rate comes **straight from the gyroscope**: it is the derivative, already measured, so nothing noisy has to be differentiated. *K*p has to be larger than gravity's pull to win, *K*d damps. Too little P and it falls; too much P with too little D and the swing grows. The simulation lets you try both, change the loop rate and push the robot.

A tilt loop alone keeps the robot up but not in place: it drifts. Real ones add a slower outer loop on the wheel speed from encoders that tilts the target slightly to bring the robot to rest, and a steering input on top.

> [!warn] A balancing robot lurches. Cut the motors when the tilt passes about 40 degrees, test with the wheels off the ground or in a cradle, and keep fingers away from the wheels. Give the lithium battery a protection circuit and a fuse ([[lithium-cells]]).

> [!key] A balancing robot is an inverted pendulum that doubles its tilt in tens of milliseconds. Merge gyro and accelerometer into a tilt with a complementary filter, command the wheels from the tilt and the gyro rate, and run the loop fast and steady.`,
  ideas: [
    'A robot on two wheels is an inverted pendulum: the tilt grows like e^(rt) with r = √(g / L), doubling in about 70 ms for a centre of mass 10 cm above the axle.',
    'The accelerometer gives a noisy tilt that accelerations corrupt; the gyroscope gives a smooth rate that drifts; a complementary filter combines them.',
    'The control law is Kp times the tilt plus Kd times the gyro rate: the gyroscope measures the derivative directly.',
    'The loop needs 200 Hz or more at a steady sample time, and an outer loop on wheel speed if the robot must stay in place.'
  ],
  pitfalls: [
    'The accelerometer alone is enough to find the tilt — It reads gravity plus the robot\'s own acceleration, so it is wrong exactly when the robot is correcting. It is good for the slow average only.',
    'Integrating the gyro gives the angle — It does for a second or so, then the bias makes it drift away. The accelerometer pulls it back through the filter.',
    'A loop at 20 Hz with the same gains does as well — The tilt can double between two samples at 20 Hz, and the held output adds delay. The gains that work at 200 Hz oscillate or fall at 20.'
  ],
  terms: [
    { term: 'Inverted pendulum', also: ['unstable pendulum'], def: 'A mass balanced above its pivot, which falls over unless something moves the pivot to keep it up. A balancing robot is one, with the wheels as the moving pivot.' },
    { term: 'IMU', also: ['inertial measurement unit', 'MPU-6050'], def: 'A sensor package with a gyroscope and an accelerometer, sometimes a magnetometer too, used to find orientation and motion. The MPU-6050 is a common six-axis part on I2C.' },
    { term: 'Complementary filter', also: ['sensor fusion'], def: 'A filter that takes the fast changes of an angle from the integrated gyroscope and the slow average from the accelerometer, with a weight α close to 1 on the gyroscope path.' },
    { term: 'Gyro bias', also: ['gyro drift', 'zero-rate offset'], def: 'The small reading a gyroscope gives while it is still. Integrated, it makes the angle drift, so it is measured at start-up or removed by the filter.' },
    { term: 'Kalman filter', also: ['state estimator'], def: 'An estimator that weights its model and its measurements by how much each is trusted. It does the job of the complementary filter in a more general and more costly way.' }
  ],
  choose: {
    good: ['A complementary filter for one tilt angle: simple, light and effective', 'Geared DC motors with encoders, for speed and position loops as well', 'A tall, light-on-top body: it falls more slowly and is easier to balance'],
    avoid: ['Integrating the gyroscope alone or reading the accelerometer alone', 'A loop that shares time with Wi-Fi or a display in the same pass', 'Motors without the torque for the fastest correction'],
    check: ['The loop rate and its jitter, measured on the running program', 'The sign of the tilt and of the motor commands: swap them if it runs away from the lean', 'That the motors stop when the tilt passes a limit']
  },
  code: [
    {
      title: 'Tilt filter and balance loop at 200 Hz',
      about: 'Reads an MPU-6050 every 5 ms, merges the accelerometer and the gyroscope with a complementary filter (α = 0.98), and drives both wheels with Kp × tilt + Kd × rate. The motors stop beyond 40 degrees. The signs and gains are starting values: they depend on how the board is mounted and on your motors.',
      needs: 'An ESP32 DevKit, an MPU-6050 board on I2C with its X axis along the wheel axle, two geared DC motors with a driver that takes one PWM and one direction input each, and a separate motor supply. Test with the wheels off the ground, and calibrate the gyro with the robot still.',
      wiring: [['GPIO21, GPIO22', 'MPU-6050 SDA and SCL', '3.3 V and GND; address 0x68 with AD0 low'], ['GPIO25, GPIO26', 'left motor PWM and direction', 'driver inputs'], ['GPIO27, GPIO33', 'right motor PWM and direction', 'driver inputs']],
      blocks: `
        define drive (command)
          set pin (26) to (<(command) ≥ (0)>)
          set pin (33) to (<(command) < (0)>)
          set PWM on pin (25) to (abs of (constrain (command) between (-255) and (255)))
          set PWM on pin (27) to (abs of (constrain (command) between (-255) and (255)))

        when started
          start I2C on SDA (21) SCL (22)
          I2C write (0x00) to address (0x68) register (0x6B) :: bus
          set [angle v] to (0)
          set [last v] to (microseconds since start)

        every (0.005) seconds
          set [dt v] to (((microseconds since start) - (last)) / (1000000))
          set [last v] to (microseconds since start)
          read the accelerometer and gyro from address (0x68) :: sensing
          set [tilt from gravity v] to (atan2 of (ay) and (az) in degrees)
          set [rate v] to ((gx) / (131))
          set [angle v] to (((0.98) * ((angle) + ((rate) * (dt)))) + ((0.02) * (tilt from gravity)))
          set [command v] to (((25) * (angle)) + ((1.2) * (rate)))
          if <(abs of (angle)) > (40)> then
            set [command v] to (0)
          end
          drive (command) :: my
      `,
      cpp: String.raw`
        #include <Wire.h>

        const int MPU = 0x68;                         // MPU-6050 on I2C, AD0 low
        const int PWM_L = 25, DIR_L = 26, PWM_R = 27, DIR_R = 33;
        const float KP = 25.0, KD = 1.2;              // starting values: per degree; per degree per second
        const float ALPHA = 0.98;                     // complementary filter: the gyro for the quick part
        const uint32_t SAMPLE_US = 5000;              // 200 Hz

        float angle = 0;                              // degrees from upright
        uint32_t lastUs = 0;

        int16_t read16() {                            // two bytes, high first
          int16_t high = Wire.read();
          int16_t low = Wire.read();
          return (int16_t)((high << 8) | (low & 0xFF));
        }

        void drive(int command) {                     // the same command to both wheels: mirror one motor if needed
          command = constrain(command, -255, 255);
          digitalWrite(DIR_L, command >= 0);
          digitalWrite(DIR_R, command < 0);
          ledcWrite(PWM_L, abs(command));
          ledcWrite(PWM_R, abs(command));
        }

        void setup() {
          Wire.begin(21, 22);
          Wire.setClock(400000);
          Wire.beginTransmission(MPU); Wire.write(0x6B); Wire.write(0); Wire.endTransmission();   // wake up
          pinMode(DIR_L, OUTPUT);
          pinMode(DIR_R, OUTPUT);
          ledcAttach(PWM_L, 20000, 8);
          ledcAttach(PWM_R, 20000, 8);
          lastUs = micros();
        }

        void loop() {
          uint32_t now = micros();
          if (now - lastUs < SAMPLE_US) return;
          float dt = (now - lastUs) / 1e6;            // the real time since the last pass
          lastUs = now;

          Wire.beginTransmission(MPU); Wire.write(0x3B); Wire.endTransmission(false);
          Wire.requestFrom(MPU, 14);
          read16();                                   // ax: not used
          int16_t ay = read16();
          int16_t az = read16();
          read16();                                   // temperature
          int16_t gx = read16();                      // the rate about the wheel axle

          float tiltFromGravity = atan2((float)ay, (float)az) * 180.0 / PI;
          float rate = gx / 131.0;                    // degrees per second at the +-250 range
          angle = ALPHA * (angle + rate * dt) + (1 - ALPHA) * tiltFromGravity;
          float command = KP * angle + KD * rate;
          if (fabs(angle) > 40) command = 0;          // fallen over: stop the wheels
          drive((int)command);
        }
      `,
      py: String.raw`
        from machine import Pin, I2C, PWM
        import time, math, struct

        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000)   # MPU-6050 on I2C, AD0 low
        MPU = 0x68
        pwm_l = PWM(Pin(25), freq=20000, duty_u16=0)
        dir_l = Pin(26, Pin.OUT)
        pwm_r = PWM(Pin(27), freq=20000, duty_u16=0)
        dir_r = Pin(33, Pin.OUT)
        KP, KD = 25.0, 1.2                           # starting values: per degree; per degree per second
        ALPHA = 0.98                                 # complementary filter: the gyro for the quick part
        SAMPLE_US = 5000                             # 200 Hz

        def drive(command):                          # the same command to both wheels: mirror one motor if needed
            command = max(-255, min(255, int(command)))
            dir_l.value(command >= 0)
            dir_r.value(command < 0)
            pwm_l.duty_u16(abs(command) * 257)       # 255 * 257 = 65535
            pwm_r.duty_u16(abs(command) * 257)

        i2c.writeto_mem(MPU, 0x6B, b'\x00')          # wake up
        angle = 0.0                                  # degrees from upright
        last = time.ticks_us()
        while True:
            now = time.ticks_us()
            if time.ticks_diff(now, last) < SAMPLE_US:
                continue
            dt = time.ticks_diff(now, last) / 1e6    # the real time since the last pass
            last = now

            ax, ay, az, temp, gx, gy, gz = struct.unpack('>7h', i2c.readfrom_mem(MPU, 0x3B, 14))
            tilt_from_gravity = math.degrees(math.atan2(ay, az))
            rate = gx / 131.0                        # degrees per second at the +-250 range
            angle = ALPHA * (angle + rate * dt) + (1 - ALPHA) * tilt_from_gravity
            command = KP * angle + KD * rate
            if abs(angle) > 40:                      # fallen over: stop the wheels
                command = 0
            drive(command)
      `,
      notes: ['The gyro has a small zero-rate offset: average a second of readings at start-up with the robot still, and subtract it from the rate.', 'At 200 Hz MicroPython is marginal, because every pass reads the sensor and allocates objects; C++ is the better tool for this loop.']
    }
  ],
  formulas: [
    {
      name: 'How fast an inverted pendulum falls',
      expr: 'r = sqrt(g/L)',
      tex: 'r = \\sqrt{\\frac{g}{L}}',
      vars: {
        r: { name: 'growth rate of the tilt', q: 'rate', unit: '1/s' },
        g: { const: 'g' },
        L: { name: 'distance from the axle to the centre of mass', q: 'length', unit: 'cm', value: 10, min: 0.1 }
      },
      solveFor: 'r',
      note: 'For small tilts the angle grows like e raised to r times t, so the time to double is 0.69 / r. A taller robot has a smaller r and falls more slowly. Solve for L to see how tall a robot must be for a given falling rate.',
      stories: { r: 'A balancing robot has its centre of mass {L} above the axle. At what rate does a small tilt grow?' },
      practice: { unknowns: ['r', 'L'] }
    },
    {
      name: 'Weight of the gyro in a complementary filter',
      expr: 'a = tau/(tau + dt)',
      tex: '\\alpha = \\frac{\\tau}{\\tau + \\Delta t}',
      vars: {
        a: { name: 'weight of the gyro path α', tex: '\\alpha', min: 0, max: 1 },
        tau: { name: 'time constant of the filter', tex: '\\tau', q: 'time', unit: 'ms', value: 250, min: 0 },
        dt: { name: 'sample period', tex: '\\Delta t', q: 'time', unit: 'ms', value: 5, min: 0.001 }
      },
      solveFor: 'a',
      note: 'Below the time constant the angle follows the gyroscope; over longer times it follows the accelerometer. Solve for the time constant to find what a given α means at your sample period.',
      stories: { a: 'A balancing robot runs its filter every {dt} with a time constant of {tau}. What weight does the gyro path get?' },
      practice: { unknowns: ['a', 'tau'] }
    }
  ],
  examples: [
    {
      title: 'Is 50 Hz fast enough?',
      q: 'A robot has its centre of mass 5 cm above the axle. How quickly does a small tilt double, and how many loop passes is that at 50 Hz and at 200 Hz?',
      steps: ['$r = \\sqrt{g/L} = \\sqrt{9.81/0.05} = 14$ per second.', 'The tilt doubles in $\\ln 2 / r = 0.69/14 = 0.05$ s, 50 ms.', 'At 50 Hz (20 ms) that is 2.5 passes per doubling; at 200 Hz (5 ms) it is 10.'],
      a: 'A short robot doubles its tilt in 50 ms, so 50 Hz leaves only two or three corrections per doubling: marginal. 200 Hz leaves ten.'
    }
  ],
  quiz: [
    { q: 'Robot A has its centre of mass 5 cm above the axle and robot B 20 cm. Which falls faster?', choices: ['A, twice as fast', 'B, twice as fast', 'Both the same', 'A, four times as fast'], a: 0, why: 'r = √(g / L): for 5 cm it is 14 per second and for 20 cm 7 per second. The shorter robot falls twice as fast, so it needs a faster loop.' },
    { q: 'Why does the balance law use the gyroscope rate directly as the D term?', choices: ['The gyroscope is more accurate than the accelerometer', 'It measures the derivative of the tilt without differentiating a noisy angle', 'It saves a multiplication', 'The accelerometer cannot be read fast enough'], a: 1, why: 'A gyroscope measures angular velocity, which is the derivative of the angle. Differentiating the estimated angle would amplify the noise of the accelerometer; the gyro gives the rate clean.' },
    { q: 'What goes wrong if the robot uses only the integrated gyroscope as its tilt?', choices: ['The angle is noisy', 'The angle drifts away because of the gyro bias', 'The robot cannot move', 'The loop becomes slow'], a: 1, why: 'A tiny constant offset of the gyro grows into a steadily increasing angle when integrated. The accelerometer path of the complementary filter pulls it back.' },
    { q: 'The gains that balance a robot at 200 Hz will work the same at 20 Hz.', a: false, why: 'At 20 Hz the tilt can double between two passes and the held output adds delay. The same gains then oscillate or let the robot fall.' }
  ],
  applications: [
    'Educational and hobby two-wheeled balancing robots.',
    'Self-balancing scooters and personal transporters in their larger form.',
    'Camera gimbals and drones, which use the same filter and a similar loop for their attitude.',
    'Any tall load that must be kept upright by moving its base.'
  ],
  sources: [
    'Åström and Murray, *Feedback Systems: An Introduction for Scientists and Engineers*, the inverted pendulum examples.',
    'InvenSense, *MPU-6000 and MPU-6050 Product Specification* and *Register Map and Descriptions*.',
    'Madgwick, *An efficient orientation filter for inertial and inertial/magnetic sensor arrays*, 2010.'
  ],
  sim: 'ca-balance'
},

/* ================================================================ safety in control */
{
  id: 'safety-in-control',
  parent: 'control-and-automation',
  title: 'Safety: what happens when it fails',
  level: 2,
  short: 'Every control program is eventually wrong: a wire breaks, the power dips, the code hangs, a relay welds shut. Decide on purpose what each output does then, and put a last line of defence that does not depend on the program.',
  keywords: ['safety', 'fail-safe', 'safe state', 'watchdog', 'thermal fuse', 'thermal runaway', 'emergency stop', 'brownout', 'plausibility check', 'latched fault', 'sensor failure', 'independent protection', 'IEC 60730', 'e-stop', 'pull-down', 'heater'],
  prereq: ['open-and-closed-loops', 'watchdogs', 'pins-at-boot'],
  related: ['brownout', 'strapping-pins', 'heaters-and-thermal-loads', 'thermostats', 'error-states-and-recovery', 'reliability-in-the-field', 'switching-mains-safely', 'solid-state-relays-and-triacs', 'watchdog-resets'],
  body: `Every control program is eventually wrong: a sensor wire breaks, the supply dips, the code hangs, a relay welds shut, a cable is cut. Designing for safety does not ask *whether* it happens but **what every output does when it does**. The answer is chosen on purpose, and it must not depend on the thing that failed.

### Decide the safe state of every output

A heater is safe off, a fan cooling something hot is safe on, a fill valve is safe closed. For each output ask what it does:

- **At reset and at boot.** For a moment the pins are floating inputs, and a few glitch ([[pins-at-boot]], [[strapping-pins]]). A pull-down on a MOSFET gate or a relay driver keeps the load off; many relay modules are active low, and may click on.
- **In a brownout.** The chip resets again and again and its outputs float ([[brownout]]).
- **When a sensor fails.** An open NTC reads very cold, so the heater goes on. Check that readings are plausible and change at a plausible rate, compare two sensors where it matters, and watch for **runaway**: the heater has been on for minutes and nothing got warmer.
- **When communication is lost.** A command that arrived over the network goes stale. After a timeout fall back to a harmless default, not to the last command.
- **When the program hangs.** A watchdog restarts it. Feed the watchdog from the control loop after its checks passed, never from a timer ([[watchdogs]]).
- **When the power goes.** Wire contacts so that no power means the safe state: a heater relay that is normally open, a stop circuit that is normally closed.

### An independent last line

Software can hang and a relay or an SSR can fail closed: solid-state relays usually fail shorted. The last protection must depend on neither. A **thermal fuse** or a **thermostat cut-out** in series with the heater, set above the highest permitted temperature; an **emergency stop** that opens the power path through a contactor, not an input the program reads; a limit switch at the end of a travel.

### Latch it and say so

After a fault, switch off, **latch** the fault, show it and restart only after a deliberate action. See [[error-states-and-recovery]].

### Test the failures

Unplug the sensor, short it, cut the supply, hold the program in a loop: a protection that was never triggered is a hope. The simulation injects these faults.

> [!warn] Heaters, motors and anything that moves or burns need protection that works without the program: a thermal fuse or cut-out in series, an emergency stop that opens the power path, and a test of every failure. A hobby controller is not a certified safety device: do not rely on it where a failure can hurt someone ([[switching-mains-safely]]).

> [!key] For every output decide the safe state at reset, brownout, sensor loss, lost communication, a hang and power loss. Check the sensor, latch faults, feed the watchdog only from a healthy loop, and add an independent cut-out that works when the program and the switch do not.`,
  ideas: [
    'For each output decide on purpose what it does at reset, in a brownout, when a sensor fails, when communication is lost, when the program hangs and when the power goes.',
    'A broken sensor often looks like a safe reading: an open thermistor reads cold and the heater goes on, so readings need a plausibility and a runaway check.',
    'Software and switches fail: protect with something independent, such as a thermal fuse, a cut-out or an emergency stop in the power path.',
    'Latch a fault, show it and restart deliberately; feed the watchdog only after the control checks have run.'
  ],
  pitfalls: [
    'The program checks the sensor, so no cut-out is needed — A check inside the program fails when the program hangs, and cannot see a relay that has welded shut. The last line must be independent.',
    'A watchdog makes the system safe — It restarts a hung program. During the reset the outputs float, and a restart that clears the fault can bring the heater straight back on. Latch faults and give the outputs a safe default.',
    'The pin is low at boot because setup() sets it low — For the first moments the pin is an input and a few glitch before any code runs. A pull-down resistor, not the program, holds the load off.'
  ],
  terms: [
    { term: 'Safe state', also: ['fail-safe state', 'fail-safe'], def: 'The condition of an output in which a failure does the least harm: a heater off, a valve closed, a motor stopped. A design chooses it for every output and every failure.' },
    { term: 'Thermal cut-out', also: ['thermal fuse', 'over-temperature cut-out', 'thermal link'], def: 'A device in series with a heater that opens when it gets too hot, independent of the control electronics. A thermal fuse opens once for good; a thermostat cut-out resets.' },
    { term: 'Plausibility check', also: ['sanity check', 'range check'], def: 'A test that a reading is possible before it is used: inside a sensible range, changing at a sensible rate, agreeing with a second sensor.' },
    { term: 'Latched fault', also: ['latch', 'fault latch'], def: 'A fault that stays set after the cause seems to have gone, until it is cleared deliberately, so that a failing part cannot hide.' },
    { term: 'Thermal runaway', also: ['runaway'], def: 'The heater staying on while the temperature does not respond or keeps climbing, because of a failed sensor or a stuck switch. Firmware checks that heating produces a rise.' }
  ],
  choose: {
    good: ['A pull-down on every gate and relay input, plus a normally-open contact for a heater', 'A thermal fuse in series with every heater, whatever the controller', 'A latched fault and a visible alarm'],
    avoid: ['Relying on setup() or the main loop to hold a load off', 'An emergency stop that is only an input read by the program', 'A fault that clears itself and restarts the load'],
    check: ['What every output does at reset, with the board on a scope', 'That unplugging and shorting each sensor puts the load in its safe state', 'That the independent cut-out opens before the program\'s limit would matter']
  },
  code: [
    {
      title: 'A heater controller that fails safe',
      about: 'A thermostat with checks: a reading outside 0 to 100 °C is a sensor fault, a temperature above 70 °C is a fault, and a heater that has been on for two minutes without raising the temperature by 2 °C is a runaway. A fault switches the heater off and stays latched until reset. A 5 s watchdog is fed only after all the checks have run. This does not replace the thermal fuse.',
      needs: 'The heated block of [[pid-control]]: an ESP32 DevKit, a TMP36 and a MOSFET-switched 12 V heater with a 10 kΩ pull-down on the gate. The runaway times suit a small block; set them for yours. Keep a thermal cut-out in series with the heater.',
      wiring: [['GPIO34', 'TMP36 output', '3.3 V → TMP36 → GND, a 100 kΩ pull-down at the pin so that an unplugged sensor reads cold'], ['GPIO26', 'MOSFET gate through 220 Ω', 'with 10 kΩ from the gate to GND']],
      blocks: `
        when started
          set pin (26) to [LOW v]
          set pin (26) as [output v]
          start watchdog with a timeout of (5) seconds, watching this program :: power
          set [heating v] to <false>
          set [fault v] to <false>

        every (0.5) seconds
          set [t v] to (((analog read pin (34) in millivolts) - (500)) / (10))
          if <<<(t) < (0)> or <(t) > (100)>> or <(t) > (70)>> then
            set [fault v] to <true>
          end
          if <<heating> and <<((milliseconds since start) - (on since)) > (120000)> and <(t) < ((start temperature) + (2))>>> then
            set [fault v] to <true>
          end
          if <fault> then
            set [heating v] to <false>
          else
            if <<not <heating>> and <(t) < (39)>> then
              set [heating v] to <true>
              set [on since v] to (milliseconds since start)
              set [start temperature v] to (t)
            end
            if <<heating> and <(t) > (41)>> then
              set [heating v] to <false>
            end
          end
          set pin (26) to (heating)
          feed the watchdog :: power
      `,
      cpp: String.raw`
        #include <esp_task_wdt.h>

        const int SENSOR_PIN = 34;                    // TMP36, with a pull-down at the pin
        const int HEATER_PIN = 26;                    // gate of the MOSFET, with a 10 k pull-down
        const float SETPOINT = 40.0, BAND = 2.0;
        const float MIN_VALID = 0.0, MAX_VALID = 100.0;   // a reading outside this is a sensor fault
        const float LIMIT = 70.0;                     // a temperature above this is a fault
        const uint32_t RUNAWAY_MS = 120000;           // heater on this long ...
        const float RUNAWAY_RISE = 2.0;               // ... must have raised the temperature by this much

        bool heating = false, fault = false;
        float startTemp = 0;
        uint32_t onSince = 0, last = 0;

        float readTemperature() {
          return (analogReadMilliVolts(SENSOR_PIN) - 500.0) / 10.0;
        }

        void setup() {
          Serial.begin(115200);
          digitalWrite(HEATER_PIN, LOW);              // off before the pin becomes an output
          pinMode(HEATER_PIN, OUTPUT);
          esp_task_wdt_config_t config = {};
          config.timeout_ms = 5000;
          config.idle_core_mask = 0;
          config.trigger_panic = true;                // reset the chip if the loop stops
          if (esp_task_wdt_reconfigure(&config) != ESP_OK) esp_task_wdt_init(&config);
          esp_task_wdt_add(NULL);                     // watch the task that runs loop()
        }

        void loop() {
          uint32_t now = millis();
          if (now - last < 500) return;
          last = now;
          float t = readTemperature();
          if (t < MIN_VALID || t > MAX_VALID || t > LIMIT) fault = true;       // nonsense or too hot
          if (heating && now - onSince > RUNAWAY_MS && t < startTemp + RUNAWAY_RISE) fault = true;   // no response
          if (fault) {
            heating = false;                          // latched until reset
          } else {
            if (!heating && t < SETPOINT - BAND / 2) { heating = true; onSince = now; startTemp = t; }
            if (heating && t > SETPOINT + BAND / 2) heating = false;
          }
          digitalWrite(HEATER_PIN, heating);
          if (fault) Serial.println("FAULT: heater off until reset");
          esp_task_wdt_reset();                       // fed only after every check ran
        }
      `,
      py: String.raw`
        from machine import Pin, ADC, WDT
        import time

        adc = ADC(Pin(34), atten=ADC.ATTN_11DB)       # TMP36, with a pull-down at the pin
        heater = Pin(26, Pin.OUT, value=0)            # gate of the MOSFET, with a 10 k pull-down
        SETPOINT, BAND = 40.0, 2.0
        MIN_VALID, MAX_VALID = 0.0, 100.0             # a reading outside this is a sensor fault
        LIMIT = 70.0                                  # a temperature above this is a fault
        RUNAWAY_MS = 120000                           # heater on this long ...
        RUNAWAY_RISE = 2.0                            # ... must have raised the temperature by this much

        def read_temperature():
            return (adc.read_uv() / 1000 - 500.0) / 10.0

        wdt = WDT(timeout=5000)                       # reset the chip if the loop stops
        heating = False
        fault = False
        start_temp = 0.0
        on_since = time.ticks_ms()
        last = time.ticks_ms()
        while True:
            now = time.ticks_ms()
            if time.ticks_diff(now, last) < 500:
                continue
            last = now
            t = read_temperature()
            if t < MIN_VALID or t > MAX_VALID or t > LIMIT:                  # nonsense or too hot
                fault = True
            if heating and time.ticks_diff(now, on_since) > RUNAWAY_MS and t < start_temp + RUNAWAY_RISE:
                fault = True                                                 # no response
            if fault:
                heating = False                       # latched until reset
            else:
                if not heating and t < SETPOINT - BAND / 2:
                    heating = True
                    on_since = now
                    start_temp = t
                if heating and t > SETPOINT + BAND / 2:
                    heating = False
            heater.value(heating)
            if fault:
                print("FAULT: heater off until reset")
            wdt.feed()                                # fed only after every check ran
      `,
      notes: ['Unplug the TMP36 on purpose and check that the fault trips; then try the run-away case by holding the sensor in the air while the heater warms the block. A check that has never fired is a hope.', 'The watchdog protects against a hung loop, not against a heater stuck on by a welded relay: that is the job of the thermal fuse in series.']
    }
  ],
  quiz: [
    { q: 'The wire of an NTC thermistor in a divider breaks. The controller computes the temperature from the voltage. What does it see, and what does the heater do if nothing checks?', choices: ['A very hot reading, heater off', 'A very cold reading, heater full on', 'The last good reading', 'An error that stops the program'], a: 1, why: 'An open NTC has a huge resistance, which the program reads as a very low temperature. The loop heats at full power, for ever. A range check and an independent cut-out stop it.' },
    { q: 'Which is a sound last line of defence for a heater that can start a fire?', choices: ['A GPIO that the program sets low on a fault', 'A thermal fuse in series with the heater', 'A second ESP32 watching the first', 'A comment in the code'], a: 1, why: 'A thermal fuse works with no program, no power for the logic and no switch that can fail closed. The others share a failure with the thing they protect.' },
    { q: 'A watchdog is fed by a timer interrupt every second, and the main loop hangs. What happens?', choices: ['The watchdog resets the chip after its timeout', 'Nothing: the timer keeps feeding it and the hang goes on', 'The timer stops', 'The heater turns off'], a: 1, why: 'The watchdog only proves that the timer works. It must be fed from the control loop, after its checks have run, so that a hang there stops the feeding.' },
    { q: 'After a sensor fault the controller resumes heating as soon as the reading looks sensible again.', a: false, why: 'A fault that clears itself hides a failing part and gives a heater that cycles on and off under fault. Latch the fault, show it and restart after a deliberate action.' }
  ],
  applications: [
    'Heaters, ovens, 3D-printer hot ends and kilns, where firmware adds thermal-runaway protection.',
    'Motor-driven machines with an emergency stop that opens the power path.',
    'Pumps and valves that must close when the controller or its network fails.',
    'Remote devices that are only visited once a year and must recover or fall safe by themselves ([[reliability-in-the-field]]).'
  ],
  sources: [
    'IEC 60730-1, *Automatic electrical controls*: the general requirements, including protection that is independent of the control.',
    'IEC 61508, *Functional safety of electrical, electronic and programmable electronic safety-related systems*: the general framework.',
    'Espressif, *ESP-IDF Programming Guide*, Watchdogs; and the Marlin documentation of thermal protection and thermal runaway.'
  ],
  sim: 'ca-fault'
}
);
