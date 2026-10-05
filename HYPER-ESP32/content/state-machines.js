/* HYPER-ESP32 · content/state-machines.js
 *
 * Topic "State machines" (branch Programming): the method of building a device as states, events, transitions and
 * actions, taught from nothing, with a small real machine on every page — a stair light, a pedestrian crossing, a push
 * button, a mode selector, a pump, a door lock, a greenhouse vent, a garage door, a lamp with a button, a Wi-Fi and
 * MQTT connection manager, a hand dryer. Each machine is drawn and runnable in a simulation, and written as a program
 * in blocks, Arduino C++ and MicroPython with the same state and event names.
 */
Hyper.add(
/* ================================================================ what a state machine is */
{
  id: 'what-a-state-machine-is',
  parent: 'state-machines',
  title: 'What a state machine is',
  level: 1,
  short: 'A device is always in exactly one state; events move it to another state, and actions happen on the way. That one idea replaces the tangle of flags and delay() calls that every beginner\'s program grows into.',
  keywords: ['state machine', 'FSM', 'finite state machine', 'state', 'event', 'transition', 'action', 'flags', 'delay', 'spaghetti code', 'mode', 'non-blocking', 'stair light', 'machine-state method'],
  prereq: ['setup-loop-and-main', 'non-blocking-timing'],
  related: ['states-events-transitions', 'drawing-a-state-diagram', 'delays-and-yielding', 'buttons-and-switches', 'electronics:state-machines'],
  body: `Think of a stair light. Press the button and the light comes on; five seconds later it goes off by itself, and pressing again while it is lit gives you five more. At any moment the light is in one of two situations — **dark** or **lit** — and what a button press *means* depends on which. In the dark, a press switches the light on. When lit, a press extends it. The button is the same; the situation differs.

That is a **state machine**: a program organised around the question "what situation am I in?" It has:

- a short list of **states**, the situations the device can be in, exactly one at a time;
- **events**, the things that happen: a button goes down, a timer runs out, a message arrives, a reading crosses a limit;
- **transitions**: for each state, which events move the device to which other state;
- **actions**: what the device does on the way — switch an LED, start a motor, print a line.

### What it replaces

A beginner's program otherwise grows like this. A \`delay(5000)\` keeps the light on. A flag \`lightIsOn\` remembers. A second flag \`buttonWasPressed\` stops a held button counting twice. A third says "already waiting". Every new wish — "blink a warning before it goes dark" — adds a flag that interacts with all the others. It works until two things happen at once; then nobody can say why it misbehaves.

The delay is the worst part. While \`delay(5000)\` runs the program is deaf: a press during those five seconds is simply lost ([[delays-and-yielding]], [[non-blocking-timing]]). The simulation below runs both designs on the same presses.

### Why a machine works better

1. **The state is the memory.** Instead of five flags whose combinations may or may not make sense, one variable holds one of a handful of named values. A combination you did not name cannot exist.
2. **Nothing waits.** The loop runs thousands of times a second. Each pass it asks "did an event happen?" and "has this state lasted too long?". The program is never stuck, so one loop can serve a button, a sensor and the network together.
3. **It can be drawn.** A state machine is a picture — boxes and arrows — before it is code ([[drawing-a-state-diagram]]). Show it to someone who cannot read C++ and ask "is this what you want?"
4. **It can be checked.** Every state and every event can be listed, so you can see which combinations are still undecided ([[from-requirements-to-states]], [[testing-a-state-machine]]).

### How small is "small"?

Most devices need three to eight states. The stair light has two; a Wi-Fi and broker connection has four ([[connection-manager-machine]]). Near thirty, split the machine into several that talk to each other ([[several-machines-together]]). The [state-machine lab](#/tools/fsmlab) lets you draw one, run it and see it as a program.

> [!key] A device is in exactly one state; events move it to another state, and actions happen on the way. Writing the program that way — instead of with flags and \`delay()\` — keeps it responsive, drawable and checkable.`,
  ideas: [
    'A state machine is always in exactly one named state; the state is the program\'s memory of what has happened so far.',
    'What an event does depends on the state it arrives in: the same button press means different things in different states.',
    'The loop never waits: each pass it looks for events and for timeouts, so one program can serve a button, a sensor and the network together.',
    'Flags and delay() grow into a tangle; a machine lists every situation and every way out of it.'
  ],
  pitfalls: [
    'A state machine is only for big, complicated programs — The stair light has two states and already shows the benefit. The smaller the machine, the easier it is to get right, and the habit pays when the device grows.',
    'I can keep the state in a few boolean flags instead — Three flags allow eight combinations and usually only four make sense. A single state variable cannot hold a combination that you did not name.',
    'delay() is fine as long as the delay is short — Every delay is a stretch of time in which a press, a sensor value or a network packet can be missed or handled late, and short delays add up in a loop that does several things.'
  ],
  terms: [
    { term: 'State machine', also: ['FSM', 'finite-state machine', 'finite automaton'], def: 'A way of building a program (or a circuit) around a list of states. At any moment it is in exactly one state; events move it from one state to another, and actions happen on the way.' },
    { term: 'State', also: ['mode', 'situation'], def: 'One of the situations the device can be in, such as DARK or LIT. It is kept in one variable, and it decides what every event means.' },
    { term: 'Event', also: ['input', 'trigger', 'stimulus'], def: 'Something that happens and may change the state: a button goes down, a timer runs out, a message arrives, a reading crosses a limit.' },
    { term: 'Flag', also: ['boolean flag', 'status variable'], def: 'A boolean variable that remembers something that happened. A few flags are handy; many flags that must be kept consistent by hand are what a state machine replaces.' }
  ],
  choose: {
    good: ['Anything that behaves differently depending on what happened before: modes, sequences, protocols, connections', 'A device with a button, a timer and some outputs that must stay responsive', 'Behaviour you must explain, test or change later without breaking the rest'],
    avoid: ['A pure calculation with no memory of the past: a function does it', 'A loop that only samples a value at a fixed rate and sends it: a timer is enough', 'Hundreds of states in one flat machine: split it, or use a table'],
    check: ['Can you name each state in one or two words?', 'Can you list the events that matter, including the timeouts?', 'Could someone else read the diagram and say what a button press does in each state?']
  },
  code: [
    {
      title: 'A stair light as a state machine',
      about: 'Press the button and the lamp lights for five seconds; press while it is lit and the five seconds start again. The loop never waits.',
      needs: 'An ESP32 DevKit, a push button and an LED with a 220 Ω resistor (a stair-light lamp switched through a transistor behaves the same).',
      wiring: [['GPIO4', 'push button → GND', 'internal pull-up'], ['GPIO25', '220 Ω → LED → GND']],
      blocks: `
        when started
          set pin (4) as [input with pull-up v]
          set pin (25) as [output v]
          go to state [DARK v]

        when entering state [DARK v]
          set pin (25) to [LOW v]

        when entering state [LIT v]
          set pin (25) to [HIGH v]

        when pin (4) goes [low v]          // the button is pressed
          raise event [PRESS v]

        when event [PRESS v] in state [DARK v]
          go to state [LIT v]

        when event [PRESS v] in state [LIT v]
          go to state [LIT v]              // leaves and re-enters: the five seconds start again

        when (5) seconds in state [LIT v]
          go to state [DARK v]
      `,
      cpp: String.raw`
        const int BUTTON = 4;
        const int LAMP = 25;
        const uint32_t LIT_MS = 5000;

        enum State { DARK, LIT };
        State state = DARK;
        uint32_t enteredAt = 0;          // when the current state was entered
        bool wasPressed = false;

        void goTo(State next) {
          state = next;
          enteredAt = millis();
          digitalWrite(LAMP, state == LIT);   // entry action: the lamp follows the state
        }

        void onPress() {                 // the event PRESS
          switch (state) {
            case DARK: goTo(LIT); break;
            case LIT:  goTo(LIT); break; // leave and re-enter: the five seconds start again
          }
        }

        void setup() {
          pinMode(BUTTON, INPUT_PULLUP);
          pinMode(LAMP, OUTPUT);
          goTo(DARK);
        }

        void loop() {
          bool pressed = digitalRead(BUTTON) == LOW;
          if (pressed && !wasPressed) onPress();   // the button has just gone down
          wasPressed = pressed;

          if (state == LIT && millis() - enteredAt >= LIT_MS) goTo(DARK);   // the timeout
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        BUTTON = Pin(4, Pin.IN, Pin.PULL_UP)
        LAMP = Pin(25, Pin.OUT)
        LIT_MS = 5000

        DARK, LIT = 0, 1
        state = DARK
        entered_at = time.ticks_ms()     # when the current state was entered
        was_pressed = False

        def go_to(new_state):
            global state, entered_at
            state = new_state
            entered_at = time.ticks_ms()
            LAMP.value(1 if state == LIT else 0)   # entry action: the lamp follows the state

        def on_press():                  # the event PRESS
            if state == DARK:
                go_to(LIT)
            elif state == LIT:
                go_to(LIT)               # leave and re-enter: the five seconds start again

        go_to(DARK)
        while True:
            pressed = BUTTON.value() == 0
            if pressed and not was_pressed:   # the button has just gone down
                on_press()
            was_pressed = pressed

            if state == LIT and time.ticks_diff(time.ticks_ms(), entered_at) >= LIT_MS:   # the timeout
                go_to(DARK)
            time.sleep_ms(5)
      `,
      notes: ['A bouncing contact can send several PRESS events within a few milliseconds. Here that is harmless — in LIT each one only restarts the timer — but most machines need the button debounced first ([[debouncing]]).']
    },
    {
      title: 'The same lamp with delay(): what it loses',
      about: 'The version most beginners write first. It works when you press once and wait. Press again while the lamp is lit and nothing happens at all: the program is asleep inside delay().',
      needs: 'The same board and wiring.',
      wiring: [['GPIO4', 'push button → GND', 'internal pull-up'], ['GPIO25', '220 Ω → LED → GND']],
      blocks: `
        when started
          set pin (4) as [input with pull-up v]
          set pin (25) as [output v]
        forever
          if <(read pin (4)) = [LOW v]> then
            set pin (25) to [HIGH v]
            wait (5) seconds              // deaf for five seconds
            set pin (25) to [LOW v]
          end
        end
      `,
      cpp: String.raw`
        const int BUTTON = 4;
        const int LAMP = 25;

        void setup() {
          pinMode(BUTTON, INPUT_PULLUP);
          pinMode(LAMP, OUTPUT);
        }

        void loop() {
          if (digitalRead(BUTTON) == LOW) {
            digitalWrite(LAMP, HIGH);
            delay(5000);                 // for five seconds nothing else runs: presses are lost
            digitalWrite(LAMP, LOW);
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        BUTTON = Pin(4, Pin.IN, Pin.PULL_UP)
        LAMP = Pin(25, Pin.OUT)

        while True:
            if BUTTON.value() == 0:
                LAMP.value(1)
                time.sleep_ms(5000)      # for five seconds nothing else runs: presses are lost
                LAMP.value(0)
      `,
      notes: ['A button still held down when the delay ends looks like a new press, so the lamp lights again: the bug is not even consistent.', 'Repairing it with flags — "pressed during the wait", "restart the wait" — is exactly how the tangle starts.']
    }
  ],
  quiz: [
    { q: 'A stair light is LIT and the button is pressed. The state-machine version gives five more seconds of light; the `delay()` version does nothing. Why?', choices: ['The machine runs on a faster processor', 'The machine is never asleep, so the press arrives as an event while it is in LIT', '`delay()` ignores buttons only on the ESP32', '`digitalRead` is unreliable inside `delay()`'], a: 1, why: 'The delay version is stuck inside delay(5000) and never reads the pin. The machine version spins through its loop thousands of times a second, so the press becomes the event PRESS in state LIT.' },
    { q: 'How many combinations can three boolean flags describe, and how many values has a state variable with three states?', choices: ['Eight and three', 'Three and three', 'Six and three', 'Three and eight'], a: 0, why: 'Three flags give 2 × 2 × 2 = 8 combinations, though perhaps only four make sense; the other four are bugs waiting to happen. A state variable with three names has exactly three values.' },
    { q: 'In a state machine the same event always does the same thing, whatever state the device is in.', a: false, why: 'The meaning of an event depends on the state: in DARK a press lights the lamp, in LIT it extends the time. That is the whole point of having states.' },
    { q: 'Which of these is an event rather than a state?', choices: ['LIT', 'The button goes down', 'Waiting for the broker', 'DARK'], a: 1, why: 'An event happens at an instant; a state lasts. "Waiting for the broker" is a situation the device can stay in, so it is a state.' }
  ],
  applications: [
    'Appliance controllers: a washing machine moves through fill, wash, rinse and spin, and the lid switch is an event in every one of them.',
    'Stair and corridor lights, hand dryers and automatic taps: a sensor event, a timed state, and outputs that follow the state.',
    'Protocols: every connection — Wi-Fi, MQTT, TCP, Bluetooth LE — is a state machine, and so is the library you call.',
    'Lifts, vending machines and traffic lights, the textbook cases of the method.'
  ],
  sources: [
    'David Harel, "Statecharts: a visual formalism for complex systems", Science of Computer Programming 8 (1987): the paper behind most state diagrams used in software today.',
    'Object Management Group, *Unified Modeling Language* specification, the chapter on state machines.',
    'Arduino core for ESP32 documentation, timing functions (`millis`, `delay`); MicroPython documentation, `time` module (`ticks_ms`, `ticks_diff`).'
  ],
  sim: 'sm-delay-vs-machine'
},

/* ================================================================ states, events, transitions, actions */
{
  id: 'states-events-transitions',
  parent: 'state-machines',
  title: 'States, events, transitions, actions',
  level: 1,
  short: 'The four words that carry the whole method, each with a precise meaning, shown on a pedestrian crossing: a state lasts, an event happens, a transition says where to go, an action is what the device does.',
  keywords: ['state', 'event', 'transition', 'action', 'transition table', 'initial state', 'ignored event', 'timeout', 'pedestrian crossing', 'traffic light', 'Mealy', 'Moore'],
  prereq: ['what-a-state-machine-is'],
  related: ['drawing-a-state-diagram', 'timeouts-and-timed-states', 'entry-exit-and-guards', 'from-requirements-to-states', 'electronics:state-machines'],
  body: `A pedestrian crossing has three lamps for the cars and a button for the people. Describe its life as a list and it needs very little: cars have **green** until somebody presses the button; then **amber** for two seconds; then **red** for six seconds while people walk; then green again. Four words carry the whole design, and each has a precise meaning.

### States

A state is a situation that **lasts**. GREEN, AMBER and RED are states; so is "waiting for the broker". A good state name describes the situation, not an action: RED, not "switch_to_red". The test is whether the device can *stay* there: it can stay in RED; it cannot stay in "switch to red", which takes no time. The device is in exactly one state at a time and begins in a chosen **initial state** — here GREEN.

### Events

An event is something that happens at an **instant**: the button goes down, two seconds in AMBER have passed, a packet arrives. Events come from outside (a button, a sensor, the network) or from the clock (a timeout), and the machine treats them alike. Name them as signals — BUTTON, TANK_FULL, BROKER_LOST.

### Transitions

A transition says: *in this state, when this event happens, go to that state.* On the crossing:

| In state | Event | Go to |
|---|---|---|
| GREEN | BUTTON | AMBER |
| AMBER | 2 s pass | RED |
| RED | 6 s pass | GREEN |

Notice what is *not* in the table. A press in AMBER or RED is not listed, so nothing happens: the request is already being served. **An event that a state does not list is ignored in that state.** That is not carelessness; it is what lets the same event mean different things, or nothing, in different places. It is also where bugs hide, which is why [[from-requirements-to-states]] asks the question for every state and every event.

### Actions

An action is something the device **does**: switch a lamp, start a motor, print a line, send a message. Actions attach to a **transition** ("note that the request was accepted"), to the **entry** of a state ("on entering RED: cars red, pedestrians green") or to its **exit**. Most belong to entries, because they describe what the state *is*; [[entry-exit-and-guards]] explains why. (Engineers call outputs that depend on the transition a Mealy machine and outputs that depend only on the state a Moore machine; real programs mix both.)

### Putting it together

State, event, transition, action: that is the full vocabulary. Run the crossing in the simulation: press the button in each state, let the clock run, and watch the list of events the current state listens to change. The same machine, as a program, is below in all three notations.

> [!key] A state machine is a table: for each state and each event, the next state and the actions. An event that a state does not list is ignored in it — which keeps machines simple, and is where their bugs hide.`,
  ideas: [
    'A state is a situation that lasts; an event is something that happens at an instant. If the device cannot stay there, it is not a state.',
    'A transition says: in this state, on this event, go to that state. The set of transitions is a table.',
    'An event that the current state does not list is ignored in that state.',
    'Actions run on entry to a state, on exit from it, or on a transition; most belong in entries.'
  ],
  pitfalls: [
    'A timeout is not an event, only buttons and sensors are — The clock is a source of events like any other: "two seconds in AMBER have passed" is as much an event as a press, and the machine handles it the same way.',
    'Name states after what the device does next, like TURN_ON — A state is a situation that lasts, so name it for what the device is: ON, LIT, RED. Names that start with a verb usually describe an action in disguise.',
    'If an event is not listed in a state, the program has a bug — Ignoring an event can be exactly right. It becomes a bug only when nobody decided it; the table should show each ignored pair on purpose.'
  ],
  terms: [
    { term: 'Transition', also: ['edge', 'arrow'], def: 'The rule that moves a machine from one state to another when an event happens: in this state, on this event, go to that state.' },
    { term: 'Action', also: ['output', 'effect'], def: 'Something the device does as the machine moves: switching an output, starting a timer, printing, sending a message. It runs on a transition, on entering a state or on leaving one.' },
    { term: 'Transition table', also: ['state table', 'state–event table'], def: 'The whole machine as a table with one row for each combination of state and event, giving the next state and the actions. It is the diagram written as data.' },
    { term: 'Initial state', also: ['start state', 'reset state'], def: 'The state the machine is in when the program starts. It must be chosen on purpose: it is what the device does at power-up.' }
  ],
  code: [
    {
      title: 'A pedestrian crossing',
      about: 'Cars have green until the button is pressed; then amber for 2 s; then red for 6 s while people walk. A press during amber or red is ignored.',
      needs: 'An ESP32 DevKit, four LEDs (red, amber, green for cars; green for pedestrians) with 220 Ω resistors, and a push button.',
      wiring: [['GPIO25', '220 Ω → red LED → GND'], ['GPIO26', '220 Ω → amber LED → GND'], ['GPIO27', '220 Ω → green LED → GND'], ['GPIO33', '220 Ω → pedestrian LED → GND'], ['GPIO4', 'push button → GND', 'internal pull-up']],
      blocks: `
        define show lamps (red) (amber) (green) (walk)
          set pin (25) to (red)
          set pin (26) to (amber)
          set pin (27) to (green)
          set pin (33) to (walk)

        when started
          set pin (4) as [input with pull-up v]
          set pin (25) as [output v]
          set pin (26) as [output v]
          set pin (27) as [output v]
          set pin (33) as [output v]
          go to state [GREEN v]

        when entering state [GREEN v]
          show lamps (0) (0) (1) (0) :: my

        when entering state [AMBER v]
          show lamps (0) (1) (0) (0) :: my

        when entering state [RED v]
          show lamps (1) (0) (0) (1) :: my

        when pin (4) goes [low v]
          raise event [BUTTON v]

        when event [BUTTON v] in state [GREEN v]    // AMBER and RED have no such block: they ignore BUTTON
          print [button accepted]
          go to state [AMBER v]

        when (2) seconds in state [AMBER v]
          go to state [RED v]

        when (6) seconds in state [RED v]
          go to state [GREEN v]
      `,
      cpp: String.raw`
        const int BUTTON = 4;
        const int CAR_RED = 25, CAR_AMBER = 26, CAR_GREEN = 27;
        const int WALK = 33;                          // the pedestrians' green lamp

        enum State { GREEN, AMBER, RED };
        State state = GREEN;
        uint32_t enteredAt = 0;
        bool wasPressed = false;

        void lamps(bool red, bool amber, bool green, bool walk) {
          digitalWrite(CAR_RED, red);
          digitalWrite(CAR_AMBER, amber);
          digitalWrite(CAR_GREEN, green);
          digitalWrite(WALK, walk);
        }

        void goTo(State next) {
          state = next;
          enteredAt = millis();
          switch (state) {                            // entry actions: what each state looks like
            case GREEN: lamps(0, 0, 1, 0); break;
            case AMBER: lamps(0, 1, 0, 0); break;
            case RED:   lamps(1, 0, 0, 1); break;
          }
        }

        void onButton() {                             // the event BUTTON
          if (state == GREEN) {                       // only GREEN listens to it
            Serial.println("button accepted");        // an action on the transition
            goTo(AMBER);
          }
        }

        void setup() {
          Serial.begin(115200);
          pinMode(BUTTON, INPUT_PULLUP);
          pinMode(CAR_RED, OUTPUT);
          pinMode(CAR_AMBER, OUTPUT);
          pinMode(CAR_GREEN, OUTPUT);
          pinMode(WALK, OUTPUT);
          goTo(GREEN);                                // the initial state
        }

        void loop() {
          bool pressed = digitalRead(BUTTON) == LOW;
          if (pressed && !wasPressed) onButton();     // event: BUTTON
          wasPressed = pressed;

          uint32_t inState = millis() - enteredAt;    // events from the clock
          if (state == AMBER && inState >= 2000) goTo(RED);
          if (state == RED && inState >= 6000) goTo(GREEN);
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        BUTTON = Pin(4, Pin.IN, Pin.PULL_UP)
        CAR_RED, CAR_AMBER, CAR_GREEN = Pin(25, Pin.OUT), Pin(26, Pin.OUT), Pin(27, Pin.OUT)
        WALK = Pin(33, Pin.OUT)                       # the pedestrians' green lamp

        GREEN, AMBER, RED = 0, 1, 2
        state = GREEN
        entered_at = time.ticks_ms()
        was_pressed = False

        def lamps(red, amber, green, walk):
            CAR_RED.value(red)
            CAR_AMBER.value(amber)
            CAR_GREEN.value(green)
            WALK.value(walk)

        def go_to(new_state):
            global state, entered_at
            state = new_state
            entered_at = time.ticks_ms()
            if state == GREEN:                        # entry actions: what each state looks like
                lamps(0, 0, 1, 0)
            elif state == AMBER:
                lamps(0, 1, 0, 0)
            elif state == RED:
                lamps(1, 0, 0, 1)

        def on_button():                              # the event BUTTON
            if state == GREEN:                        # only GREEN listens to it
                print("button accepted")              # an action on the transition
                go_to(AMBER)

        go_to(GREEN)                                  # the initial state
        while True:
            pressed = BUTTON.value() == 0
            if pressed and not was_pressed:           # event: BUTTON
                on_button()
            was_pressed = pressed

            in_state = time.ticks_diff(time.ticks_ms(), entered_at)   # events from the clock
            if state == AMBER and in_state >= 2000:
                go_to(RED)
            elif state == RED and in_state >= 6000:
                go_to(GREEN)
            time.sleep_ms(5)
      `,
      output: `
        button accepted
      `,
      notes: ['This crossing is a model for learning. A real one is built from certified controllers, with conflict monitors and fail-safe lamps.']
    }
  ],
  examples: [
    {
      title: 'Counting the cells of the table',
      q: 'The crossing has three states and two kinds of event: BUTTON and "the state\'s time is up". How many combinations of state and event exist, how many has the machine used, and what happens in the rest?',
      steps: ['Three states times two events is six combinations.', 'Three are used: GREEN on BUTTON, AMBER on time-up, RED on time-up.', 'The other three — GREEN on time-up, AMBER on BUTTON, RED on BUTTON — are ignored: GREEN has no timeout, and a request is already being served in AMBER and RED.'],
      a: 'Six combinations, three used, three ignored on purpose. Writing the ignored ones down is how you find the one you ignored by accident.'
    }
  ],
  quiz: [
    { q: 'The crossing is in AMBER and the button is pressed. What does the machine of this page do?', choices: ['Goes to RED at once', 'Restarts the amber time', 'Nothing: AMBER does not list BUTTON', 'Goes back to GREEN'], a: 2, why: 'Only GREEN has a transition on BUTTON. In AMBER and RED the event is ignored, because the request is already being handled.' },
    { q: 'Which is the best name for a state?', choices: ['TURN_LAMP_ON', 'WAITING_FOR_BROKER', 'toggle', 'if_pressed'], a: 1, why: 'A state is a situation the device can stay in. The other three describe an action or a test, which take no time.' },
    { q: 'Actions can happen only at the moment the machine changes state.', a: false, why: 'Most actions are tied to a transition, an entry or an exit, but a state may also do something repeatedly while it lasts, such as blinking an LED every half second.' },
    { q: 'What is "two seconds in AMBER have passed"?', choices: ['Not an event: only buttons and sensors are', 'An event that comes from the clock', 'An action', 'A state'], a: 1, why: 'The clock is a source of events like any other. A timeout is a transition whose event is "this state has lasted long enough".' }
  ],
  applications: [
    'Traffic lights and pedestrian crossings, the classic example of timed states with one request button.',
    'Lift controllers: floors, doors and requests are states and events, and each request button is ignored in some states.',
    'Washing-machine programs: each phase is a state with timeouts, and the lid switch is an event everywhere.',
    'Any product whose button changes meaning with the situation: a camera, a kettle, a remote control.'
  ],
  sources: [
    'G. H. Mealy, "A method for synthesizing sequential circuits", Bell System Technical Journal 34 (1955), and E. F. Moore, "Gedanken-experiments on sequential machines" (1956): the two ways of attaching outputs.',
    'Object Management Group, *Unified Modeling Language* specification: state machines, events, transitions and effects.',
    'Arduino core for ESP32 documentation, `millis()`; MicroPython documentation, `time.ticks_ms()` and `time.ticks_diff()`.'
  ],
  sim: 'sm-crossing'
},

/* ================================================================ drawing a state diagram */
{
  id: 'drawing-a-state-diagram',
  parent: 'state-machines',
  title: 'Drawing a state diagram',
  level: 1,
  short: 'Boxes for states, arrows for transitions labelled with the event, an arrow from a dot for the start. Drawing the machine first costs a pencil; finding the mistake afterwards costs an evening.',
  keywords: ['state diagram', 'state chart', 'statechart', 'UML', 'initial state', 'self-transition', 'dead end', 'unreachable state', 'push button', 'click', 'long press', 'diagram conventions'],
  prereq: ['states-events-transitions'],
  related: ['state-machine-in-code', 'from-requirements-to-states', 'long-press-double-click', 'debouncing', 'block-diagrams'],
  body: `Before you write a line of code, draw the machine. A state diagram is the cheapest way to find a mistake: it costs a pencil, and the mistake costs a minute instead of an evening of debugging. The conventions are few and nearly universal.

### The drawing rules

- **A state is a rounded box** with its name inside. If it fits, add what the device does there under the name: *LIT — lamp on*.
- **A transition is an arrow** from one state to another, labelled with the event that triggers it: \`UP\`. A timeout is labelled like any event: \`after 1 s\`.
- **Actions** go after a slash on the arrow, \`UP / click\`, or inside the box as *entry:* and *exit:* lines.
- **The initial state** has an arrow coming from a black dot with nothing at its tail.
- **A guard**, a condition that must hold, goes in square brackets after the event: \`CODE_BAD [third try]\` ([[entry-exit-and-guards]]).
- **An arrow that returns to its own state** is a self-transition: a loop above the box.

### An example: one button, three states

A button gives the program two raw events, DOWN and UP. A machine can turn them into *meaning*: RELEASED, PRESSED and — if the button stays down for a second — HELD. The arrows: RELEASED –DOWN→ PRESSED; PRESSED –UP→ RELEASED, action *click*; PRESSED –after 1 s→ HELD, action *long press*; HELD –UP→ RELEASED. Four arrows and three boxes describe "click versus long press" completely, more clearly than any heap of flags ([[long-press-double-click]]).

### Checking the drawing

A diagram can be wrong in ways you can see at once if you look:

1. **A state nothing leads to** — unreachable: dead weight, or a missing arrow.
2. **A state with no way out** — a trap. Sometimes deliberate (a latched fault), but then say so; usually a forgotten arrow.
3. **An arrow to a state that does not exist** — in code, a misspelt name.
4. **Two arrows with the same event from the same state** — which one wins? Add a guard, or you have two machines in one.
5. **Missing events** — for each state ask "what if the button is pressed *now*? What if the timer runs out *now*?" and note the answer, even if it is "nothing".

The simulation draws the button machine and lets you break it in the first three ways; the checker reports what it finds. The [state-machine lab](#/tools/fsmlab) does the same for machines you draw yourself.

### Keep it readable

Put the initial state top-left and let the main flow run left to right. Avoid crossing arrows. If the picture will not fit one page, the machine has too many states: split it ([[hierarchical-states]], [[several-machines-together]]).

> [!key] Draw boxes for states and arrows for transitions labelled with their event, plus an arrow from a dot for the start. Then check the drawing for unreachable states, dead ends, unknown targets and unanswered events — before any code exists.`,
  ideas: [
    'A state is a rounded box, a transition an arrow labelled with its event, and the start is an arrow from a black dot.',
    'Timeouts, actions and guards have their own notation: after 1 s, event / action, event [condition].',
    'A diagram can be checked by eye: no unreachable states, no dead ends, no arrows to nowhere, no unanswered events.',
    'A picture that will not fit one page means the machine should be split.'
  ],
  pitfalls: [
    'An arrow back to the same state means nothing happens — In the usual notation it leaves and re-enters the state, so exit and entry actions run again and a timeout starts from zero.',
    'A state with no arrow out is harmless — It is a trap: once the machine is there, it never leaves. That is right only for a deliberate latched fault; otherwise an arrow is missing.',
    'The diagram is documentation; the code is the real thing — The drawing is the design. Draw first, check it, then write the code to match; a diagram drawn afterwards tends to show what the programmer remembers, not what the program does.'
  ],
  terms: [
    { term: 'State diagram', also: ['state chart', 'state-transition diagram', 'statechart'], def: 'A drawing of a state machine: a box for each state, an arrow for each transition labelled with its event, and a marked initial state.' },
    { term: 'Self-transition', also: ['loop', 'reflexive transition'], def: 'A transition from a state back to itself. The machine leaves and re-enters the state, so its exit and entry actions run again and any timeout starts afresh.' },
    { term: 'Dead end', also: ['trap state', 'absorbing state'], def: 'A state with no transition out. Deliberate for a latched fault; otherwise a missing arrow.' },
    { term: 'Unreachable state', also: ['orphan state'], def: 'A state that no sequence of events can reach from the initial state. It is dead weight, or a sign that an arrow is missing.' }
  ],
  code: [
    {
      title: 'One button: click or long press',
      about: 'A debounced button becomes the events DOWN and UP; the machine tells a click (released within a second) from a long press (held a second). The LED shows a long press.',
      needs: 'An ESP32 DevKit, a push button and an LED with a 220 Ω resistor.',
      wiring: [['GPIO4', 'push button → GND', 'internal pull-up'], ['GPIO25', '220 Ω → LED → GND']],
      blocks: `
        when started
          set pin (4) as [input with pull-up v]
          set pin (25) as [output v]
          go to state [RELEASED v]

        when entering state [RELEASED v]
          set pin (25) to [LOW v]

        when entering state [HELD v]
          set pin (25) to [HIGH v]
          print [long press]

        when pin (4) goes [low v]          // debounced: the level held for 20 ms
          raise event [DOWN v]

        when pin (4) goes [high v]
          raise event [UP v]

        when event [DOWN v] in state [RELEASED v]
          go to state [PRESSED v]

        when event [UP v] in state [PRESSED v]
          print [click]
          go to state [RELEASED v]

        when (1) seconds in state [PRESSED v]
          go to state [HELD v]

        when event [UP v] in state [HELD v]
          go to state [RELEASED v]
      `,
      cpp: String.raw`
        const int BUTTON = 4;
        const int LED = 25;
        const uint32_t HOLD_MS = 1000;
        const uint32_t DEBOUNCE_MS = 20;

        enum State { RELEASED, PRESSED, HELD };
        enum Event { DOWN, UP };

        State state = RELEASED;
        uint32_t enteredAt = 0;

        void goTo(State next) {
          state = next;
          enteredAt = millis();
          digitalWrite(LED, state == HELD);           // entry action: the LED shows a long press
          if (state == HELD) Serial.println("long press");
        }

        void handle(Event ev) {
          switch (state) {
            case RELEASED:
              if (ev == DOWN) goTo(PRESSED);
              break;
            case PRESSED:
              if (ev == UP) { Serial.println("click"); goTo(RELEASED); }   // an action on the transition
              break;
            case HELD:
              if (ev == UP) goTo(RELEASED);
              break;
          }
        }

        // turns the raw pin into DOWN and UP events once it has stayed put for DEBOUNCE_MS
        bool stableLevel = HIGH, lastRaw = HIGH;
        uint32_t changedAt = 0;

        void pollButton() {
          bool raw = digitalRead(BUTTON);
          if (raw != lastRaw) { lastRaw = raw; changedAt = millis(); }
          if (raw != stableLevel && millis() - changedAt >= DEBOUNCE_MS) {
            stableLevel = raw;
            handle(stableLevel == LOW ? DOWN : UP);
          }
        }

        void setup() {
          Serial.begin(115200);
          pinMode(BUTTON, INPUT_PULLUP);
          pinMode(LED, OUTPUT);
          goTo(RELEASED);
        }

        void loop() {
          pollButton();
          if (state == PRESSED && millis() - enteredAt >= HOLD_MS) goTo(HELD);   // the timeout
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        BUTTON = Pin(4, Pin.IN, Pin.PULL_UP)
        LED = Pin(25, Pin.OUT)
        HOLD_MS = 1000
        DEBOUNCE_MS = 20

        RELEASED, PRESSED, HELD = 0, 1, 2
        state = RELEASED
        entered_at = time.ticks_ms()

        def go_to(new_state):
            global state, entered_at
            state = new_state
            entered_at = time.ticks_ms()
            LED.value(1 if state == HELD else 0)      # entry action: the LED shows a long press
            if state == HELD:
                print("long press")

        def handle(event):
            if state == RELEASED:
                if event == "DOWN":
                    go_to(PRESSED)
            elif state == PRESSED:
                if event == "UP":
                    print("click")                    # an action on the transition
                    go_to(RELEASED)
            elif state == HELD:
                if event == "UP":
                    go_to(RELEASED)

        # turns the raw pin into DOWN and UP events once it has stayed put for DEBOUNCE_MS
        stable_level = 1
        last_raw = 1
        changed_at = time.ticks_ms()

        def poll_button():
            global stable_level, last_raw, changed_at
            raw = BUTTON.value()
            if raw != last_raw:
                last_raw = raw
                changed_at = time.ticks_ms()
            if raw != stable_level and time.ticks_diff(time.ticks_ms(), changed_at) >= DEBOUNCE_MS:
                stable_level = raw
                handle("DOWN" if stable_level == 0 else "UP")

        go_to(RELEASED)
        while True:
            poll_button()
            if state == PRESSED and time.ticks_diff(time.ticks_ms(), entered_at) >= HOLD_MS:   # the timeout
                go_to(HELD)
            time.sleep_ms(2)
      `,
      output: `
        click
        long press
      `,
      notes: ['The raw button gives levels; the machine wants edges. Turning one into the other is a small job of its own, kept apart from the machine so the machine stays easy to test ([[testing-a-state-machine]]).']
    }
  ],
  quiz: [
    { q: 'A diagram has a state HELD with no arrow leaving it. What is the most likely problem?', choices: ['None: every machine has a final state', 'Once the button is held, the machine can never leave HELD: an arrow for UP is missing', 'The machine is too fast', 'The initial state is wrong'], a: 1, why: 'A state with no way out is a trap. It is right for a deliberate latched fault; for a button it means the release was forgotten.' },
    { q: 'What marks the initial state in the usual notation?', choices: ['A double border', 'An arrow coming from a black dot', 'The box at the top', 'A state named START'], a: 1, why: 'The black dot with an arrow is the conventional mark for where the machine begins; the target of that arrow is the initial state.' },
    { q: 'An arrow from a state back to itself means that the machine stays put and nothing at all happens.', a: false, why: 'In the usual reading a self-transition leaves and re-enters the state: exit and entry actions run again and any timeout restarts. If you want only an action, use one without a transition.' },
    { q: 'Two arrows leave RELEASED, both labelled DOWN, to different states. What must you do?', choices: ['Nothing: the one drawn first wins', 'Add a guard so that at most one applies, or decide that they are different events', 'Delete one of the states', 'Add a timeout'], a: 1, why: 'Two unguarded arrows for the same event from the same state make the machine ambiguous. Either a condition distinguishes them, or the events are really different.' }
  ],
  applications: [
    'Design reviews: a diagram on a whiteboard lets the customer say "no, a long press should not do that" before any code is written.',
    'Documentation of firmware: the state diagram is the page of the manual that explains how the device behaves.',
    'Protocol specifications, which are written as state diagrams: the TCP connection states, the Bluetooth LE link layer states.',
    'Debugging: when a device misbehaves, the first question is "which state was it in?", and the diagram is the map.'
  ],
  sources: [
    'Object Management Group, *Unified Modeling Language* specification: state machine diagrams, the notation for states, transitions, guards and the initial pseudostate.',
    'David Harel, "Statecharts: a visual formalism for complex systems", Science of Computer Programming 8 (1987).',
    'Arduino core for ESP32 documentation, `INPUT_PULLUP` and `digitalRead`; MicroPython documentation, `machine.Pin`.'
  ],
  sim: 'sm-diagram-check'
},

/* ================================================================ a state machine in code */
{
  id: 'state-machine-in-code',
  parent: 'state-machines',
  title: 'A state machine in code: switch, table, class',
  level: 2,
  short: 'Three well-worn ways to write the same machine — a switch on an enum, a transition table, one function per state — and when each is worth it.',
  keywords: ['switch', 'enum', 'transition table', 'table-driven', 'function pointer', 'state pattern', 'handler dictionary', 'dispatch', 'goTo', 'mode selector', 'implementation', 'class per state'],
  prereq: ['states-events-transitions', 'drawing-a-state-diagram', 'functions'],
  related: ['structs-and-classes', 'timeouts-and-timed-states', 'readable-code', 'translating-between-languages'],
  body: `You have a diagram; it must become a program. There are three well-worn ways, and they all do exactly the same thing. They differ in where the machine *lives* in the code, and so in how easy it is to read, change and grow. The running example is a mode selector: each press of a button steps a lamp through OFF, SLOW blinking and FAST blinking.

### 1. A switch on an enum

Name the states with an \`enum\` (constants in MicroPython), keep the current one in a variable and \`switch\` on it. Each \`case\` holds what that state does with each event. It is the first thing to try: nothing new to learn, easy to step through in a debugger, and the compiler can warn about a state you forgot. It strains as the machine grows: the same states appear in several switches (events, entry actions, timeouts) and a new state must be added to each.

### 2. A transition table

Put the machine in *data*: rows of \`{from, event, to}\`, searched on each event. The code that runs the machine is five lines and never changes; to change the machine you change the table, which reads almost like the diagram. Tables suit many states with simple transitions, machines that are generated or loaded, and tools that check them. Actions are the weak point: a row can name a function, but anything subtle ends in a second \`switch\`.

~~~cpp
const Row TABLE[] = { {OFF, PRESS, SLOW}, {SLOW, PRESS, FAST}, {FAST, PRESS, OFF} };
~~~

### 3. One function per state

Give each state a function and keep a pointer to the current one. The function receives every event, including two that the machine sends itself: ENTER when the state is entered and TICK once per pass of the loop. All about a state — its entry actions, what it does while it lasts, the events it accepts — sits in one place. It is the best layout when states *do* things (blink, ramp, retry) and when several people edit the machine. The price: the whole machine is no longer visible at a glance, and function pointers confuse beginners. In MicroPython a dictionary of functions does the same job.

### Which one?

| | Switch | Table | Function per state |
|---|---|---|---|
| Best for | a first machine, up to about six states | many simple transitions, generated machines | states that do things, team work |
| Reads like | the code | the diagram | the states one by one |
| Adding a state | edit several switches | add rows | add a function |

Whatever the layout, keep three rules: the state changes in **one function** only (\`goTo\`), a timeout is measured from the moment the state was entered, and nothing in the machine ever waits. The [state-machine lab](#/tools/fsmlab) writes a switch layout from a drawing as a starting point.

> [!key] A state machine can live in a switch, a table or one function per state. Start with the switch; move to a table when the transitions dominate, and to per-state functions when the states do the work.`,
  ideas: [
    'A switch on an enum is the simplest layout and the right start; its weakness is that every state appears in several switches.',
    'A transition table keeps the machine in data: the code that runs it never changes, and the table reads like the diagram.',
    'One function per state keeps everything about a state together, which suits states that do things over time.',
    'Whatever the layout: change state in one function, measure timeouts from entry, never wait.'
  ],
  pitfalls: [
    'The three layouts behave differently, so I must pick the one that matches my diagram — They are the same machine written three ways; the diagram fits all of them. Choose by how the code will be read and changed, not by what it does.',
    'Setting the state variable directly from anywhere is quicker — Then entry actions, the entry time and any logging must be repeated at every place, and one will be forgotten. Change state only through one function.',
    'A table or a pointer is too advanced for a small project — For three states a switch is better. Tables and per-state functions pay off when the machine has many states or each state does work of its own.'
  ],
  terms: [
    { term: 'Enum', also: ['enumeration', 'enumerated type'], def: 'A type whose values are a short list of names, such as OFF, SLOW, FAST. It is the usual way to name the states in C++; MicroPython uses plain constants.' },
    { term: 'Dispatch', also: ['event dispatch', 'handler lookup'], def: 'Choosing which code handles an event, from the current state and the event: by a switch, by searching a table, or by calling the current state\'s function.' },
    { term: 'Table-driven', also: ['data-driven', 'state table'], def: 'Written so that the machine is held in a table of rows and a small, fixed piece of code interprets it. Changing the machine means changing the table, not the code.' },
    { term: 'Function pointer', also: ['callback', 'handler'], def: 'A variable that holds a function, so that the program can call whichever one it holds. A machine with one function per state stores the current state this way.' }
  ],
  choose: {
    good: ['A switch for a first machine, up to about six states, or when you want the simplest thing to debug', 'A table for many states with simple transitions, or a machine that is generated or loaded', 'One function per state when states do things over time or several people edit the machine'],
    avoid: ['A huge switch with the same states repeated in four places', 'A table for machines whose rows each need their own long action', 'Function pointers when the team does not know them and the machine has three states'],
    check: ['How many states will it have a year from now?', 'Do the states do things while they last, or only react?', 'Who will read and change this code, and what do they know?']
  },
  code: [
    {
      title: 'Layout 1: a switch on an enum',
      about: 'A button steps the lamp through OFF, SLOW (blinks every 500 ms) and FAST (every 120 ms). The state is an enum, and each case holds what that state does with PRESS.',
      needs: 'An ESP32 DevKit, a push button and an LED with a 220 Ω resistor.',
      wiring: [['GPIO4', 'push button → GND', 'internal pull-up'], ['GPIO25', '220 Ω → LED → GND']],
      blocks: `
        when started
          set pin (4) as [input with pull-up v]
          set pin (25) as [output v]
          go to state [OFF v]

        when entering state [OFF v]
          set pin (25) to [LOW v]

        when entering state [SLOW v]
          set pin (25) to [HIGH v]

        when entering state [FAST v]
          set pin (25) to [HIGH v]

        when pin (4) goes [low v]
          raise event [PRESS v]

        when event [PRESS v] in state [OFF v]
          go to state [SLOW v]

        when event [PRESS v] in state [SLOW v]
          go to state [FAST v]

        when event [PRESS v] in state [FAST v]
          go to state [OFF v]

        every (0.5) seconds do
          if <state = [SLOW v]> then
            toggle pin (25)
          end
        end

        every (0.12) seconds do
          if <state = [FAST v]> then
            toggle pin (25)
          end
        end
      `,
      cpp: String.raw`
        const int BUTTON = 4;
        const int LED = 25;

        enum State { OFF, SLOW, FAST };
        enum Event { PRESS };

        State state = OFF;
        uint32_t lastBlink = 0;
        bool ledOn = false;
        bool wasPressed = false;

        void setLed(bool on) { ledOn = on; digitalWrite(LED, on); }

        void goTo(State next) {
          state = next;
          lastBlink = millis();
          setLed(state != OFF);               // entry action: SLOW and FAST start with the LED on
        }

        void handle(Event ev) {
          switch (state) {
            case OFF:
              if (ev == PRESS) goTo(SLOW);
              break;
            case SLOW:
              if (ev == PRESS) goTo(FAST);
              break;
            case FAST:
              if (ev == PRESS) goTo(OFF);
              break;
          }
        }

        uint32_t blinkPeriod() {              // a second switch: what each state does while it lasts
          switch (state) {
            case SLOW: return 500;
            case FAST: return 120;
            default:   return 0;              // OFF: no blinking
          }
        }

        void setup() {
          pinMode(BUTTON, INPUT_PULLUP);
          pinMode(LED, OUTPUT);
          goTo(OFF);
        }

        void loop() {
          bool pressed = digitalRead(BUTTON) == LOW;
          if (pressed && !wasPressed) handle(PRESS);
          wasPressed = pressed;

          uint32_t period = blinkPeriod();
          if (period && millis() - lastBlink >= period) {
            lastBlink += period;
            setLed(!ledOn);
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        BUTTON = Pin(4, Pin.IN, Pin.PULL_UP)
        LED = Pin(25, Pin.OUT)

        OFF, SLOW, FAST = 0, 1, 2
        state = OFF
        last_blink = time.ticks_ms()
        led_on = False
        was_pressed = False

        def set_led(on):
            global led_on
            led_on = on
            LED.value(1 if on else 0)

        def go_to(new_state):
            global state, last_blink
            state = new_state
            last_blink = time.ticks_ms()
            set_led(state != OFF)             # entry action: SLOW and FAST start with the LED on

        def handle(event):
            if state == OFF:
                if event == "PRESS":
                    go_to(SLOW)
            elif state == SLOW:
                if event == "PRESS":
                    go_to(FAST)
            elif state == FAST:
                if event == "PRESS":
                    go_to(OFF)

        def blink_period():                   # a second if/elif: what each state does while it lasts
            if state == SLOW:
                return 500
            if state == FAST:
                return 120
            return 0                          # OFF: no blinking

        go_to(OFF)
        while True:
            pressed = BUTTON.value() == 0
            if pressed and not was_pressed:
                handle("PRESS")
            was_pressed = pressed

            period = blink_period()
            if period and time.ticks_diff(time.ticks_ms(), last_blink) >= period:
                last_blink = time.ticks_add(last_blink, period)
                set_led(not led_on)
            time.sleep_ms(2)
      `
    },
    {
      title: 'Layout 2: a transition table',
      about: 'The same mode selector with the machine held as data. The code that runs it is the same few lines whatever the table says; the blink periods are a second table indexed by state.',
      needs: 'The same board and wiring.',
      wiring: [['GPIO4', 'push button → GND', 'internal pull-up'], ['GPIO25', '220 Ω → LED → GND']],
      na: { blocks: 'The block notation shows the machine itself, not how it is stored: the blocks of layout 1 describe layout 2 and layout 3 just as well.' },
      cpp: String.raw`
        const int BUTTON = 4;
        const int LED = 25;

        enum State { OFF, SLOW, FAST };
        enum Event { PRESS };

        struct Row { State from; Event ev; State to; };
        const Row TABLE[] = {                         // the machine, as data
          { OFF,  PRESS, SLOW },
          { SLOW, PRESS, FAST },
          { FAST, PRESS, OFF  },
        };
        const uint32_t BLINK_MS[] = { 0, 500, 120 };  // by state: OFF, SLOW, FAST (0 = no blinking)

        State state = OFF;
        uint32_t lastBlink = 0;
        bool ledOn = false;
        bool wasPressed = false;

        void setLed(bool on) { ledOn = on; digitalWrite(LED, on); }

        void goTo(State next) {
          state = next;
          lastBlink = millis();
          setLed(state != OFF);
        }

        void handle(Event ev) {                       // the same few lines for every machine
          for (const Row &r : TABLE) {
            if (r.from == state && r.ev == ev) { goTo(r.to); return; }
          }                                           // no row: the event is ignored in this state
        }

        void setup() {
          pinMode(BUTTON, INPUT_PULLUP);
          pinMode(LED, OUTPUT);
          goTo(OFF);
        }

        void loop() {
          bool pressed = digitalRead(BUTTON) == LOW;
          if (pressed && !wasPressed) handle(PRESS);
          wasPressed = pressed;

          uint32_t period = BLINK_MS[state];
          if (period && millis() - lastBlink >= period) {
            lastBlink += period;
            setLed(!ledOn);
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        BUTTON = Pin(4, Pin.IN, Pin.PULL_UP)
        LED = Pin(25, Pin.OUT)

        OFF, SLOW, FAST = 0, 1, 2
        TABLE = {                                     # the machine, as data: (state, event) -> next state
            (OFF, "PRESS"): SLOW,
            (SLOW, "PRESS"): FAST,
            (FAST, "PRESS"): OFF,
        }
        BLINK_MS = {OFF: 0, SLOW: 500, FAST: 120}     # by state (0 = no blinking)

        state = OFF
        last_blink = time.ticks_ms()
        led_on = False
        was_pressed = False

        def set_led(on):
            global led_on
            led_on = on
            LED.value(1 if on else 0)

        def go_to(new_state):
            global state, last_blink
            state = new_state
            last_blink = time.ticks_ms()
            set_led(state != OFF)

        def handle(event):                            # the same few lines for every machine
            next_state = TABLE.get((state, event))
            if next_state is not None:                # no entry: the event is ignored in this state
                go_to(next_state)

        go_to(OFF)
        while True:
            pressed = BUTTON.value() == 0
            if pressed and not was_pressed:
                handle("PRESS")
            was_pressed = pressed

            period = BLINK_MS[state]
            if period and time.ticks_diff(time.ticks_ms(), last_blink) >= period:
                last_blink = time.ticks_add(last_blink, period)
                set_led(not led_on)
            time.sleep_ms(2)
      `
    },
    {
      title: 'Layout 3: one function per state',
      about: 'The same mode selector with each state as a function that receives ENTER (once, on entry), TICK (every pass) and PRESS. The current state is a pointer to a function; MicroPython simply holds the function in a variable.',
      needs: 'The same board and wiring.',
      wiring: [['GPIO4', 'push button → GND', 'internal pull-up'], ['GPIO25', '220 Ω → LED → GND']],
      na: { blocks: 'The block notation shows the machine itself, not how it is stored: the blocks of layout 1 describe layout 2 and layout 3 just as well.' },
      cpp: String.raw`
        const int BUTTON = 4;
        const int LED = 25;

        enum Event { ENTER, TICK, PRESS };            // ENTER and TICK are sent by the machine itself

        void stateOff(Event ev);
        void stateSlow(Event ev);
        void stateFast(Event ev);

        void (*state)(Event) = stateOff;              // the current state is a function
        uint32_t lastBlink = 0;
        bool ledOn = false;
        bool wasPressed = false;

        void setLed(bool on) { ledOn = on; digitalWrite(LED, on); }

        void goTo(void (*next)(Event)) {
          state = next;
          state(ENTER);                               // the new state says what it does on entry
        }

        void blink(uint32_t period) {
          if (millis() - lastBlink >= period) { lastBlink += period; setLed(!ledOn); }
        }

        void stateOff(Event ev) {
          if (ev == ENTER) setLed(false);
          if (ev == PRESS) goTo(stateSlow);
        }

        void stateSlow(Event ev) {
          if (ev == ENTER) { setLed(true); lastBlink = millis(); }
          if (ev == TICK) blink(500);
          if (ev == PRESS) goTo(stateFast);
        }

        void stateFast(Event ev) {
          if (ev == ENTER) { setLed(true); lastBlink = millis(); }
          if (ev == TICK) blink(120);
          if (ev == PRESS) goTo(stateOff);
        }

        void setup() {
          pinMode(BUTTON, INPUT_PULLUP);
          pinMode(LED, OUTPUT);
          state(ENTER);
        }

        void loop() {
          bool pressed = digitalRead(BUTTON) == LOW;
          if (pressed && !wasPressed) state(PRESS);
          wasPressed = pressed;
          state(TICK);                                // once per pass: the state may do something
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        BUTTON = Pin(4, Pin.IN, Pin.PULL_UP)
        LED = Pin(25, Pin.OUT)

        ENTER, TICK, PRESS = "ENTER", "TICK", "PRESS"   # ENTER and TICK are sent by the machine itself

        last_blink = time.ticks_ms()
        led_on = False
        was_pressed = False

        def set_led(on):
            global led_on
            led_on = on
            LED.value(1 if on else 0)

        def blink(period):
            global last_blink
            if time.ticks_diff(time.ticks_ms(), last_blink) >= period:
                last_blink = time.ticks_add(last_blink, period)
                set_led(not led_on)

        def state_off(event):
            if event == ENTER:
                set_led(False)
            elif event == PRESS:
                go_to(state_slow)

        def state_slow(event):
            global last_blink
            if event == ENTER:
                set_led(True)
                last_blink = time.ticks_ms()
            elif event == TICK:
                blink(500)
            elif event == PRESS:
                go_to(state_fast)

        def state_fast(event):
            global last_blink
            if event == ENTER:
                set_led(True)
                last_blink = time.ticks_ms()
            elif event == TICK:
                blink(120)
            elif event == PRESS:
                go_to(state_off)

        state = state_off                             # the current state is a function

        def go_to(next_state):
            global state
            state = next_state
            state(ENTER)                              # the new state says what it does on entry

        state(ENTER)
        while True:
            pressed = BUTTON.value() == 0
            if pressed and not was_pressed:
                state(PRESS)
            was_pressed = pressed
            state(TICK)                               # once per pass: the state may do something
            time.sleep_ms(2)
      `,
      notes: ['In C++ a class with a virtual method per event is the same idea with more ceremony; each state is an object, and the current state a pointer to one of them.']
    }
  ],
  examples: [
    {
      title: 'Adding a fourth mode',
      q: 'You want a STROBE mode, blinking every 40 ms, between FAST and OFF. What must change in each layout?',
      steps: ['Switch: a new enum value; a new case in `handle`; a new case in `blinkPeriod`; and FAST\'s PRESS now goes to STROBE — four places.', 'Table: a new enum value, one changed row (FAST → STROBE), one new row (STROBE → OFF) and one new entry in `BLINK_MS` — all in the two arrays.', 'Function per state: one new function `stateStrobe`, and one changed line in `stateFast`.'],
      a: 'The switch needs four edits in different places, the table edits two arrays, and the per-state layout adds one function and changes one line: that is how the layouts scale.'
    }
  ],
  quiz: [
    { q: 'A machine has 40 states and almost every transition is a plain "on this event, go there". Which layout fits best?', choices: ['Nested if statements in loop()', 'A transition table', 'A single switch with delay() calls', 'Boolean flags'], a: 1, why: 'A table keeps 40 simple transitions as 40 short rows and one small interpreter. A switch of 40 cases would work but be long to read; flags would not scale.' },
    { q: 'In the function-per-state layout, what is ENTER?', choices: ['The key the user presses', 'An event the machine sends to a state when it is entered, so the state can run its entry actions', 'The first line of loop()', 'A timeout'], a: 1, why: 'Sending ENTER (and TICK once per pass) lets each state keep its entry action, its repeated work and its transitions in the same function.' },
    { q: 'The three layouts produce different behaviour, so the right one must be chosen to match the diagram.', a: false, why: 'They are the same machine in three notations. Choose by how the code will be read, changed and grown.' },
    { q: 'Why should the state variable be changed in only one function, such as goTo()?', choices: ['It saves memory', 'Entry actions, the entry time and any logging then happen every time, from one place', 'C++ forbids other assignments', 'A switch cannot change state any other way'], a: 1, why: 'If any code may write the state variable, each such place must remember the entry time and the entry actions; sooner or later one forgets.' }
  ],
  applications: [
    'Small appliances: a switch on an enum is the usual layout for a kettle, a fan with modes, a coffee machine.',
    'Protocol parsers and command interpreters, where a table of states and byte classes is clearer than code.',
    'Screens of a user interface: one function per screen, entered with ENTER and drawn on TICK.',
    'Generated firmware: tools that turn a drawn diagram into a table or a switch, as the lab here does for a switch.'
  ],
  sources: [
    'Miro Samek, *Practical UML Statecharts in C/C++* (2nd edition, 2008): implementations of state machines in embedded C and C++.',
    'Arduino core for ESP32 documentation: language reference, `enum`, `switch` and function pointers as in C++.',
    'MicroPython documentation: the language and its differences from CPython; functions as values and dictionaries.'
  ],
  sim: 'sm-code-layouts'
},

/* ================================================================ timeouts and timed states */
{
  id: 'timeouts-and-timed-states',
  parent: 'state-machines',
  title: 'Timeouts and timed states',
  level: 2,
  short: 'A timeout is a transition that fires when a state has lasted too long. Note the time on entry, compare elapsed time on every pass, and the timer discards itself when you leave the state.',
  keywords: ['timeout', 'timed state', 'after', 'elapsed time', 'millis', 'ticks_diff', 'wrap-around', 'pump controller', 'dry run', 'level or edge', 'float switch', 'rest period', 'time in state'],
  prereq: ['state-machine-in-code', 'non-blocking-timing'],
  related: ['software-timers', 'delays-and-yielding', 'on-off-control-and-hysteresis', 'error-states-and-recovery', 'project-plant-watering'],
  body: `Time is the most common event of all, and the easiest to handle badly. "Run the pump at most twenty seconds", "give up connecting after fifteen seconds", "switch off two seconds after the hand leaves" — each is a **timeout**: a transition that fires not because something happened but because *nothing* happened for long enough.

### The one-line recipe

When the machine enters a state it notes the time: \`enteredAt = millis()\`. On every pass of the loop, a state with a timeout compares: \`millis() - enteredAt >= 20000\`. If that is true, the timeout transition fires. There is no timer to start or cancel: leaving the state throws the timeout away, because the next state measures against *its own* \`enteredAt\`. Entering a state again — even the same one — restarts the clock.

### Subtract; never compare deadlines

Always compare *elapsed time* with a limit. \`millis()\` wraps after about 49.7 days; the unsigned subtraction \`now - enteredAt\` stays right across the wrap, whereas \`now >= deadline\` fails at it. In MicroPython the tick counter wraps much sooner, so use \`time.ticks_diff(now, entered_at)\` ([[non-blocking-timing]]). And never use \`delay()\` for the timeout: it stops the very loop that must watch for the events that could end the state early.

### The example: a pump controller

A float switch in a tank gives two events, TANK_LOW and TANK_FULL. The machine has three states: IDLE (pump off), PUMPING (pump on) and RESTING (pump off, cooling). TANK_LOW in IDLE starts the pump; TANK_FULL in PUMPING stops it. Two timeouts protect the pump: PUMPING lasts at most **20 s** — if the tank has not filled by then the well may be dry, and a pump running dry burns out — and RESTING lasts **10 s** before the next attempt. The simulation has a tank with a leak you can enlarge, and a well you can dry out.

### Level or edge?

There is a trap in the events. If TANK_LOW were sent only when the float *changes*, a tank still low when RESTING ends would never restart the pump: the event came and went while the machine was elsewhere. Either send the **level** on every pass, as the program does, or look at the level again on entering IDLE.

> [!warn] If the pump runs from mains, switching it is work for a qualified person, behind isolation and in an enclosure; a bare relay board on a desk is not a product. The logic here is the same for a 12 V pump switched by a MOSFET module.

> [!key] A timeout is a transition that fires when a state has lasted too long. Record the time on entry, compare elapsed time on every pass, and leave the state to throw the timer away.`,
  ideas: [
    'A timeout is a transition whose event is "this state has lasted long enough".',
    'Note the time on entry and compare elapsed time on every pass; leaving the state discards the timer, and re-entering restarts it.',
    'Compare elapsed time (now minus entry) with a limit, never now with a deadline, so that the clock wrapping round does no harm.',
    'Events taken from a changing input can be missed while the machine is in another state: send the level, or look again on entry.'
  ],
  pitfalls: [
    'I will use delay() for a timeout, it is simpler — While the delay runs nothing else is watched: the tank-full float could rise and the pump would still run on. A timeout is a comparison in the loop, so every other event is still seen.',
    'The pump timeout protects the pump from a dry well — It limits one run to 20 s, but with a 10 s rest the pump still runs dry for forty minutes in every hour. Count the failures and give up: see the page on error states.',
    'A machine that reacts to the float switch changing is enough — If the level is still low when the machine returns to IDLE, no change occurs and no event is sent: the pump never restarts. Send the level on every pass.'
  ],
  terms: [
    { term: 'Timeout', also: ['after transition', 'time-out'], def: 'A transition that fires when a state has lasted a given time. It is the machine\'s way of acting on "nothing happened for long enough".' },
    { term: 'Time in state', also: ['dwell time', 'elapsed time'], def: 'How long the machine has been in its current state: now minus the time of entry. Every timeout is a comparison of this number with a limit.' },
    { term: 'Wrap-around', also: ['overflow', 'rollover'], def: 'What a counter does when it reaches its largest value and starts again from zero. millis() wraps after about 49.7 days; subtracting unsigned values still gives the right difference.' },
    { term: 'Level-triggered event', also: ['level event'], def: 'An event sent for as long as a condition holds — such as "the tank is low" — rather than once when it begins. It cannot be missed, because it keeps coming.' }
  ],
  code: [
    {
      title: 'A pump controller with timeouts',
      about: 'The pump starts when the low float closes and stops when the full float closes. It may run for 20 s at most, then rests for 10 s before it tries again.',
      needs: 'An ESP32 DevKit, two float switches (or two push buttons as stand-ins) and a pump switched by a MOSFET or relay module.',
      wiring: [['GPIO32', 'low float switch → GND', 'internal pull-up; closed when the water is below the low mark'], ['GPIO33', 'full float switch → GND', 'internal pull-up; closed when the tank is full'], ['GPIO25', 'pump switching module input']],
      blocks: `
        when started
          set pin (32) as [input with pull-up v]
          set pin (33) as [input with pull-up v]
          set pin (25) as [output v]
          go to state [IDLE v]
          forever
            if <(read pin (32)) = [LOW v]> then
              raise event [TANK_LOW v]
            end
            if <(read pin (33)) = [LOW v]> then
              raise event [TANK_FULL v]
            end
          end

        when entering state [IDLE v]
          set pin (25) to [LOW v]

        when entering state [PUMPING v]
          set pin (25) to [HIGH v]

        when entering state [RESTING v]
          set pin (25) to [LOW v]

        when event [TANK_LOW v] in state [IDLE v]
          go to state [PUMPING v]

        when event [TANK_FULL v] in state [PUMPING v]
          go to state [IDLE v]

        when (20) seconds in state [PUMPING v]    // the well may be dry
          go to state [RESTING v]

        when (10) seconds in state [RESTING v]
          go to state [IDLE v]
      `,
      cpp: String.raw`
        const int LOW_FLOAT = 32;                   // closed to GND when the water is below the low mark
        const int FULL_FLOAT = 33;                  // closed to GND when the tank is full
        const int PUMP = 25;                        // to the pump's switching module
        const uint32_t MAX_RUN_MS = 20000;
        const uint32_t REST_MS = 10000;

        enum State { IDLE, PUMPING, RESTING };
        enum Event { TANK_LOW, TANK_FULL };
        State state = IDLE;
        uint32_t enteredAt = 0;

        void goTo(State next) {
          state = next;
          enteredAt = millis();
          digitalWrite(PUMP, state == PUMPING);     // entry action: the pump follows the state
          Serial.printf("state %d\n", state);
        }

        void handle(Event ev) {
          switch (state) {
            case IDLE:    if (ev == TANK_LOW)  goTo(PUMPING); break;
            case PUMPING: if (ev == TANK_FULL) goTo(IDLE);    break;
            case RESTING: break;                    // ignores both events: the pump is cooling
          }
        }

        void setup() {
          Serial.begin(115200);
          pinMode(LOW_FLOAT, INPUT_PULLUP);
          pinMode(FULL_FLOAT, INPUT_PULLUP);
          pinMode(PUMP, OUTPUT);
          goTo(IDLE);
        }

        void loop() {
          if (digitalRead(LOW_FLOAT) == LOW) handle(TANK_LOW);     // events from the floats, sent as levels
          if (digitalRead(FULL_FLOAT) == LOW) handle(TANK_FULL);

          uint32_t inState = millis() - enteredAt;                 // events from the clock
          if (state == PUMPING && inState >= MAX_RUN_MS) goTo(RESTING);
          if (state == RESTING && inState >= REST_MS) goTo(IDLE);
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        LOW_FLOAT = Pin(32, Pin.IN, Pin.PULL_UP)    # closed to GND when the water is below the low mark
        FULL_FLOAT = Pin(33, Pin.IN, Pin.PULL_UP)   # closed to GND when the tank is full
        PUMP = Pin(25, Pin.OUT)                     # to the pump's switching module
        MAX_RUN_MS = 20000
        REST_MS = 10000

        IDLE, PUMPING, RESTING = 0, 1, 2
        state = IDLE
        entered_at = time.ticks_ms()

        def go_to(new_state):
            global state, entered_at
            state = new_state
            entered_at = time.ticks_ms()
            PUMP.value(1 if state == PUMPING else 0)   # entry action: the pump follows the state
            print("state", state)

        def handle(event):
            if state == IDLE and event == "TANK_LOW":
                go_to(PUMPING)
            elif state == PUMPING and event == "TANK_FULL":
                go_to(IDLE)
            # RESTING ignores both events: the pump is cooling

        go_to(IDLE)
        while True:
            if LOW_FLOAT.value() == 0:              # events from the floats, sent as levels
                handle("TANK_LOW")
            if FULL_FLOAT.value() == 0:
                handle("TANK_FULL")

            in_state = time.ticks_diff(time.ticks_ms(), entered_at)   # events from the clock
            if state == PUMPING and in_state >= MAX_RUN_MS:
                go_to(RESTING)
            elif state == RESTING and in_state >= REST_MS:
                go_to(IDLE)
            time.sleep_ms(20)
      `,
      output: `
        state 1
        state 0
      `,
      notes: ['The comparison `>=` makes the timeout fire on the first pass at or after the limit; the loop must run much faster than the limit for it to be on time (here, every few milliseconds).']
    }
  ],
  examples: [
    {
      title: 'How long does a dry well run the pump?',
      q: 'The well is dry. The pump runs for its 20 s limit, rests 10 s, and the tank is still low, so it starts again. How long does it run, in total, in one hour?',
      steps: ['One cycle is 20 s of running plus 10 s of rest: 30 s.', 'An hour holds 3600 / 30 = 120 cycles.', 'The pump runs 120 × 20 s = 2400 s = 40 minutes of the hour — with no water to cool it.'],
      a: 'Forty minutes of dry running every hour. The timeout limits one run but not the total: count the failed runs and stop after a few ([[error-states-and-recovery]]).'
    }
  ],
  quiz: [
    { q: 'The pump has been PUMPING for 19 s when the tank fills and TANK_FULL is handled. What happens to the 20 s timeout?', choices: ['It fires a second later and stops the pump', 'It is discarded: leaving PUMPING abandons it', 'It carries over to IDLE', 'It restarts in RESTING'], a: 1, why: 'The timeout is only a comparison against the time PUMPING was entered. When the machine leaves PUMPING there is nothing left to fire.' },
    { q: 'Why compare `millis() - enteredAt >= limit` rather than `millis() >= deadline`?', choices: ['It is faster', 'It stays correct when millis() wraps round', 'It uses less memory', 'Deadlines are not allowed in C++'], a: 1, why: 'Unsigned subtraction gives the right elapsed time even across the wrap after about 49.7 days; a deadline computed as a large number fails when the counter restarts at zero.' },
    { q: 'If TANK_LOW is sent only when the low float changes, a tank that is still low when RESTING ends restarts the pump on its own.', a: false, why: 'No change happens, so no event is sent, and IDLE waits for ever. Send the level on every pass, or check the level on entering IDLE.' },
    { q: 'A state has a 10 s timeout. After 4 s the machine leaves and re-enters the same state. How long until the timeout now?', choices: ['6 s', '10 s from the re-entry', '0 s', '4 s'], a: 1, why: 'Entering a state notes a new entry time, so the clock restarts, even when the state is the one just left.' }
  ],
  applications: [
    'Pumps, compressors and fans with a longest run time and a rest period, so a fault cannot burn them out.',
    'Heaters, kettles and irons with a safety cut-off that fires when the temperature has not been reached in time.',
    'Connection attempts that give up after a timeout and try again later, as in the Wi-Fi and MQTT connection manager.',
    'Stair lights, door-open alarms and display back-lights that switch off after a time.'
  ],
  sources: [
    'Arduino core for ESP32 documentation, `millis()`; MicroPython documentation, `time.ticks_ms()`, `time.ticks_diff()` and `time.ticks_add()`.',
    'FreeRTOS documentation: software timers, the operating system\'s way of delivering a timeout when a state machine runs in a task.',
    'David Harel, "Statecharts: a visual formalism for complex systems", Science of Computer Programming 8 (1987): timeouts as transitions.'
  ],
  sim: { id: 'sm-pump', params: { mode: 'timed' } }
},

/* ================================================================ entry, exit and guards */
{
  id: 'entry-exit-and-guards',
  parent: 'state-machines',
  title: 'Entry actions, exit actions and guards',
  level: 2,
  short: 'Put what a state is in its entry action and its clean-up in its exit action, so no way in or out can forget them; use a guard when the same event must lead to different places.',
  keywords: ['entry action', 'exit action', 'guard', 'guard condition', 'internal transition', 'self-transition', 'door lock', 'keypad', 'lockout', 'tries counter', 'order of actions', 'bolt', 'solenoid'],
  prereq: ['state-machine-in-code', 'states-events-transitions'],
  related: ['timeouts-and-timed-states', 'hierarchical-states', 'error-states-and-recovery', 'testing-a-state-machine', 'electronics:flyback-diode'],
  body: `Two small additions make a machine far easier to get right. The first answers "where do I put the actions?"; the second answers "what if the same event can lead to different places?"

### Entry and exit actions

An **entry action** runs every time a state is entered, however it was entered; an **exit action** runs every time it is left, whichever way. Put an action there and it can never be forgotten.

Take an electric door lock. In UNLOCKED the bolt is retracted. The door can leave UNLOCKED in two ways: the person opens and closes the door (DOOR_CLOSED), or eight seconds pass with no one opening it (a timeout). If *bolt out* is written on each of those two arrows, someone will add a third way out one day and forget it — and the door stays unlocked. Written once, as the **exit action** of UNLOCKED, the bolt goes back out however the state ends.

The rule of thumb: describe what a state *is* in its entry action ("UNLOCKED: bolt retracted"); put the clean-up in the exit action ("leaving UNLOCKED: bolt out"); put on the arrow only what belongs to that one event ("beep because the code was accepted"). In a transition the order is always *exit the old state, the action on the arrow, enter the new state*.

### Guards

A **guard** is a condition on a transition: it fires only if the event arrives *and* the condition is true. At the keypad, a wrong code is the event CODE_BAD; what happens depends on how many wrong tries there have been:

| In LOCKED, on CODE_BAD | Guard | Goes to |
|---|---|---|
| the third wrong try | tries = 2 so far | LOCKOUT (30 s) |
| otherwise | none | stay in LOCKED, count the try |

Guards are tried in order; the first that holds wins; the last is usually unguarded. If none holds, the event is ignored. A guard must only *ask*: with a side effect inside it, the machine's behaviour would depend on how often the guard is evaluated.

### Two traps

- **A transition to the same state is a real transition.** Leaving and re-entering LOCKED runs LOCKED's exit and entry actions again. If LOCKED's *entry* action resets the try counter, every wrong code resets it and the lockout never comes — the simulation has a switch that puts this bug in. For just counting, use an *internal* transition: an action without leaving the state.
- **Entry actions run once, so keep them short.** An entry that waits ten seconds has put a \`delay()\` back into the machine.

> [!warn] A lock must fail the way the building's safety rules demand: an exit door must always open from inside with no electronics in the way, and a lock that fails shut can trap people. Treat this as a model of the logic, not a design for a real lock.

> [!key] Put what a state is in its entry action and the clean-up in its exit action, so every road in and out has them. Use guards when one event can lead to several places, and remember that a transition to the same state re-runs entry and exit.`,
  ideas: [
    'An entry action runs on every way into a state, an exit action on every way out; put an action there and it cannot be forgotten.',
    'In a transition the order is: exit the old state, the action on the arrow, enter the new state.',
    'A guard is a condition on a transition; guards are tried in order, the first true one wins, and a guard must only ask, never change anything.',
    'A transition from a state to itself re-runs its exit and entry; an internal transition does only the action.'
  ],
  pitfalls: [
    'I can put the unlock action on every arrow that leads to UNLOCKED — Then a new arrow added later must remember it too. Written once as the entry action, it runs on every way in, including ways you have not drawn yet.',
    'A wrong code that goes from LOCKED to LOCKED does nothing else — It leaves and re-enters LOCKED, so the entry and exit actions run again. If they reset the try counter, the counter can never reach its limit.',
    'A guard can count the tries as it checks them — A guard that changes data makes the machine depend on how often it is asked. Guards ask; actions change.'
  ],
  terms: [
    { term: 'Entry action', also: ['on-entry', 'entry'], def: 'An action attached to a state that runs every time the state is entered, whichever transition led there. It describes what the state is.' },
    { term: 'Exit action', also: ['on-exit', 'exit'], def: 'An action attached to a state that runs every time the state is left, whichever transition leaves it. It is the place for clean-up, such as switching a motor off.' },
    { term: 'Guard', also: ['guard condition', 'condition'], def: 'A condition on a transition: the transition fires only when its event arrives and the guard is true. Several guarded transitions for one event are tried in order.' },
    { term: 'Internal transition', also: ['action without transition'], def: 'Handling an event by running an action while staying in the state, without leaving it: no exit or entry actions run and no timeout restarts.' }
  ],
  code: [
    {
      title: 'A door lock with a lockout',
      about: 'A code arrives from the serial monitor (type four digits and Enter); a keypad would deliver it the same way. A right code retracts the bolt for 8 s or until the door has been opened and closed; three wrong codes lock the keypad for 30 s.',
      needs: 'An ESP32 DevKit, a solenoid or a lamp for the bolt through a MOSFET module (with a flyback diode across a solenoid), a buzzer module, and a reed switch on the door.',
      wiring: [['GPIO4', 'reed switch → GND', 'internal pull-up; closed when the door is shut'], ['GPIO25', 'bolt driver (MOSFET gate)'], ['GPIO26', 'buzzer module']],
      blocks: `
        when started
          set pin (4) as [input with pull-up v]
          set pin (25) as [output v]
          set pin (26) as [output v]
          set [tries v] to (0)
          go to state [LOCKED v]

        when entering state [LOCKED v]
          print [LOCKED]

        when entering state [UNLOCKED v]
          set pin (25) to [HIGH v]            // bolt retracted

        when leaving state [UNLOCKED v]
          set pin (25) to [LOW v]             // bolt out, however we leave

        when entering state [LOCKOUT v]
          set pin (26) to [HIGH v]            // buzzer

        when leaving state [LOCKOUT v]
          set pin (26) to [LOW v]
          set [tries v] to (0)

        when a code is typed on the keypad (code)
          if <(code) = [4711]> then
            raise event [CODE_OK v]
          else
            raise event [CODE_BAD v]
          end

        when pin (4) goes [low v]             // the door has been closed
          raise event [DOOR_CLOSED v]

        when event [CODE_OK v] in state [LOCKED v]
          set [tries v] to (0)
          go to state [UNLOCKED v]

        when event [CODE_BAD v] in state [LOCKED v]
          if <(tries) ≥ (2)> then             // the guard: this is the third wrong try
            go to state [LOCKOUT v]
          else
            change [tries v] by (1)           // an internal transition: no leaving, no entering
          end

        when event [DOOR_CLOSED v] in state [UNLOCKED v]
          go to state [LOCKED v]

        when (8) seconds in state [UNLOCKED v]
          go to state [LOCKED v]

        when (30) seconds in state [LOCKOUT v]
          go to state [LOCKED v]
      `,
      cpp: String.raw`
        const int REED = 4;                           // closed (low) when the door is shut
        const int BOLT = 25;                          // high retracts the bolt
        const int BUZZER = 26;
        const char *SECRET = "4711";

        enum State { LOCKED, UNLOCKED, LOCKOUT };
        enum Event { CODE_OK, CODE_BAD, DOOR_CLOSED };
        State state = LOCKED;
        uint32_t enteredAt = 0;
        int tries = 0;                                // wrong codes so far
        bool doorWasShut = true;
        String entry = "";

        void onEntry(State s) {
          switch (s) {
            case LOCKED:   Serial.println("LOCKED"); break;
            case UNLOCKED: digitalWrite(BOLT, HIGH); break;      // bolt retracted
            case LOCKOUT:  digitalWrite(BUZZER, HIGH); break;
          }
        }

        void onExit(State s) {
          switch (s) {
            case UNLOCKED: digitalWrite(BOLT, LOW); break;       // bolt out, however we leave
            case LOCKOUT:  digitalWrite(BUZZER, LOW); tries = 0; break;
            default: break;
          }
        }

        void goTo(State next) {                       // exit the old state, then enter the new one
          onExit(state);
          state = next;
          enteredAt = millis();
          onEntry(state);
        }

        void handle(Event ev) {
          switch (state) {
            case LOCKED:
              if (ev == CODE_OK) { tries = 0; goTo(UNLOCKED); }
              else if (ev == CODE_BAD) {
                if (tries >= 2) goTo(LOCKOUT);        // the guard: the third wrong try
                else tries++;                         // internal transition: count, do not leave
              }
              break;
            case UNLOCKED:
              if (ev == DOOR_CLOSED) goTo(LOCKED);
              break;
            case LOCKOUT:
              break;                                  // the keypad is dead for 30 s
          }
        }

        void pollKeypad() {                           // stands in for a keypad: digits and Enter on the serial monitor
          while (Serial.available()) {
            char c = Serial.read();
            if (c == '\n' || c == '\r') {
              if (entry.length() > 0) handle(entry == SECRET ? CODE_OK : CODE_BAD);
              entry = "";
            } else {
              entry += c;
            }
          }
        }

        void setup() {
          Serial.begin(115200);
          pinMode(REED, INPUT_PULLUP);
          pinMode(BOLT, OUTPUT);
          pinMode(BUZZER, OUTPUT);
          onEntry(LOCKED);
        }

        void loop() {
          pollKeypad();
          bool shut = digitalRead(REED) == LOW;
          if (shut && !doorWasShut) handle(DOOR_CLOSED);       // the door has just been closed
          doorWasShut = shut;

          uint32_t inState = millis() - enteredAt;
          if (state == UNLOCKED && inState >= 8000) goTo(LOCKED);
          if (state == LOCKOUT && inState >= 30000) goTo(LOCKED);
        }
      `,
      py: String.raw`
        from machine import Pin
        import sys, select, time

        REED = Pin(4, Pin.IN, Pin.PULL_UP)            # closed (low) when the door is shut
        BOLT = Pin(25, Pin.OUT)                       # high retracts the bolt
        BUZZER = Pin(26, Pin.OUT)
        SECRET = "4711"

        LOCKED, UNLOCKED, LOCKOUT = 0, 1, 2
        state = LOCKED
        entered_at = time.ticks_ms()
        tries = 0                                     # wrong codes so far
        door_was_shut = True
        entry = ""

        poll = select.poll()
        poll.register(sys.stdin, select.POLLIN)

        def on_entry(s):
            if s == LOCKED:
                print("LOCKED")
            elif s == UNLOCKED:
                BOLT.value(1)                         # bolt retracted
            elif s == LOCKOUT:
                BUZZER.value(1)

        def on_exit(s):
            global tries
            if s == UNLOCKED:
                BOLT.value(0)                         # bolt out, however we leave
            elif s == LOCKOUT:
                BUZZER.value(0)
                tries = 0

        def go_to(new_state):                         # exit the old state, then enter the new one
            global state, entered_at
            on_exit(state)
            state = new_state
            entered_at = time.ticks_ms()
            on_entry(state)

        def handle(event):
            global tries
            if state == LOCKED:
                if event == "CODE_OK":
                    tries = 0
                    go_to(UNLOCKED)
                elif event == "CODE_BAD":
                    if tries >= 2:                    # the guard: the third wrong try
                        go_to(LOCKOUT)
                    else:
                        tries += 1                    # internal transition: count, do not leave
            elif state == UNLOCKED:
                if event == "DOOR_CLOSED":
                    go_to(LOCKED)
            # LOCKOUT: the keypad is dead for 30 s

        def poll_keypad():                            # stands in for a keypad: digits and Enter on the serial monitor
            global entry
            while poll.poll(0):
                c = sys.stdin.read(1)
                if c in ("\n", "\r"):
                    if entry:
                        handle("CODE_OK" if entry == SECRET else "CODE_BAD")
                    entry = ""
                else:
                    entry += c

        on_entry(LOCKED)
        while True:
            poll_keypad()
            shut = REED.value() == 0
            if shut and not door_was_shut:            # the door has just been closed
                handle("DOOR_CLOSED")
            door_was_shut = shut

            in_state = time.ticks_diff(time.ticks_ms(), entered_at)
            if state == UNLOCKED and in_state >= 8000:
                go_to(LOCKED)
            elif state == LOCKOUT and in_state >= 30000:
                go_to(LOCKED)
            time.sleep_ms(10)
      `,
      notes: ['A solenoid is an inductive load: it needs a flyback diode across its coil, or the spike when the MOSFET switches off can damage the pin ([[electronics:flyback-diode|flyback diodes]]).', 'Never keep the secret code in the program of a real lock: store it hashed and out of reach ([[credentials-handling]]).']
    }
  ],
  examples: [
    {
      title: 'The order of the actions',
      q: 'The door is UNLOCKED and DOOR_CLOSED arrives. In what order do the actions of this machine run?',
      steps: ['The exit action of UNLOCKED: the bolt goes out.', 'The action on the arrow: this arrow has none.', 'The entry action of LOCKED: the display shows LOCKED.'],
      a: 'Bolt out, then "LOCKED" on the display: exit of the old state, the arrow, entry of the new one. The same order holds if the timeout, rather than the door, ends UNLOCKED.'
    }
  ],
  quiz: [
    { q: 'The exit action of UNLOCKED pulls the bolt out. UNLOCKED ends by its 8 s timeout. Does the bolt go out?', choices: ['No: only the DOOR_CLOSED arrow has it', 'Yes: exit actions run however the state is left', 'Only if a guard is true', 'Only after LOCKED has been entered'], a: 1, why: 'An exit action belongs to the state, not to one arrow: it runs on every way out, which is its whole purpose.' },
    { q: 'LOCKED\'s entry action sets tries = 0, and a wrong code is a transition from LOCKED to LOCKED. What goes wrong?', choices: ['Nothing', 'Every wrong code resets the counter, so the lockout can never happen', 'The door unlocks', 'The machine stops'], a: 1, why: 'A transition to the same state re-runs the exit and entry actions. The reset in the entry action wipes the count each time. Use an internal transition for counting, and reset elsewhere.' },
    { q: 'A guard may change a variable, such as counting a try, as long as it returns true or false.', a: false, why: 'If a guard has side effects, the machine behaves differently depending on how many times, and in what order, guards are evaluated. Guards only ask; actions change data.' },
    { q: 'Three transitions leave LOCKED on CODE_BAD: guard A, guard B, and one with no guard. A and B are both true. Which fires?', choices: ['The unguarded one', 'A, the first whose guard holds', 'Both A and B', 'None: ambiguity is an error'], a: 1, why: 'Guards are tried in order and the first true one wins, which is why the unguarded "otherwise" transition is written last.' }
  ],
  applications: [
    'Door locks, safes and access controllers, with their try counters and lockouts.',
    'Motor controllers: "motor off" as the exit action of every moving state.',
    'Menus and wizards on small displays: entry draws the screen, exit saves the setting.',
    'Safety interlocks, where the exit action of a running state guarantees that the output is switched off.'
  ],
  sources: [
    'Object Management Group, *Unified Modeling Language* specification: entry and exit behaviours, guard conditions, internal and external transitions.',
    'David Harel, "Statecharts: a visual formalism for complex systems", Science of Computer Programming 8 (1987).',
    'Miro Samek, *Practical UML Statecharts in C/C++* (2nd edition, 2008): entry and exit actions in embedded code.'
  ],
  sim: 'sm-door-lock'
},

/* ================================================================ events in a queue */
{
  id: 'event-queues',
  parent: 'state-machines',
  title: 'Events in a queue',
  level: 2,
  short: 'Events can arrive faster than a machine handles them. A small ring buffer, or the operating system\'s queue, lets producers add events and move on while the machine takes them in order.',
  keywords: ['event queue', 'ring buffer', 'circular buffer', 'FreeRTOS queue', 'xQueueSendFromISR', 'deferred events', 'overflow', 'producer', 'consumer', 'greenhouse vent', 'interrupt', 'burst', 'drop or defer'],
  prereq: ['state-machine-in-code', 'timeouts-and-timed-states'],
  related: ['queues', 'interrupts', 'from-interrupt-to-task', 'race-conditions', 'several-machines-together', 'asyncio-in-micropython'],
  body: `So far an event has been handled at the instant it was noticed: the loop sees the button go down and calls the machine. That works while the machine is quick and events are rare. It stops working when events come in a burst, or while the machine is busy — a motor moving, a flash write in progress, a network call that takes half a second. An event that arrives *during* that time has nowhere to go and is lost, or handled late and out of order.

The cure is the oldest in computing: a **queue**. Whatever notices an event — a button routine, a timer, a network callback — puts it in the queue and carries on. The machine takes events out one at a time, in the order they came, when it is ready. Producers and machine no longer need to run at the same speed.

### The example: a greenhouse vent

A motor opens or closes a vent in two seconds. The machine has four states — CLOSED, OPENING, OPEN, CLOSING — and two commands, OPEN_CMD and CLOSE_CMD, that arrive from several sources: buttons, a temperature rule, a rain sensor. While the motor turns, only the clock matters; a command that arrives then must be remembered, or the rain sensor's "close!" is lost just when it matters.

### A ring buffer

On a microcontroller the queue is usually a **ring buffer**: a small array and two counters, \`head\` (where the next event is read) and \`tail\` (where the next is written). Both wrap round at the end of the array, so nothing is allocated and nothing moves. If \`head == tail\` it is empty; if advancing \`tail\` would reach \`head\` it is full, so a buffer of eight holds seven. The size is a decision: at least the longest burst you must absorb. A full queue forces a choice — drop the new event or the oldest — and a good program counts the drops so the problem is visible.

### What about events a state cannot use?

A CLOSE_CMD that arrives while the vent is OPENING is not listed in OPENING. Two policies make sense:

- **Drop it**, as every machine so far did. Simple, and right for events that matter only *now*: a button press, a sensor edge.
- **Defer it**: leave it in the queue until the machine has settled. Right for commands; wrong for old news, since a "close" held for an hour is a surprise.

The simulation lets you choose, and shows the queue filling and emptying.

### Interrupts and tasks

An interrupt handler must be short ([[interrupts]]); it should do nothing but put an event in the queue. A plain ring buffer is safe only when every producer runs in the main loop. With an interrupt or a second task, use a critical section or the operating system's own queue ([[queues]]), which is built for this and can wake a task when something arrives ([[from-interrupt-to-task]]). The second program shows it.

> [!key] A queue lets events arrive faster than the machine handles them: producers add and move on, the machine takes events in order when ready. Decide the size, what happens when it is full, and whether an event the state cannot use is dropped or deferred.`,
  ideas: [
    'A queue decouples the code that notices events from the machine that handles them, so a burst or a busy machine does not lose events.',
    'A ring buffer is an array with a read counter and a write counter that wrap round; one slot stays free so that "full" and "empty" can be told apart.',
    'A full queue must be a decision — drop the newest or the oldest — and the drops should be counted.',
    'An event the current state cannot use is either dropped or deferred; commands are usually deferred, news about the present is dropped.'
  ],
  pitfalls: [
    'A bigger queue always makes the program safer — A queue that is too large hides a machine that cannot keep up, and delays commands so much that they are stale when handled. Size it for the longest burst, and count the overflows.',
    'The interrupt can simply call the state machine — The handler must be short and must not call code that waits, prints or takes locks. It should only post an event; the machine runs later, in the loop or in a task.',
    'A plain ring buffer is safe from any code — Only when producers and consumer cannot interrupt one another in the middle of an update. With an interrupt or a second task, use a critical section or a real queue.'
  ],
  terms: [
    { term: 'Event queue', also: ['message queue', 'FIFO'], def: 'A first-in, first-out store of events: producers append events as they happen, and the machine takes them from the front when it is ready to handle them.' },
    { term: 'Ring buffer', also: ['circular buffer', 'FIFO buffer'], def: 'A fixed array used as a queue with a read index and a write index that both wrap round at the end. No memory is allocated and nothing is moved when events are added or removed.' },
    { term: 'Producer and consumer', also: ['sender and receiver'], def: 'The code that puts events into a queue and the code that takes them out. They may run at different speeds, in different tasks, or in an interrupt and the main loop.' },
    { term: 'Deferred event', also: ['deferral', 'postponed event'], def: 'An event that the current state cannot use and that is therefore kept in the queue until a state that can use it has been reached, instead of being dropped.' },
    { term: 'Overflow', also: ['queue full', 'dropped event'], def: 'What happens when an event arrives and the queue has no free slot: the event, or the oldest one, is lost. A careful program counts the losses.' }
  ],
  code: [
    {
      title: 'A greenhouse vent with a ring-buffer queue',
      about: 'Two buttons post OPEN_CMD and CLOSE_CMD into a ring buffer of eight slots. The machine takes the oldest command only when the motor is not turning, so a command given mid-move waits and is carried out afterwards.',
      needs: 'An ESP32 DevKit, two push buttons, and a vent motor behind a two-channel driver (one input to open, one to close).',
      wiring: [['GPIO4', 'open button → GND', 'internal pull-up'], ['GPIO18', 'close button → GND', 'internal pull-up'], ['GPIO25', 'motor driver: open'], ['GPIO26', 'motor driver: close']],
      blocks: `
        when started
          set pin (4) as [input with pull-up v]
          set pin (18) as [input with pull-up v]
          set pin (25) as [output v]
          set pin (26) as [output v]
          go to state [CLOSED v]
          forever
            if <<state = [CLOSED v]> or <state = [OPEN v]>> then    // settled: the motor is not turning
              set [event v] to (receive from queue [events v])
              if <(event) ≠ [none]> then
                raise event (event)
              end
            end
          end

        when pin (4) goes [low v]
          send [OPEN_CMD] to queue [events v]

        when pin (18) goes [low v]
          send [CLOSE_CMD] to queue [events v]

        when entering state [OPENING v]
          set pin (25) to [HIGH v]

        when leaving state [OPENING v]
          set pin (25) to [LOW v]

        when entering state [CLOSING v]
          set pin (26) to [HIGH v]

        when leaving state [CLOSING v]
          set pin (26) to [LOW v]

        when event [OPEN_CMD v] in state [CLOSED v]
          go to state [OPENING v]

        when event [CLOSE_CMD v] in state [OPEN v]
          go to state [CLOSING v]

        when (2) seconds in state [OPENING v]
          go to state [OPEN v]

        when (2) seconds in state [CLOSING v]
          go to state [CLOSED v]
      `,
      cpp: String.raw`
        const int BTN_OPEN = 4, BTN_CLOSE = 18;
        const int MOTOR_OPEN = 25, MOTOR_CLOSE = 26;
        const uint32_t TRAVEL_MS = 2000;

        enum State { CLOSED, OPENING, OPEN, CLOSING };
        enum Event { OPEN_CMD, CLOSE_CMD };
        State state = CLOSED;
        uint32_t enteredAt = 0;

        // the queue: a ring buffer that holds up to 7 events (one slot stays free to tell full from empty)
        const int Q_SIZE = 8;
        Event q[Q_SIZE];
        int qHead = 0, qTail = 0, qDropped = 0;

        bool qEmpty() { return qHead == qTail; }

        bool qPush(Event ev) {
          int next = (qTail + 1) % Q_SIZE;
          if (next == qHead) { qDropped++; return false; }    // full: count the loss
          q[qTail] = ev;
          qTail = next;
          return true;
        }

        Event qPop() {
          Event ev = q[qHead];
          qHead = (qHead + 1) % Q_SIZE;
          return ev;
        }

        void goTo(State next) {
          state = next;
          enteredAt = millis();
          digitalWrite(MOTOR_OPEN, state == OPENING);         // entry actions: the motor follows the state
          digitalWrite(MOTOR_CLOSE, state == CLOSING);
        }

        void handle(Event ev) {
          if (state == CLOSED && ev == OPEN_CMD) goTo(OPENING);
          else if (state == OPEN && ev == CLOSE_CMD) goTo(CLOSING);
          // any other pair is ignored: the vent is already where the command wants it
        }

        bool pressedNow(int pin, bool &wasDown) {             // true once, as the button goes down
          bool down = digitalRead(pin) == LOW;
          bool edge = down && !wasDown;
          wasDown = down;
          return edge;
        }

        void setup() {
          pinMode(BTN_OPEN, INPUT_PULLUP);
          pinMode(BTN_CLOSE, INPUT_PULLUP);
          pinMode(MOTOR_OPEN, OUTPUT);
          pinMode(MOTOR_CLOSE, OUTPUT);
          goTo(CLOSED);
        }

        void loop() {
          // producers: whatever notices an event puts it in the queue and moves on
          static bool openWasDown = false, closeWasDown = false;
          if (pressedNow(BTN_OPEN, openWasDown)) qPush(OPEN_CMD);
          if (pressedNow(BTN_CLOSE, closeWasDown)) qPush(CLOSE_CMD);   // a rain sensor would do the same

          // the machine: while the motor turns, events wait in the queue
          bool settled = (state == CLOSED || state == OPEN);
          if (settled && !qEmpty()) handle(qPop());

          uint32_t inState = millis() - enteredAt;
          if (state == OPENING && inState >= TRAVEL_MS) goTo(OPEN);
          if (state == CLOSING && inState >= TRAVEL_MS) goTo(CLOSED);
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        BTN_OPEN = Pin(4, Pin.IN, Pin.PULL_UP)
        BTN_CLOSE = Pin(18, Pin.IN, Pin.PULL_UP)
        MOTOR_OPEN = Pin(25, Pin.OUT)
        MOTOR_CLOSE = Pin(26, Pin.OUT)
        TRAVEL_MS = 2000

        CLOSED, OPENING, OPEN, CLOSING = 0, 1, 2, 3
        state = CLOSED
        entered_at = time.ticks_ms()

        # the queue: a ring buffer that holds up to 7 events (one slot stays free to tell full from empty)
        Q_SIZE = 8
        q = [None] * Q_SIZE
        q_head = 0
        q_tail = 0
        q_dropped = 0

        def q_empty():
            return q_head == q_tail

        def q_push(event):
            global q_tail, q_dropped
            nxt = (q_tail + 1) % Q_SIZE
            if nxt == q_head:                         # full: count the loss
                q_dropped += 1
                return False
            q[q_tail] = event
            q_tail = nxt
            return True

        def q_pop():
            global q_head
            event = q[q_head]
            q_head = (q_head + 1) % Q_SIZE
            return event

        def go_to(new_state):
            global state, entered_at
            state = new_state
            entered_at = time.ticks_ms()
            MOTOR_OPEN.value(1 if state == OPENING else 0)    # entry actions: the motor follows the state
            MOTOR_CLOSE.value(1 if state == CLOSING else 0)

        def handle(event):
            if state == CLOSED and event == "OPEN_CMD":
                go_to(OPENING)
            elif state == OPEN and event == "CLOSE_CMD":
                go_to(CLOSING)
            # any other pair is ignored: the vent is already where the command wants it

        go_to(CLOSED)
        open_was_down = False
        close_was_down = False
        while True:
            # producers: whatever notices an event puts it in the queue and moves on
            open_down = BTN_OPEN.value() == 0
            if open_down and not open_was_down:
                q_push("OPEN_CMD")
            open_was_down = open_down
            close_down = BTN_CLOSE.value() == 0
            if close_down and not close_was_down:     # a rain sensor would do the same
                q_push("CLOSE_CMD")
            close_was_down = close_down

            # the machine: while the motor turns, events wait in the queue
            settled = state == CLOSED or state == OPEN
            if settled and not q_empty():
                handle(q_pop())

            in_state = time.ticks_diff(time.ticks_ms(), entered_at)
            if state == OPENING and in_state >= TRAVEL_MS:
                go_to(OPEN)
            elif state == CLOSING and in_state >= TRAVEL_MS:
                go_to(CLOSED)
            time.sleep_ms(5)
      `,
      notes: ['Here every producer runs in the loop, so the ring buffer needs no protection. Events posted from an interrupt handler or a second task need the operating-system queue of the next program, or, in MicroPython, `machine.disable_irq()` around each push and pop.']
    },
    {
      title: 'The same vent with a FreeRTOS queue and interrupts',
      about: 'The buttons now raise interrupts that post into the operating system\'s queue. The queue is safe to use from an interrupt and from the loop task without any extra locking.',
      needs: 'The same board and wiring.',
      wiring: [['GPIO4', 'open button → GND', 'internal pull-up'], ['GPIO18', 'close button → GND', 'internal pull-up'], ['GPIO25', 'motor driver: open'], ['GPIO26', 'motor driver: close']],
      na: {
        blocks: 'The block notation does not distinguish a ring buffer from an operating-system queue: the blocks of the first program are the same here.',
        py: 'MicroPython does not expose FreeRTOS queues to programs. Use the ring buffer of the first program (with `machine.disable_irq()` around push and pop when an interrupt handler posts), or `asyncio` ([[asyncio-in-micropython]]).'
      },
      cpp: String.raw`
        const int BTN_OPEN = 4, BTN_CLOSE = 18;
        const int MOTOR_OPEN = 25, MOTOR_CLOSE = 26;
        const uint32_t TRAVEL_MS = 2000;

        enum State { CLOSED, OPENING, OPEN, CLOSING };
        enum Event : uint8_t { OPEN_CMD, CLOSE_CMD };

        QueueHandle_t eventQueue;                     // the operating system's queue: safe from interrupts and tasks
        State state = CLOSED;
        uint32_t enteredAt = 0;

        void IRAM_ATTR queueEvent(Event ev) {         // called from the interrupt handlers: queue the event and leave at once
          static volatile uint32_t last = 0;
          uint32_t now = millis();
          if (now - last < 50) return;                // crude debounce: ignore contact bounce
          last = now;
          BaseType_t woken = pdFALSE;
          xQueueSendFromISR(eventQueue, &ev, &woken);
          if (woken) portYIELD_FROM_ISR();
        }
        void IRAM_ATTR onOpenButton()  { queueEvent(OPEN_CMD); }
        void IRAM_ATTR onCloseButton() { queueEvent(CLOSE_CMD); }

        void goTo(State next) {
          state = next;
          enteredAt = millis();
          digitalWrite(MOTOR_OPEN, state == OPENING);
          digitalWrite(MOTOR_CLOSE, state == CLOSING);
        }

        void handle(Event ev) {
          if (state == CLOSED && ev == OPEN_CMD) goTo(OPENING);
          else if (state == OPEN && ev == CLOSE_CMD) goTo(CLOSING);
        }

        void setup() {
          pinMode(BTN_OPEN, INPUT_PULLUP);
          pinMode(BTN_CLOSE, INPUT_PULLUP);
          pinMode(MOTOR_OPEN, OUTPUT);
          pinMode(MOTOR_CLOSE, OUTPUT);
          eventQueue = xQueueCreate(8, sizeof(Event));
          attachInterrupt(BTN_OPEN, onOpenButton, FALLING);
          attachInterrupt(BTN_CLOSE, onCloseButton, FALLING);
          goTo(CLOSED);
        }

        void loop() {
          bool settled = (state == CLOSED || state == OPEN);
          Event ev;
          if (settled && xQueueReceive(eventQueue, &ev, 0) == pdTRUE) handle(ev);   // 0 ticks: do not wait

          uint32_t inState = millis() - enteredAt;
          if (state == OPENING && inState >= TRAVEL_MS) goTo(OPEN);
          if (state == CLOSING && inState >= TRAVEL_MS) goTo(CLOSED);
        }
      `,
      notes: ['The interrupt handler only posts an event and returns; the state machine runs in the loop task, which may be busy for a while without losing a press.', 'Contact bounce can fill a small queue with echoes of one press: debounce in the handler by time, as here, or in hardware ([[debouncing]]).']
    }
  ],
  examples: [
    {
      title: 'Sizing the queue',
      q: 'A vent move takes 2 s. In that time a user can press a button at most about four times, and the rain sensor and the temperature rule each post one command. How many slots does the ring buffer need?',
      steps: ['The worst burst is 4 + 1 + 1 = 6 events.', 'A ring buffer keeps one slot free, so it needs 6 + 1 = 7 slots.', 'Round up to a convenient size: 8, whose modulo is a cheap operation.'],
      a: 'Eight slots, which hold seven events. Count the drops in the field; if the counter ever moves, the size or the machine\'s speed was wrong.'
    }
  ],
  quiz: [
    { q: 'A ring buffer of 8 slots keeps one slot free to tell full from empty. How many events can it hold?', choices: ['8', '7', '9', '16'], a: 1, why: 'If head equals tail the buffer is empty, so the tail may never catch up with the head: at most seven of eight slots hold events.' },
    { q: 'Why should an interrupt handler only put an event in a queue instead of running the machine?', choices: ['Machines are too slow to run at all', 'The handler must be short and must not call code that waits, prints or takes locks; the machine can run later in the loop', 'Queues are faster than function calls', 'The machine needs the serial port'], a: 1, why: 'An interrupt must return quickly and may only call a few special functions. Posting an event is one of them, so the real work is moved to normal code.' },
    { q: 'Deferring every event the current state cannot use is always better than dropping it.', a: false, why: 'A deferred command can be stale when it is finally handled, and an unusable event at the head of the queue blocks those behind it. Defer commands; drop news about the present.' },
    { q: 'The vent is CLOSING when OPEN_CMD arrives. With the "wait while the motor turns" policy of the program, what happens?', choices: ['It is ignored', 'It waits in the queue and opens the vent once CLOSED is reached', 'The motor reverses at once', 'The queue is cleared'], a: 1, why: 'While the state is OPENING or CLOSING the machine takes nothing from the queue. When CLOSED is reached it takes OPEN_CMD, which CLOSED handles by going to OPENING.' }
  ],
  applications: [
    'Motor-driven things — vents, blinds, valves, gates — whose commands arrive while a move is still in progress.',
    'Button and serial-command handling in firmware that also logs, updates a display and talks to the network.',
    'Sensor drivers that post an event from an interrupt and let a task do the slow reading.',
    'Network callbacks, where the Wi-Fi or MQTT library calls your function from its own task and you post an event rather than doing the work there.'
  ],
  sources: [
    'FreeRTOS documentation, queue management: `xQueueCreate`, `xQueueSendFromISR`, `xQueueReceive`.',
    'Espressif, *ESP-IDF Programming Guide*, the FreeRTOS (IDF) chapter and the interrupt-handling notes in the GPIO reference.',
    'Arduino core for ESP32 documentation, `attachInterrupt`; MicroPython documentation, `machine.disable_irq` and the notes on writing interrupt handlers.'
  ],
  sim: 'sm-event-queue'
},

/* ================================================================ states within states */
{
  id: 'hierarchical-states',
  parent: 'state-machines',
  title: 'States within states',
  level: 3,
  short: 'A parent state holds the rules its substates share, so one arrow from the box replaces one arrow from every state: "fault from anywhere" is drawn, and coded, once.',
  keywords: ['hierarchical state machine', 'statechart', 'parent state', 'superstate', 'substate', 'composite state', 'shared transition', 'fault from anywhere', 'garage door', 'Harel', 'HSM'],
  prereq: ['entry-exit-and-guards', 'drawing-a-state-diagram'],
  related: ['error-states-and-recovery', 'connection-manager-machine', 'several-machines-together', 'project-garage-door', 'limit-switches-and-homing'],
  body: `A flat machine has a problem that appears as soon as something can happen *anywhere*. A garage door has four working states — CLOSED, OPENING, OPEN and CLOSING — and one event that must stop everything in any of them: a motor fault, say an overcurrent. Draw that flat and four identical arrows run into FAULT, one from each state. Add a fifth working state next month and someone must remember a fifth arrow; forget it, and that state ignores the fault.

### A parent state

The remedy is to draw a box round the four working states and call it NORMAL. NORMAL is a **parent state** (also *superstate*); CLOSED and the others are its **substates**. One rule covers the family: *when the substate does not handle an event, the parent gets to.* One arrow from the NORMAL box to FAULT replaces the four. The machine is still in exactly one substate, such as OPENING, but it is also, automatically, in NORMAL.

This is the core of David Harel's *statecharts*, the notation behind UML state machines. The rest of it — parallel regions, history — can wait; a parent with shared transitions is what a beginner needs.

### How to write it

No library is needed. The parent's rules come **first** in the code:

~~~cpp
void handle(Event ev) {
  if (ev == MOTOR_FAULT && state != FAULT) { goTo(FAULT); return; }   // the parent's rule
  switch (state) { /* … then the substates' rules … */ }
}
~~~

A substate that wants its own answer to the event handles it before the parent's rule. In a table the parent's rows are searched last; with a function per state, a state that does not recognise an event passes it up to its parent's function.

Entry and exit follow the nesting. Leaving a moving substate for FAULT runs that substate's exit action, so "motor off" written once as the exit of OPENING and of CLOSING is never forgotten.

### Other uses

"Stop" from anywhere in a machine with many modes; "go to sleep after a minute in any menu screen"; "error" in the connection manager ([[connection-manager-machine]]). Whenever you catch yourself drawing the same arrow from every state, draw a box instead.

> [!warn] A motorised door can crush. Real openers have force limiting, safety edges and light barriers certified to the relevant standards (in Europe EN 12453 and EN 12445), and travel-time supervision that this small model leaves out to keep the picture clear. Learn from the logic; do not fit it to a real door ([[project-garage-door]]).

> [!key] A parent state holds the rules its substates share: one arrow from the box replaces one arrow from each state. In code, test the parent's rules first, then the substate's.`,
  ideas: [
    'A parent state groups substates and holds the transitions they share; one arrow from the box replaces an arrow from every substate.',
    'The machine is in exactly one substate and, automatically, in all its parents.',
    'An event goes to the substate first; if the substate does not handle it, the parent does.',
    'Without a library: test the parent\'s rules at the top of the handler, then switch on the substate.'
  ],
  pitfalls: [
    'A hierarchy means the machine can be in two states at once — It is in exactly one substate; it is "inside" the parent only in the sense that the parent\'s rules also apply. Parallel machines are a different thing ([[several-machines-together]]).',
    'The shared rule can go at the end of the handler — A rule placed after the switch never runs for events the switch handles, and one placed inside one case covers only that state. The parent\'s rules must come first.',
    'Hierarchy is needed for every machine — A flat machine with a few states is clearer. Use a parent when the same arrow would otherwise leave three or more states.'
  ],
  terms: [
    { term: 'Hierarchical state machine', also: ['HSM', 'statechart', 'nested state machine'], def: 'A state machine whose states can contain other states. Events not handled by a substate pass to its parent, so shared rules are written once.' },
    { term: 'Parent state', also: ['superstate', 'composite state'], def: 'A state that contains substates and holds the transitions they share. The machine is always in one of its substates and, through it, in the parent.' },
    { term: 'Substate', also: ['child state', 'nested state'], def: 'A state inside a parent state. It handles events itself and passes on those it does not handle to its parent.' }
  ],
  choose: {
    good: ['"Fault" or "stop" that must work from every working state', 'A shared timeout, such as returning to a home screen after a minute in any menu', 'A machine whose diagram has the same arrow leaving three or more states'],
    avoid: ['A machine of three states, where a box adds more to the drawing than it saves', 'Parallel activities that really are separate machines', 'Deep nesting: more than two levels is hard to follow'],
    check: ['Which arrows leave every state of the group?', 'Does any substate need to answer the shared event differently?', 'What do the exit actions of the substates do on the way out?']
  },
  code: [
    {
      title: 'A garage door with a shared fault rule',
      about: 'Four working states and one FAULT. The motor-fault input stops the door from anywhere; the obstacle input reverses a closing door. The fault rule is written once, before the switch.',
      needs: 'An ESP32 DevKit, two limit switches, a light barrier, an overcurrent signal from the motor driver, a remote button, a reset button and a two-direction motor driver (use LEDs to try it).',
      wiring: [['GPIO4', 'remote button → GND', 'internal pull-up'], ['GPIO18', 'top limit switch → GND'], ['GPIO19', 'bottom limit switch → GND'], ['GPIO21', 'light barrier, low when the beam is broken'], ['GPIO22', 'motor overcurrent signal, low on fault'], ['GPIO23', 'reset button → GND'], ['GPIO25', 'motor driver: up'], ['GPIO26', 'motor driver: down']],
      blocks: `
        when started
          set pin (4) as [input with pull-up v]
          set pin (18) as [input with pull-up v]
          set pin (19) as [input with pull-up v]
          set pin (21) as [input with pull-up v]
          set pin (22) as [input with pull-up v]
          set pin (23) as [input with pull-up v]
          set pin (25) as [output v]
          set pin (26) as [output v]
          go to state [CLOSED v]

        when entering state [OPENING v]
          set pin (25) to [HIGH v]

        when leaving state [OPENING v]
          set pin (25) to [LOW v]

        when entering state [CLOSING v]
          set pin (26) to [HIGH v]

        when leaving state [CLOSING v]
          set pin (26) to [LOW v]

        when entering state [FAULT v]
          print [FAULT: motor off, waiting for a reset]

        when pin (4) goes [low v]
          raise event [REMOTE v]

        when pin (18) goes [low v]
          raise event [TOP_REACHED v]

        when pin (19) goes [low v]
          raise event [BOTTOM_REACHED v]

        when pin (21) goes [low v]
          raise event [OBSTACLE v]

        when pin (22) goes [low v]
          raise event [MOTOR_FAULT v]

        when pin (23) goes [low v]
          raise event [FAULT_RESET v]

        when event [MOTOR_FAULT v] in any state of [NORMAL v]    // the parent's rule, written once
          go to state [FAULT v]

        when event [REMOTE v] in state [CLOSED v]
          go to state [OPENING v]

        when event [TOP_REACHED v] in state [OPENING v]
          go to state [OPEN v]

        when event [REMOTE v] in state [OPEN v]
          go to state [CLOSING v]

        when event [BOTTOM_REACHED v] in state [CLOSING v]
          go to state [CLOSED v]

        when event [OBSTACLE v] in state [CLOSING v]
          go to state [OPENING v]                                // reverse at once

        when event [FAULT_RESET v] in state [FAULT v]
          go to state [CLOSED v]                                 // after the door was checked and closed by hand
      `,
      cpp: String.raw`
        const int PIN_REMOTE = 4, PIN_TOP = 18, PIN_BOTTOM = 19;
        const int PIN_BARRIER = 21, PIN_OVERCURRENT = 22, PIN_RESET = 23;
        const int MOTOR_UP = 25, MOTOR_DOWN = 26;

        enum State { CLOSED, OPENING, OPEN, CLOSING, FAULT };    // the first four are the substates of NORMAL
        enum Event { REMOTE, TOP_REACHED, BOTTOM_REACHED, OBSTACLE, MOTOR_FAULT, FAULT_RESET };

        struct Input { int pin; Event ev; bool wasLow; };
        Input inputs[] = {
          { PIN_REMOTE, REMOTE, false },
          { PIN_TOP, TOP_REACHED, false },
          { PIN_BOTTOM, BOTTOM_REACHED, false },
          { PIN_BARRIER, OBSTACLE, false },
          { PIN_OVERCURRENT, MOTOR_FAULT, false },
          { PIN_RESET, FAULT_RESET, false },
        };
        State state = CLOSED;

        void goTo(State next) {
          digitalWrite(MOTOR_UP, LOW);                           // the exit action of every moving state: motor off
          digitalWrite(MOTOR_DOWN, LOW);
          state = next;
          if (state == OPENING) digitalWrite(MOTOR_UP, HIGH);    // entry actions
          if (state == CLOSING) digitalWrite(MOTOR_DOWN, HIGH);
          if (state == FAULT) Serial.println("FAULT: motor off, waiting for a reset");
        }

        void handle(Event ev) {
          if (ev == MOTOR_FAULT && state != FAULT) { goTo(FAULT); return; }   // the parent's rule, for every substate

          switch (state) {
            case CLOSED:
              if (ev == REMOTE) goTo(OPENING);
              break;
            case OPENING:
              if (ev == TOP_REACHED) goTo(OPEN);                 // REMOTE is ignored while the door moves
              break;
            case OPEN:
              if (ev == REMOTE) goTo(CLOSING);
              break;
            case CLOSING:
              if (ev == BOTTOM_REACHED) goTo(CLOSED);
              else if (ev == OBSTACLE) goTo(OPENING);            // reverse at once
              break;
            case FAULT:
              if (ev == FAULT_RESET) goTo(CLOSED);               // after the door was checked and closed by hand
              break;
          }
        }

        void setup() {
          Serial.begin(115200);
          for (Input &in : inputs) pinMode(in.pin, INPUT_PULLUP);
          pinMode(MOTOR_UP, OUTPUT);
          pinMode(MOTOR_DOWN, OUTPUT);
          goTo(CLOSED);
        }

        void loop() {
          for (Input &in : inputs) {                             // an event whenever an input goes low
            bool low = digitalRead(in.pin) == LOW;
            if (low && !in.wasLow) handle(in.ev);
            in.wasLow = low;
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        REMOTE = Pin(4, Pin.IN, Pin.PULL_UP)
        TOP = Pin(18, Pin.IN, Pin.PULL_UP)
        BOTTOM = Pin(19, Pin.IN, Pin.PULL_UP)
        BARRIER = Pin(21, Pin.IN, Pin.PULL_UP)
        OVERCURRENT = Pin(22, Pin.IN, Pin.PULL_UP)
        RESET = Pin(23, Pin.IN, Pin.PULL_UP)
        MOTOR_UP = Pin(25, Pin.OUT)
        MOTOR_DOWN = Pin(26, Pin.OUT)

        CLOSED, OPENING, OPEN, CLOSING, FAULT = 0, 1, 2, 3, 4    # the first four are the substates of NORMAL
        state = CLOSED

        inputs = [                                               # [pin, event, was it low?]
            [REMOTE, "REMOTE", False],
            [TOP, "TOP_REACHED", False],
            [BOTTOM, "BOTTOM_REACHED", False],
            [BARRIER, "OBSTACLE", False],
            [OVERCURRENT, "MOTOR_FAULT", False],
            [RESET, "FAULT_RESET", False],
        ]

        def go_to(new_state):
            global state
            MOTOR_UP.value(0)                                    # the exit action of every moving state: motor off
            MOTOR_DOWN.value(0)
            state = new_state
            if state == OPENING:                                 # entry actions
                MOTOR_UP.value(1)
            elif state == CLOSING:
                MOTOR_DOWN.value(1)
            elif state == FAULT:
                print("FAULT: motor off, waiting for a reset")

        def handle(event):
            if event == "MOTOR_FAULT" and state != FAULT:        # the parent's rule, for every substate
                go_to(FAULT)
                return

            if state == CLOSED:
                if event == "REMOTE":
                    go_to(OPENING)
            elif state == OPENING:
                if event == "TOP_REACHED":                       # REMOTE is ignored while the door moves
                    go_to(OPEN)
            elif state == OPEN:
                if event == "REMOTE":
                    go_to(CLOSING)
            elif state == CLOSING:
                if event == "BOTTOM_REACHED":
                    go_to(CLOSED)
                elif event == "OBSTACLE":                        # reverse at once
                    go_to(OPENING)
            elif state == FAULT:
                if event == "FAULT_RESET":                       # after the door was checked and closed by hand
                    go_to(CLOSED)

        go_to(CLOSED)
        while True:
            for item in inputs:                                  # an event whenever an input goes low
                low = item[0].value() == 0
                if low and not item[2]:
                    handle(item[1])
                item[2] = low
            time.sleep_ms(5)
      `,
      notes: ['The reset assumes the door was closed by hand. A real controller reads the limit switches and decides where the door is before it moves again.', 'The start state is assumed too: a real opener reads the limit switches at power-up to choose between CLOSED, OPEN and "somewhere between".']
    }
  ],
  quiz: [
    { q: 'A garage door has four substates inside NORMAL, and each must react to MOTOR_FAULT. How many arrows do the flat and the hierarchical diagram need for that rule?', choices: ['Four and one', 'One and four', 'Four and four', 'One and one'], a: 0, why: 'The flat diagram draws one arrow from every state. The hierarchical one draws a single arrow from the NORMAL box, which stands for all four.' },
    { q: 'In the code of this page, why is the check for MOTOR_FAULT written before the switch?', choices: ['It runs faster', 'The parent\'s rule applies to every substate, so it must be tested before a substate gets its turn', 'switch cannot handle FAULT', 'The order never matters'], a: 1, why: 'Put after the switch, the rule would be reached only by events the substates leave alone, and one inside a case covers only that state. The parent\'s rules come first.' },
    { q: 'In a hierarchical machine the device can be in two substates at the same time.', a: false, why: 'It is in exactly one substate (OPENING, say). It is also inside the parent, in the sense that the parent\'s rules apply too; but that is one situation, not two.' },
    { q: 'The door is CLOSING and OBSTACLE arrives. Which rule applies?', choices: ['The parent\'s: NORMAL to FAULT', 'CLOSING\'s own: go to OPENING', 'CLOSED\'s', 'None: the event is ignored'], a: 1, why: 'The substate handles the event first, and CLOSING lists OBSTACLE. The parent hears only about events that its substates do not handle.' }
  ],
  applications: [
    'Machine controllers with "emergency stop" or "fault" that must work in every mode.',
    'Gates, shutters, lifts and doors, where a safety event interrupts any movement.',
    'Menu systems on small displays: "back to the home screen after a minute" shared by all screens.',
    'Connection managers, where "link lost" is the same rule for every connected substate.'
  ],
  sources: [
    'David Harel, "Statecharts: a visual formalism for complex systems", Science of Computer Programming 8 (1987): nested states and shared transitions.',
    'Object Management Group, *Unified Modeling Language* specification: composite states and transition resolution.',
    'Miro Samek, *Practical UML Statecharts in C/C++* (2nd edition, 2008): hierarchical state machines in embedded code.'
  ],
  sim: 'sm-hierarchy'
},

/* ================================================================ several machines together */
{
  id: 'several-machines-together',
  parent: 'state-machines',
  title: 'Several machines working together',
  level: 3,
  short: 'Instead of one huge machine, build a few small ones that exchange events. Their states add up where a single machine\'s would multiply, and each can be drawn, tested and replaced on its own.',
  keywords: ['several state machines', 'cooperating machines', 'event exchange', 'state explosion', 'run to completion', 'layers', 'input machine', 'button machine', 'lamp machine', 'one owner per output', 'active object'],
  prereq: ['state-machine-in-code', 'event-queues'],
  related: ['hierarchical-states', 'connection-manager-machine', 'tasks', 'long-press-double-click', 'structs-and-classes'],
  body: `There is a point where one machine stops being the right tool. A lamp with one button needs to know *what the button means* (a click, a long press) and *what the lamp does about it* (on, off, dim, switch off by itself). Written as one machine, every lamp state must also remember the button's state: 3 button states × 3 lamp states is nine states, with arrows between many of them. Written as two machines, the button machine has 3 states, the lamp machine has 3, and they share two words: CLICK and LONG_PRESS.

### Two machines, one conversation

The button machine ([[drawing-a-state-diagram]]) watches the raw signal and produces *meaning*: released within a second, it says CLICK; held for a second, it says LONG_PRESS. The lamp machine knows nothing about pins or bouncing. It has OFF, ON and DIM:

| Lamp state | CLICK | LONG_PRESS | By itself |
|---|---|---|---|
| OFF | ON | ignored | |
| ON | OFF | DIM | |
| DIM | OFF | ignored | after 8 s: OFF |

The button machine's *action* is "send CLICK to the lamp"; the lamp's *event* is CLICK. That is all the coupling.

### Rules that keep it clean

1. **Machines talk by events, never by reaching into each other's state.** If the lamp read the button's \`state\` variable, they would be one machine again — a tangled one.
2. **One owner per output.** Only the lamp machine writes the lamp pin; two machines driving one pin fight.
3. **Run to completion.** A machine finishes handling one event, actions included, before it takes the next. When events can pile up, send them through a queue ([[event-queues]]).
4. **Layers.** Machines that watch the world (buttons, sensors, the connection) sit below and produce meaningful events; the application machine decides; machines that act (a blinker, a motor ramp) sit above. Events flow up, commands flow down.

### The arithmetic of splitting

Independent machines *multiply* when merged: 3 × 3 = 9 states, and a third machine of three states makes 27. Kept apart they *add*: 3 + 3 + 3 = 9. This **state explosion** is the strongest reason to split, and the simulation counts both as you play.

### When not to split

If two machines must always change state together — if one is meaningless without the other — they are one machine and should be drawn as one. If you find yourself sending a dozen kinds of event between two machines, the boundary is in the wrong place. A good test: could you replace one machine without touching the other?

> [!key] Split a device into small machines that exchange events: their states add up where one big machine's would multiply. Keep one owner per output, never read another machine's state, and let each machine finish an event before it takes the next.`,
  ideas: [
    'Two small machines that exchange events are easier to draw, test and replace than one large machine that remembers both.',
    'Independent machines multiply their states when merged (3 × 3 = 9) but add when kept apart (3 + 3 = 6).',
    'Machines communicate by events only; reading another machine\'s state variable couples them again.',
    'Keep one owner per output and let each machine run an event to completion before it takes the next.'
  ],
  pitfalls: [
    'Splitting always helps — If two machines must change together, or one is meaningless without the other, the split only hides a single machine. If they exchange many kinds of event, the boundary is wrong.',
    'A machine can just read the other\'s state when it needs to know — That couples them: change one and the other breaks silently. Send an event when something becomes true, and let the other keep its own record.',
    'Two machines can share an output if they take turns — Taking turns is itself a state, and now it belongs to neither machine. Give each output one owner, and have the others ask the owner through an event.'
  ],
  terms: [
    { term: 'Run to completion', also: ['atomic event handling'], def: 'The rule that a machine finishes handling one event — the transition and all its actions — before it starts on the next. It keeps the state consistent when events arrive quickly.' },
    { term: 'State explosion', also: ['combinatorial explosion'], def: 'The growth in the number of states when independent machines are merged into one: the counts multiply instead of adding. It is the main reason to split a machine.' },
    { term: 'Orthogonal regions', also: ['parallel machines', 'concurrent states'], def: 'Parts of one device that are in a state of their own at the same time and independently, such as a button and a lamp. In this app they are written as separate machines that exchange events.' },
    { term: 'Event-driven design', also: ['reactive design'], def: 'Building a program as parts that react to events and send events to each other, instead of one sequence of steps that waits for things in turn.' }
  ],
  choose: {
    good: ['An input machine (button, sensor, connection) feeding an application machine that decides', 'A behaviour machine on top of an output machine such as a blinker, a motor ramp or a fade', 'Parts of the device that run on different timescales or are developed by different people'],
    avoid: ['Splitting a machine whose parts must always change state together', 'Machines that exchange a dozen kinds of event: the boundary is in the wrong place', 'Two machines that both write the same pin'],
    check: ['What exactly is exchanged — can you list the events on one hand?', 'Who owns each output?', 'Could you replace one machine without changing the other?']
  },
  code: [
    {
      title: 'A button machine and a lamp machine',
      about: 'The button machine turns debounced DOWN and UP into CLICK and LONG_PRESS. The lamp machine (OFF, ON, DIM) reacts to them: a click toggles, a long press dims, and dim switches off after 8 s. The two share only those two events.',
      needs: 'An ESP32 DevKit, a push button and an LED with a 220 Ω resistor on a PWM-capable pin.',
      wiring: [['GPIO4', 'push button → GND', 'internal pull-up'], ['GPIO25', '220 Ω → LED → GND', 'driven with PWM']],
      blocks: `
        when started
          set pin (4) as [input with pull-up v]
          set PWM on pin (25) frequency (5000) resolution (8)
          go to state [RELEASED v]                 // the button machine
          go to state [OFF v]                      // the lamp machine

        // ---- the button machine: RELEASED, PRESSED, HELD
        when pin (4) goes [low v]                  // debounced
          raise event [DOWN v]

        when pin (4) goes [high v]
          raise event [UP v]

        when event [DOWN v] in state [RELEASED v]
          go to state [PRESSED v]

        when event [UP v] in state [PRESSED v]
          raise event [CLICK v]                    // the button machine speaks to the lamp machine
          go to state [RELEASED v]

        when (1) seconds in state [PRESSED v]
          go to state [HELD v]

        when entering state [HELD v]
          raise event [LONG_PRESS v]

        when event [UP v] in state [HELD v]
          go to state [RELEASED v]

        // ---- the lamp machine: OFF, ON, DIM
        when entering state [OFF v]
          set PWM on pin (25) to (0)

        when entering state [ON v]
          set PWM on pin (25) to (255)

        when entering state [DIM v]
          set PWM on pin (25) to (30)

        when event [CLICK v] in state [OFF v]
          go to state [ON v]

        when event [CLICK v] in state [ON v]
          go to state [OFF v]

        when event [LONG_PRESS v] in state [ON v]
          go to state [DIM v]

        when event [CLICK v] in state [DIM v]
          go to state [OFF v]

        when (8) seconds in state [DIM v]
          go to state [OFF v]
      `,
      cpp: String.raw`
        const int BUTTON = 4;
        const int LAMP = 25;                          // driven with PWM: off, dim, full

        enum ButtonState { RELEASED, PRESSED, HELD };
        enum LampState { OFF, ON, DIM };
        enum Event { DOWN, UP, CLICK, LONG_PRESS };

        ButtonState button = RELEASED;
        LampState lamp = OFF;
        uint32_t buttonSince = 0, lampSince = 0;

        // ---- the lamp machine: knows nothing about pins of the button or about bouncing
        void lampGoTo(LampState next) {
          lamp = next;
          lampSince = millis();
          ledcWrite(LAMP, next == ON ? 255 : next == DIM ? 30 : 0);   // entry action
        }

        void lampHandle(Event ev) {
          switch (lamp) {
            case OFF:
              if (ev == CLICK) lampGoTo(ON);
              break;
            case ON:
              if (ev == CLICK) lampGoTo(OFF);
              else if (ev == LONG_PRESS) lampGoTo(DIM);
              break;
            case DIM:
              if (ev == CLICK) lampGoTo(OFF);
              break;
          }
        }

        // ---- the button machine: turns DOWN and UP into CLICK and LONG_PRESS
        void buttonGoTo(ButtonState next) {
          button = next;
          buttonSince = millis();
          if (button == HELD) lampHandle(LONG_PRESS);           // entry action: tell the lamp machine
        }

        void buttonHandle(Event ev) {
          switch (button) {
            case RELEASED:
              if (ev == DOWN) buttonGoTo(PRESSED);
              break;
            case PRESSED:
              if (ev == UP) { lampHandle(CLICK); buttonGoTo(RELEASED); }   // action on the transition
              break;
            case HELD:
              if (ev == UP) buttonGoTo(RELEASED);
              break;
          }
        }

        bool stableLevel = HIGH, lastRaw = HIGH;
        uint32_t changedAt = 0;

        void pollButton() {                           // debounce: accept a level once it has stayed 20 ms
          bool raw = digitalRead(BUTTON);
          if (raw != lastRaw) { lastRaw = raw; changedAt = millis(); }
          if (raw != stableLevel && millis() - changedAt >= 20) {
            stableLevel = raw;
            buttonHandle(stableLevel == LOW ? DOWN : UP);
          }
        }

        void setup() {
          pinMode(BUTTON, INPUT_PULLUP);
          ledcAttach(LAMP, 5000, 8);
          buttonGoTo(RELEASED);
          lampGoTo(OFF);
        }

        void loop() {
          pollButton();
          if (button == PRESSED && millis() - buttonSince >= 1000) buttonGoTo(HELD);   // timeouts of each machine
          if (lamp == DIM && millis() - lampSince >= 8000) lampGoTo(OFF);
        }
      `,
      py: String.raw`
        from machine import Pin, PWM
        import time

        BUTTON = Pin(4, Pin.IN, Pin.PULL_UP)
        LAMP = PWM(Pin(25), freq=5000, duty_u16=0)    # driven with PWM: off, dim, full

        RELEASED, PRESSED, HELD = 0, 1, 2             # the button machine
        OFF, ON, DIM = 0, 1, 2                        # the lamp machine
        button = RELEASED
        lamp = OFF
        button_since = time.ticks_ms()
        lamp_since = time.ticks_ms()

        # ---- the lamp machine: knows nothing about the button's pin or about bouncing
        def lamp_go_to(new_state):
            global lamp, lamp_since
            lamp = new_state
            lamp_since = time.ticks_ms()
            LAMP.duty_u16({OFF: 0, ON: 65535, DIM: 7500}[lamp])    # entry action

        def lamp_handle(event):
            if lamp == OFF:
                if event == "CLICK":
                    lamp_go_to(ON)
            elif lamp == ON:
                if event == "CLICK":
                    lamp_go_to(OFF)
                elif event == "LONG_PRESS":
                    lamp_go_to(DIM)
            elif lamp == DIM:
                if event == "CLICK":
                    lamp_go_to(OFF)

        # ---- the button machine: turns DOWN and UP into CLICK and LONG_PRESS
        def button_go_to(new_state):
            global button, button_since
            button = new_state
            button_since = time.ticks_ms()
            if button == HELD:
                lamp_handle("LONG_PRESS")             # entry action: tell the lamp machine

        def button_handle(event):
            if button == RELEASED:
                if event == "DOWN":
                    button_go_to(PRESSED)
            elif button == PRESSED:
                if event == "UP":
                    lamp_handle("CLICK")              # action on the transition
                    button_go_to(RELEASED)
            elif button == HELD:
                if event == "UP":
                    button_go_to(RELEASED)

        stable_level = 1
        last_raw = 1
        changed_at = time.ticks_ms()

        def poll_button():                            # debounce: accept a level once it has stayed 20 ms
            global stable_level, last_raw, changed_at
            raw = BUTTON.value()
            if raw != last_raw:
                last_raw = raw
                changed_at = time.ticks_ms()
            if raw != stable_level and time.ticks_diff(time.ticks_ms(), changed_at) >= 20:
                stable_level = raw
                button_handle("DOWN" if stable_level == 0 else "UP")

        button_go_to(RELEASED)
        lamp_go_to(OFF)
        while True:
            poll_button()
            if button == PRESSED and time.ticks_diff(time.ticks_ms(), button_since) >= 1000:   # timeouts of each machine
                button_go_to(HELD)
            if lamp == DIM and time.ticks_diff(time.ticks_ms(), lamp_since) >= 8000:
                lamp_go_to(OFF)
            time.sleep_ms(2)
      `,
      notes: ['Here one machine calls the other\'s handler directly, which is "sending an event" with the receiver running at once. If the receiver could be busy, post to a queue instead ([[event-queues]]).', 'In the block notation the two machines use different state names, so a hat such as "in state [ON]" says which machine it belongs to; events are shared by name.']
    }
  ],
  examples: [
    {
      title: 'How many states, together and apart?',
      q: 'A device has a button machine of 3 states, a lamp machine of 3 states and a connection machine of 4 states, all independent. How many states would one merged machine need, and how many do the separate machines have in total?',
      steps: ['Merged, the counts multiply: 3 × 3 × 4 = 36 states.', 'Separate, they add: 3 + 3 + 4 = 10 states.', 'And the merged machine would need arrows between a large number of those 36 states.'],
      a: '36 states merged against 10 kept apart. Each separate machine can be drawn on a page; the merged one cannot.'
    }
  ],
  quiz: [
    { q: 'Two independent machines of three states each are merged into one. How many states does the merged machine need?', choices: ['6', '9', '3', '27'], a: 1, why: 'Every combination of one state of each machine is a state of the merged one: 3 × 3 = 9. Kept separate the machines need 3 + 3 = 6.' },
    { q: 'The lamp machine reads the variable that holds the button machine\'s state to decide what to do. What is wrong with that?', choices: ['Nothing: it is efficient', 'The two are now coupled: change one and the other breaks, instead of talking by events', 'Variables cannot be shared', 'It uses more memory'], a: 1, why: 'Reaching into another machine\'s state makes them one tangled machine again. An event says "something became true" and leaves each machine its own record.' },
    { q: 'Two machines may both drive the same output pin if they take turns.', a: false, why: 'Taking turns is a state of its own and belongs to neither machine. Give each output one owner; the other machine sends it an event.' },
    { q: 'What does "run to completion" mean?', choices: ['A machine finishes handling one event, including its actions, before it takes the next', 'A machine runs until it reaches its final state', 'Every state must be visited once', 'The program never stops'], a: 0, why: 'It keeps the state consistent: an event is never handled in the middle of another event\'s transition.' }
  ],
  applications: [
    'Remote controls and appliance panels: an input machine for the buttons behind an application machine.',
    'Robots with a behaviour machine on top of a motor-ramp machine and an obstacle-sensing machine.',
    'Smart-home devices: a connection machine tells the device machine when it is online or offline.',
    'Display firmware: a screen machine on top of a back-light fade machine.'
  ],
  sources: [
    'David Harel, "Statecharts: a visual formalism for complex systems", Science of Computer Programming 8 (1987): orthogonal (parallel) regions and why they exist.',
    'Miro Samek, *Practical UML Statecharts in C/C++* (2nd edition, 2008): active objects, event-driven design and run to completion.',
    'FreeRTOS documentation, queue management: the usual way for machines in different tasks to send each other events.'
  ],
  sim: 'sm-two-machines'
},

/* ================================================================ a machine for Wi-Fi and MQTT connections */
{
  id: 'connection-manager-machine',
  parent: 'state-machines',
  title: 'A machine for Wi-Fi and MQTT connections',
  level: 3,
  short: 'The pattern every connected device needs: DISCONNECTED, CONNECTING, WIFI_UP, MQTT_UP, each with a timeout, and a growing, jittered wait between attempts, so the device climbs back after every fall.',
  keywords: ['connection manager', 'Wi-Fi reconnect', 'MQTT reconnect', 'back-off', 'exponential back-off', 'jitter', 'retry', 'timeout', 'DISCONNECTED', 'CONNECTING', 'broker', 'setAutoReconnect', 'reconnects', 'umqtt', 'PubSubClient'],
  prereq: ['timeouts-and-timed-states', 'wifi-events-and-reconnection', 'mqtt'],
  related: ['wifi-station', 'mqtt-topics-qos-retain', 'error-states-and-recovery', 'hierarchical-states', 'fast-wifi-reconnect', 'store-and-forward'],
  body: `Every connected device meets the same problem: the network is not always there. The router reboots, the signal fades, the broker restarts, the password has changed. A program that connects once in \`setup()\` and assumes the link stays up works on the bench and fails in the field. The pattern that fixes it is a small state machine that *owns* the connection, from "nothing" to "publishing", and knows how to climb back after every fall.

### Four states

| State | Means | Leaves when |
|---|---|---|
| DISCONNECTED | Wi-Fi off, waiting before the next try | the back-off time ends → CONNECTING |
| CONNECTING | joining the access point | joined → WIFI_UP; 15 s without success → DISCONNECTED |
| WIFI_UP | Wi-Fi is up, connecting to the broker | broker accepts → MQTT_UP; 8 s without success or Wi-Fi lost → DISCONNECTED |
| MQTT_UP | everything works; the application may publish | broker lost → WIFI_UP; Wi-Fi lost → DISCONNECTED |

The rest of the program does not care how the link came up. It asks one question — *am I in MQTT_UP?* — and publishes if so. Retries, timeouts and the order of things live in the machine.

### Timeouts

Every state that waits for the network needs a timeout, because a network call can take as long as the stack decides, or never answer. CONNECTING and WIFI_UP both have one; when it expires the machine does *not* try again at once. It falls back to DISCONNECTED and waits.

### Back-off

If the router is down, trying every second helps nobody. It drains a battery, floods the log, and when a building full of devices wakes after a power cut they all hit the router at the same instant. The standard answer is **exponential back-off**: wait 1 s after the first failure, 2 s after the second, then 4, 8, 16, up to a cap (30 s here), and go back to 1 s when MQTT_UP is reached. Add a little random **jitter**, a few hundred milliseconds either way, so devices that failed together do not retry together.

### One owner

The Wi-Fi stack can reconnect by itself (\`WiFi.setAutoReconnect(true)\`; MicroPython retries for ever by default). Two retry loops — yours and the stack's — fight. If the machine owns recovery, switch the automatic reconnect off. [[wifi-events-and-reconnection]] lists the events the stack reports.

### Calls that block

\`WiFi.begin()\` and \`wlan.connect()\` return at once, and the machine polls the status. The MQTT \`connect()\` of the common libraries *blocks* until it succeeds or fails. That is one short call inside one state, not a loop around it: keep its socket timeout low and the machine's rhythm survives.

> [!key] Let one small machine own the connection: DISCONNECTED, CONNECTING, WIFI_UP, MQTT_UP, each with a timeout, and a growing, jittered wait between attempts. The rest of the program only asks whether it is in MQTT_UP.`,
  ideas: [
    'A connection is a small state machine with four states: DISCONNECTED, CONNECTING, WIFI_UP, MQTT_UP.',
    'Every state that waits for the network has a timeout, and a failed attempt falls back to DISCONNECTED rather than retrying at once.',
    'Exponential back-off with jitter spares the battery, the router and the broker when the network is down for a long time.',
    'Let one party own the retries: the machine or the Wi-Fi stack, not both.'
  ],
  pitfalls: [
    'Connect once in setup(), the link will stay — Routers reboot, signals fade and brokers restart. A device that cannot recover by itself is stuck until someone power-cycles it.',
    'Retry every second so that the device is back as soon as possible — It makes a long outage worse: it drains the battery, and a whole site restarting together can keep an access point busy. Back off, and add jitter.',
    'Turning on both the stack\'s auto-reconnect and my own retries is safer — The two loops interfere: one starts a connection while the other tears it down. Choose a single owner.'
  ],
  terms: [
    { term: 'Exponential back-off', also: ['backoff', 'retry with growing delay'], def: 'Waiting longer after each failed attempt — for example 1 s, 2 s, 4 s, 8 s — up to a ceiling, and starting again from the shortest wait after a success.' },
    { term: 'Jitter', also: ['random delay'], def: 'A small random amount added to a wait so that many devices that failed together do not all retry at the same instant.' },
    { term: 'Thundering herd', also: ['reconnection storm'], def: 'Many devices trying to connect at the same moment, for example after a power cut, so that the access point or the broker is overloaded and all of them fail again.' },
    { term: 'Connection manager', also: ['link supervisor'], def: 'The part of a program that owns the network connection: it connects, watches, times out, backs off and reconnects, and tells the rest of the program whether the link is up.' }
  ],
  choose: {
    good: ['A machine that owns the whole path to the broker, for any device that must run unattended', 'Back-off with a cap and jitter for devices on batteries or in large numbers', 'The Wi-Fi stack\'s own auto-reconnect when the device does nothing else and a short outage does not matter'],
    avoid: ['Blocking while-loops that wait for Wi-Fi in setup() and never give up', 'Retrying at a fixed short interval for ever', 'Two retry mechanisms running at once'],
    check: ['What does the device do while it has no link — queue data, or lose it?', 'How long can the broker be down before the device should restart Wi-Fi?', 'What happens at the cap: does the device keep trying for ever, or restart?']
  },
  code: [
    {
      title: 'A connection manager for Wi-Fi and MQTT',
      about: 'The machine joins Wi-Fi, then the broker, and publishes "online". Failures fall back to DISCONNECTED, where it waits 1 s, then 2 s, 4 s … up to 30 s, plus up to half a second of jitter. Losing the broker or the Wi-Fi sends it back to the right state.',
      needs: 'Any ESP32 board, a Wi-Fi network and an MQTT broker. Arduino: the PubSubClient library; MicroPython: the built-in umqtt.simple.',
      libs: ['PubSubClient'],
      blocks: `
        when started
          set [backoff v] to (1)                       // seconds
          go to state [DISCONNECTED v]

        when entering state [DISCONNECTED v]
          disconnect Wi-Fi
          print (join [waiting ] (backoff))

        when (backoff) seconds in state [DISCONNECTED v]
          set [backoff v] to (min ((backoff) * (2)) (30))   // the next failure waits longer
          go to state [CONNECTING v]

        when entering state [CONNECTING v]
          connect to Wi-Fi [your-ssid] password [your-password]

        when Wi-Fi connects
          if <state = [CONNECTING v]> then
            go to state [WIFI_UP v]
          end

        when (15) seconds in state [CONNECTING v]
          go to state [DISCONNECTED v]

        when entering state [WIFI_UP v]
          connect to MQTT broker [broker.example.com]

        when MQTT connects
          if <state = [WIFI_UP v]> then
            go to state [MQTT_UP v]
          end

        when (8) seconds in state [WIFI_UP v]
          go to state [DISCONNECTED v]

        when entering state [MQTT_UP v]
          set [backoff v] to (1)                       // success: forget the failures
          publish [online] to topic [home/esp32/status]

        when MQTT disconnects
          if <state = [MQTT_UP v]> then
            go to state [WIFI_UP v]
          end

        when Wi-Fi disconnects
          if <not <state = [DISCONNECTED v]>> then
            go to state [DISCONNECTED v]
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <PubSubClient.h>

        const char *SSID = "your-ssid";               // do not leave real credentials in shared code
        const char *PASS = "your-password";
        const char *BROKER = "broker.example.com";

        const uint32_t WIFI_TIMEOUT_MS = 15000;
        const uint32_t MQTT_TIMEOUT_MS = 8000;
        const uint32_t BACKOFF_MIN_MS = 1000;
        const uint32_t BACKOFF_MAX_MS = 30000;

        enum State { DISCONNECTED, CONNECTING, WIFI_UP, MQTT_UP };
        State state = DISCONNECTED;
        uint32_t enteredAt = 0;
        uint32_t backoffMs = BACKOFF_MIN_MS;          // grows after each failure
        uint32_t waitMs = BACKOFF_MIN_MS;             // this wait: back-off plus a little jitter

        NetworkClient net;
        PubSubClient mqtt(net);

        void goTo(State next) {
          state = next;
          enteredAt = millis();
          switch (state) {                            // entry actions
            case DISCONNECTED:
              if (mqtt.connected()) mqtt.disconnect();
              WiFi.disconnect();
              waitMs = backoffMs + random(500);       // jitter: devices that failed together retry apart
              Serial.printf("waiting %lu ms\n", (unsigned long)waitMs);
              break;
            case CONNECTING:
              WiFi.begin(SSID, PASS);                 // returns at once: the loop polls the status
              break;
            case WIFI_UP:
              mqtt.connect("esp32-demo");             // blocks until it succeeds or fails
              break;
            case MQTT_UP:
              backoffMs = BACKOFF_MIN_MS;             // success: forget the failures
              mqtt.publish("home/esp32/status", "online");
              break;
          }
        }

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);
          WiFi.setAutoReconnect(false);               // the machine owns the retries
          mqtt.setServer(BROKER, 1883);
          goTo(DISCONNECTED);
        }

        void loop() {
          uint32_t inState = millis() - enteredAt;
          bool wifiOk = WiFi.status() == WL_CONNECTED;   // events are noticed by polling

          switch (state) {
            case DISCONNECTED:
              if (inState >= waitMs) {
                backoffMs = min(backoffMs * 2, BACKOFF_MAX_MS);   // the next failure waits longer
                goTo(CONNECTING);
              }
              break;
            case CONNECTING:
              if (wifiOk) goTo(WIFI_UP);                          // event: Wi-Fi joined
              else if (inState >= WIFI_TIMEOUT_MS) goTo(DISCONNECTED);
              break;
            case WIFI_UP:
              if (!wifiOk) goTo(DISCONNECTED);                    // event: Wi-Fi lost
              else if (mqtt.connected()) goTo(MQTT_UP);           // event: the broker accepted
              else if (inState >= MQTT_TIMEOUT_MS) goTo(DISCONNECTED);
              break;
            case MQTT_UP:
              if (!wifiOk) goTo(DISCONNECTED);
              else if (!mqtt.connected()) goTo(WIFI_UP);          // event: the broker was lost
              else mqtt.loop();                                   // keep-alive and incoming messages
              break;
          }
        }
      `,
      py: String.raw`
        import network, time, random
        from umqtt.simple import MQTTClient

        SSID = "your-ssid"                            # do not leave real credentials in shared code
        PASS = "your-password"
        BROKER = "broker.example.com"

        WIFI_TIMEOUT_MS = 15000
        MQTT_TIMEOUT_MS = 8000
        BACKOFF_MIN_MS = 1000
        BACKOFF_MAX_MS = 30000

        DISCONNECTED, CONNECTING, WIFI_UP, MQTT_UP = 0, 1, 2, 3
        state = DISCONNECTED
        entered_at = time.ticks_ms()
        backoff_ms = BACKOFF_MIN_MS                   # grows after each failure
        wait_ms = BACKOFF_MIN_MS                      # this wait: back-off plus a little jitter

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.config(reconnects=0)                     # the machine owns the retries
        mqtt = MQTTClient("esp32-demo", BROKER)
        mqtt_ok = False

        def mqtt_connect():
            global mqtt_ok
            try:
                mqtt.connect()                        # blocks until it succeeds or fails
                mqtt_ok = True
            except OSError:
                mqtt_ok = False

        def mqtt_close():
            global mqtt_ok
            if mqtt_ok:
                try:
                    mqtt.disconnect()
                except OSError:
                    pass
            mqtt_ok = False

        def go_to(new_state):
            global state, entered_at, backoff_ms, wait_ms
            state = new_state
            entered_at = time.ticks_ms()
            if state == DISCONNECTED:                 # entry actions
                mqtt_close()
                wlan.disconnect()
                wait_ms = backoff_ms + random.randrange(500)   # jitter: devices that failed together retry apart
                print("waiting", wait_ms, "ms")
            elif state == CONNECTING:
                wlan.connect(SSID, PASS)              # returns at once: the loop polls the status
            elif state == WIFI_UP:
                mqtt_connect()                        # blocks until it succeeds or fails
            elif state == MQTT_UP:
                backoff_ms = BACKOFF_MIN_MS           # success: forget the failures
                mqtt.publish(b"home/esp32/status", b"online")

        go_to(DISCONNECTED)
        while True:
            in_state = time.ticks_diff(time.ticks_ms(), entered_at)
            wifi_ok = wlan.isconnected()              # events are noticed by polling

            if state == DISCONNECTED:
                if in_state >= wait_ms:
                    backoff_ms = min(backoff_ms * 2, BACKOFF_MAX_MS)   # the next failure waits longer
                    go_to(CONNECTING)
            elif state == CONNECTING:
                if wifi_ok:                           # event: Wi-Fi joined
                    go_to(WIFI_UP)
                elif in_state >= WIFI_TIMEOUT_MS:
                    go_to(DISCONNECTED)
            elif state == WIFI_UP:
                if not wifi_ok:                       # event: Wi-Fi lost
                    go_to(DISCONNECTED)
                elif mqtt_ok:                         # event: the broker accepted
                    go_to(MQTT_UP)
                elif in_state >= MQTT_TIMEOUT_MS:
                    go_to(DISCONNECTED)
            elif state == MQTT_UP:
                if not wifi_ok:
                    go_to(DISCONNECTED)
                else:
                    try:
                        mqtt.check_msg()              # also notices when the connection has been lost
                    except OSError:
                        mqtt_ok = False
                        go_to(WIFI_UP)                # event: the broker was lost
            time.sleep_ms(100)
      `,
      output: `
        waiting 1312 ms
        waiting 2147 ms
        waiting 4380 ms
      `,
      notes: ['The block, the Arduino library and umqtt each block in their own way while connecting. In MicroPython the TCP connect of umqtt.simple can wait many seconds when the broker\'s address is unreachable: use a client with a socket timeout, or asyncio, if that matters.', 'Real credentials stay out of shared code; see [[credentials-handling]]. A real device also sets an MQTT keep-alive and sends pings, which this sketch leaves out for brevity.']
    }
  ],
  quiz: [
    { q: 'The router is switched off for ten minutes. Which behaviour is best?', choices: ['Retry every 100 ms', 'Retry with waits that grow up to a cap, plus a little random jitter', 'Restart the chip at every attempt', 'Give up for ever after three tries'], a: 1, why: 'Growing waits spare the battery and the network; the cap keeps recovery quick once the router is back; jitter keeps a crowd of devices from retrying in step. Giving up for ever leaves the device dead.' },
    { q: 'The manager is in MQTT_UP and the Wi-Fi drops. Where should it go?', choices: ['WIFI_UP', 'DISCONNECTED', 'CONNECTING', 'It stays in MQTT_UP'], a: 1, why: 'The broker connection cannot exist without Wi-Fi, so the whole path is torn down and rebuilt from DISCONNECTED, with the back-off wait.' },
    { q: 'It is safe to leave the Wi-Fi stack\'s automatic reconnect on while the machine also retries.', a: false, why: 'Two retry mechanisms can start and stop connections against each other. Choose one owner; if it is the machine, turn the stack\'s auto-reconnect off.' },
    { q: 'Why does the back-off return to its minimum when MQTT_UP is reached?', choices: ['To save memory', 'A success shows the network is healthy, so the next failure should be answered quickly again', 'Because timers wrap round', 'The broker requires it'], a: 1, why: 'The growing wait is for a network that stays down. After a success, a new failure is probably short, and a short first wait recovers fastest.' }
  ],
  applications: [
    'Every battery or mains sensor that reports over Wi-Fi: weather stations, door sensors, energy monitors.',
    'Smart-home devices that must come back by themselves after a router reboot or a broker upgrade.',
    'Fleets of devices on one site, where jitter and back-off keep a power cut from becoming a connection storm.',
    'Gateways that buffer data while offline and flush it when the machine reaches MQTT_UP.'
  ],
  sources: [
    'MQTT Version 3.1.1, OASIS Standard: the CONNECT and CONNACK exchange and the keep-alive mechanism.',
    'Marc Brooker, "Exponential Backoff And Jitter", AWS Architecture Blog (2015): why retries need random delay.',
    'Arduino core for ESP32 documentation, the Wi-Fi API (`WiFi.begin`, `WiFi.status`, `setAutoReconnect`); MicroPython documentation, `network.WLAN`.'
  ],
  sim: 'sm-connection'
},

/* ================================================================ error states and recovery */
{
  id: 'error-states-and-recovery',
  parent: 'state-machines',
  title: 'Error states and recovery',
  level: 2,
  short: 'Errors are part of the design: notice them with a timeout, an event or a count; go to a safe state first; retry what is transient, latch what is not; and tell someone.',
  keywords: ['error state', 'fault', 'safe state', 'latched fault', 'transient fault', 'recovery', 'retry', 'give up', 'reset', 'watchdog', 'dry run', 'pump', 'alarm', 'failure count', 'escalation'],
  prereq: ['timeouts-and-timed-states', 'entry-exit-and-guards'],
  related: ['watchdogs', 'reset-reasons', 'nvs-and-preferences', 'connection-manager-machine', 'hierarchical-states', 'errors-and-exceptions', 'safety-in-control'],
  body: `Everything that can fail will, and the machine needs a plan for each failure. An error is not an exception to the design; it is part of it. The questions are always the same: how do we notice, what do we do right now, and how does it end?

### Noticing

Three ways. A **timeout**: the state lasted too long — the pump ran 20 s and the tank is not full. An **event** from the world: overcurrent, a sensor out of range, a broker that said no. A **count**: the same thing has gone wrong three times. Whichever it is, it becomes an ordinary event, and the handling is ordinary transitions.

### Safe state

The first thing every error state does is put the device in a **safe state**: pump off, heater off, motor stopped, valve at its spring position. Do it in the *entry* action of the error state so that every road into it has it ([[entry-exit-and-guards]]). "Safe" is a design decision, not "everything off": a freezer controller's safe state keeps the alarm on, and a lock chooses between failing open and failing shut.

### Transient or latched

- **Transient fault:** likely to go away on its own — a dropped Wi-Fi link, one failed sensor read. Wait, retry, and back off if it repeats ([[connection-manager-machine]]).
- **Persistent fault:** retrying changes nothing — a dry well, a jammed door. Count the failures; at a limit, go to a **latched fault**: a state with no timeout, left only by a deliberate RESET event such as a held button or a command from the owner.

Latching is a feature. A machine that quietly retries a dry well all night burns out the pump. With this rule the pump of [[timeouts-and-timed-states]] runs at most three 20 s attempts: the first and second time-outs go to RESTING and try again; the third goes to FAULT, with the pump off and an alarm blinking, until the reset button is pressed.

### Tell someone

A fault nobody sees is not handled. Blink a code on an LED, show it on a display, publish an MQTT message, keep a counter in non-volatile memory ([[nvs-and-preferences]]) that survives a reboot. Log the *transition* with the state it came from and the reason: that is the most useful line in a field report.

### The last resort

Some failures leave the program itself in doubt: a driver hangs, memory is corrupt. The watchdog ([[watchdogs]]) restarts the chip, and on starting the machine should ask why it was reset ([[reset-reasons]]) so that a recovery boot differs from a normal one. A restart is a recovery strategy, not a design: do it after a counted number of failures, and record why.

> [!key] Notice errors with a timeout, an event or a count; enter a safe state first; retry what is transient and latch what is not, leaving only on a deliberate reset; and make sure somebody is told.`,
  ideas: [
    'Errors are noticed as timeouts, events from the world, or counts of repeated failures, and handled by ordinary transitions.',
    'An error state first makes the device safe, in its entry action, so every way in has it.',
    'Transient faults are retried with waits; persistent faults are counted and then latched until a deliberate reset.',
    'A fault must be reported, and a restart is a last resort that should be counted and recorded.'
  ],
  pitfalls: [
    'On any error the safest thing is to restart — A restart throws away the evidence and may repeat the failure for ever. Restart after a counted number of failures, and record the reason.',
    'The machine should retry until it works — A persistent fault, such as a dry well, never "works": retrying burns out the pump. After a limit, latch the fault and wait for a person.',
    'The error state can simply be "everything off" — What is safe depends on the device: a freezer\'s alarm must stay on, a lock may have to fail open. The safe state is chosen in the design.'
  ],
  terms: [
    { term: 'Safe state', also: ['fail-safe state', 'safe condition'], def: 'The condition in which the device can do no harm and from which it can be restarted: pump off, heater off, motor stopped. Which outputs it holds is part of the design.' },
    { term: 'Latched fault', also: ['latching fault', 'locked-out state'], def: 'A fault state with no timeout, left only by a deliberate reset such as a held button or a command. It stops a machine from retrying a failure that retrying cannot cure.' },
    { term: 'Transient fault', also: ['temporary fault', 'soft fault'], def: 'A failure that is likely to clear by itself, such as a dropped Wi-Fi link. The right response is to wait and retry, with back-off.' },
    { term: 'Fault escalation', also: ['escalation'], def: 'Responding to a repeated failure with a bigger step each time: retry, then rest and retry, then latch a fault, then restart or call for help.' }
  ],
  code: [
    {
      title: 'A pump that gives up after three dry runs',
      about: 'The pump of the timeout page, with a failure count. A run that does not fill the tank in 20 s counts as a failure: the first two rest for 10 s, the third latches FAULT with the pump off and the alarm blinking, until the reset button is pressed.',
      needs: 'An ESP32 DevKit, two float switches (or buttons), a pump behind a MOSFET or relay module, an alarm LED and a reset button.',
      wiring: [['GPIO32', 'low float switch → GND', 'internal pull-up'], ['GPIO33', 'full float switch → GND', 'internal pull-up'], ['GPIO4', 'reset button → GND', 'internal pull-up'], ['GPIO25', 'pump switching module'], ['GPIO26', '220 Ω → alarm LED → GND']],
      blocks: `
        when started
          set pin (32) as [input with pull-up v]
          set pin (33) as [input with pull-up v]
          set pin (4) as [input with pull-up v]
          set pin (25) as [output v]
          set pin (26) as [output v]
          set [failures v] to (0)
          go to state [IDLE v]
          forever
            if <(read pin (32)) = [LOW v]> then
              raise event [TANK_LOW v]
            end
            if <(read pin (33)) = [LOW v]> then
              raise event [TANK_FULL v]
            end
          end

        when entering state [IDLE v]
          set pin (25) to [LOW v]

        when entering state [PUMPING v]
          set pin (25) to [HIGH v]

        when entering state [RESTING v]
          set pin (25) to [LOW v]

        when entering state [FAULT v]             // the safe state: pump off, alarm on
          set pin (25) to [LOW v]
          set pin (26) to [HIGH v]

        when leaving state [FAULT v]
          set pin (26) to [LOW v]

        when pin (4) goes [low v]
          raise event [FAULT_RESET v]

        when event [TANK_LOW v] in state [IDLE v]
          go to state [PUMPING v]

        when event [TANK_FULL v] in state [PUMPING v]
          set [failures v] to (0)                 // success: forget the failures
          go to state [IDLE v]

        when (20) seconds in state [PUMPING v]    // the tank did not fill: a failure
          change [failures v] by (1)
          if <(failures) ≥ (3)> then
            go to state [FAULT v]
          else
            go to state [RESTING v]
          end

        when (10) seconds in state [RESTING v]
          go to state [IDLE v]

        when event [FAULT_RESET v] in state [FAULT v]
          set [failures v] to (0)
          go to state [IDLE v]
      `,
      cpp: String.raw`
        const int LOW_FLOAT = 32, FULL_FLOAT = 33;
        const int RESET_BUTTON = 4;
        const int PUMP = 25;
        const int ALARM = 26;                          // an LED, or a buzzer
        const uint32_t MAX_RUN_MS = 20000;
        const uint32_t REST_MS = 10000;
        const int MAX_FAILURES = 3;

        enum State { IDLE, PUMPING, RESTING, FAULT };
        enum Event { TANK_LOW, TANK_FULL, FAULT_RESET };
        State state = IDLE;
        uint32_t enteredAt = 0;
        int failures = 0;                              // dry runs in a row
        bool resetWasDown = false;

        void goTo(State next) {
          state = next;
          enteredAt = millis();
          digitalWrite(PUMP, state == PUMPING);        // entry actions: every state but PUMPING is safe
          digitalWrite(ALARM, state == FAULT);
          Serial.printf("state %d, failures %d\n", state, failures);
        }

        void handle(Event ev) {
          switch (state) {
            case IDLE:
              if (ev == TANK_LOW) goTo(PUMPING);
              break;
            case PUMPING:
              if (ev == TANK_FULL) { failures = 0; goTo(IDLE); }     // success: forget the failures
              break;
            case RESTING:
              break;
            case FAULT:
              if (ev == FAULT_RESET) { failures = 0; goTo(IDLE); }   // only a deliberate reset leaves FAULT
              break;
          }
        }

        void pumpTimedOut() {                          // the tank did not fill: count it, then rest or give up
          failures++;
          goTo(failures >= MAX_FAILURES ? FAULT : RESTING);
        }

        void setup() {
          Serial.begin(115200);
          pinMode(LOW_FLOAT, INPUT_PULLUP);
          pinMode(FULL_FLOAT, INPUT_PULLUP);
          pinMode(RESET_BUTTON, INPUT_PULLUP);
          pinMode(PUMP, OUTPUT);
          pinMode(ALARM, OUTPUT);
          goTo(IDLE);
        }

        void loop() {
          if (digitalRead(LOW_FLOAT) == LOW) handle(TANK_LOW);
          if (digitalRead(FULL_FLOAT) == LOW) handle(TANK_FULL);
          bool down = digitalRead(RESET_BUTTON) == LOW;
          if (down && !resetWasDown) handle(FAULT_RESET);
          resetWasDown = down;

          uint32_t inState = millis() - enteredAt;
          if (state == PUMPING && inState >= MAX_RUN_MS) pumpTimedOut();
          if (state == RESTING && inState >= REST_MS) goTo(IDLE);
          if (state == FAULT) digitalWrite(ALARM, (millis() / 250) % 2);   // the alarm blinks
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        LOW_FLOAT = Pin(32, Pin.IN, Pin.PULL_UP)
        FULL_FLOAT = Pin(33, Pin.IN, Pin.PULL_UP)
        RESET_BUTTON = Pin(4, Pin.IN, Pin.PULL_UP)
        PUMP = Pin(25, Pin.OUT)
        ALARM = Pin(26, Pin.OUT)                       # an LED, or a buzzer
        MAX_RUN_MS = 20000
        REST_MS = 10000
        MAX_FAILURES = 3

        IDLE, PUMPING, RESTING, FAULT = 0, 1, 2, 3
        state = IDLE
        entered_at = time.ticks_ms()
        failures = 0                                   # dry runs in a row
        reset_was_down = False

        def go_to(new_state):
            global state, entered_at
            state = new_state
            entered_at = time.ticks_ms()
            PUMP.value(1 if state == PUMPING else 0)   # entry actions: every state but PUMPING is safe
            ALARM.value(1 if state == FAULT else 0)
            print("state", state, "failures", failures)

        def handle(event):
            global failures
            if state == IDLE:
                if event == "TANK_LOW":
                    go_to(PUMPING)
            elif state == PUMPING:
                if event == "TANK_FULL":
                    failures = 0                       # success: forget the failures
                    go_to(IDLE)
            elif state == FAULT:
                if event == "FAULT_RESET":             # only a deliberate reset leaves FAULT
                    failures = 0
                    go_to(IDLE)
            # RESTING ignores everything: the pump is cooling

        def pump_timed_out():                          # the tank did not fill: count it, then rest or give up
            global failures
            failures += 1
            go_to(FAULT if failures >= MAX_FAILURES else RESTING)

        go_to(IDLE)
        while True:
            if LOW_FLOAT.value() == 0:
                handle("TANK_LOW")
            if FULL_FLOAT.value() == 0:
                handle("TANK_FULL")
            down = RESET_BUTTON.value() == 0
            if down and not reset_was_down:
                handle("FAULT_RESET")
            reset_was_down = down

            in_state = time.ticks_diff(time.ticks_ms(), entered_at)
            if state == PUMPING and in_state >= MAX_RUN_MS:
                pump_timed_out()
            elif state == RESTING and in_state >= REST_MS:
                go_to(IDLE)
            if state == FAULT:
                ALARM.value((time.ticks_ms() // 250) % 2)   # the alarm blinks
            time.sleep_ms(20)
      `,
      output: `
        state 1, failures 0
        state 2, failures 1
        state 1, failures 1
        state 2, failures 2
        state 1, failures 2
        state 3, failures 3
      `,
      notes: ['The count lives in a variable the machine owns. If a restart must not forget it, keep it in non-volatile memory ([[nvs-and-preferences]]) and read it on start.', 'The safe state is written once, in the entry action: every state except PUMPING has the pump off.']
    }
  ],
  examples: [
    {
      title: 'How long can the pump run dry now?',
      q: 'With a limit of three failures, a 20 s run limit and a 10 s rest, how long does the pump run dry before the machine latches the fault?',
      steps: ['Run 20 s (failure 1), rest 10 s, run 20 s (failure 2), rest 10 s, run 20 s (failure 3).', 'Three runs of 20 s: 60 s of dry running; the whole sequence takes 80 s.', 'Then FAULT: the pump stays off until the reset button is pressed.'],
      a: 'At most 60 s of dry running, against forty minutes an hour without the count.'
    }
  ],
  quiz: [
    { q: 'A dry well makes the pump time out on every run. After the third timeout the machine goes to FAULT. How should FAULT be left?', choices: ['After a 60 s timeout', 'Only by a deliberate RESET event', 'When the low float opens', 'Never: FAULT is final'], a: 1, why: 'A timeout would send the pump back to a dry well. A latched fault waits for a person, who can look at the well and press reset.' },
    { q: 'Where is the best place to switch the pump off when the machine enters FAULT?', choices: ['On every arrow that leads to FAULT', 'In the entry action of FAULT', 'In loop(), after the switch', 'In setup()'], a: 1, why: 'The entry action runs on every way into the state, including ways added later, so the safe state cannot be forgotten.' },
    { q: 'Restarting the chip is a good first response to every error.', a: false, why: 'A restart loses the evidence and may repeat the same failure for ever. Restart only after a counted number of failures, and record why.' },
    { q: 'Which of these is a transient fault?', choices: ['A jammed garage door', 'A dry well', 'A dropped Wi-Fi link', 'A burnt-out pump'], a: 2, why: 'A Wi-Fi link usually comes back by itself, so waiting and retrying is right. The other three need a person.' }
  ],
  applications: [
    'Pumps, compressors and heaters that must not run without load: failure counts and latched faults protect them.',
    'Door and gate controllers, where a fault leaves the mechanism stopped and an alarm sounding until reset.',
    'Cold-chain loggers and freezers, whose safe state keeps the alarm and the logging running.',
    'Any unattended device: the fault state with a reported reason is what makes a field return diagnosable.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, the watchdog timers and the reset-reason functions (`esp_reset_reason`).',
    'IEC 61508, *Functional safety of electrical, electronic and programmable electronic safety-related systems*: the idea of a safe state and of fault reaction.',
    'Arduino core for ESP32 documentation, `ESP.restart()`; MicroPython documentation, `machine.reset()` and `machine.reset_cause()`.'
  ],
  sim: { id: 'sm-pump', params: { mode: 'fault' } }
},

/* ================================================================ from a description to a machine */
{
  id: 'from-requirements-to-states',
  parent: 'state-machines',
  title: 'From a description to a machine',
  level: 2,
  short: 'A worked method: underline the nouns for states, the "when" clauses for events, the "then" clauses for actions, and let a grid of states against events ask the "what if" questions that the words left out.',
  keywords: ['requirements', 'specification', 'design method', 'state-event matrix', 'what if', 'completeness', 'hand dryer', 'nouns and verbs', 'ignored events', 'initial state', 'from words to diagram'],
  prereq: ['states-events-transitions', 'drawing-a-state-diagram'],
  related: ['from-idea-to-requirements', 'block-diagrams', 'testing-a-state-machine', 'state-machine-in-code', 'timeouts-and-timed-states'],
  body: `Real projects do not start with a diagram. They start with a sentence from the person who wants the thing: "When someone puts a hand under it, it dries, and when they take the hand away it stops, but not at once…" The skill is turning such words into a machine without losing anything. There is a method, and it fits on a page.

### The description

> When a hand is put under the dryer, the fan and the heater start. They run while the hand is there, and for two seconds after it leaves. If the hand stays more than thirty seconds the heater switches off to protect it, but the fan carries on. After a run the dryer waits three seconds before it can start again.

### Step 1: nouns become states

Underline the situations that last: *idle*, *drying* (fan and heater on), the *two seconds after* (overrun), *fan only* (heater off), *waiting three seconds* (pause). That gives five states: IDLE, DRYING, OVERRUN, FAN_ONLY, PAUSE. Ask of each: can the dryer stay here, and what is on and off in it?

### Step 2: "when" clauses become events

"When a hand is put under" is HAND_IN. "After it leaves" is HAND_OUT. "For two seconds", "more than thirty seconds" and "waits three seconds" are timeouts in OVERRUN, DRYING and PAUSE. Write each as an arrow from the state it is said about.

### Step 3: "then" clauses become actions

"The fan and the heater start" is the entry action of DRYING. "The heater switches off" is the entry of FAN_ONLY. Make a small table of outputs: for each state, fan and heater on or off.

### Step 4: "what if" fills the holes

The important step. Draw a grid, states down and events across. Every empty cell is a question the description did not answer:

- What if the hand comes back during OVERRUN? (Back to DRYING at once, probably.)
- What if the hand leaves while in FAN_ONLY? (There is nothing left to protect: go to PAUSE.)
- What if a hand arrives during PAUSE? (Ignore it? A decision: write it down.)
- And at power-up? (The initial state: IDLE, everything off.)

Each cell ends as a transition or as an explicit "ignored, because …". Ask the owner; if nobody can say, choose the safe answer and record it. A cell nobody decided is where bugs live.

### Step 5: check, then run

Check for unreachable states and dead ends, run the machine with the events the description mentions and with those it does not, and only then write the code ([[state-machine-in-code]]). The simulation grows this machine step by step.

> [!warn] A real hand dryer's heater runs from mains, which is work for a qualified person, behind isolation, in an enclosure. In the program an LED stands in for the heater.

> [!key] Nouns become states, "when" clauses become events, "then" clauses become actions, and the empty cells of the state-by-event grid are the "what if" questions the description left out.`,
  ideas: [
    'Underline the situations that last for the states, the "when" clauses for the events and the "then" clauses for the actions.',
    'A grid of states against events shows every combination; each empty cell is a question the description did not answer.',
    'Each cell ends as a transition or as an ignored event, recorded on purpose.',
    'Check the machine for dead ends and unreachable states, then run it with events the description never mentioned.'
  ],
  pitfalls: [
    'If the description does not say, the machine does not need it — Silence is a decision made by accident. The empty cell of the grid is the place a user will find a surprise: a hand arriving at the wrong moment.',
    'Every verb in the description is a state — States are the situations that last. "Starts" and "switches off" are actions; they go on entries and transitions.',
    'The diagram can be drawn from the code later — A diagram drawn after the code shows what the programmer remembers. Draw from the description first, so that the owner can say "no, that is not what I meant".'
  ],
  terms: [
    { term: 'State–event matrix', also: ['state table', 'completeness grid'], def: 'A grid with the states down one side and the events along the other. Each cell holds a transition or "ignored"; an empty cell is a question still to be answered.' },
    { term: 'Requirement', also: ['specification', 'user story'], def: 'A statement, in the owner\'s words, of what the device must do. A state machine is a way of turning requirements into something that can be drawn, checked and tested.' },
    { term: 'Ignored by design', also: ['deliberately ignored'], def: 'An event that a state does not act on, written down as a decision with its reason, as against one that was simply forgotten.' }
  ],
  code: [
    {
      title: 'A hand dryer, from the description',
      about: 'The machine that the method produces: five states, three timeouts, and the two what-ifs. The sensor level is sent as an event on every pass, so a hand that is already there when PAUSE ends is noticed.',
      needs: 'An ESP32 DevKit, an infrared proximity sensor with a digital output (low when a hand is near), a small 5 V fan behind a MOSFET module, and an LED for the heater.',
      wiring: [['GPIO4', 'proximity sensor output', 'low when a hand is near; internal pull-up'], ['GPIO25', 'fan MOSFET module'], ['GPIO26', '220 Ω → LED → GND', 'stands in for the heater']],
      blocks: `
        define set outputs (fan) (heater)
          set pin (25) to (fan)
          set pin (26) to (heater)

        when started
          set pin (4) as [input with pull-up v]
          set pin (25) as [output v]
          set pin (26) as [output v]
          go to state [IDLE v]
          forever
            if <(read pin (4)) = [LOW v]> then
              raise event [HAND_IN v]
            else
              raise event [HAND_OUT v]
            end
          end

        when entering state [IDLE v]
          set outputs (0) (0) :: my

        when entering state [DRYING v]
          set outputs (1) (1) :: my

        when entering state [OVERRUN v]
          set outputs (1) (1) :: my

        when entering state [FAN_ONLY v]
          set outputs (1) (0) :: my

        when entering state [PAUSE v]
          set outputs (0) (0) :: my

        when event [HAND_IN v] in state [IDLE v]
          go to state [DRYING v]

        when event [HAND_OUT v] in state [DRYING v]
          go to state [OVERRUN v]

        when (30) seconds in state [DRYING v]       // protect the heater
          go to state [FAN_ONLY v]

        when event [HAND_IN v] in state [OVERRUN v]   // what if: the hand comes back
          go to state [DRYING v]

        when (2) seconds in state [OVERRUN v]
          go to state [PAUSE v]

        when event [HAND_OUT v] in state [FAN_ONLY v] // what if: the hand leaves early
          go to state [PAUSE v]

        when (3) seconds in state [PAUSE v]           // PAUSE ignores both events, on purpose
          go to state [IDLE v]
      `,
      cpp: String.raw`
        const int SENSOR = 4;                         // low while a hand is in front of the sensor
        const int FAN = 25;                           // a small 5 V fan through a MOSFET module
        const int HEATER = 26;                        // an LED stands in for the heater
        const uint32_t HOT_LIMIT_MS = 30000;          // more than 30 s of drying: heater off
        const uint32_t OVERRUN_MS = 2000;
        const uint32_t PAUSE_MS = 3000;

        enum State { IDLE, DRYING, OVERRUN, FAN_ONLY, PAUSE };
        enum Event { HAND_IN, HAND_OUT };
        State state = IDLE;
        uint32_t enteredAt = 0;

        void goTo(State next) {
          state = next;
          enteredAt = millis();                       // entry actions, one line per output
          digitalWrite(FAN, state == DRYING || state == OVERRUN || state == FAN_ONLY);
          digitalWrite(HEATER, state == DRYING || state == OVERRUN);
        }

        void handle(Event ev) {
          switch (state) {
            case IDLE:     if (ev == HAND_IN)  goTo(DRYING);  break;
            case DRYING:   if (ev == HAND_OUT) goTo(OVERRUN); break;
            case OVERRUN:  if (ev == HAND_IN)  goTo(DRYING);  break;   // what if: the hand comes back
            case FAN_ONLY: if (ev == HAND_OUT) goTo(PAUSE);   break;   // what if: the hand leaves early
            case PAUSE:    break;                                      // ignored, on purpose
          }
        }

        void setup() {
          pinMode(SENSOR, INPUT_PULLUP);
          pinMode(FAN, OUTPUT);
          pinMode(HEATER, OUTPUT);
          goTo(IDLE);
        }

        void loop() {
          handle(digitalRead(SENSOR) == LOW ? HAND_IN : HAND_OUT);     // the level, as an event, on every pass

          uint32_t inState = millis() - enteredAt;                     // events from the clock
          if (state == DRYING && inState >= HOT_LIMIT_MS) goTo(FAN_ONLY);
          if (state == OVERRUN && inState >= OVERRUN_MS) goTo(PAUSE);
          if (state == PAUSE && inState >= PAUSE_MS) goTo(IDLE);
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        SENSOR = Pin(4, Pin.IN, Pin.PULL_UP)          # low while a hand is in front of the sensor
        FAN = Pin(25, Pin.OUT)                        # a small 5 V fan through a MOSFET module
        HEATER = Pin(26, Pin.OUT)                     # an LED stands in for the heater
        HOT_LIMIT_MS = 30000                          # more than 30 s of drying: heater off
        OVERRUN_MS = 2000
        PAUSE_MS = 3000

        IDLE, DRYING, OVERRUN, FAN_ONLY, PAUSE = 0, 1, 2, 3, 4
        state = IDLE
        entered_at = time.ticks_ms()

        def go_to(new_state):
            global state, entered_at
            state = new_state
            entered_at = time.ticks_ms()              # entry actions, one line per output
            FAN.value(1 if state in (DRYING, OVERRUN, FAN_ONLY) else 0)
            HEATER.value(1 if state in (DRYING, OVERRUN) else 0)

        def handle(event):
            if state == IDLE:
                if event == "HAND_IN":
                    go_to(DRYING)
            elif state == DRYING:
                if event == "HAND_OUT":
                    go_to(OVERRUN)
            elif state == OVERRUN:
                if event == "HAND_IN":                # what if: the hand comes back
                    go_to(DRYING)
            elif state == FAN_ONLY:
                if event == "HAND_OUT":               # what if: the hand leaves early
                    go_to(PAUSE)
            # PAUSE: ignored, on purpose

        go_to(IDLE)
        while True:
            handle("HAND_IN" if SENSOR.value() == 0 else "HAND_OUT")   # the level, as an event, on every pass

            in_state = time.ticks_diff(time.ticks_ms(), entered_at)    # events from the clock
            if state == DRYING and in_state >= HOT_LIMIT_MS:
                go_to(FAN_ONLY)
            elif state == OVERRUN and in_state >= OVERRUN_MS:
                go_to(PAUSE)
            elif state == PAUSE and in_state >= PAUSE_MS:
                go_to(IDLE)
            time.sleep_ms(10)
      `,
      notes: ['Sending the sensor level on every pass is the cure for the "level or edge" trap of [[timeouts-and-timed-states]]: a hand still there when PAUSE ends starts the next run.']
    }
  ],
  examples: [
    {
      title: 'Counting the cells of the grid',
      q: 'The hand dryer has five states and three kinds of event: HAND_IN, HAND_OUT and "time is up". How many cells has the grid, how many does the description fill, and what about the rest?',
      steps: ['Five states times three events is fifteen cells.', 'The description fills five: IDLE on HAND_IN, DRYING on HAND_OUT and on time-up, OVERRUN on time-up, PAUSE on time-up.', 'The what-if questions add two: OVERRUN on HAND_IN and FAN_ONLY on HAND_OUT.', 'The other eight are ignored: for example DRYING on HAND_IN (the hand is already there) and PAUSE on both hand events (a decision).'],
      a: 'Fifteen cells: five from the words, two from the questions, eight ignored — each now a decision rather than an accident.'
    }
  ],
  quiz: [
    { q: 'In the method, what do the "when" clauses of the description become?', choices: ['States', 'Events, including timeouts', 'Actions', 'Guards only'], a: 1, why: '"When a hand is put under" and "after two seconds" are things that happen, so they are events. The situations that last are the states.' },
    { q: 'The empty cells of the state-by-event grid are…', choices: ['Bugs already in the code', 'Questions the description has not answered', 'Errors in the grid', 'Unreachable states'], a: 1, why: 'A blank cell means nobody has said what happens when this event arrives in this state. Each must become a transition or a deliberate "ignored".' },
    { q: 'An event that is ignored in a state needs no decision: leaving it out is the same as deciding.', a: false, why: 'Ignoring is sometimes right, but it should be a decision with a reason; otherwise the first user to meet the case finds a bug.' },
    { q: 'Which is a good state name for the hand dryer?', choices: ['START_FAN', 'OVERRUN', 'if_hand', 'TURN_OFF_HEATER'], a: 1, why: 'OVERRUN is a situation that lasts two seconds. The others are actions or tests.' }
  ],
  applications: [
    'Turning a customer\'s one-paragraph description into a design the customer can check on one page.',
    'Reviewing existing firmware: build the grid from the code and see which cells nobody decided.',
    'Writing the test list for a machine: each filled cell is a test, and so is each ignored one.',
    'Teaching: a nearly-finished description with holes is a good exercise in finding the missing events.'
  ],
  sources: [
    'David Harel, "Statecharts: a visual formalism for complex systems", Science of Computer Programming 8 (1987): reactive systems specified by states and events.',
    'Object Management Group, *Unified Modeling Language* specification: state machine diagrams as a way to specify behaviour.',
    'Miro Samek, *Practical UML Statecharts in C/C++* (2nd edition, 2008): from requirements to a state diagram for embedded programs.'
  ],
  sim: 'sm-requirements'
},

/* ================================================================ testing a state machine */
{
  id: 'testing-a-state-machine',
  parent: 'state-machines',
  title: 'Testing a state machine',
  level: 2,
  short: 'A machine is testable by listing: drive it with events and clock steps, and compare the states it visits with the states you expect — on the board, in the lab, and again after every bug report.',
  keywords: ['testing', 'unit test', 'test script', 'test vector', 'injected clock', 'fake time', 'boundary', 'transition coverage', 'regression test', 'ignored event', 'PASS FAIL', 'button machine', 'state machine lab'],
  prereq: ['state-machine-in-code', 'timeouts-and-timed-states'],
  related: ['unit-testing', 'hardware-in-the-loop', 'print-debugging-and-log-levels', 'from-requirements-to-states', 'debouncing'],
  body: `A state machine has an advantage few programs share: it can be tested *by listing*. The behaviour is a table, and a test is a list of rows — "in this state, this happens, so now I must be in that state". You can run the list without any hardware, as often as you like, and fix a bug in a minute.

### Make the machine testable

Two habits do it:

1. **Keep the machine pure.** It takes an event, or the current time, and decides the next state. It does not read pins, call \`millis()\` or print. Those belong to a thin layer around it: read the button → send an event; the state changed → switch the LED.
2. **Pass time in.** A machine that calls \`millis()\` is tested in real time, so a test of a thirty-second timeout takes thirty seconds. A machine that is *told* the time — \`update(now)\` — is tested in microseconds: "now is 29 999 ms… now is 30 000 ms".

### A test is a script

A list of steps; each either **sends an event** or **advances the clock**, and says what state is expected afterwards. For the button machine:

| Step | Expected state |
|---|---|
| (start) | RELEASED |
| DOWN | PRESSED |
| wait 999 ms | PRESSED |
| wait 1 ms | HELD |
| UP | RELEASED |
| DOWN, wait 300 ms, UP | RELEASED, and one click |

Notice the **boundary**: 999 ms and 1000 ms. Timing bugs live exactly there — a \`>\` where \`>=\` was meant. Test one tick before the limit and at the limit.

### What to test

- **Every transition once** (transition coverage): each arrow of the diagram has a step that takes it.
- **Every ignored event**: send each event in each state that does *not* list it and check that nothing changes. This catches the decisions that nobody wrote down.
- **Timeouts at the boundary**, and that leaving a state cancels its timeout.
- **Every field bug.** A report becomes one more test that reproduces it, so it can never come back (a regression test).

### On the board and in the lab

The program below keeps the machine apart from the pins and runs its tests at start-up, printing PASS or FAIL: useful on the real chip with the real compiler. In the [state-machine lab](#/tools/fsmlab) you can drive a machine with a list of events and timed steps and compare the states it visits with those you expected. For testing in general see [[unit-testing]]; to test the machine together with its wiring, [[hardware-in-the-loop]].

> [!key] Keep the machine free of pins and \`millis()\`, give it the time as a parameter, and test it with a script of events and clock steps: every transition, every ignored event, every timeout at its boundary.`,
  ideas: [
    'A machine\'s behaviour is a table, so a test is a list of rows: in this state, this happens, expect that state.',
    'Keep the machine free of pins and of reading the clock; pass the time in, so a 30 s timeout is tested in an instant.',
    'Test every transition, every ignored event, and every timeout one tick before and exactly at its limit.',
    'Every bug found in the field becomes another test, so that it cannot return.'
  ],
  pitfalls: [
    'I tested it by pressing the buttons for a while and it worked — Pressing visits the paths you think of. A script visits every arrow, and the boundaries and ignored events that hands never try.',
    'A timeout test must wait for the whole timeout — Only if the machine reads the clock itself. Give it the time as a parameter and the test says "now is 999" and "now is 1000" in microseconds.',
    'Events that are ignored need no tests — They are decisions, and they are where the surprises are: a press in the wrong state must change nothing, and only a test proves that it does not.'
  ],
  terms: [
    { term: 'Test script', also: ['test vector', 'test case'], def: 'A list of steps — send an event, or advance the clock — each with the state expected afterwards. Running it and comparing the states visited with those expected is the test.' },
    { term: 'Injected clock', also: ['fake clock', 'mock time'], def: 'Giving the machine the current time as a parameter instead of letting it read the real clock, so tests can set the time exactly and run in an instant.' },
    { term: 'Transition coverage', also: ['arrow coverage'], def: 'The share of the transitions of a machine that at least one test step takes. Full coverage means every arrow of the diagram has been tried.' },
    { term: 'Regression test', also: ['regression'], def: 'A test added after a bug is found, which reproduces the bug. It keeps the same bug from returning when the program is changed later.' }
  ],
  code: [
    {
      title: 'The button machine, tested on the board',
      about: 'The machine is a small object with no pins and no clock: `send` takes an event and the time, `update` takes the time. The tests run once at start-up and print PASS or FAIL for each step.',
      needs: 'Any ESP32 board and the serial monitor at 115200 baud: no other hardware.',
      blocks: `
        when started
          start serial at (115200) baud
          set [failures v] to (0)
          go to state [RELEASED v]
          // the test script: events, clock steps and what to expect after each
          expect state [RELEASED v] :: state
          send event [DOWN v] :: state
          expect state [PRESSED v] :: state
          advance the clock by (999) milliseconds :: state
          expect state [PRESSED v] :: state          // one millisecond short of the limit
          advance the clock by (1) milliseconds :: state
          expect state [HELD v] :: state
          send event [UP v] :: state
          expect state [RELEASED v] :: state
          send event [UP v] :: state                 // ignored in RELEASED
          expect state [RELEASED v] :: state
          print (join [failures: ] (failures))
      `,
      cpp: String.raw`
        enum State { RELEASED, PRESSED, HELD };
        enum Event { DOWN, UP };

        struct Button {                               // the machine: no pins, no millis(), no printing
          State state = RELEASED;
          uint32_t enteredAt = 0;
          int clicks = 0;

          void goTo(State next, uint32_t now) { state = next; enteredAt = now; }

          void send(Event ev, uint32_t now) {
            if (state == RELEASED && ev == DOWN) goTo(PRESSED, now);
            else if (state == PRESSED && ev == UP) { clicks++; goTo(RELEASED, now); }
            else if (state == HELD && ev == UP) goTo(RELEASED, now);
          }

          void update(uint32_t now) {                 // the clock is a parameter, not a call
            if (state == PRESSED && now - enteredAt >= 1000) goTo(HELD, now);
          }
        };

        int failures = 0;

        void expectState(const char *what, State got, State want) {
          Serial.printf("%s  %s\n", got == want ? "PASS" : "FAIL", what);
          if (got != want) failures++;
        }

        void runTests() {
          Button b;
          uint32_t now = 0;
          expectState("starts released", b.state, RELEASED);

          b.send(DOWN, now);          expectState("DOWN presses", b.state, PRESSED);
          now += 999; b.update(now);  expectState("999 ms: still pressed", b.state, PRESSED);
          now += 1;   b.update(now);  expectState("1000 ms: held", b.state, HELD);
          b.send(UP, now);            expectState("UP releases a held button", b.state, RELEASED);
          b.send(UP, now);            expectState("UP in RELEASED is ignored", b.state, RELEASED);

          b.send(DOWN, now);                                     // a short press is a click
          now += 300; b.update(now);
          b.send(UP, now);            expectState("a short press releases", b.state, RELEASED);
          if (b.clicks != 1) { Serial.println("FAIL  a short press is one click"); failures++; }

          b.send(DOWN, now);                                     // a bounce must not restart the hold time
          now += 300; b.update(now);
          b.send(DOWN, now);          expectState("a second DOWN is ignored", b.state, PRESSED);
          now += 700; b.update(now);  expectState("1000 ms after the first DOWN: held", b.state, HELD);
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);                                           // give the monitor time to open
          runTests();
          Serial.printf("%d failures\n", failures);
        }

        void loop() {}
      `,
      py: String.raw`
        import time

        RELEASED, PRESSED, HELD = "RELEASED", "PRESSED", "HELD"

        class Button:                                 # the machine: no pins, no ticks_ms(), no printing
            def __init__(self):
                self.state = RELEASED
                self.entered_at = 0
                self.clicks = 0

            def go_to(self, new_state, now):
                self.state = new_state
                self.entered_at = now

            def send(self, event, now):
                if self.state == RELEASED and event == "DOWN":
                    self.go_to(PRESSED, now)
                elif self.state == PRESSED and event == "UP":
                    self.clicks += 1
                    self.go_to(RELEASED, now)
                elif self.state == HELD and event == "UP":
                    self.go_to(RELEASED, now)

            def update(self, now):                    # the clock is a parameter, not a call
                if self.state == PRESSED and time.ticks_diff(now, self.entered_at) >= 1000:
                    self.go_to(HELD, now)

        failures = 0

        def expect_state(what, got, want):
            global failures
            print("PASS" if got == want else "FAIL", " ", what)
            if got != want:
                failures += 1

        def run_tests():
            global failures
            b = Button()
            now = 0
            expect_state("starts released", b.state, RELEASED)

            b.send("DOWN", now)
            expect_state("DOWN presses", b.state, PRESSED)
            now += 999
            b.update(now)
            expect_state("999 ms: still pressed", b.state, PRESSED)
            now += 1
            b.update(now)
            expect_state("1000 ms: held", b.state, HELD)
            b.send("UP", now)
            expect_state("UP releases a held button", b.state, RELEASED)
            b.send("UP", now)
            expect_state("UP in RELEASED is ignored", b.state, RELEASED)

            b.send("DOWN", now)                       # a short press is a click
            now += 300
            b.update(now)
            b.send("UP", now)
            expect_state("a short press releases", b.state, RELEASED)
            if b.clicks != 1:
                print("FAIL   a short press is one click")
                failures += 1

            b.send("DOWN", now)                       # a bounce must not restart the hold time
            now += 300
            b.update(now)
            b.send("DOWN", now)
            expect_state("a second DOWN is ignored", b.state, PRESSED)
            now += 700
            b.update(now)
            expect_state("1000 ms after the first DOWN: held", b.state, HELD)

        run_tests()
        print(failures, "failures")
      `,
      output: `
        PASS  starts released
        PASS  DOWN presses
        PASS  999 ms: still pressed
        PASS  1000 ms: held
        PASS  UP releases a held button
        PASS  UP in RELEASED is ignored
        PASS  a short press releases
        PASS  a second DOWN is ignored
        PASS  1000 ms after the first DOWN: held
        0 failures
      `,
      notes: ['The blocks use three blocks that exist only for tests: send an event, advance the clock, expect a state.', 'On a PC the same machine and script can be compiled and run in milliseconds, with no board at all; the board run then checks the real compiler and library.']
    }
  ],
  quiz: [
    { q: 'Why is a machine that calls `millis()` inside itself awkward to test?', choices: ['`millis()` is not available in tests', 'A timeout test must wait in real time, and the exact boundary cannot be reached', 'Machines cannot call functions', 'It makes the machine slower'], a: 1, why: 'The test cannot set the clock: a 30 s timeout takes 30 s, and stopping at 999 ms and then 1000 ms is a matter of luck. With the time passed in, both are exact.' },
    { q: 'The HELD timeout is 1000 ms. Which pair of steps tests its boundary best?', choices: ['500 ms and 1500 ms', '999 ms (still PRESSED), then 1 ms more (HELD)', '1 s and 2 s', 'Only 1000 ms'], a: 1, why: 'Off-by-one mistakes, > for >=, show only at the boundary: one tick before the limit the state must not have changed, and at the limit it must.' },
    { q: 'Testing that an event is ignored in a state is unnecessary, because nothing happens.', a: false, why: 'Ignoring is a decision, and a buggy machine may react when it should not. Only a test that sends the event and checks that the state is unchanged proves the decision holds.' },
    { q: 'A field report says: "if you press twice quickly the lamp stays on". What do you do first?', choices: ['Add a delay', 'Write a test that reproduces it, watch it fail, then fix the machine', 'Restart the board every night', 'Remove the button'], a: 1, why: 'A test that reproduces the report proves that you understood it, shows when it is fixed, and stays as a regression test.' }
  ],
  applications: [
    'Continuous testing of firmware on a PC, where the state machine is compiled without any hardware and tested in milliseconds.',
    'Regression suites that grow with every field bug of a product.',
    'Safety and certification work, where transition coverage of the safety machine must be shown.',
    'Teaching, where a failing test points a learner at the exact step that went wrong.'
  ],
  sources: [
    'James W. Grenning, *Test Driven Development for Embedded C* (Pragmatic Bookshelf, 2011): testing embedded code away from the target, and injected time.',
    'Espressif, *ESP-IDF Programming Guide*, "Unit Testing in ESP32" (the Unity test framework).',
    'Miro Samek, *Practical UML Statecharts in C/C++* (2nd edition, 2008): testing state machines with event sequences.'
  ],
  sim: 'sm-test-bench'
}
);
