/* HYPER-ESP32 · content/sleep-and-low-power.js
 *
 * Sleep and low power: the power modes, deep sleep and its wake-up sources, memory that survives, why a board draws
 * far more than the chip, the low-power coprocessors, waking and sending fast, Wi-Fi power save, sleepy Bluetooth
 * and Thread devices, light sleep, and a battery budget.
 *
 * Currents of the chips come from the catalogue (sleepUa, lightUa, rxMa, txMa); the Wi-Fi modem-sleep figures
 * quoted on two pages are Espressif's own measurements from the ESP-IDF low-power guide.
 */
Hyper.add(
/* ================================================================ power-modes */
{
  id: 'power-modes',
  parent: 'sleep-and-low-power',
  title: 'Active, modem sleep, light sleep, deep sleep',
  level: 1,
  short: 'A chip has four ways of being awake or asleep, and their currents are tens of thousands of times apart. Knowing the ladder tells you where every milliamp of a battery project goes.',
  keywords: ['power modes', 'sleep modes', 'active', 'modem sleep', 'light sleep', 'deep sleep', 'sleep current', 'µA', 'low power', 'battery', 'wake-up time', 'esp_light_sleep_start', 'machine.lightsleep', 'WIFI_PS_MIN_MODEM'],
  prereq: ['chip-module-board', 'the-3v3-rail', 'rtc-domain-and-lp-core'],
  related: ['deep-sleep', 'light-sleep-and-automatic-power-management', 'wifi-power-save-and-dtim', 'the-board-is-not-the-chip', 'battery-life-budget', 'choosing-a-chip'],
  body: `A battery project is decided by one fact: the chip does not draw *a* current, it draws one of four, and they are tens of thousands of times apart. Transmitting on Wi-Fi takes a few hundred milliamps. The same chip in deep sleep takes a few microamps. The whole art of low power is to live on the bottom rung and visit the top one briefly.

### The four rungs

| Mode | What keeps running | What is lost | The program |
|---|---|---|---|
| **Active** | CPU, radio, everything | nothing | runs |
| **Modem sleep** | CPU and peripherals; the radio sleeps between beacons | nothing | runs |
| **Light sleep** | RAM, timers and the RTC; the CPU is paused | nothing | resumes on the next line |
| **Deep sleep** | the RTC timer, a little RTC memory, optionally a coprocessor | CPU, normal RAM, the radio's connection | starts again from the top |

The deeper the rung, the more is switched off, the less current flows, and the longer the wake-up takes.

### What each rung costs

The figures below are from the catalogue (the datasheets), per chip:

| Chip | Deep sleep | Light sleep | Receiving | Transmitting |
|---|---|---|---|---|
| ESP32 | 10 µA | 800 µA | 100 mA | 240 mA |
| ESP32-S3 | 7 µA | 240 µA | 91 mA | 340 mA |
| ESP32-C3 | 5 µA | 130 µA | 87 mA | 335 mA |
| ESP32-C6 | 7 µA | 180 µA | 82 mA | 354 mA |
| ESP32-H2 | 7 µA | 85 µA | 25 mA | 140 mA |

Across the chips of the family, transmitting draws between about twelve thousand times (ESP32-S2) and seventy-four thousand times (ESP32-C2) what deep sleep does. The simulation below draws every chip's four bars on a logarithmic axis, so a hundredfold difference is one grid line.

### Modem sleep: the rung in between

Modem sleep leaves the processor running and switches off only the radio, between the beacons a connected Wi-Fi station must hear. It happens by itself once connected. The catalogue holds a modem-sleep figure only for the ESP32-C2 (9 to 15 mA). Espressif's own measurements on a C3 board show about 21 mA in modem sleep, about 11 mA with the clock throttled, and 0.3 to 1.4 mA with automatic light sleep: the running processor, not the idle radio, is what costs ([[wifi-power-save-and-dtim]]).

### Choosing the rung

- **Seconds or less between jobs:** stay active, or in modem sleep if connected.
- **A wait that must keep its place and wake in a moment:** light sleep ([[light-sleep-and-automatic-power-management]]).
- **Minutes or more between jobs:** deep sleep ([[deep-sleep]]). A restart costs a fraction of a second of tens of milliamps; once the wait is a couple of minutes, deep sleep's saving outweighs it.

### The trap

These are figures for the chip alone. A development board adds a regulator, a USB chip and an LED that keep drawing ([[the-board-is-not-the-chip]]).

> [!key] A chip has four rungs — active, modem sleep, light sleep, deep sleep — whose currents differ by tens of thousands of times. Battery life is living on the bottom rung and visiting the top one briefly.`,
  ideas: [
    'Active, modem sleep, light sleep and deep sleep each switch off more of the chip, save more current and take longer to wake from.',
    'Transmitting draws between twelve thousand and seventy-four thousand times the deep-sleep current of the same chip (for the family in the catalogue).',
    'Light sleep keeps RAM and carries on at the next line; deep sleep forgets everything but a little RTC memory and restarts the program.',
    'Modem sleep happens by itself for a connected station, but it saves only the radio: the processor keeps drawing.'
  ],
  pitfalls: [
    'A connected Wi-Fi device is automatically low power — Modem sleep switches off the radio between beacons, but the CPU keeps running at tens of milliamps. Only light sleep or deep sleep, called or configured, reach microamps.',
    'delay() puts the chip to sleep — It only waits: the processor idles but stays powered, and the chip keeps drawing its tens of milliamps. Sleeping needs the sleep calls.',
    'The datasheet says 5 µA, so the battery will last for years — That is the bare chip with only its RTC timer running. The board and the battery add far more ([[the-board-is-not-the-chip]]).'
  ],
  terms: [
    { term: 'Power mode', also: ['sleep mode', 'low-power mode'], def: 'One of the states a chip can be in, from fully active to deep sleep. Each switches off more circuits, draws less current and takes longer to wake from.' },
    { term: 'Modem sleep', also: ['Wi-Fi power save', 'WIFI_PS_MIN_MODEM'], def: 'A state in which the processor keeps running but the radio is switched off between the beacons that a connected Wi-Fi station must listen to.' },
    { term: 'Sleep current', also: ['standby current', 'quiescent current'], def: 'The current a device draws while asleep. For a chip it is the datasheet figure; for a board it is what a meter in series with the battery shows, and it is almost always higher.' },
    { term: 'Wake-up time', also: ['wake latency', 'resume time'], def: 'The time from the event that wakes the chip to the program running again: microseconds to milliseconds from light sleep, a few hundred milliseconds from deep sleep, which restarts the whole program.' }
  ],
  code: [
    {
      title: 'Nap in light sleep, keep the variable',
      about: 'The loop sleeps for five seconds in light sleep, then carries on from the very next line. The counter is an ordinary variable: light sleep keeps RAM, so no special storage is needed (deep sleep would lose it).',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          set [naps v] to (0)
        forever
          change [naps v] by (1)
          print (join [nap ] (naps))
          light sleep for (5) seconds :: power
          print [awake again, the program carries on from the same line]
        end
      `,
      cpp: String.raw`
        int naps = 0;                                   // an ordinary variable: light sleep keeps RAM

        void setup() {
          Serial.begin(115200);
          delay(500);
        }

        void loop() {
          naps++;
          Serial.printf("nap %d: light sleep for 5 s\n", naps);
          Serial.flush();                               // let the text leave before the chip pauses
          esp_sleep_enable_timer_wakeup(5ULL * 1000000ULL);   // microseconds, 64-bit
          esp_light_sleep_start();                      // returns after the wake-up
          Serial.println("awake again, the program carries on from the same line");
        }
      `,
      py: String.raw`
        import machine

        naps = 0                                        # an ordinary variable: light sleep keeps RAM
        while True:
            naps += 1
            print("nap", naps, ": light sleep for 5 s")
            machine.lightsleep(5000)                    # milliseconds; returns after the wake-up
            print("awake again, the program carries on from the same line")
      `,
      output: `
        nap 1: light sleep for 5 s
        awake again, the program carries on from the same line
        nap 2: light sleep for 5 s
        awake again, the program carries on from the same line
      `,
      notes: ['On a board with native USB the serial port may drop while the chip sleeps and come back afterwards; measure the current with a meter rather than watching the monitor.', 'This saves the processor\'s current only while it sleeps: the board\'s other parts keep drawing ([[the-board-is-not-the-chip]]).']
    }
  ],
  examples: [
    {
      title: 'Light sleep or deep sleep between readings?',
      q: 'An ESP32-C3 sensor must take a reading every 5 minutes. Light sleep draws 130 µA, deep sleep 5 µA. A restart from deep sleep costs about 0.3 s at 40 mA more than waking from light sleep would. Which wins, and from what wait onwards?',
      steps: ['Deep sleep saves $130 - 5 = 125$ µA, that is 0.125 mA, for the whole wait.', 'The restart costs $40 \\text{ mA} \\times 0.3 \\text{ s} = 12$ mA·s each time.', 'Break-even is where the saving over the wait $T$ equals that cost: $0.125 \\cdot T = 12$, so $T \\approx 96$ s.', 'For a 300 s wait the saving is $0.125 \\times 300 = 37.5$ mA·s against a 12 mA·s cost: deep sleep wins by about three to one.'],
      a: 'Deep sleep, for any wait longer than about a minute and a half. Below that, light sleep is cheaper — and it keeps the variables and the connection state.'
    }
  ],
  quiz: [
    { q: 'Which power mode loses the contents of normal RAM and starts the program again from the top when the chip wakes?', choices: ['Modem sleep', 'Light sleep', 'Deep sleep', 'Active mode'], a: 2, why: 'Deep sleep switches off the CPU and the main RAM; only a little RTC memory stays powered. Light sleep pauses the CPU but keeps RAM, so the program resumes where it stopped.' },
    { q: 'A connected Wi-Fi station is in modem sleep. What is switched off between beacons?', choices: ['The processor', 'The radio', 'The RAM', 'The flash memory'], a: 1, why: 'Modem sleep powers down only the radio (the "modem"). The processor and the peripherals keep running, which is why modem sleep alone still draws tens of milliamps.' },
    { q: 'An ESP32-C3 transmits continuously from an 800 mAh usable battery, drawing the catalogue\'s 335 mA. About how long does the battery last?', choices: ['About 2.4 hours', 'About 24 hours', 'About 10 days', 'About 3 months'], a: 0, why: '$800 \\text{ mAh} / 335 \\text{ mA} \\approx 2.4$ h. Transmitting is the most expensive thing the chip does; a battery device transmits for fractions of a second, rarely.' },
    { q: 'Because the datasheet gives 5 µA for deep sleep, a board built on that chip will draw about 5 µA from its battery.', a: false, why: 'The datasheet figure is the chip alone. The board\'s regulator, USB-serial chip, LED and other parts are often 10 to 1000 times larger.' }
  ],
  applications: [
    'A button remote or door sensor sleeps in deep sleep for months and wakes only when something happens.',
    'A smart plug stays connected in modem sleep or automatic light sleep so that it answers a command within a fraction of a second.',
    'A weather station wakes every ten minutes, reads, sends and sleeps again.',
    'An always-listening voice device stays active: the processor must keep sampling the microphone.'
  ],
  sources: [
    'Espressif, *ESP32-C3 Series Datasheet*, current consumption: the same section of the ESP32, ESP32-S3, ESP32-C6 and ESP32-H2 datasheets.',
    'Espressif, *ESP-IDF Programming Guide*, "Sleep Modes" (API reference) and "Low Power Mode in Wi-Fi Scenarios" (API guides).',
    'MicroPython documentation, *machine* library: lightsleep() and deepsleep().'
  ],
  sim: 'sl-power-modes'
},

/* ================================================================ deep-sleep */
{
  id: 'deep-sleep',
  parent: 'sleep-and-low-power',
  title: 'Deep sleep',
  level: 1,
  short: 'Deep sleep switches off almost the whole chip and leaves a clock running. The program ends; when the clock rings the chip starts again from the top. It is how a battery sensor lasts for months.',
  keywords: ['deep sleep', 'esp_deep_sleep_start', 'machine.deepsleep', 'esp_sleep_enable_timer_wakeup', 'timer wake-up', 'RTC_DATA_ATTR', 'boot count', 'wake-up cause', 'battery sensor', 'restart', 'average current', 'duty cycle'],
  prereq: ['power-modes', 'setup-loop-and-main'],
  related: ['wake-up-sources', 'rtc-memory', 'the-board-is-not-the-chip', 'fast-wifi-reconnect', 'battery-life-budget', 'reset-reasons'],
  body: `Deep sleep is a switch-off with an alarm clock. When the program calls it, the chip stops: the processor cores, the main RAM, the radio and most peripherals lose power. Only a slow timer, a few kilobytes of RTC memory and the circuits that watch the wake-up sources stay alive, together drawing a few microamps. When the alarm rings the chip does not continue: it **restarts**, and \`setup()\` runs again from the first line.

### The shape of a deep-sleep program

Every deep-sleep program has the same four steps:

1. **Wake** and look at why ([[wake-up-sources]]).
2. **Work**: read the sensor, send the reading.
3. **Arm** the next wake-up: a timer, a pin.
4. **Sleep.** There is no \`loop()\`: in Arduino it is empty because it is never reached, in MicroPython the program simply ends in \`machine.deepsleep()\`.

Because RAM is gone, anything the next run needs must be kept somewhere that survives: [[rtc-memory|RTC memory]] for a counter or the last few readings, flash for what must survive a dead battery.

### What it costs, and the number that matters

The sleep current from the catalogue: 5 µA (ESP32-C3, C2), 7 µA (ESP32-S3, C6, H2), 10 µA (ESP32), 12 µA (C5, P4), 25 µA (S2). But those are not what decides the battery. The **awake time** does, because awake current is thousands of times larger:

$$I_{avg} = \\frac{I_a\\,t_a + I_s\\,(T - t_a)}{T}$$

A C3 that is awake 3.5 s at 87 mA every 10 minutes and sleeps at 5 µA averages 0.51 mA, and **99 % of its charge goes in the 3.5 seconds awake**. Halving the sleep current would save half a percent; cutting the awake time to 0.8 s brings the average down to about a quarter, 0.12 mA ([[fast-wifi-reconnect]]). Try it in the calculator below, then in the simulation.

### Things deep sleep takes away

- **The connection.** Wi-Fi and Bluetooth are off after the wake: you connect again, every time.
- **The timer is not exact.** It runs from a slow internal oscillator accurate to a few per cent: a "10 minute" sleep may last 9½ or 10½ minutes. If wall-clock time matters, ask the network for the time after each wake ([[ntp-and-time]]).
- **Native USB.** On boards where USB is built into the chip the serial port vanishes in sleep and returns at the wake; the monitor may need to reconnect, and the first lines of output can be lost.
- **Pin states.** Outputs revert unless held; see [[the-board-is-not-the-chip]].

> [!key] Deep sleep ends the program and restarts it from the top when a wake-up source fires; only RTC memory survives. Battery life is decided less by the 5 µA asleep than by the seconds awake — shorten those first.`,
  ideas: [
    'Deep sleep powers down the cores, the main RAM and the radio; only a timer, a little RTC memory and the wake-up circuits stay on.',
    'The chip restarts on every wake: setup() runs again, ordinary variables are lost, and the program asks why it woke.',
    'A deep-sleep program wakes, works, arms the next wake-up and sleeps — with no loop().',
    'Average current is dominated by the time awake, not the sleep current: cut the seconds awake first.'
  ],
  pitfalls: [
    'A counter in my sketch keeps counting across deep sleep — Normal variables are lost: after the wake the program starts again and the counter is back at its initial value. Only RTC memory (or flash) survives.',
    'A lower sleep current is the way to a longer battery life — Check the budget first: with a few seconds awake per cycle the awake charge is usually more than 90 % of the total, and the sleep current barely matters.',
    'The code after esp_deep_sleep_start() runs when the chip wakes — It never runs: the call does not return. The chip wakes into a fresh start of the program.'
  ],
  terms: [
    { term: 'Deep sleep', also: ['esp_deep_sleep_start', 'machine.deepsleep'], def: 'The lowest-power state in which the chip still keeps time and can wake itself. Cores, main RAM and radio are off; the program restarts from the beginning when a wake-up source fires.' },
    { term: 'Wake-up source', also: ['wake source', 'wake-up trigger'], def: 'The event that ends a sleep: a timer reaching its time, a pin changing level, a touch pad, or a low-power coprocessor deciding something happened. Several can be armed at once.' },
    { term: 'Duty cycle', also: ['awake fraction'], def: 'The fraction of time a device spends awake. A sensor awake 3.5 s in every 600 s has a duty cycle of about 0.6 %.' },
    { term: 'Average current', also: ['mean current', 'I avg'], def: 'The total charge drawn in one cycle divided by the length of the cycle: the number that, with the capacity, sets how long a battery lasts.' },
    { term: 'RTC timer', also: ['RTC slow clock', 'sleep timer'], def: 'The low-frequency timer in the RTC domain that keeps running in deep sleep and wakes the chip. It is not crystal-accurate unless a 32 kHz crystal is fitted.' }
  ],
  choose: {
    good: ['A reading every few minutes or hours, then sleep', 'A device that wakes on a button, a sensor edge or a door opening', 'Anything on a small battery or a solar cell'],
    avoid: ['A web server, a live display or anything that must answer at once', 'Jobs only a few seconds apart: the restart costs more than the sleep saves', 'Programs that keep their state only in normal RAM'],
    check: ['What the whole board draws asleep, measured with a meter', 'How long the program is awake each cycle, from wake to sleep', 'Where the state lives across the restart']
  },
  code: [
    {
      title: 'Sleep for ten seconds, count the wake-ups',
      about: 'The program counts its starts in RTC memory, prints why it woke, arms a ten-second timer and sleeps. Watch the counter climb and the reason change from "power-on" to "timer".',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          set [count v] to ((load [bootcount]) + (1))
          save (count) as [bootcount]
          print (join [boot #] (count))
          print (join [woken by: ] (wake-up reason))
          deep sleep for (10) seconds
      `,
      cpp: String.raw`
        RTC_DATA_ATTR int bootCount = 0;               // survives deep sleep (RTC memory), lost on a power cycle

        void printWakeReason() {
          switch (esp_sleep_get_wakeup_cause()) {
            case ESP_SLEEP_WAKEUP_TIMER:    Serial.println("timer");  break;
            case ESP_SLEEP_WAKEUP_EXT0:     Serial.println("ext0");   break;
            case ESP_SLEEP_WAKEUP_EXT1:     Serial.println("ext1");   break;
            case ESP_SLEEP_WAKEUP_TOUCHPAD: Serial.println("touch");  break;
            case ESP_SLEEP_WAKEUP_ULP:      Serial.println("ulp");    break;
            default:                        Serial.println("power-on / reset"); break;
          }
        }

        void setup() {
          Serial.begin(115200);
          delay(500);
          Serial.printf("boot #%d\n", ++bootCount);
          printWakeReason();
          esp_sleep_enable_timer_wakeup(10ULL * 1000000ULL);   // microseconds, 64-bit
          Serial.flush();                                       // let the text leave first
          esp_deep_sleep_start();                               // never returns: the chip restarts into setup()
        }

        void loop() {}
      `,
      py: String.raw`
        import machine, time
        from machine import RTC

        rtc = RTC()
        count = int.from_bytes(rtc.memory() or b"\x00", "little") + 1   # RTC memory survives deep sleep
        rtc.memory(count.to_bytes(2, "little"))
        print("boot #%d" % count)

        if machine.reset_cause() == machine.DEEPSLEEP_RESET:
            print("woken from deep sleep, wake reason", machine.wake_reason())
        else:
            print("power-on / reset")

        time.sleep_ms(100)                                  # let the text leave first
        machine.deepsleep(10_000)                           # milliseconds; the board restarts into main.py
      `,
      output: `
        boot #1
        power-on / reset
        boot #2
        timer
        boot #3
        timer
      `,
      notes: ['In Arduino the cause comes as a named constant; MicroPython gives machine.reset_cause() for "was it a deep-sleep wake?" and machine.wake_reason() for which source.', 'With IDF 6.1 esp_sleep_get_wakeup_cause() is deprecated for a bitmask version, esp_sleep_get_wakeup_causes(); the older call still compiles on the Arduino core 3.3.', 'A power cycle (unplugging the board) clears RTC memory, so the count starts from 1 again.']
    }
  ],
  examples: [
    {
      title: 'Where does the charge go?',
      q: 'An ESP32-C3 wakes every 10 minutes, is awake 3.5 s at 87 mA, and sleeps at 5 µA. What is its average current, and how much of the charge goes while awake?',
      steps: ['Awake: $87 \\text{ mA} \\times 3.5 \\text{ s} = 304.5$ mA·s.', 'Asleep: $0.005 \\text{ mA} \\times 596.5 \\text{ s} = 2.98$ mA·s.', 'Total per cycle $307.5$ mA·s over 600 s gives $I_{avg} = 0.5125$ mA.', 'The awake share is $304.5 / 307.5 = 99$ %. Doubling the awake time doubles the average; halving the 5 µA changes it by half a per cent.'],
      a: 'About 0.51 mA, and 99 % of the charge is spent in the 3.5 seconds awake — so shorten the awake time before anything else.'
    }
  ],
  formulas: [
    {
      name: 'Average current of a sleeping device',
      expr: 'I = (Ia*ta + Is*(T - ta))/T',
      tex: 'I_{\\mathrm{avg}} = \\frac{I_{\\mathrm{a}}\\,t_{\\mathrm{a}} + I_{\\mathrm{s}}\\,(T - t_{\\mathrm{a}})}{T}',
      vars: {
        I: { name: 'average current', q: 'current', unit: 'mA', tex: 'I_{\\mathrm{avg}}' },
        Ia: { name: 'current while awake', q: 'current', unit: 'mA', value: 87, tex: 'I_{\\mathrm{a}}' },
        ta: { name: 'time awake in each cycle', q: 'time', unit: 's', value: 3.5, tex: 't_{\\mathrm{a}}' },
        Is: { name: 'current while asleep', q: 'current', unit: 'µA', value: 5, tex: 'I_{\\mathrm{s}}' },
        T: { name: 'length of one cycle (awake plus asleep)', q: 'time', unit: 'min', value: 10 }
      },
      solveFor: 'I',
      note: 'Valid when the cycle repeats and the awake time is shorter than the cycle. Use the current measured on the whole board, not the chip alone.',
      stories: { I: 'A sensor draws {Ia} for {ta} in each cycle and {Is} while asleep. The cycle repeats every {T}. What is its average current?' }
    }
  ],
  quiz: [
    { q: 'What happens to the line after `esp_deep_sleep_start();` in `setup()`?', choices: ['It runs when the chip wakes', 'It runs immediately, then the chip sleeps', 'It never runs: the call does not return', 'It runs only on a timer wake-up'], a: 2, why: 'Deep sleep ends the program. On waking the chip restarts into the beginning of setup(), so the line after the call is never reached.' },
    { q: 'A global `int count = 0;` is incremented before each deep sleep. What does it hold after the wake?', choices: ['The incremented value', 'Its initial value, 0', 'A random value', 'The value plus one more'], a: 1, why: 'Normal RAM is lost in deep sleep and the program starts again from the top, so the variable is back at 0. Marking it `RTC_DATA_ATTR` (or using RTC().memory() in MicroPython) keeps it.' },
    { q: 'A sensor is awake 3.5 s in each 600 s cycle. Which saves more battery: halving the sleep current from 5 µA to 2.5 µA, or shortening the awake time by half a second?', choices: ['Halving the sleep current', 'Shortening the awake time', 'They save the same', 'Neither changes anything'], a: 1, why: 'Half a second at 87 mA is 43.5 mA·s per cycle; halving the sleep current saves about $0.0025 \\times 596 \\approx 1.5$ mA·s. The awake time is thirty times more valuable.' },
    { q: 'On a board with native USB, the serial monitor shows nothing while the chip is in deep sleep.', a: true, why: 'The USB peripheral is off in deep sleep, so the port disappears from the computer and returns at the wake. Measure the sleep current with a meter instead of expecting output.' }
  ],
  applications: [
    'Temperature and humidity loggers that send a reading every few minutes for a season on one cell.',
    'Door, window and mailbox sensors that sleep for months and wake on the contact.',
    'Doorbells and remotes that wake on a button, send one message and sleep again.',
    'Solar-powered garden sensors that wake when the sun has charged the cell.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "Sleep Modes": deep sleep, wake-up sources and RTC memory.',
    'Arduino core for ESP32 documentation and the DeepSleep examples (TimerWakeUp, ExternalWakeUp, TouchWakeUp).',
    'MicroPython documentation, *Quick reference for the ESP32*, "Deep-sleep mode".'
  ],
  sim: 'sl-cycle'
},

/* ================================================================ wake-up-sources */
{
  id: 'wake-up-sources',
  parent: 'sleep-and-low-power',
  title: 'Wake-up sources',
  level: 2,
  short: 'A sleeping chip needs something to wake it: its timer, a pin changing level, a touched pad, or a coprocessor that has been watching a sensor. Each has its limits — which pins, which chips, how much listening costs.',
  keywords: ['wake-up source', 'ext0', 'ext1', 'GPIO wake-up', 'touch wake-up', 'timer wake-up', 'ULP wake-up', 'esp_sleep_enable_ext1_wakeup_io', 'esp_sleep_get_wakeup_cause', 'wake_on_ext0', 'wake_on_ext1', 'wake_reason', 'RTC GPIO', 'button wake', 'ANY_HIGH', 'ALL_LOW'],
  prereq: ['deep-sleep', 'pull-ups-and-pull-downs', 'input-only-and-special-pins'],
  related: ['light-sleep-and-automatic-power-management', 'touch-pins', 'ulp-and-lp-coprocessors', 'buttons-and-switches', 'interrupts', 'reset-reasons'],
  body: `A chip in deep sleep is deaf to everything except the few things it was told to listen for. Choosing those is the other half of a sleep program: the **clock** (wake in ten minutes), the **doorbell** (a pin changes level), the **touch** (a finger on a pad) and the **night watchman** (a coprocessor decided something happened). Several can be armed at once; whichever comes first wins.

### The sources, and which chip has what

| Source | Wakes when | Chips (deep sleep) |
|---|---|---|
| **Timer** | a set time has passed | all |
| **ext0** | one RTC pin reaches a level | ESP32, S2, S3 |
| **ext1** | any of several RTC pins goes high (or low) | ESP32, S2, S3, C6, H2 |
| **GPIO** | a listed pin reaches a level | ESP32-C3 (GPIO0–5), ESP32-C6 (GPIO0–7) |
| **Touch** | a touch pad's reading changes | ESP32 (several pads), S2 and S3 (one pad) |
| **Coprocessor** | the ULP or LP program decides | chips with one: [[ulp-and-lp-coprocessors]] |

On the original ESP32 the ext1 mode "all selected pins low" exists; on every other chip the mode is "any pin low". On the original ESP32, ext0 cannot be combined with touch or ULP wake-up.

### Which pins can wake the chip

Only pins in the always-powered RTC domain can: ESP32 GPIO0, 2, 4, 12–15, 25–27 and 32–39; ESP32-S2 and S3 GPIO0–21; ESP32-C3 GPIO0–5; ESP32-C6 GPIO0–7; ESP32-H2 GPIO8–14 (check the programming guide for your chip). The pin planner marks them. Light sleep is easier: any GPIO can wake it ([[light-sleep-and-automatic-power-management]]).

### The pin's resting level

A wake pin must never float, or the noise on it wakes the chip at random. For "wake on high" wire the button from the pin to 3.3 V and a 10 kΩ resistor to ground; for "wake on low", the button to ground and a pull-up. A resistor to a pin costs nothing until the button is pressed. Internal pulls work in sleep only while the RTC domain stays powered or the pin is held, and GPIO34–39 of the ESP32 have no internal pulls at all, so fit resistors ([[pull-ups-and-pull-downs]]).

### Knowing why you woke

Ask first thing. The wake-up cause is a named constant, and for ext1 a bit mask tells which pin. Then deal with two button traps: the contact is still bouncing when the program starts, and **a level source fires again at once if the pin is still at the wake level** when you go back to sleep. Wait for the release first.

> [!key] A sleeping chip listens only to the sources you armed: timer, an RTC pin (ext0 or ext1, or GPIO on the C3), a touch pad, or a coprocessor. Use a pin from the chip's RTC list, give it a defined resting level, read the cause on waking, and never sleep while the button is still held.`,
  ideas: [
    'Deep sleep wakes on a timer, an RTC pin (ext0, ext1 or the C3\'s GPIO wake), a touch pad, or a coprocessor.',
    'Only RTC-domain pins can wake from deep sleep, and the list differs per chip: GPIO0–5 on the C3, GPIO32–39 among others on the ESP32.',
    'A wake pin needs a defined resting level: an external pull-up or pull-down, because the pins that float wake the chip at random.',
    'Read the wake-up cause first, and do not go back to sleep while the pin still holds the wake level.'
  ],
  pitfalls: [
    'Any GPIO can wake the chip from deep sleep — Only the RTC pins can; light sleep is the one where any GPIO works. Check the chip\'s list before choosing the pin.',
    'ext1 wakes on "all pins low" on every chip — That mode exists only on the original ESP32; the newer chips offer "any low" and "any high".',
    'The internal pull-up keeps my button pin high in sleep — The internal pulls need the RTC peripheral domain powered (or the pin held), and the ESP32\'s input-only pins GPIO34–39 have none: use an external resistor.'
  ],
  terms: [
    { term: 'ext0', also: ['external wake-up 0', 'esp_sleep_enable_ext0_wakeup'], def: 'A wake-up source that watches one RTC pin for one level. It uses the RTC IO logic and keeps the RTC peripheral domain powered. Present on the ESP32, S2 and S3.' },
    { term: 'ext1', also: ['external wake-up 1', 'esp_sleep_enable_ext1_wakeup_io'], def: 'A wake-up source that watches several RTC pins named by a bit mask and wakes when any goes high (or low). It works even when the RTC peripherals are off, because the RTC controller watches the pins.' },
    { term: 'RTC GPIO', also: ['RTC pin', 'RTC IO'], def: 'A pin that stays connected to the always-on RTC domain, so it can wake the chip from deep sleep and be read by a coprocessor. The list differs per chip.' },
    { term: 'Wake-up cause', also: ['wake reason', 'esp_sleep_get_wakeup_cause', 'machine.wake_reason'], def: 'The record of which source ended the last sleep: timer, ext0, ext1, touch pad, ULP and so on. A program reads it at the start to choose what to do.' },
    { term: 'Touch wake-up', also: ['touchSleepWakeUpEnable', 'touch pad wake'], def: 'A wake-up when a capacitive touch pad\'s reading crosses a threshold, so a finger can wake the chip from deep sleep. The original ESP32 can arm several pads, the S2 and S3 one.' }
  ],
  choose: {
    good: ['Timer for a schedule, plus one pin source for events that cannot wait', 'ext1 for several buttons or contacts on one chip, with the mask telling which one', 'A coprocessor for "wake me only if the reading crosses a level"'],
    avoid: ['A floating pin or a pin with only an internal pull in deep sleep', 'A strapping pin as the wake pin if the button holds it at the wrong level at reset', 'Sleeping again while the wake level is still present'],
    check: ['That the pin is in your chip\'s RTC list', 'The resting level of the pin during sleep, with a meter or scope', 'The wake-up cause the program prints for each source']
  },
  code: [
    {
      title: 'Two buttons and a timer: who woke me?',
      about: 'Either button wakes the chip from deep sleep, and so does a minute of silence. On every start the program says what woke it, and for a button which one. It waits for the button to be released before sleeping, or the chip would wake again at once.',
      needs: 'An original ESP32 DevKit, two push buttons and two 10 kΩ resistors.',
      wiring: [['GPIO32', 'button A → 3.3 V', '10 kΩ from the pin to GND keeps it low'], ['GPIO33', 'button B → 3.3 V', '10 kΩ from the pin to GND keeps it low']],
      blocks: `
        when started
          start serial at (115200) baud
          if <(wake-up reason) = [timer v]> then
            print [timer, nobody pressed anything]
          else if <(wake-up reason) = [pin v]> then
            print (join [button on pin ] (pin that woke the chip))
          else
            print [power-on or reset]
          end
          wait until <not <<(read pin (32)) = [HIGH v]> or <(read pin (33)) = [HIGH v]>>>
          enable wake on pin (32) or pin (33) when high :: power
          deep sleep for (60) seconds
      `,
      cpp: String.raw`
        const gpio_num_t BTN_A = GPIO_NUM_32;           // RTC pins of the original ESP32
        const gpio_num_t BTN_B = GPIO_NUM_33;

        void setup() {
          Serial.begin(115200);
          delay(500);
          switch (esp_sleep_get_wakeup_cause()) {
            case ESP_SLEEP_WAKEUP_EXT1: {
              uint64_t mask = esp_sleep_get_ext1_wakeup_status();   // bit n set = GPIOn woke the chip
              Serial.printf("button on GPIO%d\n", (mask & (1ULL << BTN_A)) ? (int)BTN_A : (int)BTN_B);
              break;
            }
            case ESP_SLEEP_WAKEUP_TIMER: Serial.println("timer, nobody pressed anything"); break;
            default:                     Serial.println("power-on or reset"); break;
          }

          pinMode(BTN_A, INPUT);                        // the external 10 k resistors hold both pins low
          pinMode(BTN_B, INPUT);
          while (digitalRead(BTN_A) || digitalRead(BTN_B)) delay(10);   // wait for release, or the chip wakes at once

          esp_sleep_enable_ext1_wakeup_io((1ULL << BTN_A) | (1ULL << BTN_B), ESP_EXT1_WAKEUP_ANY_HIGH);
          esp_sleep_enable_timer_wakeup(60ULL * 1000000ULL);   // and a minute of silence
          Serial.flush();
          esp_deep_sleep_start();
        }

        void loop() {}
      `,
      py: String.raw`
        import machine, esp32, time
        from machine import Pin

        BTN_A = Pin(32, Pin.IN)                         # RTC pins of the original ESP32
        BTN_B = Pin(33, Pin.IN)                         # the external 10 k resistors hold both pins low

        if machine.reset_cause() == machine.DEEPSLEEP_RESET:
            if machine.wake_reason() == machine.TIMER_WAKE:
                print("timer, nobody pressed anything")
            else:
                print("woken by:", machine.wake_pins())     # which pin or pins
        else:
            print("power-on or reset")

        while BTN_A.value() or BTN_B.value():           # wait for release, or the chip wakes at once
            time.sleep_ms(10)

        esp32.wake_on_ext1(pins=(BTN_A, BTN_B), level=esp32.WAKEUP_ANY_HIGH)
        machine.deepsleep(60_000)                       # and a minute of silence
      `,
      output: `
        power-on or reset
        button on GPIO33
        timer, nobody pressed anything
      `,
      notes: ['On an ESP32-C3 the same job is done with esp_deep_sleep_enable_gpio_wakeup(1ULL << 4, ESP_GPIO_WAKEUP_GPIO_LOW) on GPIO0–5 (the name is for ESP-IDF 5.5; IDF 6.1 renames it).', 'For a single pin, esp_sleep_enable_ext0_wakeup(pin, level) and esp32.wake_on_ext0() do the same on the ESP32, S2 and S3, with the pull resistors set through the RTC functions.', 'machine.wake_pins() is new in MicroPython 1.29; on older versions look at which pin reads high.']
    }
  ],
  examples: [
    {
      title: 'Choosing a wake pin on a C3',
      q: 'A door sensor on an ESP32-C3 has its reed switch on GPIO8 and a spare pin GPIO3. Which can be the wake pin, and how should the switch be wired so that opening the door wakes the chip?',
      steps: ['On the C3 only GPIO0–5 can wake from deep sleep, so GPIO8 is out and GPIO3 is the choice.', 'GPIO8 is also a strapping pin, which is one more reason to keep it free.', 'A reed switch that is closed when the door is shut and open when it opens: pull GPIO3 up to 3.3 V through 100 kΩ and run the switch from the pin to ground. Closed, the pin is low; opening releases it to high.', 'Arm "wake on high": esp_deep_sleep_enable_gpio_wakeup(1ULL << 3, ESP_GPIO_WAKEUP_GPIO_HIGH). While the door is shut the switch carries 33 µA through the 100 kΩ; open, nothing flows.'],
      a: 'Use GPIO3, pulled up with 100 kΩ, switch to ground, wake on high. A larger resistor, 1 MΩ, cuts the 33 µA while closed to 3 µA.'
    }
  ],
  quiz: [
    { q: 'On an ESP32-C3, which pin can wake the chip from deep sleep?', choices: ['GPIO8', 'GPIO12', 'GPIO3', 'GPIO18'], a: 2, why: 'The C3\'s deep-sleep wake-up pins are GPIO0 to GPIO5. GPIO8 is a strapping pin and GPIO18 belongs to the USB port.' },
    { q: 'You armed ext1 with "any high" on a button wired from the pin to 3.3 V, and the board wakes again the moment it goes to sleep with the button held. Why?', choices: ['The timer is too short', 'The wake source is level-triggered and the pin is still at the wake level', 'ext1 only works once', 'RTC memory was erased'], a: 1, why: 'A level source fires whenever the pin is at the armed level. Wait for the release before sleeping, or arm the opposite level once the pin has gone back.' },
    { q: 'Why is an external resistor advised on a wake pin of the original ESP32?', choices: ['Internal pull resistors work in sleep only if the RTC domain stays powered, and GPIO34–39 have none', 'The chip has no resistors at all', 'Resistors speed up the wake-up', 'ext1 needs 1 MΩ'], a: 0, why: 'The internal pulls depend on the RTC peripheral domain (or a hold) and the input-only pins have none. An external resistor works in every case and costs no current until the button is pressed.' },
    { q: 'On every ESP32-family chip ext1 can wake on "all selected pins low".', a: false, why: 'The "all low" mode exists only on the original ESP32. The newer chips offer "any low" and "any high".' }
  ],
  applications: [
    'Door and window sensors that wake on a reed switch and report once.',
    'Remote controls and buzzers: a button press wakes the chip, which sends a message.',
    'Capacitive touch buttons that wake an otherwise sleeping gadget.',
    'A sensor with a threshold output (a PIR, a vibration switch) that wakes the chip only on an event.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "Sleep Modes": wake-up sources, RTC GPIO lists, ext0 and ext1.',
    'Arduino core for ESP32, DeepSleep examples ExternalWakeUp and TouchWakeUp.',
    'MicroPython documentation, *esp32* library: wake_on_ext0, wake_on_ext1, wake_on_touch; *machine* library: wake_reason.'
  ],
  sim: 'sl-wake-sources'
},

/* ================================================================ rtc-memory */
{
  id: 'rtc-memory',
  parent: 'sleep-and-low-power',
  title: 'Memory that survives deep sleep',
  level: 2,
  short: 'Deep sleep wipes ordinary RAM, but a few kilobytes of RTC memory stay powered. That is where a counter, a batch of readings or the remembered Wi-Fi channel can wait for the next wake-up.',
  keywords: ['RTC memory', 'RTC_DATA_ATTR', 'RTC_NOINIT_ATTR', 'RTC().memory', 'LP memory', 'RTC slow memory', 'RTC fast memory', 'survive deep sleep', 'boot counter', 'batching', 'retention', 'NVS', 'flash wear'],
  prereq: ['deep-sleep', 'memory-map', 'variables-and-types'],
  related: ['fast-wifi-reconnect', 'nvs-and-preferences', 'flash-wear', 'reset-reasons', 'rtc-domain-and-lp-core', 'ulp-and-lp-coprocessors'],
  body: `When the chip wakes from deep sleep the program starts again, so every ordinary variable is gone. What survives is a small block of memory that stays powered through the sleep: **RTC memory** (on the ESP32-C6 and H2 it is called LP memory). A counter, the last few readings, the remembered Wi-Fi channel: anything small that the next run needs can wait there.

### Where data can live

| Place | Survives deep sleep | Survives a dead battery | Size | Limit |
|---|---|---|---|---|
| Normal RAM | no | no | hundreds of KB | none |
| RTC memory | yes | no | 4 to 32 KB | none |
| Flash (NVS, files) | yes | yes | megabytes | about 100 000 erases per sector |

The catalogue gives 16 KB of RTC memory for the ESP32, S2, S3, C6 and C5; 8 KB for the C3; 4 KB for the H2; 32 KB for the P4 and S31, and no figure for the C2 and C61. MicroPython offers one 2048-byte block, \`RTC().memory()\`.

### Using it

In Arduino C++ write \`RTC_DATA_ATTR\` in front of a global. It keeps its value through deep sleep and starts from its initial value at power-on, and also after any reset that is not a deep-sleep wake (the reset button, a software restart, a watchdog). \`RTC_NOINIT_ATTR\` variables are not initialised at start-up at all, so they also survive a software restart, but they hold garbage after the power was cut and need a magic number and a checksum. In MicroPython you store bytes, and \`struct\` packs numbers into them.

Typical jobs are a wake counter; **batching**, where the node keeps six readings and sends them in one radio session every sixth wake, cutting the radio time by six; the access point's channel and address for a quick reconnect ([[fast-wifi-reconnect]]); and the last state of an output.

### When it must outlive the battery

That is flash: [[nvs-and-preferences]] for settings, files for logs. Flash wears out, roughly a hundred thousand erases per sector. Written every ten seconds, one sector is gone in twelve days; wear levelling over a 20 KB NVS area stretches that to about two months. RTC memory has no wear at all: update it as often as you like, and write flash only for what must outlast a power cut ([[flash-wear]]). The simulation shows both.

### The traps

- **Plain data only.** A pointer, an Arduino \`String\` or a \`std::vector\` points into the heap, and the heap is gone. Use numbers and fixed arrays.
- **Always handle "first run".** After a power cut the memory is empty or garbage; test a valid-marker before trusting it.
- **A reset is not a wake.** Press EN and the RTC variables are back at their initial values.

> [!key] RTC memory is a few kilobytes that stay powered through deep sleep: counters, batched readings, a remembered channel. It is lost when power is cut and reloaded by an ordinary reset; for what must survive a dead battery use flash, and write it sparingly.`,
  ideas: [
    'Deep sleep keeps only RTC memory (LP memory on the C6 and H2): 4 to 32 KB depending on the chip.',
    'RTC_DATA_ATTR in Arduino C++, RTC().memory() in MicroPython: variables and bytes that wait for the next wake-up.',
    'RTC memory is wiped by a power cut and reloaded by any reset that is not a deep-sleep wake; flash is the only memory that survives a dead battery.',
    'Batching readings in RTC memory and sending every Nth wake cuts the radio time, the biggest cost, by N.'
  ],
  pitfalls: [
    'Writing every reading to flash is the safe way to keep it — Flash survives power loss but wears out: written every ten seconds one sector lasts about twelve days. Keep readings in RTC memory and write flash rarely.',
    'An RTC variable survives a press of the reset button — Only a deep-sleep wake keeps it. The reset button, a software restart or a watchdog reload the initial value.',
    'I can keep a String or a pointer in RTC memory — They refer to the heap, which is lost in deep sleep: the saved pointer points at nothing. Store plain numbers and fixed-size arrays.'
  ],
  terms: [
    { term: 'RTC memory', also: ['RTC slow memory', 'RTC fast memory', 'LP memory'], def: 'A few kilobytes of RAM in the always-on domain that keep their contents through deep sleep. Newer chips call it LP memory. It is lost when power is removed.' },
    { term: 'RTC_DATA_ATTR', also: ['RTC_NOINIT_ATTR', 'RTC_SLOW_ATTR'], def: 'The attribute that places an Arduino or ESP-IDF global variable in RTC memory. RTC_DATA_ATTR variables start from their initial value after a reset; RTC_NOINIT_ATTR variables are not initialised at all.' },
    { term: 'Batching', also: ['store and forward', 'burst sending'], def: 'Collecting several readings and sending them together, so that the costly radio session is shared between them. In a sleeping sensor the readings wait in RTC memory.' },
    { term: 'Wear levelling', also: ['flash endurance', 'erase cycles'], def: 'Spreading writes over many flash sectors so that none reaches its limit of about a hundred thousand erases early. NVS and file systems do it; a rewrite of one fixed sector does not.' }
  ],
  choose: {
    good: ['RTC memory for counters, batched readings and the remembered channel', 'Flash (NVS) for settings and calibration that must outlive the battery', 'A valid-marker plus checksum on anything read back after a long sleep'],
    avoid: ['Flash writes on every short wake-up', 'Pointers, Strings and objects with heap storage in RTC memory', 'Trusting RTC memory after a power cut'],
    check: ['Your chip\'s RTC memory size, and what else uses it (a ULP program shares it)', 'How often you write flash, per day', 'What the program does when the memory is empty']
  },
  code: [
    {
      title: 'Batch six readings, send them together',
      about: 'Each wake the program reads a sensor stand-in (an analogue input), appends the value to a list in RTC memory and goes back to sleep. Every sixth wake it "sends" all six at once and starts a new batch. Over 60 seconds that is one radio session instead of six.',
      needs: 'An original ESP32 DevKit; GPIO34 can stay unconnected or carry any voltage from 0 to 3.1 V.',
      wiring: [['GPIO34', 'a voltage to measure, 0 to 3.1 V', 'or leave it open for demonstration values']],
      blocks: `
        when started
          start serial at (115200) baud
          add (analog read pin (34) in millivolts) to [readings v]
          if <(length of [readings v]) = (6)> then
            print (join [sending: ] (readings))
            set [readings v] to (empty list)
          end
          save (readings) as [readings]
          deep sleep for (10) seconds
      `,
      cpp: String.raw`
        RTC_DATA_ATTR uint16_t readings[6];             // a plain array: survives deep sleep
        RTC_DATA_ATTR int stored = 0;                   // how many readings are in it

        void setup() {
          Serial.begin(115200);
          delay(500);
          readings[stored++] = analogReadMilliVolts(34);       // a stand-in for a sensor
          if (stored == 6) {
            Serial.print("sending:");                   // one radio session for six readings
            for (int i = 0; i < 6; i++) Serial.printf(" %u", readings[i]);
            Serial.println();
            stored = 0;
          } else {
            Serial.printf("stored %d of 6\n", stored);
          }
          esp_sleep_enable_timer_wakeup(10ULL * 1000000ULL);
          Serial.flush();
          esp_deep_sleep_start();
        }

        void loop() {}
      `,
      py: String.raw`
        import machine, struct, time
        from machine import ADC, Pin

        rtc = machine.RTC()
        raw = rtc.memory()                              # bytes kept through deep sleep
        readings = list(struct.unpack("<%dH" % (len(raw) // 2), raw)) if raw else []

        adc = ADC(Pin(34), atten=ADC.ATTN_11DB)
        readings.append(adc.read_uv() // 1000)          # millivolts, a stand-in for a sensor

        if len(readings) >= 6:
            print("sending:", readings)                 # one radio session for six readings
            readings = []
        else:
            print("stored", len(readings), "of 6")
        rtc.memory(struct.pack("<%dH" % len(readings), *readings))

        time.sleep_ms(100)
        machine.deepsleep(10_000)
      `,
      output: `
        stored 1 of 6
        stored 2 of 6
        ...
        sending: 1648 1652 1650 1649 1651 1647
        stored 1 of 6
      `,
      notes: ['A power cut empties the array and the counter: the first wake after it starts a new batch. For a log that must survive, write the batch to flash after it is sent.', 'Never keep more in RTC memory than the chip has: 16 KB on an ESP32, 8 KB on a C3, and a ULP program uses part of it too.']
    }
  ],
  examples: [
    {
      title: 'How long does the flash last?',
      q: 'A node writes one value to the same flash sector on every wake, every 10 seconds. A sector survives about 100 000 erases. How long until it fails, and how long if the writes are spread over a 5-sector NVS area?',
      steps: ['Writes per day: $86\\,400 / 10 = 8\\,640$.', 'One sector: $100\\,000 / 8\\,640 \\approx 11.6$ days.', 'Spread over 5 sectors: five times as long, about 58 days.', 'Writing to flash only on every sixth wake, and keeping the other five readings in RTC memory, multiplies the life by six again.'],
      a: 'About 12 days for one sector, about two months with wear levelling over 5 sectors — and a year or more if the writes are batched. RTC memory takes the frequent writes.'
    }
  ],
  quiz: [
    { q: 'You declare `int count = 0;` inside nothing special and increment it before each deep sleep. What does it hold after the wake?', choices: ['The incremented value', 'Its initial value', 'An undefined value that changes', 'The count of resets'], a: 1, why: 'Normal RAM is lost in deep sleep. After the wake the program starts again and the variable is initialised again. `RTC_DATA_ATTR` is what keeps it.' },
    { q: 'Which memory survives removing the battery for a minute?', choices: ['RTC memory', 'Normal RAM', 'Flash (NVS)', 'The RTC_NOINIT_ATTR variables'], a: 2, why: 'Only flash is non-volatile. RTC memory needs power, and RTC_NOINIT variables hold garbage after power returns.' },
    { q: 'Why must a struct kept in RTC memory not contain an Arduino `String`?', choices: ['Strings are too long', 'A String holds a pointer into the heap, which is lost in deep sleep', 'RTC memory is read-only', 'It would slow down the wake-up'], a: 1, why: 'The String object itself is small, but its text lives on the heap. After the wake the object still points to that address, which now holds nothing valid.' },
    { q: 'Pressing the EN (reset) button on a board keeps the values of `RTC_DATA_ATTR` variables, as a deep-sleep wake does.', a: false, why: 'RTC variables survive deep sleep only. A reset of any other kind reloads their initial values at start-up.' }
  ],
  applications: [
    'Wake counters and "first boot" flags in every deep-sleep program.',
    'Batching sensor readings to send once an hour while sampling every minute.',
    'Remembering the Wi-Fi channel and access point address for a fast reconnect.',
    'Keeping the previous reading so the node transmits only when the value has changed enough.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "Sleep Modes" and "Memory Types" (RTC slow and fast memory, RTC_NOINIT_ATTR).',
    'MicroPython documentation, *machine.RTC*: the memory() method.',
    'Arduino core for ESP32, DeepSleep examples (RTC_DATA_ATTR boot counter).'
  ],
  sim: 'sl-rtc-memory'
},

/* ================================================================ the-board-is-not-the-chip */
{
  id: 'the-board-is-not-the-chip',
  parent: 'sleep-and-low-power',
  title: 'Why a board draws a thousand times the datasheet figure',
  level: 2,
  short: 'The datasheet says 5 µA. The board you bought draws 100 µA, or 5 mA. The difference is the regulator, the USB chip, the LED, the divider and whatever else is wired to the supply; finding and removing it is most of a battery project.',
  keywords: ['quiescent current', 'sleep current', 'development board', 'power LED', 'USB-serial chip', 'AMS1117', 'LDO', 'load switch', 'gpio_hold_en', 'battery divider', 'low-power board', 'measure sleep current', 'always on'],
  prereq: ['power-modes', 'regulators-ldo-and-buck', 'anatomy-of-a-dev-board'],
  related: ['measuring-current', 'power-switching-and-load-sharing', 'usb-serial-bridges-and-auto-reset', 'measuring-battery-level', 'choosing-a-board', 'battery-life-budget'],
  body: `A chip in deep sleep takes 5 to 25 µA. Put it on a development board, run the board from a battery and measure: 5 mA is not unusual, a thousand times more. The chip did not change; the board around it is still awake. It is the commonest reason a project designed for months lasts a week.

### Where the current goes

- **The regulator.** A linear regulator needs a current of its own just to exist, its *quiescent current*. The classic 1117-type regulator on many cheap boards draws several milliamps doing nothing; a small modern LDO tens of microamps; a low-quiescent part a few microamps.
- **The USB-serial chip** (CP210x, CH340, CH9102). If the board powers it from the 3.3 V rail it draws milliamps while the rail is up.
- **The power LED.** A red LED behind 1 kΩ on 3.3 V takes about 1.3 mA, two hundred and sixty times the chip's 5 µA.
- **The battery divider.** Two 100 kΩ resistors across a cell at 4.2 V pass 21 µA all day.
- **Everything else wired to the supply:** chargers, fuel gauges, sensors left powered, pull-ups held low by a sensor (3.3 V over 10 kΩ is 330 µA).

Boards differ enormously, and so do revisions of one board. Makers' own deep-sleep figures from the catalogue: Adafruit ESP32 Feather V2 about 70 µA; Seeed XIAO ESP32-C6 15 µA and XIAO ESP32-S3 14 µA; Olimex ESP32-DevKit-LiPo about 10 µA; Heltec WiFi Kit 32 V3 under 10 µA claimed, while Heltec puts its older WiFi LoRa 32 V2 at about 800 µA; UM TinyPICO 18 to 20 µA. DFRobot's Beetle ESP32-C6 is 14 µA on version 1.0 but 37 µA on 1.1, and some WEMOS D1 mini ESP32 clones keep the CH340C and the regulator powered, so theirs is high. Treat a maker's figure as a claim and the revision as part of it.

### The method

1. **Measure** the whole board at the battery lead, in sleep, with a meter in series on its microamp range or a power profiler ([[measuring-current]]).
2. **Find what is always on.** Remove one part at a time (cut the LED's trace, lift the divider, unplug the sensor) and watch the number fall.
3. **Switch off what you need only awake.** Power a sensor from a spare GPIO within the pin's limit ([[pin-current-limits]]), or through a MOSFET or load switch ([[power-switching-and-load-sharing]]), and hold the pin's level through sleep or it floats.
4. **Choose for the budget:** a low-quiescent regulator, a large or switched divider, no always-on LED, a board with a stated figure for its revision.

On the original ESP32 one more: GPIO12 and GPIO15 carry resistors on some modules, and Espressif's own sleep example isolates both pins to stop the drain.

> [!key] The chip's 5 to 10 µA is a floor, not a forecast: the board's always-on parts usually set the real sleep current. Measure the board, find what is always on, switch it off with a pin or a load switch, and choose a low-quiescent regulator.`,
  ideas: [
    'The datasheet sleep current is for the bare chip; the board adds a regulator, USB chip, LED and more that stay powered.',
    'A power LED on 1 kΩ takes about 1.3 mA and a battery divider of 2 × 100 kΩ takes 21 µA: both dwarf the chip\'s 5 µA.',
    'Measure the whole board from the battery, remove parts one at a time to find what is always on, then switch off or replace it.',
    'Sensors can be powered from a GPIO or a load switch and switched off in sleep, if the pin\'s level is held through deep sleep.'
  ],
  pitfalls: [
    'My board says "low power", so it draws microamps — That is the maker\'s claim for one revision. Measure it: some boards state 10 µA, some 800 µA, and the same board can differ between versions.',
    'Pulling the USB cable gives the battery figure — The USB-serial chip may be powered from the 3.3 V rail or leak through the serial lines. Measure with the cable out and the battery in.',
    'Setting a pin low before sleep keeps the sensor off — In deep sleep the pin reverts to its default unless it is held (gpio_hold_en with gpio_deep_sleep_hold_en, or hold=True in MicroPython), and a floating pin may switch the sensor on.'
  ],
  terms: [
    { term: 'Quiescent current', also: ['ground current', 'Iq', 'standby current'], def: 'The current a regulator or other chip draws from its input to run itself while it supplies no load. It adds to the sleep current of everything behind it.' },
    { term: 'Load switch', also: ['power switch', 'high-side switch'], def: 'A small switch, usually a MOSFET, that the chip can turn on and off to power a sensor or module only when it is needed. It draws almost nothing when off.' },
    { term: 'Pin hold', also: ['gpio_hold_en', 'gpio_deep_sleep_hold_en', 'hold=True'], def: 'A feature that freezes a pin\'s output level through deep sleep. Without it the pin goes back to its default state when the chip powers down.' },
    { term: 'Always-on load', also: ['parasitic drain', 'sleep drain'], def: 'Any part of a circuit that draws current whatever the chip is doing: a power LED, a voltage divider, a regulator, a sensor in standby, a pull resistor.' }
  ],
  choose: {
    good: ['A board whose maker states a deep-sleep figure and the revision it applies to', 'A low-quiescent regulator (a few µA) and an LED that can be cut or switched', 'A charger and fuel gauge that idle at microamps, or a board where you can disconnect them'],
    avoid: ['A linear regulator of several mA quiescent current on a battery board', 'A USB-serial chip powered from the battery rail', 'A DevKit as the final product: it is built for the bench'],
    check: ['The sleep current you measure at the battery, not the one printed', 'Which revision of the board you have', 'What a pin does through deep sleep, and what it is wired to']
  },
  code: [
    {
      title: 'Power a sensor from a pin, switch it off for the sleep',
      about: 'On every wake the program powers the sensor from GPIO25, waits for it to settle, reads its output on GPIO34, switches it off and holds the pin low through deep sleep, so the sensor draws nothing for the whole minute.',
      needs: 'An original ESP32 DevKit and an analogue sensor drawing under 10 mA (a thermistor divider will do).',
      wiring: [['GPIO25', 'sensor supply (+)', 'the pin is the switch'], ['GPIO34', 'sensor output', 'ADC1, input only'], ['GND', 'sensor ground']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (25) as [output v]
          set pin (25) to [HIGH v]
          release the hold on pin (25) :: power
          wait (0.01) seconds
          print (join [sensor: ] (analog read pin (34) in millivolts))
          set pin (25) to [LOW v]
          hold pin (25) through deep sleep :: power
          deep sleep for (60) seconds
      `,
      cpp: String.raw`
        const int SENSOR_POWER = 25;                    // the pin that powers the sensor
        const int SENSOR_OUT = 34;                      // ADC1, input only

        void setup() {
          Serial.begin(115200);
          pinMode(SENSOR_POWER, OUTPUT);
          digitalWrite(SENSOR_POWER, HIGH);             // set the level first ...
          gpio_hold_dis((gpio_num_t)SENSOR_POWER);      // ... then release the hold from the last sleep
          delay(10);                                    // let the sensor settle
          Serial.printf("sensor: %u mV\n", analogReadMilliVolts(SENSOR_OUT));

          digitalWrite(SENSOR_POWER, LOW);              // sensor off
          gpio_hold_en((gpio_num_t)SENSOR_POWER);       // keep it off through deep sleep
          gpio_deep_sleep_hold_en();
          esp_sleep_enable_timer_wakeup(60ULL * 1000000ULL);
          Serial.flush();
          esp_deep_sleep_start();
        }

        void loop() {}
      `,
      py: String.raw`
        import machine, esp32, time
        from machine import ADC, Pin

        SENSOR_POWER = 25                               # the pin that powers the sensor
        power = Pin(SENSOR_POWER, Pin.OUT, value=1, hold=False)   # on, and release the hold from the last sleep
        time.sleep_ms(10)                               # let the sensor settle

        adc = ADC(Pin(34), atten=ADC.ATTN_11DB)         # ADC1, input only
        print("sensor:", adc.read_uv() // 1000, "mV")

        power.value(0)                                  # sensor off
        power.init(hold=True)                           # keep it off through deep sleep
        esp32.gpio_deep_sleep_hold(True)
        time.sleep_ms(100)
        machine.deepsleep(60_000)
      `,
      output: `
        sensor: 1643 mV
      `,
      notes: ['A pin can supply only a small current; for a module that needs more than a few milliamps use a MOSFET or a load switch driven by the pin ([[power-switching-and-load-sharing]]).', 'The held level stays until the next wake-up releases it. Release it only after setting the level you want, or the sensor sees a glitch.']
    }
  ],
  examples: [
    {
      title: 'Adding up a board',
      q: 'An ESP32-C3 board has a small LDO with 55 µA quiescent current, a battery divider of 2 × 100 kΩ on a cell at 4.2 V, and a power LED with a 1 kΩ resistor (red LED, 2.0 V). The chip itself draws 5 µA asleep. What does the board draw, and how long does a 1000 mAh cell last?',
      steps: ['Divider: $4.2 / 200\\,000 = 21$ µA.', 'LED: $(3.3 - 2.0) / 1000 = 1.3$ mA = 1300 µA.', 'Total: $5 + 55 + 21 + 1300 = 1381$ µA, about 276 times the chip alone.', 'Battery: 80 % of 1000 mAh over 1.38 mA, plus self-discharge, lasts about 23 days; the chip alone would manage about 700.', 'Remove the LED and the total is 81 µA (about 270 days). Change the LDO to a 2 µA part and the divider to 2 × 1 MΩ and it is 9 µA (about 650 days).'],
      a: 'The board draws 1.38 mA and the cell lasts about three weeks. The LED alone is 94 % of it. Remove it first.'
    }
  ],
  quiz: [
    { q: 'An ESP32-C3 board in deep sleep draws 1.4 mA from a battery, though the datasheet says 5 µA. Which is the most likely first suspect?', choices: ['The chip is faulty', 'An always-on power LED or a regulator with high quiescent current', 'The flash memory', 'The wake-up timer'], a: 1, why: 'The chip\'s 5 µA is a small fraction of the total. A power LED (about 1.3 mA behind 1 kΩ) or a regulator that needs milliamps just to run are far more likely.' },
    { q: 'What does `gpio_hold_en()` followed by `gpio_deep_sleep_hold_en()` do before deep sleep?', choices: ['It holds the pin\'s output level through the sleep', 'It wakes the chip on that pin', 'It switches the pull-up on', 'It saves the pin number in RTC memory'], a: 0, why: 'In deep sleep pins normally go back to their default state. The hold freezes the level, so a sensor switched off before sleep stays off.' },
    { q: 'A battery divider is two 220 kΩ resistors across a 4.2 V cell. How much does it draw all the time?', choices: ['About 0.95 µA', 'About 9.5 µA', 'About 95 µA', 'About 0.95 mA'], a: 1, why: '$4.2 / 440\\,000 \\approx 9.5$ µA. Compared with the chip\'s 5 µA that is already twice as much, so a divider for battery monitoring should be large or switchable.' },
    { q: 'Unplugging the USB cable always removes the USB-serial chip\'s current from the measurement.', a: false, why: 'On many boards the chip is powered from the 3.3 V rail, which the battery also feeds, so it keeps drawing. Measure with the cable out and the battery in.' }
  ],
  applications: [
    'Turning a development-board prototype into a battery product that actually lasts: the first step is always a sleep-current measurement.',
    'Choosing a board for a solar or coin-cell sensor from the makers\' stated sleep figures and revisions.',
    'Power-gating a sensor, a display or a radio module that only works for a moment.',
    'Hunting a mystery drain in a deployed device with a profiler and a screwdriver.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, GPIO reference (gpio_hold_en, gpio_deep_sleep_hold_en) and the ULP ADC example that isolates GPIO12 and GPIO15.',
    'Datasheets of the regulators, USB-serial chips and chargers on the board in question: quiescent and supply current tables.',
    'The makers\' own product pages for the boards named: sleep-current statements and revision notes.'
  ],
  sim: 'sl-board-vs-chip'
},

/* ================================================================ ulp-and-lp-coprocessors */
{
  id: 'ulp-and-lp-coprocessors',
  parent: 'sleep-and-low-power',
  title: 'The ULP and LP coprocessors',
  level: 3,
  short: 'A tiny second processor in the always-on domain can read a sensor, compare it with a threshold and wake the main cores only when something matters. The main cores sleep at microamps while it keeps watch.',
  keywords: ['ULP', 'ULP-FSM', 'ULP-RISC-V', 'LP core', 'LP RISC-V', 'coprocessor', 'low-power core', 'ulp_riscv_run', 'ulp_lp_core_run', 'esp_sleep_enable_ulp_wakeup', 'LP UART', 'LP I2C', 'sensor watching'],
  prereq: ['deep-sleep', 'wake-up-sources', 'rtc-memory'],
  related: ['rtc-domain-and-lp-core', 'the-esp-adc', 'esp-idf-basics', 'light-sleep-and-automatic-power-management', 'battery-life-budget', 'soc-esp32-c6'],
  body: `The main cores of an ESP32 draw tens of milliamps, and waking them every second to look at a sensor wastes most of a battery. Some chips therefore carry a second, tiny processor in the always-on domain: a **night watchman**. The main cores sleep at microamps; the watchman wakes every few milliseconds, reads the sensor, compares, and wakes the main cores only when the reading matters.

### Who has one

| Chip | Coprocessor, from the catalogue |
|---|---|
| ESP32 | ULP, a state machine |
| ESP32-S2, S3 | ULP state machine and ULP-RISC-V |
| ESP32-C6 | LP RISC-V core at 20 MHz, with its own UART and I2C |
| ESP32-C5 | LP RISC-V core at 48 MHz, with its own UART and I2C |
| ESP32-P4 | LP RISC-V core at 40 MHz, with UART, I2C, SPI and I2S |
| ESP32-S31 | LP RISC-V core at 40 MHz |
| C3, C2, C61, H2 | none (the H2 keeps 4 KB of LP memory) |

The old **ULP state machine** has a handful of instructions: read an ADC channel, add, compare, jump, set a pin, wake. The **RISC-V** coprocessors run ordinary C. The LP cores of the C6, C5 and P4 also own an LP UART and LP I2C, so they can poll an I2C sensor or listen to a serial GPS with the main cores asleep.

### How it is built

The coprocessor's program is compiled separately and embedded in the main program. In ESP-IDF the main program loads the binary, sets how often the coprocessor runs, starts it, arms the ULP wake-up and goes to deep sleep. Variables are shared through RTC memory, and the main program reads them under a \`ulp_\` prefix. The coprocessor's code and data live in RTC slow (or LP) memory, a few kilobytes, which it shares with \`RTC_DATA_ATTR\` variables. The Arduino core can load a hand-assembled state-machine program on the ESP32; there is no way to build one in MicroPython.

### Design rules

- **Let it decide cheaply, let the main core act.** Compare against a threshold, count pulses, debounce; wake only for an event.
- **The coprocessor costs current too.** Each run draws something, so the period is a trade between how fast you notice and what the watching costs: a sample every 20 ms is a hundred times dearer than one every 2 s. The simulation shows the curve.
- **Keep the RTC peripheral domain powered** if the program uses the SAR ADC: the converter's settings live in it.
- **Set the period from the latency you need**, not from the fastest the hardware allows.

> [!key] A coprocessor in the RTC domain can watch a sensor while the main cores sleep and wake them only on an event: the ULP on the ESP32, S2 and S3, an LP RISC-V core on the C6, C5, P4 and S31. It is built separately, shares RTC memory, and its watching costs current in proportion to how often it runs.`,
  ideas: [
    'The ULP (ESP32, S2, S3) and the LP core (C6, C5, P4, S31) run in the RTC domain while the main cores sleep.',
    'The coprocessor reads a sensor, compares it and wakes the main cores only when the reading crosses a threshold.',
    'Its program is built separately and shares RTC memory with the main program.',
    'The watching is not free: a shorter period means faster detection and a higher average current.'
  ],
  pitfalls: [
    'Any ESP32 has a ULP — The ESP32-C3, C2, C61 and H2 have no coprocessor at all; use a pin wake-up from an external comparator instead.',
    'The coprocessor costs nothing — Each run draws current, and a very short period can cost more than waking the main core occasionally. Choose the period from the detection delay you can accept.',
    'I can write the ULP program in Arduino or MicroPython like any other — The Arduino core only loads hand-assembled state-machine code, and MicroPython cannot build one: the useful route is an ESP-IDF project.'
  ],
  terms: [
    { term: 'ULP', also: ['ultra-low-power coprocessor', 'ULP-FSM', 'ULP-RISC-V'], def: 'A small processor in the always-on RTC domain of the ESP32, S2 and S3 that runs while the main cores sleep. It exists as a state machine (FSM) and, on the S2 and S3, as a RISC-V core programmed in C.' },
    { term: 'LP core', also: ['low-power core', 'LP RISC-V', 'LP CPU'], def: 'The low-power RISC-V coprocessor of the C6, C5, P4 and S31. On the C6 it has its own LP UART and LP I2C, so it can talk to peripherals while the main cores sleep.' },
    { term: 'Coprocessor wake-up', also: ['ESP_SLEEP_WAKEUP_ULP', 'esp_sleep_enable_ulp_wakeup'], def: 'A wake-up source in which the coprocessor program itself decides to wake the main cores, for example when a sensor reading crosses a threshold.' },
    { term: 'Shared variable', also: ['ulp_ prefix', 'RTC shared memory'], def: 'A variable of the coprocessor program that the main program can also read and write through RTC memory. In ESP-IDF the build exports it with the prefix ulp_.' }
  ],
  choose: {
    good: ['"Wake me only if the sensor crosses a level": a threshold watcher on an analogue input', 'Counting pulses or edges while the main cores sleep', 'Polling an I2C sensor or a serial GPS on a chip with an LP core and LP I2C or UART'],
    avoid: ['A chip with no coprocessor (C3, C2, C61, H2) — use an external comparator on a wake pin', 'A very short period when a few seconds of delay is fine', 'A job that needs the radio: only the main cores run Wi-Fi and Bluetooth'],
    check: ['That your chip has the coprocessor, and which kind', 'How much RTC memory the program and the other RTC variables need', 'The average current with the coprocessor running, measured']
  },
  code: [
    {
      title: 'The ULP watches an analogue input, the main core sleeps',
      about: 'On an ESP32-S3 the ULP-RISC-V reads ADC1 channel 0 (GPIO1) every 20 ms. If the reading exceeds a threshold it stores the value and wakes the main core, which prints it and goes back to sleep. Two source files, as in an ESP-IDF project: the main program and the coprocessor program.',
      needs: 'An ESP32-S3 board and ESP-IDF 5.5 with the ULP enabled in the project settings (the ULP coprocessor option, RISC-V type, with some reserved memory). A voltage on GPIO1 from 0 to 3.1 V.',
      wiring: [['GPIO1', 'a voltage to watch, 0 to 3.1 V', 'ADC1 channel 0 on the S3']],
      blocks: `
        when started
          if <(wake-up reason) = [ULP v]> then
            print (join [woken by the ULP: ] (value stored by the ULP))
          else
            load the ULP program and start it, every (20) milliseconds :: power
          end
          enable wake on the ULP :: power
          deep sleep :: power

        when the ULP runs :: power
          set [value v] to (analog read pin (1))
          if <(value) > (2000)> then
            store (value) and wake the main core :: power
          end
      `,
      idf: String.raw`
        /* ---- main/ulp_adc_main.c : runs on the main core ---- */
        #include <stdio.h>
        #include "esp_sleep.h"
        #include "ulp_riscv.h"
        #include "ulp_adc.h"
        #include "ulp_main.h"                           // the ULP program's variables, made by the build

        extern const uint8_t ulp_main_bin_start[] asm("_binary_ulp_main_bin_start");
        extern const uint8_t ulp_main_bin_end[]   asm("_binary_ulp_main_bin_end");

        void app_main(void) {
            if (esp_sleep_get_wakeup_cause() == ESP_SLEEP_WAKEUP_ULP) {
                printf("woken by the ULP: reading %lu\n", (unsigned long)ulp_wakeup_result);
            } else {                                    // first start: configure the ADC, load and start the ULP
                ulp_adc_cfg_t cfg = { .adc_n = ADC_UNIT_1, .channel = ADC_CHANNEL_0, .width = ADC_BITWIDTH_DEFAULT,
                                      .atten = ADC_ATTEN_DB_12, .ulp_mode = ADC_ULP_MODE_RISCV };
                ESP_ERROR_CHECK(ulp_adc_init(&cfg));
                ESP_ERROR_CHECK(ulp_riscv_load_binary(ulp_main_bin_start, ulp_main_bin_end - ulp_main_bin_start));
                ulp_set_wakeup_period(0, 20000);        // the ULP runs every 20 ms
                ESP_ERROR_CHECK(ulp_riscv_run());
            }
            esp_sleep_pd_config(ESP_PD_DOMAIN_RTC_PERIPH, ESP_PD_OPTION_ON);   // keep the ADC set-up alive
            ESP_ERROR_CHECK(esp_sleep_enable_ulp_wakeup());
            esp_deep_sleep_start();
        }

        /* ---- main/ulp/main.c : runs on the ULP-RISC-V coprocessor ---- */
        #include <stdint.h>
        #include "ulp_riscv_utils.h"
        #include "ulp_riscv_adc_ulp_core.h"

        uint32_t adc_threshold = 2000;                  // about 1.75 V at this attenuation
        int32_t wakeup_result;                          // read by the main core as ulp_wakeup_result

        int main(void) {
            int32_t value = ulp_riscv_adc_read_channel(ADC_UNIT_1, ADC_CHANNEL_0);
            if (value > adc_threshold) {
                wakeup_result = value;
                ulp_riscv_wakeup_main_processor();      // wake the main core
            }
            return 0;
        }
      `,
      na: {
        cpp: 'The Arduino core can load only a hand-assembled ULP state-machine program (its SmoothBlink_ULP_Code example does this on the original ESP32); it has no build step for the C program of the ULP-RISC-V. This watcher is an ESP-IDF project.',
        py: 'MicroPython cannot build a ULP program: the coprocessor code is compiled outside it, so there is nothing to show in Python.'
      },
      output: `
        woken by the ULP: reading 2210
      `,
      notes: ['The example is the ULP-RISC-V ADC example of ESP-IDF 5.5 in a shorter form; the ULP-FSM and the C6 LP core use other APIs (ulp_load_binary, ulp_run; ulp_lp_core_load_binary, ulp_lp_core_run).', 'Wire the sensor so that GPIO1 never exceeds 3.3 V; at 12 dB attenuation the useful range ends near 3.1 V.']
    }
  ],
  examples: [
    {
      title: 'Poll with the main core, or watch with the ULP?',
      q: 'An ESP32-S3 must notice a threshold crossing within 1 second. Awake, the main core draws about 30 mA (an estimate: 0.125 mA per MHz at 240 MHz) for 0.3 s each time it wakes. The ULP draws about 1 mA for 2 ms per sample. Compare the average currents.',
      steps: ['Polling with the main core, waking once a second: $30 \\times 0.3 = 9$ mA·s per second, so about 9 mA, plus 7 µA asleep.', 'Watching with the ULP, one sample per second: $1 \\times 0.002 = 0.002$ mA·s per second, so 2 µA, plus 7 µA asleep.', 'The ULP route is about 9 µA against 9000 µA: a thousand times less, for the same one-second detection delay.', 'Add the main core waking for real events, say six an hour at 0.3 s: about $30 \\times 0.3 \\times 6 / 3600 \\approx 15$ µA more.'],
      a: 'About 9 µA with the ULP watching, against about 9 mA polling with the main core. The coprocessor is the right tool whenever the check is far more frequent than the events.'
    }
  ],
  quiz: [
    { q: 'Which of these chips has no low-power coprocessor?', choices: ['ESP32-S3', 'ESP32-C6', 'ESP32-C3', 'ESP32'], a: 2, why: 'The C3 (and the C2, C61 and H2) have none. The ESP32 has a ULP state machine, the S3 both kinds, the C6 an LP RISC-V core.' },
    { q: 'A ULP program samples a sensor every 20 ms instead of every 2 s. What changes?', choices: ['Detection gets 100 times faster, and the average current rises', 'Detection gets slower and the current rises', 'Nothing: the ULP is free', 'The main core wakes 100 times as often'], a: 0, why: 'A shorter period means a shorter detection delay and more coprocessor runs per second, each of which draws current. The period is a trade, not a free choice.' },
    { q: 'Where do the variables shared between the main program and a ULP program live?', choices: ['In the flash', 'In RTC (LP) memory', 'In the main heap', 'On the USB port'], a: 1, why: 'The coprocessor runs from RTC slow or LP memory, which is also what the main core reads after the wake. The build gives the shared variables a ulp_ prefix.' },
    { q: 'On the ESP32-C6 the LP core can read an I2C sensor while the main cores sleep.', a: true, why: 'The C6\'s LP core has its own LP I2C and LP UART, so it can talk to peripherals without waking the main cores. Only the main cores run the Wi-Fi and Bluetooth radios.' }
  ],
  applications: [
    'Wake only when a temperature, light or gas reading crosses a limit, otherwise sleep for weeks.',
    'Counting pulses from a flow or energy meter while the main cores sleep.',
    'Sampling an I2C sensor on the C6 or P4 with the LP core and waking the main core when it changes.',
    'Voice or vibration pre-screening where a cheap check decides whether to wake the expensive processor.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, ULP coprocessor pages (ULP-FSM, ULP-RISC-V, LP core) and the ulp example projects.',
    'Espressif datasheets and technical reference manuals of the ESP32, ESP32-S3, ESP32-C6, ESP32-C5 and ESP32-P4: low-power coprocessor sections.',
    'Arduino core for ESP32, DeepSleep example SmoothBlink_ULP_Code.'
  ],
  sim: 'sl-ulp'
},

/* ================================================================ fast-wifi-reconnect */
{
  id: 'fast-wifi-reconnect',
  parent: 'sleep-and-low-power',
  title: 'Waking, sending, sleeping: the fast connection',
  level: 2,
  short: 'Once the sleep current is low, the seconds awake decide the battery. A cold Wi-Fi connection takes several seconds; remembering the channel, using a fixed address and sending one small packet can cut it to under a second.',
  keywords: ['fast reconnect', 'Wi-Fi connect time', 'static IP', 'BSSID', 'channel', 'DHCP', 'ESP-NOW', 'UDP', 'time awake', 'WiFi.config', 'WiFi.begin channel', 'bssid', 'quick connect', 'connection time'],
  prereq: ['deep-sleep', 'rtc-memory', 'wifi-station'],
  related: ['wifi-events-and-reconnection', 'ip-addresses-dhcp-dns', 'esp-now', 'project-esp-now-sensors', 'battery-life-budget', 'mqtt', 'https-and-tls'],
  body: `Deep sleep makes the waiting cheap. What is left to pay for is the work: and the dearest part of the work is **getting online**. A cold Wi-Fi connection takes seconds, all of it spent with the radio on, at 65 to 110 mA depending on the chip. Cut the seconds and you cut the battery bill by the same factor; no sleep trick can do that.

### Where the seconds go

| Step | Typical time | The shortcut |
|---|---|---|
| Wake, boot, start the radio | 0.35 s | little to gain |
| Scan for the network | 0.9 s | remember the channel and the access point's address: 0.1 s |
| Join: authenticate, associate, exchange keys | 0.3 s | fixed by the router |
| Get an address (DHCP) | 0.7 s | a static address: none |
| DNS, TCP, TLS | 0.9 s | a plain UDP packet to a local collector: none |
| Send and wait for the answer | 0.35 s | one small packet: 0.05 s |

A full HTTPS exchange adds up to about 3.5 s; with the three shortcuts, about 0.8 s. Your router will give other figures: time your own, from the wake to the last byte sent. **ESP-NOW** skips the whole middle: the radio starts, one packet goes straight to a receiver's address, and the chip is back asleep in about 0.4 s ([[esp-now]]).

### What the shortcuts need

- **Channel and access point address.** After the first connection save the channel and the 6-byte address of the access point in RTC memory, and give both to the connect call: the chip goes straight to that channel instead of scanning.
- **A static address.** Choose one outside the router's DHCP range, unique on the network, and set it before connecting.
- **Less handshaking.** MQTT over TLS and HTTPS cost a second or more each wake. Send a UDP packet or an ESP-NOW frame to a gateway on your own network and let that forward it. Keep that traffic on a network you trust; where the data matters, ESP-NOW can be encrypted.
- **Batch.** Send every Nth wake ([[rtc-memory]]).

### What it buys

For an ESP32-C3 on a 1000 mAh cell waking every 10 minutes (sleep 5 µA, receive-level current while the radio is on): a full connection averages 0.48 mA and lasts about 63 days; with the shortcuts 0.093 mA and about 250 days; with ESP-NOW 0.031 mA and about 460 days. On a board that sleeps at 100 µA, the first two become 53 and 142 days: the shortcuts pay, but the board matters as much ([[the-board-is-not-the-chip]]).

### The traps

- **Stale shortcuts.** If the router changes channel, the remembered channel fails. Always cap the connect time (five seconds is plenty), fall back to the full scan, and remember afresh.
- **Unlimited retries** drain the battery when the router is off for a night. Give up, sleep, try later.
- **Address clashes.** Two devices with one static address break each other.

> [!key] With sleep cheap, the awake seconds decide the battery, and most of them are getting online. Remember the channel and access point, use a static address, send one small packet (or an ESP-NOW frame), cap the effort, and sleep.`,
  ideas: [
    'After deep sleep the Wi-Fi connection is gone, and a cold reconnect with scan, DHCP and TLS takes several seconds at full radio current.',
    'Remembering the channel and access point address, a static IP and a single small packet can cut the awake time to under a second.',
    'ESP-NOW skips the scan, the join and DHCP altogether: one packet to a known address.',
    'Cap the connect time and fall back to the full scan: a stale channel or a missing router must not drain the battery.'
  ],
  pitfalls: [
    'Lower sleep current is the way to save more — Once the sleep is at microamps the awake time decides: shaving two seconds of connecting off a ten-minute cycle saves far more than any change to the sleep current.',
    'A static IP address is fixed in the router, so the router must know it — The device simply asks for no DHCP exchange: choose an address outside the DHCP pool and make sure no one else has it.',
    'Sending over HTTPS is just as cheap as UDP — The TLS handshake alone costs a second or more of full radio current on every wake. Send small plain packets to a local gateway and let it do the TLS.'
  ],
  terms: [
    { term: 'Fast reconnect', also: ['quick connect', 'connection caching'], def: 'Connecting to Wi-Fi using information saved from an earlier connection (channel, access point address, a static IP address) so that the scan and the DHCP exchange can be skipped.' },
    { term: 'BSSID', also: ['access point address', 'AP MAC'], def: 'The hardware address of one particular access point, six bytes. Giving it to the connect call, with the channel, lets the chip skip searching for the network.' },
    { term: 'Static IP address', also: ['fixed IP', 'WiFi.config'], def: 'An address the device sets for itself instead of asking the router for one. It saves the DHCP exchange but must be outside the router\'s pool and unique.' },
    { term: 'Time awake', also: ['active time', 'on-time'], def: 'The seconds in each cycle from the wake-up to the next sleep. With a low sleep current it decides the average current and so the battery life.' }
  ],
  choose: {
    good: ['Remembered channel and access point plus a static IP: the same network every time', 'ESP-NOW to a gateway when the data stays on your premises', 'A short connect timeout with a fallback to the full scan'],
    avoid: ['HTTPS or MQTT over TLS straight from a node that wakes every few minutes', 'Retrying without limit when the router is down', 'A static address inside the router\'s DHCP range'],
    check: ['The time from wake to sleep, measured on your own network', 'That the shortcut still works after the router restarts or changes channel', 'Where the data goes after the gateway, and who can read it']
  },
  code: [
    {
      title: 'Reconnect with a remembered channel and a static address',
      about: 'The first run connects the slow way and saves the access point\'s address (and, in C++, the channel) in RTC memory. Later wake-ups give them to the connect call and use a fixed IP address, so there is no scan and no DHCP. The connect is capped at five seconds; if it fails the shortcut is forgotten.',
      needs: 'An ESP32-family board and a 2.4 GHz Wi-Fi network. Replace the network name, password and addresses with your own.',
      wiring: [['USB', 'power, for the serial monitor']],
      blocks: `
        when started
          set [start v] to (milliseconds since start)
          use static IP [192.168.1.50] gateway [192.168.1.1] :: wifi
          if <(load [known]) = [yes]> then
            connect to Wi-Fi [your-ssid] password [your-password] on the saved channel and access point :: wifi
          else
            connect to Wi-Fi [your-ssid] password [your-password]
          end
          wait until <Wi-Fi connected?> for at most (5) seconds :: wifi
          if <Wi-Fi connected?> then
            save [yes] as [known]
            save the channel and the access point address :: wifi
            print (join [connected in ms: ] ((milliseconds since start) - (start)))
            send the reading :: net
          else
            save [no] as [known]
          end
          deep sleep for (600) seconds
      `,
      cpp: String.raw`
        #include <WiFi.h>

        const char *SSID = "your-ssid";                 // do not leave real credentials in shared code
        const char *PASS = "your-password";

        RTC_DATA_ATTR bool known = false;               // is there a remembered access point?
        RTC_DATA_ATTR int32_t channel = 0;
        RTC_DATA_ATTR uint8_t bssid[6];

        void setup() {
          Serial.begin(115200);
          uint32_t t0 = millis();
          WiFi.mode(WIFI_STA);
          WiFi.config(IPAddress(192, 168, 1, 50), IPAddress(192, 168, 1, 1), IPAddress(255, 255, 255, 0), IPAddress(192, 168, 1, 1));   // static: no DHCP
          if (known) WiFi.begin(SSID, PASS, channel, bssid);   // straight to the saved channel and access point
          else       WiFi.begin(SSID, PASS);                   // first time: scan for it
          while (WiFi.status() != WL_CONNECTED && millis() - t0 < 5000) delay(10);

          if (WiFi.status() == WL_CONNECTED) {
            channel = WiFi.channel();                    // remember for next time
            memcpy(bssid, WiFi.BSSID(), 6);
            known = true;
            Serial.printf("connected in %lu ms\n", (unsigned long)(millis() - t0));
            // ... send the reading here ...
          } else {
            known = false;                               // forget: next time scan again
            Serial.println("no connection, giving up");
          }
          WiFi.disconnect(true);
          esp_sleep_enable_timer_wakeup(600ULL * 1000000ULL);
          Serial.flush();
          esp_deep_sleep_start();
        }

        void loop() {}
      `,
      py: String.raw`
        import network, machine, time

        SSID = "your-ssid"                              # do not leave real credentials in shared code
        PASS = "your-password"

        rtc = machine.RTC()
        saved = rtc.memory()                            # the access point's 6-byte address, or b"" the first time
        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.ipconfig(addr4="192.168.1.50/24", gw4="192.168.1.1")    # static: no DHCP

        t0 = time.ticks_ms()
        if len(saved) == 6:
            wlan.connect(SSID, PASS, bssid=saved)       # only this access point
        else:
            wlan.connect(SSID, PASS)                    # first time: scan for it
        while not wlan.isconnected() and time.ticks_diff(time.ticks_ms(), t0) < 5000:
            time.sleep_ms(10)

        if wlan.isconnected():
            if len(saved) != 6:                         # first time: look up the access point's address once
                for ap in wlan.scan():
                    if ap[0] == SSID.encode():
                        rtc.memory(ap[1])
                        break
            print("connected in", time.ticks_diff(time.ticks_ms(), t0), "ms")
            # ... send the reading here ...
        else:
            rtc.memory(b"")                             # forget: next time scan again
            print("no connection, giving up")
        wlan.active(False)
        machine.deepsleep(600_000)
      `,
      output: `
        connected in 3120 ms
        connected in 780 ms
        connected in 760 ms
      `,
      notes: ['The C++ call can also give the channel; MicroPython\'s connect() takes the access point address but not the channel, so it saves less.', 'On MicroPython 1.29 check with wlan.ipconfig("addr4") after connecting that the address really is the static one; if your build still asks the router, set wlan.ipconfig(dhcp4=False) first.', 'The times are examples: yours depend on the router. Print them and compare before and after.']
    },
    {
      title: 'No network at all: send with ESP-NOW and sleep',
      about: 'The radio starts but never joins a network. The program sends one small packet straight to a receiver\'s address and goes back to sleep: about 0.4 s awake instead of several seconds.',
      needs: 'Two ESP32-family boards. The receiver can run any ESP-NOW receive sketch; put its station MAC address below.',
      wiring: [['GPIO34', 'a voltage to measure, 0 to 3.1 V', 'a stand-in for a sensor; the pin is for the original ESP32']],
      blocks: `
        when started
          start ESP-NOW :: radio
          add peer [24:6F:28:AA:BB:CC] :: radio
          send ((analog read pin (34) in millivolts)) to peer [24:6F:28:AA:BB:CC] :: radio
          wait (0.02) seconds
          deep sleep for (600) seconds
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <esp_now.h>

        uint8_t receiver[6] = {0x24, 0x6F, 0x28, 0xAA, 0xBB, 0xCC};   // the receiver's MAC address: replace
        typedef struct __attribute__((packed)) { uint8_t id; uint16_t mv; } Message;

        void sleepNow() {
          esp_sleep_enable_timer_wakeup(600ULL * 1000000ULL);
          esp_deep_sleep_start();
        }

        void setup() {
          WiFi.mode(WIFI_STA);                          // radio on, but no scan, no join, no DHCP
          if (esp_now_init() != ESP_OK) sleepNow();
          esp_now_peer_info_t peer = {};
          memcpy(peer.peer_addr, receiver, 6);
          peer.channel = 0;                             // 0 = the channel we are on
          peer.encrypt = false;
          esp_now_add_peer(&peer);

          Message m = {1, (uint16_t)analogReadMilliVolts(34)};   // a stand-in for a sensor
          esp_now_send(receiver, (uint8_t *)&m, sizeof(m));
          delay(20);                                    // let the packet leave before the radio goes off
          sleepNow();
        }

        void loop() {}
      `,
      py: String.raw`
        import network, espnow, machine, time
        from machine import ADC, Pin

        RECEIVER = b"\x24\x6f\x28\xaa\xbb\xcc"          # the receiver's MAC address: replace

        sta = network.WLAN(network.WLAN.IF_STA)
        sta.active(True)                                # radio on, but no scan, no join, no DHCP
        e = espnow.ESPNow()
        e.active(True)
        e.add_peer(RECEIVER)

        mv = ADC(Pin(34), atten=ADC.ATTN_11DB).read_uv() // 1000     # a stand-in for a sensor
        e.send(RECEIVER, mv.to_bytes(2, "little"))
        time.sleep_ms(20)                               # let the packet leave before the radio goes off
        machine.deepsleep(600_000)
      `,
      notes: ['Both boards start on channel 1, which is why this works with no set-up. If the receiver is connected to a router, the sender must use the router\'s channel ([[esp-now-with-wifi]]).', 'The 20 ms wait is crude; for confirmed delivery register the send callback and sleep when it fires ([[esp-now]]).', 'The receiver\'s address is printed by any Wi-Fi example, or by WiFi.macAddress().']
    }
  ],
  examples: [
    {
      title: 'What the shortcuts are worth',
      q: 'An ESP32-C3 on a 1000 mAh cell wakes every 10 minutes. The cold connection keeps it awake for 3.5 s, the shortcut version for 0.8 s. Boot takes 0.25 s at about 20 mA; the rest of the time the radio is on at 87 mA; sleep is 5 µA. Compare the average currents and the battery life.',
      steps: ['Cold: $20 \\times 0.25 + 87 \\times 3.25 = 5 + 282.75 = 287.75$ mA·s, plus 3 mA·s asleep: $290.75 / 600 = 0.48$ mA.', 'Shortcuts: $20 \\times 0.25 + 87 \\times 0.55 = 5 + 47.85 = 52.85$ mA·s, plus 3 mA·s: $55.85 / 600 = 0.093$ mA.', 'Life with 80 % of the cell usable and 3 % self-discharge a month: about 63 days against about 247 days.', 'The saving of 2.7 seconds is a 3.9-fold longer life, for a few lines of code.'],
      a: 'About 0.48 mA and 63 days cold; about 0.093 mA and about 250 days with a remembered channel, a static address and one UDP packet.'
    }
  ],
  quiz: [
    { q: 'Which step of a cold Wi-Fi connection does remembering the channel and the access point address skip or shorten?', choices: ['DHCP', 'The scan for the network', 'The TLS handshake', 'The deep-sleep wake-up'], a: 1, why: 'With the channel and BSSID given, the chip goes straight to the access point instead of listening on every channel. DHCP is skipped by a static address, TLS by not using it.' },
    { q: 'A sensor on a 10-minute cycle is awake 3.5 s with Wi-Fi. Which change gives the biggest battery gain?', choices: ['Halving the 5 µA sleep current', 'Cutting the time awake to about 1 s', 'Using a slightly bigger capacitor', 'Using a lower transmit power'], a: 1, why: 'The awake charge is about 99 % of the total. Cutting the seconds awake by a factor of three or four cuts the average by about as much; the sleep current barely matters.' },
    { q: 'You remember the channel and the access point address, then the router is switched to another channel. What should the program do?', choices: ['Retry forever on the old channel', 'Give up after a timeout, forget the saved values and scan again next time', 'Erase the flash', 'Switch to Bluetooth'], a: 1, why: 'A shortcut must fail safe. A connect timeout of a few seconds, then forgetting the saved values, makes the next wake-up scan and learn the new channel, and bounds what the failure costs.' },
    { q: 'ESP-NOW needs the node to scan for and join a Wi-Fi network first.', a: false, why: 'ESP-NOW only needs the radio started in station mode. It sends frames to a peer\'s MAC address on the current channel, with no association and no DHCP.' }
  ],
  applications: [
    'Battery temperature and door sensors that report to a gateway every few minutes.',
    'Soil-moisture nodes in a garden, reporting to a receiver in the house by ESP-NOW.',
    'Push-button devices that must send one message quickly and sleep.',
    'Any deployment where a router restart must not empty hundreds of batteries.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, Wi-Fi driver: scan and connect configuration (channel, BSSID) and ESP-NOW.',
    'Arduino core for ESP32 documentation, Wi-Fi API: begin(), config(), channel(), BSSID(); ESP-NOW API.',
    'MicroPython documentation, *network.WLAN*: connect(), ipconfig(), scan(); *espnow* module.'
  ],
  sim: 'sl-connect'
},

/* ================================================================ wifi-power-save-and-dtim */
{
  id: 'wifi-power-save-and-dtim',
  parent: 'sleep-and-low-power',
  title: 'Wi-Fi power save, DTIM and target wake time',
  level: 3,
  short: 'A connected Wi-Fi device can be lazy: the router keeps its messages, and the radio wakes only for the beacons that say there is mail. How often it wakes decides the current and the delay.',
  keywords: ['Wi-Fi power save', 'modem sleep', 'DTIM', 'beacon interval', 'listen interval', 'WIFI_PS_MIN_MODEM', 'WIFI_PS_MAX_MODEM', 'WiFi.setSleep', 'PM_POWERSAVE', 'target wake time', 'TWT', 'Wi-Fi 6', 'esp_wifi_set_ps', 'latency'],
  prereq: ['power-modes', 'wifi-station', 'light-sleep-and-automatic-power-management'],
  related: ['wifi-6-on-esp', 'fast-wifi-reconnect', 'wifi-events-and-reconnection', 'mdns', 'sleepy-ble-zigbee-thread', 'battery-life-budget'],
  body: `Not every battery device can sleep deeply: a smart plug must answer a command within a second, a sensor may need to keep a connection open. For those, Wi-Fi has a power-saving trick: the access point **holds back** the messages for a sleeping station, and announces them in the beacons it sends about every 102 ms. The station switches its radio off between beacons and wakes just to listen.

### The beacon, the DTIM and the modes

Every beacon says which sleeping stations have mail waiting. Every n-th beacon is a **DTIM beacon**, which also announces broadcast and multicast traffic; the router chooses n, often 1 to 3. The ESP32 offers three modes:

- **No power save:** the radio listens all the time. Fast and expensive.
- **Minimum modem sleep** (the default): wake for every DTIM beacon. A message waits at most one DTIM period, 0.1 to 0.3 s for a typical router.
- **Maximum modem sleep:** wake every *listen interval* beacons (3 by default, longer if you set it). Cheaper, but a message may wait a second, and broadcasts such as mDNS and ARP can be missed.

How much it saves depends on what the processor does between beacons. Espressif's own measurements on a C3 board: modem sleep alone about 21 mA (the processor still runs), with the clock throttled about 11 mA, with **automatic light sleep** about 1.4, 0.62 and 0.31 mA for DTIM periods of 1, 3 and 10. On an original ESP32 the same three light-sleep figures are about 3.3, 2.3 and 2.2 mA. So the real saving comes from pairing the radio's rest with the CPU's rest ([[light-sleep-and-automatic-power-management]]).

### Target wake time

Wi-Fi 6 adds **target wake time** (TWT). Station and router agree a schedule: wake at these moments, for at least this long. The wake interval can be seconds or minutes, because it is written as a number times a power of two, far beyond a DTIM. Among the chips, the ESP32-C6, C5, C61 and S31 have it, and the router must support it too. It brings a connected device close to deep-sleep currents, while it still receives within its agreed window. The setup calls are in ESP-IDF.

### What power save does not do

- It does not help sending: each transmission wakes the radio and costs a burst.
- It does not stop a busy network waking you: heavy broadcast traffic keeps the radio on.
- It does not beat deep sleep for rare messages: between messages minutes apart, deep sleep with a fast reconnect costs less ([[fast-wifi-reconnect]]).

> [!key] A connected station sleeps its radio between beacons and wakes for each DTIM (minimum modem sleep) or every few beacons (maximum modem sleep). The wake interval trades current against delay; pair it with automatic light sleep for the big saving, and on Wi-Fi 6 chips consider target wake time.`,
  ideas: [
    'The access point holds a sleeping station\'s messages and announces them in beacons, about every 102 ms; every DTIM beacon also carries broadcast traffic.',
    'Minimum modem sleep wakes for each DTIM beacon; maximum modem sleep wakes every listen interval, and may miss broadcasts.',
    'Modem sleep alone leaves the CPU running (about 21 mA on a C3); automatic light sleep brings a connected C3 to roughly 0.3 to 1.4 mA.',
    'Wi-Fi 6 target wake time lets chips such as the C6 agree wake windows seconds or minutes apart with the router.'
  ],
  pitfalls: [
    'Turning on power save makes the device draw microamps — The radio rests, but the CPU keeps running: modem sleep alone is still tens of milliamps. The big saving needs the CPU to sleep too.',
    'Maximum modem sleep is always better than minimum — A longer listen interval saves current but raises the delay and can miss broadcast and multicast traffic, which breaks mDNS discovery and ARP.',
    'TWT works with any router — The access point must support target wake time as well; otherwise the setup request is refused and the station stays with ordinary power save.'
  ],
  terms: [
    { term: 'Beacon', also: ['beacon frame', 'beacon interval'], def: 'A short frame an access point sends about every 102.4 ms to announce the network. It lists which sleeping stations have messages waiting, so they can wake only when needed.' },
    { term: 'DTIM', also: ['delivery traffic indication message', 'DTIM period'], def: 'A beacon sent every n-th time (n set by the router) that also announces broadcast and multicast traffic. A station in power save must listen to each DTIM beacon.' },
    { term: 'Listen interval', also: ['wifi listen interval'], def: 'In maximum modem sleep, the number of beacons a station sleeps through between wake-ups. It defaults to 3 on the ESP32 and can be raised to save more current.' },
    { term: 'Target wake time', also: ['TWT', 'individual TWT', 'iTWT'], def: 'A Wi-Fi 6 feature in which a station and its access point agree when the station will be awake and for how long, allowing wake intervals of seconds or minutes.' },
    { term: 'Auto light sleep', also: ['automatic light sleep', 'automatic power management'], def: 'An ESP-IDF mode in which the system enters light sleep by itself whenever no task needs the CPU, and wakes for DTIM beacons and events. It is what turns modem sleep into a low average current.' }
  ],
  choose: {
    good: ['Minimum modem sleep (the default) with automatic light sleep for a device that must stay reachable', 'Maximum modem sleep with a longer listen interval for a sensor that mostly sends', 'Wi-Fi 6 target wake time, on a router that supports it, for long quiet periods'],
    avoid: ['No power save on a battery', 'Long listen intervals where discovery by mDNS or quick commands matter', 'Staying connected for minutes between rare messages: use deep sleep'],
    check: ['Your router\'s DTIM period', 'The round-trip time with the mode you chose', 'The average current on a meter, with the CPU settings you actually use']
  },
  code: [
    {
      title: 'Choose the power-save mode and time a round trip',
      about: 'Connects, sets the power-save mode, then every three seconds sends a small UDP packet to an echo server on your network and prints how long the answer took. Change the mode and watch the delay grow as the radio sleeps longer.',
      needs: 'An ESP32-family board, a Wi-Fi network, and a computer on that network running a UDP echo server on port 7777 (a few lines of Python will do).',
      wiring: [['USB', 'power, for the serial monitor']],
      blocks: `
        when started
          connect to Wi-Fi [your-ssid] password [your-password]
          set Wi-Fi power save to [maximum modem sleep v] :: wifi
        forever
          set [start v] to (milliseconds since start)
          send [ping] by UDP to [192.168.1.10] port (7777) :: net
          wait until the answer arrives :: net
          print (join [round trip ms: ] ((milliseconds since start) - (start)))
          wait (3) seconds
        end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <WiFiUdp.h>

        const char *SSID = "your-ssid";                 // do not leave real credentials in shared code
        const char *PASS = "your-password";
        IPAddress echoServer(192, 168, 1, 10);          // a computer running a UDP echo server on port 7777
        WiFiUDP udp;

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);
          WiFi.setSleep(WIFI_PS_MAX_MODEM);             // WIFI_PS_NONE, WIFI_PS_MIN_MODEM (the default) or WIFI_PS_MAX_MODEM
          WiFi.begin(SSID, PASS);
          while (WiFi.status() != WL_CONNECTED) delay(100);
          udp.begin(7778);                              // our own port, to receive the answer
        }

        void loop() {
          uint32_t t0 = millis();
          udp.beginPacket(echoServer, 7777);
          udp.print("ping");
          udp.endPacket();
          int n = 0;
          while ((n = udp.parsePacket()) == 0 && millis() - t0 < 2000) delay(1);
          if (n > 0) {
            char buf[16];
            udp.read(buf, sizeof(buf));
            Serial.printf("round trip %lu ms\n", (unsigned long)(millis() - t0));
          } else {
            Serial.println("no answer");
          }
          delay(3000);
        }
      `,
      py: String.raw`
        import network, socket, time

        SSID = "your-ssid"                              # do not leave real credentials in shared code
        PASS = "your-password"
        ECHO = ("192.168.1.10", 7777)                   # a computer running a UDP echo server on port 7777

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.config(pm=wlan.PM_POWERSAVE)               # wlan.PM_NONE, wlan.PM_PERFORMANCE (the default) or wlan.PM_POWERSAVE
        wlan.connect(SSID, PASS)
        while not wlan.isconnected():
            time.sleep_ms(100)

        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(2)
        while True:
            t0 = time.ticks_ms()
            s.sendto(b"ping", ECHO)
            try:
                s.recvfrom(16)
                print("round trip", time.ticks_diff(time.ticks_ms(), t0), "ms")
            except OSError:
                print("no answer")
            time.sleep(3)
      `,
      output: `
        round trip 183 ms
        round trip 9 ms
        round trip 241 ms
      `,
      notes: ['The output is an example: with a DTIM period of 3 and maximum modem sleep, answers can wait a few hundred milliseconds, with no power save a few milliseconds.', 'In MicroPython the three modes are PM_NONE, PM_PERFORMANCE and PM_POWERSAVE; PM_PERFORMANCE is the default, the counterpart of minimum modem sleep.', 'To measure the saving, read the current with a meter: the program\'s own CPU time hides it unless automatic light sleep is enabled ([[light-sleep-and-automatic-power-management]]).']
    }
  ],
  examples: [
    {
      title: 'How long can a message wait?',
      q: 'A router sends beacons every 102.4 ms with a DTIM period of 3. A station in minimum modem sleep gets a command for it just after a DTIM beacon went by. How long might the command wait, and what if the station uses maximum modem sleep with a listen interval of 10?',
      steps: ['A DTIM period of 3 means a DTIM beacon every $3 \\times 102.4 = 307$ ms.', 'Just after one has passed, the wait is nearly the whole 307 ms; on average about 150 ms.', 'A listen interval of 10 beacons is $10 \\times 102.4 = 1024$ ms: the command can wait just over a second, and half a second on average.', 'Current falls in step, because the radio wakes a third as often.'],
      a: 'Up to about 0.3 s with minimum modem sleep, up to about 1 s with a listen interval of 10: the price of the saved current is delay.'
    }
  ],
  quiz: [
    { q: 'What does an access point do for a station that is in power save?', choices: ['Disconnects it', 'Holds its messages and announces them in beacons', 'Sends everything twice', 'Switches to another channel'], a: 1, why: 'The access point buffers the station\'s frames and lists the stations with waiting traffic in each beacon, so the station can sleep and wake only to listen.' },
    { q: 'A device is in minimum modem sleep but still draws about 20 mA. Why?', choices: ['The radio is stuck on', 'The processor keeps running between beacons', 'The router is too far away', 'The DTIM is wrong'], a: 1, why: 'Modem sleep switches off only the radio. The CPU and the peripherals keep running; automatic light sleep is needed to rest the CPU as well.' },
    { q: 'Which change gives the longest possible delay for a message to a station?', choices: ['DTIM 1 with minimum modem sleep', 'No power save', 'Maximum modem sleep with a listen interval of 10', 'Raising the transmit power'], a: 2, why: 'A listen interval of 10 beacons is about a second between wake-ups. DTIM 1 is about a tenth of a second, and no power save has no wait.' },
    { q: 'Target wake time is available on every ESP32-family chip with Wi-Fi.', a: false, why: 'It is a Wi-Fi 6 feature: among the chips only the C6, C5, C61 and S31 have it, and the access point must support it too.' }
  ],
  applications: [
    'Smart plugs, bulbs and switches that must stay on the network and respond within a second.',
    'Wi-Fi sensors with a long listen interval that send a reading now and then.',
    'Always-connected devices on a battery, such as wireless remotes and portable displays.',
    'Wi-Fi 6 battery devices that wake on a TWT schedule.'
  ],
  sources: [
    'IEEE 802.11 (power-save mode, beacons, DTIM and target wake time in 802.11ax).',
    'Espressif, *ESP-IDF Programming Guide*, "Low Power Mode in Wi-Fi Scenarios" and the Wi-Fi driver reference (esp_wifi_set_ps, listen interval, iTWT).',
    'Arduino core for ESP32, Wi-Fi API (setSleep); MicroPython *network.WLAN* (config pm).'
  ],
  sim: { id: 'sl-staying-connected', params: { mode: 'dtim' } }
},

/* ================================================================ sleepy-ble-zigbee-thread */
{
  id: 'sleepy-ble-zigbee-thread',
  parent: 'sleep-and-low-power',
  title: 'Sleepy Bluetooth, Zigbee and Thread devices',
  level: 3,
  short: 'Bluetooth LE, Zigbee and Thread were designed for coin cells. They stay reachable while mostly asleep by agreeing a schedule: advertise now and then, wake each connection interval, or poll the parent.',
  keywords: ['sleepy end device', 'SED', 'BLE advertising interval', 'connection interval', 'peripheral latency', 'poll period', 'Zigbee end device', 'Thread child', 'parent', 'coin cell', 'BLE beacon current', 'advertising burst'],
  prereq: ['power-modes', 'ble-advertising', 'ieee-802-15-4'],
  related: ['ble-connection-parameters', 'zigbee-device-types-and-clusters', 'thread', 'zigbee-on-esp', 'matter', 'aa-cells-and-coin-cells', 'wifi-power-save-and-dtim'],
  body: `Bluetooth LE, Zigbee and Thread were designed for devices that run for a year on a coin cell. They all solve the problem "stay reachable while asleep" with the trick Wi-Fi's DTIM uses: agree a schedule, then wake only for the moments it names.

### Bluetooth LE

- **Advertising.** A beacon sends a short packet on three channels every *advertising interval*, from 20 ms to 10.24 s. Its average current is the charge of one event divided by the interval. With an event of 3 ms at 12 mA and 10 µA between events, an interval of 100 ms averages about 0.37 mA, 1 s about 46 µA and 10 s about 14 µA. A phone scanning in the background catches a beacon only if it listens at the same moment: long intervals mean slow discovery.
- **Connection.** Once connected, the two sides agree a *connection interval* (7.5 ms to 4 s) and a *peripheral latency*, the number of events the peripheral may skip. The peripheral wakes once per interval times (1 + latency): a small interval gives a quick response and a high current. Phones may refuse or override what a peripheral asks ([[ble-connection-parameters]]).

On an ESP32, advertising at a long interval saves the radio, but a running CPU still draws its tens of milliamps. A real sleepy node either uses automatic light sleep in ESP-IDF, or does what the program below does: wake, advertise for half a second, and go back into deep sleep.

### Zigbee and Thread: the sleepy end device

Routers (mains-powered lamps and plugs) listen all the time. A battery device joins as a **sleepy end device**: its radio is off nearly always, and every *poll period* it asks its parent, "anything for me?" The parent holds the messages until the next poll. Both networks forget a child that has not polled within an agreed timeout. Chips with the 802.15.4 radio: ESP32-C6, H2, C5 and S31 in the catalogue. The H2's catalogue figures are 7 µA asleep and 25 mA receiving.

The cost is latency: a command to a sleepy device waits for the next poll, on average half a poll period. A lock or a thermostat valve can accept a second or two; a wall switch that controls a lamp is better as a router. Matter devices on Thread follow the same pattern.

### The numbers

The same law holds in every case: average current is $\\text{base} + (\\text{event charge}) / \\text{interval}$, and the delay is the interval. Double the interval and the current approaches the base current, with no further gain once the base dominates. The simulation draws the curve.

> [!key] Bluetooth LE, Zigbee and Thread stay reachable while asleep by agreeing a schedule: an advertising interval, a connection interval with peripheral latency, or a poll period to the parent. Longer intervals save current and add delay; on an ESP32 pair them with light sleep or deep sleep so the CPU rests too.`,
  ideas: [
    'A BLE beacon\'s average current is the charge of one advertising event divided by the interval: about 46 µA at 1 s with typical figures.',
    'A BLE peripheral wakes once per connection interval times (1 + latency); longer means less current and slower response.',
    'Zigbee and Thread sleepy end devices keep the radio off and poll their parent every poll period; commands wait for the next poll.',
    'On an ESP32 the interval alone saves the radio, not the CPU: pair it with light sleep or deep sleep.'
  ],
  pitfalls: [
    'A long advertising interval makes a beacon last for ever on a coin cell — It lowers the average, but the cell must also deliver the 12 mA pulses, and a CR2032 cannot without help; a phone also needs time to notice rare beacons.',
    'A Zigbee or Thread lamp can sleep to save power — A lamp is mains-powered and must route traffic: only battery end devices sleep, and they accept the delay of the poll period.',
    'The connection interval is mine to choose — The central (often a phone) has the last word, and many phones enforce limits on what a peripheral may ask.'
  ],
  terms: [
    { term: 'Advertising interval', also: ['adv interval'], def: 'The time between a Bluetooth LE device\'s advertising events, from 20 ms to 10.24 s. A longer interval lowers the average current and slows discovery.' },
    { term: 'Connection interval', also: ['connection parameters', 'peripheral latency', 'slave latency'], def: 'In a Bluetooth LE connection, the time between the moments the two devices exchange data (7.5 ms to 4 s). Peripheral latency lets the peripheral skip some of them to save current.' },
    { term: 'Sleepy end device', also: ['SED', 'sleepy child', 'Zigbee end device'], def: 'A Thread or Zigbee node with the radio off most of the time. It periodically polls its parent router for waiting messages. Battery sensors and buttons are sleepy end devices.' },
    { term: 'Poll period', also: ['data poll', 'polling interval'], def: 'How often a sleepy end device asks its parent for waiting messages. It sets the average current and the delay with which a command reaches the device.' },
    { term: 'Parent', also: ['parent router', 'Thread router'], def: 'The always-on router that holds the messages for a sleepy child between its polls and relays its own traffic.' }
  ],
  choose: {
    good: ['A beacon that advertises at 1 s or longer, or a burst and deep sleep, for rare data', 'A sleepy end device for a battery sensor, button or valve on Thread or Zigbee', 'Peripheral latency to save current when the central rarely sends'],
    avoid: ['A short advertising interval on a coin cell', 'A sleepy end device for something that must respond at once or route traffic', 'Relying on the CPU resting in a sketch with no sleep configured'],
    check: ['What your phone or hub actually accepts for the interval', 'The peak current the cell can deliver during the radio event', 'The delay a command can tolerate before choosing the poll period']
  },
  code: [
    {
      title: 'Advertise for half a second, then deep sleep',
      about: 'The node wakes every ten seconds, advertises its name every 100 ms for half a second, so a scanner hears it about five times, and sleeps again. The CPU and the radio are both off for 95 % of the time.',
      needs: 'An ESP32-family board with Bluetooth LE (not the S2) and a phone with a BLE scanner app.',
      wiring: [['USB', 'power']],
      blocks: `
        when started
          start BLE as [sleepy-node]
          set advertising interval to (100) milliseconds :: ble
          start advertising
          wait (0.5) seconds
          deep sleep for (10) seconds
      `,
      cpp: String.raw`
        #include <BLEDevice.h>

        void setup() {
          BLEDevice::init("sleepy-node");
          BLEAdvertising *adv = BLEDevice::getAdvertising();
          adv->setMinInterval(160);                     // units of 0.625 ms: 160 = 100 ms
          adv->setMaxInterval(160);
          BLEDevice::startAdvertising();
          delay(500);                                   // about five advertising events
          esp_sleep_enable_timer_wakeup(10ULL * 1000000ULL);
          esp_deep_sleep_start();
        }

        void loop() {}
      `,
      py: String.raw`
        import bluetooth, machine, time

        ble = bluetooth.BLE()
        ble.active(True)
        name = b"sleepy-node"
        adv = b"\x02\x01\x06" + bytes((len(name) + 1, 0x09)) + name      # flags + complete local name
        ble.gap_advertise(100_000, adv_data=adv)        # interval in microseconds: 100 ms
        time.sleep_ms(500)                              # about five advertising events
        ble.active(False)
        machine.deepsleep(10_000)
      `,
      notes: ['A reading can ride in the advertisement itself, in the manufacturer data, so a scanner gets it without connecting ([[ble-beacons]]).', 'The scan on the phone side decides how many of the five events are noticed; if the scanner sees too few, advertise longer or faster.']
    }
  ],
  examples: [
    {
      title: 'A beacon on a coin cell',
      q: 'A BLE beacon sends a 3 ms event at 12 mA every second and sleeps at 10 µA between events. What is its average current, and what would it be at 100 ms and at 10 s?',
      steps: ['One event draws $12 \\text{ mA} \\times 0.003 \\text{ s} = 0.036$ mA·s.', 'At 1 s: $0.036 + 0.01 \\times 0.997 = 0.046$ mA = 46 µA.', 'At 100 ms: $(0.036 + 0.01 \\times 0.097) / 0.1 = 0.37$ mA.', 'At 10 s: $(0.036 + 0.01 \\times 9.997) / 10 \\approx 0.0136$ mA = 14 µA.'],
      a: 'About 46 µA at 1 s, 0.37 mA at 100 ms and 14 µA at 10 s. A 1 s beacon on a 225 mAh CR2032 lasts several months on paper; the cell\'s limited pulse current and self-discharge shorten it.'
    }
  ],
  quiz: [
    { q: 'What does a Thread sleepy end device do to receive a message?', choices: ['Listens continuously', 'Polls its parent router at its poll period', 'Wakes on a Wi-Fi beacon', 'Waits for a Bluetooth connection'], a: 1, why: 'A sleepy end device keeps its radio off and asks its parent whether anything is waiting, every poll period. The parent holds the messages in between.' },
    { q: 'You raise a BLE beacon\'s advertising interval from 100 ms to 1 s. What happens to its average current and discovery?', choices: ['Current falls roughly eightfold, discovery gets slower', 'Current rises, discovery is faster', 'Nothing changes', 'Current falls, discovery is faster'], a: 0, why: 'The event charge is shared by ten times the time, so the average falls about eightfold (0.37 mA to 46 µA with typical figures), but a scanner hears the beacon ten times less often.' },
    { q: 'Why should a mains-powered Zigbee lamp not be a sleepy end device?', choices: ['It would draw more current', 'It must route other devices\' traffic and answer at once', 'Lamps have no radio', 'Sleepy devices cannot switch a load'], a: 1, why: 'A sleepy end device is reachable only at its polls and cannot relay traffic for others. A mains device does not need the saving and the network needs its routing.' },
    { q: 'On an ESP32 sketch with no sleep configured, a longer BLE advertising interval alone brings the board to microamps.', a: false, why: 'The interval only rests the radio. The CPU keeps running at tens of milliamps unless the sketch uses light or deep sleep.' }
  ],
  applications: [
    'Beacons, asset tags and BLE temperature tags on coin cells.',
    'Zigbee and Thread door sensors, buttons and thermostat valves on AA cells.',
    'Matter-over-Thread battery devices on the ESP32-H2 and C6.',
    'Wearables that advertise and connect to a phone on a schedule.'
  ],
  sources: [
    'Bluetooth Core Specification: advertising and connection parameters (advertising interval, connection interval, peripheral latency).',
    'IEEE 802.15.4 and the Thread and Zigbee specifications: end devices, data polling and child timeouts.',
    'Espressif, *ESP-IDF Programming Guide*, Bluetooth LE and OpenThread sleepy end device documentation; Arduino core BLE and Zigbee libraries.'
  ],
  sim: { id: 'sl-staying-connected', params: { mode: 'ble' } }
},

/* ================================================================ light-sleep-and-automatic-power-management */
{
  id: 'light-sleep-and-automatic-power-management',
  parent: 'sleep-and-low-power',
  title: 'Light sleep and automatic power management',
  level: 2,
  short: 'Light sleep pauses the processor but keeps RAM and the program\'s place, so the chip wakes in a moment and carries on. Automatic power management does it for you, whenever nothing has work to do.',
  keywords: ['light sleep', 'esp_light_sleep_start', 'machine.lightsleep', 'automatic light sleep', 'power management', 'esp_pm_configure', 'CONFIG_PM_ENABLE', 'dynamic frequency scaling', 'DFS', 'tickless idle', 'GPIO wake-up', 'gpio_wakeup_enable', 'UART wake-up'],
  prereq: ['power-modes', 'wake-up-sources', 'tasks'],
  related: ['wifi-power-save-and-dtim', 'deep-sleep', 'esp-idf-basics', 'sleepy-ble-zigbee-thread', 'hardware-timers', 'battery-life-budget'],
  body: `Light sleep is the middle rung. The processor is paused and its clocks are gated, but RAM, the registers and the program's place are kept, so when something wakes the chip it carries on at the next line, with every variable intact and no restart. The price is a current well above deep sleep: from the catalogue 85 µA (ESP32-H2), 130 µA (C3), 140 µA (C2), 180 µA (C6), 240 µA (S3), 750 µA (S2) and 800 µA (ESP32), which is twelve to eighty times the deep-sleep figure of the same chip.

### Manual light sleep

You arm the wake-up sources and call the sleep function; it returns when one fires. Light sleep accepts more sources than deep sleep: the timer, **any GPIO** at a level, the UART, and Wi-Fi and Bluetooth events. In C++ it is \`esp_light_sleep_start()\`, in MicroPython \`machine.lightsleep()\`. While asleep, peripherals that run from the processor's clocks pause: a transfer on I2C or SPI, a UART frame, PWM from the LEDC unless you ask MicroPython to keep it running with \`lightsleep=True\`. Pins keep their levels.

Use it for waits that must keep their place: a handheld that wakes on a button, a loop that needs to be back in under a millisecond.

### Automatic light sleep

In ESP-IDF the system can do this by itself. With power management compiled in, one call tells it the clock range and allows light sleep: whenever every task is blocked and nothing holds the CPU awake, the clock drops to the minimum and, after a short idle time, the chip enters light sleep until the next timer or event. With Wi-Fi connected it wakes for each DTIM beacon without any wake-up source being set ([[wifi-power-save-and-dtim]]).

Espressif's measurements on a C3 board: about 21 mA in plain modem sleep, 11 mA with the clock scaled down, and 0.31 to 1.4 mA with automatic light sleep. The saving appears only if the program lets the CPU rest: a task that polls in a busy loop, or holds a power lock, keeps the chip awake. Use blocking waits, timers and events ([[tasks]]).

Two requirements: power management and FreeRTOS tickless idle must both be enabled in the build, or the call fails with "not supported". The Arduino core's ready-made libraries are, as far as the author knows, built without power management, so automatic light sleep is an ESP-IDF feature; MicroPython offers manual light sleep only.

> [!key] Light sleep pauses the CPU and keeps RAM, so the program resumes at the next line: use it for short waits that must keep their place, with any GPIO as a wake-up. In ESP-IDF automatic light sleep does this whenever the system is idle, and it turns Wi-Fi modem sleep into a low average current.`,
  ideas: [
    'Light sleep pauses the CPU and keeps RAM and the program\'s place: the call returns when a source fires and the program carries on.',
    'It draws 85 to 800 µA depending on the chip, twelve to eighty times deep sleep, but it wakes quickly and keeps its state.',
    'Any GPIO, the UART and Wi-Fi events can wake light sleep; in deep sleep only the RTC pins can.',
    'In ESP-IDF, esp_pm_configure with light sleep enabled lets the system sleep by itself when idle and wake for Wi-Fi beacons.'
  ],
  pitfalls: [
    'Light sleep is deep sleep with a faster wake-up — It costs twelve to eighty times the current: use it for short waits that must keep their state, and deep sleep for long ones.',
    'Automatic light sleep works in any sketch — It needs power management and tickless idle built in, which ESP-IDF projects can enable; the Arduino core\'s ready-made libraries do not, as far as the author knows.',
    'The chip sleeps as soon as I enable the feature — Only if every task is blocked: a busy polling loop or a held power lock keeps it awake, and the current stays at tens of milliamps.'
  ],
  terms: [
    { term: 'Light sleep', also: ['esp_light_sleep_start', 'machine.lightsleep'], def: 'A sleep state in which the CPU is paused and its clocks gated but RAM and the program\'s place are kept. The chip wakes quickly and carries on at the next instruction.' },
    { term: 'Automatic light sleep', also: ['auto light sleep', 'auto light-sleep'], def: 'An ESP-IDF feature in which the system enters light sleep by itself whenever no task is ready and no lock is held, and wakes for timers and Wi-Fi beacons.' },
    { term: 'Dynamic frequency scaling', also: ['DFS', 'CPU frequency scaling'], def: 'Lowering the CPU clock when nothing needs speed and raising it on demand. In ESP-IDF it is set by the minimum and maximum frequencies of the power-management configuration.' },
    { term: 'Tickless idle', also: ['FreeRTOS tickless idle'], def: 'A FreeRTOS mode in which the periodic tick is stopped while all tasks are blocked, so the system can sleep until the next real event. Automatic light sleep depends on it.' },
    { term: 'Power lock', also: ['esp_pm_lock', 'PM lock'], def: 'A request by a driver or task that keeps the CPU at full speed, or awake, while it is held. Any held lock prevents automatic light sleep.' }
  ],
  choose: {
    good: ['Light sleep for waits of milliseconds to a minute that must keep their variables', 'Any-GPIO wake-up for a button or a sensor output while keeping the program state', 'Automatic light sleep in ESP-IDF for a connected device that must respond quickly'],
    avoid: ['Light sleep for waits of many minutes: deep sleep costs a twentieth', 'Busy-polling loops, which keep the chip awake', 'Expecting automatic light sleep in an Arduino sketch'],
    check: ['The catalogue\'s light-sleep current for your chip, and the board\'s measured figure', 'That every wake-up source you need works in light sleep on your chip', 'That no task or driver holds a power lock']
  },
  code: [
    {
      title: 'Count button presses in light sleep',
      about: 'The chip sleeps in light sleep until the button is pressed, then increments a counter and sleeps again. The counter is an ordinary variable and the program resumes at the next line: no restart, no RTC memory.',
      needs: 'An original ESP32 DevKit, a push button and a 10 kΩ resistor.',
      wiring: [['GPIO33', 'button → 3.3 V', '10 kΩ from the pin to GND keeps it low']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (33) as [input v]
          set [presses v] to (0)
        forever
          print (join [presses so far: ] (presses))
          enable wake on pin (33) when high :: power
          light sleep :: power
          change [presses v] by (1)
          wait until <(read pin (33)) = [LOW v]>
        end
      `,
      cpp: String.raw`
        const gpio_num_t BUTTON = GPIO_NUM_33;          // button to 3.3 V, 10 k to GND: high when pressed
        int presses = 0;                                // an ordinary variable: light sleep keeps RAM

        void setup() {
          Serial.begin(115200);
          pinMode(BUTTON, INPUT);
          gpio_wakeup_enable(BUTTON, GPIO_INTR_HIGH_LEVEL);   // this pin may wake the chip from light sleep
          esp_sleep_enable_gpio_wakeup();
        }

        void loop() {
          Serial.printf("presses so far: %d\n", presses);
          Serial.flush();
          esp_light_sleep_start();                      // waits here until the pin goes high
          presses++;
          while (digitalRead(BUTTON) == HIGH) delay(10);      // wait for release, or it wakes again at once
        }
      `,
      py: String.raw`
        import machine, esp32, time
        from machine import Pin

        BUTTON = Pin(33, Pin.IN)                        # button to 3.3 V, 10 k to GND: high when pressed
        presses = 0                                     # an ordinary variable: light sleep keeps RAM

        esp32.wake_on_gpio((BUTTON,), esp32.WAKEUP_ANY_HIGH)    # this pin may wake the chip from light sleep
        while True:
            print("presses so far:", presses)
            time.sleep_ms(50)
            machine.lightsleep()                        # waits here until the pin goes high
            presses += 1
            while BUTTON.value():                       # wait for release, or it wakes again at once
                time.sleep_ms(10)
      `,
      output: `
        presses so far: 0
        presses so far: 1
        presses so far: 2
      `,
      notes: ['On native-USB boards the serial port may blink off while the chip sleeps; the sleep itself is what matters.', 'The wake-up pin must be armed before every sleep in some setups; if the board wakes only once, arm it again at the top of the loop.']
    },
    {
      title: 'Automatic light sleep in ESP-IDF',
      about: 'One call tells the system its clock range and lets it enter light sleep when idle. Together with the default minimum modem sleep, a connected Wi-Fi station then wakes only for the beacons it must hear. A project setting for power management and tickless idle is also needed.',
      needs: 'An ESP-IDF 5.5 project that starts Wi-Fi in the usual way, with power management and FreeRTOS tickless idle enabled in its settings.',
      wiring: [['USB', 'power, and a meter in series to see the effect']],
      blocks: `
        when started
          connect to Wi-Fi [your-ssid] password [your-password]
          set CPU speed between (40) and (160) MHz and allow light sleep :: power
          set Wi-Fi power save to [minimum modem sleep v] :: wifi
      `,
      idf: String.raw`
        #include "esp_pm.h"
        #include "esp_wifi.h"

        void app_main(void) {
            // ... start Wi-Fi as usual: esp_netif, esp_wifi_init, esp_wifi_set_config, esp_wifi_start, esp_wifi_connect ...

            esp_pm_config_t pm = {
                .max_freq_mhz = 160,
                .min_freq_mhz = 40,
                .light_sleep_enable = true,             // sleep when no task is ready and no lock is held
            };
            ESP_ERROR_CHECK(esp_pm_configure(&pm));
            ESP_ERROR_CHECK(esp_wifi_set_ps(WIFI_PS_MIN_MODEM));   // wake for each DTIM beacon only
        }
      `,
      na: {
        cpp: 'The Arduino core\'s ready-made libraries are, as far as the author knows, built without power management, so esp_pm_configure cannot enable light sleep from a sketch; use ESP-IDF (or build the core as an ESP-IDF component).',
        py: 'MicroPython has manual light sleep (machine.lightsleep) but no automatic power management.'
      },
      notes: ['If esp_pm_configure returns "not supported", enable power management and tickless idle in the project\'s settings (menuconfig).', 'Measure with a meter in series: the saving shows up as an average current of about a milliamp instead of tens, for a connected station on a typical router.']
    }
  ],
  examples: [
    {
      title: 'A button every few seconds: light or deep sleep?',
      q: 'A handheld counts button presses that come about every 20 seconds. It must remember the count and respond within a millisecond. Light sleep draws 130 µA, deep sleep 5 µA, and a restart costs about 12 mA·s. Which is better?',
      steps: ['Light sleep for 20 s costs $0.130 \\times 20 = 2.6$ mA·s per interval.', 'Deep sleep costs $0.005 \\times 20 = 0.1$ mA·s plus the 12 mA·s restart: 12.1 mA·s per interval.', 'Light sleep is about five times cheaper here, and it also keeps the count and answers at once.', 'The break-even is about $12 / 0.125 \\approx 96$ s between presses; beyond a couple of minutes deep sleep wins.'],
      a: 'Light sleep, for presses every 20 s. For presses minutes apart, deep sleep with the count kept in RTC memory is cheaper.'
    }
  ],
  quiz: [
    { q: 'After `esp_light_sleep_start()` returns, where does the program continue and what is the state of its variables?', choices: ['At the beginning, variables reset', 'At the next line, variables intact', 'At the next line, variables reset', 'At the beginning, variables intact'], a: 1, why: 'Light sleep keeps RAM and the program counter. The call simply returns when a wake-up source fires; nothing restarts.' },
    { q: 'Which wake-up source works for light sleep on any pin, but in deep sleep only on RTC pins?', choices: ['The timer', 'GPIO', 'Touch', 'The coprocessor'], a: 1, why: 'Light sleep can be woken by any GPIO. In deep sleep the pin must be in the always-on RTC domain.' },
    { q: 'A device with automatic light sleep configured still draws 25 mA. What is the likeliest cause?', choices: ['A task or driver keeps the CPU awake, such as a busy polling loop or a held power lock', 'The Wi-Fi radio is broken', 'The battery is too full', 'Light sleep needs a 3.3 V supply'], a: 0, why: 'The system sleeps only when every task is blocked and no lock is held. A busy loop or a lock keeps the CPU running, so the chip never sleeps.' },
    { q: 'Light sleep is the better choice than deep sleep for waits of an hour.', a: false, why: 'Light sleep draws twelve to eighty times as much current as deep sleep. For long waits deep sleep wins, even with the cost of a restart.' }
  ],
  applications: [
    'Handhelds and wearables that wake on a button and keep their state.',
    'Connected devices, such as plugs and switches, that must answer within a second.',
    'Wi-Fi devices running ESP-IDF with automatic light sleep and modem sleep.',
    'Protocol firmware that must resume exactly where it stopped, with timers running.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "Sleep Modes" and "Power Management" (esp_pm_configure, automatic light sleep, tickless idle).',
    'Espressif, "Low Power Mode in Wi-Fi Scenarios": the measured currents of modem sleep and automatic light sleep per chip.',
    'MicroPython documentation, *machine* library: lightsleep(); *esp32* library: wake_on_gpio.'
  ],
  sim: { id: 'sl-staying-connected', params: { mode: 'dtim', chip: 'esp32-c3' } }
},

/* ================================================================ battery-life-budget */
{
  id: 'battery-life-budget',
  parent: 'sleep-and-low-power',
  title: 'A battery-life budget',
  level: 2,
  short: 'Battery life is a sum: the charge of each phase of the cycle, the cell\'s usable capacity, its self-discharge, and a margin. Done in five steps it predicts the weeks you will get, and shows which phase to attack.',
  keywords: ['battery life', 'budget', 'average current', 'capacity', 'self-discharge', 'mAh', 'duty cycle', 'power budget', 'usable capacity', 'margin', 'phases', 'profiler', 'estimate'],
  prereq: ['deep-sleep', 'the-board-is-not-the-chip', 'lithium-cells'],
  related: ['fast-wifi-reconnect', 'measuring-current', 'usb-power-meters-and-profilers', 'aa-cells-and-coin-cells', 'solar-power', 'project-weather-station', 'esp-as-a-power-meter'],
  body: `"How long will it run on this battery?" is a sum, and it is easy to get wrong. The method is five steps; the calculator is [the battery calculator](#/tools/espcalc/battery), and the simulation on this page runs the same sum.

### The five steps

1. **List the phases of one cycle**: wake and boot, sensor, connect, send, sleep. For each, the time and the current, measured rather than guessed.
2. **Average current** = total charge of the cycle ÷ the length of the cycle ([[deep-sleep|the formula]]).
3. **Usable capacity:** the rated mAh times about 0.8, less in the cold and at high pulse currents.
4. **Self-discharge:** a lithium cell loses a few per cent a month. For 3 % of 1000 mAh that is 0.042 mA all the time, eight times the 5 µA of the chip.
5. **Margin:** plan on half of the result.

### A worked budget

An ESP32-C3 board wakes every ten minutes. It reads a sensor and sends over a full Wi-Fi connection. The board sleeps at 0.105 mA (the chip's 5 µA plus 100 µA of board). The cell is 1000 mAh.

| Phase | Time | Current | Charge |
|---|---|---|---|
| Wake and boot | 0.25 s | 20 mA | 5.0 mA·s |
| Read the sensor | 0.20 s | 20 mA | 4.0 mA·s |
| Connect and send | 3.25 s | 87 mA | 282.8 mA·s |
| Sleep | 596.3 s | 0.105 mA | 62.6 mA·s |
| **One cycle** | **600 s** | | **354.4 mA·s** |

The average is $354.4 / 600 = 0.59$ mA. Usable capacity 800 mAh gives $800 / 0.59 \\approx 56$ days; with self-discharge, about 53 days; with the margin, plan on about four weeks. The radio phase is 80 % of the charge and the board's sleep 18 %. A fast reconnect (0.55 s of radio) takes the average to 0.20 mA and the life to about 138 days.

### What the sum forgets

- **The pulse.** A cell must deliver 87 mA or more in bursts. A CR2032 cannot; the voltage sags and the chip resets ([[current-peaks-and-capacitors]]).
- **The regulator.** A converter wastes some of the energy, and a linear regulator needs the cell above 3.3 V plus its dropout ([[regulators-ldo-and-buck]]).
- **The weather.** Cold cuts capacity; a router that is slow in the morning lengthens the awake time.

### Measure, then trust

Average the awake time over days with the program below, read the sleep current with a meter on the real board, and re-run the sum with those numbers ([[measuring-current]]).

> [!key] Battery life is the usable capacity divided by the average current plus the self-discharge, with the average built from the measured charge of every phase of the cycle. Measure the phases, include the board's own sleep current, and plan on half.`,
  ideas: [
    'List every phase of the cycle with its measured time and current; the average is total charge divided by cycle time.',
    'Usable capacity is about 80 % of the rating, and self-discharge adds a continuous drain of a few per cent a month.',
    'In a typical Wi-Fi sensor the radio phase is most of the charge and the board\'s sleep current is the next largest share.',
    'Plan on half the calculated life: cold, pulses, ageing and slow routers all shorten it.'
  ],
  pitfalls: [
    'The calculator says a year, so it will last a year — It assumes your numbers are right and the cell can deliver the pulses. Measure the phases, include the board\'s sleep current and self-discharge, and plan on half.',
    'Self-discharge is negligible — A lithium cell loses a few per cent of its capacity a month, which as a current can exceed the chip\'s own sleep current several times over.',
    'The chip\'s 5 µA is the sleep term — On a board it is usually 100 µA or more, which in the example above is 18 % of all the charge.'
  ],
  terms: [
    { term: 'Power budget', also: ['energy budget', 'current budget'], def: 'A table of the phases of a device\'s work cycle with the time, current and charge of each, from which the average current and the battery life follow.' },
    { term: 'Usable capacity', also: ['derating', 'cut-off voltage'], def: 'The part of a battery\'s rated capacity that can really be drawn before the voltage falls too low: about 80 % in practice, less in the cold or at high current.' },
    { term: 'Self-discharge', also: ['shelf loss', 'leakage'], def: 'The slow loss of charge from a battery with nothing connected, a few per cent a month for lithium cells. As an equivalent current it can be larger than the sleep current of the chip.' },
    { term: 'Charge', also: ['mA·s', 'mAh', 'coulombs'], def: 'Current multiplied by time: milliamp-seconds for one cycle of a device, milliamp-hours for a battery\'s capacity. One mAh is 3600 mA·s.' }
  ],
  choose: {
    good: ['A measured budget: every phase timed, every current read', 'The board\'s real sleep current in the budget, not the chip\'s', 'A margin of two on the result'],
    avoid: ['Using the chip\'s datasheet sleep current for a board', 'Ignoring self-discharge and pulse capability', 'Trusting a battery label such as "9900 mAh" for an 18650'],
    check: ['The awake time, averaged over days on the real network', 'That the cell can deliver the peak current without sagging below the brownout level', 'The sleep current of the finished board, with the battery connected']
  },
  code: [
    {
      title: 'Measure your own awake time',
      about: 'The program keeps two numbers in RTC memory: how many times it has woken and the total milliseconds it spent awake. After each wake it prints the average awake time, the number a battery budget needs. Replace the 300 ms wait with your real job.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          set [wakes v] to ((load [wakes]) + (1))
          do the job :: my
          set [total v] to (((load [awake_ms]) + (milliseconds since start)) + (250))
          save (wakes) as [wakes]
          save (total) as [awake_ms]
          print (join [average awake ms: ] (round ((total) / (wakes))))
          deep sleep for (60) seconds
      `,
      cpp: String.raw`
        RTC_DATA_ATTR uint32_t wakes = 0;               // wake-ups so far (RTC memory)
        RTC_DATA_ATTR uint32_t awakeMs = 0;             // milliseconds spent awake, in total

        const uint32_t BOOT_MS = 250;                   // the time before the program starts: measure it once with a meter

        void setup() {
          Serial.begin(115200);
          delay(300);                                   // a stand-in for the job: sensor, connect, send

          wakes++;
          awakeMs += millis() + BOOT_MS;                // millis() counts from the start of the program
          Serial.printf("wake %lu: average awake %lu ms\n", (unsigned long)wakes, (unsigned long)(awakeMs / wakes));
          esp_sleep_enable_timer_wakeup(60ULL * 1000000ULL);
          Serial.flush();
          esp_deep_sleep_start();
        }

        void loop() {}
      `,
      py: String.raw`
        import machine, struct, time

        BOOT_MS = 250                                   # the time before the program starts: measure it once with a meter

        rtc = machine.RTC()
        raw = rtc.memory()
        wakes, awake_ms = struct.unpack("<II", raw) if len(raw) == 8 else (0, 0)

        time.sleep_ms(300)                              # a stand-in for the job: sensor, connect, send

        wakes += 1
        awake_ms += time.ticks_ms() + BOOT_MS           # ticks_ms() counts from the start of the program
        print("wake", wakes, ": average awake", awake_ms // wakes, "ms")
        rtc.memory(struct.pack("<II", wakes, awake_ms))
        time.sleep_ms(100)
        machine.deepsleep(60_000)
      `,
      output: `
        wake 1: average awake 561 ms
        wake 2: average awake 558 ms
        wake 3: average awake 559 ms
      `,
      notes: ['The first run starts the totals at zero; a power cut resets them.', 'The bootloader time (about 250 ms is a guess) is not counted by millis(): put a meter or an oscilloscope on the board once to find it ([[the-oscilloscope]]).']
    }
  ],
  examples: [
    {
      title: 'Plan the life from a budget',
      q: 'The sensor node in the table above averages 0.59 mA from a 1000 mAh cell. If you fit a 2 µA regulator, remove the LED and the board sleeps at 10 µA instead of 105 µA, with the same cycle, what happens to the life?',
      steps: ['Sleep charge: $0.010 \\times 596.3 = 6.0$ mA·s instead of 62.6.', 'One cycle: $5.0 + 4.0 + 282.8 + 6.0 = 297.8$ mA·s, so the average is $297.8 / 600 = 0.50$ mA.', 'Life: about 800 mAh over 0.50 mA plus self-discharge: roughly 62 days instead of 53.', 'The radio phase is now 95 % of the charge: the next saving is in the connection, not the sleep ([[fast-wifi-reconnect]]).'],
      a: 'The average falls from 0.59 to 0.50 mA and the life rises from about 53 to about 62 days. A fast reconnect would do far more.'
    }
  ],
  formulas: [
    {
      name: 'Battery life with self-discharge',
      expr: 'L = u*C/(I + s*C/M)',
      tex: 'L = \\frac{u\\,C}{I_{\\mathrm{avg}} + s\\,C / M}',
      vars: {
        L: { name: 'battery life', q: 'time', unit: 'day' },
        u: { name: 'usable fraction of the capacity', value: 0.8, min: 0.1, max: 1 },
        C: { name: 'rated capacity', q: 'charge', unit: 'mA·h', value: 1000 },
        I: { name: 'average current', q: 'current', unit: 'mA', value: 0.5, tex: 'I_{\\mathrm{avg}}' },
        s: { name: 'self-discharge per month', value: 0.03, min: 0, max: 0.5 },
        M: { name: 'one month (30 days)', q: 'time', unit: 's', value: 2592000, fixed: true }
      },
      solveFor: 'L',
      note: 'The self-discharge term is the equivalent continuous current s·C/M. It is the smaller part for a device averaging more than about 0.1 mA, and the larger one for a very low-power sensor.',
      stories: { L: 'A device averages {I} from a battery rated {C}, of which {u} is usable. Self-discharge is {s} of the capacity per month. How long does the battery last?' }
    }
  ],
  quiz: [
    { q: 'A 1000 mAh lithium cell self-discharges 3 % a month. What continuous current is that equivalent to?', choices: ['About 4 µA', 'About 42 µA', 'About 0.42 mA', 'About 4 mA'], a: 1, why: '$0.03 \\times 1000 \\text{ mAh} / 720 \\text{ h} \\approx 0.042$ mA = 42 µA, several times an ESP32\'s deep-sleep current.' },
    { q: 'In the worked budget, which phase takes most of the charge?', choices: ['The sleep', 'Wake and boot', 'The sensor reading', 'Connect and send'], a: 3, why: 'The radio phase, 3.25 s at 87 mA, is about 80 % of the 354 mA·s per cycle, even though it is under 1 % of the time.' },
    { q: 'A budget gives 120 days. What should you promise?', choices: ['120 days', 'About 60 days', '240 days', 'A year'], a: 1, why: 'Cold, pulse sag, cell ageing and a slow router all shorten the real life. Planning on half the calculated figure is a sensible margin until you have measured a deployed unit.' },
    { q: 'The chip\'s datasheet sleep current is the right figure for the sleep phase of a battery budget on a development board.', a: false, why: 'The board adds its regulator, LED, USB chip and divider. The sleep phase must use the current measured on the board, from the battery.' }
  ],
  applications: [
    'Predicting whether a garden or weather sensor will last the season on its cell.',
    'Choosing between a coin cell, two AA cells and an 18650 for a product.',
    'Deciding whether a faster connection or a better regulator is the bigger saving.',
    'Setting a service interval for deployed battery devices.'
  ],
  sources: [
    'Espressif datasheets: current consumption tables (receive, transmit, deep sleep) of the chip in question.',
    'Battery manufacturers\' datasheets: rated capacity, discharge curves, self-discharge and pulse capability of the cell.',
    'Espressif, *ESP-IDF Programming Guide*, "Low Power Mode in Wi-Fi Scenarios" and the power-measurement guidance of the sleep modes pages.'
  ],
  sim: { id: 'sl-cycle', params: { chip: 'esp32-c3', method: 'full', work: 200, board: 100 } }
}
);
