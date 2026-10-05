/* HYPER-ESP32 · content/human-inputs.js
 *
 * Topic "Buttons, knobs and touch" (human-inputs): buttons and switches, debouncing, long press and double click,
 * rotary encoders, keypads and key matrices, capacitive touch pins, joysticks, infrared remotes, RFID and NFC.
 * Simulations are in sims/human-inputs.js (ids start with hi-).
 */
Hyper.add(
/* ================================================================ buttons-and-switches */
{
  id: 'buttons-and-switches',
  parent: 'human-inputs',
  title: 'Buttons and switches',
  level: 1,
  short: 'A switch is two pieces of metal that touch or do not. Reading one means turning that into an honest voltage on a pin: wire it to ground, switch on the pull-up, and the pin reads low when pressed.',
  keywords: ['button', 'push button', 'tact switch', 'tactile switch', 'switch', 'toggle', 'slide switch', 'reed switch', 'limit switch', 'normally open', 'normally closed', 'active low', 'INPUT_PULLUP', 'pull-up', 'floating input', 'digitalRead', 'Pin.PULL_UP', 'edge detection'],
  prereq: ['pull-ups-and-pull-downs', 'digital-input', 'three-volt-logic'],
  related: ['debouncing', 'long-press-double-click', 'strapping-pins', 'input-only-and-special-pins', 'rc-filters-and-debounce', 'deep-sleep', 'electronics:switches', 'electronics:pull-resistors'],
  body: `A button is the oldest input there is: two pieces of metal that touch, or do not. The chip cannot see touching. It sees a voltage on a pin, so everything about reading a button is about making that voltage honest: close to 0 V when the contacts are closed, close to 3.3 V when they are open, and never something in between.

### The wiring that nearly always wins

Connect the switch between the GPIO pin and ground, and switch on the pin's **internal pull-up resistor** (about 45 kΩ on the ESP32). With the switch open the pull-up holds the pin high; pressing the switch shorts the pin to ground and it reads low. The button is **active low**: pressed means \`LOW\`, which feels backwards for a day and then never again. The mirror image (switch to 3.3 V, pull-down) works too, but ground-side switches are the family's habit: the BOOT button is wired so ([[strapping-pins]]).

| Wiring | Open | Pressed | What it costs |
|---|---|---|---|
| Switch to GND, pull-up (internal or external) | high | **low** | 3.3 V ÷ 45 kΩ ≈ 73 µA while held |
| Switch to 3.3 V, pull-down | low | **high** | the same, with the sign changed |
| Switch with *no* resistor | random | low | a floating pin reads noise: never do this |

The current matters only on batteries and for switches held closed for hours (a door contact): use a larger resistor.

### Which switch

- **Tactile (tact) switch**: the little square button on every dev board. Normally open, springs back. It has **four legs, but two pairs are joined inside**: wire across the pair that is open at rest, or the "button" is permanently closed.
- **Toggle, slide and rocker switches**: latching; the position stays until changed. Good for modes and "armed / disarmed".
- **Reed switch**: closes in a magnetic field, so it senses a magnet on a door, lid or float with no contact.
- **Micro or limit switch**: a snap-action lever with common, normally open and normally closed terminals ([[limit-switches-and-homing]]).

### Traps

- **Input-only pins have no pull resistors.** GPIO34–39 of the original ESP32 ignore \`INPUT_PULLUP\`: add a real resistor ([[input-only-and-special-pins]]).
- **Strapping pins.** A button to ground on a pin that must be high at reset can force download mode ([[strapping-pins]]).
- **Long leads** pick up noise. Add an external 4.7–10 kΩ pull-up, a few hundred ohms in series with the pin and perhaps 10–100 nF to ground ([[rc-filters-and-debounce]]).
- **Contact bounce.** The contacts chatter for a few milliseconds ([[debouncing]]).

### The press, not the pressed state

\`digitalRead\` says "the button is down *now*". A program usually wants "the button *went* down": compare with the value at the last pass and act on the change, as the program below does.

> [!key] Wire the switch between the pin and ground and enable the pull-up: the pin idles high and reads low when pressed. React to the change of state, not to the state, and remember the pitfalls: input-only pins, strapping pins, long cables and bounce.`,
  ideas: [
    'A switch becomes an input by giving the pin a defined idle level: a pull-up with the switch to ground is the standard way.',
    'An active-low button reads LOW when pressed and HIGH at rest.',
    'A pin with no pull resistor and no switch closed floats and reads noise; the input-only GPIO34–39 have no internal pulls at all.',
    'To act once per press, compare the reading with the previous one and react to the edge.'
  ],
  pitfalls: [
    'A button needs no resistor, the chip has pull-ups — Only on pins that have them. GPIO34–39 of the ESP32 do not, and a floating input reads random values.',
    'A pressed button reads HIGH — With the switch to ground and a pull-up it reads LOW; HIGH is the released state.',
    'Any two legs of a tact switch will do — Two pairs of legs are joined inside. Choose a pair that is open at rest, otherwise the switch is always closed.'
  ],
  terms: [
    { term: 'Normally open', also: ['NO', 'normally closed (NC)'], def: 'A switch whose contacts are apart when nothing acts on it, so it conducts only while pressed. A normally closed (NC) switch is the opposite: it conducts at rest and opens when operated.' },
    { term: 'Active low', also: ['inverted logic', 'low-active'], def: 'Said of an input or output whose "on" or "pressed" state is the low level. A button to ground with a pull-up is active low.' },
    { term: 'Pull-up resistor', also: ['pull-up', 'INPUT_PULLUP'], def: 'A resistor from a pin to the supply that holds the pin high when nothing else drives it. The ESP32 has one inside most pins, about 45 kΩ, which software switches on.' },
    { term: 'Floating input', also: ['floating pin', 'open input'], def: 'A pin connected to nothing and with no pull resistor. Its voltage drifts with stray fields and a finger nearby, so the program reads arbitrary values.' },
    { term: 'Tactile switch', also: ['tact switch', 'push button'], def: 'A small spring-loaded momentary push button for circuit boards. It is normally open and has four legs, joined in pairs inside.' },
    { term: 'Reed switch', also: ['reed relay contact', 'magnetic contact'], def: 'Two thin metal reeds sealed in a glass tube that close when a magnet comes near. It senses a magnet without any mechanical contact.' }
  ],
  choose: {
    good: ['Tact switches for panels and boards: cheap, small, normally open', 'A reed switch and a magnet for doors, lids and float levels', 'Toggle or slide switches for modes that must stay where they are put', 'Micro switches for limit stops on moving parts'],
    avoid: ['Switches without any pull resistor on the line', 'A button on a strapping pin unless it is meant to be the boot button', 'Long unshielded wires with only the weak internal pull-up', 'Contacts rated for mains voltage used as a logic input without isolation'],
    check: ['That the pin has an internal pull-up, or add an external resistor', 'Which legs of the tact switch are joined', 'The idle current through the pull-up on a battery project', 'Whether the program reacts to the change of level and not to the level']
  },
  code: [
    {
      title: 'Toggle an LED with a button',
      about: 'Each press flips the LED. The program remembers whether the button was down on the last pass and acts only at the moment it goes down.',
      needs: 'An ESP32 DevKit, a push button, an LED and a 220 Ω resistor.',
      wiring: [['GPIO4', 'button → GND', 'internal pull-up, so no resistor'], ['GPIO26', '220 Ω → LED anode, cathode → GND']],
      blocks: `
        when started
          set pin (4) as [input with pull-up v]
          set pin (26) as [output v]
          set [wasDown v] to <false>
          set [ledOn v] to <false>
        forever
          set [down v] to <(read pin (4)) = [LOW v]>
          if <<down> and <not <wasDown>>> then
            set [ledOn v] to <not <ledOn>>
            set pin (26) to (ledOn)
          end
          set [wasDown v] to (down)
          wait (0.01) seconds
        end
      `,
      cpp: String.raw`
        const int BUTTON = 4;            // button between GPIO4 and GND
        const int LED = 26;              // LED with a 220 ohm resistor to GND

        bool wasDown = false;
        bool ledOn = false;

        void setup() {
          pinMode(BUTTON, INPUT_PULLUP); // idles HIGH; pressing connects the pin to GND
          pinMode(LED, OUTPUT);
        }

        void loop() {
          bool down = digitalRead(BUTTON) == LOW;
          if (down && !wasDown) {        // the moment of pressing, not the time it is held
            ledOn = !ledOn;
            digitalWrite(LED, ledOn);
          }
          wasDown = down;
          delay(10);                     // polling every 10 ms also hides most contact bounce
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        button = Pin(4, Pin.IN, Pin.PULL_UP)   # button between GPIO4 and GND
        led = Pin(26, Pin.OUT)                 # LED with a 220 ohm resistor to GND

        was_down = False
        led_on = False

        while True:
            down = button.value() == 0         # idles 1; pressing connects the pin to GND
            if down and not was_down:          # the moment of pressing, not the time it is held
                led_on = not led_on
                led.value(led_on)
            was_down = down
            time.sleep_ms(10)                  # polling every 10 ms also hides most contact bounce
      `,
      notes: ['The 10 ms pause is doing a little debouncing by accident: the next page does it on purpose.', 'On an ESP32-S3, C3 or C6 board choose any ordinary free GPIO for the button and the LED; the structure does not change.']
    }
  ],
  examples: [
    {
      title: 'How much does a held button draw?',
      q: 'A button to ground uses the internal pull-up of about 45 kΩ at 3.3 V. A second design uses an external 10 kΩ pull-up. What current flows while each button is held?',
      steps: ['With the contacts closed the whole 3.3 V is across the resistor, so $I = V / R$.', 'Internal pull-up: $3.3 / 45\\,000 \\approx 73\\ \\mu\\mathrm{A}$.', 'External 10 kΩ: $3.3 / 10\\,000 = 330\\ \\mu\\mathrm{A}$.'],
      a: 'About 73 µA and 330 µA. Neither matters if the button is pressed for a moment, but a door contact held closed for a month at 330 µA would draw about 240 mAh.'
    }
  ],
  quiz: [
    { q: 'A button is wired between GPIO4 and ground and the program calls pinMode(4, INPUT_PULLUP). What does digitalRead(4) return while the button is pressed?', choices: ['HIGH', 'LOW', 'A random value', 'Whatever the last digitalWrite set'], a: 1, why: 'Pressing connects the pin to ground, which wins over the weak pull-up. The released state is HIGH.' },
    { q: 'A button is wired to GPIO35 of an ESP32 with INPUT_PULLUP and nothing else. It behaves randomly. Why?', choices: ['GPIO35 is a flash pin', 'GPIO34–39 are input-only and have no internal pull resistors', 'The ADC is switched on', 'Buttons cannot be read on 3.3 V pins'], a: 1, why: 'The pull-up request is silently ignored on GPIO34–39, so the pin floats while the button is open. Add an external resistor of 4.7–10 kΩ to 3.3 V.' },
    { q: 'A tact switch is wired across two legs that belong to the same internal pair. What does the program see?', choices: ['A button that is always pressed', 'A button that works but is slow', 'Nothing, the pin is damaged', 'A button that is pressed twice each time'], a: 0, why: 'Legs on the same side of the part are connected inside the switch for ever. Use legs of different pairs.' },
    { q: 'A button that is wired to ground and read with a pull-up is "active high".', a: false, why: 'It is active low: the pressed level is low.' }
  ],
  applications: [
    'The BOOT and EN buttons of every development board are a switch to ground with a pull-up.',
    'Door and window contacts in alarm systems are reed switches read on one pin.',
    'Mode switches on small instruments and the panel buttons of a 3D printer or coffee machine.',
    'Limit and end-stop switches on a motorised axis.'
  ],
  sources: [
    'Espressif, *ESP32 Series Datasheet*: GPIO pin table, internal pull-up and pull-down resistors, input-only pins.',
    'Arduino core for ESP32 documentation, *GPIO* API (pinMode, digitalRead, INPUT_PULLUP), core 3.3.',
    'MicroPython documentation, *machine.Pin* (version 1.29).'
  ],
  sim: 'hi-switch'
},

/* ================================================================ debouncing */
{
  id: 'debouncing',
  parent: 'human-inputs',
  title: 'Debouncing',
  level: 2,
  short: 'Real contacts chatter for a few milliseconds each time they close or open, and a fast chip counts every chatter as a press. Debouncing is accepting a change only once it has settled.',
  keywords: ['debounce', 'contact bounce', 'switch bounce', 'chatter', 'false triggers', 'double count', 'lockout', 'Schmitt trigger', 'RC debounce', 'interrupt', 'attachInterrupt', 'IRQ_FALLING', 'millis', 'ticks_diff'],
  prereq: ['buttons-and-switches', 'interrupts', 'non-blocking-timing'],
  related: ['long-press-double-click', 'rotary-encoders', 'rc-filters-and-debounce', 'electronics:schmitt-trigger', 'electronics:rc-low-pass'],
  body: `When two metal contacts meet they do not stick: they bounce like a dropped coin. For a few milliseconds the circuit makes and breaks, perhaps five or ten times, before it settles. A person sees one press. A chip that samples a pin thousands of times a second sees a burst of pulses, and an interrupt routine that counts falling edges can count one press as four. This is **contact bounce**, and every mechanical switch has it. Open the simulation below and widen the bounce: the "raw" count shoots up while the number of real presses stays the same.

### How long, and what to do about it

Small tact switches typically settle in 1–10 ms; worn parts, big toggles and relays can chatter for 20 ms or more. A human press lasts at least 50–100 ms, so waiting 20–50 ms before believing a change costs nothing the user can feel. Four ways to do it:

1. **Stop and wait** (\`delay(20)\` after the first edge). Simple, and for a toy it works, but the whole program sleeps ([[non-blocking-timing]]).
2. **Stable-time filter.** Keep a stopwatch: whenever the reading changes, restart it. When the reading has stayed the same for the debounce time, accept it as the new state. Nothing blocks, and both presses and releases are debounced. This is the first program below.
3. **Interrupt with a lock-out.** The interrupt fires on every edge and notes its time. An edge counts as a press only if it is falling and nothing happened on the pin in the lock-out time before it ([[interrupts]]). It reacts at once. The cost: a genuine press that follows another edge too closely is lost, and a noisy line wakes the chip often.
4. **Hardware.** A resistor and capacitor smooth the edge, and a Schmitt-trigger gate (for example a 74HC14) turns the slow slope back into a clean edge. The time constant is $\\tau = RC$: 10 kΩ and 1 µF give 10 ms, and the voltage needs about $3\\tau$ to settle ([[rc-filters-and-debounce]]). It costs parts but no code and no CPU, and it works while the chip sleeps.

### What goes wrong

- **A window too long eats fast taps.** With a 50 ms filter a 30 ms tap vanishes. Try it in the simulation with the second tap.
- **A lock-out that starts only at the press.** The release chatters too, and it falls low again for a moment: if the press lasted longer than the lock-out, that chatter is counted as a new press. Restart the lock-out at every edge, rising ones included.
- **Interrupts with heavy work.** Keep the routine to a flag or a counter; the loop does the printing ([[interrupts]]).
- **Software debounce does not cure noise.** A long cable that picks up spikes needs the hardware measures of [[buttons-and-switches]] as well.

> [!key] Contact bounce makes one press look like several. Accept a change only after the pin has been steady for 20–50 ms (a stable-time filter), or count an edge only after a quiet time on the pin (an interrupt lock-out), or smooth the edge with an RC filter and a Schmitt-trigger input.`,
  ideas: [
    'Every mechanical contact bounces for a few milliseconds when it closes or opens.',
    'A debounce time of 20–50 ms is long enough for most switches and too short for a person to notice.',
    'A stable-time filter restarts a stopwatch at every change and accepts the level when it stays put.',
    'An interrupt that counts every edge counts bounces: use a lock-out time, or a hardware RC filter with a Schmitt trigger.'
  ],
  pitfalls: [
    'A fast chip needs no debounce, it is quick enough to see one press — Being fast makes it worse: it sees every bounce as a separate press.',
    'A longer debounce time is always safer — A window longer than a quick tap throws real presses away; match it to the switch.',
    'Debounce in the interrupt with delay() — delay and Serial printing do not belong in an interrupt routine. Record the time, set a flag and finish.'
  ],
  terms: [
    { term: 'Contact bounce', also: ['switch bounce', 'chatter'], def: 'The rapid making and breaking of a mechanical contact for a few milliseconds as it closes or opens, before it settles. A chip sees it as a burst of pulses.' },
    { term: 'Debouncing', also: ['debounce', 'switch conditioning'], def: 'Removing the effect of contact bounce, so one physical press gives one logical press. It can be done in software, in hardware, or by a dedicated debouncer chip.' },
    { term: 'Lock-out time', also: ['dead time', 'blanking time'], def: 'The quiet time required on a pin before an edge is believed: edges that follow another edge within it are ignored. An interrupt routine uses it as a simple debounce.' },
    { term: 'Schmitt trigger', also: ['Schmitt-trigger input', 'hysteresis input'], def: 'An input with two thresholds, a higher one for rising signals and a lower one for falling ones. It turns a slow or noisy edge into one clean transition.' },
    { term: 'Time constant', also: ['RC time constant', 'tau'], def: 'The product of a resistance and a capacitance, in seconds. A capacitor charging through the resistor reaches about 63 % of the final voltage after one time constant and about 95 % after three.' }
  ],
  choose: {
    good: ['Stable-time filter in the main loop for ordinary buttons and menus', 'Interrupt with lock-out for presses that must be noticed during long work', 'RC filter with a Schmitt-trigger gate for a switch that must wake the chip from deep sleep or run with no code', 'A debouncer chip or a ready-made button library for many switches'],
    avoid: ['delay() after the first edge in a program that has other work', 'Counting every edge from an interrupt without a lock-out', 'A window longer than the quickest tap you want to catch', 'Printing or allocating inside the interrupt routine'],
    check: ['The bounce time of your own switch on an oscilloscope or logic analyser', 'That releases are debounced as well as presses', 'The shortest real press the user can make', 'That the interrupt routine is marked IRAM_ATTR on the ESP32']
  },
  code: [
    {
      title: 'Count presses with a stable-time filter',
      about: 'The reading must stay unchanged for 30 ms before it is believed. The program counts each accepted press and prints the total, and the loop is never blocked.',
      needs: 'An ESP32 DevKit and a push button.',
      wiring: [['GPIO4', 'button → GND', 'internal pull-up']],
      blocks: `
        when started
          set pin (4) as [input with pull-up v]
          start serial at (115200) baud
          set [stable v] to (1)
          set [last v] to (1)
          set [changed v] to (milliseconds since start)
          set [presses v] to (0)
        forever
          set [reading v] to (read pin (4))
          if <(reading) ≠ (last)> then
            set [last v] to (reading)
            set [changed v] to (milliseconds since start)
          end
          if <<((milliseconds since start) - (changed)) > (30)> and <(reading) ≠ (stable)>> then
            set [stable v] to (reading)
            if <(stable) = (0)> then
              change [presses v] by (1)
              print (join [pressed ] (presses))
            end
          end
        end
      `,
      cpp: String.raw`
        const int BUTTON = 4;
        const uint32_t DEBOUNCE_MS = 30;

        bool stableState = HIGH;               // the accepted level (HIGH = released)
        bool lastReading = HIGH;
        uint32_t lastChange = 0;
        int presses = 0;

        void setup() {
          Serial.begin(115200);
          pinMode(BUTTON, INPUT_PULLUP);
        }

        void loop() {
          bool reading = digitalRead(BUTTON);
          if (reading != lastReading) {        // the pin moved: restart the stopwatch
            lastReading = reading;
            lastChange = millis();
          }
          if (millis() - lastChange > DEBOUNCE_MS && reading != stableState) {
            stableState = reading;             // steady for 30 ms: believe it
            if (stableState == LOW) {
              presses++;
              Serial.printf("pressed %d times\n", presses);
            }
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        button = Pin(4, Pin.IN, Pin.PULL_UP)
        DEBOUNCE_MS = 30

        stable_state = 1                       # the accepted level (1 = released)
        last_reading = 1
        last_change = time.ticks_ms()
        presses = 0

        while True:
            reading = button.value()
            if reading != last_reading:        # the pin moved: restart the stopwatch
                last_reading = reading
                last_change = time.ticks_ms()
            if time.ticks_diff(time.ticks_ms(), last_change) > DEBOUNCE_MS and reading != stable_state:
                stable_state = reading         # steady for 30 ms: believe it
                if stable_state == 0:
                    presses += 1
                    print("pressed", presses, "times")
            time.sleep_ms(1)
      `,
      output: `
        pressed 1 times
        pressed 2 times
        pressed 3 times
      `,
      notes: ['A release is debounced by the same code: the filter works on both edges, but only the press is counted.', 'Raise DEBOUNCE_MS to 50 for a noisy switch, and lower it if quick taps go missing.']
    },
    {
      title: 'Count presses with an interrupt and a lock-out',
      about: 'The interrupt fires on every edge of the pin and notes its time. An edge counts as a press only if the pin is low and nothing happened on it in the 30 ms before. The loop only prints.',
      needs: 'An ESP32 DevKit and a push button.',
      wiring: [['GPIO4', 'button → GND', 'internal pull-up']],
      blocks: `
        when started
          set pin (4) as [input with pull-up v]
          start serial at (115200) baud
          set [lastEdge v] to (0)
          set [presses v] to (0)
          set [shown v] to (0)
        forever
          if <(presses) ≠ (shown)> then
            set [shown v] to (presses)
            print (join [pressed ] (shown))
          end
        end

        when pin (4) changes :: events
          set [quiet v] to <((milliseconds since start) - (lastEdge)) > (30)>
          set [lastEdge v] to (milliseconds since start)
          if <<quiet> and <(read pin (4)) = [LOW v]>> then
            change [presses v] by (1)
          end
      `,
      cpp: String.raw`
        const int BUTTON = 4;
        const uint32_t LOCKOUT_MS = 30;

        volatile uint32_t lastEdgeMs = 0;
        volatile int presses = 0;
        int shown = 0;

        void IRAM_ATTR onButton() {                // runs inside an interrupt: keep it tiny
          uint32_t now = millis();
          bool quiet = now - lastEdgeMs > LOCKOUT_MS;   // nothing happened on the pin just before
          lastEdgeMs = now;                        // every edge, rising too, restarts the lock-out
          if (quiet && digitalRead(BUTTON) == LOW) {
            presses = presses + 1;
          }
        }

        void setup() {
          Serial.begin(115200);
          pinMode(BUTTON, INPUT_PULLUP);
          attachInterrupt(BUTTON, onButton, CHANGE);
        }

        void loop() {
          if (presses != shown) {
            shown = presses;
            Serial.printf("pressed %d times\n", shown);
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        BUTTON = 4
        LOCKOUT_MS = 30

        last_edge = 0
        presses = 0

        def on_button(pin):                    # called with the Pin that changed
            global last_edge, presses
            now = time.ticks_ms()
            quiet = time.ticks_diff(now, last_edge) > LOCKOUT_MS   # nothing happened on the pin just before
            last_edge = now                    # every edge, rising too, restarts the lock-out
            if quiet and pin.value() == 0:
                presses += 1

        button = Pin(BUTTON, Pin.IN, Pin.PULL_UP)
        button.irq(handler=on_button, trigger=Pin.IRQ_FALLING | Pin.IRQ_RISING)

        shown = 0
        while True:
            if presses != shown:
                shown = presses
                print("pressed", shown, "times")
            time.sleep_ms(10)
      `,
      notes: ['Mark the C++ interrupt routine IRAM_ATTR; a routine kept in flash can crash if it fires while the flash is being written.', 'On the ESP32 MicroPython runs the handler as a scheduled callback, not at the exact instant of the edge; the lock-out still works.', 'A lock-out that starts only at the press (and watches falling edges only) counts the release chatter as a new press whenever the press lasted longer than the lock-out.']
    }
  ],
  formulas: [
    {
      name: 'RC time constant of a hardware debounce',
      expr: 'tau = R * C',
      tex: '\\tau = R\\,C',
      vars: {
        tau: { name: 'time constant', q: 'time', unit: 'ms', tex: '\\tau' },
        R: { name: 'resistance', q: 'resistance', unit: 'kΩ', value: 10 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'µF', value: 1 }
      },
      solveFor: 'tau',
      note: 'The voltage on the capacitor has settled to within 5 % after about three time constants. Choose the product so that 3τ is longer than the bounce and shorter than the quickest press, and follow the RC with a Schmitt-trigger input.',
      stories: { tau: 'A switch has {R} to the supply and {C} across the contacts. What is the time constant?' }
    }
  ],
  examples: [
    {
      title: 'Nine presses, thirty-seven interrupts',
      q: 'An interrupt routine increments a counter on every falling edge. After nine deliberate presses it shows 37. What does that tell you, and what does a 30 ms lock-out do?',
      steps: ['Each press made about $37 / 9 \\approx 4$ falling edges: the contacts bounce when they close and chatter again when they open.', 'With a quiet-time rule an edge counts only if nothing happened on the pin in the 30 ms before it and the pin is low. A burst of bounces is over within 10 ms, so only its first edge counts, and the release chatter starts with a rising edge, which is never counted.', 'So each press counts once: 9.'],
      a: 'About four falling edges per press. With the lock-out the counter shows 9, but a genuine press that comes within 30 ms of another edge would be lost.'
    }
  ],
  quiz: [
    { q: 'An interrupt routine counts falling edges. One slow press increments the counter by 4. What is the cause?', choices: ['The ESP32 interrupts four times per edge', 'Contact bounce makes several falling edges', 'The pull-up resistor is too weak', 'millis() wrapped around'], a: 1, why: 'The contacts chatter for a few milliseconds, making and breaking several times. Each break-and-make is another falling edge.' },
    { q: 'You set the stable-time filter to 80 ms. Users complain that quick taps are ignored. What happened?', choices: ['The pull-up is too strong', 'Taps shorter than the filter time never stay unchanged long enough to be accepted', 'The loop runs too slowly', 'The filter works only on releases'], a: 1, why: 'A tap of 50 ms ends before the reading has been steady for 80 ms, so the filter never accepts it. Use 20–50 ms.' },
    { q: 'Which hardware part turns the slow RC edge of a hardware debounce back into a clean transition?', choices: ['A diode', 'A Schmitt-trigger input', 'A bigger pull-up', 'A crystal'], a: 1, why: 'A Schmitt trigger has two thresholds, so a slowly moving voltage crosses them once and produces one clean edge.' },
    { q: 'Calling delay(20) after detecting the first edge is a good debounce for a program that also reads a sensor and updates a display.', a: false, why: 'delay() stops the whole program for 20 ms every press. A stable-time filter or a lock-out debounces without blocking.' }
  ],
  applications: [
    'Every push-button counter, menu button and mode switch in a product has some form of debounce.',
    'A button that wakes a battery device from deep sleep often has an RC filter so the chip is woken once.',
    'Rotary encoders and keypads need the same idea, applied to several inputs at once.',
    'Door sensors on long wires, where noise adds to bounce, use a hardware filter and a longer window.'
  ],
  sources: [
    'Arduino core for ESP32 documentation, *GPIO* API, attachInterrupt and the GPIO interrupt example (core 3.3).',
    'MicroPython documentation, *machine.Pin*, the irq() method, and the section on writing interrupt handlers (version 1.29).',
    'Manufacturer datasheets of tactile switches, which specify the bounce time of the part.'
  ],
  sim: 'hi-bounce'
},

/* ================================================================ long-press-double-click */
{
  id: 'long-press-double-click',
  parent: 'human-inputs',
  title: 'Long press, double click: reading gestures',
  level: 2,
  short: 'One button can mean several things: a tap, two taps, a long hold. Telling them apart is a small state machine driven by presses, releases and timeouts.',
  keywords: ['long press', 'double click', 'single click', 'gesture', 'multi-function button', 'state machine', 'timeout', 'hold', 'factory reset button', 'click', 'button states', 'OneButton'],
  prereq: ['debouncing', 'what-a-state-machine-is', 'timeouts-and-timed-states'],
  related: ['state-machine-in-code', 'states-events-transitions', 'buttons-and-switches', 'encoder-and-button-navigation', 'non-blocking-timing'],
  body: `A device with one button must still do several things: switch on and off, change mode, dim, reset. The answer is gestures. A **click** does one thing, a **double click** another, a **long press** a third. The chip cannot read gestures, only voltage, so the program must recognise them from the times of presses and releases. That is what a state machine is for.

### What the program has to decide

Each gesture is a pattern in time:

| Gesture | Pattern | Typical thresholds |
|---|---|---|
| Single click | press, release, then quiet | quiet for 250–400 ms after the release |
| Double click | press, release, press, release | the second press within the same 250–400 ms |
| Long press | press, held | held for 500–1000 ms |
| Very long press | held far longer, for a factory reset | 5–10 s, on purpose hard to do by accident |

### The machine

Five states are enough. From **IDLE** a press goes to **DOWN**. A release from DOWN goes to **GAP**, where the program waits for a second press. If the wait runs out, the gesture was a single click. A press in GAP goes to **DOWN2**, and its release is a double click. And if DOWN lasts longer than the long-press time, the machine reports a long press and moves to **HELD**, where it waits for the release before it goes back to IDLE. The buttons feed it only debounced presses and releases ([[debouncing]]).

The machine is drawn, and runs, in the simulation below: press the virtual button and watch the active state move. The diagram is the design; the code is a copy of it ([[state-machine-in-code]]).

### The price of a double click

Notice what GAP means: after a single click the program cannot yet say "single click", because a second press might still come. **Every single click is delayed by the gap time**, typically 300 ms. That is why many devices that need a snappy response do not offer a double click, and why a long press is cheaper: it needs no waiting after the release. If your button needs only click and long press, leave the gap out and report the click at the release.

### Making it pleasant

- **Report a long press while still held**, as soon as the time is up, so the user gets feedback (an LED or a beep) and knows when to let go.
- **Keep thresholds in constants** so they can be tuned with real users; some people press slowly.
- **Make destructive gestures hard**: a factory reset on a 10 s hold, with a blinking LED that warns it is coming.
- **Libraries** do all of this ready-made (for example OneButton for Arduino); the program below shows what they do inside.

> [!key] Gestures are patterns of presses, releases and timeouts: a small state machine reads them. A double click makes every single click wait for the gap time, so offer it only when you need it.`,
  ideas: [
    'A click, a double click and a long press are told apart by how long the button is held and how soon it is pressed again.',
    'Five states are enough: idle, down, gap, second down and held.',
    'A double click delays every single click by the gap time, because the program must wait to see whether a second press follows.',
    'Report a long press while the button is still held, and make destructive gestures long and deliberate.'
  ],
  pitfalls: [
    'A single click can be reported at the moment of the release — Not if a double click exists: the program must wait out the gap in case a second press follows.',
    'The thresholds are the same for everyone — Some people press slowly or with tremor. Keep thresholds adjustable and test with real users.',
    'Gestures work without debouncing — A bounce looks like a very quick extra click. Debounce first, and feed only clean presses to the machine.'
  ],
  terms: [
    { term: 'Long press', also: ['hold', 'press and hold'], def: 'A press held for longer than a set time, typically half a second to a second. It is a separate gesture from a click.' },
    { term: 'Double click', also: ['double tap', 'double press'], def: 'Two presses within a short gap, typically under 300–400 ms. The first release starts the wait for the second press.' },
    { term: 'Click gap', also: ['multi-click window', 'double-click time'], def: 'The time the program waits after a release for a second press. A single click can only be reported when it has passed.' },
    { term: 'Button gesture', also: ['gesture', 'button event'], def: 'A meaning derived from the pattern of presses and releases in time, such as click, double click or long press.' }
  ],
  choose: {
    good: ['Click for the main action, long press for the second most common one', 'A long press of 5–10 s for factory reset, with LED feedback', 'Double click only where a 300 ms delay on single clicks is acceptable', 'A ready-made button library for many buttons'],
    avoid: ['Three or more clicks for different functions: users cannot learn them', 'A double click on a button that must react at once', 'Destructive actions on a short press', 'Hard-coded thresholds that cannot be tuned'],
    check: ['That the long-press time is longer than a slow normal press', 'That the click gap suits the users', 'That gestures are built on debounced presses', 'What feedback the user gets while holding']
  },
  code: [
    {
      title: 'Single click, double click and long press',
      about: 'A five-state machine on one button. It prints "single click", "double click" or "long press"; the thresholds are constants at the top.',
      needs: 'An ESP32 DevKit and a push button.',
      wiring: [['GPIO4', 'button → GND', 'internal pull-up']],
      blocks: `
        when started
          set pin (4) as [input with pull-up v]
          start serial at (115200) baud
          go to state [IDLE v]

        when pin (4) goes [low v]    // already debounced
          send event [PRESS v] :: state

        when pin (4) goes [high v]
          send event [RELEASE v] :: state

        when event [PRESS v] in state [IDLE v]
          go to state [DOWN v]

        when (0.6) seconds in state [DOWN v]
          print [long press]
          go to state [HELD v]

        when event [RELEASE v] in state [DOWN v]
          go to state [GAP v]

        when event [RELEASE v] in state [HELD v]
          go to state [IDLE v]

        when event [PRESS v] in state [GAP v]
          go to state [DOWN2 v]

        when (0.3) seconds in state [GAP v]
          print [single click]
          go to state [IDLE v]

        when event [RELEASE v] in state [DOWN2 v]
          print [double click]
          go to state [IDLE v]
      `,
      cpp: String.raw`
        const int BUTTON = 4;
        const uint32_t DEBOUNCE_MS = 25, LONG_MS = 600, GAP_MS = 300;

        enum State { S_IDLE, S_DOWN, S_GAP, S_DOWN2, S_HELD };
        State state = S_IDLE;
        uint32_t enteredAt = 0;

        bool stable = HIGH, lastReading = HIGH;
        uint32_t lastChange = 0;

        void go(State s) { state = s; enteredAt = millis(); }

        void onPress() {
          if (state == S_IDLE) go(S_DOWN);
          else if (state == S_GAP) go(S_DOWN2);
        }

        void onRelease() {
          if (state == S_DOWN) go(S_GAP);
          else if (state == S_HELD) go(S_IDLE);
          else if (state == S_DOWN2) { Serial.println("double click"); go(S_IDLE); }
        }

        void setup() {
          Serial.begin(115200);
          pinMode(BUTTON, INPUT_PULLUP);
        }

        void loop() {
          bool reading = digitalRead(BUTTON);              // debounce: stable for 25 ms
          if (reading != lastReading) { lastReading = reading; lastChange = millis(); }
          if (millis() - lastChange > DEBOUNCE_MS && reading != stable) {
            stable = reading;
            if (stable == LOW) onPress(); else onRelease();
          }
          uint32_t held = millis() - enteredAt;            // time in the current state
          if (state == S_DOWN && held >= LONG_MS) { Serial.println("long press"); go(S_HELD); }
          if (state == S_GAP && held >= GAP_MS) { Serial.println("single click"); go(S_IDLE); }
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        BUTTON = 4
        DEBOUNCE_MS = 25
        LONG_MS = 600
        GAP_MS = 300

        S_IDLE, S_DOWN, S_GAP, S_DOWN2, S_HELD = range(5)
        state = S_IDLE
        entered_at = time.ticks_ms()

        button = Pin(BUTTON, Pin.IN, Pin.PULL_UP)
        stable = 1
        last_reading = 1
        last_change = time.ticks_ms()

        def go(s):
            global state, entered_at
            state = s
            entered_at = time.ticks_ms()

        def on_press():
            if state == S_IDLE:
                go(S_DOWN)
            elif state == S_GAP:
                go(S_DOWN2)

        def on_release():
            if state == S_DOWN:
                go(S_GAP)
            elif state == S_HELD:
                go(S_IDLE)
            elif state == S_DOWN2:
                print("double click")
                go(S_IDLE)

        while True:
            reading = button.value()                       # debounce: stable for 25 ms
            if reading != last_reading:
                last_reading = reading
                last_change = time.ticks_ms()
            if time.ticks_diff(time.ticks_ms(), last_change) > DEBOUNCE_MS and reading != stable:
                stable = reading
                if stable == 0:
                    on_press()
                else:
                    on_release()
            held = time.ticks_diff(time.ticks_ms(), entered_at)   # time in the current state
            if state == S_DOWN and held >= LONG_MS:
                print("long press")
                go(S_HELD)
            if state == S_GAP and held >= GAP_MS:
                print("single click")
                go(S_IDLE)
            time.sleep_ms(1)
      `,
      output: `
        single click
        double click
        long press
      `,
      notes: ['The block version names the states in the same words as the diagram; the C++ and MicroPython versions keep them in a variable and test it.', 'A second press that is held longer than the long-press time still ends as a double click when it is released: add a long-press arm to DOWN2 if you want a "tap-and-hold" gesture.']
    }
  ],
  examples: [
    {
      title: 'How late is a single click?',
      q: 'A button recognises click, double click and long press with a 25 ms debounce and a 300 ms click gap. The user presses for 80 ms and lets go. How long after the release is "single click" reported?',
      steps: ['The release is accepted 25 ms after the contacts settle, because of the debounce.', 'The machine enters GAP and waits for the click gap, 300 ms, for a second press.', 'Nothing comes, so the timeout fires and the click is reported.'],
      a: 'About 325 ms after the physical release (25 ms debounce plus 300 ms gap). Without a double-click gesture it could be reported after only the 25 ms.'
    }
  ],
  quiz: [
    { q: 'A button supports click and double click. Why does a single click feel slightly sluggish?', choices: ['Debouncing takes a second', 'The program must wait out the click gap to be sure no second press follows', 'millis() is inaccurate', 'The pull-up is slow'], a: 1, why: 'Only when the click gap has passed with no second press can the program report a single click, so every click waits that long.' },
    { q: 'In the machine, which event takes DOWN to GAP?', choices: ['The long-press timeout', 'A release', 'A second press', 'The reset button'], a: 1, why: 'A release before the long-press time is a tap; the machine then waits in GAP to see if another follows. The timeout takes DOWN to HELD.' },
    { q: 'Where should a factory-reset gesture be placed?', choices: ['A single click', 'A double click', 'A hold of about 10 seconds with a blinking warning', 'A long press of 0.6 s'], a: 2, why: 'A destructive action must be hard to trigger by accident, and the user needs feedback while holding it.' },
    { q: 'A long press can be recognised without any waiting after the release.', a: true, why: 'It is detected while the button is held, as soon as the hold time has passed, so it needs no gap and can give feedback immediately.' }
  ],
  applications: [
    'Smart plugs and lamps: click switches, double click changes colour, long press pairs.',
    'Camera and gadget buttons where a long hold powers the device on or off.',
    'Router and device reset buttons that need a deliberate 5–10 s hold.',
    'A single encoder push-button that navigates a whole menu ([[encoder-and-button-navigation]]).'
  ],
  sources: [
    'Arduino core for ESP32 documentation, *GPIO* API and the millis() timing functions (core 3.3).',
    'MicroPython documentation, *time* module: ticks_ms, ticks_diff (version 1.29).',
    'D. Harel, "Statecharts: a visual formalism for complex systems", Science of Computer Programming 8 (1987), for the state-machine idea.'
  ],
  sim: 'hi-gesture'
},

/* ================================================================ rotary-encoders */
{
  id: 'rotary-encoders',
  parent: 'human-inputs',
  title: 'Rotary encoders',
  level: 2,
  short: 'A knob that turns for ever and says which way and how far. Two contacts produce two square waves a quarter-period apart; which one leads gives the direction, and counting the edges gives the position.',
  keywords: ['rotary encoder', 'quadrature', 'incremental encoder', 'EC11', 'detent', 'A B signals', 'state table', 'pulse counter', 'PCNT', 'encoder knob', 'clockwise', 'ESP32Encoder', 'volume knob', 'menu knob'],
  prereq: ['debouncing', 'interrupts', 'digital-input'],
  related: ['pulse-counter-pcnt', 'encoder-and-button-navigation', 'encoders-and-speed', 'pulse-counting', 'long-press-double-click', 'motors:incremental-encoders'],
  body: `A potentiometer has two ends; an **incremental rotary encoder** has none. It turns for ever, and instead of a voltage it produces pulses: one each time the knob moves a small step. The two signals it makes, **A** and **B**, are the same square wave a quarter of a period apart. That quarter-period shift is the trick: it lets the chip tell *which way* the knob turns, not only that it moved.

### How the signals say the direction

Turn the knob clockwise and the two contacts change in the order 00, 10, 11, 01, 00 (A leads B). Turn it anticlockwise and the order is reversed: 00, 01, 11, 10. At every step exactly **one** of the two lines changes, so each of the four combinations is a **quarter step**. Compare the new pair with the previous pair: it is a step forward, a step back, no change, or an *impossible* jump of two bits at once, which means the chip missed a step or the contacts chattered. The simulation below draws A and B as you turn the knob and shows the count.

A 16-entry table does the whole job: use the previous pair and the new pair as a 4-bit index and look up +1, −1 or 0. It ignores impossible jumps and cancels the chatter at a contact: a bounce forth and back adds +1 then −1.

### What the numbers mean

A common panel knob has 20 pulses per turn and a **detent** (a click you can feel) at each. Reading all four quarter steps gives **80 counts per turn**, and one detent is **4 counts**: the position shown to the user is the count divided by four. Some knobs click every half period, so check by turning one detent and printing the count. Optical and magnetic encoders on motors give hundreds or thousands of counts per turn ([[encoders-and-speed]]).

### Ways to read one

| Method | Good | Weak |
|---|---|---|
| Poll in the loop | simplest | misses steps if the loop is slow or blocks |
| Interrupt on both pins, state table | exact, cheap | many interrupts on a fast or chattering knob |
| Pulse counter peripheral | counts in hardware with a glitch filter, no CPU load | only the ESP32, S2, S3, C5, C6, H2 and P4 have one; **the C2, C3 and C61 do not** ([[pulse-counter-pcnt]]) |

### Wiring and traps

A, B and the common pin go to two GPIOs and ground; the internal pull-ups do the rest. Many encoder modules also carry the push-button and their own 10 kΩ pull-ups. For a bouncy knob add 10 nF from each of A and B to ground. If the count goes down when you turn right, swap A and B. A knob read with \`delay()\` in the loop loses counts: use interrupts or the counter. An encoder is *relative*: after a power cut it does not know where it was, unlike an absolute encoder ([[motors:absolute-encoders]]).

> [!key] An encoder gives two square waves a quarter period apart: the leading one shows the direction, and a 16-entry state table turns every edge into +1, −1 or 0. Count quarter steps and divide by four to get detents; use interrupts or the pulse counter so that no step is missed.`,
  ideas: [
    'The A and B signals are a quarter of a period apart, so the order of their changes shows the direction of turning.',
    'Each change of A or B is a quarter step; a typical knob gives four counts per detent and 80 per turn.',
    'A state table indexed by the previous and the new pair of levels gives +1, −1 or 0 and ignores impossible jumps.',
    'Interrupts or the pulse-counter peripheral read a fast knob without losing steps; a slow polling loop misses them.'
  ],
  pitfalls: [
    'One interrupt on A is enough — Reading B only when A falls works for slow knobs, but a chattering contact gives wrong counts. Use both lines and the table.',
    'An encoder knows its position — It gives only changes. After a reset the count starts at zero wherever the knob stands.',
    'Every ESP32 chip has a pulse counter — The ESP32, S2, S3, C5, C6, H2 and P4 do; the C2, C3 and C61 do not, so there it is interrupts or polling.'
  ],
  terms: [
    { term: 'Quadrature', also: ['quadrature encoding', 'A/B signals'], def: 'Two square waves of the same frequency a quarter of a period apart. Which one leads shows the direction of movement, and the edges of both give four counts per period.' },
    { term: 'Incremental encoder', also: ['rotary encoder', 'relative encoder'], def: 'A sensor that produces pulses when its shaft turns, so it reports movement but not an absolute angle. The count starts at zero at power-up.' },
    { term: 'Detent', also: ['click', 'tactile step'], def: 'A mechanical stop in a knob that clicks into place at each step. A typical encoder has one detent per pulse, which is four quarter steps.' },
    { term: 'Pulses per revolution', also: ['PPR', 'cycles per revolution', 'counts per revolution (CPR)'], def: 'The number of full A cycles in one turn. Counting every edge of A and B gives four times as many counts per revolution.' },
    { term: 'Pulse counter', also: ['PCNT', 'hardware counter'], def: 'A peripheral that counts edges of its input pins in hardware, and can decode quadrature, with a glitch filter. It needs no CPU time while counting.' }
  ],
  choose: {
    good: ['A mechanical encoder with push-button for menus, volume and settings', 'Interrupts on both pins plus the state table for a hand-turned knob', 'The pulse counter for motor shafts and anything fast', 'An optical or magnetic encoder when a motor needs many counts per turn'],
    avoid: ['Polling a knob in a loop that also draws a display or waits', 'Counting only the falling edges of A on a chattering contact', 'Using the C3 or C2 pulse counter: they have none', 'Trusting position after a power cut: an incremental encoder forgets'],
    check: ['Counts per detent: turn one click and print the count', 'That a fast turn does not lose counts', 'Pull-ups on A and B (modules often have them), and 10 nF filters if it chatters', 'Which way is clockwise on your wiring']
  },
  code: [
    {
      title: 'Read a rotary encoder with a state table',
      about: 'Both signal lines raise an interrupt. Each interrupt looks up the step in a 16-entry table and adds it to the count; the loop prints the position whenever it changes by a detent.',
      needs: 'An ESP32 DevKit and a rotary encoder (A and B, common to GND).',
      wiring: [['GPIO32', 'encoder A', 'internal pull-up'], ['GPIO33', 'encoder B', 'internal pull-up'], ['GND', 'encoder common']],
      blocks: `
        when started
          set pin (32) as [input with pull-up v]
          set pin (33) as [input with pull-up v]
          start serial at (115200) baud
          set [table v] to (list [0 -1 1 0 1 0 0 -1 -1 0 0 1 0 1 -1 0])
          set [counts v] to (0)
          set [previous v] to (((read pin (32)) * (2)) + (read pin (33)))
          set [shown v] to (0)
        forever
          set [detents v] to (floor ((counts) / (4)))
          if <(detents) ≠ (shown)> then
            set [shown v] to (detents)
            print (join [position ] (shown))
          end
        end

        when pin (32) changes or pin (33) changes :: events
          set [now v] to (((read pin (32)) * (2)) + (read pin (33)))
          change [counts v] by (item ((((previous) * (4)) + (now)) + (1)) of [table v])
          set [previous v] to (now)
      `,
      cpp: String.raw`
        const int PIN_A = 32;
        const int PIN_B = 33;
        // index = previous pair * 4 + new pair; value = +1 forward, -1 back, 0 none or impossible
        const int8_t TABLE[16] = {0, -1, 1, 0, 1, 0, 0, -1, -1, 0, 0, 1, 0, 1, -1, 0};

        volatile int32_t counts = 0;
        volatile uint8_t previous = 0;
        int32_t shown = 0;

        void IRAM_ATTR onChange() {                 // runs on every edge of A or B
          uint8_t now = (digitalRead(PIN_A) << 1) | digitalRead(PIN_B);
          counts = counts + TABLE[(previous << 2) | now];
          previous = now;
        }

        void setup() {
          Serial.begin(115200);
          pinMode(PIN_A, INPUT_PULLUP);
          pinMode(PIN_B, INPUT_PULLUP);
          previous = (digitalRead(PIN_A) << 1) | digitalRead(PIN_B);
          attachInterrupt(PIN_A, onChange, CHANGE);
          attachInterrupt(PIN_B, onChange, CHANGE);
        }

        void loop() {
          int32_t detents = counts >> 2;            // four counts per detent
          if (detents != shown) {
            shown = detents;
            Serial.printf("position %ld\n", (long)shown);
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        PIN_A = 32
        PIN_B = 33
        # index = previous pair * 4 + new pair; value = +1 forward, -1 back, 0 none or impossible
        TABLE = (0, -1, 1, 0, 1, 0, 0, -1, -1, 0, 0, 1, 0, 1, -1, 0)

        a = Pin(PIN_A, Pin.IN, Pin.PULL_UP)
        b = Pin(PIN_B, Pin.IN, Pin.PULL_UP)
        counts = 0
        previous = (a.value() << 1) | b.value()

        def on_change(pin):                         # runs on every edge of A or B
            global counts, previous
            now = (a.value() << 1) | b.value()
            counts += TABLE[(previous << 2) | now]
            previous = now

        a.irq(handler=on_change, trigger=Pin.IRQ_FALLING | Pin.IRQ_RISING)
        b.irq(handler=on_change, trigger=Pin.IRQ_FALLING | Pin.IRQ_RISING)

        shown = 0
        while True:
            detents = counts >> 2                   # four counts per detent
            if detents != shown:
                shown = detents
                print("position", shown)
            time.sleep_ms(10)
      `,
      output: `
        position 1
        position 2
        position 1
      `,
      notes: ['If the position goes down when you turn the knob to the right, swap the two wires of A and B.', 'MicroPython runs the handler a moment after the edge, not at the exact instant, so a very fast knob can lose steps; for fast shafts use the pulse counter through ESP-IDF (the Arduino core has no wrapper for it).', 'Knobs with a detent at every half period give two counts per detent: shift by one bit instead of two.']
    }
  ],
  examples: [
    {
      title: 'Degrees per count',
      q: 'A knob has 20 pulses per revolution and one detent per pulse. Reading both lines on every edge, how many counts per turn is that, how many degrees is one count, and how many degrees does one detent move?',
      steps: ['Each pulse has four quarter steps (A up, B up, A down, B down), so $20 \\times 4 = 80$ counts per revolution.', 'One count is $360° / 80 = 4.5°$.', 'One detent is one pulse, so four counts: $4 \\times 4.5° = 18°$.'],
      a: '80 counts per turn, 4.5° per count, 18° per detent; the position shown is the count divided by four.'
    }
  ],
  quiz: [
    { q: 'How does the chip tell clockwise from anticlockwise with an encoder?', choices: ['By the frequency of A', 'By which of A and B changes first', 'By the voltage of the common pin', 'By the push-button'], a: 1, why: 'The signals are a quarter period apart: if A leads B the knob turns one way, if B leads A the other way.' },
    { q: 'An encoder is read with one interrupt on A that counts +1 or −1 depending on B. The knob chatters at the contact and the count is wrong. What is the better method?', choices: ['A longer delay in the loop', 'Interrupts on both lines with a state table, or the pulse counter', 'A bigger pull-up', 'Reading only B'], a: 1, why: 'The table sees both lines at every change, so chatter at a contact cancels (+1 then −1) and impossible jumps are ignored.' },
    { q: 'You want hardware quadrature decoding on an ESP32-C3. What is true?', choices: ['Use the pulse counter', 'The C3 has no pulse counter: use interrupts or polling', 'Use LEDC', 'Only the DAC can do it'], a: 1, why: 'The C3, C2 and C61 have no pulse-counter peripheral. The ESP32, S2, S3, C5, C6, H2 and P4 do.' },
    { q: 'An incremental encoder remembers its position through a power cut.', a: false, why: 'It only reports changes. After a reset the program starts counting from zero; an absolute encoder or a stored value is needed for position.' }
  ],
  applications: [
    'Volume, brightness and menu knobs with a push-button, from hi-fi to 3D printers.',
    'Speed and position feedback on a motor shaft, with an optical encoder.',
    'Manual jog wheels on CNC machines and test benches.',
    'Selecting a setting on a small display without a touch screen ([[encoder-and-button-navigation]]).'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, Pulse Counter (PCNT) API reference: quadrature decoding and glitch filters.',
    'Arduino core for ESP32 documentation, *GPIO* API: attachInterrupt with CHANGE (core 3.3).',
    'Manufacturer datasheets of panel encoders such as the EC11 family: pulses per revolution, detents and bounce time.'
  ],
  sim: 'hi-encoder'
},

/* ================================================================ keypads-and-matrices */
{
  id: 'keypads-and-matrices',
  parent: 'human-inputs',
  title: 'Keypads and key matrices',
  level: 2,
  short: 'Sixteen keys on eight wires: arrange the switches in rows and columns, drive one row at a time and see which columns answer. The price is ghosting, when three pressed keys invent a fourth.',
  keywords: ['keypad', 'matrix keypad', '4x4 keypad', 'key matrix', 'row column scanning', 'ghosting', 'rollover', 'diode per key', 'membrane keypad', 'resistor ladder', 'ADC keypad', 'Keypad library', 'PCF8574', 'TCA8418'],
  prereq: ['buttons-and-switches', 'debouncing', 'digital-input'],
  related: ['io-expanders-and-shift-registers', 'the-esp-adc', 'long-press-double-click', 'diodes-in-esp-circuits', 'planning-pins'],
  body: `A 4×4 keypad has sixteen keys, and wiring sixteen switches to sixteen pins would waste most of the chip. A **key matrix** arranges the switches at the crossings of rows and columns: pressing a key connects its row wire to its column wire. Four rows and four columns need only **eight pins**; an 8×8 matrix reads 64 keys on 16 pins.

### Scanning

The chip *scans*. All columns are inputs with pull-ups, so they idle high. Take **one row at a time**, drive it low and read the four columns: a column that reads low has a pressed key where it crosses that row. Then release that row (set it back to input, high impedance) and take the next. A full scan takes microseconds; repeating it every 5–10 ms is fast enough for human fingers and also gives a rough debounce. Only the key found must stay the same over two or three scans to be believed ([[debouncing]]).

### Ghosting

The weakness is in the wiring. Press three keys at three corners of a rectangle of the matrix, say (row 1, column 1), (row 1, column 2) and (row 2, column 1). Now drive row 2 low: current flows from row 2 through the key at column 1 *to row 1*, along row 1, and through the key at column 2 to *column 2*, which reads low. The chip believes that key (row 2, column 2) is pressed too: a **ghost**. Cheap membrane keypads suffer from this when several keys are held; for a PIN pad it hardly matters, for a game or a chord keyboard it does.

The cure is a **diode in series with every key**, with the cathode towards the row: current can then only flow from a column into the driven row, never back through other keys, and every combination reads correctly (full rollover). That is why keyboards and good panels carry a diode per key, and why home-built boards use 1N4148s. Try both in the simulation.

### Other ways

| Need | Method |
|---|---|
| A few buttons, one pin free | **Resistor ladder**: each key puts a different resistor in a divider; one ADC pin reads the voltage ([[the-esp-adc]]) |
| Many keys, few pins | An I2C port expander, or a keypad-scanner chip such as the TCA8418, which scans, debounces and reports key events |
| Library | The widely used Keypad library for Arduino scans a matrix and returns keys |

In a resistor ladder with a 10 kΩ pull-up to 3.3 V, keys behind 0 Ω, 1 kΩ, 2.2 kΩ and 4.7 kΩ read about 0 V, 0.30 V, 0.60 V and 1.06 V, and nothing pressed reads 3.3 V. Only one key at a time can be told apart, tolerances and the ADC's own non-linearity need wide margins between the levels, and on the original ESP32 the pin must be on ADC1 when Wi-Fi is on.

> [!key] A key matrix reads rows × columns keys with rows + columns pins by driving one row low at a time and reading the columns. With three keys held it can invent a fourth (ghosting); a diode in series with each key prevents it.`,
  ideas: [
    'A matrix of R rows and C columns reads R × C keys with only R + C pins.',
    'The scan drives one row low at a time, with the other rows left as high-impedance inputs, and reads which columns go low.',
    'Without diodes, three keys pressed at three corners of a rectangle make the fourth corner appear pressed: a ghost.',
    'A resistor ladder reads several keys on one ADC pin, but only one key at a time.'
  ],
  pitfalls: [
    'More keys need more pins in proportion — Rows plus columns, not rows times columns: 64 keys need 16 pins. An I2C expander does even better.',
    'The undriven rows can be driven high instead of left as inputs — That makes a held key short a high row against the low one. Leave undriven rows high-impedance.',
    'Ghosting is a software bug — It is a property of the wiring: only diodes in series with the keys (or a different scan design) remove it.'
  ],
  terms: [
    { term: 'Key matrix', also: ['matrix keypad', 'button matrix'], def: 'Switches arranged at the crossings of rows and columns, so that R rows and C columns read R × C keys on R + C pins.' },
    { term: 'Scanning', also: ['matrix scan', 'row-column scan'], def: 'Driving one row at a time and reading the columns, to find which keys are pressed. A full scan takes microseconds and is repeated every few milliseconds.' },
    { term: 'Ghosting', also: ['ghost key', 'phantom key'], def: 'A key that is reported as pressed although it is not, because three pressed keys at the corners of a rectangle connect the fourth corner through a sneak path.' },
    { term: 'Rollover', also: ['N-key rollover', 'NKRO'], def: 'The number of keys that can be held at once and still be read correctly. A plain matrix reads two safely; a diode per key allows any number.' },
    { term: 'Resistor ladder', also: ['resistor network keypad', 'ADC keypad'], def: 'A string of resistors in which each key short-circuits a different part, so a single analogue pin reads a different voltage for each key.' }
  ],
  choose: {
    good: ['A 4×4 or 3×4 matrix keypad for PINs, numbers and small menus', 'A diode per key on a home-built panel where keys are held together', 'A resistor ladder for four to eight keys when only one pin is left', 'An I2C expander or keypad-scanner chip when pins or CPU time are short'],
    avoid: ['A plain matrix for chords and games without diodes', 'Driving the undriven rows high instead of leaving them floating', 'A resistor ladder with similar resistor values or with several keys held', 'A keypad as the only authentication for something valuable'],
    check: ['The pins: not strapping pins, not input-only pins for the rows (they must be outputs)', 'That a ghost cannot hurt: what does a wrong key do?', 'The scan period (5–10 ms) and the number of scans a key must hold', 'On a resistor ladder, that the voltages are well apart on the ADC pin']
  },
  code: [
    {
      title: 'Scan a 4×4 keypad',
      about: 'Each pass drives one row low in turn, reads the columns and reports a key when it first appears. The rows are left as inputs between turns.',
      needs: 'An ESP32 DevKit and a 4×4 matrix keypad (8 wires).',
      wiring: [['GPIO32, 33, 25, 26', 'keypad rows 1–4', 'driven low one at a time'], ['GPIO18, 19, 21, 23', 'keypad columns 1–4', 'internal pull-ups']],
      blocks: `
        when started
          set [rows v] to (list [32 33 25 26])
          set [cols v] to (list [18 19 21 23])
          set [keys v] to (list [1 2 3 A 4 5 6 B 7 8 9 C * 0 # D])
          for each [c v] in (cols)
            set pin (c) as [input with pull-up v]
          end
          for each [r v] in (rows)
            set pin (r) as [input v]
          end
          start serial at (115200) baud
          set [last v] to [none]
        forever
          scan :: my
          if <<(found) ≠ [none]> and <(found) ≠ (last)>> then
            print (join [key ] (found))
          end
          set [last v] to (found)
          wait (0.01) seconds
        end

        define scan
          set [found v] to [none]
          for each [r v] in (list [0 1 2 3])
            set pin (item ((r) + (1)) of [rows v]) as [output v]
            set pin (item ((r) + (1)) of [rows v]) to [LOW v]
            for each [c v] in (list [0 1 2 3])
              if <(read pin (item ((c) + (1)) of [cols v])) = [LOW v]> then
                set [found v] to (item ((((r) * (4)) + (c)) + (1)) of [keys v])
              end
            end
            set pin (item ((r) + (1)) of [rows v]) as [input v]
          end
      `,
      cpp: String.raw`
        const int ROW_PINS[4] = {32, 33, 25, 26};
        const int COL_PINS[4] = {18, 19, 21, 23};
        const char KEYS[16] = {'1', '2', '3', 'A', '4', '5', '6', 'B', '7', '8', '9', 'C', '*', '0', '#', 'D'};

        char scan() {                                  // returns the key held, or 0 for none
          char found = 0;
          for (int r = 0; r < 4; r++) {
            pinMode(ROW_PINS[r], OUTPUT);              // drive one row low ...
            digitalWrite(ROW_PINS[r], LOW);
            delayMicroseconds(5);                      // let the lines settle
            for (int c = 0; c < 4; c++) {
              if (digitalRead(COL_PINS[c]) == LOW) {   // ... and see which columns follow
                found = KEYS[r * 4 + c];
              }
            }
            pinMode(ROW_PINS[r], INPUT);               // release it again
          }
          return found;
        }

        char last = 0;

        void setup() {
          Serial.begin(115200);
          for (int c = 0; c < 4; c++) pinMode(COL_PINS[c], INPUT_PULLUP);
          for (int r = 0; r < 4; r++) pinMode(ROW_PINS[r], INPUT);
        }

        void loop() {
          char key = scan();
          if (key != 0 && key != last) {
            Serial.printf("key %c\n", key);
          }
          last = key;
          delay(10);                                   // a 10 ms scan period also hides most bounce
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        ROW_PINS = (32, 33, 25, 26)
        COL_PINS = (18, 19, 21, 23)
        KEYS = "123A456B789C*0#D"

        rows = [Pin(p, Pin.IN) for p in ROW_PINS]
        cols = [Pin(p, Pin.IN, Pin.PULL_UP) for p in COL_PINS]

        def scan():                                    # returns the key held, or None
            found = None
            for r in range(4):
                rows[r].init(Pin.OUT, value=0)         # drive one row low ...
                time.sleep_us(5)                       # let the lines settle
                for c in range(4):
                    if cols[c].value() == 0:           # ... and see which columns follow
                        found = KEYS[r * 4 + c]
                rows[r].init(Pin.IN)                   # release it again
            return found

        last = None
        while True:
            key = scan()
            if key is not None and key != last:
                print("key", key)
            last = key
            time.sleep_ms(10)                          # a 10 ms scan period also hides most bounce
      `,
      output: `
        key 5
        key A
        key #
      `,
      notes: ['The program reports one key at a time. For several simultaneous keys collect them in a list during the scan, and add a diode per key if more than two can be held.', 'The same pins work on an ESP32-S3, C3 or C6 board if you choose free ordinary GPIOs: the structure does not change.']
    }
  ],
  examples: [
    {
      title: 'Pins for a bigger keypad',
      q: 'A control panel needs 36 keys. How few pins does a matrix need, and what does a resistor ladder need?',
      steps: ['A matrix of $R \\times C$ keys needs $R + C$ pins. For 36 keys, $6 \\times 6$ gives $6 + 6 = 12$ pins; $4 \\times 9$ gives 13.', 'A resistor ladder needs one ADC pin, but 36 voltages are too many to tell apart reliably on a 12-bit ADC with tolerances.', 'So a 6 × 6 matrix, or an I2C port expander on two pins.'],
      a: 'A 6 × 6 matrix needs 12 pins. A ladder needs one pin but is good only for a handful of keys; an expander needs two.'
    }
  ],
  quiz: [
    { q: 'How many pins does a 4×4 key matrix need?', choices: ['4', '8', '16', '12'], a: 1, why: 'Four rows plus four columns: 8 pins read 16 keys.' },
    { q: 'Keys (row 1, col 1), (row 1, col 2) and (row 2, col 1) are held on a matrix without diodes. What does the scan report?', choices: ['Those three keys only', 'Those three and (row 2, col 2), which is a ghost', 'Nothing', 'Only the first key'], a: 1, why: 'Driving row 2 low reaches column 2 by a sneak path through the other three keys, so the fourth corner looks pressed.' },
    { q: 'Where does the diode go for each key, to prevent ghosting?', choices: ['Across the key', 'In series with the key, cathode towards the driven row', 'From the row to the supply', 'Not needed with pull-ups'], a: 1, why: 'A series diode lets current flow only from the column into the driven row, so it cannot find its way back through other keys.' },
    { q: 'With a resistor-ladder keypad on one ADC pin, you can read two keys held at once.', a: false, why: 'The pin sees one voltage for the whole network; two keys give a voltage that may look like a third key. Only one key at a time can be told apart.' }
  ],
  applications: [
    'PIN pads and number entry on door locks, safes and ovens.',
    'Phone-style keypads and calculator keyboards.',
    'Home-built keyboards and macro pads, with a diode per key.',
    'Front-panel buttons on instruments, read by a resistor ladder or a scanner chip.'
  ],
  sources: [
    'Espressif, *ESP32 Series Datasheet*: GPIO pins, pull-up resistors, ADC channels.',
    'Arduino core for ESP32 documentation, *GPIO* API: pinMode with INPUT and OUTPUT, digitalRead.',
    'Manufacturer datasheets of matrix keypads and of keypad-scanner chips such as the TCA8418.'
  ],
  sim: 'hi-keypad'
},

/* ================================================================ touch-pins */
{
  id: 'touch-pins',
  parent: 'human-inputs',
  title: 'Capacitive touch pins',
  level: 2,
  short: 'A touch pad is a patch of copper wired to a pin. A finger adds a few picofarads, the chip notices how long the pad takes to charge, and its reading shifts: down on the ESP32, up on the S2 and S3.',
  keywords: ['touch pin', 'capacitive touch', 'touchRead', 'touchAttachInterrupt', 'TouchPad', 'touch pad', 'T0', 'baseline', 'threshold', 'touch wake-up', 'ESP32-S3 touch', 'proximity', 'water', 'MPR121', 'TTP223'],
  prereq: ['buttons-and-switches', 'analog-input', 'input-only-and-special-pins'],
  related: ['capacitive-touch-screens', 'wake-up-sources', 'deep-sleep', 'debouncing', 'reading-sensors-reliably', 'strapping-pins'],
  body: `Some ESP chips can sense touch with no button at all. A **touch pin** is wired inside the chip to a circuit that measures the **capacitance** of the pad connected to it. Every conductor near the pad forms a tiny capacitor with it; a finger, which is mostly salty water, adds a few picofarads. The chip charges and discharges the pad many times and counts how long that takes: more capacitance, slower cycle, different count.

### Which chips, which pins

The catalogue shows touch only on four chips: the original **ESP32** with **10 touch pads** (on GPIO4, 0, 2, 15, 13, 12, 14, 27, 33 and 32), the **ESP32-S2 and S3** with **14 pads** (GPIO1 to GPIO14) and the **ESP32-P4** with 14. The C-series, the H2 and the ESP8266 have none: there an external touch chip (the MPR121 on I2C, the single-key TTP223) does the job.

### The direction trap

On the ESP32 the reading **falls** when the pad is touched. On the S2, S3 and P4 it **rises**. Code that compares "below the threshold" on one chip must flip on the other. The numbers differ too: tens on an ESP32 and tens of thousands on an S3, varying with board and wiring, so **print the untouched values and choose the threshold from them**. The simulation below shows both directions, with schematic numbers.

### Using it well

- **Calibrate at start-up**: average several readings without a finger as the baseline, and set the threshold a margin (say 20 %) away from it. Newer cores can derive the threshold from the baseline themselves.
- **Track drift slowly**: humidity, temperature and a nearby hand shift the baseline. Update it only while untouched, with a slow average ([[reading-sensors-reliably]]).
- **Keep the pad and its wire short** and away from other signals; a copper pad of 10–15 mm under a plastic or glass cover of a few millimetres works, but a thicker cover weakens the signal.
- **Water on the pad** acts like a finger, so touch fails near wet places or needs a guard ring.
- **Mind the pin**: GPIO0, 2, 12 and 15 of the ESP32 are strapping pins ([[strapping-pins]]) and touch uses them like any other. Once \`touchRead\` has set a pin up, it is no longer an ordinary GPIO until reset.
- **Wake-up**: a touch can wake the chip from deep sleep; the ESP32 allows several pads, the S2 and S3 only one ([[wake-up-sources]]).

> [!warn] A touch sense is not a safety control. Wet hands, moisture and electrical noise can trigger or block it: never use a bare touch pad as the only guard of something dangerous, and never connect a pad to a mains-powered surface.

> [!key] A touch pin measures the capacitance of a copper pad: a finger changes the reading, down on the ESP32 and up on the S2, S3 and P4. Print the baseline, pick a threshold from it, keep wires short, and track drift.`,
  ideas: [
    'A touch pin measures how long a copper pad takes to charge, which depends on its capacitance; a finger adds some.',
    'Only the ESP32 (10 pads), the S2 and S3 (14 pads) and the P4 (14 pads) have touch pins.',
    'The reading falls when touched on the ESP32 and rises on the S2, S3 and P4: compare in the right direction.',
    'Choose the threshold from the printed baseline, track slow drift, and keep wires short.'
  ],
  pitfalls: [
    'Touch works the same on every ESP chip — Only four families have it, and the reading moves in opposite directions on the ESP32 and the S2 and S3.',
    'A fixed threshold copied from a tutorial will work — Values depend on board, wire and cover. Print yours, and set the threshold relative to your baseline.',
    'Touch pins stay ordinary GPIOs afterwards — After touchRead the pin is configured for touch; use another pin for digital I/O.'
  ],
  terms: [
    { term: 'Capacitive touch', also: ['touch sensing', 'capacitive sensing'], def: 'Detecting a finger by the small increase of capacitance it adds to a conductive pad. No pressure or contact with metal is needed.' },
    { term: 'Touch pad', also: ['touch electrode', 'sense pad'], def: 'The patch of copper, foil or conductive paint connected to a touch pin. Its size, the wire to it and the cover over it decide the sensitivity.' },
    { term: 'Baseline', also: ['untouched value', 'reference value'], def: 'The reading of a touch pad with nothing near it. The threshold is set relative to it, and it should follow slow drift of temperature and humidity.' },
    { term: 'Touch threshold', also: ['trigger level'], def: 'The reading beyond which the program calls the pad touched. It is below the baseline on the ESP32 and above it on the S2, S3 and P4.' },
    { term: 'Touch wake-up', also: ['wake on touch'], def: 'Waking the chip from deep or light sleep when a touch pad is touched. The ESP32 can use several pads; the S2 and S3 only one.' }
  ],
  choose: {
    good: ['Sleek panel buttons behind a thin plastic or glass cover', 'Wake-up of a battery device by touch', 'Sliders and wheels made of several pads', 'A pad on an ESP32, S2 or S3 where no extra part is wanted'],
    avoid: ['Wet places and outdoors without guard rings and tracking', 'Thick covers, gloves and long wires', 'Safety functions and anything where a false trigger is dangerous', 'A C3, C6 or H2 board: there is no touch hardware'],
    check: ['The direction of change on your chip', 'Printed untouched and touched values for your own pad', 'That the pin is not a strapping pin your circuit disturbs', 'How the baseline follows humidity and temperature']
  },
  code: [
    {
      title: 'A touch button with a measured baseline',
      about: 'At start-up the program averages 16 untouched readings as the baseline. A reading 20 % below it counts as a touch and lights the LED. (The comparison is for the ESP32; on an S2 or S3 the values rise.)',
      needs: 'An ESP32 DevKit, a wire or a copper pad on GPIO4, and an LED with a 220 Ω resistor.',
      wiring: [['GPIO4', 'touch pad (T0 on the ESP32)', 'a short wire to a copper pad'], ['GPIO26', '220 Ω → LED → GND']],
      blocks: `
        when started
          set pin (26) as [output v]
          start serial at (115200) baud
          wait (0.5) seconds
          set [total v] to (0)
          repeat (16)
            change [total v] by (touch value of pin (4))
            wait (0.02) seconds
          end
          set [baseline v] to ((total) / (16))
          print (join [baseline ] (baseline))
        forever
          set [value v] to (touch value of pin (4))
          set [touched v] to <(value) < ((baseline) * (0.8))>
          set pin (26) to (touched)
          print (value)
          wait (0.05) seconds
        end
      `,
      cpp: String.raw`
        const int TOUCH_PIN = 4;         // GPIO4 is T0 on the ESP32; any of GPIO1-14 on an S2 or S3
        const int LED = 26;

        uint32_t baseline = 0;

        void setup() {
          Serial.begin(115200);
          pinMode(LED, OUTPUT);
          delay(500);                    // do not touch the pad yet
          uint32_t total = 0;
          for (int i = 0; i < 16; i++) {
            total += touchRead(TOUCH_PIN);
            delay(20);
          }
          baseline = total / 16;
          Serial.printf("baseline %lu\n", (unsigned long)baseline);
        }

        void loop() {
          uint32_t value = touchRead(TOUCH_PIN);
          bool touched = value < baseline * 0.8;   // ESP32: the value FALLS when touched
          digitalWrite(LED, touched);
          Serial.println(value);
          delay(50);
        }
      `,
      py: String.raw`
        from machine import TouchPad, Pin
        import time

        TOUCH_PIN = 4                    # GPIO4 is T0 on the ESP32; any of GPIO1-14 on an S2 or S3
        LED = 26

        led = Pin(LED, Pin.OUT)
        pad = TouchPad(Pin(TOUCH_PIN))

        time.sleep_ms(500)               # do not touch the pad yet
        total = 0
        for i in range(16):
            total += pad.read()
            time.sleep_ms(20)
        baseline = total // 16
        print("baseline", baseline)

        while True:
            value = pad.read()
            touched = value < baseline * 0.8     # ESP32: the value FALLS when touched
            led.value(touched)
            print(value)
            time.sleep_ms(50)
      `,
      output: `
        baseline 74
        74
        73
        31
        28
        74
      `,
      notes: ['The numbers in the output are only an example: they depend on the board and the wire. On an S2 or S3 the values are far larger and rise when touched: change the test to value > baseline * 1.2 after printing yours.', 'Do not touch the pad during the first second after reset, or the baseline is wrong.']
    },
    {
      title: 'A touch interrupt',
      about: 'The chip raises an interrupt when the pad is touched; the loop toggles the LED. With a threshold of 0 the core works the threshold out from the baseline itself (core 3.3 on a recent IDF).',
      needs: 'An ESP32 DevKit, a pad on GPIO4 and an LED with a 220 Ω resistor.',
      wiring: [['GPIO4', 'touch pad'], ['GPIO26', '220 Ω → LED → GND']],
      blocks: `
        when started
          set pin (26) as [output v]
          set [ledOn v] to <false>
          start serial at (115200) baud

        when touch pad on pin (4) is touched :: events
          set [ledOn v] to <not <ledOn>>
          set pin (26) to (ledOn)
          print [touch!]
      `,
      cpp: String.raw`
        const int TOUCH_PIN = 4;
        const int LED = 26;

        volatile bool touched = false;
        bool ledOn = false;

        void IRAM_ATTR onTouch() {                  // keep it tiny: just raise a flag
          touched = true;
        }

        void setup() {
          Serial.begin(115200);
          pinMode(LED, OUTPUT);
          touchAttachInterrupt(TOUCH_PIN, onTouch, 0);   // 0: automatic threshold from the baseline
        }

        void loop() {
          if (touched) {
            touched = false;
            ledOn = !ledOn;
            digitalWrite(LED, ledOn);
            Serial.println("touch!");
          }
        }
      `,
      na: { py: 'MicroPython\'s TouchPad has no interrupt: poll read() as in the first program, or wake the chip from sleep on touch with esp32.wake_on_touch().' },
      notes: ['Older cores (2.x) need a fixed threshold as the third argument, for example 40 on the ESP32.', 'A touch interrupt fires repeatedly while the pad stays touched: the flag is cleared in the loop, so hold the finger on and it toggles again and again unless you add a lock-out.']
    }
  ],
  examples: [
    {
      title: 'Choosing a threshold',
      q: 'The untouched readings of an ESP32 pad average 80, and a firm touch gives 25. Where would you put the threshold, and what margin does that leave on each side?',
      steps: ['The baseline is 80 and the touched value 25: the signal is $80 - 25 = 55$ counts.', 'A threshold at 20 % below the baseline is $80 \\times 0.8 = 64$.', 'Margin untouched: $80 - 64 = 16$ counts of noise or drift allowed. Margin touched: $64 - 25 = 39$ counts.'],
      a: 'A threshold of about 64 leaves 16 counts for drift when untouched and 39 for a light touch. If the drift is bigger, track the baseline slowly.'
    }
  ],
  quiz: [
    { q: 'On an ESP32 (not an S3), what happens to the touchRead value when you touch the pad?', choices: ['It rises', 'It falls', 'It stays the same', 'It becomes zero exactly'], a: 1, why: 'The finger adds capacitance, the charge cycle gets slower and the ESP32 count falls. On the S2, S3 and P4 it rises.' },
    { q: 'You want a touch button on an ESP32-C3. What is the best plan?', choices: ['Use touchRead on any GPIO', 'Add a touch chip such as the TTP223 or MPR121; the C3 has no touch hardware', 'Use the DAC', 'Use LEDC'], a: 1, why: 'The C3 has no touch sensor. A single-key TTP223 module or an MPR121 on I2C provides it.' },
    { q: 'Why should the program measure a baseline at start-up instead of using a fixed number?', choices: ['The readings depend on the board, the wire and the cover', 'touchRead returns random numbers', 'The threshold must be zero', 'Interrupts need it'], a: 0, why: 'Raw values differ between boards and change with wire length, cover thickness, humidity and temperature, so the threshold is set relative to your own baseline.' },
    { q: 'A touch pad is a suitable sole guard for a machine\'s dangerous parts.', a: false, why: 'Moisture, noise and wet hands can trigger or block it, so it must never be the only protection of something dangerous.' }
  ],
  applications: [
    'Touch buttons behind a glass or plastic panel on appliances and lamps.',
    'Touch wake-up of a battery device without a mechanical button.',
    'Sliders and wheels made of several pads.',
    'Plant-touch or conductive-object toys and interactive art.'
  ],
  sources: [
    'Espressif, *ESP32 Series Datasheet* and *ESP32-S3 Series Datasheet*: the touch sensor and its pins.',
    'Arduino core for ESP32 documentation, *Touch* API: touchRead, touchAttachInterrupt (core 3.3).',
    'MicroPython documentation, *Quick reference for the ESP32*: capacitive touch (version 1.29).'
  ],
  sim: 'hi-touch'
},

/* ================================================================ joysticks */
{
  id: 'joysticks',
  parent: 'human-inputs',
  title: 'Joysticks',
  level: 2,
  short: 'A thumb joystick is two potentiometers and a switch. Each axis is a voltage the ADC reads; the work is in finding the true centre, ignoring the jitter around it and scaling the rest to a useful range.',
  keywords: ['joystick', 'thumb joystick', 'analog stick', 'dual axis', 'dead zone', 'centre calibration', 'KY-023', 'potentiometer', 'ADC1', 'gamepad', 'drift', 'Hall effect joystick', 'navigation switch', 'd-pad'],
  prereq: ['potentiometers', 'the-esp-adc', 'adc1-adc2-and-wifi'],
  related: ['analog-input', 'adc-attenuation-and-calibration', 'oversampling-and-noise', 'buttons-and-switches', 'esp-now', 'filtering-sensor-data'],
  body: `The little stick on a game controller or a hobby module is two **potentiometers** at right angles, with a spring that returns them to the middle, and usually a push-switch that closes when the stick is pressed down. Each potentiometer is a voltage divider across the supply: the wiper gives a voltage between 0 V and the supply voltage, proportional to how far the stick is pushed along that axis. The chip reads two analogue voltages and one digital input.

### Wiring

Power the module from **3.3 V**, not 5 V: its outputs follow its supply, and a wiper at 5 V on an ADC pin is beyond the chip's limit ([[three-volt-logic]]). Connect X and Y to two analogue pins and the switch to a normal GPIO with its pull-up ([[buttons-and-switches]]). On the original ESP32 choose **ADC1** pins (GPIO32–39) so that readings keep working while Wi-Fi is on ([[adc1-adc2-and-wifi]]); GPIO34 and 35 are input-only, which is fine for an analogue read but means the switch needs another pin. On an S3 ADC1 is GPIO1–10.

### Three things the raw numbers do not give you

1. **The centre is not 2048.** A 12-bit reading runs 0–4095, so the middle should be 2048, but cheap modules rest 50–200 counts away, and each axis differently. Measure the centre at start-up (the average of 20–30 readings with the stick released) and subtract it.
2. **The reading jitters.** Noise and the sloppiness of a worn track make the value wander a few counts even at rest. A **dead zone** — say ±8 % of full travel, around the centre — treats those as zero, so a cursor or a motor does not creep.
3. **The two halves are not equal.** From the measured centre to the top is a different number of counts than from the centre to the bottom, so scale each side separately to −100…+100.

The ESP32's ADC is not linear near the ends, and its top range is compressed: the last few per cent of travel may all read 4095. That is fine for a stick; if you need exact values see [[adc-attenuation-and-calibration]] and [[oversampling-and-noise]].

### Beyond the cheap module

A dead zone makes the stick feel "numb" near the middle, and a shaped curve (small output for small deflection, more for large) gives fine control: use the dead zone as small as noise allows. Potentiometers wear and drift; gamepads now use **Hall-effect** sticks that measure a magnet's position with no sliding contact. A four-way **navigation switch** or d-pad is just four buttons, read digitally. Wireless remotes send the two numbers by [[esp-now]].

> [!key] A joystick is two voltage dividers and a switch: read the axes with ADC1 pins at 3.3 V, measure the centre at start-up, ignore a small dead zone, and scale each side of the centre separately to −100…+100.`,
  ideas: [
    'A thumb joystick is two potentiometers (X and Y) and a push-switch; each axis is a voltage between 0 V and the supply.',
    'Power the module from 3.3 V and read the axes on ADC1 pins when Wi-Fi is used on the original ESP32.',
    'The true centre differs from the middle of the range: measure it at start-up and subtract it.',
    'A dead zone around the centre removes jitter, and each side of the centre is scaled separately to −100…+100.'
  ],
  pitfalls: [
    'Centre is exactly 2048 — Only on an ideal part. Cheap modules rest 50–200 counts away and drift: measure the centre.',
    'A bigger dead zone is always better — It stops creeping but makes the stick numb near the middle. Make it as small as the noise allows.',
    'The module can run from 5 V like an Arduino Uno shield — Its outputs follow its supply, and 5 V on an ADC pin can damage the ESP32. Power it from 3.3 V.'
  ],
  terms: [
    { term: 'Dead zone', also: ['deadband', 'neutral zone'], def: 'A small range around the centre of an axis in which the reading is treated as zero, so that noise and a slightly worn track do not move the output.' },
    { term: 'Centre calibration', also: ['zeroing', 'neutral calibration'], def: 'Measuring the reading of a released stick at start-up and subtracting it, because the electrical centre of a joystick is not exactly the middle of the ADC range.' },
    { term: 'Analog stick', also: ['thumb joystick', 'thumbstick'], def: 'A two-axis input made of two potentiometers and a return spring, giving two voltages that follow the position of the stick.' },
    { term: 'Hall-effect stick', also: ['magnetic joystick'], def: 'A joystick that measures the position of a magnet with Hall sensors, so there is no sliding contact to wear or drift.' }
  ],
  choose: {
    good: ['A thumb joystick module for a remote, a robot or a menu cursor', 'A navigation switch (four buttons and a press) when direction without amount is enough', 'A Hall-effect stick for a controller that must not drift', 'Two ADC1 pins and one digital pin for the stick on an ESP32'],
    avoid: ['Powering the module from 5 V', 'ADC2 pins on the original ESP32 while Wi-Fi is on', 'Using the raw reading with no centre calibration', 'A large dead zone on a fine-control application'],
    check: ['The resting values of both axes on your module', 'That the full travel reaches both ends of the scale', 'Which direction is positive, and swap or invert if needed', 'That the push-switch is on a pin with a pull-up']
  },
  code: [
    {
      title: 'Read a joystick with centre calibration and a dead zone',
      about: 'The program measures the centre of both axes at start-up, then prints each axis scaled to −100…+100, with a dead zone of 8 % and the state of the push-switch.',
      needs: 'An ESP32 DevKit and a thumb joystick module powered from 3.3 V. Keep the stick released while the program starts.',
      wiring: [['GPIO34', 'joystick X (VRx)', 'ADC1 channel 6, input only'], ['GPIO35', 'joystick Y (VRy)', 'ADC1 channel 7, input only'], ['GPIO25', 'joystick switch (SW) → GND', 'internal pull-up'], ['3V3 and GND', 'joystick supply']],
      blocks: `
        when started
          set pin (25) as [input with pull-up v]
          start serial at (115200) baud
          wait (0.5) seconds
          set [centreX v] to (average of 32 analog readings on pin (34))
          set [centreY v] to (average of 32 analog readings on pin (35))
        forever
          set [x v] to (scaled ((analog read pin (34)) - (centreX)) to -100..100 with dead zone (8))
          set [y v] to (scaled ((analog read pin (35)) - (centreY)) to -100..100 with dead zone (8))
          print (join [x ] (join (x) (join [  y ] (y))))
          if <(read pin (25)) = [LOW v]> then
            print [pressed]
          end
          wait (0.1) seconds
        end
      `,
      cpp: String.raw`
        const int X_PIN = 34;                  // ADC1 pins keep working with Wi-Fi on
        const int Y_PIN = 35;
        const int BUTTON = 25;
        const int DEAD_ZONE = 8;               // percent of full travel treated as centred

        int centreX = 0, centreY = 0;

        int readAverage(int pin) {
          long total = 0;
          for (int i = 0; i < 32; i++) {
            total += analogRead(pin);
            delay(2);
          }
          return total / 32;
        }

        int scaled(int raw, int centre) {      // -100 .. 100, each side of the centre on its own scale
          int span = (raw >= centre) ? (4095 - centre) : centre;
          if (span < 1) span = 1;
          int v = (raw - centre) * 100 / span;
          if (abs(v) < DEAD_ZONE) return 0;    // ignore the jitter around the centre
          return v;
        }

        void setup() {
          Serial.begin(115200);
          pinMode(BUTTON, INPUT_PULLUP);
          delay(500);                          // keep the stick released
          centreX = readAverage(X_PIN);
          centreY = readAverage(Y_PIN);
        }

        void loop() {
          int x = scaled(analogRead(X_PIN), centreX);
          int y = scaled(analogRead(Y_PIN), centreY);
          Serial.printf("x %d  y %d\n", x, y);
          if (digitalRead(BUTTON) == LOW) Serial.println("pressed");
          delay(100);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        X_PIN = 34                             # ADC1 pins keep working with Wi-Fi on
        Y_PIN = 35
        BUTTON = 25
        DEAD_ZONE = 8                          # percent of full travel treated as centred

        adc_x = ADC(Pin(X_PIN), atten=ADC.ATTN_11DB)
        adc_y = ADC(Pin(Y_PIN), atten=ADC.ATTN_11DB)
        button = Pin(BUTTON, Pin.IN, Pin.PULL_UP)

        def analog_read(adc):
            return adc.read_u16() >> 4         # 16-bit reading down to 0..4095

        def read_average(adc):
            total = 0
            for i in range(32):
                total += analog_read(adc)
                time.sleep_ms(2)
            return total // 32

        def scaled(raw, centre):               # -100 .. 100, each side of the centre on its own scale
            span = (4095 - centre) if raw >= centre else centre
            if span < 1:
                span = 1
            v = (raw - centre) * 100 // span
            if abs(v) < DEAD_ZONE:             # ignore the jitter around the centre
                return 0
            return v

        time.sleep_ms(500)                     # keep the stick released
        centre_x = read_average(adc_x)
        centre_y = read_average(adc_y)

        while True:
            x = scaled(analog_read(adc_x), centre_x)
            y = scaled(analog_read(adc_y), centre_y)
            print("x", x, " y", y)
            if button.value() == 0:
                print("pressed")
            time.sleep_ms(100)
      `,
      output: `
        x 0  y 0
        x 37  y 0
        x 85  y -42
        pressed
      `,
      notes: ['Integer division of a negative number rounds differently in C++ (towards zero) and Python (down), so a value near the dead-zone edge can differ by one between the two versions.', 'On an S3, C3 or C6 use ADC1 pins (GPIO1–10 on the S3, GPIO0–4 on the C3) and keep the 12-bit scale; the structure is the same.']
    }
  ],
  examples: [
    {
      title: 'Scaling a reading',
      q: 'A joystick axis rests at 2110 counts. The stick is pushed up to a reading of 3100. What is the scaled value on the −100…+100 scale with the centre removed?',
      steps: ['Above the centre the span is $4095 - 2110 = 1985$ counts.', 'The deflection is $3100 - 2110 = 990$ counts.', 'Scaled: $990 \\times 100 / 1985 \\approx 49.9$, so about 50.'],
      a: 'About +50: half of the way up. The same reading scaled with the centre taken as 2048 would give 52, so the error from a wrong centre is small here but shows as creep at rest.'
    }
  ],
  quiz: [
    { q: 'A joystick axis reads 2105 at rest. What is the best way to deal with it?', choices: ['Assume 2048 anyway', 'Measure the centre at start-up and subtract it', 'Use a bigger pull-up', 'Switch to ADC2'], a: 1, why: 'The electrical centre differs from the middle of the range and between modules. Measure it with the stick released and subtract it.' },
    { q: 'Why is a joystick module powered from 3.3 V rather than 5 V on an ESP32?', choices: ['5 V modules do not exist', 'Its outputs follow its supply, and 5 V on an ADC pin can damage the chip', 'The switch only works at 3.3 V', 'ADC1 needs 3.3 V'], a: 1, why: 'The wiper voltage is a fraction of the supply, so a 5 V supply can put up to 5 V on an ADC pin, above the 3.6 V limit.' },
    { q: 'What does a dead zone do?', choices: ['Makes the stick faster', 'Treats small deflections around the centre as zero so noise does not move the output', 'Calibrates the maximum', 'Disables the switch'], a: 1, why: 'Small readings near the centre are jitter or wear, not intent, so they are set to zero.' },
    { q: 'On an ESP32 with Wi-Fi on, a joystick axis can use any ADC2 pin.', a: false, why: 'On the original ESP32 ADC2 conflicts with Wi-Fi. Use ADC1 pins (GPIO32–39).' }
  ],
  applications: [
    'Wireless remote controls for robots, cars and drones, sending the two axes by ESP-NOW or Bluetooth.',
    'Cursor and menu navigation on a small display.',
    'Game controllers and handheld consoles built on an ESP32.',
    'Pan-and-tilt camera heads and camera sliders.'
  ],
  sources: [
    'Espressif, *ESP32 Series Datasheet*: ADC channels and input limits; *ESP-IDF Programming Guide*, ADC reference.',
    'Arduino core for ESP32 documentation, *ADC* API: analogRead, resolution and attenuation (core 3.3).',
    'MicroPython documentation, *Quick reference for the ESP32*: ADC (version 1.29).'
  ],
  sim: 'hi-joystick'
},

/* ================================================================ infrared-remotes */
{
  id: 'infrared-remotes',
  parent: 'human-inputs',
  title: 'Infrared remotes',
  level: 2,
  short: 'A remote blinks an invisible LED in a pattern. A three-pin receiver module turns the blinks into a clean digital signal, and the chip measures the gaps: in the NEC code a short gap is a 0 and a long one a 1.',
  keywords: ['infrared', 'IR remote', 'IR receiver', 'VS1838B', 'TSOP', '38 kHz', 'NEC protocol', 'remote control', 'IRremote', 'IRremoteESP8266', 'carrier', 'demodulator', 'repeat code', 'address and command', 'RC5', 'Sony SIRC'],
  prereq: ['digital-input', 'interrupts', 'bits-and-bytes'],
  related: ['infrared-transmitters', 'the-rmt-peripheral', 'timeouts-and-timed-states', 'buttons-and-switches', 'measuring-frequency-and-time'],
  body: `A TV remote has an infrared LED (about 940 nm, invisible to the eye though a phone camera sees it) and a chip that flashes it in a code. The light does not blink slowly: each "on" is a burst of the LED switched at about **38 kHz**, the **carrier**. The rapid pulsing lets the receiver tell the remote from sunlight and lamps, which do not flicker at that rate.

### The receiver module

A receiver such as the VS1838B or a TSOP-series part holds a photodiode, an amplifier, a 38 kHz band-pass filter and a demodulator in a package with three pins: supply, ground and output. Most accept 3.3 V (check the datasheet). The output is **idle high and goes low while the carrier is present**, so the chip sees the *envelope* of each burst, never the 38 kHz. Measuring the bursts and gaps is a job for interrupts with timestamps, or for the RMT peripheral, which records pulse widths in hardware ([[the-rmt-peripheral]]).

### The NEC code

The most common protocol is NEC. A frame is:

| Part | Duration | Meaning |
|---|---|---|
| Leader | 9 ms burst + 4.5 ms gap | starts the frame |
| 32 bits | each starts with a 560 µs burst | gap 560 µs = **0**, gap 1690 µs = **1** (a whole bit is 1.125 ms or 2.25 ms) |
| The bits | address, address inverted, command, command inverted | **lowest bit first** |
| Stop | one 560 µs burst | ends the frame |

Sending each byte with its inverse lets the receiver check for errors: a byte and its complement must add up to 255. A standard frame always has sixteen ones and sixteen zeros, so it lasts about 68 ms. When a key is **held**, the remote does not repeat the whole frame: after 108 ms it sends a short **repeat code** (a 9 ms burst, a 2.25 ms gap and one 560 µs burst) every 108 ms. Extended NEC uses a 16-bit address with no inverse. Others use other codes (Sony's SIRC at 40 kHz, Philips RC-5 at 36 kHz, Samsung and more); libraries such as IRremote and IRremoteESP8266 decode dozens.

### Decoding by time

You only need one edge type. If you timestamp each **falling edge** of the receiver output (the start of a burst), the leader is 13.5 ms between the first two edges, and then the time from one falling edge to the next is 1.125 ms for a 0 and 2.25 ms for a 1. A threshold of 1.7 ms separates them. A gap of 20 ms with no edge means the frame is over. The simulation below draws a frame from an address and a command and decodes it the same way.

### Traps

- **Interference.** Sunlight and some lamps cause stray pulses: reject frames of the wrong length or with bad inverse bytes.
- **A remote is not a key.** IR codes are sent in the clear and can be recorded and replayed: convenience, not security.
- **Sending** needs a transistor to drive the LED ([[infrared-transmitters]]).

> [!key] An IR receiver module gives the envelope of a 38 kHz-modulated burst, idle high. In the NEC code the time between falling edges tells the bits: 1.125 ms for 0 and 2.25 ms for 1, after a 13.5 ms leader; check each byte against its inverse.`,
  ideas: [
    'A remote flashes an infrared LED at about 38 kHz in bursts; the receiver module demodulates them into a clean digital signal that idles high.',
    'The NEC code sends a leader and 32 bits (address, inverted address, command, inverted command), lowest bit first.',
    'The gap after each 560 µs burst is 560 µs for a 0 and 1690 µs for a 1: timing falling edges decodes it.',
    'A held key sends short repeat codes every 108 ms, and the inverted bytes allow error checking.'
  ],
  pitfalls: [
    'The chip sees the 38 kHz signal — The module removes the carrier: the pin shows only the bursts as low pulses.',
    'Every remote uses the same code — NEC is the most common, but Sony, RC-5, Samsung and others differ in carrier, timing and length.',
    'IR commands are secure — They are sent in the clear and can be replayed by anyone with a receiver and a transmitter.'
  ],
  terms: [
    { term: 'Carrier', also: ['38 kHz carrier', 'modulation'], def: 'The fast on-off switching of the infrared LED, typically at 38 kHz, within each burst. It lets the receiver reject steady and slowly varying light.' },
    { term: 'IR receiver module', also: ['VS1838B', 'TSOP', 'IR demodulator'], def: 'A small three-pin part with a photodiode, filter and demodulator. Its output idles high and goes low during a burst of the right carrier frequency.' },
    { term: 'NEC protocol', also: ['NEC code', 'NEC IR'], def: 'The common remote-control code: a 9 ms burst and 4.5 ms gap, then 32 bits of address and command, each with its inverse, using 560 µs bursts and gaps of 560 µs or 1690 µs.' },
    { term: 'Repeat code', also: ['key held code'], def: 'A short frame (9 ms burst, 2.25 ms gap, one 560 µs burst) sent every 108 ms while a key stays pressed, instead of the whole code again.' }
  ],
  choose: {
    good: ['An IR receiver module and a cheap remote for room-scale control of your own devices', 'The RMT peripheral or a library for many protocols and noisy rooms', 'NEC remotes for projects where the exact code does not matter', 'A receiver beside a TV-style dongle instead of a radio when no pairing is wanted'],
    avoid: ['IR as a security measure: codes can be recorded', 'Direct sunlight on the receiver', 'MicroPython handlers for hard real-time decoding in a noisy room', 'A receiver without the module (a bare photodiode)'],
    check: ['The carrier frequency of the remote and of the receiver module', 'Which protocol the remote uses: record a frame first', 'That the decoder checks the inverse bytes and the frame length', 'The supply voltage of your receiver at 3.3 V']
  },
  code: [
    {
      title: 'Decode an NEC remote',
      about: 'Every falling edge from the receiver is timestamped. When the line has been quiet for 20 ms the program decodes the frame from the gaps and prints the address and the command, or "repeat" for a repeat code.',
      needs: 'An ESP32 DevKit, an IR receiver module (VS1838B or similar) and an NEC remote.',
      wiring: [['GPIO27', 'receiver OUT', 'idles high'], ['3V3', 'receiver VCC'], ['GND', 'receiver GND']],
      blocks: `
        when started
          set pin (27) as [input v]
          start serial at (115200) baud
          set [edges v] to (empty list)
          set [last v] to (microseconds since start)
        forever
          if <<(length of [edges v]) > (0)> and <((microseconds since start) - (last)) > (20000)>> then
            decode NEC frame from [edges v] :: my
            set [edges v] to (empty list)
          end
        end

        when pin (27) goes [low v]
          set [last v] to (microseconds since start)
          add (last) to [edges v]

        define decode NEC frame from (list)
          // 34 edges: leader, 32 bits, stop. A gap between falling edges above 1.7 ms is a 1.
          // Bytes: address, address inverted, command, command inverted. Lowest bit first.
          if <(length of [list v]) = (2)> then
            print [repeat]
          else if <(length of [list v]) = (34)> then
            print (join [address ] (the address byte :: my))
            print (join [command ] (the command byte :: my))
          end
      `,
      cpp: String.raw`
        const int IR_PIN = 27;                    // receiver OUT: idles HIGH, LOW during a burst

        volatile uint32_t edgeTimes[40];          // time of each falling edge, in microseconds
        volatile uint8_t edgeCount = 0;
        volatile uint32_t lastEdge = 0;

        void IRAM_ATTR onFall() {
          uint32_t now = micros();
          uint8_t n = edgeCount;
          if (n < 40) {
            edgeTimes[n] = now;
            edgeCount = n + 1;
          }
          lastEdge = now;
        }

        void setup() {
          Serial.begin(115200);
          pinMode(IR_PIN, INPUT);
          attachInterrupt(IR_PIN, onFall, FALLING);
        }

        void loop() {
          if (edgeCount > 0 && micros() - lastEdge > 20000) {     // 20 ms of quiet: the frame is over
            uint8_t n = edgeCount;
            uint32_t leader = edgeTimes[1] - edgeTimes[0];
            if (n == 2 && leader > 10000 && leader < 12500) {     // 11.25 ms: a repeat code
              Serial.println("repeat");
            } else if (n == 34 && leader > 12000 && leader < 15000) {   // 13.5 ms: a full frame
              uint32_t code = 0;
              for (int i = 0; i < 32; i++) {
                uint32_t gap = edgeTimes[i + 2] - edgeTimes[i + 1];
                if (gap > 1700) code |= (uint32_t)1 << i;         // 2.25 ms is a 1, 1.125 ms is a 0
              }
              uint8_t address = code & 0xFF, command = (code >> 16) & 0xFF;
              bool ok = ((address ^ (code >> 8)) & 0xFF) == 0xFF && ((command ^ (code >> 24)) & 0xFF) == 0xFF;
              if (ok) Serial.printf("address 0x%02X command 0x%02X\n", address, command);
              else Serial.println("bad frame");
            }
            edgeCount = 0;
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        IR_PIN = 27                                # receiver OUT: idles 1, 0 during a burst

        edge_times = []                            # time of each falling edge, in microseconds
        last_edge = time.ticks_us()

        def on_fall(pin):
            global last_edge
            now = time.ticks_us()
            if len(edge_times) < 40:
                edge_times.append(now)
            last_edge = now

        ir = Pin(IR_PIN, Pin.IN)
        ir.irq(handler=on_fall, trigger=Pin.IRQ_FALLING)

        while True:
            if edge_times and time.ticks_diff(time.ticks_us(), last_edge) > 20000:   # 20 ms of quiet
                t = edge_times[:]
                n = len(t)
                leader = time.ticks_diff(t[1], t[0]) if n > 1 else 0
                if n == 2 and 10000 < leader < 12500:           # 11.25 ms: a repeat code
                    print("repeat")
                elif n == 34 and 12000 < leader < 15000:        # 13.5 ms: a full frame
                    code = 0
                    for i in range(32):
                        gap = time.ticks_diff(t[i + 2], t[i + 1])
                        if gap > 1700:                          # 2.25 ms is a 1, 1.125 ms is a 0
                            code |= 1 << i
                    address = code & 0xFF
                    command = (code >> 16) & 0xFF
                    ok = ((address ^ (code >> 8)) & 0xFF) == 0xFF and ((command ^ (code >> 24)) & 0xFF) == 0xFF
                    if ok:
                        print("address 0x%02X command 0x%02X" % (address, command))
                    else:
                        print("bad frame")
                edge_times.clear()
            time.sleep_ms(5)
      `,
      output: `
        address 0x00 command 0x45
        repeat
        repeat
        address 0x00 command 0x46
      `,
      notes: ['The numbers shown are an example: every remote has its own address and command codes.', 'The MicroPython handler runs a moment after the edge. In a quiet room the 0.56 ms margin is enough; in a noisy one use the C++ version or the RMT peripheral.', 'Libraries (IRremote, IRremoteESP8266) decode many protocols besides NEC and are the practical choice for a product; this program shows what they do inside.']
    }
  ],
  examples: [
    {
      title: 'How long is a frame?',
      q: 'An NEC frame carries address 0x00 and command 0xFF, with their inverses. How many bits are ones, and how long is the frame from the start of the leader to the end of the stop burst?',
      steps: ['The bytes are 0x00, 0xFF, 0xFF, 0x00: 16 ones and 16 zeros.', 'The leader is 13.5 ms. Sixteen zero-bits take $16 \\times 1.125 = 18$ ms and sixteen one-bits take $16 \\times 2.25 = 36$ ms.', 'The stop burst adds 0.56 ms: $13.5 + 18 + 36 + 0.56 = 68.06$ ms.'],
      a: 'Sixteen ones, and a frame of about 68 ms. Because every byte comes with its inverse, a frame always has exactly sixteen ones, so every NEC frame is about 68 ms.'
    }
  ],
  quiz: [
    { q: 'The IR receiver module outputs a signal on the GPIO. What does the pin show?', choices: ['The 38 kHz carrier', 'Low during each burst of the carrier and high otherwise', 'The visible light level', 'An analogue voltage'], a: 1, why: 'The module demodulates the carrier, so its output follows the bursts, active low.' },
    { q: 'In the NEC code, how long is the time between two falling edges for a bit that is 1?', choices: ['0.56 ms', '1.125 ms', '2.25 ms', '9 ms'], a: 2, why: 'A 560 µs burst plus a 1690 µs gap makes 2.25 ms; a 0 is 560 µs plus 560 µs, which is 1.125 ms.' },
    { q: 'Why does a frame carry both a byte and its inverse?', choices: ['To double the speed', 'So the receiver can check for errors: a byte and its inverse add up to 255', 'To save power', 'To select the carrier'], a: 1, why: 'A bit that is wrong breaks the complement relation, so a corrupted frame can be rejected.' },
    { q: 'An NEC remote makes a good access-control credential for a door lock.', a: false, why: 'IR codes are sent in the clear and can be recorded and replayed, so they give convenience, not security.' }
  ],
  applications: [
    'Controlling lamps, fans and curtains from a spare TV or media remote.',
    'Reading the remote of a robot, a car or a music player.',
    'Learning remotes: record one key, then replay it with an IR LED ([[infrared-transmitters]]).',
    'Obstacle and object sensing with a modulated IR LED and the same receiver.'
  ],
  sources: [
    'The NEC infrared transmission protocol description (timings of leader, bits, repeat code) as used by most hobby receivers.',
    'Datasheets of IR receiver modules (for example the TSOP family and the VS1838B): carrier frequency, supply range and output polarity.',
    'Espressif, *ESP-IDF Programming Guide*, RMT peripheral: capturing pulse widths.'
  ],
  sim: 'hi-nec'
},

/* ================================================================ rfid-and-nfc */
{
  id: 'rfid-and-nfc',
  parent: 'human-inputs',
  title: 'RFID and NFC readers',
  level: 2,
  short: 'A card with no battery answers a reader\'s magnetic field with its number. The RC522 and PN532 boards read 13.56 MHz cards over SPI, I2C or UART; the number identifies a card but is not a password.',
  keywords: ['RFID', 'NFC', 'RC522', 'MFRC522', 'PN532', 'MIFARE', 'NTAG', 'UID', '13.56 MHz', '125 kHz', 'EM4100', 'RDM6300', 'ISO 14443', 'access card', 'tag reader', 'SPI reader'],
  prereq: ['spi', 'digital-input', 'iot-threat-model'],
  related: ['spi-modes-and-speed', 'i2c', 'secure-elements', 'physical-attacks', 'esp-now', 'choosing-a-bus'],
  body: `An RFID tag has no battery. When it enters the magnetic field of a reader's coil it is powered by it, and answers by changing how much it loads the field. The reader hears the answer and receives a **UID**, the card's identification number, and can read or write the tag's small memory. Two families matter for makers:

| Family | Frequency | Typical cards | Typical module |
|---|---|---|---|
| Low frequency | 125 kHz | EM4100 key fobs: a fixed, read-only number | RDM6300 (UART) |
| High frequency | 13.56 MHz | MIFARE and NTAG cards, tags, stickers; phones speak the same language (**NFC**) | RC522 (SPI), PN532 (I2C, SPI or UART) |

**NFC** is a set of standards on top of 13.56 MHz (ISO 14443A and others) that also lets phones read tags: a tag with a link written on it opens a page when touched by a phone. Read range is a few centimetres.

### The two boards

- **RC522** (the MFRC522 chip): cheap, SPI (the chip can also do I2C or UART), reads and writes MIFARE-family cards and tags. It runs on 3.3 V: do not feed it 5 V. The Arduino library called MFRC522 drives it.
- **PN532**: costs more and does more: I2C, SPI or high-speed UART (chosen by switches or jumpers on the board), many tag types, NFC tag writing and some peer-to-peer. The Adafruit PN532 library is the common one.

The program below reads the UID of any card. A MicroPython RC522 driver is not built in: copy one for your board, with attention to its licence.

### What is on a card

The UID is 4, 7 or 10 bytes long. A MIFARE Classic 1K card has 1 KB of memory in 16 sectors; an NTAG213, 215 or 216 holds about 144, 504 or 888 bytes of user data, enough for a web address or a short record.

> [!warn] The UID is an identifier, not a secret. It is sent in the clear to any reader, and cards with a rewritable UID exist. MIFARE Classic's cipher has been broken for years. Never let a bare UID, or a Classic card, be the only guard of a door, a payment or anything valuable: use cards with strong authentication (DESFire class), keep the decision and the list of cards on a server or in a secure element, and log use ([[secure-elements]]).

### Traps

- **Two cards, one field.** Two cards in the reader's field collide; keep to one card at a time.
- **Metal.** A card on a metal surface detunes the coil and loses range; use a ferrite sheet or a metal-mount tag.
- **Power and noise.** The SPI lines are fast; keep them short and ground the reader well.
- **People and privacy.** A reader that identifies a person records their movements: tell them, and follow the law and the rules of the place.

> [!key] A 13.56 MHz reader such as the RC522 or PN532 powers a passive tag and reads its UID within a few centimetres. The UID tells you which card it is, never whether it is genuine: treat it as a name, not a password.`,
  ideas: [
    'A passive tag is powered by the reader\'s magnetic field and answers with its UID and data; the range is a few centimetres.',
    'Low-frequency 125 kHz tags have a fixed number; 13.56 MHz tags (MIFARE, NTAG, NFC) hold memory and talk to phones.',
    'The RC522 is a cheap 3.3 V SPI reader for MIFARE-family cards; the PN532 handles more tag types and buses.',
    'A UID is an identifier that can be read and copied: it must not be the only security of anything valuable.'
  ],
  pitfalls: [
    'A card UID proves who holds the card — It proves nothing: it is sent in the clear and can be copied to a rewritable card. Use strong authentication where it matters.',
    'The RC522 works from 5 V like an Arduino shield — It is a 3.3 V part. Power it from the ESP32\'s 3.3 V.',
    'RFID and NFC are the same thing — NFC is a standard built on 13.56 MHz RFID (ISO 14443 and others); a 125 kHz fob cannot talk to a phone.'
  ],
  terms: [
    { term: 'UID', also: ['unique identifier', 'card serial number'], def: 'The identification number of an RFID card, 4, 7 or 10 bytes long, sent to any reader that asks. It identifies a card but is not secret and, on some cards, can be copied.' },
    { term: 'NFC', also: ['near-field communication'], def: 'A set of standards for short-range communication at 13.56 MHz, over a few centimetres, between a reader and a tag or between two devices. Phones act as NFC readers.' },
    { term: 'MIFARE', also: ['MIFARE Classic', 'MIFARE Ultralight', 'DESFire'], def: 'A family of 13.56 MHz contactless cards from NXP, from the basic Classic and Ultralight to DESFire with strong authentication.' },
    { term: 'NTAG', also: ['NTAG213', 'NTAG215', 'NTAG216'], def: 'A family of low-cost NFC tags and stickers with 144 to 888 bytes of user memory, used to carry a link or a short record that a phone can read.' },
    { term: 'Passive tag', also: ['passive RFID'], def: 'A tag with no battery of its own that takes its power from the reader\'s field and answers by loading it.' }
  ],
  choose: {
    good: ['RC522 for a low-cost reader of cards and key fobs on SPI', 'PN532 for more tag types, I2C or UART wiring and NFC tag writing', 'NTAG stickers for links read by phones', 'A strong-authentication card family where security matters'],
    avoid: ['A bare UID as the only key to a door or a payment', 'Powering the RC522 from 5 V', 'MIFARE Classic as a secure credential', 'Reading people\'s cards without telling them'],
    check: ['That the cards and tags are 13.56 MHz if the reader is', 'The bus and the supply voltage of the module', 'That the decision about who is allowed is not made from the UID alone', 'The range through the case, and metal near the tag']
  },
  code: [
    {
      title: 'Read the UID of a card with an RC522',
      about: 'The program waits for a card, prints its UID in hexadecimal and puts the card to sleep so that it is read once each time it is presented.',
      needs: 'An ESP32 DevKit and an RC522 module, powered from 3.3 V.',
      wiring: [['GPIO27', 'RC522 SDA (SS)', 'chip select'], ['GPIO18', 'RC522 SCK'], ['GPIO23', 'RC522 MOSI'], ['GPIO19', 'RC522 MISO'], ['GPIO22', 'RC522 RST'], ['3V3 and GND', 'RC522 3.3V and GND', 'never 5 V']],
      libs: ['MFRC522'],
      blocks: `
        when started
          start SPI on SCK (18) MISO (19) MOSI (23)
          start RFID reader RC522 with select pin (27) and reset pin (22) :: bus
          start serial at (115200) baud
        forever
          if <new RFID card present?> then
            print (join [UID: ] (card UID as hex))
            halt the card :: bus
          end
        end
      `,
      cpp: String.raw`
        #include <SPI.h>
        #include <MFRC522.h>

        const int SS_PIN = 27;
        const int RST_PIN = 22;
        const int SCK_PIN = 18, MISO_PIN = 19, MOSI_PIN = 23;

        MFRC522 reader(SS_PIN, RST_PIN);

        void setup() {
          Serial.begin(115200);
          SPI.begin(SCK_PIN, MISO_PIN, MOSI_PIN, SS_PIN);
          reader.PCD_Init();
        }

        void loop() {
          if (!reader.PICC_IsNewCardPresent() || !reader.PICC_ReadCardSerial()) {
            return;                                    // no card in the field
          }
          Serial.print("UID:");
          for (byte i = 0; i < reader.uid.size; i++) {
            Serial.printf(" %02X", reader.uid.uidByte[i]);
          }
          Serial.println();
          reader.PICC_HaltA();                         // let the card sleep until it is presented again
        }
      `,
      na: { py: 'MicroPython has no RC522 driver built in: copy a driver module for the chip to the board (several exist; check the licence) and use its request and anticollision calls, which follow the same steps as the C++ library.' },
      output: `
        UID: 04 A2 3B 1C
      `,
      notes: ['Keep the credentials of anything that matters off the card: the UID alone does not prove the card is genuine.', 'On an ESP32-S3, C3 or C6 board choose ordinary free GPIOs for the SPI pins and pass them to SPI.begin.']
    }
  ],
  quiz: [
    { q: 'You want an ESP32 to read the 125 kHz key fob of a building. Is an RC522 the right module?', choices: ['Yes, it reads all RFID', 'No: it reads 13.56 MHz cards; a 125 kHz fob needs a 125 kHz reader such as an RDM6300', 'Yes, with a bigger antenna', 'Only with a PN532'], a: 1, why: 'The RC522 and PN532 work at 13.56 MHz. 125 kHz tags are a different system and need a 125 kHz reader.' },
    { q: 'What power supply does an RC522 module need on an ESP32 board?', choices: ['5 V', '3.3 V', '12 V', 'It is powered by the card'], a: 1, why: 'The module is a 3.3 V part, and 5 V can damage it and the ESP32 pins connected to it.' },
    { q: 'A door opens when the UID of the presented card is in a list. What is the main weakness?', choices: ['The list is too short', 'The UID is sent in the clear and can be copied onto a rewritable card', 'SPI is slow', 'The card needs a battery'], a: 1, why: 'Anyone who can read the UID can make a card that reports it. Use strong card authentication and server-side checks.' },
    { q: 'NFC and 13.56 MHz RFID are related: a phone can read an NTAG sticker.', a: true, why: 'NFC is built on 13.56 MHz contactless cards (ISO 14443 and related standards), so a phone can read tags such as NTAG.' }
  ],
  applications: [
    'Low-cost access control for a workshop, a locker or a hobby lock, as a convenience.',
    'Tagging tools, boxes and library items for inventory.',
    'Phone-readable NTAG stickers that carry a link or open a page.',
    'Toys and game pieces that identify themselves to a base station.'
  ],
  sources: [
    'NXP, MFRC522 datasheet: the interfaces, supply voltage and ISO 14443A support.',
    'NXP, PN532 user manual: interfaces and supported tag types.',
    'ISO/IEC 14443, *Identification cards, contactless integrated circuit cards, proximity cards*.'
  ]
}
);
