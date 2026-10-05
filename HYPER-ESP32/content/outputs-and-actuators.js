/* HYPER-ESP32 · content/outputs-and-actuators.js
 *
 * Topic "Lights, sound and loads" (outputs-and-actuators, simulation code oa):
 *   driving-leds-with-pwm · rgb-leds · addressable-leds · powering-led-strips · buzzers-and-tones
 *   switching-dc-loads · switching-mains-safely · fans-and-pwm-control · heaters-and-thermal-loads · infrared-transmitters
 */
Hyper.add(
/* ================================================================ driving-leds-with-pwm */
{
  id: 'driving-leds-with-pwm',
  parent: 'outputs-and-actuators',
  title: 'Dimming LEDs with PWM',
  level: 1,
  short: 'An LED cannot be dimmed with a voltage, so a pin flickers it faster than the eye can follow. How fast, how many steps, and why equal steps of duty do not look like equal steps of light.',
  keywords: ['PWM', 'dimming', 'LED brightness', 'flicker', 'gamma', 'ledcAttach', 'ledcWrite', 'ledcFade', 'duty cycle', 'breathing LED', 'fade', 'dithering', 'analogWrite', 'perceived brightness'],
  prereq: ['pwm-with-ledc', 'leds', 'resistors-in-esp-circuits'],
  related: ['rgb-leds', 'indicator-leds-and-bar-graphs', 'motor-pwm-frequency', 'mosfets-for-loads', 'pin-current-limits', 'electronics:pwm', 'electronics:leds'],
  body: `An LED has no useful dimming knob. Its voltage hardly moves while its current changes tenfold, and its light follows the current. So we do not turn it down, we **flicker** it: the pin switches the LED fully on and fully off thousands of times a second, the eye cannot follow, and it sees the average. Half the time on gives half the light, but not half the apparent brightness.

### Why switch instead of turning the current down

A larger resistor would also dim the LED, but it wastes the difference as heat, gives a narrow range and shifts the colour of some LEDs. With PWM the LED always runs at the current it was designed for, only for less of the time. The colour stays put, and one pin covers the range from full brightness to a thousandth of it.

### How fast must it flicker

| PWM frequency | What you see |
|---|---|
| below about 100 Hz | a visible flicker, worst at the corner of the eye and on moving things |
| 100 Hz to 1 kHz | steady when you stare, but a moving eye sees a trail of dots and a phone camera sees dark bands |
| 1 to 5 kHz | steady to eyes and nearly every camera: the usual choice, 5 kHz |
| above 20 kHz | nothing more to gain for an LED, only more switching loss (motors are different: [[motor-pwm-frequency]]) |

Frequency and resolution are cut from the same clock ([[pwm-with-ledc]]): at 5 kHz an 80 MHz clock allows at most 13 bits, so 8 to 12 bits are fine, while \`ledcAttach(pin, 5000, 16)\` fails on every chip.

### The eye is not linear

Light output is proportional to duty. The eye compresses: going from 10 % to 20 % of the light looks like a big step, from 80 % to 90 % hardly like one. A fade in equal duty steps therefore rushes through the dark and crawls through the bright. The cure is **gamma correction**: choose the brightness you want as the eye should see it, from 0 to 1, and write a duty of that number to the power 2.2.

| Wanted to look like | Duty needed |
|---|---|
| 10 % | 0.6 % |
| 25 % | 4.7 % |
| 50 % | 21.8 % |
| 75 % | 53.1 % |

### The dark end needs bits

Gamma correction makes the smallest duty values count. At 8 bits the first step above off is 1/255 of the duty, which the eye sees as a jump to about 8 % brightness: a fade from black visibly clicks on. Ten bits make that first step 4 %, twelve bits 2 %. This is why 8-bit LED strips look coarse when dim, and why good dimmers use 12 bits or more — or **temporal dithering**, which alternates between two neighbouring duty values to get the averages in between.

### Let the hardware fade

The LEDC can run a fade by itself: \`ledcFade(pin, from, to, ms)\` starts it and returns, and the loop is free. The hardware fade is linear in duty, so without a gamma table it has the uneven look described above.

> [!key] Dim an LED by switching it fast: 1 to 5 kHz is steady to the eye, and the duty sets the light, not the brightness you see. Raise the duty to the power 2.2 for fades that look even, and use 10 to 12 bits so that the dark end has enough steps.`,
  ideas: [
    'PWM runs the LED at its designed current for part of the time; the light is proportional to the duty, and the colour does not shift.',
    'From about 1 kHz upwards a single LED looks steady to eyes and cameras; 5 kHz is a safe default.',
    'The eye sees roughly the 2.2th root of the light, so a duty of L to the power 2.2 gives a brightness that looks like L.',
    'At 8 bits the first step above off already looks like about 8 % brightness: for smooth dim fades use 10 to 12 bits.'
  ],
  pitfalls: [
    'A fade in equal duty steps looks even — The light is even; the eye is not. The fade rushes through the dark and crawls through the bright until the duty goes through a gamma curve.',
    'More PWM bits are always possible — Bits and frequency share one clock. At 5 kHz the LEDC gives at most 13 bits, and the timer is only 14 bits wide on the S2, S3, C3 and C2 (20 on the ESP32 and C6).',
    'If it looks steady it is steady — The eye is slow, a camera or a moving glance is not. A 200 Hz LED that looks calm to you shows bands on a phone video.'
  ],
  terms: [
    { term: 'Flicker', also: ['PWM flicker', 'stroboscopic effect'], def: 'Visible or camera-visible variation of light from an LED that is switched on and off. It is controlled by raising the PWM frequency, not by changing the duty.' },
    { term: 'Temporal dithering', also: ['dithering', 'temporal modulation'], def: 'Getting finer brightness steps than the PWM resolution allows by switching between two neighbouring duty values from one period to the next, so that the average lies between them.' },
    { term: 'Hardware fade', also: ['ledcFade', 'LEDC fade'], def: 'A change of duty from one value to another over a given time, carried out by the LEDC peripheral itself so that the program is not needed while it runs. It is linear in duty.' },
    { term: 'Brightness step', also: ['duty step'], def: 'The smallest change the PWM can make: one count of duty, which is 1/(2^bits − 1) of the full range. At the dark end of a gamma-corrected fade it is large enough to see.' }
  ],
  choose: {
    good: ['Hardware PWM (LEDC) at 1 to 5 kHz for any LED you look at directly', '10 to 12 bits and a gamma curve for fades and dimmers', 'A MOSFET after the pin when the LEDs draw more than a few milliamps (strips, power LEDs)'],
    avoid: ['Software PWM in a loop: it flickers whenever the program is busy', 'A frequency below 500 Hz where cameras or moving eyes are involved', 'Dimming by a series resistor or a trimmer: wasteful and the colour shifts'],
    check: ['That the frequency and the number of bits fit together on your chip', 'How the dimmed LED looks on a phone camera, which is stricter than the eye', 'That the pin or the transistor can carry the LED current']
  },
  code: [
    {
      title: 'Steps of brightness from a button',
      about: 'Each press moves to the next of five brightness levels (off, 10 %, 25 %, 50 %, full). The levels are written as the brightness the eye should see, and a gamma curve turns them into duty values. Ten bits give the dark levels enough steps.',
      needs: 'An ESP32 DevKit, an LED with a 330 Ω resistor and a push button.',
      wiring: [['GPIO4', '330 Ω → LED → GND'], ['GPIO27', 'button → GND', 'internal pull-up']],
      blocks: `
        when started
          set pin (27) as [input with pull-up v]
          set PWM on pin (4) frequency (5000) resolution (10)
          set [step v] to (0)
        forever
          if <(read pin (27)) = [LOW v]> then
            change [step v] by (1)
            if <(step) > (4)> then
              set [step v] to (0)
            end
            set PWM on pin (4) to (round (((item ((step) + (1)) of [levels v]) to the power (2.2)) * (1023)))
            wait (0.25) seconds    // crude debounce
          end
        end
      `,
      cpp: String.raw`
        const int LED_PIN = 4;
        const int BUTTON_PIN = 27;
        const int BITS = 10;                                      // 1024 steps: the dark levels need them
        const int LEVELS = 5;
        const float WANTED[LEVELS] = {0.0f, 0.1f, 0.25f, 0.5f, 1.0f};   // brightness as the eye should see it
        int step = 0;

        uint32_t dutyFor(float level) {                           // gamma 2.2
          return (uint32_t)(powf(level, 2.2f) * ((1 << BITS) - 1) + 0.5f);
        }

        void setup() {
          pinMode(BUTTON_PIN, INPUT_PULLUP);
          ledcAttach(LED_PIN, 5000, BITS);
          ledcWrite(LED_PIN, dutyFor(WANTED[step]));
        }

        void loop() {
          if (digitalRead(BUTTON_PIN) == LOW) {                   // pressed
            step = (step + 1) % LEVELS;
            ledcWrite(LED_PIN, dutyFor(WANTED[step]));
            delay(250);                                           // crude debounce
            while (digitalRead(BUTTON_PIN) == LOW) delay(10);     // wait for release
          }
        }
      `,
      py: String.raw`
        from machine import Pin, PWM
        import time

        LED_PIN = 4
        BUTTON_PIN = 27
        WANTED = (0.0, 0.1, 0.25, 0.5, 1.0)        # brightness as the eye should see it
        step = 0

        button = Pin(BUTTON_PIN, Pin.IN, Pin.PULL_UP)
        pwm = PWM(Pin(LED_PIN), freq=5000, duty_u16=0)

        def duty_for(level):                        # gamma 2.2, scaled to 0 … 65535
            return int(level ** 2.2 * 65535 + 0.5)

        pwm.duty_u16(duty_for(WANTED[step]))
        while True:
            if button.value() == 0:                 # pressed
                step = (step + 1) % len(WANTED)
                pwm.duty_u16(duty_for(WANTED[step]))
                time.sleep_ms(250)                  # crude debounce
                while button.value() == 0:          # wait for release
                    time.sleep_ms(10)
      `,
      notes: ['The duty values of any level, bit count and frequency can be tried in [the PWM calculator](#/tools/espcalc/pwm).', 'A proper debounce is on [[debouncing]]; this one only keeps a long press from running through all the levels.', 'MicroPython scales duty_u16 to the resolution the chip can give at that frequency, so the dark levels are as fine as the hardware allows.']
    },
    {
      title: 'A hardware fade while the loop does other work',
      about: 'The LED fades up in 1.5 seconds and down again, forever. In C++ the LEDC does the fade by itself, so the loop stays free (here it prints the time). MicroPython has no hardware fade, so the loop computes the duty from the clock instead.',
      needs: 'The same LED and resistor.',
      wiring: [['GPIO4', '330 Ω → LED → GND']],
      blocks: `
        when started
          set PWM on pin (4) frequency (5000) resolution (10)
          set [up v] to <true>

        every (1.6) seconds
          if <up> then
            fade PWM on pin (4) from (0) to (1023) over (1.5) seconds :: light
          else
            fade PWM on pin (4) from (1023) to (0) over (1.5) seconds :: light
          end
          set [up v] to <not <up>>
      `,
      cpp: String.raw`
        const int LED_PIN = 4;
        const int BITS = 10;
        const int MAX_DUTY = (1 << BITS) - 1;
        const uint32_t FADE_MS = 1500;
        const uint32_t CYCLE_MS = FADE_MS + 100;
        bool up = true;
        uint32_t lastStart = 0;

        void setup() {
          Serial.begin(115200);
          ledcAttach(LED_PIN, 5000, BITS);
          ledcFade(LED_PIN, 0, MAX_DUTY, FADE_MS);       // the hardware starts the fade and returns at once
        }

        void loop() {
          if (millis() - lastStart >= CYCLE_MS) {        // the fade is over: go the other way
            lastStart += CYCLE_MS;
            up = !up;
            ledcFade(LED_PIN, up ? 0 : MAX_DUTY, up ? MAX_DUTY : 0, FADE_MS);
          }
          Serial.println(millis());                      // the loop is free for other work
          delay(200);
        }
      `,
      py: String.raw`
        from machine import Pin, PWM
        import time

        LED_PIN = 4
        FADE_MS = 1500
        CYCLE_MS = FADE_MS + 100

        pwm = PWM(Pin(LED_PIN), freq=5000, duty_u16=0)
        up = True
        start = time.ticks_ms()

        while True:
            elapsed = time.ticks_diff(time.ticks_ms(), start)
            if elapsed >= CYCLE_MS:                      # the fade is over: go the other way
                start = time.ticks_add(start, CYCLE_MS)
                up = not up
                elapsed = 0
            frac = min(elapsed / FADE_MS, 1.0)
            pwm.duty_u16(int((frac if up else 1.0 - frac) * 65535))
            time.sleep_ms(10)                            # no hardware fade here: the loop does the work
      `,
      notes: ['The hardware fade is linear in duty, so it has the uneven look described on the page; the core also has a gamma variant, ledcFadeGamma(), and a table that can be changed.', 'Only one fade can run on a pin at a time; starting a new one replaces the old.']
    }
  ],
  formulas: [
    {
      name: 'Duty for a brightness that looks even',
      expr: 'D = (2^bits - 1) * L^gam',
      tex: 'D = \\left(2^{n} - 1\\right) L^{\\gamma}',
      vars: {
        D: { name: 'duty value', q: 'count', tex: 'D' },
        bits: { name: 'duty resolution', q: 'count', value: 10, min: 1, max: 16, int: true, tex: 'n' },
        L: { name: 'brightness the eye should see', q: 'ratio', unit: '', value: 0.5, min: 0, max: 1, tex: 'L' },
        gam: { name: 'gamma', q: 'none', value: 2.2, min: 1, max: 3, tex: '\\gamma' }
      },
      solveFor: 'D',
      note: 'Light is proportional to duty; the eye sees about the 2.2th root of the light. Round D to a whole number.',
      stories: { D: 'You want an LED to look {L} as bright as at full power, with {bits} duty bits and gamma {gam}. What duty value do you write?' }
    },
    {
      name: 'The first step above off',
      expr: 'L1 = (1/(2^bits - 1))^(1/gam)',
      tex: 'L_1 = \\left(\\frac{1}{2^{n} - 1}\\right)^{1/\\gamma}',
      vars: {
        L1: { name: 'brightness of duty value 1, as seen', q: 'ratio', unit: '%', tex: 'L_1' },
        bits: { name: 'duty resolution', q: 'count', value: 8, min: 1, max: 16, int: true, tex: 'n' },
        gam: { name: 'gamma', q: 'none', value: 2.2, min: 1, max: 3, tex: '\\gamma' }
      },
      solveFor: 'L1',
      note: 'How bright the dimmest non-zero level looks. Above a few per cent the eye sees a click when the LED comes on; more bits make it smaller.',
      stories: { L1: 'A gamma-corrected PWM has {bits} bits. How bright, as the eye sees it, is the smallest duty step above zero?' }
    }
  ],
  examples: [
    {
      title: 'The first step above off',
      q: 'A fade from black uses 8-bit PWM and gamma 2.2. How bright does the first lit step look? What does it become with 12 bits?',
      steps: [{ text: 'At 8 bits the smallest duty is 1 out of 255:', tex: 'L_1 = (1/255)^{1/2.2} \\approx 0.080' }, 'That is 8 % of full brightness: a visible jump from nothing.', { text: 'At 12 bits it is 1 out of 4095:', tex: 'L_1 = (1/4095)^{1/2.2} \\approx 0.023' }],
      a: 'About 8 % at 8 bits, about 2.3 % at 12 bits. For a fade that starts from darkness smoothly, use 10 to 12 bits (and mind the frequency limit).'
    }
  ],
  quiz: [
    { q: 'A fade in equal duty steps from 0 to full looks quick at the start and slow at the end. Why?', choices: ['The eye responds to the light roughly as a power below one, so the dark end of the range looks like a large change', 'The LEDC has a bug at low duty', 'The LED current is not proportional to duty', 'The frequency is too low'], a: 0, why: 'The light really is linear in duty. It is the eye that compresses: a small change in a dark level looks bigger than the same change near full brightness. A gamma curve compensates.' },
    { q: 'Which PWM frequency is a good default for one indicator LED?', choices: ['50 Hz', '200 Hz', '5 kHz', '80 MHz'], a: 2, why: '50 and 200 Hz can show flicker or camera bands. 5 kHz is steady and still leaves 13 bits of resolution; 80 MHz is the clock itself and would leave no duty resolution at all.' },
    { q: 'You want an LED to look half as bright as at full power, using 10-bit PWM and gamma 2.2. Which duty value is closest?', choices: ['512', '128', '1023', '223'], a: 3, why: '0.5 to the power 2.2 is 0.218, and 0.218 × 1023 ≈ 223. Writing 512 gives half the light, which looks much brighter than half.' },
    { q: 'On an ESP32-S3 the program calls ledcAttach(pin, 5000, 16). What happens?', choices: ['It works and gives 65 536 steps', 'It works but the frequency drops to 1 kHz', 'It fails: at 5 kHz the clock allows at most 13 bits (and the S3 timer is 14 bits wide)', 'It works only on GPIO0'], a: 2, why: 'The duty resolution is limited by the clock divided by the frequency: 80 MHz / 5 kHz = 16 000, so 13 bits at most on every chip. The call returns false and the LED stays dark.' }
  ],
  applications: [
    'Status lights and night lights that fade softly instead of snapping on.',
    'Dimmable lamps and backlights, where the dark end is what people notice.',
    'Breathing indicators for a device that is asleep but alive.',
    'Brightness control of a display backlight from a photoresistor or a button.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, LED Control (LEDC): timers, channels, resolution and hardware fade.',
    'Arduino core for ESP32 documentation, *LEDC* API: ledcAttach, ledcWrite, ledcFade (core 3.3).',
    'IEEE Std 1789-2015, *Recommended Practices for Modulating Current in High-Brightness LEDs for Mitigating Health Risks to Viewers*.'
  ],
  sim: 'oa-pwm-dimming'
},

/* ================================================================ rgb-leds */
{
  id: 'rgb-leds',
  parent: 'outputs-and-actuators',
  title: 'RGB LEDs and colour mixing',
  level: 1,
  short: 'Three LEDs in one package, each dimmed by its own PWM channel, mix to any colour. One resistor per colour, gamma on every channel, and the surprise that the RGB LED on your DevKit is a different part.',
  keywords: ['RGB LED', 'colour mixing', 'common cathode', 'common anode', 'HSV', 'hue', 'RGB_BUILTIN', 'rgbLedWrite', 'neopixelWrite', 'white balance', 'three channels', 'colour wheel'],
  prereq: ['driving-leds-with-pwm', 'leds', 'transistor-as-a-switch'],
  related: ['addressable-leds', 'indicator-leds-and-bar-graphs', 'mosfets-for-loads', 'first-program-blink', 'wled', 'physics:color-mixing'],
  body: `An RGB LED is a red, a green and a blue LED in one clear package. Light from the three adds up in the eye: red and green make yellow, all three make white, and by dimming each one with its own PWM channel any colour in between is possible. Three pins, three resistors, three \`ledcWrite\` calls.

### Common cathode or common anode

The package has four legs: one for each colour and one shared. On a **common-cathode** part the shared leg goes to ground and a high pin lights its colour. On a **common-anode** part it goes to the supply and a *low* pin lights it, so the duty is inverted: 255 means off. Software can invert the number, and the LEDC can invert the output (\`ledcOutputInvert\`, or \`invert=1\` in MicroPython). If the colours come out as their opposites, you have the other kind.

### One resistor per colour

The colours need different voltages. Typical forward voltages at 10 to 20 mA are about 2.0 V for red and about 3.0 to 3.2 V for green and blue. From a 3.3 V pin that leaves 1.3 V across the red resistor but only 0.1 to 0.3 V for the others, so their current depends wildly on the exact LED. Red needs about 130 Ω for 10 mA; blue from the same pin needs only about 20 Ω, and its current still swings widely. The practical cure is to power the LED from 5 V and switch each colour with a small transistor ([[transistor-as-a-switch|a transistor as a switch]]): then blue gets (5 − 3.1) / 0.01 = 190 Ω, comfortably in the middle. Never drive more than a few milliamps through a pin: see [[pin-current-limits]].

### Mixing colours

A colour is three duty values. Two habits make it look right:

- **Gamma on each channel.** Without it, dim colours come out pale and washed, because a mid value gives far more light than it looks like it should. The simulation shows the same colour with and without.
- **Trim for white.** The three LEDs are not equally efficient: equal duties give a bluish or greenish white. Multiply each channel by a factor, found by eye, to make white white.

For rainbows and fades do not think in red, green and blue. Think in **hue**: turn a number from 0 to 359 around the colour wheel and convert it, as the first program does.

### The RGB LED on your DevKit is a different part

The S3, C3 and C6 DevKits carry an RGB LED on a single pin (GPIO48 and GPIO8 on common versions). It is an *addressable* LED with its own tiny controller, driven by a timed data signal, not three PWMs: see [[addressable-leds]]. The Arduino core's \`rgbLedWrite(pin, r, g, b)\` hides that, and MicroPython uses \`neopixel\`.

> [!key] An RGB LED is three LEDs with three PWM channels, three resistors, and gamma on every channel. Check whether the shared leg is the cathode or the anode, and remember that blue and green need more than a 3.3 V pin leaves for a resistor.`,
  ideas: [
    'Red, green and blue light add in the eye; three PWM duty values make any colour.',
    'A common-anode LED is inverted: a low pin means on, so 255 means off.',
    'Red, green and blue need different forward voltages, so each colour needs its own resistor, and green and blue are marginal from 3.3 V.',
    'Gamma per channel and a white-balance trim make colours and white look right; think in hue for fades.'
  ],
  pitfalls: [
    'One resistor on the shared leg is enough — It sets one current for the whole LED, so the colours change with the mix, and the LED with the lowest forward voltage takes it all. Use one per colour.',
    'Equal values of R, G and B give white — They give a tinted white, because the three LEDs differ in efficiency. Trim each channel until white looks white.',
    'The RGB LED on my S3 board is three PWM channels — It is one addressable LED on one pin. Use rgbLedWrite or the neopixel module, not ledcWrite.'
  ],
  terms: [
    { term: 'Common cathode', also: ['CC'], def: 'An RGB LED whose three cathodes are joined in one leg. That leg goes to ground, and a high level on a colour\'s pin lights it.' },
    { term: 'Common anode', also: ['CA'], def: 'An RGB LED whose three anodes are joined in one leg. That leg goes to the supply, and a low level on a colour\'s pin lights it, so the PWM duty is inverted.' },
    { term: 'Hue', also: ['colour wheel', 'HSV'], def: 'The position of a colour around the colour wheel, as an angle from 0° (red) through 120° (green) and 240° (blue) back to red. HSV adds saturation and value, the paleness and the brightness.' },
    { term: 'White balance', also: ['channel trim'], def: 'Scaling the three channels so that equal commands produce white light rather than a tint, to make up for the different efficiency of the red, green and blue LEDs.' }
  ],
  choose: {
    good: ['A separate-pin RGB LED (common cathode) for a single coloured indicator', 'An addressable LED when you need many, or when the board already has one', 'A transistor per channel from 5 V when the LED is bright or the colours matter'],
    avoid: ['Driving a high-power RGB LED straight from the pins', 'One shared resistor for all three colours', 'Common-anode parts driven by outputs that idle high when you meant off'],
    check: ['Whether the shared leg is the cathode or the anode, with the multimeter\'s diode test', 'The forward voltage of each colour in the datasheet', 'That each colour has its own PWM channel on your chip (6 to 16)']
  },
  code: [
    {
      title: 'Walk round the colour wheel',
      about: 'A common-cathode RGB LED goes through all the hues, with gamma on every channel. The hue is turned into three values from 0 to 255, then into duty values.',
      needs: 'An ESP32 DevKit and a common-cathode RGB LED with a 330 Ω resistor in each colour leg.',
      wiring: [['GPIO25', '330 Ω → red leg'], ['GPIO26', '330 Ω → green leg'], ['GPIO27', '330 Ω → blue leg'], ['common leg', 'GND']],
      blocks: `
        define show colour (r) (g) (b)
          set PWM on pin (25) to (round (((r) / (255)) to the power (2.2)) * (1023))
          set PWM on pin (26) to (round (((g) / (255)) to the power (2.2)) * (1023))
          set PWM on pin (27) to (round (((b) / (255)) to the power (2.2)) * (1023))

        when started
          set PWM on pin (25) frequency (5000) resolution (10)
          set PWM on pin (26) frequency (5000) resolution (10)
          set PWM on pin (27) frequency (5000) resolution (10)
        forever
          repeat for each [hue v] in (list 0 to 359)
            show colour (red of hue (hue)) (green of hue (hue)) (blue of hue (hue)) :: my
            wait (0.02) seconds
          end
        end
      `,
      cpp: String.raw`
        const int PIN_R = 25, PIN_G = 26, PIN_B = 27;
        const int BITS = 10;

        uint32_t dutyFor(uint8_t v) {                      // gamma 2.2
          return (uint32_t)(powf(v / 255.0f, 2.2f) * ((1 << BITS) - 1) + 0.5f);
        }

        void showColour(uint8_t r, uint8_t g, uint8_t b) {
          ledcWrite(PIN_R, dutyFor(r));
          ledcWrite(PIN_G, dutyFor(g));
          ledcWrite(PIN_B, dutyFor(b));
        }

        void hueToRgb(int hue, uint8_t &r, uint8_t &g, uint8_t &b) {   // hue 0 … 359
          int region = hue / 60, rem = hue % 60;
          uint8_t up = rem * 255 / 60, down = 255 - up;
          switch (region) {
            case 0:  r = 255;  g = up;   b = 0;    break;
            case 1:  r = down; g = 255;  b = 0;    break;
            case 2:  r = 0;    g = 255;  b = up;   break;
            case 3:  r = 0;    g = down; b = 255;  break;
            case 4:  r = up;   g = 0;    b = 255;  break;
            default: r = 255;  g = 0;    b = down; break;
          }
        }

        void setup() {
          ledcAttach(PIN_R, 5000, BITS);
          ledcAttach(PIN_G, 5000, BITS);
          ledcAttach(PIN_B, 5000, BITS);
        }

        void loop() {
          for (int hue = 0; hue < 360; hue++) {
            uint8_t r, g, b;
            hueToRgb(hue, r, g, b);
            showColour(r, g, b);
            delay(20);
          }
        }
      `,
      py: String.raw`
        from machine import Pin, PWM
        import time

        PIN_R, PIN_G, PIN_B = 25, 26, 27
        pwm_r = PWM(Pin(PIN_R), freq=5000, duty_u16=0)
        pwm_g = PWM(Pin(PIN_G), freq=5000, duty_u16=0)
        pwm_b = PWM(Pin(PIN_B), freq=5000, duty_u16=0)

        def duty_for(v):                                   # gamma 2.2, scaled to 0 … 65535
            return int((v / 255) ** 2.2 * 65535 + 0.5)

        def show_colour(r, g, b):
            pwm_r.duty_u16(duty_for(r))
            pwm_g.duty_u16(duty_for(g))
            pwm_b.duty_u16(duty_for(b))

        def hue_to_rgb(hue):                               # hue 0 … 359
            region, rem = divmod(hue, 60)
            up = rem * 255 // 60
            down = 255 - up
            return ((255, up, 0), (down, 255, 0), (0, 255, up), (0, down, 255), (up, 0, 255), (255, 0, down))[region]

        while True:
            for hue in range(360):
                show_colour(*hue_to_rgb(hue))
                time.sleep_ms(20)
      `,
      notes: ['The resistor for each colour can be worked out in [the LED calculator](#/tools/espcalc/leds).', 'For a common-anode LED connect the shared leg to 3.3 V and write 255 − v for each channel, or invert the output with ledcOutputInvert(pin, true) in C++ and PWM(..., invert=1) in MicroPython.', 'In blocks, "red of hue" and the other two stand for the conversion shown in the other two languages.']
    },
    {
      title: 'The DevKit\'s own RGB LED',
      about: 'Red, green, blue and off, half a second each, on the addressable RGB LED that S3, C3 and C6 DevKits carry. It uses one data pin, not three PWM channels.',
      needs: 'An ESP32-S3, C3 or C6 DevKit with an RGB LED (GPIO48 on many S3 boards, GPIO8 on many C3 and C6 boards: check your board\'s page).',
      wiring: [['GPIO48', 'the on-board RGB LED', 'GPIO8 on many C3 and C6 boards']],
      blocks: `
        when started
          start NeoPixel strip on pin (48) with (1) pixels :: light
        forever
          set pixel (0) to colour (64) (0) (0)
          show pixels
          wait (0.5) seconds
          set pixel (0) to colour (0) (64) (0)
          show pixels
          wait (0.5) seconds
          set pixel (0) to colour (0) (0) (64)
          show pixels
          wait (0.5) seconds
          set pixel (0) to colour (0) (0) (0)
          show pixels
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        void setup() {}

        void loop() {
        #ifdef RGB_BUILTIN                                 // defined on the S2, S3, C3 and C6 DevKit variants
          rgbLedWrite(RGB_BUILTIN, 64, 0, 0);              // red   (0 … 255 per colour)
          delay(500);
          rgbLedWrite(RGB_BUILTIN, 0, 64, 0);              // green
          delay(500);
          rgbLedWrite(RGB_BUILTIN, 0, 0, 64);              // blue
          delay(500);
          rgbLedWrite(RGB_BUILTIN, 0, 0, 0);               // off
          delay(500);
        #endif
        }
      `,
      py: String.raw`
        from machine import Pin
        from neopixel import NeoPixel
        import time

        np = NeoPixel(Pin(48), 1)          # one pixel; GPIO48 on many S3 boards, GPIO8 on many C3 and C6 boards

        while True:
            for colour in ((64, 0, 0), (0, 64, 0), (0, 0, 64), (0, 0, 0)):
                np[0] = colour             # (R, G, B)
                np.write()                 # nothing is sent until write()
                time.sleep_ms(500)
      `,
      notes: ['Older tutorials call neopixelWrite(); it still compiles on core 3.3 but is deprecated: use rgbLedWrite().', 'After rgbLedWrite() that pin cannot be used as a plain GPIO any more.', 'The brightness of 64 out of 255 is deliberate: these LEDs are painfully bright at full value.']
    }
  ],
  formulas: [
    {
      name: 'Series resistor for one colour',
      expr: 'R = (Vs - Vf)/I',
      tex: 'R = \\frac{V_s - V_f}{I}',
      vars: {
        R: { name: 'series resistor', q: 'resistance', unit: 'Ω', tex: 'R' },
        Vs: { name: 'supply (or pin) voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_s' },
        Vf: { name: 'forward voltage of the colour', q: 'voltage', unit: 'V', value: 3.1, tex: 'V_f' },
        I: { name: 'current through the colour', q: 'current', unit: 'mA', value: 10, tex: 'I' }
      },
      solveFor: 'R',
      note: 'One resistor per colour, each with its own Vf: about 2.0 V for red, 3.0 to 3.2 V for green and blue (typical; read your part\'s datasheet). From 3.3 V the green and blue values come out near 20 Ω, and the current is not reliable.',
      stories: { R: 'A blue LED ({Vf}) is switched from a {Vs} supply at {I}. What resistor does it need?', I: 'A {Vf} LED sits behind {R} on a {Vs} supply. What current flows?' }
    }
  ],
  examples: [
    {
      title: 'Resistors for a common-cathode LED on 3.3 V pins',
      q: 'An RGB LED has Vf of 2.0 V (red), 3.1 V (green) and 3.1 V (blue). It is driven from 3.3 V pins at about 5 mA per colour. What resistor does each colour need, and is the result trustworthy?',
      steps: [{ text: 'Red:', tex: 'R = (3.3 - 2.0)/0.005 = 260\\,\\Omega' }, { text: 'Green and blue:', tex: 'R = (3.3 - 3.1)/0.005 = 40\\,\\Omega' }, 'If the real Vf of a blue LED is 3.2 V, the current falls to 2.5 mA; at 3.0 V it rises to 7.5 mA. Two LEDs of one batch can differ that much.'],
      a: 'About 270 Ω for red and 39 Ω for green and blue, but the green and blue currents can vary by a factor of three between LEDs. A 5 V supply with a transistor per colour is more predictable.'
    }
  ],
  quiz: [
    { q: 'You wire a common-anode RGB LED to 3.3 V and write ledcWrite(pin, 0) for the red channel. What does the red LED do?', choices: ['Lights at full brightness', 'Stays off', 'Lights at half brightness', 'Nothing: the pin is disabled'], a: 0, why: 'On a common-anode part a low pin completes the circuit from the supply, so duty 0 (always low) is full on. Write 255 − value or invert the output.' },
    { q: 'Why does one resistor on the shared leg of an RGB LED give poor colours?', choices: ['It cannot carry the current', 'It removes the PWM', 'It makes the LED common anode', 'It sets one current for the whole LED, so the colours change with the mix and the lowest-voltage colour dominates'], a: 3, why: 'With one resistor the current is shared between the three LEDs in a way that depends on their forward voltages and on which are lit. Each colour needs its own resistor to get a defined current.' },
    { q: 'The colour (128, 128, 128) is written as straight duty values, without gamma. How does the LED look?', choices: ['A dark grey, as the numbers suggest', 'A much brighter and paler grey than 50 % should be', 'Black', 'The same as with gamma'], a: 1, why: 'Half the duty is half the light, which the eye rates as about three quarters of full brightness. Colours come out paler and lighter than intended; gamma correction fixes it.' },
    { q: 'The ESP32-S3-DevKitC-1 has an RGB LED. Which call lights it?', choices: ['Three ledcWrite calls on three pins', 'dacWrite', 'rgbLedWrite(RGB_BUILTIN, r, g, b), or neopixel in MicroPython', 'digitalWrite on three pins'], a: 2, why: 'The LED is an addressable one on a single pin, driven by a timed data signal. The Arduino core wraps it in rgbLedWrite; MicroPython uses the neopixel module.' }
  ],
  applications: [
    'Mood lighting and status lamps whose colour shows a state: green ready, amber busy, red fault.',
    'A thermometer lamp that shifts from blue to red with the temperature.',
    'Colour indication on a device whose board has no display.',
    'Testing the colour sensor of a project against a known mix of light.'
  ],
  sources: [
    'Arduino core for ESP32 documentation, *LEDC* API and the BlinkRGB example (core 3.3).',
    'MicroPython documentation, *Quick reference for the ESP32*: PWM and the neopixel module (version 1.29).',
    'Espressif, user guides of the ESP32-S3-DevKitC-1 and ESP32-C6-DevKitC-1 boards (the on-board RGB LED).'
  ],
  sim: 'oa-rgb-mixing'
},

/* ================================================================ addressable-leds */
{
  id: 'addressable-leds',
  parent: 'outputs-and-actuators',
  title: 'Addressable LEDs: WS2812 and its family',
  level: 2,
  short: 'A pixel is an LED with its own controller. Chain hundreds, drive them all from one pin with a timed stream of bits — and mind the logic level, the 60 mA a pixel can take, and the order of the colours.',
  keywords: ['WS2812', 'WS2812B', 'NeoPixel', 'SK6812', 'RGBW', 'APA102', 'SK9822', 'WS2811', 'WS2813', 'WS2815', 'addressable LED', 'LED strip', 'FastLED', 'Adafruit_NeoPixel', 'led_strip', 'data line', 'level shifter', 'GRB'],
  prereq: ['rgb-leds', 'three-volt-logic', 'driving-leds-with-pwm'],
  related: ['powering-led-strips', 'level-shifters', 'the-rmt-peripheral', 'wled', 'led-matrices', 'hub75-panels', 'dmx-and-midi'],
  body: `An addressable LED is an LED with a small controller built in. Pixels are chained: the first listens on a single data wire, keeps the first 24 bits for itself and passes everything after them to the next. Hundreds of pixels, three wires and one pin of the ESP32: that is the whole trick, and why a strip costs so little to connect and so much to power.

### What travels on the wire

Each pixel gets 24 bits: eight each for green, red and blue, in that order on the common WS2812-type parts, most significant bit first. A bit lasts 1.25 µs (800 kHz): a short high pulse (about 0.4 µs) is a 0, a long one (about 0.8 µs) is a 1. After the last pixel the line rests low for 50 µs or more (280 µs on some newer parts) and every pixel latches the colour it saw. One frame costs about 30 µs per pixel plus that pause:

| Pixels | One frame | Fastest refresh |
|---|---|---|
| 60 | 1.9 ms | about 530 a second |
| 300 | 9 ms | about 110 a second |
| 1000 | 30 ms | about 33 a second |

The tolerance is a few hundred nanoseconds, so a peripheral or carefully timed code drives this wire, never \`digitalWrite\` in a loop.

### The family

| Part | What is different |
|---|---|
| WS2812B | the common one: 5 V, 800 kHz, one wire, 24 bits per pixel |
| SK6812 | like it, with a white LED in the RGBW version (32 bits) |
| WS2811 | 12 V strips: one chip for three LEDs |
| WS2813, WS2815 | a backup data line against a dead pixel; the WS2815 runs on 12 V |
| APA102, SK9822 | two wires (data, clock), no timing demands, a much faster PWM |

### The 3.3 V problem

A WS2812B on 5 V reads a high only above 0.7 × 5 V = 3.5 V, and an ESP32 pin gives 3.3 V. It often works, until a warm day or a longer wire makes the first pixel flicker. Two cures: a level shifter fed with 5 V ([[level-shifters]]; a 74AHCT125 accepts 3.3 V as a high and answers with 5 V), or a sacrificial first pixel powered through a diode, so that its supply is about 4.3 V and its threshold 3.0 V, and which passes a clean 4.3 V on. Add 300 to 500 Ω in the data wire next to the first pixel to damp reflections.

### Talking to them

Adafruit NeoPixel, FastLED, Espressif's \`led_strip\` component and MicroPython's \`neopixel\` hide the timing. The library keeps the colours in a buffer, and nothing changes until \`show()\` or \`write()\`. Where a library switches interrupts off while it sends, Wi-Fi activity can corrupt a long strip's stream; drivers that use the RMT peripheral ([[the-rmt-peripheral]]) or the I2S and SPI engines do not. \`setBrightness\` multiplies every value before sending, so at brightness 20 of 255 each channel has only 21 levels left and dim colours look coarse. A pixel at full white takes about 60 mA: read [[powering-led-strips]] before you plug in a metre.

> [!key] A pixel takes 24 bits from a single timed wire at 800 kHz and passes the rest on. Give the data line a clean 5 V level, keep the colour order right (usually GRB), and remember that the strip, not the ESP32, is where the current goes.`,
  ideas: [
    'Each pixel keeps 24 bits of the stream and passes the rest on; a pause of 50 µs or more latches the colours.',
    'A frame takes about 30 µs per pixel, so 300 pixels refresh at most about 110 times a second.',
    'A WS2812B on 5 V wants 3.5 V for a high: a 3.3 V pin is marginal, so shift the level or feed the first pixel from a diode.',
    'WS2812B has one wire and strict timing; APA102 has two wires, no timing, and a faster PWM; SK6812 RGBW adds a white LED.'
  ],
  pitfalls: [
    'A strip is just three PWM channels — Its pixels are controlled by a timed bit stream, one wire for all of them. The LEDC cannot make it; a peripheral or timed code can.',
    'It works on my desk, so the 3.3 V data line is fine — The margin is thin and temperature, wire length and batch change it. A level shifter turns a lucky strip into a reliable one.',
    'The colours are wrong, so the pins are swapped — The order of the bytes differs between parts: GRB for most WS2812s, RGB for others, and RGBW parts have a fourth byte. Set the order in the library.'
  ],
  terms: [
    { term: 'Addressable LED', also: ['smart LED', 'pixel', 'digital LED'], def: 'An LED package with a small controller inside, so that each one takes its colour from a data stream and passes the rest on. Pixels are chained, and one pin controls them all.' },
    { term: 'WS2812', also: ['WS2812B', 'NeoPixel'], def: 'The most common addressable RGB LED: 5 V, one data wire at 800 kHz, 24 bits per pixel in the order green, red, blue. NeoPixel is Adafruit\'s name for the family.' },
    { term: 'Reset pause', also: ['latch gap', 'reset gap', 'reset code'], def: 'The pause of 50 µs or more (280 µs on some newer parts) at the end of a frame, after which every pixel shows the colour it received.' },
    { term: 'RGBW', also: ['SK6812 RGBW'], def: 'An addressable LED with a fourth, white emitter beside red, green and blue. It sends 32 bits per pixel, and a pure white from the white chip is more efficient and nicer than the mix of three.' },
    { term: 'APA102', also: ['SK9822', 'DotStar'], def: 'An addressable RGB LED with separate data and clock wires, so the timing is not critical, a 5-bit brightness field and a PWM of several kilohertz. The SK9822 is a compatible part that treats the brightness field a little differently.' }
  ],
  choose: {
    good: ['WS2812B or SK6812 strips for lamps, signs and effects: cheap, one wire, well supported', 'APA102 or SK9822 where cameras are involved, or the timing is hard (long Wi-Fi activity)', 'RGBW parts when you want a good white as well as colour'],
    avoid: ['A 3.3 V data line straight into a 5 V strip when it must work every time', 'Long chains of 800 kHz parts where you need more than about 60 frames a second (1000 pixels is 33)', 'Driving the wire with digitalWrite in a loop'],
    check: ['The byte order (GRB, RGB, RGBW) of your parts', 'The supply voltage of the strip: 5 V and 12 V strips look alike', 'How many pixels you really need, and what they do to your power budget']
  },
  code: [
    {
      title: 'A red pixel running along a strip',
      about: 'One red pixel moves along eight, ten times a second. The colours are kept in a buffer; nothing is sent until the show call.',
      needs: 'An ESP32 DevKit and a strip or ring of eight WS2812B pixels, powered from 5 V with its ground joined to the ESP32\'s. A 300 to 500 Ω resistor sits in the data wire.',
      libs: ['Adafruit NeoPixel'],
      wiring: [['GPIO13', '330 Ω → DIN of the first pixel', 'level shifter recommended'], ['5 V', 'strip +5 V', 'from a supply, not from a GPIO'], ['GND', 'strip GND and the ESP32 GND']],
      blocks: `
        when started
          start NeoPixel strip on pin (13) with (8) pixels :: light
          set strip brightness (40) :: light
          set [position v] to (0)
        forever
          clear pixels
          set pixel (position) to colour (255) (0) (0)
          show pixels
          change [position v] by (1)
          if <(position) = (8)> then
            set [position v] to (0)
          end
          wait (0.1) seconds
        end
      `,
      cpp: String.raw`
        #include <Adafruit_NeoPixel.h>

        const int LED_PIN = 13;
        const int LED_COUNT = 8;
        Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);   // GRB order, 800 kHz

        int position = 0;

        void setup() {
          strip.begin();
          strip.setBrightness(40);                          // 0 … 255: keeps the current low
        }

        void loop() {
          strip.clear();                                    // all dark, in the buffer
          strip.setPixelColor(position, strip.Color(255, 0, 0));
          strip.show();                                     // now send the buffer to the strip
          position = (position + 1) % LED_COUNT;
          delay(100);
        }
      `,
      py: String.raw`
        from machine import Pin
        from neopixel import NeoPixel
        import time

        LED_PIN = 13
        LED_COUNT = 8
        np = NeoPixel(Pin(LED_PIN), LED_COUNT)             # GRB order and 800 kHz are the defaults

        position = 0
        while True:
            np.fill((0, 0, 0))                             # all dark, in the buffer
            np[position] = (40, 0, 0)                      # dim red: scale the values yourself, there is no brightness setting
            np.write()                                     # now send the buffer to the strip
            position = (position + 1) % LED_COUNT
            time.sleep_ms(100)
      `,
      notes: ['The bits that carry any colour are drawn in [the signals lab](#/tools/signals/pixels).', 'An RGBW strip needs NEO_GRBW in C++ and NeoPixel(pin, n, bpp=4) in MicroPython.', 'The value 40 of 255 is a limit for the demonstration, as the strip takes about 60 mA a pixel at full white.']
    },
    {
      title: 'A rainbow with gamma and a brightness limit',
      about: 'Eight pixels show a rainbow that slowly turns, one trip round the colour wheel in 3.6 seconds. Gamma correction makes the colours look right, and the brightness is held low.',
      needs: 'The same strip.',
      libs: ['Adafruit NeoPixel'],
      wiring: [['GPIO13', '330 Ω → DIN of the first pixel'], ['5 V', 'strip +5 V'], ['GND', 'strip GND and the ESP32 GND']],
      blocks: `
        when started
          start NeoPixel strip on pin (13) with (8) pixels :: light
          set strip brightness (40) :: light
          set [first v] to (0)
        forever
          repeat for each [i v] in (list 0 to 7)
            set pixel (i) to hue ((first) + (((i) * (360)) / (8))) with gamma :: light
          end
          show pixels
          set [first v] to (((first) + (2)) mod (360))
          wait (0.02) seconds
        end
      `,
      cpp: String.raw`
        #include <Adafruit_NeoPixel.h>

        const int LED_PIN = 13;
        const int LED_COUNT = 8;
        Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

        uint16_t firstHue = 0;                              // 0 … 65535 goes once round the colour wheel

        void setup() {
          strip.begin();
          strip.setBrightness(40);
        }

        void loop() {
          for (int i = 0; i < LED_COUNT; i++) {
            uint16_t hue = firstHue + (uint32_t)i * 65536UL / LED_COUNT;
            strip.setPixelColor(i, strip.gamma32(strip.ColorHSV(hue)));   // gamma-corrected colour
          }
          strip.show();
          firstHue += 364;                                  // 65536 / 180: one round in 180 frames
          delay(20);
        }
      `,
      py: String.raw`
        from machine import Pin
        from neopixel import NeoPixel
        import time

        LED_PIN = 13
        LED_COUNT = 8
        BRIGHTNESS = 40                                     # 0 … 255, like setBrightness() in C++
        np = NeoPixel(Pin(LED_PIN), LED_COUNT)

        GAMMA = [int((i / 255) ** 2.6 * 255 + 0.5) for i in range(256)]   # gamma 2.6, a common choice for these LEDs

        def hue_to_rgb(hue):                                # hue 0 … 359
            region, rem = divmod(hue, 60)
            up = rem * 255 // 60
            down = 255 - up
            return ((255, up, 0), (down, 255, 0), (0, 255, up), (0, down, 255), (up, 0, 255), (255, 0, down))[region]

        first = 0
        while True:
            for i in range(LED_COUNT):
                r, g, b = hue_to_rgb((first + i * 360 // LED_COUNT) % 360)
                np[i] = tuple(GAMMA[c] * BRIGHTNESS // 255 for c in (r, g, b))
            np.write()
            first = (first + 2) % 360
            time.sleep_ms(20)
      `,
      notes: ['gamma32() is a library table (gamma about 2.6); the MicroPython version builds the same kind of table itself.', 'At brightness 40 of 255 each channel has only 41 levels: dim colours look coarse, as the page explains.']
    }
  ],
  formulas: [
    {
      name: 'Time to send one frame',
      expr: 't = n*bits*tb + tr',
      tex: 't = n \\cdot b \\cdot t_{\\mathrm{bit}} + t_{\\mathrm{reset}}',
      vars: {
        t: { name: 'frame time', q: 'time', unit: 'ms', tex: 't' },
        n: { name: 'number of pixels', q: 'count', value: 144, min: 1, int: true, tex: 'n' },
        bits: { name: 'bits per pixel', q: 'count', value: 24, min: 24, max: 32, int: true, tex: 'b' },
        tb: { name: 'time of one bit', q: 'time', unit: 'µs', value: 1.25, tex: 't_{\\mathrm{bit}}' },
        tr: { name: 'reset pause', q: 'time', unit: 'µs', value: 50, tex: 't_{\\mathrm{reset}}' }
      },
      solveFor: 't',
      note: 'For WS2812B the bit time is 1.25 µs and the pause at least 50 µs (280 µs on some newer parts). RGBW parts send 32 bits. The reciprocal of t is the fastest refresh rate.',
      stories: { t: 'A strip of {n} pixels sends {bits} bits each, {tb} per bit, followed by a {tr} pause. How long does one frame take?' }
    }
  ],
  examples: [
    {
      title: 'How fast can a ring of 144 pixels be refreshed?',
      q: 'A WS2812B display has 144 pixels. What is the shortest time per frame, and the highest refresh rate?',
      steps: [{ text: 'Bits per frame:', tex: '144 \\times 24 = 3456' }, { text: 'Time for the bits at 1.25 µs each, plus a 50 µs pause:', tex: 't = 3456 \\times 1.25\\,\\mu s + 50\\,\\mu s = 4.37\\,\\mathrm{ms}' }, { text: 'Refresh rate:', tex: '1/4.37\\,\\mathrm{ms} \\approx 229\\,\\mathrm{Hz}' }],
      a: 'About 4.4 ms per frame, so at most about 230 frames a second. A program that also computes the animation will be slower than that; the wire is rarely the limit below a few hundred pixels.'
    }
  ],
  quiz: [
    { q: 'Why does a WS2812B on a 5 V supply sometimes misbehave when driven straight from an ESP32 pin?', choices: ['It wants at least 0.7 × 5 V = 3.5 V for a high, and the pin gives 3.3 V', 'The pin cannot drive a wire', 'The strip needs a clock line', 'The pin is 5 V tolerant'], a: 0, why: 'The input threshold of the pixel is tied to its own supply. 3.3 V is below 3.5 V, so the strip works only with margin to spare. A level shifter or a diode-fed first pixel restores the margin.' },
    { q: 'How many bytes per pixel does an RGBW strip such as the SK6812 RGBW need?', choices: ['3', '4', '5', '6'], a: 1, why: 'Red, green, blue and white: 32 bits, four bytes. The library must be told (NEO_GRBW, or bpp=4).' },
    { q: 'About how many frames a second can a 300-pixel WS2812B strip show at most?', choices: ['about 30', 'about 110', 'about 1000', 'about 10 000'], a: 1, why: '300 pixels × 24 bits × 1.25 µs = 9 ms plus the pause, so about 110 frames a second.' },
    { q: 'A program sets pixel colours in a loop and nothing changes on the strip. What is missing?', choices: ['A resistor', 'A longer delay', 'A second data pin', 'A call to show() or write(), which sends the buffer'], a: 3, why: 'The library only edits its buffer when you set a colour. The stream goes to the strip when you call show() or write().' }
  ],
  applications: [
    'Light strips for furniture, signs, and animated lamps, including the WLED firmware.',
    'Status rings and bars: a row of pixels shows a level, a progress or a state at a glance.',
    'Small matrices and wearable displays built from rings and flexible panels.',
    'Light painting, and effect lighting for stage and photography.'
  ],
  sources: [
    'Worldsemi, *WS2812B datasheet* (timing, voltage and the input threshold); the SK6812 and APA102 datasheets for the relatives.',
    'Adafruit, *NeoPixel Überguide* and the Adafruit_NeoPixel library reference.',
    'Espressif, *led_strip* component documentation (RMT and SPI backends) in the ESP Component Registry.'
  ],
  sim: 'oa-pixel-strip'
},

/* ================================================================ powering-led-strips */
{
  id: 'powering-led-strips',
  parent: 'outputs-and-actuators',
  title: 'Powering LED strips',
  level: 2,
  short: 'Sixty milliamps a pixel adds up fast: 18 A for 300 pixels at white. How to size the supply, why the far end goes yellow, how power injection cures it, and the small parts that keep the first pixel alive.',
  keywords: ['LED strip power', 'power injection', 'voltage drop', 'brightness limit', 'WS2812B current', '60 mA', 'capacitor', 'fuse', 'common ground', 'brownout', 'supply sizing', '5 V strip', '12 V strip', 'hot plug'],
  prereq: ['addressable-leds', 'usb-power', 'current-peaks-and-capacitors'],
  related: ['brownout', 'regulators-ldo-and-buck', 'power-switching-and-load-sharing', 'protection-parts', 'thermal-design', 'wled'],
  body: `Power is what people learn last about addressable LEDs. Each pixel holds three LEDs that can take 20 mA each: **60 mA per pixel at full white**. Sixty pixels at white are 3.6 A, 18 W; 300 pixels are 18 A and 90 W. That is far beyond a USB port, a breadboard rail or the 3.3 V regulator on the DevKit.

### How much current

| Pixels | Full white at 5 V | A supply that suits |
|---|---|---|
| 8 | 0.5 A · 2.4 W | a USB port |
| 30 | 1.8 A · 9 W | a phone charger |
| 60 | 3.6 A · 18 W | 5 V, 4 A |
| 144 | 8.6 A · 43 W | 5 V, 10 A |
| 300 | 18 A · 90 W | 5 V, 20 A |

Real animations average a small fraction of full white, but a white flash is exactly when the supply must hold. Plan for the worst case the **software** can reach, and enforce it with a brightness limit (the program below). A computer's USB port promises only 500 mA: eight pixels at white, with nothing left for the ESP32.

### Why the far end goes yellow

The copper tracks on a strip are thin. Current enters at one end and flows through all of them, so the voltage falls along the strip and the last pixels see less than 5 V. Blue and green LEDs need about 3 V themselves, so they fade first: white becomes yellow, then orange, then red, and below about 3.5 V the pixel logic fails and the end of the strip flickers. With feed at one end the drop at the far end is about half of the total current times the loop resistance of the two rails; with feed at both ends it falls to an eighth. The simulation shows it along the strip.

### Power injection

Run thick, short supply wires from the power supply to the strip at several points — the far end, and every metre or two on dense strips — so that no part of the strip has to carry the current of the rest. Only **power** is injected: the data wire still runs from pixel to pixel in one chain. Join all grounds, including the ESP32's, or the data signal has no reference. Strips of 12 V or 24 V need far less current for the same light, which makes long runs easier.

### The small parts that matter

- **A capacitor of about 1000 µF** across the supply at the strip, rated for at least 6.3 V (10 V is common): the first pixels see a sudden step in current when the supply comes on or the colour jumps.
- **A 300 to 500 Ω resistor** in the data wire at the strip.
- **Ground first.** Connect ground before power and data, and do not plug a live 5 V supply into the strip connector: the spark can destroy the first pixel.
- **A fuse** for the wire, sized to the supply.
- **Separate or well-decoupled supplies** for ESP32 and strip: if the ESP32 resets whenever the strip goes white, the supply is sagging ([[brownout]]).

At full white nearly all the power becomes heat: mount a dense strip on an aluminium channel and limit the brightness.

> [!key] Count 60 mA a pixel, add a brightness cap in the program, feed power in at several places, and join the grounds. When the far end turns yellow or the ESP32 resets as the strip goes white, the supply is the problem, not the code.`,
  ideas: [
    'A pixel at full white takes about 60 mA at 5 V: 300 pixels are 18 A and 90 W.',
    'A brightness limit in the program protects the supply: the library or your own scaling keeps the worst case within the budget.',
    'Voltage falls along the strip, so the last pixels shift to yellow and red; power injection feeds the strip at several points.',
    'Join all grounds, put a capacitor at the strip, a resistor in the data wire, and connect ground first.'
  ],
  pitfalls: [
    'The data wire is thin, so a strip is a low-power thing — Only the data is thin. The supply wires carry the amps, and they must be thick and short.',
    'A 5 A supply is enough for 300 pixels because the animation is dim — Only if the program makes it so. A single full-white frame, or a boot colour, asks for 18 A. Limit the brightness in code.',
    'I can power the strip from the DevKit\'s 5 V pin — That pin passes on what the USB port gives, at most half an ampere from a computer, and the traces of the board are not made for amps. Power the strip separately.'
  ],
  terms: [
    { term: 'Power injection', also: ['injecting power', 'feed points'], def: 'Connecting the supply to a strip at several points, not only at its start, so that the voltage along the strip stays high. The data line is not injected; it still runs through the chain.' },
    { term: 'Voltage drop', also: ['IR drop', 'line drop'], def: 'The voltage lost along a conductor, equal to current times resistance. Along a strip it makes the pixels far from the feed run at a lower voltage than the first.' },
    { term: 'Brightness cap', also: ['current limit in firmware', 'power limit'], def: 'A ceiling on the brightness chosen so that the strip at full white cannot take more current than the supply can give.' },
    { term: 'Common ground', also: ['shared ground', 'ground reference'], def: 'The joined ground of the ESP32, the strip and the supply. Without it the data signal has no reference voltage and the strip misreads or ignores it.' }
  ],
  choose: {
    good: ['A dedicated 5 V supply sized for the cap you set, not for the animation average', '12 V or 24 V strips for runs longer than a couple of metres', 'Feeding both ends, and the middle of long runs, with thick wire'],
    avoid: ['Powering a strip from the ESP32 board or a laptop port beyond a few pixels', 'One thin wire into the start of a long strip', 'Plugging a live supply into the strip connector'],
    check: ['The colour of white at the far end at your highest brightness', 'That the ESP32 does not reset when everything goes white', 'The temperature of the strip, the wires and the supply after ten minutes at the cap']
  },
  code: [
    {
      title: 'Hold the strip to a current budget',
      about: 'The program works out how many milliamps the whole strip would take at full white, and sets the brightness so that this stays within the supply budget. Then it flashes white, the worst case, and prints what it did.',
      needs: 'An ESP32 DevKit, 60 WS2812B pixels and a 5 V supply of at least 2 A for the strip (with its ground joined to the ESP32).',
      libs: ['Adafruit NeoPixel'],
      wiring: [['GPIO13', '330 Ω → DIN of the first pixel'], ['5 V', 'strip +5 V from the supply, with a 1000 µF capacitor'], ['GND', 'supply, strip and ESP32 grounds joined']],
      blocks: `
        when started
          start serial at (115200) baud
          start NeoPixel strip on pin (13) with (60) pixels :: light
          set [cap v] to (round ((255) * ((2000) / ((60) * (60)))))
          if <(cap) > (255)> then
            set [cap v] to (255)
          end
          set strip brightness (cap) :: light
          print (join [brightness cap: ] (cap))
        forever
          fill pixels with colour (255) (255) (255) :: light
          show pixels
          wait (1) seconds
          clear pixels
          show pixels
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        #include <Adafruit_NeoPixel.h>

        const int LED_PIN = 13;
        const int LED_COUNT = 60;
        const float SUPPLY_MA = 2000;     // what the supply can give the strip, with margin
        const float PIXEL_MA = 60;        // one pixel at full white
        Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

        void setup() {
          Serial.begin(115200);
          strip.begin();
          float fullWhiteMa = LED_COUNT * PIXEL_MA;            // the worst case
          int cap = (int)(255.0f * SUPPLY_MA / fullWhiteMa);
          if (cap > 255) cap = 255;
          strip.setBrightness(cap);
          Serial.printf("Full white would draw %.0f mA; brightness capped to %d of 255\n", fullWhiteMa, cap);
        }

        void loop() {
          strip.fill(strip.Color(255, 255, 255));              // the worst case
          strip.show();
          delay(1000);
          strip.clear();
          strip.show();
          delay(1000);
        }
      `,
      py: String.raw`
        from machine import Pin
        from neopixel import NeoPixel
        import time

        LED_PIN = 13
        LED_COUNT = 60
        SUPPLY_MA = 2000                  # what the supply can give the strip, with margin
        PIXEL_MA = 60                     # one pixel at full white
        np = NeoPixel(Pin(LED_PIN), LED_COUNT)

        full_white_ma = LED_COUNT * PIXEL_MA                   # the worst case
        cap = min(255, int(255 * SUPPLY_MA / full_white_ma))   # MicroPython has no brightness setting: scale the colours
        print("Full white would draw", full_white_ma, "mA; brightness capped to", cap, "of 255")

        while True:
            np.fill((cap, cap, cap))                           # the worst case, scaled down
            np.write()
            time.sleep(1)
            np.fill((0, 0, 0))
            np.write()
            time.sleep(1)
      `,
      output: `
        Full white would draw 3600 mA; brightness capped to 141 of 255
      `,
      notes: ['The cap ignores the 1 mA or so each pixel takes while dark: keep a little margin in SUPPLY_MA.', 'Colours that are not white take less than 60 mA, so the cap is conservative; a program can also sum the real colour values and scale only when needed.']
    }
  ],
  formulas: [
    {
      name: 'Current of a strip',
      expr: 'I = n*ip*b',
      tex: 'I = n \\cdot i_{p} \\cdot b',
      vars: {
        I: { name: 'strip current', q: 'current', unit: 'A', tex: 'I' },
        n: { name: 'number of pixels', q: 'count', value: 60, min: 1, int: true, tex: 'n' },
        ip: { name: 'current of one pixel at full white', q: 'current', unit: 'mA', value: 60, tex: 'i_{p}' },
        b: { name: 'brightness, 1 = full white', q: 'ratio', unit: '', value: 1, min: 0, max: 1, tex: 'b' }
      },
      solveFor: 'I',
      note: 'The worst case: every pixel white at the brightness b. Add about 1 mA per pixel for the dark idle current. Colours other than white take less.',
      stories: { I: 'A strip of {n} pixels at brightness {b} takes {ip} each at full white. What current does the supply deliver?', b: 'A supply must not give more than {I} to {n} pixels of {ip} each. How bright, as a fraction of full white, may the strip be?' }
    },
    {
      name: 'Voltage drop at the far end',
      expr: 'dV = k*I*R',
      tex: '\\Delta V = k \\, I \\, R_{\\mathrm{loop}}',
      vars: {
        dV: { name: 'drop at the weakest pixel', q: 'voltage', unit: 'V', tex: '\\Delta V' },
        k: { name: 'feed factor (0.5 one end, 0.125 both ends)', q: 'none', value: 0.5, min: 0.05, max: 1, tex: 'k' },
        I: { name: 'total strip current', q: 'current', unit: 'A', value: 10, tex: 'I' },
        R: { name: 'loop resistance of the strip (5 V rail plus ground)', q: 'resistance', unit: 'mΩ', value: 100, tex: 'R_{\\mathrm{loop}}' }
      },
      solveFor: 'dV',
      note: 'For current spread evenly along the strip: from one end the weakest pixel is the last, and the drop is half of I times the loop resistance; fed from both ends the weakest pixel is the middle and the drop is an eighth. The resistance is that of the whole length, both rails together.',
      stories: { dV: 'A strip takes {I} spread evenly along it and has a loop resistance of {R}. With a feed factor of {k}, how much voltage is lost?' }
    }
  ],
  examples: [
    {
      title: 'Is one power feed enough?',
      q: 'A 5 m strip of 300 pixels has a loop resistance of 180 mΩ. At brightness 50 % white it takes 9 A. How low does the voltage fall at the far end if it is fed only from the start? And from both ends?',
      steps: [{ text: 'Feed from one end, factor 0.5:', tex: '\\Delta V = 0.5 \\times 9\\,\\mathrm{A} \\times 0.18\\,\\Omega = 0.81\\,\\mathrm{V}' }, 'The last pixels see about 5.0 − 0.8 = 4.2 V: blue is already weaker and white turns slightly warm.', { text: 'Fed from both ends, factor 0.125:', tex: '\\Delta V = 0.125 \\times 9 \\times 0.18 = 0.20\\,\\mathrm{V}' }],
      a: 'About 0.8 V lost with one feed, 0.2 V with two. At full white (18 A) the one-feed drop would be 1.6 V, which is where the end of the strip fails.'
    }
  ],
  quiz: [
    { q: 'A strip of 150 WS2812B pixels is set to full white. Roughly what current does it take at 5 V?', choices: ['0.9 A', '3 A', '9 A', '90 A'], a: 2, why: '150 × 60 mA = 9 A, or 45 W. A 3 A supply would sag, and the ESP32 may reset.' },
    { q: 'The last pixels of a long strip turn orange when the strip shows white. What is the cause and the cure?', choices: ['The data wire is too long; shorten it', 'Voltage drop along the strip, the blue and green LEDs need the most voltage; inject power at more points', 'The program has the wrong colour order', 'The strip is 12 V'], a: 1, why: 'The thin tracks lose voltage along the strip. Blue and green need about 3 V for themselves and fade first, which leaves red and yellow. Power injection, or a higher-voltage strip, fixes it.' },
    { q: 'When a strip is connected, the ground should go on first, before the supply and the data wire.', a: true, why: 'Without ground first, the data pin and the supply may reach the first pixel in an unsafe order, and plugging in a live supply gives a current spike that can destroy the first pixel. Ground first, data next, power last.' },
    { q: 'The ESP32 restarts every time the animation reaches full white. The most likely cause is:', choices: ['The shared supply sags under the strip\'s current spike and the ESP32 browns out', 'A bug in the strip library', 'The data line has no resistor', 'A strapping pin'], a: 0, why: 'The strip\'s step in current pulls the supply down; the ESP32 on the same rail sees a dip below its brownout level. A bigger supply, a capacitor and a brightness limit cure it.' }
  ],
  applications: [
    'Under-cabinet and shelf lighting, which runs for hours at a modest brightness from a mains adapter.',
    'Large signs and LED walls, where injection every metre is the standard design.',
    'Wearables and costumes powered from a battery bank with a hard brightness cap.',
    'Holiday lighting, with long chains fed from several supplies and all grounds joined.'
  ],
  sources: [
    'Worldsemi, *WS2812B datasheet*: supply voltage range and the current of each LED.',
    'Adafruit, *NeoPixel Überguide*, the sections on powering (supply sizing, capacitor, resistor, wiring order).',
    'Espressif, *ESP32 Series Datasheet*: absolute maximum and recommended supply ratings of the chip behind the strip.'
  ],
  sim: 'oa-strip-drop'
},

/* ================================================================ buzzers-and-tones */
{
  id: 'buzzers-and-tones',
  parent: 'outputs-and-actuators',
  title: 'Buzzers and tones',
  level: 1,
  short: 'A square wave on a pin makes a note when it reaches a passive buzzer; an active buzzer makes its own. Pitch is frequency, each semitone is a factor of 1.0595, and the loudness is mostly the buzzer\'s business.',
  keywords: ['buzzer', 'piezo', 'tone', 'ledcWriteTone', 'passive buzzer', 'active buzzer', 'beep', 'melody', 'note frequency', 'semitone', 'square wave', 'alarm', 'resonance', 'magnetic buzzer'],
  prereq: ['pwm-with-ledc', 'digital-output', 'transistor-as-a-switch'],
  related: ['i2s-amplifiers-and-dacs', 'dac-output', 'mosfets-for-loads', 'non-blocking-timing', 'indicator-leds-and-bar-graphs', 'physics:harmonics-timbre', 'physics:loudness-pitch'],
  body: `Sound is a wave of air pressure, and the cheapest way a microcontroller can make one is a square wave on a pin, driving a small transducer. The pitch is the frequency of the wave. How loud it is depends mostly on the buzzer, not on the program.

### Two kinds of buzzer

- An **active buzzer** has its own oscillator inside. Apply a steady voltage and it beeps at one fixed pitch, often 2 to 4 kHz. One pin, on or off, and no choice of note.
- A **passive buzzer** (a piezo disc, or a small magnetic transducer) has no oscillator: it sounds only when the signal on it changes, and then at exactly the frequency you supply. This is the one for melodies.

To tell them apart touch the leads for a moment to 3 V: an active buzzer gives a continuous beep, a passive one only a click.

### Making a note

A note is a square wave at the right frequency with 50 % duty. \`ledcWriteTone(pin, 440)\` makes one in the LEDC hardware, \`ledcWriteTone(pin, 0)\` is silence; in MicroPython set \`freq\` of a PWM object and a duty of 50 %. An octave doubles the frequency; a semitone multiplies it by 2^(1/12) = 1.0595.

| Note | C4 | D4 | E4 | F4 | G4 | A4 | B4 | C5 |
|---|---|---|---|---|---|---|---|---|
| Hz | 262 | 294 | 330 | 349 | 392 | 440 | 494 | 523 |

### Loudness and tone colour

A square wave is rich in odd harmonics, which is why it sounds buzzy. At 50 % duty the fundamental is as strong as it can be; a thinner duty such as 10 % gives a quieter, reedier sound and adds even harmonics, as the simulation shows. A piezo disc is a mechanical resonator: it is loud near its own resonance, typically around 2 to 4 kHz, and much quieter well away from it, so a melody sounds uneven on it. Driving the disc from two pins in opposite phase doubles the voltage across it and raises the volume.

### How to drive them

A small piezo disc is almost a capacitor and a pin can drive it directly. An active buzzer or a magnetic transducer draws 10 to 40 mA, and the magnetic one is a coil: use a transistor ([[mosfets-for-loads]]) and a diode across it. A 5 V buzzer on a 3.3 V pin is quieter than its label suggests.

### Notes take time

The program must hold each note for its length and then change. With \`delay\` that is simple and blocks everything else; for an alarm that must keep reading buttons use the clock-watching style of [[non-blocking-timing]]. Real sound — speech, music files — needs a DAC or I2S and an amplifier: [[i2s-amplifiers-and-dacs]].

> [!key] A passive buzzer sounds at the frequency you give it, so notes are square waves from the LEDC; an active buzzer beeps by itself at its own pitch. Mind the current of the buzzer, and the piezo's resonance, which sets where it is loud.`,
  ideas: [
    'An active buzzer has its own oscillator and beeps at one pitch; a passive buzzer plays whatever frequency the pin gives it.',
    'A note is a 50 % square wave: ledcWriteTone(pin, Hz) in C++, PWM freq in MicroPython; zero is silence.',
    'Each semitone is a factor of 1.0595 and each octave doubles the frequency; A4 is 440 Hz.',
    'Piezo discs are loudest near their resonance (a few kilohertz); magnetic buzzers need a transistor and a diode.'
  ],
  pitfalls: [
    'Any buzzer can play a melody — Only a passive one can. An active buzzer has a fixed oscillator: changing the signal changes nothing but the on and off times.',
    'The buzzer is on a pin, so it is safe — A magnetic buzzer or an active one can draw tens of milliamps and the magnetic one is a coil. Switch it with a transistor and put a diode across it.',
    'Quieter means a lower duty — It makes the sound thinner and shifts the tone colour more than the loudness. Real volume control uses the supply voltage, a resistor in series, or an amplifier.'
  ],
  terms: [
    { term: 'Active buzzer', also: ['self-oscillating buzzer', 'buzzer with oscillator'], def: 'A buzzer with an oscillator built in: a steady DC voltage makes it sound at one fixed pitch. It can only be turned on and off.' },
    { term: 'Passive buzzer', also: ['piezo transducer', 'magnetic transducer'], def: 'A buzzer without an oscillator. It sounds only while the signal on it changes, at the frequency of that signal, so a pin can play notes on it.' },
    { term: 'Piezo element', also: ['piezo disc', 'piezoelectric buzzer'], def: 'A thin ceramic disc bonded to a metal plate that bends when a voltage is applied. It is a nearly capacitive load with a mechanical resonance, usually of a few kilohertz.' },
    { term: 'Semitone', also: ['half step', 'equal temperament'], def: 'The smallest step of the Western scale: twelve of them make an octave, so each multiplies the frequency by the twelfth root of two, 1.0595.' },
    { term: 'Harmonic', also: ['overtone'], def: 'A component of a sound at a whole-number multiple of its fundamental frequency. A square wave of 50 % duty contains the odd harmonics, with amplitudes 1, 1/3, 1/5 …' }
  ],
  choose: {
    good: ['A passive piezo disc for beeps and simple tunes at small cost and current', 'An active buzzer for one reliable alarm tone and the simplest code', 'A speaker with an I2S amplifier when the sound is speech or music'],
    avoid: ['An active buzzer where you wanted different notes', 'Driving a magnetic transducer without a transistor and a diode', 'Judging loudness by the duty; judge it by the buzzer and its supply'],
    check: ['Active or passive: touch 3 V across it', 'The resonant frequency in the buzzer\'s datasheet, and play there for volume', 'The rated voltage and current against the pin or the transistor']
  },
  code: [
    {
      title: 'Play a tune on a passive buzzer',
      about: 'The first bars of Beethoven\'s Ode to Joy, one note after another. Each note sounds for nine tenths of its length, followed by a short gap so that repeated notes can be told apart.',
      needs: 'An ESP32 DevKit and a passive piezo buzzer (a magnetic one needs a transistor).',
      wiring: [['GPIO23', 'buzzer +'], ['GND', 'buzzer −']],
      blocks: `
        when started
          set [notes v] to (list 330 330 349 392 392 349 330 294 262 262 294 330 330 294 294)
          set [lengths v] to (list 400 400 400 400 400 400 400 400 400 400 400 400 600 200 800)
        forever
          repeat for each [i v] in (list 1 to 15)
            play tone (item (i) of [notes v]) Hz on pin (23) for (((item (i) of [lengths v]) * (0.9)) / (1000)) seconds
            wait (((item (i) of [lengths v]) * (0.1)) / (1000)) seconds
          end
          wait (2) seconds
        end
      `,
      cpp: String.raw`
        const int BUZZER = 23;
        const int NOTES[]   = {330, 330, 349, 392, 392, 349, 330, 294, 262, 262, 294, 330, 330, 294, 294};   // Hz
        const int LENGTHS[] = {400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 600, 200, 800};   // ms
        const int COUNT = sizeof(NOTES) / sizeof(NOTES[0]);

        void setup() {
          ledcAttach(BUZZER, 2000, 10);              // ledcWriteTone changes the frequency; 10 bits is what it uses
        }

        void loop() {
          for (int i = 0; i < COUNT; i++) {
            ledcWriteTone(BUZZER, NOTES[i]);         // a 50 % square wave at this frequency
            delay(LENGTHS[i] * 9 / 10);              // sound for nine tenths of the note
            ledcWriteTone(BUZZER, 0);                // silence: a short gap between notes
            delay(LENGTHS[i] / 10);
          }
          delay(2000);
        }
      `,
      py: String.raw`
        from machine import Pin, PWM
        import time

        BUZZER = 23
        NOTES = (330, 330, 349, 392, 392, 349, 330, 294, 262, 262, 294, 330, 330, 294, 294)    # Hz
        LENGTHS = (400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 600, 200, 800)  # ms

        pwm = PWM(Pin(BUZZER), freq=2000, duty_u16=0)

        while True:
            for note, length in zip(NOTES, LENGTHS):
                pwm.freq(note)
                pwm.duty_u16(32768)                  # a 50 % square wave at this frequency
                time.sleep_ms(length * 9 // 10)      # sound for nine tenths of the note
                pwm.duty_u16(0)                      # silence: a short gap between notes
                time.sleep_ms(length // 10)
            time.sleep(2)
      `,
      notes: ['The core also has ledcWriteNote(pin, NOTE_C, 4) and the Arduino tone(pin, frequency, duration); the frequency form above works the same on every chip.', 'Several buzzers on different pins with the same settings share one LEDC timer: changing the frequency of one changes the others, so play one tone at a time.']
    },
    {
      title: 'Beep codes with an active buzzer',
      about: 'One beep at start-up means "all well". Then every five seconds three short beeps repeat, as a fault code would. An active buzzer needs no frequency, only on and off.',
      needs: 'An active buzzer module whose driver accepts 3.3 V (or a buzzer on a transistor).',
      wiring: [['GPIO23', 'buzzer module signal'], ['5 V or 3.3 V', 'module VCC'], ['GND', 'module GND']],
      blocks: `
        define beep (times)
          repeat (times)
            set pin (23) to [HIGH v]
            wait (0.1) seconds
            set pin (23) to [LOW v]
            wait (0.1) seconds
          end

        when started
          set pin (23) as [output v]
          beep (1) :: my
        forever
          wait (5) seconds
          beep (3) :: my
        end
      `,
      cpp: String.raw`
        const int BUZZER = 23;

        void beep(int times) {
          for (int i = 0; i < times; i++) {
            digitalWrite(BUZZER, HIGH);
            delay(100);
            digitalWrite(BUZZER, LOW);
            delay(100);
          }
        }

        void setup() {
          pinMode(BUZZER, OUTPUT);
          beep(1);                       // all well
        }

        void loop() {
          delay(5000);
          beep(3);                       // the fault code, every five seconds
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        BUZZER = 23
        buzzer = Pin(BUZZER, Pin.OUT, value=0)

        def beep(times):
            for _ in range(times):
                buzzer.value(1)
                time.sleep_ms(100)
                buzzer.value(0)
                time.sleep_ms(100)

        beep(1)                          # all well
        while True:
            time.sleep(5)
            beep(3)                      # the fault code, every five seconds
      `,
      notes: ['These delays stop the program while the code sounds. An alarm that must keep reading sensors uses the clock-watching pattern of [[non-blocking-timing]].', 'Some "active" modules switch on when the pin is low: check the module and swap the levels if the beeps come at the wrong time.']
    }
  ],
  formulas: [
    {
      name: 'Frequency of a note',
      expr: 'f = 440*2^((n - 69)/12)',
      tex: 'f = 440 \\cdot 2^{(n - 69)/12}',
      vars: {
        f: { name: 'frequency', q: 'frequency', unit: 'Hz', tex: 'f' },
        n: { name: 'MIDI note number (A4 = 69, middle C = 60)', q: 'none', value: 60, signed: true, tex: 'n' }
      },
      solveFor: 'f',
      note: 'Equal temperament with A4 = 440 Hz. Each +1 is a semitone up, +12 an octave. Solve for n to find which note a frequency is, and how far off.',
      stories: { f: 'Which frequency is MIDI note {n}?', n: 'A buzzer plays {f}. Which MIDI note number is that (a fraction means it is between two notes)?' }
    }
  ],
  examples: [
    {
      title: 'The frequency of middle C and of the E above it',
      q: 'Middle C is MIDI note 60. What frequency does the buzzer need, and what is the E four semitones above it?',
      steps: [{ text: 'Middle C, 9 semitones below A4:', tex: 'f = 440 \\cdot 2^{(60-69)/12} = 440 \\cdot 2^{-0.75} = 261.6\\,\\mathrm{Hz}' }, { text: 'Four semitones up, note 64:', tex: 'f = 440 \\cdot 2^{(64-69)/12} = 329.6\\,\\mathrm{Hz}' }],
      a: 'About 262 Hz for middle C and 330 Hz for the E above it. In a program, rounding to the nearest hertz is inaudible.'
    }
  ],
  quiz: [
    { q: 'You touch a buzzer to 3 V and it gives one click, nothing more. Which kind is it?', choices: ['An active buzzer', 'A broken buzzer only', 'A passive buzzer', 'A relay'], a: 2, why: 'A passive buzzer needs a changing signal; a steady voltage moves the disc once and holds it there. An active buzzer, with its own oscillator, would beep continuously.' },
    { q: 'A program plays 440 Hz and then 880 Hz. What is the interval?', choices: ['A semitone', 'A fifth', 'An octave', 'Two octaves'], a: 2, why: 'Doubling the frequency is one octave, twelve semitones of 1.0595 each.' },
    { q: 'A piezo disc is clearly louder at 3 kHz than at 500 Hz at the same voltage. Why?', choices: ['The pin has more current at 3 kHz', 'Higher frequencies carry more power', 'The LEDC is louder there', 'The disc is a mechanical resonator, with its resonance near 3 kHz'], a: 3, why: 'A piezo disc bends most easily near its own resonance. Away from it the same signal moves it much less. Datasheets give the resonant frequency.' },
    { q: 'Why does a magnetic buzzer driven by a transistor need a diode across it?', choices: ['To make it louder', 'It is a coil, and switching it off makes a voltage spike that can destroy the transistor', 'To set the pitch', 'To reverse the polarity'], a: 1, why: 'A coil keeps its current flowing when the switch opens and the voltage rises until something conducts. The diode gives the current a safe path. See [[switching-dc-loads]].' }
  ],
  applications: [
    'Beeps on a button press, an error, a timer or a completed task.',
    'Alarms and door chimes, with a different tune for each event.',
    'Metronomes and teaching toys that play scales.',
    'Doorbells and appliance timers, where a short melody says what happened.'
  ],
  sources: [
    'Arduino core for ESP32 documentation, *LEDC* API: ledcWriteTone and ledcWriteNote (core 3.3).',
    'MicroPython documentation, *Quick reference for the ESP32*: PWM (version 1.29).',
    'Manufacturers\' datasheets of piezo and magnetic buzzers (resonant frequency, drive voltage and current).'
  ],
  sim: 'oa-tone-wave'
},

/* ================================================================ switching-dc-loads */
{
  id: 'switching-dc-loads',
  parent: 'outputs-and-actuators',
  title: 'Switching DC loads: pumps, fans, valves',
  level: 2,
  short: 'A pin can only ask; a logic-level MOSFET does the switching. Add a gate pull-down so the load stays off at boot, a flyback diode across anything with a coil, and PWM for soft starts and speed.',
  keywords: ['MOSFET', 'low-side switch', 'pump', 'solenoid valve', 'flyback diode', 'freewheel diode', 'logic-level MOSFET', 'gate resistor', 'pull-down', 'soft start', 'peak and hold', 'ULN2003', 'inductive load', 'DC motor', 'stall current'],
  prereq: ['mosfets-for-loads', 'pin-current-limits', 'pwm-with-ledc'],
  related: ['motor-pwm-frequency', 'dc-motors-and-h-bridges', 'protection-parts', 'current-peaks-and-capacitors', 'pins-at-boot', 'relays', 'electronics:flyback-diode', 'electronics:mosfet-switch', 'motors:solenoid-actuators'],
  body: `A water pump, a solenoid valve, a fan or a small motor wants more current than a pin can give and often more voltage than 3.3 V. The pin therefore does not power the load; it controls a switch, and the switch is almost always an N-channel **logic-level MOSFET** on the ground side of the load.

### The circuit in words

The load's positive terminal goes to its own supply; its other terminal goes to the MOSFET's **drain**. The **source** goes to ground, which is shared with the ESP32. The pin reaches the **gate** through 100 to 220 Ω, and a 10 kΩ resistor from gate to ground keeps the MOSFET off while the pin floats during reset and boot (see [[pins-at-boot]]). Across any load with a coil — pump, valve, relay, motor, fan — goes a **diode**, cathode towards the positive supply.

### Choosing the MOSFET

It must turn fully on at **3.3 V** at the gate: look in the datasheet for the on-resistance at a gate voltage of 3.3 or 4.5 V, not at 10 V. A part that needs 10 V (IRF540, IRFZ44N without the L) barely conducts at 3.3 V and burns. Its current rating should be at least twice the load's, and its voltage rating at least twice the supply. The loss is small: a load of 2 A through 50 mΩ is 0.2 W.

### The flyback diode

A coil stores energy of ½ L I². When the MOSFET opens, the current cannot stop at once: the coil pushes the voltage up until something conducts, and without a diode that is the MOSFET itself, in breakdown. A diode across the coil lets the current circulate and clamps the drain at the supply plus 0.7 V. The price is a slower release; a Zener in series with the diode releases faster. The simulation shows all three cases.

### PWM, soft start and peak and hold

PWM at 20 kHz or more controls the speed of a small DC motor, pump or fan without whine ([[motor-pwm-frequency]]). Motors start with several times their running current: ramp the duty up over a second or two instead of switching on hard. A solenoid needs its full voltage only to pull in; to hold it a third to a half of the voltage is often enough, so a good program applies full duty for about 100 ms and then a lower duty. That cuts heating a lot — check the valve's datasheet.

### Power and wiring

Use a separate supply for the load, ground joined to the ESP32's. A capacitor of 100 to 470 µF at the load absorbs the current steps, a 100 nF ceramic capacitor across the terminals of a brushed motor cuts its noise, and the wires of the high-current loop should be short and thick. A seven-channel driver array such as the ULN2003 has the switches and the diodes in one package, for loads up to about half an ampere each.

> [!key] Switch the load, not the pin: a logic-level MOSFET to ground, a gate resistor and pull-down, and a diode across every coil. Use PWM at 20 kHz for speed, ramp the start, and let a solenoid hold on less than it pulled in with.`,
  ideas: [
    'A logic-level N-channel MOSFET on the ground side of the load, driven through a gate resistor, switches amps from a 3.3 V pin.',
    'A 10 kΩ pull-down on the gate keeps the load off while the pin floats during boot.',
    'A diode across every coil (cathode to the positive supply) gives the current a path and saves the MOSFET.',
    'PWM at 20 kHz or more gives speed control, ramping the duty gives a soft start, and a solenoid can hold on much less than it pulls in with.'
  ],
  pitfalls: [
    'Any MOSFET will do — Many need 10 V at the gate and are barely on at 3.3 V. Read the on-resistance at your gate voltage, and choose a logic-level part.',
    'A small relay or pump coil does not need a diode if the MOSFET is big enough — A bigger MOSFET only breaks down at a higher voltage. The diode is cheap insurance, and the spike also upsets the ESP32 through the ground and the supply.',
    'The ESP32 and the load can have separate grounds — They must share one: the gate voltage is measured against the source, which sits on the load ground.'
  ],
  terms: [
    { term: 'Logic-level MOSFET', also: ['logic-level gate', 'low threshold MOSFET'], def: 'A MOSFET specified to conduct fully with a gate voltage of 3.3 V to 5 V, so that a microcontroller pin can switch it directly.' },
    { term: 'Low-side switch', also: ['low-side driver'], def: 'A switch between the load and ground, so that the load\'s other side stays connected to the supply. It is the simplest arrangement and uses an N-channel MOSFET.' },
    { term: 'Flyback diode', also: ['freewheel diode', 'snubber diode', 'clamp diode'], def: 'A diode across a coil that conducts when the switch opens and the coil\'s voltage reverses, so that the current can die away safely instead of making a voltage spike.' },
    { term: 'Gate pull-down', also: ['gate resistor to ground'], def: 'A resistor of about 10 kΩ from a MOSFET\'s gate to ground that keeps it off whenever the driving pin is not actively driven high, as at reset.' },
    { term: 'Peak and hold', also: ['pull-in and hold'], def: 'Driving a solenoid at full voltage for a short time to pull it in, then at a reduced average voltage to keep it there with less heat.' }
  ],
  choose: {
    good: ['A logic-level N-channel MOSFET for pumps, valves and fans up to several amps', 'A driver array such as the ULN2003 for several small loads in one package', 'A module with a MOSFET, a diode and screw terminals when you want no soldering'],
    avoid: ['A bare transistor or MOSFET from a 10 V design on a 3.3 V gate', 'A coil with no diode', 'Powering the load from the DevKit\'s 5 V pin'],
    check: ['The on-resistance at 3.3 V gate drive, in the datasheet curves', 'The stall or starting current of the motor, not the running current', 'That the load supply and the ESP32 share a ground']
  },
  code: [
    {
      title: 'A pump with a soft start',
      about: 'The pump speeds up over two seconds, runs at full speed for five and slows down over two, then rests. PWM at 20 kHz keeps the motor quiet. The duty ramp keeps the starting current down.',
      needs: 'An ESP32 DevKit, a logic-level N-channel MOSFET, a 12 V DC pump with its own supply, a diode (1N4007 or a Schottky such as 1N5819) across the pump, 220 Ω in the gate line and 10 kΩ from gate to ground.',
      wiring: [['GPIO25', '220 Ω → MOSFET gate (10 kΩ gate → GND)'], ['pump +', '12 V supply, diode cathode here'], ['pump −', 'MOSFET drain (diode anode here)'], ['MOSFET source', 'GND of the supply and of the ESP32']],
      blocks: `
        define ramp from (a) to (b) in (ms) milliseconds
          repeat for each [t v] in (list 0 to (ms))
            set PWM on pin (25) to ((a) + ((((b) - (a)) * (t)) / (ms)))
            wait (0.001) seconds
          end

        when started
          set PWM on pin (25) frequency (20000) resolution (8)
        forever
          ramp from (0) to (255) in (2000) milliseconds :: my
          wait (5) seconds
          ramp from (255) to (0) in (2000) milliseconds :: my
          wait (4) seconds
        end
      `,
      cpp: String.raw`
        const int PUMP_PIN = 25;
        const int FREQ = 20000;            // above hearing: the motor does not whine
        const int BITS = 8;                // 0 … 255; the LEDC allows 11 bits at 20 kHz

        void ramp(int from, int to, int ms) {            // a linear duty ramp, one step a millisecond
          for (int t = 0; t < ms; t++) {
            ledcWrite(PUMP_PIN, from + (long)(to - from) * t / ms);
            delay(1);
          }
          ledcWrite(PUMP_PIN, to);
        }

        void setup() {
          ledcAttach(PUMP_PIN, FREQ, BITS);
          ledcWrite(PUMP_PIN, 0);
        }

        void loop() {
          ramp(0, 255, 2000);              // soft start
          delay(5000);                     // full speed
          ramp(255, 0, 2000);              // soft stop
          delay(4000);                     // rest
        }
      `,
      py: String.raw`
        from machine import Pin, PWM
        import time

        PUMP_PIN = 25
        FREQ = 20000                       # above hearing: the motor does not whine
        pwm = PWM(Pin(PUMP_PIN), freq=FREQ, duty_u16=0)

        def ramp(start, stop, ms):         # a linear duty ramp, one step a millisecond; 0 … 255 as in C++
            for t in range(ms):
                pwm.duty_u16((start + (stop - start) * t // ms) * 257)
                time.sleep_ms(1)
            pwm.duty_u16(stop * 257)

        while True:
            ramp(0, 255, 2000)             # soft start
            time.sleep(5)                  # full speed
            ramp(255, 0, 2000)             # soft stop
            time.sleep(4)                  # rest
      `,
      notes: ['The diode is not optional: a pump is a motor, which is a coil.', 'Brushless pumps and fans with three or four wires have their own controller and are driven differently: see [[fans-and-pwm-control]].']
    },
    {
      title: 'A solenoid valve: pull in hard, hold gently',
      about: 'The valve opens for three seconds and closes for five. At the start of each opening the coil gets full duty for 100 ms to pull the plunger in; then the duty drops to 40 % to hold it, with far less heat.',
      needs: 'A 12 V solenoid valve with its supply, the same MOSFET circuit with a flyback diode across the coil.',
      wiring: [['GPIO26', '220 Ω → MOSFET gate (10 kΩ gate → GND)'], ['valve +', '12 V supply, diode cathode here'], ['valve −', 'MOSFET drain (diode anode here)'], ['MOSFET source', 'GND of the supply and of the ESP32']],
      blocks: `
        when started
          set PWM on pin (26) frequency (20000) resolution (8)
        forever
          set PWM on pin (26) to (255)
          wait (0.1) seconds
          set PWM on pin (26) to (102)
          wait (2.9) seconds
          set PWM on pin (26) to (0)
          wait (5) seconds
        end
      `,
      cpp: String.raw`
        const int VALVE_PIN = 26;
        const int FREQ = 20000, BITS = 8;
        const int PULL_IN_DUTY = 255;                    // full voltage to pull the plunger in
        const int HOLD_DUTY = 102;                       // 40 % to hold it: check your valve's datasheet
        const int PULL_IN_MS = 100;

        void setup() {
          ledcAttach(VALVE_PIN, FREQ, BITS);
          ledcWrite(VALVE_PIN, 0);
        }

        void loop() {
          ledcWrite(VALVE_PIN, PULL_IN_DUTY);            // open
          delay(PULL_IN_MS);
          ledcWrite(VALVE_PIN, HOLD_DUTY);               // hold open with less heat
          delay(3000 - PULL_IN_MS);
          ledcWrite(VALVE_PIN, 0);                       // closed
          delay(5000);
        }
      `,
      py: String.raw`
        from machine import Pin, PWM
        import time

        VALVE_PIN = 26
        PULL_IN_DUTY = 255                 # full voltage to pull the plunger in
        HOLD_DUTY = 102                    # 40 % to hold it: check your valve's datasheet
        PULL_IN_MS = 100

        pwm = PWM(Pin(VALVE_PIN), freq=20000, duty_u16=0)

        while True:
            pwm.duty_u16(PULL_IN_DUTY * 257)               # open
            time.sleep_ms(PULL_IN_MS)
            pwm.duty_u16(HOLD_DUTY * 257)                  # hold open with less heat
            time.sleep_ms(3000 - PULL_IN_MS)
            pwm.duty_u16(0)                                # closed
            time.sleep(5)
      `,
      notes: ['The hold level depends on the valve and on its supply voltage: too low and it drops out under pressure. Test with the real pressure.', 'A valve that must close when the program crashes needs a hardware default: the gate pull-down gives it, and so does a normally-closed valve.']
    }
  ],
  formulas: [
    {
      name: 'Energy stored in a coil',
      expr: 'E = L*I^2/2',
      tex: 'E = \\tfrac{1}{2} L I^{2}',
      vars: {
        E: { name: 'stored energy', q: 'energy', unit: 'mJ', tex: 'E' },
        L: { name: 'inductance of the coil', q: 'inductance', unit: 'mH', value: 100, tex: 'L' },
        I: { name: 'current at switch-off', q: 'current', unit: 'A', value: 0.4, tex: 'I' }
      },
      solveFor: 'E',
      note: 'This is the energy that must go somewhere when the switch opens: into a flyback diode, or into the transistor, which it can destroy.',
      stories: { E: 'A solenoid of {L} carries {I} when the MOSFET opens. How much energy has to be dissipated?' }
    },
    {
      name: 'Loss in the MOSFET while it conducts',
      expr: 'P = I^2*Rds',
      tex: 'P = I^{2} R_{\\mathrm{DS(on)}}',
      vars: {
        P: { name: 'power lost in the MOSFET', q: 'power', unit: 'W', tex: 'P' },
        I: { name: 'load current', q: 'current', unit: 'A', value: 2, tex: 'I' },
        Rds: { name: 'on-resistance at the gate voltage you use', q: 'resistance', unit: 'mΩ', value: 50, tex: 'R_{\\mathrm{DS(on)}}' }
      },
      solveFor: 'P',
      note: 'Use the on-resistance at 3.3 V (or 4.5 V) of gate drive, and at the working temperature (it rises when hot). Under about half a watt a MOSFET needs no heat sink.',
      stories: { P: 'A MOSFET with {Rds} on-resistance carries {I}. How much power does it dissipate?' }
    }
  ],
  examples: [
    {
      title: 'Does the pump need a bigger MOSFET?',
      q: 'A 12 V pump runs at 1.5 A and takes 6 A for a moment at start-up. The MOSFET is rated 30 V, 12 A, with 40 mΩ on-resistance at 4.5 V gate drive, and the gate is driven by 3.3 V pins. Is it suitable?',
      steps: [{ text: 'Running loss:', tex: 'P = 1.5^2 \\times 0.04 = 0.09\\,\\mathrm{W}' }, 'The start-up peak of 6 A is half the 12 A rating, and 30 V is 2.5 times the supply: the margins hold.', 'The open question is the 3.3 V gate: the 40 mΩ is quoted at 4.5 V. Look at the datasheet curve of on-resistance against gate voltage; if it is still under about 100 mΩ at 3.3 V the loss is 0.2 W.'],
      a: 'Yes, if the datasheet shows a low on-resistance at 3.3 V gate drive; otherwise pick a part that is specified at 2.5 or 3.3 V. The current and voltage ratings are ample.'
    }
  ],
  quiz: [
    { q: 'A MOSFET circuit works on the bench with 5 V at the gate but the load barely switches from an ESP32 pin. What is the likely cause?', choices: ['The MOSFET is not logic-level: at 3.3 V it is not fully on', 'The pin is too fast', 'The load needs AC', 'The pin is input-only'], a: 0, why: 'Standard MOSFETs are specified at about 10 V of gate drive. At 3.3 V they conduct weakly, get hot and the load does not get its voltage. Choose a logic-level part.' },
    { q: 'A 10 kΩ resistor from the MOSFET\'s gate to ground keeps the load off while the pin floats during reset and boot.', a: true, why: 'During reset and the first moments of boot a pin is not driven, so the gate would float and might turn the load on. The pull-down holds it off. It does not limit the load current and it does not replace the flyback diode.' },
    { q: 'A valve is driven with a MOSFET and no diode. What happens when the MOSFET turns off?', choices: ['Nothing: coils have no memory', 'The valve opens more', 'The coil\'s current forces a voltage spike that can break the MOSFET down', 'The ESP32 resets by design'], a: 2, why: 'The coil stores energy and keeps its current flowing: with nowhere to go, the voltage rises until the MOSFET or something else breaks down. The flyback diode prevents it.' },
    { q: 'Why drive a solenoid valve at full duty for about 100 ms and then at a lower duty?', choices: ['The LEDC needs a warm-up', 'Lower duty makes the valve quieter only', 'The valve needs AC to hold', 'It takes much more force to pull the plunger in than to hold it, so holding at a lower average voltage saves heat'], a: 3, why: 'Once the plunger is closed on the magnet, the air gap is small and little current holds it. Peak and hold avoids burning the coil\'s full power continuously.' }
  ],
  applications: [
    'Irrigation: valves and pumps for plants and tanks, switched on a timer or a moisture reading.',
    'Cooling fans and small blowers in enclosures and 3D printers.',
    'Coffee machines, aquarium dosing pumps and small hydraulic or pneumatic valves.',
    'Door locks and latches with a solenoid bolt, pulled in briefly and not held.'
  ],
  sources: [
    'Datasheets of logic-level MOSFETs (on-resistance against gate voltage curves) and of the ULN2003 driver array.',
    'Espressif, *ESP32 Series Datasheet*: output drive strength and the state of GPIOs during reset and boot.',
    'Paul Horowitz and Winfield Hill, *The Art of Electronics*, the chapters on transistor switches and on inductive loads.'
  ],
  sim: 'oa-flyback'
},

/* ================================================================ switching-mains-safely */
{
  id: 'switching-mains-safely',
  parent: 'outputs-and-actuators',
  title: 'Switching mains loads safely',
  level: 3,
  short: 'The ESP32 never touches mains: a relay or a solid-state relay does, behind isolation and in an enclosure, installed by a qualified person. What the program must do on its side — a safe default, a minimum dwell, a timeout — and when to buy a ready-made device instead.',
  keywords: ['mains', 'relay module', 'solid state relay', 'SSR', 'galvanic isolation', 'zero-cross', 'contact rating', 'enclosure', 'fail-safe', 'smart plug', 'snubber', 'inductive load', 'CE', 'active low relay', 'safe default'],
  prereq: ['relays', 'solid-state-relays-and-triacs', 'optocouplers'],
  related: ['switching-dc-loads', 'heaters-and-thermal-loads', 'mains-energy-monitoring', 'shelly-sonoff-and-smart-plugs', 'pins-at-boot', 'esd-and-bench-safety', 'reflashing-commercial-devices', 'regulatory-approval'],
  body: `> [!warn] Mains voltage (110 to 230 V) can kill. Wiring it is work for a qualified person, behind isolation and in an enclosure, following the local wiring code. A bare relay board on a desk is not a product. Reflashing a mains device means opening it — never do that while it is plugged in. This page covers the microcontroller side; it is not a wiring guide.

An ESP32 works from 3.3 V and a few tens of milliamps; a lamp, pump or heater on the wall socket works from 230 or 110 V and amps. Between them sits a switch that obeys the ESP32 and keeps mains out of it: an **isolated** relay or solid-state relay.

### What the switch is

- A **relay** moves a contact; the coil is driven by a transistor and a flyback diode, as on [[relays]]. Relay *modules* add the transistor, the diode, an LED and often an optocoupler, so that the input draws only milliamps; many modules switch on when the input is **low**.
- A **solid-state relay** (SSR) has a semiconductor on the mains side and an optical coupling on the control side: silent, long-lived, and in the zero-cross version it turns on only when the mains voltage passes zero, which keeps the noise down ([[solid-state-relays-and-triacs]]). It leaks a little when off and needs a heat sink at higher current.
- A **ready-made device** — a smart plug, a Shelly or a Sonoff in a certified housing — already has the isolation, the distances and the marks. For a socket in a house, or anything others will use, it is the right answer; flashing your own firmware is the owner's right, at the price of the warranty ([[reflashing-commercial-devices]]).

### What the program owes the system

- **A safe default.** Decide what "off" means for the load and make it the state at power-up and after a crash. A pin is undriven during reset: write the *off* level before making the pin an output, and use the pull resistor that holds the module off ([[pins-at-boot]]).
- **A minimum dwell.** Contacts wear when switched often, and compressors and motors must not restart at once. Refuse to change state again within seconds.
- **A timeout.** A load that must not run unattended gets a maximum on-time, which only a deliberate new command can renew.
- **An independent limit.** For a heater, a thermal fuse or thermostat in the mains path must work even if the program freezes.

### The ratings fine print

A relay's contact rating is for a resistive load. A motor, a transformer or a switched-mode supply pulls several times more at switch-on and arcs at switch-off: derate to half or less, or add the snubber the datasheet shows. A fuse or breaker belongs before the switch. Everything on the mains side sits in a closed enclosure with strain relief, correct creepage and clearance, and an earth where the load needs one.

> [!key] Keep the ESP32 on the low-voltage side of an isolated switch, make "off" the state at power-up and after a crash, and never let software be the only safeguard. If you are not qualified to wire mains, buy a certified device.`,
  ideas: [
    'The ESP32 controls an isolated relay or SSR; it never connects to mains itself.',
    'Many relay modules are active low, and a pin is undriven during reset: set the off level before the pin becomes an output.',
    'Relay contact ratings are for resistive loads; motors and power supplies need a large derating or a snubber.',
    'Firmware adds a minimum dwell and a timeout, and anything dangerous needs an independent hardware cut-out as well.'
  ],
  pitfalls: [
    'A relay module on my desk is a finished product — It has bare mains terminals and no enclosure. A product has isolation distances, an enclosure, strain relief, a fuse and the marks required by law.',
    'The relay is rated 10 A, so a 10 A motor is fine — The rating is for a resistive load. A motor starts at several times its running current and arcs on opening; the real limit is much lower.',
    'My code turns the heater off when the temperature is reached, so it is safe — If the code freezes or the sensor fails the heater stays on. A thermal fuse or thermostat must be independent of the program.'
  ],
  terms: [
    { term: 'Galvanic isolation', also: ['isolation barrier', 'electrical isolation'], def: 'Separation of two circuits so that no conductive path joins them: signals cross by light or magnetism. It keeps mains off the ESP32 and off you.' },
    { term: 'Zero-cross switching', also: ['zero-crossing SSR'], def: 'Turning a solid-state relay on only at the instant the AC voltage passes through zero, so that the load current starts smoothly and makes little electrical noise.' },
    { term: 'Contact rating', also: ['switching capacity'], def: 'The current and voltage a relay\'s contacts are specified to switch, normally for a resistive load. Inductive and capacitive loads need a lower figure.' },
    { term: 'Creepage and clearance', also: ['creepage distance'], def: 'The minimum distances across a surface and through the air between parts at different voltages, which prevent sparks and tracking. Mains products are designed to standards that set them.' },
    { term: 'Fail-safe state', also: ['safe default', 'safe state'], def: 'The state a system takes when something fails or power is lost — for a heater, off. Design makes that state happen without software.' }
  ],
  choose: {
    good: ['A certified smart plug or relay device when the load is a household one', 'An opto-isolated relay module or an SSR inside an enclosure, fitted by a qualified person', 'Switching the low-voltage side instead (for example a 24 V contactor) when it is possible'],
    avoid: ['Bare relay boards and exposed mains terminals', 'Switching a motor or power supply at the relay\'s resistive rating', 'Using software alone to stop a heater or a pump'],
    check: ['That the module\'s control side is isolated, and whether it is active low', 'The load\'s starting current against the contact rating', 'What happens to the load at power-up, in reset and after a crash']
  },
  code: [
    {
      title: 'A relay with a safe default, a minimum dwell and a timeout',
      about: 'A button toggles an isolated relay module. At power-up the relay is off before the pin becomes an output; a state change is refused within two seconds of the last; and the relay switches off by itself after 30 minutes. Develop it with a low-voltage test load, never with mains.',
      needs: 'An ESP32 DevKit, an optocoupler-isolated relay module (active low in this example) switching a 12 V lamp as a test load, and a push button.',
      wiring: [['GPIO26', 'relay module IN', 'active low: low switches the relay on'], ['GPIO27', 'button → GND', 'internal pull-up'], ['5 V and GND', 'relay module supply']],
      blocks: `
        define set relay (state)
          set [on v] to (state)
          set [changed v] to (milliseconds since start)
          if <state> then
            set pin (26) to [LOW v]
          else
            set pin (26) to [HIGH v]
          end

        when started
          set pin (26) to [HIGH v]
          set pin (26) as [output v]
          set pin (27) as [input with pull-up v]
          set [on v] to <false>
          set [changed v] to (milliseconds since start)

        when pin (27) goes [low v]
          if <((milliseconds since start) - (changed)) ≥ (2000)> then
            set relay (<not <on>>) :: my
          end

        every (1) seconds
          if <<on> and <((milliseconds since start) - (changed)) ≥ (1800000)>> then
            set relay (<false>) :: my
          end
      `,
      cpp: String.raw`
        const int RELAY_PIN = 26;
        const int BUTTON_PIN = 27;
        const bool ACTIVE_LOW = true;                  // this module switches on when its input is low
        const uint32_t MIN_DWELL_MS = 2000;            // refuse to change state again within this time
        const uint32_t MAX_ON_MS = 30UL * 60 * 1000;   // switch off after 30 minutes unless renewed

        bool relayOn = false;
        bool wasPressed = false;
        uint32_t lastChange = 0;

        void setRelay(bool on) {
          relayOn = on;
          lastChange = millis();
          digitalWrite(RELAY_PIN, on == ACTIVE_LOW ? LOW : HIGH);
        }

        void setup() {
          digitalWrite(RELAY_PIN, ACTIVE_LOW ? HIGH : LOW);   // the OFF level first, then the pin becomes an output
          pinMode(RELAY_PIN, OUTPUT);
          pinMode(BUTTON_PIN, INPUT_PULLUP);
        }

        void loop() {
          bool pressed = digitalRead(BUTTON_PIN) == LOW;
          if (pressed && !wasPressed && millis() - lastChange >= MIN_DWELL_MS) {
            setRelay(!relayOn);                              // toggle on a new press, at most once per MIN_DWELL_MS
          }
          wasPressed = pressed;
          if (relayOn && millis() - lastChange >= MAX_ON_MS) {
            setRelay(false);                                 // the timeout: off by itself
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        RELAY_PIN = 26
        BUTTON_PIN = 27
        ACTIVE_LOW = True                      # this module switches on when its input is low
        MIN_DWELL_MS = 2000                    # refuse to change state again within this time
        MAX_ON_MS = 30 * 60 * 1000             # switch off after 30 minutes unless renewed

        OFF_LEVEL = 1 if ACTIVE_LOW else 0
        relay = Pin(RELAY_PIN, Pin.OUT, value=OFF_LEVEL)   # the OFF level is set as the pin becomes an output
        button = Pin(BUTTON_PIN, Pin.IN, Pin.PULL_UP)

        relay_on = False
        last_change = time.ticks_ms()

        def set_relay(on):
            global relay_on, last_change
            relay_on = on
            last_change = time.ticks_ms()
            relay.value(0 if (on == ACTIVE_LOW) else 1)

        was_pressed = False
        while True:
            pressed = button.value() == 0
            since = time.ticks_diff(time.ticks_ms(), last_change)
            if pressed and not was_pressed and since >= MIN_DWELL_MS:
                set_relay(not relay_on)         # toggle on a new press, at most once per MIN_DWELL_MS
            elif relay_on and since >= MAX_ON_MS:
                set_relay(False)                # the timeout: off by itself
            was_pressed = pressed
            time.sleep_ms(10)
      `,
      notes: ['The same program drives an SSR with a DC control input: choose ACTIVE_LOW = false and check that the SSR turns on at 3.3 V and that its input draws less than the pin can give; otherwise add a transistor.', 'This timeout is only a convenience. A heater or a pump also needs a thermal fuse, a thermostat or a float switch that works without the ESP32.']
    }
  ],
  examples: [
    {
      title: 'Can this relay switch the fridge compressor?',
      q: 'A relay module is rated 10 A at 250 V AC. The compressor of a small fridge draws 1 A running and about 6 A for a fraction of a second when it starts. Is the relay suitable? What else must the program do?',
      steps: ['The rating is for a resistive load; a motor load needs a much lower figure, often a third or half of it.', 'The 6 A start-up surge is below 10 A, but the contacts also see the arc when the motor opens, and a compressor must not restart before its pressure has equalised.', 'Check the datasheet for the inductive rating; if there is none, derate heavily or choose a relay rated for motor loads.', 'The program must keep a minimum off-time of several minutes between starts, which a minimum dwell does, and the switching of mains remains a job for a qualified person.'],
      a: 'Probably yes if the datasheet gives an inductive (AC-15 or motor) rating that covers it, and only with a long minimum off-time in the program. The whole installation, however, belongs in the hands of a qualified person, or in a certified device.'
    }
  ],
  quiz: [
    { q: 'A relay module is wired with its input on a GPIO. Every time the ESP32 reboots the relay clicks on for a moment. What is the best remedy?', choices: ['Set the off level before the pin becomes an output, and add the pull resistor that holds the module off during reset', 'A larger relay', 'Use delay() at the start', 'Reverse the relay contacts'], a: 0, why: 'During reset and boot the pin is not driven. A pull resistor that holds the input at the off level, and writing the off level before enabling the output, remove the click. See pins at boot.' },
    { q: 'The contact rating of a relay is 10 A at 250 V AC. Which load can it switch at that figure?', choices: ['A motor', 'A resistive heater', 'A switched-mode power supply', 'All three'], a: 1, why: 'The figure is for a resistive load. Motors and power supplies draw several times their running current when they start and arc when they open, so they need a lower rating or a relay specified for them.' },
    { q: 'The firmware switches off a heater at 80 °C. Is that enough to make the heater safe?', choices: ['Yes, the sensor is accurate', 'Yes, if the code has a watchdog', 'Yes, if it is a solid-state relay', 'No: a frozen program or a failed sensor leaves it on, so an independent thermal fuse or thermostat is needed'], a: 3, why: 'Software is one layer only. A heater needs a protection that works without the microcontroller. An SSR also tends to fail short, which leaves the heater on.' },
    { q: 'You want a Wi-Fi switch for a lamp in the living room. Which is the soundest approach?', choices: ['A bare relay board in the lamp base', 'An ESP32 pin straight to the lamp', 'A certified smart plug, possibly with your own firmware on it', 'A relay board behind the wallpaper'], a: 2, why: 'A certified plug has the isolation, enclosure and marks required, and flashing it is the owner\'s right at the price of the warranty. Home-made mains wiring is for qualified people only.' }
  ],
  applications: [
    'Smart plugs and wall switches, where the relay lives in a certified housing.',
    'Pumps and water heaters in installations built by an electrician, with the ESP32 on the low-voltage side.',
    'Lighting control from a home-automation system through certified relays and dimmers.',
    'Test fixtures and lab equipment, in a closed and earthed enclosure.'
  ],
  sources: [
    'Datasheets of relay modules and of solid-state relays (contact ratings, zero-cross, leakage current, heat sink curves).',
    'The wiring regulations of your country; for products, the safety standards of the market (the EU Low Voltage Directive, IEC 62368-1 for electronics).',
    'Espressif, *ESP32 Series Datasheet*: GPIO state during reset and boot.'
  ]
},

/* ================================================================ fans-and-pwm-control */
{
  id: 'fans-and-pwm-control',
  parent: 'outputs-and-actuators',
  title: 'Fans and four-wire PWM',
  level: 2,
  short: 'A four-wire PC fan has its own driver: a 25 kHz PWM signal sets the speed and a tach wire sends two pulses per turn back. Halve the speed and you cut the power to an eighth.',
  keywords: ['fan', 'PC fan', 'four-wire fan', '4-pin fan', 'PWM fan', 'tach', 'tachometer', 'RPM', '25 kHz', 'open collector', 'fan curve', 'fan laws', 'cooling', 'Noctua', 'stall detection'],
  prereq: ['switching-dc-loads', 'pwm-with-ledc', 'pull-ups-and-pull-downs'],
  related: ['motor-pwm-frequency', 'pulse-counter-pcnt', 'interrupts', 'thermostats', 'on-off-control-and-hysteresis', 'thermal-design', 'pulse-counting', 'motors:motors-pumps-fans'],
  body: `A PC-style fan comes with two, three or four wires. The two-wire fan is a plain DC load, as on [[switching-dc-loads]]. The three-wire fan adds a speed signal. The **four-wire fan** is made for a controller: it has a control input for the speed, so the fan's own electronics do the switching and the ESP32 only sends a small signal, and a **tach** output that reports the speed.

### The four wires

| Wire | Usual colour | What it is |
|---|---|---|
| 1 | black | ground |
| 2 | yellow | the fan supply, usually 12 V (some fans use 5 V) |
| 3 | green | tach: the speed signal, from the fan |
| 4 | blue | control: the PWM input, to the fan |

The control input expects PWM at about **25 kHz**, above hearing, with the duty cycle setting the speed. The fan has a pull-up inside, and the specification asks for an open-collector driver; a 3.3 V push-pull pin usually works as well, but check the fan's datasheet. At 0 % most fans keep turning at a minimum speed of about a fifth of maximum and some stop altogether.

The **tach** is an open-collector output that gives **two pulses per revolution**, so 1500 rpm is 50 Hz. It needs a pull-up to 3.3 V: the ESP32's internal one is often enough, or fit 10 kΩ. Measure the tach line with the fan powered and the ESP32 disconnected; if it idles above 3.3 V, divide it down.

### Reading the speed

\`rpm = 60 × pulses per second / 2\`. Count the pulses over one second with an interrupt or the pulse counter ([[pulse-counter-pcnt]]); at low speed a second is a coarse window (one pulse is 30 rpm), so time the gap between pulses for finer readings. A tach that reads zero while the control is above the minimum means a stalled or unplugged fan, and a program that cools anything should treat it as an alarm.

### Two- and three-wire fans

A fan without a control input can be slowed by lowering its supply voltage (a regulator) or by chopping the supply with a MOSFET. Fans with built-in electronics often dislike a chopped supply: they chatter, and the tach pulses appear only while the supply is on. If you want speed control, buy the four-wire kind.

### The fan laws

For one fan the airflow is proportional to speed, the pressure to its square and the **power to its cube**. At half speed you get half the air for an eighth of the power, and far less noise. Quiet cooling is a matter of a bigger fan turning slowly.

### From temperature to speed

Map temperature to duty with a *fan curve*: a minimum below one threshold, a straight line up to full speed at a higher one. Add hysteresis, so that the fan does not hunt around a threshold ([[on-off-control-and-hysteresis]]), and keep a minimum speed where the cooling matters for safety.

> [!key] A four-wire fan takes 25 kHz PWM for its speed and reports it as two tach pulses per turn. Give the tach a 3.3 V pull-up, count the pulses to read the rpm, and remember that the power falls with the cube of the speed.`,
  ideas: [
    'A four-wire fan has a PWM input at about 25 kHz for the speed and an open-collector tach output with two pulses per revolution.',
    'rpm = 60 × tach frequency / 2: count the pulses over a second, or time the gap between them at low speed.',
    'The tach needs a pull-up to 3.3 V, and a line that idles higher must be divided down before the pin.',
    'Fan laws: airflow follows speed, power follows its cube, so slowing a fan saves much more power than air.'
  ],
  pitfalls: [
    'PWM duty of 0 % stops the fan — Most four-wire fans keep running at a minimum speed at 0 % and only some stop. The datasheet says which.',
    'The tach wire is a normal logic output — It is open collector: it only pulls low, so it needs a pull-up, and some fans have one to 5 V or 12 V that would damage a 3.3 V pin.',
    'A three-wire fan can be speed-controlled by chopping its supply — Fans with electronics inside often chatter, and the tach is only valid during the on-time. Use a four-wire fan or lower the voltage.'
  ],
  terms: [
    { term: 'Tach', also: ['tachometer', 'FG', 'RPM signal', 'sense wire'], def: 'The speed output of a fan: an open-collector line that gives two pulses for each revolution, so the pulse frequency is the speed in revolutions per second times two.' },
    { term: 'Open collector', also: ['open drain'], def: 'An output that can only pull its line to ground and never drives it high; a pull-up resistor supplies the high level. Fans use it for the tach, and the specification asks it for the PWM control too.' },
    { term: 'Fan curve', also: ['temperature-to-speed curve'], def: 'The rule that turns a measured temperature into a fan speed, often a minimum below one temperature and a straight line to full speed at another.' },
    { term: 'Fan laws', also: ['affinity laws'], def: 'The relations between the speed of a fan and its output: airflow proportional to speed, pressure to speed squared and power to speed cubed.' },
    { term: 'Stall detection', also: ['fan failure detection'], def: 'Noticing that the tach shows no pulses while the fan is being driven, which means the fan is blocked, broken or unplugged.' }
  ],
  choose: {
    good: ['A four-wire fan with a 25 kHz PWM from the LEDC and the tach on a pulse counter', 'A big, slow fan instead of a small, fast one', 'A fan curve with hysteresis for anything driven from a temperature'],
    avoid: ['Chopping the supply of a three-wire fan with electronics inside', 'A tach wire straight onto a pin without checking its idle voltage', 'A fan as the only protection of something that overheats dangerously'],
    check: ['What the fan does at 0 % duty in its datasheet', 'The idle voltage on the tach, with the fan powered and the ESP32 disconnected', 'The fan current against the supply, and the start-up current']
  },
  code: [
    {
      title: 'Set the speed and read the tach',
      about: 'The fan steps through 30, 50, 75 and 100 % duty. For each step the program waits three seconds for the fan to settle, counts tach pulses for one second and prints the speed in rpm.',
      needs: 'An ESP32 DevKit and a four-wire 12 V fan on its own 12 V supply, with the grounds joined.',
      wiring: [['GPIO25', 'fan control (blue)'], ['GPIO26', 'fan tach (green)', 'internal pull-up; add 10 kΩ to 3.3 V if the reading is unsteady'], ['12 V', 'fan supply (yellow)'], ['GND', 'fan ground (black), joined with the ESP32 ground']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (26) as [input with pull-up v]
          set PWM on pin (25) frequency (25000) resolution (8)
          set [pulses v] to (0)
          set [steps v] to (list 30 50 75 100)

        when pin (26) goes [low v]
          change [pulses v] by (1)

        forever
          repeat for each [speed v] in (steps)
            set PWM on pin (25) to (round (((speed) * (255)) / (100)))
            wait (3) seconds
            set [before v] to (pulses)
            wait (1) seconds
            print (join [duty ] (join (speed) (join [ % -> ] (join (((pulses) - (before)) * (30)) [ rpm]))))
          end
        end
      `,
      cpp: String.raw`
        const int FAN_PWM_PIN = 25;
        const int TACH_PIN = 26;
        const int PWM_FREQ = 25000;             // the fan specification asks for about 25 kHz
        const int PWM_BITS = 8;
        const int PULSES_PER_REV = 2;
        const int SPEEDS[] = {30, 50, 75, 100}; // duty in per cent

        volatile uint32_t pulses = 0;
        void IRAM_ATTR onTach() { pulses++; }

        int step = 0;   

        void setup() {
          Serial.begin(115200);
          pinMode(TACH_PIN, INPUT_PULLUP);       // the tach is open collector: it needs a pull-up
          attachInterrupt(TACH_PIN, onTach, FALLING);
          ledcAttach(FAN_PWM_PIN, PWM_FREQ, PWM_BITS);
        }

        void loop() {
          ledcWrite(FAN_PWM_PIN, SPEEDS[step] * 255 / 100);
          delay(3000);                           // let the fan settle
          uint32_t before = pulses;
          delay(1000);                           // count for one second
          uint32_t n = pulses - before;
          Serial.printf("duty %d %%  ->  %.0f rpm\n", SPEEDS[step], n * 60.0f / PULSES_PER_REV);
          step = (step + 1) % 4;
        }
      `,
      py: String.raw`
        from machine import Pin, PWM
        import time

        FAN_PWM_PIN = 25
        TACH_PIN = 26
        PWM_FREQ = 25000                         # the fan specification asks for about 25 kHz
        PULSES_PER_REV = 2
        SPEEDS = (30, 50, 75, 100)               # duty in per cent

        pulses = 0
        def on_tach(pin):
            global pulses
            pulses += 1

        tach = Pin(TACH_PIN, Pin.IN, Pin.PULL_UP)   # the tach is open collector: it needs a pull-up
        tach.irq(trigger=Pin.IRQ_FALLING, handler=on_tach)
        fan = PWM(Pin(FAN_PWM_PIN), freq=PWM_FREQ, duty_u16=0)

        index = 0
        while True:
            fan.duty_u16(SPEEDS[index] * 65535 // 100)
            time.sleep(3)                        # let the fan settle
            before = pulses
            time.sleep(1)                        # count for one second
            n = pulses - before
            print("duty", SPEEDS[index], "% -> %.0f rpm" % (n * 60 / PULSES_PER_REV))
            index = (index + 1) % len(SPEEDS)
      `,
      output: `
        duty 30 %  ->  480 rpm
        duty 50 %  ->  780 rpm
        duty 75 %  ->  1140 rpm
        duty 100 %  ->  1500 rpm
      `,
      notes: ['The rpm figures are an example; every fan has its own curve, and many hold a minimum speed at low duty.', 'A tach that never pulses means a stalled fan or a missing pull-up. Check the wiring before the program.', 'For a steadier reading at low speed, time the gap between pulses, or use the pulse counter peripheral.']
    }
  ],
  formulas: [
    {
      name: 'Speed from the tach frequency',
      expr: 'n = 60*f/ppr',
      tex: 'n = \\frac{60\\,f}{p}',
      vars: {
        n: { name: 'fan speed', q: 'angvel', unit: 'rpm', tex: 'n' },
        f: { name: 'tach frequency', q: 'frequency', unit: 'Hz', value: 50, tex: 'f' },
        ppr: { name: 'pulses per revolution', q: 'count', value: 2, fixed: true, int: true, tex: 'p' }
      },
      solveFor: 'n',
      note: 'Almost every PC fan gives two pulses per revolution; check the datasheet of other fans. Counting for one second makes the resolution 30 rpm.',
      stories: { n: 'The tach shows {f} on a fan with {ppr} pulses per revolution. How fast does it turn?', f: 'A fan turns at {n} and gives {ppr} pulses per turn. What tach frequency must the program expect?' }
    },
    {
      name: 'The fan law for power',
      expr: 'P2 = P1*(n2/n1)^3',
      tex: 'P_2 = P_1 \\left(\\frac{n_2}{n_1}\\right)^{3}',
      vars: {
        P2: { name: 'power at the new speed', q: 'power', unit: 'W', tex: 'P_2' },
        P1: { name: 'power at the old speed', q: 'power', unit: 'W', value: 3, tex: 'P_1' },
        n2: { name: 'new speed', q: 'angvel', unit: 'rpm', value: 750, tex: 'n_2' },
        n1: { name: 'old speed', q: 'angvel', unit: 'rpm', value: 1500, tex: 'n_1' }
      },
      solveFor: 'P2',
      note: 'For one fan in one system, without large changes in the airflow path. The airflow falls only in proportion to the speed, so slowing a fan saves much more power than it costs in air.',
      stories: { P2: 'A fan takes {P1} at {n1}. How much power does it need when slowed to {n2}?' }
    }
  ],
  examples: [
    {
      title: 'Slow the fan by half',
      q: 'A 120 mm fan takes 3 W at 1500 rpm and moves 70 cubic metres of air an hour. The case runs cool enough with half of that air. What speed, and what power?',
      steps: ['Airflow is proportional to speed: half the air needs half the speed, 750 rpm.', { text: 'The power goes with the cube of the speed:', tex: 'P_2 = 3\\,\\mathrm{W} \\times 0.5^3 = 0.375\\,\\mathrm{W}' }, 'On 12 V that is about 31 mA, and the fan is far quieter.'],
      a: '750 rpm and about 0.4 W: half the air for an eighth of the power. If the fan\'s minimum speed is higher than 750 rpm, the minimum is the limit.'
    }
  ],
  quiz: [
    { q: 'A fan\'s tach shows 50 Hz. Two pulses per revolution. How fast does it turn?', choices: ['1500 rpm', '50 rpm', '3000 rpm', '25 rpm'], a: 0, why: '50 pulses a second is 25 revolutions a second, which is 1500 revolutions a minute.' },
    { q: 'Why does the tach wire need a pull-up resistor?', choices: ['To protect the fan', 'It is an open-collector output that can only pull low; the pull-up makes the high level', 'To set the PWM frequency', 'It does not need one'], a: 1, why: 'The fan\'s transistor pulls the line to ground for each pulse, and nothing in the fan drives it high. The ESP32\'s internal pull-up (about 45 kΩ) or an external 10 kΩ does.' },
    { q: 'A fan\'s speed is halved. By how much does its power fall, roughly?', choices: ['to a half', 'to a quarter', 'to an eighth', 'It does not change'], a: 2, why: 'The power follows the cube of the speed: 0.5 × 0.5 × 0.5 = 0.125.' },
    { q: 'What PWM frequency should the control wire of a four-wire PC fan get?', choices: ['50 Hz', '1 kHz', 'about 25 kHz', '1 MHz'], a: 2, why: 'The four-wire specification asks for about 25 kHz: above hearing, and a frequency the fan\'s electronics are made for.' }
  ],
  applications: [
    'Cooling of enclosures, power supplies, 3D printers and amplifiers with a temperature-controlled fan.',
    'Ventilation of a grow tent or a server cabinet with a speed set by temperature and humidity.',
    'A quiet fan for a home-lab rack: a large fan on a gentle curve.',
    'Fan failure alarms in equipment that must not overheat unnoticed.'
  ],
  sources: [
    'Intel, *4-Wire Pulse Width Modulation (PWM) Controlled Fans* specification: control input, tach and the 25 kHz frequency.',
    'Datasheets of four-wire fans (current, minimum speed, tach levels).',
    'Espressif, *ESP-IDF Programming Guide*, LEDC and pulse counter (PCNT) references.'
  ],
  sim: 'oa-fan-tach'
},

/* ================================================================ heaters-and-thermal-loads */
{
  id: 'heaters-and-thermal-loads',
  parent: 'outputs-and-actuators',
  title: 'Heaters',
  level: 2,
  short: 'A heater is a slow load: it needs no fast PWM, only time-proportioning in a window of seconds. How power turns into temperature, how to switch low-voltage and mains heaters, and the cut-out that must work when the program does not.',
  keywords: ['heater', 'heating element', 'time proportioning', 'window', 'burst firing', 'SSR', 'MOSFET', 'thermal runaway', 'thermistor', 'PID', 'thermostat', 'thermal fuse', '3D printer bed', 'silicone heater', 'cartridge heater', 'NTC'],
  prereq: ['switching-dc-loads', 'thermistors-and-ldrs', 'solid-state-relays-and-triacs'],
  related: ['time-proportioning', 'thermostats', 'pid-control', 'on-off-control-and-hysteresis', 'switching-mains-safely', 'thermal-design', 'physics:specific-heat'],
  body: `A heater turns electrical power into heat in a resistor. It is a very slow load: a block of aluminium takes minutes to warm, a water bath much longer. That is good news, because it means a heater needs no fast PWM. It needs **time-proportioning**: the heater is on for part of a window of a second or more and off for the rest, and the thermal mass averages the result.

### Power and time

The power of a resistive heater is \`P = V² / R\`: a 12 V mat of 6 Ω gives 24 W. To heat a mass the energy is \`E = m c ΔT\`, with *c* the specific heat of the material (4186 J/(kg·K) for water, about 900 for aluminium). A litre of water heated by 40 K needs 167 kJ, which 200 W delivers in about 14 minutes — and real losses make it longer.

### Switching it

- **Low-voltage heaters** (silicone mats, cartridge heaters, a 3D printer bed at 12 or 24 V) are switched like any DC load by a logic-level MOSFET ([[switching-dc-loads]]); a heater is not inductive, so it needs no flyback diode.
- **Mains heaters** go through a solid-state relay or a relay in an installation made by a qualified person ([[switching-mains-safely]]). A zero-cross SSR switches only at the zero of the mains voltage, so the power is set by counting whole cycles: 100 cycles at 50 Hz are a 2 s window.
- **Mechanical relays** wear out, perhaps a hundred thousand operations, so use long windows of 10 to 30 s with them.

### Time-proportioning

Choose a window, for instance 2 s. In each window the heater is on for \`duty × window\`; the controller decides the duty from the temperature, often from the gap to the target (a proportional band) or from a PID controller ([[time-proportioning]], [[pid-control]]). The temperature ripples around the average. The ripple is small when the window is short compared with the thermal time constant of the load, and large when it is not: the simulation shows both.

### Sensing

An NTC thermistor and a fixed resistor make a divider that the ADC reads ([[thermistors-and-ldrs]]); the program turns the voltage into a temperature with the beta equation. A thermocouple with an amplifier suits high temperatures. Put the sensor in good thermal contact with what it measures.

### Safety is not in the program

A heater must have a protection that works when the code does not: a thermal fuse or a thermostat in series with the heater, set above the highest working temperature. The program should also treat a broken or shorted sensor as a fault and switch the heater off, and detect that the temperature is not rising when the heater has been on a long time (*thermal runaway* protection, as in 3D printer firmware). Use wire and connectors rated for the current: heated-bed connectors that melt are a classic.

> [!key] A heater is slow, so switch it in windows of seconds, not at kilohertz. Let the program choose the duty, but put a thermal fuse or thermostat in the heater circuit and make a failed sensor switch the heater off.`,
  ideas: [
    'A heater is slow: time-proportioning in a window of seconds sets the average power, and the thermal mass smooths the ripple.',
    'P = V² / R gives the power, and E = m c ΔT the energy needed; the time is the energy divided by the power, plus the losses.',
    'A zero-cross SSR is controlled in whole mains cycles, a mechanical relay in windows of 10 to 30 seconds to spare the contacts.',
    'Software cannot be the only safety: a thermal fuse or a thermostat must work independently, and a failed sensor must switch the heater off.'
  ],
  pitfalls: [
    'A heater needs fast PWM like a motor does — It has no coil to whine and a time constant of seconds to minutes. A window of one to ten seconds is plenty, and kinder to a relay.',
    'When the temperature reading is wrong the heater will notice — A broken NTC reads cold, so the controller applies full power for ever. Check the sensor value for sense and treat anything absurd as a fault.',
    'A thermostat in code is the same as a thermal fuse — Code can freeze, and a relay or SSR can stick closed. The fuse works without either.'
  ],
  terms: [
    { term: 'Time-proportioning', also: ['time-proportional control', 'slow PWM'], def: 'Controlling average power by switching a load fully on for a fraction of a fixed time window, usually of seconds, and fully off for the rest. It suits loads with a large thermal time constant.' },
    { term: 'Thermal runaway', also: ['runaway heating'], def: 'The heater staying on while its sensor shows no temperature rise or a wrong value, so that the load overheats. Firmware guards against it by checking that heating produces a rise.' },
    { term: 'Thermal fuse', also: ['thermal cut-out', 'thermal link'], def: 'A one-shot device in series with a heater that opens permanently when it reaches a set temperature, protecting against faults of the control and the switch.' },
    { term: 'Thermal time constant', also: ['time constant'], def: 'The time a body takes to cover about 63 % of the distance to its final temperature after a step in power. It is the thermal mass times the thermal resistance to the surroundings.' },
    { term: 'Proportional band', also: ['P band'], def: 'The range of temperature below the target over which the heater power rises from zero to full. Inside the band the duty is proportional to the gap.' }
  ],
  choose: {
    good: ['A MOSFET with a 1 to 10 s window for 12 and 24 V heaters', 'A zero-cross SSR with whole-cycle windows for mains heaters, fitted by a qualified person', 'A thermal fuse in series, whatever the controller'],
    avoid: ['PWM at kilohertz on a mains heater: an SSR cannot follow it and a relay dies', 'A control loop whose sensor is far from the heated thing', 'Heating with no protection independent of the program'],
    check: ['That a broken or shorted sensor switches the heater off', 'The window against the thermal time constant: ripple in °C', 'The ratings of connectors and wire at the heater current']
  },
  code: [
    {
      title: 'Hold a temperature with a window and a safety cut-out',
      about: 'A 10 kΩ NTC thermistor measures the temperature. Every 2 seconds a new window starts: the heater is on for a fraction of it, proportional to how far the temperature is below 40 °C. An absurd sensor value, or a temperature over 60 °C, switches the heater off for good until the board is reset. This does not replace a thermal fuse.',
      needs: 'An ESP32 DevKit, a 10 kΩ NTC (beta 3950) in a divider with 10 kΩ to 3.3 V, and a heater switched by a MOSFET (12 V mat, logic-level MOSFET as on [[switching-dc-loads]]) or an SSR input. Test with a small low-voltage heater.',
      wiring: [['GPIO34', 'divider midpoint', '3.3 V → 10 kΩ → midpoint → NTC → GND'], ['GPIO26', 'MOSFET gate through 220 Ω, with 10 kΩ gate to GND', 'or SSR DC input']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (26) to [LOW v]
          set pin (26) as [output v]
          set [fault v] to <false>
          set [duty v] to (0)
          set [window start v] to (milliseconds since start)

        forever
          if <((milliseconds since start) - (window start)) ≥ (2000)> then
            change [window start v] by (2000)
            set [t v] to (temperature of NTC on pin (34) in °C :: sensing)
            if <<(t) = [no reading]> or <(t) > (60)>> then
              set [fault v] to <true>
            end
            if <fault> then
              set [duty v] to (0)
            else
              set [duty v] to (map ((40) - (t)) from (0) (10) to (0) (1))
            end
            print (join [temperature ] (t))
          end
          if <<not <fault>> and <((milliseconds since start) - (window start)) < ((duty) * (2000))>> then
            set pin (26) to [HIGH v]
          else
            set pin (26) to [LOW v]
          end
        end
      `,
      cpp: String.raw`
        const int HEATER_PIN = 26;               // the gate of a MOSFET, or the input of an SSR
        const int NTC_PIN = 34;                  // ADC1: 3.3 V -> 10 k -> pin -> NTC 10 k -> GND
        const float SETPOINT = 40.0f;            // °C
        const float BAND = 10.0f;                // full power when 10 °C or more below the setpoint
        const float LIMIT = 60.0f;               // hard cut-out
        const uint32_t WINDOW_MS = 2000;

        bool fault = false;
        float duty = 0;                          // 0 … 1
        uint32_t windowStart = 0;

        float readTemperature() {                // °C, or NAN if the sensor is absurd
          float v = analogReadMilliVolts(NTC_PIN) / 1000.0f;
          if (v < 0.1f || v > 3.0f) return NAN;  // shorted or open (or colder than about -19 °C)
          float r = 10000.0f * v / (3.3f - v);   // resistance of the NTC
          float kelvin = 1.0f / (1.0f / 298.15f + logf(r / 10000.0f) / 3950.0f);   // beta equation, B = 3950
          return kelvin - 273.15f;
        }

        void setup() {
          Serial.begin(115200);
          digitalWrite(HEATER_PIN, LOW);         // off before the pin becomes an output
          pinMode(HEATER_PIN, OUTPUT);
        }

        void loop() {
          uint32_t now = millis();
          if (now - windowStart >= WINDOW_MS) {  // a new window: choose the on-time
            windowStart += WINDOW_MS;
            float t = readTemperature();
            if (isnan(t) || t > LIMIT) fault = true;     // latched until reset
            duty = fault ? 0.0f : constrain((SETPOINT - t) / BAND, 0.0f, 1.0f);
            Serial.printf("temperature %.1f C, power %.0f %%%s\n", t, duty * 100, fault ? ", FAULT" : "");
          }
          bool on = !fault && (now - windowStart) < duty * WINDOW_MS;
          digitalWrite(HEATER_PIN, on ? HIGH : LOW);
        }
      `,
      py: String.raw`
        from machine import Pin, ADC
        import time, math

        HEATER_PIN = 26                          # the gate of a MOSFET, or the input of an SSR
        NTC_PIN = 34                             # ADC1: 3.3 V -> 10 k -> pin -> NTC 10 k -> GND
        SETPOINT = 40.0                          # °C
        BAND = 10.0                              # full power when 10 °C or more below the setpoint
        LIMIT = 60.0                             # hard cut-out
        WINDOW_MS = 2000

        heater = Pin(HEATER_PIN, Pin.OUT, value=0)               # off as the pin becomes an output
        adc = ADC(Pin(NTC_PIN), atten=ADC.ATTN_11DB)

        def read_temperature():                  # °C, or None if the sensor is absurd
            v = adc.read_uv() / 1_000_000
            if v < 0.1 or v > 3.0:               # shorted or open (or colder than about -19 °C)
                return None
            r = 10000 * v / (3.3 - v)            # resistance of the NTC
            kelvin = 1 / (1 / 298.15 + math.log(r / 10000) / 3950)   # beta equation, B = 3950
            return kelvin - 273.15

        fault = False                            # latched until reset
        duty = 0.0                               # 0 … 1
        window_start = time.ticks_ms()

        while True:
            elapsed = time.ticks_diff(time.ticks_ms(), window_start)
            if elapsed >= WINDOW_MS:             # a new window: choose the on-time
                window_start = time.ticks_add(window_start, WINDOW_MS)
                elapsed = time.ticks_diff(time.ticks_ms(), window_start)
                t = read_temperature()
                if t is None or t > LIMIT:
                    fault = True
                duty = 0.0 if fault else min(1.0, max(0.0, (SETPOINT - t) / BAND))
                print("temperature", t, "power %.0f %%" % (duty * 100), "FAULT" if fault else "")
            heater.value(1 if (not fault and elapsed < duty * WINDOW_MS) else 0)
            time.sleep_ms(10)
      `,
      notes: ['The beta equation is accurate to about a degree near room temperature and worse far from it; calibrate against a reference thermometer, as on [[thermistors-and-ldrs]].', 'A proportional-only loop settles a little below the setpoint; add the integral term of a PID controller ([[pid-control]]) to remove the offset.', 'On a mechanical relay make WINDOW_MS 10 000 to 30 000 and the program will wear it far less.']
    }
  ],
  formulas: [
    {
      name: 'Time to heat a mass',
      expr: 't = m*c*dT/P',
      tex: 't = \\frac{m \\, c \\, \\Delta T}{P}',
      vars: {
        t: { name: 'heating time (no losses)', q: 'time', unit: 'min', tex: 't' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 1, tex: 'm' },
        c: { name: 'specific heat', q: 'specificheat', unit: 'J/(kg·K)', value: 4186, tex: 'c' },
        dT: { name: 'temperature rise', q: 'dtemp', unit: 'K', value: 40, tex: '\\Delta T' },
        P: { name: 'heater power', q: 'power', unit: 'W', value: 200, tex: 'P' }
      },
      solveFor: 't',
      note: 'The ideal time: all of the power heats the mass and nothing leaks away. Real systems need longer, because the load loses heat as it warms. Water is 4186 J/(kg·K); aluminium about 900.',
      stories: { t: 'A heater of {P} warms {m} of a material with specific heat {c} by {dT}. How long does it take, ignoring losses?', P: 'You want {m} of material (specific heat {c}) to warm by {dT} in {t}. How much heater power do you need?' }
    },
    {
      name: 'Power of a resistive heater',
      expr: 'P = V^2/R',
      tex: 'P = \\frac{V^{2}}{R}',
      vars: {
        P: { name: 'heater power', q: 'power', unit: 'W', tex: 'P' },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 12, tex: 'V' },
        R: { name: 'heater resistance', q: 'resistance', unit: 'Ω', value: 6, tex: 'R' }
      },
      solveFor: 'P',
      note: 'At the voltage the heater is made for. Halving the voltage quarters the power, which is why a heater is controlled by switching, not by lowering the voltage.',
      stories: { P: 'A heater of {R} runs on {V}. What power does it give?', R: 'A heater must give {P} from a {V} supply. What resistance should it have?' }
    }
  ],
  examples: [
    {
      title: 'A 24 V bed that is too slow',
      q: 'A 24 V heated bed has a resistance of 4 Ω and carries 0.5 kg of aluminium (specific heat 900 J/(kg·K)). How long does it take to warm by 60 K, ignoring losses, and what current does the MOSFET carry?',
      steps: [{ text: 'Power:', tex: 'P = 24^2/4 = 144\\,\\mathrm{W}' }, { text: 'Energy needed:', tex: 'E = 0.5 \\times 900 \\times 60 = 27\\,\\mathrm{kJ}' }, { text: 'Time:', tex: 't = 27\\,000 / 144 = 188\\,\\mathrm{s} \\approx 3\\,\\mathrm{min}' }, 'Current: 24 / 4 = 6 A, so the MOSFET, the wires and the connectors must be good for 6 A, and the MOSFET loss at 20 mΩ is 0.7 W.'],
      a: 'About three minutes with no losses, a little longer in practice; the MOSFET carries 6 A. A thermal fuse for the bed belongs in the circuit.'
    }
  ],
  quiz: [
    { q: 'Why does a heater need no PWM at kilohertz frequencies?', choices: ['The LEDC cannot go that low', 'Heaters need DC', 'MOSFETs cannot switch fast', 'Its thermal time constant is seconds or minutes, so the load averages slow switching'], a: 3, why: 'The temperature cannot follow a switching of milliseconds. A window of seconds gives the same average power with less switching loss, less noise and, for relays, less wear.' },
    { q: 'The NTC thermistor wire breaks, and the program\'s temperature reads very cold. What does a naive controller do?', choices: ['Applies full power for ever', 'Switches the heater off', 'Lowers the setpoint', 'Resets the ESP32'], a: 0, why: 'A broken sensor looks like a very cold one, so the controller sees a large gap to the setpoint and heats at full power. Detect absurd readings and switch the heater off.' },
    { q: 'How long to warm 1 kg of water by 40 K with a 200 W heater, with no losses?', choices: ['about 2 minutes', 'about 140 minutes', 'about 14 minutes', 'about 40 seconds'], a: 2, why: 'E = 1 × 4186 × 40 = 167 kJ; 167 440 J / 200 W = 837 s, about 14 minutes.' },
    { q: 'A thermostat written in the firmware protects a heater just as well as a thermal fuse in series with it.', a: false, why: 'The fuse sits in the heater circuit and opens by its own heat, so a frozen program, a stuck relay or a failed sensor do not stop it from acting. The firmware thermostat fails with any of them.' }
  ],
  applications: [
    'Heated beds and hot ends of 3D printers, with thermal-runaway checks in the firmware.',
    'Incubators, fermentation boxes and sous-vide cookers holding a temperature within a degree.',
    'Anti-condensation heaters for enclosures and cameras, switched by temperature and humidity.',
    'Reflow ovens and hot plates for soldering, following a temperature profile.'
  ],
  sources: [
    'Datasheets of NTC thermistors (resistance against temperature, beta value) and of the heating elements used.',
    'Marlin and Klipper firmware documentation, the pages on thermal runaway protection (a worked example of the safeguards).',
    'Espressif, *ESP-IDF Programming Guide*, ADC calibration and the Arduino core documentation for analogReadMilliVolts (core 3.3).'
  ],
  sim: 'oa-heater-window'
},

/* ================================================================ infrared-transmitters */
{
  id: 'infrared-transmitters',
  parent: 'outputs-and-actuators',
  title: 'Sending infrared',
  level: 2,
  short: 'An infrared LED blinks a code that a receiver module decodes: bursts of 38 kHz light, timed in hundreds of microseconds. The ESP32 can imitate a remote control — and needs a transistor, because the LED wants 100 mA.',
  keywords: ['infrared', 'IR LED', 'IR transmitter', '38 kHz', 'carrier', 'NEC protocol', 'remote control', 'IRremoteESP8266', 'RMT', 'mark and space', '940 nm', 'universal remote', 'TSOP', 'air conditioner remote'],
  prereq: ['infrared-remotes', 'the-rmt-peripheral', 'transistor-as-a-switch'],
  related: ['infrared-links', 'pwm-with-ledc', 'leds', 'driving-leds-with-pwm', 'mosfets-for-loads', 'esp-as-a-signal-generator', 'physics:em-spectrum'],
  body: `An infrared LED is an LED you cannot see: it shines at about 940 nm, just beyond red. A remote control blinks it in a code, and a small receiver module in the television decodes the code. An ESP32 can send the same codes: a "universal remote" that obeys a phone, a timer or a sensor.

### Carrier and code

A receiver module such as the TSOP family answers only to light that is blinking at its carrier frequency, usually **38 kHz**. Steady infrared from the sun and from lamps is ignored. So every **mark** of a code is a burst of 38 kHz at about one third duty, and every **space** is darkness. The code is the pattern of marks and spaces.

The very common NEC code, in a few lines: a leader of a 9 ms mark and a 4.5 ms space; then 32 bits, each a 560 µs mark followed by a space of 560 µs for a 0 or 1690 µs for a 1 — the code is carried by the *length of the spaces*; the bits are the address, its inverse, the command and its inverse, least significant bit first; and a final 560 µs mark. A frame lasts about 70 ms. Philips RC-5, Sony SIRC, Samsung and others use other timings and carriers (36 or 40 kHz), and an air-conditioner remote sends long frames of dozens of bytes that only a library knows.

### The LED and its current

An infrared LED drops about 1.2 to 1.5 V and a remote runs it at 50 to 100 mA in bursts: far more than a pin should give. Use a transistor or MOSFET ([[transistor-as-a-switch]]): pin to the base through 1 kΩ, the LED and a resistor from 5 V (or 3.3 V) to the collector, emitter to ground. The resistor follows from Ohm's law, as in the formula below. Because the LED is on only a third of the time within a burst, the average current is a third of the peak. Range is a matter of current, of aiming and of a narrow-angle LED.

### Generating the signal

The simplest way is the one in the program below: the LEDC makes the 38 kHz carrier, and the program switches its duty between one third and zero for the length of each mark and space. It works, but any interrupt (Wi-Fi) that delays a space can disturb a frame. The **RMT** peripheral ([[the-rmt-peripheral]]) can make the carrier and the exact timings in hardware with no CPU involvement, and ESP-IDF has an NEC example for it. Libraries such as IRremoteESP8266 and IRremote know hundreds of protocols and handle the details.

### Seeing the invisible

Many phone cameras show an infrared LED as a faint white-violet glow: a quick test that it blinks. Infrared is not radio and needs no licence, but the eye does not blink away from it: do not stare at a powerful emitter from close.

> [!key] Infrared remotes send marks of 38 kHz light separated by spaces, and the lengths carry the code. Drive the LED from a transistor, make the carrier with the LEDC or the RMT, and let a library handle the protocols you do not know.`,
  ideas: [
    'An infrared LED at 940 nm blinks bursts of a 38 kHz carrier; the receiver module ignores steady light.',
    'The NEC code is a 9 ms mark, a 4.5 ms space, then 32 bits of a 560 µs mark followed by a short or a long space.',
    'The LED wants 50 to 100 mA: switch it with a transistor, with a resistor from Ohm\'s law.',
    'The LEDC can make the carrier and the program the timing; the RMT does both in hardware with exact timing.'
  ],
  pitfalls: [
    'An IR LED can be driven from a pin like a normal LED — It runs at 50 to 100 mA in bursts, several times what a pin should supply. Use a transistor.',
    'The code is in the light, so the LED is simply on and off — The receiver wants bursts of 38 kHz; steady light, even at the right times, is filtered out as ambient light.',
    'All remotes use NEC — NEC is one of many. Other brands use other carriers, bit lengths and framings, and air conditioners send long state frames.'
  ],
  terms: [
    { term: 'Carrier frequency', also: ['38 kHz carrier', 'modulation frequency'], def: 'The frequency at which infrared light is blinked inside each burst, usually 38 kHz (36 or 40 kHz in some systems), so that receivers can tell a signal from steady ambient light.' },
    { term: 'Mark and space', also: ['burst and gap'], def: 'The two states of an infrared code: a mark is a burst of carrier (the LED blinking), a space is silence (the LED off). The lengths of marks and spaces carry the data.' },
    { term: 'NEC protocol', also: ['NEC code', 'NEC IR'], def: 'A widely used remote-control code: a 9 ms mark and 4.5 ms space, then 32 bits sent least significant bit first as an address, its inverse, a command and its inverse. A bit is a 560 µs mark followed by a 560 µs space for 0 or a 1690 µs space for 1.' },
    { term: 'Infrared LED', also: ['IR LED', 'IR emitter'], def: 'An LED that shines at about 850 to 950 nm, invisible to the eye and visible to most camera sensors. A remote-control LED has a forward voltage of about 1.2 to 1.5 V and takes tens of milliamps.' },
    { term: 'Pulse-distance coding', also: ['space-length coding'], def: 'A way of sending bits in which every bit has the same short mark and the information is the length of the space after it. NEC uses it.' }
  ],
  choose: {
    good: ['An IR LED on a transistor with the LEDC for the carrier, for a few simple codes', 'The RMT or a library such as IRremoteESP8266 for many protocols or timing that must be exact', 'A board with an IR LED built in, where the catalogue lists one (the M5Stack ATOM Lite has one on GPIO12)'],
    avoid: ['Driving a remote LED straight from a pin and expecting range', 'Sending codes from a program that Wi-Fi interrupts at the wrong moment', 'Guessing a brand\'s code: capture it with a receiver and check the timing'],
    check: ['The carrier and timing of the target device', 'That the LED current and the transistor match the LED datasheet', 'That the receiver sees the signal, with a phone camera for the LED and a receiver module on a pin for the code']
  },
  code: [
    {
      title: 'Send an NEC code',
      about: 'Sends the NEC code with address 0x00 and command 0x45 every two seconds: the LEDC makes the 38 kHz carrier with one third duty during each mark, and the program sets the lengths of marks and spaces. Point the LED at a receiver or a device that understands NEC.',
      needs: 'An ESP32 DevKit, an infrared LED (940 nm), an NPN transistor such as 2N2222 or BC337, a 1 kΩ base resistor and a resistor for the LED from the formula (about 33 Ω for 100 mA from 5 V). A board with an IR LED built in needs none of this.',
      wiring: [['GPIO4', '1 kΩ → base of the NPN'], ['5 V', '33 Ω → IR LED anode'], ['IR LED cathode', 'collector of the NPN'], ['emitter', 'GND']],
      blocks: `
        define mark (us) microseconds
          set PWM on pin (4) to (85)
          wait ((us) / (1000000)) seconds

        define space (us) microseconds
          set PWM on pin (4) to (0)
          wait ((us) / (1000000)) seconds

        define send byte (b)
          repeat for each [i v] in (list 0 to 7)
            mark (560) microseconds :: my
            space (if <(bit (i) of (b)) = (1)> then (1690) else (560)) microseconds :: my
          end

        define send NEC (address) (command)
          mark (9000) microseconds :: my
          space (4500) microseconds :: my
          send byte (address) :: my
          send byte (255 - address) :: my
          send byte (command) :: my
          send byte (255 - command) :: my
          mark (560) microseconds :: my
          space (0) microseconds :: my

        when started
          set PWM on pin (4) frequency (38000) resolution (8)
        forever
          send NEC (0) (69) :: my
          wait (2) seconds
        end
      `,
      cpp: String.raw`
        const int IR_PIN = 4;
        const int CARRIER_HZ = 38000;
        const int BITS = 8;
        const int MARK_DUTY = 85;                   // about 1/3 of 255: the usual duty of the carrier

        void mark(uint32_t us)  { ledcWrite(IR_PIN, MARK_DUTY); delayMicroseconds(us); }   // a burst of carrier
        void space(uint32_t us) { ledcWrite(IR_PIN, 0);         delayMicroseconds(us); }   // darkness

        void sendByte(uint8_t b) {                  // least significant bit first
          for (int i = 0; i < 8; i++) {
            mark(560);
            space(((b >> i) & 1) ? 1690 : 560);     // the space carries the bit
          }
        }

        void sendNec(uint8_t address, uint8_t command) {
          mark(9000); space(4500);                  // the leader
          sendByte(address);  sendByte(~address);
          sendByte(command);  sendByte(~command);
          mark(560);  space(0);                     // the closing mark
        }

        void setup() {
          ledcAttach(IR_PIN, CARRIER_HZ, BITS);
          ledcWrite(IR_PIN, 0);
        }

        void loop() {
          sendNec(0x00, 0x45);
          delay(2000);
        }
      `,
      py: String.raw`
        from machine import Pin, PWM
        import time

        IR_PIN = 4
        CARRIER_HZ = 38000
        MARK_DUTY = 65535 // 3                     # about 1/3: the usual duty of the carrier

        ir = PWM(Pin(IR_PIN), freq=CARRIER_HZ, duty_u16=0)

        def mark(us):                              # a burst of carrier
            ir.duty_u16(MARK_DUTY)
            time.sleep_us(us)

        def space(us):                             # darkness
            ir.duty_u16(0)
            time.sleep_us(us)

        def send_byte(b):                          # least significant bit first
            for i in range(8):
                mark(560)
                space(1690 if (b >> i) & 1 else 560)   # the space carries the bit

        def send_nec(address, command):
            mark(9000); space(4500)                # the leader
            send_byte(address);  send_byte(~address & 0xFF)
            send_byte(command);  send_byte(~command & 0xFF)
            mark(560);  space(0)                   # the closing mark

        while True:
            send_nec(0x00, 0x45)
            time.sleep(2)
      `,
      notes: ['The timing of this version is good to a few microseconds in C++ and looser in MicroPython, where every call costs time; receivers tolerate some error, but if a device ignores the code use the RMT peripheral.', 'To learn a code from a real remote, point it at a receiver module on a pin and time the pulses (see [[infrared-remotes]]); the NEC numbers above are standard, but many brands add their own twists.']
    }
  ],
  formulas: [
    {
      name: 'Series resistor for an IR LED on a transistor',
      expr: 'R = (Vs - Vf - Vce)/I',
      tex: 'R = \\frac{V_s - V_f - V_{CE}}{I}',
      vars: {
        R: { name: 'series resistor', q: 'resistance', unit: 'Ω', tex: 'R' },
        Vs: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_s' },
        Vf: { name: 'forward voltage of the IR LED', q: 'voltage', unit: 'V', value: 1.35, tex: 'V_f' },
        Vce: { name: 'saturation voltage of the transistor', q: 'voltage', unit: 'V', value: 0.2, tex: 'V_{CE}' },
        I: { name: 'LED current in a burst', q: 'current', unit: 'mA', value: 100, tex: 'I' }
      },
      solveFor: 'R',
      note: 'Use the peak current of the datasheet for pulsed operation: remote LEDs are rated for much more in short bursts than continuously. The average current in a burst of 38 kHz at one third duty is a third of I.',
      stories: { R: 'An IR LED ({Vf}) is switched by a transistor ({Vce}) from a {Vs} supply at {I} in a burst. What resistor does it need?' }
    }
  ],
  examples: [
    {
      title: 'How long is an NEC frame?',
      q: 'An NEC frame carries address 0x00 and command 0x45. How long does it last?',
      steps: ['The leader takes 9 ms + 4.5 ms = 13.5 ms.', 'The four bytes are 0x00, 0xFF, 0x45 and 0xBA: together 16 ones and 16 zeros? Count: 0x00 has 0 ones, 0xFF has 8, 0x45 (0100 0101) has 3, 0xBA (1011 1010) has 5: 16 ones and 16 zeros.', { text: 'A zero lasts 1.12 ms and a one 2.25 ms:', tex: '16 \\times 1.12 + 16 \\times 2.25 = 53.9\\,\\mathrm{ms}' }, 'Add the final mark of 0.56 ms.'],
      a: 'About 13.5 + 53.9 + 0.56 = 68 ms. Because every byte is followed by its inverse, every NEC frame has the same number of ones and zeros, so every frame is within a fraction of a millisecond of this length.'
    }
  ],
  quiz: [
    { q: 'Why does a remote control blink its LED at 38 kHz instead of switching it on and off once?', choices: ['The LED lasts longer', 'The receiver ignores steady light, such as sunlight, and answers only to light modulated at its carrier', 'The batteries last longer', '38 kHz carries more data'], a: 1, why: 'A receiver module has a band-pass filter at the carrier frequency. Steady infrared from the sun and from lamps is rejected, and only modulated bursts pass.' },
    { q: 'In the NEC code, what distinguishes a 1 from a 0?', choices: ['The length of the mark', 'The carrier frequency', 'The brightness', 'The length of the space after the mark'], a: 3, why: 'Every bit begins with the same 560 µs mark; a space of 560 µs means 0 and one of 1690 µs means 1. NEC is a pulse-distance code.' },
    { q: 'An IR LED needs about 100 mA in bursts. How should an ESP32 drive it?', choices: ['Through a transistor or MOSFET with a series resistor', 'Straight from a GPIO', 'From the 3.3 V pin without a resistor', 'Through the DAC'], a: 0, why: 'A pin should give a few milliamps; 100 mA needs a switch. The transistor carries the current and the resistor sets it.' },
    { q: 'You send an NEC code from a program that also runs Wi-Fi. What can go wrong?', choices: ['Nothing: Wi-Fi never delays code', 'The carrier goes to 40 kHz', 'An interrupt can stretch a space and corrupt the frame; the RMT peripheral avoids it by timing in hardware', 'The LED overheats'], a: 2, why: 'With timed code in the program, the work of the Wi-Fi stack can delay a delay. The RMT peripheral produces carrier and timings in hardware, whatever the CPU is doing.' }
  ],
  applications: [
    'A universal remote that turns a television on from a phone or a timer.',
    'Home-automation bridges that control air conditioners, fans and audio equipment.',
    'Learning remotes that record a code with a receiver module and replay it.',
    'Beacons and simple short-range links for robots, where each robot sends an identifying code.'
  ],
  sources: [
    'The NEC infrared transmission protocol, as published in the datasheets of NEC remote-control transmitter ICs.',
    'Datasheets of infrared LEDs (forward voltage, peak current in pulses) and of the TSOP-type receiver modules.',
    'Espressif, *ESP-IDF Programming Guide*, Remote Control Transceiver (RMT) and its NEC example.'
  ],
  sim: 'oa-ir-burst'
}
);
