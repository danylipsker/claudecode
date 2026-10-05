/* HYPER-ESP32 · content/program-structure.js
 *
 * Topic "A program, three ways" (program-structure, branch programming): the ideas of programming itself, each shown
 * in blocks, Arduino C++ and MicroPython side by side. The hardware is kept trivial (the on-board LED on GPIO2, the
 * BOOT button on GPIO0, the serial monitor, sometimes a potentiometer on GPIO34) so that the programming idea stands out.
 */
Hyper.add(
/* ================================================================ setup and loop, main, "when started" */
{
  id: 'setup-loop-and-main',
  parent: 'program-structure',
  title: 'setup and loop, main, "when started"',
  level: 1,
  short: 'Every program for a microcontroller has one shape: prepare things once, then go round for ever. Blocks call it "when started" and "forever", Arduino C++ calls it setup() and loop(), MicroPython is a while True loop you write yourself.',
  keywords: ['setup', 'loop', 'main', 'app_main', 'when started', 'forever', 'while True', 'entry point', 'boot.py', 'main.py', 'loopTask', 'sketch structure', 'program shape', 'REPL'],
  prereq: ['first-program-blink', 'choosing-a-framework'],
  related: ['variables-and-types', 'non-blocking-timing', 'the-loop-task-and-two-cores', 'block-programming-tools', 'micropython-setup', 'arduino-ide-and-the-esp32-core', 'esp-idf-basics'],
  body: `A microcontroller has no desktop, no window and no "run" button. When power arrives it starts one program at its first instruction, and that program never ends: if it did, nothing would be left to run. Every program for these chips is therefore built the same way — a short part that prepares things **once**, and a long part that goes round **for ever**. This app shows every idea three ways, and the three spell that shape differently.

### The same shape, three spellings

| | Once, at the start | For ever |
|---|---|---|
| Blocks | the hat *when started* | the block *forever* |
| Arduino C++ | the function \`setup()\` | the function \`loop()\` |
| MicroPython | the lines before the loop | \`while True:\` |

In blocks you snap pieces under a hat; there is no punctuation to get wrong and no way to forget where the loop ends, which is why blocks are a good first view of structure. In C++ you write two functions and the core calls them for you. In MicroPython you write the loop yourself — and when the file reaches its last line the program is simply over, and the chip drops back to the prompt (the *REPL*). It is not stuck; it has nothing left to do.

### What happens before your first line

A small program in the chip's ROM chooses what to start, a bootloader in flash checks and loads your application, and the system sets up memory, clocks and the operating system inside ([[the-rom-bootloader]]). In the Arduino core the real entry point is hidden: it creates a task called \`loopTask\` (see [[tasks]]) that calls \`setup()\` once and then calls \`loop()\` again and again. In ESP-IDF you write the entry point yourself, \`app_main()\`, and the loop is yours. MicroPython runs \`boot.py\`, then \`main.py\`, then waits at the prompt.

### What survives, and what does not

Between two passes of \`loop()\`, variables declared **outside** every function (globals) keep their values; variables declared **inside** are made fresh on each pass — a counter declared inside \`loop()\` is born as zero every time and never gets past one. After a reset (a button, a crash, the watchdog, a power cut) nothing survives except what was saved on purpose ([[nvs-and-preferences]], [[rtc-memory]]). So the first lines of the "once" part give every variable a known starting value: never rely on what memory held before.

### Rules of thumb

- Put what happens once — pin modes, starting serial, mounting files, connecting — in the "once" part.
- Keep the loop quick. It is called thousands of times a second, and a \`delay()\` inside it freezes everything else ([[non-blocking-timing]]).
- Events — a pin changing, a packet arriving — can start their own short scripts: *when pin goes low* in blocks, an interrupt handler in C++ and MicroPython ([[interrupts]]).

> [!key] Every program is "prepare once, then repeat for ever": setup() and loop() in Arduino C++, the lines before while True in MicroPython, when started and forever in blocks. Globals live as long as the program runs; a reset starts everything again from nothing.`,
  ideas: [
    'A microcontroller program never ends: it prepares once and then loops for ever; the three notations differ only in how they write that.',
    'In the Arduino core a hidden task calls setup() once and then loop() over and over; in MicroPython you write the loop; in blocks it is the forever block.',
    'Variables outside every function survive from one pass of the loop to the next; variables inside are created again each pass.',
    'A reset wipes the variables: only what was saved on purpose survives.'
  ],
  pitfalls: [
    'setup() runs again after each pass of loop() — It runs once. Only loop() repeats. Put a counter that must grow outside both functions, or it restarts at zero.',
    'A MicroPython program without a while loop keeps running — It ends at its last line and the chip waits at the prompt. A sensor reader that "stops after one reading" is usually a missing loop.',
    'main() is where every program starts — In the Arduino core you never see it. The core\'s own entry point calls your setup() and loop(); only in ESP-IDF do you write app_main() yourself.'
  ],
  terms: [
    { term: 'setup()', also: ['setup function'], def: 'The Arduino function the core calls once, after power-on or reset, before the first loop(). It holds the preparation: pin modes, starting serial, connecting.' },
    { term: 'loop()', also: ['loop function', 'main loop'], def: 'The Arduino function the core calls again and again for as long as the chip runs. Its local variables are made anew on each call; globals keep their values.' },
    { term: 'Entry point', also: ['app_main', 'main'], def: 'The function where a program starts. In ESP-IDF it is app_main(); in the Arduino core it is hidden and calls setup() and loop() for you; in MicroPython it is the first line of main.py.' },
    { term: 'Hat block', also: ['event block', 'when started'], def: 'A rounded block that starts a script when something happens: when started, when a pin goes low, every 5 seconds. Everything snapped beneath it runs when the event occurs.' },
    { term: 'REPL', also: ['read-eval-print loop', 'prompt', '>>>'], def: 'The interactive prompt of MicroPython on the serial port: type a line, it runs at once. A program that reaches its last line leaves the chip waiting at the REPL.' }
  ],
  code: [
    {
      title: 'Count the passes of the loop',
      about: 'The smallest program that shows the shape: set a few variables up once, then count every pass of the loop, flip the LED and print the count twice a second.',
      needs: 'An ESP32 DevKit (the LED on GPIO2) and the serial monitor at 115200 baud.',
      wiring: [['GPIO2', 'the on-board LED', 'or: GPIO2 → 220 Ω → LED → GND'], ['USB', 'computer', 'for the serial monitor']],
      blocks: `
        when started                            // once, after power-on or reset
          start serial at (115200) baud
          set pin (2) as [output v]
          set [count v] to (0)                  // a variable that lives as long as the program runs
          set [ledOn v] to <false>
        forever                                 // for ever
          change [count v] by (1)
          set [ledOn v] to <not <ledOn>>
          set pin (2) to (ledOn)
          print (count)
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        const int LED_PIN = 2;

        int count;                       // a variable that lives as long as the program runs
        bool ledOn;

        void setup() {                   // once, after power-on or reset
          Serial.begin(115200);
          pinMode(LED_PIN, OUTPUT);
          count = 0;
          ledOn = false;
        }

        void loop() {                    // for ever
          count++;
          ledOn = !ledOn;
          digitalWrite(LED_PIN, ledOn);
          Serial.println(count);
          delay(500);
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        LED_PIN = 2

        # once, after power-on or reset
        # (print() already goes to the USB serial port: nothing to start)
        led = Pin(LED_PIN, Pin.OUT)
        count = 0                        # a variable that lives as long as the program runs
        ledOn = False

        while True:                      # for ever
            count += 1
            ledOn = not ledOn
            led.value(ledOn)
            print(count)
            time.sleep_ms(500)
      `,
      idf: String.raw`
        #include <stdio.h>
        #include "freertos/FreeRTOS.h"
        #include "freertos/task.h"
        #include "driver/gpio.h"

        #define LED_PIN GPIO_NUM_2

        void app_main(void) {            // the entry point: here nothing calls setup() for you
          gpio_reset_pin(LED_PIN);
          gpio_set_direction(LED_PIN, GPIO_MODE_OUTPUT);   // once
          int count = 0;
          int ledOn = 0;

          while (1) {                    // for ever
            count++;
            ledOn = !ledOn;
            gpio_set_level(LED_PIN, ledOn);
            printf("%d\n", count);
            vTaskDelay(pdMS_TO_TICKS(500));
          }
        }
      `,
      output: `
        1
        2
        3
        4
        …
      `,
      notes: ['The ESP-IDF version has no setup() and loop(): app_main() is the whole program, and the while loop is yours. The Arduino core wraps exactly this pattern for you.', 'Move `int count = 0;` inside loop() and the program prints 1 for ever: a local variable is made again on every pass.', 'On an ESP32-S3, C3 or C6 board the LED is an RGB LED on another pin: see the first-program page.']
    }
  ],
  quiz: [
    { q: 'A sketch declares `int count = 0;` as the first line **inside** `loop()` and does `count++; Serial.println(count);`. What does it print?', choices: ['1, 2, 3, 4 …', '1 for ever', '0 for ever', 'Nothing: it does not compile'], a: 1, why: 'A variable declared inside a function is created again, with the value 0, on every call. loop() is called again and again, so the count never gets past 1. Declare it outside (a global) to make it live as long as the program.' },
    { q: 'A MicroPython `main.py` sets up a pin, reads a sensor once and prints it — with no `while True`. What does the chip do afterwards?', choices: ['Reboots and runs it again', 'Crashes with an error', 'Waits at the prompt: the program is finished', 'Repeats the last line'], a: 2, why: 'MicroPython runs the file from top to bottom once. When the last line is done the program is over and the board waits at the REPL. To repeat, you write the loop yourself.' },
    { q: 'In the Arduino core, `setup()` runs again at the start of every pass of `loop()`.', a: false, why: 'setup() is called once, then loop() is called repeatedly. Only a reset (or a crash that reboots the chip) makes setup() run again.' },
    { q: 'Which of these is still there after the board is reset?', choices: ['A global variable', 'A local variable of loop()', 'A number saved with Preferences (flash)', 'The state of the pins'], a: 2, why: 'A reset restarts the program and wipes the variables and the pin state. Only what was written to flash or to a protected memory on purpose survives.' }
  ],
  applications: [
    'Every sketch and every MicroPython main.py in this app has this shape; the first thing to look for in unfamiliar code is where the "once" part ends and the loop begins.',
    'Block tools such as UIFlow, MicroBlocks and Scratch-style editors start a script from a hat block and usually put a forever block under it.',
    'A reset-and-recover design (the watchdog restarts a stuck loop) relies on setup() building a clean state each time.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "Application Startup Flow": what runs between the reset and app_main().',
    'Arduino Language Reference, *setup()* and *loop()*; Arduino-ESP32 documentation for the sketch structure on the ESP32 core (3.3).',
    'MicroPython documentation, *Quick reference for the ESP32* and the getting-started tutorial: boot.py, main.py and the REPL (version 1.29).'
  ],
  sim: 'ps-program-counter'
},

/* ================================================================ variables and types */
{
  id: 'variables-and-types',
  parent: 'program-structure',
  title: 'Variables and types',
  level: 1,
  short: 'A variable is a named box in memory. In C++ the box has a fixed size you choose, and a number can overflow it; in Python the name just points at a value that can grow. Knowing the difference saves hours of strange bugs.',
  keywords: ['variable', 'type', 'int', 'uint8_t', 'uint32_t', 'float', 'bool', 'overflow', 'wrap-around', 'integer division', 'const', 'scope', 'global', 'local', 'byte', 'size of int'],
  prereq: ['setup-loop-and-main', 'the-serial-monitor'],
  related: ['bits-and-bytes', 'strings-and-text', 'the-esp-adc', 'memory-map', 'non-blocking-timing', 'stack-heap-and-static'],
  body: `A variable is a name for a place in memory that holds one value the program can change. Picture a box with a label: the label is the name (\`count\`), what lies inside is the value — and the box has a **size**, fixed when it was made. The size, together with how the bits inside are read (a whole number? a fraction? a letter?), is the variable's **type**. Blocks hide all this; C++ makes you choose; Python chooses for you at run time.

### The types of C++ on an ESP32

| Type | Bytes | Holds | Range |
|---|---|---|---|
| \`bool\` | 1 | true or false | 0 or 1 |
| \`uint8_t\` (\`byte\`) | 1 | whole number, no sign | 0 … 255 |
| \`int8_t\` | 1 | whole number with sign | −128 … 127 |
| \`uint16_t\` | 2 | whole number, no sign | 0 … 65 535 |
| \`int16_t\` | 2 | whole number with sign | −32 768 … 32 767 |
| \`int\`, \`int32_t\` | 4 | whole number with sign | about ±2.1 billion |
| \`uint32_t\` | 4 | whole number, no sign | 0 … 4 294 967 295 |
| \`float\` | 4 | fraction | about 7 significant digits |
| \`double\` | 8 | fraction | about 15 digits, slower |

An \`int\` is 32 bits here but only 16 on an Arduino Uno, so old tutorials that say "an int counts to 32 767" describe another chip. Write \`uint8_t\`, \`int16_t\` or \`uint32_t\` when the size matters. The ESP32 and ESP32-S3 have hardware for \`float\` only; the C3 has none, so every fraction is slow there, and \`double\` is slower still.

Python has no declarations: a name is attached to a value (\`count = 0\`) and may later be attached to a text. Its \`int\` has no size limit — it grows until memory runs out.

### Overflow: the box is full

Add 1 to a \`uint8_t\` holding 255 and you get **0**: only eight bits fit, the carry falls off the end. An \`int16_t\` goes from 32 767 to −32 768. (Signed overflow is officially "undefined" in C++; on these chips it wraps, but do not rely on it.) The same thing makes \`millis()\` return to zero after 49.7 days ([[non-blocking-timing]]). Python never wraps — at the price of a variable whose size you do not control. The simulation below counts through the limits.

### Division and mixed types

In C++, two integers divided give an integer: \`7 / 2\` is 3 and \`raw / 4095\` is 0 for any reading below full scale. Multiply first (\`raw * 100 / 4095\`) or make one side a fraction (\`raw / 4095.0\`). In Python \`/\` always gives a fraction (3.5) and \`//\` drops it (3).

### Scope and constants

A variable made inside a function lives only during that call; one made outside lives as long as the program. Mark values that must not change \`const\` — the compiler then refuses to let you overwrite them. Python has no constants: by custom a name in CAPITALS is not to be changed.

> [!key] In C++ a variable is a box of fixed size: choose the smallest type that holds the largest value it will ever see, and expect silent wrap-around beyond it. In Python the name moves freely and integers never overflow; in both, integer division throws the fraction away.`,
  ideas: [
    'A C++ variable has a type that fixes its size and its range; a Python name simply refers to a value of any size.',
    'A C++ integer that passes its limit wraps around silently: a uint8_t goes from 255 to 0, an int16_t from 32 767 to −32 768.',
    'Dividing two integers in C++ throws away the fraction; make one side a float, or multiply first.',
    'Variables inside a function are born fresh on every call; globals live as long as the program.'
  ],
  pitfalls: [
    'int always holds a number up to 32 767 — That is true of an Arduino Uno. On the ESP32 an int is 32 bits and reaches about 2.1 billion; the size of a type depends on the chip.',
    'The program will tell me when a number gets too big — It will not. C++ wraps around without any message; the first sign is a counter that jumps back to zero or goes negative.',
    'raw / 4095 * 100 gives a percentage — With integers it gives 0 until raw reaches 4095, because raw / 4095 is zero first. Multiply before dividing.'
  ],
  terms: [
    { term: 'Variable', also: ['name', 'identifier'], def: 'A name for a place in memory that holds a value the program can read and change.' },
    { term: 'Data type', also: ['type', 'int', 'float', 'bool'], def: 'What a variable may hold and how many bytes it takes: a whole number of a given size, a fraction, true or false, a character. C++ fixes it when the variable is declared; Python lets the value decide.' },
    { term: 'Integer overflow', also: ['wrap-around', 'rollover'], def: 'What happens when a whole-number calculation exceeds the size of its variable: the extra bits are lost and the value wraps to the other end of the range.' },
    { term: 'Integer division', also: ['truncating division'], def: 'Division of two whole numbers in C++ gives a whole number and drops the remainder: 7 / 2 is 3. In Python the // operator does the same; / gives a fraction.' },
    { term: 'Constant', also: ['const', '#define'], def: 'A named value that must not change. In C++ \`const\` makes the compiler enforce it; Python has no constants and uses CAPITALS by convention.' },
    { term: 'Scope', also: ['local variable', 'global variable'], def: 'The part of the program in which a name exists. A local variable lives inside one function call; a global lives as long as the program runs.' }
  ],
  code: [
    {
      title: 'The box that overflows',
      about: 'Start a counter at 250 and add 1 ten times. The C++ box is 8 bits wide, so it wraps; the Python integer just grows. The two versions are meant to differ.',
      needs: 'An ESP32 DevKit and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          set [level v] to (250)                // blocks: numbers have no box size
          repeat (10)
            change [level v] by (1)
            print (level)
          end
      `,
      cpp: String.raw`
        void setup() {
          Serial.begin(115200);
          uint8_t level = 250;             // a box of 8 bits: it holds 0 to 255
          for (int n = 0; n < 10; n++) {   // repeat (10)
            level++;
            Serial.println(level);
          }
        }

        void loop() {}
      `,
      py: String.raw`
        # (print() already goes to the USB serial port: nothing to start)
        level = 250                        # no box size: a Python integer simply grows
        for n in range(10):                # repeat (10)
            level += 1
            print(level)
      `,
      output: `
        Arduino C++:   251 252 253 254 255 0 1 2 3 4
        MicroPython:   251 252 253 254 255 256 257 258 259 260
      `,
      notes: ['Change `uint8_t` to `int8_t` and start at 125: the C++ counter goes to 127 and then to −128.', 'Blocks follow the language of the tool behind them: in a tool built on MicroPython the numbers grow like Python\'s, in one built on C++ they may wrap.']
    },
    {
      title: 'A potentiometer in the right types',
      about: 'Reads a potentiometer and prints the raw count, a whole percentage and the voltage. Each number gets the type that suits it, and the arithmetic is ordered so that no fraction is lost.',
      needs: 'An ESP32 DevKit and a potentiometer: outer legs to 3V3 and GND, the wiper to GPIO34 (an input-only ADC1 pin).',
      wiring: [['GPIO34', 'potentiometer wiper', 'ends of the potentiometer to 3V3 and GND'], ['USB', 'computer', 'for the serial monitor']],
      blocks: `
        when started
          start serial at (115200) baud
        forever
          set [raw v] to (analog read pin (34))                       // 0 to 4095: 12 bits
          set [millivolts v] to (analog read pin (34) in millivolts)  // a whole number of millivolts
          set [percent v] to (((raw) * (100)) / (4095))               // multiply first: a whole percent
          set [volts v] to ((millivolts) / (1000))                    // 1000.0, not 1000: a number with a fraction
          print (format [raw=%d  percent=%d  volts=%.2f] with (raw) (percent) (volts))
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        const int POT_PIN = 34;

        void setup() {
          Serial.begin(115200);
        }

        void loop() {
          int raw = analogRead(POT_PIN);                    // 0 to 4095: 12 bits
          int millivolts = analogReadMilliVolts(POT_PIN);   // a whole number of millivolts
          int percent = raw * 100 / 4095;                   // multiply first: a whole percent
          float volts = millivolts / 1000.0;                // 1000.0, not 1000: a number with a fraction
          Serial.printf("raw=%d  percent=%d  volts=%.2f\n", raw, percent, volts);
          delay(500);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        POT_PIN = 34

        adc = ADC(Pin(POT_PIN), atten=ADC.ATTN_11DB)

        while True:
            raw = adc.read_u16() // 16                      # 0 to 4095: 12 bits (read_u16 gives 0 to 65535)
            millivolts = adc.read_uv() // 1000              # a whole number of millivolts
            percent = raw * 100 // 4095                     # multiply first: a whole percent
            volts = millivolts / 1000                       # 1000.0, not 1000: a number with a fraction
            print("raw=%d  percent=%d  volts=%.2f" % (raw, percent, volts))
            time.sleep_ms(500)
      `,
      output: `
        raw=2210  percent=53  volts=1.78
      `,
      notes: ['The numbers are for a potentiometer at mid-travel; yours will wobble by a few counts.', 'In Python `/` always gives a fraction, so `1000` and `1000.0` are the same there; the comment matters only in C++ and in blocks tools built on it.', 'The volts come from the calibrated reading; the raw count is not exactly proportional to the voltage ([[the-esp-adc]]).']
    }
  ],
  examples: [
    {
      title: 'How long until the counter wraps?',
      q: 'A program counts events in a `uint16_t` and one event arrives every 20 ms. After how long does the counter wrap to zero?',
      steps: ['A uint16_t holds 0 … 65 535, so it wraps on the 65 536th event.', 'That takes $65\\,536 \\times 20\\ \\text{ms} = 1\\,310\\,720$ ms.', 'In minutes: $1\\,310\\,720 / 60\\,000 \\approx 21.8$ minutes.'],
      a: 'About 22 minutes. A uint32_t would last 65 536 times longer: nearly three years at this rate.'
    }
  ],
  quiz: [
    { q: 'A `uint8_t` variable holds 255 and the program adds 1. What does the variable hold afterwards?', choices: ['256', '0', '255', '−1'], a: 1, why: 'Eight bits cannot hold 256: the carry is lost and the value wraps to 0. A signed int8_t would go from 127 to −128 in the same way.' },
    { q: 'On an ESP32, `int percent = raw / 4095 * 100;` with `raw = 2048`. What is `percent`?', choices: ['50', '0', '49', '100'], a: 1, why: 'raw / 4095 is a division of two integers: 2048 / 4095 is 0 with the fraction dropped. Then 0 * 100 is 0. Multiply first: raw * 100 / 4095 gives 50.' },
    { q: 'Python integers wrap around at 255, just like C++ `uint8_t`.', a: false, why: 'A Python int has no fixed size. 255 + 1 is 256, and it keeps growing until memory is exhausted. To imitate a byte you must mask it: (x + 1) & 0xFF.' },
    { q: 'Why is `int` a poor choice for a variable that must hold 100 000 in a program that also runs on an Arduino Uno?', choices: ['An int cannot be positive', 'An int on the Uno is 16 bits and tops out at 32 767', 'An int is a text', 'It is fine on every board'], a: 1, why: 'The size of int depends on the chip: 32 bits on the ESP32, 16 on the Uno. Using int32_t says what you mean and behaves the same everywhere.' }
  ],
  applications: [
    'A flash counter (how many times a button was pressed) needs a type chosen for how high it can ever count.',
    'Sensor registers are whole numbers of a fixed width: reading them into the matching type is the first step of every driver ([[bits-and-bytes]]).',
    'Timestamps from millis() are uint32_t; storing one in an int is a classic bug that appears only after 24.9 days.'
  ],
  sources: [
    'Arduino Language Reference, "Data types": the integer, float and boolean types and their ranges.',
    'The Python Language Reference and MicroPython documentation, "MicroPython differences from CPython" (integers, floats, strings).',
    'Espressif, *ESP32 Series Datasheet* (the processor and floating-point unit of each chip).'
  ],
  sim: 'ps-variable-box'
},

/* ================================================================ conditions and loops */
{
  id: 'conditions-and-loops',
  parent: 'program-structure',
  title: 'Conditions and loops',
  level: 1,
  short: 'A program decides with if and else, and repeats with for and while. The ideas are the same in blocks, C++ and Python; the punctuation and a few traps differ.',
  keywords: ['if', 'else', 'else if', 'elif', 'for', 'while', 'repeat', 'break', 'continue', 'condition', 'comparison', '==', '&&', 'and', 'or', 'not', 'indentation', 'braces', 'truthy', 'flow'],
  prereq: ['variables-and-types', 'first-program-blink'],
  related: ['functions', 'non-blocking-timing', 'state-machine-in-code', 'digital-input', 'readable-code'],
  body: `A program that does the same thing every time is a light that blinks. The moment it must react — to a button, to a temperature — it needs two tools: a **condition** that chooses between actions, and a **loop** that repeats one. Every program is built from these two and from plain steps in order; the shapes below are the same in all three notations.

### Choosing: if, else if, else

A condition is a question with a yes-or-no answer: *is the button pressed? is the temperature above 30?* The program takes one branch or the other.

| | Blocks | Arduino C++ | MicroPython |
|---|---|---|---|
| Test | \`if <…> then\` … \`else\` … \`end\` | \`if (…) { … } else { … }\` | \`if …: … else: …\` |
| Chain | \`else if <…> then\` | \`else if (…)\` | \`elif …:\` |
| And, or, not | \`<<a> and <b>>\` | \`a && b\`, \`a \\|\\| b\`, \`!a\` | \`a and b\`, \`a or b\`, \`not a\` |
| Equal to | \`<(x) = (3)>\` | \`x == 3\` | \`x == 3\` |

The classic trap is one character: in C++ \`if (x = 3)\` is *legal*: it puts 3 into x and then treats the 3 as "true". Python refuses to compile the same slip. Comparing two floats with \`==\` is the other: 0.1 + 0.2 is not exactly 0.3, so compare with a margin.

### Repeating: for, while, repeat

- **Repeat a known number of times:** \`repeat (5)\` in blocks, \`for (int i = 0; i < 5; i++)\` in C++, \`for i in range(5):\` in Python. The C++ form packs three things into one line: where to start, when to stop, how to step.
- **Repeat while something is true:** \`while <…>\` in blocks and C++, \`while …:\` in Python. It tests *before* each round, so it may run zero times.
- **Leave early:** \`break\` leaves the loop; \`continue\` skips to the next round.

The loop that never ends is not a bug here: \`forever\`, \`loop()\` and \`while True:\` are the shape of the whole program ([[setup-loop-and-main]]). The bug is a *small* loop that never ends — \`while (digitalRead(0) == LOW) {}\` waits for a button release, and if the button sticks, so does the program. Give such waits a time limit ([[non-blocking-timing]]).

### Indentation: syntax or decoration

In Python the indentation **is** the structure: the lines indented under \`if\` belong to it, and a wrong space count changes the meaning or raises an error. In C++ the braces are the structure and the indentation is for the eye alone — a mis-indented block compiles fine and misleads the reader. Blocks have neither problem: a C-shaped block visibly wraps what it contains.

### Truth in C++ and Python

C++ treats any non-zero number as true. Python also treats 0, an empty text, an empty list and \`None\` as false. Write the comparison out (\`if x != 0\`) when the reader should not have to know.

> [!key] A condition chooses a branch, a loop repeats a part; both read the same in all three notations, but beware = against == in C++, floats compared with ==, and small loops that wait for something that may never happen. Python's indentation is its syntax; C++ uses braces and blocks cannot be mis-nested.`,
  ideas: [
    'if / else if / else choose one branch; for, while and repeat run a part again.',
    'C++ uses braces and semicolons, Python uses a colon and indentation, blocks use C-shaped pieces; the logic is identical.',
    'In C++ one = is an assignment and two == a comparison; the slip compiles and does the wrong thing.',
    'A small loop that waits for an event must have a way out, or one stuck input freezes the program.'
  ],
  pitfalls: [
    'if (x = 3) tests whether x is 3 — It stores 3 in x and then takes the branch because 3 is non-zero. Use ==. Python rejects the slip, C++ does not.',
    'while loops run at least once — A while tests first and may never run; a do … while in C++ tests last. A for loop with its end already passed also runs zero times.',
    'A condition on a float with == is safe — Fractions are stored approximately: 0.1 + 0.2 differs from 0.3 by a tiny amount. Test whether the difference is small.'
  ],
  terms: [
    { term: 'Condition', also: ['boolean expression', 'test'], def: 'An expression that is either true or false — a comparison such as temperature > 30, or a combination of them with and, or, not.' },
    { term: 'Branch', also: ['if statement', 'conditional'], def: 'A point where the program takes one path or another depending on a condition: if, else if, else.' },
    { term: 'Loop', also: ['for loop', 'while loop', 'repeat'], def: 'A part of the program that runs again and again: a fixed number of times (for, repeat) or as long as a condition holds (while).' },
    { term: 'Boolean', also: ['bool', 'true and false'], def: 'A value that is either true or false. Comparisons produce booleans; and, or and not combine them.' },
    { term: 'Indentation', also: ['block structure'], def: 'The spaces at the start of a line. In Python they define which lines belong to an if, a loop or a function; in C++ they are only for the reader, and braces do the work.' }
  ],
  code: [
    {
      title: 'Three zones of a potentiometer',
      about: 'Reads a potentiometer and says low, middle or high. The LED lights in the high zone. One chain of if, else if and else picks exactly one branch.',
      needs: 'An ESP32 DevKit, a potentiometer on GPIO34 (ends to 3V3 and GND) and the serial monitor.',
      wiring: [['GPIO34', 'potentiometer wiper', 'ends to 3V3 and GND'], ['GPIO2', 'the on-board LED']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (2) as [output v]
        forever
          set [raw v] to (analog read pin (34))     // 0 to 4095
          if <(raw) < (1365)> then                  // the lower third
            print [low]
            set pin (2) to [LOW v]
          else if <(raw) < (2730)> then             // the middle third
            print [middle]
            set pin (2) to [LOW v]
          else                                      // the upper third
            print [high]
            set pin (2) to [HIGH v]
          end
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        const int POT_PIN = 34;
        const int LED_PIN = 2;

        void setup() {
          Serial.begin(115200);
          pinMode(LED_PIN, OUTPUT);
        }

        void loop() {
          int raw = analogRead(POT_PIN);            // 0 to 4095
          if (raw < 1365) {                         // the lower third
            Serial.println("low");
            digitalWrite(LED_PIN, LOW);
          } else if (raw < 2730) {                  // the middle third
            Serial.println("middle");
            digitalWrite(LED_PIN, LOW);
          } else {                                  // the upper third
            Serial.println("high");
            digitalWrite(LED_PIN, HIGH);
          }
          delay(500);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        POT_PIN = 34
        LED_PIN = 2

        adc = ADC(Pin(POT_PIN), atten=ADC.ATTN_11DB)
        led = Pin(LED_PIN, Pin.OUT)

        while True:
            raw = adc.read_u16() // 16              # 0 to 4095
            if raw < 1365:                          # the lower third
                print("low")
                led.value(0)
            elif raw < 2730:                        # the middle third
                print("middle")
                led.value(0)
            else:                                   # the upper third
                print("high")
                led.value(1)
            time.sleep_ms(500)
      `,
      output: `
        low
        low
        middle
        high
      `,
      notes: ['The thresholds are a third of 4095 each. The same chain written with two separate `if` statements would also work here, but then two branches could run at once; `else if` guarantees exactly one.']
    },
    {
      title: 'Blink three times when BOOT is pressed',
      about: 'A for loop counts three blinks; a while loop then waits until the button is released, so one long press gives one burst.',
      needs: 'An ESP32 DevKit: the BOOT button is on GPIO0 and the LED on GPIO2. On a C3 or C6 board use GPIO9 for the button.',
      wiring: [['GPIO0', 'the BOOT button to GND', 'already on the board'], ['GPIO2', 'the on-board LED']],
      blocks: `
        when started
          set pin (0) as [input with pull-up v]
          set pin (2) as [output v]
        forever
          if <(read pin (0)) = [LOW v]> then       // BOOT pressed: the button connects the pin to ground
            repeat (3)
              set pin (2) to [HIGH v]
              wait (0.2) seconds
              set pin (2) to [LOW v]
              wait (0.2) seconds
            end
            while <(read pin (0)) = [LOW v]>       // wait for the release
              wait (0.01) seconds
            end
          end
        end
      `,
      cpp: String.raw`
        const int BUTTON_PIN = 0;        // GPIO9 on ESP32-C3 and C6 boards
        const int LED_PIN = 2;

        void setup() {
          pinMode(BUTTON_PIN, INPUT_PULLUP);
          pinMode(LED_PIN, OUTPUT);
        }

        void loop() {
          if (digitalRead(BUTTON_PIN) == LOW) {          // BOOT pressed: the button connects the pin to ground
            for (int i = 0; i < 3; i++) {                // repeat (3)
              digitalWrite(LED_PIN, HIGH);
              delay(200);
              digitalWrite(LED_PIN, LOW);
              delay(200);
            }
            while (digitalRead(BUTTON_PIN) == LOW) {     // wait for the release
              delay(10);
            }
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        BUTTON_PIN = 0                   # GPIO9 on ESP32-C3 and C6 boards
        LED_PIN = 2

        button = Pin(BUTTON_PIN, Pin.IN, Pin.PULL_UP)
        led = Pin(LED_PIN, Pin.OUT)

        while True:
            if button.value() == 0:                      # BOOT pressed: the button connects the pin to ground
                for i in range(3):                       # repeat (3)
                    led.value(1)
                    time.sleep_ms(200)
                    led.value(0)
                    time.sleep_ms(200)
                while button.value() == 0:               # wait for the release
                    time.sleep_ms(10)
      `,
      notes: ['Holding the button during a reset puts the chip into download mode: let go first ([[strapping-pins]]).', 'The `while` wait would freeze the program if the button stuck; [[non-blocking-timing]] shows how to wait without blocking, and [[debouncing]] how to read a noisy button.']
    }
  ],
  quiz: [
    { q: 'A sketch has `int mode = 1;` and later `if (mode = 2) { … }`. What happens?', choices: ['The branch runs only when mode is 2', 'The branch never runs', 'mode becomes 2 and the branch runs every time', 'It is a compile error'], a: 2, why: 'A single = is an assignment, and an assignment has a value: 2, which is non-zero and so counts as true. The code compiles, changes mode, and takes the branch every time. Write == to compare; Python rejects the slip as a syntax error.' },
    { q: 'What makes a Python `else` belong to an `if`?', choices: ['A closing brace', 'It is indented to the same level as the if', 'The word end', 'It must be on the same line'], a: 1, why: 'Indentation is Python\'s syntax: the else is attached to the if that has the same indentation. Braces are used in C++, end in blocks.' },
    { q: 'A `while (digitalRead(BUTTON_PIN) == LOW) { }` loop is used to wait for a button release. What is the risk?', choices: ['It runs too fast to see', 'If the button stays pressed, the program is stuck in the loop and does nothing else', 'It presses the button', 'No risk'], a: 1, why: 'A wait loop that spins on an external event ends only when the event happens. If it never does, the program never leaves. Give waits a time limit, or use the clock instead.' },
    { q: 'In Python, the test `if items:` for an empty list `items = []` is…', choices: ['true', 'false', 'an error', 'true only in MicroPython'], a: 1, why: 'Python treats 0, empty text, empty lists and None as false. C++ treats only the number zero (and null pointers) as false.' }
  ],
  applications: [
    'Threshold logic everywhere: a thermostat switches a relay when the temperature crosses a limit, a plant monitor opens a valve when the soil is dry.',
    'Menus and button handling are chains of if and else if over the pressed key.',
    'Retry loops — try three times, then give up — combine a loop with a condition ([[errors-and-exceptions]]).'
  ],
  sources: [
    'Arduino Language Reference, "Control Structure": if, else, for, while, do … while, break, continue, switch … case.',
    'The Python Language Reference, "Compound statements" (if, while, for) and MicroPython documentation, "MicroPython differences from CPython".',
    'Bjarne Stroustrup, *A Tour of C++* (the chapters on statements and expressions).'
  ],
  sim: 'ps-flow'
},
/* ================================================================ functions */
{
  id: 'functions',
  parent: 'program-structure',
  title: 'Functions',
  level: 1,
  short: 'A function is a few lines with a name: write them once, use them anywhere. Parameters carry values in, a return value carries one out, and every call borrows a little stack memory until it returns.',
  keywords: ['function', 'define', 'call', 'parameter', 'argument', 'return', 'void', 'def', 'call stack', 'stack frame', 'recursion', 'callback', 'prototype', 'default argument', 'global keyword'],
  prereq: ['conditions-and-loops', 'variables-and-types'],
  related: ['task-stacks', 'stack-overflow-and-heap-corruption', 'stack-heap-and-static', 'tasks', 'interrupts', 'readable-code', 'structs-and-classes'],
  body: `A function is a named piece of program that you write once and use many times. Instead of repeating the six lines that flash an LED, you give them a name — \`blink\` — and write \`blink(3)\` wherever three flashes are wanted. Functions are how a program of ten lines grows into one of ten thousand without becoming unreadable: each piece has a name, one job, and a small number of inputs and outputs.

### Defining and calling

| | Blocks | Arduino C++ | MicroPython |
|---|---|---|---|
| Define | \`define blink (times)\` | \`void blink(int times) { … }\` | \`def blink(times):\` |
| Call | \`blink (3)\` | \`blink(3);\` | \`blink(3)\` |
| Hand a value back | \`return (x)\` | \`int average(…) { … return x; }\` | \`return x\` |

The names in the definition are **parameters**; the values given in the call are **arguments**. C++ states the type of every parameter and of the result (\`void\` means nothing comes back); Python states neither. A function that only *does* something is often called a procedure; one that *answers* a question returns a value, and is easiest to trust when it changes nothing else.

### What a call really does: the stack

When \`blink(3)\` is called, the processor notes where to come back to, makes room for \`blink\`'s parameters and local variables — a **frame** — and jumps in. If \`blink\` calls \`flash\`, a second frame goes on top. When \`flash\` returns, its frame is discarded and execution resumes in \`blink\`. The frames pile up like plates: the **call stack**. Each costs memory — a few tens of bytes for a small function — and the stack of a task is small: by default the Arduino core gives its loop task 8 KB, and the stack of each other task is chosen when it is created ([[task-stacks]]). Parameters and local variables live in the frame, which is why they vanish at the return. A function that calls itself (**recursion**) can use up the stack, and so can a big local array: the program then dies with a stack overflow ([[stack-overflow-and-heap-corruption]]). The simulation shows a stack growing and shrinking.

### Good functions

- **One job, named by a verb:** \`readTemperature\`, \`drawBar\`, \`connectToWiFi\`.
- **Few parameters,** with the unit in the name when there is one (\`delayMs\`).
- **No surprises:** return the answer rather than quietly changing a global; do not mix reading a sensor with printing it.
- **Short enough to read at a glance.** A function longer than a screen usually contains two functions.

### Differences worth knowing

- C++ must know a function before the line that calls it. The Arduino IDE adds the declarations to \`.ino\` files for you; in a \`.cpp\` file (PlatformIO) write a *prototype* — \`void blink(int times);\` — or define the function first.
- Both languages allow default arguments: \`void blink(int times = 1)\` and \`def blink(times=1):\`.
- Python can return several values at once (\`return low, high\`); C++ needs a struct or reference parameters.
- In Python, assigning to a global name inside a function creates a new local one unless you write \`global name\` first.
- A function can be passed to another as a value — a **callback**. \`attachInterrupt(pin, handler, mode)\`, \`pin.irq(handler=…)\` and every timer take one: the system calls it later, when the event happens ([[interrupts]]).

> [!key] A function gives a few lines a name, takes parameters and may return a value. Each call puts a frame on the call stack and the return removes it: deep recursion and large local arrays are what use the stack up.`,
  ideas: [
    'A function names a few lines so they can be used from many places; parameters go in, a return value comes out.',
    'Blocks use define, C++ writes a result type and parameter types, Python writes def; the call looks the same everywhere.',
    'Each call puts a frame with its parameters and locals on the call stack; the return takes it off again.',
    'A function can be handed to the system as a callback, to be called later when an event happens.'
  ],
  pitfalls: [
    'Local variables keep their value between calls — They are made fresh on every call and vanish at the return. A value that must persist is a global, or a static local in C++.',
    'A function that returns a value always changes what is on screen or on the pins — Returning a value and doing something are different jobs; a function that mixes them is hard to test and to reuse.',
    'Recursion is free — Every level takes a frame from a stack of a few kilobytes; a recursion that is not bounded ends in a stack overflow and a reset.'
  ],
  terms: [
    { term: 'Function', also: ['procedure', 'subroutine', 'method', 'custom block'], def: 'A named piece of program that can be called from elsewhere, optionally with values passed in and one value given back.' },
    { term: 'Parameter', also: ['argument'], def: 'A name a function uses for a value handed to it. The value given at the call is the argument.' },
    { term: 'Return value', also: ['result'], def: 'The single value a function hands back to its caller. A C++ function that returns nothing is declared void.' },
    { term: 'Call stack', also: ['stack frame', 'stack'], def: 'The region of memory where each running function keeps its parameters, local variables and return address. A call adds a frame; the return removes it.' },
    { term: 'Recursion', also: ['recursive function'], def: 'A function that calls itself, each time on a smaller problem, until a base case ends the chain. Every level uses a stack frame.' },
    { term: 'Callback', also: ['handler', 'event handler'], def: 'A function you pass to the system to be called later, when an event happens: a pin changes, a timer fires, a packet arrives.' }
  ],
  code: [
    {
      title: 'A function with a parameter',
      about: 'blink(times) flashes the LED that many times. The program calls it with 3 at the start and then with 1 every second: the six lines are written once.',
      needs: 'An ESP32 DevKit with its LED on GPIO2.',
      wiring: [['GPIO2', 'the on-board LED', 'or: GPIO2 → 220 Ω → LED → GND']],
      blocks: `
        define blink (times)                       // a function: a name for a few lines
          repeat (times)
            set pin (2) to [HIGH v]
            wait (0.1) seconds
            set pin (2) to [LOW v]
            wait (0.1) seconds
          end

        when started
          set pin (2) as [output v]
          blink (3) :: my                          // three flashes: the program has started
        forever
          blink (1) :: my                          // one flash a second
          wait (0.8) seconds
        end
      `,
      cpp: String.raw`
        const int LED_PIN = 2;

        void blink(int times) {                    // a function: a name for a few lines
          for (int i = 0; i < times; i++) {        // repeat (times)
            digitalWrite(LED_PIN, HIGH);
            delay(100);
            digitalWrite(LED_PIN, LOW);
            delay(100);
          }
        }

        void setup() {
          pinMode(LED_PIN, OUTPUT);
          blink(3);                                // three flashes: the program has started
        }

        void loop() {
          blink(1);                                // one flash a second
          delay(800);
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        LED_PIN = 2

        led = Pin(LED_PIN, Pin.OUT)

        def blink(times):                          # a function: a name for a few lines
            for i in range(times):                 # repeat (times)
                led.value(1)
                time.sleep_ms(100)
                led.value(0)
                time.sleep_ms(100)

        blink(3)                                   # three flashes: the program has started
        while True:
            blink(1)                               # one flash a second
            time.sleep_ms(800)
      `,
      notes: ['In C++ the function is defined above setup() because it is used there; in a `.cpp` file that rule is strict, in an `.ino` file the IDE adds the declaration.', 'A function that calls `delay()` blocks its caller for as long as it runs: three flashes take 0.6 s during which nothing else happens ([[non-blocking-timing]]).']
    },
    {
      title: 'A function that gives a value back',
      about: 'averageReading(samples) takes that many readings of a potentiometer and returns their average. The caller keeps the answer in a variable.',
      needs: 'An ESP32 DevKit and a potentiometer: ends to 3V3 and GND, wiper to GPIO34.',
      wiring: [['GPIO34', 'potentiometer wiper', 'ends of the potentiometer to 3V3 and GND']],
      blocks: `
        define averageReading (samples)            // a function that gives a value back
          set [total v] to (0)
          repeat (samples)
            change [total v] by (analog read pin (34))
            wait (0.002) seconds
          end
          return ((total) / (samples))

        when started
          start serial at (115200) baud
        forever
          set [average v] to (averageReading (8))  // call it, keep the answer
          print (average)
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        const int POT_PIN = 34;

        int averageReading(int samples) {          // a function that gives a value back
          long total = 0;
          for (int i = 0; i < samples; i++) {      // repeat (samples)
            total += analogRead(POT_PIN);
            delay(2);
          }
          return total / samples;
        }

        void setup() {
          Serial.begin(115200);
        }

        void loop() {
          int average = averageReading(8);         // call it, keep the answer
          Serial.println(average);
          delay(500);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        POT_PIN = 34

        adc = ADC(Pin(POT_PIN), atten=ADC.ATTN_11DB)

        def averageReading(samples):               # a function that gives a value back
            total = 0
            for i in range(samples):               # repeat (samples)
                total += adc.read_u16() // 16
                time.sleep_ms(2)
            return total // samples

        while True:
            average = averageReading(8)            # call it, keep the answer
            print(average)
            time.sleep_ms(500)
      `,
      output: `
        2041
        2047
        2044
      `,
      notes: ['Averaging eight readings smooths out noise; [[oversampling-and-noise]] says how much it helps.', 'The total is a `long` in C++ so that many readings cannot overflow it; the Python integer needs no such care ([[variables-and-types]]).']
    }
  ],
  quiz: [
    { q: 'What is the difference between a parameter and an argument?', choices: ['None: they are two words for the same thing', 'The parameter is the name in the definition; the argument is the value given at the call', 'The argument is the name; the parameter is the value', 'Parameters are for C++, arguments for Python'], a: 1, why: 'In `void blink(int times)` the name times is the parameter. In `blink(3)` the 3 is the argument that times will hold during that call.' },
    { q: 'A function declares `int n = 0;` as a local variable, adds 1 to it and returns it. It is called five times. What do the calls return?', choices: ['1, 2, 3, 4, 5', '1, 1, 1, 1, 1', '0, 1, 2, 3, 4', '5 each time'], a: 1, why: 'A local variable lives in the call\'s stack frame and is created again, with 0, on every call. To count calls the variable must be a global (or `static` inside the function in C++).' },
    { q: 'A recursive function has no base case and calls itself for ever. What is the likely result on an ESP32?', choices: ['It runs for ever without using memory', 'The stack fills up, and the task is stopped by a stack overflow and the chip resets', 'The compiler reports an error', 'It slows down but never fails'], a: 1, why: 'Each call adds a frame to a stack of a few kilobytes. When the stack is full the system detects the overflow, reports it and resets (or crashes). Recursion needs a base case and a bounded depth.' },
    { q: 'In Python, a function does `count = count + 1` where `count` is a global, without any other declaration. What happens?', choices: ['The global grows by one', 'An error: the name is used before it is assigned', 'A new local count is created, and the global stays unchanged', 'The function returns the count'], a: 1, why: 'Assigning to a name inside a function makes it local to that function. Reading it before the assignment is then an error (a "local variable referenced before assignment" message). Write `global count` first to change the global.' }
  ],
  applications: [
    'Every library is a collection of functions: `analogRead`, `digitalWrite` and `Serial.println` are functions somebody else wrote and named.',
    'Interrupt handlers, timer callbacks and Wi-Fi event handlers are functions the system calls for you; they must be short and follow their own rules ([[interrupts]]).',
    'Splitting a long loop() into readSensors(), decide() and updateOutputs() is the first step towards a state machine ([[state-machine-in-code]]).'
  ],
  sources: [
    'Arduino Language Reference, "Functions" and the sketch structure; Arduino-ESP32 documentation (core 3.3).',
    'The Python Language Reference, "Function definitions"; MicroPython documentation, "MicroPython differences from CPython".',
    'Espressif, *ESP-IDF Programming Guide*, FreeRTOS: the stack size of a task and stack overflow detection.'
  ],
  sim: 'ps-callstack'
},

/* ================================================================ arrays, lists and buffers */
{
  id: 'arrays-and-lists',
  parent: 'program-structure',
  title: 'Arrays, lists and buffers',
  level: 2,
  short: 'Many values under one name: a C++ array has a size fixed in advance and no safety net, a Python list grows and complains when you step outside it. Buffers are arrays used as waiting rooms for data.',
  keywords: ['array', 'list', 'buffer', 'index', 'bounds', 'out of range', 'buffer overflow', 'ring buffer', 'sizeof', 'bytearray', 'append', 'IndexError', 'zero-based', 'std::vector', 'moving average'],
  prereq: ['variables-and-types', 'conditions-and-loops'],
  related: ['strings-and-text', 'stack-heap-and-static', 'heap-and-fragmentation', 'filtering-sensor-data', 'guru-meditation-and-backtraces', 'bits-and-bytes'],
  body: `Often one value is not enough: the last eight readings of a sensor, the digits of a code, the bytes of a packet. A group of values of the same kind under one name is an **array** in C++, a **list** in Python and a list block in blocks. Each value is reached by its position, the **index**. The idea is simple; the two languages make opposite promises about what happens when the index is wrong.

### The same list in three notations

| | Blocks | Arduino C++ | MicroPython |
|---|---|---|---|
| Make | \`make list [readings v]\` | \`int readings[8];\` | \`readings = [0] * 8\` |
| First item | \`item (1) of\` | \`readings[0]\` | \`readings[0]\` |
| Change one | \`replace item (n) of\` | \`readings[3] = 7;\` | \`readings[3] = 7\` |
| Add one | \`add (v) to [list v]\` | not possible: the size is fixed | \`readings.append(7)\` |
| Length | \`length of [list v]\` | \`sizeof(readings) / sizeof(readings[0])\` | \`len(readings)\` |

Mind the first row of the index column: **C++ and Python count from 0, blocks count from 1**, as Scratch does. Moving a program from blocks to code means subtracting one from every index, and forgetting it is the commonest off-by-one slip.

### Fixed or growing

A C++ array is made at compile time with a size you choose. It does not know its own length — the program must remember it, preferably in one constant used everywhere. A global array starts as zeros; a local one starts as whatever the stack held. And there is **no bounds check**: writing \`readings[8]\` into an 8-item array compiles, runs, and overwrites whatever sits beyond the end — a neighbouring variable, a return address, another task's data. The result is a corrupted value, a Guru Meditation crash ([[guru-meditation-and-backtraces]]) or nothing visible at all, until much later.

A Python list grows with \`append\`, shrinks, and checks every access: an index outside it raises \`IndexError\` and stops the program on that line, which is annoying and safe. A negative index counts from the end: \`readings[-1]\` is the last item. In MicroPython the \`array\` module and \`bytearray\` store numbers as compactly as C++ does; a list of numbers costs more.

### Buffers and the ring

A **buffer** is an array used as a waiting room — bytes arriving from the serial port, an I2C reply, a radio packet. A **ring buffer** reuses the same space: write at the slot, add one, and when the slot reaches the size, wrap back to 0. The program below keeps the last eight readings that way and averages them: a moving average, the simplest filter ([[filtering-sensor-data]]).

### Keeping inside the array

Check \`slot < SIZE\` before writing; give library functions the size (\`snprintf(buf, sizeof(buf), …)\`, \`Serial.readBytes(buf, sizeof(buf))\`); never trust a length that arrived over the network. Writing past the end of a buffer is the most common serious bug in C and C++ — and the most common way a device is attacked ([[iot-threat-model]]).

> [!key] An array is a fixed-size row of values counted from 0 whose limits C++ does not guard; a list grows and raises an error for a bad index. Keep every index inside the size, and remember that blocks count from 1.`,
  ideas: [
    'An array or list holds many values of one kind under one name, reached by an index that starts at 0 in C++ and Python and at 1 in blocks.',
    'A C++ array has a size fixed in advance, does not know its length and does not check the index; a Python list grows and raises IndexError.',
    'A buffer is an array used to hold data on its way somewhere; a ring buffer wraps the index back to 0.',
    'Writing past the end of an array is a leading cause of crashes and security holes in C and C++ programs.'
  ],
  pitfalls: [
    'sizeof(readings) is the number of items — It is the number of bytes. For an int array of 8 it is 32; divide by sizeof(readings[0]) to get 8.',
    'The compiler stops me writing outside the array — It does not. readings[8] on an 8-item array is accepted, and it overwrites what lies beyond; only the running program suffers.',
    'The last index is the size — It is size − 1, because counting starts at 0. A for loop that runs while i <= SIZE writes one item too many.'
  ],
  terms: [
    { term: 'Array', also: ['list', 'vector'], def: 'A row of values of the same type under one name, reached by an index. A C++ array has a fixed size; a Python list can grow.' },
    { term: 'Index', also: ['subscript', 'position'], def: 'The number that picks one item of an array. It starts at 0 in C++ and Python, and at 1 in the block notation.' },
    { term: 'Buffer', also: ['byte buffer', 'FIFO'], def: 'A region of memory, usually an array of bytes, that holds data waiting to be used: what arrived from a serial port, a bus or a radio.' },
    { term: 'Buffer overflow', also: ['out-of-bounds write', 'buffer overrun'], def: 'Writing past the end of an array. C++ does not detect it: the neighbouring memory is overwritten, causing corrupted data, crashes or a security hole.' },
    { term: 'Ring buffer', also: ['circular buffer'], def: 'A fixed-size buffer whose write position wraps from the end back to the start, so the newest data replaces the oldest.' }
  ],
  code: [
    {
      title: 'The last eight readings, averaged',
      about: 'A ring buffer of eight potentiometer readings: each pass overwrites the oldest one, then the program adds the eight up and prints their average, ten times a second.',
      needs: 'An ESP32 DevKit and a potentiometer: ends to 3V3 and GND, wiper to GPIO34.',
      wiring: [['GPIO34', 'potentiometer wiper', 'ends of the potentiometer to 3V3 and GND']],
      blocks: `
        when started
          start serial at (115200) baud
          set [SIZE v] to (8)
          make list [readings v] with (SIZE) items of (0)         // a list of 8 zeros
          set [slot v] to (0)                                     // where the next reading goes
        forever
          replace item ((slot) + (1)) of [readings v] with (analog read pin (34))   // blocks count from 1
          change [slot v] by (1)
          if <(slot) = (SIZE)> then                               // past the end: wrap round
            set [slot v] to (0)
          end
          set [total v] to (0)
          for each [x v] in (readings)
            change [total v] by (x)
          end
          print ((total) / (SIZE))
          wait (0.1) seconds
        end
      `,
      cpp: String.raw`
        const int POT_PIN = 34;
        const int SIZE = 8;

        int readings[SIZE];                  // a list of 8 zeros (a global array starts as zeros)
        int slot;                            // where the next reading goes

        void setup() {
          Serial.begin(115200);
          slot = 0;
        }

        void loop() {
          readings[slot] = analogRead(POT_PIN);        // C++ counts from 0
          slot++;
          if (slot == SIZE) {                          // past the end: wrap round
            slot = 0;
          }
          long total = 0;
          for (int x : readings) {                     // for each x in readings
            total += x;
          }
          Serial.println(total / SIZE);
          delay(100);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        POT_PIN = 34
        SIZE = 8

        adc = ADC(Pin(POT_PIN), atten=ADC.ATTN_11DB)

        readings = [0] * SIZE                # a list of 8 zeros
        slot = 0                             # where the next reading goes

        while True:
            readings[slot] = adc.read_u16() // 16          # Python counts from 0
            slot += 1
            if slot == SIZE:                               # past the end: wrap round
                slot = 0
            total = 0
            for x in readings:                             # for each x in readings
                total += x
            print(total // SIZE)
            time.sleep_ms(100)
      `,
      output: `
        1013
        1218
        1402
        1559
        …
      `,
      notes: ['For the first eight passes the average is pulled down by the zeros the array started with: the buffer is not yet full.', 'In C++ nothing stops you writing `readings[8]`; here the `if (slot == SIZE)` guard is what keeps the index inside the array.', 'Python also has `sum(readings)`; the explicit loop is kept so that the three programs line up.']
    }
  ],
  quiz: [
    { q: 'An array is declared `int readings[8];`. Which index is the last valid one?', choices: ['8', '7', '9', '0'], a: 1, why: 'Counting starts at 0, so the eight items have the indexes 0 to 7. readings[8] is outside the array.' },
    { q: 'What happens in C++ when a program writes `readings[10] = 5;` to an 8-item array?', choices: ['The compiler or the chip reports an error at once', 'The 5 is written into the memory beyond the array, with no warning', 'The array grows to 11 items', 'Nothing: the write is ignored'], a: 1, why: 'C++ does no bounds checking. The write goes to the address that index 10 would have, overwriting whatever lives there: a neighbouring variable, or something worse.' },
    { q: 'In Python, `readings[-1]` on a list of 8 items refers to…', choices: ['an error', 'the last item', 'the first item', 'item number −1 of an infinite list'], a: 1, why: 'A negative index counts from the end of a Python list: −1 is the last item, −2 the one before. A negative index in C++ is an out-of-bounds access.' },
    { q: 'The first item of a list is item 1 in blocks and item 0 in C++ and Python.', a: true, why: 'Scratch-style block lists count from 1; C++ and Python count from 0. When a block program is turned into code, every index has to be reduced by one.' }
  ],
  applications: [
    'Moving averages and median filters keep the last few readings of a noisy sensor in a ring buffer.',
    'Every serial, I2C, SPI and radio driver reads into a byte buffer whose size must fit the largest message.',
    'Lookup tables — a sine wave for an audio output, a colour palette, a calibration curve — are arrays filled in advance.'
  ],
  sources: [
    'Arduino Language Reference, "Data types" (array) and the C++ language: arrays, sizeof, range-based for.',
    'The Python Language Reference, sequence types (list, indexing); MicroPython documentation, the array module and bytearray.',
    'Espressif, *ESP-IDF Programming Guide*, "Fatal Errors": what an out-of-bounds access usually looks like on the chip.'
  ],
  sim: 'ps-array-index'
},

/* ================================================================ strings and text */
{
  id: 'strings-and-text',
  parent: 'program-structure',
  title: 'Strings and text',
  level: 2,
  short: 'Text in C++ is a row of bytes ended by a zero byte, or the convenient but heap-hungry String object; in Python it is a str that handles itself. How you hold text decides how safe a long-running program is.',
  keywords: ['string', 'String', 'char array', 'null terminator', 'strcmp', 'snprintf', 'printf', 'f-string', 'str', 'bytes', 'ASCII', 'UTF-8', 'concatenation', 'toInt', 'heap fragmentation', 'serial command'],
  prereq: ['arrays-and-lists', 'variables-and-types'],
  related: ['heap-and-fragmentation', 'json-on-a-microcontroller', 'formatting-numbers', 'the-serial-monitor', 'print-debugging-and-log-levels', 'bits-and-bytes'],
  body: `Text is a sequence of characters, and a computer stores each character as a number. What differs between the languages is *who looks after the memory* the text occupies — and that decides whether a program can run for months.

### Three ways to hold text in C++

- **A character array,** \`char name[16]\`: sixteen bytes, fixed. Text ends with a zero byte, the *terminator* (\`\\0\`), so "Hello" needs six bytes, not five. The functions that handle such C strings — \`strlen\`, \`strcpy\`, \`strcmp\`, \`snprintf\` — trust you to leave room; copy text that does not fit and you write past the end of the array ([[arrays-and-lists]]).
- **The Arduino \`String\`,** a class: \`String line = "pot=" + String(raw);\`. It grows by itself, compares with \`==\`, and has \`trim()\`, \`toInt()\`, \`indexOf()\`. Each growth asks the heap for a new block and frees the old: a program that builds strings in its loop for weeks leaves the heap full of small holes until a request fails ([[heap-and-fragmentation]]). Fine for a one-shot tool; for a device that must run for a year, build lines in a fixed buffer or call \`reserve()\` once.
- **\`std::string\`** of the C++ library is much like \`String\` and shares its trade-off.

Python's \`str\` is immutable and looks after itself: \`"a" + "b"\` makes a new text, and the garbage collector frees the old. MicroPython also allocates, so building text in a hot loop makes work for the collector; join pieces once with \`"".join(parts)\`. Raw bytes — what a serial port or a sensor delivers — are \`bytes\` or \`bytearray\`, not \`str\`.

### Characters are numbers

\`'A'\` is the number 65 (ASCII). In C++ a \`char\` is a one-byte number, so \`'A' + 1\` is 66, which prints as \`B\`. Python has \`ord('A')\` and \`chr(66)\`. Non-English letters take two to four bytes in UTF-8: the C string \`"é"\` has length 2 in \`strlen\`, while Python's \`len("é")\` counts characters and gives 1.

### Comparing and building

For a \`String\`, \`==\` compares the characters. For a char array, \`a == b\` compares the *addresses* and is almost never what you meant: use \`strcmp(a, b) == 0\`. Python's \`==\` always compares content. Case matters in C++ and Python: "ON" is not "on" — lower-case input first.

To put numbers into text use a format: \`snprintf(buf, sizeof(buf), "pot=%d (%d%%)", raw, percent)\` in C++ (\`%d\` whole number, \`%.2f\` two decimals, \`%%\` a percent sign), an f-string in Python (\`f"pot={raw} ({percent}%)"\`). \`snprintf\` stops at the end of the buffer; plain \`sprintf\` does not.

> [!key] Text is a row of byte values. A char array is fixed and ends with a zero byte that is easy to forget; a String grows but fragments the heap over weeks; a Python str looks after itself. Compare content, never addresses, and always leave room.`,
  ideas: [
    'A C string is a char array ending in a zero byte, so it needs one byte more than its visible length.',
    'The Arduino String grows by itself, which is convenient, but repeated growing fragments the heap in a program that runs for months.',
    'In C++ == on two char arrays compares addresses; use strcmp. On String and in Python == compares the characters.',
    'Characters are numbers (A is 65) and non-English characters take several bytes in UTF-8.'
  ],
  pitfalls: [
    'A text of 8 characters fits in char name[8] — It needs 9 bytes, because of the closing zero byte. One byte too few and the terminator is written outside the array.',
    'if (a == b) compares two texts — For char arrays it compares where they are stored. Use strcmp(a, b) == 0, or a String, whose == compares the characters.',
    'The Arduino String is always the easy and safe choice — It is easy, and safe from overflow, but a long-running loop that builds strings slowly fragments the heap until allocation fails.'
  ],
  terms: [
    { term: 'String', also: ['text', 'str'], def: 'A sequence of characters. Also the name of the Arduino class that holds text on the heap and grows by itself; Python\'s str is the equivalent built-in type.' },
    { term: 'C string', also: ['char array', 'null-terminated string'], def: 'Text stored in an array of char and ended by a zero byte (\\0). Its length is not stored: functions find the end by looking for the zero.' },
    { term: 'Null terminator', also: ['\\0', 'NUL'], def: 'The zero byte that marks the end of a C string. A text of n characters needs n + 1 bytes of storage.' },
    { term: 'ASCII', also: ['UTF-8', 'character code'], def: 'The table that gives each basic character a number: A is 65, a is 97, 0 is 48. UTF-8 extends it to all alphabets using one to four bytes per character.' },
    { term: 'Format string', also: ['printf', 'snprintf', 'f-string'], def: 'A text with placeholders (%d, %.2f, or {raw} in Python) into which values are inserted to build a line of output.' }
  ],
  choose: {
    good: ['A fixed char buffer with snprintf for lines built again and again in a loop that runs for months', 'The Arduino String for short-lived work: parsing a command, a one-off message, a quick prototype', 'A Python str for text, and bytes or bytearray for raw data from a port or sensor'],
    avoid: ['String concatenation in a fast loop on a device that must run for a year', 'strcpy and sprintf with text whose length you do not control', 'Comparing char arrays with =='],
    check: ['That every buffer is one byte longer than the longest text it can hold', 'That text arriving from outside is limited to the buffer size before it is copied', 'How much heap is free after a day of running ([[heap-and-fragmentation]])']
  },
  code: [
    {
      title: 'Build a line of text',
      about: 'Reads a potentiometer and prints a line such as pot=2048 (50%). C++ builds it in a fixed buffer with snprintf, Python with an f-string, blocks with join.',
      needs: 'An ESP32 DevKit and a potentiometer: ends to 3V3 and GND, wiper to GPIO34.',
      wiring: [['GPIO34', 'potentiometer wiper', 'ends of the potentiometer to 3V3 and GND']],
      blocks: `
        when started
          start serial at (115200) baud
        forever
          set [raw v] to (analog read pin (34))
          set [percent v] to (((raw) * (100)) / (4095))
          set [line v] to (join (join (join [pot=] (raw)) [ (]) (join (percent) [%)]))   // join text and numbers
          print (line)
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        const int POT_PIN = 34;

        char line[32];                       // room for 31 characters and the closing zero byte

        void setup() {
          Serial.begin(115200);
        }

        void loop() {
          int raw = analogRead(POT_PIN);
          int percent = raw * 100 / 4095;
          snprintf(line, sizeof(line), "pot=%d (%d%%)", raw, percent);   // join text and numbers (snprintf stops at the end of the buffer)
          Serial.println(line);
          delay(1000);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        POT_PIN = 34

        adc = ADC(Pin(POT_PIN), atten=ADC.ATTN_11DB)

        while True:
            raw = adc.read_u16() // 16
            percent = raw * 100 // 4095
            line = f"pot={raw} ({percent}%)"               # join text and numbers
            print(line)
            time.sleep_ms(1000)
      `,
      output: `
        pot=2048 (50%)
        pot=2051 (50%)
      `,
      notes: ['With the Arduino `String` the same line is `String line = "pot=" + String(raw) + " (" + String(percent) + "%)";`: shorter, but it allocates from the heap on every pass.', 'The %% in a C++ format prints one percent sign; in a Python f-string a plain % needs no care.']
    },
    {
      title: 'Obey a typed command',
      about: 'Type on or off in the serial monitor (with "Newline" selected) and the LED follows. The text is trimmed and compared; anything else is reported back.',
      needs: 'An ESP32 DevKit with its LED on GPIO2 and the serial monitor at 115200 baud.',
      wiring: [['GPIO2', 'the on-board LED'], ['USB', 'computer', 'the serial monitor sends what you type']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (2) as [output v]
          print [type on or off]
        forever
          if <serial has data?> then                           // something has arrived
            set [line v] to (trim (read line from serial))     // remove the newline and spaces
            if <(line) = [on]> then
              set pin (2) to [HIGH v]
              print [LED on]
            else if <(line) = [off]> then
              set pin (2) to [LOW v]
              print [LED off]
            else
              print (join [unknown: ] (line))
            end
          end
        end
      `,
      cpp: String.raw`
        const int LED_PIN = 2;

        void setup() {
          Serial.begin(115200);
          pinMode(LED_PIN, OUTPUT);
          Serial.println("type on or off");
        }

        void loop() {
          if (Serial.available()) {                            // something has arrived
            String line = Serial.readStringUntil('\n');
            line.trim();                                       // remove the newline and spaces
            if (line == "on") {
              digitalWrite(LED_PIN, HIGH);
              Serial.println("LED on");
            } else if (line == "off") {
              digitalWrite(LED_PIN, LOW);
              Serial.println("LED off");
            } else {
              Serial.println("unknown: " + line);
            }
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import sys, select

        LED_PIN = 2

        led = Pin(LED_PIN, Pin.OUT)
        poll = select.poll()
        poll.register(sys.stdin, select.POLLIN)
        print("type on or off")

        while True:
            if poll.poll(0):                                   # something has arrived
                line = sys.stdin.readline().strip()            # remove the newline and spaces
                if line == "on":
                    led.value(1)
                    print("LED on")
                elif line == "off":
                    led.value(0)
                    print("LED off")
                else:
                    print("unknown: " + line)
      `,
      output: `
        type on or off
        on
        LED on
        OFF
        unknown: OFF
      `,
      notes: ['"OFF" is not "off": C++ and Python compare exactly. Convert first with `line.toLowerCase()` in C++ or `line.lower()` in Python if the case should not matter.', 'In MicroPython the characters you type arrive on the same serial port as the REPL: close any terminal that is also reading it, or run the program from main.py.']
    }
  ],
  quiz: [
    { q: 'How many bytes does a `char` array need to hold the text "Hello" as a C string?', choices: ['5', '6', '4', '10'], a: 1, why: 'Five letters plus the zero byte that ends the string: six bytes. Forgetting the terminator is the standard off-by-one of C strings.' },
    { q: 'Two char arrays `a` and `b` hold the same text. Does `if (a == b)` in C++ say they are equal?', choices: ['Yes, it compares the characters', 'No: it compares their addresses, so it is false for two different arrays', 'It is a compile error', 'Yes, but only on the ESP32'], a: 1, why: 'A char array decays to a pointer in a comparison, so == compares the two addresses. Use strcmp(a, b) == 0. With the Arduino String class, == compares the characters.' },
    { q: 'A device builds an Arduino `String` from sensor values every second and must run for a year. What is the main risk?', choices: ['The String class overflows at 255 characters', 'Repeated allocation and release fragments the heap, until an allocation fails', 'The text becomes unreadable', 'There is no risk on the ESP32'], a: 1, why: 'Every growth of a String takes a new block from the heap and frees the old one. Over millions of cycles the free memory breaks into pieces too small to use, and the program fails after days or weeks. A fixed buffer avoids it.' },
    { q: 'In Python, `len("é")` is 1, but in C++ `strlen("é")` is 2 when the source is saved as UTF-8.', a: true, why: 'Python\'s str counts characters; C++ counts bytes, and é takes two bytes in UTF-8. Programs that measure text by byte count must remember this.' }
  ],
  applications: [
    'Serial command interfaces — "on", "off", "set 25" — are text parsed into actions, the first user interface of most prototypes.',
    'Log lines, MQTT payloads and web responses are all text built from values.',
    'Wi-Fi names and passwords are texts with fixed maximum lengths: 32 and 63 characters ([[wifi-station]]).'
  ],
  sources: [
    'Arduino Language Reference, "String" and "char"; the C library functions snprintf, strcmp, strlen.',
    'The Python Language Reference, strings and formatted string literals; MicroPython documentation, "MicroPython differences from CPython".',
    'Arduino-ESP32 documentation, the Serial API (readStringUntil, available).'
  ],
  sim: { id: 'ps-array-index', params: { mode: 'chars' } }
},
/* ================================================================ timing without delay */
{
  id: 'non-blocking-timing',
  parent: 'program-structure',
  title: 'Timing without delay',
  level: 2,
  short: 'Several jobs at different rhythms in one loop: blink every 500 ms, report every second, look at a button every 20 ms. Remember when, compare, act — once per job — and the loop never waits.',
  keywords: ['millis', 'ticks_ms', 'ticks_diff', 'non-blocking', 'delay', 'timer', 'interval', 'overflow', 'rollover', 'multitasking', 'cooperative', 'every', 'one-shot', 'timeout', 'drift', 'jitter'],
  prereq: ['first-program-blink', 'conditions-and-loops', 'variables-and-types'],
  related: ['what-a-state-machine-is', 'tasks', 'delays-and-yielding', 'software-timers', 'hardware-timers', 'debouncing', 'sample-time-and-jitter'],
  body: `The blink page ended on a promise: \`delay()\` stops the loop, and a loop that looks at the clock does not. This page keeps the promise for more than one job. Real programs do several things at once at different rhythms — blink an LED every 500 ms, print a report every second, look at a button every 20 ms — and a loop that sleeps cannot do two of them.

### The pattern: remember when, compare, act

Every timed job needs three things, and nothing else:

1. **Remember when** it last ran: a variable holding the clock reading (\`lastBlink\`).
2. **Compare:** how long ago was that? \`now - lastBlink\`, and is it at least the interval?
3. **Act:** do the job, and update the remembered time.

Each job has its own pair of variables. The loop visits the jobs in turn and never waits; a visit that finds nothing due costs a few microseconds. The clock is \`(milliseconds since start)\` in blocks, \`millis()\` in C++ and \`time.ticks_ms()\` in MicroPython, and the comparison is written exactly as below.

| | Elapsed time since \`last\` |
|---|---|
| Blocks | \`<((now) - (last)) ≥ (500)>\` |
| Arduino C++ | \`now - last >= 500\` with \`uint32_t\` variables |
| MicroPython | \`time.ticks_diff(now, last) >= 500\` |

### Why subtract: the clock wraps

\`millis()\` is a 32-bit unsigned number that returns to zero after 49.7 days (4 294 967 296 ms). Suppose \`last\` is 4 294 967 000. Only 100 ms later \`now\` is 4 294 967 100 — and \`last + 500\` has already wrapped round to 204, so the test \`now >= last + 500\` is true and the job fires 400 ms early. The subtraction \`now - last\` gives 100, which is right; and 496 ms after \`last\`, when \`now\` itself has wrapped to 200, unsigned arithmetic still gives exactly 496. **Always compare a difference, never two absolute times.** MicroPython's tick counter wraps far sooner (on most ports after about 12 days), and its values are not ordinary numbers, so never subtract or compare them by hand: \`ticks_diff\` and \`ticks_add\` do it right. The simulation shows a clock crossing the wrap.

### Catching up, or starting again

\`last += interval\` keeps the long-term rate exact: a pass that was late is made up for. \`last = now\` restarts the count from the real moment, so each late pass makes the period longer — drift. Use \`+=\` for a clock-like rhythm and \`= now\` for "at least this long since the last". If the loop was held up by more than a whole interval, \`+=\` fires several times in a row to catch up; that is rarely harmful, and sometimes a surprise.

### The limit is the slowest pass

All the jobs share one loop, so none can run more punctually than the loop comes round. A 200 ms job in one place delays every other timer by up to 200 ms. Keep each job short, cut long ones into steps, and when one job truly needs precision — or must wait for the network — use tasks ([[tasks]]), software timers or a hardware timer ([[hardware-timers]]). On the ESP32 \`delay()\` is not a spin: other tasks such as Wi-Fi go on running while your loop sleeps. Your own loop, though, is stopped.

### From timers to state machines

A job with *phases* — "the LED stays on for two seconds after a press, then goes off" — needs one more variable, saying which phase it is in, and the time it entered it. That variable and its rules are a **state machine** ([[what-a-state-machine-is]]); the second program below is the smallest one.

> [!key] Remember when, compare, act: keep the clock reading of each job's last run, subtract it from the clock, and run the job when the difference reaches the interval. Compare differences, never absolute times, and the pattern survives the clock wrapping.`,
  ideas: [
    'A non-blocking program checks the clock on every pass of the loop and runs each job only when its interval has elapsed.',
    'Each job needs its own remembered time and interval; the loop never waits.',
    'Subtract the saved time from the clock instead of comparing two clock readings: the subtraction stays right when millis() wraps after 49.7 days.',
    'In MicroPython compare ticks only with ticks_diff, and move the deadline on with ticks_add.'
  ],
  pitfalls: [
    'if (millis() >= last + 500) is the same as the subtraction form — It fails near the wrap: last + 500 can wrap to a small number while the clock is still large, and the job fires at once. Write millis() - last >= 500.',
    'Several timers in one loop run precisely on time — They run when the loop comes round. One slow job delays all the others by its length.',
    'A long-running job is fine inside the loop if it is only run now and then — While it runs it holds up every other job. Split it into short steps or move it to a task.'
  ],
  terms: [
    { term: 'Non-blocking', also: ['asynchronous', 'cooperative multitasking'], def: 'Said of code that never waits for something to happen: it checks, and if the time has not come it moves on, so the loop stays free for other jobs.' },
    { term: 'millis()', also: ['time.ticks_ms', 'milliseconds since start'], def: 'The Arduino function that returns the milliseconds since the program started, as a 32-bit unsigned number that wraps to zero after 49.7 days. MicroPython\'s equivalent is time.ticks_ms().' },
    { term: 'Timer interval', also: ['period'], def: 'The time between two runs of a periodic job. A software timer is a variable that remembers the last run and a comparison that says whether the interval has elapsed.' },
    { term: 'One-shot', also: ['timeout', 'delayed action'], def: 'An action done once, a set time after something happened: "switch the light off two seconds after the last press".' },
    { term: 'Drift', also: ['timing drift'], def: 'A rhythm that gets slower, because every late pass adds its delay to the next period. Adding the interval to the previous deadline instead of using the current time avoids it.' }
  ],
  code: [
    {
      title: 'Three jobs, three timers, one loop',
      about: 'Blinks the LED every 500 ms, looks at the BOOT button every 20 ms and counts its presses, and reports the count every second. No delay() anywhere: each job has its own remembered time.',
      needs: 'An ESP32 DevKit: the LED is on GPIO2, the BOOT button on GPIO0 (GPIO9 on a C3 or C6 board).',
      wiring: [['GPIO0', 'the BOOT button to GND', 'already on the board'], ['GPIO2', 'the on-board LED']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (2) as [output v]
          set pin (0) as [input with pull-up v]
          set [BLINK_MS v] to (500)
          set [POLL_MS v] to (20)
          set [REPORT_MS v] to (1000)
          set [lastBlink v] to (milliseconds since start)
          set [lastPoll v] to (lastBlink)
          set [lastReport v] to (lastBlink)
          set [ledOn v] to <false>
          set [wasDown v] to <false>
          set [presses v] to (0)
        forever
          set [now v] to (milliseconds since start)
          if <((now) - (lastBlink)) ≥ (BLINK_MS)> then      // timer 1: blink
            change [lastBlink v] by (BLINK_MS)
            set [ledOn v] to <not <ledOn>>
            set pin (2) to (ledOn)
          end
          if <((now) - (lastPoll)) ≥ (POLL_MS)> then        // timer 2: look at the button
            change [lastPoll v] by (POLL_MS)
            set [down v] to <(read pin (0)) = [LOW v]>
            if <<down> and <not <wasDown>>> then            // it has just gone down
              change [presses v] by (1)
            end
            set [wasDown v] to (down)
          end
          if <((now) - (lastReport)) ≥ (REPORT_MS)> then    // timer 3: report
            change [lastReport v] by (REPORT_MS)
            print (presses)
          end
        end
      `,
      cpp: String.raw`
        const int LED_PIN = 2;
        const int BUTTON_PIN = 0;        // GPIO9 on ESP32-C3 and C6 boards
        const uint32_t BLINK_MS = 500;
        const uint32_t POLL_MS = 20;
        const uint32_t REPORT_MS = 1000;

        uint32_t lastBlink;
        uint32_t lastPoll;
        uint32_t lastReport;
        bool ledOn;
        bool wasDown;
        int presses;

        void setup() {
          Serial.begin(115200);
          pinMode(LED_PIN, OUTPUT);
          pinMode(BUTTON_PIN, INPUT_PULLUP);
          lastBlink = millis();
          lastPoll = lastBlink;
          lastReport = lastBlink;
          ledOn = false;
          wasDown = false;
          presses = 0;
        }

        void loop() {
          uint32_t now = millis();
          if (now - lastBlink >= BLINK_MS) {          // timer 1: blink
            lastBlink += BLINK_MS;
            ledOn = !ledOn;
            digitalWrite(LED_PIN, ledOn);
          }
          if (now - lastPoll >= POLL_MS) {            // timer 2: look at the button
            lastPoll += POLL_MS;
            bool down = digitalRead(BUTTON_PIN) == LOW;
            if (down && !wasDown) {                   // it has just gone down
              presses++;
            }
            wasDown = down;
          }
          if (now - lastReport >= REPORT_MS) {        // timer 3: report
            lastReport += REPORT_MS;
            Serial.println(presses);
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        LED_PIN = 2
        BUTTON_PIN = 0                   # GPIO9 on ESP32-C3 and C6 boards
        BLINK_MS = 500
        POLL_MS = 20
        REPORT_MS = 1000

        led = Pin(LED_PIN, Pin.OUT)
        button = Pin(BUTTON_PIN, Pin.IN, Pin.PULL_UP)

        lastBlink = time.ticks_ms()
        lastPoll = lastBlink
        lastReport = lastBlink
        ledOn = False
        wasDown = False
        presses = 0

        while True:
            now = time.ticks_ms()
            if time.ticks_diff(now, lastBlink) >= BLINK_MS:        # timer 1: blink
                lastBlink = time.ticks_add(lastBlink, BLINK_MS)
                ledOn = not ledOn
                led.value(ledOn)
            if time.ticks_diff(now, lastPoll) >= POLL_MS:          # timer 2: look at the button
                lastPoll = time.ticks_add(lastPoll, POLL_MS)
                down = button.value() == 0
                if down and not wasDown:                           # it has just gone down
                    presses += 1
                wasDown = down
            if time.ticks_diff(now, lastReport) >= REPORT_MS:      # timer 3: report
                lastReport = time.ticks_add(lastReport, REPORT_MS)
                print(presses)
      `,
      output: `
        0
        0
        2
        2
        3
      `,
      notes: ['Looking at the button only every 20 ms is also a crude debounce: a bounce shorter than that is never seen ([[debouncing]]).', 'Add a `delay(300)` anywhere in loop() and watch the three rhythms fall apart: that is what the simulation below shows.']
    },
    {
      title: 'Light for two seconds, without delay',
      about: 'Press BOOT and the LED lights for two seconds, then goes out by itself. A variable remembers whether the light is on and when it came on — the smallest state machine.',
      needs: 'An ESP32 DevKit: the BOOT button on GPIO0 (GPIO9 on a C3 or C6 board) and the LED on GPIO2.',
      wiring: [['GPIO0', 'the BOOT button to GND', 'already on the board'], ['GPIO2', 'the on-board LED']],
      blocks: `
        when started
          set pin (0) as [input with pull-up v]
          set pin (2) as [output v]
          set [LIGHT_MS v] to (2000)
          set [lit v] to <false>
          set [litSince v] to (0)
        forever
          if <<(read pin (0)) = [LOW v]> and <not <lit>>> then            // pressed while idle
            set [lit v] to <true>
            set [litSince v] to (milliseconds since start)                // remember when
            set pin (2) to [HIGH v]
          end
          if <<lit> and <((milliseconds since start) - (litSince)) ≥ (LIGHT_MS)>> then   // the time is up
            set [lit v] to <false>
            set pin (2) to [LOW v]
          end
        end
      `,
      cpp: String.raw`
        const int LED_PIN = 2;
        const int BUTTON_PIN = 0;        // GPIO9 on ESP32-C3 and C6 boards
        const uint32_t LIGHT_MS = 2000;

        bool lit;
        uint32_t litSince;

        void setup() {
          pinMode(BUTTON_PIN, INPUT_PULLUP);
          pinMode(LED_PIN, OUTPUT);
          lit = false;
          litSince = 0;
        }

        void loop() {
          if (digitalRead(BUTTON_PIN) == LOW && !lit) {           // pressed while idle
            lit = true;
            litSince = millis();                                  // remember when
            digitalWrite(LED_PIN, HIGH);
          }
          if (lit && millis() - litSince >= LIGHT_MS) {           // the time is up
            lit = false;
            digitalWrite(LED_PIN, LOW);
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        LED_PIN = 2
        BUTTON_PIN = 0                   # GPIO9 on ESP32-C3 and C6 boards
        LIGHT_MS = 2000

        button = Pin(BUTTON_PIN, Pin.IN, Pin.PULL_UP)
        led = Pin(LED_PIN, Pin.OUT)
        lit = False
        litSince = 0

        while True:
            if button.value() == 0 and not lit:                   # pressed while idle
                lit = True
                litSince = time.ticks_ms()                        # remember when
                led.value(1)
            if lit and time.ticks_diff(time.ticks_ms(), litSince) >= LIGHT_MS:   # the time is up
                lit = False
                led.value(0)
      `,
      notes: ['While the light is on, a second press is ignored (the `!lit` test). Change that rule — restart the two seconds instead — and you have designed a different state machine.', 'The loop is free all the time, so another timer, such as a blinking heartbeat, could be added without disturbing this one.']
    }
  ],
  examples: [
    {
      title: 'Across the wrap',
      q: 'On a `uint32_t` clock, `last` is 4 294 967 000 and the interval is 500 ms. (a) Is `now - last >= 500` true when `now` is 4 294 967 100? And `now >= last + 500`? (b) How much time has passed when `now` reads 200 after the wrap?',
      steps: [
        'The clock counts modulo $2^{32} = 4\\,294\\,967\\,296$.',
        '(a) The difference is $4\\,294\\,967\\,100 - 4\\,294\\,967\\,000 = 100$, which is below 500: the job does not fire. Correct, only 100 ms have passed.',
        'But $\\text{last} + 500 = 4\\,294\\,967\\,500$ does not fit in 32 bits: it wraps to $4\\,294\\,967\\,500 - 4\\,294\\,967\\,296 = 204$. Then $\\text{now} \\ge 204$ is true, and the job fires 400 ms early.',
        '(b) After the wrap the true elapsed time is $200 + (4\\,294\\,967\\,296 - 4\\,294\\,967\\,000) = 200 + 296 = 496$ ms, and unsigned subtraction $200 - 4\\,294\\,967\\,000$ wraps to exactly 496.'
      ],
      a: '(a) The subtraction form says no, correctly; the absolute comparison says yes, 400 ms too early. (b) 496 ms: the subtraction gives the right answer on both sides of the wrap.'
    }
  ],
  quiz: [
    { q: 'A loop runs three timed jobs without delay(). One of them takes 150 ms every time it runs. What happens to the other two?', choices: ['Nothing: each timer is independent', 'They are held up by up to 150 ms whenever that job runs', 'They run twice as often', 'They stop for good'], a: 1, why: 'The jobs share one loop. While the slow job runs, the loop cannot come round to look at the other clocks, so they run up to 150 ms late. Keep jobs short, or move the slow one to a task.' },
    { q: 'Why is `millis() - last >= interval` safe when millis() wraps to zero, while `millis() >= last + interval` is not?', choices: ['The subtraction uses less memory', 'Unsigned subtraction wraps the same way as the clock and still gives the true elapsed time', 'The addition is slower', 'millis() never wraps'], a: 1, why: 'Both numbers are 32-bit and wrap together, so their difference is the true elapsed time even when one of them has passed zero. The sum last + interval can itself wrap to a small number while the clock is still large, and the job then fires at once.' },
    { q: 'In MicroPython, `if time.ticks_ms() - last > 500:` is a correct way to test elapsed time.', a: false, why: 'ticks_ms() wraps at a power of two and its values are not ordinary integers for subtraction. time.ticks_diff(now, last) takes the wrap into account and must be used for every comparison.' },
    { q: 'A job uses `last = now` instead of `last += interval`. Over an hour, what is the difference?', choices: ['None', 'The period includes the lateness of each pass, so the job drifts and runs slightly less often than wanted', 'It runs more often', 'It runs exactly on time'], a: 1, why: 'With last = now each late pass shifts the next deadline later, and the delays accumulate. last += interval fixes the deadlines on the original rhythm, so the average period is exact.' }
  ],
  applications: [
    'Every sketch that blinks a status LED while it also reads a sensor and talks to a network uses this pattern, or its big brother, tasks.',
    'Timeouts — give up waiting for Wi-Fi after 10 s, switch the screen off after 30 s of no touch — are one-shots like the second program.',
    'Debouncing, long-press detection and double-click detection are timers started by an edge ([[long-press-double-click]]).'
  ],
  sources: [
    'Arduino Language Reference, *millis()* and the "Blink without delay" example.',
    'MicroPython documentation, the *time* module: ticks_ms, ticks_diff and ticks_add (version 1.29).',
    'Espressif, *ESP-IDF Programming Guide*, FreeRTOS and esp_timer: what runs while a task delays.'
  ],
  sim: ['ps-timers', { id: 'ps-variable-box', params: { mode: 'millis' }, title: 'millis() across its wrap' }]
},

/* ================================================================ libraries and imports */
{
  id: 'libraries-and-imports',
  parent: 'program-structure',
  title: 'Libraries and imports',
  level: 1,
  short: 'Almost every program stands on code somebody else wrote. C++ pulls it in with #include and a library manager, Python with import; blocks add it as an extension. Choosing and pinning libraries is part of the craft.',
  keywords: ['library', 'include', 'import', 'module', 'header', 'Library Manager', 'lib_deps', 'mip', 'frozen module', 'extension', 'namespace', 'dependency', 'version', 'licence', 'from import'],
  prereq: ['functions', 'setup-loop-and-main'],
  related: ['arduino-ide-and-the-esp32-core', 'platformio', 'micropython-setup', 'structs-and-classes', 'nvs-and-preferences', 'open-source-licences'],
  body: `Nobody writes a program from nothing. \`digitalWrite\`, \`Serial.println\` and \`time.sleep_ms\` are code that somebody wrote and packed so that you can use it by name. A **library** in C++, a **module** in Python and an **extension** in a block tool are the same thing: a pack of functions (and often classes) for one job — a display, a sensor, a web server.

### Bringing code in

| | Blocks | Arduino C++ | MicroPython |
|---|---|---|---|
| Use a library | add an extension: its blocks appear in the palette | \`#include <Wire.h>\` | \`import machine\` or \`from machine import Pin\` |
| Use your own file | a custom block (*my blocks*) | \`#include "ledtools.h"\` | \`import ledtools\` |
| Names | the blocks of the extension | global, so two libraries can clash | inside the module: \`machine.Pin\` |

In C++ \`#include\` pastes in the library's *header*, which tells the compiler what exists; the compiled code is linked in afterwards. Names are global unless the library hides them in a class or a namespace, and two libraries that define the same name stop the build. In Python \`import\` runs the module once and keeps its names under the module's name; \`from machine import Pin\` brings one name in directly.

### Where libraries come from

- **Shipped with the core or the firmware.** The Arduino core for the ESP32 includes Wire, SPI, WiFi, Preferences, LittleFS, Ticker and more. Official MicroPython builds for the ESP32 carry \`machine\`, \`time\`, \`network\`, and — frozen into the image — \`requests\`, \`neopixel\`, \`dht\`, \`onewire\` and \`ds18x20\`: nothing to install.
- **Installed.** Arduino IDE's Library Manager, PlatformIO's \`lib_deps\` line, the ESP-IDF component manager; in MicroPython \`mip\` fetches a package over Wi-Fi or with \`mpremote\`, and a plain \`.py\` file copied to the board works too.
- **Your own.** When a helper is used twice, move it to its own file: a tab (\`.h\` and \`.cpp\`) in Arduino, a \`.py\` file on the board's file system.

### Choosing a library

Ask: does it support **your chip and your core version** (Arduino core 3.x changed several interfaces, and an old library may not build)? Is it **maintained** — recent releases, answered issues? What is its **licence** ([[open-source-licences]])? Does it **block** with \`delay()\` or work with interrupts and tasks? How much flash and RAM does it take? For a small library, read its source: it is the best documentation. Then **pin the version** so that a rebuild next year gets the code you tested.

### The cost of an import

A C++ library adds only what the program uses to the flash image. A MicroPython import takes time and heap memory at start, which is why frozen modules (kept in flash) are preferred on small chips, and why a script that imports ten modules may fail with a memory error on a board with little RAM.

> [!key] A library is somebody else's tested code for one job: #include and the Library Manager in C++, import in Python, an extension in blocks. Choose by chip support, upkeep, licence and size, and pin the version you tested.`,
  ideas: [
    'A library, a module and an extension are the same idea: packed functions for one job, brought in with #include, import or an extension manager.',
    'C++ names are global, so libraries can clash; Python keeps a module\'s names under the module name.',
    'The core and the MicroPython firmware already contain many libraries: Wire, SPI, WiFi and Preferences; machine, network and requests.',
    'Choose libraries by chip and core support, maintenance, licence and size, and pin the version you tested.'
  ],
  pitfalls: [
    'Any library from the internet works on any ESP32 — It must support your chip and core version. Libraries written for Arduino core 2.x, or for the AVR boards, may not compile or may fail at run time on core 3.x.',
    '#include installs the library — It only names a header that must already be installed. The Library Manager (or lib_deps) does the installing.',
    'More imports are free — Each MicroPython module costs start-up time and heap; each C++ library can add kilobytes of flash.'
  ],
  terms: [
    { term: 'Library', also: ['module', 'package', 'extension'], def: 'A pack of ready-made code for one job — a display, a sensor, a network protocol — that a program uses by name instead of writing the code itself.' },
    { term: 'Header file', also: ['#include', '.h'], def: 'A C++ file that declares the functions and classes of a library. #include pastes it into the program so the compiler knows what exists.' },
    { term: 'Library manager', also: ['Library Manager', 'lib_deps', 'mip'], def: 'The tool that finds, downloads and updates libraries: the Arduino IDE\'s Library Manager, PlatformIO\'s lib_deps, MicroPython\'s mip.' },
    { term: 'Frozen module', also: ['frozen bytecode'], def: 'A MicroPython module compiled into the firmware image and kept in flash, so it takes almost no RAM to load. Official ESP32 builds freeze requests, neopixel, dht and others.' },
    { term: 'Namespace', also: ['module name', 'scope of names'], def: 'A way of keeping the names of a library apart from the names in your program. Python modules are namespaces; most Arduino libraries are not and share one set of global names.' }
  ],
  choose: {
    good: ['A library that ships with the core or the firmware, when it does the job: it is tested with that version', 'A well-maintained library with a recent release, examples and a licence you can live with', 'Your own small helper, when a library would be ten times larger than the need'],
    avoid: ['An abandoned library that has not seen a release since before core 3.x', 'A library that blocks with delay() inside a program that must stay responsive', 'Copying a library into the project without its licence'],
    check: ['That the library lists your chip and the version of the core or firmware you use', 'How much flash and RAM it adds, and whether it allocates in a loop', 'That the version is pinned in the project file, so a rebuild gives the same result']
  },
  code: [
    {
      title: 'Count the boots with a library that ships with the core',
      about: 'Stores a number in the chip\'s non-volatile storage and adds one at every start, so it survives resets and power cuts. The C++ version includes Preferences; the Python version imports esp32.',
      needs: 'An ESP32 DevKit and the serial monitor at 115200 baud: press the reset (EN) button a few times.',
      wiring: [['USB', 'computer', 'for the serial monitor']],
      blocks: `
        when started
          start serial at (115200) baud
          set [boots v] to (((load [boots] or (0))) + (1))      // 0 the very first time
          save (boots) as [boots]                               // survives a reset and a power cut
          print (join [boot number ] (boots))
      `,
      cpp: String.raw`
        #include <Preferences.h>                        // a library that ships with the Arduino core

        Preferences prefs;
        uint32_t boots;

        void setup() {
          Serial.begin(115200);
          prefs.begin("app", false);                    // a namespace, open for reading and writing
          boots = prefs.getUInt("boots", 0) + 1;        // 0 the very first time
          prefs.putUInt("boots", boots);                // survives a reset and a power cut
          prefs.end();
          Serial.println("boot number " + String(boots));
        }

        void loop() {}
      `,
      py: String.raw`
        import esp32                                    # a module built into the firmware

        nvs = esp32.NVS("app")                          # a namespace
        try:
            boots = nvs.get_i32("boots") + 1            # 0 the very first time
        except OSError:                                 # nothing stored yet
            boots = 1
        nvs.set_i32("boots", boots)                     # survives a reset and a power cut
        nvs.commit()                                    # without this the change is lost
        print("boot number " + str(boots))
      `,
      output: `
        boot number 1
        boot number 2
        boot number 3
      `,
      notes: ['Writing once per start is harmless; writing in a fast loop would wear the flash ([[flash-wear]]).', 'The two libraries look different — an object with begin() and end() against a module with get and set — but each does the same four things: open a namespace, read, write, close or commit.', 'Block tools name their storage blocks differently; the page on [[nvs-and-preferences]] has the details.']
    }
  ],
  quiz: [
    { q: 'A sketch starts with `#include <Adafruit_BME280.h>` but the library was never installed. What happens at compile time?', choices: ['The IDE downloads it automatically', 'The compiler stops with a "no such file" error', 'It compiles; the library is loaded at run time', 'It compiles and the sensor reads zero'], a: 1, why: '#include only names a header file that must already exist on the computer. The Library Manager (or lib_deps) installs libraries; the compiler cannot find the header and stops.' },
    { q: 'What is the practical difference between `import machine` and `from machine import Pin` in MicroPython?', choices: ['The second is faster to run', 'After the first you write machine.Pin, after the second just Pin', 'Only the first works on the ESP32', 'There is none'], a: 1, why: 'Both load the module. import keeps its names under the module name; from … import brings the chosen name straight into your program.' },
    { q: 'Two Arduino libraries each define a global function named `begin_display()`. What happens?', choices: ['The program picks the one it needs', 'The build fails with a name clash', 'Python rules apply and they are kept apart', 'The second one is ignored silently'], a: 1, why: 'C++ names are global unless a class or namespace hides them. Two definitions of the same name stop the linker. Python modules avoid the problem by keeping names under the module name.' },
    { q: 'Why does pinning the version of a library matter?', choices: ['It makes the library faster', 'A rebuild later gets the same code you tested, not a newer version that may behave differently', 'It reduces the licence cost', 'The compiler requires it'], a: 1, why: 'Libraries change: an update can rename a function or alter behaviour. Without a pinned version a project that worked last year may not build, or not behave, today.' }
  ],
  applications: [
    'Every sensor, display and radio in this app is driven through a library; the sensor and display pages name the usual ones for each.',
    'Reproducible builds for a product need the whole dependency list pinned: the core, each library and the toolchain ([[versioning-and-releases]]).',
    'Teams keep shared helpers — logging, a timer class, a configuration loader — as their own small libraries.'
  ],
  sources: [
    'Arduino documentation, "Libraries" and the Library Manager; Arduino-ESP32 documentation, the list of libraries that ship with the core (3.3).',
    'MicroPython documentation, "Packages and the mip tool" and the standard library reference for the ESP32 (1.29).',
    'PlatformIO documentation, "Library Dependency Finder" (lib_deps).'
  ]
},

/* ================================================================ errors: return codes and exceptions */
{
  id: 'errors-and-exceptions',
  parent: 'program-structure',
  title: 'Errors: return codes and exceptions',
  level: 2,
  short: 'Things go wrong: a sensor is unplugged, a password is wrong. Arduino C++ mostly reports it through return codes you must remember to check; Python raises exceptions that stop the program unless you catch them. Blocks cannot even be mistyped.',
  keywords: ['error', 'exception', 'try', 'except', 'return code', 'esp_err_t', 'ESP_OK', 'OSError', 'timeout', 'retry', 'safe state', 'traceback', 'syntax error', 'Wire.endTransmission', 'ESP_ERROR_CHECK'],
  prereq: ['functions', 'conditions-and-loops'],
  related: ['i2c', 'i2c-addresses-and-scanning', 'watchdogs', 'guru-meditation-and-backtraces', 'reading-sensors-reliably', 'error-states-and-recovery', 'print-debugging-and-log-levels'],
  body: `A sensor is unplugged, a Wi-Fi password is wrong, a file is missing, a number arrives out of range. A device that is meant to run unattended must notice, decide what to do, and keep going. The three notations treat this differently — and the difference is part of what each is good at.

### Three kinds of error

1. **The program is not valid.** C++ stops at compile time; Python at load time with a \`SyntaxError\`. In blocks it **cannot happen**: pieces snap together only where they fit, with no punctuation to forget — the reason blocks make a good first view of structure.
2. **A valid request fails at run time:** a device does not answer, a division by zero, an index outside a list, no memory left.
3. **The program runs and does the wrong thing** (a \`=\` where \`==\` was meant). Nothing reports it; only tests, prints and thought find it.

### Return codes: the Arduino way

A C++ function reports failure through its return value, and the caller has to look. \`Wire.endTransmission()\` returns 0 for success and 1 to 5 for the ways an I2C transfer can fail (data too long, no answer to the address, no answer to the data, other, timeout). ESP-IDF functions return an \`esp_err_t\`: \`ESP_OK\` or a code such as \`ESP_ERR_NO_MEM\`, which \`esp_err_to_name()\` turns into words. \`ESP_ERROR_CHECK(…)\` stops the program, with a message, on anything but \`ESP_OK\`. A \`File\` that failed to open is false. The weakness is plain: **nothing forces you to look.** An ignored return value is an error that was thrown away.

The default build of the Arduino core for the ESP32 has C++ exceptions switched off, so \`try\`, \`catch\` and \`throw\` are not the way to do it there (ESP-IDF can switch them on, at a price in code size).

### Exceptions: the Python way

A failing operation *raises* an exception: normal flow stops, and Python looks outwards for a \`try\` … \`except\` that handles that kind. \`OSError\` is the one for hardware and system trouble — an I2C device that does not answer, a socket that cannot connect, a file that does not exist; there are also \`ValueError\`, \`KeyError\`, \`IndexError\` and \`MemoryError\`. Uncaught, the exception ends the program with a traceback. On a board that means the prompt returns and **\`main.py\` is not restarted**: a sensor node that hit one unplugged cable sits silent until someone resets it. Unattended MicroPython wraps the main loop in \`try\`/\`except\`, logs, and resets the chip ([[watchdogs]] do the same from outside).

### When nothing checks

A C++ program that ignores a failed allocation or writes outside an array has no exception to stop it: it crashes — a *Guru Meditation Error*, a backtrace, a reset ([[guru-meditation-and-backtraces]]). Hence a defensive style: check return codes, check sizes before copying, give every wait a time limit.

### A method

1. Say what *failure* means for each operation: no answer, out of range, no connection.
2. Detect it: a return code, an exception, a timeout.
3. Respond: retry a few times with a pause, fall back to a default, report, restart.
4. Make failure visible: a log line, a blink code, a flag sent to the server.
5. **Put physical outputs in a safe state** — heater off, motor stopped, valve closed — before anything else.

> [!key] C++ on the Arduino core reports failure through return codes you must remember to check; Python raises exceptions that stop the program unless caught. Either way: decide what failure means, detect it, retry or fall back, make it visible and leave outputs safe.`,
  ideas: [
    'Blocks cannot have syntax errors; C++ reports them at compile time and Python at load time; logic errors are reported by nobody.',
    'Arduino C++ mostly reports failure through return codes (0 for success on Wire, ESP_OK in ESP-IDF) that the caller must check.',
    'Python raises exceptions; an uncaught one stops the program and main.py does not restart by itself.',
    'A robust loop retries a limited number of times, makes the failure visible and leaves outputs in a safe state.'
  ],
  pitfalls: [
    'If I ignore the return value, nothing bad happens — The failure still happened; you only stopped knowing about it. The next line then works on missing data.',
    'try: … except: pass makes a program robust — It hides every error, including the ones that show a real fault. Catch the specific exception and do something: retry, log, reset.',
    'An uncaught exception restarts the program — It stops it. The board waits at the prompt, doing nothing, until it is reset by hand or by a watchdog.'
  ],
  terms: [
    { term: 'Return code', also: ['error code', 'status code', 'esp_err_t'], def: 'A number a function returns to say whether it worked: 0 or ESP_OK for success, other values for the kinds of failure. The caller must check it.' },
    { term: 'Exception', also: ['raise', 'try/except', 'OSError'], def: 'A signal that something failed, raised by Python code. It stops normal flow and unwinds to the nearest try/except that handles it, or ends the program.' },
    { term: 'Timeout', also: ['time limit'], def: 'A limit on how long to wait for something. Without one, a missing reply stops the program for ever.' },
    { term: 'Safe state', also: ['fail-safe'], def: 'The condition outputs are put in when something goes wrong: heaters off, motors stopped, valves closed. The state in which a failure can do no harm.' },
    { term: 'Traceback', also: ['stack trace', 'backtrace'], def: 'The list of function calls that led to an error, printed when an exception is not caught. On the ESP32 the C++ equivalent after a crash is a backtrace in the Guru Meditation report.' }
  ],
  code: [
    {
      title: 'Is the sensor there?',
      about: 'Probes the I2C address of a sensor (0x48, for example a TMP102) and reports the outcome. C++ reads the return code of the transfer, Python catches the exception, blocks ask for a status. With nothing connected the LED lights.',
      needs: 'An ESP32 DevKit. Optional: an I2C sensor at address 0x48 on GPIO21 (SDA) and GPIO22 (SCL). Run it once with the sensor and once without.',
      wiring: [['GPIO21', 'sensor SDA', 'needs pull-ups: most breakout boards have them'], ['GPIO22', 'sensor SCL'], ['GPIO2', 'the on-board LED']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (2) as [output v]
          start I2C on SDA (21) SCL (22)
          set [code v] to (I2C status of address (0x48))        // 0 means the sensor answered
          if <(code) = (0)> then
            print [sensor found]
          else
            print (join [no answer, code ] (code))
            set pin (2) to [HIGH v]                             // LED on: something is wrong
          end
      `,
      cpp: String.raw`
        #include <Wire.h>

        const int LED_PIN = 2;
        const int SDA_PIN = 21;
        const int SCL_PIN = 22;
        const int SENSOR_ADDRESS = 0x48;

        void setup() {
          Serial.begin(115200);
          pinMode(LED_PIN, OUTPUT);
          Wire.begin(SDA_PIN, SCL_PIN);
          Wire.beginTransmission(SENSOR_ADDRESS);
          int code = Wire.endTransmission();                    // 0 means the sensor answered
          if (code == 0) {
            Serial.println("sensor found");
          } else {
            Serial.println("no answer, code " + String(code));
            digitalWrite(LED_PIN, HIGH);                        // LED on: something is wrong
          }
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import Pin, I2C

        LED_PIN = 2
        SDA_PIN = 21
        SCL_PIN = 22
        SENSOR_ADDRESS = 0x48

        led = Pin(LED_PIN, Pin.OUT)
        i2c = I2C(0, scl=Pin(SCL_PIN), sda=Pin(SDA_PIN))
        try:
            i2c.readfrom(SENSOR_ADDRESS, 1)                     # raises OSError when nobody answers
            code = 0                                            # 0 means the sensor answered
        except OSError as err:
            code = err.args[0]
        if code == 0:
            print("sensor found")
        else:
            print("no answer, code " + str(code))
            led.value(1)                                        # LED on: something is wrong
      `,
      output: `
        no answer, code 2
      `,
      notes: ['The numbers are dialects: in the Arduino core 2 means "no answer to the address"; in MicroPython the code is the operating system\'s error number. What matters is that 0 means success.', 'Always write the check: a program that skips it carries on with the sensor "found" and prints zeros.', '[[i2c-addresses-and-scanning]] shows how to find the address of a sensor you do not know.']
    },
    {
      title: 'Try three times, then give up',
      about: 'Asks the sensor up to three times, with a pause between tries, and then reports success or failure. The LED lights when it gives up: a visible failure and a defined end.',
      needs: 'The same board and wiring as the first program.',
      wiring: [['GPIO21', 'sensor SDA'], ['GPIO22', 'sensor SCL'], ['GPIO2', 'the on-board LED']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (2) as [output v]
          start I2C on SDA (21) SCL (22)
          set [MAX_TRIES v] to (3)
          set [tries v] to (0)
          set [ok v] to <false>
          repeat until <<ok> or <(tries) = (MAX_TRIES)>>        // until it worked or we have tried enough
            change [tries v] by (1)
            set [ok v] to <(I2C status of address (0x48)) = (0)>
            if <not <ok>> then
              wait (0.1) seconds                                // give the sensor a moment, then ask again
            end
          end
          if <ok> then
            print [sensor found]
          else
            print (join [giving up after tries: ] (tries))
            set pin (2) to [HIGH v]                             // LED on: safe state, and visible
          end
      `,
      cpp: String.raw`
        #include <Wire.h>

        const int LED_PIN = 2;
        const int SDA_PIN = 21;
        const int SCL_PIN = 22;
        const int SENSOR_ADDRESS = 0x48;
        const int MAX_TRIES = 3;

        void setup() {
          Serial.begin(115200);
          pinMode(LED_PIN, OUTPUT);
          Wire.begin(SDA_PIN, SCL_PIN);
          int tries = 0;
          bool ok = false;
          while (!ok && tries < MAX_TRIES) {                    // until it worked or we have tried enough
            tries++;
            Wire.beginTransmission(SENSOR_ADDRESS);
            ok = (Wire.endTransmission() == 0);
            if (!ok) {
              delay(100);                                       // give the sensor a moment, then ask again
            }
          }
          if (ok) {
            Serial.println("sensor found");
          } else {
            Serial.println("giving up after tries: " + String(tries));
            digitalWrite(LED_PIN, HIGH);                        // LED on: safe state, and visible
          }
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import Pin, I2C
        import time

        LED_PIN = 2
        SDA_PIN = 21
        SCL_PIN = 22
        SENSOR_ADDRESS = 0x48
        MAX_TRIES = 3

        led = Pin(LED_PIN, Pin.OUT)
        i2c = I2C(0, scl=Pin(SCL_PIN), sda=Pin(SDA_PIN))
        tries = 0
        ok = False
        while not ok and tries < MAX_TRIES:                     # until it worked or we have tried enough
            tries += 1
            try:
                i2c.readfrom(SENSOR_ADDRESS, 1)
                ok = True
            except OSError:
                time.sleep_ms(100)                              # give the sensor a moment, then ask again
        if ok:
            print("sensor found")
        else:
            print("giving up after tries: " + str(tries))
            led.value(1)                                        # LED on: safe state, and visible
      `,
      output: `
        giving up after tries: 3
      `,
      notes: ['The same pattern guards a Wi-Fi connection or a web request: a limited number of tries, a pause, a visible failure ([[wifi-events-and-reconnection]]).', 'A retry loop must have its limit: without MAX_TRIES a missing sensor holds the program here for ever.']
    }
  ],
  quiz: [
    { q: 'Which kind of error can a block program not have?', choices: ['A run-time error', 'A syntax error', 'A logic error', 'A timeout'], a: 1, why: 'Blocks only snap together where they fit, so there is no way to misplace a bracket or forget a colon. A block program can still wait for something that never happens or compute the wrong thing.' },
    { q: 'A MicroPython `main.py` reads an I2C sensor in its loop, with no try/except. The cable is pulled out. What does the board do?', choices: ['Carries on with zeros', 'Restarts main.py by itself', 'Stops with a traceback and waits at the prompt', 'Reboots at once'], a: 2, why: 'The OSError is not caught, so it ends the program. MicroPython does not restart main.py; the board sits at the prompt until someone resets it. Wrap the loop in try/except, or use a watchdog.' },
    { q: 'In the default Arduino core for the ESP32, `try` and `catch` are the usual way to handle a failing I2C transfer.', a: false, why: 'C++ exceptions are switched off in the default build; the usual way is to check the return code of Wire.endTransmission() and of other calls.' },
    { q: 'A heater controller cannot read its temperature sensor. Which response is wrong?', choices: ['Retry a few times', 'Switch the heater off and show an error', 'Keep the heater at its last setting until the sensor comes back', 'Report the fault to the server'], a: 2, why: 'With no measurement the controller is blind: the heater could run until something burns. The safe response is to switch outputs off, report, and retry. Keeping the last setting is the dangerous choice.' }
  ],
  applications: [
    'Sensor drivers return a status with every reading so that the application can tell "21.5 °C" from "no answer" ([[reading-sensors-reliably]]).',
    'Wi-Fi and cloud code retries with a pause, limits the number of tries, and falls back to storing data locally ([[store-and-forward]]).',
    'Production firmware logs every failure with a reason and resets itself into a known state when it cannot recover ([[error-states-and-recovery]]).'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "Error Handling": esp_err_t, ESP_ERROR_CHECK and the error-name functions.',
    'Arduino-ESP32 documentation, the Wire (I2C) API: the return values of endTransmission().',
    'The Python Language Reference, "Errors and exceptions"; MicroPython documentation for OSError and the machine.I2C class.'
  ]
},
/* ================================================================ structs and classes */
{
  id: 'structs-and-classes',
  parent: 'program-structure',
  title: 'Structs and classes',
  level: 2,
  short: 'When several variables belong together — a timer\'s interval and its last time, a button\'s pin and state — group them. A struct holds the values; a class holds the values and the functions that work on them; an object is one of them at work.',
  keywords: ['struct', 'class', 'object', 'method', 'constructor', 'member', 'attribute', 'self', 'this', 'public', 'private', 'instance', '__init__', 'encapsulation', 'dict', 'timer object'],
  prereq: ['functions', 'variables-and-types', 'non-blocking-timing'],
  related: ['state-machine-in-code', 'libraries-and-imports', 'readable-code', 'stack-heap-and-static', 'several-machines-together'],
  body: `Real programs handle *things* that have several properties: a button has a pin, a last state and a press count; a timer has an interval and the time it last fired. Held in loose variables — \`lastBlink\`, \`blinkMs\`, \`lastReport\`, \`reportMs\` — they multiply and tangle: every new job copies a group of names. The cure is to bundle them. A **struct** groups related values under one name; a **class** also bundles the functions that work on those values; an **object** is one thing made from a class, with values of its own.

### From loose variables to an object

The timing page needed two variables and a comparison for every job. Written once as a class, the whole pattern becomes \`Every blink(500);\` and \`if (blink.due()) { … }\`: the object remembers its own interval and last time, and the comparison hides inside the method. Each new job costs one line, not three variables. The program below does exactly this.

### Spelled three ways

| | Blocks | Arduino C++ | MicroPython |
|---|---|---|---|
| Group values | variables with a common name | \`struct Button { int pin; bool wasDown; };\` | a class, or a dictionary |
| Define a class | custom blocks around one variable per object | \`class Every { … };\` | \`class Every:\` |
| Make an object | \`(new timer every (500) ms)\` | \`Every blink(500);\` | \`blink = Every(500)\` |
| Use it | \`<timer (blink) is due?>\` | \`blink.due()\` | \`blink.due()\` |

Blocks have no classes of their own: a block tool shows an object as one block that gives back "a thing", and its methods as blocks that take that thing as input — the program below says so in words inside the blocks.

### The pieces of a class

- **Members** (C++) or **attributes** (Python): the values inside — \`interval\`, \`last\`.
- **Methods:** the functions that belong to the class — \`due()\`.
- **Constructor:** the function that runs when an object is made and sets its first values: \`Every(uint32_t intervalMs)\` in C++, \`__init__(self, intervalMs)\` in Python.
- **Hiding:** C++ marks members \`private\` so that only the class's methods can touch them; Python uses a leading underscore as a polite request. In C++ a \`struct\` is a class whose members are public by default: use a struct for plain data and a class when there are rules to keep.
- **\`this\` and \`self\`:** the object a method is working on. Python writes \`self\` out in every method and every attribute (\`self.last\`); forget it and you create an ordinary local variable that vanishes at the return.

~~~cpp
struct Reading {              // plain data: a struct is enough
  uint32_t at;                // millis() when it was taken
  int raw;                    // 0 to 4095
};
~~~

### You have met objects already

\`Serial\`, \`Wire\`, \`WiFi\`, \`Preferences prefs;\` and \`String\` are objects; so is \`led = Pin(2, Pin.OUT)\` in MicroPython, with its method \`led.value(1)\`. A library is very often a class whose constructor takes the pins.

### Costs and limits

A C++ object is as small as its members; a global one lives as long as the program, a local one on the stack, and one made with \`new\` on the heap — avoid that in programs that run for months ([[stack-heap-and-static]]). A MicroPython object carries a table of its attributes and costs more RAM. And do not build classes for ten lines of code: reach for one when you catch yourself copying a group of variables.

> [!key] A struct groups related values; a class adds the functions that use them; an object is one live instance. Wrapping "remember when, compare, act" in a class turns three variables per job into one line.`,
  ideas: [
    'A struct groups values that belong together; a class also holds the functions that work on them; an object is one instance with its own values.',
    'A constructor sets an object\'s first values; methods work on the values of the object they are called on.',
    'In Python every method names its object, self, and every attribute is reached through it; forgetting self creates an unrelated local variable.',
    'Wrapping the clock-watching pattern in a class turns three variables per job into one line.'
  ],
  pitfalls: [
    'A struct and a class are completely different in C++ — They differ only in that members are public by default in a struct and private in a class. Both can have methods.',
    'In a Python method, last = now stores the time in the object — It sets a local variable that disappears at the return. The object\'s attribute is self.last.',
    'Classes make every program better — For a dozen lines they add ceremony. Use one when a group of variables and functions is repeated, or when an object must protect its own rules.'
  ],
  terms: [
    { term: 'Struct', also: ['record', 'structure'], def: 'A group of related values of different types under one name. In C++ a struct is a class whose members are public by default.' },
    { term: 'Class', also: ['type of object'], def: 'A description of a kind of object: the values it holds and the functions that work on them. Objects are made from a class.' },
    { term: 'Object', also: ['instance'], def: 'One live thing made from a class, holding its own values. Every Every blink(500); creates an object with its own interval and last time.' },
    { term: 'Method', also: ['member function'], def: 'A function that belongs to a class and works on one object\'s values. It is called on the object: blink.due().' },
    { term: 'Constructor', also: ['__init__'], def: 'The method that runs when an object is made and sets its first values: Every(500) in C++, __init__ in Python.' },
    { term: 'Attribute', also: ['member', 'field', 'property'], def: 'A value that belongs to an object: self.interval in Python, the member interval in C++.' }
  ],
  code: [
    {
      title: 'A timer as an object',
      about: 'The clock-watching pattern wrapped in a class called Every. Two objects — one blinking the LED every 500 ms, one counting seconds — are made in one line each and asked whether they are due.',
      needs: 'An ESP32 DevKit with its LED on GPIO2 and the serial monitor at 115200 baud.',
      wiring: [['GPIO2', 'the on-board LED', 'or: GPIO2 → 220 Ω → LED → GND']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (2) as [output v]
          set [blink v] to (new timer every (500) ms)          // an object: it remembers its own interval and last time
          set [report v] to (new timer every (1000) ms)
          set [ledOn v] to <false>
          set [seconds v] to (0)
        forever
          if <timer (blink) is due?> then                      // ask the object: it does the comparing
            set [ledOn v] to <not <ledOn>>
            set pin (2) to (ledOn)
          end
          if <timer (report) is due?> then
            change [seconds v] by (1)
            print (seconds)
          end
        end
      `,
      cpp: String.raw`
        const int LED_PIN = 2;

        class Every {                                // a timer object: it remembers its own interval and last time
         public:
          Every(uint32_t intervalMs) : interval(intervalMs), last(millis()) {}
          bool due() {                               // timer is due?
            uint32_t now = millis();
            if (now - last >= interval) {
              last += interval;
              return true;
            }
            return false;
          }
         private:
          uint32_t interval;
          uint32_t last;
        };

        Every blink(500);                            // new timer every (500) ms
        Every report(1000);
        bool ledOn;
        int seconds;

        void setup() {
          Serial.begin(115200);
          pinMode(LED_PIN, OUTPUT);
          ledOn = false;
          seconds = 0;
        }

        void loop() {
          if (blink.due()) {                         // ask the object: it does the comparing
            ledOn = !ledOn;
            digitalWrite(LED_PIN, ledOn);
          }
          if (report.due()) {
            seconds++;
            Serial.println(seconds);
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        LED_PIN = 2

        class Every:                                 # a timer object: it remembers its own interval and last time
            def __init__(self, intervalMs):
                self.interval = intervalMs
                self.last = time.ticks_ms()

            def due(self):                           # timer is due?
                now = time.ticks_ms()
                if time.ticks_diff(now, self.last) >= self.interval:
                    self.last = time.ticks_add(self.last, self.interval)
                    return True
                return False

        led = Pin(LED_PIN, Pin.OUT)
        blink = Every(500)                           # new timer every (500) ms
        report = Every(1000)
        ledOn = False
        seconds = 0

        while True:
            if blink.due():                          # ask the object: it does the comparing
                ledOn = not ledOn
                led.value(ledOn)
            if report.due():
                seconds += 1
                print(seconds)
      `,
      output: `
        1
        2
        3
        …
      `,
      notes: ['Add a third job — `Every poll(20);` and an `if (poll.due())` — and the rest of the program does not change: that is what the class bought.', 'Blocks tools differ in how they show objects: some give each object a variable, some a list of timers. The line `new timer every (500) ms` stands for whichever way your tool does it.']
    }
  ],
  quiz: [
    { q: 'What does `Every blink(500);` at the top of a C++ sketch do?', choices: ['Declares a function called blink', 'Makes one Every object called blink, calling the constructor with 500', 'Waits 500 ms', 'Starts a hardware timer'], a: 1, why: 'A class name followed by a variable name and arguments makes an object; the constructor receives the arguments and sets the object\'s first values.' },
    { q: 'In a Python class, a method does `last = time.ticks_ms()` where it meant to remember the time in the object. What happens?', choices: ['The object remembers it', 'A local variable is set and thrown away at the return; the object is unchanged', 'Python raises a SyntaxError', 'The time is stored in every object'], a: 1, why: 'Only self.last refers to the object\'s attribute. A bare last inside a method is an ordinary local variable.' },
    { q: 'In C++ a struct cannot have methods.', a: false, why: 'A struct is almost the same as a class: it can have methods and a constructor. The one difference is that its members are public unless marked otherwise.' },
    { q: 'Why does an `Every` class help when a program has six timed jobs?', choices: ['It makes the CPU faster', 'Each job needs one line to create its timer and one to ask it, instead of three variables and a comparison', 'It removes the need for a clock', 'It runs the jobs in parallel'], a: 1, why: 'The interval, the last time and the comparison live inside the class once. The program then repeats only the one-line use for each job, which is shorter and harder to get wrong.' }
  ],
  applications: [
    'Almost every sensor and display library is a class: you make a `display` object with its pins and then call its methods.',
    'A button class with debouncing and long-press detection serves every button of a panel with one definition ([[long-press-double-click]]).',
    'A state machine is a natural class: it holds the current state and the time it was entered, and its methods are the events ([[state-machine-in-code]]).'
  ],
  sources: [
    'Bjarne Stroustrup, *A Tour of C++*: classes, constructors and structures.',
    'The Python Tutorial, "Classes"; MicroPython documentation, "MicroPython differences from CPython" (what differs in classes).',
    'Arduino documentation, "Writing a library for Arduino": a class with a constructor and methods.'
  ]
},

/* ================================================================ bits, bytes and hexadecimal */
{
  id: 'bits-and-bytes',
  parent: 'program-structure',
  title: 'Bits, bytes and hexadecimal',
  level: 2,
  short: 'Registers, sensors and radio packets all speak in bits: binary, hexadecimal, masks and shifts, setting and clearing one bit, and reading a negative number from two bytes. The vocabulary for reading any datasheet.',
  keywords: ['bit', 'byte', 'binary', 'hexadecimal', 'hex', 'bit mask', 'shift', 'AND', 'OR', 'XOR', 'two\'s complement', 'register', 'endianness', 'big-endian', 'bitRead', 'bitSet', 'signed', 'MPU-6050', 'TMP102'],
  prereq: ['variables-and-types', 'arrays-and-lists'],
  related: ['registers-and-datasheets', 'i2c', 'electronics:binary-numbers', 'math:number-systems', 'gpio-matrix-and-io-mux', 'efuses'],
  body: `Everything a microcontroller handles is, in the end, a pattern of bits. A **bit** is a 0 or a 1, a **byte** is eight of them, and the chip's peripherals — and most sensors — are controlled through **registers**: bytes whose individual bits each mean something. To ask a temperature sensor for a reading you read two bytes; to wake a motion sensor you clear one bit. This page is the vocabulary for that.

### One number, three spellings

| Decimal | Hexadecimal | Binary |
|---|---|---|
| 10 | 0x0A | 0b00001010 |
| 100 | 0x64 | 0b01100100 |
| 255 | 0xFF | 0b11111111 |

Each hexadecimal digit stands for exactly four bits, so a byte is two hex digits — which is why datasheets write addresses and registers in hex. C++ and Python both accept \`0x4B\` and \`0b01001011\`; blocks write \`(0x4B)\`. See [[electronics:binary-numbers|binary numbers]] for the arithmetic.

### The operators

| | C++ and Python | What it does |
|---|---|---|
| AND | \`a & b\` | keeps the bits that are 1 in both |
| OR | \`a \\| b\` | sets the bits that are 1 in either |
| XOR | \`a ^ b\` | flips the bits where b has a 1 |
| NOT | \`~a\` | flips every bit |
| Shift | \`a << n\`, \`a >> n\` | slides the bits left or right: multiplies or divides by 2ⁿ |

Do not mix up \`&\` with \`&&\`: the single one works on the bits of a number, the double on true and false.

### Four things to do to one bit

With \`n\` the bit number, counting from 0 at the right, \`1 << n\` builds a **mask**: a number with only bit n set. Then:

- **set** the bit: \`reg |= (1 << n)\`
- **clear** it: \`reg &= ~(1 << n)\`
- **toggle** it: \`reg ^= (1 << n)\`
- **test** it: \`(reg >> n) & 1\`

The Arduino core also has \`bitSet\`, \`bitClear\`, \`bitRead\` and \`bitWrite\` for these. The first program below plays them on a real register: bit 6 of the power register of the MPU-6050 motion sensor puts the chip to sleep — it starts asleep, as 0x40 — and bit 3 switches off its temperature sensor. The simulation lets you click the bits.

### Mind the width

In C++, \`~x\` on a \`uint8_t\` is worked out as a full \`int\` and cut down again when stored. Python integers have no width: \`~0x0F\` is −16, not 0xF0, so mask with \`& 0xFF\` when you want eight bits.

### Negative numbers: two's complement

A signed number keeps its sign in the top bit, which counts as −2ⁿ⁻¹ instead of +2ⁿ⁻¹. In 8 bits 0xFF is −1 and 0x80 is −128. A 16-bit sensor reading of 0xFFEA is 65 514 as an unsigned number and −22 as a signed one. C++ does the sign for you if you cast: \`int16_t v = (int16_t)((hi << 8) | lo);\`. Python needs a step: subtract 65 536 when the value is 32 768 or more, or use \`struct.unpack(">h", data)\`.

### Byte order and justified fields

Most I2C sensors send the high byte first (big-endian); a few send the low byte first, and the ESP32's own memory is little-endian. Some sensors also keep a short number *left-justified* in a longer register — the TMP102's 12-bit temperature sits in the top 12 bits of 16 — so the second program shifts it into place first. Read the datasheet for both.

> [!key] A register is a byte of switches: use a mask to set, clear, toggle or test one bit without disturbing the others. Assemble multi-byte values from the high byte first, shift left-justified fields into place, and turn the sign bit into a negative number with two's complement.`,
  ideas: [
    'A hexadecimal digit is four bits, so a byte is two hex digits; datasheets use hex for that reason.',
    'A mask — 1 << n — lets AND, OR, XOR and a shift test, set, clear and toggle one bit without touching the rest.',
    'A signed number in two\'s complement has its sign in the top bit: subtract 2 to the power of the width when that bit is set.',
    'Check the byte order and the justification of every multi-byte register in the datasheet before assembling it.'
  ],
  pitfalls: [
    'a & b and a && b are the same — & works on every bit of two numbers; && asks whether both are true. 6 & 1 is 0, but 6 && 1 is true.',
    '~x in Python gives the byte with its bits flipped — Python integers have no width, so ~0x0F is −16. Mask with & 0xFF to keep eight bits.',
    'A 16-bit sensor value is just (hi << 8) | lo — It is unsigned. For a sensor that reports negative values the result must be read as signed, or 0xFFEA shows as 65 514 instead of −22.'
  ],
  terms: [
    { term: 'Bit', also: ['byte', 'binary digit'], def: 'The smallest unit of information: a 0 or a 1. Eight bits make a byte, which holds 0 to 255 as an unsigned number.' },
    { term: 'Hexadecimal', also: ['hex', '0x'], def: 'Counting in base 16 with the digits 0–9 and A–F. One hex digit is four bits, so two digits write a byte: 0xFF is 255.' },
    { term: 'Bit mask', also: ['mask'], def: 'A number whose set bits pick out the bits of interest in another number: 1 << 3 is 0b00001000, a mask for bit 3. Combined with &, |, ^ it tests, sets or flips those bits.' },
    { term: 'Shift', also: ['<<', '>>'], def: 'Sliding all the bits of a number to the left or right by n places, filling with zeros: a left shift multiplies by 2ⁿ, a right shift divides by 2ⁿ.' },
    { term: 'Two\'s complement', also: ['signed integer', 'sign bit'], def: 'The way computers store negative whole numbers: the top bit has the negative weight, so in 8 bits 0xFF is −1 and 0x80 is −128.' },
    { term: 'Endianness', also: ['byte order', 'big-endian', 'little-endian'], def: 'The order in which the bytes of a multi-byte number are sent or stored: high byte first is big-endian, low byte first little-endian.' }
  ],
  code: [
    {
      title: 'Set, clear, toggle and test the bits of a register',
      about: 'Plays the four bit operations on the power-management register of an MPU-6050 (register 0x6B), held in a variable: wake the chip by clearing bit 6, switch off its temperature sensor by setting bit 3, test the bit, toggle bit 0. No sensor is needed.',
      needs: 'An ESP32 DevKit and the serial monitor at 115200 baud.',
      wiring: [['USB', 'computer', 'for the serial monitor']],
      blocks: `
        when started
          start serial at (115200) baud
          set [SLEEP_BIT v] to (6)                     // bit numbers in PWR_MGMT_1 (register 0x6B) of an MPU-6050
          set [TEMP_DIS_BIT v] to (3)
          set [reg v] to (0x40)                        // the value after power-up: the chip is asleep
          print (format [reg = 0x%02X] with (reg))
          set [reg v] to (bit-and (reg) (bit-not (shift left (1) by (SLEEP_BIT))))   // clear a bit: wake the chip up
          print (format [reg = 0x%02X] with (reg))
          set [reg v] to (bit-or (reg) (shift left (1) by (TEMP_DIS_BIT)))           // set a bit: switch the temperature sensor off
          print (format [reg = 0x%02X] with (reg))
          if <(bit-and (shift right (reg) by (TEMP_DIS_BIT)) (1)) = (1)> then        // test a bit
            print [temperature sensor is off]
          end
          set [reg v] to (bit-xor (reg) (shift left (1) by (0)))                     // toggle a bit (here the lowest one)
          print (format [reg = 0x%02X] with (reg))
      `,
      cpp: String.raw`
        const int SLEEP_BIT = 6;               // bit numbers in PWR_MGMT_1 (register 0x6B) of an MPU-6050
        const int TEMP_DIS_BIT = 3;

        uint8_t reg;

        void setup() {
          Serial.begin(115200);
          reg = 0x40;                          // the value after power-up: the chip is asleep
          Serial.printf("reg = 0x%02X\n", reg);
          reg &= ~(1 << SLEEP_BIT);            // clear a bit: wake the chip up
          Serial.printf("reg = 0x%02X\n", reg);
          reg |= (1 << TEMP_DIS_BIT);          // set a bit: switch the temperature sensor off
          Serial.printf("reg = 0x%02X\n", reg);
          if ((reg >> TEMP_DIS_BIT) & 1) {     // test a bit
            Serial.println("temperature sensor is off");
          }
          reg ^= (1 << 0);                     // toggle a bit (here the lowest one)
          Serial.printf("reg = 0x%02X\n", reg);
        }

        void loop() {}
      `,
      py: String.raw`
        SLEEP_BIT = 6                          # bit numbers in PWR_MGMT_1 (register 0x6B) of an MPU-6050
        TEMP_DIS_BIT = 3

        reg = 0x40                             # the value after power-up: the chip is asleep
        print("reg = 0x%02X" % reg)
        reg &= ~(1 << SLEEP_BIT)               # clear a bit: wake the chip up
        print("reg = 0x%02X" % reg)
        reg |= (1 << TEMP_DIS_BIT)             # set a bit: switch the temperature sensor off
        print("reg = 0x%02X" % reg)
        if (reg >> TEMP_DIS_BIT) & 1:          # test a bit
            print("temperature sensor is off")
        reg ^= (1 << 0)                        # toggle a bit (here the lowest one)
        print("reg = 0x%02X" % reg)
      `,
      output: `
        reg = 0x40
        reg = 0x00
        reg = 0x08
        temperature sensor is off
        reg = 0x09
      `,
      notes: ['On a real sensor the same lines are wrapped between a read of the register and a write back to it ([[registers-and-datasheets]]).', 'Block tools usually offer these operations as blocks of their own; the names here (bit-and, shift left …) are this app\'s way of writing them.']
    },
    {
      title: 'Decode a temperature register',
      about: 'A TMP102 sends its temperature as two bytes: 12 bits, two\'s complement, left-justified, 0.0625 °C per step. The program assembles the bytes 0xE7 0x00 and finds the temperature — below zero. Change hi to 0x19 for +25 °C.',
      needs: 'An ESP32 DevKit and the serial monitor at 115200 baud. No sensor is needed: the two bytes are written into the program.',
      wiring: [['USB', 'computer', 'for the serial monitor']],
      blocks: `
        when started
          start serial at (115200) baud
          set [hi v] to (0xE7)                         // the two bytes read from register 0x00 of a TMP102
          set [lo v] to (0x00)
          set [raw v] to (bit-or (shift left (hi) by (4)) (shift right (lo) by (4)))   // 12 bits, left-justified in 16
          if <(bit-and (raw) (0x800)) ≠ (0)> then      // bit 11 is the sign bit
            change [raw v] by (-4096)                  // two's complement: subtract 2^12
          end
          set [celsius v] to ((raw) * (0.0625))        // each step is 1/16 of a degree
          print (format [%.2f C] with (celsius))
      `,
      cpp: String.raw`
        void setup() {
          Serial.begin(115200);
          uint8_t hi = 0xE7;                   // the two bytes read from register 0x00 of a TMP102
          uint8_t lo = 0x00;
          int raw = (hi << 4) | (lo >> 4);     // 12 bits, left-justified in 16
          if (raw & 0x800) {                   // bit 11 is the sign bit
            raw -= 4096;                       // two's complement: subtract 2^12
          }
          float celsius = raw * 0.0625;        // each step is 1/16 of a degree
          Serial.printf("%.2f C\n", celsius);
        }

        void loop() {}
      `,
      py: String.raw`
        hi = 0xE7                              # the two bytes read from register 0x00 of a TMP102
        lo = 0x00
        raw = (hi << 4) | (lo >> 4)            # 12 bits, left-justified in 16
        if raw & 0x800:                        # bit 11 is the sign bit
            raw -= 4096                        # two's complement: subtract 2^12
        celsius = raw * 0.0625                 # each step is 1/16 of a degree
        print("%.2f C" % celsius)
      `,
      output: `
        -25.00 C
      `,
      notes: ['To read the real sensor, fetch the two bytes over I2C: register 0x00 at address 0x48 ([[i2c]]).', 'Skip the sign step and the same bytes read as 3696 steps, +231 °C: the commonest bug in sensor drivers.']
    }
  ],
  examples: [
    {
      title: 'A gyroscope reading',
      q: 'A motion sensor returns the two bytes 0xFF (high) and 0xEA (low) for one axis, as a signed 16-bit number. What is the value?',
      steps: ['Assemble: $(0xFF \\ll 8) \\mid 0xEA = 0xFFEA = 65\\,514$ as an unsigned number.', 'The top bit (bit 15) is set, so the number is negative: subtract $2^{16} = 65\\,536$.', '$65\\,514 - 65\\,536 = -22$.'],
      a: '−22. In C++, `(int16_t)((hi << 8) | lo)` gives it directly; in Python subtract 65 536 when the value is 32 768 or more.'
    }
  ],
  quiz: [
    { q: 'What does `reg &= ~(1 << 3);` do to a register variable?', choices: ['Sets bit 3', 'Clears bit 3 and leaves the others alone', 'Toggles bit 3', 'Clears every bit except bit 3'], a: 1, why: '1 << 3 is the mask 0b00001000; ~ flips it to 0b11110111; AND with that keeps every bit except bit 3, which becomes 0.' },
    { q: 'A 12-bit two\'s-complement reading is 0xE70 (3696). Which value does it represent?', choices: ['3696', '−400', '−3696', '400'], a: 1, why: 'Bit 11 is set, so the number is negative: 3696 − 4096 = −400. With the TMP102\'s 0.0625 °C per step that is −25 °C.' },
    { q: 'In Python `~0x0F` equals 0xF0.', a: false, why: 'Python integers have no fixed width, so ~0x0F is −16 (an endless run of 1 bits in front of 0xF0). Write ~0x0F & 0xFF to get 0xF0.' },
    { q: 'A sensor register holds the bytes 0xFF 0xEA, read as a signed 16-bit value. What is it?', choices: ['65 514', '−22', '−65 514', '22'], a: 1, why: '0xFFEA is 65 514 unsigned. The sign bit is set, so subtract 65 536: −22.' }
  ],
  applications: [
    'Configuring a sensor or a peripheral means reading a register, changing a few bits with masks, and writing it back.',
    'I/O expanders and shift registers hand eight pins to the program as one byte, one bit per pin ([[io-expanders-and-shift-registers]]).',
    'Compact radio and logging formats pack flags and small numbers into single bytes; checksums and CRCs work on the bits of every byte ([[data-formats]]).'
  ],
  sources: [
    'Texas Instruments, *TMP102* datasheet: the temperature register (12-bit two\'s complement, 0.0625 °C per step).',
    'InvenSense, *MPU-6000 and MPU-6050 Register Map and Descriptions*: the PWR_MGMT_1 register (0x6B).',
    'Arduino Language Reference, "Bits and Bytes" (bitRead, bitSet, bitClear, bitWrite) and "Bitwise operators"; The Python Language Reference, bitwise operations.'
  ],
  sim: ['ps-bits', { id: 'ps-bits', params: { mode: 'twos' }, title: 'A signed register' }]
},

/* ================================================================ translating between blocks, C++ and Python */
{
  id: 'translating-between-languages',
  parent: 'program-structure',
  title: 'Translating between blocks, C++ and Python',
  level: 2,
  short: 'A table of equivalents — pinMode and Pin, delay and sleep_ms, analogRead and read_u16 — and a method for porting a sketch from one language to another, with the ranges, units and habits that differ.',
  keywords: ['port', 'translate', 'convert', 'equivalents', 'pinMode', 'digitalWrite', 'delay', 'millis', 'analogRead', 'read_u16', 'ledcWrite', 'duty_u16', 'random', 'map', 'constrain', 'Arduino to MicroPython'],
  prereq: ['setup-loop-and-main', 'variables-and-types', 'functions'],
  related: ['choosing-a-framework', 'block-programming-tools', 'micropython-setup', 'readable-code', 'esphome'],
  body: `You will meet a sketch you want in Python, or a MicroPython example you want in C++, or a block program from a classroom that has to become a product. The three notations express the same ideas, so translating is mostly looking things up — and then checking the places where the two sides disagree about **ranges, units and habits**.

### Table of equivalents

| Idea | Blocks | Arduino C++ | MicroPython |
|---|---|---|---|
| Pin as output | \`set pin (2) as [output v]\` | \`pinMode(2, OUTPUT);\` | \`led = Pin(2, Pin.OUT)\` |
| Input with pull-up | \`set pin (0) as [input with pull-up v]\` | \`pinMode(0, INPUT_PULLUP);\` | \`button = Pin(0, Pin.IN, Pin.PULL_UP)\` |
| Write a pin | \`set pin (2) to [HIGH v]\` | \`digitalWrite(2, HIGH);\` | \`led.value(1)\` |
| Read a pin | \`(read pin (0))\` | \`digitalRead(0)\` | \`button.value()\` |
| Wait | \`wait (0.5) seconds\` | \`delay(500);\` | \`time.sleep_ms(500)\` |
| Clock | \`(milliseconds since start)\` | \`millis()\` | \`time.ticks_ms()\` |
| Elapsed time | \`((now) - (last)) ≥ (500)\` | \`now - last >= 500\` | \`time.ticks_diff(now, last) >= 500\` |
| Print | \`print (x)\` | \`Serial.println(x);\` | \`print(x)\` |
| Analogue in | \`(analog read pin (34))\` | \`analogRead(34)\` | \`ADC(Pin(34), atten=ADC.ATTN_11DB).read_u16()\` |
| PWM out | \`set PWM on pin (2) to (128)\` | \`ledcAttach(2, 5000, 8);\` then \`ledcWrite(2, 128);\` | \`PWM(Pin(2), freq=5000)\` then \`.duty_u16(32768)\` |
| Random 1 to 6 | \`(random (1) to (6))\` | \`random(1, 7)\` | \`random.randint(1, 6)\` |
| Rescale | \`(map (x) from (0) (4095) to (0) (100))\` | \`map(x, 0, 4095, 0, 100)\` | \`x * 100 // 4095\` |
| Limit | — | \`constrain(x, 0, 100)\` | \`min(max(x, 0), 100)\` |

### Where the two sides disagree

- **Ranges.** \`analogRead\` gives 0–4095 (12 bits); MicroPython's \`read_u16()\` gives 0–65535 whatever the converter's real width. \`ledcWrite\` takes 0 to 2ⁿ−1 for the resolution you chose; \`duty_u16\` always 0–65535. Rescale every number that crosses.
- **Units.** \`delay\` takes milliseconds; Python's plain \`time.sleep\` takes seconds (a float), \`sleep_ms\` milliseconds. Blocks wait in seconds.
- **Upper limits.** \`random(1, 7)\` stops *before* 7; \`randint(1, 6)\` includes 6.
- **Integers.** C++ numbers wrap and divide to whole numbers; Python's grow and \`/\` gives fractions ([[variables-and-types]]). The clock needs \`ticks_diff\` in Python, plain subtraction in C++.
- **Speed.** MicroPython runs the same loop much more slowly than compiled C++ — as a rough guide ten to a hundred times for tight loops — so timing-critical work (bit-banged protocols, fast interrupts) stays in C++.
- **What may not exist.** Not every Arduino library has a MicroPython twin, and the official ESP32 MicroPython has no CAN (TWAI) driver: say so in the port.

### A method for porting a sketch

1. **Say what it does in words:** the hardware, the pins, the events, the state it keeps.
2. **List the variables** with their types and ranges. Any that rely on wrapping (a \`uint8_t\` counter, \`millis()\`) need a mask or \`ticks_diff\` in Python.
3. **Move the structure:** the lines of \`setup()\` go to the top of the file, \`loop()\` becomes \`while True:\`, functions become \`def\`, globals changed in functions need \`global\`.
4. **Translate each call** by the table and check ranges and units on every line.
5. **Replace the libraries:** find the module that does the job, or write the register traffic from the datasheet.
6. **Test side by side** with prints: the same input must give the same numbers.
7. **Check the timing:** how long one pass of the loop takes now, and whether anything blocks.

> [!key] The three notations are one program in three spellings: translate call by call, and then check ranges (4095 against 65535), units (ms against s), limits (random's upper bound) and habits (wrap-around, speed). Test the port beside the original.`,
  ideas: [
    'Every block, C++ call and MicroPython call for the same job can be looked up in a table; the structure carries over line by line.',
    'Numbers that cross between languages must be rescaled: analogRead is 0–4095, read_u16 is 0–65535; ledcWrite uses the resolution you chose, duty_u16 always 16 bits.',
    'Units and limits differ: milliseconds against seconds, random(1, 7) against randint(1, 6).',
    'Port by stating what the program does, listing variables and ranges, translating call by call, and testing both versions with the same input.'
  ],
  pitfalls: [
    'analogRead(34) and adc.read_u16() return the same number — They return the same reading on different scales: 0–4095 and 0–65535. A threshold copied across is 16 times off.',
    'random(1, 6) throws a die — It gives 1 to 5: the upper bound is excluded. Use random(1, 7). Python\'s randint(1, 6) includes the 6.',
    'A literal port is always correct — It can be slow or wrong where the languages differ: a uint8_t that was meant to wrap, a loop that was fast in C++, a library that does not exist.'
  ],
  terms: [
    { term: 'Port', also: ['porting', 'translate'], def: 'To rewrite a program in another language or for another platform so that it does the same thing, preserving what it does rather than how it is written.' },
    { term: 'Duty range', also: ['PWM resolution'], def: 'The span of numbers a PWM function accepts for "fully off" to "fully on": 0 to 2ⁿ−1 for n bits in Arduino\'s ledcWrite, always 0 to 65535 for MicroPython\'s duty_u16.' },
    { term: 'ADC resolution', also: ['12-bit', 'read_u16'], def: 'The number of steps the converter reports: 4096 (12 bits) on the ESP32. MicroPython\'s read_u16 stretches that to 0–65535 whatever the hardware width.' },
    { term: 'MicroPython port', also: ['the ESP32 port'], def: 'The build of MicroPython for one chip family, with its own modules and limits. "The ESP32 port" is the MicroPython that runs on the ESP32 chips: it has the machine module for pins and no CAN driver.' }
  ],
  choose: {
    good: ['Blocks to learn the structure, or for a lesson; C++ when speed, timing, memory or a library decide', 'MicroPython for quick experiments, scripts that read well, and where a REPL helps', 'Both: prototype in Python, move the hot spots to C++'],
    avoid: ['Porting timing-critical code (bit-banging, fast ISRs) to MicroPython', 'Translating line by line without checking ranges and units', 'Mixing two styles of naming and layout in one project'],
    check: ['That a library for your sensor exists in the target language', 'How much RAM the Python version needs on your chip', 'That the same input gives the same numbers in both versions']
  },
  code: [
    {
      title: 'BOOT toggles the LED, in three notations',
      about: 'Each press of the BOOT button switches the LED over. Read the three versions side by side: every line has a partner, and the comments say what each pair does. Use it as the pattern for a port.',
      needs: 'An ESP32 DevKit: the BOOT button on GPIO0 (GPIO9 on a C3 or C6 board) and the LED on GPIO2.',
      wiring: [['GPIO0', 'the BOOT button to GND', 'already on the board'], ['GPIO2', 'the on-board LED']],
      blocks: `
        when started
          set pin (0) as [input with pull-up v]
          set pin (2) as [output v]
          set [wasDown v] to <false>
          set [ledOn v] to <false>
        forever
          set [down v] to <(read pin (0)) = [LOW v]>      // pressed now?
          if <<down> and <not <wasDown>>> then            // just pressed: toggle
            set [ledOn v] to <not <ledOn>>
            set pin (2) to (ledOn)
          end
          set [wasDown v] to (down)
          wait (0.02) seconds                             // look again in 20 ms (this also hides contact bounce)
        end
      `,
      cpp: String.raw`
        const int BUTTON_PIN = 0;          // GPIO9 on ESP32-C3 and C6 boards
        const int LED_PIN = 2;

        bool wasDown;
        bool ledOn;

        void setup() {
          pinMode(BUTTON_PIN, INPUT_PULLUP);
          pinMode(LED_PIN, OUTPUT);
          wasDown = false;
          ledOn = false;
        }

        void loop() {
          bool down = digitalRead(BUTTON_PIN) == LOW;     // pressed now?
          if (down && !wasDown) {                         // just pressed: toggle
            ledOn = !ledOn;
            digitalWrite(LED_PIN, ledOn);
          }
          wasDown = down;
          delay(20);                                      // look again in 20 ms (this also hides contact bounce)
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        BUTTON_PIN = 0                     # GPIO9 on ESP32-C3 and C6 boards
        LED_PIN = 2

        button = Pin(BUTTON_PIN, Pin.IN, Pin.PULL_UP)
        led = Pin(LED_PIN, Pin.OUT)
        wasDown = False
        ledOn = False

        while True:
            down = button.value() == 0                    # pressed now?
            if down and not wasDown:                      # just pressed: toggle
                ledOn = not ledOn
                led.value(ledOn)
            wasDown = down
            time.sleep_ms(20)                             # look again in 20 ms (this also hides contact bounce)
      `,
      notes: ['The structure is the same everywhere: set up the pins and two variables, then in the loop read, decide, act, remember.', 'A press shorter than 20 ms could be missed; for fast presses use an interrupt ([[interrupts]]).']
    },
    {
      title: 'A potentiometer sets the brightness: ranges differ',
      about: 'The potentiometer reading is rescaled to the PWM range of each language: 0–255 in the blocks and C++ versions (8-bit PWM), 0–65535 in MicroPython. The scaling line is the one that must change in a port.',
      needs: 'An ESP32 DevKit with its LED on GPIO2 and a potentiometer: ends to 3V3 and GND, wiper to GPIO34.',
      wiring: [['GPIO34', 'potentiometer wiper', 'ends to 3V3 and GND'], ['GPIO2', 'the on-board LED', 'driven with PWM']],
      blocks: `
        when started
          set PWM on pin (2) frequency (5000) resolution (8)
        forever
          set [raw v] to (analog read pin (34))                              // 0 to 4095
          set [duty v] to (map (raw) from (0) (4095) to (0) (255))          // scale to the duty range: 0 to 255 (8 bits)
          set PWM on pin (2) to (duty)
          wait (0.02) seconds
        end
      `,
      cpp: String.raw`
        const int POT_PIN = 34;
        const int LED_PIN = 2;

        void setup() {
          ledcAttach(LED_PIN, 5000, 8);                   // 5 kHz, 8 bits: the duty runs from 0 to 255
        }

        void loop() {
          int raw = analogRead(POT_PIN);                  // 0 to 4095
          int duty = map(raw, 0, 4095, 0, 255);           // scale to the duty range: 0 to 255 (8 bits)
          ledcWrite(LED_PIN, duty);
          delay(20);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin, PWM
        import time

        POT_PIN = 34
        LED_PIN = 2

        adc = ADC(Pin(POT_PIN), atten=ADC.ATTN_11DB)
        pwm = PWM(Pin(LED_PIN), freq=5000)              # 5 kHz: the duty runs from 0 to 65535

        while True:
            raw = adc.read_u16() // 16                    # 0 to 4095
            duty = raw * 65535 // 4095                    # scale to the duty range: 0 to 65535 (16 bits)
            pwm.duty_u16(duty)
            time.sleep_ms(20)
      `,
      notes: ['In MicroPython the potentiometer could drive the PWM directly with `pwm.duty_u16(adc.read_u16())`, because both use 16 bits: a range mismatch can also make a port shorter.', 'The eye sees brightness roughly logarithmically, so a linear duty looks too bright too early; [[driving-leds-with-pwm]] explains gamma correction.']
    }
  ],
  quiz: [
    { q: 'A sketch tests `if (analogRead(34) > 2000)`. In MicroPython on the same board, which test is equivalent?', choices: ['`adc.read_u16() > 2000`', '`adc.read_u16() > 32000`', '`adc.read() > 65535`', '`adc.read_u16() > 20`'], a: 1, why: 'read_u16() is on a 0–65535 scale, 16 times the Arduino 0–4095 scale: 2000 × 16 = 32 000. Alternatively divide by 16 first: adc.read_u16() // 16 > 2000.' },
    { q: 'Which call throws an ordinary die (1 to 6)?', choices: ['`random(1, 6)`', '`random(1, 7)`', '`random(6)`', '`random(0, 6)`'], a: 1, why: 'Arduino\'s random(min, max) excludes max, so random(1, 7) gives 1 to 6. random(1, 6) gives 1 to 5, and random(6) gives 0 to 5.' },
    { q: 'You port a C++ sketch whose counter is a `uint8_t` that is meant to wrap from 255 to 0. What must you add in Python?', choices: ['Nothing: Python wraps too', 'A mask: counter = (counter + 1) & 0xFF', 'A float', 'A semicolon'], a: 1, why: 'Python integers do not wrap. To keep the wrapping behaviour mask the result with & 0xFF (or take it modulo 256).' },
    { q: 'MicroPython is the best choice for a program that must toggle a pin 100 000 times a second.', a: false, why: 'MicroPython runs loops far more slowly than compiled C++, typically by a factor of ten or more. Fast bit-banging belongs in C++ or in a hardware peripheral such as RMT or PWM.' }
  ],
  applications: [
    'A classroom starts in blocks and moves to MicroPython, then to C++ once speed or a library demands it.',
    'Example code found online is mostly Arduino C++ or MicroPython; knowing the table lets you use either on your board.',
    'Ready-made firmware such as ESPHome expresses the same pins and timers a third way, in YAML ([[esphome]]).'
  ],
  sources: [
    'Arduino Language Reference, the functions in the table (pinMode, digitalWrite, delay, millis, analogRead, random, map, constrain).',
    'MicroPython documentation, *Quick reference for the ESP32*: Pin, ADC, PWM, time (version 1.29).',
    'Arduino-ESP32 documentation, the LEDC (PWM) and ADC APIs (core 3.3).'
  ]
},

/* ================================================================ readable code */
{
  id: 'readable-code',
  parent: 'program-structure',
  title: 'Readable code',
  level: 1,
  short: 'A program is read far more often than it is written — by you in six months, by a colleague, by a reviewer. Names, constants, small functions, honest comments and a consistent layout are what make it changeable.',
  keywords: ['readable code', 'naming', 'magic numbers', 'comments', 'formatting', 'indentation', 'PEP 8', 'style', 'refactor', 'clang-format', 'black', 'constants', 'camelCase', 'snake_case', 'maintainability'],
  prereq: ['functions', 'variables-and-types'],
  related: ['translating-between-languages', 'documentation', 'unit-testing', 'fault-finding-method', 'structs-and-classes'],
  body: `A program that works but cannot be read cannot be changed safely. It will be read many times more than it is written: by you six months from now, when you have forgotten why \`delay(50)\` is there; by a colleague; by the person who finds the bug. Readability is not decoration — it is the cheapest bug prevention there is, and it costs minutes.

### Names

A name should say what the thing is or does, with its unit when it has one. \`a\`, \`b\` and \`c\` say nothing; \`presses\`, \`ledOn\` and \`buttonWasDown\` say it all. Functions are verbs (\`readTemperature\`, \`registerPress\`); questions that return true or false read as questions (\`buttonIsDown\`). Put the unit in the name: \`timeoutMs\`, \`intervalSeconds\`. Choose one style and keep it. Arduino code is usually in camelCase with constants in CAPITALS; Python's own style guide, PEP 8, asks for snake_case. This app uses the same names in all three notations so that the versions can be laid side by side; in a Python project of your own, follow PEP 8.

### Constants instead of magic numbers

\`digitalWrite(2, HIGH)\` makes the reader ask what 2 is. \`const int LED_PIN = 2;\` at the top says it once, and changing the board means changing one line. The same goes for thresholds, intervals and addresses: \`const uint32_t ONE_DAY_MS = 24UL * 60 * 60 * 1000;\` explains itself, \`86400000\` does not.

### Comments say *why*

\`// add one\` repeats the code. \`// the button connects the pin to ground, so LOW means pressed\` tells the reader what the code cannot. Comment surprises: a wait that is needed because a sensor is slow, an order that matters, a value from the datasheet. When a comment explains what a line does, the line usually wants a better name.

### Small functions

A function does one thing and fits on a screen. \`loop()\` should read like a table of contents: read the inputs, decide, set the outputs — each a call to a function with a name ([[functions]]). A long \`loop()\` is a list of jobs waiting to be named.

### Layout

In Python the indentation is the syntax, so it is always consistent — and never mixes tabs with spaces. In C++ it is only for the eye, so a tool should keep it honest: the Arduino IDE's *Auto Format* and \`clang-format\` for C++, \`black\` or \`ruff format\` for Python. Blocks cannot be mis-indented, but a script that scrolls off the screen is as unreadable as a long function: wrap parts in custom blocks with names.

### Order within a file

Settings first (pins, intervals, credentials), then the variables that change, then small helpers, then \`setup()\` and \`loop()\`. A reader looking for "which pin?" or "how often?" finds it at the top.

### Before and after

The two programs below do exactly the same — count BOOT presses, flip the LED, print the count. One of them can be read.

> [!key] Readable code has names that say what and in which unit, constants instead of magic numbers, comments that say why, small functions and a layout kept honest by a formatter. It costs minutes and saves hours.`,
  ideas: [
    'Names that say what a thing is, with its unit, make most comments unnecessary.',
    'A constant at the top replaces a magic number everywhere it appears; change it once.',
    'Comments should say why, not repeat what; loop() should read like a table of contents of named jobs.',
    'A formatter keeps C++ layout honest; in Python the indentation is syntax, and blocks need custom blocks to stay short.'
  ],
  pitfalls: [
    'Short names save typing — They cost reading time, every time. An editor completes long names for you; a puzzled reader cannot complete a one-letter name.',
    'More comments mean better code — Comments that repeat the code add noise and go stale. Better names first; comments for the why.',
    'Readability is about taste — A shared style and a formatter remove the argument, and a readable program is measurably quicker to debug and to change.'
  ],
  terms: [
    { term: 'Magic number', also: ['hard-coded value'], def: 'A bare number in the middle of code whose meaning is not stated, such as 2 or 86400000. Replace it with a named constant.' },
    { term: 'Refactoring', also: ['tidying', 'clean-up'], def: 'Rewriting code to be clearer — better names, smaller functions, no repetition — without changing what it does.' },
    { term: 'Code style', also: ['style guide', 'PEP 8', 'coding conventions'], def: 'The agreed rules for names, layout and comments in a project. PEP 8 is the style guide of Python code; Arduino code has a looser convention.' },
    { term: 'Formatter', also: ['clang-format', 'black', 'Auto Format'], def: 'A tool that rewrites the layout of code — indentation, spacing, line breaks — to one standard style automatically.' },
    { term: 'Camel case', also: ['camelCase', 'snake_case'], def: 'Joining words with a capital letter for each new word (ledOn), as against snake_case, which joins them with underscores (led_on).' }
  ],
  code: [
    {
      title: 'Before: it works, but who can read it?',
      about: 'Counts BOOT presses, flips the LED, prints the count. Every line is correct and the whole is almost unreadable: single-letter names, bare numbers, no comments, everything on a few lines.',
      needs: 'An ESP32 DevKit: BOOT on GPIO0, the LED on GPIO2, the serial monitor at 115200 baud.',
      wiring: [['GPIO0', 'the BOOT button to GND', 'already on the board'], ['GPIO2', 'the on-board LED']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (0) as [input with pull-up v]
          set pin (2) as [output v]
          set [a v] to (0)
          set [b v] to <false>
          set [c v] to <false>
        forever
          if <<(read pin (0)) = (0)> and <not <c>>> then
            set [c v] to <true>
            change [a v] by (1)
            set [b v] to <not <b>>
            set pin (2) to (b)
            print (a)
            wait (0.05) seconds
          end
          if <(read pin (0)) = (1)> then
            set [c v] to <false>
          end
        end
      `,
      cpp: String.raw`
        int a = 0; bool b = false, c = false;
        void setup() { pinMode(0, INPUT_PULLUP); pinMode(2, OUTPUT); Serial.begin(115200); }
        void loop() {
          if (digitalRead(0) == 0 && !c) { c = true; a++; b = !b; digitalWrite(2, b); Serial.println(a); delay(50); }
          if (digitalRead(0) == 1) c = false;
        }
      `,
      py: String.raw`
        from machine import Pin
        import time
        p = Pin(0, Pin.IN, Pin.PULL_UP); l = Pin(2, Pin.OUT)
        a = 0; b = False; c = False
        while True:
            if p.value() == 0 and not c:
                c = True; a += 1; b = not b; l.value(b); print(a); time.sleep_ms(50)
            if p.value() == 1: c = False
      `,
      output: `
        1
        2
        3
      `,
      notes: ['Python lets you put several statements on a line with semicolons and C++ lets you put a whole function on one: both are legal, and neither helps the reader.', 'Compare it with the next program: same behaviour, same number of ideas, a fraction of the effort to understand.']
    },
    {
      title: 'After: the same program, readable',
      about: 'The same behaviour with named constants, names that say what they hold, two small functions and comments that say why. A reader sees the story in loop() without reading the details.',
      needs: 'The same board and wiring as the previous program.',
      wiring: [['GPIO0', 'the BOOT button to GND', 'already on the board'], ['GPIO2', 'the on-board LED']],
      blocks: `
        define buttonIsDown                            // a question with a clear name: LOW means pressed
          return <(read pin (0)) = [LOW v]>

        define registerPress                           // what happens at a press, in one place
          change [presses v] by (1)
          set [ledOn v] to <not <ledOn>>
          set pin (2) to (ledOn)
          print (presses)
          wait (0.05) seconds                          // ignore the contact bounce that follows a press

        when started
          start serial at (115200) baud
          set pin (0) as [input with pull-up v]
          set pin (2) as [output v]
          set [presses v] to (0)
          set [ledOn v] to <false>
          set [buttonWasDown v] to <false>
        forever
          set [down v] to <buttonIsDown>
          if <<down> and <not <buttonWasDown>>> then   // only the moment it goes down counts
            registerPress :: my
          end
          set [buttonWasDown v] to (down)
        end
      `,
      cpp: String.raw`
        const int BUTTON_PIN = 0;
        const int LED_PIN = 2;

        int presses;
        bool ledOn;
        bool buttonWasDown;

        bool buttonIsDown() {                          // a question with a clear name: LOW means pressed
          return digitalRead(BUTTON_PIN) == LOW;
        }

        void registerPress() {                         // what happens at a press, in one place
          presses++;
          ledOn = !ledOn;
          digitalWrite(LED_PIN, ledOn);
          Serial.println(presses);
          delay(50);                                   // ignore the contact bounce that follows a press
        }

        void setup() {
          Serial.begin(115200);
          pinMode(BUTTON_PIN, INPUT_PULLUP);
          pinMode(LED_PIN, OUTPUT);
          presses = 0;
          ledOn = false;
          buttonWasDown = false;
        }

        void loop() {
          bool down = buttonIsDown();
          if (down && !buttonWasDown) {                // only the moment it goes down counts
            registerPress();
          }
          buttonWasDown = down;
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        BUTTON_PIN = 0
        LED_PIN = 2

        button = Pin(BUTTON_PIN, Pin.IN, Pin.PULL_UP)
        led = Pin(LED_PIN, Pin.OUT)

        presses = 0
        ledOn = False
        buttonWasDown = False

        def buttonIsDown():                            # a question with a clear name: LOW means pressed
            return button.value() == 0

        def registerPress():                           # what happens at a press, in one place
            global presses, ledOn
            presses += 1
            ledOn = not ledOn
            led.value(ledOn)
            print(presses)
            time.sleep_ms(50)                          # ignore the contact bounce that follows a press

        while True:
            down = buttonIsDown()
            if down and not buttonWasDown:             # only the moment it goes down counts
                registerPress()
            buttonWasDown = down
      `,
      output: `
        1
        2
        3
      `,
      notes: ['The Python version needs `global presses, ledOn` inside registerPress(): without it the function would change local copies and the program would print 1 for ever ([[functions]]).', 'The 50 ms wait is still a `delay`; [[debouncing]] replaces it with a timer so that the loop stays free.']
    }
  ],
  examples: [
    {
      title: 'Naming a magic number',
      q: 'A sketch has `if (millis() - t >= 600000) { sendReport(); t = millis(); }`. Rewrite it so that a reader needs no explanation.',
      steps: ['600 000 ms is ten minutes: say so with a named constant, `const uint32_t REPORT_INTERVAL_MS = 10UL * 60 * 1000;`.', 'The variable `t` is the time of the last report: call it `lastReportMs`.', 'The condition now reads as a sentence: `if (millis() - lastReportMs >= REPORT_INTERVAL_MS)`.'],
      a: 'The constant and the two names replace the number and the letter; no comment is needed, and changing the interval is a one-line edit.'
    }
  ],
  quiz: [
    { q: 'Which is the best comment for `digitalWrite(RELAY_PIN, LOW);` in a program whose relay board switches on when its input is low?', choices: ['// write LOW to the relay pin', '// the relay board is active low: LOW switches it on', '// relay', '// TODO'], a: 1, why: 'The first only repeats the code. The second says why LOW means "on": information the reader cannot see in the line.' },
    { q: 'What is wrong with `delay(86400000);` in terms of readability?', choices: ['Nothing', 'The reader must calculate that the number is one day in milliseconds; a named constant says it', 'It is too long', 'delay takes seconds'], a: 1, why: 'A magic number hides its meaning. `const uint32_t ONE_DAY_MS = 24UL * 60 * 60 * 1000;` states what it is and how it was made.' },
    { q: 'In Python, inconsistent indentation is only a matter of style, as in C++.', a: false, why: 'In Python indentation is syntax: it defines which lines belong to a block, and an inconsistent one changes the program or raises an error. In C++ the braces decide, and indentation only helps the eye.' },
    { q: 'A `loop()` of eighty lines reads, sets and decides everything in one block. What is the usual cure?', choices: ['A bigger screen', 'Split it into named functions — read the inputs, decide, set the outputs — so that loop() reads like a table of contents', 'Remove the comments', 'Move it to setup()'], a: 1, why: 'Named functions turn the eighty lines into a handful of calls with meaningful names, each of which can be read, tested and changed on its own.' }
  ],
  applications: [
    'Teams read each other\'s firmware in code review; a shared style and a formatter keep that fast.',
    'A device in the field is updated years after it was written, often by someone else: readable code is what makes the update safe.',
    'Teaching code — the programs in this app — uses the same names in three notations so that the structure, not the spelling, is what the reader sees.'
  ],
  sources: [
    'Python Enhancement Proposal 8 (PEP 8), the style guide for Python code.',
    'Arduino documentation, the "Arduino Style Guide for Creating Libraries".',
    'Brian Kernighan and Rob Pike, *The Practice of Programming* (the chapters on style and debugging).'
  ]
}
);

