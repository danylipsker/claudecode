/* HYPER-ESP32 · content/freertos-and-concurrency.js
 *
 * Topic "FreeRTOS: several things at once" (freertos-and-concurrency). Simulations: sims/freertos-and-concurrency.js (ids fr-…).
 *
 *   why-an-rtos                           the system under every sketch; what a scheduler buys and costs
 *   tasks                                 creating a task, its states, its stack, the shape of a task function
 *   priorities-and-scheduling             who runs when: priorities, pre-emption, time slicing, starvation, utilisation
 *   the-loop-task-and-two-cores           loop() is a task; core 0 and core 1; pinning
 *   delays-and-yielding                   delay() as a blocking call, the idle task, a steady period
 *   queues                                handing data from one task to another
 *   mutexes-and-semaphores                protecting a shared thing; priority inversion and inheritance
 *   task-notifications-and-event-groups   the light signal and the group of flags
 *   from-interrupt-to-task                an interrupt handler does the minimum and wakes a task
 *   race-conditions                       lost updates, critical sections, volatile is not a lock
 *   task-stacks                           how big, how to measure, what an overflow does
 *   software-timers                       callbacks on a schedule, from a task of their own
 *   asyncio-in-micropython                cooperative tasks, and the threads that exist but are rarely right
 */
