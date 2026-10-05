/* HYPER-ESP32 · content/designing-a-solution.js
 *
 * Topic "Designing a solution" (branch From Idea to Product): the method of turning a sentence into a real electronic
 * product, worked through one running example — a greenhouse monitor that runs a year on one battery cell and a
 * plugged-in waterer that obeys it. Twelve steps: requirements, the block diagram, the parts, the stages of prototyping,
 * the minimal circuit around a module, the schematic, the board layout, the bare chip, the enclosure, heat, the bill of
 * materials and cost, and the documentation. The steps are the app's own tools: the project advisor, the pin planner,
 * the power budget, the state-machine lab, the block lab and the GUI lab.
 */
Hyper.add(
/* ================================================================ from an idea to requirements */
{
  id: 'from-idea-to-requirements',
  parent: 'designing-a-solution',
  title: 'From an idea to requirements',
  level: 1,
  short: 'An idea such as "water my greenhouse" cannot be built, tested or priced. Turning it into short sentences with numbers (how often, how far, how long on a battery, how accurate, what must never happen) is the first design step, and it picks the chip for you.',
  keywords: ['requirements', 'specification', 'use case', 'acceptance test', 'idea to product', 'design method', 'greenhouse', 'testable', 'constraints', 'failure mode', 'project advisor', 'design process', 'brief'],
  prereq: ['choosing-a-chip', 'chip-module-board'],
  related: ['block-diagrams', 'choosing-the-parts', 'battery-life-budget', 'link-budget', 'from-requirements-to-states', 'choosing-a-board'],
  body: `"Water my greenhouse when it is dry, and tell me how it is doing." A good idea, and nobody can build it yet. How often should it look? How dry is dry? Tell me how, and from how far? A year on a battery, or a cable to the wall? Two people reading the sentence would build two different devices, and neither could prove theirs right.

A **requirement** is a sentence that a measurement can settle. The first design step is to turn the idea into a short list of them, before choosing a single part. The chip, the battery and the board follow from the list, and "is this good enough?" is settled by pointing at it.

### Words into numbers

Ask the idea six questions:

| Question | Vague | Testable |
|---|---|---|
| How often? | "regularly" | every 10 minutes, give or take one |
| How accurate? | "accurate" | air temperature within 0.5 °C, humidity within 3 % |
| How far? | "across the garden" | reaches the router 15 m away, one glass wall between |
| How long on a battery? | "a long time" | 12 months from one 18650 cell, never recharged |
| Where does it live? | "in the greenhouse" | -10 to 50 °C, condensation, no direct rain |
| What must never happen? | "nothing bad" | a stuck valve never runs for more than 5 minutes |

The last row is the most valuable. A **failure mode** written down becomes a design decision (a hardware timer, a valve that closes without power); one not written down becomes a flooded bed.

### The numbers pick the hardware

Each line points at a part of the design. "Every 10 minutes for 12 months" is an energy budget ([[battery-life-budget]]); "15 m through glass" a link budget ([[link-budget]]); "condensation" an enclosure ([[enclosures]]). Hand the sentence to [the project advisor](#/tools/advisor): it picks out the needs it recognises (here Wi-Fi, analogue inputs, a battery), ranks the chips of the catalogue, and lists the ones it ruled out. For the monitor it puts the ESP32-C3 first: a first answer to check in [[choosing-the-parts]], not a verdict.

### Conflicts show up on paper

Look for lines that fight. "A year on one cell" and "opens a 12 V valve" do not belong in one box: the valve wants an adapter's worth of power and the sensor sips microamps. The answer is two units that talk over Wi-Fi, a battery monitor and a plugged-in waterer. It costs a sentence now, a redesign later.

### The method of this topic

Each following page is a step, and the app has a tool for most: the advisor (the chip), [the pin planner](#/tools/pinout/plan) (the pins), [the power budget](#/tools/espcalc/battery) (the battery), [the state-machine lab](#/tools/fsmlab) (the behaviour), [the block lab](#/tools/blocklab) (the program) and [the GUI lab](#/tools/displaylab/gui) (a screen).

> [!key] Turn the idea into sentences a measurement can prove or disprove: numbers for rate, range, accuracy, battery life and surroundings, and the one thing that must never happen. Conflicts appear on paper, where they cost nothing, and the list chooses the chip.`,
  ideas: [
    'A requirement is a sentence a measurement can settle: it has a number, a unit and a condition.',
    'Ask how often, how accurate, how far, how long on a battery, where it lives and what must never happen.',
    'The numbers decide the hardware: a rate and a lifetime give an energy budget, a distance gives a link budget, damp gives an enclosure.',
    'Lines of the list that fight each other (a year on a cell against a 12 V valve) are best found before any part is bought.'
  ],
  pitfalls: [
    'I will know what I need when I see it working — A prototype built without a list proves only that something works, not that it is the right thing, and nobody can say when it is finished. Ten minutes of writing numbers saves weeks.',
    'Requirements are for big companies and contracts — A one-person project that must run unattended for a year needs them more: there is no colleague to notice that "it lasts a long time" meant three weeks.',
    'The list is fixed once written — It is the current best statement. Prototypes teach you that a number was wrong; change the line, and see what else changes.'
  ],
  terms: [
    { term: 'Requirement', also: ['specification', 'spec'], def: 'A statement of what the product must do, written so that a measurement can show whether it does. Good ones carry a number, a unit and the conditions.' },
    { term: 'Acceptance test', also: ['pass criterion'], def: 'The measurement that decides whether a requirement is met, written down before the design starts: for example "log 144 readings in 24 hours with the box closed".' },
    { term: 'Constraint', also: ['boundary condition'], def: 'A limit on the solution rather than a function of it: the size, the cost, the supply, the temperature range, the laws that apply.' },
    { term: 'Failure mode', also: ['what can go wrong'], def: 'A particular way the product can fail, such as a valve stuck open. Listing them early turns each into a design decision.' },
    { term: 'Margin', also: ['safety margin', 'headroom'], def: 'The room left between what the design achieves and what the requirement demands. A battery life that meets the target exactly has no margin for a cold night or an ageing cell.' }
  ],
  choose: {
    good: ['Anything that will run unattended, outdoors or for months', 'A project with more than one person, or one that someone else will build or buy', 'A device that mixes a battery with something heavy (a motor, a valve, a screen)'],
    avoid: ['Skipping it because the idea feels obvious: the six questions take ten minutes', 'Writing "fast", "long" or "accurate" without a number', 'Treating the list as sacred after a prototype has shown a number to be wrong'],
    check: ['Can each line be settled by a measurement you could actually make?', 'Does any pair of lines fight (battery against power, size against antenna)?', 'Is there a line for the thing that must never happen?']
  },
  code: [
    {
      title: 'A wake-up cycle that checks its own requirement',
      about: 'The first prototype of the greenhouse monitor wakes, reads the soil probe, joins Wi-Fi, then reports how long it was awake against the requirement and sleeps for ten minutes. A requirement you can print is a requirement you can test.',
      needs: 'An ESP32-C3 board such as the XIAO ESP32C3, a capacitive soil probe whose analogue output stays below 2.5 V, and a Wi-Fi network.',
      wiring: [['GPIO3', 'soil probe output', 'ADC1; use a divider if the probe can exceed 2.5 V'], ['3V3 and GND', 'soil probe supply']],
      blocks: `
        when started
          set [soil v] to (analog read pin (3) in millivolts)
          set [wifiStart v] to (milliseconds since start)
          connect to Wi-Fi [your-ssid] password [your-password]
          repeat until <<Wi-Fi connected?> or <((milliseconds since start) - (wifiStart)) > (10000)>>
            wait (0.01) seconds
          end
          set [awake v] to (milliseconds since start)
          print (join [soil mV: ] (soil))
          print (join [awake ms: ] (awake))
          if <(awake) > (1500)> then
            print [FAIL: awake longer than the requirement]
          else
            print [PASS]
          end
          deep sleep for (600) seconds
      `,
      cpp: String.raw`
        #include <WiFi.h>

        const int PIN_SOIL = 3;                       // ADC1 channel of the soil probe
        const char *SSID = "your-ssid";
        const char *PASS = "your-password";
        const uint32_t REQ_AWAKE_MS = 1500;           // requirement: awake no longer than this
        const uint64_t SLEEP_US = 600ULL * 1000000ULL; // requirement: a reading every 10 minutes

        RTC_DATA_ATTR uint32_t cycle = 0;             // these two survive deep sleep
        RTC_DATA_ATTR uint32_t worstMs = 0;

        void setup() {
          Serial.begin(115200);
          uint32_t soil = analogReadMilliVolts(PIN_SOIL);

          WiFi.mode(WIFI_STA);
          WiFi.begin(SSID, PASS);
          uint32_t t0 = millis();
          while (WiFi.status() != WL_CONNECTED && millis() - t0 < 10000) delay(10);
          uint32_t wifiMs = millis() - t0;
          // publish the reading here

          uint32_t awakeMs = millis();                // time since this wake-up began
          cycle++;
          if (awakeMs > worstMs) worstMs = awakeMs;
          Serial.printf("cycle %lu: soil %lu mV, Wi-Fi %lu ms, awake %lu ms, worst %lu ms: %s\n",
                        (unsigned long)cycle, (unsigned long)soil, (unsigned long)wifiMs,
                        (unsigned long)awakeMs, (unsigned long)worstMs,
                        awakeMs <= REQ_AWAKE_MS ? "PASS" : "FAIL");
          Serial.flush();
          esp_sleep_enable_timer_wakeup(SLEEP_US);
          esp_deep_sleep_start();
        }

        void loop() {}
      `,
      py: String.raw`
        import machine, network, struct, time
        from machine import ADC, Pin, RTC

        PIN_SOIL = 3                                  # ADC1 channel of the soil probe
        SSID = "your-ssid"
        PASSWORD = "your-password"
        REQ_AWAKE_MS = 1500                           # requirement: awake no longer than this
        SLEEP_MS = 600_000                            # requirement: a reading every 10 minutes

        t_start = time.ticks_ms()
        rtc = RTC()                                   # 8 bytes of RTC memory survive deep sleep
        mem = rtc.memory()
        cycle, worst = struct.unpack("<II", mem) if len(mem) == 8 else (0, 0)

        soil = ADC(Pin(PIN_SOIL), atten=ADC.ATTN_11DB).read_uv() // 1000

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect(SSID, PASSWORD)
        t0 = time.ticks_ms()
        while not wlan.isconnected() and time.ticks_diff(time.ticks_ms(), t0) < 10000:
            time.sleep_ms(10)
        wifi_ms = time.ticks_diff(time.ticks_ms(), t0)
        # publish the reading here

        awake = time.ticks_diff(time.ticks_ms(), t_start)
        cycle += 1
        worst = max(worst, awake)
        rtc.memory(struct.pack("<II", cycle, worst))
        print("cycle", cycle, "soil", soil, "mV, Wi-Fi", wifi_ms, "ms, awake", awake, "ms, worst", worst, "ms:",
              "PASS" if awake <= REQ_AWAKE_MS else "FAIL")
        machine.deepsleep(SLEEP_MS)
      `,
      output: `
        cycle 1: soil 1610 mV, Wi-Fi 1480 ms, awake 1590 ms, worst 1590 ms: FAIL
        cycle 2: soil 1612 mV, Wi-Fi 910 ms, awake 1010 ms, worst 1590 ms: PASS
      `,
      notes: ['The numbers in the output are an illustration, not a measurement. The first cycle after power-on is the slow one; later cycles can reuse what the chip kept.', 'MicroPython starts counting when main.py starts, so it does not see the time spent starting the interpreter and reports less than C++. Use a current meter for the final word ([[measuring-current]]).', 'Keep the credentials out of code you share ([[credentials-handling]]).']
    }
  ],
  examples: [
    {
      title: 'Is "a year on one cell" possible?',
      q: 'The greenhouse monitor must report every 10 minutes for 12 months on one 18650 cell of 3000 mAh. The board sleeps at 25 µA. A reading keeps it awake for 1.5 s at an average of 80 mA (an assumption for the exercise). Does it meet the requirement?',
      steps: ['Usable energy is 80 % of 3000 mAh = 2400 mAh. The cell also loses about 2 % of its charge a month by itself, an equivalent drain of 0.083 mA.', 'A year is 8760 hours, so the whole device may draw 2400 / 8760 = 0.274 mA on average. Take the self-discharge off: 0.19 mA is left for the electronics.', 'One cycle of 600 s: 1.5 s at 80 mA plus 598.5 s at 0.025 mA is 120 + 15 = 135 mA·s, an average of 0.225 mA.', '0.225 mA is more than 0.19 mA: the cell lasts about 324 days, not 365.'],
      a: 'No. Shortening the awake time to 1.2 s or less meets it (1.0 s gives about 414 days); so does a 20-minute interval or a bigger cell. The requirement has just told you what the Wi-Fi code must achieve ([[fast-wifi-reconnect]]).'
    }
  ],
  quiz: [
    { q: 'Which of these is a requirement in the sense of this page?', choices: ['The monitor should last a long time on a battery', 'The monitor runs 12 months on one 18650 cell with a reading every 10 minutes', 'The monitor uses an ESP32-C3', 'The monitor is reliable'], a: 1, why: 'Only the second can be settled by a measurement: it has a duration, a cell and a rate. The ESP32-C3 is a design choice, not a requirement; "a long time" and "reliable" cannot be measured.' },
    { q: 'A requirement says the unit runs a year on one cell and also opens a 12 V valve. What does the page suggest?', choices: ['Use a bigger cell', 'Split it into a battery monitor and a plugged-in waterer', 'Drop the valve', 'Choose the ESP32-S3'], a: 1, why: 'A valve and a microamp-class sensor want different power. Two units that talk over Wi-Fi satisfy both lines; a bigger cell would still run flat in weeks if the valve were driven from it.' },
    { q: 'Why write down "a stuck valve never runs more than 5 minutes" before choosing parts?', choices: ['To please a customer', 'It forces a decision, such as a hardware timer or a valve that closes without power', 'It makes the chip cheaper', 'It is only needed for mains devices'], a: 1, why: 'A failure mode that is listed becomes a design decision. One that is not listed is found when the water is already on the floor.' },
    { q: 'The project advisor ranks the ESP32-C3 first for the monitor, so the choice is final.', a: false, why: 'The advisor works from the needs it recognised in the sentence. It is a good first answer; the parts, the pins and the power budget still have to confirm it.' }
  ],
  applications: [
    'The written list is what a client signs, a test engineer tests against and a future maintainer reads to learn what the device was meant to do.',
    'A battery product starts from its life requirement: the energy budget, not the processor, fixes most of the design.',
    'Home-automation devices (a door sensor, a thermostat, a lamp) all begin with the same six questions and end on different chips.',
    'A prototype is judged against the list: it passes or fails, and the failures say what to build next.'
  ],
  sources: [
    'ISO/IEC/IEEE 29148, Systems and software engineering: requirements engineering (the general practice of writing testable requirements).',
    'Espressif, ESP32-C3 Series Datasheet: supply range, current consumption in the active and deep-sleep modes.',
    'Arduino core for ESP32 documentation, deep-sleep and timer wake-up examples (core 3.3); MicroPython documentation, machine.deepsleep (version 1.29).'
  ],
  sim: 'de-requirements'
},

/* ================================================================ the block diagram */
{
  id: 'block-diagrams',
  parent: 'designing-a-solution',
  title: 'The block diagram',
  level: 1,
  short: 'The whole design on one page: a box for each job, a labelled line for everything that passes between them, and no part numbers yet. It is the cheapest drawing you will make and it catches most mistakes.',
  keywords: ['block diagram', 'system diagram', 'power tree', 'interfaces', 'architecture', 'blocks', 'sensing', 'actuation', 'user interface', 'signal flow', 'system design', 'riskiest part'],
  prereq: ['from-idea-to-requirements', 'chip-module-board'],
  related: ['planning-pins', 'what-a-state-machine-is', 'prototyping-stages', 'the-3v3-rail', 'choosing-the-parts', 'several-machines-together'],
  body: `A block diagram is the design on one page: boxes for the jobs, lines for what passes between them, and no part numbers yet. A missing box or an unlabelled line is a question you have not answered, which is why it catches more mistakes than any other drawing and costs only a sheet of paper.

Nearly every electronic product is made of the same six blocks:

| Block | Its job | In the greenhouse monitor |
|---|---|---|
| Power | turn a source into the voltages the rest needs | one 18650 cell, a 3.3 V regulator, a divider to read the cell |
| Processing | run the program and keep time | an ESP32-C3 |
| Sensing | turn the world into numbers | a temperature and humidity sensor on I2C, a soil probe on an analogue input |
| Actuation | turn numbers into the world | none on the monitor; a valve and its driver on the waterer |
| Communication | get data to people and other devices | Wi-Fi to the router, MQTT to the dashboard |
| User interface | how people see and command it | one LED and one button; the phone is the rest |

### Label the lines

Every line carries one named thing with its unit: "3.3 V, 350 mA peak", "I2C at 400 kHz", "0 to 2.5 V analogue", "Wi-Fi at 2.4 GHz". A line you cannot label is a decision still to be made. The power lines matter most. Write the voltage and the current each block draws and the **power tree**, the chain from the source to every load, appears; its largest current is what the regulator and the battery must be able to supply ([[the-3v3-rail]], [[current-peaks-and-capacitors]]).

### What you read from the diagram

- **The number of lines to the processor** is the pin count. The monitor needs seven: two for I2C, two analogue, a switch for the soil probe, an LED and a button. Any ESP32 has that many; [the pin planner](#/tools/pinout/plan) turns the list into pins ([[planning-pins]]).
- **The power tree** gives the regulators, the battery and the first power budget.
- **Which blocks are active when** is the first sketch of a state machine: sleep, measure, send ([[what-a-state-machine-is]], [the state-machine lab](#/tools/fsmlab)).
- **Where a line crosses a boundary** (analogue to digital, 12 V to 3.3 V, a radio) is where layout and protection need care.
- **The riskiest box** is the one to prototype first ([[prototyping-stages]]).

### Draw it twice

Draw the system as well as each device in it: here the monitor, the waterer, the router, the broker and the phone, joined by Wi-Fi and MQTT. The program then has the same shape as the drawing, with one function per block, so that a block can be replaced by a stub that returns a made-up number, and the whole chain runs before any hardware exists.

> [!key] Draw boxes for power, processing, sensing, actuation, communication and the user, and give every line a name and a unit. The diagram tells you the pins, the supplies, the states and the riskiest part, long before a part is chosen.`,
  ideas: [
    'Six blocks cover almost every product: power, processing, sensing, actuation, communication and the user interface.',
    'Every line carries one named thing with a unit; a line that cannot be labelled is an undecided design question.',
    'The power lines give the power tree, the regulators and the first power budget; the lines to the processor give the pin count.',
    'Draw the system as well as the device, and shape the program like the drawing: one function per block, replaceable by a stub.'
  ],
  pitfalls: [
    'Block diagrams are for presentations — Their value is private: drawing one finds the missing regulator, the second battery, the pin you do not have. If it is only for show, it was drawn after the design.',
    'Part numbers belong on the diagram — Not yet. A diagram with part numbers has already decided the answers it should be asking; leave them off until the blocks are right.',
    'The power block is just a battery symbol — It is the block with the most numbers: voltages, peak and sleep currents, the regulator, what happens as the cell empties. It deserves as much care as the processor.'
  ],
  terms: [
    { term: 'Block diagram', also: ['system diagram'], def: 'A drawing of a design as boxes (functions) and lines (what passes between them), without circuit detail. It is drawn before parts are chosen.' },
    { term: 'Power tree', also: ['power architecture', 'power diagram'], def: 'The chain from the energy source through every regulator and switch to each load, with the voltage and current on each branch.' },
    { term: 'Interface', def: 'The place where two blocks meet and what crosses it: a bus, an analogue signal, a power rail, a radio link. Each interface needs a voltage level, a protocol and often a pin.' },
    { term: 'Stub', also: ['mock', 'placeholder'], def: 'A stand-in for a block that is not built yet, such as a function that returns a fixed or random temperature, so that the rest of the program can be written and tested.' },
    { term: 'Technical risk', also: ['riskiest part'], def: 'The part of the design most likely to fail or to need rework: a new sensor, an antenna in a metal box, a battery life that is only just enough. It is built and tested first.' }
  ],
  choose: {
    good: ['Any product with more than one part to wire or power', 'Before choosing a chip: the lines show what the chip must connect to', 'When explaining the design to someone else or reviewing it with them'],
    avoid: ['A diagram of only the happy path: add the battery empty, the router away, the cable pulled', 'One huge sheet for a large system: draw a top level and one diagram per device', 'Boxes named after parts ("ESP32") instead of jobs ("processing")'],
    check: ['Does every line have a name and a unit?', 'Does every box have a supply, and is each voltage produced somewhere?', 'Which box would you prototype first, and why?']
  },
  code: [
    {
      title: 'The block diagram as the shape of the program',
      about: 'One function per block of the greenhouse monitor. The sensing blocks are stubs that return made-up numbers, so the whole chain (sense, decide, report, sleep) runs on any board before a sensor is wired. Replace one stub at a time with the real thing.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        define readAir
          set [airC v] to (random (180) to (260))      // a stub: 18.0 to 26.0 degrees, in tenths :: my

        define readSoil
          set [soilPct v] to (random (20) to (70))     // a stub: soil moisture in percent :: my

        define report
          print (join [air ] (join (airC) (join [ tenths of a degree, soil ] (join (soilPct) [ %]))))

        when started
          start serial at (115200) baud
          readAir :: my
          readSoil :: my
          report :: my
          deep sleep for (600) seconds
      `,
      cpp: String.raw`
        int airTenthsC;                                 // measured by readAir()
        int soilPercent;                                // measured by readSoil()

        void readAir()  { airTenthsC = random(180, 261); }   // a stub: 18.0 to 26.0 degrees
        void readSoil() { soilPercent = random(20, 71); }    // a stub: soil moisture in percent

        void report() {
          Serial.printf("air %d tenths of a degree, soil %d %%\n", airTenthsC, soilPercent);
        }

        void setup() {
          Serial.begin(115200);
          delay(500);
          readAir();
          readSoil();
          report();
          Serial.flush();
          esp_sleep_enable_timer_wakeup(600ULL * 1000000ULL);
          esp_deep_sleep_start();
        }

        void loop() {}
      `,
      py: String.raw`
        import machine, random

        air_tenths_c = 0                                # measured by read_air()
        soil_percent = 0                                # measured by read_soil()

        def read_air():                                 # a stub: 18.0 to 26.0 degrees
            global air_tenths_c
            air_tenths_c = random.randint(180, 260)

        def read_soil():                                # a stub: soil moisture in percent
            global soil_percent
            soil_percent = random.randint(20, 70)

        def report():
            print("air", air_tenths_c, "tenths of a degree, soil", soil_percent, "%")

        read_air()
        read_soil()
        report()
        machine.deepsleep(600_000)
      `,
      output: `
        air 214 tenths of a degree, soil 47 %
      `,
      notes: ['Random numbers make a fine stub; so does a table of recorded readings. The point is that every block has a name and a place before it has hardware.', 'In the Arduino version random() draws on the chip\'s hardware random number generator, so every run gives different numbers; in a test you may prefer a fixed value so that one run can be compared with the last.']
    }
  ],
  examples: [
    {
      title: 'Counting the pins from the diagram',
      q: 'The greenhouse monitor has: a temperature and humidity sensor on I2C, a soil probe with an analogue output, a battery divider, a transistor that switches the soil probe on, a status LED and a button. How many processor pins does it need, and of which kinds?',
      steps: ['I2C takes two pins (SDA and SCL).', 'Two analogue inputs: the soil probe and the battery divider.', 'One digital output switches the probe supply and one drives the LED.', 'The button is one digital input.'],
      a: 'Seven pins: two I2C, two analogue inputs, two outputs and one input. No chip in the family is too small, so the pins do not choose the chip; the battery life and the radio do.'
    }
  ],
  quiz: [
    { q: 'What should be written on every line of a block diagram?', choices: ['The part number of the chip at each end', 'The one named thing it carries, with its unit', 'The cable colour', 'The price'], a: 1, why: 'A label such as "3.3 V, 350 mA peak" or "I2C at 400 kHz" turns a line into a specification. A line that cannot be labelled is a decision not yet made.' },
    { q: 'Which part of a block diagram gives the first power budget?', choices: ['The user-interface box', 'The power lines with the current each block draws', 'The communication box alone', 'The title'], a: 1, why: 'Summing the currents on the power tree, with how long each block is active, is the power budget. The largest peak sizes the regulator and the capacitors.' },
    { q: 'Why is it useful to give each block of the diagram a function in the program?', choices: ['It makes the program shorter', 'A block can be replaced by a stub, so the whole chain runs before the hardware exists', 'The compiler requires it', 'It saves flash'], a: 1, why: 'With one function per block, a function that returns a made-up number lets you write and test the rest, then swap in the real sensor.' },
    { q: 'The greenhouse monitor needs seven pins, so it needs a chip with at least 40 GPIOs.', a: false, why: 'Seven signals fit any ESP32 chip, including the ESP32-C2 with its 14. What decides the chip here is the radio, the battery life and the analogue inputs.' }
  ],
  applications: [
    'A design review starts with the block diagram: the reviewers ask what each line carries and what happens when a box fails.',
    'A bring-up engineer powers one block at a time in the order of the power tree, so that a short circuit points at one box.',
    'A project estimate counts the boxes: each is a piece of hardware, firmware and test that has a cost.',
    'The same diagram, with part numbers added later, becomes the front page of the schematic ([[schematic-design]]).'
  ],
  sources: [
    'ISO/IEC/IEEE 15288 and 29148, system and requirements engineering: functional decomposition and interfaces.',
    'Espressif, ESP32-C3 Series Datasheet, functional overview: the peripherals a block diagram will connect to.',
    'Espressif, ESP32-C3 Hardware Design Guidelines: what a minimal system around the chip contains.'
  ],
  sim: 'de-block-diagram'
},

/* ================================================================ choosing the parts */
{
  id: 'choosing-the-parts',
  parent: 'designing-a-solution',
  title: 'Choosing the parts',
  level: 2,
  short: 'Choose in order — chip, power, sensors, the rest — and judge each part on more than whether it works: its sleep current, its supply voltage, whether it can be bought next year, and whether you can solder it.',
  keywords: ['choosing parts', 'component selection', 'quiescent current', 'second source', 'availability', 'lifecycle', 'NRND', 'regulator', 'sensor selection', 'sleep current', 'part selection', 'datasheet', 'breakout'],
  prereq: ['block-diagrams', 'choosing-a-chip', 'how-to-read-a-datasheet'],
  related: ['product-lifecycle-and-longevity', 'regulators-ldo-and-buck', 'choosing-a-sensor', 'battery-life-budget', 'clones-and-counterfeits', 'bill-of-materials-and-cost', 'lithium-cells'],
  body: `The block diagram says what each box must do. Choosing parts is picking one real component for each, and the order matters because each choice limits the next. Choose the **chip** first (the project advisor's answer, checked against the requirements), then the **power** (the cell and the regulator, which depend on the chip's supply range and its peaks), then the **sensors and actuators** (which depend on the logic voltage and the pins), and last the passive parts.

### What to check on every part

| Question | Why it matters |
|---|---|
| Does it meet the requirement with margin? | an accuracy that only just meets the line fails with ageing and temperature |
| Does it speak 3.3 V? | an ESP32 pin is not 5 V tolerant ([[three-volt-logic]]) |
| What does it draw asleep? | on a battery this decides the life ([[battery-life-budget]]) |
| Can you buy it, and again next year? | stock, lifecycle status, a second source ([[product-lifecycle-and-longevity]]) |
| Can your process solder it? | a leadless 0.4 mm package is not a hand-soldering part |
| Does a driver library exist? | days of work, or none |

### The sleep-current trap

The ESP32-C3 sleeps at about 5 µA, the figure on its datasheet and in the catalogue. A product that sleeps at 5 µA is rare. The chip is rarely the largest consumer; the other parts are:

- a **classic linear regulator** of the 1117 family draws milliamps of its own, a thousand times the chip. A regulator made for batteries draws microamps;
- a **soil probe** left powered draws a few milliamps: switch its supply with a transistor and power it only while measuring;
- a **battery divider** of two 1 MΩ resistors draws 1.8 µA from a cell at 3.6 V, which is a third of the chip's own sleep current;
- an **LED** that is always lit, a pull-up resistor held low, a USB-serial chip: each is a leak.

Add up the sleep currents of everything on the rail before you fall in love with a part. The simulation below does the sum for the monitor.

### The first choices for the greenhouse monitor

The advisor's first answer is the ESP32-C3, which has Wi-Fi 4, six analogue channels, and sleeps at about 5 µA. For the product, the ESP32-C3-MINI-1 module (13.2 by 16.6 mm, printed antenna) is a good fit, and for the prototype a XIAO ESP32C3 board carries it with a battery charger on board. The sensor is an SHT3x-class humidity and temperature sensor on I2C at address 0x44; the soil probe is the capacitive kind, because the bare-metal resistive kind corrodes in wet soil.

> [!key] Choose chip, power, sensors, the rest, in that order, and judge every part by its sleep current, its voltage, its availability and its package, not only by whether it works. On a battery the small leaks add up to more than the chip.`,
  ideas: [
    'Choose in order: the chip, the power, the sensors and actuators, then the passive parts; each choice limits the next.',
    'Judge a part by margin, logic voltage, sleep current, availability, package and software support.',
    'On a battery the leaks of the other parts (regulator, probe, divider, LED) are larger than the chip\'s own 5 µA.',
    'A part that is bought this year but cannot be bought next year, or has no second source, is a risk to the product, not only to the prototype.'
  ],
  pitfalls: [
    'The chip\'s 5 µA is the sleep current of my product — It is the chip alone. A board with a classic regulator and a USB-serial chip may sleep at several milliamps: a thousand times more, and a battery that lasts days.',
    'If the breakout board works, the bare part will — A breakout adds a regulator, level shifters and pull-ups. The part alone may need 1.8 V, different pull-ups, and a package you cannot solder by hand.',
    'The cheapest listing is the same part — Marketplace listings of sensors and chips are often relabelled or counterfeit. Buy products you will ship from a distributor that sources from the maker ([[clones-and-counterfeits]]).'
  ],
  terms: [
    { term: 'Quiescent current', also: ['Iq', 'ground current'], def: 'The current a regulator draws for itself while delivering nothing, in addition to the load\'s. A battery-grade regulator has a few microamps; a classic 1117-type has milliamps.' },
    { term: 'Second source', also: ['alternate part', 'drop-in replacement'], def: 'A different part, from another maker, that can replace the first without changing the board. Having one is the defence against a shortage or an end-of-life notice.' },
    { term: 'Dropout voltage', also: ['dropout'], def: 'How far above its output a linear regulator needs its input to be. As a cell discharges towards 3.3 V, a regulator with a low dropout keeps the rail up longer.' },
    { term: 'Breakout board', also: ['module', 'sensor board'], def: 'A small board that carries one part (a sensor, a driver) with the extra components it needs and pins on a 2.54 mm header. Ideal for prototypes; usually replaced by the bare part in a product.' },
    { term: 'Last-time buy', also: ['LTB', 'end of life', 'EOL'], def: 'The final chance to order a part that its maker is discontinuing. A design that depends on one has a deadline.' }
  ],
  choose: {
    good: ['A chip, regulator and sensors with microamp sleep currents on a battery product', 'Parts with a published lifecycle statement and at least two distributors', 'A sensor on a standard bus with a library for your language'],
    avoid: ['A classic 1117-type regulator on a battery product', 'Parts that exist only as a breakout board from one seller', 'A part chosen because a tutorial used it, without reading its datasheet'],
    check: ['The sleep current of every part on the rail, added up', 'The supply and logic voltage of each part against 3.3 V', 'The lifecycle status and the second source of each part']
  },
  code: [
    {
      title: 'A power-on self-test: does every part answer?',
      about: 'The first thing to run when the parts of the monitor are wired together: ask the temperature sensor for its address, read the soil probe (powered only for the reading) and the battery through its divider, and print a pass or fail for each. The same test later runs on every unit in production.',
      needs: 'A XIAO ESP32C3 with an SHT3x-class sensor on I2C, a soil probe, and a battery measured through a divider of two equal resistors.',
      wiring: [['GPIO6 (D4)', 'sensor SDA', 'with 4.7 kΩ pull-up to 3V3'], ['GPIO7 (D5)', 'sensor SCL', 'with 4.7 kΩ pull-up to 3V3'], ['GPIO3 (D1)', 'soil probe output', 'ADC1'], ['GPIO10 (D10)', 'soil probe supply', 'through a transistor or the probe\'s enable'], ['GPIO4 (D2)', 'battery divider middle', 'two equal resistors, 100 nF across the lower one']],
      blocks: `
        when started
          start serial at (115200) baud
          start I2C on SDA (6) SCL (7)
          set [shtOk v] to <I2C device at address (0x44) answers :: bus>
          set pin (10) as [output v]
          set pin (10) to [HIGH v]
          wait (0.05) seconds
          set [soil v] to (analog read pin (3) in millivolts)
          set pin (10) to [LOW v]
          set [vbat v] to ((analog read pin (4) in millivolts) * (2))
          print (join [SHT3x answers: ] (shtOk))
          print (join [soil probe mV: ] (soil))
          print (join [battery mV: ] (vbat))
          set [ok v] to <shtOk>
          if <<(soil) < (100)> or <(soil) > (2400)>> then
            set [ok v] to <false>
          end
          if <<(vbat) < (3000)> or <(vbat) > (4300)>> then
            set [ok v] to <false>
          end
          if <ok> then
            print [SELF-TEST PASS]
          else
            print [SELF-TEST FAIL]
          end
      `,
      cpp: String.raw`
        #include <Wire.h>

        const int PIN_SDA = 6, PIN_SCL = 7;       // XIAO ESP32C3 D4 and D5
        const int PIN_SOIL = 3;                   // soil probe output, ADC1
        const int PIN_PROBE_POWER = 10;           // switches the probe's supply
        const int PIN_VBAT = 4;                   // battery through a 1:1 divider
        const uint8_t SHT_ADDR = 0x44;

        void setup() {
          Serial.begin(115200);
          delay(1000);
          Wire.begin(PIN_SDA, PIN_SCL, 100000);
          Wire.beginTransmission(SHT_ADDR);
          bool shtOk = (Wire.endTransmission() == 0);

          pinMode(PIN_PROBE_POWER, OUTPUT);
          digitalWrite(PIN_PROBE_POWER, HIGH);
          delay(50);                              // let the probe settle
          uint32_t soil = analogReadMilliVolts(PIN_SOIL);
          digitalWrite(PIN_PROBE_POWER, LOW);     // off again: it draws milliamps
          uint32_t vbat = 2 * analogReadMilliVolts(PIN_VBAT);

          Serial.printf("SHT3x answers: %s\n", shtOk ? "yes" : "NO");
          Serial.printf("soil probe mV: %lu\n", (unsigned long)soil);
          Serial.printf("battery mV:    %lu\n", (unsigned long)vbat);
          bool pass = shtOk && soil > 100 && soil < 2400 && vbat > 3000 && vbat < 4300;
          Serial.println(pass ? "SELF-TEST PASS" : "SELF-TEST FAIL");
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import ADC, I2C, Pin
        import time

        PIN_SDA, PIN_SCL = 6, 7                   # XIAO ESP32C3 D4 and D5
        PIN_SOIL = 3                              # soil probe output, ADC1
        PIN_PROBE_POWER = 10                      # switches the probe's supply
        PIN_VBAT = 4                              # battery through a 1:1 divider
        SHT_ADDR = 0x44

        i2c = I2C(0, scl=Pin(PIN_SCL), sda=Pin(PIN_SDA), freq=100000)
        sht_ok = SHT_ADDR in i2c.scan()

        probe = Pin(PIN_PROBE_POWER, Pin.OUT, value=1)
        time.sleep_ms(50)                         # let the probe settle
        soil = ADC(Pin(PIN_SOIL), atten=ADC.ATTN_11DB).read_uv() // 1000
        probe.value(0)                            # off again: it draws milliamps
        vbat = 2 * (ADC(Pin(PIN_VBAT), atten=ADC.ATTN_11DB).read_uv() // 1000)

        print("SHT3x answers:", "yes" if sht_ok else "NO")
        print("soil probe mV:", soil)
        print("battery mV:   ", vbat)
        ok = sht_ok and 100 < soil < 2400 and 3000 < vbat < 4300
        print("SELF-TEST PASS" if ok else "SELF-TEST FAIL")
      `,
      output: `
        SHT3x answers: yes
        soil probe mV: 1587
        battery mV:    3912
        SELF-TEST PASS
      `,
      notes: ['The ranges are plausibility windows: a floating input reads near 0 or erratically, an unpowered sensor does not answer. They catch wiring faults, not drift.', 'With a divider of 1 MΩ resistors the ADC needs the 100 nF capacitor across the lower one to hold the sample ([[voltage-dividers-for-inputs]]).', 'Hold the battery divider\'s top resistor to the cell side only if the divider is switched or very high in value; otherwise it is a permanent drain ([[measuring-battery-level]]).']
    }
  ],
  examples: [
    {
      title: 'The regulator that ate the battery',
      q: 'A battery monitor sleeps with the ESP32-C3 at 5 µA. A classic linear regulator on the board draws 5 mA of its own. With 2400 mAh usable and ignoring everything else, how long does it last, and what if a battery-grade regulator with 3 µA replaced it?',
      steps: ['With the classic regulator the sleeping board draws about 5 mA: 2400 mAh / 5 mA = 480 hours, about 20 days.', 'With the 3 µA regulator the sleeping board draws about 8 µA (chip plus regulator): 2400 mAh / 0.008 mA = 300 000 hours, in theory far longer than the cell\'s own life.', 'The ratio is about 600: one part chosen without reading a number turned a year into three weeks.'],
      a: 'About 20 days against a sleep current that no longer limits the life. The cell\'s self-discharge and the awake bursts then decide. Read the quiescent current of the regulator before anything else.'
    }
  ],
  quiz: [
    { q: 'In which order should the main parts be chosen?', choices: ['Sensors, then the chip, then the battery', 'Chip, power, sensors and actuators, then the rest', 'The enclosure first', 'Whatever is cheapest first'], a: 1, why: 'The chip fixes the supply range, the logic voltage and the pins; those fix the power and the interfaces of everything else.' },
    { q: 'A monitor on one cell is meant to last a year but sleeps at 4 mA. Which is the most likely cause?', choices: ['The Wi-Fi router', 'A regulator or a probe that is always powered', 'The ESP32-C3\'s deep sleep', 'The cell\'s colour'], a: 1, why: 'The chip sleeps at microamps. Milliamps come from a classic regulator, a powered probe, an LED or a pull-up held low.' },
    { q: 'What does a second source protect against?', choices: ['Radio interference', 'A shortage or discontinuation of the first part', 'Brownouts', 'Static electricity'], a: 1, why: 'A part that can be replaced by another, from a different maker, keeps production running when the first becomes unobtainable.' },
    { q: 'A sensor breakout board works on the bench, so the sensor chip alone can be wired the same way.', a: false, why: 'The breakout carries a regulator, pull-ups and often level shifting. The bare chip may need a different supply, different pull-ups and a package that cannot be soldered by hand.' }
  ],
  applications: [
    'A product team keeps a list of every part with its sleep current: the sum is the battery life promised to customers.',
    'A buyer asks for the lifecycle status of every part before a design is frozen.',
    'A hobbyist swapping a classic regulator for a battery-grade one turns a weekend gadget into a year-long logger.',
    'A maker choosing between a module and a bare chip starts with the same table of questions ([[designing-with-the-bare-chip]]).'
  ],
  sources: [
    'Espressif, ESP32-C3 Series Datasheet: supply voltage, deep-sleep current, ADC characteristics.',
    'Sensirion, SHT3x-DIS datasheet: I2C addresses 0x44 and 0x45, idle current.',
    'Arduino core for ESP32 documentation, ADC (analogReadMilliVolts) and Wire; MicroPython documentation, machine.ADC and machine.I2C (version 1.29).'
  ],
  sim: 'de-power-budget'
},

/* ================================================================ breadboard, perfboard, PCB */
{
  id: 'prototyping-stages',
  parent: 'designing-a-solution',
  title: 'Breadboard, perfboard, PCB',
  level: 1,
  short: 'A prototype is a question asked cheaply. Build the smallest thing that can answer the riskiest question, in the cheapest medium that gives a true answer, and move to the next stage only when the last one has told you what it can.',
  keywords: ['prototype', 'breadboard', 'perfboard', 'stripboard', 'first PCB', 'spin', 'pilot batch', 'proof of concept', 'bring-up', 'test points', 'carrier board', 'riskiest part', 'cost of change', 'dev board'],
  prereq: ['block-diagrams', 'breadboards-wires-and-connectors', 'choosing-the-parts'],
  related: ['minimal-esp32-circuit', 'production-testing', 'soak-and-stress-tests', 'measuring-current', 'simulators', 'enclosures'],
  body: `A prototype is a question asked cheaply. You build the smallest thing that can answer it, in the cheapest medium that gives a true answer, and you ask the riskiest question first. A design passes through the stages below, and each stage is good at some questions and blind to others.

| Stage | What it is | What it settles | What it cannot show |
|---|---|---|---|
| Paper and simulation | block diagram, budget sheet, a simulator ([[simulators]]) | the logic, the energy budget | anything analogue, thermal or radio |
| Breadboard | a development board and breakouts on a solderless breadboard | the program; that each part talks | contact quality, noise, radio range |
| Perfboard, or modules on a carrier | the parts soldered; the module in its final form | readings over weeks, a real battery run, range on site | repeatable assembly, layout effects |
| First board (spin 1) | your own circuit board, a few units | layout, antenna, fit in the box, sleep current | yield, the production process |
| Pilot batch | tens of boards from the production line, with its test | yield, the test jig, the supply chain, approval samples | years in the field |

### The riskiest question first

List what could stop the project and test that first. For the greenhouse monitor: does the soil probe give a stable reading for months in wet soil? Does Wi-Fi reach from the greenhouse? Does a year of battery hold? No custom board is needed: a development board with a probe in a pot, a router across the glass and a meter in the battery line answer all three. Layout and enclosure come later; they depend on answers not yet in.

### Why each stage costs more

A rule of thumb says that changing your mind costs roughly ten times more at each stage: a wire moved on the breadboard takes seconds, on perfboard an hour, on a circuit board a new spin of weeks and money, in a pilot batch a rework of every unit. It is a rule of thumb, not a law; the direction is what is sure.

### What the breadboard hides

Contacts add resistance, long jumpers pick up noise and make a 400 kHz I2C bus marginal, and a thin supply rail sags when the radio transmits ([[i2c-pull-ups-and-bus-problems]]). It says nothing about an antenna in a box. A circuit that passes on a breadboard proves less than it seems.

### Build the test in

Put a test point on every rail and key signal, a jumper in the battery line so a meter can measure the sleep current ([[measuring-current]]), and a serial log from the first day. Keep the last prototype as a reference: when the new board disagrees with it, you know where to look.

> [!warn] Never build a mains circuit on a breadboard or perfboard. Mains wiring is work for a qualified person, behind isolation and in an enclosure.

> [!key] Ask the riskiest question first, in the cheapest medium that can answer it truthfully, and say what each stage can and cannot prove. Mistakes cost about ten times more at each stage, so the earlier a problem is found the better.`,
  ideas: [
    'A prototype is a question asked cheaply: build the smallest thing that answers it.',
    'Test the riskiest part first, with a development board and a few wires, before any layout or enclosure.',
    'Each stage is blind to something: a breadboard to noise and range, a perfboard to layout effects, a first board to yield.',
    'Changing your mind costs roughly ten times more at each stage, and test points, a log and a reference unit make the next stage cheaper.'
  ],
  pitfalls: [
    'A working breadboard means the design works — It means the program and the parts can talk. Contact resistance, noise, supply sag, radio range and heat are untested, and each is a common reason a first board fails.',
    'Go straight to a custom board to save time — The first board then carries every unanswered question at once, and a fault could be in any of them. Stages cost days and save weeks.',
    'The prototype can be thrown away when the board arrives — Keep it: it is the reference whose readings the board must match, and the place to try a firmware change safely.'
  ],
  terms: [
    { term: 'Breadboard', also: ['solderless breadboard', 'protoboard'], def: 'A plastic board of connected sockets in which parts and wires are pushed without soldering. Quick to change, but its contacts and long wires disturb fast, sensitive or radio circuits.' },
    { term: 'Perfboard', also: ['stripboard', 'veroboard', 'prototyping board'], def: 'A board of drilled holes (with copper pads or strips) on which a circuit is soldered by hand. It is permanent enough to run for weeks outdoors.' },
    { term: 'Spin', also: ['board revision', 'respin', 'turn'], def: 'One round of designing, making and testing a printed circuit board. "Spin 2" is the corrected version after the problems found in the first.' },
    { term: 'Bring-up', also: ['board bring-up', 'first power-on'], def: 'The careful first switch-on of a new board: check the supply with no part fitted, power one block at a time, and prove each part answers before running the real program.' },
    { term: 'Test point', also: ['TP', 'probe point'], def: 'A small pad or loop on a board where a probe or clip can reach a signal or supply, put there on purpose for bring-up and production test.' }
  ],
  choose: {
    good: ['A breadboard and a development board for the first questions about parts and program', 'A soldered carrier or perfboard for a weeks-long trial on site', 'A first board in small numbers once the risky questions are answered'],
    avoid: ['A custom board for an idea whose riskiest part is untested', 'Breadboards for mains, for high currents or for judging radio range', 'Judging noise, accuracy or antenna behaviour on a breadboard'],
    check: ['What question this stage is meant to answer, written down', 'What this stage cannot show, and where you will learn it', 'Whether the previous prototype is kept as a reference']
  },
  code: [
    {
      title: 'Walk the outputs: a first-board test',
      about: 'When a new board arrives, drive every output of the design high for one second in turn and print its net name, so that you can check each one with a meter or an LED before the real program is trusted. The net names are those of the schematic.',
      needs: 'A XIAO ESP32C3 or a first board with the same two outputs, and a meter or oscilloscope.',
      wiring: [['GPIO10 (D10)', 'PROBE_POWER', 'the soil probe supply switch'], ['GPIO5 (D3)', 'STATUS_LED', 'LED with a resistor to GND']],
      blocks: `
        define walk (net) (pin)
          set pin (pin) as [output v]
          print (join [driving ] (join (net) [ high for one second]))
          set pin (pin) to [HIGH v]
          wait (1) seconds
          set pin (pin) to [LOW v]

        when started
          start serial at (115200) baud
          repeat (3)
            walk [PROBE_POWER] (10) :: my
            walk [STATUS_LED] (5) :: my
          end
      `,
      cpp: String.raw`
        struct Output { const char *net; int pin; };
        const Output OUTPUTS[] = { {"PROBE_POWER", 10}, {"STATUS_LED", 5} };   // net name, GPIO

        void walk(const Output &o) {
          pinMode(o.pin, OUTPUT);
          Serial.printf("driving %s (GPIO%d) high for one second\n", o.net, o.pin);
          digitalWrite(o.pin, HIGH);
          delay(1000);
          digitalWrite(o.pin, LOW);
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);
          for (int round = 0; round < 3; round++)
            for (const Output &o : OUTPUTS) walk(o);
          Serial.println("done: every output was high three times");
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import Pin
        import time

        OUTPUTS = (("PROBE_POWER", 10), ("STATUS_LED", 5))   # net name, GPIO

        def walk(net, pin):
            out = Pin(pin, Pin.OUT, value=0)
            print("driving %s (GPIO%d) high for one second" % (net, pin))
            out.value(1)
            time.sleep(1)
            out.value(0)

        for _ in range(3):
            for net, pin in OUTPUTS:
                walk(net, pin)
        print("done: every output was high three times")
      `,
      output: `
        driving PROBE_POWER (GPIO10) high for one second
        driving STATUS_LED (GPIO5) high for one second
        driving PROBE_POWER (GPIO10) high for one second
        ...
      `,
      notes: ['A net that never moves on the meter is a wiring or solder fault; two nets that move together are a short. Both are found in a minute this way and in a day by running the whole program.', 'Keep this program in the repository: it is the first test of every new spin ([[production-testing]]).']
    }
  ],
  examples: [
    {
      title: 'What does the first stage cost per question?',
      q: 'A colleague proposes a custom board for the greenhouse monitor now. The soil probe\'s long-term stability and the Wi-Fi range from the greenhouse are untested. A new board spin takes three weeks. How would you proceed?',
      steps: ['Both untested items are properties of the probe and the radio link, not of a layout.', 'A development board, a probe in a pot of wet soil and the real router answer them in days, logging to the serial port or the broker.', 'If the probe drifts, a different probe is chosen before any board exists; if the range is short, the antenna plan changes.'],
      a: 'Build the cheap rig first. It answers the two risks in days. A custom board built now would carry both open questions and cost a respin if either answer is bad.'
    }
  ],
  quiz: [
    { q: 'Which question is a breadboard worst at answering?', choices: ['Does the sensor answer on I2C?', 'Does the program read the probe?', 'How far will the radio reach from the final box?', 'Does the pin number work?'], a: 2, why: 'A breadboard has no real antenna environment: it says nothing of range, of the box, or of the final layout. It is good at logic, wiring and the program.' },
    { q: 'What is the aim of testing the riskiest part first?', choices: ['It is the easiest', 'The project can be stopped or changed while changes are cheap', 'It uses the least time', 'It is the order of the schematic'], a: 1, why: 'If the riskiest part fails, the design must change. Finding that at the cheapest stage saves the money and weeks spent on the stages after it.' },
    { q: 'What is a "spin" of a board?', choices: ['A test of rotation', 'One round of design, manufacture and test of a printed circuit board', 'A kind of antenna', 'A firmware update'], a: 1, why: 'Each corrected version of the board is another spin. Good bring-up plans aim for as few as possible.' },
    { q: 'A prototype that passes every test on the breadboard can go straight to production.', a: false, why: 'It has shown that the logic and parts work. Layout effects, assembly yield, radio performance in the box and long-term behaviour have not been tested.' }
  ],
  applications: [
    'A startup builds a proof of concept on a development board before it commits to a board design and a tool.',
    'A student project runs for a month on a perfboard in a garden to see what the weather does to the sensors.',
    'A first-board bring-up plan lists the checks in order: supply, reset, boot, serial, each peripheral.',
    'A product team keeps a golden unit, the first good prototype, to compare against later changes.'
  ],
  sources: [
    'Espressif, ESP32-C3 Hardware Design Guidelines: checks for a new design, from the supply onward.',
    'ESP-IDF Programming Guide, API guides on bootloader and boot-mode selection (what a first board must show at start-up).',
    'IPC-2221, Generic Standard on Printed Board Design: the general practice that board stages follow.'
  ],
  sim: 'de-prototype-stages'
},

/* ================================================================ the minimal circuit around a module */
{
  id: 'minimal-esp32-circuit',
  parent: 'designing-a-solution',
  title: 'The minimal circuit around a module',
  level: 2,
  short: 'A module already holds the chip, flash, crystal and antenna matching. What you add is small: a stiff 3.3 V supply with capacitors, a reset network, the boot pin, a way to program it, and the discipline to leave the strapping pins alone.',
  keywords: ['minimal circuit', 'reference design', 'EN pin', 'reset circuit', 'decoupling', 'bulk capacitor', 'boot button', 'programming header', 'USB-C', 'auto-reset', '3.3 V supply', 'module schematic', 'ESP32-C3-MINI-1'],
  prereq: ['prototyping-stages', 'the-3v3-rail', 'strapping-pins', 'what-a-module-adds'],
  related: ['current-peaks-and-capacitors', 'boot-modes-and-download-mode', 'usb-serial-bridges-and-auto-reset', 'schematic-design', 'brownout', 'electronics:decoupling'],
  body: `A module is a chip with its flash memory, its crystal and its antenna matching already built and tested, so the circuit you add is small. It has five jobs: power it, reset it, choose how it boots, program it, and stay out of its way.

### 1. Power

The supply is 3.3 V (the catalogue gives 3.0 to 3.6 V for the C3), from a regulator that can give about **500 mA**: the radio draws up to 335 mA transmitting on the ESP32-C3 and the supply must not sag. Put a bulk capacitor (10 µF is the usual value) and a 100 nF capacitor right at the module's supply pins, before the vias that carry the current away ([[current-peaks-and-capacitors]], [[brownout]]).

### 2. Reset: the EN pin

A 10 kΩ resistor from EN to 3.3 V and a 1 µF capacitor to ground make EN rise slowly, so the chip starts after the supply has settled. Add a button to ground if you want a manual reset. These two values are the common ones; check the reference design of your module.

### 3. Boot: the strapping pins

The boot pin (GPIO9 on the ESP32-C3 and C6, GPIO0 on the ESP32 and S3) is pulled high inside the chip. A button from it to ground gives download mode: hold it while resetting. Leave the other strapping pins at the level the datasheet gives, or unconnected ([[strapping-pins]]). On the C3, that means GPIO2 high at reset, and GPIO8 high if download mode is to work.

### 4. Programming

| Chip | Boot pin | Native USB pins | Otherwise |
|---|---|---|---|
| ESP32 | GPIO0 | none | UART0 (GPIO1, GPIO3) and a USB-serial bridge or header |
| ESP32-S3 | GPIO0 | GPIO19 (D-), GPIO20 (D+) | UART0 (GPIO43, GPIO44) |
| ESP32-C3 | GPIO9 | GPIO18 (D-), GPIO19 (D+) | UART0 (GPIO21, GPIO20) |
| ESP32-C6 | GPIO9 | GPIO12 (D-), GPIO13 (D+) | UART0 (GPIO16, GPIO17) |

With native USB the connector goes straight to the chip (plus two 5.1 kΩ resistors on the USB-C configuration pins), and the board needs no bridge chip; those two pins are then not free. A five-pin header (3.3 V, TX, RX, EN, BOOT, with ground) for an external adapter is cheaper still and is the usual choice on small boards ([[usb-serial-bridges-and-auto-reset]]).

### 5. Stay out of its way

The antenna end of the module goes at the board edge with nothing near it ([[pcb-layout-for-modules]]), and the module's ground pad is soldered to a solid ground.

> [!key] Around a module: 3.3 V at about 500 mA with 10 µF and 100 nF at its pins, 10 kΩ and 1 µF on EN, a boot button on the boot pin, a way to program it, and nothing near the antenna. Copy your module's reference design and change as little as you can.`,
  ideas: [
    'A module needs five things from you: a stiff 3.3 V supply, a reset network, the boot pin, a programming path and a clear antenna.',
    'Put the 10 µF and 100 nF capacitors at the module\'s supply pins; the supply must give about 500 mA for the radio\'s peaks.',
    'EN gets a 10 kΩ pull-up and 1 µF to ground, so the chip starts after the supply is stable.',
    'A button from the boot pin to ground is download mode; the other strapping pins are left at the levels in the datasheet.'
  ],
  pitfalls: [
    'A module needs no external parts — It brings the chip, flash and crystal, not the supply, the reset delay, the boot button or a programming path. Without them it is a very small, very confused board.',
    'Any 3.3 V regulator with a 100 mA rating will do — The radio draws more than 300 mA in bursts. A regulator that cannot supply it, or has no capacitors at the module, causes brownouts that look like random crashes.',
    'USB programming needs a bridge chip — Not on a C3, C6 or S3: the chip has USB built in on two fixed pins. The original ESP32 does need a bridge, or a header and an external adapter.'
  ],
  terms: [
    { term: 'Reference design', also: ['reference schematic', 'application circuit'], def: 'The maker\'s own schematic of a minimal working circuit around a chip or module. Copying it, and changing little, is the surest way to a first board that works.' },
    { term: 'Enable pin (EN)', also: ['EN', 'CHIP_PU', 'reset pin'], def: 'The pin that holds the chip in reset while low and lets it start when high. A resistor and capacitor on it delay the start until the supply has settled.' },
    { term: 'Bulk capacitor', also: ['reservoir capacitor'], def: 'A larger capacitor (about 10 µF here) that supplies the current of a burst, such as a radio transmission, while the regulator catches up.' },
    { term: 'Decoupling capacitor', also: ['bypass capacitor', '100 nF'], def: 'A small capacitor (100 nF) close to a supply pin that supplies fast, brief current demands and short-circuits high-frequency noise on the rail to ground.' },
    { term: 'USB Serial/JTAG', also: ['native USB', 'built-in USB'], def: 'A fixed USB function inside the C3, C6, S3 and some other chips on two dedicated pins. It acts as a serial port and a debugger without any extra chip.' }
  ],
  choose: {
    good: ['A product that needs Wi-Fi or Bluetooth without designing the radio', 'Boards made in tens or hundreds, where a certified module saves time and approvals', 'A first custom board, copied from the module\'s reference design'],
    avoid: ['Skipping the capacitors or the EN network to save a few parts', 'A weak regulator that cannot supply the radio\'s peaks', 'Reusing a pin that is strapping or part of the native USB without a reason'],
    check: ['The reference design of your exact module, line by line', 'That the regulator gives at least the supply current the module datasheet asks for', 'That the board still starts and still programs with everything fitted']
  },
  code: [
    {
      title: 'Stress the supply: does it survive the radio?',
      about: 'The supply of a new board is tested where it hurts: a loop of Wi-Fi scans, each of which transmits at full power. The program prints why the chip last restarted. If the board restarts on its own with the reason BROWNOUT, the supply or its capacitors are too weak.',
      needs: 'Your first board (or any board on the supply you want to test) and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          print (join [last restart: ] (reason of the last restart :: power))
          set [scans v] to (0)
          forever
            change [scans v] by (1)
            set [found v] to (number of Wi-Fi networks found by a scan :: wifi)
            print (join [scan ] (join (scans) (join [: ] (join (found) [ networks]))))
            wait (0.2) seconds
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>

        const char *resetName(esp_reset_reason_t r) {
          switch (r) {
            case ESP_RST_POWERON:  return "power-on";
            case ESP_RST_SW:       return "software restart";
            case ESP_RST_PANIC:    return "panic";
            case ESP_RST_BROWNOUT: return "BROWNOUT: the supply sagged";
            case ESP_RST_DEEPSLEEP: return "wake from deep sleep";
            default:               return "other";
          }
        }

        uint32_t scans = 0;

        void setup() {
          Serial.begin(115200);
          delay(1000);
          Serial.printf("last restart: %s\n", resetName(esp_reset_reason()));
          WiFi.mode(WIFI_STA);
        }

        void loop() {
          int found = WiFi.scanNetworks();        // transmits probe requests on every channel
          Serial.printf("scan %lu: %d networks\n", (unsigned long)++scans, found);
          WiFi.scanDelete();
          delay(200);
        }
      `,
      py: String.raw`
        import machine, network, time

        NAMES = {machine.PWRON_RESET: "power-on or BROWNOUT (not told apart)", machine.HARD_RESET: "hard reset or panic",
                 machine.WDT_RESET: "watchdog", machine.DEEPSLEEP_RESET: "wake from deep sleep", machine.SOFT_RESET: "software restart"}

        print("last restart:", NAMES.get(machine.reset_cause(), "other"))
        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)

        scans = 0
        while True:
            found = len(wlan.scan())              # transmits probe requests on every channel
            scans += 1
            print("scan %d: %d networks" % (scans, found))
            time.sleep_ms(200)
      `,
      output: `
        last restart: power-on
        scan 1: 11 networks
        scan 2: 12 networks
        ...
      `,
      notes: ['Leave it running for ten minutes with the real supply (the battery, at its lowest charge, and the longest cable). A pass on the bench supply proves little.', 'MicroPython cannot tell a brownout from a power-on: if it restarts on its own while the supply is steady, suspect a brownout and repeat the test in C++.', 'On a cell that is nearly flat the test fails first, which is exactly why it is worth running ([[brownout]]).']
    }
  ],
  examples: [
    {
      title: 'Choosing the EN network',
      q: 'The EN pin has a 10 kΩ pull-up to 3.3 V and a 1 µF capacitor to ground. How long does EN take to rise to about 63 % of 3.3 V, and why does it help?',
      steps: ['The time constant of a resistor and a capacitor is tau = R x C = 10 000 ohms x 1 microfarad = 10 ms.', 'After one time constant EN has risen to about 63 % of the supply; after three, about 95 % (about 30 ms).', 'The supply is stable well before that, so the chip leaves reset only when its supply is steady.'],
      a: 'About 10 ms to 63 % and 30 ms to 95 %. The delay lets the 3.3 V rail settle before the chip tries to start, which avoids a start-up that fails on some units and not on others.'
    }
  ],
  quiz: [
    { q: 'Which pair of values is typical for the supply capacitors at a module\'s power pins?', choices: ['10 pF and 100 pF', '10 µF and 100 nF', '1 mF and 10 µF', '100 µF and 1 pF'], a: 1, why: 'A bulk capacitor of about 10 µF supplies the radio\'s bursts and a 100 nF capacitor supplies the fast edges. Check your module\'s reference design.' },
    { q: 'What does the 10 kΩ and 1 µF network on EN do?', choices: ['Sets the clock', 'Delays the start of the chip until the supply is stable', 'Selects the boot mode', 'Measures the battery'], a: 1, why: 'The RC network makes EN rise slowly after power is applied, so the chip starts only when the 3.3 V rail has settled.' },
    { q: 'An ESP32-C3 board has a USB-C connector and no bridge chip. How is it programmed?', choices: ['It cannot be', 'Through the chip\'s built-in USB Serial/JTAG on GPIO18 and GPIO19', 'Through GPIO0', 'Over Wi-Fi only'], a: 1, why: 'The C3 has a fixed USB serial and debug function on GPIO18 (D-) and GPIO19 (D+). The connector can go straight to those pins.' },
    { q: 'A supply that tests well at 100 mA will also work for the module.', a: false, why: 'The radio draws bursts of more than 300 mA. A supply that cannot give them sags, and the chip restarts with a brownout reset.' }
  ],
  applications: [
    'Every development board is this circuit plus a USB connector and a regulator; your own board is the same circuit without the extras.',
    'A product board with a header for an external USB-serial adapter in production and none in the field.',
    'A small sensor board where the module, a regulator and five passive parts are the whole circuit.',
    'A repair technician checks the same five things (supply, EN, boot, serial, antenna) on a board that will not start.'
  ],
  sources: [
    'Espressif, ESP32-C3-MINI-1 datasheet, the schematic and peripheral requirements sections.',
    'Espressif, ESP32-C3 Hardware Design Guidelines: power supply, EN and strapping pin recommendations.',
    'Espressif, datasheets of the ESP32, ESP32-S3 and ESP32-C6: the strapping pins and the boot-mode tables.'
  ],
  sim: 'de-minimal-circuit'
},

/* ================================================================ drawing the schematic */
{
  id: 'schematic-design',
  parent: 'designing-a-solution',
  title: 'Drawing the schematic',
  level: 2,
  short: 'A schematic has two readers: the layout program and a person, perhaps you in a year. Name the nets for what they carry, keep every decoupling capacitor beside its pin, add test points and options, choose the pins on purpose, and have someone else check it.',
  keywords: ['schematic', 'KiCad', 'net names', 'ERC', 'electrical rules check', 'test points', 'DNP', 'reference designator', 'hierarchical sheet', 'pin assignment', 'schematic review', 'EasyEDA', 'Altium', 'part fields'],
  prereq: ['block-diagrams', 'minimal-esp32-circuit', 'planning-pins'],
  related: ['pcb-layout-for-modules', 'bill-of-materials-and-cost', 'protection-parts', 'strapping-pins', 'documentation', 'readable-code'],
  body: `A schematic is the design as an electrical drawing, and it has two readers: the layout program and a person, who may be you in a year. Most schematic mistakes are not wrong circuits but unreadable ones, so draw for the person.

### Make it readable

- **One sheet per function**: power, processor, sensors, connectors. The regulator can then be found without hunting.
- **Name nets for what they carry**: SOIL_ADC, I2C_SDA, PROBE_PWR. The tool's automatic names (Net-17) hide faults; your names appear on the board, in the test and in the program.
- **Draw each decoupling capacitor beside the pin it serves**, with its value.
- **Fill the fields**: value, footprint, manufacturer and part number. The bill of materials then writes itself ([[bill-of-materials-and-cost]]).

### Make it safe to be wrong

- **Test points** on every rail, on EN, the boot pin, the serial lines and the key signals.
- **Options**: a footprint you may leave empty (DNP, "do not populate") for a pull-up or a filter, and a 0 Ω link in a power path, so a mistake is cured with a soldering iron rather than a new board.
- **Protection at the edges**: reverse-polarity protection on the battery, an ESD diode and a fuse where cables enter ([[protection-parts]]).
- **A way to measure the sleep current**: a jumper in the battery line.

### Decide the pins on purpose

Take the pins from [the pin planner](#/tools/pinout/plan), not from the first one that is free. For the greenhouse monitor on an ESP32-C3 the plan is SDA on GPIO6, SCL on GPIO7, the soil probe on GPIO3 and the battery divider on GPIO4 (both ADC1), the probe switch on GPIO10, the LED on GPIO5 and the button on GPIO2. GPIO2 is a strapping pin that wants a high level at reset, so a 10 kΩ pull-up holds it high and the button pulls it low only after the chip has started ([[strapping-pins]]). Give the program the same net names.

### Check it twice

Run the **electrical rules check** of your tool: it finds unconnected pins, two outputs on one net, a power pin with no supply. It cannot find a wrong idea. For that, have someone read the schematic against the block diagram, line by line, with the datasheets open. KiCad is free and open source, EasyEDA runs in a browser, and Fusion and Altium are commercial; the habits matter more than the tool.

> [!key] Draw the schematic for a reader: sheets by function, nets named for what they carry, capacitors beside their pins, test points and options for mistakes. Choose pins on purpose, run the rules check, then have a second person read it against the block diagram.`,
  ideas: [
    'Draw for a reader: one sheet per function, nets named for what they carry, each decoupling capacitor beside its pin.',
    'Put test points, DNP options and a 0 Ω link in the power path where a mistake would be costly to fix.',
    'Choose pins with the planner and keep the strapping rules; use the same net names in the program.',
    'The rules check finds wiring errors, a second reader finds wrong ideas: do both.'
  ],
  pitfalls: [
    'If the electrical rules check passes, the schematic is right — It checks that nets are connected sensibly, not that the circuit does what you meant. A divider with the wrong ratio passes cleanly.',
    'Automatic net names are fine — They are fine for the tool and useless for a person: Net-17 tells nobody that it is the soil probe, and a bring-up engineer would have to trace it.',
    'Test points and options waste board area — They cost a few square millimetres and save a respin: a pad on EN, a DNP pull-up, a jumper in the battery line each paid for itself in the first week of bring-up.'
  ],
  terms: [
    { term: 'Net', also: ['net name', 'net label'], def: 'All the pins and wires at the same electrical point, with a name. A good name says what the net carries, such as SOIL_ADC.' },
    { term: 'Electrical rules check', also: ['ERC'], def: 'An automatic test of a schematic for connection errors: unconnected pins, two outputs joined, inputs left floating, power pins without a source.' },
    { term: 'DNP', also: ['do not populate', 'do not fit', 'DNF'], def: 'A part that is drawn and given a footprint but is left off the board unless needed, such as an optional pull-up or filter.' },
    { term: 'Reference designator', also: ['designator', 'refdes'], def: 'The short label of a part on the drawing and the board: R1, C3, U1, J2. The letters say the kind of part, the number tells them apart.' },
    { term: 'Hierarchical sheet', also: ['sub-sheet'], def: 'A schematic page that stands for a block of the design (power, sensors) and is connected to the others through named ports, as a block diagram is.' }
  ],
  choose: {
    good: ['One sheet per block of the block diagram for any design with more than a dozen parts', 'KiCad, EasyEDA, Fusion or Altium: any tool in which you can run a rules check and export a bill of materials', 'Net names that match the program\'s pin names'],
    avoid: ['Automatic net names on anything that is kept', 'A single crowded sheet with wires crossing the page', 'Choosing pins by "first free" instead of by their special functions'],
    check: ['That every power pin of every chip has a decoupling capacitor drawn beside it', 'The strapping and USB pins against the datasheet', 'That a second person can follow it with only the block diagram']
  },
  code: [
    {
      title: 'The pin table: one place where the schematic meets the program',
      about: 'The net names of the schematic become constants in one table, with the mode each pin needs. Changing a pin on the board then means changing one line. The program prints the table so that it can be compared with the drawing.',
      needs: 'A XIAO ESP32C3 or an ESP32-C3-MINI-1 board wired as in the schematic of the greenhouse monitor.',
      wiring: [['GPIO6 / GPIO7', 'I2C_SDA / I2C_SCL', 'D4 / D5, with pull-ups'], ['GPIO3 / GPIO4', 'SOIL_ADC / VBAT_ADC', 'ADC1'], ['GPIO10', 'PROBE_PWR', 'switch for the soil probe'], ['GPIO5', 'STATUS_LED', 'with a resistor'], ['GPIO2', 'BUTTON', 'strapping: 10 kΩ pull-up, button to GND']],
      blocks: `
        define initPins
          set pin (3) as [input v]                // SOIL_ADC
          set pin (4) as [input v]                // VBAT_ADC
          set pin (10) as [output v]              // PROBE_PWR
          set pin (5) as [output v]               // STATUS_LED
          set pin (2) as [input v]                // BUTTON: the pull-up is on the board
          print [SOIL_ADC=3 VBAT_ADC=4 PROBE_PWR=10 STATUS_LED=5 BUTTON=2 I2C_SDA=6 I2C_SCL=7]

        when started
          start serial at (115200) baud
          initPins :: my
      `,
      cpp: String.raw`
        // pins.h: the nets of the schematic, one line each
        const int PIN_I2C_SDA    = 6;    // I2C_SDA     D4
        const int PIN_I2C_SCL    = 7;    // I2C_SCL     D5
        const int PIN_SOIL_ADC   = 3;    // SOIL_ADC    D1, ADC1
        const int PIN_VBAT_ADC   = 4;    // VBAT_ADC    D2, ADC1
        const int PIN_PROBE_PWR  = 10;   // PROBE_PWR   D10
        const int PIN_STATUS_LED = 5;    // STATUS_LED  D3
        const int PIN_BUTTON     = 2;    // BUTTON      D0, strapping: the board holds it high

        void initPins() {
          pinMode(PIN_SOIL_ADC, INPUT);
          pinMode(PIN_VBAT_ADC, INPUT);
          pinMode(PIN_PROBE_PWR, OUTPUT);
          digitalWrite(PIN_PROBE_PWR, LOW);        // probe off until it is read
          pinMode(PIN_STATUS_LED, OUTPUT);
          pinMode(PIN_BUTTON, INPUT);              // the 10 kOhm pull-up is on the board
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);
          initPins();
          Serial.printf("SOIL_ADC=%d VBAT_ADC=%d PROBE_PWR=%d STATUS_LED=%d BUTTON=%d I2C_SDA=%d I2C_SCL=%d\n",
                        PIN_SOIL_ADC, PIN_VBAT_ADC, PIN_PROBE_PWR, PIN_STATUS_LED, PIN_BUTTON, PIN_I2C_SDA, PIN_I2C_SCL);
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import Pin

        # pins.py: the nets of the schematic, one line each
        PIN_I2C_SDA = 6        # I2C_SDA     D4
        PIN_I2C_SCL = 7        # I2C_SCL     D5
        PIN_SOIL_ADC = 3       # SOIL_ADC    D1, ADC1
        PIN_VBAT_ADC = 4       # VBAT_ADC    D2, ADC1
        PIN_PROBE_PWR = 10     # PROBE_PWR   D10
        PIN_STATUS_LED = 5     # STATUS_LED  D3
        PIN_BUTTON = 2         # BUTTON      D0, strapping: the board holds it high

        def init_pins():
            Pin(PIN_SOIL_ADC, Pin.IN)
            Pin(PIN_VBAT_ADC, Pin.IN)
            Pin(PIN_PROBE_PWR, Pin.OUT, value=0)   # probe off until it is read
            Pin(PIN_STATUS_LED, Pin.OUT)
            Pin(PIN_BUTTON, Pin.IN)                # the 10 kOhm pull-up is on the board

        init_pins()
        print("SOIL_ADC=%d VBAT_ADC=%d PROBE_PWR=%d STATUS_LED=%d BUTTON=%d I2C_SDA=%d I2C_SCL=%d"
              % (PIN_SOIL_ADC, PIN_VBAT_ADC, PIN_PROBE_PWR, PIN_STATUS_LED, PIN_BUTTON, PIN_I2C_SDA, PIN_I2C_SCL))
      `,
      output: `
        SOIL_ADC=3 VBAT_ADC=4 PROBE_PWR=10 STATUS_LED=5 BUTTON=2 I2C_SDA=6 I2C_SCL=7
      `,
      notes: ['Name the constants after the nets and the line stays true when the board changes: the next spin moves one number.', 'The pull-up on GPIO2 is on the board, not in the program, because it must hold the pin high before any program runs ([[pins-at-boot]]).']
    }
  ],
  examples: [
    {
      title: 'What does the button on a strapping pin cost?',
      q: 'The button on GPIO2 is held high by a 10 kΩ resistor to 3.3 V. How much current flows while the button is held down, and would a 100 kΩ pull-up do?',
      steps: ['Pressed, the button connects the pin to ground, so the resistor carries 3.3 V / 10 kΩ = 0.33 mA.', 'It flows only while the button is held: a few seconds a day, an average far below a microamp.', 'A 100 kΩ resistor would carry 33 µA when pressed, but would hold the pin high more weakly against leakage and noise during start-up.'],
      a: '0.33 mA, only while pressed, so it costs nothing in battery life. Keep 10 kΩ: the pin must be held firmly high at the instant of reset.'
    }
  ],
  quiz: [
    { q: 'Why name a net SOIL_ADC rather than leave the tool\'s automatic name?', choices: ['The tool requires it', 'Everyone who reads the board, the test or the code can see what it carries', 'It reduces the board\'s size', 'It lowers the cost'], a: 1, why: 'A name that says what the net carries appears in the schematic, on the board\'s silkscreen, in the test and in the program, and makes mistakes visible.' },
    { q: 'What does an electrical rules check not find?', choices: ['An unconnected pin', 'Two outputs joined on one net', 'A divider with the wrong ratio', 'A power pin with no supply'], a: 2, why: 'The check looks for connection errors, not for a wrong value. A wrong divider ratio is a valid circuit.' },
    { q: 'What is the point of a DNP footprint for a pull-up?', choices: ['It saves a part always', 'The part can be fitted later without a new board if it turns out to be needed', 'It marks the part as dangerous', 'It makes the board lighter'], a: 1, why: 'A footprint on the board with no part fitted costs nothing, and a part can be soldered on if testing shows it is needed.' },
    { q: 'The button of the monitor is on GPIO2, a strapping pin, with a pull-up. Why is that acceptable?', choices: ['Strapping pins cannot be read', 'The pin wants a high level at reset, and the pull-up gives it; the button pulls it low only afterwards', 'The button is never pressed', 'GPIO2 is not a strapping pin on the C3'], a: 1, why: 'On the C3, GPIO2 is read as high at reset. The pull-up satisfies that, and a press afterwards is an ordinary low level.' }
  ],
  applications: [
    'A hardware team reviews every schematic against the block diagram before it goes to layout.',
    'A test engineer writes the production test from the net names on the test points.',
    'An open-source hardware project publishes its schematic so that others can rebuild or repair the product.',
    'A firmware engineer reads the pin table in the code and the pin table in the schematic and checks they are the same ([[readable-code]]).'
  ],
  sources: [
    'Espressif, ESP32-C3 Hardware Design Guidelines: schematic checklist and the pins to take care with.',
    'KiCad documentation: the schematic editor and the electrical rules check.',
    'IEEE 315 and ASME Y14.44, graphic symbols and reference designations for electrical diagrams.'
  ],
  sim: 'de-schematic-review'
},

/* ================================================================ PCB layout for a radio module */
{
  id: 'pcb-layout-for-modules',
  parent: 'designing-a-solution',
  title: 'PCB layout for a radio module',
  level: 2,
  short: 'Layout turns the schematic into copper. Around a radio module most of the rules are about where things go: the antenna at the edge, an unbroken ground, short capacitor loops, noisy parts kept away from the antenna and the analogue input.',
  keywords: ['PCB layout', 'ground plane', 'decoupling loop', 'antenna keep-out', 'stackup', 'via', 'return path', 'USB differential pair', 'placement', 'two-layer board', 'four-layer board', 'DRC', 'trace width'],
  prereq: ['schematic-design', 'pcb-antennas', 'minimal-esp32-circuit'],
  related: ['antenna-placement-and-enclosures', 'module-footprints-and-soldering', 'current-peaks-and-capacitors', 'thermal-design', 'designing-with-the-bare-chip', 'electronics:decoupling'],
  body: `Layout turns the schematic into copper. Around a radio module, a few rules decide whether the board works, and most of them are about where things go, not how thick the lines are.

### Place first, route after

Place in this order: (1) connectors, holes and anything the enclosure fixes; (2) the module, with its antenna end at the board edge, overhanging or flush, and nothing near it ([[pcb-antennas]]); (3) the regulator and its capacitors; (4) the decoupling capacitors; (5) the rest. Route only when the placement is right: routing cannot repair a bad placement.

### Ground

Give the board a continuous ground plane: on a two-layer board, the whole bottom layer, with as few cuts as possible; on a four-layer board, a layer of its own. Signals return to their source through the ground right under them, so a slot in the plane under a fast signal makes a long loop that radiates and picks up noise. Join the module's ground pad to the plane with several vias.

### Decoupling loops

The 100 nF capacitor goes between the supply pin and ground as close as it can, with its ground via against its pad. The current loop that matters runs through the capacitor, the pin and the ground, and it should be small. The bulk capacitor sits at the module's supply pins or at the regulator's output, as the datasheet draws it.

### Noisy and quiet

Keep the switching regulator, a valve or motor driver and the USB connector away from the antenna and the analogue inputs. The soil probe's trace is short, with ground beside it and no digital line running parallel. A temperature sensor goes away from the regulator and the module, which warm the board ([[thermal-design]]).

### USB, power and checks

Route USB D+ and D- together, short and of equal length, as a pair of about 90 Ω differential impedance, with an ESD diode at the connector. Size power traces for their current with a trace-width calculator (IPC-2221). Then run the design-rule check, look at the board in 3D against the enclosure, and print it full size on paper: lay the real parts on it before ordering ([[module-footprints-and-soldering]]).

> [!key] Place the module at the edge with a clear antenna, keep the ground plane unbroken, make capacitor loops short, and keep noisy parts away from the antenna and the analogue inputs. Placement matters more than routing; check it on paper at full size.`,
  ideas: [
    'Place before routing: connectors and mechanics, the module at the board edge, the regulator, the capacitors.',
    'Keep the ground plane continuous under the module and the signals; a slot makes a long return loop.',
    'A decoupling capacitor works only if its loop (capacitor, pin, ground via) is small.',
    'Keep switching regulators, drivers and USB away from the antenna and analogue inputs; route USB D+ and D- as a pair.'
  ],
  pitfalls: [
    'Routing can fix any placement — A module in the middle of the board, a regulator across the board or a capacitor on the far side cannot be cured by tidy tracks. Move the part.',
    'More copper everywhere is better — Ground near the antenna end of the module, under or around it, is a fault. The module wants ground beside its body and none under its antenna.',
    'A decoupling capacitor anywhere near the pin will do — A capacitor with a long track to the pin and a distant ground via is a small inductor, not a capacitor. Its place and its via are the design.'
  ],
  terms: [
    { term: 'Ground plane', also: ['ground pour', 'ground layer'], def: 'A large area (or a whole layer) of copper connected to ground. It gives signals a short return path, shields, and spreads heat; the antenna end of a module is the exception.' },
    { term: 'Via', also: ['plated through hole'], def: 'A small plated hole that joins copper on different layers. A via next to a capacitor\'s ground pad gives the capacitor its short return to the plane.' },
    { term: 'Return path', also: ['return current'], def: 'The route that the current of a signal takes back to its source, usually through the ground plane directly under the signal. A break in it makes a bigger loop and more noise.' },
    { term: 'Stackup', also: ['layer stack', 'board layers'], def: 'The order and thickness of a board\'s copper and insulating layers. Two layers are enough for a small, slow board; four (signal, ground, power, signal) are used where it is dense or fast.' },
    { term: 'Design rule check', also: ['DRC'], def: 'An automatic check of the layout against the maker\'s limits: track width, clearance, hole sizes. It catches what the manufacturer would reject, not what would not work.' }
  ],
  choose: {
    good: ['A two-layer board with a solid bottom ground for a small battery or sensor product', 'A four-layer board for dense boards, USB at speed or a display with a fast bus', 'Placing everything on one side so that one assembly pass is enough'],
    avoid: ['Routing a signal across a gap in the ground plane', 'Putting the module in the middle of the board or beside the battery', 'Long thin tracks to a decoupling capacitor'],
    check: ['The keep-out drawing of your module against your layout', 'The path from each capacitor to its pin and its ground via', 'The board printed at full size with the real parts and connectors on it']
  },
  quiz: [
    { q: 'Where should the antenna end of a PCB-antenna module go?', choices: ['In the middle of the board', 'At the board edge, with nothing near it', 'Under the battery', 'Over the ground plane'], a: 1, why: 'At the edge, overhanging or flush, the antenna has air around it, as it was tuned to have. Copper, parts and batteries near it detune it.' },
    { q: 'Why is a slot in the ground plane under a fast signal bad?', choices: ['It wastes copper', 'The signal\'s return current must go round it, making a large loop that radiates and picks up noise', 'It lowers the voltage', 'It changes the colour'], a: 1, why: 'Return current follows the signal. A slot forces it around, and the loop it makes is an antenna.' },
    { q: 'What matters most about a 100 nF decoupling capacitor on a layout?', choices: ['Its colour', 'The small loop of capacitor, supply pin and ground via', 'Being on the other side of the board', 'Being near the USB socket'], a: 1, why: 'The capacitor only helps if the current loop through it is small: a short track to the pin and a ground via against its pad.' },
    { q: 'A layout that passes the design-rule check will work.', a: false, why: 'The check compares it with the manufacturer\'s limits. A module in the wrong place or a broken return path passes it and still fails.' }
  ],
  applications: [
    'A sensor board in a plastic box with the module on one edge and the connector on the opposite edge.',
    'A battery product with a switching regulator placed at the far end from the antenna and the analogue inputs.',
    'A USB-C product with the connector, the ESD diode and the D+/D- pair kept short and together.',
    'A design review that prints the board at full size and puts the real module, battery holder and connector on it.'
  ],
  sources: [
    'Espressif, ESP32-C3 Hardware Design Guidelines and the corresponding guidelines for other chips: PCB layout guidance.',
    'Espressif, module datasheets (for example ESP32-C3-MINI-1): module placement and antenna keep-out drawings.',
    'IPC-2221, Generic Standard on Printed Board Design; USB 2.0 specification: the differential impedance of the data pair.'
  ],
  sim: 'de-pcb-layout'
},

/* ================================================================ designing with the bare chip */
{
  id: 'designing-with-the-bare-chip',
  parent: 'designing-a-solution',
  title: 'Designing with the bare chip',
  level: 3,
  short: 'A module is the chip with the hard work done: the radio matching, the crystal, the flash, the antenna and the radio approvals. Putting the bare chip on your own board saves money per unit at volume, and costs a layout of radio-frequency lines and a round of testing in a lab.',
  keywords: ['bare chip', 'QFN', 'chip-down design', 'matching network', 'crystal', 'RF layout', 'external flash', 'SiP', 'ESP32-C3FH4', 'modular approval', 'chip down', 'volume production', 'module or chip'],
  prereq: ['minimal-esp32-circuit', 'pcb-layout-for-modules', 'what-a-module-adds'],
  related: ['system-in-package', 'module-certification', 'regulatory-approval', 'matching-and-tuning', 'crystals-and-clocks', 'bill-of-materials-and-cost', 'pcb-antennas'],
  body: `A module is the chip with the hard work done: it carries the flash memory, the crystal, the radio-frequency matching and the antenna, tested and, in most cases, approved as a radio. Designing with the **bare chip** (a "chip-down" design) means taking all of that over onto your own board. It is what the products made in the hundreds of thousands do, and it is a different kind of project.

### What you take over

| Part | Its job | What goes wrong |
|---|---|---|
| Supply network | several supply pins, each with its own capacitors, as in the guidelines | noise in the radio and the ADC |
| Crystal and its capacitors | the clock the radio and the CPU run from (40 MHz on most of the family; check yours) | start-up failures, a radio frequency off by too much |
| 32.768 kHz crystal (optional) | a more accurate clock for sleep | not needed unless sleep timing matters |
| Flash | holds the program; inside some chips, outside on others | a flash on the wrong pins, or the wrong voltage |
| Matching network | a few inductors and capacitors that match the chip's output to 50 Ω | lost range, failed radio tests |
| Antenna and its 50 Ω line | the radiating part | detuning; layout that needs measurement |

Some chips come with their flash inside the package: the catalogue lists the ESP32-C3FH4 (4 MB) and C3FH8X (8 MB), and the ESP32-C3 in its 5 × 5 mm package then needs no separate flash. Espressif also offers system-in-package parts, which include the crystal ([[system-in-package]]).

### Radio layout is measurement

The line from the chip to the antenna is a 50 Ω transmission line, and the matching network between them is tuned for the actual board, its copper and its neighbours, with a network analyser. A four-layer board with a solid ground under the line is the usual way. Espressif publishes hardware design guidelines and reference designs, and copying them with their stack-up and dimensions closely is the safe path ([[matching-and-tuning]]).

### Approvals come back to you

A certified module brings a radio approval that you may reuse when you meet its conditions, the antenna included ([[module-certification]]). With a bare chip the radio of the product must be tested in a laboratory, together with its electromagnetic compatibility and safety ([[regulatory-approval]]). That is a fixed cost and several weeks, repeated if the layout changes.

### When it pays

The simulation on this page plots unit cost against quantity for both routes. The chip route has a lower cost per unit and a higher one-off cost, so there is a crossover quantity below which the module wins. It also needs people who can lay out a radio. A first product, or one made in tens or hundreds, belongs on a module; the chip comes with a second revision.

> [!key] A bare chip puts the crystal, flash, radio matching, RF layout and the radio tests on you. It pays only above a crossover quantity and with the skills to do it; start with a module and move to the chip when the numbers say so.`,
  ideas: [
    'A module is the chip with its flash, crystal, radio matching and antenna built, tested and (usually) approved; a bare chip leaves all of that to you.',
    'The radio line and its matching network are tuned by measurement on your own board: copy the reference design closely.',
    'A module\'s radio approval can be reused if its conditions are met; a bare-chip product is tested as a radio in a laboratory.',
    'The chip route has a lower unit cost and a higher one-off cost: there is a quantity below which the module wins.'
  ],
  pitfalls: [
    'A bare chip is the same as a module without the markup — The markup pays for the matching, the tuning, the antenna layout and the radio tests. Without them the chip costs less per unit and much more to get working.',
    'Copy the module\'s schematic and I have a module — The module\'s schematic is not published in full detail, and its performance depends on its own layout and shield. Use the chip\'s reference design.',
    'Approvals are the module maker\'s problem — A module\'s approval covers the module, under its conditions. A chip-down product is approved as a whole, by you.'
  ],
  terms: [
    { term: 'Chip-down design', also: ['bare-chip design', 'chip down'], def: 'A product in which the microcontroller chip itself is soldered to the board, with its own crystal, flash, supply network and radio matching, instead of a ready-made module.' },
    { term: 'Matching network', also: ['impedance matching', 'pi network', 'RF match'], def: 'A few small inductors and capacitors between the chip\'s radio pin and the antenna that make the line look like the 50 Ω both sides expect, so that power is radiated rather than reflected.' },
    { term: 'Crystal', also: ['XTAL', 'quartz crystal', 'main clock'], def: 'A quartz part that sets the frequency of the chip\'s main clock, 40 MHz on most chips of the family. Its error limits the accuracy of the radio frequency.' },
    { term: 'System in package', also: ['SiP'], def: 'A single package that holds the chip together with the memory and the crystal, so the board needs fewer parts, as with the ESP32-PICO parts.' },
    { term: 'Modular approval', also: ['modular grant', 'module certification'], def: 'A radio approval given to a module that the makers of products can rely on if they follow the module\'s conditions, such as using the approved antenna and not changing the module.' }
  ],
  choose: {
    good: ['Products made in large numbers, where a few per cent on the unit cost is a lot of money', 'Products with a size limit that a module cannot meet', 'A team with radio-frequency layout and testing experience, or access to someone who has it'],
    avoid: ['A first product or a run of tens or hundreds: a module is quicker and safer', 'Changing the reference design\'s layout or stack-up without a way to measure', 'Assuming a module\'s approval carries over to a chip-down board'],
    check: ['The crossover quantity for your costs, in the simulation below', 'The reference design and layout guidelines of your exact chip', 'The cost and time of the radio, EMC and safety tests in your market']
  },
  examples: [
    {
      title: 'The crossover quantity',
      q: 'In invented cost units, a module-based unit costs 8 to build and the design needs 2000 of one-off cost. The chip-down unit costs 6 to build, but needs 12 000 of one-off cost (layout, tuning and radio tests). At what quantity do the two cost the same?',
      steps: ['Unit cost is the build cost plus the one-off cost spread over the quantity: u = b + F / Q.', 'Set them equal: 8 + 2000 / Q = 6 + 12 000 / Q.', 'Collect: 2 = 10 000 / Q, so Q = 5000.'],
      a: 'At 5000 units. Below it the module is cheaper overall; above it the chip-down design is. The figures are invented for the exercise: replace them with your own quotes.'
    }
  ],
  quiz: [
    { q: 'What does a certified module bring that a bare chip does not?', choices: ['A faster CPU', 'A radio approval you may reuse, and a matched, tested radio and antenna', 'More pins', 'A bigger battery'], a: 1, why: 'The module\'s matching, antenna and approval are done. A bare chip has to be matched, laid out and approved as a radio in your product.' },
    { q: 'Why is the line from the chip to the antenna laid out so carefully?', choices: ['It carries the battery current', 'It is a 50 Ω transmission line whose shape sets how much power is radiated', 'It is the longest track', 'It holds the boot pin'], a: 1, why: 'At 2.4 GHz a track is a transmission line. Its width, its distance to ground and the matching network decide how much power reaches the antenna.' },
    { q: 'A product is made in 300 units. Which route is likely cheaper in total?', choices: ['A bare chip, always', 'A module, because the one-off costs of the chip route are not spread widely enough', 'Neither', 'It makes no difference'], a: 1, why: 'The chip route has a lower unit cost but a high one-off cost. At small quantities the one-off cost dominates, so the module wins.' },
    { q: 'Using a certified module, the finished product needs no further testing.', a: false, why: 'A module\'s approval covers the radio under its conditions. The product still has to meet the rules for electromagnetic compatibility, safety and its own marking.' }
  ],
  applications: [
    'Large-volume smart plugs, bulbs and sensors are built chip-down to save the unit cost of a module.',
    'A wearable that must fit a space smaller than any module.',
    'A product family that starts on a module and moves to the chip in its second hardware revision.',
    'A development team that buys the reference board of a chip to learn its layout before designing its own.'
  ],
  sources: [
    'Espressif, ESP32-C3 Series Datasheet: package, strapping pins, the variants with flash in the package.',
    'Espressif, ESP32-C3 Hardware Design Guidelines: crystal, RF matching and layout, power supply (and the same guidelines for other chips).',
    'Directive 2014/53/EU (RED) and the FCC rules, Part 15: the radio rules that apply to the finished product, in outline.'
  ],
  sim: { id: 'de-cost-stack', params: { view: 'crossover' } }
},

/* ================================================================ enclosures */
{
  id: 'enclosures',
  parent: 'designing-a-solution',
  title: 'Enclosures',
  level: 2,
  short: 'The box decides range, temperature, water tightness, how the cables are held and how people touch the thing. Choose plastic near the antenna, work out the IP rating the place needs, let the box breathe, and test everything with the lid on.',
  keywords: ['enclosure', 'case', 'IP rating', 'IP65', 'cable gland', 'strain relief', 'light pipe', 'condensation', 'breather vent', 'plastic', 'metal', '3D printed case', 'waterproof', 'antenna in a box'],
  prereq: ['pcb-layout-for-modules', 'antenna-placement-and-enclosures', 'prototyping-stages'],
  related: ['thermal-design', 'external-antennas', 'esd-and-bench-safety', 'rssi-and-signal-quality', 'switching-mains-safely', 'protection-parts'],
  body: `The enclosure is part of the design, not a box added at the end. It decides how far the radio reaches, how hot the board gets, whether water gets in, how a pulled cable is held and how a person touches the product.

### Material and the antenna

Plastic (ABS, polycarbonate, PETG, ASA) lets radio waves through; metal stops them. A closed metal box shields a printed antenna almost completely: use a U-version module with an external antenna on the outside ([[external-antennas]]). Even a plastic wall changes things, so keep the antenna end clear of walls and of the battery, and measure with the lid on.

### Water and dust: the IP code

IP is followed by two digits. The first is protection from solids (5 is dust-protected, 6 dust-tight); the second is from water (4 splashes, 5 jets, 7 temporary immersion). A greenhouse that is hosed calls for IP65 or better; a shaded, dry place needs less. The rating belongs to the whole enclosure: one cable entry without a gland, or a lid screw without a seal, loses it.

### Condensation and pressure

A sealed box breathes as it warms and cools, drawing in humid air that condenses on the cold board at night. A breather vent (a plug with a membrane) lets pressure and vapour out and keeps water out; a coat of conformal lacquer on the board, and a sachet of desiccant, help. Mount the humidity sensor outside the sealed volume or behind a vent, or it reads its own box.

### Cables, light and fingers

- **Cable glands** with strain relief, and a clamp or a knot inside, so that a pull never reaches the solder joints.
- **Light pipes** for the LED, and a sealed button or a membrane.
- **A separate compartment** or a hatch for the battery.
- **Mounting points** and space round the antenna.

### Design the box with the board

Export the board outline early and test the fit in CAD or on a 3D-printed box. Print the first boxes, and test the second.

> [!warn] Mains wiring inside an enclosure is work for a qualified person: it needs isolation distances, a fixed barrier between mains and low-voltage parts, strain relief and a rated enclosure, to the local wiring code. A bare relay board in a box is not a product.

> [!key] Plastic near the antenna, an IP rating that matches the place, a vent for pressure, glands and strain relief on every cable, and every test repeated with the lid on. Design the box with the board, not after it.`,
  ideas: [
    'Plastic passes radio and metal blocks it; a closed metal box needs an external antenna on the outside.',
    'The IP code gives protection from solids and from water; the rating belongs to the whole box, glands and seals included.',
    'A sealed box breathes: condensation needs a breather vent, a coating and sensors placed in the air, not in the box.',
    'Test range, temperature and fit with the lid on, and design the box with the board.'
  ],
  pitfalls: [
    'IP65 is a property of the box I bought — It is a property of the box as built. A gland left out, a cut hole, a poorly seated seal or a screw too few and it is no longer IP65.',
    'A sealed box keeps all the water out — A box that is sealed tight draws moist air in as it cools and the water condenses inside. Venting through a membrane is how a sealed box stays dry.',
    'The range test can be done with the lid off — The lid, the walls and the battery detune the antenna. Test range, as everything else, in the final box and in the final place.'
  ],
  terms: [
    { term: 'IP rating', also: ['IP code', 'ingress protection', 'IP65'], def: 'A two-digit code (IEC 60529) for how well an enclosure keeps out solids (first digit) and water (second digit). IP54 is dust-protected and splash-proof; IP67 survives brief immersion.' },
    { term: 'Cable gland', also: ['cable entry', 'strain relief gland'], def: 'A fitting that takes a cable through the wall of an enclosure, seals around it and clamps it so that pulling does not load the electronics.' },
    { term: 'Breather vent', also: ['vent plug', 'membrane vent'], def: 'A small plug with a waterproof, air-permeable membrane that lets a sealed box equalise pressure and let moisture out without letting water in.' },
    { term: 'Light pipe', also: ['light guide'], def: 'A clear plastic rod that carries the light of an LED on the board to a hole in the enclosure, so the box needs no open hole at the LED.' },
    { term: 'Conformal coating', also: ['conformal lacquer'], def: 'A thin protective layer sprayed or brushed over a finished board to protect it from moisture and dust. Connectors and parts to be probed are masked.' }
  ],
  choose: {
    good: ['A plastic box (ABS, polycarbonate or ASA) for a radio product', 'A box with an IP rating that matches the wettest place it will meet', 'A U-version module with an external antenna for a metal box'],
    avoid: ['A metal case around a printed antenna', 'A sealed box without a vent in a place with large temperature swings', 'Cable entries without a gland and a clamp'],
    check: ['The IP rating of the box as built, with its glands, not the catalogue number alone', 'The signal strength with the lid on and off, in the final place', 'That the sensors measure the air outside, not the heat of the box']
  },
  code: [
    {
      title: 'Does the lid cost range? Measure the signal strength',
      about: 'Averages the signal strength of the router twenty times and prints it every two seconds. Watch the number with the lid off, then on, without moving the box: a drop of more than about 3 dB is a warning, and 6 dB halves the range in free space.',
      needs: 'Any ESP32-family board in its box, and a Wi-Fi network you can reach.',
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          repeat until <Wi-Fi connected?>
            wait (0.25) seconds
          end
          print [connected: put the lid on or off and watch the average]
          forever
            set [sum v] to (0)
            repeat (20)
              change [sum v] by (signal strength)
              wait (0.1) seconds
            end
            print (join [average signal in dBm: ] (round ((sum) / (20))))
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>

        const char *SSID = "your-ssid";
        const char *PASS = "your-password";
        const int N = 20;                          // readings per average

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);
          WiFi.begin(SSID, PASS);
          while (WiFi.status() != WL_CONNECTED) delay(250);
          Serial.println("connected: put the lid on or off and watch the average");
        }

        void loop() {
          long sum = 0;
          for (int i = 0; i < N; i++) {
            sum += WiFi.RSSI();                    // signal strength of the router, in dBm
            delay(100);
          }
          Serial.printf("average signal over %d readings: %.1f dBm\n", N, sum / (float)N);
        }
      `,
      py: String.raw`
        import network, time

        SSID = "your-ssid"
        PASSWORD = "your-password"
        N = 20                                     # readings per average

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect(SSID, PASSWORD)
        while not wlan.isconnected():
            time.sleep_ms(250)
        print("connected: put the lid on or off and watch the average")

        while True:
            total = 0
            for _ in range(N):
                total += wlan.status("rssi")       # signal strength of the router, in dBm
                time.sleep_ms(100)
            print("average signal over %d readings: %.1f dBm" % (N, total / N))
      `,
      output: `
        connected: put the lid on or off and watch the average
        average signal over 20 readings: -58.4 dBm
        average signal over 20 readings: -66.9 dBm
      `,
      notes: ['The numbers in the output are an illustration. Use the same place, the same position of the box and the same router for both measurements, and wait for the average to settle.', 'Do not leave credentials in code you share ([[credentials-handling]]); see [[rssi-and-signal-quality]] for how to read the figures.']
    }
  ],
  examples: [
    {
      title: 'What does 6 dB of lid cost?',
      q: 'The average signal strength of the router is -58 dBm with the lid off and -64 dBm with it on. By how much does the lid change the range in free space, and what does it mean for a margin of 10 dB?',
      steps: ['The lid costs 64 - 58 = 6 dB.', 'In free space the received power falls with the square of distance, so 6 dB is a factor of two in distance: 10^(6/20) = 2.', 'A link with a 10 dB margin keeps 4 dB; it can lose a further 4 dB (an hour of rain, a person in the path) before it fails.'],
      a: 'The free-space range halves, and the margin falls from 10 dB to 4 dB. Indoors, with walls, the loss is worse than the free-space figure. A change of 3 dB or more is worth a fix: move the antenna, change the wall.'
    }
  ],
  quiz: [
    { q: 'Which enclosure material is a problem for a module with a printed antenna?', choices: ['ABS plastic', 'Polycarbonate', 'A closed aluminium box', 'ASA'], a: 2, why: 'A closed metal box shields the antenna almost completely. Plastics let radio waves through (though they still detune it a little).' },
    { q: 'What does the second digit of an IP rating describe?', choices: ['Dust', 'Water', 'Impact', 'Temperature'], a: 1, why: 'The first digit rates solids (dust), the second water. IP65 is dust-tight and protected from water jets.' },
    { q: 'Why does a sealed box often get damp inside?', choices: ['The seal always leaks', 'It draws in humid air as it cools and the vapour condenses on the cold board', 'Plastic absorbs water', 'The battery makes water'], a: 1, why: 'Pressure changes with temperature move air through any small gap. A breather vent with a membrane lets pressure equalise and moisture out without letting water in.' },
    { q: 'A change of 8 dB in signal strength between lid off and lid on is not worth worrying about.', a: false, why: 'A drop of 3 dB or more is a warning. 8 dB cuts the free-space range to about a third and removes most of a link\'s margin.' }
  ],
  applications: [
    'A garden or greenhouse sensor in an IP65 plastic box with a vent plug and a gland for each cable.',
    'A product with a clear window or a light pipe so that a status LED is visible in a sealed case.',
    'A metal industrial housing with an antenna on a short cable through the wall.',
    'A 3D-printed prototype box, printed in the final plastic, used for the first range and fit checks.'
  ],
  sources: [
    'IEC 60529, Degrees of protection provided by enclosures (IP code).',
    'Espressif, module datasheets and hardware design guidelines: antenna placement and keep-out in the product.',
    'Arduino core for ESP32 documentation, WiFi.RSSI (core 3.3); MicroPython documentation, network.WLAN.status (version 1.29).'
  ]
},

/* ================================================================ heat */
{
  id: 'thermal-design',
  parent: 'designing-a-solution',
  title: 'Heat',
  level: 2,
  short: 'A board that works on the bench in 22 °C air can fail in a closed box in the summer sun. Where the heat comes from, how a temperature rise follows from watts and thermal resistance, and what it does to the chip, the battery and the sensors.',
  keywords: ['heat', 'thermal design', 'thermal resistance', 'junction temperature', 'self-heating', 'derating', 'linear regulator heat', 'enclosure temperature', 'operating temperature', 'battery temperature', 'sensor self-heating', 'thermal vias'],
  prereq: ['enclosures', 'regulators-ldo-and-buck', 'the-3v3-rail'],
  related: ['internal-temperature-sensor', 'lithium-cells', 'temperature-sensors', 'heaters-and-thermal-loads', 'electronics:heat-sinks', 'reliability-in-the-field'],
  body: `Heat is the quiet failure: a board that is happy on the bench in 22 °C air can fail in a closed box in the summer sun. It is worth a short calculation before the box is closed.

### Where the heat comes from

Heat is power that does not reach the load. A **linear regulator** turns the difference between its input and output voltage into heat: from 5 V to 3.3 V at 250 mA that is 1.7 V times 0.25 A, or 0.43 W, and the same regulator is only 66 % efficient ([[regulators-ldo-and-buck]]). The **radio** adds a few tenths of a watt while it transmits, a motor driver or MOSFET adds current squared times resistance, and a charger and LEDs add more. And the **sun** on a dark box can heat its inside far above the air. A device that sleeps for 600 s and wakes for 1 s dissipates microwatts on average: for it, only the sun and the charger matter.

### How hot it gets

Heat flows from the part, through the board and the air, to the outside, and every step resists it. The temperature rise is the power times the **thermal resistance** in kelvin per watt:

$$\\Delta T = P \\cdot R_{\\theta}$$

A small regulator on little copper may have a thermal resistance of tens of K/W, and the sealed air of a box adds to it. Copper area, thermal vias under a hot part, and a vent all lower it.

### What heat does

- **The chip and module** have ratings: the catalogue gives -40 to 105 °C for the ESP32-C3, and a module comes in versions rated to 85 °C or 105 °C ([[internal-temperature-sensor]]).
- **A lithium cell** should not be charged below 0 °C or above about 45 °C and ages faster when hot; check your cell\'s datasheet ([[lithium-cells]]).
- **A temperature sensor** inside the box reads the box. Keep it away from the regulator and the module, in the air you mean to measure ([[temperature-sensors]]).
- **Electrolytic capacitors and plastics** age faster; the rule of thumb is that life halves for every ten degrees.

### What to do

Use a switching regulator instead of a linear one when the drop is large; spread hot parts apart and away from the sensor and the cell; shade or whiten the box and vent it where the rating allows; choose parts for the worst case with room to spare; and measure, with the real workload, in the closed box, in the sun.

> [!key] Heat is power that does not reach the load, and the rise is the power times the thermal resistance. Check the regulator, the radio and the sun, keep sensors and cells away from hot parts, and measure the temperature in the closed box.`,
  ideas: [
    'Heat is the power that does not reach the load: a linear regulator wastes the voltage drop times the current.',
    'The temperature rise is the power times the thermal resistance, in kelvin per watt.',
    'Chips, cells, sensors and capacitors each have a temperature range, and a lithium cell\'s is the narrowest.',
    'A device that sleeps nearly always dissipates microwatts: the sun, a charger and the radio\'s bursts matter more.'
  ],
  pitfalls: [
    'A battery device cannot get hot — The sleeping board is cool, but a dark box in sunshine, a charger and a linear regulator during the radio\'s bursts all heat it. Measure rather than assume.',
    'If the chip works at 25 °C it works at 60 °C — The chip may, but the cell may not be allowed to charge, the sensor reads the box and a regulator may be near its limit. Each part has its own range.',
    'More ventilation is always better — A hole is a way in for water and insects. Vent through a membrane, in the shade, and trade it against the IP rating.'
  ],
  terms: [
    { term: 'Thermal resistance', also: ['Rth', 'R_theta', 'K/W'], def: 'How many kelvin a part warms for each watt it dissipates, measured from the part to the surrounding air (or to the board). A lower value means better cooling.' },
    { term: 'Junction temperature', also: ['Tj', 'die temperature'], def: 'The temperature of the silicon itself. It is the ambient temperature plus the power times the thermal resistance, and it is what the part\'s limits are written about.' },
    { term: 'Self-heating', also: ['thermal bias'], def: 'The warming of a sensor, or of the air round it, by the board\'s own dissipation, so that it reads higher than the true temperature of what it measures.' },
    { term: 'Derating', also: ['derate'], def: 'Using a part below its rated limit, or reducing the allowed load as the temperature rises, to keep a margin for ageing and the worst case.' },
    { term: 'Thermal via', also: ['heat via'], def: 'A plated hole, often several in a group, under a hot part that carries its heat to the copper on the other side of the board.' }
  ],
  choose: {
    good: ['A buck converter instead of a linear regulator for a large voltage drop', 'Spreading hot parts, with copper under them and away from sensors and cells', 'A shaded or light-coloured box with a membrane vent outdoors'],
    avoid: ['A linear regulator from 12 V or from a USB supply at a few hundred milliamps', 'A temperature sensor next to the regulator or the module', 'Charging a lithium cell below 0 °C or in a hot, closed box'],
    check: ['The power, the thermal resistance and the ambient temperature of the hottest part', 'The temperature ranges of the cell, the sensor and the module version', 'The measured temperature in the closed box, with the real workload']
  },
  formulas: [
    {
      name: 'Temperature of a part',
      expr: 'Tj = Ta + P*Rth',
      tex: 'T_{j} = T_{a} + P \\cdot R_{\\mathrm{th}}',
      vars: {
        Tj: { name: 'temperature of the part', q: 'temperature', unit: '°C', tex: 'T_{j}' },
        Ta: { name: 'ambient temperature', q: 'temperature', unit: '°C', value: 40, tex: 'T_{a}' },
        P: { name: 'power dissipated', q: 'power', unit: 'W', value: 0.43 },
        Rth: { name: 'thermal resistance to the air', q: 'thermalres', unit: 'K/W', value: 60, tex: 'R_{\\mathrm{th}}' }
      },
      note: 'A steady-state estimate. The thermal resistance depends on the copper area, the airflow and the box: take it from the datasheet\'s figure for your board layout and add margin.',
      stories: { Tj: 'A linear regulator dissipates {P} on a board whose thermal resistance to the air is {Rth}, in air at {Ta}. How hot does it get?' },
      practice: { unknowns: ['Tj', 'P'] }
    }
  ],
  examples: [
    {
      title: 'A linear regulator in a hot box',
      q: 'A 5 V supply feeds a 3.3 V linear regulator that delivers an average 250 mA while the radio works. The regulator on its copper has a thermal resistance of 60 K/W (an assumption for the exercise). The box air reaches 50 °C. How hot is the regulator, and is a buck converter worth it?',
      steps: ['The regulator dissipates (5 - 3.3) x 0.25 = 0.425 W.', 'The rise is 0.425 W x 60 K/W = 25.5 K.', 'At 50 °C air the regulator reaches 50 + 25.5 = 75.5 °C.', 'A buck converter of 85 % efficiency delivers the same 0.825 W (3.3 V times 0.25 A) and wastes about 0.15 W: a rise of about 9 K at the same thermal resistance.'],
      a: 'About 75 °C, within the chip\'s range but close to an 85 °C module version, with a cell and a sensor nearby. A buck converter would cut the heat to about a third; the choice depends on the cost and on what else is in the box.'
    }
  ],
  quiz: [
    { q: 'A 5 V to 3.3 V linear regulator delivers 100 mA. How much heat does it make?', choices: ['0.33 W', '0.17 W', '0.5 W', '0 W'], a: 1, why: 'The regulator drops 1.7 V at 100 mA: 1.7 x 0.1 = 0.17 W, the product of the voltage drop and the current.' },
    { q: 'A part dissipates 0.5 W and has a thermal resistance of 40 K/W. By how much does it warm above the air?', choices: ['20 K', '80 K', '0.0125 K', '40 K'], a: 0, why: 'The rise is the power times the thermal resistance: 0.5 x 40 = 20 K.' },
    { q: 'Why should a temperature sensor be kept away from the regulator and the module?', choices: ['They interfere with I2C', 'They warm the air and the board, so the sensor reads too high', 'They make the sensor wet', 'They change its address'], a: 1, why: 'The board dissipates heat, and a sensor close to a hot part reads the heat of the part rather than the air you want to measure.' },
    { q: 'A device that sleeps for 599 s of every 600 s will not get warm inside a closed box in the sun.', a: false, why: 'The sleep dissipation is negligible, but the sun heats a dark box, and a charger or the radio\'s burst can add to it. The air in a closed box in sunlight can be far above the outside air.' }
  ],
  applications: [
    'A garden sensor in a white box with a vent, so the electronics stay inside the cell\'s charging range.',
    'A smart plug with a switching supply and a plastic case that must stay under a temperature limit.',
    'A thermal log of the chip in the closed box in the sun, used to decide whether the first board needs changes.',
    'A product with a weather-exposed battery that is disabled for charging below 0 °C.'
  ],
  code: [
    {
      title: 'Log the chip temperature in the closed box',
      about: 'Prints the temperature of the chip every ten seconds, with the highest so far and a warning above the lowest rating among the parts. Close the box with the real workload running and leave it in the sun: the highest value is the number to compare with the limits.',
      needs: 'Any ESP32-family board except the original ESP32, which has no usable internal temperature sensor.',
      blocks: `
        when started
          start serial at (115200) baud
          set [highest v] to (-100)
          forever
            set [now v] to (chip temperature :: sensing)
            if <(now) > (highest)> then
              set [highest v] to (now)
            end
            print (join [chip ] (join (round (now)) (join [ C, highest so far ] (round (highest)))))
            if <(now) > (85)> then
              print [OVER THE LIMIT]
            end
            wait (10) seconds
          end
      `,
      cpp: String.raw`
        const float LIMIT_C = 85.0;          // the lowest rating among the parts (a module version rated to 85 C)
        float highestC = -100.0;

        void setup() {
          Serial.begin(115200);
        }

        void loop() {
          float c = temperatureRead();       // the chip's own die temperature
          if (c > highestC) highestC = c;
          Serial.printf("%lu s: chip %.1f C, highest so far %.1f C%s\n",
                        (unsigned long)(millis() / 1000), c, highestC, c > LIMIT_C ? "  OVER THE LIMIT" : "");
          delay(10000);
        }
      `,
      py: String.raw`
        import esp32, time

        LIMIT_C = 85.0                       # the lowest rating among the parts (a module version rated to 85 C)
        highest = -100.0

        while True:
            c = esp32.mcu_temperature()      # the chip's own die temperature
            highest = max(highest, c)
            print("%d s: chip %.1f C, highest so far %.1f C%s"
                  % (time.ticks_ms() // 1000, c, highest, "  OVER THE LIMIT" if c > LIMIT_C else ""))
            time.sleep(10)
      `,
      output: `
        10 s: chip 41.3 C, highest so far 41.3 C
        20 s: chip 42.1 C, highest so far 42.1 C
      `,
      notes: ['This is the temperature of the silicon, which sits above the air in the box. Run it with the radio doing its real work (connecting and sending) or the figure is too low ([[internal-temperature-sensor]]).', 'Compare with the air in the box measured by a separate sensor: the difference is the board\'s own heating.']
    }
  ],
  sources: [
    'Espressif, ESP32-C3 Series Datasheet and module datasheets: recommended ambient temperature ranges.',
    'Manufacturer datasheets of regulators and cells: thermal resistance figures and the cell\'s charge and discharge temperature limits.',
    'JEDEC JESD51, methods for measuring the thermal resistance of packaged semiconductors (the basis of the datasheet figures).'
  ]
},

/* ================================================================ bill of materials and cost */
{
  id: 'bill-of-materials-and-cost',
  parent: 'designing-a-solution',
  title: 'Bill of materials and cost',
  level: 2,
  short: 'The bill of materials lists every part with what is needed to buy it. The cost of a product is more than its parts: the board, assembly, test, the box and the one-off costs, which spread thinner as the quantity grows.',
  keywords: ['BOM', 'bill of materials', 'MPN', 'cost per unit', 'NRE', 'fixed cost', 'price break', 'MOQ', 'minimum order quantity', 'second source', 'lead time', 'unit cost', 'break-even', 'assembly cost'],
  prereq: ['choosing-the-parts', 'schematic-design'],
  related: ['designing-with-the-bare-chip', 'product-lifecycle-and-longevity', 'clones-and-counterfeits', 'factory-programming', 'production-testing', 'regulatory-approval'],
  body: `A bill of materials (BOM) is the list of every part in the product with what is needed to buy it. A good one is a design document and a purchase order in one.

### What a line holds

| Field | Why |
|---|---|
| Reference designators (R1, R2, C4) | which positions on the board the line fills |
| Quantity | for the order |
| Value and footprint | what it is and what size |
| Manufacturer and part number | the exact part: "10 k 0402" is not a part |
| Supplier and order code | where it is bought |
| Alternate (second source) | what may replace it ([[choosing-the-parts]]) |
| DNP | placed, or left empty |

### A product costs more than its parts

The parts are one slice. Add the circuit board, assembly (a set-up charge plus a charge for every part placed), test, the enclosure and packaging, and the one-off costs: design time, tooling, a test jig, and the radio and safety approvals. The simulation below stacks them for the greenhouse monitor in invented "cost units", so that the shapes, not the prices, are what you see.

### Fixed and variable cost

Each unit has a **variable cost** b (parts, board, assembly, test). The project has a **fixed cost** F (design, tooling, approvals). Spread over Q units, the cost of one is

$$u = b + \\frac{F}{Q}$$

At 10 units the fixed cost dominates and a unit costs many times the parts; at 10 000 it has almost vanished. That is why prototypes are dear, why a module is the cheap way to start, and why a bare chip, with a higher F and a lower b, pays only above a crossover quantity ([[designing-with-the-bare-chip]]).

### Buying

Distributors quote price breaks by quantity and minimum order quantities; lead times of some parts run to months and stock changes by the week. Buy from authorised distributors, because a counterfeit part is a defect that arrives with the order ([[clones-and-counterfeits]]); check the lifecycle status of each part ([[product-lifecycle-and-longevity]]); and order a few per cent extra for assembly losses and spares. Prices change, so this page gives none: ask for quotes at your quantity.

> [!key] A BOM gives each part its exact number, a supplier and an alternate. A unit costs its variable cost plus the fixed cost divided by the quantity, so the one-off costs decide the price of small runs and the parts decide the price of large ones.`,
  ideas: [
    'A BOM line names the exact part by its manufacturer part number, with a supplier and a second source.',
    'The cost of a product includes the board, assembly, test, the box and the one-off costs, not only the parts.',
    'Unit cost is the variable cost plus the fixed cost divided by the quantity: small runs are ruled by fixed costs.',
    'Buy from authorised distributors, check each part\'s lifecycle and keep a second source for every key part.'
  ],
  pitfalls: [
    'The parts total is the product\'s cost — The board, assembly, test, enclosure, approvals and your own time often exceed the parts. A product that has a parts cost of 10 may cost 30 to deliver.',
    'The cheapest listing is the best price — A very low price for a chip or a sensor on a marketplace is a warning: relabelled and counterfeit parts are common. The saving is lost in the first failure.',
    'Alternates can be found later — When a part goes out of stock the replacement must already be checked against the footprint and the program. Choose second sources while the design is still open.'
  ],
  terms: [
    { term: 'Bill of materials', also: ['BOM', 'parts list'], def: 'The complete list of the parts of a product with quantity, value, footprint, manufacturer, part number and supplier. It is used to buy parts and to assemble the board.' },
    { term: 'Manufacturer part number', also: ['MPN'], def: 'The exact code the maker gives to a part. Unlike "10 k resistor" it identifies one part with one set of properties, so that a buyer cannot be given a different one.' },
    { term: 'Non-recurring engineering cost', also: ['NRE', 'fixed cost', 'one-off cost'], def: 'The cost of a project that does not depend on how many units are made: design time, tooling, test jigs, approvals. It is spread over the whole run.' },
    { term: 'Price break', also: ['quantity break', 'volume price'], def: 'A quantity above which a supplier\'s price per part is lower. The best order size is often just above a break.' },
    { term: 'Minimum order quantity', also: ['MOQ'], def: 'The smallest number of a part a supplier will sell. It can force a purchase of hundreds for a prototype that needs ten.' }
  ],
  choose: {
    good: ['A BOM with the manufacturer part number and a second source for every key part', 'Parts from authorised distributors with a stated lifecycle', 'Cost per unit worked out at three quantities: your first batch, ten times that, and a hundred times'],
    avoid: ['Value-only lines such as "100 nF" with no part number', 'Unbranded parts of unknown origin in anything you ship', 'Quoting a cost from the parts total alone'],
    check: ['That every line has one exact part and a supplier code', 'The lead time and the stock of the longest-lead part', 'The fixed costs: tooling, jig and approvals, and the quantity that spreads them']
  },
  formulas: [
    {
      name: 'Cost of one unit',
      expr: 'u = b + F/Q',
      tex: 'u = b + \\frac{F}{Q}',
      vars: {
        u: { name: 'cost of one unit', q: 'money', unit: '$' },
        b: { name: 'variable cost of one more unit', q: 'money', unit: '$', value: 12 },
        F: { name: 'fixed (one-off) cost', q: 'money', unit: '$', value: 6000 },
        Q: { name: 'quantity made', q: 'count', value: 500, min: 1, int: true }
      },
      note: 'The figures are invented for the exercise. Variable cost b is parts, board, assembly and test per unit; F is design, tooling, jig and approvals.',
      stories: { u: 'Each unit costs {b} to make, and the project has {F} of one-off costs. What does a unit cost over a run of {Q}?', Q: 'A unit costs {b} to make and the one-off costs are {F}. How many must be made for each to cost {u}?' },
      practice: { unknowns: ['u', 'Q'] }
    }
  ],
  examples: [
    {
      title: 'What does one unit cost at three quantities?',
      q: 'A monitor costs 12 cost units to make (parts, board, assembly, test) and the project has 6000 of one-off costs. What does a unit cost over 20, 500 and 10 000 units?',
      steps: ['u = b + F / Q = 12 + 6000 / Q.', 'For 20 units: 12 + 300 = 312.', 'For 500 units: 12 + 12 = 24.', 'For 10 000 units: 12 + 0.6 = 12.6.'],
      a: '312, 24 and 12.6 units. The one-off cost makes the first run twenty-six times the cost of the parts and makes almost no difference at ten thousand. The figures are invented: use your own quotes.'
    }
  ],
  quiz: [
    { q: 'Why should a BOM line carry a manufacturer part number and not only a value?', choices: ['It makes the file longer', 'It names one exact part, so the buyer cannot supply a different one', 'The assembler likes numbers', 'It is the law'], a: 1, why: '"10 k 0402" can be a dozen different parts with different tolerances, voltages and temperature ranges. A part number is exact.' },
    { q: 'Spreading fixed costs over more units makes the cost per unit...', choices: ['Rise', 'Fall, towards the variable cost', 'Stay the same', 'Become zero'], a: 1, why: 'u = b + F/Q: as Q grows, F/Q shrinks and u approaches the variable cost b, but never reaches below it.' },
    { q: 'A run costs 8 units each to build and 4000 in one-off costs. What is the unit cost for 1000 units?', choices: ['8', '12', '4008', '8.4'], a: 1, why: 'u = 8 + 4000 / 1000 = 12.' },
    { q: 'The parts total on the BOM is the cost of the product.', a: false, why: 'The board, assembly, test, the enclosure, the one-off costs of design, tooling and approvals are added, and they are often larger than the parts.' }
  ],
  applications: [
    'A purchasing department prices a build at three quantities before committing to a first batch.',
    'A maker makes a second source for each sensor and regulator so that a shortage does not stop the work.',
    'An assembler imports the BOM and the pick-and-place file to load the machines.',
    'A start-up uses the cost-per-unit curve to decide whether to move from a module to a bare chip.'
  ],
  sources: [
    'Manufacturers\' and distributors\' product pages: lifecycle status, order codes, price breaks (look up current figures there).',
    'IPC-2581 and IPC-1752, data exchange formats for board manufacturing and for material declarations.',
    'Espressif, product selection and ordering information: the part-number code of each chip and module.'
  ],
  sim: 'de-cost-stack'
},

/* ================================================================ documentation */
{
  id: 'documentation',
  parent: 'designing-a-solution',
  title: 'Documentation',
  level: 1,
  short: 'What you would need to rebuild the product from nothing: the requirements and their test results, the drawings, the bill of materials, the firmware that built the release, and notes on why. And the way to tell which design a unit in the field belongs to.',
  keywords: ['documentation', 'revision', 'version control', 'changelog', 'release', 'Gerber', 'decision record', 'hardware revision', 'serial number', 'rebuild', 'handover', 'service manual', 'traceability'],
  prereq: ['schematic-design', 'bill-of-materials-and-cost', 'readable-code'],
  related: ['versioning-and-releases', 'production-testing', 'factory-programming', 'device-configuration', 'regulatory-approval', 'reliability-in-the-field'],
  body: `Documentation is the last step of the design and the first thing anyone needs when they have to touch the product again: the person who must repair it, the one who must build five hundred more, an auditor, and you in a year. The test is simple: could someone rebuild it from nothing with only these files?

### What to keep

1. **The requirements**, with the result of each acceptance test ([[from-idea-to-requirements]]).
2. **The block diagram, the schematic** (as a PDF to read and the source to edit) and the **board files**: the manufacturing files, the assembly drawing and the pick-and-place data.
3. **The bill of materials** with part numbers and alternates.
4. **The mechanical files**: the enclosure's CAD, drawings and assembly steps.
5. **The firmware**: source in version control, the exact versions of the tools and libraries it was built with, the settings, the released image and a change log ([[versioning-and-releases]]).
6. **The test procedure**: bring-up steps, the production test and its pass limits ([[production-testing]]).
7. **The user and service notes**: installing, replacing the battery, resetting, what the LED means, safety and disposal, and the declarations of conformity with the test reports ([[regulatory-approval]]).
8. **A short log of decisions**: why the ESP32-C3, why two units, why ten minutes. Months later this is the page everyone wants.

### How

Keep it in the same repository as the code, as plain text and drawings that can be compared between versions, and write as you go: a page written the day a decision is made takes five minutes, and one reconstructed later takes a week. Tag everything that was released together.

### Tell the units apart

A unit in the field has to say which design it is. Give the board a revision letter on the silkscreen and a serial number or code; have the firmware print its version, build and hardware revision at start, and send them with every report. The hardware revision can be read by the program from a resistor pair on an analogue pin, so that firmware and board never disagree about which is which.

> [!key] Keep what would let a stranger rebuild the product: requirements and test results, drawings, the bill of materials, firmware with its tool versions, test procedures, service notes and the reasons for decisions. Label every unit and have the firmware report its own version and hardware revision.`,
  ideas: [
    'Documentation is what lets someone else, or you in a year, rebuild, repair or change the product.',
    'Keep requirements and test results, drawings, board files, the BOM, mechanical files, firmware and tools, test procedures, service notes and decisions.',
    'Store it with the code, in formats that can be compared between versions, and write it as the work is done.',
    'Every unit should identify its hardware revision and firmware version, in print and on the serial port or in each report.'
  ],
  pitfalls: [
    'I will write it up when the product is finished — By then the reasons are forgotten. A line written when a decision is made takes a minute; the same line reconstructed takes a day and is often wrong.',
    'The source files are the documentation — They are the files; the documentation says which version built which release, with which libraries, and why. Without it a project does not rebuild.',
    'A version number in the firmware is enough — It identifies the firmware, not the board. A unit with firmware 1.2.0 on hardware revision C behaves differently from the same firmware on revision A: report both.'
  ],
  terms: [
    { term: 'Revision', also: ['hardware revision', 'rev', 'board revision'], def: 'The letter or number that identifies one version of a board design, printed on the board. It changes whenever the copper, parts or layout change.' },
    { term: 'Version control', also: ['git', 'source control'], def: 'A system that records every change to a set of files, who made it and why, and lets you return to any earlier state. It is how a release is made reproducible.' },
    { term: 'Changelog', also: ['release notes', 'change log'], def: 'A dated list of what changed in each version of the firmware or the hardware, written for the person who must decide whether to update.' },
    { term: 'Gerber files', also: ['manufacturing files', 'fabrication data'], def: 'The set of files that tells a board maker what copper, holes, solder mask and text to produce, one per layer, together with a drill file.' },
    { term: 'Decision record', also: ['design log', 'architecture decision record'], def: 'A short note of one design choice: what was decided, what else was considered, and why. It stops later arguments from being repeated.' }
  ],
  choose: {
    good: ['Documents kept with the code, in text and standard drawing formats, tagged at each release', 'A hardware revision letter on the board and a way for the firmware to read it', 'A short decision log kept as the project goes on'],
    avoid: ['Writing everything up after the first customer asks', 'Documents in one person\'s email or on one person\'s computer', 'Releasing firmware that does not say which board it is on'],
    check: ['Whether a stranger could rebuild a unit using only these files', 'That each release is tagged with the firmware, the tool versions and the board revision', 'That test results exist for every requirement']
  },
  code: [
    {
      title: 'The unit says what it is: version, revision, address',
      about: 'The firmware prints its version, when it was built and which hardware revision it runs on. The revision is read from a divider on an analogue pin: 4.7 kΩ, 10 kΩ or 22 kΩ from the pin to ground, with 10 kΩ from the pin to 3.3 V, mean revision A, B or C.',
      needs: 'An ESP32-C3 board with a spare ADC1 pin (GPIO0 here) wired to the divider.',
      wiring: [['GPIO0', 'revision divider', '10 kΩ to 3V3, and 4.7 kΩ (A), 10 kΩ (B) or 22 kΩ (C) to GND']],
      blocks: `
        define hardwareRevision
          set [mv v] to (analog read pin (0) in millivolts)
          if <(mv) < (1350)> then
            set [rev v] to [A]
          else if <(mv) < (1950)> then
            set [rev v] to [B]
          else
            set [rev v] to [C]
          end

        when started
          start serial at (115200) baud
          hardwareRevision :: my
          print (join [greenhouse monitor firmware 1.2.0, hardware revision ] (rev))
          print (join [chip ] (join (chip model) (join [, MAC ] (MAC address))))
      `,
      cpp: String.raw`
        const int PIN_HW_REV = 0;                  // ADC1: the revision divider
        const char *FW_VERSION = "1.2.0";

        const char *hardwareRevision() {
          uint32_t mv = analogReadMilliVolts(PIN_HW_REV);   // A about 1055 mV, B 1650 mV, C 2270 mV
          if (mv < 1350) return "A";
          if (mv < 1950) return "B";
          return "C";
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);
          Serial.printf("greenhouse monitor firmware %s, built %s %s\n", FW_VERSION, __DATE__, __TIME__);
          Serial.printf("hardware revision %s, chip %s, MAC %012llX\n",
                        hardwareRevision(), ESP.getChipModel(), (unsigned long long)ESP.getEfuseMac());
        }

        void loop() {}
      `,
      py: String.raw`
        import sys, machine, binascii
        from machine import ADC, Pin

        PIN_HW_REV = 0                              # ADC1: the revision divider
        FW_VERSION = "1.2.0"

        def hardware_revision():
            mv = ADC(Pin(PIN_HW_REV), atten=ADC.ATTN_11DB).read_uv() // 1000   # A about 1055 mV, B 1650 mV, C 2270 mV
            if mv < 1350:
                return "A"
            if mv < 1950:
                return "B"
            return "C"

        print("greenhouse monitor firmware", FW_VERSION)
        print("hardware revision", hardware_revision(), "chip", sys.implementation._machine,
              "ID", binascii.hexlify(machine.unique_id()).decode())
      `,
      output: `
        greenhouse monitor firmware 1.2.0, built Oct  4 2026 10:12:31
        hardware revision B, chip ESP32-C3, MAC 7CDFA1B2C3D4
      `,
      notes: ['C++ knows when it was built; a Python file has no build step, so its version is the string you keep and tag in version control.', 'Use 1 % resistors and leave wide windows between the revisions, as here; send the version, revision and address with every report ([[device-configuration]]).']
    }
  ],
  examples: [
    {
      title: 'Which revision does 1650 mV mean?',
      q: 'The revision divider has 10 kΩ from the pin to 3.3 V and a resistor to ground. Calculate the voltage for the three resistor values, and choose decision thresholds.',
      steps: ['The voltage is 3.3 V x R / (10 kΩ + R).', 'For 4.7 kΩ: 3.3 x 4.7 / 14.7 = 1.055 V (revision A).', 'For 10 kΩ: 3.3 x 10 / 20 = 1.65 V (revision B).', 'For 22 kΩ: 3.3 x 22 / 32 = 2.27 V (revision C).', 'Put the thresholds half-way between neighbours: about 1.35 V and 1.95 V.'],
      a: '1650 mV is revision B. The windows are wide enough that 1 % resistors and the ADC\'s error cannot make one revision read as another.'
    }
  ],
  quiz: [
    { q: 'Which test describes good documentation?', choices: ['It is long', 'Someone could rebuild the product from nothing with only those files', 'It is in a PDF', 'It is on the company website'], a: 1, why: 'Documentation exists so that the product can be rebuilt, repaired or changed by someone who was not there. Length and format do not matter.' },
    { q: 'Why should the firmware report the hardware revision as well as its own version?', choices: ['It makes the message longer', 'The same firmware behaves differently on different boards, so a report needs both', 'The revision changes at run time', 'It is a legal rule'], a: 1, why: 'Firmware 1.2.0 on revision C is a different system from 1.2.0 on revision A. Support needs both.' },
    { q: 'When is the best time to write a decision record?', choices: ['When the product is finished', 'When the decision is made', 'When a customer complains', 'Never'], a: 1, why: 'The reasons are fresh and the note takes minutes. Reconstructed later it takes a day and is often wrong.' },
    { q: 'A divider of 10 kΩ and 10 kΩ on an ADC pin reads about what voltage on a 3.3 V supply?', choices: ['0.33 V', '1.65 V', '3.3 V', '2.2 V'], a: 1, why: 'Equal resistors halve the voltage: 3.3 V x 10 / (10 + 10) = 1.65 V.' }
  ],
  applications: [
    'A product handed to a contract manufacturer with a complete set of files for assembly and test.',
    'A field return that is identified at once by its revision letter and serial number, and repaired with the right procedure.',
    'A maintainer who joins in a year and learns from the decision log why the design is as it is.',
    'An audit or approval, in which the test reports and the declaration of conformity are asked for first.'
  ],
  sources: [
    'IPC-2581 and the Gerber format specification: how board manufacturing data is exchanged.',
    'Semantic Versioning 2.0.0 and Keep a Changelog: conventions for numbering releases and writing change notes.',
    'Arduino core for ESP32 documentation, ESP class (getChipModel, getEfuseMac); MicroPython documentation, machine.unique_id (version 1.29).'
  ]
}
);