Hyper.add(
/* ================================================================ why-an-rtos */
{
  id: 'why-an-rtos',
  parent: 'freertos-and-concurrency',
  title: 'Why there is an operating system inside',
  level: 1,
  short: 'Under every ESP32 sketch runs FreeRTOS: a scheduler that shares the processor between your loop() and the Wi-Fi, Bluetooth and timer code beside it. What it gives you, what it costs, and when one loop is still the better answer.',
  keywords: ['FreeRTOS', 'RTOS', 'operating system', 'scheduler', 'multitasking', 'concurrency', 'super loop', 'task', 'real time', 'loopTask', 'IDLE', 'tick', 'context switch', 'pcTaskGetName', 'xPortGetCoreID', 'uxTaskGetNumberOfTasks'],
  prereq: ['setup-loop-and-main', 'non-blocking-timing'],
  related: ['tasks', 'the-loop-task-and-two-cores', 'state-machines', 'cpu-cores-and-clocks', 'watchdogs'],
  body: `Open any Arduino sketch for the ESP32 and you see \`setup()\` and \`loop()\`: one program, one flow of control. Underneath, it is not alone. Before \`setup()\` runs, the chip has started **FreeRTOS**, a small real-time operating system, and your \`loop()\` is one of the things it runs. The Wi-Fi driver, the Bluetooth stack, the TCP/IP code, the timers and the event dispatcher run beside it, each as a **task** of its own. MicroPython sits on the same system: its interpreter is one task.

### What "operating system" means here

Nothing like a laptop's: no windows, no user accounts, no files you did not ask for. It is a **scheduler** and a few tools for tasks to talk to one another. A task is a function that runs as if it owned the processor, with a stack of its own. The scheduler gives the processor to one task at a time (one per core on a dual-core chip) and switches between them: when a task waits for something, when something more urgent wakes up, and at every **tick**, a clock pulse of 1 ms in the Arduino core.

### Why one loop is not enough

A device must read a sensor every 20 ms, keep a Wi-Fi link alive, answer web requests and flash an LED. One loop can juggle these with the clock-watching trick of [[non-blocking-timing]], and for small programs that is the right answer. But every job must now be short, because nothing else runs while one of them does, and the loop\'s worst-case time becomes everybody\'s delay. The Wi-Fi stack alone is far too large to wait for your \`delay(500)\`. With an RTOS each job is written as its own simple loop — even one that waits — and the scheduler makes sure the urgent ones are served first.

### What you can see of it

| Task | Made by | What it does |
|---|---|---|
| loopTask | the Arduino core | runs \`setup()\` once, then \`loop()\` for ever |
| IDLE0, IDLE1 | FreeRTOS | run when nothing else can; one per core |
| Tmr Svc | FreeRTOS | runs software timer callbacks ([[software-timers]]) |
| wifi, tiT, sys_evt | the Wi-Fi and network system | radio driver, TCP/IP stack, event dispatch |
| esp_timer, ipc0, ipc1 | ESP-IDF | high-resolution timers; calls from one core to the other |

The exact list depends on the chip, the core version and the libraries you have started. The program below prints what it can learn about its own surroundings.

### The price

Every task needs its own stack, hundreds to thousands of bytes of RAM ([[task-stacks]]). Each switch costs a few microseconds. And two tasks that touch the same data can interfere in ways a single loop never allows ([[race-conditions]]). Concurrency is a tool with a cost, not a goal: use it where jobs have different rhythms and different urgency, not to make a program look grand.

> [!key] Your sketch runs inside FreeRTOS: loop() is one task among several, and the scheduler shares the processor between them. Use several tasks when jobs differ in pace and urgency; keep one loop when they do not.`,
  ideas: [
    'FreeRTOS is already running when setup() starts: loop() is a task, and so are the Wi-Fi and timer services.',
    'The scheduler gives the processor to one task per core and switches when a task waits, when a more urgent task wakes, and at each tick.',
    'Several tasks let each job be a simple loop that may wait, at the price of RAM for stacks and the risk of interference.',
    'A single clock-watching loop is still the simplest design when the jobs are short and few.'
  ],
  pitfalls: [
    'An RTOS makes the program faster — It makes the processor shared, not larger. Total work is the same, plus the cost of switching; what improves is how soon the urgent job gets its turn.',
    'My sketch has no tasks because I never created one — At least a dozen exist before setup() runs, loop() among them. You are using FreeRTOS whether you call it or not.',
    'More tasks always mean a better design — Every task costs a stack and every shared variable is a chance for a bug. Use the fewest tasks that give each job its own rhythm.'
  ],
  terms: [
    { term: 'RTOS', also: ['real-time operating system'], def: 'A small operating system whose scheduler is built so that urgent work is served within a predictable time. It offers tasks, delays and ways for tasks to share data safely.' },
    { term: 'FreeRTOS', also: [], def: 'The open-source RTOS that ESP-IDF, the Arduino core for the ESP32 and MicroPython all run on. Espressif ships its own version with support for two cores.' },
    { term: 'Task', also: ['thread'], def: 'A function that the scheduler runs as if it had the processor to itself. It has its own stack, a priority and a state, and normally never returns.' },
    { term: 'Scheduler', also: ['kernel'], def: 'The part of the RTOS that decides which task runs next and switches the processor to it.' },
    { term: 'Tick', also: ['system tick', 'tick rate'], def: 'The regular clock pulse that lets the scheduler count time and choose again: 1 ms in the Arduino core, 10 ms by default in ESP-IDF.' },
    { term: 'Super loop', also: ['bare-metal loop', 'main loop'], def: 'A program without an operating system: one endless loop that calls every job in turn, so each job must be short.' }
  ],
  choose: {
    good: ['Jobs with very different rhythms: a 10 ms control loop beside a once-a-minute upload', 'Work that must wait for something (a network reply, a queue) without freezing the rest', 'Programs that use Wi-Fi or Bluetooth, which bring their own tasks anyway'],
    avoid: ['A tiny program with two or three short jobs: a clock-watching loop is simpler to read and to debug', 'Splitting a job into tasks only to feel professional: each split needs a queue or a lock', 'Tasks that share a lot of data without a plan for who owns it'],
    check: ['Which job is urgent and how late it may be', 'How much RAM the stacks will take on your chip', 'Who owns each piece of shared data']
  },
  code: [
    {
      title: 'What is running under your sketch',
      about: 'Prints the name of the task that runs `setup()` and `loop()`, its priority, the core it is on, the length of a tick and how many tasks exist.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          print (join [Task running the loop: ] (name of this task))
          print (join [Priority: ] (priority of this task))
          print (join [Core: ] (core number))
          print (join [Tasks in the system: ] (number of tasks))
          print (join [One tick in ms: ] (tick length))
      `,
      cpp: String.raw`
        void setup() {
          Serial.begin(115200);
          delay(1000);                                             // give the monitor time to open
          Serial.printf("Task running loop(): %s\n", pcTaskGetName(NULL));      // NULL means "this task"
          Serial.printf("Priority:            %u\n", (unsigned)uxTaskPriorityGet(NULL));
          Serial.printf("Core:                %d\n", xPortGetCoreID());
          Serial.printf("Tasks in the system: %u\n", (unsigned)uxTaskGetNumberOfTasks());
          Serial.printf("One tick:            %u ms\n", (unsigned)portTICK_PERIOD_MS);
        }

        void loop() {}
      `,
      na: { py: 'MicroPython runs your program inside one FreeRTOS task of its own and does not expose the system: there is no way to list tasks or ask for a core. _thread.get_ident() gives a thread number, which is not the same thing.' },
      output: `
        Task running loop(): loopTask
        Priority:            1
        Core:                1
        Tasks in the system: 7
        One tick:            1 ms
      `,
      notes: ['The core is 0 on a single-core chip (C3, C6, S2 …). The number of tasks varies with the chip, the core version and the libraries started; Wi-Fi adds several.', 'setup() runs in the same task as loop(): both are called by loopTask.']
    }
  ],
  examples: [
    {
      title: 'How late is "late"?',
      q: 'A single loop reads a sensor every 20 ms (taking 2 ms), but also answers a web request that can take 150 ms to build. What is the longest the sensor can be left unread?',
      steps: ['While the request is being built nothing else in the loop runs: 150 ms.', 'Add the 2 ms of the sensor read itself and the rest of that pass: the sensor is next read about 150 ms after it was due.', 'That is more than seven missed readings of a 20 ms rhythm.'],
      a: 'About 150 ms, so seven sensor readings are lost. With the sensor in its own higher-priority task, the scheduler would interrupt the web code every 20 ms for 2 ms and no reading would be missed.'
    }
  ],
  quiz: [
    { q: 'Which statement about a plain Arduino sketch on an ESP32 is true?', choices: ['It runs on bare metal, with no operating system', 'loop() is called from a FreeRTOS task named loopTask', 'FreeRTOS is started only if you include a library', 'Only the Wi-Fi code runs under FreeRTOS'], a: 1, why: 'The Arduino core starts FreeRTOS and creates a task, loopTask, which calls setup() once and loop() for ever. Wi-Fi, timers and idle tasks run beside it.' },
    { q: 'A program reads a sensor every 20 ms and also builds a web page that takes 150 ms. In a single loop, what happens to the sensor?', choices: ['Nothing, the processor is fast enough', 'Its readings are delayed or lost while the page is built', 'The chip switches to the other core automatically', 'The web code is pre-empted by the sensor'], a: 1, why: 'In one loop nothing pre-empts a long job. Tasks with priorities change that: the sensor task can interrupt the page builder.' },
    { q: 'Using an RTOS makes the total work the processor must do smaller.', a: false, why: 'The total work is the same, plus the small cost of switching. What an RTOS changes is the order: urgent jobs are served first and waiting jobs do not freeze the others.' },
    { q: 'Which is a good reason NOT to split a program into tasks?', choices: ['The jobs have different rhythms', 'There are only two short jobs and a clock-watching loop does them clearly', 'One job must wait for a network reply', 'The program uses Wi-Fi'], a: 1, why: 'Every task costs a stack and every shared variable is a risk. With a couple of short jobs, one loop is simpler and safer.' }
  ],
  applications: [
    'A weather station that samples sensors on a steady beat while a network task uploads in bursts.',
    'A motor controller whose 1 kHz control loop must never be held up by the display or the web interface.',
    'Any device with Wi-Fi: the radio stack itself is a set of tasks that your code lives beside.',
    'A data logger that writes to an SD card in its own task so that a slow write never delays a measurement.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "FreeRTOS Overview" and "FreeRTOS (IDF)": the version of FreeRTOS used on the ESP32 family.',
    'Arduino core for ESP32, the BasicMultiThreading example and the core\'s main file that starts the loop task (core 3.3).',
    'Richard Barry, *Mastering the FreeRTOS Real Time Kernel*, chapters on tasks and the scheduler.'
  ],
  sim: 'fr-timeline'
},

/* ================================================================ tasks */
{
  id: 'tasks',
  parent: 'freertos-and-concurrency',
  title: 'Tasks',
  level: 1,
  short: 'A task is a function that never returns, with a stack of its own and a priority. Creating one takes a single call; the habits that matter are to give it a way to wait and a stack big enough to live in.',
  keywords: ['task', 'xTaskCreate', 'xTaskCreatePinnedToCore', 'vTaskDelete', 'task handle', 'task states', 'running', 'ready', 'blocked', 'suspended', 'TaskHandle_t', 'create_task', 'app_main', 'stack depth', 'task function'],
  prereq: ['why-an-rtos', 'functions'],
  related: ['priorities-and-scheduling', 'task-stacks', 'delays-and-yielding', 'asyncio-in-micropython', 'state-machines'],
  body: `A task is an ordinary function with three special properties: it is started by the scheduler rather than called, it has its own stack, and it is not supposed to return. Written as an endless loop that waits for its next turn, it lets one job live as a simple piece of code of its own, without worrying about the others.

### Making one

In the Arduino core one call does it:

~~~cpp
xTaskCreate(function, "name", stackBytes, argument, priority, &handle);
~~~

- **function** has the form \`void f(void *arg)\`.
- **name** is a label that appears in debug output and in crash reports; up to 15 characters.
- **stackBytes** is the size of the task\'s stack **in bytes** on the ESP32. Plain FreeRTOS counts words; Espressif\'s version does not. 2048 to 4096 is typical; text formatting and the network need more ([[task-stacks]]).
- **argument** is one pointer handed to the function. It must still be valid when the task runs: a global or a constant, never a local variable of the function that created the task.
- **priority** is a number from 0 up; larger is more urgent ([[priorities-and-scheduling]]).
- **handle** (optional) lets you refer to the task later, to delete or notify it.

\`xTaskCreatePinnedToCore\` adds a last argument, the core to run on ([[the-loop-task-and-two-cores]]).

### The shape of a task function

~~~cpp
void job(void *arg) {
  // set up, once
  for (;;) {
    // do the work
    vTaskDelay(pdMS_TO_TICKS(100));    // wait: a delay, a queue, a notification - something that blocks
  }
}
~~~

The wait is not optional. A task that never waits keeps the processor to itself and starves everything of lower priority. And a task function that simply **returns** is an error on the ESP32: the system prints that the task should not return and stops. To finish a task on purpose, call \`vTaskDelete(NULL)\`.

### The four states

| State | Meaning |
|---|---|
| Running | has a core right now |
| Ready | could run, but a more urgent task has the core |
| Blocked | waiting for a delay to end, a queue, a notification or a lock; costs nothing |
| Suspended | taken out by \`vTaskSuspend\` until \`vTaskResume\` |

Most tasks spend nearly all their time blocked. That is the whole point: a blocked task uses no processor time, so ten tasks that each work 2 % of the time load the chip by about 20 %.

### What a task costs

A stack plus a few hundred bytes of bookkeeping. Three tasks with 4 KB stacks take about 12 KB, which is 3 % of an ESP32-C3\'s 400 KB of RAM — cheap on any chip, but not free on a small one.

> [!key] A task is a never-returning function with its own stack and priority, created with xTaskCreate. Give it a blocking wait, a stack in bytes that is big enough, and arguments that outlive the call.`,
  ideas: [
    'A task is a function with its own stack and priority that the scheduler starts and switches; it normally loops for ever.',
    'Every task must block somewhere (a delay, a queue, a notification); otherwise it starves the tasks below it.',
    'The stack size is given in bytes on the ESP32, and the argument pointer must stay valid after the creating function ends.',
    'A task is running, ready, blocked or suspended; a blocked task costs no processor time.'
  ],
  pitfalls: [
    'A task function can end with return, like any function — On the ESP32 the system reports that the task should not return and stops. Call vTaskDelete(NULL) to end a task.',
    'The stack depth is counted in words, as in the FreeRTOS book — On the ESP32 it is in bytes. A value copied from a book therefore gives a stack four times too small.',
    'I can pass the address of a local variable as the argument — By the time the task runs, the function that made the variable may have returned and the stack space been reused. Pass a global, a constant, or a heap object.'
  ],
  terms: [
    { term: 'Task function', also: ['task body', 'thread function'], def: 'The function a task runs. It receives one pointer argument and, on the ESP32, must not return: it loops for ever or deletes its own task.' },
    { term: 'Task handle', also: ['TaskHandle_t'], def: 'A value that names a task so that other code can notify, suspend, resume or delete it.' },
    { term: 'Blocked', also: ['waiting', 'sleeping'], def: 'The state of a task that is waiting for a delay to end or for an event. It uses no processor time and is not considered by the scheduler.' },
    { term: 'Ready', also: ['runnable'], def: 'The state of a task that could run but is waiting for the core because a more urgent task, or an equal one with the current slice, is running.' },
    { term: 'xTaskCreate', also: ['xTaskCreatePinnedToCore'], def: 'The FreeRTOS call that makes a task. The pinned version also fixes the core on which the task may run.' }
  ],
  code: [
    {
      title: 'Two jobs, two paces',
      about: 'A heartbeat LED that flips every half second and a report that prints every two seconds, each as a task of its own. `loop()` has nothing to do.',
      needs: 'An ESP32 DevKit with an LED on GPIO2, or any board with an LED you can name.',
      wiring: [['GPIO2', 'the on-board LED', 'or: GPIO2 → 220 Ω → LED → GND']],
      blocks: `
        when started
          set pin (2) as [output v]
          start task [blink v]
          start task [report v]

        define task blink
          forever
            toggle pin (2)
            wait (0.5) seconds
          end

        define task report
          forever
            print (join [up seconds: ] ((milliseconds since start) / (1000)))
            wait (2) seconds
          end
      `,
      cpp: String.raw`
        const int LED = 2;

        void blinkTask(void *arg) {                  // task 1: a heartbeat
          bool on = false;
          for (;;) {
            on = !on;
            digitalWrite(LED, on);
            vTaskDelay(pdMS_TO_TICKS(500));          // blocks: the processor is free meanwhile
          }
        }

        void reportTask(void *arg) {                 // task 2: a report every 2 s
          for (;;) {
            Serial.printf("up %lu s\n", (unsigned long)(millis() / 1000));
            vTaskDelay(pdMS_TO_TICKS(2000));
          }
        }

        void setup() {
          Serial.begin(115200);
          pinMode(LED, OUTPUT);
          //                 function    name      stack BYTES  argument  priority  handle
          xTaskCreate(blinkTask,  "blink",  2048,        nullptr,  1,        nullptr);
          xTaskCreate(reportTask, "report", 4096,        nullptr,  1,        nullptr);
        }

        void loop() {
          vTaskDelay(pdMS_TO_TICKS(1000));           // loop() is a task too, with nothing to do
        }
      `,
      py: String.raw`
        import asyncio
        import time
        from machine import Pin

        led = Pin(2, Pin.OUT)

        async def blink_task():                      # task 1: a heartbeat
            while True:
                led.toggle()
                await asyncio.sleep_ms(500)          # yields: other tasks run meanwhile

        async def report_task():                     # task 2: a report every 2 s
            while True:
                print("up", time.ticks_ms() // 1000, "s")
                await asyncio.sleep_ms(2000)

        async def main():
            asyncio.create_task(blink_task())
            asyncio.create_task(report_task())
            while True:
                await asyncio.sleep(1)               # main() is a task too, with nothing to do

        asyncio.run(main())
      `,
      idf: String.raw`
        #include <stdio.h>
        #include "freertos/FreeRTOS.h"
        #include "freertos/task.h"
        #include "driver/gpio.h"

        #define LED GPIO_NUM_2

        static void blink_task(void *arg) {
            gpio_reset_pin(LED);
            gpio_set_direction(LED, GPIO_MODE_OUTPUT);
            int on = 0;
            for (;;) {
                on = !on;
                gpio_set_level(LED, on);
                vTaskDelay(pdMS_TO_TICKS(500));
            }
        }

        static void report_task(void *arg) {
            for (;;) {
                printf("up %lu s\n", (unsigned long)(xTaskGetTickCount() * portTICK_PERIOD_MS / 1000));
                vTaskDelay(pdMS_TO_TICKS(2000));
            }
        }

        void app_main(void) {                        // app_main runs in a task of its own, the "main" task
            xTaskCreate(blink_task, "blink", 2048, NULL, 1, NULL);
            xTaskCreate(report_task, "report", 3072, NULL, 1, NULL);
        }
      `,
      output: `
        up 0 s
        up 2 s
        up 4 s
      `,
      notes: ['The MicroPython version uses asyncio tasks, which take turns instead of pre-empting one another: see [[asyncio-in-micropython]]. MicroPython also has `_thread`, which is rarely the better tool.', 'The ESP-IDF version has no `loop()`: `app_main` may return, and the tasks it created go on living.', 'On boards whose LED is an RGB LED (S3, C3, C6 DevKits) use `rgbLedWrite` or a different pin.']
    }
  ],
  examples: [
    {
      title: 'What do five tasks cost?',
      q: 'A sketch on an ESP32-C3 (400 KB of RAM) creates five tasks with 4096-byte stacks. How much RAM do the stacks take, and what share of the chip is that?',
      steps: ['Five stacks of 4096 bytes: $5 \\times 4096 = 20\\,480$ bytes, about 20 KB.', 'The chip has 400 KB: $20 / 400 = 5\\,\\%$.', 'The bookkeeping of each task adds a few hundred bytes, which changes nothing at this scale.'],
      a: 'About 20 KB, or 5 % of the RAM. Affordable, but the stack sizes are the first thing to trim if memory runs short — after measuring how much each really uses.'
    }
  ],
  quiz: [
    { q: 'What happens on the ESP32 if a task function reaches its closing brace and returns?', choices: ['The task restarts from the top', 'The system reports that the task should not return and stops', 'Nothing: the task is quietly deleted', 'The loop() function takes over'], a: 1, why: 'On the ESP32 a task function must never return. End a task deliberately with vTaskDelete(NULL).' },
    { q: 'xTaskCreate(job, "job", 2048, NULL, 1, NULL) on the ESP32 gives the task a stack of how much?', choices: ['2048 words', '2048 bytes', '2048 kilobytes', '2048 bytes per core'], a: 1, why: 'Espressif\'s FreeRTOS takes the stack depth in bytes, unlike the FreeRTOS book, which counts words.' },
    { q: 'A task that is blocked in vTaskDelay uses processor time while it waits.', a: false, why: 'A blocked task is not considered by the scheduler at all. It costs only its stack and bookkeeping until the delay ends.' },
    { q: 'Why is passing &counter as the task argument dangerous when counter is a local variable of setup()?', choices: ['Pointers cannot be passed to tasks', 'setup() may return before the task reads it, and the stack space is reused', 'Tasks cannot read integers', 'The compiler forbids it'], a: 1, why: 'The pointer outlives the variable. Use a global, a static, a constant or heap memory.' }
  ],
  applications: [
    'A sensor task, a network task and a display task, each a short loop with its own delay.',
    'A one-off task that connects to Wi-Fi, uploads a file and then ends itself with vTaskDelete.',
    'A watchdog-feeding supervisor task that checks that the others are alive.',
    'A background task that blinks a status LED so that the main work can block for seconds.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "FreeRTOS (IDF)": task creation, the stack size in bytes and the pinned variants.',
    'Arduino core for ESP32, the BasicMultiThreading example (core 3.3).',
    'Richard Barry, *Mastering the FreeRTOS Real Time Kernel*, "Task management".'
  ],
  sim: 'fr-timeline'
},

/* ================================================================ priorities-and-scheduling */
{
  id: 'priorities-and-scheduling',
  parent: 'freertos-and-concurrency',
  title: 'Priorities and the scheduler',
  level: 2,
  short: 'The scheduler always runs the most urgent task that is ready, shares the processor in slices between equals, and interrupts a task the instant something more urgent wakes. The same rule that makes the system responsive lets a greedy task starve the rest.',
  keywords: ['priority', 'scheduler', 'pre-emption', 'preemptive', 'time slicing', 'round robin', 'starvation', 'utilisation', 'rate monotonic', 'deadline', 'latency', 'configMAX_PRIORITIES', 'uxTaskPriorityGet', 'vTaskPrioritySet', 'jitter'],
  prereq: ['tasks', 'why-an-rtos'],
  related: ['delays-and-yielding', 'mutexes-and-semaphores', 'the-loop-task-and-two-cores', 'watchdogs', 'sample-time-and-jitter'],
  body: `Give a scheduler several tasks and one rule decides almost everything: **the ready task with the highest priority runs.** If two ready tasks share the top priority, they take turns. And the moment a task of higher priority becomes ready — its delay ends, a message arrives, an interrupt hands it work — the running task is pushed aside, at once, wherever it was. This is **pre-emptive, fixed-priority scheduling**. The simulation below draws it as a time line, one millisecond to a column.

### The three rules

1. **Highest priority wins.** Priorities run from 0 (the idle task) upwards; on the ESP32 the top of the scale is 24. Your tasks live low on it: the loop task is at 1, and the Wi-Fi and system tasks sit far higher, so the radio gets served first.
2. **Equals take turns.** Tasks of the same priority are given the core in slices of one tick each ("time slicing"), going round in order. Three busy tasks at priority 1 each get a third.
3. **Pre-emption is immediate.** A higher-priority task does not wait for the current slice to end.

Priority means **urgency**, not importance. A task that must react within a millisecond gets a high number *because it works for a moment and then sleeps*. Raising the priority of a task that works all the time only moves the pain: everything below it starves.

### Starvation

A high-priority task that never blocks owns the core for ever. Everything beneath it — including the idle task, which must run now and then to tidy up and to feed the watchdog — starves, and the task watchdog eventually resets the chip ([[watchdogs]]). The cure is the rule from [[tasks]]: every task blocks somewhere, and the busiest tasks sit lowest.

### Will it all fit? Utilisation

A periodic task that runs for $C$ milliseconds every $T$ milliseconds uses the fraction $C/T$ of a core. Add them up: the **utilisation** $U$. Above 1 the work cannot be done at all. Below 1 it can, if priorities are chosen well: give the **shortest period the highest priority** (the "rate-monotonic" rule). For that rule, three tasks are certain to meet every deadline when $U \\le 3(2^{1/3} - 1) \\approx 0.78$; above that they may still fit, but only a closer look can tell.

### What to watch

- **Latency** of the urgent task is its wait for the core: nearly zero, but not zero — a switch takes microseconds, and the tick is 1 ms in the Arduino core.
- **Jitter**: how much that wait varies. Tasks that print, allocate memory or take locks make it worse.
- Keep your own priorities between about 1 and 5 unless there is a reason; leave the very high ones to the system.

> [!key] The scheduler runs the highest-priority ready task, interrupts it the instant a more urgent one wakes, and slices time between equals. Give high priority to short, urgent work that then blocks, and never let a task that works all the time outrank the rest.`,
  ideas: [
    'The highest-priority ready task runs; equal priorities share the core in 1-tick slices; a more urgent task pre-empts immediately.',
    'Priority is urgency, not importance: it belongs to short jobs that must react quickly and then block.',
    'A high-priority task that never blocks starves every task below it and trips the watchdog.',
    'Utilisation $U = \\sum C/T$ must stay below 1; with the shortest period at the highest priority, three tasks are safe up to about 78 %.'
  ],
  pitfalls: [
    'Important jobs should get high priority — Priority orders urgency. A heavy task at high priority starves the rest; a short, urgent task at high priority costs almost nothing.',
    'Two tasks of equal priority run one after the other until each is finished — They take turns every tick, so both progress together. To run one first, give it a higher priority.',
    'If utilisation is under 100 %, every deadline is met — Only if the priorities fit: a long low-priority job can still make a short urgent one late if the urgent one has the wrong priority or shares a lock with it.'
  ],
  terms: [
    { term: 'Pre-emption', also: ['preemptive scheduling'], def: 'Taking the processor from a running task as soon as a more urgent task is ready, without waiting for it to finish or to wait.' },
    { term: 'Time slicing', also: ['round robin'], def: 'Sharing the core between ready tasks of equal priority by giving each one tick in turn.' },
    { term: 'Starvation', also: ['CPU starvation'], def: 'A task never getting the processor because tasks of higher priority are always ready.' },
    { term: 'Utilisation', also: ['CPU load', 'processor utilisation'], def: 'The fraction of the processor a periodic task needs: its run time divided by its period. The sum over all tasks must be below 1.' },
    { term: 'Rate-monotonic priorities', also: ['RMS'], def: 'The rule of giving the highest priority to the task with the shortest period. It is the best fixed-priority assignment for periodic tasks.' },
    { term: 'Jitter', also: ['latency variation'], def: 'The variation in how long a task waits between becoming ready and starting to run.' }
  ],
  choose: {
    good: ['Short, urgent jobs (reading a fast sensor, feeding a control loop) at a higher number than the rest', 'Long, patient jobs (uploads, logging) at the lowest number that suits you', 'Equal priorities for jobs of equal urgency, so that slicing shares the core fairly'],
    avoid: ['A priority above the system tasks (about 20 and up) for your own code', 'A high priority for a task that computes all the time', 'Priorities used as a substitute for a lock'],
    check: ['What happens to the idle task and the watchdog if your busiest task runs flat out', 'The utilisation sum with realistic worst-case run times', 'Which tasks share locks with each other']
  },
  formulas: [
    {
      name: 'Utilisation of three periodic tasks',
      expr: 'U = c1/t1 + c2/t2 + c3/t3',
      tex: 'U = \\frac{c_1}{t_1} + \\frac{c_2}{t_2} + \\frac{c_3}{t_3}',
      vars: {
        U: { name: 'utilisation', q: 'ratio' },
        c1: { name: 'run time of task 1', q: 'time', unit: 'ms', value: 4 },
        t1: { name: 'period of task 1', q: 'time', unit: 'ms', value: 20 },
        c2: { name: 'run time of task 2', q: 'time', unit: 'ms', value: 15 },
        t2: { name: 'period of task 2', q: 'time', unit: 'ms', value: 50 },
        c3: { name: 'run time of task 3', q: 'time', unit: 'ms', value: 30 },
        t3: { name: 'period of task 3', q: 'time', unit: 'ms', value: 100 }
      },
      solveFor: 'U',
      note: 'U above 1 means the work cannot be done; below 0.78 three rate-monotonic tasks are certain to meet their deadlines.'
    }
  ],
  code: [
    {
      title: 'A burst of high-priority work',
      about: 'A low-priority task ticks every 100 ms and reports how long it was since its last tick. Every two seconds a high-priority task keeps the core busy for 600 ms: the low task cannot run until it is done, and the gap shows in the report.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud. Both tasks share core 0, which every chip has.',
      blocks: `
        when started
          start serial at (115200) baud
          start task [low v] with priority (1)
          start task [high v] with priority (3)

        define task low
          set [last v] to (milliseconds since start)
          forever
            wait (0.1) seconds
            print (join [low tick, ms since the last: ] ((milliseconds since start) - (last)))
            set [last v] to (milliseconds since start)
          end

        define task high
          forever
            wait (2) seconds
            print [HIGH starts a 600 ms burst]
            set [t0 v] to (milliseconds since start)
            repeat until <((milliseconds since start) - (t0)) ≥ (600)>
              // busy: this never waits, so nothing of lower priority can run
            end
            print [HIGH done]
          end
      `,
      cpp: String.raw`
        void lowTask(void *arg) {
          uint32_t last = millis();
          for (;;) {
            vTaskDelay(pdMS_TO_TICKS(100));
            uint32_t now = millis();
            Serial.printf("low  tick, ms since the last: %lu\n", (unsigned long)(now - last));
            last = now;
          }
        }

        void highTask(void *arg) {
          for (;;) {
            vTaskDelay(pdMS_TO_TICKS(2000));
            Serial.println("HIGH starts a 600 ms burst");
            uint32_t t0 = millis();
            while (millis() - t0 < 600) { }          // busy: this never waits, so nothing of lower priority can run
            Serial.println("HIGH done");
          }
        }

        void setup() {
          Serial.begin(115200);
          xTaskCreatePinnedToCore(lowTask,  "low",  4096, nullptr, 1, nullptr, 0);   // same core ...
          xTaskCreatePinnedToCore(highTask, "high", 4096, nullptr, 3, nullptr, 0);   // ... higher priority
        }

        void loop() {
          vTaskDelay(pdMS_TO_TICKS(1000));
        }
      `,
      na: { py: 'MicroPython has no task priorities and its asyncio tasks never pre-empt one another: a coroutine that busy-waits for 600 ms simply holds up every other coroutine, whatever its importance. See the asyncio page.' },
      output: `
        low  tick, ms since the last: 100
        low  tick, ms since the last: 100
        HIGH starts a 600 ms burst
        HIGH done
        low  tick, ms since the last: 680
        low  tick, ms since the last: 100
      `,
      notes: ['The long gap is the burst plus whatever was left of the low task\'s delay: it could not run while the high task held the core.', 'On a dual-core chip put the two tasks on different cores and the gap disappears: each has a core to itself.', 'A burst this long is safe. One that lasted several seconds would starve the idle task and trigger the task watchdog.']
    }
  ],
  examples: [
    {
      title: 'Does the schedule fit?',
      q: 'Three periodic tasks: a sensor task needing 4 ms every 20 ms, a display task needing 15 ms every 50 ms and a logger needing 30 ms every 100 ms. Is the load acceptable, and in what priority order?',
      steps: ['Utilisation: $4/20 + 15/50 + 30/100 = 0.20 + 0.30 + 0.30 = 0.80$.', 'That is below 1, so the work fits in principle, but above the 0.78 guarantee for three rate-monotonic tasks, so check the worst case closely.', 'Shortest period first: sensor (20 ms) highest, display (50 ms) next, logger (100 ms) lowest.'],
      a: 'U = 0.80, so it fits with 20 % to spare, with priorities sensor > display > logger. Because 0.80 is just over the 0.78 guarantee, simulate or measure before relying on it.'
    }
  ],
  quiz: [
    { q: 'Task A (priority 2) and task B (priority 2) are both ready and neither ever blocks. What happens?', choices: ['A runs for ever; B never runs', 'They take turns, one tick each', 'B pre-empts A at once', 'The scheduler raises the priority of one'], a: 1, why: 'Equal priorities are time-sliced: each gets the core for a tick in turn. Only a higher priority would shut one out.' },
    { q: 'A task at priority 5 loops for ever without waiting. What is the likely outcome for a priority-1 task on the same core?', choices: ['It runs as normal', 'It runs at half speed', 'It starves; eventually the task watchdog resets the chip', 'It moves to the other core'], a: 2, why: 'A task that never blocks keeps the core for itself. Lower tasks, including the idle task that feeds the watchdog, never run.' },
    { q: 'Which task should get the highest priority under the rate-monotonic rule?', choices: ['The most important one', 'The one with the longest run time', 'The one with the shortest period', 'The one created first'], a: 2, why: 'The shortest period means the tightest deadline; giving it the top priority is the best fixed-priority assignment for periodic tasks.' },
    { q: 'Two tasks need 6 ms every 10 ms and 5 ms every 10 ms. Can one core run them?', choices: ['Yes, at 100 % load', 'Yes, with the right priorities', 'No: the utilisation is 1.1', 'Only on a dual-core chip with pinning'], a: 2, why: '6/10 + 5/10 = 1.1: more than a core can give, whatever the priorities. A second core or less work is needed.' }
  ],
  applications: [
    'A control loop at priority 3 that runs for 1 ms every 10 ms, above a logger at priority 1 that is allowed to be late.',
    'Audio playback, which tolerates no gaps, kept above the display task that may drop a frame.',
    'Finding why a button feels sluggish: a task that works too long above the one that reads it.',
    'Tuning a Wi-Fi gateway so that radio and network services, which run at high priority, are not starved by your own code.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "FreeRTOS (IDF)": priorities, time slicing and the SMP scheduler.',
    'C. L. Liu and J. W. Layland, "Scheduling Algorithms for Multiprogramming in a Hard-Real-Time Environment", Journal of the ACM, 1973 (the utilisation bound).',
    'Richard Barry, *Mastering the FreeRTOS Real Time Kernel*, "Task management: scheduling".'
  ],
  sim: { id: 'fr-timeline', params: { scenario: 'priorities' } }
},

/* ================================================================ the-loop-task-and-two-cores */
{
  id: 'the-loop-task-and-two-cores',
  parent: 'freertos-and-concurrency',
  title: 'The loop task and the two cores',
  level: 2,
  short: 'loop() is a task of priority 1 with an 8 KB stack, pinned to core 1; the radio lives on core 0. Where each task runs matters on a dual-core chip, and does not exist on the single-core ones.',
  keywords: ['loopTask', 'core 0', 'core 1', 'PRO_CPU', 'APP_CPU', 'ARDUINO_RUNNING_CORE', 'xTaskCreatePinnedToCore', 'tskNO_AFFINITY', 'xPortGetCoreID', 'SET_LOOP_TASK_STACK_SIZE', 'dual core', 'single core', 'affinity', 'pinning', 'Arduino Runs On', 'Events Run On'],
  prereq: ['tasks', 'cpu-cores-and-clocks'],
  related: ['priorities-and-scheduling', 'race-conditions', 'task-stacks', 'the-shared-radio', 'wifi-basics'],
  body: `The Arduino core does not call \`loop()\` from nowhere. At start-up it creates one FreeRTOS task, **loopTask**, whose function runs \`setup()\` once and then calls \`loop()\` over and over. That task has priority 1, a stack of 8192 bytes, and, on a dual-core chip, is pinned to **core 1** — the "Arduino Runs On" setting in the board menu. A macro at the top of a sketch, \`SET_LOOP_TASK_STACK_SIZE(16 * 1024);\`, makes the stack larger when the sketch needs it.

### Two cores

The two cores of the ESP32 and ESP32-S3 are equals in what they can do and share all the memory and peripherals. By convention core 0 is the **protocol core**, where Wi-Fi, Bluetooth and the system tasks run, and core 1 the **application core**, where your sketch lives. The result: your \`loop()\` can be busy for a long time without holding up the radio, which is one reason the ESP32 can keep a connection alive while a sketch computes.

| Cores | Chips (from the chip catalogue) |
|---|---|
| 2 | ESP32 (240 MHz), ESP32-S3 (240 MHz), ESP32-P4 (400 MHz), ESP32-S31 (320 MHz, preview software), ESP32-H4 (96 MHz, sampling) |
| 1 | ESP32-S2, ESP32-C2, ESP32-C3, ESP32-C5, ESP32-C6, ESP32-C61, ESP32-H2, ESP32-H21 |

On a single-core chip everything — loop, Wi-Fi, timers — shares one core, and the scheduler interleaves them. The same program works, and a long \`loop()\` now genuinely competes with the radio.

### Pinning

\`xTaskCreatePinnedToCore(…, core)\` fixes the core a task may run on; plain \`xTaskCreate\` leaves the choice to the scheduler (it may even move the task). Good reasons to pin:

- keep heavy work (filtering, drawing, audio) on core 1 and leave core 0 to the radio, or the other way round if \`loop()\` is the busy one;
- keep two tasks that share data on the **same** core, where they can never run at the same instant;
- keep a time-critical task away from a core crowded with others.

On a single-core chip the core number must be 0. Sketches meant for any chip choose it with \`#if CONFIG_FREERTOS_UNICORE\`, as the program below does.

### The traps

- **A second core is not twice the speed.** It helps only if the work can be split, and the cores contend for the same memory and for the same locks.
- **Real parallelism brings real races.** With both tasks on one core a task is switched out only at certain points; on two cores two tasks can touch a variable at the very same moment ([[race-conditions]]).
- **Do not run Wi-Fi-heavy work on core 0 at high priority.** It competes with the stack that serves your own connection.

> [!key] loop() is a priority-1 task with an 8 KB stack, on core 1 of a dual-core chip, while Wi-Fi and Bluetooth run on core 0. Pin tasks deliberately, and remember that single-core chips have only core 0.`,
  ideas: [
    'loopTask runs setup() once and loop() for ever, at priority 1, with an 8192-byte stack, on core 1 of a dual-core chip.',
    'Core 0 normally carries the radio and system tasks; core 1 carries your sketch.',
    'xTaskCreatePinnedToCore fixes the core of a task; on a single-core chip the core must be 0.',
    'Two tasks on two cores really run at the same time, which is why shared data needs protection.'
  ],
  pitfalls: [
    'A dual-core chip runs my sketch twice as fast — loop() uses one core. The second core is yours only if you give it a task, and the work must be splittable.',
    'Pinned to core 1 works on every ESP32 — On a single-core chip (C3, C6, S2 …) core 1 does not exist: use 0, or choose it with CONFIG_FREERTOS_UNICORE.',
    'Tasks on the same core cannot interfere with one another — They are switched at any tick, or any wake-up, so a variable can be half-updated when a switch happens. Same core makes races rarer, not impossible.'
  ],
  terms: [
    { term: 'loopTask', also: ['Arduino loop task'], def: 'The FreeRTOS task the Arduino core creates to run setup() once and loop() for ever. Priority 1, 8192-byte stack, core 1 on a dual-core chip.' },
    { term: 'Core affinity', also: ['pinning', 'tskNO_AFFINITY'], def: 'The core a task is allowed to run on. A pinned task stays on its core; an unpinned task (tskNO_AFFINITY) may run on either.' },
    { term: 'PRO_CPU', also: ['core 0', 'protocol CPU'], def: 'Core 0 of a dual-core ESP32, where the radio and system tasks run by convention.' },
    { term: 'APP_CPU', also: ['core 1', 'application CPU'], def: 'Core 1 of a dual-core ESP32, where the Arduino sketch runs by default.' },
    { term: 'SMP', also: ['symmetric multiprocessing'], def: 'A design where several identical cores run the same operating system and share memory. The ESP32\'s FreeRTOS is an SMP system.' }
  ],
  choose: {
    good: ['Heavy, steady work (audio, filtering, drawing) given its own task on the core the sketch does not use', 'Tasks that share data pinned to one core, so they never run at the same instant', 'Time-critical tasks kept away from a core crowded with others'],
    avoid: ['Pinning only to copy an example: an unpinned task lets the scheduler balance the cores', 'Moving blocking, waiting work to another core: it gains nothing, a delay costs no processor time', 'Assuming core 1 exists on the C-series, S2 and H-series chips'],
    check: ['The core count of your chip in the chip explorer', 'Which core the radio tasks use on your build', 'That shared data is protected as soon as two cores can touch it']
  },
  code: [
    {
      title: 'Which core runs what',
      about: 'Two tasks pinned to core 0 and core 1 (both to core 0 on a single-core chip) and `loop()` itself each print the core they are on, once a second.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          start task [worker A v] on core (0)
          start task [worker B v] on core (1)    // core 0 on a single-core chip
          forever
            print (join [loop runs on core ] (core number))
            wait (1) seconds
          end

        define task worker
          forever
            print (join [this task runs on core ] (core number))
            wait (1) seconds
          end
      `,
      cpp: String.raw`
        #if CONFIG_FREERTOS_UNICORE
          const BaseType_t CORE_B = 0;               // one core only: both tasks live there
        #else
          const BaseType_t CORE_B = 1;
        #endif

        void worker(void *arg) {
          const char *name = (const char *)arg;      // a string constant lives for ever: the pointer stays valid
          for (;;) {
            Serial.printf("%s runs on core %d\n", name, xPortGetCoreID());
            vTaskDelay(pdMS_TO_TICKS(1000));
          }
        }

        void setup() {
          Serial.begin(115200);
          xTaskCreatePinnedToCore(worker, "A", 4096, (void *)"task A", 1, nullptr, 0);
          xTaskCreatePinnedToCore(worker, "B", 4096, (void *)"task B", 1, nullptr, CORE_B);
        }

        void loop() {
          Serial.printf("loop runs on core %d\n", xPortGetCoreID());
          delay(1000);
        }
      `,
      na: { py: 'MicroPython runs the interpreter in one FreeRTOS task, pinned to one core (core 1 on dual-core chips), and its _thread threads share that core; a program cannot choose or ask for a core.' },
      output: `
        task A runs on core 0
        task B runs on core 1
        loop runs on core 1
      `,
      notes: ['On an ESP32-C3, C6 or S2 every line says core 0.', 'Change "Arduino Runs On" in the board menu (dual-core chips) to move loop() to core 0 and see the line change.', 'The three tasks print in no fixed order: they run at the same time on different cores.']
    }
  ],
  examples: [
    {
      title: 'Where do I put the display drawing?',
      q: 'On an ESP32 a sketch uses Wi-Fi, reads sensors in loop() and redraws a TFT display, which takes 40 ms each frame. The sensors are read every 10 ms. Where should the drawing go?',
      steps: ['Drawing in loop() would hold up the 10 ms sensor reading for 40 ms at a time.', 'Core 0 has the radio; piling a heavy task on it risks connection hiccups.', 'Put drawing in its own task at a lower priority than the sensor work. The scheduler lets the sensor interrupt the drawing whenever it is due.'],
      a: 'A separate drawing task, at lower priority than the sensor reading; pinned to core 1 with it, or to core 0 if core 1 is the busy one. Either way the sensor keeps its 10 ms beat.'
    }
  ],
  quiz: [
    { q: 'On a dual-core ESP32, on which core does the Arduino loop() normally run?', choices: ['Core 0, with the radio', 'Core 1', 'Alternately on each core', 'Whichever is idle'], a: 1, why: 'The "Arduino Runs On" setting defaults to core 1, leaving core 0 for Wi-Fi, Bluetooth and the system tasks.' },
    { q: 'An ESP32-C3 sketch calls xTaskCreatePinnedToCore(..., 1). What is the problem?', choices: ['Nothing, core 1 is shared', 'The C3 has only core 0, so core 1 is invalid', 'The stack is too small', 'The priority is too low'], a: 1, why: 'Single-core chips have only core 0. Use 0, plain xTaskCreate, or choose with CONFIG_FREERTOS_UNICORE.' },
    { q: 'Two tasks pinned to the same core can never run at the same instant.', a: true, why: 'One core runs one task at a time. That makes some races rarer, but a switch can still happen between any two instructions, so shared data still needs protection.' },
    { q: 'What is the default stack size of loopTask, and how can it be changed?', choices: ['2048 bytes; in the partition table', '8192 bytes; with SET_LOOP_TASK_STACK_SIZE', '8192 words; by editing the core', '16 KB; it cannot be changed'], a: 1, why: 'loopTask has 8192 bytes unless the sketch uses SET_LOOP_TASK_STACK_SIZE(size) at file scope.' }
  ],
  applications: [
    'An audio player that decodes on one core while Wi-Fi streaming runs on the other.',
    'A sketch that moves a slow display refresh into its own task, so loop() stays quick.',
    'A dual-core ESP32 data logger that samples at a steady rate on core 1 and uploads on core 0.',
    'Porting a dual-core sketch to a single-core C3 or C6 and finding it still works, because the scheduler interleaves what the second core did.'
  ],
  sources: [
    'Arduino core for ESP32, the core\'s main file (loopTask) and the ArduinoStackSize and BasicMultiThreading examples (core 3.3).',
    'Espressif, *ESP-IDF Programming Guide*, "FreeRTOS (IDF)": SMP scheduling, task affinity and the unicore option.',
    'Espressif, *ESP32 Technical Reference Manual*, the CPU chapter (two identical cores).'
  ],
  sim: 'fr-cores'
},

/* ================================================================ delays-and-yielding */
{
  id: 'delays-and-yielding',
  parent: 'freertos-and-concurrency',
  title: 'Delays, yielding and the idle task',
  level: 1,
  short: 'delay() does not freeze the chip: it parks the calling task and hands the core to the others. Knowing what a wait really does — blocking, spinning, yielding — and how to keep a steady beat, is the basis of every well-behaved task.',
  keywords: ['delay', 'vTaskDelay', 'xTaskDelayUntil', 'vTaskDelayUntil', 'delayMicroseconds', 'yield', 'taskYIELD', 'idle task', 'busy wait', 'spinning', 'blocking', 'pdMS_TO_TICKS', 'tick', 'drift', 'steady period', 'sleep_ms', 'task watchdog'],
  prereq: ['tasks', 'non-blocking-timing'],
  related: ['priorities-and-scheduling', 'watchdogs', 'light-sleep-and-automatic-power-management', 'sample-time-and-jitter', 'asyncio-in-micropython'],
  body: `On a plain microcontroller \`delay(500)\` means "burn half a second doing nothing". On the ESP32 it means something kinder. \`delay\` in the Arduino core is a call to \`vTaskDelay\`: the calling task goes to the **blocked** state, and for half a second the scheduler gives the core to anyone who wants it — the Wi-Fi stack, a higher-priority task, or, if nobody does, the **idle task**. The chip is not frozen. Only the flow of *that* task is held, which is why the reference page said "this program does nothing else": it speaks of the loop, not the chip.

### Ways to wait

| Call | What happens | Others run? | Use it for |
|---|---|---|---|
| \`delay(ms)\`, \`vTaskDelay(ticks)\` | the task blocks | yes, all of them | any wait of a millisecond or more |
| \`xTaskDelayUntil(&last, ticks)\` | blocks until a fixed mark in time | yes | a steady beat (below) |
| \`delayMicroseconds(us)\` | the core spins in a loop | only by pre-emption | waits of microseconds, such as a sensor\'s timing |
| \`while (millis() - t < n) {}\` | the core spins | only by pre-emption | almost never |
| \`taskYIELD()\`, \`yield()\` | gives up the rest of the slice | tasks of equal priority only | rare |

A **spinning** wait keeps its task ready, so it uses the core all the time and starves tasks of lower priority, however innocent it looks. A **blocking** wait costs nothing. Whenever you can choose, block.

### The idle task

When every task is blocked, each core runs its **idle task**, priority 0. It frees the memory of tasks that have been deleted and lets the core rest until the next interrupt instead of spinning. It also feeds the **task watchdog**: if a task hogs a core so long that idle never runs, the watchdog assumes the program is stuck and resets the chip ([[watchdogs]]). A healthy program spends most of its time in idle. That is a sign of good design, not of waste.

### Ticks, and what a delay really lasts

Delays are counted in ticks: 1 ms in the Arduino core, **10 ms by default in ESP-IDF**. \`pdMS_TO_TICKS(5)\` is 5 ticks in Arduino and **0** in a default ESP-IDF build, where \`vTaskDelay(0)\` is merely a yield. A delay lasts *at least* the time asked and up to a tick more, because you start part-way through a tick.

### A steady beat

\`vTaskDelay(100)\` after 7 ms of work gives a 107 ms period, and the error grows with the work. \`xTaskDelayUntil\` remembers the **previous wake-up time** and sleeps until the next mark, so the period stays 100 ms however long the work takes (as long as it is shorter than the period).

> [!key] delay() blocks only the calling task, so the rest of the chip keeps running and the idle task gets the spare time. Block rather than spin, remember that a tick is 1 ms in Arduino and 10 ms in a default ESP-IDF build, and use xTaskDelayUntil for a steady beat.`,
  ideas: [
    'delay() parks the calling task and lets every other task and the idle task use the core.',
    'A spinning wait stays ready and starves lower priorities; a blocking wait costs nothing.',
    'The idle task runs when all else is blocked, tidies memory and feeds the task watchdog; it must get the core now and then.',
    'xTaskDelayUntil keeps a fixed period; vTaskDelay after work gives period plus work.'
  ],
  pitfalls: [
    'delay() stops the whole chip — It stops only the calling task. Wi-Fi, other tasks and the idle task go on running; the problem is only that this task cannot react while it waits.',
    'vTaskDelay(pdMS_TO_TICKS(5)) always waits 5 ms — With a 10 ms tick the result is 0 ticks and the call returns at once. Check the tick rate of your build.',
    'A while loop that waits for millis() is just a delay written longer — It is worse: it never blocks, so it uses the core for the whole wait and holds back every task of lower priority.'
  ],
  terms: [
    { term: 'Idle task', also: ['IDLE0', 'IDLE1'], def: 'The lowest-priority task, one per core, that runs when every other task is blocked. It cleans up deleted tasks, can let the core rest, and feeds the task watchdog.' },
    { term: 'Busy wait', also: ['spinning', 'spin loop'], def: 'Waiting by repeating a test in a loop. The task stays ready and uses the core for the whole wait, so lower priorities starve.' },
    { term: 'Yield', also: ['taskYIELD', 'yield()'], def: 'Offering the rest of the time slice to other ready tasks of the same priority. It does nothing for tasks of lower priority.' },
    { term: 'Absolute delay', also: ['xTaskDelayUntil', 'vTaskDelayUntil'], def: 'A delay that ends at a fixed time mark rather than a set time after the call, so a periodic task does not drift by the time its work takes.' },
    { term: 'Task watchdog', also: ['TWDT'], def: 'A timer that resets the chip if the idle task does not run for several seconds, which would mean some task is hogging a core.' }
  ],
  choose: {
    good: ['delay() or vTaskDelay for any ordinary wait inside a task', 'xTaskDelayUntil where the period matters: sampling, control loops', 'delayMicroseconds for waits of a few microseconds, where a task switch would take longer'],
    avoid: ['Waiting by looping on millis(): it spins and starves the tasks below', 'A delay of a few milliseconds where the tick is 10 ms', 'Calling delay() in an interrupt handler or a timer callback'],
    check: ['The tick rate of your build (1 ms Arduino, 10 ms default ESP-IDF)', 'Whether the period must stay exact over hours', 'That some task blocks on every core, so idle can run']
  },
  code: [
    {
      title: 'A steady 100 ms beat',
      about: 'A task wakes every 100 ms and prints the time since its last wake-up, while it does 7 ms of work. With `STEADY` true it uses an absolute delay and the period stays 100 ms; set it to false and the period becomes 107 ms.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          start task [beat v]

        define task beat
          set [last v] to (milliseconds since start)
          set [next v] to (last)
          forever
            change [next v] by (100)
            wait until the clock reads (next) milliseconds    // fixed marks, not "100 ms after the work"
            print (join [period in ms: ] ((milliseconds since start) - (last)))
            set [last v] to (milliseconds since start)
            wait (0.007) seconds    // pretend work
          end
      `,
      cpp: String.raw`
        const bool STEADY = true;                    // false: vTaskDelay after the work

        void beat(void *arg) {
          TickType_t lastWake = xTaskGetTickCount();
          uint32_t last = millis();
          for (;;) {
            if (STEADY) xTaskDelayUntil(&lastWake, pdMS_TO_TICKS(100));   // wake at fixed marks
            else        vTaskDelay(pdMS_TO_TICKS(100));                   // 100 ms after the work
            uint32_t now = millis();
            Serial.printf("period in ms: %lu\n", (unsigned long)(now - last));
            last = now;
            delay(7);                                // pretend work
          }
        }

        void setup() {
          Serial.begin(115200);
          xTaskCreate(beat, "beat", 3072, nullptr, 2, nullptr);
        }

        void loop() {
          vTaskDelay(pdMS_TO_TICKS(1000));
        }
      `,
      py: String.raw`
        import asyncio
        import time

        STEADY = True                                # False: sleep 100 ms after the work

        async def beat():
            last = time.ticks_ms()
            next_mark = last
            while True:
                if STEADY:
                    next_mark = time.ticks_add(next_mark, 100)
                    await asyncio.sleep_ms(max(0, time.ticks_diff(next_mark, time.ticks_ms())))   # wake at fixed marks
                else:
                    await asyncio.sleep_ms(100)      # 100 ms after the work
                now = time.ticks_ms()
                print("period in ms:", time.ticks_diff(now, last))
                last = now
                time.sleep_ms(7)                     # pretend work (it blocks the event loop for 7 ms)

        asyncio.run(beat())
      `,
      output: `
        period in ms: 100
        period in ms: 100
        period in ms: 100
      `,
      notes: ['With STEADY set to false the same program prints 107, because the work is added to every wait.', 'The ESP-IDF default tick is 10 ms: there pdMS_TO_TICKS(100) is 10 ticks and the beat still works, but a 7 ms delay would round to nothing.']
    }
  ],
  examples: [
    {
      title: 'A short delay on a slow tick',
      q: 'In a default ESP-IDF build the tick rate is 100 Hz. What does `vTaskDelay(pdMS_TO_TICKS(5))` do?',
      steps: ['`pdMS_TO_TICKS(5)` is $5 \\times 100 / 1000 = 0.5$, rounded down to 0 ticks.', '`vTaskDelay(0)` does not block; it only offers the rest of the slice to other ready tasks.', 'To wait at least 5 ms you need a tick of 5 ms or shorter, or a spinning `esp_rom_delay_us(5000)`, which wastes the core.'],
      a: 'It returns almost at once. At 100 Hz the shortest real delay is one tick, 10 ms; the Arduino core\'s 1 kHz tick does not have this problem.'
    }
  ],
  quiz: [
    { q: 'While one task is in delay(1000), what runs on that core?', choices: ['Nothing: the chip is frozen', 'Other ready tasks, or the idle task if there are none', 'Only the Wi-Fi task', 'The same task, in the background'], a: 1, why: 'delay() blocks only the calling task. The scheduler runs anything else that is ready and falls back to the idle task.' },
    { q: 'A task waits with while (millis() - t < 500) {}. What does it do to a lower-priority task on the same core?', choices: ['Nothing', 'Starves it for the whole wait, because it never blocks', 'Slows it by half', 'Wakes it earlier'], a: 1, why: 'The spinning task stays ready all the time. Lower priorities get the core only when it is pre-empted by something higher.' },
    { q: 'A task does 7 ms of work, then vTaskDelay(100). What is its period?', choices: ['100 ms', '93 ms', '107 ms', '700 ms'], a: 2, why: 'The delay starts after the work, so the period is work plus delay. xTaskDelayUntil would keep it at 100 ms.' },
    { q: 'The idle task is wasted time that a good program removes.', a: false, why: 'Idle time means the system is keeping up. The idle task also frees deleted tasks, can rest the core and feeds the watchdog. A program that never lets it run will be reset.' }
  ],
  applications: [
    'A sampling task that must take a reading every 10 ms, kept exact with xTaskDelayUntil.',
    'A battery device whose tasks are mostly blocked, letting the idle task rest the core between events.',
    'Finding why a project is sluggish: a spin loop in a low-priority task that holds back everything below it.',
    'Choosing delayMicroseconds for the 10 µs pulse of an ultrasonic sensor, where a task switch would be too slow.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "FreeRTOS (IDF)" and the task watchdog (TWDT) section of "Watchdogs".',
    'Arduino core for ESP32, the delay and yield implementations (core 3.3).',
    'Richard Barry, *Mastering the FreeRTOS Real Time Kernel*, "Task management": blocking, vTaskDelayUntil and the idle task.'
  ],
  sim: { id: 'fr-timeline', params: { scenario: 'spin' } }
},

/* ================================================================ queues */
{
  id: 'queues',
  parent: 'freertos-and-concurrency',
  title: 'Queues',
  level: 2,
  short: 'A queue carries items from one task to another, in order, copying them in and out. A task can wait for the next item without using the core, and a full queue is the system telling you the consumer is too slow.',
  keywords: ['queue', 'xQueueCreate', 'xQueueSend', 'xQueueReceive', 'xQueueOverwrite', 'xQueuePeek', 'uxQueueMessagesWaiting', 'producer consumer', 'FIFO', 'mailbox', 'portMAX_DELAY', 'timeout', 'queue length', 'item size', 'deque', 'message passing'],
  prereq: ['tasks', 'delays-and-yielding'],
  related: ['mutexes-and-semaphores', 'from-interrupt-to-task', 'event-queues', 'race-conditions', 'task-notifications-and-event-groups'],
  body: `Two tasks that must pass information face the old problem: how to hand over a value safely when neither knows when the other will act. A **queue** is the standard answer. It is a first-in, first-out line of fixed length whose items are all the same size. The sender puts an item in; the receiver takes the oldest one out; both operations are safe against each other, so no extra lock is needed. And either side can *wait*: the receiver sleeps until something arrives, the sender until there is room.

### The calls

~~~cpp
QueueHandle_t q = xQueueCreate(8, sizeof(Reading));     // room for 8 items of that size
xQueueSend(q, &item, timeout);                          // copy item in; pdTRUE on success
xQueueReceive(q, &item, timeout);                       // copy the oldest out; pdTRUE on success
~~~

Items are **copied**, so the sender can reuse its variable at once. That makes small items — a number, a struct of a few fields — natural. For a large buffer, put a *pointer* in the queue and agree who frees it.

**The timeout** is in ticks. \`0\` means "do not wait": the call returns at once, success or not. \`portMAX_DELAY\` means wait for ever. Anything between waits that long and then gives up. A receiver with a timeout is also a free timer: no message for a second can mean "do something else".

### When the line is full

A producer faster than its consumer fills any queue sooner or later. You choose the policy:

- **block** the producer (a long timeout), which slows it to the consumer\'s pace;
- **drop** the new item (timeout 0) and count the loss;
- **overwrite** the oldest. \`xQueueOverwrite\` on a queue of length 1 gives a "mailbox" holding only the latest value, ideal for a reading that is stale as soon as the next arrives.

Size the queue for the longest *burst*, not the average: a producer that sends $B$ items at rate $r_p$ to a consumer that clears $r_c$ per second leaves about $B(1 - r_c/r_p)$ waiting at the end of the burst. The simulation shows the line filling and draining.

### Memory and latency

A queue takes $n \\times s$ bytes for its items plus a small header. And every item waiting is delay: the item at the back waits for all those in front of it.

### Beware

- Never call \`xQueueSend\` or \`xQueueReceive\` with a timeout from an interrupt handler: use the \`FromISR\` forms ([[from-interrupt-to-task]]).
- Pass **data**, not references to something that may change under the receiver\'s feet.
- A queue is the cleanest way to give a task its inputs: the same idea as the event queue of a state machine ([[event-queues]]).

> [!key] A queue is a safe, ordered, copying channel between tasks, with waiting built in. Choose its length for the longest burst, decide what happens when it is full, and use timeouts rather than waiting for ever when something else should happen.`,
  ideas: [
    'A queue is a first-in, first-out line of equal-size items; sending and receiving are safe against each other with no extra lock.',
    'Items are copied in and out; for big data, send a pointer and agree who owns it.',
    'The timeout is in ticks: 0 does not wait, portMAX_DELAY waits for ever.',
    'When the queue is full, block, drop or overwrite; choose its length for the longest burst.'
  ],
  pitfalls: [
    'A queue of length 10 can hold 10 seconds of data — It holds 10 items. How long that is depends on how fast the producer sends; at 1000 items a second it is 10 ms.',
    'Sending a pointer to a local variable is fine because queues copy things — The queue copies the pointer, not what it points to. If the variable goes away, the receiver reads garbage.',
    'The receiver should poll uxQueueMessagesWaiting in a loop — Waiting inside xQueueReceive costs nothing and wakes at once; polling spins the core and adds delay.'
  ],
  terms: [
    { term: 'Queue', also: ['FIFO', 'message queue'], def: 'A first-in, first-out line of fixed length and fixed item size that tasks use to pass data safely. Items are copied in and out.' },
    { term: 'Producer', also: ['sender'], def: 'The task that puts items into a queue.' },
    { term: 'Consumer', also: ['receiver'], def: 'The task that takes items out of a queue, usually blocking until one arrives.' },
    { term: 'Timeout', also: ['block time', 'portMAX_DELAY'], def: 'How long a call may wait, in ticks: 0 for not at all, portMAX_DELAY for as long as it takes.' },
    { term: 'Mailbox', also: ['xQueueOverwrite'], def: 'A queue of length 1 that is overwritten rather than filled, so that it always holds the latest value.' }
  ],
  choose: {
    good: ['Handing readings or commands from one task to another in order', 'Decoupling a fast producer (a sampling task) from a slow consumer (an upload)', 'A single-slot mailbox for "the latest value" that readers only peek at'],
    avoid: ['Passing large buffers by value: send a pointer instead', 'Using a queue just to wake a task: a notification is lighter', 'An unbounded wait where the system must keep doing something else'],
    check: ['The longest burst and the consumer\'s speed, to choose the length', 'What happens when a send times out: drop, count or stop', 'The item size, since the queue is length times size in RAM']
  },
  formulas: [
    {
      name: 'Items waiting after a burst',
      expr: 'n = B*(1 - rc/rp)',
      tex: 'n = B\\left(1 - \\frac{r_c}{r_p}\\right)',
      vars: {
        n: { name: 'items left in the queue', q: 'count' },
        B: { name: 'items in the burst', q: 'count', value: 20, min: 1 },
        rc: { name: 'consumer rate', q: 'frequency', unit: 'Hz', value: 40, tex: 'r_c' },
        rp: { name: 'producer rate during the burst', q: 'frequency', unit: 'Hz', value: 100, tex: 'r_p' }
      },
      solveFor: 'n',
      note: 'For a burst sent faster than it is consumed. The queue must be at least this long, or the sender must wait or drop items.'
    },
    {
      name: 'RAM of a queue',
      expr: 'm = n*s',
      vars: {
        m: { name: 'memory for the items (bytes)', q: 'count' },
        n: { name: 'queue length', q: 'count', value: 8, min: 1, int: true },
        s: { name: 'item size (bytes)', q: 'count', value: 8, min: 1, int: true }
      },
      solveFor: 'm',
      note: 'A small header comes on top of this.'
    }
  ],
  code: [
    {
      title: 'A sensor task and a slow consumer',
      about: 'A producer puts a reading in a queue every 200 ms. The consumer takes one every 500 ms, so the queue of five slowly fills and then readings are lost, which the producer reports.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          start task [producer v]
          start task [consumer v]

        define task producer
          set [n v] to (0)
          forever
            send (n) to queue [readings v] without waiting
            if <(queue [readings v] was full)> then
              print [queue full: reading lost]
            end
            change [n v] by (1)
            wait (0.2) seconds
          end

        define task consumer
          forever
            set [value v] to (receive from queue [readings v])    // sleeps until an item arrives
            print (join [got ] (value))
            wait (0.5) seconds    // a slow consumer
          end
      `,
      cpp: String.raw`
        struct Reading { uint32_t ms; int value; };
        QueueHandle_t readings;

        void producer(void *arg) {
          int n = 0;
          for (;;) {
            Reading r = { millis(), n++ };
            if (xQueueSend(readings, &r, 0) != pdTRUE) {         // 0: do not wait; drop when full
              Serial.println("queue full: reading lost");
            }
            vTaskDelay(pdMS_TO_TICKS(200));
          }
        }

        void consumer(void *arg) {
          Reading r;
          for (;;) {
            xQueueReceive(readings, &r, portMAX_DELAY);          // sleeps until an item arrives
            Serial.printf("got %d from t = %lu ms\n", r.value, (unsigned long)r.ms);
            vTaskDelay(pdMS_TO_TICKS(500));                      // a slow consumer
          }
        }

        void setup() {
          Serial.begin(115200);
          readings = xQueueCreate(5, sizeof(Reading));           // room for 5 readings, copied in and out
          xTaskCreate(producer, "producer", 3072, nullptr, 1, nullptr);
          xTaskCreate(consumer, "consumer", 3072, nullptr, 1, nullptr);
        }

        void loop() {
          vTaskDelay(pdMS_TO_TICKS(1000));
        }
      `,
      py: String.raw`
        import asyncio
        import time
        from collections import deque

        readings = deque((), 5, 1)               # room for 5 readings; the 1 makes a full deque raise IndexError
        arrived = asyncio.Event()                # the producer sets it, the consumer waits for it

        async def producer():
            n = 0
            while True:
                try:
                    readings.append((time.ticks_ms(), n))        # do not wait; drop when full
                    arrived.set()
                except IndexError:
                    print("queue full: reading lost")
                n += 1
                await asyncio.sleep_ms(200)

        async def consumer():
            while True:
                while len(readings) == 0:
                    arrived.clear()
                    await arrived.wait()                         # sleeps until an item arrives
                ms, value = readings.popleft()
                print("got", value, "from t =", ms, "ms")
                await asyncio.sleep_ms(500)                      # a slow consumer

        async def main():
            asyncio.create_task(producer())
            asyncio.create_task(consumer())
            while True:
                await asyncio.sleep(1)

        asyncio.run(main())
      `,
      output: `
        got 0 from t = 1204 ms
        got 1 from t = 1404 ms
        got 2 from t = 1604 ms
        ...
        queue full: reading lost
        queue full: reading lost
      `,
      notes: ['In C++ the receive could use a timeout instead of waiting for ever: "nothing for a second" then becomes a branch of the program.', 'MicroPython has no built-in queue between asyncio tasks: a deque and an Event do the same job, and need no lock because the tasks never run at the same instant.', 'Between two real threads (_thread) a deque is not safe by itself: guard it with a lock.']
    }
  ],
  examples: [
    {
      title: 'How long must the queue be?',
      q: 'A radio task delivers a burst of 20 packets at 100 per second. A parser task handles 40 packets per second. How long must the queue be so that no packet is lost?',
      steps: ['The burst lasts $20 / 100 = 0.2$ s. In that time the parser clears $40 \\times 0.2 = 8$ packets.', 'Packets left waiting: $20 - 8 = 12$, which is also $B(1 - r_c/r_p) = 20 \\times (1 - 0.4) = 12$.', 'A queue of 12 would just hold them; add a margin and take 16.'],
      a: 'At least 12 items, so 16 with a margin. If a second burst can follow before the first is cleared, size for both.'
    }
  ],
  quiz: [
    { q: 'xQueueReceive(q, &item, portMAX_DELAY) is called on an empty queue. What happens to the task?', choices: ['It returns at once with a failure', 'It blocks, using no processor time, until an item arrives', 'It spins in a loop until an item arrives', 'The queue is refilled with zeros'], a: 1, why: 'portMAX_DELAY means wait for ever, and waiting is a blocked state: the task costs nothing until something is sent.' },
    { q: 'A producer sends with timeout 0 into a full queue. What does xQueueSend do?', choices: ['Waits until there is room', 'Overwrites the oldest item', 'Returns at once, reporting that the queue was full', 'Crashes the task'], a: 2, why: 'A timeout of 0 means do not wait. The item is not stored and the call returns errQUEUE_FULL; the program decides what to do.' },
    { q: 'You want a reading that always holds the most recent value, with no backlog. Which is best?', choices: ['A queue of 100', 'A queue of length 1 written with xQueueOverwrite', 'A global variable with no protection', 'Two queues'], a: 1, why: 'xQueueOverwrite on a length-1 queue replaces the old value, so a reader always finds the newest one, safely.' },
    { q: 'The items of a FreeRTOS queue are stored by reference, so large buffers are cheap to send.', a: false, why: 'Items are copied by value. A large buffer copied through a queue is costly; send a pointer instead and agree who owns the memory.' }
  ],
  applications: [
    'A sensor task feeding readings to a task that averages and uploads them.',
    'Commands from a web interface or button queued for the motor task to carry out in order.',
    'A logger queue that lets a slow SD card write lag behind a fast sampling task without losing data.',
    'The event queue of a state machine, filled by buttons and timers and drained by one task.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "FreeRTOS (IDF)" and the FreeRTOS queue API reference.',
    'Arduino core for ESP32, the BasicMultiThreading example (a queue, a mutex and two pinned tasks).',
    'Richard Barry, *Mastering the FreeRTOS Real Time Kernel*, "Queue management".'
  ],
  sim: 'fr-queue'
},

/* ================================================================ mutexes-and-semaphores */
{
  id: 'mutexes-and-semaphores',
  parent: 'freertos-and-concurrency',
  title: 'Mutexes and semaphores',
  level: 2,
  short: 'A mutex lets one task at a time use something shared, and lifts its owner\'s priority to avoid inversion; a semaphore counts or signals. They look alike and do different jobs.',
  keywords: ['mutex', 'semaphore', 'binary semaphore', 'counting semaphore', 'xSemaphoreCreateMutex', 'xSemaphoreTake', 'xSemaphoreGive', 'priority inversion', 'priority inheritance', 'deadlock', 'recursive mutex', 'lock', 'critical section', 'mutual exclusion', 'Mars Pathfinder', 'allocate_lock'],
  prereq: ['tasks', 'priorities-and-scheduling'],
  related: ['race-conditions', 'queues', 'task-notifications-and-event-groups', 'from-interrupt-to-task', 'i2c'],
  body: `Some things can serve only one task at a time: an I2C bus in the middle of a transaction, a display being redrawn, a struct whose fields must be read together, the serial port while a line is being printed. A **mutex** (mutual exclusion) is a lock for them. A task *takes* it before touching the thing and *gives* it back afterwards; if another task holds it, the taker simply waits, blocked and free of cost, until the owner gives it back.

### Mutex or semaphore?

They are made with the same calls — \`xSemaphoreTake\`, \`xSemaphoreGive\` — and mean different things.

| | Mutex | Binary semaphore | Counting semaphore |
|---|---|---|---|
| Idea | a lock with an **owner** | a flag: signal and wait | a counter of events or free resources |
| Who gives | the task that took it | any task, or an interrupt | any task, or an interrupt |
| Priority inheritance | **yes** | no | no |
| Use for | protecting shared data and devices | waking a task from another task or an interrupt | counting items, a pool of 3 identical buses |
| Created with | \`xSemaphoreCreateMutex\` | \`xSemaphoreCreateBinary\` | \`xSemaphoreCreateCounting(max, start)\` |

A mutex is for **protecting**, a semaphore for **signalling**. Using a binary semaphore as a lock works until it meets priority inversion; using a mutex as a signal is wrong because the giver is not the taker.

### Using a mutex well

1. **Hold it briefly.** Take, touch, give. Never wait, print or make a network call while holding one if it can be avoided: copy the data out under the lock and use the copy outside it, as the program below does.
2. **Always give back**, on every path out of the code, including early returns and error branches.
3. **Use a timeout** where a stuck owner should not freeze you: \`xSemaphoreTake(m, pdMS_TO_TICKS(100))\` returns false if the lock was not obtained.
4. **Not from an interrupt handler.** A mutex has an owning task, which an interrupt does not. The handler signals with a semaphore or notification ([[from-interrupt-to-task]]).

### Deadlock

Task A holds lock 1 and waits for lock 2; task B holds lock 2 and waits for lock 1. Neither can go on, for ever. Cures: take several locks always in the same order, or design so that no task needs two.

### Priority inversion

A low-priority task L holds the mutex. A high-priority task H wakes and waits for it. A medium task M, which does not need the lock, becomes ready and pre-empts L: now H is held up by M, though M is less important. This happened on the Mars Pathfinder probe in 1997 and caused repeated resets until priority inheritance was switched on. A FreeRTOS **mutex** has it: while H waits, L runs at H\'s priority, so M cannot interrupt it. A binary semaphore does not, and the simulation shows the difference.

> [!key] A mutex protects a shared thing, one task at a time, and lends its owner the waiting task\'s priority; a semaphore signals or counts. Hold locks briefly, take them in a fixed order, and never from an interrupt.`,
  ideas: [
    'A mutex lets one task at a time use a shared resource; the others wait, blocked, at no cost.',
    'A mutex has an owner and priority inheritance; a binary semaphore is a signal that anyone may give.',
    'Hold a lock briefly, copy the data out, give it back on every path, and never take a mutex in an interrupt handler.',
    'Locks taken in different orders can deadlock; locks held while a middle-priority task runs can cause priority inversion.'
  ],
  pitfalls: [
    'A binary semaphore is a mutex that is simpler — It has no owner and no priority inheritance, so it is exposed to priority inversion. Use a mutex to protect, a semaphore to signal.',
    'Lock the whole task function to be safe — A task that holds a lock while it waits or works for a long time stops every other task that needs it. Lock only the few lines that touch the shared thing.',
    'A mutex can be taken inside an interrupt handler if I use the FromISR form — There is no FromISR form for a mutex, because an interrupt cannot own it. Use a binary semaphore or a notification to hand work to a task.'
  ],
  terms: [
    { term: 'Mutex', also: ['mutual exclusion', 'lock'], def: 'A lock that one task at a time can hold. The task that takes it must be the one that gives it back, and while it holds it other tasks that need it wait.' },
    { term: 'Semaphore', also: ['binary semaphore', 'counting semaphore'], def: 'A counter that tasks and interrupts can give to and take from. A binary semaphore counts 0 or 1 and works as a signal; a counting one tracks several events or resources.' },
    { term: 'Priority inversion', also: [], def: 'A high-priority task waiting for a lock held by a low-priority task that is itself kept from running by a medium-priority task.' },
    { term: 'Priority inheritance', also: ['priority donation'], def: 'Raising the priority of a lock\'s owner to that of the highest task waiting for it, so that the owner finishes quickly and gives the lock back.' },
    { term: 'Deadlock', also: ['deadly embrace'], def: 'A state in which tasks each hold a lock the other needs, so none of them can ever continue.' },
    { term: 'Recursive mutex', also: ['xSemaphoreCreateRecursiveMutex'], def: 'A mutex that its owner can take again without waiting for itself, as long as it gives it back as many times as it took it.' }
  ],
  choose: {
    good: ['A mutex around an I2C or SPI bus used by several tasks', 'A mutex around a small struct whose fields are read and written together', 'A counting semaphore as a pool: three identical resources, three tasks at most at a time'],
    avoid: ['A mutex around long work or waiting: hold it for a few lines only', 'A binary semaphore as a lock where a high-priority task shares it with a low one', 'Any mutex call in an interrupt handler'],
    check: ['Which tasks share the thing, and at what priorities', 'The order in which locks are taken, if there are two or more', 'That every path out of the code gives the lock back']
  },
  code: [
    {
      title: 'A reading shared between two tasks',
      about: 'A sensor task updates a temperature and its time stamp together; a report task reads both. A mutex makes sure the report never sees a temperature from one update with a time stamp from another.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          start task [sensor v]
          start task [report v]

        define task sensor
          set [t v] to (20)
          forever
            change [t v] by (0.1)
            lock [latest v]
            set [latest temperature v] to (t)
            set [latest stamp v] to (milliseconds since start)
            unlock [latest v]
            wait (0.1) seconds
          end

        define task report
          forever
            lock [latest v]
            set [copy temperature v] to (latest temperature)
            set [copy stamp v] to (latest stamp)
            unlock [latest v]
            print (join [temperature ] (copy temperature))    // print outside the lock
            wait (1) seconds
          end
      `,
      cpp: String.raw`
        struct Shared { float temperature; uint32_t stamp; };    // two values that belong together
        Shared latest = { 0.0f, 0 };
        SemaphoreHandle_t lockLatest;

        void sensorTask(void *arg) {
          float t = 20.0f;
          for (;;) {
            t += 0.1f;                                           // pretend measurement
            xSemaphoreTake(lockLatest, portMAX_DELAY);           // lock: nobody else touches latest now
            latest.temperature = t;
            latest.stamp = millis();
            xSemaphoreGive(lockLatest);                          // unlock as soon as possible
            vTaskDelay(pdMS_TO_TICKS(100));
          }
        }

        void reportTask(void *arg) {
          for (;;) {
            xSemaphoreTake(lockLatest, portMAX_DELAY);
            Shared copy = latest;                                // copy under the lock ...
            xSemaphoreGive(lockLatest);
            Serial.printf("%.1f C at %lu ms\n", copy.temperature, (unsigned long)copy.stamp);   // ... print outside it
            vTaskDelay(pdMS_TO_TICKS(1000));
          }
        }

        void setup() {
          Serial.begin(115200);
          lockLatest = xSemaphoreCreateMutex();                  // a mutex: it has an owner and priority inheritance
          xTaskCreate(sensorTask, "sensor", 3072, nullptr, 2, nullptr);
          xTaskCreate(reportTask, "report", 3072, nullptr, 1, nullptr);
        }

        void loop() {
          vTaskDelay(pdMS_TO_TICKS(1000));
        }
      `,
      py: String.raw`
        import _thread
        import time

        latest = {"temperature": 0.0, "stamp": 0}          # two values that belong together
        lock = _thread.allocate_lock()

        def sensor_task():
            t = 20.0
            while True:
                t += 0.1                                   # pretend measurement
                with lock:                                 # lock: nobody else touches latest now
                    latest["temperature"] = t
                    latest["stamp"] = time.ticks_ms()
                time.sleep_ms(100)

        def report_task():
            while True:
                with lock:
                    copy = dict(latest)                    # copy under the lock ...
                print("%.1f C at %d ms" % (copy["temperature"], copy["stamp"]))   # ... print outside it
                time.sleep_ms(1000)

        _thread.start_new_thread(sensor_task, ())
        report_task()                                      # the main program is the second task
      `,
      output: `
        20.9 C at 9012 ms
        21.9 C at 10012 ms
        22.9 C at 11013 ms
      `,
      notes: ['Remove the lock and the report can, rarely, read the new temperature with the old time stamp: the bug appears once in a thousand runs, which is why it needs a lock rather than hope.', 'A MicroPython thread runs on the same core as the main program; the lock is still needed because a switch can happen between the two assignments.', 'With asyncio instead of threads no lock is needed here, because coroutines switch only at an await.']
    }
  ],
  examples: [
    {
      title: 'Two tasks, one bus',
      q: 'A temperature task and a display task both use the same I2C bus. Each transaction takes 2 ms. The display task wants the bus every 50 ms, the temperature task every 20 ms. What is the longest the temperature task may have to wait, and what protects the bus?',
      steps: ['The worst case is that the display task has just taken the bus: the temperature task waits for the remainder of one 2 ms transaction.', 'So the wait is at most 2 ms, if each task holds the lock only for one transaction.', 'A mutex around each transaction protects the bus; a lock held across the display\'s whole redraw would make the wait tens of milliseconds.'],
      a: 'At most 2 ms, with a mutex around each single transaction. The lesson is to hold the lock for the transaction, not for the whole job.'
    }
  ],
  quiz: [
    { q: 'Which is the main difference between a mutex and a binary semaphore in FreeRTOS?', choices: ['A mutex counts higher', 'A mutex has an owner and priority inheritance', 'A semaphore can only be used by one task', 'There is none'], a: 1, why: 'A mutex must be given back by the task that took it, and its owner inherits the priority of a waiting high-priority task. A binary semaphore has neither.' },
    { q: 'A high-priority task waits for a lock held by a low-priority task, which is being held up by a medium-priority task. What is this called?', choices: ['Deadlock', 'Priority inversion', 'Starvation', 'A race condition'], a: 1, why: 'The medium task effectively runs ahead of the high one. Priority inheritance in a mutex lifts the low task so that it can finish and release the lock.' },
    { q: 'An interrupt handler can safely call xSemaphoreTake on a mutex with a short timeout.', a: false, why: 'A mutex belongs to a task, and an interrupt cannot block. A handler hands work to a task with a semaphore given from the ISR, or a notification.' },
    { q: 'Task A takes lock 1 then lock 2; task B takes lock 2 then lock 1. What can happen?', choices: ['Nothing, locks are re-entrant', 'Deadlock: each holds the lock the other wants', 'The higher priority task always wins', 'Priority inversion'], a: 1, why: 'If each gets its first lock before the other gets its second, both wait for ever. Take locks in the same order everywhere.' }
  ],
  applications: [
    'Sharing one I2C or SPI bus between a sensor task and a display task.',
    'Protecting a configuration struct that a web interface updates while a control task reads it.',
    'A counting semaphore that limits the number of simultaneous HTTPS connections, since each takes a lot of RAM.',
    'Printing: a mutex around the serial port so that two tasks do not mix their lines.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "FreeRTOS (IDF)" and the semaphore API reference.',
    'Arduino core for ESP32, the BasicMultiThreading example (a mutex around printing).',
    'Richard Barry, *Mastering the FreeRTOS Real Time Kernel*, "Resource management" (mutexes, priority inversion and deadlock).'
  ],
  sim: 'fr-inversion'
},

/* ================================================================ task-notifications-and-event-groups */
{
  id: 'task-notifications-and-event-groups',
  parent: 'freertos-and-concurrency',
  title: 'Task notifications and event groups',
  level: 2,
  short: 'A notification is the lightest way to wake one task; an event group is a set of flags that tasks can wait on, singly or together. Both signal without carrying data.',
  keywords: ['task notification', 'xTaskNotifyGive', 'ulTaskNotifyTake', 'xTaskNotify', 'xTaskNotifyWait', 'event group', 'xEventGroupCreate', 'xEventGroupSetBits', 'xEventGroupWaitBits', 'flags', 'wait for all', 'wait for any', 'asyncio.Event', 'signal', 'rendezvous'],
  prereq: ['queues', 'mutexes-and-semaphores'],
  related: ['from-interrupt-to-task', 'wifi-events-and-reconnection', 'state-machines', 'asyncio-in-micropython', 'event-queues'],
  body: `Not every conversation between tasks has a message. Often one task only needs to say "now": the data is ready, the button was pressed, the connection is up. FreeRTOS has two tools for such pure signals, and they differ in scale.

### Task notifications: one task, no extras

Every task has, built in, a 32-bit notification value and a flag saying whether one is waiting. Nothing to create, nothing to free. \`xTaskNotifyGive(handle)\` adds one to the target task\'s count and wakes it if it is waiting in \`ulTaskNotifyTake\`. The waiter either clears the count when it takes it, so it learns how many notifications arrived since it last looked, or takes just one. Used like this a notification behaves as a **binary or counting semaphore**, but it is faster and uses no RAM of its own.

There is a richer form, \`xTaskNotify(handle, bits, eSetBits)\` with \`xTaskNotifyWait\`, in which the value carries up to 32 bits: a tiny message such as "which of four sources fired".

The limits are the price of being light: only **one receiver**, the task whose handle you hold; the sender must know that handle; and the signal carries a 32-bit value at most. For several receivers or for data, use another tool.

### Event groups: flags, waited on together

An event group is a set of bits, 24 of them on the ESP32, that tasks set and wait on. \`xEventGroupSetBits(group, bits)\` raises flags. \`xEventGroupWaitBits(group, bits, clearOnExit, waitForAll, timeout)\` sleeps until **all** the named bits are set, or **any** of them, as you choose, and can clear them as it leaves. Several tasks can wait on the same group, and all are woken when their condition holds.

That makes event groups the tool for "start the job when Wi-Fi is up **and** the clock is set **and** the sensor has warmed up", or "stop when any of three faults is raised". ESP-IDF\'s own Wi-Fi example uses one with a "connected" bit and a "failed" bit.

### Which to use

| You need | Use |
|---|---|
| to wake one task, with no data | notification |
| to pass data in order | [[queues|queue]] |
| several conditions, waiting for all or any, or many waiters | event group |
| to protect a shared thing | [[mutexes-and-semaphores|mutex]] |

### Cautions

- A notification given **twice** before the waiter runs is counted, not lost, if the waiter uses the counting form; a plain event flag is set once however many times it is raised.
- Event group bits are **state**, not events: a bit stays set until cleared. Decide who clears it.
- From an interrupt use the \`FromISR\` forms, which exist for both ([[from-interrupt-to-task]]).

> [!key] A notification wakes one task without any extra object, like a very light semaphore; an event group lets tasks wait for all or any of several flags. Neither carries data worth the name: use a queue for that.`,
  ideas: [
    'Every task has a built-in notification: xTaskNotifyGive wakes it and ulTaskNotifyTake waits, as a light binary or counting semaphore.',
    'A notification has one receiver and carries at most 32 bits.',
    'An event group is a set of 24 flags; a task can wait for all or any of chosen bits, and many tasks can wait on one group.',
    'Event group bits are state: they stay set until someone clears them.'
  ],
  pitfalls: [
    'Notifications are queues for small messages — They hold one value and one pending signal, not a line of items. Two quick notifications with different values can overwrite each other; use a queue when each must arrive.',
    'An event group bit means "it just happened" — It means "this is currently true". If nobody clears it, the next wait returns at once, even for an old event.',
    'Any number of tasks can wait for a notification — Only the task that owns it. For several waiters, use an event group or give each task its own notification.'
  ],
  terms: [
    { term: 'Task notification', also: ['direct-to-task notification'], def: 'A 32-bit value and a pending flag built into every task. Giving one wakes the task; it works like a very light semaphore with exactly one receiver.' },
    { term: 'Event group', also: ['event flags', 'xEventGroupCreate'], def: 'A set of flag bits, 24 on the ESP32, that tasks can set and wait on, singly or in combination.' },
    { term: 'Wait for all', also: ['AND wait'], def: 'An event group wait that ends only when every one of the named bits is set.' },
    { term: 'Wait for any', also: ['OR wait'], def: 'An event group wait that ends as soon as one of the named bits is set.' },
    { term: 'Clear on exit', also: ['xClearOnExit'], def: 'An option of an event group wait that clears the bits it waited for as it returns, so that the same event is not seen twice.' }
  ],
  choose: {
    good: ['A notification to wake a worker from a timer, a button or another task', 'An event group for start-up conditions: Wi-Fi up, clock set, sensor ready', 'An event group with "any" for fault flags that should all stop the job'],
    avoid: ['A notification for several receivers or for data in order: use a group or a queue', 'Event group bits as one-time events without a plan for clearing them', 'Using both a queue and an event group where one would do'],
    check: ['Who sets each bit, who waits and who clears', 'Whether the waiter wants the count of notifications or only "at least one"', 'That the interrupt forms are used from handlers']
  },
  code: [
    {
      title: 'Wake a worker with a notification',
      about: 'A signaller task notifies a worker every 1.5 seconds. The worker sleeps until woken, using no processor time while it waits.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          start task [worker v]
          start task [signaller v]

        define task worker
          forever
            wait for notification :: tasks    // sleeps, using no processor time
            print [woken]
          end

        define task signaller
          forever
            wait (1.5) seconds
            notify task [worker v]
          end
      `,
      cpp: String.raw`
        TaskHandle_t workerHandle;                         // the signaller needs this to know whom to wake

        void worker(void *arg) {
          for (;;) {
            ulTaskNotifyTake(pdTRUE, portMAX_DELAY);       // sleeps until notified; pdTRUE clears the count
            Serial.println("woken");
          }
        }

        void signaller(void *arg) {
          for (;;) {
            vTaskDelay(pdMS_TO_TICKS(1500));
            xTaskNotifyGive(workerHandle);                 // wakes the worker; costs almost nothing
          }
        }

        void setup() {
          Serial.begin(115200);
          xTaskCreate(worker, "worker", 3072, nullptr, 2, &workerHandle);
          xTaskCreate(signaller, "signaller", 2048, nullptr, 1, nullptr);
        }

        void loop() {
          vTaskDelay(pdMS_TO_TICKS(1000));
        }
      `,
      py: String.raw`
        import asyncio

        woken = asyncio.Event()                            # the signaller sets it, the worker waits for it

        async def worker():
            while True:
                await woken.wait()                         # sleeps until set
                woken.clear()
                print("woken")

        async def signaller():
            while True:
                await asyncio.sleep_ms(1500)
                woken.set()                                # wakes the worker

        async def main():
            asyncio.create_task(worker())
            asyncio.create_task(signaller())
            while True:
                await asyncio.sleep(1)

        asyncio.run(main())
      `,
      output: `
        woken
        woken
        woken
      `,
      notes: ['ulTaskNotifyTake returns the number of notifications that arrived since the last take: print it to see two quick signals counted as two.', 'asyncio.Event has no count: set twice before the worker runs, it is still just set.']
    },
    {
      title: 'Wait for two conditions at once',
      about: 'Two start-up jobs finish at different times and raise a flag each. The main job waits until **both** flags are set and then begins.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          start task [sensor start v]
          start task [network start v]
          start task [main job v]

        define task sensor start
          wait (1.2) seconds
          set flag [SENSOR_READY v] :: tasks
          print [sensor ready]

        define task network start
          wait (2.5) seconds
          set flag [NETWORK_UP v] :: tasks
          print [network up]

        define task main job
          wait until flags [SENSOR_READY v] and [NETWORK_UP v] are all set :: tasks
          print [both ready: start reporting]
      `,
      cpp: String.raw`
        #include "freertos/event_groups.h"

        EventGroupHandle_t flags;
        const EventBits_t SENSOR_READY = (1 << 0);         // one bit per condition
        const EventBits_t NETWORK_UP   = (1 << 1);

        void sensorStart(void *arg) {
          vTaskDelay(pdMS_TO_TICKS(1200));
          xEventGroupSetBits(flags, SENSOR_READY);
          Serial.println("sensor ready");
          vTaskDelete(NULL);                               // a one-off task ends itself
        }

        void networkStart(void *arg) {
          vTaskDelay(pdMS_TO_TICKS(2500));
          xEventGroupSetBits(flags, NETWORK_UP);
          Serial.println("network up");
          vTaskDelete(NULL);
        }

        void mainJob(void *arg) {
          // clear on exit: false, wait for all: true, timeout: for ever
          xEventGroupWaitBits(flags, SENSOR_READY | NETWORK_UP, pdFALSE, pdTRUE, portMAX_DELAY);
          Serial.println("both ready: start reporting");
          vTaskDelete(NULL);
        }

        void setup() {
          Serial.begin(115200);
          flags = xEventGroupCreate();
          xTaskCreate(sensorStart, "sensor", 3072, nullptr, 1, nullptr);
          xTaskCreate(networkStart, "network", 3072, nullptr, 1, nullptr);
          xTaskCreate(mainJob, "main job", 3072, nullptr, 1, nullptr);
        }

        void loop() {
          vTaskDelay(pdMS_TO_TICKS(1000));
        }
      `,
      py: String.raw`
        import asyncio

        sensor_ready = asyncio.Event()                     # one flag per condition
        network_up = asyncio.Event()

        async def sensor_start():
            await asyncio.sleep_ms(1200)
            sensor_ready.set()
            print("sensor ready")

        async def network_start():
            await asyncio.sleep_ms(2500)
            network_up.set()
            print("network up")

        async def main_job():
            await sensor_ready.wait()
            await network_up.wait()                        # waiting for each in turn waits for both
            print("both ready: start reporting")

        async def main():
            asyncio.create_task(sensor_start())
            asyncio.create_task(network_start())
            await main_job()

        asyncio.run(main())
      `,
      output: `
        sensor ready
        network up
        both ready: start reporting
      `,
      notes: ['Change pdTRUE (wait for all) to pdFALSE for "any": the main job then starts after 1.2 s, as soon as the sensor is ready.', 'Event group bits stay set: a second waiter that arrives later also passes at once. Use clear on exit to make an event count once.']
    }
  ],
  examples: [
    {
      title: 'Which tool?',
      q: 'Choose the tool for each: (a) a button handler wakes the UI task; (b) a web task asks the motor task to move to a position; (c) three subsystems must all report ready before the main loop starts.',
      steps: ['(a) A pure signal to one task, with no data: a task notification (given from the ISR form).', '(b) A value, and possibly several requests in order: a queue.', '(c) Several conditions, all required, set by different tasks: an event group waiting for all bits.'],
      a: '(a) notification, (b) queue, (c) event group with "wait for all".'
    }
  ],
  quiz: [
    { q: 'What is the main limitation of a task notification compared with a binary semaphore?', choices: ['It is slower', 'It uses more RAM', 'It has exactly one possible receiver: the task it belongs to', 'It cannot be given from an interrupt'], a: 2, why: 'A notification belongs to one task. It is lighter and faster than a semaphore, but cannot wake several tasks.' },
    { q: 'An event group wait with waitForAll set to true and bits A|B returns when:', choices: ['A is set', 'B is set', 'Both A and B are set', 'Either is set'], a: 2, why: 'waitForAll = pdTRUE means all named bits; pdFALSE means any of them.' },
    { q: 'Three notifications are given to a sleeping task before it runs. A task using ulTaskNotifyTake(pdTRUE, ...) sees:', choices: ['Only one signal', 'The count 3', 'Nothing, they cancelled out', 'An error'], a: 1, why: 'In the counting form the notification value is a counter; take returns it (and clears it with pdTRUE). An asyncio.Event or a plain flag would show only "set".' },
    { q: 'An event group bit stays set after a task has waited for it unless somebody clears it.', a: true, why: 'Bits are state. Use clear on exit, or xEventGroupClearBits, so that the same event is not seen again by the next wait.' }
  ],
  applications: [
    'The Wi-Fi start-up of a sensor node: a "connected" bit and a "got time" bit, both required before the first upload.',
    'A button interrupt that notifies the UI task so that it sleeps until pressed.',
    'A supervisor that waits for "any fault" bits and then puts the machine into a safe state.',
    'A worker that sleeps between jobs and is woken by a timer task, with no queue needed.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "FreeRTOS (IDF)" and the event group and task notification references; the Wi-Fi station example with its event bits.',
    'Arduino core for ESP32 documentation and examples for FreeRTOS tasks (core 3.3).',
    'Richard Barry, *Mastering the FreeRTOS Real Time Kernel*, "Event groups" and "Task notifications".'
  ],
  sim: { id: 'fr-isr', params: { method: 'notify' } }
},

/* ================================================================ from-interrupt-to-task */
{
  id: 'from-interrupt-to-task',
  parent: 'freertos-and-concurrency',
  title: 'From an interrupt to a task',
  level: 2,
  short: 'An interrupt handler may do almost nothing: it must not wait, print or take a lock. The pattern is to record the event, wake a task with a FromISR call, and let the task do the real work at its own priority.',
  keywords: ['ISR', 'interrupt', 'xSemaphoreGiveFromISR', 'vTaskNotifyGiveFromISR', 'xQueueSendFromISR', 'portYIELD_FROM_ISR', 'deferred interrupt handling', 'IRAM_ATTR', 'attachInterrupt', 'ThreadSafeFlag', 'latency', 'debounce', 'bottom half', 'higher priority task woken'],
  prereq: ['interrupts', 'task-notifications-and-event-groups', 'queues'],
  related: ['mutexes-and-semaphores', 'race-conditions', 'priorities-and-scheduling', 'debouncing', 'hardware-timers'],
  body: `An interrupt handler runs the instant its event happens, on top of whatever was running, with the scheduler out of the picture. That is its power and its limit. It cannot wait, because there is no task to put to sleep. It cannot take a mutex, print, or allocate memory, because those take locks that the interrupted code may be holding. The rules of the handler are in [[interrupts]]; this page is about what to do with the event once the handler has seen it.

### The pattern: record, wake, return

1. The handler does the **minimum**: note the time, read the one register that must be read now, clear the cause.
2. It **hands the event to a task**, with a semaphore, a notification or a queue item.
3. It **returns**, and the scheduler may run the woken task straight away.
4. The task does the real work — debouncing, printing, calculating, talking to the network — with every tool of a normal task and at a priority you choose.

### The FromISR calls

Each way of waking a task has a twin that is safe in a handler:

| In a task | In a handler |
|---|---|
| \`xSemaphoreGive\` | \`xSemaphoreGiveFromISR(sem, &woken)\` |
| \`xTaskNotifyGive\` | \`vTaskNotifyGiveFromISR(handle, &woken)\` |
| \`xQueueSend\` | \`xQueueSendFromISR(q, &item, &woken)\` |
| \`xEventGroupSetBits\` | \`xEventGroupSetBitsFromISR\` (it goes through the timer task, so use a notification where speed matters) |

They never block. The variable \`woken\` is set to true if the woken task has a higher priority than the one that was interrupted. Finish the handler with \`portYIELD_FROM_ISR(woken)\`: when \`woken\` is true the scheduler switches to the woken task **at once**, on leaving the handler, instead of at the next tick. Forgetting it adds up to a tick of latency, 1 ms in the Arduino core.

### What to choose

- A **notification** is the cheapest and counts events if the task is slow.
- A **binary semaphore** merges events: ten edges before the task runs make one wake-up.
- A **queue** keeps each event and can carry data such as a time stamp. Use it when each event matters.

### Numbers

A handler that takes 150 µs of work for an event every 200 µs uses 75 % of the core in interrupt context, and everything else crawls. A handler that only notifies takes a few microseconds, about 2 % of the core, and the heavy work becomes an ordinary task that the scheduler can pre-empt and balance. The simulation lets you try both and watch the missed events.

### Traps

Mark the handler \`IRAM_ATTR\`. Do not debounce with \`delay\` in the handler; debounce in the task. If the event rate can exceed the task\'s speed, decide whether losing events is acceptable and choose accordingly.

> [!key] Keep the interrupt handler tiny: record the event, wake a task with a FromISR call, and yield if a more urgent task woke. The task does the real work, at a priority you choose, with every normal tool.`,
  ideas: [
    'A handler cannot wait, print, allocate or take a mutex; it must finish in microseconds.',
    'The pattern is record, wake a task with a FromISR call, return; the task does the work.',
    'portYIELD_FROM_ISR(woken) switches to a more urgent woken task at once instead of at the next tick.',
    'A notification counts, a binary semaphore merges and a queue keeps every event.'
  ],
  pitfalls: [
    'I can call xSemaphoreGive in the handler if I am careful — Normal calls are not safe in a handler. Use the FromISR twin, which never blocks and tells you whether a higher-priority task woke.',
    'The woken task runs immediately — Only if the handler yields and the task outranks the interrupted one. Otherwise it waits for the next tick, up to 1 ms in Arduino and 10 ms in a default ESP-IDF build.',
    'Debounce with a short delay in the handler — A delay in a handler blocks the whole core. Record the time in the handler, or wake a task, and ignore edges that follow too soon after the last accepted one.'
  ],
  terms: [
    { term: 'Deferred interrupt handling', also: ['bottom half', 'top half and bottom half'], def: 'Splitting an interrupt into a tiny handler that records the event and a task that does the real work later.' },
    { term: 'FromISR', also: ['xSemaphoreGiveFromISR', 'xQueueSendFromISR'], def: 'The variants of FreeRTOS calls that are safe inside an interrupt handler. They never block and report whether a higher-priority task was woken.' },
    { term: 'portYIELD_FROM_ISR', also: ['yield from ISR'], def: 'The call at the end of a handler that switches straight to the woken task when it outranks the interrupted one, so there is no wait for the next tick.' },
    { term: 'Interrupt latency', also: ['response time'], def: 'The time from the event to the first instruction of the handler. A task that handles the event runs later, after the scheduler has chosen it.' },
    { term: 'ThreadSafeFlag', also: ['asyncio.ThreadSafeFlag'], def: 'The MicroPython asyncio object that an interrupt handler or a thread can set to wake a coroutine.' }
  ],
  choose: {
    good: ['A notification from the handler to one worker task: cheapest, counts events', 'A queue from the handler when each event carries data, such as a time stamp', 'A short handler with the real work in a task at a priority you choose'],
    avoid: ['Printing, delaying, allocating or locking inside the handler', 'A binary semaphore where each event must be counted', 'Forgetting the yield at the end of the handler in a time-critical path'],
    check: ['The worst-case event rate against the task\'s speed', 'Whether losing or merging events is acceptable', 'That the handler is marked IRAM_ATTR']
  },
  code: [
    {
      title: 'A button wakes a task',
      about: 'A falling edge on the BOOT button runs a tiny handler that notifies a task. The task debounces and prints, using no processor time while it waits.',
      needs: 'An ESP32 DevKit: the BOOT button is on GPIO0 (GPIO9 on C3 and C6 boards).',
      wiring: [['GPIO0', 'the BOOT button to GND', 'already on the board; internal pull-up']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (0) as [input with pull-up v]
          start task [button v]

        when pin (0) goes [low v]    // the interrupt handler: as short as it can be
          notify task [button v]

        define task button
          set [last v] to (0)
          forever
            wait for notification :: tasks    // sleeps until the handler wakes it
            if <((milliseconds since start) - (last)) > (50)> then    // debounce here, not in the handler
              print (join [button pressed at ] (milliseconds since start))
              set [last v] to (milliseconds since start)
            end
          end
      `,
      cpp: String.raw`
        const int BUTTON = 0;                       // BOOT button on an ESP32 DevKit (GPIO9 on C3 and C6 boards)
        TaskHandle_t buttonTaskHandle;

        void IRAM_ATTR onButton() {                 // the interrupt handler: as short as it can be
          BaseType_t woken = pdFALSE;
          vTaskNotifyGiveFromISR(buttonTaskHandle, &woken);   // wake the task that does the real work
          portYIELD_FROM_ISR(woken);                // switch to it at once if it outranks the task we interrupted
        }

        void buttonTask(void *arg) {
          uint32_t last = 0;
          for (;;) {
            ulTaskNotifyTake(pdTRUE, portMAX_DELAY);          // sleeps until the handler wakes it
            uint32_t now = millis();
            if (now - last > 50) {                            // debounce here, not in the handler
              Serial.printf("button pressed at %lu ms\n", (unsigned long)now);
              last = now;
            }
          }
        }

        void setup() {
          Serial.begin(115200);
          pinMode(BUTTON, INPUT_PULLUP);
          xTaskCreate(buttonTask, "button", 3072, nullptr, 3, &buttonTaskHandle);
          attachInterrupt(digitalPinToInterrupt(BUTTON), onButton, FALLING);
        }

        void loop() {
          vTaskDelay(pdMS_TO_TICKS(1000));
        }
      `,
      py: String.raw`
        import asyncio
        import time
        from machine import Pin

        button = Pin(0, Pin.IN, Pin.PULL_UP)        # BOOT button on an ESP32 DevKit (GPIO9 on C3 and C6 boards)
        pressed = asyncio.ThreadSafeFlag()          # safe to set from an interrupt handler

        def on_button(pin):                         # the handler: as short as it can be
            pressed.set()                           # wake the task that does the real work

        button.irq(trigger=Pin.IRQ_FALLING, handler=on_button)

        async def button_task():
            last = 0
            while True:
                await pressed.wait()                # sleeps until the handler sets the flag
                now = time.ticks_ms()
                if time.ticks_diff(now, last) > 50:     # debounce here, not in the handler
                    print("button pressed at", now, "ms")
                    last = now

        asyncio.run(button_task())
      `,
      output: `
        button pressed at 8123 ms
        button pressed at 9457 ms
      `,
      notes: ['Contact bounce makes several edges per press; each one notifies the task, and the 50 ms rule in the task ignores the extra ones.', 'In MicroPython on the ESP32 the handler is scheduled, not a true interrupt: it runs a little later but may use the same short pattern.', 'An ESP-IDF handler registered with gpio_isr_handler_add follows the same rule: the FromISR call, then the yield.']
    }
  ],
  examples: [
    {
      title: 'How much of the core does the handler take?',
      q: 'A sensor raises an interrupt every 200 µs. Doing all the work in the handler takes 150 µs. Giving a notification to a task takes about 5 µs. What share of the core is spent in interrupt context in each design?',
      steps: ['All in the handler: $150 / 200 = 75\\,\\%$ of the core is interrupt time.', 'Notify only: $5 / 200 = 2.5\\,\\%$. The work itself moves to the task, which the scheduler can interleave with others.', 'The task still needs its 150 µs per event, so the total work is the same: what changes is that other tasks and the radio can pre-empt it.'],
      a: '75 % against 2.5 %. The total work does not shrink, but a long handler blocks everything, while a task can be pre-empted and scheduled.'
    }
  ],
  quiz: [
    { q: 'Why does FreeRTOS have separate FromISR functions?', choices: ['They are faster versions of the same calls', 'The normal ones may block or use locks, which a handler cannot do', 'They work only on core 1', 'They are for MicroPython'], a: 1, why: 'A handler has no task to put to sleep, and the normal calls may block or take locks. The FromISR twins never block and report whether a higher-priority task woke.' },
    { q: 'What does portYIELD_FROM_ISR(woken) do at the end of a handler?', choices: ['Disables interrupts', 'Switches at once to the woken task if it outranks the interrupted one', 'Deletes the handler', 'Starts a timer'], a: 1, why: 'Without it the scheduler would pick up the woken task only at the next tick.' },
    { q: 'Ten edges arrive before the task runs. The handler gives a binary semaphore each time. How many wake-ups does the task see?', choices: ['Ten', 'One', 'None', 'It depends on the core'], a: 1, why: 'A binary semaphore holds only "given" or "not given", so the ten gives merge into one. A notification used as a counter, or a queue, would keep all ten.' },
    { q: 'It is acceptable to call Serial.println inside an interrupt handler if the message is short.', a: false, why: 'Printing waits on locks and buffers and may block. Record the event, wake a task, and print from there.' }
  ],
  applications: [
    'A button or encoder edge that wakes a UI task, which debounces and updates the display.',
    'A pulse from a flow meter or a Geiger tube counted in a handler and reported by a task.',
    'A data-ready line from a sensor waking the task that reads it over I2C or SPI.',
    'A hardware timer alarm that wakes a sampling task at a precise rate.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "FreeRTOS (IDF)" and the interrupt allocation and GPIO ISR sections.',
    'Arduino core for ESP32, the attachInterrupt and RepeatTimer examples (core 3.3).',
    'Richard Barry, *Mastering the FreeRTOS Real Time Kernel*, "Interrupt management" (deferred interrupt processing).'
  ],
  sim: 'fr-isr'
},

/* ================================================================ race-conditions */
{
  id: 'race-conditions',
  parent: 'freertos-and-concurrency',
  title: 'Race conditions and critical sections',
  level: 2,
  short: 'counter++ is three steps, and another task or an interrupt can slip in between them. The result is a bug that appears one run in a thousand. Locks, critical sections and ownership are the cures; volatile is not.',
  keywords: ['race condition', 'critical section', 'portENTER_CRITICAL', 'portMUX_TYPE', 'lost update', 'atomic', 'volatile', 'shared variable', 'read-modify-write', 'torn read', 'heisenbug', 'spinlock', 'thread safety', 'std::atomic', 'data race'],
  prereq: ['mutexes-and-semaphores', 'interrupts'],
  related: ['queues', 'from-interrupt-to-task', 'the-loop-task-and-two-cores', 'stack-overflow-and-heap-corruption', 'soak-and-stress-tests'],
  body: `A line such as \`counter++\` looks like one action. To the processor it is three: read the variable into a register, add one, write it back. If two tasks do this at the same time — or one task and an interrupt handler — they can interleave:

| Step | Task A | Task B | counter |
|---|---|---|---|
| 1 | reads 5 | | 5 |
| 2 | | reads 5 | 5 |
| 3 | writes 6 | | 6 |
| 4 | | writes 6 | 6 |

Two increments, a total of one. The second **lost** the first. This is a **race condition**: the result depends on who gets there first. It appears rarely, as a count that is slightly low, a pair of values that do not match, a flag that is missed — and often disappears when you add a \`Serial.print\` to look, because printing changes the timing. It is the classic bug of concurrent programs.

### Where races hide

- A variable written by **one task** and read or written by **another**.
- A variable shared by a task and an **interrupt handler**.
- On a **dual-core** chip, two tasks truly running at the same instant. On one core a task is switched out only at a tick or a wake-up, so races are rarer, never impossible.
- Values wider than the processor\'s word (a 64-bit time, a struct of two fields) that can be **torn**: half updated when read.
- "Check, then act": \`if (!busy) { busy = true; … }\` — two tasks can both see \`busy\` false.

### \`volatile\` is not a lock

\`volatile\` tells the compiler to read the variable from memory each time. It does nothing about the three steps. A \`volatile\` counter loses updates exactly as before. It is right for a flag set by an interrupt and read in a loop, and for nothing more ([[interrupts]]).

### The cures, from best to last resort

1. **Do not share.** Give each piece of data one owner task, and pass changes to it through a [[queues|queue]]. No sharing, no race.
2. **A mutex** around the shared data, held briefly ([[mutexes-and-semaphores]]). Tasks only: it may block.
3. **A critical section**: \`portENTER_CRITICAL(&mux)\` … \`portEXIT_CRITICAL(&mux)\`. On a dual-core chip it takes a spinlock, and it masks interrupts on this core (all but the very highest priorities) while held. It works in handlers too (the \`_ISR\` forms). It must last **microseconds**: no waiting, no printing, no long loops, or the interrupt watchdog resets the chip.
4. **Atomic operations** for a single counter or flag: the C++ \`std::atomic\` types, which the compiler turns into the right instructions.

Test with a **stress**: run both sides flat out, as the program below does, and check the total. A race that shows once a day in the field shows in seconds there ([[soak-and-stress-tests]]).

> [!key] A shared variable updated in several steps can be changed by another task or an interrupt in the middle, and an update is lost. Do not share if you can; otherwise protect the update with a mutex, a very short critical section or an atomic type. volatile does none of this.`,
  ideas: [
    'x++ is read, add, write; if another task or interrupt does the same between the steps, an update is lost.',
    'Races depend on timing, so they are rare, vanish when you add prints, and appear on dual-core chips more than on single-core ones.',
    'volatile only forces a fresh read; it does not make a multi-step update indivisible.',
    'Cures: do not share (one owner, a queue), a mutex, a microsecond-long critical section, or an atomic type.'
  ],
  pitfalls: [
    'My program has been running for days without a problem, so there is no race — Races depend on rare timing. A program can run correctly for days and fail on the day the timing aligns; stress tests find them faster than waiting.',
    'volatile makes counter++ safe — It stops the compiler from caching the value; the three steps are still three steps. Use a lock, a critical section or an atomic type.',
    'A critical section is a faster mutex — It is a different tool: it turns interrupts off and spins the other core, so it must last microseconds and never block. A long one resets the chip.'
  ],
  terms: [
    { term: 'Race condition', also: ['data race', 'race'], def: 'A bug in which the result depends on the order or timing in which tasks or interrupts touch shared data, because an update can be interrupted half way.' },
    { term: 'Critical section', also: ['portENTER_CRITICAL', 'portMUX'], def: 'A short stretch of code during which interrupts on this core are off and, on a dual-core chip, a spinlock keeps the other core out, so no one else can touch the shared data.' },
    { term: 'Atomic operation', also: ['std::atomic', 'indivisible'], def: 'An operation that is carried out completely or not at all, with nothing able to step in between its parts.' },
    { term: 'Read-modify-write', also: ['lost update'], def: 'An update that reads a value, changes it and writes it back. If another task does the same in between, one of the two changes is lost.' },
    { term: 'Torn read', also: ['tearing'], def: 'Reading a value that is wider than the processor\'s word, or several related values, while another task is part-way through changing them.' }
  ],
  choose: {
    good: ['One owner task per piece of data, fed through a queue', 'A mutex around a small struct that several tasks read and write', 'A short critical section for a counter shared with an interrupt handler', 'An atomic type for a single shared counter or flag'],
    avoid: ['volatile as a substitute for protection', 'A critical section that waits, prints or loops for long', 'Assuming that a single-core chip cannot have races'],
    check: ['Every variable touched by more than one task or by a handler', 'Whether two cores can touch it at once', 'That a stress test with both sides flat out gives the expected total']
  },
  code: [
    {
      title: 'Count to 200 000 with two tasks',
      about: 'Two tasks each add one to a shared counter 100 000 times, at the same time on two cores. Without protection the total comes out short; set `PROTECT` to true and it comes out exact.',
      needs: 'A dual-core board (ESP32, ESP32-S3) shows the effect best; on a single-core chip the lost updates are rare, which is itself the lesson. Serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          set [counter v] to (0)
          start task [incrementer A v] on core (0)
          start task [incrementer B v] on core (1)    // core 0 on a single-core chip
          wait until <both incrementers are done>
          print (join [expected 200000, got ] (counter))

        define task incrementer
          repeat (100000)
            // protected version: wrap the next block in lock [counter lock v] and unlock [counter lock v]
            set [counter v] to ((counter) + (1))    // read, add, write: three steps, not one
          end
      `,
      cpp: String.raw`
        #if CONFIG_FREERTOS_UNICORE
          const BaseType_t CORE_B = 0;
        #else
          const BaseType_t CORE_B = 1;
        #endif

        const bool PROTECT = false;                 // true: use a critical section
        const int  ROUNDS  = 100000;
        volatile uint32_t counter = 0;              // volatile does NOT make the update safe
        portMUX_TYPE counterMux = portMUX_INITIALIZER_UNLOCKED;
        SemaphoreHandle_t done;

        void incrementer(void *arg) {
          for (int i = 0; i < ROUNDS; i++) {
            if (PROTECT) portENTER_CRITICAL(&counterMux);
            counter = counter + 1;                  // read, add, write: three steps, not one
            if (PROTECT) portEXIT_CRITICAL(&counterMux);
          }
          xSemaphoreGive(done);
          vTaskDelete(NULL);
        }

        void setup() {
          Serial.begin(115200);
          done = xSemaphoreCreateCounting(2, 0);
          xTaskCreatePinnedToCore(incrementer, "inc A", 3072, nullptr, 1, nullptr, 0);
          xTaskCreatePinnedToCore(incrementer, "inc B", 3072, nullptr, 1, nullptr, CORE_B);
          xSemaphoreTake(done, portMAX_DELAY);      // wait for both tasks to finish
          xSemaphoreTake(done, portMAX_DELAY);
          Serial.printf("expected %d, got %lu\n", 2 * ROUNDS, (unsigned long)counter);
        }

        void loop() {}
      `,
      py: String.raw`
        import _thread
        import time

        PROTECT = False                             # True: use a lock
        ROUNDS = 100000
        counter = 0
        lock = _thread.allocate_lock()
        finished = [False, False]

        def incrementer(which):
            global counter
            for _ in range(ROUNDS):
                if PROTECT:
                    with lock:
                        counter = counter + 1       # read, add, write: not one step
                else:
                    counter = counter + 1
            finished[which] = True

        _thread.start_new_thread(incrementer, (0,))
        _thread.start_new_thread(incrementer, (1,))
        while not (finished[0] and finished[1]):    # wait for both threads to finish
            time.sleep_ms(10)
        print("expected", 2 * ROUNDS, "got", counter)
      `,
      output: `
        expected 200000, got 138273
      `,
      notes: ['The number you get differs from run to run: that is the signature of a race. With PROTECT true it is always exactly 200000.', 'MicroPython threads share one core and switch only at certain points, so the loss may be small or absent in a short run. Absence of the error in a test is not proof of safety.', 'A mutex in place of the critical section also works; the critical section is faster for a three-instruction update, but it must stay that short.']
    }
  ],
  examples: [
    {
      title: 'Why the total is short',
      q: 'Two tasks each add 1 to a shared counter 100 000 times without protection. The total is 138 273 instead of 200 000. How many updates were lost, and why?',
      steps: ['Lost: $200\\,000 - 138\\,273 = 61\\,727$ updates, about 31 %.', 'Each lost update is a moment when both tasks had read the same value before either wrote it back, so two additions produced one.', 'Because the tasks run flat out on two cores the overlap is common, which makes the loss large. With rare updates the same bug would lose almost none and be hard to find.'],
      a: '61 727 updates (31 %) were lost to read-modify-write overlaps. The fix is a lock, a critical section or an atomic add; the real lesson is that a rare race is harder, not safer.'
    }
  ],
  quiz: [
    { q: 'Which of these does NOT protect a shared counter updated by two tasks?', choices: ['A mutex around the update', 'A short critical section around it', 'Declaring the counter volatile', 'An atomic type'], a: 2, why: 'volatile only forces the value to be re-read. The read-add-write sequence can still be interleaved.' },
    { q: 'A critical section (portENTER_CRITICAL) should contain:', choices: ['The whole network request', 'A delay of 100 ms', 'Only a few instructions, with no waiting', 'A call to Serial.println'], a: 2, why: 'It turns interrupts off on the core and spins the other one, so it must last microseconds. Anything slow can trip the interrupt watchdog.' },
    { q: 'Races are impossible on a single-core chip, because only one task runs at a time.', a: false, why: 'The scheduler can switch tasks, and an interrupt can fire, between the steps of an update. Races are rarer on one core but still real.' },
    { q: 'What is the best cure when it can be used?', choices: ['A faster processor', 'Not sharing the data: one owner task that others send requests to through a queue', 'A longer delay in one task', 'A bigger stack'], a: 1, why: 'Data with a single owner cannot race. Everything else needs a lock, a critical section or atomics, and each of those has costs.' }
  ],
  applications: [
    'A counter of pulses incremented in an interrupt handler and read by a reporting task.',
    'A configuration struct updated from a web page while a control task reads it.',
    'A 64-bit time stamp that a handler writes and a task reads, which must not be torn.',
    'A flag meaning "upload in progress" that two tasks check and set, which needs an atomic check-and-set.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "FreeRTOS (IDF)": critical sections and spinlocks, and the sections on thread safety.',
    'Arduino core for ESP32, the FreeRTOS and timer examples that use portMUX (core 3.3).',
    'Richard Barry, *Mastering the FreeRTOS Real Time Kernel*, "Resource management".'
  ],
  sim: 'fr-race'
},

/* ================================================================ task-stacks */
{
  id: 'task-stacks',
  parent: 'freertos-and-concurrency',
  title: 'Task stacks and the high-water mark',
  level: 2,
  short: 'Every task has a fixed stack, and nothing makes it grow. Measure how much a task really uses with the high-water mark, add a margin, and keep big arrays and deep recursion off it.',
  keywords: ['stack', 'stack overflow', 'high water mark', 'uxTaskGetStackHighWaterMark', 'stack size', 'SET_LOOP_TASK_STACK_SIZE', 'canary', 'recursion', 'local array', 'stack_use', 'stack frame', 'Guru Meditation', 'heap', 'xTaskCreate stack depth'],
  prereq: ['tasks', 'stack-heap-and-static'],
  related: ['stack-overflow-and-heap-corruption', 'the-loop-task-and-two-cores', 'guru-meditation-and-backtraces', 'using-psram', 'functions'],
  body: `Each task has its own **stack**: a region of RAM where its function calls keep their return addresses, their arguments and their local variables. The size is fixed when the task is created; nothing makes it grow. When a task uses more than it has, the extra spills into whatever lies next to it in memory and corrupts it. That is a **stack overflow**, and it is among the most common causes of crashes in task-based programs.

### What uses stack

- **Local variables.** A \`char buffer[1024]\` in a task function takes 1 KB of that task\'s stack, every time it runs.
- **Function calls**, each with its own frame, so a long chain of calls or a **recursion** eats stack in proportion to its depth.
- **Library functions.** \`Serial.printf\` with floating point, JSON handling, TLS and HTTPS can need several kilobytes. That is why a task that only blinks an LED needs 1–2 KB while one that fetches a web page needs 8 KB or more.

Big buffers belong in **static** variables or on the **heap**, not on the stack ([[stack-heap-and-static]]).

### Sizes to start from

| Task | Stack |
|---|---|
| Arduino \`loop()\` (loopTask) | 8192 bytes; larger with \`SET_LOOP_TASK_STACK_SIZE\` |
| A small sensor or blink task | 2048 bytes |
| A task with formatted printing | 3072–4096 bytes |
| A task with HTTPS, JSON, TLS | 8192 bytes or more |
| MicroPython\'s main task | 16 KiB |

The unit is **bytes** on the ESP32 (a FreeRTOS book counts words).

### Measuring: the high-water mark

\`uxTaskGetStackHighWaterMark(NULL)\` returns the **least free stack the task has ever had**, in bytes. The system fills each new stack with a known pattern and looks at how much of it has been overwritten. The recipe:

1. Give a new task a generous stack (4096).
2. Run it through everything it will ever do, including the worst case: an error path, a long message, a reconnect.
3. Read the high-water mark. Used = stack size minus mark.
4. Set the size to used plus about 25 %, and keep measuring.

Printing the mark from the task itself is the simplest way. MicroPython offers \`micropython.stack_use()\`, which reports the stack in use at that moment.

### What an overflow looks like

FreeRTOS checks a few guard bytes at the end of the stack each time it switches tasks. If they have been changed it stops with a message like "A stack overflow in task … has been detected" and a backtrace ([[stack-overflow-and-heap-corruption]]). The check is **after the fact**: a fast overflow can corrupt data before any check, so a mysterious crash in a task is first of all a reason to look at its stack.

> [!key] A task\'s stack is fixed, in bytes, and overflow corrupts neighbouring memory. Start generous, measure the high-water mark under the worst case, set the size to what was used plus a quarter, and keep big arrays off the stack.`,
  ideas: [
    'Each task has a fixed stack that holds call frames and local variables; it cannot grow.',
    'Big local arrays, deep calls and heavy library functions (printf with floats, TLS) are what fill it.',
    'uxTaskGetStackHighWaterMark gives the least free stack ever, in bytes; size = used + about 25 %.',
    'An overflow corrupts neighbouring memory; FreeRTOS notices only at a task switch, by a guard pattern.'
  ],
  pitfalls: [
    'A bigger stack is always safer — It only wastes RAM that other tasks and the heap could use. Measure and size to what is used plus a margin.',
    'If it does not crash, the stack is big enough — Overflow may corrupt data silently, and the worst path (an error, a long message) may not have run yet. Check the high-water mark under the worst case.',
    'A large local array is fine because the heap is big — A local array lives on the task\'s small stack, not the heap. Make it static or allocate it from the heap.'
  ],
  terms: [
    { term: 'Stack', also: ['call stack', 'task stack'], def: 'The region of RAM a task uses for function-call frames, arguments and local variables. Its size is fixed when the task is created.' },
    { term: 'Stack overflow', also: ['stack smashing'], def: 'Using more stack than the task has, so that the excess overwrites neighbouring memory.' },
    { term: 'Stack high-water mark', also: ['uxTaskGetStackHighWaterMark', 'stack watermark'], def: 'The smallest amount of free stack a task has had since it started, in bytes. It tells you how close the task has come to overflowing.' },
    { term: 'Stack canary', also: ['guard bytes', 'stack guard'], def: 'A known pattern placed at the end of a stack. If it has changed when the scheduler checks it, the stack has overflowed.' },
    { term: 'Stack frame', also: ['call frame'], def: 'The part of a stack used by one function call: its return address, arguments and local variables.' }
  ],
  choose: {
    good: ['2048–4096 bytes as a first guess for small tasks, then measuring', 'Static or heap buffers for anything larger than a few hundred bytes', 'A margin of about a quarter above the measured use'],
    avoid: ['Large local arrays and deep or unbounded recursion in a task', 'Sizing from a book that counts in words', 'Shrinking a stack before the worst case has been run'],
    check: ['The high-water mark after the worst path has run', 'Which libraries the task calls: printf with floats, JSON, TLS', 'Total RAM: the sum of all stacks plus the heap you need']
  },
  code: [
    {
      title: 'How deep can it go?',
      about: 'A task calls a function that calls itself 1, then 5, then 10 levels deep, and after each prints the least free stack it has had (MicroPython: the most stack it has used). Watch the figure fall as the calls get deeper.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud. The numbers differ between chips and versions.',
      blocks: `
        when started
          start serial at (115200) baud
          start task [stack demo v]

        define task stack demo
          for each [depth v] in (list 1 5 10)
            dive (depth) :: my
            print (join [least free stack so far: ] (free stack of this task))
            wait (1) seconds
          end

        define dive (depth)
          if <(depth) > (0)> then
            dive ((depth) - (1)) :: my    // each call keeps a frame on the stack
          end
      `,
      cpp: String.raw`
        void dive(int depth) {
          volatile char pad[100];                   // each level keeps about 100 bytes, plus the call itself
          pad[0] = (char)depth;
          if (depth > 0) dive(depth - 1);           // each call keeps a frame on the stack
        }

        void stackDemo(void *arg) {
          const int depths[] = { 1, 5, 10 };
          for (int depth : depths) {
            dive(depth);
            Serial.printf("depth %2d: least free stack so far %u of 4096 bytes\n",
                          depth, (unsigned)uxTaskGetStackHighWaterMark(NULL));
            vTaskDelay(pdMS_TO_TICKS(1000));
          }
          vTaskDelete(NULL);
        }

        void setup() {
          Serial.begin(115200);
          xTaskCreate(stackDemo, "stack demo", 4096, nullptr, 1, nullptr);   // 4096 bytes of stack
        }

        void loop() {
          vTaskDelay(pdMS_TO_TICKS(1000));
        }
      `,
      py: String.raw`
        import micropython
        import time

        peak = 0

        def dive(depth):
            global peak
            if depth > 0:
                dive(depth - 1)                     # each call keeps a frame on the stack
            else:
                peak = max(peak, micropython.stack_use())    # the stack in use at the deepest point

        for depth in (1, 5, 10):
            dive(depth)
            print("depth", depth, "- most stack used so far", peak, "bytes")
            time.sleep(1)
      `,
      output: `
        depth  1: least free stack so far 3012 of 4096 bytes
        depth  5: least free stack so far 2548 of 4096 bytes
        depth 10: least free stack so far 1964 of 4096 bytes
      `,
      notes: ['The figures above are only an example: each chip, compiler and core version gives its own. The pattern is what matters: the mark falls with depth and never rises again.', 'MicroPython raises a RuntimeError ("maximum recursion depth exceeded") before the real stack is used up; that is its guard against overflow.', 'To size a real task, run it through its worst case and print the mark once, at the end.']
    }
  ],
  examples: [
    {
      title: 'Trimming the stacks',
      q: 'A task was created with a 4096-byte stack. After the worst case has run, uxTaskGetStackHighWaterMark reports 2600 bytes. What stack should it get, and how much RAM do six such tasks save?',
      steps: ['Used: $4096 - 2600 = 1496$ bytes.', 'Add a quarter: $1496 \\times 1.25 \\approx 1870$, so round up to 2048.', 'Saving per task: $4096 - 2048 = 2048$ bytes; six tasks: $6 \\times 2048 = 12\\,288$ bytes, about 12 KB.'],
      a: 'A 2048-byte stack, saving about 12 KB over six tasks — provided the measurement really included the worst path.'
    }
  ],
  quiz: [
    { q: 'What does uxTaskGetStackHighWaterMark return?', choices: ['The stack size', 'The most stack the task is using right now', 'The least free stack the task has ever had, in bytes', 'The number of tasks'], a: 2, why: 'It is the smallest amount of free stack since the task started: a measure of how close it has come to overflowing.' },
    { q: 'A task with a 2048-byte stack declares char msg[2500] as a local variable. What happens?', choices: ['The compiler moves it to the heap', 'It overflows the stack and corrupts memory or crashes', 'It works, because the heap is big', 'Nothing until it is read'], a: 1, why: 'A local array lives on the task\'s stack. 2500 bytes do not fit in 2048.' },
    { q: 'On the ESP32 the stack depth of xTaskCreate is counted in bytes.', a: true, why: 'Espressif\'s FreeRTOS takes bytes, unlike the FreeRTOS book, which counts words.' },
    { q: 'You measure a high-water mark of 3000 free bytes of 4096 after a short test. What is the best next step?', choices: ['Set the stack to 1100 bytes', 'Run the worst case (errors, long messages, reconnects) and measure again', 'Leave it for ever', 'Double the stack'], a: 1, why: 'A test that skips the worst path under-reports. Measure at the worst case, then size to the use plus a margin.' }
  ],
  applications: [
    'Sizing the tasks of a Wi-Fi sensor node so that the total of all stacks leaves room for the heap.',
    'Diagnosing a task that crashes only when a long JSON message arrives.',
    'Moving a 4 KB display buffer from a task\'s stack to a static array after an overflow.',
    'Enlarging the loop task of a sketch that uses HTTPS with SET_LOOP_TASK_STACK_SIZE.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "FreeRTOS (IDF)" (stack depth in bytes) and the stack overflow detection options.',
    'Arduino core for ESP32, the ArduinoStackSize example (core 3.3).',
    'MicroPython documentation, the micropython module: stack_use (version 1.29).'
  ],
  sim: 'fr-stack'
},

/* ================================================================ software-timers */
{
  id: 'software-timers',
  parent: 'freertos-and-concurrency',
  title: 'Software timers',
  level: 2,
  short: 'A software timer calls a function after a delay or at regular intervals, without a task of your own. The callback runs in the timer service task, so it must be short and must never wait.',
  keywords: ['software timer', 'xTimerCreate', 'xTimerStart', 'xTimerStop', 'xTimerChangePeriod', 'timer service task', 'Tmr Svc', 'auto-reload', 'one-shot', 'callback', 'esp_timer', 'Ticker', 'machine.Timer', 'timeout', 'periodic', 'xTimerStartFromISR'],
  prereq: ['tasks', 'delays-and-yielding'],
  related: ['hardware-timers', 'from-interrupt-to-task', 'queues', 'timeouts-and-timed-states', 'non-blocking-timing'],
  body: `Many jobs are really "do this later" or "do this every so often": switch the backlight off after ten seconds, flip an LED every half second, give up waiting for a reply after two. One could make a task for each, with a delay in a loop, but every task costs a stack. A **software timer** does the same with no task of its own: you give it a period and a **callback** function, and FreeRTOS calls the function when time is up.

### How it works

~~~cpp
TimerHandle_t t = xTimerCreate("name", pdMS_TO_TICKS(500), pdTRUE, nullptr, callback);
xTimerStart(t, 0);
~~~

The arguments: a name for debugging, the period in ticks, whether it **reloads** itself (\`pdTRUE\`: periodic; \`pdFALSE\`: **one-shot**, fires once), an id of your choice, and the callback \`void callback(TimerHandle_t t)\`. \`xTimerStop\`, \`xTimerReset\` and \`xTimerChangePeriod\` control it afterwards. The second argument of the control calls is how long to wait for room in the timer\'s command queue; 0 is right in most places.

All software timers share **one task**, the **timer service task** (shown as "Tmr Svc"). Your calls are not carried out in place: they become commands in a queue, and that task executes them and runs the callbacks.

### The rules of a callback

- It runs in the timer service task, **not in an interrupt** and not in your task. FreeRTOS calls that do not block are fine in it.
- It must be **short and must never wait**. A callback that calls \`vTaskDelay\`, or waits for a queue, delays every other timer in the system for that long.
- It can be pre-empted by a task of higher priority than the timer service task (priority 1 by default, so many of yours will).
- Its timing is one tick of resolution, and only as exact as the timer task\'s turn: jitter of a millisecond or more is normal.

### Choosing among the ways to time things

| Tool | Resolution | Runs in | Good for |
|---|---|---|---|
| Software timer | a tick (1 ms in Arduino) | timer service task | timeouts and housekeeping |
| \`esp_timer\` and the \`Ticker\` library | microseconds | an \`esp_timer\` task | precise periodic callbacks, still not in a handler |
| Hardware timer ([[hardware-timers]]) | a microsecond or better | an interrupt handler | exact sampling and pulses |
| A task with \`xTaskDelayUntil\` | a tick | your task | work that needs a stack and may wait |

The usual use of a one-shot is a **timeout**: start it when something begins and stop it when it completes; if it fires, the thing took too long. From an interrupt use \`xTimerStartFromISR\`, a handy way to debounce: a one-shot started by the first edge fires when the bouncing is over.

> [!key] A software timer calls your function on a schedule from the shared timer service task, with no stack of your own. Keep callbacks short, never wait in them, and use a hardware timer or esp_timer when microsecond accuracy matters.`,
  ideas: [
    'A software timer calls a callback after a delay (one-shot) or repeatedly (auto-reload) with no task of its own.',
    'All callbacks run in the single timer service task, so a callback that waits delays every other timer.',
    'Resolution is a tick and jitter of a millisecond or more is normal; use esp_timer or a hardware timer for finer work.',
    'A one-shot started at the beginning of something and stopped at its end makes a neat timeout.'
  ],
  pitfalls: [
    'A timer callback is an interrupt handler — It is an ordinary function run by a task. It may use normal FreeRTOS calls, but must not wait for anything.',
    'I can call delay() in a callback if it is short — Any wait stops the timer service task, so every other timer is late by that long. Keep callbacks to a few microseconds of work.',
    'A software timer is as precise as a hardware timer — It is limited to one tick and to the scheduling of the timer task. For microsecond timing use a hardware timer.'
  ],
  terms: [
    { term: 'Software timer', also: ['FreeRTOS timer', 'xTimerCreate'], def: 'A FreeRTOS facility that calls a function once or repeatedly after a given time, without a task of its own. The callbacks all run in the timer service task.' },
    { term: 'Timer service task', also: ['Tmr Svc', 'timer daemon'], def: 'The single FreeRTOS task that carries out timer commands and runs every software timer callback.' },
    { term: 'One-shot timer', also: ['single-shot'], def: 'A timer that fires its callback once and then stops until it is started again.' },
    { term: 'Auto-reload timer', also: ['periodic timer'], def: 'A timer that restarts itself each time it fires, so its callback runs every period.' },
    { term: 'esp_timer', also: ['Ticker'], def: 'The ESP-IDF high-resolution timer service, with microsecond periods; the Arduino Ticker library is built on it. Its callbacks run in a dedicated task.' }
  ],
  choose: {
    good: ['Timeouts: start a one-shot when something begins, stop it when it ends', 'Periodic housekeeping such as a heartbeat LED or a once-a-minute check', 'A one-shot started from an interrupt as a debounce timer'],
    avoid: ['Waiting, printing at length or doing slow work in a callback', 'Using a software timer where microsecond accuracy matters', 'Many long callbacks sharing the one timer service task'],
    check: ['That every callback finishes in microseconds', 'Whether a tick of resolution is fine enough', 'That the timer is stopped or deleted when it is no longer needed']
  },
  code: [
    {
      title: 'A blink timer and a stop timer',
      about: 'A periodic timer flips the LED every 500 ms. A one-shot timer fires after five seconds, stops the blinking and says so. No task is created and `loop()` has nothing to do.',
      needs: 'An ESP32 DevKit with an LED on GPIO2, or any board with an LED you can name. Serial monitor at 115200 baud.',
      wiring: [['GPIO2', 'the on-board LED', 'or: GPIO2 → 220 Ω → LED → GND']],
      blocks: `
        when started
          set pin (2) as [output v]
          start serial at (115200) baud
          start timer [blink v] every (0.5) seconds
          start timer [stop v] once after (5) seconds

        when timer [blink v] fires
          toggle pin (2)

        when timer [stop v] fires
          stop timer [blink v]
          set pin (2) to [LOW v]
          print [blinking stopped]
      `,
      cpp: String.raw`
        #include "freertos/timers.h"

        const int LED = 2;
        TimerHandle_t blinkTimer, stopTimer;

        void onBlink(TimerHandle_t t) {              // runs in the timer service task: short, never waits
          static bool on = false;
          on = !on;
          digitalWrite(LED, on);
        }

        void onStop(TimerHandle_t t) {
          xTimerStop(blinkTimer, 0);                 // 0: do not wait for room in the command queue
          digitalWrite(LED, LOW);
          Serial.println("blinking stopped");
        }

        void setup() {
          Serial.begin(115200);
          pinMode(LED, OUTPUT);
          blinkTimer = xTimerCreate("blink", pdMS_TO_TICKS(500), pdTRUE, nullptr, onBlink);    // pdTRUE: reloads itself
          stopTimer  = xTimerCreate("stop", pdMS_TO_TICKS(5000), pdFALSE, nullptr, onStop);    // pdFALSE: fires once
          xTimerStart(blinkTimer, 0);
          xTimerStart(stopTimer, 0);
        }

        void loop() {
          vTaskDelay(pdMS_TO_TICKS(1000));           // nothing to do: the timers do the work
        }
      `,
      py: String.raw`
        from machine import Pin, Timer

        led = Pin(2, Pin.OUT)

        def on_blink(t):                             # a scheduled callback: keep it short
            led.toggle()

        def on_stop(t):
            blink_timer.deinit()                     # stop the periodic timer
            led.value(0)
            print("blinking stopped")

        blink_timer = Timer(0)                       # timer ids 0-3 (0-1 on the C3, C6, H2; 0 on the C2)
        stop_timer = Timer(1)
        blink_timer.init(period=500, mode=Timer.PERIODIC, callback=on_blink)     # every 500 ms
        stop_timer.init(period=5000, mode=Timer.ONE_SHOT, callback=on_stop)      # once, after 5 s
      `,
      output: `
        blinking stopped
      `,
      notes: ['The LED blinks ten times and then stays off; the message appears once, after five seconds.', 'MicroPython\'s `machine.Timer` is a hardware timer whose callback is run as a scheduled function, not a FreeRTOS software timer; for this use the effect is the same. The C2 has only timer 0.', 'The Arduino `Ticker` library does the same job on `esp_timer`: `ticker.attach_ms(500, toggle)`.']
    }
  ],
  examples: [
    {
      title: 'A backlight timeout',
      q: 'A display\'s backlight should go off 10 seconds after the last button press. Sketch it with one software timer.',
      steps: ['Create a one-shot timer of 10 s whose callback switches the backlight off.', 'On every button press switch the backlight on and call `xTimerReset` on the timer, which restarts the 10 s from now.', 'If no press comes, the timer fires and the callback turns the light off. No task and no polling are needed.'],
      a: 'One one-shot timer, restarted by each press. The callback only has to switch a pin, so it is short and safe in the timer service task.'
    }
  ],
  quiz: [
    { q: 'In which context does a FreeRTOS software timer callback run?', choices: ['An interrupt handler', 'The task that started the timer', 'The timer service task', 'A new task for each callback'], a: 2, why: 'All callbacks run in the one timer service task. That is why they must be short and must not block.' },
    { q: 'Which of these is safe in a software timer callback?', choices: ['vTaskDelay(100)', 'xQueueReceive with an unlimited wait', 'Toggling a pin and sending to a queue with a timeout of 0', 'A 2-second HTTP request'], a: 2, why: 'Anything that waits delays every other software timer. Short, non-blocking actions are fine.' },
    { q: 'What is the difference between an auto-reload and a one-shot timer?', choices: ['Auto-reload fires once; one-shot repeats', 'Auto-reload repeats every period; one-shot fires once and stops', 'There is none', 'One-shot uses hardware'], a: 1, why: 'pdTRUE in xTimerCreate makes a periodic timer; pdFALSE a one-shot.' },
    { q: 'For sampling a signal exactly every 50 microseconds, a software timer is the best choice.', a: false, why: 'A software timer has a tick of resolution (1 ms) and runs in a task. Use a hardware timer, which can interrupt every 50 µs, or esp_timer with a microsecond period.' }
  ],
  applications: [
    'A backlight or screen-saver timeout restarted by each touch or button press.',
    'A watchdog for a network request: start a one-shot when it begins, stop it on the reply.',
    'A periodic housekeeping job such as checking the battery once a minute.',
    'A debounce timer: the first edge of a button starts a one-shot, and the task reads the pin when it fires.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "FreeRTOS (IDF)" and "High Resolution Timer (esp_timer)".',
    'Arduino core for ESP32 documentation: the Ticker library and the FreeRTOS examples (core 3.3).',
    'Richard Barry, *Mastering the FreeRTOS Real Time Kernel*, "Software timer management".'
  ],
  sim: 'fr-timers'
},

/* ================================================================ asyncio-in-micropython */
{
  id: 'asyncio-in-micropython',
  parent: 'freertos-and-concurrency',
  title: 'asyncio and threads in MicroPython',
  level: 2,
  short: 'MicroPython\'s asyncio runs many jobs in one thread, each handing over control at an await. No races between jobs and no priorities, but one job that blocks stops them all. Threads exist, and are rarely the better tool.',
  keywords: ['asyncio', 'coroutine', 'async def', 'await', 'create_task', 'sleep_ms', 'gather', 'event loop', 'cooperative multitasking', '_thread', 'Lock', 'Event', 'ThreadSafeFlag', 'aioble', 'blocking', 'start_new_thread', 'GIL'],
  prereq: ['tasks', 'delays-and-yielding'],
  related: ['priorities-and-scheduling', 'race-conditions', 'from-interrupt-to-task', 'non-blocking-timing', 'micropython-setup'],
  body: `MicroPython has a second answer to "do several things at once", and for most programs it is the better one. **asyncio** runs many jobs in one thread, taking turns. Each job is a **coroutine**: a function declared with \`async def\` that runs until it reaches an \`await\`, where it hands control back to the **event loop**, which runs another job that is ready. Nothing pre-empts a coroutine; it gives way only where it says \`await\`.

### The pieces

- \`async def blink():\` defines a coroutine. Calling it creates the job but does not run it.
- \`asyncio.create_task(blink())\` hands it to the event loop.
- \`await asyncio.sleep_ms(500)\` waits without blocking: while this job sleeps, others run.
- \`asyncio.run(main())\` starts the loop with a first coroutine and runs until it ends.
- \`asyncio.gather(a(), b())\` runs several and waits for them all.
- \`asyncio.Event\` lets one job wake another; \`asyncio.Lock\` guards a stretch of code that itself contains an \`await\`.
- \`asyncio.ThreadSafeFlag\` is the bridge from an interrupt handler or a thread to a coroutine ([[from-interrupt-to-task]]).

### The one rule

**Never block.** \`time.sleep(1)\` inside a coroutine holds the whole loop for a second: no other job runs, whatever its importance. The same goes for a long calculation, a blocking read, or a loop that waits for a pin without an \`await\`. Everything that waits must \`await\`.

### What you gain, what you give up

| | asyncio | FreeRTOS tasks ([[tasks]]) |
|---|---|---|
| Switching | only at an \`await\` | any time (pre-emptive) |
| Priorities | none: all jobs equal | yes |
| Races between jobs | no, on plain variables | yes ([[race-conditions]]) |
| Locks | rarely | often |
| A job that never waits | stops everyone | pre-empted by higher priorities |
| Memory | a small object per job | a stack per task |
| Guaranteed response time | no | yes, with priorities |

Because jobs switch only at \`await\`, two coroutines can share a variable with no lock: the update is finished before anyone else runs. That removes the hardest bugs of concurrency. In return, the response time of every job is the longest stretch between awaits in all of them.

### Threads

\`_thread.start_new_thread(f, args)\` starts a real thread, a FreeRTOS task. On the ESP32 all MicroPython threads share one core with the main program and take turns holding the interpreter\'s global lock. They are pre-emptive, so they need locks (\`_thread.allocate_lock()\`), and each needs RAM for its stack. They are right for one thing: a blocking call you cannot await, such as a library that waits internally. Otherwise reach for asyncio.

The same style runs the asynchronous network and radio libraries: asyncio streams for HTTP, \`aioespnow\` for ESP-NOW, \`aioble\` for Bluetooth LE.

> [!key] asyncio runs many jobs in one thread, each yielding at an await: no pre-emption, no priorities, and no races on plain variables, but one job that blocks stops them all. Use it by default; use threads only for blocking calls you cannot await.`,
  ideas: [
    'A coroutine runs until it reaches an await, where the event loop can run another job.',
    'Never block in a coroutine: time.sleep holds every other job; use await asyncio.sleep_ms instead.',
    'Jobs switch only at await, so they share plain variables without races and rarely need locks.',
    '_thread gives pre-emptive threads on one core with a lock; use it only for blocking calls you cannot await.'
  ],
  pitfalls: [
    'asyncio runs jobs in parallel — It runs them one at a time, taking turns. It gives concurrency of waiting, not extra speed: a long calculation delays every other job.',
    'time.sleep_ms in a coroutine is fine for short waits — It blocks the whole event loop for that time. Always await asyncio.sleep_ms; a blocking sleep is for the code outside the loop, if anywhere.',
    'asyncio code needs locks everywhere, like threads — Only when an await sits inside the stretch that must not be interleaved. Between awaits nothing else can run.'
  ],
  terms: [
    { term: 'Coroutine', also: ['async def', 'async function'], def: 'A function declared with async def that can pause at an await and be resumed later. Calling it creates the job; the event loop runs it.' },
    { term: 'Event loop', also: ['asyncio loop', 'scheduler'], def: 'The part of asyncio that runs the ready coroutines one at a time and wakes the sleeping ones when their time is up.' },
    { term: 'await', also: ['yield point'], def: 'The keyword that marks where a coroutine waits for something and lets the event loop run other jobs.' },
    { term: 'Cooperative multitasking', also: ['non-pre-emptive'], def: 'Sharing the processor between jobs that hand it over voluntarily. A job that does not hand it over stops all the others.' },
    { term: 'asyncio.ThreadSafeFlag', also: ['ThreadSafeFlag'], def: 'A flag that an interrupt handler or a thread can set safely to wake a waiting coroutine.' },
    { term: '_thread', also: ['MicroPython threads', 'start_new_thread'], def: 'The MicroPython module for real pre-emptive threads. On the ESP32 they are FreeRTOS tasks that share one core with the main program.' }
  ],
  choose: {
    good: ['Several I/O-bound jobs: a sensor, a web request and a blinking LED together', 'Waiting for network, pins or timers without blocking the rest', 'Programs where you want no locks and no races between jobs'],
    avoid: ['Heavy calculations inside a coroutine: they stop every other job', 'time.sleep or blocking reads in a coroutine', 'Threads, unless a library blocks and offers no async form'],
    check: ['The longest stretch between awaits, in every job', 'That every wait is an await', 'Which interrupts need a ThreadSafeFlag to reach the loop']
  },
  code: [
    {
      title: 'Three jobs, taking turns',
      about: 'A heartbeat LED, a button counter polled every 20 ms and a report every two seconds, all in one thread. The FreeRTOS version of the same program is the C++ one.',
      needs: 'An ESP32 DevKit with an LED on GPIO2 and the BOOT button on GPIO0 (GPIO9 on C3 and C6 boards).',
      wiring: [['GPIO2', 'the on-board LED', 'or: GPIO2 → 220 Ω → LED → GND'], ['GPIO0', 'the BOOT button to GND', 'already on the board; internal pull-up']],
      blocks: `
        when started
          set pin (2) as [output v]
          set pin (0) as [input with pull-up v]
          set [presses v] to (0)
          start serial at (115200) baud
          start task [blink v]
          start task [watch button v]
          start task [report v]

        define task blink
          forever
            toggle pin (2)
            wait (0.5) seconds
          end

        define task watch button
          set [was down v] to <false>
          forever
            set [down v] to <(read pin (0)) = [LOW v]>
            if <<down> and <not <was down>>> then
              change [presses v] by (1)
            end
            set [was down v] to (down)
            wait (0.02) seconds
          end

        define task report
          forever
            print (join [presses: ] (presses))
            wait (2) seconds
          end
      `,
      cpp: String.raw`
        const int LED = 2;
        const int BUTTON = 0;                        // GPIO9 on C3 and C6 boards
        volatile int presses = 0;                    // one writer and one reader of a 32-bit value

        void blinkTask(void *arg) {                  // job 1: heartbeat
          bool on = false;
          for (;;) {
            on = !on;
            digitalWrite(LED, on);
            vTaskDelay(pdMS_TO_TICKS(500));
          }
        }

        void buttonTask(void *arg) {                 // job 2: poll the button every 20 ms
          bool wasDown = false;
          for (;;) {
            bool down = digitalRead(BUTTON) == LOW;
            if (down && !wasDown) presses = presses + 1;
            wasDown = down;
            vTaskDelay(pdMS_TO_TICKS(20));
          }
        }

        void reportTask(void *arg) {                 // job 3: a report every 2 s
          for (;;) {
            Serial.printf("presses: %d\n", presses);
            vTaskDelay(pdMS_TO_TICKS(2000));
          }
        }

        void setup() {
          Serial.begin(115200);
          pinMode(LED, OUTPUT);
          pinMode(BUTTON, INPUT_PULLUP);
          xTaskCreate(blinkTask, "blink", 2048, nullptr, 1, nullptr);
          xTaskCreate(buttonTask, "button", 2048, nullptr, 1, nullptr);
          xTaskCreate(reportTask, "report", 3072, nullptr, 1, nullptr);
        }

        void loop() {
          vTaskDelay(pdMS_TO_TICKS(1000));
        }
      `,
      py: String.raw`
        import asyncio
        from machine import Pin

        led = Pin(2, Pin.OUT)
        button = Pin(0, Pin.IN, Pin.PULL_UP)         # GPIO9 on C3 and C6 boards
        presses = 0

        async def blink():                           # job 1: heartbeat
            while True:
                led.toggle()
                await asyncio.sleep_ms(500)

        async def watch_button():                    # job 2: poll the button every 20 ms
            global presses
            was_down = False
            while True:
                down = button.value() == 0
                if down and not was_down:
                    presses += 1
                was_down = down
                await asyncio.sleep_ms(20)

        async def report():                          # job 3: a report every 2 s
            while True:
                print("presses:", presses)
                await asyncio.sleep_ms(2000)

        async def main():
            asyncio.create_task(blink())
            asyncio.create_task(watch_button())
            asyncio.create_task(report())
            while True:
                await asyncio.sleep(1)

        asyncio.run(main())
      `,
      output: `
        presses: 0
        presses: 2
        presses: 2
        presses: 5
      `,
      notes: ['In MicroPython no lock guards `presses`: the three coroutines switch only at an await, so `presses += 1` cannot be interrupted.', 'In C++ the tasks really run at the same time. `presses` is one 32-bit value with one writer and one reader, which is safe; a second writer would need a lock or an atomic type.', 'Put a `time.sleep(1)` in one coroutine and watch the blink and the button counting stop: that is the cost of cooperating.']
    }
  ],
  examples: [
    {
      title: 'Why does the blink stutter?',
      q: 'A MicroPython program blinks an LED every 500 ms in one coroutine, and in another runs `time.sleep_ms(300)` as a stand-in for "reading a slow sensor". The LED stutters. Why, and what is the cure?',
      steps: ['`time.sleep_ms(300)` blocks the whole event loop for 300 ms: the blink coroutine cannot run during it.', 'Each pass of the sensor coroutine therefore delays the next blink by up to 300 ms.', 'Replace it with `await asyncio.sleep_ms(300)`, which yields; if the reading really is a blocking call, move it to a thread.'],
      a: 'A blocking sleep stops the event loop. Use await asyncio.sleep_ms, or a thread for a call that cannot be awaited.'
    }
  ],
  quiz: [
    { q: 'What happens if a coroutine calls time.sleep(2)?', choices: ['Only that coroutine pauses', 'The whole event loop stops for two seconds', 'asyncio moves it to another core', 'It raises an error'], a: 1, why: 'time.sleep blocks the thread, and asyncio has only one. Use await asyncio.sleep instead.' },
    { q: 'Two coroutines both do count += 1 on a shared variable with no await in between. Is a lock needed?', choices: ['Yes, always', 'No: they can only switch at an await', 'Yes, on dual-core chips', 'Only for floats'], a: 1, why: 'Coroutines switch only at an await, so the update runs to completion. A lock is needed only if an await sits inside the stretch that must stay together.' },
    { q: 'asyncio tasks have priorities, so an urgent coroutine pre-empts the others.', a: false, why: 'asyncio has neither priorities nor pre-emption. An urgent job waits for the others to reach an await, so its response time is the longest stretch between awaits.' },
    { q: 'When are MicroPython threads (_thread) the right tool?', choices: ['For every program with two jobs', 'For a blocking call you cannot await', 'To use the second core', 'To avoid locks'], a: 1, why: 'Threads on the ESP32 share one core and need locks. They help when a library blocks and has no async form; otherwise asyncio is simpler and safer.' }
  ],
  applications: [
    'A sensor logger that samples, uploads and blinks a status LED in three coroutines.',
    'A small web server written with asyncio streams that keeps serving while it reads sensors.',
    'A BLE peripheral built with aioble that updates a characteristic every second.',
    'An ESP-NOW receiver using aioespnow that handles messages as they arrive without a polling loop.'
  ],
  sources: [
    'MicroPython documentation, *asyncio*: the library reference and the tutorial (version 1.29).',
    'MicroPython documentation, *_thread* and the ESP32 quick reference (threads and timers).',
    'Python documentation, *asyncio*, for the model that MicroPython follows in reduced form.'
  ],
  sim: 'fr-asyncio'
}
);
